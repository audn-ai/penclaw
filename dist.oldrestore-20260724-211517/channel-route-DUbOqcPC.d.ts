//#region src/plugin-sdk/channel-route.d.ts
/** Coarse chat shape used when a channel can distinguish direct, group, and broadcast targets. */
type ChannelRouteChatType = "direct" | "group" | "channel";
/** Provider-specific thread kind carried with normalized channel routes. */
type ChannelRouteThreadKind = "topic" | "thread" | "reply";
/** Describes which runtime surface supplied a channel route thread id. */
type ChannelRouteThreadSource = "explicit" | "target" | "session" | "turn";
/** Normalized channel route used for comparison, binding, and dedupe helpers. */
type ChannelRouteRef = {
  /** Lowercase channel id such as `slack`, `telegram`, or `discord`. */ channel?: string /** Normalized account/profile id when a channel supports multiple accounts. */;
  accountId?: string;
  target?: {
    /** Canonical destination id used for route equality and delivery. */ to: string /** Original destination text when provider target grammar differs from the canonical id. */;
    rawTo?: string /** Coarse destination shape used by channels with different direct/group/broadcast rules. */;
    chatType?: ChannelRouteChatType;
  };
  thread?: {
    /** Provider thread/topic/root id; strings are preserved when providers use opaque ids. */ id:
      | string
      | number /** Provider-specific thread family for channels that distinguish topics, replies, and threads. */;
    kind?: ChannelRouteThreadKind /** Runtime source that supplied the thread id, used when callers need route provenance. */;
    source?: ChannelRouteThreadSource;
  };
};
/** Loose route input accepted at SDK boundaries before normalization. */
type ChannelRouteRefInput = {
  /** Raw channel id; normalized to lowercase. */ channel?: unknown /** Raw account/profile id; normalized with account-id rules when string. */;
  accountId?: unknown /** Raw destination id before trimming and route-key normalization. */;
  to?: unknown /** Provider-specific target text retained when different from `to`. */;
  rawTo?: unknown /** Coarse destination shape supplied by channels that distinguish target kinds. */;
  chatType?: ChannelRouteChatType /** Raw provider thread/topic/root id before route-key normalization. */;
  threadId?: unknown /** Provider-specific thread family carried with the normalized thread id. */;
  threadKind?: ChannelRouteThreadKind /** Runtime surface that supplied the thread id. */;
  threadSource?: ChannelRouteThreadSource;
};
/** Raw outbound target input shape used by helpers that do not need thread metadata source. */
type ChannelRouteTargetInput = Pick<
  ChannelRouteRefInput,
  "channel" | "accountId" | "to" | "rawTo" | "chatType" | "threadId"
