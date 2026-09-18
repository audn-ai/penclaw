import "./provider-catalog-B4AEIeuC.js";
import "./model-definitions-DX4vw9yq.js";
import "./onboard-BAmlBuo1.js";
const MISTRAL_MODEL_TRANSPORT_PATCH = {
  supportsStore: false,
  supportsPromptCacheKey: true,
  supportsLongCacheRetention: false,
  maxTokensField: "max_tokens",
};
const MISTRAL_SMALL_LATEST_REASONING_EFFORT_MAP = {
  off: "none",
  minimal: "none",
  low: "high",
  medium: "high",
  high: "high",
  xhigh: "high",
  adaptive: "high",
  max: "high",
};
const MISTRAL_SMALL_LATEST_ID = "mistral-small-latest";
const MISTRAL_SMALL_4_ID = "mistral-small-2603";
const MISTRAL_MEDIUM_3_5_ID = "mistral-medium-3-5";
function resolveMistralCompatPatch(model) {
  const reasoningEnabled =
    model.id === "mistral-small-latest" ||
    model.id === "mistral-small-2603" ||
    model.id === "mistral-medium-3-5";
  return {
    ...MISTRAL_MODEL_TRANSPORT_PATCH,
    supportsReasoningEffort: reasoningEnabled,
    reasoningEffortMap: reasoningEnabled ? MISTRAL_SMALL_LATEST_REASONING_EFFORT_MAP : void 0,
  };
}
function compatMatchesResolved(compat, modelId) {
  const expected = resolveMistralCompatPatch({ id: modelId });
  return (
    compat?.supportsStore === expected.supportsStore &&
    compat?.supportsPromptCacheKey === expected.supportsPromptCacheKey &&
    compat?.supportsLongCacheRetention === expected.supportsLongCacheRetention &&
    compat?.supportsReasoningEffort === expected.supportsReasoningEffort &&
    compat?.maxTokensField === expected.maxTokensField &&
    compat?.reasoningEffortMap === expected.reasoningEffortMap
  );
}
function applyMistralModelCompat(model) {
  const compat = model.compat && typeof model.compat === "object" ? model.compat : void 0;
  if (compatMatchesResolved(compat, model.id)) return model;
  const patch = resolveMistralCompatPatch(model);
  return {
    ...model,
    compat: {
      ...compat,
      ...patch,
    },
  };
}
//#endregion
export {
  applyMistralModelCompat as a,
  MISTRAL_SMALL_LATEST_ID as i,
  MISTRAL_MODEL_TRANSPORT_PATCH as n,
  resolveMistralCompatPatch as o,
  MISTRAL_SMALL_4_ID as r,
  MISTRAL_MEDIUM_3_5_ID as t,
};
