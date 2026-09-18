import { c as normalizePluginsConfig } from "./config-state-C1Qyxaws.js";
//#region src/plugin-sdk/plugin-config-runtime.ts
/** Requires an already-resolved runtime config at plugin runtime boundaries. */
function requireRuntimeConfig(config, context) {
  if (config) return config;
  throw new Error(
    `${context} requires a resolved runtime config. Load and resolve config at the command or gateway boundary, then pass cfg through the runtime path.`,
  );
}
/** Reads a plugin's object-shaped `plugins.entries[id].config` block from resolved config. */
function resolvePluginConfigObject(config, pluginId) {
  const pluginConfig = normalizePluginsConfig(config?.plugins).entries[pluginId]?.config;
  return pluginConfig && typeof pluginConfig === "object" && !Array.isArray(pluginConfig)
    ? pluginConfig
    : void 0;
}
/** Resolves live plugin config through a loader, falling back to startup config when unavailable. */
function resolveLivePluginConfigObject(runtimeConfigLoader, pluginId, startupPluginConfig) {
  if (typeof runtimeConfigLoader !== "function") return startupPluginConfig;
  return resolvePluginConfigObject(runtimeConfigLoader(), pluginId);
}
//#endregion
export {
  resolveLivePluginConfigObject as n,
  resolvePluginConfigObject as r,
  requireRuntimeConfig as t,
};
