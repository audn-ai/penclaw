//#region src/agents/image-sanitization.ts
const DEFAULT_IMAGE_MAX_DIMENSION_PX = 1200;
const DEFAULT_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
/** Resolve configured image sanitization limits for agent payloads. */
function resolveImageSanitizationLimits(cfg) {
  const configured = cfg?.agents?.defaults?.imageMaxDimensionPx;
  if (typeof configured !== "number" || !Number.isFinite(configured)) return {};
  return { maxDimensionPx: Math.max(1, Math.floor(configured)) };
}
//#endregion
export {
  DEFAULT_IMAGE_MAX_DIMENSION_PX as n,
  resolveImageSanitizationLimits as r,
  DEFAULT_IMAGE_MAX_BYTES as t,
};
