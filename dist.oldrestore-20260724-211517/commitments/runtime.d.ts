import {
  a as CommitmentScope,
  n as CommitmentExtractionBatchResult,
  r as CommitmentExtractionItem,
} from "../types-B3lUN4pX.js";
import { i as OpenClawConfig } from "../types.openclaw-DDo8sH3F.js";

//#region src/commitments/runtime.d.ts
type TimerHandle = ReturnType<typeof setTimeout>;
type ModelRef = {
  provider: string;
  model: string;
};
type CommitmentExtractionEnqueueInput = CommitmentScope & {
  cfg?: OpenClawConfig;
  nowMs?: number;
  userText: string;
  assistantText?: string;
  sourceMessageId?: string;
  sourceRunId?: string;
};
type CommitmentExtractionRuntime = {
  extractBatch?: (params: {
    cfg?: OpenClawConfig;
    items: CommitmentExtractionItem[];
  }) => Promise<CommitmentExtractionBatchResult>;
  resolveDefaultModel?: (params: { cfg: OpenClawConfig; agentId?: string }) => ModelRef;
  setTimer?: (callback: () => void, delayMs: number) => TimerHandle;
  clearTimer?: (timer: TimerHandle) => void;
  forceInTests?: boolean;
};
/** Installs runtime hooks for extraction tests or alternate batch extraction. */
declare function configureCommitmentExtractionRuntime(next: CommitmentExtractionRuntime): void;
/** Clears queued work, timers, and injected hooks for isolated tests. */
declare function resetCommitmentExtractionRuntimeForTests(): void;
/** Enqueues one completed turn for delayed commitment extraction. */
declare function enqueueCommitmentExtraction(input: CommitmentExtractionEnqueueInput): boolean;
/** Drains queued extraction work in batches and returns processed item count. */
declare function drainCommitmentExtractionQueue(): Promise<number>;
//#endregion
export {
  configureCommitmentExtractionRuntime,
  drainCommitmentExtractionQueue,
  enqueueCommitmentExtraction,
  resetCommitmentExtractionRuntimeForTests,
};
