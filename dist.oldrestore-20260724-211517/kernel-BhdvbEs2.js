import { t as deriveDurableFinalDeliveryRequirements } from "./capabilities-tytC94t4.js";
import { t as normalizeDeliverableOutboundChannel } from "./channel-resolution-B-NyvoRP.js";
import { r as resolveOutboundDurableFinalDeliverySupport } from "./deliver-CpY6iKDw.js";
import {
  C as createDiagnosticTraceContextFromActiveScope,
  j as runWithDiagnosticTraceContext,
} from "./diagnostic-events-5-gsFhkM.js";
import {
  h as recordPendingHistoryEntryWithMedia,
  u as clearHistoryEntriesIfEnabled,
} from "./history-DdfM33Aj.js";
import {
  a as resolvePairLoopGuardSettings,
  r as createPairLoopGuard,
} from "./pair-loop-guard-runtime-D0pZ_1is.js";
import { n as listMessageReceiptPlatformIds } from "./receipt-C0uxiauk.js";
import { t as createChannelReplyPipeline } from "./reply-pipeline-uYpC1TSz.js";
import { t as sendDurableMessageBatch } from "./send-DJdWoC1F.js";
import { t as buildOutboundSessionContext } from "./session-context-CryOjB_1.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region src/channels/inbound-event/media.ts
/**
 * Channel inbound media normalization.
 *
 * Converts plugin attachment metadata into aligned prompt/context media payload fields.
 */
/**
 * Replaces an optimistic media placeholder, or appends to real caption text,
 * when transport media could not be materialized for the agent turn.
 */
function formatInboundMediaUnavailableText(params) {
  const body = params.body?.trim() ?? "";
  const placeholder = params.mediaPlaceholder?.trim() ?? "";
  const notice = params.notice.trim();
  if (!body || (placeholder && body === placeholder)) return notice;
  return `${body}\n\n${notice}`;
}
function alignedStrings(values) {
  if (!values.some(Boolean)) return;
  return values.map((value) => value ?? "");
}
function normalizeKind(value) {
  return value ?? void 0;
}
function mediaType(media) {
  return media.contentType ?? media.kind;
}
/**
 * Normalizes plugin-provided attachment facts into the channel turn media shape.
 */
function toInboundMediaFacts(media, defaults = {}) {
  if (!Array.isArray(media)) return [];
  return media.map((entry, index) => ({
    path: normalizeOptionalString(entry.path),
    url: normalizeOptionalString(entry.url),
    contentType: normalizeOptionalString(entry.contentType),
    kind: normalizeKind(entry.kind) ?? defaults.kind,
    transcribed: entry.transcribed === true || defaults.transcribed?.(entry, index) === true,
    messageId: normalizeOptionalString(entry.messageId) ?? defaults.messageId,
  }));
}
/**
 * Projects inbound attachment facts into transcript history without transient turn-only flags.
 */
function toHistoryMediaEntries(media, defaults = {}) {
  return toInboundMediaFacts(media, defaults).map((entry) => ({
    path: entry.path,
    url: entry.url,
    contentType: entry.contentType,
    kind: entry.kind,
    messageId: entry.messageId,
  }));
}
/**
 * Builds prompt environment media fields while keeping single-item legacy fields populated.
 */
