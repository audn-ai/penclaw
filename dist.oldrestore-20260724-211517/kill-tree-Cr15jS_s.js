import { spawn } from "node:child_process";
//#region packages/agent-core/src/harness/env/kill-tree.ts
const DEFAULT_GRACE_MS = 3e3;
const MAX_GRACE_MS = 6e4;
/**
 * Best-effort process-tree termination with graceful shutdown.
 * - Windows: use taskkill /T to include descendants. Sends SIGTERM-equivalent
 *   first (without /F), then force-kills if process survives.
 * - Unix: send SIGTERM to process group first, wait grace period, then SIGKILL.
 *
 * When the child was spawned with `detached: false`, pass `detached: false` to
 * skip the Unix `process.kill(-pid, ...)` group-kill. That avoids signaling the
 * gateway's own process group.
 */
function killProcessTree(pid, opts) {
  if (!Number.isFinite(pid) || pid <= 0) return;
  if (process.platform === "win32") {
    if (opts?.force === true) {
      signalProcessTreeWindows(pid, "SIGKILL");
      return;
    }
    killProcessTreeWindows(pid, normalizeGraceMs(opts?.graceMs));
    return;
  }
  const useGroupKill = opts?.detached !== false;
  if (opts?.force === true) {
    signalProcessTreeUnix(pid, "SIGKILL", useGroupKill);
    return;
  }
  const graceMs = normalizeGraceMs(opts?.graceMs);
  signalProcessTreeUnix(pid, "SIGTERM", useGroupKill);
  setTimeout(() => {
    if (!(useGroupKill ? isProcessAlive(-pid) || isProcessAlive(pid) : isProcessAlive(pid))) return;
    signalProcessTreeUnix(pid, "SIGKILL", useGroupKill);
  }, graceMs).unref();
}
function signalProcessTree(pid, signal, opts) {
  if (!Number.isFinite(pid) || pid <= 0) return;
  if (process.platform === "win32") {
    signalProcessTreeWindows(pid, signal);
    return;
  }
  signalProcessTreeUnix(pid, signal, opts?.detached !== false);
}
function normalizeGraceMs(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return DEFAULT_GRACE_MS;
  return Math.max(0, Math.min(MAX_GRACE_MS, Math.floor(value)));
}
function isProcessAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}
function signalProcessTreeUnix(pid, signal, useGroupKill) {
  if (useGroupKill)
    try {
      process.kill(-pid, signal);
      return;
    } catch {}
  try {
    process.kill(pid, signal);
  } catch {}
}
function runTaskkill(args) {
  try {
    spawn("taskkill", args, {
      stdio: "ignore",
      detached: true,
      windowsHide: true,
    }).once("error", () => {});
  } catch {}
}
function killProcessTreeWindows(pid, graceMs) {
  signalProcessTreeWindows(pid, "SIGTERM");
  setTimeout(() => {
    if (!isProcessAlive(pid)) return;
    signalProcessTreeWindows(pid, "SIGKILL");
  }, graceMs).unref();
}
function signalProcessTreeWindows(pid, signal) {
  runTaskkill(
    signal === "SIGKILL" ? ["/F", "/T", "/PID", String(pid)] : ["/T", "/PID", String(pid)],
  );
}
//#endregion
export { signalProcessTree as n, killProcessTree as t };
