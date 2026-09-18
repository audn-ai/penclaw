import {
  a as emitInternalDiagnosticEvent,
  t as areDiagnosticsEnabledForProcess,
} from "./diagnostic-events-5-gsFhkM.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region src/logging/diagnostic-runtime.ts
const diag = createSubsystemLogger("diagnostic");
let lastActivityAt = 0;
/** Root diagnostic subsystem logger. */
const diagnosticLogger = diag;
/** Marks that diagnostics emitted useful activity. */
function markDiagnosticActivity() {
  lastActivityAt = Date.now();
}
/** Returns the last diagnostic activity timestamp for watchdog-style checks. */
function getLastDiagnosticActivityAt() {
  return lastActivityAt;
}
/** Clears diagnostic activity state for tests. */
function resetDiagnosticActivityForTest() {
  lastActivityAt = 0;
}
/** Logs and emits a diagnostic event when work enters a serialized lane. */
function logLaneEnqueue(lane, queueSize) {
  if (!areDiagnosticsEnabledForProcess()) return;
  diag.debug(`lane enqueue: lane=${lane} queueSize=${queueSize}`);
  emitInternalDiagnosticEvent({
    type: "queue.lane.enqueue",
    lane,
    queueSize,
  });
  markDiagnosticActivity();
}
/** Logs and emits a diagnostic event when work leaves a serialized lane. */
function logLaneDequeue(lane, waitMs, queueSize) {
  if (!areDiagnosticsEnabledForProcess()) return;
  diag.debug(`lane dequeue: lane=${lane} waitMs=${waitMs} queueSize=${queueSize}`);
  emitInternalDiagnosticEvent({
    type: "queue.lane.dequeue",
    lane,
    queueSize,
    waitMs,
  });
  markDiagnosticActivity();
}
//#endregion
export {
  markDiagnosticActivity as a,
  logLaneEnqueue as i,
  getLastDiagnosticActivityAt as n,
  resetDiagnosticActivityForTest as o,
  logLaneDequeue as r,
  diagnosticLogger as t,
};
