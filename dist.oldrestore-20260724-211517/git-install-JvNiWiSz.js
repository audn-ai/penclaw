import fs from "node:fs/promises";
import path from "node:path";
import { t as sanitizeForLog } from "./ansi-D4OHEz5F.js";
import "./fs-safe-defaults-B7hUN42l.js";
import { o as sha256HexPrefix } from "./crypto-digest-CNeb2i19.js";
import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import "./utils-DtcDeqWS.js";
import { v as pathExists } from "./fs-safe-RNq3oO57.js";
import "./replace-file-CaPU6XwS.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import {
  c as emitPluginInstallSecurityEvent,
  l as pluginAuditOutcomeForReason,
  r as installPluginFromInstalledPackageDir,
  s as emitPluginAuditSecurityEvent,
  t as PLUGIN_INSTALL_ERROR_CODE,
} from "./install-CjCRVnj8.js";
import { i as resolveDefaultPluginGitDir } from "./install-paths-CqMnrXsY.js";
import { n as preflightPluginGitInstallPolicy } from "./install-security-scan-Bu6soO4h.js";
import { s as withTempDir } from "./install-source-utils-Cvk6wk9f.js";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-CPcFXf0r.js";
import {
  n as createSafeNpmInstallEnv,
  t as createSafeNpmInstallArgs,
} from "./safe-package-install-CCGE7D0Q.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as hasHttpUrlPrefix } from "./url-protocol-oWYinajA.js";
import { a as guardedRm, r as guardedRename } from "./write-queue-DxjVr7Ru.js";
//#region node_modules/@openclaw/fs-safe/dist/replace-directory.js
async function replaceDirectoryAtomic(options) {
  const targetDir = path.resolve(options.targetDir);
  const stagedDir = path.resolve(options.stagedDir);
  const parentDir = path.dirname(targetDir);
  const backupDir = path.join(
    parentDir,
    `${options.backupPrefix ?? ".fs-safe-dir-backup-"}${process.pid}-${Date.now()}`,
  );
  let backupCreated = false;
  await fs.mkdir(parentDir, { recursive: true });
  try {
    await guardedRename({
      from: targetDir,
      to: backupDir,
    });
    backupCreated = true;
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
  try {
    await guardedRename({
      from: stagedDir,
      to: targetDir,
    });
  } catch (err) {
    if (backupCreated) {
      await guardedRename({
        from: backupDir,
        to: targetDir,
      }).catch(() => void 0);
      backupCreated = false;
    }
    throw err;
  }
  if (backupCreated)
    await guardedRm({
      target: backupDir,
      recursive: true,
      force: true,
      verifyAfter: false,
    });
}
//#endregion
//#region src/plugins/git-install.ts
const GIT_SPEC_PREFIX = "git:";
const DEFAULT_GIT_TIMEOUT_MS = 12e4;
const FULL_GIT_COMMIT_PATTERN = /^[0-9a-f]{40}$/i;
/** Returns true for full commit SHAs that do not require branch/tag drift checks. */
function isImmutableGitCommitRef(ref) {
  return FULL_GIT_COMMIT_PATTERN.test(ref ?? "");
}
function splitGitSpecRef(input) {
  const hashIndex = input.lastIndexOf("#");
  if (hashIndex > 0)
    return {
      base: input.slice(0, hashIndex),
      ref: normalizeOptionalString(input.slice(hashIndex + 1)),
    };
  for (
    let atIndex = input.lastIndexOf("@");
    atIndex > 0;
    atIndex = input.lastIndexOf("@", atIndex - 1)
  ) {
    const base = input.slice(0, atIndex);
    const ref = normalizeOptionalString(input.slice(atIndex + 1));
    if (ref && isGitSpecBase(base))
      return {
        base,
        ref,
      };
  }
  return { base: input };
}
function isGitSpecBase(value) {
  return (
    looksLikeGitHubRepoShorthand(value) ||
    looksLikeGitHubHostPath(value) ||
    looksLikeUrlGitSpecBase(value) ||
    looksLikeScpGitUrl(value) ||
    value.endsWith(".git") ||
    value.startsWith("./") ||
    value.startsWith("../") ||
    value.startsWith("~/")
  );
}
function looksLikeGitHubRepoShorthand(value) {
  return /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\.git)?$/.test(value);
}
function looksLikeGitHubHostPath(value) {
  return /^github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\.git)?$/i.test(value);
}
function isGitUrl(value) {
  if (value.startsWith("-")) return false;
  return (
    /^(?:ssh|git|file):\/\//i.test(value) || looksLikeScpGitUrl(value) || value.endsWith(".git")
  );
}
function looksLikeScpGitUrl(value) {
  return /^[^@\s]+@[^:\s]+:.+/.test(value);
}
function looksLikeUrlGitSpecBase(value) {
  try {
    const url = new URL(value);
    if (!["http:", "https:", "ssh:", "git:", "file:"].includes(url.protocol)) return false;
    if (url.protocol === "file:") return url.pathname.length > 1;
    return Boolean(url.hostname) && url.pathname.length > 1;
  } catch {
    return false;
  }
}
function stripGitSuffix(value) {
  return value.replace(/\.git$/i, "");
}
function normalizeGitHubRepo(value) {
  const repo = stripGitSuffix(value.replace(/^github\.com\//i, ""));
  return {
    url: `https://github.com/${repo}.git`,
    label: repo,
  };
}
function normalizeGitLabel(value) {
  if (hasHttpUrlPrefix(value) || /^(?:ssh|git|file):\/\//i.test(value))
    try {
      const url = new URL(value);
      return stripGitSuffix(`${url.hostname}${url.pathname}`).replace(/^\/+/, "");
    } catch {
      return stripGitSuffix(value);
    }
  return stripGitSuffix(value);
}
function parseGitPluginSpec(raw) {
  const trimmed = raw.trim();
  if (!trimmed.toLowerCase().startsWith(GIT_SPEC_PREFIX)) return null;
  const body = trimmed.slice(4).trim();
  if (!body) return null;
  const split = splitGitSpecRef(body);
  const base = split.base.trim();
  if (!base) return null;
  if (looksLikeGitHubRepoShorthand(base) || looksLikeGitHubHostPath(base)) {
    const normalized = normalizeGitHubRepo(base);
    return {
      input: trimmed,
      url: normalized.url,
      ref: split.ref,
      label: normalized.label,
      normalizedSpec: `${GIT_SPEC_PREFIX}${normalized.url}${split.ref ? `@${split.ref}` : ""}`,
    };
  }
  if (
    hasHttpUrlPrefix(base) ||
    isGitUrl(base) ||
    base.startsWith("./") ||
    base.startsWith("../") ||
    base.startsWith("~/")
  ) {
    const url =
      base.startsWith("./") || base.startsWith("../") || base.startsWith("~/")
        ? resolveUserPath(base)
        : base;
    return {
      input: trimmed,
      url,
      ref: split.ref,
      label: normalizeGitLabel(url),
      normalizedSpec: `${GIT_SPEC_PREFIX}${url}${split.ref ? `@${split.ref}` : ""}`,
    };
  }
  return null;
}
function createGitCommandEnv() {
  return {
    GIT_TERMINAL_PROMPT: "0",
    GIT_CONFIG_NOSYSTEM: "1",
    GIT_TEMPLATE_DIR: "",
    GIT_EDITOR: "",
    GIT_SEQUENCE_EDITOR: "",
    GIT_EXTERNAL_DIFF: "",
    GIT_DIR: void 0,
    GIT_WORK_TREE: void 0,
    GIT_COMMON_DIR: void 0,
    GIT_INDEX_FILE: void 0,
    GIT_OBJECT_DIRECTORY: void 0,
    GIT_ALTERNATE_OBJECT_DIRECTORIES: void 0,
    GIT_NAMESPACE: void 0,
    GIT_EXEC_PATH: void 0,
    GIT_SSL_NO_VERIFY: void 0,
  };
}
function resolveGitInstallRepoDir(params) {
  const gitRoot = params.gitDir ? resolveUserPath(params.gitDir) : resolveDefaultPluginGitDir();
  const redactedSpec = redactSensitiveUrlLikeString(params.source.normalizedSpec);
  return path.join(gitRoot, `git-${sha256HexPrefix(redactedSpec, 16)}`, "repo");
}
async function withGitStagingDir(persistentRepoDir, fn) {
  if (!persistentRepoDir) return await withTempDir("openclaw-git-plugin-", fn);
  const targetParent = path.dirname(persistentRepoDir);
  try {
    await fs.mkdir(targetParent, { recursive: true });
  } catch {
    return await withTempDir("openclaw-git-plugin-", fn);
  }
  let callbackStarted = false;
  try {
    return await withTempDir(
      "openclaw-git-plugin-",
      async (tmpDir) => {
        callbackStarted = true;
        return await fn(tmpDir);
      },
      { rootDir: targetParent },
    );
  } catch (err) {
    if (callbackStarted) throw err;
    return await withTempDir("openclaw-git-plugin-", fn);
  }
}
async function replaceManagedGitRepo(params) {
  try {
    await replaceDirectoryAtomic({
      stagedDir: params.stagedRepoDir,
      targetDir: params.persistentRepoDir,
      backupPrefix: ".repo-backup-",
    });
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: `failed to replace managed git plugin repository: ${String(err)}`,
    };
  }
}
function formatGitCommandFailure(params) {
  const detail = sanitizeForLog(
    redactSensitiveUrlLikeString(params.stderr.trim() || params.stdout.trim() || "git failed"),
  );
  return `failed to ${params.action} ${sanitizeForLog(redactSensitiveUrlLikeString(params.source.label))}: ${detail}`;
}
function buildBlockedGitInstallResult(params) {
  return {
    ok: false,
    error: params.blocked.reason,
    ...(params.blocked.code === "security_scan_failed"
      ? { code: PLUGIN_INSTALL_ERROR_CODE.SECURITY_SCAN_FAILED }
      : params.blocked.code === "security_scan_blocked"
        ? { code: PLUGIN_INSTALL_ERROR_CODE.SECURITY_SCAN_BLOCKED }
        : {}),
  };
}
async function runGitCommand(params) {
  const result = await runCommandWithTimeout(params.argv, {
    cwd: params.cwd,
    timeoutMs: params.timeoutMs ?? DEFAULT_GIT_TIMEOUT_MS,
    env: createGitCommandEnv(),
  });
  if (result.code !== 0)
    return {
      ok: false,
      error: formatGitCommandFailure({
        action: params.action,
        source: params.source,
        stdout: result.stdout,
        stderr: result.stderr,
      }),
    };
  return {
    ok: true,
    stdout: result.stdout,
  };
}
async function installPluginFromGitSpec(params) {
  const parsed = parseGitPluginSpec(params.spec);
  if (!parsed)
    return {
      ok: false,
      error: `unsupported git: plugin spec: ${params.spec}`,
    };
  const persistentRepoDir = resolveGitInstallRepoDir({
    gitDir: params.gitDir,
    source: parsed,
  });
  const effectiveMode =
    params.mode === "update" && (await pathExists(persistentRepoDir)) ? "update" : "install";
  return await withGitStagingDir(params.dryRun ? void 0 : persistentRepoDir, async (tmpDir) => {
    const repoDir = path.join(tmpDir, "repo");
    params.logger?.info?.(
      `Cloning ${sanitizeForLog(redactSensitiveUrlLikeString(parsed.label))}...`,
    );
    const clone = await runGitCommand({
      argv: parsed.ref
        ? ["git", "clone", "--", parsed.url, repoDir]
        : ["git", "clone", "--depth", "1", "--", parsed.url, repoDir],
      action: "clone",
      source: parsed,
      timeoutMs: params.timeoutMs,
    });
    if (!clone.ok) return clone;
    if (parsed.ref) {
      const checkout = await runGitCommand({
        argv: ["git", "switch", "--detach", "--", parsed.ref],
        action: `checkout ${parsed.ref}`,
        source: parsed,
        cwd: repoDir,
        timeoutMs: params.timeoutMs,
      });
      if (!checkout.ok) return checkout;
    }
    const rev = await runGitCommand({
      argv: ["git", "rev-parse", "HEAD"],
      action: "resolve commit for",
      source: parsed,
      cwd: repoDir,
      timeoutMs: params.timeoutMs,
    });
    if (!rev.ok) return rev;
    const installPolicyRequest = {
      kind: "plugin-git",
      requestedSpecifier: parsed.input,
      source: {
        kind: "git",
        authority: "third-party",
        mutable: !isImmutableGitCommitRef(parsed.ref),
        network: true,
      },
    };
    const preflight = await preflightPluginGitInstallPolicy({
      config: params.config,
      logger: params.logger ?? {},
      mode: effectiveMode,
      pluginId: params.expectedPluginId ?? parsed.label,
      requestedSpecifier: parsed.input,
      source: installPolicyRequest.source,
      sourcePath: repoDir,
    });
    if (preflight?.blocked) {
      const reason =
        preflight.blocked.code === "security_scan_failed"
          ? "security_scan_failed"
          : "security_scan_blocked";
      emitPluginAuditSecurityEvent({
        outcome: pluginAuditOutcomeForReason(reason),
        reason,
        pluginId: params.expectedPluginId,
        mode: effectiveMode,
        sourceFamily: "git",
      });
      return buildBlockedGitInstallResult({ blocked: preflight.blocked });
    }
    if (!params.dryRun) {
      params.logger?.info?.("Installing plugin dependencies with npm…");
      const install = await runCommandWithTimeout(
        [
          "npm",
          ...createSafeNpmInstallArgs({
            omitDev: true,
            loglevel: "error",
            noAudit: true,
            noFund: true,
          }),
        ],
        {
          cwd: repoDir,
          timeoutMs: Math.max(params.timeoutMs ?? DEFAULT_GIT_TIMEOUT_MS, 3e5),
          env: createSafeNpmInstallEnv(process.env, {
            npmConfigCwd: repoDir,
            packageLock: true,
            quiet: true,
          }),
        },
      );
      if (install.code !== 0)
        return {
          ok: false,
          error: `npm install failed: ${install.stderr.trim() || install.stdout.trim()}`,
        };
    }
    const result = await installPluginFromInstalledPackageDir({
      dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
      config: params.config,
      packageDir: repoDir,
      dryRun: params.dryRun,
      expectedPluginId: params.expectedPluginId,
      logger: params.logger,
      mode: effectiveMode,
      emitSuccessSecurityEvent: false,
      installPolicyRequest,
    });
    if (!result.ok) return result;
    if (!params.dryRun) {
      const replaceResult = await replaceManagedGitRepo({
        stagedRepoDir: repoDir,
        persistentRepoDir,
      });
      if (!replaceResult.ok) return replaceResult;
      emitPluginInstallSecurityEvent({
        pluginId: result.pluginId,
        mode: effectiveMode,
        sourceFamily: "git",
        extensionCount: result.extensions.length,
        hasVersion: Boolean(result.version),
        trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
      });
    }
    return {
      ...result,
      targetDir: params.dryRun ? result.targetDir : persistentRepoDir,
      git: {
        url: parsed.url,
        ref: parsed.ref,
        commit: normalizeOptionalString(rev.stdout),
        resolvedAt: /* @__PURE__ */ new Date().toISOString(),
      },
    };
  });
}
//#endregion
export { isImmutableGitCommitRef as n, parseGitPluginSpec as r, installPluginFromGitSpec as t };
