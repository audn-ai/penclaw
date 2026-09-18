import { t as TwitchAccountConfig } from "../../types-C3b4EExc.js";
import { t as ChannelPlugin } from "../../types.plugin-BGk2f9vp.js";

//#region extensions/twitch/src/setup-surface.d.ts
type ResolvedTwitchAccount = TwitchAccountConfig & {
  accountId?: string | null;
};
declare const twitchSetupPlugin: ChannelPlugin<ResolvedTwitchAccount>;
//#endregion
export { twitchSetupPlugin };
