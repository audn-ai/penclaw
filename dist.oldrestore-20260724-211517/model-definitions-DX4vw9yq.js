import { t as modelCatalog } from "./openclaw.plugin-Da1weRYK.js";
import { n as buildManifestModelProviderConfig } from "./provider-catalog-shared-CQScmZZs.js";
//#region extensions/mistral/model-definitions.ts
const MISTRAL_MANIFEST_CATALOG = modelCatalog.providers.mistral;
const MISTRAL_BASE_URL = MISTRAL_MANIFEST_CATALOG.baseUrl;
const MISTRAL_DEFAULT_MODEL_ID = "mistral-large-latest";
function buildMistralModelDefinition() {
  const model = buildMistralCatalogModels().find((entry) => entry.id === MISTRAL_DEFAULT_MODEL_ID);
  if (!model) throw new Error(`Missing Mistral provider model ${MISTRAL_DEFAULT_MODEL_ID}`);
  return model;
}
function buildMistralCatalogModels() {
  return buildManifestModelProviderConfig({
    providerId: "mistral",
    catalog: MISTRAL_MANIFEST_CATALOG,
  }).models;
}
//#endregion
export {
  buildMistralModelDefinition as i,
  MISTRAL_DEFAULT_MODEL_ID as n,
  buildMistralCatalogModels as r,
  MISTRAL_BASE_URL as t,
};
