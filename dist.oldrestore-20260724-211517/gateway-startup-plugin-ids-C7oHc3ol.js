import { n as hasExplicitChannelConfig } from "./channel-presence-policy-5sGDOKpp.js";
import { t as collectPluginConfigContractMatches } from "./config-contract-matches-lI-0JTS4.js";
import { i as normalizePluginsConfigWithResolver } from "./config-normalization-shared-DXCRDrH7.js";
import {
  n as listExplicitlyDisabledChannelIdsForConfig,
  r as listPotentialConfiguredChannelIds,
} from "./config-presence-dDm96tuW.js";
import {
  o as normalizePluginId,
  u as resolveEffectivePluginActivationState,
} from "./config-state-C1Qyxaws.js";
import { r as collectConfiguredModelRefs } from "./configured-model-refs-wBBEGQ5a.js";
import { u as normalizePluginIdScope } from "./current-plugin-metadata-snapshot-DGhQ40qh.js";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.js";
import {
  J as resolveMemoryDreamingPluginId,
  K as resolveMemoryDreamingConfig,
  q as resolveMemoryDreamingPluginConfig,
  v as DEFAULT_MEMORY_DREAMING_PLUGIN_ID,
} from "./dreaming-CM8RB1ct.js";
import { n as resolveConfiguredGenericEmbeddingProviderId } from "./embedding-provider-config-DsOGw75I.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-Da47iiZE.js";
import {
  n as normalizeConfiguredSpeechProviderIdForStartup,
  t as collectConfiguredSpeechProviderIds,
} from "./gateway-startup-speech-providers-DRg9FZJd.js";
import { t as collectConfiguredAgentHarnessRuntimes } from "./harness-runtimes-Bweud8_5.js";
import { l as readResponseTextPrefix } from "./http-body-aoMvQQlg.js";
import { g as hashJson } from "./installed-plugin-index-lBfkb-7L.js";
import "./config-contracts-B2_LoKnh.js";
import { t as planManifestModelCatalogRows } from "./manifest-planner-DSmSdykb.js";
import {
  i as parseModelCatalogRef,
  t as buildModelCatalogMergeKey,
} from "./model-catalog-refs-BcuK-xC3.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import {
  a as resolvePluginMetadataSnapshot,
  n as isPluginMetadataSnapshotCompatible,
} from "./plugin-metadata-snapshot-BMgImu0m.js";
import {
  g as createPluginRegistryIdNormalizer,
  r as normalizePluginsConfigWithRegistry,
} from "./plugin-registry-BckMdz4f.js";
import { m as readProviderJsonResponse } from "./provider-http-errors-DLMRBkZU.js";
import {
  n as findNormalizedProviderValue,
  r as normalizeProviderId,
} from "./provider-id-BIcU_2-A.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { b as compileSafeRegex } from "./redact-CUe6Oey5.js";
import { t as resolveConfiguredSecretInputString } from "./resolve-configured-secret-input-string-BylZzfX0.js";
import { y as ssrfPolicyFromHttpBaseUrlAllowedHostname } from "./ssrf-keFRGQLq.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { p as normalizeSecretInputString } from "./types.secrets-BV0ywRAy.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import {
  i as normalizeWorkerProviderIds,
  r as manifestOwnsWorkerProvider,
  t as collectConfiguredWorkerProviderIds,
} from "./worker-provider-registry-CKsY-3qr.js";
//#region src/plugins/openai-compatible-embedding-provider.ts
/** Provider id for OpenAI-compatible remote embedding servers. */
const OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID = "openai-compatible";
const OPENAI_COMPATIBLE_MODEL_APIS = /* @__PURE__ */ new Set([
  "openai-completions",
  "openai-responses",
]);
const EMBEDDING_ERROR_BODY_MAX_BYTES = 8 * 1024;
const EMBEDDING_ERROR_BODY_MAX_CHARS = 1e3;
const EMBEDDING_ERROR_TRUNCATED_SUFFIX = "... [truncated]";
function normalizeBaseUrl(value) {
  const baseUrl = value?.trim();
  if (!baseUrl)
    throw new Error(
      "openai-compatible embeddings: missing remote.baseUrl. Set it to your OpenAI-compatible embeddings server, for example http://127.0.0.1:11434/v1.",
    );
  return baseUrl.replace(/\/+$/u, "");
}
function normalizeModel(value, providerId) {
  const model = value?.trim();
  if (!model)
    throw new Error(
      "openai-compatible embeddings: missing model. Set it to the embedding model id your server expects.",
    );
  const prefixes = new Set(
    [
      providerId?.trim(),
      normalizeProviderId(providerId ?? ""),
      OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID,
    ]
      .filter((prefix) => Boolean(prefix))
      .map((prefix) => `${prefix}/`),
  );
  for (const prefix of prefixes) if (model.startsWith(prefix)) return model.slice(prefix.length);
  return model;
}
function normalizeDimensions(value) {
  if (value === void 0) return;
  if (!Number.isInteger(value) || value <= 0)
    throw new Error("openai-compatible embeddings: dimensions must be a positive integer.");
  return value;
}
function normalizeOptionalInputType(value) {
  const inputType = value?.trim();
  return inputType ? inputType : void 0;
}
function normalizeOptionalString(value) {
  const normalized = value?.trim();
  return normalized ? normalized : void 0;
}
function chooseSecretInputOverride(override, fallback) {
  if (typeof override === "string") return override.trim() ? override : fallback;
  return override ?? fallback;
}
function resolveRequestInputType(client, kind) {
  if (kind === "query") return client.queryInputType ?? client.inputType;
  if (kind === "document") return client.documentInputType ?? client.inputType;
  return client.inputType;
}
function normalizeHeaderName(name) {
  return name.trim().toLowerCase();
}
async function buildHeaders(params) {
  const headers = {
    accept: "application/json",
    "content-type": "application/json",
  };
  for (const [name, rawValue] of Object.entries(params.extra ?? {})) {
    const normalizedName = normalizeHeaderName(name);
    if (!normalizedName || normalizedName === "authorization") continue;
    const value = await resolveSecretString({
      config: params.config,
      value: rawValue,
      path: `models.providers.*.headers.${normalizedName}`,
    });
    if (!value) continue;
    headers[normalizedName] = value;
  }
  if (params.apiKey) headers.authorization = `Bearer ${params.apiKey}`;
  return headers;
}
function isSensitiveHeaderName(name) {
  return (
    name === "authorization" ||
    name === "proxy-authorization" ||
    name.includes("api-key") ||
    name.includes("token") ||
    name.includes("secret")
  );
}
function sanitizeCacheHeaders(headers) {
  const safeHeaders = Object.fromEntries(
    Object.entries(headers).filter(([name]) => !isSensitiveHeaderName(name)),
  );
  return Object.keys(safeHeaders).length > 0 ? safeHeaders : void 0;
}
async function resolveSecretString(params) {
  const resolved = await resolveConfiguredSecretInputString({
    config: params.config,
    env: process.env,
    value: params.value,
    path: params.path,
    unresolvedReasonStyle: "detailed",
  });
  if (resolved.unresolvedRefReason) throw new Error(resolved.unresolvedRefReason);
  return normalizeSecretInputString(resolved.value);
}
async function resolveRemoteApiKey(config, value) {
  return await resolveSecretString({
    config,
    value,
    path: "agents.*.memorySearch.remote.apiKey",
  });
}
function isOpenAICompatibleProviderConfig(id, provider) {
  return (
    normalizeProviderId(id) === OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID ||
    OPENAI_COMPATIBLE_MODEL_APIS.has(normalizeProviderId(provider.api ?? "")) ||
    (!provider.api && typeof provider.baseUrl === "string" && provider.baseUrl.trim().length > 0)
  );
}
function resolveConfiguredProvider(options) {
  const providers = options.config.models?.providers;
  if (!providers) return;
  const providerId = options.provider?.trim() || OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID;
  const normalizedProviderId = normalizeProviderId(providerId);
  const direct = providers[providerId];
  if (direct && isOpenAICompatibleProviderConfig(providerId, direct))
    return {
      providerId,
      config: direct,
    };
  const normalizedEntry = Object.entries(providers).find(
    ([candidateId]) => normalizeProviderId(candidateId) === normalizedProviderId,
  );
  if (!normalizedEntry) return;
  const [configuredProviderId, config] = normalizedEntry;
  return isOpenAICompatibleProviderConfig(configuredProviderId, config)
    ? {
        providerId: configuredProviderId,
        config,
      }
    : void 0;
}
function embeddingInputToText(input) {
  if (typeof input === "string") return input;
  if (!input.parts || input.parts.length === 0) return input.text;
  const textParts = [];
  for (const part of input.parts) {
    if (part.type !== "text")
      throw new Error("openai-compatible embeddings only support text embedding inputs.");
    textParts.push(part.text);
  }
  return textParts.join("");
}
function asRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value : void 0;
}
function malformedEmbeddingResponse() {
  return /* @__PURE__ */ new Error("openai-compatible embeddings failed: malformed JSON response");
}
function readEmbeddingVector(value) {
  if (!Array.isArray(value)) throw malformedEmbeddingResponse();
  for (const entry of value)
    if (typeof entry !== "number" || !Number.isFinite(entry)) throw malformedEmbeddingResponse();
  return value;
}
function readEmbeddingVectors(payload, expectedCount) {
  if (!Array.isArray(payload.data) || payload.data.length !== expectedCount)
    throw malformedEmbeddingResponse();
  return payload.data.map((entry) => {
    const record = asRecord(entry);
    if (!record) throw malformedEmbeddingResponse();
    return readEmbeddingVector(record.embedding);
  });
}
async function readJsonResponse(response) {
  return await readProviderJsonResponse(response, "openai-compatible embeddings failed");
}
async function readEmbeddingErrorBodySnippet(response) {
  if (!response.body || response.bodyUsed) return;
  const prefix = await readResponseTextPrefix(response, EMBEDDING_ERROR_BODY_MAX_BYTES).catch(
    () => void 0,
  );
  if (!prefix?.text) return;
  const { text, truncated } = prefix;
  if (text.length > EMBEDDING_ERROR_BODY_MAX_CHARS)
    return `${truncateUtf16Safe(text, EMBEDDING_ERROR_BODY_MAX_CHARS)}${EMBEDDING_ERROR_TRUNCATED_SUFFIX}`;
  return truncated ? `${text}${EMBEDDING_ERROR_TRUNCATED_SUFFIX}` : text;
}
async function createEmbeddingHttpError(response) {
  const snippet = await readEmbeddingErrorBodySnippet(response);
  return /* @__PURE__ */ new Error(
    `openai-compatible embeddings failed: HTTP ${response.status}${snippet ? `: ${snippet}` : ""}`,
  );
}
async function postEmbeddingRequest(params) {
  const { client, input } = params;
  const inputType = resolveRequestInputType(client, params.inputType);
  const body = {
    model: client.model,
    input,
    ...(typeof client.dimensions === "number" ? { dimensions: client.dimensions } : {}),
    ...(inputType ? { input_type: inputType } : {}),
  };
  const localServiceLease =
    client.localServiceTarget && client.acquireLocalService
      ? await client.acquireLocalService(client.localServiceTarget, params.signal)
      : void 0;
  try {
    const { response, release } = await fetchWithSsrFGuard({
      url: `${client.baseUrl}/embeddings`,
      init: {
        method: "POST",
        headers: client.headers,
        body: JSON.stringify(body),
      },
      signal: params.signal,
      policy: client.ssrfPolicy,
      auditContext: "embedding-provider:openai-compatible",
    });
    try {
      if (!response.ok) throw await createEmbeddingHttpError(response);
      return readEmbeddingVectors(await readJsonResponse(response), input.length);
    } finally {
      await release();
    }
  } finally {
    localServiceLease?.release();
  }
}
/** Creates a normalized OpenAI-compatible embedding client from runtime config. */
async function createOpenAICompatibleEmbeddingClient(options) {
  const resolvedProvider = resolveConfiguredProvider(options);
  const configuredProvider = resolvedProvider?.config;
  const providerId =
    resolvedProvider?.providerId ??
    options.provider?.trim() ??
    OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID;
  const remoteBaseUrl = normalizeOptionalString(options.remote?.baseUrl);
  const baseUrl = normalizeBaseUrl(remoteBaseUrl ?? configuredProvider?.baseUrl);
  const model = normalizeModel(options.model, options.provider);
  const apiKey = await resolveRemoteApiKey(
    options.config,
    chooseSecretInputOverride(options.remote?.apiKey, configuredProvider?.apiKey),
  );
  const inputType = normalizeOptionalInputType(options.inputType);
  const queryInputType = normalizeOptionalInputType(options.queryInputType);
  const documentInputType = normalizeOptionalInputType(options.documentInputType);
  const headers = await buildHeaders({
    config: options.config,
    apiKey,
    extra: {
      ...configuredProvider?.headers,
      ...options.remote?.headers,
    },
  });
  const localServiceOptions = options;
  return {
    providerId,
    baseUrl,
    headers,
    ssrfPolicy: ssrfPolicyFromHttpBaseUrlAllowedHostname(baseUrl),
    model,
    ...(configuredProvider?.localService && !remoteBaseUrl
      ? {
          localServiceTarget: {
            providerId,
            baseUrl,
            headers,
          },
          acquireLocalService: localServiceOptions.acquireLocalService,
        }
      : {}),
    ...(options.dimensions !== void 0
      ? { dimensions: normalizeDimensions(options.dimensions) }
      : {}),
    ...(inputType ? { inputType } : {}),
    ...(queryInputType ? { queryInputType } : {}),
    ...(documentInputType ? { documentInputType } : {}),
  };
}
/** Creates an OpenAI-compatible embedding provider and its backing client. */
async function createOpenAICompatibleEmbeddingProvider(options) {
  const client = await createOpenAICompatibleEmbeddingClient(options);
  const embedBatch = async (inputs, callOptions) => {
    if (inputs.length === 0) return [];
    return await postEmbeddingRequest({
      client,
      input: inputs.map(embeddingInputToText),
      signal: callOptions?.signal,
      inputType: callOptions?.inputType,
    });
  };
  return {
    provider: {
      id: OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID,
      model: client.model,
      ...(typeof client.dimensions === "number" ? { dimensions: client.dimensions } : {}),
      embed: async (input, callOptions) => {
        const [embedding] = await embedBatch([input], callOptions);
        if (!embedding) throw malformedEmbeddingResponse();
        return embedding;
      },
      embedBatch,
    },
    client,
  };
}
/** Embedding provider adapter for OpenAI-compatible remote embedding APIs. */
const openAICompatibleEmbeddingProviderAdapter = {
  id: OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID,
  transport: "remote",
  create: async (options) => {
    const { provider, client } = await createOpenAICompatibleEmbeddingProvider(options);
    const cacheHeaders = sanitizeCacheHeaders(client.headers);
    return {
      provider,
      runtime: {
        id: OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID,
        inlineBatchTimeoutMs: 10 * 6e4,
        cacheKeyData: {
          provider: client.providerId,
          baseUrl: client.baseUrl,
          model: client.model,
          ...(typeof client.dimensions === "number" ? { dimensions: client.dimensions } : {}),
          ...(client.inputType ? { inputType: client.inputType } : {}),
          ...(client.queryInputType ? { queryInputType: client.queryInputType } : {}),
          ...(client.documentInputType ? { documentInputType: client.documentInputType } : {}),
          ...(cacheHeaders ? { headers: cacheHeaders } : {}),
        },
      },
    };
  },
};
//#endregion
//#region src/plugins/embedding-providers.ts
const EMBEDDING_PROVIDERS_KEY = Symbol.for("openclaw.embeddingProviders");
const CORE_EMBEDDING_PROVIDERS = [
  {
    adapter: openAICompatibleEmbeddingProviderAdapter,
    ownerPluginId: "core",
  },
];
function getEmbeddingProviders() {
  const globalStore = globalThis;
  const existing = globalStore[EMBEDDING_PROVIDERS_KEY];
  if (existing instanceof Map) return existing;
  const created = /* @__PURE__ */ new Map();
  globalStore[EMBEDDING_PROVIDERS_KEY] = created;
  return created;
}
function getCoreEmbeddingProvider(id) {
  return CORE_EMBEDDING_PROVIDERS.find((entry) => entry.adapter.id === id);
}
/** Registers an embedding provider adapter for plugin and built-in memory callers. */
function registerEmbeddingProvider(adapter, options) {
  const coreEntry = getCoreEmbeddingProvider(adapter.id);
  if (coreEntry) {
    if (adapter !== coreEntry.adapter)
      throw new Error(`embedding provider already registered: ${adapter.id} (owner: core)`);
    getEmbeddingProviders().delete(adapter.id);
    return;
  }
  getEmbeddingProviders().set(adapter.id, {
    adapter,
    ownerPluginId: options?.ownerPluginId,
  });
}
/** Looks up the registered embedding provider entry, including owner metadata. */
function getRegisteredEmbeddingProvider(id) {
  return getCoreEmbeddingProvider(id) ?? getEmbeddingProviders().get(id);
}
/** Lists registered embedding providers with core defaults merged first. */
function listRegisteredEmbeddingProviders() {
  const merged = new Map(CORE_EMBEDDING_PROVIDERS.map((entry) => [entry.adapter.id, entry]));
  for (const entry of getEmbeddingProviders().values())
    if (!merged.has(entry.adapter.id)) merged.set(entry.adapter.id, entry);
  return Array.from(merged.values());
}
function restoreRegisteredEmbeddingProviders(entries) {
  getEmbeddingProviders().clear();
  for (const entry of entries)
    registerEmbeddingProvider(entry.adapter, { ownerPluginId: entry.ownerPluginId });
}
/** Clears non-core embedding providers from the process registry. */
function clearEmbeddingProviders() {
  getEmbeddingProviders().clear();
}
//#endregion
//#region src/plugins/installed-plugin-index-scope-lookup.ts
const PROVIDER_CONTRIBUTION_CONTRACTS = [
  "externalAuthProviders",
  "embeddingProviders",
  "memoryEmbeddingProviders",
  "speechProviders",
  "realtimeTranscriptionProviders",
  "realtimeVoiceProviders",
  "mediaUnderstandingProviders",
  "meetingNotesSourceProviders",
  "imageGenerationProviders",
  "videoGenerationProviders",
  "musicGenerationProviders",
  "webFetchProviders",
  "webSearchProviders",
  "workerProviders",
  "usageProviders",
];
function appendOwner(owners, rawKey, pluginId) {
  const key = normalizeOptionalLowercaseString(rawKey);
  if (!key) return;
  const existing = owners.get(key);
  if (existing) {
    existing.push(pluginId);
    return;
  }
  owners.set(key, [pluginId]);
}
function freezeOwnerMap(owners) {
  return new Map(
    [...owners.entries()].map(([key, pluginIds]) => [key, Object.freeze([...new Set(pluginIds)])]),
  );
}
function addOwners(target, owners, ids) {
  for (const id of ids) {
    const normalized = normalizeOptionalLowercaseString(id);
    if (!normalized) continue;
    for (const pluginId of owners.get(normalized) ?? []) target.add(pluginId);
  }
}
function hasOwners(owners, ids) {
  return ids.every((id) => {
    const normalized = normalizeOptionalLowercaseString(id);
    return Boolean(normalized && owners.has(normalized));
  });
}
function listContributionValues(plugin, key) {
  const value = plugin.contributions?.[key];
  return Array.isArray(value) ? value : [];
}
function listContractContributionValues(plugin, key) {
  const value = plugin.contributions?.contracts?.[key];
  return Array.isArray(value) ? value : [];
}
function compileModelSupportPatterns(patterns) {
  const compiled = [];
  for (const pattern of patterns) {
    const regex = compileSafeRegex(pattern, "u");
    if (regex) compiled.push(regex);
  }
  return compiled;
}
function modelSupportOwnerMatches(owner, modelId) {
  const trimmed = modelId.trim();
  if (!trimmed) return false;
  if (owner.prefixes.some((prefix) => trimmed.startsWith(prefix))) return true;
  return owner.patterns.some((pattern) => pattern.test(trimmed));
}
function buildLookupMaps(index) {
  const channelContributionOwners = /* @__PURE__ */ new Map();
  const directChannelOwners = /* @__PURE__ */ new Map();
  const directProviderOwners = /* @__PURE__ */ new Map();
  const pluginIdsByLowercase = /* @__PURE__ */ new Map();
  const providerContributionOwners = /* @__PURE__ */ new Map();
  const modelSupportOwners = [];
  for (const plugin of index.plugins) {
    const normalizedPluginId = normalizeOptionalLowercaseString(plugin.pluginId);
    if (normalizedPluginId) {
      pluginIdsByLowercase.set(normalizedPluginId, plugin.pluginId);
      appendOwner(directChannelOwners, plugin.pluginId, plugin.pluginId);
      appendOwner(directProviderOwners, plugin.pluginId, plugin.pluginId);
      appendOwner(channelContributionOwners, plugin.pluginId, plugin.pluginId);
      appendOwner(providerContributionOwners, plugin.pluginId, plugin.pluginId);
    }
    appendOwner(directChannelOwners, plugin.packageChannel?.id, plugin.pluginId);
    appendOwner(channelContributionOwners, plugin.packageChannel?.id, plugin.pluginId);
    for (const channelId of listContributionValues(plugin, "channels"))
      appendOwner(channelContributionOwners, channelId, plugin.pluginId);
    for (const channelId of listContributionValues(plugin, "channelConfigs"))
      appendOwner(channelContributionOwners, channelId, plugin.pluginId);
    for (const providerId of listContributionValues(plugin, "providers"))
      appendOwner(providerContributionOwners, providerId, plugin.pluginId);
    for (const providerId of listContributionValues(plugin, "modelCatalogProviders"))
      appendOwner(providerContributionOwners, providerId, plugin.pluginId);
    for (const providerId of listContributionValues(plugin, "autoEnableProviderIds"))
      appendOwner(providerContributionOwners, providerId, plugin.pluginId);
    for (const contract of PROVIDER_CONTRIBUTION_CONTRACTS)
      for (const providerId of listContractContributionValues(plugin, contract))
        appendOwner(providerContributionOwners, providerId, plugin.pluginId);
    modelSupportOwners.push({
      pluginId: plugin.pluginId,
      prefixes: listContributionValues(plugin, "modelSupportPrefixes"),
      patterns: compileModelSupportPatterns(listContributionValues(plugin, "modelSupportPatterns")),
    });
  }
  return {
    channelContributionOwners: freezeOwnerMap(channelContributionOwners),
    directChannelOwners: freezeOwnerMap(directChannelOwners),
    directProviderOwners: freezeOwnerMap(directProviderOwners),
    installedPluginIds: new Set(pluginIdsByLowercase.keys()),
    modelSupportOwners,
    pluginIdsByLowercase,
    providerContributionOwners: freezeOwnerMap(providerContributionOwners),
  };
}
function createInstalledPluginIndexScopeLookup(index) {
  const maps = buildLookupMaps(index);
  const normalizeInstalledPluginId = (pluginId) => {
    const normalized = normalizePluginId(pluginId);
    const lowercase = normalizeOptionalLowercaseString(normalized);
    return lowercase ? (maps.pluginIdsByLowercase.get(lowercase) ?? normalized) : normalized;
  };
  return {
    addChannelContributionOwners: (target, ids) =>
      addOwners(target, maps.channelContributionOwners, ids),
    addDirectChannelOwners: (target, ids) => addOwners(target, maps.directChannelOwners, ids),
    addDirectProviderOwners: (target, ids) => addOwners(target, maps.directProviderOwners, ids),
    addProviderContributionOwners: (target, ids) =>
      addOwners(target, maps.providerContributionOwners, ids),
    addShorthandModelOwners: (target, modelIds) => {
      for (const modelId of modelIds)
        for (const owner of maps.modelSupportOwners)
          if (modelSupportOwnerMatches(owner, modelId)) target.add(owner.pluginId);
    },
    canResolveDirectProviderIds: (providerIds, scopePluginIds) => {
      const normalizedScope = new Set(
        [...scopePluginIds]
          .map((pluginId) => normalizeOptionalLowercaseString(pluginId))
          .filter((pluginId) => Boolean(pluginId)),
      );
      return providerIds.every((providerId) => {
        const normalized = normalizeOptionalLowercaseString(providerId);
        return Boolean(
          normalized &&
          (maps.directProviderOwners.has(normalized) || normalizedScope.has(normalized)),
        );
      });
    },
    hasChannelContributionOwners: (ids) => hasOwners(maps.channelContributionOwners, ids),
    hasCompleteConfigPathActivationMetadata: () =>
      index.plugins.every(
        (plugin) =>
          !plugin.compat.includes("activation-config-path-hint") ||
          plugin.startup.configPaths !== void 0,
      ),
    hasDirectChannelOwners: (ids) => hasOwners(maps.directChannelOwners, ids),
    hasInstalledPluginIds: (ids) =>
      [...ids].every((pluginId) => {
        const normalized = normalizeOptionalLowercaseString(pluginId);
        return Boolean(normalized && maps.installedPluginIds.has(normalized));
      }),
    hasProviderContributionOwners: (ids) => hasOwners(maps.providerContributionOwners, ids),
    hasShorthandModelOwners: (modelIds) =>
      modelIds.every((modelId) =>
        maps.modelSupportOwners.some((owner) => modelSupportOwnerMatches(owner, modelId)),
      ),
    normalizePluginId: normalizeInstalledPluginId,
  };
}
//#endregion
//#region src/plugins/provider-config-owner.ts
/** Core built-in model API ids that do not imply plugin ownership of a provider config. */
const CORE_BUILT_IN_MODEL_APIS = /* @__PURE__ */ new Set([
  "anthropic-messages",
  "azure-openai-responses",
  "google-generative-ai",
  "google-vertex",
  "mistral-conversations",
  "openai-chatgpt-responses",
  "openai-completions",
  "openai-responses",
]);
/** Returns the plugin API id that owns a provider config when it is not core built-in. */
function resolveProviderConfigApiOwnerHint(params) {
  const providers = params.config?.models?.providers;
  if (!providers) return;
  const normalizedProvider = normalizeProviderId(params.provider);
  if (!normalizedProvider) return;
  const providerConfig =
    providers[params.provider] ??
    Object.entries(providers).find(
      ([candidateId]) => normalizeProviderId(candidateId) === normalizedProvider,
    )?.[1];
  const api =
    typeof providerConfig?.api === "string" ? normalizeProviderId(providerConfig.api) : "";
  if (!api || api === normalizedProvider || CORE_BUILT_IN_MODEL_APIS.has(api)) return;
  return api;
}
//#endregion
//#region src/plugins/gateway-startup-plugin-ids.ts
/** Resolves plugin ids that should load during Gateway startup. */
function sortUniquePluginIds(values) {
  return [...new Set([...values].map((value) => value.trim()).filter(Boolean))].toSorted(
    (left, right) => left.localeCompare(right),
  );
}
function normalizePluginsConfigForInstalledIndex(config, lookup) {
  return normalizePluginsConfigWithResolver(config, lookup.normalizePluginId);
}
function isConfigActivationValueEnabled(value) {
  if (value === false) return false;
  if (isRecord(value) && value.enabled === false) return false;
  return true;
}
function listPotentialEnabledChannelIds(config, env) {
  const disabled = new Set(listExplicitlyDisabledChannelIdsForConfig(config));
  return listPotentialConfiguredChannelIds(config, env, { includePersistedAuthState: false })
    .map((id) => normalizeOptionalLowercaseString(id) ?? "")
    .filter((id) => id && !disabled.has(id));
}
function isGatewayStartupMemoryPlugin(plugin) {
  return plugin.startup.memory;
}
function resolveGatewayStartupDreamingEngineId(config) {
  if (
    !resolveMemoryDreamingConfig({
      pluginConfig: resolveMemoryDreamingPluginConfig(config),
      cfg: config,
    }).enabled
  )
    return;
  if (!resolveGatewayStartupDreamingSelectedPluginId(config)) return;
  return DEFAULT_MEMORY_DREAMING_PLUGIN_ID;
}
function resolveGatewayStartupDreamingSelectedPluginId(config) {
  const selectedPluginId = normalizeOptionalLowercaseString(resolveMemoryDreamingPluginId(config));
  return selectedPluginId && selectedPluginId !== "memory-core" ? selectedPluginId : void 0;
}
function blocksPluginStartup(params) {
  return (
    params.pluginsConfig.deny.includes(params.pluginId) ||
    params.activationSourcePlugins.deny.includes(params.pluginId) ||
    params.pluginsConfig.entries[params.pluginId]?.enabled === false ||
    params.activationSourcePlugins.entries[params.pluginId]?.enabled === false
  );
}
function resolveAuthorizedGatewayStartupDreamingPluginIds(params) {
  const engineId = resolveGatewayStartupDreamingEngineId(params.config);
  const dreamingSelectedPluginId = resolveGatewayStartupDreamingSelectedPluginId(params.config);
  if (!engineId || !params.pluginsConfig.enabled || !params.activationSourcePlugins.enabled)
    return /* @__PURE__ */ new Set();
  if (
    !params.selectedMemoryPluginId ||
    params.selectedMemoryPluginId !== dreamingSelectedPluginId ||
    params.selectedMemoryPluginId === engineId ||
    blocksPluginStartup({
      pluginId: engineId,
      pluginsConfig: params.pluginsConfig,
      activationSourcePlugins: params.activationSourcePlugins,
    })
  )
    return /* @__PURE__ */ new Set();
  const selectedPlugin = params.index.plugins.find(
    (plugin) => plugin.pluginId === params.selectedMemoryPluginId,
  );
  const sidecarPlugin = params.index.plugins.find((plugin) => plugin.pluginId === engineId);
  if (!selectedPlugin?.startup.memory || !sidecarPlugin?.startup.memory)
    return /* @__PURE__ */ new Set();
  return resolveEffectivePluginActivationState({
    id: selectedPlugin.pluginId,
    origin: selectedPlugin.origin,
    config: params.pluginsConfig,
    rootConfig: params.config,
    enabledByDefault: isPluginEnabledByDefaultForPlatform(selectedPlugin, params.platform),
    activationSource: params.activationSource,
  }).enabled
    ? /* @__PURE__ */ new Set([engineId])
    : /* @__PURE__ */ new Set();
}
function resolveMemorySlotStartupPluginId(params) {
  const { activationSourceConfig, activationSourcePlugins, normalizePluginId } = params;
  const configuredSlot = activationSourceConfig.plugins?.slots?.memory?.trim();
  if (configuredSlot?.toLowerCase() === "none") return;
  if (!configuredSlot) {
    const defaultSlot = activationSourcePlugins.slots.memory;
    if (typeof defaultSlot !== "string") return;
    if (
      activationSourcePlugins.allow.length > 0 &&
      !activationSourcePlugins.allow.includes(defaultSlot)
    )
      return;
    return defaultSlot;
  }
  return normalizePluginId(configuredSlot);
}
function resolveContextEngineSlotStartupPluginId(params) {
  const { activationSourceConfig, activationSourcePlugins, normalizePluginId } = params;
  const configuredSlot = activationSourceConfig.plugins?.slots?.contextEngine?.trim();
  if (!configuredSlot) return;
  const normalized = normalizePluginId(configuredSlot);
  if (normalized === "legacy") return;
  if (activationSourcePlugins.deny.includes(normalized)) return;
  if (activationSourcePlugins.entries[normalized]?.enabled === false) return;
  return normalized;
}
function shouldConsiderForGatewayStartup(params) {
  if (params.manifest?.activation?.onStartup === true) return true;
  if (params.contextEngineSlotStartupPluginId === params.plugin.pluginId) return true;
  if (!isGatewayStartupMemoryPlugin(params.plugin)) return false;
  if (params.startupDreamingPluginIds.has(params.plugin.pluginId)) return true;
  return params.memorySlotStartupPluginId === params.plugin.pluginId;
}
function hasConfiguredStartupChannel(params) {
  return listManifestChannelIds(params.manifestLookup, params.plugin.pluginId).some((channelId) =>
    params.configuredChannelIds.has(channelId),
  );
}
function createManifestRegistryLookup(manifestRegistry) {
  return new Map(manifestRegistry.plugins.map((plugin) => [plugin.id, plugin]));
}
function listManifestChannelIds(manifestLookup, pluginId) {
  return manifestLookup.get(pluginId)?.channels ?? [];
}
function findManifestPlugin(manifestLookup, pluginId) {
  return manifestLookup.get(pluginId);
}
function hasConfiguredActivationPath(params) {
  return hasConfiguredActivationPathPatterns({
    paths: params.manifest?.activation?.onConfigPaths,
    config: params.config,
  });
}
function hasConfiguredActivationPathPatterns(params) {
  const paths = params.paths;
  if (!paths?.length) return false;
  return paths.some((pathPattern) =>
    collectPluginConfigContractMatches({
      root: params.config,
      pathPattern,
    }).some((match) => isConfigActivationValueEnabled(match.value)),
  );
}
function addConfiguredActivationPathPluginIds(target, params) {
  for (const plugin of params.index.plugins) {
    if (plugin.origin !== "bundled") continue;
    if (
      hasConfiguredActivationPathPatterns({
        paths: plugin.startup.configPaths,
        config: params.activationSourceConfig,
      })
    )
      target.add(plugin.pluginId);
  }
}
function manifestOwnsConfiguredSpeechProvider(params) {
  if (params.configuredSpeechProviderIds.size === 0) return false;
  return (params.manifest?.contracts?.speechProviders ?? []).some((providerId) => {
    const normalized = normalizeConfiguredSpeechProviderIdForStartup(providerId);
    return normalized ? params.configuredSpeechProviderIds.has(normalized) : false;
  });
}
function collectConfiguredWebSearchProviderIds(config) {
  const search = config.tools?.web?.search;
  if (search?.enabled === false || typeof search?.provider !== "string")
    return /* @__PURE__ */ new Set();
  const providerId = normalizeOptionalLowercaseString(search.provider);
  return providerId ? /* @__PURE__ */ new Set([providerId]) : /* @__PURE__ */ new Set();
}
function manifestOwnsConfiguredWebSearchProvider(params) {
  if (params.configuredWebSearchProviderIds.size === 0) return false;
  return (params.manifest?.contracts?.webSearchProviders ?? []).some((providerId) => {
    const normalized = normalizeOptionalLowercaseString(providerId);
    return normalized ? params.configuredWebSearchProviderIds.has(normalized) : false;
  });
}
function listModelProviderRefs(value) {
  if (typeof value === "string") return [value];
  if (!isRecord(value)) return [];
  const refs = [];
  if (typeof value.primary === "string") refs.push(value.primary);
  if (Array.isArray(value.fallbacks)) {
    for (const fallback of value.fallbacks) if (typeof fallback === "string") refs.push(fallback);
  }
  return refs;
}
function listModelProviderRefParts(value) {
  return listModelProviderRefs(value)
    .map(parseModelCatalogRef)
    .filter((entry) => entry !== null)
    .map(({ provider, modelId }) => ({
      providerId: provider,
      modelId,
    }));
}
function collectModelProviderIds(value) {
  return new Set(
    listModelProviderRefs(value)
      .map((ref) => {
        const slashIndex = ref.indexOf("/");
        return slashIndex > 0 ? normalizeProviderId(ref.slice(0, slashIndex)) : "";
      })
      .filter((providerId) => Boolean(providerId)),
  );
}
function buildManifestModelProviderLookup(manifestRegistry) {
  return {
    modelApis: new Map(
      planManifestModelCatalogRows({ registry: manifestRegistry }).rows.flatMap((row) =>
        row.api ? [[row.mergeKey, row.api]] : [],
      ),
    ),
    providerIds: new Set(
      manifestRegistry.plugins.flatMap((plugin) => plugin.providers.map(normalizeProviderId)),
    ),
  };
}
function collectConfiguredAgentModelProviderIds(config, manifestRegistry) {
  const modelIdsByProvider = /* @__PURE__ */ new Map();
  const manifestModelProviders = buildManifestModelProviderLookup(manifestRegistry);
  const addModelProviderRefs = (value) => {
    for (const { providerId, modelId } of listModelProviderRefParts(value)) {
      const modelIds = modelIdsByProvider.get(providerId) ?? /* @__PURE__ */ new Set();
      modelIds.add(modelId);
      modelIdsByProvider.set(providerId, modelIds);
    }
  };
  const addModelMapProviderIds = (models) => {
    if (!isRecord(models)) return;
    for (const modelRef of Object.keys(models)) addModelProviderRefs(modelRef);
  };
  const defaults = config.agents?.defaults;
  addModelProviderRefs(defaults?.model);
  addModelProviderRefs(defaults?.utilityModel);
  addModelMapProviderIds(defaults?.models);
  const agents = Array.isArray(config.agents?.list) ? config.agents.list : [];
  for (const agent of agents) {
    if (!isRecord(agent)) continue;
    addModelProviderRefs(agent.model);
    addModelProviderRefs(agent.utilityModel);
    addModelMapProviderIds(agent.models);
  }
  return new Set(
    [...modelIdsByProvider.entries()]
      .filter(([providerId, modelIds]) => {
        return [...modelIds].some((modelId) =>
          configuredModelProviderNeedsRuntimePlugin({
            config,
            manifestModelProviders,
            providerId,
            modelId,
          }),
        );
      })
      .map(([providerId]) => providerId),
  );
}
function configuredModelProviderNeedsRuntimePlugin(params) {
  const providerConfig = params.config.models?.providers?.[params.providerId];
  const modelApi =
    providerConfig?.models?.find((model) => model.id === params.modelId)?.api ??
    providerConfig?.api ??
    params.manifestModelProviders.modelApis.get(
      buildModelCatalogMergeKey(params.providerId, params.modelId),
    );
  if (typeof modelApi === "string") return !CORE_BUILT_IN_MODEL_APIS.has(modelApi);
  return params.manifestModelProviders.providerIds.has(params.providerId);
}
function manifestOwnsConfiguredModelProvider(params) {
  if (params.configuredModelProviderIds.size === 0) return false;
  return (params.manifest?.providers ?? []).some((providerId) => {
    return params.configuredModelProviderIds.has(normalizeProviderId(providerId));
  });
}
function collectConfiguredGenerationProviderIds(config) {
  const defaults = config.agents?.defaults;
  return {
    imageGenerationProviders: collectModelProviderIds(defaults?.imageGenerationModel),
    videoGenerationProviders: collectModelProviderIds(defaults?.videoGenerationModel),
    musicGenerationProviders: collectModelProviderIds(defaults?.musicGenerationModel),
  };
}
function collectConfiguredVoiceProviderIds(config) {
  const providerIds = collectModelProviderIds(config.agents?.defaults?.voiceModel);
  return {
    speechProviders: providerIds,
    realtimeTranscriptionProviders: providerIds,
    realtimeVoiceProviders: providerIds,
  };
}
const MEMORY_EMBEDDING_PROVIDER_STARTUP_SKIP_IDS = /* @__PURE__ */ new Set(["auto", "none"]);
function normalizeMemoryEmbeddingProviderIdValue(value) {
  if (typeof value !== "string") return;
  return normalizeOptionalLowercaseString(value) || void 0;
}
function normalizeExplicitMemoryEmbeddingProviderId(value) {
  const normalized = normalizeMemoryEmbeddingProviderIdValue(value);
  return normalized && !MEMORY_EMBEDDING_PROVIDER_STARTUP_SKIP_IDS.has(normalized)
    ? normalized
    : void 0;
}
function readMemorySearchEnabled(memorySearch) {
  const enabled = memorySearch?.enabled;
  return typeof enabled === "boolean" ? enabled : void 0;
}
function isMemorySlotExplicitlyDisabled(config) {
  return normalizeOptionalLowercaseString(config.plugins?.slots?.memory) === "none";
}
/**
 * Resolve a configured memory embedding provider id to the adapter id(s) a
 * plugin manifest contract or runtime registry can own. Mirrors runtime
 * `getConfiguredMemoryEmbeddingProvider`: the raw id maps to a direct adapter,
 * and a custom `models.providers.<id>` entry additionally maps to its `api`
 * owner adapter (`provider: "ollama-5080"` with `api: "ollama"` -> "ollama").
 * Both candidates are returned so matching covers the direct adapter and the
 * API owner without the runtime adapter registry.
 */
