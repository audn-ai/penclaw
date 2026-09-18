import {
  _ as ActiveMemoryTranscriptSource,
  b as ActiveRecallResult,
  et as RecallSubagentResult,
  lt as TranscriptReadLimits,
  m as ActiveMemorySearchDebug,
} from "./types-Di2zMoWq.js";

//#region extensions/active-memory/transcript-result.d.ts
declare function readMemoryToolResultEvidence(params: {
  toolName: string;
  result: unknown;
  isError: boolean;
  toolsAllow: readonly string[];
}): {
  hasUsableMemoryResult: boolean;
  hasUnavailableMemorySearchResult: boolean;
};
declare function readPartialAssistantText(
  source: ActiveMemoryTranscriptSource | string | undefined,
  limits?: TranscriptReadLimits,
): Promise<string | null>;
declare function readPartialAssistantTextFromSources(
  sources: readonly ActiveMemoryTranscriptSource[],
  limits?: TranscriptReadLimits,
): Promise<string | null>;
declare function attachPartialTimeoutData(
  error: unknown,
  partialReply: string | null,
  searchDebug: ActiveMemorySearchDebug | undefined,
  hasUnavailableMemorySearchResult: boolean,
): void;
declare function readPartialTimeoutData(error: unknown): {
  rawReply?: string;
  searchDebug?: ActiveMemorySearchDebug;
  hasUnavailableMemorySearchResult?: boolean;
};
declare function buildTimeoutRecallResult(params: {
  elapsedMs: number;
  maxSummaryChars: number;
  transcriptSources: readonly ActiveMemoryTranscriptSource[];
  rawReply?: string;
  searchDebug?: ActiveMemorySearchDebug;
  hasUnavailableMemorySearchResult?: boolean;
  subagentPromise?: Promise<RecallSubagentResult>;
  toolsAllow: readonly string[];
}): Promise<ActiveRecallResult>;
declare function buildSubagentRecallResult(params: {
  subagentResult: RecallSubagentResult;
  fallbackSearchDebug?: ActiveMemorySearchDebug;
  fallbackHasUsableMemoryResult?: boolean;
  elapsedMs: number;
  maxSummaryChars: number;
}): ActiveRecallResult;
declare function resetActiveMemoryTranscriptForTests(): void;
declare function setTimeoutPartialDataGraceMsForTests(value: number): void;
//#endregion
export {
  readPartialAssistantText as a,
  resetActiveMemoryTranscriptForTests as c,
  readMemoryToolResultEvidence as i,
  setTimeoutPartialDataGraceMsForTests as l,
  buildSubagentRecallResult as n,
  readPartialAssistantTextFromSources as o,
  buildTimeoutRecallResult as r,
  readPartialTimeoutData as s,
  attachPartialTimeoutData as t,
};
