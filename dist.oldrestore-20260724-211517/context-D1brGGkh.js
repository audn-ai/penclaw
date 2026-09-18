import {
  A as projectConfigOntoRuntimeSourceSnapshot,
  i as getRuntimeConfig,
} from "./io-B3ne6NxF.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { o as normalizeProviderId } from "./model-selection-normalize-BoKGJiBx.js";
import { l as resolveClaudeSonnet5ModelIdentity } from "./src-Dcc_hMY6.js";
import { n as computeBackoff } from "./src-Dqmh2693.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import "./config-BDv-QbJ6.js";
import "./model-selection-DOlkTrQa.js";
import "./backoff-Z63_cX9p.js";
//#region src/agents/context-cache.ts
/** Process-local model context window cache keyed by model id. */
const MODEL_CONTEXT_TOKEN_CACHE = /* @__PURE__ */ new Map();
const MODEL_CONFIGURED_CONTEXT_TOKEN_CACHE = /* @__PURE__ */ new Map();
const MODEL_CONTEXT_WINDOW_CACHE = /* @__PURE__ */ new Map();
const PROVIDER_CONTEXT_TOKEN_CACHE_PREFIX = "\0provider:";
/** Internal cache key for discovery metadata with verified provider ownership. */
function providerContextTokenCacheKey(provider, modelId) {
  return `${PROVIDER_CONTEXT_TOKEN_CACHE_PREFIX}${provider}\0${modelId}`;
}
/** Looks up cached context-token count for a model id. */
function lookupCachedContextTokens(modelId) {
  if (!modelId) return;
  return (
    MODEL_CONFIGURED_CONTEXT_TOKEN_CACHE.get(modelId) ?? MODEL_CONTEXT_TOKEN_CACHE.get(modelId)
  );
}
/** Looks up a configured native context window without treating it as an effective runtime cap. */
function lookupCachedContextWindow(modelId) {
  if (!modelId) return;
  return MODEL_CONTEXT_WINDOW_CACHE.get(modelId);
}
/** Returns the lowest positive context limit from independently sourced metadata. */
function minPositiveContextTokens(...values) {
  let result;
  for (const value of values) {
    if (typeof value !== "number" || value <= 0) continue;
    result = result === void 0 ? value : Math.min(result, value);
  }
  return result;
}
//#endregion
//#region src/agents/context-resolution.ts
const ANTHROPIC_GA_1M_MODEL_PREFIXES = [
  "claude-opus-4-8",
  "claude-opus-4.8",
  "claude-opus-4-6",
  "claude-opus-4.6",
  "claude-opus-4-7",
  "claude-opus-4.7",
  "claude-sonnet-4-6",
  "claude-sonnet-4.6",
];
const ANTHROPIC_CONTEXT_1M_TOKENS = 1048576;
const ANTHROPIC_VERTEX_CONTEXT_1M_TOKENS = 1e6;
const ANTHROPIC_FABLE_CONTEXT_TOKENS = 1e6;
const ANTHROPIC_MYTHOS_5_CONTEXT_TOKENS = 1e6;
const ANTHROPIC_SONNET_5_CONTEXT_TOKENS = 1e6;
function resolveProviderModelRef(params) {
  const modelRaw = params.model?.trim();
  if (!modelRaw) return;
  const providerRaw = params.provider?.trim();
  if (providerRaw) {
    const provider = normalizeProviderId(providerRaw);
    return provider
      ? {
          provider,
          model: modelRaw,
        }
      : void 0;
  }
  const slash = modelRaw.indexOf("/");
  if (slash <= 0) return;
  const provider = normalizeProviderId(modelRaw.slice(0, slash));
  const model = modelRaw.slice(slash + 1).trim();
  return provider && model
    ? {
        provider,
        model,
      }
    : void 0;
}
function resolveConfiguredProviderContextTokens(cfg, provider, model) {
  const providers = cfg?.models?.providers;
  if (!providers) return;
  function readProviderContextTokens(providerConfig) {
    if (typeof providerConfig?.contextTokens === "number" && providerConfig.contextTokens > 0)
      return {
        value: providerConfig.contextTokens,
        source: "contextTokens",
      };
    if (typeof providerConfig?.contextWindow === "number" && providerConfig.contextWindow > 0)
      return {
        value: providerConfig.contextWindow,
        source: "contextWindow",
      };
  }
  function findContextTokens(matchProviderId) {
    for (const [providerId, providerConfig] of Object.entries(providers)) {
      if (!matchProviderId(providerId)) continue;
      if (Array.isArray(providerConfig?.models))
        for (const entry of providerConfig.models) {
          const entryId = typeof entry?.id === "string" ? entry.id : "";
          const slash = entryId.indexOf("/");
          const prefixedProvider = slash > 0 ? normalizeProviderId(entryId.slice(0, slash)) : "";
          const bareEntryId = slash > 0 ? entryId.slice(slash + 1).trim() : "";
          const modelMatches =
            entryId === model ||
            (prefixedProvider === normalizeProviderId(providerId) && bareEntryId === model);
          if (modelMatches && typeof entry.contextTokens === "number" && entry.contextTokens > 0)
            return {
              value: entry.contextTokens,
              source: "contextTokens",
            };
          if (modelMatches && typeof entry.contextWindow === "number" && entry.contextWindow > 0)
            return {
              value: entry.contextWindow,
              source: "contextWindow",
            };
        }
      const providerContextTokens = readProviderContextTokens(providerConfig);
      if (providerContextTokens) return providerContextTokens;
    }
  }
  const exactResult = findContextTokens(
    (id) => normalizeLowercaseStringOrEmpty(id) === normalizeLowercaseStringOrEmpty(provider),
  );
  if (exactResult !== void 0) return exactResult;
  const normalizedProvider = normalizeProviderId(provider);
  return findContextTokens((id) => normalizeProviderId(id) === normalizedProvider);
}
function resolveProviderQualifiedModel(provider, model) {
  const slash = model.indexOf("/");
  if (slash <= 0) return;
  const prefixedProvider = normalizeProviderId(model.slice(0, slash));
  const bareModel = model.slice(slash + 1).trim();
  return prefixedProvider === normalizeProviderId(provider) && bareModel ? bareModel : void 0;
}
function resolveConfiguredRuntimeContextTokens(cfg, provider, modelProvider, model) {
  const explicitResult = resolveConfiguredProviderContextTokens(cfg, provider, model);
  if (explicitResult) return explicitResult;
  const canonicalProvider = modelProvider?.trim();
  if (
    !canonicalProvider ||
    normalizeProviderId(canonicalProvider) === normalizeProviderId(provider)
  )
    return;
  const canonicalResult = resolveConfiguredProviderContextTokens(cfg, canonicalProvider, model);
  if (canonicalResult) return canonicalResult;
  const canonicalModel = resolveProviderQualifiedModel(canonicalProvider, model);
  return canonicalModel
    ? resolveConfiguredProviderContextTokens(cfg, canonicalProvider, canonicalModel)
    : void 0;
}
function resolveModelFamilyId(modelId) {
  const normalized = normalizeLowercaseStringOrEmpty(modelId);
  return normalized.includes("/") ? (normalized.split("/").at(-1) ?? normalized) : normalized;
}
function resolveAnthropicFixedContextWindow(provider, model) {
  const modelId = resolveModelFamilyId(model);
  if (!(provider === "anthropic" || provider === "anthropic-vertex" || provider === "claude-cli"))
    return;
  if (
    (provider === "anthropic" || provider === "anthropic-vertex") &&
    /^claude-fable-5(?=$|[^a-z0-9])/.test(modelId)
  )
    return ANTHROPIC_FABLE_CONTEXT_TOKENS;
  if (
    (provider === "anthropic" || provider === "anthropic-vertex") &&
    /^claude-mythos-5(?=$|[^a-z0-9])/.test(modelId)
  )
    return ANTHROPIC_MYTHOS_5_CONTEXT_TOKENS;
  if (resolveClaudeSonnet5ModelIdentity({ id: modelId })) return ANTHROPIC_SONNET_5_CONTEXT_TOKENS;
  if (!ANTHROPIC_GA_1M_MODEL_PREFIXES.some((prefix) => modelId.startsWith(prefix))) return;
  return provider === "anthropic-vertex"
    ? ANTHROPIC_VERTEX_CONTEXT_1M_TOKENS
    : ANTHROPIC_CONTEXT_1M_TOKENS;
}
function resolveContextTokensForModelFromCache(
  params,
  lookupContextTokens = lookupCachedContextTokens,
  lookupContextWindow = lookupCachedContextWindow,
) {
  const ref = resolveProviderModelRef(params);
  const override =
    typeof params.contextTokensOverride === "number" && params.contextTokensOverride > 0
      ? params.contextTokensOverride
      : void 0;
  const capOverride = (contextTokens) =>
    override !== void 0 ? Math.min(override, contextTokens) : contextTokens;
  const explicitProvider = params.provider?.trim();
  if (ref && explicitProvider) {
    const configuredWindow = resolveConfiguredRuntimeContextTokens(
      params.cfg,
      explicitProvider,
      params.modelProvider,
      ref.model,
    );
    const sourceConfiguredWindow = resolveConfiguredRuntimeContextTokens(
      params.sourceCfg === void 0 ? params.cfg : params.sourceCfg,
      explicitProvider,
      params.modelProvider,
      ref.model,
    );
    const fixedContextWindow = resolveAnthropicFixedContextWindow(ref.provider, ref.model);
    const providerResult = lookupContextTokens(
      providerContextTokenCacheKey(normalizeProviderId(ref.provider), ref.model),
    );
    const providerWindow = lookupContextWindow(
      providerContextTokenCacheKey(normalizeProviderId(ref.provider), ref.model),
    );
    const modelContextTokens =
      typeof params.modelContextTokens === "number" && params.modelContextTokens > 0
        ? params.modelContextTokens
        : void 0;
    const modelContextWindow =
      typeof params.modelContextWindow === "number" && params.modelContextWindow > 0
        ? params.modelContextWindow
        : void 0;
    const runtimeCap = minPositiveContextTokens(
      providerResult,
      modelContextTokens,
      fixedContextWindow === void 0 ? providerWindow : void 0,
      fixedContextWindow === void 0 ? modelContextWindow : void 0,
    );
    if (configuredWindow) {
      if (configuredWindow.source === "contextTokens")
        return capOverride(
          fixedContextWindow === void 0
            ? configuredWindow.value
            : Math.min(configuredWindow.value, fixedContextWindow),
        );
      const authoredContextWindow =
        sourceConfiguredWindow?.source === "contextWindow" ? sourceConfiguredWindow.value : void 0;
      if (fixedContextWindow !== void 0 && authoredContextWindow === void 0)
        return capOverride(
          runtimeCap === void 0 ? fixedContextWindow : Math.min(runtimeCap, fixedContextWindow),
        );
      if (fixedContextWindow !== void 0) {
        const effectiveCap = minPositiveContextTokens(
          authoredContextWindow,
          fixedContextWindow,
          runtimeCap,
        );
        return effectiveCap === void 0 ? void 0 : capOverride(effectiveCap);
      }
      if (runtimeCap !== void 0) return capOverride(Math.min(configuredWindow.value, runtimeCap));
      return capOverride(configuredWindow.value);
    }
    if (runtimeCap !== void 0)
      return capOverride(
        fixedContextWindow === void 0 ? runtimeCap : Math.min(runtimeCap, fixedContextWindow),
      );
    if (fixedContextWindow !== void 0) return capOverride(fixedContextWindow);
  }
  if (params.allowUnscopedModelLookup === false) return override ?? params.fallbackContextTokens;
  const bareCap = minPositiveContextTokens(
    lookupContextTokens(params.model),
    lookupContextWindow(params.model),
  );
  if (bareCap !== void 0)
    return Boolean(explicitProvider && ref?.model.includes("/")) && override !== void 0
      ? override
      : capOverride(bareCap);
  return override ?? params.fallbackContextTokens;
}
//#endregion
//#region src/agents/context-runtime-state.ts
const CONTEXT_WINDOW_RUNTIME_STATE_KEY = Symbol.for("openclaw.contextWindowRuntimeState");
/** Shared mutable state for context-window resolution and model discovery. */
const CONTEXT_WINDOW_RUNTIME_STATE = (() => {
  const globalState = globalThis;
  let state = globalState[CONTEXT_WINDOW_RUNTIME_STATE_KEY];
  if (!state) {
    state = {
      generation: 0,
      loadPromise: null,
      loadGeneration: null,
      configuredConfig: void 0,
      configLoadFailures: 0,
      nextConfigLoadAttemptAtMs: 0,
      modelsConfigRuntimeLoader: createLazyImportLoader(
        () => import("./agents/models-config.runtime.js"),
      ),
    };
    globalState[CONTEXT_WINDOW_RUNTIME_STATE_KEY] = state;
  } else {
    if (typeof state.generation !== "number") state.generation = 0;
    if (state.loadGeneration === void 0) state.loadGeneration = null;
    state.modelsConfigRuntimeLoader ??= createLazyImportLoader(
      () => import("./agents/models-config.runtime.js"),
    );
  }
  return state;
})();
/** Invalidate prepared context metadata while a replacement load is staged. */
function beginContextWindowCacheRefresh() {
  CONTEXT_WINDOW_RUNTIME_STATE.generation += 1;
  CONTEXT_WINDOW_RUNTIME_STATE.configuredConfig = void 0;
  CONTEXT_WINDOW_RUNTIME_STATE.configLoadFailures = 0;
  CONTEXT_WINDOW_RUNTIME_STATE.nextConfigLoadAttemptAtMs = 0;
}
/** Reset prepared context-window state after model config or plugin metadata changes. */
function resetContextWindowCache() {
  beginContextWindowCacheRefresh();
  CONTEXT_WINDOW_RUNTIME_STATE.modelsConfigRuntimeLoader.clear();
  MODEL_CONFIGURED_CONTEXT_TOKEN_CACHE.clear();
  MODEL_CONTEXT_TOKEN_CACHE.clear();
  MODEL_CONTEXT_WINDOW_CACHE.clear();
}
/** Reset context-window runtime state and token cache for isolated tests. */
function resetContextWindowCacheForTest() {
  resetContextWindowCache();
}
//#endregion
//#region src/agents/context.ts
const CONFIG_LOAD_RETRY_POLICY = {
  initialMs: 1e3,
  maxMs: 6e4,
  factor: 2,
  jitter: 0,
};
const loadModelCatalogRuntime = () => import("./agents/model-catalog.runtime.js");
const loadStaticModelCatalogRuntime = () => import("./model.static-catalog-kmjucSAR.js");
function applyDiscoveredContextWindows(params) {
  const cacheMinimum = (key, contextTokens) => {
    const existing = params.cache.get(key);
    if (existing === void 0 || contextTokens < existing) params.cache.set(key, contextTokens);
  };
  for (const model of params.models) {
    if (!model?.id) continue;
    const discoveredContextTokens =
      typeof model.contextTokens === "number"
        ? Math.trunc(model.contextTokens)
        : typeof model.contextWindow === "number"
          ? Math.trunc(model.contextWindow)
          : void 0;
    const contextTokens =
      resolveDiscoveredAnthropicFixedContextWindow(model) ?? discoveredContextTokens;
    if (!contextTokens || contextTokens <= 0) continue;
    cacheMinimum(model.id, contextTokens);
    if (typeof model.provider === "string") {
      const provider = normalizeProviderId(model.provider);
      if (provider) {
        cacheMinimum(providerContextTokenCacheKey(provider, model.id), contextTokens);
        const slash = model.id.indexOf("/");
        const prefixedProvider = slash > 0 ? normalizeProviderId(model.id.slice(0, slash)) : "";
        const bareModelId = slash > 0 ? model.id.slice(slash + 1).trim() : "";
        if (prefixedProvider === provider && bareModelId)
          cacheMinimum(providerContextTokenCacheKey(provider, bareModelId), contextTokens);
      }
    }
  }
}
function applyConfiguredContextWindows(params) {
  const providers = params.modelsConfig?.providers;
  if (!providers || typeof providers !== "object") return;
  for (const [providerId, provider] of Object.entries(providers)) {
    if (!Array.isArray(provider?.models)) continue;
    for (const model of provider.models) {
      const modelId = typeof model?.id === "string" ? model.id : void 0;
      const contextTokens =
        typeof model?.contextTokens === "number"
          ? model.contextTokens
          : typeof provider?.contextTokens === "number"
            ? provider.contextTokens
            : void 0;
      const contextWindow =
        typeof model?.contextWindow === "number"
          ? model.contextWindow
          : typeof provider?.contextWindow === "number"
            ? provider.contextWindow
            : void 0;
      const configuredValue =
        contextTokens && contextTokens > 0
          ? {
              cache: params.cache,
              value: contextTokens,
            }
          : contextWindow && contextWindow > 0
            ? {
                cache: params.windowCache,
                value: contextWindow,
              }
            : void 0;
      if (!modelId || !configuredValue) continue;
      configuredValue.cache.set(modelId, configuredValue.value);
      configuredValue.cache.set(
        providerContextTokenCacheKey(normalizeProviderId(providerId), modelId),
        configuredValue.value,
      );
      const normalizedProvider = normalizeProviderId(providerId);
      const slash = modelId.indexOf("/");
      const prefixedProvider = slash > 0 ? normalizeProviderId(modelId.slice(0, slash)) : "";
      const bareModelId = slash > 0 ? modelId.slice(slash + 1).trim() : "";
      if (normalizedProvider && prefixedProvider === normalizedProvider && bareModelId)
        configuredValue.cache.set(
          providerContextTokenCacheKey(normalizedProvider, bareModelId),
          configuredValue.value,
        );
    }
  }
}
function primeConfiguredContextWindowsFromConfig(cfg) {
  applyConfiguredContextWindows({
    cache: MODEL_CONFIGURED_CONTEXT_TOKEN_CACHE,
    windowCache: MODEL_CONTEXT_WINDOW_CACHE,
    modelsConfig: cfg.models,
  });
  CONTEXT_WINDOW_RUNTIME_STATE.configuredConfig = cfg;
  CONTEXT_WINDOW_RUNTIME_STATE.configLoadFailures = 0;
  CONTEXT_WINDOW_RUNTIME_STATE.nextConfigLoadAttemptAtMs = 0;
  return cfg;
}
function primeConfiguredContextWindows() {
  if (CONTEXT_WINDOW_RUNTIME_STATE.configuredConfig)
    return primeConfiguredContextWindowsFromConfig(CONTEXT_WINDOW_RUNTIME_STATE.configuredConfig);
  if (Date.now() < CONTEXT_WINDOW_RUNTIME_STATE.nextConfigLoadAttemptAtMs) return;
  try {
    return primeConfiguredContextWindowsFromConfig(getRuntimeConfig());
  } catch {
    CONTEXT_WINDOW_RUNTIME_STATE.configLoadFailures += 1;
    const backoffMs = computeBackoff(
      CONFIG_LOAD_RETRY_POLICY,
      CONTEXT_WINDOW_RUNTIME_STATE.configLoadFailures,
    );
    CONTEXT_WINDOW_RUNTIME_STATE.nextConfigLoadAttemptAtMs = Date.now() + backoffMs;
    return;
  }
}
function ensureContextWindowCacheLoaded(cfgOverride) {
  const generation = CONTEXT_WINDOW_RUNTIME_STATE.generation;
  if (
    CONTEXT_WINDOW_RUNTIME_STATE.loadPromise &&
    CONTEXT_WINDOW_RUNTIME_STATE.loadGeneration === generation
  )
    return CONTEXT_WINDOW_RUNTIME_STATE.loadPromise;
  const cfg = cfgOverride
    ? primeConfiguredContextWindowsFromConfig(cfgOverride)
    : primeConfiguredContextWindows();
  if (!cfg) return Promise.resolve();
  const stagedTokenCache = /* @__PURE__ */ new Map();
  CONTEXT_WINDOW_RUNTIME_STATE.loadPromise = Promise.resolve()
    .then(async () => {
      if (CONTEXT_WINDOW_RUNTIME_STATE.generation !== generation) return;
      try {
        const [{ loadModelCatalog }, { loadBundledProviderStaticCatalogContextModels }] =
          await Promise.all([loadModelCatalogRuntime(), loadStaticModelCatalogRuntime()]);
        const [modelsResult, providerStaticModelsResult] = await Promise.allSettled([
          loadModelCatalog({
            config: cfg,
            readOnly: true,
          }),
          loadBundledProviderStaticCatalogContextModels({ cfg }),
        ]);
        if (CONTEXT_WINDOW_RUNTIME_STATE.generation !== generation) return;
        const models = modelsResult.status === "fulfilled" ? modelsResult.value : [];
        const providerStaticModels =
          providerStaticModelsResult.status === "fulfilled" ? providerStaticModelsResult.value : [];
        applyDiscoveredContextWindows({
          cache: stagedTokenCache,
          models: [...models, ...providerStaticModels],
        });
      } catch {}
      if (CONTEXT_WINDOW_RUNTIME_STATE.generation !== generation) return;
      MODEL_CONTEXT_TOKEN_CACHE.clear();
      for (const [key, value] of stagedTokenCache) MODEL_CONTEXT_TOKEN_CACHE.set(key, value);
    })
    .catch(() => {});
  CONTEXT_WINDOW_RUNTIME_STATE.loadGeneration = generation;
  return CONTEXT_WINDOW_RUNTIME_STATE.loadPromise;
}
async function waitForContextWindowCacheLoad(options) {
  const promise = CONTEXT_WINDOW_RUNTIME_STATE.loadPromise;
  if (
    !promise ||
    CONTEXT_WINDOW_RUNTIME_STATE.loadGeneration !== CONTEXT_WINDOW_RUNTIME_STATE.generation
  )
    return "idle";
  const timeoutMs = Math.max(0, Math.trunc(options?.timeoutMs ?? 250));
  if (timeoutMs === 0) return "timeout";
  let timeoutHandle = null;
  try {
    return await Promise.race([
      promise.then(() => "loaded"),
      new Promise((resolve) => {
        timeoutHandle = setTimeout(() => resolve("timeout"), timeoutMs);
        timeoutHandle.unref?.();
      }),
    ]);
  } finally {
    if (timeoutHandle) clearTimeout(timeoutHandle);
  }
}
/** Replace cached model context metadata for the active runtime configuration. */
async function refreshContextWindowCache(cfg) {
  beginContextWindowCacheRefresh();
  MODEL_CONFIGURED_CONTEXT_TOKEN_CACHE.clear();
  MODEL_CONTEXT_WINDOW_CACHE.clear();
  primeConfiguredContextWindowsFromConfig(cfg);
  await ensureContextWindowCacheLoaded();
}
function prepareContextWindowCache(options) {
  if (options?.skipRuntimeConfigLoad) return;
  if (options?.allowAsyncLoad === false) primeConfiguredContextWindows();
  else ensureContextWindowCacheLoaded();
}
function lookupContextTokens(modelId, options) {
  if (!modelId) return;
  prepareContextWindowCache(options);
  return minPositiveContextTokens(
    lookupCachedContextTokens(modelId),
    lookupCachedContextWindow(modelId),
  );
}
function resolveDiscoveredAnthropicFixedContextWindow(model) {
  const provider =
    typeof model.provider === "string" ? normalizeProviderId(model.provider) : void 0;
  const modelId = model.id;
  if (provider) return resolveAnthropicFixedContextWindow(provider, modelId);
  const normalized = normalizeLowercaseStringOrEmpty(modelId);
  const slash = normalized.indexOf("/");
  if (slash < 0) return;
  const inferredProvider = normalizeProviderId(normalized.slice(0, slash));
  const inferredModel = normalized.slice(slash + 1);
  return inferredProvider === "claude-cli"
    ? resolveAnthropicFixedContextWindow(inferredProvider, inferredModel)
    : void 0;
}
function resolveContextTokensForModel(params) {
  prepareContextWindowCache({
    allowAsyncLoad: params.allowAsyncLoad,
    skipRuntimeConfigLoad: Boolean(params.cfg),
  });
  const sourceCfg =
    params.sourceCfg !== void 0
      ? params.sourceCfg
      : params.cfg
        ? projectConfigOntoRuntimeSourceSnapshot(params.cfg)
        : void 0;
  return resolveContextTokensForModelFromCache(
    {
      ...params,
      sourceCfg,
    },
    (modelId) => lookupCachedContextTokens(modelId),
    (modelId) => lookupCachedContextWindow(modelId),
  );
}
//#endregion
export {
  refreshContextWindowCache as a,
  resetContextWindowCacheForTest as c,
  ANTHROPIC_MYTHOS_5_CONTEXT_TOKENS as d,
  ANTHROPIC_SONNET_5_CONTEXT_TOKENS as f,
  lookupContextTokens as i,
  ANTHROPIC_CONTEXT_1M_TOKENS as l,
  resolveContextTokensForModelFromCache as m,
  applyDiscoveredContextWindows as n,
  resolveContextTokensForModel as o,
  ANTHROPIC_VERTEX_CONTEXT_1M_TOKENS as p,
  ensureContextWindowCacheLoaded as r,
  waitForContextWindowCacheLoad as s,
  applyConfiguredContextWindows as t,
  ANTHROPIC_FABLE_CONTEXT_TOKENS as u,
};
