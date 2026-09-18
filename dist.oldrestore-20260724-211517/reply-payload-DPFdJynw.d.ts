import {
  E as ReplyPayloadDelivery,
  c as MessagePresentation,
  n as InteractiveReply,
} from "./payload-DYmvszuK.js";
import { E as ReplyToMode } from "./types.base-ibSxQuK3.js";

//#region src/channels/location.d.ts
/** Normalized source kind for channel-provided geographic locations. */
type LocationSource = "pin" | "place" | "live";
/** Channel-neutral location payload passed from plugins into shared prompt rendering. */
type NormalizedLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  name?: string;
  address?: string;
  isLive?: boolean;
  source?: LocationSource;
  caption?: string;
};
/** Portable outbound location fields supported by channel send adapters. */
type OutboundLocation = Pick<
  NormalizedLocation,
  "latitude" | "longitude" | "accuracy" | "name" | "address"
>;
/** Normalize a portable location payload at an outbound/plugin boundary. */
declare function normalizeOutboundLocation(
  value: unknown,
  label?: string,
): OutboundLocation | undefined;
/**
 * Formats the safe inline location body shown to the model.
 *
 * Channel-provided labels, addresses, and captions are intentionally excluded
 * here; `toLocationContext` carries them into the untrusted metadata block.
 */
declare function formatLocationText(location: NormalizedLocation): string;
/** Converts a normalized location into template context fields for prompt metadata. */
declare function toLocationContext(location: NormalizedLocation): {
  LocationLat: number;
  LocationLon: number;
  LocationAccuracy?: number;
  LocationName?: string;
  LocationAddress?: string;
  LocationSource: LocationSource;
  LocationIsLive: boolean;
  LocationCaption?: string;
};
//#endregion
//#region src/auto-reply/reply-payload.d.ts
/** Channel-agnostic assistant reply payload. */
type ReplyPayload = {
  text?: string;
  mediaUrl?: string;
  mediaUrls?: string[] /** Internal-only trust signal for gateway webchat local media embedding. */;
  trustedLocalMedia?: boolean /** Treat media as live-only content and avoid persisting the underlying media reference. */;
  sensitiveMedia?: boolean /** Channel-agnostic rich presentation. Core degrades or asks the channel renderer to map it. */;
  presentation?: MessagePresentation /** Channel-agnostic delivery preferences, e.g. pin the sent message when supported. */;
  delivery?: ReplyPayloadDelivery;
  /**
   * @deprecated Use presentation.
   *
   * Internal legacy representation used by existing approval/reply helpers during migration.
   */
  interactive?: InteractiveReply;
  btw?: {
    question: string;
  };
  replyToId?: string;
  replyToTag?: boolean /** True when [[reply_to_current]] was present but not yet mapped to a message id. */;
  replyToCurrent?: boolean /** Send audio as voice message (bubble) instead of audio file. Defaults to false. */;
  audioAsVoice?: boolean /** Send video media as a round video note when the channel supports it. */;
  videoAsNote?: boolean /** Channel-neutral geographic location or named place. */;
  location?: OutboundLocation;
  /**
   * Text synthesized into an audio-only TTS payload. Exposed to hooks for
   * archival/search use when no visible channel text is sent.
   */
  spokenText?: string;
  /**
   * Marks a TTS media payload as supplemental audio for assistant text that is
   * already visible through streaming or transcript projection.
   */
  ttsSupplement?: ReplyPayloadTtsSupplement;
  isError?: boolean;
  /** Marks this payload as a reasoning/thinking block. Channels that do not
   *  have a dedicated reasoning lane (e.g. WhatsApp, web) should suppress it. */
  isReasoning?: boolean /** Marks pre-tool commentary (💬) — a display lane, suppressed unless the channel opts in. */;
  isCommentary?: boolean /** Reasoning stream text is a complete replacement snapshot, not a delta. */;
  isReasoningSnapshot?: boolean;
  /** Marks this payload as a compaction status notice (start/end).
   *  Should be excluded from TTS transcript accumulation so compaction
   *  status lines are not synthesised into the spoken assistant reply. */
  isCompactionNotice?: boolean /** Marks this payload as a model-fallback transition/recovery notice. */;
  isFallbackNotice?: boolean /** Marks this payload as transient status, not assistant answer content. */;
  isStatusNotice?: boolean /** Channel-specific payload data (per-channel envelope). */;
  channelData?: Record<string, unknown>;
};
/** Metadata for fast-auto progress notices. */
declare const FAST_MODE_AUTO_PROGRESS_KIND = "fast-mode-auto";
declare function isFastModeAutoProgressPayload(payload: Pick<ReplyPayload, "channelData">): boolean;
/** Metadata for audio-only media that supplements already-visible assistant text. */
type ReplyPayloadTtsSupplement = {
  spokenText: string;
  visibleTextAlreadyDelivered?: boolean;
};
/** Reply policy facts that provider adapters use to resolve the final transport route. */
type ReplyDeliveryContext = {
  chatType?: "direct" | "group" | "channel" | null;
  replyToMode: ReplyToMode;
};
/** Returns normalized TTS supplement metadata only when the payload has media to carry it. */
declare function getReplyPayloadTtsSupplement(
  payload: Pick<ReplyPayload, "mediaUrl" | "mediaUrls" | "ttsSupplement">,
): ReplyPayloadTtsSupplement | undefined;
/** Returns true when the payload is a valid TTS supplement media payload. */
declare function isReplyPayloadTtsSupplement(
  payload: Pick<ReplyPayload, "mediaUrl" | "mediaUrls" | "ttsSupplement">,
): boolean;
/** Marks a reply payload as supplemental TTS media while preserving the original shape. */
declare function markReplyPayloadAsTtsSupplement<T extends ReplyPayload>(
  payload: T,
  spokenText?: string,
  options?: {
    visibleTextAlreadyDelivered?: boolean;
  },
): T;
/** Removes visible-only fields from a payload that should be delivered as TTS supplement media. */
declare function buildTtsSupplementMediaPayload(payload: ReplyPayload): ReplyPayload;
/** Returns true when a payload is the synthesized warning for a non-terminal tool error. */
declare function isReplyPayloadNonTerminalToolErrorWarning(payload: object): boolean;
//#endregion
export {
  buildTtsSupplementMediaPayload as a,
  isReplyPayloadNonTerminalToolErrorWarning as c,
  LocationSource as d,
  NormalizedLocation as f,
  toLocationContext as g,
  normalizeOutboundLocation as h,
  ReplyPayloadTtsSupplement as i,
  isReplyPayloadTtsSupplement as l,
  formatLocationText as m,
  ReplyDeliveryContext as n,
  getReplyPayloadTtsSupplement as o,
  OutboundLocation as p,
  ReplyPayload as r,
  isFastModeAutoProgressPayload as s,
  FAST_MODE_AUTO_PROGRESS_KIND as t,
  markReplyPayloadAsTtsSupplement as u,
};
