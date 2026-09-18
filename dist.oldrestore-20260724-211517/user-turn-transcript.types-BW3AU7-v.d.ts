import { s as AgentMessage } from "./types-JQFrjdua.js";

//#region src/sessions/input-provenance.d.ts
declare const INPUT_PROVENANCE_KIND_VALUES: readonly [
  "external_user",
  "inter_session",
  "internal_system",
];
type InputProvenanceKind = (typeof INPUT_PROVENANCE_KIND_VALUES)[number];
type InputProvenance = {
  kind: InputProvenanceKind;
  originSessionId?: string;
  sourceSessionKey?: string;
  sourceChannel?: string;
  sourceTool?: string;
};
//#endregion
//#region src/sessions/user-turn-transcript.types.d.ts
type UserTurnSessionEntry = {
  sessionId: string;
  updatedAt: number;
  sessionFile?: string;
  threadId?: string | number;
} & Record<string, unknown>;
type PersistedUserTurnMediaInput = {
  path?: string | null;
  url?: string | null;
  contentType?: string | null;
  kind?: string | null;
};
type PersistedUserTurnMessage = Extract<
  AgentMessage,
  {
    role: "user";
  }
>;
type UserTurnInput = {
  text?: string | null;
  media?: readonly PersistedUserTurnMediaInput[] | null;
  timestamp?: number;
  idempotencyKey?: string;
  senderIsOwner?: boolean;
  provenance?: InputProvenance;
  mediaOnlyText?: string /** Durable participant attribution. Callers must opt in at the product boundary. */;
  sender?: {
    id?: string | null;
    name?: string | null;
    username?: string | null;
  } | null;
};
type UserTurnTranscriptUpdateMode = "inline" | "none";
type UserTurnBeforeMessageWrite = (params: {
  message: PersistedUserTurnMessage;
  agentId?: string;
  sessionKey?: string;
}) => AgentMessage | null;
type UserTurnTranscriptPersistenceTarget = {
  sessionId: string;
  expectedSessionId?: string;
  sessionKey: string;
  sessionEntry: UserTurnSessionEntry | undefined;
  sessionStore?: Record<string, UserTurnSessionEntry>;
  storePath?: string;
  agentId: string;
  threadId?: string | number;
  cwd?: string;
  config?: unknown;
  beforeMessageWrite?: UserTurnBeforeMessageWrite;
};
type UserTurnTranscriptTarget = UserTurnTranscriptPersistenceTarget;
type UserTurnTranscriptPersistResult = {
  /** True only when this call inserted the transcript message. */ appended?: boolean;
  sessionFile: string;
  sessionEntry: UserTurnSessionEntry | undefined;
  messageId: string;
  message: PersistedUserTurnMessage;
};
type UserTurnTranscriptTargetResolver =
  | UserTurnTranscriptTarget
  | (() => UserTurnTranscriptTarget | undefined | Promise<UserTurnTranscriptTarget | undefined>);
type UserTurnTranscriptRecorder = {
  readonly message: PersistedUserTurnMessage | undefined;
  resolveMessage: () => Promise<PersistedUserTurnMessage | undefined>;
  getPersistedMessage?: () => PersistedUserTurnMessage | undefined;
  markSentToProvider?: () => void;
  markRuntimePersistencePending: (pending: Promise<void>) => void;
  markRuntimePersisted: (message?: PersistedUserTurnMessage) => void;
  markBlocked: () => void;
  hasPersisted: () => boolean;
  isBlocked: () => boolean;
  hasRuntimePersistencePending: () => boolean;
  waitForRuntimePersistence: () => Promise<void>;
  persistApproved: (params?: {
    target?: UserTurnTranscriptTargetResolver;
    updateMode?: UserTurnTranscriptUpdateMode;
    cwd?: string;
  }) => Promise<UserTurnTranscriptPersistResult | undefined>;
  persistBlocked: (
    message: PersistedUserTurnMessage,
    params?: {
      target?: UserTurnTranscriptTargetResolver;
      updateMode?: UserTurnTranscriptUpdateMode;
      cwd?: string;
    },
  ) => Promise<UserTurnTranscriptPersistResult | undefined>;
  persistFallback: (params?: {
    target?: UserTurnTranscriptTargetResolver;
    updateMode?: UserTurnTranscriptUpdateMode;
    cwd?: string;
  }) => Promise<UserTurnTranscriptPersistResult | undefined>;
};
//#endregion
export { UserTurnTranscriptRecorder as n, InputProvenance as r, UserTurnInput as t };
