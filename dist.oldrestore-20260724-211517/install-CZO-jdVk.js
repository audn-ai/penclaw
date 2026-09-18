import { randomUUID } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { h as isWindowsDrivePath } from "./archive-CR1500gV.js";
import "./fs-safe-RNq3oO57.js";
import { t as resolveBrewExecutable } from "./brew-BuAbPCrG.js";
import { a as resolveSkillsInstallPreferences } from "./config-B_sNiRFS.js";
import { n as hasBinary } from "./config-eval-BLzabchw.js";
import { t as isContainerEnvironment } from "./container-environment-CNsJSTpY.js";
import "./path-safety-CBe_wA_B.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-Da47iiZE.js";
import "./sandbox-paths-DxDLkOQF.js";
import { i as resolveSkillKey } from "./frontmatter-DXeaZ3EN.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import {
  o as safePathSegmentHashed,
  r as assertCanonicalPathWithinBase,
} from "./install-safe-path-EhqVsq3P.js";
import { t as evaluateSkillInstallPolicy } from "./install-security-scan-Bu6soO4h.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { c as isWithinDir } from "./path-DILYn_gk.js";
import { a as root } from "./secure-temp-dir-DMUMnweR.js";
import { t as resolveSkillSource } from "./source-9Jdpd6BI.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { d as resolveConfigDir, s as ensureDir } from "./utils-DtcDeqWS.js";
import { o as loadWorkspaceSkillEntries } from "./workspace-DR7anktc.js";
//#region src/skills/runtime/tools-dir.ts
/** Resolves a skill's tools directory relative to the OpenClaw config dir. */
function resolveSkillToolsRootDir(entry) {
  const safeKey = safePathSegmentHashed(resolveSkillKey(entry.skill, entry));
  return path.join(resolveConfigDir(), "tools", safeKey);
}
//#endregion
//#region src/skills/lifecycle/install-output.ts
function summarizeInstallOutput(text) {
  const raw = text.trim();
  if (!raw) return;
  const lines = normalizeStringEntries(raw.split("\n"));
  if (lines.length === 0) return;
  const preferred =
    lines.find((line) => /^error\b/i.test(line)) ??
    lines.find((line) => /\b(err!|error:|failed)\b/i.test(line)) ??
    lines.at(-1);
  if (!preferred) return;
  const normalized = preferred.replace(/\s+/g, " ").trim();
  const maxLen = 200;
  return normalized.length > maxLen ? `${truncateUtf16Safe(normalized, maxLen - 1)}…` : normalized;
}
/** Formats a bounded install failure message from command exit and output. */
function formatInstallFailureMessage(result) {
  const code = typeof result.code === "number" ? `exit ${result.code}` : "unknown exit";
  const summary = summarizeInstallOutput(result.stderr) ?? summarizeInstallOutput(result.stdout);
  if (!summary) return `Install failed (${code})`;
  return `Install failed (${code}): ${summary}`;
}
//#endregion
//#region src/skills/lifecycle/install-download.ts
const extractModuleLoader = createLazyImportLoader(() => import("./install-extract-B9rvQlN8.js"));
async function loadExtractModule() {
  return await extractModuleLoader.load();
}
function isNodeReadableStream(value) {
  return Boolean(value && typeof value.pipe === "function");
}
async function cancelIgnoredResponseBody(response) {
  const body = response.body;
  const cancel = body && typeof body.cancel === "function" ? body.cancel : void 0;
  if (!cancel) return;
  await Promise.resolve(cancel.call(body)).catch(() => void 0);
}
function resolveDownloadTargetDir(entry, spec) {
  const root = resolveSkillToolsRootDir(entry);
  const raw = spec.targetDir?.trim();
  if (!raw) return root;
  const resolved =
    raw.startsWith("~") || path.isAbsolute(raw) || isWindowsDrivePath(raw)
      ? resolveUserPath(raw)
      : path.resolve(root, raw);
  if (!isWithinDir(root, resolved))
    throw new Error(
      `Refusing to install outside the skill tools directory. targetDir="${raw}" resolves to "${resolved}". Allowed root: "${root}".`,
    );
  return resolved;
}
function resolveArchiveType(spec, filename) {
  const explicit = normalizeOptionalLowercaseString(spec.archive);
  if (explicit) return explicit;
  const lower = normalizeOptionalLowercaseString(filename);
  if (!lower) return;
  if (lower.endsWith(".tar.gz") || lower.endsWith(".tgz")) return "tar.gz";
  if (lower.endsWith(".tar.bz2") || lower.endsWith(".tbz2")) return "tar.bz2";
  if (lower.endsWith(".zip")) return "zip";
}
async function downloadFile(params) {
  const destPath = path.resolve(params.rootDir, params.relativePath);
  const stagingDir = path.join(params.rootDir, ".openclaw-download-staging");
  await ensureDir(stagingDir);
  await assertCanonicalPathWithinBase({
    baseDir: params.rootDir,
    candidatePath: stagingDir,
    boundaryLabel: "skill tools directory",
  });
  const tempPath = path.join(stagingDir, `${randomUUID()}.tmp`);
  const { response, release } = await fetchWithSsrFGuard({
    url: params.url,
    timeoutMs: Math.max(1e3, params.timeoutMs),
  });
  try {
    if (!response.ok || !response.body) {
      await cancelIgnoredResponseBody(response);
      throw new Error(`Download failed (${response.status} ${response.statusText})`);
    }
    const file = fs.createWriteStream(tempPath);
    const body = response.body;
    await pipeline(isNodeReadableStream(body) ? body : Readable.fromWeb(body), file);
    await (await root(params.rootDir)).copyIn(params.relativePath, tempPath);
    return { bytes: (await fs.promises.stat(destPath)).size };
  } finally {
    await fs.promises.rm(tempPath, { force: true }).catch(() => void 0);
    await release();
  }
}
async function installDownloadSpec(params) {
  const { entry, spec, timeoutMs } = params;
  const root = resolveSkillToolsRootDir(entry);
  const url = spec.url?.trim();
  if (!url)
    return {
      ok: false,
      message: "missing download url",
      stdout: "",
      stderr: "",
      code: null,
    };
  let filename;
  try {
    const parsed = new URL(url);
    filename = path.basename(parsed.pathname);
  } catch {
    filename = path.basename(url);
  }
  if (!filename) filename = "download";
  let canonicalRoot;
  let targetDir;
  try {
    await ensureDir(root);
    await assertCanonicalPathWithinBase({
      baseDir: root,
      candidatePath: root,
      boundaryLabel: "skill tools directory",
    });
    canonicalRoot = await fs.promises.realpath(root);
    const requestedTargetDir = resolveDownloadTargetDir(entry, spec);
    await ensureDir(requestedTargetDir);
    await assertCanonicalPathWithinBase({
      baseDir: root,
      candidatePath: requestedTargetDir,
      boundaryLabel: "skill tools directory",
    });
    const targetRelativePath = path.relative(root, requestedTargetDir);
    targetDir = path.join(canonicalRoot, targetRelativePath);
  } catch (err) {
    const message = formatErrorMessage(err);
    return {
      ok: false,
      message,
      stdout: "",
      stderr: message,
      code: null,
    };
  }
  const archivePath = path.join(targetDir, filename);
  const archiveRelativePath = path.relative(canonicalRoot, archivePath);
  if (
    !archiveRelativePath ||
    archiveRelativePath === ".." ||
    archiveRelativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(archiveRelativePath)
  )
    return {
      ok: false,
      message: "invalid download archive path",
      stdout: "",
      stderr: "invalid download archive path",
      code: null,
    };
  let downloaded;
  try {
    downloaded = (
      await downloadFile({
        url,
        rootDir: canonicalRoot,
        relativePath: archiveRelativePath,
        timeoutMs,
      })
    ).bytes;
  } catch (err) {
    const message = formatErrorMessage(err);
    return {
      ok: false,
      message,
      stdout: "",
      stderr: message,
      code: null,
    };
  }
  const archiveType = resolveArchiveType(spec, filename);
  if (!(spec.extract ?? Boolean(archiveType)))
    return {
      ok: true,
      message: `Downloaded to ${archivePath}`,
      stdout: `downloaded=${downloaded}`,
      stderr: "",
      code: 0,
    };
  if (!archiveType)
    return {
      ok: false,
      message: "extract requested but archive type could not be detected",
      stdout: "",
      stderr: "",
      code: null,
    };
  try {
    await assertCanonicalPathWithinBase({
      baseDir: canonicalRoot,
      candidatePath: targetDir,
      boundaryLabel: "skill tools directory",
    });
  } catch (err) {
    const message = formatErrorMessage(err);
    return {
      ok: false,
      message,
      stdout: "",
      stderr: message,
      code: null,
    };
  }
  const { extractArchive } = await loadExtractModule();
  const extractResult = await extractArchive({
    archivePath,
    archiveType,
    targetDir,
    stripComponents: spec.stripComponents,
    timeoutMs,
  });
  const success = extractResult.code === 0;
  return {
    ok: success,
    message: success
      ? `Downloaded and extracted to ${targetDir}`
      : formatInstallFailureMessage(extractResult),
    stdout: extractResult.stdout.trim(),
    stderr: extractResult.stderr.trim(),
    code: extractResult.code,
  };
}
let skillsInstallDeps = {
  hasBinary,
  loadWorkspaceSkillEntries,
  resolveNodeInstallStateDir: resolveDefaultNodeInstallStateDir,
  resolveBrewExecutable,
  isContainerEnvironment,
  resolveSkillsInstallPreferences,
};
function getSkillsInstallDeps() {
  return skillsInstallDeps;
}
function withWarnings(result, warnings) {
  if (warnings.length === 0) return result;
  return {
    ...result,
    warnings: warnings.slice(),
  };
}
function resolveInstallId(spec, index) {
  return (spec.id ?? `${spec.kind}-${index}`).trim();
}
function findInstallSpec(entry, installId) {
  const specs = entry.metadata?.install ?? [];
  for (const [index, spec] of specs.entries())
    if (resolveInstallId(spec, index) === installId) return spec;
}
function normalizeSkillInstallSpec(spec) {
  return {
    ...(spec.id ? { id: spec.id } : {}),
    kind: spec.kind,
    ...(spec.label ? { label: spec.label } : {}),
    ...(spec.bins ? { bins: spec.bins.slice() } : {}),
    ...(spec.os ? { os: spec.os.slice() } : {}),
    ...(spec.formula ? { formula: spec.formula } : {}),
    ...(spec.package ? { package: spec.package } : {}),
    ...(spec.module ? { module: spec.module } : {}),
    ...(spec.url ? { url: spec.url } : {}),
    ...(spec.archive ? { archive: spec.archive } : {}),
    ...(spec.extract !== void 0 ? { extract: spec.extract } : {}),
    ...(spec.stripComponents !== void 0 ? { stripComponents: spec.stripComponents } : {}),
    ...(spec.targetDir ? { targetDir: spec.targetDir } : {}),
  };
}
function buildNodeInstallCommand(packageName, prefs) {
  switch (prefs.nodeManager) {
    case "pnpm":
      return ["pnpm", "add", "-g", "--ignore-scripts", packageName];
    case "yarn":
      return ["yarn", "global", "add", "--ignore-scripts", packageName];
    case "bun":
      return ["bun", "add", "-g", "--ignore-scripts", packageName];
    default:
      return ["npm", "install", "-g", "--ignore-scripts", packageName];
  }
}
function resolveDefaultNodeInstallStateDir({
  cwd = process.cwd(),
  getuid = process.getuid?.bind(process),
  homedir = os.homedir,
  platform = process.platform,
} = {}) {
  if (platform !== "win32" && getuid?.() === 0)
    return path.join(path.parse(cwd).root, "var", "lib", "openclaw");
  return path.join(homedir(), ".openclaw");
}
async function buildNodeInstallEnv(prefs) {
  if (prefs.nodeManager !== "npm") return {};
  const stateDir = getSkillsInstallDeps().resolveNodeInstallStateDir();
  const prefix = path.join(stateDir, "tools", "node", "npm");
  await fs.promises.mkdir(prefix, {
    recursive: true,
    mode: 448,
  });
  return {
    NPM_CONFIG_PREFIX: prefix,
    npm_config_prefix: prefix,
  };
}
const SAFE_BREW_FORMULA = /^[a-z0-9][a-z0-9+._@-]*(\/[a-z0-9][a-z0-9+._@-]*){0,2}$/;
const SAFE_NODE_PACKAGE = /^(@[a-z0-9._-]+\/)?[a-z0-9._-]+(@[a-z0-9^~>=<.*|-]+)?$/;
const SAFE_GO_MODULE = /^[a-zA-Z0-9][a-zA-Z0-9._/-]*@[a-z0-9v._-]+$/;
const SAFE_UV_PACKAGE =
  /^[a-z0-9][a-z0-9._-]*(\[[a-z0-9,._-]+\])?(([><=!~]=?|===?)[a-z0-9.*_-]+)?$/i;
