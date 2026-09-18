import { n as isTruthyEnvValue } from "./env-Di-LcxqW.js";
//#region src/commands/doctor-repair-mode.ts
/** Resolves doctor repair mode from CLI flags, TTY state, and update environment. */
/** Resolves the effective repair/prompting mode for a doctor invocation. */
function resolveDoctorRepairMode(options) {
  const yes = options.yes === true;
  const requestedNonInteractive = options.nonInteractive === true;
  const shouldRepair = options.repair === true || yes;
  const shouldForce = options.force === true;
  const isTty = process.stdin.isTTY;
  const nonInteractive = requestedNonInteractive || (!isTty && !yes);
  const updateInProgress = isTruthyEnvValue(process.env.OPENCLAW_UPDATE_IN_PROGRESS);
  return {
    shouldRepair,
    shouldForce,
    nonInteractive,
    canPrompt: isTty && !yes && !nonInteractive,
    updateInProgress,
  };
}
/** Returns true for noninteractive updater-driven doctor repair runs. */
function isDoctorUpdateRepairMode(mode) {
  return mode.updateInProgress && mode.nonInteractive;
}
/** Returns whether a doctor repair prompt should be auto-approved under the current mode. */
function shouldAutoApproveDoctorFix(mode, params = {}) {
  if (!mode.shouldRepair) return false;
  if (params.requiresForce && !mode.shouldForce) return false;
  if (params.blockDuringUpdate && isDoctorUpdateRepairMode(mode)) return false;
  return true;
}
//#endregion
export {
  resolveDoctorRepairMode as n,
  shouldAutoApproveDoctorFix as r,
  isDoctorUpdateRepairMode as t,
};
