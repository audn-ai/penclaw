import { t as ChatChannelId } from "../ids-BUiVO67E.js";

//#region src/plugin-sdk/chat-channel-ids.d.ts
/** Bundled chat-channel ids from the official channel catalog. */
declare const BUNDLED_CHAT_CHANNEL_IDS: readonly string[];
/**
 * Channel ids, labels, and aliases that can appear as inbound-envelope prefixes.
 * Consumers should use this for envelope cleanup instead of hardcoding channel names.
 */
declare const BUNDLED_CHAT_CHANNEL_ENVELOPE_PREFIXES: readonly string[];
//#endregion
export { BUNDLED_CHAT_CHANNEL_ENVELOPE_PREFIXES, BUNDLED_CHAT_CHANNEL_IDS, type ChatChannelId };
