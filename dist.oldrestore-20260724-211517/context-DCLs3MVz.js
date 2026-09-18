import {
  a as resolveConversationBindingThreadIdFromMessage,
  n as resolveConversationBindingChannelFromMessage,
  r as resolveConversationBindingContextFromAcpCommand,
  t as resolveConversationBindingAccountIdFromMessage,
} from "./conversation-binding-input-D7ZTI22L.js";
import { r as normalizeConversationTargetRef } from "./session-binding-normalization-sQL-8bRz.js";
import { s as normalizeConversationText } from "./session-binding-service-DPVMwWUH.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/auto-reply/reply/commands-acp/context.ts
function resolveAcpCommandChannel(params) {
  return normalizeLowercaseStringOrEmpty(
    normalizeConversationText(
      resolveConversationBindingChannelFromMessage(params.ctx, params.command.channel),
    ),
  );
}
function resolveAcpCommandAccountId(params) {
  return resolveConversationBindingAccountIdFromMessage({
    ctx: params.ctx,
    cfg: params.cfg,
    commandChannel: params.command.channel,
  });
}
function resolveAcpCommandThreadId(params) {
  return resolveConversationBindingThreadIdFromMessage(params.ctx);
}
function resolveAcpCommandConversationRef(params) {
  const resolved = resolveConversationBindingContextFromAcpCommand(params);
  if (!resolved) return null;
  return normalizeConversationTargetRef({
    conversationId: resolved.conversationId,
    parentConversationId: resolved.parentConversationId,
  });
}
function resolveAcpCommandConversationId(params) {
  return resolveAcpCommandConversationRef(params)?.conversationId;
}
function resolveAcpCommandBindingContext(params) {
  const conversationRef = resolveAcpCommandConversationRef(params);
  if (!conversationRef)
    return {
      channel: resolveAcpCommandChannel(params),
      accountId: resolveAcpCommandAccountId(params),
      threadId: resolveAcpCommandThreadId(params),
    };
  return {
    channel: resolveAcpCommandChannel(params),
    accountId: resolveAcpCommandAccountId(params),
    threadId: resolveAcpCommandThreadId(params),
    conversationId: conversationRef.conversationId,
    ...(conversationRef.parentConversationId
      ? { parentConversationId: conversationRef.parentConversationId }
      : {}),
  };
}
//#endregion
export {
  resolveAcpCommandThreadId as a,
  resolveAcpCommandConversationId as i,
  resolveAcpCommandBindingContext as n,
  resolveAcpCommandChannel as r,
  resolveAcpCommandAccountId as t,
};
