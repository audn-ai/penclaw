import { isDeepStrictEqual } from "node:util";
import chokidar from "chokidar";
import { r as disposeAllSessionMcpRuntimes } from "./agent-bundle-mcp-runtime-3IdGeACS.js";
import "./utils-DtcDeqWS.js";
import { o as getActiveBackgroundExecSessionCount } from "./bash-process-registry-DQZTRcsj.js";
import { l as getTotalQueueSize } from "./command-queue-CVn1dJsm.js";
import "./installed-plugin-index-records-BP7rp3ti.js";
import { n as isRestartEnabled } from "./commands.flags-CxQ7a14j.js";
import { n as diffGatewayReloadPaths, t as diffConfigPaths } from "./config-diff-BmMKLdJQ.js";
import { t as getConfigValueAtPath } from "./config-paths-DWVgrOEC.js";
import "./config-BDv-QbJ6.js";
import {
  n as listPluginInstallTimestampMetadataPaths,
  r as listPluginInstallWholeRecordPaths,
  t as buildGatewayReloadPlan,
} from "./config-reload-plan-Cg8Ga8f-.js";
import { t as resolveGatewayReloadSettings } from "./config-reload-settings-BUK2a-7x.js";
import { a as refreshContextWindowCache } from "./context-D1brGGkh.js";
import { t as getTotalPendingReplies } from "./dispatcher-registry-CaTZukRA.js";
import { n as isTruthyEnvValue } from "./env-Di-LcxqW.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import {
  f as runWithGatewayIndependentRootWorkAdmission,
  i as getActiveGatewayRootWorkCount,
} from "./gateway-work-admission-yGjmBAjy.js";
import {
  n as applyGatewayLaneConcurrency,
  r as resolveGatewayLaneConcurrency,
  t as resolveHookClientIpConfig,
} from "./hook-client-ip-config-qWekrn09.js";
import { v as resolveHooksConfig } from "./hooks-Cygj-WiD.js";
import {
  n as loadInstalledPluginIndexInstallRecordsSync,
  t as loadInstalledPluginIndexInstallRecords,
} from "./installed-plugin-index-record-reader-D7CXgzhH.js";
import { n as formatConfigIssueLines } from "./issue-format-IJKFr2SL.js";
import { n as loadModelCatalog, o as resetModelCatalogCache } from "./model-catalog-DxYvPELu.js";
import { i as warmCurrentProviderAuthStateOffMainThread } from "./model-provider-auth-DNlLhknV.js";
import { r as clearCurrentProviderAuthState } from "./model-provider-auth-state-DW_JYm-o.js";
import "./agent-bundle-mcp-tools-DnfukTzv.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { t as bumpSkillsSnapshotVersion } from "./refresh-state-DHnXO3IV.js";
import {
  f as resolveGatewayRestartDeferralTimeoutMs,
  h as setGatewaySigusr1RestartPolicy,
  o as deferGatewayRestartUntilIdle,
} from "./restart-DuVWNzPR.js";
import { d as getActiveEmbeddedRunCount } from "./run-state-BJlMim-d.js";
import {
  a as getRuntimeConfigSnapshotMetadata,
  s as getRuntimeConfigSourceSnapshot,
  v as resolveConfigWriteFollowUp,
} from "./runtime-snapshot-BbbqRiDR.js";
import {
  c as getActiveSecretsRuntimeSnapshotRevision,
  g as setSecretsRuntimeSourceSnapshotIfCurrent,
  r as clearSecretsRuntimeSnapshot,
  s as getActiveSecretsRuntimeSnapshot,
} from "./runtime-state-B7u15R2P.js";
import { t as buildGatewayCronService } from "./server-cron-BBBDjVCC.js";
import { r as markGatewayModelCatalogStaleForReload } from "./server-model-catalog-GcPTRbL-.js";
import { a as startGatewayCronWithLogging } from "./server-runtime-services-gMlur0Qu.js";
import { t as startGatewayChannelHealthMonitor } from "./server-runtime-startup-services-DHnkCX2a.js";
import {
  c as isSharedGatewaySessionGenerationOwnershipCurrent,
  d as setRequiredSharedGatewaySessionGenerationIfOwned,
  i as disconnectStaleSharedGatewayAuthClients,
  n as claimSharedGatewaySessionGenerationIfOwned,
  o as finalizeOwnedSharedGatewaySessionGeneration,
  t as captureSharedGatewaySessionGenerationOwnership,
  u as restoreOwnedCurrentSharedGatewaySessionGeneration,
} from "./server-shared-auth-generation-CWSg34uM.js";
import { r as resetDirectoryCache } from "./target-resolver-BQojPYwH.js";
import { n as getInspectableActiveTaskRestartBlockers } from "./task-registry.maintenance-_DeiCoga.js";
import { t as formatActiveTaskRestartBlocker } from "./task-restart-blocker-D04cCKR2.js";
import { l as isSecretRef } from "./types.secrets-BV0ywRAy.js";
//#region src/gateway/config-reload.ts
const MISSING_CONFIG_RETRY_DELAY_MS = 150;
const MISSING_CONFIG_MAX_RETRIES = 2;
const WATCHER_RECREATE_MAX_RETRIES = 3;
const WATCHER_RECREATE_BACKOFF_MS = [500, 2e3, 5e3];
function resolveChokidarUsePolling(degradedToPolling) {
  const envPoll = process.env.CHOKIDAR_USEPOLLING;
  if (envPoll !== void 0) {
    const envLower = envPoll.toLowerCase();
    if (envLower === "false" || envLower === "0") return false;
    if (envLower === "true" || envLower === "1") return true;
    return Boolean(envLower);
  }
  return Boolean(process.env.VITEST) || degradedToPolling;
}
/**
 * Paths under `skills.*` always change the snapshot that sessions cache in
 * sessions.json. Any prefix match here (for example `skills.allowBundled`,
 * `skills.entries.X.enabled`, `skills.profile`) forces sessions to rebuild
 * their snapshot on the next turn rather than silently advertising stale
 * tools to the model.
 */
