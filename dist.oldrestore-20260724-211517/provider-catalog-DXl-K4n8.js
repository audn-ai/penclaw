import {
  i as DOUBAO_MODEL_CATALOG,
  o as modelCatalog,
  r as DOUBAO_CODING_MODEL_CATALOG,
} from "./models-BABzHN6w.js";
import { n as buildManifestModelProviderConfig } from "./provider-catalog-shared-CQScmZZs.js";
//#region extensions/volcengine/provider-catalog.ts
function buildDoubaoProvider() {
  return buildManifestModelProviderConfig({
    providerId: "volcengine",
    catalog: modelCatalog.providers.volcengine,
  });
}
function buildDoubaoCodingProvider() {
  return buildManifestModelProviderConfig({
    providerId: "volcengine-plan",
    catalog: modelCatalog.providers["volcengine-plan"],
  });
}
const VOLCENGINE_PROVIDER_CATALOG_ENTRIES = [
  {
    id: "volcengine",
    label: "Volcengine",
    models: DOUBAO_MODEL_CATALOG,
    buildProvider: buildDoubaoProvider,
  },
  {
    id: "volcengine-plan",
    label: "Volcengine Plan",
    models: DOUBAO_CODING_MODEL_CATALOG,
    buildProvider: buildDoubaoCodingProvider,
  },
];
//#endregion
export {
  buildDoubaoCodingProvider as n,
  buildDoubaoProvider as r,
  VOLCENGINE_PROVIDER_CATALOG_ENTRIES as t,
};
