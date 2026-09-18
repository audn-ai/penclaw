import {
  n as TOGETHER_MODEL_CATALOG,
  r as buildTogetherModelDefinition,
  t as TOGETHER_BASE_URL,
} from "./models-Bawj4aJu.js";
import { p as createModelCatalogPresetAppliers } from "./provider-onboard-CvQgbxgZ.js";
//#region extensions/together/onboard.ts
const TOGETHER_DEFAULT_MODEL_REF = "together/meta-llama/Llama-3.3-70B-Instruct-Turbo";
const togetherPresetAppliers = createModelCatalogPresetAppliers({
  primaryModelRef: TOGETHER_DEFAULT_MODEL_REF,
  resolveParams: (_cfg) => ({
    providerId: "together",
    api: "openai-completions",
    baseUrl: TOGETHER_BASE_URL,
    catalogModels: TOGETHER_MODEL_CATALOG.map(buildTogetherModelDefinition),
    aliases: [
      {
        modelRef: TOGETHER_DEFAULT_MODEL_REF,
        alias: "Together AI",
      },
    ],
  }),
});
function applyTogetherConfig(cfg) {
  return togetherPresetAppliers.applyConfig(cfg);
}
//#endregion
export { applyTogetherConfig as n, TOGETHER_DEFAULT_MODEL_REF as t };
