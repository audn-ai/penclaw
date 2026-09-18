import fs from "node:fs";
import fs$1 from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  i as resolveControlUiDistIndexPathForRoot,
  r as resolveControlUiDistIndexHealth,
} from "./control-ui-assets-Bfrq0NUW.js";
import { t as DOCTOR_DISABLE_CROSS_STATE_DIR_IMPORTS_ENV } from "./doctor-invocation-C25PAPM1.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import { v as pathExists } from "./fs-safe-RNq3oO57.js";
import { i as resolveGatewayInstallEntrypoint } from "./gateway-entrypoint-Cmek2XHM.js";
import {
  n as applyPosixNpmScriptShellEnv,
  r as createNpmFreshnessBypassArgs,
  t as applyNpmFreshnessBypassEnv,
} from "./npm-install-env-Cp-LOc1Z.js";
import {
  n as collectPackageDistInventory,
  r as readPackageDistInventoryIfPresent,
  t as PACKAGE_DIST_INVENTORY_RELATIVE_PATH,
} from "./package-dist-inventory-TfuUCUDb.js";
import { n as readPackageName, r as readPackageVersion } from "./package-json-pCn6I6Ni.js";
import { t as applyPathPrepend } from "./path-prepend-CSea97Kz.js";
import { t as movePathWithCopyFallback } from "./replace-file-CaPU6XwS.js";
import { u as trimLogTail } from "./restart-sentinel-CJp3hEwi.js";
import { a as parseSemver } from "./runtime-guard-BFPw9ugu.js";
import { t as resolveStableNodePath } from "./stable-node-path-C86C9Dv2.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import {
  _ as uniqueStrings,
  l as normalizeStringEntries,
} from "./string-normalization-CRyoFBPt.js";
import {
  a as channelToNpmTag,
  c as isStableTag,
  n as DEV_BRANCH,
  r as EXTENDED_STABLE_TAG_UNSUPPORTED_REASON,
  s as isBetaTag,
} from "./update-channels-CQNa2YMG.js";
import {
  c as detectPackageManager,
  n as compareSemverStrings,
  o as resolveExtendedStablePackage,
} from "./update-check-DaMnBu3x.js";
import { t as PACKAGE_POST_INSTALL_DOCTOR_ADVISORY } from "./update-doctor-result-BDmbyXXJ.js";
import { l as pathExists$1 } from "./utils-DtcDeqWS.js";
//#region src/infra/package-tag.ts
/** Normalizes a package tag input, stripping known package-name prefixes when present. */
function normalizePackageTagInput(value, packageNames) {
  const trimmed = normalizeOptionalString(value);
  if (!trimmed) return null;
  for (const packageName of packageNames) {
    if (trimmed === packageName) return null;
    const prefix = `${packageName}@`;
    if (trimmed.startsWith(prefix)) {
      const tag = trimmed.slice(prefix.length).trim();
      return tag ? tag : null;
    }
  }
  return trimmed;
}
//#endregion
//#region scripts/lib/bundled-runtime-sidecar-paths.json
var bundled_runtime_sidecar_paths_default = [
  "dist/extensions/browser/runtime-api.js",
  "dist/extensions/canvas/runtime-api.js",
  "dist/extensions/copilot-proxy/runtime-api.js",
  "dist/extensions/google/runtime-api.js",
  "dist/extensions/imessage/runtime-api.js",
  "dist/extensions/lmstudio/runtime-api.js",
  "dist/extensions/memory-core/runtime-api.js",
  "dist/extensions/ollama/runtime-api.js",
  "dist/extensions/open-prose/runtime-api.js",
  "dist/extensions/telegram/runtime-api.js",
  "dist/extensions/telegram/runtime-setter-api.js",
  "dist/extensions/webhooks/runtime-api.js",
  "dist/extensions/workboard/runtime-api.js",
];
//#endregion
//#region src/plugins/runtime-sidecar-paths.ts
function assertUniqueValues(values, label) {
  const seen = /* @__PURE__ */ new Set();
  const duplicates = /* @__PURE__ */ new Set();
  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
      continue;
    }
    seen.add(value);
  }
  if (duplicates.size > 0)
    throw new Error(`Duplicate ${label}: ${Array.from(duplicates).join(", ")}`);
  return values;
}
const BUNDLED_RUNTIME_SIDECAR_PATHS = assertUniqueValues(
  bundled_runtime_sidecar_paths_default,
  "bundled runtime sidecar path",
);
//#endregion
//#region src/infra/update-global.ts
const PRIMARY_PACKAGE_NAME = "openclaw";
const ALL_PACKAGE_NAMES = [PRIMARY_PACKAGE_NAME];
const GLOBAL_RENAME_PREFIX = ".";
/** npm-compatible spec used when the user asks to install the moving main branch. */
const OPENCLAW_MAIN_PACKAGE_SPEC = "github:openclaw/openclaw#main";
const COREPACK_ENABLE_DOWNLOAD_PROMPT_DEFAULT = "0";
const NPM_GLOBAL_INSTALL_QUIET_FLAGS = ["--no-fund", "--no-audit", "--loglevel=error"];
const PNPM_OPENCLAW_BUILD_ALLOWLIST_FLAG = `--allow-build=${PRIMARY_PACKAGE_NAME}`;
const FIRST_PACKAGED_DIST_INVENTORY_VERSION = {
  major: 2026,
  minor: 4,
  patch: 15,
};
const OMITTED_PRIVATE_QA_BUNDLED_PLUGIN_ROOTS = /* @__PURE__ */ new Set([
  "dist/extensions/qa-channel",
  "dist/extensions/qa-lab",
  "dist/extensions/qa-matrix",
]);
function normalizePackageTarget(value) {
  return value.trim();
}
function normalizePackageVersionForComparison(value) {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  return trimmed.replace(/^[vV](?=\d)/, "");
}
/** Returns true when a user target requests the moving main-branch package spec. */
function isMainPackageTarget(value) {
  return normalizeLowercaseStringOrEmpty(normalizePackageTarget(value)) === "main";
}
/**
 * Returns true for targets that should pass through as package-manager specs
 * rather than being treated as registry dist-tags.
 */
function isExplicitPackageInstallSpec(value) {
  const trimmed = normalizePackageTarget(value);
  if (!trimmed) return false;
  return (
    /\.(?:tgz|tar\.gz)$/iu.test(trimmed) ||
    trimmed.includes("://") ||
    trimmed.includes("#") ||
    /^(?:file|github|git\+ssh|git\+https|git\+http|git\+file|npm):/i.test(trimmed)
  );
}
function stripPrimaryPackageAlias(spec) {
  const normalized = normalizePackageTarget(spec);
  const prefix = `${PRIMARY_PACKAGE_NAME}@`;
  return normalized.toLowerCase().startsWith(prefix)
    ? normalized.slice(prefix.length).trim()
    : normalized;
}
function isPnpmOpenClawSourceInstallSpec(spec) {
  const target = stripPrimaryPackageAlias(spec);
  return (
    /^github:/i.test(target) ||
    /^git\+(?:ssh|https|http|file):/i.test(target) ||
    /^git:/i.test(target)
  );
}
/**
 * Extracts a pinned installed version from package specs like `openclaw@1.2.3`.
 * Moving tags, URLs, git refs, and aliases return null because they cannot be
 * compared reliably after install.
 */
function resolveExpectedInstalledVersionFromSpec(packageName, spec) {
  const normalizedPackageName = packageName.trim();
  const normalizedSpec = normalizePackageTarget(spec);
  if (!normalizedPackageName || !normalizedSpec.startsWith(`${normalizedPackageName}@`))
    return null;
  const rawVersion = normalizedSpec.slice(normalizedPackageName.length + 1).trim();
  if (
    !rawVersion ||
    rawVersion.includes("/") ||
    rawVersion.includes(":") ||
    rawVersion.includes("#") ||
    /^(latest|beta|next|main)$/i.test(rawVersion)
  )
    return null;
  return normalizePackageVersionForComparison(rawVersion);
}
/**
 * Verifies that a global package root looks like a packaged OpenClaw install
 * and, when supplied, matches the expected concrete version.
 */
async function collectInstalledGlobalPackageErrors(params) {
  const errors = [];
  errors.push(...(await collectSourceCheckoutInstallErrors(params.packageRoot)));
  const installedVersion = await readPackageVersion(params.packageRoot);
  const expectedComparable = normalizePackageVersionForComparison(params.expectedVersion);
  const installedComparable = normalizePackageVersionForComparison(installedVersion);
  if (expectedComparable && installedComparable !== expectedComparable)
    errors.push(
      `expected installed version ${expectedComparable}, found ${installedComparable ?? "<missing>"}`,
    );
  errors.push(
    ...(await collectInstalledPackageDistErrors({
      packageRoot: params.packageRoot,
      installedVersion,
      expectedVersion: params.expectedVersion,
    })),
  );
  return errors;
}
async function collectSourceCheckoutInstallErrors(packageRoot) {
  const realPackageRoot = await tryRealpath(packageRoot);
  return ((await pathExists$1(path.join(realPackageRoot, ".git"))) ||
    (await pathExists$1(path.join(realPackageRoot, "pnpm-workspace.yaml")))) &&
    (await pathExists$1(path.join(realPackageRoot, "src"))) &&
    (await pathExists$1(path.join(realPackageRoot, "extensions")))
    ? [`global package root resolves to source checkout: ${realPackageRoot}`]
    : [];
}
function shouldRequirePackagedDistInventory(version) {
  const parsed = parseSemver(version ?? null);
  if (!parsed) return false;
  if (parsed.major !== FIRST_PACKAGED_DIST_INVENTORY_VERSION.major)
    return parsed.major > FIRST_PACKAGED_DIST_INVENTORY_VERSION.major;
  if (parsed.minor !== FIRST_PACKAGED_DIST_INVENTORY_VERSION.minor)
    return parsed.minor > FIRST_PACKAGED_DIST_INVENTORY_VERSION.minor;
  return parsed.patch >= FIRST_PACKAGED_DIST_INVENTORY_VERSION.patch;
}
async function collectInstalledPackageDistErrors(params) {
  const criticalPaths = await collectCriticalInstalledPackageDistPaths(params.packageRoot);
  let inventoryFiles = null;
  let inventoryError = null;
  try {
    inventoryFiles = await readPackageDistInventoryIfPresent(params.packageRoot);
  } catch {
    inventoryError = `invalid package dist inventory ${PACKAGE_DIST_INVENTORY_RELATIVE_PATH}`;
  }
  if (inventoryFiles !== null) {
    const actualFiles = await collectPackageDistInventory(params.packageRoot);
    const inventoryErrors = await collectInstalledPathErrors({
      packageRoot: params.packageRoot,
      expectedFiles: inventoryFiles,
      actualFiles,
      missingMessage: (relativePath) => `missing packaged dist file ${relativePath}`,
      unexpectedMessage: (relativePath) => `unexpected packaged dist file ${relativePath}`,
    });
    const inventorySet = new Set(inventoryFiles);
    const supplementalCriticalPaths = criticalPaths.filter(
      (relativePath) => !inventorySet.has(relativePath),
    );
    if (supplementalCriticalPaths.length === 0) return inventoryErrors;
    return [
      ...inventoryErrors,
      ...(await collectInstalledPathErrors({
        packageRoot: params.packageRoot,
        expectedFiles: supplementalCriticalPaths,
        actualFiles,
        missingMessage: (relativePath) => `missing bundled runtime sidecar ${relativePath}`,
      })),
    ];
  }
  const criticalErrors = await collectInstalledPathErrors({
    packageRoot: params.packageRoot,
    expectedFiles: await collectLegacyInstalledPackageDistPaths(params.packageRoot),
    actualFiles: null,
    missingMessage: (relativePath) => `missing bundled runtime sidecar ${relativePath}`,
  });
  if (inventoryError) return [inventoryError, ...criticalErrors];
  if (
    shouldRequirePackagedDistInventory(params.installedVersion) ||
    shouldRequirePackagedDistInventory(params.expectedVersion)
  )
    return [
      `missing package dist inventory ${PACKAGE_DIST_INVENTORY_RELATIVE_PATH}`,
      ...criticalErrors,
    ];
  return criticalErrors;
}
async function collectLegacyInstalledPackageDistPaths(packageRoot) {
  return await collectCriticalInstalledPackageDistPaths(packageRoot);
}
async function collectCriticalInstalledPackageDistPaths(packageRoot) {
  const expectedFiles = /* @__PURE__ */ new Set();
  await Promise.all(
    BUNDLED_RUNTIME_SIDECAR_PATHS.map(async (relativePath) => {
      const pluginRoot = resolveBundledPluginRoot(relativePath);
      if (pluginRoot === null) return;
      if (OMITTED_PRIVATE_QA_BUNDLED_PLUGIN_ROOTS.has(pluginRoot)) return;
      if (
        (await pathExists$1(path.join(packageRoot, pluginRoot, "package.json"))) ||
        (await pathExists$1(path.join(packageRoot, pluginRoot, "openclaw.plugin.json")))
      )
        expectedFiles.add(relativePath);
    }),
  );
  return [...expectedFiles].toSorted((left, right) => left.localeCompare(right));
}
function resolveBundledPluginRoot(relativePath) {
  const match = /^dist\/extensions\/[^/]+/u.exec(relativePath);
  return match ? match[0] : null;
}
async function collectInstalledPathErrors(params) {
  const errors = [];
  const actualSet = params.actualFiles ? new Set(params.actualFiles) : null;
  for (const relativePath of params.expectedFiles)
    if (
      !(actualSet !== null
        ? actualSet.has(relativePath)
        : await pathExists$1(path.join(params.packageRoot, relativePath)))
    )
      errors.push(params.missingMessage(relativePath));
  if (actualSet !== null && params.unexpectedMessage) {
    const expectedSet = new Set(params.expectedFiles);
    for (const relativePath of params.actualFiles ?? [])
      if (!expectedSet.has(relativePath)) errors.push(params.unexpectedMessage(relativePath));
  }
  return errors;
}
/**
 * Returns true when a target can be resolved through npm registry metadata.
 * Explicit tarball, URL, git, and main-branch specs bypass registry lookup.
 */
