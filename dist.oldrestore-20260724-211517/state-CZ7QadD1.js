//#region src/logging/state.ts
const LOGGING_STATE_KEY = Symbol.for("openclaw.loggingState");
function createLoggingState() {
  return {
    cachedLogger: null,
    cachedSettings: null,
    cachedConsoleSettings: null,
    overrideSettings: null,
    invalidEnvLogLevelValue: null,
    consolePatched: false,
    forceConsoleToStderr: false,
    consoleTimestampPrefix: false,
    consoleSubsystemFilter: null,
    resolvingConsoleSettings: false,
    streamErrorHandlersInstalled: false,
    rawConsole: null,
  };
}
const globalStore = globalThis;
const loggingState = globalStore[LOGGING_STATE_KEY] ?? createLoggingState();
globalStore[LOGGING_STATE_KEY] = loggingState;
//#endregion
export { loggingState as t };
