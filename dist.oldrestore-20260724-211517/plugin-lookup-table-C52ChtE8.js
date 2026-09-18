import {
  _ as resolveGatewayStartupPluginPlanFromRegistry,
  o as createGatewayStartupMetadataPluginIdScope,
  s as isMetadataSnapshotScopedForGatewayStartup,
} from "./gateway-startup-plugin-ids-C7oHc3ol.js";
import {
  a as resolvePluginMetadataSnapshot,
  n as isPluginMetadataSnapshotCompatible,
} from "./plugin-metadata-snapshot-BMgImu0m.js";
import { i as normalizeWorkerProviderIds } from "./worker-provider-registry-CKsY-3qr.js";
import "./channel-plugin-ids-B1yGqL5H.js";
//#region src/plugins/plugin-lookup-table.ts
const lookupTableMemoBySnapshot = /* @__PURE__ */ new WeakMap();
function loadPluginLookUpTable(params) {
  const requestedSnapshotConfig = params.activationSourceConfig ?? params.config;
  const workerProviderIds = normalizeWorkerProviderIds(params.workerProviderIds ?? []);
  const pluginIdScope = createGatewayStartupMetadataPluginIdScope({
    config: params.config,
    ...(params.activationSourceConfig !== void 0
      ? { activationSourceConfig: params.activationSourceConfig }
      : {}),
    env: params.env,
    workerProviderIds,
  });
  const metadataSnapshot =
    params.metadataSnapshot &&
    isPluginMetadataSnapshotCompatible({
      snapshot: params.metadataSnapshot,
      config: requestedSnapshotConfig,
      env: params.env,
      allowScopedSnapshot: true,
      workspaceDir: params.workspaceDir,
      index: params.index,
    }) &&
    isMetadataSnapshotScopedForGatewayStartup({
      metadataSnapshot: params.metadataSnapshot,
      pluginIdScope,
    })
      ? params.metadataSnapshot
      : resolvePluginMetadataSnapshot({
          config: requestedSnapshotConfig,
          workspaceDir: params.workspaceDir,
          env: params.env,
          allowWorkspaceScopedCurrent: params.workspaceDir === void 0,
          ...(params.index ? { index: params.index } : {}),
          pluginIdScope,
        });
  const memoKey = pluginIdScope.key;
  const memo = lookupTableMemoBySnapshot.get(metadataSnapshot)?.get(memoKey);
  if (memo) return memo;
  const { index, manifestRegistry } = metadataSnapshot;
  const startupPlanStartedAt = performance.now();
  const startup = resolveGatewayStartupPluginPlanFromRegistry({
    config: params.config,
    ...(params.activationSourceConfig !== void 0
      ? { activationSourceConfig: params.activationSourceConfig }
      : {}),
    env: params.env,
    index,
    manifestRegistry,
    workerProviderIds,
  });
  const startupPlanMs = performance.now() - startupPlanStartedAt;
  const table = {
    ...metadataSnapshot,
    startup,
    workerProviderIds,
    metrics: {
      ...metadataSnapshot.metrics,
      startupPlanMs,
      totalMs: metadataSnapshot.metrics.totalMs + startupPlanMs,
      startupPluginCount: startup.pluginIds.length,
      deferredChannelPluginCount: startup.configuredDeferredChannelPluginIds.length,
    },
  };
  let memoByKey = lookupTableMemoBySnapshot.get(metadataSnapshot);
  if (!memoByKey) {
    memoByKey = /* @__PURE__ */ new Map();
    lookupTableMemoBySnapshot.set(metadataSnapshot, memoByKey);
  }
  memoByKey.set(memoKey, table);
  return table;
}
//#endregion
export { loadPluginLookUpTable as t };
