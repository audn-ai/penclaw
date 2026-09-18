import { t as buildXaiWebSearchProviderBase } from "../../web-search-provider-shared-CgD45KIN.js";
//#region extensions/xai/web-search-contract-api.ts
function createXaiWebSearchProvider() {
  return {
    ...buildXaiWebSearchProviderBase(),
    createTool: () => null,
  };
}
//#endregion
export { createXaiWebSearchProvider };