function assertSafeInstallerValue(value, kind, pattern) {
  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith("-")) return `${kind} value is empty or starts with a dash`;
  if (!pattern.test(trimmed)) return `${kind} value contains invalid characters: ${trimmed}`;
  return null;
}
function buildInstallCommand(spec, prefs) {
  switch (spec.kind) {
    case "brew": {
      if (!spec.formula)
        return {
          argv: null,
          error: "missing brew formula",
        };
      const err = assertSafeInstallerValue(spec.formula, "brew formula", SAFE_BREW_FORMULA);
      if (err)
        return {
          argv: null,
          error: err,
        };
      return { argv: ["brew", "install", spec.formula.trim()] };
    }
    case "node": {
      if (!spec.package)
        return {
          argv: null,
          error: "missing node package",
        };
      const err = assertSafeInstallerValue(spec.package, "node package", SAFE_NODE_PACKAGE);
      if (err)
        return {
          argv: null,
          error: err,
        };
      return { argv: buildNodeInstallCommand(spec.package.trim(), prefs) };
    }
    case "go": {
      if (!spec.module)
        return {
          argv: null,
          error: "missing go module",
        };
      const err = assertSafeInstallerValue(spec.module, "go module", SAFE_GO_MODULE);
      if (err)
        return {
          argv: null,
          error: err,
        };
      return { argv: ["go", "install", spec.module.trim()] };
    }
    case "uv": {
      if (!spec.package)
        return {
          argv: null,
          error: "missing uv package",
        };
      const err = assertSafeInstallerValue(spec.package, "uv package", SAFE_UV_PACKAGE);
      if (err)
        return {
          argv: null,
          error: err,
        };
      return { argv: ["uv", "tool", "install", spec.package.trim()] };
    }
    case "download":
      return {
        argv: null,
        error: "download install handled separately",
      };
    default:
      return {
        argv: null,
        error: "unsupported installer",
      };
  }
}
async function resolveBrewPrefixBinDir(timeoutMs, brewExe) {
  const prefixResult = await runCommandSafely([brewExe, "--prefix"], {
    timeoutMs: Math.min(timeoutMs, 3e4),
  });
  if (prefixResult.code === 0) {
    const prefix = prefixResult.stdout.trim();
    if (prefix) return path.join(prefix, "bin");
  }
}
async function resolveBrewBinDir(timeoutMs, brewExe) {
  const deps = getSkillsInstallDeps();
  const exe = brewExe ?? (deps.hasBinary("brew") ? "brew" : deps.resolveBrewExecutable());
  if (!exe) return;
  const prefixBin = await resolveBrewPrefixBinDir(timeoutMs, exe);
  if (prefixBin) return prefixBin;
  for (const candidate of ["/opt/homebrew/bin", "/usr/local/bin"])
    try {
      if (fs.existsSync(candidate)) return candidate;
    } catch {}
}
function createInstallFailure(params) {
  return {
    ok: false,
    message: params.message,
    stdout: params.stdout?.trim() ?? "",
    stderr: params.stderr?.trim() ?? "",
    code: params.code ?? null,
    ...(params.skipReason ? { skipReason: params.skipReason } : {}),
  };
}
function createInstallSuccess(result) {
  return {
    ok: true,
    message: "Installed",
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
    code: result.code,
  };
}
async function runCommandSafely(argv, optionsOrTimeout) {
  try {
    const result = await runCommandWithTimeout(argv, optionsOrTimeout);
    return {
      code: result.code,
      stdout: result.stdout,
      stderr: result.stderr,
    };
  } catch (err) {
    return {
      code: null,
      stdout: "",
      stderr: formatErrorMessage(err),
    };
  }
}
function resolveBrewMissingFailure(spec) {
  const formula = spec.formula ?? "this package";
  if (process.platform === "linux" && getSkillsInstallDeps().isContainerEnvironment())
    return createInstallFailure({
      message: `brew not installed — Homebrew is not installed in this Linux container. Build a custom image with Homebrew or install "${formula}" manually using a supported system package before enabling this skill.`,
    });
  return createInstallFailure({
    message: `brew not installed — ${process.platform === "linux" ? `Homebrew is not installed. Install it from https://brew.sh or install "${formula}" manually using your system package manager (e.g. apt, dnf, pacman).` : "Homebrew is not installed. Install it from https://brew.sh"}`,
  });
}
async function ensureUvInstalled(params) {
  if (params.spec.kind !== "uv" || getSkillsInstallDeps().hasBinary("uv")) return;
  if (!params.brewExe)
    return createInstallFailure({
      message:
        "uv not installed — install manually: https://docs.astral.sh/uv/getting-started/installation/",
    });
  const brewResult = await runCommandSafely([params.brewExe, "install", "uv"], {
    timeoutMs: params.timeoutMs,
  });
  if (brewResult.code === 0) return;
  return createInstallFailure({
    message: "Failed to install uv (brew)",
    ...brewResult,
  });
}
const MIN_AUTO_GO_MAJOR = 1;
const MIN_AUTO_GO_MINOR = 21;
const MIN_AUTO_GO_VERSION = `${MIN_AUTO_GO_MAJOR}.${MIN_AUTO_GO_MINOR}`;
const APT_GO_PACKAGE = "golang-go";
const APT_GO_POLICY_ARGV = ["apt-cache", "policy", APT_GO_PACKAGE];
const APT_GO_UPDATE_ARGV = ["apt-get", "update", "-qq"];
const APT_GO_INSTALL_ARGV = ["apt-get", "install", "-y", APT_GO_PACKAGE];
const SUDO_NONINTERACTIVE_PREFIX = ["sudo", "-n"];
const SUDO_APT_GO_CHECK_ARGVS = [
  ["sudo", "-k", "-n", "-ll", ...APT_GO_UPDATE_ARGV],
  ["sudo", "-k", "-n", "-ll", ...APT_GO_INSTALL_ARGV],
];
const GO_VERSION_ENV_ARGV = ["go", "env", "GOVERSION"];
function isSupportedGoVersion(version) {
  return (
    version.major > MIN_AUTO_GO_MAJOR ||
    (version.major === MIN_AUTO_GO_MAJOR && version.minor >= MIN_AUTO_GO_MINOR)
  );
}
function parseAptGoCandidate(output) {
  const match = /Candidate:\s*(?:\d+:)?(\d+)\.(\d+)/.exec(output);
  if (!match) return;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
  };
}
function appendPathDirectory(pathEnv, directory) {
  if ((pathEnv ?? "").split(path.delimiter).includes(directory)) return pathEnv ?? directory;
  return pathEnv ? `${pathEnv}${path.delimiter}${directory}` : directory;
}
function sudoListAllowsPasswordlessCommand(output) {
  const optionsLine = output.split(/\r?\n/).find((line) => /^\s*Options:\s*/.test(line));
  if (!optionsLine) return false;
  return optionsLine
    .slice(optionsLine.indexOf(":") + 1)
    .split(",")
    .some((option) => option.trim() === "!authenticate");
}
async function resolveAptCommandAccess() {
  if (typeof process.getuid === "function" && process.getuid() === 0)
    return {
      available: true,
      prefix: [],
    };
  if (!getSkillsInstallDeps().hasBinary("sudo"))
    return {
      available: false,
      reason: "sudo-missing",
    };
  for (const argv of SUDO_APT_GO_CHECK_ARGVS) {
    const sudoCheck = await runCommandSafely(argv, {
      timeoutMs: 5e3,
      env: { LC_ALL: "C" },
    });
    if (sudoCheck.code !== 0)
      return {
        available: false,
        reason: "sudo-unusable",
        failure: sudoCheck,
      };
    if (!sudoListAllowsPasswordlessCommand(sudoCheck.stdout))
      return {
        available: false,
        reason: "sudo-unusable",
        failure: {
          code: 1,
          stdout: sudoCheck.stdout,
          stderr: sudoCheck.stderr || "sudo rule requires authentication",
        },
      };
  }
  return {
    available: true,
    prefix: SUDO_NONINTERACTIVE_PREFIX,
  };
}
async function readGoAptCandidate(timeoutMs) {
  const policy = await runCommandSafely(APT_GO_POLICY_ARGV, {
    timeoutMs: Math.min(timeoutMs, 1e4),
    env: { LC_ALL: "C" },
  });
  if (policy.code !== 0) return { failure: policy };
  return { candidate: parseAptGoCandidate(policy.stdout) };
}
async function resolveGoAptInstallCandidate(params) {
  const update = await runCommandSafely([...params.prefix, ...APT_GO_UPDATE_ARGV], {
    timeoutMs: params.timeoutMs,
  });
  const policy = await readGoAptCandidate(params.timeoutMs);
  if (policy.failure)
    return {
      usable: false,
      kind: "error",
      failure: policy.failure,
    };
  if (policy.candidate)
    return isSupportedGoVersion(policy.candidate)
      ? { usable: true }
      : {
          usable: false,
          kind: "unavailable",
        };
  return update.code === 0
    ? {
        usable: false,
        kind: "unavailable",
      }
    : {
        usable: false,
        kind: "error",
        failure: update,
      };
}
async function installGoViaApt(timeoutMs) {
  const aptFailureMessage =
    "go not installed — automatic install via apt failed. Install manually: https://go.dev/doc/install";
  const access = await resolveAptCommandAccess();
  if (!access.available && access.reason === "sudo-missing")
    return createInstallFailure({
      message:
        "go not installed — apt-get is available but sudo is not installed. Install manually: https://go.dev/doc/install",
    });
  if (!access.available)
    return createInstallFailure({
      message:
        "go not installed — apt-get is available but sudo is not usable (missing or requires a password). Install manually: https://go.dev/doc/install",
      ...access.failure,
    });
  const candidate = await resolveGoAptInstallCandidate({
    prefix: access.prefix,
    timeoutMs,
  });
  if (!candidate.usable)
    return createInstallFailure({
      message:
        candidate.kind === "unavailable"
          ? `go not installed — apt does not provide a usable Go ${MIN_AUTO_GO_VERSION}+ package. Install manually: https://go.dev/doc/install`
          : aptFailureMessage,
      ...(candidate.kind === "error" ? candidate.failure : {}),
      ...(candidate.kind === "unavailable" ? { skipReason: "go" } : {}),
    });
  const aptResult = await runCommandSafely([...access.prefix, ...APT_GO_INSTALL_ARGV], {
    timeoutMs,
  });
  if (aptResult.code === 0) return;
  return createInstallFailure({
    message: aptFailureMessage,
    ...aptResult,
  });
}
async function ensureGoInstalled(params) {
  if (params.spec.kind !== "go" || getSkillsInstallDeps().hasBinary("go")) return;
  if (params.brewExe) {
    const brewResult = await runCommandSafely([params.brewExe, "install", "go"], {
      timeoutMs: params.timeoutMs,
    });
    if (brewResult.code === 0) return;
    return createInstallFailure({
      message: "Failed to install go (brew)",
      ...brewResult,
    });
  }
  if (getSkillsInstallDeps().hasBinary("apt-get")) return installGoViaApt(params.timeoutMs);
  return createInstallFailure({
    message: "go not installed — install manually: https://go.dev/doc/install",
  });
}
function parseGoVersion(output) {
  const match = /\bgo(\d+)\.(\d+)(?:[.\w-]*)?\b/.exec(output);
  if (!match) return;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
  };
}
async function isGoUsableForAutoInstall() {
  const versionResult = await runCommandSafely(GO_VERSION_ENV_ARGV, {
    timeoutMs: 5e3,
    env: { GOTOOLCHAIN: "local" },
  });
  if (versionResult.code !== 0) return false;
  const version = parseGoVersion(versionResult.stdout);
  return version !== void 0 && isSupportedGoVersion(version);
}
function isGoToolchainPrerequisiteFailure(result) {
  const output = `${result.message}\n${result.stdout}\n${result.stderr}`;
  return (
    /requires go >= \S+ \(running go \S+(?:; GOTOOLCHAIN=[^)]+)?\)/i.test(output) ||
    /invalid GOTOOLCHAIN/i.test(output) ||
    /cannot find "go[^"]+" in PATH/i.test(output)
  );
}
async function canBootstrapGoViaApt() {
  if (!getSkillsInstallDeps().hasBinary("apt-get")) return false;
  return (await resolveAptCommandAccess()).available;
}
/**
 * Preflight twin of installSkill's prerequisite fallbacks (brew exe, ensureUvInstalled,
 * ensureGoInstalled/installGoViaApt). Says whether a recipe kind can run without manual
 * setup so callers can skip doomed installs; keep in lockstep with those fallbacks.
 *
 * uv bootstraps count only on-PATH brew because the recipe still spawns bare `uv`.
 * Go installs can use a resolved brew prefix because installSkill carries that bin
 * into the child and current PATH. Brew recipes swap argv[0] to the resolved path.
 */
