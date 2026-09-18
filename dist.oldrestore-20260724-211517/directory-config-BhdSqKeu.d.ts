import { h as DirectoryConfigParams } from "./directory-config-helpers-CTohe1ti.js";
import { u as ChannelDirectoryEntry } from "./types.core-CcwzPNhX.js";
//#region extensions/telegram/src/directory-config.d.ts
declare const listTelegramDirectoryPeersFromConfig: (
  configParams: DirectoryConfigParams,
) => Promise<ChannelDirectoryEntry[]>;
declare const listTelegramDirectoryGroupsFromConfig: (
  configParams: DirectoryConfigParams,
) => Promise<ChannelDirectoryEntry[]>;
//#endregion
export { listTelegramDirectoryPeersFromConfig as n, listTelegramDirectoryGroupsFromConfig as t };
