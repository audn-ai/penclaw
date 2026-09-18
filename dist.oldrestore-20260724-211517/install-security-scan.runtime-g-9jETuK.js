import fs from "node:fs/promises";
import path from "node:path";
import "./parse-finite-number-Z7n6tXLk.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-CPEPIvCK.js";
import { n as runInstallPolicy } from "./install-policy-DzVr9APW.js";
import { o as tryReadJson } from "./json-files-CTWRDHag.js";
import "./scan-paths-Bve2UhXh.js";
import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import { n as resolveOpenClawPackageRootSync } from "./openclaw-root-DSkQ6e_8.js";
import { i as isPathInside } from "./path-DILYn_gk.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
//#region src/plugins/dependency-denylist-packages.ts
/** Canonical package names blocked from plugin dependency trees. */
const BLOCKED_INSTALL_DEPENDENCY_PACKAGE_NAMES = ["plain-crypto-js"];
//#endregion
//#region src/plugins/dependency-denylist.ts
/** Denylist checks for unsafe packages in plugin manifests and installed dependency trees. */
const BLOCKED_INSTALL_DEPENDENCY_PACKAGE_NAME_SET = new Set(
  BLOCKED_INSTALL_DEPENDENCY_PACKAGE_NAMES,
);
const BLOCKED_INSTALL_DEPENDENCY_PACKAGE_NAME_LOWER_SET = new Set(
  BLOCKED_INSTALL_DEPENDENCY_PACKAGE_NAMES.map((packageName) => packageName.toLowerCase()),
);
function isBlockedInstallDependencyPackageName(packageName) {
  return BLOCKED_INSTALL_DEPENDENCY_PACKAGE_NAME_SET.has(packageName);
}
function isBlockedInstallDependencyPackagePathName(packageName) {
  return BLOCKED_INSTALL_DEPENDENCY_PACKAGE_NAME_LOWER_SET.has(packageName.toLowerCase());
}
function normalizePathSegments(relativePath) {
  return normalizeStringEntries(relativePath.split(/[\\/]+/));
}
function parseBlockedNodeModulesPackageId(segments, packageNameSegmentTransform) {
  for (let index = 0; index < segments.length; index += 1) {
    if (segments[index]?.toLowerCase() !== "node_modules") continue;
    const packageScopeOrName = segments[index + 1];
    if (!packageScopeOrName) continue;
    if (packageScopeOrName.startsWith("@")) {
      const packageNameSegment = segments[index + 2];
      if (!packageNameSegment) continue;
      const packageName = packageNameSegmentTransform(packageNameSegment);
      if (!packageName) continue;
      const scopedPackageId = `${packageScopeOrName}/${packageName}`;
      if (!isBlockedInstallDependencyPackagePathName(scopedPackageId)) continue;
      return scopedPackageId;
    }
    const packageName = packageNameSegmentTransform(packageScopeOrName);
    if (!packageName || !isBlockedInstallDependencyPackagePathName(packageName)) continue;
    return packageName;
  }
}
function parseNpmAliasTargetPackageName(spec) {
  const normalized = spec.trim();
  if (!normalized.startsWith("npm:")) return;
  const aliasTarget = normalized.slice(4).trim();
  if (!aliasTarget) return;
  if (aliasTarget.startsWith("@")) {
    const slashIndex = aliasTarget.indexOf("/");
    if (slashIndex < 0) return;
    const versionSeparatorIndex = aliasTarget.indexOf("@", slashIndex + 1);
    return versionSeparatorIndex < 0 ? aliasTarget : aliasTarget.slice(0, versionSeparatorIndex);
  }
  const versionSeparatorIndex = aliasTarget.indexOf("@");
  return versionSeparatorIndex < 0 ? aliasTarget : aliasTarget.slice(0, versionSeparatorIndex);
}
function parsePackageNameFromOverrideSelector(selector) {
  const normalized = selector.trim();
  if (!normalized || normalized === ".") return;
  if (normalized.startsWith("@")) {
    const slashIndex = normalized.indexOf("/");
    if (slashIndex < 0) return;
    const versionSeparatorIndex = normalized.indexOf("@", slashIndex + 1);
    return versionSeparatorIndex < 0 ? normalized : normalized.slice(0, versionSeparatorIndex);
  }
  const versionSeparatorIndex = normalized.indexOf("@");
  return versionSeparatorIndex < 0 ? normalized : normalized.slice(0, versionSeparatorIndex);
}
function collectBlockedOverrideFindings(value, path = []) {
  if (typeof value === "string") {
    const aliasTargetPackageName = parseNpmAliasTargetPackageName(value);
    if (!aliasTargetPackageName) return [];
    if (!BLOCKED_INSTALL_DEPENDENCY_PACKAGE_NAME_SET.has(aliasTargetPackageName)) return [];
    return [
      {
        dependencyName: aliasTargetPackageName,
        declaredAs: path.join(" > "),
        field: "overrides",
      },
    ];
  }
  const findings = [];
  for (const [overrideKey, overrideValue] of Object.entries(value).toSorted(([left], [right]) =>
    left.localeCompare(right),
  )) {
    const overrideSelectorPackageName = parsePackageNameFromOverrideSelector(overrideKey);
    if (
      overrideSelectorPackageName &&
      BLOCKED_INSTALL_DEPENDENCY_PACKAGE_NAME_SET.has(overrideSelectorPackageName)
    )
      findings.push({
        dependencyName: overrideSelectorPackageName,
        declaredAs: [...path, overrideKey].join(" > "),
        field: "overrides",
      });
    findings.push(...collectBlockedOverrideFindings(overrideValue, [...path, overrideKey]));
  }
  return findings;
}
function isPackageOverrideObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
/** Finds blocked dependencies declared by name, alias, or override in a package manifest. */
function findBlockedManifestDependencies(manifest) {
  const findings = [];
  if (manifest.name && isBlockedInstallDependencyPackageName(manifest.name))
    findings.push({
      dependencyName: manifest.name,
      field: "name",
    });
  if (isPackageOverrideObject(manifest.overrides))
    findings.push(...collectBlockedOverrideFindings(manifest.overrides));
  for (const field of ["dependencies", "optionalDependencies", "peerDependencies"]) {
    const dependencyMap = manifest[field];
    if (!dependencyMap) continue;
    for (const [dependencyName, dependencySpec] of Object.entries(dependencyMap).toSorted(
      ([left], [right]) => left.localeCompare(right),
    )) {
      if (isBlockedInstallDependencyPackageName(dependencyName)) {
        findings.push({
          dependencyName,
          field,
        });
        continue;
      }
      const aliasTargetPackageName = parseNpmAliasTargetPackageName(dependencySpec);
      if (!aliasTargetPackageName) continue;
      if (!isBlockedInstallDependencyPackageName(aliasTargetPackageName)) continue;
      findings.push({
        dependencyName: aliasTargetPackageName,
        declaredAs: dependencyName,
        field,
      });
    }
  }
  return findings;
}
/** Finds a blocked package directory beneath a node_modules-relative path. */
function findBlockedNodeModulesDirectory(params) {
  const dependencyName = parseBlockedNodeModulesPackageId(
    normalizePathSegments(params.directoryRelativePath),
    (packageNameSegment) => packageNameSegment,
  );
  return dependencyName
    ? {
        dependencyName,
        directoryRelativePath: params.directoryRelativePath,
      }
    : void 0;
}
function parseBlockedPackageFileAliasName(fileName) {
  const extensionMatch = /^(.+)\.(js|json|node)$/i.exec(fileName);
  if (extensionMatch) return extensionMatch[1];
  if (fileName.includes(".")) return;
  return fileName;
}
/** Finds a blocked package file alias beneath a node_modules-relative path. */
function findBlockedNodeModulesFileAlias(params) {
  const dependencyName = parseBlockedNodeModulesPackageId(
    normalizePathSegments(params.fileRelativePath),
    parseBlockedPackageFileAliasName,
  );
  return dependencyName
    ? {
        dependencyName,
        fileRelativePath: params.fileRelativePath,
      }
    : void 0;
}
/** Finds a blocked package directory anywhere in a root-relative path. */
function findBlockedPackageDirectoryInPath(params) {
  const segments = normalizePathSegments(params.pathRelativeToRoot);
  for (let index = 0; index < segments.length; index += 1) {
    const packageScopeOrName = segments[index];
    if (!packageScopeOrName) continue;
    if (packageScopeOrName.startsWith("@")) {
      const packageName = segments[index + 1];
      if (!packageName) continue;
      const scopedPackageId = `${packageScopeOrName}/${packageName}`;
      if (!isBlockedInstallDependencyPackagePathName(scopedPackageId)) {
        index += 1;
        continue;
      }
      return {
        dependencyName: scopedPackageId,
        directoryRelativePath: params.pathRelativeToRoot,
      };
    }
    if (!isBlockedInstallDependencyPackagePathName(packageScopeOrName)) continue;
    return {
      dependencyName: packageScopeOrName,
      directoryRelativePath: params.pathRelativeToRoot,
    };
  }
}
/** Finds a blocked package file alias anywhere in a root-relative path. */
function findBlockedPackageFileAliasInPath(params) {
  const fileName = normalizePathSegments(params.pathRelativeToRoot).at(-1);
  if (!fileName) return;
  const dependencyName = parseBlockedPackageFileAliasName(fileName);
  if (!dependencyName || !isBlockedInstallDependencyPackagePathName(dependencyName)) return;
  return {
    dependencyName,
    fileRelativePath: params.pathRelativeToRoot,
  };
}
//#endregion
//#region src/plugins/install-policy-context.ts
function emptyBuiltinScan() {
  return {
    status: "ok",
    scannedFiles: 0,
    critical: 0,
    warn: 0,
    info: 0,
    findings: [],
  };
}
function createBeforeInstallHookPayload(params) {
  return {
    event: {
      targetType: params.targetType,
      targetName: params.targetName,
      sourcePath: params.sourcePath,
      sourcePathKind: params.sourcePathKind,
      ...(params.origin ? { origin: params.origin } : {}),
      request: params.request,
      builtinScan: params.builtinScan ?? emptyBuiltinScan(),
      ...(params.skill ? { skill: params.skill } : {}),
      ...(params.plugin ? { plugin: params.plugin } : {}),
    },
    ctx: {
      targetType: params.targetType,
      requestKind: params.request.kind,
      ...(params.origin ? { origin: params.origin } : {}),
    },
  };
}
//#endregion
//#region src/plugins/install-security-scan.runtime.ts
const FULL_GIT_COMMIT_PATTERN = /^[0-9a-f]{40}$/i;
function formatInstallPolicyWarning(finding) {
  const location = finding.file
    ? ` (${finding.file}${finding.line ? `:${finding.line}` : ""})`
    : "";
  return `Install policy: ${finding.message}${location}`;
}
const DEFAULT_PACKAGE_MANIFEST_TRAVERSAL_LIMITS = {
  maxDepth: 64,
  maxDirectories: 1e4,
  maxManifests: 1e4,
};
function buildBlockedDependencyManifestLabel(params) {
  return typeof params.manifestPackageName === "string" && params.manifestPackageName.trim()
    ? `${params.manifestPackageName.trim()} (${params.manifestRelativePath})`
    : params.manifestRelativePath;
}
function buildBlockedDependencyReason(params) {
  const manifestLabel = buildBlockedDependencyManifestLabel({
    manifestPackageName: params.manifestPackageName,
    manifestRelativePath: params.manifestRelativePath,
  });
  const findingSummary = params.findings
    .map((finding) =>
      finding.field === "name"
        ? `"${finding.dependencyName}" as package name`
        : finding.declaredAs
          ? `"${finding.dependencyName}" via alias "${finding.declaredAs}" in ${finding.field}`
          : `"${finding.dependencyName}" in ${finding.field}`,
    )
    .join(", ");
  return `${params.targetLabel} blocked: blocked dependencies ${findingSummary} declared in ${manifestLabel}.`;
}
function buildBlockedDependencyDirectoryReason(params) {
  return `${params.targetLabel} blocked: blocked dependency directory "${params.dependencyName}" declared at ${params.directoryRelativePath}.`;
}
function buildBlockedDependencyFileReason(params) {
  return `${params.targetLabel} blocked: blocked dependency file alias "${params.dependencyName}" declared at ${params.fileRelativePath}.`;
}
function pathContainsNodeModulesSegment(relativePath) {
  return relativePath
    .split(/[\\/]+/)
    .map((segment) => segment.trim().toLowerCase())
    .includes("node_modules");
}
function isPackageRootOpenClawPeerSymlink(segments) {
  return (
    (segments.length === 2 && segments[0] === "node_modules" && segments[1] === "openclaw") ||
    (segments.length === 3 &&
      segments[0] === "node_modules" &&
      segments[1] === ".bin" &&
      segments[2] === "openclaw")
  );
}
function isManagedNpmRootPackagePeerSymlink(segments) {
  if (segments[0] !== "node_modules") return false;
  const packageEndIndex = segments[1]?.startsWith("@") ? 3 : 2;
  const packageNameSegments = segments.slice(1, packageEndIndex);
  if (
    packageNameSegments.length === 0 ||
    packageNameSegments.some((segment) => !segment || segment === "." || segment === "..")
  )
    return false;
  return isPackageRootOpenClawPeerSymlink(segments.slice(packageEndIndex));
}
function isTrustedOpenClawPeerSymlink(params) {
  const segments = params.relativePath.split(/[\\/]+/);
  return (
    isPackageRootOpenClawPeerSymlink(segments) ||
    (params.allowManagedNpmRootPackagePeerSymlinks === true &&
      isManagedNpmRootPackagePeerSymlink(segments))
  );
}
async function resolveTrustedHostOpenClawRootRealPath() {
  const hostRoot = resolveOpenClawPackageRootSync({
    argv1: process.argv[1],
    cwd: process.cwd(),
    moduleUrl: import.meta.url,
  });
  if (!hostRoot) return null;
  return await fs.realpath(hostRoot).catch(() => path.resolve(hostRoot));
}
function isTrustedHostOpenClawPath(params) {
  return (
    params.trustedHostOpenClawRootRealPath !== null &&
    isPathInside(params.trustedHostOpenClawRootRealPath, params.resolvedTargetPath)
  );
}
async function inspectNodeModulesSymlinkTarget(params) {
  let resolvedTargetPath;
  try {
    resolvedTargetPath = await fs.realpath(params.symlinkPath);
  } catch (error) {
    throw new Error(
      `manifest dependency scan could not resolve symlink target ${params.symlinkRelativePath}: ${String(error)}`,
      { cause: error },
    );
  }
  if (!isPathInside(params.rootRealPath, resolvedTargetPath)) {
    if (
      isTrustedOpenClawPeerSymlink({
        allowManagedNpmRootPackagePeerSymlinks: params.allowManagedNpmRootPackagePeerSymlinks,
        relativePath: params.symlinkRelativePath,
      }) &&
      isTrustedHostOpenClawPath({
        resolvedTargetPath,
        trustedHostOpenClawRootRealPath: params.trustedHostOpenClawRootRealPath,
      })
    )
      return {};
    throw new Error(
      `manifest dependency scan found node_modules symlink target outside install root at ${params.symlinkRelativePath}`,
    );
  }
  const resolvedTargetStats = await fs.stat(resolvedTargetPath);
  const resolvedTargetRelativePath = path.relative(params.rootRealPath, resolvedTargetPath);
  return {
    blockedDirectoryFinding: findBlockedPackageDirectoryInPath({
      pathRelativeToRoot: resolvedTargetRelativePath,
    }),
    blockedFileFinding: resolvedTargetStats.isFile()
      ? findBlockedPackageFileAliasInPath({ pathRelativeToRoot: resolvedTargetRelativePath })
      : void 0,
  };
}
function readPositiveIntegerEnv(name, fallback) {
  const rawValue = process.env[name];
  if (!rawValue) return fallback;
  return parseStrictPositiveInteger(rawValue) ?? fallback;
}
function resolvePackageManifestTraversalLimits() {
  return {
    maxDepth: readPositiveIntegerEnv(
      "OPENCLAW_INSTALL_SCAN_MAX_DEPTH",
      DEFAULT_PACKAGE_MANIFEST_TRAVERSAL_LIMITS.maxDepth,
    ),
    maxDirectories: readPositiveIntegerEnv(
      "OPENCLAW_INSTALL_SCAN_MAX_DIRECTORIES",
      DEFAULT_PACKAGE_MANIFEST_TRAVERSAL_LIMITS.maxDirectories,
    ),
    maxManifests: readPositiveIntegerEnv(
      "OPENCLAW_INSTALL_SCAN_MAX_MANIFESTS",
      DEFAULT_PACKAGE_MANIFEST_TRAVERSAL_LIMITS.maxManifests,
    ),
  };
}
function isSamePathOrInside(parentPath, candidatePath) {
  return parentPath === candidatePath || isPathInside(parentPath, candidatePath);
}
function getErrnoCode(error) {
  if (typeof error !== "object" || error === null || !("code" in error)) return;
  const code = error.code;
  return typeof code === "string" ? code : void 0;
}
function isInstallScannableDependencyName(name) {
  if (name.startsWith("@")) {
    const parts = name.split("/");
    return (
      parts.length === 2 && parts.every((part) => part.length > 0 && part !== "." && part !== "..")
    );
  }
  return (
    name.length > 0 && !name.includes("/") && !name.includes("\\") && name !== "." && name !== ".."
  );
}
function collectManifestRuntimeDependencyNames(manifest) {
  const dependencyNames = /* @__PURE__ */ new Set();
  for (const dependencies of [manifest.dependencies, manifest.optionalDependencies])
    for (const dependencyName of Object.keys(dependencies ?? {}))
      if (isInstallScannableDependencyName(dependencyName)) dependencyNames.add(dependencyName);
  for (const dependencyName of Object.keys(manifest.peerDependencies ?? {}))
    if (dependencyName !== "openclaw" && isInstallScannableDependencyName(dependencyName))
      dependencyNames.add(dependencyName);
  return [...dependencyNames].toSorted((left, right) => left.localeCompare(right));
}
async function resolveInstalledPackageScanRoot(params) {
  const packageDir = path.join(params.packageDir, "node_modules", params.dependencyName);
  let stats;
  try {
    stats = await fs.stat(packageDir);
  } catch (error) {
    if (getErrnoCode(error) === "ENOENT") return;
    throw error;
  }
  if (!stats.isDirectory()) return;
  const realPath = await fs.realpath(packageDir).catch(() => path.resolve(packageDir));
  if (!isSamePathOrInside(params.boundaryRealPath, realPath))
    throw new Error(
      `installed dependency scan found package outside install root at ${packageDir}`,
    );
  return {
    packageDir,
    realPath,
  };
}
async function collectInstalledPackageScanRoots(params) {
  const limits = resolvePackageManifestTraversalLimits();
  const boundaryDir = params.dependencyScanRootDir ?? params.packageDir;
  const boundaryRealPath = await fs.realpath(boundaryDir).catch(() => path.resolve(boundaryDir));
  const packageRealPath = await fs
    .realpath(params.packageDir)
    .catch(() => path.resolve(params.packageDir));
  if (!isSamePathOrInside(boundaryRealPath, packageRealPath))
    throw new Error(
      `installed dependency scan found package outside install root at ${params.packageDir}`,
    );
  const queue = [
    {
      packageDir: params.packageDir,
      realPath: packageRealPath,
    },
  ];
  for (const packageDir of params.additionalPackageDirs ?? []) {
    const realPath = await fs.realpath(packageDir).catch(() => path.resolve(packageDir));
    if (!isSamePathOrInside(boundaryRealPath, realPath))
      throw new Error(
        `installed dependency scan found package outside install root at ${packageDir}`,
      );
    queue.push({
      packageDir,
      realPath,
    });
  }
  const visitedRealPaths = /* @__PURE__ */ new Set();
  const scanRoots = [];
  let queueIndex = 0;
  while (queueIndex < queue.length) {
    const current = queue[queueIndex];
    queueIndex += 1;
    if (!current || visitedRealPaths.has(current.realPath)) continue;
    visitedRealPaths.add(current.realPath);
    if (visitedRealPaths.size > limits.maxDirectories)
      throw new Error(
        `installed dependency scan exceeded max packages (${limits.maxDirectories}) under ${boundaryDir}`,
      );
    scanRoots.push(current.packageDir);
    const manifest = await tryReadJson(path.join(current.packageDir, "package.json"));
    if (!manifest) continue;
    for (const dependencyName of collectManifestRuntimeDependencyNames(manifest)) {
      const candidate =
        (await resolveInstalledPackageScanRoot({
          boundaryRealPath,
          dependencyName,
          packageDir: current.packageDir,
        })) ??
        (params.dependencyScanRootDir
          ? await resolveInstalledPackageScanRoot({
              boundaryRealPath,
              dependencyName,
              packageDir: params.dependencyScanRootDir,
            })
          : void 0);
      if (candidate && !visitedRealPaths.has(candidate.realPath)) queue.push(candidate);
    }
  }
  return scanRoots;
}
async function collectNonOverlappingPackageScanRoots(packageDirs) {
  const selectedRoots = [];
  for (const packageDir of packageDirs) {
    const realPath = await fs.realpath(packageDir).catch(() => path.resolve(packageDir));
    if (selectedRoots.some((selectedRoot) => isSamePathOrInside(selectedRoot.realPath, realPath)))
      continue;
    selectedRoots.push({
      packageDir,
      realPath,
    });
  }
  return selectedRoots.map((selectedRoot) => selectedRoot.packageDir);
}
async function collectPackageManifestPaths(params) {
  const limits = resolvePackageManifestTraversalLimits();
  const rootDir = params.rootDir;
  const rootRealPath = await fs.realpath(rootDir).catch(() => rootDir);
  const trustedHostOpenClawRootRealPath = await resolveTrustedHostOpenClawRootRealPath();
  const queue = [
    {
      depth: 0,
      dir: rootDir,
    },
  ];
  const packageManifestPaths = [];
  const visitedDirectories = /* @__PURE__ */ new Set();
  let firstBlockedDirectoryFinding;
  let firstBlockedFileFinding;
  let queueIndex = 0;
  while (queueIndex < queue.length) {
    const current = queue[queueIndex];
    queueIndex += 1;
    if (!current) continue;
    if (current.depth > limits.maxDepth)
      throw new Error(
        `manifest dependency scan exceeded max depth (${limits.maxDepth}) at ${current.dir}`,
      );
    const currentDir = current.dir;
    const currentRealPath = await fs.realpath(currentDir).catch(() => currentDir);
    if (visitedDirectories.has(currentRealPath)) continue;
    visitedDirectories.add(currentRealPath);
    if (visitedDirectories.size > limits.maxDirectories)
      throw new Error(
        `manifest dependency scan exceeded max directories (${limits.maxDirectories}) under ${rootDir}`,
      );
    let entries;
    try {
      entries = await fs.readdir(currentDir, {
        encoding: "utf8",
        withFileTypes: true,
      });
    } catch (error) {
      throw new Error(`manifest dependency scan could not read ${currentDir}: ${String(error)}`, {
        cause: error,
      });
    }
    for (const entry of entries.toSorted((left, right) => left.name.localeCompare(right.name))) {
      const nextPath = path.join(currentDir, entry.name);
      const relativeNextPath = path.relative(rootDir, nextPath) || entry.name;
      if (entry.isSymbolicLink()) {
        const blockedDirectoryFinding = findBlockedNodeModulesDirectory({
          directoryRelativePath: relativeNextPath,
        });
        if (blockedDirectoryFinding) firstBlockedDirectoryFinding ??= blockedDirectoryFinding;
        const blockedFileFinding = findBlockedNodeModulesFileAlias({
          fileRelativePath: relativeNextPath,
        });
        if (blockedFileFinding) firstBlockedFileFinding ??= blockedFileFinding;
        if (pathContainsNodeModulesSegment(relativeNextPath)) {
          const symlinkTargetInspection = await inspectNodeModulesSymlinkTarget({
            allowManagedNpmRootPackagePeerSymlinks: params.allowManagedNpmRootPackagePeerSymlinks,
            rootRealPath,
            symlinkPath: nextPath,
            symlinkRelativePath: relativeNextPath,
            trustedHostOpenClawRootRealPath,
          });
          if (symlinkTargetInspection.blockedDirectoryFinding)
            firstBlockedDirectoryFinding ??= symlinkTargetInspection.blockedDirectoryFinding;
          if (symlinkTargetInspection.blockedFileFinding)
            firstBlockedFileFinding ??= symlinkTargetInspection.blockedFileFinding;
        }
        continue;
      }
      if (entry.isDirectory()) {
        const blockedDirectoryFinding = findBlockedNodeModulesDirectory({
          directoryRelativePath: relativeNextPath,
        });
        if (blockedDirectoryFinding) firstBlockedDirectoryFinding ??= blockedDirectoryFinding;
        queue.push({
          depth: current.depth + 1,
          dir: nextPath,
        });
        continue;
      }
      if (entry.isFile()) {
        const blockedFileFinding = findBlockedNodeModulesFileAlias({
          fileRelativePath: relativeNextPath,
        });
        if (blockedFileFinding) firstBlockedFileFinding ??= blockedFileFinding;
      }
      if (entry.isFile() && entry.name === "package.json") {
        packageManifestPaths.push(nextPath);
        if (packageManifestPaths.length > limits.maxManifests)
          throw new Error(
            `manifest dependency scan exceeded max manifests (${limits.maxManifests}) under ${rootDir}`,
          );
      }
    }
  }
  return {
    packageManifestPaths,
    blockedDirectoryFinding: firstBlockedDirectoryFinding,
    blockedFileFinding: firstBlockedFileFinding,
  };
}
function formatPackageScanRelativePath(params) {
  if (!params.relativeRootDir) return params.relativePath;
  const packageRelativePath = path.relative(params.relativeRootDir, params.packageDir);
  return packageRelativePath
    ? path.join(packageRelativePath, params.relativePath)
    : params.relativePath;
}
async function scanPluginDependencyDenylist(params) {
  const traversalResult = await collectPackageManifestPaths({
    allowManagedNpmRootPackagePeerSymlinks: params.allowManagedNpmRootPackagePeerSymlinks,
    rootDir: params.packageDir,
  });
  for (const manifestPath of traversalResult.packageManifestPaths) {
    const manifest = await tryReadJson(manifestPath);
    if (!manifest) continue;
    const blockedDependencies = findBlockedManifestDependencies(manifest);
    if (blockedDependencies.length === 0) continue;
    const manifestRelativePath = formatPackageScanRelativePath({
      packageDir: params.packageDir,
      relativePath: path.relative(params.packageDir, manifestPath) || "package.json",
      relativeRootDir: params.relativeRootDir,
    });
    const reason = buildBlockedDependencyReason({
      findings: blockedDependencies,
      manifestPackageName: manifest.name,
      manifestRelativePath,
      targetLabel: params.targetLabel,
    });
    params.logger.warn?.(`WARNING: ${reason}`);
    return {
      blocked: {
        code: "security_scan_blocked",
        reason,
      },
    };
  }
  if (traversalResult.blockedDirectoryFinding) {
    const reason = buildBlockedDependencyDirectoryReason({
      dependencyName: traversalResult.blockedDirectoryFinding.dependencyName,
      directoryRelativePath: formatPackageScanRelativePath({
        packageDir: params.packageDir,
        relativePath: traversalResult.blockedDirectoryFinding.directoryRelativePath,
        relativeRootDir: params.relativeRootDir,
      }),
      targetLabel: params.targetLabel,
    });
    params.logger.warn?.(`WARNING: ${reason}`);
    return {
      blocked: {
        code: "security_scan_blocked",
        reason,
      },
    };
  }
  if (traversalResult.blockedFileFinding) {
    const reason = buildBlockedDependencyFileReason({
      dependencyName: traversalResult.blockedFileFinding.dependencyName,
      fileRelativePath: formatPackageScanRelativePath({
        packageDir: params.packageDir,
        relativePath: traversalResult.blockedFileFinding.fileRelativePath,
        relativeRootDir: params.relativeRootDir,
      }),
      targetLabel: params.targetLabel,
    });
    params.logger.warn?.(`WARNING: ${reason}`);
    return {
      blocked: {
        code: "security_scan_blocked",
        reason,
      },
    };
  }
}
async function runBeforeInstallHook(params) {
  const hookRunner = getGlobalHookRunner();
  if (!hookRunner?.hasHooks("before_install")) return;
  try {
    const { event, ctx } = createBeforeInstallHookPayload({
      targetName: params.targetName,
      targetType: params.targetType,
      origin: params.origin,
      sourcePath: params.sourcePath,
      sourcePathKind: params.sourcePathKind,
      request: {
        kind: params.requestKind,
        mode: params.requestMode,
        ...(params.requestedSpecifier ? { requestedSpecifier: params.requestedSpecifier } : {}),
      },
      builtinScan: params.builtinScan,
      ...(params.skill ? { skill: params.skill } : {}),
      ...(params.plugin ? { plugin: params.plugin } : {}),
    });
    const hookResult = await hookRunner.runBeforeInstall(event, ctx);
    if (hookResult?.block) {
      const reason = hookResult.blockReason || "Installation blocked by plugin hook";
      params.logger.warn?.(`WARNING: ${params.installLabel} blocked by plugin hook: ${reason}`);
      return {
        blocked: {
          code: "security_scan_blocked",
          reason,
        },
      };
    }
    if (hookResult?.findings) {
      for (const finding of hookResult.findings)
        if (finding.severity === "critical" || finding.severity === "warn")
          params.logger.warn?.(
            `Plugin scanner: ${finding.message} (${finding.file}:${finding.line})`,
          );
    }
  } catch (err) {
    const reason = `Installation blocked because before_install hook failed: ${formatErrorMessage(err)}`;
    params.logger.warn?.(
      `WARNING: ${params.installLabel} blocked by plugin hook failure: ${reason}`,
    );
    return {
      blocked: {
        code: "security_scan_failed",
        reason,
      },
    };
  }
}
function formatInstallPolicyOriginForHook(origin) {
  const type = typeof origin.type === "string" ? origin.type : "unknown";
  if (type === "upload") return "skill-upload";
  const spec = typeof origin.spec === "string" ? origin.spec : void 0;
  const slug = typeof origin.slug === "string" ? origin.slug : void 0;
  return spec ?? slug ?? type;
}
function isMutableGitOrigin(origin) {
  const ref = typeof origin?.ref === "string" ? origin.ref : void 0;
  return !FULL_GIT_COMMIT_PATTERN.test(ref ?? "");
}
function resolvePolicySource(params) {
  if (params.requestKind === "skill-install")
    switch (params.origin?.type) {
      case "clawhub":
        return {
          kind: "clawhub",
          authority: "openclaw",
          mutable: false,
          network: true,
        };
      case "git":
        return {
          kind: "git",
          authority: "third-party",
          mutable: isMutableGitOrigin(params.origin),
          network: true,
        };
      case "path":
        return {
          kind: "local-path",
          authority: "user",
          mutable: true,
          network: false,
        };
      case "upload":
        return {
          kind: "upload",
          authority: "user",
          mutable: false,
          network: false,
        };
      case "openclaw-bundled":
        return {
          kind: "bundled",
          authority: "openclaw",
          mutable: false,
          network: false,
        };
      case "openclaw-managed":
      case "openclaw-extra":
        return {
          kind: "managed",
          authority: "openclaw",
          mutable: false,
          network: false,
        };
      default:
        return {
          kind: "workspace",
          authority: "user",
          mutable: true,
          network: false,
        };
    }
  switch (params.requestKind) {
    case "plugin-archive":
      return {
        kind: "archive",
        authority: "third-party",
        mutable: true,
        network: false,
      };
    case "plugin-file":
      return {
        kind: "file",
        authority: "user",
        mutable: true,
        network: false,
      };
    case "plugin-git":
      return {
        kind: "git",
        authority: "third-party",
        mutable: true,
        network: true,
      };
    case "plugin-npm":
      return {
        kind: "npm",
        authority: "third-party",
        mutable: false,
        network: true,
      };
    case "plugin-dir":
      return {
        kind: "local-path",
        authority: "user",
        mutable: true,
        network: false,
      };
  }
  return {
    kind: "local-path",
    authority: "unknown",
    mutable: true,
    network: false,
  };
}
function shouldBypassOpenClawInstallFriction(params) {
  if (params.trustedSourceLinkedOfficialInstall === true) return true;
  const source = params.source;
  if (!source || source.mutable) return false;
  if (source.authority === "official")
    return source.kind === "clawhub" || source.kind === "git" || source.kind === "npm";
  return (
    source.authority === "openclaw" && (source.kind === "bundled" || source.kind === "managed")
  );
}
async function runOperatorInstallPolicy(params) {
  const result = await runInstallPolicy({
    config: params.config,
    logger: params.logger,
    request: {
      targetName: params.targetName,
      targetType: params.targetType,
      sourcePath: params.sourcePath,
      sourcePathKind: params.sourcePathKind,
      ...(params.source ? { source: params.source } : {}),
      origin: params.origin,
      request: {
        kind: params.requestKind,
        mode: params.requestMode,
        ...(params.requestedSpecifier ? { requestedSpecifier: params.requestedSpecifier } : {}),
      },
      ...(params.skill ? { skill: params.skill } : {}),
      ...(params.plugin ? { plugin: params.plugin } : {}),
    },
  });
  if (!result?.blocked) {
    for (const finding of result?.findings ?? [])
      if (finding.severity === "critical" || finding.severity === "warn")
        params.logger.warn?.(formatInstallPolicyWarning(finding));
    return;
  }
  return { blocked: result.blocked };
}
async function scanBundleInstallSourceRuntime(params) {
  const runPolicy = () =>
    runOperatorInstallPolicy({
      config: params.config,
      logger: params.logger,
      origin: {
        type: "plugin-bundle",
        ...(params.version ? { version: params.version } : {}),
      },
      source:
        params.source ?? resolvePolicySource({ requestKind: params.requestKind ?? "plugin-dir" }),
      sourcePath: params.sourceDir,
      sourcePathKind: "directory",
      targetName: params.pluginId,
      targetType: "plugin",
      requestKind: params.requestKind ?? "plugin-dir",
      requestMode: params.mode ?? "install",
      requestedSpecifier: params.requestedSpecifier,
      plugin: {
        contentType: "bundle",
        pluginId: params.pluginId,
        manifestId: params.pluginId,
        ...(params.version ? { version: params.version } : {}),
      },
    });
  if (shouldBypassOpenClawInstallFriction({ source: params.source })) return await runPolicy();
  const dependencyBlocked = await scanPluginDependencyDenylist({
    logger: params.logger,
    packageDir: params.sourceDir,
    targetLabel: `Bundle "${params.pluginId}" installation`,
  });
  if (dependencyBlocked) return dependencyBlocked;
  const policyResult = await runPolicy();
  if (policyResult?.blocked) return policyResult;
  return await runBeforeInstallHook({
    logger: params.logger,
    installLabel: `Bundle "${params.pluginId}" installation`,
    origin: "plugin-bundle",
    sourcePath: params.sourceDir,
    sourcePathKind: "directory",
    targetName: params.pluginId,
    targetType: "plugin",
    requestKind: params.requestKind ?? "plugin-dir",
    requestMode: params.mode ?? "install",
    requestedSpecifier: params.requestedSpecifier,
    plugin: {
      contentType: "bundle",
      pluginId: params.pluginId,
      manifestId: params.pluginId,
      ...(params.version ? { version: params.version } : {}),
    },
  });
}
async function scanPackageInstallSourceRuntime(params) {
  const runPolicy = () =>
    runOperatorInstallPolicy({
      config: params.config,
      logger: params.logger,
      origin: {
        type: "plugin-package",
        ...(params.packageName ? { packageName: params.packageName } : {}),
        ...(params.version ? { version: params.version } : {}),
      },
      source:
        params.source ?? resolvePolicySource({ requestKind: params.requestKind ?? "plugin-dir" }),
      sourcePath: params.packageDir,
      sourcePathKind: "directory",
      targetName: params.pluginId,
      targetType: "plugin",
      requestKind: params.requestKind ?? "plugin-dir",
      requestMode: params.mode ?? "install",
      requestedSpecifier: params.requestedSpecifier,
      plugin: {
        contentType: "package",
        pluginId: params.pluginId,
        ...(params.packageName ? { packageName: params.packageName } : {}),
        ...(params.manifestId ? { manifestId: params.manifestId } : {}),
        ...(params.version ? { version: params.version } : {}),
        extensions: params.extensions.slice(),
      },
    });
  if (
    shouldBypassOpenClawInstallFriction({
      source: params.source,
      trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
    })
  )
    return await runPolicy();
  const dependencyBlocked = await scanPluginDependencyDenylist({
    logger: params.logger,
    packageDir: params.packageDir,
    targetLabel: `Plugin "${params.pluginId}" installation`,
  });
  if (dependencyBlocked) return dependencyBlocked;
  const policyResult = await runPolicy();
  if (policyResult?.blocked) return policyResult;
  return await runBeforeInstallHook({
    logger: params.logger,
    installLabel: `Plugin "${params.pluginId}" installation`,
    origin: "plugin-package",
    sourcePath: params.packageDir,
    sourcePathKind: "directory",
    targetName: params.pluginId,
    targetType: "plugin",
    requestKind: params.requestKind ?? "plugin-dir",
    requestMode: params.mode ?? "install",
    requestedSpecifier: params.requestedSpecifier,
    plugin: {
      contentType: "package",
      pluginId: params.pluginId,
      ...(params.packageName ? { packageName: params.packageName } : {}),
      ...(params.manifestId ? { manifestId: params.manifestId } : {}),
      ...(params.version ? { version: params.version } : {}),
      extensions: params.extensions.slice(),
    },
  });
}
async function scanInstalledPackageDependencyTreeRuntime(params) {
  const requestKind = params.requestKind ?? "plugin-npm";
  const runPolicy = () =>
    runOperatorInstallPolicy({
      config: params.config,
      logger: params.logger,
      origin: { type: "plugin-dependency-tree" },
      source: params.source ?? resolvePolicySource({ requestKind }),
      sourcePath: params.dependencyScanRootDir ?? params.packageDir,
      sourcePathKind: "directory",
      targetName: params.pluginId,
      targetType: "plugin",
      requestKind,
      requestMode: params.mode ?? "install",
      requestedSpecifier: params.requestedSpecifier,
      plugin: {
        contentType: "dependency-tree",
        pluginId: params.pluginId,
      },
      trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
    });
  if (
    shouldBypassOpenClawInstallFriction({
      source: params.source,
      trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
    })
  )
    return await runPolicy();
  const manifestScanRoots = await collectNonOverlappingPackageScanRoots(
    await collectInstalledPackageScanRoots({
      ...(params.additionalPackageDirs
        ? { additionalPackageDirs: params.additionalPackageDirs }
        : {}),
      dependencyScanRootDir: params.dependencyScanRootDir,
      packageDir: params.packageDir,
    }),
  );
  for (const packageDir of manifestScanRoots) {
    const dependencyBlocked = await scanPluginDependencyDenylist({
      logger: params.logger,
      packageDir,
      allowManagedNpmRootPackagePeerSymlinks: params.allowManagedNpmRootPackagePeerSymlinks,
      relativeRootDir: params.dependencyScanRootDir ?? params.packageDir,
      targetLabel: `Plugin "${params.pluginId}" installation`,
    });
    if (dependencyBlocked) return dependencyBlocked;
  }
  return await runPolicy();
}
async function scanFileInstallSourceRuntime(params) {
  const policyResult = await runOperatorInstallPolicy({
    config: params.config,
    logger: params.logger,
    origin: { type: "plugin-file" },
    source: params.source ?? resolvePolicySource({ requestKind: "plugin-file" }),
    sourcePath: params.filePath,
    sourcePathKind: "file",
    targetName: params.pluginId,
    targetType: "plugin",
    requestKind: "plugin-file",
    requestMode: params.mode ?? "install",
    requestedSpecifier: params.requestedSpecifier,
    plugin: {
      contentType: "file",
      pluginId: params.pluginId,
      extensions: [path.basename(params.filePath)],
    },
  });
  if (policyResult?.blocked) return policyResult;
  return await runBeforeInstallHook({
    logger: params.logger,
    installLabel: `Plugin file "${params.pluginId}" installation`,
    origin: "plugin-file",
    sourcePath: params.filePath,
    sourcePathKind: "file",
    targetName: params.pluginId,
    targetType: "plugin",
    requestKind: "plugin-file",
    requestMode: params.mode ?? "install",
    requestedSpecifier: params.requestedSpecifier,
    plugin: {
      contentType: "file",
      pluginId: params.pluginId,
      extensions: [path.basename(params.filePath)],
    },
  });
}
async function preflightPluginNpmInstallPolicyRuntime(params) {
  const pluginId = params.pluginId ?? params.packageName;
  return await runOperatorInstallPolicy({
    config: params.config,
    logger: params.logger,
    origin: {
      type: "plugin-npm",
      packageName: params.packageName,
    },
    source: params.source ?? resolvePolicySource({ requestKind: "plugin-npm" }),
    sourcePath: params.sourcePath,
    sourcePathKind: params.sourcePathKind,
    targetName: pluginId,
    targetType: "plugin",
    requestKind: "plugin-npm",
    requestMode: params.mode ?? "install",
    requestedSpecifier: params.requestedSpecifier,
    plugin: {
      contentType: "package",
      pluginId,
      packageName: params.packageName,
    },
  });
}
async function preflightPluginGitInstallPolicyRuntime(params) {
  return await runOperatorInstallPolicy({
    config: params.config,
    logger: params.logger,
    origin: { type: "plugin-git" },
    source: params.source ?? resolvePolicySource({ requestKind: "plugin-git" }),
    sourcePath: params.sourcePath,
    sourcePathKind: "directory",
    targetName: params.pluginId,
    targetType: "plugin",
    requestKind: "plugin-git",
    requestMode: params.mode ?? "install",
    requestedSpecifier: params.requestedSpecifier,
    plugin: {
      contentType: "package",
      pluginId: params.pluginId,
    },
  });
}
async function evaluateSkillInstallPolicyRuntime(params) {
  const runPolicy = () =>
    runOperatorInstallPolicy({
      config: params.config,
      logger: params.logger,
      origin: params.origin,
      source:
        params.source ??
        resolvePolicySource({
          requestKind: "skill-install",
          origin: params.origin,
        }),
      sourcePath: params.sourceDir,
      sourcePathKind: "directory",
      targetName: params.skillName,
      targetType: "skill",
      requestKind: "skill-install",
      requestMode: params.mode ?? "install",
      requestedSpecifier: params.requestedSpecifier,
      skill: {
        installId: params.installId,
        ...(params.installSpec ? { installSpec: params.installSpec } : {}),
      },
    });
  if (shouldBypassOpenClawInstallFriction({ source: params.source })) return await runPolicy();
  const policyResult = await runPolicy();
  if (policyResult?.blocked) return policyResult;
  return await runBeforeInstallHook({
    logger: params.logger,
    installLabel: `Skill "${params.skillName}" installation`,
    origin: formatInstallPolicyOriginForHook(params.origin),
    sourcePath: params.sourceDir,
    sourcePathKind: "directory",
    targetName: params.skillName,
    targetType: "skill",
    requestKind: "skill-install",
    requestMode: params.mode ?? "install",
    requestedSpecifier: params.requestedSpecifier,
    skill: {
      installId: params.installId,
      ...(params.installSpec ? { installSpec: params.installSpec } : {}),
    },
  });
}
//#endregion
export {
  evaluateSkillInstallPolicyRuntime,
  preflightPluginGitInstallPolicyRuntime,
  preflightPluginNpmInstallPolicyRuntime,
  scanBundleInstallSourceRuntime,
  scanFileInstallSourceRuntime,
  scanInstalledPackageDependencyTreeRuntime,
  scanPackageInstallSourceRuntime,
};
