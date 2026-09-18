import { Buffer } from "node:buffer";
import { a as resolveAgentDir } from "./agent-scope-config-DVIR1nBa.js";
import "./agent-scope-y9xQv_q1.js";
import { t as getEmbeddingProvider } from "./embedding-provider-runtime-BSH7bFMk.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import {
  n as authorizeOpenAiCompatibleHttpModelOverride,
  o as getHeader,
  u as resolveOpenAiCompatibleHttpOperatorScopes,
} from "./http-auth-utils-Cm6rPa7b.js";
import { a as sendJson, s as sendMissingScopeForbidden } from "./http-common-Czxz795c.js";
import { t as handleGatewayPostJsonEndpoint } from "./http-endpoint-helpers-4-WwJuzP.js";
import {
  a as resolveAgentIdForRequest,
  i as isUnknownGatewayAgentError,
  o as resolveAgentIdFromModel,
} from "./http-utils-B3cLzhCe.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { a as logWarn } from "./logger-BegyOJlO.js";
import { t as getMemoryEmbeddingProvider } from "./memory-embedding-provider-runtime-DO4orj5r.js";
import { t as resolveMemorySearchConfig } from "./memory-search-C1x_ATR9.js";
import { n as createConfiguredProviderLocalServiceAcquirer } from "./provider-local-service-DLgcYp6u.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
//#region src/gateway/embeddings-http.ts
const DEFAULT_EMBEDDINGS_BODY_BYTES = 5 * 1024 * 1024;
const MAX_EMBEDDING_INPUTS = 128;
const MAX_EMBEDDING_INPUT_CHARS = 8192;
const MAX_EMBEDDING_TOTAL_CHARS = 65536;
const DEFAULT_MEMORY_EMBEDDING_PROVIDER = "openai";
function coerceRequest(value) {
  return value && typeof value === "object" ? value : {};
}
function resolveInputTexts(input) {
  if (typeof input === "string") return [input];
  if (!Array.isArray(input)) return null;
  if (input.every((entry) => typeof entry === "string")) return input;
  return null;
}
function encodeEmbeddingBase64(embedding) {
  const float32 = Float32Array.from(embedding);
  return Buffer.from(float32.buffer).toString("base64");
}
function validateInputTexts(texts) {
  if (texts.length > MAX_EMBEDDING_INPUTS) return `Too many inputs (max ${MAX_EMBEDDING_INPUTS}).`;
  let totalChars = 0;
  for (const text of texts) {
    if (text.length > MAX_EMBEDDING_INPUT_CHARS)
      return `Input too long (max ${MAX_EMBEDDING_INPUT_CHARS} chars).`;
    totalChars += text.length;
    if (totalChars > MAX_EMBEDDING_TOTAL_CHARS)
      return `Total input too large (max ${MAX_EMBEDDING_TOTAL_CHARS} chars).`;
  }
}
function resolveEmbeddingProviderRemoteConfig(remote) {
  return remote
    ? {
        baseUrl: remote.baseUrl,
        apiKey: remote.apiKey,
        headers: remote.headers,
      }
    : void 0;
}
async function createConfiguredEmbeddingProvider(params) {
  const acquireLocalService = createConfiguredProviderLocalServiceAcquirer(() => params.cfg);
  const providerId =
    params.provider === "auto" ? DEFAULT_MEMORY_EMBEDDING_PROVIDER : params.provider;
  const createWithAdapter = async (adapter) => {
    const createOptions = {
      config: params.cfg,
      agentDir: params.agentDir,
      provider: providerId,
      model: params.model || adapter.defaultModel || "",
      local: params.memorySearch?.local,
      remote: resolveEmbeddingProviderRemoteConfig(params.memorySearch?.remote),
      outputDimensionality: params.memorySearch?.outputDimensionality,
      acquireLocalService,
    };
    return (await adapter.create(createOptions)).provider;
  };
  const createWithGenericAdapter = async (adapter) => {
    const createOptions = {
      config: params.cfg,
      agentDir: params.agentDir,
      provider: providerId,
      model: params.model || adapter.defaultModel || "",
      local: params.memorySearch?.local,
      remote: resolveEmbeddingProviderRemoteConfig(params.memorySearch?.remote),
      dimensions: params.memorySearch?.outputDimensionality,
      inputType: params.memorySearch?.inputType,
      queryInputType: params.memorySearch?.queryInputType,
      documentInputType: params.memorySearch?.documentInputType,
      acquireLocalService,
    };
    const result = await adapter.create(createOptions);
    return result.provider ? adaptGenericEmbeddingProvider(result.provider) : null;
  };
  const adapter = getMemoryEmbeddingProvider(providerId, params.cfg);
  if (adapter) {
    const provider = await createWithAdapter(adapter);
    if (!provider) throw new Error(`Memory embedding provider ${providerId} is unavailable.`);
    return provider;
  }
  const genericAdapter = getEmbeddingProvider(providerId, params.cfg);
  if (!genericAdapter) throw new Error(`Unknown memory embedding provider: ${providerId}`);
  const provider = await createWithGenericAdapter(genericAdapter);
  if (!provider) throw new Error(`Embedding provider ${providerId} is unavailable.`);
  return provider;
}
function adaptGenericEmbeddingProvider(provider) {
  return {
    id: provider.id,
    model: provider.model,
    ...(typeof provider.maxInputTokens === "number"
      ? { maxInputTokens: provider.maxInputTokens }
      : {}),
    embedQuery: async (text, options) =>
      await provider.embed(text, {
        ...options,
        inputType: "query",
      }),
    embedBatch: async (texts, options) =>
      await provider.embedBatch(texts, {
        ...options,
        inputType: "document",
      }),
    ...(provider.close ? { close: provider.close } : {}),
  };
}
function resolveEmbeddingsTarget(params) {
  const configuredProvider =
    params.configuredProvider === "auto"
      ? DEFAULT_MEMORY_EMBEDDING_PROVIDER
      : params.configuredProvider;
  const raw = params.requestModel.trim();
  const slash = raw.indexOf("/");
  if (slash === -1)
    return {
      provider: configuredProvider,
      model: raw,
    };
  const provider = normalizeLowercaseStringOrEmpty(raw.slice(0, slash));
  const model = raw.slice(slash + 1).trim();
  if (!model) return { errorMessage: "Unsupported embedding model reference." };
  if (provider !== configuredProvider)
    return {
      errorMessage: "This agent does not allow that embedding provider on `/v1/embeddings`.",
    };
  return {
    provider: configuredProvider,
    model,
  };
}
/** Handles OpenAI-compatible embeddings requests for the configured agent memory provider. */
async function handleOpenAiEmbeddingsHttpRequest(req, res, opts) {
  const handled = await handleGatewayPostJsonEndpoint(req, res, {
    pathname: "/v1/embeddings",
    requiredOperatorMethod: "chat.send",
    resolveOperatorScopes: resolveOpenAiCompatibleHttpOperatorScopes,
    auth: opts.auth,
    trustedProxies: opts.trustedProxies,
    allowRealIpFallback: opts.allowRealIpFallback,
    rateLimiter: opts.rateLimiter,
    maxBodyBytes: opts.maxBodyBytes ?? DEFAULT_EMBEDDINGS_BODY_BYTES,
  });
  if (handled === false) return false;
  if (!handled) return true;
  const modelOverrideAuth = authorizeOpenAiCompatibleHttpModelOverride(req, handled.requestAuth);
  if (!modelOverrideAuth.allowed) {
    sendMissingScopeForbidden(res, modelOverrideAuth.missingScope);
    return true;
  }
  const payload = coerceRequest(handled.body);
  const requestModel = normalizeOptionalString(payload.model) ?? "";
  if (!requestModel) {
    sendJson(res, 400, {
      error: {
        message: "Missing `model`.",
        type: "invalid_request_error",
      },
    });
    return true;
  }
  const cfg = getRuntimeConfig();
  if (requestModel !== "openclaw" && !resolveAgentIdFromModel(requestModel, cfg)) {
    sendJson(res, 400, {
      error: {
        message: "Invalid `model`. Use `openclaw` or `openclaw/<agentId>`.",
        type: "invalid_request_error",
      },
    });
    return true;
  }
  const texts = resolveInputTexts(payload.input);
  if (!texts) {
    sendJson(res, 400, {
      error: {
        message: "`input` must be a string or an array of strings.",
        type: "invalid_request_error",
      },
    });
    return true;
  }
  const inputError = validateInputTexts(texts);
  if (inputError) {
    sendJson(res, 400, {
      error: {
        message: inputError,
        type: "invalid_request_error",
      },
    });
    return true;
  }
  let agentId;
  try {
    agentId = resolveAgentIdForRequest({
      req,
      model: requestModel,
    });
  } catch (err) {
    if (isUnknownGatewayAgentError(err)) {
      sendJson(res, 400, {
        error: {
          message: err.message,
          type: "invalid_request_error",
        },
      });
      return true;
    }
    throw err;
  }
  const agentDir = resolveAgentDir(cfg, agentId);
  const memorySearch = resolveMemorySearchConfig(cfg, agentId);
  const configuredProvider = memorySearch?.provider ?? "openai";
  const target = resolveEmbeddingsTarget({
    requestModel:
      normalizeOptionalString(getHeader(req, "x-openclaw-model")) ||
      normalizeOptionalString(memorySearch?.model) ||
      "",
    configuredProvider,
  });
  if ("errorMessage" in target) {
    sendJson(res, 400, {
      error: {
        message: target.errorMessage,
        type: "invalid_request_error",
      },
    });
    return true;
  }
  try {
    const embeddings = await (
      await createConfiguredEmbeddingProvider({
        cfg,
        agentDir,
        provider: target.provider,
        model: target.model,
        memorySearch: memorySearch
          ? {
              ...memorySearch,
              outputDimensionality:
                typeof payload.dimensions === "number" && payload.dimensions > 0
                  ? Math.floor(payload.dimensions)
                  : memorySearch.outputDimensionality,
            }
          : void 0,
      })
    ).embedBatch(texts);
    const encodingFormat = payload.encoding_format === "base64" ? "base64" : "float";
    sendJson(res, 200, {
      object: "list",
      data: embeddings.map((embedding, index) => ({
        object: "embedding",
        index,
        embedding: encodingFormat === "base64" ? encodeEmbeddingBase64(embedding) : embedding,
      })),
      model: requestModel,
      usage: {
        prompt_tokens: 0,
        total_tokens: 0,
      },
    });
  } catch (err) {
    logWarn(`openai-compat: embeddings request failed: ${formatErrorMessage(err)}`);
    sendJson(res, 500, {
      error: {
        message: "internal error",
        type: "api_error",
      },
    });
  }
  return true;
}
//#endregion
export { handleOpenAiEmbeddingsHttpRequest };
