//#region src/channels/channel-config.d.ts
/** How a channel config entry was selected. */
type ChannelMatchSource = "direct" | "parent" | "wildcard";
/** Match result carrying direct, parent, and wildcard candidates for channel config lookup. */
type ChannelEntryMatch<T> = {
  entry?: T;
  key?: string;
  wildcardEntry?: T;
  wildcardKey?: string;
  parentEntry?: T;
  parentKey?: string;
  matchKey?: string;
  matchSource?: ChannelMatchSource;
};
/** Copies match metadata onto resolved channel config output. */
declare function applyChannelMatchMeta<
  TResult extends {
    matchKey?: string;
    matchSource?: ChannelMatchSource;
  },
>(result: TResult, match: ChannelEntryMatch<unknown>): TResult;
/** Resolves a matched entry and preserves the config key that selected it. */
declare function resolveChannelMatchConfig<
  TEntry,
  TResult extends {
    matchKey?: string;
    matchSource?: ChannelMatchSource;
  },
>(match: ChannelEntryMatch<TEntry>, resolveEntry: (entry: TEntry) => TResult): TResult | null;
/** Normalizes human channel names into config-safe slugs. */
declare function normalizeChannelSlug(value: string): string;
/** Builds unique config lookup keys from optional channel/account identifiers. */
declare function buildChannelKeyCandidates(...keys: Array<string | undefined | null>): string[];
/** Finds a direct channel entry and separately carries a wildcard fallback candidate. */
declare function resolveChannelEntryMatch<T>(params: {
  entries?: Record<string, T>;
  keys: string[];
  wildcardKey?: string;
}): ChannelEntryMatch<T>;
/** Resolves config entry precedence: direct, normalized direct, parent, normalized parent, wildcard. */
declare function resolveChannelEntryMatchWithFallback<T>(params: {
  entries?: Record<string, T>;
  keys: string[];
  parentKeys?: string[];
  wildcardKey?: string;
  normalizeKey?: (value: string) => string;
}): ChannelEntryMatch<T>;
/** Resolves nested allowlists where an inner list only applies after the outer list matches. */
declare function resolveNestedAllowlistDecision(params: {
  outerConfigured: boolean;
  outerMatched: boolean;
  innerConfigured: boolean;
  innerMatched: boolean;
}): boolean;
//#endregion
export {
  normalizeChannelSlug as a,
  resolveChannelMatchConfig as c,
  buildChannelKeyCandidates as i,
  resolveNestedAllowlistDecision as l,
  ChannelMatchSource as n,
  resolveChannelEntryMatch as o,
  applyChannelMatchMeta as r,
  resolveChannelEntryMatchWithFallback as s,
  ChannelEntryMatch as t,
};
