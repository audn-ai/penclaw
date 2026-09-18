import {
  a as COHERE_MODEL_CATALOG,
  c as buildCohereModelDefinition,
  n as COHERE_COMMAND_A_PLUS_MODEL_ID,
  t as COHERE_BASE_URL,
} from "./models-C4leTcPQ.js";
import { p as createModelCatalogPresetAppliers } from "./provider-onboard-CvQgbxgZ.js";
//#region extensions/cohere/onboard.ts
const COHERE_DEFAULT_MODEL_ID = COHERE_COMMAND_A_PLUS_MODEL_ID;
const COHERE_DEFAULT_MODEL_REF = `cohere/${COHERE_DEFAULT_MODEL_ID}`;
const coherePresetAppliers = createModelCatalogPresetAppliers({
  primaryModelRef: COHERE_DEFAULT_MODEL_REF,
  resolveParams: (_cfg) => ({
    providerId: "cohere",
    api: "openai-completions",
    baseUrl: COHERE_BASE_URL,
    catalogModels: COHERE_MODEL_CATALOG.map(buildCohereModelDefinition),
    aliases: [
      {
        modelRef: COHERE_DEFAULT_MODEL_REF,
        alias: "Cohere Command A+",
      },
    ],
  }),
});
function applyCohereConfig(cfg) {
  return coherePresetAppliers.applyConfig(cfg);
}
//#endregion
export { COHERE_DEFAULT_MODEL_REF as n, applyCohereConfig as r, COHERE_DEFAULT_MODEL_ID as t };
