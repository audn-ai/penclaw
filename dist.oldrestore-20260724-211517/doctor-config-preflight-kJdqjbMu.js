import fs from "node:fs/promises";
import path from "node:path";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-CwdMUFhk.js";
import { r as noteIncludeConfinementWarning } from "./doctor-config-analysis-B1_kTc5u.js";
import { n as isTruthyEnvValue } from "./env-Di-LcxqW.js";
import "./env-vars-D5-q5cD2.js";
import {
  _ as recoverConfigFromJsonRootSuffix,
  u as readConfigFileSnapshot,
  v as recoverConfigFromLastKnownGood,
} from "./io-B3ne6NxF.js";
import { n as formatConfigIssueLines } from "./issue-format-IJKFr2SL.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { t as findDoctorLegacyConfigIssues } from "./legacy-config-issues-CZGV9OsJ.js";
import { t as migrateLegacyConfig } from "./legacy-config-migrate-C7yKZF7d.js";
import { t as note } from "./note-Uvqr4R1d.js";
import { f as resolveHomeDir } from "./utils-DtcDeqWS.js";
//#region src/commands/doctor/shared/legacy-config-state-migration-input.ts
function resolveStateMigrationConfigInput(params) {
  const pluginDoctorConfig =
    params.snapshot.sourceConfig ?? params.snapshot.config ?? params.snapshot.parsed;
  if (params.snapshot.valid)
    return params.snapshot.legacyIssues.length > 0 && pluginDoctorConfig !== void 0
      ? {
          cfg: params.baseConfig,
          pluginDoctorConfig,
        }
      : { cfg: params.baseConfig };
  const migrationSource = pluginDoctorConfig ?? params.snapshot.parsed;
  if (params.snapshot.legacyIssues.length === 0 || migrationSource === void 0) return null;
  const migrated = migrateLegacyConfig(migrationSource);
  if (!migrated.config) return null;
  if (migrated.partiallyValid) return { pluginDoctorConfig: pluginDoctorConfig ?? migrationSource };
  return {
    cfg: migrated.config,
    ...(pluginDoctorConfig ? { pluginDoctorConfig } : {}),
  };
}
//#endregion
//#region src/commands/doctor-config-preflight.ts
/** Config preflight for doctor: legacy config/state migration, recovery, and snapshot loading. */
const loadDoctorStateMigrations = createLazyRuntimeModule(
  () => import("./doctor-state-migrations-Cuhh0aLt.js"),
);
const loadDoctorCron = createLazyRuntimeModule(() => import("./cron-By4ujAvV.js"));
const startupPreflightTraceStartedAt = performance.now();
async function measureStartupPreflightStep(name, run) {
  if (!isTruthyEnvValue(process.env.OPENCLAW_GATEWAY_STARTUP_TRACE)) return await run();
  const startedAt = performance.now();
  try {
    return await run();
  } finally {
    const durationMs = performance.now() - startedAt;
    const totalMs = performance.now() - startupPreflightTraceStartedAt;
    process.stderr.write(
      `[gateway] startup trace: cli.bootstrap.${name} ${durationMs.toFixed(1)}ms total=${totalMs.toFixed(1)}ms\n`,
    );
  }
}
async function maybeMigrateLegacyConfig() {
  const changes = [];
  const home = resolveHomeDir();
  if (!home) return changes;
  const targetDir = path.join(home, ".openclaw");
  const targetPath = path.join(targetDir, "openclaw.json");
  try {
    await fs.access(targetPath);
    return changes;
  } catch {}
  const legacyCandidates = [path.join(home, ".clawdbot", "clawdbot.json")];
  let legacyPath = null;
  for (const candidate of legacyCandidates)
    try {
      await fs.access(candidate);
      legacyPath = candidate;
      break;
    } catch {}
  if (!legacyPath) return changes;
  await fs.mkdir(targetDir, { recursive: true });
  try {
    await fs.copyFile(legacyPath, targetPath, fs.constants.COPYFILE_EXCL);
    changes.push(`Migrated legacy config: ${legacyPath} -> ${targetPath}`);
  } catch {}
  return changes;
}
function collectDoctorLegacyIssues(snapshot) {
  if (!snapshot.exists) return [];
  const resolvedRaw = snapshot.sourceConfig ?? snapshot.config ?? {};
  return findDoctorLegacyConfigIssues(resolvedRaw, snapshot.parsed ?? resolvedRaw);
}
function addDoctorLegacyIssues(snapshot) {
  const legacyIssues = collectDoctorLegacyIssues(snapshot);
  if (legacyIssues.length === 0) return snapshot;
  return {
    ...snapshot,
    legacyIssues,
  };
}
/** Returns true during updater-managed config rewrites where plugin validation may be stale. */
function shouldSkipPluginValidationForDoctorConfigPreflight(env = process.env) {
  return isTruthyEnvValue(env.OPENCLAW_UPDATE_IN_PROGRESS);
}
function noteStateMigrationResult(result) {
  if (result.changes.length > 0)
    note(result.changes.map((entry) => `- ${entry}`).join("\n"), "Doctor changes");
  const notices = result.notices ?? [];
  if (notices.length > 0) note(notices.map((entry) => `- ${entry}`).join("\n"), "Doctor notices");
  if (result.warnings.length > 0)
    note(result.warnings.map((entry) => `- ${entry}`).join("\n"), "Doctor warnings");
}
async function runStartupUpgradeConvergence(params) {
  const { planStartupPluginConvergence } = await measureStartupPreflightStep(
    "plugin-plan-import",
    () => import("./startup-plugin-convergence-plan-Cuym76QW.js"),
  );
  const plan = await measureStartupPreflightStep("plugin-plan", () =>
    planStartupPluginConvergence({
      config: params.cfg,
      env: params.env,
    }),
  );
  if (!plan.required) return [];
  const { runPostCorePluginConvergence } = await measureStartupPreflightStep(
    "plugin-convergence-import",
    () => import("./post-core-plugin-convergence-MDOs3mB1.js"),
  );
  const convergence = await measureStartupPreflightStep("plugin-convergence", () =>
    runPostCorePluginConvergence({
      cfg: params.cfg,
      env: params.env,
      baselineInstallRecords: plan.installRecords,
    }),
  );
  if (convergence.changes.length > 0)
    note(convergence.changes.map((entry) => `- ${entry}`).join("\n"), "Doctor changes");
  const notices = convergence.notices ?? [];
  if (notices.length > 0)
    note(
      notices.map((notice) => `- ${notice.message} ${notice.guidance.join(" ")}`.trim()).join("\n"),
      "Doctor notices",
    );
  const warnings = convergence.warnings.map((warning) =>
    `${warning.message} ${warning.guidance.join(" ")}`.trim(),
  );
  if (warnings.length > 0)
    note(warnings.map((warning) => `- ${warning}`).join("\n"), "Doctor warnings");
  return warnings;
}
function formatStartupMigrationFailure(params) {
  return [
    "OpenClaw startup migrations did not complete cleanly; refusing to report the gateway ready.",
    ...[
      ...params.warnings.map((warning) => `- ${warning}`),
      ...params.blockers.map((blocker) => `- ${blocker}`),
    ],
    'Run "openclaw doctor --fix" against the mounted state/config, then restart the container.',
  ].join("\n");
}
function throwStartupMigrationGuardRejected() {
  throw new Error(
    "OpenClaw startup migrations were skipped because the selected config changed during startup; refusing to report the gateway ready. Retry startup so the new config can be validated.",
  );
}
/**
 * Runs early doctor config checks before the main config repair flow.
 *
 * It may migrate legacy state/config paths, recover corrupt target config when requested, and
 * returns the best-effort config snapshot used by later doctor checks.
 */
