import { t as createAbortError } from "./abort-signal-DEbc_zqk.js";
import { n as resolveOutboundChannelMessageAdapter } from "./channel-resolution-B-NyvoRP.js";
import "./src-Bl7G9qvi.js";
import {
  c as resolveTextChunkLimit,
  i as chunkMarkdownTextWithMode,
  n as chunkByParagraph,
  s as resolveChunkMode,
} from "./chunk-DtO_2oor.js";
import { t as OutboundDeliveryError } from "./deliver-types-eQDro8Up.js";
import {
  _ as runOutboundDeliveryCommitHooks,
  a as emitOutboundAuditTerminals,
  c as ackDelivery,
  d as failDeliveryAfterPlatformSend,
  f as failDeliveryBeforePlatformSend,
  g as attachOutboundDeliveryCommitHook,
  h as markDeliveryPlatformSendDispatched,
  i as completedOutboundAuditTerminals,
  l as enqueueDelivery,
  m as markDeliveryPlatformSendAttemptStarted,
  o as failedOutboundAuditTerminals,
  p as markDeliveryPlatformOutcomeUnknown,
  r as withActiveDeliveryClaim,
  s as uniformOutboundAuditTerminals,
  u as failDelivery,
  v as resolveDeferredDeliveryAdmission,
} from "./delivery-queue-DAslzmpt.js";
import { a as isProvenDeliveryNotSentError } from "./delivery-recovery.shared-DWd08Xjm.js";
import { t as diagnosticErrorCategory } from "./diagnostic-error-metadata-yrw7ASmg.js";
import { a as emitInternalDiagnosticEvent } from "./diagnostic-events-5-gsFhkM.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { t as getGlobalHookRunner, u as fireAndForgetHook } from "./hook-runner-global-CPEPIvCK.js";
import { n as adaptMessagePresentationForChannel } from "./interactive-jsbwR_sV.js";
import {
  m as triggerInternalHook,
  n as createInternalHookEvent,
} from "./internal-hooks-CckLIOgu.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { t as loadChannelOutboundAdapter } from "./load-1q60D_pJ.js";
import { n as hasTrustedMessageAuditListeners } from "./message-audit-events-CED2DE_D.js";
import {
  a as toInternalMessageSentContext,
  d as toPluginMessageSentEvent,
  l as toPluginMessageContext,
  t as buildCanonicalSentMessageHookContext,
} from "./message-hook-mappers-D15eDaaQ.js";
import {
  a as hasReplyPayloadContent,
  l as normalizeMessagePresentation,
  p as renderMessagePresentationFallbackText,
} from "./payload-BFbDi85B.js";
import {
  l as summarizeOutboundPayloadForTransport,
  t as createOutboundPayloadPlan,
} from "./payloads-BRNPux3W.js";
import { t as stripInternalRuntimeScaffolding } from "./protocol-scaffolding-DMClPiYZ.js";
import { t as resolveAgentScopedOutboundMediaAccess } from "./read-capability-CCrxf9p7.js";
import { i as copyReplyPayloadMetadata } from "./reply-payload-BK_jICQ3.js";
import { C as createReplyToDeliveryPolicy } from "./reply-payload-DDwHXDkv.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { t as resolveMirroredTranscriptText } from "./transcript-mirror-BUJrk10q.js";
import { a as unknownSendReconciliationKinds } from "./types-GcWljJIT.js";
//#region src/auto-reply/reply/reply-payload-sending-hook.ts
/** Runs plugin hooks that may rewrite or cancel an outbound reply payload. */
async function runReplyPayloadSendingHook(params) {
  const hookRunner = getGlobalHookRunner();
  if (!hookRunner?.hasHooks("reply_payload_sending")) return params.payload;
  const result = await hookRunner.runReplyPayloadSending(
    {
      payload: params.payload,
      kind: params.kind,
      channel: params.channel,
      sessionKey: params.sessionKey,
      runId: params.runId,
      usageState: params.usageState,
    },
    params.context,
  );
  if (result?.cancel) return null;
  const payload = result?.payload ?? params.payload;
  return copyReplyPayloadMetadata(params.payload, payload);
}
//#endregion
//#region src/channels/message/rendered-batch.ts
function countMedia(payload) {
  return (payload.mediaUrls?.filter(Boolean).length ?? 0) + (payload.mediaUrl ? 1 : 0);
}
function collectMediaUrls(payload) {
  return [payload.mediaUrl, ...(payload.mediaUrls ?? [])]
    .map((url) => url?.trim())
    .filter((url) => Boolean(url));
}
function createRenderedMessageBatchPlanItem(payload, index) {
  const text = payload.text?.trim();
  const mediaUrls = collectMediaUrls(payload);
  const presentationBlockCount = payload.presentation?.blocks?.length ?? 0;
  const kinds = [];
  if (text) kinds.push("text");
  if (mediaUrls.length > 0) kinds.push(payload.audioAsVoice ? "voice" : "media");
  if (presentationBlockCount > 0) kinds.push("presentation");
  if (payload.interactive) kinds.push("interactive");
  if (payload.channelData || payload.location) kinds.push("channelData");
  return {
    index,
    kinds: kinds.length > 0 ? kinds : ["empty"],
    ...(text ? { text } : {}),
    mediaUrls,
    ...(payload.audioAsVoice && mediaUrls.length > 0 ? { audioAsVoice: true } : {}),
    ...(presentationBlockCount > 0 ? { presentationBlockCount } : {}),
    ...(payload.interactive ? { hasInteractive: true } : {}),
    ...(payload.channelData || payload.location ? { hasChannelData: true } : {}),
  };
}
/** Summarizes rendered reply payloads so delivery can choose adapter paths and recovery metadata. */
function createRenderedMessageBatchPlan(payloads) {
  const items = payloads.map(createRenderedMessageBatchPlanItem);
  return payloads.reduce(
    (plan, payload) => {
      const text = payload.text?.trim();
      const mediaCount = countMedia(payload);
      return {
        payloadCount: plan.payloadCount + 1,
        textCount: plan.textCount + (text ? 1 : 0),
        mediaCount: plan.mediaCount + mediaCount,
        voiceCount: plan.voiceCount + (payload.audioAsVoice && mediaCount > 0 ? 1 : 0),
        presentationCount: plan.presentationCount + (payload.presentation?.blocks?.length ? 1 : 0),
        interactiveCount: plan.interactiveCount + (payload.interactive ? 1 : 0),
        channelDataCount: plan.channelDataCount + (payload.channelData || payload.location ? 1 : 0),
        items: plan.items,
      };
    },
    {
      payloadCount: 0,
      textCount: 0,
      mediaCount: 0,
      voiceCount: 0,
      presentationCount: 0,
      interactiveCount: 0,
      channelDataCount: 0,
      items,
    },
  );
}
/** Pairs reply payloads with their render plan for durable send and live-preview flows. */
function createRenderedMessageBatch(payloads) {
  return {
    payloads,
    plan: createRenderedMessageBatchPlan(payloads),
  };
}
//#endregion
//#region src/infra/outbound/abort.ts
/**
 * Throws an AbortError if the given signal has been aborted.
 * Use at async checkpoints to support cancellation.
 */
function throwIfAborted(abortSignal) {
  if (abortSignal?.aborted) throw createAbortError("Operation aborted");
}
//#endregion
//#region src/infra/outbound/message-plan.ts
function assertStableMediaFanout(params, payloadIndex, originalMediaCount, effective) {
  if (!params.requiredUnknownSendReconciliation) return;
  if (
    (params.renderedBatchPlan?.items[payloadIndex]?.mediaUrls.length ?? originalMediaCount) !==
    effective.mediaUrls.length
  )
    throw new Error(
      `Required durable message send changed platform fan-out after outbound transforms for ${params.channel}`,
    );
}
function withPlannedReplyTo(overrides, consumeReplyTo) {
  return consumeReplyTo ? consumeReplyTo({ ...overrides }) : { ...overrides };
}
function withChunkedTextFormatting(overrides, formatting) {
  return formatting
    ? {
        ...overrides,
        formatting: {
          ...overrides.formatting,
          ...formatting,
        },
      }
    : overrides;
}
function chunkTextForPlan(params) {
  return params.formatting
    ? params.chunker(params.text, params.limit, { formatting: params.formatting })
    : params.chunker(params.text, params.limit);
}
/**
 * Plans text sends, preserving reply-to policy across chunked delivery units.
 */
function planOutboundTextMessageUnits(params) {
  const planTextUnit = (text, deliveryPartIndex) => ({
    kind: "text",
    text,
    overrides: {
      ...withPlannedReplyTo(params.overrides, params.consumeReplyTo),
      deliveryPartIndex,
    },
  });
  const planChunkedTextUnit = (text, deliveryPartIndex) => {
    const unit = planTextUnit(text, deliveryPartIndex);
    return {
      ...unit,
      overrides: withChunkedTextFormatting(unit.overrides, params.chunkedTextFormatting),
    };
  };
  if (!params.chunker || params.textLimit === void 0) return [planTextUnit(params.text, 0)];
  if (params.chunkMode === "newline") {
    const blockChunks =
      (params.chunkerMode ?? "text") === "markdown"
        ? chunkMarkdownTextWithMode(params.text, params.textLimit, "newline")
        : chunkByParagraph(params.text, params.textLimit);
    if (!blockChunks.length && params.text) blockChunks.push(params.text);
    const units = [];
    for (const blockChunk of blockChunks) {
      const chunks = chunkTextForPlan({
        text: blockChunk,
        limit: params.textLimit,
        chunker: params.chunker,
        formatting: params.formatting,
      });
      if (!chunks.length && blockChunk) chunks.push(blockChunk);
      for (const chunk of chunks) units.push(planChunkedTextUnit(chunk, units.length));
    }
    return units;
  }
  return chunkTextForPlan({
    text: params.text,
    limit: params.textLimit,
    chunker: params.chunker,
    formatting: params.formatting,
  }).map(planChunkedTextUnit);
}
/**
 * Plans media sends with a caption only on the leading media unit.
 */
