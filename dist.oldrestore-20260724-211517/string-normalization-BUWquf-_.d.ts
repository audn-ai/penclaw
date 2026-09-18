//#region packages/normalization-core/src/string-normalization.d.ts
/** Coerces entries to strings, trims them, and drops empty results. */
declare function normalizeStringEntries(list?: ReadonlyArray<unknown>): string[];
/** Normalizes string entries and lowercases each retained value. */
declare function normalizeStringEntriesLower(list?: ReadonlyArray<unknown>): string[];
/** Returns first-seen unique values while preserving insertion order. */
declare function uniqueValues<T>(values: Iterable<T>): T[];
/** Returns first-seen unique strings while preserving insertion order. */
declare function uniqueStrings(values: Iterable<string>): string[];
/** Returns unique strings sorted with stable ASCII comparison. */
declare function sortUniqueStrings(values: Iterable<string>): string[];
/** Normalizes entries, removes duplicates, and preserves first-seen order. */
declare function normalizeUniqueStringEntries(values?: Iterable<unknown>): string[];
/** Lowercases normalized entries, removes empties/duplicates, and preserves first-seen order. */
declare function normalizeUniqueStringEntriesLower(values?: Iterable<unknown>): string[];
/** Normalizes entries, removes duplicates, and returns sorted output. */
declare function normalizeSortedUniqueStringEntries(values?: Iterable<unknown>): string[];
/** Normalizes array-backed string lists and rejects non-array input as empty. */
declare function normalizeTrimmedStringList(value: unknown): string[];
/** Normalizes an array-backed string list and removes duplicates. */
declare function normalizeUniqueTrimmedStringList(value: unknown): string[];
/** Normalizes an array-backed string list, removes duplicates, and sorts it. */
declare function normalizeSortedUniqueTrimmedStringList(value: unknown): string[];
/** Returns undefined instead of an empty normalized array-backed string list. */
declare function normalizeOptionalTrimmedStringList(value: unknown): string[] | undefined;
/** Returns undefined for non-arrays but preserves an empty array for explicit arrays. */
declare function normalizeArrayBackedTrimmedStringList(value: unknown): string[] | undefined;
/** Normalizes either a single string-like value or an array-backed string list. */
declare function normalizeSingleOrTrimmedStringList(value: unknown): string[];
/** Normalizes single-or-array string input and removes duplicates. */
declare function normalizeUniqueSingleOrTrimmedStringList(value: unknown): string[];
/** Parses either array entries or comma-separated string entries into trimmed values. */
declare function normalizeCsvOrLooseStringList(value: unknown): string[];
/** Normalizes user-facing names into permissive lowercase slugs that may keep #/@/._+. */
declare function normalizeHyphenSlug(raw?: string | null): string;
/** Normalizes @/#-prefixed channel names into strict lowercase hyphen slugs without the prefix. */
declare function normalizeAtHashSlug(raw?: string | null): string;
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
