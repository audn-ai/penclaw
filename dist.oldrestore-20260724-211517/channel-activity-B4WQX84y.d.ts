import { t as ChannelId } from "./channel-id.types-DjYEl-_2.js";

//#region src/infra/channel-activity.d.ts
/** Direction of the last observed activity for a channel/account pair. */
type ChannelDirection = "inbound" | "outbound";
type ActivityEntry = {
  inboundAt: number | null;
  outboundAt: number | null;
};
/** Records the latest inbound or outbound activity timestamp for a channel/account. */
declare function recordChannelActivity(params: {
  channel: ChannelId;
  accountId?: string | null;
  direction: ChannelDirection;
  at?: number;
}): void;
/** Returns the latest known inbound/outbound activity timestamps for a channel/account. */
declare function getChannelActivity(params: {
  channel: ChannelId;
  accountId?: string | null;
}): ActivityEntry;
/** Clears all tracked channel activity; test-only helper. */
declare function resetChannelActivityForTest(): void;
//#endregion
export {
  resetChannelActivityForTest as i,
  getChannelActivity as n,
  recordChannelActivity as r,
  ChannelDirection as t,
};
