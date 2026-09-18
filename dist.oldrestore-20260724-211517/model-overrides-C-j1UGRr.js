import {
  a as resolveChannelEntryMatchWithFallback,
  n as buildChannelKeyCandidates,
  r as normalizeChannelSlug,
} from "./channel-config-CWvX3ZdP.js";
import { t as normalizeChatType } from "./chat-type-BARlA53h.js";
import { i as normalizeMessageChannel } from "./message-channel-normalize-Be6uJOzO.js";
import { t as getChannelPlugin } from "./registry-mc8oBRx8.js";
import {
  f as parseThreadSessionSuffix,
  u as parseRawSessionConversationRef,
} from "./session-key-utils-B8sNp9l4.js";
import {
  H as resolveSessionConversation,
  U as resolveSessionConversationRef,
} from "./store-CzZJhTF6.js";
import {
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import "./message-channel-NQc9DJ6B.js";
//#region src/channels/model-overrides.ts
/**
 * Channel-scoped model override resolver.
 *
 * Matches conversation ids, parent sessions, and wildcard config entries to model overrides.
 */
function resolveProviderEntry(modelByChannel, channel) {
  const normalized =
    normalizeMessageChannel(channel) ?? normalizeOptionalLowercaseString(channel) ?? "";
  return (
    modelByChannel?.[normalized] ??
    modelByChannel?.[
      Object.keys(modelByChannel ?? {}).find((key) => {
        return (
          (normalizeMessageChannel(key) ?? normalizeOptionalLowercaseString(key) ?? "") ===
          normalized
        );
      }) ?? ""
    ]
  );
}
function buildChannelCandidates(params) {
  const normalizedChannel =
    normalizeMessageChannel(params.channel ?? "") ??
    normalizeOptionalLowercaseString(params.channel);
  const groupId = normalizeOptionalString(params.groupId);
  const rawParentConversation = parseRawSessionConversationRef(params.parentSessionKey);
  const parentOverrideFallbacks =
    (normalizedChannel
      ? getChannelPlugin(normalizedChannel)
      : void 0
    )?.conversationBindings?.buildModelOverrideParentCandidates?.({
      parentConversationId: rawParentConversation?.rawId,
    }) ?? [];
  const sessionConversation = resolveSessionConversationRef(params.parentSessionKey, {
    bundledFallback: parentOverrideFallbacks.length === 0,
  });
  const groupConversationKind =
    normalizeChatType(params.groupChatType ?? void 0) === "channel"
      ? "channel"
      : sessionConversation?.kind === "channel"
        ? "channel"
        : "group";
  const groupConversation = resolveSessionConversation({
    channel: normalizedChannel ?? "",
    kind: groupConversationKind,
    rawId: groupId ?? "",
  });
  const groupChannel = normalizeOptionalString(params.groupChannel);
  const groupSubject = normalizeOptionalString(params.groupSubject);
  const channelBare = groupChannel ? groupChannel.replace(/^#/, "") : void 0;
  const subjectBare = groupSubject ? groupSubject.replace(/^#/, "") : void 0;
  const channelSlug = channelBare ? normalizeChannelSlug(channelBare) : void 0;
  const subjectSlug = subjectBare ? normalizeChannelSlug(subjectBare) : void 0;
  return {
    keys: buildChannelKeyCandidates(
      groupId,
      sessionConversation?.rawId,
      ...(groupConversation?.parentConversationCandidates ?? []),
      ...(sessionConversation?.parentConversationCandidates ?? []),
      ...parentOverrideFallbacks,
    ),
    parentKeys: buildChannelKeyCandidates(
      groupChannel,
      channelBare,
      channelSlug,
      groupSubject,
      subjectBare,
      subjectSlug,
    ),
  };
}
function buildGenericParentOverrideCandidates(sessionKey) {
  const raw = parseRawSessionConversationRef(sessionKey);
  if (!raw) return [];
  const { baseSessionKey, threadId } = parseThreadSessionSuffix(raw.rawId);
  return buildChannelKeyCandidates(threadId ? baseSessionKey : raw.rawId);
}
/** Expand prefixed peer IDs by also trying the raw form after the channel prefix. */
function expandPeerIds(ids, channel) {
  const channelPrefix = channel.toLowerCase() + ":";
  const expanded = [];
  for (const id of ids)
    if (id != null) {
      expanded.push(id);
      if (id.toLowerCase().startsWith(channelPrefix)) expanded.push(id.slice(channelPrefix.length));
    }
  return expanded;
}
function resolveDirectChannelModelMatch(params) {
  const expandedUserIds = expandPeerIds(params.directUserIds ?? [], params.channel);
  const directKeys = buildChannelKeyCandidates(
    params.groupId,
    ...expandedUserIds,
    ...buildGenericParentOverrideCandidates(params.parentSessionKey),
  );
  if (directKeys.length === 0) return null;
  const match = resolveChannelEntryMatchWithFallback({
    entries: params.providerEntries,
    keys: directKeys,
    parentKeys: [],
    wildcardKey: "*",
    normalizeKey: (value) => normalizeOptionalLowercaseString(value) ?? "",
  });
  const raw = match.entry ?? match.wildcardEntry;
  if (typeof raw !== "string") return null;
  const model = normalizeOptionalString(raw);
  if (!model) return null;
  return {
    model,
    matchKey: match.matchKey,
    matchSource: match.matchSource,
  };
}
/** Resolves a channel-scoped model override from direct, parent, and wildcard config entries. */
function resolveChannelModelOverride(params) {
  const channel = normalizeOptionalString(params.channel);
  if (!channel) return null;
  const modelByChannel = params.cfg.channels?.modelByChannel;
  if (!modelByChannel) return null;
  const providerEntries = resolveProviderEntry(modelByChannel, channel);
  if (!providerEntries) return null;
  const isDirectChat = normalizeChatType(params.groupChatType ?? void 0) === "direct";
  let directMatch = null;
  if (isDirectChat)
    directMatch = resolveDirectChannelModelMatch({
      channel,
      providerEntries,
      groupId: params.groupId,
      parentSessionKey: params.parentSessionKey,
      directUserIds: params.directUserIds,
    });
  if (directMatch)
    return {
      channel: normalizeMessageChannel(channel) ?? normalizeOptionalLowercaseString(channel) ?? "",
      model: directMatch.model,
      matchKey: directMatch.matchKey,
      matchSource: directMatch.matchSource,
    };
  const { keys, parentKeys } = buildChannelCandidates(params);
  if (keys.length === 0 && parentKeys.length === 0) {
    const wildcardModel = normalizeOptionalString(providerEntries["*"]);
    if (wildcardModel)
      return {
        channel:
          normalizeMessageChannel(channel) ?? normalizeOptionalLowercaseString(channel) ?? "",
        model: wildcardModel,
        matchKey: "*",
        matchSource: "wildcard",
      };
    return null;
  }
  const match = resolveChannelEntryMatchWithFallback({
    entries: providerEntries,
    keys,
    parentKeys,
    wildcardKey: "*",
    normalizeKey: (value) => normalizeOptionalLowercaseString(value) ?? "",
  });
  const raw = match.entry ?? match.wildcardEntry;
  if (typeof raw !== "string") return null;
  const model = normalizeOptionalString(raw);
  if (!model) return null;
  return {
    channel: normalizeMessageChannel(channel) ?? normalizeOptionalLowercaseString(channel) ?? "",
    model,
    matchKey: match.matchKey,
    matchSource: match.matchSource,
  };
}
//#endregion
export { resolveChannelModelOverride as t };
