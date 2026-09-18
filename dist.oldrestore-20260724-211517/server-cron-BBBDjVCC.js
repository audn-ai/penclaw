import crypto from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import pMap, { pMapSkip } from "p-map";
import {
  a as isCronActiveJobMarkerCurrent,
  n as clearCronJobActive,
  s as markCronJobActive,
} from "./active-jobs-DCucn-SJ.js";
import {
  i as registerActiveCronTaskRun,
  o as startActiveCronTaskRunSettlementGrace,
  s as trackActiveCronTaskRunSettlement,
} from "./active-run-cancellation-BfylSyKt.js";
import { s as retireSessionMcpRuntime } from "./agent-bundle-mcp-runtime-3IdGeACS.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import {
  a as resolveAgentDir,
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
  r as resolveAgentConfig,
} from "./agent-scope-config-DVIR1nBa.js";
import { t as createOpenClawCodingTools } from "./agent-tools-CQdhKaa9.js";
import {
  r as resolveEmbeddedAttemptToolConstructionPlan,
  t as applyEmbeddedAttemptToolsAllow,
} from "./attempt-tool-construction-plan-tLraujwv.js";
import "./agent-scope-y9xQv_q1.js";
import { t as cleanupBrowserSessionsForLifecycleEnd } from "./browser-lifecycle-cleanup-BPqCnyqs.js";
import {
  n as CodeModeHeadlessTimeoutError,
  s as runCodeModeScriptHeadless,
  t as CodeModeHeadlessAbortError,
} from "./code-mode-BxoaB7Mu.js";
import { r as enqueueCommandInLane } from "./command-queue-CVn1dJsm.js";
import { n as resolveSandboxContext } from "./context-CEFGZ0oc.js";
import { n as resolveCronStoredDeliveryContext } from "./delivery-context-vIV9w5yj.js";
import { n as deliveryContextFromSession } from "./delivery-context.shared-WPZGmi9R.js";
import {
  n as resolveCronDeliveryPlan,
  r as resolveFailureDestination,
} from "./delivery-plan-DoSj9Ji-.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { r as resolveMainScopedEventSessionKey } from "./event-session-routing-zOSuMGLJ.js";
import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import {
  a as preExecutionTimeoutErrorMessage,
  c as timeoutErrorMessage,
  i as normalizeCronRunErrorText,
  r as isSetupTimeoutErrorText,
  s as setupTimeoutErrorMessage,
  t as abortErrorMessage,
} from "./execution-errors-F28fMPXG.js";
import { d as resolveFailoverReasonFromError } from "./failover-error-CYvhrluQ.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-Da47iiZE.js";
import {
  f as runWithGatewayIndependentRootWorkAdmission,
  p as runWithGatewayIndependentRootWorkContinuation,
  r as beginGatewayRootWorkAdmissionWhenOpen,
  t as GatewayDrainingError,
} from "./gateway-work-admission-yGjmBAjy.js";
import { n as runHeartbeatOnce } from "./heartbeat-runner-Dy5O7Twn.js";
import {
  a as isRetryableHeartbeatBusySkipReason,
  o as requestHeartbeat,
} from "./heartbeat-wake-B-63db0Y.js";
import "./logging-C8NGWOYr.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-CPEPIvCK.js";
import { n as resolveAgentOutboundIdentity } from "./identity-SEW64WfD.js";
import { W as resolveCronTriggerMinIntervalMs, i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import {
  a as normalizeCronRunDiagnostics,
  i as createCronRunDiagnosticsFromError,
  n as buildCronAgentDefaultsConfig,
  o as summarizeCronRunDiagnostics,
  r as resolveCronActiveRuntimeConfig,
  t as runCronIsolatedAgentTurn,
} from "./isolated-agent-So55Xd7r.js";
import {
  _ as resolveJobErrorBackoffUntilMs,
  a as computeJobNextRunAtMs,
  b as resolveDeliveryTarget,
  c as errorBackoffMs,
  d as isJobDue,
  f as isJobEnabled,
  g as recordScheduleComputeError,
  h as recomputeNextRunsForMaintenance,
  i as assertSupportedJobSpec,
  l as findJobOrThrow,
  m as recomputeNextRuns,
  n as applyDeclarativeJobSpec,
  o as computeJobPreviousRunAtMs,
  p as nextWakeAtMs,
  r as applyJobPatch,
  s as createJob,
  t as DEFAULT_ERROR_BACKOFF_SCHEDULE_MS,
  u as hasScheduledNextRunAtMs,
  v as resolveJobLastRunStatus$1,
  y as resolveJobPayloadTextForMain,
} from "./jobs-DmOhTis1.js";
import {
  C as registerHeadlessToolSearchCatalog,
  y as createToolSearchCatalogRef,
} from "./local-model-lean-D3O2n_2v.js";
import { r as getChildLogger } from "./logger-BUux_Jpv.js";
import "./normalize-CSef2SY2.js";
import {
  n as canonicalizeMainSessionAlias,
  r as resolveAgentMainSessionKey,
} from "./main-session-nrmKYo2W.js";
import { n as normalizeCronJobInput } from "./normalize-pVPLopSK.js";
import {
  D as resolveIntegerOption,
  p as finiteSecondsToTimerSafeMilliseconds,
} from "./number-coercion-CJQ8TR--.js";
import "./sessions-CEG7v41b.js";
import { r as markOpenClawExecEnv } from "./openclaw-exec-env-BmbZ1aqS.js";
import { f as resolveOpenClawStateSqlitePath } from "./openclaw-state-db-Bsa8Tv1Z.js";
import { t as createOutboundSendDeps } from "./outbound-send-deps-D4Ql4D3K.js";
import { t as parseDurationMs } from "./parse-duration-Be19e01j.js";
import { l as resolveStorePath } from "./paths-TfuVT-K8.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { u as redactToolPayloadText } from "./redact-CUe6Oey5.js";
import {
  c as getInvalidPersistedCronJobReason,
  l as normalizeCronJobIdentityFields,
  s as cronSchedulingInputsEqual,
} from "./row-codec-CaYtaRTs.js";
import "./agent-bundle-mcp-tools-DnfukTzv.js";
import { t as abortAndDrainEmbeddedAgentRun } from "./runs-GL_-RIwi.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { t as ensureRuntimePluginsLoaded } from "./runtime-plugins-CwbL9nR9.js";
import { t as computeNextRunAtMs } from "./schedule-DsVY1zm0.js";
import { t as sendDurableMessageBatch } from "./send-DJdWoC1F.js";
import {
  S as loadSessionEntry,
  a as applySessionEntryLifecycleMutation,
  y as listSessionEntries,
} from "./session-accessor-PZVNxFCV.js";
import { t as buildOutboundSessionContext } from "./session-context-CryOjB_1.js";
import { t as buildGatewaySessionEventFields } from "./session-event-payload-kyCpBpzl.js";
import "./runtime-BM0DJgoF.js";
import {
  d as resolveAgentIdFromSessionKey,
  f as resolveEventSessionKey,
  u as normalizeOptionalAgentId,
  v as toAgentStoreSessionKey,
} from "./session-key-druuY-GG.js";
import { t as resolveCronAgentSessionKey } from "./session-key-MFREoGog.js";
import "./sandbox-BbGZOuCz.js";
import {
  a as isSubagentSessionKey,
  c as parseAgentSessionKey,
  r as isCronRunSessionKey,
} from "./session-key-utils-B8sNp9l4.js";
import {
  a as resolveCronDeliverySessionKey,
  o as resolveCronNotificationSessionKey,
  r as isInvalidCronSessionTargetIdError,
  s as resolveCronSessionTargetSessionKey,
} from "./session-target-DJsUULzX.js";
import {
  S as unregisterSessionAutomationSource,
  b as claimSessionAutomationEpoch,
  l as loadGatewaySessionRow,
  w as resolveCronJobBoundSessionKeys,
  x as registerSessionAutomationSource,
  y as bumpSessionAutomationVersion,
} from "./session-utils-DjTWBI0J.js";
import { t as SsrFBlockedError } from "./ssrf-keFRGQLq.js";
import "./embedded-agent-T_kAEk06.js";
import { k as resolveMaintenanceConfig } from "./store-CzZJhTF6.js";
import {
  f as saveCronQuarantineFile,
  r as loadCronJobsStoreWithConfigJobs,
  s as resolveCronJobsStorePath,
  u as saveCronJobsStore,
} from "./store-D02kEgQU.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { t as getProcessSupervisor } from "./supervisor-BdR4bacv.js";
import {
  o as enqueueSystemEventEntry,
  t as consumeSelectedSystemEventEntries,
} from "./system-events-CIAdjAwz.js";
import {
  i as resolveCronListSnapshotRevision,
  n as normalizeCronTaskRunJobId,
} from "./task-run-history-C4upObjK.js";
import {
  a as tryFindFinalizedCronTaskRun,
  i as tryFindCronTaskRunIdForRecovery,
  n as resolveMainSessionCronRunSessionKey,
  o as tryFinishCronTaskRun,
  r as tryCreateCronTaskRun,
  s as tryFinishCronTaskRunWithoutHistory,
} from "./task-runs-d9-z-gdz.js";
import { a as hasPendingGeneratedMediaTaskForSessionKey } from "./task-status-access-BVw-UeJU.js";
import { o as isSilentReplyText } from "./tokens-DKI4eGAu.js";
import { t as resolveToolLoopDetectionConfig } from "./tool-loop-detection-config-vc04OURE.js";
import { i as getPluginToolMeta } from "./tools-K3NqAe9E.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { t as normalizeHttpWebhookUrl } from "./webhook-url-BOvGxtq0.js";
import { d as ensureAgentWorkspace } from "./workspace-DXzCbuC0.js";
//#region src/cron/command-output-summary.ts
const MAX_PRESERVED_ACTION_LINES = 12;
const ACTION_LINE_PATTERNS = [
  /\b(device|user|verification|authorization|auth|login)\s+code\b/i,
  /\benter\s+(?:the\s+)?(?:code|verification code|device code)\b/i,
  /\bcopy\s+(?:this\s+)?code\b/i,
  /\bvisit\s+(?:https?:\/\/|www\.)/i,
  /\bopen\s+(?:https?:\/\/|www\.)/i,
  /\bbrowser\s+(?:to|at)\s+(?:https?:\/\/|www\.)/i,
  /\blog(?:\s|-)?in\s+(?:at|to|with)\b/i,
  /\bauth(?:enticate|orize)\s+(?:at|with|using)\b/i,
  /\bhttps?:\/\/[^\s]+\/(?:device|activate|login|oauth|authorize|auth)\b/i,
];
const URL_PATTERN = /\b(?:https?:\/\/|www\.)\S+/gi;
const CODE_PATTERN = /\b[A-Z0-9]{4}(?:[- ][A-Z0-9]{3,8}){1,4}\b/g;
const UNSEPARATED_CODE_PATTERN = /\b[A-Z0-9]{6,12}\b/g;
const SECRET_ASSIGNMENT_PATTERN =
  /\b((?:access|refresh)[_-]?token|api[_-]?key|token|password|secret)\s*([:=])\s*([^\s;&]+)/gi;
function isCronCommandActionCriticalLine(line) {
  const normalized = normalizeOptionalString(line);
  return Boolean(normalized && ACTION_LINE_PATTERNS.some((pattern) => pattern.test(normalized)));
}
function normalizeLines(lines) {
  const result = [];
  for (const line of lines ?? []) {
    const normalized = normalizeOptionalString(line);
    if (normalized && !result.includes(normalized)) result.push(normalized);
    if (result.length >= MAX_PRESERVED_ACTION_LINES) break;
  }
  return result;
}
function trimOutput(value) {
  return normalizeOptionalString(value);
}
function combineOutput(params) {
  const stdout = trimOutput(params.stdout ?? "");
  const stderr = trimOutput(params.stderr ?? "");
  if (stdout && stderr) return `stdout:\n${stdout}\n\nstderr:\n${stderr}`;
  return stdout ?? stderr;
}
function containsLine(haystack, needle) {
  if (!haystack) return false;
  return haystack.split(/\r?\n/).some((line) => line.trim() === needle.trim());
}
function buildCronCommandSummary(params) {
  const tail = combineOutput({
    stdout: params.stdout,
    stderr: params.stderr,
  });
  const preserved = [
    ...normalizeLines(params.preservedStdoutLines),
    ...normalizeLines(params.preservedStderrLines),
  ].filter((line) => !containsLine(tail, line));
  if (preserved.length === 0) return tail;
  const actionBlock = `action-required output preserved:\n${preserved.join("\n")}`;
  return tail ? `${actionBlock}\n\n${tail}` : actionBlock;
}
function cronCommandSummaryNeedsExternalRedaction(summary) {
  if (!summary) return false;
  return summary
    .split(/\r?\n/)
    .some(
      (line) =>
        line.startsWith("action-required output preserved:") ||
        isCronCommandActionCriticalLine(line),
    );
}
function redactCronCommandSummaryForExternalDelivery(summary) {
  if (!summary || !cronCommandSummaryNeedsExternalRedaction(summary)) return summary;
  return summary
    .split(/(\r?\n)/)
    .map((part) => {
      if (/^\r?\n$/.test(part) || !isCronCommandActionCriticalLine(part)) return part;
      return redactToolPayloadText(part)
        .replace(SECRET_ASSIGNMENT_PATTERN, (_match, key, separator) => {
          return `${key}${separator}***`;
        })
        .replace(URL_PATTERN, "[redacted-url]")
        .replace(CODE_PATTERN, "[redacted-code]")
        .replace(UNSEPARATED_CODE_PATTERN, "[redacted-code]");
    })
    .join("");
}
//#endregion
//#region src/cron/command-runner.ts
const DEFAULT_COMMAND_TIMEOUT_MS = 10 * 6e4;
const EFFECTIVELY_UNBOUNDED_TIMEOUT_MS = 2147483647;
function secondsToMs(value) {
  if (typeof value !== "number") return;
  if (value <= 0) return EFFECTIVELY_UNBOUNDED_TIMEOUT_MS;
  return finiteSecondsToTimerSafeMilliseconds(value) ?? void 0;
}
function formatCommand(argv) {
  return argv.map((arg) => JSON.stringify(arg)).join(" ");
}
function commandErrorMessage(params) {
  if (params.termination === "timeout") return "command timed out";
  if (params.termination === "no-output-timeout")
    return "command produced no output before noOutputTimeoutSeconds";
  if (params.termination === "signal")
    return params.signal ? `command stopped by signal ${params.signal}` : "command stopped";
  if (typeof params.code === "number") return `command exited with code ${params.code}`;
  return "command failed";
}
function buildDiagnostics(params) {
  const truncated =
    Boolean(params.stdoutTruncatedBytes && params.stdoutTruncatedBytes > 0) ||
    Boolean(params.stderrTruncatedBytes && params.stderrTruncatedBytes > 0);
  return {
    ...(params.summary ? { summary: params.summary } : {}),
    entries: [
      {
        ts: params.nowMs(),
        source: "exec",
        severity: params.status === "ok" ? "info" : "error",
        message: params.summary
          ? `command ${params.status}: ${params.command}`
          : `command ${params.status} with no output: ${params.command}`,
        exitCode: params.code,
        truncated,
        ...(params.signal ? { toolName: `signal:${params.signal}` } : {}),
      },
    ],
  };
}
/** Executes a cron command payload without starting an agent/model run. */
async function runCronCommandJob(params) {
  const nowMs = params.nowMs ?? Date.now;
  const { payload } = params.job;
  if (payload.kind !== "command")
    return {
      status: "skipped",
      error: 'command runner requires payload.kind="command"',
    };
  if (!Array.isArray(payload.argv) || payload.argv.length === 0)
    return {
      status: "skipped",
      error: 'command payload requires non-empty "argv"',
    };
  const command = formatCommand(payload.argv);
  const noOutputTimeoutMs = secondsToMs(payload.noOutputTimeoutSeconds);
  try {
    const result = await runCommandWithTimeout(payload.argv, {
      timeoutMs: secondsToMs(payload.timeoutSeconds) ?? DEFAULT_COMMAND_TIMEOUT_MS,
      ...(payload.cwd ? { cwd: payload.cwd } : {}),
      ...(payload.input !== void 0 ? { input: payload.input } : {}),
      ...(payload.env ? { env: payload.env } : {}),
      ...(noOutputTimeoutMs !== void 0 ? { noOutputTimeoutMs } : {}),
      ...(payload.outputMaxBytes !== void 0 ? { maxOutputBytes: payload.outputMaxBytes } : {}),
      preserveOutputLine: isCronCommandActionCriticalLine,
      ...(params.abortSignal ? { signal: params.abortSignal } : {}),
      killProcessTree: true,
    });
    const ok =
      result.code === 0 &&
      !result.killed &&
      result.termination !== "timeout" &&
      result.termination !== "no-output-timeout" &&
      result.termination !== "signal";
    const status = ok ? "ok" : "error";
    const summary = buildCronCommandSummary({
      stdout: result.stdout,
      stderr: result.stderr,
      preservedStdoutLines: result.preservedStdoutLines,
      preservedStderrLines: result.preservedStderrLines,
    });
    const error = ok
      ? void 0
      : commandErrorMessage({
          code: result.code,
          signal: result.signal,
          termination: result.termination,
        });
    return {
      status,
      ...(error ? { error } : {}),
      ...(summary ? { summary } : {}),
      diagnostics: buildDiagnostics({
        command,
        status,
        summary,
        code: result.code,
        signal: result.signal,
        stdoutTruncatedBytes: result.stdoutTruncatedBytes,
        stderrTruncatedBytes: result.stderrTruncatedBytes,
        nowMs,
      }),
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    return {
      status: "error",
      error,
      diagnostics: {
        summary: error,
        entries: [
          {
            ts: nowMs(),
            source: "exec",
            severity: "error",
            message: `command failed to start: ${command}: ${error}`,
            exitCode: null,
          },
        ],
      },
    };
  }
}
//#endregion
//#region src/cron/delivery.ts
/** Sends cron announce payloads and best-effort failure notifications. */
const FAILURE_NOTIFICATION_TIMEOUT_MS = 3e4;
const cronDeliveryLogger = getChildLogger({ subsystem: "cron-delivery" });
async function resolveCronAnnounceDelivery(params) {
  const targetResolutionOptions =
    params.target.inheritSessionThread === false ? { inheritSessionThread: false } : void 0;
  const resolvedTarget = await resolveDeliveryTarget(
    params.cfg,
    params.agentId,
    {
      channel: params.target.channel,
      to: params.target.to,
      accountId: params.target.accountId,
      sessionKey: params.target.sessionKey,
    },
    targetResolutionOptions,
  );
  if (!resolvedTarget.ok)
    return {
      ok: false,
      error: resolvedTarget.error,
    };
  const identity = resolveAgentOutboundIdentity(params.cfg, params.agentId);
  return {
    ok: true,
    resolvedTarget,
    session: buildOutboundSessionContext({
      cfg: params.cfg,
      agentId: params.agentId,
      sessionKey: resolveCronNotificationSessionKey({
        jobId: params.jobId,
        sessionKey: params.target.sessionKey,
      }),
    }),
    identity,
  };
}
async function deliverCronAnnouncePayload(params) {
  const send = await sendDurableMessageBatch({
    cfg: params.cfg,
    channel: params.delivery.resolvedTarget.channel,
    to: params.delivery.resolvedTarget.to,
    accountId: params.delivery.resolvedTarget.accountId,
    threadId: params.delivery.resolvedTarget.threadId,
    payloads: [{ text: params.message }],
    session: params.delivery.session,
    identity: params.delivery.identity,
    bestEffort: false,
    deps: createOutboundSendDeps(params.deps),
    signal: params.abortSignal,
  });
  if (send.status === "failed" || send.status === "partial_failed") throw send.error;
}
/** Sends a cron announce payload and throws if target resolution or delivery fails. */
async function sendCronAnnouncePayloadStrict(params) {
  const delivery = await resolveCronAnnounceDelivery(params);
  if (!delivery.ok) throw delivery.error;
  await deliverCronAnnouncePayload({
    deps: params.deps,
    cfg: params.cfg,
    delivery,
    message: params.message,
    abortSignal: params.abortSignal,
  });
}
/** Sends a best-effort cron failure notification, logging resolution/send failures. */
async function sendFailureNotificationAnnounce(deps, cfg, agentId, jobId, target, message) {
  const delivery = await resolveCronAnnounceDelivery({
    cfg,
    agentId,
    jobId,
    target,
  });
  if (!delivery.ok) {
    cronDeliveryLogger.warn(
      { error: delivery.error.message },
      "cron: failed to resolve failure destination target",
    );
    return;
  }
  const abortController = new AbortController();
  const timeout = setTimeout(() => {
    abortController.abort();
  }, FAILURE_NOTIFICATION_TIMEOUT_MS);
  try {
    await deliverCronAnnouncePayload({
      deps,
      cfg,
      delivery,
      message,
      abortSignal: abortController.signal,
    });
  } catch (err) {
    cronDeliveryLogger.warn(
      {
        err: formatErrorMessage(err),
        channel: delivery.resolvedTarget.channel,
        to: delivery.resolvedTarget.to,
      },
      "cron: failure destination announce failed",
    );
  } finally {
    clearTimeout(timeout);
  }
}
//#endregion
//#region src/cron/service/failure-alerts.ts
/** Resolves and emits cron failure-alert notifications. */
const DEFAULT_FAILURE_ALERT_AFTER = 2;
const DEFAULT_FAILURE_ALERT_COOLDOWN_MS = 60 * 6e4;
/** Returns the last failure-notification delivery trace persisted on a cron job. */
function failureNotificationDeliveryFromJobState(job) {
  const status = job.state.lastFailureNotificationDeliveryStatus;
  if (!status || status === "not-requested") return;
  return {
    delivered: job.state.lastFailureNotificationDelivered,
    status,
    error: job.state.lastFailureNotificationDeliveryError,
  };
}
function normalizeCronMessageChannel(input) {
  const channel = normalizeOptionalLowercaseString(input);
  return channel ? channel : void 0;
}
function normalizeTo(input) {
  if (typeof input !== "string") return;
  const to = input.trim();
  return to ? to : void 0;
}
function clampPositiveInt(value, fallback) {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  const floored = Math.floor(value);
  return floored >= 1 ? floored : fallback;
}
function clampNonNegativeInt(value, fallback) {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  const floored = Math.floor(value);
  return floored >= 0 ? floored : fallback;
}
/** Resolves effective failure-alert policy from job config, delivery defaults, and global cron config. */
function resolveFailureAlert(state, job) {
  const globalConfig = state.deps.cronConfig?.failureAlert;
  const jobConfig = job.failureAlert === false ? void 0 : job.failureAlert;
  if (job.failureAlert === false) return null;
  if (!jobConfig && globalConfig?.enabled !== true) return null;
  const mode = jobConfig?.mode ?? globalConfig?.mode;
  const explicitTo = normalizeTo(jobConfig?.to);
  return {
    after: clampPositiveInt(jobConfig?.after ?? globalConfig?.after, DEFAULT_FAILURE_ALERT_AFTER),
    cooldownMs: clampNonNegativeInt(
      jobConfig?.cooldownMs ?? globalConfig?.cooldownMs,
      DEFAULT_FAILURE_ALERT_COOLDOWN_MS,
    ),
    channel:
      normalizeCronMessageChannel(jobConfig?.channel) ??
      normalizeCronMessageChannel(job.delivery?.channel) ??
      "last",
    to: mode === "webhook" ? explicitTo : (explicitTo ?? normalizeTo(job.delivery?.to)),
    mode,
    accountId: jobConfig?.accountId ?? globalConfig?.accountId,
    includeSkipped: jobConfig?.includeSkipped ?? globalConfig?.includeSkipped ?? false,
  };
}
function emitFailureAlert(state, params) {
  const safeJobName = params.job.name || params.job.id;
  const truncatedError = truncateUtf16Safe(params.error?.trim() || "unknown reason", 200);
  const errorReason =
    params.status === "error" && typeof params.error === "string"
      ? (resolveFailoverReasonFromError(params.error, params.provider) ?? void 0)
      : void 0;
  const statusVerb = params.status === "skipped" ? "skipped" : "failed";
  const detailLabel = params.status === "skipped" ? "Skip reason" : "Last error";
  const text = [
    `Cron job "${safeJobName}" ${statusVerb} ${params.consecutiveErrors} times`,
    ...(errorReason ? [`Cause: ${errorReason}`] : []),
    `${detailLabel}: ${truncatedError}`,
  ].join("\n");
  if (state.deps.sendCronFailureAlert) {
    state.deps
      .sendCronFailureAlert({
        job: params.job,
        text,
        channel: params.channel,
        to: params.to,
        mode: params.mode,
        accountId: params.accountId,
      })
      .catch((err) => {
        state.deps.log.warn(
          {
            jobId: params.job.id,
            err: String(err),
          },
          "cron: failure alert delivery failed",
        );
      });
    return;
  }
  state.deps.enqueueSystemEvent(text, { agentId: params.job.agentId });
  if (params.job.wakeMode === "now")
    state.deps.requestHeartbeat({
      source: "cron",
      intent: "immediate",
      reason: `cron:${params.job.id}:failure-alert`,
    });
}
/** Emits a failure alert when threshold, best-effort, and cooldown policy allow it. */
function maybeEmitFailureAlert(state, params) {
  if (!params.alertConfig || params.consecutiveCount < params.alertConfig.after) return;
  if (params.job.delivery?.bestEffort === true) return;
  const now = params.occurredAtMs ?? state.deps.nowMs();
  const lastAlert = params.job.state.lastFailureAlertAtMs;
  if (typeof lastAlert === "number" && now - lastAlert < Math.max(0, params.alertConfig.cooldownMs))
    return;
  if (params.delivery !== "record-only")
    emitFailureAlert(state, {
      job: params.job,
      error: params.error,
      consecutiveErrors: params.consecutiveCount,
      channel: params.alertConfig.channel,
      to: params.alertConfig.to,
      mode: params.alertConfig.mode,
      accountId: params.alertConfig.accountId,
      status: params.status,
      provider: params.provider,
    });
  params.job.state.lastFailureAlertAtMs = now;
}
//#endregion
//#region src/cron/service/list-page-sort.ts
function sortCronJobs(jobs, sortBy, sortDir) {
  const dir = sortDir === "desc" ? -1 : 1;
  return jobs.toSorted((a, b) => {
    let cmp;
    if (sortBy === "name") {
      const aName = typeof a.name === "string" ? a.name : "";
      const bName = typeof b.name === "string" ? b.name : "";
      cmp = aName.localeCompare(bName, void 0, { sensitivity: "base" });
    } else if (sortBy === "updatedAtMs") cmp = a.updatedAtMs - b.updatedAtMs;
    else {
      const aNext = a.state.nextRunAtMs;
      const bNext = b.state.nextRunAtMs;
      if (typeof aNext === "number" && typeof bNext === "number") cmp = aNext - bNext;
      else if (typeof aNext === "number") cmp = -1;
      else if (typeof bNext === "number") cmp = 1;
      else cmp = 0;
    }
    if (cmp !== 0) return cmp * dir;
    const aId = typeof a.id === "string" ? a.id : "";
    const bId = typeof b.id === "string" ? b.id : "";
    return aId.localeCompare(bId);
  });
}
//#endregion
//#region src/cron/service/locked.ts
const storeLocks = /* @__PURE__ */ new Map();
const resolveChain = (promise) =>
  promise.then(
    () => void 0,
    () => void 0,
  );
/** Serializes cron operations per store path while preserving state-local operation ordering. */
async function locked(state, fn) {
  const storePath = state.deps.storePath;
  const storeOp = storeLocks.get(storePath) ?? Promise.resolve();
  const next = Promise.all([resolveChain(state.op), resolveChain(storeOp)]).then(fn);
  const keepAlive = resolveChain(next);
  state.op = keepAlive;
  storeLocks.set(storePath, keepAlive);
  return await next;
}
//#endregion
//#region src/cron/retry-hint.ts
const SERVER_ERROR_PATTERN =
  /\b(?:https?|status(?:[ _]code)?|response(?:[ _]code)?|http(?:[ _]status)?)\b[\s:=#"']{0,4}5\d{2}\b|\b5\d{2}\b[\s:)\].,-]*(?:internal server error|server error|bad gateway|service unavailable|gateway time-?out)\b|\binternal server error\b|\bbad gateway\b|\bservice unavailable\b|\bgateway time-?out\b|\b5xx\b|^\s*5\d{2}\s*$/i;
const SESSION_LIFECYCLE_CLAIM_ERROR_PATTERN =
  /^(?:(?:CronSessionLifecycleClaimError|Error): )?Session "[^"\n]+" (?:changed|was deleted) while starting work\. Retry\.$/;
const TRANSIENT_PATTERNS = {
  rate_limit:
    /(rate[_ ]limit|too many requests|429|resource has been exhausted|cloudflare|tokens per day)/i,
  overloaded:
    /\b529\b|\boverloaded(?:_error)?\b|high demand|temporar(?:ily|y) overloaded|capacity exceeded/i,
  network:
    /(network|fetch failed|socket|econnreset|econnrefused|eai_again|enetdown|ehostunreach|ehostdown|enetreset|enetunreach|epipe)/i,
  timeout: /(timeout|timed out|stalled before execution start|etimedout)/i,
  server_error: SERVER_ERROR_PATTERN,
};
/** Classifies cron execution errors against the configured retryable transient categories. */
function resolveCronExecutionRetryHint(error, retryOn, classifiedReason) {
  if (!error || typeof error !== "string") return { retryable: false };
  if (SESSION_LIFECYCLE_CLAIM_ERROR_PATTERN.test(error)) return { retryable: true };
  const keys = retryOn?.length ? retryOn : Object.keys(TRANSIENT_PATTERNS);
  const classified = classifiedReason ?? void 0;
  if (classified && keys.includes(classified))
    return {
      retryable: true,
      category: classified,
    };
  for (const key of keys)
    if (TRANSIENT_PATTERNS[key]?.test(error))
      return {
        retryable: true,
        category: key,
      };
  return { retryable: false };
}
//#endregion
//#region src/cron/session-reaper.ts
/** Prunes expired per-run cron sessions and archives unreferenced transcripts. */
const DEFAULT_RETENTION_MS = 24 * 36e5;
/** Minimum interval between reaper sweeps (avoid running every timer tick). */
const MIN_SWEEP_INTERVAL_MS = 5 * 6e4;
const lastSweepAtMsByStore = /* @__PURE__ */ new Map();
/** Resolves cron run-session retention; `false` disables pruning, bad strings fall back safely. */
function resolveRetentionMs(cronConfig) {
  if (cronConfig?.sessionRetention === false) return null;
  const raw = cronConfig?.sessionRetention;
  if (typeof raw === "string" && raw.trim())
    try {
      return parseDurationMs(raw.trim(), { defaultUnit: "h" });
    } catch {
      return DEFAULT_RETENTION_MS;
    }
  return DEFAULT_RETENTION_MS;
}
/**
 * Sweeps completed isolated cron run sessions while preserving base cron sessions.
 *
 * Must run outside the cron service `locked()` section because this acquires
 * the session-store file lock; reversing that order can deadlock timer ticks.
 */
async function sweepCronRunSessions(params) {
  const now = params.nowMs ?? Date.now();
  const storePath = params.sessionStorePath;
  const lastSweepAtMs = lastSweepAtMsByStore.get(storePath) ?? 0;
  if (!params.force && now - lastSweepAtMs < MIN_SWEEP_INTERVAL_MS)
    return {
      swept: false,
      pruned: 0,
    };
  lastSweepAtMsByStore.set(storePath, now);
  const retentionMs = resolveRetentionMs(params.cronConfig);
  if (retentionMs === null)
    return {
      swept: false,
      pruned: 0,
    };
  let pruned = 0;
  let transcriptCleanupError;
  try {
    const cutoff = now - retentionMs;
    const removals = [];
    for (const { sessionKey, entry } of listSessionEntries({ storePath })) {
      if (!isCronRunSessionKey(sessionKey)) continue;
      const continuation = entry.cronRunContinuation;
      const hasPendingMedia = Boolean(
        continuation && hasPendingGeneratedMediaTaskForSessionKey(sessionKey),
      );
      if (continuation && hasPendingMedia) continue;
      if ((entry.updatedAt ?? 0) < cutoff)
        removals.push({
          sessionKey,
          expectedEntry: entry,
          ...(entry.sessionId ? { expectedSessionId: entry.sessionId } : {}),
          expectedUpdatedAt: entry.updatedAt,
          archiveRemovedTranscript: true,
        });
    }
    if (removals.length > 0) {
      const archiveRetentionMs = resolveMaintenanceConfig().resetArchiveRetentionMs;
      const result = await applySessionEntryLifecycleMutation({
        storePath,
        removals,
        preserveActiveWork: true,
        restrictArchivedTranscriptsToStoreDir: true,
        ...(archiveRetentionMs == null
          ? {}
          : {
              cleanupArchivedTranscripts: {
                rules: [
                  {
                    reason: "deleted",
                    olderThanMs: archiveRetentionMs,
                  },
                ],
                nowMs: now,
              },
            }),
        captureArtifactCleanupError: true,
      });
      pruned = result.removedEntries;
      transcriptCleanupError = result.artifactCleanupError;
    }
  } catch (err) {
    params.log.warn({ err: String(err) }, "cron-reaper: failed to sweep session store");
    return {
      swept: false,
      pruned: 0,
    };
  }
  if (transcriptCleanupError)
    params.log.warn(
      { err: formatErrorMessage(transcriptCleanupError) },
      "cron-reaper: transcript cleanup failed",
    );
  if (pruned > 0)
    params.log.info(
      {
        pruned,
        retentionMs,
      },
      `cron-reaper: pruned ${pruned} expired cron run session(s)`,
    );
  return {
    swept: true,
    pruned,
  };
}
//#endregion
//#region src/cron/service/agent-watchdog.ts
const CRON_TIMEOUT_CLEANUP_GUARD_MS = 2e4;
const CRON_AGENT_SETUP_WATCHDOG_MS = 6e4;
const CRON_AGENT_PRE_EXECUTION_WATCHDOG_MS = 6e4;
const CRON_AGENT_PRE_EXECUTION_MIN_WATCHDOG_MS = 1e3;
const CRON_AGENT_PHASE_WATCHDOG_STAGE = {
  runner_entered: "pre_execution",
  workspace: "pre_execution",
  runtime_plugins: "pre_execution",
  before_agent_reply: "execution",
  model_resolution: "pre_execution",
  auth: "pre_execution",
  context_engine: "pre_execution",
  attempt_dispatch: "execution",
  context_assembled: "execution",
  turn_accepted: "execution",
  process_spawned: "execution",
  tool_execution_started: "execution",
  assistant_output_started: "execution",
  model_call_started: "execution",
};
/** Tracks isolated-agent setup/execution progress and fires the correct cron timeout reason. */
function createCronAgentWatchdog(params) {
  let state = params.deferUntilRunner ? "waiting_for_runner" : "executing";
  let timeoutId;
  let setupTimeoutId;
  let preExecutionTimeoutId;
  let activeExecution;
  let observedLaneWait = false;
  const setTimedOut = (reason) => {
    if (state === "timed_out" || state === "disposed") return;
    state = "timed_out";
    params.triggerTimeout(reason);
  };
  const startTimeout = () => {
    if (timeoutId || state === "disposed") return;
    timeoutId = setTimeout(() => {
      setTimedOut(timeoutErrorMessage(activeExecution));
    }, params.jobTimeoutMs);
  };
  const clearSetupTimeout = () => {
    if (!setupTimeoutId) return;
    clearTimeout(setupTimeoutId);
    setupTimeoutId = void 0;
  };
  const clearPreExecutionTimeout = () => {
    if (!preExecutionTimeoutId) return;
    clearTimeout(preExecutionTimeoutId);
    preExecutionTimeoutId = void 0;
  };
  const startPreExecutionTimeout = () => {
    if (preExecutionTimeoutId || state !== "waiting_for_execution") return;
    preExecutionTimeoutId = setTimeout(() => {
      if (state === "waiting_for_execution")
        setTimedOut(preExecutionTimeoutErrorMessage(activeExecution));
    }, resolveCronAgentPreExecutionWatchdogMs(params.jobTimeoutMs));
  };
  const noteExecutionProgress = (info) => {
    if (!info) return;
    const previousPhase = activeExecution?.phase;
    activeExecution = {
      ...activeExecution,
      ...info,
    };
    const stage = info.phase ? CRON_AGENT_PHASE_WATCHDOG_STAGE[info.phase] : void 0;
    if (
      state === "executing" &&
      previousPhase === "before_agent_reply" &&
      stage === "pre_execution"
    ) {
      state = "waiting_for_execution";
      startPreExecutionTimeout();
      return;
    }
    if (stage === "execution") {
      state = "executing";
      clearPreExecutionTimeout();
    }
  };
  return {
    start: () => {
      if (params.deferUntilRunner) {
        setupTimeoutId = setTimeout(() => {
          if (state === "waiting_for_runner")
            setTimedOut(setupTimeoutErrorMessage(activeExecution));
        }, CRON_AGENT_SETUP_WATCHDOG_MS);
        return;
      }
      startTimeout();
    },
    noteLaneWait: () => {
      if (state === "waiting_for_runner") observedLaneWait = true;
    },
    noteLaneAdmitted: () => {
      if (state === "waiting_for_runner") observedLaneWait = false;
    },
    noteRunnerStarted: (info) => {
      if (state === "disposed" || state === "timed_out") return;
      clearSetupTimeout();
      startTimeout();
      if (state !== "executing") state = "waiting_for_execution";
      noteExecutionProgress(info);
      startPreExecutionTimeout();
    },
    notePhase: (info) => {
      if (state === "disposed" || state === "timed_out") return;
      noteExecutionProgress(info);
    },
    activeExecution: () => activeExecution,
    observedLaneWait: () => observedLaneWait,
    dispose: () => {
      state = "disposed";
      if (timeoutId) clearTimeout(timeoutId);
      clearSetupTimeout();
      clearPreExecutionTimeout();
    },
  };
}
/** Runs timeout cleanup with a guard so stuck cleanup cannot block the cron lane. */
async function cleanupTimedOutCronAgentRun(state, job, timeoutMs, execution) {
  if (!state.deps.cleanupTimedOutAgentRun) return;
  let settleTimer;
  const cleanupPromise = state.deps.cleanupTimedOutAgentRun({
    job,
    timeoutMs,
    execution,
  });
  const settleTimeout = new Promise((resolve) => {
    settleTimer = setTimeout(resolve, CRON_TIMEOUT_CLEANUP_GUARD_MS);
  });
  try {
    await Promise.race([cleanupPromise, settleTimeout]);
  } catch (err) {
    state.deps.log.warn(
      {
        jobId: job.id,
        err: String(err),
      },
      "cron: timed-out agent cleanup failed",
    );
  } finally {
    if (settleTimer) clearTimeout(settleTimer);
  }
}
function resolveCronAgentPreExecutionWatchdogMs(jobTimeoutMs) {
  return Math.max(
    CRON_AGENT_PRE_EXECUTION_MIN_WATCHDOG_MS,
    Math.min(CRON_AGENT_PRE_EXECUTION_WATCHDOG_MS, Math.floor(jobTimeoutMs / 2)),
  );
}
//#endregion
//#region src/cron/service/state.ts
/** Creates mutable cron service state with a concrete clock dependency. */
function createCronServiceState(deps) {
  return {
    deps: {
      ...deps,
      nowMs: deps.nowMs ?? (() => Date.now()),
    },
    store: null,
    durableNextRunAtMsByJobId: /* @__PURE__ */ new Map(),
    timer: null,
    running: false,
    stopped: false,
    schedulingPaused: false,
    schedulerStarted: false,
    restartRecoveryPending: false,
    pendingCatchupDeferralJobIds: /* @__PURE__ */ new Set(),
    activeManualRunJobIds: /* @__PURE__ */ new Set(),
    manualSetupTimeoutNotified: false,
    op: Promise.resolve(),
    warnedDisabled: false,
    warnedInvalidPersistedJobKeys: /* @__PURE__ */ new Set(),
    pendingQuarantineConfigJobs: [],
    lastQuarantineFailureWarnKey: null,
    storeLoadedAtMs: null,
  };
}
/** Dispatches a cron event without letting subscriber errors escape scheduler work. */
function emit(state, evt) {
  try {
    state.deps.onEvent?.(evt);
  } catch {}
}
//#endregion
//#region src/cron/service/store.ts
/** Loads, normalizes, quarantines, and persists cron service store state. */
function durableNextRunsFromJobs(jobs) {
  return new Map(jobs.map((job) => [job.id, job.state.nextRunAtMs]));
}
function publishDurableNextRunChanges(params) {
  const previous = params.state.durableNextRunAtMsByJobId;
  const next = params.stateOnly ? new Map(previous) : durableNextRunsFromJobs(params.storeJobs);
  if (params.stateOnly) {
    const currentJobsById = new Map(params.storeJobs.map((job) => [job.id, job]));
    for (const jobId of previous.keys()) {
      const job = currentJobsById.get(jobId);
      if (job) next.set(jobId, job.state.nextRunAtMs);
    }
  }
  const changedJobs = params.storeJobs.filter((job) => {
    if (!previous.has(job.id) || !next.has(job.id)) return false;
    return previous.get(job.id) !== next.get(job.id);
  });
  params.state.durableNextRunAtMsByJobId = next;
  for (const job of changedJobs) {
    if (job.id === params.suppressScheduledJobId) continue;
    emit(params.state, {
      jobId: job.id,
      action: "scheduled",
      job,
      nextRunAtMs: job.state.nextRunAtMs,
    });
  }
}
function invalidateStaleNextRunOnScheduleChange(params) {
  const previousJob = params.previousJobsById.get(params.hydrated.id);
  if (!previousJob || cronSchedulingInputsEqual(previousJob, params.hydrated)) return;
  params.hydrated.state ??= {};
  params.hydrated.state.nextRunAtMs = void 0;
}
function warnInvalidPersistedCronJob(params) {
  const jobId = typeof params.raw.id === "string" ? params.raw.id : void 0;
  const dedupeKey = jobId ?? `index:${params.index}`;
  if (params.state.warnedInvalidPersistedJobKeys.has(dedupeKey)) return;
  params.state.warnedInvalidPersistedJobKeys.add(dedupeKey);
  params.state.deps.log.warn(
    {
      storePath: params.state.deps.storePath,
      jobId,
      jobIndex: params.index,
      reason: params.reason,
    },
    "cron: quarantined invalid persisted job and skipped it from runtime",
  );
}
async function flushPendingQuarantine(state, nowMs) {
  if (state.pendingQuarantineConfigJobs.length === 0) return null;
  try {
    const quarantinePath = await saveCronQuarantineFile({
      storePath: state.deps.storePath,
      entries: state.pendingQuarantineConfigJobs,
      nowMs,
    });
    state.pendingQuarantineConfigJobs = [];
    state.lastQuarantineFailureWarnKey = null;
    return quarantinePath;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const warnKey = `${state.deps.storePath}\0${errorMessage}`;
    if (state.lastQuarantineFailureWarnKey !== warnKey) {
      state.lastQuarantineFailureWarnKey = warnKey;
      state.deps.log.warn(
        {
          storePath: state.deps.storePath,
          error: errorMessage,
        },
        "cron: failed to quarantine malformed persisted jobs; skipping active store sanitization",
      );
    }
    return null;
  }
}
/** Loads and normalizes the cron store, quarantining invalid persisted rows before runtime use. */
async function ensureLoaded(state, opts) {
  if (state.store && !opts?.forceReload) return;
  const previousJobsById = /* @__PURE__ */ new Map();
  for (const job of state.store?.jobs ?? []) previousJobsById.set(job.id, job);
  const loaded = await loadCronJobsStoreWithConfigJobs(state.deps.storePath);
  const loadedJobs = loaded.store.jobs ?? [];
  const jobs = [];
  const durableNextRunAtMsByJobId = /* @__PURE__ */ new Map();
  const quarantinedConfigJobs = [...loaded.invalidConfigRows];
  for (const [index, raw] of loadedJobs.entries()) {
    const rawConfigJob = loaded.configJobs[index] ?? structuredClone(raw);
    const sourceIndex = loaded.configJobIndexes[index] ?? index;
    const runtimeEntry = loaded.configJobRuntimeEntries[index];
    normalizeCronJobIdentityFields(raw);
    let normalized;
    try {
      normalized = normalizeCronJobInput(raw);
    } catch (error) {
      if (!isInvalidCronSessionTargetIdError(error)) throw error;
      normalized = null;
      state.deps.log.warn(
        {
          storePath: state.deps.storePath,
          jobId: typeof raw.id === "string" ? raw.id : void 0,
        },
        "cron: job has invalid persisted sessionTarget; run openclaw doctor --fix to repair",
      );
    }
    const hydratedRaw = normalized ?? raw;
    const invalidReason = getInvalidPersistedCronJobReason(hydratedRaw);
    if (invalidReason) {
      const quarantineEntry = {
        sourceIndex,
        reason: invalidReason,
        job: rawConfigJob,
      };
      const runtimeState = runtimeEntry?.state ?? raw.state;
      if (runtimeState && typeof runtimeState === "object" && !Array.isArray(runtimeState))
        quarantineEntry.state = structuredClone(runtimeState);
      const updatedAtMs = runtimeEntry?.updatedAtMs ?? raw.updatedAtMs;
      if (typeof updatedAtMs === "number" && Number.isFinite(updatedAtMs))
        quarantineEntry.updatedAtMs = updatedAtMs;
      if (typeof runtimeEntry?.scheduleIdentity === "string")
        quarantineEntry.scheduleIdentity = runtimeEntry.scheduleIdentity;
      quarantinedConfigJobs.push(quarantineEntry);
      warnInvalidPersistedCronJob({
        state,
        raw,
        index: sourceIndex,
        reason: invalidReason,
      });
      continue;
    }
    const hydrated = hydratedRaw;
    jobs.push(hydrated);
    durableNextRunAtMsByJobId.set(hydrated.id, hydrated.state.nextRunAtMs);
    invalidateStaleNextRunOnScheduleChange({
      previousJobsById,
      hydrated,
    });
  }
  state.store = {
    version: 1,
    jobs,
  };
  state.durableNextRunAtMsByJobId = durableNextRunAtMsByJobId;
  state.storeLoadedAtMs = state.deps.nowMs();
  if (quarantinedConfigJobs.length > 0) {
    state.pendingQuarantineConfigJobs = quarantinedConfigJobs;
    const quarantinePath = await flushPendingQuarantine(state, state.storeLoadedAtMs);
    if (quarantinePath)
      try {
        await persist(state);
        state.deps.log.warn(
          {
            storePath: state.deps.storePath,
            quarantinePath,
            quarantinedJobs: quarantinedConfigJobs.length,
          },
          "cron: sanitized active cron store after quarantining malformed persisted jobs",
        );
      } catch (error) {
        state.deps.log.warn(
          {
            storePath: state.deps.storePath,
            error: error instanceof Error ? error.message : String(error),
          },
          "cron: failed to sanitize malformed persisted jobs after quarantine; continuing with quarantined in-memory view",
        );
      }
  }
  if (!opts?.skipRecompute) recomputeNextRuns(state);
}
/** Emits the cron-disabled warning once per service state. */
function warnIfDisabled(state, action) {
  if (state.deps.cronEnabled) return;
  if (state.warnedDisabled) return;
  state.warnedDisabled = true;
  state.deps.log.warn(
    {
      enabled: false,
      action,
      storePath: state.deps.storePath,
    },
    "cron: scheduler disabled; jobs will not run automatically",
  );
}
/** Persists the in-memory cron store, flushing pending quarantine records first. */
async function persist(state, opts) {
  const store = state.store;
  if (!store) return false;
  let flushedPendingQuarantine = false;
  if (state.pendingQuarantineConfigJobs.length > 0) {
    if (!(await flushPendingQuarantine(state, state.deps.nowMs()))) return false;
    flushedPendingQuarantine = true;
  }
  const stateOnly = !flushedPendingQuarantine && opts?.stateOnly === true;
  await saveCronJobsStore(state.deps.storePath, store, stateOnly ? { stateOnly: true } : void 0);
  publishDurableNextRunChanges({
    state,
    storeJobs: store.jobs,
    stateOnly,
    suppressScheduledJobId: opts?.suppressScheduledJobId,
  });
  return true;
}
/** Captures the live cron state that must stay aligned with the durable store. */
function snapshotStoreForRollback(state) {
  return {
    store: state.store ? structuredClone(state.store) : null,
    durableNextRunAtMsByJobId: new Map(state.durableNextRunAtMsByJobId),
    pendingCatchupDeferralJobIds: new Set(state.pendingCatchupDeferralJobIds),
  };
}
async function persistOrRestore(state, snapshot, opts = {}) {
  try {
    if (
      !(await persist(
        state,
        opts.suppressScheduledJobId === void 0
          ? void 0
          : { suppressScheduledJobId: opts.suppressScheduledJobId },
      ))
    )
      throw new Error("cron: durable store write did not complete");
  } catch (err) {
    state.store = snapshot.store;
    state.durableNextRunAtMsByJobId = snapshot.durableNextRunAtMsByJobId;
    state.pendingCatchupDeferralJobIds = snapshot.pendingCatchupDeferralJobIds;
    throw err;
  }
  for (const notify of opts.postPersistAutoDisableNotifications ?? []) notify();
}
//#endregion
//#region src/cron/service/timeout-policy.ts
/** Resolves cron job wall-clock timeout policy. */
/**
 * Maximum wall-clock time for a single job execution. Acts as a safety net
 * on top of per-provider/per-agent timeouts to prevent one stuck job from
 * wedging the entire cron lane.
 */
const DEFAULT_JOB_TIMEOUT_MS = 10 * 6e4;
/**
 * Agent turns can legitimately run much longer than generic cron jobs.
 * Use a larger safety ceiling when no explicit timeout is set.
 */
const AGENT_TURN_SAFETY_TIMEOUT_MS = 60 * 6e4;
/** Resolves the wall-clock timeout for a cron job, including explicit detached-run overrides. */
function resolveCronJobTimeoutMs(job) {
  const configuredTimeoutMs =
    (job.payload.kind === "agentTurn" || job.payload.kind === "command") &&
    typeof job.payload.timeoutSeconds === "number"
      ? (finiteSecondsToTimerSafeMilliseconds(job.payload.timeoutSeconds) ?? 0)
      : void 0;
  if (configuredTimeoutMs === void 0)
    return job.payload.kind === "agentTurn" ? AGENT_TURN_SAFETY_TIMEOUT_MS : DEFAULT_JOB_TIMEOUT_MS;
  return configuredTimeoutMs <= 0 ? void 0 : configuredTimeoutMs;
}
//#endregion
//#region src/cron/service/timer-outcome-finalization.ts
/** Finalizes cron task rows and active markers after timer outcome persistence. */
function finishPersistedQuietCronTaskRuns(state, outcomes) {
  for (const outcome of outcomes)
    if (outcome.status === "ok" && outcome.triggerEval && !outcome.triggerEval.fired)
      tryFinishCronTaskRunWithoutHistory(state, outcome);
}
function clearActiveMarkersForOutcomes(outcomes) {
  for (const outcome of outcomes) clearCronJobActive(outcome.jobId, outcome.activeJobMarker);
}
function filterCurrentCronRunOutcomes(outcomes) {
  return outcomes.filter((outcome) => isCronActiveJobMarkerCurrent(outcome.activeJobMarker));
}
function finishRetiredCronTaskRuns(state, outcomes, currentOutcomes) {
  const current = new Set(currentOutcomes);
  for (const outcome of outcomes)
    if (!current.has(outcome)) tryFinishCronTaskRunWithoutHistory(state, outcome);
}
function releaseUnstartedStartupCatchupReservations(state, plan, outcomes) {
  let changed = false;
  const startedJobIds = new Set(outcomes.map((outcome) => outcome.jobId));
  for (const candidate of plan.candidates) {
    if (startedJobIds.has(candidate.jobId)) continue;
    const job = state.store?.jobs.find((entry) => entry.id === candidate.jobId);
    if (job?.state && job.state.runningAtMs === candidate.reservedAtMs) {
      delete job.state.runningAtMs;
      changed = true;
    }
  }
  return changed;
}
//#endregion
//#region src/cron/service/timer.ts
/** Cron timer loop, execution, catch-up, and run-result state transitions. */
const MAX_TIMER_DELAY_MS = 6e4;
const HEARTBEAT_SKIP_DISABLED = "disabled";
/**
 * Minimum gap between consecutive fires of the same cron job.  This is a
 * safety net that prevents spin-loops when `computeJobNextRunAtMs` returns
 * a value within the same second as the just-completed run.  The guard
 * is intentionally generous (2 s) so it never masks a legitimate schedule
 * but always breaks an infinite re-trigger cycle.  (See #17821)
 */
const MIN_REFIRE_GAP_MS = 2e3;
const DEFAULT_MISSED_JOB_STAGGER_MS = 5e3;
const DEFAULT_MAX_MISSED_JOBS_PER_RESTART = 5;
const DEFAULT_STARTUP_DEFERRED_MISSED_AGENT_JOB_DELAY_MS = 2 * 6e4;
/**
 * Carries the already-resolved run attribution from watchdog-visible execution
 * state into a timer-built error outcome. The wall-clock/cancel paths return
 * their own outcome (the inner run result loses the Promise.race), so without
 * this the persisted cron run record drops provider/model/session for a
 * post-runner timeout or cancel even though they were already known. Stays
 * empty before the runner starts, so pre-execution setup timeouts read blank.
 */
function cronRunAttributionFromExecution(execution) {
  if (!execution) return {};
  return {
    provider: execution.provider,
    model: execution.model,
    sessionId: execution.sessionId,
    sessionKey: execution.sessionKey,
  };
}
/** Executes cron job core logic with the configured wall-clock timeout and watchdog cleanup. */
async function executeJobCoreWithTimeout(state, job, opts) {
  const runAbortController = new AbortController();
  const operatorCancellationMarker = Symbol("cron-operator-cancelled");
  let resolveOperatorCancellation;
  const operatorCancellationPromise = new Promise((resolve) => {
    resolveOperatorCancellation = resolve;
  });
  const createOperatorCancellationOutcome = (execution) => {
    const error = abortErrorMessage(runAbortController.signal);
    return {
      status: "error",
      error,
      ...cronRunAttributionFromExecution(execution),
      diagnostics: createCronRunDiagnosticsFromError("cron-setup", error, {
        nowMs: state.deps.nowMs,
      }),
    };
  };
  if (!isCronActiveJobMarkerCurrent(opts?.activeJobMarker)) {
    runAbortController.abort("Gateway restarting.");
    return createOperatorCancellationOutcome();
  }
  const releaseCronTaskRun =
    job.sessionTarget !== "main"
      ? registerActiveCronTaskRun({
          runId: opts?.runId ?? `cron-active:${job.id}`,
          controller: runAbortController,
          onCancel: () => resolveOperatorCancellation?.(operatorCancellationMarker),
        })
      : void 0;
  const jobTimeoutMs = resolveCronJobTimeoutMs(job);
  try {
    if (typeof jobTimeoutMs !== "number") {
      let activeExecution;
      const accumulateExecution = (info) => {
        if (info)
          activeExecution = {
            ...activeExecution,
            ...info,
          };
      };
      const corePromise = executeJobCore(state, job, runAbortController.signal, {
        onExecutionStarted: accumulateExecution,
        onExecutionPhase: accumulateExecution,
      });
      trackActiveCronTaskRunSettlement(corePromise);
      corePromise.catch((err) => {
        if (runAbortController.signal.aborted)
          state.deps.log.warn(
            {
              jobId: job.id,
              err: String(err),
            },
            "cron: job core rejected after cancellation abort",
          );
      });
      const first = await Promise.race([corePromise, operatorCancellationPromise]);
      if (first !== operatorCancellationMarker) return first;
      startActiveCronTaskRunSettlementGrace();
      return createOperatorCancellationOutcome(activeExecution);
    }
    let timeoutReason;
    const timeoutMarker = Symbol("cron-timeout");
    let resolveTimeout;
    const timeoutPromise = new Promise((resolve) => {
      resolveTimeout = resolve;
    });
    const deferTimeoutUntilExecutionStart =
      job.sessionTarget !== "main" && job.payload.kind === "agentTurn";
    const triggerTimeout = (reason) => {
      timeoutReason = reason;
      if (!runAbortController.signal.aborted) {
        const timeoutError = new Error(reason);
        timeoutError.name = "TimeoutError";
        runAbortController.abort(timeoutError);
      }
      resolveTimeout?.(timeoutMarker);
    };
    const watchdog = createCronAgentWatchdog({
      deferUntilRunner: deferTimeoutUntilExecutionStart,
      jobTimeoutMs,
      triggerTimeout,
    });
    const noteLaneState = (info) => {
      if (info?.waiting === false) {
        watchdog.noteLaneAdmitted();
        return;
      }
      watchdog.noteLaneWait();
    };
    const corePromise = executeJobCore(state, job, runAbortController.signal, {
      onExecutionStarted: deferTimeoutUntilExecutionStart ? watchdog.noteRunnerStarted : void 0,
      onExecutionPhase: deferTimeoutUntilExecutionStart ? watchdog.notePhase : void 0,
      onLaneWait: deferTimeoutUntilExecutionStart ? noteLaneState : void 0,
    });
    trackActiveCronTaskRunSettlement(corePromise);
    watchdog.start();
    corePromise.catch((err) => {
      if (runAbortController.signal.aborted)
        state.deps.log.warn(
          {
            jobId: job.id,
            err: String(err),
          },
          "cron: job core rejected after timeout abort",
        );
    });
    try {
      const first = await Promise.race([corePromise, timeoutPromise, operatorCancellationPromise]);
      if (first === operatorCancellationMarker) {
        startActiveCronTaskRunSettlementGrace();
        return createOperatorCancellationOutcome(watchdog.activeExecution());
      }
      if (first !== timeoutMarker) return first;
      startActiveCronTaskRunSettlementGrace();
      const activeExecution = watchdog.activeExecution();
      await cleanupTimedOutCronAgentRun(state, job, jobTimeoutMs, activeExecution);
      const error = timeoutReason ?? timeoutErrorMessage(activeExecution);
      const observedLaneWait = watchdog.observedLaneWait();
      const isolatedAgentSetupTimeout =
        job.sessionTarget === "isolated" && isSetupTimeoutErrorText(error) && !observedLaneWait
          ? {
              error,
              timeoutMs: CRON_AGENT_SETUP_WATCHDOG_MS,
              otherCronJobsActiveAtTimeout: false,
            }
          : void 0;
      return {
        status: "error",
        error,
        ...cronRunAttributionFromExecution(activeExecution),
        diagnostics: createCronRunDiagnosticsFromError("cron-setup", error, {
          nowMs: state.deps.nowMs,
        }),
        ...(isolatedAgentSetupTimeout ? { isolatedAgentSetupTimeout } : {}),
      };
    } finally {
      watchdog.dispose();
    }
  } finally {
    releaseCronTaskRun?.();
  }
}
function notifyIsolatedAgentSetupTimeout(state, job, error, timeoutMs) {
  const notify = state.deps.onIsolatedAgentSetupTimeout;
  if (!notify) return false;
  try {
    Promise.resolve(
      notify({
        job,
        error,
        timeoutMs,
      }),
    ).catch((err) => {
      state.restartRecoveryPending = false;
      state.deps.log.warn(
        {
          jobId: job.id,
          err: String(err),
        },
        "cron: isolated setup timeout handler failed",
      );
      armTimer(state);
    });
    return true;
  } catch (err) {
    state.deps.log.warn(
      {
        jobId: job.id,
        err: String(err),
      },
      "cron: isolated setup timeout handler failed",
    );
    return false;
  }
}
function maybeNotifyIsolatedAgentSetupTimeout(state, result) {
  const signal = result.isolatedAgentSetupTimeout;
  if (!signal) return false;
  if (!notifyIsolatedAgentSetupTimeout(state, result.job, signal.error, signal.timeoutMs))
    return false;
  return true;
}
function resolveRunConcurrency(state) {
  return resolveIntegerOption(state.deps.cronConfig?.maxConcurrentRuns, 1, { min: 1 });
}
function resolveMainSessionCronDeliveryContext(state, job) {
  const targetSessionKey = job.sessionKey?.trim();
  if (!targetSessionKey) return;
  const explicitAgentId = job.agentId?.trim();
  const agentId = normalizeAgentId(
    explicitAgentId || resolveAgentIdFromSessionKey(targetSessionKey),
  );
  const storePath = state.deps.resolveSessionStorePath?.(agentId) ?? state.deps.sessionStorePath;
  if (!storePath) return;
  try {
    return deliveryContextFromSession(
      loadSessionEntry({
        agentId,
        sessionKey: targetSessionKey,
        storePath,
      }),
    );
  } catch {
    return;
  }
}
/** Default max retries for cron jobs on transient errors (#24355). */
const DEFAULT_MAX_TRANSIENT_RETRIES = 3;
function resolveCronNextRunWithLowerBound(params) {
  if (params.naturalNext === void 0) {
    params.state.deps.log.warn(
      {
        jobId: params.job.id,
        jobName: params.job.name,
        context: params.context,
      },
      "cron: next run unresolved; clearing schedule to avoid a refire loop",
    );
    return;
  }
  return Math.max(params.naturalNext, params.lowerBoundMs);
}
function resolveRetryConfig(cronConfig) {
  const retry = cronConfig?.retry;
  return {
    maxAttempts:
      typeof retry?.maxAttempts === "number" ? retry.maxAttempts : DEFAULT_MAX_TRANSIENT_RETRIES,
    backoffMs:
      Array.isArray(retry?.backoffMs) && retry.backoffMs.length > 0
        ? retry.backoffMs
        : DEFAULT_ERROR_BACKOFF_SCHEDULE_MS.slice(0, 3),
    retryOn: Array.isArray(retry?.retryOn) && retry.retryOn.length > 0 ? retry.retryOn : void 0,
  };
}
function resolveTransientCronRetryDecision(params) {
  const retryConfig = resolveRetryConfig(params.cronConfig);
  const retryHint = resolveCronExecutionRetryHint(
    params.error,
    retryConfig.retryOn,
    params.lastErrorReason,
  );
  const consecutiveErrors = params.consecutiveErrors ?? 0;
  if (!retryHint.retryable)
    return {
      retryable: false,
      consecutiveErrors,
      retryCategory: retryHint.category,
      reason: "permanent error",
    };
  if (consecutiveErrors > retryConfig.maxAttempts)
    return {
      retryable: false,
      consecutiveErrors,
      retryCategory: retryHint.category,
      reason: "max retries exhausted",
    };
  return {
    retryable: true,
    consecutiveErrors,
    retryCategory: retryHint.category,
    backoffMs: errorBackoffMs(consecutiveErrors, retryConfig.backoffMs),
    reason: "transient retry",
  };
}
function resolveDisabledHeartbeatOneShotRetryDecision(params) {
  const retryConfig = resolveRetryConfig(params.cronConfig);
  const consecutiveSkipped = params.consecutiveSkipped ?? 0;
  if (consecutiveSkipped > retryConfig.maxAttempts)
    return {
      retryable: false,
      consecutiveSkipped,
      reason: "max retries exhausted",
    };
  return {
    retryable: true,
    consecutiveSkipped,
    backoffMs: errorBackoffMs(consecutiveSkipped, retryConfig.backoffMs),
    reason: "disabled heartbeat retry",
  };
}
function normalizeQueuedSystemEventHandle(result) {
  if (typeof result === "boolean") return { accepted: result };
  if (result && typeof result === "object")
    return {
      accepted: result.accepted !== false,
      ...(result.remove ? { remove: result.remove } : {}),
    };
  return { accepted: true };
}
function removeQueuedSystemEventHandle(state, job, queued) {
  if (!queued.accepted || !queued.remove) return;
  try {
    queued.remove();
  } catch (err) {
    state.deps.log.warn(
      {
        jobId: job.id,
        jobName: job.name,
        err,
      },
      "cron: failed to remove undelivered main-session system event",
    );
  }
}
function shouldRetryDisabledHeartbeatOneShot(job, result) {
  return (
    job.schedule.kind === "at" &&
    job.sessionTarget === "main" &&
    job.wakeMode === "now" &&
    result.status === "skipped" &&
    result.error === HEARTBEAT_SKIP_DISABLED
  );
}
function isScheduledTerminalOneShotRetry(job, lastRunStatus, lastRun, nextRun) {
  if (
    !isJobEnabled(job) ||
    typeof nextRun !== "number" ||
    typeof lastRun !== "number" ||
    nextRun <= lastRun
  )
    return false;
  if (lastRunStatus === "error") return true;
  return (
    lastRunStatus === "skipped" &&
    job.sessionTarget === "main" &&
    job.wakeMode === "now" &&
    job.state.lastError === HEARTBEAT_SKIP_DISABLED
  );
}
function resolveDeliveryState(params) {
  const primaryDeliveryRequested = resolveCronDeliveryPlan(params.job).requested;
  const alternateFailureNotificationRequested =
    params.runStatus === "error" &&
    params.job.delivery?.bestEffort !== true &&
    resolveFailureDestination(params.job, params.globalFailureDestination) !== null;
  if (!primaryDeliveryRequested)
    return {
      status: "not-requested",
      failureNotification: {
        status: alternateFailureNotificationRequested ? "unknown" : "not-requested",
      },
    };
  if (params.runStatus === "error") {
    const failureNotification = alternateFailureNotificationRequested
      ? { status: "unknown" }
      : { status: "delivered" };
    if (params.delivered === true)
      return {
        delivered: false,
        status: "not-delivered",
        error: params.error,
        failureNotification: alternateFailureNotificationRequested
          ? failureNotification
          : {
              delivered: true,
              status: "delivered",
            },
      };
    if (params.delivered === false)
      return {
        delivered: false,
        status: "not-delivered",
        error: params.error,
        failureNotification: alternateFailureNotificationRequested
          ? failureNotification
          : {
              delivered: false,
              status: "not-delivered",
              ...(params.error ? { error: params.error } : {}),
            },
      };
    return {
      status: "unknown",
      error: params.error,
      failureNotification: { status: "unknown" },
    };
  }
  if (params.delivered === true)
    return {
      delivered: true,
      status: "delivered",
      failureNotification: { status: "not-requested" },
    };
  if (params.delivered === false)
    return {
      delivered: false,
      status: "not-delivered",
      error: params.error,
      failureNotification: { status: "not-requested" },
    };
  return {
    status: "unknown",
    failureNotification: { status: "not-requested" },
  };
}
/** Applies run outcome state, delivery state, backoff/next-run scheduling, and delete-after-run policy. */
function applyJobResult(state, job, result, opts) {
  const prevLastRunAtMs = job.state.lastRunAtMs;
  const computeNextWithPreservedLastRun = (nowMs) => {
    const saved = job.state.lastRunAtMs;
    job.state.lastRunAtMs = prevLastRunAtMs;
    try {
      return computeJobNextRunAtMs(job, nowMs);
    } finally {
      job.state.lastRunAtMs = saved;
    }
  };
  job.state.runningAtMs = void 0;
  job.state.lastRunAtMs = result.startedAt;
  job.state.lastRunStatus = result.status;
  job.state.lastStatus = result.status;
  job.state.lastDurationMs = Math.max(0, result.endedAt - result.startedAt);
  job.state.lastError = result.error;
  job.state.lastDiagnostics = normalizeCronRunDiagnostics(result.diagnostics);
  job.state.lastDiagnosticSummary = summarizeCronRunDiagnostics(job.state.lastDiagnostics);
  job.state.lastErrorReason =
    result.status === "error" && typeof result.error === "string"
      ? (resolveFailoverReasonFromError(result.error, result.provider) ?? void 0)
      : void 0;
  if (result.status === "error")
    state.deps.log.warn(
      {
        jobId: job.id,
        jobName: job.name,
        error: result.error,
        diagnosticsSummary: job.state.lastDiagnosticSummary,
      },
      "cron: job run returned error status",
    );
  const deliveryState = resolveDeliveryState({
    job,
    runStatus: result.status,
    delivered: result.delivered,
    error: result.deliveryError ?? result.error,
    globalFailureDestination: state.deps.cronConfig?.failureDestination,
  });
  job.state.lastDelivered = deliveryState.delivered;
  job.state.lastDeliveryStatus = deliveryState.status;
  job.state.lastDeliveryError =
    deliveryState.status === "not-delivered" && deliveryState.error ? deliveryState.error : void 0;
  job.state.lastFailureNotificationDelivered = deliveryState.failureNotification.delivered;
  job.state.lastFailureNotificationDeliveryStatus = deliveryState.failureNotification.status;
  job.state.lastFailureNotificationDeliveryError = deliveryState.failureNotification.error;
  job.updatedAtMs = result.endedAt;
  const previousConsecutiveErrors = job.state.consecutiveErrors ?? 0;
  const alertConfig = resolveFailureAlert(state, job);
  if (result.status === "error") {
    job.state.consecutiveErrors = (job.state.consecutiveErrors ?? 0) + 1;
    job.state.consecutiveSkipped = 0;
    maybeEmitFailureAlert(state, {
      job,
      alertConfig,
      status: "error",
      error: result.error,
      provider: result.provider,
      consecutiveCount: job.state.consecutiveErrors,
      ...(opts?.replayFailureAlertAtMs !== void 0
        ? {
            delivery: "record-only",
            occurredAtMs: opts.replayFailureAlertAtMs,
          }
        : {}),
    });
  } else if (result.status === "skipped") {
    job.state.consecutiveErrors = 0;
    job.state.consecutiveSkipped = (job.state.consecutiveSkipped ?? 0) + 1;
    if (alertConfig?.includeSkipped)
      maybeEmitFailureAlert(state, {
        job,
        alertConfig,
        status: "skipped",
        error: result.error,
        provider: result.provider,
        consecutiveCount: job.state.consecutiveSkipped,
        ...(opts?.replayFailureAlertAtMs !== void 0
          ? {
              delivery: "record-only",
              occurredAtMs: opts.replayFailureAlertAtMs,
            }
          : {}),
      });
    else job.state.lastFailureAlertAtMs = void 0;
  } else {
    job.state.consecutiveErrors = 0;
    job.state.consecutiveSkipped = 0;
    job.state.lastFailureAlertAtMs = void 0;
  }
  const shouldDelete =
    (job.schedule.kind === "at" || job.schedule.kind === "on-exit") &&
    job.deleteAfterRun === true &&
    result.status === "ok";
  const retryDisabledHeartbeatOneShot = shouldRetryDisabledHeartbeatOneShot(job, result);
  if (!shouldDelete)
    if (job.schedule.kind === "at") {
      if (retryDisabledHeartbeatOneShot) {
        const retryDecision = resolveDisabledHeartbeatOneShotRetryDecision({
          cronConfig: state.deps.cronConfig,
          consecutiveSkipped: job.state.consecutiveSkipped,
        });
        if (retryDecision.retryable && retryDecision.backoffMs !== void 0) {
          job.enabled = true;
          job.state.nextRunAtMs = result.endedAt + retryDecision.backoffMs;
          state.deps.log.info(
            {
              jobId: job.id,
              jobName: job.name,
              consecutiveSkipped: retryDecision.consecutiveSkipped,
              backoffMs: retryDecision.backoffMs,
              nextRunAtMs: job.state.nextRunAtMs,
            },
            "cron: scheduling one-shot retry after disabled heartbeat",
          );
        } else {
          job.enabled = false;
          job.state.nextRunAtMs = void 0;
          state.deps.log.warn(
            {
              jobId: job.id,
              jobName: job.name,
              consecutiveSkipped: retryDecision.consecutiveSkipped,
              reason: retryDecision.reason,
            },
            "cron: disabling one-shot job after disabled heartbeat retries",
          );
        }
      } else if (result.status === "ok" || result.status === "skipped") {
        job.enabled = false;
        job.state.nextRunAtMs = void 0;
      } else if (result.status === "error") {
        const retryDecision = resolveTransientCronRetryDecision({
          cronConfig: state.deps.cronConfig,
          error: result.error,
          lastErrorReason: job.state.lastErrorReason,
          consecutiveErrors: job.state.consecutiveErrors,
        });
        if (retryDecision.retryable && retryDecision.backoffMs !== void 0) {
          job.state.nextRunAtMs = result.endedAt + retryDecision.backoffMs;
          state.deps.log.info(
            {
              jobId: job.id,
              jobName: job.name,
              consecutiveErrors: retryDecision.consecutiveErrors,
              backoffMs: retryDecision.backoffMs,
              nextRunAtMs: job.state.nextRunAtMs,
              retryCategory: retryDecision.retryCategory,
            },
            "cron: scheduling one-shot retry after transient error",
          );
        } else {
          job.enabled = false;
          job.state.nextRunAtMs = void 0;
          state.deps.log.warn(
            {
              jobId: job.id,
              jobName: job.name,
              consecutiveErrors: retryDecision.consecutiveErrors,
              error: result.error,
              reason: retryDecision.reason,
              retryCategory: retryDecision.retryCategory,
            },
            "cron: disabling one-shot job after error",
          );
        }
      }
    } else if (result.status === "error" && isJobEnabled(job)) {
      const retryDecision = resolveTransientCronRetryDecision({
        cronConfig: state.deps.cronConfig,
        error: result.error,
        lastErrorReason: job.state.lastErrorReason,
        consecutiveErrors: job.state.consecutiveErrors,
      });
      let normalNext;
      let normalNextComputed = false;
      const computeNormalNext = () => {
        if (!normalNextComputed) {
          try {
            normalNext =
              opts?.preserveSchedule && job.schedule.kind === "every"
                ? computeNextWithPreservedLastRun(result.endedAt)
                : (retryDecision.retryable || previousConsecutiveErrors > 0) &&
                    job.schedule.kind === "every"
                  ? computeNextRunAtMs(job.schedule, result.endedAt)
                  : computeJobNextRunAtMs(job, result.endedAt);
          } catch (err) {
            recordScheduleComputeError({
              state,
              job,
              err,
            });
          }
          normalNextComputed = true;
        }
        return normalNext;
      };
      if (
        !opts?.preserveSchedule &&
        retryDecision.retryable &&
        retryDecision.backoffMs !== void 0
      ) {
        normalNext = computeNormalNext();
        const retryNextRunAtMs = result.endedAt + retryDecision.backoffMs;
        if (normalNext === void 0) {
        } else if (retryNextRunAtMs < normalNext) {
          job.state.nextRunAtMs = retryNextRunAtMs;
          state.deps.log.info(
            {
              jobId: job.id,
              jobName: job.name,
              consecutiveErrors: retryDecision.consecutiveErrors,
              backoffMs: retryDecision.backoffMs,
              nextRunAtMs: job.state.nextRunAtMs,
              normalNextRunAtMs: normalNext,
              retryCategory: retryDecision.retryCategory,
            },
            "cron: scheduling recurring retry after transient error",
          );
          return shouldDelete;
        }
      }
      const backoff = errorBackoffMs(
        job.state.consecutiveErrors ?? 1,
        state.deps.cronConfig?.retry?.backoffMs ?? DEFAULT_ERROR_BACKOFF_SCHEDULE_MS,
      );
      normalNext = computeNormalNext();
      const backoffNext = result.endedAt + backoff;
      job.state.nextRunAtMs =
        job.schedule.kind === "cron"
          ? resolveCronNextRunWithLowerBound({
              state,
              job,
              naturalNext: normalNext,
              lowerBoundMs: backoffNext,
              context: "error_backoff",
            })
          : normalNext !== void 0
            ? Math.max(normalNext, backoffNext)
            : backoffNext;
      state.deps.log.info(
        {
          jobId: job.id,
          consecutiveErrors: job.state.consecutiveErrors,
          backoffMs: backoff,
          nextRunAtMs: job.state.nextRunAtMs,
        },
        "cron: applying error backoff",
      );
    } else if (isJobEnabled(job)) {
      let naturalNext;
      try {
        naturalNext =
          opts?.preserveSchedule && job.schedule.kind === "every"
            ? computeNextWithPreservedLastRun(result.endedAt)
            : previousConsecutiveErrors > 0 && job.schedule.kind === "every"
              ? computeNextRunAtMs(job.schedule, result.endedAt)
              : computeJobNextRunAtMs(job, result.endedAt);
      } catch (err) {
        recordScheduleComputeError({
          state,
          job,
          err,
        });
      }
      if (job.schedule.kind === "cron") {
        const minNext =
          result.endedAt +
          Math.max(
            MIN_REFIRE_GAP_MS,
            job.trigger ? resolveCronTriggerMinIntervalMs(state.deps.cronConfig) : 0,
          );
        job.state.nextRunAtMs = resolveCronNextRunWithLowerBound({
          state,
          job,
          naturalNext,
          lowerBoundMs: minNext,
          context: "completion",
        });
      } else
        job.state.nextRunAtMs =
          naturalNext !== void 0 && job.trigger
            ? Math.max(
                naturalNext,
                result.endedAt + resolveCronTriggerMinIntervalMs(state.deps.cronConfig),
              )
            : naturalNext;
    } else job.state.nextRunAtMs = void 0;
  return shouldDelete;
}
function applyTriggerEvaluationState(job, triggerEval, evaluatedAtMs) {
  if (triggerEval.busy) return;
  job.state.lastTriggerEvalAtMs = evaluatedAtMs;
  job.state.triggerEvalCount = (job.state.triggerEvalCount ?? 0) + 1;
  if (triggerEval.stateChanged) job.state.triggerState = triggerEval.state;
  if (triggerEval.fired) job.state.lastTriggerFireAtMs = evaluatedAtMs;
}
/** Persists fired/error evaluation metadata and applies successful once-disarm policy. */
function applyTriggerRunResult(job, result) {
  if (!result.triggerEval) return;
  applyTriggerEvaluationState(
    job,
    result.status === "ok"
      ? result.triggerEval
      : {
          ...result.triggerEval,
          stateChanged: false,
          state: void 0,
        },
    result.endedAt,
  );
  if (result.triggerEval.fired && job.trigger?.once === true && result.status === "ok") {
    job.enabled = false;
    job.state.nextRunAtMs = void 0;
  }
}
/** Applies a quiet trigger tick without mutating normal run-history state. */
function applyTriggerNoFireResult(state, job, result) {
  job.state.runningAtMs = void 0;
  job.updatedAtMs = result.endedAt;
  if (!result.triggerEval.busy) {
    job.state.consecutiveErrors = 0;
    job.state.scheduleErrorCount = 0;
    job.state.lastFailureAlertAtMs = void 0;
    applyTriggerEvaluationState(job, result.triggerEval, result.endedAt);
  }
  try {
    const naturalNext = computeJobNextRunAtMs(job, result.endedAt);
    const floorMs = Math.max(
      MIN_REFIRE_GAP_MS,
      resolveCronTriggerMinIntervalMs(state.deps.cronConfig),
    );
    job.state.nextRunAtMs =
      naturalNext === void 0 ? void 0 : Math.max(naturalNext, result.endedAt + floorMs);
  } catch (err) {
    recordScheduleComputeError({
      state,
      job,
      err,
    });
  }
}
function applyOutcomeToStoredJob(state, result) {
  const store = state.store;
  if (!store) {
    tryFinishCronTaskRunWithoutHistory(state, result);
    return;
  }
  const jobs = store.jobs;
  const job = jobs.find((entry) => entry.id === result.jobId);
  if (!job) {
    if (result.status === "ok" && result.triggerEval?.fired === false) {
      tryFinishCronTaskRunWithoutHistory(state, result);
      return;
    }
    if (result.status === "ok") {
      applyJobResult(state, result.job, {
        status: result.status,
        error: result.error,
        deliveryError: result.deliveryError,
        diagnostics: result.diagnostics,
        delivered: result.delivered,
        provider: result.provider,
        startedAt: result.startedAt,
        endedAt: result.endedAt,
      });
      emitJobFinished(state, result.job, result, result.startedAt);
      state.deps.log.info(
        { jobId: result.jobId },
        "cron: finalized successful run after job was removed during execution",
      );
      return;
    }
    state.deps.log.warn(
      { jobId: result.jobId },
      "cron: applyOutcomeToStoredJob — job not found after forceReload, result discarded",
    );
    tryFinishCronTaskRunWithoutHistory(state, result);
    return;
  }
  if (result.status === "ok" && result.triggerEval && !result.triggerEval.fired) {
    applyTriggerNoFireResult(state, job, {
      startedAt: result.startedAt,
      endedAt: result.endedAt,
      triggerEval: result.triggerEval,
    });
    state.pendingCatchupDeferralJobIds.delete(job.id);
    return;
  }
  const shouldDelete = applyJobResult(state, job, {
    status: result.status,
    error: result.error,
    deliveryError: result.deliveryError,
    diagnostics: result.diagnostics,
    delivered: result.delivered,
    provider: result.provider,
    startedAt: result.startedAt,
    endedAt: result.endedAt,
  });
  applyTriggerRunResult(job, result);
  state.pendingCatchupDeferralJobIds.delete(job.id);
  emitJobFinished(state, job, result, result.startedAt);
  if (shouldDelete) {
    store.jobs = jobs.filter((entry) => entry.id !== job.id);
    return job;
  }
}
/** Arms the cron timer for the next wake or a maintenance recheck. */
function armTimer(state) {
  if (state.timer) clearTimeout(state.timer);
  state.timer = null;
  if (state.stopped || state.schedulingPaused) {
    state.deps.log.debug({}, "cron: armTimer skipped - scheduler stopped");
    return;
  }
  if (!state.deps.cronEnabled) {
    state.deps.log.debug({}, "cron: armTimer skipped - scheduler disabled");
    return;
  }
  if (state.restartRecoveryPending) {
    state.deps.log.warn({}, "cron: armTimer skipped - restart recovery pending");
    return;
  }
  const nextAt = nextWakeAtMs(state);
  if (!nextAt) {
    const jobCount = state.store?.jobs.length ?? 0;
    const enabledCount = state.store?.jobs.filter((j) => j.enabled).length ?? 0;
    const withNextRun =
      state.store?.jobs.filter((j) => j.enabled && hasScheduledNextRunAtMs(j.state.nextRunAtMs))
        .length ?? 0;
    if (enabledCount > 0) {
      armRunningRecheckTimer(state);
      state.deps.log.debug(
        {
          jobCount,
          enabledCount,
          withNextRun,
          delayMs: MAX_TIMER_DELAY_MS,
        },
        "cron: timer armed for maintenance recheck",
      );
      return;
    }
    state.deps.log.debug(
      {
        jobCount,
        enabledCount,
        withNextRun,
      },
      "cron: armTimer skipped - no jobs with nextRunAtMs",
    );
    return;
  }
  const now = state.deps.nowMs();
  const delay = Math.max(nextAt - now, 0);
  const clampedDelay = Math.min(delay === 0 ? MIN_REFIRE_GAP_MS : delay, MAX_TIMER_DELAY_MS);
  state.timer = setTimeout(() => {
    onTimer(state).catch((err) => {
      state.deps.log.error({ err: String(err) }, "cron: timer tick failed");
    });
  }, clampedDelay);
  state.deps.log.debug(
    {
      nextAt,
      delayMs: clampedDelay,
      clamped: delay > MAX_TIMER_DELAY_MS,
    },
    "cron: timer armed",
  );
}
function armRunningRecheckTimer(state) {
  if (state.stopped || state.schedulingPaused) return;
  if (state.timer) clearTimeout(state.timer);
  state.timer = setTimeout(() => {
    onTimer(state).catch((err) => {
      state.deps.log.error({ err: String(err) }, "cron: timer tick failed");
    });
  }, MAX_TIMER_DELAY_MS);
}
/** Handles one cron timer tick under the process-wide root work admission. */
async function onTimer(state) {
  let admission;
  try {
    admission = await beginGatewayRootWorkAdmissionWhenOpen();
  } catch (err) {
    if (err instanceof GatewayDrainingError) return;
    throw err;
  }
  try {
    await admission.run(async () => await onAdmittedTimer(state));
  } finally {
    admission.release();
  }
}
/** Loads due jobs, reserves them, executes, persists, and re-arms. */
async function onAdmittedTimer(state) {
  if (state.stopped || state.schedulingPaused) return;
  if (state.restartRecoveryPending) {
    state.deps.log.warn({}, "cron: timer tick skipped - restart recovery pending");
    return;
  }
  if (state.running) {
    armRunningRecheckTimer(state);
    return;
  }
  state.running = true;
  armRunningRecheckTimer(state);
  try {
    const dueJobs = await locked(state, async () => {
      await ensureLoaded(state, {
        forceReload: true,
        skipRecompute: true,
      });
      if (state.stopped || state.restartRecoveryPending) {
        state.deps.log.warn(
          {
            stopped: state.stopped,
            restartRecoveryPending: state.restartRecoveryPending,
          },
          "cron: due job reservation skipped - scheduler unavailable",
        );
        return [];
      }
      const dueCheckNow = state.deps.nowMs();
      const due = collectRunnableJobs(state, dueCheckNow);
      if (due.length === 0) {
        if (
          recomputeNextRunsForMaintenance(state, {
            recomputeExpired: true,
            nowMs: dueCheckNow,
          })
        )
          await persist(state);
        return [];
      }
      const now = state.deps.nowMs();
      for (const job of due) job.state.runningAtMs = now;
      await persist(state);
      if (state.stopped) {
        for (const job of due) delete job.state.runningAtMs;
        recomputeNextRunsForMaintenance(state);
        await persist(state);
        return [];
      }
      return due.map((j) => ({
        id: j.id,
        job: j,
        reservedAtMs: now,
      }));
    });
    const runDueJob = async (params) => {
      const { id, job } = params;
      const startedAt = state.deps.nowMs();
      const executionJob = structuredClone(job);
      job.state.lastError = void 0;
      executionJob.state.runningAtMs = startedAt;
      executionJob.state.lastError = void 0;
      const activeJobMarker = markCronJobActive(executionJob.id, {
        preserveAcrossGenerationAdvance: executionJob.sessionTarget === "main",
      });
      emit(state, {
        jobId: executionJob.id,
        action: "started",
        job: executionJob,
        runAtMs: startedAt,
      });
      const jobTimeoutMs = resolveCronJobTimeoutMs(executionJob);
      const taskRunId = tryCreateCronTaskRun({
        state,
        job: executionJob,
        startedAt,
        runIdStartedAt: params.reservedAtMs,
      });
      try {
        return {
          jobId: id,
          job: executionJob,
          taskRunId,
          activeJobMarker,
          ...(await executeJobCoreWithTimeout(state, executionJob, {
            runId: taskRunId,
            activeJobMarker,
          })),
          startedAt,
          endedAt: state.deps.nowMs(),
        };
      } catch (err) {
        const errorText = normalizeCronRunErrorText(err);
        state.deps.log.warn(
          {
            jobId: id,
            jobName: executionJob.name,
            timeoutMs: jobTimeoutMs ?? null,
          },
          `cron: job failed: ${errorText}`,
        );
        return {
          jobId: id,
          job: executionJob,
          taskRunId,
          activeJobMarker,
          status: "error",
          error: errorText,
          diagnostics: createCronRunDiagnosticsFromError("cron-setup", errorText, {
            nowMs: state.deps.nowMs,
          }),
          startedAt,
          endedAt: state.deps.nowMs(),
        };
      }
    };
    const finalizeCompletedResults = async (completedResults, opts) => {
      if (completedResults.length === 0) return [];
      let finalizedResults = [];
      let finalizationSucceeded = false;
      try {
        const currentResults = filterCurrentCronRunOutcomes(completedResults);
        if (currentResults.length === 0) {
          finishRetiredCronTaskRuns(state, completedResults, currentResults);
          return [];
        }
        await locked(state, async () => {
          await ensureLoaded(state, {
            forceReload: true,
            skipRecompute: true,
          });
          finalizedResults = filterCurrentCronRunOutcomes(currentResults);
          finishRetiredCronTaskRuns(state, completedResults, finalizedResults);
          const rollbackSnapshot = snapshotStoreForRollback(state);
          const removedJobs = [];
          for (const result of finalizedResults) {
            const removedJob = applyOutcomeToStoredJob(state, result);
            if (removedJob) removedJobs.push(removedJob);
          }
          if (finalizedResults.length === 0) return;
          recomputeNextRunsForMaintenance(state);
          await persistOrRestore(state, rollbackSnapshot);
          finishPersistedQuietCronTaskRuns(state, finalizedResults);
          for (const removedJob of removedJobs)
            emit(state, {
              jobId: removedJob.id,
              action: "removed",
              job: removedJob,
            });
        });
        finalizationSucceeded = finalizedResults.length > 0;
        return finalizedResults;
      } finally {
        if (opts?.clearOnFailure !== false || finalizationSucceeded)
          clearActiveMarkersForOutcomes(completedResults);
      }
    };
    const concurrency = Math.min(resolveRunConcurrency(state), Math.max(1, dueJobs.length));
    const claimedIndexes = /* @__PURE__ */ new Set();
    let reservationReleaseError;
    let setupTimeoutNotified = false;
    let stopAdmittingDueJobs = false;
    const hasSetupTimeoutRecoveryHandler = state.deps.onIsolatedAgentSetupTimeout !== void 0;
    const releaseUnclaimedDueJobReservations = async () => {
      if (claimedIndexes.size >= dueJobs.length) return;
      await locked(state, async () => {
        await ensureLoaded(state, {
          forceReload: true,
          skipRecompute: true,
        });
        for (const [index, due] of dueJobs.entries()) {
          if (claimedIndexes.has(index)) continue;
          const job = state.store?.jobs.find((entry) => entry.id === due.id);
          if (job?.state && job.state.runningAtMs === due.reservedAtMs)
            delete job.state.runningAtMs;
        }
        recomputeNextRunsForMaintenance(state);
        await persist(state);
      });
    };
    if (state.stopped) {
      await releaseUnclaimedDueJobReservations();
      return;
    }
    const completedResults = await pMap(
      dueJobs,
      async (due, index) => {
        if (stopAdmittingDueJobs || state.stopped || state.restartRecoveryPending) {
          stopAdmittingDueJobs = true;
          return pMapSkip;
        }
        claimedIndexes.add(index);
        const result = await runDueJob(due);
        if (result.isolatedAgentSetupTimeout) {
          let finalizedResults;
          try {
            finalizedResults = await finalizeCompletedResults([result], { clearOnFailure: false });
          } catch {
            return result;
          }
          if (!hasSetupTimeoutRecoveryHandler || finalizedResults.length === 0) return pMapSkip;
          if (!setupTimeoutNotified) {
            setupTimeoutNotified = true;
            stopAdmittingDueJobs = true;
            try {
              await releaseUnclaimedDueJobReservations();
            } catch (err) {
              reservationReleaseError = err;
            }
            maybeNotifyIsolatedAgentSetupTimeout(state, result);
          }
          return pMapSkip;
        }
        return result;
      },
      {
        concurrency,
        stopOnError: true,
      },
    );
    if (reservationReleaseError)
      throw reservationReleaseError instanceof Error
        ? reservationReleaseError
        : new Error(formatErrorMessage(reservationReleaseError));
    if (stopAdmittingDueJobs) await releaseUnclaimedDueJobReservations();
    if (completedResults.length > 0) {
      const finalizedResults = await finalizeCompletedResults(completedResults);
      for (const result of finalizedResults)
        if (
          !setupTimeoutNotified &&
          result.isolatedAgentSetupTimeout &&
          maybeNotifyIsolatedAgentSetupTimeout(state, result)
        ) {
          setupTimeoutNotified = true;
          break;
        }
    }
  } finally {
    const storePaths = /* @__PURE__ */ new Set();
    if (state.deps.resolveSessionStorePath) {
      const defaultAgentId = state.deps.defaultAgentId ?? "main";
      if (state.store?.jobs?.length)
        for (const job of state.store.jobs) {
          const agentId =
            typeof job.agentId === "string" && job.agentId.trim() ? job.agentId : defaultAgentId;
          storePaths.add(state.deps.resolveSessionStorePath(agentId));
        }
      else storePaths.add(state.deps.resolveSessionStorePath(defaultAgentId));
    } else if (state.deps.sessionStorePath) storePaths.add(state.deps.sessionStorePath);
    if (storePaths.size > 0) {
      const nowMs = state.deps.nowMs();
      for (const storePath of storePaths)
        try {
          await sweepCronRunSessions({
            cronConfig: state.deps.cronConfig,
            sessionStorePath: storePath,
            nowMs,
            log: state.deps.log,
          });
        } catch (err) {
          state.deps.log.warn(
            {
              err: String(err),
              storePath,
            },
            "cron: session reaper sweep failed",
          );
        }
    }
    state.running = false;
    armTimer(state);
  }
}
function isRunnableJob(params) {
  const { job, nowMs } = params;
  if (!job.state) job.state = {};
  if (!isJobEnabled(job)) return false;
  if (params.skipJobIds?.has(job.id)) return false;
  if (typeof job.state.runningAtMs === "number") return false;
  const lastRunStatus = resolveJobLastRunStatus$1(job);
  if (params.skipAtIfAlreadyRan && job.schedule.kind === "at" && lastRunStatus) {
    const lastRun = job.state.lastRunAtMs;
    const nextRun = job.state.nextRunAtMs;
    if (isScheduledTerminalOneShotRetry(job, lastRunStatus, lastRun, nextRun))
      return typeof nextRun === "number" && nowMs >= nextRun;
    return false;
  }
  const next = job.state.nextRunAtMs;
  if (isErrorBackoffPending(params.state, job, nowMs)) return false;
  if (hasScheduledNextRunAtMs(next) && nowMs >= next) return true;
  if (!params.allowCronMissedRunByLastRun || job.schedule.kind !== "cron") return false;
  let previousRunAtMs;
  try {
    previousRunAtMs = computeJobPreviousRunAtMs(job, nowMs);
  } catch {
    return false;
  }
  if (typeof previousRunAtMs !== "number" || !Number.isFinite(previousRunAtMs)) return false;
  const lastRunAtMs = job.state.lastRunAtMs;
  if (typeof lastRunAtMs !== "number" || !Number.isFinite(lastRunAtMs)) return false;
  return previousRunAtMs > lastRunAtMs;
}
function isErrorBackoffPending(state, job, nowMs) {
  if (job.schedule.kind === "at" || resolveJobLastRunStatus$1(job) !== "error") return false;
  const backoffUntilMs = resolveJobErrorBackoffUntilMs(
    job,
    state.deps.cronConfig?.retry?.backoffMs ?? DEFAULT_ERROR_BACKOFF_SCHEDULE_MS,
  );
  return backoffUntilMs !== void 0 && nowMs < backoffUntilMs;
}
function collectRunnableJobs(state, nowMs, opts) {
  if (!state.store) return [];
  return state.store.jobs.filter((job) =>
    isRunnableJob({
      state,
      job,
      nowMs,
      skipJobIds: opts?.skipJobIds,
      skipAtIfAlreadyRan: opts?.skipAtIfAlreadyRan,
      allowCronMissedRunByLastRun: opts?.allowCronMissedRunByLastRun,
    }),
  );
}
function deferPendingBackoffMissedCronSlots(state, nowMs, opts) {
  if (!state.store) return false;
  let changed = false;
  for (const job of state.store.jobs) {
    if (
      !isJobEnabled(job) ||
      job.schedule.kind !== "cron" ||
      opts?.skipJobIds?.has(job.id) ||
      typeof job.state.runningAtMs === "number"
    )
      continue;
    const backoffUntilMs = resolveJobErrorBackoffUntilMs(
      job,
      state.deps.cronConfig?.retry?.backoffMs ?? DEFAULT_ERROR_BACKOFF_SCHEDULE_MS,
    );
    if (backoffUntilMs === void 0 || nowMs >= backoffUntilMs) continue;
    let previousRunAtMs;
    try {
      previousRunAtMs = computeJobPreviousRunAtMs(job, nowMs);
    } catch {
      continue;
    }
    const lastRunAtMs = job.state.lastRunAtMs;
    if (
      typeof previousRunAtMs !== "number" ||
      !Number.isFinite(previousRunAtMs) ||
      typeof lastRunAtMs !== "number" ||
      !Number.isFinite(lastRunAtMs) ||
      previousRunAtMs <= lastRunAtMs
    )
      continue;
    if (job.state.nextRunAtMs !== backoffUntilMs) {
      job.state.nextRunAtMs = backoffUntilMs;
      changed = true;
    }
  }
  return changed;
}
/** Runs or defers missed startup jobs using restart catch-up limits. */
async function runMissedJobs(state, opts) {
  if (state.stopped) return;
  const plan = await planStartupCatchup(state, opts);
  if (plan.candidates.length === 0 && plan.deferredJobs.length === 0) return;
  const finalizedOutcomes = await applyStartupCatchupOutcomes(
    state,
    plan,
    await executeStartupCatchupPlan(state, plan),
  );
  for (const outcome of finalizedOutcomes) maybeNotifyIsolatedAgentSetupTimeout(state, outcome);
}
async function planStartupCatchup(state, opts) {
  const maxImmediate = Math.max(
    0,
    state.deps.maxMissedJobsPerRestart ?? DEFAULT_MAX_MISSED_JOBS_PER_RESTART,
  );
  return locked(state, async () => {
    await ensureLoaded(state, { skipRecompute: true });
    if (state.stopped || !state.store)
      return {
        candidates: [],
        deferredJobs: [],
      };
    const now = state.deps.nowMs();
    const deferredBackoffMissedSlot = deferPendingBackoffMissedCronSlots(state, now, {
      skipJobIds: opts?.skipJobIds,
    });
    const missed = collectRunnableJobs(state, now, {
      skipJobIds: opts?.skipJobIds,
      skipAtIfAlreadyRan: true,
      allowCronMissedRunByLastRun: true,
    });
    if (missed.length === 0) {
      if (deferredBackoffMissedSlot) await persist(state);
      return {
        candidates: [],
        deferredJobs: [],
      };
    }
    const sorted = missed.toSorted(
      (a, b) => (a.state.nextRunAtMs ?? 0) - (b.state.nextRunAtMs ?? 0),
    );
    const deferredAgentJobs = opts?.deferAgentTurnJobs
      ? sorted.filter((job) => job.payload.kind === "agentTurn")
      : [];
    const startupEligible = opts?.deferAgentTurnJobs
      ? sorted.filter((job) => job.payload.kind !== "agentTurn")
      : sorted;
    const startupCandidates = startupEligible.slice(0, maxImmediate);
    const deferredOverflow = startupEligible.slice(maxImmediate);
    const deferredAgentDelayMs = Math.max(
      0,
      state.deps.startupDeferredMissedAgentJobDelayMs ??
        DEFAULT_STARTUP_DEFERRED_MISSED_AGENT_JOB_DELAY_MS,
    );
    const deferred = [
      ...deferredOverflow.map((job) => ({ jobId: job.id })),
      ...deferredAgentJobs.map((job) => ({
        jobId: job.id,
        delayMs: deferredAgentDelayMs,
      })),
    ];
    if (deferred.length > 0)
      state.deps.log.info(
        {
          immediateCount: startupCandidates.length,
          deferredCount: deferred.length,
          totalMissed: missed.length,
        },
        "cron: staggering missed jobs to prevent gateway overload",
      );
    if (deferredAgentJobs.length > 0)
      state.deps.log.info(
        {
          count: deferredAgentJobs.length,
          jobIds: deferredAgentJobs.map((job) => job.id),
          delayMs: deferredAgentDelayMs,
        },
        "cron: deferring missed agent jobs until after gateway startup",
      );
    if (startupCandidates.length > 0)
      state.deps.log.info(
        {
          count: startupCandidates.length,
          jobIds: startupCandidates.map((j) => j.id),
        },
        "cron: running missed jobs after restart",
      );
    for (const job of startupCandidates) {
      job.state.runningAtMs = now;
      job.state.lastError = void 0;
    }
    await persist(state);
    return {
      candidates: startupCandidates.map((job) => ({
        jobId: job.id,
        job,
        reservedAtMs: now,
      })),
      deferredJobs: deferred,
    };
  });
}
async function executeStartupCatchupPlan(state, plan) {
  const outcomes = [];
  for (const candidate of plan.candidates) {
    if (state.stopped) break;
    outcomes.push(await runStartupCatchupCandidate(state, candidate));
  }
  return outcomes;
}
async function runStartupCatchupCandidate(state, candidate) {
  const startedAt = state.deps.nowMs();
  const executionJob = structuredClone(candidate.job);
  executionJob.state.runningAtMs = startedAt;
  const taskRunId = tryCreateCronTaskRun({
    state,
    job: executionJob,
    startedAt,
    runIdStartedAt: candidate.reservedAtMs,
  });
  const activeJobMarker = markCronJobActive(executionJob.id, {
    preserveAcrossGenerationAdvance: executionJob.sessionTarget === "main",
  });
  emit(state, {
    jobId: executionJob.id,
    action: "started",
    job: executionJob,
    runAtMs: startedAt,
  });
  try {
    const result = await executeJobCoreWithTimeout(state, executionJob, {
      runId: taskRunId,
      activeJobMarker,
    });
    return {
      jobId: candidate.jobId,
      job: executionJob,
      taskRunId,
      activeJobMarker,
      status: result.status,
      error: result.error,
      summary: result.summary,
      diagnostics: result.diagnostics,
      delivered: result.delivered,
      deliveryError: result.deliveryError,
      sessionId: result.sessionId,
      sessionKey: result.sessionKey,
      model: result.model,
      provider: result.provider,
      usage: result.usage,
      isolatedAgentSetupTimeout: result.isolatedAgentSetupTimeout,
      triggerEval: result.triggerEval,
      startedAt,
      endedAt: state.deps.nowMs(),
    };
  } catch (err) {
    return {
      jobId: candidate.jobId,
      job: executionJob,
      taskRunId,
      activeJobMarker,
      status: "error",
      error: normalizeCronRunErrorText(err),
      diagnostics: createCronRunDiagnosticsFromError("cron-setup", normalizeCronRunErrorText(err), {
        nowMs: state.deps.nowMs,
      }),
      startedAt,
      endedAt: state.deps.nowMs(),
    };
  }
}
async function applyStartupCatchupOutcomes(state, plan, outcomes) {
  const staggerMs = Math.max(0, state.deps.missedJobStaggerMs ?? DEFAULT_MISSED_JOB_STAGGER_MS);
  try {
    const currentOutcomes = filterCurrentCronRunOutcomes(outcomes);
    let finalizedOutcomes = [];
    await locked(state, async () => {
      await ensureLoaded(state, {
        forceReload: state.stopped,
        skipRecompute: true,
      });
      if (!state.store) return;
      if (state.stopped) {
        const rollbackSnapshot = snapshotStoreForRollback(state);
        finishRetiredCronTaskRuns(state, outcomes, []);
        if (releaseUnstartedStartupCatchupReservations(state, plan, outcomes)) {
          recomputeNextRunsForMaintenance(state, { repairFutureCronNextRunAtMs: false });
          await persistOrRestore(state, rollbackSnapshot);
        }
        return;
      }
      finalizedOutcomes = filterCurrentCronRunOutcomes(currentOutcomes);
      finishRetiredCronTaskRuns(state, outcomes, finalizedOutcomes);
      const rollbackSnapshot = snapshotStoreForRollback(state);
      const releasedReservations = releaseUnstartedStartupCatchupReservations(
        state,
        plan,
        outcomes,
      );
      const removedJobs = [];
      for (const result of finalizedOutcomes) {
        const removedJob = applyOutcomeToStoredJob(state, result);
        if (removedJob) removedJobs.push(removedJob);
      }
      if (finalizedOutcomes.length === 0 && plan.deferredJobs.length === 0) {
        if (releasedReservations) {
          recomputeNextRunsForMaintenance(state, { repairFutureCronNextRunAtMs: false });
          await persistOrRestore(state, rollbackSnapshot);
        }
        return;
      }
      if (plan.deferredJobs.length > 0) {
        const baseNow = state.deps.nowMs();
        let offset = staggerMs;
        for (const deferred of plan.deferredJobs) {
          const jobId = deferred.jobId;
          const job = state.store.jobs.find((entry) => entry.id === jobId);
          if (!job || !isJobEnabled(job)) continue;
          if (typeof deferred.delayMs === "number") {
            job.state.nextRunAtMs = baseNow + deferred.delayMs + offset - staggerMs;
            state.pendingCatchupDeferralJobIds.add(jobId);
            offset += staggerMs;
            continue;
          }
          job.state.nextRunAtMs = baseNow + offset;
          state.pendingCatchupDeferralJobIds.add(jobId);
          offset += staggerMs;
        }
      }
      recomputeNextRunsForMaintenance(state, { repairFutureCronNextRunAtMs: false });
      await persistOrRestore(state, rollbackSnapshot);
      finishPersistedQuietCronTaskRuns(state, finalizedOutcomes);
      for (const removedJob of removedJobs)
        emit(state, {
          jobId: removedJob.id,
          action: "removed",
          job: removedJob,
        });
    });
    return finalizedOutcomes;
  } finally {
    clearActiveMarkersForOutcomes(outcomes);
  }
}
/** Executes a cron job without mutating persisted job state. */
async function executeJobCore(state, job, abortSignal, options) {
  const resolveAbortError = () => ({
    status: "error",
    error: abortErrorMessage(abortSignal),
  });
  const waitWithAbort = async (ms) => {
    if (!abortSignal) {
      await new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
      return;
    }
    if (abortSignal.aborted) return;
    await new Promise((resolve) => {
      const timer = setTimeout(() => {
        abortSignal.removeEventListener("abort", onAbort);
        resolve();
      }, ms);
      const onAbort = () => {
        clearTimeout(timer);
        abortSignal.removeEventListener("abort", onAbort);
        resolve();
      };
      abortSignal.addEventListener("abort", onAbort, { once: true });
    });
  };
  if (abortSignal?.aborted) return resolveAbortError();
  let effectiveJob = job;
  let triggerEval;
  if (job.trigger) {
    const evaluator = state.deps.evaluateCronTrigger;
    if (!evaluator)
      return {
        status: "error",
        error: "cron trigger evaluator is unavailable",
      };
    const evaluation = await evaluator({
      job,
      script: job.trigger.script,
      state: job.state.triggerState,
      abortSignal,
    });
    if (evaluation.kind === "busy") {
      state.deps.log.debug({ jobId: job.id }, "cron: trigger evaluation skipped while busy");
      return {
        status: "ok",
        triggerEval: {
          fired: false,
          stateChanged: false,
          busy: true,
        },
      };
    }
    if (evaluation.kind === "error")
      return {
        status: "error",
        error: `cron trigger evaluation failed (${evaluation.code}): ${evaluation.error}`,
        triggerEval: {
          fired: false,
          stateChanged: false,
        },
      };
    const stateChanged = Object.hasOwn(evaluation, "state");
    triggerEval = {
      fired: evaluation.fire,
      stateChanged,
      ...(stateChanged ? { state: evaluation.state } : {}),
    };
    if (!evaluation.fire)
      return {
        status: "ok",
        triggerEval,
      };
    if (evaluation.message !== void 0) {
      const payload =
        job.payload.kind === "systemEvent"
          ? {
              ...job.payload,
              text: `${job.payload.text}\n\n${evaluation.message}`,
            }
          : job.payload.kind === "agentTurn"
            ? {
                ...job.payload,
                message: `${job.payload.message}\n\n${evaluation.message}`,
              }
            : job.payload;
      effectiveJob = {
        ...job,
        payload,
      };
    }
  }
  if (effectiveJob.sessionTarget === "main") {
    const result = await executeMainSessionCronJob(state, effectiveJob, abortSignal, waitWithAbort);
    return triggerEval
      ? {
          ...result,
          triggerEval,
        }
      : result;
  }
  const result = await executeDetachedCronJob(
    state,
    effectiveJob,
    abortSignal,
    resolveAbortError,
    options,
  );
  return triggerEval
    ? {
        ...result,
        triggerEval,
      }
    : result;
}
async function executeMainSessionCronJob(state, job, abortSignal, waitWithAbort) {
  const text = resolveJobPayloadTextForMain(job);
  if (!text)
    return {
      status: "skipped",
      error:
        job.payload.kind === "systemEvent"
          ? "main job requires non-empty systemEvent text"
          : 'main job requires payload.kind="systemEvent"',
    };
  const cronRunSessionKey = resolveMainSessionCronRunSessionKey(
    job,
    typeof job.state.runningAtMs === "number" ? job.state.runningAtMs : state.deps.nowMs(),
  );
  const deliveryContext = resolveMainSessionCronDeliveryContext(state, job);
  const queuedSystemEvent = normalizeQueuedSystemEventHandle(
    state.deps.enqueueSystemEvent(text, {
      agentId: job.agentId,
      sessionKey: cronRunSessionKey,
      contextKey: `cron:${job.id}`,
      ...(deliveryContext ? { deliveryContext } : {}),
    }),
  );
  if (job.wakeMode === "now" && state.deps.runHeartbeatOnce) {
    const reason = `cron:${job.id}`;
    const maxWaitMs = state.deps.wakeNowHeartbeatBusyMaxWaitMs ?? 2 * 6e4;
    const retryDelayMs = state.deps.wakeNowHeartbeatBusyRetryDelayMs ?? 250;
    const waitStartedAt = state.deps.nowMs();
    let heartbeatResult;
    for (;;) {
      if (abortSignal?.aborted) {
        removeQueuedSystemEventHandle(state, job, queuedSystemEvent);
        return {
          status: "error",
          error: timeoutErrorMessage(),
        };
      }
      heartbeatResult = await state.deps.runHeartbeatOnce({
        source: "cron",
        intent: "immediate",
        reason,
        agentId: job.agentId,
        sessionKey: cronRunSessionKey,
        heartbeat: { target: "last" },
      });
      if (abortSignal?.aborted) {
        removeQueuedSystemEventHandle(state, job, queuedSystemEvent);
        return {
          status: "error",
          error: timeoutErrorMessage(),
        };
      }
      if (
        heartbeatResult.status !== "skipped" ||
        !isRetryableHeartbeatBusySkipReason(heartbeatResult.reason)
      )
        break;
      if (heartbeatResult.reason === "cron-in-progress") {
        state.deps.requestHeartbeat({
          source: "cron",
          intent: "immediate",
          reason,
          agentId: job.agentId,
          sessionKey: cronRunSessionKey,
          heartbeat: { target: "last" },
        });
        return {
          status: "ok",
          summary: text,
          sessionKey: cronRunSessionKey,
        };
      }
      if (abortSignal?.aborted) {
        removeQueuedSystemEventHandle(state, job, queuedSystemEvent);
        return {
          status: "error",
          error: timeoutErrorMessage(),
        };
      }
      if (state.deps.nowMs() - waitStartedAt > maxWaitMs) {
        if (abortSignal?.aborted) {
          removeQueuedSystemEventHandle(state, job, queuedSystemEvent);
          return {
            status: "error",
            error: timeoutErrorMessage(),
          };
        }
        state.deps.requestHeartbeat({
          source: "cron",
          intent: "immediate",
          reason,
          agentId: job.agentId,
          sessionKey: cronRunSessionKey,
          heartbeat: { target: "last" },
        });
        return {
          status: "ok",
          summary: text,
          sessionKey: cronRunSessionKey,
        };
      }
      await waitWithAbort(retryDelayMs);
    }
    if (heartbeatResult.status === "ran")
      return {
        status: "ok",
        summary: text,
        sessionKey: cronRunSessionKey,
      };
    if (heartbeatResult.status === "skipped") {
      removeQueuedSystemEventHandle(state, job, queuedSystemEvent);
      return {
        status: "skipped",
        error: heartbeatResult.reason,
        summary: text,
        sessionKey: cronRunSessionKey,
      };
    }
    removeQueuedSystemEventHandle(state, job, queuedSystemEvent);
    return {
      status: "error",
      error: heartbeatResult.reason,
      summary: text,
      sessionKey: cronRunSessionKey,
    };
  }
  if (abortSignal?.aborted) {
    removeQueuedSystemEventHandle(state, job, queuedSystemEvent);
    return {
      status: "error",
      error: timeoutErrorMessage(),
    };
  }
  state.deps.requestHeartbeat({
    source: "cron",
    intent: job.wakeMode === "now" ? "immediate" : "event",
    reason: `cron:${job.id}`,
    agentId: job.agentId,
    sessionKey: cronRunSessionKey,
    heartbeat: { target: "last" },
  });
  return {
    status: "ok",
    summary: text,
    sessionKey: cronRunSessionKey,
  };
}
async function executeDetachedCronJob(state, job, abortSignal, resolveAbortError, options) {
  if (job.payload.kind === "command") {
    if (!state.deps.runCommandJob) {
      const error = "cron command runner is not configured";
      return {
        status: "skipped",
        error,
        diagnostics: createCronRunDiagnosticsFromError("cron-preflight", error, {
          severity: "warn",
          nowMs: state.deps.nowMs,
        }),
      };
    }
    const res = await state.deps.runCommandJob({
      job,
      abortSignal,
    });
    if (abortSignal?.aborted) {
      const error = abortErrorMessage(abortSignal);
      return {
        status: "error",
        error,
        diagnostics: createCronRunDiagnosticsFromError("cron-setup", error, {
          nowMs: state.deps.nowMs,
        }),
      };
    }
    return {
      status: res.status,
      error: res.error,
      deliveryError: res.deliveryError,
      summary: res.summary,
      delivered: res.delivered,
      deliveryAttempted: res.deliveryAttempted,
      delivery: res.delivery,
      diagnostics: res.diagnostics,
    };
  }
  if (job.payload.kind !== "agentTurn") {
    const error = 'isolated job requires payload.kind="agentTurn" or "command"';
    return {
      status: "skipped",
      error,
      diagnostics: createCronRunDiagnosticsFromError("cron-preflight", error, {
        severity: "warn",
        nowMs: state.deps.nowMs,
      }),
    };
  }
  if (abortSignal?.aborted) {
    const aborted = resolveAbortError();
    return {
      ...aborted,
      diagnostics: createCronRunDiagnosticsFromError("cron-setup", aborted.error, {
        nowMs: state.deps.nowMs,
      }),
    };
  }
  const res = await state.deps.runIsolatedAgentJob({
    job,
    message: job.payload.message,
    abortSignal,
    onExecutionStarted: options?.onExecutionStarted,
    onExecutionPhase: options?.onExecutionPhase,
    onLaneWait: options?.onLaneWait,
  });
  if (abortSignal?.aborted) {
    const error = abortErrorMessage(abortSignal);
    return {
      status: "error",
      error,
      diagnostics: createCronRunDiagnosticsFromError("cron-setup", error, {
        nowMs: state.deps.nowMs,
      }),
    };
  }
  return {
    status: res.status,
    error: res.error,
    deliveryError: res.deliveryError,
    summary: res.summary,
    delivered: res.delivered,
    deliveryAttempted: res.deliveryAttempted,
    delivery: res.delivery,
    sessionId: res.sessionId,
    sessionKey: res.sessionKey,
    diagnostics: res.diagnostics,
    model: res.model,
    provider: res.provider,
    usage: res.usage,
  };
}
function emitJobFinished(state, job, result, runAtMs) {
  const event = {
    jobId: job.id,
    action: "finished",
    job,
    status: result.status,
    error: result.error,
    summary: result.summary,
    diagnostics: result.diagnostics,
    delivered: job.state.lastDelivered,
    deliveryStatus: job.state.lastDeliveryStatus,
    deliveryError: job.state.lastDeliveryError,
    failureNotificationDelivery: failureNotificationDeliveryFromJobState(job),
    delivery: result.delivery,
    sessionId: result.sessionId,
    sessionKey: result.sessionKey,
    runAtMs,
    durationMs: job.state.lastDurationMs,
    nextRunAtMs: job.state.nextRunAtMs,
    ...(result.triggerEval?.fired ? { triggerFired: true } : {}),
    model: result.model,
    provider: result.provider,
    usage: result.usage,
  };
  tryFinishCronTaskRun(state, {
    taskRunId: result.taskRunId,
    job,
    event,
    ...(result.triggerEval ? { triggerEval: result.triggerEval } : {}),
  });
  emit(state, event);
}
/** Clears the currently armed cron timer. */
function stopTimer(state) {
  if (state.timer) clearTimeout(state.timer);
  state.timer = null;
}
//#endregion
//#region src/cron/service/startup-run-repair.ts
/** Repairs interrupted and finalized cron runs while the service starts. */
const STARTUP_INTERRUPTED_ERROR = "cron: job interrupted by gateway restart";
function resolveInterruptedStartupFailureNotificationStatus(params) {
  if (params.job.delivery?.bestEffort === true) return "not-requested";
  if (resolveFailureDestination(params.job, params.state.deps.cronConfig?.failureDestination))
    return "unknown";
  const primaryPlan = resolveCronDeliveryPlan(params.job);
  return primaryPlan.mode === "announce" && primaryPlan.requested ? "unknown" : "not-requested";
}
function markInterruptedStartupRun(params) {
  const { job, runningAtMs, nowMs } = params;
  const failureNotificationStatus = resolveInterruptedStartupFailureNotificationStatus({
    state: params.state,
    job,
  });
  const previousErrors =
    typeof job.state.consecutiveErrors === "number" && Number.isFinite(job.state.consecutiveErrors)
      ? Math.max(0, Math.floor(job.state.consecutiveErrors))
      : 0;
  params.state.deps.log.warn(
    {
      jobId: job.id,
      runningAtMs,
    },
    "cron: marking interrupted running job failed on startup",
  );
  job.state.runningAtMs = void 0;
  job.state.lastRunAtMs = runningAtMs;
  job.state.lastRunStatus = "error";
  job.state.lastStatus = "error";
  job.state.lastError = STARTUP_INTERRUPTED_ERROR;
  job.state.lastDurationMs = Math.max(0, nowMs - runningAtMs);
  job.state.consecutiveErrors = previousErrors + 1;
  job.state.lastDelivered = false;
  job.state.lastDeliveryStatus = "unknown";
  job.state.lastDeliveryError = STARTUP_INTERRUPTED_ERROR;
  job.state.lastFailureNotificationDelivered = void 0;
  job.state.lastFailureNotificationDeliveryStatus = failureNotificationStatus;
  job.state.lastFailureNotificationDeliveryError = void 0;
  job.state.nextRunAtMs = void 0;
  job.updatedAtMs = nowMs;
  if (job.schedule.kind === "at") job.enabled = false;
  return {
    jobId: job.id,
    ...(params.taskRunId ? { taskRunId: params.taskRunId } : {}),
    runAtMs: runningAtMs,
    durationMs: job.state.lastDurationMs,
  };
}
function restoreFinalizedStartupRun(params) {
  const { state, job, runningAtMs, entry } = params;
  const startedAt = entry.runAtMs ?? runningAtMs;
  const shouldDelete = applyJobResult(
    state,
    job,
    {
      status: entry.status,
      error: entry.error,
      deliveryError: entry.deliveryError,
      diagnostics: entry.diagnostics,
      delivered: entry.delivered,
      provider: entry.provider,
      startedAt,
      endedAt: entry.ts,
    },
    { replayFailureAlertAtMs: entry.ts },
  );
  job.state.lastDurationMs = entry.durationMs ?? Math.max(0, entry.ts - startedAt);
  job.state.lastErrorReason = entry.errorReason;
  job.state.lastDelivered = entry.delivered;
  job.state.lastDeliveryStatus = entry.deliveryStatus;
  job.state.lastDeliveryError = entry.deliveryError;
  job.state.lastFailureNotificationDelivered = entry.failureNotificationDelivery?.delivered;
  job.state.lastFailureNotificationDeliveryStatus = entry.failureNotificationDelivery?.status;
  job.state.lastFailureNotificationDeliveryError = entry.failureNotificationDelivery?.error;
  job.state.nextRunAtMs = entry.nextRunAtMs;
  if (params.triggerEval)
    applyTriggerRunResult(job, {
      status: entry.status,
      endedAt: entry.ts,
      triggerEval: params.triggerEval,
    });
  state.deps.log.info(
    {
      jobId: job.id,
      runningAtMs,
      status: entry.status,
    },
    "cron: restored finalized task-ledger run on startup",
  );
  return shouldDelete;
}
function mergeManualRunSnapshotAfterReload(params) {
  if (!params.state.store) return;
  if (params.removed) {
    params.state.store.jobs = params.state.store.jobs.filter((job) => job.id !== params.jobId);
    return;
  }
  if (!params.snapshot) return;
  const reloaded = params.state.store.jobs.find((job) => job.id === params.jobId);
  if (!reloaded) return;
  reloaded.enabled = params.snapshot.enabled;
  reloaded.updatedAtMs = params.snapshot.updatedAtMs;
  reloaded.state = params.snapshot.state;
}
//#endregion
//#region src/cron/service/wake.ts
/** Manual cron wake helper for queueing system events into sessions. */
/** Enqueues a manual cron wake event and optionally pokes the targeted heartbeat loop. */
function wake(state, opts) {
  const text = opts.text.trim();
  if (!text) return { ok: false };
  const sessionKey = opts.sessionKey?.trim() || void 0;
  const agentId = opts.agentId?.trim() || void 0;
  if (sessionKey && isSubagentSessionKey(sessionKey))
    return {
      ok: false,
      reason: "unwakeable-session-key",
    };
  const originDeliveryContext =
    sessionKey || agentId
      ? state.deps.resolveOriginDeliveryContext?.({
          sessionKey,
          agentId,
        })
      : void 0;
  const enqueueOpts =
    sessionKey || agentId
      ? {
          ...(sessionKey ? { sessionKey } : {}),
          ...(agentId ? { agentId } : {}),
          ...(originDeliveryContext ? { deliveryContext: originDeliveryContext } : {}),
        }
      : void 0;
  state.deps.enqueueSystemEvent(text, enqueueOpts);
  if (opts.mode === "now")
    state.deps.requestHeartbeat({
      source: "manual",
      intent: "immediate",
      reason: "wake",
      ...(sessionKey ? { sessionKey } : {}),
      ...(agentId ? { agentId } : {}),
    });
  else if (sessionKey)
    state.deps.requestHeartbeat({
      source: "manual",
      intent: "immediate",
      reason: "wake",
      sessionKey,
      ...(agentId ? { agentId } : {}),
    });
  return { ok: true };
}
//#endregion
//#region src/cron/service/ops.ts
/** Public cron service operations for lifecycle, CRUD, listing, and manual runs. */
function markManualCronJobActive(state, job) {
  const jobId = job.id;
  state.activeManualRunJobIds.add(jobId);
  return markCronJobActive(jobId, {
    preserveAcrossGenerationAdvance: job.sessionTarget === "main",
  });
}
function clearManualCronJobActive(state, jobId, activeJobMarker) {
  state.activeManualRunJobIds.delete(jobId);
  clearCronJobActive(jobId, activeJobMarker);
  if (state.activeManualRunJobIds.size === 0) state.manualSetupTimeoutNotified = false;
}
function maybeNotifyManualIsolatedSetupTimeout(state, result) {
  if (!result.isolatedAgentSetupTimeout || state.manualSetupTimeoutNotified) return false;
  const notified = maybeNotifyIsolatedAgentSetupTimeout(state, result);
  state.manualSetupTimeoutNotified ||= notified;
  return notified;
}
async function ensureLoadedForRead(state) {
  await ensureLoaded(state, { skipRecompute: true });
  if (!state.store) return;
  if (recomputeNextRunsForMaintenance(state)) await persist(state);
}
/** Starts the cron service, recovers interrupted runs, catches up missed jobs, and arms the timer. */
async function start(state) {
  state.stopped = false;
  if (!state.deps.cronEnabled) {
    state.deps.log.info({ enabled: false }, "cron: disabled");
    return;
  }
  const interruptedJobIds = /* @__PURE__ */ new Set();
  const interruptedRuns = [];
  const completedJobIdsToDelete = /* @__PURE__ */ new Set();
  let repairedAnyStartupRun = false;
  await locked(state, async () => {
    await ensureLoaded(state, { skipRecompute: true });
    if (state.stopped) return;
    const jobs = state.store?.jobs ?? [];
    for (const job of jobs) {
      job.state ??= {};
      if (typeof job.state.runningAtMs === "number") {
        const runningAtMs = job.state.runningAtMs;
        const taskRunId = tryFindCronTaskRunIdForRecovery(state, job.id, runningAtMs);
        const finalized = tryFindFinalizedCronTaskRun(state, job.id, runningAtMs);
        if (finalized) {
          interruptedJobIds.add(job.id);
          if (
            restoreFinalizedStartupRun({
              state,
              job,
              runningAtMs,
              entry: finalized.entry,
              ...(finalized.triggerEval ? { triggerEval: finalized.triggerEval } : {}),
            })
          )
            completedJobIdsToDelete.add(job.id);
          repairedAnyStartupRun = true;
          continue;
        }
        const interrupted = markInterruptedStartupRun({
          state,
          job,
          taskRunId,
          runningAtMs,
          nowMs: state.deps.nowMs(),
        });
        interruptedJobIds.add(job.id);
        interruptedRuns.push(interrupted);
        repairedAnyStartupRun = true;
      }
    }
    if (completedJobIdsToDelete.size > 0 && state.store)
      state.store.jobs = jobs.filter((job) => !completedJobIdsToDelete.has(job.id));
    if (repairedAnyStartupRun || jobs.length > 0)
      await persist(state, repairedAnyStartupRun ? void 0 : { stateOnly: true });
  });
  if (state.stopped) return;
  await runMissedJobs(state, {
    skipJobIds: interruptedJobIds.size > 0 ? interruptedJobIds : void 0,
    deferAgentTurnJobs: true,
  });
  await locked(state, async () => {
    await ensureLoaded(state, { skipRecompute: true });
    if (state.stopped) return;
    if (recomputeNextRunsForMaintenance(state, { recomputeExpired: true })) await persist(state);
    for (const interrupted of interruptedRuns) {
      const job = state.store?.jobs.find((entry) => entry.id === interrupted.jobId);
      emitCronRunFinished(
        state,
        {
          jobId: interrupted.jobId,
          action: "finished",
          job,
          status: "error",
          error: STARTUP_INTERRUPTED_ERROR,
          delivered: false,
          deliveryStatus: "unknown",
          deliveryError: STARTUP_INTERRUPTED_ERROR,
          failureNotificationDelivery: job ? failureNotificationDeliveryFromJobState(job) : void 0,
          runAtMs: interrupted.runAtMs,
          durationMs: interrupted.durationMs,
          nextRunAtMs: job?.state.nextRunAtMs,
        },
        void 0,
        interrupted.taskRunId,
      );
    }
    armTimer(state);
    state.deps.log.info(
      {
        enabled: true,
        jobs: state.store?.jobs.length ?? 0,
        nextWakeAtMs: nextWakeAtMs(state) ?? null,
      },
      "cron: started",
    );
  });
}
/** Stops the cron service timer without mutating persisted job state. */
function stop(state) {
  state.stopped = true;
  state.schedulerStarted = false;
  stopTimer(state);
}
/** Temporarily stops automatic ticks without running startup recovery on resume. */
function pauseScheduling(state) {
  state.schedulingPaused = true;
  stopTimer(state);
}
function resumeScheduling(state) {
  if (!state.schedulingPaused) return;
  state.schedulingPaused = false;
  if (!state.schedulerStarted) return;
  try {
    armTimer(state);
  } catch (err) {
    state.schedulingPaused = true;
    stopTimer(state);
    throw err;
  }
}
/** Returns cron service status after a read-only maintenance pass. */
async function status(state) {
  return await locked(state, async () => {
    await ensureLoadedForRead(state);
    return {
      enabled: state.deps.cronEnabled,
      storePath: state.deps.storePath,
      storage: "sqlite",
      sqlitePath: resolveOpenClawStateSqlitePath(),
      jobs: state.store?.jobs.length ?? 0,
      nextWakeAtMs: state.deps.cronEnabled ? (nextWakeAtMs(state) ?? null) : null,
    };
  });
}
/** Lists cron jobs sorted by next run time, excluding disabled jobs unless requested. */
async function list(state, opts) {
  return await locked(state, async () => {
    await ensureLoadedForRead(state);
    const includeDisabled = opts?.includeDisabled === true;
    return (state.store?.jobs ?? [])
      .filter((j) => includeDisabled || isJobEnabled(j))
      .toSorted((a, b) => (a.state.nextRunAtMs ?? 0) - (b.state.nextRunAtMs ?? 0));
  });
}
/** Reads one cron job by id without advancing due schedules. */
async function readJob(state, id) {
  return await locked(state, async () => {
    await ensureLoadedForRead(state);
    return state.store?.jobs.find((job) => job.id === id);
  });
}
function resolveEnabledFilter(opts) {
  if (opts?.enabled === "all" || opts?.enabled === "enabled" || opts?.enabled === "disabled")
    return opts.enabled;
  return opts?.includeDisabled ? "all" : "enabled";
}
function resolveScheduleKindFilter(opts) {
  if (
    opts?.scheduleKind === "all" ||
    opts?.scheduleKind === "at" ||
    opts?.scheduleKind === "every" ||
    opts?.scheduleKind === "cron" ||
    opts?.scheduleKind === "on-exit"
  )
    return opts.scheduleKind;
  return "all";
}
function resolveLastRunStatusFilter(opts) {
  if (
    opts?.lastRunStatus === "all" ||
    opts?.lastRunStatus === "ok" ||
    opts?.lastRunStatus === "error" ||
    opts?.lastRunStatus === "skipped" ||
    opts?.lastRunStatus === "unknown"
  )
    return opts.lastRunStatus;
  return "all";
}
function resolveJobLastRunStatus(job) {
  return job.state.lastRunStatus ?? job.state.lastStatus ?? "unknown";
}
function resolveEffectiveJobAgentId(job, defaultAgentId) {
  return (
    normalizeOptionalAgentId(job.agentId) ?? normalizeOptionalAgentId(defaultAgentId) ?? "main"
  );
}
/** Lists a filtered, sorted, bounded page of cron jobs for CLI/RPC callers. */
async function listPage(state, opts) {
  return await locked(state, async () => {
    await ensureLoadedForRead(state);
    const query = normalizeLowercaseStringOrEmpty(opts?.query);
    const enabledFilter = resolveEnabledFilter(opts);
    const scheduleKindFilter = resolveScheduleKindFilter(opts);
    const lastRunStatusFilter = resolveLastRunStatusFilter(opts);
    const sortBy = opts?.sortBy ?? "nextRunAtMs";
    const sortDir = opts?.sortDir ?? "asc";
    const requestedAgentId = normalizeOptionalAgentId(opts?.agentId);
    const filtered = (state.store?.jobs ?? []).filter((job) => {
      if (enabledFilter === "enabled" && !isJobEnabled(job)) return false;
      if (enabledFilter === "disabled" && isJobEnabled(job)) return false;
      if (
        requestedAgentId &&
        resolveEffectiveJobAgentId(job, state.deps.defaultAgentId) !== requestedAgentId
      )
        return false;
      if (scheduleKindFilter !== "all" && job.schedule.kind !== scheduleKindFilter) return false;
      if (lastRunStatusFilter !== "all" && resolveJobLastRunStatus(job) !== lastRunStatusFilter)
        return false;
      if (!query) return true;
      return normalizeLowercaseStringOrEmpty(
        [job.id, job.name, job.description ?? "", job.agentId ?? ""].join(" "),
      ).includes(query);
    });
    const snapshot = structuredClone(sortCronJobs(filtered, sortBy, sortDir));
    const snapshotRevision = resolveCronListSnapshotRevision(snapshot);
    const total = snapshot.length;
    const offset = Math.max(0, Math.min(total, Math.floor(opts?.offset ?? 0)));
    const defaultLimit = total === 0 ? 50 : total;
    const limit = Math.max(1, Math.min(200, Math.floor(opts?.limit ?? defaultLimit)));
    const jobs = snapshot.slice(offset, offset + limit);
    const nextOffset = offset + jobs.length;
    return {
      jobs,
      snapshotRevision,
      total,
      offset,
      limit,
      hasMore: nextOffset < total,
      nextOffset: nextOffset < total ? nextOffset : null,
    };
  });
}
function finalizeUpdatedJob(params) {
  const { job, nextJob, now } = params;
  if (nextJob.schedule.kind === "every") {
    const anchor = nextJob.schedule.anchorMs;
    if (typeof anchor !== "number" || !Number.isFinite(anchor)) {
      const fallbackAnchorMs =
        (job.schedule.kind === "every" &&
        job.schedule.everyMs === nextJob.schedule.everyMs &&
        typeof job.schedule.anchorMs === "number" &&
        Number.isFinite(job.schedule.anchorMs)
          ? job.schedule.anchorMs
          : void 0) ??
        (params.scheduleChanged
          ? now
          : typeof nextJob.createdAtMs === "number" && Number.isFinite(nextJob.createdAtMs)
            ? nextJob.createdAtMs
            : now);
      nextJob.schedule = {
        ...nextJob.schedule,
        anchorMs: Math.max(0, Math.floor(fallbackAnchorMs)),
      };
    }
  }
  const schedulingInputsChanged =
    params.schedulingInputsRequested && !cronSchedulingInputsEqual(job, nextJob);
  if (params.scheduleChanged && nextJob.schedule.kind === "cron" && !isJobEnabled(nextJob))
    computeJobNextRunAtMs(
      {
        ...nextJob,
        enabled: true,
      },
      now,
    );
  nextJob.updatedAtMs = now;
  if (schedulingInputsChanged)
    if (isJobEnabled(nextJob)) nextJob.state.nextRunAtMs = computeJobNextRunAtMs(nextJob, now);
    else {
      nextJob.state.nextRunAtMs = void 0;
      nextJob.state.runningAtMs = void 0;
    }
  else if (isJobEnabled(nextJob) && !hasScheduledNextRunAtMs(nextJob.state.nextRunAtMs))
    nextJob.state.nextRunAtMs = computeJobNextRunAtMs(nextJob, now);
}
async function persistUpdatedJob(params) {
  const { state, snapshot, nextJob } = params;
  if (state.store) {
    const index = state.store.jobs.findIndex((entry) => entry.id === nextJob.id);
    if (index >= 0) state.store.jobs[index] = nextJob;
  }
  await persistOrRestore(state, snapshot, { suppressScheduledJobId: nextJob.id });
  armTimer(state);
  emit(state, {
    jobId: nextJob.id,
    action: "updated",
    job: nextJob,
    nextRunAtMs: nextJob.state.nextRunAtMs,
  });
}
function declarativeFields(job, includeEnabled) {
  return {
    schedule: job.schedule,
    trigger: job.trigger,
    payload: job.payload,
    delivery: job.delivery,
    displayName: job.displayName,
    ...(includeEnabled ? { enabled: job.enabled } : {}),
  };
}
/** Adds or converges a declaration-keyed cron job inside one store lock and write transaction. */
async function add(state, input, opts) {
  return await locked(state, async () => {
    warnIfDisabled(state, "add");
    await ensureLoaded(state, { skipRecompute: true });
    const normalizedId = normalizeOptionalString(input.id);
    if (input.id !== void 0 && !normalizedId) throw new Error("cron job id must not be blank");
    if (normalizedId) normalizeCronTaskRunJobId(normalizedId);
    const normalizedInput = normalizedId
      ? {
          ...input,
          id: normalizedId,
        }
      : input;
    const declarationKey = normalizeOptionalString(input.declarationKey);
    const matches = declarationKey
      ? (state.store?.jobs.filter(
          (job) => job.declarationKey === declarationKey && (opts?.matchesExisting?.(job) ?? true),
        ) ?? [])
      : [];
    if (matches.length > 1)
      throw new Error(`cron declarationKey is ambiguous within caller scope: ${declarationKey}`);
    const existing = matches[0];
    if (existing) {
      const now = state.deps.nowMs();
      const nextJob = structuredClone(existing);
      applyDeclarativeJobSpec(nextJob, normalizedInput, {
        defaultAgentId: state.deps.defaultAgentId,
        enabledExplicit: opts?.enabledExplicit === true,
        nowMs: now,
        cronConfig: state.deps.cronConfig,
      });
      const includeEnabled = opts?.enabledExplicit === true;
      if (
        isDeepStrictEqual(
          declarativeFields(existing, includeEnabled),
          declarativeFields(nextJob, includeEnabled),
        )
      )
        return {
          ...existing,
          created: false,
          updated: false,
          job: existing,
        };
      const snapshot = snapshotStoreForRollback(state);
      finalizeUpdatedJob({
        job: existing,
        nextJob,
        now,
        schedulingInputsRequested: true,
        scheduleChanged: !isDeepStrictEqual(existing.schedule, nextJob.schedule),
      });
      await persistUpdatedJob({
        state,
        snapshot,
        nextJob,
      });
      return {
        ...nextJob,
        created: false,
        updated: true,
        job: nextJob,
      };
    }
    if (normalizedId && state.store?.jobs.some((job) => job.id === normalizedId))
      throw new Error(`cron job already exists: ${normalizedId}`);
    const snapshot = snapshotStoreForRollback(state);
    const job = createJob(state, normalizedInput);
    state.store?.jobs.push(job);
    const postPersistAutoDisableNotifications = [];
    recomputeNextRunsForMaintenance(state, {
      deferredAutoDisableNotifications: postPersistAutoDisableNotifications,
    });
    await persistOrRestore(state, snapshot, {
      postPersistAutoDisableNotifications,
      suppressScheduledJobId: job.id,
    });
    armTimer(state);
    state.deps.log.info(
      {
        jobId: job.id,
        jobName: job.name,
        nextRunAtMs: job.state.nextRunAtMs,
        schedulerNextWakeAtMs: nextWakeAtMs(state) ?? null,
        timerArmed: state.timer !== null,
        cronEnabled: state.deps.cronEnabled,
      },
      "cron: job added",
    );
    emit(state, {
      jobId: job.id,
      action: "added",
      job,
      nextRunAtMs: job.state.nextRunAtMs,
    });
    return declarationKey
      ? {
          ...job,
          created: true,
          job,
        }
      : job;
  });
}
async function updateLoadedJob(params) {
  const { state, id, patch, precondition } = params;
  warnIfDisabled(state, "update");
  await ensureLoaded(state, { skipRecompute: true });
  const snapshot = snapshotStoreForRollback(state);
  const job = findJobOrThrow(state, id);
  const now = state.deps.nowMs();
  await precondition?.(structuredClone(job), now);
  const nextJob = structuredClone(job);
  applyJobPatch(nextJob, patch, {
    defaultAgentId: state.deps.defaultAgentId,
    scheduleValidationNowMs: now,
    cronConfig: state.deps.cronConfig,
  });
  finalizeUpdatedJob({
    job,
    nextJob,
    now,
    schedulingInputsRequested:
      patch.schedule !== void 0 || patch.enabled !== void 0 || patch.trigger !== void 0,
    scheduleChanged: patch.schedule !== void 0,
  });
  await persistUpdatedJob({
    state,
    snapshot,
    nextJob,
  });
  return nextJob;
}
/** Updates a cron job patch in-place, recomputes affected schedule state, and persists it. */
async function update(state, id, patch) {
  return await locked(
    state,
    async () =>
      await updateLoadedJob({
        state,
        id,
        patch,
      }),
  );
}
/** Updates a cron job only after a store-locked caller precondition passes. */
async function updateWithPrecondition(state, id, patch, precondition) {
  return await locked(
    state,
    async () =>
      await updateLoadedJob({
        state,
        id,
        patch,
        precondition,
      }),
  );
}
/** Removes a cron job by id and re-arms the timer when the in-memory store changes. */
async function remove(state, id) {
  return await locked(state, async () => {
    warnIfDisabled(state, "remove");
    await ensureLoaded(state, { skipRecompute: true });
    const before = state.store?.jobs.length ?? 0;
    if (!state.store)
      return {
        ok: false,
        removed: false,
      };
    const snapshot = snapshotStoreForRollback(state);
    const removedJob = state.store.jobs.find((j) => j.id === id);
    state.store.jobs = state.store.jobs.filter((j) => j.id !== id);
    const removed = (state.store.jobs.length ?? 0) !== before;
    const postPersistAutoDisableNotifications = [];
    recomputeNextRunsForMaintenance(state, {
      deferredAutoDisableNotifications: postPersistAutoDisableNotifications,
    });
    await persistOrRestore(state, snapshot, {
      postPersistAutoDisableNotifications,
      suppressScheduledJobId: id,
    });
    armTimer(state);
    if (removed)
      emit(state, {
        jobId: id,
        action: "removed",
        job: removedJob,
      });
    return {
      ok: true,
      removed,
    };
  });
}
function emitCronRunFinished(state, evt, tracker, taskRunId, triggerEval) {
  tryFinishCronTaskRun(state, {
    taskRunId,
    job: evt.job,
    event: evt,
    ...(triggerEval ? { triggerEval } : {}),
  });
  emit(state, evt);
  if (tracker) tracker.emitted = true;
}
let nextManualRunId = 1;
async function skipInvalidPersistedManualRun(params) {
  const endedAt = params.state.deps.nowMs();
  const errorText = normalizeCronRunErrorText(params.error);
  const diagnostics = createCronRunDiagnosticsFromError("cron-preflight", errorText, {
    severity: "warn",
    nowMs: params.state.deps.nowMs,
  });
  applyJobResult(
    params.state,
    params.job,
    {
      status: "skipped",
      error: errorText,
      diagnostics,
      startedAt: endedAt,
      endedAt,
    },
    { preserveSchedule: params.mode === "force" },
  );
  emitCronRunFinished(
    params.state,
    {
      jobId: params.job.id,
      action: "finished",
      job: params.job,
      status: "skipped",
      error: errorText,
      diagnostics,
      runId: params.runId,
      runAtMs: endedAt,
      durationMs: params.job.state.lastDurationMs,
      nextRunAtMs: params.job.state.nextRunAtMs,
      deliveryStatus: params.job.state.lastDeliveryStatus,
      deliveryError: params.job.state.lastDeliveryError,
      failureNotificationDelivery: failureNotificationDeliveryFromJobState(params.job),
    },
    params.terminalTracker,
  );
  recomputeNextRunsForMaintenance(params.state, { recomputeExpired: true });
  await persist(params.state);
  armTimer(params.state);
}
async function inspectManualRunPreflight(state, id, mode, runId, terminalTracker) {
  return await locked(state, async () => {
    warnIfDisabled(state, "run");
    await ensureLoaded(state, { skipRecompute: true });
    if (state.stopped)
      return {
        ok: true,
        ran: false,
        reason: "stopped",
      };
    if (state.restartRecoveryPending)
      return {
        ok: true,
        ran: false,
        reason: "restart-recovery-pending",
      };
    recomputeNextRunsForMaintenance(state);
    const job = findJobOrThrow(state, id);
    try {
      assertSupportedJobSpec(job);
    } catch (error) {
      await skipInvalidPersistedManualRun({
        state,
        job,
        mode,
        runId,
        terminalTracker,
        error,
      });
      return {
        ok: true,
        ran: false,
        reason: "invalid-spec",
      };
    }
    if (typeof job.state.runningAtMs === "number")
      return {
        ok: true,
        ran: false,
        reason: "already-running",
      };
    const now = state.deps.nowMs();
    if (!isJobDue(job, now, { forced: mode === "force" }))
      return {
        ok: true,
        ran: false,
        reason: "not-due",
      };
    return {
      ok: true,
      runnable: true,
      job,
      now,
    };
  });
}
async function inspectManualRunDisposition(state, id, mode) {
  const result = await inspectManualRunPreflight(state, id, mode);
  if (!result.ok) return result;
  if ("reason" in result) return result;
  return {
    ok: true,
    runnable: true,
  };
}
async function prepareManualRun(state, id, mode, opts) {
  const preflight = await inspectManualRunPreflight(
    state,
    id,
    mode,
    opts?.runId,
    opts?.terminalTracker,
  );
  if (!preflight.ok) return preflight;
  if ("reason" in preflight)
    return {
      ok: true,
      ran: false,
      reason: preflight.reason,
    };
  return await locked(state, async () => {
    if (state.stopped)
      return {
        ok: true,
        ran: false,
        reason: "stopped",
      };
    const job = findJobOrThrow(state, id);
    if (typeof job.state.runningAtMs === "number")
      return {
        ok: true,
        ran: false,
        reason: "already-running",
      };
    job.state.runningAtMs = preflight.now;
    job.state.lastError = void 0;
    await persist(state);
    if (state.stopped) {
      await ensureLoaded(state, {
        forceReload: true,
        skipRecompute: true,
      });
      const persistedJob = state.store?.jobs.find((entry) => entry.id === id);
      if (persistedJob?.state.runningAtMs === preflight.now) {
        delete persistedJob.state.runningAtMs;
        await persist(state);
      }
      return {
        ok: true,
        ran: false,
        reason: "stopped",
      };
    }
    emit(state, {
      jobId: job.id,
      action: "started",
      job,
      runAtMs: preflight.now,
    });
    const taskRunId = tryCreateCronTaskRun({
      state,
      job,
      startedAt: preflight.now,
      publicRunId: opts?.runId,
    });
    const activeJobMarker = markManualCronJobActive(state, job);
    const executionJob = structuredClone(job);
    if (mode === "force" && executionJob.trigger) delete executionJob.trigger;
    if (opts?.payload) executionJob.payload = structuredClone(opts.payload);
    return {
      ok: true,
      ran: true,
      jobId: job.id,
      runId: opts?.runId ?? taskRunId,
      taskRunId,
      terminalTracker: opts?.terminalTracker,
      activeJobMarker,
      startedAt: preflight.now,
      executionJob,
    };
  });
}
async function finishPreparedManualRun(state, prepared, mode) {
  const executionJob = prepared.executionJob;
  const startedAt = prepared.startedAt;
  const jobId = prepared.jobId;
  const taskRunId = prepared.taskRunId;
  const runId = prepared.runId;
  try {
    let coreResult;
    try {
      coreResult = await executeJobCoreWithTimeout(state, executionJob, {
        runId: taskRunId,
        activeJobMarker: prepared.activeJobMarker,
      });
    } catch (err) {
      coreResult = {
        status: "error",
        error: normalizeCronRunErrorText(err),
      };
    }
    const endedAt = state.deps.nowMs();
    const triggerSkipped = coreResult.status === "ok" && coreResult.triggerEval?.fired === false;
    const emitMissingQueuedTerminal = () => {
      const tracker = prepared.terminalTracker;
      if (!tracker || tracker.emitted) return;
      const job = state.store?.jobs.find((entry) => entry.id === jobId);
      emitCronRunFinished(
        state,
        {
          jobId,
          action: "finished",
          job,
          status: triggerSkipped ? "skipped" : coreResult.status,
          error: triggerSkipped
            ? "queued manual run skipped: trigger condition not met"
            : coreResult.error,
          deliveryError: coreResult.deliveryError,
          summary: triggerSkipped ? void 0 : coreResult.summary,
          diagnostics: coreResult.diagnostics,
          delivered: coreResult.delivered,
          delivery: coreResult.delivery,
          sessionId: coreResult.sessionId,
          sessionKey: coreResult.sessionKey,
          runId,
          runAtMs: startedAt,
          durationMs: Math.max(0, endedAt - startedAt),
          nextRunAtMs: job?.state.nextRunAtMs,
          model: coreResult.model,
          provider: coreResult.provider,
          usage: coreResult.usage,
        },
        tracker,
        taskRunId,
      );
    };
    if (!triggerSkipped)
      tryFinishCronTaskRunWithoutHistory(state, {
        taskRunId,
        status: coreResult.status,
        error: coreResult.error,
        endedAt,
        summary: coreResult.summary,
        childSessionKey: coreResult.sessionKey,
      });
    if (!isCronActiveJobMarkerCurrent(prepared.activeJobMarker)) {
      emitMissingQueuedTerminal();
      return;
    }
    let finalized = false;
    let notifySetupTimeout = coreResult.isolatedAgentSetupTimeout !== void 0;
    await locked(state, async () => {
      await ensureLoaded(state, { skipRecompute: true });
      if (!isCronActiveJobMarkerCurrent(prepared.activeJobMarker)) {
        notifySetupTimeout = false;
        return;
      }
      const job = state.store?.jobs.find((entry) => entry.id === jobId);
      if (!job) return;
      let shouldDelete = false;
      if (coreResult.status === "ok" && coreResult.triggerEval?.fired === false)
        applyTriggerNoFireResult(state, job, {
          startedAt,
          endedAt,
          triggerEval: coreResult.triggerEval,
        });
      else {
        shouldDelete = applyJobResult(
          state,
          job,
          {
            status: coreResult.status,
            error: coreResult.error,
            deliveryError: coreResult.deliveryError,
            diagnostics: coreResult.diagnostics,
            delivered: coreResult.delivered,
            provider: coreResult.provider,
            startedAt,
            endedAt,
          },
          { preserveSchedule: mode === "force" },
        );
        applyTriggerRunResult(job, {
          status: coreResult.status,
          endedAt,
          triggerEval: coreResult.triggerEval,
        });
        emitCronRunFinished(
          state,
          {
            jobId: job.id,
            action: "finished",
            job,
            status: coreResult.status,
            error: coreResult.error,
            summary: coreResult.summary,
            diagnostics: coreResult.diagnostics,
            delivered: job.state.lastDelivered,
            deliveryStatus: job.state.lastDeliveryStatus,
            deliveryError: job.state.lastDeliveryError,
            failureNotificationDelivery: failureNotificationDeliveryFromJobState(job),
            delivery: coreResult.delivery,
            sessionId: coreResult.sessionId,
            sessionKey: coreResult.sessionKey,
            runId,
            runAtMs: startedAt,
            durationMs: job.state.lastDurationMs,
            nextRunAtMs: job.state.nextRunAtMs,
            ...(coreResult.triggerEval?.fired ? { triggerFired: true } : {}),
            model: coreResult.model,
            provider: coreResult.provider,
            usage: coreResult.usage,
          },
          prepared.terminalTracker,
          taskRunId,
          coreResult.triggerEval,
        );
      }
      const postRunSnapshot = shouldDelete
        ? null
        : {
            enabled: job.enabled,
            updatedAtMs: job.updatedAtMs,
            state: structuredClone(job.state),
          };
      const postRunRemoved = shouldDelete;
      const removedJob = shouldDelete ? structuredClone(job) : void 0;
      await ensureLoaded(state, {
        forceReload: true,
        skipRecompute: true,
      });
      if (!isCronActiveJobMarkerCurrent(prepared.activeJobMarker)) {
        notifySetupTimeout = false;
        return;
      }
      const rollbackSnapshot = snapshotStoreForRollback(state);
      mergeManualRunSnapshotAfterReload({
        state,
        jobId,
        snapshot: postRunSnapshot,
        removed: postRunRemoved,
      });
      recomputeNextRunsForMaintenance(state, { recomputeExpired: true });
      await persistOrRestore(state, rollbackSnapshot);
      if (removedJob)
        emit(state, {
          jobId: removedJob.id,
          action: "removed",
          job: removedJob,
        });
      finalized = true;
    });
    if (notifySetupTimeout && isCronActiveJobMarkerCurrent(prepared.activeJobMarker))
      maybeNotifyManualIsolatedSetupTimeout(state, {
        jobId,
        job: executionJob,
        isolatedAgentSetupTimeout: coreResult.isolatedAgentSetupTimeout,
      });
    if (finalized) {
      if (triggerSkipped)
        tryFinishCronTaskRunWithoutHistory(state, {
          taskRunId,
          status: coreResult.status,
          error: coreResult.error,
          endedAt,
          summary: coreResult.summary,
          childSessionKey: coreResult.sessionKey,
        });
      armTimer(state);
    }
    emitMissingQueuedTerminal();
  } finally {
    clearManualCronJobActive(state, jobId, prepared.activeJobMarker);
  }
}
/** Runs a cron job manually, reserving it under lock before executing outside the lock. */
async function run(state, id, mode, opts) {
  const prepared = await prepareManualRun(state, id, mode, opts);
  if (!prepared.ok || !prepared.ran) return prepared;
  await finishPreparedManualRun(state, prepared, mode);
  return {
    ok: true,
    ran: true,
  };
}
/** Queues a manual cron run behind the cron command lane and returns an immediate run id. */
async function enqueueRun(state, id, mode) {
  const disposition = await inspectManualRunDisposition(state, id, mode);
  if (!disposition.ok || !("runnable" in disposition && disposition.runnable)) return disposition;
  const runId = `manual:${id}:${state.deps.nowMs()}:${nextManualRunId++}`;
  const terminalTracker = { emitted: false };
  runWithGatewayIndependentRootWorkContinuation(() =>
    enqueueCommandInLane(
      "cron",
      async () => {
        const result = await run(state, id, mode, {
          runId,
          terminalTracker,
        });
        if (result.ok && "ran" in result && !result.ran) {
          if (result.reason !== "invalid-spec") {
            const finishedAt = state.deps.nowMs();
            const job = state.store?.jobs.find((entry) => entry.id === id);
            emitCronRunFinished(
              state,
              {
                jobId: id,
                action: "finished",
                job,
                status: "skipped",
                error: `queued manual run skipped before execution: ${result.reason}`,
                runId,
                runAtMs: finishedAt,
                durationMs: 0,
                nextRunAtMs: job?.state.nextRunAtMs,
              },
              terminalTracker,
            );
          }
          state.deps.log.info(
            {
              jobId: id,
              runId,
              reason: result.reason,
            },
            "cron: queued manual run skipped before execution",
          );
        }
        return result;
      },
      {
        warnAfterMs: 5e3,
        onWait: (waitMs, queuedAhead) => {
          state.deps.log.warn(
            {
              jobId: id,
              runId,
              waitMs,
              queuedAhead,
            },
            "cron: queued manual run waiting for an execution slot",
          );
        },
      },
    ),
  ).catch((err) => {
    if (terminalTracker.emitted) {
      state.deps.log.error(
        {
          jobId: id,
          runId,
          err: String(err),
        },
        "cron: queued manual run failed after emitting its terminal event",
      );
      return;
    }
    const finishedAt = state.deps.nowMs();
    const job = state.store?.jobs.find((entry) => entry.id === id);
    emitCronRunFinished(
      state,
      {
        jobId: id,
        action: "finished",
        job,
        status: "error",
        error: normalizeCronRunErrorText(err),
        runId,
        runAtMs: finishedAt,
        durationMs: 0,
        nextRunAtMs: job?.state.nextRunAtMs,
      },
      terminalTracker,
    );
    state.deps.log.error(
      {
        jobId: id,
        runId,
        err: String(err),
      },
      "cron: queued manual run background execution failed",
    );
  });
  return {
    ok: true,
    enqueued: true,
    runId,
  };
}
/** Enqueues manual wake text through the cron wake API. */
function wakeNow(state, opts) {
  return wake(state, opts);
}
//#endregion
//#region src/cron/service.ts
/** Public cron service facade that owns mutable scheduler state and delegates to locked ops. */
var CronService = class {
  constructor(deps) {
    this.startInProgress = 0;
    this.startState = null;
    this.lifecycleGeneration = 0;
    this.state = createCronServiceState(deps);
  }
  async start() {
    const generation = this.lifecycleGeneration;
    const pending = this.startState;
    if (pending) {
      try {
        await pending.promise;
      } catch (err) {
        if (pending.generation === generation) throw err;
      }
      if (pending.generation === generation) return;
      await this.start();
      return;
    }
    const promise = this.startOnce(generation);
    this.startState = {
      generation,
      promise,
    };
    try {
      await promise;
    } finally {
      if (this.startState?.promise === promise) this.startState = null;
    }
  }
  async startOnce(generation) {
    this.startInProgress += 1;
    this.state.schedulerStarted = false;
    try {
      await start(this.state);
      if (generation !== this.lifecycleGeneration) {
        stop(this.state);
        return;
      }
      this.state.schedulerStarted = !this.state.stopped;
    } finally {
      this.startInProgress -= 1;
    }
  }
  stop() {
    this.lifecycleGeneration += 1;
    stop(this.state);
  }
  pauseScheduling() {
    pauseScheduling(this.state);
  }
  resumeScheduling() {
    resumeScheduling(this.state);
  }
  getSuspensionBlockerCount() {
    return this.startInProgress;
  }
  async status() {
    return await status(this.state);
  }
  async list(opts) {
    return await list(this.state, opts);
  }
  async listPage(opts) {
    return await listPage(this.state, opts);
  }
  async add(input, opts) {
    return await add(this.state, input, opts);
  }
  async update(id, patch) {
    return await update(this.state, id, patch);
  }
  async updateWithPrecondition(id, patch, precondition) {
    return await updateWithPrecondition(this.state, id, patch, precondition);
  }
  async remove(id) {
    return await remove(this.state, id);
  }
  async run(id, mode, opts) {
    return await run(this.state, id, mode, opts);
  }
  async enqueueRun(id, mode) {
    const result = await enqueueRun(this.state, id, mode);
    if (result.ok && "runnable" in result)
      throw new Error("cron enqueueRun returned unresolved runnable disposition");
    return result;
  }
  getJob(id) {
    return this.state.store?.jobs.find((job) => job.id === id);
  }
  /** In-memory job snapshot; undefined until the store is loaded. */
  getLoadedJobs() {
    return this.state.store?.jobs;
  }
  async readJob(id) {
    return await readJob(this.state, id);
  }
  getDefaultAgentId() {
    return this.state.deps.defaultAgentId;
  }
  wake(opts) {
    return wakeNow(this.state, opts);
  }
};
//#endregion
//#region src/cron/trigger-script.ts
const MAX_CONCURRENT_TRIGGER_EVALS = 3;
const MAX_TRIGGER_STATE_BYTES = 16 * 1024;
const MAX_CACHED_TRIGGER_RUNTIMES = 128;
const HEADLESS_TRIGGER_WALL_CLOCK_MS = 3e4;
const HEADLESS_TRIGGER_TOOL_BUDGET = 5;
let activeTriggerEvaluations = 0;
function resolveTriggerAgentId(config, agentId) {
  return agentId?.trim() ? normalizeAgentId(agentId) : resolveDefaultAgentId(config);
}
async function prepareTriggerRuntime(params) {
  params.signal?.throwIfAborted();
  const agentId = resolveTriggerAgentId(params.runtimeConfig, params.agentId);
  const selectedAgentConfig = resolveAgentConfig(params.runtimeConfig, agentId);
  const agentConfigOverride = params.agentId?.trim() ? selectedAgentConfig : void 0;
  const agentDefaults = buildCronAgentDefaultsConfig({
    defaults: params.runtimeConfig.agents?.defaults,
    agentConfigOverride,
  });
  const config = {
    ...params.runtimeConfig,
    agents: Object.assign({}, params.runtimeConfig.agents, { defaults: agentDefaults }),
  };
  const workspaceDirRaw = resolveAgentWorkspaceDir(config, agentId);
  const agentDir = resolveAgentDir(config, agentId);
  const workspace = await ensureAgentWorkspace({
    dir: workspaceDirRaw,
    ensureBootstrapFiles: !agentDefaults.skipBootstrap,
    skipOptionalBootstrapFiles: agentDefaults.skipOptionalBootstrapFiles,
  });
  params.signal?.throwIfAborted();
  const workspaceDir = workspace.dir;
  ensureRuntimePluginsLoaded({
    config,
    workspaceDir,
    allowGatewaySubagentBinding: true,
  });
  const sessionKey = resolveCronAgentSessionKey({
    sessionKey: `cron:${params.jobId}:trigger`,
    agentId,
    mainKey: config.session?.mainKey,
    cfg: config,
  });
  const sandbox = await resolveSandboxContext({
    config,
    sessionKey,
    workspaceDir,
  });
  params.signal?.throwIfAborted();
  const effectiveWorkspace =
    sandbox?.enabled && sandbox.workspaceAccess !== "rw" ? sandbox.workspaceDir : workspaceDir;
  const toolPlan = resolveEmbeddedAttemptToolConstructionPlan({
    toolsEnabled: true,
    toolsAllow: params.toolsAllow,
  });
  return {
    tools: applyEmbeddedAttemptToolsAllow(
      toolPlan.constructTools
        ? createOpenClawCodingTools({
            agentId,
            exec: { config },
            sandbox,
            sessionKey,
            trigger: "cron",
            jobId: params.jobId,
            agentDir,
            cwd: effectiveWorkspace,
            workspaceDir: effectiveWorkspace,
            spawnWorkspaceDir: workspaceDir,
            config,
            allowGatewaySubagentBinding: true,
            includeCoreTools: toolPlan.includeCoreTools,
            runtimeToolAllowlist: toolPlan.runtimeToolAllowlist,
            toolConstructionPlan: toolPlan.codingToolConstructionPlan,
          })
        : [],
      params.toolsAllow,
      { toolMeta: (tool) => getPluginToolMeta(tool) },
    ),
    hookContext: {
      agentId,
      config,
      cwd: effectiveWorkspace,
      workspaceDir: effectiveWorkspace,
      sessionKey,
      loopDetection: resolveToolLoopDetectionConfig({
        cfg: config,
        agentId,
      }),
    },
    ctx: {
      config,
      runtimeConfig: config,
      agentId,
      sessionKey,
    },
  };
}
function triggerStateNamespace(state) {
  return {
    id: "cron:trigger",
    globalName: "trigger",
    scope: {
      kind: "object",
      entries: [
        [
          "state",
          {
            kind: "value",
            value: state,
          },
        ],
      ],
    },
  };
}
function triggerResultCandidate(result) {
  if (isRecord(result.value) && typeof result.value.fire === "boolean") return result.value;
  for (let index = result.output.length - 1; index >= 0; index -= 1) {
    const entry = result.output[index];
    if (isRecord(entry) && entry.type === "json") return entry.value;
  }
}
function parseTriggerResult(result) {
  const candidate = triggerResultCandidate(result);
  if (!isRecord(candidate) || typeof candidate.fire !== "boolean")
    return {
      kind: "error",
      code: "internal_error",
      error: "cron trigger script must return an object with boolean fire",
    };
  if (candidate.message !== void 0 && typeof candidate.message !== "string")
    return {
      kind: "error",
      code: "internal_error",
      error: "cron trigger script message must be a string",
    };
  const hasState = Object.hasOwn(candidate, "state");
  if (hasState) {
    let serialized;
    try {
      serialized = JSON.stringify(candidate.state);
    } catch (error) {
      return {
        kind: "error",
        code: "internal_error",
        error: `cron trigger state is not JSON-serializable: ${String(error)}`,
      };
    }
    if (serialized === void 0)
      return {
        kind: "error",
        code: "internal_error",
        error: "cron trigger state is not JSON-serializable",
      };
    if (Buffer.byteLength(serialized, "utf8") > MAX_TRIGGER_STATE_BYTES)
      return {
        kind: "error",
        code: "output_limit_exceeded",
        error: "cron trigger state exceeds the 16KB limit",
      };
  }
  return {
    kind: "evaluated",
    fire: candidate.fire,
    ...(typeof candidate.message === "string" ? { message: candidate.message } : {}),
    ...(hasState ? { state: candidate.state } : {}),
  };
}
function createTriggerDeadlineScope(externalSignal) {
  const controller = new AbortController();
  const onExternalAbort = () =>
    controller.abort(new CodeModeHeadlessAbortError("cron trigger evaluation aborted"));
  externalSignal?.addEventListener("abort", onExternalAbort, { once: true });
  if (externalSignal?.aborted) onExternalAbort();
  const timer = setTimeout(
    () => controller.abort(new CodeModeHeadlessTimeoutError("cron trigger evaluation timed out")),
    HEADLESS_TRIGGER_WALL_CLOCK_MS,
  );
  return {
    deadline: Date.now() + HEADLESS_TRIGGER_WALL_CLOCK_MS,
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timer);
      externalSignal?.removeEventListener("abort", onExternalAbort);
    },
  };
}
async function awaitTriggerSignal(promise, signal) {
  if (signal.aborted)
    throw signal.reason instanceof Error ? signal.reason : new CodeModeHeadlessAbortError();
  let onAbort;
  try {
    const aborted = new Promise((_resolve, reject) => {
      onAbort = () =>
        reject(signal.reason instanceof Error ? signal.reason : new CodeModeHeadlessAbortError());
      signal.addEventListener("abort", onAbort, { once: true });
    });
    return await Promise.race([promise, aborted]);
  } finally {
    if (onAbort) signal.removeEventListener("abort", onAbort);
  }
}
function createCronTriggerEvaluator(deps) {
  const runHeadless = deps.runHeadless ?? runCodeModeScriptHeadless;
  const prepareRuntime = deps.prepareRuntime ?? prepareTriggerRuntime;
  const runtimeCache = /* @__PURE__ */ new Map();
  const trimRuntimeCache = () => {
    while (runtimeCache.size > MAX_CACHED_TRIGGER_RUNTIMES) {
      const oldestJobId = runtimeCache.keys().next().value;
      if (oldestJobId === void 0) return;
      runtimeCache.delete(oldestJobId);
    }
  };
  const resolveCachedRuntime = async (request) => {
    const cached = runtimeCache.get(request.jobId);
    if (
      cached &&
      cached.configEpoch === request.runtimeConfig &&
      cached.agentId === request.agentId &&
      cached.toolsAllowKey === request.toolsAllowKey
    ) {
      runtimeCache.delete(request.jobId);
      runtimeCache.set(request.jobId, cached);
      try {
        return await awaitTriggerSignal(cached.promise, request.signal);
      } catch (error) {
        if (
          (error instanceof CodeModeHeadlessAbortError ||
            error instanceof CodeModeHeadlessTimeoutError) &&
          !request.signal.aborted
        ) {
          if (runtimeCache.get(request.jobId) === cached) runtimeCache.delete(request.jobId);
          return await resolveCachedRuntime(request);
        }
        throw error;
      }
    }
    const promise = prepareRuntime({
      runtimeConfig: request.runtimeConfig,
      jobId: request.jobId,
      agentId: request.requestedAgentId,
      toolsAllow: request.toolsAllow,
      signal: request.signal,
    });
    const entry = {
      promise,
      configEpoch: request.runtimeConfig,
      agentId: request.agentId,
      toolsAllowKey: request.toolsAllowKey,
    };
    runtimeCache.delete(request.jobId);
    runtimeCache.set(request.jobId, entry);
    trimRuntimeCache();
    promise.catch(() => {
      if (runtimeCache.get(request.jobId) === entry) runtimeCache.delete(request.jobId);
    });
    return await awaitTriggerSignal(entry.promise, request.signal);
  };
  return async function evaluateCronTrigger(params) {
    if (activeTriggerEvaluations >= MAX_CONCURRENT_TRIGGER_EVALS) return { kind: "busy" };
    activeTriggerEvaluations += 1;
    const evaluationScope = createTriggerDeadlineScope(params.abortSignal);
    try {
      const runtimeConfig = resolveCronActiveRuntimeConfig(deps.config);
      const agentId = resolveTriggerAgentId(runtimeConfig, params.agentId);
      const toolsAllowKey = JSON.stringify(params.toolsAllow ?? null);
      const runtime = await resolveCachedRuntime({
        runtimeConfig,
        jobId: params.jobId,
        requestedAgentId: params.agentId,
        agentId,
        toolsAllow: params.toolsAllow,
        toolsAllowKey,
        signal: evaluationScope.signal,
      });
      const catalogRef = createToolSearchCatalogRef();
      const runId = `cron-trigger:${params.jobId}:${crypto.randomUUID()}`;
      registerHeadlessToolSearchCatalog({
        catalogRef,
        tools: runtime.tools,
        hookContext: {
          ...runtime.hookContext,
          runId,
        },
      });
      const remainingWallClockMs = evaluationScope.deadline - Date.now();
      if (remainingWallClockMs <= 0)
        throw new CodeModeHeadlessTimeoutError("cron trigger evaluation timed out");
      const result = await runHeadless({
        ctx: {
          ...runtime.ctx,
          catalogRef,
          abortSignal: evaluationScope.signal,
        },
        code: params.script,
        wallClockMs: remainingWallClockMs,
        maxToolCalls: HEADLESS_TRIGGER_TOOL_BUDGET,
        extraNamespaces: [triggerStateNamespace(params.state)],
        signal: evaluationScope.signal,
      });
      if (result.status === "failed")
        return {
          kind: "error",
          code: result.code,
          error: result.error,
        };
      return parseTriggerResult(result);
    } catch (error) {
      return {
        kind: "error",
        code:
          error instanceof CodeModeHeadlessTimeoutError
            ? "timeout"
            : error instanceof CodeModeHeadlessAbortError
              ? "aborted"
              : "internal_error",
        error: error instanceof Error ? error.message : String(error),
      };
    } finally {
      evaluationScope.cleanup();
      activeTriggerEvaluations -= 1;
    }
  };
}
//#endregion
//#region src/gateway/cron-exit-watch-shell.ts
/** Resolve the native shell used for watched commands on each gateway platform. */
function resolveExitWatchShell(platform = process.platform) {
  if (platform === "win32")
    return {
      command: process.env.ComSpec ?? "cmd.exe",
      argsFor: (command) => ["/d", "/s", "/c", command],
    };
  return {
    command: "bash",
    argsFor: (command) => ["-lc", command],
  };
}
//#endregion
//#region src/gateway/cron-exit-watchers.ts
/**
 * Safety bound for a watched command, so a hung/never-exiting command cannot
 * keep a gateway-owned process alive forever. Generous (24h) because on-exit
 * legitimately watches long-running commands (builds, deploys); on timeout the
 * watch ends and the job fires like any other exit.
 */
