import { n as defineBundledChannelSetupEntry } from "../../channel-entry-contract-Cy1kYSbr.js";
//#region extensions/reef/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
  importMetaUrl: import.meta.url,
  plugin: {
    specifier: "./channel-plugin-api.js",
    exportName: "reefPlugin",
  },
  runtime: {
    specifier: "./runtime-api.js",
    exportName: "setReefRuntime",
  },
});
//#endregion
export { setup_entry_default as default };
