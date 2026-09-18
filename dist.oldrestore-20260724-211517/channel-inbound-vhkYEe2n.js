import { r as resolveAgentConfig } from "./agent-scope-config-DVIR1nBa.js";
import "./agent-scope-y9xQv_q1.js";
import { r as isControlCommandMessage } from "./command-detection-DtT_SU8u.js";
import {
  r as filterChannelInboundSupplementalContext,
  t as buildChannelInboundEventContext,
} from "./context-DMJN91Z-.js";
import { a as resolveEnvelopeFormatOptions } from "./envelope-W2SlFUX-.js";
import {
  n as resolveInboundDebounceMs,
  t as createInboundDebouncer,
} from "./inbound-debounce-B16kSCvW.js";
import "./sessions-CEG7v41b.js";
import "./mentions-BFTjjd4G.js";
import { l as resolveStorePath } from "./paths-TfuVT-K8.js";
import { r as readSessionUpdatedAt } from "./store-CzZJhTF6.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import "./inbound-reply-dispatch-DquY2pbK.js";
import "./direct-dm-Dk52P1BE.js";
//#region src/channels/inbound-debounce-policy.ts
/**
 * Channel inbound debounce policy.
 *
 * Decides when text events can be delayed/merged before agent dispatch.
 */
/** Returns true when an inbound text event is safe to debounce before dispatch. */
function shouldDebounceTextInbound(params) {
  if (params.allowDebounce === false) return false;
  if (params.hasMedia) return false;
  const text = normalizeOptionalString(params.text) ?? "";
  if (!text) return false;
  return !isControlCommandMessage(text, params.cfg, params.commandOptions);
}
/** Creates a channel-scoped inbound debouncer using config/default debounce timing. */
function createChannelInboundDebouncer(params) {
  const debounceMs = resolveInboundDebounceMs({
    cfg: params.cfg,
    channel: params.channel,
    overrideMs: params.debounceMsOverride,
  });
  const { cfg: _cfg, channel: _channel, debounceMsOverride: _override, ...rest } = params;
  return {
    debounceMs,
    debouncer: createInboundDebouncer({
      debounceMs,
      ...rest,
    }),
  };
}
//#endregion
//#region src/channels/session-envelope.ts
/** Resolves envelope options and previous timestamp for one inbound channel session. */
function resolveInboundSessionEnvelopeContext(params) {
  const storePath = resolveStorePath(params.cfg.session?.store, { agentId: params.agentId });
  return {
    storePath,
    envelopeOptions: resolveEnvelopeFormatOptions(params.cfg),
    previousTimestamp: readSessionUpdatedAt({
      storePath,
      sessionKey: params.sessionKey,
    }),
  };
}
//#endregion
//#region src/channels/inbound-event/classification.ts
/**
 * Channel inbound event classifier.
 *
 * Decides whether group/channel activity should wake the agent or remain a passive room event.
 */
/**
 * Classifies an inbound channel event as an actionable request or passive room event.
 */
function classifyChannelInboundEvent(params) {
  if (params.unmentionedGroupPolicy !== "room_event") return "user_request";
  if (params.conversation.kind !== "group" && params.conversation.kind !== "channel")
    return "user_request";
  if (
    params.wasMentioned === true ||
    params.hasControlCommand === true ||
    params.hasAbortRequest === true ||
    params.commandSource === "native"
  )
    return "user_request";
  return "room_event";
}
/**
 * Resolves the configured policy for unmentioned group/channel inbound events.
 */
function resolveUnmentionedGroupInboundPolicy(params) {
  const agentGroupChat = params.agentId
    ? resolveAgentConfig(params.cfg, params.agentId)?.groupChat
    : void 0;
  if (agentGroupChat && Object.hasOwn(agentGroupChat, "unmentionedInbound"))
    return agentGroupChat.unmentionedInbound ?? "user_request";
  return params.cfg.messages?.groupChat?.unmentionedInbound ?? "user_request";
}
//#endregion
//#region src/plugin-sdk/channel-inbound.ts
/**
 * Builds inbound-event context for callers still passing `inboundTurnKind`.
 *
 * @deprecated Use `buildChannelInboundEventContext`.
 */
function buildChannelTurnContext(params) {
  const inboundEventKind = params.message.inboundEventKind ?? params.message.inboundTurnKind;
  const ctx = buildChannelInboundEventContext({
    ...params,
    message: {
      ...params.message,
      ...(inboundEventKind ? { inboundEventKind } : {}),
    },
  });
  return {
    ...ctx,
    InboundTurnKind: ctx.InboundEventKind,
  };
}
/**
 * Deprecated supplemental-context filter alias retained for channel SDK compatibility.
 *
 * @deprecated Use `filterChannelInboundSupplementalContext`.
 */
const filterChannelTurnSupplementalContext = filterChannelInboundSupplementalContext;
//#endregion
export {
  resolveInboundSessionEnvelopeContext as a,
  resolveUnmentionedGroupInboundPolicy as i,
  filterChannelTurnSupplementalContext as n,
  createChannelInboundDebouncer as o,
  classifyChannelInboundEvent as r,
  shouldDebounceTextInbound as s,
  buildChannelTurnContext as t,
};
