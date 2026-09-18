import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-RaEzqkSo.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
//#region src/agents/auth-profiles/profile-list.ts
/**
 * Auth profile list helpers.
 * Provides provider-compatible profile lookup and stable de-duplication used by
 * ordering, repair, and profile mutation paths.
 */
/** Deduplicates profile ids while preserving first-seen order. */
function dedupeProfileIds(profileIds) {
  return uniqueStrings(profileIds);
}
/** Lists auth profile ids whose credential provider matches the requested provider. */
function listProfilesForProvider(store, provider) {
  const providerKey = resolveProviderIdForAuth(provider);
  return Object.entries(store.profiles)
    .filter(([, cred]) => resolveProviderIdForAuth(cred.provider) === providerKey)
    .map(([id]) => id);
}
function resolveSubscriptionAuthModeForProfiles(params) {
  for (const profileId of params.profileIds) {
    const type = profileId ? params.store.profiles[profileId]?.type : void 0;
    if (type === "oauth" || type === "token") return type;
  }
}
//#endregion
export {
  listProfilesForProvider as n,
  resolveSubscriptionAuthModeForProfiles as r,
  dedupeProfileIds as t,
};
