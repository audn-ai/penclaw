import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import {
  A as resolveMergedModelProviderConfig,
  j as resolveMergedModelProviderModels,
} from "./openai-routing-Cu28Ynzk.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
//#region src/agents/model-catalog-route.ts
/** Projects physical catalog rows for browse/presentation; never runtime execution. */
function normalizeExactModelId(value) {
  return splitTrailingAuthProfile(value).model.trim().toLowerCase();
}
/** Reads explicit logical capability overrides without re-resolving auth. */
function resolveConfiguredModelCatalogOverrides(params) {
  const provider = normalizeProviderId(params.entry.provider);
  const providerConfig = resolveMergedModelProviderConfig(params.cfg, provider);
  if (!providerConfig) return;
  const configuredIdentity = params.policy?.resolveIdentity(params.entry);
  const normalizeConfiguredModelId = (modelId) =>
    params.policy?.resolveIdentity({
      provider: params.entry.provider,
      id: modelId,
    })?.key ?? normalizeExactModelId(modelId);
  const model = resolveMergedModelProviderModels({
    models: providerConfig.models,
    normalizeModelId: normalizeConfiguredModelId,
  }).get(configuredIdentity?.key ?? normalizeExactModelId(params.entry.id));
  const overrides = {
    ...(model?.name ? { name: model.name } : {}),
    ...(model?.contextWindow !== void 0
      ? { contextWindow: model.contextWindow }
      : providerConfig.contextWindow !== void 0
        ? { contextWindow: providerConfig.contextWindow }
        : {}),
    ...(model?.contextTokens !== void 0
      ? { contextTokens: model.contextTokens }
      : providerConfig.contextTokens !== void 0
        ? { contextTokens: providerConfig.contextTokens }
        : {}),
    ...(model?.reasoning !== void 0 ? { reasoning: model.reasoning } : {}),
    ...(model?.input !== void 0 ? { input: model.input } : {}),
  };
  return Object.keys(overrides).length > 0 ? overrides : void 0;
}
function sameLogicalModel(a, identity, policy) {
  return policy.resolveIdentity(a)?.key === identity.key;
}
function logicalIdentity(entry, id, name) {
  return {
    id,
    name: name ?? id,
    provider: entry.provider,
    ...(entry.alias ? { alias: entry.alias } : {}),
  };
}
function applyLogicalOverrides(entry, overrides) {
  return overrides
    ? {
        ...entry,
        ...overrides,
      }
    : entry;
}
/** Finds the exact physical row that supplied a selected provider route. */
function findModelCatalogRouteDonor(params) {
  const identity = params.policy.resolveIdentity(params.entry);
  const physicalDonor = identity
    ? params.catalog?.find(
        (candidate) =>
          sameLogicalModel(candidate, identity, params.policy) &&
          params.policy.matchesRoute(candidate, params.route),
      )
    : void 0;
  if (physicalDonor) return physicalDonor;
  return params.policy.matchesRoute(params.entry, params.route) ? params.entry : void 0;
}
/**
 * Builds one allowlisted logical catalog row.
 *
 * Selected-route capabilities come only from a physical row accepted by the
 * provider-owned matcher. Unresolved managed routes expose identity only.
 * Auth, runtime, request overrides, and other private transport facts never
 * enter the returned catalog shape.
 */
function projectModelCatalogEntryForRoute(params) {
  if (params.projection.kind === "unmanaged") return params.entry;
  const identity = params.projection.policy.resolveIdentity(params.entry) ?? {
    id: splitTrailingAuthProfile(params.entry.id).model,
    key: `${normalizeProviderId(params.entry.provider)}/${normalizeExactModelId(params.entry.id)}`,
  };
  if (params.projection.kind === "unresolved")
    return applyLogicalOverrides(
      logicalIdentity(params.entry, identity.id, params.entry.name),
      params.overrides,
    );
  const { policy, route } = params.projection;
  const donor = findModelCatalogRouteDonor({
    entry: params.entry,
    route,
    policy,
    catalog: params.catalog,
  });
  return applyLogicalOverrides(
    {
      ...logicalIdentity(params.entry, identity.id, donor?.name ?? params.entry.name),
      api: route.api,
      baseUrl: route.baseUrl,
      ...(donor?.contextWindow !== void 0 ? { contextWindow: donor.contextWindow } : {}),
      ...(donor?.contextTokens !== void 0 ? { contextTokens: donor.contextTokens } : {}),
      ...(donor?.reasoning !== void 0 ? { reasoning: donor.reasoning } : {}),
      ...(donor?.input !== void 0 ? { input: donor.input } : {}),
    },
    params.overrides,
  );
}
//#endregion
export {
  projectModelCatalogEntryForRoute as n,
  resolveConfiguredModelCatalogOverrides as r,
  findModelCatalogRouteDonor as t,
};