function canResolveRegistryVersionForPackageTarget(value) {
  const trimmed = normalizePackageTarget(value);
  if (!trimmed) return true;
  return !isMainPackageTarget(trimmed) && !isExplicitPackageInstallSpec(trimmed);
}
async function resolvePortableGitPathPrepend() {
  if (process.platform !== "win32") return [];
  const localAppData = process.env.LOCALAPPDATA?.trim();
  if (!localAppData) return [];
  const portableGitRoot = path.join(localAppData, "OpenClaw", "deps", "portable-git");
  const candidates = [
    path.join(portableGitRoot, "mingw64", "bin"),
    path.join(portableGitRoot, "usr", "bin"),
    path.join(portableGitRoot, "cmd"),
    path.join(portableGitRoot, "bin"),
  ];
  const existing = [];
  for (const candidate of candidates) if (await pathExists$1(candidate)) existing.push(candidate);
  return existing;
}
function applyWindowsPackageInstallEnv(env) {
  if (process.platform !== "win32") return;
  env.NPM_CONFIG_UPDATE_NOTIFIER = "false";
  env.NPM_CONFIG_FUND = "false";
  env.NPM_CONFIG_AUDIT = "false";
  env.NODE_LLAMA_CPP_SKIP_DOWNLOAD = "1";
}
function applyCorepackDownloadPromptEnv(env) {
  if (!env.COREPACK_ENABLE_DOWNLOAD_PROMPT?.trim())
    env.COREPACK_ENABLE_DOWNLOAD_PROMPT = COREPACK_ENABLE_DOWNLOAD_PROMPT_DEFAULT;
}
/**
 * Converts a user tag or explicit package target into the package-manager spec
 * used by global install commands.
 */
function resolveGlobalInstallSpec(params) {
  const override =
    params.env?.OPENCLAW_UPDATE_PACKAGE_SPEC?.trim() ||
    process.env.OPENCLAW_UPDATE_PACKAGE_SPEC?.trim();
  if (override) return override;
  const target = normalizePackageTarget(params.tag);
  if (isMainPackageTarget(target)) return OPENCLAW_MAIN_PACKAGE_SPEC;
  if (isExplicitPackageInstallSpec(target)) return target;
  return `${params.packageName}@${target}`;
}
/**
 * Builds the package-manager environment used for global installs.
 * It keeps caller env values, adds platform-specific install defaults, and
 * disables npm/corepack prompts that would otherwise hang unattended updates.
 */
async function createGlobalInstallEnv(env) {
  const pathPrepend = await resolvePortableGitPathPrepend();
  const sourceEnv = env ?? process.env;
  const merged = Object.fromEntries(
    Object.entries(sourceEnv)
      .filter(([, value]) => value != null)
      .map(([key, value]) => [key, String(value)]),
  );
  applyPathPrepend(merged, pathPrepend);
  applyWindowsPackageInstallEnv(merged);
  applyCorepackDownloadPromptEnv(merged);
  applyNpmFreshnessBypassEnv(merged);
  applyPosixNpmScriptShellEnv(merged);
  return merged;
}
async function tryRealpath(targetPath) {
  try {
    return await fs$1.realpath(targetPath);
  } catch {
    return path.resolve(targetPath);
  }
}
function resolveBunGlobalRoot() {
  const bunInstall = process.env.BUN_INSTALL?.trim() || path.join(os.homedir(), ".bun");
  return path.join(bunInstall, "install", "global", "node_modules");
}
function inferNpmPrefixFromPackageRoot(pkgRoot) {
  const nodeModulesDir = inferGlobalRootFromPackageRoot(pkgRoot);
  if (!nodeModulesDir) return null;
  const parentDir = path.dirname(nodeModulesDir);
  if (path.basename(parentDir) === "lib") return path.dirname(parentDir);
  if (
    process.platform === "win32" &&
    normalizeLowercaseStringOrEmpty(path.basename(parentDir)) === "npm"
  )
    return parentDir;
  return null;
}
/**
 * Infers npm prefix, package root, and bin paths from an npm global root.
 * Direct `node_modules` roots are accepted only when the caller opts into them.
 */
function resolveNpmGlobalPrefixLayoutFromGlobalRoot(globalRoot, options = {}) {
  const trimmed = globalRoot?.trim();
  if (!trimmed) return null;
  const normalized = path.resolve(trimmed);
  if (path.basename(normalized) !== "node_modules") return null;
  const parentDir = path.dirname(normalized);
  if (path.basename(parentDir) === "lib") {
    const prefix = path.dirname(parentDir);
    return {
      prefix,
      globalRoot: normalized,
      binDir: path.join(prefix, "bin"),
    };
  }
  if (process.platform === "win32")
    return {
      prefix: parentDir,
      globalRoot: normalized,
      binDir: parentDir,
    };
  if (options.allowDirectNodeModulesRoot)
    return {
      prefix: parentDir,
      globalRoot: normalized,
      binDir: path.join(normalized, ".bin"),
    };
  return null;
}
/**
 * Derives npm's global package and bin directories from a prefix root.
 * Used for staged installs where OpenClaw creates the prefix itself.
 */
function resolveNpmGlobalPrefixLayoutFromPrefix(prefix) {
  const resolvedPrefix = path.resolve(prefix);
  if (process.platform === "win32")
    return {
      prefix: resolvedPrefix,
      globalRoot: path.join(resolvedPrefix, "node_modules"),
      binDir: resolvedPrefix,
    };
  return {
    prefix: resolvedPrefix,
    globalRoot: path.join(resolvedPrefix, "lib", "node_modules"),
    binDir: path.join(resolvedPrefix, "bin"),
  };
}
function splitNormalizedPathParts(value) {
  return path
    .resolve(value)
    .split(path.sep)
    .filter(Boolean)
    .map((part) => normalizeLowercaseStringOrEmpty(part));
}
function isNodeVersionPathPart(value) {
  return value !== void 0 && /^v?\d+(?:\.\d+){0,3}(?:[-+][0-9a-z.-]+)?$/u.test(value);
}
function hasPathSequence(parts, sequence) {
  const lastStart = parts.length - sequence.length;
  for (let index = 0; index <= lastStart; index += 1)
    if (sequence.every((part, offset) => parts[index + offset] === part)) return true;
  return false;
}
function isEphemeralNodeManagedNpmPrefix(prefix) {
  const parts = splitNormalizedPathParts(prefix);
  const basename = parts.at(-1);
  const parent = parts.at(-2);
  const grandparent = parts.at(-3);
  if (isNodeVersionPathPart(basename) && grandparent === "cellar") return true;
  if (
    isNodeVersionPathPart(basename) &&
    (hasPathSequence(parts, [".nvm", "versions", "node"]) ||
      hasPathSequence(parts, ["n", "versions", "node"]) ||
      hasPathSequence(parts, [".asdf", "installs", "nodejs"]) ||
      hasPathSequence(parts, [".volta", "tools", "image", "node"]))
  )
    return true;
  return (
    basename === "installation" && isNodeVersionPathPart(parent) && grandparent === "node-versions"
  );
}
function resolveNpmCommandBesidePackageRoot(pkgRoot) {
  const prefix = inferNpmPrefixFromPackageRoot(pkgRoot);
  if (!prefix) return null;
  const candidate =
    process.platform === "win32" ? path.join(prefix, "npm.cmd") : path.join(prefix, "bin", "npm");
  return fs.existsSync(candidate) ? candidate : null;
}
function resolvePreferredNpmCommand(pkgRoot) {
  const prefix = inferNpmPrefixFromPackageRoot(pkgRoot);
  if (prefix && isEphemeralNodeManagedNpmPrefix(prefix)) return null;
  return resolveNpmCommandBesidePackageRoot(pkgRoot);
}
function inferGlobalRootFromPackageRoot(pkgRoot) {
  const trimmed = pkgRoot?.trim();
  if (!trimmed) return null;
  const normalized = path.resolve(trimmed);
  let globalRoot = path.dirname(normalized);
  if (path.basename(globalRoot).startsWith("@")) globalRoot = path.dirname(globalRoot);
  return path.basename(globalRoot) === "node_modules" ? globalRoot : null;
}
function resolvePackageRootFromGlobalRoot(params) {
  const parts = (params.packageName?.trim() || PRIMARY_PACKAGE_NAME).split("/");
  const hasSafeSegments =
    parts.length > 0 &&
    parts.length <= 2 &&
    parts.every(
      (part) => part.length > 0 && part !== "." && part !== ".." && !part.includes("\\"),
    ) &&
    (parts.length === 1 || parts[0]?.startsWith("@"));
  return path.join(params.globalRoot, ...(hasSafeSegments ? parts : [PRIMARY_PACKAGE_NAME]));
}
function isDirectNpmNodeModulesRoot(globalRoot) {
  return (
    globalRoot !== null &&
    resolveNpmGlobalPrefixLayoutFromGlobalRoot(globalRoot) === null &&
    resolveNpmGlobalPrefixLayoutFromGlobalRoot(globalRoot, { allowDirectNodeModulesRoot: true }) !==
      null
  );
}
function inferBunGlobalRootFromPackageRoot(pkgRoot) {
  const directGlobalRoot = inferGlobalRootFromPackageRoot(pkgRoot);
  if (!directGlobalRoot) return null;
  return path.resolve(directGlobalRoot) === path.resolve(resolveBunGlobalRoot())
    ? directGlobalRoot
    : null;
}
function inferPnpmGlobalRootFromPackageRoot(pkgRoot) {
  const directGlobalRoot = inferGlobalRootFromPackageRoot(pkgRoot);
  if (resolvePnpmGlobalDirFromGlobalRoot(directGlobalRoot)) return directGlobalRoot;
  const trimmed = pkgRoot?.trim();
  if (!trimmed) return null;
  const parts = path.resolve(trimmed).split(path.sep);
  const pnpmIndex = parts.lastIndexOf(".pnpm");
  if (pnpmIndex <= 0) return null;
  if (parts[pnpmIndex + 2] !== "node_modules") return null;
  const layoutDir = parts.slice(0, pnpmIndex).join(path.sep) || path.sep;
  const globalRoot =
    path.basename(layoutDir) === "node_modules" ? layoutDir : path.join(layoutDir, "node_modules");
  return resolvePnpmGlobalDirFromGlobalRoot(globalRoot) ? globalRoot : null;
}
/**
 * Resolves pnpm's global-dir from its active `node_modules` root.
 * Versioned pnpm layouts put packages under `<globalDir>/<version>/node_modules`.
 */
function resolvePnpmGlobalDirFromGlobalRoot(globalRoot) {
  const trimmed = globalRoot?.trim();
  if (!trimmed) return null;
  const normalized = path.resolve(trimmed);
  if (path.basename(normalized) !== "node_modules") return null;
  const layoutDir = path.dirname(normalized);
  return /^\d+$/u.test(path.basename(layoutDir)) ? path.dirname(layoutDir) : null;
}
async function isPnpmGlobalPackageRoot(pkgRoot) {
  const globalRoot = inferPnpmGlobalRootFromPackageRoot(pkgRoot);
  if (!globalRoot) return false;
  const layoutDir = path.dirname(globalRoot);
  if (!(await pathExists$1(path.join(globalRoot, ".modules.yaml")))) return false;
  return (
    (await pathExists$1(path.join(layoutDir, "pnpm-lock.yaml"))) ||
    (await pathExists$1(path.join(layoutDir, "package.json")))
  );
}
function resolvePreferredGlobalManagerCommand(manager, pkgRoot) {
  if (manager !== "npm") return manager;
  return resolvePreferredNpmCommand(pkgRoot) ?? manager;
}
/**
 * Resolves the package-manager command to execute for a global install.
 * npm may use the npm binary beside an existing package root when available.
 */
function resolveGlobalInstallCommand(manager, pkgRoot) {
  return {
    manager,
    command: resolvePreferredGlobalManagerCommand(manager, pkgRoot),
  };
}
function normalizeGlobalInstallCommand(managerOrCommand, pkgRoot) {
  return typeof managerOrCommand === "string"
    ? resolveGlobalInstallCommand(managerOrCommand, pkgRoot)
    : managerOrCommand;
}
function resolveInstallCommandForManager(managerOrCommand, manager, pkgRoot) {
  const normalized = normalizeGlobalInstallCommand(managerOrCommand, pkgRoot);
  return normalized.manager === manager
    ? normalized
    : resolveGlobalInstallCommand(manager, pkgRoot);
}
/**
 * Reads the global `node_modules` root for a package manager command.
 * Bun uses its deterministic install root because it has no `root -g` command.
 */
async function resolveGlobalRoot(managerOrCommand, runCommand, timeoutMs, pkgRoot) {
  const resolved = normalizeGlobalInstallCommand(managerOrCommand, pkgRoot);
  if (resolved.manager === "bun") return resolveBunGlobalRoot();
  const res = await runCommand([resolved.command, "root", "-g"], { timeoutMs }).catch(() => null);
  if (!res || res.code !== 0) return null;
  return res.stdout.trim() || null;
}
/**
 * Resolves the effective global install target, honoring an existing package
 * root when requested and detecting pnpm or bun layouts before command probes.
 */
