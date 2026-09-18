import { d as normalizeChannelRouteRef } from "./channel-route-u-lrE52s.js";
import { t as deliveryContextFromChannelRoute } from "./delivery-context.shared-WPZGmi9R.js";
import { i as normalizeMessageChannel } from "./message-channel-normalize-Be6uJOzO.js";
import { a as normalizeChannelId, t as getChannelPlugin } from "./registry-mc8oBRx8.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import "./message-channel-NQc9DJ6B.js";
//#region src/utils/conversation-target.ts
function normalizeConversationId(value) {
  return typeof value === "number" && Number.isFinite(value)
    ? String(Math.trunc(value))
    : typeof value === "string"
      ? normalizeOptionalString(value)
      : void 0;
}
function normalizeConversationTargetParams(params) {
  return {
    channel:
      typeof params.channel === "string"
        ? (normalizeMessageChannel(params.channel) ?? params.channel.trim())
        : void 0,
    conversationId: normalizeConversationId(params.conversationId),
    parentConversationId: normalizeConversationId(params.parentConversationId),
  };
}
//#endregion
//#region src/channels/route-projection.ts
/** Formats a conversation id into a deliverable target, using channel hooks before generic fallback. */
function formatConversationTarget(params) {
  const { channel, conversationId, parentConversationId } =
    normalizeConversationTargetParams(params);
  if (!channel || !conversationId) return;
  const normalizedChannel = normalizeChannelId(channel);
  const pluginTarget = normalizedChannel
    ? getChannelPlugin(normalizedChannel)?.messaging?.resolveDeliveryTarget?.({
        conversationId,
        parentConversationId,
      })
    : null;
  if (pluginTarget?.to?.trim()) return pluginTarget.to.trim();
  return `channel:${conversationId}`;
}
/** Resolves a channel conversation into target/thread fields for delivery routing. */
function resolveConversationDeliveryTarget(params) {
  const { channel, conversationId, parentConversationId } =
    normalizeConversationTargetParams(params);
  const pluginTarget =
    channel && conversationId
      ? getChannelPlugin(
          normalizeChannelId(channel) ?? channel,
        )?.messaging?.resolveDeliveryTarget?.({
          conversationId,
          parentConversationId,
        })
      : null;
  if (pluginTarget)
    return {
      ...(pluginTarget.to?.trim() ? { to: pluginTarget.to.trim() } : {}),
      ...(pluginTarget.threadId?.trim() ? { threadId: pluginTarget.threadId.trim() } : {}),
    };
  return { to: formatConversationTarget(params) };
}
/** Converts a persisted conversation reference into a channel route. */
function routeFromConversationRef(conversation) {
  if (!conversation) return;
  const target = resolveConversationDeliveryTarget({
    channel: conversation.channel,
    conversationId: conversation.conversationId,
    parentConversationId: conversation.parentConversationId,
  });
  return normalizeChannelRouteRef({
    channel: conversation.channel,
    accountId: conversation.accountId,
    to: target.to,
    threadId: target.threadId,
    threadSource: target.threadId ? "target" : void 0,
  });
}
/** Extracts a channel route from a session binding record. */
function routeFromBindingRecord(binding) {
  return routeFromConversationRef(binding?.conversation);
}
/** Projects route fields used by older session and delivery callers. */
function routeToDeliveryFields(route) {
  const deliveryContext = deliveryContextFromChannelRoute(route);
  return {
    ...(deliveryContext ? { deliveryContext } : {}),
    ...(deliveryContext?.channel ? { channel: deliveryContext.channel } : {}),
    ...(deliveryContext?.to ? { to: deliveryContext.to } : {}),
    ...(deliveryContext?.accountId ? { accountId: deliveryContext.accountId } : {}),
    ...(deliveryContext?.threadId != null ? { threadId: deliveryContext.threadId } : {}),
  };
}
//#endregion
export {
  routeToDeliveryFields as i,
  routeFromBindingRecord as n,
  routeFromConversationRef as r,
  formatConversationTarget as t,
};
