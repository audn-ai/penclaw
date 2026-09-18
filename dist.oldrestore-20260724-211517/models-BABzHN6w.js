import { n as buildManifestModelProviderConfig } from "./provider-catalog-shared-CQScmZZs.js";
//#region extensions/volcengine/openclaw.plugin.json
var modelCatalog = {
  providers: {
    volcengine: {
      baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
      api: "openai-completions",
      models: [
        {
          id: "doubao-seed-code-preview-251028",
          name: "doubao-seed-code-preview-251028",
          input: ["text", "image"],
          contextWindow: 256e3,
          maxTokens: 4096,
          cost: {
            input: 1e-4,
            output: 2e-4,
            cacheRead: 0,
            cacheWrite: 0,
          },
        },
        {
          id: "doubao-seed-1-8-251228",
          name: "Doubao Seed 1.8",
          input: ["text", "image"],
          contextWindow: 256e3,
          maxTokens: 4096,
          cost: {
            input: 1e-4,
            output: 2e-4,
            cacheRead: 0,
            cacheWrite: 0,
          },
        },
        {
          id: "kimi-k2-5-260127",
          name: "Kimi K2.5",
          input: ["text", "image"],
          contextWindow: 256e3,
          maxTokens: 4096,
          cost: {
            input: 1e-4,
            output: 2e-4,
            cacheRead: 0,
            cacheWrite: 0,
          },
        },
        {
          id: "glm-4-7-251222",
          name: "GLM 4.7",
          input: ["text", "image"],
          contextWindow: 2e5,
          maxTokens: 4096,
          cost: {
            input: 1e-4,
            output: 2e-4,
            cacheRead: 0,
            cacheWrite: 0,
          },
        },
        {
          id: "deepseek-v3-2-251201",
          name: "DeepSeek V3.2",
          input: ["text", "image"],
          contextWindow: 128e3,
          maxTokens: 4096,
          cost: {
            input: 1e-4,
            output: 2e-4,
            cacheRead: 0,
            cacheWrite: 0,
          },
        },
      ],
    },
    "volcengine-plan": {
      baseUrl: "https://ark.cn-beijing.volces.com/api/coding/v3",
      api: "openai-completions",
      models: [
        {
          id: "ark-code-latest",
          name: "Ark Coding Plan",
          input: ["text"],
          contextWindow: 256e3,
          maxTokens: 4096,
          cost: {
            input: 1e-4,
            output: 2e-4,
            cacheRead: 0,
            cacheWrite: 0,
          },
        },
        {
          id: "doubao-seed-code",
          name: "Doubao Seed Code",
          input: ["text"],
          contextWindow: 256e3,
          maxTokens: 4096,
          cost: {
            input: 1e-4,
            output: 2e-4,
            cacheRead: 0,
            cacheWrite: 0,
          },
        },
        {
          id: "glm-4.7",
          name: "GLM 4.7 Coding",
          input: ["text"],
          contextWindow: 2e5,
          maxTokens: 4096,
          cost: {
            input: 1e-4,
            output: 2e-4,
            cacheRead: 0,
            cacheWrite: 0,
          },
        },
        {
          id: "kimi-k2-thinking",
          name: "Kimi K2 Thinking",
          input: ["text"],
          contextWindow: 256e3,
          maxTokens: 4096,
          cost: {
            input: 1e-4,
            output: 2e-4,
            cacheRead: 0,
            cacheWrite: 0,
          },
        },
        {
          id: "kimi-k2.5",
          name: "Kimi K2.5 Coding",
          input: ["text"],
          contextWindow: 256e3,
          maxTokens: 4096,
          cost: {
            input: 1e-4,
            output: 2e-4,
            cacheRead: 0,
            cacheWrite: 0,
          },
        },
        {
          id: "doubao-seed-code-preview-251028",
          name: "Doubao Seed Code Preview",
          input: ["text"],
          contextWindow: 256e3,
          maxTokens: 4096,
          cost: {
            input: 1e-4,
            output: 2e-4,
            cacheRead: 0,
            cacheWrite: 0,
          },
        },
      ],
    },
  },
  discovery: {
    volcengine: "static",
    "volcengine-plan": "static",
  },
};
//#endregion
//#region extensions/volcengine/models.ts
const DOUBAO_MANIFEST_PROVIDER = buildManifestModelProviderConfig({
  providerId: "volcengine",
  catalog: modelCatalog.providers.volcengine,
});
const DOUBAO_CODING_MANIFEST_PROVIDER = buildManifestModelProviderConfig({
  providerId: "volcengine-plan",
  catalog: modelCatalog.providers["volcengine-plan"],
});
const DOUBAO_BASE_URL = DOUBAO_MANIFEST_PROVIDER.baseUrl;
const DOUBAO_CODING_BASE_URL = DOUBAO_CODING_MANIFEST_PROVIDER.baseUrl;
const DOUBAO_MODEL_CATALOG = DOUBAO_MANIFEST_PROVIDER.models;
const DOUBAO_CODING_MODEL_CATALOG = DOUBAO_CODING_MANIFEST_PROVIDER.models;
function buildDoubaoModelDefinition(entry) {
  return {
    ...entry,
    input: [...entry.input],
    cost: { ...entry.cost },
  };
}
//#endregion
export {
  buildDoubaoModelDefinition as a,
  DOUBAO_MODEL_CATALOG as i,
  DOUBAO_CODING_BASE_URL as n,
  modelCatalog as o,
  DOUBAO_CODING_MODEL_CATALOG as r,
  DOUBAO_BASE_URL as t,
};
