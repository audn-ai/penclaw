import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import fs$1 from "node:fs/promises";
import "./parse-finite-number-Z7n6tXLk.js";
import os from "node:os";
import path from "node:path";
import { Writable } from "node:stream";
import { confirm, isCancel, text } from "@clack/prompts";
import { r as stripAnsi } from "./ansi-D4OHEz5F.js";
import { n as resolveCliName, t as replaceCliName } from "./cli-name-CVj-3DWf.js";
import { n as quoteCmdScriptArg } from "./cmd-argv-BseV0o2O.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { n as inheritOptionFromParent } from "./command-options-Bv6UxUlT.js";
import "./daemon-cli-D5czHub6.js";
import {
  a as installCompletion,
  n as COMPLETION_SKIP_PLUGIN_COMMANDS_ENV,
} from "./completion-runtime-Ck51_Qqg.js";
import { n as mutateConfigFileWithRetry } from "./config-BDv-QbJ6.js";
import {
  c as normalizePluginsConfig,
  l as resolveEffectiveEnableState,
} from "./config-state-C1Qyxaws.js";
import {
  i as GATEWAY_SERVICE_RUNTIME_PID_ENV,
  m as resolveGatewayWindowsTaskName,
  p as resolveGatewaySystemdServiceName,
  u as resolveGatewayLaunchAgentLabel,
} from "./constants-obO8goqF.js";
import { t as createLowDiskSpaceWarning } from "./disk-space-CzASwJhY.js";
import { t as doctorCommand } from "./doctor-BP8aRKL7.js";
import {
  r as ensureCompletionCacheExists,
  t as checkShellCompletionStatus,
} from "./doctor-completion-CCbtOaHX.js";
import { t as DOCTOR_DISABLE_CROSS_STATE_DIR_IMPORTS_ENV } from "./doctor-invocation-C25PAPM1.js";
import { r as resolveConfigEnvVars } from "./env-substitution-BDfwDlDU.js";
import { n as runExec, r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import { v as pathExists } from "./fs-safe-RNq3oO57.js";
import { i as resolveGatewayInstallEntrypoint } from "./gateway-entrypoint-Cmek2XHM.js";
import { t as formatHelpExamples } from "./help-format-CAcwboTs.js";
import { c as resolveUserPath, o as resolveRequiredHomeDir } from "./home-dir-DxrrpDft.js";
import { c as resolveConfigIncludes } from "./includes-C1dGj2Ja.js";
import { n as runDaemonInstall } from "./install-BieUoHWw.js";
import { r as commitPluginInstallRecordsWithConfig } from "./install-record-commit-BKVujmT7.js";
import { t as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-D7CXgzhH.js";
import {
  a as withPluginInstallRecords,
  o as withoutPluginInstallRecords,
  s as writePersistedInstalledPluginIndexInstallRecords,
} from "./installed-plugin-index-records-BP7rp3ti.js";
import {
  R as asResolvedSourceConfig,
  m as readSourceConfigBestEffort,
  o as parseConfigJson5,
  tt as createPreUpdateConfigSnapshot,
  u as readConfigFileSnapshot,
  z as asRuntimeConfig,
} from "./io-B3ne6NxF.js";
import { n as formatConfigIssueLines } from "./issue-format-IJKFr2SL.js";
import { l as writeJson } from "./json-7OTJmMaB.js";
import { a as readJsonIfExists } from "./json-files-CTWRDHag.js";
import { t as disableCurrentOpenClawUpdateLaunchdJob } from "./launchd-CNqS8gSo.js";
import { a as recoverInstalledLaunchAgent, t as runDaemonRestart } from "./lifecycle-BbKx8cja.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import {
  i as resolveTrustedSourceLinkedOfficialNpmSpec,
  r as resolveTrustedSourceLinkedOfficialClawHubSpec,
} from "./manifest-registry-CXy9BBfE.js";
import { n as assertConfigWriteAllowedInCurrentMode } from "./nix-mode-write-guard-e6xDJfpJ.js";
import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import { t as resolveOpenClawPackageRoot } from "./openclaw-root-DSkQ6e_8.js";
import { n as readPackageName, r as readPackageVersion } from "./package-json-pCn6I6Ni.js";
import {
  f as resolveGatewayPort,
  n as DEFAULT_GATEWAY_PORT,
  p as resolveIncludeRoots,
  t as CONFIG_PATH,
} from "./paths-DEklnbzU.js";
import { t as listPersistedBundledPluginLocationBridges } from "./plugins-location-bridges-GGlgWM3O.js";
import {
  a as resolveBundleInstallRecordPayload,
  i as hasNativePackageInstallPayload,
  o as validateBundleInstallRecordPayload,
  r as runPostCorePluginConvergence,
  t as convergenceWarningsToOutcomes,
} from "./post-core-plugin-convergence-BVNvidpZ.js";
import { n as printResult, t as createUpdateProgress } from "./progress-Dhq6LZEY.js";
import { t as selectStyled } from "./prompt-select-styled-w98xOWqw.js";
import { n as stylePromptMessage } from "./prompt-style-BQVvtDcR.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { n as refreshPluginRegistryAfterConfigMutation } from "./registry-refresh-XzeGvhvw.js";
import {
  a as renderRestartDiagnostics,
  c as waitForGatewayHealthyRestart,
  o as terminateStaleGatewayPids,
} from "./restart-health-DjD15GdD.js";
import {
  i as resolveGatewayRestartLogPath,
  n as renderPosixRestartLogSetup,
  o as shellEscapeRestartLogValue,
} from "./restart-logs-D5D9y8VP.js";
import { u as trimLogTail } from "./restart-sentinel-CJp3hEwi.js";
import { r as getSelfAndAncestorPidsSync } from "./restart-stale-pids-C3MK7Phb.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { a as parseSemver, i as nodeVersionSatisfiesEngine } from "./runtime-guard-BFPw9ugu.js";
import { t as sanitizeTerminalText } from "./safe-text-DiGQuw-e.js";
import {
  c as resumeScheduledTaskAutoStartAfterUpdate,
  d as suspendScheduledTaskAutoStartForUpdate,
} from "./schtasks-BnFuQtB2.js";
import { a as resolveGatewayService, i as readGatewayServiceState } from "./service-Dw37Ek79.js";
import { t as summarizeGatewayServiceLayout } from "./service-layout-Djhk2cQN.js";
import {
  n as registerSignalExitGate,
  r as waitForSignalExitBarriers,
  t as registerSignalExitBarrier,
} from "./signal-exit-barrier-C0rFK2ZS.js";
import {
  i as resolveUpdateAvailability,
  n as formatUpdateOneLiner,
  t as formatUpdateAvailableHint,
} from "./status.update-gnpRVvCh.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { n as renderTable, t as getTerminalTableWidth } from "./table-quSzXaPg.js";
import { r as theme } from "./theme-vjDs9tao.js";
import {
  a as channelToNpmTag,
  d as resolveRegistryUpdateChannel,
  f as resolveUpdateChannelDisplay,
  i as UPDATE_EFFECTIVE_CHANNEL_ENV,
  l as normalizeUpdateChannel,
  o as formatUpdateChannelLabel,
  r as EXTENDED_STABLE_TAG_UNSUPPORTED_REASON,
  u as resolveEffectiveUpdateChannel,
} from "./update-channels-CQNa2YMG.js";
import {
  i as fetchNpmTagVersion,
  n as compareSemverStrings,
  o as resolveExtendedStablePackage,
  r as fetchNpmPackageTargetStatus,
  s as resolveNpmChannelTag,
  t as checkUpdateStatus,
} from "./update-check-DaMnBu3x.js";
import {
  c as writeControlPlaneUpdateRestartSentinel,
  i as buildControlPlaneUpdateRestartHealthPendingResult,
  o as markControlPlaneUpdateRestartSentinelFailure,
  s as readControlPlaneUpdateSentinelMeta,
} from "./update-control-plane-sentinel-DS3ELeta.js";
import {
  a as updateNpmInstalledPlugins,
  i as syncPluginsForUpdateChannel,
  t as isClawHubTrustSkippedOutcome,
} from "./update-Dap2BNUK.js";
import {
  i as consumeUpdatePostInstallDoctorResult,
  o as createUpdatePostInstallDoctorResultPath,
  r as UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV,
} from "./update-doctor-result-BDmbyXXJ.js";
import { n as cleanupStaleManagedServiceUpdateHandoffs } from "./update-managed-service-handoff-cleanup-DiOrEHy2.js";
import {
  a as UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE_ENV,
  i as UPDATE_PARENT_ALLOWS_GATEWAY_SERVICE_REPAIR_ENV,
  o as UPDATE_PARENT_SUPPORTS_GATEWAY_RESTART_ENV,
  r as UPDATE_PARENT_ALLOWS_GATEWAY_ACTIVATION_ENV,
  t as UPDATE_DEFER_CONFIGURED_PLUGIN_INSTALL_REPAIR_ENV,
} from "./update-phase-RYqcMEby.js";
import { t as POST_CORE_UPDATE_SOURCE_CONFIG_PATH_ENV } from "./update-post-core-context-CcP9rLhB.js";
import {
  a as runGlobalPackageUpdateSteps,
  c as createGlobalInstallEnv,
  d as globalInstallArgs,
  f as resolveGlobalInstallSpec,
  h as normalizePackageTagInput,
  i as markPackagePostInstallDoctorAdvisory,
  l as detectGlobalInstallManagerByPresence,
  m as resolvePnpmGlobalDirFromGlobalRoot,
  o as canResolveRegistryVersionForPackageTarget,
  p as resolveGlobalInstallTarget,
  r as runGatewayUpdate,
  s as cleanupGlobalRenameDirs,
  t as resolveUpdateDoctorExecutionPolicy,
  u as detectGlobalInstallManagerForRoot,
} from "./update-runner-DMOEFPUe.js";
import { l as pathExists$1 } from "./utils-DtcDeqWS.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
import {
  a as getWindowsSystem32ExePath,
  t as getWindowsCmdExePath,
} from "./windows-install-roots-Cnzi1kc9.js";
//#region src/cli/update-cli/shared.ts
const INVALID_TIMEOUT_ERROR = "--timeout must be a positive integer (seconds)";
const MAX_SAFE_TIMEOUT_SECONDS = Math.floor(Number.MAX_SAFE_INTEGER / 1e3);
/** Parse a CLI timeout in seconds, exiting through the runtime on invalid input. */
function parseTimeoutMsOrExit(timeout) {
  if (timeout === void 0) return;
  const seconds = parseStrictPositiveInteger(timeout.trim());
  if (seconds === void 0 || seconds > MAX_SAFE_TIMEOUT_SECONDS) {
    defaultRuntime.error(INVALID_TIMEOUT_ERROR);
    defaultRuntime.exit(1);
    return null;
  }
  return seconds * 1e3;
}
const OPENCLAW_REPO_URL = "https://github.com/openclaw/openclaw.git";
const MAX_LOG_CHARS = 8e3;
const DEFAULT_PACKAGE_NAME = "openclaw";
const CORE_PACKAGE_NAMES = /* @__PURE__ */ new Set([DEFAULT_PACKAGE_NAME]);
/** Normalize a CLI tag/version/spec into the npm target form accepted by update flows. */
function normalizeTag(value) {
  return normalizePackageTagInput(value, ["openclaw", DEFAULT_PACKAGE_NAME]);
}
function normalizeVersionTag(tag) {
  const trimmed = tag.trim();
  if (!trimmed) return null;
  const cleaned = trimmed.startsWith("v") ? trimmed.slice(1) : trimmed;
  return parseSemver(cleaned) ? cleaned : null;
}
/** Resolve an npm dist-tag or explicit version into a concrete package version. */
async function resolveTargetVersion(tag, timeoutMs, options = {}) {
  if (!canResolveRegistryVersionForPackageTarget(tag)) return null;
  const direct = normalizeVersionTag(tag);
  if (direct) return direct;
  return (
    (
      await fetchNpmTagVersion({
        tag,
        timeoutMs,
        spec: options.spec,
        command: options.command,
        cwd: options.cwd,
        env: options.env,
      })
    ).version ?? null
  );
}
/** Return true when `root` is a local git checkout directory. */
async function isGitCheckout(root) {
  try {
    await fs$1.stat(path.join(root, ".git"));
    return true;
  } catch {
    return false;
  }
}
async function isCorePackage(root) {
  const name = await readPackageName(root);
  return Boolean(name && CORE_PACKAGE_NAMES.has(name));
}
/** Return true only for existing directories with no entries. */
async function isEmptyDir(targetPath) {
  try {
    return (await fs$1.readdir(targetPath)).length === 0;
  } catch {
    return false;
  }
}
/** Resolve the checkout path used by source-based self-update. */
function resolveGitInstallDir() {
  const override = process.env.OPENCLAW_GIT_DIR?.trim();
  if (override) return path.resolve(override);
  return resolveDefaultGitDir();
}
function resolveDefaultGitDir() {
  const home = resolveRequiredHomeDir(process.env, os.homedir);
  if (home.startsWith("/")) return path.posix.join(home, "openclaw");
  return path.join(home, "openclaw");
}
/** Prefer the current Node executable, falling back to `node` when run through another shim. */
function resolveNodeRunner() {
  const base = normalizeLowercaseStringOrEmpty(path.basename(process.execPath));
  if (base === "node" || base === "node.exe") return process.execPath;
  return "node";
}
/** Locate the installed OpenClaw package root that should receive update operations. */
async function resolveUpdateRoot() {
  return (
    (await resolveOpenClawPackageRoot({
      moduleUrl: import.meta.url,
      argv1: process.argv[1],
      cwd: process.cwd(),
    })) ?? process.cwd()
  );
}
/** Run one update subprocess and report bounded stdout/stderr tails to progress listeners. */
async function runUpdateStep(params) {
  const command = params.argv.join(" ");
  params.progress?.onStepStart?.({
    name: params.name,
    command,
    index: 0,
    total: 0,
  });
  const started = Date.now();
  const res = await runCommandWithTimeout(params.argv, {
    cwd: params.cwd,
    env: params.env,
    timeoutMs: params.timeoutMs,
  });
  const durationMs = Date.now() - started;
  const stderrTail = trimLogTail(res.stderr, MAX_LOG_CHARS);
  params.progress?.onStepComplete?.({
    name: params.name,
    command,
    index: 0,
    total: 0,
    durationMs,
    exitCode: res.code,
    stderrTail,
    signal: res.signal,
    killed: res.killed,
    termination: res.termination,
  });
  return {
    name: params.name,
    command,
    cwd: params.cwd ?? process.cwd(),
    durationMs,
    exitCode: res.code,
    stdoutTail: trimLogTail(res.stdout, MAX_LOG_CHARS),
    stderrTail,
    signal: res.signal,
    killed: res.killed,
    termination: res.termination,
  };
}
/** Ensure the configured source-update directory exists and points at an OpenClaw checkout. */
async function ensureGitCheckout(params) {
  const gitEnv = params.env ?? (await createGlobalInstallEnv());
  if (!(await pathExists$1(params.dir))) {
    await fs$1.mkdir(path.dirname(params.dir), { recursive: true });
    return await runUpdateStep({
      name: "git clone",
      argv: ["git", "clone", OPENCLAW_REPO_URL, params.dir],
      env: gitEnv,
      timeoutMs: params.timeoutMs,
      progress: params.progress,
    });
  }
  if (!(await isGitCheckout(params.dir))) {
    if (!(await isEmptyDir(params.dir)))
      throw new Error(
        `OPENCLAW_GIT_DIR points at a non-git directory: ${params.dir}. Set OPENCLAW_GIT_DIR to an empty folder or an openclaw checkout.`,
      );
    return await runUpdateStep({
      name: "git clone",
      argv: ["git", "clone", OPENCLAW_REPO_URL, params.dir],
      cwd: params.dir,
      env: gitEnv,
      timeoutMs: params.timeoutMs,
      progress: params.progress,
    });
  }
  if (!(await isCorePackage(params.dir)))
    throw new Error(`OPENCLAW_GIT_DIR does not look like a core checkout: ${params.dir}.`);
  return null;
}
/** Detect the package manager that owns a global/package OpenClaw install. */
async function resolveGlobalManager(params) {
  const runCommand = createGlobalCommandRunner();
  if (params.installKind === "package") {
    const detected = await detectGlobalInstallManagerForRoot(
      runCommand,
      params.root,
      params.timeoutMs,
    );
    if (detected) return detected;
  }
  return (await detectGlobalInstallManagerByPresence(runCommand, params.timeoutMs)) ?? "npm";
}
const COMPLETION_CACHE_WRITE_TIMEOUT_MS = 3e4;
const COMPLETION_CACHE_MANUAL_REFRESH_HINT =
  "Shell tab-completion may be stale; refresh manually with: openclaw completion --write-state";
/** Best-effort refresh of shell completion state after a successful update. */
async function tryWriteCompletionCache(root, jsonMode) {
  const binPath = path.join(root, "openclaw.mjs");
  if (!(await pathExists$1(binPath))) return;
  const result = spawnSync(resolveNodeRunner(), [binPath, "completion", "--write-state"], {
    cwd: root,
    env: {
      ...process.env,
      [COMPLETION_SKIP_PLUGIN_COMMANDS_ENV]: "1",
    },
    encoding: "utf-8",
    timeout: COMPLETION_CACHE_WRITE_TIMEOUT_MS,
  });
  if (result.error) {
    if (!jsonMode) {
      const reason =
        result.error.code === "ETIMEDOUT"
          ? `timed out after ${COMPLETION_CACHE_WRITE_TIMEOUT_MS / 1e3}s`
          : String(result.error);
      defaultRuntime.log(
        theme.warn(
          `Completion cache update failed: ${reason}. ${COMPLETION_CACHE_MANUAL_REFRESH_HINT}`,
        ),
      );
    }
    return;
  }
  if (result.status !== 0 && !jsonMode) {
    const stderr = (result.stderr ?? "").trim();
    const detail = stderr ? ` (${stderr})` : "";
    defaultRuntime.log(
      theme.warn(
        `Completion cache update failed${detail}. ${COMPLETION_CACHE_MANUAL_REFRESH_HINT}`,
      ),
    );
  }
}
/** Adapter used by global-install detection helpers to execute bounded subprocess probes. */
function createGlobalCommandRunner() {
  return async (argv, options) => {
    const res = await runCommandWithTimeout(argv, options);
    return {
      stdout: res.stdout,
      stderr: res.stderr,
      code: res.code,
    };
  };
}
//#endregion
//#region src/cli/update-cli/status.ts
function formatGitStatusLine(params) {
  const shortSha = params.sha ? params.sha.slice(0, 8) : null;
  const branch = params.branch && params.branch !== "HEAD" ? params.branch : null;
  const tag = params.tag;
  return [
    branch ?? (tag ? "detached" : "git"),
    tag ? `tag ${tag}` : null,
    shortSha ? `@ ${shortSha}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
}
/** Print update status in JSON or table form for scripts and humans. */
async function updateStatusCommand(opts) {
  const timeoutMs = parseTimeoutMsOrExit(opts.timeout);
  if (timeoutMs === null) return;
  const root = await resolveUpdateRoot();
  const configChannel = normalizeUpdateChannel(
    (await readSourceConfigBestEffort()).update?.channel,
  );
  const update = await checkUpdateStatus({
    root,
    timeoutMs: timeoutMs ?? 3500,
    fetchGit: true,
    includeRegistry: true,
    registryChannel: resolveRegistryUpdateChannel({
      configChannel,
      currentVersion: VERSION,
    }),
  });
  const channelInfo = resolveUpdateChannelDisplay({
    configChannel,
    currentVersion: VERSION,
    installKind: update.installKind,
    gitTag: update.git?.tag ?? null,
    gitBranch: update.git?.branch ?? null,
  });
  const channelLabel = channelInfo.label;
  const gitLabel =
    update.installKind === "git"
      ? formatGitStatusLine({
          branch: update.git?.branch ?? null,
          tag: update.git?.tag ?? null,
          sha: update.git?.sha ?? null,
        })
      : null;
  const updateAvailability = resolveUpdateAvailability(update);
  const updateLine = formatUpdateOneLiner(update).replace(/^Update:\s*/i, "");
  if (opts.json) {
    defaultRuntime.writeJson({
      update,
      channel: {
        value: channelInfo.channel,
        source: channelInfo.source,
        label: channelLabel,
        config: configChannel,
      },
      availability: updateAvailability,
    });
    return;
  }
  const tableWidth = getTerminalTableWidth();
  const rows = [
    {
      Item: "Install",
      Value:
        update.installKind === "git"
          ? `git (${update.root ?? "unknown"})`
          : update.installKind === "package"
            ? update.packageManager
            : "unknown",
    },
    {
      Item: "Channel",
      Value: channelLabel,
    },
    ...(gitLabel
      ? [
          {
            Item: "Git",
            Value: gitLabel,
          },
        ]
      : []),
    {
      Item: "Update",
      Value: updateAvailability.available ? theme.warn(`available · ${updateLine}`) : updateLine,
    },
  ];
  defaultRuntime.log(theme.heading("OpenClaw update status"));
  defaultRuntime.log("");
  defaultRuntime.log(
    renderTable({
      width: tableWidth,
      columns: [
        {
          key: "Item",
          header: "Item",
          minWidth: 10,
        },
        {
          key: "Value",
          header: "Value",
          flex: true,
          minWidth: 24,
        },
      ],
      rows,
    }).trimEnd(),
  );
  defaultRuntime.log("");
  const updateHint = formatUpdateAvailableHint(update);
  if (updateHint) defaultRuntime.log(theme.warn(updateHint));
}
//#endregion
//#region src/cli/update-cli/restart-helper.ts
/**
 * Shell-escape a string for embedding in single-quoted shell arguments.
 * Replaces every `'` with `'\''` (end quote, escaped quote, resume quote).
 * For batch scripts, validates against special characters instead.
 */
function shellEscape(value) {
  return value.replace(/'/g, "'\\''");
}
/** Validates a task name is safe for embedding in Windows restart scripts. */
function isWindowsTaskNameSafe(value) {
  return /^[A-Za-z0-9 _\-().]+$/.test(value);
}
function powerShellSingleQuote(value) {
  return `'${value.replace(/'/g, "''")}'`;
}
function resolveSystemdUnit(env) {
  const override = normalizeOptionalString(env.OPENCLAW_SYSTEMD_UNIT);
  if (override) return override.endsWith(".service") ? override : `${override}.service`;
  return `${resolveGatewaySystemdServiceName(env.OPENCLAW_PROFILE)}.service`;
}
function resolveLaunchdLabel(env) {
  const override = normalizeOptionalString(env.OPENCLAW_LAUNCHD_LABEL);
  if (override) return override;
  return resolveGatewayLaunchAgentLabel(env.OPENCLAW_PROFILE);
}
function resolveWindowsTaskName(env) {
  const override = env.OPENCLAW_WINDOWS_TASK_NAME?.trim();
  if (override) return override;
  return resolveGatewayWindowsTaskName(env.OPENCLAW_PROFILE);
}
/**
 * Prepares a standalone script to restart the gateway service.
 * This script is written to a temporary directory and does not depend on
 * the installed package files, ensuring restart capability even if the
 * update process temporarily removes or corrupts installation files.
 */
