import { n as ResolvedQmdConfig } from "./backend-config-BRooFqzp.js";
import { P as MemorySessionSyncTarget } from "./memory-state-wPutFXhr.js";

//#region packages/memory-host-sdk/src/host/session-transcript-corpus.d.ts
type SessionTranscriptCorpusArtifactKind = "active-session" | "archive-artifact";
type SessionTranscriptCorpusEntry = {
  agentId: string;
  sessionFile: string;
  sessionId: string;
  artifactKind: SessionTranscriptCorpusArtifactKind;
  sessionKey?: string /** Present when an active transcript is addressed by SQLite identity, not a JSONL path. */;
  transcriptSource?: "sqlite" /** Session entry activity timestamp used when the source has no filesystem stat. */;
  updatedAtMs?: number /** True when this transcript belongs to an internal dreaming narrative run. */;
  generatedByDreamingNarrative?: boolean /** True when this transcript belongs to an isolated cron run session. */;
  generatedByCronRun?: boolean;
};
/**
 * Lists transcript corpus entries for QMD/memory indexing.
 *
 * Active sessions come from the session accessor seam; retained reset/delete
 * transcript artifacts remain explicit file artifacts until core owns archive
 * artifact enumeration.
 */
declare function listSessionTranscriptCorpusEntriesForAgent(
  agentId: string,
): Promise<SessionTranscriptCorpusEntry[]>;
//#endregion
//#region packages/memory-host-sdk/src/host/session-files.d.ts
type SessionFileEntry = {
  path: string;
  absPath: string;
  mtimeMs: number;
  size: number;
  hash: string;
  content: string /** Maps each content line (0-indexed) to its 1-indexed JSONL source line. */;
  lineMap: number[] /** Maps each content line (0-indexed) to epoch ms; 0 means unknown timestamp. */;
  messageTimestampsMs: number[] /** True when this transcript belongs to an internal dreaming narrative run. */;
  generatedByDreamingNarrative?: boolean /** True when this transcript belongs to an isolated cron run session. */;
  generatedByCronRun?: boolean;
};
type SessionFileState = Pick<SessionFileEntry, "path" | "absPath" | "mtimeMs" | "size">;
type BuildSessionEntryOptions = {
  /** Optional preclassification from a caller-managed dreaming transcript lookup. */ generatedByDreamingNarrative?: boolean /** Optional preclassification from a caller-managed cron transcript lookup. */;
  generatedByCronRun?: boolean /** Session key for identity-backed transcript readers. */;
  sessionKey?: string /** Activity timestamp for transcript sources that do not have filesystem stats. */;
  updatedAtMs?: number /** Override for tests or specialized callers that need a tighter parse yield cadence. */;
  parseYieldEveryLines?: number;
};
type SessionTranscriptClassification = {
  dreamingNarrativeTranscriptPaths: ReadonlySet<string>;
  cronRunTranscriptPaths: ReadonlySet<string>;
};
type ResolvedMemorySessionSyncTarget = {
  agentId: string;
  sessionFile: string;
  sessionId: string;
};
type ResolvedSessionTranscriptIdentity = {
  agentId: string;
  sessionId: string;
  sessionKey?: string;
};
declare function normalizeSessionTranscriptPathForComparison(pathname: string): string;
declare function loadDreamingNarrativeTranscriptPathSetForAgent(
  agentId: string,
): ReadonlySet<string>;
declare function loadSessionTranscriptClassificationForAgent(
  agentId: string,
): SessionTranscriptClassification;
declare function listSessionFilesForAgent(agentId: string): Promise<string[]>;
declare function sessionPathForFile(absPath: string): string;
/** Returns the logical memory path for a live SQLite-backed session transcript. */
declare function sessionPathForSessionIdentity(agentId: string, sessionId: string): string;
/**
 * Parses a deprecated path-shaped memory sync hint only when it points at an
 * OpenClaw-owned usage-counted transcript in the canonical agent sessions dir.
 */
declare function parseCanonicalSessionSyncTargetFromPath(
  sessionFile: string,
): MemorySessionSyncTarget | null;
/**
 * Resolves a current transcript path back to the canonical session-store
 * identity when available, falling back to the usage-counted file identity.
 */
