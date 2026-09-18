import { D as resolveIntegerOption } from "./number-coercion-CJQ8TR--.js";
//#region src/agents/sessions/tools/limits.ts
/**
 * Byte-limit helpers for session tool stderr/stdout tails.
 *
 * Tail storage is byte-bounded but decoded as UTF-8, so truncation avoids
 * splitting multi-byte characters in display output.
 */
/** Normalizes optional positive numeric limits to a finite integer. */
function normalizePositiveLimit(value, fallback) {
  return resolveIntegerOption(value, fallback, { min: 1 });
}
/** Default stderr tail retained for long-running session tools. */
const SESSION_TOOL_STDERR_TAIL_BYTES = 64 * 1024;
function decodeUtf8TextTail(buffer, maxBytes) {
  const chars = Array.from(buffer.toString("utf8"));
  const kept = [];
  let bytes = 0;
  for (let i = chars.length - 1; i >= 0; i--) {
    const char = chars[i] ?? "";
    const charBytes = Buffer.byteLength(char, "utf8");
    if (bytes + charBytes > maxBytes) break;
    kept.push(char);
    bytes += charBytes;
  }
  return kept.toReversed().join("");
}
/** Appends a chunk while retaining only the UTF-8-safe tail within maxBytes. */
function appendBoundedTextTail(current, chunk, maxBytes = SESSION_TOOL_STDERR_TAIL_BYTES) {
  const effectiveMaxBytes = normalizePositiveLimit(maxBytes, SESSION_TOOL_STDERR_TAIL_BYTES);
  const chunkBuffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
  if (chunkBuffer.byteLength >= effectiveMaxBytes)
    return decodeUtf8TextTail(chunkBuffer, effectiveMaxBytes);
  const currentBuffer = Buffer.from(current);
  if (currentBuffer.byteLength + chunkBuffer.byteLength <= effectiveMaxBytes)
    return `${current}${chunkBuffer.toString("utf8")}`;
  const currentTailBytes = Math.max(0, effectiveMaxBytes - chunkBuffer.byteLength);
  const currentTail = currentBuffer.subarray(currentBuffer.byteLength - currentTailBytes);
  return decodeUtf8TextTail(Buffer.concat([currentTail, chunkBuffer]), effectiveMaxBytes);
}
//#endregion
export {
  appendBoundedTextTail as n,
  normalizePositiveLimit as r,
  SESSION_TOOL_STDERR_TAIL_BYTES as t,
};