async function resolveGlobalInstallTarget(params) {
  const honoredPackageRootGlobalRoot = params.honorPackageRoot
    ? inferGlobalRootFromPackageRoot(params.pkgRoot)
    : null;
  const pnpmPackageRootGlobalRoot = (await isPnpmGlobalPackageRoot(params.pkgRoot))
    ? inferPnpmGlobalRootFromPackageRoot(params.pkgRoot)
    : null;
  const bunPackageRootGlobalRoot = inferBunGlobalRootFromPackageRoot(params.pkgRoot);
  const honoredDirectNpmRoot =
    pnpmPackageRootGlobalRoot === null &&
    bunPackageRootGlobalRoot === null &&
    isDirectNpmNodeModulesRoot(honoredPackageRootGlobalRoot);
  const command = bunPackageRootGlobalRoot
    ? resolveInstallCommandForManager(params.manager, "bun", params.pkgRoot)
    : pnpmPackageRootGlobalRoot
      ? resolveInstallCommandForManager(params.manager, "pnpm", params.pkgRoot)
      : honoredDirectNpmRoot
        ? resolveInstallCommandForManager(params.manager, "npm", params.pkgRoot)
        : normalizeGlobalInstallCommand(params.manager, params.pkgRoot);
  const globalRoot = await resolveGlobalRoot(
    command,
    params.runCommand,
    params.timeoutMs,
    params.pkgRoot,
  );
  const pkgRootGlobalRoot = command.manager === "pnpm" ? pnpmPackageRootGlobalRoot : null;
  const npmPackageRootGlobalRoot =
    command.manager === "npm" && inferNpmPrefixFromPackageRoot(params.pkgRoot)
      ? inferGlobalRootFromPackageRoot(params.pkgRoot)
      : null;
  const targetGlobalRoot =
    (command.manager === "bun" ? bunPackageRootGlobalRoot : null) ??
    pkgRootGlobalRoot ??
    (command.manager === "npm" ? honoredPackageRootGlobalRoot : null) ??
    npmPackageRootGlobalRoot ??
    globalRoot;
  return {
    ...command,
    globalRoot: targetGlobalRoot,
    packageRoot: targetGlobalRoot
      ? resolvePackageRootFromGlobalRoot({
          globalRoot: targetGlobalRoot,
          packageName: params.packageName,
        })
      : null,
    ...(honoredPackageRootGlobalRoot &&
    targetGlobalRoot === honoredPackageRootGlobalRoot &&
    honoredDirectNpmRoot
      ? { directNodeModulesRoot: true }
      : {}),
  };
}
/**
 * Identifies which global package manager owns an existing package root.
 * Command probes are checked first, then pnpm/bun layout fingerprints.
 */
async function detectGlobalInstallManagerForRoot(runCommand, pkgRoot, timeoutMs) {
  const pkgReal = await tryRealpath(pkgRoot);
  for (const { manager, argv } of [
    {
      manager: "npm",
      argv: ["npm", "root", "-g"],
    },
    {
      manager: "pnpm",
      argv: ["pnpm", "root", "-g"],
    },
  ]) {
    const res = await runCommand(argv, { timeoutMs }).catch(() => null);
    if (!res || res.code !== 0) continue;
    const globalRoot = res.stdout.trim();
    if (!globalRoot) continue;
    const globalReal = await tryRealpath(globalRoot);
    for (const name of ALL_PACKAGE_NAMES) {
      const expectedReal = await tryRealpath(path.join(globalReal, name));
      if (path.resolve(expectedReal) === path.resolve(pkgReal)) return manager;
    }
  }
  if (await isPnpmGlobalPackageRoot(pkgRoot)) return "pnpm";
  const bunGlobalReal = await tryRealpath(resolveBunGlobalRoot());
  for (const name of ALL_PACKAGE_NAMES) {
    const bunExpectedReal = await tryRealpath(path.join(bunGlobalReal, name));
    if (path.resolve(bunExpectedReal) === path.resolve(pkgReal)) return "bun";
  }
  if (resolveNpmCommandBesidePackageRoot(pkgRoot)) return "npm";
  return null;
}
/**
 * Detects an installed global OpenClaw package by probing package-manager roots
 * when no trusted package root is already available.
 */
async function detectGlobalInstallManagerByPresence(runCommand, timeoutMs) {
  for (const manager of ["npm", "pnpm"]) {
    const root = await resolveGlobalRoot(manager, runCommand, timeoutMs);
    if (!root) continue;
    for (const name of ALL_PACKAGE_NAMES)
      if (await pathExists$1(path.join(root, name))) return manager;
  }
  const bunRoot = resolveBunGlobalRoot();
  for (const name of ALL_PACKAGE_NAMES)
    if (await pathExists$1(path.join(bunRoot, name))) return "bun";
  return null;
}
/**
 * Builds the primary package-manager argv for a global OpenClaw install.
 * npm receives quiet/freshness-bypass flags; pnpm source installs allow builds.
 */
function globalInstallArgs(managerOrCommand, spec, pkgRoot, installPrefix) {
  const resolved = normalizeGlobalInstallCommand(managerOrCommand, pkgRoot);
  if (resolved.manager === "pnpm")
    return [
      resolved.command,
      "add",
      "-g",
      ...(installPrefix ? ["--global-dir", installPrefix] : []),
      ...(isPnpmOpenClawSourceInstallSpec(spec) ? [PNPM_OPENCLAW_BUILD_ALLOWLIST_FLAG] : []),
      spec,
    ];
  if (resolved.manager === "bun") return [resolved.command, "add", "-g", spec];
  return [
    resolved.command,
    "i",
    "-g",
    ...(installPrefix ? ["--prefix", installPrefix] : []),
    spec,
    ...NPM_GLOBAL_INSTALL_QUIET_FLAGS,
    ...createNpmFreshnessBypassArgs(process.env, /* @__PURE__ */ new Date(), {
      npmConfigPrefix: installPrefix,
    }),
  ];
}
/**
 * Builds npm's retry argv without optional dependencies.
 * Non-npm managers have no equivalent fallback and return null.
 */
