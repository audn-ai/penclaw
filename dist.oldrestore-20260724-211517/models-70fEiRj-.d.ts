import { s as ModelDefinitionConfig } from "./types.models-BqJSiNyu.js";
//#region extensions/meta/models.d.ts
/** Base URL for Meta OpenAI-compatible inference. */
declare const META_BASE_URL: string;
/** Meta model catalog entries from the plugin manifest. */
declare const META_MODEL_CATALOG: {
  id: string;
  name: string;
  reasoning: boolean;
  input: string[];
  contextWindow: number;
  maxTokens: number;
  thinkingLevelMap: {
    off: string;
    minimal: string;
    low: string;
    medium: string;
    high: string;
    xhigh: string;
  };
  compat: {
    supportsTools: boolean;
    supportsReasoningEffort: boolean;
    supportedReasoningEfforts: string[];
  };
  cost: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
  };
}[];
/** Builds normalized Meta catalog model definitions. */
declare function buildMetaCatalogModels(): ModelDefinitionConfig[];
/** Builds one normalized Meta model definition from a manifest entry. */
declare function buildMetaModelDefinition(
  model: (typeof META_MODEL_CATALOG)[number],
): ModelDefinitionConfig;
//#endregion
export {
  buildMetaModelDefinition as i,
  META_MODEL_CATALOG as n,
  buildMetaCatalogModels as r,
  META_BASE_URL as t,
};
