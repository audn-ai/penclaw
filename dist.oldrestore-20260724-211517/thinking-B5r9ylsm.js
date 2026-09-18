//#region extensions/meta/thinking.ts
const META_REASONING_MODEL_ID = "muse-spark-1.1";
function isMetaReasoningModelId(modelId) {
  return modelId.toLowerCase() === META_REASONING_MODEL_ID;
}
const META_THINKING_PROFILE = {
  levels: ["off", "minimal", "low", "medium", "high", "xhigh"].map((id) => ({ id })),
  defaultLevel: "high",
};
function resolveMetaThinkingProfile(modelId) {
  return isMetaReasoningModelId(modelId) ? META_THINKING_PROFILE : void 0;
}
//#endregion
export { resolveMetaThinkingProfile as t };
