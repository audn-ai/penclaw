import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
import { o as isRecord } from "../../record-coerce-DHZ4bFlT.js";
import "../../tool-config-shared-B7vucu2o.js";
//#region extensions/xai/setup-api.ts
var setup_api_default = definePluginEntry({
  id: "xai",
  name: "xAI Setup",
  description: "Lightweight xAI setup hooks",
  register(api) {
    api.registerAutoEnableProbe(({ config }) => {
      const pluginConfig = config.plugins?.entries?.xai?.config;
      const web = config.tools?.web;
      if (
        isRecord(web?.x_search) ||
        (isRecord(pluginConfig) &&
          (isRecord(pluginConfig.xSearch) || isRecord(pluginConfig.codeExecution)))
      )
        return "xai tool configured";
      return null;
    });
  },
});
//#endregion
export { setup_api_default as default };
