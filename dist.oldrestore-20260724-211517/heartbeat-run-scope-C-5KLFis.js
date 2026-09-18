//#region src/infra/heartbeat-run-scope.ts
const HEARTBEAT_RUN_SCOPE = Symbol("openclaw.heartbeatRunScope");
function resolveHeartbeatRunScope(options) {
  return options?.[HEARTBEAT_RUN_SCOPE];
}
//#endregion
export { resolveHeartbeatRunScope as n, HEARTBEAT_RUN_SCOPE as t };
