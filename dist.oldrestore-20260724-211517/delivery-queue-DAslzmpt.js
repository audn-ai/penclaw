import { n as resolveOutboundChannelMessageAdapter } from "./channel-resolution-B-NyvoRP.js";
import {
  n as stripTargetKindPrefix,
  r as stripTargetProviderPrefix,
  t as resolveTargetPrefixedChannel,
} from "./channel-target-prefix-Co3r_2wp.js";
import {
  i as isOutboundDeliveryError,
  r as countPhysicalOutboundSends,
} from "./deliver-types-eQDro8Up.js";
import {
  a as loadDeliveryQueueEntry,
  c as upsertDeliveryQueueEntry,
  i as loadDeliveryQueueEntries,
  n as deleteDeliveryQueueEntry,
  o as moveDeliveryQueueEntryToFailed,
  r as failPendingDeliveryQueueEntry,
  s as updateDeliveryQueueEntry,
} from "./delivery-queue-sqlite-QNG3Gd9f.js";
import {
  a as isProvenDeliveryNotSentError,
  i as getErrnoCode,
  n as computeBackoffMs,
  o as releaseRecoveryEntry,
  r as createRecoveryReplayPacer,
  t as claimRecoveryEntry,
} from "./delivery-recovery.shared-DWd08Xjm.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import {
  n as hasTrustedMessageAuditListeners,
  t as emitTrustedMessageAuditEvent,
} from "./message-audit-events-CED2DE_D.js";
import {
  C as resolveExpiresAtMsFromDurationMs,
  S as resolveDateTimestampMs,
} from "./number-coercion-CJQ8TR--.js";
import { a as generateSecureUuid } from "./secure-random-Ds4AFLgz.js";
import {
  d as parseSessionDeliveryRoute,
  s as normalizeSessionPeerId,
} from "./session-key-utils-B8sNp9l4.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region src/infra/outbound/deferred-delivery-admission.ts
function resolveDeferredDeliveryAdmission(params) {
  return (
    resolveOutboundChannelMessageAdapter({
      channel: params.channel,
      cfg: params.cfg,
      allowBootstrap: true,
    })?.durableFinal?.admitDeferredDelivery?.(params) ?? { status: "allowed" }
  );
}
//#endregion
//#region src/infra/outbound/delivery-commit-hooks.ts
const log = createSubsystemLogger("outbound/deliver");
const outboundDeliveryCommitHooks = /* @__PURE__ */ new WeakMap();
/** Attaches an after-commit hook without changing the delivery result shape. */
function attachOutboundDeliveryCommitHook(result, hook) {
  if (!hook) return result;
  const hooks = outboundDeliveryCommitHooks.get(result) ?? [];
  hooks.push(hook);
  outboundDeliveryCommitHooks.set(result, hooks);
  return result;
}
/** Runs after-commit hooks for delivered results while isolating hook failures. */
async function runOutboundDeliveryCommitHooks(results) {
  for (const result of results)
    for (const hook of outboundDeliveryCommitHooks.get(result) ?? [])
      try {
        await hook();
      } catch (err) {
        log.warn("Plugin message adapter after-commit hook failed.", {
          channel: result.channel,
          messageId: result.messageId,
          error: formatErrorMessage(err),
        });
      }
}
/** Type guard for batched outbound delivery results crossing loose boundaries. */
function isOutboundDeliveryResultArray(value) {
  return Array.isArray(value);
}
//#endregion
//#region src/infra/outbound/delivery-queue-storage.ts
const QUEUE_NAME = "outbound";
function queuedDeliveryMetadata(entry) {
  return {
    entryKind: "outbound",
    sessionKey: entry.session?.key,
    channel: entry.channel,
    target: entry.to,
    accountId: entry.accountId,
  };
}
/** Persist a delivery entry before attempting send. Returns the entry ID. */
async function enqueueDelivery(params, stateDir) {
  const id = generateSecureUuid();
  const entry = {
    id,
    enqueuedAt: Date.now(),
    channel: params.channel,
    to: params.to,
    accountId: params.accountId,
    queuePolicy: params.queuePolicy,
    requireUnknownSendReconciliation: params.requireUnknownSendReconciliation,
    payloads: params.payloads,
    renderedBatchPlan: params.renderedBatchPlan,
    threadId: params.threadId,
    replyToId: params.replyToId,
    replyToMode: params.replyToMode,
    formatting: params.formatting,
    identity: params.identity,
    bestEffort: params.bestEffort,
    gifPlayback: params.gifPlayback,
    forceDocument: params.forceDocument,
    replyPayloadSendingHook: params.replyPayloadSendingHook,
    silent: params.silent,
    mirror: params.mirror,
    session: params.session,
    gatewayClientScopes: params.gatewayClientScopes,
    retryCount: 0,
  };
  upsertDeliveryQueueEntry({
    queueName: QUEUE_NAME,
    entry,
    metadata: queuedDeliveryMetadata(entry),
    stateDir,
  });
  return id;
}
/** Remove a successfully delivered entry from the queue. */
async function ackDelivery(id, stateDir) {
  deleteDeliveryQueueEntry(QUEUE_NAME, id, stateDir);
}
/** Update a queue entry after a failed delivery attempt. */
async function failDelivery(id, error, stateDir) {
  updateQueuedDelivery(id, stateDir, (entry) => ({
    ...entry,
    retryCount: entry.retryCount + 1,
    lastAttemptAt: Date.now(),
    lastError: error,
  }));
}
/** Record a failed attempt whose retry provably cannot duplicate a recipient-visible send. */
async function failDeliveryBeforePlatformSend(id, error, stateDir) {
  updateQueuedDelivery(id, stateDir, (entry) => ({
    ...entry,
    retryCount: entry.retryCount + 1,
    lastAttemptAt: Date.now(),
    lastError: error,
    platformSendStartedAt: void 0,
    recoveryState: void 0,
  }));
}
/** Record a failed attempt without losing evidence that platform delivery may have completed. */
async function failDeliveryAfterPlatformSend(id, error, stateDir) {
  updateQueuedDelivery(id, stateDir, (entry) => ({
    ...entry,
    retryCount: entry.retryCount + 1,
    lastAttemptAt: Date.now(),
    lastError: error,
    platformSendStartedAt: entry.platformSendStartedAt ?? Date.now(),
    recoveryState: "unknown_after_send",
  }));
}
function updateQueuedDelivery(id, stateDir, update) {
  updateDeliveryQueueEntry(QUEUE_NAME, id, stateDir, (entry) => update(entry));
}
async function markDeliveryPlatformSendAttemptStarted(id, stateDir, route) {
  updateQueuedDelivery(id, stateDir, (entry) => ({
    ...entry,
    platformSendStartedAt: entry.platformSendStartedAt ?? Date.now(),
    ...(route && "replyToId" in route ? { effectiveReplyToId: route.replyToId ?? null } : {}),
    recoveryState: "send_attempt_started",
  }));
}
/** Refresh the attempt timestamp before recipient-visible or finalizing platform I/O. */
async function markDeliveryPlatformSendDispatched(id, stateDir, route) {
  updateQueuedDelivery(id, stateDir, (entry) => ({
    ...entry,
    platformSendStartedAt: Date.now(),
    ...(route && "replyToId" in route ? { effectiveReplyToId: route.replyToId ?? null } : {}),
    recoveryState: "send_attempt_started",
  }));
}
async function markDeliveryPlatformOutcomeUnknown(id, stateDir) {
  updateQueuedDelivery(id, stateDir, (entry) => ({
    ...entry,
    platformSendStartedAt: entry.platformSendStartedAt ?? Date.now(),
    recoveryState: "unknown_after_send",
  }));
}
/** Load a single pending delivery entry by ID from the queue directory. */
async function loadPendingDelivery(id, stateDir) {
  return loadDeliveryQueueEntry(QUEUE_NAME, id, stateDir);
}
/** Load all pending delivery entries from the queue. */
async function loadPendingDeliveries(stateDir) {
  return loadDeliveryQueueEntries(QUEUE_NAME, stateDir);
}
/** Move a queue entry out of the pending retry set. */
async function moveToFailed(id, stateDir) {
  moveDeliveryQueueEntryToFailed(QUEUE_NAME, id, stateDir);
}
/** Conditionally dead-letter a freshly re-read pending entry without a claimed state. */
async function failPendingDelivery(params, stateDir) {
  return failPendingDeliveryQueueEntry({
    queueName: QUEUE_NAME,
    ...params,
    stateDir,
  });
}
//#endregion
//#region src/infra/outbound/outbound-audit.ts
function outboundQueueAuditSourceId(queueId, payloadIndex) {
  return `message:outbound:queue:${queueId}:payload:${payloadIndex}`;
}
function outcomesByPayload(outcomes) {
  const indexed = /* @__PURE__ */ new Map();
  for (const outcome of outcomes) {
    const history = indexed.get(outcome.index) ?? [];
    history.push(outcome);
    indexed.set(outcome.index, history);
  }
  return indexed;
}
function sentResults(history) {
  return history.findLast((outcome) => outcome.status === "sent")?.results ?? [];
}
function hasUnknownAdapterSideEffect(history) {
  return history.some(
    (outcome) =>
      outcome.status === "suppressed" && outcome.reason === "adapter_returned_no_identity",
  );
}
function completedOutboundAuditTerminals(params) {
  const indexed = outcomesByPayload(params.payloadOutcomes);
  return Array.from({ length: params.payloadCount }, (_, payloadIndex) => {
    const history = indexed.get(payloadIndex) ?? [];
    const latest = history.at(-1);
    if (hasUnknownAdapterSideEffect(history))
      return {
        payloadIndex,
        terminal: {
          outcome: "unknown",
          failureStage: "platform_send",
        },
      };
    if (latest?.status === "sent")
      return {
        payloadIndex,
        terminal: {
          outcome: "sent",
          results: latest.results,
          ...(latest.deliveryKind ? { deliveryKind: latest.deliveryKind } : {}),
        },
      };
    if (latest?.status === "suppressed") {
      if (latest.reason === "adapter_returned_no_identity")
        return {
          payloadIndex,
          terminal: {
            outcome: "unknown",
            failureStage: "platform_send",
          },
        };
      return {
        payloadIndex,
        terminal: {
          outcome: "suppressed",
          reasonCode: latest.reason,
        },
      };
    }
    if (params.payloadCount === 1 && params.results.length > 0)
      return {
        payloadIndex,
        terminal: {
          outcome: "sent",
          results: params.results,
        },
      };
    return {
      payloadIndex,
      terminal: {
        outcome: "suppressed",
        reasonCode: "no_visible_payload",
      },
    };
  });
}
function failedOutboundAuditTerminals(params) {
  const indexed = outcomesByPayload(params.payloadOutcomes);
  return Array.from({ length: params.payloadCount }, (_, payloadIndex) => {
    const history = indexed.get(payloadIndex) ?? [];
    const latest = history.at(-1);
    if (hasUnknownAdapterSideEffect(history))
      return {
        payloadIndex,
        terminal: {
          outcome: "unknown",
          failureStage: "platform_send",
        },
      };
    if (latest?.status === "sent")
      return {
        payloadIndex,
        terminal: {
          outcome: "sent",
          results: latest.results,
          ...(latest.deliveryKind ? { deliveryKind: latest.deliveryKind } : {}),
        },
      };
    if (latest?.status === "suppressed") {
      if (latest.reason === "adapter_returned_no_identity")
        return {
          payloadIndex,
          terminal: {
            outcome: "unknown",
            failureStage: "platform_send",
          },
        };
      return {
        payloadIndex,
        terminal: {
          outcome: "suppressed",
          reasonCode: latest.reason,
        },
      };
    }
    const failedResults = latest?.status === "failed" ? (latest.results ?? []) : [];
    const payloadResults = failedResults.length > 0 ? failedResults : sentResults(history);
    const fallbackResults = params.payloadCount === 1 ? params.results : [];
    const results = payloadResults.length > 0 ? payloadResults : fallbackResults;
    return {
      payloadIndex,
      terminal: {
        outcome: "failed",
        failureStage: latest?.status === "failed" ? latest.stage : params.failureStage,
        results,
        sentBeforeError:
          results.length > 0 || (latest?.status === "failed" && latest.sentBeforeError),
        ...(latest?.status === "failed" && latest.deliveryKind
          ? { deliveryKind: latest.deliveryKind }
          : {}),
      },
    };
  });
}
function uniformOutboundAuditTerminals(payloadCount, terminal) {
  return Array.from({ length: payloadCount }, (_, payloadIndex) => ({
    payloadIndex,
    terminal,
  }));
}
const TARGET_KIND_TO_ROUTE_KINDS = {
  channel: ["channel"],
  conversation: ["channel"],
  thread: ["channel"],
  group: ["group"],
  room: ["group"],
  direct: ["direct", "dm"],
  dm: ["direct", "dm"],
  user: ["direct", "dm"],
};
const TARGET_PREFIX_RE = /^\s*([a-z][a-z0-9_-]*):/i;
function resolveOutboundTargetFacts(context) {
  const channel = context.channel.toLowerCase();
  const aliasChannel = resolveTargetPrefixedChannel(context.to);
  const targetPrefix = TARGET_PREFIX_RE.exec(context.to)?.[1];
  const providerPrefixes =
    aliasChannel === channel
      ? [context.channel, targetPrefix ?? context.channel]
      : [context.channel];
  const withoutProvider = stripTargetProviderPrefix(context.to, ...providerPrefixes);
  const kindPrefix = TARGET_PREFIX_RE.exec(withoutProvider)?.[1]?.toLowerCase();
  const allowedRouteKinds = kindPrefix ? TARGET_KIND_TO_ROUTE_KINDS[kindPrefix] : void 0;
  return {
    conversationId: stripTargetKindPrefix(withoutProvider, Object.keys(TARGET_KIND_TO_ROUTE_KINDS)),
    withoutProvider,
    allowedRouteKinds,
  };
}
/** True when a parsed session route provably names this delivery's destination. */
function routeNamesDestination(route, context) {
  if (!route || route.channel !== context.channel.toLowerCase()) return false;
  const { conversationId, withoutProvider, allowedRouteKinds } =
    resolveOutboundTargetFacts(context);
  if (allowedRouteKinds && !allowedRouteKinds.includes(route.peerKind)) return false;
  return [context.to, withoutProvider, conversationId].some((candidate) => {
    const normalized = normalizeSessionPeerId({
      channel: route.channel,
      peerKind: route.peerKind,
      peerId: candidate,
    });
    return normalized !== "" && normalized.toLowerCase() === route.peerId.toLowerCase();
  });
}
function resolveConversationKind(context) {
  if (context.session?.conversationKind) return context.session.conversationKind;
  const routeCandidates = [
    context.session?.policyKey,
    context.session?.key,
    context.mirror?.sessionKey,
  ];
  for (const candidate of routeCandidates) {
    const route = parseSessionDeliveryRoute(candidate);
    if (routeNamesDestination(route, context))
      return route.peerKind === "dm" || route.peerKind === "direct" ? "direct" : route.peerKind;
  }
  if (context.session?.conversationType === "group" || context.mirror?.isGroup === true)
    return "group";
  return "unknown";
}
function firstIdentifier(...values) {
  for (const value of values) {
    const normalized = value?.trim();
    if (normalized && normalized !== "unknown" && normalized !== "suppressed") return normalized;
  }
}
function resolveResultIdentifiers(context, results) {
  const last = results.at(-1);
  const conversationId =
    firstIdentifier(
      last?.conversationId,
      last?.chatId,
      last?.channelId,
      last?.roomId,
      last?.toJid,
    ) ?? resolveOutboundTargetFacts(context).conversationId;
  const messageId = firstIdentifier(
    last?.messageId,
    last?.receipt?.primaryPlatformMessageId,
    last?.receipt?.platformMessageIds.at(-1),
  );
  return {
    ...(conversationId ? { conversationId } : {}),
    ...(messageId ? { messageId } : {}),
  };
}
/**
 * Emits only after the owning lifecycle has made the delivery terminal.
 * Queue retries share one source id, so recovery cannot duplicate the final row.
 */
