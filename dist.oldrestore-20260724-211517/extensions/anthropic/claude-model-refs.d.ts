//#region extensions/anthropic/claude-model-refs.d.ts
/** Normalized Claude CLI selection plus runtime refs used by setup migrations. */
type ClaudeCliAnthropicModelRefs = {
  selectedRef: string;
  runtimeRefs: string[];
  rewriteRef?: string;
};
/** Resolve a Claude CLI model ref into selected and Anthropic-compatible runtime refs. */
declare function resolveClaudeCliAnthropicModelRefs(
  raw: string,
): ClaudeCliAnthropicModelRefs | null;
/** Resolve a known Anthropic/Claude CLI model ref to its current Anthropic model ref. */
declare function resolveKnownAnthropicModelRef(raw?: string): string | null;
//#endregion
export { resolveClaudeCliAnthropicModelRefs, resolveKnownAnthropicModelRef };
