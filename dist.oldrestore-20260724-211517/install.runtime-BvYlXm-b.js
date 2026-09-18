import { s as resolveArchiveKind } from "./archive-CR1500gV.js";
import {
  a as loadBundleManifest,
  i as detectBundleManifestFormat,
} from "./bundle-manifest-Dxp5qa20.js";
import { v as pathExists } from "./fs-safe-RNq3oO57.js";
import {
  i as withExtractedArchiveRoot,
  r as resolveExistingInstallPath,
  t as installPackageDir,
} from "./install-package-dir-BWAaVbDQ.js";
import {
  a as scanFileInstallSource,
  i as scanBundleInstallSource,
  o as scanInstalledPackageDependencyTree,
  s as scanPackageInstallSource,
} from "./install-security-scan-Bu6soO4h.js";
import { i as resolveArchiveSourcePath } from "./install-source-utils-Cvk6wk9f.js";
import {
  a as finalizeNpmSpecArchiveInstall,
  i as resolveTimedInstallModeOptions,
  n as resolveCanonicalInstallTarget,
  o as installFromNpmSpecArchiveWithInstaller,
  r as resolveInstallModeOptions,
  t as ensureInstallTargetAvailable,
} from "./install-target-CaW3_Rwh.js";
import { n as readJson } from "./json-files-CTWRDHag.js";
import {
  i as loadPluginManifest,
  r as getPackageManifestMetadata,
  s as resolvePackageExtensionEntries,
} from "./manifest-DnFAzqZi.js";
import "./path-safety-4zNHq1Ot.js";
import { t as checkMinHostVersion } from "./min-host-version-X0iggZMD.js";
import "./archive-CBe_wA_B.js";
import { c as validateRegistryNpmSpec } from "./npm-registry-spec-CqBTTiC9.js";
import { i as isPathInside } from "./path-DILYn_gk.js";
import { a as root } from "./secure-temp-dir-DMUMnweR.js";
import {
  o as resolveCompatibilityHostVersion,
  s as resolveRuntimeServiceVersion,
} from "./version-CeFj_iGk.js";
//#region src/plugins/install.runtime.ts
/** Lazy runtime barrel for plugin installation helpers used by install flows. */
//#endregion
export {
  checkMinHostVersion,
  detectBundleManifestFormat,
  ensureInstallTargetAvailable,
  pathExists as fileExists,
  finalizeNpmSpecArchiveInstall,
  getPackageManifestMetadata,
  installFromNpmSpecArchiveWithInstaller,
  installPackageDir,
  isPathInside,
  loadBundleManifest,
  loadPluginManifest,
  readJson as readJsonFile,
  resolveArchiveKind,
  resolveArchiveSourcePath,
  resolveCanonicalInstallTarget,
  resolveCompatibilityHostVersion,
  resolveExistingInstallPath,
  resolveInstallModeOptions,
  resolvePackageExtensionEntries,
  resolveRuntimeServiceVersion,
  resolveTimedInstallModeOptions,
  root,
  scanBundleInstallSource,
  scanFileInstallSource,
  scanInstalledPackageDependencyTree,
  scanPackageInstallSource,
  validateRegistryNpmSpec,
  withExtractedArchiveRoot,
};
