import { t as createBaseWebSearchProviderContractFields } from "./provider-web-search-contract-fields-BeVWaRlO.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
//#region extensions/brave/web-search-shared.ts
/**
 * Shared Brave Search provider metadata and credential lookup. Contract tests
 * and runtime provider creation both use this lightweight descriptor.
 */
/** Canonical config path for the Brave Search API key. */
const BRAVE_CREDENTIAL_PATH = "plugins.entries.brave.config.webSearch.apiKey";
/** Resolve legacy top-level Brave credentials from old web-search config. */
function resolveLegacyTopLevelBraveCredential(config) {
  if (!isRecord(config)) return;
  const tools = isRecord(config.tools) ? config.tools : void 0;
  const web = isRecord(tools?.web) ? tools.web : void 0;
  const search = isRecord(web?.search) ? web.search : void 0;
  if (!search || !("apiKey" in search)) return;
  return {
    path: "tools.web.search.apiKey",
    value: search.apiKey,
  };
}
function resolveBraveWebSearchPluginConfig(config) {
  if (!isRecord(config)) return;
  const plugins = isRecord(config.plugins) ? config.plugins : void 0;
  const entries = isRecord(plugins?.entries) ? plugins.entries : void 0;
  const entry = isRecord(entries?.brave) ? entries.brave : void 0;
  const pluginConfig = isRecord(entry?.config) ? entry.config : void 0;
  return isRecord(pluginConfig?.webSearch) ? pluginConfig.webSearch : void 0;
}
/** Resolve Brave credentials from current plugin config or legacy fallback. */
function resolveConfiguredBraveCredential(config) {
  return (
    resolveBraveWebSearchPluginConfig(config)?.apiKey ??
    resolveLegacyTopLevelBraveCredential(config)?.value
  );
}
/** Build the common Brave provider metadata without the runtime tool executor. */
function buildBraveWebSearchProviderBase() {
  return {
    id: "brave",
    label: "Brave Search",
    hint: "Structured results · country/language/time filters",
    onboardingScopes: ["text-inference"],
    credentialLabel: "Brave Search API key",
    envVars: ["BRAVE_API_KEY"],
    placeholder: "BSA...",
    signupUrl: "https://brave.com/search/api/",
    docsUrl: "https://docs.openclaw.ai/tools/brave-search",
    autoDetectOrder: 10,
    credentialPath: BRAVE_CREDENTIAL_PATH,
    ...createBaseWebSearchProviderContractFields({
      credentialPath: BRAVE_CREDENTIAL_PATH,
      searchCredential: { type: "top-level" },
      configuredCredential: { pluginId: "brave" },
    }),
    getConfiguredCredentialValue: resolveConfiguredBraveCredential,
    getConfiguredCredentialFallback: resolveLegacyTopLevelBraveCredential,
  };
}
//#endregion
export { buildBraveWebSearchProviderBase as t };
