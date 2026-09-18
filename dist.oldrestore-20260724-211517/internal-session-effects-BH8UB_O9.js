import {
  Dt as createSessionTranscriptHeader,
  It as resolveInternalSessionEffectsIdentity,
  U as replaceTranscriptEvents,
  a as applySessionEntryLifecycleMutation,
  b as loadExactSessionEntry,
  st as upsertSessionEntry,
  v as forkSessionFromParentTranscript,
} from "./session-accessor-PZVNxFCV.js";
import { t as formatSqliteSessionFileMarker } from "./sqlite-marker-BejbySI1.js";
//#region src/agents/internal-session-effects.ts
/** Manages hidden SQLite sessions used for suppressed agent side effects. */
/** Resolves the deterministic SQLite target owned by one internal-effects run. */
function resolveInternalSessionEffectsTarget(params) {
  return {
    agentId: params.agentId,
    storePath: params.storePath,
    ...resolveInternalSessionEffectsIdentity(params),
  };
}
function toInternalSessionEffectsTarget(params) {
  return {
    agentId: params.agentId,
    sessionId: params.entry.sessionId,
    sessionKey: params.sessionKey,
    storePath: params.storePath,
    sessionEntry: params.entry,
    sessionFile: formatSqliteSessionFileMarker({
      agentId: params.agentId,
      sessionId: params.entry.sessionId,
      storePath: params.storePath,
    }),
  };
}
/** Creates or reopens the hidden SQLite session owned by one internal-effects run. */
async function prepareInternalSessionEffectsSession(params) {
  const scope = resolveInternalSessionEffectsTarget(params);
  const existing = loadExactSessionEntry(scope)?.entry;
  if (existing?.sessionId === scope.sessionId)
    return toInternalSessionEffectsTarget({
      agentId: params.agentId,
      entry: existing,
      sessionKey: scope.sessionKey,
      storePath: params.storePath,
    });
  if (
    (params.source
      ? await forkSessionFromParentTranscript({
          agentId: params.source.agentId,
          parentEntry: {
            sessionId: params.source.sessionId,
            updatedAt: Date.now(),
          },
          parentSessionKey: params.source.sessionKey,
          sessionKey: scope.sessionKey,
          storePath: params.source.storePath,
          targetSessionId: scope.sessionId,
          targetStorePath: params.storePath,
        })
      : void 0
    )?.status !== "created"
  )
    await replaceTranscriptEvents(scope, [
      createSessionTranscriptHeader({
        cwd: params.cwd,
        sessionId: scope.sessionId,
      }),
    ]);
  const now = Date.now();
  const entry = await upsertSessionEntry(scope, {
    sessionId: scope.sessionId,
    sessionStartedAt: now,
    updatedAt: now,
  });
  if (!entry) throw new Error(`Failed to create internal SQLite session for run ${params.runId}`);
  return toInternalSessionEffectsTarget({
    agentId: params.agentId,
    entry,
    sessionKey: scope.sessionKey,
    storePath: params.storePath,
  });
}
/** Hard-deletes a run-owned hidden session and its SQLite transcript rows. */
async function removeInternalSessionEffectsSession(target) {
  if (!target?.sessionKey || !target.storePath) return;
  await applySessionEntryLifecycleMutation({
    ...(target.agentId ? { agentId: target.agentId } : {}),
    storePath: target.storePath,
    removals: [
      {
        sessionKey: target.sessionKey,
        ...(target.sessionId ? { expectedSessionId: target.sessionId } : {}),
        archiveRemovedTranscript: false,
      },
    ],
    skipMaintenance: true,
  });
}
//#endregion
export {
  removeInternalSessionEffectsSession as n,
  resolveInternalSessionEffectsTarget as r,
  prepareInternalSessionEffectsSession as t,
};
