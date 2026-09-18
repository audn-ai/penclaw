import fs from "node:fs/promises";
import path from "node:path";
import { c as resolvePackedRootDir, t as extractArchive } from "./archive-CR1500gV.js";
import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import { v as pathExists } from "./fs-safe-RNq3oO57.js";
import "./utils-DtcDeqWS.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { r as assertCanonicalPathWithinBase } from "./install-safe-path-EhqVsq3P.js";
import { s as withTempDir } from "./install-source-utils-Cvk6wk9f.js";
import { l as writeJson } from "./json-7OTJmMaB.js";
import "./archive-CBe_wA_B.js";
import { o as tryReadJson } from "./json-files-CTWRDHag.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { t as movePathWithCopyFallback } from "./replace-file-CaPU6XwS.js";
import {
  n as createSafeNpmInstallEnv,
  t as createSafeNpmInstallArgs,
} from "./safe-package-install-CCGE7D0Q.js";
//#region src/infra/install-flow.ts
/** Resolve and stat a user-provided install path. */
async function resolveExistingInstallPath(inputPath) {
  const resolvedPath = resolveUserPath(inputPath);
  if (!(await pathExists(resolvedPath)))
    return {
      ok: false,
      error: `path not found: ${resolvedPath}`,
    };
  return {
    ok: true,
    resolvedPath,
    stat: await fs.stat(resolvedPath),
  };
}
/** Extract an archive to a temp dir and run work against the detected package root. */
async function withExtractedArchiveRoot(params) {
  return await withTempDir(params.tempDirPrefix, async (tmpDir) => {
    const extractDir = path.join(tmpDir, "extract");
    await fs.mkdir(extractDir, { recursive: true });
    params.logger?.info?.(`Extracting ${params.archivePath}…`);
    try {
      await extractArchive({
        archivePath: params.archivePath,
        destDir: extractDir,
        timeoutMs: params.timeoutMs,
        logger: params.logger,
      });
    } catch (err) {
      return {
        ok: false,
        error: `failed to extract archive: ${String(err)}`,
      };
    }
    let rootDir;
    try {
      rootDir = await resolvePackedRootDir(extractDir, {
        rootMarkers: params.rootMarkers ? [...params.rootMarkers] : void 0,
      });
    } catch (err) {
      return {
        ok: false,
        error: String(err),
      };
    }
    return await params.onExtracted(rootDir);
  });
}
//#endregion
//#region src/infra/install-package-dir.ts
const DEFAULT_INSTALL_SOURCE_HARDLINKS = "reject";
const INSTALL_BASE_CHANGED_ERROR_MESSAGE = "install base directory changed during install";
const INSTALL_BASE_CHANGED_ABORT_WARNING =
  "Install base directory changed during install; aborting staged publish.";
const INSTALL_BASE_CHANGED_BACKUP_WARNING =
  "Install base directory changed before backup cleanup; leaving backup in place.";
