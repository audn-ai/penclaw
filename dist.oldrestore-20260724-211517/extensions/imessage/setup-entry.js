import { n as defineBundledChannelSetupEntry } from "../../channel-entry-contract-Cy1kYSbr.js";
//#region extensions/imessage/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
  importMetaUrl: import.meta.url,
  features: { legacyStateMigrations: true },
  plugin: {
    specifier: "./api.js",
    exportName: "imessageSetupPlugin",
  },
  legacyStateMigrations: {
    specifier: "./legacy-state-migrations-api.js",
    exportName: "detectIMessageLegacyStateMigrations",
  },
});
//#endregion
export { setup_entry_default as default };
