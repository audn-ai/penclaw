//#region src/agents/embedded-agent-runner/model-context-tokens.ts
/** Returns finite context-token metadata when a model discovery source provided it. */
/** Prefer contextTokens, then contextWindow, when present on model metadata. */
function readAgentModelContextTokens(model) {
  const value = model?.contextTokens;
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
//#endregion
export { readAgentModelContextTokens as t };
