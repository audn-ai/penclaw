import { ChildProcess } from "node:child_process";
import { IncomingMessage, ServerResponse } from "node:http";
import {
  i as waitForActiveCronTaskRuns,
  r as retireActiveCronTaskRunTracking,
  t as abortActiveCronTaskRuns,
} from "../active-run-cancellation-D2egNSpJ.js";
import {
  C as DiagnosticMemoryUsage,
  x as DiagnosticMemoryPressureEvent,
} from "../diagnostic-events-CKz1uC46.js";
import { u as getRuntimeConfig } from "../io-BbgXkYnD.js";
import {
  d as listActiveEmbeddedRunSessionKeys,
  i as abortEmbeddedAgentRun,
  l as getActiveEmbeddedRunCount,
  s as waitForActiveEmbeddedRuns,
  u as listActiveEmbeddedRunSessionIds,
} from "../runs-DpmUlAWl.js";
import { t as reloadTaskRuntimeStateFromStore } from "../runtime-internal-es7u3tdT.js";
import {
  a as markGatewayDraining,
  c as waitForActiveGatewayRootWork,
  i as getActiveTaskCount,
  l as markRestartAbortedMainSessions,
  o as resetAllLanes,
  s as waitForActiveTasks,
} from "../session-utils-Bi3KLaQV.js";
import { A as rotateAgentEventLifecycleGeneration } from "../types-Dz3ohwUV.js";
import { Gl as TaskRecord, Kl as TaskStatus } from "../types-Ga3mNO_F.js";

//#region src/infra/process-respawn.d.ts
type RespawnMode = "spawned" | "supervised" | "disabled" | "failed";
type GatewayRespawnResult = {
  mode: RespawnMode;
  pid?: number;
  detail?: string;
};
type GatewayUpdateRespawnResult = GatewayRespawnResult & {
  child?: ChildProcess;
};
type GatewayRespawnOptions = {
  env?: NodeJS.ProcessEnv;
};
/**
 * Attempt to restart this process with a fresh PID.
 * - supervised environments (launchd/systemd/schtasks): caller should exit and let supervisor restart
 * - OPENCLAW_NO_RESPAWN=1: caller should keep in-process restart behavior (tests/dev)
 * - unmanaged environments: caller should keep in-process restart behavior so
 *   custom supervisors keep tracking the same gateway PID
 */
declare function restartGatewayProcessWithFreshPid(
  _opts?: GatewayRespawnOptions,
): GatewayRespawnResult;
/**
 * Update restarts must replace the OS process so the new code runs from a
 * fresh module graph after package files have changed on disk.
 *
 * Unlike the generic restart path, update mode allows detached respawn on
 * unmanaged Windows installs because there is no safe in-process fallback once
 * the installed package contents have been replaced.
 */
declare function respawnGatewayProcessForUpdate(
  opts?: GatewayRespawnOptions,
): GatewayUpdateRespawnResult;
//#endregion
//#region src/infra/restart.d.ts
/** Releases a signal fence when the run loop rejects or fails to handle the signal. */
declare function rollbackGatewayRestartSignalAdmission(): boolean;
declare function resetGatewayRestartStateForInProcessRestart(): void;
type RestartAuditInfo = {
  actor?: string;
  deviceId?: string;
  clientIp?: string;
  changedPaths?: string[];
};
type GatewayRestartIntent = {
  reason?: string;
  force?: boolean;
  waitMs?: number;
};
declare function consumeGatewayRestartIntentPayloadSync(
  env?: NodeJS.ProcessEnv,
  now?: number,
): GatewayRestartIntent | null;
declare function consumeGatewayRestartIntentSync(env?: NodeJS.ProcessEnv, now?: number): boolean;
/** Closed restart result for owners that must distinguish coalescing from delivery failure. */
declare function requestGatewayRestartWithSignalAdmission(
  reasonOverride?: string,
  intent?: GatewayRestartIntent,
): GatewayRestartEmitResult;
declare function isGatewaySigusr1RestartExternallyAllowed(): boolean;
declare function consumeGatewaySigusr1RestartAuthorization(): boolean;
declare function peekGatewaySigusr1RestartReason(): string | undefined;
/**
 * Reads and clears only the in-memory intent for the current emitted SIGUSR1 cycle.
 * The restart reason and cycle token are advanced by markGatewaySigusr1RestartHandled().
 */
