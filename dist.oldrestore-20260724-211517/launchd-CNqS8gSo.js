import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import "./parse-finite-number-Z7n6tXLk.js";
import path from "node:path";
import { t as sanitizeForLog } from "./ansi-D4OHEz5F.js";
import {
  f as resolveGatewayServiceDescription,
  h as resolveLegacyGatewayLaunchAgentLabels,
  t as GATEWAY_LAUNCH_AGENT_LABEL,
  u as resolveGatewayLaunchAgentLabel,
} from "./constants-obO8goqF.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as execFileUtf8 } from "./exec-file-Ns0uZMdf.js";
import "./utils-DtcDeqWS.js";
import { a as normalizeEnvVarKey, s as sanitizeHostExecEnv } from "./host-env-security-pMY6K0Qy.js";
import {
  b as parseStrictPositiveInteger,
  v as parseStrictInteger,
} from "./number-coercion-CJQ8TR--.js";
import { r as resolveHomeDir, t as resolveGatewayStateDir } from "./paths-t9LtxoUy.js";
import { i as formatPortDiagnostics, n as inspectPortUsage } from "./ports-inspect-DyOb8qZr.js";
import { t as probePortUsage } from "./ports-probe-B4qJEiCc.js";
import {
  a as resolveGatewaySupervisorLogPaths,
  n as renderPosixRestartLogSetup,
} from "./restart-logs-D5D9y8VP.js";
import "./ports-miNUZKci.js";
import { t as cleanStaleGatewayProcessesSync } from "./restart-stale-pids-C3MK7Phb.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import {
  i as writeFormattedLines,
  n as formatLine,
  r as toPosixPath,
  t as parseKeyValueOutput,
} from "./runtime-parse-CL1pTtPs.js";
import { t as sleep } from "./sleep-DZm1epyW.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { n as parseTcpPort } from "./tcp-port-1cXcKObm.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { t as getWindowsCmdExePath } from "./windows-install-roots-Cnzi1kc9.js";
//#region src/daemon/launchd-current-service.ts
/** Detects whether the current process is running inside a launchd service label. */
/** Checks whether the current process appears to be running under the requested launchd label. */
function isCurrentProcessLaunchdServiceLabel(label, env = process.env, options = {}) {
  const currentLabels = [env.LAUNCH_JOB_LABEL, env.LAUNCH_JOB_NAME, env.XPC_SERVICE_NAME].flatMap(
    (value) => {
      const normalized = normalizeOptionalString(value);
      return normalized ? [normalized] : [];
    },
  );
  for (const currentLabel of currentLabels) if (currentLabel === label) return true;
  const configuredLabel = normalizeOptionalString(env.OPENCLAW_LAUNCHD_LABEL);
  if (!configuredLabel || configuredLabel !== label) return false;
  if (
    normalizeOptionalString(env.OPENCLAW_SERVICE_MARKER) === "openclaw" &&
    Boolean(normalizeOptionalString(env.OPENCLAW_SERVICE_KIND))
  )
    return true;
  return options.allowConfiguredLabelFallback !== false && currentLabels.length === 0;
}
//#endregion
//#region src/daemon/launchd-plist.ts
/** Reads and renders macOS LaunchAgent plists for gateway service installs. */
const LAUNCH_AGENT_THROTTLE_INTERVAL_SECONDS = 10;
const LAUNCH_AGENT_UMASK_DECIMAL = 63;
const LAUNCH_AGENT_PROCESS_TYPE = "Interactive";
const LAUNCH_AGENT_STDIN_PATH = "/dev/null";
const LAUNCH_AGENT_ENV_WRAPPER_SHELL = "/bin/sh";
const plistEscape = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
const plistUnescape = (value) =>
  value
    .replaceAll("&apos;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&gt;", ">")
    .replaceAll("&lt;", "<")
    .replaceAll("&amp;", "&");
