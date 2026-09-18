import { s as resolveDefaultAgentDir } from "./agent-scope-config-DVIR1nBa.js";
import { r as logVerbose } from "./globals-CNUzHTcU.js";
import { i as hasAuthProfileForProvider } from "./model-config.helpers-YCqd3cyK.js";
import { i as resolveManifestContractOwnerPluginId } from "./plugin-registry-BckMdz4f.js";
import {
  i as resolveWebProviderConfig,
  n as providerRequiresCredential,
  r as readWebProviderEnvValue,
  t as hasWebProviderEntryCredential,
} from "./provider-runtime-shared-DxJfE5ag.js";
import {
  b as selectApplicableRuntimeConfig,
  i as getRuntimeConfigSnapshot,
  s as getRuntimeConfigSourceSnapshot,
} from "./runtime-snapshot-BbbqRiDR.js";
import { n as getActiveRuntimeWebToolsMetadata } from "./runtime-web-tools-state-fE_he60Y.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import {
  n as resolveRuntimeWebSearchProviders,
  t as resolvePluginWebSearchProviders,
} from "./web-search-providers.runtime.js";
import { r as sortWebSearchProvidersForAutoDetect } from "./web-search-providers.shared-CArHDy3x.js";
//#region src/web-search/runtime.ts
function resolveSearchConfig(cfg) {
  return resolveWebProviderConfig(cfg, "search");
}
function resolveWebSearchRuntimeConfig(params) {
  if (params?.preferInputConfig && params.config) return params.config;
  return selectApplicableRuntimeConfig({
    inputConfig: params?.config,
    runtimeConfig: getRuntimeConfigSnapshot(),
    runtimeSourceConfig: getRuntimeConfigSourceSnapshot(),
  });
}
/** Resolves whether web_search is enabled for the current config/sandbox. */
function resolveWebSearchEnabled(params) {
  if (typeof params.search?.enabled === "boolean") return params.search.enabled;
  if (params.sandboxed) return true;
  return true;
}
function hasEntryCredential(provider, config, search, agentDir) {
  return hasWebProviderEntryCredential({
    provider,
    config,
    toolConfig: search,
    resolveRawValue: ({ provider: currentProvider, config: currentConfig }) =>
      currentProvider.getConfiguredCredentialValue?.(currentConfig),
    resolveFallbackRawValue: ({ provider: currentProvider, config: currentConfig }) =>
      currentProvider.getConfiguredCredentialFallback?.(currentConfig)?.value,
    resolveEnvValue: ({ provider: currentProvider, configuredEnvVarId }) =>
      (configuredEnvVarId ? readWebProviderEnvValue([configuredEnvVarId]) : void 0) ??
      readWebProviderEnvValue(currentProvider.envVars),
    resolveProviderAuthValue: (providerId) =>
      hasAuthProfileForProvider({
        provider: providerId,
        agentDir: agentDir?.trim() || resolveDefaultAgentDir(config ?? {}),
      }),
  });
}
function hasImplicitProviderSelectionSignal(provider, config, search, agentDir) {
  if (!providerRequiresCredential(provider)) return false;
  return hasEntryCredential(provider, config, search, agentDir);
}
/** Reports whether a web_search provider has usable configured credentials. */
function isWebSearchProviderConfigured(params) {
  const config = resolveWebSearchRuntimeConfig({ config: params.config });
  return hasEntryCredential(params.provider, config, resolveSearchConfig(config));
}
/** Lists runtime web_search providers after applying runtime config snapshots. */
function listWebSearchProviders(params) {
  return resolveRuntimeWebSearchProviders({
    config: resolveWebSearchRuntimeConfig({ config: params?.config }),
  });
}
/** Lists plugin-configured web_search providers without runtime-only providers. */
function listConfiguredWebSearchProviders(params) {
  return resolvePluginWebSearchProviders({
    config: resolveWebSearchRuntimeConfig({ config: params?.config }),
  });
}
/** Resolves configured or auto-detected web_search provider id. */
function resolveWebSearchProviderId(params) {
  const config = resolveWebSearchRuntimeConfig({ config: params.config });
  const search = params.search ?? resolveSearchConfig(config);
  const providers = sortWebSearchProvidersForAutoDetect(
    params.providers ?? resolvePluginWebSearchProviders({ config }),
  );
  const raw =
    search && "provider" in search ? normalizeLowercaseStringOrEmpty(search.provider) : "";
  if (raw) {
    const explicit = providers.find((provider) => provider.id === raw);
    if (explicit) return explicit.id;
  }
  if (!raw) {
    for (const provider of providers) {
      if (!hasImplicitProviderSelectionSignal(provider, config, search, params.agentDir)) continue;
      logVerbose(
        `web_search: no provider configured, auto-detected "${provider.id}" from available credentials`,
      );
      return provider.id;
    }
    return "";
  }
  return "";
}
function resolveRuntimePreferredWebSearchProviderId(params) {
  const runtimeProviderId = normalizeOptionalLowercaseString(
    params.runtimeWebSearch?.selectedProvider ?? params.runtimeWebSearch?.providerConfigured,
  );
  if (!runtimeProviderId) return;
  const configuredProviderId =
    params.search && "provider" in params.search
      ? normalizeOptionalLowercaseString(params.search.provider)
      : void 0;
  if (configuredProviderId)
    return params.providers?.find((entry) => entry.id === configuredProviderId)?.id ===
      runtimeProviderId
      ? runtimeProviderId
      : void 0;
  if (params.runtimeWebSearch?.providerSource === "configured") return runtimeProviderId;
  const provider = params.providers?.find((entry) => entry.id === runtimeProviderId);
  return provider &&
    hasImplicitProviderSelectionSignal(provider, params.config, params.search, params.agentDir)
    ? provider.id
    : void 0;
}
function resolveExplicitWebSearchProviderId(params) {
  const callerProviderId = normalizeOptionalLowercaseString(params.providerId);
  if (callerProviderId) return callerProviderId;
  if (params.includeRuntimeSelection && params.runtimeWebSearch?.providerSource === "configured") {
    const runtimeProviderId = normalizeOptionalLowercaseString(
      params.runtimeWebSearch.selectedProvider ?? params.runtimeWebSearch.providerConfigured,
    );
    if (runtimeProviderId) return runtimeProviderId;
  }
  const configuredProviderId =
    params.search && "provider" in params.search
      ? normalizeOptionalLowercaseString(params.search.provider)
      : void 0;
  if (configuredProviderId) return configuredProviderId;
}
function resolveExplicitWebSearchProviderPluginIds(params) {
  const providerId = resolveExplicitWebSearchProviderId(params);
  if (!providerId) return;
  const ownerPluginId = resolveManifestContractOwnerPluginId({
    config: params.config,
    contract: "webSearchProviders",
    value: providerId,
  });
  return ownerPluginId ? [ownerPluginId] : void 0;
}
function resolveWebSearchProviderLoadScope(params) {
  const onlyPluginIds = resolveExplicitWebSearchProviderPluginIds(params);
  return onlyPluginIds ? { onlyPluginIds } : {};
}
function resolveWebSearchRequestContext(options) {
  const config = resolveWebSearchRuntimeConfig({
    config: options?.config,
    preferInputConfig: options?.preferInputConfig,
  });
  return {
    config,
    search: resolveSearchConfig(config),
    runtimeWebSearch: options?.runtimeWebSearch ?? getActiveRuntimeWebToolsMetadata()?.search,
  };
}
function loadSortedWebSearchProviders(params) {
  const loadScope = resolveWebSearchProviderLoadScope({
    config: params.config,
    search: params.search,
    runtimeWebSearch: params.runtimeWebSearch,
    providerId: params.providerId,
    includeRuntimeSelection: Boolean(params.preferRuntimeProviders),
  });
  return sortWebSearchProvidersForAutoDetect(
    params.preferRuntimeProviders
      ? resolveRuntimeWebSearchProviders({
          config: params.config,
          ...loadScope,
        })
      : resolvePluginWebSearchProviders({
          config: params.config,
          ...loadScope,
        }),
  );
}
function resolveWebSearchCandidates(options) {
  const { config, search, runtimeWebSearch } = resolveWebSearchRequestContext(options);
  if (
    !resolveWebSearchEnabled({
      search,
      sandboxed: options?.sandboxed,
    })
  )
    return [];
  const providers = loadSortedWebSearchProviders({
    config,
    search,
    runtimeWebSearch,
    providerId: options?.providerId,
    preferRuntimeProviders: options?.preferRuntimeProviders,
  }).filter(Boolean);
  if (providers.length === 0) return [];
  const preferredIds = uniqueStrings(
    [
      options?.providerId,
      resolveRuntimePreferredWebSearchProviderId({
        config,
        search,
        runtimeWebSearch,
        providers,
        agentDir: options?.agentDir,
      }),
      resolveWebSearchProviderId({
        config,
        agentDir: options?.agentDir,
        search,
        providers,
      }),
    ].filter((value) => Boolean(value)),
  );
  const explicitProviderId = options?.providerId?.trim();
  if (explicitProviderId && !providers.some((entry) => entry.id === explicitProviderId))
    throw new Error(`Unknown web_search provider "${explicitProviderId}".`);
  const explicitSelection = hasExplicitWebSearchSelection({
    search,
    runtimeWebSearch,
    providerId: options?.providerId,
    providers,
  });
  if (preferredIds.length === 0 && !explicitSelection) return [];
  const fallbackProviders = explicitSelection
    ? providers
    : providers.filter((provider) =>
        hasImplicitProviderSelectionSignal(provider, config, search, options?.agentDir),
      );
  return [
    ...preferredIds
      .map((id) => providers.find((entry) => entry.id === id))
      .filter((entry) => Boolean(entry)),
    ...fallbackProviders.filter((entry) => !preferredIds.includes(entry.id)),
  ];
}
function hasExplicitWebSearchSelection(params) {
  if (params.providerId?.trim()) return true;
  const availableProviderIds = new Set(
    (params.providers ?? []).map((provider) => normalizeLowercaseStringOrEmpty(provider.id)),
  );
  const configuredProviderId =
    params.search && "provider" in params.search && typeof params.search.provider === "string"
      ? normalizeLowercaseStringOrEmpty(params.search.provider)
      : "";
  if (configuredProviderId && availableProviderIds.has(configuredProviderId)) return true;
  const runtimeConfiguredId = normalizeOptionalLowercaseString(
    params.runtimeWebSearch?.selectedProvider ?? params.runtimeWebSearch?.providerConfigured,
  );
  if (
    params.runtimeWebSearch?.providerSource === "configured" &&
    runtimeConfiguredId &&
    availableProviderIds.has(runtimeConfiguredId)
  )
    return true;
  return false;
}
function isStructuredAvailabilityError(result) {
  if (!result || typeof result !== "object" || !("error" in result)) return false;
  const error = result.error;
  return typeof error === "string" && /^missing_[a-z0-9_]*api_key$/i.test(error);
}
/** Executes web_search with fallback when selection was not explicit. */
async function runWebSearch(params) {
  const config = resolveWebSearchRuntimeConfig({
    config: params.config,
    preferInputConfig: params.preferInputConfig,
  });
  const search = resolveSearchConfig(config);
  const runtimeWebSearch = params.runtimeWebSearch ?? getActiveRuntimeWebToolsMetadata()?.search;
  const candidates = resolveWebSearchCandidates({
    ...params,
    config,
    runtimeWebSearch,
    preferRuntimeProviders: params.preferRuntimeProviders ?? true,
  });
  if (candidates.length === 0)
    throw new Error("web_search is disabled or no provider is available.");
  const allowFallback = !hasExplicitWebSearchSelection({
    search,
    runtimeWebSearch,
    providerId: params.providerId,
    providers: candidates,
  });
  let lastError;
  let sawUnavailableProvider = false;
  for (const candidate of candidates)
    try {
      const definition = candidate.createTool({
        config,
        agentDir: params.agentDir,
        searchConfig: search,
        runtimeMetadata: runtimeWebSearch,
      });
      if (!definition) {
        if (!allowFallback)
          throw new Error(`web_search provider "${candidate.id}" is not available.`);
        sawUnavailableProvider = true;
        continue;
      }
      const executed = await definition.execute(params.args, { signal: params.signal });
      if (allowFallback && isStructuredAvailabilityError(executed)) {
        lastError = /* @__PURE__ */ new Error(
          `web_search provider "${candidate.id}" returned ${executed.error}`,
        );
        continue;
      }
      return {
        provider: candidate.id,
        result: executed,
      };
    } catch (error) {
      lastError = error;
      if (!allowFallback) throw error;
    }
  if (sawUnavailableProvider && lastError === void 0)
    throw new Error("web_search is enabled but no provider is currently available.");
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}
//#endregion
export {
  runWebSearch as a,
  resolveWebSearchProviderId as i,
  listConfiguredWebSearchProviders as n,
  listWebSearchProviders as r,
  isWebSearchProviderConfigured as t,
};
