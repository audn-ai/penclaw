import { t as createMessageReceiptFromOutboundResults } from "./receipt-C0uxiauk.js";
import "./channel-outbound-DlkFd7rO.js";
//#region extensions/discord/src/send.receipt.ts
function createDiscordSendReceipt(params) {
  return createMessageReceiptFromOutboundResults({
    results: params.platformMessageIds
      .map((messageId) => messageId.trim())
      .filter((messageId) => messageId && messageId !== "unknown")
      .map((messageId, index) => {
        const result = {
          channel: "discord",
          messageId,
        };
        if (params.channelId) result.channelId = params.channelId;
        if (params.reply?.scope === "first" && index === 0) {
          const rawResult = {
            channel: "discord",
            messageId,
          };
          if (params.channelId) rawResult.channelId = params.channelId;
          result.receipt = createMessageReceiptFromOutboundResults({
            results: [rawResult],
            kind: params.kind,
            threadId: params.threadId,
            replyToId: params.reply.messageId,
          });
        }
        return result;
      }),
    kind: params.kind,
    threadId: params.threadId,
    replyToId: params.reply?.scope === "all" ? params.reply.messageId : void 0,
  });
}
function createDiscordSendResult(params) {
  const messageId = params.result.id || "unknown";
  const channelId = params.result.channel_id ?? params.fallbackChannelId;
  const receiptParams = {
    platformMessageIds: params.result.platformMessageIds?.length
      ? params.result.platformMessageIds
      : [messageId],
    channelId,
    kind: params.kind,
  };
  if (params.threadId != null) receiptParams.threadId = String(params.threadId);
  if (params.reply) receiptParams.reply = params.reply;
  return {
    messageId,
    channelId,
    receipt: createDiscordSendReceipt(receiptParams),
  };
}
//#endregion
export { createDiscordSendResult as n, createDiscordSendReceipt as t };
