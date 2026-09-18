import { s as buildCohereCatalogModels, t as COHERE_BASE_URL } from "./models-C4leTcPQ.js";
//#region extensions/cohere/provider-catalog.ts
function buildCohereProvider() {
  return {
    baseUrl: COHERE_BASE_URL,
    api: "openai-completions",
    models: buildCohereCatalogModels(),
  };
}
//#endregion
export { buildCohereProvider as t };
