//#region src/tasks/task-retention.ts
/** Default retention for terminal task records before maintenance prunes them. */
const DEFAULT_TASK_RETENTION_MS = 10080 * 6e4;
const LOST_TASK_RETENTION_MS = 1440 * 6e4;
function resolveTaskRetentionMs(status) {
  return status === "lost" ? LOST_TASK_RETENTION_MS : DEFAULT_TASK_RETENTION_MS;
}
function resolveTaskCleanupAfter(task) {
  if (task.runtime === "cron" && task.status !== "lost") return;
  return (task.endedAt ?? task.lastEventAt ?? task.createdAt) + resolveTaskRetentionMs(task.status);
}
function resolveEffectiveTaskCleanupAfter(task) {
  const statusCleanupAfter = resolveTaskCleanupAfter(task);
  if (statusCleanupAfter === void 0) return;
  if (typeof task.cleanupAfter !== "number") return statusCleanupAfter;
  return task.status === "lost"
    ? Math.min(task.cleanupAfter, statusCleanupAfter)
    : task.cleanupAfter;
}
//#endregion
export { resolveTaskCleanupAfter as n, resolveEffectiveTaskCleanupAfter as t };
