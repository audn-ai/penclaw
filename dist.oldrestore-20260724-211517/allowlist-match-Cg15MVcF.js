import {
  a as normalizeLowercaseStringOrEmpty,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
//#region src/channels/allowlist-match.ts
/**
 * Channel allowlist matching primitives.
 *
 * Compiles normalized allowlists and records match metadata for diagnostics.
 */
/** Formats match metadata for diagnostics without leaking channel-specific text. */
function formatAllowlistMatchMeta(match) {
  return `matchKey=${match?.matchKey ?? "none"} matchSource=${match?.matchSource ?? "none"}`;
}
/** Compiles normalized allowlist entries and records wildcard presence. */
function compileAllowlist(entries) {
  const set = new Set(entries.filter(Boolean));
  return {
    set,
    wildcard: set.has("*"),
  };
}
function compileSimpleAllowlist(entries) {
  return compileAllowlist(
    entries
      .map((entry) => normalizeOptionalLowercaseString(String(entry)))
      .filter((entry) => Boolean(entry)),
  );
}
function resolveAllowlistCandidates(params) {
  for (const candidate of params.candidates) {
    if (!candidate.value) continue;
    if (params.compiledAllowlist.set.has(candidate.value))
      return {
        allowed: true,
        matchKey: candidate.value,
        matchSource: candidate.source,
      };
  }
  return { allowed: false };
}
/** Applies wildcard and empty-list semantics before candidate matching. */
function resolveCompiledAllowlistMatch(params) {
  if (params.compiledAllowlist.set.size === 0) return { allowed: false };
  if (params.compiledAllowlist.wildcard)
    return {
      allowed: true,
      matchKey: "*",
      matchSource: "wildcard",
    };
  return resolveAllowlistCandidates(params);
}
/** Convenience wrapper for callers that do not need to reuse a compiled list. */
function resolveAllowlistMatchByCandidates(params) {
  return resolveCompiledAllowlistMatch({
    compiledAllowlist: compileAllowlist(params.allowList),
    candidates: params.candidates,
  });
}
/** Matches simple sender id/name allowlists used by legacy channel config. */
function resolveAllowlistMatchSimple(params) {
  const allowFrom = compileSimpleAllowlist(params.allowFrom);
  if (allowFrom.set.size === 0) return { allowed: false };
  if (allowFrom.wildcard)
    return {
      allowed: true,
      matchKey: "*",
      matchSource: "wildcard",
    };
  const senderId = normalizeLowercaseStringOrEmpty(params.senderId);
  const senderName = normalizeOptionalLowercaseString(params.senderName);
  return resolveAllowlistCandidates({
    compiledAllowlist: allowFrom,
    candidates: [
      {
        value: senderId,
        source: "id",
      },
      ...(params.allowNameMatching === true && senderName
        ? [
            {
              value: senderName,
              source: "name",
            },
          ]
        : []),
    ],
  });
}
//#endregion
export {
  resolveAllowlistMatchSimple as a,
  resolveAllowlistMatchByCandidates as i,
  formatAllowlistMatchMeta as n,
  resolveCompiledAllowlistMatch as o,
  resolveAllowlistCandidates as r,
  compileAllowlist as t,
};
