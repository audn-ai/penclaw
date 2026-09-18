import { randomUUID } from "node:crypto";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import {
  c as timeoutErrorMessage,
  i as normalizeCronRunErrorText,
} from "./execution-errors-F28fMPXG.js";
import { d as resolveFailoverReasonFromError } from "./failover-error-CYvhrluQ.js";
import {
  _ as cronTaskRecordStoreKey,
  g as cronRunStatusToTaskStatus,
  h as cronRunLogEntryToTaskDetail,
  v as cronTaskRecordToRunLogEntry,
  y as cronTaskRecordToTriggerEval,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import { u as cronStoreKey } from "./row-codec-CaYtaRTs.js";
import { t as createCronExecutionId } from "./run-id-kGde0n7U.js";
import { d as resolveAgentIdFromSessionKey } from "./session-key-druuY-GG.js";
import { t as resolveCronAgentSessionKey } from "./session-key-MFREoGog.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import {
  c as finalizeTaskRunById,
  f as listTaskRecordsUnsorted,
  l as finalizeTaskRunByRunId,
  o as createRunningTaskRun,
  u as findTaskByRunId,
} from "./task-executor-BF9XEI4q.js";
//#region src/cron/task-run-event-codec.ts
/** Write-side cron codec: converts a finished service event into a run-history entry.
 * Kept separate from task-run-detail.ts so the read/history codec stays free of the
 * agents failover tree (which transitively pulls the sandbox module graph). */