const ON_EXIT_WATCH_TIMEOUT_MS = 1440 * 60 * 1e3;
const SCOPE_PREFIX = "cron-exit";
function scopeKey(jobId) {
  return `${SCOPE_PREFIX}:${jobId}`;
}
function isWatchableExitJob(job) {
  return job.enabled && job.schedule.kind === "on-exit";
}
function createCronExitWatchers(params) {
  const shell = params.shell ?? resolveExitWatchShell();
  const active = /* @__PURE__ */ new Map();
  const settlingCancelledSlots = /* @__PURE__ */ new Set();
  const cancel = (jobId) => {
    const slot = active.get(jobId);
    if (!slot) return;
    slot.cancelled = true;
    if (!slot.lifecycleSettled) settlingCancelledSlots.add(slot);
    if (!slot.terminalPersisting) active.delete(jobId);
    slot.run?.cancel("manual-cancel");
    try {
      params.getProcessSupervisor().cancelScope(scopeKey(jobId), "manual-cancel");
    } catch (err) {
      params.logger.warn(
        {
          err: String(err),
          jobId,
        },
        "cron-exit: cancel watcher failed",
      );
    }
  };
  const arm = (job) => {
    const command = job.schedule.command;
    const cwd = job.schedule.cwd;
    const armToken = {};
    const slot = {
      armToken,
      job,
      run: void 0,
      fired: false,
      terminalPersisting: false,
      cancelled: false,
      lifecycleSettled: false,
      command,
      cwd,
    };
    active.set(job.id, slot);
    const owns = () => active.get(job.id) === slot && slot.armToken === armToken;
    (async () => {
      let run;
      try {
        run = await params.getProcessSupervisor().spawn({
          sessionId: `cron-exit:${job.id}`,
          backendId: "cron-exit-watch",
          scopeKey: scopeKey(job.id),
          replaceExistingScope: true,
          mode: "child",
          argv: [shell.command, ...shell.argsFor(command)],
          ...(cwd ? { cwd } : {}),
          env: markOpenClawExecEnv({ ...process.env }),
          timeoutMs: ON_EXIT_WATCH_TIMEOUT_MS,
          captureOutput: true,
        });
      } catch (err) {
        if (owns()) active.delete(job.id);
        params.logger.warn(
          {
            err: String(err),
            jobId: job.id,
          },
          "cron-exit: watcher spawn failed",
        );
        return;
      }
      if (!owns()) {
        run.cancel("manual-cancel");
        try {
          await run.wait();
        } catch {}
        return;
      }
      slot.run = run;
      params.logger.info(
        {
          jobId: job.id,
          runId: run.runId,
          command,
        },
        "cron-exit: watcher armed",
      );
      let exit;
      try {
        exit = await run.wait();
      } catch (err) {
        if (owns()) active.delete(job.id);
        params.logger.warn(
          {
            err: String(err),
            jobId: job.id,
          },
          "cron-exit: run.wait() rejected; released watcher slot without firing",
        );
        return;
      }
      if (!owns()) return;
      params.logger.info(
        {
          jobId: job.id,
          exitCode: exit.exitCode,
          reason: exit.reason,
        },
        "cron-exit: watched command exited; firing job",
      );
      slot.terminalPersisting = true;
      try {
        await params.persistCompletion(job.id);
      } catch (err) {
        if (owns()) active.delete(job.id);
        params.logger.warn(
          {
            err: String(err),
            jobId: job.id,
          },
          "cron-exit: persistCompletion failed; NOT firing (fail closed to avoid replay)",
        );
        return;
      }
      slot.terminalPersisting = false;
      if (!owns() || slot.cancelled) {
        if (active.get(job.id) === slot) active.delete(job.id);
        return;
      }
      slot.fired = true;
      try {
        await params.fireOnExit(slot.job, {
          exitCode: exit.exitCode,
          reason: exit.reason,
          stdout: exit.stdout,
          stderr: exit.stderr,
          timedOut: exit.timedOut,
          noOutputTimedOut: exit.noOutputTimedOut,
        });
      } catch (err) {
        params.logger.warn(
          {
            err: String(err),
            jobId: job.id,
          },
          "cron-exit: fireOnExit after exit failed",
        );
      }
    })().finally(() => {
      slot.lifecycleSettled = true;
      settlingCancelledSlots.delete(slot);
      if (slot.cancelled && active.get(job.id) === slot) active.delete(job.id);
    });
  };
  const reconcile = (jobs) => {
    const want = new Map(jobs.filter(isWatchableExitJob).map((j) => [j.id, j]));
    for (const jobId of Array.from(active.keys())) if (!want.has(jobId)) cancel(jobId);
    for (const [jobId, job] of want) {
      const slot = active.get(jobId);
      if (slot) {
        if (slot.fired) continue;
        const { command, cwd } = job.schedule;
        if (slot.command === command && slot.cwd === cwd) {
          slot.job = job;
          continue;
        }
        cancel(jobId);
      }
      arm(job);
    }
  };
  const cancelAll = () => {
    for (const jobId of Array.from(active.keys())) cancel(jobId);
  };
  return {
    reconcile,
    cancel,
    cancelAll,
    activeJobIds: () =>
      Array.from(
        /* @__PURE__ */ new Set([
          ...Array.from(active.entries())
            .filter(([, slot]) => !slot.fired)
            .map(([jobId]) => jobId),
          ...Array.from(settlingCancelledSlots, (slot) => slot.job.id),
        ]),
      ),
  };
}
//#endregion
//#region src/gateway/server-cron-notifications.ts
const CRON_WEBHOOK_TIMEOUT_MS = 1e4;
function redactWebhookUrl(url) {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return "<invalid-webhook-url>";
  }
}
function redactOptionalWebhookUrl(url) {
  const normalized = normalizeOptionalString(url);
  return normalized ? redactWebhookUrl(normalized) : void 0;
}
function redactCommandCronEventForExternalDelivery(evt, job) {
  if (job?.payload.kind !== "command") return evt;
  const summary = redactCronCommandSummaryForExternalDelivery(evt.summary);
  const diagnosticsSummary = redactCronCommandSummaryForExternalDelivery(evt.diagnostics?.summary);
  const diagnosticsEntries = evt.diagnostics?.entries.map((entry) => ({
    ...entry,
    message: redactCronCommandSummaryForExternalDelivery(entry.message) ?? entry.message,
  }));
  const diagnosticsEntriesChanged = diagnosticsEntries?.some(
    (entry, index) => entry.message !== evt.diagnostics?.entries[index]?.message,
  );
  const embeddedJobState = evt.job?.state;
  const stripEmbeddedJobDiagnostics = Boolean(
    embeddedJobState &&
    ("lastDiagnostics" in embeddedJobState || "lastDiagnosticSummary" in embeddedJobState),
  );
  if (
    summary === evt.summary &&
    diagnosticsSummary === evt.diagnostics?.summary &&
    !diagnosticsEntriesChanged &&
    !stripEmbeddedJobDiagnostics
  )
    return evt;
  const redacted = { ...evt };
  if (summary !== void 0) redacted.summary = summary;
  else delete redacted.summary;
  if (evt.diagnostics) {
    redacted.diagnostics = { ...evt.diagnostics };
    if (diagnosticsSummary !== void 0) redacted.diagnostics.summary = diagnosticsSummary;
    else delete redacted.diagnostics.summary;
    if (diagnosticsEntries) redacted.diagnostics.entries = diagnosticsEntries;
  }
  if (stripEmbeddedJobDiagnostics && evt.job) {
    const state = { ...evt.job.state };
    delete state.lastDiagnostics;
    delete state.lastDiagnosticSummary;
    redacted.job = {
      ...evt.job,
      state,
    };
  }
  return redacted;
}
/** Resolves direct webhook delivery and completion-destination webhooks. */
function resolveCronWebhookTargets(params) {
  const targets = [];
  const mode = normalizeOptionalLowercaseString(params.delivery?.mode);
  if (mode === "webhook") {
    const url = normalizeHttpWebhookUrl(params.delivery?.to);
    if (url)
      targets.push({
        url,
        source: "delivery",
      });
  }
  const completionMode = normalizeOptionalLowercaseString(
    params.delivery?.completionDestination?.mode,
  );
  if (mode === "announce" && completionMode === "webhook") {
    const url = normalizeHttpWebhookUrl(params.delivery?.completionDestination?.to);
    if (url && targets.every((target) => target.url !== url))
      targets.push({
        url,
        source: "completionDestination",
      });
  }
  return targets;
}
function buildCronWebhookHeaders(webhookToken) {
  const headers = { "Content-Type": "application/json" };
  if (webhookToken) headers.Authorization = `Bearer ${webhookToken}`;
  return headers;
}
function buildCronFailureWebhookPayload(params) {
  const failureMessage = `Cron job "${params.job.name}" failed: ${params.evt.error ?? "unknown error"}`;
  return {
    jobId: params.job.id,
    jobName: params.job.name,
    message: failureMessage,
    status: params.evt.status,
    error: params.evt.error,
    runAtMs: params.evt.runAtMs,
    durationMs: params.evt.durationMs,
    nextRunAtMs: params.evt.nextRunAtMs,
  };
}
function buildCronFinishedWebhookPayload(evt) {
  if (evt.status !== "error") return evt;
  const { summary: _summary, diagnostics: _diagnostics, ...payload } = evt;
  if (evt.job) {
    const state = { ...evt.job.state };
    delete state.lastDiagnostics;
    delete state.lastDiagnosticSummary;
    return {
      ...payload,
      job: {
        ...evt.job,
        state,
      },
    };
  }
  return payload;
}
/** Posts a cron webhook without throwing back into scheduler completion flow. */
async function postCronWebhook(params) {
  const abortController = new AbortController();
  const timeout = setTimeout(() => {
    abortController.abort();
  }, CRON_WEBHOOK_TIMEOUT_MS);
  try {
    await (
      await fetchWithSsrFGuard({
        url: params.webhookUrl,
        init: {
          method: "POST",
          headers: buildCronWebhookHeaders(params.webhookToken),
          body: JSON.stringify(params.payload),
          signal: abortController.signal,
        },
      })
    ).release();
  } catch (err) {
    if (err instanceof SsrFBlockedError)
      params.logger.warn(
        {
          ...params.logContext,
          reason: formatErrorMessage(err),
          webhookUrl: redactWebhookUrl(params.webhookUrl),
        },
        params.blockedLog,
      );
    else
      params.logger.warn(
        {
          ...params.logContext,
          err: formatErrorMessage(err),
          webhookUrl: redactWebhookUrl(params.webhookUrl),
        },
        params.failedLog,
      );
  } finally {
    clearTimeout(timeout);
  }
}
/** Detached sends outlive cron ticks; own roots block mid-delivery suspension snapshots. */
function dispatchDetachedCronNotification(params) {
  runWithGatewayIndependentRootWorkAdmission(params.deliver).catch((err) => {
    params.logger.warn(
      {
        jobId: params.jobId,
        err: formatErrorMessage(err),
      },
      "cron: detached notification delivery failed",
    );
  });
}
/** Sends the immediate failure alert for cron jobs that failed before normal completion delivery. */
async function sendGatewayCronFailureAlert(params) {
  await runWithGatewayIndependentRootWorkAdmission(async () => {
    await sendGatewayCronFailureAlertUnderAdmission(params);
  });
}
async function sendGatewayCronFailureAlertUnderAdmission(params) {
  const { agentId, cfg: runtimeConfig } = params.resolveCronAgent(params.job.agentId);
  const webhookToken = normalizeOptionalString(params.webhookToken);
  if (params.mode === "webhook" && !params.to) {
    params.logger.warn(
      { jobId: params.job.id },
      "cron: failure alert webhook mode requires URL, skipping",
    );
    return;
  }
  if (params.mode === "webhook" && params.to) {
    const webhookUrl = normalizeHttpWebhookUrl(params.to);
    if (webhookUrl)
      await postCronWebhook({
        webhookUrl,
        webhookToken,
        payload: {
          jobId: params.job.id,
          jobName: params.job.name,
          message: params.text,
        },
        logContext: { jobId: params.job.id },
        blockedLog: "cron: failure alert webhook blocked by SSRF guard",
        failedLog: "cron: failure alert webhook failed",
        logger: params.logger,
      });
    else
      params.logger.warn(
        {
          jobId: params.job.id,
          webhookUrl: redactWebhookUrl(params.to),
        },
        "cron: failure alert webhook URL is invalid, skipping",
      );
    return;
  }
  const abortController = new AbortController();
  await sendCronAnnouncePayloadStrict({
    deps: params.deps,
    cfg: runtimeConfig,
    agentId,
    jobId: params.job.id,
    target: {
      channel: params.channel,
      to: params.to,
      accountId: params.accountId,
      sessionKey: resolveCronDeliverySessionKey(params.job),
    },
    message: params.text,
    abortSignal: abortController.signal,
  });
}
/** Dispatches completion and failure-destination notifications after a cron run finishes. */
function dispatchGatewayCronFinishedNotifications(params) {
  const webhookToken = normalizeOptionalString(params.webhookToken);
  const redactedWebhookEvent = redactCommandCronEventForExternalDelivery(params.evt, params.job);
  const webhookTargets = resolveCronWebhookTargets({
    delivery:
      params.job?.delivery && typeof params.job.delivery.mode === "string"
        ? {
            mode: params.job.delivery.mode,
            to: params.job.delivery.to,
            completionDestination: params.job.delivery.completionDestination,
          }
        : void 0,
  });
  if (
    params.job?.delivery?.completionDestination?.mode === "webhook" &&
    !normalizeHttpWebhookUrl(params.job.delivery.completionDestination.to)
  )
    params.logger.warn(
      {
        jobId: params.evt.jobId,
        deliveryTo: redactOptionalWebhookUrl(params.job.delivery.completionDestination.to),
      },
      "cron: skipped completion webhook delivery, delivery.completionDestination.to must be a valid http(s) URL",
    );
  if (
    !webhookTargets.some((target) => target.source === "delivery") &&
    params.job?.delivery?.mode === "webhook"
  )
    params.logger.warn(
      {
        jobId: params.evt.jobId,
        deliveryTo: redactOptionalWebhookUrl(params.job.delivery.to),
      },
      "cron: skipped webhook delivery, delivery.to must be a valid http(s) URL",
    );
  if (params.evt.summary)
    for (const webhookTarget of webhookTargets) {
      const payload = buildCronFinishedWebhookPayload(redactedWebhookEvent);
      dispatchDetachedCronNotification({
        jobId: params.evt.jobId,
        logger: params.logger,
        deliver: () =>
          postCronWebhook({
            webhookUrl: webhookTarget.url,
            webhookToken,
            payload,
            logContext: {
              jobId: params.evt.jobId,
              source: webhookTarget.source,
            },
            blockedLog: "cron: webhook delivery blocked by SSRF guard",
            failedLog: "cron: webhook delivery failed",
            logger: params.logger,
          }),
      });
    }
  dispatchCronFailureDestinationNotifications({
    evt: params.evt,
    job: params.job,
    deps: params.deps,
    logger: params.logger,
    resolveCronAgent: params.resolveCronAgent,
    webhookToken,
    globalFailureDestination: params.globalFailureDestination,
  });
}
function dispatchCronFailureDestinationNotifications(params) {
  if (params.evt.status !== "error" || !params.job || params.job.delivery?.bestEffort === true)
    return;
  const job = params.job;
  const failureDest = resolveFailureDestination(job, params.globalFailureDestination);
  const deliverySessionKey = resolveCronDeliverySessionKey(job);
  const failurePayload = buildCronFailureWebhookPayload({
    evt: params.evt,
    job,
  });
  if (failureDest) {
    if (failureDest.mode === "webhook" && failureDest.to) {
      const webhookUrl = normalizeHttpWebhookUrl(failureDest.to);
      if (webhookUrl)
        dispatchDetachedCronNotification({
          jobId: params.evt.jobId,
          logger: params.logger,
          deliver: () =>
            postCronWebhook({
              webhookUrl,
              webhookToken: params.webhookToken,
              payload: failurePayload,
              logContext: { jobId: params.evt.jobId },
              blockedLog: "cron: failure destination webhook blocked by SSRF guard",
              failedLog: "cron: failure destination webhook failed",
              logger: params.logger,
            }),
        });
      else
        params.logger.warn(
          {
            jobId: params.evt.jobId,
            webhookUrl: redactWebhookUrl(failureDest.to),
          },
          "cron: failure destination webhook URL is invalid, skipping",
        );
      return;
    }
    if (failureDest.mode === "announce") {
      const { agentId, cfg: runtimeConfig } = params.resolveCronAgent(job.agentId);
      dispatchDetachedCronNotification({
        jobId: job.id,
        logger: params.logger,
        deliver: () =>
          sendFailureNotificationAnnounce(
            params.deps,
            runtimeConfig,
            agentId,
            job.id,
            {
              channel: failureDest.channel,
              to: failureDest.to,
              accountId: failureDest.accountId,
              sessionKey: deliverySessionKey,
              inheritSessionThread: false,
            },
            `⚠️ ${failurePayload.message}`,
          ),
      });
    }
    return;
  }
  const primaryPlan = resolveCronDeliveryPlan(job);
  if (primaryPlan.mode !== "announce" || !primaryPlan.requested) return;
  const { agentId, cfg: runtimeConfig } = params.resolveCronAgent(job.agentId);
  dispatchDetachedCronNotification({
    jobId: job.id,
    logger: params.logger,
    deliver: () =>
      sendFailureNotificationAnnounce(
        params.deps,
        runtimeConfig,
        agentId,
        job.id,
        {
          channel: primaryPlan.channel,
          to: primaryPlan.to,
          accountId: primaryPlan.accountId,
          sessionKey: deliverySessionKey,
        },
        `⚠️ ${failurePayload.message}`,
      ),
  });
}
//#endregion
//#region src/gateway/server-cron.ts
function formatOnExitRunSummary(exit) {
  const lines = [
    "Watched command finished.",
    `Exit code: ${exit.exitCode ?? "none"}`,
    `Reason: ${exit.reason}`,
  ];
  const output = buildCronCommandSummary({
    stdout: exit.stdout,
    stderr: exit.stderr,
  });
  return output ? `${lines.join("\n")}\n\nOutput:\n${output}` : lines.join("\n");
}
function addOnExitRunSummary(payload, exit) {
  const summary = formatOnExitRunSummary(exit);
  if (payload.kind === "systemEvent")
    return {
      ...payload,
      text: `${payload.text}\n\n${summary}`,
    };
  if (payload.kind === "agentTurn")
    return {
      ...payload,
      message: `${payload.message}\n\n${summary}`,
    };
  return payload;
}
/**
 * On-exit jobs use the normal force-run path so every payload kind records
 * run state, history, notifications, and delivery outcomes consistently.
 */
