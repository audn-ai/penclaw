import { r as resolveOutboundChannelPlugin } from "./channel-resolution-B-NyvoRP.js";
import {
  n as listConfiguredMessageChannels,
  t as isConfiguredChannel,
} from "./channel-selection-DB_q64I6.js";
import "./message-channel-constants-CvbXi0yz.js";
import { i as normalizeMessageChannel } from "./message-channel-normalize-Be6uJOzO.js";
import "./message-channel-NQc9DJ6B.js";
import { d as parseSessionDeliveryRoute } from "./session-key-utils-B8sNp9l4.js";
import {
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
//#region src/infra/outbound/internal-source-reply.ts
function hasExternalSessionDeliveryRoute(sessionKey) {
  const route = parseSessionDeliveryRoute(sessionKey);
  if (!route) return false;
  const channel = normalizeMessageChannel(route.channel);
  return Boolean(channel && channel !== "webchat");
}
function hasExplicitRouteParam(params) {
  for (const key of ["channel", "target", "to", "channelId"])
    if (normalizeOptionalString(params[key])) return true;
  return (
    Array.isArray(params.targets) && params.targets.some((value) => normalizeOptionalString(value))
  );
}
function hasCurrentSourceReplyContext(input) {
  const provider = normalizeOptionalLowercaseString(input.toolContext?.currentChannelProvider);
  if (!provider) return false;
  if (provider === "webchat") return !hasExternalSessionDeliveryRoute(input.sessionKey);
  const currentMessageId = input.toolContext?.currentMessageId;
  return Boolean(
    normalizeOptionalString(input.toolContext?.currentChannelId) ||
    normalizeOptionalString(input.toolContext?.currentMessagingTarget) ||
    normalizeOptionalString(input.toolContext?.currentThreadTs) ||
    (typeof currentMessageId === "number" && Number.isFinite(currentMessageId)) ||
    normalizeOptionalString(currentMessageId),
  );
}
async function hasConfiguredCurrentSourceChannel(input) {
  const provider =
    normalizeMessageChannel(input.toolContext?.currentChannelProvider) ??
    normalizeOptionalLowercaseString(input.toolContext?.currentChannelProvider);
  if (!provider || provider === "webchat") return false;
  if (!isConfiguredChannel(input.cfg, provider)) return false;
  if (
    !resolveOutboundChannelPlugin({
      channel: provider,
      cfg: input.cfg,
      allowBootstrap: true,
    })
  )
    return false;
  return (await listConfiguredMessageChannels(input.cfg)).some((channel) => channel === provider);
}
/** Return whether this send resolves to the private current-run source-reply sink. */
async function shouldUseInternalSourceReplySink(input, params) {
  if (
    !(
      input.action === "send" &&
      input.sourceReplyDeliveryMode === "message_tool_only" &&
      hasCurrentSourceReplyContext(input) &&
      Boolean(input.sessionKey?.trim()) &&
      !hasExplicitRouteParam(params)
    )
  )
    return false;
  if (
    !normalizeOptionalString(input.toolContext?.currentChannelId) &&
    !normalizeOptionalString(input.toolContext?.currentMessagingTarget)
  )
    return true;
  return !(await hasConfiguredCurrentSourceChannel(input));
}
//#endregion
export { shouldUseInternalSourceReplySink as t };
