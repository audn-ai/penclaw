import "./read-only-account-inspect-CqkOfkZb.js";
//#region src/channels/plugins/directory-adapters.ts
const nullChannelDirectorySelf = async () => null;
const emptyChannelDirectoryList = async () => [];
/** Build a channel directory adapter with a null self resolver by default. */
function createChannelDirectoryAdapter(params = {}) {
  return {
    self: params.self ?? nullChannelDirectorySelf,
    ...params,
  };
}
/** Build the common empty directory surface for channels without directory support. */
function createEmptyChannelDirectoryAdapter() {
  return createChannelDirectoryAdapter({
    listPeers: emptyChannelDirectoryList,
    listGroups: emptyChannelDirectoryList,
  });
}
//#endregion
//#region src/plugin-sdk/directory-runtime.ts
function resolveDirectoryAllowlistEntries(params) {
  return params.entries.map((input) => {
    const parsed = params.parseInput(input);
    if (parsed.id)
      return params.buildIdResolved({
        input,
        parsed,
        match: params.findById(params.lookup, parsed.id),
      });
    return (
      params.resolveNonId({
        input,
        parsed,
        lookup: params.lookup,
      }) ?? params.buildUnresolved(input)
    );
  });
}
//#endregion
export {
  nullChannelDirectorySelf as a,
  emptyChannelDirectoryList as i,
  createChannelDirectoryAdapter as n,
  createEmptyChannelDirectoryAdapter as r,
  resolveDirectoryAllowlistEntries as t,
};
