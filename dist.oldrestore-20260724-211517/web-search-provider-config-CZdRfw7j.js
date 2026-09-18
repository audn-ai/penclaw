import { t as resolvePluginWebSearchConfig } from "./plugin-web-search-config-CHun8N9T.js";
import { n as isLegacyWebSearchProviderConfigKey } from "./web-search-legacy-provider-keys-pn4zHmNy.js";
//#region src/agents/tools/web-search-provider-config.ts
/**
 * Provider-scoped web-search config helpers.
 *
 * Bridges legacy top-level credentials with plugin-owned provider configuration.
 */
/** Reads the legacy top-level web search credential value. */
function getTopLevelCredentialValue(searchConfig) {
  return searchConfig?.apiKey;
}
/** Writes the legacy top-level web search credential value. */
function setTopLevelCredentialValue(searchConfigTarget, value) {
  searchConfigTarget.apiKey = value;
}
/** Reads a provider-scoped credential value from a web search config object. */
function getScopedCredentialValue(searchConfig, key) {
  const scoped = searchConfig?.[key];
  if (!scoped || typeof scoped !== "object" || Array.isArray(scoped)) return;
  return scoped.apiKey;
}
/** Writes a provider-scoped credential value, creating the scoped object when needed. */
function setScopedCredentialValue(searchConfigTarget, key, value) {
  const scoped = searchConfigTarget[key];
  if (!scoped || typeof scoped !== "object" || Array.isArray(scoped)) {
    searchConfigTarget[key] = { apiKey: value };
    return;
  }
  scoped.apiKey = value;
}
/** Merges plugin web-search config into a provider-scoped legacy-compatible shape. */
function mergeScopedSearchConfig(searchConfig, key, pluginConfig, options) {
  if (!pluginConfig) return searchConfig;
  const currentScoped =
    searchConfig?.[key] &&
    typeof searchConfig[key] === "object" &&
    !Array.isArray(searchConfig[key])
      ? searchConfig[key]
      : {};
  const next = { ...searchConfig };
  const existingDescriptor = searchConfig
    ? Object.getOwnPropertyDescriptor(searchConfig, key)
    : void 0;
  const shouldHideRuntimeInjectedLegacyShape =
    isLegacyWebSearchProviderConfigKey(key) && existingDescriptor === void 0;
  Object.defineProperty(next, key, {
    value: {
      ...currentScoped,
      ...pluginConfig,
    },
    enumerable: !shouldHideRuntimeInjectedLegacyShape,
    configurable: true,
    writable: true,
  });
  if (options?.mirrorApiKeyToTopLevel && pluginConfig.apiKey !== void 0)
    next.apiKey = pluginConfig.apiKey;
  return next;
}
/** Resolves plugin-owned web-search config for a provider plugin id. */
function resolveProviderWebSearchPluginConfig(config, pluginId) {
  return resolvePluginWebSearchConfig(config, pluginId);
}
function ensureObject(target, key) {
  const current = target[key];
  if (current && typeof current === "object" && !Array.isArray(current)) return current;
  const next = {};
  target[key] = next;
  return next;
}
/** Writes a single plugin-owned web-search config value and enables the plugin entry if needed. */
function setProviderWebSearchPluginConfigValue(configTarget, pluginId, key, value) {
  const entry = ensureObject(
    ensureObject(ensureObject(configTarget, "plugins"), "entries"),
    pluginId,
  );
  if (entry.enabled === void 0) entry.enabled = true;
  const webSearch = ensureObject(ensureObject(entry, "config"), "webSearch");
  webSearch[key] = value;
}
//#endregion
export {
  setProviderWebSearchPluginConfigValue as a,
  resolveProviderWebSearchPluginConfig as i,
  getTopLevelCredentialValue as n,
  setScopedCredentialValue as o,
  mergeScopedSearchConfig as r,
  setTopLevelCredentialValue as s,
  getScopedCredentialValue as t,
};
