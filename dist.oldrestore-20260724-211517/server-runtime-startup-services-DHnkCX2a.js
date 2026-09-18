import {
  i as resolveChannelRestartReason,
  r as evaluateChannelHealth,
} from "./channel-health-policy-Bd5WQkSH.js";
import "./number-coercion-EqFmHmOw.js";
import { j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region src/gateway/server-runtime-service-shared.ts
/** Creates a heartbeat runner placeholder for minimal/test gateway service state. */
function createNoopHeartbeatRunner() {
  return {
    stop: () => {},
    updateConfig: (_cfg) => {},
  };
}
//#endregion
//#region src/gateway/channel-health-monitor.ts
const log = createSubsystemLogger("gateway/health-monitor");
const DEFAULT_CHECK_INTERVAL_MS = 5 * 6e4;
const DEFAULT_MONITOR_STARTUP_GRACE_MS = 6e4;
const DEFAULT_COOLDOWN_CYCLES = 2;
const DEFAULT_MAX_RESTARTS_PER_HOUR = 10;
const CHANNEL_HEALTH_MONITOR_HANDOFF_TIMEOUT_MS = 5e3;
const ONE_HOUR_MS = 60 * 6e4;
function resolveTimingPolicy(deps) {
  return {
    monitorStartupGraceMs: deps.timing?.monitorStartupGraceMs ?? DEFAULT_MONITOR_STARTUP_GRACE_MS,
    channelConnectGraceMs: deps.timing?.channelConnectGraceMs ?? 12e4,
    staleEventThresholdMs: deps.timing?.staleEventThresholdMs ?? 18e5,
  };
}
/** Start the periodic channel health monitor and return its stop handle. */
function startChannelHealthMonitor(deps) {
  const {
    channelManager,
    cooldownCycles = DEFAULT_COOLDOWN_CYCLES,
    maxRestartsPerHour = DEFAULT_MAX_RESTARTS_PER_HOUR,
    abortSignal,
  } = deps;
  const checkIntervalMs = resolveTimerTimeoutMs(deps.checkIntervalMs, DEFAULT_CHECK_INTERVAL_MS);
  const timing = resolveTimingPolicy(deps);
  const cooldownMs = cooldownCycles * checkIntervalMs;
  const restartRecords = /* @__PURE__ */ new Map();
  const startedAt = Date.now();
  let stopped = false;
  let abandonInFlightRestart = false;
  let activeCheck = null;
  let timer = null;
  const suppressedAccounts = /* @__PURE__ */ new Set();
  const rKey = (channelId, accountId) => `${channelId}:${accountId}`;
  function pruneOldRestarts(record, now) {
    record.restartsThisHour = record.restartsThisHour.filter((r) => now - r.at < ONE_HOUR_MS);
  }
  async function runCheckWork() {
    try {
      const now = Date.now();
      if (now - startedAt < timing.monitorStartupGraceMs) return;
      const snapshot = channelManager.getRuntimeSnapshot();
      const autostartSuppression = channelManager.getAutostartSuppression();
      if (!autostartSuppression) suppressedAccounts.clear();
      for (const [channelId, accounts] of Object.entries(snapshot.channelAccounts)) {
        if (!accounts) continue;
        for (const [accountId, status] of Object.entries(accounts)) {
          if (stopped) return;
          if (!status) continue;
          if (!channelManager.isHealthMonitorEnabled(channelId, accountId)) continue;
          if (channelManager.isManuallyStopped(channelId, accountId)) continue;
          const key = rKey(channelId, accountId);
          if (autostartSuppression) {
            if (status.running !== true && !suppressedAccounts.has(key)) {
              log.info?.(
                `[${channelId}:${accountId}] health-monitor: channel autostart suppressed; treating as expected stopped`,
              );
              suppressedAccounts.add(key);
            }
            continue;
          }
          suppressedAccounts.delete(key);
          const health = evaluateChannelHealth(status, {
            channelId,
            now,
            staleEventThresholdMs: timing.staleEventThresholdMs,
            channelConnectGraceMs: timing.channelConnectGraceMs,
          });
          if (health.healthy) continue;
          if (health.reason === "terminal-disconnect") {
            log.info?.(
              `[${channelId}:${accountId}] health-monitor: skipping restart, terminal disconnect`,
            );
            continue;
          }
          const record = restartRecords.get(key) ?? {
            lastRestartAt: 0,
            restartsThisHour: [],
          };
          const continuingPendingRestart =
            status.running !== true &&
            status.restartPending === true &&
            (status.reconnectAttempts ?? 0) === 0;
          if (!continuingPendingRestart && now - record.lastRestartAt <= cooldownMs) continue;
          pruneOldRestarts(record, now);
          if (!continuingPendingRestart && record.restartsThisHour.length >= maxRestartsPerHour) {
            log.warn?.(
              `[${channelId}:${accountId}] health-monitor: hit ${maxRestartsPerHour} restarts/hour limit, skipping`,
            );
            continue;
          }
          const reason = resolveChannelRestartReason(status, health);
          log.info?.(`[${channelId}:${accountId}] health-monitor: restarting (reason: ${reason})`);
          if (!continuingPendingRestart) {
            record.lastRestartAt = now;
            record.restartsThisHour.push({ at: now });
            restartRecords.set(key, record);
          }
          try {
            if (status.running)
              await channelManager.stopChannel(channelId, accountId, { manual: false });
            if (abandonInFlightRestart) return;
            channelManager.resetRestartAttempts(channelId, accountId);
            await channelManager.startChannel(channelId, accountId);
          } catch (err) {
            log.error?.(
              `[${channelId}:${accountId}] health-monitor: restart failed: ${String(err)}`,
            );
          }
        }
      }
    } catch (err) {
      log.error?.(`health-monitor: check failed: ${String(err)}`);
    }
  }
  function runCheck() {
    if (stopped) return Promise.resolve();
    if (activeCheck) return activeCheck;
    const check = runCheckWork().finally(() => {
      if (activeCheck === check) activeCheck = null;
      if (stopped) abortSignal?.removeEventListener("abort", shutdown);
    });
    activeCheck = check;
    return check;
  }
  function retire(abandonRestart) {
    stopped = true;
    abandonInFlightRestart ||= abandonRestart;
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    if (!activeCheck) abortSignal?.removeEventListener("abort", shutdown);
  }
  const stop = () => retire(false);
  const shutdown = () => retire(true);
  const waitForIdle = async () => {
    const check = activeCheck;
    if (!check) return;
    let timeout;
    const outcome = await Promise.race([
      check.then(() => "idle"),
      new Promise((resolve) => {
        timeout = setTimeout(() => resolve("timeout"), CHANNEL_HEALTH_MONITOR_HANDOFF_TIMEOUT_MS);
        if (typeof timeout === "object" && "unref" in timeout) timeout.unref();
      }),
    ]);
    if (timeout) clearTimeout(timeout);
    if (outcome === "timeout") {
      shutdown();
      log.warn?.(
        `health-monitor handoff exceeded ${CHANNEL_HEALTH_MONITOR_HANDOFF_TIMEOUT_MS}ms; abandoning delayed restart`,
      );
    }
  };
  if (abortSignal?.aborted) {
    stopped = true;
    abandonInFlightRestart = true;
  } else {
    abortSignal?.addEventListener("abort", shutdown, { once: true });
    timer = setInterval(() => void runCheck(), checkIntervalMs);
    if (typeof timer === "object" && "unref" in timer) timer.unref();
    log.info?.(
      `started (interval: ${Math.round(checkIntervalMs / 1e3)}s, startup-grace: ${Math.round(timing.monitorStartupGraceMs / 1e3)}s, channel-connect-grace: ${Math.round(timing.channelConnectGraceMs / 1e3)}s)`,
    );
  }
  return {
    stop,
    shutdown,
    waitForIdle,
  };
}
//#endregion
//#region src/gateway/server-runtime-startup-services.ts
/** Starts channel health monitoring when gateway config enables it. */
function startGatewayChannelHealthMonitor(params) {
  const healthCheckMinutes = params.cfg.gateway?.channelHealthCheckMinutes;
  if (healthCheckMinutes === 0) return null;
  const staleEventThresholdMinutes = params.cfg.gateway?.channelStaleEventThresholdMinutes;
  const maxRestartsPerHour = params.cfg.gateway?.channelMaxRestartsPerHour;
  return startChannelHealthMonitor({
    channelManager: params.channelManager,
    checkIntervalMs: (healthCheckMinutes ?? 5) * 6e4,
    ...(staleEventThresholdMinutes != null && {
      timing: { staleEventThresholdMs: staleEventThresholdMinutes * 6e4 },
    }),
    ...(maxRestartsPerHour != null && { maxRestartsPerHour }),
  });
}
/** Starts background runtime services and returns their stop/update handles. */
function startGatewayRuntimeServices(params) {
  const channelHealthMonitor = startGatewayChannelHealthMonitor({
    cfg: params.cfgAtStart,
    channelManager: params.channelManager,
  });
  return {
    heartbeatRunner: createNoopHeartbeatRunner(),
    channelHealthMonitor,
    stopModelPricingRefresh: () => {},
  };
}
//#endregion
export {
  startGatewayRuntimeServices as n,
  createNoopHeartbeatRunner as r,
  startGatewayChannelHealthMonitor as t,
};