declare function consumeGatewaySigusr1RestartIntent(): GatewayRestartIntent | null;
/**
 * Mark the currently emitted SIGUSR1 restart cycle as consumed by the run loop.
 * This explicitly advances the cycle state instead of resetting emit guards inside
 * consumeGatewaySigusr1RestartAuthorization().
 */
declare function markGatewaySigusr1RestartHandled(): void;
type RestartEmitHooks = {
  beforeEmit?: () => Promise<void>;
  afterEmitRejected?: () => Promise<void>;
  afterEmitFailed?: () => Promise<void>;
  emitRestart?: GatewayRestartEmitter;
};
type GatewayRestartEmitter = (
  reasonOverride?: string,
  intent?: GatewayRestartIntent,
) => GatewayRestartEmitResult;
type GatewayRestartEmitResult =
  | {
      status: "emitted";
    }
  | {
      status: "coalesced";
    }
  | {
      status: "failed";
    };
declare function resolveGatewayRestartDeferralTimeoutMs(timeoutMs: unknown): number | undefined;
type ScheduledRestart = {
  ok: boolean;
  pid: number;
  signal: "SIGUSR1";
  delayMs: number;
  reason?: string;
  mode: "emit" | "signal" | "supervisor";
  coalesced: boolean;
  cooldownMsApplied: number;
  emitHooksQueued: boolean;
};
declare function scheduleGatewaySigusr1Restart(opts?: {
  delayMs?: number;
  reason?: string;
  audit?: RestartAuditInfo;
  emitHooks?: RestartEmitHooks;
  preservePendingEmitHooksOnDeferralBypass?: boolean;
  sessionKey?: string;
  skipDeferral?: boolean;
  skipCooldown?: boolean;
}): ScheduledRestart;
//#endregion
//#region src/infra/restart-handoff.d.ts
declare const GATEWAY_SUPERVISOR_RESTART_HANDOFF_KIND = "gateway-supervisor-restart-handoff";
type GatewayRestartHandoffRestartKind = "full-process" | "update-process";
type GatewayRestartHandoffSource =
  | "config-write"
  | "gateway-update"
  | "operator-restart"
  | "plugin-change"
  | "signal"
  | "unknown";
type GatewayRestartHandoffSupervisorMode = "launchd" | "systemd" | "schtasks" | "external";
type GatewayRestartHandoff = {
  kind: typeof GATEWAY_SUPERVISOR_RESTART_HANDOFF_KIND;
  version: 1;
  intentId: string;
  pid: number;
  processInstanceId?: string;
  createdAt: number;
  expiresAt: number;
  reason?: string;
  source: GatewayRestartHandoffSource;
  restartKind: GatewayRestartHandoffRestartKind;
  supervisorMode: GatewayRestartHandoffSupervisorMode;
  restartTrace?: {
    startedAt: number;
    lastAt: number;
  };
};
/** Write the bounded supervisor restart handoff atomically. */
declare function writeGatewayRestartHandoffSync(opts: {
  env?: NodeJS.ProcessEnv;
  pid?: number;
  processInstanceId?: string;
  reason?: string;
  source?: GatewayRestartHandoffSource;
  restartKind: GatewayRestartHandoffRestartKind;
  supervisorMode?: GatewayRestartHandoffSupervisorMode | null;
  restartTrace?: GatewayRestartHandoff["restartTrace"];
  ttlMs?: number;
  createdAt?: number;
}): GatewayRestartHandoff | null;
//#endregion
//#region src/tasks/task-restart-blocker.d.ts
type ActiveTaskRestartBlocker = {
  taskId: string;
  status: Extract<TaskStatus, "running">;
  runtime: TaskRecord["runtime"];
  runId?: string;
  label?: string;
  title?: string;
};
//#endregion
//#region src/infra/gateway-suspend-coordinator.d.ts
declare function resetGatewaySuspendCoordinatorForLifecycleRestart(): void;
//#endregion
//#region src/infra/restart-sentinel.d.ts
type RestartSentinelLog = {
  stdoutTail?: string | null;
  stderrTail?: string | null;
  exitCode?: number | null;
};
type RestartSentinelStep = {
  name: string;
  command: string;
  cwd?: string | null;
  durationMs?: number | null;
  log?: RestartSentinelLog | null;
};
type RestartSentinelStats = {
  mode?: string;
  root?: string;
  requiresRestart?: boolean;
  handoffId?: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  steps?: RestartSentinelStep[];
  reason?: string | null;
  durationMs?: number | null;
};
type RestartSentinelContinuation =
  | {
      kind: "systemEvent";
      text: string;
    }
  | {
      kind: "agentTurn";
      message: string;
    };
