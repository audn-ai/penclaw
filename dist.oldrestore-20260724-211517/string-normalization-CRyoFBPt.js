import {
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
//#region packages/normalization-core/src/string-normalization.ts
/** Coerces entries to strings, trims them, and drops empty results. */
function normalizeStringEntries(list) {
  return (list ?? []).map((entry) => normalizeOptionalString(String(entry)) ?? "").filter(Boolean);
}
/** Normalizes string entries and lowercases each retained value. */
function normalizeStringEntriesLower(list) {
  return normalizeStringEntries(list).map((entry) => normalizeOptionalLowercaseString(entry) ?? "");
}
/** Returns first-seen unique values while preserving insertion order. */
function uniqueValues(values) {
  return [...new Set(values)];
}
/** Returns first-seen unique strings while preserving insertion order. */
function uniqueStrings(values) {
  return uniqueValues(values);
}
/** Returns unique strings sorted with stable ASCII comparison. */
function sortUniqueStrings(values) {
  return uniqueStrings(values).toSorted((left, right) =>
    left < right ? -1 : left > right ? 1 : 0,
  );
}
/** Normalizes entries, removes duplicates, and preserves first-seen order. */
function normalizeUniqueStringEntries(values) {
  return uniqueStrings(normalizeStringEntries(values ? [...values] : void 0));
}
/** Lowercases normalized entries, removes empties/duplicates, and preserves first-seen order. */
function normalizeUniqueStringEntriesLower(values) {
  return uniqueStrings(normalizeStringEntriesLower(values ? [...values] : void 0).filter(Boolean));
}
/** Normalizes entries, removes duplicates, and returns sorted output. */
function normalizeSortedUniqueStringEntries(values) {
  return sortUniqueStrings(normalizeUniqueStringEntries(values));
}
/** Normalizes array-backed string lists and rejects non-array input as empty. */
function normalizeTrimmedStringList(value) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    const normalized = normalizeOptionalString(entry);
    return normalized ? [normalized] : [];
  });
}
/** Normalizes an array-backed string list and removes duplicates. */
function normalizeUniqueTrimmedStringList(value) {
  return uniqueStrings(normalizeTrimmedStringList(value));
}
/** Normalizes an array-backed string list, removes duplicates, and sorts it. */
function normalizeSortedUniqueTrimmedStringList(value) {
  return sortUniqueStrings(normalizeTrimmedStringList(value));
}
/** Returns undefined instead of an empty normalized array-backed string list. */
function normalizeOptionalTrimmedStringList(value) {
  const normalized = normalizeTrimmedStringList(value);
  return normalized.length > 0 ? normalized : void 0;
}
/** Returns undefined for non-arrays but preserves an empty array for explicit arrays. */
function normalizeArrayBackedTrimmedStringList(value) {
  if (!Array.isArray(value)) return;
  return normalizeTrimmedStringList(value);
}
/** Normalizes either a single string-like value or an array-backed string list. */
function normalizeSingleOrTrimmedStringList(value) {
  if (Array.isArray(value)) return normalizeTrimmedStringList(value);
  const normalized = normalizeOptionalString(value);
  return normalized ? [normalized] : [];
}
/** Normalizes single-or-array string input and removes duplicates. */
function normalizeUniqueSingleOrTrimmedStringList(value) {
  return uniqueStrings(normalizeSingleOrTrimmedStringList(value));
}
/** Parses either array entries or comma-separated string entries into trimmed values. */
function normalizeCsvOrLooseStringList(value) {
  if (Array.isArray(value)) return normalizeStringEntries(value);
  if (typeof value === "string")
    return value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
  return [];
}
function normalizeSlugInput(raw) {
  return (normalizeOptionalLowercaseString(raw) ?? "").normalize("NFC");
}
/** Normalizes user-facing names into permissive lowercase slugs that may keep #/@/._+. */
function normalizeHyphenSlug(raw) {
  const trimmed = normalizeSlugInput(raw);
  if (!trimmed) return "";
  return trimmed
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{M}\p{N}#@._+-]+/gu, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "");
}
/** Normalizes @/#-prefixed channel names into strict lowercase hyphen slugs without the prefix. */
function normalizeAtHashSlug(raw) {
  const trimmed = normalizeSlugInput(raw);
  if (!trimmed) return "";
  return trimmed
    .replace(/^[@#]+/, "")
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{M}\p{N}-]+/gu, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}
//#endregion
export {
  uniqueStrings as _,
  normalizeOptionalTrimmedStringList as a,
  normalizeSortedUniqueTrimmedStringList as c,
  normalizeTrimmedStringList as d,
  normalizeUniqueSingleOrTrimmedStringList as f,
  sortUniqueStrings as g,
  normalizeUniqueTrimmedStringList as h,
  normalizeHyphenSlug as i,
  normalizeStringEntries as l,
  normalizeUniqueStringEntriesLower as m,
  normalizeAtHashSlug as n,
  normalizeSingleOrTrimmedStringList as o,
  normalizeUniqueStringEntries as p,
  normalizeCsvOrLooseStringList as r,
  normalizeSortedUniqueStringEntries as s,
  normalizeArrayBackedTrimmedStringList as t,
  normalizeStringEntriesLower as u,
  uniqueValues as v,
};
