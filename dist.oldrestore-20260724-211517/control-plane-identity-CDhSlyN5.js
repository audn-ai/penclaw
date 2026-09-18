//#region src/gateway/control-plane-identity.ts
/** Normalizes an optional control-plane identity field without creating empty keys. */
function normalizeControlPlaneIdentityPart(value, fallback) {
  if (typeof value !== "string") return fallback;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : fallback;
}
//#endregion
export { normalizeControlPlaneIdentityPart as t };
