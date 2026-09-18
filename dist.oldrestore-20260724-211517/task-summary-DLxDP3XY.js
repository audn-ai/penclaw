import { a as sanitizeTaskStatusText, r as formatTaskStatusTitle } from "./task-status-DAPY5YOX.js";
//#region src/gateway/server-methods/task-summary.ts
const TASK_STATUS_TO_LEDGER_STATUS = {
  queued: "queued",
  running: "running",
  succeeded: "completed",
  failed: "failed",
  timed_out: "timed_out",
  cancelled: "cancelled",
  lost: "failed",
};
function taskUpdatedAt(task) {
  return task.lastEventAt ?? task.endedAt ?? task.startedAt ?? task.createdAt;
}
function sanitizeOptionalTaskText(value, opts) {
  return (
    sanitizeTaskStatusText(value, {
      errorContext: opts?.errorContext,
      maxChars: 120,
    }) || void 0
  );
}
function mapTaskSummary(task) {
  const progressSummary = sanitizeOptionalTaskText(task.progressSummary);
  const terminalSummary = sanitizeOptionalTaskText(task.terminalSummary, { errorContext: true });
  const error = sanitizeOptionalTaskText(task.error, { errorContext: true });
  const lastToolName = sanitizeOptionalTaskText(task.lastToolName);
  const toolUseCount =
    typeof task.toolUseCount === "number" && Number.isInteger(task.toolUseCount)
      ? Math.max(0, task.toolUseCount)
      : void 0;
  return {
    id: task.taskId,
    taskId: task.taskId,
    kind: task.taskKind ?? task.runtime,
    runtime: task.runtime,
    status: TASK_STATUS_TO_LEDGER_STATUS[task.status],
    title: formatTaskStatusTitle(task),
    ...(task.agentId ? { agentId: task.agentId } : {}),
    sessionKey: task.requesterSessionKey,
    ...(task.childSessionKey ? { childSessionKey: task.childSessionKey } : {}),
    ownerKey: task.ownerKey,
    ...(task.runId ? { runId: task.runId } : {}),
    ...(task.parentFlowId ? { flowId: task.parentFlowId } : {}),
    ...(task.parentTaskId ? { parentTaskId: task.parentTaskId } : {}),
    ...(task.sourceId ? { sourceId: task.sourceId } : {}),
    createdAt: task.createdAt,
    updatedAt: taskUpdatedAt(task),
    ...(task.startedAt !== void 0 ? { startedAt: task.startedAt } : {}),
    ...(task.endedAt !== void 0 ? { endedAt: task.endedAt } : {}),
    ...(toolUseCount !== void 0 ? { toolUseCount } : {}),
    ...(lastToolName ? { lastToolName } : {}),
    ...(progressSummary ? { progressSummary } : {}),
    ...(terminalSummary ? { terminalSummary } : {}),
    ...(error ? { error } : {}),
  };
}
//#endregion
export { taskUpdatedAt as n, mapTaskSummary as t };
