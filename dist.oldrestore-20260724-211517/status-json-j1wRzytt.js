import { t as runStatusJsonCommand } from "./status-json-command-C5Su7yB_.js";
import { t as scanStatusJsonFast } from "./status.scan.fast-json-EhkPlBGL.js";
//#region src/commands/status-json.ts
/** Runs status JSON with the standard fast scan and all-mode security audit behavior. */
async function statusJsonCommand(opts, runtime) {
  await runStatusJsonCommand({
    opts,
    runtime,
    scanStatusJsonFast,
    includeSecurityAudit: opts.all === true,
    suppressHealthErrors: true,
  });
}
//#endregion
export { statusJsonCommand };
