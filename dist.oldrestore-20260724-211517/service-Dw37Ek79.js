import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  h as resolveFutureConfigActionBlock,
  m as formatFutureConfigActionBlock,
} from "./config-env-vars-CwdMUFhk.js";
import { u as readConfigFileSnapshot } from "./io-B3ne6NxF.js";
import {
  _ as uninstallLaunchAgent,
  a as installLaunchAgent,
  d as readLaunchAgentRuntime,
  g as stopLaunchAgent,
  h as stageLaunchAgent,
  m as restartLaunchAgent,
  o as isLaunchAgentLoaded,
  u as readLaunchAgentProgramArguments,
} from "./launchd-CNqS8gSo.js";
import "./config-BDv-QbJ6.js";
import {
  f as uninstallScheduledTask,
  i as readScheduledTaskRuntime,
  l as stageScheduledTask,
  n as isScheduledTaskInstalled,
  r as readScheduledTaskCommand,
  s as restartScheduledTask,
  t as installScheduledTask,
  u as stopScheduledTask,
} from "./schtasks-BnFuQtB2.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import {
  c as readSystemdServiceRuntime,
  d as stageSystemdService,
  f as stopSystemdService,
  i as isSystemdServiceEnabled,
  m as uninstallSystemdService,
  n as installSystemdService,
  s as readSystemdServiceExecStart,
  u as restartSystemdService,
} from "./systemd-BI3sgDKJ.js";
import { n as parseTcpPort, r as parseTcpPortFromArgs } from "./tcp-port-1cXcKObm.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
//#region src/daemon/future-config-guard.ts
/** Prevents daemon write actions when the config belongs to a newer OpenClaw. */
async function readFutureConfigActionBlock(action) {
  try {
    return resolveFutureConfigActionBlock({
      action,
      snapshot: await readConfigFileSnapshot(),
    });
  } catch {
    return null;
  }
}
async function assertFutureConfigActionAllowed(action) {
  const block = await readFutureConfigActionBlock(action);
  if (block) throw new Error(formatFutureConfigActionBlock(block));
}
//#endregion
//#region src/daemon/service.ts
/** Platform service registry and shared gateway service start/repair logic. */
function ignoreServiceWriteResult(write) {
  return async (args) => {
    await write(args);
  };
}
function mergeGatewayServiceEnv(baseEnv, command) {
  if (!command?.environment) return baseEnv;
  const merged = {
    ...baseEnv,
    ...command.environment,
  };
  for (const key of [
    "OPENCLAW_LAUNCHD_LABEL",
    "OPENCLAW_SYSTEMD_UNIT",
    "OPENCLAW_WINDOWS_TASK_NAME",
  ]) {
    const value = baseEnv[key]?.trim();
    if (value) merged[key] = value;
  }
  return merged;
}
const TEMP_PROGRAM_ROOTS = [os.tmpdir(), "/tmp", "/private/tmp", "/var/tmp"].map((entry) =>
  path.resolve(entry),
);
function pathIsSameOrChild(candidate, parent) {
  return candidate === parent || candidate.startsWith(`${parent}${path.sep}`);
}
function isTemporaryProgramPath(value) {
  if (!value || !path.isAbsolute(value)) return false;
  const resolved = path.resolve(value);
  return TEMP_PROGRAM_ROOTS.some((root) => pathIsSameOrChild(resolved, root));
}
function isMissingProgramPath(value) {
  if (!value || !path.isAbsolute(value)) return false;
  return !fs.existsSync(value);
}
function collectGatewayServiceStartRepairIssues(state, expectedPort) {
  const command = state.command;
  if (!state.loaded || !command) return [];
  const issues = [];
  const serviceVersion = command.environment?.OPENCLAW_SERVICE_VERSION?.trim();
  if (serviceVersion && serviceVersion !== VERSION)
    issues.push({
      code: "version-mismatch",
      message: `service was installed by OpenClaw ${serviceVersion}, current CLI is ${VERSION}`,
    });
  const servicePort =
    parseTcpPortFromArgs(command.programArguments) ??
    parseTcpPort(command.environment?.OPENCLAW_GATEWAY_PORT ?? "");
  if (expectedPort !== void 0 && servicePort !== null && servicePort !== expectedPort)
    issues.push({
      code: "port-mismatch",
      message: `service port ${servicePort} does not match current gateway config port ${expectedPort}`,
    });
  for (const candidate of command.programArguments.slice(0, 2)) {
    if (isTemporaryProgramPath(candidate)) {
      issues.push({
        code: "temporary-program",
        message: `service command points at a temporary path: ${candidate}`,
      });
      continue;
    }
    if (isMissingProgramPath(candidate))
      issues.push({
        code: "missing-program",
        message: `service command points at a missing path: ${candidate}`,
      });
  }
  return issues;
}
/** Reads the installed service and reports definition drift that must be repaired before launch. */
async function inspectGatewayServiceStartRepair(service, args, expectedPort) {
  const state = await readGatewayServiceState(service, args);
  return {
    state,
    issues: collectGatewayServiceStartRepairIssues(state, expectedPort),
  };
}
function formatGatewayServiceStartRepairIssues(issues) {
  return issues.map((issue) => issue.message).join("; ");
}
async function readGatewayServiceState(service, args = {}) {
  const baseEnv = args.env ?? process.env;
  const command = await service.readCommand(baseEnv).catch(() => null);
  const env = mergeGatewayServiceEnv(baseEnv, command);
  const [loaded, runtime] = await Promise.all([
    service
      .isLoaded({
        env,
        timeoutMs: args.timeoutMs,
      })
      .catch(() => false),
    service.readRuntime(env, { timeoutMs: args.timeoutMs }).catch(() => void 0),
  ]);
  return {
    installed: command !== null,
    loaded,
    running: runtime?.status === "running",
    env,
    command,
    runtime,
  };
}
async function startGatewayService(service, args, expectedPort) {
  const { state, issues: repairIssues } = await inspectGatewayServiceStartRepair(
    service,
    { env: args.env },
    expectedPort,
  );
  if (!state.loaded && !state.installed)
    return {
      outcome: "missing-install",
      state,
    };
  if (repairIssues.length > 0)
    return {
      outcome: "repair-required",
      state,
      issues: repairIssues,
    };
  try {
    const restartResult = await service.restart({
      ...args,
      env: state.env,
    });
    const nextState = await readGatewayServiceState(service, { env: state.env });
    return {
      outcome: restartResult.outcome === "scheduled" ? "scheduled" : "started",
      state: nextState,
    };
  } catch (err) {
    const nextState = await readGatewayServiceState(service, { env: state.env });
    if (!nextState.installed)
      return {
        outcome: "missing-install",
        state: nextState,
      };
    throw err;
  }
}
function describeGatewayServiceRestart(serviceNoun, result) {
  if (result.outcome === "scheduled")
    return {
      scheduled: true,
      daemonActionResult: "scheduled",
      message: `restart scheduled, ${normalizeLowercaseStringOrEmpty(serviceNoun)} will restart momentarily`,
      progressMessage: `${serviceNoun} service restart scheduled.`,
    };
  return {
    scheduled: false,
    daemonActionResult: "restarted",
    message: `${serviceNoun} service restarted.`,
    progressMessage: `${serviceNoun} service restarted.`,
  };
}
function createUnsupportedGatewayServiceError() {
  return /* @__PURE__ */ new Error(`Gateway service install not supported on ${process.platform}`);
}
async function rejectUnsupportedGatewayService() {
  throw createUnsupportedGatewayServiceError();
}
function createUnsupportedGatewayService() {
  return {
    label: "Gateway service",
    loadedText: "available",
    notLoadedText: "not installed",
    stage: rejectUnsupportedGatewayService,
    install: rejectUnsupportedGatewayService,
    uninstall: rejectUnsupportedGatewayService,
    stop: rejectUnsupportedGatewayService,
    restart: rejectUnsupportedGatewayService,
    isLoaded: rejectUnsupportedGatewayService,
    readCommand: async () => null,
    readRuntime: async () => ({
      status: "unknown",
      detail: createUnsupportedGatewayServiceError().message,
    }),
  };
}
const GATEWAY_SERVICE_REGISTRY = {
  darwin: {
    label: "LaunchAgent",
    loadedText: "loaded",
    notLoadedText: "not loaded",
    stage: ignoreServiceWriteResult(stageLaunchAgent),
    install: ignoreServiceWriteResult(installLaunchAgent),
    uninstall: uninstallLaunchAgent,
    stop: stopLaunchAgent,
    restart: restartLaunchAgent,
    isLoaded: isLaunchAgentLoaded,
    readCommand: readLaunchAgentProgramArguments,
    readRuntime: readLaunchAgentRuntime,
  },
  linux: {
    label: "systemd user",
    loadedText: "enabled",
    notLoadedText: "disabled",
    stage: ignoreServiceWriteResult(stageSystemdService),
    install: ignoreServiceWriteResult(installSystemdService),
    uninstall: uninstallSystemdService,
    stop: stopSystemdService,
    restart: restartSystemdService,
    isLoaded: isSystemdServiceEnabled,
    readCommand: readSystemdServiceExecStart,
    readRuntime: readSystemdServiceRuntime,
  },
  win32: {
    label: "Scheduled Task",
    loadedText: "registered",
    notLoadedText: "missing",
    stage: ignoreServiceWriteResult(stageScheduledTask),
    install: ignoreServiceWriteResult(installScheduledTask),
    uninstall: uninstallScheduledTask,
    stop: stopScheduledTask,
    restart: restartScheduledTask,
    isLoaded: isScheduledTaskInstalled,
    readCommand: readScheduledTaskCommand,
    readRuntime: readScheduledTaskRuntime,
  },
};
function withFutureConfigGuard(service) {
  return {
    ...service,
    stage: async (args) => {
      await assertFutureConfigActionAllowed("rewrite the gateway service");
      return await service.stage(args);
    },
    install: async (args) => {
      await assertFutureConfigActionAllowed("install or rewrite the gateway service");
      return await service.install(args);
    },
    uninstall: async (args) => {
      await assertFutureConfigActionAllowed("uninstall the gateway service");
      return await service.uninstall(args);
    },
    stop: async (args) => {
      await assertFutureConfigActionAllowed("stop the gateway service");
      return await service.stop(args);
    },
    restart: async (args) => {
      await assertFutureConfigActionAllowed("restart the gateway service");
      return await service.restart(args);
    },
  };
}
function isSupportedGatewayServicePlatform(platform) {
  return Object.hasOwn(GATEWAY_SERVICE_REGISTRY, platform);
}
function resolveGatewayService() {
  if (isSupportedGatewayServicePlatform(process.platform))
    return withFutureConfigGuard(GATEWAY_SERVICE_REGISTRY[process.platform]);
  return createUnsupportedGatewayService();
}
//#endregion
export {
  resolveGatewayService as a,
  readGatewayServiceState as i,
  formatGatewayServiceStartRepairIssues as n,
  startGatewayService as o,
  inspectGatewayServiceStartRepair as r,
  describeGatewayServiceRestart as t,
};
