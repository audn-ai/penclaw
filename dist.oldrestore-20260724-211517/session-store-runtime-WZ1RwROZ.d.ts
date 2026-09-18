import { r as SessionTranscriptEvent } from "./session-transcript-runtime-D2F56R9O.js";
import { a as ResolvedSessionMaintenanceConfigInput } from "./store-DqqHyvXY.js";
import { s as SessionEntry, t as AmbientTranscriptWatermark } from "./types-Dk-ocvLl.js";
//#region src/config/sessions/ambient-transcript-watermark.d.ts
type AmbientTranscriptWatermarkScope = {
  channel: string;
  accountId?: string;
  conversationId: string;
  threadId?: string | number;
};
declare function resolveAmbientTranscriptWatermarkKey(
  scope: AmbientTranscriptWatermarkScope,
): string;
declare function updateAmbientTranscriptWatermark(params: {
  storePath: string;
  sessionKey: string;
  key: string;
  messageId: string;
  timestampMs?: number;
  expectedSessionId?: string;
}): Promise<SessionEntry | null>;
//#endregion
//#region src/config/sessions/sqlite-marker.d.ts
type SqliteSessionFileMarker = {
  agentId: string;
  sessionId: string;
  storePath: string;
};
/** Formats the canonical sessionFile marker for SQLite-backed transcripts. */
declare function formatSqliteSessionFileMarker(marker: SqliteSessionFileMarker): string;
/** Parses a SQLite-backed transcript sessionFile marker. */
declare function parseSqliteSessionFileMarker(
  sessionFile: string | undefined,
): SqliteSessionFileMarker | undefined;
/** Checks whether a sessionFile marker points at the expected session id. */
declare function sqliteSessionFileMarkerMatchesSession(
  sessionFile: string | undefined,
  sessionId: string,
): boolean;
//#endregion
//#region src/sessions/agent-harness-session-key.d.ts
type AgentHarnessSessionStoreEntry = {
  agentHarnessId?: unknown;
  modelSelectionLocked?: unknown;
  sessionId?: unknown;
};
/** Preserves durable harness ownership across whole-store compatibility projections. */
/** True for any valid durable harness lock, including supported ordinary-key rows. */
declare function isValidAgentHarnessSessionStoreEntry(
  sessionKey: string,
  entry: AgentHarnessSessionStoreEntry,
): boolean;
//#endregion
//#region src/plugin-sdk/session-store-runtime.d.ts
type SessionStoreReadParams = {
  agentId?: string;
  env?: NodeJS.ProcessEnv;
  hydrateSkillPromptRefs?: boolean;
  readConsistency?: "latest";
  sessionKey: string;
  storePath?: string;
};
type SessionStoreListParams = Partial<Omit<SessionStoreReadParams, "sessionKey">>;
type SessionStoreEntrySummary = {
  sessionKey: string;
  entry: SessionEntry;
};
type LoadSessionStoreOptions = {
  skipCache?: boolean;
  hydrateSkillPromptRefs?: boolean;
};
type UpdateSessionStoreOptions<T> = {
  activeSessionKey?: string;
  skipMaintenance?: boolean;
  skipSaveWhenResult?: (result: T) => boolean;
};
type SessionStoreTranscriptEvent = SessionTranscriptEvent;
type SessionStoreEntryUpdate = (
  entry: SessionEntry,
) => Promise<Partial<SessionEntry> | null> | Partial<SessionEntry> | null;
type SessionStoreEntryPatch = (
  entry: SessionEntry,
  context: {
    existingEntry?: SessionEntry;
  },
) => Promise<Partial<SessionEntry> | null> | Partial<SessionEntry> | null;
type PatchSessionEntryParams = SessionStoreReadParams & {
  fallbackEntry?: SessionEntry;
  maintenanceConfig?: ResolvedSessionMaintenanceConfigInput;
  preserveActivity?: boolean;
  requireWriteSuccess?: boolean;
  replaceEntry?: boolean;
  skipMaintenance?: boolean;
  update: SessionStoreEntryPatch;
};
type ReadAmbientTranscriptWatermarkParams = SessionStoreReadParams & {
  key: string;
};
type UpdateSessionStoreEntryParams = {
  storePath: string;
  sessionKey: string;
  update: SessionStoreEntryUpdate;
  skipMaintenance?: boolean;
  takeCacheOwnership?: boolean;
  requireWriteSuccess?: boolean;
};
type UpsertSessionEntryParams = SessionStoreReadParams & {
  entry: SessionEntry;
};
type DeleteSessionEntryParams = SessionStoreReadParams & {
  archiveTranscript?: boolean;
};
type SessionLifecycleArtifactsCleanupParams = {
  agentId?: string;
  archiveRemovedEntryTranscripts?: boolean;
  env?: NodeJS.ProcessEnv;
  orphanTranscriptMinAgeMs: number;
  sessionStore?: string;
  sessionKeySegmentPrefix: string;
  storePath?: string;
  transcriptContentMarker: string;
  nowMs?: number;
};
type SessionLifecycleArtifactsCleanupResult = {
  archivedTranscriptArtifacts: number;
  removedEntries: number;
};
/**
 * @deprecated Use getSessionEntry or listSessionEntries.
 *
 * Official plugins released with v2026.7.1-beta.5 import this symbol. Keep the
 * compatibility projection through 2026-10-12, then remove it only after the
 * minimum supported plugin version excludes that release.
 */
