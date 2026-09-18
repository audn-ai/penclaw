import { t as createBaseWebSearchProviderContractFields } from "./provider-web-search-contract-fields-BeVWaRlO.js";
//#region extensions/xai/web-search-provider-shared.ts
const XAI_WEB_SEARCH_CREDENTIAL_PATH = "plugins.entries.xai.config.webSearch.apiKey";
function buildXaiWebSearchProviderBase() {
  return {
    id: "grok",
    label: "Grok (xAI)",
    hint: "Uses xAI OAuth or API key · xAI web-grounded responses",
    onboardingScopes: ["text-inference"],
    credentialLabel: "xAI API key",
    envVars: ["XAI_API_KEY"],
    authProviderId: "xai",
    placeholder: "xai-...",
    signupUrl: "https://console.x.ai/",
    docsUrl: "https://docs.openclaw.ai/tools/web",
    autoDetectOrder: 30,
    credentialPath: XAI_WEB_SEARCH_CREDENTIAL_PATH,
    ...createBaseWebSearchProviderContractFields({
      credentialPath: XAI_WEB_SEARCH_CREDENTIAL_PATH,
      searchCredential: {
        type: "scoped",
        scopeId: "grok",
      },
      configuredCredential: { pluginId: "xai" },
    }),
  };
}
//#endregion
export { buildXaiWebSearchProviderBase as t };
