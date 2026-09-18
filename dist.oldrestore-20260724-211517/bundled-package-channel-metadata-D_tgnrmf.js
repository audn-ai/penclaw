import { t as listChannelCatalogEntries } from "./channel-catalog-registry-nHtompjW.js";
//#region src/plugins/bundled-package-channel-metadata.ts
/** Lists channel metadata contributed by bundled package manifests. */
function listBundledPackageChannelMetadata() {
  return listChannelCatalogEntries({ origin: "bundled" }).map((entry) => entry.channel);
}
/** Finds bundled package channel metadata by id or alias. */
function findBundledPackageChannelMetadata(channelId) {
  return listBundledPackageChannelMetadata().find(
    (channel) => channel.id === channelId || channel.aliases?.includes(channelId),
  );
}
//#endregion
export { listBundledPackageChannelMetadata as n, findBundledPackageChannelMetadata as t };
