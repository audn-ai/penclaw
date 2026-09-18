import {
  n as OPENAI_API_KEY_LABEL,
  t as OPENAI_ACCOUNT_WIZARD_GROUP,
} from "./auth-choice-copy-D_t1WwLd.js";
import "./defaults-CdX9UGcX.js";
import {
  c as resolveOpenAIDefaultBaseUrl,
  i as classifyOpenAIBaseUrl,
  n as OPENAI_CODEX_RESPONSES_BASE_URL,
  o as isOpenAICodexBaseUrl,
  s as isOpenAIHttpsApiBaseUrl,
} from "./base-url-Cx2NFKoL.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import {
  a as OPENAI_DEFAULT_MODEL,
  c as applyOpenAIConfig,
  t as OPENAI_CODEX_DEFAULT_MODEL,
} from "./default-models-GLjqEMz-.js";
import {
  C as normalizeOpenAIModelRouteId,
  S as isOpenAISubscriptionOnlyRouteModelId,
  c as OPENAI_GPT_54_NANO_MODEL_ID,
  d as OPENAI_GPT_55_PRO_MODEL_ID,
  l as OPENAI_GPT_54_PRO_MODEL_ID,
  o as OPENAI_GPT_54_MINI_MODEL_ID,
  s as OPENAI_GPT_54_MODEL_ID,
  u as OPENAI_GPT_55_MODEL_ID,
  v as OPENAI_PROVIDER_MODERN_MODEL_IDS,
  x as isOpenAIPlatformOnlyRouteModelId,
} from "./model-route-contract-C-kqakLd.js";
import "./provider-auth-api-key-BYlVrz-G.js";
import {
  n as buildOpenAICodexProviderHooks,
  t as buildOpenAIChatGPTAuthMethods,
} from "./openai-chatgpt-provider-DP9HjT0Y.js";
import { t as createProviderApiKeyAuthMethod } from "./provider-api-key-auth-CXfFv7q7.js";
import {
  a as getCachedLiveProviderModelRows,
  n as buildLiveModelProviderConfig,
} from "./provider-catalog-live-runtime-C9z3vHtm.js";
import {
  l as findCatalogTemplate,
  n as buildManifestModelProviderConfig,
} from "./provider-catalog-shared-CQScmZZs.js";
import { a as normalizeModelCompat } from "./provider-model-compat-oht7fX8H.js";
import {
  d as cloneFirstTemplateModel,
  f as matchesExactOrPrefix,
  u as normalizeProviderId,
} from "./provider-model-shared-CYlCpWlu.js";
import {
  n as buildOpenAISyntheticCatalogEntry,
  t as buildOpenAIResponsesProviderHooks,
} from "./shared-7Ty07K1G.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { n as resolveUnifiedOpenAIThinkingProfile } from "./thinking-policy-CxLaWOdl.js";
//#region extensions/openai/openclaw.plugin.json
var modelCatalog = {
  providers: {
    openai: {
      baseUrl: "https://api.openai.com/v1",
      api: "openai-responses",
      defaultUtilityModel: "gpt-5.6-luna",
      models: [
        {
          id: "gpt-5.3-chat-latest",
          name: "GPT-5.3 Chat (latest)",
          reasoning: false,
          input: ["text", "image"],
          contextWindow: 128e3,
          maxTokens: 16384,
          cost: {
            input: 1.75,
            output: 14,
            cacheRead: 0.175,
            cacheWrite: 0,
          },
        },
        {
          id: "gpt-5.3-codex",
          name: "GPT-5.3 Codex",
          reasoning: true,
          input: ["text", "image"],
          contextWindow: 4e5,
          maxTokens: 128e3,
          cost: {
            input: 1.75,
            output: 14,
            cacheRead: 0.175,
            cacheWrite: 0,
          },
        },
        {
          id: "gpt-5.4",
          name: "GPT-5.4",
          reasoning: true,
          input: ["text", "image"],
          mediaInput: {
            image: {
              maxSidePx: 2048,
              preferredSidePx: 2048,
              tokenMode: "detail",
            },
          },
          contextWindow: 272e3,
          maxTokens: 128e3,
          cost: {
            input: 2.5,
            output: 15,
            cacheRead: 0.25,
            cacheWrite: 0,
          },
        },
        {
          id: "gpt-5.4-mini",
          name: "GPT-5.4 mini",
          reasoning: true,
          input: ["text", "image"],
          mediaInput: {
            image: {
              maxSidePx: 2048,
              preferredSidePx: 2048,
              tokenMode: "detail",
            },
          },
          contextWindow: 4e5,
          maxTokens: 128e3,
          cost: {
            input: 0.75,
            output: 4.5,
            cacheRead: 0.075,
            cacheWrite: 0,
          },
        },
        {
          id: "gpt-5.4-nano",
          name: "GPT-5.4 nano",
          reasoning: true,
          input: ["text", "image"],
          mediaInput: {
            image: {
              maxSidePx: 2048,
              preferredSidePx: 2048,
              tokenMode: "detail",
            },
          },
          contextWindow: 4e5,
          maxTokens: 128e3,
          cost: {
            input: 0.2,
            output: 1.25,
            cacheRead: 0.02,
            cacheWrite: 0,
          },
        },
        {
          id: "gpt-5.4-pro",
          name: "GPT-5.4 Pro",
          reasoning: true,
          input: ["text", "image"],
          mediaInput: {
            image: {
              maxSidePx: 2048,
              preferredSidePx: 2048,
              tokenMode: "detail",
            },
          },
          contextWindow: 105e4,
          maxTokens: 128e3,
          cost: {
            input: 30,
            output: 180,
            cacheRead: 0,
            cacheWrite: 0,
          },
        },
        {
          id: "gpt-5.6",
          name: "GPT-5.6",
          reasoning: true,
          input: ["text", "image"],
          contextWindow: 105e4,
          maxTokens: 128e3,
          cost: {
            input: 5,
            output: 30,
            cacheRead: 0.5,
            cacheWrite: 6.25,
          },
          thinkingLevelMap: {
            off: "none",
            xhigh: "xhigh",
            max: "max",
          },
          compat: {
            supportsReasoningEffort: true,
            supportedReasoningEfforts: ["none", "low", "medium", "high", "xhigh", "max"],
            supportsTemperature: false,
          },
        },
        {
          id: "gpt-5.6-sol",
          name: "GPT-5.6 Sol",
          reasoning: true,
          input: ["text", "image"],
          contextWindow: 105e4,
          maxTokens: 128e3,
          cost: {
            input: 5,
            output: 30,
            cacheRead: 0.5,
            cacheWrite: 6.25,
          },
          thinkingLevelMap: {
            off: "none",
            xhigh: "xhigh",
            max: "max",
          },
          compat: {
            supportsReasoningEffort: true,
            supportedReasoningEfforts: ["none", "low", "medium", "high", "xhigh", "max"],
            supportsTemperature: false,
          },
        },
        {
          id: "gpt-5.6-terra",
          name: "GPT-5.6 Terra",
          reasoning: true,
          input: ["text", "image"],
          contextWindow: 105e4,
          maxTokens: 128e3,
          cost: {
            input: 2.5,
            output: 15,
            cacheRead: 0.25,
            cacheWrite: 3.125,
          },
          thinkingLevelMap: {
            off: "none",
            xhigh: "xhigh",
            max: "max",
          },
          compat: {
            supportsReasoningEffort: true,
            supportedReasoningEfforts: ["none", "low", "medium", "high", "xhigh", "max"],
            supportsTemperature: false,
          },
        },
        {
          id: "gpt-5.6-luna",
          name: "GPT-5.6 Luna",
          reasoning: true,
          input: ["text", "image"],
          contextWindow: 105e4,
          maxTokens: 128e3,
          cost: {
            input: 1,
            output: 6,
            cacheRead: 0.1,
            cacheWrite: 1.25,
          },
          thinkingLevelMap: {
            off: "none",
            xhigh: "xhigh",
            max: "max",
          },
          compat: {
            supportsReasoningEffort: true,
            supportedReasoningEfforts: ["none", "low", "medium", "high", "xhigh", "max"],
            supportsTemperature: false,
          },
        },
        {
          id: "gpt-5.5",
          name: "GPT-5.5",
          reasoning: true,
          input: ["text", "image"],
          mediaInput: {
            image: {
              maxSidePx: 6e3,
              preferredSidePx: 2048,
              tokenMode: "detail",
            },
          },
          contextWindow: 1e6,
          contextTokens: 272e3,
          maxTokens: 128e3,
          cost: {
            input: 5,
            output: 30,
            cacheRead: 0.5,
            cacheWrite: 0,
          },
        },
        {
          id: "o1",
          name: "o1",
          reasoning: true,
          input: ["text", "image"],
          contextWindow: 2e5,
          maxTokens: 1e5,
          cost: {
            input: 15,
            output: 60,
            cacheRead: 7.5,
            cacheWrite: 0,
          },
        },
        {
          id: "o1-pro",
          name: "o1-pro",
          reasoning: true,
          input: ["text", "image"],
          contextWindow: 2e5,
          maxTokens: 1e5,
          cost: {
            input: 150,
            output: 600,
            cacheRead: 0,
            cacheWrite: 0,
          },
        },
        {
          id: "o3",
          name: "o3",
          reasoning: true,
          input: ["text", "image"],
          contextWindow: 2e5,
          maxTokens: 1e5,
          cost: {
            input: 2,
            output: 8,
            cacheRead: 0.5,
            cacheWrite: 0,
          },
        },
        {
          id: "o3-deep-research",
          name: "o3-deep-research",
          reasoning: true,
          input: ["text", "image"],
          contextWindow: 2e5,
          maxTokens: 1e5,
          cost: {
            input: 10,
            output: 40,
            cacheRead: 2.5,
            cacheWrite: 0,
          },
        },
        {
          id: "o3-mini",
          name: "o3-mini",
          reasoning: true,
          input: ["text"],
          contextWindow: 2e5,
          maxTokens: 1e5,
          cost: {
            input: 1.1,
            output: 4.4,
            cacheRead: 0.55,
            cacheWrite: 0,
          },
        },
        {
          id: "o3-pro",
          name: "o3-pro",
          reasoning: true,
          input: ["text", "image"],
          contextWindow: 2e5,
          maxTokens: 1e5,
          cost: {
            input: 20,
            output: 80,
            cacheRead: 0,
            cacheWrite: 0,
          },
        },
        {
          id: "o4-mini",
          name: "o4-mini",
          reasoning: true,
          input: ["text", "image"],
          contextWindow: 2e5,
          maxTokens: 1e5,
          cost: {
            input: 1.1,
            output: 4.4,
            cacheRead: 0.28,
            cacheWrite: 0,
          },
        },
        {
          id: "o4-mini-deep-research",
          name: "o4-mini-deep-research",
          reasoning: true,
          input: ["text", "image"],
          contextWindow: 2e5,
          maxTokens: 1e5,
          cost: {
            input: 2,
            output: 8,
            cacheRead: 0.5,
            cacheWrite: 0,
          },
        },
        {
          id: "gpt-5.5-pro",
          name: "gpt-5.5-pro",
          reasoning: true,
          input: ["text", "image"],
          mediaInput: {
            image: {
              maxSidePx: 6e3,
              preferredSidePx: 2048,
              tokenMode: "detail",
            },
          },
          contextWindow: 1e6,
          maxTokens: 128e3,
          cost: {
            input: 30,
            output: 180,
            cacheRead: 0,
            cacheWrite: 0,
          },
        },
      ],
    },
  },
  aliases: {
    "azure-openai-responses": {
      provider: "openai",
      api: "azure-openai-responses",
    },
  },
  discovery: { openai: "runtime" },
  suppressions: [
    {
      provider: "openai",
      model: "gpt-5.3-codex-spark",
      reason:
        "gpt-5.3-codex-spark is available only through ChatGPT/Codex OAuth. Run `openclaw models auth login --provider openai` and use openai/gpt-5.3-codex-spark with that OAuth profile; OpenAI API-key auth cannot use this model.",
      when: { baseUrlHosts: ["api.openai.com"] },
    },
    {
      provider: "azure-openai-responses",
      model: "gpt-5.3-codex-spark",
      reason:
        "gpt-5.3-codex-spark is available only through ChatGPT/Codex OAuth. Run `openclaw models auth login --provider openai` and use openai/gpt-5.3-codex-spark with that OAuth profile; Azure/OpenAI API-key auth cannot use this model.",
    },
  ],
};
//#endregion
//#region extensions/openai/openai-provider.ts
const PROVIDER_ID = "openai";
const OPENAI_MODELS_ENDPOINT = "https://api.openai.com/v1/models";
const OPENAI_CODEX_MODELS_ENDPOINT = `${OPENAI_CODEX_RESPONSES_BASE_URL}/models?client_version=1.0.0`;
const OPENAI_MODELS_CACHE_TTL_MS = 6e4;
const OPENAI_CODEX_MODELS_CACHE_TTL_MS = 6e4;
const OPENAI_GPT_56_DIRECT_CONTEXT_TOKENS = 105e4;
const OPENAI_CODEX_GPT_56_CONTEXT_TOKENS = 372e3;
const OPENAI_GPT_55_CONTEXT_WINDOW = 1e6;
const OPENAI_GPT_55_CONTEXT_TOKENS = 272e3;
const OPENAI_GPT_55_PRO_CONTEXT_TOKENS = 1e6;
const OPENAI_GPT_54_CONTEXT_TOKENS = 105e4;
const OPENAI_GPT_54_PRO_CONTEXT_TOKENS = 105e4;
const OPENAI_GPT_54_MINI_CONTEXT_TOKENS = 4e5;
const OPENAI_GPT_54_NANO_CONTEXT_TOKENS = 4e5;
const OPENAI_GPT_54_MAX_TOKENS = 128e3;
const OPENAI_CHAT_LATEST_COST = {
  input: 5,
  output: 30,
  cacheRead: 0.5,
  cacheWrite: 0,
};
const OPENAI_GPT_56_SOL_COST = {
  input: 5,
  output: 30,
  cacheRead: 0.5,
  cacheWrite: 6.25,
};
const OPENAI_GPT_56_TERRA_COST = {
  input: 2.5,
  output: 15,
  cacheRead: 0.25,
  cacheWrite: 3.125,
};
const OPENAI_GPT_56_LUNA_COST = {
  input: 1,
  output: 6,
  cacheRead: 0.1,
  cacheWrite: 1.25,
};
const OPENAI_GPT_55_COST = {
  input: 5,
  output: 30,
  cacheRead: 0.5,
  cacheWrite: 0,
};
const OPENAI_GPT_55_PRO_COST = {
  input: 30,
  output: 180,
  cacheRead: 0,
  cacheWrite: 0,
};
const OPENAI_GPT_54_COST = {
  input: 2.5,
  output: 15,
  cacheRead: 0.25,
  cacheWrite: 0,
};
const OPENAI_GPT_54_PRO_COST = {
  input: 30,
  output: 180,
  cacheRead: 0,
  cacheWrite: 0,
};
const OPENAI_GPT_54_MINI_COST = {
  input: 0.75,
  output: 4.5,
  cacheRead: 0.075,
  cacheWrite: 0,
};
const OPENAI_GPT_54_NANO_COST = {
  input: 0.2,
  output: 1.25,
  cacheRead: 0.02,
  cacheWrite: 0,
};
const OPENAI_GPT_55_PRO_TEMPLATE_MODEL_IDS = [OPENAI_GPT_54_PRO_MODEL_ID, OPENAI_GPT_54_MODEL_ID];
const OPENAI_GPT_55_MEDIA_INPUT = {
  image: {
    maxSidePx: 6e3,
    preferredSidePx: 2048,
    tokenMode: "detail",
  },
};
const OPENAI_GPT_54_TEMPLATE_MODEL_IDS = [OPENAI_GPT_55_MODEL_ID];
const OPENAI_GPT_54_PRO_TEMPLATE_MODEL_IDS = [OPENAI_GPT_55_PRO_MODEL_ID];
const OPENAI_GPT_54_MINI_TEMPLATE_MODEL_IDS = ["gpt-5-mini"];
const OPENAI_GPT_54_NANO_TEMPLATE_MODEL_IDS = ["gpt-5-nano", "gpt-5-mini"];
const OPENAI_CHAT_LATEST_TEMPLATE_MODEL_IDS = [OPENAI_GPT_55_MODEL_ID, OPENAI_GPT_54_MODEL_ID];
const OPENAI_GPT_56_TEMPLATE_MODEL_IDS = [OPENAI_GPT_55_MODEL_ID];
const OPENAI_GPT_56_THINKING_LEVEL_MAP = {
  off: "none",
  xhigh: "xhigh",
  max: "max",
};
const OPENAI_UNKNOWN_MODEL_COST = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
};
const OPENAI_MANIFEST_PROVIDER = buildManifestModelProviderConfig({
  providerId: PROVIDER_ID,
  catalog: modelCatalog.providers.openai,
});
function shouldFetchOpenAILiveModels(baseUrl) {
  return isOpenAIHttpsApiBaseUrl(baseUrl);
}
function buildOpenAIManifestModelsForBaseUrl(baseUrl) {
  return OPENAI_MANIFEST_PROVIDER.models.map((model) =>
    model.api === "openai-chatgpt-responses" || isOpenAICodexBaseUrl(model.baseUrl)
      ? { ...model }
      : {
          ...model,
          baseUrl,
        },
  );
}
async function buildOpenAILiveProviderConfig(params) {
  const baseUrl =
    normalizeOptionalString(params.baseUrl) ?? resolveOpenAIDefaultBaseUrl(params.env);
  const models = buildOpenAIManifestModelsForBaseUrl(baseUrl);
  if (!shouldFetchOpenAILiveModels(baseUrl))
    return {
      baseUrl,
      api: "openai-responses",
      apiKey: params.apiKey,
      models,
    };
  return await buildLiveModelProviderConfig({
    providerId: PROVIDER_ID,
    endpoint: OPENAI_MODELS_ENDPOINT,
    providerConfig: {
      baseUrl,
      api: "openai-responses",
    },
    models,
    apiKey: params.apiKey,
    discoveryApiKey: params.discoveryApiKey,
    fetchGuard: params.fetchGuard,
    signal: params.signal,
    ttlMs: OPENAI_MODELS_CACHE_TTL_MS,
    auditContext: "openai-model-discovery",
  });
}
function readCodexModelString(row, key) {
  if (!row || typeof row !== "object" || Array.isArray(row)) return;
  const value = row[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : void 0;
}
function readCodexModelPositiveInteger(row, keys) {
  if (!row || typeof row !== "object" || Array.isArray(row)) return;
  const record = row;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isSafeInteger(value) && value > 0) return value;
  }
}
function readCodexModelStringArray(row, keys) {
  if (!row || typeof row !== "object" || Array.isArray(row)) return [];
  const record = row;
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) return value.filter((entry) => typeof entry === "string");
  }
  return [];
}
function readCodexReasoningLevels(row) {
  if (!row || typeof row !== "object" || Array.isArray(row)) return;
  const record = row;
  const value = record.supported_reasoning_levels ?? record.supportedReasoningLevels;
  if (!Array.isArray(value)) return;
  return value.flatMap((entry) => {
    if (typeof entry === "string" && entry.trim().length > 0) return [entry.trim()];
    if (entry && typeof entry === "object" && !Array.isArray(entry)) {
      const effort = entry.effort;
      return typeof effort === "string" && effort.trim().length > 0 ? [effort.trim()] : [];
    }
    return [];
  });
}
function readCodexModelBoolean(row, key) {
  if (!row || typeof row !== "object" || Array.isArray(row)) return;
  const value = row[key];
  return typeof value === "boolean" ? value : void 0;
}
function readCodexModelRows(body) {
  if (!body || typeof body !== "object" || Array.isArray(body))
    throw new Error("OpenAI Codex model discovery response must be { models: [] }");
  const models = body.models;
  if (!Array.isArray(models))
    throw new Error("OpenAI Codex model discovery response must be { models: [] }");
  return models;
}
function shouldIncludeCodexModelRow(row) {
  const visibility = normalizeLowercaseStringOrEmpty(readCodexModelString(row, "visibility") ?? "");
  if (visibility && visibility !== "list") return false;
  return (
    (readCodexModelBoolean(row, "show_in_picker") ?? readCodexModelBoolean(row, "showInPicker")) !==
    false
  );
}
function resolveCodexModelInput(row, fallback) {
  const rawModalities = readCodexModelStringArray(row, ["input_modalities", "inputModalities"]);
  if (rawModalities.length === 0) return fallback?.input ?? ["text", "image"];
  const modalities = new Set(
    rawModalities.map((modality) => normalizeLowercaseStringOrEmpty(modality)),
  );
  const input = /* @__PURE__ */ new Set();
  if (modalities.has("text")) input.add("text");
  if (modalities.has("image") || modalities.has("vision")) input.add("image");
  if (modalities.has("audio")) input.add("audio");
  if (modalities.has("video")) input.add("video");
  return input.size > 0 ? [...input] : (fallback?.input ?? ["text", "image"]);
}
function normalizeOpenAICodexCatalogModel(model) {
  const modelId = normalizeLowercaseStringOrEmpty(model.id);
  if (modelId === "gpt-5.6") return;
  if (modelId === "gpt-5.6-sol" || modelId === "gpt-5.6-terra" || modelId === "gpt-5.6-luna") {
    const supportsNativeUltra = modelId === "gpt-5.6-sol" || modelId === "gpt-5.6-terra";
    const supportedReasoningEfforts = model.compat?.supportedReasoningEfforts
      ? [
          .../* @__PURE__ */ new Set([
            ...model.compat.supportedReasoningEfforts.filter((effort) => effort !== "none"),
            ...(supportsNativeUltra ? ["ultra"] : []),
          ]),
        ]
      : void 0;
    return {
      ...model,
      contextWindow: OPENAI_CODEX_GPT_56_CONTEXT_TOKENS,
      contextTokens: OPENAI_CODEX_GPT_56_CONTEXT_TOKENS,
      thinkingLevelMap: {
        ...model.thinkingLevelMap,
        off: null,
      },
      ...(model.compat
        ? {
            compat: {
              ...model.compat,
              ...(supportedReasoningEfforts ? { supportedReasoningEfforts } : {}),
            },
          }
        : {}),
    };
  }
  return model;
}
function resolveCodexModelFallback(modelId) {
  const fallbackModel = OPENAI_MANIFEST_PROVIDER.models.find(
    (candidate) =>
      normalizeLowercaseStringOrEmpty(candidate.id) === normalizeLowercaseStringOrEmpty(modelId),
  );
  return fallbackModel ? normalizeOpenAICodexCatalogModel(fallbackModel) : void 0;
}
function buildOpenAICodexModelFromLiveRow(row) {
  if (!shouldIncludeCodexModelRow(row)) return;
  const modelId = readCodexModelString(row, "slug") ?? readCodexModelString(row, "id");
  if (!modelId) return;
  const fallback = resolveCodexModelFallback(modelId);
  const reasoningLevels = readCodexReasoningLevels(row);
  const contextTokens = readCodexModelPositiveInteger(row, ["context_window", "contextWindow"]);
  const contextWindow =
    readCodexModelPositiveInteger(row, ["max_context_window", "maxContextWindow"]) ??
    fallback?.contextWindow ??
    contextTokens ??
    2e5;
  const maxTokens =
    readCodexModelPositiveInteger(row, [
      "max_output_tokens",
      "maxOutputTokens",
      "max_completion_tokens",
      "maxCompletionTokens",
    ]) ??
    fallback?.maxTokens ??
    OPENAI_GPT_54_MAX_TOKENS;
  const compat =
    reasoningLevels !== void 0
      ? {
          ...fallback?.compat,
          supportsReasoningEffort: true,
          supportedReasoningEfforts: [...reasoningLevels],
        }
      : fallback?.compat;
  const thinkingLevelMap = {
    ...(reasoningLevels === void 0 ? fallback?.thinkingLevelMap : {}),
    ...(normalizeLowercaseStringOrEmpty(modelId).startsWith("gpt-5.6") ? { off: null } : {}),
    ...(reasoningLevels?.includes("xhigh") ? { xhigh: "xhigh" } : {}),
    ...(reasoningLevels?.includes("max") ? { max: "max" } : {}),
  };
  return {
    id: modelId,
    name: readCodexModelString(row, "display_name") ?? fallback?.name ?? modelId,
    api: "openai-chatgpt-responses",
    baseUrl: OPENAI_CODEX_RESPONSES_BASE_URL,
    reasoning: (reasoningLevels?.length ?? 0) > 0 || fallback?.reasoning || false,
    input: resolveCodexModelInput(row, fallback),
    cost: fallback?.cost ?? OPENAI_UNKNOWN_MODEL_COST,
    contextWindow,
    maxTokens,
    ...((contextTokens ?? fallback?.contextTokens)
      ? { contextTokens: contextTokens ?? fallback?.contextTokens }
      : {}),
    ...(fallback?.mediaInput ? { mediaInput: fallback.mediaInput } : {}),
    ...(compat ? { compat } : {}),
    ...(Object.keys(thinkingLevelMap).length > 0 ? { thinkingLevelMap } : {}),
  };
}
function buildOpenAICodexStaticProviderConfig() {
  return {
    baseUrl: OPENAI_CODEX_RESPONSES_BASE_URL,
    api: "openai-chatgpt-responses",
    auth: "oauth",
    models: OPENAI_MANIFEST_PROVIDER.models.flatMap((model) => {
      const normalized = normalizeOpenAICodexCatalogModel(model);
      return normalized ? [normalized] : [];
    }),
  };
}
async function buildOpenAICodexLiveProviderConfig(params) {
  try {
    const models = (
      await getCachedLiveProviderModelRows({
        providerId: PROVIDER_ID,
        endpoint: OPENAI_CODEX_MODELS_ENDPOINT,
        discoveryApiKey: params.discoveryApiKey,
        fetchGuard: params.fetchGuard,
        signal: params.signal,
        ttlMs: OPENAI_CODEX_MODELS_CACHE_TTL_MS,
        auditContext: "openai-codex-model-discovery",
        readRows: readCodexModelRows,
        buildRequestHeaders: ({ discoveryApiKey }) => ({
          Accept: "application/json",
          ...(discoveryApiKey ? { Authorization: `Bearer ${discoveryApiKey}` } : {}),
          ...(params.accountId ? { "ChatGPT-Account-ID": params.accountId } : {}),
        }),
        cacheKeyParts: [
          PROVIDER_ID,
          "codex-model-rows",
          OPENAI_CODEX_MODELS_ENDPOINT,
          params.discoveryApiKey,
          params.accountId ?? "",
        ],
      })
    )
      .map(buildOpenAICodexModelFromLiveRow)
      .filter((model) => Boolean(model));
    if (models.length > 0)
      return {
        baseUrl: OPENAI_CODEX_RESPONSES_BASE_URL,
        api: "openai-chatgpt-responses",
        auth: "oauth",
        models,
      };
  } catch {}
  return buildOpenAICodexStaticProviderConfig();
}
function isCodexCatalogAuthMode(mode) {
  return mode === "oauth" || mode === "token";
}
function resolveOpenAICatalogBaseUrl(ctx) {
  const configuredProvider = Object.entries(ctx.config?.models?.providers ?? {}).find(
    ([providerId]) => normalizeProviderId(providerId) === PROVIDER_ID,
  )?.[1];
  return (
    normalizeOptionalString(configuredProvider?.baseUrl) ??
    resolveOpenAIDefaultBaseUrl(ctx.env ?? process.env)
  );
}
function shouldUseOpenAIResponsesTransport(params) {
  if (params.api !== "openai-completions") return false;
  const isOwnerProvider = normalizeProviderId(params.provider) === PROVIDER_ID;
  const isPlatformEndpoint =
    typeof params.baseUrl === "string" && classifyOpenAIBaseUrl(params.baseUrl) === "platform";
  if (isOwnerProvider) {
    if (resolveAuthoredOpenAICompletionsRoute(params)) return false;
    return !params.baseUrl || isPlatformEndpoint;
  }
  return isPlatformEndpoint;
}
/** Resolves the effective authored OpenAI config route for one model. */
function resolveAuthoredOpenAIConfigRoute(params) {
  if (normalizeProviderId(params.provider) !== PROVIDER_ID) return;
  const providers = Object.entries(params.config?.models?.providers ?? {});
  const requestedProvider = params.provider.trim();
  const providerKey =
    providers.find(([providerId]) => providerId.trim() === requestedProvider)?.[0].trim() ??
    providers.find(([providerId]) => normalizeProviderId(providerId) === PROVIDER_ID)?.[0].trim();
  let providerConfig;
  for (const [providerId, candidate] of providers) {
    if (providerId.trim() !== providerKey || !candidate) continue;
    providerConfig = providerConfig
      ? {
          ...providerConfig,
          ...candidate,
          models: candidate.models ?? providerConfig.models,
        }
      : candidate;
  }
  if (!providerConfig) return;
  const modelId = normalizeOpenAIModelRouteId(params.modelId);
  let modelConfig;
  for (const model of providerConfig.models ?? []) {
    if (normalizeOpenAIModelRouteId(model.id) !== modelId) continue;
    modelConfig = modelConfig
      ? {
          ...model,
          ...modelConfig,
        }
      : model;
  }
  return {
    ...(modelConfig ? { configuredModel: modelConfig } : {}),
    configuredProvider: providerConfig,
  };
}
/** Authored Completions is a current transport contract; only catalog defaults are upgraded. */
function resolveAuthoredOpenAICompletionsRoute(params) {
  const configuredRoute = resolveAuthoredOpenAIConfigRoute(params);
  if (!configuredRoute) return;
  if (
    (normalizeOptionalString(configuredRoute.configuredModel?.api) ??
      normalizeOptionalString(configuredRoute.configuredProvider.api)) !== "openai-completions"
  )
    return;
  return {
    api: "openai-completions",
    baseUrl:
      normalizeOptionalString(configuredRoute.configuredModel?.baseUrl) ??
      normalizeOptionalString(configuredRoute.configuredProvider.baseUrl) ??
      resolveOpenAIDefaultBaseUrl(process.env),
  };
}
function isOpenAIProvider(provider) {
  return normalizeProviderId(provider ?? "") === PROVIDER_ID;
}
function normalizeOpenAITransport(model, context) {
  if (
    !shouldUseOpenAIResponsesTransport({
      provider: model.provider,
      modelId: context?.modelId,
      api: model.api,
      baseUrl: model.baseUrl,
      config: context?.config,
    })
  )
    return model;
  return {
    ...model,
    api: "openai-responses",
  };
}
function shouldUseCodexResponsesHooks(params) {
  if (params.api === "openai-chatgpt-responses") return true;
  return typeof params.baseUrl === "string" && isOpenAICodexBaseUrl(params.baseUrl);
}
function resolveConfiguredProviderAuthTransport(providerConfig) {
  const authMode = providerConfig?.auth;
  if (authMode === "oauth" || authMode === "token") return "codex";
  if (authMode === "api-key") return "responses";
}
function shouldResolveDynamicModelThroughCodex(ctx) {
  if (
    shouldUseCodexResponsesHooks({
      provider: ctx.provider,
      api: ctx.providerConfig?.api,
      baseUrl: ctx.providerConfig?.baseUrl,
    })
  )
    return true;
  if (
    ctx.providerConfig?.api === "openai-responses" ||
    ctx.providerConfig?.api === "openai-completions" ||
    (ctx.providerConfig?.baseUrl && !isOpenAICodexBaseUrl(ctx.providerConfig.baseUrl))
  )
    return false;
  if (isOpenAIPlatformOnlyRouteModelId(ctx.modelId)) return false;
  if (isOpenAISubscriptionOnlyRouteModelId(ctx.modelId)) return true;
  return ctx.agentRuntimeId === "codex";
}
function buildOpenAIUnknownModelHint(modelId) {
  if (normalizeLowercaseStringOrEmpty(modelId) !== "gpt-5.3-codex-spark") return;
  return "gpt-5.3-codex-spark is available only through ChatGPT/Codex OAuth. Run `openclaw models auth login --provider openai` and use openai/gpt-5.3-codex-spark with that OAuth profile; OpenAI API-key auth cannot use this model.";
}
function resolveOpenAIGptForwardCompatModel(ctx) {
  const trimmedModelId = ctx.modelId.trim();
  const lower = normalizeLowercaseStringOrEmpty(trimmedModelId);
  let templateIds;
  let patch;
  if (lower === "chat-latest") {
    templateIds = OPENAI_CHAT_LATEST_TEMPLATE_MODEL_IDS;
    patch = {
      api: "openai-responses",
      provider: PROVIDER_ID,
      baseUrl: resolveOpenAIDefaultBaseUrl(),
      reasoning: false,
      input: ["text", "image"],
      cost: OPENAI_CHAT_LATEST_COST,
      contextWindow: 4e5,
      maxTokens: OPENAI_GPT_54_MAX_TOKENS,
    };
  } else if (
    lower === "gpt-5.6" ||
    lower === "gpt-5.6-sol" ||
    lower === "gpt-5.6-terra" ||
    lower === "gpt-5.6-luna"
  ) {
    templateIds = OPENAI_GPT_56_TEMPLATE_MODEL_IDS;
    const cost =
      lower === "gpt-5.6" || lower === "gpt-5.6-sol"
        ? OPENAI_GPT_56_SOL_COST
        : lower === "gpt-5.6-terra"
          ? OPENAI_GPT_56_TERRA_COST
          : OPENAI_GPT_56_LUNA_COST;
    patch = {
      api: "openai-responses",
      provider: PROVIDER_ID,
      baseUrl: resolveOpenAIDefaultBaseUrl(),
      reasoning: true,
      input: ["text", "image"],
      cost,
      contextWindow: OPENAI_GPT_56_DIRECT_CONTEXT_TOKENS,
      contextTokens: OPENAI_GPT_56_DIRECT_CONTEXT_TOKENS,
      maxTokens: OPENAI_GPT_54_MAX_TOKENS,
      thinkingLevelMap: OPENAI_GPT_56_THINKING_LEVEL_MAP,
    };
  } else if (lower === "gpt-5.5") {
    templateIds = [OPENAI_GPT_55_MODEL_ID, OPENAI_GPT_54_MODEL_ID];
    patch = {
      api: "openai-responses",
      provider: PROVIDER_ID,
      baseUrl: resolveOpenAIDefaultBaseUrl(),
      reasoning: true,
      input: ["text", "image"],
      mediaInput: OPENAI_GPT_55_MEDIA_INPUT,
      cost: OPENAI_GPT_55_COST,
      contextWindow: OPENAI_GPT_55_CONTEXT_WINDOW,
      contextTokens: OPENAI_GPT_55_CONTEXT_TOKENS,
      maxTokens: OPENAI_GPT_54_MAX_TOKENS,
    };
  } else if (lower === "gpt-5.5-pro") {
    templateIds = OPENAI_GPT_55_PRO_TEMPLATE_MODEL_IDS;
    patch = {
      api: "openai-responses",
      provider: PROVIDER_ID,
      baseUrl: resolveOpenAIDefaultBaseUrl(),
      reasoning: true,
      input: ["text", "image"],
      cost: OPENAI_GPT_55_PRO_COST,
      contextWindow: OPENAI_GPT_55_PRO_CONTEXT_TOKENS,
      maxTokens: OPENAI_GPT_54_MAX_TOKENS,
    };
  } else if (lower === "gpt-5.4") {
    templateIds = OPENAI_GPT_54_TEMPLATE_MODEL_IDS;
    patch = {
      api: "openai-responses",
      provider: PROVIDER_ID,
      baseUrl: resolveOpenAIDefaultBaseUrl(),
      reasoning: true,
      input: ["text", "image"],
      cost: OPENAI_GPT_54_COST,
      contextWindow: OPENAI_GPT_54_CONTEXT_TOKENS,
      maxTokens: OPENAI_GPT_54_MAX_TOKENS,
    };
  } else if (lower === "gpt-5.4-pro") {
    templateIds = OPENAI_GPT_54_PRO_TEMPLATE_MODEL_IDS;
    patch = {
      api: "openai-responses",
      provider: PROVIDER_ID,
      baseUrl: resolveOpenAIDefaultBaseUrl(),
      reasoning: true,
      input: ["text", "image"],
      cost: OPENAI_GPT_54_PRO_COST,
      contextWindow: OPENAI_GPT_54_PRO_CONTEXT_TOKENS,
      maxTokens: OPENAI_GPT_54_MAX_TOKENS,
    };
  } else if (lower === "gpt-5.4-mini") {
    templateIds = OPENAI_GPT_54_MINI_TEMPLATE_MODEL_IDS;
    patch = {
      api: "openai-responses",
      provider: PROVIDER_ID,
      baseUrl: resolveOpenAIDefaultBaseUrl(),
      reasoning: true,
      input: ["text", "image"],
      cost: OPENAI_GPT_54_MINI_COST,
      contextWindow: OPENAI_GPT_54_MINI_CONTEXT_TOKENS,
      maxTokens: OPENAI_GPT_54_MAX_TOKENS,
    };
  } else if (lower === "gpt-5.4-nano") {
    templateIds = OPENAI_GPT_54_NANO_TEMPLATE_MODEL_IDS;
    patch = {
      api: "openai-responses",
      provider: PROVIDER_ID,
      baseUrl: resolveOpenAIDefaultBaseUrl(),
      reasoning: true,
      input: ["text", "image"],
      cost: OPENAI_GPT_54_NANO_COST,
      contextWindow: OPENAI_GPT_54_NANO_CONTEXT_TOKENS,
      maxTokens: OPENAI_GPT_54_MAX_TOKENS,
    };
  } else return;
  return (
    cloneFirstTemplateModel({
      providerId: PROVIDER_ID,
      modelId: trimmedModelId,
      templateIds,
      ctx,
      patch,
    }) ??
    normalizeModelCompat({
      id: trimmedModelId,
      name: trimmedModelId,
      ...patch,
      cost: patch.cost ?? {
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0,
      },
      contextWindow: patch.contextWindow ?? 2e5,
      maxTokens: patch.maxTokens ?? 2e5,
    })
  );
}
function buildOpenAIProvider() {
  const codexHooks = buildOpenAICodexProviderHooks();
  const codexResponsesHooks = buildOpenAIResponsesProviderHooks();
  const responsesHooks = buildOpenAIResponsesProviderHooks({ transport: "sse" });
  return {
    id: PROVIDER_ID,
    label: "OpenAI",
    hookAliases: ["azure-openai", "azure-openai-responses"],
    docsPath: "/providers/models",
    envVars: ["OPENAI_API_KEY"],
    auth: [
      ...buildOpenAIChatGPTAuthMethods(),
      createProviderApiKeyAuthMethod({
        providerId: PROVIDER_ID,
        methodId: "api-key",
        label: OPENAI_API_KEY_LABEL,
        hint: "Use your OpenAI API key directly",
        optionKey: "openaiApiKey",
        flagName: "--openai-api-key",
        envVar: "OPENAI_API_KEY",
        promptMessage: "Enter OpenAI API key",
        profileId: "openai:api-key",
        defaultModel: OPENAI_DEFAULT_MODEL,
        preserveExistingPrimary: true,
        expectedProviders: ["openai"],
        applyConfig: (cfg) => applyOpenAIConfig(cfg),
        wizard: {
          choiceId: "openai-api-key",
          choiceLabel: OPENAI_API_KEY_LABEL,
          choiceHint: "Use your OpenAI API key directly",
          assistantPriority: 5,
          ...OPENAI_ACCOUNT_WIZARD_GROUP,
        },
      }),
    ],
    catalog: {
      order: "simple",
      run: async (ctx) => {
        const auth = ctx.resolveProviderAuth(PROVIDER_ID);
        try {
          const { resolveApiKeyForProvider, resolveProviderAuthProfileMetadata } =
            await import("./plugin-sdk/provider-auth-runtime.js");
          const runtimeAuth = await resolveApiKeyForProvider({
            provider: PROVIDER_ID,
            cfg: ctx.config,
            ...(ctx.agentDir ? { agentDir: ctx.agentDir } : {}),
            ...(ctx.workspaceDir ? { workspaceDir: ctx.workspaceDir } : {}),
            ...(auth.profileId
              ? {
                  profileId: auth.profileId,
                  lockedProfile: true,
                }
              : {}),
          });
          if (runtimeAuth && isCodexCatalogAuthMode(runtimeAuth.mode) && runtimeAuth.apiKey) {
            const metadata = resolveProviderAuthProfileMetadata({
              provider: PROVIDER_ID,
              cfg: ctx.config,
              ...(ctx.agentDir ? { agentDir: ctx.agentDir } : {}),
              ...((runtimeAuth.profileId ?? auth.profileId)
                ? { profileId: runtimeAuth.profileId ?? auth.profileId }
                : {}),
            });
            const provider = await buildOpenAICodexLiveProviderConfig({
              discoveryApiKey: runtimeAuth.apiKey,
              accountId: metadata.accountId,
            });
            return { providers: { [PROVIDER_ID]: provider } };
          }
        } catch {}
        if (auth.mode === "api_key" && auth.apiKey)
          return {
            providers: {
              [PROVIDER_ID]: await buildOpenAILiveProviderConfig({
                apiKey: auth.apiKey,
                baseUrl: resolveOpenAICatalogBaseUrl(ctx),
                discoveryApiKey: auth.discoveryApiKey,
              }),
            },
          };
        const apiKey = ctx.resolveProviderApiKey(PROVIDER_ID);
        if (!apiKey.apiKey) return null;
        return {
          providers: {
            [PROVIDER_ID]: await buildOpenAILiveProviderConfig({
              apiKey: apiKey.apiKey,
              baseUrl: resolveOpenAICatalogBaseUrl(ctx),
              discoveryApiKey: apiKey.discoveryApiKey,
            }),
          },
        };
      },
    },
    staticCatalog: {
      order: "simple",
      run: async () => ({ providers: { [PROVIDER_ID]: OPENAI_MANIFEST_PROVIDER } }),
    },
    resolveDynamicModel: (ctx) =>
      shouldResolveDynamicModelThroughCodex(ctx)
        ? codexHooks.resolveDynamicModel?.(ctx)
        : resolveOpenAIGptForwardCompatModel(ctx),
    preferRuntimeResolvedModel: (ctx) => codexHooks.preferRuntimeResolvedModel?.(ctx) ?? false,
    normalizeResolvedModel: (ctx) => {
      if (!isOpenAIProvider(ctx.provider)) return;
      const authoredCompletionsRoute = resolveAuthoredOpenAICompletionsRoute(ctx);
      if (authoredCompletionsRoute)
        return {
          ...ctx.model,
          ...authoredCompletionsRoute,
        };
      if (
        shouldUseCodexResponsesHooks({
          provider: ctx.provider,
          api: ctx.model.api,
          baseUrl: ctx.model.baseUrl,
        })
      )
        return codexHooks.normalizeResolvedModel?.(ctx);
      return normalizeOpenAITransport(ctx.model, ctx);
    },
    normalizeTransport: (ctx) => {
      const authoredCompletionsRoute = resolveAuthoredOpenAICompletionsRoute(ctx);
      if (authoredCompletionsRoute)
        return ctx.api === authoredCompletionsRoute.api &&
          ctx.baseUrl === authoredCompletionsRoute.baseUrl
          ? void 0
          : authoredCompletionsRoute;
      if (shouldUseCodexResponsesHooks(ctx)) return codexHooks.normalizeTransport?.(ctx);
      return shouldUseOpenAIResponsesTransport(ctx)
        ? {
            api: "openai-responses",
            baseUrl: ctx.baseUrl,
          }
        : void 0;
    },
    ...responsesHooks,
    prepareExtraParams: (ctx) => {
      const providerConfig = ctx.config?.models?.providers?.[PROVIDER_ID];
      return (
        shouldUseCodexResponsesHooks({
          provider: ctx.provider,
          api: ctx.model?.api,
          baseUrl: ctx.model?.baseUrl,
        }) ||
        (normalizeProviderId(ctx.provider) === PROVIDER_ID &&
          (!providerConfig?.baseUrl || isOpenAIHttpsApiBaseUrl(providerConfig.baseUrl)) &&
          resolveConfiguredProviderAuthTransport(providerConfig) === "codex")
          ? codexResponsesHooks
          : responsesHooks
      ).prepareExtraParams?.(ctx);
    },
    resolveUsageAuth: codexHooks.resolveUsageAuth,
    fetchUsageSnapshot: codexHooks.fetchUsageSnapshot,
    refreshOAuth: codexHooks.refreshOAuth,
    buildUnknownModelHint: ({ modelId }) => buildOpenAIUnknownModelHint(modelId),
    buildMissingAuthMessage: (ctx) => {
      if (normalizeProviderId(ctx.provider) !== PROVIDER_ID) return;
      if (ctx.listProfileIds(PROVIDER_ID).length === 0) return;
      return `No API key found for provider "openai". You are authenticated with OpenAI ChatGPT/Codex OAuth. Use ${OPENAI_CODEX_DEFAULT_MODEL} with the ChatGPT/Codex OAuth profile, or set OPENAI_API_KEY for direct OpenAI API access.`;
    },
    matchesContextOverflowError: ({ errorMessage }) =>
      /content_filter.*(?:prompt|input).*(?:too long|exceed)/i.test(errorMessage),
    resolveReasoningOutputMode: () => "native",
    resolveThinkingProfile: ({ provider, modelId, agentRuntime, compat }) =>
      normalizeProviderId(provider) === PROVIDER_ID
        ? resolveUnifiedOpenAIThinkingProfile(modelId, agentRuntime, compat)
        : null,
    isModernModelRef: ({ modelId }) =>
      matchesExactOrPrefix(modelId, OPENAI_PROVIDER_MODERN_MODEL_IDS),
    augmentModelCatalog: (ctx) => {
      const openAiGpt55ProTemplate = findCatalogTemplate({
        entries: ctx.entries,
        providerId: PROVIDER_ID,
        templateIds: OPENAI_GPT_55_PRO_TEMPLATE_MODEL_IDS,
      });
      const openAiGpt54Template = findCatalogTemplate({
        entries: ctx.entries,
        providerId: PROVIDER_ID,
        templateIds: OPENAI_GPT_54_TEMPLATE_MODEL_IDS,
      });
      const openAiGpt54ProTemplate = findCatalogTemplate({
        entries: ctx.entries,
        providerId: PROVIDER_ID,
        templateIds: OPENAI_GPT_54_PRO_TEMPLATE_MODEL_IDS,
      });
      const openAiGpt54MiniTemplate = findCatalogTemplate({
        entries: ctx.entries,
        providerId: PROVIDER_ID,
        templateIds: OPENAI_GPT_54_MINI_TEMPLATE_MODEL_IDS,
      });
      const openAiGpt54NanoTemplate = findCatalogTemplate({
        entries: ctx.entries,
        providerId: PROVIDER_ID,
        templateIds: OPENAI_GPT_54_NANO_TEMPLATE_MODEL_IDS,
      });
      return [
        buildOpenAISyntheticCatalogEntry(openAiGpt55ProTemplate, {
          id: OPENAI_GPT_55_PRO_MODEL_ID,
          reasoning: true,
          input: ["text", "image"],
          contextWindow: OPENAI_GPT_55_PRO_CONTEXT_TOKENS,
        }),
        buildOpenAISyntheticCatalogEntry(openAiGpt54Template, {
          id: OPENAI_GPT_54_MODEL_ID,
          reasoning: true,
          input: ["text", "image"],
          contextWindow: OPENAI_GPT_54_CONTEXT_TOKENS,
        }),
        buildOpenAISyntheticCatalogEntry(openAiGpt54ProTemplate, {
          id: OPENAI_GPT_54_PRO_MODEL_ID,
          reasoning: true,
          input: ["text", "image"],
          contextWindow: OPENAI_GPT_54_PRO_CONTEXT_TOKENS,
        }),
        buildOpenAISyntheticCatalogEntry(openAiGpt54MiniTemplate, {
          id: OPENAI_GPT_54_MINI_MODEL_ID,
          reasoning: true,
          input: ["text", "image"],
          contextWindow: OPENAI_GPT_54_MINI_CONTEXT_TOKENS,
        }),
        buildOpenAISyntheticCatalogEntry(openAiGpt54NanoTemplate, {
          id: OPENAI_GPT_54_NANO_MODEL_ID,
          reasoning: true,
          input: ["text", "image"],
          contextWindow: OPENAI_GPT_54_NANO_CONTEXT_TOKENS,
        }),
      ].filter((entry) => entry !== void 0);
    },
  };
}
/** @deprecated Use buildOpenAIProvider; OpenAI Codex is now an OpenAI auth/transport mode. */
function buildOpenAICodexProviderPlugin() {
  return buildOpenAIProvider();
}
//#endregion
export {
  buildOpenAIProvider as i,
  buildOpenAICodexProviderPlugin as n,
  buildOpenAILiveProviderConfig as r,
  buildOpenAICodexLiveProviderConfig as t,
};
