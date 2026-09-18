import { r as getActiveCronJobCount } from "./active-jobs-DCucn-SJ.js";
import { r as getSuspensionVisibleCronTaskRunCount } from "./active-run-cancellation-BfylSyKt.js";
import { o as getActiveBackgroundExecSessionCount } from "./bash-process-registry-DQZTRcsj.js";
import { l as getTotalQueueSize } from "./command-queue-CVn1dJsm.js";
import { t as getTotalPendingReplies } from "./dispatcher-registry-CaTZukRA.js";
import { i as getActiveGatewayRootWorkCount } from "./gateway-work-admission-yGjmBAjy.js";
import { d as getActiveEmbeddedRunCount } from "./run-state-BJlMim-d.js";
import {
  Q as getActiveSessionWorkAdmissionCount,
  Z as getActiveSessionLifecycleMutationCount,
} from "./store-CzZJhTF6.js";
import { n as getInspectableActiveTaskRestartBlockers } from "./task-registry.maintenance-_DeiCoga.js";
import { t as formatActiveTaskRestartBlocker } from "./task-restart-blocker-D04cCKR2.js";
//#region src/infra/gateway-active-work.ts
const defaultInspectors = {
  getQueueSize: getTotalQueueSize,
  getPendingReplies: getTotalPendingReplies,
  getEmbeddedRuns: getActiveEmbeddedRunCount,
  getBackgroundExecSessions: getActiveBackgroundExecSessionCount,
  getCronRuns: () => Math.max(getActiveCronJobCount(), getSuspensionVisibleCronTaskRunCount()),
  getActiveTasks: () => getInspectableActiveTaskRestartBlockers().length,
  getTaskBlockers: getInspectableActiveTaskRestartBlockers,
  getRootRequests: () => getActiveGatewayRootWorkCount({ excludeCurrent: true }),
  getSessionAdmissions: getActiveSessionWorkAdmissionCount,
  getSessionMutations: getActiveSessionLifecycleMutationCount,
  getChatRuns: () => 0,
  getQueuedTurns: () => 0,
  getTerminalPersistence: () => 0,
  getTerminalSessions: () => 0,
};
function normalizeCount(value) {
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}
function createGatewayActiveWorkSnapshot(inspectors = {}) {
  const resolved = {
    ...defaultInspectors,
    ...inspectors,
  };
  const counts = {
    queueSize: normalizeCount(resolved.getQueueSize()),
    pendingReplies: normalizeCount(resolved.getPendingReplies()),
    embeddedRuns: normalizeCount(resolved.getEmbeddedRuns()),
    backgroundExecSessions: normalizeCount(resolved.getBackgroundExecSessions()),
    cronRuns: normalizeCount(resolved.getCronRuns()),
    activeTasks: normalizeCount(resolved.getActiveTasks()),
    rootRequests: normalizeCount(resolved.getRootRequests()),
    sessionAdmissions: normalizeCount(resolved.getSessionAdmissions()),
    sessionMutations: normalizeCount(resolved.getSessionMutations()),
    chatRuns: normalizeCount(resolved.getChatRuns()),
    queuedTurns: normalizeCount(resolved.getQueuedTurns()),
    terminalPersistence: normalizeCount(resolved.getTerminalPersistence()),
    terminalSessions: normalizeCount(resolved.getTerminalSessions()),
    totalActive: 0,
  };
  counts.totalActive = Object.entries(counts).reduce(
    (total, [key, count]) => (key === "totalActive" ? total : total + count),
    0,
  );
  const blockers = [];
  const add = (count, kind, message) => {
    if (count > 0)
      blockers.push({
        kind,
        count,
        message,
      });
  };
  add(counts.queueSize, "queue", `${counts.queueSize} queued or active operation(s)`);
  add(
    counts.pendingReplies,
    "reply",
    `${counts.pendingReplies} pending reply delivery operation(s)`,
  );
  add(counts.embeddedRuns, "embedded-run", `${counts.embeddedRuns} active embedded run(s)`);
  add(
    counts.backgroundExecSessions,
    "background-exec",
    `${counts.backgroundExecSessions} active background exec session(s)`,
  );
  add(counts.cronRuns, "cron-run", `${counts.cronRuns} active cron run(s)`);
  add(counts.rootRequests, "root-request", `${counts.rootRequests} active gateway request(s)`);
  add(
    counts.sessionAdmissions,
    "session-admission",
    `${counts.sessionAdmissions} admitted session turn(s)`,
  );
  add(
    counts.sessionMutations,
    "session-mutation",
    `${counts.sessionMutations} active session lifecycle mutation(s)`,
  );
  add(counts.chatRuns, "chat-run", `${counts.chatRuns} active chat run(s)`);
  add(counts.queuedTurns, "queued-turn", `${counts.queuedTurns} queued chat turn(s)`);
  add(
    counts.terminalPersistence,
    "terminal-persistence",
    `${counts.terminalPersistence} pending terminal session write(s)`,
  );
  add(
    counts.terminalSessions,
    "terminal-session",
    `${counts.terminalSessions} open terminal session(s)`,
  );
  if (counts.activeTasks > 0) {
    const taskBlockers = resolved.getTaskBlockers();
    if (taskBlockers.length === 0)
      blockers.push({
        kind: "task",
        count: counts.activeTasks,
        message: `${counts.activeTasks} active background task run(s)`,
      });
    else {
      const shownTaskBlockers = taskBlockers.slice(0, 8);
      for (const task of shownTaskBlockers)
        blockers.push({
          kind: "task",
          count: 1,
          message: formatActiveTaskRestartBlocker(task),
          task,
        });
      const omitted = counts.activeTasks - shownTaskBlockers.length;
      if (omitted > 0)
        blockers.push({
          kind: "task",
          count: omitted,
          message: `${omitted} additional active background task run(s)`,
        });
    }
  }
  return {
    idle: counts.totalActive === 0,
    counts,
    blockers,
  };
}
//#endregion
export { createGatewayActiveWorkSnapshot as t };
