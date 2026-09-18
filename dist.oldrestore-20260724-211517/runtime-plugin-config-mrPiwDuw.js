import { r as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-DGhQ40qh.js";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-DAo0bjMj.js";
//#region src/gateway/runtime-plugin-config.ts
const gatewayPluginConfigCache = /* @__PURE__ */ new WeakMap();
/** Resolves runtime config with plugin auto-enable applied for gateway startup/reload paths. */
function resolveGatewayPluginConfig(params) {
  const currentSnapshot = getCurrentPluginMetadataSnapshot({
    config: params.config,
    allowWorkspaceScopedSnapshot: true,
  });
  if (!currentSnapshot) return applyPluginAutoEnable({ config: params.config }).config;
  const cached = gatewayPluginConfigCache.get(params.config);
  if (cached?.snapshot === currentSnapshot) return cached.config;
  const config = applyPluginAutoEnable({
    config: params.config,
    manifestRegistry: currentSnapshot.manifestRegistry,
    discovery: currentSnapshot.discovery,
  }).config;
  gatewayPluginConfigCache.set(params.config, {
    snapshot: currentSnapshot,
    config,
  });
  return config;
}
//#endregion
export { resolveGatewayPluginConfig as t };
