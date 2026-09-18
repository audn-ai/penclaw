import { t as findBundledPluginMetadataById } from "./bundled-plugin-metadata-Dl89Jc_X.js";
import { n as discoverOpenClawPlugins } from "./discovery-Df2IhoW5.js";
import { t as loadPluginManifestRegistry } from "./manifest-registry-CXy9BBfE.js";
import { n as loadPluginManifestRegistryForPluginRegistry } from "./plugin-registry-BckMdz4f.js";
import { s as normalizeSortedUniqueStringEntries } from "./string-normalization-CRyoFBPt.js";
import "./config-contract-matches-lI-0JTS4.js";
//#region src/plugins/config-contracts.ts
/** Resolves plugin config contract metadata for scanners and secret/config policy checks. */
/** Resolve config contract metadata for plugin ids through the runtime registry and bundled fallback. */
function resolvePluginConfigContractsById(params) {
  const matches = /* @__PURE__ */ new Map();
  const pluginIds = normalizeSortedUniqueStringEntries(params.pluginIds);
  if (pluginIds.length === 0) return matches;
  const fallbackBundledPluginIds = new Set(
    normalizeSortedUniqueStringEntries(params.fallbackBundledPluginIds),
  );
  const bundledContractFallbacks = /* @__PURE__ */ new Map();
  const findBundledConfigContracts = (pluginId) => {
    if (bundledContractFallbacks.has(pluginId)) return bundledContractFallbacks.get(pluginId);
    const discovery =
      params.discovery ??
      discoverOpenClawPlugins({
        workspaceDir: params.workspaceDir,
        env: params.env,
      });
    const registry = loadPluginManifestRegistry({
      config: params.config,
      workspaceDir: params.workspaceDir,
      env: params.env,
      candidates: discovery.candidates.filter((candidate) => candidate.origin === "bundled"),
      diagnostics: discovery.diagnostics,
    });
    for (const plugin of registry.plugins)
      bundledContractFallbacks.set(plugin.id, plugin.configContracts);
    if (bundledContractFallbacks.get(pluginId) === void 0) {
      const bundledMetadata = findBundledPluginMetadataById(pluginId, {
        includeChannelConfigs: false,
        includeSyntheticChannelConfigs: false,
      });
      if (bundledMetadata?.manifest.configContracts)
        bundledContractFallbacks.set(pluginId, bundledMetadata.manifest.configContracts);
    }
    if (!bundledContractFallbacks.has(pluginId)) bundledContractFallbacks.set(pluginId, void 0);
    return bundledContractFallbacks.get(pluginId);
  };
  const resolvedPluginOrigins = /* @__PURE__ */ new Map();
  const registry = loadPluginManifestRegistryForPluginRegistry({
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
    includeDisabled: true,
  });
  for (const plugin of registry.plugins) {
    if (!pluginIds.includes(plugin.id)) continue;
    resolvedPluginOrigins.set(plugin.id, plugin.origin);
    if (!plugin.configContracts) continue;
    matches.set(plugin.id, {
      origin: plugin.origin,
      configContracts: plugin.configContracts,
    });
  }
  if (params.fallbackToBundledMetadata ?? true)
    for (const pluginId of pluginIds) {
      const existing = matches.get(pluginId);
      if (
        existing &&
        ((params.fallbackToBundledMetadataForResolvedBundled && existing.origin === "bundled") ||
          fallbackBundledPluginIds.has(pluginId))
      ) {
        const bundledConfigContracts = findBundledConfigContracts(pluginId);
        if (bundledConfigContracts)
          matches.set(pluginId, {
            origin: fallbackBundledPluginIds.has(pluginId) ? "bundled" : existing.origin,
            configContracts: {
              ...bundledConfigContracts,
              ...existing.configContracts,
              ...(bundledConfigContracts.secretInputs
                ? { secretInputs: bundledConfigContracts.secretInputs }
                : {}),
            },
          });
        continue;
      }
      if (matches.has(pluginId)) continue;
      const resolvedOrigin = resolvedPluginOrigins.get(pluginId);
      if (
        resolvedOrigin &&
        !(params.fallbackToBundledMetadataForResolvedBundled && resolvedOrigin === "bundled") &&
        !fallbackBundledPluginIds.has(pluginId)
      )
        continue;
      const bundledConfigContracts = findBundledConfigContracts(pluginId);
      if (!bundledConfigContracts) continue;
      matches.set(pluginId, {
        origin: "bundled",
        configContracts: bundledConfigContracts,
      });
    }
  return matches;
}
//#endregion
export { resolvePluginConfigContractsById as t };
