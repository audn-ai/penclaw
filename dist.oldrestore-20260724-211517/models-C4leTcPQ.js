import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import { n as buildManifestModelProviderConfig } from "./provider-catalog-shared-CQScmZZs.js";
//#endregion
//#region extensions/cohere/models.ts
/**
 * Cohere model catalog helpers derived from the plugin manifest.
 */
const COHERE_MANIFEST_CATALOG = {
  providers: {
    cohere: {
      baseUrl: "https://api.cohere.ai/compatibility/v1",
      api: "openai-completions",
      models: [
        {
          id: "command-a-plus-05-2026",
          name: "Command A+",
          reasoning: true,
          input: ["text", "image"],
          contextWindow: 128e3,
          maxTokens: 64e3,
          cost: {
            input: 0,
            output: 0,
            cacheRead: 0,
            cacheWrite: 0,
          },
          compat: {
            supportsStore: false,
            supportsUsageInStreaming: false,
            supportsReasoningEffort: true,
            supportedReasoningEfforts: ["none", "high"],
            reasoningEffortMap: {
              off: "none",
              none: "none",
              minimal: "high",
              low: "high",
              medium: "high",
              high: "high",
              xhigh: "high",
              adaptive: "high",
              max: "high",
            },
            maxTokensField: "max_tokens",
          },
        },
        {
          id: "command-a-03-2025",
          name: "Command A",
          input: ["text"],
          contextWindow: 256e3,
          maxTokens: 8e3,
          cost: {
            input: 2.5,
            output: 10,
            cacheRead: 0,
            cacheWrite: 0,
          },
          compat: {
            supportsStore: false,
            supportsUsageInStreaming: false,
            maxTokensField: "max_tokens",
          },
        },
        {
          id: "command-a-reasoning-08-2025",
          name: "Command A Reasoning",
          reasoning: true,
          input: ["text"],
          contextWindow: 256e3,
          maxTokens: 32e3,
          cost: {
            input: 0,
            output: 0,
            cacheRead: 0,
            cacheWrite: 0,
          },
          compat: {
            supportsStore: false,
            supportsUsageInStreaming: false,
            supportsReasoningEffort: true,
            supportedReasoningEfforts: ["none", "high"],
            reasoningEffortMap: {
              off: "none",
              none: "none",
              minimal: "high",
              low: "high",
              medium: "high",
              high: "high",
              xhigh: "high",
              adaptive: "high",
              max: "high",
            },
            maxTokensField: "max_tokens",
          },
        },
        {
          id: "command-a-vision-07-2025",
          name: "Command A Vision",
          reasoning: false,
          input: ["text", "image"],
          contextWindow: 128e3,
          maxTokens: 8e3,
          cost: {
            input: 0,
            output: 0,
            cacheRead: 0,
            cacheWrite: 0,
          },
          compat: {
            supportsStore: false,
            supportsUsageInStreaming: false,
            supportsTools: false,
            maxTokensField: "max_tokens",
          },
        },
        {
          id: "north-mini-code-1-0",
          name: "North Mini Code 1.0",
          reasoning: true,
          input: ["text", "image"],
          contextWindow: 256e3,
          maxTokens: 64e3,
          cost: {
            input: 0,
            output: 0,
            cacheRead: 0,
            cacheWrite: 0,
          },
          compat: {
            supportsStore: false,
            supportsUsageInStreaming: false,
            supportsReasoningEffort: true,
            supportedReasoningEfforts: ["none", "high"],
            reasoningEffortMap: {
              off: "none",
              none: "none",
              minimal: "high",
              low: "high",
              medium: "high",
              high: "high",
              xhigh: "high",
              adaptive: "high",
              max: "high",
            },
            maxTokensField: "max_tokens",
          },
        },
      ],
    },
  },
  discovery: { cohere: "static" },
}.providers.cohere;
const COHERE_BASE_URL = COHERE_MANIFEST_CATALOG.baseUrl;
const COHERE_MODEL_CATALOG = COHERE_MANIFEST_CATALOG.models;
const COHERE_COMMAND_A_PLUS_MODEL_ID = "command-a-plus-05-2026";
const COHERE_COMMAND_A_REASONING_MODEL_ID = "command-a-reasoning-08-2025";
const COHERE_COMMAND_A_VISION_MODEL_ID = "command-a-vision-07-2025";
const COHERE_NORTH_MINI_CODE_MODEL_ID = "north-mini-code-1-0";
const COHERE_MODERN_MODEL_IDS = /* @__PURE__ */ new Set([
  COHERE_COMMAND_A_PLUS_MODEL_ID,
  COHERE_COMMAND_A_REASONING_MODEL_ID,
  COHERE_NORTH_MINI_CODE_MODEL_ID,
]);
function isModernCohereModelId(modelId) {
  return COHERE_MODERN_MODEL_IDS.has(modelId.trim().toLowerCase());
}
function buildCohereCatalogModels() {
  return buildManifestModelProviderConfig({
    providerId: "cohere",
    catalog: COHERE_MANIFEST_CATALOG,
  }).models;
}
function buildCohereModelDefinition(model) {
  return expectDefined(
    buildManifestModelProviderConfig({
      providerId: "cohere",
      catalog: {
        ...COHERE_MANIFEST_CATALOG,
        models: [model],
      },
    }).models.at(0),
    "normalized Cohere manifest model",
  );
}
//#endregion
export {
  COHERE_MODEL_CATALOG as a,
  buildCohereModelDefinition as c,
  COHERE_COMMAND_A_VISION_MODEL_ID as i,
  isModernCohereModelId as l,
  COHERE_COMMAND_A_PLUS_MODEL_ID as n,
  COHERE_NORTH_MINI_CODE_MODEL_ID as o,
  COHERE_COMMAND_A_REASONING_MODEL_ID as r,
  buildCohereCatalogModels as s,
  COHERE_BASE_URL as t,
};
