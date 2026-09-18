import { s as resolveSessionWorkStartError } from "./lifecycle-5_TQ_dr5.js";
import { D as patchSessionEntry } from "./session-accessor-PZVNxFCV.js";
import {
  r as mergeSessionSnapshotChanges,
  s as sessionSnapshotTouchedFieldsConflict,
} from "./session-snapshot-merge-BUp0DZlF.js";
//#region src/auto-reply/reply/session-entry-persistence.ts
/** Persists reply-owned state without reverting concurrent session management. */
async function persistReplySessionEntry(params) {
  let lifecycleError;
  let lifecycleEntry;
  const persisted = await patchSessionEntry(
    {
      sessionKey: params.sessionKey,
      storePath: params.storePath,
    },
    (_entry, context) => {
      if (!context.existingEntry) {
        if (params.allowCreate !== true) {
          lifecycleError = resolveSessionWorkStartError(params.sessionKey, void 0, {
            expectedSessionId: params.initialEntry.sessionId,
          });
          return null;
        }
        return params.entry;
      }
      lifecycleError = resolveSessionWorkStartError(params.sessionKey, context.existingEntry, {
        expectedSessionId: params.initialEntry.sessionId,
      });
      if (lifecycleError) {
        lifecycleEntry = context.existingEntry;
        return null;
      }
      if (
        sessionSnapshotTouchedFieldsConflict({
          initial: params.initialEntry,
          next: params.entry,
          current: context.existingEntry,
          touchedFields: params.touchedFields,
        })
      )
        return null;
      return mergeSessionSnapshotChanges({
        initial: params.initialEntry,
        next: params.entry,
        current: context.existingEntry,
        reassertLiveModelSwitchPending: params.reassertLiveModelSwitchPending,
      });
    },
    {
      fallbackEntry: params.entry,
      replaceEntry: true,
      skipMaintenance: params.skipMaintenance,
    },
  );
  if (lifecycleError)
    return {
      status: "lifecycle-invalidated",
      error: lifecycleError,
      ...(lifecycleEntry ? { entry: lifecycleEntry } : {}),
    };
  if (!persisted)
    return {
      status: "lifecycle-invalidated",
      error: `Session "${params.sessionKey}" changed while starting work. Retry.`,
    };
  return {
    status: "current",
    entry: persisted,
  };
}
//#endregion
export { persistReplySessionEntry as t };
