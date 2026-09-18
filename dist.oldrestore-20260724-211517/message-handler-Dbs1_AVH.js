import {
  a as resolveDiscordChannelParentSafe,
  n as resolveDiscordChannelInfoSafe,
  r as resolveDiscordChannelNameSafe,
  t as resolveDiscordChannelIdSafe,
} from "./channel-access-C12aDZ0p.js";
import {
  o as createChannelInboundDebouncer,
  s as shouldDebounceTextInbound,
} from "./channel-inbound-vhkYEe2n.js";
import { n as createChannelRunQueue } from "./channel-lifecycle.core-BZ1pethE.js";
import { r as logVerbose, t as danger } from "./globals-CNUzHTcU.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import "./number-runtime-B-n-wjMn.js";
import "./runtime-env-D0V-7Gqz.js";
import {
  c as hasDiscordMessageStickers,
  d as resolveDiscordMessageChannelId,
  r as resolveDiscordMessageText,
} from "./message-utils-prcoeLfb.js";
import { p as finiteSecondsToTimerSafeMilliseconds } from "./number-coercion-CJQ8TR--.js";
import "./reply-reference-BM3zoGu5.js";
import "./channel-outbound-DlkFd7rO.js";
import { n as resolveChannelSourceReplyDeliveryMode } from "./reply-pipeline-uYpC1TSz.js";
import { r as resolveBatchedReplyThreadingPolicy } from "./reply-threading-MGgPZ60G.js";
import {
  a as commitDiscordInboundReplay,
  i as claimDiscordInboundReplay,
  n as DiscordRetryableInboundError,
  o as createDiscordInboundReplayGuard,
  r as buildDiscordInboundReplayKey,
  s as releaseDiscordInboundReplay,
  t as createDiscordReplyTypingFeedback,
} from "./reply-typing-feedback-CjAhBXbc.js";
import { i as resolveOpenProviderRuntimeGroupPolicy } from "./runtime-group-policy-BEjP88cf.js";
//#region extensions/discord/src/monitor/inbound-job.ts
function resolveDiscordInboundJobQueueKey(ctx) {
  const sessionKey = ctx.route.sessionKey?.trim();
  if (sessionKey) return sessionKey;
  const baseSessionKey = ctx.baseSessionKey?.trim();
  if (baseSessionKey) return baseSessionKey;
  return ctx.messageChannelId;
}
function buildDiscordInboundJob(ctx, options) {
  const {
    runtime,
    abortSignal,
    guildHistories,
    client,
    threadBindings,
    replyTypingFeedback,
    discordRestFetch,
    message,
    data,
    threadChannel,
    ...payload
  } = ctx;
  const sanitizedMessage = sanitizeDiscordInboundMessage(message);
  return {
    queueKey: resolveDiscordInboundJobQueueKey(ctx),
    payload: {
      ...payload,
      message: sanitizedMessage,
      data: {
        ...data,
        message: sanitizedMessage,
      },
      threadChannel: normalizeDiscordThreadChannel(threadChannel),
    },
    runtime: {
      runtime,
      abortSignal,
      guildHistories,
      client,
      threadBindings,
      replyTypingFeedback,
      discordRestFetch,
    },
    replayKeys: options?.replayKeys ? [...options.replayKeys] : void 0,
  };
}
function materializeDiscordInboundJob(job, abortSignal) {
  return {
    ...job.payload,
    ...job.runtime,
    abortSignal: abortSignal ?? job.runtime.abortSignal,
  };
}
function sanitizeDiscordInboundMessage(message) {
  const descriptors = Object.getOwnPropertyDescriptors(message);
  delete descriptors.channel;
  return Object.create(Object.getPrototypeOf(message), descriptors);
}
function normalizeDiscordThreadChannel(threadChannel) {
  if (!threadChannel) return null;
  const channelInfo = resolveDiscordChannelInfoSafe(threadChannel);
  const parent = resolveDiscordChannelParentSafe(threadChannel);
  return {
    id: threadChannel.id,
    name: channelInfo.name,
    parentId: channelInfo.parentId,
    parent: parent
      ? {
          id: resolveDiscordChannelIdSafe(parent),
          name: resolveDiscordChannelNameSafe(parent),
        }
      : void 0,
    ownerId: channelInfo.ownerId,
  };
}
//#endregion
//#region extensions/discord/src/monitor/message-handler.batch-gate.ts
function applyImplicitReplyBatchGate(ctx, replyToMode, isBatched) {
  const replyThreading = resolveBatchedReplyThreadingPolicy(replyToMode, isBatched);
  if (!replyThreading) return;
  ctx.ReplyThreading = replyThreading;
}
//#endregion
//#region extensions/discord/src/monitor/message-handler.reply-typing-policy.ts
function resolveDiscordSourceReplyDeliveryMode(ctx) {
  return resolveChannelSourceReplyDeliveryMode({
    cfg: ctx.cfg,
    ctx: {
      ChatType: ctx.isDirectMessage
        ? "direct"
        : ctx.isGroupDm
          ? "group"
          : ctx.isGuildMessage
            ? "channel"
            : void 0,
      InboundEventKind: ctx.inboundEventKind,
    },
  });
}
function resolveDiscordAcceptedTypingPrestart(ctx) {
  const sourceReplyDeliveryMode = resolveDiscordSourceReplyDeliveryMode(ctx);
  if (ctx.abortSignal?.aborted)
    return {
      sourceReplyDeliveryMode,
      shouldPrestart: false,
      reason: "aborted",
    };
  if (!ctx.messageText.trim())
    return {
      sourceReplyDeliveryMode,
      shouldPrestart: false,
      reason: "empty",
    };
  if (ctx.inboundEventKind === "room_event")
    return {
      sourceReplyDeliveryMode,
      shouldPrestart: false,
      reason: "room-event",
    };
  const configuredTypingMode = ctx.cfg.session?.typingMode ?? ctx.cfg.agents?.defaults?.typingMode;
  if (configuredTypingMode !== void 0)
    return {
      sourceReplyDeliveryMode,
      shouldPrestart: configuredTypingMode === "instant",
      reason: configuredTypingMode === "instant" ? "configured-instant" : "configured-not-instant",
    };
  if (sourceReplyDeliveryMode === "message_tool_only")
    return {
      sourceReplyDeliveryMode,
      shouldPrestart: true,
      reason: "tool-only",
    };
  if (!ctx.isGuildMessage && !ctx.isGroupDm)
    return {
      sourceReplyDeliveryMode,
      shouldPrestart: true,
      reason: "direct",
    };
  if (ctx.effectiveWasMentioned)
    return {
      sourceReplyDeliveryMode,
      shouldPrestart: true,
      reason: "mentioned-group",
    };
  return {
    sourceReplyDeliveryMode,
    shouldPrestart: false,
    reason: "defer-to-message",
  };
}
//#endregion
//#region extensions/discord/src/monitor/message-run-queue.ts
const loadMessageProcessRuntime = createLazyRuntimeModule(
  () => import("./message-handler.process-DnmVQhdt.js"),
);
async function processDiscordQueuedMessage(params) {
  const processDiscordMessageImpl =
    params.testing?.processDiscordMessage ??
    (await loadMessageProcessRuntime()).processDiscordMessage;
  const abortSignal =
    params.job.runtime.abortSignal && params.lifecycleSignal
      ? AbortSignal.any([params.job.runtime.abortSignal, params.lifecycleSignal])
      : (params.job.runtime.abortSignal ?? params.lifecycleSignal);
  try {
    await processDiscordMessageImpl(materializeDiscordInboundJob(params.job, abortSignal));
    await commitDiscordInboundReplay({
      replayKeys: params.job.replayKeys,
      replayGuard: params.replayGuard,
    });
  } catch (error) {
    if (error instanceof DiscordRetryableInboundError)
      releaseDiscordInboundReplay({
        replayKeys: params.job.replayKeys,
        error,
        replayGuard: params.replayGuard,
      });
    else
      await commitDiscordInboundReplay({
        replayKeys: params.job.replayKeys,
        replayGuard: params.replayGuard,
      });
    throw error;
  }
}
function cleanupSkippedDiscordQueuedMessage(params) {
  try {
    params.job.runtime.replyTypingFeedback?.onCleanup?.();
  } finally {
    releaseDiscordInboundReplay({
      replayKeys: params.job.replayKeys,
      error: new DiscordRetryableInboundError("discord queued run skipped before processing"),
      replayGuard: params.replayGuard,
    });
  }
}
function createDiscordMessageRunQueue(params) {
  const replayGuard = params.replayGuard ?? createDiscordInboundReplayGuard();
  const skippedCleanup = /* @__PURE__ */ new Set();
  const runQueue = createChannelRunQueue({
    setStatus: params.setStatus,
    abortSignal: params.abortSignal,
    onError: (error) => {
      params.runtime.error(danger(`discord message run failed: ${String(error)}`));
    },
  });
  let lifecycleActive = !params.abortSignal?.aborted;
  const cleanupSkippedQueuedMessages = () => {
    if (!lifecycleActive && skippedCleanup.size === 0) return;
    lifecycleActive = false;
    const cleanups = [...skippedCleanup];
    skippedCleanup.clear();
    for (const cleanup of cleanups) cleanup();
  };
  if (params.abortSignal?.aborted) cleanupSkippedQueuedMessages();
  else params.abortSignal?.addEventListener("abort", cleanupSkippedQueuedMessages, { once: true });
  return {
    enqueue(job) {
      const cleanupSkipped = () => {
        cleanupSkippedDiscordQueuedMessage({
          job,
          replayGuard,
        });
      };
      if (!lifecycleActive) {
        cleanupSkipped();
        return;
      }
      skippedCleanup.add(cleanupSkipped);
      runQueue.enqueue(job.queueKey, async ({ lifecycleSignal }) => {
        skippedCleanup.delete(cleanupSkipped);
        await processDiscordQueuedMessage({
          job,
          lifecycleSignal,
          replayGuard,
          testing: params.testing,
        });
      });
    },
    deactivate() {
      runQueue.deactivate();
      cleanupSkippedQueuedMessages();
    },
  };
}
//#endregion
//#region extensions/discord/src/monitor/message-handler.ts
const loadMessagePreflightRuntime = createLazyRuntimeModule(
  () => import("./message-handler.preflight-CZIn-Ivj.js"),
);
function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}
function startAcceptedTypingFeedback(params) {
  const { ctx, createFeedback, dedupeKey, activeFeedback } = params;
  if (!resolveDiscordAcceptedTypingPrestart(ctx).shouldPrestart) return;
  const channelId = ctx.messageChannelId.trim();
  if (activeFeedback.get(dedupeKey)) return;
  const replyTypingFeedback =
    ctx.replyTypingFeedback ??
    (createFeedback ?? createDiscordReplyTypingFeedback)({
      cfg: ctx.cfg,
      token: ctx.token,
      accountId: ctx.accountId,
      channelId: ctx.messageChannelId,
      log: logVerbose,
      keepaliveIntervalMs: finiteSecondsToTimerSafeMilliseconds(
        ctx.cfg.agents?.defaults?.typingIntervalSeconds ?? ctx.cfg.session?.typingIntervalSeconds,
      ),
    });
  const cleanup = replyTypingFeedback.onCleanup;
  replyTypingFeedback.onCleanup = () => {
    cleanup?.();
    if (activeFeedback.get(dedupeKey)?.feedback === replyTypingFeedback)
      activeFeedback.delete(dedupeKey);
  };
  activeFeedback.set(dedupeKey, {
    channelId,
    feedback: replyTypingFeedback,
  });
  ctx.replyTypingFeedback = replyTypingFeedback;
  replyTypingFeedback.onReplyStart().catch((err) => {
    logVerbose(`discord accepted typing feedback failed: ${String(err)}`);
  });
  return replyTypingFeedback;
}
function createDiscordMessageHandler(params) {
  const { groupPolicy } = resolveOpenProviderRuntimeGroupPolicy({
    providerConfigPresent: params.cfg.channels?.discord !== void 0,
    groupPolicy: params.discordConfig?.groupPolicy,
    defaultGroupPolicy: params.cfg.channels?.defaults?.groupPolicy,
  });
  const ackReactionScope =
    params.discordConfig?.ackReactionScope ??
    params.cfg.messages?.ackReactionScope ??
    "group-mentions";
  const preflightDiscordMessageImpl = params.testing?.preflightDiscordMessage;
  const replayGuard = createDiscordInboundReplayGuard();
  const prestartedTypingFeedback = /* @__PURE__ */ new Map();
  const messageRunQueue = createDiscordMessageRunQueue({
    runtime: params.runtime,
    setStatus: params.setStatus,
    abortSignal: params.abortSignal,
    replayGuard,
    testing: params.testing,
  });
  const { debouncer } = createChannelInboundDebouncer({
    cfg: params.cfg,
    channel: "discord",
    buildKey: (entry) => {
      const message = entry.data.message;
      const authorId = entry.data.author?.id;
      if (!message || !authorId) return null;
      const channelId = resolveDiscordMessageChannelId({
        message,
        eventChannelId: entry.data.channel_id,
      });
      if (!channelId) return null;
      return `discord:${params.accountId}:${channelId}:${authorId}`;
    },
    shouldDebounce: (entry) => {
      const message = entry.data.message;
      if (!message) return false;
      return shouldDebounceTextInbound({
        text: resolveDiscordMessageText(message, { includeForwarded: false }),
        cfg: params.cfg,
        hasMedia:
          (message.attachments && message.attachments.length > 0) ||
          hasDiscordMessageStickers(message),
      });
    },
    onFlush: async (entries) => {
      const last = entries.at(-1);
      if (!last) return;
      const replayKeys = entries.map((entry) => entry.replayKey).filter(isNonEmptyString);
      const abortSignal = last.abortSignal;
      if (abortSignal?.aborted) {
        releaseDiscordInboundReplay({
          replayKeys,
          error: abortSignal.reason,
          replayGuard,
        });
        return;
      }
      try {
        if (entries.length === 1) {
          const ctx = await (
            preflightDiscordMessageImpl ??
            (await loadMessagePreflightRuntime()).preflightDiscordMessage
          )({
            ...params,
            ackReactionScope,
            groupPolicy,
            abortSignal,
            data: last.data,
            client: last.client,
          });
          if (!ctx) {
            await commitDiscordInboundReplay({
              replayKeys,
              replayGuard,
            });
            return;
          }
          const queueKey = resolveDiscordInboundJobQueueKey(ctx);
          startAcceptedTypingFeedback({
            ctx,
            createFeedback: params.testing?.createReplyTypingFeedback,
            dedupeKey: queueKey,
            activeFeedback: prestartedTypingFeedback,
          });
          applyImplicitReplyBatchGate(ctx, params.replyToMode, false);
          messageRunQueue.enqueue(buildDiscordInboundJob(ctx, { replayKeys }));
          return;
        }
        const combinedBaseText = entries
          .map((entry) =>
            resolveDiscordMessageText(entry.data.message, { includeForwarded: false }),
          )
          .filter(Boolean)
          .join("\n");
        const syntheticMessage = Object.create(Object.getPrototypeOf(last.data.message), {
          ...Object.getOwnPropertyDescriptors(last.data.message),
          content: {
            value: combinedBaseText,
            enumerable: true,
            configurable: true,
          },
          attachments: {
            value: [],
            enumerable: true,
            configurable: true,
          },
          message_snapshots: {
            value: last.data.message.message_snapshots,
            enumerable: true,
            configurable: true,
          },
          messageSnapshots: {
            value: last.data.message.messageSnapshots,
            enumerable: true,
            configurable: true,
          },
          rawData: {
            value: { ...last.data.message.rawData },
            enumerable: true,
            configurable: true,
          },
        });
        const syntheticData = {
          ...last.data,
          message: syntheticMessage,
        };
        const ctx = await (
          preflightDiscordMessageImpl ??
          (await loadMessagePreflightRuntime()).preflightDiscordMessage
        )({
          ...params,
          ackReactionScope,
          groupPolicy,
          abortSignal,
          data: syntheticData,
          client: last.client,
        });
        if (!ctx) {
          await commitDiscordInboundReplay({
            replayKeys,
            replayGuard,
          });
          return;
        }
        const queueKey = resolveDiscordInboundJobQueueKey(ctx);
        startAcceptedTypingFeedback({
          ctx,
          createFeedback: params.testing?.createReplyTypingFeedback,
          dedupeKey: queueKey,
          activeFeedback: prestartedTypingFeedback,
        });
        applyImplicitReplyBatchGate(ctx, params.replyToMode, true);
        if (entries.length > 1) {
          const ids = entries.map((entry) => entry.data.message?.id).filter(isNonEmptyString);
          if (ids.length > 0) {
            const ctxBatch = ctx;
            ctxBatch.MessageSids = ids;
            ctxBatch.MessageSidFirst = ids[0];
            ctxBatch.MessageSidLast = ids[ids.length - 1];
          }
        }
        messageRunQueue.enqueue(buildDiscordInboundJob(ctx, { replayKeys }));
      } catch (error) {
        if (error instanceof DiscordRetryableInboundError)
          releaseDiscordInboundReplay({
            replayKeys,
            error,
            replayGuard,
          });
        else
          await commitDiscordInboundReplay({
            replayKeys,
            replayGuard,
          });
        throw error;
      }
    },
    onError: (err) => {
      params.runtime.error(danger(`discord debounce flush failed: ${String(err)}`));
    },
  });
  const handler = async (data, client, options) => {
    try {
      if (options?.abortSignal?.aborted) return;
      const msgAuthorId = data.message?.author?.id ?? data.author?.id;
      if (params.botUserId && msgAuthorId === params.botUserId) return;
      const replayKey = buildDiscordInboundReplayKey({
        accountId: params.accountId,
        data,
      });
      if (
        !(await claimDiscordInboundReplay({
          replayKey,
          replayGuard,
        }))
      )
        return;
      await debouncer.enqueue({
        data,
        client,
        abortSignal: options?.abortSignal,
        replayKey: replayKey ?? void 0,
      });
    } catch (err) {
      params.runtime.error(danger(`handler failed: ${String(err)}`));
    }
  };
  handler.deactivate = messageRunQueue.deactivate;
  return handler;
}
//#endregion
export { createDiscordMessageHandler as t };
