import {
  i as buildMetaModelDefinition,
  n as META_MODEL_CATALOG,
  t as META_BASE_URL,
} from "./models-CFe9nJdG.js";
import { p as createModelCatalogPresetAppliers } from "./provider-onboard-CvQgbxgZ.js";
//#region extensions/meta/onboard.ts
/**
 * Meta onboarding config helpers.
 */
/** Default Meta model reference used after onboarding. */
const META_DEFAULT_MODEL_REF = "meta/muse-spark-1.1";
const metaPresetAppliers = createModelCatalogPresetAppliers({
  primaryModelRef: META_DEFAULT_MODEL_REF,
  resolveParams: (_cfg) => ({
    providerId: "meta",
    api: "openai-responses",
    baseUrl: META_BASE_URL,
    catalogModels: META_MODEL_CATALOG.map(buildMetaModelDefinition),
    aliases: [
      {
        modelRef: META_DEFAULT_MODEL_REF,
        alias: "Muse Spark 1.1",
      },
    ],
  }),
});
/** Applies Meta provider/catalog config and default model aliases. */
function applyMetaConfig(cfg) {
  return metaPresetAppliers.applyConfig(cfg);
}
//#endregion
export { applyMetaConfig as n, META_DEFAULT_MODEL_REF as t };
