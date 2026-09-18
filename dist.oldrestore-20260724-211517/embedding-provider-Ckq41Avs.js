import { r as OPENAI_DEFAULT_EMBEDDING_MODEL } from "./default-models-GLjqEMz-.js";
import {
  n as resolveRemoteEmbeddingClient,
  r as fetchRemoteEmbeddingVectors,
} from "./memory-core-host-engine-embeddings-C-z4ELNB.js";
//#region extensions/openai/embedding-provider.ts
const DEFAULT_OPENAI_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_OPENAI_EMBEDDING_MODEL = OPENAI_DEFAULT_EMBEDDING_MODEL;
const OPENAI_MAX_INPUT_TOKENS = {
  "text-embedding-3-small": 8192,
  "text-embedding-3-large": 8192,
  "text-embedding-ada-002": 8191,
};
function normalizeOpenAiModel(model) {
  const trimmed = model.trim();
  if (!trimmed) return DEFAULT_OPENAI_EMBEDDING_MODEL;
  return trimmed.startsWith("openai/") ? trimmed.slice(7) : trimmed;
}
/** Whether the embedding base URL points to the native OpenAI API endpoint. */
function isNativeOpenAiBaseUrl(baseUrl) {
  try {
    return new URL(baseUrl).hostname.toLowerCase().replace(/\.+$/, "") === "api.openai.com";
  } catch {
    return false;
  }
}
async function createOpenAiEmbeddingProvider(options) {
  const client = await resolveOpenAiEmbeddingClient(options);
  const url = `${client.baseUrl.replace(/\/$/, "")}/embeddings`;
  const resolveInputType = (kind) => {
    const value =
      (kind === "query" ? client.queryInputType : client.documentInputType) ?? client.inputType;
    return typeof value === "string" && value.trim().length > 0 ? value.trim() : void 0;
  };
  const embed = async (input, kind, signal) => {
    if (input.length === 0) return [];
    const inputType = resolveInputType(kind);
    return await fetchRemoteEmbeddingVectors({
      url,
      headers: client.headers,
      ssrfPolicy: client.ssrfPolicy,
      fetchImpl: client.fetchImpl,
      signal,
      body: {
        model: client.model,
        input,
        ...(typeof client.outputDimensionality === "number"
          ? { dimensions: client.outputDimensionality }
          : {}),
        ...(inputType ? { input_type: inputType } : {}),
      },
      errorPrefix: "openai embeddings failed",
    });
  };
  return {
    provider: {
      id: "openai",
      model: client.model,
      ...(typeof OPENAI_MAX_INPUT_TOKENS[normalizeOpenAiModel(client.model)] === "number"
        ? { maxInputTokens: OPENAI_MAX_INPUT_TOKENS[normalizeOpenAiModel(client.model)] }
        : {}),
      embedQuery: async (text, optionsValue) => {
        const [vec] = await embed([text], "query", optionsValue?.signal);
        return vec ?? [];
      },
      embedBatch: async (texts, optionsLocal) =>
        await embed(texts, "document", optionsLocal?.signal),
    },
    client,
  };
}
async function resolveOpenAiEmbeddingClient(options) {
  const originalModel = options.model;
  const client = await resolveRemoteEmbeddingClient({
    provider: options.provider ?? "openai",
    options,
    defaultBaseUrl: DEFAULT_OPENAI_BASE_URL,
    normalizeModel: normalizeOpenAiModel,
  });
  if (!isNativeOpenAiBaseUrl(client.baseUrl) && originalModel.startsWith("openai/"))
    client.model = `openai/${normalizeOpenAiModel(originalModel)}`;
  return {
    ...client,
    inputType: options.inputType,
    queryInputType: options.queryInputType,
    documentInputType: options.documentInputType,
    outputDimensionality: options.outputDimensionality,
  };
}
//#endregion
export { createOpenAiEmbeddingProvider as n, DEFAULT_OPENAI_EMBEDDING_MODEL as t };
