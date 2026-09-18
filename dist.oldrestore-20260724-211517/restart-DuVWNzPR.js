import { spawn, spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import "./number-coercion-EqFmHmOw.js";
import os from "node:os";
import path from "node:path";
import { n as quoteCmdScriptArg } from "./cmd-argv-BseV0o2O.js";
import {
  m as resolveGatewayWindowsTaskName,
  p as resolveGatewaySystemdServiceName,
  u as resolveGatewayLaunchAgentLabel,
} from "./constants-obO8goqF.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import {
  f as runWithGatewayIndependentRootWorkAdmission,
  i as getActiveGatewayRootWorkCount,
  n as beginGatewayRestartSignalAdmission,
  o as isGatewayRestartDraining,
} from "./gateway-work-admission-yGjmBAjy.js";
import "./config-BDv-QbJ6.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import {
  L as executeSqliteQuerySync,
  R as executeSqliteQueryTakeFirstSync,
  l as runOpenClawStateWriteTransaction,
  s as openOpenClawStateDatabase,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import { t as renderCmdRestartLogSetup } from "./restart-logs-D5D9y8VP.js";
import { t as cleanStaleGatewayProcessesSync } from "./restart-stale-pids-C3MK7Phb.js";
import { o as resolveTaskScriptPath } from "./schtasks-BnFuQtB2.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-uPgNO8da.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { t as getWindowsCmdExePath } from "./windows-install-roots-Cnzi1kc9.js";
//#region src/infra/windows-task-restart.ts
const TASK_RESTART_RETRY_LIMIT = 12;
const TASK_RESTART_RETRY_DELAY_SEC = 1;
function quotePowerShellSingleQuotedLiteral(value) {
  return `'${value.replace(/'/g, "''")}'`;
}
function resolveWindowsTaskName(env) {
  const override = env.OPENCLAW_WINDOWS_TASK_NAME?.trim();
  if (override) return override;
  return resolveGatewayWindowsTaskName(env.OPENCLAW_PROFILE);
}
function buildScheduledTaskRestartScript(params) {
  const { quotedLogPath, setupLines, taskName, taskScriptPath } = params;
  const quotedTaskName = quoteCmdScriptArg(taskName);
  const quotedQueryTaskStateCommand = quoteCmdScriptArg(
    [
      `$task = Get-ScheduledTask -TaskName ${quotePowerShellSingleQuotedLiteral(taskName)} -ErrorAction SilentlyContinue`,
      "if ($null -ne $task -and $task.State -eq 'Running') { exit 0 }",
      "exit 1",
    ].join("; "),
  );
  const lines = [
    "@echo off",
    "setlocal",
    ...setupLines,
    `>> ${quotedLogPath} 2>&1 echo [%DATE% %TIME%] openclaw restart attempt source=windows-task-handoff target=${quotedTaskName}`,
    `schtasks /Query /TN ${quotedTaskName} >> ${quotedLogPath} 2>&1`,
    "if errorlevel 1 goto fallback",
    "set /a attempts=0",
    ":retry",
    `timeout /t ${TASK_RESTART_RETRY_DELAY_SEC} /nobreak >nul`,
    "set /a attempts+=1",
    `powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -Command ${quotedQueryTaskStateCommand} >nul 2>&1`,
    "if not errorlevel 1 goto cleanup",
    `schtasks /Run /TN ${quotedTaskName} >> ${quotedLogPath} 2>&1`,
    "if not errorlevel 1 goto cleanup",
    `if %attempts% GEQ ${TASK_RESTART_RETRY_LIMIT} goto fallback`,
    "goto retry",
    ":fallback",
    `>> ${quotedLogPath} 2>&1 echo [%DATE% %TIME%] openclaw restart fallback source=windows-task-handoff`,
  ];
  if (taskScriptPath) {
    const quotedScript = quoteCmdScriptArg(taskScriptPath);
    const quotedCmd = quoteCmdScriptArg(getWindowsCmdExePath());
    lines.push(
      `if exist ${quotedScript} (`,
      `  start "" /min ${quotedCmd} /d /c ${quotedScript}`,
      ")",
    );
  }
  lines.push(
    ":cleanup",
    `>> ${quotedLogPath} 2>&1 echo [%DATE% %TIME%] openclaw restart finished source=windows-task-handoff`,
    'del "%~f0" >nul 2>&1',
  );
  return lines.join("\r\n");
}
function relaunchGatewayScheduledTask(env = process.env) {
  const taskName = resolveWindowsTaskName(env);
  const taskScriptPath = resolveTaskScriptPath(env);
  const scriptPath = path.join(
    resolvePreferredOpenClawTmpDir(),
    `openclaw-schtasks-restart-${randomUUID()}.cmd`,
  );
  const quotedScriptPath = quoteCmdScriptArg(scriptPath);
  const restartLog = renderCmdRestartLogSetup({
    ...process.env,
    ...env,
  });
  try {
    fs.writeFileSync(
      scriptPath,
      `${buildScheduledTaskRestartScript({
        quotedLogPath: restartLog.quotedLogPath,
        setupLines: restartLog.lines,
        taskName,
        taskScriptPath,
      })}\r\n`,
      "utf8",
    );
    const cmdExePath = getWindowsCmdExePath();
    spawn(cmdExePath, ["/d", "/s", "/c", quotedScriptPath], {
      detached: true,
      stdio: "ignore",
      windowsHide: true,
    }).unref();
    return {
      ok: true,
      method: "schtasks",
      tried: [`schtasks /Run /TN "${taskName}"`, `${cmdExePath} /d /s /c ${quotedScriptPath}`],
    };
  } catch (err) {
    try {
      fs.unlinkSync(scriptPath);
    } catch {}
    return {
      ok: false,
      method: "schtasks",
      detail: formatErrorMessage(err),
      tried: [`schtasks /Run /TN "${taskName}"`],
    };
  }
}
//#endregion
//#region src/infra/restart.ts
const SPAWN_TIMEOUT_MS = 2e3;
const SIGUSR1_AUTH_GRACE_MS = 5e3;
const DEFAULT_DEFERRAL_POLL_MS = 500;
const DEFAULT_DEFERRAL_STILL_PENDING_WARN_MS = 3e4;
const DEFAULT_RESTART_DEFERRAL_TIMEOUT_MS = 3e5;
const RESTART_COOLDOWN_MS = 3e4;
const LAUNCHCTL_ALREADY_LOADED_EXIT_CODE = 37;
const GATEWAY_RESTART_INTENT_KEY = "gateway-restart";
const GATEWAY_RESTART_INTENT_TTL_MS = 6e4;
const restartLog = createSubsystemLogger("restart");
let sigusr1AuthorizedCount = 0;
let sigusr1AuthorizedUntil = 0;
let sigusr1ExternalAllowed = false;
let preRestartCheck = null;
let restartCycleToken = 0;
let emittedRestartToken = 0;
let consumedRestartToken = 0;
let emittedRestartReason;
let emittedRestartIntent;
let lastRestartEmittedAt = 0;
let pendingRestartTimer = null;
let pendingRestartDueAt = 0;
let pendingRestartReason;
let pendingRestartEmitHooks;
let pendingRestartSessionKey;
let pendingRestartSkipDeferral = false;
let pendingRestartPreparing = false;
let pendingRestartSignalAdmission = null;
let restartTransientGeneration = 0;
const activeDeferralPolls = /* @__PURE__ */ new Set();
function shouldPreferRestartReason(next, current) {
  const isUpdateRestart = (reason) => reason === "update.run" || reason === "update.auto";
  return isUpdateRestart(next) && !isUpdateRestart(current);
}
function hasUnconsumedRestartSignal() {
  return emittedRestartToken > consumedRestartToken;
}
function clearPendingScheduledRestart() {
  if (pendingRestartTimer) clearTimeout(pendingRestartTimer);
  pendingRestartTimer = null;
  pendingRestartDueAt = 0;
  pendingRestartReason = void 0;
  pendingRestartEmitHooks = void 0;
  pendingRestartSessionKey = void 0;
  pendingRestartSkipDeferral = false;
  pendingRestartPreparing = false;
}
function clearPendingRestartSignalAdmission() {
  const rolledBack = pendingRestartSignalAdmission?.rollback() ?? false;
  pendingRestartSignalAdmission = null;
  return rolledBack;
}
/** Releases a signal fence when the run loop rejects or fails to handle the signal. */
function rollbackGatewayRestartSignalAdmission() {
  return clearPendingRestartSignalAdmission();
}
function armPendingRestartTimer(requestedDueAt, nowMs) {
  pendingRestartTimer = setTimeout(
    () => {
      const scheduledReason = pendingRestartReason;
      const scheduledSkipDeferral = pendingRestartSkipDeferral;
      pendingRestartTimer = null;
      pendingRestartDueAt = 0;
      pendingRestartReason = void 0;
      pendingRestartSkipDeferral = false;
      pendingRestartPreparing = true;
      const pendingCheck = preRestartCheck;
      if (scheduledSkipDeferral || !pendingCheck) {
        emitPreparedGatewayRestart(void 0, scheduledReason);
        return;
      }
      deferGatewayRestartUntilIdle({
        getPendingCount: pendingCheck,
        maxWaitMs: resolveGatewayRestartDeferralTimeoutMs(
          getRuntimeConfig().gateway?.reload?.deferralTimeoutMs,
        ),
        reason: scheduledReason,
        timeoutIntent: {
          force: true,
          ...(scheduledReason ? { reason: scheduledReason } : {}),
        },
      });
    },
    Math.max(0, requestedDueAt - nowMs),
  );
}
function clearActiveDeferralPolls() {
  for (const poll of activeDeferralPolls) clearInterval(poll);
  activeDeferralPolls.clear();
}
function clearGatewayRestartTransientState() {
  restartTransientGeneration += 1;
  sigusr1AuthorizedCount = 0;
  sigusr1AuthorizedUntil = 0;
  restartCycleToken = 0;
  emittedRestartToken = 0;
  consumedRestartToken = 0;
  emittedRestartReason = void 0;
  emittedRestartIntent = void 0;
  lastRestartEmittedAt = 0;
  clearActiveDeferralPolls();
  clearPendingScheduledRestart();
  clearPendingRestartSignalAdmission();
}
function resetGatewayRestartStateForInProcessRestart() {
  clearGatewayRestartTransientState();
  import("./server-reload-handlers-Hyu1zthY.js")
    .then((mod) => {
      mod.abortPendingChannelReloads();
    })
    .catch(() => {});
}
function normalizeRestartIntentPid(pid) {
  return typeof pid === "number" && Number.isSafeInteger(pid) && pid > 0 ? pid : null;
}
function writeGatewayRestartIntentSync(opts) {
  const targetPid = normalizeRestartIntentPid(opts.targetPid);
  if (targetPid === null) return false;
  const env = opts.env ?? process.env;
  try {
    const reason = normalizeRestartIntentReason(opts.reason ?? opts.intent?.reason);
    const waitMs =
      typeof opts.intent?.waitMs === "number" &&
      Number.isFinite(opts.intent.waitMs) &&
      opts.intent.waitMs >= 0
        ? Math.floor(opts.intent.waitMs)
        : null;
    const createdAt = Date.now();
    runOpenClawStateWriteTransaction(
      ({ db }) => {
        executeSqliteQuerySync(
          db,
          getNodeSqliteKysely(db)
            .insertInto("gateway_restart_intent")
            .values({
              intent_key: GATEWAY_RESTART_INTENT_KEY,
              kind: "gateway-restart",
              pid: targetPid,
              created_at: createdAt,
              reason: reason ?? null,
              force: opts.intent?.force ? 1 : null,
              wait_ms: waitMs,
              updated_at_ms: createdAt,
            })
            .onConflict((conflict) =>
              conflict.column("intent_key").doUpdateSet({
                kind: (eb) => eb.ref("excluded.kind"),
                pid: (eb) => eb.ref("excluded.pid"),
                created_at: (eb) => eb.ref("excluded.created_at"),
                reason: (eb) => eb.ref("excluded.reason"),
                force: (eb) => eb.ref("excluded.force"),
                wait_ms: (eb) => eb.ref("excluded.wait_ms"),
                updated_at_ms: (eb) => eb.ref("excluded.updated_at_ms"),
              }),
            ),
        );
      },
      { env },
    );
    return true;
  } catch (err) {
    restartLog.warn(`failed to write gateway restart intent: ${String(err)}`);
    return false;
  }
}
function clearGatewayRestartIntentSync(env = process.env) {
  try {
    runOpenClawStateWriteTransaction(
      ({ db }) => {
        executeSqliteQuerySync(
          db,
          getNodeSqliteKysely(db)
            .deleteFrom("gateway_restart_intent")
            .where("intent_key", "=", GATEWAY_RESTART_INTENT_KEY),
        );
      },
      { env },
    );
  } catch {}
}
function readGatewayRestartIntentPayloadSync(env) {
  try {
    const { db } = openOpenClawStateDatabase({ env });
    const parsed = executeSqliteQueryTakeFirstSync(
      db,
      getNodeSqliteKysely(db)
        .selectFrom("gateway_restart_intent")
        .select(["kind", "pid", "created_at", "reason", "force", "wait_ms"])
        .where("intent_key", "=", GATEWAY_RESTART_INTENT_KEY),
    );
    if (
      parsed?.kind === "gateway-restart" &&
      typeof parsed.pid === "number" &&
      Number.isFinite(parsed.pid) &&
      typeof parsed.created_at === "number" &&
      Number.isFinite(parsed.created_at) &&
      (parsed.reason === null || typeof parsed.reason === "string") &&
      (parsed.force === null ||
        (typeof parsed.force === "number" && Number.isFinite(parsed.force))) &&
      (parsed.wait_ms === null ||
        (typeof parsed.wait_ms === "number" &&
          Number.isFinite(parsed.wait_ms) &&
          parsed.wait_ms >= 0))
    ) {
      const reason = normalizeRestartIntentReason(parsed.reason ?? void 0);
      return {
        kind: "gateway-restart",
        pid: parsed.pid,
        createdAt: parsed.created_at,
        ...(reason ? { reason } : {}),
        ...(parsed.force ? { force: true } : {}),
        ...(typeof parsed.wait_ms === "number" ? { waitMs: Math.floor(parsed.wait_ms) } : {}),
      };
    }
  } catch {
    return null;
  }
  return null;
}
function normalizeRestartIntentReason(reason) {
  const normalized = reason?.trim();
  return normalized ? truncateUtf16Safe(normalized, 200) : void 0;
}
function consumeGatewayRestartIntentPayloadSync(env = process.env, now = Date.now()) {
  const payload = readGatewayRestartIntentPayloadSync(env);
  clearGatewayRestartIntentSync(env);
  if (!payload) return null;
  if (payload.pid !== process.pid) return null;
  const ageMs = now - payload.createdAt;
  if (ageMs < 0 || ageMs > GATEWAY_RESTART_INTENT_TTL_MS) return null;
  return {
    ...(payload.reason ? { reason: payload.reason } : {}),
    ...(payload.force ? { force: true } : {}),
    ...(typeof payload.waitMs === "number" ? { waitMs: payload.waitMs } : {}),
  };
}
function consumeGatewayRestartIntentSync(env = process.env, now = Date.now()) {
  return consumeGatewayRestartIntentPayloadSync(env, now) !== null;
}
function summarizeChangedPaths(paths, maxPaths = 6) {
  if (!Array.isArray(paths) || paths.length === 0) return null;
  if (paths.length <= maxPaths) return paths.join(",");
  return `${paths.slice(0, maxPaths).join(",")},+${paths.length - maxPaths} more`;
}
function formatRestartAudit(audit) {
  const actor = typeof audit?.actor === "string" && audit.actor.trim() ? audit.actor.trim() : null;
  const deviceId =
    typeof audit?.deviceId === "string" && audit.deviceId.trim() ? audit.deviceId.trim() : null;
  const clientIp =
    typeof audit?.clientIp === "string" && audit.clientIp.trim() ? audit.clientIp.trim() : null;
  const changed = summarizeChangedPaths(audit?.changedPaths);
  const fields = [];
  if (actor) fields.push(`actor=${actor}`);
  if (deviceId) fields.push(`device=${deviceId}`);
  if (clientIp) fields.push(`ip=${clientIp}`);
  if (changed) fields.push(`changedPaths=${changed}`);
  return fields.length > 0 ? fields.join(" ") : "actor=<unknown>";
}
/**
 * Register a callback that scheduleGatewaySigusr1Restart checks before emitting SIGUSR1.
 * The callback should return the number of pending items (0 = safe to restart).
 */
