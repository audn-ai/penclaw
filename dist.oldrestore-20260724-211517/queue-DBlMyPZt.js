import { n as channelRouteDedupeKey } from "./channel-route-u-lrE52s.js";
import { t as normalizeChatType } from "./chat-type-BARlA53h.js";
import {
  _ as markFollowupRunEnqueued,
  a as resolveFollowupDeliveryContextKey,
  b as countPendingQueueItems,
  f as trimSummaryElisionsToCap,
  g as isFollowupRunAborted,
  h as completeFollowupRunLifecycle,
  i as rememberFollowupDrainCallback,
  l as getExistingFollowupQueue,
  n as createOverflowSummaryRetrySource,
  o as resolveFollowupReplyAnchor,
  r as kickFollowupDrainIfIdle,
  u as getFollowupQueue,
  x as shouldSkipQueueItem,
  y as applyQueueDropPolicy,
} from "./cleanup-DDlcY-PM.js";
import { n as resolveGlobalDedupeCache } from "./dedupe-BqZ2YTEC.js";
import { n as getLoadedChannelPlugin } from "./registry-mc8oBRx8.js";
import "./plugins-BKdf-5tW.js";
import {
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
//#region src/auto-reply/reply/queue/enqueue.ts
const RECENT_QUEUE_MESSAGE_IDS = resolveGlobalDedupeCache(
  Symbol.for("openclaw.recentQueueMessageIds"),
  {
    ttlMs: 300 * 1e3,
    maxSize: 1e4,
  },
);
function followupRouteIdentityKey(run) {
  return JSON.stringify([
    channelRouteDedupeKey({
      channel: run.originatingChannel,
      to: run.originatingTo,
      accountId: run.originatingAccountId,
      threadId: run.originatingThreadId,
    }),
    resolveFollowupReplyAnchor(run) ?? "",
    run.originatingReplyToMode ?? "",
    normalizeChatType(run.originatingChatType) ?? "",
  ]);
}
function followupMessageRouteIdentityKey(run) {
  return JSON.stringify([
    channelRouteDedupeKey({
      channel: run.originatingChannel,
      to: run.originatingTo,
      accountId: run.originatingAccountId,
      threadId: run.originatingThreadId,
    }),
    normalizeChatType(run.originatingChatType) ?? "",
  ]);
}
function buildRecentMessageIdKey(run, queueKey) {
  const messageId = normalizeOptionalString(run.messageId);
  if (!messageId) return;
  return JSON.stringify(["queue", queueKey, followupMessageRouteIdentityKey(run), messageId]);
}
function isRunAlreadyQueued(run, items, allowPromptFallback = false) {
  const messageId = normalizeOptionalString(run.messageId);
  if (messageId) {
    const messageRouteKey = followupMessageRouteIdentityKey(run);
    return items.some(
      (item) =>
        normalizeOptionalString(item.messageId) === messageId &&
        followupMessageRouteIdentityKey(item) === messageRouteKey,
    );
  }
  if (!allowPromptFallback) return false;
  const routeKey = followupRouteIdentityKey(run);
  return items.some(
    (item) => item.prompt === run.prompt && followupRouteIdentityKey(item) === routeKey,
  );
}
function enqueueFollowupRun(
  key,
  run,
  settings,
  dedupeMode = "message-id",
  runFollowup,
  restartIfIdle = true,
  options = {},
) {
  if (isFollowupRunAborted(run)) return false;
  if (options.position === "front") run.protectFromQueueOverflow = true;
  const queue = getFollowupQueue(key, settings);
  const recentMessageIdKey = dedupeMode !== "none" ? buildRecentMessageIdKey(run, key) : void 0;
  if (recentMessageIdKey && RECENT_QUEUE_MESSAGE_IDS.peek(recentMessageIdKey)) return false;
  const dedupe =
    dedupeMode === "none"
      ? void 0
      : (item, items) => isRunAlreadyQueued(item, items, dedupeMode === "prompt");
  if (
    shouldSkipQueueItem({
      item: run,
      items: queue.items,
      dedupe,
    })
  )
    return false;
  const pendingCount = countPendingQueueItems(queue.items, queue.inFlight);
  if (queue.dropPolicy === "new" && queue.cap > 0 && pendingCount >= queue.cap) {
    completeFollowupRunLifecycle(run);
    return false;
  }
  if (!markFollowupRunEnqueued(run)) return false;
  const shouldEnqueue = applyQueueDropPolicy({
    queue,
    inFlight: queue.inFlight,
    summarize: (item) => normalizeOptionalString(item.summaryLine) || item.prompt.trim(),
    onDrop: (dropped) => {
      if (queue.dropPolicy === "summarize") {
        queue.summarySources.push(...dropped);
        return;
      }
      for (const item of dropped) completeFollowupRunLifecycle(item);
    },
    isProtected: (item) => item.protectFromQueueOverflow === true,
  });
  if (queue.dropPolicy === "summarize") {
    const overflow = queue.summarySources.length - queue.summaryLines.length;
    if (overflow > 0) {
      const removed = queue.summarySources.splice(0, overflow);
      for (const item of removed) {
        const contextKey = resolveFollowupDeliveryContextKey(item);
        const lastElision = queue.summaryElisions.at(-1);
        if (lastElision?.contextKey === contextKey) {
          const compactSource = createOverflowSummaryRetrySource(item);
          lastElision.count += 1;
          lastElision.sources.push(compactSource);
          lastElision.sourceRefs.set(item, compactSource);
          if (queue.activeSummarySources.has(item)) queue.activeSummarySources.add(compactSource);
        } else {
          const compactSource = createOverflowSummaryRetrySource(item);
          queue.summaryElisions.push({
            contextKey,
            count: 1,
            sources: [compactSource],
            sourceRefs: new WeakMap([[item, compactSource]]),
          });
          if (queue.activeSummarySources.has(item)) queue.activeSummarySources.add(compactSource);
        }
        trimSummaryElisionsToCap(queue);
      }
    }
  }
  if (!shouldEnqueue) {
    completeFollowupRunLifecycle(run);
    return false;
  }
  queue.lastEnqueuedAt = Date.now();
  queue.lastRun = run.run;
  run.queueAbortSignal = queue.abortController.signal;
  if (options.position === "front") queue.items.unshift(run);
  else queue.items.push(run);
  if (recentMessageIdKey) RECENT_QUEUE_MESSAGE_IDS.check(recentMessageIdKey);
  if (runFollowup) rememberFollowupDrainCallback(key, runFollowup);
  if (restartIfIdle && !queue.draining) kickFollowupDrainIfIdle(key);
  return true;
}
function getFollowupQueueDepth(key) {
  const queue = getExistingFollowupQueue(key);
  if (!queue) return 0;
  return countPendingQueueItems(queue.items, queue.inFlight);
}
//#endregion
//#region src/auto-reply/reply/queue/normalize.ts
/** Normalizes user-entered queue mode aliases from directives/config. */
function normalizeQueueMode(raw) {
  const cleaned = normalizeOptionalLowercaseString(raw);
  if (!cleaned) return;
  if (cleaned === "interrupt" || cleaned === "interrupts" || cleaned === "abort")
    return "interrupt";
  if (cleaned === "steer" || cleaned === "steering") return "steer";
  if (cleaned === "followup" || cleaned === "follow-ups" || cleaned === "followups")
    return "followup";
  if (cleaned === "collect" || cleaned === "coalesce") return "collect";
}
/** Normalizes persisted legacy queue mode aliases into current queue modes. */
function normalizePersistedQueueMode(raw) {
  const normalized = normalizeQueueMode(raw);
  if (normalized) return normalized;
  const cleaned = normalizeOptionalLowercaseString(raw);
  if (cleaned === "queue" || cleaned === "queued") return "steer";
  if (cleaned === "steer+backlog" || cleaned === "steer-backlog" || cleaned === "steer_backlog")
    return "followup";
}
/** Normalizes queue drop policy aliases from directives/config. */
function normalizeQueueDropPolicy(raw) {
  const cleaned = normalizeOptionalLowercaseString(raw);
  if (!cleaned) return;
  if (cleaned === "old" || cleaned === "oldest") return "old";
  if (cleaned === "new" || cleaned === "newest") return "new";
  if (cleaned === "summarize" || cleaned === "summary") return "summarize";
}
//#endregion
//#region src/auto-reply/reply/queue/settings.ts
/** Resolve per-channel debounce override from debounceMsByChannel map. */
function resolveChannelDebounce(byChannel, channelKey) {
  if (!channelKey || !byChannel) return;
  const value = byChannel[channelKey];
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : void 0;
}
function resolveQueueSettings$1(params) {
  const channelKey = normalizeOptionalLowercaseString(params.channel);
  const queueCfg = params.cfg.messages?.queue;
  const providerModeRaw =
    channelKey && queueCfg?.byChannel ? queueCfg.byChannel[channelKey] : void 0;
  const resolvedMode =
    params.inlineMode ??
    normalizePersistedQueueMode(params.sessionEntry?.queueMode) ??
    normalizeQueueMode(providerModeRaw) ??
    normalizeQueueMode(queueCfg?.mode) ??
    "steer";
  const debounceRaw =
    params.inlineOptions?.debounceMs ??
    params.sessionEntry?.queueDebounceMs ??
    resolveChannelDebounce(queueCfg?.debounceMsByChannel, channelKey) ??
    params.pluginDebounceMs ??
    queueCfg?.debounceMs ??
    500;
  const capRaw = params.inlineOptions?.cap ?? params.sessionEntry?.queueCap ?? queueCfg?.cap ?? 20;
  const dropRaw =
    params.inlineOptions?.dropPolicy ??
    params.sessionEntry?.queueDrop ??
    normalizeQueueDropPolicy(queueCfg?.drop) ??
    "summarize";
  return {
    mode: resolvedMode,
    debounceMs: typeof debounceRaw === "number" ? Math.max(0, debounceRaw) : void 0,
    cap: typeof capRaw === "number" ? Math.max(1, Math.floor(capRaw)) : void 0,
    dropPolicy: dropRaw,
  };
}
//#endregion
//#region src/auto-reply/reply/queue/settings-runtime.ts
/** Resolves plugin-provided debounce defaults for a channel queue. */
function resolvePluginDebounce(channelKey) {
  if (!channelKey) return;
  const value = getLoadedChannelPlugin(channelKey)?.defaults?.queue?.debounceMs;
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : void 0;
}
/** Resolves queue settings with channel plugin defaults layered into core config. */
function resolveQueueSettings(params) {
  const channelKey = normalizeOptionalLowercaseString(params.channel);
  return resolveQueueSettings$1({
    ...params,
    pluginDebounceMs: params.pluginDebounceMs ?? resolvePluginDebounce(channelKey),
  });
}
//#endregion
export {
  enqueueFollowupRun as a,
  normalizeQueueMode as i,
  resolveQueueSettings$1 as n,
  getFollowupQueueDepth as o,
  normalizeQueueDropPolicy as r,
  resolveQueueSettings as t,
};
