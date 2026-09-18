import { existsSync } from "node:fs";
import path from "node:path";
import {
  a as resolveAgentDir,
  n as listAgentIds,
  s as resolveDefaultAgentDir,
} from "./agent-scope-config-DVIR1nBa.js";
import "./utils-DtcDeqWS.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import "./path-resolve-8wkj2l4Z.js";
import { v as resolveOAuthPath } from "./paths-DEklnbzU.js";
import {
  n as hasSecretRefCandidate,
  t as hasCredentialBearingObjectValue,
} from "./runtime-secret-scan-ybzLn0UC.js";
import { i as getRuntimeAuthProfileStoreCredentialsRevision } from "./runtime-snapshots-BU3oOWrH.js";
import { c as resolveAuthProfileDatabasePath } from "./sqlite-BXljtvPf.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
//#region src/secrets/runtime-fast-path.ts
/** Detects when secrets runtime preparation can safely use a fast path. */
const RUNTIME_PATH_ENV_KEYS = [
  "HOME",
  "USERPROFILE",
  "HOMEDRIVE",
  "HOMEPATH",
  "OPENCLAW_HOME",
  "OPENCLAW_STATE_DIR",
  "OPENCLAW_CONFIG_PATH",
  "OPENCLAW_AGENT_DIR",
  "OPENCLAW_TEST_FAST",
];
/**
 * Merges caller env with process path env needed for config and agent-dir resolution.
 */
function mergeSecretsRuntimeEnv(env) {
  const merged = { ...(env ?? process.env) };
  for (const key of RUNTIME_PATH_ENV_KEYS) {
    if (merged[key] !== void 0) continue;
    const processValue = process.env[key];
    if (processValue !== void 0) merged[key] = processValue;
  }
  return merged;
}
/**
 * Collects default and named agent directories that may contain auth profile stores.
 */
function collectCandidateAgentDirs(config, env = process.env) {
  const dirs = /* @__PURE__ */ new Set();
  dirs.add(resolveUserPath(resolveDefaultAgentDir(config, env), env));
  for (const agentId of listAgentIds(config))
    dirs.add(resolveUserPath(resolveAgentDir(config, agentId, env), env));
  return [...dirs];
}
/**
 * Combines explicit refresh agent dirs with config-derived dirs for runtime refresh.
 */
function resolveRefreshAgentDirs(config, context) {
  const configDerived = collectCandidateAgentDirs(config, context.env);
  if (!context.explicitAgentDirs || context.explicitAgentDirs.length === 0) return configDerived;
  return uniqueStrings([...context.explicitAgentDirs, ...configDerived]);
}
function resolveCandidateAgentDirs(params) {
  return params.agentDirs?.length
    ? uniqueStrings(params.agentDirs.map((entry) => resolveUserPath(entry, params.env)))
    : collectCandidateAgentDirs(params.config, params.env);
}
function hasCandidateAuthProfileStoreSource(agentDir) {
  return (
    existsSync(resolveAuthProfileDatabasePath(agentDir)) ||
    existsSync(path.join(agentDir, "auth-profiles.json")) ||
    existsSync(path.join(agentDir, "auth-state.json")) ||
    existsSync(path.join(agentDir, "auth.json"))
  );
}
/**
 * Returns whether auth profile files or OAuth state exist for candidate agent dirs.
 */
function hasCandidateAuthProfileStoreSources(params) {
  const candidateDirs = resolveCandidateAgentDirs(params);
  const mainAgentDir = resolveUserPath(resolveDefaultAgentDir({}, params.env), params.env);
  return (
    candidateDirs.some((agentDir) => hasCandidateAuthProfileStoreSource(agentDir)) ||
    hasCandidateAuthProfileStoreSource(mainAgentDir) ||
    existsSync(resolveOAuthPath(params.env))
  );
}
/**
 * Creates empty web-tool metadata for snapshots that do not need secret resolution.
 */