function parseGeneratedEnvValue(value) {
  const trimmed = value.trim();
  if (!trimmed.startsWith("'") || !trimmed.endsWith("'")) return trimmed;
  return trimmed.slice(1, -1).replaceAll("'\\''", "'");
}
function includesGeneratedEnvironmentPathToken(value, token) {
  return Boolean(value?.replaceAll("\\", "/").includes(token));
}
function includesGeneratedEnvironmentDirToken(value) {
  return Boolean(value?.replaceAll("\\", "/").includes("/service-env/"));
}
function resolveSiblingGeneratedEnvFilePath(envFilePath, options) {
  const label = options?.generatedEnvironmentLabel?.trim();
  if (!label) return;
  const markerIndex = envFilePath.replaceAll("\\", "/").lastIndexOf("/service-env/");
  if (markerIndex < 0) return;
  const serviceEnvDirEnd = markerIndex + 13 - 1;
  return `${envFilePath.slice(0, serviceEnvDirEnd)}/${label}.env`;
}
function isExpectedGeneratedEnvWrapperPair(wrapperPath, envFilePath, options) {
  if (!wrapperPath || !envFilePath) return false;
  if (!options) return wrapperPath.endsWith("-env-wrapper.sh");
  if (
    options.expectedEnvironmentWrapperPath &&
    options.expectedEnvironmentFilePath &&
    wrapperPath === options.expectedEnvironmentWrapperPath &&
    envFilePath === options.expectedEnvironmentFilePath
  )
    return true;
  const label = options.generatedEnvironmentLabel?.trim();
  if (!label) return false;
  return (
    includesGeneratedEnvironmentDirToken(wrapperPath) &&
    includesGeneratedEnvironmentDirToken(envFilePath) &&
    includesGeneratedEnvironmentPathToken(wrapperPath, `${label}-env-wrapper.sh`) &&
    includesGeneratedEnvironmentPathToken(envFilePath, `${label}.env`)
  );
}
function resolveGeneratedEnvWrapperLayout(programArguments, options) {
  if (programArguments[0] === "/bin/sh") {
    const wrapperPath = programArguments[1];
    const envFilePath = programArguments[2];
    if (isExpectedGeneratedEnvWrapperPair(wrapperPath, envFilePath, options) && envFilePath)
      return {
        envFilePath,
        commandStartIndex: 3,
      };
  }
  const wrapperPath = programArguments[0];
  const envFilePath = programArguments[1];
  if (isExpectedGeneratedEnvWrapperPair(wrapperPath, envFilePath, options) && envFilePath)
    return {
      envFilePath,
      commandStartIndex: 2,
    };
  return null;
}
async function readLaunchAgentEnvironmentFile(programArguments, options) {
  const layout = resolveGeneratedEnvWrapperLayout(programArguments, options);
  if (!layout) return {};
  const envFilePath = layout.envFilePath;
  let content = "";
  const candidateEnvFilePaths = Array.from(
    new Set(
      [
        envFilePath,
        resolveSiblingGeneratedEnvFilePath(envFilePath, options),
        options?.expectedEnvironmentFilePath,
      ].filter((candidate) => Boolean(candidate)),
    ),
  );
  for (const candidate of candidateEnvFilePaths)
    try {
      content = await fs.readFile(candidate, "utf8");
      break;
    } catch {}
  if (!content) return {};
  const environment = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^export\s+([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    const key = match[1];
    const value = match[2];
    if (!key || value === void 0) continue;
    environment[key] = parseGeneratedEnvValue(value);
  }
  return environment;
}
function unwrapGeneratedEnvWrapperArgs(programArguments, options) {
  const layout = resolveGeneratedEnvWrapperLayout(programArguments, options);
  if (!layout) return programArguments;
  return programArguments.slice(layout.commandStartIndex);
}
const renderEnvDict = (env) => {
  if (!env) return "";
  const entries = Object.entries(env).filter(
    ([, value]) => typeof value === "string" && value.trim(),
  );
  if (entries.length === 0) return "";
  return `\n    <key>EnvironmentVariables</key>\n    <dict>${entries.map(([key, value]) => `\n    <key>${plistEscape(key)}</key>\n    <string>${plistEscape(value?.trim() ?? "")}</string>`).join("")}\n    </dict>`;
};
async function readLaunchAgentProgramArgumentsFromFile(plistPath, options) {
  try {
    const plist = await fs.readFile(plistPath, "utf8");
    const programMatch = plist.match(/<key>ProgramArguments<\/key>\s*<array>([\s\S]*?)<\/array>/i);
    if (!programMatch) return null;
    const programArgumentsXml = programMatch.at(1);
    if (programArgumentsXml === void 0) return null;
    const args = [];
    for (const match of programArgumentsXml.matchAll(/<string>([\s\S]*?)<\/string>/gi)) {
      const rawArgument = match.at(1);
      if (rawArgument === void 0) return null;
      args.push(plistUnescape(rawArgument).trim());
    }
    const workingDirectoryXml = plist
      .match(/<key>WorkingDirectory<\/key>\s*<string>([\s\S]*?)<\/string>/i)
      ?.at(1);
    const workingDirectory =
      workingDirectoryXml === void 0 ? "" : plistUnescape(workingDirectoryXml).trim();
    const envMatch = plist.match(/<key>EnvironmentVariables<\/key>\s*<dict>([\s\S]*?)<\/dict>/i);
    const inlineEnvironment = {};
    if (envMatch) {
      const environmentXml = envMatch.at(1);
      if (environmentXml === void 0) return null;
      for (const pair of environmentXml.matchAll(
        /<key>([\s\S]*?)<\/key>\s*<string>([\s\S]*?)<\/string>/gi,
      )) {
        const rawKey = pair.at(1);
        const rawValue = pair.at(2);
        if (rawKey === void 0 || rawValue === void 0) return null;
        const key = plistUnescape(rawKey).trim();
        if (!key) continue;
        inlineEnvironment[key] = plistUnescape(rawValue).trim();
      }
    }
    const fileEnvironment = await readLaunchAgentEnvironmentFile(args, options);
    const effectiveProgramArguments = unwrapGeneratedEnvWrapperArgs(args, options);
    const environment = {
      ...inlineEnvironment,
      ...fileEnvironment,
    };
    const environmentValueSources = {};
    for (const key of Object.keys(inlineEnvironment))
      environmentValueSources[key] = Object.hasOwn(fileEnvironment, key)
        ? "inline-and-file"
        : "inline";
    for (const key of Object.keys(fileEnvironment))
      environmentValueSources[key] = Object.hasOwn(inlineEnvironment, key)
        ? "inline-and-file"
        : "file";
    return {
      programArguments: effectiveProgramArguments.filter(Boolean),
      ...(workingDirectory ? { workingDirectory } : {}),
      ...(Object.keys(environment).length > 0 ? { environment } : {}),
      ...(Object.keys(environmentValueSources).length > 0 ? { environmentValueSources } : {}),
      sourcePath: plistPath,
    };
  } catch {
    return null;
  }
}
function buildLaunchAgentPlist$1({
  label,
  comment,
  programArguments,
  workingDirectory,
  stdoutPath,
  stderrPath,
  environment,
}) {
  const argsXml = programArguments
    .map((arg) => `\n      <string>${plistEscape(arg)}</string>`)
    .join("");
  const workingDirXml = workingDirectory
    ? `\n    <key>WorkingDirectory</key>\n    <string>${plistEscape(workingDirectory)}</string>`
    : "";
  const commentXml = comment?.trim()
    ? `\n    <key>Comment</key>\n    <string>${plistEscape(comment.trim())}</string>`
    : "";
  const envXml = renderEnvDict(environment);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n  <dict>\n    <key>Label</key>\n    <string>${plistEscape(label)}</string>\n    ${commentXml}\n    <key>RunAtLoad</key>\n    <true/>\n    <key>KeepAlive</key>\n    <true/>\n    <key>ExitTimeOut</key>\n    <integer>20</integer>\n    <key>ProcessType</key>\n    <string>${LAUNCH_AGENT_PROCESS_TYPE}</string>\n    <key>ThrottleInterval</key>\n    <integer>${LAUNCH_AGENT_THROTTLE_INTERVAL_SECONDS}</integer>\n    <key>Umask</key>\n    <integer>${LAUNCH_AGENT_UMASK_DECIMAL}</integer>\n    <key>ProgramArguments</key>\n    <array>${argsXml}\n    </array>\n    ${workingDirXml}\n    <key>StandardInPath</key>\n    <string>${plistEscape(LAUNCH_AGENT_STDIN_PATH)}</string>\n    <key>StandardOutPath</key>\n    <string>${plistEscape(stdoutPath)}</string>\n    <key>StandardErrorPath</key>\n    <string>${plistEscape(stderrPath)}</string>${envXml}\n  </dict>\n</plist>\n`;
}
//#endregion
//#region src/daemon/launchd-restart-handoff.ts
/** Detached macOS launchd restart handoff for restarting from inside the service. */
const START_AFTER_EXIT_PRINT_RETRY_COUNT = 15;
const START_AFTER_EXIT_PRINT_RETRY_DELAY_SECONDS = 0.2;
function assertValidLaunchAgentLabel$1(label) {
  const trimmed = label.trim();
  if (!/^[A-Za-z0-9._-]+$/.test(trimmed))
    throw new Error(`Invalid launchd label: ${sanitizeForLog(trimmed)}`);
  return trimmed;
}
function resolveGuiDomain$1() {
  if (typeof process.getuid !== "function") return "gui/501";
  return `gui/${process.getuid()}`;
}
function collectStringEnvOverrides(env) {
  const overrides = Object.fromEntries(
    Object.entries(env ?? {}).filter((entry) => typeof entry[1] === "string"),
  );
  return Object.keys(overrides).length > 0 ? overrides : void 0;
}
function collectRestartLogEnv(env) {
  const source = {
    ...process.env,
    ...env,
  };
  return {
    HOME: source.HOME,
    USERPROFILE: source.USERPROFILE,
    OPENCLAW_STATE_DIR: source.OPENCLAW_STATE_DIR,
    OPENCLAW_PROFILE: source.OPENCLAW_PROFILE,
  };
}
function resolveLaunchAgentLabel$1(env) {
  const envLabel = normalizeOptionalString(env?.OPENCLAW_LAUNCHD_LABEL);
  if (envLabel) return assertValidLaunchAgentLabel$1(envLabel);
  return assertValidLaunchAgentLabel$1(resolveGatewayLaunchAgentLabel(env?.OPENCLAW_PROFILE));
}
function resolveLaunchdRestartTarget(env = process.env) {
  const domain = resolveGuiDomain$1();
  const label = resolveLaunchAgentLabel$1(env);
  const home = normalizeOptionalString(env.HOME) || os.homedir();
  return {
    domain,
    label,
    plistPath: path.join(home, "Library", "LaunchAgents", `${label}.plist`),
    serviceTarget: `${domain}/${label}`,
  };
}
function buildLaunchdRestartScript(mode, restartLogEnv) {
  const waitForCallerPid = `wait_pid="$4"
label="$5"
${renderPosixRestartLogSetup(restartLogEnv)}
printf '[%s] openclaw restart attempt source=launchd-handoff mode=${mode} target=%s waitPid=%s\\n' "$(date -u +%FT%TZ)" "$service_target" "$wait_pid" >&2
if [ -n "$wait_pid" ] && [ "$wait_pid" -gt 1 ] 2>/dev/null; then
  while kill -0 "$wait_pid" >/dev/null 2>&1; do
    sleep 0.1
  done
fi
`;
  if (mode === "kickstart")
    return `service_target="$1"
domain="$2"
plist_path="$3"
${waitForCallerPid}
status=0
launchctl enable "$service_target"
if launchctl kickstart -k "$service_target"; then
  status=0
else
  status=$?
  if launchctl bootstrap "$domain" "$plist_path"; then
    status=0
  else
    launchctl kickstart -k "$service_target"
    status=$?
  fi
fi
if [ "$status" -eq 0 ]; then
  printf '[%s] openclaw restart done source=launchd-handoff mode=${mode}\\n' "$(date -u +%FT%TZ)" >&2
else
  printf '[%s] openclaw restart failed source=launchd-handoff mode=${mode} status=%s\\n' "$(date -u +%FT%TZ)" "$status" >&2
fi
exit "$status"
`;
  if (mode === "reload")
    return `service_target="$1"
domain="$2"
plist_path="$3"
${waitForCallerPid}
status=0
launchctl enable "$service_target"
launchctl bootout "$service_target" >/dev/null 2>&1 || true
${`bootout_wait_count="${START_AFTER_EXIT_PRINT_RETRY_COUNT}"
while [ "$bootout_wait_count" -gt 0 ]; do
  if ! launchctl print "$service_target" >/dev/null 2>&1; then
    break
  fi
  bootout_wait_count=$((bootout_wait_count - 1))
  sleep ${START_AFTER_EXIT_PRINT_RETRY_DELAY_SECONDS}
done
`}
if launchctl bootstrap "$domain" "$plist_path"; then
  status=0
else
  status=$?
  launchctl kickstart -k "$service_target"
  status=$?
fi
if [ "$status" -eq 0 ]; then
  printf '[%s] openclaw restart done source=launchd-handoff mode=${mode}\\n' "$(date -u +%FT%TZ)" >&2
else
  printf '[%s] openclaw restart failed source=launchd-handoff mode=${mode} status=%s\\n' "$(date -u +%FT%TZ)" "$status" >&2
fi
exit "$status"
`;
  return `service_target="$1"
domain="$2"
plist_path="$3"
${waitForCallerPid}
${`print_retry_count="${START_AFTER_EXIT_PRINT_RETRY_COUNT}"
while [ "$print_retry_count" -gt 0 ]; do
  if launchctl print "$service_target" >/dev/null 2>&1; then
    printf '[%s] openclaw restart done source=launchd-handoff mode=${mode} reason=launchd-auto-reload\\n' "$(date -u +%FT%TZ)" >&2
    exit 0
  fi
  print_retry_count=$((print_retry_count - 1))
  sleep ${START_AFTER_EXIT_PRINT_RETRY_DELAY_SECONDS}
done
`}
status=0
launchctl enable "$service_target"
if launchctl bootstrap "$domain" "$plist_path"; then
  status=0
else
  status=$?
  launchctl kickstart -k "$service_target"
  status=$?
fi
if [ "$status" -eq 0 ]; then
  printf '[%s] openclaw restart done source=launchd-handoff mode=${mode}\\n' "$(date -u +%FT%TZ)" >&2
else
  printf '[%s] openclaw restart failed source=launchd-handoff mode=${mode} status=%s\\n' "$(date -u +%FT%TZ)" "$status" >&2
fi
exit "$status"
`;
}
function scheduleDetachedLaunchdRestartHandoff(params) {
  const target = resolveLaunchdRestartTarget(params.env);
  const waitForPid =
    typeof params.waitForPid === "number" && Number.isFinite(params.waitForPid)
      ? Math.floor(params.waitForPid)
      : 0;
  const restartLogEnv = collectRestartLogEnv(params.env);
  const restartEnv = sanitizeHostExecEnv({
    baseEnv: process.env,
    overrides: collectStringEnvOverrides(params.env),
  });
  try {
    const child = spawn(
      "/bin/sh",
      [
        "-c",
        buildLaunchdRestartScript(params.mode, restartLogEnv),
        "openclaw-launchd-restart-handoff",
        target.serviceTarget,
        target.domain,
        target.plistPath,
        String(waitForPid),
        target.label,
      ],
      {
        detached: true,
        stdio: "ignore",
        env: restartEnv,
      },
    );
    child.unref();
    return ok(child.pid ?? void 0);
  } catch (error) {
    return err(formatErrorMessage(error));
  }
}
//#endregion
//#region src/daemon/launchd.ts
/** macOS LaunchAgent installer, runtime inspection, and lifecycle controls. */
const LAUNCH_AGENT_DIR_MODE = 493;
const LAUNCH_AGENT_PLIST_MODE = 420;
const LAUNCH_AGENT_PRIVATE_DIR_MODE = 448;
const LAUNCH_AGENT_ENV_FILE_MODE = 384;
const LAUNCH_AGENT_ENV_WRAPPER_MODE = 448;
const LAUNCH_AGENT_ENV_DIR_NAME = "service-env";
const LAUNCH_AGENT_STDERR_PATH = "/dev/null";
const OPENCLAW_UPDATE_LAUNCHD_LABEL_PREFIX = "ai.openclaw.update.";
const OPENCLAW_MANUAL_UPDATE_LAUNCHD_LABEL_PATTERN = /^ai\.openclaw\.manual-update\.\d+$/;
const OPENCLAW_PROFILE_UPDATE_LAUNCHD_LABEL_PATTERN =
  /^ai\.openclaw\.[A-Za-z0-9._-]+\.update\.[A-Za-z0-9._-]+$/;
const OPENCLAW_DIRECT_CLI_NAMES = /* @__PURE__ */ new Set(["openclaw", "openclaw.mjs"]);
const OPENCLAW_NODE_RUNTIME_NAMES = /* @__PURE__ */ new Set(["bun", "bun.exe", "node", "node.exe"]);
const OPENCLAW_SCRIPT_NAMES = /* @__PURE__ */ new Set(["openclaw.mjs"]);
const LAUNCH_AGENT_STOP_PORT_RELEASE_TIMEOUT_MS = 20 * 1e3;
const LAUNCH_AGENT_STOP_PORT_RELEASE_POLL_MS = 100;
function normalizeOpenClawUpdateLaunchdLabel(label) {
  if (typeof label !== "string") return null;
  const trimmed = label.trim();
  if (trimmed.startsWith(OPENCLAW_UPDATE_LAUNCHD_LABEL_PREFIX)) return trimmed;
  return OPENCLAW_MANUAL_UPDATE_LAUNCHD_LABEL_PATTERN.test(trimmed) ? trimmed : null;
}
function normalizeOpenClawUpdateLaunchdLabelCandidate(label) {
  const normalized = normalizeOpenClawUpdateLaunchdLabel(label);
  if (normalized)
    return {
      label: normalized,
      requiresMetadata: false,
    };
  if (typeof label !== "string") return null;
  const trimmed = label.trim();
  return OPENCLAW_PROFILE_UPDATE_LAUNCHD_LABEL_PATTERN.test(trimmed)
    ? {
        label: trimmed,
        requiresMetadata: true,
      }
    : null;
}
function isCurrentGatewayLaunchdLabel(label, env) {
  if (label === resolveGatewayLaunchAgentLabel(env.OPENCLAW_PROFILE)) return true;
  if (
    env.OPENCLAW_SERVICE_MARKER?.trim() !== "openclaw" ||
    env.OPENCLAW_SERVICE_KIND?.trim() !== "gateway"
  )
    return false;
  const configuredLabel = env.OPENCLAW_LAUNCHD_LABEL?.trim();
  return Boolean(configuredLabel && label === configuredLabel);
}
function resolveCurrentOpenClawUpdateLaunchdJobLabel(env = process.env) {
  for (const label of [
    env.LAUNCH_JOB_LABEL,
    env.LAUNCH_JOB_NAME,
    env.XPC_SERVICE_NAME,
    env.OPENCLAW_LAUNCHD_LABEL,
  ]) {
    const candidate = normalizeOpenClawUpdateLaunchdLabelCandidate(label);
    if (candidate) {
      if (isCurrentGatewayLaunchdLabel(candidate.label, env)) continue;
      return candidate;
    }
  }
  return null;
}
function assertValidLaunchAgentLabel(label) {
  const trimmed = label.trim();
  if (!/^[A-Za-z0-9._-]+$/.test(trimmed))
    throw new Error(`Invalid launchd label: ${sanitizeForLog(trimmed)}`);
  return trimmed;
}
function resolveLaunchAgentLabel(args) {
  const envLabel = args?.env?.OPENCLAW_LAUNCHD_LABEL?.trim();
  if (envLabel) return assertValidLaunchAgentLabel(envLabel);
  return assertValidLaunchAgentLabel(resolveGatewayLaunchAgentLabel(args?.env?.OPENCLAW_PROFILE));
}
function resolveLaunchAgentPlistPathForLabel(env, label) {
  const home = toPosixPath(resolveHomeDir(env));
  return path.posix.join(home, "Library", "LaunchAgents", `${label}.plist`);
}
function resolveLaunchAgentEnvDir(env) {
  return path.join(resolveGatewayStateDir(env), LAUNCH_AGENT_ENV_DIR_NAME);
}
function resolveLaunchAgentEnvFilePath(env, label) {
  return path.join(resolveLaunchAgentEnvDir(env), `${label}.env`);
}
function resolveLaunchAgentEnvWrapperPath(env, label) {
  return path.join(resolveLaunchAgentEnvDir(env), `${label}-env-wrapper.sh`);
}
function shellSingleQuote(value) {
  return `'${value.replaceAll("'", "'\\''")}'`;
}
function collectLaunchAgentEnvironmentEntries(environment) {
  const entries = [];
  for (const [rawKey, rawValue] of Object.entries(environment ?? {})) {
    const key = normalizeEnvVarKey(rawKey, { portable: true });
    const value = rawValue?.trim();
    if (!key || !value) continue;
    entries.push([key, value]);
  }
  return entries.toSorted(([left], [right]) => left.localeCompare(right));
}
function buildLaunchAgentEnvironmentFile(entries) {
  return [
    "# Generated by OpenClaw. Do not edit while the gateway service is installed.",
    ...entries.map(([key, value]) => `export ${key}=${shellSingleQuote(value)}`),
    "",
  ].join("\n");
}
function buildLaunchAgentEnvironmentWrapper() {
  return `#!/bin/sh
set -eu
env_file="$1"
shift
if [ -f "$env_file" ]; then
  . "$env_file"
fi
exec "$@"
`;
}
async function resolveLaunchAgentEnvironmentWrapperOverwriteWarnings(params) {
  const existingWrapper = await fs.readFile(params.wrapperPath, "utf8").catch(() => null);
  if (existingWrapper === null || existingWrapper === params.generatedWrapper) return [];
  return [
    `Existing generated LaunchAgent env wrapper at ${params.wrapperPath} contains custom behavior and will be overwritten; move custom behavior to openclaw gateway install --wrapper <path> or OPENCLAW_WRAPPER.`,
  ];
}
function writeLaunchAgentOverwriteWarnings(stdout, warn, warnings) {
  for (const warning of warnings) {
    if (warn) {
      warn(warning);
      continue;
    }
    if (!stdout) continue;
    stdout.write(`${formatLine("Warning", warning)}\n`);
  }
}
function isLaunchAgentEnvironmentWrapperArgs(params) {
  return (
    (params.programArguments[0] === params.wrapperPath &&
      params.programArguments[1] === params.envFilePath) ||
    (params.programArguments[0] === "/bin/sh" &&
      params.programArguments[1] === params.wrapperPath &&
      params.programArguments[2] === params.envFilePath)
  );
}
async function prepareLaunchAgentProgramArguments(params) {
  const entries = collectLaunchAgentEnvironmentEntries(params.environment);
  if (entries.length === 0) return { programArguments: params.programArguments };
  const envDir = resolveLaunchAgentEnvDir(params.env);
  const envFilePath = resolveLaunchAgentEnvFilePath(params.env, params.label);
  const wrapperPath = resolveLaunchAgentEnvWrapperPath(params.env, params.label);
  const generatedWrapper = buildLaunchAgentEnvironmentWrapper();
  await ensureSecureDirectory(envDir, LAUNCH_AGENT_PRIVATE_DIR_MODE);
  await fs.writeFile(envFilePath, buildLaunchAgentEnvironmentFile(entries), {
    encoding: "utf8",
    mode: LAUNCH_AGENT_ENV_FILE_MODE,
  });
  await fs.chmod(envFilePath, LAUNCH_AGENT_ENV_FILE_MODE).catch(() => void 0);
  const overwriteWarnings = await resolveLaunchAgentEnvironmentWrapperOverwriteWarnings({
    wrapperPath,
    generatedWrapper,
  });
  writeLaunchAgentOverwriteWarnings(params.stdout, params.warn, overwriteWarnings);
  await fs.writeFile(wrapperPath, generatedWrapper, {
    encoding: "utf8",
    mode: LAUNCH_AGENT_ENV_WRAPPER_MODE,
  });
  await fs.chmod(wrapperPath, LAUNCH_AGENT_ENV_WRAPPER_MODE).catch(() => void 0);
  if (
    isLaunchAgentEnvironmentWrapperArgs({
      programArguments: params.programArguments,
      envFilePath,
      wrapperPath,
    })
  )
    return { programArguments: params.programArguments };
  return {
    programArguments: [
      LAUNCH_AGENT_ENV_WRAPPER_SHELL,
      wrapperPath,
      envFilePath,
      ...params.programArguments,
    ],
  };
}
function resolveLaunchAgentPlistPath(env) {
  return resolveLaunchAgentPlistPathForLabel(env, resolveLaunchAgentLabel({ env }));
}
function resolveLaunchAgentEnvironmentReadOptions(env, label) {
  return {
    expectedEnvironmentWrapperPath: resolveLaunchAgentEnvWrapperPath(env, label),
    expectedEnvironmentFilePath: resolveLaunchAgentEnvFilePath(env, label),
    generatedEnvironmentLabel: label,
  };
}
async function readLaunchAgentProgramArguments(env) {
  const label = resolveLaunchAgentLabel({ env });
  return readLaunchAgentProgramArgumentsFromFile(
    resolveLaunchAgentPlistPath(env),
    resolveLaunchAgentEnvironmentReadOptions(env, label),
  );
}
function buildLaunchAgentPlist({
  label = GATEWAY_LAUNCH_AGENT_LABEL,
  comment,
  programArguments,
  workingDirectory,
  stdoutPath,
  stderrPath,
  environment,
}) {
  return buildLaunchAgentPlist$1({
    label,
    comment,
    programArguments,
    workingDirectory,
    stdoutPath,
    stderrPath,
    environment,
  });
}
async function execLaunchctl(args) {
  const isWindows = process.platform === "win32";
  return await execFileUtf8(
    isWindows ? getWindowsCmdExePath() : "launchctl",
    isWindows ? ["/d", "/s", "/c", "launchctl", ...args] : args,
    isWindows ? { windowsHide: true } : {},
  );
}
function parseLaunchctlListOpenClawUpdateJobs(output) {
  return parseLaunchctlListOpenClawUpdateJobCandidates(output)
    .filter((job) => !job.requiresMetadata)
    .map(({ requiresMetadata: _requiresMetadata, ...job }) => job);
}
function parseLaunchctlListOpenClawUpdateJobCandidates(output) {
  const jobs = [];
  for (const rawLine of output.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const [pidRaw, statusRaw, ...labelParts] = line.split(/\s+/);
    const candidate = normalizeOpenClawUpdateLaunchdLabelCandidate(labelParts.join(" "));
    if (!candidate) continue;
    const pid = pidRaw === "-" ? void 0 : parseStrictPositiveInteger(pidRaw ?? "");
    const lastExitStatus = parseStrictInteger(statusRaw ?? "");
    jobs.push({
      label: candidate.label,
      requiresMetadata: candidate.requiresMetadata,
      ...(pid !== void 0 ? { pid } : {}),
      ...(lastExitStatus !== void 0 ? { lastExitStatus } : {}),
    });
  }
  return jobs.toSorted((a, b) => a.label.localeCompare(b.label));
}
function hasOpenClawUpdateLaunchdMarker(env) {
  return env?.OPENCLAW_UPDATE_RUN_HANDOFF?.trim() === "1";
}
function isOpenClawUpdateCommandPrefix(programArguments, updateIndex) {
  if (updateIndex === 1) {
    const cliName = path.basename(programArguments[0] ?? "").toLowerCase();
    return OPENCLAW_DIRECT_CLI_NAMES.has(cliName);
  }
  if (updateIndex !== 2) return false;
  const runtimeName = path.basename(programArguments[0] ?? "").toLowerCase();
  const entryName = path.basename(programArguments[1] ?? "").toLowerCase();
  return OPENCLAW_NODE_RUNTIME_NAMES.has(runtimeName) && OPENCLAW_SCRIPT_NAMES.has(entryName);
}
function isOpenClawUpdateProgramArguments(programArguments) {
  if (!Array.isArray(programArguments) || programArguments.length === 0) return false;
  const updateIndex = programArguments.findIndex((arg) => arg.trim() === "update");
  if (updateIndex < 0 || !programArguments.slice(updateIndex + 1).includes("--yes")) return false;
  return (
    isOpenClawUpdateCommandPrefix(programArguments, updateIndex) &&
    !programArguments.some((arg) => arg.trim() === "gateway")
  );
}
async function isLaunchdJobConfirmedOpenClawUpdater(params) {
  const command = await readLaunchAgentProgramArgumentsFromFile(
    resolveLaunchAgentPlistPathForLabel(params.env, params.label),
  );
  return (
    hasOpenClawUpdateLaunchdMarker(command?.environment) ||
    isOpenClawUpdateProgramArguments(command?.programArguments)
  );
}
async function findStaleOpenClawUpdateLaunchdJobs(env = process.env) {
  if (process.platform !== "darwin") return [];
  const result = await execLaunchctl(["list"]);
  if (result.code !== 0) return [];
  const jobs = [];
  for (const job of parseLaunchctlListOpenClawUpdateJobCandidates(result.stdout)) {
    if (isCurrentGatewayLaunchdLabel(job.label, env)) continue;
    if (
      job.requiresMetadata &&
      !(await isLaunchdJobConfirmedOpenClawUpdater({
        label: job.label,
        env,
      }))
    )
      continue;
    jobs.push({
      label: job.label,
      ...(job.pid !== void 0 ? { pid: job.pid } : {}),
      ...(job.lastExitStatus !== void 0 ? { lastExitStatus: job.lastExitStatus } : {}),
    });
  }
  return jobs;
}
async function disableOpenClawUpdateLaunchdJobCandidate(params) {
  if (process.platform !== "darwin") return false;
  if (
    params.candidate.requiresMetadata &&
    !(
      (params.trustCurrentEnvMarker && hasOpenClawUpdateLaunchdMarker(params.env)) ||
      (await isLaunchdJobConfirmedOpenClawUpdater({
        label: params.candidate.label,
        env: params.env,
      }))
    )
  )
    return false;
  return (
    (
      await execLaunchctl([
        "disable",
        `${resolveGuiDomain()}/${assertValidLaunchAgentLabel(params.candidate.label)}`,
      ])
    ).code === 0
  );
}
async function disableOpenClawUpdateLaunchdJob(label, env = process.env) {
  const candidate = normalizeOpenClawUpdateLaunchdLabelCandidate(label);
  if (!candidate) return false;
  return await disableOpenClawUpdateLaunchdJobCandidate({
    candidate,
    env,
    trustCurrentEnvMarker: false,
  });
}
async function disableCurrentOpenClawUpdateLaunchdJob(env = process.env) {
  const candidate = resolveCurrentOpenClawUpdateLaunchdJobLabel(env);
  if (!candidate) return false;
  return await disableOpenClawUpdateLaunchdJobCandidate({
    candidate,
    env,
    trustCurrentEnvMarker: isCurrentProcessLaunchdServiceLabel(candidate.label, env, {
      allowConfiguredLabelFallback: false,
    }),
  });
}
function parseGatewayPortFromProgramArguments(programArguments) {
  if (!Array.isArray(programArguments) || programArguments.length === 0) return null;
  for (let index = 0; index < programArguments.length; index += 1) {
    const current = programArguments[index]?.trim();
    if (!current) continue;
    if (current === "--port") {
      const next = parseTcpPort(programArguments[index + 1] ?? "");
      if (next !== null) return next;
      continue;
    }
    if (current.startsWith("--port=")) {
      const value = parseTcpPort(current.slice(7));
      if (value !== null) return value;
    }
  }
  return null;
}
async function resolveLaunchAgentGatewayPort(env) {
  const command = await readLaunchAgentProgramArguments(env).catch(() => null);
  const fromArgs = parseGatewayPortFromProgramArguments(command?.programArguments);
  if (fromArgs !== null) return fromArgs;
  const fromServiceEnv = parseTcpPort(command?.environment?.OPENCLAW_GATEWAY_PORT ?? "");
  if (fromServiceEnv !== null) return fromServiceEnv;
  return parseTcpPort(env.OPENCLAW_GATEWAY_PORT ?? "");
}
function resolveGuiDomain() {
  if (typeof process.getuid !== "function") return "gui/501";
  return `gui/${process.getuid()}`;
}
function throwBootstrapGuiSessionError(params) {
  throw new Error(formatLaunchAgentGuiSessionError(params));
}
function formatLaunchAgentGuiSessionError(params) {
  return [
    `launchctl bootstrap failed: ${params.detail}`,
    `LaunchAgent ${params.actionHint} requires a logged-in macOS GUI session for this user (${params.domain}).`,
    "This usually means you are running from SSH/headless context or as the wrong user (including sudo).",
    `Fix: sign in to the macOS desktop as the target user and rerun \`${params.actionHint}\`.`,
    "For headless VM setups, enable auto-login for the target user so macOS creates the GUI session after boot.",
    "Headless deployments should use a dedicated logged-in user session or a custom LaunchDaemon (not shipped): https://docs.openclaw.ai/gateway",
  ].join("\n");
}
function writeLaunchAgentActionLine(stdout, label, value) {
  try {
    stdout.write(`${formatLine(label, value)}\n`);
  } catch (err) {
    if (err?.code !== "EPIPE") throw err;
  }
}
async function bootstrapLaunchAgentOrThrow(params) {
  await execLaunchctl(["enable", params.serviceTarget]);
  const boot = await execLaunchctl(["bootstrap", params.domain, params.plistPath]);
  if (boot.code === 0) return;
  const detail = (boot.stderr || boot.stdout).trim();
  if (isUnsupportedGuiDomain(detail))
    throwBootstrapGuiSessionError({
      detail,
      domain: params.domain,
      actionHint: params.actionHint,
    });
  if (isLaunchctlOperationAlreadyInProgress(detail)) {
    const state = await probeLaunchAgentState(params.serviceTarget);
    if (state.state === "running" || state.state === "stopped") return;
  }
  throw new Error(`launchctl bootstrap failed: ${detail}`);
}
async function ensureLaunchAgentPlistReadable(plistPath) {
  await fs.chmod(plistPath, LAUNCH_AGENT_PLIST_MODE).catch(() => void 0);
}
async function ensureSecureDirectory(targetPath, dirMode = LAUNCH_AGENT_DIR_MODE) {
  await fs.mkdir(targetPath, {
    recursive: true,
    mode: dirMode,
  });
  try {
    const mode = (await fs.stat(targetPath)).mode & 511;
    const tightenedMode = mode & ~(dirMode === LAUNCH_AGENT_PRIVATE_DIR_MODE ? 63 : 18);
    if (tightenedMode !== mode) await fs.chmod(targetPath, tightenedMode);
  } catch {}
}
async function ensureLaunchAgentEnvironmentDirectories(environment) {
  const tmpDir = environment?.TMPDIR?.trim();
  if (tmpDir) await ensureSecureDirectory(tmpDir, LAUNCH_AGENT_PRIVATE_DIR_MODE);
}
function parseLaunchctlPrint(output) {
  const entries = parseKeyValueOutput(output, "=");
  const info = {};
  const state = entries.state;
  if (state) info.state = state;
  const pidValue = entries.pid;
  if (pidValue) {
    const pid = parseStrictPositiveInteger(pidValue);
    if (pid !== void 0) info.pid = pid;
  }
  const exitStatusValue = entries["last exit status"];
  if (exitStatusValue) {
    const status = parseStrictInteger(exitStatusValue);
    if (status !== void 0) info.lastExitStatus = status;
  }
  const exitReason = entries["last exit reason"];
  if (exitReason) info.lastExitReason = exitReason;
  return info;
}
async function isLaunchAgentLoaded(args) {
  return (
    (
      await execLaunchctl([
        "print",
        `${resolveGuiDomain()}/${resolveLaunchAgentLabel({ env: args.env })}`,
      ])
    ).code === 0
  );
}
async function launchAgentPlistExists(env) {
  try {
    const plistPath = resolveLaunchAgentPlistPath(env);
    await fs.access(plistPath);
    return true;
  } catch {
    return false;
  }
}
async function readLaunchAgentRuntime(env) {
  const res = await execLaunchctl([
    "print",
    `${resolveGuiDomain()}/${resolveLaunchAgentLabel({ env })}`,
  ]);
  if (res.code !== 0) {
    const plistExists = await launchAgentPlistExists(env);
    const detail = (res.stderr || res.stdout).trim() || void 0;
    const missingGuiSession = plistExists && isUnsupportedGuiDomain(detail ?? "");
    return {
      status: "unknown",
      detail,
      ...(plistExists
        ? {
            missingSupervision: true,
            ...(missingGuiSession ? { missingGuiSession } : {}),
          }
        : { missingUnit: true }),
    };
  }
  const parsed = parseLaunchctlPrint(res.stdout || res.stderr || "");
  const plistExists = await launchAgentPlistExists(env);
  const state = normalizeLowercaseStringOrEmpty(parsed.state);
  return {
    status: state === "running" || parsed.pid ? "running" : state ? "stopped" : "unknown",
    state: parsed.state,
    pid: parsed.pid,
    lastExitStatus: parsed.lastExitStatus,
    lastExitReason: parsed.lastExitReason,
    cachedLabel: !plistExists,
  };
}
function isLaunchctlAlreadyLoaded(res) {
  const detail = normalizeLowercaseStringOrEmpty(res.stderr || res.stdout);
  return res.code === 130 || detail.includes("already exists in domain");
}
async function repairLaunchAgentBootstrap(args) {
  const env = args.env ?? process.env;
  const domain = resolveGuiDomain();
  const label = resolveLaunchAgentLabel({ env });
  const plistPath = resolveLaunchAgentPlistPath(env);
  const serviceTarget = `${domain}/${label}`;
  await rewriteLaunchAgentPlistForRestart({
    env,
    label,
    plistPath,
    warn: args.warn ?? ((message) => process.stderr.write(`${formatLine("Warning", message)}\n`)),
  });
  await execLaunchctl(["enable", serviceTarget]);
  const boot = await execLaunchctl(["bootstrap", domain, plistPath]);
  let repairStatus = "repaired";
  if (boot.code !== 0) {
    const detail = (boot.stderr || boot.stdout).trim();
    if (isUnsupportedGuiDomain(detail))
      return {
        ok: false,
        status: "gui-session-unavailable",
        detail,
        domain,
      };
    if (!isLaunchctlAlreadyLoaded(boot))
      return {
        ok: false,
        status: "bootstrap-failed",
        detail: detail || void 0,
      };
    repairStatus = "already-loaded";
  }
  if (repairStatus === "repaired")
    return {
      ok: true,
      status: repairStatus,
    };
  if ((await readLaunchAgentRuntime(env)).status === "running")
    return {
      ok: true,
      status: repairStatus,
    };
  const kick = await execLaunchctl(["kickstart", serviceTarget]);
  if (kick.code !== 0)
    return {
      ok: false,
      status: "kickstart-failed",
      detail: (kick.stderr || kick.stdout).trim() || void 0,
    };
  return {
    ok: true,
    status: repairStatus,
  };
}
async function uninstallLaunchAgent({ env, stdout }) {
  const domain = resolveGuiDomain();
  const label = resolveLaunchAgentLabel({ env });
  const plistPath = resolveLaunchAgentPlistPath(env);
  await execLaunchctl(["bootout", domain, plistPath]);
  await execLaunchctl(["unload", plistPath]);
  try {
    await fs.access(plistPath);
  } catch {
    stdout.write(`LaunchAgent not found at ${plistPath}\n`);
    return;
  }
  const home = toPosixPath(resolveHomeDir(env));
  const trashDir = path.posix.join(home, ".Trash");
  const dest = path.join(trashDir, `${label}.plist`);
  try {
    await fs.mkdir(trashDir, { recursive: true });
    await fs.rename(plistPath, dest);
    stdout.write(`${formatLine("Moved LaunchAgent to Trash", dest)}\n`);
  } catch {
    stdout.write(`LaunchAgent remains at ${plistPath} (could not move)\n`);
  }
}
function isLaunchctlNotLoaded(res) {
  const detail = normalizeLowercaseStringOrEmpty(res.stderr || res.stdout);
  return (
    detail.includes("no such process") ||
    detail.includes("could not find service") ||
    detail.includes("not found")
  );
}
function isUnsupportedGuiDomain(detail) {
  const normalized = normalizeLowercaseStringOrEmpty(detail);
  return (
    normalized.includes("domain does not support specified action") ||
    normalized.includes("could not find domain for user gui") ||
    normalized.includes("bootstrap failed: 125")
  );
}
function isLaunchctlOperationAlreadyInProgress(detail) {
  const normalized = normalizeLowercaseStringOrEmpty(detail);
  return (
    normalized.includes("operation already in progress") ||
    normalized.includes("bootstrap failed: 37")
  );
}
function formatLaunchctlResultDetail(res) {
  return truncateUtf16Safe(
    sanitizeForLog((res.stderr || res.stdout).replace(/[\r\n\t]+/g, " "))
      .replace(/\s+/g, " ")
      .trim(),
    1e3,
  );
}
async function bootoutLaunchAgentOrThrow(params) {
  const bootout = await execLaunchctl(["bootout", params.serviceTarget]);
  if (bootout.code !== 0 && !isLaunchctlNotLoaded(bootout))
    throw new Error(
      `${params.warning}; launchctl bootout failed: ${formatLaunchctlResultDetail(bootout)}`,
    );
  params.stdout.write(`${formatLine("Warning", params.warning)}\n`);
}
async function probeLaunchAgentState(serviceTarget) {
  const probe = await execLaunchctl(["print", serviceTarget]);
  if (probe.code !== 0) {
    if (isLaunchctlNotLoaded(probe)) return { state: "not-loaded" };
    return {
      state: "unknown",
      detail: formatLaunchctlResultDetail(probe) || void 0,
    };
  }
  const runtime = parseLaunchctlPrint(probe.stdout || probe.stderr || "");
  if (
    normalizeLowercaseStringOrEmpty(runtime.state) === "running" ||
    (typeof runtime.pid === "number" && runtime.pid > 1)
  )
    return { state: "running" };
  return { state: "stopped" };
}
async function waitForLaunchAgentStopped(serviceTarget) {
  let lastUnknown = null;
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const probe = await probeLaunchAgentState(serviceTarget);
    if (probe.state === "stopped" || probe.state === "not-loaded") return probe;
    if (probe.state === "unknown") lastUnknown = probe;
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
  }
  return lastUnknown ?? { state: "running" };
}
async function waitForGatewayPortRelease(port) {
  const deadline = Date.now() + LAUNCH_AGENT_STOP_PORT_RELEASE_TIMEOUT_MS;
  while (Date.now() < deadline) {
    await sleep(Math.min(LAUNCH_AGENT_STOP_PORT_RELEASE_POLL_MS, deadline - Date.now()));
    if ((await probePortUsage(port)) === "free") return true;
  }
  return false;
}
async function assertGatewayPortReleasedAfterStop(env) {
  const port = await resolveLaunchAgentGatewayPort(env);
  if (port === null) return;
  cleanStaleGatewayProcessesSync(port);
  const diagnostics = await inspectPortUsage(port).catch(() => null);
  if (diagnostics?.status !== "busy") return;
  if (await waitForGatewayPortRelease(port)) return;
  throw new Error(
    [
      `gateway port ${port} is still busy after LaunchAgent stop`,
      ...formatPortDiagnostics(diagnostics),
    ].join("\n"),
  );
}
async function stopLaunchAgent({ stdout, env, disable: persistDisable }) {
  const serviceEnv = env ?? process.env;
  const domain = resolveGuiDomain();
  const label = resolveLaunchAgentLabel({ env: serviceEnv });
  const serviceTarget = `${domain}/${label}`;
  if (
    isCurrentProcessLaunchdServiceLabel(label, process.env, { allowConfiguredLabelFallback: false })
  )
    throw new Error(
      `Refusing to stop LaunchAgent ${label} from inside the same launchd service; run this command from an external shell.`,
    );
  if (!persistDisable) {
    const bootout = await execLaunchctl(["bootout", serviceTarget]);
    if (bootout.code !== 0 && !isLaunchctlNotLoaded(bootout))
      throw new Error(`launchctl bootout failed: ${formatLaunchctlResultDetail(bootout)}`);
    await assertGatewayPortReleasedAfterStop(serviceEnv);
    stdout.write(`${formatLine("Stopped LaunchAgent", serviceTarget)}\n`);
    return;
  }
  const disableResult = await execLaunchctl(["disable", serviceTarget]);
  if (disableResult.code !== 0) {
    await bootoutLaunchAgentOrThrow({
      serviceTarget,
      stdout,
      warning: `launchctl disable failed; used bootout fallback and left service unloaded: ${formatLaunchctlResultDetail(disableResult)}`,
    });
    await assertGatewayPortReleasedAfterStop(serviceEnv);
    stdout.write(`${formatLine("Stopped LaunchAgent (degraded)", serviceTarget)}\n`);
    return;
  }
  const stop = await execLaunchctl(["stop", label]);
  if (stop.code !== 0 && !isLaunchctlNotLoaded(stop)) {
    await bootoutLaunchAgentOrThrow({
      serviceTarget,
      stdout,
      warning: `launchctl stop failed; used bootout fallback and left service unloaded: ${formatLaunchctlResultDetail(stop)}`,
    });
    await assertGatewayPortReleasedAfterStop(serviceEnv);
    stdout.write(`${formatLine("Stopped LaunchAgent (degraded)", serviceTarget)}\n`);
    return;
  }
  const stopState = await waitForLaunchAgentStopped(serviceTarget);
  if (stopState.state !== "stopped" && stopState.state !== "not-loaded") {
    await bootoutLaunchAgentOrThrow({
      serviceTarget,
      stdout,
      warning:
        stopState.state === "unknown"
          ? `launchctl print could not confirm stop; used bootout fallback and left service unloaded: ${stopState.detail ?? "unknown error"}`
          : "launchctl stop did not fully stop the service; used bootout fallback and left service unloaded",
    });
    await assertGatewayPortReleasedAfterStop(serviceEnv);
    stdout.write(`${formatLine("Stopped LaunchAgent (degraded)", serviceTarget)}\n`);
    return;
  }
  await assertGatewayPortReleasedAfterStop(serviceEnv);
  stdout.write(`${formatLine("Stopped LaunchAgent", serviceTarget)}\n`);
}
async function writeLaunchAgentPlist({
  env,
  programArguments,
  workingDirectory,
  environment,
  description,
  stdout,
  warn,
}) {
  const { logDir, stdoutPath } = resolveGatewaySupervisorLogPaths(env, { platform: "darwin" });
  await ensureSecureDirectory(logDir);
  const domain = resolveGuiDomain();
  const label = resolveLaunchAgentLabel({ env });
  for (const legacyLabel of resolveLegacyGatewayLaunchAgentLabels(env.OPENCLAW_PROFILE)) {
    const legacyPlistPath = resolveLaunchAgentPlistPathForLabel(env, legacyLabel);
    await execLaunchctl(["bootout", domain, legacyPlistPath]);
    await execLaunchctl(["unload", legacyPlistPath]);
    try {
      await fs.unlink(legacyPlistPath);
    } catch {}
  }
  const plistPath = resolveLaunchAgentPlistPathForLabel(env, label);
  const home = toPosixPath(resolveHomeDir(env));
  const libraryDir = path.posix.join(home, "Library");
  await ensureSecureDirectory(home);
  await ensureSecureDirectory(libraryDir);
  await ensureSecureDirectory(path.dirname(plistPath));
  await ensureLaunchAgentEnvironmentDirectories(environment);
  const prepared = await prepareLaunchAgentProgramArguments({
    env,
    label,
    programArguments,
    environment,
    stdout,
    warn,
  });
  const plist = buildLaunchAgentPlist({
    label,
    comment: resolveGatewayServiceDescription({
      env,
      environment,
      description,
    }),
    programArguments: prepared.programArguments,
    workingDirectory,
    stdoutPath,
    stderrPath: LAUNCH_AGENT_STDERR_PATH,
    environment: prepared.inlineEnvironment,
  });
  await fs.writeFile(plistPath, plist, {
    encoding: "utf8",
    mode: LAUNCH_AGENT_PLIST_MODE,
  });
  await ensureLaunchAgentPlistReadable(plistPath);
  return {
    plistPath,
    stdoutPath,
  };
}
async function stageLaunchAgent({ stdout, ...args }) {
  const { plistPath, stdoutPath } = await writeLaunchAgentPlist({
    ...args,
    stdout,
  });
  writeFormattedLines(
    stdout,
    [
      {
        label: "Staged LaunchAgent",
        value: plistPath,
      },
      {
        label: "Logs",
        value: stdoutPath,
      },
    ],
    { leadingBlankLine: true },
  );
  return { plistPath };
}
async function activateLaunchAgent(params) {
  const domain = resolveGuiDomain();
  const label = resolveLaunchAgentLabel({ env: params.env });
  await execLaunchctl(["bootout", domain, params.plistPath]);
  await execLaunchctl(["unload", params.plistPath]);
  await bootstrapLaunchAgentOrThrow({
    domain,
    serviceTarget: `${domain}/${label}`,
    plistPath: params.plistPath,
    actionHint: "openclaw gateway install --force",
  });
}
async function installLaunchAgent(args) {
  const { plistPath, stdoutPath } = await writeLaunchAgentPlist(args);
  await activateLaunchAgent({
    env: args.env,
    plistPath,
  });
  writeFormattedLines(
    args.stdout,
    [
      {
        label: "Installed LaunchAgent",
        value: plistPath,
      },
      {
        label: "Logs",
        value: stdoutPath,
      },
    ],
    { leadingBlankLine: true },
  );
  return { plistPath };
}
async function rewriteLaunchAgentPlistForRestart({ env, label, plistPath, stdout, warn }) {
  const existing = await readLaunchAgentProgramArgumentsFromFile(
    plistPath,
    resolveLaunchAgentEnvironmentReadOptions(env, label),
  );
  if (!existing?.programArguments.length) return false;
  const { logDir, stdoutPath } = resolveGatewaySupervisorLogPaths(env, { platform: "darwin" });
  await ensureSecureDirectory(logDir);
  const serviceDescription = resolveGatewayServiceDescription({
    env,
    environment: existing.environment,
  });
  const prepared = await prepareLaunchAgentProgramArguments({
    env,
    label,
    programArguments: existing.programArguments,
    environment: existing.environment,
    stdout,
    warn,
  });
  const plist = buildLaunchAgentPlist({
    label,
    comment: serviceDescription,
    programArguments: prepared.programArguments,
    workingDirectory: existing.workingDirectory,
    stdoutPath,
    stderrPath: LAUNCH_AGENT_STDERR_PATH,
    environment: prepared.inlineEnvironment,
  });
  if ((await fs.readFile(plistPath, "utf8").catch(() => "")) === plist) {
    await ensureLaunchAgentPlistReadable(plistPath);
    return false;
  }
  await fs.writeFile(plistPath, plist, {
    encoding: "utf8",
    mode: LAUNCH_AGENT_PLIST_MODE,
  });
  await ensureLaunchAgentPlistReadable(plistPath);
  return true;
}
async function ensureLaunchAgentLoadedAfterFailure(params) {
  if ((await execLaunchctl(["print", params.serviceTarget])).code === 0) return;
  try {
    await bootstrapLaunchAgentOrThrow({
      domain: params.domain,
      serviceTarget: params.serviceTarget,
      plistPath: params.plistPath,
      actionHint: "openclaw gateway start",
    });
  } catch {}
}
async function restartLaunchAgent({ stdout, env, warn }) {
  const serviceEnv = env ?? process.env;
  const domain = resolveGuiDomain();
  const label = resolveLaunchAgentLabel({ env: serviceEnv });
  const plistPath = resolveLaunchAgentPlistPath(serviceEnv);
  const serviceTarget = `${domain}/${label}`;
  if (isCurrentProcessLaunchdServiceLabel(label)) {
    const handoff = scheduleDetachedLaunchdRestartHandoff({
      env: serviceEnv,
      mode: (await rewriteLaunchAgentPlistForRestart({
        env: serviceEnv,
        label,
        plistPath,
        stdout,
        warn,
      }))
        ? "reload"
        : "kickstart",
      waitForPid: process.pid,
    });
    if (!handoff.ok) throw new Error(`launchd restart handoff failed: ${handoff.error}`);
    writeLaunchAgentActionLine(stdout, "Scheduled LaunchAgent restart", serviceTarget);
    return { outcome: "scheduled" };
  }
  const cleanupPort = await resolveLaunchAgentGatewayPort(serviceEnv);
  if (cleanupPort !== null) {
    cleanStaleGatewayProcessesSync(cleanupPort);
    const diagnostics = await inspectPortUsage(cleanupPort).catch(() => null);
    if (diagnostics?.status === "busy")
      throw new Error(
        [
          `gateway port ${cleanupPort} is still busy before LaunchAgent restart`,
          ...formatPortDiagnostics(diagnostics),
        ].join("\n"),
      );
  }
  const plistReloadNeeded = await rewriteLaunchAgentPlistForRestart({
    env: serviceEnv,
    label,
    plistPath,
    stdout,
    warn,
  });
  await execLaunchctl(["enable", serviceTarget]);
  if (plistReloadNeeded) {
    const bootout = await execLaunchctl(["bootout", serviceTarget]);
    if (bootout.code !== 0 && !isLaunchctlNotLoaded(bootout))
      throw new Error(`launchctl bootout failed: ${formatLaunchctlResultDetail(bootout)}`);
    await bootstrapLaunchAgentOrThrow({
      domain,
      serviceTarget,
      plistPath,
      actionHint: "openclaw gateway restart",
    });
    writeLaunchAgentActionLine(stdout, "Restarted LaunchAgent", serviceTarget);
    return { outcome: "completed" };
  }
  const start = await execLaunchctl(["kickstart", "-k", serviceTarget]);
  if (start.code === 0) {
    writeLaunchAgentActionLine(stdout, "Restarted LaunchAgent", serviceTarget);
    return { outcome: "completed" };
  }
  if (!isLaunchctlNotLoaded(start)) {
    await ensureLaunchAgentLoadedAfterFailure({
      domain,
      serviceTarget,
      plistPath,
    });
    throw new Error(`launchctl kickstart failed: ${start.stderr || start.stdout}`.trim());
  }
  await bootstrapLaunchAgentOrThrow({
    domain,
    serviceTarget,
    plistPath,
    actionHint: "openclaw gateway restart",
  });
  writeLaunchAgentActionLine(stdout, "Restarted LaunchAgent", serviceTarget);
  return { outcome: "completed" };
}
//#endregion
export {
  uninstallLaunchAgent as _,
  installLaunchAgent as a,
  parseLaunchctlListOpenClawUpdateJobs as c,
  readLaunchAgentRuntime as d,
  repairLaunchAgentBootstrap as f,
  stopLaunchAgent as g,
  stageLaunchAgent as h,
  formatLaunchAgentGuiSessionError as i,
  parseLaunchctlPrint as l,
  restartLaunchAgent as m,
  disableOpenClawUpdateLaunchdJob as n,
  isLaunchAgentLoaded as o,
  resolveLaunchAgentPlistPath as p,
  findStaleOpenClawUpdateLaunchdJobs as r,
  launchAgentPlistExists as s,
  disableCurrentOpenClawUpdateLaunchdJob as t,
  readLaunchAgentProgramArguments as u,
};
