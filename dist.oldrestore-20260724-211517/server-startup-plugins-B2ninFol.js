import "./agent-scope-y9xQv_q1.js";
import {
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import { s as listCoreGatewayMethodNames } from "./core-descriptors-CxB_dkaR.js";
import {
  i as collectUnregisteredConfiguredMemoryEmbeddingProviders,
  r as collectRegisteredEmbeddingProviderIds,
} from "./gateway-startup-plugin-ids-C7oHc3ol.js";
import "./registry-B14M_H8G.js";
import { r as resolveGatewayStartupPluginActivationConfig } from "./plugin-activation-runtime-config-lxCI0QKC.js";
import "./channel-plugin-ids-B1yGqL5H.js";
import { t as loadPluginLookUpTable } from "./plugin-lookup-table-C52ChtE8.js";
import {
  D as setActivePluginRegistry,
  O as createEmptyPluginRegistry,
  c as getActivePluginRegistry,
} from "./runtime-CcYnX0B4.js";
import { n as listGatewayMethods } from "./server-methods-list-BfINP-fZ.js";
import { l as initSubagentRegistry } from "./subagent-registry-CZikbOhO.js";
//#region src/gateway/server-startup-plugins.ts
/** Returns the config snapshot used by channel/plugin startup maintenance. */
function resolveGatewayStartupMaintenanceConfig(params) {
  return params.cfgAtStart.channels === void 0 && params.startupRuntimeConfig.channels !== void 0
    ? {
        ...params.cfgAtStart,
        channels: params.startupRuntimeConfig.channels,
      }
    : params.cfgAtStart;
}
/** Builds plugin startup state and gateway method lists before the server binds. */
async function prepareGatewayPluginBootstrap(params) {
  const activationSourceConfig = params.activationSourceConfig ?? params.cfgAtStart;
  const startupMaintenanceConfig = resolveGatewayStartupMaintenanceConfig({
    cfgAtStart: params.cfgAtStart,
    startupRuntimeConfig: params.startupRuntimeConfig,
  });
  if (!params.minimalTestGateway || startupMaintenanceConfig.channels !== void 0) {
    const { runChannelPluginStartupMaintenance } = await import("./lifecycle-startup-M3GDy14T.js");
    const startupTasks = [
      runChannelPluginStartupMaintenance({
        cfg: startupMaintenanceConfig,
        env: process.env,
        log: params.log,
      }),
    ];
    if (!params.minimalTestGateway) {
      const { runStartupSessionMigration } =
        await import("./server-startup-session-migration-D3p0fwel.js");
      startupTasks.push(
        runStartupSessionMigration({
          cfg: params.cfgAtStart,
          env: process.env,
          log: params.log,
        }),
      );
      const { migrateLegacyDevicePairingStore } =
        await import("./device-pairing-migration-Di9ba2Ng.js");
      const { migrateLegacyNodePairingStore } =
        await import("./node-pairing-migration-DAVgaFNk.js");
      startupTasks.push(
        migrateLegacyDevicePairingStore({ log: params.log }).then(
          () =>
            migrateLegacyNodePairingStore({ log: params.log }).then(
              () => void 0,
              (error) => {
                params.log.warn(`node pairing store migration failed: ${String(error)}`);
              },
            ),
          (error) => {
            params.log.warn(`device pairing store migration failed: ${String(error)}`);
          },
        ),
      );
    }
    await Promise.all(startupTasks);
  }
  initSubagentRegistry();
  const gatewayPluginConfig = params.minimalTestGateway
    ? params.cfgAtStart
    : resolveGatewayStartupPluginActivationConfig({
        runtimeConfig: params.cfgAtStart,
        activationSourceConfig,
        env: process.env,
        ...(params.pluginMetadataSnapshot?.manifestRegistry
          ? { manifestRegistry: params.pluginMetadataSnapshot.manifestRegistry }
          : {}),
        discovery: params.pluginMetadataSnapshot?.discovery,
      });
  const pluginsGloballyDisabled = gatewayPluginConfig.plugins?.enabled === false;
  const defaultWorkspaceDir = resolveAgentWorkspaceDir(
    gatewayPluginConfig,
    resolveDefaultAgentId(gatewayPluginConfig),
  );
  const pluginLookUpTable =
    params.minimalTestGateway || pluginsGloballyDisabled
      ? void 0
      : loadPluginLookUpTable({
          config: gatewayPluginConfig,
          workspaceDir: defaultWorkspaceDir,
          env: process.env,
          activationSourceConfig,
          metadataSnapshot: params.pluginMetadataSnapshot,
          workerProviderIds: params.workerProviderIds ?? [],
        });
  const deferredConfiguredChannelPluginIds = [
    ...(pluginLookUpTable?.startup.configuredDeferredChannelPluginIds ?? []),
  ];
  const startupPluginIds = [...(pluginLookUpTable?.startup.pluginIds ?? [])];
  const baseMethods = listGatewayMethods();
  const coreGatewayMethodNames = listCoreGatewayMethodNames();
  const emptyPluginRegistry = createEmptyPluginRegistry();
  let pluginRegistry;
  let baseGatewayMethods = baseMethods;
  const shouldLoadRuntimePlugins = params.loadRuntimePlugins !== false;
  const shouldLoadSetupRuntimePlugins =
    params.loadSetupRuntimePlugins === true && deferredConfiguredChannelPluginIds.length > 0;
  if (!params.minimalTestGateway && shouldLoadSetupRuntimePlugins)
    ({ pluginRegistry, gatewayMethods: baseGatewayMethods } = await loadGatewayStartupPluginRuntime(
      {
        cfg: gatewayPluginConfig,
        activationSourceConfig,
        workspaceDir: defaultWorkspaceDir,
        log: params.log,
        baseMethods,
        coreGatewayMethodNames,
        startupPluginIds: deferredConfiguredChannelPluginIds,
        pluginLookUpTable,
        preferSetupRuntimeForChannelPlugins: true,
        suppressPluginInfoLogs: true,
      },
    ));
  else if (!params.minimalTestGateway && shouldLoadRuntimePlugins)
    ({ pluginRegistry, gatewayMethods: baseGatewayMethods } = await loadGatewayStartupPluginRuntime(
      {
        cfg: gatewayPluginConfig,
        activationSourceConfig,
        workspaceDir: defaultWorkspaceDir,
        log: params.log,
        baseMethods,
        coreGatewayMethodNames,
        startupPluginIds,
        pluginLookUpTable,
        preferSetupRuntimeForChannelPlugins: false,
        suppressPluginInfoLogs: false,
      },
    ));
  else {
    pluginRegistry = params.minimalTestGateway
      ? (getActivePluginRegistry() ?? emptyPluginRegistry)
      : emptyPluginRegistry;
    setActivePluginRegistry(pluginRegistry);
  }
  const runtimePluginsLoaded =
    !params.minimalTestGateway && shouldLoadRuntimePlugins && !shouldLoadSetupRuntimePlugins;
  return {
    gatewayPluginConfigAtStart: gatewayPluginConfig,
    defaultWorkspaceDir,
    deferredConfiguredChannelPluginIds,
    startupPluginIds,
    pluginLookUpTable,
    baseMethods,
    pluginRegistry,
    baseGatewayMethods,
    runtimePluginsLoaded,
  };
}
/**
 * Warn when `agents.*.memorySearch.provider` selects a memory embedding provider
 * that no loaded plugin registered. Without the owning plugin, `active-memory`
 * cannot embed and silently falls back to keyword/FTS-only recall.
 */
function warnUnregisteredConfiguredMemoryEmbeddingProviders(params) {
  const unregistered = collectUnregisteredConfiguredMemoryEmbeddingProviders({
    config: params.config,
    registeredProviderIds: collectRegisteredEmbeddingProviderIds(params.pluginRegistry),
  });
  for (const provider of unregistered) {
    const path = `memorySearch.${provider.source}`;
    params.log.warn(
      `${path}="${provider.configuredId}" is configured, but no loaded plugin registered a memory embedding provider that can serve "${provider.configuredId}". Semantic memory recall will fall back to keyword/FTS-only search. Ensure the plugin that provides "${provider.configuredId}" is installed and enabled.`,
    );
  }
}
/** Loads startup plugin runtimes through the deferred bootstrap boundary. */
async function loadGatewayStartupPluginRuntime(params) {
  const { loadGatewayStartupPlugins } = await import("./server-plugin-bootstrap-DCGTS_BP.js");
  const loaded = loadGatewayStartupPlugins({
    cfg: params.cfg,
    activationSourceConfig: params.activationSourceConfig,
    workspaceDir: params.workspaceDir,
    log: params.log,
    coreGatewayMethodNames: params.coreGatewayMethodNames ?? params.baseMethods,
    baseMethods: params.baseMethods,
    ...(params.hostServices !== void 0 && { hostServices: params.hostServices }),
    pluginIds: params.startupPluginIds,
    pluginLookUpTable: params.pluginLookUpTable,
    preferSetupRuntimeForChannelPlugins: params.preferSetupRuntimeForChannelPlugins,
    suppressPluginInfoLogs: params.suppressPluginInfoLogs,
    startupTrace: params.startupTrace,
  });
  if (params.preferSetupRuntimeForChannelPlugins !== true)
    warnUnregisteredConfiguredMemoryEmbeddingProviders({
      config: params.cfg,
      pluginRegistry: loaded.pluginRegistry,
      log: params.log,
    });
  return loaded;
}
//#endregion
export {
  loadGatewayStartupPluginRuntime,
  prepareGatewayPluginBootstrap,
  resolveGatewayStartupMaintenanceConfig,
  warnUnregisteredConfiguredMemoryEmbeddingProviders,
};
