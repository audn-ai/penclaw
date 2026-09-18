import { t as buildAnthropicCliBackend } from "../../cli-backend-BNe_Tlgu.js";
import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
//#region extensions/anthropic/setup-api.ts
/**
 * Lightweight Anthropic setup entry. It registers Claude CLI backend metadata
 * without loading full provider runtime code.
 */
/** Setup entry for Claude CLI backend registration. */
var setup_api_default = definePluginEntry({
  id: "anthropic",
  name: "Anthropic Setup",
  description: "Lightweight Anthropic setup hooks",
  register(api) {
    api.registerCliBackend(buildAnthropicCliBackend());
  },
});
//#endregion
export { setup_api_default as default };
