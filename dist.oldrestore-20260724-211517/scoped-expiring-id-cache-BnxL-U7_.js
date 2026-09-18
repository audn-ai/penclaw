import {
  D as resolveIntegerOption,
  O as resolveNonNegativeIntegerOption,
} from "./number-coercion-CJQ8TR--.js";
//#region src/shared/scoped-expiring-id-cache.ts
/** Per-scope TTL cache used to suppress repeated ids without cross-scope bleed. */
/** Creates a scoped TTL cache for ids that should expire independently per scope. */
function createScopedExpiringIdCache(options) {
  const ttlMs = resolveNonNegativeIntegerOption(options.ttlMs, 0);
  const cleanupThreshold = resolveIntegerOption(options.cleanupThreshold, 1, { min: 1 });
  function cleanupExpired(scopeKey, entry, now) {
    for (const [id, timestamp] of entry) if (now - timestamp > ttlMs) entry.delete(id);
    if (entry.size === 0) options.store.delete(scopeKey);
  }
  return {
    record: (scope, id, now = Date.now()) => {
      const scopeKey = String(scope);
      const idKey = String(id);
      let entry = options.store.get(scopeKey);
      if (!entry) {
        entry = /* @__PURE__ */ new Map();
        options.store.set(scopeKey, entry);
      }
      entry.set(idKey, now);
      if (entry.size > cleanupThreshold) cleanupExpired(scopeKey, entry, now);
    },
    has: (scope, id, now = Date.now()) => {
      const scopeKey = String(scope);
      const idKey = String(id);
      const entry = options.store.get(scopeKey);
      if (!entry) return false;
      cleanupExpired(scopeKey, entry, now);
      return entry.has(idKey);
    },
    clear: () => {
      options.store.clear();
    },
  };
}
//#endregion
export { createScopedExpiringIdCache as t };
