import fs from "node:fs/promises";
import path from "node:path";
import { M as isBunRuntime, N as isNodeRuntime } from "./argv-zTv4_Dzq.js";
import { a as normalizeEnvVarKey } from "./host-env-security-pMY6K0Qy.js";
import { p as resolveLaunchAgentPlistPath } from "./launchd-CNqS8gSo.js";
import {
  c as normalizeServicePathEntry,
  f as getMinimalServicePathPartsFromEnv,
  l as SERVICE_PROXY_ENV_KEYS,
  n as isVersionManagedNodePath,
  o as resolveSystemNodePath,
  s as isNonMinimalServicePathEntry,
  t as isSystemNodePath,
} from "./runtime-paths-DxDI3o5V.js";
import {
  t as POSIX_SHELL_WRAPPERS,
  y as resolveInlineCommandMatch,
} from "./shell-wrapper-resolution-DlXABXcG.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import {
  g as sortUniqueStrings,
  l as normalizeStringEntries,
} from "./string-normalization-CRyoFBPt.js";
import {
  S as isEnvironmentFileOnlySource,
  l as resolveSystemdUserUnitPath,
  v as collectInlineManagedServiceEnvKeys,
  x as hasInlineEnvironmentSource,
} from "./systemd-BI3sgDKJ.js";
import { n as parseTcpPort } from "./tcp-port-1cXcKObm.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
//#region src/daemon/service-audit.ts
/** Audits installed daemon service definitions for drift and repair candidates. */
const SERVICE_AUDIT_CODES = {
  gatewayCommandMissing: "gateway-command-missing",
  gatewayEntrypointMismatch: "gateway-entrypoint-mismatch",
  gatewayPathMissing: "gateway-path-missing",
  gatewayPathMissingDirs: "gateway-path-missing-dirs",
  gatewayPathNonMinimal: "gateway-path-nonminimal",
  gatewayTokenEmbedded: "gateway-token-embedded",
  gatewayManagedEnvEmbedded: "gateway-managed-env-embedded",
  gatewayPortMismatch: "gateway-port-mismatch",
  gatewayProxyEnvEmbedded: "gateway-proxy-env-embedded",
  gatewayTokenMismatch: "gateway-token-mismatch",
  gatewayRuntimeBun: "gateway-runtime-bun",
  gatewayRuntimeNodeVersionManager: "gateway-runtime-node-version-manager",
  gatewayRuntimeNodeSystemMissing: "gateway-runtime-node-system-missing",
  gatewayTokenDrift: "gateway-token-drift",
  gatewayServiceVersionMismatch: "gateway-service-version-mismatch",
  launchdKeepAlive: "launchd-keep-alive",
  launchdRunAtLoad: "launchd-run-at-load",
  systemdAfterNetworkOnline: "systemd-after-network-online",
  systemdRestartSec: "systemd-restart-sec",
  systemdWantsNetworkOnline: "systemd-wants-network-online",
  systemdKillModeProcessOrNone: "systemd-kill-mode-process-or-none",
};
/** Returns whether audit issues require migrating a daemon to a stable Node runtime. */
function needsNodeRuntimeMigration(issues) {
  return issues.some(
    (issue) =>
      issue.code === SERVICE_AUDIT_CODES.gatewayRuntimeBun ||
      issue.code === SERVICE_AUDIT_CODES.gatewayRuntimeNodeVersionManager,
  );
}
function hasGatewaySubcommand(programArguments) {
  return Boolean(programArguments?.some((arg) => arg === "gateway"));
}
const POSIX_SERVICE_INLINE_COMMAND_FLAGS = /* @__PURE__ */ new Set(["-c"]);
const POSIX_SERVICE_SHELL_WRAPPERS = POSIX_SHELL_WRAPPERS;
function isOpaquePosixShellInlineCommand(programArguments) {
  const executable = programArguments[0]?.trim();
  const shellName = executable ? path.posix.basename(executable).toLowerCase() : "";
  if (!POSIX_SERVICE_SHELL_WRAPPERS.has(shellName)) return false;
  return (
    resolveInlineCommandMatch(programArguments, POSIX_SERVICE_INLINE_COMMAND_FLAGS, {
      allowCombinedC: true,
    }).command !== null
  );
}
function parseSystemdUnit(content) {
  const after = /* @__PURE__ */ new Set();
  const wants = /* @__PURE__ */ new Set();
  let restartSec;
  let killMode;
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith("#") || line.startsWith(";")) continue;
    if (line.startsWith("[")) continue;
    const idx = line.indexOf("=");
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (!value) continue;
    if (key === "After") {
      for (const entry of value.split(/\s+/)) if (entry) after.add(entry);
    } else if (key === "Wants") {
      for (const entry of value.split(/\s+/)) if (entry) wants.add(entry);
    } else if (key === "RestartSec") restartSec = value;
    else if (key === "KillMode") killMode = value;
  }
  return {
    after,
    wants,
    restartSec,
    killMode,
  };
}
function isRestartSecPreferred(value) {
  if (!value) return false;
  const parsed = parseSystemdRestartSecSeconds(value);
  if (parsed === void 0) return false;
  return Math.abs(parsed - 5) < 0.01;
}
function parseSystemdRestartSecSeconds(value) {
  const match = value
    .trim()
    .match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+))(?:\s*(?:s|sec|secs|second|seconds))?$/iu);
  if (!match) return;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : void 0;
}
async function auditSystemdUnit(env, issues) {
  const unitPath = resolveSystemdUserUnitPath(env);
  let content;
  try {
    content = await fs.readFile(unitPath, "utf8");
  } catch {
    return;
  }
  const parsed = parseSystemdUnit(content);
  if (!parsed.after.has("network-online.target"))
    issues.push({
      code: SERVICE_AUDIT_CODES.systemdAfterNetworkOnline,
      message: "Missing systemd After=network-online.target",
      detail: unitPath,
      level: "recommended",
    });
  if (!parsed.wants.has("network-online.target"))
    issues.push({
      code: SERVICE_AUDIT_CODES.systemdWantsNetworkOnline,
      message: "Missing systemd Wants=network-online.target",
      detail: unitPath,
      level: "recommended",
    });
  if (!isRestartSecPreferred(parsed.restartSec))
    issues.push({
      code: SERVICE_AUDIT_CODES.systemdRestartSec,
      message: "RestartSec does not match the recommended 5s",
      detail: unitPath,
      level: "recommended",
    });
  const killMode = normalizeLowercaseStringOrEmpty(parsed.killMode);
  if (killMode === "process" || killMode === "none")
    issues.push({
      code: SERVICE_AUDIT_CODES.systemdKillModeProcessOrNone,
      message:
        "KillMode is process/none; service child processes can survive gateway stops and restarts.",
      detail: `${unitPath}: ${killMode}`,
      level: "recommended",
    });
}
async function auditLaunchdPlist(env, issues) {
  const plistPath = resolveLaunchAgentPlistPath(env);
  let content;
  try {
    content = await fs.readFile(plistPath, "utf8");
  } catch {
    return;
  }
  const hasRunAtLoad = /<key>RunAtLoad<\/key>\s*<true\s*\/>/i.test(content);
  const hasKeepAlive = /<key>KeepAlive<\/key>\s*<true\s*\/>/i.test(content);
  if (!hasRunAtLoad)
    issues.push({
      code: SERVICE_AUDIT_CODES.launchdRunAtLoad,
      message: "LaunchAgent is missing RunAtLoad=true",
      detail: plistPath,
      level: "recommended",
    });
  if (!hasKeepAlive)
    issues.push({
      code: SERVICE_AUDIT_CODES.launchdKeepAlive,
      message: "LaunchAgent is missing KeepAlive=true",
      detail: plistPath,
      level: "recommended",
    });
}
function auditGatewayCommand(programArguments, issues) {
  if (!programArguments || programArguments.length === 0) return;
  if (!hasGatewaySubcommand(programArguments) && !isOpaquePosixShellInlineCommand(programArguments))
    issues.push({
      code: SERVICE_AUDIT_CODES.gatewayCommandMissing,
      message: "Service command does not include the gateway subcommand",
      level: "aggressive",
    });
}
function parseGatewayPortArg(value) {
  const raw = value?.trim() ?? "";
  const port = parseTcpPort(raw);
  if (port !== null)
    return {
      kind: "valid",
      port,
    };
  return raw
    ? {
        kind: "invalid",
        raw,
      }
    : { kind: "missing" };
}
function readGatewayServiceCommandPortState(programArguments) {
  if (!programArguments || programArguments.length === 0) return { kind: "missing" };
  for (const [index, arg] of programArguments.entries()) {
    if (arg === "--port") return parseGatewayPortArg(programArguments[index + 1]);
    if (arg.startsWith("--port=")) return parseGatewayPortArg(arg.slice(7));
  }
  return { kind: "missing" };
}
function auditGatewayServicePort(params) {
  if (
    typeof params.expectedPort !== "number" ||
    !Number.isSafeInteger(params.expectedPort) ||
    params.expectedPort <= 0 ||
    params.expectedPort > 65535
  )
    return;
  const servicePort = readGatewayServiceCommandPortState(params.programArguments);
  if (servicePort.kind === "missing") return;
  if (servicePort.kind === "valid" && servicePort.port === params.expectedPort) return;
  const detail =
    servicePort.kind === "valid"
      ? `${servicePort.port} -> ${params.expectedPort}`
      : `${servicePort.raw} -> ${params.expectedPort}`;
  params.issues.push({
    code: SERVICE_AUDIT_CODES.gatewayPortMismatch,
    message: "Gateway service port does not match current gateway config.",
    detail,
    level: "recommended",
  });
}
function auditGatewayToken(command, issues, expectedGatewayToken) {
  const serviceToken = readEmbeddedGatewayToken(command);
  if (!serviceToken) return;
  issues.push({
    code: SERVICE_AUDIT_CODES.gatewayTokenEmbedded,
    message: "Gateway service embeds OPENCLAW_GATEWAY_TOKEN and should be reinstalled.",
    detail: "Run `openclaw gateway install --force` to remove embedded service token.",
    level: "recommended",
  });
  const expectedToken = normalizeOptionalString(expectedGatewayToken);
  if (!expectedToken || serviceToken === expectedToken) return;
  issues.push({
    code: SERVICE_AUDIT_CODES.gatewayTokenMismatch,
    message:
      "Gateway service OPENCLAW_GATEWAY_TOKEN does not match gateway.auth.token in openclaw.json",
    detail: "service token is stale",
    level: "recommended",
  });
}
function auditManagedServiceEnvironment(command, issues, expectedManagedServiceEnvKeys) {
  const inlineKeys = collectInlineManagedServiceEnvKeys(command, expectedManagedServiceEnvKeys);
  if (inlineKeys.length === 0) return;
  issues.push({
    code: SERVICE_AUDIT_CODES.gatewayManagedEnvEmbedded,
    message: "Gateway service embeds managed environment values that should load at runtime.",
    detail: `inline keys: ${inlineKeys.join(", ")}`,
    level: "recommended",
  });
}
function normalizeServiceEnvKey(key) {
  return normalizeEnvVarKey(key, { portable: true })?.toUpperCase() ?? null;
}
function readEnvironmentValueSource(command, normalizedKey) {
  for (const [rawKey, source] of Object.entries(command?.environmentValueSources ?? {}))
    if (normalizeServiceEnvKey(rawKey) === normalizedKey) return source;
}
const SERVICE_PROXY_ENV_KEY_SET = new Set(
  SERVICE_PROXY_ENV_KEYS.flatMap((key) => {
    const normalized = normalizeServiceEnvKey(key);
    return normalized ? [normalized] : [];
  }),
);
function collectInlineProxyEnvKeys(command) {
  if (!command?.environment) return [];
  const inlineKeys = [];
  for (const [rawKey, value] of Object.entries(command.environment)) {
    if (typeof value !== "string" || !value.trim()) continue;
    const normalized = normalizeServiceEnvKey(rawKey);
    if (!normalized || !SERVICE_PROXY_ENV_KEY_SET.has(normalized)) continue;
    if (!hasInlineEnvironmentSource(readEnvironmentValueSource(command, normalized))) continue;
    inlineKeys.push(normalized);
  }
  return sortUniqueStrings(inlineKeys);
}
function auditProxyServiceEnvironment(command, issues) {
  const inlineKeys = collectInlineProxyEnvKeys(command);
  if (inlineKeys.length === 0) return;
  issues.push({
    code: SERVICE_AUDIT_CODES.gatewayProxyEnvEmbedded,
    message: "Gateway service embeds proxy environment values that should not be persisted.",
    detail: `inline keys: ${inlineKeys.join(", ")}`,
    level: "recommended",
  });
}
function readEmbeddedGatewayToken(command) {
  if (!command) return;
  if (isEnvironmentFileOnlySource(command.environmentValueSources?.OPENCLAW_GATEWAY_TOKEN)) return;
  return normalizeOptionalString(command.environment?.OPENCLAW_GATEWAY_TOKEN);
}
function getPathModule(platform) {
  return platform === "win32" ? path.win32 : path.posix;
}
function getEquivalentMinimalPathEntries(entry, platform, normalizedExpected) {
  if (platform !== "linux") return [];
  const equivalent = entry.endsWith("/aliases/default/bin")
    ? `${entry.slice(0, -20)}/current/bin`
    : entry.endsWith("/current/bin")
      ? `${entry.slice(0, -12)}/aliases/default/bin`
      : void 0;
  if (!equivalent) return [];
  const normalizedEquivalent = normalizeServicePathEntry(equivalent, platform);
  return normalizedExpected.has(normalizedEquivalent) ? [equivalent] : [];
}
function auditGatewayServicePath(command, issues, env, platform, expectedServicePath) {
  if (platform === "win32") return;
  const servicePath = command?.environment?.PATH;
  if (!servicePath) {
    issues.push({
      code: SERVICE_AUDIT_CODES.gatewayPathMissing,
      message: "Gateway service PATH is not set; the daemon should use a minimal PATH.",
      level: "recommended",
    });
    return;
  }
  const expected = expectedServicePath?.trim()
    ? normalizeStringEntries(expectedServicePath.split(getPathModule(platform).delimiter))
    : getMinimalServicePathPartsFromEnv({
        platform,
        env,
        includeMissingUserBinDefaults: false,
      });
  const parts = normalizeStringEntries(servicePath.split(getPathModule(platform).delimiter));
  const normalizedParts = new Set(parts.map((entry) => normalizeServicePathEntry(entry, platform)));
  const normalizedExpected = new Set(
    expected.map((entry) => normalizeServicePathEntry(entry, platform)),
  );
  const missing = expected.filter((entry) => {
    const normalized = normalizeServicePathEntry(entry, platform);
    if (normalizedParts.has(normalized)) return false;
    return !getEquivalentMinimalPathEntries(entry, platform, normalizedExpected).some(
      (equivalent) => normalizedParts.has(normalizeServicePathEntry(equivalent, platform)),
    );
  });
  if (missing.length > 0)
    issues.push({
      code: SERVICE_AUDIT_CODES.gatewayPathMissingDirs,
      message: `Gateway service PATH missing required dirs: ${missing.join(", ")}`,
      level: "recommended",
    });
  const nonMinimal = parts.filter((entry) => {
    const normalized = normalizeServicePathEntry(entry, platform);
    if (normalizedExpected.has(normalized)) return false;
    return isNonMinimalServicePathEntry(normalized, platform);
  });
  if (nonMinimal.length > 0)
    issues.push({
      code: SERVICE_AUDIT_CODES.gatewayPathNonMinimal,
      message:
        "Gateway service PATH includes version managers or package managers; recommend a minimal PATH.",
      detail: nonMinimal.join(", "),
      level: "recommended",
    });
}
async function auditGatewayRuntime(env, command, issues, platform) {
  const execPath = command?.programArguments?.[0];
  if (!execPath) return;
  if (isBunRuntime(execPath)) {
    issues.push({
      code: SERVICE_AUDIT_CODES.gatewayRuntimeBun,
      message: "Gateway service uses Bun; OpenClaw runtime state requires node:sqlite.",
      detail: execPath,
      level: "recommended",
    });
    return;
  }
  if (!isNodeRuntime(execPath)) return;
  if (isVersionManagedNodePath(execPath, platform)) {
    issues.push({
      code: SERVICE_AUDIT_CODES.gatewayRuntimeNodeVersionManager,
      message: "Gateway service uses Node from a version manager; it can break after upgrades.",
      detail: execPath,
      level: "recommended",
    });
    if (!isSystemNodePath(execPath, env, platform)) {
      if (!(await resolveSystemNodePath(env, platform)))
        issues.push({
          code: SERVICE_AUDIT_CODES.gatewayRuntimeNodeSystemMissing,
          message:
            "System Node 22 LTS (22.22.3+) or Node 24.15+ not found; install it before migrating away from version managers.",
          level: "recommended",
        });
    }
  }
}
/**
 * Check if the service's embedded token differs from the config file token.
 * Returns an issue if drift is detected (service will use old token after restart).
 */
