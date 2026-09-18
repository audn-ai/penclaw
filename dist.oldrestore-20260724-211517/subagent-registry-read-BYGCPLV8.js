import { p as getAgentRunContext } from "./agent-events-D4UsOPeT.js";
import {
  E as subagentRuns,
  S as listRunsForControllerFromRuns,
  h as countActiveDescendantRunsFromRuns,
  m as buildSubagentRunReadIndexFromRuns,
  p as buildLatestSubagentRunReadIndexFromRuns,
  t as getSubagentRunsSnapshotForRead,
  x as listDescendantRunsForRequesterFromRuns,
  y as getSubagentRunByChildSessionKeyFromRuns,
} from "./subagent-registry-state-tCJeOSqd.js";
import { t as compareSubagentRunGeneration } from "./subagent-run-generation-DZIUUsme.js";
//#region src/agents/subagent-registry-read.ts
/**
 * Read-only subagent registry accessors.
 *
 * Combines persisted snapshots with in-memory live runs for UI, announce, control, and recovery paths.
 */
/** Builds a reusable read index from the current persisted and in-memory run state. */
function buildSubagentRunReadIndex(now = Date.now()) {
  return buildSubagentRunReadIndexFromRuns({
    runs: getSubagentRunsSnapshotForRead(subagentRuns),
    inMemoryRuns: subagentRuns.values(),
    now,
  });
}
/** Builds an O(1) latest-run lookup from one persisted and in-memory snapshot. */
function buildLatestSubagentRunReadIndex() {
  return buildLatestSubagentRunReadIndexFromRuns(getSubagentRunsSnapshotForRead(subagentRuns));
}
/** Lists runs controlled by a session key. */
function listSubagentRunsForController(controllerSessionKey) {
  return listRunsForControllerFromRuns(
    getSubagentRunsSnapshotForRead(subagentRuns),
    controllerSessionKey,
  );
}
/** Counts active descendant runs for a requester/session tree. */
function countActiveDescendantRuns(rootSessionKey) {
  return countActiveDescendantRunsFromRuns(
    getSubagentRunsSnapshotForRead(subagentRuns),
    rootSessionKey,
  );
}
/** Lists descendant runs under a requester/session tree. */
function listDescendantRunsForRequester(rootSessionKey) {
  return listDescendantRunsForRequesterFromRuns(
    getSubagentRunsSnapshotForRead(subagentRuns),
    rootSessionKey,
  );
}
/** Returns the preferred run for a child session, favoring active over ended runs. */
function getSubagentRunByChildSessionKey(childSessionKey) {
  return getSubagentRunByChildSessionKeyFromRuns(
    getSubagentRunsSnapshotForRead(subagentRuns),
    childSessionKey,
  );
}
/** Returns whether a registry entry still has a live agent run context. */
function isSubagentRunLive(entry) {
  if (!entry || typeof entry.endedAt === "number") return false;
  return Boolean(getAgentRunContext(entry.runId));
}
/** Returns the run to display for a child session, using live memory before snapshot state. */
function getSessionDisplaySubagentRunByChildSessionKey(childSessionKey) {
  const key = childSessionKey.trim();
  if (!key) return null;
  let latestInMemoryActive = null;
  let latestInMemoryEnded = null;
  for (const entry of subagentRuns.values()) {
    if (entry.childSessionKey !== key) continue;
    if (typeof entry.endedAt === "number") {
      if (!latestInMemoryEnded || compareSubagentRunGeneration(entry, latestInMemoryEnded) > 0)
        latestInMemoryEnded = entry;
      continue;
    }
    if (!latestInMemoryActive || compareSubagentRunGeneration(entry, latestInMemoryActive) > 0)
      latestInMemoryActive = entry;
  }
  if (latestInMemoryEnded || latestInMemoryActive) {
    if (
      latestInMemoryEnded &&
      (!latestInMemoryActive ||
        compareSubagentRunGeneration(latestInMemoryEnded, latestInMemoryActive) > 0)
    )
      return latestInMemoryEnded;
    return latestInMemoryActive ?? latestInMemoryEnded;
  }
  return getSubagentRunByChildSessionKey(key);
}
/** Returns the most recently created run for a child session from readable registry state. */
function getLatestSubagentRunByChildSessionKey(childSessionKey) {
  const key = childSessionKey.trim();
  if (!key) return null;
  let latest = null;
  for (const entry of getSubagentRunsSnapshotForRead(subagentRuns).values()) {
    if (entry.childSessionKey !== key) continue;
    if (!latest || compareSubagentRunGeneration(entry, latest) > 0) latest = entry;
  }
  return latest;
}
//#endregion
export {
  getSessionDisplaySubagentRunByChildSessionKey as a,
  listSubagentRunsForController as c,
  getLatestSubagentRunByChildSessionKey as i,
  buildSubagentRunReadIndex as n,
  isSubagentRunLive as o,
  countActiveDescendantRuns as r,
  listDescendantRunsForRequester as s,
  buildLatestSubagentRunReadIndex as t,
};
