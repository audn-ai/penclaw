import { lookup } from "node:dns/promises";
import { a as getCachedLiveProviderModelRows } from "./provider-catalog-live-runtime-C9z3vHtm.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./ssrf-runtime-DJ478vv8.js";
import {
  n as buildManifestModelProviderConfig,
  r as clearLiveCatalogCacheForTests,
} from "./provider-catalog-shared-CQScmZZs.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { y as ssrfPolicyFromHttpBaseUrlAllowedHostname } from "./ssrf-keFRGQLq.js";
//#region extensions/nvidia/openclaw.plugin.json
var modelCatalog = {
  providers: {
    nvidia: {
      baseUrl: "https://integrate.api.nvidia.com/v1",
      api: "openai-completions",
      models: [
        {
          id: "nvidia/nemotron-3-ultra-550b-a55b",
          name: "Nemotron 3 Ultra 550B",
          input: ["text"],
          contextWindow: 1048576,
          maxTokens: 8192,
          cost: {
            input: 0,
            output: 0,
            cacheRead: 0,
            cacheWrite: 0,
          },
          compat: { requiresStringContent: true },
        },
        {
          id: "nvidia/nemotron-3-super-120b-a12b",
          name: "Nemotron 3 Super 120B",
          input: ["text"],
          contextWindow: 1e6,
          maxTokens: 8192,
          cost: {
            input: 0,
            output: 0,
            cacheRead: 0,
            cacheWrite: 0,
          },
          compat: { requiresStringContent: true },
        },
        {
          id: "z-ai/glm-5.2",
          name: "GLM 5.2",
          input: ["text"],
          contextWindow: 202752,
          maxTokens: 8192,
          cost: {
            input: 0,
            output: 0,
            cacheRead: 0,
            cacheWrite: 0,
          },
          compat: { requiresStringContent: true },
        },
        {
          id: "moonshotai/kimi-k2.6",
          name: "Kimi K2.6",
          input: ["text"],
          contextWindow: 262144,
          maxTokens: 8192,
          cost: {
            input: 0,
            output: 0,
            cacheRead: 0,
            cacheWrite: 0,
          },
          compat: { requiresStringContent: true },
        },
        {
          id: "minimaxai/minimax-m3",
          name: "Minimax M3",
          input: ["text"],
          contextWindow: 196608,
          maxTokens: 8192,
          cost: {
            input: 0,
            output: 0,
            cacheRead: 0,
            cacheWrite: 0,
          },
          compat: { requiresStringContent: true },
        },
        {
          id: "deepseek-ai/deepseek-v4-pro",
          name: "DeepSeek V4 Pro",
          input: ["text"],
          contextWindow: 262144,
          maxTokens: 16384,
          cost: {
            input: 0,
            output: 0,
            cacheRead: 0,
            cacheWrite: 0,
          },
          compat: { requiresStringContent: true },
        },
        {
          id: "qwen/qwen3.5-397b-a17b",
          name: "Qwen3.5 397B A17B",
          input: ["text"],
          contextWindow: 262144,
          maxTokens: 16384,
          cost: {
            input: 0,
            output: 0,
            cacheRead: 0,
            cacheWrite: 0,
          },
          compat: { requiresStringContent: true },
        },
        {
          id: "moonshotai/kimi-k2.5",
          name: "Kimi K2.5",
          input: ["text"],
          contextWindow: 262144,
          maxTokens: 8192,
          cost: {
            input: 0,
            output: 0,
            cacheRead: 0,
            cacheWrite: 0,
          },
          compat: { requiresStringContent: true },
          status: "deprecated",
          statusReason:
            "Still available by exact reference; use moonshotai/kimi-k2.6 for new NVIDIA setups.",
          replacedBy: "moonshotai/kimi-k2.6",
        },
        {
          id: "z-ai/glm-5.1",
          name: "GLM 5.1",
          input: ["text"],
          contextWindow: 202752,
          maxTokens: 8192,
          cost: {
            input: 0,
            output: 0,
            cacheRead: 0,
            cacheWrite: 0,
          },
          compat: { requiresStringContent: true },
          status: "deprecated",
          statusReason:
            "Still available by exact reference; use z-ai/glm-5.2 for new NVIDIA setups.",
          replacedBy: "z-ai/glm-5.2",
        },
        {
          id: "minimaxai/minimax-m2.5",
          name: "MiniMax M2.5",
          input: ["text"],
          contextWindow: 196608,
          maxTokens: 8192,
          cost: {
            input: 0,
            output: 0,
            cacheRead: 0,
            cacheWrite: 0,
          },
          compat: { requiresStringContent: true },
          status: "deprecated",
          statusReason:
            "Still available by exact reference; use minimaxai/minimax-m3 for new NVIDIA setups.",
          replacedBy: "minimaxai/minimax-m3",
        },
        {
          id: "z-ai/glm5",
          name: "GLM-5",
          input: ["text"],
          contextWindow: 202752,
          maxTokens: 8192,
          cost: {
            input: 0,
            output: 0,
            cacheRead: 0,
            cacheWrite: 0,
          },
          compat: { requiresStringContent: true },
          status: "deprecated",
          statusReason:
            "Still available by exact reference; use z-ai/glm-5.2 for new NVIDIA setups.",
          replacedBy: "z-ai/glm-5.2",
        },
        {
          id: "minimaxai/minimax-m2.7",
          name: "Minimax M2.7",
          input: ["text"],
          contextWindow: 196608,
          maxTokens: 8192,
          cost: {
            input: 0,
            output: 0,
            cacheRead: 0,
            cacheWrite: 0,
          },
          compat: { requiresStringContent: true },
          status: "deprecated",
          statusReason:
            "Still available by exact reference; use minimaxai/minimax-m3 for new NVIDIA setups.",
          replacedBy: "minimaxai/minimax-m3",
        },
      ],
    },
  },
  discovery: { nvidia: "static" },
};
//#endregion
//#region extensions/nvidia/provider-catalog.ts
const NVIDIA_DEFAULT_MODEL_ID = "nvidia/nemotron-3-ultra-550b-a55b";
const NVIDIA_FEATURED_MODELS_URL =
  "https://assets.ngc.nvidia.com/products/api-catalog/featured-models.json";
