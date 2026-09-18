import { c as normalizePluginsConfig } from "./config-state-C1Qyxaws.js";
import "./utils-DtcDeqWS.js";
import { r as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-DGhQ40qh.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { f as getActivePluginRuntimeSubagentMode } from "./runtime-CcYnX0B4.js";
import { t as ensureStandaloneRuntimePluginRegistryLoaded } from "./standalone-runtime-registry-loader-BEHIWGAF.js";
//#region src/agents/runtime-plugins.ts
function resolveStartupPluginIdsFromCurrentSnapshot(params) {
  const pluginIds = getCurrentPluginMetadataSnapshot({
    config: params.config,
    workspaceDir: params.workspaceDir,
  })?.startup?.pluginIds;
  if (!Array.isArray(pluginIds)) return;
  return pluginIds.filter((pluginId) => typeof pluginId === "string");
}
/** Ensure standalone runtime plugins are loaded for the current agent context. */
function ensureRuntimePluginsLoaded(params) {
  if (params.config && !normalizePluginsConfig(params.config.plugins).enabled) return;
  const workspaceDir =
    typeof params.workspaceDir === "string" && params.workspaceDir.trim()
      ? resolveUserPath(params.workspaceDir)
      : void 0;
  const startupPluginIds = resolveStartupPluginIdsFromCurrentSnapshot({
    config: params.config,
    workspaceDir,
  });
  const allowGatewaySubagentBinding =
    params.allowGatewaySubagentBinding === true ||
    getActivePluginRuntimeSubagentMode() === "gateway-bindable";
  ensureStandaloneRuntimePluginRegistryLoaded({
    requiredPluginIds: startupPluginIds,
    loadOptions: {
      config: params.config,
      workspaceDir,
      ...(startupPluginIds === void 0 ? {} : { onlyPluginIds: startupPluginIds }),
      ...(startupPluginIds === void 0 ? {} : { forceFullRuntimeForChannelPlugins: true }),
      runtimeOptions: allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : void 0,
    },
  });
}
//#endregion
export { ensureRuntimePluginsLoaded as t };
