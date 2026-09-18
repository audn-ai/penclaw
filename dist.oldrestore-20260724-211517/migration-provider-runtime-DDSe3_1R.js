import { n as getLoadedRuntimePluginRegistry } from "./active-runtime-registry-BeyJcjvw.js";
import {
  n as withBundledPluginVitestCompat,
  t as withBundledPluginEnablementCompat,
} from "./bundled-compat-DMx7If2Y.js";
import { n as listBundledPluginMetadata } from "./bundled-plugin-metadata-Dl89Jc_X.js";
import { t as resolveManifestContractRuntimePluginResolution } from "./manifest-contract-runtime-Cw4R_f7N.js";
import { t as ensureStandaloneRuntimePluginRegistryLoaded } from "./standalone-runtime-registry-loader-BEHIWGAF.js";
//#region src/plugins/migration-provider-runtime.ts
function findMigrationProviderById(entries, providerId) {
  return entries.find((entry) => entry.provider.id === providerId)?.provider;
}
function resolveMigrationProviderConfig(params) {
  return withBundledPluginVitestCompat({
    config: withBundledPluginEnablementCompat({
      config: params.cfg,
      pluginIds: [...params.bundledCompatPluginIds],
    }),
    pluginIds: [...params.bundledCompatPluginIds],
    env: process.env,
  });
}
function resolveMigrationProviderRegistry(params) {
  return getLoadedRuntimePluginRegistry({ requiredPluginIds: params.pluginIds });
}
function resolveMigrationProviderPluginResolution(params) {
  const resolution = resolveManifestContractRuntimePluginResolution({
    cfg: params.cfg,
    contract: "migrationProviders",
    ...(params.providerId ? { value: params.providerId } : {}),
  });
  const pluginIds = new Set(resolution.pluginIds);
  const bundledCompatPluginIds = new Set(resolution.bundledCompatPluginIds);
  for (const plugin of listBundledPluginMetadata({ includeChannelConfigs: false })) {
    const providerIds = plugin.manifest.contracts?.migrationProviders ?? [];
    if (providerIds.length === 0 || (params.providerId && !providerIds.includes(params.providerId)))
      continue;
    pluginIds.add(plugin.manifest.id);
    bundledCompatPluginIds.add(plugin.manifest.id);
  }
  return {
    pluginIds: [...pluginIds].toSorted((left, right) => left.localeCompare(right)),
    bundledCompatPluginIds: [...bundledCompatPluginIds].toSorted((left, right) =>
      left.localeCompare(right),
    ),
  };
}
function mergeMigrationProviders(left, right) {
  const merged = /* @__PURE__ */ new Map();
  for (const entry of [...left, ...right])
    if (!merged.has(entry.provider.id)) merged.set(entry.provider.id, entry.provider);
  return [...merged.values()].toSorted((a, b) => a.id.localeCompare(b.id));
}
function ensureStandaloneMigrationProviderRegistryLoaded(params = {}) {
  const resolution = resolveMigrationProviderPluginResolution(params);
  if (resolution.pluginIds.length === 0) return;
  const compatConfig = resolveMigrationProviderConfig({
    cfg: params.cfg,
    bundledCompatPluginIds: resolution.bundledCompatPluginIds,
  });
  ensureStandaloneRuntimePluginRegistryLoaded({
    surface: "active",
    requiredPluginIds: resolution.pluginIds,
    loadOptions: {
      ...(compatConfig === void 0 ? {} : { config: compatConfig }),
      onlyPluginIds: resolution.pluginIds,
      activate: false,
    },
  });
}
function resolvePluginMigrationProvider(params) {
  const activeProvider = findMigrationProviderById(
    getLoadedRuntimePluginRegistry()?.migrationProviders ?? [],
    params.providerId,
  );
  if (activeProvider) return activeProvider;
  const pluginIds = resolveMigrationProviderPluginResolution({
    cfg: params.cfg,
    providerId: params.providerId,
  }).pluginIds;
  if (pluginIds.length === 0) return;
  return findMigrationProviderById(
    resolveMigrationProviderRegistry({ pluginIds })?.migrationProviders ?? [],
    params.providerId,
  );
}
function resolvePluginMigrationProviders(params = {}) {
  const activeProviders = getLoadedRuntimePluginRegistry()?.migrationProviders ?? [];
  const pluginIds = resolveMigrationProviderPluginResolution({ cfg: params.cfg }).pluginIds;
  if (pluginIds.length === 0) return mergeMigrationProviders(activeProviders, []);
  return mergeMigrationProviders(
    activeProviders,
    resolveMigrationProviderRegistry({ pluginIds })?.migrationProviders ?? [],
  );
}
//#endregion
export {
  resolvePluginMigrationProvider as n,
  resolvePluginMigrationProviders as r,
  ensureStandaloneMigrationProviderRegistryLoaded as t,
};
