import { t as explainShellCommand } from "./extract-skAT4q_B.js";
import {
  c as isShellWrapperExecutable,
  j as normalizeExecutableToken,
  t as POSIX_SHELL_WRAPPERS,
  u as resolveShellWrapperTransportArgv,
} from "./shell-wrapper-resolution-DlXABXcG.js";
//#region src/infra/command-explainer/format.ts
const POSIX_COMMAND_HIGHLIGHT_SHELLS = POSIX_SHELL_WRAPPERS;
function spanToCommandSpan(span) {
  if (!Number.isSafeInteger(span.startIndex) || !Number.isSafeInteger(span.endIndex)) return null;
  if (span.startIndex < 0 || span.endIndex <= span.startIndex) return null;
  return {
    startIndex: span.startIndex,
    endIndex: span.endIndex,
  };
}
function isUnsupportedShellWrapperArgv(argv) {
  const executable = (resolveShellWrapperTransportArgv([...argv]) ?? argv)[0];
  if (!executable) return false;
  const normalizedExecutable = normalizeExecutableToken(executable);
  return (
    isShellWrapperExecutable(normalizedExecutable) &&
    !POSIX_COMMAND_HIGHLIGHT_SHELLS.has(normalizedExecutable)
  );
}
function hasUnsupportedShellWrapper(explanation) {
  return explanation.topLevelCommands.some((command) =>
    isUnsupportedShellWrapperArgv(command.argv),
  );
}
/** Converts a parsed command explanation into source spans suitable for approval UI. */
function formatCommandSpans(explanation) {
  if (hasUnsupportedShellWrapper(explanation)) return [];
  const commandSpans = [];
  for (const command of [...explanation.topLevelCommands, ...explanation.nestedCommands]) {
    const commandSpan = spanToCommandSpan(command.executableSpan);
    if (commandSpan) commandSpans.push(commandSpan);
  }
  return commandSpans;
}
//#endregion
//#region src/agents/bash-tools.exec-approval-request.runtime.ts
/**
 * Lazy runtime for exec approval command highlighting.
 * Kept separate so importing approval request code does not load the command
 * explainer until command spans are explicitly requested.
 */
/** Resolve command spans used to highlight exec approval prompts. */
async function resolveExecApprovalCommandSpans(command) {
  const commandSpans = formatCommandSpans(await explainShellCommand(command));
  return commandSpans.length > 0 ? commandSpans : void 0;
}
//#endregion
export { resolveExecApprovalCommandSpans };