function createEmptyRuntimeWebToolsMetadata() {
  return {
    search: {
      providerSource: "none",
      diagnostics: [],
    },
    fetch: {
      providerSource: "none",
      diagnostics: [],
    },
    diagnostics: [],
  };
}
function hasActiveRuntimeWebFetchProviderSurface(fetch, defaults) {
  if (!fetch || typeof fetch !== "object" || Array.isArray(fetch)) return false;
  const fetchConfig = fetch;
  if (fetchConfig.enabled === false) return false;
  if (typeof fetchConfig.provider === "string" && fetchConfig.provider.trim()) return true;
  return hasCredentialBearingObjectValue(fetchConfig, defaults);
}
function hasRuntimeWebToolConfigSurface(config) {
  const web = config.tools?.web;
  const defaults = config.secrets?.defaults;
  const fetchExplicitlyDisabled =
    web &&
    typeof web === "object" &&
    !Array.isArray(web) &&
    typeof web.fetch === "object" &&
    web.fetch?.enabled === false;
  if (web && typeof web === "object" && !Array.isArray(web)) {
    const webRecord = web;
    if ("search" in webRecord || "x_search" in webRecord) return true;
    if ("fetch" in webRecord && hasActiveRuntimeWebFetchProviderSurface(webRecord.fetch, defaults))
      return true;
  }
  const entries = config.plugins?.entries;
  if (!entries || typeof entries !== "object" || Array.isArray(entries)) return false;
  return Object.values(entries).some((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) return false;
    const pluginConfig = entry.config;
    return (
      pluginConfig !== null &&
      typeof pluginConfig === "object" &&
      !Array.isArray(pluginConfig) &&
      ("webSearch" in pluginConfig || (!fetchExplicitlyDisabled && "webFetch" in pluginConfig))
    );
  });
}
/**
 * Returns whether a snapshot can skip full SecretRef/web-tool resolution.
 */
/** Returns whether current config/auth/plugin state allows skipping full secret preparation. */
function canUseSecretsRuntimeFastPath(params) {
  if (hasRuntimeWebToolConfigSurface(params.sourceConfig)) return false;
  const defaults = params.sourceConfig.secrets?.defaults;
  if (hasSecretRefCandidate(params.sourceConfig, defaults)) return false;
  return !params.authStores.some((entry) => hasSecretRefCandidate(entry.store, defaults));
}
/**
 * Prepares a runtime snapshot without resolving refs when config and auth stores contain none.
 */
function prepareSecretsRuntimeFastPathSnapshot(params) {
  const runtimeEnv = mergeSecretsRuntimeEnv(params.env);
  const authStoreCredentialsRevision = getRuntimeAuthProfileStoreCredentialsRevision();
  const sourceConfig = structuredClone(params.config);
  const resolvedConfig = structuredClone(params.config);
  const includeAuthStoreRefs = params.includeAuthStoreRefs ?? true;
  const candidateDirs = resolveCandidateAgentDirs({
    config: resolvedConfig,
    env: runtimeEnv,
    agentDirs: params.agentDirs,
  });
  let authStores = [];
  if (includeAuthStoreRefs)
    if (!params.loadAuthStore) {
      if (
        hasCandidateAuthProfileStoreSources({
          config: resolvedConfig,
          env: runtimeEnv,
          agentDirs: candidateDirs,
        })
      )
        return null;
      authStores = candidateDirs.map((agentDir) => ({
        agentDir,
        store: {
          version: 1,
          profiles: {},
        },
      }));
    } else {
      const loadAuthStore = params.loadAuthStore;
      authStores = candidateDirs.map((agentDir) => ({
        agentDir,
        store: structuredClone(loadAuthStore(agentDir)),
      }));
    }
  if (
    !canUseSecretsRuntimeFastPath({
      sourceConfig,
      authStores,
    })
  )
    return null;
  return {
    snapshot: {
      sourceConfig,
      config: resolvedConfig,
      authStores,
      authStoreCredentialsRevision,
      warnings: [],
      webTools: createEmptyRuntimeWebToolsMetadata(),
    },
    usesAuthStoreFallback: !params.loadAuthStore,
    refreshContext: {
      env: runtimeEnv,
      explicitAgentDirs: params.agentDirs?.length ? [...candidateDirs] : null,
      includeAuthStoreRefs,
      loadablePluginOrigins: params.loadablePluginOrigins ?? /* @__PURE__ */ new Map(),
      ...(params.manifestRegistry ? { manifestRegistry: params.manifestRegistry } : {}),
      ...(params.loadAuthStore ? { loadAuthStore: params.loadAuthStore } : {}),
    },
  };
}
//#endregion
export {
  prepareSecretsRuntimeFastPathSnapshot as a,
  mergeSecretsRuntimeEnv as i,
  collectCandidateAgentDirs as n,
  resolveRefreshAgentDirs as o,
  createEmptyRuntimeWebToolsMetadata as r,
  canUseSecretsRuntimeFastPath as t,
};
