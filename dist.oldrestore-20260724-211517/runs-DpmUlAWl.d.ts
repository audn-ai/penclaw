import { a as SourceReplyDeliveryMode, o as TaskSuggestionDeliveryMode } from "./types-BgrDi5xH.js";
import { xd as ReplyBackendQueueMessageOptions } from "./types-Ga3mNO_F.js";

//#region src/agents/embedded-agent-runner/run-state.d.ts
/**
 * Shared process state for embedded-agent runs, queues, and snapshots.
 *
 * The maps are global-singleton backed so reloads and lazy imports inside the same gateway process
 * do not split active-run bookkeeping.
 */
type EmbeddedAgentQueueHandle = {
  kind?: "embedded";
  runId?: string;
  queueMessage: (text: string, options?: EmbeddedAgentQueueMessageOptions) => Promise<void>;
  isStreaming: () => boolean;
  isStopped?: () => boolean;
  isAbortable?: () => boolean;
  isCompacting: () => boolean;
  supportsTranscriptCommitWait?: boolean;
  cancel?: (reason?: "user_abort" | "restart" | "superseded") => void;
  abort: (reason?: "restart") => void;
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  taskSuggestionDeliveryMode?: TaskSuggestionDeliveryMode;
};
type EmbeddedAgentQueueMessageOptions = ReplyBackendQueueMessageOptions;
/** Counts active embedded runs while including auto-reply registry runs for shared sessions. */
declare function getActiveEmbeddedRunCount(): number;
/** Lists active embedded-run session keys from both embedded and auto-reply registries. */
declare function listActiveEmbeddedRunSessionKeys(): string[];
/** Lists active embedded-run session ids from all embedded-run lookup maps. */
declare function listActiveEmbeddedRunSessionIds(): string[];
/** Resolves the current session id for an active run after resets or compaction. */
declare function resolveActiveEmbeddedRunSessionId(sessionKey: string): string | undefined;
//#endregion
//#region src/agents/embedded-agent-runner/runs.d.ts
type EmbeddedAgentQueueFailureReason =
  | "no_active_run"
  | "not_streaming"
  | "stale_run"
  | "compacting"
  | "source_reply_delivery_mode_mismatch"
  | "task_suggestion_delivery_mode_mismatch"
  | "transcript_commit_wait_unsupported"
  | "runtime_rejected";
type EmbeddedAgentQueueMessageOutcome =
  | {
      queued: true;
      sessionId: string;
      target: "embedded_run" | "reply_run";
      gatewayHealth: "live";
      deliveredAtMs?: number;
      enqueuedAtMs?: number;
    }
  | {
      queued: false;
      sessionId: string;
      reason: EmbeddedAgentQueueFailureReason;
      gatewayHealth: "live";
      errorMessage?: string;
    };
/**
 * Abort embedded OpenClaw runs.
 *
 * - With a sessionId, aborts that single run.
 * - With no sessionId, supports targeted abort modes (for example, compacting runs only).
 */
declare function abortEmbeddedAgentRun(sessionId: string): boolean;
declare function abortEmbeddedAgentRun(
  sessionId: undefined,
  opts: {
    mode: "all" | "compacting";
    reason?: "restart";
  },
): boolean;
/**
 * Wait for active embedded runs to drain.
 *
 * Used during restarts so in-flight runs can release session write locks before
 * the next lifecycle starts. If no timeout is passed, waits indefinitely.
 */
declare function waitForActiveEmbeddedRuns(
  timeoutMs?: number,
  opts?: {
    pollMs?: number;
  },
): Promise<{
  drained: boolean;
}>;
type AbortAndDrainEmbeddedAgentRunResult = {
  aborted: boolean;
  drained: boolean;
  forceCleared: boolean;
};
declare function abortAndDrainEmbeddedAgentRun(params: {
  sessionId: string;
  sessionKey?: string;
  settleMs?: number;
  forceClear?: boolean;
  reason?: string;
}): Promise<AbortAndDrainEmbeddedAgentRunResult>;
declare function setActiveEmbeddedRun(
  sessionId: string,
  handle: EmbeddedAgentQueueHandle,
  sessionKey?: string,
  sessionFile?: string,
): void;
declare function clearActiveEmbeddedRun(
  sessionId: string,
  handle: EmbeddedAgentQueueHandle,
  sessionKey?: string,
  sessionFile?: string,
  reason?: string,
): void;
//#endregion
export {
  clearActiveEmbeddedRun as a,
  EmbeddedAgentQueueMessageOptions as c,
  listActiveEmbeddedRunSessionKeys as d,
  resolveActiveEmbeddedRunSessionId as f,
  abortEmbeddedAgentRun as i,
  getActiveEmbeddedRunCount as l,
  EmbeddedAgentQueueMessageOutcome as n,
  setActiveEmbeddedRun as o,
  abortAndDrainEmbeddedAgentRun as r,
  waitForActiveEmbeddedRuns as s,
  AbortAndDrainEmbeddedAgentRunResult as t,
  listActiveEmbeddedRunSessionIds as u,
};
