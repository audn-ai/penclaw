import { t as TwitchAccountConfig } from "./types-C3b4EExc.js";
import { t as ChannelPlugin } from "./types.plugin-BGk2f9vp.js";

//#region extensions/twitch/src/plugin.d.ts
type ResolvedTwitchAccount = TwitchAccountConfig & {
  accountId?: string | null;
};
/**
 * Twitch channel plugin.
 *
 * Implements the ChannelPlugin interface to provide Twitch chat integration
 * for OpenClaw. Supports message sending, receiving, access control, and
 * status monitoring.
 */
declare const twitchPlugin: ChannelPlugin<ResolvedTwitchAccount>;
//#endregion
export { twitchPlugin as t };
