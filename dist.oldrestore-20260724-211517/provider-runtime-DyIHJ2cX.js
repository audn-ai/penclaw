import { t as sanitizeForLog } from "./ansi-D4OHEz5F.js";
import { l as resolveGpt5SystemPromptContribution } from "./gpt5-prompt-overlay-ClFTAwM7.js";
import { a as normalizeProviderModelIdWithManifest } from "./model-ref-shared-Bs7ONe2Q.js";
import { a as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BMgImu0m.js";
import { t as resolvePluginDiscoveryProvidersRuntime } from "./provider-discovery.runtime.js";
import {
  c as resolveProviderHookPlugin,
  i as resolveLoadedProviderRuntimePlugin,
  l as resolveProviderPluginsForHooks,
  n as ensureProviderRuntimePluginHandle,
  t as clearProviderRuntimePluginCacheForTest,
  u as resolveProviderRuntimePlugin,
} from "./provider-hook-runtime-UWRY5bYu.js";
import {
  n as findNormalizedProviderValue,
  r as normalizeProviderId,
} from "./provider-id-BIcU_2-A.js";
import {
  c as resolveExternalAuthProfileProviderPluginIds,
  d as resolveOwningPluginIdsForProvider,
  f as resolveOwningPluginIdsForProviderRef,
  m as resolveUsageHookProviderPluginContracts,
  r as resolveCatalogHookProviderPluginIds,
  s as resolveExternalAuthProfileCompatFallbackPluginIds,
} from "./providers-D0H29WPB.js";
import { t as getActivePluginRegistryWorkspaceDirFromState } from "./runtime-state-Bd0YsvqM.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings, g as sortUniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import {
  n as applyPluginTextReplacements,
  r as mergePluginTextTransforms,
  t as resolveRuntimeTextTransforms,
} from "./text-transforms.runtime-CUzg1NnO.js";
import { l as resolveBundledProviderPolicySurface } from "./thinking-CVcRbjTC.js";
//#region src/plugins/provider-runtime.ts
const log = createSubsystemLogger("plugins/provider-runtime");
const warnedExternalAuthFallbackPluginIds = /* @__PURE__ */ new Set();
function matchesProviderPluginRef(provider, providerId) {
  const normalized = normalizeProviderId(providerId);
  if (!normalized) return false;
  if (normalizeProviderId(provider.id) === normalized) return true;
  return [...(provider.aliases ?? []), ...(provider.hookAliases ?? [])].some(
    (alias) => normalizeProviderId(alias) === normalized,
  );
}
function resolveProviderHookRefs(provider, providerConfig, modelApi) {
  const refs = [provider];
  const apiRef = normalizeOptionalString(modelApi ?? providerConfig?.api);
  if (apiRef && normalizeProviderId(apiRef) !== normalizeProviderId(provider)) refs.push(apiRef);
  return uniqueStrings(refs);
}
function matchesAnyProviderPluginRef(provider, providerRefs) {
  return providerRefs.some((providerRef) => matchesProviderPluginRef(provider, providerRef));
}
function hasExplicitProviderRuntimePluginActivation(params) {
  if (!params.config) return true;
  const ownerPluginIds =
    resolveOwningPluginIdsForProvider({
      provider: params.provider,
      config: params.config,
      workspaceDir: params.workspaceDir,
      env: params.env,
    }) ?? [];
  if (ownerPluginIds.length === 0) return false;
  const allow = new Set(params.config.plugins?.allow ?? []);
  const entries = params.config.plugins?.entries ?? {};
  return ownerPluginIds.some((pluginId) => allow.has(pluginId) || entries[pluginId] !== void 0);
}
function hasConfiguredModelProvider(params) {
  return findNormalizedProviderValue(params.config?.models?.providers, params.provider) !== void 0;
}
function resetExternalAuthFallbackWarningCacheForTest() {
  warnedExternalAuthFallbackPluginIds.clear();
}
const testing = {
  clearProviderRuntimePluginCacheForTest,
  resetExternalAuthFallbackWarningCacheForTest,
};
function resolveProviderPluginsForCatalogHooks(params) {
  const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDirFromState();
  const env = params.env ?? process.env;
  const onlyPluginIds = resolveCatalogHookProviderPluginIds({
    config: params.config,
    workspaceDir,
    env,
  });
  if (onlyPluginIds.length === 0) return [];
  return resolveProviderPluginsForHooks({
    ...params,
    workspaceDir,
    env,
    onlyPluginIds,
  });
}
function runProviderDynamicModel(params) {
  return resolveProviderRuntimePlugin(params)?.resolveDynamicModel?.(params.context) ?? void 0;
}
function resolveProviderSystemPromptContribution(params) {
  const plugin = ensureProviderRuntimePluginHandle(params).plugin;
  const baseOverlay = resolveGpt5SystemPromptContribution({
    config: params.context.config ?? params.config,
    providerId: params.context.provider ?? params.provider,
    modelId: params.context.modelId,
    trigger: params.context.trigger,
  });
  return mergeProviderSystemPromptContributions(
    mergeProviderSystemPromptContributions(
      baseOverlay,
      plugin?.resolvePromptOverlay?.({
        ...params.context,
        baseOverlay,
      }) ?? void 0,
    ),
    plugin?.resolveSystemPromptContribution?.(params.context) ?? void 0,
  );
}
function mergeProviderSystemPromptContributions(base, override) {
  if (!base) return override;
  if (!override) return base;
  const stablePrefix = mergeUniquePromptSections(base.stablePrefix, override.stablePrefix);
  const dynamicSuffix = mergeUniquePromptSections(base.dynamicSuffix, override.dynamicSuffix);
  return {
    ...(stablePrefix ? { stablePrefix } : {}),
    ...(dynamicSuffix ? { dynamicSuffix } : {}),
    sectionOverrides: {
      ...base.sectionOverrides,
      ...override.sectionOverrides,
    },
  };
}
function mergeUniquePromptSections(...sections) {
  const uniqueSections = uniqueStrings(sections.filter((section) => Boolean(section?.trim())));
  return uniqueSections.length > 0 ? uniqueSections.join("\n\n") : void 0;
}
function transformProviderSystemPrompt(params) {
  const plugin = ensureProviderRuntimePluginHandle(params).plugin;
  const textTransforms = mergePluginTextTransforms(
    resolveRuntimeTextTransforms(),
    plugin?.textTransforms,
  );
  return applyPluginTextReplacements(
    plugin?.transformSystemPrompt?.(params.context) ?? params.context.systemPrompt,
    textTransforms?.input,
  );
}
function resolveProviderTextTransforms(params) {
  return mergePluginTextTransforms(
    resolveRuntimeTextTransforms(),
    ensureProviderRuntimePluginHandle(params).plugin?.textTransforms,
  );
}
async function prepareProviderDynamicModel(params) {
  await resolveProviderRuntimePlugin(params)?.prepareDynamicModel?.(params.context);
}
function shouldPreferProviderRuntimeResolvedModel(params) {
  return (
    resolveProviderRuntimePlugin(params)?.preferRuntimeResolvedModel?.(params.context) ?? false
  );
}
function normalizeProviderResolvedModelWithPlugin(params) {
  const context = {
    ...params.context,
    ...(params.context.config === void 0 && params.config !== void 0
      ? { config: params.config }
      : {}),
    ...(params.context.workspaceDir === void 0 && params.workspaceDir !== void 0
      ? { workspaceDir: params.workspaceDir }
      : {}),
  };
  return (
    resolveProviderRuntimePlugin({
      ...params,
      modelId: params.context.modelId,
    })?.normalizeResolvedModel?.(context) ?? void 0
  );
}
function applyProviderResolvedTransportWithPlugin(params) {
  const config = params.context.config ?? params.config;
  const workspaceDir = params.context.workspaceDir ?? params.workspaceDir;
  const normalized = normalizeProviderTransportWithPlugin({
    provider: params.provider,
    config,
    workspaceDir,
    env: params.env,
    modelId: params.context.modelId,
    context: {
      ...(config !== void 0 ? { config } : {}),
      ...(workspaceDir !== void 0 ? { workspaceDir } : {}),
      provider: params.context.provider,
      modelId: params.context.modelId,
      api: params.context.model.api,
      baseUrl: params.context.model.baseUrl,
    },
  });
  if (!normalized) return;
  const nextApi = normalized.api ?? params.context.model.api;
  const nextBaseUrl = normalized.baseUrl ?? params.context.model.baseUrl;
  if (nextApi === params.context.model.api && nextBaseUrl === params.context.model.baseUrl) return;
  return {
    ...params.context.model,
    api: nextApi,
    baseUrl: nextBaseUrl,
  };
}
function normalizeProviderModelIdWithPlugin(params) {
  return (
    normalizeOptionalString(
      resolveProviderHookPlugin(params)?.normalizeModelId?.(params.context),
    ) ?? normalizeProviderModelIdWithManifest(params)
  );
}
function normalizeProviderTransportWithPlugin(params) {
  const hasTransportChange = (normalized) =>
    (normalized.api ?? params.context.api) !== params.context.api ||
    (normalized.baseUrl ?? params.context.baseUrl) !== params.context.baseUrl;
  const context = {
    ...params.context,
    ...(params.context.config === void 0 && params.config !== void 0
      ? { config: params.config }
      : {}),
    ...(params.context.workspaceDir === void 0 && params.workspaceDir !== void 0
      ? { workspaceDir: params.workspaceDir }
      : {}),
  };
  const matchedPlugin = resolveProviderHookPlugin(params);
  const normalizedMatched = matchedPlugin?.normalizeTransport?.(context);
  if (normalizedMatched && hasTransportChange(normalizedMatched)) return normalizedMatched;
  if (hasConfiguredModelProvider(params)) return;
  for (const candidate of resolveProviderPluginsForHooks(params)) {
    if (!candidate.normalizeTransport || candidate === matchedPlugin) continue;
    const normalized = candidate.normalizeTransport(context);
    if (normalized && hasTransportChange(normalized)) return normalized;
  }
}
function normalizeProviderConfigWithPlugin(params) {
  const hasConfigChange = (normalized) => normalized !== params.context.providerConfig;
  const bundledSurface = resolveBundledProviderPolicySurface(params.provider);
  if (bundledSurface?.normalizeConfig) {
    const normalized = bundledSurface.normalizeConfig(params.context);
    return normalized && hasConfigChange(normalized) ? normalized : void 0;
  }
  if (!hasExplicitProviderRuntimePluginActivation(params)) return;
  if (params.allowRuntimePluginLoad === false) return;
  const normalizedMatched = resolveProviderRuntimePlugin(params)?.normalizeConfig?.(params.context);
  return normalizedMatched && hasConfigChange(normalizedMatched) ? normalizedMatched : void 0;
}
function applyProviderNativeStreamingUsageCompatWithPlugin(params) {
  if (params.allowRuntimePluginLoad === false) return;
  return (
    resolveProviderRuntimePlugin(params)?.applyNativeStreamingUsageCompat?.(params.context) ??
    void 0
  );
}
function resolveProviderConfigApiKeyWithPlugin(params) {
  const bundledSurface = resolveBundledProviderPolicySurface(params.provider);
  if (bundledSurface?.resolveConfigApiKey)
    return normalizeOptionalString(bundledSurface.resolveConfigApiKey(params.context));
  if (params.allowRuntimePluginLoad === false) return;
  return normalizeOptionalString(
    resolveProviderRuntimePlugin(params)?.resolveConfigApiKey?.(params.context),
  );
}
function resolveProviderReplayPolicyWithPlugin(params) {
  return resolveProviderRuntimePlugin(params)?.buildReplayPolicy?.(params.context) ?? void 0;
}
async function sanitizeProviderReplayHistoryWithPlugin(params) {
  return await resolveProviderRuntimePlugin(params)?.sanitizeReplayHistory?.(params.context);
}
async function validateProviderReplayTurnsWithPlugin(params) {
  return await resolveProviderRuntimePlugin(params)?.validateReplayTurns?.(params.context);
}
function normalizeProviderToolSchemasWithPlugin(params) {
  return (
    (params.allowRuntimePluginLoad === false
      ? (params.runtimeHandle?.plugin ?? resolveLoadedProviderRuntimePlugin(params))
      : ensureProviderRuntimePluginHandle(params).plugin
    )?.normalizeToolSchemas?.(params.context) ?? void 0
  );
}
function inspectProviderToolSchemasWithPlugin(params) {
  return (
    (params.allowRuntimePluginLoad === false
      ? (params.runtimeHandle?.plugin ?? resolveLoadedProviderRuntimePlugin(params))
      : ensureProviderRuntimePluginHandle(params).plugin
    )?.inspectToolSchemas?.(params.context) ?? void 0
  );
}
function resolveProviderReasoningOutputModeWithPlugin(params) {
  const mode = ensureProviderRuntimePluginHandle({
    provider: params.provider,
    modelId: params.context.modelId,
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
    runtimeHandle: params.runtimeHandle,
  }).plugin?.resolveReasoningOutputMode?.(params.context);
  return mode === "native" || mode === "tagged" ? mode : void 0;
}
function resolveProviderStreamFn(params) {
  return (
    (params.allowRuntimePluginLoad === false
      ? resolveLoadedProviderRuntimePlugin(params)
      : resolveProviderRuntimePlugin(params)
    )?.createStreamFn?.(params.context) ?? void 0
  );
}
function resolveProviderTransportTurnStateWithPlugin(params) {
  return (
    (params.allowRuntimePluginLoad === false
      ? resolveLoadedProviderRuntimePlugin(params)
      : resolveProviderRuntimePlugin(params)
    )?.resolveTransportTurnState?.(params.context) ?? void 0
  );
}
async function createProviderEmbeddingProvider(params) {
  return await resolveProviderRuntimePlugin(params)?.createEmbeddingProvider?.(params.context);
}
async function prepareProviderRuntimeAuth(params) {
  return await resolveProviderRuntimePlugin(params)?.prepareRuntimeAuth?.(params.context);
}
async function resolveProviderUsageAuthWithPlugin(params) {
  const plugin = resolveProviderRuntimePlugin(params);
  if (!plugin?.resolveUsageAuth) return;
  const result = await plugin.resolveUsageAuth(params.context);
  if (!result) return;
  return result;
}
async function resolveProviderUsageSnapshotWithPlugin(params) {
  return await resolveProviderRuntimePlugin(params)?.fetchUsageSnapshot?.(params.context);
}
/** Lists provider plugins that own the complete usage auth + fetch lifecycle. */
function listProviderUsagePluginDescriptors(params) {
  const pluginContracts = resolveUsageHookProviderPluginContracts(params);
  if (pluginContracts.length === 0) return [];
  const descriptors = /* @__PURE__ */ new Map();
  for (const contract of pluginContracts) {
    const declaredProviderIds = new Set(contract.providerIds);
    for (const plugin of resolveProviderPluginsForHooks({
      ...params,
      onlyPluginIds: [contract.pluginId],
    })) {
      if (!plugin.resolveUsageAuth || !plugin.fetchUsageSnapshot) continue;
      const provider = normalizeProviderId(plugin.id);
      if (!provider || !declaredProviderIds.has(provider) || descriptors.has(provider)) continue;
      descriptors.set(provider, {
        provider,
        displayName: normalizeOptionalString(plugin.label) ?? provider,
      });
    }
  }
  return [...descriptors.values()].toSorted((a, b) => a.provider.localeCompare(b.provider));
}
function matchesProviderContextOverflowWithPlugin(params) {
  const plugins = resolveProviderPluginsForScopedHook(params);
  for (const plugin of plugins)
    if (plugin.matchesContextOverflowError?.(params.context)) return true;
  return false;
}
function classifyProviderFailoverReasonWithPlugin(params) {
  const plugins = resolveProviderPluginsForScopedHook(params);
  for (const plugin of plugins) {
    const reason = plugin.classifyFailoverReason?.(params.context);
    if (reason) return reason;
  }
}
function resolveProviderPluginsForScopedHook(params) {
  if (!params.provider) return resolveProviderPluginsForHooks(params);
  const plugin = resolveProviderHookPlugin({
    ...params,
    provider: params.provider,
  });
  if (plugin) return [plugin];
  if (hasStructuredFailoverDescriptor(params.context)) return [];
  return resolveProviderPluginsForHooks(params);
}
function hasStructuredFailoverDescriptor(context) {
  return context.status !== void 0 || context.code !== void 0 || context.errorType !== void 0;
}
function formatProviderAuthProfileApiKeyWithPlugin(params) {
  return resolveProviderRuntimePlugin(params)?.formatApiKey?.(params.context);
}
async function refreshProviderOAuthCredentialWithPlugin(params) {
  return await resolveProviderRuntimePlugin(params)?.refreshOAuth?.(params.context);
}
async function buildProviderAuthDoctorHintWithPlugin(params) {
  return await resolveProviderRuntimePlugin(params)?.buildAuthDoctorHint?.(params.context);
}
function resolveProviderCacheTtlEligibility(params) {
  return resolveProviderRuntimePlugin(params)?.isCacheTtlEligible?.(params.context);
}
function resolveProviderBinaryThinking(params) {
  return resolveProviderRuntimePlugin(params)?.isBinaryThinking?.(params.context);
}
function resolveProviderXHighThinking(params) {
  return resolveProviderRuntimePlugin(params)?.supportsXHighThinking?.(params.context);
}
function resolveProviderThinkingProfile(params) {
  const bundledSurface = resolveBundledProviderPolicySurface(params.provider);
  if (bundledSurface?.resolveThinkingProfile)
    return bundledSurface.resolveThinkingProfile(params.context) ?? void 0;
  return resolveProviderRuntimePlugin(params)?.resolveThinkingProfile?.(params.context);
}
function resolveProviderDefaultThinkingLevel(params) {
  return resolveProviderRuntimePlugin(params)?.resolveDefaultThinkingLevel?.(params.context);
}
function applyProviderConfigDefaultsWithPlugin(params) {
  const bundledSurface = resolveBundledProviderPolicySurface(params.provider);
  if (bundledSurface?.applyConfigDefaults)
    return bundledSurface.applyConfigDefaults(params.context) ?? void 0;
  return resolveProviderRuntimePlugin(params)?.applyConfigDefaults?.(params.context) ?? void 0;
}
function resolveProviderModernModelRef(params) {
  return resolveProviderRuntimePlugin(params)?.isModernModelRef?.(params.context);
}
function buildProviderMissingAuthMessageWithPlugin(params) {
  return resolveProviderRuntimePlugin(params)?.buildMissingAuthMessage?.(params.context) ?? void 0;
}
function buildProviderUnknownModelHintWithPlugin(params) {
  return resolveProviderRuntimePlugin(params)?.buildUnknownModelHint?.(params.context) ?? void 0;
}
function resolveProviderSyntheticAuthWithPlugin(params) {
  const providerRefs = resolveProviderHookRefs(
    params.provider,
    params.context.providerConfig,
    params.modelApi,
  );
  const discoveryPluginIds = [
    ...new Set(
      providerRefs.flatMap(
        (provider) =>
          resolveOwningPluginIdsForProviderRef({
            provider,
            config: params.config,
            workspaceDir: params.workspaceDir,
            env: params.env,
          }) ?? [],
      ),
    ),
  ];
  const discoveryProvider = (
    discoveryPluginIds.length > 0
      ? resolvePluginDiscoveryProvidersRuntime({
          config: params.config,
          workspaceDir: params.workspaceDir,
          env: params.env,
          onlyPluginIds: discoveryPluginIds,
          discoveryEntriesOnly: true,
        })
      : []
  ).find((provider) => matchesAnyProviderPluginRef(provider, providerRefs));
  if (typeof discoveryProvider?.resolveSyntheticAuth === "function")
    return discoveryProvider.resolveSyntheticAuth(params.context) ?? void 0;
  const runtimeResolved = resolveProviderRuntimePlugin({
    ...params,
    applyAutoEnable: false,
    bundledProviderVitestCompat: false,
  })?.resolveSyntheticAuth?.(params.context);
  if (runtimeResolved) return runtimeResolved;
  for (const providerRef of providerRefs) {
    if (normalizeProviderId(providerRef) === normalizeProviderId(params.provider)) continue;
    const runtimeProviderResolved = resolveProviderRuntimePlugin({
      ...params,
      provider: providerRef,
      applyAutoEnable: false,
      bundledProviderVitestCompat: false,
    })?.resolveSyntheticAuth?.(params.context);
    if (runtimeProviderResolved) return runtimeProviderResolved;
  }
  if (providerRefs.length === 1)
    return resolvePluginDiscoveryProvidersRuntime({
      config: params.config,
      workspaceDir: params.workspaceDir,
      env: params.env,
    })
      .find((provider) => matchesAnyProviderPluginRef(provider, providerRefs))
      ?.resolveSyntheticAuth?.(params.context);
}
function resolveExternalAuthProfilesWithPlugins(params) {
  const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDirFromState();
  const env = params.env ?? process.env;
  const { manifestRegistry } = resolvePluginMetadataSnapshot({
    config: params.config ?? {},
    workspaceDir,
    env,
  });
  const externalAuthPluginIds = resolveExternalAuthProfileProviderPluginIds({
    config: params.config,
    workspaceDir,
    env,
    manifestRegistry,
  });
  const declaredPluginIds = new Set(externalAuthPluginIds);
  const fallbackPluginIds = resolveExternalAuthProfileCompatFallbackPluginIds({
    config: params.config,
    workspaceDir,
    env,
    declaredPluginIds,
    manifestRegistry,
  });
  const pluginIds = sortUniqueStrings([...externalAuthPluginIds, ...fallbackPluginIds]);
  if (pluginIds.length === 0) return [];
  const matches = [];
  for (const plugin of resolveProviderPluginsForHooks({
    ...params,
    workspaceDir,
    env,
    onlyPluginIds: pluginIds,
  })) {
    const profiles =
      plugin.resolveExternalAuthProfiles?.(params.context) ??
      plugin.resolveExternalOAuthProfiles?.(params.context);
    if (!profiles || profiles.length === 0) continue;
    const pluginId = plugin.pluginId ?? plugin.id;
    if (!declaredPluginIds.has(pluginId) && !warnedExternalAuthFallbackPluginIds.has(pluginId)) {
      warnedExternalAuthFallbackPluginIds.add(pluginId);
      log.warn(
        `Provider plugin "${sanitizeForLog(pluginId)}" uses external auth hooks without declaring contracts.externalAuthProviders. This compatibility fallback is deprecated and will be removed in a future release.`,
      );
    }
    matches.push(...profiles);
  }
  return matches;
}
function shouldDeferProviderSyntheticProfileAuthWithPlugin(params) {
  const providerRefs = resolveProviderHookRefs(
    params.provider,
    params.context.providerConfig,
    params.modelApi,
  );
  for (const providerRef of providerRefs) {
    const resolved = resolveProviderRuntimePlugin({
      ...params,
      provider: providerRef,
    })?.shouldDeferSyntheticProfileAuth?.(params.context);
    if (resolved !== void 0) return resolved;
  }
}
async function augmentModelCatalogWithProviderPlugins(params) {
  const supplemental = [];
  for (const plugin of resolveProviderPluginsForCatalogHooks(params)) {
    const next = await plugin.augmentModelCatalog?.(params.context);
    if (!next || next.length === 0) continue;
    supplemental.push(...next);
  }
  return supplemental;
}
//#endregion
export {
  resolveProviderStreamFn as A,
  sanitizeProviderReplayHistoryWithPlugin as B,
  resolveProviderBinaryThinking as C,
  resolveProviderModernModelRef as D,
  resolveProviderDefaultThinkingLevel as E,
  resolveProviderTransportTurnStateWithPlugin as F,
  validateProviderReplayTurnsWithPlugin as G,
  shouldPreferProviderRuntimeResolvedModel as H,
  resolveProviderUsageAuthWithPlugin as I,
  resolveProviderUsageSnapshotWithPlugin as L,
  resolveProviderSystemPromptContribution as M,
  resolveProviderTextTransforms as N,
  resolveProviderReasoningOutputModeWithPlugin as O,
  resolveProviderThinkingProfile as P,
  resolveProviderXHighThinking as R,
  resolveExternalAuthProfilesWithPlugins as S,
  resolveProviderConfigApiKeyWithPlugin as T,
  testing as U,
  shouldDeferProviderSyntheticProfileAuthWithPlugin as V,
  transformProviderSystemPrompt as W,
  normalizeProviderToolSchemasWithPlugin as _,
  buildProviderAuthDoctorHintWithPlugin as a,
  prepareProviderRuntimeAuth as b,
  classifyProviderFailoverReasonWithPlugin as c,
  inspectProviderToolSchemasWithPlugin as d,
  listProviderUsagePluginDescriptors as f,
  normalizeProviderResolvedModelWithPlugin as g,
  normalizeProviderModelIdWithPlugin as h,
  augmentModelCatalogWithProviderPlugins as i,
  resolveProviderSyntheticAuthWithPlugin as j,
  resolveProviderReplayPolicyWithPlugin as k,
  createProviderEmbeddingProvider as l,
  normalizeProviderConfigWithPlugin as m,
  applyProviderNativeStreamingUsageCompatWithPlugin as n,
  buildProviderMissingAuthMessageWithPlugin as o,
  matchesProviderContextOverflowWithPlugin as p,
  applyProviderResolvedTransportWithPlugin as r,
  buildProviderUnknownModelHintWithPlugin as s,
  applyProviderConfigDefaultsWithPlugin as t,
  formatProviderAuthProfileApiKeyWithPlugin as u,
  normalizeProviderTransportWithPlugin as v,
  resolveProviderCacheTtlEligibility as w,
  refreshProviderOAuthCredentialWithPlugin as x,
  prepareProviderDynamicModel as y,
  runProviderDynamicModel as z,
};
