import {
  g as hashJson,
  m as resolveInstalledPluginIndexPolicyHash,
} from "./installed-plugin-index-lBfkb-7L.js";
import { n as resolveInstalledManifestRegistryIndexFingerprint } from "./manifest-registry-installed-CdFNhCi1.js";
import { i as parseModelCatalogRef } from "./model-catalog-refs-BcuK-xC3.js";
import {
  a as setCurrentPluginMetadataSnapshotState,
  i as getCurrentPluginMetadataSnapshotState,
  n as registerPluginMetadataProcessMemoLifecycleClear,
  r as clearCurrentPluginMetadataSnapshotState,
} from "./plugin-metadata-lifecycle-C3dWg4tn.js";
import {
  n as normalizeGooglePreviewModelId,
  r as normalizeTogetherModelId,
} from "./provider-model-id-normalize-DODOj1rv.js";
import { t as resolvePluginCacheInputs } from "./roots-62ohA5O8.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
//#region packages/model-catalog-core/src/provider-model-id-normalization.ts
let currentManifestModelIdNormalizationPolicies;
/** Collect provider model-id normalization policies from plugin manifests. */
function collectManifestModelIdNormalizationPolicies(plugins) {
  const policies = /* @__PURE__ */ new Map();
  for (const plugin of plugins)
    for (const [provider, policy] of Object.entries(plugin.modelIdNormalization?.providers ?? {}))
      policies.set(normalizeLowercaseStringOrEmpty(provider), policy);
  return policies;
}
/** Replace the process-local manifest normalization policy snapshot. */
function setCurrentManifestModelIdNormalizationRecords(plugins) {
  currentManifestModelIdNormalizationPolicies = plugins
    ? collectManifestModelIdNormalizationPolicies(plugins)
    : void 0;
}
/** Return the current process-local manifest normalization policy snapshot. */
function getCurrentManifestModelIdNormalizationPolicies() {
  return currentManifestModelIdNormalizationPolicies;
}
/** Return true when a model id already includes a provider namespace. */
function hasProviderPrefix(modelId) {
  return modelId.includes("/");
}
/** Join a provider prefix and model id with exactly one slash. */
function formatPrefixedModelId(prefix, modelId) {
  return `${prefix.replace(/\/+$/u, "")}/${modelId.replace(/^\/+/u, "")}`;
}
/** Strip a duplicated self-provider prefix from a model id. */
function stripSelfProviderModelPrefix(provider, model) {
  const prefix = `${normalizeLowercaseStringOrEmpty(provider)}/`;
  const trimmed = model.trim();
  return normalizeLowercaseStringOrEmpty(trimmed).startsWith(prefix)
    ? trimmed.slice(prefix.length)
    : model;
}
/** Apply manifest normalization policies for one provider/model id. */
function normalizeProviderModelIdWithPolicies(params) {
  const policy = params.policies.get(normalizeLowercaseStringOrEmpty(params.provider));
  if (!policy) return;
  let modelId = params.context.modelId.trim();
  if (!modelId) return modelId;
  for (const prefix of policy.stripPrefixes ?? []) {
    const normalizedPrefix = normalizeLowercaseStringOrEmpty(prefix);
    if (normalizedPrefix && normalizeLowercaseStringOrEmpty(modelId).startsWith(normalizedPrefix)) {
      modelId = modelId.slice(normalizedPrefix.length);
      break;
    }
  }
  modelId = policy.aliases?.[normalizeLowercaseStringOrEmpty(modelId)] ?? modelId;
  if (!hasProviderPrefix(modelId)) {
    for (const rule of policy.prefixWhenBareAfterAliasStartsWith ?? [])
      if (normalizeLowercaseStringOrEmpty(modelId).startsWith(rule.modelPrefix.toLowerCase()))
        return formatPrefixedModelId(rule.prefix, modelId);
    if (policy.prefixWhenBare) return formatPrefixedModelId(policy.prefixWhenBare, modelId);
  }
  return modelId;
}
/** Apply built-in provider-specific model id normalization rules. */
function normalizeBuiltInProviderModelId(provider, model) {
  const normalizedProvider = normalizeLowercaseStringOrEmpty(provider);
  if (
    normalizedProvider === "google" ||
    normalizedProvider === "google-gemini-cli" ||
    normalizedProvider === "google-vertex"
  )
    return normalizeGooglePreviewModelId(model);
  if (normalizedProvider === "openrouter") {
    const trimmed = model.trim();
    return trimmed && !trimmed.includes("/") ? `openrouter/${trimmed}` : model;
  }
  if (normalizedProvider === "anthropic") {
    const anthropicAliases = {
      "opus-4.8": "claude-opus-4-8",
      opus: "claude-opus-4-8",
      "opus-4.6": "claude-opus-4-6",
      "sonnet-5": "claude-sonnet-5",
      sonnet: "claude-sonnet-5",
      "sonnet-4.6": "claude-sonnet-4-6",
    };
    const providerModel = normalizeLowercaseStringOrEmpty(model).startsWith("anthropic/")
      ? model.trim().slice(10)
      : model;
    return anthropicAliases[normalizeLowercaseStringOrEmpty(providerModel)] ?? providerModel;
  }
  if (normalizedProvider === "vercel-ai-gateway") {
    const aliased =
      {
        "opus-4.6": "claude-opus-4-6",
        "sonnet-5": "claude-sonnet-5",
        sonnet: "claude-sonnet-4-6",
        "sonnet-4.6": "claude-sonnet-4-6",
      }[normalizeLowercaseStringOrEmpty(model)] ?? model;
    return normalizeLowercaseStringOrEmpty(aliased).startsWith("claude-")
      ? `anthropic/${aliased}`
      : aliased;
  }
  if (normalizedProvider === "huggingface")
    return normalizeLowercaseStringOrEmpty(model).startsWith("huggingface/")
      ? model.slice(12)
      : model;
  if (normalizedProvider === "nvidia") {
    const trimmed = model.trim();
    return trimmed && !trimmed.includes("/") ? `nvidia/${trimmed}` : model;
  }
  if (normalizedProvider === "xai")
    return (
      {
        "grok-4.3-latest": "grok-4.3",
        "grok-4.5-latest": "grok-4.5",
        "grok-build-latest": "grok-4.5",
        "grok-4-fast-reasoning": "grok-4-fast",
        "grok-4-1-fast-reasoning": "grok-4-1-fast",
      }[normalizeLowercaseStringOrEmpty(model)] ?? model
    );
  if (normalizedProvider === "openai") return model;
  if (normalizedProvider === "together") return normalizeTogetherModelId(model);
  return model;
}
/** Apply manifest policies and built-in normalization to a static provider/model id. */
function normalizeStaticProviderModelIdWithPolicies(provider, model, policies) {
  const normalizedProvider = normalizeLowercaseStringOrEmpty(provider);
  return normalizeBuiltInProviderModelId(
    normalizedProvider,
    policies
      ? (normalizeProviderModelIdWithPolicies({
          provider: normalizedProvider,
          policies,
          context: { modelId: model },
        }) ?? model)
      : model,
  );
}
/** Normalize a configured provider/model catalog reference using current policies. */
function normalizeConfiguredProviderCatalogModelId(
  provider,
  model,
  policies = getCurrentManifestModelIdNormalizationPolicies(),
) {
  return normalizeConfiguredProviderCatalogModelRef(
    normalizeStaticProviderModelIdWithPolicies(provider, model, policies),
  );
}
/** Normalize embedded Google model aliases inside provider/model catalog refs. */
function normalizeConfiguredProviderCatalogModelRef(providerModel) {
  const googlePrefix = "google/";
  if (!providerModel.startsWith(googlePrefix)) {
    const parsed = parseModelCatalogRef(providerModel);
    if (!parsed) return providerModel;
    if (!parsed.modelId.startsWith(googlePrefix)) return providerModel;
    const normalizedModelId = normalizeGooglePreviewModelId(parsed.modelId);
    return normalizedModelId === parsed.modelId
      ? providerModel
      : `${parsed.provider}/${normalizedModelId}`;
  }
  const modelId = providerModel.slice(7);
  const normalizedModelId = normalizeGooglePreviewModelId(modelId);
  return normalizedModelId === modelId ? providerModel : `${googlePrefix}${normalizedModelId}`;
}
//#endregion
//#region src/plugins/plugin-control-plane-context.ts
function resolveConfiguredPluginLoadPaths(config) {
  const paths = config?.plugins?.load?.paths;
  return Array.isArray(paths) ? paths : void 0;
}
/** Resolves plugin discovery roots and load paths for cache/fingerprint callers. */
function resolvePluginDiscoveryContext(params = {}) {
  return resolvePluginCacheInputs({
    env: params.env ?? process.env,
    workspaceDir: params.workspaceDir,
    loadPaths: [...(params.loadPaths ?? resolveConfiguredPluginLoadPaths(params.config) ?? [])],
  });
}
/** Hashes an already resolved plugin discovery context. */
function fingerprintPluginDiscoveryContext(context) {
  return hashJson(context);
}
/** Resolves all inputs that determine plugin control-plane activation state. */
function resolvePluginControlPlaneContext(params = {}) {
  const inventoryFingerprint =
    params.inventoryFingerprint ??
    (params.index ? resolveInstalledManifestRegistryIndexFingerprint(params.index) : void 0);
  return {
    discovery: resolvePluginDiscoveryContext(params),
    policyFingerprint: params.policyHash ?? resolveInstalledPluginIndexPolicyHash(params.config),
    ...(inventoryFingerprint ? { inventoryFingerprint } : {}),
    ...(params.activationFingerprint
      ? { activationFingerprint: params.activationFingerprint }
      : {}),
  };
}
/** Resolves a stable fingerprint for plugin control-plane activation state. */
function resolvePluginControlPlaneFingerprint(params = {}) {
  return fingerprintPluginControlPlaneContext(resolvePluginControlPlaneContext(params));
}
function fingerprintPluginControlPlaneContext(context) {
  return hashJson(context);
}
//#endregion
//#region src/plugins/plugin-scope.ts
/** Normalizes plugin id scope input into a sorted unique string list. */
function normalizePluginIdScope(ids) {
  if (ids === void 0) return;
  return Array.from(
    new Set(normalizeStringEntries(ids.filter((id) => typeof id === "string"))),
  ).toSorted();
}
/** True when plugin scope was explicitly provided, including an empty scope. */
function hasExplicitPluginIdScope(ids) {
  return ids !== void 0;
}
/** True when plugin scope was explicitly provided with at least one id. */
function hasNonEmptyPluginIdScope(ids) {
  return ids !== void 0 && ids.length > 0;
}
/** Creates a lookup set for explicit plugin scope, or null when unscoped. */
function createPluginIdScopeSet(ids) {
  if (ids === void 0) return null;
  return new Set(ids);
}
/** Serializes plugin scope for cache keys. */
function serializePluginIdScope(ids) {
  return ids === void 0 ? "__unscoped__" : JSON.stringify(ids);
}
//#endregion
//#region src/plugins/current-plugin-metadata-snapshot.ts
/** Tracks the current plugin metadata snapshot for control-plane lookups. */
let currentPluginMetadataConfigIdentityCache = /* @__PURE__ */ new WeakSet();
registerPluginMetadataProcessMemoLifecycleClear(() => {
  setCurrentManifestModelIdNormalizationRecords(void 0);
});
function resolvePluginMetadataControlPlaneFingerprint(config, options = {}) {
  return resolvePluginControlPlaneFingerprint({
    config,
    ...options,
  });
}
function isReusableCurrentPluginMetadataSnapshot(_snapshot) {
  return true;
}
function setCurrentPluginMetadataSnapshot(snapshot, options = {}) {
  currentPluginMetadataConfigIdentityCache = /* @__PURE__ */ new WeakSet();
  const compatiblePolicyHashes = snapshot
    ? options.compatibleConfigs?.map((config) => resolveInstalledPluginIndexPolicyHash(config))
    : void 0;
  const compatibleConfigFingerprints = snapshot
    ? options.compatibleConfigs?.map((config, index) =>
        resolvePluginMetadataControlPlaneFingerprint(config, {
          env: options.env,
          index: snapshot.index,
          policyHash: compatiblePolicyHashes?.[index],
          workspaceDir: options.workspaceDir ?? snapshot.workspaceDir,
        }),
      )
    : void 0;
  const configFingerprint = snapshot
    ? resolvePluginMetadataControlPlaneFingerprint(options.config, {
        env: options.env,
        index: snapshot.index,
        policyHash: snapshot.policyHash,
        workspaceDir: options.workspaceDir ?? snapshot.workspaceDir,
      })
    : void 0;
  const defaultDiscoveryConfigFingerprint = snapshot
    ? resolvePluginMetadataControlPlaneFingerprint(
        {},
        {
          env: options.env,
          index: snapshot.index,
          policyHash: snapshot.policyHash,
          workspaceDir: options.workspaceDir ?? snapshot.workspaceDir,
        },
      )
    : void 0;
  setCurrentManifestModelIdNormalizationRecords(
    snapshot &&
      defaultDiscoveryConfigFingerprint &&
      (configFingerprint === defaultDiscoveryConfigFingerprint ||
        snapshot.configFingerprint === defaultDiscoveryConfigFingerprint ||
        Boolean(compatibleConfigFingerprints?.includes(defaultDiscoveryConfigFingerprint)))
      ? snapshot.plugins
      : void 0,
  );
  setCurrentPluginMetadataSnapshotState(
    snapshot,
    configFingerprint,
    compatiblePolicyHashes,
    compatibleConfigFingerprints,
  );
  if (!snapshot) return;
  if (options.config) {
    const policyHash = resolveInstalledPluginIndexPolicyHash(options.config);
    if (policyHash === snapshot.policyHash || Boolean(compatiblePolicyHashes?.includes(policyHash)))
      currentPluginMetadataConfigIdentityCache.add(options.config);
  }
  for (const config of options.compatibleConfigs ?? [])
    currentPluginMetadataConfigIdentityCache.add(config);
}
function clearCurrentPluginMetadataSnapshot() {
  currentPluginMetadataConfigIdentityCache = /* @__PURE__ */ new WeakSet();
  setCurrentManifestModelIdNormalizationRecords(void 0);
  clearCurrentPluginMetadataSnapshotState();
}
function captureCurrentPluginMetadataSnapshotState() {
  return getCurrentPluginMetadataSnapshotState();
}
function restoreCurrentPluginMetadataSnapshotState(state) {
  currentPluginMetadataConfigIdentityCache = /* @__PURE__ */ new WeakSet();
  const snapshot = state.snapshot;
  const defaultDiscoveryConfigFingerprint = snapshot
    ? resolvePluginMetadataControlPlaneFingerprint(
        {},
        {
          index: snapshot.index,
          policyHash: snapshot.policyHash,
          workspaceDir: snapshot.workspaceDir,
        },
      )
    : void 0;
  setCurrentManifestModelIdNormalizationRecords(
    snapshot &&
      defaultDiscoveryConfigFingerprint &&
      (state.configFingerprint === defaultDiscoveryConfigFingerprint ||
        snapshot.configFingerprint === defaultDiscoveryConfigFingerprint ||
        Boolean(state.compatibleConfigFingerprints?.includes(defaultDiscoveryConfigFingerprint)))
      ? snapshot.plugins
      : void 0,
  );
  setCurrentPluginMetadataSnapshotState(
    state.snapshot,
    state.configFingerprint,
    state.compatiblePolicyHashes,
    state.compatibleConfigFingerprints,
  );
}
function getCurrentPluginMetadataSnapshot(params = {}) {
  const {
    snapshot: rawSnapshot,
    configFingerprint,
    compatiblePolicyHashes,
    compatibleConfigFingerprints,
  } = getCurrentPluginMetadataSnapshotState();
  const snapshot = rawSnapshot;
  if (!snapshot) return;
  const env = params.env ?? process.env;
  const requestedPluginIds = normalizePluginIdScope(
    params.pluginIds ?? params.pluginIdScope?.resolve({ index: snapshot.index }),
  );
  const snapshotPluginIds = normalizePluginIdScope(snapshot.pluginIds);
  if (
    requestedPluginIds !== void 0 &&
    serializePluginIdScope(snapshotPluginIds) !== serializePluginIdScope(requestedPluginIds)
  )
    return;
  if (
    snapshotPluginIds !== void 0 &&
    requestedPluginIds === void 0 &&
    params.allowScopedSnapshot !== true
  )
    return;
  const requestedWorkspaceDir =
    params.workspaceDir ??
    (params.allowWorkspaceScopedSnapshot === true ? snapshot.workspaceDir : void 0);
  if (snapshot.workspaceDir !== void 0 && requestedWorkspaceDir === void 0) return;
  if (
    requestedWorkspaceDir !== void 0 &&
    (snapshot.workspaceDir ?? "") !== (requestedWorkspaceDir ?? "")
  )
    return;
  const canReuseCachedConfig = Boolean(
    params.config && currentPluginMetadataConfigIdentityCache.has(params.config),
  );
  if (canReuseCachedConfig && params.requireDefaultDiscoveryContext !== true) return snapshot;
  const requestedPolicyHash =
    params.config && !canReuseCachedConfig
      ? resolveInstalledPluginIndexPolicyHash(params.config)
      : void 0;
  if (requestedPolicyHash && snapshot.policyHash !== requestedPolicyHash) {
    if (!compatiblePolicyHashes?.includes(requestedPolicyHash)) return;
  }
  if (params.config && !canReuseCachedConfig) {
    const requestedConfigFingerprint = resolvePluginMetadataControlPlaneFingerprint(params.config, {
      env,
      index: snapshot.index,
      policyHash: requestedPolicyHash,
      workspaceDir: requestedWorkspaceDir,
    });
    if (
      !(
        configFingerprint === requestedConfigFingerprint ||
        snapshot.configFingerprint === requestedConfigFingerprint ||
        Boolean(compatibleConfigFingerprints?.includes(requestedConfigFingerprint))
      )
    )
      return;
  }
  if (params.requireDefaultDiscoveryContext === true) {
    const defaultDiscoveryConfigFingerprint = resolvePluginMetadataControlPlaneFingerprint(
      {},
      {
        env: params.env,
        index: snapshot.index,
        policyHash: snapshot.policyHash,
        workspaceDir: requestedWorkspaceDir,
      },
    );
    if (
      !(
        configFingerprint === defaultDiscoveryConfigFingerprint ||
        snapshot.configFingerprint === defaultDiscoveryConfigFingerprint ||
        Boolean(compatibleConfigFingerprints?.includes(defaultDiscoveryConfigFingerprint))
      )
    )
      return;
  }
  return snapshot;
}
//#endregion
export {
  normalizeConfiguredProviderCatalogModelId as _,
  restoreCurrentPluginMetadataSnapshotState as a,
  normalizeStaticProviderModelIdWithPolicies as b,
  hasExplicitPluginIdScope as c,
  serializePluginIdScope as d,
  fingerprintPluginDiscoveryContext as f,
  normalizeBuiltInProviderModelId as g,
  collectManifestModelIdNormalizationPolicies as h,
  isReusableCurrentPluginMetadataSnapshot as i,
  hasNonEmptyPluginIdScope as l,
  resolvePluginDiscoveryContext as m,
  clearCurrentPluginMetadataSnapshot as n,
  setCurrentPluginMetadataSnapshot as o,
  resolvePluginControlPlaneFingerprint as p,
  getCurrentPluginMetadataSnapshot as r,
  createPluginIdScopeSet as s,
  captureCurrentPluginMetadataSnapshotState as t,
  normalizePluginIdScope as u,
  normalizeConfiguredProviderCatalogModelRef as v,
  stripSelfProviderModelPrefix as x,
  normalizeProviderModelIdWithPolicies as y,
};
