import {
  m as parseConfiguredModelVisibilityEntries,
  r as buildConfiguredModelCatalog,
} from "./model-selection-shared-BliwFXJy.js";
import {
  f as clampTimerTimeoutMs,
  j as resolveTimerTimeoutMs,
} from "./number-coercion-CJQ8TR--.js";
//#region src/agents/model-catalog-browse.ts
/**
 * Loads model catalog views for browse/search UI surfaces.
 */
/**
 * Loads the model catalog shape used by browse/list commands without letting optional
 * provider discovery stall the CLI path.
 */
const DEFAULT_MODEL_CATALOG_BROWSE_TIMEOUT_MS = 750;
/** Source-authored provider rows for inventory UIs, independent of picker allowlists. */
function buildProviderConfigModelCatalogForBrowse(params) {
  return buildConfiguredModelCatalog(params).toSorted(
    (a, b) =>
      a.provider.localeCompare(b.provider) ||
      a.name.localeCompare(b.name) ||
      a.id.localeCompare(b.id),
  );
}
/** True when a browse view cannot be answered from read-only cached catalog entries. */
function modelCatalogBrowseRequiresFullDiscovery(params) {
  const view = params.view ?? "default";
  return (
    view === "all" ||
    (view === "configured" &&
      parseConfiguredModelVisibilityEntries({ cfg: params.cfg }).providerWildcards.size > 0)
  );
}
function resolveModelCatalogBrowseTimeoutMs(value) {
  return (
    clampTimerTimeoutMs(value, 1) ??
    resolveTimerTimeoutMs(DEFAULT_MODEL_CATALOG_BROWSE_TIMEOUT_MS, 1)
  );
}
async function loadCatalogForBrowse(params) {
  const view = params.view ?? "default";
  if (
    modelCatalogBrowseRequiresFullDiscovery({
      cfg: params.cfg,
      view,
    })
  )
    return await params.loadCatalog({ readOnly: false });
  let timeout;
  const timeoutMs = resolveModelCatalogBrowseTimeoutMs(params.timeoutMs);
  const catalogPromise = params.loadCatalog({ readOnly: true });
  const catalogResult = catalogPromise.then((value) => ({
    kind: "catalog",
    value,
  }));
  const timeoutPromise = new Promise((resolve) => {
    timeout = globalThis.setTimeout(() => resolve({ kind: "timeout" }), timeoutMs);
    timeout.unref?.();
  });
  try {
    const result = await Promise.race([catalogResult, timeoutPromise]);
    if (result.kind === "timeout") {
      catalogPromise.catch(() => void 0);
      params.onTimeout?.(timeoutMs);
      return params.empty;
    }
    return result.value;
  } finally {
    if (timeout) globalThis.clearTimeout(timeout);
  }
}
/** Loads an explicit logical/physical catalog snapshot for route-aware browse surfaces. */
function loadModelCatalogSnapshotForBrowse(params) {
  return loadCatalogForBrowse({
    ...params,
    empty: {
      entries: [],
      routeVariants: [],
    },
  });
}
//#endregion
export {
  loadModelCatalogSnapshotForBrowse as n,
  modelCatalogBrowseRequiresFullDiscovery as r,
  buildProviderConfigModelCatalogForBrowse as t,
};
