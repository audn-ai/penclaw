import {
  h as resolveFutureConfigActionBlock,
  m as formatFutureConfigActionBlock,
  n as cloneEnvWithPlatformSemantics,
  o as createConfigRuntimeEnv,
  p as ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV,
} from "./config-env-vars-CwdMUFhk.js";
//#region src/cli/gateway-cli/future-config-guard.ts
function resolveGatewayRunFutureConfigBlock(params) {
  const processServiceMode = Boolean(process.env.OPENCLAW_SERVICE_MARKER?.trim());
  const candidateConfig =
    params.config ??
    (params.snapshot?.valid ? (params.snapshot.sourceConfig ?? params.snapshot.config) : void 0);
  const candidateServiceMode =
    !params.opts.reset &&
    Boolean(
      candidateConfig
        ? createConfigRuntimeEnv(candidateConfig, process.env).OPENCLAW_SERVICE_MARKER?.trim()
        : void 0,
    );
  const serviceMode = processServiceMode || candidateServiceMode;
  const futureAction = params.opts.reset
    ? {
        action: "reset the dev gateway state",
        exitCode: 1,
      }
    : serviceMode
      ? {
          action: "start the gateway service",
          exitCode: 78,
        }
      : params.opts.force
        ? {
            action: "force-kill gateway port listeners",
            exitCode: 1,
          }
        : {
            action: "run automatic gateway startup migrations",
            exitCode: 1,
          };
  const guardEnv = serviceMode ? cloneEnvWithPlatformSemantics(process.env) : process.env;
  if (serviceMode) delete guardEnv[ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV];
  const block = resolveFutureConfigActionBlock({
    action: futureAction.action,
    snapshot: params.snapshot,
    config: params.config,
    env: guardEnv,
  });
  return block
    ? {
        block,
        exitCode: futureAction.exitCode,
        serviceMode,
      }
    : null;
}
function isGatewayRunFutureConfigAllowed(params) {
  return resolveGatewayRunFutureConfigBlock(params) === null;
}
function enforceGatewayRunFutureConfigGuard(params) {
  const resolved = resolveGatewayRunFutureConfigBlock(params);
  if (!resolved) return true;
  if (resolved.serviceMode) delete process.env[ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV];
  params.runtime.error(formatFutureConfigActionBlock(resolved.block));
  params.runtime.exit(resolved.exitCode);
  return false;
}
//#endregion
export { isGatewayRunFutureConfigAllowed as n, enforceGatewayRunFutureConfigGuard as t };