function resolveMemoryEmbeddingProviderOwnerIds(providerId, config) {
  const ownerIds = [providerId];
  const genericOwnerId = normalizeOptionalLowercaseString(
    resolveConfiguredGenericEmbeddingProviderId(providerId, config),
  );
  if (genericOwnerId && genericOwnerId !== providerId) ownerIds.push(genericOwnerId);
  const ownerApi = normalizeOptionalLowercaseString(
    findNormalizedProviderValue(config.models?.providers, providerId)?.api,
  );
  if (ownerApi && ownerApi !== providerId) ownerIds.push(ownerApi);
  return ownerIds;
}
function resolveEffectiveMemoryEmbeddingProviderEntries(defaults, override) {
  if (!(readMemorySearchEnabled(override) ?? readMemorySearchEnabled(defaults) ?? true)) return [];
  const rawProvider = normalizeMemoryEmbeddingProviderIdValue(
    override?.provider ?? defaults?.provider,
  );
  const effectiveProvider = rawProvider === "auto" || !rawProvider ? "openai" : rawProvider;
  if (effectiveProvider === "none") return [];
  const entries = [];
  const provider =
    rawProvider && !MEMORY_EMBEDDING_PROVIDER_STARTUP_SKIP_IDS.has(rawProvider)
      ? rawProvider
      : void 0;
  if (provider)
    entries.push({
      configuredId: provider,
      source: "provider",
    });
  const fallback = normalizeExplicitMemoryEmbeddingProviderId(
    override?.fallback ?? defaults?.fallback ?? "none",
  );
  if (fallback && fallback !== effectiveProvider)
    entries.push({
      configuredId: fallback,
      source: "fallback",
    });
  return entries;
}
/**
 * Collect explicit memory embedding provider owners required by startup. The
 * resolver mirrors runtime memory-search inheritance for enablement, primary
 * provider, and fallback provider, then maps custom `models.providers` ids to
 * their API-owner adapter ids.
 */
