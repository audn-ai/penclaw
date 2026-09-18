import { t as OLLAMA_CLOUD_BASE_URL } from "./defaults-W8ZJNfBr.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { n as fetchConfiguredLocalOriginWithSsrFGuard } from "./fetch-guard-Da47iiZE.js";
import { t as resolveEnvApiKey } from "./model-auth-env-DLe5znyS.js";
import {
  d as isNonSecretApiKeyMarker,
  u as isKnownEnvApiKeyMarker,
} from "./model-auth-markers-CA2Xy59Z.js";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-Df_qhWv_.js";
import {
  t as readProviderBaseUrl,
  u as resolveOllamaApiBase,
} from "./provider-base-url-BOHQJG0k.js";
import {
  g as readResponseTextLimited,
  m as readProviderJsonResponse,
} from "./provider-http-errors-DLMRBkZU.js";
import "./provider-auth-mypr64nh.js";
import { u as normalizeProviderId } from "./provider-model-shared-CYlCpWlu.js";
import "./secret-input-D1aG0n6v.js";
import "./ssrf-runtime-DJ478vv8.js";
import "./provider-auth-runtime-DpUprUn3.js";
import "./provider-http-BDIltggC.js";
import "./ssrf-runtime-internal-vyrl557U.js";
import { b as ssrfPolicyFromHttpBaseUrlAllowedOrigin } from "./ssrf-keFRGQLq.js";
import { g as normalizeOllamaWireModelId } from "./stream-D0hvAkbV.js";
import {
  c as hasConfiguredSecretInput,
  f as normalizeResolvedSecretInputString,
} from "./types.secrets-BV0ywRAy.js";
//#region extensions/ollama/src/embedding-provider.ts
const DEFAULT_OLLAMA_EMBEDDING_MODEL = "nomic-embed-text";
const OLLAMA_EMBED_ERROR_BODY_LIMIT_BYTES = 8 * 1024;
const QUERY_INSTRUCTION_TEMPLATES = [
  {
    prefix: "qwen3-embedding",
    template:
      "Instruct: Given a user query, retrieve relevant memory notes and documents\nQuery:{query}",
  },
  {
    prefix: "nomic-embed-text",
    template: "search_query: {query}",
  },
  {
    prefix: "mxbai-embed-large",
    template: "Represent this sentence for searching relevant passages: {query}",
  },
];
function sanitizeAndNormalizeEmbedding(vec, outputDimensionality) {
  const sanitized = (
    typeof outputDimensionality === "number" ? vec.slice(0, outputDimensionality) : vec
  ).map((value) => {
    if (typeof value !== "number")
      throw new Error("Ollama embed response contains a non-number embedding value");
    return Number.isFinite(value) ? value : 0;
  });
  const magnitude = Math.sqrt(sanitized.reduce((sum, value) => sum + value * value, 0));
  if (magnitude < 1e-10) return sanitized;
  return sanitized.map((value) => value / magnitude);
}
async function withRemoteHttpResponse(params) {
  const { response, release } = await fetchConfiguredLocalOriginWithSsrFGuard({
    url: params.url,
    init: params.init,
    signal: params.signal,
    policy: params.ssrfPolicy,
    configuredLocalOriginBaseUrl: params.configuredLocalOriginBaseUrl,
    auditContext: "ollama-memory-embedding",
  });
  try {
    return await params.onResponse(response);
  } finally {
    await release();
  }
}
async function readOllamaEmbeddingJsonResponse(response) {
  const payload = await readProviderJsonResponse(response, "Ollama embed response");
  if (typeof payload !== "object" || payload === null || Array.isArray(payload))
    throw new Error("Ollama embed response returned a non-object JSON payload");
  return payload;
}
function normalizeEmbeddingModel(model, providerId) {
  const trimmed = model.trim();
  if (!trimmed) return DEFAULT_OLLAMA_EMBEDDING_MODEL;
  return normalizeOllamaWireModelId(trimmed, providerId);
}
function applyQueryInstructionTemplate(model, queryText) {
  const normalizedModel = model.trim().toLowerCase();
  const match = QUERY_INSTRUCTION_TEMPLATES.find(({ prefix }) =>
    normalizedModel.startsWith(prefix),
  );
  return match ? match.template.replace("{query}", () => queryText) : queryText;
}
function resolveConfiguredProvider(options) {
  const providers = options.config.models?.providers;
  if (!providers) return;
  const providerId = options.provider?.trim() || "ollama";
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
  const fallback = providers.ollama;
  return fallback
    ? {
        providerId: "ollama",
        config: fallback,
      }
    : void 0;
}
function resolveMemorySecretInputString(params) {
  if (!hasConfiguredSecretInput(params.value)) return;
  return normalizeResolvedSecretInputString({
    value: params.value,
    path: params.path,
  });
}
function resolveSourcedOllamaEmbeddingKey(params) {
  if (params.configString !== void 0) {
    if (!isNonSecretApiKeyMarker(params.configString)) return { apiKey: params.configString };
    if (!isKnownEnvApiKeyMarker(params.configString)) return "opt-out";
    const envKey = resolveEnvApiKey("ollama")?.apiKey;
    return envKey && !isNonSecretApiKeyMarker(envKey) ? { apiKey: envKey } : "opt-out";
  }
  if (params.declared) {
    const envKey = resolveEnvApiKey("ollama")?.apiKey;
    return envKey && !isNonSecretApiKeyMarker(envKey) ? { apiKey: envKey } : "opt-out";
  }
  return "unset";
}
function resolveOllamaEmbeddingResolvedKeys(options, providerConfig) {
  const remoteValue = options.remote?.apiKey;
  const remote = resolveSourcedOllamaEmbeddingKey({
    configString: resolveMemorySecretInputString({
      value: remoteValue,
      path: "agents.*.memorySearch.remote.apiKey",
    }),
    declared: hasConfiguredSecretInput(remoteValue),
  });
  const providerValue = providerConfig?.config.apiKey;
  const provider = resolveSourcedOllamaEmbeddingKey({
    configString: normalizeOptionalSecretInput(providerValue),
    declared: hasConfiguredSecretInput(providerValue),
  });
  const envKey = resolveEnvApiKey("ollama")?.apiKey;
  return {
    remote,
    provider,
    env: envKey && !isNonSecretApiKeyMarker(envKey) ? envKey : void 0,
  };
}
function resolveOllamaEmbeddingBaseUrl(params) {
  const remoteBaseUrl = params.remoteBaseUrl?.trim();
  if (remoteBaseUrl)
    return {
      baseUrl: resolveOllamaApiBase(remoteBaseUrl),
      origin: "remote-config",
    };
  const providerBaseUrl = readProviderBaseUrl(params.providerConfig?.config);
  if (providerBaseUrl)
    return {
      baseUrl: resolveOllamaApiBase(providerBaseUrl),
      origin: "provider-config",
    };
  return {
    baseUrl: resolveOllamaApiBase(void 0),
    origin: "default",
  };
}
function normalizeOllamaHostKey(baseUrl) {
  try {
    const parsed = new URL(baseUrl);
    let hostname = parsed.hostname.toLowerCase();
    if (hostname === "localhost" || hostname === "::1" || hostname === "[::1]")
      hostname = "127.0.0.1";
    const port = parsed.port || (parsed.protocol === "https:" ? "443" : "80");
    const path = parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/$/, "");
    return `${parsed.protocol}//${hostname}:${port}${path}`;
  } catch {
    return;
  }
}
function areOllamaHostsEquivalent(a, b) {
  const aKey = normalizeOllamaHostKey(a);
  const bKey = normalizeOllamaHostKey(b);
  return aKey !== void 0 && bKey !== void 0 && aKey === bKey;
}
function isOllamaCloudBaseUrl(baseUrl) {
  return areOllamaHostsEquivalent(baseUrl, OLLAMA_CLOUD_BASE_URL);
}
function selectOllamaEmbeddingApiKey(params) {
  if (params.resolved.remote !== "unset")
    return typeof params.resolved.remote === "object" ? params.resolved.remote.apiKey : void 0;
  const reachesProviderHost =
    params.baseUrlOrigin === "provider-config" ||
    params.baseUrlOrigin === "default" ||
    areOllamaHostsEquivalent(params.baseUrl, params.providerOwnedHost);
  if (params.resolved.provider !== "unset" && reachesProviderHost)
    return typeof params.resolved.provider === "object" ? params.resolved.provider.apiKey : void 0;
  if (params.resolved.env && isOllamaCloudBaseUrl(params.baseUrl)) return params.resolved.env;
}
function resolveOllamaEmbeddingClient(options) {
  const providerConfig = resolveConfiguredProvider(options);
  const { baseUrl, origin: baseUrlOrigin } = resolveOllamaEmbeddingBaseUrl({
    remoteBaseUrl: options.remote?.baseUrl,
    providerConfig,
  });
  const model = normalizeEmbeddingModel(options.model, options.provider);
  const headers = {
    "Content-Type": "application/json",
    ...Object.assign({}, providerConfig?.config.headers, options.remote?.headers),
  };
  const apiKey = selectOllamaEmbeddingApiKey({
    resolved: resolveOllamaEmbeddingResolvedKeys(options, providerConfig),
    baseUrl,
    baseUrlOrigin,
    providerOwnedHost: resolveOllamaApiBase(readProviderBaseUrl(providerConfig?.config)),
  });
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
  const localService = providerConfig?.config.localService;
  return {
    baseUrl,
    headers,
    ssrfPolicy: ssrfPolicyFromHttpBaseUrlAllowedOrigin(baseUrl),
    model,
    outputDimensionality: options.outputDimensionality,
    ...(localService && baseUrlOrigin !== "remote-config"
      ? {
          localServiceTarget: {
            providerId: providerConfig.providerId,
            baseUrl: `${baseUrl.replace(/\/+$/, "")}/v1`,
            headers,
          },
          acquireLocalService: options.acquireLocalService,
        }
      : {}),
  };
}
async function createOllamaEmbeddingProvider(options) {
  const client = resolveOllamaEmbeddingClient(options);
  const embedUrl = `${client.baseUrl.replace(/\/$/, "")}/api/embed`;
  const embedMany = async (input, signal) => {
    const localServiceLease =
      client.localServiceTarget && client.acquireLocalService
        ? await client.acquireLocalService(client.localServiceTarget, signal)
        : void 0;
    let json;
    try {
      json = await withRemoteHttpResponse({
        url: embedUrl,
        ssrfPolicy: client.ssrfPolicy,
        configuredLocalOriginBaseUrl: client.baseUrl,
        signal,
        init: {
          method: "POST",
          headers: client.headers,
          body: JSON.stringify({
            model: client.model,
            input,
          }),
        },
        onResponse: async (response) => {
          if (!response.ok) {
            const detail = await readResponseTextLimited(
              response,
              OLLAMA_EMBED_ERROR_BODY_LIMIT_BYTES,
            ).catch(() => "unknown error");
            throw new Error(`Ollama embed HTTP ${response.status}: ${detail}`);
          }
          return await readOllamaEmbeddingJsonResponse(response);
        },
      });
    } finally {
      localServiceLease?.release();
    }
    if (!Array.isArray(json.embeddings))
      throw new Error("Ollama embed response missing embeddings[]");
    const expectedCount = Array.isArray(input) ? input.length : 1;
    if (json.embeddings.length !== expectedCount)
      throw new Error(
        `Ollama embed response returned ${json.embeddings.length} embeddings for ${expectedCount} inputs`,
      );
    return json.embeddings.map((embedding) => {
      if (!Array.isArray(embedding))
        throw new Error("Ollama embed response contains a non-array embedding");
      return sanitizeAndNormalizeEmbedding(embedding, client.outputDimensionality);
    });
  };
  const embedOne = async (text, signal) => {
    const [embedding] = await embedMany(text, signal);
    if (!embedding) throw new Error("Ollama embed response returned no embedding");
    return embedding;
  };
  const embedQuery = async (text, optionsValue) =>
    await embedOne(applyQueryInstructionTemplate(client.model, text), optionsValue?.signal);
  const provider = {
    id: "ollama",
    model: client.model,
    embedQuery,
    embedBatch: async (texts, optionsLocal) =>
      texts.length === 0 ? [] : await embedMany(texts, optionsLocal?.signal),
  };
  return {
    provider,
    client: {
      ...client,
      embedBatch: async (texts) => {
        try {
          return await provider.embedBatch(texts);
        } catch (err) {
          throw new Error(formatErrorMessage(err), { cause: err });
        }
      },
    },
  };
}
//#endregion
export { createOllamaEmbeddingProvider as n, DEFAULT_OLLAMA_EMBEDDING_MODEL as t };
