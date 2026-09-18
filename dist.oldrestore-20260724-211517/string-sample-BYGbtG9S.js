//#region src/shared/string-sample.ts
/**
 * Shared string sampling for operator logs and SDK helpers that need bounded readable lists.
 * This intentionally formats for humans, not for machine parsing.
 */
/** Formats a bounded comma-separated sample of string entries with a hidden-count suffix. */
function summarizeStringEntries(params) {
  const entries = params.entries ?? [];
  if (entries.length === 0) return params.emptyText ?? "";
  const rawLimit = params.limit ?? 6;
  const limit = Number.isFinite(rawLimit) ? Math.max(1, Math.floor(rawLimit)) : 6;
  const sample = entries.slice(0, limit);
  const suffix = entries.length > sample.length ? ` (+${entries.length - sample.length})` : "";
  return `${sample.join(", ")}${suffix}`;
}
//#endregion
export { summarizeStringEntries as t };