function setPreRestartDeferralCheck(fn) {
  preRestartCheck = fn;
}
/**
 * Emit an authorized SIGUSR1 gateway restart, guarded against duplicate emissions.
 * Returns true if SIGUSR1 was emitted, false if a restart was already emitted.
 * Runtime callers use emitGatewayRestartWithSignalAdmission so the signal-to-drain
 * handoff stays fenced; this lower-level primitive remains available to tests.
 */
function emitGatewayRestart(reasonOverride, intent) {
  if (hasUnconsumedRestartSignal()) {
    clearActiveDeferralPolls();
    clearPendingScheduledRestart();
    return false;
  }
  clearActiveDeferralPolls();
  clearPendingScheduledRestart();
  emittedRestartToken = ++restartCycleToken;
  emittedRestartReason = reasonOverride ?? intent?.reason ?? pendingRestartReason;
  emittedRestartIntent = intent;
  authorizeGatewaySigusr1Restart();
  try {
    if (process.listenerCount("SIGUSR1") > 0) process.emit("SIGUSR1");
    else if (process.platform === "win32") {
      if (!triggerOpenClawRestart().ok) {
        rollBackGatewayRestartEmission();
        restartLog.warn("Windows scheduled task restart failed, token rolled back");
        return false;
      }
      consumeGatewaySigusr1RestartAuthorization();
      markGatewaySigusr1RestartHandled();
    } else process.kill(process.pid, "SIGUSR1");
  } catch {
    rollBackGatewayRestartEmission();
    return false;
  }
  lastRestartEmittedAt = Date.now();
  return true;
}
/**
 * Emits while holding the signal-to-drain admission fence.
 *
 * The caller must already own root-work admission. Scheduled restarts use the
 * independent-root wrapper below; config reloads run inside their reload root.
 */
