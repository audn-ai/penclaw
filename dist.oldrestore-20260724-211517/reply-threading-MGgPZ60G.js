import { t as normalizeChatType } from "./chat-type-BARlA53h.js";
import "./account-id-C7N4Rwku.js";
import { t as getChannelPlugin } from "./registry-mc8oBRx8.js";
import "./registry-xXjI-8UE.js";
import { t as normalizeAnyChannelId } from "./registry-normalize-CWirNxxC.js";
import {
  i as copyReplyPayloadMetadata,
  l as isReplyPayloadStatusNotice,
} from "./reply-payload-BK_jICQ3.js";
import { n as isSingleUseReplyToMode } from "./reply-reference-CblWzjbF.js";
import "./plugins-BKdf-5tW.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region src/auto-reply/reply/reply-threading.ts
/** Reply threading policy helpers for channel replies and status notices. */
function normalizeReplyToModeChatType(chatType) {
  return chatType === "direct" || chatType === "group" || chatType === "channel"
    ? chatType
    : void 0;
}
/** Resolve configured reply-to mode from channel and chat-type config. */
function resolveConfiguredReplyToMode(cfg, channel, chatType) {
  const provider = normalizeAnyChannelId(channel) ?? normalizeOptionalLowercaseString(channel);
  if (!provider) return "all";
  const channelConfig = cfg.channels?.[provider];
  const normalizedChatType = normalizeReplyToModeChatType(chatType);
  if (normalizedChatType) {
    const scopedMode = channelConfig?.replyToModeByChatType?.[normalizedChatType];
    if (scopedMode !== void 0) return scopedMode;
  }
  if (normalizedChatType === "direct") {
    const legacyDirectMode = channelConfig?.dm?.replyToMode;
    if (legacyDirectMode !== void 0) return legacyDirectMode;
  }
  return channelConfig?.replyToMode ?? "all";
}
/** Resolve reply-to mode using channel threading adapter override when present. */
function resolveReplyToModeWithThreading(cfg, threading, params = {}) {
  return (
    threading?.resolveReplyToMode?.({
      cfg,
      accountId: params.accountId,
      chatType: params.chatType,
    }) ?? resolveConfiguredReplyToMode(cfg, params.channel, params.chatType)
  );
}
/** Resolve effective reply-to mode for a channel/account/chat tuple. */
function resolveReplyToMode(cfg, channel, accountId, chatType) {
  const normalizedAccountId = normalizeOptionalLowercaseString(accountId);
  if (!normalizedAccountId) return resolveConfiguredReplyToMode(cfg, channel, chatType);
  const provider = normalizeAnyChannelId(channel) ?? normalizeOptionalLowercaseString(channel);
  return resolveReplyToModeWithThreading(
    cfg,
    provider ? getChannelPlugin(provider)?.threading : void 0,
    {
      channel,
      accountId: normalizedAccountId,
      chatType,
    },
  );
}
/** Resolve the account that routed reply delivery will use when none is explicit. */
function resolveReplyDeliveryAccountId(cfg, channel, accountId) {
  const explicitAccountId = normalizeOptionalLowercaseString(accountId);
  if (explicitAccountId) return explicitAccountId;
  const provider = normalizeAnyChannelId(channel) ?? normalizeOptionalLowercaseString(channel);
  if (!provider) return;
  const plugin = getChannelPlugin(provider);
  if (!plugin) return;
  const configuredDefault = normalizeOptionalLowercaseString(plugin.config.defaultAccountId?.(cfg));
  if (configuredDefault) return configuredDefault;
  const channelConfiguredDefault = normalizeOptionalLowercaseString(
    cfg.channels?.[provider]?.defaultAccount,
  );
  if (channelConfiguredDefault) return channelConfiguredDefault;
  return (
    plugin.config
      .listAccountIds(cfg)
      .map((listedAccountId) => normalizeOptionalLowercaseString(listedAccountId))
      .find((listedAccountId) => Boolean(listedAccountId)) ?? "default"
  );
}
/** Build the canonical reply policy context consumed by delivery adapters. */
function createReplyDeliveryContext(replyToMode, chatType) {
  const normalizedChatType = normalizeChatType(chatType ?? void 0);
  return {
    ...(normalizedChatType ? { chatType: normalizedChatType } : {}),
    replyToMode,
  };
}
/** Create a payload filter that strips reply targets according to reply-to mode. */
function createReplyToModeFilter(mode, opts = {}) {
  let hasThreaded = false;
  return (payload) => {
    const isStatusNotice = isReplyPayloadStatusNotice(payload);
    if (!payload.replyToId) return payload;
    if (mode === "off") {
      const isExplicit = Boolean(payload.replyToTag) || Boolean(payload.replyToCurrent);
      if (opts.allowExplicitReplyTagsWhenOff && isExplicit && !isStatusNotice) return payload;
      return copyReplyPayloadMetadata(payload, {
        ...payload,
        replyToId: void 0,
      });
    }
    if (mode === "all") return payload;
    if (isSingleUseReplyToMode(mode) && hasThreaded) {
      if (isStatusNotice) return payload;
      return copyReplyPayloadMetadata(payload, {
        ...payload,
        replyToId: void 0,
      });
    }
    if (isSingleUseReplyToMode(mode) && !isStatusNotice) hasThreaded = true;
    return payload;
  };
}
/** Resolve whether implicit current-message replies are allowed under threading policy. */
function resolveImplicitCurrentMessageReplyAllowance(mode, policy) {
  const implicitCurrentMessage = policy?.implicitCurrentMessage ?? "default";
  if (implicitCurrentMessage === "allow") return true;
  if (implicitCurrentMessage === "deny") return false;
  return mode !== "batched";
}
/** Build threading policy for batched reply-to mode. */
function resolveBatchedReplyThreadingPolicy(mode, isBatched) {
  if (mode !== "batched") return;
  return { implicitCurrentMessage: isBatched ? "allow" : "deny" };
}
/** Create a reply-to filter using channel-specific explicit-tag defaults. */
function createReplyToModeFilterForChannel(mode, channel) {
  const normalized = normalizeOptionalLowercaseString(channel);
  return createReplyToModeFilter(mode, {
    allowExplicitReplyTagsWhenOff: normalized ? true : normalized === "webchat",
  });
}
//#endregion
export {
  resolveReplyDeliveryAccountId as a,
  resolveImplicitCurrentMessageReplyAllowance as i,
  createReplyToModeFilterForChannel as n,
  resolveReplyToMode as o,
  resolveBatchedReplyThreadingPolicy as r,
  createReplyDeliveryContext as t,
};
