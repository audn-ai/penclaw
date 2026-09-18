import { s as ModelDefinitionConfig } from "./types.models-BqJSiNyu.js";
//#region extensions/mistral/model-definitions.d.ts
declare const MISTRAL_BASE_URL: string;
declare const MISTRAL_DEFAULT_MODEL_ID = "mistral-large-latest";
declare function buildMistralModelDefinition(): ModelDefinitionConfig;
declare function buildMistralCatalogModels(): ModelDefinitionConfig[];
//#endregion
export {
  buildMistralModelDefinition as i,
  MISTRAL_DEFAULT_MODEL_ID as n,
  buildMistralCatalogModels as r,
  MISTRAL_BASE_URL as t,
};
