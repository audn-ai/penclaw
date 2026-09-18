import { t as enablePluginInConfig } from "./provider-enable-config--LAE2cxh.js";
import { t as createBaseWebSearchProviderContractFields } from "./provider-web-search-contract-fields-BeVWaRlO.js";
//#region src/plugin-sdk/provider-web-search-contract.ts
/** Build the public web-search provider hooks, including optional selection-time plugin enabling. */
function createWebSearchProviderContractFields(options) {
  const selectionPluginId = options.selectionPluginId;
  return {
    ...createBaseWebSearchProviderContractFields(options),
    ...(selectionPluginId
      ? { applySelectionConfig: (config) => enablePluginInConfig(config, selectionPluginId).config }
      : {}),
  };
}
//#endregion
export { createWebSearchProviderContractFields as t };
