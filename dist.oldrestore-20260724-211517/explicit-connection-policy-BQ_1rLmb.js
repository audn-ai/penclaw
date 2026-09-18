import { a as trimToUndefined } from "./credential-planner-BTC1pLMc.js";
import "./credentials-DqHTozxM.js";
//#region src/gateway/explicit-connection-policy.ts
function hasExplicitGatewayConnectionAuth(auth) {
  return Boolean(trimToUndefined(auth?.token) || trimToUndefined(auth?.password));
}
/** Returns true when url/auth flags are sufficient and loading OpenClaw config is unnecessary. */
function canSkipGatewayConfigLoad(params) {
  return (
    !params.config &&
    Boolean(trimToUndefined(params.urlOverride)) &&
    hasExplicitGatewayConnectionAuth(params.explicitAuth)
  );
}
/** Returns true for command families that intentionally bypass gateway config loading. */
function isGatewayConfigBypassCommandPath(commandPath) {
  return commandPath[0] === "cron";
}
//#endregion
export { isGatewayConfigBypassCommandPath as n, canSkipGatewayConfigLoad as t };
