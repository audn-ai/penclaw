import { t as loggingState } from "./state-CZ7QadD1.js";
//#region src/cli/json-output-mode.ts
/** Detects CLI JSON mode before Commander parses options, stopping at the argv sentinel. */
function hasJsonOutputFlag(argv) {
  for (const arg of argv) {
    if (arg === "--") return false;
    if (arg === "--json" || arg.startsWith("--json=")) return true;
  }
  return false;
}
/** Keeps structured JSON stdout clean by routing incidental console logs to stderr. */
async function withConsoleLogsRoutedToStderrForJson(argv, run) {
  if (!hasJsonOutputFlag(argv)) return run();
  const previousForceStderr = loggingState.forceConsoleToStderr;
  loggingState.forceConsoleToStderr = true;
  try {
    return await run();
  } finally {
    loggingState.forceConsoleToStderr = previousForceStderr;
  }
}
//#endregion
export { withConsoleLogsRoutedToStderrForJson as n, hasJsonOutputFlag as t };
