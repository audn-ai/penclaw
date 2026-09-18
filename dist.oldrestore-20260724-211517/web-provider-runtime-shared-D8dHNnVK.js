import { r as withActivatedPluginIds } from "./activation-context-BIXFhH9U.js";
import { n as getLoadedRuntimePluginRegistry } from "./active-runtime-registry-BeyJcjvw.js";
import {
  c as hasExplicitPluginIdScope,
  u as normalizePluginIdScope,
} from "./current-plugin-metadata-snapshot-DGhQ40qh.js";
import {
  n as buildPluginRuntimeLoadOptionsFromValues,
  r as createPluginRuntimeLoaderLogger,
} from "./load-context-ux2duVks.js";
import { i as isPluginRegistryLoadInFlight, o as loadOpenClawPlugins } from "./loader-3uGIvPnj.js";
import { d as getActivePluginRegistryWorkspaceDir } from "./runtime-CcYnX0B4.js";
//#region src/plugins/web-provider-runtime-shared.ts
function resolveWebProviderRuntimeContext(params, deps) {
  const env = params.env ?? process.env;
  const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDir();
  const shouldFilterProviders =
    params.config !== void 0 ||
    params.onlyPluginIds !== void 0 ||
    params.origin !== void 0 ||
    params.sandboxed === true;
  const { config, activationSourceConfig, autoEnabledReasons } =
    deps.resolveBundledResolutionConfig({
      ...params,
      workspaceDir,
      env,
    });
  const candidatePluginIds = normalizePluginIdScope(
    deps.resolveCandidatePluginIds({
      config,
      workspaceDir,
      env,
      onlyPluginIds: params.onlyPluginIds,
      origin: params.origin,
      sandboxed: params.sandboxed,
    }),
  );
  return {
    activationSourceConfig,
    autoEnabledReasons,
    config,
    env,
    loadPluginIds: candidatePluginIds,
    onlyPluginIds: shouldFilterProviders ? candidatePluginIds : void 0,
    workspaceDir,
  };
}
function resolveWebProviderLoadOptions(context, params) {
  return buildPluginRuntimeLoadOptionsFromValues(
    {
      env: context.env,
      config: context.config,
      activationSourceConfig: context.activationSourceConfig,
      autoEnabledReasons: context.autoEnabledReasons,
      workspaceDir: context.workspaceDir,
      logger: createPluginRuntimeLoaderLogger(),
    },
    {
      cache: params.cache ?? true,
      activate: params.activate ?? false,
      ...(hasExplicitPluginIdScope(context.loadPluginIds)
        ? { onlyPluginIds: context.loadPluginIds }
        : {}),
    },
  );
}
function resolveRuntimeRegistryWebProviders(params) {
  if (!params.registry) return;
  const providers = params.mapRegistryProviders({
    registry: params.registry,
    onlyPluginIds: params.onlyPluginIds,
  });
  return {
    providers,
    shouldReturn: providers.length > 0 || params.hasExplicitEmptyScope,
  };
}
/** Resolves plugin web providers from setup, active runtime, or a scoped load. */
function resolvePluginWebProviders(params, deps) {
  const env = params.env ?? process.env;
  const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDir();
  if (params.mode === "setup") {
    const pluginIds =
      deps.resolveCandidatePluginIds({
        config: params.config,
        workspaceDir,
        env,
        onlyPluginIds: params.onlyPluginIds,
        origin: params.origin,
        sandboxed: params.sandboxed,
      }) ?? [];
    if (pluginIds.length === 0) return [];
    if (params.activate !== true) {
      const bundledArtifactProviders = deps.resolveBundledPublicArtifactProviders?.({
        config: params.config,
        workspaceDir,
        env,
        onlyPluginIds: pluginIds,
      });
      if (bundledArtifactProviders) return bundledArtifactProviders;
    }
    const registry = loadOpenClawPlugins(
      buildPluginRuntimeLoadOptionsFromValues(
        {
          config: withActivatedPluginIds({
            config: params.config,
            pluginIds,
          }),
          activationSourceConfig: params.config,
          autoEnabledReasons: {},
          workspaceDir,
          env,
          logger: createPluginRuntimeLoaderLogger(),
        },
        {
          onlyPluginIds: pluginIds,
          cache: params.cache ?? true,
          activate: params.activate ?? false,
        },
      ),
    );
    return deps.mapRegistryProviders({
      registry,
      onlyPluginIds: pluginIds,
    });
  }
  const context = resolveWebProviderRuntimeContext(params, deps);
  const loadOptions = resolveWebProviderLoadOptions(context, params);
  const compatible = getLoadedRuntimePluginRegistry({
    env: context.env,
    loadOptions,
    workspaceDir: context.workspaceDir,
    requiredPluginIds: context.loadPluginIds,
  });
  const scopedPluginIds = context.onlyPluginIds;
  const hasExplicitEmptyScope = scopedPluginIds !== void 0 && scopedPluginIds.length === 0;
  const compatibleProviders = resolveRuntimeRegistryWebProviders({
    hasExplicitEmptyScope,
    mapRegistryProviders: deps.mapRegistryProviders,
    onlyPluginIds: context.onlyPluginIds,
    registry: compatible,
  });
  if (compatibleProviders?.shouldReturn) return compatibleProviders.providers;
  if (compatibleProviders) {
  }
  if (isPluginRegistryLoadInFlight(loadOptions)) return [];
  if (hasExplicitEmptyScope) return [];
  if (
    params.activate !== true &&
    context.loadPluginIds &&
    deps.resolveBundledRuntimeArtifactProviders
  ) {
    const bundledArtifactProviders = deps.resolveBundledRuntimeArtifactProviders({
      config: context.config,
      workspaceDir: context.workspaceDir,
      env: context.env,
      onlyPluginIds: context.loadPluginIds,
    });
    if (bundledArtifactProviders) return bundledArtifactProviders;
  }
  const registry = loadOpenClawPlugins(loadOptions);
  return deps.mapRegistryProviders({
    registry,
    onlyPluginIds: context.onlyPluginIds,
  });
}
/** Resolves web providers from the active runtime registry before falling back to plugin loading. */
function resolveRuntimeWebProviders(params, deps) {
  const runtimeRegistry = getLoadedRuntimePluginRegistry({
    env: params.env,
    workspaceDir: params.workspaceDir,
    requiredPluginIds: params.onlyPluginIds,
  });
  const runtimeProviders = resolveRuntimeRegistryWebProviders({
    hasExplicitEmptyScope: params.onlyPluginIds !== void 0 && params.onlyPluginIds.length === 0,
    mapRegistryProviders: deps.mapRegistryProviders,
    onlyPluginIds: params.onlyPluginIds,
    registry: runtimeRegistry,
  });
  if (runtimeProviders?.shouldReturn) return runtimeProviders.providers;
  return resolvePluginWebProviders(params, deps);
}
//#endregion
export { resolveRuntimeWebProviders as n, resolvePluginWebProviders as t };