const SKILLS_INVALIDATION_PREFIXES = ["skills"];
function matchesSkillsInvalidationPrefix(path) {
  return SKILLS_INVALIDATION_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}.`),
  );
}
function firstSkillsChangedPath(changedPaths) {
  return changedPaths.find(matchesSkillsInvalidationPrefix);
}
function isNoopReloadPlan(plan) {
  return (
    !plan.restartGateway &&
    plan.hotReasons.length === 0 &&
    !plan.reloadHooks &&
    !plan.restartGmailWatcher &&
    !plan.restartCron &&
    !plan.restartHeartbeat &&
    !plan.restartHealthMonitor &&
    !plan.reloadPlugins &&
    !plan.disposeMcpRuntimes &&
    plan.restartChannels.size === 0
  );
}
var GatewayConfigReloadSupersededError$1 = class extends Error {
  constructor() {
    super("config reload superseded by a newer config write");
    this.name = "GatewayConfigReloadSupersededError";
  }
};
function isGatewayConfigReloadSupersededError(error) {
  return error instanceof Error && error.name === "GatewayConfigReloadSupersededError";
}
function asPluginInstallConfig(records) {
  return { plugins: { installs: records } };
}
function startGatewayConfigReloader(opts) {
  const initialSourceConfig = opts.initialCompareConfig ?? opts.initialConfig;
  const initialCandidate = opts.prepareConfigCandidate?.({
    runtimeConfig: opts.initialConfig,
    sourceConfig: initialSourceConfig,
    previousSourceConfig: initialSourceConfig,
  });
  let currentConfig = initialCandidate?.runtimeConfig ?? opts.initialConfig;
  let currentCompareConfig = initialCandidate?.compareConfig ?? initialSourceConfig;
  let currentSourceConfig = initialSourceConfig;
  let currentRuntimeEnvSourceConfig = initialSourceConfig;
  let currentReapplyRuntimeOverlays =
    initialCandidate?.reapplyRuntimeOverlays ?? ((config) => config);
  let currentRuntimeRefresh;
  let settings = resolveGatewayReloadSettings(currentConfig);
  let debounceTimer = null;
  let pending = false;
  let running = false;
  let stopped = false;
  const activeReloads = /* @__PURE__ */ new Set();
  let missingConfigRetries = 0;
  let configWriteEpoch = 0;
  let pendingInProcessConfig = null;
  let activeInProcessConfig = null;
  let watcherIntentCandidate = null;
  let startupInternalWriteHash = opts.initialInternalWriteHash ?? null;
  let lastAppliedWriteHash = null;
  let lastSourceOnlyWriteHash = null;
  let lastSourceOnlyReapplyRuntimeOverlays = null;
  let lastSourceOnlyRuntimeRefresh;
  let lastSourceOnlyRuntimeConfig = null;
  let lastSourceOnlySourceConfig = null;
  let pendingRuntimeApplicationPlan = null;
  let currentPluginInstallRecords =
    opts.initialPluginInstallRecords ?? loadInstalledPluginIndexInstallRecordsSync();
  const readPluginInstallRecords =
    opts.readPluginInstallRecords ?? loadInstalledPluginIndexInstallRecords;
  const flushPendingRuntimeApplication = async () => {
    const pendingPlan = pendingRuntimeApplicationPlan;
    if (!pendingPlan) return;
    await opts.onConfigApplied?.(pendingPlan, currentConfig);
    if (pendingRuntimeApplicationPlan === pendingPlan) pendingRuntimeApplicationPlan = null;
  };
  const applyCurrentRuntimePlan = async (plan, nextRuntimeConfig) => {
    if (pendingRuntimeApplicationPlan === plan) {
      await flushPendingRuntimeApplication();
      return;
    }
    await opts.onConfigApplied?.(plan, nextRuntimeConfig);
  };
  const scheduleAfter = (wait) => {
    if (stopped) return;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      startTrackedReload();
    }, wait);
  };
  const schedule = () => {
    scheduleAfter(settings.debounceMs);
  };
  const prepareRestart = async (plan, nextConfig, ownership, sourceConfig) => {
    try {
      await opts.onRestart(plan, nextConfig, ownership, sourceConfig);
    } catch (err) {
      if (isGatewayConfigReloadSupersededError(err))
        opts.log.info(`config restart superseded: ${String(err)}`);
      else opts.log.error(`config restart failed: ${String(err)}`);
      throw err;
    }
  };
  const handleMissingSnapshot = (snapshot) => {
    if (snapshot.exists) {
      missingConfigRetries = 0;
      return false;
    }
    if (missingConfigRetries < MISSING_CONFIG_MAX_RETRIES) {
      missingConfigRetries += 1;
      opts.log.info(
        `config reload retry (${missingConfigRetries}/${MISSING_CONFIG_MAX_RETRIES}): config file not found`,
      );
      scheduleAfter(MISSING_CONFIG_RETRY_DELAY_MS);
      return true;
    }
    opts.log.warn("config reload skipped (config file not found)");
    return true;
  };
  const handleInvalidSnapshot = (snapshot) => {
    if (snapshot.valid) return false;
    const issues = formatConfigIssueLines(snapshot.issues, "").join(", ");
    opts.log.warn(`config reload skipped (invalid config): ${issues}`);
    return true;
  };
  const applySnapshot = async (
    candidateRuntimeConfig,
    nextSourceConfig,
    afterWrite,
    transactionEpoch = configWriteEpoch,
    persistedHash,
    preflightCandidate,
    runtimeRefresh,
  ) => {
    const preparedCandidate =
      opts.prepareConfigCandidate?.({
        runtimeConfig: candidateRuntimeConfig,
        sourceConfig: nextSourceConfig,
        previousSourceConfig: currentRuntimeEnvSourceConfig,
      }) ?? preflightCandidate;
    const nextConfig = preparedCandidate?.runtimeConfig ?? candidateRuntimeConfig;
    const nextCompareConfig = preparedCandidate?.compareConfig ?? nextSourceConfig;
    let nextPluginInstallRecords = currentPluginInstallRecords;
    let committedRuntimeConfig = null;
    let publishedRuntimeEnv;
    let runtimeEnvCommitted = false;
    const nextSettings = resolveGatewayReloadSettings(nextConfig);
    const isCurrent = () => configWriteEpoch === transactionEpoch;
    const assertCurrent = () => {
      if (!isCurrent()) throw new GatewayConfigReloadSupersededError$1();
    };
    const commitPublishedRuntimeEnv = () => {
      runtimeEnvCommitted = true;
      publishedRuntimeEnv?.commit();
      publishedRuntimeEnv = void 0;
    };
    const ownership = {
      isCurrent,
      reapplyRuntimeOverlays: preparedCandidate?.reapplyRuntimeOverlays ?? ((config) => config),
      ...(preparedCandidate?.runtimeEnv ? { runtimeEnv: preparedCandidate.runtimeEnv } : {}),
      ...(runtimeRefresh ? { runtimeRefresh } : {}),
      publishRuntimeEnv: () => {
        assertCurrent();
        if (runtimeEnvCommitted) return;
        publishedRuntimeEnv ??= preparedCandidate?.runtimeEnv?.publish();
        assertCurrent();
      },
      rollbackRuntimeEnv: () => {
        if (runtimeEnvCommitted) return;
        publishedRuntimeEnv?.();
        publishedRuntimeEnv = void 0;
      },
      commitRuntimeEnv: commitPublishedRuntimeEnv,
      markRuntimeCommitted: (runtimeConfig, plan) => {
        commitPublishedRuntimeEnv();
        committedRuntimeConfig = runtimeConfig;
        currentConfig = runtimeConfig;
        currentCompareConfig = nextCompareConfig;
        currentSourceConfig = nextSourceConfig;
        currentRuntimeEnvSourceConfig = nextSourceConfig;
        currentReapplyRuntimeOverlays = ownership.reapplyRuntimeOverlays;
        currentRuntimeRefresh = ownership.runtimeRefresh;
        currentPluginInstallRecords = nextPluginInstallRecords;
        settings = resolveGatewayReloadSettings(runtimeConfig);
        pendingRuntimeApplicationPlan = plan;
      },
    };
    const configChangedPaths = diffGatewayReloadPaths(currentCompareConfig, nextCompareConfig);
    const configPluginInstallTimestampNoopPaths = listPluginInstallTimestampMetadataPaths(
      currentCompareConfig,
      nextCompareConfig,
    );
    const configPluginInstallWholeRecordPaths = listPluginInstallWholeRecordPaths(
      currentCompareConfig,
      nextCompareConfig,
    );
    try {
      nextPluginInstallRecords = await readPluginInstallRecords();
    } catch (err) {
      opts.log.warn(`config reload plugin install record check failed: ${String(err)}`);
    }
    assertCurrent();
    const previousPluginInstallConfig = asPluginInstallConfig(currentPluginInstallRecords);
    const nextPluginInstallConfig = asPluginInstallConfig(nextPluginInstallRecords);
    const pluginInstallRecordChangedPaths = diffConfigPaths(
      previousPluginInstallConfig,
      nextPluginInstallConfig,
    );
    const pluginInstallRecordTimestampNoopPaths = listPluginInstallTimestampMetadataPaths(
      previousPluginInstallConfig,
      nextPluginInstallConfig,
    );
    const pluginInstallRecordWholeRecordPaths = listPluginInstallWholeRecordPaths(
      previousPluginInstallConfig,
      nextPluginInstallConfig,
    );
    const changedPaths = [...configChangedPaths, ...pluginInstallRecordChangedPaths];
    const pluginInstallTimestampNoopPaths = [
      ...configPluginInstallTimestampNoopPaths,
      ...pluginInstallRecordTimestampNoopPaths,
    ];
    const pluginInstallWholeRecordPaths = [
      ...configPluginInstallWholeRecordPaths,
      ...pluginInstallRecordWholeRecordPaths,
    ];
    await flushPendingRuntimeApplication();
    assertCurrent();
    const commitReloadBaseline = async (options = {}) => {
      assertCurrent();
      await flushPendingRuntimeApplication();
      assertCurrent();
      let rollbackAcceptedSource;
      try {
        const acceptedSourceRollback = await opts.onConfigAccepted?.(
          committedRuntimeConfig ?? nextConfig,
          ownership,
          nextSourceConfig,
          {
            runtimeApplied: options.runtimeApplied !== false,
            ...(options.publishSource ? { publishSource: options.publishSource } : {}),
          },
        );
        if (typeof acceptedSourceRollback === "function")
          rollbackAcceptedSource = acceptedSourceRollback;
        assertCurrent();
        rollbackAcceptedSource ??= await options.publishSource?.();
        assertCurrent();
        currentSourceConfig = nextSourceConfig;
        if (options.runtimeApplied === false) {
          lastSourceOnlyWriteHash = persistedHash ?? null;
          lastSourceOnlyReapplyRuntimeOverlays = ownership.reapplyRuntimeOverlays;
          lastSourceOnlyRuntimeRefresh = ownership.runtimeRefresh;
          lastSourceOnlyRuntimeConfig = nextConfig;
          lastSourceOnlySourceConfig = nextSourceConfig;
          return;
        }
        ownership.publishRuntimeEnv();
        currentRuntimeEnvSourceConfig = nextSourceConfig;
        if (persistedHash === lastSourceOnlyWriteHash) {
          lastSourceOnlyWriteHash = null;
          lastSourceOnlyReapplyRuntimeOverlays = null;
          lastSourceOnlyRuntimeRefresh = void 0;
          lastSourceOnlyRuntimeConfig = null;
          lastSourceOnlySourceConfig = null;
        }
        currentConfig = committedRuntimeConfig ?? nextConfig;
        currentCompareConfig = nextCompareConfig;
        currentReapplyRuntimeOverlays = ownership.reapplyRuntimeOverlays;
        currentRuntimeRefresh = ownership.runtimeRefresh;
        currentPluginInstallRecords = nextPluginInstallRecords;
        settings = committedRuntimeConfig
          ? resolveGatewayReloadSettings(committedRuntimeConfig)
          : nextSettings;
        commitPublishedRuntimeEnv();
      } catch (error) {
        ownership.rollbackRuntimeEnv();
        await rollbackAcceptedSource?.();
        throw error;
      }
    };
    if (changedPaths.length === 0) {
      let publishedSourceRollback;
      const publishSource = opts.onEffectiveConfigUnchanged
        ? async () =>
            (publishedSourceRollback ??= await opts.onEffectiveConfigUnchanged(
              nextConfig,
              ownership,
              nextSourceConfig,
            ))
        : void 0;
      await commitReloadBaseline(publishSource ? { publishSource } : {});
      return;
    }
    const skillsChangedPath = firstSkillsChangedPath(changedPaths);
    if (skillsChangedPath !== void 0) {
      bumpSkillsSnapshotVersion({
        reason: "config-change",
        changedPath: skillsChangedPath,
      });
      opts.log.info(`skills snapshot invalidated by config change (${skillsChangedPath})`);
    }
    const followUp = resolveConfigWriteFollowUp(afterWrite);
    opts.log.info(`config change detected; evaluating reload (${changedPaths.join(", ")})`);
    if (followUp.mode === "none") {
      opts.log.info(`config reload skipped by writer intent (${followUp.reason})`);
      await commitReloadBaseline({ runtimeApplied: false });
      return;
    }
    const plan = buildGatewayReloadPlan(changedPaths, {
      noopPaths: pluginInstallTimestampNoopPaths,
      forceChangedPaths: pluginInstallWholeRecordPaths,
    });
    if (nextSettings.mode === "off") {
      opts.log.info("config reload disabled (gateway.reload.mode=off)");
      await commitReloadBaseline({ runtimeApplied: false });
      return;
    }
    if (isNoopReloadPlan(plan) && !followUp.requiresRestart) {
      await opts.onConfigChange?.(plan, nextConfig);
      await opts.onNoopConfigCommit(plan, nextConfig, ownership, nextSourceConfig);
      assertCurrent();
      await applyCurrentRuntimePlan(plan, nextConfig);
      await commitReloadBaseline();
      return;
    }
    if (followUp.requiresRestart) {
      const restartPlan = {
        ...plan,
        restartGateway: true,
        restartReasons: [...plan.restartReasons, followUp.reason],
      };
      await opts.onConfigChange?.(restartPlan, nextConfig);
      await prepareRestart(restartPlan, nextConfig, ownership, nextSourceConfig);
      await commitReloadBaseline();
      return;
    }
    if (nextSettings.mode === "restart") {
      const restartPlan = {
        ...plan,
        restartGateway: true,
      };
      await opts.onConfigChange?.(restartPlan, nextConfig);
      await prepareRestart(restartPlan, nextConfig, ownership, nextSourceConfig);
      await commitReloadBaseline();
      return;
    }
    if (plan.restartGateway) {
      if (nextSettings.mode === "hot") {
        opts.log.warn(
          `config reload requires gateway restart; hot mode ignoring (${plan.restartReasons.join(", ")})`,
        );
        await commitReloadBaseline({ runtimeApplied: false });
        return;
      }
      await opts.onConfigChange?.(plan, nextConfig);
      await prepareRestart(plan, nextConfig, ownership, nextSourceConfig);
      await commitReloadBaseline();
      return;
    }
    await opts.onConfigChange?.(plan, nextConfig);
    try {
      await opts.onHotReload(plan, nextConfig, ownership, nextSourceConfig);
    } catch (error) {
      ownership.rollbackRuntimeEnv();
      throw error;
    }
    assertCurrent();
    await applyCurrentRuntimePlan(plan, nextConfig);
    await commitReloadBaseline();
  };
  const promoteAcceptedSnapshot = async (snapshot, reason) => {
    if (!opts.promoteSnapshot || !snapshot.exists || !snapshot.valid) return;
    try {
      await opts.promoteSnapshot(snapshot, reason);
    } catch (err) {
      opts.log.warn(`config reload last-known-good promotion failed: ${String(err)}`);
    }
  };
  const runAcceptedTransaction = async (run) => {
    if (opts.runTransaction) {
      await opts.runTransaction(run);
      return;
    }
    await run();
  };
  const acceptCurrentRuntimeEcho = async (transactionEpoch) => {
    const ownership = {
      isCurrent: () => configWriteEpoch === transactionEpoch,
      reapplyRuntimeOverlays: currentReapplyRuntimeOverlays,
      publishRuntimeEnv: () => {},
      rollbackRuntimeEnv: () => {},
      commitRuntimeEnv: () => {},
      ...(currentRuntimeRefresh ? { runtimeRefresh: currentRuntimeRefresh } : {}),
      markRuntimeCommitted: () => {},
    };
    await runAcceptedTransaction(async () => {
      await flushPendingRuntimeApplication();
      if (!ownership.isCurrent()) throw new GatewayConfigReloadSupersededError$1();
      await opts.onConfigAccepted?.(currentConfig, ownership, currentSourceConfig, {
        runtimeApplied: true,
      });
      if (!ownership.isCurrent()) throw new GatewayConfigReloadSupersededError$1();
    });
  };
  const promoteAcceptedInProcessWrite = async (persistedHash) => {
    if (!opts.promoteSnapshot) return;
    try {
      const snapshot = await opts.readSnapshot(currentRuntimeEnvSourceConfig);
      if (snapshot.hash !== persistedHash || !snapshot.valid) return;
      await promoteAcceptedSnapshot(snapshot, "in-process-write");
    } catch (err) {
      opts.log.warn(`config reload in-process last-known-good promotion failed: ${String(err)}`);
    }
  };
  const runReload = async () => {
    if (stopped) return;
    if (running) {
      pending = true;
      return;
    }
    running = true;
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    try {
      if (pendingInProcessConfig) {
        const pendingWrite = pendingInProcessConfig;
        pendingInProcessConfig = null;
        activeInProcessConfig = pendingWrite;
        missingConfigRetries = 0;
        try {
          await runAcceptedTransaction(async () => {
            await applySnapshot(
              pendingWrite.config,
              pendingWrite.compareConfig,
              pendingWrite.afterWrite,
              pendingWrite.epoch,
              pendingWrite.persistedHash,
              pendingWrite.preparedCandidate,
              pendingWrite.runtimeRefresh,
            );
            if (activeInProcessConfig === pendingWrite) activeInProcessConfig = null;
            await promoteAcceptedInProcessWrite(pendingWrite.persistedHash);
          });
        } catch (err) {
          if (lastAppliedWriteHash === pendingWrite.persistedHash) lastAppliedWriteHash = null;
          if (
            configWriteEpoch === pendingWrite.epoch &&
            !pendingInProcessConfig &&
            !watcherIntentCandidate
          )
            watcherIntentCandidate = pendingWrite;
          throw err;
        } finally {
          if (activeInProcessConfig === pendingWrite) activeInProcessConfig = null;
        }
        return;
      }
      const transactionEpoch = configWriteEpoch;
      const intentCandidate = watcherIntentCandidate;
      const snapshot = await opts.readSnapshot(currentRuntimeEnvSourceConfig);
      if (configWriteEpoch !== transactionEpoch) throw new GatewayConfigReloadSupersededError$1();
      if (handleMissingSnapshot(snapshot)) {
        await flushPendingRuntimeApplication();
        return;
      }
      if (startupInternalWriteHash && typeof snapshot.hash === "string") {
        const matchesStartupWrite =
          snapshot.valid &&
          snapshot.hash === startupInternalWriteHash &&
          diffConfigPaths(currentSourceConfig, snapshot.sourceConfig).length === 0;
        startupInternalWriteHash = null;
        if (matchesStartupWrite) {
          await acceptCurrentRuntimeEcho(transactionEpoch);
          return;
        }
      }
      if (
        intentCandidate &&
        snapshot.valid &&
        snapshot.hash === intentCandidate.persistedHash &&
        diffConfigPaths(intentCandidate.compareConfig, snapshot.sourceConfig).length === 0
      ) {
        lastAppliedWriteHash = intentCandidate.persistedHash;
        try {
          await runAcceptedTransaction(async () => {
            await applySnapshot(
              intentCandidate.config,
              intentCandidate.compareConfig,
              intentCandidate.afterWrite,
              transactionEpoch,
              intentCandidate.persistedHash,
              intentCandidate.preparedCandidate,
              intentCandidate.runtimeRefresh,
            );
            if (watcherIntentCandidate === intentCandidate) watcherIntentCandidate = null;
            await promoteAcceptedSnapshot(snapshot, "in-process-write");
          });
        } catch (err) {
          if (lastAppliedWriteHash === intentCandidate.persistedHash) lastAppliedWriteHash = null;
          if (configWriteEpoch === transactionEpoch && !watcherIntentCandidate)
            watcherIntentCandidate = intentCandidate;
          throw err;
        }
        return;
      }
      if (watcherIntentCandidate === intentCandidate) watcherIntentCandidate = null;
      if (intentCandidate && lastAppliedWriteHash === intentCandidate.persistedHash)
        lastAppliedWriteHash = null;
      if (lastAppliedWriteHash && typeof snapshot.hash === "string") {
        if (
          snapshot.valid &&
          snapshot.hash === lastAppliedWriteHash &&
          diffConfigPaths(currentSourceConfig, snapshot.sourceConfig).length === 0
        ) {
          if (snapshot.hash === lastSourceOnlyWriteHash) {
            const ownership = {
              isCurrent: () => configWriteEpoch === transactionEpoch,
              reapplyRuntimeOverlays:
                lastSourceOnlyReapplyRuntimeOverlays ?? currentReapplyRuntimeOverlays,
              publishRuntimeEnv: () => {},
              rollbackRuntimeEnv: () => {},
              commitRuntimeEnv: () => {},
              ...(lastSourceOnlyRuntimeRefresh
                ? { runtimeRefresh: lastSourceOnlyRuntimeRefresh }
                : {}),
              markRuntimeCommitted: () => {},
            };
            await runAcceptedTransaction(async () => {
              await flushPendingRuntimeApplication();
              if (!ownership.isCurrent()) throw new GatewayConfigReloadSupersededError$1();
              await opts.onConfigAccepted?.(
                lastSourceOnlyRuntimeConfig ?? currentConfig,
                ownership,
                lastSourceOnlySourceConfig ?? currentSourceConfig,
                { runtimeApplied: false },
              );
              if (!ownership.isCurrent()) throw new GatewayConfigReloadSupersededError$1();
            });
            return;
          }
          await acceptCurrentRuntimeEcho(transactionEpoch);
          return;
        }
        lastAppliedWriteHash = null;
      }
      if (!snapshot.valid) {
        handleInvalidSnapshot(snapshot);
        await flushPendingRuntimeApplication();
        return;
      }
      await runAcceptedTransaction(async () => {
        await applySnapshot(
          snapshot.config,
          snapshot.sourceConfig,
          void 0,
          transactionEpoch,
          snapshot.hash,
        );
        await promoteAcceptedSnapshot(snapshot, "valid-config");
      });
    } catch (err) {
      if (isGatewayConfigReloadSupersededError(err))
        opts.log.info(`config reload superseded: ${String(err)}`);
      else opts.log.error(`config reload failed: ${String(err)}`);
    } finally {
      running = false;
      if (pending) {
        pending = false;
        schedule();
      }
    }
  };
  function startTrackedReload() {
    const reload = runReload();
    activeReloads.add(reload);
    reload.then(
      () => activeReloads.delete(reload),
      () => activeReloads.delete(reload),
    );
  }
  const scheduleFromWatcher = () => {
    opts.onConfigCandidateObserved?.();
    configWriteEpoch += 1;
    const pendingCandidate = pendingInProcessConfig;
    const activeCandidate = activeInProcessConfig;
    const newestLiveCandidate =
      pendingCandidate && (!activeCandidate || pendingCandidate.epoch > activeCandidate.epoch)
        ? pendingCandidate
        : activeCandidate;
    if (
      newestLiveCandidate &&
      (!watcherIntentCandidate || newestLiveCandidate.epoch > watcherIntentCandidate.epoch)
    )
      watcherIntentCandidate = newestLiveCandidate;
    if (pendingInProcessConfig) pendingInProcessConfig = null;
    schedule();
  };
  const unsubscribeFromWrites =
    opts.subscribeToWrites?.((event) => {
      if (event.configPath !== opts.watchPath) return;
      startupInternalWriteHash = null;
      opts.onConfigCandidateObserved?.();
      configWriteEpoch += 1;
      watcherIntentCandidate = null;
      pendingInProcessConfig = {
        config: event.runtimeConfig,
        compareConfig: event.sourceConfig,
        persistedHash: event.persistedHash,
        afterWrite: event.afterWrite,
        ...(event.preparedCandidate ? { preparedCandidate: event.preparedCandidate } : {}),
        ...(event.runtimeRefresh ? { runtimeRefresh: event.runtimeRefresh } : {}),
        epoch: configWriteEpoch,
      };
      lastAppliedWriteHash = event.persistedHash;
      scheduleAfter(0);
    }) ?? (() => {});
  let watcher = null;
  let watcherRecreateRetries = 0;
  let watcherRecreateTimer = null;
  let hotReloadStatus = "active";
  let degradedToPolling = false;
  let watcherUsesPolling = false;
  const createWatcher = () => {
    if (stopped) return;
    const usePolling = resolveChokidarUsePolling(degradedToPolling);
    const next = chokidar.watch(opts.watchPath, {
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 200,
        pollInterval: 50,
      },
      usePolling,
    });
    next.on("add", scheduleFromWatcher);
    next.on("change", scheduleFromWatcher);
    next.on("unlink", scheduleFromWatcher);
    next.on("error", (err) => {
      handleWatcherError(next, err);
    });
    watcher = next;
    watcherUsesPolling = next.options.usePolling;
    hotReloadStatus = "active";
  };
  const handleWatcherError = (source, err) => {
    if (stopped || source !== watcher) return;
    const failedWatcherUsedPolling = watcherUsesPolling;
    watcher = null;
    watcherUsesPolling = false;
    source?.close().catch(() => {});
    if (watcherRecreateRetries >= WATCHER_RECREATE_MAX_RETRIES) {
      if (!failedWatcherUsedPolling && resolveChokidarUsePolling(true)) {
        degradedToPolling = true;
        watcherRecreateRetries = 0;
        opts.log.warn(
          `config watcher native retries exhausted; degrading to polling mode: ${String(err)}`,
        );
        watcherRecreateTimer = setTimeout(() => {
          watcherRecreateTimer = null;
          createWatcher();
        }, WATCHER_RECREATE_BACKOFF_MS[0] ?? 500);
        return;
      }
      const mode = failedWatcherUsedPolling ? "polling mode" : "native mode";
      hotReloadStatus = "disabled";
      opts.log.error(
        `config hot-reload disabled: watcher failed after ${WATCHER_RECREATE_MAX_RETRIES} re-create attempts in ${mode}: ${String(err)}`,
      );
      return;
    }
    const backoff =
      WATCHER_RECREATE_BACKOFF_MS[watcherRecreateRetries] ??
      WATCHER_RECREATE_BACKOFF_MS[WATCHER_RECREATE_BACKOFF_MS.length - 1] ??
      0;
    watcherRecreateRetries += 1;
    opts.log.warn(
      `config watcher error; re-creating watcher (attempt ${watcherRecreateRetries}/${WATCHER_RECREATE_MAX_RETRIES} in ${backoff}ms): ${String(err)}`,
    );
    watcherRecreateTimer = setTimeout(() => {
      watcherRecreateTimer = null;
      createWatcher();
    }, backoff);
  };
  createWatcher();
  return {
    stop: async () => {
      stopped = true;
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = null;
      if (watcherRecreateTimer) {
        clearTimeout(watcherRecreateTimer);
        watcherRecreateTimer = null;
      }
      unsubscribeFromWrites();
      const active = watcher;
      watcher = null;
      await active?.close().catch(() => {});
      await Promise.all(activeReloads);
    },
    hotReloadStatus: () => hotReloadStatus,
  };
}
//#endregion
//#region src/gateway/server-reload-handlers.ts
let currentReloadGeneration = 0;
let abortGeneration = void 0;
const RESTART_EMISSION_RETRY_MS = 1e3;
/** Signal any in-progress deferred channel reload to abort immediately. */
function abortPendingChannelReloads() {
  abortGeneration = currentReloadGeneration;
}
async function activateSecretsRuntimeSnapshotIfCurrent(snapshot, expectedRevision, options) {
  const runtime = await import("./runtime-CfdQwfXI.js");
  if (options?.canActivate && !options.canActivate()) return false;
  if (!runtime.activateSecretsRuntimeSnapshotIfCurrent(snapshot, expectedRevision)) return false;
  options?.onActivated?.();
  return true;
}
async function restoreSecretsRuntimeSnapshotIfCurrent(
  snapshot,
  expectedRevision,
  ownedSnapshot,
  options,
) {
  if (
    !(await import("./runtime-CfdQwfXI.js")).restoreSecretsRuntimeSnapshotIfCurrent(
      snapshot,
      expectedRevision,
      ownedSnapshot,
    )
  )
    return false;
  options?.onActivated?.();
  return true;
}
var GatewayHotReloadCancelledError = class extends Error {
  constructor() {
    super("config hot reload cancelled by config supersession or in-process restart");
    this.name = "GatewayHotReloadCancelledError";
  }
};
var GatewayHotReloadRecoveryError = class extends Error {
  constructor(surface) {
    super(`config hot reload committed but could not schedule recovery for ${surface}`);
    this.name = "GatewayHotReloadRecoveryError";
  }
};
var GatewayReloadRequiresRecoveryOwnerError = class extends Error {
  constructor(surface) {
    super(`config reload requires a managed gateway restart owner for ${surface}`);
    this.name = "GatewayReloadRequiresRecoveryOwnerError";
  }
};
var GatewayHotReloadStaleSecretsError = class extends Error {
  constructor() {
    super("runtime secrets changed while config hot reload was deferred");
    this.name = "GatewayHotReloadStaleSecretsError";
  }
};
var GatewayConfigReloadSupersededError = class extends Error {
  constructor() {
    super("config reload superseded by a newer runtime config source");
    this.name = "GatewayConfigReloadSupersededError";
  }
};
const MCP_RUNTIME_RELOAD_DISPOSE_TIMEOUT_MS = 5e3;
const CHANNEL_RELOAD_DEFERRAL_POLL_MS = 500;
const CHANNEL_RELOAD_STILL_PENDING_WARN_MS = 3e4;
function projectCanonicalSecretRefsOntoRuntime(sourceValue, runtimeValue) {
  if (isSecretRef(sourceValue)) return sourceValue;
  if (Array.isArray(sourceValue)) {
    const runtimeArray = Array.isArray(runtimeValue) ? runtimeValue : [];
    return sourceValue.map((entry, index) =>
      projectCanonicalSecretRefsOntoRuntime(entry, runtimeArray[index]),
    );
  }
  if (isRecord(sourceValue)) {
    const runtimeRecord = isRecord(runtimeValue) ? runtimeValue : {};
    const projected = { ...runtimeRecord };
    for (const [key, entry] of Object.entries(sourceValue))
      projected[key] = projectCanonicalSecretRefsOntoRuntime(entry, runtimeRecord[key]);
    return projected;
  }
  return runtimeValue === void 0 ? sourceValue : runtimeValue;
}
function restoreCanonicalSecretRefs(runtimeConfig, sourceConfig) {
  return projectCanonicalSecretRefsOntoRuntime(sourceConfig, runtimeConfig);
}
function resetPreparedModelRuntimeStateForHotReload() {
  resetModelCatalogCache();
  clearCurrentProviderAuthState();
  markGatewayModelCatalogStaleForReload();
}
function shouldRefreshContextWindowCache(plan) {
  return (
    plan.reloadPlugins ||
    plan.changedPaths.some(
      (path) =>
        path === "models" ||
        path.startsWith("models.") ||
        path === "agents" ||
        path === "agents.defaults" ||
        path === "agents.list" ||
        path.startsWith("agents.list.") ||
        path === "agents.defaults.workspace" ||
        path.startsWith("agents.defaults.workspace."),
    )
  );
}
function hasIrreversibleHotReloadWork(plan) {
  return (
    plan.restartCron ||
    plan.restartHealthMonitor ||
    plan.restartGmailWatcher ||
    plan.reloadPlugins ||
    plan.restartChannels.size > 0
  );
}
function assertIrreversibleReloadPlanHasRecoveryOwner(plan, restartRecoveryAvailable) {
  if (restartRecoveryAvailable !== false) return;
  if (plan.restartGateway) throw new GatewayReloadRequiresRecoveryOwnerError("gateway restart");
  if (hasIrreversibleHotReloadWork(plan) || shouldRefreshContextWindowCache(plan))
    throw new GatewayReloadRequiresRecoveryOwnerError("irreversible hot reload");
}
async function disposeMcpRuntimesWithTimeout(params) {
  let timer;
  const disposePromise = Promise.resolve()
    .then(params.dispose)
    .catch((error) => {
      params.onWarn(`${params.label} failed: ${String(error)}`);
    });
  const timeoutPromise = new Promise((resolve) => {
    timer = setTimeout(() => resolve("timeout"), params.timeoutMs);
    timer.unref?.();
  });
  const result = await Promise.race([disposePromise.then(() => "done"), timeoutPromise]);
  if (timer) clearTimeout(timer);
  if (result === "timeout")
    params.onWarn(`${params.label} exceeded ${params.timeoutMs}ms; continuing`);
}
async function collectChannelOperationFailures(params) {
  const failures = [];
  for (const channel of params.channels)
    try {
      await params.run(channel);
    } catch (err) {
      failures.push(channel);
      params.onFailure(channel, err);
    }
  return failures;
}
function createGatewayReloadHandlers(params) {
  const myGeneration = ++currentReloadGeneration;
  const restartRecoveryAvailable =
    params.restartRecoveryAvailable !== false && params.requestRecoveryRestart !== void 0;
  const getActiveCounts = () => {
    const queueSize = getTotalQueueSize();
    const pendingReplies = getTotalPendingReplies();
    const embeddedRuns = getActiveEmbeddedRunCount();
    const backgroundExecSessions = getActiveBackgroundExecSessionCount();
    const rootRequests = getActiveGatewayRootWorkCount({ excludeCurrent: true });
    const activeTasks = getInspectableActiveTaskRestartBlockers().length;
    return {
      queueSize,
      pendingReplies,
      embeddedRuns,
      backgroundExecSessions,
      rootRequests,
      activeTasks,
      totalActive:
        queueSize +
        pendingReplies +
        embeddedRuns +
        backgroundExecSessions +
        rootRequests +
        activeTasks,
    };
  };
  const formatActiveDetails = (counts) => {
    const details = [];
    if (counts.queueSize > 0) details.push(`${counts.queueSize} operation(s)`);
    if (counts.pendingReplies > 0) details.push(`${counts.pendingReplies} reply(ies)`);
    if (counts.embeddedRuns > 0) details.push(`${counts.embeddedRuns} embedded run(s)`);
    if (counts.backgroundExecSessions > 0)
      details.push(`${counts.backgroundExecSessions} background exec session(s)`);
    if (counts.rootRequests > 0) details.push(`${counts.rootRequests} gateway request(s)`);
    if (counts.activeTasks > 0) details.push(`${counts.activeTasks} background task run(s)`);
    return details;
  };
  const formatTaskBlockers = () => {
    const blockers = getInspectableActiveTaskRestartBlockers();
    if (blockers.length === 0) return null;
    const shown = blockers.slice(0, 8).map(formatActiveTaskRestartBlocker);
    const omitted = blockers.length - shown.length;
    return omitted > 0 ? `${shown.join("; ")}; +${omitted} more` : shown.join("; ");
  };
  const waitForActiveWorkBeforeChannelReload = async (
    channels,
    nextConfig,
    isTransactionCurrent,
  ) => {
    if (!isTransactionCurrent()) return true;
    const initial = getActiveCounts();
    if (initial.totalActive <= 0) return false;
    const channelNames = [...channels].join(", ");
    const initialDetails = formatActiveDetails(initial);
    params.logReload.warn(
      `config change requires channel reload (${channelNames}) — deferring until ${initialDetails.join(", ")} complete`,
    );
    const timeoutMs = resolveGatewayRestartDeferralTimeoutMs(
      nextConfig.gateway?.reload?.deferralTimeoutMs,
    );
    const startedAt = Date.now();
    let nextStillPendingAt = startedAt + CHANNEL_RELOAD_STILL_PENDING_WARN_MS;
    while (true) {
      if (
        !isTransactionCurrent() ||
        (abortGeneration !== void 0 && myGeneration <= abortGeneration)
      )
        return true;
      await new Promise((resolve) => {
        setTimeout(resolve, CHANNEL_RELOAD_DEFERRAL_POLL_MS).unref?.();
      });
      if (
        !isTransactionCurrent() ||
        (abortGeneration !== void 0 && myGeneration <= abortGeneration)
      )
        return true;
      const current = getActiveCounts();
      if (current.totalActive <= 0) return false;
      const elapsedMs = Date.now() - startedAt;
      if (timeoutMs !== void 0 && elapsedMs >= timeoutMs) {
        const remaining = formatActiveDetails(current);
        params.logReload.warn(
          `channel reload timeout after ${elapsedMs}ms with ${remaining.join(", ")} still active; reloading channels anyway`,
        );
        return false;
      }
      if (Date.now() >= nextStillPendingAt) {
        const remaining = formatActiveDetails(current);
        params.logReload.warn(
          `channel reload still deferred after ${elapsedMs}ms with ${remaining.join(", ")} active`,
        );
        nextStillPendingAt = Date.now() + CHANNEL_RELOAD_STILL_PENDING_WARN_MS;
      }
    }
  };
  const applyHotReload = async (plan, nextConfig, publication) => {
    assertIrreversibleReloadPlanHasRecoveryOwner(plan, restartRecoveryAvailable);
    const isTransactionCurrent = () => !restartRetryStopped && (publication?.isCurrent?.() ?? true);
    const state = params.getState();
    const nextState = { ...state };
    resetPreparedModelRuntimeStateForHotReload();
    if (plan.reloadHooks)
      try {
        nextState.hooksConfig = resolveHooksConfig(nextConfig);
      } catch (err) {
        params.logHooks.warn(`hooks config reload failed: ${String(err)}`);
        throw err;
      }
    nextState.hookClientIpConfig = resolveHookClientIpConfig(nextConfig);
    if (plan.restartCron)
      nextState.cronState = buildGatewayCronService({
        cfg: nextConfig,
        deps: params.deps,
        broadcast: params.broadcast,
        env: publication?.runtimeEnv ?? process.env,
      });
    resetDirectoryCache();
    const channelsToRestart = new Set(plan.restartChannels);
    const channelsStoppedBeforePluginReload = /* @__PURE__ */ new Set();
    let activePluginChannelsAfterReload = null;
    let pluginReloadAborted = false;
    const isLifecycleReloadAborted = () =>
      abortGeneration !== void 0 && myGeneration <= abortGeneration;
    const isPluginReloadAborted = () =>
      pluginReloadAborted || !isTransactionCurrent() || isLifecycleReloadAborted();
    let runtimeCommitted = false;
    let recoveryRestartScheduled = false;
    const laneConcurrency = resolveGatewayLaneConcurrency(nextConfig);
    const candidateEnv = publication?.runtimeEnv ?? process.env;
    const shouldSkipChannelRestart =
      isTruthyEnvValue(candidateEnv.OPENCLAW_SKIP_CHANNELS) ||
      isTruthyEnvValue(candidateEnv.OPENCLAW_SKIP_PROVIDERS);
    const getChannelAutostartSuppression = () => params.getChannelAutostartSuppression?.() ?? null;
    const logSuppressedChannelRestart = (channels, action) => {
      if (!getChannelAutostartSuppression()) return;
      params.logChannels.info(
        `${action} suppressed by crash-loop breaker for channels: ${[...channels].join(", ")}`,
      );
    };
    const commitRuntime = async () => {
      if (runtimeCommitted) return;
      const commit = async () => {
        if (plan.restartHeartbeat) nextState.heartbeatRunner.updateConfig(nextConfig);
        params.setState(nextState);
        applyGatewayLaneConcurrency(laneConcurrency);
        runtimeCommitted = true;
        setGatewaySigusr1RestartPolicy({ allowExternal: isRestartEnabled(nextConfig) });
        if (plan.restartCron) {
          params.cronReconciliation.invalidate();
          params.onCronRestart?.();
          state.cronState.cron.stop();
          state.cronState.stopExitWatchers?.();
          startGatewayCronWithLogging({
            cronState: nextState.cronState,
            cronReconciliation: params.cronReconciliation,
            reason: "reload",
            config: nextConfig,
            afterStart: nextState.cronState.reconcileExitWatchers,
            logCron: params.logCron,
            onStartError: (err) => {
              if (
                myGeneration !== currentReloadGeneration ||
                params.getState().cronState !== nextState.cronState
              )
                return;
              try {
                scheduleRecoveryRestart("cron reload", err);
              } catch (recoveryError) {
                params.logCron.error(formatErrorMessage(recoveryError));
              }
            },
          });
        }
      };
      if (publication) await publication.publish(commit, () => runtimeCommitted);
      else await commit();
    };
    const settleRecoveryRestart = (restartTransaction, surface) => {
      if (restartTransaction.status === "recovery-pending" && !restartRecoveryAvailable) {
        restartTransaction.settle("rejected");
        throw new GatewayHotReloadRecoveryError(surface);
      }
      restartTransaction.settle("committed");
      recoveryRestartScheduled = true;
    };
    const scheduleRecoveryRestart = (surface, err) => {
      const detail = err === void 0 ? "" : `: ${formatErrorMessage(err)}`;
      if (restartRetryStopped) {
        params.logReload.warn(`${surface} failed during gateway shutdown${detail}`);
        return;
      }
      if (!restartRecoveryAvailable || !params.requestRecoveryRestart) {
        const message = runtimeCommitted
          ? `config hot reload committed with unrecovered ${surface} failure${detail}; gateway restart recovery is unavailable; runtime may be inconsistent`
          : `config hot reload failed before commit during ${surface}${detail}; gateway restart recovery is unavailable`;
        if (params.logReload.error) params.logReload.error(message);
        else params.logReload.warn(message);
        if (runtimeCommitted) throw new GatewayHotReloadRecoveryError(surface);
        if (err instanceof Error) throw err;
        throw new Error(`config hot reload failed before commit during ${surface}${detail}`);
      }
      const recoveryPlan = {
        ...plan,
        restartGateway: true,
        restartReasons: [`hot reload recovery: ${surface}`],
      };
      if (!isTransactionCurrent()) {
        params.logReload.warn(
          `${surface} failed after config supersession${detail}; recovery deferred to the newer config`,
        );
        if (!configCandidatePending && !restartRequestTransaction && latestAcceptedRestartTarget) {
          const target = latestAcceptedRestartTarget;
          const restartTransaction = requestGatewayRestart(recoveryPlan, target.runtimeConfig, {
            retainDebtAcrossConfigChanges: true,
            debtConfig: target.sourceConfig,
            prepareRuntimeConfig: target.prepareRuntimeConfig,
          });
          settleRecoveryRestart(restartTransaction, surface);
          return;
        }
        deferGatewayRestartDebt(recoveryPlan, nextConfig, {
          retainDebtAcrossConfigChanges: true,
          debtConfig: publication?.sourceConfig ?? nextConfig,
        });
        return;
      }
      params.logReload.warn(`${surface} failed after config commit${detail}; restarting gateway`);
      if (recoveryRestartScheduled) return;
      try {
        const restartTransaction = requestGatewayRestart(recoveryPlan, nextConfig, {
          retainDebtAcrossConfigChanges: true,
          debtConfig: publication?.sourceConfig ?? nextConfig,
          ...(publication?.prepareRestartRuntimeConfig
            ? { prepareRuntimeConfig: publication.prepareRestartRuntimeConfig }
            : {}),
        });
        settleRecoveryRestart(restartTransaction, surface);
      } catch (restartError) {
        params.logReload.warn(
          `failed to schedule post-commit gateway restart: ${formatErrorMessage(restartError)}`,
        );
        if (restartError instanceof GatewayHotReloadRecoveryError) throw restartError;
        throw new GatewayHotReloadRecoveryError(surface);
      }
    };
    if (plan.reloadPlugins) {
      const restartStoppedPluginChannels = async (reason) =>
        await collectChannelOperationFailures({
          channels: [...channelsStoppedBeforePluginReload],
          run: async (channel) => {
            params.logChannels.info(`restarting ${channel} channel after ${reason}`);
            await params.startChannel(channel);
            channelsStoppedBeforePluginReload.delete(channel);
          },
          onFailure: (channel, err) => {
            params.logChannels.error(
              `failed to restart ${channel} channel after ${reason}: ${formatErrorMessage(err)}`,
            );
          },
        });
      const failPluginChannelRollback = (reason, failures) => {
        const error = /* @__PURE__ */ new Error(
          `plugin reload cancellation rollback failed for: ${failures.join(", ")}`,
        );
        scheduleRecoveryRestart(`plugin channel rollback after ${reason}`, error);
        throw error;
      };
      const stopChannelsBeforePluginReplace = async (channels) => {
        for (const channel of channels) channelsToRestart.add(channel);
        if (channelsToRestart.size === 0 || shouldSkipChannelRestart) return;
        if (
          await waitForActiveWorkBeforeChannelReload(
            channelsToRestart,
            nextConfig,
            isTransactionCurrent,
          )
        ) {
          params.logChannels.info(
            "channel reload before plugin replace cancelled by config supersession or restart",
          );
          pluginReloadAborted = true;
          return;
        }
        const stopFailures = await collectChannelOperationFailures({
          channels: channelsToRestart,
          run: async (channel) => {
            if (isPluginReloadAborted()) {
              pluginReloadAborted = true;
              return;
            }
            if (channelsStoppedBeforePluginReload.has(channel)) return;
            params.logChannels.info(`stopping ${channel} channel before plugin reload`);
            channelsStoppedBeforePluginReload.add(channel);
            await params.stopChannel(channel, void 0, { manual: false });
            if (isPluginReloadAborted()) pluginReloadAborted = true;
          },
          onFailure: (channel, err) => {
            params.logChannels.error(
              `failed to stop ${channel} channel before plugin reload: ${formatErrorMessage(err)}`,
            );
          },
        });
        if (isPluginReloadAborted()) pluginReloadAborted = true;
        if (pluginReloadAborted) {
          if (isLifecycleReloadAborted()) return;
          const rollbackFailures = await restartStoppedPluginChannels(
            "cancelled plugin reload pre-stop",
          );
          if (rollbackFailures.length > 0)
            failPluginChannelRollback("cancelled plugin reload pre-stop", rollbackFailures);
          return;
        }
        if (stopFailures.length > 0) {
          const rollbackFailures = await restartStoppedPluginChannels(
            "failed plugin reload pre-stop",
          );
          if (rollbackFailures.length > 0)
            failPluginChannelRollback("failed plugin reload pre-stop", rollbackFailures);
          throw new Error(
            `failed to stop channels before plugin reload: ${stopFailures.join(", ")}`,
          );
        }
      };
      if (!pluginReloadAborted) {
        let pluginReloadResult;
        try {
          pluginReloadResult = await params.reloadPlugins({
            nextConfig,
            changedPaths: plan.changedPaths,
            beforeReplace: stopChannelsBeforePluginReplace,
            commitRuntime,
            env: publication?.runtimeEnv ?? process.env,
            isAborted: isPluginReloadAborted,
          });
        } catch (err) {
          if (!runtimeCommitted) {
            const rollbackFailures = await restartStoppedPluginChannels(
              "failed plugin runtime publication",
            );
            if (rollbackFailures.length > 0)
              failPluginChannelRollback("failed plugin runtime publication", rollbackFailures);
            throw err;
          }
          scheduleRecoveryRestart("plugin runtime reload", err);
          return;
        }
        if (pluginReloadResult.cancelled) {
          pluginReloadAborted = true;
          if (!isLifecycleReloadAborted()) {
            const rollbackFailures = await restartStoppedPluginChannels(
              "cancelled plugin runtime publication",
            );
            if (rollbackFailures.length > 0)
              failPluginChannelRollback("cancelled plugin runtime publication", rollbackFailures);
          }
        }
        if (!pluginReloadAborted) {
          for (const channel of pluginReloadResult.restartChannels) channelsToRestart.add(channel);
          activePluginChannelsAfterReload = pluginReloadResult.activeChannels;
          resetPreparedModelRuntimeStateForHotReload();
        }
      }
    }
    if (!plan.reloadPlugins && channelsToRestart.size > 0 && !shouldSkipChannelRestart)
      pluginReloadAborted = await waitForActiveWorkBeforeChannelReload(
        channelsToRestart,
        nextConfig,
        isTransactionCurrent,
      );
    if (pluginReloadAborted) {
      params.logChannels.info("channel restart cancelled by config supersession or restart");
      throw new GatewayHotReloadCancelledError();
    }
    try {
      await commitRuntime();
    } catch (err) {
      if (!runtimeCommitted) throw err;
      scheduleRecoveryRestart("runtime commit", err);
      return;
    }
    if (plan.restartHealthMonitor)
      try {
        state.channelHealthMonitor?.stop();
        await state.channelHealthMonitor?.waitForIdle();
        nextState.channelHealthMonitor = params.createHealthMonitor(nextConfig);
        params.setState(nextState);
      } catch (err) {
        scheduleRecoveryRestart("health monitor reload", err);
      }
    if (plan.disposeMcpRuntimes)
      await disposeMcpRuntimesWithTimeout({
        dispose: disposeAllSessionMcpRuntimes,
        timeoutMs: MCP_RUNTIME_RELOAD_DISPOSE_TIMEOUT_MS,
        onWarn: params.logReload.warn,
        label: "bundle-mcp runtime disposal during config reload",
      });
    if (plan.restartGmailWatcher) {
      const restartAbortController =
        params.createGmailRestartAbortController?.() ?? new AbortController();
      try {
        await params.stopPostReadySidecars?.();
        if (!restartAbortController.signal.aborted) {
          const [{ stopGmailWatcher }, { startGmailWatcherWithLogs }] = await Promise.all([
            import("./gmail-watcher-CSdWq-tq.js"),
            import("./gmail-watcher-lifecycle-DVADFtUy.js"),
          ]);
          if (!restartAbortController.signal.aborted)
            await stopGmailWatcher().catch((err) => {
              params.logHooks.warn(`gmail watcher stop failed during reload: ${String(err)}`);
            });
          if (!restartAbortController.signal.aborted)
            await startGmailWatcherWithLogs({
              cfg: nextConfig,
              log: params.logHooks,
              isCancelled: () => restartAbortController.signal.aborted,
              signal: restartAbortController.signal,
              onSkipped: () =>
                params.logHooks.info(
                  "skipping gmail watcher restart (OPENCLAW_SKIP_GMAIL_WATCHER=1)",
                ),
            });
        }
      } catch (err) {
        scheduleRecoveryRestart("gmail watcher reload", err);
      } finally {
        params.clearGmailRestartAbortController?.(restartAbortController);
      }
    }
    if (channelsToRestart.size > 0)
      if (shouldSkipChannelRestart)
        params.logChannels.info(
          "skipping channel reload (OPENCLAW_SKIP_CHANNELS=1 or OPENCLAW_SKIP_PROVIDERS=1)",
        );
      else if (getChannelAutostartSuppression())
        if (pluginReloadAborted)
          params.logChannels.info("channel restart cancelled by in-process restart");
        else {
          const stopFailures = await collectChannelOperationFailures({
            channels: channelsToRestart,
            run: async (channel) => {
              if (plan.reloadPlugins && activePluginChannelsAfterReload?.has(channel) === false)
                return;
              if (channelsStoppedBeforePluginReload.has(channel)) return;
              params.logChannels.info(`stopping ${channel} channel before suppressed hot reload`);
              await params.stopChannel(channel, void 0, { manual: false });
            },
            onFailure: (channel, err) => {
              params.logChannels.error(
                `failed to stop ${channel} channel during suppressed hot reload: ${formatErrorMessage(err)}`,
              );
            },
          });
          if (stopFailures.length > 0)
            scheduleRecoveryRestart(`channel stop (${stopFailures.join(", ")})`);
          logSuppressedChannelRestart(channelsToRestart, "channel restart during hot reload");
        }
      else if (pluginReloadAborted)
        params.logChannels.info("channel restart cancelled by in-process restart");
      else {
        const restartChannel = async (name) => {
          if (plan.reloadPlugins && activePluginChannelsAfterReload?.has(name) === false) return;
          params.logChannels.info(`restarting ${name} channel`);
          if (!channelsStoppedBeforePluginReload.has(name))
            await params.stopChannel(name, void 0, { manual: false });
          if (abortGeneration !== void 0 && myGeneration <= abortGeneration) return;
          await params.startChannel(name);
        };
        const restartFailures = await collectChannelOperationFailures({
          channels: channelsToRestart,
          run: restartChannel,
          onFailure: (channel, err) => {
            params.logChannels.error(
              `failed to restart ${channel} channel during hot reload: ${formatErrorMessage(err)}`,
            );
          },
        });
        if (restartFailures.length > 0)
          scheduleRecoveryRestart(`channel restart (${restartFailures.join(", ")})`);
      }
    if (shouldRefreshContextWindowCache(plan)) {
      try {
        await refreshContextWindowCache(nextConfig);
      } catch (err) {
        scheduleRecoveryRestart("context window cache reload", err);
      }
      loadModelCatalog({ config: nextConfig }).catch((err) => {
        params.logReload.warn(`model catalog rewarm failed: ${String(err)}`);
      });
    }
    warmCurrentProviderAuthStateOffMainThread(nextConfig, {
      isCancelled: () => !isTransactionCurrent(),
    }).catch((err) => {
      if (isTransactionCurrent())
        params.logReload.warn(`provider auth state rewarm failed: ${String(err)}`);
    });
    if (plan.hotReasons.length > 0)
      params.logReload.info(`config hot reload applied (${plan.hotReasons.join(", ")})`);
    else if (plan.noopPaths.length > 0)
      params.logReload.info(`config change applied (dynamic reads: ${plan.noopPaths.join(", ")})`);
  };
  let restartPending = false;
  let restartRetryStopped = false;
  let restartRetryTimer = null;
  let restartDeferral = null;
  let restartRequestGeneration = 0;
  let restartRequestTransaction = null;
  let restartEmissionSettled = false;
  let restartRequestDetails = null;
  let pausedRestartDebt = null;
  let conservativeRestartDebt = null;
  let latestAcceptedRestartTarget = null;
  let acceptedRestartTargetGeneration = 0;
  let configCandidatePending = false;
  const recordAcceptedRestartTarget = (target) => {
    const generation = ++acceptedRestartTargetGeneration;
    const acceptedTarget = {
      ...target,
      prepareRuntimeConfig: async () => {
        if (
          configCandidatePending ||
          generation !== acceptedRestartTargetGeneration ||
          latestAcceptedRestartTarget !== acceptedTarget
        )
          throw new GatewayConfigReloadSupersededError();
        const prepared = await target.prepareRuntimeConfig();
        if (
          configCandidatePending ||
          generation !== acceptedRestartTargetGeneration ||
          latestAcceptedRestartTarget !== acceptedTarget
        )
          throw new GatewayConfigReloadSupersededError();
        return prepared;
      },
    };
    latestAcceptedRestartTarget = acceptedTarget;
    configCandidatePending = false;
    return {
      reject: () => {
        if (latestAcceptedRestartTarget !== acceptedTarget) return;
        acceptedRestartTargetGeneration += 1;
        latestAcceptedRestartTarget = null;
        configCandidatePending = true;
      },
    };
  };
  const createRestartRequestDetails = (plan, nextConfig, options) => {
    const explicitRestartPaths = plan.restartReasons.filter((path) =>
      plan.changedPaths.includes(path),
    );
    return {
      plan,
      nextConfig: options?.debtConfig ?? nextConfig,
      restartOwnedPaths:
        explicitRestartPaths.length > 0 ? explicitRestartPaths : [...plan.changedPaths],
      retainDebtAcrossConfigChanges: options?.retainDebtAcrossConfigChanges === true,
    };
  };
  const deferGatewayRestartDebt = (plan, nextConfig, options) => {
    const details = createRestartRequestDetails(plan, nextConfig, options);
    if (details.retainDebtAcrossConfigChanges) conservativeRestartDebt = details;
    else pausedRestartDebt = details;
  };
  const preserveRestartDebt = (details) => {
    if (details.retainDebtAcrossConfigChanges) conservativeRestartDebt = details;
    else pausedRestartDebt = details;
  };
  const takeConservativeRestartDebt = () => {
    const debt = conservativeRestartDebt;
    conservativeRestartDebt = null;
    return debt;
  };
  const restoreConservativeRestartDebt = (debt) => {
    conservativeRestartDebt ??= debt;
  };
  const publishAcceptedRestartTarget = (target) => ({
    ownership: recordAcceptedRestartTarget(target),
    conservativeDebt: takeConservativeRestartDebt(),
  });
  const markRestartEmissionSettled = () => {
    restartEmissionSettled = true;
    conservativeRestartDebt = null;
  };
  const isCurrentRestartRetry = (retry) =>
    !restartRetryStopped &&
    retry.requestGeneration === restartRequestGeneration &&
    myGeneration === currentReloadGeneration;
  const supersedeRestartRequest = () => {
    restartRequestGeneration += 1;
    restartPending = false;
    restartDeferral?.cancel();
    restartDeferral = null;
    if (restartRetryTimer) {
      clearTimeout(restartRetryTimer);
      restartRetryTimer = null;
    }
    restartRequestTransaction = null;
    restartRequestDetails = null;
    restartEmissionSettled = false;
  };
  const stopRestartRetries = () => {
    restartRetryStopped = true;
    pausedRestartDebt = null;
    conservativeRestartDebt = null;
    supersedeRestartRequest();
  };
  const scheduleRestartEmissionRetry = (retry) => {
    if (restartRetryTimer || !isCurrentRestartRetry(retry)) return;
    restartPending = true;
    restartRetryTimer = setTimeout(() => {
      restartRetryTimer = null;
      if (!isCurrentRestartRetry(retry)) return;
      runWithGatewayIndependentRootWorkAdmission(async () => {
        if (!isCurrentRestartRetry(retry)) return;
        restartPending = false;
        if (retry.prepareForEmit && !(await retry.prepareForEmit())) {
          scheduleRestartEmissionRetry(retry);
          return;
        }
        const emitResult = params.requestRecoveryRestart?.(retry.reason, retry.intent);
        if (emitResult && emitResult.status !== "failed") markRestartEmissionSettled();
        if (!emitResult || emitResult.status === "failed") scheduleRestartEmissionRetry(retry);
      }).catch((err) => {
        if (isCurrentRestartRetry(retry))
          params.logReload.warn(`gateway restart recovery retry stopped: ${String(err)}`);
      });
    }, RESTART_EMISSION_RETRY_MS);
    restartRetryTimer.unref?.();
  };
  const acceptRestartConfig = (acceptedConfig) => {
    if (restartRequestTransaction?.state !== "rejected") return { retireRejectedRestart: false };
    const rejectedDebt = !restartEmissionSettled ? restartRequestDetails : null;
    if (rejectedDebt) preserveRestartDebt(rejectedDebt);
    supersedeRestartRequest();
    const configDebt = pausedRestartDebt;
    const retainsConfigDebt =
      configDebt &&
      acceptedConfig &&
      configDebt.restartOwnedPaths.every((path) =>
        isDeepStrictEqual(
          getConfigValueAtPath(configDebt.nextConfig, path.split(".")),
          getConfigValueAtPath(acceptedConfig, path.split(".")),
        ),
      );
    if (!retainsConfigDebt) pausedRestartDebt = null;
    const debt = (retainsConfigDebt ? configDebt : null) ?? conservativeRestartDebt;
    if (debt)
      return {
        retireRejectedRestart: false,
        debt,
      };
    return { retireRejectedRestart: true };
  };
  const retireRejectedRestartRequest = () => acceptRestartConfig().retireRejectedRestart;
  const beginGatewayRestartLifecycle = () => {
    if (
      !restartEmissionSettled &&
      restartRequestTransaction?.state !== "pending" &&
      restartRequestDetails
    )
      preserveRestartDebt(restartRequestDetails);
    supersedeRestartRequest();
    const transaction = { state: "pending" };
    restartRequestTransaction = transaction;
    return {
      settle: (state) => {
        if (transaction.state === "pending") {
          transaction.state = state;
          if (state === "committed") pausedRestartDebt = null;
        }
      },
    };
  };
  const pauseGatewayRestartForConfigCandidate = () => {
    configCandidatePending = true;
    beginGatewayRestartLifecycle().settle("rejected");
  };
  const requestGatewayRestartForGeneration = (plan, nextConfig, requestGeneration, options) => {
    const reasons = plan.restartReasons.length
      ? plan.restartReasons.join(", ")
      : plan.changedPaths.join(", ");
    const restartReason = `config reload: ${reasons}`;
    if (!restartRecoveryAvailable) {
      params.logReload.warn(
        "gateway restart recovery unavailable; restart-required reload rejected",
      );
      return false;
    }
    if (!params.requestRecoveryRestart) {
      params.logReload.warn("gateway restart recovery handler unavailable; restart skipped");
      return false;
    }
    const requestRecoveryRestart = params.requestRecoveryRestart;
    let emissionPrepared = true;
    const prepareForEmit = async () => {
      try {
        const preparedConfig = options?.prepareRuntimeConfig
          ? await options.prepareRuntimeConfig()
          : nextConfig;
        if (requestGeneration !== restartRequestGeneration) return false;
        emissionPrepared = true;
        setGatewaySigusr1RestartPolicy({ allowExternal: isRestartEnabled(preparedConfig) });
        return requestGeneration === restartRequestGeneration;
      } catch (err) {
        emissionPrepared = false;
        params.logReload.warn(`gateway restart secrets preflight failed: ${String(err)}`);
        return false;
      }
    };
    const active = getActiveCounts();
    if (active.totalActive > 0 || options?.prepareRuntimeConfig) {
      if (restartPending) {
        params.logReload.info(
          `config change requires gateway restart (${reasons}) — already waiting for operations to complete`,
        );
        return true;
      }
      restartPending = true;
      if (active.totalActive > 0) {
        const initialDetails = formatActiveDetails(active);
        params.logReload.warn(
          `config change requires gateway restart (${reasons}) — deferring until ${initialDetails.join(", ")} complete`,
        );
        const taskBlockers = formatTaskBlockers();
        if (taskBlockers)
          params.logReload.warn(
            `restart blocked by active background task run(s): ${taskBlockers}`,
          );
      } else
        params.logReload.warn(`config change requires gateway restart (${reasons}) — preparing`);
      let failedEmission;
      restartDeferral = deferGatewayRestartUntilIdle({
        getPendingCount: () => getActiveCounts().totalActive,
        maxWaitMs: resolveGatewayRestartDeferralTimeoutMs(
          nextConfig.gateway?.reload?.deferralTimeoutMs,
        ),
        timeoutIntent: {
          force: true,
          reason: "config reload forced restart",
        },
        reason: restartReason,
        emitHooks: {
          beforeEmit: async () => {
            emissionPrepared = await prepareForEmit();
          },
          emitRestart: (reason, intent) => {
            if (requestGeneration !== restartRequestGeneration) return { status: "coalesced" };
            const resolvedReason = reason ?? restartReason;
            if (!emissionPrepared) {
              failedEmission = {
                reason: resolvedReason,
                intent,
              };
              return { status: "failed" };
            }
            const emitResult = requestRecoveryRestart(resolvedReason, intent);
            if (emitResult.status !== "failed") markRestartEmissionSettled();
            failedEmission =
              emitResult.status === "failed"
                ? {
                    reason: resolvedReason,
                    intent,
                  }
                : void 0;
            return emitResult;
          },
          afterEmitFailed: async () => {
            if (requestGeneration !== restartRequestGeneration || !failedEmission) return;
            if (!restartRecoveryAvailable) {
              params.logReload.warn("gateway restart recovery unavailable; retry skipped");
              return;
            }
            params.logReload.warn("gateway restart recovery emission failed; retrying");
            scheduleRestartEmissionRetry({
              ...failedEmission,
              requestGeneration,
              prepareForEmit,
            });
          },
        },
        hooks: {
          onReady: () => {
            restartPending = false;
            restartDeferral = null;
            params.logReload.info("all operations and replies completed; restarting gateway now");
          },
          onStillPending: (_pending, elapsedMs) => {
            const remaining = formatActiveDetails(getActiveCounts());
            const taskBlockersValue = formatTaskBlockers();
            params.logReload.warn(
              `restart still deferred after ${elapsedMs}ms with ${remaining.join(", ")} active${taskBlockersValue ? ` (${taskBlockersValue})` : ""}`,
            );
          },
          onTimeout: (_pending, elapsedMs) => {
            const remaining = formatActiveDetails(getActiveCounts());
            const taskBlockersLocal = formatTaskBlockers();
            restartPending = false;
            restartDeferral = null;
            params.logReload.warn(
              `restart timeout after ${elapsedMs}ms with ${remaining.join(", ")} still active${taskBlockersLocal ? ` (${taskBlockersLocal})` : ""}; forcing restart`,
            );
          },
          onCheckError: (err) => {
            restartPending = false;
            restartDeferral = null;
            params.logReload.warn(
              `restart deferral check failed (${String(err)}); restarting gateway now`,
            );
          },
        },
      });
      setGatewaySigusr1RestartPolicy({ allowExternal: isRestartEnabled(nextConfig) });
      return true;
    }
    params.logReload.warn(`config change requires gateway restart (${reasons})`);
    const emitResult = requestRecoveryRestart(restartReason);
    if (emitResult.status !== "failed") markRestartEmissionSettled();
    if (emitResult.status === "failed") {
      params.logReload.warn("gateway restart recovery emission failed");
      if (restartRecoveryAvailable)
        scheduleRestartEmissionRetry({
          reason: restartReason,
          requestGeneration,
          prepareForEmit,
        });
      return false;
    }
    if (emitResult.status === "coalesced")
      params.logReload.info("gateway restart already scheduled; skipping duplicate signal");
    setGatewaySigusr1RestartPolicy({ allowExternal: isRestartEnabled(nextConfig) });
    return true;
  };
  const requestGatewayRestart = (plan, nextConfig, options) => {
    if (restartRetryStopped)
      return {
        status: "recovery-pending",
        settle: () => {},
      };
    supersedeRestartRequest();
    const transaction = { state: "pending" };
    restartRequestTransaction = transaction;
    restartEmissionSettled = false;
    restartRequestDetails = createRestartRequestDetails(plan, nextConfig, options);
    return {
      status: requestGatewayRestartForGeneration(
        plan,
        nextConfig,
        restartRequestGeneration,
        options,
      )
        ? "accepted"
        : "recovery-pending",
      settle: (state) => {
        if (transaction.state === "pending") transaction.state = state;
      },
    };
  };
  return {
    applyHotReload,
    acceptRestartConfig,
    beginGatewayRestartLifecycle,
    pauseGatewayRestartForConfigCandidate,
    publishAcceptedRestartTarget,
    recordAcceptedRestartTarget,
    requestGatewayRestart,
    restoreConservativeRestartDebt,
    retireRejectedRestartRequest,
    stopRestartRetries,
  };
}
function startManagedGatewayConfigReloader(params) {
  if (params.minimalTestGateway) return { stop: async () => {} };
  const prepareRuntimeCandidate = (runtimeConfig, sourceConfig, ownership) => {
    const canonicalConfig = restoreCanonicalSecretRefs(runtimeConfig, sourceConfig);
    const candidateConfig = ownership?.reapplyRuntimeOverlays(canonicalConfig) ?? canonicalConfig;
    return params.applyRuntimeConfigOverrides?.(candidateConfig) ?? candidateConfig;
  };
  const applyRuntimeConfigOverrides = (config) =>
    params.applyRuntimeConfigOverrides?.(config) ?? config;
  const restartRecoveryAvailable =
    params.restartRecoveryAvailable !== false && params.requestRecoveryRestart !== void 0;
  let stopped = false;
  let activeGmailRestartAbortController = null;
  const abortActiveGmailRestart = () => {
    activeGmailRestartAbortController?.abort();
    activeGmailRestartAbortController = null;
  };
  const createGmailRestartAbortController = () => {
    abortActiveGmailRestart();
    const abortController = new AbortController();
    if (stopped) {
      abortController.abort();
      return abortController;
    }
    activeGmailRestartAbortController = abortController;
    return abortController;
  };
  const {
    applyHotReload,
    acceptRestartConfig,
    beginGatewayRestartLifecycle,
    pauseGatewayRestartForConfigCandidate,
    publishAcceptedRestartTarget,
    recordAcceptedRestartTarget,
    requestGatewayRestart,
    restoreConservativeRestartDebt,
    stopRestartRetries,
  } = createGatewayReloadHandlers({
    deps: params.deps,
    broadcast: params.broadcast,
    getState: params.getState,
    setState: params.setState,
    startChannel: params.startChannel,
    stopChannel: params.stopChannel,
    getChannelAutostartSuppression: params.getChannelAutostartSuppression,
    stopPostReadySidecars: params.stopPostReadySidecars,
    reloadPlugins: params.reloadPlugins,
    logHooks: params.logHooks,
    logChannels: params.logChannels,
    logCron: params.logCron,
    logReload: params.logReload,
    cronReconciliation: params.cronReconciliation,
    createGmailRestartAbortController,
    clearGmailRestartAbortController: (abortController) => {
      if (activeGmailRestartAbortController === abortController)
        activeGmailRestartAbortController = null;
    },
    ...(params.onCronRestart ? { onCronRestart: params.onCronRestart } : {}),
    ...(params.requestRecoveryRestart
      ? { requestRecoveryRestart: params.requestRecoveryRestart }
      : {}),
    restartRecoveryAvailable,
    createHealthMonitor: (config) =>
      startGatewayChannelHealthMonitor({
        cfg: config,
        channelManager: params.channelManager,
      }),
  });
  const runManagedRestart = async (
    plan,
    nextConfig,
    transactionOwnership,
    sourceConfig,
    restartOptions,
    beforeRestartRequest,
  ) => {
    const isCurrent = () => !stopped && transactionOwnership.isCurrent();
    const assertCurrent = () => {
      if (!isCurrent()) throw new GatewayConfigReloadSupersededError();
    };
    assertCurrent();
    const restartLifecycle = beginGatewayRestartLifecycle();
    let preparation;
    try {
      for (;;) {
        assertCurrent();
        const previousSnapshotRevision = getActiveSecretsRuntimeSnapshotRevision();
        const ownership = captureSharedGatewaySessionGenerationOwnership(
          params.sharedGatewaySessionGenerationState,
        );
        const previousRequired = params.sharedGatewaySessionGenerationState.required;
        const prepared = await params.activateRuntimeSecrets(
          prepareRuntimeCandidate(nextConfig, sourceConfig, transactionOwnership),
          {
            reason: "restart-check",
            activate: false,
            ...(transactionOwnership.runtimeEnv
              ? { env: transactionOwnership.runtimeEnv.env }
              : {}),
          },
        );
        assertCurrent();
        const snapshotChanged =
          getActiveSecretsRuntimeSnapshotRevision() !== previousSnapshotRevision;
        const generationChanged = !isSharedGatewaySessionGenerationOwnershipCurrent(
          params.sharedGatewaySessionGenerationState,
          ownership,
        );
        if (snapshotChanged || generationChanged) continue;
        preparation = {
          ownership,
          previousRequired,
          previousCurrent: ownership.generation,
          nextGeneration: params.resolveSharedGatewaySessionGenerationForConfig(prepared.config),
          runtimeConfig: prepared.config,
        };
        break;
      }
    } catch (error) {
      restartLifecycle.settle("rejected");
      throw error;
    }
    const {
      ownership: preparationOwnership,
      previousRequired: previousRequiredSharedGatewaySessionGeneration,
      previousCurrent: previousSharedGatewaySessionGeneration,
      nextGeneration: nextSharedGatewaySessionGeneration,
      runtimeConfig: preparedRuntimeConfig,
    } = preparation;
    let restartTransaction;
    let requiredOwnership = null;
    try {
      assertCurrent();
      params.reconcileTerminalSessions(plan, preparedRuntimeConfig);
      assertCurrent();
      await beforeRestartRequest?.();
      assertCurrent();
      requiredOwnership = setRequiredSharedGatewaySessionGenerationIfOwned(
        params.sharedGatewaySessionGenerationState,
        preparationOwnership,
        previousSharedGatewaySessionGeneration !== nextSharedGatewaySessionGeneration
          ? nextSharedGatewaySessionGeneration
          : null,
      );
      if (!requiredOwnership) throw new GatewayHotReloadStaleSecretsError();
      transactionOwnership.publishRuntimeEnv();
      restartTransaction = requestGatewayRestart(plan, preparedRuntimeConfig, {
        ...restartOptions,
        debtConfig: sourceConfig,
        prepareRuntimeConfig: async () => {
          const prepared = await params.activateRuntimeSecrets(
            prepareRuntimeCandidate(preparedRuntimeConfig, sourceConfig, transactionOwnership),
            {
              reason: "restart-check",
              activate: false,
              ...(transactionOwnership.runtimeEnv
                ? { env: transactionOwnership.runtimeEnv.env }
                : {}),
            },
          );
          assertCurrent();
          return prepared.config;
        },
      });
      if (restartTransaction.status === "recovery-pending")
        throw new GatewayHotReloadRecoveryError("config restart");
      if (previousSharedGatewaySessionGeneration !== nextSharedGatewaySessionGeneration)
        disconnectStaleSharedGatewayAuthClients({
          clients: params.clients,
          expectedGeneration: nextSharedGatewaySessionGeneration,
        });
      restartTransaction.settle("committed");
      transactionOwnership.commitRuntimeEnv();
      restartLifecycle.settle("committed");
    } catch (error) {
      restartTransaction?.settle("rejected");
      restartLifecycle.settle("rejected");
      transactionOwnership.rollbackRuntimeEnv();
      if (requiredOwnership)
        setRequiredSharedGatewaySessionGenerationIfOwned(
          params.sharedGatewaySessionGenerationState,
          requiredOwnership,
          previousRequiredSharedGatewaySessionGeneration,
        );
      throw error;
    }
  };
  const configReloader = startGatewayConfigReloader({
    initialConfig: params.initialConfig,
    initialCompareConfig: params.initialCompareConfig,
    ...(params.prepareConfigCandidate
      ? { prepareConfigCandidate: params.prepareConfigCandidate }
      : {}),
    initialInternalWriteHash: params.initialInternalWriteHash,
    runTransaction: runWithGatewayIndependentRootWorkAdmission,
    readSnapshot: params.readSnapshot,
    promoteSnapshot: async (snapshot, _reason) => await params.promoteSnapshot(snapshot),
    subscribeToWrites: params.subscribeToWrites,
    onConfigCandidateObserved: pauseGatewayRestartForConfigCandidate,
    onConfigChange: (plan, nextConfig) => {
      assertIrreversibleReloadPlanHasRecoveryOwner(plan, restartRecoveryAvailable);
      params.prepareTerminalConfig(plan, applyRuntimeConfigOverrides(nextConfig));
    },
    onConfigAccepted: async (nextConfig, transactionOwnership, sourceConfig, acceptance) => {
      const assertCurrent = () => {
        if (!transactionOwnership.isCurrent()) throw new GatewayConfigReloadSupersededError();
      };
      const createRestartTarget = () => ({
        runtimeConfig: prepareRuntimeCandidate(nextConfig, sourceConfig, transactionOwnership),
        sourceConfig,
        prepareRuntimeConfig: async () => {
          return (
            await params.activateRuntimeSecrets(
              prepareRuntimeCandidate(nextConfig, sourceConfig, transactionOwnership),
              {
                reason: "restart-check",
                activate: false,
                ...(transactionOwnership.runtimeEnv
                  ? { env: transactionOwnership.runtimeEnv.env }
                  : {}),
              },
            )
          ).config;
        },
      });
      let rollbackSource;
      let acceptedTargetOwnership;
      let lateConservativeDebt = null;
      try {
        assertCurrent();
        const acceptedRestart = acceptRestartConfig(sourceConfig);
        if (!acceptance.runtimeApplied) {
          assertCurrent();
          recordAcceptedRestartTarget(createRestartTarget());
          params.acceptTerminalConfig({
            retireRejectedRestart: acceptedRestart.retireRejectedRestart,
          });
          return;
        }
        if (acceptedRestart.debt)
          await runManagedRestart(
            acceptedRestart.debt.plan,
            nextConfig,
            transactionOwnership,
            sourceConfig,
            { retainDebtAcrossConfigChanges: acceptedRestart.debt.retainDebtAcrossConfigChanges },
            async () => {
              rollbackSource = await acceptance.publishSource?.();
            },
          );
        else rollbackSource = await acceptance.publishSource?.();
        assertCurrent();
        const acceptedTarget = publishAcceptedRestartTarget(createRestartTarget());
        acceptedTargetOwnership = acceptedTarget.ownership;
        lateConservativeDebt = acceptedTarget.conservativeDebt;
        if (lateConservativeDebt && lateConservativeDebt !== acceptedRestart.debt)
          await runManagedRestart(
            lateConservativeDebt.plan,
            nextConfig,
            transactionOwnership,
            sourceConfig,
            { retainDebtAcrossConfigChanges: lateConservativeDebt.retainDebtAcrossConfigChanges },
          );
        assertCurrent();
        params.acceptTerminalConfig({
          retireRejectedRestart: acceptedRestart.retireRejectedRestart && !lateConservativeDebt,
        });
        return rollbackSource;
      } catch (error) {
        if (lateConservativeDebt) restoreConservativeRestartDebt(lateConservativeDebt);
        acceptedTargetOwnership?.reject();
        await rollbackSource?.();
        throw error;
      }
    },
    onConfigApplied: (_plan, nextConfig) => params.commitTerminalConfig(nextConfig),
    onEffectiveConfigUnchanged: async (nextConfig, transactionOwnership, sourceConfig) => {
      if (!transactionOwnership.isCurrent()) throw new GatewayConfigReloadSupersededError();
      const metadata = getRuntimeConfigSnapshotMetadata();
      const previousRuntimeSourceConfig = getRuntimeConfigSourceSnapshot();
      const previousSecretsSourceConfig = getActiveSecretsRuntimeSnapshot()?.sourceConfig;
      const previousSecretsRevision = getActiveSecretsRuntimeSnapshotRevision();
      if (
        !metadata ||
        !previousRuntimeSourceConfig ||
        !setSecretsRuntimeSourceSnapshotIfCurrent({
          expectedSecretsRevision: previousSecretsRevision,
          expectedRuntimeConfigRevision: metadata.revision,
          runtimeSourceConfig: sourceConfig,
          secretsSourceConfig: prepareRuntimeCandidate(
            nextConfig,
            sourceConfig,
            transactionOwnership,
          ),
        }) ||
        !transactionOwnership.isCurrent()
      )
        throw new GatewayConfigReloadSupersededError();
      const committedMetadata = getRuntimeConfigSnapshotMetadata();
      const committedSecretsRevision = getActiveSecretsRuntimeSnapshotRevision();
      return async () => {
        if (
          !committedMetadata ||
          !setSecretsRuntimeSourceSnapshotIfCurrent({
            expectedSecretsRevision: committedSecretsRevision,
            expectedRuntimeConfigRevision: committedMetadata.revision,
            runtimeSourceConfig: previousRuntimeSourceConfig,
            secretsSourceConfig: previousSecretsSourceConfig ?? previousRuntimeSourceConfig,
          })
        )
          throw new GatewayConfigReloadSupersededError();
      };
    },
    onNoopConfigCommit: async (plan, nextConfig, transactionOwnership, sourceConfig) => {
      for (;;) {
        if (!transactionOwnership.isCurrent()) throw new GatewayConfigReloadSupersededError();
        const previousSnapshotRevision = getActiveSecretsRuntimeSnapshotRevision();
        const prepared = await params.activateRuntimeSecrets(
          prepareRuntimeCandidate(nextConfig, sourceConfig, transactionOwnership),
          {
            reason: "reload",
            activate: false,
            ...(transactionOwnership.runtimeEnv
              ? { env: transactionOwnership.runtimeEnv.env }
              : {}),
            includeAuthStoreRefs: transactionOwnership.runtimeRefresh?.includeAuthStoreRefs,
          },
        );
        if (!transactionOwnership.isCurrent()) throw new GatewayConfigReloadSupersededError();
        const activateIfCurrent = params.activateRuntimeSecrets.activatePreparedSnapshotIfCurrent;
        const publishTerminalConfig = () => {
          transactionOwnership.publishRuntimeEnv();
          transactionOwnership.markRuntimeCommitted(prepared.config, plan);
          params.reconcileTerminalSessions(plan, prepared.config);
        };
        if (
          activateIfCurrent
            ? await activateIfCurrent(
                prepared,
                previousSnapshotRevision,
                {
                  reason: "reload",
                  activate: true,
                },
                publishTerminalConfig,
                transactionOwnership.isCurrent,
              )
            : (await activateSecretsRuntimeSnapshotIfCurrent(prepared, previousSnapshotRevision, {
                  canActivate: transactionOwnership.isCurrent,
                  onActivated: publishTerminalConfig,
                }))
              ? prepared
              : null
        )
          return;
      }
    },
    onHotReload: async (plan, nextConfig, transactionOwnership, sourceConfig) => {
      for (;;) {
        if (!transactionOwnership.isCurrent()) throw new GatewayConfigReloadSupersededError();
        const previousSnapshot = getActiveSecretsRuntimeSnapshot();
        const previousSnapshotRevision = getActiveSecretsRuntimeSnapshotRevision();
        const previousGenerationOwnership = captureSharedGatewaySessionGenerationOwnership(
          params.sharedGatewaySessionGenerationState,
        );
        const previousSharedGatewaySessionGeneration = previousGenerationOwnership.generation;
        const prepared = await params.activateRuntimeSecrets(
          prepareRuntimeCandidate(nextConfig, sourceConfig, transactionOwnership),
          {
            reason: "reload",
            activate: false,
            ...(transactionOwnership.runtimeEnv
              ? { env: transactionOwnership.runtimeEnv.env }
              : {}),
            includeAuthStoreRefs: transactionOwnership.runtimeRefresh?.includeAuthStoreRefs,
          },
        );
        if (!transactionOwnership.isCurrent()) throw new GatewayConfigReloadSupersededError();
        if (getActiveSecretsRuntimeSnapshotRevision() !== previousSnapshotRevision) continue;
        const nextSharedGatewaySessionGeneration =
          params.resolveSharedGatewaySessionGenerationForConfig(prepared.config);
        const sharedGatewaySessionGenerationChanged =
          previousSharedGatewaySessionGeneration !== nextSharedGatewaySessionGeneration;
        let runtimeSecretsPublished = false;
        let runtimeCommitted = false;
        let publishedSnapshotRevision = null;
        let publishedSharedGatewaySessionGeneration = null;
        let terminalConfigReconciled = false;
        try {
          await applyHotReload(plan, prepared.config, {
            isCurrent: transactionOwnership.isCurrent,
            ...(transactionOwnership.runtimeEnv
              ? { runtimeEnv: transactionOwnership.runtimeEnv.env }
              : {}),
            sourceConfig,
            prepareRestartRuntimeConfig: async () => {
              const restartPrepared = await params.activateRuntimeSecrets(
                prepareRuntimeCandidate(prepared.config, sourceConfig, transactionOwnership),
                {
                  reason: "restart-check",
                  activate: false,
                  ...(transactionOwnership.runtimeEnv
                    ? { env: transactionOwnership.runtimeEnv.env }
                    : {}),
                },
              );
              if (!transactionOwnership.isCurrent()) throw new GatewayConfigReloadSupersededError();
              return restartPrepared.config;
            },
            publish: async (commit, isCommitted) => {
              const claimGenerationOwnership = () => {
                publishedSharedGatewaySessionGeneration ??=
                  claimSharedGatewaySessionGenerationIfOwned(
                    params.sharedGatewaySessionGenerationState,
                    previousGenerationOwnership,
                    nextSharedGatewaySessionGeneration,
                  );
                if (!publishedSharedGatewaySessionGeneration)
                  throw new GatewayHotReloadStaleSecretsError();
              };
              const publishRuntime = async () => {
                runtimeSecretsPublished = true;
                publishedSnapshotRevision = getActiveSecretsRuntimeSnapshotRevision();
                claimGenerationOwnership();
                try {
                  transactionOwnership.publishRuntimeEnv();
                  await commit();
                  if (!terminalConfigReconciled) {
                    params.reconcileTerminalSessions(plan, prepared.config);
                    terminalConfigReconciled = true;
                  }
                  if (sharedGatewaySessionGenerationChanged)
                    disconnectStaleSharedGatewayAuthClients({
                      clients: params.clients,
                      expectedGeneration: nextSharedGatewaySessionGeneration,
                    });
                } catch (err) {
                  if (!isCommitted()) {
                    let generationRestored = false;
                    let snapshotRestored = false;
                    const generationOwnership = publishedSharedGatewaySessionGeneration;
                    if (previousSnapshot && generationOwnership)
                      snapshotRestored = await restoreSecretsRuntimeSnapshotIfCurrent(
                        previousSnapshot,
                        publishedSnapshotRevision ?? -1,
                        prepared,
                        {
                          onActivated: () => {
                            generationRestored = restoreOwnedCurrentSharedGatewaySessionGeneration(
                              params.sharedGatewaySessionGenerationState,
                              generationOwnership,
                              previousSharedGatewaySessionGeneration,
                            );
                          },
                        },
                      );
                    else if (
                      publishedSnapshotRevision !== null &&
                      getActiveSecretsRuntimeSnapshotRevision() === publishedSnapshotRevision
                    ) {
                      clearSecretsRuntimeSnapshot();
                      snapshotRestored = true;
                      if (generationOwnership)
                        generationRestored = restoreOwnedCurrentSharedGatewaySessionGeneration(
                          params.sharedGatewaySessionGenerationState,
                          generationOwnership,
                          previousSharedGatewaySessionGeneration,
                        );
                    }
                    if (snapshotRestored) {
                      if (previousSnapshot && shouldRefreshContextWindowCache(plan))
                        await refreshContextWindowCache(previousSnapshot.config);
                      runtimeSecretsPublished = false;
                    }
                    if (generationRestored && sharedGatewaySessionGenerationChanged)
                      disconnectStaleSharedGatewayAuthClients({
                        clients: params.clients,
                        expectedGeneration: previousSharedGatewaySessionGeneration,
                      });
                  }
                  throw err;
                } finally {
                  if (isCommitted()) {
                    runtimeCommitted = true;
                    transactionOwnership.markRuntimeCommitted(prepared.config, plan);
                  }
                }
              };
              const activateIfCurrent =
                params.activateRuntimeSecrets.activatePreparedSnapshotIfCurrent;
              if (activateIfCurrent) {
                if (
                  !(await activateIfCurrent(
                    prepared,
                    previousSnapshotRevision,
                    {
                      reason: "reload",
                      activate: true,
                    },
                    publishRuntime,
                    () =>
                      transactionOwnership.isCurrent() &&
                      isSharedGatewaySessionGenerationOwnershipCurrent(
                        params.sharedGatewaySessionGenerationState,
                        previousGenerationOwnership,
                      ),
                  ))
                )
                  throw new GatewayHotReloadStaleSecretsError();
              } else {
                if (
                  !(await activateSecretsRuntimeSnapshotIfCurrent(
                    prepared,
                    previousSnapshotRevision,
                    {
                      canActivate: () =>
                        transactionOwnership.isCurrent() &&
                        isSharedGatewaySessionGenerationOwnershipCurrent(
                          params.sharedGatewaySessionGenerationState,
                          previousGenerationOwnership,
                        ),
                      onActivated: claimGenerationOwnership,
                    },
                  ))
                )
                  throw new GatewayHotReloadStaleSecretsError();
                await publishRuntime();
              }
            },
          });
        } catch (err) {
          if (err instanceof GatewayHotReloadStaleSecretsError) {
            if (!transactionOwnership.isCurrent()) throw new GatewayConfigReloadSupersededError();
            continue;
          }
          if (err instanceof GatewayHotReloadRecoveryError) throw err;
          if (runtimeCommitted) throw err;
          if (runtimeSecretsPublished) {
            let generationRestored = false;
            let snapshotRestored = false;
            const generationOwnership = publishedSharedGatewaySessionGeneration;
            if (previousSnapshot && publishedSnapshotRevision !== null && generationOwnership)
              snapshotRestored = await restoreSecretsRuntimeSnapshotIfCurrent(
                previousSnapshot,
                publishedSnapshotRevision,
                prepared,
                {
                  onActivated: () => {
                    generationRestored = restoreOwnedCurrentSharedGatewaySessionGeneration(
                      params.sharedGatewaySessionGenerationState,
                      generationOwnership,
                      previousSharedGatewaySessionGeneration,
                    );
                  },
                },
              );
            else if (
              publishedSnapshotRevision !== null &&
              generationOwnership &&
              getActiveSecretsRuntimeSnapshotRevision() === publishedSnapshotRevision
            ) {
              clearSecretsRuntimeSnapshot();
              snapshotRestored = true;
              generationRestored = restoreOwnedCurrentSharedGatewaySessionGeneration(
                params.sharedGatewaySessionGenerationState,
                generationOwnership,
                previousSharedGatewaySessionGeneration,
              );
            }
            if (snapshotRestored) {
              if (previousSnapshot && shouldRefreshContextWindowCache(plan))
                await refreshContextWindowCache(previousSnapshot.config);
            }
            if (generationRestored && sharedGatewaySessionGenerationChanged)
              disconnectStaleSharedGatewayAuthClients({
                clients: params.clients,
                expectedGeneration: previousSharedGatewaySessionGeneration,
              });
          }
          throw err;
        }
        if (publishedSharedGatewaySessionGeneration)
          finalizeOwnedSharedGatewaySessionGeneration(
            params.sharedGatewaySessionGenerationState,
            publishedSharedGatewaySessionGeneration,
          );
        return;
      }
    },
    onRestart: runManagedRestart,
    log: {
      info: (msg) => params.logReload.info(msg),
      warn: (msg) => params.logReload.warn(msg),
      error: (msg) => params.logReload.error(msg),
    },
    watchPath: params.watchPath,
  });
  return {
    stop: async () => {
      stopped = true;
      stopRestartRetries();
      abortPendingChannelReloads();
      abortActiveGmailRestart();
      await configReloader.stop();
    },
    hotReloadStatus: configReloader.hotReloadStatus,
  };
}
//#endregion
export {
  startManagedGatewayConfigReloader as a,
  createGatewayReloadHandlers as i,
  GatewayHotReloadRecoveryError as n,
  abortPendingChannelReloads as r,
  GatewayHotReloadCancelledError as t,
};
