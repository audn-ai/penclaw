//#region src/shared/string-sample.d.ts
/**
 * Shared string sampling for operator logs and SDK helpers that need bounded readable lists.
 * This intentionally formats for humans, not for machine parsing.
 */
/** Formats a bounded comma-separated sample of string entries with a hidden-count suffix. */
declare function summarizeStringEntries(params: {
  /** Entries to summarize; nullish values are treated as an empty list. */ entries?: ReadonlyArray<string> | null /** Maximum visible entries; non-finite values use the default and values below one clamp to one. */;
  limit?: number /** Text returned when no entries are available. */;
  emptyText?: string;
}): string;
//#endregion
export { summarizeStringEntries as t };
