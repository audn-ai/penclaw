//#region src/channels/message-access/store-allow-from.ts
/**
 * Read pairing-store allowlist entries when a direct-message policy permits
 * store fallback.
 */
async function readChannelIngressStoreAllowFromForDmPolicy(params) {
  if (params.shouldRead === false || params.dmPolicy === "allowlist" || params.dmPolicy === "open")
    return [];
  return await (
    params.readStore ??
    (async (provider, accountId) => {
      const { readChannelAllowFromStore } = await import("./pairing-store-B9TVFBDD.js");
      return await readChannelAllowFromStore(provider, process.env, accountId);
    })
  )(params.provider, params.accountId).catch(() => []);
}
//#endregion
export { readChannelIngressStoreAllowFromForDmPolicy as t };
