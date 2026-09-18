import { i as RestartRecoveryRun } from "./types-Dk-ocvLl.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region src/agents/main-session-restart-recovery.d.ts
declare function markRestartAbortedMainSessions(params: {
  cfg?: OpenClawConfig;
  additionalCfgs?: Iterable<OpenClawConfig | undefined>;
  stateDir?: string;
  sessionKeys?: Iterable<string>;
  sessionIds?: Iterable<string>;
  activeRuns?: Iterable<
    RestartRecoveryRun & {
      sessionKey: string;
      sessionId: string;
      observedAt?: number;
    }
  >;
  isActiveRun?: (
    run: RestartRecoveryRun & {
      sessionKey: string;
      sessionId: string;
      observedAt?: number;
    },
  ) => boolean;
  reason?: string;
}): Promise<{
  marked: number;
  skipped: number;
}>;
//#endregion
//#region src/process/gateway-work-admission.d.ts
/** Waits for admitted root transactions after restart has closed new admission. */
declare function waitForActiveGatewayRootWork(timeoutMs?: number): Promise<{
  drained: boolean;
  active: number;
}>;
//#endregion
//#region src/process/command-queue.d.ts
/**
 * Mark gateway as draining for restart so new enqueues fail fast with
 * `GatewayDrainingError` instead of being silently killed on shutdown.
 */
declare function markGatewayDraining(): void;
/**
 * Reset all lane runtime state to idle. Used after SIGUSR1 in-process
 * restarts where interrupted tasks' finally blocks may not run, leaving
 * stale active task IDs that permanently block new work from draining.
 *
 * Bumps lane generation and clears execution counters so stale completions
 * from old in-flight tasks are ignored. Queued entries are intentionally
 * preserved — they represent pending user work that should still execute
 * after restart.
 *
 * After resetting, drains any lanes that still have queued entries so
 * preserved work is pumped immediately rather than waiting for a future
 * `enqueueCommandInLane()` call (which may never come).
 */
declare function resetAllLanes(): void;
/**
 * Returns the total number of actively executing tasks across all lanes
 * (excludes queued-but-not-started entries).
 */
declare function getActiveTaskCount(): number;
/**
 * Wait for all currently active tasks across all lanes to finish.
 * Polls at a short interval; resolves when no tasks are active or
 * when `timeoutMs` elapses (whichever comes first). If no timeout is passed,
 * waits indefinitely for the active set captured at call time.
 *
 * New tasks enqueued after this call are ignored — only tasks that are
 * already executing are waited on.
 */
declare function waitForActiveTasks(timeoutMs?: number): Promise<{
  drained: boolean;
}>;
//#endregion
//#region src/infra/heartbeat-runner.d.ts
type HeartbeatRunner = {
  stop: () => void;
  updateConfig: (cfg: OpenClawConfig) => void;
};
//#endregion
//#region src/plugins/services.d.ts
type PluginServicesHandle = {
  stop: () => Promise<void>;
};
//#endregion
//#region src/gateway/server-startup-post-attach.d.ts
type Awaitable<T> = T | Promise<T>;
type GatewayPostReadySidecarHandle = {
  stop: () => Awaitable<void>;
};
//#endregion
export {
  markGatewayDraining as a,
  waitForActiveGatewayRootWork as c,
  getActiveTaskCount as i,
  markRestartAbortedMainSessions as l,
  PluginServicesHandle as n,
  resetAllLanes as o,
  HeartbeatRunner as r,
  waitForActiveTasks as s,
  GatewayPostReadySidecarHandle as t,
};
