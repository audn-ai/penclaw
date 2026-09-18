import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
import { d as SecretInput } from "./types.secrets-C15Z_eLX.js";

//#region src/plugins/embedding-provider-types.d.ts
/** Input accepted by embedding providers, including multimodal inline-data parts. */
type EmbeddingInput =
  | string
  | {
      text: string;
      parts?: Array<
        | {
            type: "text";
            text: string;
          }
        | {
            type: "inline-data";
            mimeType: string;
            data: string;
          }
      >;
    };
/** Per-call options passed to embedding provider calls. */
type EmbeddingProviderCallOptions = {
  signal?: AbortSignal;
  inputType?: "query" | "document" | "semantic" | "classification" | "clustering";
};
/** Runtime metadata returned with a created embedding provider. */
type EmbeddingProviderRuntime = {
  id: string;
  cacheKeyData?: Record<
    string,
    unknown
  > /** Prior persisted model/cache identities that are equivalent to the current identity. */;
  indexIdentityAliases?: Array<{
    model: string;
    cacheKeyData: Record<string, unknown>;
  }>;
  inlineQueryTimeoutMs?: number;
  inlineBatchTimeoutMs?: number;
};
/** Provider-owned canonical identity and exact aliases for persisted indexes. */
type EmbeddingProviderIndexIdentity = {
  model: string;
  cacheKeyData: Record<string, unknown>;
  aliases?: Array<{
    model: string;
    cacheKeyData: Record<string, unknown>;
  }>;
};
/** Created embedding provider instance used by memory/search callers. */
type EmbeddingProvider = {
  id: string;
  model: string;
  dimensions?: number;
  maxInputTokens?: number;
  embed: (input: EmbeddingInput, options?: EmbeddingProviderCallOptions) => Promise<number[]>;
  embedBatch: (
    inputs: EmbeddingInput[],
    options?: EmbeddingProviderCallOptions,
  ) => Promise<number[][]>;
  close?: () => Promise<void> | void;
};
/** Options passed to embedding provider adapters when creating providers. */
type EmbeddingProviderCreateOptions = {
  config: OpenClawConfig;
  agentDir?: string;
  provider?: string;
  remote?: {
    baseUrl?: string;
    apiKey?: SecretInput;
    headers?: Record<string, string>;
  };
  model: string;
  inputType?: string;
  queryInputType?: string;
  documentInputType?: string;
  local?: {
    modelPath?: string;
    modelCacheDir?: string;
  };
  dimensions?: number;
  taskType?: string;
};
/** Result returned by an embedding provider adapter create call. */
type EmbeddingProviderCreateResult = {
  provider: EmbeddingProvider | null;
  runtime?: EmbeddingProviderRuntime;
};
/** Adapter contract registered by core or plugin embedding providers. */
type EmbeddingProviderAdapter = {
  id: string;
  defaultModel?: string;
  transport?: "local" | "remote";
  authProviderId?: string;
  resolveIndexIdentity?: (
    options: EmbeddingProviderCreateOptions,
  ) => EmbeddingProviderIndexIdentity;
  create: (options: EmbeddingProviderCreateOptions) => Promise<EmbeddingProviderCreateResult>;
  formatSetupError?: (err: unknown) => string;
};
//#endregion
export {
  EmbeddingProviderCreateOptions as a,
  EmbeddingProviderRuntime as c,
  EmbeddingProviderCallOptions as i,
  EmbeddingProvider as n,
  EmbeddingProviderCreateResult as o,
  EmbeddingProviderAdapter as r,
  EmbeddingProviderIndexIdentity as s,
  EmbeddingInput as t,
};
