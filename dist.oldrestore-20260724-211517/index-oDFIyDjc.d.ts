//#region packages/llm-core/src/model-contracts/anthropic.d.ts
type ClaudeModelRef = {
  id?: string;
  params?: Record<string, unknown>;
};
type ClaudeEffortModelRef = ClaudeModelRef & {
  thinkingLevelMap?: Record<string, string | null | undefined>;
};
/** Resolve the canonical normalized Claude model id for one runtime model ref. */
declare function resolveClaudeModelIdentity(ref: ClaudeModelRef): string;
/** Resolve Claude Fable 5 through direct ids, cloud ids, or deployment metadata. */
declare function resolveClaudeFable5ModelIdentity(ref: ClaudeModelRef): string | undefined;
/** Resolve Claude Mythos 5 through direct ids, cloud ids, or deployment metadata. */
declare function resolveClaudeMythos5ModelIdentity(ref: ClaudeModelRef): string | undefined;
/** Return whether a Claude model requires adaptive thinking instead of manual budgets. */
declare function requiresClaudeMandatoryAdaptiveThinking(ref: ClaudeModelRef): boolean;
/** Resolve Claude Sonnet 5 through direct ids, cloud ids, or deployment metadata. */
declare function resolveClaudeSonnet5ModelIdentity(ref: ClaudeModelRef): string | undefined;
/** Return whether a Claude model supports adaptive thinking. */
declare function supportsClaudeAdaptiveThinking(ref: ClaudeModelRef): boolean;
/** Return whether a Claude model supports native max effort. */
declare function supportsClaudeNativeMaxEffort(ref: ClaudeModelRef): boolean;
/** Return whether a Claude model supports native xhigh effort. */
declare function supportsClaudeNativeXhighEffort(ref: ClaudeModelRef): boolean;
/** Return whether a Claude model rejects caller-selected sampling parameters. */
declare function requiresClaudeDefaultSampling(ref: ClaudeModelRef): boolean;
/**
 * Fill native Claude effort mappings only when the provider did not publish a
 * narrower route-specific contract.
 */
declare function resolveClaudeNativeThinkingLevelMap(
  ref: ClaudeEffortModelRef,
): Record<string, string | null | undefined> | undefined;
//#endregion
export {
  resolveClaudeMythos5ModelIdentity as a,
  supportsClaudeAdaptiveThinking as c,
  resolveClaudeModelIdentity as i,
  supportsClaudeNativeMaxEffort as l,
  requiresClaudeMandatoryAdaptiveThinking as n,
  resolveClaudeNativeThinkingLevelMap as o,
  resolveClaudeFable5ModelIdentity as r,
  resolveClaudeSonnet5ModelIdentity as s,
  requiresClaudeDefaultSampling as t,
  supportsClaudeNativeXhighEffort as u,
};
