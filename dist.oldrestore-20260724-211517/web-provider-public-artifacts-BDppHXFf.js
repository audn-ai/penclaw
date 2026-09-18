import path from "node:path";
import { t as resolveEnabledBundledManifestContractPlugins } from "./bundled-manifest-contract-plugins-Be2k3fQI.js";
import { o as normalizePluginId } from "./config-state-C1Qyxaws.js";
import { s as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-3WxfNDRv.js";
import { p as normalizeUniqueStringEntries } from "./string-normalization-CRyoFBPt.js";
import {
  a as resolveBundledExplicitWebSearchProvidersFromPublicArtifacts,
  i as resolveBundledExplicitWebFetchProvidersFromPublicArtifacts,
  n as loadBundledWebSearchProviderEntriesFromDir,
  r as resolveBundledExplicitRuntimeWebFetchProvidersFromPublicArtifacts,
  t as loadBundledWebFetchProviderEntriesFromDir,
} from "./web-provider-public-artifacts.explicit-D3xJnZ0e.js";
import {
  i as resolveBundledWebFetchResolutionConfig,
  l as resolveManifestDeclaredWebProviderCandidates,
  t as resolveBundledWebSearchResolutionConfig,
} from "./web-search-providers.shared-CArHDy3x.js";
//#region src/plugins/web-provider-public-artifacts.ts
function filterAllowlistedBundledPluginIds(config, pluginIds) {
  if (config?.plugins?.bundledDiscovery === "compat") return [...pluginIds];
  const allow = config?.plugins?.allow;
  if (!Array.isArray(allow) || allow.length === 0) return [...pluginIds];
  const allowedPluginIds = new Set(
    normalizeUniqueStringEntries(allow.map((pluginId) => normalizePluginId(pluginId))),
  );
  return pluginIds.filter((pluginId) => allowedPluginIds.has(pluginId));
}
function resolveBundledCandidatePluginIds(params) {
  if (params.onlyPluginIds !== void 0)
    return {
      pluginIds: filterAllowlistedBundledPluginIds(params.config, [
        ...new Set(params.onlyPluginIds),
      ]).toSorted((left, right) => left.localeCompare(right)),
    };
  const resolvedConfig =
    params.contract === "webSearchProviders"
      ? resolveBundledWebSearchResolutionConfig(params).config
      : resolveBundledWebFetchResolutionConfig(params).config;
  const candidates = resolveManifestDeclaredWebProviderCandidates({
    contract: params.contract,
    configKey: params.configKey,
    config: resolvedConfig,
    workspaceDir: params.workspaceDir,
    env: params.env,
    onlyPluginIds: params.onlyPluginIds,
    origin: "bundled",
  });
  return {
    pluginIds: filterAllowlistedBundledPluginIds(resolvedConfig, candidates.pluginIds ?? []),
    ...(candidates.manifestRecords ? { manifestRecords: candidates.manifestRecords } : {}),
  };
}
function resolveBundledManifestRecordsByPluginId(params) {
  const allowedPluginIds = new Set(params.onlyPluginIds);
  const manifestRecords =
    params.manifestRecords ??
    loadManifestMetadataSnapshot({
      config: params.config,
      workspaceDir: params.workspaceDir,
      env: params.env,
    }).plugins;
  return new Map(
    manifestRecords
      .filter((record) => record.origin === "bundled" && allowedPluginIds.has(record.id))
      .map((record) => [record.id, record]),
  );
}
function resolveBundledRuntimeCandidatePluginIds(params) {
  const resolvedConfig = resolveBundledWebFetchResolutionConfig(params).config;
  const candidates = resolveManifestDeclaredWebProviderCandidates({
    contract: params.contract,
    configKey: params.configKey,
    config: resolvedConfig,
    workspaceDir: params.workspaceDir,
    env: params.env,
    onlyPluginIds: params.onlyPluginIds,
  });
  const pluginIds = filterAllowlistedBundledPluginIds(resolvedConfig, candidates.pluginIds ?? []);
  const recordsByPluginId = new Map(
    (candidates.manifestRecords ?? [])
      .filter((record) => pluginIds.includes(record.id))
      .map((record) => [record.id, record]),
  );
  if (pluginIds.some((pluginId) => recordsByPluginId.get(pluginId)?.origin !== "bundled"))
    return null;
  const enabledPluginIds = new Set(
    resolveEnabledBundledManifestContractPlugins({
      config: params.config,
      workspaceDir: params.workspaceDir,
      env: params.env,
      onlyPluginIds: pluginIds,
      contract: params.contract,
      compatMode: {
        enablement: "always",
        vitest: params.config !== void 0,
      },
    }).map((plugin) => plugin.id),
  );
  return pluginIds.filter((pluginId) => enabledPluginIds.has(pluginId));
}
function resolveBundledWebSearchProvidersFromPublicArtifacts(params) {
  const pluginIds = resolveBundledCandidatePluginIds({
    contract: "webSearchProviders",
    configKey: "webSearch",
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
    onlyPluginIds: params.onlyPluginIds,
  });
  if (pluginIds.pluginIds.length === 0) return [];
  const directProviders = resolveBundledExplicitWebSearchProvidersFromPublicArtifacts({
    onlyPluginIds: pluginIds.pluginIds,
  });
  if (directProviders) return directProviders;
  const recordsByPluginId = resolveBundledManifestRecordsByPluginId({
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
    onlyPluginIds: pluginIds.pluginIds,
    manifestRecords: pluginIds.manifestRecords,
  });
  const providers = [];
  for (const pluginId of pluginIds.pluginIds) {
    const record = recordsByPluginId.get(pluginId);
    if (!record) return null;
    const loadedProviders = loadBundledWebSearchProviderEntriesFromDir({
      dirName: path.basename(record.rootDir),
      pluginId,
    });
    if (!loadedProviders) return null;
    providers.push(...loadedProviders);
  }
  return providers;
}
function resolveBundledWebFetchProvidersFromPublicArtifacts(params) {
  const pluginIds = resolveBundledCandidatePluginIds({
    contract: "webFetchProviders",
    configKey: "webFetch",
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
    onlyPluginIds: params.onlyPluginIds,
  });
  if (pluginIds.pluginIds.length === 0) return [];
  const directProviders = resolveBundledExplicitWebFetchProvidersFromPublicArtifacts({
    onlyPluginIds: pluginIds.pluginIds,
  });
  if (directProviders) return directProviders;
  const recordsByPluginId = resolveBundledManifestRecordsByPluginId({
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
    onlyPluginIds: pluginIds.pluginIds,
    manifestRecords: pluginIds.manifestRecords,
  });
  const providers = [];
  for (const pluginId of pluginIds.pluginIds) {
    const record = recordsByPluginId.get(pluginId);
    if (!record) return null;
    const loadedProviders = loadBundledWebFetchProviderEntriesFromDir({
      dirName: path.basename(record.rootDir),
      pluginId,
    });
    if (!loadedProviders) return null;
    providers.push(...loadedProviders);
  }
  return providers;
}
function resolveBundledRuntimeWebFetchProvidersFromPublicArtifacts(params) {
  const pluginIds = resolveBundledRuntimeCandidatePluginIds({
    contract: "webFetchProviders",
    configKey: "webFetch",
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
    onlyPluginIds: params.onlyPluginIds,
  });
  if (!pluginIds) return null;
  if (pluginIds.length === 0) return [];
  return resolveBundledExplicitRuntimeWebFetchProvidersFromPublicArtifacts({
    onlyPluginIds: pluginIds,
  });
}
//#endregion
export {
  resolveBundledWebFetchProvidersFromPublicArtifacts as n,
  resolveBundledWebSearchProvidersFromPublicArtifacts as r,
  resolveBundledRuntimeWebFetchProvidersFromPublicArtifacts as t,
};
