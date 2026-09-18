import { execFileSync } from "node:child_process";
import "./parse-finite-number-Z7n6tXLk.js";
import { createServer } from "node:net";
import "./number-coercion-EqFmHmOw.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import "./utils-DtcDeqWS.js";
import {
  A as resolvePositiveTimerTimeoutMs,
  b as parseStrictPositiveInteger,
  j as resolveTimerTimeoutMs,
} from "./number-coercion-CJQ8TR--.js";
import { n as resolveLsofCommandSync } from "./ports-lsof-BmdLddJi.js";
import { n as parseWindowsNetstatListeners } from "./ports-netstat-CscdLGyq.js";
import { t as probePortUsage } from "./ports-probe-B4qJEiCc.js";
import { t as sleep } from "./sleep-DZm1epyW.js";
import { a as getWindowsSystem32ExePath } from "./windows-install-roots-Cnzi1kc9.js";
//#region src/cli/ports.ts
const FUSER_SIGNALS = {
  SIGTERM: "TERM",
  SIGKILL: "KILL",
};
function readExecOutput(value) {
  if (typeof value === "string") return value;
  if (value instanceof Buffer) return value.toString("utf8");
  return "";
}
function withErrnoCode(message, code, cause) {
  const out = new Error(message, { cause: cause instanceof Error ? cause : void 0 });
  out.code = code;
  return out;
}
function getErrnoCode(err) {
  if (!err || typeof err !== "object") return;
  const direct = err.code;
  if (typeof direct === "string" && direct.length > 0) return direct;
  const cause = err.cause;
  if (cause && typeof cause === "object") {
    const nested = cause.code;
    if (typeof nested === "string" && nested.length > 0) return nested;
  }
}
function isRecoverableLsofError(err) {
  const code = getErrnoCode(err);
  if (code === "ENOENT" || code === "EACCES" || code === "EPERM" || code === "EPROTO") return true;
  const message = formatErrorMessage(err);
  return /lsof.*(permission denied|not permitted|operation not permitted|eacces|eperm)/i.test(
    message,
  );
}
function parseFuserPidList(output) {
  if (!output) return [];
  const values = /* @__PURE__ */ new Set();
  for (const rawLine of output.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const pidMatches =
      (line.includes(":") ? line.slice(line.indexOf(":") + 1) : line).match(/\d+/g) ?? [];
    for (const match of pidMatches) {
      const pid = Number.parseInt(match, 10);
      if (Number.isFinite(pid) && pid > 0) values.add(pid);
    }
  }
  return [...values];
}
function killPortWithFuser(port, signal) {
  const args = ["-k", `-${FUSER_SIGNALS[signal]}`, `${port}/tcp`];
  try {
    return parseFuserPidList(
      execFileSync("fuser", args, {
        encoding: "utf-8",
        stdio: ["ignore", "pipe", "pipe"],
      }),
    ).map((pid) => ({ pid }));
  } catch (err) {
    const execErr = err;
    const code = execErr.code;
    const status = execErr.status;
    const parsed = parseFuserPidList(
      [readExecOutput(execErr.stdout), readExecOutput(execErr.stderr)].filter(Boolean).join("\n"),
    );
    if (status === 1) return parsed.map((pid) => ({ pid }));
    if (code === "ENOENT")
      throw withErrnoCode(
        "fuser not found; required for --force when lsof is unavailable",
        "ENOENT",
        err,
      );
    if (code === "EACCES" || code === "EPERM")
      throw withErrnoCode("fuser permission denied while forcing gateway port", code, err);
    throw err instanceof Error ? err : new Error(String(err));
  }
}
async function isPortBusy(port) {
  return (await probePortUsage(port)) !== "free";
}
function parseLsofOutput(output) {
  const lines = output.split(/\r?\n/).filter(Boolean);
  const results = [];
  let current = {};
  for (const line of lines)
    if (line.startsWith("p")) {
      if (current.pid) results.push(current);
      const rawPidToken = line.slice(1);
      const rawPid = parseStrictPositiveInteger(rawPidToken);
      if (rawPid === void 0)
        throw withErrnoCode(
          `lsof returned malformed PID field: ${JSON.stringify(rawPidToken)}`,
          "EPROTO",
          void 0,
        );
      current = { pid: rawPid };
    } else if (line.startsWith("c")) current.command = line.slice(1);
  if (current.pid) results.push(current);
  return results;
}
function listPortListeners(port) {
  if (process.platform === "win32")
    try {
      const listeners = parseWindowsNetstatListeners(
        execFileSync(getWindowsSystem32ExePath("netstat.exe"), ["-ano"], { encoding: "utf-8" }),
        port,
      );
      const seenPids = /* @__PURE__ */ new Set();
      const results = [];
      for (const listener of listeners) {
        if (seenPids.has(listener.pid)) continue;
        seenPids.add(listener.pid);
        results.push({ pid: listener.pid });
      }
      return results;
    } catch (err) {
      throw new Error(`netstat failed: ${String(err)}`, { cause: err });
    }
  try {
    return parseLsofOutput(
      execFileSync(resolveLsofCommandSync(), ["-nP", `-iTCP:${port}`, "-sTCP:LISTEN", "-FpFc"], {
        encoding: "utf-8",
      }),
    );
  } catch (err) {
    const execErr = err;
    const status = execErr.status ?? void 0;
    const code = execErr.code;
    if (code === "ENOENT")
      throw withErrnoCode("lsof not found; required for --force", "ENOENT", err);
    if (code === "EACCES" || code === "EPERM")
      throw withErrnoCode("lsof permission denied while inspecting gateway port", code, err);
    if (status === 1) {
      const stderr = readExecOutput(execErr.stderr).trim();
      if (
        stderr &&
        /permission denied|not permitted|operation not permitted|can't stat/i.test(stderr)
      )
        throw withErrnoCode(
          `lsof permission denied while inspecting gateway port: ${stderr}`,
          "EACCES",
          err,
        );
      return [];
    }
    throw err instanceof Error ? err : new Error(String(err));
  }
}
function forceFreePort(port) {
  const listeners = listPortListeners(port);
  for (const proc of listeners)
    try {
      process.kill(proc.pid, "SIGTERM");
    } catch (err) {
      throw new Error(
        `failed to kill pid ${proc.pid}${proc.command ? ` (${proc.command})` : ""}: ${String(err)}`,
        { cause: err },
      );
    }
  return listeners;
}
function killPids(listeners, signal) {
  for (const proc of listeners)
    try {
      process.kill(proc.pid, signal);
    } catch (err) {
      throw new Error(
        `failed to kill pid ${proc.pid}${proc.command ? ` (${proc.command})` : ""}: ${String(err)}`,
        { cause: err },
      );
    }
}
async function forceFreePortAndWait(port, opts = {}) {
  const timeoutMs = resolveTimerTimeoutMs(opts.timeoutMs, 1500, 0);
  const intervalMs = resolvePositiveTimerTimeoutMs(opts.intervalMs, 100);
  const sigtermTimeoutMs = Math.min(
    resolveTimerTimeoutMs(opts.sigtermTimeoutMs, 600, 0),
    timeoutMs,
  );
  let killed = [];
  let useFuserFallback = false;
  try {
    killed = forceFreePort(port);
  } catch (err) {
    if (!isRecoverableLsofError(err)) throw err;
    if (!(await isPortBusy(port)))
      return {
        killed,
        waitedMs: 0,
        escalatedToSigkill: false,
      };
    useFuserFallback = true;
    killed = killPortWithFuser(port, "SIGTERM");
  }
  if (killed.length === 0) {
    if (await isPortBusy(port))
      throw new Error(
        `port ${port} is still busy after --force, but no listener PID could be determined`,
      );
    return {
      killed,
      waitedMs: 0,
      escalatedToSigkill: false,
    };
  }
  const checkBusy = async () =>
    useFuserFallback ? isPortBusy(port) : listPortListeners(port).length > 0;
  if (!(await checkBusy()))
    return {
      killed,
      waitedMs: 0,
      escalatedToSigkill: false,
    };
  let waitedMs = 0;
  while (waitedMs < sigtermTimeoutMs) {
    if (!(await checkBusy()))
      return {
        killed,
        waitedMs,
        escalatedToSigkill: false,
      };
    const sleepMs = Math.min(intervalMs, sigtermTimeoutMs - waitedMs);
    await sleep(sleepMs);
    waitedMs += sleepMs;
  }
  if (!(await checkBusy()))
    return {
      killed,
      waitedMs,
      escalatedToSigkill: false,
    };
  if (useFuserFallback) killPortWithFuser(port, "SIGKILL");
  else killPids(listPortListeners(port), "SIGKILL");
  while (waitedMs < timeoutMs) {
    if (!(await checkBusy()))
      return {
        killed,
        waitedMs,
        escalatedToSigkill: true,
      };
    const sleepMs = Math.min(intervalMs, timeoutMs - waitedMs);
    await sleep(sleepMs);
    waitedMs += sleepMs;
  }
  if (!(await checkBusy()))
    return {
      killed,
      waitedMs,
      escalatedToSigkill: true,
    };
  if (useFuserFallback)
    throw new Error(`port ${port} still has listeners after --force (fuser fallback)`);
  const still = listPortListeners(port);
  throw new Error(
    `port ${port} still has listeners after --force: ${still.map((p) => p.pid).join(", ")}`,
  );
}
/**
 * Attempt a real TCP bind to verify the port is available at the OS level.
 * Catches TIME_WAIT / kernel-level holds that lsof won't show.
 *
 * Resolves false only for EADDRINUSE — a genuinely transient condition
 * (port still in TIME_WAIT after a --force kill) that the caller should retry.
 *
 * All other errors are non-retryable and are rejected immediately:
 * - EADDRNOTAVAIL: the host address doesn't exist on any local interface
 *   (hard misconfiguration, not a transient kernel hold).
 * - EACCES: bind to a privileged port as non-root.
 * - EINVAL, etc.: other unrecoverable OS errors.
 */