type RestartSentinelPayload = {
  kind: "config-apply" | "config-auto-recovery" | "config-patch" | "update" | "restart";
  status: "ok" | "error" | "skipped";
  ts: number;
  sessionKey?: string /** Delivery context captured at restart time to ensure channel routing survives restart. */;
  deliveryContext?: {
    channel?: string;
    to?: string;
    accountId?: string;
  } /** Thread ID for reply threading (e.g., Slack thread_ts). */;
  threadId?: string;
  message?: string | null;
  continuation?: RestartSentinelContinuation | null;
  doctorHint?: string | null;
  stats?: RestartSentinelStats | null;
};
type RestartSentinel = {
  version: 1;
  payload: RestartSentinelPayload;
};
declare function markUpdateRestartSentinelFailure(
  reason: string,
  env?: NodeJS.ProcessEnv,
): Promise<RestartSentinel | null>;
//#endregion
//#region src/infra/supervisor-markers.d.ts
/** Supported supervisor families that can respawn the gateway after update/restart handoff. */
type RespawnSupervisor = "launchd" | "systemd" | "schtasks";
interface DetectRespawnSupervisorOptions {
  includeLinuxOpenClawGatewayServiceMarker?: boolean;
}
/** Detects the current platform supervisor from process environment hints. */
declare function detectRespawnSupervisor(
  env?: NodeJS.ProcessEnv,
  platform?: NodeJS.Platform,
  options?: DetectRespawnSupervisorOptions,
): RespawnSupervisor | null;
//#endregion
//#region src/logging/diagnostic-stability-bundle.d.ts
type DiagnosticHeapSpaceSummary = {
  spaceName: string;
  spaceSizeBytes: number;
  spaceUsedBytes: number;
  spaceAvailableBytes: number;
  physicalSpaceSizeBytes: number;
};
type DiagnosticHeapStatisticsSummary = {
  totalHeapSizeBytes: number;
  totalHeapSizeExecutableBytes: number;
  totalPhysicalSizeBytes: number;
  totalAvailableSizeBytes: number;
  usedHeapSizeBytes: number;
  heapSizeLimitBytes: number;
  mallocedMemoryBytes: number;
  externalMemoryBytes: number;
};
type DiagnosticActiveResourceSummary = {
  total: number;
  byType: Record<string, number>;
};
type DiagnosticCgroupMemorySummary = {
  version: "v2";
  values: Record<string, number | "max">;
  events: Record<string, number>;
};
type DiagnosticSessionFileSummary = {
  relativePath: string;
  sizeBytes: number;
  mtimeMs: number;
};
type DiagnosticMemoryPressureBundleEvidence = {
  level: DiagnosticMemoryPressureEvent["level"];
  reason: DiagnosticMemoryPressureEvent["reason"];
  memory: DiagnosticMemoryUsage;
  thresholdBytes?: number;
  rssGrowthBytes?: number;
  windowMs?: number;
  heapStatistics?: DiagnosticHeapStatisticsSummary;
  heapSpaces?: DiagnosticHeapSpaceSummary[];
  cgroup?: DiagnosticCgroupMemorySummary;
  activeResources?: DiagnosticActiveResourceSummary;
  topSessionFiles?: DiagnosticSessionFileSummary[];
};
type DiagnosticStabilityBundleEvidence = {
  memoryPressure?: DiagnosticMemoryPressureBundleEvidence;
};
type WriteDiagnosticStabilityBundleOptions = {
  reason: string;
  error?: unknown;
  includeEmpty?: boolean;
  limit?: number;
  now?: Date;
  env?: NodeJS.ProcessEnv;
  stateDir?: string;
  retention?: number;
  evidence?: DiagnosticStabilityBundleEvidence;
};
type DiagnosticStabilityBundleFailureWriteOutcome =
  | {
      status: "written";
      message: string;
      path: string;
    }
  | {
      status: "failed";
      message: string;
      error: unknown;
    }
  | {
      status: "skipped";
      reason: "empty";
    };
