import { t as ensurePluginAllowlisted } from "./plugins-allowlist-DGbUrepm.js";
//#region src/plugin-sdk/provider-enable-config.ts
/**
 * Enables provider plugins for provider contract setup without applying channel
 * normalization from the core plugin enable path.
 */
function enablePluginInConfig(cfg, pluginId) {
  if (cfg.plugins?.enabled === false)
    return {
      config: cfg,
      enabled: false,
      reason: "plugins disabled",
    };
  if (cfg.plugins?.deny?.includes(pluginId))
    return {
      config: cfg,
      enabled: false,
      reason: "blocked by denylist",
    };
  let next = {
    ...cfg,
    plugins: {
      ...cfg.plugins,
      entries: {
        ...cfg.plugins?.entries,
        [pluginId]: {
          ...cfg.plugins?.entries?.[pluginId],
          enabled: true,
        },
      },
    },
  };
  next = ensurePluginAllowlisted(next, pluginId);
  return {
    config: next,
    enabled: true,
  };
}
//#endregion
export { enablePluginInConfig as t };