declare function loadSessionStore(
  storePath: string,
  options?: LoadSessionStoreOptions,
): Record<string, SessionEntry>;
/**
 * @deprecated Use patchSessionEntry, upsertSessionEntry, or deleteSessionEntry.
 *
 * Official plugins released with v2026.7.1-beta.5 import this symbol. Keep the
 * compatibility bridge through 2026-10-12. The callback mutates a detached
 * projection; the resulting row diff commits through the SQLite accessor.
 * Beta.5 memory-core already uses cleanupSessionLifecycleArtifacts; this
 * whole-store callback remains only for Feishu doctor's explicit repair flow.
 */
declare function updateSessionStore<T>(
  storePath: string,
  mutator: (store: Record<string, SessionEntry>) => Promise<T> | T,
  options?: UpdateSessionStoreOptions<T>,
): Promise<T>;
/**
 * @deprecated Resolve transcript identities with loadTranscriptEventsSync.
 *
 * Beta.5 Feishu doctor still inspects JSONL paths synchronously. SQLite
 * markers therefore materialize a bounded export at the canonical legacy path
 * rather than making the old doctor classify every healthy transcript as
 * missing. These files are durable because beta.5 renames repaired transcripts
 * to recovery archives; remove this bridge only after beta.5 is unsupported.
 */
declare function resolveSessionFilePath(
  sessionId: string,
  entry?: {
    sessionFile?: string;
  },
  options?: {
    agentId?: string;
    sessionsDir?: string;
  },
): string;
/**
 * Resolves the configured session store path.
 *
 * Beta.5 resolves a configured path with an agent id, then passes only the
 * path to loadSessionStore/updateSessionStore. Its shipped callers either
 * consume the selection synchronously or dedupe by path, so retaining the
 * latest selection preserves that bounded compatibility contract.
 */
declare function resolveStorePath(
  store?: string,
  options?: {
    agentId?: string;
    env?: NodeJS.ProcessEnv;
  },
): string;
/**
 * @deprecated Use getSessionEntry with a storage-neutral session identity.
 *
 * Official plugins released with v2026.7.1-beta.5 import this whole-store
 * lookup helper. Keep it through 2026-10-12 with the other beta.5 bridge.
 */
