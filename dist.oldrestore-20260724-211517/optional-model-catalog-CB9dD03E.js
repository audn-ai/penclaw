//#region src/gateway/server-methods/optional-model-catalog.ts
/**
 * Optional model-catalog loader for methods where metadata improves the result
 * but should never block the primary session response path.
 */
const DEFAULT_OPTIONAL_MODEL_CATALOG_TIMEOUT_MS = 750;
const loggedSlowCatalogKeys = /* @__PURE__ */ new Set();
function normalizeOptionalModelCatalog(value) {
  return Array.isArray(value) ? value : void 0;
}
function normalizeOptionalModelCatalogSnapshot(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  const snapshot = value;
  return Array.isArray(snapshot.entries) && Array.isArray(snapshot.routeVariants)
    ? {
        entries: snapshot.entries,
        routeVariants: snapshot.routeVariants,
      }
    : void 0;
}
function startOptionalServerMethodModelCatalogValueLoad(params) {
  let catalogPromise;
  try {
    catalogPromise = params.load();
  } catch {
    catalogPromise = Promise.resolve(void 0);
  }
  return { promise: catalogPromise.then(params.normalize, () => void 0) };
}
function startOptionalServerMethodModelCatalogLoad(context) {
  return startOptionalServerMethodModelCatalogValueLoad({
    load: () => context.loadGatewayModelCatalog(),
    normalize: normalizeOptionalModelCatalog,
  });
}
function startOptionalServerMethodModelCatalogSnapshotLoad(context) {
  return startOptionalServerMethodModelCatalogValueLoad({
    load: () => context.loadGatewayModelCatalogSnapshot(),
    normalize: normalizeOptionalModelCatalogSnapshot,
  });
}
async function loadOptionalServerMethodModelCatalogValue(context, surface, options, startLoad) {
  let timeout;
  const timedOut = Symbol("server-method-model-catalog-timeout");
  const timeoutMs = options?.timeoutMs ?? DEFAULT_OPTIONAL_MODEL_CATALOG_TIMEOUT_MS;
  const catalogLoad = options?.startedLoad ?? startLoad();
  const timeoutPromise = new Promise((resolve) => {
    timeout = setTimeout(() => resolve(timedOut), timeoutMs);
    timeout.unref?.();
  });
  try {
    const result = await Promise.race([catalogLoad.promise, timeoutPromise]);
    if (result === timedOut) {
      const logOnceKey = options?.logOnceKey ?? "session-metadata";
      if (!loggedSlowCatalogKeys.has(logOnceKey)) {
        loggedSlowCatalogKeys.add(logOnceKey);
        context.logGateway.debug(
          `${surface} continuing without model catalog after ${timeoutMs}ms`,
        );
      }
      return;
    }
    return result;
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
/** Loads the gateway model catalog with a short timeout and one-time slow logs. */
async function loadOptionalServerMethodModelCatalog(context, surface, options) {
  return await loadOptionalServerMethodModelCatalogValue(context, surface, options, () =>
    startOptionalServerMethodModelCatalogLoad(context),
  );
}
/** Loads the full gateway model catalog snapshot without blocking the primary response path. */
async function loadOptionalServerMethodModelCatalogSnapshot(context, surface, options) {
  return await loadOptionalServerMethodModelCatalogValue(context, surface, options, () =>
    startOptionalServerMethodModelCatalogSnapshotLoad(context),
  );
}
//#endregion
export {
  loadOptionalServerMethodModelCatalogSnapshot as n,
  startOptionalServerMethodModelCatalogSnapshotLoad as r,
  loadOptionalServerMethodModelCatalog as t,
};
