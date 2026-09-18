import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import "./parse-finite-number-Z7n6tXLk.js";
//#region src/cli/parse-timeout.ts
/** Parse a positive millisecond timeout, returning undefined for absent or invalid input. */
function parseTimeoutMs(raw) {
  if (raw === void 0 || raw === null) return;
  let value = NaN;
  if (typeof raw === "number") value = raw;
  else if (typeof raw === "bigint") value = Number(raw);
  else if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return;
    return parseStrictPositiveInteger(trimmed);
  }
  return Number.isSafeInteger(value) && value > 0 ? value : void 0;
}
function invalidTimeout(value) {
  const suffix = value ? ` Received: "${value}".` : "";
  return /* @__PURE__ */ new Error(
    `Invalid --timeout. Use a positive millisecond value, e.g. --timeout 30000.${suffix}`,
  );
}
/** Parse a positive timeout or return the supplied fallback for missing values. */
function parseTimeoutMsWithFallback(raw, fallbackMs, options = {}) {
  if (raw === void 0 || raw === null) return fallbackMs;
  const value =
    typeof raw === "string"
      ? raw.trim()
      : typeof raw === "number" || typeof raw === "bigint"
        ? String(raw)
        : null;
  if (value === null) {
    if (options.invalidType === "error") throw invalidTimeout();
    return fallbackMs;
  }
  if (!value) {
    if (options.invalidType === "error") throw invalidTimeout();
    return fallbackMs;
  }
  const parsed = parseStrictPositiveInteger(value);
  if (parsed === void 0) throw invalidTimeout(value);
  return parsed;
}
//#endregion
export { parseTimeoutMsWithFallback as n, parseTimeoutMs as t };
