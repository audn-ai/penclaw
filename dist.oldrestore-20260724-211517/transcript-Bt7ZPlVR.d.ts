import {
  _ as ActiveMemoryTranscriptSource,
  lt as TranscriptReadLimits,
  m as ActiveMemorySearchDebug,
} from "./types-Di2zMoWq.js";

//#region extensions/active-memory/transcript.d.ts
declare function isUnavailableMemorySearchDebug(debug?: ActiveMemorySearchDebug): boolean;
declare function resolveTranscriptReadLimits(
  limits?: TranscriptReadLimits,
): Required<TranscriptReadLimits>;
declare function fileTranscriptSource(sessionFile: string): ActiveMemoryTranscriptSource;
declare function transcriptSourceFromReturnedSessionFile(params: {
  sessionFile: string;
  sessionKey: string;
}): ActiveMemoryTranscriptSource;
declare function streamActiveMemoryTranscriptRecords(params: {
  source: ActiveMemoryTranscriptSource;
  limits?: TranscriptReadLimits;
  onRecord: (record: unknown) => boolean | void;
}): Promise<void>;
declare function extractActiveMemorySearchDebugFromSessionRecord(
  value: unknown,
): ActiveMemorySearchDebug | undefined;
declare function extractToolResultNameFromSessionRecord(value: unknown): string | undefined;
declare function hasUnavailableMemoryResultInSessionRecord(
  value: unknown,
  toolsAllow?: readonly string[],
): boolean;
declare function hasTerminalUnavailableMemoryResultInSessionRecord(
  value: unknown,
  toolsAllow: readonly string[],
): boolean;
type ActiveMemoryHookDeadline = {
  arm: (timeoutMs: number, onTimeout: () => void) => void;
  promise: Promise<symbol>;
  stop: () => void;
};
declare function createActiveMemoryHookDeadline(): ActiveMemoryHookDeadline;
declare function hasUsableMemoryResultInSessionRecord(
  value: unknown,
  toolsAllow?: readonly string[],
): boolean;
//#endregion
export {
  hasTerminalUnavailableMemoryResultInSessionRecord as a,
  isUnavailableMemorySearchDebug as c,
  transcriptSourceFromReturnedSessionFile as d,
  fileTranscriptSource as i,
  resolveTranscriptReadLimits as l,
  extractActiveMemorySearchDebugFromSessionRecord as n,
  hasUnavailableMemoryResultInSessionRecord as o,
  extractToolResultNameFromSessionRecord as r,
  hasUsableMemoryResultInSessionRecord as s,
  createActiveMemoryHookDeadline as t,
  streamActiveMemoryTranscriptRecords as u,
};
