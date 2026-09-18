import { s as ModelDefinitionConfig } from "./types.models-BqJSiNyu.js";
//#region extensions/byteplus/models.d.ts
/** Base URL for BytePlus chat/model APIs from the manifest catalog. */
declare const BYTEPLUS_BASE_URL: string;
/** Base URL for BytePlus Plan coding APIs from the manifest catalog. */
declare const BYTEPLUS_CODING_BASE_URL: string;
/** BytePlus general model catalog entries. */
declare const BYTEPLUS_MODEL_CATALOG: ModelDefinitionConfig[];
/** BytePlus coding/planning model catalog entries. */
declare const BYTEPLUS_CODING_MODEL_CATALOG: ModelDefinitionConfig[];
/** Clones one manifest model definition so callers can mutate safely. */
declare function buildBytePlusModelDefinition(entry: ModelDefinitionConfig): ModelDefinitionConfig;
//#endregion
export {
  buildBytePlusModelDefinition as a,
  BYTEPLUS_MODEL_CATALOG as i,
  BYTEPLUS_CODING_BASE_URL as n,
  BYTEPLUS_CODING_MODEL_CATALOG as r,
  BYTEPLUS_BASE_URL as t,
};
