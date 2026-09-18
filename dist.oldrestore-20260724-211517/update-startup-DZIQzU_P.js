import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { n as isTruthyEnvValue } from "./env-Di-LcxqW.js";
import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { P as timestampMsToIsoString, o as asDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
import "./config-BDv-QbJ6.js";
import { t as resolveOpenClawPackageRoot } from "./openclaw-root-DSkQ6e_8.js";
import {
  L as executeSqliteQuerySync,
  R as executeSqliteQueryTakeFirstSync,
  l as runOpenClawStateWriteTransaction,
  s as openOpenClawStateDatabase,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import {
  f as resolveGatewayRestartDeferralTimeoutMs,
  m as scheduleGatewaySigusr1Restart,
} from "./restart-DuVWNzPR.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { n as detectRespawnSupervisor } from "./supervisor-markers-BnpKGoUs.js";
import { a as channelToNpmTag, l as normalizeUpdateChannel } from "./update-channels-CQNa2YMG.js";
import {
  n as compareSemverStrings,
  s as resolveNpmChannelTag,
  t as checkUpdateStatus,
} from "./update-check-DaMnBu3x.js";
import { t as CONTROL_PLANE_UPDATE_HANDOFF_STARTED_REASON } from "./update-control-plane-sentinel-DS3ELeta.js";
import { r as startManagedServiceUpdateHandoff } from "./update-managed-service-handoff-B_eGRS-f.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
//#region src/infra/update-startup.ts
let updateAvailableCache = null;
function getUpdateAvailable() {
  return updateAvailableCache;
}
const UPDATE_CHECK_STATE_KEY = "default";
const UPDATE_CHECK_INTERVAL_MS = 1440 * 60 * 1e3;
const ONE_HOUR_MS = 3600 * 1e3;
const AUTO_UPDATE_COMMAND_TIMEOUT_MS = 2700 * 1e3;
const AUTO_STABLE_DELAY_HOURS_DEFAULT = 6;
const AUTO_STABLE_JITTER_HOURS_DEFAULT = 12;
const AUTO_BETA_CHECK_INTERVAL_HOURS_DEFAULT = 1;
const MANAGED_AUTO_UPDATE_SYSTEMD_RESTART_GRACE_MS = 2e3;
function shouldSkipCheck(allowInTests) {
  if (allowInTests) return false;
  if (process.env.VITEST || false) return true;
  return false;
}
function resolveAutoUpdatePolicy(cfg) {
  const auto = cfg.update?.auto;
  const stableDelayHours =
    typeof auto?.stableDelayHours === "number" && Number.isFinite(auto.stableDelayHours)
      ? Math.max(0, auto.stableDelayHours)
      : AUTO_STABLE_DELAY_HOURS_DEFAULT;
  const stableJitterHours =
    typeof auto?.stableJitterHours === "number" && Number.isFinite(auto.stableJitterHours)
      ? Math.max(0, auto.stableJitterHours)
      : AUTO_STABLE_JITTER_HOURS_DEFAULT;
  const betaCheckIntervalHours =
    typeof auto?.betaCheckIntervalHours === "number" && Number.isFinite(auto.betaCheckIntervalHours)
      ? Math.max(0.25, auto.betaCheckIntervalHours)
      : AUTO_BETA_CHECK_INTERVAL_HOURS_DEFAULT;
  return {
    enabled: Boolean(auto?.enabled),
    stableDelayHours,
    stableJitterHours,
    betaCheckIntervalHours,
  };
}
function resolveCheckIntervalMs(cfg) {
  const channel = normalizeUpdateChannel(cfg.update?.channel) ?? "stable";
  const auto = resolveAutoUpdatePolicy(cfg);
  if (!auto.enabled) return UPDATE_CHECK_INTERVAL_MS;
  if (channel === "beta")
    return Math.max(ONE_HOUR_MS / 4, Math.floor(auto.betaCheckIntervalHours * ONE_HOUR_MS));
  if (channel === "stable") return ONE_HOUR_MS;
  return UPDATE_CHECK_INTERVAL_MS;
}
function presentString(value) {
  return value ?? void 0;
}
async function readState() {
  const database = openOpenClawStateDatabase();
  const stateDb = getNodeSqliteKysely(database.db);
  const row = executeSqliteQueryTakeFirstSync(
    database.db,
    stateDb
      .selectFrom("update_check_state")
      .selectAll()
      .where("state_key", "=", UPDATE_CHECK_STATE_KEY),
  );
  if (!row) return {};
  return {
    lastCheckedAt: presentString(row.last_checked_at),
    lastNotifiedVersion: presentString(row.last_notified_version),
    lastNotifiedTag: presentString(row.last_notified_tag),
    lastAvailableVersion: presentString(row.last_available_version),
    lastAvailableTag: presentString(row.last_available_tag),
    autoInstallId: presentString(row.auto_install_id),
    autoFirstSeenVersion: presentString(row.auto_first_seen_version),
    autoFirstSeenTag: presentString(row.auto_first_seen_tag),
    autoFirstSeenAt: presentString(row.auto_first_seen_at),
    autoLastAttemptVersion: presentString(row.auto_last_attempt_version),
    autoLastAttemptAt: presentString(row.auto_last_attempt_at),
    autoLastSuccessVersion: presentString(row.auto_last_success_version),
    autoLastSuccessAt: presentString(row.auto_last_success_at),
  };
}
async function writeState(state) {
  const updatedAtMs = Date.now();
  runOpenClawStateWriteTransaction(({ db }) => {
    const stateDb = getNodeSqliteKysely(db);
    executeSqliteQuerySync(
      db,
      stateDb.deleteFrom("update_check_state").where("state_key", "=", UPDATE_CHECK_STATE_KEY),
    );
    executeSqliteQuerySync(
      db,
      stateDb.insertInto("update_check_state").values({
        state_key: UPDATE_CHECK_STATE_KEY,
        last_checked_at: state.lastCheckedAt ?? null,
        last_notified_version: state.lastNotifiedVersion ?? null,
        last_notified_tag: state.lastNotifiedTag ?? null,
        last_available_version: state.lastAvailableVersion ?? null,
        last_available_tag: state.lastAvailableTag ?? null,
        auto_install_id: state.autoInstallId ?? null,
        auto_first_seen_version: state.autoFirstSeenVersion ?? null,
        auto_first_seen_tag: state.autoFirstSeenTag ?? null,
        auto_first_seen_at: state.autoFirstSeenAt ?? null,
        auto_last_attempt_version: state.autoLastAttemptVersion ?? null,
        auto_last_attempt_at: state.autoLastAttemptAt ?? null,
        auto_last_success_version: state.autoLastSuccessVersion ?? null,
        auto_last_success_at: state.autoLastSuccessAt ?? null,
        updated_at_ms: updatedAtMs,
      }),
    );
  });
}
function sameUpdateAvailable(a, b) {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.currentVersion === b.currentVersion &&
    a.latestVersion === b.latestVersion &&
    a.channel === b.channel
  );
}
function setUpdateAvailableCache(params) {
  if (sameUpdateAvailable(updateAvailableCache, params.next)) return;
  updateAvailableCache = params.next;
  params.onUpdateAvailableChange?.(params.next);
}
function isPersistedAvailabilityForChannel(params) {
  const tag = params.state.lastAvailableTag?.trim();
  if (params.channel === "stable") return !tag || tag === "latest";
  if (params.channel === "beta") return tag === "beta" || tag === "latest";
  return tag === params.channel;
}
function resolvePersistedUpdateAvailable(state, channel) {
  const latestVersion = state.lastAvailableVersion?.trim();
  if (
    !latestVersion ||
    !isPersistedAvailabilityForChannel({
      state,
      channel,
    })
  )
    return null;
  const cmp = compareSemverStrings(VERSION, latestVersion);
  if (cmp == null || cmp >= 0) return null;
  return {
    currentVersion: VERSION,
    latestVersion,
    channel: state.lastAvailableTag?.trim() || channelToNpmTag(channel),
  };
}
function clearPersistedAvailabilityForChannel(nextState, channel) {
  if (
    !isPersistedAvailabilityForChannel({
      state: nextState,
      channel,
    })
  )
    return;
  delete nextState.lastAvailableVersion;
  delete nextState.lastAvailableTag;
}
function resolveStableJitterMs(params) {
  if (params.jitterWindowMs <= 0) return 0;
  return (
    createHash("sha256")
      .update(`${params.installId}:${params.version}:${params.tag}`)
      .digest()
      .readUInt32BE(0) %
    (Math.floor(params.jitterWindowMs) + 1)
  );
}
function resolveUpdateCheckNowMs(valueMs) {
  return asDateTimestampMs(valueMs) ?? asDateTimestampMs(Date.now()) ?? 0;
}
function resolveUpdateCheckTimestamp(valueMs) {
  return (
    timestampMsToIsoString(valueMs) ??
    timestampMsToIsoString(resolveUpdateCheckNowMs(Date.now())) ??
    /* @__PURE__ */ new Date().toISOString()
  );
}
function resolveStableAutoApplyAtMs(params) {
  if (!params.nextState.autoInstallId)
    params.nextState.autoInstallId = params.state.autoInstallId?.trim() || randomUUID();
  const installId = params.nextState.autoInstallId;
  if (
    !(
      params.state.autoFirstSeenVersion === params.version &&
      params.state.autoFirstSeenTag === params.tag
    )
  ) {
    params.nextState.autoFirstSeenVersion = params.version;
    params.nextState.autoFirstSeenTag = params.tag;
    params.nextState.autoFirstSeenAt = resolveUpdateCheckTimestamp(params.nowMs);
  } else {
    params.nextState.autoFirstSeenVersion = params.state.autoFirstSeenVersion;
    params.nextState.autoFirstSeenTag = params.state.autoFirstSeenTag;
    params.nextState.autoFirstSeenAt = params.state.autoFirstSeenAt;
  }
  const parsedFirstSeenMs = params.nextState.autoFirstSeenAt
    ? Date.parse(params.nextState.autoFirstSeenAt)
    : params.nowMs;
  const firstSeenMs = Number.isFinite(parsedFirstSeenMs) ? parsedFirstSeenMs : params.nowMs;
  const baseDelayMs = Math.max(0, params.stableDelayHours) * ONE_HOUR_MS;
  const jitterWindowMs = Math.max(0, params.stableJitterHours) * ONE_HOUR_MS;
  const jitterMs = resolveStableJitterMs({
    installId,
    version: params.version,
    tag: params.tag,
    jitterWindowMs,
  });
  return firstSeenMs + baseDelayMs + jitterMs;
}
function resolveAutoUpdateHandoffRoot(root) {
  if (root?.trim()) return root;
  try {
    return process.cwd();
  } catch {
    return os.homedir();
  }
}
function resolveManagedAutoUpdateRestartDelayMs(supervisor) {
  return supervisor === "systemd" ? MANAGED_AUTO_UPDATE_SYSTEMD_RESTART_GRACE_MS : 0;
}
async function startManagedServiceAutoUpdateHandoff(params) {
  const restartDelayMs = resolveManagedAutoUpdateRestartDelayMs(params.supervisor);
  const handoffId = randomUUID();
  try {
    const started = await startManagedServiceUpdateHandoff({
      root: resolveAutoUpdateHandoffRoot(params.root),
      timeoutMs: params.timeoutMs,
      restartDrainTimeoutMs: params.restartDrainTimeoutMs,
      channel: params.channel,
      restartDelayMs,
      supervisor: params.supervisor,
      handoffId,
      meta: {
        handoffId,
        note: "background auto-update",
      },
    });
    scheduleGatewaySigusr1Restart({
      delayMs: restartDelayMs,
      reason: "update.auto",
      skipCooldown: true,
      skipDeferral: true,
    });
    return {
      ok: true,
      code: 0,
      reason: CONTROL_PLANE_UPDATE_HANDOFF_STARTED_REASON,
      command: started.command,
      logPath: started.logPath,
    };
  } catch (err) {
    return {
      ok: false,
      code: null,
      reason: String(err),
    };
  }
}
async function runAutoUpdateCommand(params) {
  const supervisor = detectRespawnSupervisor(process.env, process.platform, {
    includeLinuxOpenClawGatewayServiceMarker: true,
  });
  if (supervisor)
    return await startManagedServiceAutoUpdateHandoff({
      channel: params.channel,
      timeoutMs: params.timeoutMs,
      restartDrainTimeoutMs: params.restartDrainTimeoutMs,
      root: params.root,
      supervisor,
    });
  const baseArgs = ["update", "--yes", "--channel", params.channel, "--json"];
  const execPath = process.execPath?.trim();
  const argv1 = process.argv[1]?.trim();
  const lowerExecBase = execPath ? normalizeLowercaseStringOrEmpty(path.basename(execPath)) : "";
  const runtimeIsNodeOrBun =
    lowerExecBase === "node" ||
    lowerExecBase === "node.exe" ||
    lowerExecBase === "bun" ||
    lowerExecBase === "bun.exe";
  const argv = [];
  if (execPath && argv1) argv.push(execPath, argv1, ...baseArgs);
  else if (execPath && !runtimeIsNodeOrBun) argv.push(execPath, ...baseArgs);
  else if (execPath && params.root) {
    const candidates = [
      path.join(params.root, "dist", "entry.js"),
      path.join(params.root, "dist", "entry.mjs"),
      path.join(params.root, "dist", "index.js"),
      path.join(params.root, "dist", "index.mjs"),
    ];
    for (const candidate of candidates)
      try {
        await fs.access(candidate);
        argv.push(execPath, candidate, ...baseArgs);
        break;
      } catch {}
  }
  if (argv.length === 0) argv.push("openclaw", ...baseArgs);
  try {
    const res = await runCommandWithTimeout(argv, {
      timeoutMs: params.timeoutMs,
      env: { OPENCLAW_AUTO_UPDATE: "1" },
    });
    return {
      ok: res.code === 0,
      code: res.code,
      stdout: res.stdout,
      stderr: res.stderr,
      reason: res.code === 0 ? void 0 : "non-zero-exit",
    };
  } catch (err) {
    return {
      ok: false,
      code: null,
      reason: String(err),
    };
  }
}
function clearAutoState(nextState) {
  delete nextState.autoFirstSeenVersion;
  delete nextState.autoFirstSeenTag;
  delete nextState.autoFirstSeenAt;
}
async function resolveStartupInstallStatus() {
  const root = await resolveOpenClawPackageRoot({
    moduleUrl: import.meta.url,
    argv1: process.argv[1],
    cwd: process.cwd(),
  });
  return {
    root,
    status: await checkUpdateStatus({
      root,
      timeoutMs: 2500,
      fetchGit: false,
      includeRegistry: false,
    }),
  };
}
async function runGatewayUpdateCheck(params) {
  if (shouldSkipCheck(Boolean(params.allowInTests))) return;
  if (params.isNixMode) return;
  const configuredChannel = normalizeUpdateChannel(params.cfg.update?.channel) ?? "stable";
  const auto = resolveAutoUpdatePolicy(params.cfg);
  const autoDisabledByEnv = isTruthyEnvValue(process.env.OPENCLAW_NO_AUTO_UPDATE);
  const shouldRunAutoUpdate =
    (configuredChannel === "stable" || configuredChannel === "beta") &&
    auto.enabled &&
    !autoDisabledByEnv;
  const shouldRunUpdateHints = params.cfg.update?.checkOnStart !== false;
  if (!shouldRunUpdateHints && !shouldRunAutoUpdate) {
    if (configuredChannel === "extended-stable")
      setUpdateAvailableCache({
        next: null,
        onUpdateAvailableChange: params.onUpdateAvailableChange,
      });
    return;
  }
  let installStatus;
  if (configuredChannel === "extended-stable") {
    installStatus = await resolveStartupInstallStatus();
    if (installStatus.status.installKind !== "package") {
      setUpdateAvailableCache({
        next: null,
        onUpdateAvailableChange: params.onUpdateAvailableChange,
      });
      return;
    }
  }
  const state = await readState();
  const rawNow = Date.now();
  const now = resolveUpdateCheckNowMs(rawNow);
  const rawNowIsValid = asDateTimestampMs(rawNow) !== void 0;
  const lastCheckedAt = state.lastCheckedAt ? Date.parse(state.lastCheckedAt) : null;
  const persistedAvailable = shouldRunUpdateHints
    ? resolvePersistedUpdateAvailable(state, configuredChannel)
    : null;
  const hasExtendedStableCheckMarker = state.lastAvailableTag?.trim() === "extended-stable";
  const shouldBypassSharedThrottle =
    configuredChannel === "extended-stable" && !hasExtendedStableCheckMarker;
  if (shouldRunUpdateHints)
    setUpdateAvailableCache({
      next: persistedAvailable,
      onUpdateAvailableChange: params.onUpdateAvailableChange,
    });
  else
    setUpdateAvailableCache({
      next: null,
      onUpdateAvailableChange: params.onUpdateAvailableChange,
    });
  const checkIntervalMs = shouldRunAutoUpdate
    ? resolveCheckIntervalMs(params.cfg)
    : UPDATE_CHECK_INTERVAL_MS;
  if (
    !shouldBypassSharedThrottle &&
    rawNowIsValid &&
    lastCheckedAt &&
    Number.isFinite(lastCheckedAt)
  ) {
    if (now - lastCheckedAt < checkIntervalMs) return;
  }
  installStatus ??= await resolveStartupInstallStatus();
  const { root, status } = installStatus;
  const nextState = {
    ...state,
    lastCheckedAt: resolveUpdateCheckTimestamp(now),
  };
  if (status.installKind !== "package") {
    delete nextState.lastAvailableVersion;
    delete nextState.lastAvailableTag;
    clearAutoState(nextState);
    setUpdateAvailableCache({
      next: null,
      onUpdateAvailableChange: params.onUpdateAvailableChange,
    });
    await writeState(nextState);
    return;
  }
  const channel = configuredChannel;
  const resolved = await resolveNpmChannelTag({
    channel,
    timeoutMs: 2500,
  });
  const tag = resolved.tag;
  if (!resolved.version) {
    if (channel === "extended-stable") {
      clearPersistedAvailabilityForChannel(nextState, channel);
      if (!nextState.lastAvailableVersion) nextState.lastAvailableTag = channel;
      setUpdateAvailableCache({
        next: null,
        onUpdateAvailableChange: params.onUpdateAvailableChange,
      });
    }
    await writeState(nextState);
    return;
  }
  const cmp = compareSemverStrings(VERSION, resolved.version);
  if (cmp != null && cmp < 0) {
    const nextAvailable = {
      currentVersion: VERSION,
      latestVersion: resolved.version,
      channel: tag,
    };
    if (shouldRunUpdateHints)
      setUpdateAvailableCache({
        next: nextAvailable,
        onUpdateAvailableChange: params.onUpdateAvailableChange,
      });
    nextState.lastAvailableVersion = resolved.version;
    nextState.lastAvailableTag = tag;
    const shouldNotify =
      state.lastNotifiedVersion !== resolved.version || state.lastNotifiedTag !== tag;
    if (shouldRunUpdateHints && shouldNotify) {
      params.log.info(
        `update available (${tag}): v${resolved.version} (current v${VERSION}). Run: ${formatCliCommand("openclaw update")}`,
      );
      nextState.lastNotifiedVersion = resolved.version;
      nextState.lastNotifiedTag = tag;
    }
    if (channel !== "extended-stable" && auto.enabled && autoDisabledByEnv)
      params.log.info("auto-update disabled by OPENCLAW_NO_AUTO_UPDATE", {
        version: resolved.version,
        tag,
      });
    if (shouldRunAutoUpdate && (channel === "stable" || channel === "beta")) {
      const runAuto = params.runAutoUpdate ?? runAutoUpdateCommand;
      const attemptIntervalMs =
        channel === "beta"
          ? Math.max(ONE_HOUR_MS / 4, Math.floor(auto.betaCheckIntervalHours * ONE_HOUR_MS))
          : ONE_HOUR_MS;
      const lastAttemptAt = state.autoLastAttemptAt ? Date.parse(state.autoLastAttemptAt) : null;
      const recentAttemptForSameVersion =
        state.autoLastAttemptVersion === resolved.version &&
        lastAttemptAt != null &&
        Number.isFinite(lastAttemptAt) &&
        now - lastAttemptAt < attemptIntervalMs;
      let dueNow = channel === "beta";
      let applyAfterMs = null;
      if (channel === "stable") {
        applyAfterMs = resolveStableAutoApplyAtMs({
          state,
          nextState,
          nowMs: now,
          version: resolved.version,
          tag,
          stableDelayHours: auto.stableDelayHours,
          stableJitterHours: auto.stableJitterHours,
        });
        dueNow = now >= applyAfterMs;
      }
      if (!dueNow)
        params.log.info("auto-update deferred (stable rollout window active)", {
          version: resolved.version,
          tag,
          applyAfter: applyAfterMs ? resolveUpdateCheckTimestamp(applyAfterMs) : void 0,
        });
      else if (recentAttemptForSameVersion)
        params.log.info("auto-update deferred (recent attempt exists)", {
          version: resolved.version,
          tag,
        });
      else {
        nextState.autoLastAttemptVersion = resolved.version;
        nextState.autoLastAttemptAt = resolveUpdateCheckTimestamp(now);
        const outcome = await runAuto({
          channel,
          timeoutMs: AUTO_UPDATE_COMMAND_TIMEOUT_MS,
          restartDrainTimeoutMs: resolveGatewayRestartDeferralTimeoutMs(
            getRuntimeConfig().gateway?.reload?.deferralTimeoutMs,
          ),
          root: root ?? status.root ?? void 0,
        });
        if (outcome.ok && outcome.reason === "managed-service-handoff-started")
          params.log.info("auto-update handoff started", {
            channel,
            version: resolved.version,
            tag,
            ...(outcome.command ? { command: outcome.command } : {}),
            ...(outcome.logPath ? { logPath: outcome.logPath } : {}),
          });
        else if (outcome.ok) {
          nextState.autoLastSuccessVersion = resolved.version;
          nextState.autoLastSuccessAt = resolveUpdateCheckTimestamp(now);
          params.log.info("auto-update applied", {
            channel,
            version: resolved.version,
            tag,
          });
        } else
          params.log.info("auto-update attempt failed", {
            channel,
            version: resolved.version,
            tag,
            reason: outcome.reason ?? `exit:${outcome.code}`,
          });
      }
    }
  } else {
    if (channel === "extended-stable") {
      clearPersistedAvailabilityForChannel(nextState, channel);
      if (!nextState.lastAvailableVersion) nextState.lastAvailableTag = channel;
    } else {
      delete nextState.lastAvailableVersion;
      delete nextState.lastAvailableTag;
      clearAutoState(nextState);
    }
    setUpdateAvailableCache({
      next: null,
      onUpdateAvailableChange: params.onUpdateAvailableChange,
    });
  }
  await writeState(nextState);
}
function scheduleGatewayUpdateCheck(params) {
  if (
    (normalizeUpdateChannel(params.cfg.update?.channel) ?? "stable") === "extended-stable" &&
    params.cfg.update?.checkOnStart === false
  )
    return () => {};
  let stopped = false;
  let timer = null;
  let running = false;
  const tick = async () => {
    if (stopped || running) return;
    running = true;
    try {
      await runGatewayUpdateCheck(params);
    } catch {
    } finally {
      running = false;
    }
    if (stopped) return;
    const intervalMs = resolveCheckIntervalMs(params.cfg);
    timer = setTimeout(() => {
      tick();
    }, intervalMs);
  };
  tick();
  return () => {
    stopped = true;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };
}
//#endregion
export { runGatewayUpdateCheck as n, scheduleGatewayUpdateCheck as r, getUpdateAvailable as t };
