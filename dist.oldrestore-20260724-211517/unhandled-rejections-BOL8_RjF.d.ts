import { m as ConsoleStyle } from "./logger-6821cSkN.js";
import { s as LogLevel } from "./subsystem-BvPn7HK_.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/logging/console.d.ts
type ConsoleSettings = {
  level: LogLevel;
  style: ConsoleStyle;
};
type ConsoleLoggerSettings = ConsoleSettings;
type ConsoleConfigLoader = () => OpenClawConfig["logging"] | undefined;
declare function setConsoleConfigLoaderForTests(loader?: ConsoleConfigLoader): void;
declare function getConsoleSettings(): ConsoleLoggerSettings;
declare function getResolvedConsoleSettings(): ConsoleLoggerSettings;
declare function routeLogsToStderr(): void;
declare function setConsoleSubsystemFilter(filters?: string[] | null): void;
declare function setConsoleTimestampPrefix(enabled: boolean): void;
declare function shouldLogSubsystemToConsole(subsystem?: string | null): boolean;
/**
 * Route console.* calls through file logging while still emitting to stdout/stderr.
 * This keeps user-facing output unchanged but guarantees every console call is captured in log files.
 */
declare function enableConsoleCapture(): void;
//#endregion
//#region src/infra/abort-signal.d.ts
/** Resolves when the signal aborts, or immediately when no wait is needed. */
declare function waitForAbortSignal(signal?: AbortSignal): Promise<void>;
//#endregion
//#region src/infra/unhandled-rejections.d.ts
type UnhandledRejectionHandler = (reason: unknown) => boolean;
type UncaughtExceptionHandler = (error: unknown) => boolean;
/**
 * Checks if an error is a transient network error that shouldn't crash the gateway.
 * These are typically temporary connectivity issues that will resolve on their own.
 */
declare function registerUnhandledRejectionHandler(handler: UnhandledRejectionHandler): () => void;
declare function registerUncaughtExceptionHandler(handler: UncaughtExceptionHandler): () => void;
//#endregion
export {
  enableConsoleCapture as a,
  routeLogsToStderr as c,
  setConsoleTimestampPrefix as d,
  shouldLogSubsystemToConsole as f,
  ConsoleLoggerSettings as i,
  setConsoleConfigLoaderForTests as l,
  registerUnhandledRejectionHandler as n,
  getConsoleSettings as o,
  waitForAbortSignal as r,
  getResolvedConsoleSettings as s,
  registerUncaughtExceptionHandler as t,
  setConsoleSubsystemFilter as u,
};
