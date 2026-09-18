import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { r as readTrimmedStringAlias } from "./string-readers-A0wspDGq.js";
import { t as HEARTBEAT_TOKEN } from "./tokens-DKI4eGAu.js";
//#region src/auto-reply/heartbeat-tool-response.ts
/** Tool name used by heartbeat runs to report visible or silent progress. */
const HEARTBEAT_RESPONSE_TOOL_NAME = "heartbeat_respond";
const HEARTBEAT_RESPONSE_CHANNEL_DATA_KEY = "openclawHeartbeatResponse";
/** Allowed heartbeat response outcomes. */
const HEARTBEAT_TOOL_OUTCOMES = ["no_change", "progress", "done", "blocked", "needs_attention"];
/** Allowed heartbeat notification priorities. */
const HEARTBEAT_TOOL_PRIORITIES = ["low", "normal", "high"];
const OUTCOMES = new Set(HEARTBEAT_TOOL_OUTCOMES);
const PRIORITIES = new Set(HEARTBEAT_TOOL_PRIORITIES);
function readBooleanAlias(record, ...keys) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "boolean") return value;
  }
}
/** Validate and normalize unknown heartbeat tool output. */
function normalizeHeartbeatToolResponse(value) {
  if (!isRecord(value)) return;
  const outcome = normalizeOptionalString(value.outcome);
  const notify = readBooleanAlias(value, "notify");
  const summary = normalizeOptionalString(value.summary);
  if (!outcome || !OUTCOMES.has(outcome) || notify === void 0 || !summary) return;
  const priority = normalizeOptionalString(value.priority);
  const notificationText = readTrimmedStringAlias(value, ["notificationText", "notification_text"]);
  const reason = normalizeOptionalString(value.reason);
  const nextCheck = readTrimmedStringAlias(value, ["nextCheck", "next_check"]);
  return {
    outcome,
    notify,
    summary,
    ...(notificationText ? { notificationText } : {}),
    ...(reason ? { reason } : {}),
    ...(priority && PRIORITIES.has(priority) ? { priority } : {}),
    ...(nextCheck ? { nextCheck } : {}),
  };
}
/** Resolve the user-visible notification text for a heartbeat response. */
function getHeartbeatToolNotificationText(response) {
  return response.notify ? (response.notificationText ?? response.summary).trim() : "";
}
/** Store a heartbeat tool response in reply channel data for later extraction. */
function createHeartbeatToolResponsePayload(response) {
  return {
    text: response.notify ? getHeartbeatToolNotificationText(response) : HEARTBEAT_TOKEN,
    channelData: { [HEARTBEAT_RESPONSE_CHANNEL_DATA_KEY]: response },
  };
}
function getHeartbeatToolResponseFromPayload(payload) {
  return normalizeHeartbeatToolResponse(
    payload?.channelData?.[HEARTBEAT_RESPONSE_CHANNEL_DATA_KEY],
  );
}
/** Find the last heartbeat tool response embedded in a reply result. */
function resolveHeartbeatToolResponseFromReplyResult(replyResult) {
  if (!replyResult) return;
  const payloads = Array.isArray(replyResult) ? replyResult : [replyResult];
  for (let idx = payloads.length - 1; idx >= 0; idx -= 1) {
    const response = getHeartbeatToolResponseFromPayload(payloads[idx]);
    if (response) return response;
  }
}
//#endregion
export {
  getHeartbeatToolNotificationText as a,
  createHeartbeatToolResponsePayload as i,
  HEARTBEAT_TOOL_OUTCOMES as n,
  normalizeHeartbeatToolResponse as o,
  HEARTBEAT_TOOL_PRIORITIES as r,
  resolveHeartbeatToolResponseFromReplyResult as s,
  HEARTBEAT_RESPONSE_TOOL_NAME as t,
};
