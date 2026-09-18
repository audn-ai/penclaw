import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/daemon/service-runtime.ts
/** Shared daemon runtime status types and systemd cgroup hygiene helpers. */
const SYSTEMD_TASKS_CURRENT_WARNING_THRESHOLD = 200;
const SYSTEMD_MEMORY_CURRENT_WARNING_BYTES = 2 * 1024 * 1024 * 1024;
const SYSTEMD_NO_RESTART_EXIT_STATUS = 78;
function isRiskySystemdKillMode(value) {
  const normalized = normalizeLowercaseStringOrEmpty(value);
  return normalized === "process" || normalized === "none";
}
function formatBytesAsGiB(value) {
  const gib = value / 1024 / 1024 / 1024;
  const formatted = gib >= 1 ? gib.toFixed(1).replace(/\.0$/, "") : `${value}B`;
  return gib >= 1 ? `${formatted}GiB` : formatted;
}
function describeSystemdCgroupLoadWarnings(runtime) {
  if (!runtime) return [];
  const killMode = runtime?.killMode;
  if (!isRiskySystemdKillMode(killMode)) return [];
  const details = [];
  if (
    runtime.tasksCurrent !== void 0 &&
    Number.isSafeInteger(runtime.tasksCurrent) &&
    runtime.tasksCurrent >= SYSTEMD_TASKS_CURRENT_WARNING_THRESHOLD
  )
    details.push(`tasks=${runtime.tasksCurrent}`);
  if (
    runtime.memoryCurrent !== void 0 &&
    Number.isSafeInteger(runtime.memoryCurrent) &&
    runtime.memoryCurrent >= SYSTEMD_MEMORY_CURRENT_WARNING_BYTES
  )
    details.push(`memory=${formatBytesAsGiB(runtime.memoryCurrent)}`);
  return details;
}
function getSystemdCgroupHygieneSummary(runtime) {
  if (!runtime || !runtime.killMode) return null;
  const details = describeSystemdCgroupLoadWarnings(runtime);
  if (details.length === 0) return null;
  return `cgroup hygiene: KillMode=${runtime.killMode}, ${details.join(", ")}`;
}
function isSystemdCgroupHygieneRisk(runtime) {
  return getSystemdCgroupHygieneSummary(runtime) !== null;
}
/**
 * True when systemd has stopped auto-restarting the gateway because it crashed
 * faster than StartLimitBurst/StartLimitIntervalSec allows. Unlike an ordinary
 * stopped/exited unit, this terminal latch needs an explicit `reset-failed` +
 * restart to recover, so status/doctor must surface it instead of the generic
 * "exited immediately" message.
 *
 * Detection: the unit is `failed` and either systemd reported the give-up
 * directly (Result=start-limit-hit, the start-was-refused-before-exec case) or
 * the restart counter reached the configured burst. The counter path is the
 * common one: once the gateway process has actually run and exited non-zero,
 * systemd keeps Result=exit-code and never overwrites it with start-limit-hit
 * (verified against systemd 249), so Result alone misses real crash loops.
 *
 * The counter path is guarded against the deliberate no-restart exit: a last
 * exit of 78 (EX_CONFIG, held back by RestartPreventExitStatus=78) means
 * systemd stopped on purpose, so a stale NRestarts left over from earlier
 * crashes must not be mistaken for start-limit exhaustion. The explicit
 * Result=start-limit-hit signal stays authoritative regardless of exit status.
 */
function isSystemdStartLimitHit(runtime) {
  if (!runtime || normalizeLowercaseStringOrEmpty(runtime.state) !== "failed") return false;
  const systemd = runtime.systemd;
  if (!systemd) return false;
  if (normalizeLowercaseStringOrEmpty(systemd.result) === "start-limit-hit") return true;
  if (runtime.lastExitStatus === SYSTEMD_NO_RESTART_EXIT_STATUS) return false;
  return (
    typeof systemd.startLimitBurst === "number" &&
    systemd.startLimitBurst > 0 &&
    typeof systemd.nRestarts === "number" &&
    systemd.nRestarts >= systemd.startLimitBurst
  );
}
//#endregion
export {
  isSystemdCgroupHygieneRisk as n,
  isSystemdStartLimitHit as r,
  getSystemdCgroupHygieneSummary as t,
};
