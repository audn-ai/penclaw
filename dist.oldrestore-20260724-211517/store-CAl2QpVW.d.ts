import { DatabaseSync } from "node:sqlite";
import { t as ChannelId } from "./channel-id.types-DjYEl-_2.js";
import { l as HookExternalContentSource } from "./external-content-C64gU-f-.js";
import { n as FailoverReason } from "./types-CF0DHR3y.js";

//#region src/agents/embedded-agent-runner/execution-phase.d.ts
/**
 * Ordered execution milestones reported by the embedded runner while a turn starts up.
 *
 * Keep labels stable: external status surfaces and diagnostics consume the formatted values.
 */
declare const EMBEDDED_AGENT_EXECUTION_PHASES: readonly [
  "runner_entered",
  "workspace",
  "runtime_plugins",
  "before_agent_reply",
  "model_resolution",
  "auth",
  "context_engine",
  "attempt_dispatch",
  "context_assembled",
  "turn_accepted",
  "process_spawned",
  "tool_execution_started",
  "assistant_output_started",
  "model_call_started",
];
type EmbeddedAgentExecutionPhase = (typeof EMBEDDED_AGENT_EXECUTION_PHASES)[number];
//#endregion
//#region src/cron/types-shared.d.ts
/** Shared persisted cron job envelope used by runtime and external config shapes. */
type CronJobBase<TSchedule, TSessionTarget, TWakeMode, TPayload, TDelivery, TFailureAlert> = {
  id: string;
  agentId?: string;
  sessionKey?: string;
  name: string;
  description?: string;
  enabled: boolean;
  deleteAfterRun?: boolean;
  createdAtMs: number;
  updatedAtMs: number;
  schedule: TSchedule;
  sessionTarget: TSessionTarget;
  wakeMode: TWakeMode;
  payload: TPayload;
  delivery?: TDelivery;
  failureAlert?: TFailureAlert;
};
//#endregion
//#region src/cron/types.d.ts
/** Supported schedule forms persisted in cron job specs. */
type CronSchedule =
  | {
      kind: "at";
      at: string;
    }
  | {
      kind: "every";
      everyMs: number;
      anchorMs?: number;
    }
  | {
      kind: "cron";
      expr: string;
      tz?: string /** Optional deterministic stagger window in milliseconds (0 keeps exact schedule). */;
      staggerMs?: number;
    }
  | {
      /**
       * Event-driven (non-time) trigger: the job fires once when a gateway-owned
       * watcher process running `command` exits. The watcher lives under the
       * gateway ProcessSupervisor, NOT inside any agent turn's process tree, so
       * it survives the per-turn spawn-and-kill teardown that CLI backends apply
       * (#71662). On exit the job runs through the normal cron run pipeline, so
       * delivery to the bound session works exactly like a scheduled main job.
       * `computeNextRunAtMs` returns undefined for this kind (never time-due).
       */
      kind: "on-exit";
      command: string;
      cwd?: string;
    };
/** Runtime target that decides whether a job joins main, isolated, or a named session. */
type CronSessionTarget = "main" | "isolated" | "current" | `session:${string}`;
/** Wake policy for main-session jobs waiting on heartbeat/user activity. */
type CronWakeMode = "next-heartbeat" | "now";
/** Messaging channel id accepted by cron delivery settings. */
type CronMessageChannel = ChannelId;
/** Delivery mode for job completion output. */
type CronDeliveryMode = "none" | "announce" | "webhook";
/** Completion delivery configuration for cron job output. */
type CronDelivery = {
  mode: CronDeliveryMode;
  channel?: CronMessageChannel;
  to?: string /** Explicit thread/topic id for channels that support threaded delivery. */;
  threadId?:
    | string
    | number /** Explicit channel account id for multi-account setups (e.g. multiple Telegram bots). */;
  accountId?: string;
  bestEffort?: boolean /** Additional webhook destination used when a job must keep chat delivery. */;
  completionDestination?: CronCompletionDestination /** Separate destination for failure notifications. */;
  failureDestination?: CronFailureDestination;
};
/** Webhook completion destination used alongside chat delivery. */
type CronCompletionDestination = {
  mode: "webhook";
  to?: string;
};
/** Destination override for failed-run notifications. */
type CronFailureDestination = {
  channel?: CronMessageChannel;
  to?: string;
  accountId?: string;
  mode?: "announce" | "webhook";
};
/** Partial failure-destination update shape; null clears individual override fields. */
type CronFailureDestinationPatch = {
  channel?: CronMessageChannel | null;
  to?: string | null;
  accountId?: string | null;
  mode?: "announce" | "webhook" | null;
};
/** Partial delivery update shape; null clears optional delivery destinations or fields. */
type CronDeliveryPatch = Partial<Pick<CronDelivery, "mode" | "bestEffort">> & {
  channel?: CronMessageChannel | null;
  to?: string | null;
  threadId?: string | number | null;
  accountId?: string | null;
  completionDestination?: CronCompletionDestination | null;
  failureDestination?: CronFailureDestinationPatch | null;
};
/** Execution outcome, separate from delivery outcome. */
type CronRunStatus = "ok" | "error" | "skipped";
/** Delivery outcome for completion or failure-notification sends. */
type CronDeliveryStatus = "delivered" | "not-delivered" | "unknown" | "not-requested";
/** Severity level for persisted cron run diagnostics. */
type CronRunDiagnosticSeverity = "info" | "warn" | "error";
/** Subsystem that produced a cron run diagnostic entry. */
type CronRunDiagnosticSource =
  | "cron-preflight"
  | "cron-setup"
  | "model-preflight"
  | "agent-run"
  | "tool"
  | "exec"
  | "delivery";
