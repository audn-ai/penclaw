import { n as buildManifestModelProviderConfig } from "./provider-catalog-shared-CQScmZZs.js";
//#endregion
//#region extensions/novita/models.ts
const NOVITA_MANIFEST_PROVIDER = buildManifestModelProviderConfig({
  providerId: "novita",
  catalog: {
    aliases: {
      "novita-ai": { provider: "novita" },
      novitaai: { provider: "novita" },
    },
    providers: {
      novita: {
        baseUrl: "https://api.novita.ai/openai/v1",
        api: "openai-completions",
        models: [
          {
            id: "moonshotai/kimi-k2.5",
            name: "Kimi K2.5",
            reasoning: true,
            input: ["text", "image"],
            contextWindow: 262144,
            maxTokens: 65536,
            cost: {
              input: 0,
              output: 0,
              cacheRead: 0,
              cacheWrite: 0,
            },
          },
          {
            id: "minimax/minimax-m2.7",
            name: "MiniMax M2.7",
            reasoning: true,
            input: ["text"],
            contextWindow: 1e6,
            maxTokens: 65536,
            cost: {
              input: 0,
              output: 0,
              cacheRead: 0,
              cacheWrite: 0,
            },
          },
          {
            id: "zai-org/glm-5",
            name: "GLM-5",
            reasoning: true,
            input: ["text"],
            contextWindow: 202752,
            maxTokens: 65536,
            cost: {
              input: 0,
              output: 0,
              cacheRead: 0,
              cacheWrite: 0,
            },
          },
          {
            id: "deepseek/deepseek-v3-0324",
            name: "DeepSeek V3 0324",
            reasoning: false,
            input: ["text"],
            contextWindow: 163840,
            maxTokens: 65536,
            cost: {
              input: 0,
              output: 0,
              cacheRead: 0,
              cacheWrite: 0,
            },
          },
          {
            id: "deepseek/deepseek-r1-0528",
            name: "DeepSeek R1 0528",
            reasoning: true,
            input: ["text"],
            contextWindow: 163840,
            maxTokens: 65536,
            cost: {
              input: 0,
              output: 0,
              cacheRead: 0,
              cacheWrite: 0,
            },
          },
          {
            id: "qwen/qwen3-235b-a22b-fp8",
            name: "Qwen3 235B A22B FP8",
            reasoning: true,
            input: ["text"],
            contextWindow: 262144,
            maxTokens: 65536,
            cost: {
              input: 0,
              output: 0,
              cacheRead: 0,
              cacheWrite: 0,
            },
          },
        ],
      },
    },
  }.providers.novita,
});
const NOVITA_BASE_URL = NOVITA_MANIFEST_PROVIDER.baseUrl;
const NOVITA_MODEL_CATALOG = NOVITA_MANIFEST_PROVIDER.models;
const NOVITA_DEFAULT_MODEL_REF = "novita/deepseek/deepseek-v3-0324";
function buildNovitaModelDefinition(model) {
  return {
    ...model,
    api: "openai-completions",
  };
}
//#endregion
export {
  buildNovitaModelDefinition as i,
  NOVITA_DEFAULT_MODEL_REF as n,
  NOVITA_MODEL_CATALOG as r,
  NOVITA_BASE_URL as t,
};