function planOutboundMediaMessageUnits(params) {
  return params.mediaUrls.map((mediaUrl, index) => ({
    kind: "media",
    mediaUrl,
    ...(index === 0 ? { caption: params.caption } : {}),
    overrides: {
      ...withPlannedReplyTo(params.overrides, params.consumeReplyTo),
      deliveryPartIndex: index,
    },
  }));
}
//#endregion
//#region src/infra/outbound/deliver.ts
const log = createSubsystemLogger("outbound/deliver");
const loadTranscriptRuntime = createLazyRuntimeModule(() => import("./transcript.runtime.js"));
const loadChannelBootstrapRuntime = createLazyRuntimeModule(
  () => import("./channel-bootstrap.runtime.js"),
);
async function resolveChannelOutboundDirectiveOptions(params) {
  return {
    extractMarkdownImages:
      (await loadBootstrappedOutboundAdapter(params))?.extractMarkdownImages === true
        ? true
        : void 0,
  };
}
async function createChannelHandler(params) {
  const outbound = await loadBootstrappedOutboundAdapter(params);
  const message = resolveOutboundChannelMessageAdapter(params);
  const handler = createPluginHandler({
    ...params,
    outbound,
    message,
  });
  if (!handler) throw new Error(`Outbound not configured for channel: ${params.channel}`);
  return handler;
}
async function loadBootstrappedOutboundAdapter(params) {
  let outbound = await loadChannelOutboundAdapter(params.channel);
  if (!outbound) {
    const { bootstrapOutboundChannelPlugin } = await loadChannelBootstrapRuntime();
    bootstrapOutboundChannelPlugin({
      channel: params.channel,
      cfg: params.cfg,
    });
    outbound = await loadChannelOutboundAdapter(params.channel);
  }
  return outbound;
}
async function runChannelMessageSendWithLifecycle(params) {
  if (!params.lifecycle) return { result: await params.send() };
  let attemptToken;
  try {
    attemptToken = await params.lifecycle.beforeSendAttempt?.(params.ctx);
    const result = await params.send();
    const successCtx = {
      ...params.ctx,
      result,
      ...(attemptToken !== void 0 ? { attemptToken } : {}),
    };
    try {
      await params.lifecycle.afterSendSuccess?.(successCtx);
    } catch (successHookError) {
      log.warn(
        `channel message send success hook failed after platform send; preserving send result: ${formatErrorMessage(successHookError)}`,
      );
    }
    return {
      result,
      ...(params.lifecycle.afterCommit
        ? {
            afterCommit: async () => {
              await params.lifecycle?.afterCommit?.(successCtx);
            },
          }
        : {}),
    };
  } catch (error) {
    try {
      await params.lifecycle.afterSendFailure?.({
        ...params.ctx,
        error,
        ...(attemptToken !== void 0 ? { attemptToken } : {}),
      });
    } catch (cleanupError) {
      log.warn(
        `channel message send failure cleanup failed; preserving original send error: ${formatErrorMessage(cleanupError)}`,
      );
    }
    throw error;
  }
}
async function resolveOutboundDurableFinalDeliverySupport(params) {
  const outbound = await loadBootstrappedOutboundAdapter(params);
  const message = resolveOutboundChannelMessageAdapter(params);
  if (!message?.send?.text && !outbound?.sendText)
    return {
      ok: false,
      reason: "missing_outbound_handler",
    };
  const messageDurableFinal = message?.durableFinal;
  const durableFinal =
    messageDurableFinal?.capabilities ?? outbound?.deliveryCapabilities?.durableFinal;
  for (const [capability, required] of Object.entries(params.requirements ?? {})) {
    if (required === true && durableFinal?.[capability] !== true)
      return {
        ok: false,
        reason: "capability_mismatch",
        capability,
      };
    if (
      required === true &&
      capability === "reconcileUnknownSend" &&
      typeof messageDurableFinal?.reconcileUnknownSend !== "function"
    )
      return {
        ok: false,
        reason: "capability_mismatch",
        capability,
      };
  }
  if (params.requirements?.reconcileUnknownSend === true) {
    const supportedKinds = messageDurableFinal?.reconcileUnknownSendKinds;
    for (const kind of unknownSendReconciliationKinds)
      if (
        supportedKinds !== void 0 &&
        params.requirements[kind] === true &&
        supportedKinds[kind] !== true
      )
        return {
          ok: false,
          reason: "capability_mismatch",
          capability: "reconcileUnknownSend",
        };
  }
  return { ok: true };
}
function createPluginHandler(params) {
  const outbound = params.outbound;
  const messageText = params.message?.send?.text;
  const messageMedia = params.message?.send?.media;
  const messagePayload = params.message?.send?.payload;
  const messageLifecycle = params.message?.send?.lifecycle;
  const assertUnknownSendReconciliationKind = (kind) => {
    const durableFinal = params.message?.durableFinal;
    if (
      !params.requiredUnknownSendReconciliation ||
      durableFinal?.capabilities?.reconcileUnknownSend !== true
    )
      return;
    if (
      durableFinal.reconcileUnknownSendKinds !== void 0 &&
      durableFinal.reconcileUnknownSendKinds[kind] !== true
    )
      throw new Error(
        `Required durable message send became unsupported after outbound transforms: ${kind} unknown-send reconciliation is unavailable for ${params.channel}`,
      );
  };
  if (!messageText && !outbound?.sendText) return null;
  const baseCtx = createChannelOutboundContextBase(params);
  const sendText = outbound?.sendText;
  const sendMedia = outbound?.sendMedia;
  const chunker = outbound?.chunker ?? null;
  const chunkerMode = outbound?.chunkerMode;
  const onMessageDeliveryResult = params.onDeliveryResult
    ? async (result) => {
        await params.onDeliveryResult?.(normalizeChannelMessageSendResult(params.channel, result));
      }
    : void 0;
  const resolveCtx = (overrides) => ({
    ...baseCtx,
    replyToId: overrides && "replyToId" in overrides ? overrides.replyToId : baseCtx.replyToId,
    replyToIdSource:
      overrides && "replyToIdSource" in overrides
        ? overrides.replyToIdSource
        : baseCtx.replyToIdSource,
    threadId: overrides && "threadId" in overrides ? overrides.threadId : baseCtx.threadId,
    audioAsVoice: overrides?.audioAsVoice,
    deliveryPartIndex: overrides?.deliveryPartIndex,
    formatting:
      overrides && "formatting" in overrides
        ? {
            ...baseCtx.formatting,
            ...overrides.formatting,
          }
        : baseCtx.formatting,
  });
  const buildTargetRef = (overrides) => ({
    channel: params.channel,
    to: params.to,
    accountId: params.accountId ?? void 0,
    threadId: overrides?.threadId ?? baseCtx.threadId,
  });
  return {
    chunker,
    chunkerMode,
    chunkedTextFormatting: outbound?.chunkedTextFormatting,
    textChunkLimit: outbound?.textChunkLimit,
    supportsMedia: Boolean(messageMedia ?? sendMedia),
    sanitizeText: outbound?.sanitizeText
      ? (payload) =>
          outbound.sanitizeText({
            text: payload.text ?? "",
            payload,
          })
      : void 0,
    normalizePayload: outbound?.normalizePayload
      ? (payload) =>
          outbound.normalizePayload({
            payload,
            cfg: params.cfg,
            accountId: params.accountId,
          })
      : void 0,
    sendTextOnlyErrorPayloads: outbound?.sendTextOnlyErrorPayloads === true,
    presentationCapabilities: outbound?.presentationCapabilities,
    renderPresentation: outbound?.renderPresentation
      ? async (payload) => {
          const presentation = normalizeMessagePresentation(payload.presentation);
          if (!presentation) return payload;
          const ctx = {
            ...resolveCtx({
              replyToId: payload.replyToId ?? baseCtx.replyToId,
              threadId: baseCtx.threadId,
              audioAsVoice: payload.audioAsVoice,
            }),
            text: payload.text ?? "",
            mediaUrl: payload.mediaUrl,
            payload,
          };
          return await outbound.renderPresentation({
            payload,
            presentation,
            ctx,
          });
        }
      : void 0,
    pinDeliveredMessage: outbound?.pinDeliveredMessage
      ? async ({ target, messageId, pin, gatewayClientScopes }) =>
          outbound.pinDeliveredMessage({
            cfg: params.cfg,
            target,
            messageId,
            pin,
            gatewayClientScopes,
          })
      : void 0,
    afterDeliverPayload: outbound?.afterDeliverPayload
      ? async ({ target, payload, results }) =>
          outbound.afterDeliverPayload({
            cfg: params.cfg,
            target,
            payload,
            results,
          })
      : void 0,
    shouldSkipPlainTextSanitization: outbound?.shouldSkipPlainTextSanitization
      ? (payload) => outbound.shouldSkipPlainTextSanitization({ payload })
      : void 0,
    resolveEffectiveTextChunkLimit: outbound?.resolveEffectiveTextChunkLimit
      ? (fallbackLimit) =>
          outbound.resolveEffectiveTextChunkLimit({
            cfg: params.cfg,
            accountId: params.accountId ?? void 0,
            fallbackLimit,
          })
      : void 0,
    sendPayload:
      messagePayload || outbound?.sendPayload
        ? async (payload, overrides) => {
            const payloadCtx = {
              ...resolveCtx(overrides),
              kind: "payload",
              text: payload.text ?? "",
              mediaUrl: payload.mediaUrl,
              payload,
            };
            assertUnknownSendReconciliationKind("payload");
            if (messagePayload) {
              const messagePayloadCtx = {
                ...payloadCtx,
                onDeliveryResult: onMessageDeliveryResult,
              };
              const sent = await runChannelMessageSendWithLifecycle({
                lifecycle: messageLifecycle,
                ctx: messagePayloadCtx,
                send: async () => {
                  await params.onPlatformSendStart?.(messagePayloadCtx);
                  return await messagePayload(messagePayloadCtx);
                },
              });
              return attachOutboundDeliveryCommitHook(
                normalizeChannelMessageSendResult(params.channel, sent.result),
                sent.afterCommit,
              );
            }
            await params.onPlatformSendStart?.(payloadCtx);
            return outbound.sendPayload(payloadCtx);
          }
        : void 0,
    sendFormattedText: outbound?.sendFormattedText
      ? async (text, overrides) => {
          const formattedCtx = {
            ...resolveCtx(overrides),
            text,
          };
          assertUnknownSendReconciliationKind("text");
          await params.onPlatformSendStart?.(formattedCtx);
          return await outbound.sendFormattedText(formattedCtx);
        }
      : void 0,
    sendFormattedMedia: outbound?.sendFormattedMedia
      ? async (caption, mediaUrl, overrides) => {
          const formattedCtx = {
            ...resolveCtx(overrides),
            text: caption,
            mediaUrl,
          };
          assertUnknownSendReconciliationKind("media");
          await params.onPlatformSendStart?.(formattedCtx);
          return await outbound.sendFormattedMedia(formattedCtx);
        }
      : void 0,
    sendText: async (text, overrides) => {
      const textCtx = {
        ...resolveCtx(overrides),
        kind: "text",
        text,
      };
      assertUnknownSendReconciliationKind("text");
      if (messageText) {
        const messageTextCtx = {
          ...textCtx,
          onDeliveryResult: onMessageDeliveryResult,
        };
        const sent = await runChannelMessageSendWithLifecycle({
          lifecycle: messageLifecycle,
          ctx: messageTextCtx,
          send: async () => {
            await params.onPlatformSendStart?.(messageTextCtx);
            return await messageText(messageTextCtx);
          },
        });
        return attachOutboundDeliveryCommitHook(
          normalizeChannelMessageSendResult(params.channel, sent.result),
          sent.afterCommit,
        );
      }
      await params.onPlatformSendStart?.(textCtx);
      return sendText(textCtx);
    },
    buildTargetRef,
    sendMedia: async (caption, mediaUrl, overrides) => {
      const mediaCtx = {
        ...resolveCtx(overrides),
        kind: "media",
        text: caption,
        mediaUrl,
      };
      assertUnknownSendReconciliationKind("media");
      if (messageMedia) {
        const messageMediaCtx = {
          ...mediaCtx,
          onDeliveryResult: onMessageDeliveryResult,
        };
        const sent = await runChannelMessageSendWithLifecycle({
          lifecycle: messageLifecycle,
          ctx: messageMediaCtx,
          send: async () => {
            await params.onPlatformSendStart?.(messageMediaCtx);
            return await messageMedia(messageMediaCtx);
          },
        });
        return attachOutboundDeliveryCommitHook(
          normalizeChannelMessageSendResult(params.channel, sent.result),
          sent.afterCommit,
        );
      }
      if (sendMedia) {
        await params.onPlatformSendStart?.(mediaCtx);
        return sendMedia(mediaCtx);
      }
      await params.onPlatformSendStart?.(mediaCtx);
      return sendText(mediaCtx);
    },
  };
}
function normalizeChannelMessageSendResult(channel, result) {
  const source = result;
  return {
    ...source,
    channel,
    messageId:
      source.messageId ??
      source.receipt.primaryPlatformMessageId ??
      source.receipt.platformMessageIds[0] ??
      "",
    receipt: source.receipt,
  };
}
function createChannelOutboundContextBase(params) {
  return {
    cfg: params.cfg,
    to: params.to,
    accountId: params.accountId,
    replyToId: params.replyToId,
    replyToMode: params.replyToMode,
    formatting: params.formatting,
    threadId: params.threadId,
    identity: params.identity,
    gifPlayback: params.gifPlayback,
    forceDocument: params.forceDocument,
    deps: params.deps,
    silent: params.silent,
    mediaAccess: params.mediaAccess,
    mediaLocalRoots: params.mediaAccess?.localRoots,
    mediaReadFile: params.mediaAccess?.readFile,
    gatewayClientScopes: params.gatewayClientScopes,
    deliveryQueueId: params.deliveryQueueId,
    onPlatformSendDispatch: params.onPlatformSendDispatch,
    onDeliveryResult: params.onDeliveryResult,
  };
}
const isAbortError = (err) => err instanceof Error && err.name === "AbortError";
const isDeliveryAbortError = (err) =>
  isAbortError(err) || (err instanceof OutboundDeliveryError && isAbortError(err.cause));
