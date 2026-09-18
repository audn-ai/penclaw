import { t as clearActiveProgressLine } from "./progress-line-DiTuCPbL.js";
import { t as restoreTerminalState } from "./restore-BWpek1U9.js";
//#region src/runtime.ts
function shouldEmitRuntimeLog(env = process.env) {
  if (env.VITEST !== "true") return true;
  if (env.OPENCLAW_TEST_RUNTIME_LOG === "1") return true;
  return typeof console.log.mock === "object";
}
function shouldEmitRuntimeStdout(env = process.env) {
  if (env.VITEST !== "true") return true;
  if (env.OPENCLAW_TEST_RUNTIME_LOG === "1") return true;
  return typeof process.stdout.write.mock === "object";
}
function isPipeClosedError(err) {
  const code = err?.code;
  return code === "EPIPE" || code === "EIO";
}
function hasRuntimeOutputWriter(runtime) {
  return typeof runtime.writeStdout === "function";
}
function writeStdout(value) {
  if (!shouldEmitRuntimeStdout()) return;
  clearActiveProgressLine();
  const line = value.endsWith("\n") ? value : `${value}\n`;
  try {
    process.stdout.write(line);
  } catch (err) {
    if (isPipeClosedError(err)) return;
    throw err;
  }
}
function createRuntimeIo() {
  return {
    log: (...args) => {
      if (!shouldEmitRuntimeLog()) return;
      clearActiveProgressLine();
      console.log(...args);
    },
    error: (...args) => {
      clearActiveProgressLine();
      console.error(...args);
    },
    writeStdout,
    writeJson: (value, space = 2) => {
      writeStdout(JSON.stringify(value, null, space > 0 ? space : void 0));
    },
  };
}
const defaultRuntime = {
  ...createRuntimeIo(),
  exit: (code) => {
    restoreTerminalState("runtime exit", { resumeStdinIfPaused: false });
    process.exit(code);
    throw new Error("unreachable");
  },
};
/** Signals a deferred or non-exiting runtime exit so callers can unwind owned resources. */
var ExitError = class extends Error {
  constructor(code, message) {
    super(message ?? `exit ${code}`);
    this.code = code;
    this.name = "ExitError";
  }
};
function createNonExitingRuntime() {
  return {
    ...createRuntimeIo(),
    exit: (code) => {
      throw new ExitError(code);
    },
  };
}
function writeRuntimeJson(runtime, value, space = 2) {
  if (hasRuntimeOutputWriter(runtime)) {
    runtime.writeJson(value, space);
    return;
  }
  runtime.log(JSON.stringify(value, null, space > 0 ? space : void 0));
}
//#endregion
export { writeRuntimeJson as i, createNonExitingRuntime as n, defaultRuntime as r, ExitError as t };
