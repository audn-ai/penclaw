import { c as normalizePluginsConfig } from "./config-state-C1Qyxaws.js";
import { r as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-DGhQ40qh.js";
import { t as appendUniqueEnvVarCandidates } from "./env-var-candidates-D_PA36up.js";
import { n as isInstalledPluginEnabled } from "./installed-plugin-index-lBfkb-7L.js";
import { i as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-BMgImu0m.js";
import {
  a as normalizePluginConfigId,
  i as isWorkspacePluginAllowedByConfig,
  n as resolveProviderAuthAliasMap,
} from "./provider-auth-aliases-RaEzqkSo.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import { n as listSetupProviderIds } from "./setup-descriptors-CBhOf5ID.js";
import { r as hasKind } from "./slots-kpL659LX.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
//#region src/secrets/provider-env-vars.ts
/** Resolves provider environment variable candidates and auth evidence from core/plugin metadata. */
const CORE_PROVIDER_AUTH_ENV_VAR_CANDIDATES = {
  anthropic: ["ANTHROPIC_OAUTH_TOKEN", "ANTHROPIC_API_KEY"],
  openai: ["CODEX_API_KEY", "OPENAI_API_KEY"],
  voyage: ["VOYAGE_API_KEY"],
  cerebras: ["CEREBRAS_API_KEY"],
  "anthropic-openai": ["ANTHROPIC_API_KEY"],
  "qwen-dashscope": ["DASHSCOPE_API_KEY"],
};
const CORE_PROVIDER_SETUP_ENV_VAR_OVERRIDES = {
  minimax: ["MINIMAX_API_KEY"],
  "minimax-cn": ["MINIMAX_API_KEY"],
};
function isWorkspacePluginTrustedForProviderEnvVars(plugin, config) {
  return isWorkspacePluginAllowedByConfig({
    config,
    isImplicitlyAllowed: (pluginId) =>
      hasKind(plugin.kind, "context-engine") &&
      normalizePluginConfigId(config?.plugins?.slots?.contextEngine) === pluginId,
    plugin,
  });
}
function shouldUsePluginProviderEnvVars(plugin, params) {
  if (plugin.origin !== "workspace" || params?.includeUntrustedWorkspacePlugins !== false)
    return true;
  return isWorkspacePluginTrustedForProviderEnvVars(plugin, params?.config);
}
function shouldUsePluginProviderAuthEvidence(plugin, params) {
  if (plugin.origin !== "workspace") return true;
  return isWorkspacePluginTrustedForProviderEnvVars(plugin, params?.config);
}
function appendUniqueAuthEvidence(target, providerId, evidence) {
  const normalizedProviderId = providerId.trim();
  if (!normalizedProviderId || evidence.length === 0) return;
  const bucket = (target[normalizedProviderId] ??= []);
  const seen = new Set(bucket.map((entry) => JSON.stringify(entry)));
  for (const entry of evidence) {
    const key = JSON.stringify(entry);
    if (seen.has(key)) continue;
    seen.add(key);
    bucket.push(entry);
  }
}
function appendUniqueProviderRef(target, providerId) {
  const normalized = normalizeProviderId(providerId);
  if (normalized) target.add(normalized);
}
function resolveProviderMetadataSnapshot(params) {
  if (params?.metadataSnapshot) return params.metadataSnapshot;
  const config = params?.config;
  const env = params?.env ?? process.env;
  let current;
  if (config)
    current = getCurrentPluginMetadataSnapshot({
      config,
      env,
      ...(params?.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {}),
      allowWorkspaceScopedSnapshot: true,
    });
  else
    current = getCurrentPluginMetadataSnapshot({
      env,
      ...(params?.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {}),
      allowWorkspaceScopedSnapshot: true,
      requireDefaultDiscoveryContext: true,
    });
  if (current) return current;
  if (config && normalizePluginsConfig(config.plugins).loadPaths.length === 0) {
    const unscopedCurrent = getCurrentPluginMetadataSnapshot({
      env,
      ...(params?.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {}),
      allowWorkspaceScopedSnapshot: true,
      requireDefaultDiscoveryContext: true,
    });
    if (unscopedCurrent) return unscopedCurrent;
  }
  return loadPluginMetadataSnapshot({
    config: config ?? {},
    workspaceDir: params?.workspaceDir,
    env,
    preferPersisted: false,
  });
}
function resolveManifestProviderAuthEnvVarCandidates(params) {
  const snapshot = resolveProviderMetadataSnapshot(params);
  return resolveManifestProviderAuthEnvVarCandidatesFromSnapshot(
    params,
    snapshot,
    resolveProviderAuthAliasMap({
      ...params,
      metadataSnapshot: snapshot,
    }),
  );
}
function resolveManifestProviderUsageAuthEnvVarNames(params) {
  return uniqueStrings(
    resolveProviderMetadataSnapshot(params)
      .plugins.filter((plugin) => shouldUsePluginProviderEnvVars(plugin, params))
      .flatMap((plugin) => Object.values(plugin.providerUsageAuthEnvVars ?? {}).flat()),
  );
}
function resolveManifestProviderAuthEnvVarCandidatesFromSnapshot(params, snapshot, aliases) {
  const candidates = {};
  for (const plugin of snapshot.plugins) {
    if (!shouldUsePluginProviderEnvVars(plugin, params)) continue;
    if (plugin.providerAuthEnvVars)
      for (const [providerId, keys] of Object.entries(plugin.providerAuthEnvVars).toSorted(
        ([left], [right]) => left.localeCompare(right),
      ))
        appendUniqueEnvVarCandidates(candidates, providerId, keys);
    for (const provider of plugin.setup?.providers ?? [])
      appendUniqueEnvVarCandidates(candidates, provider.id, provider.envVars ?? []);
  }
  for (const [alias, target] of Object.entries(aliases).toSorted(([left], [right]) =>
    left.localeCompare(right),
  )) {
    const keys = candidates[target];
    if (keys) appendUniqueEnvVarCandidates(candidates, alias, keys);
  }
  return candidates;
}
function resolveManifestProviderAuthEvidenceFromSnapshot(params, snapshot, aliases) {
  const evidenceByProvider = {};
  for (const plugin of snapshot.plugins) {
    if (
      snapshot.index.plugins.length > 0 &&
      !isInstalledPluginEnabled(snapshot.index, plugin.id, params?.config)
    )
      continue;
    if (!shouldUsePluginProviderAuthEvidence(plugin, params)) continue;
    for (const provider of plugin.setup?.providers ?? [])
      appendUniqueAuthEvidence(evidenceByProvider, provider.id, provider.authEvidence ?? []);
  }
  for (const [alias, target] of Object.entries(aliases).toSorted(([left], [right]) =>
    left.localeCompare(right),
  )) {
    const evidence = evidenceByProvider[target];
    if (evidence) appendUniqueAuthEvidence(evidenceByProvider, alias, evidence);
  }
  return evidenceByProvider;
}
function resolveManifestSetupProviderFallbackRefsFromSnapshot(params, snapshot, aliases) {
  const refs = /* @__PURE__ */ new Set();
  for (const plugin of snapshot.plugins) {
    if (
      snapshot.index.plugins.length > 0 &&
      !isInstalledPluginEnabled(snapshot.index, plugin.id, params?.config)
    )
      continue;
    if (plugin.setup?.requiresRuntime === false) continue;
    if (plugin.setup?.providers === void 0 && plugin.providers === void 0) continue;
    for (const providerId of listSetupProviderIds(plugin))
      appendUniqueProviderRef(refs, providerId);
  }
  for (const [alias, target] of Object.entries(aliases))
    if (refs.has(target)) appendUniqueProviderRef(refs, alias);
  return [...refs].toSorted((a, b) => a.localeCompare(b));
}
/** Resolves provider env-var candidates used by generic auth lookup. */
/** Resolves provider auth env-var candidates from core fallbacks and plugin metadata. */
function resolveProviderAuthEnvVarCandidates(params) {
  return {
    ...resolveManifestProviderAuthEnvVarCandidates(params),
    ...CORE_PROVIDER_AUTH_ENV_VAR_CANDIDATES,
  };
}
/** Resolves all provider auth lookup maps from a single metadata snapshot. */
function resolveProviderAuthLookupMaps(params) {
  const snapshot = resolveProviderMetadataSnapshot(params);
  const aliasMap = resolveProviderAuthAliasMap({
    ...params,
    metadataSnapshot: snapshot,
  });
  return {
    aliasMap,
    envCandidateMap: {
      ...resolveManifestProviderAuthEnvVarCandidatesFromSnapshot(params, snapshot, aliasMap),
      ...CORE_PROVIDER_AUTH_ENV_VAR_CANDIDATES,
    },
    authEvidenceMap: resolveManifestProviderAuthEvidenceFromSnapshot(params, snapshot, aliasMap),
    setupProviderFallbackRefs: resolveManifestSetupProviderFallbackRefsFromSnapshot(
      params,
      snapshot,
      aliasMap,
    ),
  };
}
/** Resolves env vars used by setup, default SecretRefs, and broad secret scrubbing. */
function resolveProviderEnvVars(params) {
  return {
    ...resolveProviderAuthEnvVarCandidates(params),
    ...CORE_PROVIDER_SETUP_ENV_VAR_OVERRIDES,
  };
}
function createLazyReadonlyRecord(resolve) {
  let cached;
  const getResolved = () => {
    cached ??= resolve();
    return cached;
  };
  return new Proxy(
    {},
    {
      get(_target, prop) {
        if (typeof prop !== "string") return;
        return getResolved()[prop];
      },
      has(_target, prop) {
        return typeof prop === "string" && Object.hasOwn(getResolved(), prop);
      },
      ownKeys() {
        return Reflect.ownKeys(getResolved());
      },
      getOwnPropertyDescriptor(_target, prop) {
        if (typeof prop !== "string") return;
        const value = getResolved()[prop];
        if (value === void 0) return;
        return {
          configurable: true,
          enumerable: true,
          value,
          writable: false,
        };
      },
    },
  );
}
/**
 * Provider env vars used for setup/default secret refs and broad secret
 * scrubbing. This can include non-model providers and may intentionally choose
 * a different preferred first env var than auth resolution.
 *
 * Bundled provider auth envs come from plugin manifests. The override map here
 * is only for true core/non-plugin providers and a few setup-specific ordering
 * overrides where generic onboarding wants a different preferred env var.
 */
const PROVIDER_ENV_VARS = createLazyReadonlyRecord(() => resolveProviderEnvVars());
/** Returns known env var candidates for a provider id or alias. */
function getProviderEnvVars(providerId, params) {
  const providerEnvVars = params ? resolveProviderEnvVars(params) : PROVIDER_ENV_VARS;
  const envVars = Object.hasOwn(providerEnvVars, providerId) ? providerEnvVars[providerId] : void 0;
  return Array.isArray(envVars) ? [...envVars] : [];
}
/** Lists known provider auth env vars without bridge-only env vars. */
function listKnownProviderAuthEnvVarNames(params) {
  return uniqueStrings([
    ...Object.values(resolveProviderAuthEnvVarCandidates(params)).flat(),
    ...Object.values(resolveProviderEnvVars(params)).flat(),
    ...resolveManifestProviderUsageAuthEnvVarNames(params),
  ]);
}
/** Lists env vars that may contain provider secrets for broad scrubbing. */
function listKnownSecretEnvVarNames(params) {
  return uniqueStrings([
    ...Object.values(resolveProviderEnvVars(params)).flat(),
    ...resolveManifestProviderUsageAuthEnvVarNames(params),
  ]);
}
/** Returns a copy of an env object with denied keys removed case-insensitively. */
function omitEnvKeysCaseInsensitive(baseEnv, keys) {
  const env = { ...baseEnv };
  const denied = /* @__PURE__ */ new Set();
  for (const key of keys) {
    const normalizedKey = key.trim();
    if (normalizedKey) denied.add(normalizedKey.toUpperCase());
  }
  if (denied.size === 0) return env;
  for (const actualKey of Object.keys(env))
    if (denied.has(actualKey.toUpperCase())) delete env[actualKey];
  return env;
}
//#endregion
export {
  resolveProviderAuthEnvVarCandidates as a,
  omitEnvKeysCaseInsensitive as i,
  listKnownProviderAuthEnvVarNames as n,
  resolveProviderAuthLookupMaps as o,
  listKnownSecretEnvVarNames as r,
  getProviderEnvVars as t,
};
