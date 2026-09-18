import { n as extractErrorCode } from "./errors-BoHeli7m.js";
import { t as sanitizeTerminalText } from "./safe-text-DiGQuw-e.js";
//#region src/config/io.invalid-config.ts
/**
 * Shared invalid-config formatting, logging, and error helpers for config reads and mutations.
 * All terminal-facing text is sanitized here so callers can reuse the same failure surface.
 */
/** Formats validation issues as terminal-safe bullet lines for config load failures. */
function formatInvalidConfigDetails(issues) {
  return issues
    .map(
      (issue) =>
        `- ${sanitizeTerminalText(issue.path || "<root>")}: ${sanitizeTerminalText(issue.message)}`,
    )
    .join("\n");
}
/** Builds the one-line invalid-config prefix plus preformatted validation details. */
function formatInvalidConfigLogMessage(configPath, details) {
  return `Invalid config at ${configPath}:\\n${details}`;
}
/** Logs an invalid config message once per path during a load sequence. */
function logInvalidConfigOnce(params) {
  if (params.loggedConfigPaths.has(params.configPath)) return;
  params.loggedConfigPaths.add(params.configPath);
  params.logger.error(formatInvalidConfigLogMessage(params.configPath, params.details));
}
/** Creates the tagged error shape used by callers that need details after catch. */
function createInvalidConfigError(configPath, details) {
  const error = /* @__PURE__ */ new Error(`Invalid config at ${configPath}:\n${details}`);
  error.name = "InvalidConfigError";
  error.code = "INVALID_CONFIG";
  error.details = details;
  return error;
}
function isInvalidConfigError(err) {
  return extractErrorCode(err) === "INVALID_CONFIG";
}
/** Logs and throws the standard invalid-config error for a validation result. */
function throwInvalidConfig(params) {
  const details = formatInvalidConfigDetails(params.issues);
  logInvalidConfigOnce({
    configPath: params.configPath,
    details,
    logger: params.logger,
    loggedConfigPaths: params.loggedConfigPaths,
  });
  throw createInvalidConfigError(params.configPath, details);
}
//#endregion
export {
  throwInvalidConfig as i,
  formatInvalidConfigDetails as n,
  isInvalidConfigError as r,
  createInvalidConfigError as t,
};