declare function resolveSessionIdentityForTranscriptFile(
  sessionFile: string,
): ResolvedSessionTranscriptIdentity | null;
/** Resolves only deprecated path-shaped sync targets; live identity uses corpus entries. */
declare function resolveSessionFileForSyncTarget(
  target: MemorySessionSyncTarget,
  defaultAgentId?: string,
): ResolvedMemorySessionSyncTarget | null;
declare function statSessionEntrySync(
  absPath: string,
  opts?: BuildSessionEntryOptions,
): SessionFileState | null;
declare function buildSessionEntry(
  absPath: string,
  opts?: BuildSessionEntryOptions,
): Promise<SessionFileEntry | null>;
//#endregion
//#region packages/memory-host-sdk/src/host/qmd-query-parser.d.ts
/** Normalized qmd query result consumed by memory search. */
type QmdQueryResult = {
  docid?: string;
  score?: number;
  collection?: string;
  file?: string;
  snippet?: string;
  body?: string;
  startLine?: number;
  endLine?: number;
};
/** Parse qmd stdout/stderr into normalized results, accepting known no-result markers. */
declare function parseQmdQueryJson(stdout: string, stderr: string): QmdQueryResult[];
//#endregion
//#region packages/memory-host-sdk/src/host/qmd-scope.d.ts
declare function isQmdScopeAllowed(scope: ResolvedQmdConfig["scope"], sessionKey?: string): boolean;
declare function deriveQmdScopeChannel(key?: string): string | undefined;
declare function deriveQmdScopeChatType(key?: string): "channel" | "group" | "direct" | undefined;
//#endregion
//#region packages/memory-host-sdk/src/host/qmd-process.d.ts
type CliSpawnInvocation = {
  command: string;
  argv: string[];
  shell?: boolean;
  windowsHide?: boolean;
};
type QmdBinaryUnavailableReason = "binary" | "workspace-cwd";
type QmdBinaryUnavailable = {
  available: false;
  /**
   * Optional for source compatibility with older plugin SDK callers that
   * returned only `{ available: false, error }`.
   */
  reason?: QmdBinaryUnavailableReason;
  error: string;
};
type QmdBinaryAvailability =
  | {
      available: true;
    }
  | QmdBinaryUnavailable;
declare function resolveQmdBinaryUnavailableReason(
  result: QmdBinaryUnavailable,
): QmdBinaryUnavailableReason;
declare function resolveCliSpawnInvocation(params: {
  command: string;
  args: string[];
  env: NodeJS.ProcessEnv;
  packageName: string;
}): CliSpawnInvocation;
declare function checkQmdBinaryAvailability(params: {
  command: string;
  env: NodeJS.ProcessEnv;
  cwd?: string;
  timeoutMs?: number;
}): Promise<QmdBinaryAvailability>;
declare function runCliCommand(params: {
  commandSummary: string;
  spawnInvocation: CliSpawnInvocation;
  env: NodeJS.ProcessEnv;
  cwd: string;
  timeoutMs?: number;
  maxOutputChars: number;
  discardStdout?: boolean;
  /**
   * Caller-owned cancellation. When the signal aborts, the spawned child is
   * killed immediately and the call rejects, so a caller that already stopped
   * waiting (for example after its own deadline) does not leave an orphaned
   * process running for the full command timeout.
   */
  signal?: AbortSignal;
}): Promise<{
  stdout: string;
  stderr: string;
}>;
//#endregion
export {
  SessionTranscriptCorpusEntry as A,
  normalizeSessionTranscriptPathForComparison as C,
  sessionPathForFile as D,
  resolveSessionIdentityForTranscriptFile as E,
  sessionPathForSessionIdentity as O,
  loadSessionTranscriptClassificationForAgent as S,
  resolveSessionFileForSyncTarget as T,
  SessionFileState as _,
  resolveCliSpawnInvocation as a,
  listSessionFilesForAgent as b,
  deriveQmdScopeChannel as c,
  QmdQueryResult as d,
  parseQmdQueryJson as f,
  SessionFileEntry as g,
  ResolvedSessionTranscriptIdentity as h,
  checkQmdBinaryAvailability as i,
  listSessionTranscriptCorpusEntriesForAgent as j,
  statSessionEntrySync as k,
  deriveQmdScopeChatType as l,
  ResolvedMemorySessionSyncTarget as m,
  QmdBinaryUnavailable as n,
  resolveQmdBinaryUnavailableReason as o,
  BuildSessionEntryOptions as p,
  QmdBinaryUnavailableReason as r,
  runCliCommand as s,
  QmdBinaryAvailability as t,
  isQmdScopeAllowed as u,
  SessionTranscriptClassification as v,
  parseCanonicalSessionSyncTargetFromPath as w,
  loadDreamingNarrativeTranscriptPathSetForAgent as x,
  buildSessionEntry as y,
};
