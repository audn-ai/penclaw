import { createHash } from "node:crypto";
import { r as logVerbose } from "./globals-CNUzHTcU.js";
import {
  a as resolveWebProviderDefinition,
  i as resolveWebProviderConfig,
  n as providerRequiresCredential,
  r as readWebProviderEnvValue,
  t as hasWebProviderEntryCredential,
} from "./provider-runtime-shared-DxJfE5ag.js";
import { u as getActivePluginRegistryVersion } from "./runtime-CcYnX0B4.js";
import { n as getActiveRuntimeWebToolsMetadata } from "./runtime-web-tools-state-fE_he60Y.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import {
  n as resolveRuntimeWebFetchProviders,
  t as resolvePluginWebFetchProviders,
} from "./web-fetch-providers.runtime.js";
import { o as sortWebFetchProvidersForAutoDetect } from "./web-search-providers.shared-CArHDy3x.js";
//#region src/web-fetch/runtime.ts
/** Runtime provider selection and tool construction for the `web_fetch` tool. */
let webFetchProviderCache = /* @__PURE__ */ new WeakMap();
/** Resolves whether web_fetch is enabled for the current config/sandbox. */
function resolveWebFetchEnabled(params) {
  if (typeof params.fetch?.enabled === "boolean") return params.fetch.enabled;
  return true;
}
function resolveFetchConfig(config) {
  return resolveWebProviderConfig(config, "fetch");
}
function hasEntryCredential(provider, config, fetch) {
  return hasWebProviderEntryCredential({
    provider,
    config,
    toolConfig: fetch,
    resolveRawValue: ({ provider: currentProvider, config: currentConfig, toolConfig }) =>
      currentProvider.getConfiguredCredentialValue?.(currentConfig) ??
      currentProvider.getCredentialValue(toolConfig),
    resolveFallbackRawValue: ({ provider: currentProvider, config: currentConfig }) =>
      currentProvider.getConfiguredCredentialFallback?.(currentConfig)?.value,
    resolveEnvValue: ({ provider: currentProvider }) =>
      readWebProviderEnvValue(currentProvider.envVars),
  });
}
function hasAutoDetectCredential(provider, config, fetch) {
  return hasEntryCredential(
    {
      ...provider,
      requiresCredential: true,
    },
    config,
    fetch,
  );
}
/** Reports whether a web_fetch provider has usable credentials. */
function isWebFetchProviderConfigured(params) {
  return hasEntryCredential(params.provider, params.config, resolveFetchConfig(params.config));
}
/** Lists web_fetch providers available to runtime selection. */
function listWebFetchProviders(params) {
  return resolvePluginWebFetchProviders({ config: params?.config });
}
/** Resolves the configured or auto-detected web_fetch provider id. */
function resolveWebFetchProviderId(params) {
  const providers = sortWebFetchProvidersForAutoDetect(
    params.providers ?? resolvePluginWebFetchProviders({ config: params.config }),
  );
  const raw =
    params.fetch && "provider" in params.fetch
      ? normalizeLowercaseStringOrEmpty(params.fetch.provider)
      : "";
  if (raw) {
    const explicit = providers.find((provider) => provider.id === raw);
    if (explicit) return explicit.id;
  }
  for (const provider of providers) {
    if (!providerRequiresCredential(provider)) {
      if (!hasAutoDetectCredential(provider, params.config, params.fetch)) continue;
      logVerbose(
        `web_fetch: ${raw ? `invalid configured provider "${raw}", ` : ""}auto-detected keyless provider "${provider.id}"`,
      );
      return provider.id;
    }
    if (!hasEntryCredential(provider, params.config, params.fetch)) continue;
    logVerbose(
      `web_fetch: ${raw ? `invalid configured provider "${raw}", ` : ""}auto-detected "${provider.id}" from available API keys`,
    );
    return provider.id;
  }
  return "";
}
function resolveConfiguredWebFetchProviderId(params) {
  const raw =
    params.fetch && "provider" in params.fetch
      ? normalizeLowercaseStringOrEmpty(params.fetch.provider)
      : "";
  if (!raw) return;
  return params.providers.find((provider) => provider.id === raw)?.id;
}
function resolveWebFetchProviderCacheKey(options) {
  return JSON.stringify([
    getActivePluginRegistryVersion(),
    options?.sandboxed === true,
    options?.preferRuntimeProviders === true,
  ]);
}
function createWebFetchProviderConfigFingerprint(config) {
  return createHash("sha256").update(JSON.stringify(config)).digest("hex");
}
function resolveCachedWebFetchProviders(params) {
  const cached = webFetchProviderCache.get(params.config);
  if (cached?.cacheKey === params.cacheKey && cached.configFingerprint === params.configFingerprint)
    return cached.providers;
  const loaded = params.load();
  if (loaded.length > 0)
    webFetchProviderCache.set(params.config, {
      cacheKey: params.cacheKey,
      configFingerprint: params.configFingerprint,
      providers: loaded,
    });
  return loaded;
}
function clearWebFetchRuntimeCachesForTest() {
  webFetchProviderCache = /* @__PURE__ */ new WeakMap();
}
/** Resolves the executable web_fetch provider tool definition. */
function resolveWebFetchDefinition(options) {
  return resolveWebFetchDefinitionUncached(options);
}
function resolveWebFetchProvidersForOptions(options) {
  const load = () =>
    sortWebFetchProvidersForAutoDetect(
      options?.sandboxed
        ? resolvePluginWebFetchProviders({
            config: options?.config,
            sandboxed: true,
          })
        : options?.preferRuntimeProviders
          ? resolveRuntimeWebFetchProviders({ config: options?.config })
          : resolvePluginWebFetchProviders({ config: options?.config }),
    );
  if (options?.config)
    return resolveCachedWebFetchProviders({
      config: options.config,
      cacheKey: resolveWebFetchProviderCacheKey(options),
      configFingerprint: createWebFetchProviderConfigFingerprint(options.config),
      load,
    });
  return load();
}
function resolveWebFetchDefinitionUncached(options) {
  const fetch = resolveWebProviderConfig(options?.config, "fetch");
  if (
    !resolveWebFetchEnabled({
      fetch,
      sandboxed: options?.sandboxed,
    })
  )
    return null;
  const runtimeWebFetch = options?.runtimeWebFetch ?? getActiveRuntimeWebToolsMetadata()?.fetch;
  const providers = resolveWebFetchProvidersForOptions(options);
  return resolveWebProviderDefinition({
    config: options?.config,
    toolConfig: fetch,
    runtimeMetadata: runtimeWebFetch,
    sandboxed: options?.sandboxed,
    providerId:
      options?.providerId ??
      resolveConfiguredWebFetchProviderId({
        fetch,
        providers,
      }),
    providers,
    resolveEnabled: ({ toolConfig, sandboxed }) =>
      resolveWebFetchEnabled({
        fetch: toolConfig,
        sandboxed,
      }),
    resolveAutoProviderId: ({ config, toolConfig, providers: providersLocal }) =>
      resolveWebFetchProviderId({
        config,
        fetch: toolConfig,
        providers: providersLocal,
      }),
    createTool: ({ provider, config, toolConfig, runtimeMetadata }) =>
      provider.createTool({
        config,
        fetchConfig: toolConfig,
        runtimeMetadata,
      }),
  });
}
//#endregion
export {
  resolveWebFetchDefinition as i,
  isWebFetchProviderConfigured as n,
  listWebFetchProviders as r,
  clearWebFetchRuntimeCachesForTest as t,
};
