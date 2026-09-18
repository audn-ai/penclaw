//#region src/plugin-sdk/channel-send-result.ts
/** Attaches the channel id to a single outbound send result. */
function attachChannelToResult(channel, result) {
  return {
    channel,
    ...result,
  };
}
/** Attaches the channel id to each outbound send result in order. */
function attachChannelToResults(channel, results) {
  return results.map((result) => attachChannelToResult(channel, result));
}
/** Creates an empty outbound delivery result for send paths that produced no platform id. */
function createEmptyChannelResult(channel, result = {}) {
  return attachChannelToResult(channel, {
    messageId: "",
    ...result,
  });
}
/** Wraps outbound send methods that already return delivery-shaped results without channel ids. */
function createAttachedChannelResultAdapter(params) {
  return {
    sendText: params.sendText
      ? async (ctx) => attachChannelToResult(params.channel, await params.sendText(ctx))
      : void 0,
    sendMedia: params.sendMedia
      ? async (ctx) => attachChannelToResult(params.channel, await params.sendMedia(ctx))
      : void 0,
    sendPoll: params.sendPoll
      ? async (ctx) => attachChannelToResult(params.channel, await params.sendPoll(ctx))
      : void 0,
  };
}
/** Wraps legacy raw text/media send methods and normalizes their results. */
function createRawChannelSendResultAdapter(params) {
  return {
    sendText: params.sendText
      ? async (ctx) => buildChannelSendResult(params.channel, await params.sendText(ctx))
      : void 0,
    sendMedia: params.sendMedia
      ? async (ctx) => buildChannelSendResult(params.channel, await params.sendMedia(ctx))
      : void 0,
  };
}
/** Normalize raw channel send results into the shape shared outbound callers expect. */
function buildChannelSendResult(channel, result) {
  return {
    channel,
    ok: result.ok,
    messageId: result.messageId ?? "",
    error: result.error ? new Error(result.error) : void 0,
  };
}
//#endregion
export {
  createEmptyChannelResult as a,
  createAttachedChannelResultAdapter as i,
  attachChannelToResults as n,
  createRawChannelSendResultAdapter as o,
  buildChannelSendResult as r,
  attachChannelToResult as t,
};
