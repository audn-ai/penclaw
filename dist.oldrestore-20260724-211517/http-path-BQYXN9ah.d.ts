//#region src/plugins/http-path.d.ts
/** Normalizes plugin HTTP paths to leading-slash form with optional fallback. */
declare function normalizePluginHttpPath(
  path?: string | null,
  fallback?: string | null,
): string | null;
//#endregion
export { normalizePluginHttpPath as t };
