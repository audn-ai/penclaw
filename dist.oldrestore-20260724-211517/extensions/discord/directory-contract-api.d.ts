import {
  n as listDiscordDirectoryPeersFromConfig,
  t as listDiscordDirectoryGroupsFromConfig,
} from "../../directory-config-AQxLwG6y.js";
import { h as DirectoryConfigParams } from "../../directory-config-helpers-CTohe1ti.js";
import { u as ChannelDirectoryEntry } from "../../types.core-CcwzPNhX.js";
//#region extensions/discord/directory-contract-api.d.ts
declare const discordDirectoryContractPlugin: {
  id: string;
  directory: {
    listPeers: (configParams: DirectoryConfigParams) => Promise<ChannelDirectoryEntry[]>;
    listGroups: (configParams: DirectoryConfigParams) => Promise<ChannelDirectoryEntry[]>;
  };
};
//#endregion
export {
  discordDirectoryContractPlugin,
  listDiscordDirectoryGroupsFromConfig,
  listDiscordDirectoryPeersFromConfig,
};
