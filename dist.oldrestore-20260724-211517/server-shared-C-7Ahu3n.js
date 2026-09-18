//#region src/gateway/server-shared.ts
const PENDING_CHAT_SEND_DEDUPE_PREFIX = "pending-chat:";
function pendingChatSendDedupeKey(runId) {
  return `${PENDING_CHAT_SEND_DEDUPE_PREFIX}${runId}`;
}
//#endregion
export { pendingChatSendDedupeKey as n, PENDING_CHAT_SEND_DEDUPE_PREFIX as t };
