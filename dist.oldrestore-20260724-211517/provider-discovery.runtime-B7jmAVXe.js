import path from "node:path";
import { s as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-3WxfNDRv.js";
import { t as planManifestModelCatalogRows } from "./manifest-planner-DSmSdykb.js";
import { i as withProfile } from "./plugin-load-profile-Dw-hJkNg.js";
import { n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-C3dWg4tn.js";
import {
  n as getCachedPluginModuleLoader,
  s as clearNativeRequireJavaScriptModuleCache,
  t as createPluginModuleLoaderCache,
} from "./plugin-module-loader-cache-CDpLvLFE.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import { a as resolveDiscoveredProviderPluginIds } from "./providers-D0H29WPB.js";
import { n as resolvePluginProviders } from "./providers.runtime-Cmp9Ggnk.js";
import { g as sortUniqueStrings } from "./string-normalization-CRyoFBPt.js";
//#region src/plugins/provider-discovery.runtime.ts
const providerDiscoveryModuleLoaders = createPluginModuleLoaderCache();
const providerDiscoveryModuleRoots = /* @__PURE__ */ new Map();
function resolveProviderDiscoveryDependencyRoot(rootDir) {
  const extensionsDir = path.dirname(rootDir);
  const distDir = path.dirname(extensionsDir);
  if (path.basename(extensionsDir) === "extensions" && path.basename(distDir) === "dist")
    return distDir;
  return rootDir;
}
function clearProviderDiscoveryModuleLoaders() {
  providerDiscoveryModuleLoaders.clear();
  for (const [modulePath, rootDir] of providerDiscoveryModuleRoots)
    clearNativeRequireJavaScriptModuleCache(modulePath, { dependencyRoot: rootDir });
  providerDiscoveryModuleRoots.clear();
}
registerPluginMetadataProcessMemoLifecycleClear(clearProviderDiscoveryModuleLoaders);
function normalizeDiscoveryModule(value) {
  const resolved =
    value && typeof value === "object" && "default" in value && value.default !== void 0
      ? value.default
      : value;
  if (Array.isArray(resolved)) return resolved;
  if (resolved && typeof resolved === "object" && "id" in resolved) return [resolved];
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const record = value;
    if (Array.isArray(record.providers)) return record.providers;
    if (record.provider) return [record.provider];
  }
  return [];
}
function loadProviderDiscoveryModule(params) {
  providerDiscoveryModuleRoots.set(
    params.modulePath,
    resolveProviderDiscoveryDependencyRoot(params.rootDir),
  );
  const moduleLoader = getCachedPluginModuleLoader({
    cache: providerDiscoveryModuleLoaders,
    modulePath: params.modulePath,
    importerUrl: import.meta.url,
    loaderFilename: import.meta.url,
    preferBuiltDist: true,
  });
  return withProfile(
    {
      pluginId: params.pluginId,
      source: params.modulePath,
    },
    "provider-discovery-entry",
    () => moduleLoader(params.modulePath),
  );
}
function hasLiveProviderDiscoveryHook(provider) {
  return (
    typeof provider.catalog?.run === "function" || typeof provider.discovery?.run === "function"
  );
}
function hasProviderCatalogHook(provider) {
  return (
    hasLiveProviderDiscoveryHook(provider) || typeof provider.staticCatalog?.run === "function"
  );
}
function hasProviderAuthEnvCredential(plugin, env) {
  return [
    ...(plugin.setup?.providers ?? []).flatMap((provider) => provider.envVars ?? []),
    ...Object.values(plugin.providerAuthEnvVars ?? {}).flat(),
  ].some((name) => {
    const value = env[name]?.trim();
    return value !== void 0 && value !== "";
  });
}
function modelDefinitionCostFromManifestRow(row) {
  if (
    !row.cost ||
    row.cost.input === void 0 ||
    row.cost.output === void 0 ||
    row.cost.cacheRead === void 0 ||
    row.cost.cacheWrite === void 0
  )
    return {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
    };
  return {
    input: row.cost.input,
    output: row.cost.output,
    cacheRead: row.cost.cacheRead,
    cacheWrite: row.cost.cacheWrite,
    ...(row.cost.tieredPricing ? { tieredPricing: row.cost.tieredPricing } : {}),
  };
}
function modelDefinitionFromManifestRow(row) {
  const cost = modelDefinitionCostFromManifestRow(row);
  if (!row.contextWindow || !row.maxTokens) return;
  const input = row.input.filter((value) => value === "text" || value === "image");
  return {
    id: row.id,
    name: row.name || row.id,
    ...(row.api ? { api: row.api } : {}),
    ...(row.baseUrl ? { baseUrl: row.baseUrl } : {}),
    reasoning: row.reasoning,
    input,
    cost,
    contextWindow: row.contextWindow,
    ...(row.contextTokens ? { contextTokens: row.contextTokens } : {}),
    maxTokens: row.maxTokens,
    ...(row.thinkingLevelMap ? { thinkingLevelMap: { ...row.thinkingLevelMap } } : {}),
    ...(row.headers ? { headers: row.headers } : {}),
    ...(row.compat ? { compat: row.compat } : {}),
    ...(row.mediaInput ? { mediaInput: row.mediaInput } : {}),
  };
}
function providerConfigFromManifestRows(rows) {
  const firstRow = rows[0];
  if (!firstRow?.baseUrl || !firstRow.api) return;
  const models = rows
    .map((row) => modelDefinitionFromManifestRow(row))
    .filter((model) => Boolean(model));
  if (models.length === 0) return;
  return {
    baseUrl: firstRow?.baseUrl ?? "",
    ...(firstRow?.api ? { api: firstRow.api } : {}),
    models,
  };
}
function resolveManifestModelCatalogProviders(pluginRecords) {
  const providers = [];
  for (const plugin of pluginRecords) {
    if (!plugin.modelCatalog?.providers) continue;
    const plan = planManifestModelCatalogRows({ registry: { plugins: [plugin] } });
    for (const entry of plan.entries) {
      if (
        entry.rows.length === 0 ||
        entry.discovery === "runtime" ||
        entry.discovery === "refreshable"
      )
        continue;
      const providerConfig = providerConfigFromManifestRows(entry.rows);
      if (!providerConfig) continue;
      providers.push({
        id: entry.provider,
        pluginId: plugin.id,
        label: entry.provider,
        auth: [],
        staticCatalog: {
          order: "simple",
          run: async () => ({ providers: { [entry.provider]: providerConfig } }),
        },
      });
    }
  }
  return providers;
}
function resolveRuntimeManifestCatalogPluginIds(pluginRecords) {
  const pluginIds = /* @__PURE__ */ new Set();
  for (const plugin of pluginRecords) {
    const ownedProviders = new Set(
      plugin.providers.map((provider) => normalizeProviderId(provider)),
    );
    if (
      Object.entries(plugin.modelCatalog?.discovery ?? {}).some(
        ([provider, discovery]) =>
          (discovery === "runtime" || discovery === "refreshable") &&
          ownedProviders.has(normalizeProviderId(provider)),
      )
    )
      pluginIds.add(plugin.id);
    if (!plugin.modelCatalog?.providers) continue;
    if (
      planManifestModelCatalogRows({ registry: { plugins: [plugin] } }).entries.some(
        (entry) => entry.discovery === "runtime" || entry.discovery === "refreshable",
      )
    )
      pluginIds.add(plugin.id);
  }
  return pluginIds;
}
function resolveProviderDiscoveryEntryPlugins(params) {
  const metadataSnapshot =
    params.pluginMetadataSnapshot ??
    loadManifestMetadataSnapshot({
      config: params.config ?? {},
      env: params.env ?? process.env,
      ...(params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}),
    });
  const registry = metadataSnapshot.index;
  const manifestRegistry = metadataSnapshot.manifestRegistry;
  const pluginIds = resolveDiscoveredProviderPluginIds({
    ...params,
    registry,
    manifestRegistry,
  });
  const pluginIdSet = new Set(pluginIds);
  const pluginRecords = manifestRegistry.plugins.filter((plugin) => pluginIdSet.has(plugin.id));
  const runtimeManifestCatalogPluginIds = resolveRuntimeManifestCatalogPluginIds(pluginRecords);
  const entryRecords = pluginRecords.filter((plugin) => plugin.providerDiscoverySource);
  const entryPluginIds = new Set(entryRecords.map((plugin) => plugin.id));
  const manifestProviders =
    params.includeManifestModelCatalogProviders === false
      ? []
      : resolveManifestModelCatalogProviders(pluginRecords);
  const manifestEntryPluginIds = /* @__PURE__ */ new Set();
  for (const pluginId of manifestProviders.map((provider) => provider.pluginId))
    if (pluginId) {
      manifestEntryPluginIds.add(pluginId);
      if (!runtimeManifestCatalogPluginIds.has(pluginId)) entryPluginIds.add(pluginId);
    }
  const complete = entryPluginIds.size === pluginIdSet.size;
  const entriesOnlyComplete =
    /* @__PURE__ */ new Set([...entryPluginIds, ...manifestEntryPluginIds]).size ===
    pluginIdSet.size;
  if (entryRecords.length === 0)
    return {
      providers: manifestProviders,
      complete,
      pluginRecords,
      entryPluginIds,
      manifestEntryPluginIds,
      runtimeManifestCatalogPluginIds,
    };
  if (
    params.requireCompleteDiscoveryEntryCoverage &&
    !(params.discoveryEntriesOnly === true ? entriesOnlyComplete : complete)
  )
    return {
      providers: [],
      complete: false,
      pluginRecords,
      entryPluginIds,
      manifestEntryPluginIds,
      runtimeManifestCatalogPluginIds,
    };
  const providers = [];
  for (const manifest of entryRecords)
    try {
      const moduleExport = loadProviderDiscoveryModule({
        pluginId: manifest.id,
        modulePath: manifest.providerDiscoverySource,
        rootDir: manifest.rootDir,
      });
      providers.push(
        ...normalizeDiscoveryModule(moduleExport).map((provider) =>
          Object.assign({}, provider, { pluginId: manifest.id }),
        ),
      );
    } catch {
      return {
        providers: manifestProviders,
        complete: false,
        pluginRecords,
        entryPluginIds,
        manifestEntryPluginIds,
        runtimeManifestCatalogPluginIds,
      };
    }
  return {
    providers: [...manifestProviders, ...providers],
    complete,
    pluginRecords,
    entryPluginIds,
    manifestEntryPluginIds,
    runtimeManifestCatalogPluginIds,
  };
}
function resolveSelectiveFullPluginIds(params) {
  const missingEntryCredentialPluginIds = params.entryResult.pluginRecords
    .filter((plugin) => !params.entryResult.entryPluginIds.has(plugin.id))
    .filter((plugin) => hasProviderAuthEnvCredential(plugin, params.env))
    .map((plugin) => plugin.id);
  const runtimeManifestCatalogPluginIds = listRuntimeManifestCatalogPluginIds(params.entryResult);
  return sortUniqueStrings([
    ...missingEntryCredentialPluginIds,
    ...runtimeManifestCatalogPluginIds,
  ]);
}
function listRuntimeManifestCatalogPluginIds(entryResult) {
  return [...entryResult.runtimeManifestCatalogPluginIds];
}
function resolveMissingEntryPluginIds(entryResult) {
  return entryResult.pluginRecords
    .filter((plugin) => !entryResult.entryPluginIds.has(plugin.id))
    .map((plugin) => plugin.id);
}
function resolveRuntimeEntryProviders(entryResult) {
  return entryResult.providers.filter((provider) => {
    if (hasLiveProviderDiscoveryHook(provider)) return true;
    return Boolean(
      provider.pluginId &&
      entryResult.entryPluginIds.has(provider.pluginId) &&
      typeof provider.staticCatalog?.run === "function",
    );
  });
}
function withoutFullLoadedPluginEntries(providers, pluginIds) {
  if (pluginIds.length === 0) return providers;
  const pluginIdSet = new Set(pluginIds);
  return providers.filter((provider) => !provider.pluginId || !pluginIdSet.has(provider.pluginId));
}
function resolvePluginDiscoveryProvidersRuntime(params) {
  const env = params.env ?? process.env;
  const bundledProviderVitestCompat = params.bundledProviderVitestCompat ?? env.VITEST === "true";
  const entryResult = resolveProviderDiscoveryEntryPlugins({
    ...params,
    env,
  });
  const entryProviders = entryResult.providers.filter(hasProviderCatalogHook);
  const runtimeEntryProviders = resolveRuntimeEntryProviders(entryResult);
  if (params.discoveryEntriesOnly === true) return entryProviders;
  if (
    entryResult.providers.length > 0 &&
    entryResult.complete &&
    runtimeEntryProviders.length === entryResult.providers.length &&
    entryResult.runtimeManifestCatalogPluginIds.size === 0
  )
    return runtimeEntryProviders;
  if (params.onlyPluginIds === void 0 && runtimeEntryProviders.length > 0) {
    const fullPluginIds = resolveSelectiveFullPluginIds({
      entryResult,
      env,
    });
    const fullProviders =
      fullPluginIds.length > 0
        ? resolvePluginProviders({
            ...params,
            env,
            bundledProviderVitestCompat,
            onlyPluginIds: fullPluginIds,
          })
        : [];
    return [
      ...withoutFullLoadedPluginEntries(runtimeEntryProviders, fullPluginIds),
      ...fullProviders,
    ];
  }
  if (runtimeEntryProviders.length > 0) {
    const fullPluginIds = sortUniqueStrings([
      ...resolveMissingEntryPluginIds(entryResult),
      ...listRuntimeManifestCatalogPluginIds(entryResult),
    ]);
    const fullProviders =
      fullPluginIds.length > 0
        ? resolvePluginProviders({
            ...params,
            env,
            bundledProviderVitestCompat,
            onlyPluginIds: fullPluginIds,
          })
        : [];
    return [
      ...withoutFullLoadedPluginEntries(runtimeEntryProviders, fullPluginIds),
      ...fullProviders,
    ];
  }
  const runtimeManifestCatalogPluginIds = listRuntimeManifestCatalogPluginIds(entryResult);
  if (runtimeManifestCatalogPluginIds.length > 0)
    return resolvePluginProviders({
      ...params,
      env,
      bundledProviderVitestCompat,
      onlyPluginIds: runtimeManifestCatalogPluginIds,
    });
  if (entryProviders.length > 0) {
    const fullPluginIds = sortUniqueStrings(
      entryProviders
        .map((provider) => provider.pluginId)
        .filter((pluginId) => typeof pluginId === "string" && pluginId !== ""),
    );
    if (fullPluginIds.length > 0)
      return resolvePluginProviders({
        ...params,
        env,
        bundledProviderVitestCompat,
        onlyPluginIds: fullPluginIds,
      });
  }
  return resolvePluginProviders({
    ...params,
    env,
    bundledProviderVitestCompat,
  });
}
//#endregion
export { resolvePluginDiscoveryProvidersRuntime as t };