async function prepareRestartScript(env = process.env, gatewayPort = DEFAULT_GATEWAY_PORT) {
  const timestamp = Date.now();
  const platform = process.platform;
  let scriptContent;
  let filename;
  try {
    if (platform === "linux") {
      const escaped = shellEscape(resolveSystemdUnit(env));
      const logSetup = renderPosixRestartLogSetup({
        ...process.env,
        ...env,
      });
      filename = `openclaw-restart-${timestamp}.sh`;
      scriptContent = `#!/bin/sh
# Standalone restart script — survives parent process termination.
# Wait briefly to ensure file locks are released after update.
sleep 1
exec 3>&2
${logSetup}
printf '[%s] openclaw restart attempt source=update target=%s\\n' "$(date -u +%FT%TZ)" '${escaped}' >&2
if systemctl --user is-active --quiet '${escaped}' || systemctl --user is-enabled --quiet '${escaped}'; then
  if systemctl --user restart '${escaped}'; then
    status=0
    printf '[%s] openclaw restart done source=update\\n' "$(date -u +%FT%TZ)" >&2
  else
    status=$?
    printf '[%s] openclaw restart failed source=update status=%s\\n' "$(date -u +%FT%TZ)" "$status" >&2
  fi
elif systemctl is-active --quiet '${escaped}' || systemctl is-enabled --quiet '${escaped}'; then
  status=78
  printf '[%s] system-scoped openclaw gateway unit detected; update cannot restart it without sudo. Run: sudo systemctl restart %s\\n' "$(date -u +%FT%TZ)" '${escaped}' >&2
  printf '[%s] system-scoped openclaw gateway unit detected; update cannot restart it without sudo. Run: sudo systemctl restart %s\\n' "$(date -u +%FT%TZ)" '${escaped}' >&3 2>/dev/null || true
else
  if systemctl --user restart '${escaped}'; then
    status=0
    printf '[%s] openclaw restart done source=update\\n' "$(date -u +%FT%TZ)" >&2
  else
    status=$?
    printf '[%s] openclaw restart failed source=update status=%s\\n' "$(date -u +%FT%TZ)" "$status" >&2
  fi
fi
# Self-cleanup
script_dir=$(dirname "$0")
exec 3>&-
rm -f "$0"
rmdir "$script_dir" 2>/dev/null || true
exit "$status"
`;
    } else if (platform === "darwin") {
      const label = resolveLaunchdLabel(env);
      const escaped = shellEscape(label);
      const uid = process.getuid ? process.getuid() : 501;
      const home = normalizeOptionalString(env.HOME) || process.env.HOME || os.homedir();
      const escapedPlistPath = shellEscape(
        path.join(home, "Library", "LaunchAgents", `${label}.plist`),
      );
      const logSetup = renderPosixRestartLogSetup({
        ...process.env,
        ...env,
      });
      filename = `openclaw-restart-${timestamp}.sh`;
      scriptContent = `#!/bin/sh
# Standalone restart script — survives parent process termination.
# Wait briefly to ensure file locks are released after update.
sleep 1
# Capture launchctl output so bootstrap/kickstart failures leave a durable
# audit trail. Log setup is best-effort: restart must still run if the log path
# is temporarily unavailable.
${logSetup}
printf '[%s] openclaw restart attempt source=update target=%s\\n' "$(date -u +%FT%TZ)" '${shellEscapeRestartLogValue(label)}' >&2
# Try kickstart first (works when the service is still registered).
# If it fails (e.g. after bootout), clear any persisted disabled state,
# then re-register via bootstrap. Bootstrap loads RunAtLoad agents, so the
# fallback must not immediately kickstart -k the freshly spawned gateway.
# The final status is captured
# before self-cleanup so a genuine failure remains observable.
status=0
if ! launchctl kickstart -k 'gui/${uid}/${escaped}'; then
  launchctl enable 'gui/${uid}/${escaped}'
  if launchctl bootstrap 'gui/${uid}' '${escapedPlistPath}'; then
    status=0
  else
    launchctl kickstart -k 'gui/${uid}/${escaped}'
    status=$?
  fi
fi
if [ "$status" -eq 0 ]; then
  printf '[%s] openclaw restart done source=update\\n' "$(date -u +%FT%TZ)" >&2
else
  printf '[%s] openclaw restart failed source=update status=%s\\n' "$(date -u +%FT%TZ)" "$status" >&2
fi
# Self-cleanup (log is retained under the OpenClaw state logs directory).
script_dir=$(dirname "$0")
rm -f "$0"
rmdir "$script_dir" 2>/dev/null || true
exit "$status"
`;
    } else if (platform === "win32") {
      const taskName = resolveWindowsTaskName(env);
      if (!isWindowsTaskNameSafe(taskName)) return null;
      const port =
        Number.isFinite(gatewayPort) && gatewayPort > 0 ? gatewayPort : DEFAULT_GATEWAY_PORT;
      const quotedLogPath = powerShellSingleQuote(
        resolveGatewayRestartLogPath({
          ...process.env,
          ...env,
        }),
      );
      const quotedTaskName = powerShellSingleQuote(taskName);
      filename = `openclaw-restart-${timestamp}.cmd`;
      scriptContent = `@echo off
REM Standalone restart script - survives parent process termination.
REM Keep this as a cmd wrapper so Group Policy script execution policies
REM cannot block the update restart handoff before schtasks.exe runs.
setlocal
set "OPENCLAW_RESTART_SCRIPT=%~f0"
set "OPENCLAW_RESTART_SCRIPT_DIR=%~dp0."
powershell -NoProfile -ExecutionPolicy Bypass -Command "$p=$env:OPENCLAW_RESTART_SCRIPT; $s=Get-Content -Raw -LiteralPath $p; $m='# POWERSHELL'; $i=$s.IndexOf($m); if ($i -lt 0) { exit 1 }; Invoke-Expression $s.Substring($i)"
set "status=%ERRORLEVEL%"
del "%~f0" >nul 2>&1
rmdir "%OPENCLAW_RESTART_SCRIPT_DIR%" >nul 2>&1
exit /b %status%
# POWERSHELL
# Wait briefly to ensure file locks are released after update.
$ErrorActionPreference = "Continue"
Start-Sleep -Seconds 2

$logPath = ${quotedLogPath}
try {
  $logDir = Split-Path -Parent $logPath
  New-Item -ItemType Directory -Path $logDir -Force | Out-Null
  Add-Content -LiteralPath $logPath -Value "[$(Get-Date -Format o)] openclaw restart log initialized"
} catch {
  # Restart should still run if log setup is unavailable.
}

function Write-RestartLog {
  param([string]$Message)
  try {
    Add-Content -LiteralPath $logPath -Value "[$(Get-Date -Format o)] $Message"
  } catch {
  }
}

function Join-OpenClawProcessArguments {
  param([string[]]$Arguments)
  ($Arguments | ForEach-Object {
    if ($_ -match "\\s") {
      '"' + $_ + '"'
    } else {
      $_
    }
  }) -join " "
}

function Invoke-OpenClawSchtasksWithTimeout {
  param(
    [string[]]$Arguments,
    [int]$TimeoutSeconds
  )
  $process = $null
  try {
    $startInfo = [System.Diagnostics.ProcessStartInfo]::new()
    $startInfo.FileName = "schtasks.exe"
    $startInfo.Arguments = Join-OpenClawProcessArguments -Arguments $Arguments
    $startInfo.UseShellExecute = $false
    $startInfo.RedirectStandardOutput = $true
    $startInfo.RedirectStandardError = $true
    $process = [System.Diagnostics.Process]::Start($startInfo)
    if (-not $process.WaitForExit($TimeoutSeconds * 1000)) {
      try {
        $process.Kill()
      } catch {
      }
      Write-RestartLog "openclaw restart schtasks timeout source=update args=$($Arguments -join ' ')"
      return 124
    }
    $stdout = $process.StandardOutput.ReadToEnd()
    $stderr = $process.StandardError.ReadToEnd()
    if ($stdout) {
      Write-RestartLog $stdout.Trim()
    }
    if ($stderr) {
      Write-RestartLog $stderr.Trim()
    }
    return $process.ExitCode
  } catch {
    Write-RestartLog "openclaw restart schtasks failed source=update args=$($Arguments -join ' ') error=$($_.Exception.Message)"
    return 1
  }
}

function Get-OpenClawScheduledTaskState {
  param([string]$TaskName)
  try {
    $task = Get-ScheduledTask -TaskName $TaskName -ErrorAction Stop
    if ($task -and $task.State) {
      return [string]$task.State
    }
  } catch {
  }

  try {
    $queryOutput = & schtasks.exe /Query /TN $TaskName /FO LIST 2>$null
    foreach ($line in $queryOutput) {
      if ($line -match "^\\s*Status:\\s*(.+?)\\s*$") {
        return $Matches[1]
      }
    }
  } catch {
  }

  return "Unknown"
}

function Get-OpenClawListenerPids {
  param([int]$Port)
  $listenerPids = @()

  try {
    if (Get-Command Get-NetTCPConnection -ErrorAction SilentlyContinue) {
      $listenerPids += Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
        ForEach-Object { [int]$_.OwningProcess }
    }
  } catch {
  }

  if ($listenerPids.Count -eq 0) {
    try {
      $portPattern = [regex]::Escape(":$Port")
      $linePattern = "^\\s*TCP\\s+\\S+$portPattern\\s+\\S+\\s+LISTENING\\s+(\\d+)\\s*$"
      & netstat.exe -ano -p tcp 2>$null | ForEach-Object {
        if ($_ -match $linePattern) {
          $listenerPids += [int]$Matches[1]
        }
      }
    } catch {
    }
  }

  $listenerPids | Sort-Object -Unique
}

function Invoke-OpenClawStartupLauncher {
  $launcherPath = Join-Path $env:USERPROFILE ".openclaw\\gateway.cmd"
  if (-not (Test-Path -LiteralPath $launcherPath)) {
    Write-RestartLog "openclaw restart startup launcher missing source=update path=$launcherPath"
    return 1
  }

  try {
    Start-Process -FilePath $launcherPath -WindowStyle Hidden | Out-Null
    Write-RestartLog "openclaw restart launched startup fallback source=update path=$launcherPath"
    return 0
  } catch {
    Write-RestartLog "openclaw restart startup fallback failed source=update error=$($_.Exception.Message)"
    return 1
  }
}

$taskName = ${quotedTaskName}
$port = ${port}
Write-RestartLog "openclaw restart attempt source=update target=$taskName"

$taskState = Get-OpenClawScheduledTaskState -TaskName $taskName
if ($taskState -eq "Running") {
  $endStatus = Invoke-OpenClawSchtasksWithTimeout -Arguments @("/End", "/TN", $taskName) -TimeoutSeconds 10
  if ($endStatus -ne 0) {
    Write-RestartLog "openclaw restart schtasks end did not complete cleanly source=update status=$endStatus"
  }
} else {
  Write-RestartLog "openclaw restart skipped schtasks end source=update state=$taskState"
}

for ($attempt = 1; $attempt -le 10; $attempt++) {
  $listeners = @(Get-OpenClawListenerPids -Port $port)
  if ($listeners.Count -eq 0) {
    break
  }

  if ($attempt -eq 10) {
    foreach ($listenerPid in $listeners) {
      try {
        Stop-Process -Id $listenerPid -Force -ErrorAction Stop
        Write-RestartLog "openclaw restart killed stale listener source=update pid=$listenerPid"
      } catch {
        Write-RestartLog "openclaw restart failed to kill stale listener source=update pid=$listenerPid error=$($_.Exception.Message)"
      }
    }
    break
  }

  Start-Sleep -Seconds 1
}

$status = Invoke-OpenClawSchtasksWithTimeout -Arguments @("/Run", "/TN", $taskName) -TimeoutSeconds 30
if ($status -ne 0) {
  $status = Invoke-OpenClawStartupLauncher
}
if ($status -eq 0) {
  Write-RestartLog "openclaw restart done source=update"
} else {
  Write-RestartLog "openclaw restart failed source=update status=$status"
}

exit $status
`;
    } else return null;
    const scriptDir = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-restart-"));
    const scriptPath = path.join(scriptDir, filename);
    try {
      await fs$1.writeFile(scriptPath, scriptContent, {
        mode: 493,
        flag: "wx",
      });
    } catch (error) {
      await fs$1
        .rm(scriptDir, {
          recursive: true,
          force: true,
        })
        .catch(() => {});
      throw error;
    }
    return scriptPath;
  } catch {
    return null;
  }
}
/**
 * Executes the prepared restart script as a **detached** process.
 *
 * The script must outlive the CLI process because the CLI itself is part
 * of the service being restarted — `systemctl restart` / `launchctl
 * kickstart -k` will terminate the current process tree.  Using
 * `spawn({ detached: true })` + `unref()` ensures the script survives
 * the parent's exit.
 *
 * Resolves immediately after spawning; the script runs independently.
 */
async function runRestartScript(scriptPath) {
  const isWindows = process.platform === "win32";
  const file = isWindows ? getWindowsCmdExePath() : "/bin/sh";
  const args = isWindows ? ["/d", "/s", "/c", quoteCmdScriptArg(scriptPath)] : [scriptPath];
  try {
    const child = spawn(file, args, {
      detached: true,
      stdio: "ignore",
      windowsHide: true,
    });
    child.on("error", () => {});
    child.unref();
  } catch {}
}
//#endregion
//#region src/cli/update-cli/suppress-deprecations.ts
/**
 * Suppress Node.js deprecation warnings.
 *
 * On Node.js v23+ `process.noDeprecation` may be a read-only property
 * (defined via a getter on the prototype with no setter), so the
 * assignment can throw. We fall back to the environment variable which
 * achieves the same effect.
 */
function suppressDeprecations() {
  try {
    process.noDeprecation = true;
  } catch {}
  process.env.NODE_NO_WARNINGS = "1";
}
//#endregion
//#region src/cli/update-cli/update-command-config.ts
const PRE_UPDATE_CONFIG_SNAPSHOT_MAX_AGE_MS = 360 * 60 * 1e3;
async function createUpdateConfigSnapshot() {
  await createPreUpdateConfigSnapshot({
    configPath: CONFIG_PATH,
    fs: {
      writeFile: fs$1.writeFile,
      readFile: fs$1.readFile,
      existsSync,
    },
  });
}
function normalizePluginInstallRecordMap(value) {
  if (!isRecord(value)) return {};
  const records = {};
  for (const [pluginId, record] of Object.entries(value).toSorted(([left], [right]) =>
    left.localeCompare(right),
  ))
    if (isRecord(record) && typeof record.source === "string")
      records[pluginId] = structuredClone(record);
  return records;
}
function normalizeChannelConfigMap(value) {
  if (!isRecord(value)) return null;
  return value;
}
function normalizeDirectAuthoredChannelConfigMap(value) {
  const channels = normalizeChannelConfigMap(value);
  if (!channels || Object.hasOwn(channels, "$include")) return null;
  return channels;
}
function restorePreUpdateChannelModelOverrides(params) {
  if (params.restoredChannelIds.length === 0)
    return {
      channels: params.channels,
      changed: false,
    };
  const preUpdateModelByChannel = normalizeChannelConfigMap(
    params.preUpdateChannels.modelByChannel,
  );
  if (!preUpdateModelByChannel)
    return {
      channels: params.channels,
      changed: false,
    };
  const currentModelByChannel = normalizeChannelConfigMap(params.channels.modelByChannel) ?? {};
  const restoredModelByChannel = structuredClone(currentModelByChannel);
  let changed = false;
  for (const [providerId, providerOverrides] of Object.entries(preUpdateModelByChannel)) {
    const preUpdateProviderOverrides = normalizeChannelConfigMap(providerOverrides);
    if (!preUpdateProviderOverrides) continue;
    const currentProviderOverrides =
      normalizeChannelConfigMap(restoredModelByChannel[providerId]) ?? {};
    let providerChanged = false;
    for (const channelId of params.restoredChannelIds) {
      if (
        currentProviderOverrides[channelId] !== void 0 ||
        preUpdateProviderOverrides[channelId] === void 0
      )
        continue;
      currentProviderOverrides[channelId] = structuredClone(preUpdateProviderOverrides[channelId]);
      providerChanged = true;
    }
    if (providerChanged) {
      restoredModelByChannel[providerId] = currentProviderOverrides;
      changed = true;
    }
  }
  return changed
    ? {
        channels: {
          ...params.channels,
          modelByChannel: restoredModelByChannel,
        },
        changed: true,
      }
    : {
        channels: params.channels,
        changed: false,
      };
}
function restoreDroppedPreUpdateChannels(snapshot, preUpdateConfig) {
  if (!snapshot.valid || !preUpdateConfig)
    return {
      snapshot,
      changed: false,
    };
  const preUpdateChannels = normalizeChannelConfigMap(preUpdateConfig.sourceConfig.channels);
  if (!preUpdateChannels)
    return {
      snapshot,
      changed: false,
    };
  let restoredChannels = { ...(normalizeChannelConfigMap(snapshot.sourceConfig.channels) ?? {}) };
  const restoredChannelIds = [];
  let restored = false;
  for (const [channelId, channelConfig] of Object.entries(preUpdateChannels)) {
    if (restoredChannels[channelId] !== void 0) continue;
    restoredChannels[channelId] = structuredClone(channelConfig);
    if (channelId !== "modelByChannel") restoredChannelIds.push(channelId);
    restored = true;
  }
  if (!restored)
    return {
      snapshot,
      changed: false,
    };
  restoredChannels = restorePreUpdateChannelModelOverrides({
    channels: restoredChannels,
    preUpdateChannels,
    restoredChannelIds,
  }).channels;
  const authoredChannels = resolveRestoredAuthoredChannels({
    currentChannels: snapshot.sourceConfig.channels,
    currentAuthoredChannels: isRecord(snapshot.parsed)
      ? snapshot.parsed.channels
      : snapshot.sourceConfig.channels,
    preUpdateAuthoredChannels: preUpdateConfig.authoredConfig.channels,
    restoredChannelIds,
  });
  return {
    snapshot: {
      ...createUpdatedConfigSnapshot(snapshot, {
        ...snapshot.sourceConfig,
        channels: restoredChannels,
      }),
      hash: snapshot.hash,
    },
    changed: true,
    ...(authoredChannels !== void 0 ? { authoredChannels } : {}),
  };
}
function hasRestorablePreUpdateChannels(snapshot, preUpdateConfig) {
  if (!snapshot.valid) return false;
  const preUpdateChannels = normalizeChannelConfigMap(preUpdateConfig.sourceConfig.channels);
  if (!preUpdateChannels) return false;
  const postUpdateChannels = normalizeChannelConfigMap(snapshot.sourceConfig.channels) ?? {};
  return Object.keys(preUpdateChannels).some(
    (channelId) => postUpdateChannels[channelId] === void 0,
  );
}
function resolveRestoredAuthoredChannels(params) {
  if (params.preUpdateAuthoredChannels === void 0) return;
  const directAuthoredChannels = normalizeDirectAuthoredChannelConfigMap(
    params.preUpdateAuthoredChannels,
  );
  if (!directAuthoredChannels) {
    const preUpdateAuthoredChannels = normalizeChannelConfigMap(params.preUpdateAuthoredChannels);
    if (!preUpdateAuthoredChannels) return;
    const currentDirectAuthoredChannels = normalizeDirectAuthoredChannelConfigMap(
      params.currentAuthoredChannels,
    );
    if (currentDirectAuthoredChannels)
      return {
        ...structuredClone(preUpdateAuthoredChannels),
        ...structuredClone(currentDirectAuthoredChannels),
      };
    const currentAuthoredChannels = normalizeChannelConfigMap(params.currentAuthoredChannels);
    return !currentAuthoredChannels || Object.keys(currentAuthoredChannels).length === 0
      ? structuredClone(preUpdateAuthoredChannels)
      : void 0;
  }
  const restoredChannels = {
    ...(normalizeDirectAuthoredChannelConfigMap(params.currentAuthoredChannels) ??
      normalizeDirectAuthoredChannelConfigMap(params.currentChannels) ??
      {}),
  };
  let changed = false;
  for (const channelId of params.restoredChannelIds) {
    if (restoredChannels[channelId] !== void 0 || directAuthoredChannels[channelId] === void 0)
      continue;
    restoredChannels[channelId] = structuredClone(directAuthoredChannels[channelId]);
    changed = true;
  }
  const restoredModelOverrides = restorePreUpdateChannelModelOverrides({
    channels: restoredChannels,
    preUpdateChannels: directAuthoredChannels,
    restoredChannelIds: params.restoredChannelIds,
  });
  if (restoredModelOverrides.changed) return restoredModelOverrides.channels;
  return changed ? restoredChannels : void 0;
}
async function persistRequestedUpdateChannel(params) {
  if (!params.requestedChannel || !params.configSnapshot.valid) return params.configSnapshot;
  const storedChannel = normalizeUpdateChannel(params.configSnapshot.config.update?.channel);
  if (params.requestedChannel === storedChannel) return params.configSnapshot;
  const requestedChannel = params.requestedChannel;
  const mutation = await mutateConfigFileWithRetry({
    writeOptions: { skipPluginValidation: true },
    mutate: (draft) => {
      draft.update = {
        ...draft.update,
        channel: requestedChannel,
      };
    },
  });
  return createUpdatedConfigSnapshot(mutation.snapshot, mutation.nextConfig);
}
function createUpdatedConfigSnapshot(snapshot, next) {
  if (!snapshot.valid) return snapshot;
  return {
    ...snapshot,
    hash: void 0,
    parsed: next,
    sourceConfig: asResolvedSourceConfig(next),
    resolved: asResolvedSourceConfig(next),
    runtimeConfig: asRuntimeConfig(next),
    config: asRuntimeConfig(next),
  };
}
async function maybeRepairLegacyConfigForUpdateChannel(params) {
  if (params.configSnapshot.valid || params.configSnapshot.legacyIssues.length === 0)
    return params.configSnapshot;
  const { repairLegacyConfigForUpdateChannel } = await import("./legacy-config-repair-ONJe2cL_.js");
  const { snapshot, repaired } = await repairLegacyConfigForUpdateChannel(params);
  if (!params.jsonMode && repaired)
    defaultRuntime.log(theme.muted("Migrated legacy config before changing update channel."));
  return snapshot;
}
async function writePostCoreSourceConfigFile(filePath, preUpdateConfig) {
  if (!preUpdateConfig) return;
  await fs$1.writeFile(filePath, `${JSON.stringify(preUpdateConfig)}\n`, "utf-8");
}
async function readPostCoreSourceConfigFile(filePath, options) {
  if (!filePath) return;
  try {
    const parsed = parseConfigJson5(await fs$1.readFile(filePath, "utf-8"));
    if (!parsed.ok || !isRecord(parsed.parsed)) return;
    return normalizePreUpdateConfigRestoreInput(parsed.parsed, options);
  } catch {
    return;
  }
}
function normalizePreUpdateConfigRestoreInput(parsed, options) {
  const sourceConfig = parsed.sourceConfig;
  const authoredConfig = parsed.authoredConfig;
  if (isRecord(sourceConfig) && isRecord(authoredConfig))
    return {
      sourceConfig,
      authoredConfig,
    };
  const authored = parsed;
  return {
    sourceConfig: options?.configPath
      ? resolvePreUpdateSourceConfigFromAuthored(authored, options.configPath)
      : authored,
    authoredConfig: authored,
  };
}
function resolvePreUpdateSourceConfigFromAuthored(authoredConfig, configPath) {
  try {
    const resolved = resolveConfigEnvVars(
      resolveConfigIncludes(authoredConfig, configPath, void 0, {
        allowedRoots: resolveIncludeRoots(process.env),
      }),
      process.env,
      { onMissing: () => void 0 },
    );
    return isRecord(resolved) ? resolved : authoredConfig;
  } catch {
    return authoredConfig;
  }
}
async function isFreshPreUpdateConfigSnapshot(params) {
  const snapshotStat = await fs$1.stat(params.snapshotPath).catch(() => null);
  if (!snapshotStat) return false;
  if (params.updateStartedAtMs !== void 0 && snapshotStat.mtimeMs + 1e3 < params.updateStartedAtMs)
    return false;
  if (Date.now() - snapshotStat.mtimeMs > PRE_UPDATE_CONFIG_SNAPSHOT_MAX_AGE_MS) return false;
  const currentStat = await fs$1.stat(params.currentConfigPath).catch(() => null);
  return !currentStat || snapshotStat.mtimeMs <= currentStat.mtimeMs + 1e3;
}
async function readPostCorePreUpdateSourceConfig(params) {
  const fromChildEnv = await readPostCoreSourceConfigFile(params.sourceConfigPath);
  if (fromChildEnv) return fromChildEnv;
  if (params.updateStartedAtMs === void 0) return;
  const explicitPreUpdatePath = `${params.currentSnapshot.path}.pre-update`;
  if (
    await isFreshPreUpdateConfigSnapshot({
      currentConfigPath: params.currentSnapshot.path,
      snapshotPath: explicitPreUpdatePath,
      updateStartedAtMs: params.updateStartedAtMs,
    })
  ) {
    const preUpdateConfig = await readPostCoreSourceConfigFile(explicitPreUpdatePath, {
      configPath: params.currentSnapshot.path,
    });
    if (preUpdateConfig && hasRestorablePreUpdateChannels(params.currentSnapshot, preUpdateConfig))
      return preUpdateConfig;
    return;
  }
  const backupPath = `${params.currentSnapshot.path}.bak`;
  if (
    await isFreshPreUpdateConfigSnapshot({
      currentConfigPath: params.currentSnapshot.path,
      snapshotPath: backupPath,
      updateStartedAtMs: params.updateStartedAtMs,
    })
  ) {
    const preUpdateConfig = await readPostCoreSourceConfigFile(backupPath, {
      configPath: params.currentSnapshot.path,
    });
    if (preUpdateConfig && hasRestorablePreUpdateChannels(params.currentSnapshot, preUpdateConfig))
      return preUpdateConfig;
  }
}
//#endregion
//#region src/cli/update-cli/update-command-plugins.ts
const POST_UPDATE_PLUGIN_REPAIR_GUIDANCE =
  "Run openclaw update repair to retry post-update plugin repair.";
