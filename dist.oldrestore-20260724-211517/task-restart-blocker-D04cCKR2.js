import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/tasks/task-restart-blocker.ts
function formatActiveTaskRestartBlocker(task) {
  return [
    `taskId=${task.taskId}`,
    task.runId ? `runId=${task.runId}` : null,
    `status=${task.status}`,
    `runtime=${task.runtime}`,
    task.label ? `label=${task.label}` : null,
    task.title ? `title=${truncateUtf16Safe(task.title, 80)}` : null,
  ]
    .filter((value) => Boolean(value))
    .join(" ");
}
//#endregion
export { formatActiveTaskRestartBlocker as t };
