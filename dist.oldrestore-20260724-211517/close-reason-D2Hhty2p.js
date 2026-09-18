import { t as truncateUtf8Prefix } from "./utf8-truncate-Dro7v_iB.js";
//#region src/gateway/server/close-reason.ts
/**
 * WebSocket close reason utilities.
 */
const CLOSE_REASON_MAX_BYTES = 120;
/** Truncates close reasons to the RFC-safe byte limit used during handshake failures. */
function truncateCloseReason(reason, maxBytes = CLOSE_REASON_MAX_BYTES) {
  if (!reason) return "invalid handshake";
  return truncateUtf8Prefix(reason, maxBytes);
}
//#endregion
export { truncateCloseReason as t };