function emitGatewayRestartWithSignalAdmission(reasonOverride, intent) {
  pendingRestartSignalAdmission =
    pendingRestartSignalAdmission ?? beginGatewayRestartSignalAdmission();
  const hadUnconsumedRestartSignal = hasUnconsumedRestartSignal();
  const emitted = emitGatewayRestart(reasonOverride, intent);
  if (!emitted && !hadUnconsumedRestartSignal) clearPendingRestartSignalAdmission();
  return emitted;
}
/** Closed restart result for owners that must distinguish coalescing from delivery failure. */
function requestGatewayRestartWithSignalAdmission(reasonOverride, intent) {
  const hadUnconsumedRestartSignal = hasUnconsumedRestartSignal();
  if (emitGatewayRestartWithSignalAdmission(reasonOverride, intent)) return { status: "emitted" };
  return { status: hadUnconsumedRestartSignal ? "coalesced" : "failed" };
}
function resetSigusr1AuthorizationIfExpired(now = Date.now()) {
  if (sigusr1AuthorizedCount <= 0) return;
  if (now <= sigusr1AuthorizedUntil) return;
  sigusr1AuthorizedCount = 0;
  sigusr1AuthorizedUntil = 0;
}
function setGatewaySigusr1RestartPolicy(opts) {
  sigusr1ExternalAllowed = opts?.allowExternal === true;
}
function isGatewaySigusr1RestartExternallyAllowed() {
  return sigusr1ExternalAllowed;
}
function authorizeGatewaySigusr1Restart(delayMs = 0) {
  const delay = Math.max(0, Math.floor(delayMs));
  const expiresAt = Date.now() + delay + SIGUSR1_AUTH_GRACE_MS;
  sigusr1AuthorizedCount += 1;
  if (expiresAt > sigusr1AuthorizedUntil) sigusr1AuthorizedUntil = expiresAt;
}
function consumeGatewaySigusr1RestartAuthorization() {
  resetSigusr1AuthorizationIfExpired();
  if (sigusr1AuthorizedCount <= 0) return false;
  sigusr1AuthorizedCount -= 1;
  if (sigusr1AuthorizedCount <= 0) sigusr1AuthorizedUntil = 0;
  return true;
}
function peekGatewaySigusr1RestartReason() {
  return hasUnconsumedRestartSignal() ? emittedRestartReason : void 0;
}
/**
 * Reads and clears only the in-memory intent for the current emitted SIGUSR1 cycle.
 * The restart reason and cycle token are advanced by markGatewaySigusr1RestartHandled().
 */