const STAGED_NPM_PROJECT_CONFIG_NAME = ".npmrc";
const STAGED_NPM_PROJECT_CONFIG_PREFIX = ".openclaw-install-hidden-npmrc-";
async function sanitizeManifestForNpmInstall(targetDir) {
  const manifestPath = path.join(targetDir, "package.json");
  const parsed = await tryReadJson(manifestPath);
  if (!isRecord(parsed)) return;
  const manifest = parsed;
  const devDependencies = manifest.devDependencies;
  if (!isRecord(devDependencies)) return;
  const filteredEntries = Object.entries(devDependencies).filter(([, rawSpec]) => {
    return !(typeof rawSpec === "string" ? rawSpec.trim() : "").startsWith("workspace:");
  });
  if (filteredEntries.length === Object.keys(devDependencies).length) return;
  if (filteredEntries.length === 0) delete manifest.devDependencies;
  else manifest.devDependencies = Object.fromEntries(filteredEntries);
  await writeJson(manifestPath, manifest, { trailingNewline: true });
}
function formatNpmDependencyInstallFailure(result) {
  const detail = result.stderr.trim() || result.stdout.trim();
  if (detail) return detail;
  if (result.code !== null) return `exit code ${result.code} (no output from npm)`;
  if (result.signal) return `signal ${result.signal} (no output from npm)`;
  return `termination ${result.termination} (no output from npm)`;
}
async function hideProjectNpmConfigForInstall(targetDir) {
  const originalPath = path.join(targetDir, STAGED_NPM_PROJECT_CONFIG_NAME);
  let hiddenDir = "";
  try {
    hiddenDir = await fs.mkdtemp(path.join(targetDir, STAGED_NPM_PROJECT_CONFIG_PREFIX));
    const hiddenPath = path.join(hiddenDir, STAGED_NPM_PROJECT_CONFIG_NAME);
    await fs.rename(originalPath, hiddenPath);
    return {
      hiddenDir,
      originalPath,
      hiddenPath,
    };
  } catch (error) {
    if (hiddenDir)
      await fs
        .rm(hiddenDir, {
          recursive: true,
          force: true,
        })
        .catch(() => void 0);
    if (error.code === "ENOENT") return null;
    throw error;
  }
}
async function restoreProjectNpmConfigAfterInstall(hiddenConfig) {
  if (!hiddenConfig) return;
  await fs.rename(hiddenConfig.hiddenPath, hiddenConfig.originalPath);
  await fs.rm(hiddenConfig.hiddenDir, {
    recursive: true,
    force: true,
  });
}
async function assertInstallBoundaryPaths(params) {
  for (const candidatePath of params.candidatePaths)
    await assertCanonicalPathWithinBase({
      baseDir: params.installBaseDir,
      candidatePath,
      boundaryLabel: "install directory",
    });
}
function isRelativePathInsideBase(relativePath) {
  return (
    Boolean(relativePath) && relativePath !== ".." && !relativePath.startsWith(`..${path.sep}`)
  );
}
function isInstallBaseChangedError(error) {
  return error instanceof Error && error.message === INSTALL_BASE_CHANGED_ERROR_MESSAGE;
}
function resolveMoveSourceHardlinks(policy) {
  return policy === "package-manager" ? "allow" : "reject";
}
async function assertInstallBaseStable(params) {
  if (!(await fs.stat(params.installBaseDir)).isDirectory())
    throw new Error(INSTALL_BASE_CHANGED_ERROR_MESSAGE);
  if ((await fs.realpath(params.installBaseDir)) !== params.expectedRealPath)
    throw new Error(INSTALL_BASE_CHANGED_ERROR_MESSAGE);
}
async function cleanupInstallTempDir(dirPath) {
  if (!dirPath) return;
  await fs
    .rm(dirPath, {
      recursive: true,
      force: true,
    })
    .catch(() => void 0);
}
async function resolveInstallPublishTarget(params) {
  const installBaseResolved = path.resolve(params.installBaseDir);
  const targetResolved = path.resolve(params.targetDir);
  const targetRelativePath = path.relative(installBaseResolved, targetResolved);
  if (!isRelativePathInsideBase(targetRelativePath)) throw new Error("invalid install target path");
  const installBaseRealPath = await fs.realpath(params.installBaseDir);
  return {
    installBaseRealPath,
    canonicalTargetDir: path.join(installBaseRealPath, targetRelativePath),
  };
}
/**
 * Publishes a package directory into an install target via a staged copy.
 * Update mode backs up the existing target, runs optional validation hooks,
 * and rolls back when copy, dependency install, or validation fails.
 */
