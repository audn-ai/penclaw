import { s as resolveCompatibleRuntimePluginRegistry } from "./loader-3uGIvPnj.js";
import {
  c as getActivePluginRegistry,
  d as getActivePluginRegistryWorkspaceDir,
  n as getActivePluginChannelRegistry,
  o as getActivePluginHttpRouteRegistry,
  t as collectLivePluginRegistries,
} from "./runtime-CcYnX0B4.js";
import { s as normalizeSortedUniqueStringEntries } from "./string-normalization-CRyoFBPt.js";
//#region src/plugins/active-runtime-registry.ts
function getActiveRuntimePluginRegistry() {
  return getActivePluginRegistry();
}
function isRuntimePluginRecordLoaded(plugin) {
  return plugin.status === "loaded" && (plugin.format === "bundle" || plugin.imported !== false);
}
function listLoadedRuntimePluginIdsAcrossSurfaces() {
  const loaded = [];
  for (const registry of collectLivePluginRegistries())
    for (const plugin of registry.plugins ?? [])
      if (isRuntimePluginRecordLoaded(plugin)) loaded.push(plugin.id);
  return normalizeSortedUniqueStringEntries(loaded);
}
function normalizeRequiredPluginIds(ids) {
  if (ids === void 0) return;
  return normalizeSortedUniqueStringEntries(ids);
}
function registryContainsRuntimePluginIds(registry, pluginIds) {
  if (pluginIds === void 0) return true;
  const present = /* @__PURE__ */ new Set();
  const loaded = /* @__PURE__ */ new Set();
  const pluginStatusById = /* @__PURE__ */ new Map();
  const pluginRuntimeLoadedById = /* @__PURE__ */ new Map();
  for (const plugin of registry.plugins ?? []) {
    present.add(plugin.id);
    pluginStatusById.set(plugin.id, plugin.status);
    pluginRuntimeLoadedById.set(plugin.id, isRuntimePluginRecordLoaded(plugin));
    if (plugin.status === void 0 || isRuntimePluginRecordLoaded(plugin)) loaded.add(plugin.id);
  }
  for (const [key, value] of Object.entries(registry)) {
    if (key === "diagnostics" || key === "channelSetups") continue;
    if (!Array.isArray(value)) continue;
    for (const entry of value)
      if (entry && typeof entry === "object" && "pluginId" in entry) {
        const pluginId = entry.pluginId;
        if (typeof pluginId === "string" && pluginId.length > 0) {
          present.add(pluginId);
          if (
            pluginStatusById.get(pluginId) === void 0 ||
            pluginRuntimeLoadedById.get(pluginId) === true
          )
            loaded.add(pluginId);
        }
      }
  }
  if (pluginIds.length === 0) return present.size === 0;
  return pluginIds.every((pluginId) => loaded.has(pluginId));
}
function resolveSurfaceRegistry(surface) {
  switch (surface) {
    case "active":
      return getActivePluginRegistry();
    case "channel":
      return getActivePluginChannelRegistry();
    case "http-route":
      return getActivePluginHttpRouteRegistry();
  }
  return null;
}
function getLoadedRuntimePluginRegistry(params = {}) {
  const surface = params.surface ?? "active";
  const requiredPluginIds = normalizeRequiredPluginIds(
    params.requiredPluginIds ?? params.loadOptions?.onlyPluginIds,
  );
  if (surface === "active" && params.loadOptions && requiredPluginIds?.length !== 0) {
    const compatible = resolveCompatibleRuntimePluginRegistry(params.loadOptions);
    if (!compatible || !registryContainsRuntimePluginIds(compatible, requiredPluginIds)) return;
    return compatible;
  }
  const activeWorkspaceDir = getActivePluginRegistryWorkspaceDir();
  const requestedWorkspaceDir = params.workspaceDir ?? params.loadOptions?.workspaceDir;
  if (requestedWorkspaceDir !== void 0 && activeWorkspaceDir !== requestedWorkspaceDir) return;
  const registry = resolveSurfaceRegistry(surface);
  if (!registry) return;
  if (!registryContainsRuntimePluginIds(registry, requiredPluginIds)) return;
  return registry;
}
//#endregion
export {
  registryContainsRuntimePluginIds as i,
  getLoadedRuntimePluginRegistry as n,
  listLoadedRuntimePluginIdsAcrossSurfaces as r,
  getActiveRuntimePluginRegistry as t,
};