function buildChannelInboundMediaPayload(media) {
  const entries = Array.isArray(media) ? media : [];
  const transcribedIndexes = entries
    .map((item, index) => (item.transcribed ? index : void 0))
    .filter((index) => index !== void 0);
  return {
    MediaPath: entries[0]?.path,
    MediaUrl: entries[0]?.url ?? entries[0]?.path,
    MediaType: entries[0] ? mediaType(entries[0]) : void 0,
    MediaPaths: alignedStrings(entries.map((item) => item.path)),
    MediaUrls: alignedStrings(entries.map((item) => item.url ?? item.path)),
    MediaTypes: alignedStrings(entries.map(mediaType)),
    MediaTranscribedIndexes: transcribedIndexes.length > 0 ? transcribedIndexes : void 0,
  };
}
//#endregion
//#region src/channels/turn/bot-loop-protection.ts
const channelBotPairLoopGuard = createPairLoopGuard({ pruneIntervalMs: 6e4 });
/** Records a bot pair interaction and returns whether the loop guard should suppress it. */
function recordChannelBotPairLoopAndCheckSuppression(params) {
  return channelBotPairLoopGuard.recordAndCheck({
    scopeId: params.scopeId,
    conversationId: params.conversationId,
    senderId: params.senderId,
    receiverId: params.receiverId,
    settings: resolvePairLoopGuardSettings({
      config: params.config,
      defaultsConfig: params.defaultsConfig,
      defaultEnabled: params.defaultEnabled,
    }),
    nowMs: params.nowMs,
  });
}
//#endregion
//#region src/channels/turn/dispatch-result.ts
/** Zero-filled reply dispatch count map used before merging optional provider counts. */
const EMPTY_CHANNEL_TURN_DISPATCH_COUNTS = {
  tool: 0,
  block: 0,
  final: 0,
};
/** Resolves dispatch counts with missing reply kinds filled as zero. */
function resolveChannelTurnDispatchCounts(result) {
  return {
    ...EMPTY_CHANNEL_TURN_DISPATCH_COUNTS,
    ...result?.counts,
  };
}
/** Returns whether a turn produced any visible reply delivery signal. */
function hasVisibleChannelTurnDispatch(result, signals = {}) {
  const counts = resolveChannelTurnDispatchCounts(result);
  return (
    result?.observedReplyDelivery === true ||
    signals.observedReplyDelivery === true ||
    signals.fallbackDelivered === true ||
    signals.deliverySummaryDelivered === true ||
    result?.queuedFinal === true ||
    counts.tool > 0 ||
    counts.block > 0 ||
    counts.final > 0
  );
}
/** Returns whether a turn produced a final reply, fallback, summary, or queued final payload. */
function hasFinalChannelTurnDispatch(result, signals = {}) {
  const counts = resolveChannelTurnDispatchCounts(result);
  return (
    signals.fallbackDelivered === true ||
    signals.deliverySummaryDelivered === true ||
    result?.queuedFinal === true ||
    counts.final > 0
  );
}
//#endregion
//#region src/channels/turn/delivery-result.ts
/** Converts a normalized message receipt into the delivery result shape used by channel turns. */
function createChannelDeliveryResultFromReceipt(params) {
  const messageIds = listMessageReceiptPlatformIds(params.receipt);
  return {
    ...(messageIds.length > 0 ? { messageIds } : {}),
    receipt: params.receipt,
    ...(params.threadId ? { threadId: params.threadId } : {}),
    ...(params.replyToId ? { replyToId: params.replyToId } : {}),
    ...(params.visibleReplySent === void 0 ? {} : { visibleReplySent: params.visibleReplySent }),
    ...(params.deliveryIntent ? { deliveryIntent: params.deliveryIntent } : {}),
  };
}
//#endregion
//#region src/channels/turn/durable-delivery.ts
function resolveDeliveryTarget(params) {
  return (
    normalizeOptionalString(params.to) ??
    normalizeOptionalString(params.ctxPayload.OriginatingTo) ??
    normalizeOptionalString(params.ctxPayload.To)
  );
}
function resolveDurableInboundReplyToId(params) {
  if (params.replyToId === null || params.payload.replyToId === null) return null;
  return (
    normalizeOptionalString(params.replyToId) ??
    normalizeOptionalString(params.payload.replyToId) ??
    normalizeOptionalString(params.ctxPayload.ReplyToIdFull) ??
    normalizeOptionalString(params.ctxPayload.ReplyToId)
  );
}
function resolveDurableInboundReplyThreadId(params) {
  if ("threadId" in params) return params.threadId;
  return params.ctxPayload.MessageThreadId;
}
function stringifyThreadId(value) {
  return value == null ? void 0 : String(value);
}
function toDeliveryIntent(intent) {
  return {
    id: intent.id,
    kind: "outbound_queue",
    queuePolicy: intent.queuePolicy,
  };
}
/** Narrows durable delivery results that handled the payload without caller fallback. */
function isDurableInboundReplyDeliveryHandled(result) {
  return result.status === "handled_visible" || result.status === "handled_no_send";
}
/** Throws failed durable delivery results, preserving visible-send metadata when applicable. */
function throwIfDurableInboundReplyDeliveryFailed(result) {
  if (result.status === "failed")
    throw result.sentBeforeError === true
      ? markDurableInboundReplyDeliveryErrorVisible(result.error)
      : result.error;
}
function markDurableInboundReplyDeliveryErrorVisible(error) {
  if (typeof error === "object" && error !== null && Object.isExtensible(error)) {
    Object.assign(error, {
      sentBeforeError: true,
      visibleReplySent: true,
    });
    return error;
  }
  const visibleError = new Error("visible durable reply delivery failed", { cause: error });
  Object.assign(visibleError, {
    sentBeforeError: true,
    visibleReplySent: true,
  });
  return visibleError;
}
/** Delivers final inbound replies through the durable message-send context when supported. */
async function deliverInboundReplyWithMessageSendContext(params) {
  if (params.info.kind !== "final")
    return {
      status: "not_applicable",
      reason: "non_final",
    };
  const channel = normalizeDeliverableOutboundChannel(params.channel);
  const to = resolveDeliveryTarget(params);
  if (!channel)
    return {
      status: "unsupported",
      reason: "missing_channel",
    };
  if (!to)
    return {
      status: "unsupported",
      reason: "missing_target",
    };
  const replyToId = resolveDurableInboundReplyToId(params);
  const threadId = resolveDurableInboundReplyThreadId(params);
  const requiredCapabilities =
    params.requiredCapabilities ??
    deriveDurableFinalDeliveryRequirements({
      payload: params.payload,
      replyToId,
      threadId,
      silent: params.silent,
    });
  const durability =
    requiredCapabilities.reconcileUnknownSend === true ? "required" : "best_effort";
  let support;
  try {
    support = await resolveOutboundDurableFinalDeliverySupport({
      cfg: params.cfg,
      channel,
      requirements: requiredCapabilities,
    });
  } catch (err) {
    return {
      status: "failed",
      error: err,
    };
  }
  if (!support.ok)
    return {
      status: "unsupported",
      reason: support.reason,
      ...(support.capability ? { capability: support.capability } : {}),
    };
  const session = buildOutboundSessionContext({
    cfg: params.cfg,
    sessionKey: params.ctxPayload.SessionKey,
    policySessionKey: params.ctxPayload.RuntimePolicySessionKey,
    conversationType: params.ctxPayload.ChatType,
    agentId: params.agentId,
    requesterAccountId: params.accountId ?? params.ctxPayload.AccountId,
    requesterSenderId: params.ctxPayload.SenderId ?? params.ctxPayload.From,
    requesterSenderName: params.ctxPayload.SenderName,
    requesterSenderUsername: params.ctxPayload.SenderUsername,
    requesterSenderE164: params.ctxPayload.SenderE164,
  });
  const send = await sendDurableMessageBatch({
    cfg: params.cfg,
    channel,
    to,
    accountId: params.accountId,
    payloads: [params.payload],
    threadId,
    replyToId,
    replyToMode: params.replyToMode,
    formatting: params.formatting,
    identity: params.identity,
    deps: params.deps,
    mediaAccess: params.mediaAccess,
    silent: params.silent,
    durability,
    ...(durability === "required" ? { requireUnknownSendReconciliation: true } : {}),
    session,
    gatewayClientScopes: params.ctxPayload.GatewayClientScopes ?? [],
  });
  if (send.status === "failed")
    return {
      status: "failed",
      error: send.error,
    };
  if (send.status === "partial_failed")
    return {
      status: "failed",
      error: markDurableInboundReplyDeliveryErrorVisible(send.error),
      sentBeforeError: true,
    };
  const delivery = createChannelDeliveryResultFromReceipt({
    receipt: send.receipt,
    threadId: stringifyThreadId(threadId),
    ...(replyToId ? { replyToId } : {}),
    visibleReplySent: send.status === "sent",
    ...(send.deliveryIntent ? { deliveryIntent: toDeliveryIntent(send.deliveryIntent) } : {}),
  });
  if (send.status === "suppressed")
    return {
      status: "handled_no_send",
      reason: "no_visible_result",
      delivery,
    };
  return {
    status: "handled_visible",
    delivery,
  };
}
//#endregion
//#region src/channels/turn/kernel.ts
const NO_ADDITIONAL_DELIVERY_SIGNALS = {};
const DEFAULT_EVENT_CLASS = {
  kind: "message",
  canStartAgentTurn: true,
};
const log = createSubsystemLogger("channels/turn/kernel");
function isAdmission(value) {
  if (!value || typeof value !== "object") return false;
  const kind = value.kind;
  return kind === "dispatch" || kind === "observeOnly" || kind === "handled" || kind === "drop";
}
function normalizePreflight(value) {
  if (!value) return {};
  if (isAdmission(value)) return { admission: value };
  return value;
}
function emit(params) {
  params.log?.({
    channel: params.channel,
    accountId: params.accountId,
    ...params.event,
  });
}
function createNoopChannelEventDeliveryAdapter() {
  return { deliver: async () => ({ visibleReplySent: false }) };
}
function clearPendingHistoryAfterTurn(params) {
  if (!params?.isGroup || !params.historyKey || !params.historyMap || params.limit === void 0)
    return;
  clearHistoryEntriesIfEnabled({
    historyMap: params.historyMap,
    historyKey: params.historyKey,
    limit: params.limit,
  });
}
function resolveDroppedHistorySender(input, preflight) {
  return (
    preflight.message?.senderLabel ??
    preflight.message?.envelopeFrom ??
    (typeof input.raw === "object" &&
    input.raw &&
    "sender" in input.raw &&
    typeof input.raw.sender === "string"
      ? input.raw.sender
      : void 0) ??
    "unknown"
  );
}
function resolveDroppedHistoryBody(input, preflight) {
  return (
    preflight.message?.bodyForAgent ??
    preflight.message?.body ??
    preflight.message?.rawBody ??
    input.textForAgent ??
    input.rawText
  );
}
async function recordDroppedChannelTurnHistory(params) {
  const admission = params.admission ?? params.preflight.admission;
  if (admission?.kind !== "drop") return;
  const history = params.preflight.history;
  if (!history || history.limit <= 0 || !(history.recordOnDrop || admission.recordHistory)) return;
  const body = resolveDroppedHistoryBody(params.input, params.preflight);
  const entry =
    body.trim().length > 0
      ? {
          sender: resolveDroppedHistorySender(params.input, params.preflight),
          body,
          timestamp: params.input.timestamp,
          messageId: params.input.id,
        }
      : null;
  const media = params.preflight.media;
  await recordPendingHistoryEntryWithMedia({
    historyMap: history.historyMap,
    historyKey: history.key,
    limit: history.limit,
    entry,
    mediaLimit: history.mediaLimit,
    messageId: params.input.id,
    shouldRecord: history.shouldRecord,
    media:
      typeof media === "function"
        ? async () => toHistoryMediaEntries(await media(), { messageId: params.input.id })
        : toHistoryMediaEntries(media, { messageId: params.input.id }),
  });
}
const recordDroppedChannelInboundHistory = recordDroppedChannelTurnHistory;
function resolveAssembledReplyPipeline(params) {
  const onTurnAdopted = params.onTurnAdopted ?? params.replyOptions?.onTurnAdopted;
  if (!params.replyPipeline)
    return {
      dispatcherOptions: params.dispatcherOptions,
      replyOptions: onTurnAdopted
        ? {
            ...params.replyOptions,
            onTurnAdopted,
          }
        : params.replyOptions,
    };
  const { onModelSelected, ...replyPipeline } = createChannelReplyPipeline({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: params.channel,
    accountId: params.accountId,
    ...params.replyPipeline,
  });
  return {
    dispatcherOptions: {
      ...replyPipeline,
      ...params.dispatcherOptions,
    },
    replyOptions: {
      onModelSelected,
      ...params.replyOptions,
      ...(onTurnAdopted ? { onTurnAdopted } : {}),
    },
  };
}
function resolveObserveOnlyDispatchResult(params) {
  return (
    params.observeOnlyDispatchResult ?? {
      queuedFinal: false,
      counts: EMPTY_CHANNEL_TURN_DISPATCH_COUNTS,
    }
  );
}
function isSystemChannelTurn(ctx) {
  return (
    ctx.Provider === "heartbeat" || ctx.Provider === "cron-event" || ctx.Provider === "exec-event"
  );
}
function maybeWarnZeroCountVisibleDispatch(params) {
  if (params.admission?.kind === "observeOnly" || isSystemChannelTurn(params.ctxPayload)) return;
  const dispatchResult = params.dispatchResult;
  if (hasVisibleChannelTurnDispatch(dispatchResult, NO_ADDITIONAL_DELIVERY_SIGNALS)) return;
  log.warn(
    `visible channel turn dispatched with no queued reply payloads: channel=${params.channel} messageId=${params.messageId ?? "unknown"} sessionKey=${params.ctxPayload.SessionKey ?? params.routeSessionKey}`,
  );
  emit({
    ...params,
    event: {
      stage: "dispatch",
      event: "warning",
      messageId: params.messageId,
      sessionKey: params.ctxPayload.SessionKey ?? params.routeSessionKey,
      admission: params.admission?.kind ?? "dispatch",
      reason: "zero-count-visible-dispatch",
    },
  });
}
function isExplicitlyNonVisibleChannelDelivery(result) {
  return (
    typeof result === "object" &&
    result !== null &&
    !Array.isArray(result) &&
    result.visibleReplySent === false
  );
}
function markChannelDeliveryErrorVisible(error) {
  if (typeof error === "object" && error !== null && !Array.isArray(error))
    try {
      Object.assign(error, {
        sentBeforeError: true,
        visibleReplySent: true,
      });
      return error;
    } catch {}
  const visibleError = new Error("visible channel reply delivery failed", { cause: error });
  Object.assign(visibleError, {
    sentBeforeError: true,
    visibleReplySent: true,
  });
  return visibleError;
}
async function runChannelDeliveryObserver(params) {
  if (!params.onDelivered) return;
  try {
    await params.onDelivered(params.payload, params.info, params.result);
  } catch (error) {
    throw isExplicitlyNonVisibleChannelDelivery(params.result)
      ? error
      : markChannelDeliveryErrorVisible(error);
  }
}
function resolveBotLoopProtectionDrop(params) {
  if (!params.botLoopProtection) return;
  if (!recordChannelBotPairLoopAndCheckSuppression(params.botLoopProtection).suppressed) return;
  const admission = {
    kind: "drop",
    reason: "bot-loop-protection",
  };
  emit({
    ...params,
    event: {
      stage: "authorize",
      event: "drop",
      messageId: params.messageId,
      sessionKey: params.ctxPayload.SessionKey ?? params.routeSessionKey,
      admission: admission.kind,
      reason: admission.reason,
    },
  });
  return {
    admission,
    dispatched: false,
    ctxPayload: params.ctxPayload,
    routeSessionKey: params.routeSessionKey,
  };
}
async function dispatchAssembledChannelTurn(params) {
  const replyPipeline = resolveAssembledReplyPipeline(params);
  return await runPreparedChannelTurnCore(
    {
      channel: params.channel,
      accountId: params.accountId,
      routeSessionKey: params.routeSessionKey,
      storePath: params.storePath,
      ctxPayload: params.ctxPayload,
      recordInboundSession: params.recordInboundSession,
      afterRecord: params.afterRecord,
      record: params.record,
      history: params.history,
      admission: params.admission,
      botLoopProtection: params.botLoopProtection,
      log: params.log,
      messageId: params.messageId,
      runDispatch: async () =>
        await params.dispatchReplyWithBufferedBlockDispatcher({
          ctx: params.ctxPayload,
          cfg: params.cfg,
          dispatcherOptions: {
            ...replyPipeline.dispatcherOptions,
            deliver: async (payload, info) => {
              const preparedPayload = params.delivery.preparePayload
                ? await params.delivery.preparePayload(payload, info)
                : payload;
              const durableOptions =
                typeof params.delivery.durable === "function"
                  ? await params.delivery.durable(preparedPayload, info)
                  : params.delivery.durable;
              if (durableOptions) {
                const durable = await deliverInboundReplyWithMessageSendContext({
                  cfg: params.cfg,
                  channel: params.channel,
                  accountId: params.accountId,
                  agentId: params.agentId,
                  ctxPayload: params.ctxPayload,
                  payload: preparedPayload,
                  info,
                  ...durableOptions,
                });
                throwIfDurableInboundReplyDeliveryFailed(durable);
                if (isDurableInboundReplyDeliveryHandled(durable)) {
                  await runChannelDeliveryObserver({
                    onDelivered: params.delivery.onDelivered,
                    payload: preparedPayload,
                    info,
                    result: durable.delivery,
                  });
                  return durable.delivery;
                }
              }
              const result = await params.delivery.deliver(preparedPayload, info);
              await runChannelDeliveryObserver({
                onDelivered: params.delivery.onDelivered,
                payload: preparedPayload,
                info,
                result,
              });
              return result;
            },
            onError: params.delivery.onError,
          },
          toolsAllow: params.toolsAllow,
          replyOptions: replyPipeline.replyOptions,
          replyResolver: params.replyResolver,
        }),
    },
    { suppressObserveOnlyDispatch: false },
  );
}
const dispatchChannelInboundReply = dispatchAssembledChannelTurn;
function isPreparedChannelTurn(value) {
  return "runDispatch" in value;
}
async function dispatchResolvedChannelTurn(params) {
  if (isPreparedChannelTurn(params)) return await runPreparedChannelTurn(params);
  return await dispatchAssembledChannelTurn(params);
}
async function runPreparedChannelTurnCore(params, options) {
  return await runWithDiagnosticTraceContext(createDiagnosticTraceContextFromActiveScope(), () =>
    runPreparedChannelTurnCoreInTrace(params, options),
  );
}
async function runPreparedChannelTurnCoreInTrace(params, options) {
  const admission = params.admission ?? { kind: "dispatch" };
  const botLoopDrop = resolveBotLoopProtectionDrop(params);
  if (botLoopDrop) {
    clearPendingHistoryAfterTurn(params.history);
    return botLoopDrop;
  }
  emit({
    ...params,
    event: {
      stage: "record",
      event: "start",
      messageId: params.messageId,
      sessionKey: params.ctxPayload.SessionKey ?? params.routeSessionKey,
      admission: admission.kind,
    },
  });
  try {
    await params.recordInboundSession({
      storePath: params.storePath,
      sessionKey: params.ctxPayload.SessionKey ?? params.routeSessionKey,
      ctx: params.ctxPayload,
      groupResolution: params.record?.groupResolution,
      createIfMissing: params.record?.createIfMissing,
      updateLastRoute: params.record?.updateLastRoute,
      onRecordError: params.record?.onRecordError ?? (() => void 0),
      trackSessionMetaTask: params.record?.trackSessionMetaTask,
    });
    emit({
      ...params,
      event: {
        stage: "record",
        event: "done",
        messageId: params.messageId,
        sessionKey: params.ctxPayload.SessionKey ?? params.routeSessionKey,
        admission: admission.kind,
      },
    });
    await params.afterRecord?.();
  } catch (err) {
    emit({
      ...params,
      event: {
        stage: "record",
        event: "error",
        messageId: params.messageId,
        sessionKey: params.ctxPayload.SessionKey ?? params.routeSessionKey,
        admission: admission.kind,
        error: err,
      },
    });
    try {
      await params.onPreDispatchFailure?.(err);
    } catch {}
    throw err;
  }
  emit({
    ...params,
    event: {
      stage: "dispatch",
      event: "start",
      messageId: params.messageId,
      sessionKey: params.ctxPayload.SessionKey ?? params.routeSessionKey,
      admission: admission.kind,
    },
  });
  let dispatchResult;
  try {
    dispatchResult =
      options.suppressObserveOnlyDispatch && admission.kind === "observeOnly"
        ? resolveObserveOnlyDispatchResult(params)
        : await params.runDispatch();
    maybeWarnZeroCountVisibleDispatch({
      ...params,
      admission,
      dispatchResult,
    });
  } catch (err) {
    emit({
      ...params,
      event: {
        stage: "dispatch",
        event: "error",
        messageId: params.messageId,
        sessionKey: params.ctxPayload.SessionKey ?? params.routeSessionKey,
        admission: admission.kind,
        error: err,
      },
    });
    throw err;
  }
  emit({
    ...params,
    event: {
      stage: "dispatch",
      event: "done",
      messageId: params.messageId,
      sessionKey: params.ctxPayload.SessionKey ?? params.routeSessionKey,
      admission: admission.kind,
    },
  });
  clearPendingHistoryAfterTurn(params.history);
  return {
    admission,
    dispatched: true,
    ctxPayload: params.ctxPayload,
    routeSessionKey: params.routeSessionKey,
    dispatchResult,
  };
}
async function runPreparedChannelTurn(params) {
  return await runPreparedChannelTurnCore(params, { suppressObserveOnlyDispatch: true });
}
const runPreparedInboundReply = runPreparedChannelTurn;
async function runChannelTurn(params) {
  emit({
    ...params,
    event: {
      stage: "ingest",
      event: "start",
    },
  });
  const input = await params.adapter.ingest(params.raw);
  if (!input) {
    const admission = {
      kind: "drop",
      reason: "ingest-null",
    };
    emit({
      ...params,
      event: {
        stage: "ingest",
        event: "drop",
        admission: admission.kind,
        reason: admission.reason,
      },
    });
    return {
      admission,
      dispatched: false,
    };
  }
  emit({
    ...params,
    event: {
      stage: "ingest",
      event: "done",
      messageId: input.id,
    },
  });
  const eventClass = (await params.adapter.classify?.(input)) ?? DEFAULT_EVENT_CLASS;
  if (!eventClass.canStartAgentTurn) {
    const admission = {
      kind: "handled",
      reason: `event:${eventClass.kind}`,
    };
    emit({
      ...params,
      event: {
        stage: "classify",
        event: "handled",
        messageId: input.id,
        admission: admission.kind,
        reason: admission.reason,
      },
    });
    return {
      admission,
      dispatched: false,
    };
  }
  const preflight = normalizePreflight(await params.adapter.preflight?.(input, eventClass));
  const preflightAdmission = preflight.admission;
  if (
    preflightAdmission &&
    preflightAdmission.kind !== "dispatch" &&
    preflightAdmission.kind !== "observeOnly"
  ) {
    await recordDroppedChannelTurnHistory({
      input,
      preflight,
      admission: preflightAdmission,
    });
    emit({
      ...params,
      event: {
        stage: "preflight",
        event: preflightAdmission.kind === "handled" ? "handled" : "drop",
        messageId: input.id,
        admission: preflightAdmission.kind,
        reason: preflightAdmission.reason,
      },
    });
    return {
      admission: preflightAdmission,
      dispatched: false,
    };
  }
  const resolved = await params.adapter.resolveTurn(input, eventClass, preflight);
  emit({
    ...params,
    accountId: resolved.accountId ?? params.accountId,
    event: {
      stage: "assemble",
      event: "done",
      messageId: input.id,
      sessionKey: resolved.routeSessionKey,
      admission: resolved.admission?.kind ?? "dispatch",
    },
  });
  const admission = resolved.admission ?? preflightAdmission ?? { kind: "dispatch" };
  let result;
  try {
    const dispatchResult = await dispatchResolvedChannelTurn(
      "runDispatch" in resolved
        ? {
            ...resolved,
            ...(admission.kind === "observeOnly"
              ? { delivery: createNoopChannelEventDeliveryAdapter() }
              : {}),
            admission,
            log: params.log,
            messageId: input.id,
          }
        : {
            ...resolved,
            ...(admission.kind === "observeOnly"
              ? { delivery: createNoopChannelEventDeliveryAdapter() }
              : {}),
            admission,
            log: params.log,
            messageId: input.id,
            ...(params.onTurnAdopted ? { onTurnAdopted: params.onTurnAdopted } : {}),
          },
    );
    result = dispatchResult.dispatched
      ? {
          ...dispatchResult,
          admission,
        }
      : dispatchResult;
  } catch (err) {
    const failedResult = {
      admission,
      dispatched: false,
      ctxPayload: resolved.ctxPayload,
      routeSessionKey: resolved.routeSessionKey,
    };
    try {
      await params.adapter.onFinalize?.(failedResult);
    } catch {}
    emit({
      ...params,
      accountId: resolved.accountId ?? params.accountId,
      event: {
        stage: "finalize",
        event: "done",
        messageId: input.id,
        sessionKey: resolved.routeSessionKey,
        admission: admission.kind,
      },
    });
    throw err;
  }
  try {
    await params.adapter.onFinalize?.(result);
    emit({
      ...params,
      accountId: resolved.accountId ?? params.accountId,
      event: {
        stage: "finalize",
        event: "done",
        messageId: input.id,
        sessionKey: resolved.routeSessionKey,
        admission: admission.kind,
      },
    });
  } catch (err) {
    emit({
      ...params,
      accountId: resolved.accountId ?? params.accountId,
      event: {
        stage: "finalize",
        event: "error",
        messageId: input.id,
        sessionKey: resolved.routeSessionKey,
        admission: admission.kind,
        error: err,
      },
    });
    throw err;
  }
  return result;
}
const runChannelInboundEvent = runChannelTurn;
//#endregion
export {
  runPreparedInboundReply as a,
  throwIfDurableInboundReplyDeliveryFailed as c,
  resolveChannelTurnDispatchCounts as d,
  recordChannelBotPairLoopAndCheckSuppression as f,
  toInboundMediaFacts as g,
  toHistoryMediaEntries as h,
  runChannelInboundEvent as i,
  hasFinalChannelTurnDispatch as l,
  formatInboundMediaUnavailableText as m,
  dispatchChannelInboundReply as n,
  deliverInboundReplyWithMessageSendContext as o,
  buildChannelInboundMediaPayload as p,
  recordDroppedChannelInboundHistory as r,
  isDurableInboundReplyDeliveryHandled as s,
  dispatchAssembledChannelTurn as t,
  hasVisibleChannelTurnDispatch as u,
};