async function installPackageDir(params) {
  params.logger?.info?.(`Installing to ${params.targetDir}…`);
  const installBaseDir = path.dirname(params.targetDir);
  let initialInstallBaseRealPath;
  try {
    await fs.mkdir(installBaseDir, { recursive: true });
    initialInstallBaseRealPath = await fs.realpath(installBaseDir);
    await assertInstallBoundaryPaths({
      installBaseDir,
      candidatePaths: [params.targetDir],
    });
  } catch (err) {
    return {
      ok: false,
      error: `${params.copyErrorPrefix}: ${String(err)}`,
    };
  }
  let installBaseRealPath;
  let canonicalTargetDir;
  try {
    ({ installBaseRealPath, canonicalTargetDir } = await resolveInstallPublishTarget({
      installBaseDir,
      targetDir: params.targetDir,
    }));
    if (installBaseRealPath !== initialInstallBaseRealPath)
      throw new Error(INSTALL_BASE_CHANGED_ERROR_MESSAGE);
  } catch (err) {
    if (isInstallBaseChangedError(err)) params.logger?.warn?.(INSTALL_BASE_CHANGED_ABORT_WARNING);
    return {
      ok: false,
      error: `${params.copyErrorPrefix}: ${String(err)}`,
    };
  }
  let stageDir = null;
  let backupDir = null;
  const sourceHardlinks = resolveMoveSourceHardlinks(
    params.sourceHardlinks ?? DEFAULT_INSTALL_SOURCE_HARDLINKS,
  );
  const fail = async (error, cause) => {
    if (isInstallBaseChangedError(cause)) params.logger?.warn?.(INSTALL_BASE_CHANGED_ABORT_WARNING);
    else {
      await restoreBackup();
      if (stageDir) {
        await cleanupInstallTempDir(stageDir);
        stageDir = null;
      }
    }
    return {
      ok: false,
      error,
    };
  };
  const failWithCode = async (paramsLocal, cause) => {
    const failed = await fail(paramsLocal.error, cause);
    return paramsLocal.code
      ? {
          ...failed,
          code: paramsLocal.code,
        }
      : failed;
  };
  const restoreBackup = async () => {
    if (!backupDir) return;
    await movePathWithCopyFallback({
      from: backupDir,
      sourceHardlinks,
      to: canonicalTargetDir,
    }).catch(() => void 0);
    backupDir = null;
  };
  try {
    await assertInstallBoundaryPaths({
      installBaseDir: installBaseRealPath,
      candidatePaths: [canonicalTargetDir],
    });
    stageDir = await fs.mkdtemp(path.join(installBaseRealPath, ".openclaw-install-stage-"));
    await fs.cp(params.sourceDir, stageDir, {
      recursive: true,
      verbatimSymlinks: true,
    });
  } catch (err) {
    return await fail(`${params.copyErrorPrefix}: ${String(err)}`, err);
  }
  try {
    await params.afterCopy?.(stageDir);
  } catch (err) {
    return await fail(`post-copy validation failed: ${String(err)}`, err);
  }
  if (params.hasDeps)
    try {
      await sanitizeManifestForNpmInstall(stageDir);
      const hiddenProjectNpmConfig = await hideProjectNpmConfigForInstall(stageDir);
      params.logger?.info?.(params.depsLogMessage);
      const npmRes = await (async () => {
        try {
          return await runCommandWithTimeout(
            [
              "npm",
              ...createSafeNpmInstallArgs({
                omitDev: true,
                loglevel: "error",
              }),
            ],
            {
              timeoutMs: Math.max(params.timeoutMs, 3e5),
              cwd: stageDir,
              env: createSafeNpmInstallEnv(process.env, { npmConfigCwd: stageDir }),
            },
          );
        } finally {
          await restoreProjectNpmConfigAfterInstall(hiddenProjectNpmConfig);
        }
      })();
      if (npmRes.code !== 0)
        return await fail(`npm install failed: ${formatNpmDependencyInstallFailure(npmRes)}`);
    } catch (error) {
      return await fail(`npm install failed: ${String(error)}`, error);
    }
  if (params.afterInstall)
    try {
      const postInstallResult = await params.afterInstall(stageDir);
      if (!postInstallResult.ok) return await failWithCode(postInstallResult);
    } catch (err) {
      return await fail(`post-install validation failed: ${String(err)}`, err);
    }
  if (params.mode === "update" && (await pathExists(canonicalTargetDir))) {
    const backupRoot = path.join(installBaseRealPath, ".openclaw-install-backups");
    backupDir = path.join(backupRoot, `${path.basename(canonicalTargetDir)}-${Date.now()}`);
    try {
      await fs.mkdir(backupRoot, { recursive: true });
      await assertInstallBoundaryPaths({
        installBaseDir: installBaseRealPath,
        candidatePaths: [backupDir],
      });
      await assertInstallBaseStable({
        installBaseDir,
        expectedRealPath: installBaseRealPath,
      });
      await movePathWithCopyFallback({
        from: canonicalTargetDir,
        sourceHardlinks,
        to: backupDir,
      });
    } catch (err) {
      return await fail(`${params.copyErrorPrefix}: ${String(err)}`, err);
    }
  }
  try {
    await assertInstallBaseStable({
      installBaseDir,
      expectedRealPath: installBaseRealPath,
    });
    await movePathWithCopyFallback({
      from: stageDir,
      sourceHardlinks,
      to: canonicalTargetDir,
    });
    stageDir = null;
  } catch (err) {
    return await fail(`${params.copyErrorPrefix}: ${String(err)}`, err);
  }
  if (backupDir)
    try {
      await assertInstallBaseStable({
        installBaseDir,
        expectedRealPath: installBaseRealPath,
      });
    } catch (err) {
      if (isInstallBaseChangedError(err))
        params.logger?.warn?.(INSTALL_BASE_CHANGED_BACKUP_WARNING);
      backupDir = null;
    }
  if (backupDir)
    await fs
      .rm(backupDir, {
        recursive: true,
        force: true,
      })
      .catch(() => void 0);
  if (stageDir) await cleanupInstallTempDir(stageDir);
  return { ok: true };
}
/**
 * Installs a manifest-backed package directory while deriving whether npm
 * dependencies must be installed and which hardlink policy is safe to use.
 */
async function installPackageDirWithManifestDeps(params) {
  const hasDeps = Object.keys(params.manifestDependencies ?? {}).length > 0;
  return installPackageDir({
    ...params,
    hasDeps,
    sourceHardlinks: hasDeps ? "package-manager" : "reject",
  });
}
//#endregion
export {
  withExtractedArchiveRoot as i,
  installPackageDirWithManifestDeps as n,
  resolveExistingInstallPath as r,
  installPackageDir as t,
};
