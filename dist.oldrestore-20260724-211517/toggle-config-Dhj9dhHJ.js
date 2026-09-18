import { r as normalizeChatChannelId } from "./ids-lBaN9yr4.js";
//#region src/plugins/toggle-config.ts
/** Returns config with a plugin enabled/disabled and optional built-in channel state synced. */
function setPluginEnabledInConfig(config, pluginId, enabled, options = {}) {
  const builtInChannelId = normalizeChatChannelId(pluginId);
  const resolvedId = builtInChannelId ?? pluginId;
  const next = {
    ...config,
    plugins: {
      ...config.plugins,
      entries: {
        ...config.plugins?.entries,
        [resolvedId]: {
          ...config.plugins?.entries?.[resolvedId],
          enabled,
        },
      },
    },
  };
  if (!builtInChannelId || options.updateChannelConfig === false) return next;
  const existing = config.channels?.[builtInChannelId];
  const existingRecord =
    existing && typeof existing === "object" && !Array.isArray(existing) ? existing : {};
  return {
    ...next,
    channels: {
      ...config.channels,
      [builtInChannelId]: {
        ...existingRecord,
        enabled,
      },
    },
  };
}
//#endregion
export { setPluginEnabledInConfig as t };
