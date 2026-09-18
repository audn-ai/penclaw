import { r as normalizeOptionalAccountId } from "./account-id-C7N4Rwku.js";
import { t as loadChannelSecretContractApi } from "./channel-contract-api-9nE4dbUf.js";
import { i as resolveChannelDefaultAccountId } from "./helpers-BzNF0htn.js";
import { n as listReadOnlyChannelPluginsForConfig } from "./read-only-D7WTn1n5.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import "./target-registry-Db69vEew.js";
import { g as sortUniqueStrings } from "./string-normalization-CRyoFBPt.js";
import {
  r as discoverConfigSecretTargetsByIds,
  s as listSecretTargetRegistryEntries,
} from "./target-registry-query-CH3KJb3I.js";
import { t as resolvePluginWebFetchProviders } from "./web-fetch-providers.runtime.js";
import { t as resolvePluginWebSearchProviders } from "./web-search-providers.runtime.js";
import {
  o as sortWebFetchProvidersForAutoDetect,
  r as sortWebSearchProvidersForAutoDetect,
} from "./web-search-providers.shared-CArHDy3x.js";
//#region src/cli/command-secret-targets.ts
const STATIC_QR_REMOTE_TARGET_IDS = ["gateway.remote.token", "gateway.remote.password"];
const STATIC_MODEL_TARGET_IDS = [
  "models.providers.*.apiKey",
  "models.providers.*.headers.*",
  "models.providers.*.request.headers.*",
  "models.providers.*.request.auth.token",
  "models.providers.*.request.auth.value",
  "models.providers.*.request.proxy.tls.ca",
  "models.providers.*.request.proxy.tls.cert",
  "models.providers.*.request.proxy.tls.key",
  "models.providers.*.request.proxy.tls.passphrase",
  "models.providers.*.request.tls.ca",
  "models.providers.*.request.tls.cert",
  "models.providers.*.request.tls.key",
  "models.providers.*.request.tls.passphrase",
];
const STATIC_AGENT_RUNTIME_BASE_TARGET_IDS = [
  ...STATIC_MODEL_TARGET_IDS,
  "agents.defaults.memorySearch.remote.apiKey",
  "agents.list[].memorySearch.remote.apiKey",
  "agents.list[].tts.providers.*.apiKey",
  "messages.tts.providers.*.apiKey",
  "skills.entries.*.apiKey",
  "tools.web.search.apiKey",
  "tools.web.fetch.firecrawl.apiKey",
];
const STATIC_MEMORY_EMBEDDING_TARGET_IDS = [
  ...STATIC_MODEL_TARGET_IDS,
  "agents.defaults.memorySearch.remote.apiKey",
  "agents.list[].memorySearch.remote.apiKey",
];
const STATIC_TTS_TARGET_IDS = [
  ...STATIC_MODEL_TARGET_IDS,
  "agents.list[].tts.providers.*.apiKey",
  "messages.tts.providers.*.apiKey",
];
const STATIC_GATEWAY_AUTH_TARGET_IDS = [
  "gateway.auth.token",
  "gateway.auth.password",
  "gateway.remote.token",
  "gateway.remote.password",
];
const STATIC_STATUS_TARGET_IDS = [
  ...STATIC_GATEWAY_AUTH_TARGET_IDS,
  "agents.defaults.memorySearch.remote.apiKey",
  "agents.list[].memorySearch.remote.apiKey",
];
const STATIC_SECURITY_AUDIT_TARGET_IDS = [...STATIC_GATEWAY_AUTH_TARGET_IDS];
function idsByPrefix(prefixes) {
  return listSecretTargetRegistryEntries()
    .map((entry) => entry.id)
    .filter((id) => prefixes.some((prefix) => id.startsWith(prefix)))
    .toSorted();
}
const STATIC_CAPABILITY_WEB_SEARCH_TARGET_IDS = [
  "tools.web.search.apiKey",
  "tools.web.search.*.apiKey",
];
const STATIC_CAPABILITY_WEB_FETCH_TARGET_IDS = ["tools.web.fetch.firecrawl.apiKey"];
let cachedCommandSecretTargets;
let cachedAgentRuntimeBaseTargetIds;
let cachedCapabilityWebFetchTargetIds;
let cachedCapabilityWebSearchTargetIds;
let cachedChannelSecretTargetIds;
function getChannelSecretTargetIds() {
  cachedChannelSecretTargetIds ??= idsByPrefix(["channels."]);
  return cachedChannelSecretTargetIds;
}
function isPluginWebCredentialTargetId(id) {
  const segments = id.split(".");
  if (segments[0] !== "plugins" || segments[1] !== "entries" || segments[3] !== "config")
    return false;
  const configPath = segments.slice(4).join(".");
  return configPath === "webSearch.apiKey" || configPath === "webFetch.apiKey";
}
function isPluginWebSearchCredentialTargetId(id) {
  const segments = id.split(".");
  if (segments[0] !== "plugins" || segments[1] !== "entries" || segments[3] !== "config")
    return false;
  return segments.slice(4).join(".") === "webSearch.apiKey";
}
function isPluginWebFetchCredentialTargetId(id) {
  const segments = id.split(".");
  if (segments[0] !== "plugins" || segments[1] !== "entries" || segments[3] !== "config")
    return false;
  return segments.slice(4).join(".") === "webFetch.apiKey";
}
function getCapabilityWebSearchTargetIds() {
  cachedCapabilityWebSearchTargetIds ??= sortUniqueStrings([
    ...STATIC_CAPABILITY_WEB_SEARCH_TARGET_IDS,
    ...listSecretTargetRegistryEntries()
      .map((entry) => entry.id)
      .filter(isPluginWebSearchCredentialTargetId),
  ]);
  return cachedCapabilityWebSearchTargetIds;
}
function getCapabilityWebFetchTargetIds() {
  cachedCapabilityWebFetchTargetIds ??= sortUniqueStrings([
    ...STATIC_CAPABILITY_WEB_FETCH_TARGET_IDS,
    ...listSecretTargetRegistryEntries()
      .map((entry) => entry.id)
      .filter(isPluginWebFetchCredentialTargetId),
  ]);
  return cachedCapabilityWebFetchTargetIds;
}
function isConfiguredSecretCandidate(value) {
  if (typeof value === "string") return value.trim().length > 0;
  return value !== void 0 && value !== null;
}
function resolveFetchConfig(config) {
  const fetch = config.tools?.web?.fetch;
  return fetch && typeof fetch === "object" && !Array.isArray(fetch) ? fetch : void 0;
}
function resolveSearchConfig(config) {
  const search = config.tools?.web?.search;
  return search && typeof search === "object" && !Array.isArray(search) ? search : void 0;
}
function pathPatternMatchesConcretePath(pathPattern, path) {
  const pathSegments = path.split(".");
  const patternSegments = pathPattern.split(".");
  let pathIndex = 0;
  for (const segment of patternSegments) {
    if (segment === "*") {
      if (!pathSegments[pathIndex]) return false;
      pathIndex += 1;
      continue;
    }
    if (segment.endsWith("[]")) {
      const field = segment.slice(0, -2);
      if (pathSegments[pathIndex] !== field || !/^\d+$/.test(pathSegments[pathIndex + 1] ?? ""))
        return false;
      pathIndex += 2;
      continue;
    }
    if (pathSegments[pathIndex] !== segment) return false;
    pathIndex += 1;
  }
  return pathIndex === pathSegments.length;
}
function targetIdsForConfigPath(path) {
  return listSecretTargetRegistryEntries()
    .filter((entry) => pathPatternMatchesConcretePath(entry.pathPattern ?? entry.id, path))
    .map((entry) => entry.id)
    .toSorted();
}
function addConfigPathTargets(params) {
  const targetIds = targetIdsForConfigPath(params.path);
  if (targetIds.length === 0) return false;
  for (const targetId of targetIds) {
    params.targetIds.add(targetId);
    if (targetId !== params.path) params.allowedPaths.add(params.path);
  }
  params.targetPaths.add(params.path);
  return true;
}
function addConfiguredConfigPathTargets(params) {
  const targetIds = targetIdsForConfigPath(params.path);
  if (targetIds.length === 0) return false;
  if (
    !discoverConfigSecretTargetsByIds(params.config, toTargetIdSet(targetIds)).some(
      (target) => target.path === params.path,
    )
  )
    return false;
  return addConfigPathTargets(params);
}
function normalizeProviderId(value) {
  return typeof value === "string" && value.trim() ? value.trim().toLowerCase() : void 0;
}
function modelProviderCredentialFallbackPathForWebSearchProvider(providerId) {
  switch (providerId) {
    case "gemini":
      return "models.providers.google.apiKey";
    case "ollama":
      return "models.providers.ollama.apiKey";
    default:
      return;
  }
}
function discoverForcedActivePaths(config, targetIds, allowedPaths) {
  const forcedActivePaths = /* @__PURE__ */ new Set();
  for (const target of discoverConfigSecretTargetsByIds(config, targetIds)) {
    if (allowedPaths && !allowedPaths.has(target.path)) continue;
    forcedActivePaths.add(target.path);
  }
  return forcedActivePaths.size > 0 ? forcedActivePaths : void 0;
}
function discoverConfiguredAllowedPaths(config, targetIds) {
  const allowedPaths = /* @__PURE__ */ new Set();
  for (const target of discoverConfigSecretTargetsByIds(config, targetIds))
    allowedPaths.add(target.path);
  return allowedPaths.size > 0 ? allowedPaths : void 0;
}
function mergeConfiguredAllowedPaths(params) {
  const allowedPaths = /* @__PURE__ */ new Set();
  for (const path of discoverConfiguredAllowedPaths(params.config, params.baseTargetIds) ?? [])
    allowedPaths.add(path);
  for (const path of params.concreteFallbackPaths) allowedPaths.add(path);
  return allowedPaths.size > 0 ? allowedPaths : void 0;
}
function resolveSelectedWebFetchProviderId(config, providerId) {
  return (
    normalizeProviderId(providerId) ?? normalizeProviderId(resolveFetchConfig(config)?.provider)
  );
}
function resolveSelectedWebSearchProviderId(config, providerId) {
  return (
    normalizeProviderId(providerId) ?? normalizeProviderId(resolveSearchConfig(config)?.provider)
  );
}
function withSelectedWebProviderForDiscovery(config, kind, providerId) {
  if (!providerId) return config;
  const next = structuredClone(config);
  const tools = (next.tools ??= {});
  const web = (tools.web ??= {});
  const existing = web[kind];
  web[kind] =
    existing && typeof existing === "object" && !Array.isArray(existing)
      ? {
          ...existing,
          provider: providerId,
        }
      : { provider: providerId };
  return next;
}
function hasConfiguredFetchCredential(params) {
  return (
    isConfiguredSecretCandidate(params.provider.getConfiguredCredentialValue?.(params.config)) ||
    isConfiguredSecretCandidate(
      params.provider.getCredentialValue(resolveFetchConfig(params.config)),
    )
  );
}
function hasConfiguredSearchCredential(params) {
  return (
    isConfiguredSecretCandidate(params.provider.getConfiguredCredentialValue?.(params.config)) ||
    isConfiguredSecretCandidate(
      params.provider.getCredentialValue(resolveSearchConfig(params.config)),
    )
  );
}
function addConfiguredSearchCredentialTargetIds(params) {
  const searchConfig = resolveSearchConfig(params.config);
  if (!searchConfig) return;
  const configuredCredential = params.provider.getCredentialValue(searchConfig);
  if (!isConfiguredSecretCandidate(configuredCredential)) return;
  const pluginCredential = params.provider.getConfiguredCredentialValue?.(params.config);
  if (isConfiguredSecretCandidate(pluginCredential) && configuredCredential !== pluginCredential)
    return;
  if (configuredCredential === searchConfig.apiKey)
    addConfigPathTargets({
      ...params,
      path: "tools.web.search.apiKey",
    });
  const scopedConfig = searchConfig[params.provider.id];
  if (isRecord(scopedConfig) && configuredCredential === scopedConfig.apiKey)
    addConfigPathTargets({
      ...params,
      path: `tools.web.search.${params.provider.id}.apiKey`,
    });
}
function addConfiguredFetchCredentialTargetIds(params) {
  const fetchConfig = resolveFetchConfig(params.config);
  if (!fetchConfig) return;
  const configuredCredential = params.provider.getCredentialValue(fetchConfig);
  if (!isConfiguredSecretCandidate(configuredCredential)) return;
  const pluginCredential = params.provider.getConfiguredCredentialValue?.(params.config);
  if (isConfiguredSecretCandidate(pluginCredential) && configuredCredential !== pluginCredential)
    return;
  const scopedConfig = fetchConfig[params.provider.id];
  if (isRecord(scopedConfig) && configuredCredential === scopedConfig.apiKey)
    addConfigPathTargets({
      ...params,
      path: `tools.web.fetch.${params.provider.id}.apiKey`,
    });
}
function emptySelectedProviderTargetIds() {
  return {
    matchedProvider: false,
    targetIds: [],
    targetPaths: [],
    allowedPaths: [],
    fallbackTargetIds: [],
    fallbackPaths: [],
  };
}
function createSelectedProviderTargetState() {
  return {
    targetIds: /* @__PURE__ */ new Set(),
    targetPaths: /* @__PURE__ */ new Set(),
    allowedPaths: /* @__PURE__ */ new Set(),
    fallbackTargetIds: /* @__PURE__ */ new Set(),
    fallbackPaths: /* @__PURE__ */ new Set(),
  };
}
function toSelectedProviderTargetIds(params) {
  return {
    matchedProvider: params.matchedProvider,
    targetIds: [...params.state.targetIds].toSorted(),
    targetPaths: [...params.state.targetPaths].toSorted(),
    allowedPaths: [...params.state.allowedPaths].toSorted(),
    fallbackTargetIds: [...params.state.fallbackTargetIds].toSorted(),
    fallbackPaths: [...params.state.fallbackPaths].toSorted(),
  };
}
function addFallbackPathTargets(params) {
  const targetParams = {
    path: params.path,
    targetIds: params.targetIds,
    targetPaths: params.targetPaths,
    allowedPaths: params.allowedPaths,
  };
  const before = new Set(params.targetIds);
  const added = params.addTargets(targetParams);
  for (const targetId of params.targetIds)
    if (!before.has(targetId)) params.fallbackTargetIds.add(targetId);
  if (added) params.fallbackPaths.add(params.path);
}
function addSelectedProviderCredentialTargets(params) {
  if (params.provider.credentialPath.trim())
    addConfigPathTargets({
      path: params.provider.credentialPath,
      targetIds: params.state.targetIds,
      targetPaths: params.state.targetPaths,
      allowedPaths: params.state.allowedPaths,
    });
  params.addConfiguredCredentialTargetIds({
    config: params.config,
    provider: params.provider,
    targetIds: params.state.targetIds,
    targetPaths: params.state.targetPaths,
    allowedPaths: params.state.allowedPaths,
  });
  if (params.hasConfiguredCredential(params.provider)) return true;
  const fallbackPath = params.provider
    .getConfiguredCredentialFallback?.(params.config)
    ?.path?.trim();
  if (fallbackPath)
    addFallbackPathTargets({
      path: fallbackPath,
      targetIds: params.state.targetIds,
      targetPaths: params.state.targetPaths,
      allowedPaths: params.state.allowedPaths,
      fallbackTargetIds: params.state.fallbackTargetIds,
      fallbackPaths: params.state.fallbackPaths,
      addTargets: addConfigPathTargets,
    });
  return false;
}
function getCapabilityWebSearchSelectedProviderTargetIds(config, providerId) {
  const selectedProviderId = resolveSelectedWebSearchProviderId(config, providerId);
  if (!selectedProviderId) return emptySelectedProviderTargetIds();
  const state = createSelectedProviderTargetState();
  const providers = resolvePluginWebSearchProviders({
    config: withSelectedWebProviderForDiscovery(config, "search", normalizeProviderId(providerId)),
  }).filter((provider) => provider.id === selectedProviderId);
  for (const provider of providers) {
    if (
      addSelectedProviderCredentialTargets({
        config,
        provider,
        state,
        addConfiguredCredentialTargetIds: addConfiguredSearchCredentialTargetIds,
        hasConfiguredCredential: (entry) =>
          hasConfiguredSearchCredential({
            provider: entry,
            config,
          }),
      })
    )
      continue;
    const modelFallbackPath =
      modelProviderCredentialFallbackPathForWebSearchProvider(selectedProviderId);
    if (modelFallbackPath && !state.fallbackPaths.has(modelFallbackPath))
      addFallbackPathTargets({
        path: modelFallbackPath,
        targetIds: state.targetIds,
        targetPaths: state.targetPaths,
        allowedPaths: state.allowedPaths,
        fallbackTargetIds: state.fallbackTargetIds,
        fallbackPaths: state.fallbackPaths,
        addTargets: (targetParams) =>
          addConfiguredConfigPathTargets({
            config,
            ...targetParams,
          }),
      });
  }
  return toSelectedProviderTargetIds({
    matchedProvider: providers.length > 0,
    state,
  });
}
function getCapabilityWebFetchSelectedProviderTargetIds(config, providerId) {
  const selectedProviderId = resolveSelectedWebFetchProviderId(config, providerId);
  if (!selectedProviderId) return emptySelectedProviderTargetIds();
  const state = createSelectedProviderTargetState();
  const providers = resolvePluginWebFetchProviders({
    config: withSelectedWebProviderForDiscovery(config, "fetch", normalizeProviderId(providerId)),
  }).filter((provider) => provider.id === selectedProviderId);
  for (const provider of providers)
    addSelectedProviderCredentialTargets({
      config,
      provider,
      state,
      addConfiguredCredentialTargetIds: addConfiguredFetchCredentialTargetIds,
      hasConfiguredCredential: (entry) =>
        hasConfiguredFetchCredential({
          provider: entry,
          config,
        }),
    });
  return toSelectedProviderTargetIds({
    matchedProvider: providers.length > 0,
    state,
  });
}
function getCapabilityWebProviderAutoDetectTargets(params) {
  const targetIds = new Set(params.baseTargetIds);
  const fallbackTargetIds = /* @__PURE__ */ new Set();
  const fallbackPaths = /* @__PURE__ */ new Set();
  for (const provider of params.providers) {
    if (params.hasConfiguredCredential(provider)) break;
    const fallback = provider.getConfiguredCredentialFallback?.(params.config);
    const fallbackPath = fallback?.path?.trim();
    if (!fallbackPath || !isConfiguredSecretCandidate(fallback?.value)) continue;
    for (const targetId of targetIdsForConfigPath(fallbackPath)) {
      targetIds.add(targetId);
      fallbackTargetIds.add(targetId);
    }
    fallbackPaths.add(fallbackPath);
    break;
  }
  if (fallbackTargetIds.size === 0) return { targetIds };
  const allowedPaths = mergeConfiguredAllowedPaths({
    config: params.config,
    baseTargetIds: params.baseTargetIds,
    concreteFallbackPaths: fallbackPaths,
  });
  const optionalActivePaths = discoverForcedActivePaths(
    params.config,
    fallbackTargetIds,
    allowedPaths,
  );
  return {
    targetIds,
    ...(allowedPaths ? { allowedPaths } : {}),
    ...(optionalActivePaths ? { optionalActivePaths } : {}),
  };
}
function getCapabilityWebSearchAutoDetectTargets(config) {
  return getCapabilityWebProviderAutoDetectTargets({
    config,
    baseTargetIds: getCapabilityWebSearchCommandSecretTargetIds(),
    providers: sortWebSearchProvidersForAutoDetect(resolvePluginWebSearchProviders({ config })),
    hasConfiguredCredential: (provider) =>
      hasConfiguredSearchCredential({
        provider,
        config,
      }),
  });
}
function getCapabilityWebFetchAutoDetectTargets(config) {
  return getCapabilityWebProviderAutoDetectTargets({
    config,
    baseTargetIds: getCapabilityWebFetchCommandSecretTargetIds(),
    providers: sortWebFetchProvidersForAutoDetect(resolvePluginWebFetchProviders({ config })),
    hasConfiguredCredential: (provider) =>
      hasConfiguredFetchCredential({
        provider,
        config,
      }),
  });
}
function getAgentRuntimeBaseTargetIds() {
  cachedAgentRuntimeBaseTargetIds ??= [
    ...STATIC_AGENT_RUNTIME_BASE_TARGET_IDS,
    ...listSecretTargetRegistryEntries()
      .map((entry) => entry.id)
      .filter(isPluginWebCredentialTargetId)
      .toSorted(),
  ];
  return cachedAgentRuntimeBaseTargetIds;
}
function isScopedChannelSecretTargetEntry(params) {
  const channelId = normalizeOptionalString(params.pluginChannelId);
  if (!channelId) return false;
  const allowedPrefix = `channels.${channelId}.`;
  return (
    params.entry.id.startsWith(allowedPrefix) &&
    params.entry.configFile === "openclaw.json" &&
    typeof params.entry.pathPattern === "string" &&
    params.entry.pathPattern.startsWith(allowedPrefix) &&
    (params.entry.refPathPattern === void 0 ||
      params.entry.refPathPattern.startsWith(allowedPrefix))
  );
}
function getConfiguredChannelSecretTargetIds(config, env = process.env) {
  const targetIds = /* @__PURE__ */ new Set();
  const channels = config.channels;
  if (channels && typeof channels === "object" && !Array.isArray(channels))
    for (const channelId of Object.keys(channels)) {
      if (channelId === "defaults") continue;
      const contract = loadChannelSecretContractApi({
        channelId,
        config,
        env,
      });
      for (const entry of contract?.secretTargetRegistryEntries ?? [])
        if (
          isScopedChannelSecretTargetEntry({
            entry,
            pluginChannelId: channelId,
          })
        )
          targetIds.add(entry.id);
    }
  for (const plugin of listReadOnlyChannelPluginsForConfig(config, {
    env,
    includePersistedAuthState: false,
  }))
    for (const entry of plugin.secrets?.secretTargetRegistryEntries ?? [])
      if (
        isScopedChannelSecretTargetEntry({
          entry,
          pluginChannelId: plugin.id,
        })
      )
        targetIds.add(entry.id);
  return [...targetIds].toSorted((left, right) => left.localeCompare(right));
}
function buildCommandSecretTargets() {
  const channelTargetIds = getChannelSecretTargetIds();
  return {
    channels: channelTargetIds,
    agentRuntime: [...getAgentRuntimeBaseTargetIds(), ...channelTargetIds],
    status: [...STATIC_STATUS_TARGET_IDS, ...channelTargetIds],
    securityAudit: [...STATIC_SECURITY_AUDIT_TARGET_IDS, ...channelTargetIds],
  };
}
function getCommandSecretTargets() {
  cachedCommandSecretTargets ??= buildCommandSecretTargets();
  return cachedCommandSecretTargets;
}
function toTargetIdSet(values) {
  return new Set(values);
}
function selectChannelTargetIds(channel) {
  const commandSecretTargets = getCommandSecretTargets();
  if (!channel) return toTargetIdSet(commandSecretTargets.channels);
  return toTargetIdSet(
    commandSecretTargets.channels.filter((id) => id.startsWith(`channels.${channel}.`)),
  );
}
function pathTargetsScopedChannelAccount(params) {
  const [root, channelId, accountRoot, accountId] = params.pathSegments;
  if (root !== "channels" || channelId !== params.channel) return false;
  if (accountRoot !== "accounts") return true;
  return normalizeOptionalAccountId(accountId) === params.accountId;
}
/** Return channel secret targets, optionally narrowed to one channel account subtree. */
function getScopedChannelsCommandSecretTargets(params) {
  const channel = normalizeOptionalString(params.channel);
  const targetIds = selectChannelTargetIds(channel);
  const explicitAccountId = normalizeOptionalAccountId(params.accountId);
  const channelPlugin =
    channel && !explicitAccountId && params.defaultAccountWhenMissing
      ? listReadOnlyChannelPluginsForConfig(params.config, {
          includePersistedAuthState: false,
        }).find((plugin) => plugin.id === channel)
      : void 0;
  const normalizedAccountId =
    explicitAccountId ??
    (channelPlugin
      ? normalizeOptionalAccountId(
          resolveChannelDefaultAccountId({
            plugin: channelPlugin,
            cfg: params.config,
          }),
        )
      : void 0);
  if (!channel || !normalizedAccountId) return { targetIds };
  const allowedPaths = /* @__PURE__ */ new Set();
  for (const target of discoverConfigSecretTargetsByIds(params.config, targetIds))
    if (
      pathTargetsScopedChannelAccount({
        pathSegments: target.pathSegments,
        channel,
        accountId: normalizedAccountId,
      })
    )
      allowedPaths.add(target.path);
  return {
    targetIds,
    allowedPaths,
  };
}
/** Secret targets needed by QR remote pairing flows. */
function getQrRemoteCommandSecretTargetIds() {
  return toTargetIdSet(STATIC_QR_REMOTE_TARGET_IDS);
}
/** All registered channel secret targets, regardless of current config. */
function getChannelsCommandSecretTargetIds() {
  return toTargetIdSet(getCommandSecretTargets().channels);
}
/** Channel secret targets contributed by channels currently present in config/read-only plugins. */
function getConfiguredChannelsCommandSecretTargetIds(config, env) {
  return toTargetIdSet(getConfiguredChannelSecretTargetIds(config, env));
}
/** Model-provider credential targets used by commands that can touch provider config. */
function getModelsCommandSecretTargetIds() {
  return toTargetIdSet(STATIC_MODEL_TARGET_IDS);
}
/** Credential targets required by memory embedding flows. */
function getMemoryEmbeddingCommandSecretTargetIds() {
  return toTargetIdSet(STATIC_MEMORY_EMBEDDING_TARGET_IDS);
}
/** Credential targets required by text-to-speech flows. */
function getTtsCommandSecretTargetIds() {
  return toTargetIdSet(STATIC_TTS_TARGET_IDS);
}
/** Agent runtime credential targets, optionally including all channel credential targets. */
function getAgentRuntimeCommandSecretTargetIds(params) {
  if (params?.includeChannelTargets !== true) return toTargetIdSet(getAgentRuntimeBaseTargetIds());
  return toTargetIdSet(getCommandSecretTargets().agentRuntime);
}
/** Static web-fetch capability targets plus plugin-provided web-fetch credential targets. */
function getCapabilityWebFetchCommandSecretTargetIds() {
  return toTargetIdSet(getCapabilityWebFetchTargetIds());
}
function getCapabilityWebCommandSecretTargets(params) {
  if (params.disabled) return { targetIds: params.baseTargetIds() };
  const selectedProviderId = params.resolveSelectedProviderId(params.config, params.providerId);
  if (!selectedProviderId) return params.autoDetectTargets(params.config);
  const selectedTargets = params.selectedProviderTargetIds(params.config, selectedProviderId);
  if (!selectedTargets.matchedProvider && !params.providerId)
    return params.autoDetectTargets(params.config);
  const targetIds = toTargetIdSet(selectedTargets.targetIds);
  const allowedPaths =
    selectedTargets.allowedPaths.length > 0 ? new Set(selectedTargets.targetPaths) : void 0;
  const forcedActivePaths = discoverForcedActivePaths(
    params.config,
    toTargetIdSet(
      params.providerId ? selectedTargets.targetIds : selectedTargets.fallbackTargetIds,
    ),
    allowedPaths,
  );
  return {
    targetIds,
    ...(allowedPaths ? { allowedPaths } : {}),
    ...(forcedActivePaths ? { forcedActivePaths } : {}),
  };
}
/** Web-fetch target scope for selected/auto-detected providers and configured fallback paths. */
function getCapabilityWebFetchCommandSecretTargets(config, options) {
  return getCapabilityWebCommandSecretTargets({
    config,
    providerId: options?.providerId,
    disabled: resolveFetchConfig(config)?.enabled === false,
    baseTargetIds: getCapabilityWebFetchCommandSecretTargetIds,
    resolveSelectedProviderId: resolveSelectedWebFetchProviderId,
    autoDetectTargets: getCapabilityWebFetchAutoDetectTargets,
    selectedProviderTargetIds: getCapabilityWebFetchSelectedProviderTargetIds,
  });
}
/** Static web-search capability targets plus plugin-provided web-search credential targets. */
function getCapabilityWebSearchCommandSecretTargetIds() {
  return toTargetIdSet(getCapabilityWebSearchTargetIds());
}
/** Web-search target scope for selected/auto-detected providers and configured fallback paths. */
function getCapabilityWebSearchCommandSecretTargets(config, options) {
  return getCapabilityWebCommandSecretTargets({
    config,
    providerId: options?.providerId,
    disabled: resolveSearchConfig(config)?.enabled === false,
    baseTargetIds: getCapabilityWebSearchCommandSecretTargetIds,
    resolveSelectedProviderId: resolveSelectedWebSearchProviderId,
    autoDetectTargets: getCapabilityWebSearchAutoDetectTargets,
    selectedProviderTargetIds: getCapabilityWebSearchSelectedProviderTargetIds,
  });
}
/** Status command targets; channel targets can be limited to configured channel plugins. */
function getStatusCommandSecretTargetIds(config, env, options) {
  const channelTargetIds =
    options?.includeChannelTargets === false
      ? []
      : config
        ? getConfiguredChannelSecretTargetIds(config, env)
        : getChannelSecretTargetIds();
  return toTargetIdSet([...STATIC_STATUS_TARGET_IDS, ...channelTargetIds]);
}
/** Secret targets that the security audit command is allowed to inspect. */
function getSecurityAuditCommandSecretTargetIds() {
  return toTargetIdSet(getCommandSecretTargets().securityAudit);
}
//#endregion
export {
  getCapabilityWebSearchCommandSecretTargets as a,
  getMemoryEmbeddingCommandSecretTargetIds as c,
  getScopedChannelsCommandSecretTargets as d,
  getSecurityAuditCommandSecretTargetIds as f,
  getCapabilityWebSearchCommandSecretTargetIds as i,
  getModelsCommandSecretTargetIds as l,
  getTtsCommandSecretTargetIds as m,
  getCapabilityWebFetchCommandSecretTargetIds as n,
  getChannelsCommandSecretTargetIds as o,
  getStatusCommandSecretTargetIds as p,
  getCapabilityWebFetchCommandSecretTargets as r,
  getConfiguredChannelsCommandSecretTargetIds as s,
  getAgentRuntimeCommandSecretTargetIds as t,
  getQrRemoteCommandSecretTargetIds as u,
};
