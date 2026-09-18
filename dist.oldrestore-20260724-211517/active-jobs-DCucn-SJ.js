import { n as resolveGlobalSingleton } from "./global-singleton-PwlQSEal.js";
//#region src/cron/active-jobs.ts
/** Tracks in-process cron executions so schedulers and wake paths avoid duplicate runs. */
const CRON_ACTIVE_JOB_STATE_KEY = Symbol.for("openclaw.cron.activeJobs");
function getCronActiveJobState() {
  const state = resolveGlobalSingleton(CRON_ACTIVE_JOB_STATE_KEY, () => ({
    activeJobs: /* @__PURE__ */ new Map(),
    generation: 0,
    nextToken: 1,
    emptyWaiters: /* @__PURE__ */ new Set(),
    activeJobIds: /* @__PURE__ */ new Set(),
  }));
  state.generation ??= 0;
  state.nextToken ??= 1;
  state.activeJobs ??= /* @__PURE__ */ new Map();
  state.emptyWaiters ??= /* @__PURE__ */ new Set();
  state.activeJobIds ??= /* @__PURE__ */ new Set();
  if (state.activeJobIds) {
    for (const [jobId, marker] of state.activeJobs)
      if (marker.legacy === true && !state.activeJobIds.has(jobId)) state.activeJobs.delete(jobId);
    for (const jobId of state.activeJobIds)
      if (!state.activeJobs.has(jobId)) {
        state.activeJobs.set(jobId, {
          jobId,
          generation: state.generation,
          token: state.nextToken,
          legacy: true,
        });
        state.nextToken += 1;
      }
  }
  return state;
}
function getActiveCronJobCountForGeneration(state) {
  let active = 0;
  for (const marker of state.activeJobs.values())
    if (isMarkerActiveInGeneration(marker, state.generation)) active += 1;
  return active;
}
function isMarkerActiveInGeneration(marker, generation) {
  return marker.generation === generation || marker.preserveAcrossGenerationAdvance === true;
}
function notifyActiveCronJobWaitersIfEmpty(state) {
  if (getActiveCronJobCountForGeneration(state) > 0) return;
  for (const resolve of state.emptyWaiters) resolve();
  state.emptyWaiters.clear();
}
/** Marks a cron job id as currently executing for duplicate-run suppression. */
function markCronJobActive(jobId, opts) {
  if (!jobId) return;
  const state = getCronActiveJobState();
  const token = state.nextToken;
  state.nextToken += 1;
  const marker = {
    jobId,
    generation: state.generation,
    token,
    ...(opts?.preserveAcrossGenerationAdvance ? { preserveAcrossGenerationAdvance: true } : {}),
  };
  state.activeJobs.set(jobId, marker);
  state.activeJobIds?.add(jobId);
  return marker;
}
/** Clears the active marker when a cron run exits or is abandoned. */
function clearCronJobActive(jobId, marker) {
  if (!jobId) return;
  const state = getCronActiveJobState();
  const activeMarker = state.activeJobs.get(jobId);
  if (
    activeMarker &&
    (!marker || (marker.jobId === jobId && marker.token === activeMarker.token))
  ) {
    state.activeJobs.delete(jobId);
    state.activeJobIds?.delete(jobId);
  }
  notifyActiveCronJobWaitersIfEmpty(state);
}
/** Returns whether the given cron job id is currently executing in this process. */
function isCronJobActive(jobId) {
  if (!jobId) return false;
  const state = getCronActiveJobState();
  const marker = state.activeJobs.get(jobId);
  return marker ? isMarkerActiveInGeneration(marker, state.generation) : false;
}
function isCronActiveJobMarkerCurrent(marker) {
  if (!marker) return true;
  const state = getCronActiveJobState();
  return (
    state.activeJobs.get(marker.jobId)?.token === marker.token &&
    isMarkerActiveInGeneration(marker, state.generation)
  );
}
/** Returns whether any cron run is active in this process. */
function hasActiveCronJobs() {
  return getActiveCronJobCountForGeneration(getCronActiveJobState()) > 0;
}
/** Returns the number of active cron runs in this process. */
function getActiveCronJobCount() {
  return getActiveCronJobCountForGeneration(getCronActiveJobState());
}
async function waitForActiveCronJobs(timeoutMs) {
  const state = getCronActiveJobState();
  if (getActiveCronJobCountForGeneration(state) === 0)
    return {
      drained: true,
      active: 0,
    };
  await new Promise((resolve) => {
    const waiter = () => {
      clearTimeout(timeout);
      resolve();
    };
    const timeout = setTimeout(
      () => {
        state.emptyWaiters.delete(waiter);
        resolve();
      },
      Math.max(0, Math.floor(timeoutMs)),
    );
    state.emptyWaiters.add(waiter);
  });
  const active = getActiveCronJobCountForGeneration(state);
  return {
    drained: active === 0,
    active,
  };
}
/** Starts a new process-lifecycle generation without clearing still-finalizing old runs. */
function advanceCronActiveJobGeneration() {
  const state = getCronActiveJobState();
  state.generation += 1;
  for (const [jobId, marker] of state.activeJobs) {
    if (marker.preserveAcrossGenerationAdvance === true) continue;
    if (marker.generation < state.generation - 1) {
      state.activeJobs.delete(jobId);
      state.activeJobIds?.delete(jobId);
    }
  }
  notifyActiveCronJobWaitersIfEmpty(state);
}
/** Clears process-global cron active-job state at process-lifecycle boundaries. */
function resetCronActiveJobs() {
  const state = getCronActiveJobState();
  state.generation += 1;
  state.activeJobs.clear();
  state.activeJobIds?.clear();
  notifyActiveCronJobWaitersIfEmpty(state);
}
//#endregion
export {
  isCronActiveJobMarkerCurrent as a,
  resetCronActiveJobs as c,
  hasActiveCronJobs as i,
  waitForActiveCronJobs as l,
  clearCronJobActive as n,
  isCronJobActive as o,
  getActiveCronJobCount as r,
  markCronJobActive as s,
  advanceCronActiveJobGeneration as t,
};