function consumeGatewaySigusr1RestartIntent() {
  if (!hasUnconsumedRestartSignal()) return null;
  const intent = emittedRestartIntent ?? null;
  emittedRestartIntent = void 0;
  return intent;
}
/**
 * Mark the currently emitted SIGUSR1 restart cycle as consumed by the run loop.
 * This explicitly advances the cycle state instead of resetting emit guards inside
 * consumeGatewaySigusr1RestartAuthorization().
 */
function markGatewaySigusr1RestartHandled() {
  if (hasUnconsumedRestartSignal()) {
    consumedRestartToken = emittedRestartToken;
    emittedRestartReason = void 0;
    emittedRestartIntent = void 0;
  }
  clearPendingRestartSignalAdmission();
}
function rollBackGatewayRestartEmission() {
  emittedRestartToken = consumedRestartToken;
  emittedRestartReason = void 0;
  emittedRestartIntent = void 0;
  consumeGatewaySigusr1RestartAuthorization();
}
function resolveGatewayRestartDeferralTimeoutMs(timeoutMs) {
  if (typeof timeoutMs !== "number" || !Number.isFinite(timeoutMs))
    return DEFAULT_RESTART_DEFERRAL_TIMEOUT_MS;
  if (timeoutMs <= 0) return;
  return Math.floor(timeoutMs);
}
function canReplacePendingRestartEmitHooks(hooks, sessionKey) {
  if (!hooks) return true;
  return pendingRestartSessionKey === void 0 || pendingRestartSessionKey === sessionKey;
}
function updatePendingRestartEmitHooks(hooks, sessionKey) {
  if (!canReplacePendingRestartEmitHooks(hooks, sessionKey)) return false;
  if (!hooks) return false;
  pendingRestartEmitHooks = hooks;
  if (sessionKey !== void 0) pendingRestartSessionKey = sessionKey;
  return true;
}
async function rejectPreparedRestartHook(hooks) {
  try {
    await hooks?.afterEmitRejected?.();
  } catch {}
}
async function rejectPreparedRestartHooks(hooksList) {
  for (const hooks of hooksList) await rejectPreparedRestartHook(hooks);
}
async function emitPreparedGatewayRestartUnderAdmission(
  hooks,
  reasonOverride,
  intent,
  transientGeneration = restartTransientGeneration,
  canEmit = () => true,
) {
  const isCurrent = () => transientGeneration === restartTransientGeneration && canEmit();
  if (!isCurrent()) return null;
  let callerPrepared = false;
  if (hooks) {
    try {
      await hooks.beforeEmit?.();
      callerPrepared = true;
    } catch (err) {
      restartLog.warn(
        `restart preparation failed; restart will continue without it: ${String(err)}`,
      );
    }
    if (!isCurrent()) {
      if (callerPrepared) await rejectPreparedRestartHook(hooks);
      return null;
    }
  }
  let nextParked = pendingRestartEmitHooks;
  pendingRestartEmitHooks = void 0;
  let preparedParked;
  const rejectCallerOnBail = async () => {
    if (hooks && callerPrepared) await rejectPreparedRestartHook(hooks);
  };
  while (nextParked) {
    if (preparedParked) {
      await rejectPreparedRestartHook(preparedParked);
      preparedParked = void 0;
      if (!isCurrent()) {
        await rejectCallerOnBail();
        return null;
      }
    }
    try {
      await nextParked.beforeEmit?.();
      preparedParked = nextParked;
    } catch (err) {
      restartLog.warn(
        `restart preparation failed; restart will continue without it: ${String(err)}`,
      );
    }
    if (!isCurrent()) {
      await rejectPreparedRestartHook(preparedParked);
      await rejectCallerOnBail();
      return null;
    }
    nextParked = pendingRestartEmitHooks;
    pendingRestartEmitHooks = void 0;
  }
  pendingRestartSessionKey = void 0;
  const preparedHooksList = [];
  if (preparedParked) preparedHooksList.push(preparedParked);
  if (hooks && callerPrepared) preparedHooksList.push(hooks);
  const emitOwner = hooks ? (callerPrepared ? hooks : void 0) : preparedParked;
  if (!isCurrent()) {
    await rejectPreparedRestartHooks(preparedHooksList);
    return null;
  }
  const preferredReason = shouldPreferRestartReason(pendingRestartReason, reasonOverride)
    ? pendingRestartReason
    : void 0;
  const resolvedReason = preferredReason ?? reasonOverride;
  const resolvedIntent =
    preferredReason && intent
      ? {
          ...intent,
          reason: preferredReason,
        }
      : intent;
  const emitResult = emitOwner?.emitRestart
    ? emitOwner.emitRestart(resolvedReason, resolvedIntent)
    : requestGatewayRestartWithSignalAdmission(resolvedReason, resolvedIntent);
  if (emitResult.status !== "emitted") await rejectPreparedRestartHooks(preparedHooksList);
  if (emitResult.status === "failed")
    for (const prepared of preparedHooksList)
      try {
        await prepared.afterEmitFailed?.();
      } catch {}
  return emitResult;
}
async function emitPreparedGatewayRestart(
  hooks,
  reasonOverride,
  intent,
  finalIdleCheck,
  setFenceRollback,
) {
  const transientGeneration = restartTransientGeneration;
  try {
    return await runWithGatewayIndependentRootWorkAdmission(async () => {
      if (transientGeneration !== restartTransientGeneration) return false;
      const signalAdmission = beginGatewayRestartSignalAdmission();
      pendingRestartSignalAdmission = signalAdmission;
      let fenceActive = true;
      const rollbackFence = () => {
        fenceActive = false;
        signalAdmission.rollback();
        if (pendingRestartSignalAdmission === signalAdmission) pendingRestartSignalAdmission = null;
      };
      setFenceRollback?.(rollbackFence);
      let isIdle;
      try {
        isIdle = finalIdleCheck
          ? finalIdleCheck() && getActiveGatewayRootWorkCount({ excludeCurrent: true }) === 0
          : true;
      } catch (err) {
        rollbackFence();
        setFenceRollback?.(null);
        throw err;
      }
      if (!isIdle) {
        rollbackFence();
        setFenceRollback?.(null);
        return false;
      }
      const emitResult = await emitPreparedGatewayRestartUnderAdmission(
        hooks,
        reasonOverride,
        intent,
        transientGeneration,
        () => fenceActive,
      );
      if (
        !emitResult ||
        emitResult.status === "failed" ||
        (emitResult.status === "coalesced" && !hasUnconsumedRestartSignal())
      )
        rollbackFence();
      setFenceRollback?.(null);
      return emitResult !== null;
    });
  } catch (err) {
    if (!isGatewayRestartDraining()) throw err;
    return true;
  }
}
/**
 * Poll pending work until it drains, then emit one restart signal.
 * A positive maxWaitMs keeps the old capped behavior for explicit configs.
 * Shared by both the direct RPC restart path and the config watcher path.
 */
