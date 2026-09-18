import { c as callGateway } from "./call-BVMO6az_.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-Br1guPTt.js";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-DZMZaF9B.js";
import { r as withProgress } from "./progress-DXZjrYcT.js";
//#region src/cli/gateway-rpc.runtime.ts
const DEFAULT_GATEWAY_RPC_TIMEOUT_MS = 3e4;
async function callGatewayFromCliRuntime(method, opts, params, extra) {
  const showProgress = extra?.progress ?? opts.json !== true;
  const timeoutMs = parseTimeoutMsWithFallback(opts.timeout, DEFAULT_GATEWAY_RPC_TIMEOUT_MS, {
    invalidType: "error",
  });
  return await withProgress(
    {
      label: `Gateway ${method}`,
      indeterminate: true,
      enabled: showProgress,
    },
    async () =>
      await callGateway({
        url: opts.url,
        token: opts.token,
        method,
        params,
        deviceIdentity: extra?.deviceIdentity,
        expectFinal: extra?.expectFinal ?? Boolean(opts.expectFinal),
        scopes: extra?.scopes,
        signal: extra?.signal,
        timeoutMs,
        clientName: extra?.clientName ?? GATEWAY_CLIENT_NAMES.CLI,
        mode: extra?.mode ?? GATEWAY_CLIENT_MODES.CLI,
      }),
  );
}
//#endregion
export { callGatewayFromCliRuntime };