function collectConfiguredMemoryEmbeddingStartupProviderOwners(config) {
  if (isMemorySlotExplicitlyDisabled(config)) return [];
  const byConfiguredIdAndSource = /* @__PURE__ */ new Map();
  const defaultsBlock = config.agents?.defaults?.memorySearch;
  const defaults = isRecord(defaultsBlock) ? defaultsBlock : void 0;
  const addEffectiveProviders = (override) => {
    for (const { configuredId, source } of resolveEffectiveMemoryEmbeddingProviderEntries(
      defaults,
      override,
    )) {
      const key = `${source}\0${configuredId}`;
      if (byConfiguredIdAndSource.has(key)) continue;
      byConfiguredIdAndSource.set(key, {
        configuredId,
        ownerIds: new Set(resolveMemoryEmbeddingProviderOwnerIds(configuredId, config)),
        source,
      });
    }
  };
  addEffectiveProviders(void 0);
  const agents = config.agents?.list;
  const agentEntries = Array.isArray(agents) ? agents.filter(isRecord) : [];
  if (agentEntries.length === 0) return [...byConfiguredIdAndSource.values()];
  for (const agent of agentEntries)
    addEffectiveProviders(isRecord(agent.memorySearch) ? agent.memorySearch : void 0);
  return [...byConfiguredIdAndSource.values()];
}
/**
 * Collect configured memory embedding provider ids that map to a plugin-owned
 * memory embedding provider contract, including the resolved `api` owner for
 * custom `models.providers` ids so the owning plugin loads at startup.
 */
