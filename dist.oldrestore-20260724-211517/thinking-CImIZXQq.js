//#region extensions/minimax/thinking.ts
const BUDGET_THINKING_LEVELS = ["off", "minimal", "low", "medium", "high"];
const ADAPTIVE_THINKING_LEVELS = ["off", "adaptive"];
function resolveMinimaxThinkingProfile(modelId) {
  if (/^MiniMax-M3(\b|[-.])/i.test(modelId))
    return {
      levels: ADAPTIVE_THINKING_LEVELS.map((id) => ({ id })),
      defaultLevel: "adaptive",
    };
  if (/^MiniMax-M2(?:\b|[-.])/i.test(modelId))
    return {
      levels: BUDGET_THINKING_LEVELS.map((id) => ({ id })),
      defaultLevel: "off",
    };
}
//#endregion
export { resolveMinimaxThinkingProfile as t };
