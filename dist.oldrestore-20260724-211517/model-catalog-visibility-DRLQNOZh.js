import {
  n as projectModelCatalogEntryForRoute,
  r as resolveConfiguredModelCatalogOverrides,
} from "./model-catalog-route-DQhHLLvX.js";
import { n as createProviderAuthChecker } from "./model-provider-auth-DNlLhknV.js";
import {
  f as modelCatalogLogicalKey,
  o as dedupeModelCatalogEntries,
  r as buildConfiguredModelCatalog,
} from "./model-selection-shared-BliwFXJy.js";
import {
  n as createModelVisibilityPolicy,
  t as RUNTIME_MODEL_VISIBILITY_NORMALIZATION,
} from "./model-visibility-policy-BqHiELXR.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
//#region src/agents/model-catalog-visibility.ts
/**
 * Resolves model catalog entries visible to browse/UI surfaces. Visibility
 * combines explicit policy, configured models, defaults, and runtime
 * auth-backed availability.
 */
/** Maps one shared auth evaluation into logical catalog selection state. */
function resolveLogicalModelCatalogEntryState(params) {
  const routeManaged = params.evaluation.routeResolution !== null;
  const selectedRoute = params.evaluation.selectedRoute;
  const routeProjection = !routeManaged
    ? { kind: "unmanaged" }
    : selectedRoute
      ? {
          kind: "selected",
          route: selectedRoute,
          policy: params.routePolicy,
        }
      : {
          kind: "unresolved",
          policy: params.routePolicy,
        };
  return {
    authBacked: params.authBacked ?? params.evaluation.availability === true,
    compatible: params.evaluation.routeResolution?.kind !== "incompatible",
    preferred: selectedRoute ? params.routePolicy.matchesRoute(params.entry, selectedRoute) : false,
    routeManaged,
    routeProjection,
  };
}
async function modelCatalogEntryHasProviderAuth(providerAuthChecker, entry) {
  return await providerAuthChecker(entry.provider, {
    modelId: entry.id,
    api: entry.api,
    baseUrl: entry.baseUrl,
  });
}
function sortModelCatalogEntries(entries) {
  return entries.toSorted(
    (a, b) => a.provider.localeCompare(b.provider) || a.id.localeCompare(b.id),
  );
}
function resolveLogicalKey(entry, routePolicy) {
  return routePolicy.resolveIdentity(entry)?.key ?? modelCatalogLogicalKey(entry);
}
function dedupeLogicalModelCatalogEntries(entries, routePolicy) {
  const seen = /* @__PURE__ */ new Set();
  return entries.filter((entry) => {
    const key = resolveLogicalKey(entry, routePolicy);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
async function resolveVisibleModelCatalogWithPolicy(params, policy) {
  if (params.view === "all") return params.catalog;
  const buildDefaultVisibleCatalog = async () => {
    const configuredCatalog = sortModelCatalogEntries(
      buildConfiguredModelCatalog({ cfg: params.cfg }),
    );
    let checkEntryAuth = params.entryAuthChecker;
    if (!checkEntryAuth) {
      const providerAuthChecker =
        params.providerAuthChecker ??
        createProviderAuthChecker({
          cfg: params.cfg,
          workspaceDir: params.workspaceDir,
          agentDir: params.agentDir,
          agentId: params.agentId,
          env: params.env,
          allowPluginSyntheticAuth: params.runtimeAuthDiscovery,
          discoverExternalCliAuth: params.runtimeAuthDiscovery,
        });
      checkEntryAuth = (entry) => modelCatalogEntryHasProviderAuth(providerAuthChecker, entry);
    }
    const authBackedCatalog = [];
    for (const entry of params.catalog)
      if (await checkEntryAuth(entry)) authBackedCatalog.push(entry);
    return sortModelCatalogEntries(
      dedupeModelCatalogEntries([...configuredCatalog, ...authBackedCatalog]),
    );
  };
  const defaultVisibleCatalog =
    policy.allowAny || policy.hasProviderWildcards ? await buildDefaultVisibleCatalog() : [];
  return sortModelCatalogEntries(
    dedupeModelCatalogEntries(
      policy.visibleCatalog({
        catalog: params.catalog,
        defaultVisibleCatalog,
        view: params.view,
      }),
    ),
  );
}
/** Resolves logical rows while keeping provider-owned physical route precedence. */
async function resolveLogicalVisibleModelCatalog(params) {
  const policy =
    params.policy ??
    createModelVisibilityPolicy({
      cfg: params.cfg,
      catalog: params.catalog,
      defaultProvider: params.defaultProvider,
      defaultModel: params.defaultModel,
      agentId: params.agentId,
      ...RUNTIME_MODEL_VISIBILITY_NORMALIZATION,
    });
  const projectionCatalog =
    params.routeVariants && params.routeVariants.length > 0 ? params.routeVariants : params.catalog;
  const routeVariantsByKey = /* @__PURE__ */ new Map();
  for (const entry of projectionCatalog) {
    const key = resolveLogicalKey(entry, params.routePolicy);
    const variants = routeVariantsByKey.get(key) ?? [];
    variants.push(entry);
    routeVariantsByKey.set(key, variants);
  }
  const resolveEntryRouteVariants = (entry) =>
    routeVariantsByKey.get(resolveLogicalKey(entry, params.routePolicy)) ?? [entry];
  const stateByKey = /* @__PURE__ */ new Map();
  const evaluateEntry = async (entry) => {
    const key = resolveLogicalKey(entry, params.routePolicy);
    let pending = stateByKey.get(key);
    if (!pending) {
      const variants = resolveEntryRouteVariants(entry);
      pending = params.evaluateEntry(variants[0] ?? entry, variants);
      stateByKey.set(key, pending);
    }
    const state = await pending;
    const selectedRoute =
      state.routeProjection.kind === "selected" ? state.routeProjection.route : void 0;
    return {
      ...state,
      preferred: selectedRoute ? params.routePolicy.matchesRoute(entry, selectedRoute) : false,
    };
  };
  const normalizePolicyKey = (key) => {
    const slashIndex = key.indexOf("/");
    return slashIndex > 0
      ? resolveLogicalKey(
          {
            provider: key.slice(0, slashIndex),
            id: key.slice(slashIndex + 1),
          },
          params.routePolicy,
        )
      : key;
  };
  const configuredKeys = new Set([...policy.configuredKeys].map(normalizePolicyKey));
  const retainedKeys = new Set([...policy.retainedKeys].map(normalizePolicyKey));
  const projectEntries = async (entries) => {
    return sortModelCatalogEntries(
      dedupeLogicalModelCatalogEntries(
        await Promise.all(
          entries.map(async (entry) => {
            const state = await evaluateEntry(entry);
            const overrides = resolveConfiguredModelCatalogOverrides({
              cfg: params.cfg,
              entry,
              policy: params.routePolicy,
            });
            return projectModelCatalogEntryForRoute({
              entry,
              projection: state.routeProjection,
              catalog: resolveEntryRouteVariants(entry),
              ...(overrides ? { overrides } : {}),
            });
          }),
        ),
        params.routePolicy,
      ),
    );
  };
  if (params.view === "all") return await projectEntries(params.catalog);
  const catalogKeys = new Set(
    params.catalog.map((entry) => resolveLogicalKey(entry, params.routePolicy)),
  );
  const visible = (
    await resolveVisibleModelCatalogWithPolicy(
      {
        cfg: params.cfg,
        catalog: params.catalog,
        defaultProvider: params.defaultProvider,
        defaultModel: params.defaultModel,
        agentId: params.agentId,
        workspaceDir: params.workspaceDir,
        view: params.view,
        runtimeAuthDiscovery: false,
        entryAuthChecker: async (entry) => (await evaluateEntry(entry)).authBacked,
      },
      policy,
    )
  ).filter((entry) => {
    const key = resolveLogicalKey(entry, params.routePolicy);
    return catalogKeys.has(key) || configuredKeys.has(key);
  });
  const retained = params.catalog.filter((entry) =>
    retainedKeys.has(resolveLogicalKey(entry, params.routePolicy)),
  );
  const preferredKeys = new Set(
    [...visible, ...retained].map((entry) => resolveLogicalKey(entry, params.routePolicy)),
  );
  const preferred = [];
  const routeBacked = /* @__PURE__ */ new Set();
  for (const entry of params.catalog) {
    const key = resolveLogicalKey(entry, params.routePolicy);
    const preferredKey = preferredKeys.has(key);
    const wildcardRoute =
      policy.allowAny || policy.providerWildcards.has(normalizeProviderId(entry.provider));
    if (!preferredKey && !wildcardRoute) continue;
    const state = await evaluateEntry(entry);
    if (!state.compatible && !configuredKeys.has(key)) continue;
    if (state.preferred && preferredKey) preferred.push(entry);
    if (wildcardRoute && state.routeManaged && state.authBacked) routeBacked.add(entry);
  }
  const kept = [];
  for (const entry of visible) {
    const key = resolveLogicalKey(entry, params.routePolicy);
    const state = await evaluateEntry(entry);
    const configured = configuredKeys.has(key);
    if (
      (state.compatible || configured) &&
      (!state.routeManaged || configured || routeBacked.has(entry))
    )
      kept.push(entry);
  }
  return await projectEntries([...preferred, ...kept, ...retained, ...routeBacked]);
}
//#endregion
export { resolveLogicalVisibleModelCatalog as n, resolveLogicalModelCatalogEntryState as t };
