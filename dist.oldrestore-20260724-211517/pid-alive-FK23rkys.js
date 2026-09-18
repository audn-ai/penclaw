import childProcess from "node:child_process";
import fs from "node:fs";
//#region src/shared/pid-alive.ts
function isValidPid(pid) {
  return Number.isInteger(pid) && pid > 0;
}
/**
 * Check if a process is a zombie on Linux by reading /proc/<pid>/status.
 * Returns false on non-Linux platforms or if the proc file can't be read.
 */
function isZombieProcess(pid) {
  if (process.platform !== "linux") return false;
  try {
    return fs.readFileSync(`/proc/${pid}/status`, "utf8").match(/^State:\s+(\S)/m)?.[1] === "Z";
  } catch {
    return false;
  }
}
/** Returns true only when a positive PID exists and is not a Linux zombie process. */
function isPidAlive(pid) {
  if (!isValidPid(pid)) return false;
  try {
    process.kill(pid, 0);
  } catch {
    return false;
  }
  if (isZombieProcess(pid)) return false;
  return true;
}
/** Returns true only when the PID is invalid, missing, or known to be a Linux zombie. */
function isPidDefinitelyDead(pid) {
  if (!isValidPid(pid)) return true;
  try {
    process.kill(pid, 0);
  } catch (err) {
    return err.code === "ESRCH";
  }
  return isZombieProcess(pid);
}
function getDarwinProcessStartTime(pid) {
  try {
    const startedAt = childProcess
      .execFileSync("/bin/ps", ["-o", "lstart=", "-p", String(pid)], {
        encoding: "utf8",
        env: {
          ...process.env,
          LC_ALL: "C",
          TZ: "UTC",
        },
        stdio: ["ignore", "pipe", "ignore"],
      })
      .trim();
    const startedAtMs = Date.parse(`${startedAt} UTC`);
    return Number.isFinite(startedAtMs) ? Math.floor(startedAtMs / 1e3) : null;
  } catch {
    return null;
  }
}
/** Read the Linux procfs start identity used by Linux-owned runtime state. */
function getProcessStartTime(pid) {
  if (!isValidPid(pid)) return null;
  if (process.platform !== "linux") return null;
  try {
    const stat = fs.readFileSync(`/proc/${pid}/stat`, "utf8");
    const commEndIndex = stat.lastIndexOf(")");
    if (commEndIndex < 0) return null;
    const fields = stat
      .slice(commEndIndex + 1)
      .trimStart()
      .split(/\s+/);
    const starttime = Number(fields[19]);
    return Number.isInteger(starttime) && starttime >= 0 ? starttime : null;
  } catch {
    return null;
  }
}
/** Read a cross-platform process identity for filesystem lock ownership. */
function getFileLockProcessStartTime(pid) {
  if (!isValidPid(pid)) return null;
  return process.platform === "darwin" ? getDarwinProcessStartTime(pid) : getProcessStartTime(pid);
}
//#endregion
export {
  isPidDefinitelyDead as i,
  getProcessStartTime as n,
  isPidAlive as r,
  getFileLockProcessStartTime as t,
};
