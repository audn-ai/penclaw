import { Ft as ProviderCatalogContext, Lt as ProviderCatalogResult } from "./types-Ga3mNO_F.js";
import {
  f as ModelProviderConfig,
  m as ModelProviderDeclarationConfig,
} from "./types.models-BqJSiNyu.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region src/plugins/provider-catalog.d.ts
/** Finds a provider catalog template entry by normalized provider and template id. */
declare function findCatalogTemplate(params: {
  entries: ReadonlyArray<{
    provider: string;
    id: string;
  }>;
  providerId: string;
  templateIds: readonly string[];
}):
  | {
      provider: string;
      id: string;
    }
  | undefined;
/** Builds a provider catalog result for providers that share one API key. */
declare function buildSingleProviderApiKeyCatalog(params: {
  ctx: ProviderCatalogContext;
  providerId: string;
  buildProvider: () => ModelProviderConfig | Promise<ModelProviderConfig>;
  allowExplicitBaseUrl?: boolean;
}): Promise<ProviderCatalogResult>;
/** Builds a multi-provider catalog result backed by one provider API key. */
declare function buildPairedProviderApiKeyCatalog(params: {
  ctx: ProviderCatalogContext;
  providerId: string;
  buildProviders: () =>
    | Record<string, ModelProviderConfig>
    | Promise<Record<string, ModelProviderConfig>>;
}): Promise<ProviderCatalogResult>;
//#endregion
//#region src/plugin-sdk/provider-catalog-shared.d.ts
/**
 * Normalized model row read from user config for provider catalog augmentation.
 */
type ConfiguredProviderCatalogEntry = {
  /** Normalized model id as exposed through provider catalog discovery. */ id: string /** Display name from config, falling back to the normalized id. */;
  name: string /** Published provider id attached to this catalog entry. */;
  provider: string /** Optional context window copied from the configured model row when positive. */;
  contextWindow?: number /** Whether the configured model advertises reasoning support. */;
  reasoning?: boolean /** Runtime input modalities retained from the configured model row. */;
  input?: Array<"text" | "image" | "audio" | "video" | "document">;
};
/**
 * Caches one live catalog load promise by stable key parts for a short TTL.
 */
declare function getCachedLiveCatalogValue<T>(params: {
  /** Stable JSON-serializable values that identify one provider/config catalog load. */ keyParts: readonly unknown[] /** Loader for the live catalog value when no fresh cache entry exists. */;
  load: () => Promise<T> /** Optional predicate for values that are healthy enough to retain. */;
  shouldCache?: (
    value: T,
  ) => boolean /** Cache lifetime in milliseconds; defaults to a short provider-discovery TTL. */;
  ttlMs?: number /** Test hook for deterministic cache expiry. */;
  now?: () => number;
}): Promise<T>;
/**
 * Clears the process-local live catalog cache for tests and isolated plugin probes.
 */
declare function clearLiveCatalogCacheForTests(): void;
/**
 * Converts a plugin manifest modelCatalog provider into runtime provider config.
 */
declare function buildManifestModelProviderConfig(params: {
  /** Provider id that owns the manifest catalog rows. */ providerId: string /** Raw manifest modelCatalog provider block to normalize into runtime config. */;
  catalog: unknown;
}): ModelProviderDeclarationConfig;
/**
 * Reads user-configured provider models as catalog entries for plugin discovery output.
 */
declare function readConfiguredProviderCatalogEntries(params: {
  /** Runtime config containing optional user-defined provider model rows. */ config?: OpenClawConfig /** Provider id used to locate configured model rows. */;
  providerId: string /** Provider id to publish on emitted catalog entries when it differs from lookup id. */;
  publishedProviderId?: string;
}): ConfiguredProviderCatalogEntry[];
/**
 * Returns whether a provider transport can report native usage while streaming.
 */
declare function supportsNativeStreamingUsageCompat(params: {
  /** Provider id used for transport capability lookup. */ providerId: string /** Provider endpoint URL used to detect native streaming usage behavior. */;
  baseUrl: string | undefined;
}): boolean;
/**
 * Marks models as streaming-usage compatible when provider transport capabilities allow it.
 */
declare function applyProviderNativeStreamingUsageCompat(params: {
  /** Provider id used for transport capability lookup. */ providerId: string /** Runtime provider config whose model compat flags may be filled in. */;
  providerConfig: ModelProviderDeclarationConfig;
}): ModelProviderDeclarationConfig;
//#endregion
export {
  getCachedLiveCatalogValue as a,
  buildPairedProviderApiKeyCatalog as c,
  clearLiveCatalogCacheForTests as i,
  buildSingleProviderApiKeyCatalog as l,
  applyProviderNativeStreamingUsageCompat as n,
  readConfiguredProviderCatalogEntries as o,
  buildManifestModelProviderConfig as r,
  supportsNativeStreamingUsageCompat as s,
  ConfiguredProviderCatalogEntry as t,
  findCatalogTemplate as u,
};
