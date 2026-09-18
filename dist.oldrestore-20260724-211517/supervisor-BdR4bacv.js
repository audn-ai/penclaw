import crypto from "node:crypto";
import { performance } from "node:perf_hooks";
import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { n as signalProcessTree } from "./kill-tree-Cr15jS_s.js";
import "./src-Bl7G9qvi.js";
import "./errors-BoHeli7m.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { t as prepareOomScoreAdjustedSpawn } from "./linux-oom-score-eO5nXmjv.js";
import { r as getShellConfig } from "./shell-utils-MIUiOyvx.js";
import { n as spawnWithFallback, r as createWindowsOutputDecoder } from "./spawn-utils-56OFmOgi.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { n as sliceUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import {
  a as resolveWindowsCommandShim,
  i as resolveTrustedWindowsCmdExe,
  n as isWindowsBatchCommand,
  t as buildWindowsCmdExeCommandLine,
} from "./windows-command-DMZlx6HX.js";
import {
  i as resolveWindowsExecutablePath,
  o as resolveWindowsSpawnProgramCandidate,
} from "./windows-spawn-C5RDaB22.js";
//#region src/process/supervisor/adapters/env.ts
/** Convert Node's optional env values into the concrete string map spawn adapters expect. */
function toStringEnv(env) {
  if (!env) return {};
  const out = {};
  for (const [key, value] of Object.entries(env)) {
    if (value === void 0) continue;
    out[key] = value;
  }
  return out;
}
//#endregion
//#region src/process/supervisor/adapters/child.ts
const FORCE_KILL_WAIT_FALLBACK_MS$1 = 4e3;
const WINDOWS_CLOSE_STATE_SETTLE_TIMEOUT_MS = 250;
const WINDOWS_PACKAGE_MANAGER_SHIMS = ["npm", "pnpm", "yarn", "npx"];
function resolveChildInvocation(params) {
  const command = params.argv[0] ?? "";
  const candidate = resolveWindowsSpawnProgramCandidate({
    command,
    env: params.env,
    execPath:
      process.platform === "win32"
        ? resolveWindowsExecutablePath("node", params.env ?? process.env)
        : void 0,
  });
  const args = [...candidate.leadingArgv, ...params.argv.slice(1)];
  const resolvedCommand =
    candidate.resolution === "direct" && candidate.command === command
      ? resolveWindowsCommandShim({
          command,
          cmdCommands: WINDOWS_PACKAGE_MANAGER_SHIMS,
        })
      : candidate.command;
  if (!isWindowsBatchCommand(resolvedCommand))
    return {
      command: resolvedCommand,
      args,
      windowsVerbatimArguments: params.windowsVerbatimArguments,
    };
  return {
    command: resolveTrustedWindowsCmdExe(),
    args: ["/d", "/s", "/c", buildWindowsCmdExeCommandLine(resolvedCommand, args)],
    windowsVerbatimArguments: true,
  };
}
function isServiceManagedRuntime() {
  return Boolean(process.env.OPENCLAW_SERVICE_MARKER?.trim());
}
async function createChildAdapter(params) {
  const baseEnv = params.env ? toStringEnv(params.env) : void 0;
  const invocation = resolveChildInvocation({
    argv: params.argv,
    env: baseEnv,
    windowsVerbatimArguments: params.windowsVerbatimArguments,
  });
  const preparedSpawn = prepareOomScoreAdjustedSpawn(invocation.command, invocation.args, {
    env: baseEnv,
  });
  const stdinMode = params.stdinMode ?? (params.input !== void 0 ? "pipe-closed" : "inherit");
  const useDetached = process.platform !== "win32" && !isServiceManagedRuntime();
  const options = {
    cwd: params.cwd,
    env: preparedSpawn.env,
    stdio: ["pipe", "pipe", "pipe"],
    detached: useDetached,
    windowsHide: true,
    windowsVerbatimArguments: invocation.windowsVerbatimArguments,
  };
  if (stdinMode === "inherit") options.stdio = ["inherit", "pipe", "pipe"];
  else options.stdio = ["pipe", "pipe", "pipe"];
  const spawned = await spawnWithFallback({
    argv: [preparedSpawn.command, ...preparedSpawn.args],
    options,
    fallbacks: useDetached
      ? [
          {
            label: "no-detach",
            options: { detached: false },
          },
        ]
      : [],
  });
  const child = spawned.child;
  const ignoreOutputStreamError = () => {};
  child.stdout.on("error", ignoreOutputStreamError);
  child.stderr.on("error", ignoreOutputStreamError);
  const childStdin = spawned.child.stdin;
  let stdinDestroyed = childStdin?.destroyed ?? false;
  let stdinEnded = childStdin?.writableEnded === true || childStdin?.writableFinished === true;
  if (childStdin) {
    childStdin.once("finish", () => {
      stdinEnded = true;
    });
    childStdin.once("close", () => {
      stdinEnded = true;
      stdinDestroyed = true;
    });
    childStdin.once("error", () => {
      stdinDestroyed = true;
    });
    if (params.input !== void 0) {
      childStdin.write(params.input);
      stdinEnded = true;
      childStdin.end();
    } else if (stdinMode === "pipe-closed") {
      stdinEnded = true;
      childStdin.end();
    }
  }
  const stdin = childStdin
    ? {
        get destroyed() {
          return stdinDestroyed || childStdin.destroyed;
        },
        get writable() {
          return !stdinDestroyed && !stdinEnded && childStdin.writable;
        },
        get writableEnded() {
          return stdinEnded || childStdin.writableEnded;
        },
        get writableFinished() {
          return childStdin.writableFinished;
        },
        write: (data, cb) => {
          if (stdinDestroyed || stdinEnded || !childStdin.writable) {
            cb?.(/* @__PURE__ */ new Error("stdin is not writable"));
            return;
          }
          try {
            childStdin.write(data, cb);
          } catch (err) {
            cb?.(err);
          }
        },
        end: () => {
          try {
            stdinEnded = true;
            childStdin.end();
          } catch {}
        },
        destroy: () => {
          try {
            stdinDestroyed = true;
            stdinEnded = true;
            childStdin.destroy();
          } catch {}
        },
      }
    : void 0;
  const onStdout = (listener) => {
    const stdoutDecoder = createWindowsOutputDecoder();
    let flushed = false;
    const flush = () => {
      if (flushed) return;
      flushed = true;
      const tail = stdoutDecoder.flush();
      if (tail) listener(tail);
    };
    child.stdout.on("data", (chunk) => {
      const text = stdoutDecoder.decode(chunk);
      if (text) listener(text);
    });
    child.stdout.once("end", flush);
    child.stdout.once("close", flush);
  };
  const onStderr = (listener) => {
    const stderrDecoder = createWindowsOutputDecoder();
    let flushed = false;
    const flush = () => {
      if (flushed) return;
      flushed = true;
      const tail = stderrDecoder.flush();
      if (tail) listener(tail);
    };
    child.stderr.on("data", (chunk) => {
      const text = stderrDecoder.decode(chunk);
      if (text) listener(text);
    });
    child.stderr.once("end", flush);
    child.stderr.once("close", flush);
  };
  let waitResult = null;
  let waitError;
  let resolveWait = null;
  let rejectWait = null;
  let waitPromise = null;
  let forceKillWaitFallbackTimer = null;
  let childExitState = null;
  let windowsCloseFallbackTimer = null;
  let stdoutDrained = child.stdout == null;
  let stderrDrained = child.stderr == null;
  const clearForceKillWaitFallback = () => {
    if (!forceKillWaitFallbackTimer) return;
    clearTimeout(forceKillWaitFallbackTimer);
    forceKillWaitFallbackTimer = null;
  };
  const clearWindowsCloseFallbackTimer = () => {
    if (!windowsCloseFallbackTimer) return;
    clearTimeout(windowsCloseFallbackTimer);
    windowsCloseFallbackTimer = null;
  };
  const settleWait = (value) => {
    if (waitResult || waitError !== void 0) return;
    clearForceKillWaitFallback();
    clearWindowsCloseFallbackTimer();
    waitResult = value;
    if (resolveWait) {
      const resolve = resolveWait;
      resolveWait = null;
      rejectWait = null;
      resolve(value);
    }
  };
  const rejectPendingWait = (error) => {
    if (waitResult || waitError !== void 0) return;
    clearForceKillWaitFallback();
    clearWindowsCloseFallbackTimer();
    waitError = error;
    if (rejectWait) {
      const reject = rejectWait;
      resolveWait = null;
      rejectWait = null;
      reject(error);
    }
  };
  const scheduleForceKillWaitFallback = (signal) => {
    clearForceKillWaitFallback();
    forceKillWaitFallbackTimer = setTimeout(() => {
      settleWait({
        code: null,
        signal,
      });
    }, FORCE_KILL_WAIT_FALLBACK_MS$1);
    forceKillWaitFallbackTimer.unref?.();
  };
  const resolveObservedExitState = (fallback) => {
    if (childExitState != null) return childExitState;
    return {
      code: child.exitCode ?? fallback.code,
      signal: child.signalCode ?? fallback.signal,
    };
  };
  const maybeSettleAfterWindowsExit = () => {
    if (process.platform !== "win32" || childExitState == null || !stdoutDrained || !stderrDrained)
      return;
    settleWait(resolveObservedExitState(childExitState));
  };
  const scheduleWindowsCloseFallback = () => {
    if (process.platform !== "win32") return;
    clearWindowsCloseFallbackTimer();
    windowsCloseFallbackTimer = setTimeout(() => {
      maybeSettleAfterWindowsExit();
    }, WINDOWS_CLOSE_STATE_SETTLE_TIMEOUT_MS);
    windowsCloseFallbackTimer.unref?.();
  };
  child.stdout?.once("end", () => {
    stdoutDrained = true;
    maybeSettleAfterWindowsExit();
  });
  child.stdout?.once("close", () => {
    stdoutDrained = true;
    maybeSettleAfterWindowsExit();
  });
  child.stderr?.once("end", () => {
    stderrDrained = true;
    maybeSettleAfterWindowsExit();
  });
  child.stderr?.once("close", () => {
    stderrDrained = true;
    maybeSettleAfterWindowsExit();
  });
  child.once("error", (error) => {
    rejectPendingWait(error);
  });
  child.once("exit", (code, signal) => {
    childExitState = {
      code,
      signal,
    };
    scheduleWindowsCloseFallback();
  });
  child.once("close", (code, signal) => {
    settleWait(
      resolveObservedExitState({
        code,
        signal,
      }),
    );
  });
  const wait = async () => {
    if (waitResult) return waitResult;
    if (waitError !== void 0) throw toErrorObject(waitError, "Non-Error thrown");
    if (!waitPromise)
      waitPromise = new Promise((resolve, reject) => {
        resolveWait = resolve;
        rejectWait = reject;
        if (waitResult) {
          const settled = waitResult;
          resolveWait = null;
          rejectWait = null;
          resolve(settled);
          return;
        }
        if (waitError !== void 0) {
          const error = waitError;
          resolveWait = null;
          rejectWait = null;
          reject(toErrorObject(error, "Non-Error rejection"));
        }
      });
    return waitPromise;
  };
  const childIsDetached = useDetached && !spawned.usedFallback;
  const signalProcessTreeForChild = (pid, signal) => {
    signalProcessTree(pid, signal, { detached: childIsDetached });
  };
  const kill = (signal) => {
    const pid = child.pid ?? void 0;
    if (signal === void 0 || signal === "SIGKILL") {
      if (pid) signalProcessTreeForChild(pid, "SIGKILL");
      try {
        child.kill("SIGKILL");
      } catch {}
      scheduleForceKillWaitFallback("SIGKILL");
      return;
    }
    if (signal === "SIGTERM" && pid) {
      signalProcessTreeForChild(pid, "SIGTERM");
      return;
    }
    try {
      child.kill(signal);
    } catch {}
  };
  const dispose = () => {
    clearForceKillWaitFallback();
    clearWindowsCloseFallbackTimer();
    child.removeAllListeners();
  };
  return {
    pid: child.pid ?? void 0,
    stdin,
    onStdout,
    onStderr,
    wait,
    kill,
    dispose,
  };
}
//#endregion
//#region src/process/supervisor/adapters/pty.ts
const FORCE_KILL_WAIT_FALLBACK_MS = 4e3;
async function createPtyAdapter(params) {
  const { spawn } = await import("@lydell/node-pty");
  const baseEnv = params.env ? toStringEnv(params.env) : void 0;
  const preparedSpawn = prepareOomScoreAdjustedSpawn(params.shell, params.args, { env: baseEnv });
  const pty = spawn(preparedSpawn.command, preparedSpawn.args, {
    cwd: params.cwd,
    env: preparedSpawn.env ? toStringEnv(preparedSpawn.env) : void 0,
    name: params.name ?? process.env.TERM ?? "xterm-256color",
    cols: params.cols ?? 120,
    rows: params.rows ?? 30,
  });
  let dataListener = null;
  let exitListener = null;
  let waitResult = null;
  let resolveWait = null;
  let waitPromise = null;
  let forceKillWaitFallbackTimer = null;
  let stdinDestroyed = false;
  let stdinEnded = false;
  const clearForceKillWaitFallback = () => {
    if (!forceKillWaitFallbackTimer) return;
    clearTimeout(forceKillWaitFallbackTimer);
    forceKillWaitFallbackTimer = null;
  };
  const settleWait = (value) => {
    if (waitResult) return;
    clearForceKillWaitFallback();
    stdinDestroyed = true;
    stdinEnded = true;
    waitResult = value;
    if (resolveWait) {
      const resolve = resolveWait;
      resolveWait = null;
      resolve(value);
    }
  };
  const scheduleForceKillWaitFallback = (signal) => {
    clearForceKillWaitFallback();
    forceKillWaitFallbackTimer = setTimeout(() => {
      settleWait({
        code: null,
        signal,
      });
    }, FORCE_KILL_WAIT_FALLBACK_MS);
    forceKillWaitFallbackTimer.unref();
  };
  exitListener = pty.onExit((event) => {
    const signal = event.signal && event.signal !== 0 ? event.signal : null;
    settleWait({
      code: event.exitCode ?? null,
      signal,
    });
  });
  const stdin = {
    get destroyed() {
      return stdinDestroyed;
    },
    get writable() {
      return !stdinDestroyed && !stdinEnded;
    },
    get writableEnded() {
      return stdinEnded;
    },
    get writableFinished() {
      return stdinEnded;
    },
    write: (data, cb) => {
      try {
        pty.write(data);
        cb?.(null);
      } catch (err) {
        cb?.(err);
      }
    },
    end: () => {
      try {
        stdinEnded = true;
        const eof = process.platform === "win32" ? "" : "";
        pty.write(eof);
      } catch {}
    },
    destroy: () => {
      stdinDestroyed = true;
      stdinEnded = true;
    },
  };
  const onStdout = (listener) => {
    dataListener = pty.onData((chunk) => {
      listener(chunk);
    });
  };
  const onStderr = (_listener) => {};
  const wait = async () => {
    if (waitResult) return waitResult;
    if (!waitPromise)
      waitPromise = new Promise((resolve) => {
        resolveWait = resolve;
        if (waitResult) {
          const settled = waitResult;
          resolveWait = null;
          resolve(settled);
        }
      });
    return waitPromise;
  };
  const kill = (signal = "SIGKILL") => {
    try {
      if (
        (signal === "SIGKILL" || signal === "SIGTERM") &&
        typeof pty.pid === "number" &&
        pty.pid > 0
      )
        signalProcessTree(pty.pid, signal);
      else if (process.platform === "win32") pty.kill();
      else pty.kill(signal);
    } catch {}
    if (signal === "SIGKILL") scheduleForceKillWaitFallback(signal);
  };
  const dispose = () => {
    stdinDestroyed = true;
    stdinEnded = true;
    try {
      dataListener?.dispose();
    } catch {}
    try {
      exitListener?.dispose();
    } catch {}
    clearForceKillWaitFallback();
    dataListener = null;
    exitListener = null;
    settleWait({
      code: null,
      signal: null,
    });
  };
  return {
    pid: pty.pid || void 0,
    stdin,
    onStdout,
    onStderr,
    wait,
    kill,
    dispose,
  };
}
//#endregion
//#region src/process/supervisor/registry.ts
/** In-memory run index for the supervisor; callers receive detached snapshots. */
function nowMs() {
  return Date.now();
}
const DEFAULT_MAX_EXITED_RECORDS = 2e3;
function resolveMaxExitedRecords(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 1)
    return DEFAULT_MAX_EXITED_RECORDS;
  return Math.max(1, Math.floor(value));
}
/**
 * Create the supervisor's mutable run registry. Exited records are retained
 * only for diagnostics, so the cap bounds memory without touching live runs.
 */