async function resolveInstallerKindReadiness(kind) {
  const deps = getSkillsInstallDeps();
  const brewOnPath = deps.hasBinary("brew");
  const brewExe = brewOnPath ? "brew" : deps.resolveBrewExecutable();
  switch (kind) {
    case "brew":
      return brewExe
        ? { ready: true }
        : {
            ready: false,
            reason: "brew",
          };
    case "uv":
      if (deps.hasBinary("uv")) return { ready: true };
      return brewOnPath
        ? { ready: true }
        : {
            ready: false,
            reason: "uv",
          };
    case "go":
      if (deps.hasBinary("go"))
        return (await isGoUsableForAutoInstall())
          ? { ready: true }
          : {
              ready: false,
              reason: "go",
            };
      if (brewOnPath) return { ready: true };
      if (brewExe)
        return (await resolveBrewPrefixBinDir(1e4, brewExe))
          ? { ready: true }
          : {
              ready: false,
              reason: "go",
            };
      return (await canBootstrapGoViaApt())
        ? { ready: true }
        : {
            ready: false,
            reason: "go",
          };
    default:
      return { ready: true };
  }
}
async function executeInstallCommand(params) {
  if (!params.argv || params.argv.length === 0)
    return createInstallFailure({ message: "invalid install command" });
  const result = await runCommandSafely(params.argv, {
    timeoutMs: params.timeoutMs,
    env: params.env,
  });
  if (result.code === 0) return createInstallSuccess(result);
  return createInstallFailure({
    message: formatInstallFailureMessage(result),
    ...result,
  });
}
async function installSkill(params) {
  const timeoutMs = Math.min(Math.max(params.timeoutMs ?? 3e5, 1e3), 9e5);
  const workspaceDir = resolveUserPath(params.workspaceDir);
  const deps = getSkillsInstallDeps();
  const entry = deps
    .loadWorkspaceSkillEntries(workspaceDir)
    .find((item) => item.skill.name === params.skillName);
  if (!entry)
    return {
      ok: false,
      message: `Skill not found: ${params.skillName}`,
      stdout: "",
      stderr: "",
      code: null,
    };
  const spec = findInstallSpec(entry, params.installId);
  const warnings = [];
  const skillSource = resolveSkillSource(entry.skill);
  const normalizedSpec = spec ? normalizeSkillInstallSpec(spec) : void 0;
  const scanResult = await evaluateSkillInstallPolicy({
    config: params.config,
    installId: params.installId,
    ...(normalizedSpec ? { installSpec: normalizedSpec } : {}),
    logger: { warn: (message) => warnings.push(message) },
    origin: {
      type: skillSource,
      skillName: params.skillName,
      installId: params.installId,
    },
    source:
      skillSource === "openclaw-bundled"
        ? {
            kind: "bundled",
            authority: "openclaw",
            mutable: false,
            network: false,
          }
        : skillSource === "openclaw-managed" || skillSource === "openclaw-extra"
          ? {
              kind: "managed",
              authority: "openclaw",
              mutable: false,
              network: false,
            }
          : {
              kind: "workspace",
              authority: "user",
              mutable: true,
              network: false,
            },
    requestedSpecifier: `${params.skillName}:${params.installId}`,
    skillName: params.skillName,
    sourceDir: path.resolve(entry.skill.baseDir),
  });
  if (scanResult?.blocked)
    return withWarnings(
      {
        ok: false,
        message: scanResult.blocked.reason,
        stdout: "",
        stderr: "",
        code: null,
      },
      warnings,
    );
  if (
    !/* @__PURE__ */ new Set(["openclaw-bundled", "openclaw-managed", "openclaw-extra"]).has(
      skillSource,
    )
  )
    warnings.push(
      `WARNING: Skill "${params.skillName}" install triggered from non-bundled source "${skillSource}". Verify the install recipe is trusted.`,
    );
  if (!spec)
    return withWarnings(
      {
        ok: false,
        message: `Installer not found: ${params.installId}`,
        stdout: "",
        stderr: "",
        code: null,
      },
      warnings,
    );
  if (spec.kind === "download")
    return withWarnings(
      await installDownloadSpec({
        entry,
        spec,
        timeoutMs,
      }),
      warnings,
    );
  const prefs = deps.resolveSkillsInstallPreferences(params.config);
  const command = buildInstallCommand(spec, prefs);
  if (command.error)
    return withWarnings(
      {
        ok: false,
        message: command.error,
        stdout: "",
        stderr: "",
        code: null,
      },
      warnings,
    );
  const brewExe = deps.hasBinary("brew") ? "brew" : deps.resolveBrewExecutable();
  if (spec.kind === "brew" && !brewExe)
    return withWarnings(resolveBrewMissingFailure(spec), warnings);
  const uvInstallFailure = await ensureUvInstalled({
    spec,
    brewExe,
    timeoutMs,
  });
  if (uvInstallFailure) return withWarnings(uvInstallFailure, warnings);
  const goWasAlreadyInstalled = spec.kind === "go" && deps.hasBinary("go");
  const goInstallFailure = await ensureGoInstalled({
    spec,
    brewExe,
    timeoutMs,
  });
  if (goInstallFailure) return withWarnings(goInstallFailure, warnings);
  const argv = command.argv ? [...command.argv] : null;
  if (spec.kind === "brew" && brewExe && argv?.[0] === "brew") argv[0] = brewExe;
  const envOverrides = {};
  let installedGoBin;
  if (spec.kind === "node") Object.assign(envOverrides, await buildNodeInstallEnv(prefs));
  if (spec.kind === "go") {
    installedGoBin =
      (brewExe && !goWasAlreadyInstalled ? await resolveBrewBinDir(timeoutMs, brewExe) : void 0) ??
      path.join(os.homedir(), ".local", "bin");
    envOverrides.GOBIN = installedGoBin;
    envOverrides.PATH = appendPathDirectory(process.env.PATH, installedGoBin);
  }
  const installResult = await executeInstallCommand({
    argv,
    timeoutMs,
    env: Object.keys(envOverrides).length > 0 ? envOverrides : void 0,
  });
  if (installResult.ok && installedGoBin && envOverrides.PATH) process.env.PATH = envOverrides.PATH;
  return withWarnings(
    spec.kind === "go" && !installResult.ok && isGoToolchainPrerequisiteFailure(installResult)
      ? {
          ...installResult,
          skipReason: "go",
        }
      : installResult,
    warnings,
  );
}
//#endregion
export { installSkill as n, resolveInstallerKindReadiness as r, MIN_AUTO_GO_VERSION as t };
