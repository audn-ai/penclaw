import { t as defineBundledChannelEntry } from "../../channel-entry-contract-Cy1kYSbr.js";
import { n as registerReefCliMetadata } from "../../cli-metadata-D7fXoPv3.js";
import { r as createLazyRuntimeModule } from "../../lazy-runtime-B-Fc-m0I.js";
//#region extensions/reef/index.ts
const loadReefCommandsRuntime = createLazyRuntimeModule(() => import("./commands.runtime.js"));
function registerReefFullRuntime(api) {
  api.registerCommand({
    name: "reef",
    description: "Manage Reef friends and owner review approvals",
    acceptsArgs: true,
    requireAuth: true,
    handler: async (params) => {
      const { handleReefCommand } = await loadReefCommandsRuntime();
      return await handleReefCommand(params);
    },
  });
}
var reef_default = defineBundledChannelEntry({
  id: "reef",
  name: "Reef",
  description: "Guarded end-to-end encrypted claw channel",
  importMetaUrl: import.meta.url,
  plugin: {
    specifier: "./channel-plugin-api.js",
    exportName: "reefPlugin",
  },
  outbound: {
    specifier: "./api.js",
    exportName: "reefOutboundAdapter",
  },
  runtime: {
    specifier: "./runtime-api.js",
    exportName: "setReefRuntime",
  },
  registerCliMetadata: registerReefCliMetadata,
  registerFull: registerReefFullRuntime,
});
//#endregion
export { reef_default as default };
