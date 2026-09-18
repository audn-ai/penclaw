//#region src/channels/plugins/conversation-read-origin.ts
function normalizeConversationReadInvocationOrigin(value) {
  return value === "direct-operator" ? "direct-operator" : "delegated";
}
//#endregion
export { normalizeConversationReadInvocationOrigin as t };