function createRunRegistry(options) {
  const records = /* @__PURE__ */ new Map();
  const maxExitedRecords = resolveMaxExitedRecords(options?.maxExitedRecords);
  const pruneExitedRecords = () => {
    if (!records.size) return;
    let exited = 0;
    for (const record of records.values()) if (record.state === "exited") exited += 1;
    if (exited <= maxExitedRecords) return;
    let remove = exited - maxExitedRecords;
    for (const [runId, record] of records.entries()) {
      if (remove <= 0) break;
      if (record.state !== "exited") continue;
      records.delete(runId);
      remove -= 1;
    }
  };
  const add = (record) => {
    records.set(record.runId, { ...record });
  };
  const get = (runId) => {
    const record = records.get(runId);
    return record ? { ...record } : void 0;
  };
  const updateState = (runId, state, patch) => {
    const current = records.get(runId);
    if (!current) return;
    const updatedAtMs = nowMs();
    const next = {
      ...current,
      ...patch,
      state,
      updatedAtMs,
      lastOutputAtMs: current.lastOutputAtMs,
    };
    records.set(runId, next);
    return { ...next };
  };
  const touchOutput = (runId) => {
    const current = records.get(runId);
    if (!current) return;
    const ts = nowMs();
    records.set(runId, {
      ...current,
      lastOutputAtMs: ts,
      updatedAtMs: ts,
    });
  };
  const finalize = (runId, exit) => {
    const current = records.get(runId);
    if (!current) return null;
    const firstFinalize = current.state !== "exited";
    const ts = nowMs();
    const next = {
      ...current,
      state: "exited",
      terminationReason: current.terminationReason ?? exit.reason,
      exitCode: current.exitCode !== void 0 ? current.exitCode : exit.exitCode,
      exitSignal: current.exitSignal !== void 0 ? current.exitSignal : exit.exitSignal,
      updatedAtMs: ts,
    };
    records.set(runId, next);
    pruneExitedRecords();
    return {
      record: { ...next },
      firstFinalize,
    };
  };
  return {
    add,
    get,
    updateState,
    touchOutput,
    finalize,
  };
}
//#endregion
//#region src/process/supervisor/supervisor.ts
const GRACEFUL_CANCEL_TIMEOUT_MS = 5e3;
const DEFAULT_MAX_CAPTURED_OUTPUT_CHARS = 1024 * 1024;
const loadSupervisorLogRuntime = createLazyRuntimeModule(
  () => import("./supervisor-log.runtime.js"),
);
function clampTimeout(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return;
  return Math.max(1, Math.floor(value));
}
function clampCapturedOutputChars(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0)
    return DEFAULT_MAX_CAPTURED_OUTPUT_CHARS;
  return Math.max(256, Math.floor(value));
}
function appendCapturedOutput(current, chunk, stream, maxChars) {
  const next = current + chunk;
  if (next.length <= maxChars) return next;
  const marker = `[openclaw: captured ${stream} truncated to last ${maxChars} chars]\n`;
  return `${marker}${sliceUtf16Safe(next, -Math.max(0, maxChars - marker.length))}`;
}
function isTimeoutReason(reason) {
  return reason === "overall-timeout" || reason === "no-output-timeout";
}
function resolveElapsedTimeoutReason(params) {
  const elapsedDeadlines = [];
  if (params.overallTimeoutDeadlineMs !== null && params.nowMs >= params.overallTimeoutDeadlineMs)
    elapsedDeadlines.push({
      reason: "overall-timeout",
      deadlineMs: params.overallTimeoutDeadlineMs,
    });
  if (params.noOutputTimeoutDeadlineMs !== null && params.nowMs >= params.noOutputTimeoutDeadlineMs)
    elapsedDeadlines.push({
      reason: "no-output-timeout",
      deadlineMs: params.noOutputTimeoutDeadlineMs,
    });
  if (elapsedDeadlines.length === 0) return null;
  elapsedDeadlines.sort((a, b) => a.deadlineMs - b.deadlineMs);
  return expectDefined(elapsedDeadlines[0], "elapsed deadlines entry at 0").reason;
}
function createProcessSupervisor() {
  const registry = createRunRegistry();
  const active = /* @__PURE__ */ new Map();
  const cancel = (runId, reason = "manual-cancel") => {
    const current = active.get(runId);
    if (!current) return;
    registry.updateState(runId, "exiting", { terminationReason: reason });
    current.run.cancel(reason);
  };
  const cancelScope = (scopeKey, reason = "manual-cancel") => {
    if (!scopeKey.trim()) return;
    for (const [runId, run] of active.entries()) {
      if (run.scopeKey !== scopeKey) continue;
      cancel(runId, reason);
    }
  };
  const spawn = async (input) => {
    const runId = normalizeOptionalString(input.runId) ?? crypto.randomUUID();
    const scopeKey = normalizeOptionalString(input.scopeKey);
    if (input.replaceExistingScope && scopeKey) cancelScope(scopeKey, "manual-cancel");
    const startedAtMs = Date.now();
    const record = {
      runId,
      sessionId: input.sessionId,
      backendId: input.backendId,
      scopeKey,
      state: "starting",
      startedAtMs,
      lastOutputAtMs: startedAtMs,
      createdAtMs: startedAtMs,
      updatedAtMs: startedAtMs,
    };
    registry.add(record);
    let forcedReason = null;
    let settled = false;
    let stdout = "";
    let stderr = "";
    let timeoutTimer = null;
    let noOutputTimer = null;
    let forceKillTimer = null;
    const captureOutput = input.captureOutput !== false;
    const maxCapturedOutputChars = clampCapturedOutputChars(input.maxCapturedOutputChars);
    const overallTimeoutMs = clampTimeout(input.timeoutMs);
    const noOutputTimeoutMs = clampTimeout(input.noOutputTimeoutMs);
    let overallTimeoutDeadlineMs = null;
    let noOutputTimeoutDeadlineMs = null;
    const setForcedReason = (reason) => {
      if (forcedReason) return;
      forcedReason = reason;
      registry.updateState(runId, "exiting", { terminationReason: reason });
    };
    let cancelAdapter = null;
    const requestCancel = (reason) => {
      setForcedReason(reason);
      cancelAdapter?.(reason);
    };
    const touchOutput = () => {
      registry.touchOutput(runId);
      if (!noOutputTimeoutMs || settled) return;
      noOutputTimeoutDeadlineMs = performance.now() + noOutputTimeoutMs;
      if (noOutputTimer) clearTimeout(noOutputTimer);
      noOutputTimer = setTimeout(() => {
        requestCancel("no-output-timeout");
      }, noOutputTimeoutMs);
    };
    try {
      if (input.mode === "child" && input.argv.length === 0)
        throw new Error("spawn argv cannot be empty");
      const adapter =
        input.mode === "pty"
          ? await (async () => {
              const { shell, args: shellArgs } = getShellConfig();
              const ptyCommand = input.ptyCommand.trim();
              if (!ptyCommand) throw new Error("PTY command cannot be empty");
              return await createPtyAdapter({
                shell,
                args: [...shellArgs, ptyCommand],
                cwd: input.cwd,
                env: input.env,
              });
            })()
          : await createChildAdapter({
              argv: input.argv,
              cwd: input.cwd,
              env: input.env,
              windowsVerbatimArguments: input.windowsVerbatimArguments,
              input: input.input,
              stdinMode: input.stdinMode,
            });
      registry.updateState(runId, "running", { pid: adapter.pid });
      const clearTimers = () => {
        if (timeoutTimer) {
          clearTimeout(timeoutTimer);
          timeoutTimer = null;
        }
        if (noOutputTimer) {
          clearTimeout(noOutputTimer);
          noOutputTimer = null;
        }
        if (forceKillTimer) {
          clearTimeout(forceKillTimer);
          forceKillTimer = null;
        }
      };
      cancelAdapter = (_reason) => {
        if (settled || forceKillTimer) return;
        adapter.kill("SIGTERM");
        forceKillTimer = setTimeout(() => {
          if (!settled) adapter.kill("SIGKILL");
        }, GRACEFUL_CANCEL_TIMEOUT_MS);
        forceKillTimer.unref?.();
      };
      if (overallTimeoutMs) {
        overallTimeoutDeadlineMs = performance.now() + overallTimeoutMs;
        timeoutTimer = setTimeout(() => {
          requestCancel("overall-timeout");
        }, overallTimeoutMs);
      }
      if (noOutputTimeoutMs) {
        noOutputTimeoutDeadlineMs = performance.now() + noOutputTimeoutMs;
        noOutputTimer = setTimeout(() => {
          requestCancel("no-output-timeout");
        }, noOutputTimeoutMs);
      }
      adapter.onStdout((chunk) => {
        if (captureOutput)
          stdout = appendCapturedOutput(stdout, chunk, "stdout", maxCapturedOutputChars);
        input.onStdout?.(chunk);
        touchOutput();
      });
      adapter.onStderr((chunk) => {
        if (captureOutput)
          stderr = appendCapturedOutput(stderr, chunk, "stderr", maxCapturedOutputChars);
        input.onStderr?.(chunk);
        touchOutput();
      });
      const waitPromise = (async () => {
        const result = await adapter.wait();
        const deadlineReason = resolveElapsedTimeoutReason({
          nowMs: performance.now(),
          overallTimeoutDeadlineMs,
          noOutputTimeoutDeadlineMs,
        });
        const terminalReason = forcedReason ?? deadlineReason;
        if (settled)
          return {
            reason: terminalReason ?? "exit",
            exitCode: result.code,
            exitSignal: result.signal,
            durationMs: Date.now() - startedAtMs,
            stdout,
            stderr,
            timedOut: isTimeoutReason(terminalReason ?? "exit"),
            noOutputTimedOut: terminalReason === "no-output-timeout",
          };
        settled = true;
        clearTimers();
        adapter.dispose();
        active.delete(runId);
        const reason = terminalReason ?? (result.signal != null ? "signal" : "exit");
        const exit = {
          reason,
          exitCode: result.code,
          exitSignal: result.signal,
          durationMs: Date.now() - startedAtMs,
          stdout,
          stderr,
          timedOut: isTimeoutReason(terminalReason ?? reason),
          noOutputTimedOut: terminalReason === "no-output-timeout",
        };
        registry.finalize(runId, {
          reason: exit.reason,
          exitCode: exit.exitCode,
          exitSignal: exit.exitSignal,
        });
        return exit;
      })().catch((err) => {
        if (!settled) {
          settled = true;
          clearTimers();
          active.delete(runId);
          adapter.dispose();
          registry.finalize(runId, {
            reason: "spawn-error",
            exitCode: null,
            exitSignal: null,
          });
        }
        throw err;
      });
      const managedRun = {
        runId,
        pid: adapter.pid,
        startedAtMs,
        stdin: adapter.stdin,
        wait: async () => await waitPromise,
        cancel: (reason = "manual-cancel") => {
          requestCancel(reason);
        },
      };
      active.set(runId, {
        run: managedRun,
        scopeKey,
      });
      return managedRun;
    } catch (err) {
      registry.finalize(runId, {
        reason: "spawn-error",
        exitCode: null,
        exitSignal: null,
      });
      const { warnProcessSupervisorSpawnFailure } = await loadSupervisorLogRuntime();
      warnProcessSupervisorSpawnFailure(`spawn failed: runId=${runId} reason=${String(err)}`);
      throw err;
    }
  };
  return {
    spawn,
    cancel,
    cancelScope,
    getRecord: (runId) => registry.get(runId),
  };
}
//#endregion
//#region src/process/supervisor/index.ts
let singleton = null;
/** Return the process-wide supervisor used by runtime code that does not inject one. */
function getProcessSupervisor() {
  if (singleton) return singleton;
  singleton = createProcessSupervisor();
  return singleton;
}
//#endregion
export { getProcessSupervisor as t };
