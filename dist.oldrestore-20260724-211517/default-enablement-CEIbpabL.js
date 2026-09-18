//#region src/plugins/default-enablement.ts
/** True when a plugin should be enabled by default for a platform. */
function isPluginEnabledByDefaultForPlatform(plugin, platform = process.platform) {
  if (plugin.enabledByDefault === true) return true;
  return plugin.enabledByDefaultOnPlatforms?.includes(platform) === true;
}
//#endregion
export { isPluginEnabledByDefaultForPlatform as t };
