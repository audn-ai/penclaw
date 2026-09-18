//#region packages/normalization-core/src/number-coercion.ts
/** Returns a number only when the input is already finite. */
function asFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
/** Returns a finite number only when it satisfies the supplied inclusive/exclusive bounds. */
function asFiniteNumberInRange(value, range) {
  const number = asFiniteNumber(value);
  if (number === void 0) return;
  if (range.min !== void 0) {
    if (range.minExclusive ? number <= range.min : number < range.min) return;
  }
  if (range.max !== void 0) {
    if (range.maxExclusive ? number >= range.max : number > range.max) return;
  }
  return number;
}
/** Returns a safe integer only when it satisfies the supplied inclusive bounds. */
function asSafeIntegerInRange(value, range) {
  if (typeof value !== "number" || !Number.isSafeInteger(value)) return;
  if (range.min !== void 0 && value < range.min) return;
  if (range.max !== void 0 && value > range.max) return;
  return value;
}
function normalizeNumericString(value) {
  const trimmed = value.trim();
  return trimmed ? trimmed : void 0;
}
/** Parses finite numbers from number values or strict numeric string tokens. */
function parseFiniteNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : void 0;
  return parseStrictFiniteNumber(value);
}
/** Parses only safe integer numbers or base-10 integer strings. */
function parseStrictInteger(value) {
  if (typeof value === "number") return Number.isSafeInteger(value) ? value : void 0;
  if (typeof value !== "string") return;
  const normalized = normalizeNumericString(value);
  if (!normalized || !/^[+-]?\d+$/.test(normalized)) return;
  const parsed = Number(normalized);
  return Number.isSafeInteger(parsed) ? parsed : void 0;
}
/** Parses only finite decimal/scientific string tokens, rejecting partial numbers. */
function parseStrictFiniteNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : void 0;
  if (typeof value !== "string") return;
  const normalized = normalizeNumericString(value);
  if (!normalized || !/^[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))(?:e[+-]?\d+)?$/i.test(normalized)) return;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : void 0;
}
/** Returns positive safe integers without string coercion. */
function asPositiveSafeInteger(value) {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0 ? value : void 0;
}
/** Conservative upper bound for Node timer delays. */
const MAX_TIMER_TIMEOUT_MS = 2147e6;
/** Timer bound expressed in whole seconds for env/config inputs. */
const MAX_TIMER_TIMEOUT_SECONDS = Math.floor(MAX_TIMER_TIMEOUT_MS / 1e3);
/** Largest timestamp accepted by JavaScript Date. */
const MAX_DATE_TIMESTAMP_MS = 864e13;
/** Fallback ISO value for invalid timestamp inputs. */
const UNIX_EPOCH_ISO_STRING = "1970-01-01T00:00:00.000Z";
/** Returns a Date-valid millisecond timestamp. */
function asDateTimestampMs(value) {
  return asFiniteNumberInRange(value, {
    min: -864e13,
    max: MAX_DATE_TIMESTAMP_MS,
  });
}
/** Checks whether a Date-valid timestamp is after the supplied/current time. */
function isFutureDateTimestampMs(value, opts = {}) {
  const timestampMs = asDateTimestampMs(value);
  const nowMs = asDateTimestampMs(opts.nowMs ?? Date.now());
  return timestampMs !== void 0 && nowMs !== void 0 && timestampMs > nowMs;
}
/** Converts Date-valid millisecond timestamps to ISO strings. */
function timestampMsToIsoString(value) {
  const timestampMs = asDateTimestampMs(value);
  return timestampMs === void 0 ? void 0 : new Date(timestampMs).toISOString();
}
/** Resolves a Date-valid timestamp with a Date-valid fallback. */
function resolveDateTimestampMs(value, fallbackValue = Date.now()) {
  return asDateTimestampMs(value) ?? asDateTimestampMs(fallbackValue) ?? 0;
}
/** Resolves a Date-valid timestamp to ISO, falling back to Unix epoch if needed. */
function resolveTimestampMsToIsoString(value, fallbackValue = Date.now()) {
  return (
    timestampMsToIsoString(value) ??
    timestampMsToIsoString(fallbackValue) ??
    "1970-01-01T00:00:00.000Z"
  );
}
/** Formats Date-valid timestamps for filenames by replacing colon separators. */
function timestampMsToIsoFileStamp(value, fallbackValue = Date.now()) {
  return resolveTimestampMsToIsoString(value, fallbackValue).replaceAll(":", "-");
}
/** Clamps finite millisecond values into the Node-safe timer range. */
function clampTimerTimeoutMs(valueMs, minMs = 1) {
  const value = asFiniteNumber(valueMs);
  if (value === void 0) return;
  return Math.min(
    Math.max(Math.floor(value), Math.max(1, Math.floor(minMs))),
    MAX_TIMER_TIMEOUT_MS,
  );
}
/** Clamps positive finite millisecond values into the Node-safe timer range. */
function clampPositiveTimerTimeoutMs(valueMs) {
  const value = asFiniteNumber(valueMs);
  if (value === void 0 || value <= 0) return;
  return clampTimerTimeoutMs(value);
}
/** Resolves a positive timer timeout or falls back through safe timer clamping. */
function resolvePositiveTimerTimeoutMs(valueMs, fallbackMs) {
  return clampPositiveTimerTimeoutMs(valueMs) ?? resolveTimerTimeoutMs(fallbackMs, 1);
}
/** Resolves arbitrary timeout input with fallback and minimum timer bounds. */
function resolveTimerTimeoutMs(valueMs, fallbackMs, minMs = 1) {
  const value = asFiniteNumber(valueMs) ?? asFiniteNumber(fallbackMs);
  const min = Math.max(0, Math.floor(minMs));
  if (value === void 0) return min;
  return Math.min(Math.max(Math.floor(value), min), MAX_TIMER_TIMEOUT_MS);
}
/** Adds grace time to a finite timeout and clamps the result to Node-safe bounds. */
function addTimerTimeoutGraceMs(timeoutMs, graceMs = 5e3) {
  const timeout = asFiniteNumber(timeoutMs);
  const grace = asFiniteNumber(graceMs);
  if (timeout === void 0 || grace === void 0) return;
  const withGrace = timeout + grace;
  return Number.isFinite(withGrace) ? clampTimerTimeoutMs(withGrace) : MAX_TIMER_TIMEOUT_MS;
}
/** Converts finite positive seconds to Node-safe milliseconds. */
function finiteSecondsToTimerSafeMilliseconds(value, opts = {}) {
  const seconds = asFiniteNumber(value);
  if (seconds === void 0 || seconds <= 0) return;
  const boundedSeconds = opts.floorSeconds ? Math.floor(seconds) : seconds;
  const milliseconds = Math.floor(boundedSeconds * 1e3);
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) return;
  return Math.min(milliseconds, MAX_TIMER_TIMEOUT_MS);
}
/** Resolves an integer option from finite numeric input or fallback, then clamps bounds. */
function resolveIntegerOption(value, fallback, range = {}) {
  const floored = Math.floor(
    typeof value === "number" && Number.isFinite(value) ? value : fallback,
  );
  const minBounded = range.min === void 0 ? floored : Math.max(range.min, floored);
  return range.max === void 0 ? minBounded : Math.min(range.max, minBounded);
}
/** Resolves an optional integer option, returning undefined for non-finite input. */
function resolveOptionalIntegerOption(value, range = {}) {
  if (typeof value !== "number" || !Number.isFinite(value)) return;
  return resolveIntegerOption(value, value, range);
}
/** Resolves an integer option with a non-negative lower bound. */
function resolveNonNegativeIntegerOption(value, fallback) {
  return resolveIntegerOption(value, fallback, { min: 0 });
}
/** Parses strict positive integer values from numbers or strings. */
function parseStrictPositiveInteger(value) {
  const parsed = parseStrictInteger(value);
  return parsed !== void 0 && parsed > 0 ? parsed : void 0;
}
/** Parses strict non-negative integer values from numbers or strings. */
function parseStrictNonNegativeInteger(value) {
  const parsed = parseStrictInteger(value);
  return parsed !== void 0 && parsed >= 0 ? parsed : void 0;
}
/** Converts strict positive seconds to safe millisecond counts. */
function positiveSecondsToSafeMilliseconds(value) {
  const seconds = parseStrictPositiveInteger(value);
  if (seconds === void 0) return;
  const milliseconds = seconds * 1e3;
  return Number.isSafeInteger(milliseconds) ? milliseconds : void 0;
}
/** Converts strict non-negative seconds to safe millisecond counts. */
function nonNegativeSecondsToSafeMilliseconds(value) {
  const seconds = parseStrictNonNegativeInteger(value);
  if (seconds === void 0) return;
  const milliseconds = seconds * 1e3;
  return Number.isSafeInteger(milliseconds) ? milliseconds : void 0;
}
/** Resolves an absolute expiration timestamp from a positive duration in milliseconds. */
function resolveExpiresAtMsFromDurationMs(value, opts = {}) {
  const durationMs = asPositiveSafeInteger(value);
  if (durationMs === void 0) return;
  const nowMs = asDateTimestampMs(opts.nowMs ?? Date.now());
  const bufferMs = asFiniteNumber(opts.bufferMs ?? 0);
  if (nowMs === void 0 || bufferMs === void 0) return;
  const expiresAt = nowMs + durationMs - bufferMs;
  if (!Number.isSafeInteger(expiresAt) || timestampMsToIsoString(expiresAt) === void 0) return;
  const minRemainingMs = opts.minRemainingMs;
  if (minRemainingMs === void 0) return expiresAt;
  const minExpiresAt = nowMs + minRemainingMs;
  if (!Number.isSafeInteger(minExpiresAt) || timestampMsToIsoString(minExpiresAt) === void 0)
    return expiresAt;
  return Math.max(expiresAt, minExpiresAt);
}
/** Resolves an absolute expiration timestamp from a positive duration in seconds. */
function resolveExpiresAtMsFromDurationSeconds(value, opts = {}) {
  const durationMs = positiveSecondsToSafeMilliseconds(value);
  return durationMs === void 0 ? void 0 : resolveExpiresAtMsFromDurationMs(durationMs, opts);
}
/** Resolves an absolute expiration timestamp from Unix epoch seconds. */
function resolveExpiresAtMsFromEpochSeconds(value, opts = {}) {
  const epochMs =
    typeof value === "number" && Number.isFinite(value) && value > 0
      ? Math.trunc(value) * 1e3
      : positiveSecondsToSafeMilliseconds(value);
  if (epochMs === void 0) return;
  const expiresAt = epochMs - (opts.bufferMs ?? 0);
  if (!Number.isSafeInteger(expiresAt)) return;
  if (timestampMsToIsoString(expiresAt) === void 0) return;
  const maxMs = opts.maxMs;
  return maxMs === void 0 || expiresAt <= maxMs ? expiresAt : void 0;
}
/** Resolves expiration input that may be relative seconds, epoch seconds, or epoch milliseconds. */
function resolveExpiresAtMsFromDurationOrEpoch(value, opts = {}) {
  const parsed = parseStrictPositiveInteger(value);
  if (parsed === void 0) return;
  if (parsed < (opts.relativeSecondsThreshold ?? 1e9))
    return resolveExpiresAtMsFromDurationSeconds(parsed, { nowMs: opts.nowMs });
  if (parsed < (opts.absoluteMillisecondsThreshold ?? 0xe8d4a51000))
    return resolveExpiresAtMsFromEpochSeconds(parsed);
  return asDateTimestampMs(parsed);
}
//#endregion
export {
  resolvePositiveTimerTimeoutMs as A,
  resolveExpiresAtMsFromDurationMs as C,
  resolveIntegerOption as D,
  resolveExpiresAtMsFromEpochSeconds as E,
  resolveTimestampMsToIsoString as M,
  timestampMsToIsoFileStamp as N,
  resolveNonNegativeIntegerOption as O,
  timestampMsToIsoString as P,
  resolveDateTimestampMs as S,
  resolveExpiresAtMsFromDurationSeconds as T,
  parseStrictFiniteNumber as _,
  addTimerTimeoutGraceMs as a,
  parseStrictPositiveInteger as b,
  asFiniteNumberInRange as c,
  clampPositiveTimerTimeoutMs as d,
  clampTimerTimeoutMs as f,
  parseFiniteNumber as g,
  nonNegativeSecondsToSafeMilliseconds as h,
  UNIX_EPOCH_ISO_STRING as i,
  resolveTimerTimeoutMs as j,
  resolveOptionalIntegerOption as k,
  asPositiveSafeInteger as l,
  isFutureDateTimestampMs as m,
  MAX_TIMER_TIMEOUT_MS as n,
  asDateTimestampMs as o,
  finiteSecondsToTimerSafeMilliseconds as p,
  MAX_TIMER_TIMEOUT_SECONDS as r,
  asFiniteNumber as s,
  MAX_DATE_TIMESTAMP_MS as t,
  asSafeIntegerInRange as u,
  parseStrictInteger as v,
  resolveExpiresAtMsFromDurationOrEpoch as w,
  positiveSecondsToSafeMilliseconds as x,
  parseStrictNonNegativeInteger as y,
};
