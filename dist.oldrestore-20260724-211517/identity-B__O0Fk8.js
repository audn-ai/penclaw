import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/agents/auth-profiles/identity.ts
/**
 * Auth profile id and display metadata helpers.
 * Keeps profile id construction and human metadata lookup centralized for auth
 * status, storage, and provider selection.
 */
function resolveStoredMetadata(store, profileId) {
  const profile = store?.profiles[profileId];
  if (!profile) return {};
  return {
    displayName: "displayName" in profile ? normalizeOptionalString(profile.displayName) : void 0,
    email: "email" in profile ? normalizeOptionalString(profile.email) : void 0,
  };
}
/** Builds a provider-prefixed auth profile id. */
function buildAuthProfileId(params) {
  return `${normalizeOptionalString(params.profilePrefix) ?? params.providerId}:${normalizeOptionalString(params.profileName) ?? "default"}`;
}
/** Resolves display metadata for an auth profile from config/store. */
function resolveAuthProfileMetadata(params) {
  const configured = params.cfg?.auth?.profiles?.[params.profileId];
  const stored = resolveStoredMetadata(params.store, params.profileId);
  return {
    displayName: normalizeOptionalString(configured?.displayName) ?? stored.displayName,
    email: normalizeOptionalString(configured?.email) ?? stored.email,
  };
}
//#endregion
export { resolveAuthProfileMetadata as n, buildAuthProfileId as t };
