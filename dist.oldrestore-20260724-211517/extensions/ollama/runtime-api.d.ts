import { o as SsrFPolicy } from "../../ssrf-skjEI_i5.js";
import {
  a as createConfiguredOllamaCompatStreamWrapper,
  c as isOllamaCompatProvider,
  d as resolveOllamaCompatNumCtxEnabled,
  f as shouldInjectOllamaCompatNumCtx,
  i as convertToOllamaMessages,
  l as parseNdjsonStream,
  n as buildAssistantMessage,
  o as createConfiguredOllamaStreamFn,
  p as wrapOllamaCompatNumCtx,
  r as buildOllamaChatRequest,
  s as createOllamaStreamFn,
  t as OLLAMA_NATIVE_BASE_URL,
  u as resolveOllamaBaseUrlForRun,
} from "../../stream-Dh8k5s-L.js";
import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";

//#region extensions/ollama/src/embedding-provider.d.ts
type OllamaEmbeddingProvider = {
  id: string;
  model: string;
  maxInputTokens?: number;
  embedQuery: (
    text: string,
    options?: {
      signal?: AbortSignal;
    },
  ) => Promise<number[]>;
  embedBatch: (
    texts: string[],
    options?: {
      signal?: AbortSignal;
    },
  ) => Promise<number[][]>;
};
type MemoryCoreAcquireLocalService = (
  target: {
    providerId: string;
    baseUrl: string;
    headers?: HeadersInit;
  },
  signal?: AbortSignal | null,
) => Promise<
  | {
      release: () => void;
    }
  | undefined
>;
type OllamaEmbeddingOptions = {
  config: OpenClawConfig;
  agentDir?: string;
  provider?: string;
  remote?: {
    baseUrl?: string;
    apiKey?: unknown;
    headers?: Record<string, string>;
  };
  model: string;
  fallback?: string;
  local?: unknown;
  outputDimensionality?: number;
  taskType?: unknown;
  acquireLocalService?: MemoryCoreAcquireLocalService;
};
type OllamaEmbeddingClient = {
  baseUrl: string;
  headers: Record<string, string>;
  ssrfPolicy?: SsrFPolicy;
  model: string;
  outputDimensionality?: number;
  localServiceTarget?: Parameters<MemoryCoreAcquireLocalService>[0];
  acquireLocalService?: MemoryCoreAcquireLocalService;
  embedBatch: (texts: string[]) => Promise<number[][]>;
};
declare const DEFAULT_OLLAMA_EMBEDDING_MODEL = "nomic-embed-text";
declare function createOllamaEmbeddingProvider(options: OllamaEmbeddingOptions): Promise<{
  provider: OllamaEmbeddingProvider;
  client: OllamaEmbeddingClient;
}>;
//#endregion
export {
  DEFAULT_OLLAMA_EMBEDDING_MODEL,
  OLLAMA_NATIVE_BASE_URL,
  type OllamaEmbeddingClient,
  type OllamaEmbeddingProvider,
  buildAssistantMessage,
  buildOllamaChatRequest,
  convertToOllamaMessages,
  createConfiguredOllamaCompatStreamWrapper,
  createConfiguredOllamaStreamFn,
  createOllamaEmbeddingProvider,
  createOllamaStreamFn,
  isOllamaCompatProvider,
  parseNdjsonStream,
  resolveOllamaBaseUrlForRun,
  resolveOllamaCompatNumCtxEnabled,
  shouldInjectOllamaCompatNumCtx,
  wrapOllamaCompatNumCtx,
};
