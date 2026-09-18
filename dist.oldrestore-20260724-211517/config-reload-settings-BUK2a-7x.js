//#region src/gateway/config-reload-settings.ts
const DEFAULT_RELOAD_SETTINGS = {
  mode: "hybrid",
  debounceMs: 300,
};
/** Resolves gateway reload mode/debounce from config with bounded defaults. */
function resolveGatewayReloadSettings(cfg) {
  const rawMode = cfg.gateway?.reload?.mode;
  const mode =
    rawMode === "off" || rawMode === "restart" || rawMode === "hot" || rawMode === "hybrid"
      ? rawMode
      : DEFAULT_RELOAD_SETTINGS.mode;
  const debounceRaw = cfg.gateway?.reload?.debounceMs;
  return {
    mode,
    debounceMs:
      typeof debounceRaw === "number" && Number.isFinite(debounceRaw)
        ? Math.max(0, Math.floor(debounceRaw))
        : DEFAULT_RELOAD_SETTINGS.debounceMs,
  };
}
//#endregion
export { resolveGatewayReloadSettings as t };
