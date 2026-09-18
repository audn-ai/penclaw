import { n as defineBundledChannelSetupEntry } from "../../channel-entry-contract-Cy1kYSbr.js";
//#region extensions/discord/setup-entry.ts
var setup_entry_default = defineBundledChannelSetupEntry({
  importMetaUrl: import.meta.url,
  features: { legacyStateMigrations: true },
  plugin: {
    specifier: "./setup-plugin-api.js",
    exportName: "discordSetupPlugin",
  },
  legacyStateMigrations: {
    specifier: "./legacy-state-migrations-api.js",
    exportName: "detectDiscordLegacyStateMigrations",
  },
});
//#endregion
export { setup_entry_default as default };
