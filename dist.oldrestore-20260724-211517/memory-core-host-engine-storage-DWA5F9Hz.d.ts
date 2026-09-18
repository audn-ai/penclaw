import { DatabaseSync } from "node:sqlite";
import {
  n as SqliteWalMaintenance,
  r as SqliteWalMaintenanceOptions,
  t as SqliteConnectionPragmaOptions,
} from "./sqlite-wal-CKrHuGAP.js";

//#region packages/memory-host-sdk/src/host/read-retry.d.ts
/** Return true for transient memory read failures that should be retried. */
declare function isTransientMemoryReadError(error: unknown): boolean;
/** Retry a memory read with the narrow transient error predicate. */
declare function retryTransientMemoryRead<T>(read: () => Promise<T>, label?: string): Promise<T>;
//#endregion
//#region packages/memory-host-sdk/src/host/memory-schema.d.ts
declare const MEMORY_INDEX_META_TABLE = "memory_index_meta";
declare const MEMORY_INDEX_SOURCES_TABLE = "memory_index_sources";
declare const MEMORY_INDEX_CHUNKS_TABLE = "memory_index_chunks";
declare const MEMORY_EMBEDDING_CACHE_TABLE = "memory_embedding_cache";
declare const MEMORY_INDEX_STATE_TABLE = "memory_index_state";
declare const MEMORY_INDEX_FTS_TABLE = "memory_index_chunks_fts";
declare const MEMORY_INDEX_PATHS_FTS_TABLE = "memory_index_paths_fts";
declare const MEMORY_INDEX_VECTOR_TABLE = "memory_index_chunks_vec";
/** Drop the canonical source-to-path-FTS maintenance triggers. */
declare function dropMemoryPathFtsTriggers(db: DatabaseSync): void;
/** Install the canonical source-to-path-FTS maintenance triggers. */
declare function ensureMemoryPathFtsTriggers(db: DatabaseSync): void;
/** Ensure canonical memory index tables and the optional FTS table exist. */
declare function ensureMemoryIndexSchema(params: {
  db: DatabaseSync /** @deprecated Omit to use the canonical memory cache table. */;
  embeddingCacheTable?: string;
  cacheEnabled: boolean /** @deprecated Omit to use the canonical memory FTS table. */;
  ftsTable?: string;
  ftsEnabled: boolean;
  ftsTokenizer?: "unicode61" | "trigram";
}): {
  ftsAvailable: boolean;
  ftsError?: string;
};
//#endregion
//#region packages/memory-host-sdk/src/host/sqlite-vec.d.ts
declare function loadSqliteVecExtension(params: {
  db: DatabaseSync;
  extensionPath?: string;
}): Promise<{
  ok: boolean;
  extensionPath?: string;
  error?: string;
}>;
//#endregion
//#region packages/memory-host-sdk/src/host/sqlite.d.ts
declare function requireMemoryHostNodeSqlite(): typeof import("node:sqlite");
declare function configureMemorySqliteWalMaintenance(
  db: DatabaseSync,
  options?: SqliteWalMaintenanceOptions & Pick<SqliteConnectionPragmaOptions, "busyTimeoutMs">,
): SqliteWalMaintenance;
declare function closeMemorySqliteWalMaintenance(db: DatabaseSync): boolean;
//#endregion
//#region src/plugin-sdk/memory-core-host-engine-storage.d.ts
/** Origin bucket for memory search results exposed through the SDK. */
type MemorySource = "memory" | "sessions";
/** Normalized search hit shape returned by memory host searches. */
type MemorySearchResult = {
  path: string;
  startLine: number;
  endLine: number;
  score: number;
  vectorScore?: number;
  textScore?: number;
  snippet: string;
  source: MemorySource;
  citation?: string;
};
/** Health probe result for embedding provider availability checks. */
type MemoryEmbeddingProbeResult = {
  ok: boolean;
  error?: string;
  checked?: boolean;
  cached?: boolean;
  checkedAtMs?: number;
  cacheExpiresAtMs?: number;
};
//#endregion
export {
  ensureMemoryIndexSchema as _,
  configureMemorySqliteWalMaintenance as a,
  retryTransientMemoryRead as b,
  MEMORY_EMBEDDING_CACHE_TABLE as c,
  MEMORY_INDEX_META_TABLE as d,
  MEMORY_INDEX_PATHS_FTS_TABLE as f,
  dropMemoryPathFtsTriggers as g,
  MEMORY_INDEX_VECTOR_TABLE as h,
  closeMemorySqliteWalMaintenance as i,
  MEMORY_INDEX_CHUNKS_TABLE as l,
  MEMORY_INDEX_STATE_TABLE as m,
  MemorySearchResult as n,
  requireMemoryHostNodeSqlite as o,
  MEMORY_INDEX_SOURCES_TABLE as p,
  MemorySource as r,
  loadSqliteVecExtension as s,
  MemoryEmbeddingProbeResult as t,
  MEMORY_INDEX_FTS_TABLE as u,
  ensureMemoryPathFtsTriggers as v,
  isTransientMemoryReadError as y,
};