/** Uses execution timing for one timestamp shared by ledger and legacy dual-write paths. */
function resolveCronRunEndedAt(event, fallbackTs) {
  if (
    typeof event.runAtMs === "number" &&
    Number.isFinite(event.runAtMs) &&
    typeof event.durationMs === "number" &&
    Number.isFinite(event.durationMs)
  )
    return event.runAtMs + event.durationMs;
  return fallbackTs;
}
/** Builds the legacy run-history record from one finished service event. */
function cronRunLogEntryFromEvent(event, fallbackTs) {
  const errorReason = resolveFailoverReasonFromError(event.error, event.provider) ?? void 0;
  return {
    ts: resolveCronRunEndedAt(event, fallbackTs),
    jobId: event.jobId,
    action: "finished",
    status: event.status,
    error: event.error,
    errorReason,
    summary: event.summary,
    diagnostics: event.diagnostics,
    delivered: event.delivered,
    deliveryStatus: event.deliveryStatus,
    deliveryError: event.deliveryError,
    failureNotificationDelivery: event.failureNotificationDelivery,
    delivery: event.delivery,
    sessionId: event.sessionId,
    sessionKey: event.sessionKey,
    runId: event.runId,
    runAtMs: event.runAtMs,
    durationMs: event.durationMs,
    nextRunAtMs: event.nextRunAtMs,
    triggerFired: event.triggerFired,
    model: event.model,
    provider: event.provider,
    usage: event.usage,
  };
}
//#endregion
//#region src/cron/service/task-runs.ts
/** Detached task-ledger integration for cron runs. */
/** Converts cron ids into bounded session-key path segments with a fallback for empty input. */
function normalizeCronLaneSegment(value, fallback) {
  return (
    normalizeOptionalLowercaseString(value)
      ?.replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 64) || fallback
  );
}
/** Builds the main-session child key used to isolate one cron run's task transcript. */
function resolveMainSessionCronRunSessionKey(job, startedAt) {
  const explicitAgentId = job.agentId?.trim();
  return `agent:${normalizeAgentId(explicitAgentId || resolveAgentIdFromSessionKey(job.sessionKey))}:cron:${normalizeCronLaneSegment(job.id, "job")}:run:${normalizeCronLaneSegment(String(Math.max(0, Math.floor(startedAt))), "run")}`;
}
function resolveCronTaskChildSessionKey(params) {
  if (params.job.sessionTarget === "main")
    return resolveMainSessionCronRunSessionKey(params.job, params.startedAt);
  if (params.job.sessionTarget === "current")
    return resolveCronAgentSessionKey({
      sessionKey: `cron:${params.job.id}`,
      agentId: params.job.agentId ?? params.state.deps.defaultAgentId ?? "main",
    });
  const explicitSessionKey = params.job.sessionKey?.trim();
  if (explicitSessionKey) return explicitSessionKey;
  if (params.job.sessionTarget !== "isolated") return;
  return resolveCronAgentSessionKey({
    sessionKey: `cron:${params.job.id}`,
    agentId: params.job.agentId ?? params.state.deps.defaultAgentId ?? "main",
  });
}
/** Creates a best-effort detached task ledger row for a cron run. */
function tryCreateCronTaskRun(params) {
  const runId = createCronTaskRunId(
    params.job.id,
    params.runIdStartedAt ?? params.startedAt,
    params.publicRunId,
  );
  return tryCreateCronTaskRunRecord({
    state: params.state,
    job: params.job,
    jobId: params.job.id,
    startedAt: params.startedAt,
    runId,
  });
}
function createCronTaskRunId(jobId, reservationAt, publicRunId) {
  const discriminator = publicRunId?.trim() || randomUUID();
  return `${createCronExecutionId(jobId, reservationAt)}:${discriminator}`;
}
function findLatestCronTaskRunForRecovery(jobId, reservationAt, storeKey) {
  const reservationRunId = createCronExecutionId(jobId, reservationAt);
  const prefix = `${reservationRunId}:`;
  return listTaskRecordsUnsorted()
    .filter((task) => {
      if (task.runtime !== "cron" || task.sourceId !== jobId) return false;
      const taskStoreKey = cronTaskRecordStoreKey(task);
      if (taskStoreKey === void 0) return task.runId === reservationRunId;
      return (
        taskStoreKey === storeKey &&
        (task.runId === reservationRunId || task.runId?.startsWith(prefix))
      );
    })
    .toSorted(
      (left, right) =>
        Number(left.endedAt !== void 0) - Number(right.endedAt !== void 0) ||
        (right.endedAt ?? right.lastEventAt ?? right.createdAt) -
          (left.endedAt ?? left.lastEventAt ?? left.createdAt) ||
        right.createdAt - left.createdAt ||
        right.taskId.localeCompare(left.taskId),
    )[0];
}
/** Finds the unique task identity owned by one persisted cron reservation. */
function tryFindCronTaskRunIdForRecovery(state, jobId, startedAt) {
  try {
    return findLatestCronTaskRunForRecovery(jobId, startedAt, cronStoreKey(state.deps.storePath))
      ?.runId;
  } catch (error) {
    state.deps.log.warn(
      {
        jobId,
        error,
      },
      "cron: failed to read task ledger recovery record",
    );
    return;
  }
}
/** Finds a completed canonical cron row for startup crash recovery. */
function tryFindFinalizedCronTaskRun(state, jobId, startedAt) {
  try {
    const task = findLatestCronTaskRunForRecovery(
      jobId,
      startedAt,
      cronStoreKey(state.deps.storePath),
    );
    if (task?.runtime !== "cron" || task.sourceId !== jobId || task.endedAt === void 0) return;
    const entry = cronTaskRecordToRunLogEntry(task);
    if (!entry?.status) return;
    const triggerEval = cronTaskRecordToTriggerEval(task);
    return {
      entry: {
        ...entry,
        status: entry.status,
      },
      ...(triggerEval ? { triggerEval } : {}),
    };
  } catch (error) {
    state.deps.log.warn(
      {
        jobId,
        error,
      },
      "cron: failed to read finalized task ledger record",
    );
    return;
  }
}
function tryCreateCronTaskRunRecord(params) {
  try {
    if (
      !createRunningTaskRun({
        runtime: "cron",
        sourceId: params.jobId,
        ownerKey: "",
        scopeKind: "system",
        childSessionKey:
          params.childSessionKey ??
          (params.job
            ? resolveCronTaskChildSessionKey({
                state: params.state,
                job: params.job,
                startedAt: params.startedAt,
              })
            : void 0),
        agentId:
          params.job?.agentId ??
          resolveAgentIdFromSessionKey(params.childSessionKey) ??
          params.state.deps.defaultAgentId ??
          "main",
        runId: params.runId,
        label: params.job?.name,
        task: params.job?.name || params.jobId,
        deliveryStatus: "not_applicable",
        notifyPolicy: "silent",
        startedAt: params.startedAt,
        lastEventAt: params.startedAt,
        progressSummary: "Running cron job.",
        detail: { storeKey: cronStoreKey(params.state.deps.storePath) },
      })
    ) {
      params.state.deps.log.warn(
        { jobId: params.jobId },
        "cron: task ledger record was not persisted",
      );
      return;
    }
    return params.runId;
  } catch (error) {
    params.state.deps.log.warn(
      {
        jobId: params.jobId,
        error,
      },
      "cron: failed to create task ledger record",
    );
    return;
  }
}
/** Finalizes executions that intentionally do not produce a run-history row. */
function tryFinishCronTaskRunWithoutHistory(state, result) {
  if (!result.taskRunId) return;
  const error = result.status === "error" ? normalizeCronRunErrorText(result.error) : void 0;
  try {
    finalizeTaskRunByRunId({
      runId: result.taskRunId,
      runtime: "cron",
      status:
        result.status === "ok" || result.status === "skipped"
          ? "succeeded"
          : error === timeoutErrorMessage()
            ? "timed_out"
            : "failed",
      endedAt: result.endedAt,
      lastEventAt: result.endedAt,
      error,
      terminalSummary: result.summary,
      childSessionKey: result.childSessionKey,
    });
  } catch (cause) {
    state.deps.log.warn(
      {
        runId: result.taskRunId,
        jobStatus: result.status,
        error: cause,
      },
      "cron: failed to update task ledger record",
    );
  }
}
/** Finalizes the authoritative task row, creating one for terminal-only cron events. */
function tryFinishCronTaskRun(state, result) {
  const entry = cronRunLogEntryFromEvent(result.event, state.deps.nowMs());
  const startedAt = entry.runAtMs ?? entry.ts;
  const candidateRunId =
    result.taskRunId ?? createCronTaskRunId(entry.jobId, startedAt, entry.runId);
  try {
    const taskRunId =
      findTaskByRunId(candidateRunId)?.runtime === "cron"
        ? candidateRunId
        : tryCreateCronTaskRunRecord({
            state,
            job: result.job ?? result.event.job,
            jobId: entry.jobId,
            startedAt,
            runId: candidateRunId,
            childSessionKey: entry.sessionKey,
          });
    if (!taskRunId) return;
    const storeKey = cronStoreKey(state.deps.storePath);
    const legacyRecoveryRunId = createCronExecutionId(entry.jobId, startedAt);
    const detail = cronRunLogEntryToTaskDetail(entry, {
      storeKey,
      ...(result.triggerEval ? { triggerEval: result.triggerEval } : {}),
    });
    const finalize = (runId, status = cronRunStatusToTaskStatus(entry)) =>
      finalizeTaskRunByRunId({
        runId,
        runtime: "cron",
        status,
        endedAt: entry.ts,
        lastEventAt: entry.ts,
        error: entry.error,
        clearError: entry.error === void 0,
        terminalSummary: entry.summary ?? null,
        preserveTerminalSummary: true,
        childSessionKey: entry.sessionKey ?? null,
        detail,
      });
    let updated = finalize(taskRunId);
    if (updated.length === 0) {
      const existing = findTaskByRunId(taskRunId);
      if (existing?.runtime === "cron" && existing.status === "cancelled")
        updated = finalize(taskRunId, "cancelled");
      else if (
        existing?.runtime === "cron" &&
        (existing.status === "lost" ||
          (cronTaskRecordStoreKey(existing) === storeKey &&
            cronTaskRecordToRunLogEntry(existing) === null) ||
          (existing.detail === void 0 && existing.runId === legacyRecoveryRunId))
      ) {
        const recovered = finalizeTaskRunById({
          taskId: existing.taskId,
          status: cronRunStatusToTaskStatus(entry),
          childSessionKey: entry.sessionKey ?? null,
          endedAt: entry.ts,
          lastEventAt: entry.ts,
          error: entry.error,
          terminalSummary: entry.summary ?? null,
          preserveTerminalSummary: true,
          detail,
        });
        updated = recovered ? [recovered] : [];
      } else if (existing?.runtime === "cron") updated = finalize(taskRunId);
      else {
        const recreatedRunId = tryCreateCronTaskRunRecord({
          state,
          job: result.job ?? result.event.job,
          jobId: entry.jobId,
          startedAt,
          runId: taskRunId,
          childSessionKey: entry.sessionKey,
        });
        if (recreatedRunId) updated = finalize(recreatedRunId);
      }
    }
    if (updated.length === 0)
      state.deps.log.warn({ runId: taskRunId }, "cron: task ledger record was not finalized");
  } catch (error) {
    state.deps.log.warn(
      {
        runId: candidateRunId,
        jobStatus: entry.status,
        error,
      },
      "cron: failed to update task ledger record",
    );
  }
}
//#endregion
export {
  tryFindFinalizedCronTaskRun as a,
  tryFindCronTaskRunIdForRecovery as i,
  resolveMainSessionCronRunSessionKey as n,
  tryFinishCronTaskRun as o,
  tryCreateCronTaskRun as r,
  tryFinishCronTaskRunWithoutHistory as s,
  normalizeCronLaneSegment as t,
};
