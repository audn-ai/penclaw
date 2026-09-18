import { n as normalizeMediaProviderId } from "./provider-id-DSbuCFIb.js";
//#region src/media-understanding/config-provider-models.ts
function hasImageCapableModel(providerCfg) {
  return (providerCfg.models ?? []).some(
    (model) => Array.isArray(model?.input) && model.input.includes("image"),
  );
}
/** Finds configured model providers that can be auto-registered for image understanding. */
function resolveImageCapableConfigProviderIds(cfg) {
  const configProviders = cfg?.models?.providers;
  if (!configProviders || typeof configProviders !== "object") return [];
  const providerIds = [];
  for (const [providerKey, providerCfg] of Object.entries(configProviders)) {
    if (!providerKey?.trim() || !hasImageCapableModel(providerCfg)) continue;
    providerIds.push(normalizeMediaProviderId(providerKey));
  }
  return providerIds;
}
//#endregion
export { resolveImageCapableConfigProviderIds as t };
