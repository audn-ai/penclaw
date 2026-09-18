import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { i as formatLookupMiss } from "./error-format-CG7mpTEd.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { P as timestampMsToIsoString } from "./number-coercion-CJQ8TR--.js";
import { a as runSessionRegistryMaintenanceForStore } from "./sessions-CEG7v41b.js";
import { n as loadCronJobsStoreSync, s as resolveCronJobsStorePath } from "./store-D02kEgQU.js";
import "./config-BDv-QbJ6.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { i as resolveAllAgentSessionStoreTargetsSync } from "./targets-CjMfpXbt.js";
import { t as cancelDetachedTaskRunById } from "./task-executor-BF9XEI4q.js";
import "./runtime-internal-B2_XwK02.js";
import {
  G as listTaskFlowRecords,
  M as isTaskFlowCancellationPending,
  Q as updateFlowRecordByIdExpectedRevision,
  R as deleteTaskFlowRecordById,
  U as getTaskFlowById,
  W as getTaskFlowRegistryRestoreFailure,
  c as getTaskById,
  g as listTasksForFlowId,
  k as updateTaskNotifyPolicyById,
} from "./task-registry-C44yDrOW.js";
import {
  i as summarizeRetainedLostTaskAuditFindings,
  n as listTaskAuditFindings,
} from "./task-registry.audit-DiY0ICYg.js";
import {
  a as getInspectableTaskRegistrySummary,
  c as reconcileInspectableTasks,
  d as runTaskRegistryMaintenance,
  i as getInspectableTaskAuditSummary,
  l as reconcileTaskLookupToken,
  o as getTaskRegistryMaintenanceDiagnostics,
  s as previewTaskRegistryMaintenance,
  t as configureTaskRegistryMaintenance,
} from "./task-registry.maintenance-_DeiCoga.js";
import { n as summarizeTaskRecords } from "./task-registry.summary-BwpoHlXv.js";
import { t as normalizeCronLaneSegment } from "./task-runs-d9-z-gdz.js";
import {
  i as summarizeTaskFlowAuditFindings,
  n as buildTaskSystemAuditJsonPayload,
  r as listTaskFlowAuditFindings,
  t as buildTaskSystemAuditFindings,
} from "./tasks-audit-system-YYvczSJm.js";
import { n as isRich, r as theme } from "./theme-vjDs9tao.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/tasks/task-flow-registry.maintenance.ts
const TASK_FLOW_RETENTION_MS = 10080 * 6e4;
function assertTaskFlowRegistryMaintenanceReady() {
  const restoreFailure = getTaskFlowRegistryRestoreFailure();
  if (restoreFailure)
    throw new Error(
      `Task-flow registry restore failed: ${restoreFailure}. Refusing task maintenance.`,
    );
}
function isTerminalFlow(flow) {
  return (
    flow.status === "succeeded" ||
    flow.status === "blocked" ||
    flow.status === "failed" ||
    flow.status === "cancelled" ||
    flow.status === "lost"
  );
}
function hasActiveLinkedTasks(flowId) {
  return listTasksForFlowId(flowId).some(isTaskFlowCancellationPending);
}
function resolveTerminalAt(flow) {
  return flow.endedAt ?? flow.updatedAt ?? flow.createdAt;
}
function shouldPruneFlow(flow, now) {
  if (!isTerminalFlow(flow)) return false;
  if (hasActiveLinkedTasks(flow.flowId)) return false;
  return now - resolveTerminalAt(flow) >= TASK_FLOW_RETENTION_MS;
}
function shouldFinalizeCancelledFlow(flow) {
  if (flow.syncMode !== "managed") return false;
  if (flow.cancelRequestedAt == null || isTerminalFlow(flow)) return false;
  return !hasActiveLinkedTasks(flow.flowId);
}
function finalizeCancelledFlow(flow, now) {
  let current = flow;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const endedAt = Math.max(now, current.updatedAt, current.cancelRequestedAt ?? now);
    const result = updateFlowRecordByIdExpectedRevision({
      flowId: current.flowId,
      expectedRevision: current.revision,
      patch: {
        status: "cancelled",
        blockedTaskId: null,
        blockedSummary: null,
        waitJson: null,
        endedAt,
        updatedAt: endedAt,
      },
    });
    if (result.applied) return true;
    if (result.reason === "not_found" || !result.current) return false;
    current = result.current;
    if (!shouldFinalizeCancelledFlow(current)) return false;
  }
  return false;
}
function shouldRepairTerminalMirroredFlowTimestamp(flow) {
  if (flow.syncMode !== "task_mirrored" || !isTerminalFlow(flow)) return false;
  if (flow.endedAt == null || flow.endedAt < flow.createdAt) return false;
  return flow.updatedAt > flow.endedAt;
}
function repairTerminalMirroredFlowTimestamp(flow) {
  let current = flow;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    if (!shouldRepairTerminalMirroredFlowTimestamp(current)) return false;
    const result = updateFlowRecordByIdExpectedRevision({
      flowId: current.flowId,
      expectedRevision: current.revision,
      patch: { updatedAt: current.endedAt },
    });
    if (result.applied) return true;
    if (result.reason === "not_found" || !result.current) return false;
    current = result.current;
  }
  return false;
}
function getInspectableTaskFlowAuditSummary() {
  return summarizeTaskFlowAuditFindings(listTaskFlowAuditFindings());
}
function previewTaskFlowRegistryMaintenance() {
  const now = Date.now();
  let reconciled = 0;
  let pruned = 0;
  for (const flow of listTaskFlowRecords()) {
    if (shouldRepairTerminalMirroredFlowTimestamp(flow)) {
      reconciled += 1;
      continue;
    }
    if (shouldFinalizeCancelledFlow(flow)) {
      reconciled += 1;
      continue;
    }
    if (shouldPruneFlow(flow, now)) pruned += 1;
  }
  return {
    reconciled,
    pruned,
  };
}
async function runTaskFlowRegistryMaintenance() {
  const now = Date.now();
  let reconciled = 0;
  let pruned = 0;
  for (const flow of listTaskFlowRecords()) {
    const current = getTaskFlowById(flow.flowId);
    if (!current) continue;
    if (shouldRepairTerminalMirroredFlowTimestamp(current)) {
      if (repairTerminalMirroredFlowTimestamp(current)) reconciled += 1;
      continue;
    }
    if (shouldFinalizeCancelledFlow(current)) {
      if (finalizeCancelledFlow(current, now)) reconciled += 1;
      continue;
    }
    if (shouldPruneFlow(current, now) && deleteTaskFlowRecordById(current.flowId)) pruned += 1;
  }
  return {
    reconciled,
    pruned,
  };
}
//#endregion
//#region src/commands/tasks.ts
const RUNTIME_PAD = 8;
const STATUS_PAD = 10;
const DELIVERY_PAD = 14;
const ID_PAD = 10;
const RUN_PAD = 10;
const SESSION_REGISTRY_RETENTION_MS = 10080 * 6e4;
const info = theme.info;
function formatTaskLookupMiss(lookup) {
  return formatLookupMiss({
    noun: "Task",
    value: lookup,
    listCommand: "openclaw tasks list",
    valueLabel: "task id",
  });
}
function formatTaskTimestamp(value) {
  return timestampMsToIsoString(value) ?? "n/a";
}
async function loadTaskCancelConfig() {
  return getRuntimeConfig();
}
async function tryCancelGatewayOwnedTaskViaGateway(task) {
  if (task.runtime !== "cron" && task.runtime !== "acp") return null;
  try {
    const { callGateway } = await import("./call-BtFiTrFI.js");
    return await callGateway({
      method: "tasks.cancel",
      params: { taskId: task.taskId },
      timeoutMs: 5e3,
    });
  } catch (error) {
    if (task.runtime === "acp")
      return {
        found: true,
        cancelled: false,
        reason: `ACP task cancellation requires the live Gateway tasks.cancel path: ${error instanceof Error ? error.message : String(error)}`,
        task,
      };
    return null;
  }
}
function configureTaskMaintenanceFromConfig() {
  configureTaskRegistryMaintenance();
}
function resolveExplicitCronSessionSegment(sessionKey) {
  return /^(?:agent:[^:]+:)?cron:([^:]+)$/u.exec(sessionKey?.trim() ?? "")?.[1]?.toLowerCase();
}
function readRunningCronJobIds() {
  try {
    const runningJobs = loadCronJobsStoreSync(
      resolveCronJobsStorePath(getRuntimeConfig().cron?.store),
    ).jobs.filter((job) => typeof job.state?.runningAtMs === "number");
    return {
      ids: new Set(
        runningJobs.flatMap((job) => [
          job.id.toLowerCase(),
          normalizeCronLaneSegment(job.id, "job"),
          ...(job.sessionTarget !== "main" && job.sessionKey
            ? [resolveExplicitCronSessionSegment(job.sessionKey)].filter(
                (segment) => segment !== void 0,
              )
            : []),
        ]),
      ),
      count: runningJobs.length,
    };
  } catch {
    return {
      ids: /* @__PURE__ */ new Set(),
      count: 0,
    };
  }
}
async function runSessionRegistryMaintenance(params) {
  const cfg = getRuntimeConfig();
  const runningCronJobs = readRunningCronJobIds();
  const stores = [];
  for (const target of resolveAllAgentSessionStoreTargetsSync(cfg)) {
    const result = await runSessionRegistryMaintenanceForStore({
      apply: params.apply,
      retentionMs: SESSION_REGISTRY_RETENTION_MS,
      runningCronJobIds: runningCronJobs.ids,
      storePath: target.storePath,
    });
    stores.push({
      agentId: target.agentId,
      storePath: target.storePath,
      beforeCount: result.beforeCount,
      afterCount: result.afterCount,
      pruned: result.pruned,
      preservedRunning: result.preservedRunning,
    });
  }
  return {
    retentionMs: SESSION_REGISTRY_RETENTION_MS,
    runningCronJobs: runningCronJobs.count,
    pruned: stores.reduce((total, store) => total + store.pruned, 0),
    stores,
  };
}
function truncate(value, maxChars) {
  if (value.length <= maxChars) return value;
  return maxChars <= 0 ? "" : `${truncateUtf16Safe(value, maxChars - 1)}…`;
}
function shortToken(value, maxChars = ID_PAD) {
  const trimmed = normalizeOptionalString(value);
  if (!trimmed) return "n/a";
  return truncate(trimmed, maxChars);
}
function formatTaskStatusCell(status, rich) {
  const padded = status.padEnd(STATUS_PAD);
  if (!rich) return padded;
  if (status === "succeeded") return theme.success(padded);
  if (status === "failed" || status === "lost" || status === "timed_out")
    return theme.error(padded);
  if (status === "running") return theme.accentBright(padded);
  return theme.muted(padded);
}
function formatTaskRows(tasks, rich) {
  const header = [
    "Task".padEnd(ID_PAD),
    "Kind".padEnd(RUNTIME_PAD),
    "Status".padEnd(STATUS_PAD),
    "Delivery".padEnd(DELIVERY_PAD),
    "Run".padEnd(RUN_PAD),
    "Child Session",
    "Summary",
  ].join(" ");
  const lines = [rich ? theme.heading(header) : header];
  for (const task of tasks) {
    const summary = truncate(
      normalizeOptionalString(task.terminalSummary) ||
        normalizeOptionalString(task.progressSummary) ||
        normalizeOptionalString(task.label) ||
        task.task.trim(),
      80,
    );
    const line = [
      shortToken(task.taskId).padEnd(ID_PAD),
      task.runtime.padEnd(RUNTIME_PAD),
      formatTaskStatusCell(task.status, rich),
      task.deliveryStatus.padEnd(DELIVERY_PAD),
      shortToken(task.runId, RUN_PAD).padEnd(RUN_PAD),
      truncate(normalizeOptionalString(task.childSessionKey) || "n/a", 36).padEnd(36),
      summary,
    ].join(" ");
    lines.push(line.trimEnd());
  }
  return lines;
}
function formatTaskListSummary(tasks) {
  const summary = summarizeTaskRecords(tasks);
  return `${summary.byStatus.queued} queued · ${summary.byStatus.running} running · ${summary.failures} issues`;
}
function formatAgeMs(ageMs) {
  if (typeof ageMs !== "number" || ageMs < 1e3) return "fresh";
  const totalSeconds = Math.floor(ageMs / 1e3);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (days > 0) return `${days}d${hours}h`;
  if (hours > 0) return `${hours}h${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${totalSeconds}s`;
}
function formatAuditRows(findings, rich) {
  const header = [
    "Scope".padEnd(8),
    "Severity".padEnd(8),
    "Code".padEnd(22),
    "Item".padEnd(ID_PAD),
    "Status".padEnd(STATUS_PAD),
    "Age".padEnd(8),
    "Detail",
  ].join(" ");
  const lines = [rich ? theme.heading(header) : header];
  for (const finding of findings) {
    const severity = finding.severity.padEnd(8);
    const status = formatTaskStatusCell(finding.status ?? "n/a", rich);
    const severityCell = !rich
      ? severity
      : finding.severity === "error"
        ? theme.error(severity)
        : theme.warn(severity);
    const scope = finding.kind === "task" ? "Task" : "TaskFlow";
    lines.push(
      [
        scope.padEnd(8),
        severityCell,
        finding.code.padEnd(22),
        shortToken(finding.token).padEnd(ID_PAD),
        status,
        formatAgeMs(finding.ageMs).padEnd(8),
        truncate(finding.detail, 88),
      ]
        .join(" ")
        .trimEnd(),
    );
  }
  return lines;
}
function toSystemAuditFindings(params) {
  return buildTaskSystemAuditFindings({
    taskFindings: listTaskAuditFindings({ tasks: reconcileInspectableTasks() }),
    flowFindings: listTaskFlowAuditFindings(),
    severityFilter: params.severityFilter,
    codeFilter: params.codeFilter,
  });
}
/** Lists background tasks with optional runtime/status filters. */
async function tasksListCommand(opts, runtime) {
  const runtimeFilter = normalizeOptionalString(opts.runtime);
  const statusFilter = normalizeOptionalString(opts.status);
  const tasks = reconcileInspectableTasks().filter((task) => {
    if (runtimeFilter && task.runtime !== runtimeFilter) return false;
    if (statusFilter && task.status !== statusFilter) return false;
    return true;
  });
  if (opts.json) {
    runtime.log(
      JSON.stringify(
        {
          count: tasks.length,
          runtime: runtimeFilter ?? null,
          status: statusFilter ?? null,
          tasks,
        },
        null,
        2,
      ),
    );
    return;
  }
  runtime.log(info(`Background tasks: ${tasks.length}`));
  runtime.log(info(`Task pressure: ${formatTaskListSummary(tasks)}`));
  if (runtimeFilter) runtime.log(info(`Runtime filter: ${runtimeFilter}`));
  if (statusFilter) runtime.log(info(`Status filter: ${statusFilter}`));
  if (tasks.length === 0) {
    runtime.log(
      `No background tasks found. Run ${formatCliCommand("openclaw tasks audit")} to check for stale task state.`,
    );
    return;
  }
  const rich = isRich();
  for (const line of formatTaskRows(tasks, rich)) runtime.log(line);
}
/** Shows one task record by id or lookup token. */
async function tasksShowCommand(opts, runtime) {
  const task = reconcileTaskLookupToken(opts.lookup);
  if (!task) {
    runtime.error(formatTaskLookupMiss(opts.lookup));
    runtime.exit(1);
    return;
  }
  if (opts.json) {
    runtime.log(JSON.stringify(task, null, 2));
    return;
  }
  const lines = [
    "Background task:",
    `taskId: ${task.taskId}`,
    `kind: ${task.runtime}`,
    `sourceId: ${task.sourceId ?? "n/a"}`,
    `status: ${task.status}`,
    `result: ${task.terminalOutcome ?? "n/a"}`,
    `delivery: ${task.deliveryStatus}`,
    `notify: ${task.notifyPolicy}`,
    `ownerKey: ${task.ownerKey}`,
    `childSessionKey: ${task.childSessionKey ?? "n/a"}`,
    `parentTaskId: ${task.parentTaskId ?? "n/a"}`,
    `agentId: ${task.agentId ?? "n/a"}`,
    `runId: ${task.runId ?? "n/a"}`,
    `label: ${task.label ?? "n/a"}`,
    `task: ${task.task}`,
    `createdAt: ${formatTaskTimestamp(task.createdAt)}`,
    `startedAt: ${formatTaskTimestamp(task.startedAt)}`,
    `endedAt: ${formatTaskTimestamp(task.endedAt)}`,
    `lastEventAt: ${formatTaskTimestamp(task.lastEventAt)}`,
    `cleanupAfter: ${formatTaskTimestamp(task.cleanupAfter)}`,
    ...(task.error ? [`error: ${task.error}`] : []),
    ...(task.progressSummary ? [`progressSummary: ${task.progressSummary}`] : []),
    ...(task.terminalSummary ? [`terminalSummary: ${task.terminalSummary}`] : []),
  ];
  for (const line of lines) runtime.log(line);
}
/** Updates a task's notification policy. */
async function tasksNotifyCommand(opts, runtime) {
  const task = reconcileTaskLookupToken(opts.lookup);
  if (!task) {
    runtime.error(formatTaskLookupMiss(opts.lookup));
    runtime.exit(1);
    return;
  }
  const updated = updateTaskNotifyPolicyById({
    taskId: task.taskId,
    notifyPolicy: opts.notify,
  });
  if (!updated) {
    runtime.error(formatTaskLookupMiss(opts.lookup));
    runtime.exit(1);
    return;
  }
  runtime.log(`Updated ${updated.taskId} notify policy to ${updated.notifyPolicy}.`);
}
/** Cancels a detached task run by lookup token. */
async function tasksCancelCommand(opts, runtime) {
  const task = reconcileTaskLookupToken(opts.lookup);
  if (!task) {
    runtime.error(formatTaskLookupMiss(opts.lookup));
    runtime.exit(1);
    return;
  }
  const gatewayResult = await tryCancelGatewayOwnedTaskViaGateway(task);
  if (gatewayResult) {
    if (!gatewayResult.found) {
      runtime.error(gatewayResult.reason ?? formatTaskLookupMiss(opts.lookup));
      runtime.exit(1);
      return;
    }
    if (!gatewayResult.cancelled) {
      runtime.error(gatewayResult.reason ?? `Could not cancel task: ${opts.lookup}`);
      runtime.exit(1);
      return;
    }
    const updated = gatewayResult.task;
    runtime.log(
      `Cancelled ${updated?.taskId ?? updated?.id ?? task.taskId} (${updated?.runtime ?? task.runtime})${updated?.runId ? ` run ${updated.runId}` : ""}.`,
    );
    return;
  }
  const result = await cancelDetachedTaskRunById({
    cfg: await loadTaskCancelConfig(),
    taskId: task.taskId,
  });
  if (!result.found) {
    runtime.error(result.reason ?? formatTaskLookupMiss(opts.lookup));
    runtime.exit(1);
    return;
  }
  if (!result.cancelled) {
    runtime.error(result.reason ?? `Could not cancel task: ${opts.lookup}`);
    runtime.exit(1);
    return;
  }
  const updated = getTaskById(task.taskId);
  runtime.log(
    `Cancelled ${updated?.taskId ?? task.taskId} (${updated?.runtime ?? task.runtime})${updated?.runId ? ` run ${updated.runId}` : ""}.`,
  );
}
/** Prints or serializes combined task/task-flow audit findings. */
async function tasksAuditCommand(opts, runtime) {
  configureTaskMaintenanceFromConfig();
  const severityFilter = normalizeOptionalString(opts.severity);
  const codeFilter = normalizeOptionalString(opts.code);
  const auditResult = toSystemAuditFindings({
    severityFilter,
    codeFilter,
  });
  const { filteredFindings, summary } = auditResult;
  const limit = typeof opts.limit === "number" && opts.limit > 0 ? opts.limit : void 0;
  const displayed = limit ? filteredFindings.slice(0, limit) : filteredFindings;
  if (opts.json) {
    runtime.log(
      JSON.stringify(
        buildTaskSystemAuditJsonPayload(auditResult, {
          severityFilter,
          codeFilter,
          limit: opts.limit,
        }),
        null,
        2,
      ),
    );
    return;
  }
  runtime.log(
    info(
      `Tasks audit: ${summary.total} findings · ${summary.errors} errors · ${summary.warnings} warnings`,
    ),
  );
  if (severityFilter || codeFilter)
    runtime.log(info(`Showing ${filteredFindings.length} matching findings.`));
  if (severityFilter) runtime.log(info(`Severity filter: ${severityFilter}`));
  if (codeFilter) runtime.log(info(`Code filter: ${codeFilter}`));
  if (limit) runtime.log(info(`Limit: ${limit}`));
  runtime.log(
    info(`Task findings: ${summary.tasks.total} · TaskFlow findings: ${summary.taskFlows.total}`),
  );
  if (displayed.length === 0) {
    runtime.log("No tasks audit findings.");
    return;
  }
  const rich = isRich();
  for (const line of formatAuditRows(displayed, rich)) runtime.log(line);
}
/** Previews or applies task, task-flow, and backing session-registry maintenance. */
async function tasksMaintenanceCommand(opts, runtime) {
  configureTaskMaintenanceFromConfig();
  assertTaskFlowRegistryMaintenanceReady();
  const auditBefore = getInspectableTaskAuditSummary();
  const flowAuditBefore = getInspectableTaskFlowAuditSummary();
  const taskMaintenance = opts.apply
    ? await runTaskRegistryMaintenance()
    : previewTaskRegistryMaintenance();
  const diagnostics = opts.json ? getTaskRegistryMaintenanceDiagnostics() : void 0;
  const flowMaintenance = opts.apply
    ? await runTaskFlowRegistryMaintenance()
    : previewTaskFlowRegistryMaintenance();
  const sessionMaintenance = await runSessionRegistryMaintenance({ apply: Boolean(opts.apply) });
  const summary = getInspectableTaskRegistrySummary();
  const auditAfter = opts.apply ? getInspectableTaskAuditSummary() : auditBefore;
  const flowAuditAfter = opts.apply ? getInspectableTaskFlowAuditSummary() : flowAuditBefore;
  const retainedLostAfter = summarizeRetainedLostTaskAuditFindings(
    listTaskAuditFindings({ tasks: reconcileInspectableTasks() }),
  );
  if (opts.json) {
    runtime.log(
      JSON.stringify(
        {
          mode: opts.apply ? "apply" : "preview",
          maintenance: {
            tasks: taskMaintenance,
            taskFlows: flowMaintenance,
            sessions: sessionMaintenance,
          },
          tasks: summary,
          diagnostics,
          auditBefore: {
            ...auditBefore,
            taskFlows: flowAuditBefore,
          },
          auditAfter: {
            ...auditAfter,
            taskFlows: flowAuditAfter,
          },
        },
        null,
        2,
      ),
    );
    return;
  }
  runtime.log(
    info(
      `Tasks maintenance (${opts.apply ? "applied" : "preview"}): tasks ${taskMaintenance.reconciled} reconcile · ${taskMaintenance.recovered} recovered · ${taskMaintenance.cleanupStamped} cleanup stamp · ${taskMaintenance.pruned} prune; task-flows ${flowMaintenance.reconciled} reconcile · ${flowMaintenance.pruned} prune`,
    ),
  );
  runtime.log(
    info(
      `Session registry: ${sessionMaintenance.pruned} prune · ${sessionMaintenance.runningCronJobs} running cron jobs`,
    ),
  );
  runtime.log(
    info(
      `${opts.apply ? "Tasks health after apply" : "Tasks health"}: ${summary.byStatus.queued} queued · ${summary.byStatus.running} running · ${auditAfter.errors + flowAuditAfter.errors} audit errors · ${auditAfter.warnings + flowAuditAfter.warnings} audit warnings`,
    ),
  );
  if (retainedLostAfter.count > 0)
    runtime.log(
      info(
        `Retained lost tasks: ${retainedLostAfter.count} retained until ${timestampMsToIsoString(retainedLostAfter.nextCleanupAfter) ?? "cleanupAfter"}; maintenance will prune after cleanupAfter.`,
      ),
    );
  if (opts.apply)
    runtime.log(
      info(
        `Tasks health before apply: ${auditBefore.errors + flowAuditBefore.errors} audit errors · ${auditBefore.warnings + flowAuditBefore.warnings} audit warnings`,
      ),
    );
  if (!opts.apply)
    runtime.log("Dry run only. Re-run with `openclaw tasks maintenance --apply` to write changes.");
}
//#endregion
export {
  tasksAuditCommand,
  tasksCancelCommand,
  tasksListCommand,
  tasksMaintenanceCommand,
  tasksNotifyCommand,
  tasksShowCommand,
};
