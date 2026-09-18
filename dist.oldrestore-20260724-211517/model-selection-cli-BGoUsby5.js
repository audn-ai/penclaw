import { t as resolveRuntimeCliBackends } from "./cli-backends.runtime.js";
import { n as isInstalledPluginEnabled } from "./installed-plugin-index-lBfkb-7L.js";
import { o as normalizeProviderId$1 } from "./model-selection-normalize-BoKGJiBx.js";
import { a as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BMgImu0m.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import { t as getActivePluginRegistryWorkspaceDirFromState } from "./runtime-state-Bd0YsvqM.js";
//#region src/plugins/setup-registry.runtime.ts
/** Metadata lookup helpers for plugin setup CLI backend descriptors. */
let cachedSetupCliBackendDescriptors;
function resolveMetadataSnapshotForSetupCliBackends(params = {}) {
  const env = params.env ?? process.env;
  const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDirFromState();
  return {
    snapshot: resolvePluginMetadataSnapshot({
      config: params.config ?? {},
      env,
      ...(workspaceDir !== void 0
        ? {
            workspaceDir,
            allowWorkspaceScopedCurrent: true,
          }
        : {}),
    }),
    cacheable: true,
  };
}
function resolveSetupCliBackendDescriptors(params = {}) {
  const { snapshot, cacheable } = resolveMetadataSnapshotForSetupCliBackends(params);
  const configFingerprint = snapshot.configFingerprint;
  if (
    cacheable &&
    configFingerprint &&
    cachedSetupCliBackendDescriptors?.configFingerprint === configFingerprint
  )
    return cachedSetupCliBackendDescriptors.entries;
  const entries = snapshot.plugins.flatMap((plugin) => {
    if (!isInstalledPluginEnabled(snapshot.index, plugin.id)) return [];
    return [...plugin.cliBackends, ...(plugin.setup?.cliBackends ?? [])].map((backendId) => ({
      pluginId: plugin.id,
      backend: { id: backendId },
    }));
  });
  if (cacheable && configFingerprint)
    cachedSetupCliBackendDescriptors = {
      configFingerprint,
      entries,
    };
  return entries;
}
function resolvePluginSetupCliBackendDescriptor(params) {
  const normalized = normalizeProviderId(params.backend);
  return resolveSetupCliBackendDescriptors(params).find(
    (entry) => normalizeProviderId(entry.backend.id) === normalized,
  );
}
//#endregion
//#region src/agents/model-selection-cli.ts
/** Return true when a provider id resolves to a configured or plugin CLI backend. */
function isCliProvider(provider, cfg) {
  const normalized = normalizeProviderId$1(provider);
  const backends = cfg?.agents?.defaults?.cliBackends ?? {};
  if (Object.keys(backends).some((key) => normalizeProviderId$1(key) === normalized)) return true;
  if (
    resolveRuntimeCliBackends().some((backend) => normalizeProviderId$1(backend.id) === normalized)
  )
    return true;
  if (
    resolvePluginSetupCliBackendDescriptor({
      backend: normalized,
      config: cfg,
    })
  )
    return true;
  return false;
}
//#endregion
export { isCliProvider as t };
