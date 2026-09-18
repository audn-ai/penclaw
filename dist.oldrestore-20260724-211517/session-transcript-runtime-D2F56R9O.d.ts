import {
  n as SessionTranscriptIdentity,
  o as SessionTranscriptReadParams,
} from "./session-transcript-memory-hit-BV393OL4.js";
import {
  a as SessionTranscriptUpdateMode,
  c as TranscriptMessageAppendResult,
  i as SessionTranscriptDeliveryMirror,
  l as TranscriptUpdatePayload,
  r as SessionTranscriptAppendResult,
  s as TranscriptMessageAppendOptions,
  t as LatestAssistantTranscriptText,
} from "./transcript-B5Rnl-3l.js";
import { s as AgentMessage } from "./types-JQFrjdua.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/plugin-sdk/session-transcript-runtime.d.ts
type SessionTranscriptEvent = unknown;
type SessionTranscriptTargetParams = SessionTranscriptReadParams;
type SessionTranscriptMessageEntry = {
  /** Stable transcript event id for this message entry. */ entryId: string /** Parent id after active-branch normalization; null when this is a visible root. */;
  parentId:
    | string
    | null /** Ordered read metadata for this full transcript read, not a resumable cursor. */;
  seq: number /** Redacted agent message payload as persisted by the runtime. */;
  message: AgentMessage /** Convenience mirror of message.role. */;
  role: AgentMessage["role"] /** Entry timestamp recorded by the transcript store, when present. */;
  createdAt?: string /** Message idempotency key, when the persisted message has one. */;
  idempotencyKey?: string;
};
type SessionTranscriptTarget = SessionTranscriptIdentity & {
  targetKind: "runtime-session";
};
type SessionTranscriptAppendMessageParams<TMessage> = SessionTranscriptTargetParams &
  TranscriptMessageAppendOptions<TMessage>;
type SessionTranscriptAssistantMirrorAppendParams = SessionTranscriptReadParams & {
  config?: OpenClawConfig;
  deliveryMirror?: SessionTranscriptDeliveryMirror;
  idempotencyKey?: string;
  mediaUrls?: string[];
  text?: string;
  updateMode?: SessionTranscriptUpdateMode;
};
type SessionTranscriptWriteLockParams = SessionTranscriptTargetParams & {
  config?: TranscriptMessageAppendOptions<unknown>["config"];
};
type SessionTranscriptWriteLockContext = {
  appendMessage: <TMessage>(
    options: Omit<TranscriptMessageAppendOptions<TMessage>, "config">,
  ) => Promise<TranscriptMessageAppendResult<TMessage> | undefined>;
  publishUpdate: (update?: TranscriptUpdatePayload) => Promise<void>;
  readEvents: () => Promise<SessionTranscriptEvent[]>;
  target: SessionTranscriptTarget;
};
type SessionTranscriptMirrorAppendResult =
  | {
      ok: true;
      messageId: string;
    }
  | Extract<
      SessionTranscriptAppendResult,
      {
        ok: false;
      }
    >;
/**
 * Resolves the public identity for a transcript without returning its file path.
 */
declare function resolveSessionTranscriptIdentity(
  params: SessionTranscriptReadParams,
): Promise<SessionTranscriptIdentity>;
/**
 * Resolves the public target for transcript operations without exposing the
 * current storage path as identity.
 */
declare function resolveSessionTranscriptTarget(
  params: SessionTranscriptTargetParams,
): Promise<SessionTranscriptTarget>;
/**
 * Reads transcript events by public session identity instead of file path.
 */
declare function readSessionTranscriptEvents(
  params: SessionTranscriptTargetParams,
): Promise<SessionTranscriptEvent[]>;
/**
 * Reads visible transcript message entries by scoped identity.
 *
 * This is a branch-safe message projection over the current full transcript
 * read. `seq` is ordered read metadata, not a resumable cursor.
 */
declare function readVisibleSessionTranscriptMessageEntries(
  params: SessionTranscriptTargetParams,
): Promise<SessionTranscriptMessageEntry[]>;
/**
 * Reads the latest visible assistant text by scoped identity.
 */
declare function readLatestAssistantTextByIdentity(
  params: SessionTranscriptTargetParams,
): Promise<LatestAssistantTranscriptText | undefined>;
/**
 * Appends a delivery-mirror assistant message through the SQLite transcript accessor.
 */
declare function appendAssistantMirrorMessageByIdentity(
  params: SessionTranscriptAssistantMirrorAppendParams,
): Promise<SessionTranscriptMirrorAppendResult>;
/**
 * Appends a transcript message by scoped transcript target.
 */
declare function appendSessionTranscriptMessageByIdentity<TMessage>(
  params: SessionTranscriptAppendMessageParams<TMessage>,
): Promise<TranscriptMessageAppendResult<TMessage> | undefined>;
/**
 * Publishes a transcript update by scoped transcript target.
 */
declare function publishSessionTranscriptUpdateByIdentity(
  params: SessionTranscriptTargetParams & {
    update?: TranscriptUpdatePayload;
  },
): Promise<void>;
/**
 * Runs transcript work under the write lock for the resolved scoped target.
 */
declare function withSessionTranscriptWriteLock<T>(
  params: SessionTranscriptWriteLockParams,
  run: (context: SessionTranscriptWriteLockContext) => Promise<T> | T,
): Promise<T>;
//#endregion
export {
  withSessionTranscriptWriteLock as _,
  SessionTranscriptTarget as a,
  SessionTranscriptWriteLockParams as c,
  publishSessionTranscriptUpdateByIdentity as d,
  readLatestAssistantTextByIdentity as f,
  resolveSessionTranscriptTarget as g,
  resolveSessionTranscriptIdentity as h,
  SessionTranscriptMessageEntry as i,
  appendAssistantMirrorMessageByIdentity as l,
  readVisibleSessionTranscriptMessageEntries as m,
  SessionTranscriptAssistantMirrorAppendParams as n,
  SessionTranscriptTargetParams as o,
  readSessionTranscriptEvents as p,
  SessionTranscriptEvent as r,
  SessionTranscriptWriteLockContext as s,
  SessionTranscriptAppendMessageParams as t,
  appendSessionTranscriptMessageByIdentity as u,
};
