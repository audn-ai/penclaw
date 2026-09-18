import {
  a as EmbeddingProviderCreateOptions,
  c as EmbeddingProviderRuntime,
  i as EmbeddingProviderCallOptions,
  n as EmbeddingProvider,
  o as EmbeddingProviderCreateResult,
  r as EmbeddingProviderAdapter,
  s as EmbeddingProviderIndexIdentity,
  t as EmbeddingInput,
} from "../embedding-providers-WKzPF8ab.js";
import { i as OpenClawConfig } from "../types.openclaw-DDo8sH3F.js";

//#region src/plugins/embedding-provider-runtime.d.ts
/** Lists embedding providers from registered adapters and plugin capabilities. */
declare function listEmbeddingProviders(cfg?: OpenClawConfig): EmbeddingProviderAdapter[];
/** Resolves one embedding provider adapter by id, including configured API aliases. */
declare function getEmbeddingProvider(
  id: string,
  cfg?: OpenClawConfig,
): EmbeddingProviderAdapter | undefined;
//#endregion
export {
  type EmbeddingInput,
  type EmbeddingProvider,
  type EmbeddingProviderAdapter,
  type EmbeddingProviderCallOptions,
  type EmbeddingProviderCreateOptions,
  type EmbeddingProviderCreateResult,
  type EmbeddingProviderIndexIdentity,
  type EmbeddingProviderRuntime,
  getEmbeddingProvider,
  listEmbeddingProviders,
};
