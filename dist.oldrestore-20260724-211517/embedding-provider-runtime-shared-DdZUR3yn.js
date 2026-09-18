import {
  n as resolvePluginCapabilityProvider,
  r as resolvePluginCapabilityProviders,
} from "./capability-provider-runtime-eBLyfsgF.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
//#region src/plugins/embedding-provider-runtime-shared.ts
/** Shared runtime helpers for embedding provider lookup across core and plugin capabilities. */
/** Builds lookup ids for embedding providers, including configured API aliases. */
function resolveRuntimeEmbeddingProviderLookupIds(params) {
  const ids = [params.id];
  const configuredProviderId = params.resolveConfiguredProviderId(params.id, params.cfg);
  if (
    configuredProviderId &&
    !ids.some((candidate) => normalizeProviderId(candidate) === configuredProviderId)
  )
    ids.push(configuredProviderId);
  return ids;
}
/** Lists registered and plugin-contributed embedding provider adapters for a capability key. */
function listRuntimeEmbeddingProviderAdapters(params) {
  const merged = new Map(params.registered.map((adapter) => [adapter.id, adapter]));
  const capabilityAdapters = resolvePluginCapabilityProviders({
    key: params.key,
    cfg: params.cfg,
  });
  for (const adapter of capabilityAdapters)
    if (!merged.has(adapter.id)) merged.set(adapter.id, adapter);
  return [...merged.values()];
}
/** Resolves one embedding provider adapter from registered providers before plugin capabilities. */
function getRuntimeEmbeddingProviderAdapter(params) {
  for (const candidateId of params.lookupIds) {
    const registered = params.getRegisteredProvider(candidateId);
    if (registered) return registered.adapter;
  }
  for (const candidateId of params.lookupIds) {
    const provider = resolvePluginCapabilityProvider({
      key: params.key,
      providerId: candidateId,
      cfg: params.cfg,
    });
    if (provider) return provider;
  }
}
//#endregion
export {
  listRuntimeEmbeddingProviderAdapters as n,
  resolveRuntimeEmbeddingProviderLookupIds as r,
  getRuntimeEmbeddingProviderAdapter as t,
};
