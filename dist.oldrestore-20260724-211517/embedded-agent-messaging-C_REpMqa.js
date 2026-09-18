import { t as CHANNEL_MESSAGE_ACTION_NAMES } from "./message-action-names-B_qNJvWe.js";
import { s as shouldApplyCrossContextMarker } from "./outbound-policy-F67g8gUP.js";
import "./plugins-BKdf-5tW.js";
import { a as normalizeChannelId, t as getChannelPlugin } from "./registry-mc8oBRx8.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/agents/embedded-agent-messaging.ts
/**
 * Identifies messaging tools and send actions during embedded-agent runs.
 */
const CORE_MESSAGING_TOOLS = /* @__PURE__ */ new Set(["sessions_send", "message"]);
const MESSAGE_TOOL_SEND_ACTIONS = /* @__PURE__ */ new Set([
  "send",
  "thread-reply",
  "sendWithEffect",
  "sendAttachment",
  "upload-file",
]);
const MESSAGE_TOOL_READ_ONLY_ACTIONS = /* @__PURE__ */ new Set([
  "read",
  "reactions",
  "list-pins",
  "permissions",
  "thread-list",
  "search",
  "sticker-search",
  "member-info",
  "role-info",
  "emoji-list",
  "channel-info",
  "channel-list",
  "voice-status",
  "event-list",
  "download-file",
]);
const MESSAGE_TOOL_MUTATION_ACTIONS = new Set(
  CHANNEL_MESSAGE_ACTION_NAMES.filter((action) => !MESSAGE_TOOL_READ_ONLY_ACTIONS.has(action)),
);
const MESSAGE_TOOL_CONVERSATION_CREATE_ACTIONS = /* @__PURE__ */ new Set([
  "thread-create",
  "topic-create",
  "threadcreate",
  "createforumtopic",
]);
/** Return true when a message action sends or uploads user-visible content. */
function isMessageToolSendActionName(action) {
  const normalized = normalizeOptionalString(action) ?? "";
  return MESSAGE_TOOL_SEND_ACTIONS.has(normalized);
}
/** Return true when a message action creates a visible destination conversation. */
function isMessageToolConversationCreateActionName(action) {
  const normalized = normalizeOptionalString(action)?.toLowerCase() ?? "";
  return MESSAGE_TOOL_CONVERSATION_CREATE_ACTIONS.has(normalized);
}
/** Return true for core or channel-plugin messaging tool names. */
function isMessagingTool(toolName) {
  if (CORE_MESSAGING_TOOLS.has(toolName)) return true;
  const providerId = normalizeChannelId(toolName);
  return Boolean(providerId && getChannelPlugin(providerId)?.actions);
}
/** Return true when the specific tool invocation is an outbound send. */
function isMessagingToolSendAction(toolName, args) {
  const action = normalizeOptionalString(args.action) ?? "";
  if (toolName === "sessions_send") return true;
  if (toolName === "message") return isMessageToolSendActionName(action);
  const providerId = normalizeChannelId(toolName);
  return Boolean(
    providerId && getChannelPlugin(providerId)?.actions?.extractToolSend?.({ args })?.to,
  );
}
/** Return true when a visible delivery has one target worth recording as evidence. */
function isMessagingToolTargetEvidenceAction(toolName, args) {
  if (toolName === "message") {
    const action = normalizeOptionalString(args.action) ?? "";
    return (
      shouldApplyCrossContextMarker(action) || isMessageToolConversationCreateActionName(action)
    );
  }
  return isMessagingToolSendAction(toolName, args);
}
/** Return true when a messaging invocation can create visible outbound delivery. */
function isMessagingToolDeliveryAction(toolName, args) {
  if (toolName === "message") {
    const action = normalizeOptionalString(args.action) ?? "";
    return (
      MESSAGE_TOOL_MUTATION_ACTIONS.has(action) || isMessageToolConversationCreateActionName(action)
    );
  }
  const providerId = normalizeChannelId(toolName);
  if (providerId && getChannelPlugin(providerId)?.actions?.isToolDeliveryAction?.({ args }))
    return true;
  return isMessagingToolSendAction(toolName, args);
}
//#endregion
export {
  isMessagingToolSendAction as a,
  isMessagingToolDeliveryAction as i,
  isMessageToolSendActionName as n,
  isMessagingToolTargetEvidenceAction as o,
  isMessagingTool as r,
  isMessageToolConversationCreateActionName as t,
};
