import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { n as runExec } from "./exec-CXKmx4dL.js";
import { r as findStaleOpenClawUpdateLaunchdJobs } from "./launchd-CNqS8gSo.js";
import { t as note } from "./note-Uvqr4R1d.js";
import { a as resolveGatewayService } from "./service-Dw37Ek79.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { c as hasConfiguredSecretInput } from "./types.secrets-BV0ywRAy.js";
import { h as shortenHomePath } from "./utils-DtcDeqWS.js";
//#region src/commands/doctor-platform-notes.ts
/** Platform-specific doctor notes for macOS gateway launchd state and startup tuning. */
function resolveHomeDir() {
  return process.env.HOME ?? os.homedir();
}
/** Returns the macOS marker warning when LaunchAgent writes are locally disabled. */
function collectMacLaunchAgentOverrideWarning(deps) {
  if ((deps?.platform ?? process.platform) !== "darwin") return null;
  const home = deps?.homeDir ?? resolveHomeDir();
  const markerCandidates = [path.join(home, ".openclaw", "disable-launchagent")];
  const exists = deps?.exists ?? fs.existsSync;
  const markerPath = markerCandidates.find((candidate) => exists(candidate));
  if (!markerPath) return null;
  const displayMarkerPath = shortenHomePath(markerPath);
  return [
    `- LaunchAgent writes are disabled via ${displayMarkerPath}.`,
    "- To restore default behavior:",
    `  rm ${displayMarkerPath}`,
  ].join("\n");
}
/** Emits the macOS LaunchAgent override warning when present. */
async function noteMacLaunchAgentOverrides() {
  const warning = collectMacLaunchAgentOverrideWarning();
  if (warning) note(warning, "Gateway (macOS)");
}
/** Returns a warning for stale OpenClaw updater launchd jobs left after interrupted updates. */
async function collectMacStaleOpenClawUpdateLaunchdJobsWarning(deps) {
  if ((deps?.platform ?? process.platform) !== "darwin") return null;
  const scanEnv = deps?.env ?? process.env;
  const jobs = await (deps?.findJobs ?? findStaleOpenClawUpdateLaunchdJobs)(scanEnv).catch(
    () => [],
  );
  if (jobs.length === 0) return null;
  return [
    "- Stale OpenClaw updater launchd job(s) detected.",
    ...jobs.map((job) => {
      const exitStatus = job.lastExitStatus !== void 0 ? `, last exit ${job.lastExitStatus}` : "";
      const pid = job.pid !== void 0 ? `, pid ${job.pid}` : "";
      return `- ${job.label}${pid}${exitStatus}`;
    }),
    "- Fix after confirming no update is running:",
    "  launchctl remove <label>",
    `  ${formatCliCommand("openclaw gateway restart")}`,
  ].join("\n");
}
/** Emits stale updater launchd job notes using the gateway service environment when available. */
async function noteMacStaleOpenClawUpdateLaunchdJobs(deps) {
  const platform = deps?.platform ?? process.platform;
  const warning = await collectMacStaleOpenClawUpdateLaunchdJobsWarning({
    env: platform === "darwin" ? await resolveGatewayServiceEnvForPlatformNotes(deps) : deps?.env,
    findJobs: deps?.findJobs,
    platform,
  });
  if (warning) (deps?.noteFn ?? note)(warning, "Gateway (macOS)");
}
async function launchctlGetenv(name) {
  try {
    const value =
      normalizeOptionalString(
        (await runExec("/bin/launchctl", ["getenv", name], { logOutput: false })).stdout,
      ) ?? "";
    return value.length > 0 ? value : void 0;
  } catch {
    return;
  }
}
function hasConfigGatewayCreds(cfg) {
  const localPassword = cfg.gateway?.auth?.password;
  const remoteToken = cfg.gateway?.remote?.token;
  const remotePassword = cfg.gateway?.remote?.password;
  return (
    hasConfiguredSecretInput(cfg.gateway?.auth?.token, cfg.secrets?.defaults) ||
    hasConfiguredSecretInput(localPassword, cfg.secrets?.defaults) ||
    hasConfiguredSecretInput(remoteToken, cfg.secrets?.defaults) ||
    hasConfiguredSecretInput(remotePassword, cfg.secrets?.defaults)
  );
}
/** Returns a warning for host-wide launchctl gateway auth env overrides. */
async function collectMacLaunchctlGatewayEnvOverrideWarning(cfg, deps) {
  if ((deps?.platform ?? process.platform) !== "darwin") return null;
  if (!hasConfigGatewayCreds(cfg)) return null;
  const getenv = deps?.getenv ?? launchctlGetenv;
  const tokenEntries = [["OPENCLAW_GATEWAY_TOKEN", await getenv("OPENCLAW_GATEWAY_TOKEN")]];
  const passwordEntries = [
    ["OPENCLAW_GATEWAY_PASSWORD", await getenv("OPENCLAW_GATEWAY_PASSWORD")],
  ];
  const tokenEntry = tokenEntries.find(([, value]) => normalizeOptionalString(value));
  const passwordEntry = passwordEntries.find(([, value]) => normalizeOptionalString(value));
  const envToken = normalizeOptionalString(tokenEntry?.[1]) ?? "";
  const envPassword = normalizeOptionalString(passwordEntry?.[1]) ?? "";
  const envTokenKey = tokenEntry?.[0];
  const envPasswordKey = passwordEntry?.[0];
  if (!envToken && !envPassword) return null;
  return [
    "- Host-wide launchctl gateway auth overrides detected.",
    "- Current managed Gateway installs do not need these values unless config intentionally references the env var.",
    envToken && envTokenKey
      ? `- \`${envTokenKey}\` is set; it can make local clients use a different token than gateway.auth.token.`
      : void 0,
    envPassword
      ? `- \`${envPasswordKey ?? "OPENCLAW_GATEWAY_PASSWORD"}\` is set; it can make local clients use a different password than gateway.auth.password.`
      : void 0,
    "- Clear overrides and restart the app/gateway:",
    envTokenKey ? `  launchctl unsetenv ${envTokenKey}` : void 0,
    envPasswordKey ? `  launchctl unsetenv ${envPasswordKey}` : void 0,
  ]
    .filter((line) => Boolean(line))
    .join("\n");
}
/** Emits macOS launchctl gateway auth override warnings. */
async function noteMacLaunchctlGatewayEnvOverrides(cfg, deps) {
  const warning = await collectMacLaunchctlGatewayEnvOverrideWarning(cfg, deps);
  if (warning) (deps?.noteFn ?? note)(warning, "Gateway (macOS)");
}
async function resolveGatewayServiceEnvForPlatformNotes(deps) {
  const baseEnv = deps?.env ?? process.env;
  const command = await (deps?.service ?? resolveGatewayService())
    .readCommand(baseEnv)
    .catch(() => null);
  return command?.environment
    ? {
        ...baseEnv,
        ...command.environment,
      }
    : baseEnv;
}
/** Collects all macOS gateway platform warnings without emitting notes. */
async function collectMacGatewayPlatformWarnings(cfg, deps) {
  const platform = deps?.platform ?? process.platform;
  const warnings = [];
  const launchAgentWarning = collectMacLaunchAgentOverrideWarning({ platform });
  if (launchAgentWarning) warnings.push(launchAgentWarning);
  const staleUpdateWarning = await collectMacStaleOpenClawUpdateLaunchdJobsWarning({
    env: platform === "darwin" ? await resolveGatewayServiceEnvForPlatformNotes(deps) : deps?.env,
    findJobs: deps?.findJobs,
    platform,
  });
  if (staleUpdateWarning) warnings.push(staleUpdateWarning);
  const launchctlWarning = await collectMacLaunchctlGatewayEnvOverrideWarning(cfg, { platform });
  if (launchctlWarning) warnings.push(launchctlWarning);
  return warnings;
}
function isTruthyEnvValue(value) {
  return Boolean(normalizeOptionalString(value));
}
function isTmpCompileCachePath(cachePath) {
  const normalized = cachePath.trim().replace(/\/+$/, "");
  return (
    normalized === "/tmp" ||
    normalized.startsWith("/tmp/") ||
    normalized === "/private/tmp" ||
    normalized.startsWith("/private/tmp/")
  );
}
/** Emits startup tuning hints for low-power Linux hosts when env settings are suboptimal. */
function noteStartupOptimizationHints(env = process.env, deps) {
  const platform = deps?.platform ?? process.platform;
  if (platform === "win32") return;
  const arch = deps?.arch ?? os.arch();
  const totalMemBytes = deps?.totalMemBytes ?? os.totalmem();
  if (
    !(
      platform === "linux" &&
      (arch === "arm" ||
        arch === "arm64" ||
        (platform === "linux" && totalMemBytes > 0 && totalMemBytes <= 8 * 1024 ** 3))
    )
  )
    return;
  const noteFn = deps?.noteFn ?? note;
  const compileCache = normalizeOptionalString(env.NODE_COMPILE_CACHE) ?? "";
  const disableCompileCache = normalizeOptionalString(env.NODE_DISABLE_COMPILE_CACHE) ?? "";
  const noRespawn = normalizeOptionalString(env.OPENCLAW_NO_RESPAWN) ?? "";
  const lines = [];
  if (!compileCache)
    lines.push(
      "- NODE_COMPILE_CACHE is not set; repeated CLI runs can be slower on small hosts (Raspberry Pi/VM).",
    );
  else if (isTmpCompileCachePath(compileCache))
    lines.push(
      "- NODE_COMPILE_CACHE points to /tmp; use /var/tmp so cache survives reboots and warms startup reliably.",
    );
  if (isTruthyEnvValue(disableCompileCache))
    lines.push("- NODE_DISABLE_COMPILE_CACHE is set; startup compile cache is disabled.");
  if (noRespawn !== "1")
    lines.push(
      "- OPENCLAW_NO_RESPAWN is not set to 1; set it when you want routine gateway restarts to stay in-process instead of handing off to a managed supervisor.",
    );
  if (lines.length === 0) return;
  const suggestions = [
    "- Suggested env for low-power hosts:",
    "  export NODE_COMPILE_CACHE=/var/tmp/openclaw-compile-cache",
    "  mkdir -p /var/tmp/openclaw-compile-cache",
    "  export OPENCLAW_NO_RESPAWN=1",
    isTruthyEnvValue(disableCompileCache) ? "  unset NODE_DISABLE_COMPILE_CACHE" : void 0,
  ].filter((line) => Boolean(line));
  noteFn([...lines, ...suggestions].join("\n"), "Startup optimization");
}
//#endregion
export {
  collectMacGatewayPlatformWarnings,
  noteMacLaunchAgentOverrides,
  noteMacLaunchctlGatewayEnvOverrides,
  noteMacStaleOpenClawUpdateLaunchdJobs,
  noteStartupOptimizationHints,
};
