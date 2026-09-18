import { t as VOLCENGINE_PROVIDER_CATALOG_ENTRIES } from "../../provider-catalog-DXl-K4n8.js";
//#region extensions/volcengine/provider-discovery.ts
const volcengineProviderDiscovery = VOLCENGINE_PROVIDER_CATALOG_ENTRIES.map(
  ({ id, label, buildProvider }) => ({
    id,
    label,
    docsPath: "/providers/models",
    auth: [],
    staticCatalog: {
      order: "simple",
      run: async () => ({ provider: buildProvider() }),
    },
  }),
);
//#endregion
export { volcengineProviderDiscovery as default };
