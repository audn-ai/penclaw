import fs from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import {
  a as resolveDefaultPluginNpmDir,
  d as resolvePluginNpmProjectsDir,
} from "./install-paths-CqMnrXsY.js";
import { o as safePathSegmentHashed } from "./install-safe-path-EhqVsq3P.js";
//#region src/plugins/npm-project-roots.ts
function isMissing(error) {
  return error.code === "ENOENT";
}
function sortPaths(paths) {
  return paths.toSorted((left, right) => left.localeCompare(right));
}
/** Lists project-level npm roots managed below the plugin npm root. */
function listManagedPluginNpmProjectRootsSync(npmRoot) {
  const projectsDir = resolvePluginNpmProjectsDir(npmRoot);
  try {
    return sortPaths(
      fs
        .readdirSync(projectsDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => path.join(projectsDir, entry.name)),
    );
  } catch (error) {
    if (isMissing(error)) return [];
    throw error;
  }
}
/** Async variant of project-level managed npm root discovery. */
async function listManagedPluginNpmProjectRoots(npmRoot) {
  const projectsDir = resolvePluginNpmProjectsDir(npmRoot);
  try {
    return sortPaths(
      (await fs$1.readdir(projectsDir, { withFileTypes: true }))
        .filter((entry) => entry.isDirectory())
        .map((entry) => path.join(projectsDir, entry.name)),
    );
  } catch (error) {
    if (isMissing(error)) return [];
    throw error;
  }
}
/** Returns the root npm install plus all managed project npm roots. */
function listManagedPluginNpmRootsSync(npmRoot) {
  return [npmRoot, ...listManagedPluginNpmProjectRootsSync(npmRoot)];
}
/** Async variant of managed npm root discovery. */
async function listManagedPluginNpmRoots(npmRoot) {
  return [npmRoot, ...(await listManagedPluginNpmProjectRoots(npmRoot))];
}
//#endregion
//#region src/plugins/managed-npm-retention.ts
const RETAINED_MANAGED_NPM_INSTALL_MARKER_DIR = ".openclaw-retained-npm-installs";
function resolveRetainedManagedNpmInstallPackageInfo(packageDir) {
  const resolvedPackageDir = path.resolve(packageDir);
  const packageBase = path.basename(resolvedPackageDir);
  const parentDir = path.dirname(resolvedPackageDir);
  const parentBase = path.basename(parentDir);
  const scopedPackage = parentBase.startsWith("@");
  const nodeModulesRoot = scopedPackage ? path.dirname(parentDir) : parentDir;
  if (path.basename(nodeModulesRoot) !== "node_modules") return null;
  const packageName = scopedPackage ? `${parentBase}/${packageBase}` : packageBase;
  if (!packageBase || packageBase === "." || !packageName.trim()) return null;
  const projectRoot = path.dirname(nodeModulesRoot);
  return {
    packageName,
    projectRoot,
    markerPath: path.join(
      projectRoot,
      RETAINED_MANAGED_NPM_INSTALL_MARKER_DIR,
      `${safePathSegmentHashed(packageName)}.json`,
    ),
  };
}
function resolveRetainedManagedNpmInstallMarkerPath(packageDir) {
  const info = resolveRetainedManagedNpmInstallPackageInfo(packageDir);
  if (!info)
    throw new Error("retained npm install marker requires a node_modules package directory");
  return info.markerPath;
}
function hasRetainedManagedNpmInstallMarker(packageDir) {
  const info = resolveRetainedManagedNpmInstallPackageInfo(packageDir);
  return info ? fs.existsSync(info.markerPath) : false;
}
async function clearRetainedManagedNpmInstallMarker(packageDir) {
  const info = resolveRetainedManagedNpmInstallPackageInfo(packageDir);
  if (!info) return false;
  try {
    await fs.promises.rm(info.markerPath, { force: true });
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
  try {
    await fs.promises.rmdir(path.dirname(info.markerPath));
  } catch {}
  return true;
}
async function markRetainedManagedNpmInstall(params) {
  const info = resolveRetainedManagedNpmInstallPackageInfo(params.packageDir);
  if (!info) return false;
  let stat;
  try {
    stat = await fs.promises.stat(params.packageDir);
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
  if (!stat.isDirectory()) return false;
  await fs.promises.mkdir(path.dirname(info.markerPath), { recursive: true });
  await fs.promises.writeFile(
    info.markerPath,
    `${JSON.stringify(
      {
        version: 1,
        pluginId: params.pluginId,
        retainedAt: params.retainedAt ?? /* @__PURE__ */ new Date().toISOString(),
        reason: params.reason,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
  return true;
}
function isPathEqualOrInside(parentPath, childPath) {
  const relative = path.relative(path.resolve(parentPath), path.resolve(childPath));
  return relative === "" || (relative !== ".." && !relative.startsWith(`..${path.sep}`));
}
function listManagedNpmPackageDirs(npmRoot) {
  const nodeModulesDir = path.join(npmRoot, "node_modules");
  let entries;
  try {
    entries = fs.readdirSync(nodeModulesDir, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
  return entries.flatMap((entry) => {
    if (!entry.isDirectory()) return [];
    if (!entry.name.startsWith("@")) return [path.join(nodeModulesDir, entry.name)];
    return fs
      .readdirSync(path.join(nodeModulesDir, entry.name), { withFileTypes: true })
      .filter((scopedEntry) => scopedEntry.isDirectory())
      .map((scopedEntry) => path.join(nodeModulesDir, entry.name, scopedEntry.name));
  });
}
async function cleanupRetainedLegacyNpmPackages(params) {
  let removed = 0;
  for (const packageDir of listManagedNpmPackageDirs(params.npmRoot)) {
    if (
      !hasRetainedManagedNpmInstallMarker(packageDir) ||
      params.activeInstallPaths.some((installPath) => isPathEqualOrInside(packageDir, installPath))
    )
      continue;
    try {
      await fs.promises.rm(packageDir, {
        recursive: true,
        force: true,
      });
      await clearRetainedManagedNpmInstallMarker(packageDir);
      removed += 1;
    } catch (error) {
      params.onError?.(error, packageDir);
    }
  }
  return removed;
}
async function cleanupRetainedManagedNpmInstallGenerations(params = {}) {
  const npmDir = params.npmDir ?? resolveDefaultPluginNpmDir(params.env);
  const projectsDir = resolvePluginNpmProjectsDir(npmDir);
  const activeInstallPaths = Array.from(params.activeInstallPaths ?? [], (installPath) =>
    path.resolve(installPath),
  );
  let removed = 0;
  for (const projectRoot of listManagedPluginNpmRootsSync(npmDir)) {
    if (path.resolve(projectRoot) === path.resolve(npmDir)) {
      removed += await cleanupRetainedLegacyNpmPackages({
        npmRoot: projectRoot,
        activeInstallPaths,
        onError: params.onError,
      });
      continue;
    }
    const markerDir = path.join(projectRoot, RETAINED_MANAGED_NPM_INSTALL_MARKER_DIR);
    let markerEntries;
    try {
      markerEntries = fs
        .readdirSync(markerDir, { withFileTypes: true })
        .filter((entry) => entry.isFile());
    } catch (error) {
      if (error.code === "ENOENT") continue;
      params.onError?.(error, projectRoot);
      continue;
    }
    if (
      markerEntries.length === 0 ||
      !isPathEqualOrInside(projectsDir, projectRoot) ||
      activeInstallPaths.some((installPath) => isPathEqualOrInside(projectRoot, installPath))
    )
      continue;
    try {
      await fs.promises.rm(projectRoot, {
        recursive: true,
        force: true,
      });
      removed += 1;
    } catch (error) {
      params.onError?.(error, projectRoot);
    }
  }
  return removed;
}
//#endregion
export {
  resolveRetainedManagedNpmInstallMarkerPath as a,
  listManagedPluginNpmRoots as c,
  markRetainedManagedNpmInstall as i,
  listManagedPluginNpmRootsSync as l,
  clearRetainedManagedNpmInstallMarker as n,
  resolveRetainedManagedNpmInstallPackageInfo as o,
  hasRetainedManagedNpmInstallMarker as r,
  listManagedPluginNpmProjectRootsSync as s,
  cleanupRetainedManagedNpmInstallGenerations as t,
};
