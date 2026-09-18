import { n as inheritOptionFromParent } from "./command-options-Bv6UxUlT.js";
//#region src/cli/gateway-cli/run-options.ts
const GATEWAY_RUN_VALUE_KEYS = [
  "port",
  "bind",
  "token",
  "auth",
  "password",
  "passwordFile",
  "tailscale",
  "wsLog",
  "rawStreamPath",
];
const GATEWAY_RUN_BOOLEAN_KEYS = [
  "tailscaleResetOnExit",
  "allowUnconfigured",
  "dev",
  "reset",
  "force",
  "verbose",
  "cliBackendLogs",
  "claudeCliLogs",
  "compact",
  "rawStream",
];
function resolveGatewayRunOptions(opts, command) {
  const resolved = { ...opts };
  for (const key of GATEWAY_RUN_VALUE_KEYS) {
    const inherited = inheritOptionFromParent(command, key);
    if (key === "wsLog") {
      resolved[key] = inherited ?? resolved[key];
      continue;
    }
    resolved[key] = resolved[key] ?? inherited;
  }
  for (const key of GATEWAY_RUN_BOOLEAN_KEYS) {
    const inherited = inheritOptionFromParent(command, key);
    resolved[key] = Boolean(resolved[key] || inherited);
  }
  return resolved;
}
//#endregion
export { resolveGatewayRunOptions as t };
