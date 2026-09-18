//#region packages/normalization-core/src/string-coerce.ts
/** Reads a value only when it is already a string, preserving whitespace. */
function readStringValue(value) {
  return typeof value === "string" ? value : void 0;
}
/** Trims string input and returns null for non-strings or empty strings. */
function normalizeNullableString(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}
/** Trims string input and returns undefined for non-strings or empty strings. */
function normalizeOptionalString(value) {
  return normalizeNullableString(value) ?? void 0;
}
/** Stringifies primitive ids/flags before applying optional string normalization. */
function normalizeStringifiedOptionalString(value) {
  if (typeof value === "string") return normalizeOptionalString(value);
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint")
    return normalizeOptionalString(String(value));
}
/** Normalizes an optional array of primitive-ish values into non-empty strings. */
function normalizeStringifiedEntries(values) {
  return (values ?? [])
    .map((entry) => normalizeStringifiedOptionalString(entry))
    .filter((entry) => Boolean(entry));
}
/** Lowercases a normalized optional string. */
function normalizeOptionalLowercaseString(value) {
  return normalizeOptionalString(value)?.toLowerCase();
}
/** Lowercases a normalized string or returns an empty string when absent. */
function normalizeLowercaseStringOrEmpty(value) {
  return normalizeOptionalLowercaseString(value) ?? "";
}
/** Parses loose boolean/fast-mode flags from strings or booleans. */
function normalizeFastMode(raw) {
  if (typeof raw === "boolean") return raw;
  if (!raw) return;
  const key = normalizeLowercaseStringOrEmpty(raw);
  if (["off", "false", "no", "0", "disable", "disabled", "normal"].includes(key)) return false;
  if (["on", "true", "yes", "1", "enable", "enabled", "fast"].includes(key)) return true;
  if (["auto", "automatic"].includes(key)) return "auto";
}
/** Lowercases text while intentionally preserving surrounding whitespace. */
function lowercasePreservingWhitespace(value) {
  return value.toLowerCase();
}
/** Locale-aware lowercase helper that still preserves surrounding whitespace. */
function localeLowercasePreservingWhitespace(value) {
  return value.toLocaleLowerCase();
}
/** Reads a string directly or from an object's `primary` field. */
function resolvePrimaryStringValue(value) {
  if (typeof value === "string") return normalizeOptionalString(value);
  if (!value || typeof value !== "object") return;
  return normalizeOptionalString(value.primary);
}
/** Normalizes thread ids that may be numeric or string-backed. */
function normalizeOptionalThreadValue(value) {
  if (typeof value === "number") return Number.isFinite(value) ? Math.trunc(value) : void 0;
  return normalizeOptionalString(value);
}
/** Normalizes a thread/id value and stringifies finite numeric ids. */
function normalizeOptionalStringifiedId(value) {
  const normalized = normalizeOptionalThreadValue(value);
  return normalized == null ? void 0 : String(normalized);
}
/** Type guard for strings that remain non-empty after trimming. */
function hasNonEmptyString(value) {
  return normalizeOptionalString(value) !== void 0;
}
//#endregion
export {
  normalizeLowercaseStringOrEmpty as a,
  normalizeOptionalString as c,
  normalizeStringifiedEntries as d,
  normalizeStringifiedOptionalString as f,
  normalizeFastMode as i,
  normalizeOptionalStringifiedId as l,
  resolvePrimaryStringValue as m,
  localeLowercasePreservingWhitespace as n,
  normalizeNullableString as o,
  readStringValue as p,
  lowercasePreservingWhitespace as r,
  normalizeOptionalLowercaseString as s,
  hasNonEmptyString as t,
  normalizeOptionalThreadValue as u,
};
