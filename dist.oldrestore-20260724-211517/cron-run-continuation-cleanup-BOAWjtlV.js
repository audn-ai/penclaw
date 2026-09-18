import { f as getAgentEventLifecycleGeneration } from "./agent-events-D4UsOPeT.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { l as resolveStorePath } from "./paths-TfuVT-K8.js";
import "./config-BDv-QbJ6.js";
import {
  S as loadSessionEntry,
  h as deleteSessionEntryLifecycle,
} from "./session-accessor-PZVNxFCV.js";
import { d as resolveAgentIdFromSessionKey } from "./session-key-druuY-GG.js";
import { l as parseCronRunScopeSuffix } from "./session-key-utils-B8sNp9l4.js";
import { a as hasPendingGeneratedMediaTaskForSessionKey } from "./task-status-access-BVw-UeJU.js";
//#region src/tasks/cron-run-continuation-cleanup.ts
/** Removes an idle exact-run continuation through the session lifecycle owner. */
function canRemoveCronRunContinuation(marker) {
  if (!marker || marker.basePersisted !== true) return false;
  if (marker.phase === "ready") return !marker.ownerRunId;
  if (marker.phase !== "continuing" || !marker.ownerRunId) return false;
  const ownerLifecycleGeneration = marker.ownerLifecycleGeneration?.trim();
  return Boolean(
    ownerLifecycleGeneration && ownerLifecycleGeneration !== getAgentEventLifecycleGeneration(),
  );
}
async function removeCronRunContinuationSessionIfIdle(sessionKey) {
  if (
    !parseCronRunScopeSuffix(sessionKey).runId ||
    hasPendingGeneratedMediaTaskForSessionKey(sessionKey)
  )
    return;
  const agentId = resolveAgentIdFromSessionKey(sessionKey);
  const storePath = resolveStorePath(getRuntimeConfig().session?.store, { agentId });
  const entry = loadSessionEntry({
    agentId,
    sessionKey,
    storePath,
    readConsistency: "latest",
    hydrateSkillPromptRefs: false,
  });
  const marker = entry?.cronRunContinuation;
  if (!entry || !canRemoveCronRunContinuation(marker)) return;
  await deleteSessionEntryLifecycle({
    agentId,
    archiveTranscript: false,
    expectedEntry: entry,
    expectedLifecycleRevision: entry.lifecycleRevision,
    expectedSessionId: entry.sessionId,
    expectedUpdatedAt: entry.updatedAt,
    requireWriteSuccess: true,
    storePath,
    target: {
      canonicalKey: sessionKey,
      storeKeys: [sessionKey],
    },
  });
}
//#endregion
export { removeCronRunContinuationSessionIfIdle as t };
