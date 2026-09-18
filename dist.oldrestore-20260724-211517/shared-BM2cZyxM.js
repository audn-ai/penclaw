import { Writable } from "node:stream";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import {
  m as resolveGatewayWindowsTaskName,
  p as resolveGatewaySystemdServiceName,
  u as resolveGatewayLaunchAgentLabel,
} from "./constants-obO8goqF.js";
import { m as resolveIsNixMode } from "./paths-DEklnbzU.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import {
  a as isSystemdUnavailableDetail,
  i as resolveDaemonContainerContext,
  n as buildPlatformServiceStartHints,
  o as renderSystemdUnavailableHints,
  t as buildPlatformRuntimeLogHints,
} from "./runtime-hints-DaMB6xc0.js";
import { h as classifySystemdUnavailableDetail } from "./systemd-BI3sgDKJ.js";
import { r as parseTcpPortFromArgs } from "./tcp-port-1cXcKObm.js";
import { n as isRich, r as theme, t as colorize } from "./theme-vjDs9tao.js";
import "./parse-port-DxlKuJRE.js";
import { l as isWSL } from "./undici-runtime-Bm6J6FAw.js";
//#region src/cli/daemon-cli/response.ts
function emitDaemonActionJson(payload) {
  defaultRuntime.writeJson(payload);
}
function classifyDaemonHintText(text) {
  if (text.includes("openclaw gateway install") || text.startsWith("Service not installed. Run:"))
    return "install";
  if (text.startsWith("Restart the container or the service that manages it for "))
    return "container-restart";
  if (text.startsWith("systemd user services are unavailable;")) return "systemd-unavailable";
  if (
    text.startsWith("On a headless server (SSH/no desktop session):") ||
    text.startsWith("Also ensure XDG_RUNTIME_DIR is set:")
  )
    return "systemd-headless";
  if (text.startsWith("If you're in a container, run the gateway in the foreground instead of"))
    return "container-foreground";
  if (
    text.startsWith("WSL2 needs systemd enabled:") ||
    text.startsWith("Then run: wsl --shutdown") ||
    text.startsWith("Verify: systemctl --user status")
  )
    return "wsl-systemd";
  return "generic";
}
/** Classify plain-text hints for JSON daemon responses. */
function buildDaemonHintItems(hints) {
  if (!hints?.length) return;
  return hints.map((text) => ({
    kind: classifyDaemonHintText(text),
    text,
  }));
}
/** Build the service metadata snapshot embedded in JSON action responses. */
function buildDaemonServiceSnapshot(service, loaded) {
  return {
    label: service.label,
    loaded,
    loadedText: service.loadedText,
    notLoadedText: service.notLoadedText,
  };
}
/** Writable sink used when JSON output should suppress service command stdout. */
function createNullWriter() {
  return new Writable({
    write(_chunk, _encoding, callback) {
      callback();
    },
  });
}
/** Create stdout/warning/emit/fail helpers for one daemon lifecycle action. */
function createDaemonActionContext(params) {
  const warnings = [];
  const stdout = params.json ? createNullWriter() : process.stdout;
  const emit = (payload) => {
    if (!params.json) return;
    emitDaemonActionJson({
      action: params.action,
      ...payload,
      hintItems: payload.hintItems ?? buildDaemonHintItems(payload.hints),
      warnings: payload.warnings ?? (warnings.length ? warnings : void 0),
    });
  };
  const fail = (message, hints) => {
    if (params.json)
      emit({
        ok: false,
        error: message,
        hints,
      });
    else {
      defaultRuntime.error(message);
      if (hints?.length) for (const hint of hints) defaultRuntime.log(`Tip: ${hint}`);
    }
    defaultRuntime.exit(1);
  };
  return {
    stdout,
    warnings,
    emit,
    fail,
  };
}
async function buildInstallFailureHints(error) {
  const detail = String(error);
  if (process.platform !== "linux" || !isSystemdUnavailableDetail(detail)) return;
  return renderSystemdUnavailableHints({
    wsl: await isWSL(),
    kind: classifySystemdUnavailableDetail(detail),
  });
}
/** Install a service, convert platform install failures to hints, and emit the final response. */
async function installDaemonServiceAndEmit(params) {
  try {
    await params.install();
  } catch (err) {
    params.fail(
      `${params.serviceNoun} install failed: ${String(err)}`,
      await buildInstallFailureHints(err),
    );
    return;
  }
  let installed;
  try {
    installed = await params.service.isLoaded({ env: process.env });
  } catch {
    installed = true;
  }
  params.emit({
    ok: true,
    result: "installed",
    service: buildDaemonServiceSnapshot(params.service, installed),
    warnings: params.warnings.length ? params.warnings : void 0,
  });
}
//#endregion
//#region src/cli/daemon-cli/shared.ts
/** Create install action context with JSON flag normalization. */
function createDaemonInstallActionContext(jsonFlag) {
  const json = Boolean(jsonFlag);
  return {
    json,
    ...createDaemonActionContext({
      action: "install",
      json,
    }),
  };
}
/** Block service installation in Nix mode, where managed service install is unsupported. */
function failIfNixDaemonInstallMode(fail, env = process.env) {
  if (!resolveIsNixMode(env)) return false;
  fail("Nix mode detected; service install is disabled.");
  return true;
}
/** Build terminal style helpers for status output with no-color fallback. */
function createCliStatusTextStyles() {
  const rich = isRich();
  return {
    rich,
    label: (value) => colorize(rich, theme.muted, value),
    accent: (value) => colorize(rich, theme.accent, value),
    infoText: (value) => colorize(rich, theme.info, value),
    okText: (value) => colorize(rich, theme.success, value),
    warnText: (value) => colorize(rich, theme.warn, value),
    errorText: (value) => colorize(rich, theme.error, value),
  };
}
/** Pick the color function for a runtime status label. */
function resolveRuntimeStatusColor(status) {
  const runtimeStatus = status ?? "unknown";
  return runtimeStatus === "running"
    ? theme.success
    : runtimeStatus === "stopped"
      ? theme.error
      : runtimeStatus === "unknown"
        ? theme.muted
        : theme.warn;
}
/** Extract `--port` from service ProgramArguments. */
function parsePortFromArgs(programArguments) {
  return parseTcpPortFromArgs(programArguments);
}
/** Pick the best local probe host for a configured Gateway bind mode. */
function pickProbeHostForBind(bindMode, tailnetIPv4, customBindHost) {
  if (bindMode === "custom" && customBindHost?.trim()) return customBindHost.trim();
  if (bindMode === "tailnet") return tailnetIPv4 ?? "127.0.0.1";
  if (bindMode === "lan") return "127.0.0.1";
  return "127.0.0.1";
}
const SAFE_DAEMON_ENV_KEYS = [
  "OPENCLAW_PROFILE",
  "OPENCLAW_STATE_DIR",
  "OPENCLAW_CONFIG_PATH",
  "OPENCLAW_GATEWAY_PORT",
  "OPENCLAW_NIX_MODE",
];
/** Keep only daemon env keys safe to print in diagnostics. */
function filterDaemonEnv(env) {
  if (!env) return {};
  const filtered = {};
  for (const key of SAFE_DAEMON_ENV_KEYS) {
    const value = env[key];
    if (!value?.trim()) continue;
    filtered[key] = value.trim();
  }
  return filtered;
}
/** Format safe daemon env entries for status output. */
function safeDaemonEnv(env) {
  const filtered = filterDaemonEnv(env);
  return Object.entries(filtered).map(([key, value]) => `${key}=${value}`);
}
/** Normalize listener address strings from platform socket tools. */
function normalizeListenerAddress(raw) {
  let value = raw.trim();
  if (!value) return value;
  value = value.replace(/^TCP\s+/i, "");
  value = value.replace(/\s+\(LISTEN\)\s*$/i, "");
  return value.trim();
}
/** Render platform-specific hints for missing/stopped Gateway runtimes. */
function renderRuntimeHints(runtime, env = process.env, logFile) {
  if (!runtime) return [];
  const hints = [];
  const fileLog = logFile ?? null;
  if (runtime.missingUnit) {
    hints.push(`Service not installed. Run: ${formatCliCommand("openclaw gateway install", env)}`);
    if (fileLog) hints.push(`File logs: ${fileLog}`);
    return hints;
  }
  if (runtime.missingGuiSession) {
    hints.push(
      "LaunchAgent requires a logged-in macOS GUI session; SSH/headless/sudo shells cannot bootstrap gui/$UID.",
    );
    hints.push(
      `Sign in to the macOS desktop as this user, then run: ${formatCliCommand("openclaw gateway restart", env)}`,
    );
    hints.push(
      "For headless VM setups, enable auto-login for the target user or use a custom LaunchDaemon (not shipped).",
    );
    if (fileLog) hints.push(`File logs: ${fileLog}`);
    return hints;
  }
  if (runtime.missingSupervision) {
    hints.push(
      `LaunchAgent installed but not loaded. Run: ${formatCliCommand("openclaw gateway restart", env)}`,
    );
    if (fileLog) hints.push(`File logs: ${fileLog}`);
    return hints;
  }
  if (runtime.status === "stopped") {
    if (fileLog) hints.push(`File logs: ${fileLog}`);
    hints.push(
      ...buildPlatformRuntimeLogHints({
        env,
        systemdServiceName: resolveGatewaySystemdServiceName(env.OPENCLAW_PROFILE),
        windowsTaskName: resolveGatewayWindowsTaskName(env.OPENCLAW_PROFILE),
      }),
    );
  }
  return hints;
}
/** Render install/start hints for the current service platform/container context. */
function renderGatewayServiceStartHints(env = process.env) {
  const profile = env.OPENCLAW_PROFILE;
  const container = resolveDaemonContainerContext(env);
  const hints = buildPlatformServiceStartHints({
    installCommand: formatCliCommand("openclaw gateway install", env),
    startCommand: formatCliCommand("openclaw gateway", env),
    launchAgentPlistPath: `~/Library/LaunchAgents/${resolveGatewayLaunchAgentLabel(profile)}.plist`,
    systemdServiceName: resolveGatewaySystemdServiceName(profile),
    windowsTaskName: resolveGatewayWindowsTaskName(profile),
  });
  if (!container) return hints;
  return [`Restart the container or the service that manages it for ${container}.`];
}
/** Drop generic systemd hints when a container-specific hint is clearer. */
function filterContainerGenericHints(hints, env = process.env) {
  if (!resolveDaemonContainerContext(env)) return hints;
  return hints.filter(
    (hint) =>
      !hint.includes("If you're in a container, run the gateway in the foreground instead of") &&
      !hint.includes("systemd user services are unavailable; install/enable systemd"),
  );
}
//#endregion
export {
  filterDaemonEnv as a,
  pickProbeHostForBind as c,
  resolveRuntimeStatusColor as d,
  safeDaemonEnv as f,
  installDaemonServiceAndEmit as g,
  createNullWriter as h,
  filterContainerGenericHints as i,
  renderGatewayServiceStartHints as l,
  createDaemonActionContext as m,
  createDaemonInstallActionContext as n,
  normalizeListenerAddress as o,
  buildDaemonServiceSnapshot as p,
  failIfNixDaemonInstallMode as r,
  parsePortFromArgs as s,
  createCliStatusTextStyles as t,
  renderRuntimeHints as u,
};