async function persistQueuedPreSendState(params) {
  try {
    await markDeliveryPlatformSendAttemptStarted(params.queueId, params.stateDir, {
      replyToId: params.route.replyToId ?? null,
    });
    return "marked";
  } catch (markErr) {
    if (params.queuePolicy === "required") throw markErr;
    log.warn(
      `failed to mark queued delivery ${params.queueId} as platform-send-attempt-started; removing replay intent before best-effort send: ${formatErrorMessage(markErr)}`,
    );
    await ackDelivery(params.queueId, params.stateDir);
    return "acked";
  }
}
async function persistQueuedPostSendState(params) {
  try {
    await markDeliveryPlatformOutcomeUnknown(params.queueId);
    return "marked";
  } catch (markErr) {
    log.warn(
      `failed to mark queued delivery ${params.queueId} as platform-outcome-unknown; falling back to direct ack (${params.queuePolicy}): ${formatErrorMessage(markErr)}`,
    );
    try {
      await ackDelivery(params.queueId);
      return "acked";
    } catch (ackErr) {
      const error = `post-send state persistence failed: marker=${formatErrorMessage(markErr)}; ack=${formatErrorMessage(ackErr)}`;
      await failDeliveryAfterPlatformSend(params.queueId, error);
      return "failed";
    }
  }
}
/**
 * Best-effort session identifier for delivery telemetry only. Falls back to
 * `policyKey` as a last resort so diagnostic emission still has a stable
 * string when neither mirror nor canonical key are available. **Do not use
 * this value for hook-context correlation** — use `sessionKeyForInternalHooks`
 * (mirror.sessionKey ?? session.key, no policyKey fallback) instead, so we
 * never accidentally hand the policy key to plugins that expect the canonical
 * session key.
 */
