import { t as resolveCliCommandPathPolicy } from "./command-path-policy-CHhtag3S.js";
import { n as isTruthyEnvValue } from "./env-Di-LcxqW.js";
//#region src/cli/command-startup-policy.ts
function shouldBypassConfigGuardForCommandPath(commandPath) {
  return resolveCliCommandPathPolicy(commandPath).bypassConfigGuard;
}
function shouldLoadPlugins(params) {
  const loadPlugins = params.loadPlugins;
  if (typeof loadPlugins === "function")
    return loadPlugins({
      argv: params.argv ?? [],
      commandPath: params.commandPath,
      jsonOutputMode: params.jsonOutputMode,
    });
  return loadPlugins === "always" || (loadPlugins === "text-only" && !params.jsonOutputMode);
}
function resolveCliStartupPolicy(params) {
  const commandPolicy = resolveCliCommandPathPolicy(params.commandPath);
  const ownsProtocolStdout = params.protocolCommandPath
    ? resolveCliCommandPathPolicy(params.protocolCommandPath).ownsProtocolStdout
    : commandPolicy.ownsProtocolStdout;
  const suppressDoctorStdout = params.jsonOutputMode || ownsProtocolStdout;
  return {
    suppressDoctorStdout,
    hideBanner:
      isTruthyEnvValue((params.env ?? process.env).OPENCLAW_HIDE_BANNER) ||
      commandPolicy.hideBanner,
    skipConfigGuard: params.routeMode
      ? commandPolicy.routeConfigGuard === "always" ||
        (commandPolicy.routeConfigGuard === "when-suppressed" && suppressDoctorStdout)
      : false,
    loadPlugins: shouldLoadPlugins({
      argv: params.argv,
      commandPath: params.commandPath,
      jsonOutputMode: params.jsonOutputMode,
      loadPlugins: commandPolicy.loadPlugins,
    }),
    pluginRegistry: commandPolicy.pluginRegistry,
  };
}
//#endregion
export { shouldBypassConfigGuardForCommandPath as n, resolveCliStartupPolicy as t };