function probePortFree(port, host = "0.0.0.0") {
  return new Promise((resolve, reject) => {
    const srv = createServer();
    srv.unref();
    srv.once("error", (err) => {
      srv.close();
      if (err.code === "EADDRINUSE") resolve(false);
      else reject(err);
    });
    srv.listen(port, host, () => {
      srv.close(() => resolve(true));
    });
  });
}
/**
 * Poll until a real test-bind succeeds, up to `timeoutMs`.
 * Returns the number of ms waited, or throws if the port never freed.
 */
async function waitForPortBindable(port, opts = {}) {
  const timeoutMs = resolveTimerTimeoutMs(opts.timeoutMs, 3e3, 0);
  const intervalMs = resolvePositiveTimerTimeoutMs(opts.intervalMs, 150);
  const host = opts.host;
  let waited = 0;
  while (waited < timeoutMs) {
    if (await probePortFree(port, host)) return waited;
    const sleepMs = Math.min(intervalMs, timeoutMs - waited);
    await sleep(sleepMs);
    waited += sleepMs;
  }
  if (await probePortFree(port, host)) return waited;
  throw new Error(`port ${port} still not bindable after ${waited}ms (TIME_WAIT or kernel hold)`);
}
//#endregion
export {
  probePortFree as a,
  parseLsofOutput as i,
  forceFreePortAndWait as n,
  waitForPortBindable as o,
  listPortListeners as r,
  forceFreePort as t,
};
