import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { a as resolveSessionStoreTargets } from "./targets-CjMfpXbt.js";
import "./sessions-CEG7v41b.js";
//#region src/commands/session-store-targets.ts
/**
 * Session store target resolution wrapper for CLI commands.
 *
 * The config helper throws on invalid agent/store combinations; this module
 * converts those errors into command output and exit codes.
 */
/** Resolves session store targets or exits the current command on validation errors. */
function resolveSessionStoreTargetsOrExit(params) {
  try {
    return resolveSessionStoreTargets(params.cfg, params.opts);
  } catch (error) {
    params.runtime.error(formatErrorMessage(error));
    params.runtime.exit(1);
    return null;
  }
}
//#endregion
export { resolveSessionStoreTargetsOrExit as t };
