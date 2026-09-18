import { s as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-3WxfNDRv.js";
import { t as planManifestModelCatalogRows } from "./manifest-planner-DSmSdykb.js";
import { r as normalizeModelCatalogProviderId } from "./model-catalog-refs-BcuK-xC3.js";
import "./model-catalog-Djtgv3Hv.js";
import {
  d as isPluginEnabled,
  l as getPluginRecord,
  s as resolvePluginContributionOwners,
} from "./plugin-registry-BckMdz4f.js";
//#region src/commands/models/list.manifest-catalog.ts
/** Manifest-backed model catalog row loaders for `openclaw models list`. */
function loadManifestCatalogRowsForPluginIds(params) {
  if (params.pluginIds && params.pluginIds.length === 0) return [];
  const pluginIdSet = params.pluginIds ? new Set(params.pluginIds) : void 0;
  const plan = planManifestModelCatalogRows({
    registry: pluginIdSet
      ? {
          ...params.registry,
          plugins: params.registry.plugins.filter((plugin) => pluginIdSet.has(plugin.id)),
        }
      : params.registry,
    ...(params.providerFilter ? { providerFilter: params.providerFilter } : {}),
  });
  const eligibleProviders = new Set(
    plan.entries
      .filter((entry) =>
        params.mode === "static-authoritative"
          ? entry.discovery === "static"
          : entry.discovery !== "runtime",
      )
      .map((entry) => entry.provider),
  );
  if (eligibleProviders.size === 0) return [];
  return plan.rows.filter((row) => eligibleProviders.has(row.provider));
}
function resolveConventionModelCatalogPluginIds(params) {
  const record = getPluginRecord({
    index: params.index,
    pluginId: params.providerFilter,
  });
  if (
    !record ||
    !isPluginEnabled({
      index: params.index,
      pluginId: record.pluginId,
      config: params.cfg,
    })
  )
    return [];
  return [record.pluginId];
}
function resolveDeclaredModelCatalogPluginIds(params) {
  return resolvePluginContributionOwners({
    index: params.index,
    config: params.cfg,
    contribution: "modelCatalogProviders",
    matches: params.providerFilter,
  });
}
function loadManifestCatalogRowsForList(params) {
  const providerFilter = params.providerFilter
    ? normalizeModelCatalogProviderId(params.providerFilter)
    : void 0;
  const mode = params.mode ?? "static-authoritative";
  const snapshot =
    params.metadataSnapshot ??
    loadManifestMetadataSnapshot({
      config: params.cfg,
      env: params.env ?? process.env,
    });
  const index = snapshot.index;
  if (!providerFilter)
    return loadManifestCatalogRowsForPluginIds({
      cfg: params.cfg,
      env: params.env,
      index,
      registry: snapshot.manifestRegistry,
      mode,
    });
  const conventionRows = loadManifestCatalogRowsForPluginIds({
    cfg: params.cfg,
    env: params.env,
    index,
    registry: snapshot.manifestRegistry,
    mode,
    pluginIds: resolveConventionModelCatalogPluginIds({
      cfg: params.cfg,
      index,
      providerFilter,
    }),
    providerFilter,
  });
  if (conventionRows.length > 0) return conventionRows;
  return loadManifestCatalogRowsForPluginIds({
    cfg: params.cfg,
    env: params.env,
    index,
    registry: snapshot.manifestRegistry,
    mode,
    pluginIds: resolveDeclaredModelCatalogPluginIds({
      cfg: params.cfg,
      index,
      providerFilter,
    }),
    providerFilter,
  });
}
/** Loads authoritative static manifest catalog rows for model-list output. */
function loadStaticManifestCatalogRowsForList(params) {
  return loadManifestCatalogRowsForList({
    ...params,
    mode: "static-authoritative",
  });
}
/** Loads supplemental non-runtime manifest catalog rows for fallback list sources. */
function loadSupplementalManifestCatalogRowsForList(params) {
  return loadManifestCatalogRowsForList({
    ...params,
    mode: "supplemental",
  });
}
//#endregion
export {
  loadSupplementalManifestCatalogRowsForList as n,
  loadStaticManifestCatalogRowsForList as t,
};