function emitOutboundAuditTerminal(params) {
  try {
    const { context, terminal } = params;
    const results = terminal.results ?? [];
    const agentId = context.session?.agentId ?? context.mirror?.agentId;
    const identifiers = resolveResultIdentifiers(context, results);
    const sentBeforeError =
      (terminal.outcome === "failed" || terminal.outcome === "unknown") &&
      terminal.sentBeforeError === true;
    const terminalFields =
      terminal.outcome === "sent"
        ? {
            status: "succeeded",
            outcome: "sent",
            ...(terminal.deliveryKind ? { deliveryKind: terminal.deliveryKind } : {}),
          }
        : terminal.outcome === "suppressed"
          ? {
              status: "blocked",
              outcome: "suppressed",
              reasonCode: terminal.reasonCode,
            }
          : terminal.outcome === "unknown"
            ? {
                status: "unknown",
                outcome: "unknown",
                failureStage: terminal.failureStage,
              }
            : {
                status: "failed",
                outcome: "failed",
                errorCode:
                  results.length > 0 || sentBeforeError
                    ? "message_delivery_partial_failure"
                    : "message_delivery_failed",
                failureStage: terminal.failureStage,
                ...(terminal.deliveryKind ? { deliveryKind: terminal.deliveryKind } : {}),
              };
    emitTrustedMessageAuditEvent({
      ...(params.sourceId ? { sourceId: params.sourceId } : {}),
      kind: "message",
      action: "message.outbound.finished",
      occurredAt: Date.now(),
      ...terminalFields,
      actorType: agentId ? "agent" : "system",
      actorId: agentId ?? "gateway",
      ...(agentId ? { agentId } : {}),
      ...(context.replyPayloadSendingHook?.runId
        ? { runId: context.replyPayloadSendingHook.runId }
        : {}),
      direction: "outbound",
      channel: context.channel,
      conversationKind: resolveConversationKind(context),
      durationMs: Math.max(0, Date.now() - params.startedAt),
      resultCount: countPhysicalOutboundSends(results),
      ...(context.accountId ? { accountId: context.accountId } : {}),
      targetId: context.to,
      ...identifiers,
    });
  } catch {}
}
/** Emits only after the owning lifecycle has made each logical payload terminal. */
function emitOutboundAuditTerminals(params) {
  if (!hasTrustedMessageAuditListeners()) return;
  let terminals;
  try {
    terminals = typeof params.terminals === "function" ? params.terminals() : params.terminals;
  } catch {
    return;
  }
  for (const indexed of terminals)
    emitOutboundAuditTerminal({
      context: params.context,
      terminal: indexed.terminal,
      startedAt: params.startedAt,
      payloadIndex: indexed.payloadIndex,
      ...(params.queueId
        ? { sourceId: outboundQueueAuditSourceId(params.queueId, indexed.payloadIndex) }
        : {}),
    });
}
//#endregion
//#region src/infra/outbound/delivery-queue-recovery.ts
const MAX_RETRIES = 5;
const PERMANENT_ERROR_PATTERNS = [
  /no conversation reference found/i,
  /chat not found/i,
  /user not found/i,
  /bot.*not.*member/i,
  /bot was blocked by the user/i,
  /forbidden: bot was kicked/i,
  /chat_id is empty/i,
  /recipient is not a valid/i,
  /outbound not configured for channel/i,
  /ambiguous .* recipient/i,
  /User .* not in room/i,
];
const drainInProgress = /* @__PURE__ */ new Map();
const entriesInProgress = /* @__PURE__ */ new Set();
const recoveryReplayPacer = createRecoveryReplayPacer();
function resolveRecoveryDeadlineMs(maxRecoveryMs) {
  const durationMs =
    typeof maxRecoveryMs === "number" && Number.isFinite(maxRecoveryMs)
      ? Math.max(0, Math.trunc(maxRecoveryMs))
      : 6e4;
  if (durationMs <= 0) return resolveDateTimestampMs(Date.now());
  return resolveExpiresAtMsFromDurationMs(durationMs) ?? resolveDateTimestampMs(Date.now());
}
function createEmptyRecoverySummary() {
  return {
    recovered: 0,
    failed: 0,
    skippedMaxRetries: 0,
    deferredBackoff: 0,
  };
}
function emitQueuedAuditTerminals(entry, terminals) {
  emitOutboundAuditTerminals({
    context: entry,
    terminals,
    startedAt: entry.enqueuedAt,
    queueId: entry.id,
  });
}
function queuedDeadLetterAuditTerminals(entry) {
  if (
    entry.recoveryState === "send_attempt_started" ||
    entry.recoveryState === "unknown_after_send"
  )
    return uniformOutboundAuditTerminals(entry.payloads.length, {
      outcome: "unknown",
      failureStage: "queue",
    });
  return uniformOutboundAuditTerminals(entry.payloads.length, {
    outcome: "failed",
    failureStage: "queue",
  });
}
function queuedUnknownAuditTerminals(entry) {
  return uniformOutboundAuditTerminals(entry.payloads.length, {
    outcome: "unknown",
    failureStage: "queue",
  });
}
async function withActiveDeliveryClaim(entryId, fn) {
  if (!claimRecoveryEntry(entriesInProgress, entryId)) return { status: "claimed-by-other-owner" };
  try {
    return {
      status: "claimed",
      value: await fn(),
    };
  } finally {
    releaseRecoveryEntry(entriesInProgress, entryId);
  }
}
function buildRecoveryDeliverParams(entry, cfg, stateDir) {
  return {
    cfg,
    channel: entry.channel,
    to: entry.to,
    accountId: entry.accountId,
    ...(entry.queuePolicy !== void 0 ? { queuePolicy: entry.queuePolicy } : {}),
    ...(entry.requireUnknownSendReconciliation === true
      ? { requireUnknownSendReconciliation: true }
      : {}),
    payloads: entry.payloads,
    renderedBatchPlan: entry.renderedBatchPlan,
    threadId: entry.threadId,
    replyToId: entry.replyToId,
    replyToMode: entry.replyToMode,
    formatting: entry.formatting,
    identity: entry.identity,
    bestEffort: entry.bestEffort,
    gifPlayback: entry.gifPlayback,
    forceDocument: entry.forceDocument,
    replyPayloadSendingHook: entry.replyPayloadSendingHook,
    silent: entry.silent,
    mirror: entry.mirror,
    session: entry.session,
    gatewayClientScopes: entry.gatewayClientScopes,
    deliveryQueueId: entry.id,
    deliveryQueueStateDir: stateDir,
    skipQueue: true,
    deferredDeliveryAdmissionPassed: true,
    deferCommitHooks: true,
  };
}
async function applyRecoveryDeliveryAdmission(params) {
  const admission = resolveDeferredDeliveryAdmission({
    cfg: params.cfg,
    channel: params.entry.channel,
    to: params.entry.to,
    accountId: params.entry.accountId,
    phase: "recovery",
  });
  if (admission.status === "allowed") return "allowed";
  if (
    (
      await failPendingDelivery(
        {
          id: params.entry.id,
          expectedStatus: "pending",
          lastError: admission.reason,
          entry: params.entry,
        },
        params.stateDir,
      )
    ).status === "failed"
  ) {
    emitQueuedAuditTerminals(params.entry, () => queuedDeadLetterAuditTerminals(params.entry));
    params.log.warn(
      `${params.logLabel}: entry ${params.entry.id} permanently rejected before recovery: ${admission.reason}`,
    );
    return "failed";
  }
  params.log.info(
    `${params.logLabel}: entry ${params.entry.id} changed status before admission failure was persisted`,
  );
  return "not_pending";
}
async function reconcileUnknownQueuedDelivery(opts) {
  const adapter = resolveOutboundChannelMessageAdapter({
    channel: opts.entry.channel,
    cfg: opts.cfg,
    allowBootstrap: true,
  });
  if (adapter?.durableFinal?.capabilities?.reconcileUnknownSend !== true) return null;
  const reconcileUnknownSend = adapter?.durableFinal?.reconcileUnknownSend;
  if (!reconcileUnknownSend) return null;
  const { entry } = opts;
  try {
    return await reconcileUnknownSend({
      cfg: opts.cfg,
      queueId: entry.id,
      channel: entry.channel,
      to: entry.to,
      ...(entry.accountId !== void 0 ? { accountId: entry.accountId } : {}),
      enqueuedAt: entry.enqueuedAt,
      retryCount: entry.retryCount,
      ...(entry.platformSendStartedAt !== void 0
        ? { platformSendStartedAt: entry.platformSendStartedAt }
        : {}),
      ...(entry.effectiveReplyToId !== void 0
        ? { effectiveReplyToId: entry.effectiveReplyToId }
        : {}),
      payloads: entry.payloads,
      ...(entry.renderedBatchPlan ? { renderedBatchPlan: entry.renderedBatchPlan } : {}),
      ...(entry.replyToId !== void 0 ? { replyToId: entry.replyToId } : {}),
      ...(entry.replyToMode !== void 0 ? { replyToMode: entry.replyToMode } : {}),
      ...(entry.threadId !== void 0 ? { threadId: entry.threadId } : {}),
      ...(entry.silent !== void 0 ? { silent: entry.silent } : {}),
    });
  } catch (err) {
    const error = formatErrorMessage(err);
    opts.log.warn(`Delivery entry ${opts.entry.id} unknown-send reconciliation failed: ${error}`);
    return {
      status: "unresolved",
      error,
      retryable: true,
    };
  }
}
function buildReconciledSentResult(entry, reconciliation) {
  return {
    channel: entry.channel,
    messageId:
      reconciliation.messageId ??
      reconciliation.receipt.primaryPlatformMessageId ??
      reconciliation.receipt.platformMessageIds[0] ??
      "",
    receipt: reconciliation.receipt,
  };
}
function buildReconciledCommitContext(params) {
  const payload = params.entry.payloads[0] ?? {};
  const result = {
    messageId: params.result.messageId,
    receipt: params.result.receipt ?? {
      platformMessageIds: [params.result.messageId].filter(Boolean),
      parts: [],
      sentAt: Date.now(),
    },
  };
  const base = {
    cfg: params.cfg,
    to: params.entry.to,
    accountId: params.entry.accountId,
    replyToId:
      params.entry.effectiveReplyToId !== void 0
        ? params.entry.effectiveReplyToId
        : params.entry.replyToId,
    replyToMode: params.entry.replyToMode,
    threadId: params.entry.threadId,
    silent: params.entry.silent,
    result,
  };
  if (
    payload.presentation !== void 0 ||
    payload.delivery !== void 0 ||
    payload.interactive !== void 0 ||
    (payload.channelData !== void 0 && Object.keys(payload.channelData).length > 0)
  )
    return {
      ...base,
      kind: "payload",
      text: payload.text ?? "",
      mediaUrl: payload.mediaUrl,
      payload,
    };
  const mediaUrl = payload.mediaUrl ?? payload.mediaUrls?.find((url) => url);
  if (mediaUrl)
    return {
      ...base,
      kind: "media",
      text: payload.text ?? "",
      mediaUrl,
      audioAsVoice: payload.audioAsVoice,
      gifPlayback: params.entry.gifPlayback,
      forceDocument: params.entry.forceDocument,
    };
  return {
    ...base,
    kind: "text",
    text: payload.text ?? "",
  };
}
async function runReconciledSentCommitHooks(params) {
  const afterCommit = resolveOutboundChannelMessageAdapter({
    channel: params.entry.channel,
    cfg: params.cfg,
    allowBootstrap: true,
  })?.send?.lifecycle?.afterCommit;
  if (!afterCommit) return;
  const result = buildReconciledSentResult(params.entry, params.reconciliation);
  try {
    await afterCommit(
      buildReconciledCommitContext({
        entry: params.entry,
        cfg: params.cfg,
        result,
      }),
    );
  } catch (err) {
    params.log.warn(
      `Delivery entry ${params.entry.id} reconciled sent afterCommit hook failed: ${formatErrorMessage(err)}`,
    );
  }
}
async function moveEntryToFailedWithLogging(entryId, log, stateDir) {
  try {
    await moveToFailed(entryId, stateDir);
    return true;
  } catch (err) {
    log.error(`Failed to move entry ${entryId} to failed/: ${String(err)}`);
    return false;
  }
}
function isEntryEligibleForRecoveryRetry(entry, now) {
  const backoff = computeBackoffMs(entry.retryCount + 1);
  if (backoff <= 0) return { eligible: true };
  if (entry.retryCount === 0 && entry.lastAttemptAt === void 0) return { eligible: true };
  const nextEligibleAt =
    (typeof entry.lastAttemptAt === "number" &&
    Number.isFinite(entry.lastAttemptAt) &&
    entry.lastAttemptAt > 0
      ? (entry.lastAttemptAt ?? entry.enqueuedAt)
      : entry.enqueuedAt) + backoff;
  if (now >= nextEligibleAt) return { eligible: true };
  return {
    eligible: false,
    remainingBackoffMs: nextEligibleAt - now,
  };
}
function isPermanentDeliveryError(error) {
  return PERMANENT_ERROR_PATTERNS.some((re) => re.test(error));
}
async function persistRecoveredPostSendState(opts) {
  try {
    await markDeliveryPlatformOutcomeUnknown(opts.entry.id, opts.stateDir);
    return "marked";
  } catch (markErr) {
    opts.log.warn(
      `Delivery entry ${opts.entry.id} failed to persist post-send state; falling back to direct ack: ${formatErrorMessage(markErr)}`,
    );
    try {
      await ackDelivery(opts.entry.id, opts.stateDir);
      return "acked";
    } catch (ackErr) {
      const error = `post-send state persistence failed: marker=${formatErrorMessage(markErr)}; ack=${formatErrorMessage(ackErr)}`;
      await failDeliveryAfterPlatformSend(opts.entry.id, error, opts.stateDir);
      return "failed";
    }
  }
}
async function drainQueuedEntry(opts) {
  const { entry } = opts;
  if (
    entry.recoveryState === "send_attempt_started" ||
    entry.recoveryState === "unknown_after_send"
  ) {
    const reconciliation = await reconcileUnknownQueuedDelivery({
      entry,
      cfg: opts.cfg,
      log: opts.log,
    });
    if (reconciliation?.status === "sent")
      try {
        await ackDelivery(entry.id, opts.stateDir);
        await runReconciledSentCommitHooks({
          entry,
          cfg: opts.cfg,
          reconciliation,
          log: opts.log,
        });
        const result = buildReconciledSentResult(entry, reconciliation);
        emitQueuedAuditTerminals(entry, () =>
          completedOutboundAuditTerminals({
            payloadCount: entry.payloads.length,
            results: [result],
            payloadOutcomes: [],
          }),
        );
        opts.onRecovered?.(entry);
        opts.log.info(`Delivery entry ${entry.id} reconciled unknown_after_send as already sent`);
        return "recovered";
      } catch (ackErr) {
        if (getErrnoCode(ackErr) === "ENOENT") return "already-gone";
        const errMsg = `failed to ack reconciled sent delivery: ${formatErrorMessage(ackErr)}`;
        opts.log.warn(`Delivery entry ${entry.id} ${errMsg}`);
        opts.onFailed?.(entry, errMsg);
        try {
          await failDelivery(entry.id, errMsg, opts.stateDir);
          return "failed";
        } catch (failErr) {
          if (getErrnoCode(failErr) === "ENOENT") return "already-gone";
        }
        return "failed";
      }
    if (reconciliation?.status === "not_sent" && entry.recoveryState === "send_attempt_started")
      opts.log.info(
        `Delivery entry ${entry.id} reconciled ${entry.recoveryState} as not sent; replaying`,
      );
    else {
      let errMsg = `delivery state is ${entry.recoveryState}; refusing blind replay without adapter reconciliation`;
      if (reconciliation?.status === "not_sent")
        errMsg = `delivery state is ${entry.recoveryState}; refusing full replay after post-send evidence`;
      else if (reconciliation?.status === "unresolved" && reconciliation.error)
        errMsg = `delivery state is ${entry.recoveryState} and reconciliation is unresolved: ${reconciliation.error}`;
      opts.log.warn(`Delivery entry ${entry.id} ${errMsg}`);
      opts.onFailed?.(entry, errMsg);
      if (reconciliation?.status === "unresolved" && reconciliation.retryable === true) {
        try {
          await failDelivery(entry.id, errMsg, opts.stateDir);
          return "failed";
        } catch (failErr) {
          if (getErrnoCode(failErr) === "ENOENT") return "already-gone";
        }
        return "failed";
      }
      try {
        await moveToFailed(entry.id, opts.stateDir);
        emitQueuedAuditTerminals(entry, () => queuedUnknownAuditTerminals(entry));
        return "moved-to-failed";
      } catch (moveErr) {
        if (getErrnoCode(moveErr) === "ENOENT") return "already-gone";
      }
      return "failed";
    }
  }
  const payloadOutcomes = [];
  let postSendState;
  let deliveredResults = [];
  let commitHooksRun = false;
  const collectResults = (results) => {
    for (const result of results)
      if (!deliveredResults.includes(result)) deliveredResults.push(result);
  };
  const collectPayloadOutcome = (outcome) => {
    if (!payloadOutcomes.includes(outcome)) payloadOutcomes.push(outcome);
  };
  const runCommitHooksAfterAck = async () => {
    if (postSendState !== "acked" || commitHooksRun || deliveredResults.length === 0) return;
    commitHooksRun = true;
    await runOutboundDeliveryCommitHooks(deliveredResults);
  };
  try {
    const result = await opts.deliver({
      ...buildRecoveryDeliverParams(entry, opts.cfg, opts.stateDir),
      onPayloadDeliveryOutcome: collectPayloadOutcome,
      onDeliveryResult: async (deliveryResult) => {
        collectResults([deliveryResult]);
        postSendState ??= await persistRecoveredPostSendState({
          entry,
          log: opts.log,
          stateDir: opts.stateDir,
        });
      },
    });
    const results = isOutboundDeliveryResultArray(result) ? result : [];
    if (results.length > 0) deliveredResults = [...results];
    const failedOutcomes = payloadOutcomes.filter((outcome) => outcome.status === "failed");
    const failedOutcome = failedOutcomes[0];
    if (failedOutcome) {
      const errMsg = formatErrorMessage(failedOutcome.error);
      opts.onFailed?.(entry, errMsg);
      if (results.length > 0 || failedOutcomes.some((outcome) => outcome.sentBeforeError)) {
        postSendState ??= await persistRecoveredPostSendState({
          entry,
          log: opts.log,
          stateDir: opts.stateDir,
        });
        opts.log.warn(
          `Delivery entry ${entry.id} partially sent before best-effort recovery failed; preserving unknown_after_send`,
        );
        if (postSendState === "acked") {
          await runCommitHooksAfterAck();
          emitQueuedAuditTerminals(entry, () =>
            failedOutboundAuditTerminals({
              payloadCount: entry.payloads.length,
              results: deliveredResults,
              payloadOutcomes,
              failureStage: "platform_send",
            }),
          );
        }
      } else
        await (
          failedOutcomes.every((outcome) => isProvenDeliveryNotSentError(outcome.error))
            ? failDeliveryBeforePlatformSend
            : failDelivery
        )(entry.id, errMsg, opts.stateDir);
      return "failed";
    }
    postSendState ??=
      results.length > 0
        ? await persistRecoveredPostSendState({
            entry,
            log: opts.log,
            stateDir: opts.stateDir,
          })
        : void 0;
    if (postSendState === "failed") {
      const errMsg = "recovered send completed but queue finalization failed";
      opts.onFailed?.(entry, errMsg);
      opts.log.warn(`Delivery entry ${entry.id} ${errMsg}; preserving unknown_after_send`);
      return "failed";
    }
    if (postSendState !== "acked")
      try {
        await ackDelivery(entry.id, opts.stateDir);
        postSendState = "acked";
      } catch (ackErr) {
        const ackError = `failed to ack recovered delivery: ${formatErrorMessage(ackErr)}`;
        if (results.length > 0) {
          await failDeliveryAfterPlatformSend(entry.id, ackError, opts.stateDir);
          postSendState = "failed";
        } else await failDelivery(entry.id, ackError, opts.stateDir);
        opts.onFailed?.(entry, ackError);
        opts.log.warn(`Delivery entry ${entry.id} ${ackError}`);
        return "failed";
      }
    await runCommitHooksAfterAck();
    emitQueuedAuditTerminals(entry, () =>
      completedOutboundAuditTerminals({
        payloadCount: entry.payloads.length,
        results,
        payloadOutcomes,
      }),
    );
    opts.onRecovered?.(entry);
    return "recovered";
  } catch (err) {
    const errMsg = formatErrorMessage(err);
    opts.onFailed?.(entry, errMsg);
    if (isOutboundDeliveryError(err) && err.results.length > 0) deliveredResults = [...err.results];
    if (
      deliveredResults.length > 0 ||
      postSendState !== void 0 ||
      (isOutboundDeliveryError(err) && err.sentBeforeError)
    ) {
      try {
        postSendState ??= await persistRecoveredPostSendState({
          entry,
          log: opts.log,
          stateDir: opts.stateDir,
        });
      } catch (persistErr) {
        opts.log.error(
          `Delivery entry ${entry.id} could not persist post-send evidence: ${formatErrorMessage(persistErr)}`,
        );
      }
      if (postSendState === "acked") {
        await runCommitHooksAfterAck();
        emitQueuedAuditTerminals(entry, () =>
          failedOutboundAuditTerminals({
            payloadCount: entry.payloads.length,
            results: deliveredResults,
            payloadOutcomes,
            failureStage: isOutboundDeliveryError(err) ? err.stage : "platform_send",
          }),
        );
      }
      opts.log.warn(
        `Delivery entry ${entry.id} partially sent before recovery failed; preserving unknown_after_send`,
      );
      return "failed";
    }
    if (!(await loadPendingDelivery(entry.id, opts.stateDir))) {
      emitQueuedAuditTerminals(entry, () =>
        failedOutboundAuditTerminals({
          payloadCount: entry.payloads.length,
          results: deliveredResults,
          payloadOutcomes,
          failureStage: isOutboundDeliveryError(err) ? err.stage : "platform_send",
        }),
      );
      return "failed";
    }
    if (isPermanentDeliveryError(errMsg))
      try {
        await moveToFailed(entry.id, opts.stateDir);
        emitQueuedAuditTerminals(entry, () =>
          failedOutboundAuditTerminals({
            payloadCount: entry.payloads.length,
            results: deliveredResults,
            payloadOutcomes,
            failureStage: "queue",
          }),
        );
        return "moved-to-failed";
      } catch (moveErr) {
        if (getErrnoCode(moveErr) === "ENOENT") return "already-gone";
      }
    else
      try {
        await (isProvenDeliveryNotSentError(err) ? failDeliveryBeforePlatformSend : failDelivery)(
          entry.id,
          errMsg,
          opts.stateDir,
        );
        return "failed";
      } catch (failErr) {
        if (getErrnoCode(failErr) === "ENOENT") return "already-gone";
      }
    return "failed";
  }
}
async function drainPendingDeliveries(opts) {
  if (drainInProgress.get(opts.drainKey)) {
    opts.log.info(`${opts.logLabel}: already in progress for ${opts.drainKey}, skipping`);
    return;
  }
  drainInProgress.set(opts.drainKey, true);
  try {
    const now = Date.now();
    const deliver = opts.deliver;
    const matchingEntries = (await loadPendingDeliveries(opts.stateDir))
      .filter((entry) => opts.selectEntry(entry, now).match)
      .toSorted((a, b) => a.enqueuedAt - b.enqueuedAt);
    if (matchingEntries.length === 0) return;
    for (const entry of matchingEntries) {
      if (!claimRecoveryEntry(entriesInProgress, entry.id)) continue;
      try {
        const currentEntry = await loadPendingDelivery(entry.id, opts.stateDir);
        if (!currentEntry) {
          opts.log.info(`${opts.logLabel}: entry ${entry.id} already gone, skipping`);
          continue;
        }
        if (
          (await applyRecoveryDeliveryAdmission({
            entry: currentEntry,
            cfg: opts.cfg,
            log: opts.log,
            stateDir: opts.stateDir,
            logLabel: opts.logLabel,
          })) !== "allowed"
        )
          continue;
        const currentDecision = opts.selectEntry(currentEntry, Date.now());
        if (!currentDecision.match) {
          opts.log.info(`${opts.logLabel}: entry ${currentEntry.id} no longer matches, skipping`);
          continue;
        }
        if (currentEntry.retryCount >= MAX_RETRIES) {
          try {
            await moveToFailed(currentEntry.id, opts.stateDir);
          } catch (err) {
            if (getErrnoCode(err) === "ENOENT") {
              opts.log.info(`${opts.logLabel}: entry ${currentEntry.id} already gone, skipping`);
              continue;
            }
            throw err;
          }
          emitQueuedAuditTerminals(currentEntry, () =>
            queuedDeadLetterAuditTerminals(currentEntry),
          );
          opts.log.warn(
            `${opts.logLabel}: entry ${currentEntry.id} exceeded max retries and was moved to failed/`,
          );
          continue;
        }
        if (!currentDecision.bypassBackoff) {
          const retryEligibility = isEntryEligibleForRecoveryRetry(currentEntry, Date.now());
          if (!retryEligibility.eligible) {
            opts.log.info(
              `${opts.logLabel}: entry ${currentEntry.id} not ready for retry yet — backoff ${retryEligibility.remainingBackoffMs}ms remaining`,
            );
            continue;
          }
        }
        await recoveryReplayPacer.wait();
        if (
          (await drainQueuedEntry({
            entry: currentEntry,
            cfg: opts.cfg,
            deliver,
            log: opts.log,
            stateDir: opts.stateDir,
            onFailed: (failedEntry, errMsg) => {
              if (isPermanentDeliveryError(errMsg)) {
                opts.log.warn(
                  `${opts.logLabel}: entry ${failedEntry.id} hit permanent error — moving to failed/: ${errMsg}`,
                );
                return;
              }
              opts.log.warn(
                `${opts.logLabel}: retry failed for entry ${failedEntry.id}: ${errMsg}`,
              );
            },
          })) === "recovered"
        )
          opts.log.info(
            `${opts.logLabel}: drained delivery ${currentEntry.id} on ${currentEntry.channel}`,
          );
      } finally {
        releaseRecoveryEntry(entriesInProgress, entry.id);
      }
    }
  } finally {
    drainInProgress.delete(opts.drainKey);
  }
}
/**
 * On gateway startup, scan the delivery queue and retry any pending entries.
 * Uses exponential backoff and moves entries that exceed MAX_RETRIES to failed/.
 */
