//#region src/shared/lazy-promise.ts
/** Returns the cached promise for a key, creating and storing it when absent. */
function getOrCreatePromise(cache, key, create) {
  const cached = cache.get(key);
  if (cached) return cached;
  const created = create();
  cache.set(key, created);
  return created;
}
/**
 * Creates a small promise cache that dedupes concurrent loads and can be cleared manually.
 *
 * Rejections are evicted by default so transient dynamic-import/runtime failures can recover.
 */
function createLazyPromiseLoader(load, options = {}) {
  let promise;
  const createPromise = () => {
    const loaded = Promise.resolve().then(load);
    if (options.cacheRejections !== true)
      loaded.catch(() => {
        if (promise === loaded) promise = void 0;
      });
    return loaded;
  };
  return {
    load() {
      promise ??= createPromise();
      return promise;
    },
    peek() {
      return promise;
    },
    clear() {
      promise = void 0;
    },
  };
}
/** Creates a reusable function that resolves one cached promise at a time. */
function createLazyPromise(load, options) {
  const loader = createLazyPromiseLoader(load, options);
  return () => loader.load();
}
/** Convenience wrapper for dynamic-import-shaped loaders. */
function createLazyImportLoader(load, options) {
  return createLazyPromiseLoader(load, options);
}
//#endregion
export {
  getOrCreatePromise as i,
  createLazyPromise as n,
  createLazyPromiseLoader as r,
  createLazyImportLoader as t,
};
