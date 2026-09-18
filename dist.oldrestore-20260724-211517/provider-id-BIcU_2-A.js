import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region packages/model-catalog-core/src/provider-id.ts
function normalizeProviderId(provider) {
  return normalizeLowercaseStringOrEmpty(provider);
}
/** Normalize provider ID before manifest-owned auth alias lookup. */
function normalizeProviderIdForAuth(provider) {
  return normalizeProviderId(provider);
}
function findNormalizedProviderValue(entries, provider) {
  if (!entries) return;
  const providerKey = normalizeProviderId(provider);
  for (const [key, value] of Object.entries(entries))
    if (normalizeProviderId(key) === providerKey) return value;
}
function findNormalizedProviderKey(entries, provider) {
  if (!entries) return;
  const providerKey = normalizeProviderId(provider);
  return Object.keys(entries).find((key) => normalizeProviderId(key) === providerKey);
}
//#endregion
export {
  normalizeProviderIdForAuth as i,
  findNormalizedProviderValue as n,
  normalizeProviderId as r,
  findNormalizedProviderKey as t,
};
