import { u as parseRawSessionConversationRef } from "./session-key-utils-B8sNp9l4.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/plugins/hook-agent-context.ts
/** Builds plugin hook agent context snapshots from active session and model state. */
const TARGET_PREFIXES = /* @__PURE__ */ new Set([
  "channel",
  "chat",
  "direct",
  "dm",
  "group",
  "thread",
  "user",
]);
function normalizeKey(value) {
  return (value ?? "").trim().toLowerCase();
}
function stripConversationPrefix(value, ...providers) {
  const text = normalizeOptionalString(value);
  if (!text) return;
  const separatorIndex = text.indexOf(":");
  if (separatorIndex === -1) return text;
  const prefix = normalizeKey(text.slice(0, separatorIndex));
  const suffix = normalizeOptionalString(text.slice(separatorIndex + 1));
  if (!suffix) return text;
  if (
    TARGET_PREFIXES.has(prefix) ||
    providers.some((provider) => prefix === normalizeKey(provider))
  )
    return suffix;
  return text;
}
function resolveAgentHookChannel(params) {
  const messageChannel = normalizeOptionalString(params.messageChannel);
  const provider = normalizeOptionalString(params.messageProvider);
  if (!messageChannel) return provider;
  const separatorIndex = messageChannel.indexOf(":");
  if (separatorIndex === -1) return messageChannel;
  const prefix = normalizeOptionalString(messageChannel.slice(0, separatorIndex));
  if (!prefix) return provider;
  if (TARGET_PREFIXES.has(normalizeKey(prefix)) || normalizeKey(prefix) === normalizeKey(provider))
    return provider;
  return prefix;
}
/** Resolves the channel id exposed to plugin agent hooks. */
function resolveAgentHookChannelId(params) {
  const provider = normalizeOptionalString(params.messageProvider);
  const messageChannel = normalizeOptionalString(params.messageChannel);
  const parsed = parseRawSessionConversationRef(params.sessionKey);
  if (parsed?.rawId) return parsed.rawId;
  const metadataChannel =
    stripConversationPrefix(params.currentChannelId ?? void 0, provider, messageChannel) ??
    stripConversationPrefix(params.messageTo ?? void 0, provider, messageChannel);
  if (metadataChannel && normalizeKey(metadataChannel) !== normalizeKey(provider))
    return metadataChannel;
  const strippedMessageChannel = stripConversationPrefix(
    params.messageChannel ?? void 0,
    provider,
    messageChannel,
  );
  if (strippedMessageChannel && normalizeKey(strippedMessageChannel) !== normalizeKey(provider))
    return strippedMessageChannel;
  return messageChannel ?? provider;
}
/** Builds channel/provider fields for plugin agent hook context. */
function buildAgentHookContextChannelFields(params) {
  const channel = resolveAgentHookChannel(params);
  const channelId = resolveAgentHookChannelId(params);
  return {
    channel,
    messageProvider: normalizeOptionalString(params.messageProvider),
    channelId,
    chatId: channelId,
    senderId: normalizeOptionalString(params.senderId),
  };
}
function buildAgentHookContextIdentityFields(params) {
  const trigger = normalizeOptionalString(params.trigger);
  if (trigger && trigger !== "user") return {};
  const senderId = normalizeOptionalString(params.senderId);
  const chatId = normalizeOptionalString(params.chatId);
  const sender = senderId
    ? {
        ...params.channelContext?.sender,
        id: senderId,
      }
    : params.channelContext?.sender;
  const chat = chatId
    ? {
        ...params.channelContext?.chat,
        id: chatId,
      }
    : params.channelContext?.chat;
  const channelContext =
    sender || chat || params.channelContext
      ? {
          ...params.channelContext,
          ...(sender ? { sender } : {}),
          ...(chat ? { chat } : {}),
        }
      : void 0;
  return {
    ...(senderId ? { senderId } : {}),
    ...(chatId ? { chatId } : {}),
    ...(channelContext ? { channelContext } : {}),
  };
}
//#endregion
export { buildAgentHookContextIdentityFields as n, buildAgentHookContextChannelFields as t };
