import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import {
  a as normalizeEmbeddingModelWithPrefixes,
  l as sanitizeEmbeddingCacheHeaders,
  t as createRemoteEmbeddingProvider,
  w as buildRemoteBaseUrlPolicy,
} from "./memory-core-host-engine-embeddings-C-z4ELNB.js";
import {
  C as resolveLmstudioServerBase,
  D as LMSTUDIO_DEFAULT_EMBEDDING_MODEL,
  F as LMSTUDIO_PROVIDER_ID,
  _ as normalizeLmstudioConfiguredCatalogEntries,
  b as resolveLmstudioInferenceBase,
  i as buildLmstudioAuthHeaders,
  l as resolveLmstudioRuntimeApiKey,
  n as ensureLmstudioModelLoaded,
  o as resolveLmstudioConfiguredApiKeyForProvider,
  s as resolveLmstudioProviderHeaders,
} from "./models.fetch-BqO3XhrY.js";
import "./logging-core-QnL1iLWg.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { l as asPositiveSafeInteger } from "./number-coercion-CJQ8TR--.js";
import "./ssrf-runtime-DJ478vv8.js";
import { u as normalizeProviderId } from "./provider-model-shared-CYlCpWlu.js";
import { n as resolveMemorySecretInputString } from "./secret-input-BxM5UYg1.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region extensions/lmstudio/src/embedding-provider.ts
const log = createSubsystemLogger("memory/embeddings");
const DEFAULT_LMSTUDIO_EMBEDDING_MODEL = LMSTUDIO_DEFAULT_EMBEDDING_MODEL;
/** Normalizes LM Studio embedding model refs and accepts `lmstudio/` prefix. */
function normalizeLmstudioModel(model, providerId) {
  return normalizeEmbeddingModelWithPrefixes({
    model,
    defaultModel: DEFAULT_LMSTUDIO_EMBEDDING_MODEL,
    prefixes: [`${providerId?.trim() || "lmstudio"}/`, `${LMSTUDIO_PROVIDER_ID}/`],
  });
}
function hasAuthorizationHeader(headers) {
  if (!headers) return false;
  return Object.entries(headers).some(
    ([headerName, value]) =>
      headerName.trim().toLowerCase() === "authorization" && value.trim().length > 0,
  );
}
/** Resolves API key (real or synthetic placeholder) from runtime/provider auth config. */
async function resolveLmstudioApiKey(options, providerId) {
  const selectedProviderId = providerId?.trim();
  const selectedApiKey =
    selectedProviderId && selectedProviderId !== "lmstudio"
      ? options.config.models?.providers?.[selectedProviderId]?.apiKey
      : void 0;
  if (selectedProviderId && selectedProviderId !== "lmstudio")
    return selectedApiKey === void 0 || selectedApiKey === null
      ? void 0
      : await resolveLmstudioConfiguredApiKeyForProvider({
          providerId: selectedProviderId,
          config: options.config,
          env: process.env,
        });
  try {
    return await resolveLmstudioRuntimeApiKey({
      config: options.config,
      agentDir: options.agentDir,
    });
  } catch (error) {
    if (/LM Studio API key is required/i.test(formatErrorMessage(error))) return;
    throw error;
  }
}
function resolveEmbeddingPreloadContextLength(params) {
  const configuredModel = normalizeLmstudioConfiguredCatalogEntries(params.models).find(
    (entry) => normalizeLmstudioModel(entry.id) === params.model,
  );
  if (configuredModel?.contextTokens !== void 0) return configuredModel.contextTokens;
  const providerContextTokens = asPositiveSafeInteger(params.providerContextTokens);
  if (configuredModel?.contextWindow !== void 0 && providerContextTokens !== void 0)
    return Math.min(configuredModel.contextWindow, providerContextTokens);
  return (
    providerContextTokens ??
    configuredModel?.contextWindow ??
    asPositiveSafeInteger(params.providerContextWindow)
  );
}
function resolveConfiguredLmstudioProvider(options) {
  const providers = options.config.models?.providers;
  if (!providers) return;
  const providerId = options.provider?.trim() || "lmstudio";
  const direct = providers[providerId];
  if (direct)
    return {
      providerId,
      config: direct,
    };
  const normalized = normalizeProviderId(providerId);
  for (const [candidateId, candidate] of Object.entries(providers))
    if (normalizeProviderId(candidateId) === normalized)
      return {
        providerId: candidateId,
        config: candidate,
      };
  const fallback = providers[LMSTUDIO_PROVIDER_ID];
  return fallback
    ? {
        providerId: LMSTUDIO_PROVIDER_ID,
        config: fallback,
      }
    : void 0;
}
function resolveLmstudioLocalServiceBaseUrl(configuredBaseUrl, inferenceBaseUrl) {
  const configured = configuredBaseUrl?.trim();
  if (!configured) return inferenceBaseUrl;
  const configuredPath = configured.replace(/[?#].*$/u, "").replace(/\/+$/u, "");
  const serverBaseUrl = resolveLmstudioServerBase(configured);
  return /\/api\/v1$/iu.test(configuredPath) ? `${serverBaseUrl}/api/v1` : `${serverBaseUrl}/v1`;
}
/** Creates the LM Studio embedding provider client and preloads the target model before return. */
async function createLmstudioEmbeddingProvider(options) {
  const resolvedProvider = resolveConfiguredLmstudioProvider(options);
  const providerConfig = resolvedProvider?.config;
  const providerBaseUrl = providerConfig?.baseUrl?.trim();
  const isFallbackActivation = options.fallback === "lmstudio" && options.provider !== "lmstudio";
  const remoteBaseUrl = options.remote?.baseUrl?.trim();
  const remoteApiKey = !isFallbackActivation
    ? resolveMemorySecretInputString({
        value: options.remote?.apiKey,
        path: "agents.*.memorySearch.remote.apiKey",
      })
    : void 0;
  const baseUrlSource = !isFallbackActivation ? remoteBaseUrl : void 0;
  const baseUrl = resolveLmstudioInferenceBase(
    baseUrlSource && baseUrlSource.length > 0
      ? baseUrlSource
      : providerBaseUrl && providerBaseUrl.length > 0
        ? providerBaseUrl
        : void 0,
  );
  const model = normalizeLmstudioModel(options.model, resolvedProvider?.providerId);
  const providerHeaders = await resolveLmstudioProviderHeaders({
    config: options.config,
    env: process.env,
    headers: Object.assign(
      {},
      providerConfig?.headers,
      !isFallbackActivation ? options.remote?.headers : {},
    ),
  });
  const apiKey = hasAuthorizationHeader(providerHeaders)
    ? void 0
    : !isFallbackActivation
      ? remoteApiKey?.trim() || (await resolveLmstudioApiKey(options, resolvedProvider?.providerId))
      : await resolveLmstudioApiKey(options, resolvedProvider?.providerId);
  const headerOverrides = Object.assign({}, providerHeaders);
  const headers =
    buildLmstudioAuthHeaders({
      apiKey,
      json: true,
      headers: headerOverrides,
    }) ?? {};
  const ssrfPolicy = buildRemoteBaseUrlPolicy(baseUrl);
  const client = {
    baseUrl,
    model,
    headers,
    ssrfPolicy,
  };
  const requestedContextLength = resolveEmbeddingPreloadContextLength({
    model,
    models: providerConfig?.models,
    providerContextTokens: providerConfig?.contextTokens,
    providerContextWindow: providerConfig?.contextWindow,
  });
  const localServiceTarget =
    providerConfig?.localService && !baseUrlSource
      ? {
          providerId: resolvedProvider?.providerId ?? "lmstudio",
          baseUrl: resolveLmstudioLocalServiceBaseUrl(providerBaseUrl, baseUrl),
          headers,
        }
      : void 0;
  const acquireLocalService = options.acquireLocalService;
  const withLocalServiceLease = async (signal, action) => {
    const lease =
      localServiceTarget && acquireLocalService
        ? await acquireLocalService(localServiceTarget, signal)
        : void 0;
    try {
      return await action();
    } finally {
      lease?.release();
    }
  };
  await withLocalServiceLease(void 0, async () => {
    try {
      await ensureLmstudioModelLoaded({
        baseUrl,
        apiKey,
        headers: headerOverrides,
        ssrfPolicy,
        modelKey: model,
        requestedContextLength,
        timeoutMs: 12e4,
      });
    } catch (error) {
      log.warn("lmstudio embeddings warmup failed; continuing without preload", {
        baseUrl,
        model,
        error: formatErrorMessage(error),
      });
    }
  });
  const remoteProvider = createRemoteEmbeddingProvider({
    id: LMSTUDIO_PROVIDER_ID,
    client,
    errorPrefix: "lmstudio embeddings failed",
  });
  return {
    provider: {
      ...remoteProvider,
      embedQuery: async (text, callOptions) =>
        await withLocalServiceLease(callOptions?.signal, async () => {
          return await remoteProvider.embedQuery(text, callOptions);
        }),
      embedBatch: async (texts, callOptions) =>
        await withLocalServiceLease(callOptions?.signal, async () => {
          return await remoteProvider.embedBatch(texts, callOptions);
        }),
      ...(remoteProvider.embedBatchInputs
        ? {
            embedBatchInputs: async (inputs, callOptions) =>
              await withLocalServiceLease(callOptions?.signal, async () => {
                return await remoteProvider.embedBatchInputs(inputs, callOptions);
              }),
          }
        : {}),
    },
    client,
  };
}
//#endregion
//#region extensions/lmstudio/memory-embedding-adapter.ts
const lmstudioMemoryEmbeddingProviderAdapter = {
  id: "lmstudio",
  defaultModel: DEFAULT_LMSTUDIO_EMBEDDING_MODEL,
  transport: "remote",
  authProviderId: "lmstudio",
  allowExplicitWhenConfiguredAuto: true,
  create: async (options) => {
    const providerId = options.provider?.trim() || "lmstudio";
    const { provider, client } = await createLmstudioEmbeddingProvider({
      ...options,
      provider: providerId,
      fallback: "none",
    });
    return {
      provider,
      runtime: {
        id: "lmstudio",
        inlineBatchTimeoutMs: 10 * 6e4,
        cacheKeyData: {
          provider: providerId,
          baseUrl: client.baseUrl,
          model: client.model,
          headers: sanitizeEmbeddingCacheHeaders(client.headers, ["authorization"]),
        },
      },
    };
  },
};
//#endregion
export { lmstudioMemoryEmbeddingProviderAdapter as t };
