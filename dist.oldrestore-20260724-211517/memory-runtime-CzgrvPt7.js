import { n as getLoadedRuntimePluginRegistry } from "./active-runtime-registry-BeyJcjvw.js";
import "./utils-DtcDeqWS.js";
import {
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import "./agent-scope-y9xQv_q1.js";
import { c as normalizePluginsConfig } from "./config-state-C1Qyxaws.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { i as getMemoryRuntime } from "./memory-state-z9GGEQiO.js";
import { t as ensureStandaloneRuntimePluginRegistryLoaded } from "./standalone-runtime-registry-loader-BEHIWGAF.js";
//#region src/plugins/memory-runtime.ts
/** Resolves the configured memory slot to the single runtime plugin that may load memory. */
function resolveMemoryRuntimePluginIds(config) {
  const plugins = normalizePluginsConfig(config.plugins);
  const memorySlot = plugins.slots.memory;
  if (!plugins.enabled || typeof memorySlot !== "string" || memorySlot.trim().length === 0)
    return [];
  const pluginId = memorySlot.trim();
  if (plugins.deny.includes(pluginId) || plugins.entries[pluginId]?.enabled === false) return [];
  return [pluginId];
}
function resolveMemoryRuntimeWorkspaceDir(cfg) {
  const dir = resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg));
  if (typeof dir !== "string" || !dir.trim()) return;
  return resolveUserPath(dir);
}
function ensureMemoryRuntime(cfg) {
  const current = getMemoryRuntime();
  if (current || !cfg) return current;
  const onlyPluginIds = resolveMemoryRuntimePluginIds(cfg);
  if (onlyPluginIds.length === 0) return getMemoryRuntime();
  getLoadedRuntimePluginRegistry({ requiredPluginIds: onlyPluginIds });
  if (getMemoryRuntime()) return getMemoryRuntime();
  ensureStandaloneRuntimePluginRegistryLoaded({
    requiredPluginIds: onlyPluginIds,
    loadOptions: {
      config: cfg,
      onlyPluginIds,
      workspaceDir: resolveMemoryRuntimeWorkspaceDir(cfg),
    },
  });
  return getMemoryRuntime();
}
/** Returns the active plugin-backed memory search manager for an agent. */
async function getActiveMemorySearchManager(params) {
  const runtime = ensureMemoryRuntime(params.cfg);
  if (!runtime)
    return {
      manager: null,
      error: "memory plugin unavailable",
    };
  return await runtime.getMemorySearchManager(params);
}
/** Resolves current memory backend config without constructing a manager. */
function resolveActiveMemoryBackendConfig(params) {
  return ensureMemoryRuntime(params.cfg)?.resolveMemoryBackendConfig(params) ?? null;
}
/** Closes all active plugin-backed memory search managers. */
async function closeActiveMemorySearchManagers(cfg) {
  await getMemoryRuntime()?.closeAllMemorySearchManagers?.();
}
/** Closes the plugin-backed memory search manager for one agent. */
async function closeActiveMemorySearchManager(params) {
  await getMemoryRuntime()?.closeMemorySearchManager?.(params);
}
//#endregion
export {
  resolveActiveMemoryBackendConfig as i,
  closeActiveMemorySearchManagers as n,
  getActiveMemorySearchManager as r,
  closeActiveMemorySearchManager as t,
};
