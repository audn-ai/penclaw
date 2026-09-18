import {
  _ as normalizeConfiguredProviderCatalogModelId$1,
  b as normalizeStaticProviderModelIdWithPolicies,
  g as normalizeBuiltInProviderModelId,
  h as collectManifestModelIdNormalizationPolicies,
  r as getCurrentPluginMetadataSnapshot,
  v as normalizeConfiguredProviderCatalogModelRef,
  y as normalizeProviderModelIdWithPolicies,
} from "./current-plugin-metadata-snapshot-DGhQ40qh.js";
import { t as modelKey } from "./model-key-BaNhQShd.js";
import { a as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BMgImu0m.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import { t as getActivePluginRegistryWorkspaceDirFromState } from "./runtime-workspace-state-B8jf8nGo.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/plugins/manifest-model-id-normalization.ts
/** Applies manifest-declared model-id normalization policies to provider model refs. */
let cachedPolicies;
function resolveMetadataSnapshotForPolicies(params = {}) {
  const env = params.env ?? process.env;
  const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDirFromState();
  if (params.config === void 0) {
    const currentSnapshot = getCurrentPluginMetadataSnapshot({
      env,
      workspaceDir,
      allowWorkspaceScopedSnapshot: true,
      requireDefaultDiscoveryContext: true,
    });
    if (currentSnapshot)
      return {
        plugins: currentSnapshot.plugins,
        configFingerprint: currentSnapshot.configFingerprint,
        cacheable: true,
      };
  }
  const snapshot = resolvePluginMetadataSnapshot({
    config: params.config ?? {},
    env,
    workspaceDir,
    allowWorkspaceScopedCurrent: true,
  });
  return {
    plugins: snapshot.plugins,
    configFingerprint: snapshot.configFingerprint,
    cacheable: false,
  };
}
function loadManifestModelIdNormalizationPolicies(params = {}) {
  if (params.plugins) return collectManifestModelIdNormalizationPolicies(params.plugins);
  const { plugins, configFingerprint, cacheable } = resolveMetadataSnapshotForPolicies(params);
  if (cacheable && configFingerprint && cachedPolicies?.configFingerprint === configFingerprint)
    return cachedPolicies.policies;
  const policies = collectManifestModelIdNormalizationPolicies(plugins);
  if (cacheable && configFingerprint)
    cachedPolicies = {
      configFingerprint,
      policies,
    };
  return policies;
}
/** Normalizes a provider model id using plugin manifest-declared model-id policies. */
function normalizeProviderModelIdWithManifest(params) {
  return normalizeProviderModelIdWithPolicies({
    provider: params.provider,
    policies: loadManifestModelIdNormalizationPolicies(params),
    context: { modelId: params.context.modelId },
  });
}
//#endregion
//#region src/agents/model-ref-shared.ts
/**
 * Shared provider/model reference normalization for static catalogs,
 * allowlists, and display paths. Manifest policies are optional so tests can
 * isolate built-in normalization behavior.
 */
/** Normalize a static provider model ID with built-in and optional manifest policy. */
function normalizeStaticProviderModelId(provider, model, options = {}) {
  const normalizedProvider = normalizeProviderId(provider);
  if (options.allowManifestNormalization === false)
    return normalizeBuiltInProviderModelId(normalizedProvider, model);
  if (options.manifestPlugins)
    return normalizeStaticProviderModelIdWithPolicies(
      normalizedProvider,
      model,
      collectManifestModelIdNormalizationPolicies(options.manifestPlugins),
    );
  return normalizeBuiltInProviderModelId(
    normalizedProvider,
    normalizeProviderModelIdWithManifest({
      provider: normalizedProvider,
      context: {
        provider: normalizedProvider,
        modelId: model,
      },
    }) ?? model,
  );
}
/** Normalize a configured catalog model ID for comparisons against provider catalogs. */
function normalizeConfiguredProviderCatalogModelId(provider, model, options = {}) {
  if (options.allowManifestNormalization === false)
    return normalizeConfiguredProviderCatalogModelId$1(provider, model, /* @__PURE__ */ new Map());
  if (options.manifestPlugins)
    return normalizeConfiguredProviderCatalogModelId$1(
      provider,
      model,
      collectManifestModelIdNormalizationPolicies(options.manifestPlugins),
    );
  return normalizeConfiguredProviderCatalogModelRef(
    normalizeStaticProviderModelId(provider, model, options),
  );
}
function parseStaticModelRef(raw, defaultProvider) {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const slash = trimmed.indexOf("/");
  const providerRaw = slash === -1 ? defaultProvider : trimmed.slice(0, slash).trim();
  const modelRaw = slash === -1 ? trimmed : trimmed.slice(slash + 1).trim();
  if (!providerRaw || !modelRaw) return null;
  const provider = normalizeProviderId(providerRaw);
  return {
    provider,
    model: normalizeStaticProviderModelId(provider, modelRaw),
  };
}
/** Resolve an allowlist entry to a canonical provider/model key. */
function resolveStaticAllowlistModelKey(raw, defaultProvider) {
  const parsed = parseStaticModelRef(raw, defaultProvider);
  if (!parsed) return null;
  return modelKey(parsed.provider, parsed.model);
}
/** Preserve literal provider/model refs that already include a provider prefix twice. */
function formatLiteralProviderPrefixedModelRef(provider, modelRef) {
  const providerId = normalizeProviderId(provider);
  const trimmedRef = modelRef.trim();
  if (!providerId || !trimmedRef) return trimmedRef;
  const normalizedRef = normalizeLowercaseStringOrEmpty(trimmedRef);
  const literalPrefix = `${providerId}/${providerId}/`;
  if (normalizedRef.startsWith(literalPrefix)) return trimmedRef;
  return normalizedRef.startsWith(`${providerId}/`) ? `${providerId}/${trimmedRef}` : trimmedRef;
}
//#endregion
export {
  normalizeProviderModelIdWithManifest as a,
  resolveStaticAllowlistModelKey as i,
  normalizeConfiguredProviderCatalogModelId as n,
  normalizeStaticProviderModelId as r,
  formatLiteralProviderPrefixedModelRef as t,
};
