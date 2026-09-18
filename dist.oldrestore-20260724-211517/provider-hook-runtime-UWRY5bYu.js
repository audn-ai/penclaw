import { n as getLoadedRuntimePluginRegistry } from "./active-runtime-registry-BeyJcjvw.js";
import { p as resolvePluginControlPlaneFingerprint } from "./current-plugin-metadata-snapshot-DGhQ40qh.js";
import { v as resolveProviderConfigApiOwnerHint } from "./gateway-startup-plugin-ids-C7oHc3ol.js";
import {
  i as resolveConfigScopedRuntimeCacheValue,
  t as PluginLruCache,
} from "./plugin-cache-primitives-BaxqicKH.js";
import {
  n as findNormalizedProviderValue,
  r as normalizeProviderId,
} from "./provider-id-BIcU_2-A.js";
import {
  n as resolvePluginProviders,
  t as isPluginProvidersLoadInFlight,
} from "./providers.runtime-Cmp9Ggnk.js";
import {
  n as getPluginRegistryState,
  t as getActivePluginRegistryWorkspaceDirFromState,
} from "./runtime-state-Bd0YsvqM.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { f as normalizeUniqueSingleOrTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
//#region src/agents/model-catalog-scope.ts
/**
 * Resolves model catalog scope from config and discovery options.
 */
