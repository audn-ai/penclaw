//#region packages/media-understanding-common/src/provider-id.ts
/** Normalize a provider id for comparison. */
function normalizeProviderId(provider) {
  return provider.trim().toLowerCase();
}
/** Normalize provider aliases to canonical config provider ids. */
function normalizeMediaProviderId(id) {
  const normalized = normalizeProviderId(id);
  if (normalized === "gemini") return "google";
  if (normalized === "minimax-cn") return "minimax";
  if (normalized === "minimax-portal-cn") return "minimax-portal";
  return normalized;
}
/** Normalize provider ids while preserving execution-specific regional aliases. */
function normalizeMediaExecutionProviderId(id) {
  const normalized = normalizeProviderId(id);
  if (normalized === "minimax-cn" || normalized === "minimax-portal-cn") return normalized;
  return normalizeMediaProviderId(normalized);
}
//#endregion
export { normalizeMediaProviderId as n, normalizeMediaExecutionProviderId as t };
