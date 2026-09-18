import { s as ModelDefinitionConfig } from "./types.models-BqJSiNyu.js";
//#region extensions/minimax/model-definitions.d.ts
declare const DEFAULT_MINIMAX_BASE_URL = "https://api.minimax.io/v1";
declare const MINIMAX_API_BASE_URL = "https://api.minimax.io/anthropic";
declare const MINIMAX_CN_API_BASE_URL = "https://api.minimaxi.com/anthropic";
declare const MINIMAX_HOSTED_MODEL_ID = "MiniMax-M3";
declare const MINIMAX_HOSTED_MODEL_REF = "minimax/MiniMax-M3";
declare const DEFAULT_MINIMAX_CONTEXT_WINDOW = 204800;
declare const DEFAULT_MINIMAX_MAX_TOKENS = 131072;
declare const MINIMAX_API_COST: {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
};
declare const MINIMAX_M27_API_COST: {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
};
declare const MINIMAX_API_HIGHSPEED_COST: {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
};
declare const MINIMAX_M25_API_COST: {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
};
declare const MINIMAX_M25_API_HIGHSPEED_COST: {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
};
declare const MINIMAX_HOSTED_COST: {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
};
declare const MINIMAX_LM_STUDIO_COST: {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
};
declare function resolveMinimaxApiCost(modelId: string): ModelDefinitionConfig["cost"];
declare function buildMinimaxModelDefinition(params: {
  id: string;
  name?: string;
  reasoning?: boolean;
  cost: ModelDefinitionConfig["cost"];
  contextWindow: number;
  maxTokens: number;
}): ModelDefinitionConfig;
declare function buildMinimaxApiModelDefinition(modelId: string): ModelDefinitionConfig;
//#endregion
export {
  resolveMinimaxApiCost as _,
  MINIMAX_API_COST as a,
  MINIMAX_HOSTED_COST as c,
  MINIMAX_LM_STUDIO_COST as d,
  MINIMAX_M25_API_COST as f,
  buildMinimaxModelDefinition as g,
  buildMinimaxApiModelDefinition as h,
  MINIMAX_API_BASE_URL as i,
  MINIMAX_HOSTED_MODEL_ID as l,
  MINIMAX_M27_API_COST as m,
  DEFAULT_MINIMAX_CONTEXT_WINDOW as n,
  MINIMAX_API_HIGHSPEED_COST as o,
  MINIMAX_M25_API_HIGHSPEED_COST as p,
  DEFAULT_MINIMAX_MAX_TOKENS as r,
  MINIMAX_CN_API_BASE_URL as s,
  DEFAULT_MINIMAX_BASE_URL as t,
  MINIMAX_HOSTED_MODEL_REF as u,
};
