import {
  c as normalizePluginsConfig,
  l as resolveEffectiveEnableState,
} from "./config-state-C1Qyxaws.js";
import {
  n as loadOpenClawProviderIndex,
  t as planProviderIndexModelCatalogRows,
} from "./model-catalog-Djtgv3Hv.js";
import { r as normalizeModelCatalogProviderId } from "./model-catalog-refs-BcuK-xC3.js";
//#region src/commands/models/list.provider-index-catalog.ts
/** Provider-index-backed model catalog rows for bundled model-list output. */
/** Loads enabled bundled provider-index catalog rows, optionally scoped by provider. */
function loadProviderIndexCatalogRowsForList(params) {
  const providerFilter = params.providerFilter
    ? normalizeModelCatalogProviderId(params.providerFilter)
    : void 0;
  return planProviderIndexModelCatalogRows({
    index: loadOpenClawProviderIndex(),
    ...(providerFilter ? { providerFilter } : {}),
  })
    .entries.filter(
      (entry) =>
        resolveEffectiveEnableState({
          id: entry.pluginId,
          origin: "bundled",
          config: normalizePluginsConfig(params.cfg.plugins),
          rootConfig: params.cfg,
          enabledByDefault: true,
        }).enabled,
    )
    .flatMap((entry) => entry.rows);
}
//#endregion
export { loadProviderIndexCatalogRowsForList };