function globalInstallFallbackArgs(managerOrCommand, spec, pkgRoot, installPrefix) {
  const resolved = normalizeGlobalInstallCommand(managerOrCommand, pkgRoot);
  if (resolved.manager !== "npm") return null;
  return [
    resolved.command,
    "i",
    "-g",
    ...(installPrefix ? ["--prefix", installPrefix] : []),
    spec,
    "--omit=optional",
    ...NPM_GLOBAL_INSTALL_QUIET_FLAGS,
    ...createNpmFreshnessBypassArgs(process.env, /* @__PURE__ */ new Date(), {
      npmConfigPrefix: installPrefix,
    }),
  ];
}
/** Removes leftover hidden global package directories from interrupted renames. */
async function cleanupGlobalRenameDirs(params) {
  const removed = [];
  const root = params.globalRoot.trim();
  const name = params.packageName.trim();
  if (!root || !name) return { removed };
  const prefix = `${GLOBAL_RENAME_PREFIX}${name}-`;
  let entries;
  try {
    entries = await fs$1.readdir(root);
  } catch {
    return { removed };
  }
  for (const entry of entries) {
    if (!entry.startsWith(prefix)) continue;
    const target = path.join(root, entry);
    try {
      if (!(await fs$1.lstat(target)).isDirectory()) continue;
      await fs$1.rm(target, {
        recursive: true,
        force: true,
      });
      removed.push(entry);
    } catch {}
  }
  return { removed };
}
//#endregion
//#region src/infra/package-update-steps.ts
const PACKAGE_MANAGER_SWAP_SOURCE_HARDLINKS = "allow";
const NPM_PACK_QUIET_FLAGS = ["--json", "--loglevel=error"];
function isBlockingPackageUpdateStep(step) {
  return step.exitCode !== 0 && step.advisory === void 0;
}
function isNormalProcessExit(step) {
  return (
    step.termination !== "timeout" &&
    step.termination !== "no-output-timeout" &&
    step.termination !== "signal" &&
    step.killed !== true &&
    (step.signal === void 0 || step.signal === null)
  );
}
function markPackagePostInstallDoctorAdvisory(step, result) {
  if (step.exitCode !== 86 || result?.status !== "advisory" || !isNormalProcessExit(step))
    return step;
  const advisoryTail = [
    step.stderrTail,
    ...result.advisory.details,
    PACKAGE_POST_INSTALL_DOCTOR_ADVISORY.message,
  ]
    .filter((line) => Boolean(line?.trim()))
    .join("\n");
  return {
    ...step,
    advisory: PACKAGE_POST_INSTALL_DOCTOR_ADVISORY,
    stderrTail: trimLogTail(advisoryTail) ?? step.stderrTail,
  };
}
async function removePathBestEffort(targetPath) {
  try {
    await fs$1.rm(targetPath, {
      recursive: true,
      force: true,
      maxRetries: process.platform === "win32" ? 5 : 2,
      retryDelay: 100,
    });
    return true;
  } catch {
    return false;
  }
}
async function readPackageVersionIfPresent(packageRoot) {
  if (!packageRoot) return null;
  try {
    return await readPackageVersion(packageRoot);
  } catch {
    return null;
  }
}
function isUnambiguousNpmPrefixGlobalRoot(globalRoot) {
  const trimmed = globalRoot?.trim();
  if (!trimmed) return false;
  const normalized = path.resolve(trimmed);
  if (path.basename(normalized) !== "node_modules") return false;
  const parentDir = path.dirname(normalized);
  if (path.basename(parentDir) === "lib") return true;
  return process.platform === "win32" && path.basename(parentDir).toLowerCase() === "npm";
}
function resolveStagedNpmTargetLayout(installTarget) {
  const targetLayout = resolveNpmGlobalPrefixLayoutFromGlobalRoot(installTarget.globalRoot, {
    allowDirectNodeModulesRoot: installTarget.directNodeModulesRoot === true,
  });
  if (!targetLayout) return null;
  if (installTarget.manager === "npm" || isUnambiguousNpmPrefixGlobalRoot(installTarget.globalRoot))
    return targetLayout;
  return null;
}
function stripPackageAlias(spec, packageName) {
  const trimmed = spec.trim();
  const prefix = `${packageName.trim()}@`;
  return trimmed.toLowerCase().startsWith(prefix.toLowerCase())
    ? trimmed.slice(prefix.length).trim()
    : trimmed;
}
function isHttpGitUrlSpec(spec) {
  try {
    const url = new URL(spec);
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    const pathname = url.pathname.replace(/\/+$/u, "");
    if (pathname.endsWith(".git")) return true;
    const parts = pathname.split("/").filter(Boolean);
    return url.hostname.toLowerCase() === "github.com" && parts.length === 2;
  } catch {
    return false;
  }
}
function isGitHubShorthandSpec(spec) {
  const [repo] = spec.split("#", 1);
  if (!repo || repo.startsWith(".") || repo.startsWith("/") || repo.startsWith("@")) return false;
  const parts = repo.split("/");
  return parts.length === 2 && parts.every((part) => /^[^\s/:@]+$/u.test(part));
}
function isNpmGitSourceInstallSpec(spec, packageName) {
  const target = stripPackageAlias(spec, packageName);
  return (
    /^github:/i.test(target) ||
    /^git\+(?:ssh|https|http|file):/i.test(target) ||
    /^git:/i.test(target) ||
    /^ssh:\/\//i.test(target) ||
    /^[^@\s]+@[^:\s]+:[^#\s]+(?:#.*)?$/u.test(target) ||
    isHttpGitUrlSpec(target) ||
    isGitHubShorthandSpec(target)
  );
}
async function createStagedNpmInstall(installTarget, packageName) {
  const targetLayout = resolveStagedNpmTargetLayout(installTarget);
  if (!targetLayout) return null;
  await fs$1.mkdir(targetLayout.globalRoot, { recursive: true });
  const prefix = await fs$1.mkdtemp(path.join(targetLayout.globalRoot, ".openclaw-update-stage-"));
  const layout = resolveNpmGlobalPrefixLayoutFromPrefix(prefix);
  const command = installTarget.manager === "npm" ? installTarget.command : "npm";
  return {
    prefix,
    layout,
    packageRoot: path.join(layout.globalRoot, packageName),
    installTarget: {
      manager: "npm",
      command,
      globalRoot: layout.globalRoot,
      packageRoot: path.join(layout.globalRoot, packageName),
    },
  };
}
async function findPackedTarball(packDir) {
  const tarballs = (await fs$1.readdir(packDir).catch(() => [])).filter((entry) =>
    entry.endsWith(".tgz"),
  );
  if (tarballs.length !== 1) return null;
  return path.join(packDir, tarballs[0] ?? "");
}
async function prepareNpmGitSourceInstallSpec(params) {
  if (
    params.installTarget.manager !== "npm" ||
    !isNpmGitSourceInstallSpec(params.installSpec, params.packageName)
  )
    return {
      installSpec: params.installSpec,
      packDir: null,
      steps: [],
      failedStep: null,
    };
  const packDir = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-update-pack-"));
  const packStep = await params.runStep({
    name: "global update pack",
    argv: [
      params.installTarget.command,
      "pack",
      params.installSpec,
      "--pack-destination",
      packDir,
      ...NPM_PACK_QUIET_FLAGS,
    ],
    cwd: params.installCwd,
    env: params.env,
    timeoutMs: params.timeoutMs,
  });
  if (packStep.exitCode !== 0)
    return {
      installSpec: params.installSpec,
      packDir,
      steps: [packStep],
      failedStep: packStep,
    };
  const tarball = await findPackedTarball(packDir);
  if (!tarball) {
    const failedStep = {
      name: "global update pack verify",
      command: `find packed tarball in ${packDir}`,
      cwd: packDir,
      durationMs: 0,
      exitCode: 1,
      stdoutTail: null,
      stderrTail: `expected exactly one .tgz from npm pack ${params.installSpec}`,
    };
    return {
      installSpec: params.installSpec,
      packDir,
      steps: [packStep, failedStep],
      failedStep,
    };
  }
  return {
    installSpec: tarball,
    packDir,
    steps: [packStep],
    failedStep: null,
  };
}
async function prepareStagedNpmInstall(installTarget, packageName) {
  const startedAt = Date.now();
  try {
    return {
      stagedInstall: await createStagedNpmInstall(installTarget, packageName),
      failedStep: null,
    };
  } catch (err) {
    return {
      stagedInstall: null,
      failedStep: {
        name: "global install stage",
        command: "prepare staged npm install",
        cwd:
          (installTarget.manager === "npm"
            ? resolveNpmGlobalPrefixLayoutFromGlobalRoot(installTarget.globalRoot, {
                allowDirectNodeModulesRoot: installTarget.directNodeModulesRoot === true,
              })
            : null
          )?.prefix ??
          installTarget.globalRoot ??
          process.cwd(),
        durationMs: Date.now() - startedAt,
        exitCode: 1,
        stdoutTail: null,
        stderrTail: formatErrorMessage(err),
      },
    };
  }
}
async function cleanupStagedNpmInstall(stage) {
  if (!stage) return;
  await removePathBestEffort(stage.prefix);
}
async function copyPathEntry(source, destination) {
  const stat = await fs$1.lstat(source);
  await removePathBestEffort(destination);
  if (stat.isSymbolicLink()) {
    await fs$1.symlink(await fs$1.readlink(source), destination);
    return;
  }
  if (stat.isDirectory()) {
    await fs$1.cp(source, destination, {
      recursive: true,
      force: true,
      preserveTimestamps: false,
    });
    return;
  }
  await fs$1.copyFile(source, destination);
  await fs$1.chmod(destination, stat.mode).catch(() => void 0);
}
async function replaceNpmBinShims(params) {
  let entries;
  try {
    entries = await fs$1.readdir(params.stageLayout.binDir);
  } catch {
    return;
  }
  const names = /* @__PURE__ */ new Set([params.packageName, "openclaw"]);
  const shimEntries = entries.filter((entry) => {
    const parsed = path.parse(entry);
    return names.has(entry) || names.has(parsed.name);
  });
  if (shimEntries.length === 0) return;
  const backup = {
    backupDir: await fs$1.mkdtemp(
      path.join(params.targetLayout.globalRoot, ".openclaw-shim-backup-"),
    ),
    targetBinDir: params.targetLayout.binDir,
    entries: [],
  };
  try {
    await fs$1.mkdir(params.targetLayout.binDir, { recursive: true });
    for (const entry of shimEntries) {
      const destination = path.join(params.targetLayout.binDir, entry);
      const hadExisting = await pathExists(destination);
      backup.entries.push({
        name: entry,
        hadExisting,
      });
      if (hadExisting) await copyPathEntry(destination, path.join(backup.backupDir, entry));
    }
    for (const entry of shimEntries)
      await copyPathEntry(
        path.join(params.stageLayout.binDir, entry),
        path.join(params.targetLayout.binDir, entry),
      );
  } catch (err) {
    await restoreNpmBinShimBackup(backup);
    throw err;
  } finally {
    await removePathBestEffort(backup.backupDir);
  }
}
async function restoreNpmBinShimBackup(backup) {
  await fs$1.mkdir(backup.targetBinDir, { recursive: true });
  for (const entry of backup.entries) {
    const destination = path.join(backup.targetBinDir, entry.name);
    await removePathBestEffort(destination);
    if (entry.hadExisting)
      await copyPathEntry(path.join(backup.backupDir, entry.name), destination);
  }
}
async function swapStagedNpmInstall(params) {
  const startedAt = Date.now();
  const targetLayout = resolveNpmGlobalPrefixLayoutFromGlobalRoot(params.installTarget.globalRoot, {
    allowDirectNodeModulesRoot: params.installTarget.directNodeModulesRoot === true,
  });
  const targetPackageRoot = params.installTarget.packageRoot;
  if (!targetLayout || !targetPackageRoot)
    return {
      name: "global install swap",
      command: "swap staged npm install",
      cwd: params.stage.prefix,
      durationMs: Date.now() - startedAt,
      exitCode: 1,
      stdoutTail: null,
      stderrTail: "cannot resolve npm global prefix layout",
    };
  const backupRoot = path.join(targetLayout.globalRoot, `.openclaw-${process.pid}-${Date.now()}`);
  let movedExisting = false;
  let movedStaged = false;
  let removedBackup = true;
  try {
    await fs$1.mkdir(targetLayout.globalRoot, { recursive: true });
    if (await pathExists(targetPackageRoot)) {
      await movePathWithCopyFallback({
        from: targetPackageRoot,
        sourceHardlinks: PACKAGE_MANAGER_SWAP_SOURCE_HARDLINKS,
        to: backupRoot,
      });
      movedExisting = true;
    }
    await movePathWithCopyFallback({
      from: params.stage.packageRoot,
      sourceHardlinks: PACKAGE_MANAGER_SWAP_SOURCE_HARDLINKS,
      to: targetPackageRoot,
    });
    movedStaged = true;
    if (params.installTarget.directNodeModulesRoot !== true)
      await replaceNpmBinShims({
        stageLayout: params.stage.layout,
        targetLayout,
        packageName: params.packageName,
      });
    if (movedExisting) removedBackup = await removePathBestEffort(backupRoot);
    return {
      name: "global install swap",
      command: `swap ${params.stage.packageRoot} -> ${targetPackageRoot}`,
      cwd: targetLayout.globalRoot,
      durationMs: Date.now() - startedAt,
      exitCode: 0,
      stdoutTail: movedExisting
        ? removedBackup
          ? `replaced ${params.packageName}`
          : `replaced ${params.packageName}; preserved old package at ${backupRoot} for delayed cleanup`
        : `installed ${params.packageName}`,
      stderrTail: null,
    };
  } catch (err) {
    if (movedStaged) await removePathBestEffort(targetPackageRoot);
    if (movedExisting)
      await movePathWithCopyFallback({
        from: backupRoot,
        sourceHardlinks: PACKAGE_MANAGER_SWAP_SOURCE_HARDLINKS,
        to: targetPackageRoot,
      }).catch(() => void 0);
    return {
      name: "global install swap",
      command: `swap ${params.stage.packageRoot} -> ${targetPackageRoot}`,
      cwd: targetLayout.globalRoot,
      durationMs: Date.now() - startedAt,
      exitCode: 1,
      stdoutTail: null,
      stderrTail: formatErrorMessage(err),
    };
  }
}
/**
 * Runs the global package update flow, including npm staging when possible,
 * package verification, optional post-verification, and cleanup.
 */
async function runGlobalPackageUpdateSteps(params) {
  const installCwd = params.installCwd === void 0 ? {} : { cwd: params.installCwd };
  const installEnv = params.env === void 0 ? {} : { env: params.env };
  let stagedInstall;
  let packedInstallDir = null;
  try {
    const preparedInstall = await prepareStagedNpmInstall(params.installTarget, params.packageName);
    stagedInstall = preparedInstall.stagedInstall;
    if (preparedInstall.failedStep)
      return {
        steps: [preparedInstall.failedStep],
        verifiedPackageRoot: params.packageRoot ?? null,
        afterVersion: null,
        failedStep: preparedInstall.failedStep,
      };
    const steps = [];
    const installCommandTarget = stagedInstall?.installTarget ?? params.installTarget;
    const preparedSpec = await prepareNpmGitSourceInstallSpec({
      installTarget: installCommandTarget,
      installSpec: params.installSpec,
      packageName: params.packageName,
      runStep: params.runStep,
      timeoutMs: params.timeoutMs,
      env: params.env,
      installCwd: params.installCwd,
    });
    packedInstallDir = preparedSpec.packDir;
    steps.push(...preparedSpec.steps);
    if (preparedSpec.failedStep)
      return {
        steps,
        verifiedPackageRoot: params.packageRoot ?? null,
        afterVersion: null,
        failedStep: preparedSpec.failedStep,
      };
    const installLocation =
      stagedInstall?.prefix ??
      (installCommandTarget.manager === "pnpm"
        ? resolvePnpmGlobalDirFromGlobalRoot(installCommandTarget.globalRoot)
        : null);
    const updateStep = await params.runStep({
      name: "global update",
      argv: globalInstallArgs(
        installCommandTarget,
        preparedSpec.installSpec,
        void 0,
        installLocation,
      ),
      ...installCwd,
      ...installEnv,
      timeoutMs: params.timeoutMs,
    });
    steps.push(updateStep);
    let finalInstallStep = updateStep;
    if (updateStep.exitCode !== 0) {
      await cleanupStagedNpmInstall(stagedInstall);
      stagedInstall = null;
      const preparedFallbackInstall = await prepareStagedNpmInstall(
        params.installTarget,
        params.packageName,
      );
      stagedInstall = preparedFallbackInstall.stagedInstall;
      if (preparedFallbackInstall.failedStep) {
        steps.push(preparedFallbackInstall.failedStep);
        return {
          steps,
          verifiedPackageRoot: params.packageRoot ?? null,
          afterVersion: null,
          failedStep: preparedFallbackInstall.failedStep,
        };
      }
      const fallbackArgv = globalInstallFallbackArgs(
        stagedInstall?.installTarget ?? params.installTarget,
        preparedSpec.installSpec,
        void 0,
        stagedInstall?.prefix,
      );
      if (fallbackArgv) {
        const fallbackStep = await params.runStep({
          name: "global update (omit optional)",
          argv: fallbackArgv,
          ...installCwd,
          ...installEnv,
          timeoutMs: params.timeoutMs,
        });
        steps.push(fallbackStep);
        finalInstallStep = fallbackStep;
      } else {
        await cleanupStagedNpmInstall(stagedInstall);
        stagedInstall = null;
      }
    }
    const livePackageRoot =
      params.installTarget.packageRoot ??
      params.packageRoot ??
      (
        await resolveGlobalInstallTarget({
          manager: params.installTarget,
          runCommand: params.runCommand,
          timeoutMs: params.timeoutMs,
        })
      ).packageRoot ??
      null;
    const verificationPackageRoot = stagedInstall?.packageRoot ?? livePackageRoot;
    let verifiedPackageRoot = livePackageRoot ?? verificationPackageRoot;
    let afterVersion = null;
    if (finalInstallStep.exitCode === 0 && verificationPackageRoot) {
      const candidateVersion = await readPackageVersion(verificationPackageRoot);
      if (!stagedInstall) afterVersion = candidateVersion;
      const verificationErrors = await collectInstalledGlobalPackageErrors({
        packageRoot: verificationPackageRoot,
        expectedVersion: resolveExpectedInstalledVersionFromSpec(
          params.packageName,
          params.installSpec,
        ),
      });
      if (verificationErrors.length > 0)
        steps.push({
          name: "global install verify",
          command: `verify ${verificationPackageRoot}`,
          cwd: verificationPackageRoot,
          durationMs: 0,
          exitCode: 1,
          stderrTail: verificationErrors.join("\n"),
          stdoutTail: null,
        });
      if (stagedInstall && verificationErrors.length === 0) {
        const swapStep = await swapStagedNpmInstall({
          stage: stagedInstall,
          installTarget: params.installTarget,
          packageName: params.packageName,
        });
        steps.push(swapStep);
        if (swapStep.exitCode === 0) {
          verifiedPackageRoot = params.installTarget.packageRoot ?? verifiedPackageRoot;
          afterVersion = candidateVersion;
        }
      }
      const failedVerifyOrSwap = steps.find(
        (step) =>
          (step.name === "global install verify" || step.name === "global install swap") &&
          step.exitCode !== 0,
      );
      const postVerifyStep = failedVerifyOrSwap
        ? null
        : verifiedPackageRoot
          ? await params.postVerifyStep?.(verifiedPackageRoot)
          : null;
      if (postVerifyStep) steps.push(postVerifyStep);
      if (failedVerifyOrSwap && stagedInstall)
        afterVersion = await readPackageVersionIfPresent(livePackageRoot);
    }
    const failedStep = isBlockingPackageUpdateStep(finalInstallStep)
      ? finalInstallStep
      : (steps.find((step) => step !== updateStep && isBlockingPackageUpdateStep(step)) ?? null);
    return {
      steps,
      verifiedPackageRoot,
      afterVersion,
      failedStep,
    };
  } finally {
    await cleanupStagedNpmInstall(stagedInstall ?? null);
    if (packedInstallDir) await removePathBestEffort(packedInstallDir);
  }
}
//#endregion
//#region src/infra/update-package-manager.ts
const PNPM_NPM_FALLBACK_SPEC = "pnpm@11";
async function detectBuildManager(root) {
  return (await detectPackageManager(root)) ?? "npm";
}
function managerPreferenceOrder(preferred) {
  if (preferred === "pnpm") return ["pnpm", "npm", "bun"];
  if (preferred === "bun") return ["bun", "npm", "pnpm"];
  return ["npm", "pnpm", "bun"];
}
function managerVersionArgs(manager) {
  if (manager === "pnpm") return ["pnpm", "--version"];
  if (manager === "bun") return ["bun", "--version"];
  return ["npm", "--version"];
}
async function isManagerAvailable(runCommand, manager, timeoutMs, env) {
  try {
    return (
      (
        await runCommand(managerVersionArgs(manager), {
          timeoutMs,
          env,
        })
      ).code === 0
    );
  } catch {
    return false;
  }
}
async function isCommandAvailable(runCommand, argv, timeoutMs, env) {
  try {
    return (
      (
        await runCommand(argv, {
          timeoutMs,
          env,
        })
      ).code === 0
    );
  } catch {
    return false;
  }
}
function cloneCommandEnv(env) {
  return Object.fromEntries(
    Object.entries(env ?? process.env)
      .filter(([, value]) => value != null)
      .map(([key, value]) => [key, String(value)]),
  );
}
async function enablePnpmViaCorepack(runCommand, timeoutMs, env) {
  if (!(await isCommandAvailable(runCommand, ["corepack", "--version"], timeoutMs, env)))
    return "missing";
  try {
    if (
      (
        await runCommand(["corepack", "enable"], {
          timeoutMs,
          env,
        })
      ).code !== 0
    )
      return "failed";
  } catch {
    return "failed";
  }
  return (await isManagerAvailable(runCommand, "pnpm", timeoutMs, env)) ? "enabled" : "failed";
}
async function bootstrapPnpmViaNpm(params) {
  const tempRoot = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-update-pnpm-"));
  const cleanup = async () => {
    await fs$1
      .rm(tempRoot, {
        recursive: true,
        force: true,
      })
      .catch(() => {});
  };
  try {
    if (
      (
        await params.runCommand(["npm", "install", "--prefix", tempRoot, PNPM_NPM_FALLBACK_SPEC], {
          timeoutMs: params.timeoutMs,
          env: params.baseEnv,
        })
      ).code !== 0
    ) {
      await cleanup();
      return null;
    }
    const env = cloneCommandEnv(params.baseEnv);
    applyPathPrepend(env, [path.join(tempRoot, "node_modules", ".bin")]);
    if (!(await isManagerAvailable(params.runCommand, "pnpm", params.timeoutMs, env))) {
      await cleanup();
      return null;
    }
    return {
      env,
      cleanup,
    };
  } catch {
    await cleanup();
    return null;
  }
}
/** Resolve the package manager and environment to use for an update build. */
async function resolveUpdateBuildManager(
  runCommand,
  root,
  timeoutMs,
  baseEnv,
  requirement = "allow-fallback",
) {
  const preferred = await detectBuildManager(root);
  if (preferred === "pnpm") {
    if (await isManagerAvailable(runCommand, "pnpm", timeoutMs, baseEnv))
      return {
        kind: "resolved",
        manager: "pnpm",
        preferred,
        fallback: false,
      };
    const corepackStatus = await enablePnpmViaCorepack(runCommand, timeoutMs, baseEnv);
    if (corepackStatus === "enabled")
      return {
        kind: "resolved",
        manager: "pnpm",
        preferred,
        fallback: false,
      };
    if (await isManagerAvailable(runCommand, "npm", timeoutMs, baseEnv)) {
      const pnpmBootstrap = await bootstrapPnpmViaNpm({
        runCommand,
        timeoutMs,
        baseEnv,
      });
      if (pnpmBootstrap)
        return {
          kind: "resolved",
          manager: "pnpm",
          preferred,
          fallback: false,
          env: pnpmBootstrap.env,
          cleanup: pnpmBootstrap.cleanup,
        };
      if (requirement === "require-preferred")
        return {
          kind: "missing-required",
          preferred,
          reason: "pnpm-npm-bootstrap-failed",
        };
    }
    if (requirement === "require-preferred") {
      if (corepackStatus === "missing")
        return {
          kind: "missing-required",
          preferred,
          reason: "pnpm-corepack-missing",
        };
      if (corepackStatus === "failed")
        return {
          kind: "missing-required",
          preferred,
          reason: "pnpm-corepack-enable-failed",
        };
      return {
        kind: "missing-required",
        preferred,
        reason: "preferred-manager-unavailable",
      };
    }
  }
  for (const manager of managerPreferenceOrder(preferred))
    if (await isManagerAvailable(runCommand, manager, timeoutMs, baseEnv))
      return {
        kind: "resolved",
        manager,
        preferred,
        fallback: manager !== preferred,
      };
  if (requirement === "require-preferred")
    return {
      kind: "missing-required",
      preferred,
      reason: "preferred-manager-unavailable",
    };
  return {
    kind: "resolved",
    manager: "npm",
    preferred,
    fallback: preferred !== "npm",
  };
}
/** Build argv for running a package-manager script. */
function managerScriptArgs(manager, script, args = []) {
  if (manager === "pnpm") return ["pnpm", script, ...args];
  if (manager === "bun") return ["bun", "run", script, ...args];
  if (args.length > 0) return ["npm", "run", script, "--", ...args];
  return ["npm", "run", script];
}
/** Build argv for installing dependencies with a package manager. */
function managerInstallArgs(manager, opts) {
  if (manager === "pnpm") return ["pnpm", "install"];
  if (manager === "bun") return ["bun", "install"];
  if (opts?.compatFallback) return ["npm", "install", "--no-package-lock", "--legacy-peer-deps"];
  return ["npm", "install"];
}
/** Build argv for installing dependencies while skipping lifecycle scripts. */
function managerInstallIgnoreScriptsArgs(manager) {
  if (manager === "pnpm") return ["pnpm", "install", "--ignore-scripts"];
  if (manager === "bun") return ["bun", "install", "--ignore-scripts"];
  return ["npm", "install", "--ignore-scripts"];
}
//#endregion
//#region src/infra/update-runner.ts
function mapManagerResolutionFailure(reason) {
  return reason;
}
const DEFAULT_TIMEOUT_MS = 20 * 6e4;
const MAX_LOG_CHARS = 8e3;
const PREFLIGHT_MAX_COMMITS = 10;
const DEFAULT_PACKAGE_NAME = "openclaw";
const CORE_PACKAGE_NAMES = /* @__PURE__ */ new Set([DEFAULT_PACKAGE_NAME]);
const UPDATE_DEFER_CONFIGURED_PLUGIN_INSTALL_REPAIR_ENV =
  "OPENCLAW_UPDATE_DEFER_CONFIGURED_PLUGIN_INSTALL_REPAIR";
const UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE_ENV =
  "OPENCLAW_UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE";
const UPDATE_PARENT_SUPPORTS_GATEWAY_RESTART_ENV =
  "OPENCLAW_UPDATE_PARENT_SUPPORTS_GATEWAY_RESTART";
const UPDATE_PARENT_ALLOWS_GATEWAY_SERVICE_REPAIR_ENV =
  "OPENCLAW_UPDATE_PARENT_ALLOWS_GATEWAY_SERVICE_REPAIR";
const UPDATE_PARENT_ALLOWS_GATEWAY_ACTIVATION_ENV =
  "OPENCLAW_UPDATE_PARENT_ALLOWS_GATEWAY_ACTIVATION";
const UPDATE_DOCTOR_SERVICE_REPAIR_POLICY_ENV = "OPENCLAW_SERVICE_REPAIR_POLICY";
const EXTERNAL_SERVICE_REPAIR_POLICY_MIN_VERSION = "2026.4.25-beta.1";
const PREFLIGHT_TEMP_PREFIX =
  process.platform === "win32" ? "ocu-pf-" : "openclaw-update-preflight-";
const PREFLIGHT_WORKTREE_DIRNAME = process.platform === "win32" ? "wt" : "worktree";
const PREFLIGHT_CLEANUP_TIMEOUT_MS = 6e4;
const WINDOWS_PREFLIGHT_BASE_DIR = "ocu";
const BUILD_MAX_OLD_SPACE_MB = 8192;
const DEV_PREFLIGHT_LINT_ENV = {
  OPENCLAW_LOCAL_CHECK: "1",
  OPENCLAW_LOCAL_CHECK_MODE: "throttled",
  OPENCLAW_OXLINT_SHARDS_SERIAL: "1",
};
const DEV_PREFLIGHT_LINT_OPT_IN_ENV = "OPENCLAW_UPDATE_PREFLIGHT_LINT";
function resolveUpdateDoctorExecutionPolicy(params) {
  if (params.allowGatewayServiceRepair) return { fix: true };
  const externalPolicySupport = compareSemverStrings(
    params.targetVersion,
    EXTERNAL_SERVICE_REPAIR_POLICY_MIN_VERSION,
  );
  if (externalPolicySupport !== null && externalPolicySupport >= 0)
    return {
      fix: true,
      serviceRepairPolicy: "external",
    };
  return { fix: false };
}
function normalizeDir(value) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return path.resolve(trimmed);
}
function resolveNodeModulesBinPackageRoot(argv1) {
  const normalized = path.resolve(argv1);
  const parts = normalized.split(path.sep);
  const binIndex = parts.lastIndexOf(".bin");
  if (binIndex <= 0) return null;
  if (parts[binIndex - 1] !== "node_modules") return null;
  const binName = path.basename(normalized);
  const nodeModulesDir = parts.slice(0, binIndex).join(path.sep);
  return path.join(nodeModulesDir, binName);
}
function buildStartDirs(opts) {
  const dirs = [];
  const cwd = normalizeDir(opts.cwd);
  if (cwd) dirs.push(cwd);
  const argv1 = normalizeDir(opts.argv1);
  if (argv1) {
    dirs.push(path.dirname(argv1));
    const packageRoot = resolveNodeModulesBinPackageRoot(argv1);
    if (packageRoot) dirs.push(packageRoot);
  }
  let proc;
  try {
    proc = normalizeDir(process.cwd());
  } catch {
    proc = null;
  }
  if (proc) dirs.push(proc);
  return uniqueStrings(dirs);
}
function resolvePreflightTempRootPrefix() {
  return path.join(os.tmpdir(), PREFLIGHT_TEMP_PREFIX);
}
function resolvePreflightWorktreeDir(preflightRoot) {
  return path.join(preflightRoot, PREFLIGHT_WORKTREE_DIRNAME);
}
function shouldUseNativeWindowsTempRoot() {
  return process.platform === "win32" && path.sep === "\\";
}
async function createPreflightRoot() {
  if (shouldUseNativeWindowsTempRoot()) {
    const baseDir = path.win32.join(process.env.SystemDrive ?? "C:", WINDOWS_PREFLIGHT_BASE_DIR);
    await fs$1.mkdir(baseDir, { recursive: true });
    return fs$1.mkdtemp(path.win32.join(baseDir, PREFLIGHT_TEMP_PREFIX));
  }
  return fs$1.mkdtemp(resolvePreflightTempRootPrefix());
}
async function removePathRecursive(target) {
  await fs$1
    .rm(target, {
      recursive: true,
      force: true,
      maxRetries: 3,
      retryDelay: 200,
    })
    .catch(() => {});
}
async function repairPreflightCleanup(worktreeDir, preflightRoot) {
  try {
    await fs$1.rm(worktreeDir, {
      recursive: true,
      force: true,
      maxRetries: 3,
      retryDelay: 200,
    });
    await fs$1.rm(preflightRoot, {
      recursive: true,
      force: true,
      maxRetries: 3,
      retryDelay: 200,
    });
    return true;
  } catch {
    return false;
  }
}
async function readBranchName(runCommand, root, timeoutMs) {
  const res = await runCommand(["git", "-C", root, "rev-parse", "--abbrev-ref", "HEAD"], {
    timeoutMs,
  }).catch(() => null);
  if (!res || res.code !== 0) return null;
  return res.stdout.trim() || null;
}
async function listGitTags(runCommand, root, timeoutMs, pattern = "v*") {
  const res = await runCommand(["git", "-C", root, "tag", "--list", pattern, "--sort=-v:refname"], {
    timeoutMs,
  }).catch(() => null);
  if (!res || res.code !== 0) return [];
  return normalizeStringEntries(res.stdout.split("\n"));
}
async function resolveChannelTag(runCommand, root, timeoutMs, channel) {
  const tags = await listGitTags(runCommand, root, timeoutMs);
  if (channel === "beta") {
    const betaTag = tags.find((tag) => isBetaTag(tag)) ?? null;
    const stableTag = tags.find((tag) => isStableTag(tag)) ?? null;
    if (!betaTag) return stableTag;
    if (!stableTag) return betaTag;
    const cmp = compareSemverStrings(betaTag, stableTag);
    if (cmp != null && cmp < 0) return stableTag;
    return betaTag;
  }
  return tags.find((tag) => isStableTag(tag)) ?? null;
}
async function resolveGitRoot(runCommand, candidates, timeoutMs) {
  for (const dir of candidates) {
    const res = await runCommand(["git", "-C", dir, "rev-parse", "--show-toplevel"], {
      timeoutMs,
    }).catch(() => null);
    if (!res) continue;
    if (res.code === 0) {
      const root = res.stdout.trim();
      if (root) return root;
    }
  }
  return null;
}
async function findPackageRoot(candidates) {
  for (const dir of candidates) {
    let current = dir;
    for (let i = 0; i < 12; i += 1) {
      const pkgPath = path.join(current, "package.json");
      try {
        const raw = await fs$1.readFile(pkgPath, "utf-8");
        const name = JSON.parse(raw)?.name?.trim();
        if (name && CORE_PACKAGE_NAMES.has(name)) return current;
      } catch {}
      const parent = path.dirname(current);
      if (parent === current) break;
      current = parent;
    }
  }
  return null;
}
async function runStep(opts) {
  const { runCommand, name, argv, cwd, timeoutMs, env, progress, stepIndex, totalSteps } = opts;
  const command = argv.join(" ");
  const stepInfo = {
    name,
    command,
    index: stepIndex,
    total: totalSteps,
  };
  progress?.onStepStart?.(stepInfo);
  const started = Date.now();
  const result = await runCommand(argv, {
    cwd,
    timeoutMs,
    env,
  });
  const durationMs = Date.now() - started;
  const stderrTail = trimLogTail(result.stderr, MAX_LOG_CHARS);
  progress?.onStepComplete?.({
    ...stepInfo,
    durationMs,
    exitCode: result.code,
    stderrTail,
    signal: result.signal,
    killed: result.killed,
    termination: result.termination,
  });
  return {
    name,
    command,
    cwd,
    durationMs,
    exitCode: result.code,
    stdoutTail: trimLogTail(result.stdout, MAX_LOG_CHARS),
    stderrTail: trimLogTail(result.stderr, MAX_LOG_CHARS),
    signal: result.signal,
    killed: result.killed,
    termination: result.termination,
  };
}
function normalizeTag(tag) {
  return normalizePackageTagInput(tag, ["openclaw", DEFAULT_PACKAGE_NAME]) ?? "latest";
}
function normalizeDevTargetRef(value) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}
function looksLikeFullCommitSha(value) {
  return /^[0-9a-f]{40}$/i.test(value.trim());
}
function resolveTagFetchRef(candidate) {
  const ref = candidate.endsWith("^{}") ? candidate.slice(0, -3) : candidate;
  return ref.startsWith("refs/tags/") ? ref : null;
}
function buildDevTargetRefResolutionCandidates(devTargetRef) {
  const trimmed = devTargetRef.trim();
  const candidates = [];
  const addCandidate = (candidate) => {
    if (!candidate || candidates.includes(candidate)) return;
    candidates.push(candidate);
  };
  if (looksLikeFullCommitSha(trimmed)) {
    addCandidate(trimmed);
    return candidates;
  }
  if (trimmed.startsWith("refs/remotes/")) {
    addCandidate(trimmed);
    return candidates;
  }
  if (trimmed.startsWith("refs/heads/")) {
    addCandidate(`refs/remotes/origin/${trimmed.slice(11)}`);
    return candidates;
  }
  if (trimmed.startsWith("origin/")) {
    addCandidate(`refs/remotes/${trimmed}`);
    return candidates;
  }
  if (trimmed.startsWith("refs/tags/")) {
    addCandidate(`${trimmed}^{}`);
    addCandidate(trimmed);
    return candidates;
  }
  addCandidate(`refs/remotes/origin/${trimmed}`);
  addCandidate(`refs/tags/${trimmed}^{}`);
  addCandidate(`refs/tags/${trimmed}`);
  return candidates;
}
async function resolveComparablePath(target) {
  return await fs$1.realpath(target).catch(() => path.resolve(target));
}
async function pathsReferToSameLocation(left, right) {
  return (await resolveComparablePath(left)) === (await resolveComparablePath(right));
}
async function looksLikeGitCheckout(root) {
  try {
    await fs$1.access(path.join(root, ".git"));
    return true;
  } catch {
    return false;
  }
}
function shouldRetryWindowsInstallIgnoringScripts(manager) {
  return process.platform === "win32" && manager === "pnpm";
}
function shouldPreferIgnoreScriptsForWindowsPreflight(manager) {
  return process.platform === "win32" && manager === "pnpm";
}
function resolveBuildNodeOptions(baseOptions) {
  const current = baseOptions?.trim() ?? "";
  const desired = `--max-old-space-size=${BUILD_MAX_OLD_SPACE_MB}`;
  const existingMatch = /(?:^|\s)--max-old-space-size=(\d+)(?=\s|$)/.exec(current);
  if (!existingMatch) return current ? `${current} ${desired}` : desired;
  const existingValue = Number(existingMatch[1]);
  if (Number.isFinite(existingValue) && existingValue >= BUILD_MAX_OLD_SPACE_MB) return current;
  return current.replace(/(?:^|\s)--max-old-space-size=\d+(?=\s|$)/, ` ${desired}`).trim();
}
function resolveBuildEnv(env) {
  const currentNodeOptions = env?.NODE_OPTIONS ?? process.env.NODE_OPTIONS;
  const nextNodeOptions = resolveBuildNodeOptions(currentNodeOptions);
  if (nextNodeOptions === currentNodeOptions) return env;
  return {
    ...env,
    NODE_OPTIONS: nextNodeOptions,
  };
}
function resolveInstallEnv(manager, env) {
  if (manager !== "pnpm") return env;
  return {
    ...env,
    PNPM_CONFIG_RESOLUTION_MODE: env?.PNPM_CONFIG_RESOLUTION_MODE ?? "highest",
    npm_config_resolution_mode: env?.npm_config_resolution_mode ?? "highest",
    pnpm_config_resolution_mode: env?.pnpm_config_resolution_mode ?? "highest",
  };
}
function isSupersededInstallFailure(step, steps) {
  if (step.exitCode === 0) return false;
  if (step.name === "deps install")
    return steps.some(
      (candidate) => candidate.name === "deps install (ignore scripts)" && candidate.exitCode === 0,
    );
  const preflightMatch = /^preflight deps install \((.+)\)$/.exec(step.name);
  if (!preflightMatch) return false;
  const retryName = `preflight deps install (ignore scripts) (${preflightMatch[1]})`;
  return steps.some((candidate) => candidate.name === retryName && candidate.exitCode === 0);
}
function isPreflightCandidateFailure(step) {
  return /^preflight (?:checkout|package manager|deps install(?: \(ignore scripts\))?|build|lint) \(.+\)$/u.test(
    step.name,
  );
}
function findBlockingGitFailure(steps) {
  return steps.find(
    (step, index) =>
      step.exitCode !== 0 &&
      !isPreflightCandidateFailure(step) &&
      !isSupersededInstallFailure(step, steps) &&
      !isSupersededTargetRefFailure(step, steps.slice(index + 1)),
  );
}
function isSupersededTargetRefFailure(step, followingSteps) {
  const isTargetRefProbe = step.name.startsWith("git rev-parse ");
  const isTargetTagFetch = step.name.startsWith("git fetch ") && step.name.includes(" refs/tags/");
  const isUpstreamProbe = step.name === "upstream check";
  const isLocalDevBranchProbe = step.name === `git show-ref ${DEV_BRANCH}`;
  if (!isTargetRefProbe && !isTargetTagFetch && !isUpstreamProbe && !isLocalDevBranchProbe)
    return false;
  if (isLocalDevBranchProbe)
    return followingSteps.some(
      (candidate) => candidate.name.startsWith(`git checkout -B main `) && candidate.exitCode === 0,
    );
  return followingSteps.some(
    (candidate) => candidate.name.startsWith("git rev-parse ") && candidate.exitCode === 0,
  );
}
function mergeCommandEnvironments(baseEnv, overrideEnv) {
  if (!baseEnv) return overrideEnv;
  if (!overrideEnv) return baseEnv;
  return {
    ...baseEnv,
    ...overrideEnv,
  };
}
function shouldRunDevPreflightLint(env = process.env) {
  const value = env[DEV_PREFLIGHT_LINT_OPT_IN_ENV]?.trim().toLowerCase();
  return value === "1" || value === "true";
}
function resolveDevPreflightLintEnv(env) {
  return {
    ...env,
    ...DEV_PREFLIGHT_LINT_ENV,
  };
}
function normalizeFallbackFailureReason(stepName) {
  switch (stepName) {
    case "global update":
    case "global update (omit optional)":
    case "global install stage":
    case "global install verify":
    case "global install swap":
      return "global-install-failed";
    case "openclaw doctor":
      return "doctor-failed";
    case "ui:build (post-doctor repair)":
      return "ui-build-failed";
    default:
      return "unexpected-error";
  }
}
async function buildUpdateCommandRunner(runCommand) {
  const defaultCommandEnv = await createGlobalInstallEnv();
  if (runCommand)
    return {
      defaultCommandEnv,
      runCommand,
    };
  return {
    defaultCommandEnv,
    runCommand: async (argv, options) => {
      return await runCommandWithTimeout(argv, {
        ...options,
        env: mergeCommandEnvironments(defaultCommandEnv, options.env),
        killProcessTree: true,
      });
    },
  };
}
async function resolveUpdateInstallSurface(opts = {}) {
  const { runCommand } = await buildUpdateCommandRunner(opts.runCommand);
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const candidates = buildStartDirs(opts);
  const pkgRoot = await findPackageRoot(candidates);
  let gitRoot = await resolveGitRoot(runCommand, candidates, timeoutMs);
  if (gitRoot && pkgRoot && path.resolve(gitRoot) !== path.resolve(pkgRoot)) gitRoot = null;
  if (gitRoot && !pkgRoot)
    return {
      kind: "missing",
      mode: "unknown",
      root: gitRoot,
    };
  if (gitRoot && pkgRoot && path.resolve(gitRoot) === path.resolve(pkgRoot))
    return {
      kind: "git",
      mode: "git",
      root: gitRoot,
      packageRoot: pkgRoot,
    };
  if (!pkgRoot)
    return {
      kind: "missing",
      mode: "unknown",
    };
  const globalManager = await detectGlobalInstallManagerForRoot(runCommand, pkgRoot, timeoutMs);
  if (globalManager)
    return {
      kind: "global",
      mode: globalManager,
      root: pkgRoot,
      packageRoot: pkgRoot,
    };
  return {
    kind: "package-root",
    mode: "unknown",
    root: pkgRoot,
    packageRoot: pkgRoot,
  };
}
async function runGatewayUpdate(opts = {}) {
  const startedAt = Date.now();
  const { defaultCommandEnv, runCommand } = await buildUpdateCommandRunner(opts.runCommand);
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const progress = opts.progress;
  const steps = [];
  const candidates = buildStartDirs(opts);
  let allowGatewayServiceRepair = opts.allowGatewayServiceRepair !== false;
  let allowGatewayActivation = opts.allowGatewayActivation === true;
  let stepIndex = 0;
  let gitTotalSteps = 0;
  const step = (name, argv, cwd, env) => {
    const currentIndex = stepIndex;
    stepIndex += 1;
    return {
      runCommand,
      name,
      argv,
      cwd,
      timeoutMs,
      env,
      progress,
      stepIndex: currentIndex,
      totalSteps: gitTotalSteps,
    };
  };
  const pkgRoot = await findPackageRoot(candidates);
  let gitRoot = await resolveGitRoot(runCommand, candidates, timeoutMs);
  if (!gitRoot && pkgRoot) {
    const cwdRoot = normalizeDir(opts.cwd);
    if (
      cwdRoot &&
      (await pathsReferToSameLocation(cwdRoot, pkgRoot)) &&
      (await looksLikeGitCheckout(cwdRoot))
    )
      gitRoot = await resolveComparablePath(cwdRoot);
  }
  if (gitRoot && pkgRoot && !(await pathsReferToSameLocation(gitRoot, pkgRoot))) gitRoot = null;
  if (gitRoot && !pkgRoot)
    return {
      status: "error",
      mode: "unknown",
      root: gitRoot,
      reason: "not-openclaw-root",
      steps: [],
      durationMs: Date.now() - startedAt,
    };
  if (gitRoot && pkgRoot && (await pathsReferToSameLocation(gitRoot, pkgRoot))) {
    const channel = opts.channel ?? "dev";
    if (channel === "extended-stable")
      return {
        status: "error",
        mode: "git",
        root: gitRoot,
        reason: "unsupported_git_channel",
        steps: [],
        durationMs: Date.now() - startedAt,
      };
    const beforeSha =
      (
        await runCommand(["git", "-C", gitRoot, "rev-parse", "HEAD"], {
          cwd: gitRoot,
          timeoutMs,
        })
      ).stdout.trim() || null;
    const beforeVersion = await readPackageVersion(gitRoot);
    const devTargetRef = channel === "dev" ? normalizeDevTargetRef(opts.devTargetRef) : null;
    const branch = await readBranchName(runCommand, gitRoot, timeoutMs);
    const needsCheckoutMain = channel === "dev" && !devTargetRef && branch !== "main";
    gitTotalSteps = channel === "dev" ? (needsCheckoutMain ? 11 : 10) : 9;
    let gitMutationPrepared = false;
    let createdDevBranchDuringUpdate = false;
    let localDevBranchExists = null;
    const prepareGitMutation = async () => {
      if (gitMutationPrepared) return;
      const preparation = await opts.beforeGitMutation?.();
      if (typeof preparation?.allowGatewayServiceRepair === "boolean")
        allowGatewayServiceRepair = preparation.allowGatewayServiceRepair;
      if (typeof preparation?.allowGatewayActivation === "boolean")
        allowGatewayActivation = preparation.allowGatewayActivation;
      gitMutationPrepared = true;
    };
    const buildGitErrorResult = (reason) => ({
      status: "error",
      mode: "git",
      root: gitRoot,
      reason,
      before: {
        sha: beforeSha,
        version: beforeVersion,
      },
      steps,
      durationMs: Date.now() - startedAt,
    });
    const runRequiredGitStep = async (name, argv, reason) => {
      const gitStep = await runStep(step(name, argv, gitRoot));
      steps.push(gitStep);
      if (gitStep.exitCode !== 0) return buildGitErrorResult(reason);
      return null;
    };
    const appendRecoveryStep = async (name, argv) => {
      const started = Date.now();
      const result = await runCommand(argv, {
        cwd: gitRoot,
        timeoutMs,
      });
      const recoveryStep = {
        name,
        command: argv.join(" "),
        cwd: gitRoot,
        durationMs: Date.now() - started,
        exitCode: result.code,
        stdoutTail: trimLogTail(result.stdout, MAX_LOG_CHARS),
        stderrTail: trimLogTail(result.stderr, MAX_LOG_CHARS),
      };
      steps.push(recoveryStep);
      return recoveryStep.exitCode === 0;
    };
    const rollbackGitCheckout = async () => {
      if (!beforeSha) return;
      await appendRecoveryStep("git rollback clean", ["git", "-C", gitRoot, "reset", "--hard"]);
      if (branch && branch !== "HEAD") {
        if (
          await appendRecoveryStep("git rollback checkout", [
            "git",
            "-C",
            gitRoot,
            "checkout",
            "--force",
            branch,
          ])
        ) {
          await appendRecoveryStep("git rollback reset", [
            "git",
            "-C",
            gitRoot,
            "reset",
            "--hard",
            beforeSha,
          ]);
          if (createdDevBranchDuringUpdate)
            await appendRecoveryStep(`git rollback delete ${DEV_BRANCH}`, [
              "git",
              "-C",
              gitRoot,
              "branch",
              "-D",
              DEV_BRANCH,
            ]);
        }
        return;
      }
      await appendRecoveryStep("git rollback checkout", [
        "git",
        "-C",
        gitRoot,
        "checkout",
        "--detach",
        beforeSha,
      ]);
      if (createdDevBranchDuringUpdate)
        await appendRecoveryStep(`git rollback delete ${DEV_BRANCH}`, [
          "git",
          "-C",
          gitRoot,
          "branch",
          "-D",
          DEV_BRANCH,
        ]);
    };
    const buildGitErrorResultWithRollback = async (reason) => {
      await rollbackGitCheckout();
      return buildGitErrorResult(reason);
    };
    const statusCheck = await runStep(
      step(
        "clean check",
        ["git", "-C", gitRoot, "status", "--porcelain", "--", ":!dist/control-ui/"],
        gitRoot,
      ),
    );
    steps.push(statusCheck);
    if (statusCheck.stdoutTail && statusCheck.stdoutTail.trim().length > 0)
      return {
        status: "skipped",
        mode: "git",
        root: gitRoot,
        reason: "dirty",
        before: {
          sha: beforeSha,
          version: beforeVersion,
        },
        steps,
        durationMs: Date.now() - startedAt,
      };
    if (channel === "dev") {
      const fetchFailure = await runRequiredGitStep(
        "git fetch",
        ["git", "-C", gitRoot, "fetch", "--all", "--prune", "--no-tags"],
        "fetch-failed",
      );
      if (fetchFailure) return fetchFailure;
      let preflightBaseSha;
      let candidatesLocal;
      let selectedDevUpstream = null;
      if (devTargetRef) {
        let targetSha = null;
        for (const targetRefCandidate of buildDevTargetRefResolutionCandidates(devTargetRef)) {
          const tagFetchRef = resolveTagFetchRef(targetRefCandidate);
          if (tagFetchRef) {
            const remoteListStep = await runStep(
              step("git remote", ["git", "-C", gitRoot, "remote"], gitRoot),
            );
            steps.push(remoteListStep);
            const remotes = normalizeStringEntries((remoteListStep.stdoutTail ?? "").split("\n"));
            let fetchedTag = false;
            for (const remote of remotes) {
              const targetTagFetchStep = await runStep(
                step(
                  `git fetch ${remote} ${tagFetchRef}`,
                  ["git", "-C", gitRoot, "fetch", remote, `+${tagFetchRef}:${tagFetchRef}`],
                  gitRoot,
                ),
              );
              steps.push(targetTagFetchStep);
              if (targetTagFetchStep.exitCode === 0) {
                fetchedTag = true;
                break;
              }
            }
            if (remotes.length > 0 && !fetchedTag) continue;
          }
          const targetShaStep = await runStep(
            step(
              `git rev-parse ${targetRefCandidate}`,
              ["git", "-C", gitRoot, "rev-parse", targetRefCandidate],
              gitRoot,
            ),
          );
          steps.push(targetShaStep);
          const resolvedTargetSha = targetShaStep.stdoutTail?.trim();
          if (targetShaStep.exitCode === 0 && resolvedTargetSha) {
            targetSha = resolvedTargetSha;
            break;
          }
        }
        if (!targetSha)
          return {
            status: "error",
            mode: "git",
            root: gitRoot,
            reason: "no-target-sha",
            before: {
              sha: beforeSha,
              version: beforeVersion,
            },
            steps,
            durationMs: Date.now() - startedAt,
          };
        preflightBaseSha = targetSha;
        candidatesLocal = [targetSha];
      } else {
        if (needsCheckoutMain) {
          const localMainStep = await runStep(
            step(
              `git show-ref ${DEV_BRANCH}`,
              ["git", "-C", gitRoot, "show-ref", "--verify", `refs/heads/${DEV_BRANCH}`],
              gitRoot,
            ),
          );
          steps.push(localMainStep);
          localDevBranchExists = localMainStep.exitCode === 0;
        }
        let remoteBranchRefs = [];
        if (needsCheckoutMain && localDevBranchExists === false) {
          const remoteStep = await runStep(
            step("git remote", ["git", "-C", gitRoot, "remote"], gitRoot),
          );
          steps.push(remoteStep);
          if (remoteStep.exitCode === 0)
            remoteBranchRefs = normalizeStringEntries(
              (remoteStep.stdoutTail ?? "").split("\n"),
            ).map((remote) => `refs/remotes/${remote}/${DEV_BRANCH}`);
        }
        const upstreamRefs = needsCheckoutMain
          ? [`${DEV_BRANCH}@{upstream}`, ...remoteBranchRefs]
          : ["@{upstream}"];
        let upstreamSha = null;
        let sawResolvableUpstreamRef = false;
        for (const upstreamRef of upstreamRefs) {
          if (upstreamRef.endsWith("@{upstream}")) {
            const upstreamStep = await runStep(
              step(
                "upstream check",
                [
                  "git",
                  "-C",
                  gitRoot,
                  "rev-parse",
                  "--abbrev-ref",
                  "--symbolic-full-name",
                  upstreamRef,
                ],
                gitRoot,
              ),
            );
            steps.push(upstreamStep);
            if (upstreamStep.exitCode !== 0) continue;
            sawResolvableUpstreamRef = true;
          }
          const upstreamShaStep = await runStep(
            step(
              `git rev-parse ${upstreamRef}`,
              ["git", "-C", gitRoot, "rev-parse", upstreamRef],
              gitRoot,
            ),
          );
          steps.push(upstreamShaStep);
          const candidateSha = upstreamShaStep.stdoutTail?.trim();
          if (upstreamShaStep.exitCode === 0 && candidateSha) {
            upstreamSha = candidateSha;
            selectedDevUpstream = /^refs\/remotes\/(.+)$/u.exec(upstreamRef)?.[1] ?? null;
            break;
          }
          if (upstreamShaStep.exitCode === 0) sawResolvableUpstreamRef = true;
        }
        if (!upstreamSha && !sawResolvableUpstreamRef)
          return {
            status: "skipped",
            mode: "git",
            root: gitRoot,
            reason: "no-upstream",
            before: {
              sha: beforeSha,
              version: beforeVersion,
            },
            steps,
            durationMs: Date.now() - startedAt,
          };
        if (!upstreamSha)
          return {
            status: "error",
            mode: "git",
            root: gitRoot,
            reason: "no-upstream-sha",
            before: {
              sha: beforeSha,
              version: beforeVersion,
            },
            steps,
            durationMs: Date.now() - startedAt,
          };
        const revListStep = await runStep(
          step(
            "git rev-list",
            ["git", "-C", gitRoot, "rev-list", `--max-count=${PREFLIGHT_MAX_COMMITS}`, upstreamSha],
            gitRoot,
          ),
        );
        steps.push(revListStep);
        if (revListStep.exitCode !== 0)
          return {
            status: "error",
            mode: "git",
            root: gitRoot,
            reason: "preflight-revlist-failed",
            before: {
              sha: beforeSha,
              version: beforeVersion,
            },
            steps,
            durationMs: Date.now() - startedAt,
          };
        candidatesLocal = normalizeStringEntries((revListStep.stdoutTail ?? "").split("\n"));
        if (candidatesLocal.length === 0)
          return {
            status: "error",
            mode: "git",
            root: gitRoot,
            reason: "preflight-no-candidates",
            before: {
              sha: beforeSha,
              version: beforeVersion,
            },
            steps,
            durationMs: Date.now() - startedAt,
          };
        preflightBaseSha = upstreamSha;
      }
      if (!preflightBaseSha)
        return {
          status: "error",
          mode: "git",
          root: gitRoot,
          reason: "preflight-base-missing",
          before: {
            sha: beforeSha,
            version: beforeVersion,
          },
          steps,
          durationMs: Date.now() - startedAt,
        };
      const preflightRoot = await createPreflightRoot();
      const worktreeDir = resolvePreflightWorktreeDir(preflightRoot);
      const worktreeStep = await runStep(
        step(
          "preflight worktree",
          ["git", "-C", gitRoot, "worktree", "add", "--detach", worktreeDir, preflightBaseSha],
          gitRoot,
        ),
      );
      steps.push(worktreeStep);
      if (worktreeStep.exitCode !== 0) {
        await removePathRecursive(preflightRoot);
        return {
          status: "error",
          mode: "git",
          root: gitRoot,
          reason: "preflight-worktree-failed",
          before: {
            sha: beforeSha,
            version: beforeVersion,
          },
          steps,
          durationMs: Date.now() - startedAt,
        };
      }
      let selectedSha = null;
      let preflightManagerFailureReason = null;
      let sawNonManagerPreflightFailure = false;
      try {
        for (const sha of candidatesLocal) {
          const shortSha = sha.slice(0, 8);
          const checkoutStep = await runStep(
            step(
              `preflight checkout (${shortSha})`,
              ["git", "-C", worktreeDir, "checkout", "--detach", sha],
              worktreeDir,
            ),
          );
          steps.push(checkoutStep);
          if (checkoutStep.exitCode !== 0) {
            sawNonManagerPreflightFailure = true;
            continue;
          }
          const manager = await resolveUpdateBuildManager(
            (argv, options) =>
              runCommand(argv, {
                timeoutMs: options.timeoutMs,
                env: options.env,
              }),
            worktreeDir,
            timeoutMs,
            defaultCommandEnv,
            "require-preferred",
          );
          if (manager.kind === "missing-required") {
            preflightManagerFailureReason = mapManagerResolutionFailure(manager.reason);
            steps.push({
              name: `preflight package manager (${shortSha})`,
              command: `resolve ${manager.preferred} package manager`,
              cwd: worktreeDir,
              durationMs: 0,
              exitCode: 1,
              stderrTail: preflightManagerFailureReason,
            });
            continue;
          }
          try {
            const preflightIgnoreScripts = shouldPreferIgnoreScriptsForWindowsPreflight(
              manager.manager,
            );
            const preflightIgnoreScriptsArgv = managerInstallIgnoreScriptsArgs(manager.manager);
            const depsStepArgv =
              preflightIgnoreScripts && preflightIgnoreScriptsArgv
                ? preflightIgnoreScriptsArgv
                : managerInstallArgs(manager.manager, {
                    compatFallback: manager.fallback && manager.manager === "npm",
                  });
            const depsStepName = preflightIgnoreScripts
              ? `preflight deps install (ignore scripts) (${shortSha})`
              : `preflight deps install (${shortSha})`;
            const installEnv = resolveInstallEnv(manager.manager, manager.env);
            const depsStep = await runStep(
              step(depsStepName, depsStepArgv, worktreeDir, installEnv),
            );
            steps.push(depsStep);
            let finalDepsStep = depsStep;
            if (
              depsStep.exitCode !== 0 &&
              !preflightIgnoreScripts &&
              shouldRetryWindowsInstallIgnoringScripts(manager.manager)
            ) {
              const retryArgv = managerInstallIgnoreScriptsArgs(manager.manager);
              if (retryArgv) {
                const retryStep = await runStep(
                  step(
                    `preflight deps install (ignore scripts) (${shortSha})`,
                    retryArgv,
                    worktreeDir,
                    installEnv,
                  ),
                );
                steps.push(retryStep);
                finalDepsStep = retryStep;
              }
            }
            if (finalDepsStep.exitCode !== 0) {
              sawNonManagerPreflightFailure = true;
              continue;
            }
            const buildStep = await runStep(
              step(
                `preflight build (${shortSha})`,
                managerScriptArgs(manager.manager, "build"),
                worktreeDir,
                resolveBuildEnv(manager.env),
              ),
            );
            steps.push(buildStep);
            if (buildStep.exitCode !== 0) {
              sawNonManagerPreflightFailure = true;
              continue;
            }
            if (shouldRunDevPreflightLint()) {
              const lintStep = await runStep(
                step(
                  `preflight lint (${shortSha})`,
                  managerScriptArgs(manager.manager, "lint"),
                  worktreeDir,
                  resolveDevPreflightLintEnv(manager.env),
                ),
              );
              steps.push(lintStep);
              if (lintStep.exitCode !== 0) {
                sawNonManagerPreflightFailure = true;
                continue;
              }
            }
            selectedSha = sha;
            break;
          } finally {
            await manager.cleanup?.();
          }
        }
      } finally {
        const removeStep = await runStep({
          ...step(
            "preflight cleanup",
            ["git", "-C", gitRoot, "worktree", "remove", "--force", worktreeDir],
            gitRoot,
          ),
          timeoutMs: Math.min(timeoutMs, PREFLIGHT_CLEANUP_TIMEOUT_MS),
        });
        if (
          removeStep.exitCode !== 0 &&
          (await repairPreflightCleanup(worktreeDir, preflightRoot))
        ) {
          removeStep.exitCode = 0;
          const fallbackMessage =
            process.platform === "win32"
              ? "windows fallback cleanup removed preflight tree"
              : "fallback cleanup removed preflight tree";
          removeStep.stderrTail = trimLogTail(
            [removeStep.stderrTail, fallbackMessage].filter(Boolean).join("\n"),
            MAX_LOG_CHARS,
          );
        }
        steps.push(removeStep);
        await runCommand(["git", "-C", gitRoot, "worktree", "prune"], {
          cwd: gitRoot,
          timeoutMs,
        }).catch(() => null);
        await removePathRecursive(preflightRoot);
      }
      if (!selectedSha)
        return {
          status: "error",
          mode: "git",
          root: gitRoot,
          reason:
            preflightManagerFailureReason && !sawNonManagerPreflightFailure
              ? preflightManagerFailureReason
              : "preflight-no-good-commit",
          before: {
            sha: beforeSha,
            version: beforeVersion,
          },
          steps,
          durationMs: Date.now() - startedAt,
        };
      if (devTargetRef) {
        await prepareGitMutation();
        const failure = await runRequiredGitStep(
          `git checkout ${selectedSha}`,
          ["git", "-C", gitRoot, "checkout", "--detach", selectedSha],
          "checkout-failed",
        );
        if (failure) return failure;
      } else {
        await prepareGitMutation();
        let checkedOutSelectedSha = false;
        if (needsCheckoutMain) {
          const hasLocalDevBranch = localDevBranchExists !== false;
          const failure = await runRequiredGitStep(
            hasLocalDevBranch
              ? `git checkout ${DEV_BRANCH}`
              : `git checkout -B ${DEV_BRANCH} ${selectedSha}`,
            hasLocalDevBranch
              ? ["git", "-C", gitRoot, "checkout", DEV_BRANCH]
              : ["git", "-C", gitRoot, "checkout", "-B", DEV_BRANCH, selectedSha],
            "checkout-failed",
          );
          if (failure) return failure;
          checkedOutSelectedSha = !hasLocalDevBranch;
          createdDevBranchDuringUpdate = checkedOutSelectedSha;
          if (checkedOutSelectedSha && selectedDevUpstream) {
            if (
              await runRequiredGitStep(
                `git branch --set-upstream-to ${selectedDevUpstream} main`,
                ["git", "-C", gitRoot, "branch", "--set-upstream-to", selectedDevUpstream, "main"],
                "checkout-failed",
              )
            )
              return await buildGitErrorResultWithRollback("checkout-failed");
          }
        }
        if (checkedOutSelectedSha)
          steps.push({
            name: "git rebase",
            command: `git rebase ${selectedSha}`,
            cwd: gitRoot,
            durationMs: 0,
            exitCode: 0,
            stdoutTail: `skipped; ${DEV_BRANCH} was created at selected preflight SHA`,
          });
        else {
          const rebaseStep = await runStep(
            step("git rebase", ["git", "-C", gitRoot, "rebase", selectedSha], gitRoot),
          );
          steps.push(rebaseStep);
          if (rebaseStep.exitCode !== 0) {
            const abortResult = await runCommand(["git", "-C", gitRoot, "rebase", "--abort"], {
              cwd: gitRoot,
              timeoutMs,
            });
            steps.push({
              name: "git rebase --abort",
              command: "git rebase --abort",
              cwd: gitRoot,
              durationMs: 0,
              exitCode: abortResult.code,
              stdoutTail: trimLogTail(abortResult.stdout, MAX_LOG_CHARS),
              stderrTail: trimLogTail(abortResult.stderr, MAX_LOG_CHARS),
            });
            return {
              status: "error",
              mode: "git",
              root: gitRoot,
              reason: "rebase-failed",
              before: {
                sha: beforeSha,
                version: beforeVersion,
              },
              steps,
              durationMs: Date.now() - startedAt,
            };
          }
        }
      }
    } else {
      const fetchFailure = await runRequiredGitStep(
        "git fetch",
        ["git", "-C", gitRoot, "fetch", "--all", "--prune", "--tags"],
        "fetch-failed",
      );
      if (fetchFailure) return fetchFailure;
      const tag = await resolveChannelTag(runCommand, gitRoot, timeoutMs, channel);
      if (!tag)
        return {
          status: "error",
          mode: "git",
          root: gitRoot,
          reason: "no-release-tag",
          before: {
            sha: beforeSha,
            version: beforeVersion,
          },
          steps,
          durationMs: Date.now() - startedAt,
        };
      await prepareGitMutation();
      const failure = await runRequiredGitStep(
        `git checkout ${tag}`,
        ["git", "-C", gitRoot, "checkout", "--detach", tag],
        "checkout-failed",
      );
      if (failure) return failure;
    }
    const manager = await resolveUpdateBuildManager(
      (argv, options) =>
        runCommand(argv, {
          timeoutMs: options.timeoutMs,
          env: options.env,
        }),
      gitRoot,
      timeoutMs,
      defaultCommandEnv,
      "require-preferred",
    );
    if (manager.kind === "missing-required")
      return await buildGitErrorResultWithRollback(mapManagerResolutionFailure(manager.reason));
    try {
      const installEnv = resolveInstallEnv(manager.manager, manager.env);
      const depsStep = await runStep(
        step(
          "deps install",
          managerInstallArgs(manager.manager, {
            compatFallback: manager.fallback && manager.manager === "npm",
          }),
          gitRoot,
          installEnv,
        ),
      );
      steps.push(depsStep);
      let finalDepsStep = depsStep;
      if (depsStep.exitCode !== 0 && shouldRetryWindowsInstallIgnoringScripts(manager.manager)) {
        const retryArgv = managerInstallIgnoreScriptsArgs(manager.manager);
        if (retryArgv) {
          const retryStep = await runStep(
            step("deps install (ignore scripts)", retryArgv, gitRoot, installEnv),
          );
          steps.push(retryStep);
          finalDepsStep = retryStep;
        }
      }
      if (finalDepsStep.exitCode !== 0)
        return await buildGitErrorResultWithRollback("deps-install-failed");
      const buildStep = await runStep(
        step(
          "build",
          managerScriptArgs(manager.manager, "build"),
          gitRoot,
          resolveBuildEnv(manager.env),
        ),
      );
      steps.push(buildStep);
      if (buildStep.exitCode !== 0) return await buildGitErrorResultWithRollback("build-failed");
      const uiBuildStep = await runStep(
        step("ui:build", managerScriptArgs(manager.manager, "ui:build"), gitRoot, manager.env),
      );
      steps.push(uiBuildStep);
      if (uiBuildStep.exitCode !== 0)
        return await buildGitErrorResultWithRollback("ui-build-failed");
      const doctorEntry = path.join(gitRoot, "openclaw.mjs");
      if (
        !(await fs$1
          .stat(doctorEntry)
          .then(() => true)
          .catch(() => false))
      ) {
        steps.push({
          name: "openclaw doctor entry",
          command: `verify ${doctorEntry}`,
          cwd: gitRoot,
          durationMs: 0,
          exitCode: 1,
          stderrTail: `missing ${doctorEntry}`,
        });
        return await buildGitErrorResultWithRollback("doctor-entry-missing");
      }
      const doctorNodePath = await resolveStableNodePath(process.execPath);
      const doctorPolicy = resolveUpdateDoctorExecutionPolicy({
        targetVersion: await readPackageVersion(gitRoot),
        allowGatewayServiceRepair,
      });
      const doctorStep = await runStep(
        step(
          "openclaw doctor",
          [
            doctorNodePath,
            doctorEntry,
            "doctor",
            "--non-interactive",
            ...(doctorPolicy.fix ? ["--fix"] : []),
          ],
          gitRoot,
          {
            OPENCLAW_UPDATE_IN_PROGRESS: "1",
            [DOCTOR_DISABLE_CROSS_STATE_DIR_IMPORTS_ENV]: "1",
            ...(opts.deferConfiguredPluginInstallRepair
              ? { [UPDATE_DEFER_CONFIGURED_PLUGIN_INSTALL_REPAIR_ENV]: "1" }
              : {}),
            [UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE_ENV]: "1",
            [UPDATE_PARENT_SUPPORTS_GATEWAY_RESTART_ENV]: "1",
            [UPDATE_PARENT_ALLOWS_GATEWAY_SERVICE_REPAIR_ENV]: allowGatewayServiceRepair
              ? "1"
              : "0",
            [UPDATE_PARENT_ALLOWS_GATEWAY_ACTIVATION_ENV]: allowGatewayActivation ? "1" : "0",
            ...(doctorPolicy.serviceRepairPolicy
              ? { [UPDATE_DOCTOR_SERVICE_REPAIR_POLICY_ENV]: doctorPolicy.serviceRepairPolicy }
              : {}),
          },
        ),
      );
      steps.push(doctorStep);
      if (doctorStep.exitCode !== 0) return await buildGitErrorResultWithRollback("doctor-failed");
      if (!(await resolveControlUiDistIndexHealth({ root: gitRoot })).exists) {
        const repairArgv = managerScriptArgs(manager.manager, "ui:build");
        const started = Date.now();
        const repairResult = await runCommand(repairArgv, {
          cwd: gitRoot,
          timeoutMs,
          env: manager.env,
        });
        const repairStep = {
          name: "ui:build (post-doctor repair)",
          command: repairArgv.join(" "),
          cwd: gitRoot,
          durationMs: Date.now() - started,
          exitCode: repairResult.code,
          stdoutTail: trimLogTail(repairResult.stdout, MAX_LOG_CHARS),
          stderrTail: trimLogTail(repairResult.stderr, MAX_LOG_CHARS),
        };
        steps.push(repairStep);
        if (repairResult.code !== 0)
          return await buildGitErrorResultWithRollback("ui-build-failed");
        const repairedUiIndexHealth = await resolveControlUiDistIndexHealth({ root: gitRoot });
        if (!repairedUiIndexHealth.exists) {
          const uiIndexPath =
            repairedUiIndexHealth.indexPath ?? resolveControlUiDistIndexPathForRoot(gitRoot);
          steps.push({
            name: "ui assets verify",
            command: `verify ${uiIndexPath}`,
            cwd: gitRoot,
            durationMs: 0,
            exitCode: 1,
            stderrTail: `missing ${uiIndexPath}`,
          });
          return await buildGitErrorResultWithRollback("ui-assets-missing");
        }
      }
      const failedStep = findBlockingGitFailure(steps);
      const afterShaStep = await runStep(
        step("git rev-parse HEAD (after)", ["git", "-C", gitRoot, "rev-parse", "HEAD"], gitRoot),
      );
      steps.push(afterShaStep);
      const afterVersion = await readPackageVersion(gitRoot);
      return {
        status: failedStep ? "error" : "ok",
        mode: "git",
        root: gitRoot,
        reason: failedStep ? normalizeFallbackFailureReason(failedStep.name) : void 0,
        before: {
          sha: beforeSha,
          version: beforeVersion,
        },
        after: {
          sha: afterShaStep.stdoutTail?.trim() ?? null,
          version: afterVersion,
        },
        steps,
        durationMs: Date.now() - startedAt,
      };
    } finally {
      await manager.cleanup?.();
    }
  }
  if (!pkgRoot)
    return {
      status: "error",
      mode: "unknown",
      reason: "not-openclaw-root",
      steps: [],
      durationMs: Date.now() - startedAt,
    };
  const beforeVersion = await readPackageVersion(pkgRoot);
  const globalManager = await detectGlobalInstallManagerForRoot(runCommand, pkgRoot, timeoutMs);
  if (globalManager) {
    const channel = opts.channel ?? "stable";
    if (channel === "extended-stable" && opts.tag !== void 0)
      return {
        status: "error",
        mode: globalManager,
        root: pkgRoot,
        reason: EXTENDED_STABLE_TAG_UNSUPPORTED_REASON,
        before: { version: beforeVersion },
        steps: [],
        durationMs: Date.now() - startedAt,
      };
    const packageName = (await readPackageName(pkgRoot)) ?? DEFAULT_PACKAGE_NAME;
    const installTarget = await resolveGlobalInstallTarget({
      manager: globalManager,
      runCommand,
      timeoutMs,
      pkgRoot,
      packageName,
    });
    await cleanupGlobalRenameDirs({
      globalRoot: path.dirname(pkgRoot),
      packageName,
    });
    const extendedStable =
      channel === "extended-stable"
        ? await resolveExtendedStablePackage({
            installKind: "package",
            timeoutMs,
            packageName,
          })
        : null;
    if (extendedStable?.status === "failed")
      return {
        status: "error",
        mode: globalManager,
        root: pkgRoot,
        reason: extendedStable.reason,
        before: { version: beforeVersion },
        steps: [],
        durationMs: Date.now() - startedAt,
      };
    const tag = normalizeTag(
      extendedStable?.status === "resolved"
        ? extendedStable.version
        : (opts.tag ?? channelToNpmTag(channel)),
    );
    const globalInstallEnv = await createGlobalInstallEnv();
    const packageUpdate = await runGlobalPackageUpdateSteps({
      installTarget,
      installSpec:
        extendedStable?.status === "resolved"
          ? extendedStable.packageSpec
          : resolveGlobalInstallSpec({
              packageName,
              tag,
              env: globalInstallEnv,
            }),
      packageName,
      packageRoot: pkgRoot,
      runCommand,
      timeoutMs,
      ...(globalInstallEnv === void 0 ? {} : { env: globalInstallEnv }),
      installCwd: pkgRoot,
      runStep: (stepParams) =>
        runStep({
          runCommand,
          ...stepParams,
          cwd: stepParams.cwd ?? pkgRoot,
          progress,
          stepIndex: 0,
          totalSteps: 1,
        }),
      postVerifyStep: async (verifiedPackageRoot) => {
        const doctorEntry = await resolveGatewayInstallEntrypoint(verifiedPackageRoot);
        if (!doctorEntry) return null;
        const doctorNodePath = await resolveStableNodePath(process.execPath);
        const candidateHostVersion = await readPackageVersion(verifiedPackageRoot);
        const doctorPolicy = resolveUpdateDoctorExecutionPolicy({
          targetVersion: candidateHostVersion,
          allowGatewayServiceRepair,
        });
        return await runStep({
          runCommand,
          name: "openclaw doctor",
          argv: [
            doctorNodePath,
            doctorEntry,
            "doctor",
            "--non-interactive",
            ...(doctorPolicy.fix ? ["--fix"] : []),
          ],
          cwd: verifiedPackageRoot,
          timeoutMs,
          env: {
            OPENCLAW_UPDATE_IN_PROGRESS: "1",
            [DOCTOR_DISABLE_CROSS_STATE_DIR_IMPORTS_ENV]: "1",
            [UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE_ENV]: "1",
            [UPDATE_PARENT_SUPPORTS_GATEWAY_RESTART_ENV]: "1",
            [UPDATE_PARENT_ALLOWS_GATEWAY_SERVICE_REPAIR_ENV]: allowGatewayServiceRepair
              ? "1"
              : "0",
            [UPDATE_PARENT_ALLOWS_GATEWAY_ACTIVATION_ENV]: allowGatewayActivation ? "1" : "0",
            ...(doctorPolicy.serviceRepairPolicy
              ? { [UPDATE_DOCTOR_SERVICE_REPAIR_POLICY_ENV]: doctorPolicy.serviceRepairPolicy }
              : {}),
            ...(candidateHostVersion === null
              ? {}
              : { OPENCLAW_COMPATIBILITY_HOST_VERSION: candidateHostVersion }),
          },
          progress,
          stepIndex: 0,
          totalSteps: 1,
        });
      },
    });
    return {
      status: packageUpdate.failedStep ? "error" : "ok",
      mode: globalManager,
      root: packageUpdate.verifiedPackageRoot ?? pkgRoot,
      reason: packageUpdate.failedStep
        ? normalizeFallbackFailureReason(packageUpdate.failedStep.name)
        : void 0,
      before: { version: beforeVersion },
      after: { version: packageUpdate.afterVersion },
      steps: packageUpdate.steps,
      durationMs: Date.now() - startedAt,
    };
  }
  return {
    status: "skipped",
    mode: "unknown",
    root: pkgRoot,
    reason: "not-git-install",
    before: { version: beforeVersion },
    steps: [],
    durationMs: Date.now() - startedAt,
  };
}
//#endregion
export {
  runGlobalPackageUpdateSteps as a,
  createGlobalInstallEnv as c,
  globalInstallArgs as d,
  resolveGlobalInstallSpec as f,
  normalizePackageTagInput as h,
  markPackagePostInstallDoctorAdvisory as i,
  detectGlobalInstallManagerByPresence as l,
  resolvePnpmGlobalDirFromGlobalRoot as m,
  resolveUpdateInstallSurface as n,
  canResolveRegistryVersionForPackageTarget as o,
  resolveGlobalInstallTarget as p,
  runGatewayUpdate as r,
  cleanupGlobalRenameDirs as s,
  resolveUpdateDoctorExecutionPolicy as t,
  detectGlobalInstallManagerForRoot as u,
};
