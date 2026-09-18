import { n as buildStaticOpencodeZenProviderConfig } from "../../provider-catalog-CJqi6KRt.js";
//#region extensions/opencode/provider-discovery.ts
const opencodeProviderDiscovery = {
  id: "opencode",
  label: "OpenCode Zen",
  docsPath: "/providers/models",
  auth: [],
  staticCatalog: {
    order: "simple",
    run: async () => ({ provider: buildStaticOpencodeZenProviderConfig() }),
  },
};
//#endregion
export { opencodeProviderDiscovery as default };
