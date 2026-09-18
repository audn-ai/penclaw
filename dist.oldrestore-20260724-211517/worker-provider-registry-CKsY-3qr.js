import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region src/plugins/provider-registry-shared.ts
/** Normalizes provider ids used by capability-provider registries. */
function normalizeCapabilityProviderId(providerId) {
  const normalized = normalizeOptionalLowercaseString(providerId);
  return normalized && !isBlockedObjectKey(normalized) ? normalized : void 0;
}
/** Builds canonical and alias lookup maps for capability providers. */
function buildCapabilityProviderMaps(providers, normalizeId = normalizeCapabilityProviderId) {
  const canonical = /* @__PURE__ */ new Map();
  const aliases = /* @__PURE__ */ new Map();
  for (const provider of providers) {
    const id = normalizeId(provider.id);
    if (!id) continue;
    canonical.set(id, provider);
    aliases.set(id, provider);
    for (const alias of provider.aliases ?? []) {
      const normalizedAlias = normalizeId(alias);
      if (normalizedAlias) aliases.set(normalizedAlias, provider);
    }
  }
  return {
    canonical,
    aliases,
  };
}
//#endregion
//#region src/plugins/worker-provider-registry.ts
const compareText = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
function normalizeWorkerProviderIds(providerIds) {
  const normalized = providerIds.map(normalizeCapabilityProviderId).filter((id) => id !== void 0);
  return [...new Set(normalized)].toSorted(compareText);
}
function collectConfiguredWorkerProviderIds(config) {
  return normalizeWorkerProviderIds(
    Object.values(config.cloudWorkers?.profiles ?? {}).map((profile) => profile.provider),
  );
}
function manifestOwnsWorkerProvider(manifest, providerIds) {
  return normalizeWorkerProviderIds(manifest?.contracts?.workerProviders ?? []).some((id) =>
    providerIds.has(id),
  );
}
function listBundledWorkerProviderOwners(registry, providerIds) {
  const selected = new Set(normalizeWorkerProviderIds(providerIds));
  return registry.plugins
    .filter((plugin) => plugin.origin === "bundled")
    .flatMap((plugin) =>
      normalizeWorkerProviderIds(plugin.contracts?.workerProviders ?? [])
        .filter((providerId) => selected.has(providerId))
        .map((providerId) => ({
          pluginId: plugin.id,
          providerId,
        })),
    )
    .toSorted(
      (left, right) =>
        compareText(left.pluginId, right.pluginId) ||
        compareText(left.providerId, right.providerId),
    );
}
/** Auto-enable bundled owners needed to reconcile leases after profile removal. */
function resolveDurableWorkerProviderAutoEnabledReasons(registry, providerIds) {
  const reasons = Object.create(null);
  for (const { pluginId, providerId } of listBundledWorkerProviderOwners(registry, providerIds))
    (reasons[pluginId] ??= []).push(`${providerId} durable worker lease`);
  return reasons;
}
/** Validates the provider methods, normalized id, and manifest ownership contract. */
function validateWorkerProviderContract(provider, declaredIds) {
  const missingMethod = ["provision", "inspect", "destroy"].find(
    (method) => typeof provider[method] !== "function",
  );
  if (missingMethod)
    return {
      ok: false,
      message: `worker provider registration missing method: ${missingMethod}`,
    };
  if (provider.renew !== void 0 && typeof provider.renew !== "function")
    return {
      ok: false,
      message: "worker provider registration renew must be a function",
    };
  if (provider.resolveSshIdentity !== void 0 && typeof provider.resolveSshIdentity !== "function")
    return {
      ok: false,
      message: "worker provider registration resolveSshIdentity must be a function",
    };
  const id = normalizeCapabilityProviderId(provider.id);
  if (!id)
    return {
      ok: false,
      message: "worker provider registration missing valid id",
    };
  return declaredIds.some((candidate) => normalizeCapabilityProviderId(candidate) === id)
    ? {
        ok: true,
        id,
      }
    : {
        ok: false,
        message: `plugin must declare contracts.workerProviders for provider: ${id}`,
      };
}
/** Resolves one provider by its normalized manifest capability id. */
function resolveWorkerProvider(registry, providerId) {
  const normalizedId = normalizeCapabilityProviderId(providerId);
  return normalizedId ? registry.workerProviders.get(normalizedId)?.provider : void 0;
}
//#endregion
export {
  resolveDurableWorkerProviderAutoEnabledReasons as a,
  buildCapabilityProviderMaps as c,
  normalizeWorkerProviderIds as i,
  normalizeCapabilityProviderId as l,
  listBundledWorkerProviderOwners as n,
  resolveWorkerProvider as o,
  manifestOwnsWorkerProvider as r,
  validateWorkerProviderContract as s,
  collectConfiguredWorkerProviderIds as t,
};
