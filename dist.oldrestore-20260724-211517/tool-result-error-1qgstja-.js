import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region src/agents/tool-result-error.ts
const TOOL_TIMEOUT_ERROR_CODES = /* @__PURE__ */ new Set([
  "ERR_TIMEOUT",
  "ESOCKETTIMEDOUT",
  "ETIMEDOUT",
  "UND_ERR_BODY_TIMEOUT",
  "UND_ERR_CONNECT_TIMEOUT",
  "UND_ERR_HEADERS_TIMEOUT",
]);
function readToolErrorField(error, key) {
  try {
    return key in error ? error[key] : void 0;
  } catch {
    return;
  }
}
function hasStructuredToolTimeoutIdentity(error) {
  const pending = [error];
  const seen = /* @__PURE__ */ new Set();
  while (pending.length > 0 && seen.size < 8) {
    const current = pending.shift();
    if (!current || typeof current !== "object" || seen.has(current)) continue;
    seen.add(current);
    if (readToolErrorField(current, "name") === "TimeoutError") return true;
    const code = readToolErrorField(current, "code");
    if (typeof code === "string" && TOOL_TIMEOUT_ERROR_CODES.has(code.trim().toUpperCase()))
      return true;
    for (const key of ["reason", "status"]) {
      const value = readToolErrorField(current, key);
      const normalized = normalizeOptionalLowercaseString(value);
      if (normalized === "timeout" || normalized === "timed_out") return true;
      if (value && typeof value === "object") pending.push(value);
    }
    const cause = readToolErrorField(current, "cause");
    if (cause && typeof cause === "object") pending.push(cause);
  }
  return false;
}
function readToolResultDetails(result) {
  if (!result || typeof result !== "object") return;
  try {
    const details = readToolErrorField(result, "details");
    return details && typeof details === "object" && !Array.isArray(details) ? details : void 0;
  } catch {
    return;
  }
}
function readToolResultStatus(result) {
  const details = readToolResultDetails(result);
  return normalizeOptionalLowercaseString(details ? readToolErrorField(details, "status") : void 0);
}
function isToolResultError(result) {
  const details = readToolResultDetails(result);
  const normalized = readToolResultStatus(result);
  const ok = details ? readToolErrorField(details, "ok") : void 0;
  const success = details ? readToolErrorField(details, "success") : void 0;
  const explicitlySuccessful = ok === true || success === true;
  if (ok === false || success === false) return true;
  if (
    (normalized === "error" ||
      normalized === "failed" ||
      normalized === "failure" ||
      normalized === "timeout" ||
      normalized === "timed_out" ||
      normalized === "blocked" ||
      normalized === "denied" ||
      normalized === "forbidden" ||
      normalized === "unavailable" ||
      normalized === "approval-unavailable" ||
      normalized === "disabled" ||
      normalized === "aborted" ||
      normalized === "cancelled" ||
      normalized === "canceled" ||
      normalized === "killed" ||
      normalized === "invalid") &&
    !explicitlySuccessful
  )
    return true;
  const timedOut = details ? readToolErrorField(details, "timedOut") : void 0;
  const error = details ? readToolErrorField(details, "error") : void 0;
  if (timedOut === true || Boolean(error)) return true;
  const exitCode = details ? readToolErrorField(details, "exitCode") : void 0;
  return typeof exitCode === "number" && Number.isFinite(exitCode) && exitCode !== 0;
}
/** Classify a thrown tool error without inferring cancellation from message text. */
function resolveToolExecutionErrorKind(error) {
  try {
    return hasStructuredToolTimeoutIdentity(error) ? "timed_out" : "failed";
  } catch {
    return "failed";
  }
}
/** Format a redacted tool error without allowing hostile getters to escape observability. */
function formatToolExecutionErrorMessage(error, fallback) {
  try {
    return formatErrorMessage(error) || fallback;
  } catch {
    return fallback;
  }
}
/** Classify a resolved structured tool result through the shared terminal contract. */
function resolveToolResultFailureKind(result) {
  if (!isToolResultError(result)) return;
  const status = readToolResultStatus(result);
  if (
    status === "blocked" ||
    status === "denied" ||
    status === "forbidden" ||
    status === "disabled" ||
    status === "approval-unavailable"
  )
    return "blocked";
  const details = readToolResultDetails(result);
  if (
    (details ? readToolErrorField(details, "timedOut") : void 0) === true ||
    status === "timeout" ||
    status === "timed_out"
  )
    return "timed_out";
  if (
    status === "aborted" ||
    status === "cancelled" ||
    status === "canceled" ||
    status === "killed"
  )
    return "cancelled";
  return "failed";
}
//#endregion
export {
  resolveToolExecutionErrorKind as a,
  readToolResultStatus as i,
  isToolResultError as n,
  resolveToolResultFailureKind as o,
  readToolResultDetails as r,
  formatToolExecutionErrorMessage as t,
};
