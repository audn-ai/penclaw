import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region src/process/supervisor/supervisor-log.runtime.ts
/** Runtime logging boundary for lazy supervisor paths and focused test mocks. */
const log = createSubsystemLogger("process/supervisor");
/** Report spawn failures without importing the full logging subsystem in tests. */
function warnProcessSupervisorSpawnFailure(message) {
  log.warn(message);
}
//#endregion
export { warnProcessSupervisorSpawnFailure };
