import fs from "node:fs";
import path from "node:path";
import {
  a as resolveExecutablePathCandidate,
  i as resolveExecutablePath,
} from "./executable-path-BP9CqJ6T.js";
import { t as expandHomePrefix } from "./home-dir-DxrrpDft.js";
import {
  C as resolveDispatchWrapperTrustPlan,
  T as unwrapKnownDispatchWrapperInvocation,
  c as isShellWrapperExecutable,
  d as unwrapKnownShellMultiplexerInvocation,
  r as extractBindableShellWrapperInlineCommand,
} from "./shell-wrapper-resolution-DlXABXcG.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/infra/exec-allowlist-pattern.ts
const GLOB_REGEX_CACHE_LIMIT = 512;
const globRegexCache = /* @__PURE__ */ new Map();
function normalizeMatchTarget(value) {
  if (process.platform === "win32")
    return normalizeLowercaseStringOrEmpty(value.replace(/^\\\\[?.]\\/, "").replace(/\\/g, "/"));
  const normalized = value.replace(/\\\\/g, "/");
  if (process.platform === "darwin") {
    if (normalized === "/private/var") return "/var";
    if (normalized.startsWith("/private/var/")) return normalized.slice(8);
  }
  return normalized;
}
function tryRealpath(value) {
  try {
    return fs.realpathSync(value);
  } catch {
    return null;
  }
}
function hasDotPathSegment(value) {
  return value
    .replace(/\\/g, "/")
    .split("/")
    .some((segment) => segment === "." || segment === "..");
}
function normalizeDotPathSegments(value) {
  return normalizeMatchTarget(
    process.platform === "win32" ? path.win32.normalize(value) : path.posix.normalize(value),
  );
}
function escapeRegExpLiteral(input) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function compileGlobRegex(pattern) {
  const cacheKey = `${process.platform}:${pattern}`;
  const cached = globRegexCache.get(cacheKey);
  if (cached) return cached;
  let regex = "^";
  let i = 0;
  while (i < pattern.length) {
    const ch = pattern.charAt(i);
    if (ch === "*") {
      if (pattern[i + 1] === "*") {
        regex += ".*";
        i += 2;
        continue;
      }
      regex += "[^/]*";
      i += 1;
      continue;
    }
    if (ch === "?") {
      regex += "[^/]";
      i += 1;
      continue;
    }
    regex += escapeRegExpLiteral(ch);
    i += 1;
  }
  regex += "$";
  const compiled = new RegExp(regex, process.platform === "win32" ? "i" : "");
  if (globRegexCache.size >= GLOB_REGEX_CACHE_LIMIT) globRegexCache.clear();
  globRegexCache.set(cacheKey, compiled);
  return compiled;
}
function matchesExecAllowlistPattern(pattern, target) {
  const trimmed = pattern.trim();
  if (!trimmed) return false;
  const expanded = trimmed.startsWith("~") ? expandHomePrefix(trimmed) : trimmed;
  const hasWildcard = /[*?]/.test(expanded);
  let normalizedPattern = expanded;
  let normalizedTarget = target;
  if (process.platform === "win32" && !hasWildcard) {
    normalizedPattern = tryRealpath(expanded) ?? expanded;
    normalizedTarget = tryRealpath(target) ?? target;
  }
  normalizedPattern = normalizeMatchTarget(normalizedPattern);
  normalizedTarget = normalizeMatchTarget(normalizedTarget);
  if (hasWildcard && hasDotPathSegment(normalizedTarget))
    normalizedTarget = normalizeDotPathSegments(normalizedTarget);
  return compileGlobRegex(normalizedPattern).test(normalizedTarget);
}
//#endregion
//#region src/infra/exec-wrapper-trust-plan.ts
function blockedExecWrapperTrustPlan(params) {
  return {
    argv: params.argv,
    policyArgv: params.policyArgv ?? params.argv,
    wrapperChain: params.wrapperChain,
    policyBlocked: true,
    blockedWrapper: params.blockedWrapper,
    shellWrapperExecutable: false,
    shellInlineCommand: null,
  };
}
function finalizeExecWrapperTrustPlan(argv, policyArgv, wrapperChain, policyBlocked) {
  const rawExecutable = argv[0]?.trim() ?? "";
  const shellWrapperExecutable =
    !policyBlocked && rawExecutable.length > 0 && isShellWrapperExecutable(rawExecutable);
  return {
    argv,
    policyArgv,
    wrapperChain,
    policyBlocked,
    shellWrapperExecutable,
    shellInlineCommand: shellWrapperExecutable
      ? extractBindableShellWrapperInlineCommand(argv)
      : null,
  };
}
/**
 * Resolves transparent dispatch wrappers into the executable that policy should inspect.
 * Shell multiplexers keep their original argv as the trust target while exposing the
 * nested shell command for shell-specific approval checks.
 */
