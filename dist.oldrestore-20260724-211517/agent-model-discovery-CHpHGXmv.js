import path from "node:path";
import { t as resolveEnvApiKey } from "./model-auth-env-DLe5znyS.js";
import {
  b as resolveProviderEnvAuthLookupMaps,
  y as listProviderEnvAuthLookupKeys,
} from "./model-auth-markers-CA2Xy59Z.js";
import "./utils-DtcDeqWS.js";
import { t as resolveModelPluginMetadataSnapshot } from "./model-discovery-context-B688uj_v.js";
import { o as asDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import { a as normalizeModelCompat } from "./provider-model-compat-oht7fX8H.js";
import {
  g as normalizeProviderResolvedModelWithPlugin,
  j as resolveProviderSyntheticAuthWithPlugin,
  r as applyProviderResolvedTransportWithPlugin,
} from "./provider-runtime-DyIHJ2cX.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { mt as ModelRegistry, xt as AuthStorage } from "./sessions-Duh5damM.js";
import {
  d as loadAuthProfileStoreForSecretsRuntime,
  f as loadAuthProfileStoreWithoutExternalProfiles,
  i as ensureAuthProfileStore,
  o as ensureAuthProfileStoreWithoutExternalProfiles,
  u as loadAuthProfileStoreForRuntime,
} from "./store-B7DoDdVM.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { r as resolveRuntimeSyntheticAuthProviderRefs } from "./synthetic-auth.runtime.js";
import { s as coerceSecretRef } from "./types.secrets-BV0ywRAy.js";
//#region src/agents/agent-auth-credentials.ts
/** Converts auth-profile credentials into agent runtime credential maps. */
const AGENT_SECRET_REF_CONFIGURED_MARKER = "openclaw-secret-ref-configured";
function hasConfiguredSecretRef(value) {
  return coerceSecretRef(value) !== null;
}
function secretRefPlaceholder(options) {
  if (options?.includeSecretRefPlaceholders === true)
    return {
      type: "api_key",
      key: AGENT_SECRET_REF_CONFIGURED_MARKER,
    };
  return null;
}
function convertAuthProfileCredentialToAgent(cred, options) {
  if (cred.type === "api_key") {
    const key = normalizeOptionalString(cred.key) ?? "";
    if (!key) return hasConfiguredSecretRef(cred.keyRef) ? secretRefPlaceholder(options) : null;
    return {
      type: "api_key",
      key,
    };
  }
  if (cred.type === "token") {
    if (cred.expires !== void 0) {
      const expires = asDateTimestampMs(cred.expires);
      if (expires === void 0 || Date.now() >= expires) return null;
    }
    const token = normalizeOptionalString(cred.token) ?? "";
    if (!token) return hasConfiguredSecretRef(cred.tokenRef) ? secretRefPlaceholder(options) : null;
    return {
      type: "api_key",
      key: token,
    };
  }
  if (cred.type === "oauth") {
    const access = normalizeOptionalString(cred.access) ?? "";
    const refresh = normalizeOptionalString(cred.refresh) ?? "";
    const expires = asDateTimestampMs(cred.expires);
    if (!access || !refresh || expires === void 0 || expires <= 0) return null;
    return {
      type: "oauth",
      access,
      refresh,
      expires,
    };
  }
  return null;
}
/** Build one credential per normalized provider from an auth profile store. */
function resolveAgentCredentialMapFromStore(store, options) {
  const credentials = {};
  for (const credential of Object.values(store.profiles)) {
    const provider = normalizeProviderId(credential.provider ?? "");
    if (!provider || credentials[provider]) continue;
    const converted = convertAuthProfileCredentialToAgent(credential, options);
    if (converted) credentials[provider] = converted;
  }
  return credentials;
}
//#endregion
//#region src/agents/agent-auth-discovery-core.ts
/** Adds provider credentials resolvable from env/config without mutating existing credentials. */
function addEnvBackedAgentCredentials(credentials, options = {}) {
  const env = options.env ?? process.env;
  const {
    aliasMap,
    envCandidateMap: candidateMap,
    authEvidenceMap,
  } = resolveProviderEnvAuthLookupMaps({
    config: options.config,
    workspaceDir: options.workspaceDir,
    env,
  });
  const next = { ...credentials };
  for (const provider of listProviderEnvAuthLookupKeys({
    envCandidateMap: candidateMap,
    authEvidenceMap,
  })) {
    if (next[provider]) continue;
    const resolved = resolveEnvApiKey(provider, env, {
      config: options.config,
      workspaceDir: options.workspaceDir,
      aliasMap,
      candidateMap,
      authEvidenceMap,
    });
    if (!resolved?.apiKey) continue;
    next[provider] = {
      type: "api_key",
      key: resolved.apiKey,
    };
  }
  return next;
}
//#endregion
//#region src/agents/agent-auth-discovery.ts
/** Discovers agent runtime credentials from auth profiles, env, and synthetic providers. */
/** Resolves agent credentials from auth profiles, env, and synthetic auth hooks. */
function resolveAgentCredentialsForDiscovery(agentDir, options) {
  const storeOptions = {
    allowKeychainPrompt: false,
    ...(options?.config ? { config: options.config } : {}),
    ...(options?.externalCli ? { externalCli: options.externalCli } : {}),
  };
  const credentials = addEnvBackedAgentCredentials(
    resolveAgentCredentialMapFromStore(
      options?.skipExternalAuthProfiles === true
        ? options.readOnly === true
          ? loadAuthProfileStoreWithoutExternalProfiles(agentDir)
          : ensureAuthProfileStoreWithoutExternalProfiles(agentDir, { allowKeychainPrompt: false })
        : options?.readOnly === true
          ? options.externalCli || options.config
            ? loadAuthProfileStoreForRuntime(agentDir, {
                readOnly: true,
                ...storeOptions,
              })
            : loadAuthProfileStoreForSecretsRuntime(agentDir)
          : ensureAuthProfileStore(agentDir, storeOptions),
      { includeSecretRefPlaceholders: options?.readOnly === true },
    ),
    {
      config: options?.config,
      workspaceDir: options?.workspaceDir,
      env: options?.env,
    },
  );
  const syntheticAuthProviderRefs =
    options?.syntheticAuthProviderRefs ?? resolveRuntimeSyntheticAuthProviderRefs();
  for (const provider of syntheticAuthProviderRefs) {
    if (credentials[provider]) continue;
    const apiKey = resolveProviderSyntheticAuthWithPlugin({
      provider,
      context: {
        config: void 0,
        provider,
        providerConfig: void 0,
      },
    })?.apiKey?.trim();
    if (!apiKey) continue;
    credentials[provider] = {
      type: "api_key",
      key: apiKey,
    };
  }
  return credentials;
}
//#endregion
//#region src/agents/agent-model-discovery.ts
/** Discovers agent models and auth storage with provider/plugin normalization hooks. */
/** Applies plugin model normalization and transport hooks to discovered agent models. */
function normalizeDiscoveredAgentModel(value, agentDir, options) {
  if (!isRecord(value)) return value;
  if (
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    typeof value.provider !== "string"
  )
    return value;
  const model = value;
  const runtimeContext = {
    ...(options?.config !== void 0 ? { config: options.config } : {}),
    ...(options?.workspaceDir !== void 0 ? { workspaceDir: options.workspaceDir } : {}),
  };
  const pluginNormalized =
    normalizeProviderResolvedModelWithPlugin({
      provider: model.provider,
      modelId: model.id,
      ...runtimeContext,
      context: {
        provider: model.provider,
        modelId: model.id,
        model,
        agentDir,
      },
    }) ?? model;
  const transportNormalized =
    applyProviderResolvedTransportWithPlugin({
      provider: model.provider,
      modelId: model.id,
      ...runtimeContext,
      context: {
        provider: model.provider,
        modelId: model.id,
        model: pluginNormalized,
        agentDir,
      },
    }) ?? pluginNormalized;
  if (
    !isRecord(transportNormalized) ||
    typeof transportNormalized.id !== "string" ||
    typeof transportNormalized.name !== "string" ||
    typeof transportNormalized.provider !== "string" ||
    typeof transportNormalized.api !== "string"
  )
    return value;
  return normalizeModelCompat(transportNormalized);
}
function createOpenClawModelRegistry(authStorage, modelsJsonPath, agentDir, options) {
  const pluginMetadataSnapshot = resolveModelPluginMetadataSnapshot({
    ...(options?.config ? { config: options.config } : {}),
    ...(options?.pluginMetadataSnapshot
      ? { pluginMetadataSnapshot: options.pluginMetadataSnapshot }
      : {}),
    ...(options?.workspaceDir ? { workspaceDir: options.workspaceDir } : {}),
    allowWorkspaceScopedCurrent: options?.workspaceDir === void 0,
    useRuntimeConfig: options?.config === void 0,
  });
  const registryOptions = pluginMetadataSnapshot ? { pluginMetadataSnapshot } : {};
  const registry = ModelRegistry.create(authStorage, modelsJsonPath, registryOptions);
  const getAll = registry.getAll.bind(registry);
  const getAvailable = registry.getAvailable.bind(registry);
  const find = registry.find.bind(registry);
  const refresh = registry.refresh.bind(registry);
  const providerFilter = options?.providerFilter ? normalizeProviderId(options.providerFilter) : "";
  const matchesProviderFilter = (entry) =>
    !providerFilter || normalizeProviderId(entry.provider) === providerFilter;
  const shouldNormalize = options?.normalizeModels !== false;
  const findCache = /* @__PURE__ */ new Map();
  const normalizeEntry = (entry) =>
    shouldNormalize ? normalizeDiscoveredAgentModel(entry, agentDir, options) : entry;
  registry.getAll = () => {
    const entries = getAll().filter((entry) => matchesProviderFilter(entry));
    return shouldNormalize ? entries.map(normalizeEntry) : entries;
  };
  registry.getAvailable = () => {
    const entries = getAvailable().filter((entry) => matchesProviderFilter(entry));
    return shouldNormalize ? entries.map(normalizeEntry) : entries;
  };
  registry.find = (provider, modelId) => {
    const key = `${normalizeProviderId(provider)}\0${modelId}`;
    if (findCache.has(key)) return findCache.get(key);
    const fallbackEntry = find(provider, modelId);
    const resolved = fallbackEntry ? normalizeEntry(fallbackEntry) : void 0;
    findCache.set(key, resolved);
    return resolved;
  };
  registry.refresh = () => {
    findCache.clear();
    return refresh();
  };
  return registry;
}
/** Creates auth storage for model discovery from stored and env-backed credentials. */
/** Builds auth storage for model discovery without prompting for secrets. */
function discoverAuthStorage(agentDir, options) {
  const credentials =
    options?.skipCredentials === true ? {} : resolveAgentCredentialsForDiscovery(agentDir, options);
  return AuthStorage.inMemory(credentials);
}
/** Creates the model registry used by agent model discovery. */
/** Creates a model registry for one agent directory, optionally filtered and plugin-normalized. */
function discoverModels(authStorage, agentDir, options) {
  return createOpenClawModelRegistry(
    authStorage,
    path.join(agentDir, "models.json"),
    agentDir,
    options,
  );
}
//#endregion
export {
  addEnvBackedAgentCredentials as a,
  resolveAgentCredentialsForDiscovery as i,
  discoverModels as n,
  normalizeDiscoveredAgentModel as r,
  discoverAuthStorage as t,
};
