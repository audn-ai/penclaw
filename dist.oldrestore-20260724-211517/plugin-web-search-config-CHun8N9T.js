import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
//#region src/config/plugin-web-search-config.ts
/** Resolve a plugin-owned `config.webSearch` object without interpreting provider fields. */
function resolvePluginWebSearchConfig(config, pluginId) {
  const pluginConfig = config?.plugins?.entries?.[pluginId]?.config;
  if (!isRecord(pluginConfig)) return;
  return isRecord(pluginConfig.webSearch) ? pluginConfig.webSearch : void 0;
}
//#endregion
export { resolvePluginWebSearchConfig as t };
