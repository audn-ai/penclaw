import { n as getLoadedRuntimePluginRegistry } from "./active-runtime-registry-BeyJcjvw.js";
import {
  c as resolvePluginRegistryLoadCacheKey,
  o as loadOpenClawPlugins,
} from "./loader-3uGIvPnj.js";
import {
  D as setActivePluginRegistry,
  g as pinActivePluginHttpRouteRegistry,
  h as pinActivePluginChannelRegistry,
} from "./runtime-CcYnX0B4.js";
//#region src/plugins/runtime/standalone-runtime-registry-loader.ts
function resolveRuntimeSubagentMode(loadOptions) {
  if (loadOptions.runtimeOptions?.allowGatewaySubagentBinding === true) return "gateway-bindable";
  if (loadOptions.runtimeOptions?.subagent) return "explicit";
  return "default";
}
function installStandaloneRuntimePluginRegistry(registry, params) {
  setActivePluginRegistry(
    registry,
    resolvePluginRegistryLoadCacheKey(params.loadOptions),
    resolveRuntimeSubagentMode(params.loadOptions),
    params.loadOptions.workspaceDir,
  );
  switch (params.surface) {
    case "active":
      break;
    case "channel":
      pinActivePluginChannelRegistry(registry);
      break;
    case "http-route":
      pinActivePluginHttpRouteRegistry(registry);
      break;
  }
}
function ensureStandaloneRuntimePluginRegistryLoaded(params) {
  const requiredPluginIds = params.requiredPluginIds ?? params.loadOptions.onlyPluginIds;
  const surface = params.surface ?? "active";
  if (!params.forceLoad) {
    const existing = getLoadedRuntimePluginRegistry({
      env: params.loadOptions.env,
      loadOptions: params.loadOptions,
      workspaceDir: params.loadOptions.workspaceDir,
      requiredPluginIds,
      surface,
    });
    if (existing) return existing;
  }
  const registry = loadOpenClawPlugins(
    params.forceLoad
      ? {
          ...params.loadOptions,
          cache: false,
        }
      : params.loadOptions,
  );
  if (params.loadOptions.activate !== false) {
    switch (surface) {
      case "active":
        break;
      case "channel":
        pinActivePluginChannelRegistry(registry);
        break;
      case "http-route":
        pinActivePluginHttpRouteRegistry(registry);
        break;
    }
    return registry;
  }
  if (params.installRegistry === false) return registry;
  if (params.loadOptions.toolDiscovery === true) return registry;
  installStandaloneRuntimePluginRegistry(registry, {
    loadOptions: params.loadOptions,
    surface,
  });
  return registry;
}
//#endregion
export { ensureStandaloneRuntimePluginRegistryLoaded as t };
