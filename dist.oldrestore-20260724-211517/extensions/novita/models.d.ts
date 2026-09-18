import { s as ModelDefinitionConfig } from "../../types.models-BqJSiNyu.js";
//#region extensions/novita/models.d.ts
declare const NOVITA_BASE_URL: string;
declare const NOVITA_MODEL_CATALOG: ModelDefinitionConfig[];
declare const NOVITA_DEFAULT_MODEL_REF = "novita/deepseek/deepseek-v3-0324";
declare function buildNovitaModelDefinition(model: ModelDefinitionConfig): ModelDefinitionConfig;
//#endregion
export {
  NOVITA_BASE_URL,
  NOVITA_DEFAULT_MODEL_REF,
  NOVITA_MODEL_CATALOG,
  buildNovitaModelDefinition,
};