function deferGatewayRestartUntilIdle(opts) {
  const pollMs = resolveTimerTimeoutMs(opts.pollMs, DEFAULT_DEFERRAL_POLL_MS, 10);
  const maxWaitMs =
    typeof opts.maxWaitMs === "number" && Number.isFinite(opts.maxWaitMs) && opts.maxWaitMs > 0
      ? Math.max(pollMs, Math.floor(opts.maxWaitMs))
      : void 0;
  let cancelled = false;
  let attemptingEmission = false;
  let cancelEmissionFence = null;
  let poll = null;
  const stopPoll = () => {
    if (!poll) return;
    clearInterval(poll);
    activeDeferralPolls.delete(poll);
    poll = null;
  };
  const cancel = () => {
    cancelled = true;
    cancelEmissionFence?.();
    cancelEmissionFence = null;
    stopPoll();
  };
  const handle = { cancel };
  const startedAt = Date.now();
  let nextStillPendingAt = startedAt + DEFAULT_DEFERRAL_STILL_PENDING_WARN_MS;
  const attemptEmission = (params) => {
    if (cancelled || attemptingEmission) return;
    attemptingEmission = true;
    emitPreparedGatewayRestart(
      opts.emitHooks,
      opts.reason,
      params.intent,
      params.skipIdleCheck ? void 0 : () => opts.getPendingCount() <= 0,
      (rollback) => {
        cancelEmissionFence = rollback;
      },
    )
      .then((attempted) => {
        attemptingEmission = false;
        cancelEmissionFence = null;
        if (cancelled || !attempted) return;
        stopPoll();
        if (params.notifyReady) opts.hooks?.onReady?.();
      })
      .catch((err) => {
        attemptingEmission = false;
        cancelEmissionFence = null;
        stopPoll();
        opts.hooks?.onCheckError?.(err);
        emitPreparedGatewayRestart(opts.emitHooks, opts.reason, params.intent);
      });
  };
  const inspectPending = () => {
    if (cancelled) return;
    let current;
    try {
      current = opts.getPendingCount();
    } catch (err) {
      stopPoll();
      opts.hooks?.onCheckError?.(err);
      emitPreparedGatewayRestart(opts.emitHooks, opts.reason);
      return;
    }
    if (current <= 0) {
      attemptEmission({ notifyReady: true });
      return;
    }
    const elapsedMs = Date.now() - startedAt;
    if (Date.now() >= nextStillPendingAt) {
      opts.hooks?.onStillPending?.(current, elapsedMs);
      nextStillPendingAt = Date.now() + DEFAULT_DEFERRAL_STILL_PENDING_WARN_MS;
    }
    if (maxWaitMs !== void 0 && elapsedMs >= maxWaitMs) {
      stopPoll();
      opts.hooks?.onTimeout?.(current, elapsedMs);
      attemptEmission({
        intent: opts.timeoutIntent,
        notifyReady: false,
        skipIdleCheck: true,
      });
    }
  };
  let pending;
  try {
    pending = opts.getPendingCount();
  } catch (err) {
    opts.hooks?.onCheckError?.(err);
    emitPreparedGatewayRestart(opts.emitHooks, opts.reason);
    return handle;
  }
  if (pending > 0) opts.hooks?.onDeferring?.(pending);
  poll = setInterval(inspectPending, pollMs);
  activeDeferralPolls.add(poll);
  if (pending <= 0) attemptEmission({ notifyReady: true });
  return handle;
}
function formatSpawnDetail(result) {
  const clean = (value) => {
    return (typeof value === "string" ? value : value ? value.toString() : "")
      .replace(/\s+/g, " ")
      .trim();
  };
  if (result.error) {
    if (result.error instanceof Error) return result.error.message;
    if (typeof result.error === "string") return result.error;
    try {
      return JSON.stringify(result.error);
    } catch {
      return "unknown error";
    }
  }
  const stderr = clean(result.stderr);
  if (stderr) return stderr;
  const stdout = clean(result.stdout);
  if (stdout) return stdout;
  if (typeof result.status === "number") return `exit ${result.status}`;
  return "unknown error";
}
function normalizeSystemdUnit(raw, profile) {
  const unit = raw?.trim();
  if (!unit) return `${resolveGatewaySystemdServiceName(profile)}.service`;
  return unit.endsWith(".service") ? unit : `${unit}.service`;
}
function triggerOpenClawRestart() {
  if (process.env.VITEST || false)
    return {
      ok: true,
      method: "supervisor",
      detail: "test mode",
    };
  cleanStaleGatewayProcessesSync();
  const tried = [];
  if (process.platform === "linux") {
    const unit = normalizeSystemdUnit(
      process.env.OPENCLAW_SYSTEMD_UNIT,
      process.env.OPENCLAW_PROFILE,
    );
    const userArgs = ["--user", "restart", unit];
    tried.push(`systemctl ${userArgs.join(" ")}`);
    const userRestart = spawnSync("systemctl", userArgs, {
      encoding: "utf8",
      timeout: SPAWN_TIMEOUT_MS,
    });
    if (!userRestart.error && userRestart.status === 0)
      return {
        ok: true,
        method: "systemd",
        tried,
      };
    const systemArgs = ["restart", unit];
    tried.push(`systemctl ${systemArgs.join(" ")}`);
    const systemRestart = spawnSync("systemctl", systemArgs, {
      encoding: "utf8",
      timeout: SPAWN_TIMEOUT_MS,
    });
    if (!systemRestart.error && systemRestart.status === 0)
      return {
        ok: true,
        method: "systemd",
        tried,
      };
    return {
      ok: false,
      method: "systemd",
      detail: [
        `user: ${formatSpawnDetail(userRestart)}`,
        `system: ${formatSpawnDetail(systemRestart)}`,
      ].join("; "),
      tried,
    };
  }
  if (process.platform === "win32") return relaunchGatewayScheduledTask(process.env);
  if (process.platform !== "darwin")
    return {
      ok: false,
      method: "supervisor",
      detail: "unsupported platform restart",
    };
  const label =
    process.env.OPENCLAW_LAUNCHD_LABEL ||
    resolveGatewayLaunchAgentLabel(process.env.OPENCLAW_PROFILE);
  const uid = typeof process.getuid === "function" ? process.getuid() : void 0;
  const domain = uid !== void 0 ? `gui/${uid}` : "gui/501";
  const target = `${domain}/${label}`;
  const args = ["kickstart", "-k", target];
  tried.push(`launchctl ${args.join(" ")}`);
  const res = spawnSync("launchctl", args, {
    encoding: "utf8",
    timeout: SPAWN_TIMEOUT_MS,
  });
  if (!res.error && res.status === 0)
    return {
      ok: true,
      method: "launchctl",
      tried,
    };
  const home = process.env.HOME?.trim() || os.homedir();
  const bootstrapArgs = [
    "bootstrap",
    domain,
    path.join(home, "Library", "LaunchAgents", `${label}.plist`),
  ];
  tried.push(`launchctl ${bootstrapArgs.join(" ")}`);
  const boot = spawnSync("launchctl", bootstrapArgs, {
    encoding: "utf8",
    timeout: SPAWN_TIMEOUT_MS,
  });
  if (
    boot.error ||
    (boot.status !== 0 &&
      boot.status !== LAUNCHCTL_ALREADY_LOADED_EXIT_CODE &&
      boot.status !== null)
  )
    return {
      ok: false,
      method: "launchctl",
      detail: formatSpawnDetail(boot),
      tried,
    };
  if (boot.status === 0)
    return {
      ok: true,
      method: "launchctl",
      tried,
    };
  const retryArgs = ["kickstart", target];
  tried.push(`launchctl ${retryArgs.join(" ")}`);
  const retry = spawnSync("launchctl", retryArgs, {
    encoding: "utf8",
    timeout: SPAWN_TIMEOUT_MS,
  });
  if (!retry.error && retry.status === 0)
    return {
      ok: true,
      method: "launchctl",
      tried,
    };
  return {
    ok: false,
    method: "launchctl",
    detail: formatSpawnDetail(retry),
    tried,
  };
}
function scheduleGatewaySigusr1Restart(opts) {
  const delayMsRaw =
    typeof opts?.delayMs === "number" && Number.isFinite(opts.delayMs)
      ? Math.floor(opts.delayMs)
      : 2e3;
  const delayMs = Math.min(Math.max(delayMsRaw, 0), 6e4);
  const reason = normalizeRestartIntentReason(opts?.reason);
  const mode =
    process.listenerCount("SIGUSR1") > 0
      ? "emit"
      : process.platform === "win32"
        ? "supervisor"
        : "signal";
  const nowMs = Date.now();
  const cooldownMsApplied =
    opts?.skipCooldown === true
      ? 0
      : Math.max(0, lastRestartEmittedAt + RESTART_COOLDOWN_MS - nowMs);
  const requestedDueAt = nowMs + delayMs + cooldownMsApplied;
  const skipDeferral = opts?.skipDeferral === true;
  let nextPendingEmitHooks = opts?.emitHooks;
  let nextPendingSessionKey = opts?.sessionKey;
  if (hasUnconsumedRestartSignal()) {
    if (shouldPreferRestartReason(reason, emittedRestartReason)) {
      emittedRestartReason = reason;
      if (emittedRestartIntent)
        emittedRestartIntent = {
          ...emittedRestartIntent,
          reason,
        };
    }
    restartLog.warn(
      `restart request coalesced (already in-flight) reason=${reason ?? "unspecified"} ${formatRestartAudit(opts?.audit)}`,
    );
    return {
      ok: true,
      pid: process.pid,
      signal: "SIGUSR1",
      delayMs: 0,
      reason,
      mode,
      coalesced: true,
      cooldownMsApplied,
      emitHooksQueued: false,
    };
  }
  if (pendingRestartTimer || pendingRestartPreparing) {
    const remainingMs = pendingRestartPreparing ? 0 : Math.max(0, pendingRestartDueAt - nowMs);
    if (pendingRestartPreparing && skipDeferral && activeDeferralPolls.size > 0) {
      restartLog.warn(
        `restart request bypassed active deferral reason=${reason ?? "unspecified"} pendingReason=${pendingRestartReason ?? "unspecified"} ${formatRestartAudit(opts?.audit)}`,
      );
      clearActiveDeferralPolls();
      pendingRestartReason = reason;
      if (
        !(
          opts?.preservePendingEmitHooksOnDeferralBypass === true &&
          opts?.emitHooks === void 0 &&
          pendingRestartSessionKey !== void 0
        )
      ) {
        pendingRestartEmitHooks = opts?.emitHooks;
        pendingRestartSessionKey = opts?.sessionKey;
      }
      emitPreparedGatewayRestart(void 0, reason);
      return {
        ok: true,
        pid: process.pid,
        signal: "SIGUSR1",
        delayMs: 0,
        reason,
        mode,
        coalesced: false,
        cooldownMsApplied,
        emitHooksQueued: opts?.emitHooks !== void 0,
      };
    }
    if (
      !pendingRestartPreparing &&
      (requestedDueAt < pendingRestartDueAt || (skipDeferral && !pendingRestartSkipDeferral))
    ) {
      const preservePendingHooks =
        opts?.preservePendingEmitHooksOnDeferralBypass === true &&
        opts?.emitHooks === void 0 &&
        pendingRestartSessionKey !== void 0;
      if (
        !preservePendingHooks &&
        !canReplacePendingRestartEmitHooks(opts?.emitHooks, opts?.sessionKey)
      ) {
        restartLog.warn(
          `restart continuation dropped: another session owns the pending restart (callerSessionKey=${opts?.sessionKey ?? "unspecified"} pendingSessionKey=${pendingRestartSessionKey ?? "unspecified"})`,
        );
        if (pendingRestartTimer) clearTimeout(pendingRestartTimer);
        pendingRestartTimer = null;
        pendingRestartDueAt = requestedDueAt;
        pendingRestartReason = reason;
        pendingRestartSkipDeferral = pendingRestartSkipDeferral || skipDeferral;
        armPendingRestartTimer(requestedDueAt, nowMs);
        return {
          ok: true,
          pid: process.pid,
          signal: "SIGUSR1",
          delayMs: Math.max(0, requestedDueAt - nowMs),
          reason,
          mode,
          coalesced: true,
          cooldownMsApplied,
          emitHooksQueued: false,
        };
      }
      const preservedEmitHooks = preservePendingHooks ? pendingRestartEmitHooks : void 0;
      const preservedSessionKey = preservePendingHooks ? pendingRestartSessionKey : void 0;
      restartLog.warn(
        `restart request rescheduled earlier reason=${reason ?? "unspecified"} pendingReason=${pendingRestartReason ?? "unspecified"} oldDelayMs=${remainingMs} newDelayMs=${Math.max(0, requestedDueAt - nowMs)} ${formatRestartAudit(opts?.audit)}`,
      );
      clearPendingScheduledRestart();
      if (preservePendingHooks) {
        nextPendingEmitHooks = preservedEmitHooks;
        nextPendingSessionKey = preservedSessionKey;
      }
    } else {
      if (shouldPreferRestartReason(reason, pendingRestartReason)) pendingRestartReason = reason;
      pendingRestartSkipDeferral = pendingRestartSkipDeferral || skipDeferral;
      restartLog.warn(
        `restart request coalesced (already scheduled) reason=${reason ?? "unspecified"} pendingReason=${pendingRestartReason ?? "unspecified"} delayMs=${remainingMs} ${formatRestartAudit(opts?.audit)}`,
      );
      const emitHooksQueued = updatePendingRestartEmitHooks(opts?.emitHooks, opts?.sessionKey);
      if (opts?.emitHooks && !emitHooksQueued)
        restartLog.warn(
          `restart continuation dropped: another session owns the pending restart (callerSessionKey=${opts.sessionKey ?? "unspecified"} pendingSessionKey=${pendingRestartSessionKey ?? "unspecified"})`,
        );
      return {
        ok: true,
        pid: process.pid,
        signal: "SIGUSR1",
        delayMs: remainingMs,
        reason,
        mode,
        coalesced: true,
        cooldownMsApplied,
        emitHooksQueued,
      };
    }
  }
  pendingRestartDueAt = requestedDueAt;
  pendingRestartReason = reason;
  pendingRestartEmitHooks = nextPendingEmitHooks;
  pendingRestartSessionKey = nextPendingSessionKey;
  pendingRestartSkipDeferral = skipDeferral;
  armPendingRestartTimer(requestedDueAt, nowMs);
  return {
    ok: true,
    pid: process.pid,
    signal: "SIGUSR1",
    delayMs: Math.max(0, requestedDueAt - nowMs),
    reason,
    mode,
    coalesced: false,
    cooldownMsApplied,
    emitHooksQueued: opts?.emitHooks !== void 0,
  };
}
//#endregion
export {
  triggerOpenClawRestart as _,
  consumeGatewaySigusr1RestartIntent as a,
  markGatewaySigusr1RestartHandled as c,
  resetGatewayRestartStateForInProcessRestart as d,
  resolveGatewayRestartDeferralTimeoutMs as f,
  setPreRestartDeferralCheck as g,
  setGatewaySigusr1RestartPolicy as h,
  consumeGatewaySigusr1RestartAuthorization as i,
  peekGatewaySigusr1RestartReason as l,
  scheduleGatewaySigusr1Restart as m,
  consumeGatewayRestartIntentPayloadSync as n,
  deferGatewayRestartUntilIdle as o,
  rollbackGatewayRestartSignalAdmission as p,
  consumeGatewayRestartIntentSync as r,
  isGatewaySigusr1RestartExternallyAllowed as s,
  clearGatewayRestartIntentSync as t,
  requestGatewayRestartWithSignalAdmission as u,
  writeGatewayRestartIntentSync as v,
};
