import { a as getCachedLiveProviderModelRows } from "./provider-catalog-live-runtime-C9z3vHtm.js";
//#region extensions/clawrouter/provider-catalog.ts
const CLAWROUTER_DEFAULT_BASE_URL = "https://clawrouter.openclaw.ai";
const PROVIDER_ID = "clawrouter";
const CATALOG_CACHE_TTL_MS = 6e4;
const ROUTE_METADATA_KEY = "clawrouterRoute";
const DEFAULT_CONTEXT_WINDOW = 2e5;
const DEFAULT_MAX_TOKENS = 32768;
const DEFAULT_COST = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
};
function readRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function readString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function readStringArray(value) {
  return Array.isArray(value) ? value.map(readString).filter((entry) => Boolean(entry)) : [];
}
function readNonNegativeNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : void 0;
}
function readPositiveSafeInteger(value) {
  return Number.isSafeInteger(value) && Number(value) > 0 ? Number(value) : void 0;
}
function readCatalogRows(body) {
  const providers = readRecord(body)?.providers;
  if (!Array.isArray(providers))
    throw new Error("ClawRouter catalog response must contain providers[]");
  return providers;
}
function parseCatalogRoute(value) {
  const row = readRecord(value);
  const path = readString(row?.path);
  const requestFormat = readString(row?.requestFormat);
  if (!path || !requestFormat) return;
  return {
    path,
    requestFormat,
    methods: readStringArray(row?.methods).map((method) => method.toUpperCase()),
  };
}
function parseCatalogPricing(value) {
  const row = readRecord(value);
  if (!row) return;
  return {
    inputMicrosPerMillion: readNonNegativeNumber(row.inputMicrosPerMillion),
    outputMicrosPerMillion: readNonNegativeNumber(row.outputMicrosPerMillion),
    cachedInputMicrosPerMillion: readNonNegativeNumber(row.cachedInputMicrosPerMillion),
    cacheWrite5mInputMicrosPerMillion: readNonNegativeNumber(row.cacheWrite5mInputMicrosPerMillion),
    cacheWrite1hInputMicrosPerMillion: readNonNegativeNumber(row.cacheWrite1hInputMicrosPerMillion),
    maxInputTokens: readPositiveSafeInteger(row.maxInputTokens),
    defaultMaxOutputTokens: readPositiveSafeInteger(row.defaultMaxOutputTokens),
  };
}
function parseCatalogModel(value) {
  const row = readRecord(value);
  const id = readString(row?.id);
  const upstream = readString(row?.upstream);
  if (!id || !upstream) return;
  return {
    id,
    upstream,
    capabilities: readStringArray(row?.capabilities),
    pricing: parseCatalogPricing(row?.pricing),
  };
}
function parseCatalogProvider(value) {
  const row = readRecord(value);
  const id = readString(row?.id);
  const nativeBaseUrl = readString(row?.nativeBaseUrl);
  if (!id || !nativeBaseUrl || !nativeBaseUrl.startsWith("/v1/native/")) return;
  return {
    id,
    displayName: readString(row?.displayName) ?? id,
    openaiCompatible: row?.openaiCompatible === true,
    nativeBaseUrl,
    routes: Array.isArray(row?.routes)
      ? row.routes.map(parseCatalogRoute).filter((route) => Boolean(route))
      : [],
    models: Array.isArray(row?.models)
      ? row.models.map(parseCatalogModel).filter((model) => Boolean(model))
      : [],
  };
}
function trimTrailingSlashes(value) {
  return value.replace(/\/+$/, "");
}
function normalizeClawRouterRootUrl(baseUrl) {
  const normalized = trimTrailingSlashes(baseUrl?.trim() || CLAWROUTER_DEFAULT_BASE_URL);
  return normalized.endsWith("/v1") ? normalized.slice(0, -3) : normalized;
}
function normalizeClawRouterApiBaseUrl(baseUrl) {
  return `${normalizeClawRouterRootUrl(baseUrl)}/v1`;
}
function supportsCapability(model, ...capabilities) {
  return capabilities.some((capability) => model.capabilities.includes(capability));
}
function findNativeRoute(provider, requestFormat) {
  return provider.routes.find(
    (route) => route.methods.includes("POST") && route.requestFormat === requestFormat,
  );
}
function googleNativeBaseUrl(rootUrl, provider, route) {
  const modelPathIndex = route.path.indexOf("/models/${model}");
  if (modelPathIndex <= 0) return;
  return `${rootUrl}${provider.nativeBaseUrl}${route.path.slice(0, modelPathIndex)}`;
}
function inferReasoning(providerId, modelId) {
  const id = `${providerId}/${modelId}`.toLowerCase();
  return /(?:claude-|gemini-|gpt-5|gpt-oss|deepseek-v|reasoner|glm-5|grok-4|minimax-m)/u.test(id);
}
function inferInput(providerId, modelId) {
  const id = `${providerId}/${modelId}`.toLowerCase();
  return /(?:claude-|gemini-|gpt-4o|gpt-5)/u.test(id) ? ["text", "image"] : ["text"];
}
function microsPerMillionToCost(value) {
  return value === void 0 ? 0 : value / 1e6;
}
function modelCost(pricing) {
  if (!pricing) return DEFAULT_COST;
  return {
    input: microsPerMillionToCost(pricing.inputMicrosPerMillion),
    output: microsPerMillionToCost(pricing.outputMicrosPerMillion),
    cacheRead: microsPerMillionToCost(pricing.cachedInputMicrosPerMillion),
    cacheWrite: microsPerMillionToCost(
      pricing.cacheWrite5mInputMicrosPerMillion ?? pricing.cacheWrite1hInputMicrosPerMillion,
    ),
  };
}
function buildRoutedModel(rootUrl, provider, model) {
  let api;
  let baseUrl;
  let upstreamModel;
  if (provider.openaiCompatible && supportsCapability(model, "llm.responses")) {
    api = "openai-responses";
    baseUrl = `${rootUrl}/v1`;
  } else if (provider.openaiCompatible && supportsCapability(model, "llm.chat")) {
    api = "openai-completions";
    baseUrl = `${rootUrl}/v1`;
  } else if (
    supportsCapability(model, "llm.messages") &&
    findNativeRoute(provider, "anthropic.messages")
  ) {
    api = "anthropic-messages";
    baseUrl = `${rootUrl}${provider.nativeBaseUrl}`;
    upstreamModel = model.upstream;
  } else {
    const googleRoute =
      supportsCapability(model, "llm.stream") &&
      provider.routes.find(
        (route) =>
          route.methods.includes("POST") &&
          route.requestFormat === "google.generate_content" &&
          route.path.includes(":streamGenerateContent"),
      );
    const googleBaseUrl = googleRoute
      ? googleNativeBaseUrl(rootUrl, provider, googleRoute)
      : void 0;
    if (!googleBaseUrl) return;
    api = "google-generative-ai";
    baseUrl = googleBaseUrl;
    upstreamModel = model.upstream;
  }
  return {
    id: model.id,
    name: `${provider.displayName} · ${model.id}`,
    api,
    baseUrl,
    reasoning: inferReasoning(provider.id, model.id),
    input: inferInput(provider.id, model.id),
    cost: modelCost(model.pricing),
    contextWindow: model.pricing?.maxInputTokens ?? DEFAULT_CONTEXT_WINDOW,
    maxTokens: model.pricing?.defaultMaxOutputTokens ?? DEFAULT_MAX_TOKENS,
    params: {
      [ROUTE_METADATA_KEY]: {
        api,
        baseUrl,
        ...(upstreamModel ? { upstreamModel } : {}),
      },
    },
  };
}
function buildDiscoveredModels(rootUrl, providers) {
  const models = /* @__PURE__ */ new Map();
  for (const provider of providers)
    for (const model of provider.models) {
      const routed = buildRoutedModel(rootUrl, provider, model);
      if (!routed || models.has(routed.id)) continue;
      models.set(routed.id, routed);
    }
  return [...models.values()].toSorted((left, right) => left.id.localeCompare(right.id));
}
async function buildClawRouterProviderConfig(params) {
  const rootUrl = normalizeClawRouterRootUrl(params.baseUrl);
  const providers = (
    await getCachedLiveProviderModelRows({
      providerId: PROVIDER_ID,
      endpoint: `${rootUrl}/v1/catalog`,
      apiKey: params.apiKey,
      discoveryApiKey: params.discoveryApiKey,
      fetchGuard: params.fetchGuard,
      readRows: readCatalogRows,
      ttlMs: CATALOG_CACHE_TTL_MS,
      shouldCacheRows: (providers) => providers.length > 0,
      auditContext: "clawrouter-model-discovery",
    })
  )
    .map(parseCatalogProvider)
    .filter((provider) => Boolean(provider));
  return {
    baseUrl: `${rootUrl}/v1`,
    api: "openai-responses",
    apiKey: params.apiKey,
    models: buildDiscoveredModels(rootUrl, providers),
  };
}
function readRouteMetadata(params) {
  const row = readRecord(params?.[ROUTE_METADATA_KEY]);
  const baseUrl = readString(row?.baseUrl);
  const api = readString(row?.api);
  if (
    !baseUrl ||
    (api !== "openai-responses" &&
      api !== "openai-completions" &&
      api !== "anthropic-messages" &&
      api !== "google-generative-ai")
  )
    return;
  const upstreamModel = readString(row?.upstreamModel);
  return {
    api,
    baseUrl,
    ...(upstreamModel ? { upstreamModel } : {}),
  };
}
function stripRouteMetadata(params) {
  if (!params || !(ROUTE_METADATA_KEY in params)) return params;
  const { [ROUTE_METADATA_KEY]: _routeMetadata, ...remaining } = params;
  return Object.keys(remaining).length > 0 ? remaining : void 0;
}
function normalizeClawRouterResolvedModel(model) {
  const route = readRouteMetadata(model.params);
  if (!route) return;
  return {
    ...model,
    api: route.api,
    baseUrl: route.baseUrl,
  };
}
function prepareClawRouterRequestModel(model) {
  const route = readRouteMetadata(model.params);
  if (!route) return model;
  return {
    ...model,
    params: stripRouteMetadata(model.params),
    ...(route.upstreamModel && route.upstreamModel !== model.id ? { id: route.upstreamModel } : {}),
  };
}
//#endregion
export {
  prepareClawRouterRequestModel as a,
  normalizeClawRouterRootUrl as i,
  normalizeClawRouterApiBaseUrl as n,
  normalizeClawRouterResolvedModel as r,
  buildClawRouterProviderConfig as t,
};
