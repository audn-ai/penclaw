import { Buffer } from "node:buffer";
//#region src/utils/utf8-truncate.ts
function isContinuationByte(byte) {
  return byte !== void 0 && (byte & 192) === 128;
}
/** Keeps the longest UTF-8 prefix that fits within the byte limit. */
function truncateUtf8Prefix(value, maxBytes) {
  if (maxBytes <= 0) return "";
  const bytes = Buffer.from(value);
  if (bytes.byteLength <= maxBytes) return value;
  let end = maxBytes;
  while (end > 0 && isContinuationByte(bytes[end])) end -= 1;
  return bytes.subarray(0, end).toString("utf8");
}
/** Keeps the longest UTF-8 suffix that fits within the byte limit. */
function truncateUtf8Suffix(value, maxBytes) {
  if (maxBytes <= 0) return "";
  const bytes = Buffer.from(value);
  if (bytes.byteLength <= maxBytes) return value;
  let start = bytes.byteLength - maxBytes;
  while (start < bytes.byteLength && isContinuationByte(bytes[start])) start += 1;
  return bytes.subarray(start).toString("utf8");
}
//#endregion
export { truncateUtf8Suffix as n, truncateUtf8Prefix as t };
