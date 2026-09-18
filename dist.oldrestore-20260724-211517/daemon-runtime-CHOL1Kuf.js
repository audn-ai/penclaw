//#region src/commands/daemon-runtime.ts
const DEFAULT_GATEWAY_DAEMON_RUNTIME = "node";
const GATEWAY_DAEMON_RUNTIME_OPTIONS = [
  {
    value: "node",
    label: "Node",
    hint: "Required for OpenClaw's SQLite-backed runtime state.",
  },
];
/** Narrow arbitrary input to a supported Gateway daemon runtime id. */
function isGatewayDaemonRuntime(value) {
  return value === "node";
}
//#endregion
export {
  GATEWAY_DAEMON_RUNTIME_OPTIONS as n,
  isGatewayDaemonRuntime as r,
  DEFAULT_GATEWAY_DAEMON_RUNTIME as t,
};