function resolvePostSyncPluginUpdateSkipIds(params) {
  return /* @__PURE__ */ new Set([
    ...params.switchedToClawHub,
    ...params.switchedToNpm,
    ...params.repairedMissingPayloadIds,
  ]);
}
function isClawHubTrustNotice(message) {
  const trimmed = stripAnsi(message).trimStart();
  return (
    trimmed.startsWith("ClawHub trust warning ") ||
    trimmed.startsWith("╭─ REVIEW RECOMMENDED - ClawHub ") ||
    trimmed.startsWith("╭─ WARNING - ClawHub found security risks ") ||
    trimmed.startsWith("╭─ BLOCKED - ClawHub ")
  );
}
function isNonBlockingClawHubTrustNotice(message) {
  const trimmed = stripAnsi(message).trimStart();
  return (
    trimmed.startsWith("ClawHub trust warning ") ||
    trimmed.startsWith("╭─ REVIEW RECOMMENDED - ClawHub ")
  );
}
function formatPluginUpdateWarning(message) {
  return message.includes("╭─") ? message : theme.warn(message);
}
function resolveUpdateClawHubRiskAcknowledgementOptions(opts, params = {}) {
  if (opts.acknowledgeClawHubRisk) return { acknowledgeClawHubRisk: true };
  if (opts.dryRun || opts.yes || opts.json || !process.stdin.isTTY || !process.stdout.isTTY)
    return {};
  return {
    onClawHubRisk: async (request) => {
      params.renderWarningBeforePrompt?.(request.warning);
      const packageName = sanitizeTerminalText(request.packageName);
      const releaseLabel = `${packageName}@${sanitizeTerminalText(request.version)}`;
      if (request.acknowledgementKind === "type-package") {
        const answer = await text({
          message: stylePromptMessage(`type: '${packageName}' to update anyway`),
          placeholder: packageName,
        });
        return !isCancel(answer) && answer.trim() === packageName;
      }
      const ok = await confirm({
        message: stylePromptMessage(
          `Update ClawHub package "${releaseLabel}" after reviewing the warning above?`,
        ),
        initialValue: false,
      });
      return !isCancel(ok) && ok;
    },
  };
}
function isTrackedPackageInstallRecord(record) {
  return (
    record.source === "npm" ||
    record.source === "clawhub" ||
    record.source === "git" ||
    record.source === "marketplace"
  );
}
async function collectMissingPluginInstallPayloads(params) {
  const env = params.env ?? process.env;
  const normalizedPluginConfig =
    params.skipDisabledPlugins && params.config
      ? normalizePluginsConfig(params.config.plugins)
      : void 0;
  const missing = [];
  for (const [pluginId, record] of Object.entries(params.records).toSorted(([left], [right]) =>
    left.localeCompare(right),
  )) {
    if (!isTrackedPackageInstallRecord(record)) continue;
    const officialNpmSpec = params.syncOfficialPluginInstalls
      ? resolveTrustedSourceLinkedOfficialNpmSpec({
          pluginId,
          record,
        })
      : void 0;
    const officialClawHubSpec = params.syncOfficialPluginInstalls
      ? resolveTrustedSourceLinkedOfficialClawHubSpec({
          pluginId,
          record,
        })
      : void 0;
    if (normalizedPluginConfig && params.config) {
      if (
        !resolveEffectiveEnableState({
          id: pluginId,
          origin: "global",
          config: normalizedPluginConfig,
          rootConfig: params.config,
        }).enabled &&
        !officialNpmSpec &&
        !officialClawHubSpec
      )
        continue;
    }
    const rawInstallPath = normalizeOptionalString(record.installPath);
    if (!rawInstallPath) {
      missing.push({
        pluginId,
        reason: "missing-install-path",
      });
      continue;
    }
    const installPath = resolveUserPath(rawInstallPath, env);
    if (!(await pathExists(installPath))) {
      missing.push({
        pluginId,
        installPath,
        reason: "missing-package-dir",
      });
      continue;
    }
    const bundlePayload = resolveBundleInstallRecordPayload({
      record,
      installPath,
    });
    if (bundlePayload.isBundlePayload) {
      if (await hasNativePackageInstallPayload(installPath)) continue;
      if (
        validateBundleInstallRecordPayload({
          pluginId,
          installPath,
          record,
          bundleFormat: bundlePayload.bundleFormat,
        })
      )
        missing.push({
          pluginId,
          installPath,
          reason: "missing-package-json",
        });
      continue;
    }
    if (!(await pathExists(path.join(installPath, "package.json"))))
      missing.push({
        pluginId,
        installPath,
        reason: "missing-package-json",
      });
  }
  return missing;
}
function formatMissingPluginPayloadReason(entry) {
  if (entry.reason === "missing-install-path") return "installPath is missing";
  if (entry.reason === "missing-package-json")
    return `package.json is missing under ${entry.installPath}`;
  return `package directory is missing: ${entry.installPath}`;
}
function formatPostUpdatePluginInspectGuidance(pluginId) {
  return `Run openclaw plugins inspect ${pluginId} --runtime --json for details.`;
}
function createPostUpdatePluginWarning(params) {
  const reason = params.reason.trim() || "unknown plugin post-update failure";
  const guidance = [
    POST_UPDATE_PLUGIN_REPAIR_GUIDANCE,
    ...(params.pluginId ? [formatPostUpdatePluginInspectGuidance(params.pluginId)] : []),
  ];
  return {
    ...(params.pluginId ? { pluginId: params.pluginId } : {}),
    reason,
    message: params.pluginId
      ? `Plugin "${params.pluginId}" could not be processed after the core update: ${reason} ${guidance.join(" ")}`
      : `Plugin post-update processing could not complete after the core update: ${reason} ${guidance.join(" ")}`,
    guidance,
  };
}
function createGuidedPostUpdatePluginOutcome(outcome, options = {}) {
  if (outcome.status !== "error" && !isActionableSkippedPostUpdateOutcome(outcome))
    return { outcome };
  const includeWarningInReason = options.includeWarningInReason ?? true;
  const warningReason =
    outcome.warning && includeWarningInReason
      ? `${outcome.warning}\n${outcome.message}`
      : outcome.message;
  const warning = createPostUpdatePluginWarning({
    ...(outcome.pluginId && outcome.pluginId !== "unknown" ? { pluginId: outcome.pluginId } : {}),
    reason: warningReason,
  });
  return {
    outcome: {
      ...outcome,
      message: warning.message,
    },
    warning,
  };
}
function collectPluginChannelFallbackMessages(outcomes) {
  const seen = /* @__PURE__ */ new Set();
  const messages = [];
  for (const outcome of outcomes) {
    const message = outcome.channelFallback?.message;
    if (!message || seen.has(message)) continue;
    seen.add(message);
    messages.push(message);
  }
  return messages;
}
function isDisabledAfterFailureOutcome(outcome) {
  return outcome.status === "skipped" && outcome.message.includes("after plugin update failure");
}
function isActionableSkippedPostUpdateOutcome(outcome) {
  return isDisabledAfterFailureOutcome(outcome) || isClawHubTrustSkippedOutcome(outcome);
}
/**
 * Build the post-core-update result we return when the active config cannot
 * even be parsed. Mandatory post-core convergence requires a parseable
 * config to know which plugins are configured; if one isn't available, we
 * refuse to restart the gateway and surface this as a hard error so the
 * existing `status === "error"` ⇒ `exit 1` pre-restart gate fires.
 *
 * Exported for unit testing without having to drive the entire
 * `updatePluginsAfterCoreUpdate` orchestrator.
 */
