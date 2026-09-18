//#region src/cli/root-help-live-config.ts
function hasEntries(value) {
  return value !== void 0 && Object.keys(value).length > 0;
}
function hasListEntries(value) {
  return Array.isArray(value) && value.length > 0;
}
/** Load render options only when config/env can affect plugin help output. */
async function loadRootHelpRenderOptionsForConfigSensitivePlugins(env = process.env) {
  const snapshot = await (
    await import("./config/config.js")
  ).readConfigFileSnapshot({
    observe: false,
    skipPluginValidation: true,
  });
  if (!snapshot.valid) return null;
  const plugins = snapshot.sourceConfig.plugins;
  const configAffectsPluginHelp =
    plugins &&
    (plugins.enabled === false ||
      hasListEntries(plugins.allow) ||
      hasListEntries(plugins.deny) ||
      hasListEntries(plugins.load?.paths) ||
      hasEntries(plugins.slots) ||
      hasEntries(plugins.entries) ||
      hasEntries(plugins.installs));
  if (
    !Boolean(
      env.OPENCLAW_BUNDLED_PLUGINS_DIR?.trim() || env.OPENCLAW_DISABLE_BUNDLED_PLUGINS?.trim(),
    ) &&
    !configAffectsPluginHelp
  )
    return null;
  return {
    config: snapshot.runtimeConfig,
    env,
  };
}
//#endregion
export { loadRootHelpRenderOptionsForConfigSensitivePlugins };