/** Timestamped diagnostic entry preserved for cron run troubleshooting. */
type CronRunDiagnostic = {
  ts: number;
  source: CronRunDiagnosticSource;
  severity: CronRunDiagnosticSeverity;
  message: string;
  toolName?: string;
  exitCode?: number | null;
  truncated?: boolean;
};
/** Bounded diagnostic bundle stored on the run outcome. */
type CronRunDiagnostics = {
  summary?: string;
  entries: CronRunDiagnostic[];
};
/** Failure alert policy persisted on a cron job. */
type CronFailureAlert = {
  after?: number;
  channel?: CronMessageChannel;
  to?: string;
  cooldownMs?: number /** When true, consecutive skipped runs count toward the alert threshold. */;
  includeSkipped?: boolean /** Delivery mode: announce (via messaging channels) or webhook (HTTP POST). */;
  mode?: "announce" | "webhook" /** Account ID for multi-account channel configurations. */;
  accountId?: string;
};
/** Payload variants cron can execute in main-session or detached modes. */
type CronPayload =
  | {
      kind: "systemEvent";
      text: string;
    }
  | CronAgentTurnPayload
  | CronCommandPayload;
/** Partial payload update shape used by cron patch/edit flows. */
type CronPayloadPatch =
  | {
      kind: "systemEvent";
      text?: string;
    }
  | CronAgentTurnPayloadPatch
  | CronCommandPayloadPatch;
type CronAgentTurnPayloadFields = {
  message: string /** Optional model override (provider/model or alias). */;
  model?: string /** Optional per-job fallback models; overrides agent/global fallbacks when defined. */;
  fallbacks?: string[];
  thinking?: string;
  timeoutSeconds?: number;
  allowUnsafeExternalContent?: boolean /** Immutable external hook provenance for async dispatch. */;
  externalContentSource?: HookExternalContentSource /** If true, run with lightweight bootstrap context. */;
  lightContext?: boolean /** Optional tool allow-list; when set, only these tools are sent to the model. */;
  toolsAllow?: string[] /** Server-managed marker for auto-stamped defaults; explicit restrictions omit it. */;
  toolsAllowIsDefault?: boolean;
};
type CronAgentTurnPayload = {
  kind: "agentTurn";
} & CronAgentTurnPayloadFields;
type CronAgentTurnPayloadPatch = {
  kind: "agentTurn";
} & Partial<Omit<CronAgentTurnPayloadFields, "model" | "fallbacks" | "toolsAllow" | "thinking">> & {
    model?: string | null;
    fallbacks?: string[] | null;
    toolsAllow?: string[] | null;
    thinking?: string | null;
  };