async function runDoctorConfigPreflight(options = {}) {
  const stateMigrationsRequested = options.migrateState !== false;
  const startupCheckpoint =
    options.requireStartupMigrationCheckpoint === true
      ? await import("./startup-migration-checkpoint-BdrRigzP.js")
      : void 0;
  let stateMigrations;
  let startupMigrationEnv = process.env;
  let shouldRecordStartupCheckpoint = false;
  let skipPristineStartupStateMigrations = options.skipPristineStartupStateMigrations === true;
  let skipPristineCoreStateMigrations =
    skipPristineStartupStateMigrations || options.skipPristineCoreStateMigrations === true;
  let startupMigrationLease;
  let startupMigrationHeartbeat;
  let startupMigrationHeartbeatError;
  const startupMigrationWarnings = [];
  const noteStartupStateMigrationResult = (result) => {
    startupMigrationWarnings.push(...result.warnings);
    noteStateMigrationResult(result);
  };
  try {
    if (startupCheckpoint && !skipPristineStartupStateMigrations) {
      const { planPristineStartupStateMigrations } = await measureStartupPreflightStep(
        "pristine-state-plan-import",
        () => import("./pristine-startup-state-Ci1cT4YJ.js"),
      );
      const pristineStatePlan = await measureStartupPreflightStep("pristine-state-plan", () =>
        planPristineStartupStateMigrations(process.env),
      );
      skipPristineStartupStateMigrations = pristineStatePlan.skipAllStateMigrations;
      skipPristineCoreStateMigrations ||= pristineStatePlan.skipCoreStateMigrations;
    }
    const stateMigrationsAllowed =
      !stateMigrationsRequested ||
      options.beforeStateMigrations === void 0 ||
      (await options.beforeStateMigrations());
    if (startupCheckpoint && !stateMigrationsAllowed) throwStartupMigrationGuardRejected();
    if (startupCheckpoint) {
      startupMigrationEnv = cloneEnvWithPlatformSemantics(process.env);
      shouldRecordStartupCheckpoint = startupCheckpoint.needsStartupMigrationCheckpoint({
        env: startupMigrationEnv,
      });
      startupMigrationLease = shouldRecordStartupCheckpoint
        ? startupCheckpoint.acquireStartupMigrationLease({ env: startupMigrationEnv })
        : void 0;
      if (startupMigrationLease) {
        startupMigrationHeartbeat = setInterval(() => {
          try {
            startupMigrationLease?.heartbeat();
          } catch (error) {
            startupMigrationHeartbeatError = error;
          }
        }, 6e4);
        startupMigrationHeartbeat.unref?.();
      }
    }
    stateMigrations =
      stateMigrationsRequested &&
      (!startupCheckpoint || shouldRecordStartupCheckpoint) &&
      !skipPristineStartupStateMigrations
        ? await measureStartupPreflightStep("state-migrations-import", loadDoctorStateMigrations)
        : void 0;
    if (stateMigrations && stateMigrationsAllowed) {
      const { autoMigrateLegacyStateDir } = stateMigrations;
      noteStartupStateMigrationResult(
        await measureStartupPreflightStep("state-dir-migrations", () =>
          autoMigrateLegacyStateDir({ env: process.env }),
        ),
      );
    }
    if (options.migrateLegacyConfig !== false) {
      const legacyConfigChanges = await maybeMigrateLegacyConfig();
      if (legacyConfigChanges.length > 0)
        note(legacyConfigChanges.map((entry) => `- ${entry}`).join("\n"), "Doctor changes");
    }
    const readOptions = {
      ...(options.observe === false ? { observe: false } : {}),
      skipPluginValidation: shouldSkipPluginValidationForDoctorConfigPreflight(),
    };
    let snapshot = addDoctorLegacyIssues(
      await measureStartupPreflightStep("config-snapshot", () =>
        readConfigFileSnapshot(readOptions),
      ),
    );
    if (options.repairPrefixedConfig === true && snapshot.exists && !snapshot.valid) {
      if (await recoverConfigFromJsonRootSuffix(snapshot)) {
        note(
          "Removed non-JSON prefix from openclaw.json; original saved as .clobbered.*.",
          "Config",
        );
        snapshot = addDoctorLegacyIssues(await readConfigFileSnapshot(readOptions));
      } else if (
        await recoverConfigFromLastKnownGood({
          snapshot,
          reason: "doctor-invalid-config",
        })
      ) {
        note(
          "Restored openclaw.json from last-known-good; original saved as .clobbered.*.",
          "Config",
        );
        snapshot = addDoctorLegacyIssues(await readConfigFileSnapshot(readOptions));
      }
    }
    const invalidConfigNote =
      options.invalidConfigNote ?? "Config invalid; doctor will run with best-effort config.";
    if (
      invalidConfigNote &&
      snapshot.exists &&
      !snapshot.valid &&
      snapshot.legacyIssues.length === 0
    ) {
      note(invalidConfigNote, "Config");
      noteIncludeConfinementWarning(snapshot);
    }
    const warnings = snapshot.warnings ?? [];
    if (warnings.length > 0)
      note(formatConfigIssueLines(warnings, "-").join("\n"), "Config warnings");
    const baseConfig = snapshot.sourceConfig ?? snapshot.config ?? {};
    const stateMigrationInput = resolveStateMigrationConfigInput({
      snapshot,
      baseConfig,
    });
    const freshConfigGuardAllowed =
      !(stateMigrations !== void 0 || shouldRecordStartupCheckpoint) ||
      !stateMigrationsAllowed ||
      options.beforeStateMigrations === void 0 ||
      (await options.beforeStateMigrations(snapshot));
    if (startupCheckpoint && !freshConfigGuardAllowed) throwStartupMigrationGuardRejected();
    if (stateMigrations && stateMigrationsAllowed && freshConfigGuardAllowed) {
      const {
        autoMigrateLegacyState,
        autoMigrateLegacyPluginDoctorState,
        autoMigrateLegacyTaskStateSidecars,
      } = stateMigrations;
      if (stateMigrationInput) {
        const pluginDoctorOnlyConfig =
          stateMigrationInput.pluginDoctorConfig ?? stateMigrationInput.cfg;
        if (skipPristineCoreStateMigrations && pluginDoctorOnlyConfig)
          noteStartupStateMigrationResult(
            await autoMigrateLegacyPluginDoctorState({
              config: pluginDoctorOnlyConfig,
              env: process.env,
            }),
          );
        else if (stateMigrationInput.cfg) {
          const { repairLegacyCronStoreWithoutPrompt } = await loadDoctorCron();
          noteStartupStateMigrationResult(
            await repairLegacyCronStoreWithoutPrompt({ cfg: stateMigrationInput.cfg }),
          );
          noteStartupStateMigrationResult(
            await autoMigrateLegacyState({
              cfg: stateMigrationInput.cfg,
              ...(stateMigrationInput.pluginDoctorConfig
                ? { pluginDoctorConfig: stateMigrationInput.pluginDoctorConfig }
                : {}),
              env: process.env,
              recoverCorruptTargetStore: options.recoverCorruptTargetStore,
              crossStateDirImports: options.crossStateDirImports,
            }),
          );
        } else if (stateMigrationInput.pluginDoctorConfig) {
          noteStartupStateMigrationResult(
            await autoMigrateLegacyPluginDoctorState({
              config: stateMigrationInput.pluginDoctorConfig,
              env: process.env,
            }),
          );
          noteStartupStateMigrationResult(
            await autoMigrateLegacyTaskStateSidecars({
              env: process.env,
              crossStateDirImports: options.crossStateDirImports,
            }),
          );
        }
      } else
        noteStartupStateMigrationResult(
          await autoMigrateLegacyTaskStateSidecars({
            env: process.env,
            crossStateDirImports: options.crossStateDirImports,
          }),
        );
    }
    if (shouldRecordStartupCheckpoint) {
      if (startupMigrationHeartbeatError)
        throw startupMigrationHeartbeatError instanceof Error
          ? startupMigrationHeartbeatError
          : /* @__PURE__ */ new Error("OpenClaw startup migration lease heartbeat failed.");
      const blockers =
        startupMigrationWarnings.length > 0
          ? []
          : snapshot.valid
            ? await runStartupUpgradeConvergence({
                cfg: baseConfig,
                env: process.env,
              })
            : ['OpenClaw config is invalid; run "openclaw doctor --fix" before startup.'];
      if (startupMigrationWarnings.length > 0 || blockers.length > 0)
        throw new Error(
          formatStartupMigrationFailure({
            warnings: startupMigrationWarnings,
            blockers,
          }),
        );
      startupCheckpoint?.recordSuccessfulStartupMigrations({
        env: startupMigrationEnv,
        lease: startupMigrationLease,
      });
    }
    return {
      snapshot,
      baseConfig,
    };
  } finally {
    if (startupMigrationHeartbeat) clearInterval(startupMigrationHeartbeat);
    startupMigrationLease?.release();
  }
}
//#endregion
export { shouldSkipPluginValidationForDoctorConfigPreflight as n, runDoctorConfigPreflight as t };
