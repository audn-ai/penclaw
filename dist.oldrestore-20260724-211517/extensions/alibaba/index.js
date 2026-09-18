import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
import { t as buildAlibabaVideoGenerationProvider } from "../../video-generation-provider-De3BdkI1.js";
//#region extensions/alibaba/index.ts
/**
 * Alibaba Model Studio plugin entry. Registers the DashScope-backed video
 * generation provider.
 */
var alibaba_default = definePluginEntry({
  id: "alibaba",
  name: "Alibaba Model Studio Plugin",
  description: "Bundled Alibaba Model Studio video provider plugin",
  register(api) {
    api.registerVideoGenerationProvider(buildAlibabaVideoGenerationProvider());
  },
});
//#endregion
export { alibaba_default as default };
