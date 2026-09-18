import { t as modelCatalog } from "./openclaw.plugin-DCwRmEwB.js";
import { n as buildManifestModelProviderConfig } from "./provider-catalog-shared-CQScmZZs.js";
//#region extensions/together/provider-catalog.ts
function buildTogetherProvider() {
  return buildManifestModelProviderConfig({
    providerId: "together",
    catalog: modelCatalog.providers.together,
  });
}
//#endregion
export { buildTogetherProvider as t };
