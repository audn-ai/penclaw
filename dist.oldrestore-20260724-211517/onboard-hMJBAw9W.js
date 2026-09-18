import {
  a as XAI_DEFAULT_MODEL_ID,
  l as isLegacyXaiBuiltinModel,
  s as buildXaiCatalogModels,
  t as XAI_BASE_URL,
} from "./model-definitions-BoOPeWPv.js";
import { p as createModelCatalogPresetAppliers } from "./provider-onboard-CvQgbxgZ.js";
//#region extensions/xai/onboard.ts
const XAI_DEFAULT_MODEL_REF = `xai/${XAI_DEFAULT_MODEL_ID}`;
const xaiPresetAppliers = createModelCatalogPresetAppliers({
  primaryModelRef: XAI_DEFAULT_MODEL_REF,
  resolveParams: (_cfg, api) => ({
    providerId: "xai",
    api,
    baseUrl: XAI_BASE_URL,
    catalogModels: buildXaiCatalogModels(),
    aliases: [
      {
        modelRef: XAI_DEFAULT_MODEL_REF,
        alias: "Grok",
      },
    ],
  }),
});
function pruneRetiredXaiBuiltinModels(cfg) {
  const provider = cfg.models?.providers?.xai;
  if (!provider || !Array.isArray(provider.models)) return cfg;
  const models = provider.models.filter((model) => !isLegacyXaiBuiltinModel(model));
  if (models.length === provider.models.length) return cfg;
  return {
    ...cfg,
    models: {
      ...cfg.models,
      providers: {
        ...cfg.models?.providers,
        xai: {
          ...provider,
          models,
        },
      },
    },
  };
}
function applyXaiProviderConfig(cfg) {
  return xaiPresetAppliers.applyProviderConfig(
    pruneRetiredXaiBuiltinModels(cfg),
    "openai-responses",
  );
}
function applyXaiConfig(cfg) {
  return xaiPresetAppliers.applyConfig(pruneRetiredXaiBuiltinModels(cfg), "openai-responses");
}
//#endregion
export { applyXaiConfig as n, applyXaiProviderConfig as r, XAI_DEFAULT_MODEL_REF as t };