function buildInvalidConfigPostCoreUpdateResult() {
  const guidance = [
    "Run `openclaw doctor` to inspect the config validation errors.",
    "Once the config parses, rerun `openclaw update repair`.",
  ];
  const message =
    "Plugin post-update convergence skipped because the config is invalid; refusing to restart the gateway with an unverified plugin set.";
  return {
    message,
    guidance,
    result: {
      status: "error",
      reason: "invalid-config",
      changed: false,
      sync: {
        changed: false,
        switchedToBundled: [],
        switchedToNpm: [],
        warnings: [],
        errors: [],
      },
      npm: {
        changed: false,
        outcomes: [],
      },
      integrityDrifts: [],
      warnings: [
        {
          reason: "invalid-config",
          message,
          guidance,
        },
      ],
    },
  };
}
async function updatePluginsAfterCoreUpdate(params) {
  if (!params.configSnapshot.valid) {
    const invalid = buildInvalidConfigPostCoreUpdateResult();
    if (!params.opts.json) {
      defaultRuntime.log(theme.error(invalid.message));
      for (const line of invalid.guidance) defaultRuntime.log(theme.muted(`  ${line}`));
    }
    return invalid.result;
  }
  const clawHubTrustNotices = /* @__PURE__ */ new Set();
  const loggedPluginWarnings = /* @__PURE__ */ new Set();
  const hasLoggedPluginWarning = (message) => loggedPluginWarnings.has(stripAnsi(message));
  const recordLoggedPluginWarning = (message) => {
    loggedPluginWarnings.add(stripAnsi(message));
  };
  const recordClawHubTrustNotice = (message) => {
    if (params.opts.json ? isClawHubTrustNotice(message) : isNonBlockingClawHubTrustNotice(message))
      clawHubTrustNotices.add(stripAnsi(message));
  };
  const pluginLogger = {
    ...(params.opts.json ? { terminalLinks: false } : {}),
    info: (msg) => {
      if (!params.opts.json) defaultRuntime.log(msg);
    },
    warn: (msg) => {
      recordLoggedPluginWarning(msg);
      recordClawHubTrustNotice(msg);
      if (!params.opts.json) defaultRuntime.log(formatPluginUpdateWarning(msg));
    },
    error: (msg) => {
      if (!params.opts.json) defaultRuntime.log(theme.error(msg));
    },
  };
  if (!params.opts.json) {
    defaultRuntime.log("");
    defaultRuntime.log(theme.heading("Updating plugins..."));
  }
  const warnings = [];
  const clawHubRiskAcknowledgementOptions = resolveUpdateClawHubRiskAcknowledgementOptions(
    params.opts,
    {
      renderWarningBeforePrompt: (warning) => {
        if (hasLoggedPluginWarning(warning)) return;
        recordLoggedPluginWarning(warning);
        recordClawHubTrustNotice(warning);
        if (!params.opts.json) defaultRuntime.log(formatPluginUpdateWarning(warning));
      },
    },
  );
  const pluginInstallRecords =
    params.pluginInstallRecords ?? (await loadInstalledPluginIndexInstallRecords());
  const pluginUpdateChannel = params.channel;
  const coreVersion = await readPackageVersion(params.root);
  const syncResult = await syncPluginsForUpdateChannel({
    config: withPluginInstallRecords(params.configSnapshot.sourceConfig, pluginInstallRecords),
    channel: pluginUpdateChannel,
    coreVersion: coreVersion ?? void 0,
    workspaceDir: params.root,
    externalizedBundledPluginBridges: await listPersistedBundledPluginLocationBridges({
      workspaceDir: params.root,
    }),
    ...clawHubRiskAcknowledgementOptions,
    logger: pluginLogger,
  });
  for (const error of syncResult.summary.errors)
    warnings.push(createPostUpdatePluginWarning({ reason: error }));
  let pluginConfig = syncResult.config;
  const integrityDrifts = [];
  const pluginUpdateOutcomes = [];
  let pluginsChanged = syncResult.changed || params.configChanged === true;
  let npmPluginsChanged = false;
  const onPluginIntegrityDrift = async (drift) => {
    integrityDrifts.push({
      pluginId: drift.pluginId,
      spec: drift.spec,
      expectedIntegrity: drift.expectedIntegrity,
      actualIntegrity: drift.actualIntegrity,
      ...(drift.resolvedSpec ? { resolvedSpec: drift.resolvedSpec } : {}),
      ...(drift.resolvedVersion ? { resolvedVersion: drift.resolvedVersion } : {}),
      action: "aborted",
    });
    if (!params.opts.json) {
      const specLabel = drift.resolvedSpec ?? drift.spec;
      defaultRuntime.log(
        theme.warn(`Integrity drift detected for "${drift.pluginId}" (${specLabel})\nExpected: ${drift.expectedIntegrity}\nActual:   ${drift.actualIntegrity}
Plugin update aborted. Reinstall the plugin only if you trust the new artifact.`),
      );
    }
    return false;
  };
  const collectMissingPayloadWarnings = async (records) => {
    const missing = await collectMissingPluginInstallPayloads({
      records,
      config: pluginConfig,
      skipDisabledPlugins: true,
      syncOfficialPluginInstalls: true,
    });
    if (missing.length === 0) return [];
    const missingIds = missing.map((entry) => entry.pluginId);
    for (const entry of missing) {
      const warning = createPostUpdatePluginWarning({
        pluginId: entry.pluginId,
        reason: `Plugin install payload missing after update: ${formatMissingPluginPayloadReason(entry)}.`,
      });
      warnings.push(warning);
      pluginUpdateOutcomes.push({
        pluginId: entry.pluginId,
        status: "error",
        message: warning.message,
      });
      if (!params.opts.json) defaultRuntime.log(theme.warn(warning.message));
    }
    const repairResult = await updateNpmInstalledPlugins({
      config: pluginConfig,
      pluginIds: missingIds,
      timeoutMs: params.timeoutMs,
      updateChannel: pluginUpdateChannel,
      coreVersion: coreVersion ?? void 0,
      skipDisabledPlugins: true,
      syncOfficialPluginInstalls: true,
      disableOnFailure: true,
      logger: pluginLogger,
      onIntegrityDrift: onPluginIntegrityDrift,
      ...clawHubRiskAcknowledgementOptions,
    });
    pluginConfig = repairResult.config;
    pluginsChanged ||= repairResult.changed;
    npmPluginsChanged ||= repairResult.changed;
    pluginUpdateOutcomes.push(...repairResult.outcomes);
    return missingIds;
  };
  const missingPayloadIdSet = new Set(await collectMissingPayloadWarnings(pluginInstallRecords));
  const npmResult = await updateNpmInstalledPlugins({
    config: pluginConfig,
    timeoutMs: params.timeoutMs,
    updateChannel: pluginUpdateChannel,
    coreVersion: coreVersion ?? void 0,
    skipIds: resolvePostSyncPluginUpdateSkipIds({
      switchedToClawHub: syncResult.summary.switchedToClawHub,
      switchedToNpm: syncResult.summary.switchedToNpm,
      repairedMissingPayloadIds: missingPayloadIdSet,
    }),
    skipDisabledPlugins: true,
    syncOfficialPluginInstalls: true,
    disableOnFailure: true,
    logger: pluginLogger,
    onIntegrityDrift: onPluginIntegrityDrift,
    ...clawHubRiskAcknowledgementOptions,
  });
  pluginConfig = npmResult.config;
  pluginsChanged ||= npmResult.changed;
  npmPluginsChanged ||= npmResult.changed;
  for (const rawOutcome of npmResult.outcomes) {
    const guided = createGuidedPostUpdatePluginOutcome(rawOutcome, {
      includeWarningInReason:
        params.opts.json || !rawOutcome.warning || !hasLoggedPluginWarning(rawOutcome.warning),
    });
    pluginUpdateOutcomes.push(guided.outcome);
    if (guided.warning) warnings.push(guided.warning);
  }
  const remainingMissingPayloads = await collectMissingPluginInstallPayloads({
    records: pluginConfig.plugins?.installs ?? {},
    config: pluginConfig,
    skipDisabledPlugins: true,
    syncOfficialPluginInstalls: true,
  });
  pluginUpdateOutcomes.push(
    ...remainingMissingPayloads
      .filter((entry) => !missingPayloadIdSet.has(entry.pluginId))
      .map((entry) => {
        const warning = createPostUpdatePluginWarning({
          pluginId: entry.pluginId,
          reason: `Plugin install payload missing after update: ${formatMissingPluginPayloadReason(entry)}.`,
        });
        warnings.push(warning);
        return {
          pluginId: entry.pluginId,
          status: "error",
          message: warning.message,
        };
      }),
  );
  const convergenceBaselineRecords = pluginConfig.plugins?.installs ?? {};
  const convergence = await runPostCorePluginConvergence({
    cfg: pluginConfig,
    env: process.env,
    baselineInstallRecords: convergenceBaselineRecords,
    ...clawHubRiskAcknowledgementOptions,
  });
  for (const change of convergence.changes)
    if (!params.opts.json) defaultRuntime.log(theme.muted(change));
  const convergenceFolded = convergenceWarningsToOutcomes(convergence);
  for (const warning of convergenceFolded.warnings) {
    warnings.push(warning);
    if (!params.opts.json) {
      defaultRuntime.log(theme.warn(warning.message));
      for (const guidance of warning.guidance) defaultRuntime.log(theme.muted(`  ${guidance}`));
    }
  }
  pluginUpdateOutcomes.push(...convergenceFolded.outcomes);
  const convergenceErrored = convergenceFolded.errored;
  pluginConfig = withPluginInstallRecords(pluginConfig, convergence.installRecords);
  if (convergence.changes.length > 0) pluginsChanged = true;
  if (pluginsChanged) {
    const nextInstallRecords = pluginConfig.plugins?.installs ?? {};
    let nextConfig = withoutPluginInstallRecords(pluginConfig);
    if (params.restoredAuthoredChannels !== void 0)
      nextConfig = {
        ...nextConfig,
        channels: structuredClone(params.restoredAuthoredChannels),
      };
    await commitPluginInstallRecordsWithConfig({
      previousInstallRecords: pluginInstallRecords,
      nextInstallRecords,
      nextConfig,
      baseHash: params.configSnapshot.hash,
    });
    await refreshPluginRegistryAfterConfigMutation({
      config: nextConfig,
      reason: "source-changed",
      workspaceDir: params.root,
      installRecords: nextInstallRecords,
      invalidateRuntimeCache: false,
      logger: pluginLogger,
    });
  }
  for (const notice of clawHubTrustNotices) {
    if (warnings.some((warning) => warning.reason.includes(notice))) continue;
    warnings.push({
      reason: notice,
      message: notice,
      guidance: [],
    });
  }
  if (params.opts.json)
    return {
      status: convergenceErrored ? "error" : warnings.length > 0 ? "warning" : "ok",
      changed: pluginsChanged,
      warnings,
      sync: {
        changed: syncResult.changed,
        switchedToBundled: syncResult.summary.switchedToBundled,
        switchedToNpm: syncResult.summary.switchedToNpm,
        warnings: syncResult.summary.warnings,
        errors: syncResult.summary.errors,
      },
      npm: {
        changed: npmPluginsChanged,
        outcomes: pluginUpdateOutcomes,
      },
      integrityDrifts,
    };
  const summarizeList = (list) => {
    if (list.length <= 6) return list.join(", ");
    return `${list.slice(0, 6).join(", ")} +${list.length - 6} more`;
  };
  if (syncResult.summary.switchedToBundled.length > 0)
    defaultRuntime.log(
      theme.muted(
        `Switched to bundled plugins: ${summarizeList(syncResult.summary.switchedToBundled)}.`,
      ),
    );
  if (syncResult.summary.switchedToNpm.length > 0)
    defaultRuntime.log(
      theme.muted(`Restored npm plugins: ${summarizeList(syncResult.summary.switchedToNpm)}.`),
    );
  for (const warning of syncResult.summary.warnings)
    if (!hasLoggedPluginWarning(warning)) defaultRuntime.log(formatPluginUpdateWarning(warning));
  for (const error of syncResult.summary.errors)
    defaultRuntime.log(theme.warn(createPostUpdatePluginWarning({ reason: error }).message));
  const updated = pluginUpdateOutcomes.filter((entry) => entry.status === "updated").length;
  const unchanged = pluginUpdateOutcomes.filter((entry) => entry.status === "unchanged").length;
  const failed = pluginUpdateOutcomes.filter((entry) => entry.status === "error").length;
  const skipped = pluginUpdateOutcomes.filter((entry) => entry.status === "skipped").length;
  if (pluginUpdateOutcomes.length === 0)
    defaultRuntime.log(theme.muted("No plugin updates needed."));
  else {
    const parts = [`${updated} updated`, `${unchanged} unchanged`];
    if (failed > 0) parts.push(`${failed} failed`);
    if (skipped > 0) parts.push(`${skipped} skipped`);
    defaultRuntime.log(theme.muted(`npm plugins: ${parts.join(", ")}.`));
  }
  for (const message of collectPluginChannelFallbackMessages(pluginUpdateOutcomes))
    defaultRuntime.log(theme.warn(message));
  for (const outcome of pluginUpdateOutcomes) {
    if (outcome.status !== "error" && !isActionableSkippedPostUpdateOutcome(outcome)) continue;
    defaultRuntime.log(theme.warn(outcome.message));
  }
  return {
    status: convergenceErrored ? "error" : warnings.length > 0 ? "warning" : "ok",
    changed: pluginsChanged,
    warnings,
    sync: {
      changed: syncResult.changed,
      switchedToBundled: syncResult.summary.switchedToBundled,
      switchedToNpm: syncResult.summary.switchedToNpm,
      warnings: syncResult.summary.warnings,
      errors: syncResult.summary.errors,
    },
    npm: {
      changed: npmPluginsChanged,
      outcomes: pluginUpdateOutcomes,
    },
    integrityDrifts,
  };
}
//#endregion
//#region src/cli/update-cli/update-command-service.ts
const CLI_NAME$1 = resolveCliName();
const SERVICE_REFRESH_TIMEOUT_MS = 6e4;
const POST_REFRESH_ALREADY_HEALTHY_ATTEMPTS = 10;
const POST_REFRESH_ALREADY_HEALTHY_DELAY_MS = 500;
const SERVICE_REFRESH_PATH_ENV_KEYS = [
  "OPENCLAW_HOME",
  "OPENCLAW_STATE_DIR",
  "OPENCLAW_CONFIG_PATH",
];
const POST_INSTALL_DOCTOR_SERVICE_ENV_KEYS = [...SERVICE_REFRESH_PATH_ENV_KEYS, "OPENCLAW_PROFILE"];
const JSON_MODE_SERVICE_STDOUT = new Writable({
  write(_chunk, _encoding, callback) {
    callback();
  },
});
function isPackageManagerUpdateMode(mode) {
  return mode === "npm" || mode === "pnpm" || mode === "bun";
}
function shouldPrepareUpdatedInstallRestart(params) {
  if (params.serviceMatchesMutationRoot === false) return false;
  if (isPackageManagerUpdateMode(params.updateMode)) return params.serviceInstalled;
  if (params.updateMode === "git" && params.serviceStoppedForUpdate) return params.serviceInstalled;
  if (params.updateMode === "git")
    return params.serviceLoaded && params.serviceMatchesUpdateRoot === true;
  return params.serviceLoaded;
}
function shouldUseLegacyProcessRestartAfterUpdate(params) {
  return !isPackageManagerUpdateMode(params.updateMode);
}
async function recoverInstalledLaunchAgentAfterUpdate(params) {
  if ((params.deps?.platform ?? process.platform) !== "darwin")
    return {
      attempted: false,
      recovered: false,
    };
  const service = params.service ?? resolveGatewayService();
  const readState = params.deps?.readState ?? readGatewayServiceState;
  const recover = params.deps?.recover ?? recoverInstalledLaunchAgent;
  const state = await readState(service, { env: params.env }).catch(() => null);
  if (state?.loaded)
    return {
      attempted: false,
      recovered: false,
    };
  if (state && !state.installed && !state.runtime?.missingSupervision)
    return {
      attempted: false,
      recovered: false,
    };
  const recovered = await recover({
    result: "restarted",
    env: state?.env ?? params.env,
  }).catch(() => null);
  if (!recovered)
    return {
      attempted: true,
      recovered: false,
      detail:
        "LaunchAgent was installed but not loaded; automatic bootstrap/kickstart recovery failed.",
    };
  return {
    attempted: true,
    recovered: true,
    message: recovered.message,
  };
}
async function recoverLaunchAgentAndRecheckGatewayHealth(params) {
  if (params.health.healthy)
    return {
      health: params.health,
      launchAgentRecovery: null,
    };
  const launchAgentRecovery = await (
    params.deps?.recoverLaunchAgent ?? recoverInstalledLaunchAgentAfterUpdate
  )({
    service: params.service,
    env: params.env,
  });
  if (!launchAgentRecovery.recovered)
    return {
      health: params.health,
      launchAgentRecovery,
    };
  return {
    health: await (params.deps?.waitForHealthy ?? waitForGatewayHealthyRestart)({
      service: params.service,
      port: params.port,
      expectedVersion: params.expectedVersion,
      env: params.env,
    }),
    launchAgentRecovery,
  };
}
function formatPostUpdateGatewayRecoveryLine(platform) {
  const restartCommand = replaceCliName(formatCliCommand("openclaw gateway restart"), CLI_NAME$1);
  const installCommand = replaceCliName(
    formatCliCommand("openclaw gateway install --force"),
    CLI_NAME$1,
  );
  const statusCommand = replaceCliName(
    formatCliCommand("openclaw gateway status --deep"),
    CLI_NAME$1,
  );
  if (platform === "darwin")
    return `Recovery: run \`${restartCommand}\`; if the LaunchAgent is installed but not loaded, run \`${installCommand}\` from the logged-in macOS user session, then rerun \`${statusCommand}\`.`;
  if (platform === "linux")
    return `Recovery: run \`${restartCommand}\`; if the systemd user service is missing, stale, or not active, run \`${installCommand}\` from the same user account, then rerun \`${statusCommand}\`.`;
  if (platform === "win32")
    return `Recovery: run \`${restartCommand}\`; if the gateway Scheduled Task or Windows login item is missing, stale, or not running, run \`${installCommand}\` from the same user account, then rerun \`${statusCommand}\`.`;
  return `Recovery: run \`${restartCommand}\`; if the local service manager reports the gateway service is missing, stale, or not running, run \`${installCommand}\` from the same user account, then rerun \`${statusCommand}\`.`;
}
function formatPostUpdateGatewayRecoveryInstructions(result, platform = process.platform) {
  const lines = [formatPostUpdateGatewayRecoveryLine(platform)];
  const beforeVersion = normalizeOptionalString(result.before?.version);
  if (isPackageManagerUpdateMode(result.mode) && beforeVersion)
    lines.push(
      `Rollback: reinstall OpenClaw ${beforeVersion} with the same package manager, then rerun \`${replaceCliName(formatCliCommand("openclaw gateway install --force"), CLI_NAME$1)}\`.`,
    );
  return lines;
}
var UpdateCommandAbort = class extends Error {
  constructor() {
    super("openclaw-update-abort");
    this.name = "UpdateCommandAbort";
  }
};
function createAggregateErrorWithCause(errors, message, cause) {
  return new AggregateError(errors, message, { cause });
}
function formatGatewayAncestryBlockMessage(pid) {
  return `openclaw update detected it is running inside the gateway process tree.
Gateway PID ${pid} is an ancestor of this process, so this updater cannot safely stop or restart the gateway that owns it.
Run \`${replaceCliName(formatCliCommand("openclaw update"), CLI_NAME$1)}\` from a shell outside the gateway service, or stop the gateway service first and then update.`;
}
function parsePositivePid(value) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) return Math.floor(value);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!/^\d+$/u.test(trimmed)) return null;
  return parseStrictPositiveInteger(trimmed) ?? null;
}
function isInheritedGatewayRuntimePid(pid, env = process.env) {
  if (!isRunningInsideGatewayService(env)) return false;
  return parsePositivePid(env[GATEWAY_SERVICE_RUNTIME_PID_ENV]) === pid;
}
function isGatewayAncestorPid(pid, env = process.env) {
  const parsed = parsePositivePid(pid);
  if (parsed === null) return false;
  return isInheritedGatewayRuntimePid(parsed, env) || getSelfAndAncestorPidsSync().has(parsed);
}
function gatewayAncestryBlockMessage(pid) {
  return isGatewayAncestorPid(pid) ? formatGatewayAncestryBlockMessage(pid) : void 0;
}
function serviceControlStdoutForMode(jsonMode) {
  return jsonMode ? JSON_MODE_SERVICE_STDOUT : process.stdout;
}
function armWindowsTaskAutoStartRecovery(serviceEnv) {
  let restorePromise;
  let unregisterSignalExitBarrier = () => {};
  let finishUpdate;
  let interrupted = false;
  const unregisterSignalExitGate = registerSignalExitGate(
    new Promise((resolve) => {
      finishUpdate = resolve;
    }),
  );
  const onSignal = (exitCode) => {
    interrupted = true;
    waitForSignalExitBarriers()
      .catch((err) => {
        defaultRuntime.error(`Failed to complete update shutdown cleanup: ${String(err)}`);
      })
      .finally(() => {
        process.exit(exitCode);
      });
  };
  const onSigint = () => onSignal(130);
  const onSigterm = () => onSignal(143);
  const onSigbreak = () => onSignal(130);
  const removeSignalHandlers = () => {
    process.off("SIGINT", onSigint);
    process.off("SIGTERM", onSigterm);
    process.off("SIGBREAK", onSigbreak);
    unregisterSignalExitBarrier();
  };
  const complete = () => {
    finishUpdate?.();
    finishUpdate = void 0;
    unregisterSignalExitGate();
  };
  const restore = () => {
    restorePromise ??= suspensionPromise
      .then(async (suspended) => {
        if (suspended) await resumeScheduledTaskAutoStartAfterUpdate(serviceEnv);
      })
      .finally(removeSignalHandlers);
    return restorePromise;
  };
  process.on("SIGINT", onSigint);
  process.on("SIGTERM", onSigterm);
  process.on("SIGBREAK", onSigbreak);
  unregisterSignalExitBarrier = registerSignalExitBarrier(restore);
  const suspensionPromise = suspendScheduledTaskAutoStartForUpdate(serviceEnv);
  return {
    suspended: suspensionPromise,
    restore,
    complete,
    interrupted: () => interrupted,
  };
}
async function abortWindowsTaskUpdateIfInterrupted(recovery) {
  if (!recovery.interrupted()) return;
  try {
    await recovery.restore();
  } finally {
    recovery.complete();
  }
  throw new UpdateCommandAbort();
}
async function maybeSuspendWindowsTaskAutoStartForPackageUpdate(params) {
  if (params.updateInstallKind !== "package" || process.platform !== "win32" || !params.serviceEnv)
    return;
  const recovery = armWindowsTaskAutoStartRecovery(params.serviceEnv);
  let suspended;
  try {
    suspended = await recovery.suspended;
  } catch (err) {
    await recovery.restore().catch(() => void 0);
    recovery.complete();
    throw err;
  }
  await abortWindowsTaskUpdateIfInterrupted(recovery);
  if (!suspended) {
    try {
      await recovery.restore();
    } finally {
      recovery.complete();
    }
    return;
  }
  return recovery;
}
async function maybeResumeWindowsTaskAutoStartAfterPackageUpdate(stopState) {
  if (!stopState?.windowsTaskAutoStartRecovery) return;
  await stopState.windowsTaskAutoStartRecovery.restore();
  stopState.windowsTaskAutoStartRecovery = void 0;
}
async function restoreWindowsTaskAutoStartOrExit(stopState) {
  try {
    await maybeResumeWindowsTaskAutoStartAfterPackageUpdate(stopState);
    return true;
  } catch (err) {
    defaultRuntime.error(
      `Failed to restore Windows Scheduled Task autostart after package update: ${String(err)}`,
    );
    defaultRuntime.exit(1);
    return false;
  }
}
async function maybeStopManagedServiceBeforeMutableUpdate(params) {
  let service;
  let serviceState;
  try {
    service = resolveGatewayService();
    serviceState = await readGatewayServiceState(service, { env: process.env });
  } catch {
    return {
      stopped: false,
      inspected: false,
      runtimeInspected: false,
      running: false,
    };
  }
  const runtimeStatus = serviceState.runtime?.status;
  const runtimeInspected = runtimeStatus === "running" || runtimeStatus === "stopped";
  if (!serviceState.installed)
    return {
      stopped: false,
      inspected: true,
      runtimeInspected,
      running: serviceState.running,
      serviceEnv: serviceState.env,
    };
  const serviceMatchesMutationRoot = await gatewayServiceCommandUsesRoot({
    root: params.root,
    command: serviceState.command,
  });
  const serviceOwnership =
    serviceMatchesMutationRoot === null ? {} : { serviceMatchesMutationRoot };
  if (!params.shouldRestart) {
    if (!params.jsonMode && serviceState.running)
      defaultRuntime.log(
        theme.warn(
          `--no-restart is set while the managed gateway service is running; the ${params.updateInstallKind} update will not stop or restart that process.`,
        ),
      );
    const windowsTaskAutoStartRecovery = isRunningInsideGatewayService()
      ? void 0
      : await maybeSuspendWindowsTaskAutoStartForPackageUpdate({
          updateInstallKind: params.updateInstallKind,
          serviceEnv: serviceState.env,
        });
    return {
      stopped: false,
      inspected: true,
      runtimeInspected,
      running: serviceState.running,
      ...serviceOwnership,
      serviceEnv: serviceState.env,
      ...(windowsTaskAutoStartRecovery ? { windowsTaskAutoStartRecovery } : {}),
    };
  }
  if (!runtimeInspected) {
    const windowsTaskAutoStartRecovery = isRunningInsideGatewayService()
      ? void 0
      : await maybeSuspendWindowsTaskAutoStartForPackageUpdate({
          updateInstallKind: params.updateInstallKind,
          serviceEnv: serviceState.env,
        });
    return {
      stopped: false,
      inspected: true,
      runtimeInspected: false,
      running: false,
      ...serviceOwnership,
      serviceEnv: serviceState.env,
      ...(windowsTaskAutoStartRecovery ? { windowsTaskAutoStartRecovery } : {}),
    };
  }
  if (!serviceState.running) {
    const windowsTaskAutoStartRecovery = await maybeSuspendWindowsTaskAutoStartForPackageUpdate({
      updateInstallKind: params.updateInstallKind,
      serviceEnv: serviceState.env,
    });
    return {
      stopped: false,
      inspected: true,
      runtimeInspected: true,
      running: false,
      ...serviceOwnership,
      serviceEnv: serviceState.env,
      ...(windowsTaskAutoStartRecovery ? { windowsTaskAutoStartRecovery } : {}),
    };
  }
  const blockMessage = gatewayAncestryBlockMessage(serviceState.runtime?.pid);
  if (blockMessage)
    return {
      stopped: false,
      inspected: true,
      runtimeInspected: true,
      running: true,
      ...serviceOwnership,
      blockMessage,
      serviceEnv: serviceState.env,
    };
  if (serviceMatchesMutationRoot === false) {
    if (!params.jsonMode)
      defaultRuntime.log(
        theme.muted(
          `Managed gateway service points at a different OpenClaw root; leaving it running during this ${params.updateInstallKind} update.`,
        ),
      );
    return {
      stopped: false,
      inspected: true,
      runtimeInspected: true,
      running: true,
      ...serviceOwnership,
      serviceEnv: serviceState.env,
    };
  }
  if (!params.jsonMode)
    defaultRuntime.log(
      theme.muted(`Stopping managed gateway service before ${params.updateInstallKind} update...`),
    );
  const windowsTaskAutoStartRecovery = await maybeSuspendWindowsTaskAutoStartForPackageUpdate({
    updateInstallKind: params.updateInstallKind,
    serviceEnv: serviceState.env,
  });
  try {
    await service.stop({
      env: serviceState.env,
      stdout: serviceControlStdoutForMode(params.jsonMode),
    });
    if (windowsTaskAutoStartRecovery)
      await abortWindowsTaskUpdateIfInterrupted(windowsTaskAutoStartRecovery);
  } catch (err) {
    if (err instanceof UpdateCommandAbort) throw err;
    if (windowsTaskAutoStartRecovery) {
      try {
        await windowsTaskAutoStartRecovery.restore();
      } catch (resumeErr) {
        throw createAggregateErrorWithCause(
          [err, resumeErr],
          `Failed to stop the managed gateway (${String(err)}) and restore Windows Scheduled Task autostart (${String(resumeErr)})`,
          err,
        );
      } finally {
        windowsTaskAutoStartRecovery.complete();
      }
      if (windowsTaskAutoStartRecovery.interrupted()) throw new UpdateCommandAbort();
    }
    throw err;
  }
  return {
    stopped: true,
    inspected: true,
    runtimeInspected: true,
    running: true,
    ...serviceOwnership,
    serviceEnv: serviceState.env,
    ...(windowsTaskAutoStartRecovery ? { windowsTaskAutoStartRecovery } : {}),
  };
}
async function maybeRestartServiceAfterFailedMutableUpdate(params) {
  if (!params.preManagedServiceStop?.stopped || !params.preManagedServiceStop.serviceEnv) return;
  try {
    await resolveGatewayService().restart({
      env: params.preManagedServiceStop.serviceEnv,
      stdout: serviceControlStdoutForMode(params.jsonMode),
    });
    if (!params.jsonMode)
      defaultRuntime.log(theme.muted("Restarted managed gateway service after failed update."));
  } catch (err) {
    const message = `Failed to restart managed gateway service after failed update: ${String(err)}`;
    if (params.jsonMode) defaultRuntime.error(message);
    else defaultRuntime.log(theme.warn(message));
  }
}
function isRunningInsideGatewayService(env = process.env) {
  if (env.OPENCLAW_SERVICE_MARKER?.trim() !== "openclaw") return false;
  const serviceKind = env.OPENCLAW_SERVICE_KIND?.trim();
  return !serviceKind || serviceKind === "gateway";
}
function shouldBlockMutableUpdateFromGatewayServiceEnv(params) {
  if (!isRunningInsideGatewayService()) return false;
  const stopState = params.preManagedServiceStop;
  if (!stopState?.inspected) return true;
  if (stopState.stopped) return false;
  if (!stopState.runtimeInspected) return true;
  return stopState.running;
}
function formatCommandFailure(stdout, stderr) {
  const detail = (stderr || stdout).trim();
  if (!detail) return "command returned a non-zero exit code";
  return detail.split("\n").slice(-3).join("\n");
}
function tryResolveInvocationCwd() {
  try {
    return process.cwd();
  } catch {
    return;
  }
}
async function resolvePackageRuntimePreflightError(params) {
  if (!canResolveRegistryVersionForPackageTarget(params.tag)) return null;
  if (params.spec && !canResolveRegistryVersionForPackageTarget(params.spec)) return null;
  const target = params.tag.trim();
  if (!target) return null;
  const status = await fetchNpmPackageTargetStatus({
    target,
    spec: params.spec,
    timeoutMs: params.timeoutMs,
    command: params.command,
    cwd: params.cwd,
    env: params.env,
  });
  if (status.error) return null;
  const runtime = await resolvePackageRuntimeForPreflight({
    nodeRunner: params.nodeRunner,
    timeoutMs: params.timeoutMs,
  });
  if (nodeVersionSatisfiesEngine(runtime.version, status.nodeEngine) !== false) return null;
  const targetLabel = status.version ?? target;
  return [
    `${runtime.nodeRunner ? `Node ${runtime.version ?? "unknown"} at ${runtime.nodeRunner}` : `Node ${runtime.version ?? "unknown"}`} is too old for openclaw@${targetLabel}.`,
    `The requested package requires ${status.nodeEngine}.`,
    runtime.nodeRunner
      ? "Upgrade the Node runtime that owns the managed Gateway service, then rerun `openclaw update`."
      : "Upgrade to Node 22.22.3+, Node 24.15.0+, or Node 25.9.0+, then rerun `openclaw update`.",
    "Bare `npm i -g openclaw` can silently install an older compatible release.",
    "After upgrading Node, use `npm i -g openclaw@latest`.",
  ].join("\n");
}
async function resolvePackageRuntimeForPreflight(params) {
  const nodeRunner = normalizeOptionalString(params.nodeRunner);
  if (!nodeRunner) return { version: process.versions.node ?? null };
  const res = await runCommandWithTimeout([nodeRunner, "--version"], {
    timeoutMs: Math.min(params.timeoutMs ?? 1e4, 1e4),
  }).catch(() => null);
  return {
    version: (res?.code === 0 ? res.stdout.trim() : "").replace(/^v/u, "") || null,
    nodeRunner,
  };
}
function resolveServiceRefreshEnv(env, invocationCwd) {
  const resolvedEnv = { ...env };
  for (const key of SERVICE_REFRESH_PATH_ENV_KEYS) {
    const rawValue = resolvedEnv[key]?.trim();
    if (!rawValue) continue;
    if (rawValue.startsWith("~") || path.isAbsolute(rawValue) || path.win32.isAbsolute(rawValue)) {
      resolvedEnv[key] = rawValue;
      continue;
    }
    if (!invocationCwd) {
      resolvedEnv[key] = rawValue;
      continue;
    }
    resolvedEnv[key] = path.resolve(invocationCwd, rawValue);
  }
  return resolvedEnv;
}
function disableUpdatedPackageCompileCacheEnv(env) {
  return {
    ...env,
    NODE_DISABLE_COMPILE_CACHE: "1",
  };
}
function stripGatewayServiceMarkerEnv(env) {
  const resolvedEnv = { ...env };
  delete resolvedEnv.OPENCLAW_SERVICE_MARKER;
  delete resolvedEnv.OPENCLAW_SERVICE_KIND;
  delete resolvedEnv[GATEWAY_SERVICE_RUNTIME_PID_ENV];
  return resolvedEnv;
}
function resolveUpdatedInstallCommandEnv(env, invocationCwd) {
  return disableUpdatedPackageCompileCacheEnv(resolveServiceRefreshEnv(env, invocationCwd));
}
function resolvePostInstallDoctorEnv(params) {
  const resolvedEnv = {
    ...disableUpdatedPackageCompileCacheEnv(params?.baseEnv ?? process.env),
    [DOCTOR_DISABLE_CROSS_STATE_DIR_IMPORTS_ENV]: "1",
  };
  if (!params?.serviceEnv) return resolvedEnv;
  const serviceEnv = resolveServiceRefreshEnv(params.serviceEnv, params.invocationCwd);
  for (const key of POST_INSTALL_DOCTOR_SERVICE_ENV_KEYS)
    if (serviceEnv[key]?.trim()) resolvedEnv[key] = serviceEnv[key];
  return resolvedEnv;
}
function resolveUpdatedGatewayRestartPort(params) {
  return resolveGatewayPort(params.config, params.serviceEnv ?? params.processEnv ?? process.env);
}
function resolvePostUpdateServiceStateReadEnv(params) {
  if (params.updateMode === "git" && params.preManagedServiceEnv)
    return params.preManagedServiceEnv;
  if (isPackageManagerUpdateMode(params.updateMode))
    return (
      params.preManagedServiceEnv ?? params.prePackageServiceEnv ?? params.processEnv ?? process.env
    );
  return params.processEnv ?? process.env;
}
async function refreshGatewayServiceEnv(params) {
  const args = ["gateway", "install", "--force"];
  if (params.jsonMode) args.push("--json");
  const entrypoint = await resolveGatewayInstallEntrypoint(params.result.root);
  if (entrypoint) {
    const res = await runCommandWithTimeout(
      [params.nodeRunner ?? resolveNodeRunner(), entrypoint, ...args],
      {
        cwd: params.result.root,
        env: resolveUpdatedInstallCommandEnv(params.env ?? process.env, params.invocationCwd),
        timeoutMs: SERVICE_REFRESH_TIMEOUT_MS,
      },
    );
    if (res.code === 0) return;
    throw new Error(
      `updated install refresh failed (${entrypoint}): ${formatCommandFailure(res.stdout, res.stderr)}`,
    );
  }
  if (isPackageManagerUpdateMode(params.result.mode))
    throw new Error(
      `updated install entrypoint not found under ${params.result.root ?? "unknown"}`,
    );
  await runDaemonInstall({
    force: true,
    json: params.jsonMode || void 0,
  });
}
async function runUpdatedInstallGatewayRestart(params) {
  const entrypoint = await resolveGatewayInstallEntrypoint(params.result.root);
  if (!entrypoint)
    throw new Error(
      `updated install entrypoint not found under ${params.result.root ?? "unknown"}`,
    );
  const args = ["gateway", "restart"];
  if (params.jsonMode) args.push("--json");
  const res = await runCommandWithTimeout(
    [params.nodeRunner ?? resolveNodeRunner(), entrypoint, ...args],
    {
      cwd: params.result.root,
      env: resolveUpdatedInstallCommandEnv(params.env ?? process.env, params.invocationCwd),
      timeoutMs: SERVICE_REFRESH_TIMEOUT_MS,
    },
  );
  if (res.code === 0) return true;
  throw new Error(
    `updated install restart failed (${entrypoint}): ${formatCommandFailure(res.stdout, res.stderr)}`,
  );
}
async function tryInstallShellCompletion(opts) {
  if (opts.jsonMode || !process.stdin.isTTY) return;
  const status = await checkShellCompletionStatus(CLI_NAME$1);
  const generationOptions = { generationMode: "core-only" };
  if (status.usesSlowPattern) {
    defaultRuntime.log(theme.muted("Upgrading shell completion to cached version..."));
    if (await ensureCompletionCacheExists(CLI_NAME$1, generationOptions))
      await installShellCompletionForUpdate(status.shell, true);
    return;
  }
  if (status.profileInstalled && !status.cacheExists) {
    defaultRuntime.log(theme.muted("Regenerating shell completion cache..."));
    await ensureCompletionCacheExists(CLI_NAME$1, generationOptions);
    return;
  }
  if (!status.profileInstalled) {
    defaultRuntime.log("");
    defaultRuntime.log(theme.heading("Shell completion"));
    const shouldInstall = await confirm({
      message: stylePromptMessage(`Enable ${status.shell} shell completion for ${CLI_NAME$1}?`),
      initialValue: true,
    });
    if (isCancel(shouldInstall) || !shouldInstall) {
      if (!opts.skipPrompt)
        defaultRuntime.log(
          theme.muted(
            `Skipped. Run \`${replaceCliName(formatCliCommand("openclaw completion --install"), CLI_NAME$1)}\` later to enable.`,
          ),
        );
      return;
    }
    if (!(await ensureCompletionCacheExists(CLI_NAME$1, generationOptions))) {
      defaultRuntime.log(theme.warn("Failed to generate completion cache."));
      return;
    }
    await installShellCompletionForUpdate(status.shell, opts.skipPrompt);
  }
}
async function installShellCompletionForUpdate(shell, yes) {
  try {
    await installCompletion(shell, yes, CLI_NAME$1);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    defaultRuntime.log(theme.warn(`Shell completion refresh failed: ${message}`));
  }
}
async function tryRealpathOrResolve(value) {
  try {
    return await fs$1.realpath(path.resolve(value));
  } catch {
    return path.resolve(value);
  }
}
function isNodeExecutable(value) {
  const base = normalizeOptionalString(value ? path.basename(value) : void 0)?.toLowerCase();
  return base === "node" || base === "node.exe";
}
function resolveManagedServiceNodeRunner(command) {
  const args = command?.programArguments;
  if (!args?.length) return;
  const gatewayIndex = args.indexOf("gateway");
  if (gatewayIndex <= 1) return;
  const runner = args[gatewayIndex - 2];
  return isNodeExecutable(runner) ? runner : void 0;
}
/**
 * Resolve the node binary baked into the managed gateway service unit,
 * independent of any package root redirect. This detects when the user's
 * current PATH-resolved node differs from the service's baked node even
 * when the package root is the same.
 */