function sessionKeyForDeliveryDiagnostics(params) {
  return params.mirror?.sessionKey ?? params.session?.key ?? params.session?.policyKey;
}
function deliveryKindForPayload(payload, payloadSummary) {
  if (payloadSummary.mediaUrls.length > 0 || payload.mediaUrl || payload.mediaUrls?.length)
    return "media";
  if (payload.presentation || payload.interactive || payload.channelData || payload.audioAsVoice)
    return "other";
  return "text";
}
function emitMessageDeliveryStarted(params) {
  emitInternalDiagnosticEvent({
    type: "message.delivery.started",
    channel: params.channel,
    deliveryKind: params.deliveryKind,
    ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
  });
}
function emitMessageDeliveryCompleted(params) {
  emitInternalDiagnosticEvent({
    type: "message.delivery.completed",
    channel: params.channel,
    deliveryKind: params.deliveryKind,
    durationMs: params.durationMs,
    resultCount: params.resultCount,
    ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
  });
}
function emitMessageDeliveryError(params) {
  emitInternalDiagnosticEvent({
    type: "message.delivery.error",
    channel: params.channel,
    deliveryKind: params.deliveryKind,
    durationMs: params.durationMs,
    errorCategory: diagnosticErrorCategory(params.error),
    ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
  });
}
function normalizeEmptyPayloadForDelivery(payload) {
  const text = typeof payload.text === "string" ? payload.text : "";
  if (!text.trim()) {
    if (
      !hasReplyPayloadContent(
        {
          ...payload,
          text,
        },
        { extraContent: payload.location != null },
      )
    )
      return null;
    if (text)
      return {
        ...payload,
        text: "",
      };
  }
  return payload;
}
function normalizePayloadsForChannelDelivery(plan, handler) {
  const normalizedPayloads = [];
  for (const entry of plan) {
    let sanitizedPayload = stripInternalRuntimeScaffoldingFromPayload(entry.payload);
    if (handler.sanitizeText && sanitizedPayload.text) {
      if (!handler.shouldSkipPlainTextSanitization?.(sanitizedPayload))
        sanitizedPayload = {
          ...sanitizedPayload,
          text: handler.sanitizeText(sanitizedPayload),
        };
    }
    const normalizedPayload = handler.normalizePayload
      ? handler.normalizePayload(sanitizedPayload)
      : sanitizedPayload;
    const normalized = normalizedPayload
      ? normalizeEmptyPayloadForDelivery(
          stripInternalRuntimeScaffoldingFromPayload(normalizedPayload),
        )
      : null;
    if (normalized)
      normalizedPayloads.push({
        index: entry.sourceIndex,
        payload: normalized,
      });
  }
  return normalizedPayloads;
}
function stripInternalRuntimeScaffoldingFromValue(value) {
  if (typeof value === "string") return stripInternalRuntimeScaffolding(value);
  if (Array.isArray(value)) {
    let changed = false;
    const next = value.map((entry) => {
      const stripped = stripInternalRuntimeScaffoldingFromValue(entry);
      changed ||= stripped !== entry;
      return stripped;
    });
    return changed ? next : value;
  }
  if (!value || typeof value !== "object") return value;
  const proto = Object.getPrototypeOf(value);
  if (proto !== Object.prototype && proto !== null) return value;
  let changed = false;
  const next = {};
  for (const [key, entry] of Object.entries(value)) {
    const stripped = stripInternalRuntimeScaffoldingFromValue(entry);
    changed ||= stripped !== entry;
    next[key] = stripped;
  }
  return changed ? next : value;
}
function stripInternalRuntimeScaffoldingFromPayload(payload) {
  const stripped = stripInternalRuntimeScaffoldingFromValue(payload);
  return stripped && typeof stripped === "object" && !Array.isArray(stripped) ? stripped : payload;
}
function buildPayloadSummary(payload) {
  return summarizeOutboundPayloadForTransport(payload);
}
function hasDeliveryResultIdentity(result) {
  return Boolean(
    result.messageId ||
    result.chatId ||
    result.channelId ||
    result.roomId ||
    result.conversationId ||
    result.toJid ||
    result.pollId,
  );
}
function normalizeDeliveryPin(payload) {
  const pin = payload.delivery?.pin;
  if (pin === true) return { enabled: true };
  if (!pin || typeof pin !== "object" || Array.isArray(pin)) return;
  if (!pin.enabled) return;
  const normalized = { enabled: true };
  if (pin.notify === true) normalized.notify = true;
  if (pin.required === true) normalized.required = true;
  return normalized;
}
async function maybePinDeliveredMessage(params) {
  const pin = normalizeDeliveryPin(params.payload);
  if (!pin) return;
  if (!params.messageId) {
    if (pin.required)
      throw new Error("Delivery pin requested, but no delivered message id was returned.");
    log.warn("Delivery pin requested, but no delivered message id was returned.", {
      channel: params.target.channel,
      to: params.target.to,
    });
    return;
  }
  if (!params.handler.pinDeliveredMessage) {
    if (pin.required)
      throw new Error(`Delivery pin is not supported by channel: ${params.target.channel}`);
    log.warn("Delivery pin requested, but channel does not support pinning delivered messages.", {
      channel: params.target.channel,
      to: params.target.to,
    });
    return;
  }
  try {
    await params.handler.pinDeliveredMessage({
      target: params.target,
      messageId: params.messageId,
      pin,
      gatewayClientScopes: params.gatewayClientScopes,
    });
  } catch (err) {
    if (pin.required) throw err;
    log.warn("Delivery pin requested, but channel failed to pin delivered message.", {
      channel: params.target.channel,
      to: params.target.to,
      messageId: params.messageId,
      error: formatErrorMessage(err),
    });
  }
}
async function maybeNotifyAfterDeliveredPayload(params) {
  if (!params.handler.afterDeliverPayload || params.results.length === 0) return;
  try {
    await params.handler.afterDeliverPayload({
      target: params.target,
      payload: params.payload,
      results: params.results,
    });
  } catch (err) {
    log.warn("Plugin outbound adapter after-delivery hook failed.", {
      channel: params.target.channel,
      to: params.target.to,
      error: formatErrorMessage(err),
    });
  }
}
async function renderPresentationForDelivery(handler, payload) {
  const presentation = normalizeMessagePresentation(payload.presentation);
  if (!presentation) return payload;
  const adaptedPresentation = adaptMessagePresentationForChannel({
    presentation,
    capabilities: handler.presentationCapabilities,
  });
  const adaptedPayload = {
    ...payload,
    presentation: adaptedPresentation,
  };
  const rendered = handler.renderPresentation
    ? await handler.renderPresentation(adaptedPayload)
    : null;
  if (rendered) {
    const { presentation: _presentation, ...withoutPresentation } = rendered;
    return withoutPresentation;
  }
  const { presentation: _presentation, ...withoutPresentation } = payload;
  return {
    ...withoutPresentation,
    text: renderMessagePresentationFallbackText({
      text: payload.text,
      presentation: adaptedPresentation,
    }),
  };
}
function createMessageSentEmitter(params) {
  const hasMessageSentHooks = params.hookRunner?.hasHooks("message_sent") ?? false;
  const canEmitInternalHook = Boolean(params.sessionKeyForInternalHooks);
  const emitMessageSent = (event) => {
    if (!hasMessageSentHooks && !canEmitInternalHook) return;
    const canonical = buildCanonicalSentMessageHookContext({
      to: params.to,
      content: event.content,
      success: event.success,
      error: event.error,
      channelId: params.channel,
      accountId: params.accountId ?? void 0,
      conversationId: params.to,
      sessionKey: params.sessionKeyForInternalHooks,
      messageId: event.messageId,
      isGroup: params.mirrorIsGroup,
      groupId: params.mirrorGroupId,
    });
    if (hasMessageSentHooks)
      fireAndForgetHook(
        params.hookRunner.runMessageSent(
          toPluginMessageSentEvent(canonical),
          toPluginMessageContext(canonical),
        ),
        "deliverOutboundPayloads: message_sent plugin hook failed",
        (message) => {
          log.warn(message);
        },
      );
    if (!canEmitInternalHook) return;
    fireAndForgetHook(
      triggerInternalHook(
        createInternalHookEvent(
          "message",
          "sent",
          params.sessionKeyForInternalHooks,
          toInternalMessageSentContext(canonical),
        ),
      ),
      "deliverOutboundPayloads: message:sent internal hook failed",
      (message) => {
        log.warn(message);
      },
    );
  };
  return {
    emitMessageSent,
    hasMessageSentHooks,
  };
}
async function applyMessageSendingHook(params) {
  if (!params.enabled)
    return {
      cancelled: false,
      contentRewritten: false,
      payload: params.payload,
      payloadSummary: params.payloadSummary,
    };
  try {
    const sendingResult = await params.hookRunner.runMessageSending(
      {
        to: params.to,
        content: params.payloadSummary.hookContent ?? params.payloadSummary.text,
        replyToId: params.replyToId ?? void 0,
        threadId: params.threadId ?? void 0,
        metadata: {
          channel: params.channel,
          accountId: params.accountId,
          mediaUrls: params.payloadSummary.mediaUrls,
        },
      },
      {
        channelId: params.channel,
        accountId: params.accountId ?? void 0,
        conversationId: params.to,
        ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
      },
    );
    if (sendingResult?.cancel)
      return {
        cancelled: true,
        ...(sendingResult.cancelReason ? { cancelReason: sendingResult.cancelReason } : {}),
        ...(sendingResult.metadata ? { hookMetadata: sendingResult.metadata } : {}),
        contentRewritten: false,
        payload: params.payload,
        payloadSummary: params.payloadSummary,
      };
    if (sendingResult?.content == null)
      return {
        cancelled: false,
        contentRewritten: false,
        payload: params.payload,
        payloadSummary: params.payloadSummary,
      };
    if (params.payloadSummary.hookContent && !params.payloadSummary.text) {
      const spokenText = sendingResult.content;
      return {
        cancelled: false,
        contentRewritten: true,
        payload: {
          ...params.payload,
          spokenText,
        },
        payloadSummary: {
          ...params.payloadSummary,
          hookContent: spokenText,
        },
      };
    }
    return {
      cancelled: false,
      contentRewritten: true,
      payload: {
        ...params.payload,
        text: sendingResult.content,
      },
      payloadSummary: {
        ...params.payloadSummary,
        text: sendingResult.content,
      },
    };
  } catch {
    return {
      cancelled: false,
      contentRewritten: false,
      payload: params.payload,
      payloadSummary: params.payloadSummary,
    };
  }
}
async function applyReplyPayloadSendingHook(params) {
  if (!params.hook)
    return {
      cancelled: false,
      payload: params.payload,
      changed: false,
    };
  const nextPayload = await runReplyPayloadSendingHook({
    payload: params.payload,
    kind: params.hook.kind,
    ...(params.hook.channel ? { channel: params.hook.channel } : {}),
    ...(params.hook.sessionKey ? { sessionKey: params.hook.sessionKey } : {}),
    ...(params.hook.runId ? { runId: params.hook.runId } : {}),
    context: params.hook.context,
  });
  if (!nextPayload)
    return {
      cancelled: true,
      payload: params.payload,
      changed: false,
    };
  return {
    cancelled: false,
    payload: nextPayload,
    changed: nextPayload !== params.payload,
  };
}
function toOutboundDeliveryError(params) {
  if (params.error instanceof OutboundDeliveryError) return params.error;
  return new OutboundDeliveryError(formatErrorMessage(params.error), {
    cause: params.error,
    results: params.results,
    payloadOutcomes: params.payloadOutcomes,
    stage: params.stage,
  });
}
function suppressedPayloadOutcome(params) {
  return {
    index: params.index,
    status: "suppressed",
    reason: params.reason,
    ...(params.hookEffect ? { hookEffect: params.hookEffect } : {}),
  };
}
/**
 * @deprecated Direct outbound delivery is compatibility/runtime substrate.
 * New message lifecycle code should use `sendDurableMessageBatch` from
 * `src/channels/message/send.ts` or `deliverInboundReplyWithMessageSendContext`
 * from `src/channels/turn/durable-delivery.ts`. Keep direct use only for
 * outbound substrate, recovery, and compatibility paths.
 */
