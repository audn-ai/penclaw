//#region packages/normalization-core/src/number-coercion.d.ts
/** Returns a number only when the input is already finite. */
declare function asFiniteNumber(value: unknown): number | undefined;
/** Returns a finite number only when it satisfies the supplied inclusive/exclusive bounds. */
declare function asFiniteNumberInRange(
  value: unknown,
  range: {
    min?: number;
    max?: number;
    minExclusive?: boolean;
    maxExclusive?: boolean;
  },
): number | undefined;
/** Returns a safe integer only when it satisfies the supplied inclusive bounds. */
declare function asSafeIntegerInRange(
  value: unknown,
  range: {
    min?: number;
    max?: number;
  },
): number | undefined;
/** Parses finite numbers from number values or strict numeric string tokens. */
declare function parseFiniteNumber(value: unknown): number | undefined;
/** Parses only safe integer numbers or base-10 integer strings. */
declare function parseStrictInteger(value: unknown): number | undefined;
/** Parses only finite decimal/scientific string tokens, rejecting partial numbers. */
declare function parseStrictFiniteNumber(value: unknown): number | undefined;
/** Returns positive safe integers without string coercion. */
declare function asPositiveSafeInteger(value: unknown): number | undefined;
/** Conservative upper bound for Node timer delays. */
declare const MAX_TIMER_TIMEOUT_MS = 2147000000;
/** Timer bound expressed in whole seconds for env/config inputs. */
declare const MAX_TIMER_TIMEOUT_SECONDS: number;
/** Largest timestamp accepted by JavaScript Date. */
declare const MAX_DATE_TIMESTAMP_MS = 8640000000000000;
/** Fallback ISO value for invalid timestamp inputs. */
declare const UNIX_EPOCH_ISO_STRING = "1970-01-01T00:00:00.000Z";
/** Returns a Date-valid millisecond timestamp. */
declare function asDateTimestampMs(value: unknown): number | undefined;
/** Checks whether a Date-valid timestamp is after the supplied/current time. */
declare function isFutureDateTimestampMs(
  value: unknown,
  opts?: {
    nowMs?: number;
  },
): value is number;
/** Converts Date-valid millisecond timestamps to ISO strings. */
declare function timestampMsToIsoString(value: unknown): string | undefined;
/** Resolves a Date-valid timestamp with a Date-valid fallback. */
declare function resolveDateTimestampMs(value: unknown, fallbackValue?: unknown): number;
/** Resolves a Date-valid timestamp to ISO, falling back to Unix epoch if needed. */
declare function resolveTimestampMsToIsoString(value: unknown, fallbackValue?: unknown): string;
/** Formats Date-valid timestamps for filenames by replacing colon separators. */
declare function timestampMsToIsoFileStamp(value: unknown, fallbackValue?: unknown): string;
/** Clamps finite millisecond values into the Node-safe timer range. */
declare function clampTimerTimeoutMs(valueMs: unknown, minMs?: number): number | undefined;
/** Clamps positive finite millisecond values into the Node-safe timer range. */
declare function clampPositiveTimerTimeoutMs(valueMs: unknown): number | undefined;
/** Resolves a positive timer timeout or falls back through safe timer clamping. */
declare function resolvePositiveTimerTimeoutMs(valueMs: unknown, fallbackMs: number): number;
/** Resolves arbitrary timeout input with fallback and minimum timer bounds. */
declare function resolveTimerTimeoutMs(
  valueMs: unknown,
  fallbackMs: number,
  minMs?: number,
): number;
/** Adds grace time to a finite timeout and clamps the result to Node-safe bounds. */
declare function addTimerTimeoutGraceMs(timeoutMs: unknown, graceMs?: number): number | undefined;
/** Converts finite positive seconds to Node-safe milliseconds. */
declare function finiteSecondsToTimerSafeMilliseconds(
  value: unknown,
  opts?: {
    floorSeconds?: boolean;
  },
): number | undefined;
/** Resolves an integer option from finite numeric input or fallback, then clamps bounds. */
declare function resolveIntegerOption(
  value: unknown,
  fallback: number,
  range?: {
    min?: number;
    max?: number;
  },
): number;
/** Resolves an optional integer option, returning undefined for non-finite input. */
declare function resolveOptionalIntegerOption(
  value: unknown,
  range?: {
    min?: number;
    max?: number;
  },
): number | undefined;
/** Resolves an integer option with a non-negative lower bound. */
declare function resolveNonNegativeIntegerOption(value: unknown, fallback: number): number;
/** Parses strict positive integer values from numbers or strings. */
declare function parseStrictPositiveInteger(value: unknown): number | undefined;
/** Parses strict non-negative integer values from numbers or strings. */
declare function parseStrictNonNegativeInteger(value: unknown): number | undefined;
/** Converts strict positive seconds to safe millisecond counts. */
declare function positiveSecondsToSafeMilliseconds(value: unknown): number | undefined;
/** Converts strict non-negative seconds to safe millisecond counts. */
declare function nonNegativeSecondsToSafeMilliseconds(value: unknown): number | undefined;
/** Resolves an absolute expiration timestamp from a positive duration in milliseconds. */
declare function resolveExpiresAtMsFromDurationMs(
  value: unknown,
  opts?: {
    nowMs?: number;
    bufferMs?: number;
    minRemainingMs?: number;
  },
): number | undefined;
/** Resolves an absolute expiration timestamp from a positive duration in seconds. */
declare function resolveExpiresAtMsFromDurationSeconds(
  value: unknown,
  opts?: {
    nowMs?: number;
    bufferMs?: number;
    minRemainingMs?: number;
  },
): number | undefined;
/** Resolves an absolute expiration timestamp from Unix epoch seconds. */
declare function resolveExpiresAtMsFromEpochSeconds(
  value: unknown,
  opts?: {
    bufferMs?: number;
    maxMs?: number;
  },
): number | undefined;
/** Resolves expiration input that may be relative seconds, epoch seconds, or epoch milliseconds. */
declare function resolveExpiresAtMsFromDurationOrEpoch(
  value: unknown,
  opts?: {
    nowMs?: number;
    relativeSecondsThreshold?: number;
    absoluteMillisecondsThreshold?: number;
  },
): number | undefined;
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
