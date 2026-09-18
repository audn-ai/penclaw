//#region src/cron/service/active-run-cancellation.ts
const activeCronTaskRunsByRunId = /* @__PURE__ */ new Map();
const settlingCronTaskRuns = /* @__PURE__ */ new Map();
const suspensionVisibleCronTaskRuns = /* @__PURE__ */ new Set();
const DEFAULT_CRON_TASK_RUN_DRAIN_POLL_MS = 25;
const CRON_TASK_RUN_SETTLEMENT_TRACKING_MAX_MS = 6e4;
function startActiveCronTaskRunSettlementGrace() {
  for (const [promise, entry] of settlingCronTaskRuns) {
    if (entry.retirementTimer) continue;
    const retirementTimer = setTimeout(() => {
      settlingCronTaskRuns.delete(promise);
    }, CRON_TASK_RUN_SETTLEMENT_TRACKING_MAX_MS);
    retirementTimer.unref?.();
    entry.retirementTimer = retirementTimer;
  }
}
function registerActiveCronTaskRun(params) {
  const runId = params.runId?.trim();
  if (!runId) return;
  activeCronTaskRunsByRunId.set(runId, {
    controller: params.controller,
    onCancel: params.onCancel,
  });
  return () => {
    if (activeCronTaskRunsByRunId.get(runId)?.controller === params.controller)
      activeCronTaskRunsByRunId.delete(runId);
  };
}
function abortActiveCronTaskRuns(reason = "Gateway restarting.") {
  let aborted = 0;
  for (const handle of activeCronTaskRunsByRunId.values()) {
    if (handle.controller.signal.aborted) continue;
    handle.controller.abort(reason);
    handle.onCancel?.(reason);
    aborted += 1;
  }
  if (aborted > 0) startActiveCronTaskRunSettlementGrace();
  return aborted;
}
function trackActiveCronTaskRunSettlement(promise) {
  settlingCronTaskRuns.set(promise, {});
  suspensionVisibleCronTaskRuns.add(promise);
  promise
    .catch(() => void 0)
    .finally(() => {
      const entry = settlingCronTaskRuns.get(promise);
      if (entry?.retirementTimer) clearTimeout(entry.retirementTimer);
      settlingCronTaskRuns.delete(promise);
      suspensionVisibleCronTaskRuns.delete(promise);
    });
}
/** Cron cores that can still mutate state even after timeout/cancel returned. */
function getSuspensionVisibleCronTaskRunCount() {
  return suspensionVisibleCronTaskRuns.size;
}
/** Retires restart-drain bookkeeping without hiding still-running cores from suspension. */
function retireActiveCronTaskRunTracking() {
  activeCronTaskRunsByRunId.clear();
  for (const entry of settlingCronTaskRuns.values())
    if (entry.retirementTimer) clearTimeout(entry.retirementTimer);
  settlingCronTaskRuns.clear();
}
async function waitForActiveCronTaskRuns(timeoutMs) {
  const deadline = Date.now() + Math.max(0, Math.floor(timeoutMs));
  while (
    (activeCronTaskRunsByRunId.size > 0 || settlingCronTaskRuns.size > 0) &&
    Date.now() < deadline
  )
    await new Promise((resolve) => {
      setTimeout(resolve, DEFAULT_CRON_TASK_RUN_DRAIN_POLL_MS);
    });
  return {
    drained: activeCronTaskRunsByRunId.size === 0 && settlingCronTaskRuns.size === 0,
    active: activeCronTaskRunsByRunId.size + settlingCronTaskRuns.size,
  };
}
function cancelActiveCronTaskRun(params) {
  const runId = params.runId?.trim();
  if (!runId) return false;
  const handle = activeCronTaskRunsByRunId.get(runId);
  if (!handle || handle.controller.signal.aborted) return false;
  const reason = params.reason?.trim() || "Cancelled by operator.";
  handle.controller.abort(reason);
  handle.onCancel?.(reason);
  startActiveCronTaskRunSettlementGrace();
  return true;
}
//#endregion
export {
  retireActiveCronTaskRunTracking as a,
  waitForActiveCronTaskRuns as c,
  registerActiveCronTaskRun as i,
  cancelActiveCronTaskRun as n,
  startActiveCronTaskRunSettlementGrace as o,
  getSuspensionVisibleCronTaskRunCount as r,
  trackActiveCronTaskRunSettlement as s,
  abortActiveCronTaskRuns as t,
};
