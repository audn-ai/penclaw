import { r as normalizeOptionalAccountId } from "./account-id-C7N4Rwku.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  u as normalizeOptionalThreadValue,
} from "./string-coerce-DW4mBlAt.js";
//#region src/plugin-sdk/channel-route.ts
/** Normalizes a route thread id while preserving provider string ids. */
function normalizeRouteThreadId(value) {
  return normalizeOptionalThreadValue(value);
}
/** Stringifies a normalized thread id for stable route keys and comparisons. */
function stringifyRouteThreadId(value) {
  const normalized = normalizeRouteThreadId(value);
  return normalized == null ? void 0 : String(normalized);
}
/** Converts loose channel/account/target/thread input into a normalized route reference. */
function normalizeChannelRouteRef(input) {
  if (!input) return;
  const channel = normalizeLowercaseStringOrEmpty(input.channel);
  const accountId =
    typeof input.accountId === "string" ? normalizeOptionalAccountId(input.accountId) : void 0;
  const to = normalizeOptionalString(input.to);
  const rawTo = normalizeOptionalString(input.rawTo);
  const threadId = normalizeRouteThreadId(input.threadId);
  if (!channel && !to && !accountId && threadId == null) return;
  return {
    ...(channel ? { channel } : {}),
    ...(accountId ? { accountId } : {}),
    ...(to
      ? {
          target: {
            to,
            ...(rawTo && rawTo !== to ? { rawTo } : {}),
            ...(input.chatType ? { chatType: input.chatType } : {}),
          },
        }
      : {}),
    ...(threadId != null
      ? {
          thread: {
            id: threadId,
            ...(input.threadKind ? { kind: input.threadKind } : {}),
            ...(input.threadSource ? { source: input.threadSource } : {}),
          },
        }
      : {}),
  };
}
/** Returns the normalized destination id for a route reference. */
function channelRouteTarget(route) {
  return route?.target?.to;
}
/** Returns the normalized thread id for a route reference. */
function channelRouteThreadId(route) {
  return route?.thread?.id;
}
/** Normalizes raw target-only route input. */
function normalizeChannelRouteTarget(input) {
  return input ? normalizeChannelRouteRef(input) : void 0;
}
/** @deprecated Use `messaging.resolveOutboundSessionRoute` for provider-specific target grammar. */
function resolveChannelRouteTargetWithParser(params) {
  const channel = normalizeLowercaseStringOrEmpty(params.channel);
  const rawTo = normalizeOptionalString(params.rawTarget);
  if (!channel || !rawTo) return null;
  const parsed = params.parseExplicitTarget(channel, rawTo);
  const fallbackThreadId = normalizeOptionalThreadValue(params.fallbackThreadId);
  return {
    channel,
    rawTo,
    to: parsed?.to ?? rawTo,
    threadId: normalizeOptionalThreadValue(parsed?.threadId ?? fallbackThreadId),
    chatType: parsed?.chatType,
  };
}
/** Builds a JSON route dedupe key that remains unambiguous when route parts contain separators. */
function channelRouteDedupeKey(input) {
  const route = normalizeChannelRouteTarget(input);
  return JSON.stringify([
    route?.channel ?? "",
    route?.target?.to ?? "",
    route?.accountId ?? "",
    stringifyRouteThreadId(route?.thread?.id) ?? "",
  ]);
}
/** @deprecated Use `channelRouteDedupeKey`. */
function channelRouteIdentityKey(input) {
  return channelRouteDedupeKey(input);
}
function threadIdsEqual(left, right) {
  return stringifyRouteThreadId(left) === stringifyRouteThreadId(right);
}
function accountsCompatible(left, right) {
  return !left || !right || left === right;
}
function accountsEqual(left, right) {
  return (left ?? "") === (right ?? "");
}
/**
 * Checks strict route equality after normalization.
 * Missing account ids are not compatible here; use share-conversation helpers for parent/child
 * matching where omitted account/thread values intentionally widen the route.
 */
function channelRoutesMatchExact(params) {
  const { left, right } = params;
  if (!left || !right) return false;
  return (
    left.channel === right.channel &&
    left.target?.to === right.target?.to &&
    accountsEqual(left.accountId, right.accountId) &&
    threadIdsEqual(left.thread?.id, right.thread?.id)
  );
}
/** Checks whether two normalized routes point at the same conversation or parent route. */
function channelRoutesShareConversation(params) {
  const { left, right } = params;
  if (!left || !right) return false;
  if (
    left.channel !== right.channel ||
    left.target?.to !== right.target?.to ||
    !accountsCompatible(left.accountId, right.accountId)
  )
    return false;
  if (left.thread?.id == null || right.thread?.id == null) return true;
  return threadIdsEqual(left.thread.id, right.thread.id);
}
/** Exact route comparison for loose target input after SDK boundary normalization. */
function channelRouteTargetsMatchExact(params) {
  return channelRoutesMatchExact({
    left: normalizeChannelRouteTarget(params.left),
    right: normalizeChannelRouteTarget(params.right),
  });
}
/** Conversation-level route comparison for loose target input after SDK boundary normalization. */
function channelRouteTargetsShareConversation(params) {
  return channelRoutesShareConversation({
    left: normalizeChannelRouteTarget(params.left),
    right: normalizeChannelRouteTarget(params.right),
  });
}
function isChannelRouteRef(route) {
  return "target" in route || "thread" in route;
}
function normalizeChannelRouteKeyInput(route) {
  if (!route) return;
  return isChannelRouteRef(route)
    ? normalizeChannelRouteRef({
        channel: route.channel,
        to: route.target?.to,
        accountId: route.accountId,
        threadId: route.thread?.id,
      })
    : normalizeChannelRouteTarget(route);
}
/** Builds a compact human-readable route key when channel and target are both present. */
function channelRouteCompactKey(route) {
  const normalized = normalizeChannelRouteKeyInput(route);
  if (!normalized?.channel || !normalized.target?.to) return;
  return [
    normalized.channel,
    normalized.target.to,
    normalized.accountId ?? "",
    stringifyRouteThreadId(normalized.thread?.id) ?? "",
  ].join("|");
}
/** @deprecated Use `channelRouteCompactKey`. */
function channelRouteKey(route) {
  return channelRouteCompactKey(route);
}
//#endregion
export {
  channelRouteTarget as a,
  channelRouteThreadId as c,
  normalizeChannelRouteRef as d,
  normalizeChannelRouteTarget as f,
  stringifyRouteThreadId as h,
  channelRouteKey as i,
  channelRoutesMatchExact as l,
  resolveChannelRouteTargetWithParser as m,
  channelRouteDedupeKey as n,
  channelRouteTargetsMatchExact as o,
  normalizeRouteThreadId as p,
  channelRouteIdentityKey as r,
  channelRouteTargetsShareConversation as s,
  channelRouteCompactKey as t,
  channelRoutesShareConversation as u,
};
