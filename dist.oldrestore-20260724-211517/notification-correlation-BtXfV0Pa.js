import { i as isJsonObject } from "./protocol-BMifTfdW.js";
//#region extensions/codex/src/app-server/notification-correlation.ts
/**
 * Correlates Codex app-server notifications with the active thread/turn so
 * projectors can ignore global or stale events without losing diagnostics.
 */
/** Returns true when a notification payload belongs to the exact active thread and turn. */
function isCodexNotificationForTurn(value, threadId, turnId) {
  if (!isJsonObject(value)) return false;
  return (
    readCodexNotificationThreadId(value) === threadId &&
    readCodexNotificationTurnId(value) === turnId
  );
}
/**
 * Reads a thread id from canonical top-level or nested thread payloads.
 * The generated v2 schemas require top-level `threadId` on turn/item-scoped
 * notifications and define `Turn` without one, so `turn.threadId` is not a
 * wire shape and is deliberately not read here.
 */
function readCodexNotificationThreadId(record) {
  const thread = isJsonObject(record.thread) ? record.thread : void 0;
  return readString(record, "threadId") ?? (thread ? readString(thread, "id") : void 0);
}
/** Reads a turn id from either top-level notification params or nested turn payloads. */
function readCodexNotificationTurnId(record) {
  return readNestedTurnId(record) ?? readString(record, "turnId");
}
function readNestedTurnId(record) {
  const turn = record.turn;
  return isJsonObject(turn) ? readString(turn, "id") : void 0;
}
function readString(record, key) {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
//#endregion
export {
  readCodexNotificationThreadId as n,
  readCodexNotificationTurnId as r,
  isCodexNotificationForTurn as t,
};
