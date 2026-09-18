import crypto from "node:crypto";
import { o as retryAsync } from "./src-Dqmh2693.js";
//#region packages/memory-host-sdk/src/host/read-retry.ts
const TRANSIENT_MEMORY_READ_ERRNO = -11;
const TRANSIENT_MEMORY_READ_CODES = /* @__PURE__ */ new Set(["EAGAIN", "EWOULDBLOCK", "EDEADLK"]);
const TRANSIENT_MEMORY_READ_MESSAGE = /Unknown system error -11\b/i;
/** Extract errno from Node filesystem-style errors. */
function getErrno(error) {
  return typeof error?.errno === "number" ? error.errno : void 0;
}
/** Extract code from Node filesystem-style errors. */
function getCode(error) {
  return typeof error?.code === "string" ? error.code : void 0;
}
/** Return true for transient memory read failures that should be retried. */
function isTransientMemoryReadError(error) {
  const code = getCode(error);
  if (code && TRANSIENT_MEMORY_READ_CODES.has(code)) return true;
  if (getErrno(error) === TRANSIENT_MEMORY_READ_ERRNO) return true;
  return error instanceof Error && TRANSIENT_MEMORY_READ_MESSAGE.test(error.message);
}
/** Retry a memory read with the narrow transient error predicate. */
async function retryTransientMemoryRead(read, label = "memory read") {
  return await retryAsync(read, {
    attempts: 3,
    minDelayMs: 25,
    maxDelayMs: 50,
    label,
    shouldRetry: (error) => isTransientMemoryReadError(error),
  });
}
//#endregion
//#region packages/memory-host-sdk/src/host/hash.ts
/** SHA-256 hash helper for stable cache/content keys. */
function hashText(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
//#endregion
export { isTransientMemoryReadError as n, retryTransientMemoryRead as r, hashText as t };
