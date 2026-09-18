import { t as readConfiguredProviderApiId } from "./embedding-provider-config-DsOGw75I.js";
import {
  n as listRuntimeEmbeddingProviderAdapters,
  r as resolveRuntimeEmbeddingProviderLookupIds,
  t as getRuntimeEmbeddingProviderAdapter,
} from "./embedding-provider-runtime-shared-DdZUR3yn.js";
import {
  E as listRegisteredMemoryEmbeddingProviders,
  w as getRegisteredMemoryEmbeddingProvider,
} from "./registry-B14M_H8G.js";
//#region src/plugins/memory-embedding-provider-runtime.ts
/** Lists registered memory embedding provider adapters without registry metadata. */
function listRegisteredMemoryEmbeddingProviderAdapters() {
  return listRegisteredMemoryEmbeddingProviders().map((entry) => entry.adapter);
}
/** Lists memory embedding providers from runtime config and registered adapters. */
function listMemoryEmbeddingProviders(cfg) {
  return listRuntimeEmbeddingProviderAdapters({
    key: "memoryEmbeddingProviders",
    cfg,
    registered: listRegisteredMemoryEmbeddingProviderAdapters(),
  });
}
function resolveConfiguredMemoryEmbeddingProviderId(providerId, cfg) {
  return readConfiguredProviderApiId({
    providerId,
    cfg,
  });
}
function resolveMemoryEmbeddingProviderLookupIds(id, cfg) {
  return resolveRuntimeEmbeddingProviderLookupIds({
    id,
    cfg,
    resolveConfiguredProviderId: resolveConfiguredMemoryEmbeddingProviderId,
  });
}
/** Resolves one memory embedding provider by id, alias, or configured API owner. */
function getMemoryEmbeddingProvider(id, cfg) {
  return getRuntimeEmbeddingProviderAdapter({
    key: "memoryEmbeddingProviders",
    cfg,
    lookupIds: resolveMemoryEmbeddingProviderLookupIds(id, cfg),
    getRegisteredProvider: getRegisteredMemoryEmbeddingProvider,
  });
}
//#endregion
export {
  listMemoryEmbeddingProviders as n,
  listRegisteredMemoryEmbeddingProviderAdapters as r,
  getMemoryEmbeddingProvider as t,
};
