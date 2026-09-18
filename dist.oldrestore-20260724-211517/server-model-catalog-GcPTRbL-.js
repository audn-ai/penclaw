import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
//#region src/gateway/server-model-catalog.ts
const loadModelCatalogModule = async () => await import("./model-catalog-CKXmb4DJ.js");
function createGatewayModelCatalogCache() {
  return {
    lastSuccessfulCatalog: null,
    inFlightRefresh: null,
    staleGeneration: 0,
    appliedGeneration: 0,
  };
}
const readOnlyModelCatalogCache = createGatewayModelCatalogCache();
const fullModelCatalogCache = createGatewayModelCatalogCache();
function resolveGatewayModelCatalogCache(params) {
  return params?.readOnly === false ? fullModelCatalogCache : readOnlyModelCatalogCache;
}
function resetGatewayModelCatalogState() {
  for (const cache of [readOnlyModelCatalogCache, fullModelCatalogCache]) {
    cache.lastSuccessfulCatalog = null;
    cache.inFlightRefresh = null;
    cache.staleGeneration = 0;
    cache.appliedGeneration = 0;
  }
}
function isGatewayModelCatalogStale(cache) {
  return cache.appliedGeneration < cache.staleGeneration;
}
async function resolveLoadModelCatalogSnapshot(params) {
  if (params?.loadModelCatalogSnapshot) return params.loadModelCatalogSnapshot;
  const { loadModelCatalogSnapshot } = await loadModelCatalogModule();
  return loadModelCatalogSnapshot;
}
function startGatewayModelCatalogRefresh(params) {
  const cache = resolveGatewayModelCatalogCache(params);
  const config = (params?.getConfig ?? getRuntimeConfig)();
  const readOnly = params?.readOnly !== false;
  const refreshGeneration = cache.staleGeneration;
  const refresh = resolveLoadModelCatalogSnapshot(params)
    .then((loadSnapshot) =>
      loadSnapshot({
        config,
        readOnly,
      }),
    )
    .then((snapshot) => {
      if (
        (readOnly || snapshot.entries.length > 0) &&
        refreshGeneration === cache.staleGeneration
      ) {
        cache.lastSuccessfulCatalog = snapshot;
        cache.appliedGeneration = cache.staleGeneration;
      }
      return snapshot;
    })
    .finally(() => {
      if (cache.inFlightRefresh === refresh) cache.inFlightRefresh = null;
    });
  cache.inFlightRefresh = refresh;
  return refresh;
}
/** Mark cached model catalogs stale after config/plugin reload changes. */
function markGatewayModelCatalogStaleForReload() {
  readOnlyModelCatalogCache.staleGeneration += 1;
  fullModelCatalogCache.staleGeneration += 1;
}
async function resetModelCatalogCacheForTest() {
  resetGatewayModelCatalogState();
  const { resetModelCatalogCacheForTest: resetModelCatalogCacheForTestLocal } =
    await loadModelCatalogModule();
  resetModelCatalogCacheForTestLocal();
}
/** Load the Gateway model catalog snapshot, returning cached data while stale refreshes run. */
async function loadGatewayModelCatalogSnapshot(params) {
  const cache = resolveGatewayModelCatalogCache(params);
  const isStale = isGatewayModelCatalogStale(cache);
  if (!isStale && cache.lastSuccessfulCatalog !== null) return cache.lastSuccessfulCatalog;
  if (isStale && cache.lastSuccessfulCatalog !== null) {
    if (!cache.inFlightRefresh) startGatewayModelCatalogRefresh(params).catch(() => void 0);
    return cache.lastSuccessfulCatalog;
  }
  if (cache.inFlightRefresh) return await cache.inFlightRefresh;
  return await startGatewayModelCatalogRefresh(params);
}
/** Load the deduplicated Gateway model catalog for entries-only consumers. */
async function loadGatewayModelCatalog(params) {
  return (await loadGatewayModelCatalogSnapshot(params)).entries;
}
//#endregion
export {
  resetModelCatalogCacheForTest as i,
  loadGatewayModelCatalogSnapshot as n,
  markGatewayModelCatalogStaleForReload as r,
  loadGatewayModelCatalog as t,
};
