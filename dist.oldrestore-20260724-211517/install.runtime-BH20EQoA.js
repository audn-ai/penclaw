import { s as resolveArchiveKind } from "./archive-CR1500gV.js";
import { v as pathExists } from "./fs-safe-RNq3oO57.js";
import {
  i as withExtractedArchiveRoot,
  n as installPackageDirWithManifestDeps,
  r as resolveExistingInstallPath,
  t as installPackageDir,
} from "./install-package-dir-BWAaVbDQ.js";
import { i as resolveArchiveSourcePath } from "./install-source-utils-Cvk6wk9f.js";
import {
  a as finalizeNpmSpecArchiveInstall,
  i as resolveTimedInstallModeOptions,
  n as resolveCanonicalInstallTarget,
  o as installFromNpmSpecArchiveWithInstaller,
  r as resolveInstallModeOptions,
  t as ensureInstallTargetAvailable,
} from "./install-target-CaW3_Rwh.js";
import "./scan-paths-Bve2UhXh.js";
import "./archive-CBe_wA_B.js";
import { n as readJson } from "./json-files-CTWRDHag.js";
import { c as validateRegistryNpmSpec } from "./npm-registry-spec-CqBTTiC9.js";
import { a as isPathInsideWithRealpath, i as isPathInside } from "./path-DILYn_gk.js";
//#region src/infra/install-from-npm-spec.ts
/**
 * Validates a registry npm spec, downloads its archive, and delegates final installation.
 * The caller supplies archive-specific params without `archivePath`; this helper injects
 * the downloaded archive path and normalizes the npm archive flow result.
 */
async function installFromValidatedNpmSpecArchive(params) {
  const spec = params.spec.trim();
  const specError = validateRegistryNpmSpec(spec);
  if (specError)
    return {
      ok: false,
      error: specError,
    };
  return finalizeNpmSpecArchiveInstall(
    await installFromNpmSpecArchiveWithInstaller({
      tempDirPrefix: params.tempDirPrefix,
      spec,
      timeoutMs: params.timeoutMs,
      expectedIntegrity: params.expectedIntegrity,
      onIntegrityDrift: params.onIntegrityDrift,
      warn: params.warn,
      installFromArchive: params.installFromArchive,
      archiveInstallParams: params.archiveInstallParams,
    }),
  );
}
//#endregion
export {
  ensureInstallTargetAvailable,
  pathExists as fileExists,
  installFromValidatedNpmSpecArchive,
  installPackageDir,
  installPackageDirWithManifestDeps,
  isPathInside,
  isPathInsideWithRealpath,
  readJson as readJsonFile,
  resolveArchiveKind,
  resolveArchiveSourcePath,
  resolveCanonicalInstallTarget,
  resolveExistingInstallPath,
  resolveInstallModeOptions,
  resolveTimedInstallModeOptions,
  withExtractedArchiveRoot,
};