const FEATURED_MODEL_CACHE_TTL_MS = 1440 * 60 * 1e3;
const FEATURED_MODEL_FETCH_TIMEOUT_MS = 1e4;
const FEATURED_MODEL_MAX_ROWS = 32;
const FEATURED_MODEL_MAX_ID_LENGTH = 200;
const FEATURED_MODEL_MAX_NAME_LENGTH = 200;
const FEATURED_MODEL_MAX_CONTEXT_WINDOW = 1e7;
const FEATURED_MODEL_MAX_OUTPUT_TOKENS = 1e6;
const FEATURED_MODEL_COST = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
};
const NVIDIA_ULTRA_DEFAULT_PARAMS = {
  chat_template_kwargs: {
    enable_thinking: false,
    force_nonempty_content: true,
  },
};
const DEPRECATED_NVIDIA_MODEL_IDS = new Set(
  modelCatalog.providers.nvidia.models
    .filter((model) => "status" in model && model.status === "deprecated")
    .map((model) => model.id),
);
const lookupNvidiaFeaturedModelHostname = async (hostname, options) => {
  if (typeof options === "object" && options !== null)
    return await lookup(hostname, {
      ...options,
      family: 4,
    });
  return await lookup(hostname, { family: 4 });
};
function buildNvidiaProvider() {
  const provider = {
    ...buildManifestModelProviderConfig({
      providerId: "nvidia",
      catalog: modelCatalog.providers.nvidia,
    }),
    apiKey: "NVIDIA_API_KEY",
  };
  return {
    ...provider,
    models: applyNvidiaModelDefaults(provider.models ?? []),
  };
}
function buildSelectableNvidiaProvider() {
  const provider = buildNvidiaProvider();
  return {
    ...provider,
    models: filterSelectableNvidiaModels(provider.models ?? []),
  };
}
async function buildLiveNvidiaProvider() {
  const provider = buildSelectableNvidiaProvider();
  const featuredModels = await loadNvidiaFeaturedModels();
  if (!featuredModels || featuredModels.length === 0) return provider;
  return {
    ...provider,
    models: applyNvidiaModelDefaults(filterSelectableNvidiaModels(featuredModels)),
  };
}
async function buildSelectableLiveNvidiaProvider() {
  const provider = buildSelectableNvidiaProvider();
  const featuredModels = await loadNvidiaFeaturedModels();
  if (!featuredModels || featuredModels.length === 0)
    return {
      ...provider,
      models: [],
    };
  return {
    ...provider,
    models: applyNvidiaModelDefaults(filterSelectableNvidiaModels(featuredModels)),
  };
}
function clearNvidiaFeaturedModelCacheForTests() {
  clearLiveCatalogCacheForTests();
}
async function loadNvidiaFeaturedModels() {
  try {
    return parseNvidiaFeaturedModels(
      await getCachedLiveProviderModelRows({
        providerId: "nvidia",
        endpoint: NVIDIA_FEATURED_MODELS_URL,
        timeoutMs: FEATURED_MODEL_FETCH_TIMEOUT_MS,
        ttlMs: FEATURED_MODEL_CACHE_TTL_MS,
        requireHttps: true,
        policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(NVIDIA_FEATURED_MODELS_URL),
        lookupFn: lookupNvidiaFeaturedModelHostname,
        auditContext: "nvidia-featured-model-catalog",
        shouldCacheRows: (modelRows) => parseNvidiaFeaturedModels(modelRows) !== null,
        readRows: (payload) => {
          if (!payload || typeof payload !== "object") return [];
          const featuredRows = payload["featured-models"];
          return Array.isArray(featuredRows) ? featuredRows : [];
        },
      }),
    );
  } catch {
    return null;
  }
}
function parseNvidiaFeaturedModels(rows) {
  const models = rows
    .slice(0, FEATURED_MODEL_MAX_ROWS)
    .map(parseNvidiaFeaturedModel)
    .filter((model) => model !== null);
  return models.length > 0 ? models : null;
}
function applyNvidiaModelDefaults(models) {
  return models.map((model) =>
    model.id === "nvidia/nemotron-3-ultra-550b-a55b"
      ? {
          ...model,
          params: {
            ...model.params,
            chat_template_kwargs: {
              ...NVIDIA_ULTRA_DEFAULT_PARAMS.chat_template_kwargs,
              ...(isRecord(model.params?.chat_template_kwargs)
                ? model.params.chat_template_kwargs
                : {}),
            },
          },
        }
      : model,
  );
}
function filterSelectableNvidiaModels(models) {
  return models.filter((model) => !DEPRECATED_NVIDIA_MODEL_IDS.has(model.id));
}
function parseNvidiaFeaturedModel(row) {
  if (!row || typeof row !== "object") return null;
  const entry = row;
  if (
    typeof entry.model !== "string" ||
    typeof entry["model-name"] !== "string" ||
    !isBoundedPositiveInteger(entry.context, FEATURED_MODEL_MAX_CONTEXT_WINDOW) ||
    !isBoundedPositiveInteger(entry["max-output"], FEATURED_MODEL_MAX_OUTPUT_TOKENS)
  )
    return null;
  const id = normalizeNvidiaFeaturedModelId(entry.model);
  const name = normalizeFeaturedModelName(entry["model-name"]);
  if (!id || !name) return null;
  return {
    id,
    name,
    reasoning: false,
    input: ["text"],
    contextWindow: entry.context,
    maxTokens: entry["max-output"],
    cost: { ...FEATURED_MODEL_COST },
    compat: { requiresStringContent: true },
  };
}
function normalizeNvidiaFeaturedModelId(model) {
  const trimmed = model.trim();
  if (
    !trimmed ||
    trimmed.length > FEATURED_MODEL_MAX_ID_LENGTH ||
    hasWhitespaceOrControlCharacter(trimmed)
  )
    return "";
  return trimmed.includes("/") ? trimmed : `nvidia/${trimmed}`;
}
function normalizeFeaturedModelName(name) {
  const trimmed = name.trim();
  if (!trimmed || trimmed.length > FEATURED_MODEL_MAX_NAME_LENGTH || hasControlCharacter(trimmed))
    return "";
  return trimmed;
}
function isBoundedPositiveInteger(value, max) {
  return typeof value === "number" && Number.isInteger(value) && value > 0 && value <= max;
}
function hasWhitespaceOrControlCharacter(value) {
  for (const char of value) if (isAsciiWhitespaceOrControlCharacter(char)) return true;
  return false;
}
function hasControlCharacter(value) {
  for (const char of value) if (isControlCharacter(char)) return true;
  return false;
}
function isControlCharacter(char) {
  const code = char.charCodeAt(0);
  return code <= 31 || code === 127;
}
function isAsciiWhitespaceOrControlCharacter(char) {
  const code = char.charCodeAt(0);
  return code <= 32 || code === 127;
}
//#endregion
export {
  buildSelectableLiveNvidiaProvider as a,
  buildNvidiaProvider as i,
  NVIDIA_FEATURED_MODELS_URL as n,
  buildSelectableNvidiaProvider as o,
  buildLiveNvidiaProvider as r,
  clearNvidiaFeaturedModelCacheForTests as s,
  NVIDIA_DEFAULT_MODEL_ID as t,
};
