import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
//#region src/commands/models/list.source-plan.ts
const providerIndexCatalogLoader = createLazyImportLoader(
  () => import("./list.provider-index-catalog-BVUs0R3p.js"),
);
function createSourcePlan(params) {
  return {
    kind: params.kind,
    manifestCatalogRows: params.manifestCatalogRows ?? [],
    providerIndexCatalogRows: params.providerIndexCatalogRows ?? [],
    requiresInitialRegistry: params.requiresInitialRegistry ?? false,
    skipRuntimeModelSuppression: params.skipRuntimeModelSuppression ?? false,
    fallbackToRegistryWhenEmpty: params.fallbackToRegistryWhenEmpty ?? false,
  };
}
/** Creates the baseline plan that loads the runtime model registry. */
function createRegistryModelListSourcePlan() {
  return createSourcePlan({
    kind: "registry",
    requiresInitialRegistry: true,
  });
}
/** Plans source precedence for all/provider-filtered model-list output. */
async function planAllModelListSources(params) {
  if (!(params.enableCascade ?? params.all)) return createRegistryModelListSourcePlan();
  const manifestCatalog = await import("./list.manifest-catalog-BvGO-oV8.js");
  const loadStaticManifestCatalogRowsForList =
    params.dependencies?.loadStaticManifestCatalogRowsForList ??
    manifestCatalog.loadStaticManifestCatalogRowsForList;
  const loadSupplementalManifestCatalogRowsForList =
    params.dependencies?.loadSupplementalManifestCatalogRowsForList ??
    manifestCatalog.loadSupplementalManifestCatalogRowsForList;
  if (!params.providerFilter) {
    const providerIndexCatalog = await providerIndexCatalogLoader.load();
    const loadProviderIndexCatalogRowsForList =
      params.dependencies?.loadProviderIndexCatalogRowsForList ??
      providerIndexCatalog.loadProviderIndexCatalogRowsForList;
    return createSourcePlan({
      kind: "registry",
      manifestCatalogRows: loadSupplementalManifestCatalogRowsForList({
        cfg: params.cfg,
        metadataSnapshot: params.metadataSnapshot,
      }),
      providerIndexCatalogRows: loadProviderIndexCatalogRowsForList({ cfg: params.cfg }),
      requiresInitialRegistry: true,
    });
  }
  const providerCatalog = await import("./list.provider-catalog-NDece3on.js");
  const hasProviderRuntimeCatalogForFilter =
    params.dependencies?.hasProviderRuntimeCatalogForFilter ??
    providerCatalog.hasProviderRuntimeCatalogForFilter;
  const hasProviderStaticCatalogForFilter =
    params.dependencies?.hasProviderStaticCatalogForFilter ??
    providerCatalog.hasProviderStaticCatalogForFilter;
  const staticManifestCatalogRows = loadStaticManifestCatalogRowsForList({
    cfg: params.cfg,
    providerFilter: params.providerFilter,
    metadataSnapshot: params.metadataSnapshot,
  });
  if (staticManifestCatalogRows.length > 0)
    return createSourcePlan({
      kind: "manifest",
      manifestCatalogRows: staticManifestCatalogRows,
      skipRuntimeModelSuppression: true,
    });
  if (
    await hasProviderRuntimeCatalogForFilter({
      cfg: params.cfg,
      providerFilter: params.providerFilter,
      metadataSnapshot: params.metadataSnapshot,
    })
  )
    return createSourcePlan({
      kind: "provider-runtime-scoped",
      fallbackToRegistryWhenEmpty: true,
    });
  const manifestCatalogRows = loadSupplementalManifestCatalogRowsForList({
    cfg: params.cfg,
    providerFilter: params.providerFilter,
    metadataSnapshot: params.metadataSnapshot,
  });
  if (manifestCatalogRows.length > 0)
    return createSourcePlan({
      kind: "registry",
      manifestCatalogRows,
      requiresInitialRegistry: true,
    });
  const providerIndexCatalog = await providerIndexCatalogLoader.load();
  const providerIndexCatalogRows = (
    params.dependencies?.loadProviderIndexCatalogRowsForList ??
    providerIndexCatalog.loadProviderIndexCatalogRowsForList
  )({
    cfg: params.cfg,
    providerFilter: params.providerFilter,
  });
  if (providerIndexCatalogRows.length > 0)
    return createSourcePlan({
      kind: "provider-index",
      providerIndexCatalogRows,
      skipRuntimeModelSuppression: true,
    });
  if (
    await hasProviderStaticCatalogForFilter({
      cfg: params.cfg,
      providerFilter: params.providerFilter,
      metadataSnapshot: params.metadataSnapshot,
    })
  )
    return createSourcePlan({
      kind: "provider-runtime-static",
      skipRuntimeModelSuppression: true,
      fallbackToRegistryWhenEmpty: true,
    });
  return createSourcePlan({
    kind: "provider-runtime-scoped",
    fallbackToRegistryWhenEmpty: true,
  });
}
//#endregion
export { createRegistryModelListSourcePlan, planAllModelListSources };
