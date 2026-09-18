import {
  l as AgentToolModelConfig,
  o as AgentModelConfig,
} from "./types.provider-request-CVFNhEKy.js";

//#region src/config/model-input.d.ts
type AgentModelInput = AgentModelConfig | AgentToolModelConfig;
/** Returns the primary model ref from either string or object-style agent model config. */
declare function resolveAgentModelPrimaryValue(model?: AgentModelInput): string | undefined;
/** Returns configured fallback model refs, preserving their configured order. */
declare function resolveAgentModelFallbackValues(model?: AgentModelInput): string[];
//#endregion
export { resolveAgentModelPrimaryValue as n, resolveAgentModelFallbackValues as t };
