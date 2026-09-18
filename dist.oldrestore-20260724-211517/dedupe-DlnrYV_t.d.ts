//#region src/infra/dedupe.d.ts
/** Small in-memory TTL/LRU-style cache for replay and duplicate suppression. */
type DedupeCache = {
  /** Returns true for a recent duplicate; records the key when it was not present. */ check: (
    key: string | undefined | null,
    now?: number,
  ) => boolean /** Returns true for a recent duplicate without refreshing or recording the key. */;
  peek: (key: string | undefined | null, now?: number) => boolean;
  delete: (key: string | undefined | null) => void;
  clear: () => void;
  size: () => number;
};
/** Dedupe cache bounds; ttlMs <= 0 disables expiry, maxSize <= 0 disables storage. */
type DedupeCacheOptions = {
  ttlMs: number;
  maxSize: number;
};
/** Creates a bounded in-memory dedupe cache with optional TTL expiry. */
declare function createDedupeCache(options: DedupeCacheOptions): DedupeCache;
/** Resolves a process-global dedupe cache for hot paths that can load this module twice. */
declare function resolveGlobalDedupeCache(key: symbol, options: DedupeCacheOptions): DedupeCache;
//#endregion
export {
  resolveGlobalDedupeCache as i,
  DedupeCacheOptions as n,
  createDedupeCache as r,
  DedupeCache as t,
};
