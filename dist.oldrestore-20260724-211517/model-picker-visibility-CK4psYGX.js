import { r as listCliRuntimeProviderIds } from "./cli-backends-D2v5ATPw.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
//#region src/agents/model-picker-visibility.ts
/**
 * Filters provider/model refs for model picker visibility.
 */
const RETIRED_MODEL_PICKER_PROVIDERS = /* @__PURE__ */ new Set(["codex", "codex-cli"]);
/** True for retired provider ids that should stay out of model selection surfaces. */
function isRetiredModelPickerProvider(provider) {
  return RETIRED_MODEL_PICKER_PROVIDERS.has(normalizeProviderId(provider));
}
/** Creates a provider visibility predicate for model picker rendering. */
function createModelPickerVisibleProviderPredicate(params = {}) {
  const cliRuntimeProviders = new Set(
    listCliRuntimeProviderIds({
      config: params.config,
      env: params.env,
      includeSetupRegistry: params.includeSetupRegistry ?? false,
    }),
  );
  return (provider) => {
    const normalized = normalizeProviderId(provider);
    return !isRetiredModelPickerProvider(normalized) && !cliRuntimeProviders.has(normalized);
  };
}
//#endregion
export { isRetiredModelPickerProvider as n, createModelPickerVisibleProviderPredicate as t };