async function fireOnExitJob(job, exit, deps) {
  const payload = addOnExitRunSummary(job.payload, exit);
  await deps.run(job.id, payload === job.payload ? void 0 : payload);
}
function reconcileCronExitWatchers(params) {
  if (!params.cronEnabled) {
    params.exitWatchers.cancelAll();
    return;
  }
  params.exitWatchers.reconcile(params.jobs);
}
/** Pick only the keys whose values are not `undefined` from an object. */
function pickDefined(obj, keys) {
  const result = {};
  for (const k of keys) if (obj[k] !== void 0) result[k] = obj[k];
  return result;
}
function omitExplicitHeartbeatDestination(heartbeat) {
  if (!heartbeat) return;
  return {
    ...heartbeat,
    to: void 0,
    accountId: void 0,
  };
}
function sanitizeCronHeartbeatOverride(heartbeat) {
  return heartbeat?.target === "last" ? omitExplicitHeartbeatDestination(heartbeat) : heartbeat;
}
/** Map internal CronJob to the public plugin SDK shape. */
function toPluginCronJob(job) {
  return {
    id: job.id,
    agentId: job.agentId,
    name: job.name,
    description: job.description,
    enabled: job.enabled,
    schedule: job.schedule ? structuredClone(job.schedule) : void 0,
    sessionTarget: job.sessionTarget,
    wakeMode: job.wakeMode,
    payload: job.payload ? structuredClone(job.payload) : void 0,
    state: {
      nextRunAtMs: job.state.nextRunAtMs,
      runningAtMs: job.state.runningAtMs,
      lastRunAtMs: job.state.lastRunAtMs,
      lastRunStatus: job.state.lastRunStatus,
      lastError: job.state.lastError,
      lastDurationMs: job.state.lastDurationMs,
      lastDelivered: job.state.lastDelivered,
      lastDeliveryStatus: job.state.lastDeliveryStatus,
      lastDeliveryError: job.state.lastDeliveryError,
      lastFailureNotificationDelivered: job.state.lastFailureNotificationDelivered,
      lastFailureNotificationDeliveryStatus: job.state.lastFailureNotificationDeliveryStatus,
      lastFailureNotificationDeliveryError: job.state.lastFailureNotificationDeliveryError,
    },
    createdAtMs: job.createdAtMs,
    updatedAtMs: job.updatedAtMs,
  };
}
function isCommandCronJob(job) {
  return job?.payload?.kind === "command";
}
/** Build the cron service state used by Gateway startup and lazy cron loading. */
function buildGatewayCronService(params) {
  const cronLogger = getChildLogger({ module: "cron" });
  const env = params.env ?? process.env;
  const storePath = resolveCronJobsStorePath(params.cfg.cron?.store, env);
  const cronEnabled = env.OPENCLAW_SKIP_CRON !== "1" && params.cfg.cron?.enabled !== false;
  const findAgentEntry = (cfg, agentId) =>
    Array.isArray(cfg.agents?.list)
      ? cfg.agents.list.find(
          (entry) =>
            entry && typeof entry.id === "string" && normalizeAgentId(entry.id) === agentId,
        )
      : void 0;
  const hasConfiguredAgent = (cfg, agentId) => Boolean(findAgentEntry(cfg, agentId));
  const mergeRuntimeAgentConfig = (runtimeConfig, requestedAgentId) => {
    if (hasConfiguredAgent(runtimeConfig, requestedAgentId)) return runtimeConfig;
    const fallbackAgentEntry = findAgentEntry(params.cfg, requestedAgentId);
    if (!fallbackAgentEntry) return runtimeConfig;
    const startupAgents = params.cfg.agents;
    const runtimeAgents = runtimeConfig.agents;
    return {
      ...runtimeConfig,
      agents: {
        ...startupAgents,
        ...runtimeAgents,
        defaults: {
          ...startupAgents?.defaults,
          ...runtimeAgents?.defaults,
        },
        list: [...(runtimeAgents?.list ?? []), fallbackAgentEntry],
      },
    };
  };
  const resolveCronAgent = (requested) => {
    const runtimeConfig = getRuntimeConfig();
    const normalized =
      typeof requested === "string" && requested.trim() ? normalizeAgentId(requested) : void 0;
    const effectiveConfig =
      normalized !== void 0 ? mergeRuntimeAgentConfig(runtimeConfig, normalized) : runtimeConfig;
    return {
      agentId:
        normalized !== void 0 && hasConfiguredAgent(effectiveConfig, normalized)
          ? normalized
          : resolveDefaultAgentId(effectiveConfig),
      cfg: effectiveConfig,
    };
  };
  const resolveCronSessionKey = (paramsValue) => {
    const requested = paramsValue.requestedSessionKey?.trim();
    if (!requested)
      return resolveAgentMainSessionKey({
        cfg: paramsValue.runtimeConfig,
        agentId: paramsValue.agentId,
      });
    const candidate = toAgentStoreSessionKey({
      agentId: paramsValue.agentId,
      requestKey: requested,
      mainKey: paramsValue.runtimeConfig.session?.mainKey,
    });
    const canonical = canonicalizeMainSessionAlias({
      cfg: paramsValue.runtimeConfig,
      agentId: paramsValue.agentId,
      sessionKey: candidate,
    });
    if (canonical !== "global") {
      if (
        normalizeAgentId(resolveAgentIdFromSessionKey(canonical)) !==
        normalizeAgentId(paramsValue.agentId)
      )
        return resolveAgentMainSessionKey({
          cfg: paramsValue.runtimeConfig,
          agentId: paramsValue.agentId,
        });
    }
    return (
      resolveMainScopedEventSessionKey({
        cfg: paramsValue.runtimeConfig,
        sessionKey: canonical,
        agentId: paramsValue.agentId,
      }) ?? canonical
    );
  };
  const resolveCronTarget = (opts) => {
    const requestedAgentId =
      typeof opts?.agentId === "string" && opts.agentId.trim()
        ? normalizeAgentId(opts.agentId)
        : void 0;
    const requestedSessionKey =
      typeof opts?.sessionKey === "string" && opts.sessionKey.trim() ? opts.sessionKey : void 0;
    if (opts?.preserveUntargeted && !requestedAgentId && !requestedSessionKey)
      return {
        runtimeConfig: getRuntimeConfig(),
        agentId: void 0,
        sessionKey: void 0,
      };
    const derivedAgentId =
      requestedSessionKey && parseAgentSessionKey(requestedSessionKey)
        ? resolveAgentIdFromSessionKey(requestedSessionKey)
        : void 0;
    const { agentId: resolvedAgentId, cfg: runtimeConfig } = resolveCronAgent(
      requestedAgentId ?? derivedAgentId,
    );
    const agentId = resolvedAgentId || void 0;
    const resolvedSessionKey = agentId
      ? resolveCronSessionKey({
          runtimeConfig,
          agentId,
          requestedSessionKey,
        })
      : void 0;
    return {
      runtimeConfig,
      agentId,
      sessionKey:
        resolvedSessionKey && runtimeConfig.session?.scope === "global"
          ? resolveEventSessionKey(
              resolvedSessionKey,
              runtimeConfig.session?.mainKey,
              runtimeConfig.session?.scope,
            )
          : resolvedSessionKey,
    };
  };
  const resolveCronHeartbeatOverride = (paramsLocal) => {
    if (!paramsLocal.heartbeat) return;
    const agentEntry =
      paramsLocal.agentId !== void 0
        ? findAgentEntry(paramsLocal.runtimeConfig, paramsLocal.agentId)
        : void 0;
    const agentHeartbeat =
      agentEntry && typeof agentEntry === "object" ? agentEntry.heartbeat : void 0;
    return sanitizeCronHeartbeatOverride({
      ...paramsLocal.runtimeConfig.agents?.defaults?.heartbeat,
      ...agentHeartbeat,
      ...paramsLocal.heartbeat,
    });
  };
  const defaultAgentId = resolveDefaultAgentId(params.cfg);
  const resolveSessionStorePath = (agentId) =>
    resolveStorePath(params.cfg.session?.store, { agentId: agentId ?? defaultAgentId });
  const sessionStorePath = resolveSessionStorePath(defaultAgentId);
  const triggerEvaluator =
    params.cfg.cron?.triggers?.enabled === true
      ? createCronTriggerEvaluator({ config: params.cfg })
      : void 0;
  const runCronChangedHook = (evt) => {
    const hookRunner = getGlobalHookRunner();
    if (!hookRunner?.hasHooks("cron_changed")) return;
    const hookCtx = {
      config: getRuntimeConfig(),
      getCron: () => cron,
    };
    runWithGatewayIndependentRootWorkAdmission(async () => {
      await hookRunner.runCronChanged(evt, hookCtx);
    }).catch((err) => {
      cronLogger.warn(
        {
          err: formatErrorMessage(err),
          jobId: evt.jobId,
        },
        "cron_changed hook failed",
      );
    });
  };
  const exitWatchersRef = { current: void 0 };
  let exitWatcherReconciliations = 0;
  let exitWatcherGeneration = 0;
  const reconcileExitWatchers = async () => {
    const generation = exitWatcherGeneration;
    exitWatcherReconciliations += 1;
    try {
      if (!exitWatchersRef.current) return;
      const result = await cron.list({ includeDisabled: true });
      if (generation !== exitWatcherGeneration) return;
      const jobs = Array.isArray(result) ? result : result.jobs;
      reconcileCronExitWatchers({
        cronEnabled,
        exitWatchers: exitWatchersRef.current,
        jobs,
      });
    } catch (err) {
      cronLogger.warn({ err: String(err) }, "cron-exit: reconcile failed");
    } finally {
      exitWatcherReconciliations -= 1;
    }
  };
  const broadcastCronBoundSessionChanges = (evt) => {
    const job = evt.job ?? cron.getJob(evt.jobId);
    if (!job) return;
    const boundKeys = resolveCronJobBoundSessionKeys(job, {
      cfg: getRuntimeConfig(),
      defaultAgentId: cron.getDefaultAgentId(),
    });
    for (const sessionKey of boundKeys) {
      const sessionRow = loadGatewaySessionRow(sessionKey);
      params.broadcast(
        "sessions.changed",
        {
          sessionKey,
          reason: "cron-binding",
          ts: Date.now(),
          ...(sessionRow ? buildGatewaySessionEventFields({ sessionRow }) : {}),
        },
        { dropIfSlow: true },
      );
    }
  };
  const cron = new CronService({
    storePath,
    cronEnabled,
    cronConfig: params.cfg.cron,
    ...(triggerEvaluator
      ? {
          evaluateCronTrigger: ({ job, script, state, abortSignal }) =>
            triggerEvaluator({
              jobId: job.id,
              agentId: job.agentId,
              script,
              state,
              toolsAllow: job.payload.kind === "agentTurn" ? job.payload.toolsAllow : void 0,
              abortSignal,
            }),
        }
      : {}),
    defaultAgentId,
    resolveSessionStorePath,
    sessionStorePath,
    enqueueSystemEvent: (text, opts) => {
      const { sessionKey } = resolveCronTarget(opts);
      if (!sessionKey) throw new Error("Cron system event target did not resolve a session key.");
      const event = enqueueSystemEventEntry(text, {
        sessionKey,
        contextKey: opts?.contextKey,
        deliveryContext: opts?.deliveryContext,
      });
      return event
        ? {
            accepted: true,
            remove: () => consumeSelectedSystemEventEntries(sessionKey, [event]).length > 0,
          }
        : { accepted: false };
    },
    resolveOriginDeliveryContext: (opts) => {
      const { runtimeConfig, sessionKey } = resolveCronTarget({
        ...opts,
        preserveUntargeted: true,
      });
      if (!sessionKey) return;
      return resolveCronStoredDeliveryContext({
        cfg: runtimeConfig,
        sessionKey,
      });
    },
    requestHeartbeat: (opts) => {
      const { agentId, sessionKey } = resolveCronTarget({
        ...opts,
        preserveUntargeted: true,
      });
      requestHeartbeat({
        source: opts?.source ?? "cron",
        intent: opts?.intent ?? "event",
        reason: opts?.reason,
        agentId,
        sessionKey,
        heartbeat: sanitizeCronHeartbeatOverride(opts?.heartbeat),
      });
    },
    runHeartbeatOnce: async (opts) => {
      const { runtimeConfig, agentId, sessionKey } = resolveCronTarget({
        ...opts,
        preserveUntargeted: true,
      });
      return await runHeartbeatOnce({
        cfg: runtimeConfig,
        source: opts?.source ?? "cron",
        intent: opts?.intent ?? "event",
        reason: opts?.reason,
        agentId,
        sessionKey,
        heartbeat: resolveCronHeartbeatOverride({
          runtimeConfig,
          agentId,
          heartbeat: opts?.heartbeat,
        }),
        deps: {
          ...params.deps,
          runtime: defaultRuntime,
        },
      });
    },
    runIsolatedAgentJob: async ({
      job,
      message,
      abortSignal,
      onExecutionStarted,
      onExecutionPhase,
      onLaneWait,
    }) => {
      const { agentId, cfg: runtimeConfig } = resolveCronAgent(job.agentId);
      const sessionKey = resolveCronSessionTargetSessionKey(job.sessionTarget) ?? `cron:${job.id}`;
      try {
        return await runCronIsolatedAgentTurn({
          cfg: runtimeConfig,
          deps: params.deps,
          job,
          message,
          abortSignal,
          onExecutionStarted,
          onExecutionPhase,
          onLaneWait,
          agentId,
          sessionKey,
          lane: "cron",
        });
      } finally {
        await cleanupBrowserSessionsForLifecycleEnd({
          sessionKeys: [sessionKey],
          onWarn: (msg) => cronLogger.warn({ jobId: job.id }, msg),
        });
      }
    },
    runCommandJob: async ({ job, abortSignal }) => {
      const result = await runCronCommandJob({
        job,
        abortSignal,
        nowMs: Date.now,
      });
      const plan = resolveCronDeliveryPlan(job);
      const deliveryTrace = {
        intended: pickDefined(
          {
            channel: plan.channel,
            to: plan.to,
            accountId: plan.accountId,
            threadId: plan.threadId,
            source: "explicit",
          },
          ["channel", "to", "accountId", "threadId", "source"],
        ),
      };
      if (typeof result.summary === "string" && isSilentReplyText(result.summary, "NO_REPLY")) {
        const { summary: _summary, ...silentResult } = result;
        return {
          ...silentResult,
          deliveryAttempted: false,
          delivered: false,
          delivery: deliveryTrace,
        };
      }
      if (
        !(plan.mode === "announce" && typeof result.summary === "string" && result.summary.trim())
      )
        return {
          ...result,
          deliveryAttempted: false,
          delivered: false,
          delivery: deliveryTrace,
        };
      const message = isCommandCronJob(job)
        ? redactCronCommandSummaryForExternalDelivery(result.summary)
        : result.summary;
      if (typeof message !== "string")
        return {
          ...result,
          deliveryAttempted: false,
          delivered: false,
          delivery: deliveryTrace,
        };
      const { agentId, cfg: runtimeConfig } = resolveCronAgent(job.agentId);
      try {
        await sendCronAnnouncePayloadStrict({
          deps: params.deps,
          cfg: runtimeConfig,
          agentId,
          jobId: job.id,
          target: {
            channel: plan.channel,
            to: plan.to,
            accountId: plan.accountId,
            sessionKey: resolveCronDeliverySessionKey(job),
          },
          message,
          abortSignal: abortSignal ?? new AbortController().signal,
        });
        return {
          ...result,
          deliveryAttempted: true,
          delivered: true,
          delivery: {
            ...deliveryTrace,
            delivered: true,
          },
        };
      } catch (err) {
        const error = formatErrorMessage(err);
        cronLogger.warn(
          {
            jobId: job.id,
            err: error,
          },
          "cron: command delivery failed",
        );
        return {
          ...result,
          status: job.delivery?.bestEffort ? result.status : "error",
          error: job.delivery?.bestEffort ? result.error : error,
          deliveryAttempted: true,
          delivered: false,
          delivery: {
            ...deliveryTrace,
            delivered: false,
            resolved: {
              channel: plan.channel,
              to: plan.to,
              accountId: plan.accountId,
              threadId: plan.threadId,
              source: "explicit",
              ok: false,
              error,
            },
          },
        };
      }
    },
    cleanupTimedOutAgentRun: async ({ job, execution }) => {
      if (!execution?.sessionId) return;
      const result = await abortAndDrainEmbeddedAgentRun({
        sessionId: execution.sessionId,
        sessionKey: execution.sessionKey,
        settleMs: 15e3,
        forceClear: true,
        reason: "cron_timeout",
      });
      cronLogger.warn(
        {
          jobId: job.id,
          sessionId: execution.sessionId,
          sessionKey: execution.sessionKey,
          aborted: result.aborted,
          drained: result.drained,
          forceCleared: result.forceCleared,
        },
        "cron: cleaned up timed-out agent run",
      );
      await retireSessionMcpRuntime({
        sessionId: execution.sessionId,
        reason: "cron-timeout-cleanup",
        onError: (error, sid) => {
          cronLogger.warn(
            {
              jobId: job.id,
              sessionId: sid,
            },
            `cron: failed to retire MCP runtime for timed-out session: ${String(error)}`,
          );
        },
      }).catch(() => {});
    },
    onIsolatedAgentSetupTimeout: ({ job, error, timeoutMs }) => {
      cronLogger.warn(
        {
          jobId: job.id,
          jobName: job.name,
          timeoutMs,
          error,
        },
        "cron: isolated agent setup timed out before runner start; backing off job without gateway restart",
      );
    },
    sendCronFailureAlert: async ({ job, text, channel, to, mode, accountId }) =>
      await sendGatewayCronFailureAlert({
        deps: params.deps,
        logger: cronLogger,
        resolveCronAgent,
        webhookToken: params.cfg.cron?.webhookToken,
        job,
        text,
        channel,
        to,
        mode,
        accountId,
      }),
    log: getChildLogger({
      module: "cron",
      storePath,
    }),
    onEvent: (evt) => {
      bumpSessionAutomationVersion();
      params.broadcast("cron", evt, { dropIfSlow: true });
      const jobSnapshot = evt.job ?? cron.getJob(evt.jobId);
      const pluginJob = jobSnapshot ? toPluginCronJob(jobSnapshot) : void 0;
      const hookSummary =
        isCommandCronJob(jobSnapshot) && typeof evt.summary === "string"
          ? redactCronCommandSummaryForExternalDelivery(evt.summary)
          : evt.summary;
      const hookEvt = {
        action: evt.action,
        jobId: evt.jobId,
        ...(pluginJob ? { job: pluginJob } : {}),
        sessionTarget: jobSnapshot?.sessionTarget,
        agentId: jobSnapshot?.agentId,
        ...pickDefined(evt, [
          "runAtMs",
          "durationMs",
          "status",
          "error",
          "delivered",
          "deliveryStatus",
          "deliveryError",
          "sessionId",
          "sessionKey",
          "runId",
          "nextRunAtMs",
          "model",
          "provider",
        ]),
        ...(hookSummary !== void 0 ? { summary: hookSummary } : {}),
      };
      runCronChangedHook(hookEvt);
      if (evt.action === "added" || evt.action === "updated" || evt.action === "removed") {
        broadcastCronBoundSessionChanges(evt);
        reconcileExitWatchers();
      } else if (evt.action === "finished") {
        if ((evt.job ?? cron.getJob(evt.jobId))?.enabled === false)
          broadcastCronBoundSessionChanges(evt);
      }
      if (evt.action === "finished")
        dispatchGatewayCronFinishedNotifications({
          evt,
          job: evt.job ?? cron.getJob(evt.jobId),
          deps: params.deps,
          logger: cronLogger,
          resolveCronAgent,
          webhookToken: params.cfg.cron?.webhookToken,
          globalFailureDestination: params.cfg.cron?.failureDestination,
        });
    },
  });
  exitWatchersRef.current = createCronExitWatchers({
    getProcessSupervisor,
    persistCompletion: async (jobId) =>
      await runWithGatewayIndependentRootWorkAdmission(async () => {
        await cron.update(jobId, { enabled: false });
      }),
    fireOnExit: (job, exit) =>
      runWithGatewayIndependentRootWorkAdmission(async () =>
        fireOnExitJob(job, exit, {
          run: (jobId, payload) => cron.run(jobId, "force", payload ? { payload } : void 0),
        }),
      ),
    logger: cronLogger,
  });
  const getCronSuspensionBlockerCount = cron.getSuspensionBlockerCount.bind(cron);
  cron.getSuspensionBlockerCount = () =>
    getCronSuspensionBlockerCount() +
    exitWatcherReconciliations +
    (exitWatchersRef.current?.activeJobIds().length ?? 0);
  const stopExitWatchers = () => {
    exitWatcherGeneration += 1;
    exitWatchersRef.current?.cancelAll();
  };
  const automationSource = {
    getJobs: () => cron.getLoadedJobs(),
    getDefaultAgentId: () => cron.getDefaultAgentId(),
  };
  const automationEpoch = claimSessionAutomationEpoch();
  const stopCron = cron.stop.bind(cron);
  cron.stop = () => {
    stopCron();
    stopExitWatchers();
    unregisterSessionAutomationSource(automationSource);
  };
  const startCron = cron.start.bind(cron);
  cron.start = async () => {
    await startCron();
    registerSessionAutomationSource(automationSource, automationEpoch);
    params.broadcast(
      "sessions.changed",
      {
        reason: "cron-bindings-loaded",
        ts: Date.now(),
      },
      { dropIfSlow: true },
    );
  };
  return {
    cron,
    storePath,
    cronEnabled,
    reconcileExitWatchers,
    stopExitWatchers,
  };
}
//#endregion
export { fireOnExitJob as n, buildGatewayCronService as t };
