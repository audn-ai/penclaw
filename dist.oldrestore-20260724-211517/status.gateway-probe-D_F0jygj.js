import { r as resolveGatewayProbeAuthSafeWithSecretInputs } from "./probe-auth-BDCrvP-B.js";
import { t as resolveGatewayProbeTarget } from "./probe-target-CwU9IYs8.js";
//#region src/commands/status.gateway-probe.ts
/** Resolves gateway probe auth plus any non-secret warning about credential lookup. */
async function resolveGatewayProbeAuthResolution(cfg) {
  return resolveGatewayProbeAuthSafeWithSecretInputs({
    cfg,
    mode: resolveGatewayProbeTarget(cfg).mode,
    env: process.env,
  });
}
//#endregion
export { resolveGatewayProbeAuthResolution };
