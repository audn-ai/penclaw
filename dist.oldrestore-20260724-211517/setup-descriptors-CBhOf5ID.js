import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
//#region src/plugins/setup-descriptors.ts
/** Lists setup provider ids and auth aliases owned by one plugin manifest. */
function listSetupProviderIds(record) {
  const providerIds = record.setup?.providers?.map((entry) => entry.id) ?? record.providers;
  const normalizedProviderIds = new Set(providerIds.map(normalizeProviderId));
  const aliases = Object.entries(record.providerAuthAliases ?? {})
    .filter(([, target]) => normalizedProviderIds.has(normalizeProviderId(target)))
    .map(([alias]) => alias);
  return [...providerIds, ...aliases];
}
/** Lists setup CLI backend ids from setup metadata or manifest contribution ids. */
function listSetupCliBackendIds(record) {
  return record.setup?.cliBackends ?? record.cliBackends;
}
//#endregion
export { listSetupProviderIds as n, listSetupCliBackendIds as t };
