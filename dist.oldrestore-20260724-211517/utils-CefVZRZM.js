//#region src/agents/embedded-agent-runner/utils.ts
function normalizeContextTokenBudget(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : void 0;
}
/** Converts logical product modes into provider-facing effort values. */
function mapThinkingLevelForProvider(level) {
  return level === "ultra" ? "max" : level;
}
function mapThinkingLevel(level) {
  const providerLevel = mapThinkingLevelForProvider(level);
  if (!providerLevel) return "off";
  if (providerLevel === "adaptive") return "high";
  return providerLevel;
}
//#endregion
export {
  mapThinkingLevelForProvider as n,
  normalizeContextTokenBudget as r,
  mapThinkingLevel as t,
};
