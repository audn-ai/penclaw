import {
  a as normalizeGoogleApiBaseUrl,
  n as isGoogleGenerativeAiApi,
  o as normalizeGoogleGenerativeAiBaseUrl,
  r as isGoogleVertexBaseUrl,
} from "./google-api-base-url-B0vh8Owj.js";
import {
  n as normalizeGoogleModelId,
  t as normalizeAntigravityModelId,
} from "./model-id-CAmKILzd.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import {
  g as isGoogleGemini3ThinkingLevelModel,
  h as isGoogleGemini3ProModel,
} from "./provider-stream-shared-CMy-5I0G.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import "./thinking-api-BWA2Qah2.js";
//#region extensions/google/provider-policy.ts
const GOOGLE_MODEL_ID_PROVIDERS = /* @__PURE__ */ new Set([
  "google",
  "google-gemini-cli",
  "google-vertex",
]);
function resolveGoogleGenerativeAiTransport(params) {
  const api =
    params.api ??
    (params.provider === "google-vertex" && isGoogleVertexBaseUrl(params.baseUrl)
      ? "google-vertex"
      : void 0) ??
    (params.provider === "google" && params.baseUrl ? "google-generative-ai" : params.api);
  return {
    api,
    baseUrl: isGoogleGenerativeAiApi(api)
      ? normalizeGoogleGenerativeAiBaseUrl(params.baseUrl)
      : params.baseUrl,
  };
}
function resolveGoogleGenerativeAiApiOrigin(baseUrl) {
  return (
    normalizeGoogleGenerativeAiBaseUrl(baseUrl) ?? normalizeGoogleApiBaseUrl(baseUrl)
  ).replace(/\/v1beta$/i, "");
}
function shouldNormalizeGoogleGenerativeAiProviderConfig(providerKey, provider) {
  if (providerKey === "google-vertex" && isGoogleVertexBaseUrl(provider.baseUrl)) return false;
  if (isGoogleGenerativeAiApi(provider.api)) return true;
  if (provider.models?.some((model) => isGoogleGenerativeAiApi(model?.api)) ?? false) return true;
  if (providerKey !== "google" && providerKey !== "google-vertex") return false;
  return !(normalizeOptionalString(provider.api) !== void 0);
}
function shouldNormalizeGoogleProviderConfig(providerKey, provider) {
  return (
    providerKey === "google-antigravity" ||
    shouldNormalizeGoogleGenerativeAiProviderConfig(providerKey, provider)
  );
}
function normalizeProviderModels(provider, normalizeId) {
  const models = provider.models;
  if (!Array.isArray(models) || models.length === 0) return provider;
  let mutated = false;
  const nextModels = models.map((model) => {
    const nextId = normalizeId(model.id);
    if (nextId === model.id) return model;
    mutated = true;
    return Object.assign({}, model, { id: nextId });
  });
  return mutated
    ? {
        ...provider,
        models: nextModels,
      }
    : provider;
}
function normalizeGoogleProviderConfig(providerKey, provider) {
  let nextProvider = provider;
  if (GOOGLE_MODEL_ID_PROVIDERS.has(providerKey)) {
    const modelNormalized = normalizeProviderModels(nextProvider, normalizeGoogleModelId);
    if (shouldNormalizeGoogleGenerativeAiProviderConfig(providerKey, modelNormalized)) {
      const normalizedBaseUrl = normalizeGoogleGenerativeAiBaseUrl(modelNormalized.baseUrl);
      nextProvider =
        normalizedBaseUrl !== modelNormalized.baseUrl
          ? {
              ...modelNormalized,
              baseUrl: normalizedBaseUrl ?? modelNormalized.baseUrl,
            }
          : modelNormalized;
    } else nextProvider = modelNormalized;
  }
  if (providerKey === "google-antigravity")
    nextProvider = normalizeProviderModels(nextProvider, normalizeAntigravityModelId);
  return nextProvider;
}
function resolveGoogleThinkingProfile({ modelId, reasoning }) {
  const normalizedModelId = normalizeGoogleModelId(modelId);
  const isGemini3ThinkingModel = isGoogleGemini3ThinkingLevelModel(normalizedModelId);
  if (reasoning === false && !isGemini3ThinkingModel) return;
  return {
    levels: isGoogleGemini3ProModel(normalizedModelId)
      ? [{ id: "off" }, { id: "low" }, { id: "adaptive" }, { id: "high" }]
      : [
          { id: "off" },
          { id: "minimal" },
          { id: "low" },
          { id: "medium" },
          { id: "adaptive" },
          { id: "high" },
        ],
    ...(isGemini3ThinkingModel ? { preserveWhenCatalogReasoningFalse: true } : {}),
  };
}
//#endregion
export {
  shouldNormalizeGoogleGenerativeAiProviderConfig as a,
  resolveGoogleThinkingProfile as i,
  resolveGoogleGenerativeAiApiOrigin as n,
  shouldNormalizeGoogleProviderConfig as o,
  resolveGoogleGenerativeAiTransport as r,
  normalizeGoogleProviderConfig as t,
};
