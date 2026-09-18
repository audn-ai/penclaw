//#region src/config/web-search-legacy-provider-keys.ts
/** Legacy config keys that used to live under web search provider config. */
const LEGACY_WEB_SEARCH_PROVIDER_CONFIG_KEYS = /* @__PURE__ */ new Set([
  "brave",
  "duckduckgo",
  "exa",
  "firecrawl",
  "gemini",
  "grok",
  "kimi",
  "minimax",
  "ollama",
  "perplexity",
  "searxng",
  "tavily",
]);
function isLegacyWebSearchProviderConfigKey(key) {
  return LEGACY_WEB_SEARCH_PROVIDER_CONFIG_KEYS.has(key);
}
//#endregion
export { isLegacyWebSearchProviderConfigKey as n, LEGACY_WEB_SEARCH_PROVIDER_CONFIG_KEYS as t };
