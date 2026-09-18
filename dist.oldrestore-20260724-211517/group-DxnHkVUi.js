import { r as listDeliverableMessageChannels } from "./message-channel-normalize-Be6uJOzO.js";
import { i as listChannelPlugins } from "./registry-mc8oBRx8.js";
import { s as normalizeSessionPeerId } from "./session-key-utils-B8sNp9l4.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { i as normalizeHyphenSlug } from "./string-normalization-CRyoFBPt.js";
import "./message-channel-NQc9DJ6B.js";
//#region src/config/sessions/group.ts
const getGroupSurfaces = () =>
  /* @__PURE__ */ new Set([...listDeliverableMessageChannels(), "webchat"]);
function resolveLegacyGroupSessionKey(ctx) {
  for (const plugin of listChannelPlugins()) {
    const resolved = plugin.messaging?.resolveLegacyGroupSessionKey?.(ctx);
    if (resolved) return resolved;
  }
  return null;
}
function normalizeGroupLabel(raw) {
  return normalizeHyphenSlug(raw);
}
function joinOpaqueTail(parts, start) {
  return normalizeOptionalString(parts[start]) ? parts.slice(start).join(":") : null;
}
function resolveOriginatingGroupTargetId(params) {
  const target = normalizeOptionalString(params.ctx.OriginatingTo ?? params.ctx.To) ?? "";
  if (!target) return null;
  const parts = target.split(":");
  if (parts.length < 2) return null;
  const head = normalizeLowercaseStringOrEmpty(parts[0]);
  const second = normalizeOptionalLowercaseString(parts[1]);
  if (
    (second === "group" || second === "channel") &&
    (head === params.provider || getGroupSurfaces().has(head))
  )
    return joinOpaqueTail(parts, 2);
  if (head === params.provider || head === "chat" || head === "room" || head === "group")
    return joinOpaqueTail(parts, 1);
  if (head === "channel") return joinOpaqueTail(parts, 1);
  return null;
}
function shortenGroupId(value) {
  const trimmed = normalizeOptionalString(value) ?? "";
  if (!trimmed) return "";
  if (trimmed.length <= 14) return trimmed;
  return `${trimmed.slice(0, 6)}...${trimmed.slice(-4)}`;
}
/**
 * Builds a human-readable group/channel title from stored chat metadata.
 * Prefers the native channel name (#general) or the chat subject verbatim;
 * returns undefined when only opaque route ids are available so callers can
 * fall back to the compact token form below.
 */
function buildGroupDisplayTitle(params) {
  const subject = normalizeOptionalString(params.subject);
  const groupChannel = normalizeOptionalString(params.groupChannel);
  const space = normalizeOptionalString(params.space);
  if (groupChannel) {
    const channelLabel = groupChannel.startsWith("#") ? groupChannel : `#${groupChannel}`;
    return space ? `${space} ${channelLabel}` : channelLabel;
  }
  return subject ?? space ?? void 0;
}
/** Builds a compact display label for group sessions from channel metadata or ids. */
function buildGroupDisplayName(params) {
  const providerKey = normalizeOptionalLowercaseString(params.provider) ?? "group";
  const groupChannel = normalizeOptionalString(params.groupChannel);
  const space = normalizeOptionalString(params.space);
  const subject = normalizeOptionalString(params.subject);
  const detail =
    (groupChannel && space
      ? `${space}${groupChannel.startsWith("#") ? "" : "#"}${groupChannel}`
      : groupChannel || subject || space || "") || "";
  const fallbackId = normalizeOptionalString(params.id) ?? params.key;
  const rawLabel = detail || fallbackId;
  let token = normalizeGroupLabel(rawLabel);
  if (!token) token = normalizeGroupLabel(shortenGroupId(rawLabel));
  if (!params.groupChannel && token.startsWith("#")) token = token.replace(/^#+/, "");
  if (token && !/^[@#]/.test(token) && !token.startsWith("g-") && !token.includes("#"))
    token = `g-${token}`;
  return token ? `${providerKey}:${token}` : providerKey;
}
/**
 * Resolves channel/group chat context into the persisted group session key.
 *
 * Provider-prefixed ids use channel-owned normalization, while legacy plugin resolvers remain a
 * fallback for older channel surfaces that cannot yet express the generic route shape.
 */
function resolveGroupSessionKey(ctx) {
  const from = normalizeOptionalString(ctx.From) ?? "";
  const chatType = normalizeOptionalLowercaseString(ctx.ChatType);
  const normalizedChatType =
    chatType === "channel" ? "channel" : chatType === "group" ? "group" : void 0;
  const legacyResolution = resolveLegacyGroupSessionKey(ctx);
  if (
    !(
      normalizedChatType === "group" ||
      normalizedChatType === "channel" ||
      from.includes(":group:") ||
      from.includes(":channel:") ||
      legacyResolution !== null
    )
  )
    return null;
  const providerHint = normalizeOptionalLowercaseString(ctx.Provider);
  const parts = from.split(":");
  const head = normalizeLowercaseStringOrEmpty(parts[0]);
  const headIsSurface = head ? getGroupSurfaces().has(head) : false;
  if (!headIsSurface && !providerHint && legacyResolution) return legacyResolution;
  const provider = headIsSurface ? head : (providerHint ?? legacyResolution?.channel);
  if (!provider) return null;
  const second = normalizeOptionalLowercaseString(parts[1]);
  const secondIsKind = second === "group" || second === "channel";
  const kind = secondIsKind
    ? second
    : from.includes(":channel:") || normalizedChatType === "channel"
      ? "channel"
      : "group";
  const originatingGroupTargetId =
    !secondIsKind && normalizedChatType
      ? resolveOriginatingGroupTargetId({
          ctx,
          provider,
        })
      : null;
  const id = originatingGroupTargetId
    ? originatingGroupTargetId
    : headIsSurface
      ? secondIsKind
        ? joinOpaqueTail(parts, 2)
        : joinOpaqueTail(parts, 1)
      : from;
  if (!id) return null;
  const finalId = normalizeSessionPeerId({
    channel: provider,
    peerKind: kind,
    peerId: id,
  });
  if (!finalId) return null;
  return {
    key: `${provider}:${kind}:${finalId}`,
    channel: provider,
    id: finalId,
    chatType: kind === "channel" ? "channel" : "group",
  };
}
//#endregion
export { buildGroupDisplayTitle as n, resolveGroupSessionKey as r, buildGroupDisplayName as t };
