//#region src/plugins/plugin-origin.types.d.ts
/** Origin class for plugin discovery and runtime trust decisions. */
type PluginOrigin = "bundled" | "global" | "workspace" | "config";
//#endregion
export { PluginOrigin as t };
