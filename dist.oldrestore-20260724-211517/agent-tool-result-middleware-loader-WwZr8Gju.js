import { n as getLoadedRuntimePluginRegistry } from "./active-runtime-registry-BeyJcjvw.js";
import {
  n as normalizeAgentToolResultMiddlewareRuntimeIds,
  t as listAgentToolResultMiddlewares,
} from "./agent-tool-result-middleware-DHyndnr5.js";
import {
  c as normalizePluginsConfig,
  n as createPluginActivationSource,
  u as resolveEffectivePluginActivationState,
} from "./config-state-C1Qyxaws.js";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.js";
import { o as loadOpenClawPlugins } from "./loader-3uGIvPnj.js";
import { t as loadPluginManifestRegistry } from "./manifest-registry-CXy9BBfE.js";
import { c as getActivePluginRegistry } from "./runtime-CcYnX0B4.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region src/plugins/agent-tool-result-middleware-loader.ts
const log = createSubsystemLogger("plugins/agent-tool-result-middleware");
async function resolveRuntimeConfigContext() {
  const { getRuntimeConfig, getRuntimeConfigSourceSnapshot } = await import("./config/config.js");
  const config = getRuntimeConfig();
  return {
    config,
    activationSourceConfig: getRuntimeConfigSourceSnapshot() ?? config,
  };
}
function listMiddlewareOwnerPluginIds(params) {
  const pluginIds = [];
  for (const record of params.manifestRegistry.plugins) {
    if (
      !canLazyLoadMiddlewareOwner({
        record,
        config: params.config,
        pluginsConfig: params.pluginsConfig,
        activationSource: params.activationSource,
      })
    )
      continue;
    if (
      normalizeAgentToolResultMiddlewareRuntimeIds(
        record.contracts?.agentToolResultMiddleware,
      ).includes(params.runtime) &&
      !pluginIds.includes(record.id)
    )
      pluginIds.push(record.id);
  }
  return pluginIds;
}
function canLazyLoadMiddlewareOwner(params) {
  if (params.record.origin === "bundled") return true;
  const activationState = resolveEffectivePluginActivationState({
    id: params.record.id,
    origin: params.record.origin,
    config: params.pluginsConfig,
    rootConfig: params.config,
    enabledByDefault: isPluginEnabledByDefaultForPlatform(params.record),
    activationSource: params.activationSource,
  });
  return activationState.enabled && activationState.explicitlyEnabled;
}
function listRuntimeMiddlewareOwnerPluginIds(registry, runtime) {
  const pluginIds = /* @__PURE__ */ new Set();
  for (const entry of registry?.agentToolResultMiddlewares ?? [])
    if (entry.runtimes.includes(runtime)) pluginIds.add(entry.pluginId);
  return pluginIds;
}
function listActiveMiddlewareOwnerPluginIds(runtime) {
  return listRuntimeMiddlewareOwnerPluginIds(getActivePluginRegistry(), runtime);
}
function registryHasMiddlewareOwners(params) {
  if (!params.registry) return false;
  const ownerPluginIds = listRuntimeMiddlewareOwnerPluginIds(params.registry, params.runtime);
  return params.pluginIds.every((pluginId) => ownerPluginIds.has(pluginId));
}
async function loadAgentToolResultMiddlewaresForRuntime(params) {
  const activeHandlers = listAgentToolResultMiddlewares(params.runtime);
  try {
    const runtimeContext = params.config
      ? {
          config: params.config,
          activationSourceConfig: params.config,
        }
      : await resolveRuntimeConfigContext();
    const config = runtimeContext.config;
    const activationSourceConfig =
      params.activationSourceConfig ?? runtimeContext.activationSourceConfig;
    const env = params.env ?? process.env;
    const manifestRegistry =
      params.manifestRegistry ??
      loadPluginManifestRegistry({
        config,
        workspaceDir: params.workspaceDir,
        env,
      });
    const pluginsConfig = normalizePluginsConfig(config.plugins);
    const activationSource = createPluginActivationSource({
      config: activationSourceConfig,
      plugins: normalizePluginsConfig(activationSourceConfig.plugins),
    });
    const pluginIds = listMiddlewareOwnerPluginIds({
      manifestRegistry,
      runtime: params.runtime,
      config,
      pluginsConfig,
      activationSource,
    });
    if (pluginIds.length === 0) return activeHandlers;
    const activePluginIds = listActiveMiddlewareOwnerPluginIds(params.runtime);
    const missingPluginIds = pluginIds.filter((pluginId) => !activePluginIds.has(pluginId));
    if (missingPluginIds.length === 0) return activeHandlers;
    const missingPluginIdSet = new Set(missingPluginIds);
    const loadedRegistry = getLoadedRuntimePluginRegistry({
      workspaceDir: params.workspaceDir,
      env,
      requiredPluginIds: missingPluginIds,
    });
    const missingHandlers = (
      loadedRegistry &&
      registryHasMiddlewareOwners({
        registry: loadedRegistry,
        pluginIds: missingPluginIds,
        runtime: params.runtime,
      })
        ? loadedRegistry
        : loadOpenClawPlugins({
            config,
            workspaceDir: params.workspaceDir,
            env,
            onlyPluginIds: missingPluginIds,
            manifestRegistry,
            activate: false,
            forceFullRuntimeForChannelPlugins: true,
          })
    ).agentToolResultMiddlewares
      .filter(
        (entry) =>
          missingPluginIdSet.has(entry.pluginId) && entry.runtimes.includes(params.runtime),
      )
      .map((entry) => entry.handler);
    return [...activeHandlers, ...missingHandlers];
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    log.warn(`[${params.runtime}] failed to load tool result middleware plugins: ${detail}`);
    return listAgentToolResultMiddlewares(params.runtime);
  }
}
//#endregion
export { loadAgentToolResultMiddlewaresForRuntime };
