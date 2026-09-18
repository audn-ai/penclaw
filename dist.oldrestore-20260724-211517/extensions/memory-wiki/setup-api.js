import { n as migrateMemoryWikiLegacyConfig } from "../../config-compat-EHJL5WId.js";
import "../../api-DsCwsJvd.js";
import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
//#region extensions/memory-wiki/setup-api.ts
var setup_api_default = definePluginEntry({
  id: "memory-wiki",
  name: "Memory Wiki Setup",
  description: "Lightweight Memory Wiki setup hooks",
  register(api) {
    api.registerConfigMigration((config) => migrateMemoryWikiLegacyConfig(config));
  },
});
//#endregion
export { setup_api_default as default };