type WriteDiagnosticStabilityBundleForFailureOptions = Omit<
  WriteDiagnosticStabilityBundleOptions,
  "error" | "includeEmpty" | "reason"
>;
declare function writeDiagnosticStabilityBundleForFailureSync(
  reason: string,
  error?: unknown,
  options?: WriteDiagnosticStabilityBundleForFailureOptions,
): DiagnosticStabilityBundleFailureWriteOutcome;
//#endregion
//#region src/cron/active-jobs.d.ts
declare function waitForActiveCronJobs(timeoutMs: number): Promise<{
  drained: boolean;
  active: number;
}>;
/** Starts a new process-lifecycle generation without clearing still-finalizing old runs. */
declare function advanceCronActiveJobGeneration(): void;
/** Clears process-global cron active-job state at process-lifecycle boundaries. */
declare function resetCronActiveJobs(): void;
//#endregion
//#region src/tasks/task-registry.maintenance.d.ts
declare function getInspectableActiveTaskRestartBlockers(): ActiveTaskRestartBlocker[];
//#endregion
//#region src/gateway/server-reload-handlers.d.ts
/** Signal any in-progress deferred channel reload to abort immediately. */
declare function abortPendingChannelReloads(): void;
//#endregion
export {
  abortActiveCronTaskRuns,
  abortEmbeddedAgentRun,
  abortPendingChannelReloads,
  advanceCronActiveJobGeneration,
  consumeGatewayRestartIntentPayloadSync,
  consumeGatewayRestartIntentSync,
  consumeGatewaySigusr1RestartAuthorization,
  consumeGatewaySigusr1RestartIntent,
  detectRespawnSupervisor,
  getActiveEmbeddedRunCount,
  getActiveTaskCount,
  getInspectableActiveTaskRestartBlockers,
  getRuntimeConfig,
  isGatewaySigusr1RestartExternallyAllowed,
  listActiveEmbeddedRunSessionIds,
  listActiveEmbeddedRunSessionKeys,
  markGatewayDraining,
  markGatewaySigusr1RestartHandled,
  markRestartAbortedMainSessions,
  markUpdateRestartSentinelFailure,
  peekGatewaySigusr1RestartReason,
  reloadTaskRuntimeStateFromStore,
  requestGatewayRestartWithSignalAdmission,
  resetAllLanes,
  resetCronActiveJobs,
  resetGatewayRestartStateForInProcessRestart,
  resetGatewaySuspendCoordinatorForLifecycleRestart,
  resolveGatewayRestartDeferralTimeoutMs,
  respawnGatewayProcessForUpdate,
  restartGatewayProcessWithFreshPid,
  retireActiveCronTaskRunTracking,
  rollbackGatewayRestartSignalAdmission,
  rotateAgentEventLifecycleGeneration,
  scheduleGatewaySigusr1Restart,
  waitForActiveCronJobs,
  waitForActiveCronTaskRuns,
  waitForActiveEmbeddedRuns,
  waitForActiveGatewayRootWork,
  waitForActiveTasks,
  writeDiagnosticStabilityBundleForFailureSync,
  writeGatewayRestartHandoffSync,
};
