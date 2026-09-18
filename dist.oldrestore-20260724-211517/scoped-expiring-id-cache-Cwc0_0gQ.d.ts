//#region src/shared/scoped-expiring-id-cache.d.ts
type ScopedExpiringIdCache<TScope extends string | number, TId extends string | number> = {
  /** Records an id for a scope at the provided timestamp or current time. */ record: (
    scope: TScope,
    id: TId,
    now?: number,
  ) => void /** Returns true while the id is present and within the inclusive TTL window. */;
  has: (
    scope: TScope,
    id: TId,
    now?: number,
  ) => boolean /** Clears every scope and id from the backing store. */;
  clear: () => void;
};
/** Creates a scoped TTL cache for ids that should expire independently per scope. */
declare function createScopedExpiringIdCache<
  TScope extends string | number,
  TId extends string | number,
>(options: {
  /** Backing store supplied by callers that need module- or test-owned lifecycle. */ store: Map<
    string,
    Map<string, number>
  > /** Time-to-live in milliseconds; non-finite values collapse to immediate expiry. */;
  ttlMs: number /** Scope size that triggers opportunistic cleanup on record. */;
  cleanupThreshold: number;
}): ScopedExpiringIdCache<TScope, TId>;
//#endregion
export { createScopedExpiringIdCache as n, ScopedExpiringIdCache as t };
