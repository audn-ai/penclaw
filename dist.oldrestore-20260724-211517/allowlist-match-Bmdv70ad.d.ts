//#region src/channels/allowlist-match.d.ts
type AllowlistMatchSource =
  | "wildcard"
  | "id"
  | "name"
  | "tag"
  | "username"
  | "prefixed-id"
  | "prefixed-user"
  | "prefixed-name"
  | "slug"
  | "localpart";
type AllowlistMatch<TSource extends string = AllowlistMatchSource> = {
  allowed: boolean;
  matchKey?: string;
  matchSource?: TSource;
};
type CompiledAllowlist = {
  set: ReadonlySet<string>;
  wildcard: boolean;
};
/** Formats match metadata for diagnostics without leaking channel-specific text. */
declare function formatAllowlistMatchMeta(
  match?: {
    matchKey?: string;
    matchSource?: string;
  } | null,
): string;
/** Compiles normalized allowlist entries and records wildcard presence. */
declare function compileAllowlist(entries: ReadonlyArray<string>): CompiledAllowlist;
declare function resolveAllowlistCandidates<TSource extends string>(params: {
  compiledAllowlist: CompiledAllowlist;
  candidates: Array<{
    value?: string;
    source: TSource;
  }>;
}): AllowlistMatch<TSource>;
/** Applies wildcard and empty-list semantics before candidate matching. */
declare function resolveCompiledAllowlistMatch<TSource extends string>(params: {
  compiledAllowlist: CompiledAllowlist;
  candidates: Array<{
    value?: string;
    source: TSource;
  }>;
}): AllowlistMatch<TSource>;
/** Convenience wrapper for callers that do not need to reuse a compiled list. */
declare function resolveAllowlistMatchByCandidates<TSource extends string>(params: {
  allowList: ReadonlyArray<string>;
  candidates: Array<{
    value?: string;
    source: TSource;
  }>;
}): AllowlistMatch<TSource>;
/** Matches simple sender id/name allowlists used by legacy channel config. */
declare function resolveAllowlistMatchSimple(params: {
  allowFrom: ReadonlyArray<string | number>;
  senderId: string;
  senderName?: string | null;
  allowNameMatching?: boolean;
}): AllowlistMatch<"wildcard" | "id" | "name">;
//#endregion
export {
  formatAllowlistMatchMeta as a,
  resolveAllowlistMatchSimple as c,
  compileAllowlist as i,
  resolveCompiledAllowlistMatch as l,
  AllowlistMatchSource as n,
  resolveAllowlistCandidates as o,
  CompiledAllowlist as r,
  resolveAllowlistMatchByCandidates as s,
  AllowlistMatch as t,
};
