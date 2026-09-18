import { t as loadBundledPluginPublicArtifactModuleFromCandidatesSync } from "./public-surface-loader-X-jDa4d1.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { g as sortUniqueStrings } from "./string-normalization-CRyoFBPt.js";
//#region src/plugins/web-provider-public-artifacts.explicit.ts
const WEB_SEARCH_ARTIFACT_CANDIDATES = [
  "web-search-contract-api.js",
  "web-search-provider.js",
  "web-search.js",
];
const WEB_FETCH_ARTIFACT_CANDIDATES = [
  "web-fetch-contract-api.js",
  "web-fetch-provider.js",
  "web-fetch.js",
];
const WEB_FETCH_RUNTIME_ARTIFACT_CANDIDATES = ["web-fetch-provider.js", "web-fetch.js"];
function isStringArray(value) {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}
function isWebProviderPlugin(value) {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.label === "string" &&
    typeof value.hint === "string" &&
    isStringArray(value.envVars) &&
    typeof value.placeholder === "string" &&
    typeof value.signupUrl === "string" &&
    typeof value.credentialPath === "string" &&
    typeof value.getCredentialValue === "function" &&
    typeof value.setCredentialValue === "function" &&
    typeof value.createTool === "function"
  );
}
function isWebSearchProviderPlugin(value) {
  return isWebProviderPlugin(value);
}
function isWebFetchProviderPlugin(value) {
  return isWebProviderPlugin(value);
}
function collectProviderFactories(params) {
  const providers = [];
  const errors = [];
  for (const [name, exported] of Object.entries(params.mod).toSorted(([left], [right]) =>
    left.localeCompare(right),
  )) {
    if (
      typeof exported !== "function" ||
      exported.length !== 0 ||
      !name.startsWith("create") ||
      !name.endsWith(params.suffix)
    )
      continue;
    let candidate;
    try {
      candidate = exported();
    } catch (error) {
      errors.push(error);
      continue;
    }
    if (params.isProvider(candidate)) providers.push(candidate);
  }
  return {
    providers,
    errors,
  };
}
function unableToInitializeProviderError(params) {
  return new Error(`Unable to initialize web providers for plugin ${params.pluginId}`, {
    cause: params.errors.length === 1 ? params.errors[0] : new AggregateError(params.errors),
  });
}
function normalizeExplicitBundledPluginIds(pluginIds) {
  return sortUniqueStrings(pluginIds);
}
function loadBundledProviderEntriesFromDir(params) {
  const mod = loadBundledPluginPublicArtifactModuleFromCandidatesSync({
    dirName: params.dirName,
    artifactCandidates: params.artifactCandidates,
  });
  if (!mod) return null;
  const { providers, errors } = collectProviderFactories({
    mod,
    suffix: params.suffix,
    isProvider: params.isProvider,
  });
  if (providers.length === 0) {
    if (errors.length > 0)
      throw unableToInitializeProviderError({
        pluginId: params.pluginId,
        errors,
      });
    return null;
  }
  return providers.map((provider) => Object.assign({}, provider, { pluginId: params.pluginId }));
}
function loadBundledWebSearchProviderEntriesFromDir(params) {
  return loadBundledProviderEntriesFromDir({
    dirName: params.dirName,
    pluginId: params.pluginId,
    artifactCandidates: WEB_SEARCH_ARTIFACT_CANDIDATES,
    suffix: "WebSearchProvider",
    isProvider: isWebSearchProviderPlugin,
  });
}
function loadBundledWebFetchProviderEntriesFromDir(params) {
  return loadBundledProviderEntriesFromDir({
    dirName: params.dirName,
    pluginId: params.pluginId,
    artifactCandidates: WEB_FETCH_ARTIFACT_CANDIDATES,
    suffix: "WebFetchProvider",
    isProvider: isWebFetchProviderPlugin,
  });
}
function loadBundledRuntimeWebFetchProviderEntriesFromDir(params) {
  return loadBundledProviderEntriesFromDir({
    dirName: params.dirName,
    pluginId: params.pluginId,
    artifactCandidates: WEB_FETCH_RUNTIME_ARTIFACT_CANDIDATES,
    suffix: "WebFetchProvider",
    isProvider: isWebFetchProviderPlugin,
  });
}
function resolveBundledExplicitWebSearchProvidersFromPublicArtifacts(params) {
  const providers = [];
  for (const pluginId of normalizeExplicitBundledPluginIds(params.onlyPluginIds)) {
    const loadedProviders = loadBundledWebSearchProviderEntriesFromDir({
      dirName: pluginId,
      pluginId,
    });
    if (!loadedProviders) return null;
    providers.push(...loadedProviders);
  }
  return providers;
}
function resolveBundledExplicitWebFetchProvidersFromPublicArtifacts(params) {
  const providers = [];
  for (const pluginId of normalizeExplicitBundledPluginIds(params.onlyPluginIds)) {
    const loadedProviders = loadBundledWebFetchProviderEntriesFromDir({
      dirName: pluginId,
      pluginId,
    });
    if (!loadedProviders) return null;
    providers.push(...loadedProviders);
  }
  return providers;
}
function resolveBundledExplicitRuntimeWebFetchProvidersFromPublicArtifacts(params) {
  const providers = [];
  for (const pluginId of normalizeExplicitBundledPluginIds(params.onlyPluginIds)) {
    const loadedProviders = loadBundledRuntimeWebFetchProviderEntriesFromDir({
      dirName: pluginId,
      pluginId,
    });
    if (!loadedProviders) return null;
    providers.push(...loadedProviders);
  }
  return providers;
}
//#endregion
export {
  resolveBundledExplicitWebSearchProvidersFromPublicArtifacts as a,
  resolveBundledExplicitWebFetchProvidersFromPublicArtifacts as i,
  loadBundledWebSearchProviderEntriesFromDir as n,
  resolveBundledExplicitRuntimeWebFetchProvidersFromPublicArtifacts as r,
  loadBundledWebFetchProviderEntriesFromDir as t,
};
