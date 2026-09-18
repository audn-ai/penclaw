import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/agents/model-selection-display.ts
/**
 * Formats selected model references for UI/session display.
 */
/** Resolves the most specific provider/model ref for display. */
function resolveModelDisplayRef(params) {
  const runtimeModel = normalizeOptionalString(params.runtimeModel);
  const runtimeProvider = normalizeOptionalString(params.runtimeProvider);
  if (runtimeModel) {
    if (runtimeModel.includes("/")) return runtimeModel;
    if (runtimeProvider) return `${runtimeProvider}/${runtimeModel}`;
    return runtimeModel;
  }
  if (runtimeProvider) return runtimeProvider;
  const overrideModel = normalizeOptionalString(params.overrideModel);
  const overrideProvider = normalizeOptionalString(params.overrideProvider);
  if (overrideModel) {
    if (overrideModel.includes("/")) return overrideModel;
    if (overrideProvider) return `${overrideProvider}/${overrideModel}`;
    return overrideModel;
  }
  if (overrideProvider) return overrideProvider;
  return normalizeOptionalString(params.fallbackModel) || void 0;
}
/** Resolves the model name shown in compact status output. */
function resolveModelDisplayName(params) {
  const modelRef = resolveModelDisplayRef(params);
  if (!modelRef) return "model n/a";
  const slash = modelRef.lastIndexOf("/");
  if (slash >= 0 && slash < modelRef.length - 1) return modelRef.slice(slash + 1);
  return modelRef;
}
/** Resolves session-info model selection from entry, override, and fallback data. */
function resolveSessionInfoModelSelection(params) {
  const fallbackProvider =
    normalizeOptionalString(params.currentProvider) ??
    normalizeOptionalString(params.defaultProvider) ??
    void 0;
  const fallbackModel =
    normalizeOptionalString(params.currentModel) ??
    normalizeOptionalString(params.defaultModel) ??
    void 0;
  if (params.entryProvider !== void 0 || params.entryModel !== void 0)
    return {
      modelProvider: normalizeOptionalString(params.entryProvider) ?? fallbackProvider,
      model: normalizeOptionalString(params.entryModel) ?? fallbackModel,
    };
  const overrideModel = normalizeOptionalString(params.overrideModel);
  if (overrideModel)
    return {
      modelProvider: normalizeOptionalString(params.overrideProvider) || fallbackProvider,
      model: overrideModel,
    };
  return {
    modelProvider: fallbackProvider,
    model: fallbackModel,
  };
}
//#endregion
export {
  resolveModelDisplayRef as n,
  resolveSessionInfoModelSelection as r,
  resolveModelDisplayName as t,
};
