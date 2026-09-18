import {
  o as XAI_IMAGE_MODELS,
  s as buildXaiCatalogModels,
  t as XAI_BASE_URL,
  u as resolveXaiCatalogEntry,
} from "./model-definitions-BoOPeWPv.js";
import {
  a as getCachedLiveProviderModelRows,
  n as buildLiveModelProviderConfig,
} from "./provider-catalog-live-runtime-C9z3vHtm.js";
//#region extensions/xai/provider-catalog.ts
const PROVIDER_ID = "xai";
const XAI_MODELS_ENDPOINT = `${XAI_BASE_URL}/models`;
const XAI_GROK_OAUTH_BASE_URL = "https://cli-chat-proxy.grok.com/v1";
const XAI_GROK_OAUTH_MODELS_ENDPOINT = `${XAI_GROK_OAUTH_BASE_URL}/models`;
const XAI_MODELS_CACHE_TTL_MS = 6e4;
const XAI_GROK_OAUTH_MODELS_CACHE_TTL_MS = 6e4;
const XAI_GROK_OAUTH_REASONING_MODEL_IDS = /* @__PURE__ */ new Set(["grok-composer-2.5-fast"]);
const XAI_UNKNOWN_MODEL_COST = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
};
function buildXaiProvider(api = "openai-responses") {
  return {
    baseUrl: XAI_BASE_URL,
    api,
    models: buildXaiCatalogModels(),
  };
}
function buildXaiOAuthFallbackProvider() {
  return {
    baseUrl: XAI_GROK_OAUTH_BASE_URL,
    api: "openai-responses",
    auth: "oauth",
    models: buildXaiCatalogModels(),
  };
}
async function buildLiveXaiProvider(params) {
  return await buildLiveModelProviderConfig({
    providerId: PROVIDER_ID,
    endpoint: XAI_MODELS_ENDPOINT,
    providerConfig: {
      baseUrl: XAI_BASE_URL,
      api: "openai-responses",
    },
    models: buildXaiCatalogModels(),
    apiKey: params.apiKey,
    discoveryApiKey: params.discoveryApiKey,
    fetchGuard: params.fetchGuard,
    signal: params.signal,
    ttlMs: XAI_MODELS_CACHE_TTL_MS,
    auditContext: "xai-model-discovery",
  });
}
function readLiveModelString(row, key) {
  if (!row || typeof row !== "object" || Array.isArray(row)) return;
  const value = row[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : void 0;
}
function readLiveModelPositiveInteger(row, keys) {
  if (!row || typeof row !== "object" || Array.isArray(row)) return;
  const record = row;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isSafeInteger(value) && value > 0) return value;
  }
}
function readLiveModelBoolean(row, key) {
  if (!row || typeof row !== "object" || Array.isArray(row)) return;
  const value = row[key];
  return typeof value === "boolean" ? value : void 0;
}
function resolveXaiOauthMetadataFallback(modelId) {
  if (modelId === "grok-build") return resolveXaiCatalogEntry("grok-build-0.1");
  return resolveXaiCatalogEntry(modelId);
}
function isXaiOAuthResponsesModel(row, fallback) {
  const modelId = readLiveModelString(row, "id") ?? readLiveModelString(row, "model");
  if (modelId && XAI_IMAGE_MODELS.includes(modelId)) return false;
  const backend =
    readLiveModelString(row, "api_backend") ??
    readLiveModelString(row, "apiBackend") ??
    readLiveModelString(row, "backend");
  if (backend) {
    const normalizedBackend = backend.toLowerCase();
    return (
      normalizedBackend === "responses" ||
      normalizedBackend === "chat" ||
      normalizedBackend === "language"
    );
  }
  return Boolean(fallback);
}
function buildXaiOauthModelFromLiveRow(row) {
  const modelId = readLiveModelString(row, "id") ?? readLiveModelString(row, "model");
  if (!modelId) return;
  const fallback = resolveXaiOauthMetadataFallback(modelId);
  if (!isXaiOAuthResponsesModel(row, fallback)) return;
  const contextWindow =
    readLiveModelPositiveInteger(row, ["context_window", "contextWindow"]) ??
    fallback?.contextWindow ??
    1e6;
  const maxTokens =
    readLiveModelPositiveInteger(row, ["max_completion_tokens", "maxCompletionTokens"]) ??
    fallback?.maxTokens ??
    64e3;
  const reasoning =
    (readLiveModelBoolean(row, "supports_reasoning_effort") ??
      readLiveModelBoolean(row, "supportsReasoningEffort")) === true ||
    fallback?.reasoning === true ||
    XAI_GROK_OAUTH_REASONING_MODEL_IDS.has(modelId);
  return {
    id: modelId,
    name: readLiveModelString(row, "name") ?? fallback?.name ?? modelId,
    api: "openai-responses",
    baseUrl: XAI_GROK_OAUTH_BASE_URL,
    reasoning,
    input: fallback?.input ?? ["text"],
    cost: fallback?.cost ?? XAI_UNKNOWN_MODEL_COST,
    contextWindow,
    maxTokens,
    ...(fallback?.compat ? { compat: fallback.compat } : {}),
    ...(fallback?.thinkingLevelMap ? { thinkingLevelMap: fallback.thinkingLevelMap } : {}),
  };
}
async function buildLiveXaiOAuthProvider(params) {
  try {
    const models = (
      await getCachedLiveProviderModelRows({
        providerId: PROVIDER_ID,
        endpoint: XAI_GROK_OAUTH_MODELS_ENDPOINT,
        discoveryApiKey: params.discoveryApiKey,
        fetchGuard: params.fetchGuard,
        signal: params.signal,
        ttlMs: XAI_GROK_OAUTH_MODELS_CACHE_TTL_MS,
        auditContext: "xai-grok-oauth-model-discovery",
        cacheKeyParts: [
          PROVIDER_ID,
          "grok-oauth-model-rows",
          XAI_GROK_OAUTH_MODELS_ENDPOINT,
          params.discoveryApiKey,
        ],
      })
    )
      .map(buildXaiOauthModelFromLiveRow)
      .filter((model) => Boolean(model));
    if (models.length > 0)
      return {
        baseUrl: XAI_GROK_OAUTH_BASE_URL,
        api: "openai-responses",
        auth: "oauth",
        models,
      };
  } catch {}
  return buildXaiOAuthFallbackProvider();
}
//#endregion
export { buildLiveXaiProvider as n, buildXaiProvider as r, buildLiveXaiOAuthProvider as t };