function collectConfiguredMemoryEmbeddingProviderIds(config) {
  const providerIds = /* @__PURE__ */ new Set();
  for (const provider of collectConfiguredMemoryEmbeddingStartupProviderOwners(config))
    for (const ownerId of provider.ownerIds) providerIds.add(ownerId);
  return providerIds;
}
/**
 * Report configured memory embedding providers that no loaded plugin can serve.
 * A provider is unregistered only when none of its resolved adapter ids (the
 * configured id and its `models.providers.<id>.api` owner) was registered, so
 * custom providers warn when their API-owner plugin is missing but stay quiet
 * once that plugin loads.
 */
function collectUnregisteredConfiguredMemoryEmbeddingProviders(params) {
  const configured = collectConfiguredMemoryEmbeddingStartupProviderOwners(params.config);
  if (configured.length === 0) return [];
  const registered = new Set(
    [...params.registeredProviderIds]
      .map((id) => normalizeOptionalLowercaseString(id))
      .filter((id) => Boolean(id)),
  );
  return configured
    .filter((provider) => ![...provider.ownerIds].some((ownerId) => registered.has(ownerId)))
    .map((provider) => ({
      configuredId: provider.configuredId,
      source: provider.source,
    }))
    .toSorted(
      (left, right) =>
        left.configuredId.localeCompare(right.configuredId) ||
        left.source.localeCompare(right.source),
    );
}
function collectRegisteredEmbeddingProviderIds(registry) {
  return new Set(
    [
      ...(registry.memoryEmbeddingProviders ?? []),
      ...(registry.embeddingProviders ?? []),
      ...listRegisteredEmbeddingProviders().map((entry) => ({ provider: entry.adapter })),
    ].map((entry) => entry.provider.id),
  );
}
function addPluginConfigEntryIds(target, plugins) {
  for (const [pluginId, entry] of Object.entries(plugins.entries))
    if (entry?.enabled !== false) target.add(pluginId);
}
function addConfiguredSlotPluginIds(target, params) {
  const memorySlot = resolveMemorySlotStartupPluginId({
    activationSourceConfig: params.activationSourceConfig,
    activationSourcePlugins: params.activationSourcePlugins,
    normalizePluginId: params.lookup.normalizePluginId,
  });
  if (memorySlot) target.add(memorySlot);
  const contextEngineSlot = resolveContextEngineSlotStartupPluginId({
    activationSourceConfig: params.activationSourceConfig,
    activationSourcePlugins: params.activationSourcePlugins,
    normalizePluginId: params.lookup.normalizePluginId,
  });
  if (contextEngineSlot) target.add(contextEngineSlot);
}
function collectConfiguredStartupChannelIds(params) {
  return sortUniquePluginIds([
    ...listPotentialEnabledChannelIds(params.config, params.env),
    ...listPotentialEnabledChannelIds(params.activationSourceConfig, params.env),
  ]);
}
function collectValidationHeartbeatTargetChannelIds(config) {
  const channelIds = [];
  const pushTarget = (target) => {
    if (typeof target !== "string") return;
    const normalized = normalizeOptionalLowercaseString(target);
    if (!normalized || normalized === "last" || normalized === "none") return;
    channelIds.push(normalized);
  };
  pushTarget(config.agents?.defaults?.heartbeat?.target);
  if (Array.isArray(config.agents?.list))
    for (const agent of config.agents.list) pushTarget(agent?.heartbeat?.target);
  return sortUniquePluginIds(channelIds);
}
function collectValidationChannelConfigIds(config) {
  const channels = isRecord(config.channels) ? config.channels : null;
  if (!channels) return [];
  return Object.keys(channels)
    .filter((channelId) => channelId !== "defaults" && channelId !== "modelByChannel")
    .map((channelId) => normalizeOptionalLowercaseString(channelId) ?? "")
    .filter(Boolean)
    .toSorted((left, right) => left.localeCompare(right));
}
function collectConfigValidationChannelIds(params) {
  return sortUniquePluginIds([
    ...collectValidationChannelConfigIds(params.config),
    ...collectConfiguredStartupChannelIds({
      config: params.config,
      activationSourceConfig: params.config,
      env: params.env,
    }),
    ...collectValidationHeartbeatTargetChannelIds(params.config),
  ]);
}
function collectConfiguredProviderIds(config) {
  const configuredWebSearchProviderIds = collectConfiguredWebSearchProviderIds(config);
  const configuredGenerationProviderIds = collectConfiguredGenerationProviderIds(config);
  const configuredVoiceProviderIds = collectConfiguredVoiceProviderIds(config);
  return sortUniquePluginIds([
    ...collectConfiguredSpeechProviderIds(config),
    ...configuredWebSearchProviderIds,
    ...configuredGenerationProviderIds.imageGenerationProviders,
    ...configuredGenerationProviderIds.videoGenerationProviders,
    ...configuredGenerationProviderIds.musicGenerationProviders,
    ...configuredVoiceProviderIds.speechProviders,
    ...configuredVoiceProviderIds.realtimeTranscriptionProviders,
    ...configuredVoiceProviderIds.realtimeVoiceProviders,
    ...collectConfiguredMemoryEmbeddingProviderIds(config),
  ]);
}
function collectValidationConfiguredProviderIds(config) {
  const providerIds = [];
  const pushProviderId = (value) => {
    if (typeof value !== "string") return;
    const normalized = normalizeOptionalLowercaseString(value);
    if (normalized) providerIds.push(normalized);
  };
  const profiles = config.auth?.profiles;
  if (profiles && typeof profiles === "object") {
    for (const profile of Object.values(profiles))
      if (isRecord(profile)) pushProviderId(profile.provider);
  }
  const providers = config.models?.providers;
  if (providers && typeof providers === "object")
    for (const providerId of Object.keys(providers)) pushProviderId(providerId);
  for (const ref of collectConfiguredModelRefs(config)) {
    const slashIndex = ref.value.indexOf("/");
    if (slashIndex > 0) pushProviderId(ref.value.slice(0, slashIndex));
  }
  pushProviderId(config.tools?.web?.search?.provider);
  pushProviderId(config.tools?.web?.fetch?.provider);
  return sortUniquePluginIds(providerIds);
}
function collectValidationConfiguredShorthandModelIds(config) {
  return sortUniquePluginIds(
    collectConfiguredModelRefs(config)
      .map((ref) => ref.value)
      .filter((ref) => !ref.includes("/"))
      .map((ref) => splitTrailingAuthProfile(ref).model.trim())
      .filter(Boolean),
  );
}
function addRequiredAgentHarnessPluginIds(target, params) {
  const requiredAgentHarnessRuntimes = new Set(
    collectConfiguredAgentHarnessRuntimes(params.activationSourceConfig, {
      includeImplicitRuntimePreferences: false,
    }),
  );
  if (requiredAgentHarnessRuntimes.size === 0) return;
  for (const plugin of params.index.plugins)
    if (
      canStartRequiredAgentHarnessPlugin({
        plugin,
        pluginsConfig: params.pluginsConfig,
        activationSource: params.activationSource,
        config: params.config,
        requiredAgentHarnessRuntimes,
        platform: params.platform,
      })
    )
      target.add(plugin.pluginId);
}
function resolveGatewayStartupMetadataPluginIds(params) {
  const lookup = createInstalledPluginIndexScopeLookup(params.index);
  const activationSourceConfig = params.activationSourceConfig ?? params.config;
  const pluginsConfig = normalizePluginsConfigForInstalledIndex(params.config.plugins, lookup);
  const activationSourcePlugins = normalizePluginsConfigForInstalledIndex(
    activationSourceConfig.plugins,
    lookup,
  );
  if (!pluginsConfig.enabled || !activationSourcePlugins.enabled) return [];
  if (
    params.config.plugins?.bundledDiscovery === "compat" ||
    activationSourceConfig.plugins?.bundledDiscovery === "compat"
  )
    return;
  if (pluginsConfig.allow.length === 0 && activationSourcePlugins.allow.length === 0) return;
  const scope = /* @__PURE__ */ new Set([...pluginsConfig.allow, ...activationSourcePlugins.allow]);
  addPluginConfigEntryIds(scope, pluginsConfig);
  addPluginConfigEntryIds(scope, activationSourcePlugins);
  const memorySlotStartupPluginId = resolveMemorySlotStartupPluginId({
    activationSourceConfig,
    activationSourcePlugins,
    normalizePluginId: lookup.normalizePluginId,
  });
  addConfiguredSlotPluginIds(scope, {
    activationSourceConfig,
    activationSourcePlugins,
    lookup,
  });
  for (const pluginId of resolveAuthorizedGatewayStartupDreamingPluginIds({
    config: params.config,
    pluginsConfig,
    activationSource: {
      plugins: activationSourcePlugins,
      rootConfig: activationSourceConfig,
    },
    activationSourcePlugins,
    selectedMemoryPluginId: memorySlotStartupPluginId,
    index: params.index,
    platform: params.platform,
  }))
    scope.add(pluginId);
  if (!lookup.hasCompleteConfigPathActivationMetadata()) return;
  addConfiguredActivationPathPluginIds(scope, {
    activationSourceConfig,
    index: params.index,
  });
  const configuredChannelIds = collectConfiguredStartupChannelIds({
    config: params.config,
    activationSourceConfig,
    env: params.env,
  });
  if (!lookup.hasDirectChannelOwners(configuredChannelIds)) return;
  lookup.addDirectChannelOwners(scope, configuredChannelIds);
  const configuredProviderIds = sortUniquePluginIds([
    ...collectConfiguredProviderIds(params.config),
    ...collectConfiguredProviderIds(activationSourceConfig),
    ...collectValidationConfiguredProviderIds(params.config),
    ...collectValidationConfiguredProviderIds(activationSourceConfig),
  ]);
  if (!lookup.canResolveDirectProviderIds(configuredProviderIds, scope)) return;
  lookup.addDirectProviderOwners(scope, configuredProviderIds);
  const workerProviderIds = normalizeWorkerProviderIds([
    ...collectConfiguredWorkerProviderIds(params.config),
    ...collectConfiguredWorkerProviderIds(activationSourceConfig),
    ...(params.workerProviderIds ?? []),
  ]);
  if (!lookup.hasProviderContributionOwners(workerProviderIds)) return;
  lookup.addProviderContributionOwners(scope, workerProviderIds);
  const configuredShorthandModelIds = sortUniquePluginIds([
    ...collectValidationConfiguredShorthandModelIds(params.config),
    ...collectValidationConfiguredShorthandModelIds(activationSourceConfig),
  ]);
  if (!lookup.hasShorthandModelOwners(configuredShorthandModelIds)) return;
  lookup.addShorthandModelOwners(scope, configuredShorthandModelIds);
  addRequiredAgentHarnessPluginIds(scope, {
    activationSourceConfig,
    config: params.config,
    index: params.index,
    pluginsConfig,
    activationSource: {
      plugins: activationSourcePlugins,
      rootConfig: activationSourceConfig,
    },
    env: params.env,
    platform: params.platform,
  });
  const deniedPluginIds = /* @__PURE__ */ new Set([
    ...pluginsConfig.deny,
    ...activationSourcePlugins.deny,
  ]);
  for (const pluginId of deniedPluginIds) scope.delete(pluginId);
  for (const [pluginId, entry] of Object.entries(pluginsConfig.entries))
    if (entry?.enabled === false) scope.delete(pluginId);
  for (const [pluginId, entry] of Object.entries(activationSourcePlugins.entries))
    if (entry?.enabled === false) scope.delete(pluginId);
  if (!lookup.hasInstalledPluginIds(scope)) return;
  return sortUniquePluginIds(scope);
}
function createGatewayStartupMetadataPluginIdScope(params) {
  const configuredChannelIds = collectConfiguredStartupChannelIds({
    config: params.config,
    activationSourceConfig: params.activationSourceConfig ?? params.config,
    env: params.env,
  });
  const workerProviderIds = normalizeWorkerProviderIds(params.workerProviderIds ?? []);
  return {
    key: hashJson({
      kind: "gateway-startup",
      config: params.config,
      activationSourceConfig: params.activationSourceConfig ?? null,
      configuredChannelIds,
      workerProviderIds,
      platform: params.platform ?? null,
    }),
    resolve: ({ index }) =>
      resolveGatewayStartupMetadataPluginIds({
        config: params.config,
        ...(params.activationSourceConfig !== void 0
          ? { activationSourceConfig: params.activationSourceConfig }
          : {}),
        env: params.env,
        index,
        ...(workerProviderIds.length > 0 ? { workerProviderIds } : {}),
        ...(params.platform !== void 0 ? { platform: params.platform } : {}),
      }),
  };
}
function addValidationPluginConfigReferences(target, params) {
  for (const pluginId of params.pluginsConfig.allow) target.add(pluginId);
  for (const pluginId of params.pluginsConfig.deny) target.add(pluginId);
  for (const pluginId of Object.keys(params.pluginsConfig.entries)) target.add(pluginId);
  const rawSlots = isRecord(params.config.plugins?.slots) ? params.config.plugins.slots : {};
  const memorySlot = Object.hasOwn(rawSlots, "memory") ? params.pluginsConfig.slots.memory : void 0;
  if (typeof memorySlot === "string") target.add(params.normalizePluginId(memorySlot));
  const contextEngineSlot = Object.hasOwn(rawSlots, "contextEngine")
    ? params.pluginsConfig.slots.contextEngine
    : void 0;
  if (typeof contextEngineSlot === "string" && contextEngineSlot !== "legacy")
    target.add(params.normalizePluginId(contextEngineSlot));
}
function resolveConfigValidationMetadataPluginIds(params) {
  const lookup = createInstalledPluginIndexScopeLookup(params.index);
  const pluginsConfig = normalizePluginsConfigForInstalledIndex(params.config.plugins, lookup);
  if (params.config.plugins?.bundledDiscovery === "compat" || pluginsConfig.loadPaths.length > 0)
    return;
  const scope = /* @__PURE__ */ new Set();
  addValidationPluginConfigReferences(scope, {
    config: params.config,
    pluginsConfig,
    normalizePluginId: lookup.normalizePluginId,
  });
  if (!lookup.hasCompleteConfigPathActivationMetadata()) return;
  addConfiguredActivationPathPluginIds(scope, {
    activationSourceConfig: params.config,
    index: params.index,
  });
  const configuredChannelIds = collectConfigValidationChannelIds({
    config: params.config,
    env: params.env,
  });
  if (!lookup.hasChannelContributionOwners(configuredChannelIds)) return;
  lookup.addChannelContributionOwners(scope, configuredChannelIds);
  const configuredProviderIds = collectValidationConfiguredProviderIds(params.config);
  if (!lookup.hasProviderContributionOwners(configuredProviderIds)) return;
  lookup.addProviderContributionOwners(scope, configuredProviderIds);
  const configuredShorthandModelIds = collectValidationConfiguredShorthandModelIds(params.config);
  if (!lookup.hasShorthandModelOwners(configuredShorthandModelIds)) return;
  lookup.addShorthandModelOwners(scope, configuredShorthandModelIds);
  addRequiredAgentHarnessPluginIds(scope, {
    activationSourceConfig: params.config,
    config: params.config,
    index: params.index,
    pluginsConfig,
    activationSource: {
      plugins: pluginsConfig,
      rootConfig: params.config,
    },
    env: params.env,
    platform: params.platform,
  });
  if (!lookup.hasInstalledPluginIds(scope)) return;
  return sortUniquePluginIds(scope);
}
function createConfigValidationMetadataPluginIdScope(params) {
  const configuredChannelIds = collectConfigValidationChannelIds({
    config: params.config,
    env: params.env,
  });
  const configuredProviderIds = collectValidationConfiguredProviderIds(params.config);
  const configuredShorthandModelIds = collectValidationConfiguredShorthandModelIds(params.config);
  return {
    key: hashJson({
      kind: "config-validation",
      config: params.config,
      configuredChannelIds,
      configuredProviderIds,
      configuredShorthandModelIds,
      platform: params.platform ?? null,
    }),
    resolve: ({ index }) =>
      resolveConfigValidationMetadataPluginIds({
        config: params.config,
        env: params.env,
        index,
        ...(params.platform !== void 0 ? { platform: params.platform } : {}),
      }),
  };
}
function isMetadataSnapshotScopedForGatewayStartup(params) {
  const expectedPluginIds = normalizePluginIdScope(
    params.pluginIdScope.resolve({ index: params.metadataSnapshot.index }),
  );
  const snapshotPluginIds = normalizePluginIdScope(params.metadataSnapshot.pluginIds);
  if (expectedPluginIds === void 0 || snapshotPluginIds === void 0)
    return expectedPluginIds === void 0 && snapshotPluginIds === void 0;
  if (expectedPluginIds.length === 0) return snapshotPluginIds.length === 0;
  const snapshotPluginIdSet = new Set(snapshotPluginIds);
  return expectedPluginIds.every((pluginId) => snapshotPluginIdSet.has(pluginId));
}
function manifestOwnsConfiguredGenerationProvider(params) {
  for (const contractKey of [
    "imageGenerationProviders",
    "videoGenerationProviders",
    "musicGenerationProviders",
  ]) {
    const configuredProviderIds = params.configuredGenerationProviderIds[contractKey];
    if (configuredProviderIds.size === 0) continue;
    if (
      (params.manifest?.contracts?.[contractKey] ?? []).some((providerId) => {
        const normalized = normalizeOptionalLowercaseString(providerId);
        return normalized ? configuredProviderIds.has(normalized) : false;
      })
    )
      return true;
  }
  return false;
}
function manifestOwnsConfiguredVoiceProvider(params) {
  for (const contractKey of [
    "speechProviders",
    "realtimeTranscriptionProviders",
    "realtimeVoiceProviders",
  ]) {
    const configuredProviderIds = params.configuredVoiceProviderIds[contractKey];
    if (configuredProviderIds.size === 0) continue;
    if (
      (params.manifest?.contracts?.[contractKey] ?? []).some((providerId) => {
        const normalized = normalizeOptionalLowercaseString(providerId);
        return normalized ? configuredProviderIds.has(normalized) : false;
      })
    )
      return true;
  }
  return false;
}
function manifestOwnsConfiguredMemoryEmbeddingProvider(params) {
  if (params.configuredMemoryEmbeddingProviderIds.size === 0) return false;
  return [
    ...(params.manifest?.contracts?.memoryEmbeddingProviders ?? []),
    ...(params.manifest?.contracts?.embeddingProviders ?? []),
  ].some((providerId) => {
    const normalized = normalizeOptionalLowercaseString(providerId);
    return normalized ? params.configuredMemoryEmbeddingProviderIds.has(normalized) : false;
  });
}
function canStartConfiguredProvider(params) {
  if (
    !params.pluginsConfig.enabled ||
    !params.activationSource.plugins.enabled ||
    blocksPluginStartup({
      pluginId: params.plugin.pluginId,
      pluginsConfig: params.pluginsConfig,
      activationSourcePlugins: params.activationSource.plugins,
    })
  )
    return false;
  const activationState = resolveEffectivePluginActivationState({
    id: params.plugin.pluginId,
    origin: params.plugin.origin,
    config: params.pluginsConfig,
    rootConfig: params.config,
    enabledByDefault: isPluginEnabledByDefaultForPlatform(params.plugin, params.platform),
    activationSource: params.activationSource,
    ...(params.autoEnabledReason ? { autoEnabledReason: params.autoEnabledReason } : {}),
  });
  return (
    activationState.enabled &&
    (params.allowImplicitExternal ||
      params.plugin.origin === "bundled" ||
      activationState.explicitlyEnabled)
  );
}
function canStartConfiguredGenerationProviderPlugin(params) {
  if (
    !manifestOwnsConfiguredGenerationProvider({
      manifest: params.manifest,
      configuredGenerationProviderIds: params.configuredGenerationProviderIds,
    })
  )
    return false;
  return canStartConfiguredProvider(params);
}
function canStartConfiguredVoiceProviderPlugin(params) {
  if (
    !manifestOwnsConfiguredVoiceProvider({
      manifest: params.manifest,
      configuredVoiceProviderIds: params.configuredVoiceProviderIds,
    })
  )
    return false;
  return canStartConfiguredProvider(params);
}
function canStartConfiguredMemoryEmbeddingProviderPlugin(params) {
  if (
    !manifestOwnsConfiguredMemoryEmbeddingProvider({
      manifest: params.manifest,
      configuredMemoryEmbeddingProviderIds: params.configuredMemoryEmbeddingProviderIds,
    })
  )
    return false;
  return canStartConfiguredProvider({
    ...params,
    allowImplicitExternal: true,
  });
}
function canStartConfiguredWorkerProviderPlugin(params) {
  if (!manifestOwnsWorkerProvider(params.manifest, params.configuredWorkerProviderIds))
    return false;
  return canStartConfiguredProvider({
    ...params,
    autoEnabledReason: "cloud worker provider required",
  });
}
function canStartConfiguredModelProviderPlugin(params) {
  if (
    !manifestOwnsConfiguredModelProvider({
      manifest: params.manifest,
      configuredModelProviderIds: params.configuredModelProviderIds,
    })
  )
    return false;
  return canStartConfiguredProvider(params);
}
function canStartRequiredAgentHarnessPlugin(params) {
  if (
    !params.plugin.startup.agentHarnesses.some((runtime) =>
      params.requiredAgentHarnessRuntimes.has(runtime),
    )
  )
    return false;
  if (!params.pluginsConfig.enabled || !params.activationSource.plugins.enabled) return false;
  if (
    params.pluginsConfig.deny.includes(params.plugin.pluginId) ||
    params.activationSource.plugins.deny.includes(params.plugin.pluginId)
  )
    return false;
  if (
    params.pluginsConfig.entries[params.plugin.pluginId]?.enabled === false ||
    params.activationSource.plugins.entries[params.plugin.pluginId]?.enabled === false
  )
    return false;
  if (
    params.pluginsConfig.allow.length > 0 &&
    !params.pluginsConfig.allow.includes(params.plugin.pluginId)
  )
    return false;
  if (
    params.activationSource.plugins.allow.length > 0 &&
    !params.activationSource.plugins.allow.includes(params.plugin.pluginId)
  )
    return false;
  return (
    resolveEffectivePluginActivationState({
      id: params.plugin.pluginId,
      origin: params.plugin.origin,
      config: params.pluginsConfig,
      rootConfig: params.config,
      enabledByDefault: isPluginEnabledByDefaultForPlatform(params.plugin, params.platform),
      activationSource: params.activationSource,
    }).enabled || params.plugin.origin === "bundled"
  );
}
function canStartConfiguredSpeechProviderPlugin(params) {
  if (
    !manifestOwnsConfiguredSpeechProvider({
      manifest: params.manifest,
      configuredSpeechProviderIds: params.configuredSpeechProviderIds,
    })
  )
    return false;
  if (
    params.pluginsConfig.deny.includes(params.plugin.pluginId) ||
    params.activationSource.plugins.deny.includes(params.plugin.pluginId)
  )
    return false;
  if (
    params.pluginsConfig.entries[params.plugin.pluginId]?.enabled === false ||
    params.activationSource.plugins.entries[params.plugin.pluginId]?.enabled === false
  )
    return false;
  if (params.plugin.origin === "bundled") return true;
  const activationState = resolveEffectivePluginActivationState({
    id: params.plugin.pluginId,
    origin: params.plugin.origin,
    config: params.pluginsConfig,
    rootConfig: params.config,
    enabledByDefault: isPluginEnabledByDefaultForPlatform(params.plugin, params.platform),
    activationSource: params.activationSource,
  });
  return activationState.enabled && activationState.explicitlyEnabled;
}
function canStartConfiguredWebSearchProviderPlugin(params) {
  if (
    !manifestOwnsConfiguredWebSearchProvider({
      manifest: params.manifest,
      configuredWebSearchProviderIds: params.configuredWebSearchProviderIds,
    })
  )
    return false;
  return canStartConfiguredProvider({
    ...params,
    allowImplicitExternal: true,
  });
}
function canStartConfiguredRootPlugin(params) {
  if (
    !hasConfiguredActivationPath({
      manifest: params.manifest,
      config: params.activationSource.rootConfig ?? params.config,
    })
  )
    return false;
  if (!params.pluginsConfig.enabled || !params.activationSource.plugins.enabled) return false;
  if (
    params.pluginsConfig.deny.includes(params.plugin.pluginId) ||
    params.activationSource.plugins.deny.includes(params.plugin.pluginId)
  )
    return false;
  if (
    params.pluginsConfig.entries[params.plugin.pluginId]?.enabled === false ||
    params.activationSource.plugins.entries[params.plugin.pluginId]?.enabled === false
  )
    return false;
  if (params.plugin.origin === "bundled") return true;
  if (
    params.activationSource.plugins.allow.length > 0 &&
    !params.activationSource.plugins.allow.includes(params.plugin.pluginId)
  )
    return false;
  const activationState = resolveEffectivePluginActivationState({
    id: params.plugin.pluginId,
    origin: params.plugin.origin,
    config: params.pluginsConfig,
    rootConfig: params.config,
    enabledByDefault: isPluginEnabledByDefaultForPlatform(params.plugin, params.platform),
    activationSource: params.activationSource,
  });
  return activationState.enabled && activationState.explicitlyEnabled;
}
function hasExplicitHookPolicyConfig(entry) {
  return (
    entry?.hooks?.allowConversationAccess === true ||
    entry?.hooks?.allowPromptInjection === true ||
    entry?.hooks?.timeoutMs !== void 0 ||
    (entry?.hooks?.timeouts !== void 0 && Object.keys(entry.hooks.timeouts).length > 0)
  );
}
function hasHookRuntimeStartupIntent(params) {
  if (params.manifest?.activation?.onCapabilities?.includes("hook")) return true;
  return hasExplicitHookPolicyConfig(
    params.activationSourcePlugins.entries[params.plugin.pluginId],
  );
}
function canStartExplicitHookPlugin(params) {
  const hasHookPolicyIntent = hasExplicitHookPolicyConfig(
    params.activationSourcePlugins.entries[params.plugin.pluginId],
  );
  if (
    !hasHookRuntimeStartupIntent({
      plugin: params.plugin,
      manifest: params.manifest,
      activationSourcePlugins: params.activationSourcePlugins,
    })
  )
    return false;
  if (!params.pluginsConfig.enabled || !params.activationSourcePlugins.enabled) return false;
  if (
    params.pluginsConfig.deny.includes(params.plugin.pluginId) ||
    params.activationSourcePlugins.deny.includes(params.plugin.pluginId)
  )
    return false;
  if (
    params.pluginsConfig.entries[params.plugin.pluginId]?.enabled === false ||
    params.activationSourcePlugins.entries[params.plugin.pluginId]?.enabled === false
  )
    return false;
  const activationState = resolveEffectivePluginActivationState({
    id: params.plugin.pluginId,
    origin: params.plugin.origin,
    config: params.pluginsConfig,
    rootConfig: params.config,
    enabledByDefault: isPluginEnabledByDefaultForPlatform(params.plugin, params.platform),
    activationSource: params.activationSource,
  });
  return activationState.enabled && (activationState.explicitlyEnabled || hasHookPolicyIntent);
}
function canStartTrustedToolPolicyPlugin(params) {
  if ((params.manifest?.contracts?.trustedToolPolicies?.length ?? 0) === 0) return false;
  if (!params.pluginsConfig.enabled || !params.activationSource.plugins.enabled) return false;
  if (
    params.pluginsConfig.deny.includes(params.plugin.pluginId) ||
    params.activationSource.plugins.deny.includes(params.plugin.pluginId)
  )
    return false;
  if (
    params.pluginsConfig.entries[params.plugin.pluginId]?.enabled === false ||
    params.activationSource.plugins.entries[params.plugin.pluginId]?.enabled === false
  )
    return false;
  const activationState = resolveEffectivePluginActivationState({
    id: params.plugin.pluginId,
    origin: params.plugin.origin,
    config: params.pluginsConfig,
    rootConfig: params.config,
    enabledByDefault: isPluginEnabledByDefaultForPlatform(params.plugin, params.platform),
    activationSource: params.activationSource,
  });
  return (
    activationState.enabled &&
    (params.plugin.origin === "bundled" || activationState.explicitlyEnabled)
  );
}
function canStartConfiguredChannelPlugin(params) {
  if (!params.pluginsConfig.enabled) return false;
  if (params.pluginsConfig.deny.includes(params.plugin.pluginId)) return false;
  if (params.pluginsConfig.entries[params.plugin.pluginId]?.enabled === false) return false;
  const explicitBundledChannelConfig =
    params.plugin.origin === "bundled" &&
    listManifestChannelIds(params.manifestLookup, params.plugin.pluginId).some((channelId) =>
      hasExplicitChannelConfig({
        config: params.activationSource.rootConfig ?? params.config,
        channelId,
      }),
    );
  if (
    params.pluginsConfig.allow.length > 0 &&
    !params.pluginsConfig.allow.includes(params.plugin.pluginId) &&
    !explicitBundledChannelConfig
  )
    return false;
  if (params.plugin.origin === "bundled") return true;
  const activationState = resolveEffectivePluginActivationState({
    id: params.plugin.pluginId,
    origin: params.plugin.origin,
    config: params.pluginsConfig,
    rootConfig: params.config,
    enabledByDefault: isPluginEnabledByDefaultForPlatform(params.plugin, params.platform),
    activationSource: params.activationSource,
  });
  return activationState.enabled && activationState.explicitlyEnabled;
}
function resolveChannelPluginIds(params) {
  return [...loadGatewayStartupPluginPlan(params).channelPluginIds];
}
function resolveChannelPluginIdsFromRegistry(params) {
  const { manifestRegistry } = params;
  return manifestRegistry.plugins
    .filter((plugin) => plugin.channels.length > 0)
    .map((plugin) => plugin.id);
}
function resolveConfiguredDeferredChannelPluginIdsFromRegistry(params) {
  const configuredChannelIds = new Set(listPotentialEnabledChannelIds(params.config, params.env));
  if (configuredChannelIds.size === 0) return [];
  const pluginsConfig = normalizePluginsConfigWithRegistry(params.config.plugins, params.index, {
    manifestRegistry: params.manifestRegistry,
  });
  const activationSource = {
    plugins: pluginsConfig,
    rootConfig: params.config,
  };
  const manifestLookup = createManifestRegistryLookup(params.manifestRegistry);
  return resolveConfiguredDeferredChannelPluginIdsFromPrepared({
    config: params.config,
    index: params.index,
    configuredChannelIds,
    pluginsConfig,
    activationSource,
    manifestLookup,
  });
}
function resolveConfiguredDeferredChannelPluginIdsFromPrepared(params) {
  if (params.configuredChannelIds.size === 0) return [];
  return params.index.plugins
    .filter(
      (plugin) =>
        hasConfiguredStartupChannel({
          plugin,
          manifestLookup: params.manifestLookup,
          configuredChannelIds: params.configuredChannelIds,
        }) &&
        plugin.startup.deferConfiguredChannelFullLoadUntilAfterListen &&
        canStartConfiguredChannelPlugin({
          plugin,
          config: params.config,
          pluginsConfig: params.pluginsConfig,
          activationSource: params.activationSource,
          manifestLookup: params.manifestLookup,
          platform: params.platform,
        }),
    )
    .map((plugin) => plugin.pluginId);
}
function resolveConfiguredDeferredChannelPluginIds(params) {
  return [...loadGatewayStartupPluginPlan(params).configuredDeferredChannelPluginIds];
}
function resolveGatewayStartupPluginPlanFromRegistry(params) {
  const channelPluginIds = resolveChannelPluginIdsFromRegistry({
    manifestRegistry: params.manifestRegistry,
  });
  const configuredChannelIds = new Set(listPotentialEnabledChannelIds(params.config, params.env));
  const pluginsConfig = normalizePluginsConfigWithRegistry(params.config.plugins, params.index, {
    manifestRegistry: params.manifestRegistry,
  });
  const activationSourceConfig = params.activationSourceConfig ?? params.config;
  const activationSourcePlugins = normalizePluginsConfigWithRegistry(
    activationSourceConfig.plugins,
    params.index,
    { manifestRegistry: params.manifestRegistry },
  );
  const activationSource = {
    plugins: activationSourcePlugins,
    rootConfig: activationSourceConfig,
  };
  const manifestLookup = createManifestRegistryLookup(params.manifestRegistry);
  const explicitlyDisabledChannelIds = new Set(
    listExplicitlyDisabledChannelIdsForConfig(params.config),
  );
  const configuredDeferredChannelPluginIds = [];
  const requiredAgentHarnessRuntimes = new Set(
    collectConfiguredAgentHarnessRuntimes(activationSourceConfig),
  );
  const configuredSpeechProviderIds = collectConfiguredSpeechProviderIds(activationSourceConfig);
  const configuredWebSearchProviderIds =
    collectConfiguredWebSearchProviderIds(activationSourceConfig);
  const configuredModelProviderIds = collectConfiguredAgentModelProviderIds(
    activationSourceConfig,
    params.manifestRegistry,
  );
  const configuredGenerationProviderIds =
    collectConfiguredGenerationProviderIds(activationSourceConfig);
  const configuredVoiceProviderIds = collectConfiguredVoiceProviderIds(activationSourceConfig);
  const configuredMemoryEmbeddingProviderIds =
    collectConfiguredMemoryEmbeddingProviderIds(activationSourceConfig);
  const configuredWorkerProviderIds = /* @__PURE__ */ new Set([
    ...collectConfiguredWorkerProviderIds(activationSourceConfig),
    ...normalizeWorkerProviderIds(params.workerProviderIds ?? []),
  ]);
  const normalizePluginId = createPluginRegistryIdNormalizer(params.index, {
    manifestRegistry: params.manifestRegistry,
  });
  const memorySlotStartupPluginId = resolveMemorySlotStartupPluginId({
    activationSourceConfig,
    activationSourcePlugins,
    normalizePluginId,
  });
  const startupDreamingPluginIds = resolveAuthorizedGatewayStartupDreamingPluginIds({
    config: params.config,
    pluginsConfig,
    activationSource,
    activationSourcePlugins,
    selectedMemoryPluginId: memorySlotStartupPluginId,
    index: params.index,
    platform: params.platform,
  });
  const contextEngineSlotStartupPluginId = resolveContextEngineSlotStartupPluginId({
    activationSourceConfig,
    activationSourcePlugins,
    normalizePluginId,
  });
  const pluginIds = [];
  for (const plugin of params.index.plugins) {
    const manifest = findManifestPlugin(manifestLookup, plugin.pluginId);
    const hasEnabledManifestChannel =
      manifest?.channels?.some((channelId) => {
        const normalizedChannelId = normalizeOptionalLowercaseString(channelId);
        return normalizedChannelId ? !explicitlyDisabledChannelIds.has(normalizedChannelId) : false;
      }) ?? false;
    const hasExplicitlyEnabledNonBundledChannel =
      plugin.origin !== "bundled" &&
      hasEnabledManifestChannel &&
      pluginsConfig.entries[plugin.pluginId]?.enabled === true &&
      !pluginsConfig.deny.includes(plugin.pluginId);
    if (
      hasConfiguredStartupChannel({
        plugin,
        manifestLookup,
        configuredChannelIds,
      }) ||
      hasExplicitlyEnabledNonBundledChannel
    ) {
      if (
        canStartConfiguredChannelPlugin({
          plugin,
          config: params.config,
          pluginsConfig,
          activationSource,
          manifestLookup,
          platform: params.platform,
        })
      ) {
        pluginIds.push(plugin.pluginId);
        if (plugin.startup.deferConfiguredChannelFullLoadUntilAfterListen)
          configuredDeferredChannelPluginIds.push(plugin.pluginId);
      }
      continue;
    }
    if (
      canStartRequiredAgentHarnessPlugin({
        plugin,
        pluginsConfig,
        activationSource,
        config: params.config,
        requiredAgentHarnessRuntimes,
        platform: params.platform,
      })
    ) {
      pluginIds.push(plugin.pluginId);
      continue;
    }
    if (
      canStartConfiguredRootPlugin({
        plugin,
        manifest,
        config: params.config,
        pluginsConfig,
        activationSource,
        platform: params.platform,
      })
    ) {
      pluginIds.push(plugin.pluginId);
      continue;
    }
    if (
      canStartConfiguredWorkerProviderPlugin({
        plugin,
        manifest,
        config: params.config,
        pluginsConfig,
        activationSource,
        configuredWorkerProviderIds,
        platform: params.platform,
      })
    ) {
      pluginIds.push(plugin.pluginId);
      continue;
    }
    if (
      canStartConfiguredSpeechProviderPlugin({
        plugin,
        manifest,
        config: params.config,
        pluginsConfig,
        activationSource,
        configuredSpeechProviderIds,
        platform: params.platform,
      })
    ) {
      pluginIds.push(plugin.pluginId);
      continue;
    }
    if (
      canStartConfiguredWebSearchProviderPlugin({
        plugin,
        manifest,
        config: params.config,
        pluginsConfig,
        activationSource,
        configuredWebSearchProviderIds,
        platform: params.platform,
      })
    ) {
      pluginIds.push(plugin.pluginId);
      continue;
    }
    if (
      canStartConfiguredModelProviderPlugin({
        plugin,
        manifest,
        config: params.config,
        pluginsConfig,
        activationSource,
        configuredModelProviderIds,
        platform: params.platform,
      })
    ) {
      pluginIds.push(plugin.pluginId);
      continue;
    }
    if (
      canStartConfiguredGenerationProviderPlugin({
        plugin,
        manifest,
        config: params.config,
        pluginsConfig,
        activationSource,
        configuredGenerationProviderIds,
        platform: params.platform,
      })
    ) {
      pluginIds.push(plugin.pluginId);
      continue;
    }
    if (
      canStartConfiguredVoiceProviderPlugin({
        plugin,
        manifest,
        config: params.config,
        pluginsConfig,
        activationSource,
        configuredVoiceProviderIds,
        platform: params.platform,
      })
    ) {
      pluginIds.push(plugin.pluginId);
      continue;
    }
    if (
      canStartConfiguredMemoryEmbeddingProviderPlugin({
        plugin,
        manifest,
        config: params.config,
        pluginsConfig,
        activationSource,
        configuredMemoryEmbeddingProviderIds,
        platform: params.platform,
      })
    ) {
      pluginIds.push(plugin.pluginId);
      continue;
    }
    if (
      canStartExplicitHookPlugin({
        plugin,
        manifest,
        config: params.config,
        pluginsConfig,
        activationSource,
        activationSourcePlugins,
        platform: params.platform,
      })
    ) {
      pluginIds.push(plugin.pluginId);
      continue;
    }
    if (
      canStartTrustedToolPolicyPlugin({
        plugin,
        manifest,
        config: params.config,
        pluginsConfig,
        activationSource,
        platform: params.platform,
      })
    ) {
      pluginIds.push(plugin.pluginId);
      continue;
    }
    if (
      !shouldConsiderForGatewayStartup({
        plugin,
        manifest,
        startupDreamingPluginIds,
        memorySlotStartupPluginId,
        contextEngineSlotStartupPluginId,
      })
    )
      continue;
    if (startupDreamingPluginIds.has(plugin.pluginId)) {
      pluginIds.push(plugin.pluginId);
      continue;
    }
    const activationState = resolveEffectivePluginActivationState({
      id: plugin.pluginId,
      origin: plugin.origin,
      config: pluginsConfig,
      rootConfig: params.config,
      enabledByDefault: isPluginEnabledByDefaultForPlatform(plugin, params.platform),
      activationSource,
    });
    if (!activationState.enabled) continue;
    if (
      plugin.origin !== "bundled"
        ? activationState.explicitlyEnabled
        : activationState.source === "explicit" || activationState.source === "default"
    )
      pluginIds.push(plugin.pluginId);
  }
  return {
    channelPluginIds,
    configuredDeferredChannelPluginIds,
    pluginIds,
  };
}
function resolveGatewayStartupPluginIdsFromRegistry(params) {
  return [...resolveGatewayStartupPluginPlanFromRegistry(params).pluginIds];
}
function loadGatewayStartupPluginPlan(params) {
  const snapshotConfig = params.activationSourceConfig ?? params.config;
  const pluginIdScope = createGatewayStartupMetadataPluginIdScope({
    config: params.config,
    ...(params.activationSourceConfig !== void 0
      ? { activationSourceConfig: params.activationSourceConfig }
      : {}),
    env: params.env,
    workerProviderIds: params.workerProviderIds ?? [],
    ...(params.platform !== void 0 ? { platform: params.platform } : {}),
  });
  const metadataSnapshot =
    params.metadataSnapshot &&
    isPluginMetadataSnapshotCompatible({
      snapshot: params.metadataSnapshot,
      config: snapshotConfig,
      env: params.env,
      allowScopedSnapshot: true,
      workspaceDir: params.workspaceDir,
      index: params.index,
    }) &&
    isMetadataSnapshotScopedForGatewayStartup({
      metadataSnapshot: params.metadataSnapshot,
      pluginIdScope,
    })
      ? params.metadataSnapshot
      : resolvePluginMetadataSnapshot({
          config: snapshotConfig,
          workspaceDir: params.workspaceDir,
          env: params.env,
          allowWorkspaceScopedCurrent: params.workspaceDir === void 0,
          ...(params.index ? { index: params.index } : {}),
          pluginIdScope,
        });
  return resolveGatewayStartupPluginPlanFromRegistry({
    config: params.config,
    ...(params.activationSourceConfig !== void 0
      ? { activationSourceConfig: params.activationSourceConfig }
      : {}),
    env: params.env,
    index: metadataSnapshot.index,
    manifestRegistry: metadataSnapshot.manifestRegistry,
    workerProviderIds: params.workerProviderIds ?? [],
    platform: params.platform,
  });
}
function resolveGatewayStartupPluginIds(params) {
  return [...loadGatewayStartupPluginPlan(params).pluginIds];
}
//#endregion
export {
  restoreRegisteredEmbeddingProviders as C,
  registerEmbeddingProvider as S,
  resolveGatewayStartupPluginPlanFromRegistry as _,
  createConfigValidationMetadataPluginIdScope as a,
  getRegisteredEmbeddingProvider as b,
  loadGatewayStartupPluginPlan as c,
  resolveConfigValidationMetadataPluginIds as d,
  resolveConfiguredDeferredChannelPluginIds as f,
  resolveGatewayStartupPluginIdsFromRegistry as g,
  resolveGatewayStartupPluginIds as h,
  collectUnregisteredConfiguredMemoryEmbeddingProviders as i,
  resolveChannelPluginIds as l,
  resolveGatewayStartupMetadataPluginIds as m,
  collectConfiguredMemoryEmbeddingStartupProviderOwners as n,
  createGatewayStartupMetadataPluginIdScope as o,
  resolveConfiguredDeferredChannelPluginIdsFromRegistry as p,
  collectRegisteredEmbeddingProviderIds as r,
  isMetadataSnapshotScopedForGatewayStartup as s,
  collectConfiguredMemoryEmbeddingProviderIds as t,
  resolveChannelPluginIdsFromRegistry as u,
  resolveProviderConfigApiOwnerHint as v,
  listRegisteredEmbeddingProviders as x,
  clearEmbeddingProviders as y,
};
