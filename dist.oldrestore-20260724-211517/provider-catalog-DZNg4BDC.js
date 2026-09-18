import {
  i as BYTEPLUS_MODEL_CATALOG,
  o as modelCatalog,
  r as BYTEPLUS_CODING_MODEL_CATALOG,
} from "./models-CNkYpjxc.js";
import { n as buildManifestModelProviderConfig } from "./provider-catalog-shared-CQScmZZs.js";
//#region extensions/byteplus/provider-catalog.ts
/**
 * BytePlus model provider builders backed by the plugin manifest catalog.
 */
/** Builds the standard BytePlus model provider config. */
function buildBytePlusProvider() {
  return buildManifestModelProviderConfig({
    providerId: "byteplus",
    catalog: modelCatalog.providers.byteplus,
  });
}
/** Builds the BytePlus Plan coding-provider config. */
function buildBytePlusCodingProvider() {
  return buildManifestModelProviderConfig({
    providerId: "byteplus-plan",
    catalog: modelCatalog.providers["byteplus-plan"],
  });
}
const BYTEPLUS_PROVIDER_CATALOG_ENTRIES = [
  {
    id: "byteplus",
    label: "BytePlus",
    models: BYTEPLUS_MODEL_CATALOG,
    buildProvider: buildBytePlusProvider,
  },
  {
    id: "byteplus-plan",
    label: "BytePlus Plan",
    models: BYTEPLUS_CODING_MODEL_CATALOG,
    buildProvider: buildBytePlusCodingProvider,
  },
];
//#endregion
export {
  buildBytePlusCodingProvider as n,
  buildBytePlusProvider as r,
  BYTEPLUS_PROVIDER_CATALOG_ENTRIES as t,
};
