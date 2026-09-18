import { t as discordMessageActions } from "./channel-actions-EEedLCYB.js";
import { f as sendMessageDiscord } from "./send-RMvhEWbl.js";
import { cr as PluginRuntime } from "./types-Ga3mNO_F.js";

//#region extensions/discord/src/runtime.d.ts
type DiscordChannelRuntime = {
  messageActions?: typeof discordMessageActions;
  sendMessageDiscord?: typeof sendMessageDiscord;
};
type DiscordRuntime = PluginRuntime & {
  channel: PluginRuntime["channel"] & {
    discord?: DiscordChannelRuntime;
  };
};
declare const setDiscordRuntime: (next: DiscordRuntime) => void,
  getOptionalDiscordRuntime: () => DiscordRuntime | null,
  getDiscordRuntime: () => DiscordRuntime;
//#endregion
export { setDiscordRuntime as t };
