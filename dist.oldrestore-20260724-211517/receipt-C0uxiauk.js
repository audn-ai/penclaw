import { p as normalizeUniqueStringEntries } from "./string-normalization-CRyoFBPt.js";
//#region src/channels/message/receipt.ts
/**
 * Channel message receipt normalization.
 *
 * Builds stable receipts from platform send results and nested adapter receipt data.
 */
function resolveReceiptMessageId(result) {
  return (
    result.messageId ||
    result.chatId ||
    result.channelId ||
    result.roomId ||
    result.conversationId ||
    result.toJid ||
    result.pollId
  );
}
function hasNestedReceiptData(receipt) {
  return Boolean(
    receipt &&
    (receipt.parts.length > 0 ||
      receipt.platformMessageIds.length > 0 ||
      receipt.primaryPlatformMessageId),
  );
}
function appendUnique(values, value) {
  const normalized = value?.trim();
  if (normalized && !values.includes(normalized)) values.push(normalized);
}
/** Builds one normalized receipt from platform send results or nested adapter receipts. */
function createMessageReceiptFromOutboundResults(params) {
  const parts = params.results.flatMap((result, resultIndex) => {
    if (hasNestedReceiptData(result.receipt)) {
      if (result.receipt.parts.length === 0)
        return result.receipt.platformMessageIds.map((platformMessageId, partIndex) => ({
          platformMessageId,
          kind: params.kind ?? "unknown",
          index: partIndex,
          ...(params.threadId ? { threadId: params.threadId } : {}),
          ...(params.replyToId ? { replyToId: params.replyToId } : {}),
        }));
      const hasPartReplyMetadata = result.receipt.parts.some((part) => part.replyToId);
      return result.receipt.parts.map((part, partIndex) => ({
        ...part,
        index: part.index ?? partIndex,
        ...(part.threadId || !params.threadId ? {} : { threadId: params.threadId }),
        ...(part.replyToId || !params.replyToId || hasPartReplyMetadata
          ? {}
          : { replyToId: params.replyToId }),
      }));
    }
    const platformMessageId = resolveReceiptMessageId(result);
    if (!platformMessageId) return [];
    return [
      {
        platformMessageId,
        kind: params.kind ?? "unknown",
        index: resultIndex,
        ...(params.threadId ? { threadId: params.threadId } : {}),
        ...(params.replyToId ? { replyToId: params.replyToId } : {}),
        raw: result,
      },
    ];
  });
  const platformMessageIds = [];
  for (const result of params.results) {
    if (hasNestedReceiptData(result.receipt)) {
      appendUnique(platformMessageIds, result.receipt.primaryPlatformMessageId);
      for (const platformMessageId of result.receipt.platformMessageIds)
        appendUnique(platformMessageIds, platformMessageId);
      for (const part of result.receipt.parts)
        appendUnique(platformMessageIds, part.platformMessageId);
      continue;
    }
    appendUnique(platformMessageIds, resolveReceiptMessageId(result));
  }
  const firstNestedReceipt = params.results.find((result) =>
    hasNestedReceiptData(result.receipt),
  )?.receipt;
  return {
    ...(platformMessageIds[0] ? { primaryPlatformMessageId: platformMessageIds[0] } : {}),
    platformMessageIds,
    parts,
    ...((params.threadId ?? firstNestedReceipt?.threadId)
      ? { threadId: params.threadId ?? firstNestedReceipt?.threadId }
      : {}),
    ...((params.replyToId ?? firstNestedReceipt?.replyToId)
      ? { replyToId: params.replyToId ?? firstNestedReceipt?.replyToId }
      : {}),
    sentAt: params.sentAt ?? firstNestedReceipt?.sentAt ?? Date.now(),
    raw: params.results,
  };
}
/** Lists unique platform message ids in receipt order. */
function listMessageReceiptPlatformIds(receipt) {
  return normalizeUniqueStringEntries(receipt.platformMessageIds);
}
/** Resolves the explicit primary platform id, falling back to the first unique receipt id. */
function resolveMessageReceiptPrimaryId(receipt) {
  const primary = receipt.primaryPlatformMessageId?.trim();
  if (primary) return primary;
  return listMessageReceiptPlatformIds(receipt)[0];
}
//#endregion
export {
  listMessageReceiptPlatformIds as n,
  resolveMessageReceiptPrimaryId as r,
  createMessageReceiptFromOutboundResults as t,
};
