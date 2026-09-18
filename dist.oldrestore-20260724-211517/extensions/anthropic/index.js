import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
import { n as registerAnthropicPlugin } from "../../register.runtime-DXH9FXgM.js";
//#region extensions/anthropic/index.ts
/**
 * Anthropic provider plugin entry. It registers Claude API auth, Claude CLI
 * backend support, native session catalogs, media understanding, stream
 * wrappers, and usage reporting.
 */
/** Provider entry for Anthropic API, Claude CLI, and native session surfaces. */
var anthropic_default = definePluginEntry({
  id: "anthropic",
  name: "Anthropic",
  description: "Anthropic models, Claude CLI, and native Claude session catalog",
  register(api) {
    return registerAnthropicPlugin(api);
  },
});
//#endregion
export { anthropic_default as default };
