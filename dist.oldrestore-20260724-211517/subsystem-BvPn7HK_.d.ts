import { n as RuntimeEnv, t as OutputRuntimeEnv } from "./runtime-Bxifh4bY.js";

//#region src/logging/levels.d.ts
declare const ALLOWED_LOG_LEVELS: readonly [
  "silent",
  "fatal",
  "error",
  "warn",
  "info",
  "debug",
  "trace",
];
type LogLevel = (typeof ALLOWED_LOG_LEVELS)[number];
declare function normalizeLogLevel(
  level?: string,
  fallback?: LogLevel,
): "error" | "silent" | "info" | "trace" | "warn" | "fatal" | "debug";
declare function levelToMinLevel(level: LogLevel): number;
//#endregion
//#region src/logging/subsystem.d.ts
type SubsystemLogger = {
  subsystem: string;
  isEnabled: (level: LogLevel, target?: "any" | "console" | "file") => boolean;
  trace: (message: string, meta?: Record<string, unknown>) => void;
  debug: (message: string, meta?: Record<string, unknown>) => void;
  info: (message: string, meta?: Record<string, unknown>) => void;
  warn: (message: string, meta?: Record<string, unknown>) => void;
  error: (message: string, meta?: Record<string, unknown>) => void;
  fatal: (message: string, meta?: Record<string, unknown>) => void;
  raw: (message: string) => void;
  child: (name: string) => SubsystemLogger;
};
declare function stripRedundantSubsystemPrefixForConsole(
  message: string,
  displaySubsystem: string,
): string;
declare function createSubsystemLogger(subsystem: string): SubsystemLogger;
declare function runtimeForLogger(
  logger: SubsystemLogger,
  exit?: RuntimeEnv["exit"],
): OutputRuntimeEnv;
declare function createSubsystemRuntime(
  subsystem: string,
  exit?: RuntimeEnv["exit"],
): OutputRuntimeEnv;
//#endregion
export {
  stripRedundantSubsystemPrefixForConsole as a,
  levelToMinLevel as c,
  runtimeForLogger as i,
  normalizeLogLevel as l,
  createSubsystemLogger as n,
  ALLOWED_LOG_LEVELS as o,
  createSubsystemRuntime as r,
  LogLevel as s,
  SubsystemLogger as t,
};
