import { n as resolveGlobalSingleton } from "./global-singleton-PwlQSEal.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { l as parseCronRunScopeSuffix } from "./session-key-utils-B8sNp9l4.js";
import {
  A as isTerminalTaskStatus,
  c as getTaskById,
  h as listTasksForAgentId,
  p as listTaskRecords,
  s as findTaskByRunId,
  y as listTasksForSessionKey,
} from "./task-registry-C44yDrOW.js";
//#region src/tasks/generated-media-task-activity.ts
const GENERATED_MEDIA_TASK_ACTIVITY_KEY = Symbol.for("openclaw.generatedMediaTaskActivity");
const GENERATED_MEDIA_TASK_ADMISSIONS_KEY = Symbol.for("openclaw.generatedMediaTaskAdmissions");
const GENERATED_MEDIA_TASK_ADMISSIONS_MAX_ENTRIES = 2048;
function getActiveGeneratedMediaTasks() {
  return resolveGlobalSingleton(GENERATED_MEDIA_TASK_ACTIVITY_KEY, () => /* @__PURE__ */ new Map());
}
function getLatestGeneratedMediaTaskAdmissions() {
  return resolveGlobalSingleton(
    GENERATED_MEDIA_TASK_ADMISSIONS_KEY,
    () => /* @__PURE__ */ new Map(),
  );
}
/** Tracks in-process generated-media work even when a plugin owns task persistence. */
function registerGeneratedMediaTaskActivity(runId, sessionKey) {
  if (!runId || !sessionKey) return;
  const active = getActiveGeneratedMediaTasks();
  if (!active.has(runId)) {
    const admissions = getLatestGeneratedMediaTaskAdmissions();
    admissions.delete(sessionKey);
    admissions.set(sessionKey, runId);
    pruneMapToMaxSize(admissions, GENERATED_MEDIA_TASK_ADMISSIONS_MAX_ENTRIES);
  }
  active.set(runId, sessionKey);
}
/** Clears in-process generated-media activity after terminal task bookkeeping. */
function clearGeneratedMediaTaskActivity(runId) {
  getActiveGeneratedMediaTasks().delete(runId);
}
/** Lists active generated-media run ids for one exact requester session. */
function listActiveGeneratedMediaTaskIdsForSessionKey(sessionKey) {
  const runIds = [];
  for (const [runId, requesterSessionKey] of getActiveGeneratedMediaTasks())
    if (requesterSessionKey === sessionKey) runIds.push(runId);
  return runIds;
}
/** Returns the latest admitted run id even after that task became terminal. */
function getLatestGeneratedMediaTaskAdmissionIdForSessionKey(sessionKey) {
  return getLatestGeneratedMediaTaskAdmissions().get(sessionKey);
}
//#endregion
//#region src/tasks/task-status-access.ts
const GENERATED_MEDIA_TASK_KINDS = /* @__PURE__ */ new Set([
  "image_generation",
  "music_generation",
  "video_generation",
]);
/** Returns only the session lookup fields needed by task status commands. */
function getTaskSessionLookupByIdForStatus(taskId) {
  const task = getTaskById(taskId);
  return task
    ? {
        requesterSessionKey: task.requesterSessionKey,
        ownerKey: task.ownerKey,
        ...(task.runId ? { runId: task.runId } : {}),
        ...(task.agentId ? { agentId: task.agentId } : {}),
        ...(task.requesterAgentId ? { requesterAgentId: task.requesterAgentId } : {}),
      }
    : void 0;
}
function listTasksForSessionKeyForStatus(sessionKey) {
  return listTasksForSessionKey(sessionKey);
}
function listTasksForOwnerOrRequesterSessionKeyForStatus(sessionKey) {
  return listTaskRecords().filter(
    (task) => task.requesterSessionKey === sessionKey || task.ownerKey === sessionKey,
  );
}
function listTasksForAgentIdForStatus(agentId) {
  return listTasksForAgentId(agentId);
}
function findTaskByRunIdForStatus(runId) {
  return findTaskByRunId(runId);
}
/** Snapshots generated-media task ids so replay guards stay attempt-local. */
function getGeneratedMediaTaskIdsForSessionKey(sessionKey) {
  if (!sessionKey || !parseCronRunScopeSuffix(sessionKey).runId) return /* @__PURE__ */ new Set();
  const taskIds = listTasksForOwnerOrRequesterSessionKeyForStatus(sessionKey)
    .filter((task) => GENERATED_MEDIA_TASK_KINDS.has(task.taskKind ?? ""))
    .map((task) => task.taskId);
  const latestAdmission = getLatestGeneratedMediaTaskAdmissionIdForSessionKey(sessionKey);
  return /* @__PURE__ */ new Set([
    ...taskIds,
    ...(latestAdmission ? [`run:${latestAdmission}`] : []),
  ]);
}
/** Returns whether one attempt admitted generated-media work after its snapshot. */
function hasNewGeneratedMediaTaskForSessionKey(sessionKey, before) {
  for (const taskId of getGeneratedMediaTaskIdsForSessionKey(sessionKey))
    if (!before.has(taskId)) return true;
  return false;
}
/** Returns whether generated-media work still needs this run's continuation row. */
function hasPendingGeneratedMediaTaskForSessionKey(sessionKey) {
  if (!parseCronRunScopeSuffix(sessionKey).runId) return false;
  if (listActiveGeneratedMediaTaskIdsForSessionKey(sessionKey).length > 0) return true;
  return listTasksForOwnerOrRequesterSessionKeyForStatus(sessionKey).some(
    (task) =>
      GENERATED_MEDIA_TASK_KINDS.has(task.taskKind ?? "") && !isTerminalTaskStatus(task.status),
  );
}
//#endregion
export {
  hasPendingGeneratedMediaTaskForSessionKey as a,
  listTasksForSessionKeyForStatus as c,
  hasNewGeneratedMediaTaskForSessionKey as i,
  clearGeneratedMediaTaskActivity as l,
  getGeneratedMediaTaskIdsForSessionKey as n,
  listTasksForAgentIdForStatus as o,
  getTaskSessionLookupByIdForStatus as r,
  listTasksForOwnerOrRequesterSessionKeyForStatus as s,
  findTaskByRunIdForStatus as t,
  registerGeneratedMediaTaskActivity as u,
};
