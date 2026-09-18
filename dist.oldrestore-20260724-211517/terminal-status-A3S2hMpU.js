//#region src/config/sessions/terminal-status.ts
/** Returns true for terminal statuses that a later visible turn may recover in place. */
function isRecoverableTerminalSessionStatus(status) {
  return status === "failed" || status === "timeout" || status === "killed";
}
/** Clears stale terminal lifecycle fields before reusing a recoverable session entry. */
function recoverTerminalSessionEntryForVisibleTurn(entry) {
  return {
    ...entry,
    status: void 0,
    startedAt: void 0,
    endedAt: void 0,
    runtimeMs: void 0,
    abortedLastRun: void 0,
    restartRecoveryForceSafeTools: void 0,
  };
}
//#endregion
export { recoverTerminalSessionEntryForVisibleTurn as n, isRecoverableTerminalSessionStatus as t };
