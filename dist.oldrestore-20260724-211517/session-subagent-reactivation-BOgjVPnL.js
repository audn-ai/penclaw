import { i as getLatestSubagentRunByChildSessionKey } from "./subagent-registry-read-BYGCPLV8.js";
//#region src/gateway/session-subagent-reactivation.ts
async function loadSessionSubagentReactivationRuntime() {
  return import("./session-subagent-reactivation.runtime.js");
}
/**
 * Reactivates a completed subagent session by swapping in the new run id.
 *
 * `task` is the canonical user-supplied prompt text that just dispatched the
 * follow-up. When provided, it is persisted on the new run record so a later
 * orphan recovery / gateway restart rewraps the follow-up prompt rather than
 * the stale original task. Without this, sessions.send and agent.run callers
 * could reactivate a completed run with the new run id but lose the new
 * prompt text from restart redispatch.
 */
async function reactivateCompletedSubagentSession(params) {
  const runId = params.runId?.trim();
  if (!runId) return false;
  const existing = getLatestSubagentRunByChildSessionKey(params.sessionKey);
  if (!existing || typeof existing.endedAt !== "number") return false;
  const { replaceSubagentRunAfterSteer } = await loadSessionSubagentReactivationRuntime();
  const task = params.task;
  const hasTask = typeof task === "string" && task.trim().length > 0;
  return replaceSubagentRunAfterSteer({
    previousRunId: existing.runId,
    nextRunId: runId,
    fallback: existing,
    runTimeoutSeconds: existing.runTimeoutSeconds ?? 0,
    ...(hasTask ? { task } : {}),
  });
}
//#endregion
export { reactivateCompletedSubagentSession as t };
