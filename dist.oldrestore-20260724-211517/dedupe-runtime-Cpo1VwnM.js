import { n as resolveGlobalDedupeCache } from "./dedupe-BqZ2YTEC.js";
//#region src/plugin-sdk/dedupe-runtime.ts
/**
 * Creates a channel-family presence cache backed by a global in-memory dedupe layer
 * plus a lazily opened plugin keyed store. Persistence is best effort: the first
 * open/read/write failure disables the persistent layer for the process so message
 * handling never breaks on state errors, matching the shipped channel-cache contract.
 */
function createPersistentDedupeCache(params) {
  const memory = resolveGlobalDedupeCache(params.globalKey, {
    ttlMs: params.ttlMs,
    maxSize: params.maxSize,
  });
  let persistentStore;
  let persistentStoreDisabled = false;
  const disablePersistentStore = (error) => {
    persistentStoreDisabled = true;
    persistentStore = void 0;
    params.persistent.logError?.(error);
  };
  const getPersistentStore = () => {
    if (persistentStoreDisabled) return;
    if (persistentStore) return persistentStore;
    try {
      persistentStore = params.persistent.openStore({
        namespace: params.persistent.namespace,
        maxEntries: params.persistent.maxEntries,
        defaultTtlMs: params.ttlMs,
      });
      return persistentStore;
    } catch (error) {
      disablePersistentStore(error);
      return;
    }
  };
  return {
    peek: (key) => memory.peek(key),
    lookup: async (key) => {
      if (memory.peek(key)) return true;
      const store = getPersistentStore();
      if (!store) return false;
      let record;
      try {
        record = await store.lookup(key);
      } catch (error) {
        disablePersistentStore(error);
        return false;
      }
      if (record === void 0) return false;
      memory.check(key, params.persistent.readTimestamp?.(record));
      return true;
    },
    register: async (key, record, opts) => {
      memory.check(key, opts?.at);
      const store = getPersistentStore();
      if (!store) return;
      try {
        await store.register(key, record);
      } catch (error) {
        disablePersistentStore(error);
      }
    },
    clearForTest: () => {
      memory.clear();
      persistentStore = void 0;
      persistentStoreDisabled = false;
    },
  };
}
//#endregion
export { createPersistentDedupeCache as t };
