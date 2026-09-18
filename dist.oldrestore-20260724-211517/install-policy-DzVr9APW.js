import fs from "node:fs/promises";
import path from "node:path";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import "./utils-DtcDeqWS.js";
import { i as isPathInside } from "./path-DILYn_gk.js";
import { a as inspectPathPermissions, d as safeStat } from "./permissions-sY2quqHz.js";
import { i as normalizePositiveTimerMs, r as normalizePositiveInt } from "./shared-CrrsbqCi.js";
import "./audit-fs-CBe_wA_B.js";
import "./scan-paths-Bve2UhXh.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { s as resolveRuntimeServiceVersion } from "./version-CeFj_iGk.js";
//#region src/security/install-policy.ts
const DEFAULT_TIMEOUT_MS = 1e4;
const DEFAULT_MAX_OUTPUT_BYTES = 1024 * 1024;
const DEFAULT_MAX_REQUEST_BYTES = 256 * 1024;
const MAX_REASON_CHARS = 1e3;
const MAX_FINDINGS = 100;
const MAX_FINDING_TEXT_CHARS = 1e3;
const WINDOWS_ABS_PATH_PATTERN = /^[A-Za-z]:[\\/]/;
const WINDOWS_UNC_PATH_PATTERN = /^\\\\[^\\]+\\[^\\]+/;
const POLICY_INTERPRETER_NAMES = /* @__PURE__ */ new Set([
  "bash",
  "bun",
  "deno",
  "env",
  "fish",
  "node",
  "perl",
  "powershell",
  "pwsh",
  "python",
  "python3",
  "ruby",
  "sh",
  "zsh",
]);
const POLICY_SCRIPT_ARG_PATTERN = /\.(?:bash|cjs|cts|js|mjs|mts|pl|ps1|py|rb|sh|ts|zsh)$/i;
function isAbsolutePathname(value) {
  if (path.isAbsolute(value)) return true;
  return (
    process.platform === "win32" &&
    (WINDOWS_ABS_PATH_PATTERN.test(value) || WINDOWS_UNC_PATH_PATTERN.test(value))
  );
}
function executableName(commandPath) {
  return path
    .basename(commandPath)
    .replace(/\.exe$/i, "")
    .toLowerCase();
}
function isPolicyScriptArg(value) {
  return (
    isAbsolutePathname(value) ||
    value.startsWith(".") ||
    value.includes("/") ||
    value.includes("\\") ||
    POLICY_SCRIPT_ARG_PATTERN.test(value)
  );
}
function resolvePolicyScriptArg(params) {
  const interpreterName = executableName(params.command);
  const startIndex = 0;
  if (interpreterName === "env")
    return {
      kind: "unsupported",
      message:
        "security.installPolicy.exec.command must not use env; configure the policy executable directly.",
    };
  if (!POLICY_INTERPRETER_NAMES.has(interpreterName) || interpreterName === "env") return;
  const scripts = [];
  for (let index = startIndex; index < params.args.length; index += 1) {
    const arg = params.args[index];
    if (!arg) continue;
    if (arg.startsWith("-")) {
      const equalsIndex = arg.indexOf("=");
      if (equalsIndex > 0) {
        const optionValue = arg.slice(equalsIndex + 1);
        if (isPolicyScriptArg(optionValue))
          scripts.push({
            index,
            path: optionValue,
          });
      }
      continue;
    }
    if (isPolicyScriptArg(arg))
      scripts.push({
        index,
        path: arg,
      });
  }
  return scripts.length > 0
    ? {
        kind: "scripts",
        scripts,
      }
    : void 0;
}
async function readFileStatOrThrow(pathname, label) {
  const stat = await safeStat(pathname);
  if (!stat.ok) throw new Error(`${label} is not readable: ${pathname}`);
  if (stat.isDir) throw new Error(`${label} must be a file: ${pathname}`);
  return stat;
}
function collectPathAncestorDirs(targetPath) {
  const dirs = [];
  let current = path.resolve(path.dirname(targetPath));
  while (true) {
    dirs.push(current);
    const parent = path.dirname(current);
    if (parent === current) return dirs;
    current = parent;
  }
}
async function assertSecureCommandAncestorDirs(params) {
  const currentUid = typeof process.getuid === "function" ? process.getuid() : void 0;
  for (const dir of collectPathAncestorDirs(params.targetPath)) {
    const perms = await inspectPathPermissions(dir);
    if (!perms.ok)
      throw new Error(`${params.label} parent directory permissions could not be verified: ${dir}`);
    let sticky = false;
    if (process.platform !== "win32" && (perms.worldWritable || perms.groupWritable))
      try {
        sticky = ((await fs.stat(dir)).mode & 512) !== 0;
      } catch {
        sticky = false;
      }
    if ((perms.worldWritable || perms.groupWritable) && !sticky)
      throw new Error(`${params.label} parent directory permissions are too open: ${dir}`);
    if (process.platform !== "win32" && currentUid !== void 0) {
      let stat;
      try {
        stat = await fs.stat(dir);
      } catch {
        throw new Error(`${params.label} parent directory ownership could not be verified: ${dir}`);
      }
      if (stat.uid !== 0 && stat.uid !== currentUid)
        throw new Error(`${params.label} parent directory owner is not trusted: ${dir}`);
    }
    if (process.platform === "win32" && perms.source === "unknown")
      throw new Error(
        `${params.label} parent directory ACL verification unavailable on Windows for ${dir}. Set allowInsecurePath=true for this policy to bypass this check when the path is trusted.`,
      );
  }
}
async function assertSecureCommandPath(params) {
  if (!isAbsolutePathname(params.targetPath))
    throw new Error(`${params.label} must be an absolute path.`);
  let effectivePath = params.targetPath;
  let stat = await readFileStatOrThrow(effectivePath, params.label);
  if (stat.isSymlink) {
    if (!params.allowSymlinkPath)
      throw new Error(`${params.label} must not be a symlink: ${effectivePath}`);
    try {
      effectivePath = await fs.realpath(effectivePath);
    } catch {
      throw new Error(`${params.label} symlink target is not readable: ${params.targetPath}`);
    }
    if (!isAbsolutePathname(effectivePath))
      throw new Error(`${params.label} resolved symlink target must be an absolute path.`);
    stat = await readFileStatOrThrow(effectivePath, params.label);
    if (stat.isSymlink)
      throw new Error(`${params.label} symlink target must not be a symlink: ${effectivePath}`);
  }
  if (params.trustedDirs && params.trustedDirs.length > 0) {
    if (
      !params.trustedDirs
        .map((entry) => resolveUserPath(entry))
        .some((dir) => isPathInside(dir, effectivePath))
    )
      throw new Error(`${params.label} is outside trustedDirs: ${effectivePath}`);
  }
  if (params.allowInsecurePath) return effectivePath;
  const perms = await inspectPathPermissions(effectivePath);
  if (!perms.ok)
    throw new Error(`${params.label} permissions could not be verified: ${effectivePath}`);
  if (perms.worldWritable || perms.groupWritable)
    throw new Error(`${params.label} permissions are too open: ${effectivePath}`);
  await assertSecureCommandAncestorDirs({
    targetPath: effectivePath,
    label: params.label,
  });
  if (process.platform === "win32" && perms.source === "unknown")
    throw new Error(
      `${params.label} ACL verification unavailable on Windows for ${effectivePath}. Set allowInsecurePath=true for this policy to bypass this check when the path is trusted.`,
    );
  if (process.platform !== "win32" && typeof process.getuid === "function" && stat.uid != null) {
    const uid = process.getuid();
    if (stat.uid !== uid && stat.uid !== 0)
      throw new Error(
        `${params.label} must be owned by the current user (uid=${uid}) or root: ${effectivePath}`,
      );
  }
  return effectivePath;
}
async function assertSecurePolicyScriptArg(params) {
  const scriptArg = resolvePolicyScriptArg({
    command: params.command,
    args: params.args,
  });
  if (!scriptArg) return;
  if (scriptArg.kind === "unsupported") throw new Error(scriptArg.message);
  for (const script of scriptArg.scripts)
    await assertSecureCommandPath({
      targetPath: script.path,
      label: `security.installPolicy.exec.args[${script.index}]`,
      trustedDirs: params.trustedDirs,
      allowInsecurePath: params.allowInsecurePath,
      allowSymlinkPath: false,
    });
}
function truncateText(value, maxChars) {
  return value.length <= maxChars ? value : `${truncateUtf16Safe(value, maxChars)}...`;
}
function createPolicyChildEnv(sourceEnv) {
  return {};
}
function readPassEnvValue(env, key) {
  const exact = env[key];
  if (exact !== void 0 || process.platform !== "win32") return exact;
  const lowerKey = key.toLowerCase();
  const matchedKey = Object.keys(env).find((candidate) => candidate.toLowerCase() === lowerKey);
  return matchedKey ? env[matchedKey] : void 0;
}
function blockedByFailure(message) {
  return {
    blocked: {
      code: "security_scan_failed",
      reason: `install policy failed closed: ${truncateText(message, MAX_REASON_CHARS)}`,
    },
  };
}
function blockedByPolicy(reason, findings) {
  return {
    blocked: {
      code: "security_scan_blocked",
      reason: `blocked by install policy: ${truncateText(reason, MAX_REASON_CHARS)}`,
    },
    ...(findings && findings.length > 0 ? { findings } : {}),
  };
}
function isTargetEnabled(params) {
  const targets = params.policy.targets;
  if (!targets || targets.length === 0) return true;
  return targets.includes(params.targetType);
}
function resolvePolicy(config, targetType) {
  const policy = config?.security?.installPolicy;
  if (!policy || policy.enabled !== true) return { kind: "disabled" };
  if (
    !isTargetEnabled({
      policy,
      targetType,
    })
  )
    return { kind: "disabled" };
  if (!policy.exec)
    return {
      kind: "failure",
      result: blockedByFailure(
        "security.installPolicy is enabled but security.installPolicy.exec is not configured",
      ),
    };
  return {
    kind: "configured",
    exec: policy.exec,
  };
}
function resolveConfiguredTargets(policy) {
  const targets = policy.targets;
  return targets && targets.length > 0 ? [...new Set(targets)] : ["skill", "plugin"];
}
async function validateInstallPolicyStatic(config) {
  const policy = config?.security?.installPolicy;
  if (!policy || policy.enabled !== true)
    return {
      enabled: false,
      targets: [],
      issues: [],
    };
  const targets = resolveConfiguredTargets(policy);
  const issues = [];
  if (!policy.exec) {
    issues.push({
      severity: "error",
      message:
        "security.installPolicy is enabled but security.installPolicy.exec is not configured.",
    });
    return {
      enabled: true,
      targets,
      issues,
    };
  }
  if (!isAbsolutePathname(policy.exec.command)) {
    issues.push({
      severity: "error",
      message: "security.installPolicy.exec.command must be an absolute path.",
    });
    return {
      enabled: true,
      targets,
      issues,
    };
  }
  try {
    await assertSecureCommandPath({
      targetPath: policy.exec.command,
      label: "security.installPolicy.exec.command",
      trustedDirs: policy.exec.trustedDirs,
      allowInsecurePath: policy.exec.allowInsecurePath,
      allowSymlinkPath: policy.exec.allowSymlinkCommand,
    });
  } catch (err) {
    issues.push({
      severity: "error",
      message: formatErrorMessage(err),
    });
  }
  try {
    await assertSecurePolicyScriptArg({
      command: policy.exec.command,
      args: policy.exec.args ?? [],
      trustedDirs: policy.exec.trustedDirs,
      allowInsecurePath: policy.exec.allowInsecurePath,
      allowSymlinkPath: policy.exec.allowSymlinkCommand,
    });
  } catch (err) {
    issues.push({
      severity: "error",
      message: formatErrorMessage(err),
    });
  }
  return {
    enabled: true,
    targets,
    issues,
  };
}
function normalizeFinding(value) {
  if (typeof value !== "object" || value === null) return null;
  const record = value;
  const ruleId = typeof record.ruleId === "string" ? record.ruleId.trim() : "";
  const severity = record.severity;
  const file = typeof record.file === "string" ? record.file.trim() : "";
  const lineNumber =
    typeof record.line === "number" && Number.isFinite(record.line)
      ? Math.max(1, Math.floor(record.line))
      : void 0;
  const message = typeof record.message === "string" ? record.message.trim() : "";
  if (
    !ruleId ||
    !message ||
    (severity !== "info" && severity !== "warn" && severity !== "critical")
  )
    return null;
  const evidence = typeof record.evidence === "string" ? record.evidence.trim() : "";
  return {
    ruleId: truncateText(ruleId, MAX_FINDING_TEXT_CHARS),
    severity,
    message: truncateText(message, MAX_FINDING_TEXT_CHARS),
    ...(file ? { file: truncateText(file, MAX_FINDING_TEXT_CHARS) } : {}),
    ...(lineNumber ? { line: lineNumber } : {}),
    ...(evidence ? { evidence: truncateText(evidence, MAX_FINDING_TEXT_CHARS) } : {}),
  };
}
function parsePolicyResponse(stdout) {
  const trimmed = stdout.trim();
  if (!trimmed) return blockedByFailure("policy command returned empty stdout");
  let parsed;
  try {
    parsed = JSON.parse(trimmed);
  } catch (err) {
    return blockedByFailure(`policy command returned invalid JSON (${formatErrorMessage(err)})`);
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed))
    return blockedByFailure("policy response must be a JSON object");
  const record = parsed;
  if (record.protocolVersion !== 1)
    return blockedByFailure("policy response protocolVersion must be 1");
  const decision = record.decision;
  if (decision !== "allow" && decision !== "block")
    return blockedByFailure('policy response decision must be "allow" or "block"');
  const normalizedFindings = Array.isArray(record.findings)
    ? record.findings.slice(0, MAX_FINDINGS).map(normalizeFinding).filter(Boolean)
    : [];
  if (decision === "allow")
    return normalizedFindings.length > 0 ? { findings: normalizedFindings } : {};
  const reason = typeof record.reason === "string" ? record.reason.trim() : "";
  if (!reason)
    return blockedByFailure('policy response decision "block" requires a non-empty reason');
  return blockedByPolicy(reason, normalizedFindings);
}
async function runInstallPolicy(params) {
  const decisionContext = formatDecisionContext(params.request);
  const logBlocked = (result) => {
    if (result.blocked)
      params.logger?.warn?.(`Install policy ${decisionContext}: ${result.blocked.reason}`);
    return result;
  };
  const failClosed = (message) => logBlocked(blockedByFailure(message));
  let config = params.config;
  if (!config)
    try {
      const { getRuntimeConfig } = await import("./io-CThf_xQw.js");
      config = getRuntimeConfig({ skipPluginValidation: true });
    } catch (err) {
      return failClosed(`could not load OpenClaw config (${formatErrorMessage(err)})`);
    }
  const policy = resolvePolicy(config, params.request.targetType);
  if (policy.kind === "disabled") return;
  if (policy.kind === "failure") return logBlocked(policy.result);
  const input = JSON.stringify({
    protocolVersion: 1,
    openclawVersion: resolveRuntimeServiceVersion(params.env ?? process.env),
    ...params.request,
  });
  if (Buffer.byteLength(input, "utf8") > DEFAULT_MAX_REQUEST_BYTES)
    return failClosed(`policy request exceeded maxInputBytes (${DEFAULT_MAX_REQUEST_BYTES})`);
  const commandPath = policy.exec.command;
  if (!isAbsolutePathname(commandPath))
    return failClosed("security.installPolicy.exec.command must be an absolute path.");
  let secureCommandPath;
  try {
    secureCommandPath = await assertSecureCommandPath({
      targetPath: commandPath,
      label: "security.installPolicy.exec.command",
      trustedDirs: policy.exec.trustedDirs,
      allowInsecurePath: policy.exec.allowInsecurePath,
      allowSymlinkPath: policy.exec.allowSymlinkCommand,
    });
  } catch (err) {
    return failClosed(formatErrorMessage(err));
  }
  try {
    await assertSecurePolicyScriptArg({
      command: secureCommandPath,
      args: policy.exec.args ?? [],
      trustedDirs: policy.exec.trustedDirs,
      allowInsecurePath: policy.exec.allowInsecurePath,
      allowSymlinkPath: policy.exec.allowSymlinkCommand,
    });
  } catch (err) {
    return failClosed(formatErrorMessage(err));
  }
  const env = params.env ?? process.env;
  const childEnv = createPolicyChildEnv(env);
  for (const key of policy.exec.passEnv ?? []) {
    const value = readPassEnvValue(env, key);
    if (value !== void 0) childEnv[key] = value;
  }
  for (const [key, value] of Object.entries(policy.exec.env ?? {})) childEnv[key] = value;
  const timeoutMs = normalizePositiveTimerMs(policy.exec.timeoutMs, DEFAULT_TIMEOUT_MS);
  const noOutputTimeoutMs = normalizePositiveTimerMs(policy.exec.noOutputTimeoutMs, timeoutMs);
  const maxOutputBytes = normalizePositiveInt(policy.exec.maxOutputBytes, DEFAULT_MAX_OUTPUT_BYTES);
  const cwd = path.dirname(secureCommandPath);
  let result;
  try {
    result = await runCommandWithTimeout([secureCommandPath, ...(policy.exec.args ?? [])], {
      baseEnv: {},
      cwd,
      env: childEnv,
      input,
      killProcessTree: true,
      maxCombinedOutputBytes: maxOutputBytes,
      maxOutputBytes,
      noOutputTimeoutMs,
      outputCapture: "head",
      terminateOnOutputLimit: true,
      timeoutMs,
    });
  } catch (err) {
    return failClosed(formatErrorMessage(err));
  }
  if (result.termination === "timeout")
    return failClosed(`policy command timed out after ${timeoutMs}ms`);
  if (result.termination === "no-output-timeout")
    return failClosed(`policy command produced no output for ${noOutputTimeoutMs}ms`);
  if (result.outputLimitExceeded)
    return failClosed(`output exceeded maxOutputBytes (${maxOutputBytes})`);
  if (result.code !== 0)
    return failClosed(`policy command exited with code ${String(result.code)}`);
  const parsed = parsePolicyResponse(result.stdout);
  if (parsed.blocked) return logBlocked(parsed);
  params.logger?.debug?.(`Install policy ${decisionContext}: allowed`);
  return parsed;
}
function formatDecisionContext(request) {
  const source = request.source ? ` source=${request.source.kind}/${request.source.authority}` : "";
  const origin = typeof request.origin.type === "string" ? request.origin.type : "unknown";
  return [
    `target=${request.targetType}:${request.targetName}`,
    `request=${request.request.kind}/${request.request.mode}`,
    `origin=${origin}`,
    `pathKind=${request.sourcePathKind}`,
    source.trim(),
  ]
    .filter(Boolean)
    .join(" ");
}
async function probeInstallPolicy(params) {
  const validation = await validateInstallPolicyStatic(params.config);
  if (!validation.enabled || validation.issues.some((issue) => issue.severity === "error")) return;
  const targetType = validation.targets.includes("skill") ? "skill" : validation.targets[0];
  if (!targetType) return;
  return await runInstallPolicy({
    config: params.config,
    env: params.env,
    logger: params.logger,
    request: {
      targetType,
      targetName: "doctor-install-policy-probe",
      sourcePath: params.sourcePath,
      sourcePathKind: "directory",
      origin: { type: "doctor" },
      request: {
        kind: targetType === "skill" ? "skill-install" : "plugin-dir",
        mode: "install",
        requestedSpecifier: "doctor:install-policy-probe",
      },
    },
  });
}
//#endregion
export { runInstallPolicy as n, validateInstallPolicyStatic as r, probeInstallPolicy as t };