>;
/** Route input accepted by compact-key helpers after legacy and normalized callers converge. */
type ChannelRouteKeyInput = ChannelRouteRef | ChannelRouteTargetInput;
/** @deprecated Use `messaging.resolveOutboundSessionRoute` for provider-specific target grammar. */
type ChannelRouteExplicitTarget = {
  /** Canonical destination id parsed from the provider-specific target string. */ to: string /** Optional provider thread/topic/root id parsed from the target string. */;
  threadId?: string | number /** Coarse destination shape parsed from the target string. */;
  chatType?: ChannelRouteChatType;
};
/** @deprecated Use `messaging.resolveOutboundSessionRoute` for provider-specific target grammar. */
type ChannelRouteExplicitTargetParser = (
  channel: string,
  rawTarget: string,
) => ChannelRouteExplicitTarget | null;
/** Normalizes a route thread id while preserving provider string ids. */
declare function normalizeRouteThreadId(value: unknown): string | number | undefined;
/** Stringifies a normalized thread id for stable route keys and comparisons. */
declare function stringifyRouteThreadId(value: unknown): string | undefined;
/** Converts loose channel/account/target/thread input into a normalized route reference. */
declare function normalizeChannelRouteRef(
  input?: ChannelRouteRefInput,
): ChannelRouteRef | undefined;
/** Returns the normalized destination id for a route reference. */
declare function channelRouteTarget(route?: ChannelRouteRef): string | undefined;
/** Returns the normalized thread id for a route reference. */
declare function channelRouteThreadId(route?: ChannelRouteRef): string | number | undefined;
/** Normalizes raw target-only route input. */
declare function normalizeChannelRouteTarget(
  input?: ChannelRouteTargetInput | null,
): ChannelRouteRef | undefined;
/** Parsed target shape retained for deprecated explicit-target parser adapters. */
type ChannelRouteParsedTarget = ChannelRouteTargetInput & {
  /** Normalized lowercase channel id. */ channel: string /** Trimmed provider-specific target text originally supplied by the caller. */;
  rawTo: string /** Canonical destination id used by route equality and delivery. */;
  to: string /** Optional thread/topic/root id from the parser or fallback value. */;
  threadId?:
    | string
    | number /** Coarse destination shape parsed from the provider-specific target. */;
  chatType?: ChannelRouteChatType;
};
/** @deprecated Use `messaging.resolveOutboundSessionRoute` for provider-specific target grammar. */
declare function resolveChannelRouteTargetWithParser(params: {
  /** Channel id used for normalization and parser dispatch. */ channel: string /** Provider-specific target text to parse. */;
  rawTarget?: string | null /** Thread id to use when the parsed target omits one. */;
  fallbackThreadId?:
    | string
    | number
    | null /** Legacy parser that understands the channel's explicit-target grammar. */;
  parseExplicitTarget: ChannelRouteExplicitTargetParser;
}): ChannelRouteParsedTarget | null;
/** Builds a JSON route dedupe key that remains unambiguous when route parts contain separators. */
declare function channelRouteDedupeKey(input?: ChannelRouteTargetInput | null): string;
/** @deprecated Use `channelRouteDedupeKey`. */
declare function channelRouteIdentityKey(input?: ChannelRouteTargetInput | null): string;
/**
 * Checks strict route equality after normalization.
 * Missing account ids are not compatible here; use share-conversation helpers for parent/child
 * matching where omitted account/thread values intentionally widen the route.
 */
declare function channelRoutesMatchExact(params: {
  left?: ChannelRouteRef | null;
  right?: ChannelRouteRef | null;
}): boolean;
/** Checks whether two normalized routes point at the same conversation or parent route. */
declare function channelRoutesShareConversation(params: {
  left?: ChannelRouteRef | null;
  right?: ChannelRouteRef | null;
}): boolean;
/** Exact route comparison for loose target input after SDK boundary normalization. */
declare function channelRouteTargetsMatchExact(params: {
  left?: ChannelRouteTargetInput | null;
  right?: ChannelRouteTargetInput | null;
}): boolean;
/** Conversation-level route comparison for loose target input after SDK boundary normalization. */
declare function channelRouteTargetsShareConversation(params: {
  left?: ChannelRouteTargetInput | null;
  right?: ChannelRouteTargetInput | null;
}): boolean;
/** Builds a compact human-readable route key when channel and target are both present. */
declare function channelRouteCompactKey(route?: ChannelRouteKeyInput | null): string | undefined;
/** @deprecated Use `channelRouteCompactKey`. */
declare function channelRouteKey(route?: ChannelRouteRef): string | undefined;
//#endregion
export {
  normalizeRouteThreadId as C,
  normalizeChannelRouteTarget as S,
  stringifyRouteThreadId as T,
  channelRouteTargetsShareConversation as _,
  ChannelRouteParsedTarget as a,
  channelRoutesShareConversation as b,
  ChannelRouteTargetInput as c,
  channelRouteCompactKey as d,
  channelRouteDedupeKey as f,
  channelRouteTargetsMatchExact as g,
  channelRouteTarget as h,
  ChannelRouteKeyInput as i,
  ChannelRouteThreadKind as l,
  channelRouteKey as m,
  ChannelRouteExplicitTarget as n,
  ChannelRouteRef as o,
  channelRouteIdentityKey as p,
  ChannelRouteExplicitTargetParser as r,
  ChannelRouteRefInput as s,
  ChannelRouteChatType as t,
  ChannelRouteThreadSource as u,
  channelRouteThreadId as v,
  resolveChannelRouteTargetWithParser as w,
  normalizeChannelRouteRef as x,
  channelRoutesMatchExact as y,
};