async function resolveManagedServiceNodeRunnerOverride() {
  const serviceNode = resolveManagedServiceNodeRunner(
    await resolveGatewayService()
      .readCommand(process.env)
      .catch(() => null),
  );
  if (!serviceNode) return;
  const currentNode = resolveNodeRunner();
  const [serviceNodeReal, currentNodeReal] = await Promise.all([
    tryRealpathOrResolve(serviceNode),
    tryRealpathOrResolve(currentNode),
  ]);
  if (serviceNodeReal === currentNodeReal) return;
  return serviceNode;
}
async function resolveManagedServicePackageUpdateRoot(params) {
  const command = await resolveGatewayService()
    .readCommand(process.env)
    .catch(() => null);
  const layout = await summarizeGatewayServiceLayout(command);
  const serviceRoot = layout?.packageRoot;
  if (!serviceRoot || layout.entrypointSourceCheckout === true) return null;
  const [currentRootReal, serviceRootReal] = await Promise.all([
    tryRealpathOrResolve(params.root),
    tryRealpathOrResolve(serviceRoot),
  ]);
  if (currentRootReal === serviceRootReal) return null;
  const nodeRunner = resolveManagedServiceNodeRunner(command);
  return {
    root: serviceRoot,
    previousRoot: params.root,
    ...(nodeRunner ? { nodeRunner } : {}),
  };
}
async function gatewayServiceCommandUsesRoot(params) {
  const expectedRoot = normalizeOptionalString(params.root);
  if (!expectedRoot) return null;
  const layout = await summarizeGatewayServiceLayout(
    params.command === void 0
      ? await resolveGatewayService()
          .readCommand(params.env ?? process.env)
          .catch(() => null)
      : params.command,
  );
  const serviceRoot = layout?.packageRoot;
  const serviceEntrypoint = layout?.entrypoint;
  if (
    !serviceRoot ||
    !serviceEntrypoint ||
    (!path.isAbsolute(serviceEntrypoint) && !path.win32.isAbsolute(serviceEntrypoint))
  )
    return null;
  const [expectedRootReal, serviceRootReal] = await Promise.all([
    tryRealpathOrResolve(expectedRoot),
    tryRealpathOrResolve(serviceRoot),
  ]);
  return expectedRootReal === serviceRootReal;
}
async function maybeRestartService(params) {
  const verifyRestartedGateway = async (expectedGatewayVersion, opts = {}) => {
    const restartAfterStaleCleanup = async () => {
      if (params.refreshServiceEnv && isPackageManagerUpdateMode(params.result.mode)) {
        await runUpdatedInstallGatewayRestart({
          result: params.result,
          jsonMode: Boolean(params.opts.json),
          invocationCwd: params.invocationCwd,
          env: params.serviceEnv,
          nodeRunner: params.nodeRunner,
        });
        return;
      }
      if (shouldUseLegacyProcessRestartAfterUpdate({ updateMode: params.result.mode }))
        await runDaemonRestart();
    };
    const service = resolveGatewayService();
    let health = await waitForGatewayHealthyRestart({
      service,
      port: params.gatewayPort,
      expectedVersion: expectedGatewayVersion,
      env: params.serviceEnv,
      requireRunningService: opts.requireRunningService,
    });
    if (!health.healthy && health.staleGatewayPids.length > 0) {
      if (!params.opts.json)
        defaultRuntime.log(
          theme.warn(
            `Found stale gateway process(es) after restart: ${health.staleGatewayPids.join(", ")}. Cleaning up...`,
          ),
        );
      await terminateStaleGatewayPids(health.staleGatewayPids);
      await restartAfterStaleCleanup();
      health = await waitForGatewayHealthyRestart({
        service,
        port: params.gatewayPort,
        expectedVersion: expectedGatewayVersion,
        env: params.serviceEnv,
        requireRunningService: opts.requireRunningService,
      });
    }
    const recoveryVerification = await recoverLaunchAgentAndRecheckGatewayHealth({
      health,
      service,
      port: params.gatewayPort,
      expectedVersion: expectedGatewayVersion,
      env: params.serviceEnv,
    });
    health = recoveryVerification.health;
    const launchAgentRecovery = recoveryVerification.launchAgentRecovery;
    if (launchAgentRecovery?.attempted)
      if (!params.opts.json)
        defaultRuntime.log(
          launchAgentRecovery.recovered
            ? theme.warn(launchAgentRecovery.message)
            : theme.warn(launchAgentRecovery.detail),
        );
      else
        defaultRuntime.error(
          launchAgentRecovery.recovered ? launchAgentRecovery.message : launchAgentRecovery.detail,
        );
    const serviceRuntimeHealthy =
      !opts.requireRunningService || health.runtime.status === "running";
    if (health.healthy && serviceRuntimeHealthy) {
      if (!params.opts.json) defaultRuntime.log(theme.success("Gateway: restarted and verified."));
      return true;
    }
    const diagnosticLines = [
      "Gateway did not become healthy after restart.",
      ...(health.healthy && opts.requireRunningService
        ? ["Gateway responded, but the managed service did not report running after restart."]
        : []),
      ...renderRestartDiagnostics(health),
      ...(launchAgentRecovery?.attempted
        ? [
            launchAgentRecovery.recovered
              ? `LaunchAgent recovery: ${launchAgentRecovery.message}`
              : `LaunchAgent recovery failed: ${launchAgentRecovery.detail}`,
          ]
        : []),
      `Restart log: ${resolveGatewayRestartLogPath(params.serviceEnv ?? process.env)}`,
      `Run \`${replaceCliName(formatCliCommand("openclaw gateway status --deep"), CLI_NAME$1)}\` for details.`,
      ...formatPostUpdateGatewayRecoveryInstructions(params.result),
    ];
    if (params.opts.json) defaultRuntime.error(diagnosticLines.join("\n"));
    else {
      defaultRuntime.log(theme.warn(diagnosticLines[0] ?? "Gateway did not become healthy."));
      for (const line of diagnosticLines.slice(1)) defaultRuntime.log(theme.muted(line));
    }
    if (isPackageManagerUpdateMode(params.result.mode) || opts.requireRunningService) return false;
    return !(health.versionMismatch || health.activatedPluginErrors?.length);
  };
  if (params.shouldRestart) {
    if (!params.opts.json) {
      defaultRuntime.log("");
      defaultRuntime.log(theme.heading("Restarting service..."));
    }
    try {
      const expectedGatewayVersion = isPackageManagerUpdateMode(params.result.mode)
        ? normalizeOptionalString(params.result.after?.version)
        : void 0;
      const isPackageUpdate = isPackageManagerUpdateMode(params.result.mode);
      const canVerifyUpdatedGatewayByVersion =
        expectedGatewayVersion !== void 0 &&
        expectedGatewayVersion !== normalizeOptionalString(params.result.before?.version);
      let restarted = false;
      let restartInitiated = false;
      let refreshedGatewayAlreadyHealthy = false;
      let updatedInstallRestartNeedsServiceRootProof = false;
      let restartScriptPath = params.restartScriptPath;
      if (params.refreshServiceEnv)
        try {
          await refreshGatewayServiceEnv({
            result: params.result,
            jsonMode: Boolean(params.opts.json),
            invocationCwd: params.invocationCwd,
            env: params.serviceEnv,
            nodeRunner: params.nodeRunner,
          });
          if (isPackageUpdate && expectedGatewayVersion) {
            refreshedGatewayAlreadyHealthy = (
              await waitForGatewayHealthyRestart({
                service: resolveGatewayService(),
                port: params.gatewayPort,
                expectedVersion: expectedGatewayVersion,
                env: params.serviceEnv,
                attempts: POST_REFRESH_ALREADY_HEALTHY_ATTEMPTS,
                delayMs: POST_REFRESH_ALREADY_HEALTHY_DELAY_MS,
              })
            ).healthy;
            if (refreshedGatewayAlreadyHealthy && !params.opts.json)
              defaultRuntime.log(
                theme.muted(
                  "Gateway already reports the updated version after service refresh; skipped redundant restart.",
                ),
              );
          }
        } catch (err) {
          const message = `Failed to refresh gateway service environment from updated install: ${String(err)}`;
          if (params.opts.json) defaultRuntime.error(message);
          else defaultRuntime.log(theme.warn(message));
          if (isPackageUpdate) {
            restartScriptPath = null;
            updatedInstallRestartNeedsServiceRootProof = !canVerifyUpdatedGatewayByVersion;
          }
        }
      if (!refreshedGatewayAlreadyHealthy && restartScriptPath) {
        await createUpdateConfigSnapshot();
        await runRestartScript(restartScriptPath);
        restartInitiated = true;
      } else if (!refreshedGatewayAlreadyHealthy && params.refreshServiceEnv && isPackageUpdate) {
        await createUpdateConfigSnapshot();
        restarted = await runUpdatedInstallGatewayRestart({
          result: params.result,
          jsonMode: Boolean(params.opts.json),
          invocationCwd: params.invocationCwd,
          env: params.serviceEnv,
          nodeRunner: params.nodeRunner,
        });
        if (
          updatedInstallRestartNeedsServiceRootProof &&
          (await gatewayServiceCommandUsesRoot({
            root: params.result.root,
            env: params.serviceEnv,
          })) !== true
        ) {
          if (!params.opts.json)
            defaultRuntime.log(
              theme.warn("Gateway service did not point at the updated install after restart."),
            );
          return false;
        }
      } else if (
        !refreshedGatewayAlreadyHealthy &&
        shouldUseLegacyProcessRestartAfterUpdate({ updateMode: params.result.mode }) &&
        !params.skipLegacyServiceRestart
      ) {
        await createUpdateConfigSnapshot();
        restarted = await runDaemonRestart();
      } else if (!refreshedGatewayAlreadyHealthy && !params.opts.json)
        defaultRuntime.log(theme.muted("Gateway: restart skipped (no installed service found)."));
      if (
        refreshedGatewayAlreadyHealthy ||
        restartInitiated ||
        (restarted && expectedGatewayVersion !== void 0)
      ) {
        if (
          !(await verifyRestartedGateway(expectedGatewayVersion, {
            requireRunningService:
              updatedInstallRestartNeedsServiceRootProof ||
              params.requireRunningServiceAfterRestart,
          }))
        ) {
          if (!params.opts.json) defaultRuntime.log("");
          return false;
        }
        if (!params.opts.json && restartInitiated) {
          defaultRuntime.log(theme.success("Daemon restart completed."));
          defaultRuntime.log("");
        }
      }
      if (!params.opts.json && restarted) {
        defaultRuntime.log(theme.success("Daemon restarted successfully."));
        defaultRuntime.log("");
        await createUpdateConfigSnapshot();
        process.env.OPENCLAW_UPDATE_IN_PROGRESS = "1";
        process.env[UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE_ENV] = "1";
        try {
          await doctorCommand(defaultRuntime, {
            nonInteractive: !(process.stdin.isTTY && !params.opts.json && params.opts.yes !== true),
            crossStateDirImports: false,
          });
        } catch (err) {
          defaultRuntime.log(theme.warn(`Doctor failed: ${String(err)}`));
        } finally {
          delete process.env.OPENCLAW_UPDATE_IN_PROGRESS;
          delete process.env[UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE_ENV];
        }
      }
    } catch (err) {
      if (!params.opts.json) {
        defaultRuntime.log(theme.warn(`Gateway: restart failed: ${String(err)}`));
        defaultRuntime.log(
          theme.muted(
            `You may need to restart the service manually: ${replaceCliName(formatCliCommand("openclaw gateway restart"), CLI_NAME$1)}`,
          ),
        );
      }
      if (
        isPackageManagerUpdateMode(params.result.mode) ||
        params.requireRunningServiceAfterRestart
      )
        return false;
    }
    return true;
  }
  if (!params.opts.json) {
    defaultRuntime.log("");
    defaultRuntime.log(theme.muted("Gateway: restart skipped (--no-restart)."));
    if (params.result.mode === "npm" || params.result.mode === "pnpm")
      defaultRuntime.log(
        theme.muted(
          `Tip: Run \`${replaceCliName(formatCliCommand("openclaw doctor"), CLI_NAME$1)}\`, then \`${replaceCliName(formatCliCommand("openclaw gateway restart"), CLI_NAME$1)}\` to apply updates to a running gateway.`,
        ),
      );
    else
      defaultRuntime.log(
        theme.muted(
          `Tip: Run \`${replaceCliName(formatCliCommand("openclaw gateway restart"), CLI_NAME$1)}\` to apply updates to a running gateway.`,
        ),
      );
  }
  return true;
}
//#endregion
//#region src/cli/update-cli/update-command-post-core.ts
const DEFAULT_UPDATE_STEP_TIMEOUT_MS$1 = 30 * 6e4;
const POST_CORE_UPDATE_ENV = "OPENCLAW_UPDATE_POST_CORE";
const POST_CORE_UPDATE_CHANNEL_ENV = "OPENCLAW_UPDATE_POST_CORE_CHANNEL";
const POST_CORE_UPDATE_REQUESTED_CHANNEL_ENV = "OPENCLAW_UPDATE_POST_CORE_REQUESTED_CHANNEL";
const POST_CORE_UPDATE_RESULT_PATH_ENV = "OPENCLAW_UPDATE_POST_CORE_RESULT_PATH";
const POST_CORE_UPDATE_INSTALL_RECORDS_PATH_ENV = "OPENCLAW_UPDATE_POST_CORE_INSTALL_RECORDS_PATH";
const POST_CORE_UPDATE_STARTED_AT_ENV = "OPENCLAW_UPDATE_POST_CORE_STARTED_AT_MS";
const POST_CORE_UPDATE_RESULT_POLL_MS = 100;
async function reportPreMutationUpdateFailure(params) {
  const result = {
    status: "error",
    mode: params.installKind === "git" ? "git" : "unknown",
    root: params.root,
    reason: params.reason,
    steps: [],
    durationMs: 0,
  };
  await writeControlPlaneUpdateRestartSentinelBestEffort({
    meta: params.controlPlaneUpdateSentinelMeta,
    result,
    jsonMode: Boolean(params.opts.json),
  });
  printResult(result, params.opts);
  defaultRuntime.exit(1);
}
function withUpdateFinalizationEnv(run) {
  const previousUpdateInProgress = process.env.OPENCLAW_UPDATE_IN_PROGRESS;
  const previousDeferConfiguredPluginInstallRepair =
    process.env[UPDATE_DEFER_CONFIGURED_PLUGIN_INSTALL_REPAIR_ENV];
  const previousParentSupportsDoctorConfigWrite =
    process.env[UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE_ENV];
  process.env.OPENCLAW_UPDATE_IN_PROGRESS = "1";
  process.env[UPDATE_DEFER_CONFIGURED_PLUGIN_INSTALL_REPAIR_ENV] = "1";
  process.env[UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE_ENV] = "1";
  return run().finally(() => {
    if (previousUpdateInProgress === void 0) delete process.env.OPENCLAW_UPDATE_IN_PROGRESS;
    else process.env.OPENCLAW_UPDATE_IN_PROGRESS = previousUpdateInProgress;
    if (previousDeferConfiguredPluginInstallRepair === void 0)
      delete process.env[UPDATE_DEFER_CONFIGURED_PLUGIN_INSTALL_REPAIR_ENV];
    else
      process.env[UPDATE_DEFER_CONFIGURED_PLUGIN_INSTALL_REPAIR_ENV] =
        previousDeferConfiguredPluginInstallRepair;
    if (previousParentSupportsDoctorConfigWrite === void 0)
      delete process.env[UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE_ENV];
    else
      process.env[UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE_ENV] =
        previousParentSupportsDoctorConfigWrite;
  });
}
async function updateFinalizeCommand(opts) {
  suppressDeprecations();
  const timeoutMs = parseTimeoutMsOrExit(opts.timeout);
  if (timeoutMs === null) return;
  assertConfigWriteAllowedInCurrentMode();
  const root = await resolveUpdateRoot();
  let configSnapshot = await readConfigFileSnapshot({ skipPluginValidation: true });
  const preFinalizeConfig =
    (await readPostCorePreUpdateSourceConfig({
      sourceConfigPath: process.env["OPENCLAW_UPDATE_POST_CORE_SOURCE_CONFIG_PATH"],
      currentSnapshot: configSnapshot,
    })) ??
    (configSnapshot.valid
      ? {
          sourceConfig: configSnapshot.sourceConfig,
          authoredConfig: isRecord(configSnapshot.parsed)
            ? configSnapshot.parsed
            : configSnapshot.sourceConfig,
        }
      : void 0);
  const requestedChannel = normalizeUpdateChannel(opts.channel);
  if (opts.channel && !requestedChannel) {
    defaultRuntime.error(
      `--channel must be "stable", "extended-stable", "beta", or "dev" (got "${opts.channel}")`,
    );
    defaultRuntime.exit(1);
    return;
  }
  if (requestedChannel === "extended-stable") {
    const updateStatus = await checkUpdateStatus({
      root,
      timeoutMs: timeoutMs ?? 3500,
      fetchGit: false,
      includeRegistry: false,
    });
    if (updateStatus.installKind === "git") {
      await reportPreMutationUpdateFailure({
        root,
        installKind: updateStatus.installKind,
        reason: "unsupported_git_channel",
        opts,
        controlPlaneUpdateSentinelMeta: null,
      });
      return;
    }
  }
  const storedChannel = configSnapshot.valid
    ? normalizeUpdateChannel(configSnapshot.config.update?.channel)
    : null;
  const effectiveChannel = normalizeUpdateChannel(
    process.env[UPDATE_EFFECTIVE_CHANNEL_ENV]?.trim(),
  );
  const channel = requestedChannel ?? storedChannel ?? effectiveChannel ?? "stable";
  if (requestedChannel)
    configSnapshot = await persistRequestedUpdateChannel({
      configSnapshot,
      requestedChannel,
    });
  const pluginUpdate = await withUpdateFinalizationEnv(async () => {
    await createUpdateConfigSnapshot();
    await doctorCommand(defaultRuntime, {
      nonInteractive: true,
      repair: true,
      yes: opts.yes === true,
      crossStateDirImports: false,
    });
    configSnapshot = await readConfigFileSnapshot({ skipPluginValidation: true });
    if (requestedChannel)
      configSnapshot = await persistRequestedUpdateChannel({
        configSnapshot,
        requestedChannel,
      });
    const restoredConfig = restoreDroppedPreUpdateChannels(configSnapshot, preFinalizeConfig);
    configSnapshot = restoredConfig.snapshot;
    const postDoctorStoredChannel = configSnapshot.valid
      ? normalizeUpdateChannel(configSnapshot.config.update?.channel)
      : null;
    const postDoctorChannel =
      requestedChannel ?? postDoctorStoredChannel ?? storedChannel ?? effectiveChannel ?? "stable";
    const pluginInstallRecords = await loadInstalledPluginIndexInstallRecords();
    return await updatePluginsAfterCoreUpdate({
      root,
      channel: postDoctorChannel,
      configSnapshot,
      configChanged: restoredConfig.changed,
      restoredAuthoredChannels: restoredConfig.authoredChannels,
      opts: {
        json: opts.json,
        timeout: opts.timeout,
        yes: opts.yes,
        restart: false,
        acknowledgeClawHubRisk: opts.acknowledgeClawHubRisk,
      },
      timeoutMs: timeoutMs ?? DEFAULT_UPDATE_STEP_TIMEOUT_MS$1,
      pluginInstallRecords,
    });
  });
  const result = {
    status:
      pluginUpdate.status === "error"
        ? "error"
        : pluginUpdate.status === "warning"
          ? "warning"
          : "ok",
    mode: "finalize",
    root,
    channel:
      requestedChannel ??
      (configSnapshot.valid
        ? normalizeUpdateChannel(configSnapshot.config.update?.channel)
        : null) ??
      channel,
    restart: false,
    postUpdate: {
      doctor: { status: "ok" },
      plugins: pluginUpdate,
    },
  };
  await tryWriteCompletionCache(root, Boolean(opts.json));
  if (opts.json) defaultRuntime.writeJson(result);
  else if (result.status === "ok")
    defaultRuntime.log(theme.muted("Update finalization completed."));
  if (result.status === "error") defaultRuntime.exit(1);
}
async function writePostCorePluginUpdateResultFile(filePath, result) {
  if (!filePath) return;
  await writeJson(filePath, result, { trailingNewline: true });
}
async function writePostCorePluginInstallRecordsFile(filePath, records) {
  await fs$1.writeFile(filePath, `${JSON.stringify(records)}\n`, "utf-8");
}
async function readPostCorePluginInstallRecordsFile(filePath) {
  if (!filePath) return;
  try {
    return normalizePluginInstallRecordMap(JSON.parse(await fs$1.readFile(filePath, "utf-8")));
  } catch {
    return;
  }
}
async function execFileStdout(file, args) {
  return await runExec(file, args, {
    logOutput: false,
    timeoutMs: 1e3,
  }).then(
    ({ stdout }) => stdout,
    () => void 0,
  );
}
async function readProcessStartTimeMs(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return;
  const raw =
    process.platform === "win32"
      ? await execFileStdout("powershell.exe", [
          "-NoProfile",
          "-NonInteractive",
          "-Command",
          `[Console]::Out.Write((Get-Process -Id ${pid}).StartTime.ToUniversalTime().ToString("o"))`,
        ])
      : await execFileStdout("ps", ["-o", "lstart=", "-p", String(pid)]);
  if (!raw) return;
  const parsed = Date.parse(raw.trim().replace(/\s+/g, " "));
  return Number.isFinite(parsed) ? parsed : void 0;
}
async function resolvePostCoreUpdateStartedAtMs(env) {
  const fromEnv = parseStrictPositiveInteger(env[POST_CORE_UPDATE_STARTED_AT_ENV] ?? "");
  if (fromEnv !== void 0) return fromEnv;
  return await readProcessStartTimeMs(process.ppid);
}
async function readPostCorePluginUpdateResultFile(filePath) {
  try {
    const parsed = await readJsonIfExists(filePath);
    if (
      parsed &&
      typeof parsed === "object" &&
      (parsed.status === "ok" ||
        parsed.status === "warning" ||
        parsed.status === "skipped" ||
        parsed.status === "error")
    )
      return parsed;
  } catch {
    return;
  }
}
function stopPostCoreUpdateChild(child) {
  if (process.platform === "win32" && child.pid)
    try {
      spawn(getWindowsSystem32ExePath("taskkill.exe"), ["/PID", String(child.pid), "/T", "/F"], {
        stdio: "ignore",
        windowsHide: true,
      }).once("error", () => {
        child.kill();
      });
      return;
    } catch {
      child.kill();
      return;
    }
  child.kill();
}
/**
 * Returns the stdio mode for the post-core-update child process.
 *
 * Windows shells (PowerShell/CMD) wait for all processes that hold inherited console handles to
 * exit before returning the prompt, even after the immediate child has exited.  Using "pipe" on
 * Windows prevents the child (and any grandchildren it spawns) from ever receiving a reference to
 * the parent's console handles, eliminating the terminal hang seen in #78445.
 *
 * @internal exported for testing
 */
