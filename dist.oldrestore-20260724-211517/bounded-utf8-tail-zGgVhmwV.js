import "./logging-core-QnL1iLWg.js";
import { StringDecoder } from "node:string_decoder";
//#region extensions/browser/src/browser/bounded-utf8-tail.ts
/** Byte-bounded UTF-8 tail storage for browser subprocess diagnostics. */
function decodeUtf8Tail(buffer) {
  let start = 0;
  while (start < buffer.length && (buffer[start] & 192) === 128) start += 1;
  return new StringDecoder("utf8").write(buffer.subarray(start));
}
function decodeBoundedUtf8Tail(buffer, maxBytes) {
  if (maxBytes <= 0 || buffer.length === 0) return "";
  return decodeUtf8Tail(
    buffer.length > maxBytes ? buffer.subarray(buffer.length - maxBytes) : buffer,
  );
}
function createBoundedUtf8Tail(maxBytes) {
  const storage = Buffer.allocUnsafe(Math.max(0, maxBytes));
  let totalBytes = 0;
  return {
    append(chunk) {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      if (buffer.length === 0 || maxBytes <= 0) return;
      if (buffer.length >= maxBytes) {
        buffer.copy(storage, 0, buffer.length - maxBytes);
        totalBytes = maxBytes;
        return;
      }
      const overflowBytes = Math.max(0, totalBytes + buffer.length - maxBytes);
      if (overflowBytes > 0) {
        storage.copyWithin(0, overflowBytes, totalBytes);
        totalBytes -= overflowBytes;
      }
      buffer.copy(storage, totalBytes);
      totalBytes += buffer.length;
    },
    text() {
      return decodeUtf8Tail(storage.subarray(0, totalBytes));
    },
    clear() {
      totalBytes = 0;
    },
  };
}
//#endregion
export { decodeBoundedUtf8Tail as n, createBoundedUtf8Tail as t };
