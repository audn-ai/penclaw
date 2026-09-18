import { t as DeliveryContext } from "./delivery-context.types-DyNhFIjW.js";
import { i as MsgContext } from "./templating-h3OQefFR.js";
import { r as GroupKeyResolution, s as SessionEntry } from "./types-Dk-ocvLl.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region src/sessions/transcript-events.d.ts
/** Storage-neutral identity for the session transcript that changed. */
type SessionTranscriptUpdateTarget = {
  agentId: string;
  sessionId: string;
  sessionKey: string;
};
type SessionTranscriptUpdateFields = {
  sessionFile?: string;
  target?: SessionTranscriptUpdateTarget;
  sessionKey?: string;
  agentId?: string;
  sessionId?: string;
  message?: unknown;
  messageId?: string;
  messageSeq?: number;
};
/** Normalized transcript update emitted after a session transcript changes. */
type SessionTranscriptUpdate = Omit<SessionTranscriptUpdateFields, "sessionFile"> & {
  target: SessionTranscriptUpdateTarget;
};
/** Internal transcript update that may identify a transcript without a file path. */
type InternalSessionTranscriptUpdate = SessionTranscriptUpdateFields;
type SessionTranscriptListener = (update: SessionTranscriptUpdate) => void;
type InternalSessionTranscriptListener = (update: InternalSessionTranscriptUpdate) => void;
/** Registers a listener for normalized session transcript updates. */
declare function onSessionTranscriptUpdate(listener: SessionTranscriptListener): () => void;
/** Registers an internal listener for identity-only or file-backed transcript updates. */
declare function onInternalSessionTranscriptUpdate(
  listener: InternalSessionTranscriptListener,
): () => void;
//#endregion
//#region src/config/sessions/session-accessor.d.ts
type TranscriptMessageAppendOptions<TMessage> = {
  /** Runtime config used for message redaction and transcript header metadata. */ config?: OpenClawConfig /** Working directory recorded in a newly created transcript header. */;
  cwd?: string /** How duplicate message idempotency keys are detected before append. */;
  idempotencyLookup?:
    | "scan"
    | "scan-assistant"
    | "caller-checked" /** Provider/channel message payload to persist. */;
  message: TMessage /** Testable timestamp override for the generated transcript entry. */;
  now?: number /** Existing transcript event id owned by a caller with its own session tree. */;
  eventId?: string /** Existing parent id owned by a caller with its own session tree. */;
  parentId?:
    | string
    | null /** Optional finalizer that runs after duplicate detection but before persistence. */;
  prepareMessageAfterIdempotencyCheck?: (
    message: TMessage,
  ) =>
    | TMessage
    | undefined /** Allow append without parent-link migration for large legacy linear transcripts. */;
  useRawWhenLinear?: boolean;
};
type TranscriptMessageAppendResult<TMessage> = {
  /** False when idempotency lookup found an existing transcript message. */ appended: boolean /** Redacted message payload as persisted or replayed from the transcript. */;
  message: TMessage /** Existing or newly generated transcript message id. */;
  messageId: string;
};
/** Transcript update fields supplied by callers; the target is resolved here. */
type TranscriptUpdatePayload = Partial<SessionTranscriptUpdate>;
type RecordInboundSessionMetaParams = {
  /** Set false to only patch existing entries; missing sessions stay absent. */ createIfMissing?: boolean /** Inbound message context whose stable metadata is derived and persisted. */;
  ctx: MsgContext /** Group routing resolution for group-owned session keys. */;
  groupResolution?: GroupKeyResolution | null /** Canonical or alias session key for the inbound conversation. */;
  sessionKey: string /** Explicit store target for file-backed stores and SQLite migration adapters. */;
  storePath: string;
};
type UpdateSessionLastRouteParams = {
  /** Account owning the delivery route when the channel is multi-account. */ accountId?: string /** Delivery channel id persisted as the last route channel. */;
  channel?: SessionEntry["lastChannel"] /** Set false to only patch existing entries; missing sessions stay absent. */;
  createIfMissing?: boolean /** Optional inbound context whose session metadata is derived alongside the route. */;
  ctx?: MsgContext /** Explicit delivery context merged over the persisted session fallback. */;
  deliveryContext?: DeliveryContext /** Group routing resolution for group-owned session keys. */;
  groupResolution?: GroupKeyResolution | null /** Canonical channel route persisted as the session route slot. */;
  route?: SessionEntry["route"] /** Canonical or alias session key for the routed conversation. */;
  sessionKey: string /** Explicit store target for file-backed stores and SQLite migration adapters. */;
  storePath: string /** Thread/topic id for the delivery route, when the transport has one. */;
  threadId?: string | number /** Delivery target persisted as the last route recipient. */;
  to?: string;
};
/**
 * Records stable conversation metadata derived from one inbound message as a
 * single storage-sized upsert (createIfMissing by default). Inbound metadata
 * must not refresh activity timestamps — idle reset relies on updatedAt from
 * real session turns — so existing rows merge with preserve-activity
 * semantics while legacy alias keys collapse onto the canonical row.
 */
declare function recordInboundSessionMeta(
  params: RecordInboundSessionMetaParams,
): Promise<SessionEntry | null>;
/**
 * Persists the last known delivery route for one session as a single
 * storage-sized patch. Route updates preserve activity timestamps (#49515)
 * and merge explicit route/delivery input over the persisted session
 * fallback before normalizing the derived last* fields.
 */
declare function updateSessionLastRoute(
  params: UpdateSessionLastRouteParams,
): Promise<SessionEntry | null>;
//#endregion
//#region src/config/sessions/transcript.d.ts
type SessionTranscriptAppendResult =
  | {
      ok: true;
      sessionFile: string;
      messageId: string;
    }
  | {
      ok: false;
      reason: string;
      code?: "blocked" | "session-rebound";
    };
type SessionTranscriptUpdateMode = "inline" | "file-only" | "none";
type SessionTranscriptDeliveryMirror =
  | {
      kind: "channel-final";
      sourceMessageId?: string;
    }
  | {
      kind: "channel-final-suppressed";
      reason: "stale-foreground";
      sourceMessageId?: string;
    };
type AssistantTranscriptText = {
  id?: string;
  text: string;
  timestamp?: number;
};
type SessionRecentConversationText = {
  id?: string;
  role: "user" | "assistant";
  text: string;
  timestamp?: number;
  sourceChannel?: string;
};
type ReadRecentSessionConversationTextOptions = {
  beforeTimestampMs?: number;
  limit?: number;
  minTimestampMs?: number;
  role?: "user" | "assistant";
  preferUpstreamUserText?: boolean;
};
type ReadRecentSessionConversationTextParams = ReadRecentSessionConversationTextOptions & {
  agentId?: string;
  sessionKey: string;
  storePath?: string;
};
type LatestAssistantTranscriptText = AssistantTranscriptText;
declare function readRecentUserAssistantTextForSession(
  params: ReadRecentSessionConversationTextParams,
): Promise<SessionRecentConversationText[]>;
//#endregion
export {
  SessionTranscriptUpdateMode as a,
  TranscriptMessageAppendResult as c,
  updateSessionLastRoute as d,
  onInternalSessionTranscriptUpdate as f,
  SessionTranscriptDeliveryMirror as i,
  TranscriptUpdatePayload as l,
  SessionRecentConversationText as n,
  readRecentUserAssistantTextForSession as o,
  onSessionTranscriptUpdate as p,
  SessionTranscriptAppendResult as r,
  TranscriptMessageAppendOptions as s,
  LatestAssistantTranscriptText as t,
  recordInboundSessionMeta as u,
};
