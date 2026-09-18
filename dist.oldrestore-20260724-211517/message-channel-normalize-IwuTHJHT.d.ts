//#region src/utils/message-channel-normalize.d.ts
type ChannelId = string & {
  readonly __openclawChannelIdBrand?: never;
};
/** Channel id that can receive outbound messages from the Gateway. */
type DeliverableMessageChannel = ChannelId;
/** Channel id accepted by Gateway protocol routing, including internal webchat. */
type GatewayMessageChannel = DeliverableMessageChannel;
/** Normalizes built-in, plugin, and alias channel names to their canonical id. */
declare function normalizeMessageChannel(raw?: string | null): string | undefined;
/** Normalizes and validates a raw channel value for Gateway routing. */
declare function resolveGatewayMessageChannel(
  raw?: string | null,
): GatewayMessageChannel | undefined;
//#endregion
export {
  resolveGatewayMessageChannel as i,
  GatewayMessageChannel as n,
  normalizeMessageChannel as r,
  DeliverableMessageChannel as t,
};
