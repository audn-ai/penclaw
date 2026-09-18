import { t as ResolvedRaftAccount } from "../../accounts-1EWGbFDJ.js";
import { t as ChannelPlugin } from "../../types.plugin-BGk2f9vp.js";

//#region extensions/raft/src/channel.d.ts
type RaftProbe = {
  cliFound: boolean;
};
declare const raftPlugin: ChannelPlugin<ResolvedRaftAccount, RaftProbe>;
//#endregion
export { raftPlugin };
