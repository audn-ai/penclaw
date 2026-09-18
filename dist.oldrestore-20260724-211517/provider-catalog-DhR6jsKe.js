import {
  i as buildNovitaModelDefinition,
  r as NOVITA_MODEL_CATALOG,
  t as NOVITA_BASE_URL,
} from "./models-CwPImvVz.js";
//#region extensions/novita/provider-catalog.ts
function buildNovitaProvider() {
  return {
    baseUrl: NOVITA_BASE_URL,
    api: "openai-completions",
    models: NOVITA_MODEL_CATALOG.map(buildNovitaModelDefinition),
  };
}
//#endregion
export { buildNovitaProvider as t };
