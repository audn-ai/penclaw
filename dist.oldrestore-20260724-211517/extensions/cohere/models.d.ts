import { s as ModelDefinitionConfig } from "../../types.models-BqJSiNyu.js";
//#region extensions/cohere/models.d.ts
declare const COHERE_BASE_URL: string;
declare const COHERE_MODEL_CATALOG: (
  | {
      id: string;
      name: string;
      reasoning: boolean;
      input: string[];
      contextWindow: number;
      maxTokens: number;
      cost: {
        input: number;
        output: number;
        cacheRead: number;
        cacheWrite: number;
      };
      compat: {
        supportsStore: boolean;
        supportsUsageInStreaming: boolean;
        supportsReasoningEffort: boolean;
        supportedReasoningEfforts: string[];
        reasoningEffortMap: {
          off: string;
          none: string;
          minimal: string;
          low: string;
          medium: string;
          high: string;
          xhigh: string;
          adaptive: string;
          max: string;
        };
        maxTokensField: string;
        supportsTools?: undefined;
      };
    }
  | {
      id: string;
      name: string;
      input: string[];
      contextWindow: number;
      maxTokens: number;
      cost: {
        input: number;
        output: number;
        cacheRead: number;
        cacheWrite: number;
      };
      compat: {
        supportsStore: boolean;
        supportsUsageInStreaming: boolean;
        maxTokensField: string;
        supportsReasoningEffort?: undefined;
        supportedReasoningEfforts?: undefined;
        reasoningEffortMap?: undefined;
        supportsTools?: undefined;
      };
      reasoning?: undefined;
    }
  | {
      id: string;
      name: string;
      reasoning: boolean;
      input: string[];
      contextWindow: number;
      maxTokens: number;
      cost: {
        input: number;
        output: number;
        cacheRead: number;
        cacheWrite: number;
      };
      compat: {
        supportsStore: boolean;
        supportsUsageInStreaming: boolean;
        supportsTools: boolean;
        maxTokensField: string;
        supportsReasoningEffort?: undefined;
        supportedReasoningEfforts?: undefined;
        reasoningEffortMap?: undefined;
      };
    }
)[];
declare const COHERE_COMMAND_A_PLUS_MODEL_ID = "command-a-plus-05-2026";
declare const COHERE_COMMAND_A_REASONING_MODEL_ID = "command-a-reasoning-08-2025";
declare const COHERE_COMMAND_A_VISION_MODEL_ID = "command-a-vision-07-2025";
declare const COHERE_NORTH_MINI_CODE_MODEL_ID = "north-mini-code-1-0";
declare function isModernCohereModelId(modelId: string): boolean;
declare function buildCohereCatalogModels(): ModelDefinitionConfig[];
declare function buildCohereModelDefinition(
  model: (typeof COHERE_MODEL_CATALOG)[number],
): ModelDefinitionConfig;
//#endregion
export {
  COHERE_BASE_URL,
  COHERE_COMMAND_A_PLUS_MODEL_ID,
  COHERE_COMMAND_A_REASONING_MODEL_ID,
  COHERE_COMMAND_A_VISION_MODEL_ID,
  COHERE_MODEL_CATALOG,
  COHERE_NORTH_MINI_CODE_MODEL_ID,
  buildCohereCatalogModels,
  buildCohereModelDefinition,
  isModernCohereModelId,
};