function resolveExecWrapperTrustPlan(argv, maxDepth = 4, platform = process.platform) {
  let current = argv;
  let policyArgv = argv;
  let sawShellMultiplexer = false;
  const wrapperChain = [];
  for (let depth = 0; depth < maxDepth; depth += 1) {
    const dispatchPlan = resolveDispatchWrapperTrustPlan(
      current,
      maxDepth - wrapperChain.length,
      platform,
    );
    if (dispatchPlan.policyBlocked)
      return blockedExecWrapperTrustPlan({
        argv: dispatchPlan.argv,
        policyArgv: dispatchPlan.argv,
        wrapperChain,
        blockedWrapper: dispatchPlan.blockedWrapper ?? current[0] ?? "unknown",
      });
    if (dispatchPlan.wrappers.length > 0) {
      wrapperChain.push(...dispatchPlan.wrappers);
      current = dispatchPlan.argv;
      if (!sawShellMultiplexer) policyArgv = current;
      if (wrapperChain.length >= maxDepth) break;
      continue;
    }
    const shellMultiplexerUnwrap = unwrapKnownShellMultiplexerInvocation(current);
    if (shellMultiplexerUnwrap.kind === "blocked")
      return blockedExecWrapperTrustPlan({
        argv: current,
        policyArgv,
        wrapperChain,
        blockedWrapper: shellMultiplexerUnwrap.wrapper,
      });
    if (shellMultiplexerUnwrap.kind === "unwrapped") {
      wrapperChain.push(shellMultiplexerUnwrap.wrapper);
      if (!sawShellMultiplexer) {
        policyArgv = current;
        sawShellMultiplexer = true;
      }
      current = shellMultiplexerUnwrap.argv;
      if (wrapperChain.length >= maxDepth) break;
      continue;
    }
    break;
  }
  if (wrapperChain.length >= maxDepth) {
    const dispatchOverflow = unwrapKnownDispatchWrapperInvocation(current, platform);
    if (dispatchOverflow.kind === "blocked" || dispatchOverflow.kind === "unwrapped")
      return blockedExecWrapperTrustPlan({
        argv: current,
        policyArgv,
        wrapperChain,
        blockedWrapper: dispatchOverflow.wrapper,
      });
    const shellMultiplexerOverflow = unwrapKnownShellMultiplexerInvocation(current);
    if (
      shellMultiplexerOverflow.kind === "blocked" ||
      shellMultiplexerOverflow.kind === "unwrapped"
    )
      return blockedExecWrapperTrustPlan({
        argv: current,
        policyArgv,
        wrapperChain,
        blockedWrapper: shellMultiplexerOverflow.wrapper,
      });
  }
  return finalizeExecWrapperTrustPlan(current, policyArgv, wrapperChain, false);
}
//#endregion
//#region src/infra/exec-command-resolution.ts
function isCommandResolution(resolution) {
  return Boolean(resolution && "execution" in resolution && "policy" in resolution);
}
function parseFirstToken(command) {
  const trimmed = command.trim();
  if (!trimmed) return null;
  const first = trimmed[0];
  if (first === '"' || first === "'") {
    const end = trimmed.indexOf(first, 1);
    if (end > 1) return trimmed.slice(1, end);
    return trimmed.slice(1);
  }
  const match = /^[^\s]+/.exec(trimmed);
  return match ? match[0] : null;
}
function tryResolveRealpath(filePath) {
  if (!filePath) return;
  try {
    return fs.realpathSync(filePath);
  } catch {
    return;
  }
}
function buildExecutableResolution(rawExecutable, params) {
  const resolvedPath = resolveExecutablePath(rawExecutable, {
    cwd: params.cwd,
    env: params.env,
  });
  return {
    rawExecutable,
    resolvedPath,
    resolvedRealPath: tryResolveRealpath(resolvedPath),
    executableName: resolvedPath ? path.basename(resolvedPath) : rawExecutable,
  };
}
function buildCommandResolution(params) {
  const execution = buildExecutableResolution(params.rawExecutable, params);
  const policy = params.policyRawExecutable
    ? buildExecutableResolution(params.policyRawExecutable, params)
    : execution;
  const resolution = {
    execution,
    policy,
    effectiveArgv: params.effectiveArgv,
    wrapperChain: params.wrapperChain,
    policyBlocked: params.policyBlocked,
    blockedWrapper: params.blockedWrapper,
  };
  return Object.defineProperties(resolution, {
    rawExecutable: { get: () => execution.rawExecutable },
    resolvedPath: { get: () => execution.resolvedPath },
    resolvedRealPath: { get: () => execution.resolvedRealPath },
    executableName: { get: () => execution.executableName },
    policyResolution: { get: () => (policy === execution ? void 0 : policy) },
  });
}
function resolveCommandResolution(command, cwd, env) {
  const rawExecutable = parseFirstToken(command);
  if (!rawExecutable) return null;
  return buildCommandResolution({
    rawExecutable,
    effectiveArgv: [rawExecutable],
    wrapperChain: [],
    policyBlocked: false,
    cwd,
    env,
  });
}
function resolveCommandResolutionFromArgv(argv, cwd, env, platform = process.platform) {
  const plan = resolveExecWrapperTrustPlan(argv, void 0, platform);
  const effectiveArgv = plan.argv;
  const rawExecutable = effectiveArgv[0]?.trim();
  if (!rawExecutable) return null;
  return buildCommandResolution({
    rawExecutable,
    policyRawExecutable: plan.policyArgv[0]?.trim(),
    effectiveArgv,
    wrapperChain: plan.wrapperChain,
    policyBlocked: plan.policyBlocked,
    blockedWrapper: plan.blockedWrapper,
    cwd,
    env,
  });
}
function resolveExecutableCandidatePathFromResolution(resolution, cwd) {
  if (!resolution) return;
  if (resolution.resolvedPath) return resolution.resolvedPath;
  const raw = resolution.rawExecutable?.trim();
  if (!raw) return;
  return resolveExecutablePathCandidate(raw, {
    cwd,
    requirePathSeparator: true,
  });
}
function resolveExecutableTrustPath(resolution, cwd) {
  const realPath = resolution?.resolvedRealPath?.trim();
  if (realPath) return realPath;
  const candidatePath = resolveExecutableCandidatePathFromResolution(resolution, cwd);
  return tryResolveRealpath(candidatePath) ?? candidatePath;
}
function resolveExecutionTargetResolution(resolution) {
  if (!resolution) return null;
  return isCommandResolution(resolution) ? resolution.execution : resolution;
}
function resolvePolicyTargetResolution(resolution) {
  if (!resolution) return null;
  return isCommandResolution(resolution) ? resolution.policy : resolution;
}
function resolveExecutionTargetCandidatePath(resolution, cwd) {
  return resolveExecutableCandidatePathFromResolution(
    isCommandResolution(resolution) ? resolution.execution : resolution,
    cwd,
  );
}
function resolveExecutionTargetTrustPath(resolution, cwd) {
  return resolveExecutableTrustPath(
    isCommandResolution(resolution) ? resolution.execution : resolution,
    cwd,
  );
}
function resolvePolicyTargetCandidatePath(resolution, cwd) {
  return resolveExecutableCandidatePathFromResolution(
    isCommandResolution(resolution) ? resolution.policy : resolution,
    cwd,
  );
}
function resolvePolicyTargetTrustPath(resolution, cwd) {
  return resolveExecutableTrustPath(
    isCommandResolution(resolution) ? resolution.policy : resolution,
    cwd,
  );
}
function resolveApprovalAuditCandidatePath(resolution, cwd) {
  return resolvePolicyTargetCandidatePath(resolution, cwd);
}
function resolveApprovalAuditTrustPath(resolution, cwd) {
  return resolvePolicyTargetTrustPath(resolution, cwd);
}
/** @deprecated Use resolveExecutionTargetCandidatePath. */
function resolveAllowlistCandidatePath(resolution, cwd) {
  return resolveExecutionTargetCandidatePath(resolution, cwd);
}
function resolvePolicyAllowlistCandidatePath(resolution, cwd) {
  return resolvePolicyTargetCandidatePath(resolution, cwd);
}
function matchArgPattern(argPattern, argv, platform) {
  const sep = argPattern.includes("\0") ? "\0" : " ";
  const argsSlice = argv.slice(1);
  const argsString =
    sep === "\0"
      ? argsSlice.length === 0
        ? "\0\0"
        : argsSlice.join(sep) + sep
      : argsSlice.join(sep);
  try {
    const regex = new RegExp(argPattern);
    if (regex.test(argsString)) return true;
    if (normalizeLowercaseStringOrEmpty(platform ?? process.platform).startsWith("win")) {
      const normalized = argsString.replace(/\//g, "\\");
      if (normalized !== argsString && regex.test(normalized)) return true;
    }
    return false;
  } catch {
    return false;
  }
}
function hasPathSelector(value) {
  return value.includes("/") || value.includes("\\") || value.includes("~");
}
function matchesExecutableBasenamePattern(pattern, resolution) {
  if (hasPathSelector(resolution.rawExecutable)) return false;
  const candidates = /* @__PURE__ */ new Set();
  if (resolution.executableName) candidates.add(resolution.executableName);
  if (resolution.resolvedPath) candidates.add(path.basename(resolution.resolvedPath));
  return [...candidates].some((candidate) => matchesExecAllowlistPattern(pattern, candidate));
}
function matchAllowlist(entries, resolution, argv, platform) {
  if (!entries.length) return null;
  const bareWild = entries.find((e) => e.pattern?.trim() === "*" && !e.argPattern);
  if (bareWild && resolution) return bareWild;
  if (!resolution?.resolvedPath) return null;
  const trustPath = resolution.resolvedRealPath?.trim() || resolution.resolvedPath;
  if (!trustPath) return null;
  let pathOnlyMatch = null;
  for (const entry of entries) {
    const pattern = entry.pattern?.trim();
    if (!pattern) continue;
    if (
      !(hasPathSelector(pattern)
        ? matchesExecAllowlistPattern(pattern, trustPath)
        : pattern !== "*" && matchesExecutableBasenamePattern(pattern, resolution))
    )
      continue;
    if (!entry.argPattern) {
      if (!pathOnlyMatch) pathOnlyMatch = entry;
      continue;
    }
    if (argv && matchArgPattern(entry.argPattern, argv, platform)) return entry;
  }
  return pathOnlyMatch;
}
/**
 * Tokenizes a single argv entry into a normalized option/positional model.
 * Consumers can share this model to keep argv parsing behavior consistent.
 */
function parseExecArgvToken(raw) {
  if (!raw)
    return {
      kind: "empty",
      raw,
    };
  if (raw === "--")
    return {
      kind: "terminator",
      raw,
    };
  if (raw === "-")
    return {
      kind: "stdin",
      raw,
    };
  if (!raw.startsWith("-"))
    return {
      kind: "positional",
      raw,
    };
  if (raw.startsWith("--")) {
    const eqIndex = raw.indexOf("=");
    if (eqIndex > 0)
      return {
        kind: "option",
        raw,
        style: "long",
        flag: raw.slice(0, eqIndex),
        inlineValue: raw.slice(eqIndex + 1),
      };
    return {
      kind: "option",
      raw,
      style: "long",
      flag: raw,
    };
  }
  const cluster = raw.slice(1);
  return {
    kind: "option",
    raw,
    style: "short-cluster",
    cluster,
    flags: cluster.split("").map((entry) => `-${entry}`),
  };
}
//#endregion
export {
  resolveApprovalAuditTrustPath as a,
  resolveExecutableTrustPath as c,
  resolveExecutionTargetTrustPath as d,
  resolvePolicyAllowlistCandidatePath as f,
  resolveExecWrapperTrustPlan as g,
  resolvePolicyTargetTrustPath as h,
  resolveApprovalAuditCandidatePath as i,
  resolveExecutionTargetCandidatePath as l,
  resolvePolicyTargetResolution as m,
  parseExecArgvToken as n,
  resolveCommandResolution as o,
  resolvePolicyTargetCandidatePath as p,
  resolveAllowlistCandidatePath as r,
  resolveCommandResolutionFromArgv as s,
  matchAllowlist as t,
  resolveExecutionTargetResolution as u,
};
