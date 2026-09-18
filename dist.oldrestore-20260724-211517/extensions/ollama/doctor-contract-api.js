import {
  r as OLLAMA_CLOUD_PROVIDER_ID,
  t as OLLAMA_CLOUD_BASE_URL,
} from "../../defaults-W8ZJNfBr.js";
//#region extensions/ollama/src/config-compat.ts
function asRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}
function isRetiredOllamaCloudBaseUrl(value) {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    return new URL(value.trim()).hostname.toLowerCase() === "ai.ollama.com";
  } catch {
    return false;
  }
}
function findRetiredOllamaCloudBaseUrl(provider) {
  const record = asRecord(provider);
  if (!record) return null;
  if (isRetiredOllamaCloudBaseUrl(record.baseUrl)) return { key: "baseUrl" };
  if (isRetiredOllamaCloudBaseUrl(record.baseURL)) return { key: "baseURL" };
  return null;
}
const legacyConfigRules = [
  {
    path: ["models", "providers", OLLAMA_CLOUD_PROVIDER_ID],
    message:
      'models.providers.ollama-cloud.baseUrl="https://ai.ollama.com" is retired; use "https://ollama.com". Run "openclaw doctor --fix".',
    match: (value) => findRetiredOllamaCloudBaseUrl(value) !== null,
  },
];
function migrateOllamaCloudRetiredBaseUrl(config) {
  const provider = config.models?.providers?.[OLLAMA_CLOUD_PROVIDER_ID];
  const retired = findRetiredOllamaCloudBaseUrl(provider);
  if (!retired) return null;
  const nextConfig = structuredClone(config);
  const nextModels = asRecord(nextConfig.models) ?? {};
  nextConfig.models = nextModels;
  const nextProviders = asRecord(nextModels.providers) ?? {};
  nextModels.providers = nextProviders;
  const nextProvider = asRecord(nextProviders["ollama-cloud"]) ?? {};
  nextProviders[OLLAMA_CLOUD_PROVIDER_ID] = nextProvider;
  const canonicalBaseUrl = nextProvider.baseUrl;
  if (
    retired.key === "baseURL" &&
    typeof canonicalBaseUrl === "string" &&
    canonicalBaseUrl.trim() &&
    !isRetiredOllamaCloudBaseUrl(canonicalBaseUrl)
  ) {
    delete nextProvider.baseURL;
    return {
      config: nextConfig,
      changes: [
        "Removed retired models.providers.ollama-cloud.baseURL while preserving models.providers.ollama-cloud.baseUrl.",
      ],
    };
  }
  nextProvider.baseUrl = OLLAMA_CLOUD_BASE_URL;
  if (retired.key === "baseURL") delete nextProvider.baseURL;
  return {
    config: nextConfig,
    changes: [
      `Updated models.providers.ollama-cloud.${retired.key} from the retired Ollama Cloud endpoint to ${OLLAMA_CLOUD_BASE_URL}.`,
    ],
  };
}
function normalizeCompatibilityConfig({ cfg }) {
  return (
    migrateOllamaCloudRetiredBaseUrl(cfg) ?? {
      config: cfg,
      changes: [],
    }
  );
}
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };
