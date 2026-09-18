//#region src/config/plugins-allowlist.ts
/** Return a config copy with `pluginId` appended to an existing restrictive plugin allowlist. */
function ensurePluginAllowlisted(cfg, pluginId) {
  const allow = cfg.plugins?.allow;
  if (!Array.isArray(allow) || allow.includes(pluginId)) return cfg;
  return {
    ...cfg,
    plugins: {
      ...cfg.plugins,
      allow: [...allow, pluginId],
    },
  };
}
//#endregion
export { ensurePluginAllowlisted as t };