async function recoverPendingDeliveries(opts) {
  const pending = await loadPendingDeliveries(opts.stateDir);
  if (pending.length === 0) return createEmptyRecoverySummary();
  pending.sort((a, b) => a.enqueuedAt - b.enqueuedAt);
  opts.log.info(`Found ${pending.length} pending delivery entries — starting recovery`);
  const deadline = resolveRecoveryDeadlineMs(opts.maxRecoveryMs);
  const summary = createEmptyRecoverySummary();
  for (const entry of pending) {
    if (Date.now() >= deadline) {
      opts.log.warn(`Recovery time budget exceeded — remaining entries deferred to next startup`);
      break;
    }
    if (!claimRecoveryEntry(entriesInProgress, entry.id)) {
      opts.log.info(`Recovery skipped for delivery ${entry.id}: already being processed`);
      continue;
    }
    try {
      const currentEntry = await loadPendingDelivery(entry.id, opts.stateDir);
      if (!currentEntry) {
        opts.log.info(`Recovery skipped for delivery ${entry.id}: already gone`);
        continue;
      }
      const admission = await applyRecoveryDeliveryAdmission({
        entry: currentEntry,
        cfg: opts.cfg,
        log: opts.log,
        stateDir: opts.stateDir,
        logLabel: "Recovery",
      });
      if (admission !== "allowed") {
        if (admission === "failed") summary.failed += 1;
        continue;
      }
      if (currentEntry.retryCount >= MAX_RETRIES) {
        opts.log.warn(
          `Delivery ${currentEntry.id} exceeded max retries (${currentEntry.retryCount}/${MAX_RETRIES}) — moving to failed/`,
        );
        if (await moveEntryToFailedWithLogging(currentEntry.id, opts.log, opts.stateDir))
          emitQueuedAuditTerminals(currentEntry, () =>
            queuedDeadLetterAuditTerminals(currentEntry),
          );
        summary.skippedMaxRetries += 1;
        continue;
      }
      const currentRetryEligibility = isEntryEligibleForRecoveryRetry(currentEntry, Date.now());
      if (!currentRetryEligibility.eligible) {
        summary.deferredBackoff += 1;
        opts.log.info(
          `Delivery ${currentEntry.id} not ready for retry yet — backoff ${currentRetryEligibility.remainingBackoffMs}ms remaining`,
        );
        continue;
      }
      if ((await recoveryReplayPacer.wait(deadline)) === "deadline-exceeded") {
        opts.log.warn(`Recovery time budget exceeded — remaining entries deferred to next startup`);
        break;
      }
      if (
        (await drainQueuedEntry({
          entry: currentEntry,
          cfg: opts.cfg,
          deliver: opts.deliver,
          log: opts.log,
          stateDir: opts.stateDir,
          onRecovered: (recoveredEntry) => {
            summary.recovered += 1;
            opts.log.info(`Recovered delivery ${recoveredEntry.id} on ${recoveredEntry.channel}`);
          },
          onFailed: (failedEntry, errMsg) => {
            summary.failed += 1;
            if (isPermanentDeliveryError(errMsg)) {
              opts.log.warn(
                `Delivery ${failedEntry.id} hit permanent error — moving to failed/: ${errMsg}`,
              );
              return;
            }
            opts.log.warn(`Retry failed for delivery ${failedEntry.id}: ${errMsg}`);
          },
        })) === "moved-to-failed"
      )
        continue;
    } finally {
      releaseRecoveryEntry(entriesInProgress, entry.id);
    }
  }
  opts.log.info(
    `Delivery recovery complete: ${summary.recovered} recovered, ${summary.failed} failed, ${summary.skippedMaxRetries} skipped (max retries), ${summary.deferredBackoff} deferred (backoff)`,
  );
  return summary;
}
//#endregion
export {
  runOutboundDeliveryCommitHooks as _,
  emitOutboundAuditTerminals as a,
  ackDelivery as c,
  failDeliveryAfterPlatformSend as d,
  failDeliveryBeforePlatformSend as f,
  attachOutboundDeliveryCommitHook as g,
  markDeliveryPlatformSendDispatched as h,
  completedOutboundAuditTerminals as i,
  enqueueDelivery as l,
  markDeliveryPlatformSendAttemptStarted as m,
  recoverPendingDeliveries as n,
  failedOutboundAuditTerminals as o,
  markDeliveryPlatformOutcomeUnknown as p,
  withActiveDeliveryClaim as r,
  uniformOutboundAuditTerminals as s,
  drainPendingDeliveries as t,
  failDelivery as u,
  resolveDeferredDeliveryAdmission as v,
};