function checkTokenDrift(params) {
  const serviceToken = normalizeOptionalString(params.serviceToken);
  const configToken = normalizeOptionalString(params.configToken);
  if (!serviceToken) return null;
  if (configToken && serviceToken !== configToken)
    return {
      code: SERVICE_AUDIT_CODES.gatewayTokenDrift,
      message:
        "Config token differs from service token. The daemon will use the old token after restart.",
      detail: "Run `openclaw gateway install --force` to sync the token.",
      level: "recommended",
    };
  return null;
}
function auditGatewayServiceVersion(command, issues) {
  const serviceVersion = command?.environment?.OPENCLAW_SERVICE_VERSION?.trim();
  if (!serviceVersion || serviceVersion === VERSION) return;
  issues.push({
    code: SERVICE_AUDIT_CODES.gatewayServiceVersionMismatch,
    message: `Gateway service was installed by OpenClaw ${serviceVersion}; current CLI is ${VERSION}.`,
    detail: command?.sourcePath,
    level: "recommended",
  });
}
async function auditGatewayServiceConfig(params) {
  const issues = [];
  const platform = params.platform ?? process.platform;
  auditGatewayCommand(params.command?.programArguments, issues);
  auditGatewayServicePort({
    programArguments: params.command?.programArguments,
    issues,
    expectedPort: params.expectedPort,
  });
  auditManagedServiceEnvironment(params.command, issues, params.expectedManagedServiceEnvKeys);
  auditProxyServiceEnvironment(params.command, issues);
  auditGatewayToken(params.command, issues, params.expectedGatewayToken);
  auditGatewayServiceVersion(params.command, issues);
  auditGatewayServicePath(params.command, issues, params.env, platform, params.expectedServicePath);
  await auditGatewayRuntime(params.env, params.command, issues, platform);
  if (platform === "linux") await auditSystemdUnit(params.env, issues);
  else if (platform === "darwin") await auditLaunchdPlist(params.env, issues);
  return issues.length === 0
    ? {
        ok: true,
        issues,
      }
    : {
        ok: false,
        issues,
      };
}
//#endregion
export {
  readEmbeddedGatewayToken as a,
  needsNodeRuntimeMigration as i,
  auditGatewayServiceConfig as n,
  checkTokenDrift as r,
  SERVICE_AUDIT_CODES as t,
};
