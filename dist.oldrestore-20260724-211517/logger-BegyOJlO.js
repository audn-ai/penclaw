import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./src-Bl7G9qvi.js";
import { t as isVerbose } from "./global-state-BAD7XgmL.js";
import { i as getLogger } from "./logger-BUux_Jpv.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { r as theme } from "./theme-vjDs9tao.js";
//#region src/logger.ts
const subsystemPrefixRe = /^([a-z][a-z0-9-]{1,20}):\s+(.*)$/i;
function splitSubsystem(message) {
  const match = message.match(subsystemPrefixRe);
  if (!match) return null;
  const subsystem = match.at(1);
  const rest = match.at(2);
  if (subsystem === void 0 || rest === void 0) return null;
  return {
    subsystem,
    rest,
  };
}
function logWithSubsystem(params) {
  const parsed = params.runtime === defaultRuntime ? splitSubsystem(params.message) : null;
  if (parsed) {
    expectDefined(
      createSubsystemLogger(parsed.subsystem)[params.subsystemMethod],
      "subsystem logger method",
    )(parsed.rest);
    return;
  }
  params.runtime[params.runtimeMethod](params.runtimeFormatter(params.message));
  getLogger()[params.loggerMethod](params.message);
}
const info = theme.info;
const warn = theme.warn;
const success = theme.success;
const danger = theme.error;
function logInfo(message, runtime = defaultRuntime) {
  logWithSubsystem({
    message,
    runtime,
    runtimeMethod: "log",
    runtimeFormatter: info,
    loggerMethod: "info",
    subsystemMethod: "info",
  });
}
function logWarn(message, runtime = defaultRuntime) {
  logWithSubsystem({
    message,
    runtime,
    runtimeMethod: "log",
    runtimeFormatter: warn,
    loggerMethod: "warn",
    subsystemMethod: "warn",
  });
}
function logSuccess(message, runtime = defaultRuntime) {
  logWithSubsystem({
    message,
    runtime,
    runtimeMethod: "log",
    runtimeFormatter: success,
    loggerMethod: "info",
    subsystemMethod: "info",
  });
}
function logError(message, runtime = defaultRuntime) {
  logWithSubsystem({
    message,
    runtime,
    runtimeMethod: "error",
    runtimeFormatter: danger,
    loggerMethod: "error",
    subsystemMethod: "error",
  });
}
function logDebug(message) {
  getLogger().debug(message);
  if (isVerbose()) console.log(theme.muted(message));
}
//#endregion
export { logWarn as a, logSuccess as i, logError as n, logInfo as r, logDebug as t };