async function deliverOutboundPayloads(params) {
  return await deliverOutboundPayloadsInternal(params);
}
async function deliverOutboundPayloadsInternal(params) {
  const auditStartedAt = Date.now();
  const { channel, to, payloads } = params;
  const emitPreQueueFailure = () => {
    if (params.deliveryQueueId !== void 0) return;
    emitOutboundAuditTerminals({
      context: params,
      terminals: () =>
        uniformOutboundAuditTerminals(params.payloads.length, {
          outcome: "failed",
          failureStage: "queue",
        }),
      startedAt: auditStartedAt,
    });
  };
  if (params.requireUnknownSendReconciliation === true && payloads.length !== 1) {
    emitPreQueueFailure();
    throw new Error(
      `Required durable message send is unsupported for ${channel}: unknown-send reconciliation requires exactly one payload`,
    );
  }
  if (params.deferredDeliveryAdmissionPassed !== true) {
    const admission = resolveDeferredDeliveryAdmission({
      cfg: params.cfg,
      channel,
      to,
      accountId: params.accountId,
      phase: "live",
    });
    if (admission.status === "permanent_rejection") {
      emitPreQueueFailure();
      throw new Error(admission.reason);
    }
  }
  const queuePolicy = params.queuePolicy ?? "best_effort";
  const queuePayloads = payloads.map(stripInternalRuntimeScaffoldingFromPayload);
  const queuePayloadsChanged = queuePayloads.some((payload, index) => payload !== payloads[index]);
  const renderedBatchPlan =
    params.renderedBatchPlan ?? createRenderedMessageBatchPlan(params.payloads);
  const queueRenderedBatchPlan = queuePayloadsChanged
    ? createRenderedMessageBatchPlan(queuePayloads)
    : renderedBatchPlan;
  const queueId = params.skipQueue
    ? null
    : await enqueueDelivery({
        channel,
        to,
        accountId: params.accountId,
        queuePolicy,
        requireUnknownSendReconciliation: params.requireUnknownSendReconciliation,
        payloads: queuePayloads,
        renderedBatchPlan: queueRenderedBatchPlan,
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
      }).catch((err) => {
        if (queuePolicy === "required") {
          emitPreQueueFailure();
          throw err;
        }
        return null;
      });
  if (queueId)
    params.onDeliveryIntent?.({
      id: queueId,
      channel,
      to,
      ...(params.accountId ? { accountId: params.accountId } : {}),
      queuePolicy,
    });
  if (!queueId) return await deliverOutboundPayloadsWithQueueCleanup(params, null, auditStartedAt);
  const claimResult = await withActiveDeliveryClaim(queueId, () =>
    deliverOutboundPayloadsWithQueueCleanup(params, queueId, auditStartedAt),
  );
  if (claimResult.status === "claimed-by-other-owner") return [];
  return claimResult.value;
}
async function deliverOutboundPayloadsWithQueueCleanup(params, queueId, auditStartedAt) {
  let hadPartialFailure = false;
  let lastPayloadError;
  let partialFailuresAreProvenNotSent = true;
  const ownsAuditTerminal = params.deliveryQueueId === void 0;
  const auditPayloadOutcomes = ownsAuditTerminal && hasTrustedMessageAuditListeners() ? [] : void 0;
  const queuePolicy = params.queuePolicy ?? "best_effort";
  const platformQueueId = queueId ?? params.deliveryQueueId;
  const platformQueuePolicy = queueId ? queuePolicy : (params.queuePolicy ?? "required");
  const platformQueueStateDir = queueId ? void 0 : params.deliveryQueueStateDir;
  const exactReconciliationRequired =
    params.requireUnknownSendReconciliation === true && platformQueueId !== void 0;
  let queuedPreSendState;
  let queuedPostSendState;
  let platformSendRoute;
  let deliveredResults = [];
  let commitHooksRun = false;
  const emitTerminals = (terminals) => {
    if (!ownsAuditTerminal) return;
    emitOutboundAuditTerminals({
      context: params,
      terminals,
      startedAt: auditStartedAt,
      ...(queueId ? { queueId } : {}),
    });
  };
  const runCommitHooksAfterAck = async () => {
    if (
      queuedPostSendState !== "acked" ||
      params.deferCommitHooks ||
      commitHooksRun ||
      deliveredResults.length === 0
    )
      return;
    commitHooksRun = true;
    await runOutboundDeliveryCommitHooks(deliveredResults);
  };
  const wrappedParams = {
    ...params,
    ...(exactReconciliationRequired && params.payloads.length === 1
      ? { deliveryQueueId: platformQueueId }
      : { deliveryQueueId: void 0 }),
    requiredUnknownSendReconciliation: exactReconciliationRequired,
    onPlatformSendStart: async (route) => {
      platformSendRoute = route;
      if (platformQueueId && !exactReconciliationRequired && queuedPreSendState === void 0) {
        queuedPreSendState = await persistQueuedPreSendState({
          queueId: platformQueueId,
          queuePolicy: platformQueuePolicy,
          stateDir: platformQueueStateDir,
          route,
        });
        if (queueId && queuedPreSendState === "acked") queuedPostSendState = "acked";
      }
      await params.onPlatformSendStart?.(route);
    },
    onPlatformSendDispatch: async () => {
      if (platformQueueId && queuedPreSendState !== "acked")
        try {
          await markDeliveryPlatformSendDispatched(
            platformQueueId,
            platformQueueStateDir,
            platformSendRoute,
          );
          queuedPreSendState ??= "marked";
        } catch (dispatchMarkError) {
          if (exactReconciliationRequired) throw dispatchMarkError;
          log.warn(
            `failed to refresh queued delivery ${platformQueueId} at platform dispatch; continuing best-effort send: ${formatErrorMessage(dispatchMarkError)}`,
          );
        }
      await params.onPlatformSendDispatch?.();
    },
    onError: (err, payload) => {
      hadPartialFailure = true;
      lastPayloadError = err;
      partialFailuresAreProvenNotSent &&= isProvenDeliveryNotSentError(err);
      params.onError?.(err, payload);
    },
    ...(auditPayloadOutcomes
      ? {
          onPayloadDeliveryOutcome: (outcome) => {
            auditPayloadOutcomes.push(outcome);
            params.onPayloadDeliveryOutcome?.(outcome);
          },
        }
      : {}),
    onDeliveryResult: async (result) => {
      deliveredResults.push(result);
      if (queueId && queuedPostSendState === void 0)
        queuedPostSendState = await persistQueuedPostSendState({
          queueId,
          queuePolicy,
        });
      await params.onDeliveryResult?.(result);
    },
  };
  let platformResultsReturned = false;
  try {
    const results = await deliverOutboundPayloadsCore(wrappedParams);
    deliveredResults = results;
    platformResultsReturned = true;
    if (!queueId) {
      if (!params.deferCommitHooks) await runOutboundDeliveryCommitHooks(results);
      emitTerminals(() =>
        hadPartialFailure
          ? failedOutboundAuditTerminals({
              payloadCount: params.payloads.length,
              results,
              payloadOutcomes: auditPayloadOutcomes ?? [],
              failureStage: "platform_send",
            })
          : completedOutboundAuditTerminals({
              payloadCount: params.payloads.length,
              results,
              payloadOutcomes: auditPayloadOutcomes ?? [],
            }),
      );
      return results;
    }
    if (queueId)
      if (hadPartialFailure) {
        const partialSendEvidence =
          results.length > 0 ||
          (lastPayloadError instanceof OutboundDeliveryError && lastPayloadError.sentBeforeError);
        const postSendState =
          queuedPostSendState ??
          (partialSendEvidence
            ? await persistQueuedPostSendState({
                queueId,
                queuePolicy,
              })
            : void 0);
        const error = "partial delivery failure (bestEffort)";
        if (postSendState === void 0 || postSendState === "marked")
          await (
            !partialSendEvidence && partialFailuresAreProvenNotSent
              ? failDeliveryBeforePlatformSend
              : failDelivery
          )(queueId, error).catch((err) => {
            log.warn(
              `failed to mark queued delivery ${queueId} as failed after partial failure; continuing best-effort delivery: ${formatErrorMessage(err)}`,
            );
          });
        else if (postSendState === "acked") {
          await runCommitHooksAfterAck();
          emitTerminals(() =>
            failedOutboundAuditTerminals({
              payloadCount: params.payloads.length,
              results,
              payloadOutcomes: auditPayloadOutcomes ?? [],
              failureStage: "platform_send",
            }),
          );
        }
      } else {
        const postSendState =
          queuedPostSendState ??
          (results.length > 0 || queuedPreSendState === "marked"
            ? await persistQueuedPostSendState({
                queueId,
                queuePolicy,
              })
            : queuedPreSendState === "acked"
              ? "acked"
              : void 0);
        if (
          postSendState === "acked"
            ? true
            : postSendState === "failed"
              ? false
              : await ackDelivery(queueId)
                  .then(() => true)
                  .catch(async (err) => {
                    const hasSendEvidence =
                      deliveredResults.length > 0 || queuedPreSendState !== void 0;
                    try {
                      if (hasSendEvidence) {
                        await failDeliveryAfterPlatformSend(
                          queueId,
                          `failed to ack sent delivery: ${formatErrorMessage(err)}`,
                        );
                        queuedPostSendState = "failed";
                      } else
                        await failDelivery(
                          queueId,
                          `failed to ack unsent delivery: ${formatErrorMessage(err)}`,
                        );
                    } catch (persistErr) {
                      log.warn(
                        `failed to preserve queued delivery ${queueId} after ack failure: ${formatErrorMessage(persistErr)}`,
                      );
                    }
                    if (queuePolicy === "required") throw err;
                    log.warn(
                      hasSendEvidence
                        ? `failed to ack queued delivery ${queueId}; preserved unknown-after-send state: ${formatErrorMessage(err)}`
                        : `failed to ack unsent queued delivery ${queueId}; retained it for retry: ${formatErrorMessage(err)}`,
                    );
                    return false;
                  })
        ) {
          queuedPostSendState = "acked";
          await runCommitHooksAfterAck();
          emitTerminals(() =>
            completedOutboundAuditTerminals({
              payloadCount: params.payloads.length,
              results,
              payloadOutcomes: auditPayloadOutcomes ?? [],
            }),
          );
        }
      }
    return results;
  } catch (err) {
    if (err instanceof OutboundDeliveryError && err.results.length > 0)
      deliveredResults = err.results;
    if (queueId) {
      if (isDeliveryAbortError(err)) {
        if (
          await ackDelivery(queueId)
            .then(() => true)
            .catch(() => false)
        )
          emitTerminals(() =>
            failedOutboundAuditTerminals({
              payloadCount: params.payloads.length,
              results: deliveredResults,
              payloadOutcomes: auditPayloadOutcomes ?? [],
              failureStage: "queue",
            }),
          );
      } else if (!platformResultsReturned)
        if (
          deliveredResults.length > 0 ||
          (err instanceof OutboundDeliveryError && err.sentBeforeError)
        ) {
          try {
            queuedPostSendState ??= await persistQueuedPostSendState({
              queueId,
              queuePolicy,
            });
            if (queuedPostSendState === "marked") {
              await failDeliveryAfterPlatformSend(queueId, formatErrorMessage(err));
              queuedPostSendState = "failed";
            }
          } catch (persistErr) {
            log.warn(
              `failed to preserve queued delivery ${queueId} post-send evidence: ${formatErrorMessage(persistErr)}`,
            );
          }
          await runCommitHooksAfterAck();
          if (queuedPostSendState === "acked")
            emitTerminals(() =>
              failedOutboundAuditTerminals({
                payloadCount: params.payloads.length,
                results: deliveredResults,
                payloadOutcomes: auditPayloadOutcomes ?? [],
                failureStage: err instanceof OutboundDeliveryError ? err.stage : "platform_send",
              }),
            );
        } else if (queuedPreSendState === "acked")
          emitTerminals(() =>
            failedOutboundAuditTerminals({
              payloadCount: params.payloads.length,
              results: deliveredResults,
              payloadOutcomes: auditPayloadOutcomes ?? [],
              failureStage: err instanceof OutboundDeliveryError ? err.stage : "platform_send",
            }),
          );
        else
          await (isProvenDeliveryNotSentError(err) ? failDeliveryBeforePlatformSend : failDelivery)(
            queueId,
            formatErrorMessage(err),
          ).catch((failErr) => {
            log.warn(
              `failed to mark queued delivery ${queueId} as failed: ${formatErrorMessage(failErr)}`,
            );
          });
    } else
      emitTerminals(() =>
        failedOutboundAuditTerminals({
          payloadCount: params.payloads.length,
          results: deliveredResults,
          payloadOutcomes: auditPayloadOutcomes ?? [],
          failureStage: err instanceof OutboundDeliveryError ? err.stage : "platform_send",
        }),
      );
    throw err;
  }
}
/** Core delivery logic (extracted for queue wrapper). */
async function deliverOutboundPayloadsCore(params) {
  const { cfg, channel, to, payloads } = params;
  const directiveOptions = await resolveChannelOutboundDirectiveOptions({
    cfg,
    channel,
  });
  const outboundPayloadPlan = createOutboundPayloadPlan(payloads, {
    cfg,
    sessionKey: params.session?.policyKey ?? params.session?.key,
    surface: channel,
    conversationType: params.session?.conversationType,
    extractMarkdownImages: directiveOptions.extractMarkdownImages,
  });
  const accountId = params.accountId;
  const deps = params.deps;
  const abortSignal = params.abortSignal;
  const results = [];
  let reportedResults = [];
  const resultIdentityKey = (delivery) =>
    JSON.stringify([
      delivery.channel,
      delivery.messageId,
      delivery.chatId,
      delivery.channelId,
      delivery.roomId,
      delivery.conversationId,
      delivery.timestamp,
      delivery.toJid,
      delivery.pollId,
    ]);
  const resultPlatformIds = (delivery, options) => {
    const ids = /* @__PURE__ */ new Set();
    const add = (value) => {
      const id = value?.trim();
      if (id && id !== "unknown" && id !== "suppressed") ids.add(id);
    };
    if (!options?.receiptOnly) add(delivery.messageId);
    add(delivery.receipt?.primaryPlatformMessageId);
    for (const id of delivery.receipt?.platformMessageIds ?? []) add(id);
    for (const part of delivery.receipt?.parts ?? []) add(part.platformMessageId);
    return ids;
  };
  const reportIdentifiedDeliveryResult = async (delivery) => {
    if (!hasDeliveryResultIdentity(delivery)) return;
    const resultIndex = results.length;
    results.push(delivery);
    reportedResults.push({
      identityKey: resultIdentityKey(delivery),
      resultIndex,
    });
    await params.onDeliveryResult?.(delivery);
  };
  const recordIdentifiedDeliveryResults = async (deliveries, options) => {
    const reportedByIdentity = /* @__PURE__ */ new Map();
    for (const reported of reportedResults) {
      const matches = reportedByIdentity.get(reported.identityKey) ?? [];
      matches.push(reported.resultIndex);
      reportedByIdentity.set(reported.identityKey, matches);
    }
    try {
      const recorded = [];
      const availableReportedIndices = new Set(
        reportedResults.map((reported) => reported.resultIndex),
      );
      const replacements = /* @__PURE__ */ new Map();
      const removals = /* @__PURE__ */ new Set();
      const appendResults = [];
      for (const delivery of deliveries) {
        if (!hasDeliveryResultIdentity(delivery)) {
          recorded.push(false);
          continue;
        }
        const receiptPartIds = (delivery.receipt?.parts ?? [])
          .map((part) => part.platformMessageId?.trim())
          .filter((id) => Boolean(id && id !== "unknown" && id !== "suppressed"));
        const receiptIds =
          receiptPartIds.length > 0
            ? receiptPartIds
            : [...resultPlatformIds(delivery, { receiptOnly: true })];
        const coveredIndices = [];
        for (const receiptId of receiptIds) {
          const matchingIndices = reportedResults
            .filter(
              (reported) =>
                availableReportedIndices.has(reported.resultIndex) &&
                !coveredIndices.includes(reported.resultIndex) &&
                results[reported.resultIndex]?.channel === delivery.channel &&
                resultPlatformIds(
                  expectDefined(
                    results[reported.resultIndex],
                    "results entry at reported.result index",
                  ),
                ).has(receiptId),
            )
            .map((reported) => reported.resultIndex);
          const matchingIndex = options?.finalResultIsLastReported
            ? matchingIndices.at(-1)
            : matchingIndices[0];
          if (matchingIndex !== void 0 && !coveredIndices.includes(matchingIndex))
            coveredIndices.push(matchingIndex);
        }
        let reportedIndex;
        if (coveredIndices.length > 0) {
          reportedIndex = Math.min(...coveredIndices);
          for (const coveredIndex of coveredIndices) {
            availableReportedIndices.delete(coveredIndex);
            if (coveredIndex !== reportedIndex) removals.add(coveredIndex);
          }
        } else {
          const reportedMatches = (
            reportedByIdentity.get(resultIdentityKey(delivery)) ?? []
          ).filter((index) => availableReportedIndices.has(index));
          reportedIndex = options?.finalResultIsLastReported
            ? reportedMatches.at(-1)
            : reportedMatches[0];
          if (reportedIndex !== void 0) availableReportedIndices.delete(reportedIndex);
        }
        if (reportedIndex !== void 0) replacements.set(reportedIndex, delivery);
        else appendResults.push(delivery);
        recorded.push(true);
      }
      if (replacements.size > 0 || removals.size > 0) {
        const reconciled = results.flatMap((result, index) => {
          if (removals.has(index)) return [];
          return [replacements.get(index) ?? result];
        });
        results.splice(0, results.length, ...reconciled);
      }
      for (const delivery of appendResults) {
        results.push(delivery);
        await params.onDeliveryResult?.(delivery);
      }
      return recorded;
    } finally {
      reportedResults = [];
    }
  };
  const recordIdentifiedDeliveryResult = async (delivery) =>
    (await recordIdentifiedDeliveryResults([delivery], { finalResultIsLastReported: true }))[0] ??
    false;
  const resolveMediaAccess = (mediaSources) =>
    mediaSources.length > 0
      ? resolveAgentScopedOutboundMediaAccess({
          cfg,
          agentId: params.session?.agentId ?? params.mirror?.agentId,
          mediaSources,
          mediaAccess: params.mediaAccess,
          sessionKey: params.session?.policyKey ?? params.session?.key,
          messageProvider: params.session?.key ? void 0 : channel,
          accountId: params.session?.requesterAccountId ?? accountId,
          requesterSenderId: params.session?.requesterSenderId,
          requesterSenderName: params.session?.requesterSenderName,
          requesterSenderUsername: params.session?.requesterSenderUsername,
          requesterSenderE164: params.session?.requesterSenderE164,
        })
      : (params.mediaAccess ?? {});
  const createHandler = (mediaSources) =>
    createChannelHandler({
      cfg,
      channel,
      to,
      deps,
      accountId,
      replyToId: params.replyToId,
      replyToMode: params.replyToMode,
      formatting: params.formatting,
      threadId: params.threadId,
      identity: params.identity,
      gifPlayback: params.gifPlayback,
      forceDocument: params.forceDocument,
      silent: params.silent,
      mediaAccess: resolveMediaAccess(mediaSources),
      gatewayClientScopes: params.gatewayClientScopes,
      deliveryQueueId: params.deliveryQueueId,
      requiredUnknownSendReconciliation: params.requiredUnknownSendReconciliation,
      onPlatformSendStart: params.onPlatformSendStart,
      onPlatformSendDispatch: params.onPlatformSendDispatch,
      onDeliveryResult: reportIdentifiedDeliveryResult,
    });
  const baseHandler = await createHandler([]);
  const handlerByMediaSources = /* @__PURE__ */ new Map();
  const getDeliveryHandler = (mediaSources) => {
    if (mediaSources.length === 0) return Promise.resolve(baseHandler);
    const key = JSON.stringify(mediaSources);
    const cached = handlerByMediaSources.get(key);
    if (cached) return cached;
    const created = createHandler(mediaSources);
    handlerByMediaSources.set(key, created);
    return created;
  };
  const handler = baseHandler;
  const configuredTextLimit = handler.chunker
    ? resolveTextChunkLimit(cfg, channel, accountId, { fallbackLimit: handler.textChunkLimit })
    : void 0;
  const textLimit =
    params.formatting?.textLimit ??
    (handler.resolveEffectiveTextChunkLimit
      ? handler.resolveEffectiveTextChunkLimit(configuredTextLimit)
      : configuredTextLimit);
  const chunkMode = handler.chunker
    ? (params.formatting?.chunkMode ?? resolveChunkMode(cfg, channel, accountId))
    : "length";
  const { resolveCurrentReplyTo, applyReplyToConsumption } = createReplyToDeliveryPolicy({
    replyToId: params.replyToId,
    replyToMode: params.replyToMode,
  });
  const sendTextChunks = async (sendHandler, text, overrides = {}) => {
    const units = planOutboundTextMessageUnits({
      text,
      overrides,
      chunker: sendHandler.chunker,
      chunkerMode: sendHandler.chunkerMode,
      chunkedTextFormatting: sendHandler.chunkedTextFormatting,
      textLimit,
      chunkMode,
      formatting: params.formatting,
      consumeReplyTo: (value) =>
        applyReplyToConsumption(value, {
          consumeImplicitReply: value.replyToIdSource === "implicit",
        }),
    });
    for (const unit of units) {
      if (unit.kind !== "text") continue;
      throwIfAborted(abortSignal);
      await recordIdentifiedDeliveryResult(await sendHandler.sendText(unit.text, unit.overrides));
    }
  };
  const normalizedPayloads = normalizePayloadsForChannelDelivery(outboundPayloadPlan, handler);
  const payloadOutcomes = [];
  const effectiveDeliveryKinds = /* @__PURE__ */ new Map();
  const recordPayloadOutcome = (outcome) => {
    const deliveryKind = effectiveDeliveryKinds.get(outcome.index);
    const recordedOutcome =
      deliveryKind && outcome.status !== "suppressed"
        ? {
            ...outcome,
            deliveryKind,
          }
        : outcome;
    payloadOutcomes.push(recordedOutcome);
    params.onPayloadDeliveryOutcome?.(recordedOutcome);
  };
  if (normalizedPayloads.length === 0)
    for (const [index] of payloads.entries())
      recordPayloadOutcome(
        suppressedPayloadOutcome({
          index,
          reason: "no_visible_payload",
        }),
      );
  else {
    const normalizedPayloadIndexes = new Set(normalizedPayloads.map((entry) => entry.index));
    for (const [index] of payloads.entries())
      if (!normalizedPayloadIndexes.has(index))
        recordPayloadOutcome(
          suppressedPayloadOutcome({
            index,
            reason: "no_visible_payload",
          }),
        );
  }
  const deliveredMirrorPayloads = [];
  const recordDeliveredMirrorPayload = (payloadSummary, deliveredResults) => {
    if (!params.mirror || deliveredResults.length === 0) return;
    deliveredMirrorPayloads.push(payloadSummary);
  };
  const hookRunner = getGlobalHookRunner();
  const sessionKeyForInternalHooks = params.mirror?.sessionKey ?? params.session?.key;
  const mirrorIsGroup = params.mirror?.isGroup;
  const mirrorGroupId = params.mirror?.groupId;
  const { emitMessageSent, hasMessageSentHooks } = createMessageSentEmitter({
    hookRunner,
    channel,
    to,
    accountId,
    sessionKeyForInternalHooks,
    mirrorIsGroup,
    mirrorGroupId,
  });
  const hasMessageSendingHooks = hookRunner?.hasHooks("message_sending") ?? false;
  const diagnosticSessionKey = sessionKeyForDeliveryDiagnostics(params);
  if (hasMessageSentHooks && params.session?.agentId && !sessionKeyForInternalHooks)
    log.warn(
      "deliverOutboundPayloads: session.agentId present without session key; internal message:sent hook will be skipped",
      {
        channel,
        to,
        agentId: params.session.agentId,
      },
    );
  for (const { index: payloadIndex, payload } of normalizedPayloads) {
    const payloadResultStartIndex = results.length;
    let payloadSummary = buildPayloadSummary(payload);
    const originalMediaCount = payloadSummary.mediaUrls.length;
    let deliveryKind = "other";
    let deliveryStartedAt = 0;
    let deliveryStarted = false;
    let deliveryFinished = false;
    const startDeliveryDiagnostics = (kind) => {
      deliveryKind = kind;
      deliveryStartedAt = Date.now();
      deliveryStarted = true;
      deliveryFinished = false;
      emitMessageDeliveryStarted({
        channel,
        deliveryKind,
        sessionKey: diagnosticSessionKey,
      });
    };
    const completeDeliveryDiagnostics = (resultCount) => {
      if (!deliveryStarted) return;
      deliveryFinished = true;
      emitMessageDeliveryCompleted({
        channel,
        deliveryKind,
        durationMs: Date.now() - deliveryStartedAt,
        resultCount,
        sessionKey: diagnosticSessionKey,
      });
    };
    const errorDeliveryDiagnostics = (err) => {
      if (!deliveryStarted || deliveryFinished) return;
      deliveryFinished = true;
      emitMessageDeliveryError({
        channel,
        deliveryKind,
        durationMs: Date.now() - deliveryStartedAt,
        error: err,
        sessionKey: diagnosticSessionKey,
      });
    };
    try {
      throwIfAborted(abortSignal);
      const replyHookResult = await applyReplyPayloadSendingHook({
        hook: params.replyPayloadSendingHook,
        payload,
      });
      if (replyHookResult.cancelled) {
        recordPayloadOutcome(
          suppressedPayloadOutcome({
            index: payloadIndex,
            reason: "cancelled_by_reply_payload_sending_hook",
          }),
        );
        continue;
      }
      let deliveryPayload = replyHookResult.payload;
      payloadSummary = buildPayloadSummary(deliveryPayload);
      const hookResult = await applyMessageSendingHook({
        hookRunner,
        enabled: hasMessageSendingHooks,
        payload: deliveryPayload,
        payloadSummary,
        to,
        channel,
        accountId,
        replyToId: resolveCurrentReplyTo(deliveryPayload).replyToId,
        threadId: params.threadId,
        sessionKey: sessionKeyForInternalHooks,
      });
      if (hookResult.cancelled) {
        const hookEffect =
          hookResult.cancelReason || hookResult.hookMetadata
            ? {
                ...(hookResult.cancelReason ? { cancelReason: hookResult.cancelReason } : {}),
                ...(hookResult.hookMetadata ? { metadata: hookResult.hookMetadata } : {}),
              }
            : void 0;
        recordPayloadOutcome(
          suppressedPayloadOutcome({
            index: payloadIndex,
            reason: "cancelled_by_message_sending_hook",
            ...(hookEffect ? { hookEffect } : {}),
          }),
        );
        continue;
      }
      deliveryPayload = hookResult.payload;
      const renderedPayload = stripInternalRuntimeScaffoldingFromPayload(
        await renderPresentationForDelivery(
          await getDeliveryHandler(buildPayloadSummary(deliveryPayload).mediaUrls),
          deliveryPayload,
        ),
      );
      const renderedHandler = await getDeliveryHandler(
        buildPayloadSummary(renderedPayload).mediaUrls,
      );
      const normalizedEffectivePayload = renderedHandler.normalizePayload
        ? renderedHandler.normalizePayload(renderedPayload)
        : renderedPayload;
      const effectivePayload = normalizedEffectivePayload
        ? normalizeEmptyPayloadForDelivery(
            stripInternalRuntimeScaffoldingFromPayload(normalizedEffectivePayload),
          )
        : null;
      if (!effectivePayload) {
        recordPayloadOutcome(
          suppressedPayloadOutcome({
            index: payloadIndex,
            reason: hookResult.contentRewritten
              ? "empty_after_message_sending_hook"
              : replyHookResult.changed
                ? "empty_after_reply_payload_sending_hook"
                : "no_visible_payload",
          }),
        );
        continue;
      }
      const effectivePayloadSummary = buildPayloadSummary(effectivePayload);
      assertStableMediaFanout(params, payloadIndex, originalMediaCount, effectivePayloadSummary);
      payloadSummary = effectivePayloadSummary;
      const deliveryHandler = await getDeliveryHandler(payloadSummary.mediaUrls);
      const effectiveDeliveryKind = deliveryKindForPayload(effectivePayload, payloadSummary);
      effectiveDeliveryKinds.set(payloadIndex, effectiveDeliveryKind);
      startDeliveryDiagnostics(effectiveDeliveryKind);
      params.onPayload?.(payloadSummary);
      const replyToResolution = resolveCurrentReplyTo(effectivePayload);
      const sendOverrides = {
        replyToId: replyToResolution.replyToId,
        replyToIdSource: replyToResolution.source,
        ...(params.threadId !== void 0 ? { threadId: params.threadId } : {}),
        ...(effectivePayload.audioAsVoice === true ? { audioAsVoice: true } : {}),
        ...(params.forceDocument !== void 0 ? { forceDocument: params.forceDocument } : {}),
      };
      const applySendReplyToConsumption = (overrides) =>
        applyReplyToConsumption(overrides, {
          consumeImplicitReply: replyToResolution.source === "implicit",
        });
      const deliveryTarget = deliveryHandler.buildTargetRef({ threadId: sendOverrides.threadId });
      if (
        deliveryHandler.sendPayload &&
        ((effectivePayload.isError === true &&
          deliveryHandler.sendTextOnlyErrorPayloads === true) ||
          hasReplyPayloadContent(
            {
              presentation: effectivePayload.presentation,
              interactive: effectivePayload.interactive,
              channelData: effectivePayload.channelData,
              location: effectivePayload.location,
            },
            { extraContent: effectivePayload.location != null },
          ) ||
          effectivePayload.audioAsVoice === true ||
          effectivePayload.videoAsNote === true)
      ) {
        const beforeCount = results.length;
        await recordIdentifiedDeliveryResult(
          await deliveryHandler.sendPayload(
            effectivePayload,
            applySendReplyToConsumption(sendOverrides),
          ),
        );
        const deliveredResults = results.slice(beforeCount);
        if (deliveredResults.length === 0) {
          completeDeliveryDiagnostics(0);
          recordPayloadOutcome(
            suppressedPayloadOutcome({
              index: payloadIndex,
              reason: "adapter_returned_no_identity",
            }),
          );
          continue;
        }
        recordPayloadOutcome({
          index: payloadIndex,
          status: "sent",
          results: deliveredResults,
        });
        recordDeliveredMirrorPayload(payloadSummary, deliveredResults);
        await maybePinDeliveredMessage({
          handler: deliveryHandler,
          payload: effectivePayload,
          target: deliveryTarget,
          messageId: deliveredResults.find((entry) => entry.messageId)?.messageId,
          gatewayClientScopes: params.gatewayClientScopes,
        });
        await maybeNotifyAfterDeliveredPayload({
          handler: deliveryHandler,
          payload: effectivePayload,
          target: deliveryTarget,
          results: deliveredResults,
        });
        completeDeliveryDiagnostics(deliveredResults.length);
        emitMessageSent({
          success: true,
          content: payloadSummary.hookContent ?? payloadSummary.text,
          messageId: deliveredResults.at(-1)?.messageId,
        });
        continue;
      }
      if (payloadSummary.mediaUrls.length === 0) {
        const beforeCount = results.length;
        if (deliveryHandler.sendFormattedText)
          await recordIdentifiedDeliveryResults(
            await deliveryHandler.sendFormattedText(
              payloadSummary.text,
              applySendReplyToConsumption(sendOverrides),
            ),
          );
        else await sendTextChunks(deliveryHandler, payloadSummary.text, sendOverrides);
        const deliveredResults = results.slice(beforeCount);
        if (deliveredResults.length > 0) {
          recordPayloadOutcome({
            index: payloadIndex,
            status: "sent",
            results: deliveredResults,
          });
          recordDeliveredMirrorPayload(payloadSummary, deliveredResults);
        } else
          recordPayloadOutcome(
            suppressedPayloadOutcome({
              index: payloadIndex,
              reason: "adapter_returned_no_identity",
            }),
          );
        const messageId = deliveredResults.at(-1)?.messageId;
        const pinMessageId = deliveredResults.find((entry) => entry.messageId)?.messageId;
        await maybePinDeliveredMessage({
          handler: deliveryHandler,
          payload: effectivePayload,
          target: deliveryTarget,
          messageId: pinMessageId,
          gatewayClientScopes: params.gatewayClientScopes,
        });
        await maybeNotifyAfterDeliveredPayload({
          handler: deliveryHandler,
          payload: effectivePayload,
          target: deliveryTarget,
          results: deliveredResults,
        });
        completeDeliveryDiagnostics(deliveredResults.length);
        emitMessageSent({
          success: deliveredResults.length > 0,
          content: payloadSummary.hookContent ?? payloadSummary.text,
          messageId,
        });
        continue;
      }
      if (!deliveryHandler.supportsMedia) {
        log.warn(
          "Plugin outbound adapter does not implement sendMedia; media URLs will be dropped and text fallback will be used",
          {
            channel,
            to,
            mediaCount: payloadSummary.mediaUrls.length,
          },
        );
        const fallbackText = payloadSummary.text.trim();
        if (!fallbackText)
          throw new Error(
            "Plugin outbound adapter does not implement sendMedia and no text fallback is available for media payload",
          );
        const beforeCount = results.length;
        await sendTextChunks(deliveryHandler, fallbackText, sendOverrides);
        const deliveredResults = results.slice(beforeCount);
        if (deliveredResults.length > 0) {
          recordPayloadOutcome({
            index: payloadIndex,
            status: "sent",
            results: deliveredResults,
          });
          recordDeliveredMirrorPayload(payloadSummary, deliveredResults);
        } else
          recordPayloadOutcome(
            suppressedPayloadOutcome({
              index: payloadIndex,
              reason: "adapter_returned_no_identity",
            }),
          );
        const messageId = deliveredResults.at(-1)?.messageId;
        const pinMessageId = deliveredResults.find((entry) => entry.messageId)?.messageId;
        await maybePinDeliveredMessage({
          handler: deliveryHandler,
          payload: effectivePayload,
          target: deliveryTarget,
          messageId: pinMessageId,
          gatewayClientScopes: params.gatewayClientScopes,
        });
        await maybeNotifyAfterDeliveredPayload({
          handler: deliveryHandler,
          payload: effectivePayload,
          target: deliveryTarget,
          results: deliveredResults,
        });
        completeDeliveryDiagnostics(deliveredResults.length);
        emitMessageSent({
          success: deliveredResults.length > 0,
          content: payloadSummary.hookContent ?? payloadSummary.text,
          messageId,
        });
        continue;
      }
      let firstMessageId;
      let lastMessageId;
      const beforeCount = results.length;
      const mediaUnits = planOutboundMediaMessageUnits({
        mediaUrls: payloadSummary.mediaUrls,
        caption: payloadSummary.text,
        overrides: sendOverrides,
        consumeReplyTo: applySendReplyToConsumption,
      });
      for (const unit of mediaUnits) {
        if (unit.kind !== "media") continue;
        throwIfAborted(abortSignal);
        const delivery = deliveryHandler.sendFormattedMedia
          ? await deliveryHandler.sendFormattedMedia(
              unit.caption ?? "",
              unit.mediaUrl,
              unit.overrides,
            )
          : await deliveryHandler.sendMedia(unit.caption ?? "", unit.mediaUrl, unit.overrides);
        if (await recordIdentifiedDeliveryResult(delivery)) {
          firstMessageId ??= delivery.messageId;
          lastMessageId = delivery.messageId;
        }
      }
      const deliveredResults = results.slice(beforeCount);
      if (deliveredResults.length > 0) {
        recordPayloadOutcome({
          index: payloadIndex,
          status: "sent",
          results: deliveredResults,
        });
        recordDeliveredMirrorPayload(payloadSummary, deliveredResults);
      } else
        recordPayloadOutcome(
          suppressedPayloadOutcome({
            index: payloadIndex,
            reason: "adapter_returned_no_identity",
          }),
        );
      await maybePinDeliveredMessage({
        handler: deliveryHandler,
        payload: effectivePayload,
        target: deliveryTarget,
        messageId: firstMessageId,
        gatewayClientScopes: params.gatewayClientScopes,
      });
      await maybeNotifyAfterDeliveredPayload({
        handler: deliveryHandler,
        payload: effectivePayload,
        target: deliveryTarget,
        results: deliveredResults,
      });
      completeDeliveryDiagnostics(results.length - beforeCount);
      emitMessageSent({
        success: results.length > beforeCount,
        content: payloadSummary.hookContent ?? payloadSummary.text,
        messageId: lastMessageId,
      });
    } catch (err) {
      reportedResults = [];
      const failedPayloadResults = results.slice(payloadResultStartIndex);
      recordPayloadOutcome({
        index: payloadIndex,
        status: "failed",
        error: err,
        sentBeforeError: failedPayloadResults.length > 0,
        stage: "platform_send",
        results: failedPayloadResults,
      });
      errorDeliveryDiagnostics(err);
      emitMessageSent({
        success: false,
        content: payloadSummary.hookContent ?? payloadSummary.text,
        error: formatErrorMessage(err),
      });
      if (!params.bestEffort)
        throw toOutboundDeliveryError({
          error: err,
          results,
          payloadOutcomes,
          stage: "platform_send",
        });
      params.onError?.(err, payloadSummary);
    }
  }
  if (params.mirror && deliveredMirrorPayloads.length > 0) {
    const deliveredMirror = {
      text: deliveredMirrorPayloads
        .map((payload) => payload.hookContent ?? payload.text)
        .filter((text) => text.trim())
        .join("\n"),
      mediaUrls: deliveredMirrorPayloads.flatMap((payload) => payload.mediaUrls),
    };
    const mirrorText = resolveMirroredTranscriptText({
      text: deliveredMirror.text,
      mediaUrls: deliveredMirror.mediaUrls,
    });
    if (mirrorText)
      try {
        const { appendAssistantMessageToSessionTranscript } = await loadTranscriptRuntime();
        const mirrorResult = await appendAssistantMessageToSessionTranscript({
          agentId: params.mirror.agentId,
          sessionKey: params.mirror.sessionKey,
          text: mirrorText,
          idempotencyKey: params.mirror.idempotencyKey,
          config: params.cfg,
        });
        if (!mirrorResult.ok)
          log.warn(
            `failed to mirror outbound delivery into session transcript; channel send already succeeded: ${mirrorResult.reason}`,
            {
              channel,
              to,
              sessionKey: params.mirror.sessionKey,
            },
          );
      } catch (err) {
        log.warn(
          `failed to mirror outbound delivery into session transcript; channel send already succeeded: ${formatErrorMessage(err)}`,
          {
            channel,
            to,
            sessionKey: params.mirror.sessionKey,
          },
        );
      }
  }
  return results;
}
//#endregion
export {
  createRenderedMessageBatch as a,
  throwIfAborted as i,
  deliverOutboundPayloadsInternal as n,
  runReplyPayloadSendingHook as o,
  resolveOutboundDurableFinalDeliverySupport as r,
  deliverOutboundPayloads as t,
};
