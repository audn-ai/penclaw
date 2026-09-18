import { t as formatErrorMessage$1 } from "./error-coercion-CrJRoLe1.js";
import { c as redactSensitiveText } from "./redact-CUe6Oey5.js";
//#region src/infra/errors.ts
function extractErrorCode(err) {
  if (!err || typeof err !== "object") return;
  const code = err.code;
  if (typeof code === "string") return code;
  if (typeof code === "number") return String(code);
}
function readErrorName(err) {
  if (!err || typeof err !== "object") return "";
  const name = err.name;
  return typeof name === "string" ? name : "";
}
function collectErrorGraphCandidates(err, resolveNested) {
  const queue = [err];
  const seen = /* @__PURE__ */ new Set();
  const candidates = [];
  while (queue.length > 0) {
    const current = queue.shift();
    if (current == null || seen.has(current)) continue;
    seen.add(current);
    candidates.push(current);
    if (!current || typeof current !== "object" || !resolveNested) continue;
    for (const nested of resolveNested(current))
      if (nested != null && !seen.has(nested)) queue.push(nested);
  }
  return candidates;
}
/**
 * Type guard for NodeJS.ErrnoException (any error with a `code` property).
 */
function isErrno(err) {
  return Boolean(err && typeof err === "object" && "code" in err);
}
/**
 * Check if an error has a specific errno code.
 */
function hasErrnoCode(err, code) {
  return isErrno(err) && err.code === code;
}
function formatErrorMessage(err) {
  return formatErrorMessage$1(err, { redact: redactSensitiveText });
}
function formatUncaughtError(err) {
  if (extractErrorCode(err) === "INVALID_CONFIG") return formatErrorMessage(err);
  if (err instanceof Error) return redactSensitiveText(err.stack ?? err.message ?? err.name);
  return formatErrorMessage(err);
}
//#endregion
export {
  hasErrnoCode as a,
  formatUncaughtError as i,
  extractErrorCode as n,
  isErrno as o,
  formatErrorMessage as r,
  readErrorName as s,
  collectErrorGraphCandidates as t,
};
