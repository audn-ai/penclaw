import { t as ChatChannelId } from "./ids-BUiVO67E.js";

//#region src/channels/plugins/channel-id.types.d.ts
/**
 * Channel id accepted by plugin helpers, covering built-in chat ids and external plugin ids.
 */
type ChannelId = ChatChannelId | (string & {});
//#endregion
export { ChannelId as t };
