import { n as buildLiveModelProviderConfig } from "./provider-catalog-live-runtime-C9z3vHtm.js";
import "./provider-model-shared-CYlCpWlu.js";
import { a as normalizeModelCompat } from "./provider-model-compat-oht7fX8H.js";
//#region extensions/opencode-go/provider-catalog.ts
const PROVIDER_ID = "opencode-go";
const OPENCODE_GO_OPENAI_BASE_URL = "https://opencode.ai/zen/go/v1";
const OPENCODE_GO_ANTHROPIC_BASE_URL = "https://opencode.ai/zen/go";
const OPENCODE_GO_KIMI_NO_REASONING_MODEL_IDS = /* @__PURE__ */ new Set([
  "kimi-k2.5",
  "kimi-k2.6",
  "kimi-k2.7-code",
]);
const OPENCODE_GO_MODELS_ENDPOINT = "https://opencode.ai/zen/go/v1/models";
const OPENCODE_GO_MODELS_TIMEOUT_MS = 5e3;
const OPENCODE_GO_MODELS_CACHE_TTL_MS = 6e4;
const OPENCODE_GO_MODELS = [
  {
    id: "deepseek-v4-pro",
    name: "DeepSeek V4 Pro",
    api: "openai-completions",
    provider: PROVIDER_ID,
    baseUrl: OPENCODE_GO_OPENAI_BASE_URL,
    reasoning: true,
    input: ["text"],
    cost: {
      input: 1.74,
      output: 3.48,
      cacheRead: 0.145,
      cacheWrite: 0,
    },
    contextWindow: 1e6,
    maxTokens: 384e3,
    compat: {
      supportsUsageInStreaming: true,
      supportsReasoningEffort: true,
      maxTokensField: "max_tokens",
    },
  },
  {
    id: "deepseek-v4-flash",
    name: "DeepSeek V4 Flash",
    api: "openai-completions",
    provider: PROVIDER_ID,
    baseUrl: OPENCODE_GO_OPENAI_BASE_URL,
    reasoning: true,
    input: ["text"],
    cost: {
      input: 0.14,
      output: 0.28,
      cacheRead: 0.028,
      cacheWrite: 0,
    },
    contextWindow: 1e6,
    maxTokens: 384e3,
    compat: {
      supportsUsageInStreaming: true,
      supportsReasoningEffort: true,
      maxTokensField: "max_tokens",
    },
  },
  {
    id: "glm-5",
    name: "GLM-5",
    api: "openai-completions",
    provider: PROVIDER_ID,
    baseUrl: OPENCODE_GO_OPENAI_BASE_URL,
    reasoning: true,
    input: ["text"],
    cost: {
      input: 1,
      output: 3.2,
      cacheRead: 0.2,
      cacheWrite: 0,
    },
    contextWindow: 202752,
    maxTokens: 32768,
  },
  {
    id: "glm-5.1",
    name: "GLM-5.1",
    api: "openai-completions",
    provider: PROVIDER_ID,
    baseUrl: OPENCODE_GO_OPENAI_BASE_URL,
    reasoning: true,
    input: ["text"],
    cost: {
      input: 1.4,
      output: 4.4,
      cacheRead: 0.26,
      cacheWrite: 0,
    },
    contextWindow: 202752,
    maxTokens: 32768,
  },
  {
    id: "glm-5.2",
    name: "GLM-5.2",
    api: "openai-completions",
    provider: PROVIDER_ID,
    baseUrl: OPENCODE_GO_OPENAI_BASE_URL,
    reasoning: true,
    input: ["text"],
    cost: {
      input: 1.4,
      output: 4.4,
      cacheRead: 0.26,
      cacheWrite: 0,
    },
    contextWindow: 1e6,
    maxTokens: 131072,
  },
  {
    id: "hy3-preview",
    name: "HY3 Preview",
    api: "openai-completions",
    provider: PROVIDER_ID,
    baseUrl: OPENCODE_GO_OPENAI_BASE_URL,
    reasoning: true,
    input: ["text"],
    cost: {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
    },
    contextWindow: 262144,
    maxTokens: 32768,
  },
  {
    id: "kimi-k2.5",
    name: "Kimi K2.5",
    api: "openai-completions",
    provider: PROVIDER_ID,
    baseUrl: OPENCODE_GO_OPENAI_BASE_URL,
    reasoning: true,
    input: ["text", "image"],
    cost: {
      input: 0.6,
      output: 3,
      cacheRead: 0.1,
      cacheWrite: 0,
    },
    contextWindow: 262144,
    maxTokens: 65536,
  },
  {
    id: "kimi-k2.6",
    name: "Kimi K2.6",
    api: "openai-completions",
    provider: PROVIDER_ID,
    baseUrl: OPENCODE_GO_OPENAI_BASE_URL,
    reasoning: true,
    input: ["text", "image"],
    cost: {
      input: 0.95,
      output: 4,
      cacheRead: 0.16,
      cacheWrite: 0,
    },
    contextWindow: 262144,
    maxTokens: 65536,
  },
  {
    id: "kimi-k2.7-code",
    name: "Kimi K2.7 Code",
    api: "openai-completions",
    provider: PROVIDER_ID,
    baseUrl: OPENCODE_GO_OPENAI_BASE_URL,
    reasoning: true,
    input: ["text", "image"],
    cost: {
      input: 0.95,
      output: 4,
      cacheRead: 0.19,
      cacheWrite: 0,
    },
    contextWindow: 262144,
    maxTokens: 262144,
  },
  {
    id: "mimo-v2.5",
    name: "MiMo V2.5",
    api: "openai-completions",
    provider: PROVIDER_ID,
    baseUrl: OPENCODE_GO_OPENAI_BASE_URL,
    reasoning: true,
    input: ["text", "image"],
    cost: {
      input: 0.4,
      output: 2,
      cacheRead: 0.08,
      cacheWrite: 0,
    },
    contextWindow: 1e6,
    maxTokens: 128e3,
  },
  {
    id: "mimo-v2.5-pro",
    name: "MiMo V2.5 Pro",
    api: "openai-completions",
    provider: PROVIDER_ID,
    baseUrl: OPENCODE_GO_OPENAI_BASE_URL,
    reasoning: true,
    input: ["text"],
    cost: {
      input: 1,
      output: 3,
      cacheRead: 0.2,
      cacheWrite: 0,
    },
    contextWindow: 1048576,
    maxTokens: 128e3,
  },
  {
    id: "minimax-m2.5",
    name: "MiniMax M2.5",
    api: "anthropic-messages",
    provider: PROVIDER_ID,
    baseUrl: OPENCODE_GO_ANTHROPIC_BASE_URL,
    reasoning: true,
    input: ["text"],
    cost: {
      input: 0.3,
      output: 1.2,
      cacheRead: 0.03,
      cacheWrite: 0.375,
    },
    contextWindow: 204800,
    maxTokens: 65536,
  },
  {
    id: "minimax-m2.7",
    name: "MiniMax M2.7",
    api: "anthropic-messages",
    provider: PROVIDER_ID,
    baseUrl: OPENCODE_GO_ANTHROPIC_BASE_URL,
    reasoning: true,
    input: ["text"],
    cost: {
      input: 0.3,
      output: 1.2,
      cacheRead: 0.06,
      cacheWrite: 0.375,
    },
    contextWindow: 204800,
    maxTokens: 131072,
  },
  {
    id: "minimax-m3",
    name: "MiniMax M3",
    api: "anthropic-messages",
    provider: PROVIDER_ID,
    baseUrl: OPENCODE_GO_ANTHROPIC_BASE_URL,
    reasoning: true,
    input: ["text"],
    cost: {
      input: 0.6,
      output: 2.4,
      cacheRead: 0.12,
      cacheWrite: 0.75,
    },
    contextWindow: 204800,
    maxTokens: 131072,
  },
  {
    id: "qwen3.5-plus",
    name: "Qwen3.5 Plus",
    api: "openai-completions",
    provider: PROVIDER_ID,
    baseUrl: OPENCODE_GO_OPENAI_BASE_URL,
    compat: { thinkingFormat: "qwen" },
    reasoning: true,
    input: ["text", "image"],
    cost: {
      input: 0.2,
      output: 1.2,
      cacheRead: 0.02,
      cacheWrite: 0.25,
    },
    contextWindow: 262144,
    maxTokens: 65536,
  },
  {
    id: "qwen3.7-max",
    name: "Qwen3.7 Max",
    api: "anthropic-messages",
    provider: PROVIDER_ID,
    baseUrl: OPENCODE_GO_ANTHROPIC_BASE_URL,
    compat: { thinkingFormat: "qwen" },
    reasoning: true,
    input: ["text"],
    cost: {
      input: 2.5,
      output: 7.5,
      cacheRead: 0.5,
      cacheWrite: 3.125,
    },
    contextWindow: 1e6,
    maxTokens: 65536,
  },
  {
    id: "qwen3.7-plus",
    name: "Qwen3.7 Plus",
    api: "anthropic-messages",
    provider: PROVIDER_ID,
    baseUrl: OPENCODE_GO_ANTHROPIC_BASE_URL,
    compat: { thinkingFormat: "qwen" },
    reasoning: true,
    input: ["text", "image"],
    cost: {
      input: 0.4,
      output: 1.6,
      cacheRead: 0.04,
      cacheWrite: 0.5,
    },
    contextWindow: 1e6,
    maxTokens: 65536,
  },
  {
    id: "qwen3.6-plus",
    name: "Qwen3.6 Plus",
    api: "anthropic-messages",
    provider: PROVIDER_ID,
    baseUrl: OPENCODE_GO_ANTHROPIC_BASE_URL,
    compat: { thinkingFormat: "qwen" },
    reasoning: true,
    input: ["text", "image"],
    cost: {
      input: 0.5,
      output: 3,
      cacheRead: 0.05,
      cacheWrite: 0.625,
    },
    contextWindow: 262144,
    maxTokens: 65536,
  },
].map((model) => normalizeModelCompat(model));
function buildOpencodeGoProviderConfig(models, apiKey) {
  return {
    api: "openai-completions",
    baseUrl: OPENCODE_GO_OPENAI_BASE_URL,
    ...(apiKey ? { apiKey } : {}),
    models,
  };
}
function buildStaticOpencodeGoProviderConfig(apiKey) {
  return buildOpencodeGoProviderConfig(OPENCODE_GO_MODELS, apiKey);
}
async function buildOpencodeGoLiveProviderConfig(params = {}) {
  return await buildLiveModelProviderConfig({
    providerId: PROVIDER_ID,
    endpoint: OPENCODE_GO_MODELS_ENDPOINT,
    providerConfig: {
      api: "openai-completions",
      baseUrl: OPENCODE_GO_OPENAI_BASE_URL,
    },
    models: OPENCODE_GO_MODELS,
    apiKey: params.apiKey,
    discoveryApiKey: params.discoveryApiKey,
    fetchGuard: params.fetchGuard,
    signal: params.signal,
    timeoutMs: OPENCODE_GO_MODELS_TIMEOUT_MS,
    ttlMs: OPENCODE_GO_MODELS_CACHE_TTL_MS,
    auditContext: "opencode-go-model-discovery",
  });
}
function listOpencodeGoModelCatalogEntries() {
  return OPENCODE_GO_MODELS.map((model) => ({
    provider: model.provider,
    id: model.id,
    name: model.name,
    reasoning: model.reasoning,
    input: model.input,
    contextWindow: model.contextWindow,
  }));
}
function resolveOpencodeGoModel(modelId) {
  const normalizedModelId = modelId.trim().toLowerCase();
  return OPENCODE_GO_MODELS.find((model) => model.id === normalizedModelId);
}
function isOpencodeGoKimiNoReasoningModelId(modelId) {
  return (
    typeof modelId === "string" &&
    OPENCODE_GO_KIMI_NO_REASONING_MODEL_IDS.has(modelId.trim().toLowerCase())
  );
}
function normalizeOpencodeGoResolvedModel(model) {
  if (!isOpencodeGoKimiNoReasoningModelId(model.id)) return;
  const compat =
    model.compat && typeof model.compat === "object" && !Array.isArray(model.compat)
      ? model.compat
      : void 0;
  if (!model.reasoning && !compat?.supportsReasoningEffort) return;
  return {
    ...model,
    reasoning: false,
    compat: {
      ...compat,
      supportsReasoningEffort: false,
    },
  };
}
function normalizeBaseUrl(baseUrl) {
  return (baseUrl ?? "").trim().replace(/\/+$/, "");
}
function normalizeOpencodeGoBaseUrl(params) {
  const normalized = normalizeBaseUrl(params.baseUrl);
  if (!normalized) return;
  if (normalized === OPENCODE_GO_OPENAI_BASE_URL) return OPENCODE_GO_OPENAI_BASE_URL;
  if (normalized === OPENCODE_GO_ANTHROPIC_BASE_URL) return OPENCODE_GO_ANTHROPIC_BASE_URL;
  if (normalized === "https://opencode.ai/go") return OPENCODE_GO_ANTHROPIC_BASE_URL;
  if (normalized === "https://opencode.ai/go/v1")
    return params.api === "anthropic-messages"
      ? OPENCODE_GO_ANTHROPIC_BASE_URL
      : OPENCODE_GO_OPENAI_BASE_URL;
}
//#endregion
export {
  normalizeOpencodeGoBaseUrl as a,
  listOpencodeGoModelCatalogEntries as i,
  buildStaticOpencodeGoProviderConfig as n,
  normalizeOpencodeGoResolvedModel as o,
  isOpencodeGoKimiNoReasoningModelId as r,
  resolveOpencodeGoModel as s,
  buildOpencodeGoLiveProviderConfig as t,
};
