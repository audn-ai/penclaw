import { o as normalizeDeliveryContext } from "./delivery-context.shared-WPZGmi9R.js";
import {
  i as getLatestSubagentRunByChildSessionKey,
  r as countActiveDescendantRuns,
} from "./subagent-registry-read-BYGCPLV8.js";
import {
  C as listRunsForRequesterFromRuns,
  E as subagentRuns,
  T as shouldIgnorePostCompletionAnnounceForSessionFromRuns,
  _ as countPendingDescendantRunsExcludingRunFromRuns,
  b as isSubagentSessionRunActiveFromRuns,
  t as getSubagentRunsSnapshotForRead,
  v as countPendingDescendantRunsFromRuns,
  w as resolveRequesterForChildSessionFromRuns,
} from "./subagent-registry-state-tCJeOSqd.js";
import { r as replaceSubagentRunAfterSteer } from "./subagent-registry-steer-runtime-ECWUlUYG.js";
//#region src/agents/subagent-registry-announce-read.ts
/**
 * Read-side helpers for subagent completion announcements. These wrappers keep
 * announce delivery code on normalized registry snapshots instead of reaching
 * into persistence or mutation paths.
 */
/** Resolves the requester session and origin for a child subagent session. */
function resolveRequesterForChildSession(childSessionKey) {
  const resolved = resolveRequesterForChildSessionFromRuns(
    getSubagentRunsSnapshotForRead(subagentRuns),
    childSessionKey,
  );
  if (!resolved) return null;
  return {
    requesterSessionKey: resolved.requesterSessionKey,
    requesterOrigin: normalizeDeliveryContext(resolved.requesterOrigin),
  };
}
/** True when a subagent session still has an active run record. */
function isSubagentSessionRunActive(childSessionKey) {
  return isSubagentSessionRunActiveFromRuns(subagentRuns, childSessionKey);
}
/** True when post-completion announce should be skipped for a child session. */
function shouldIgnorePostCompletionAnnounceForSession(childSessionKey) {
  return shouldIgnorePostCompletionAnnounceForSessionFromRuns(
    getSubagentRunsSnapshotForRead(subagentRuns),
    childSessionKey,
  );
}
/** Lists subagent runs requested by one session key. */
function listSubagentRunsForRequester(requesterSessionKey, options) {
  return listRunsForRequesterFromRuns(subagentRuns, requesterSessionKey, options);
}
/** Counts pending descendant subagent runs below a root session. */
function countPendingDescendantRuns(rootSessionKey) {
  return countPendingDescendantRunsFromRuns(
    getSubagentRunsSnapshotForRead(subagentRuns),
    rootSessionKey,
  );
}
/** Counts pending descendant runs while excluding one run id. */
function countPendingDescendantRunsExcludingRun(rootSessionKey, excludeRunId) {
  return countPendingDescendantRunsExcludingRunFromRuns(
    getSubagentRunsSnapshotForRead(subagentRuns),
    rootSessionKey,
    excludeRunId,
  );
}
//#endregion
export {
  countActiveDescendantRuns,
  countPendingDescendantRuns,
  countPendingDescendantRunsExcludingRun,
  getLatestSubagentRunByChildSessionKey,
  isSubagentSessionRunActive,
  listSubagentRunsForRequester,
  replaceSubagentRunAfterSteer,
  resolveRequesterForChildSession,
  shouldIgnorePostCompletionAnnounceForSession,
};