type CronCommandPayloadFields = {
  /** Explicit argv vector to execute. Use a shell wrapper argv for shell syntax. */ argv: string[];
  cwd?: string;
  env?: Record<string, string>;
  input?: string;
  timeoutSeconds?: number;
  noOutputTimeoutSeconds?: number;
  outputMaxBytes?: number;
};
type CronCommandPayload = {
  kind: "command";
} & CronCommandPayloadFields;
type CronCommandPayloadPatch = {
  kind: "command";
} & Partial<CronCommandPayloadFields>;
/** Mutable runtime state persisted beside the immutable cron job spec. */
type CronJobState = {
  nextRunAtMs?: number;
  runningAtMs?: number;
  lastRunAtMs?: number /** Preferred execution outcome field. */;
  lastRunStatus?: CronRunStatus /** @deprecated Use lastRunStatus. */;
  lastStatus?: "ok" | "error" | "skipped";
  lastError?: string;
  lastDiagnostics?: CronRunDiagnostics;
  lastDiagnosticSummary?: string /** Classified reason for the last error (when available). */;
  lastErrorReason?: FailoverReason;
  lastDurationMs?: number /** Number of consecutive execution errors (reset on success). Used for backoff. */;
  consecutiveErrors?: number /** Number of consecutive skipped executions (reset on success or error). */;
  consecutiveSkipped?: number /** Last failure alert timestamp (ms since epoch) for cooldown gating. */;
  lastFailureAlertAtMs?: number /** Number of consecutive schedule computation errors. Auto-disables job after threshold. */;
  scheduleErrorCount?: number /** Timestamp of the last trigger script evaluation. */;
  lastTriggerEvalAtMs?: number /** Number of completed trigger script evaluations. */;
  triggerEvalCount?: number /** Timestamp of the last trigger evaluation that fired. */;
  lastTriggerFireAtMs?: number /** JSON state returned by the last trigger script evaluation. */;
  triggerState?: unknown /** Explicit delivery outcome, separate from execution outcome. */;
  lastDeliveryStatus?: CronDeliveryStatus /** Delivery-specific error text when available. */;
  lastDeliveryError?: string /** Whether the last run's output was delivered to the target channel. */;
  lastDelivered?: boolean /** Whether the last failed run's failure notification was delivered to the target channel. */;
  lastFailureNotificationDelivered?: boolean /** Delivery outcome for the last failed run's failure notification. */;
  lastFailureNotificationDeliveryStatus?: CronDeliveryStatus /** Delivery-specific error for the last failed run's failure notification. */;
  lastFailureNotificationDeliveryError?: string;
};
type CronTrigger = {
  script: string;
  once?: boolean;
};
/** Fully persisted cron job with spec fields and mutable run state. */
type CronJob = CronJobBase<
  CronSchedule,
  CronSessionTarget,
  CronWakeMode,
  CronPayload,
  CronDelivery,
  CronFailureAlert | false
> & {
  declarationKey?: string;
  displayName?: string;
  owner?: {
    agentId?: string;
    sessionKey?: string;
  };
  trigger?: CronTrigger;
  state: CronJobState;
};
/** Versioned cron store file shape. */
type CronStoreFile = {
  version: 1;
  jobs: CronJob[];
};
/** Create input accepted by cron APIs before id/timestamps/state are assigned. */
type CronJobCreate = Omit<CronJob, "id" | "createdAtMs" | "updatedAtMs" | "state"> & {
  /** Internal callers can reserve a durable id before creation; public cron.add omits this. */ id?: string;
  state?: Partial<CronJobState>;
};
/** Patch input accepted by cron APIs without allowing immutable identity fields. */
type CronJobPatch = Partial<
  Omit<
    CronJob,
    | "id"
    | "createdAtMs"
    | "state"
    | "payload"
    | "delivery"
    | "declarationKey"
    | "displayName"
    | "owner"
  >
> & {
  displayName?: string | null;
  trigger?: CronTrigger | null;
  payload?: CronPayloadPatch;
  delivery?: CronDeliveryPatch;
  state?: Partial<CronJobState>;
};
//#endregion
//#region src/cron/store.d.ts
type SaveCronStoreOptions = {
  stateOnly?: boolean;
};
/** Persists cron jobs, or only mutable runtime state when stateOnly is set. */
/** Resolves the public plugin-SDK cron store path. */
declare function resolveCronStorePath(storePath?: string): string;
/** Plugin-SDK alias for loading the cron store. */
declare function loadCronStore(storePath: string): Promise<CronStoreFile>;
/** Plugin-SDK alias for saving the cron store. */
declare function saveCronStore(
  storePath: string,
  store: CronStoreFile,
  opts?: SaveCronStoreOptions,
): Promise<void>;
//#endregion
export {
  CronJobCreate as a,
  CronRunStatus as c,
  CronJob as i,
  EmbeddedAgentExecutionPhase as l,
  resolveCronStorePath as n,
  CronJobPatch as o,
  saveCronStore as r,
  CronPayload as s,
  loadCronStore as t,
};