function resolvePostCoreUpdateChildStdio(platform = process.platform) {
  return platform === "win32" ? "pipe" : "inherit";
}
function preparePostCorePluginInstallRecordsForFreshProcess(params) {
  if (!params.targetVersion) return params.records;
  const runtimeComparison = compareSemverStrings(VERSION, params.targetVersion);
  if (runtimeComparison === null || runtimeComparison <= 0) return params.records;
  let changed = false;
  const next = {};
  for (const [pluginId, record] of Object.entries(params.records)) {
    const installedVersion = record.resolvedVersion ?? record.version;
    const comparison = installedVersion
      ? compareSemverStrings(installedVersion, params.targetVersion)
      : null;
    if (record.source !== "npm" || comparison === null || comparison <= 0) {
      next[pluginId] = record;
      continue;
    }
    const { resolvedSpec: _resolvedSpec, resolvedVersion: _resolvedVersion, ...rest } = record;
    next[pluginId] = rest;
    changed = true;
  }
  return changed ? next : params.records;
}
async function continuePostCoreUpdateInFreshProcess(params) {
  const entryPath = await resolveGatewayInstallEntrypoint(params.root);
  if (!entryPath) return { resumed: false };
  const argv = [entryPath, "update"];
  if (params.opts.json) argv.push("--json");
  if (params.opts.restart === false) argv.push("--no-restart");
  if (params.opts.yes) argv.push("--yes");
  if (params.opts.acknowledgeClawHubRisk) argv.push("--acknowledge-clawhub-risk");
  if (params.opts.timeout) argv.push("--timeout", params.opts.timeout);
  const resultDir = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-update-post-core-"));
  const resultPath = path.join(resultDir, "plugins.json");
  const installRecordsPath = path.join(resultDir, "plugin-install-records.json");
  const sourceConfigPath = path.join(resultDir, "source-config.json");
  const postCoreHostVersion = await readPackageVersion(params.root);
  const pluginInstallRecords = preparePostCorePluginInstallRecordsForFreshProcess({
    records: params.pluginInstallRecords,
    targetVersion: postCoreHostVersion,
  });
  try {
    if (pluginInstallRecords && pluginInstallRecords !== params.pluginInstallRecords)
      await writePersistedInstalledPluginIndexInstallRecords(pluginInstallRecords);
    await writePostCorePluginInstallRecordsFile(installRecordsPath, pluginInstallRecords);
    await writePostCoreSourceConfigFile(sourceConfigPath, params.preUpdateConfig);
    const childStdio = resolvePostCoreUpdateChildStdio();
    const child = spawn(params.nodeRunner ?? resolveNodeRunner(), argv, {
      stdio: childStdio,
      env: {
        ...stripGatewayServiceMarkerEnv(disableUpdatedPackageCompileCacheEnv(process.env)),
        OPENCLAW_UPDATE_IN_PROGRESS: "1",
        [DOCTOR_DISABLE_CROSS_STATE_DIR_IMPORTS_ENV]: "1",
        [POST_CORE_UPDATE_ENV]: "1",
        [POST_CORE_UPDATE_CHANNEL_ENV]: params.channel,
        ...(params.requestedChannel
          ? { [POST_CORE_UPDATE_REQUESTED_CHANNEL_ENV]: params.requestedChannel }
          : {}),
        [POST_CORE_UPDATE_RESULT_PATH_ENV]: resultPath,
        [POST_CORE_UPDATE_INSTALL_RECORDS_PATH_ENV]: installRecordsPath,
        [POST_CORE_UPDATE_STARTED_AT_ENV]: String(params.updateStartedAtMs),
        ...(postCoreHostVersion === null
          ? {}
          : { OPENCLAW_COMPATIBILITY_HOST_VERSION: postCoreHostVersion }),
        ...(params.preUpdateConfig
          ? { [POST_CORE_UPDATE_SOURCE_CONFIG_PATH_ENV]: sourceConfigPath }
          : {}),
      },
    });
    if (childStdio === "pipe") {
      child.stdout?.pipe(process.stdout);
      child.stderr?.pipe(process.stderr);
    }
    const childResult = await new Promise((resolve, reject) => {
      let settled = false;
      const finish = (result) => {
        if (settled) return;
        settled = true;
        clearInterval(resultPoll);
        resolve(result);
      };
      const resultPoll = setInterval(() => {
        readPostCorePluginUpdateResultFile(resultPath)
          .then((pluginUpdate) => {
            if (!pluginUpdate) return;
            stopPostCoreUpdateChild(child);
            finish({
              kind: "plugin-update",
              pluginUpdate,
            });
          })
          .catch(() => void 0);
      }, POST_CORE_UPDATE_RESULT_POLL_MS);
      child.once("error", (error) => {
        if (settled) return;
        settled = true;
        clearInterval(resultPoll);
        reject(error);
      });
      child.once("exit", (code, signal) => {
        if (settled) return;
        if (signal) {
          settled = true;
          clearInterval(resultPoll);
          reject(/* @__PURE__ */ new Error(`post-update process terminated by signal ${signal}`));
          return;
        }
        finish({
          kind: "exit",
          exitCode: code ?? 1,
        });
      });
    });
    const pluginUpdate =
      childResult.kind === "plugin-update"
        ? childResult.pluginUpdate
        : await readPostCorePluginUpdateResultFile(resultPath);
    const exitCode = childResult.kind === "exit" ? childResult.exitCode : 0;
    if (exitCode !== 0) {
      if (pluginUpdate)
        return {
          resumed: true,
          pluginUpdate,
        };
      return {
        resumed: false,
        exitCode,
      };
    }
    return {
      resumed: true,
      ...(pluginUpdate ? { pluginUpdate } : {}),
    };
  } finally {
    await fs$1
      .rm(resultDir, {
        recursive: true,
        force: true,
      })
      .catch(() => void 0);
  }
}
function shouldResumePostCoreUpdateInFreshProcess(params) {
  if (params.downgradeRisk) return false;
  if (isPackageManagerUpdateMode(params.result.mode)) return true;
  if (params.result.mode !== "git") return false;
  const beforeSha = normalizeOptionalString(params.result.before?.sha);
  const afterSha = normalizeOptionalString(params.result.after?.sha);
  if (beforeSha && afterSha && beforeSha !== afterSha) return true;
  const beforeVersion = normalizeOptionalString(params.result.before?.version);
  const afterVersion = normalizeOptionalString(params.result.after?.version);
  return Boolean(beforeVersion && afterVersion && beforeVersion !== afterVersion);
}
async function writeControlPlaneUpdateRestartSentinelBestEffort(params) {
  if (!params.meta) return;
  try {
    await writeControlPlaneUpdateRestartSentinel({
      meta: params.meta,
      result: params.result,
    });
  } catch (err) {
    const message = `Failed to write update.run restart sentinel: ${String(err)}`;
    if (params.jsonMode) defaultRuntime.error(message);
    else defaultRuntime.log(theme.warn(message));
  }
}
async function markControlPlaneUpdateRestartSentinelFailureBestEffort(params) {
  if (!params.meta) return;
  try {
    await markControlPlaneUpdateRestartSentinelFailure(params.reason);
  } catch (err) {
    const message = `Failed to mark update.run restart sentinel failed: ${String(err)}`;
    if (params.jsonMode) defaultRuntime.error(message);
    else defaultRuntime.log(theme.warn(message));
  }
}
//#endregion
//#region src/cli/update-cli/update-command.ts
const CLI_NAME = resolveCliName();
const DEFAULT_UPDATE_STEP_TIMEOUT_MS = 30 * 6e4;
const UPDATE_QUIPS = [
  "Leveled up! New skills unlocked. You're welcome.",
  "Fresh code, same lobster. Miss me?",
  "Back and better. Did you even notice I was gone?",
  "Update complete. I learned some new tricks while I was out.",
  "Upgraded! Now with 23% more sass.",
  "I've evolved. Try to keep up.",
  "New version, who dis? Oh right, still me but shinier.",
  "Patched, polished, and ready to pinch. Let's go.",
  "The lobster has molted. Harder shell, sharper claws.",
  "Update done! Check the changelog or just trust me, it's good.",
  "Reborn from the boiling waters of npm. Stronger now.",
  "I went away and came back smarter. You should try it sometime.",
  "Update complete. The bugs feared me, so they left.",
  "New version installed. Old version sends its regards.",
  "Firmware fresh. Brain wrinkles: increased.",
  "I've seen things you wouldn't believe. Anyway, I'm updated.",
  "Back online. The changelog is long but our friendship is longer.",
  "Upgraded! Peter fixed stuff. Blame him if it breaks.",
  "Molting complete. Please don't look at my soft shell phase.",
  "Version bump! Same chaos energy, fewer crashes (probably).",
];
function pickUpdateQuip() {
  return UPDATE_QUIPS[Math.floor(Math.random() * UPDATE_QUIPS.length)] ?? "Update complete.";
}
function printDryRunPreview(preview, jsonMode) {
  if (jsonMode) {
    defaultRuntime.writeJson(preview);
    return;
  }
  defaultRuntime.log(theme.heading("Update dry-run"));
  defaultRuntime.log(theme.muted("No changes were applied."));
  defaultRuntime.log("");
  defaultRuntime.log(`  Root: ${theme.muted(preview.root)}`);
  defaultRuntime.log(`  Install kind: ${theme.muted(preview.installKind)}`);
  defaultRuntime.log(`  Mode: ${theme.muted(preview.mode)}`);
  defaultRuntime.log(`  Channel: ${theme.muted(preview.effectiveChannel)}`);
  defaultRuntime.log(`  Tag/spec: ${theme.muted(preview.tag)}`);
  if (preview.currentVersion)
    defaultRuntime.log(`  Current version: ${theme.muted(preview.currentVersion)}`);
  if (preview.targetVersion)
    defaultRuntime.log(`  Target version: ${theme.muted(preview.targetVersion)}`);
  if (preview.downgradeRisk)
    defaultRuntime.log(theme.warn("  Downgrade confirmation would be required in a real run."));
  defaultRuntime.log("");
  defaultRuntime.log(theme.heading("Planned actions:"));
  for (const action of preview.actions) defaultRuntime.log(`  - ${action}`);
  if (preview.notes.length > 0) {
    defaultRuntime.log("");
    defaultRuntime.log(theme.heading("Notes:"));
    for (const note of preview.notes) defaultRuntime.log(`  - ${theme.muted(note)}`);
  }
}
async function runPackageInstallUpdate(params) {
  const installEnv = params.installEnv ?? (await createGlobalInstallEnv());
  const runCommand = createGlobalCommandRunner();
  let installTarget = params.installTarget;
  if (!installTarget)
    installTarget = await resolveGlobalInstallTarget({
      manager: await resolveGlobalManager({
        root: params.root,
        installKind: params.installKind,
        timeoutMs: params.timeoutMs,
      }),
      runCommand,
      timeoutMs: params.timeoutMs,
      pkgRoot: params.root,
      honorPackageRoot: params.honorPackageRoot === true,
    });
  const pkgRoot = installTarget.packageRoot;
  const packageName =
    (pkgRoot ? await readPackageName(pkgRoot) : await readPackageName(params.root)) ?? "openclaw";
  const installSpec =
    params.installSpec ??
    resolveGlobalInstallSpec({
      packageName,
      tag: params.tag,
      env: installEnv,
    });
  const beforeVersion = pkgRoot ? await readPackageVersion(pkgRoot) : null;
  if (pkgRoot)
    await cleanupGlobalRenameDirs({
      globalRoot: path.dirname(pkgRoot),
      packageName,
    });
  const diskWarning = createLowDiskSpaceWarning({
    targetPath: pkgRoot ? path.dirname(pkgRoot) : params.root,
    purpose: "global package update",
  });
  if (diskWarning)
    if (params.jsonMode) defaultRuntime.error(`Warning: ${diskWarning}`);
    else defaultRuntime.log(theme.warn(diskWarning));
  const packageUpdate = await runGlobalPackageUpdateSteps({
    installTarget,
    installSpec,
    packageName,
    packageRoot: pkgRoot,
    runCommand,
    timeoutMs: params.timeoutMs,
    ...(installEnv === void 0 ? {} : { env: installEnv }),
    runStep: (stepParams) =>
      runUpdateStep({
        ...stepParams,
        progress: params.progress,
      }),
    postVerifyStep: async (verifiedPackageRoot) => {
      const entryPath = await resolveGatewayInstallEntrypoint(verifiedPackageRoot);
      if (entryPath) {
        await createUpdateConfigSnapshot();
        const candidateHostVersion = await readPackageVersion(verifiedPackageRoot);
        const doctorResultPath = createUpdatePostInstallDoctorResultPath();
        const doctorPolicy = resolveUpdateDoctorExecutionPolicy({
          targetVersion: candidateHostVersion,
          allowGatewayServiceRepair: params.allowGatewayServiceRepair,
        });
        const doctorArgv = [
          params.nodeRunner ?? resolveNodeRunner(),
          entryPath,
          "doctor",
          "--non-interactive",
          ...(doctorPolicy.fix ? ["--fix"] : []),
        ];
        const doctorProgressInfo = {
          name: `${CLI_NAME} doctor`,
          command: doctorArgv.join(" "),
          index: 0,
          total: 0,
        };
        params.progress?.onStepStart?.(doctorProgressInfo);
        const completedDoctorStep = markPackagePostInstallDoctorAdvisory(
          await runUpdateStep({
            name: `${CLI_NAME} doctor`,
            argv: doctorArgv,
            cwd: verifiedPackageRoot,
            env: {
              ...resolvePostInstallDoctorEnv({
                serviceEnv: params.managedServiceEnv,
                invocationCwd: params.invocationCwd,
              }),
              OPENCLAW_UPDATE_IN_PROGRESS: "1",
              [UPDATE_DEFER_CONFIGURED_PLUGIN_INSTALL_REPAIR_ENV]: "1",
              [UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE_ENV]: "1",
              [UPDATE_PARENT_SUPPORTS_GATEWAY_RESTART_ENV]: "1",
              [UPDATE_PARENT_ALLOWS_GATEWAY_SERVICE_REPAIR_ENV]: params.allowGatewayServiceRepair
                ? "1"
                : "0",
              [UPDATE_PARENT_ALLOWS_GATEWAY_ACTIVATION_ENV]: params.allowGatewayActivation
                ? "1"
                : "0",
              ...(doctorPolicy.serviceRepairPolicy
                ? { OPENCLAW_SERVICE_REPAIR_POLICY: doctorPolicy.serviceRepairPolicy }
                : {}),
              [UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV]: doctorResultPath,
              ...(candidateHostVersion === null
                ? {}
                : { OPENCLAW_COMPATIBILITY_HOST_VERSION: candidateHostVersion }),
            },
            timeoutMs: params.timeoutMs,
          }),
          await consumeUpdatePostInstallDoctorResult(doctorResultPath),
        );
        params.progress?.onStepComplete?.({
          ...doctorProgressInfo,
          durationMs: completedDoctorStep.durationMs,
          exitCode: completedDoctorStep.exitCode,
          stderrTail: completedDoctorStep.stderrTail,
          signal: completedDoctorStep.signal,
          killed: completedDoctorStep.killed,
          termination: completedDoctorStep.termination,
          advisory: completedDoctorStep.advisory,
        });
        return completedDoctorStep;
      }
      return null;
    },
  });
  return {
    status: packageUpdate.failedStep ? "error" : "ok",
    mode: installTarget.manager,
    root: packageUpdate.verifiedPackageRoot ?? params.root,
    reason: packageUpdate.failedStep ? packageUpdate.failedStep.name : void 0,
    before: { version: beforeVersion },
    after: { version: packageUpdate.afterVersion ?? beforeVersion },
    steps: packageUpdate.steps,
    durationMs: Date.now() - params.startedAt,
  };
}
async function runGitUpdate(params) {
  const updateRoot = params.switchToGit ? resolveGitInstallDir() : params.root;
  const effectiveTimeout = params.timeoutMs ?? DEFAULT_UPDATE_STEP_TIMEOUT_MS;
  const installEnv = await createGlobalInstallEnv();
  const cloneStep = params.switchToGit
    ? await ensureGitCheckout({
        dir: updateRoot,
        env: installEnv,
        timeoutMs: effectiveTimeout,
        progress: params.progress,
      })
    : null;
  if (cloneStep && cloneStep.exitCode !== 0) {
    const result = {
      status: "error",
      mode: "git",
      root: updateRoot,
      reason: cloneStep.name,
      steps: [cloneStep],
      durationMs: Date.now() - params.startedAt,
    };
    params.stop();
    printResult(result, {
      ...params.opts,
      hideSteps: params.showProgress,
    });
    defaultRuntime.exit(1);
    return result;
  }
  const updateResult = await runGatewayUpdate({
    cwd: updateRoot,
    argv1: params.switchToGit ? void 0 : process.argv[1],
    timeoutMs: params.timeoutMs,
    progress: params.progress,
    channel: params.channel,
    tag: params.tag,
    devTargetRef: params.devTargetRef,
    deferConfiguredPluginInstallRepair: true,
    allowGatewayServiceRepair: params.allowGatewayServiceRepair,
    allowGatewayActivation: params.allowGatewayActivation,
    beforeGitMutation: params.beforeGitMutation,
  });
  const steps = [...(cloneStep ? [cloneStep] : []), ...updateResult.steps];
  if (params.switchToGit && updateResult.status === "ok") {
    const installTarget = await resolveGlobalInstallTarget({
      manager: await resolveGlobalManager({
        root: params.root,
        installKind: params.installKind,
        timeoutMs: effectiveTimeout,
      }),
      runCommand: createGlobalCommandRunner(),
      timeoutMs: effectiveTimeout,
      pkgRoot: params.root,
    });
    const installStep = await runUpdateStep({
      name: "global install",
      argv: globalInstallArgs(
        installTarget,
        updateRoot,
        void 0,
        installTarget.manager === "pnpm"
          ? resolvePnpmGlobalDirFromGlobalRoot(installTarget.globalRoot)
          : null,
      ),
      cwd: updateRoot,
      env: installEnv,
      timeoutMs: effectiveTimeout,
      progress: params.progress,
    });
    steps.push(installStep);
    const failedStep = installStep.exitCode !== 0 ? installStep : null;
    return {
      ...updateResult,
      status: updateResult.status === "ok" && !failedStep ? "ok" : "error",
      steps,
      durationMs: Date.now() - params.startedAt,
    };
  }
  return {
    ...updateResult,
    steps,
    durationMs: Date.now() - params.startedAt,
  };
}
async function withUpdateInProgressEnv(run) {
  const previousUpdateInProgress = process.env.OPENCLAW_UPDATE_IN_PROGRESS;
  process.env.OPENCLAW_UPDATE_IN_PROGRESS = "1";
  return run().finally(() => {
    if (previousUpdateInProgress === void 0) delete process.env.OPENCLAW_UPDATE_IN_PROGRESS;
    else process.env.OPENCLAW_UPDATE_IN_PROGRESS = previousUpdateInProgress;
  });
}
async function updateCommand(opts) {
  const recoveryState = {};
  return await withUpdateInProgressEnv(async () => {
    try {
      await updateCommandInternal(opts, recoveryState);
    } finally {
      try {
        await recoveryState.windowsTaskAutoStartRecovery?.restore();
      } finally {
        recoveryState.windowsTaskAutoStartRecovery?.complete();
      }
    }
  });
}
async function updateCommandInternal(opts, recoveryState) {
  suppressDeprecations();
  await cleanupStaleManagedServiceUpdateHandoffs().catch(() => void 0);
  const invocationCwd = tryResolveInvocationCwd();
  const postCoreUpdateResume = process.env[POST_CORE_UPDATE_ENV] === "1";
  const postCoreUpdateChannel = process.env[POST_CORE_UPDATE_CHANNEL_ENV]?.trim();
  const postCoreRequestedChannelInput =
    process.env["OPENCLAW_UPDATE_POST_CORE_REQUESTED_CHANNEL"]?.trim() ?? "";
  const postCoreInstallRecordsPath = process.env[POST_CORE_UPDATE_INSTALL_RECORDS_PATH_ENV];
  const timeoutMs = parseTimeoutMsOrExit(opts.timeout);
  const shouldRestart = opts.restart !== false;
  if (timeoutMs === null) return;
  if (opts.dryRun !== true)
    try {
      assertConfigWriteAllowedInCurrentMode();
    } catch (err) {
      await disableCurrentOpenClawUpdateLaunchdJob().catch(() => void 0);
      throw err;
    }
  const updateStepTimeoutMs = timeoutMs ?? DEFAULT_UPDATE_STEP_TIMEOUT_MS;
  let root = await resolveUpdateRoot();
  if (postCoreUpdateResume) {
    if (
      postCoreUpdateChannel !== "stable" &&
      postCoreUpdateChannel !== "extended-stable" &&
      postCoreUpdateChannel !== "beta" &&
      postCoreUpdateChannel !== "dev"
    ) {
      defaultRuntime.error("Missing post-core update channel context.");
      defaultRuntime.exit(1);
      return;
    }
    const postCoreRequestedChannel = postCoreRequestedChannelInput
      ? normalizeUpdateChannel(postCoreRequestedChannelInput)
      : null;
    if (postCoreRequestedChannelInput && !postCoreRequestedChannel) {
      defaultRuntime.error("Invalid post-core requested update channel context.");
      defaultRuntime.exit(1);
      return;
    }
    process.env.OPENCLAW_COMPATIBILITY_HOST_VERSION = (await readPackageVersion(root)) ?? VERSION;
    let postCoreConfigSnapshot = await readConfigFileSnapshot({
      skipPluginValidation: true,
      suppressFutureVersionWarning: true,
    });
    const preUpdateSourceConfig = await readPostCorePreUpdateSourceConfig({
      sourceConfigPath: process.env[POST_CORE_UPDATE_SOURCE_CONFIG_PATH_ENV],
      currentSnapshot: postCoreConfigSnapshot,
      updateStartedAtMs: await resolvePostCoreUpdateStartedAtMs(process.env),
    });
    postCoreConfigSnapshot = await persistRequestedUpdateChannel({
      configSnapshot: postCoreConfigSnapshot,
      requestedChannel: postCoreRequestedChannel,
    });
    const restoredPostCoreConfig = restoreDroppedPreUpdateChannels(
      postCoreConfigSnapshot,
      preUpdateSourceConfig,
    );
    const parentPluginInstallRecords = await readPostCorePluginInstallRecordsFile(
      postCoreInstallRecordsPath,
    );
    const currentPluginInstallRecords = await loadInstalledPluginIndexInstallRecords();
    const pluginInstallRecords =
      Object.keys(currentPluginInstallRecords).length > 0
        ? currentPluginInstallRecords
        : parentPluginInstallRecords;
    const pluginUpdate = await updatePluginsAfterCoreUpdate({
      root,
      channel: postCoreUpdateChannel,
      configSnapshot: restoredPostCoreConfig.snapshot,
      configChanged: restoredPostCoreConfig.changed,
      restoredAuthoredChannels: restoredPostCoreConfig.authoredChannels,
      opts,
      timeoutMs: updateStepTimeoutMs,
      pluginInstallRecords,
    });
    if (process.env["OPENCLAW_UPDATE_POST_CORE_RESULT_PATH"])
      await writePostCorePluginUpdateResultFile(
        process.env[POST_CORE_UPDATE_RESULT_PATH_ENV],
        pluginUpdate,
      );
    if (opts.json) {
      if (!process.env["OPENCLAW_UPDATE_POST_CORE_RESULT_PATH"]) {
        const result = {
          status: pluginUpdate.status === "error" ? "error" : "ok",
          mode: "unknown",
          root,
          steps: [],
          durationMs: 0,
          postUpdate: { plugins: pluginUpdate },
        };
        defaultRuntime.writeJson(result);
      }
    }
    defaultRuntime.exit(0);
    return;
  }
  const controlPlaneUpdateSentinelMeta = await readControlPlaneUpdateSentinelMeta();
  const updateStatus = await checkUpdateStatus({
    root,
    timeoutMs: timeoutMs ?? 3500,
    fetchGit: false,
    includeRegistry: false,
  });
  const requestedChannel = normalizeUpdateChannel(opts.channel);
  if (opts.channel && !requestedChannel) {
    defaultRuntime.error(
      `--channel must be "stable", "extended-stable", "beta", or "dev" (got "${opts.channel}")`,
    );
    defaultRuntime.exit(1);
    return;
  }
  if (requestedChannel === "extended-stable" && updateStatus.installKind === "git") {
    await reportPreMutationUpdateFailure({
      root,
      installKind: updateStatus.installKind,
      reason: "unsupported_git_channel",
      opts,
      controlPlaneUpdateSentinelMeta,
    });
    return;
  }
  let configSnapshot = await readConfigFileSnapshot({ skipPluginValidation: true });
  if (opts.channel && !opts.dryRun && !configSnapshot.valid)
    configSnapshot = await maybeRepairLegacyConfigForUpdateChannel({
      configSnapshot,
      jsonMode: Boolean(opts.json),
    });
  const storedChannel = configSnapshot.valid
    ? normalizeUpdateChannel(configSnapshot.config.update?.channel)
    : null;
  if (opts.channel && !configSnapshot.valid) {
    const issues = formatConfigIssueLines(configSnapshot.issues, "-");
    defaultRuntime.error(["Config is invalid; cannot set update channel.", ...issues].join("\n"));
    defaultRuntime.exit(1);
    return;
  }
  const installKind = updateStatus.installKind;
  if (
    (requestedChannel ?? storedChannel ?? (installKind === "git" ? "dev" : "stable")) ===
      "extended-stable" &&
    installKind === "git"
  ) {
    await reportPreMutationUpdateFailure({
      root,
      installKind,
      reason: "unsupported_git_channel",
      opts,
      controlPlaneUpdateSentinelMeta,
    });
    return;
  }
  const switchToGit = requestedChannel === "dev" && installKind !== "git";
  const switchToPackage =
    requestedChannel !== null && requestedChannel !== "dev" && installKind === "git";
  const updateInstallKind = switchToGit ? "git" : switchToPackage ? "package" : installKind;
  const channel =
    requestedChannel ?? storedChannel ?? (updateInstallKind === "git" ? "dev" : "stable");
  const devTargetRef =
    channel === "dev" ? process.env.OPENCLAW_UPDATE_DEV_TARGET_REF?.trim() || void 0 : void 0;
  const explicitTag = normalizeTag(opts.tag);
  if (channel === "extended-stable" && explicitTag) {
    await reportPreMutationUpdateFailure({
      root,
      installKind: updateInstallKind,
      reason: EXTENDED_STABLE_TAG_UNSUPPORTED_REASON,
      opts,
      controlPlaneUpdateSentinelMeta,
    });
    return;
  }
  let tag = explicitTag ?? channelToNpmTag(channel);
  let currentVersion = null;
  let targetVersion = null;
  let downgradeRisk = false;
  let fallbackToLatest = false;
  let packageInstallSpec = null;
  let packageInstallEnv;
  let packageInstallCwd;
  let packageInstallTarget;
  let installedPackageName = DEFAULT_PACKAGE_NAME;
  let packageAlreadyCurrent = false;
  let managedServiceRootRedirect = null;
  let managedServiceNodeRunner;
  if (updateInstallKind === "package") {
    managedServiceRootRedirect = await resolveManagedServicePackageUpdateRoot({ root });
    if (managedServiceRootRedirect) {
      root = managedServiceRootRedirect.root;
      managedServiceNodeRunner = managedServiceRootRedirect.nodeRunner;
      if (!opts.json) {
        defaultRuntime.log(
          theme.muted(
            `Targeting managed gateway service package root: ${managedServiceRootRedirect.root}`,
          ),
        );
        defaultRuntime.log(
          theme.warn(
            `Shell OpenClaw root differs from the managed gateway service root: ${managedServiceRootRedirect.previousRoot}`,
          ),
        );
        defaultRuntime.log(
          theme.muted(
            `After the update, make sure \`${CLI_NAME}\` on PATH resolves to the managed service root or reinstall the gateway service from the shell install you want to use.`,
          ),
        );
        if (managedServiceNodeRunner)
          defaultRuntime.log(
            theme.muted(`Managed gateway service Node: ${managedServiceNodeRunner}`),
          );
      }
    } else {
      managedServiceNodeRunner = await resolveManagedServiceNodeRunnerOverride();
      if (managedServiceNodeRunner && !opts.json) {
        defaultRuntime.log(
          theme.warn(
            `Current Node (${resolveNodeRunner()}) differs from the managed gateway service Node (${managedServiceNodeRunner}).`,
          ),
        );
        defaultRuntime.log(
          theme.muted(
            `Using the managed service Node for this update so the gateway can start after the upgrade.`,
          ),
        );
      }
    }
  }
  if (updateInstallKind !== "git") {
    packageInstallEnv = await createGlobalInstallEnv();
    packageInstallCwd = tryResolveInvocationCwd();
    if (updateInstallKind === "package") {
      installedPackageName = (await readPackageName(root)) ?? "openclaw";
      packageInstallTarget = await resolveGlobalInstallTarget({
        manager: await resolveGlobalManager({
          root,
          installKind,
          timeoutMs: updateStepTimeoutMs,
        }),
        runCommand: createGlobalCommandRunner(),
        timeoutMs: updateStepTimeoutMs,
        pkgRoot: root,
        honorPackageRoot:
          managedServiceRootRedirect !== null || managedServiceNodeRunner !== void 0,
        packageName: installedPackageName,
      });
    }
    const npmMetadataCommand =
      packageInstallTarget?.manager === "npm" ? packageInstallTarget.command : void 0;
    currentVersion = switchToPackage ? null : await readPackageVersion(root);
    if (channel === "extended-stable") {
      const extendedStable = await resolveExtendedStablePackage({
        installKind: updateInstallKind,
        timeoutMs,
        packageName: installedPackageName,
      });
      if (extendedStable.status === "failed") {
        await reportPreMutationUpdateFailure({
          root,
          installKind: updateInstallKind,
          reason: extendedStable.reason,
          opts,
          controlPlaneUpdateSentinelMeta,
        });
        return;
      }
      targetVersion = extendedStable.version;
      tag = extendedStable.version;
      packageInstallSpec = extendedStable.packageSpec;
    } else if (explicitTag) {
      const explicitSpec = resolveGlobalInstallSpec({
        packageName: DEFAULT_PACKAGE_NAME,
        tag,
        env: packageInstallEnv,
      });
      targetVersion = await resolveTargetVersion(tag, timeoutMs, {
        spec: explicitSpec,
        command: npmMetadataCommand,
        cwd: packageInstallCwd,
        env: packageInstallEnv,
      });
    } else
      targetVersion = await resolveNpmChannelTag({
        channel,
        timeoutMs,
        command: npmMetadataCommand,
        cwd: packageInstallCwd,
        env: packageInstallEnv,
      }).then((resolved) => {
        tag = resolved.tag;
        fallbackToLatest = channel === "beta" && resolved.tag === "latest";
        return resolved.version;
      });
    const cmp =
      currentVersion && targetVersion ? compareSemverStrings(currentVersion, targetVersion) : null;
    packageAlreadyCurrent =
      updateInstallKind === "package" &&
      !switchToPackage &&
      currentVersion != null &&
      targetVersion != null &&
      currentVersion === targetVersion &&
      (requestedChannel === null || requestedChannel === storedChannel);
    downgradeRisk =
      canResolveRegistryVersionForPackageTarget(tag) &&
      !fallbackToLatest &&
      currentVersion != null &&
      (targetVersion == null ? tag !== "latest" : cmp != null && cmp > 0);
    packageInstallSpec ??= resolveGlobalInstallSpec({
      packageName: DEFAULT_PACKAGE_NAME,
      tag,
      env: packageInstallEnv,
    });
  }
  if (opts.dryRun) {
    let mode = "unknown";
    if (updateInstallKind === "git") mode = "git";
    else if (updateInstallKind === "package")
      mode = await resolveGlobalManager({
        root,
        installKind,
        timeoutMs: updateStepTimeoutMs,
      });
    const actions = [];
    if (requestedChannel && requestedChannel !== storedChannel)
      actions.push(`Persist update.channel=${requestedChannel} in config`);
    if (switchToGit) actions.push("Switch install mode from package to git checkout (dev channel)");
    else if (switchToPackage)
      actions.push(`Switch install mode from git to package manager (${mode})`);
    else if (updateInstallKind === "git")
      actions.push(`Run git update flow on channel ${channel} (fetch/rebase/build/doctor)`);
    else if (packageAlreadyCurrent)
      actions.push(
        `Refresh package install with spec ${packageInstallSpec ?? tag}; current version already matches ${targetVersion}`,
      );
    else actions.push(`Run global package manager update with spec ${packageInstallSpec ?? tag}`);
    actions.push("Run plugin update sync after core update");
    actions.push("Refresh shell completion cache (if needed)");
    actions.push(
      shouldRestart
        ? "Restart gateway service and run doctor checks"
        : "Skip restart (because --no-restart is set)",
    );
    const notes = [];
    if (opts.tag && updateInstallKind === "git")
      notes.push("--tag applies to npm installs only; git updates ignore it.");
    if (fallbackToLatest) notes.push("Beta channel resolves to latest for this run (fallback).");
    if (managedServiceRootRedirect)
      notes.push(
        `Package update targets managed service root ${managedServiceRootRedirect.root} instead of invoking root ${managedServiceRootRedirect.previousRoot}.`,
      );
    if (explicitTag && !canResolveRegistryVersionForPackageTarget(tag))
      notes.push("Non-registry package specs skip npm version lookup and downgrade previews.");
    printDryRunPreview(
      {
        dryRun: true,
        root,
        installKind,
        mode,
        updateInstallKind,
        switchToGit,
        switchToPackage,
        restart: shouldRestart,
        requestedChannel,
        storedChannel,
        effectiveChannel: channel,
        tag: packageInstallSpec ?? tag,
        currentVersion,
        targetVersion,
        downgradeRisk,
        actions,
        notes,
      },
      Boolean(opts.json),
    );
    return;
  }
  if (downgradeRisk && !opts.yes) {
    if (!process.stdin.isTTY || opts.json) {
      defaultRuntime.error(
        [
          "Downgrade confirmation required.",
          "Downgrading can break configuration. Re-run in a TTY to confirm.",
        ].join("\n"),
      );
      defaultRuntime.exit(1);
      return;
    }
    const targetLabel = targetVersion ?? `${tag} (unknown)`;
    const ok = await confirm({
      message: stylePromptMessage(
        `Downgrading from ${currentVersion} to ${targetLabel} can break configuration. Continue?`,
      ),
      initialValue: false,
    });
    if (isCancel(ok) || !ok) {
      if (!opts.json) defaultRuntime.log(theme.muted("Update cancelled."));
      defaultRuntime.exit(0);
      return;
    }
  }
  if (updateInstallKind === "git" && opts.tag && !opts.json)
    defaultRuntime.log(
      theme.muted("Note: --tag applies to npm installs only; git updates ignore it."),
    );
  if (updateInstallKind === "package") {
    const runtimePreflightError = await resolvePackageRuntimePreflightError({
      tag,
      spec: packageInstallSpec ?? void 0,
      timeoutMs,
      nodeRunner: managedServiceNodeRunner,
      command: packageInstallTarget?.manager === "npm" ? packageInstallTarget.command : void 0,
      cwd: packageInstallCwd,
      env: packageInstallEnv,
    });
    if (runtimePreflightError) {
      defaultRuntime.error(runtimePreflightError);
      defaultRuntime.exit(1);
      return;
    }
  }
  await disableCurrentOpenClawUpdateLaunchdJob().catch(() => void 0);
  const showProgress = !opts.json && process.stdout.isTTY;
  if (!opts.json) {
    defaultRuntime.log(theme.heading("Updating OpenClaw..."));
    defaultRuntime.log("");
  }
  const { progress, stop } = createUpdateProgress(showProgress);
  const startedAt = Date.now();
  const preUpdatePluginInstallRecords = await loadInstalledPluginIndexInstallRecords();
  let preManagedServiceStop;
  const gitMutationRoots =
    updateInstallKind === "git" ? (switchToGit ? [root, resolveGitInstallDir()] : [root]) : null;
  const stopManagedServiceBeforeMutableUpdate = async (mutationRoots = [root]) => {
    if (updateInstallKind !== "package" && updateInstallKind !== "git") return;
    try {
      const uniqueMutationRoots = Array.from(new Set(mutationRoots));
      for (const mutationRoot of uniqueMutationRoots) {
        preManagedServiceStop = await maybeStopManagedServiceBeforeMutableUpdate({
          updateInstallKind,
          root: mutationRoot,
          shouldRestart,
          jsonMode: Boolean(opts.json),
        });
        if (preManagedServiceStop.windowsTaskAutoStartRecovery)
          recoveryState.windowsTaskAutoStartRecovery =
            preManagedServiceStop.windowsTaskAutoStartRecovery;
        if (
          preManagedServiceStop.stopped ||
          preManagedServiceStop.blockMessage ||
          shouldBlockMutableUpdateFromGatewayServiceEnv({ preManagedServiceStop }) ||
          !preManagedServiceStop.inspected ||
          !preManagedServiceStop.running ||
          !shouldRestart
        )
          break;
      }
    } catch (err) {
      if (err instanceof UpdateCommandAbort) throw err;
      stop();
      defaultRuntime.error(`Failed to stop managed gateway service before update: ${String(err)}`);
      defaultRuntime.exit(1);
      throw new UpdateCommandAbort();
    }
    if (preManagedServiceStop?.blockMessage) {
      stop();
      defaultRuntime.error(preManagedServiceStop.blockMessage);
      defaultRuntime.exit(1);
      throw new UpdateCommandAbort();
    }
    if (shouldBlockMutableUpdateFromGatewayServiceEnv({ preManagedServiceStop })) {
      stop();
      const updateLabel = updateInstallKind === "git" ? "Git updates" : "Package updates";
      defaultRuntime.error(
        [
          `${updateLabel} cannot run from inside the gateway service process.`,
          "That path replaces the active OpenClaw dist tree while the live gateway may still lazy-load old chunks.",
          `Run \`${replaceCliName(formatCliCommand("openclaw update"), CLI_NAME)}\` from a shell outside the gateway service, or stop the gateway service first and then update.`,
        ].join("\n"),
      );
      defaultRuntime.exit(1);
      throw new UpdateCommandAbort();
    }
  };
  if (updateInstallKind === "package")
    try {
      await stopManagedServiceBeforeMutableUpdate();
    } catch (err) {
      if (err instanceof UpdateCommandAbort) return;
      throw err;
    }
  let result;
  try {
    result =
      updateInstallKind === "package"
        ? await runPackageInstallUpdate({
            root,
            installKind,
            tag,
            installSpec: packageInstallSpec ?? void 0,
            timeoutMs: updateStepTimeoutMs,
            startedAt,
            progress,
            jsonMode: Boolean(opts.json),
            allowGatewayServiceRepair: preManagedServiceStop?.serviceMatchesMutationRoot === true,
            allowGatewayActivation:
              shouldRestart &&
              preManagedServiceStop?.stopped === true &&
              preManagedServiceStop.serviceMatchesMutationRoot === true,
            managedServiceEnv: preManagedServiceStop?.serviceEnv,
            invocationCwd,
            honorPackageRoot:
              managedServiceRootRedirect !== null || managedServiceNodeRunner !== void 0,
            nodeRunner: managedServiceNodeRunner,
            installEnv: packageInstallEnv,
            installTarget: packageInstallTarget,
          })
        : await runGitUpdate({
            root,
            switchToGit,
            installKind,
            timeoutMs,
            startedAt,
            progress,
            channel,
            tag,
            showProgress,
            opts,
            stop,
            devTargetRef,
            beforeGitMutation:
              updateInstallKind === "git"
                ? async () => {
                    await stopManagedServiceBeforeMutableUpdate(gitMutationRoots ?? [root]);
                    return {
                      allowGatewayServiceRepair:
                        preManagedServiceStop?.serviceMatchesMutationRoot === true,
                      allowGatewayActivation:
                        shouldRestart &&
                        preManagedServiceStop?.stopped === true &&
                        preManagedServiceStop.serviceMatchesMutationRoot === true,
                    };
                  }
                : void 0,
            allowGatewayServiceRepair: false,
            allowGatewayActivation: false,
          });
  } catch (err) {
    stop();
    if (err instanceof UpdateCommandAbort) return;
    try {
      await maybeResumeWindowsTaskAutoStartAfterPackageUpdate(preManagedServiceStop);
    } catch (resumeErr) {
      recoveryState.windowsTaskAutoStartRecovery?.complete();
      recoveryState.windowsTaskAutoStartRecovery = void 0;
      throw createAggregateErrorWithCause(
        [err, resumeErr],
        `Update failed (${String(err)}) and Windows Scheduled Task autostart could not be restored (${String(resumeErr)})`,
        err,
      );
    }
    await maybeRestartServiceAfterFailedMutableUpdate({
      preManagedServiceStop,
      jsonMode: Boolean(opts.json),
    });
    throw err;
  }
  stop();
  if (!opts.json || result.status !== "ok")
    printResult(result, {
      ...opts,
      hideSteps: showProgress,
    });
  if (result.status === "error") {
    if (!(await restoreWindowsTaskAutoStartOrExit(preManagedServiceStop))) return;
    await writeControlPlaneUpdateRestartSentinelBestEffort({
      meta: controlPlaneUpdateSentinelMeta,
      result,
      jsonMode: Boolean(opts.json),
    });
    await maybeRestartServiceAfterFailedMutableUpdate({
      preManagedServiceStop,
      jsonMode: Boolean(opts.json),
    });
    defaultRuntime.exit(1);
    return;
  }
  if (result.status === "skipped") {
    if (!(await restoreWindowsTaskAutoStartOrExit(preManagedServiceStop))) return;
    await writeControlPlaneUpdateRestartSentinelBestEffort({
      meta: controlPlaneUpdateSentinelMeta,
      result,
      jsonMode: Boolean(opts.json),
    });
    await maybeRestartServiceAfterFailedMutableUpdate({
      preManagedServiceStop,
      jsonMode: Boolean(opts.json),
    });
    if (result.reason === "dirty") {
      defaultRuntime.error(theme.error("Update blocked: local files are edited in this checkout."));
      defaultRuntime.log(
        theme.warn(
          "Git-based updates need a clean working tree before they can switch commits, fetch, or rebase.",
        ),
      );
      defaultRuntime.log(
        theme.muted("Commit, stash, or discard the local changes, then rerun `openclaw update`."),
      );
    }
    if (result.reason === "not-git-install") {
      defaultRuntime.log(
        theme.warn(
          `Skipped: this OpenClaw install isn't a git checkout, and the package manager couldn't be detected. Update via your package manager, then run \`${replaceCliName(formatCliCommand("openclaw doctor"), CLI_NAME)}\` and \`${replaceCliName(formatCliCommand("openclaw gateway restart"), CLI_NAME)}\`.`,
        ),
      );
      defaultRuntime.log(
        theme.muted(
          `Examples: \`${replaceCliName("npm i -g openclaw@latest", CLI_NAME)}\` or \`${replaceCliName("pnpm add -g openclaw@latest", CLI_NAME)}\``,
        ),
      );
    }
    defaultRuntime.exit(0);
    return;
  }
  const shouldResumePostCoreInFreshProcess = shouldResumePostCoreUpdateInFreshProcess({
    result,
    downgradeRisk,
  });
  let postUpdateConfigSnapshot =
    result.status === "ok" && !opts.dryRun
      ? await readConfigFileSnapshot({
          skipPluginValidation: true,
          suppressFutureVersionWarning: shouldResumePostCoreInFreshProcess,
        })
      : configSnapshot;
  if (!shouldResumePostCoreInFreshProcess)
    postUpdateConfigSnapshot = await persistRequestedUpdateChannel({
      configSnapshot: postUpdateConfigSnapshot,
      requestedChannel,
    });
  if (
    requestedChannel &&
    configSnapshot.valid &&
    requestedChannel !== storedChannel &&
    !shouldResumePostCoreInFreshProcess &&
    !opts.json
  )
    defaultRuntime.log(theme.muted(`Update channel set to ${requestedChannel}.`));
  else if (
    requestedChannel &&
    configSnapshot.valid &&
    requestedChannel !== storedChannel &&
    shouldResumePostCoreInFreshProcess &&
    !opts.json
  )
    defaultRuntime.log(theme.muted(`Update channel will be set to ${requestedChannel}.`));
  const postUpdateRoot = result.root ?? root;
  let postCorePluginUpdate;
  let pluginsUpdatedInFreshProcess = false;
  if (shouldResumePostCoreInFreshProcess) {
    const freshProcessResult = await continuePostCoreUpdateInFreshProcess({
      root: postUpdateRoot,
      channel,
      requestedChannel,
      opts,
      pluginInstallRecords: preUpdatePluginInstallRecords,
      updateStartedAtMs: startedAt,
      nodeRunner: managedServiceNodeRunner,
      preUpdateConfig: configSnapshot.valid
        ? {
            sourceConfig: configSnapshot.sourceConfig,
            authoredConfig: isRecord(configSnapshot.parsed)
              ? configSnapshot.parsed
              : configSnapshot.sourceConfig,
          }
        : void 0,
    });
    if (freshProcessResult.exitCode !== void 0) {
      if (!(await restoreWindowsTaskAutoStartOrExit(preManagedServiceStop))) return;
      defaultRuntime.exit(freshProcessResult.exitCode);
      throw new Error(`post-update process exited with code ${freshProcessResult.exitCode}`);
    }
    pluginsUpdatedInFreshProcess = freshProcessResult.resumed;
    postCorePluginUpdate = freshProcessResult.pluginUpdate;
  }
  if (!pluginsUpdatedInFreshProcess) {
    if (shouldResumePostCoreInFreshProcess)
      postUpdateConfigSnapshot = await persistRequestedUpdateChannel({
        configSnapshot: postUpdateConfigSnapshot,
        requestedChannel,
      });
    const restoredConfig = restoreDroppedPreUpdateChannels(
      postUpdateConfigSnapshot,
      configSnapshot.valid
        ? {
            sourceConfig: configSnapshot.sourceConfig,
            authoredConfig: isRecord(configSnapshot.parsed)
              ? configSnapshot.parsed
              : configSnapshot.sourceConfig,
          }
        : void 0,
    );
    postUpdateConfigSnapshot = restoredConfig.snapshot;
    const postUpdateInstalledVersion = await readPackageVersion(postUpdateRoot);
    const versionComparison =
      postUpdateInstalledVersion && VERSION
        ? compareSemverStrings(VERSION, postUpdateInstalledVersion)
        : null;
    const compatibilityDowngradeTarget =
      versionComparison != null && versionComparison > 0 ? postUpdateInstalledVersion : null;
    const previousCompatibilityHostVersion = process.env.OPENCLAW_COMPATIBILITY_HOST_VERSION;
    if (compatibilityDowngradeTarget)
      process.env.OPENCLAW_COMPATIBILITY_HOST_VERSION = compatibilityDowngradeTarget;
    try {
      postCorePluginUpdate = await updatePluginsAfterCoreUpdate({
        root: postUpdateRoot,
        channel,
        configSnapshot: postUpdateConfigSnapshot,
        configChanged: restoredConfig.changed,
        restoredAuthoredChannels: restoredConfig.authoredChannels,
        opts,
        timeoutMs: updateStepTimeoutMs,
        pluginInstallRecords: preUpdatePluginInstallRecords,
      });
    } finally {
      if (compatibilityDowngradeTarget)
        if (previousCompatibilityHostVersion === void 0)
          delete process.env.OPENCLAW_COMPATIBILITY_HOST_VERSION;
        else process.env.OPENCLAW_COMPATIBILITY_HOST_VERSION = previousCompatibilityHostVersion;
    }
  }
  const resultWithPostUpdate = postCorePluginUpdate
    ? {
        ...result,
        status: postCorePluginUpdate.status === "error" ? "error" : result.status,
        ...(postCorePluginUpdate.status === "error" ? { reason: "post-update-plugins" } : {}),
        postUpdate: {
          ...result.postUpdate,
          plugins: postCorePluginUpdate,
        },
      }
    : result;
  if (postCorePluginUpdate?.status === "error") {
    if (!(await restoreWindowsTaskAutoStartOrExit(preManagedServiceStop))) return;
    await writeControlPlaneUpdateRestartSentinelBestEffort({
      meta: controlPlaneUpdateSentinelMeta,
      result: resultWithPostUpdate,
      jsonMode: Boolean(opts.json),
    });
    if (opts.json) defaultRuntime.writeJson(resultWithPostUpdate);
    else defaultRuntime.error(theme.error("Update failed during plugin post-update sync."));
    defaultRuntime.exit(1);
    return;
  }
  let restartScriptPath = null;
  let refreshGatewayServiceEnvLocal = false;
  let gatewayServiceEnv;
  let skipLegacyServiceRestart = false;
  let gatewayPort = resolveUpdatedGatewayRestartPort({
    config: postUpdateConfigSnapshot.valid ? postUpdateConfigSnapshot.config : void 0,
    processEnv: process.env,
  });
  if (shouldRestart)
    try {
      const serviceState = await readGatewayServiceState(resolveGatewayService(), {
        env: resolvePostUpdateServiceStateReadEnv({
          updateMode: resultWithPostUpdate.mode,
          processEnv: process.env,
          preManagedServiceEnv: preManagedServiceStop?.serviceEnv,
        }),
      });
      const serviceMatchesUpdateRoot =
        (await gatewayServiceCommandUsesRoot({
          root: postUpdateRoot,
          command: serviceState.command,
        })) ?? void 0;
      const serviceOwnershipConfirmed =
        preManagedServiceStop?.serviceMatchesMutationRoot === true ||
        serviceMatchesUpdateRoot === true;
      const knownForeignService =
        preManagedServiceStop?.serviceMatchesMutationRoot === false &&
        serviceMatchesUpdateRoot !== true;
      skipLegacyServiceRestart =
        knownForeignService ||
        (resultWithPostUpdate.mode === "git" &&
          serviceState.installed &&
          serviceState.loaded &&
          preManagedServiceStop?.stopped !== true &&
          serviceMatchesUpdateRoot === false);
      if (
        !knownForeignService &&
        shouldPrepareUpdatedInstallRestart({
          updateMode: resultWithPostUpdate.mode,
          serviceInstalled: serviceState.installed,
          serviceLoaded: serviceState.loaded,
          serviceStoppedForUpdate: preManagedServiceStop?.stopped,
          serviceMatchesMutationRoot: serviceOwnershipConfirmed
            ? true
            : preManagedServiceStop?.serviceMatchesMutationRoot,
          serviceMatchesUpdateRoot,
        })
      ) {
        gatewayServiceEnv = serviceState.env;
        gatewayPort = resolveUpdatedGatewayRestartPort({
          config: postUpdateConfigSnapshot.valid ? postUpdateConfigSnapshot.config : void 0,
          processEnv: process.env,
          serviceEnv: gatewayServiceEnv,
        });
        restartScriptPath = await prepareRestartScript(serviceState.env, gatewayPort);
        refreshGatewayServiceEnvLocal = serviceOwnershipConfirmed;
      }
    } catch {}
  await tryWriteCompletionCache(postUpdateRoot, Boolean(opts.json));
  await tryInstallShellCompletion({
    jsonMode: Boolean(opts.json),
    skipPrompt: Boolean(opts.yes),
  });
  await writeControlPlaneUpdateRestartSentinelBestEffort({
    meta: controlPlaneUpdateSentinelMeta,
    result: buildControlPlaneUpdateRestartHealthPendingResult(resultWithPostUpdate),
    jsonMode: Boolean(opts.json),
  });
  if (!(await restoreWindowsTaskAutoStartOrExit(preManagedServiceStop))) return;
  if (
    !(await maybeRestartService({
      shouldRestart,
      result: resultWithPostUpdate,
      opts,
      refreshServiceEnv: refreshGatewayServiceEnvLocal,
      serviceEnv: gatewayServiceEnv,
      gatewayPort,
      restartScriptPath,
      invocationCwd,
      nodeRunner: managedServiceNodeRunner,
      skipLegacyServiceRestart,
      requireRunningServiceAfterRestart:
        resultWithPostUpdate.mode === "git" && preManagedServiceStop?.stopped === true,
    }))
  ) {
    await markControlPlaneUpdateRestartSentinelFailureBestEffort({
      meta: controlPlaneUpdateSentinelMeta,
      reason: "restart-unhealthy",
      jsonMode: Boolean(opts.json),
    });
    defaultRuntime.exit(1);
    return;
  }
  await writeControlPlaneUpdateRestartSentinelBestEffort({
    meta: controlPlaneUpdateSentinelMeta,
    result: resultWithPostUpdate,
    jsonMode: Boolean(opts.json),
  });
  if (!opts.json) defaultRuntime.log(theme.muted(pickUpdateQuip()));
  else defaultRuntime.writeJson(resultWithPostUpdate);
}
//#endregion
//#region src/cli/update-cli/wizard.ts
/** Run the TTY-only update wizard and preserve `updateCommand` as the single update executor. */
async function updateWizardCommand(opts = {}) {
  if (!process.stdin.isTTY) {
    defaultRuntime.error(
      "Update wizard requires a TTY. Use `openclaw update --channel <stable|extended-stable|beta|dev>` instead.",
    );
    defaultRuntime.exit(1);
    return;
  }
  const timeoutMs = parseTimeoutMsOrExit(opts.timeout);
  if (timeoutMs === null) return;
  const root = await resolveUpdateRoot();
  const [updateStatus, configSnapshot] = await Promise.all([
    checkUpdateStatus({
      root,
      timeoutMs: timeoutMs ?? 3500,
      fetchGit: false,
      includeRegistry: false,
    }),
    readConfigFileSnapshot(),
  ]);
  const channelInfo = resolveEffectiveUpdateChannel({
    configChannel: configSnapshot.valid
      ? normalizeUpdateChannel(configSnapshot.config.update?.channel)
      : null,
    installKind: updateStatus.installKind,
    git: updateStatus.git
      ? {
          tag: updateStatus.git.tag,
          branch: updateStatus.git.branch,
        }
      : void 0,
  });
  const channelLabel = formatUpdateChannelLabel({
    channel: channelInfo.channel,
    source: channelInfo.source,
    gitTag: updateStatus.git?.tag ?? null,
    gitBranch: updateStatus.git?.branch ?? null,
  });
  const pickedChannel = await selectStyled({
    message: "Update channel",
    options: [
      {
        value: "keep",
        label: `Keep current (${channelInfo.channel})`,
        hint: channelLabel,
      },
      {
        value: "stable",
        label: "Stable",
        hint: "Tagged releases (npm latest)",
      },
      {
        value: "extended-stable",
        label: "Extended Stable",
        hint: "Monthly supported release (npm extended-stable)",
      },
      {
        value: "beta",
        label: "Beta",
        hint: "Prereleases (npm beta)",
      },
      {
        value: "dev",
        label: "Dev",
        hint: "Git main",
      },
    ],
    initialValue: "keep",
  });
  if (isCancel(pickedChannel)) {
    defaultRuntime.log(theme.muted("Update cancelled."));
    defaultRuntime.exit(0);
    return;
  }
  const requestedChannel = pickedChannel === "keep" ? null : pickedChannel;
  if (requestedChannel === "dev" && updateStatus.installKind !== "git") {
    const gitDir = resolveGitInstallDir();
    if (!(await isGitCheckout(gitDir))) {
      if (await pathExists$1(gitDir)) {
        if (!(await isEmptyDir(gitDir))) {
          defaultRuntime.error(
            `OPENCLAW_GIT_DIR points at a non-git directory: ${gitDir}. Set OPENCLAW_GIT_DIR to an empty folder or an openclaw checkout.`,
          );
          defaultRuntime.exit(1);
          return;
        }
      }
      const ok = await confirm({
        message: stylePromptMessage(
          `Create a git checkout at ${gitDir}? (override via OPENCLAW_GIT_DIR)`,
        ),
        initialValue: true,
      });
      if (isCancel(ok) || !ok) {
        defaultRuntime.log(theme.muted("Update cancelled."));
        defaultRuntime.exit(0);
        return;
      }
    }
  }
  const restart = await confirm({
    message: stylePromptMessage("Restart the gateway service after update?"),
    initialValue: true,
  });
  if (isCancel(restart)) {
    defaultRuntime.log(theme.muted("Update cancelled."));
    defaultRuntime.exit(0);
    return;
  }
  try {
    await updateCommand({
      channel: requestedChannel ?? void 0,
      restart,
      timeout: opts.timeout,
    });
  } catch (err) {
    defaultRuntime.error(String(err));
    defaultRuntime.exit(1);
  }
}
//#endregion
//#region src/cli/update-cli.ts
function inheritedUpdateJson(command) {
  return Boolean(inheritOptionFromParent(command, "json"));
}
function inheritedUpdateTimeout(opts, command) {
  const timeout = opts.timeout;
  if (timeout) return timeout;
  return inheritOptionFromParent(command, "timeout");
}
function normalizeCommanderClawHubRiskOption(opts) {
  return opts.acknowledgeClawhubRisk === true || opts.acknowledgeClawHubRisk === true;
}
function inheritedUpdateClawHubRisk(command) {
  return Boolean(
    inheritOptionFromParent(command, "acknowledgeClawhubRisk") ??
    inheritOptionFromParent(command, "acknowledgeClawHubRisk"),
  );
}
function registerUpdateFinalizationCommand(update, name, hidden) {
  update
    .command(name, { hidden })
    .description("Repair post-update doctor and plugin convergence")
    .option("--json", "Output result as JSON", false)
    .option("--channel <stable|extended-stable|beta|dev>", "Persist update channel before repair")
    .option("--timeout <seconds>", "Timeout for update repair steps in seconds (default: 1800)")
    .option("--yes", "Skip confirmation prompts (non-interactive)", false)
    .option(
      "--acknowledge-clawhub-risk",
      "Acknowledge ClawHub release trust warnings during post-update plugin sync",
      false,
    )
    .option("--no-restart", "Accepted for update command parity; repair never restarts")
    .addHelpText(
      "after",
      () =>
        `\n${theme.heading("Examples:")}\n${formatHelpExamples([
          ["openclaw update repair", "Rerun post-update doctor and plugin convergence."],
          ["openclaw update repair --channel beta", "Repair against the beta update channel."],
          ["openclaw update repair --json", "JSON output for automation."],
        ])}\n\n${theme.heading("Notes:")}\n${theme.muted("- Repairs post-update plugin state after the core package already changed")}\n${theme.muted("- Runs doctor repair and plugin convergence, but never restarts the Gateway")}\n\n${theme.muted("Docs:")} ${formatDocsLink("/cli/update", "docs.openclaw.ai/cli/update")}`,
    )
    .action(async (opts, actionCommand) => {
      try {
        await updateFinalizeCommand({
          json: Boolean(opts.json) || inheritedUpdateJson(actionCommand),
          channel: opts.channel,
          timeout: inheritedUpdateTimeout(opts, actionCommand),
          yes: Boolean(opts.yes),
          restart: false,
          acknowledgeClawHubRisk:
            normalizeCommanderClawHubRiskOption(opts) || inheritedUpdateClawHubRisk(actionCommand),
        });
      } catch (err) {
        defaultRuntime.error(String(err));
        defaultRuntime.exit(1);
      }
    });
}
/** Attach the update command group to the root CLI. */
function registerUpdateCli(program) {
  program.enablePositionalOptions();
  const update = program
    .command("update")
    .description("Update OpenClaw and inspect update channel status")
    .option("--json", "Output result as JSON", false)
    .option("--no-restart", "Skip restarting the gateway service after a successful update")
    .option("--dry-run", "Preview update actions without making changes", false)
    .option("--channel <stable|extended-stable|beta|dev>", "Persist update channel (git + npm)")
    .option(
      "--tag <dist-tag|version|spec>",
      "Override the package target for this update (dist-tag, version, or package spec)",
    )
    .option("--timeout <seconds>", "Timeout for each update step in seconds (default: 1800)")
    .option("--yes", "Skip confirmation prompts (non-interactive)", false)
    .option(
      "--acknowledge-clawhub-risk",
      "Acknowledge ClawHub release trust warnings during post-update plugin sync",
      false,
    )
    .addHelpText("after", () => {
      const fmtExamples = [
        ["openclaw update", "Update a source checkout (git)"],
        [
          "openclaw update --channel extended-stable",
          "Switch to the monthly supported npm channel",
        ],
        ["openclaw update --channel beta", "Switch to beta channel (git + npm)"],
        ["openclaw update --channel dev", "Switch to dev channel (git + npm)"],
        ["openclaw update --tag beta", "One-off update to a dist-tag or version"],
        ["openclaw update --tag main", "One-off package update from GitHub main"],
        ["openclaw update --dry-run", "Preview actions without changing anything"],
        ["openclaw update --no-restart", "Update without restarting the service"],
        ["openclaw update --json", "Output result as JSON"],
        ["openclaw update --yes", "Non-interactive (accept downgrade prompts)"],
        ["openclaw update repair", "Repair stranded post-update plugin state"],
        ["openclaw update --acknowledge-clawhub-risk", "Acknowledge ClawHub plugin trust warnings"],
        ["openclaw update wizard", "Interactive update wizard"],
        ["openclaw --update", "Shorthand for openclaw update"],
      ]
        .map(([cmd, desc]) => `  ${theme.command(cmd)} ${theme.muted(`# ${desc}`)}`)
        .join("\n");
      return `
${theme.heading("What this does:")}
  - Git checkouts: fetches, rebases, installs deps, builds, and runs doctor
  - npm installs: updates via detected package manager

${theme.heading("Switch channels:")}
  - Use --channel stable|extended-stable|beta|dev to persist the update channel in config
  - Run openclaw update status to see the active channel and source
  - Use --tag <dist-tag|version|spec> for a one-off package update without persisting
  - Use --tag main for a one-off package update from GitHub main

${theme.heading("Non-interactive:")}
  - Use --yes to accept downgrade prompts
  - Use --acknowledge-clawhub-risk only after reviewing ClawHub plugin trust warnings
  - Combine with --channel/--tag/--no-restart/--json/--timeout as needed
  - Use --dry-run to preview actions without writing config/installing/restarting

${theme.heading("Examples:")}
${fmtExamples}

${theme.heading("Notes:")}
  - Switch channels with --channel stable|extended-stable|beta|dev
  - For global installs: auto-updates via detected package manager when possible (see docs/install/updating.md)
  - Downgrades require confirmation (can break configuration)
  - Skips update if the working directory has uncommitted changes

${theme.muted("Docs:")} ${formatDocsLink("/cli/update", "docs.openclaw.ai/cli/update")}`;
    })
    .action(async (opts) => {
      try {
        await updateCommand({
          json: Boolean(opts.json),
          restart: Boolean(opts.restart),
          dryRun: Boolean(opts.dryRun),
          channel: opts.channel,
          tag: opts.tag,
          timeout: opts.timeout,
          yes: Boolean(opts.yes),
          acknowledgeClawHubRisk: normalizeCommanderClawHubRiskOption(opts),
        });
      } catch (err) {
        defaultRuntime.error(String(err));
        defaultRuntime.exit(1);
      }
    });
  registerUpdateFinalizationCommand(update, "repair", false);
  registerUpdateFinalizationCommand(update, "finalize", true);
  update
    .command("wizard")
    .description("Interactive update wizard")
    .option("--timeout <seconds>", "Timeout for each update step in seconds (default: 1800)")
    .addHelpText(
      "after",
      `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/update", "docs.openclaw.ai/cli/update")}\n`,
    )
    .action(async (opts, command) => {
      try {
        await updateWizardCommand({ timeout: inheritedUpdateTimeout(opts, command) });
      } catch (err) {
        defaultRuntime.error(String(err));
        defaultRuntime.exit(1);
      }
    });
  update
    .command("status")
    .description("Show update channel and version status")
    .option("--json", "Output result as JSON", false)
    .option("--timeout <seconds>", "Timeout for update checks in seconds (default: 3)")
    .addHelpText(
      "after",
      () =>
        `\n${theme.heading("Examples:")}\n${formatHelpExamples([
          ["openclaw update status", "Show channel + version status."],
          ["openclaw update status --json", "JSON output."],
          ["openclaw update status --timeout 10", "Custom timeout."],
        ])}\n\n${theme.heading("Notes:")}\n${theme.muted("- Shows current update channel (stable/extended-stable/beta/dev) and source")}\n${theme.muted("- Includes git tag/branch/SHA for source checkouts")}\n\n${theme.muted("Docs:")} ${formatDocsLink("/cli/update", "docs.openclaw.ai/cli/update")}`,
    )
    .action(async (opts, command) => {
      try {
        await updateStatusCommand({
          json: Boolean(opts.json) || inheritedUpdateJson(command),
          timeout: inheritedUpdateTimeout(opts, command),
        });
      } catch (err) {
        defaultRuntime.error(String(err));
        defaultRuntime.exit(1);
      }
    });
}
//#endregion
export {
  registerUpdateCli,
  updateCommand,
  updateFinalizeCommand,
  updateStatusCommand,
  updateWizardCommand,
};
