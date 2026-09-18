import { createRequire } from "node:module";
import os from "node:os";
import "../../memory-core-host-engine-embeddings-C-z4ELNB.js";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { t as createLocalEmbeddingProvider } from "../../embeddings-B6h5v7TW.js";
import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
//#region extensions/llama-cpp/src/embedding-provider.ts
const LLAMA_CPP_EMBEDDING_PROVIDER_ID = "local";
const LOCAL_EMBEDDING_RUNTIME_FACTS = Symbol.for("openclaw.localEmbeddingRuntimeFacts");
const DEFAULT_LLAMA_CPP_EMBEDDING_MODEL =
  "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf";
const DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_CACHE_FILE_NAME =
  "hf_ggml-org_embeddinggemma-300m-qat-Q8_0.gguf";
function normalizeOptionalString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function readLocalOptions(options) {
  return options.local ?? {};
}
function createLlamaCppCacheKeyData(model, outputDimensionality) {
  return {
    provider: LLAMA_CPP_EMBEDDING_PROVIDER_ID,
    model,
    ...(typeof outputDimensionality === "number" ? { outputDimensionality } : {}),
  };
}
function resolveLlamaCppModelIdentity(local, modelPath, outputDimensionality) {
  const modelCacheDir =
    normalizeOptionalString(local.modelCacheDir) ??
    path.join(os.homedir(), ".node-llama-cpp", "models");
  const resolvedDefaultModelPath = path.resolve(
    modelCacheDir,
    DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_CACHE_FILE_NAME,
  );
  const resolvedModelPath = /^(?:hf:|https?:\/\/)/i.test(modelPath)
    ? void 0
    : path.resolve(modelCacheDir, modelPath);
  if (
    modelPath !==
      "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf" &&
    resolvedModelPath !== resolvedDefaultModelPath
  )
    return {
      model: modelPath,
      cacheKeyData: createLlamaCppCacheKeyData(modelPath, outputDimensionality),
      aliases: [],
    };
  const aliasModels = /* @__PURE__ */ new Set([
    resolvedDefaultModelPath,
    DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_CACHE_FILE_NAME,
  ]);
  if (
    modelPath !== "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf"
  )
    aliasModels.add(modelPath);
  return {
    model: DEFAULT_LLAMA_CPP_EMBEDDING_MODEL,
    cacheKeyData: createLlamaCppCacheKeyData(
      DEFAULT_LLAMA_CPP_EMBEDDING_MODEL,
      outputDimensionality,
    ),
    aliases: Array.from(aliasModels, (aliasModel) => ({
      model: aliasModel,
      cacheKeyData: createLlamaCppCacheKeyData(aliasModel, outputDimensionality),
    })),
  };
}
function textFromEmbeddingInput(input) {
  return typeof input === "string" ? input : input.text;
}
function toMemoryEmbeddingInput(input) {
  return typeof input === "string" ? { text: input } : input;
}
function isNodeLlamaCppMissing(err) {
  if (!(err instanceof Error)) return false;
  return err.code === "ERR_MODULE_NOT_FOUND" && err.message.includes("node-llama-cpp");
}
function formatErrorMessage(err) {
  if (err instanceof Error) return err.message;
  return String(err);
}
function formatLlamaCppSetupError(err) {
  const detail = formatErrorMessage(err);
  const missing = isNodeLlamaCppMissing(err);
  return [
    "Local llama.cpp embeddings unavailable.",
    missing
      ? "Reason: node-llama-cpp is missing or failed to install."
      : detail
        ? `Reason: ${detail}`
        : void 0,
    missing && detail ? `Detail: ${detail}` : null,
    "To enable local GGUF embeddings:",
    "1) Install the official provider plugin: openclaw plugins install @openclaw/llama-cpp-provider",
    "2) Use Node 24 for native installs/updates.",
    "3) If you use pnpm from source: pnpm approve-builds, then pnpm rebuild node-llama-cpp.",
    'Or set agents.defaults.memorySearch.provider to a remote embedding provider such as "openai", "ollama", "lmstudio", or "voyage".',
  ]
    .filter(Boolean)
    .join("\n");
}
const requireFromPlugin = createRequire(import.meta.url);
function resolveNodeLlamaCppImportUrl() {
  return pathToFileURL(requireFromPlugin.resolve("node-llama-cpp")).href;
}
function copyLocalRuntimeFacts(source, target) {
  const getRuntimeFacts = Reflect.get(source, LOCAL_EMBEDDING_RUNTIME_FACTS);
  if (typeof getRuntimeFacts === "function")
    Object.defineProperty(target, LOCAL_EMBEDDING_RUNTIME_FACTS, {
      enumerable: false,
      value: getRuntimeFacts,
    });
}
function adaptMemoryEmbeddingProvider(provider) {
  const adapted = {
    id: LLAMA_CPP_EMBEDDING_PROVIDER_ID,
    model: provider.model,
    maxInputTokens: provider.maxInputTokens,
    embed: async (input, callOptions) =>
      await provider.embedQuery(textFromEmbeddingInput(input), { signal: callOptions?.signal }),
    embedBatch: async (inputs, callOptions) => {
      if (provider.embedBatchInputs)
        return await provider.embedBatchInputs(inputs.map(toMemoryEmbeddingInput), {
          signal: callOptions?.signal,
        });
      return await provider.embedBatch(inputs.map(textFromEmbeddingInput), {
        signal: callOptions?.signal,
      });
    },
    close: provider.close,
  };
  copyLocalRuntimeFacts(provider, adapted);
  return adapted;
}
async function createLlamaCppMemoryEmbeddingProvider(options, runtimeOptions = {}) {
  const createOptions = buildMemoryCreateOptions(options, options.outputDimensionality);
  const local = readLocalOptions(createOptions);
  const provider = await createLocalEmbeddingProvider(createOptions, {
    nodeLlamaCppImportUrl: runtimeOptions.nodeLlamaCppImportUrl ?? resolveNodeLlamaCppImportUrl(),
  });
  const identity = resolveLlamaCppModelIdentity(
    local,
    provider.model,
    createOptions.outputDimensionality,
  );
  const identifiedProvider =
    identity.model === provider.model
      ? provider
      : {
          ...provider,
          model: identity.model,
        };
  if (identifiedProvider !== provider) copyLocalRuntimeFacts(provider, identifiedProvider);
  return {
    provider: identifiedProvider,
    runtime: createLlamaCppEmbeddingProviderRuntime(identity),
  };
}
async function createLlamaCppEmbeddingProviderResult(options, runtimeOptions = {}) {
  const result = await createLlamaCppMemoryEmbeddingProvider(
    buildMemoryCreateOptions(options, options.dimensions),
    runtimeOptions,
  );
  return {
    provider: result.provider ? adaptMemoryEmbeddingProvider(result.provider) : null,
    runtime: result.runtime,
  };
}
function buildMemoryCreateOptions(options, outputDimensionality) {
  const local = readLocalOptions(options);
  const modelPath =
    normalizeOptionalString(local.modelPath) ||
    "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf";
  return {
    config: options.config,
    agentDir: options.agentDir,
    provider: LLAMA_CPP_EMBEDDING_PROVIDER_ID,
    fallback: "none",
    remote: options.remote,
    model: modelPath,
    inputType: options.inputType,
    queryInputType: options.queryInputType,
    documentInputType: options.documentInputType,
    local: {
      ...local,
      modelPath,
    },
    outputDimensionality,
  };
}
function createLlamaCppEmbeddingProviderRuntime(identity) {
  return {
    id: LLAMA_CPP_EMBEDDING_PROVIDER_ID,
    inlineQueryTimeoutMs: 5 * 6e4,
    inlineBatchTimeoutMs: 10 * 6e4,
    cacheKeyData: identity.cacheKeyData,
    ...(identity.aliases.length > 0 ? { indexIdentityAliases: identity.aliases } : {}),
  };
}
const llamaCppEmbeddingProviderAdapter = {
  id: LLAMA_CPP_EMBEDDING_PROVIDER_ID,
  defaultModel: DEFAULT_LLAMA_CPP_EMBEDDING_MODEL,
  transport: "local",
  formatSetupError: formatLlamaCppSetupError,
  resolveIndexIdentity: (options) => {
    const createOptions = buildMemoryCreateOptions(options, options.dimensions);
    const local = readLocalOptions(createOptions);
    return resolveLlamaCppModelIdentity(
      local,
      normalizeOptionalString(local.modelPath) ??
        "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf",
      createOptions.outputDimensionality,
    );
  },
  create: async (options) => await createLlamaCppEmbeddingProviderResult(options),
};
//#endregion
//#region extensions/llama-cpp/index.ts
var llama_cpp_default = definePluginEntry({
  id: "llama-cpp",
  name: "llama.cpp Provider",
  description: "Local GGUF embeddings through node-llama-cpp",
  register(api) {
    api.registerEmbeddingProvider(llamaCppEmbeddingProviderAdapter);
  },
});
//#endregion
export { llama_cpp_default as default };
