import { t as deriveDurableFinalDeliveryRequirements } from "./capabilities-tytC94t4.js";
import { r as resolveOutboundChannelPlugin } from "./channel-resolution-B-NyvoRP.js";
import { r as resolveMessageChannelSelection } from "./channel-selection-DB_q64I6.js";
import "./number-coercion-EqFmHmOw.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-Br1guPTt.js";
import "./message-channel-NQc9DJ6B.js";
import { r as resolveOutboundDurableFinalDeliverySupport } from "./deliver-CpY6iKDw.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import {
  a as projectOutboundPayloadPlanForDelivery,
  s as projectOutboundPayloadPlanForMirror,
  t as createOutboundPayloadPlan,
} from "./payloads-BRNPux3W.js";
import { n as normalizePollInput } from "./polls-C-v11_tu.js";
import "./runtime-BM0DJgoF.js";
import {
  n as serializeDurableMessagePayloadOutcomes,
  t as sendDurableMessageBatch,
} from "./send-DJdWoC1F.js";
import { t as buildOutboundSessionContext } from "./session-context-CryOjB_1.js";
import { i as resolveOutboundTarget } from "./targets-CnpDCogZ.js";
//#region src/infra/outbound/message-gateway-options.ts
/** Normalizes outbound gateway options and fills CLI defaults. */
function resolveOutboundMessageGatewayOptions(gateway) {
  const clientName = gateway?.clientName ?? GATEWAY_CLIENT_NAMES.CLI;
  const mode = gateway?.mode ?? GATEWAY_CLIENT_MODES.CLI;
  return {
    url:
      mode === GATEWAY_CLIENT_MODES.BACKEND || clientName === GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT
        ? void 0
        : gateway?.url,
    token: gateway?.token,
    timeoutMs: resolveTimerTimeoutMs(gateway?.timeoutMs, 1e4),
    clientName,
    clientDisplayName: gateway?.clientDisplayName,
    mode,
  };
}
//#endregion
//#region src/infra/outbound/message.ts
const SEND_BUFFER_MEDIA_URL = "buffer://message-send/attachment";
const loadMessageConfigRuntime = createLazyRuntimeModule(
  () => import("./message.config.runtime.js"),
);
const loadMessageGatewayRuntime = createLazyRuntimeModule(
  () => import("./message.gateway.runtime.js"),
);
function buildMessagePollResult(params) {
  return {
    channel: params.channel,
    to: params.to,
    question: params.normalized.question,
    options: params.normalized.options,
    maxSelections: params.normalized.maxSelections,
    durationSeconds: params.normalized.durationSeconds ?? null,
    durationHours: params.normalized.durationHours ?? null,
    via: params.via,
    ...(params.dryRun ? { dryRun: true } : { result: params.result }),
  };
}
function assertPollOptionSupport(params) {
  if (
    typeof params.durationSeconds === "number" &&
    params.outbound.supportsPollDurationSeconds !== true
  )
    throw new Error(`durationSeconds is not supported for ${params.channel} polls`);
  if (typeof params.isAnonymous === "boolean" && params.outbound.supportsAnonymousPolls !== true)
    throw new Error(`isAnonymous is not supported for ${params.channel} polls`);
}
async function resolveRequiredChannel(params) {
  return (
    await resolveMessageChannelSelection({
      cfg: params.cfg,
      channel: params.channel,
    })
  ).channel;
}
function resolveRequiredPlugin(channel, cfg) {
  const plugin = resolveOutboundChannelPlugin({
    channel,
    cfg,
  });
  if (!plugin) throw new Error(`Unknown channel: ${channel}`);
  return plugin;
}
function payloadRequiresDurablePayloadTransport(payload) {
  return (
    payload.presentation !== void 0 ||
    payload.delivery !== void 0 ||
    payload.interactive !== void 0 ||
    (payload.channelData !== void 0 && Object.keys(payload.channelData).length > 0)
  );
}
function mergeDurableRequirements(target, source) {
  for (const [capability, required] of Object.entries(source))
    if (required === true) target[capability] = true;
  return target;
}
function deriveRequiredMessageSendCapabilities(params) {
  const requirements = { reconcileUnknownSend: true };
  for (const payload of params.payloads)
    mergeDurableRequirements(
      requirements,
      deriveDurableFinalDeliveryRequirements({
        payload,
        replyToId: params.replyToId,
        threadId: params.threadId,
        silent: params.silent,
        payloadTransport: payloadRequiresDurablePayloadTransport(payload),
        batch: params.payloads.length > 1,
        reconcileUnknownSend: true,
      }),
    );
  return requirements;
}
async function assertRequiredMessageSendDurability(params) {
  const support = await resolveOutboundDurableFinalDeliverySupport({
    cfg: params.cfg,
    channel: params.channel,
    requirements: deriveRequiredMessageSendCapabilities(params),
  });
  if (support.ok) return;
  const suffix =
    support.reason === "capability_mismatch" && support.capability
      ? `missing ${support.capability}`
      : support.reason;
  throw new Error(
    `Required durable message send is unsupported for ${params.channel}: ${suffix}. Use queuePolicy:"best_effort" for best-effort delivery, omit bestEffort:false in message-tool calls, or use a channel with required durable delivery support.`,
  );
}
function resolveGatewayOptions(opts) {
  return resolveOutboundMessageGatewayOptions(opts);
}
async function callMessageGateway(params) {
  const { callGatewayLeastPrivilege } = await loadMessageGatewayRuntime();
  const gateway = resolveGatewayOptions(params.gateway);
  return await callGatewayLeastPrivilege({
    url: gateway.url,
    token: gateway.token,
    method: params.method,
    params: params.params,
    timeoutMs: gateway.timeoutMs,
    clientName: gateway.clientName,
    clientDisplayName: gateway.clientDisplayName,
    mode: gateway.mode,
  });
}
async function resolveMessageConfig(cfg) {
  if (cfg) return cfg;
  const { getRuntimeConfig } = await loadMessageConfigRuntime();
  return getRuntimeConfig();
}
async function resolveGatewayIdempotencyKey(idempotencyKey) {
  if (idempotencyKey) return idempotencyKey;
  const { randomIdempotencyKey } = await loadMessageGatewayRuntime();
  return randomIdempotencyKey();
}
async function sendMessage(params) {
  const cfg = await resolveMessageConfig(params.cfg);
  const channel = await resolveRequiredChannel({
    cfg,
    channel: params.channel,
  });
  const deliveryMode = resolveRequiredPlugin(channel, cfg).outbound?.deliveryMode ?? "direct";
  const hasRealMediaSource = [params.mediaUrl, ...(params.mediaUrls ?? [])]
    .filter((source) => Boolean(source))
    .some((source) => source !== SEND_BUFFER_MEDIA_URL);
  const shouldForwardBuffer =
    deliveryMode === "gateway" && Boolean(params.buffer) && !hasRealMediaSource;
  const mediaUrl = params.mediaUrl ?? (shouldForwardBuffer ? SEND_BUFFER_MEDIA_URL : void 0);
  const mediaUrls = params.mediaUrls ?? (shouldForwardBuffer ? [SEND_BUFFER_MEDIA_URL] : void 0);
  const outboundPlan = createOutboundPayloadPlan(
    params.payloads && params.payloads.length > 0
      ? params.payloads
      : [
          {
            text: params.content,
            mediaUrl,
            mediaUrls,
            audioAsVoice: params.asVoice === true,
          },
        ],
  );
  const normalizedPayloads = projectOutboundPayloadPlanForDelivery(outboundPlan);
  const mirrorProjection = projectOutboundPayloadPlanForMirror(outboundPlan);
  const mirrorText = mirrorProjection.text;
  const mirrorMediaUrls = mirrorProjection.mediaUrls;
  const primaryMediaUrl = mirrorMediaUrls[0] ?? mediaUrl ?? null;
  if (params.dryRun)
    return {
      channel,
      to: params.to,
      via: deliveryMode === "gateway" ? "gateway" : "direct",
      mediaUrl: primaryMediaUrl,
      mediaUrls: mirrorMediaUrls.length ? mirrorMediaUrls : void 0,
      dryRun: true,
    };
  if (deliveryMode !== "gateway") {
    const outboundChannel = channel;
    const resolvedTarget = resolveOutboundTarget({
      channel: outboundChannel,
      to: params.to,
      cfg,
      accountId: params.accountId,
      mode: "explicit",
    });
    if (!resolvedTarget.ok) throw resolvedTarget.error;
    const outboundSession = buildOutboundSessionContext({
      cfg,
      agentId: params.agentId,
      sessionKey: params.requesterSessionKey ?? params.mirror?.sessionKey,
      conversationType: params.conversationType,
      requesterAccountId: params.requesterAccountId ?? params.accountId,
      requesterSenderId: params.requesterSenderId,
      requesterSenderName: params.requesterSenderName,
      requesterSenderUsername: params.requesterSenderUsername,
      requesterSenderE164: params.requesterSenderE164,
    });
    const requireUnknownSendReconciliation = params.queuePolicy === "required";
    if (requireUnknownSendReconciliation)
      await assertRequiredMessageSendDurability({
        cfg,
        channel: outboundChannel,
        payloads: normalizedPayloads,
        replyToId: params.replyToId,
        threadId: params.threadId,
        silent: params.silent,
      });
    const send = await sendDurableMessageBatch({
      cfg,
      channel: outboundChannel,
      to: resolvedTarget.to,
      session: outboundSession,
      accountId: params.accountId,
      payloads: normalizedPayloads,
      replyToId: params.replyToId,
      threadId: params.threadId,
      gifPlayback: params.gifPlayback,
      forceDocument: params.forceDocument,
      deps: params.deps,
      bestEffort: params.bestEffort,
      ...(requireUnknownSendReconciliation ? { requireUnknownSendReconciliation: true } : {}),
      durability:
        params.bestEffort || params.queuePolicy === "best_effort" ? "best_effort" : "required",
      signal: params.abortSignal,
      silent: params.silent,
      mediaAccess: params.mediaAccess,
      formatting: params.parseMode ? { parseMode: params.parseMode } : void 0,
      mirror: params.mirror
        ? {
            ...params.mirror,
            text: mirrorText || params.content,
            mediaUrls: mirrorMediaUrls.length ? mirrorMediaUrls : void 0,
            idempotencyKey: params.mirror.idempotencyKey ?? params.idempotencyKey,
          }
        : void 0,
    });
    if (!params.bestEffort && (send.status === "failed" || send.status === "partial_failed"))
      throw send.error;
    const results = send.status === "sent" || send.status === "partial_failed" ? send.results : [];
    const payloadOutcomes = serializeDurableMessagePayloadOutcomes(send.payloadOutcomes);
    return {
      channel,
      to: params.to,
      via: "direct",
      mediaUrl: primaryMediaUrl,
      mediaUrls: mirrorMediaUrls.length ? mirrorMediaUrls : void 0,
      result: results.at(-1),
      deliveryStatus: send.status,
      ...(send.status === "failed" || send.status === "partial_failed"
        ? { error: formatErrorMessage(send.error) }
        : {}),
      ...(send.status === "partial_failed" ? { sentBeforeError: true } : {}),
      ...(payloadOutcomes ? { payloadOutcomes } : {}),
    };
  }
  const result = await callMessageGateway({
    gateway: params.gateway,
    method: "send",
    params: {
      to: params.to,
      message: params.content,
      mediaUrl,
      mediaUrls: mirrorMediaUrls.length ? mirrorMediaUrls : mediaUrls,
      buffer: shouldForwardBuffer ? params.buffer : void 0,
      filename: shouldForwardBuffer ? params.filename : void 0,
      contentType: shouldForwardBuffer ? params.contentType : void 0,
      asVoice: params.asVoice,
      gifPlayback: params.gifPlayback,
      accountId: params.accountId,
      agentId: params.agentId,
      channel,
      replyToId: params.replyToId,
      threadId: params.threadId != null ? String(params.threadId) : void 0,
      forceDocument: params.forceDocument,
      silent: params.silent,
      parseMode: params.parseMode,
      sessionKey: params.mirror?.sessionKey,
      idempotencyKey: await resolveGatewayIdempotencyKey(params.idempotencyKey),
    },
  });
  return {
    channel,
    to: params.to,
    via: "gateway",
    mediaUrl: primaryMediaUrl,
    mediaUrls: mirrorMediaUrls.length ? mirrorMediaUrls : void 0,
    result,
  };
}
async function sendPoll(params) {
  const cfg = await resolveMessageConfig(params.cfg);
  const channel = await resolveRequiredChannel({
    cfg,
    channel: params.channel,
  });
  const pollInput = {
    question: params.question,
    options: params.options,
    maxSelections: params.maxSelections,
    durationSeconds: params.durationSeconds,
    durationHours: params.durationHours,
  };
  const outbound = resolveRequiredPlugin(channel, cfg)?.outbound;
  if (!outbound?.sendPoll) throw new Error(`Unsupported poll channel: ${channel}`);
  const deliveryMode = outbound.deliveryMode ?? "direct";
  const normalized = outbound.pollMaxOptions
    ? normalizePollInput(pollInput, { maxOptions: outbound.pollMaxOptions })
    : normalizePollInput(pollInput);
  if (params.dryRun)
    return buildMessagePollResult({
      channel,
      to: params.to,
      normalized,
      via: deliveryMode === "gateway" ? "gateway" : "direct",
      dryRun: true,
    });
  assertPollOptionSupport({
    channel,
    outbound,
    durationSeconds: params.durationSeconds,
    isAnonymous: params.isAnonymous,
  });
  if (deliveryMode !== "gateway") {
    const resolvedTarget = resolveOutboundTarget({
      channel,
      to: params.to,
      cfg,
      accountId: params.accountId,
      mode: "explicit",
    });
    if (!resolvedTarget.ok) throw resolvedTarget.error;
    const result = await outbound.sendPoll({
      cfg,
      to: resolvedTarget.to,
      poll: normalized,
      accountId: params.accountId,
      threadId: params.threadId,
      silent: params.silent,
      isAnonymous: params.isAnonymous,
    });
    return buildMessagePollResult({
      channel,
      to: params.to,
      normalized,
      via: "direct",
      result,
    });
  }
  const result = await callMessageGateway({
    gateway: params.gateway,
    method: "poll",
    params: {
      to: params.to,
      question: normalized.question,
      options: normalized.options,
      maxSelections: normalized.maxSelections,
      durationSeconds: normalized.durationSeconds,
      durationHours: normalized.durationHours,
      threadId: params.threadId,
      silent: params.silent,
      isAnonymous: params.isAnonymous,
      channel,
      accountId: params.accountId,
      idempotencyKey: await resolveGatewayIdempotencyKey(params.idempotencyKey),
    },
  });
  return buildMessagePollResult({
    channel,
    to: params.to,
    normalized,
    via: "gateway",
    result,
  });
}
//#endregion
export { sendPoll as n, resolveOutboundMessageGatewayOptions as r, sendMessage as t };
