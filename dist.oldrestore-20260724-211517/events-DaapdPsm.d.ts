import { J as MemoryDreamingPhaseName } from "./dreaming-CXsB3hVv.js";

//#region src/memory-host-sdk/events.d.ts
/** Workspace-relative JSONL audit log for memory recall, promotion, and dream events. */
declare const MEMORY_HOST_EVENT_LOG_RELATIVE_PATH: string;
/** Event emitted when a recall query records the selected memory snippets. */
type MemoryHostRecallRecordedEvent = {
  type: "memory.recall.recorded";
  timestamp: string;
  query: string;
  resultCount: number;
  results: Array<{
    path: string;
    startLine: number;
    endLine: number;
    score: number;
  }>;
};
/** Event emitted when recall hits are visible but excluded from short-term promotion. */
type MemoryHostRecallSkippedEvent = {
  type: "memory.recall.skipped";
  timestamp: string;
  query: string;
  reason: "non-short-term-memory-path";
  eligibleResultCount: number;
  skippedResultCount: number;
  results: Array<{
    path: string;
    startLine: number;
    endLine: number;
    score: number;
    reason: "non-short-term-memory-path";
  }>;
};
/** Event emitted when deep-dream candidates are promoted into durable memory. */
type MemoryHostPromotionAppliedEvent = {
  type: "memory.promotion.applied";
  timestamp: string;
  memoryPath: string;
  applied: number;
  candidates: Array<{
    key: string;
    path: string;
    startLine: number;
    endLine: number;
    score: number;
    recallCount: number;
  }>;
};
/** Normalized outcome for a dreaming phase run. */
type MemoryDreamOutcome = "completed" | "failed";
/** Event emitted after a dreaming phase writes inline memory and/or reports. */
type MemoryHostDreamCompletedEvent = {
  type: "memory.dream.completed";
  timestamp: string;
  phase: MemoryDreamingPhaseName /** Missing on older event logs; readers should treat absent as "completed". */;
  outcome?: MemoryDreamOutcome /** Error detail when outcome is "failed". */;
  error?: string;
  inlinePath?: string;
  reportPath?: string;
  lineCount: number;
  storageMode: "inline" | "separate" | "both";
};
/** Append-only memory host event schema stored as JSONL. */
type MemoryHostEvent =
  | MemoryHostRecallRecordedEvent
  | MemoryHostPromotionAppliedEvent
  | MemoryHostDreamCompletedEvent;
/** Full event-log record schema, including opt-in diagnostic variants. */
type MemoryHostEventRecord = MemoryHostEvent | MemoryHostRecallSkippedEvent;
/** Resolve the event log path inside a workspace without touching the filesystem. */
declare function resolveMemoryHostEventLogPath(workspaceDir: string): string;
/** Append one memory host event, creating the dreams directory with symlink-safe writes. */
declare function appendMemoryHostEvent(
  workspaceDir: string,
  event: MemoryHostEventRecord,
): Promise<void>;
/** Read recent memory host events, ignoring corrupt JSONL lines left by partial writes. */
declare function readMemoryHostEvents(params: {
  workspaceDir: string;
  limit?: number;
}): Promise<MemoryHostEvent[]>;
/** Read recent memory host event records, including opt-in diagnostic variants. */
declare function readMemoryHostEventRecords(params: {
  workspaceDir: string;
  limit?: number;
}): Promise<MemoryHostEventRecord[]>;
//#endregion
export {
  MemoryHostEventRecord as a,
  MemoryHostRecallSkippedEvent as c,
  readMemoryHostEvents as d,
  resolveMemoryHostEventLogPath as f,
  MemoryHostEvent as i,
  appendMemoryHostEvent as l,
  MemoryDreamOutcome as n,
  MemoryHostPromotionAppliedEvent as o,
  MemoryHostDreamCompletedEvent as r,
  MemoryHostRecallRecordedEvent as s,
  MEMORY_HOST_EVENT_LOG_RELATIVE_PATH as t,
  readMemoryHostEventRecords as u,
};
