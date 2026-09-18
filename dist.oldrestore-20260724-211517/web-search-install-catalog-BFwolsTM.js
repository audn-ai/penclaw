import { n as enablePluginInConfig } from "./enable-DK_lFguo.js";
import {
  d as resolveOfficialExternalPluginInstall,
  f as resolveOfficialExternalPluginLabel,
  r as getOfficialExternalPluginCatalogManifest,
  s as listOfficialExternalPluginCatalogEntries,
} from "./official-external-plugin-catalog-B2V9K3em.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import "./utils-DtcDeqWS.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { d as normalizeTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
//#region src/plugins/web-search-install-catalog.ts
function normalizeOnboardingScopes(value) {
  if (!Array.isArray(value)) return;
  const scopes = value.filter((entry) => entry === "text-inference");
  return scopes.length > 0 ? scopes : void 0;
}
function pathSegments(path) {
  return path
    .split(".")
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);
}
function getConfigPath(config, path) {
  let current = config;
  for (const segment of pathSegments(path)) {
    if (!isRecord(current)) return;
    current = current[segment];
  }
  return current;
}
function setConfigPath(target, path, value) {
  const segments = pathSegments(path);
  let current = target;
  for (const segment of segments.slice(0, -1)) {
    const next = current[segment];
    if (!isRecord(next)) current[segment] = {};
    current = current[segment];
  }
  const leaf = segments.at(-1);
  if (leaf) current[leaf] = value;
}
function buildProviderEntry(params) {
  const providerId = normalizeOptionalString(params.provider.id);
  const label = normalizeOptionalString(params.provider.label);
  const hint = normalizeOptionalString(params.provider.hint);
  const configuredCredentialPath = normalizeOptionalString(params.provider.credentialPath);
  const credentialPath =
    params.provider.credentialPath === ""
      ? ""
      : (configuredCredentialPath ?? `plugins.entries.${params.pluginId}.config.webSearch.apiKey`);
  const requiresCredential = params.provider.requiresCredential !== false;
  const envVars = normalizeTrimmedStringList(params.provider.envVars);
  const placeholder = normalizeOptionalString(params.provider.placeholder);
  const signupUrl = normalizeOptionalString(params.provider.signupUrl);
  if (
    !providerId ||
    !label ||
    !hint ||
    (requiresCredential && envVars.length === 0) ||
    !placeholder ||
    !signupUrl
  )
    return null;
  return {
    id: providerId,
    pluginId: params.pluginId,
    label,
    hint,
    envVars,
    placeholder,
    signupUrl,
    credentialPath,
    ...(normalizeOnboardingScopes(params.provider.onboardingScopes)
      ? { onboardingScopes: normalizeOnboardingScopes(params.provider.onboardingScopes) }
      : {}),
    ...(params.provider.requiresCredential === false ? { requiresCredential: false } : {}),
    ...(normalizeOptionalString(params.provider.credentialLabel)
      ? { credentialLabel: normalizeOptionalString(params.provider.credentialLabel) }
      : {}),
    ...(normalizeOptionalString(params.provider.docsUrl)
      ? { docsUrl: normalizeOptionalString(params.provider.docsUrl) }
      : {}),
    ...(typeof params.provider.autoDetectOrder === "number"
      ? { autoDetectOrder: params.provider.autoDetectOrder }
      : {}),
    getCredentialValue: (searchConfig) => searchConfig?.apiKey,
    setCredentialValue: (searchConfigTarget, value) => {
      searchConfigTarget.apiKey = value;
    },
    getConfiguredCredentialValue: (config) => getConfigPath(config, credentialPath),
    setConfiguredCredentialValue: (configTarget, value) => {
      setConfigPath(configTarget, credentialPath, value);
    },
    applySelectionConfig: (config) => enablePluginInConfig(config, params.pluginId).config,
    createTool: () => null,
  };
}
/** Lists web-search provider install catalog entries from official external plugins. */
function resolveWebSearchInstallCatalogEntries() {
  const entries = [];
  for (const entry of listOfficialExternalPluginCatalogEntries()) {
    const manifest = getOfficialExternalPluginCatalogManifest(entry);
    const pluginId = normalizeOptionalString(manifest?.plugin?.id);
    const install = resolveOfficialExternalPluginInstall(entry);
    if (!manifest || !pluginId || !install) continue;
    for (const provider of manifest.webSearchProviders ?? []) {
      const providerEntry = buildProviderEntry({
        pluginId,
        provider,
      });
      if (!providerEntry) continue;
      entries.push({
        pluginId,
        label: resolveOfficialExternalPluginLabel(entry),
        install,
        provider: providerEntry,
        trustedSourceLinkedOfficialInstall: true,
      });
    }
  }
  return entries.toSorted(
    (left, right) =>
      left.provider.label.localeCompare(right.provider.label) ||
      left.provider.id.localeCompare(right.provider.id),
  );
}
/** Lists credential-backed web provider plugins selected by documented environment variables. */
function resolveWebSearchInstallCatalogEntriesForEnv(env) {
  return resolveWebSearchInstallCatalogEntries().filter(
    (entry) =>
      entry.provider.requiresCredential !== false &&
      entry.provider.envVars.some((envVar) => Boolean(env[envVar]?.trim())),
  );
}
/** Resolves one web-search install catalog entry by provider id or plugin id. */
function resolveWebSearchInstallCatalogEntry(params) {
  const providerId = normalizeOptionalString(params.providerId);
  const pluginId = normalizeOptionalString(params.pluginId);
  return resolveWebSearchInstallCatalogEntries().find(
    (entry) =>
      (!providerId || entry.provider.id === providerId) &&
      (!pluginId || entry.pluginId === pluginId),
  );
}
//#endregion
export {
  resolveWebSearchInstallCatalogEntriesForEnv as n,
  resolveWebSearchInstallCatalogEntry as r,
  resolveWebSearchInstallCatalogEntries as t,
};
