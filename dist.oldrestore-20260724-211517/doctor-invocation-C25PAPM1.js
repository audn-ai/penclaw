import { n as isTruthyEnvValue } from "./env-Di-LcxqW.js";
import "./update-phase-RYqcMEby.js";
//#region src/commands/doctor-invocation.ts
/** Internal doctor invocation capabilities shared by direct and automated callers. */
const DOCTOR_DISABLE_CROSS_STATE_DIR_IMPORTS_ENV =
  "OPENCLAW_DOCTOR_DISABLE_CROSS_STATE_DIR_IMPORTS";
/** Direct CLI doctor owns cross-state imports unless its automation parent denies them. */
function resolveDoctorCrossStateDirImports(env = process.env) {
  return !(
    isTruthyEnvValue(env["OPENCLAW_DOCTOR_DISABLE_CROSS_STATE_DIR_IMPORTS"]) ||
    isTruthyEnvValue(env["OPENCLAW_UPDATE_IN_PROGRESS"])
  );
}
//#endregion
export { resolveDoctorCrossStateDirImports as n, DOCTOR_DISABLE_CROSS_STATE_DIR_IMPORTS_ENV as t };
