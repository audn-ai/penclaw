import { t as normalizeChatType } from "./chat-type-BARlA53h.js";
import "./message-channel-constants-CvbXi0yz.js";
import { r as isControlCommandMessage } from "./command-detection-DtT_SU8u.js";
import {
  i as isExplicitCommandTurn,
  s as resolveCommandTurnContext,
} from "./command-turn-context-DXqYoJ8B.js";
import "./message-channel-NQc9DJ6B.js";
import { i as normalizeMessageChannel } from "./message-channel-normalize-Be6uJOzO.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/auto-reply/command-turn-detection.ts
/** Fallback command-turn detection for mixed native/text channel metadata. */
function resolveCommandBody(input) {
  return (
    normalizeOptionalString(input.CommandBody) ??
    normalizeOptionalString(input.BodyForCommands) ??
    normalizeOptionalString(input.RawBody) ??
    normalizeOptionalString(input.Body)
  );
}
function resolveVisibleMessageBody(input) {
  return normalizeOptionalString(input.RawBody) ?? normalizeOptionalString(input.Body);
}
function resolveStructuredNormalFallbackBody(input) {
  const visibleBody = resolveVisibleMessageBody(input);
  if (!/^[!/]/.test(visibleBody ?? "")) return;
  return resolveCommandBody(input) ?? visibleBody;
}
function hasCommandSourceMetadata(input) {
  return (
    input.CommandSource === "native" ||
    input.CommandSource === "text" ||
    input.CommandSource === "message"
  );
}
/** Returns true when inbound metadata or command text identifies an explicit command turn. */
function isExplicitCommandTurnContext(input, cfg) {
  if (isExplicitCommandTurn(resolveCommandTurnContext(input))) return true;
  if (input.CommandSource === "native" || input.CommandSource === "text") return false;
  const fallbackBody =
    input.CommandTurn !== void 0 || hasCommandSourceMetadata(input)
      ? resolveStructuredNormalFallbackBody(input)
      : resolveCommandBody(input);
  return (
    input.CommandAuthorized === true &&
    isControlCommandMessage(fallbackBody, cfg, {
      botUsername: normalizeOptionalString(input.BotUsername),
    })
  );
}
//#endregion
//#region src/auto-reply/reply/source-reply-delivery-mode.ts
/** Source-reply visibility and suppression policy for auto-reply delivery. */
function toSessionStableDeliveryModeContext(ctx) {
  return {
    ChatType: ctx.ChatType,
    Provider: ctx.Provider,
    Surface: ctx.Surface,
    ExplicitDeliverRoute: ctx.ExplicitDeliverRoute,
  };
}
/** Returns true when the turn explicitly invoked a source-visible command. */
function isExplicitSourceReplyCommand(ctx, cfg) {
  return isExplicitCommandTurnContext(ctx, cfg);
}
/** Returns true for text slash commands that lack authorization metadata. */
function isUnauthorizedTextSlashCommand(ctx) {
  const commandTurn = resolveCommandTurnContext(ctx);
  return (
    commandTurn.kind === "text-slash" &&
    !commandTurn.authorized &&
    (commandTurn.commandName !== void 0 || commandTurn.body?.trim().startsWith("/") === true)
  );
}
function isInternalRoomEvent(ctx) {
  return ctx.InboundEventKind === "room_event" && isInternalSourceReplyChannel(ctx);
}
/** Returns true for internal message-channel turns that should remain local. */
function isInternalSourceReplyChannel(ctx) {
  const providerChannel = normalizeMessageChannel(ctx.Provider);
  const surfaceChannel = normalizeMessageChannel(ctx.Surface);
  return (
    (providerChannel ?? surfaceChannel) === "webchat" &&
    (surfaceChannel === "webchat" || !surfaceChannel) &&
    ctx.ExplicitDeliverRoute !== true
  );
}
/** Resolves whether normal final text should auto-deliver or require the message tool. */
function resolveSourceReplyDeliveryMode(params) {
  if (params.strictMessageToolOnly === true) return "message_tool_only";
  if (params.ctx.InboundEventKind === "room_event" && !isInternalRoomEvent(params.ctx))
    return "message_tool_only";
  if (
    params.requested &&
    (params.requested !== "message_tool_only" || params.messageToolAvailable !== false)
  )
    return params.requested;
  if (isExplicitSourceReplyCommand(params.ctx, params.cfg)) return "automatic";
  const chatType = normalizeChatType(params.ctx.ChatType);
  if (
    (chatType === "group" || chatType === "channel") &&
    isUnauthorizedTextSlashCommand(params.ctx)
  )
    return "message_tool_only";
  let mode;
  if (chatType === "group" || chatType === "channel")
    mode =
      (params.cfg.messages?.groupChat?.visibleReplies ?? params.cfg.messages?.visibleReplies) ===
      "message_tool"
        ? "message_tool_only"
        : "automatic";
  else
    mode =
      (params.cfg.messages?.visibleReplies ??
        (isInternalSourceReplyChannel(params.ctx) ? "automatic" : params.defaultVisibleReplies)) ===
      "message_tool"
        ? "message_tool_only"
        : "automatic";
  if (mode === "message_tool_only" && params.messageToolAvailable === false) return "automatic";
  return mode;
}
/** Resolves source delivery, hooks, lifecycle, and typing suppression flags. */
function resolveSourceReplyVisibilityPolicy(params) {
  const sourceReplyDeliveryMode = resolveSourceReplyDeliveryMode({
    cfg: params.cfg,
    ctx: params.ctx,
    requested: params.requested,
    strictMessageToolOnly: params.strictMessageToolOnly,
    messageToolAvailable: params.messageToolAvailable,
    defaultVisibleReplies: params.defaultVisibleReplies,
  });
  const sessionStableSourceReplyDeliveryMode =
    params.requested !== void 0 || isExplicitSourceReplyCommand(params.ctx, params.cfg)
      ? sourceReplyDeliveryMode
      : resolveSourceReplyDeliveryMode({
          cfg: params.cfg,
          ctx: toSessionStableDeliveryModeContext(params.ctx),
          messageToolAvailable: params.messageToolAvailable,
          defaultVisibleReplies: params.defaultVisibleReplies,
        });
  const sendPolicyDenied = params.sendPolicy === "deny";
  const suppressAutomaticSourceDelivery = sourceReplyDeliveryMode === "message_tool_only";
  const suppressDelivery = sendPolicyDenied || suppressAutomaticSourceDelivery;
  const deliverySuppressionReason = sendPolicyDenied
    ? "sendPolicy: deny"
    : suppressAutomaticSourceDelivery
      ? "sourceReplyDeliveryMode: message_tool_only"
      : "";
  return {
    sourceReplyDeliveryMode,
    sessionStableSourceReplyDeliveryMode,
    sendPolicyDenied,
    suppressAutomaticSourceDelivery,
    suppressDelivery,
    suppressHookUserDelivery: params.suppressAcpChildUserDelivery === true || suppressDelivery,
    suppressHookReplyLifecycle:
      sendPolicyDenied ||
      params.suppressAcpChildUserDelivery === true ||
      params.explicitSuppressTyping === true ||
      params.shouldSuppressTyping === true,
    suppressTyping:
      sendPolicyDenied ||
      params.explicitSuppressTyping === true ||
      params.shouldSuppressTyping === true,
    deliverySuppressionReason,
  };
}
//#endregion
export {
  resolveSourceReplyVisibilityPolicy as a,
  resolveSourceReplyDeliveryMode as i,
  isInternalSourceReplyChannel as n,
  isUnauthorizedTextSlashCommand as r,
  isExplicitSourceReplyCommand as t,
};
