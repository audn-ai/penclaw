import {
  _ as ActiveMemoryTranscriptSource,
  ct as TerminalMemorySearchWatch,
  lt as TranscriptReadLimits,
  m as ActiveMemorySearchDebug,
} from "./types-Di2zMoWq.js";

//#region extensions/active-memory/transcript-watch.d.ts
declare function readActiveMemorySearchDebug(
  source: ActiveMemoryTranscriptSource | string,
  limits?: TranscriptReadLimits,
): Promise<ActiveMemorySearchDebug | undefined>;
declare function readMergedActiveMemoryTranscriptState(params: {
  sources: readonly ActiveMemoryTranscriptSource[];
  toolsAllow: readonly string[];
}): Promise<{
  searchDebug?: ActiveMemorySearchDebug;
  hasUsableMemoryResult: boolean;
  hasUnavailableMemorySearchResult: boolean;
}>;
declare function watchTerminalMemorySearchResult(params: {
  getTranscriptSources: () => readonly ActiveMemoryTranscriptSource[];
  abortSignal: AbortSignal;
  toolsAllow: readonly string[];
}): TerminalMemorySearchWatch;
declare function readActiveMemorySearchDebugFromRunResult(
  result: unknown,
): ActiveMemorySearchDebug | undefined;
declare function readActiveMemorySessionFileFromRunResult(result: unknown): string | undefined;
//#endregion
export {
  watchTerminalMemorySearchResult as a,
  readMergedActiveMemoryTranscriptState as i,
  readActiveMemorySearchDebugFromRunResult as n,
  readActiveMemorySessionFileFromRunResult as r,
  readActiveMemorySearchDebug as t,
};
