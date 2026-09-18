import { n as resolveBundledPluginsDir } from "./bundled-dir-CehpKn-r.js";
import { r as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-DGhQ40qh.js";
import { t as loadPluginManifestRegistry } from "./manifest-registry-CXy9BBfE.js";
import { n as resolveClaudeThinkingProfile } from "./provider-claude-thinking-CsXQZZNW.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import {
  n as resolveTrustedExternalProviderPolicySurface,
  t as resolveDirectBundledProviderPolicySurface,
} from "./provider-policy-surface-pBdKmXxg.js";
import { t as PLUGIN_REGISTRY_STATE } from "./runtime-state-key-Cno8k69C.js";
import {
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import {
  p as resolveThinkingDefaultForModel$1,
  r as THINKING_LEVEL_RANKS,
  s as normalizeThinkLevel,
  t as BASE_THINKING_LEVELS,
} from "./thinking.shared-BWnbgBUO.js";
//#region src/plugins/provider-public-artifacts.ts
function resolveBundledProviderPolicyPluginId(providerId, options = {}) {
  const normalizedProviderId = normalizeProviderId(providerId);
  if (!normalizedProviderId) return null;
  if (!resolveBundledPluginsDir()) return null;
  const registry = options.manifestRegistry ?? loadPluginManifestRegistry();
  for (const plugin of registry.plugins.toSorted((left, right) =>
    left.id.localeCompare(right.id),
  )) {
    if (plugin.origin !== "bundled") continue;
    if (pluginOwnsProviderPolicyRef(plugin, normalizedProviderId)) return plugin.id;
  }
  return null;
}
function pluginOwnsProviderPolicyRef(plugin, normalizedProviderId) {
  const ownedProviders = new Set(
    [...plugin.providers, ...plugin.cliBackends]
      .map((provider) => normalizeProviderId(provider))
      .filter(Boolean),
  );
  if (ownedProviders.has(normalizedProviderId)) return true;
  for (const [rawAlias, rawTarget] of Object.entries(plugin.providerAuthAliases ?? {})) {
    const alias = normalizeProviderId(rawAlias);
    const target = normalizeProviderId(rawTarget);
    if (alias === normalizedProviderId && ownedProviders.has(target)) return true;
  }
  return false;
}
/** Resolves provider policy hooks for a bundled provider or its owning plugin. */
function resolveBundledProviderPolicySurface(providerId, options = {}) {
  const normalizedProviderId = normalizeProviderId(providerId);
  if (!normalizedProviderId) return null;
  const directSurface = resolveDirectBundledProviderPolicySurface(normalizedProviderId);
  if (directSurface) return directSurface;
  const ownerPluginId = resolveBundledProviderPolicyPluginId(normalizedProviderId, options);
  if (!ownerPluginId || ownerPluginId === normalizedProviderId) return null;
  return resolveDirectBundledProviderPolicySurface(ownerPluginId);
}
/** Resolves provider policy hooks from bundled or trusted official plugin artifacts. */
function resolveProviderPolicySurface(providerId, options = {}) {
  const bundledSurface = resolveBundledProviderPolicySurface(providerId, options);
  if (bundledSurface) return bundledSurface;
  const normalizedProviderId = normalizeProviderId(providerId);
  if (!normalizedProviderId || !options.manifestRegistry) return null;
  for (const plugin of options.manifestRegistry.plugins.toSorted((left, right) =>
    left.id.localeCompare(right.id),
  ))
    if (
      pluginOwnsProviderPolicyRef(plugin, normalizedProviderId) &&
      plugin.trustedOfficialInstall === true
    ) {
      const surface = resolveTrustedExternalProviderPolicySurface({
        pluginId: plugin.id,
        pluginRoot: plugin.rootDir,
        trustedOfficialInstall: plugin.trustedOfficialInstall,
      });
      if (surface) return surface;
    }
  return null;
}
//#endregion
//#region src/plugins/provider-thinking.ts
function matchesProviderId(provider, providerId) {
  const normalized = normalizeProviderId(providerId);
  if (!normalized) return false;
  if (normalizeProviderId(provider.id) === normalized) return true;
  return [...(provider.aliases ?? []), ...(provider.hookAliases ?? [])].some(
    (alias) => normalizeProviderId(alias) === normalized,
  );
}
function resolveActiveThinkingProvider(providerId) {
  const activeProvider = globalThis[PLUGIN_REGISTRY_STATE]?.activeRegistry?.providers?.find(
    (entry) => {
      return matchesProviderId(entry.provider, providerId);
    },
  )?.provider;
  if (activeProvider) return activeProvider;
}
function resolveProviderPublicPolicySurface(providerId) {
  return resolveProviderPolicySurface(providerId, {
    manifestRegistry: getCurrentPluginMetadataSnapshot({
      allowScopedSnapshot: true,
      allowWorkspaceScopedSnapshot: true,
    })?.manifestRegistry,
  });
}
/** Resolves whether a provider treats thinking as binary on/off. */
function resolveProviderBinaryThinking(params) {
  return resolveActiveThinkingProvider(params.provider)?.isBinaryThinking?.(params.context);
}
/** Resolves whether a provider supports xhigh thinking. */
function resolveProviderXHighThinking(params) {
  return resolveActiveThinkingProvider(params.provider)?.supportsXHighThinking?.(params.context);
}
/** Resolves a provider thinking profile from active plugins or bundled policy surface. */
function resolveProviderThinkingProfile(params) {
  const activeProfile = resolveActiveThinkingProvider(params.provider)?.resolveThinkingProfile?.(
    params.context,
  );
  if (activeProfile !== void 0) return activeProfile;
  return resolveProviderPublicPolicySurface(params.provider)?.resolveThinkingProfile?.(
    params.context,
  );
}
/** Resolves the provider default thinking level from the active plugin registry. */
function resolveProviderDefaultThinkingLevel(params) {
  return resolveActiveThinkingProvider(params.provider)?.resolveDefaultThinkingLevel?.(
    params.context,
  );
}
//#endregion
//#region src/auto-reply/thinking.ts
function buildCatalogModelKey(provider, model) {
  const providerId = provider.trim();
  const modelId = model.trim();
  if (!providerId) return modelId;
  if (!modelId) return providerId;
  return normalizeOptionalLowercaseString(modelId)?.startsWith(
    `${normalizeOptionalLowercaseString(providerId)}/`,
  )
    ? modelId
    : `${providerId}/${modelId}`;
}
function resolveThinkingPolicyContext(params) {
  const providerRaw = normalizeOptionalString(params.provider);
  const normalizedProvider = providerRaw ? normalizeProviderId(providerRaw) : "";
  const modelId = normalizeOptionalString(params.model) ?? "";
  const modelKey = normalizeOptionalLowercaseString(params.model) ?? "";
  const selectedCatalogKey =
    normalizedProvider && modelId ? buildCatalogModelKey(normalizedProvider, modelId) : void 0;
  const candidate = params.catalog?.find(
    (entry) =>
      selectedCatalogKey !== void 0 &&
      buildCatalogModelKey(normalizeProviderId(entry.provider), entry.id) === selectedCatalogKey,
  );
  return {
    normalizedProvider,
    modelId,
    modelKey,
    api: candidate?.api,
    reasoning: candidate?.reasoning,
    ...(candidate?.params ? { params: candidate.params } : {}),
    compat: candidate?.compat,
  };
}
function catalogSupportsXHigh(compat) {
  const efforts = compat?.supportedReasoningEfforts;
  if (!Array.isArray(efforts)) return false;
  return efforts.some((effort) => normalizeThinkLevel(effort) === "xhigh");
}
function normalizeProfileLevel(level) {
  const normalized = normalizeThinkLevel(level.id);
  if (!normalized) return;
  return {
    id: normalized,
    label: normalizeOptionalString(level.label) ?? normalized,
    rank: Number.isFinite(level.rank) ? level.rank : THINKING_LEVEL_RANKS[normalized],
  };
}
function normalizeThinkingProfile(profile) {
  const byId = /* @__PURE__ */ new Map();
  for (const raw of profile.levels) {
    const level = normalizeProfileLevel(raw);
    if (level) byId.set(level.id, level);
  }
  const levels = [...byId.values()].toSorted((a, b) => a.rank - b.rank);
  const rawDefaultLevel = profile.defaultLevel ? normalizeThinkLevel(profile.defaultLevel) : void 0;
  return {
    levels,
    defaultLevel: rawDefaultLevel && byId.has(rawDefaultLevel) ? rawDefaultLevel : void 0,
  };
}
function buildBaseThinkingProfile(defaultLevel) {
  return {
    levels: BASE_THINKING_LEVELS.map((id) => ({
      id,
      label: id,
      rank: THINKING_LEVEL_RANKS[id],
    })),
    defaultLevel,
  };
}
function buildOffOnlyThinkingProfile() {
  return {
    levels: [
      {
        id: "off",
        label: "off",
        rank: THINKING_LEVEL_RANKS.off,
      },
    ],
    defaultLevel: "off",
  };
}
function buildBinaryThinkingProfile(defaultLevel) {
  return {
    levels: [
      {
        id: "off",
        label: "off",
        rank: THINKING_LEVEL_RANKS.off,
      },
      {
        id: "low",
        label: "on",
        rank: THINKING_LEVEL_RANKS.low,
      },
    ],
    defaultLevel,
  };
}
function appendProfileLevel(profile, id) {
  if (profile.levels.some((level) => level.id === id)) return;
  profile.levels.push({
    id,
    label: id,
    rank: THINKING_LEVEL_RANKS[id],
  });
  profile.levels = profile.levels.toSorted((a, b) => a.rank - b.rank);
}
/** Resolve supported thinking levels and default for a provider/model pair. */
function resolveThinkingProfile(params) {
  const context = resolveThinkingPolicyContext(params);
  if (!context.normalizedProvider) return buildBaseThinkingProfile();
  const providerContext = {
    provider: context.normalizedProvider,
    modelId: context.modelId,
    agentRuntime: params.agentRuntime,
    reasoning: context.reasoning,
    ...(context.params ? { params: context.params } : {}),
    compat: context.compat,
  };
  const providerProfile = resolveProviderThinkingProfile({
    provider: context.normalizedProvider,
    context: providerContext,
  });
  const anthropicMessagesProfile =
    context.api === "anthropic-messages"
      ? resolveClaudeThinkingProfile(context.modelId, context.params, { includeNativeMax: true })
      : void 0;
  const pluginProfile = providerProfile ?? anthropicMessagesProfile;
  if (pluginProfile) {
    const normalized = normalizeThinkingProfile(pluginProfile);
    if (
      normalized.levels.length > 0 &&
      (context.reasoning !== false || pluginProfile.preserveWhenCatalogReasoningFalse === true)
    )
      return normalized;
  }
  if (context.reasoning === false) return buildOffOnlyThinkingProfile();
  const defaultLevel = resolveProviderDefaultThinkingLevel({
    provider: context.normalizedProvider,
    context: providerContext,
  });
  const binaryDecision = resolveProviderBinaryThinking({
    provider: context.normalizedProvider,
    context: {
      provider: context.normalizedProvider,
      modelId: context.modelId,
    },
  });
  const profile =
    binaryDecision === true
      ? buildBinaryThinkingProfile(defaultLevel)
      : buildBaseThinkingProfile(defaultLevel);
  if (binaryDecision !== true && catalogSupportsXHigh(context.compat))
    appendProfileLevel(profile, "xhigh");
  const policyContext = {
    provider: context.normalizedProvider,
    modelId: context.modelKey || context.modelId,
  };
  if (
    binaryDecision !== true &&
    resolveProviderXHighThinking({
      provider: context.normalizedProvider,
      context: policyContext,
    }) === true
  )
    appendProfileLevel(profile, "xhigh");
  return profile;
}
function supportsThinkingLevel(provider, model, level, catalog, agentRuntime) {
  return resolveThinkingProfile({
    provider,
    model,
    catalog,
    agentRuntime,
  }).levels.some((entry) => entry.id === level);
}
/** List thinking level ids supported by provider/model. */
function listThinkingLevels(provider, model, catalog, agentRuntime) {
  return resolveThinkingProfile({
    provider,
    model,
    catalog,
    agentRuntime,
  }).levels.map((level) => level.id);
}
/** List labeled thinking level options supported by provider/model. */
function listThinkingLevelOptions(provider, model, catalog, agentRuntime) {
  return resolveThinkingProfile({
    provider,
    model,
    catalog,
    agentRuntime,
  }).levels.map(({ id, label }) => ({
    id,
    label,
  }));
}
/** List display labels for thinking levels supported by provider/model. */
function listThinkingLevelLabels(provider, model, catalog, agentRuntime) {
  return listThinkingLevelOptions(provider, model, catalog, agentRuntime).map(
    (level) => level.label,
  );
}
/** Format supported thinking level labels for command/status output. */
function formatThinkingLevels(provider, model, separator = ", ", catalog, agentRuntime) {
  return resolveThinkingProfile({
    provider,
    model,
    catalog,
    agentRuntime,
  })
    .levels.map(({ label }) => label)
    .join(separator);
}
/** Resolve the default thinking level for a provider/model pair. */
function resolveThinkingDefaultForModel(params) {
  const profile = resolveThinkingProfile({
    provider: params.provider,
    model: params.model,
    catalog: params.catalog,
    agentRuntime: params.agentRuntime,
  });
  if (profile.defaultLevel) return profile.defaultLevel;
  if (resolveThinkingDefaultForModel$1(params) === "off") return "off";
  return resolveSupportedThinkingLevelFromProfile(profile, "medium");
}
/** Return whether a specific thinking level is supported by provider/model. */
function isThinkingLevelSupported(params) {
  return supportsThinkingLevel(
    params.provider,
    params.model,
    params.level,
    params.catalog,
    params.agentRuntime,
  );
}
function resolveSupportedThinkingLevelFromProfile(profile, level) {
  if (profile.levels.some((entry) => entry.id === level)) return level;
  const requestedRank = THINKING_LEVEL_RANKS[level];
  const ranked = profile.levels.toSorted((a, b) => b.rank - a.rank);
  return (
    ranked.find((entry) => entry.id !== "off" && entry.rank <= requestedRank)?.id ??
    ranked.findLast((entry) => entry.id !== "off")?.id ??
    "off"
  );
}
/** Clamp a requested thinking level to the closest supported provider/model level. */
function resolveSupportedThinkingLevel(params) {
  return resolveSupportedThinkingLevelFromProfile(
    resolveThinkingProfile({
      provider: params.provider,
      model: params.model,
      catalog: params.catalog,
      agentRuntime: params.agentRuntime,
    }),
    params.level,
  );
}
//#endregion
export {
  listThinkingLevels as a,
  resolveThinkingProfile as c,
  listThinkingLevelOptions as i,
  resolveBundledProviderPolicySurface as l,
  isThinkingLevelSupported as n,
  resolveSupportedThinkingLevel as o,
  listThinkingLevelLabels as r,
  resolveThinkingDefaultForModel as s,
  formatThinkingLevels as t,
};