function providerFromModelRef(value) {
  const trimmed = value?.trim();
  if (!trimmed) return;
  const slash = trimmed.indexOf("/");
  if (slash <= 0) return;
  return normalizeProviderId(trimmed.slice(0, slash)) || void 0;
}
function providerConfigDeclaresModel(providerConfig, model) {
  const trimmedModel = model.trim();
  return Boolean(
    trimmedModel &&
    providerConfig?.models?.some((candidate) => candidate.id?.trim() === trimmedModel),
  );
}
/** Resolves provider/model refs used to scope model catalog discovery. */
function resolveModelCatalogScope(params) {
  const provider = params.provider.trim();
  const model = params.model.trim();
  const providerConfig = findNormalizedProviderValue(params.cfg?.models?.providers, provider);
  const modelRefs = providerConfigDeclaresModel(providerConfig, model)
    ? [provider && model ? `${provider}/${model}` : model]
    : [provider && model ? `${provider}/${model}` : model, model];
  return {
    providerRefs: normalizeUniqueSingleOrTrimmedStringList([provider, providerConfig?.api]),
    modelRefs: normalizeUniqueSingleOrTrimmedStringList(modelRefs),
  };
}
/** Extracts provider ids from resolved catalog scope refs for discovery calls. */
function resolveProviderDiscoveryProviderIdsForCatalogScope(params) {
  const providerIds = normalizeUniqueSingleOrTrimmedStringList([
    ...(params.providerRefs ?? []),
    ...(params.modelRefs ?? []).map(providerFromModelRef),
  ]);
  return providerIds.length > 0 ? providerIds : void 0;
}
//#endregion
//#region src/plugins/provider-hook-runtime.ts
let providerRuntimePluginCache = /* @__PURE__ */ new WeakMap();
const defaultProviderRuntimePluginCache = new PluginLruCache(128);
const PREPARED_PROVIDER_RUNTIME_SURFACES = ["channel"];
function clearProviderRuntimePluginCacheForTest() {
  providerRuntimePluginCache = /* @__PURE__ */ new WeakMap();
  defaultProviderRuntimePluginCache.clear();
}
function matchesProviderId(provider, providerId) {
  const normalized = normalizeProviderId(providerId);
  if (!normalized) return false;
  if (normalizeProviderId(provider.id) === normalized) return true;
  return [...(provider.aliases ?? []), ...(provider.hookAliases ?? [])].some(
    (alias) => normalizeProviderId(alias) === normalized,
  );
}
function resolveProviderRuntimePluginCacheKey(params, registryState = getPluginRegistryState()) {
  return JSON.stringify({
    provider: normalizeLowercaseStringOrEmpty(params.provider),
    modelId: resolveProviderRuntimeLookupModelId(params) ?? null,
    pluginControlPlane: resolvePluginControlPlaneFingerprint({
      config: params.config,
      env: params.env,
      workspaceDir: params.workspaceDir,
    }),
    plugins: params.config?.plugins,
    models: params.config?.models?.providers,
    workspaceDir: params.workspaceDir ?? "",
    applyAutoEnable: params.applyAutoEnable ?? null,
    bundledProviderVitestCompat: params.bundledProviderVitestCompat ?? null,
    pluginMetadata:
      params.pluginMetadataSnapshot?.manifestRegistry.plugins
        .map((plugin) => plugin.id)
        .join(",") ?? null,
    pluginRegistryKey: registryState?.key ?? null,
    pluginRegistryVersion: registryState?.activeVersion ?? null,
  });
}
function matchesProviderLiteralId(provider, providerId) {
  const normalized = normalizeLowercaseStringOrEmpty(providerId);
  return Boolean(normalized) && normalizeLowercaseStringOrEmpty(provider.id) === normalized;
}
function resolveProviderRuntimeLookupModelId(params) {
  return normalizeOptionalString(
    params.modelId ??
      (typeof params.context?.modelId === "string" ? params.context.modelId : void 0),
  );
}
function resolveProviderRuntimeLookupScope(params, apiOwnerHint) {
  const providerRefs = apiOwnerHint ? [params.provider, apiOwnerHint] : [params.provider];
  const modelId = resolveProviderRuntimeLookupModelId(params);
  if (!modelId) return { providerRefs };
  return {
    providerRefs,
    modelRefs: resolveModelCatalogScope({
      cfg: params.config,
      provider: params.provider,
      model: modelId,
    }).modelRefs,
  };
}
function findProviderRuntimePluginInLoadedRegistries(params) {
  const activeRegistry = getLoadedRuntimePluginRegistry({
    env: params.lookup.env,
    workspaceDir: params.lookup.workspaceDir,
  });
  const activePlugin = activeRegistry
    ? findProviderRuntimePluginInRegistry({
        registry: activeRegistry,
        provider: params.lookup.provider,
        apiOwnerHint: params.apiOwnerHint,
      })
    : void 0;
  if (activePlugin) return activePlugin;
  for (const surface of PREPARED_PROVIDER_RUNTIME_SURFACES) {
    const registry = getLoadedRuntimePluginRegistry({
      env: params.lookup.env,
      workspaceDir: params.lookup.workspaceDir,
      surface,
    });
    const plugin = registry
      ? findProviderRuntimePluginInRegistry({
          registry,
          provider: params.lookup.provider,
          apiOwnerHint: params.apiOwnerHint,
        })
      : void 0;
    if (plugin) return plugin;
  }
}
function findProviderRuntimePluginInRegistry(params) {
  return params.registry.providers
    .map((entry) => Object.assign({}, entry.provider, { pluginId: entry.pluginId }))
    .find((plugin) => {
      if (params.apiOwnerHint)
        return (
          matchesProviderLiteralId(plugin, params.provider) ||
          matchesProviderId(plugin, params.apiOwnerHint)
        );
      return matchesProviderId(plugin, params.provider);
    });
}
function hasConfiguredModelProvider(params) {
  return findNormalizedProviderValue(params.config?.models?.providers, params.provider) !== void 0;
}
function resolveProviderPluginsForHooks(params) {
  const env = params.env ?? process.env;
  const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDirFromState();
  return resolvePluginProviders({
    ...params,
    workspaceDir,
    env,
    activate: false,
    applyAutoEnable: params.applyAutoEnable,
    bundledProviderVitestCompat: params.bundledProviderVitestCompat ?? true,
    skipIfLoadInFlight: true,
  });
}
function resolveProviderRuntimePlugin(params) {
  const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDirFromState();
  const env = params.env ?? process.env;
  const lookup = {
    ...params,
    workspaceDir,
    env,
  };
  const apiOwnerHint = resolveProviderConfigApiOwnerHint({
    provider: params.provider,
    config: params.config,
  });
  const providerRefs = apiOwnerHint ? [params.provider, apiOwnerHint] : [params.provider];
  const loadedPlugin = findProviderRuntimePluginInLoadedRegistries({
    lookup,
    apiOwnerHint,
  });
  if (loadedPlugin) return loadedPlugin;
  if (
    isPluginProvidersLoadInFlight({
      ...params,
      workspaceDir,
      env,
      providerRefs,
      activate: false,
      applyAutoEnable: params.applyAutoEnable,
      bundledProviderVitestCompat: params.bundledProviderVitestCompat ?? true,
    })
  )
    return;
  const cacheConfig = params.env && params.env !== process.env ? void 0 : params.config;
  const registryState = getPluginRegistryState();
  const cacheKey = resolveProviderRuntimePluginCacheKey(lookup, registryState);
  const load = () => {
    const lookupScope = resolveProviderRuntimeLookupScope(params, apiOwnerHint);
    return (
      resolveProviderPluginsForHooks({
        config: params.config,
        workspaceDir,
        env,
        providerRefs: lookupScope.providerRefs,
        modelRefs: lookupScope.modelRefs,
        applyAutoEnable: params.applyAutoEnable,
        bundledProviderVitestCompat: params.bundledProviderVitestCompat,
        pluginMetadataSnapshot: params.pluginMetadataSnapshot,
      }).find((plugin) => {
        if (apiOwnerHint)
          return (
            matchesProviderLiteralId(plugin, params.provider) ||
            matchesProviderId(plugin, apiOwnerHint)
          );
        return matchesProviderId(plugin, params.provider);
      }) ?? null
    );
  };
  return (
    (cacheConfig
      ? resolveConfigScopedRuntimeCacheValue({
          cache: providerRuntimePluginCache,
          config: cacheConfig,
          key: cacheKey,
          load,
        })
      : !registryState?.key
        ? load()
        : (() => {
            const cached = defaultProviderRuntimePluginCache.getResult(cacheKey);
            if (cached.hit) return cached.value;
            const loaded = load();
            defaultProviderRuntimePluginCache.set(cacheKey, loaded);
            return loaded;
          })()) ?? void 0
  );
}
function resolveLoadedProviderRuntimePlugin(params) {
  return findProviderRuntimePluginInLoadedRegistries({
    lookup: params,
    apiOwnerHint: resolveProviderConfigApiOwnerHint({
      provider: params.provider,
      config: params.config,
    }),
  });
}
function resolveProviderHookPlugin(params) {
  const runtimePlugin = resolveProviderRuntimePlugin(params);
  if (runtimePlugin) return runtimePlugin;
  if (hasConfiguredModelProvider(params)) return;
  return resolveProviderPluginsForHooks({
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
  }).find((candidate) => matchesProviderId(candidate, params.provider));
}
function resolveProviderRuntimePluginHandle(params) {
  const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDirFromState();
  const env = params.env;
  const runtimePlugin = resolveProviderRuntimePlugin({
    ...params,
    workspaceDir,
    env,
  });
  return {
    ...params,
    workspaceDir,
    env,
    plugin: runtimePlugin,
  };
}
function ensureProviderRuntimePluginHandle(params) {
  const modelId = resolveProviderRuntimeLookupModelId(params);
  if (
    !params.runtimeHandle ||
    (modelId && !params.runtimeHandle.plugin && params.runtimeHandle.modelId !== modelId)
  )
    return resolveProviderRuntimePluginHandle({
      provider: params.provider,
      modelId,
      config: params.config ?? params.runtimeHandle?.config,
      workspaceDir: params.workspaceDir ?? params.runtimeHandle?.workspaceDir,
      env: params.env ?? params.runtimeHandle?.env,
      applyAutoEnable: params.runtimeHandle?.applyAutoEnable,
      bundledProviderVitestCompat: params.runtimeHandle?.bundledProviderVitestCompat,
      pluginMetadataSnapshot:
        params.pluginMetadataSnapshot ?? params.runtimeHandle?.pluginMetadataSnapshot,
    });
  return params.runtimeHandle;
}
function prepareProviderExtraParams(params) {
  return (
    ensureProviderRuntimePluginHandle(params).plugin?.prepareExtraParams?.(params.context) ?? void 0
  );
}
function resolveProviderExtraParamsForTransport(params) {
  return (
    ensureProviderRuntimePluginHandle(params).plugin?.extraParamsForTransport?.(params.context) ??
    void 0
  );
}
function resolveProviderAuthProfileId(params) {
  const resolved = ensureProviderRuntimePluginHandle(params).plugin?.resolveAuthProfileId?.(
    params.context,
  );
  return typeof resolved === "string" && resolved.trim() ? resolved.trim() : void 0;
}
function resolveProviderFollowupFallbackRoute(params) {
  return (
    ensureProviderRuntimePluginHandle(params).plugin?.followupFallbackRoute?.(params.context) ??
    void 0
  );
}
function wrapProviderStreamFn(params) {
  return ensureProviderRuntimePluginHandle(params).plugin?.wrapStreamFn?.(params.context) ?? void 0;
}
function wrapProviderSimpleCompletionStreamFn(params) {
  return (
    ensureProviderRuntimePluginHandle(params).plugin?.wrapSimpleCompletionStreamFn?.(
      params.context,
    ) ?? void 0
  );
}
//#endregion
export {
  resolveProviderAuthProfileId as a,
  resolveProviderHookPlugin as c,
  resolveProviderRuntimePluginHandle as d,
  wrapProviderSimpleCompletionStreamFn as f,
  resolveProviderDiscoveryProviderIdsForCatalogScope as h,
  resolveLoadedProviderRuntimePlugin as i,
  resolveProviderPluginsForHooks as l,
  resolveModelCatalogScope as m,
  ensureProviderRuntimePluginHandle as n,
  resolveProviderExtraParamsForTransport as o,
  wrapProviderStreamFn as p,
  prepareProviderExtraParams as r,
  resolveProviderFollowupFallbackRoute as s,
  clearProviderRuntimePluginCacheForTest as t,
  resolveProviderRuntimePlugin as u,
};