declare function resolveSessionStoreEntry(params: {
  store: Record<string, SessionEntry>;
  sessionKey: string;
}): {
  normalizedKey: string;
  existing: SessionEntry | undefined;
  legacyKeys: string[];
};
/** Loads one session entry by agent/session identity. */
declare function getSessionEntry(params: SessionStoreReadParams): SessionEntry | undefined;
/** Lists session entries for one agent. */
declare function listSessionEntries(params?: SessionStoreListParams): SessionStoreEntrySummary[];
/** Reads transcript events for a live SQLite-backed session identity. */
declare function loadTranscriptEventsSync(params: {
  agentId?: string;
  env?: NodeJS.ProcessEnv;
  sessionId: string;
  sessionKey?: string;
  storePath?: string;
}): SessionStoreTranscriptEvent[];
/** Reads transcript freshness and byte size without materializing event rows. */
declare function readTranscriptStatsSync(params: {
  agentId?: string;
  env?: NodeJS.ProcessEnv;
  sessionId: string;
  sessionKey?: string;
  storePath?: string;
}): {
  eventCount: number;
  maxSeq: number;
  sizeBytes: number;
};
/** Resolves the persisted session key for one SQLite transcript identity. */
declare function resolveTranscriptSessionKeyBySessionId(params: {
  agentId?: string;
  env?: NodeJS.ProcessEnv;
  sessionId: string;
  storePath?: string;
}): string | undefined;
/** Patches one session entry by agent/session identity. */
declare function patchSessionEntry(params: PatchSessionEntryParams): Promise<SessionEntry | null>;
/** Reads the last activity timestamp for one session entry. */
declare function readSessionUpdatedAt(params: SessionStoreReadParams): number | undefined;
declare function readAmbientTranscriptWatermark(
  params: ReadAmbientTranscriptWatermarkParams,
): AmbientTranscriptWatermark | undefined;
/** Updates an existing session entry by store path and session key. */
declare function updateSessionStoreEntry(
  params: UpdateSessionStoreEntryParams,
): Promise<SessionEntry | null>;
/** Replaces or creates one session entry by agent/session identity. */
declare function upsertSessionEntry(params: UpsertSessionEntryParams): Promise<void>;
/** Deletes one session entry by agent/session identity. */
declare function deleteSessionEntry(params: DeleteSessionEntryParams): Promise<boolean>;
/** Resolves the file artifacts that should be backed up before mutating a session store. */
declare function resolveSessionStoreBackupPaths(params: {
  agentId?: string;
  storePath: string;
}): string[];
/** Cleans stale lifecycle-owned session entries and orphan transcripts for one agent store. */
declare function cleanupSessionLifecycleArtifacts(
  params: SessionLifecycleArtifactsCleanupParams,
): Promise<SessionLifecycleArtifactsCleanupResult>;
//#endregion
export {
  SqliteSessionFileMarker as C,
  AmbientTranscriptWatermarkScope as D,
  sqliteSessionFileMarkerMatchesSession as E,
  resolveAmbientTranscriptWatermarkKey as O,
  isValidAgentHarnessSessionStoreEntry as S,
  parseSqliteSessionFileMarker as T,
  resolveStorePath as _,
  deleteSessionEntry as a,
  updateSessionStoreEntry as b,
  loadSessionStore as c,
  readAmbientTranscriptWatermark as d,
  readSessionUpdatedAt as f,
  resolveSessionStoreEntry as g,
  resolveSessionStoreBackupPaths as h,
  cleanupSessionLifecycleArtifacts as i,
  updateAmbientTranscriptWatermark as k,
  loadTranscriptEventsSync as l,
  resolveSessionFilePath as m,
  SessionStoreTranscriptEvent as n,
  getSessionEntry as o,
  readTranscriptStatsSync as p,
  UpdateSessionStoreOptions as r,
  listSessionEntries as s,
  LoadSessionStoreOptions as t,
  patchSessionEntry as u,
  resolveTranscriptSessionKeyBySessionId as v,
  formatSqliteSessionFileMarker as w,
  upsertSessionEntry as x,
  updateSessionStore as y,
};
