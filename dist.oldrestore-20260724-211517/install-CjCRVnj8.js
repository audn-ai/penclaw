import { randomUUID } from "node:crypto";
import { constants } from "node:fs";
import fs$1 from "node:fs/promises";
import os from "node:os";
import "./utils-DtcDeqWS.js";
import path from "node:path";
import { E as satisfiesPluginApiRange } from "./clawhub-CgGOpxts.js";
import { o as sha256HexPrefix } from "./crypto-digest-CNeb2i19.js";
import { c as emitTrustedSecurityEvent } from "./diagnostic-events-5-gsFhkM.js";
import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import {
  a as resolveDefaultPluginNpmDir,
  c as resolvePluginNpmGenerationProjectDirPrefix,
  f as safePluginInstallFileName,
  n as matchesExpectedPluginId,
  p as validatePluginId,
  r as resolveDefaultPluginExtensionsDir,
  s as resolvePluginNpmGenerationProjectDir,
  t as encodePluginInstallDirName,
  u as resolvePluginNpmProjectDir,
} from "./install-paths-CqMnrXsY.js";
import { t as packageNameMatchesId } from "./install-safe-path-EhqVsq3P.js";
import { r as preflightPluginNpmInstallPolicy } from "./install-security-scan-Bu6soO4h.js";
import {
  a as resolveNpmPackArchiveMetadata,
  n as createNpmMetadataEnv,
  o as resolveNpmSpecMetadata,
} from "./install-source-utils-Cvk6wk9f.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { r as hasRetainedManagedNpmInstallMarker } from "./managed-npm-retention-Ddwq8V0k.js";
import { s as resolvePackageExtensionEntries } from "./manifest-DnFAzqZi.js";
import { t as resolveNpmIntegrityDriftWithDefaultMessage } from "./npm-integrity-DwDjKpwi.js";
import {
  a as removeManagedNpmRootDependency,
  c as restoreManagedNpmRootPeerDependencySnapshot,
  i as readOpenClawManagedNpmRootOverrides,
  l as syncManagedNpmRootPeerDependencies,
  n as readManagedNpmRootInstalledDependency,
  o as repairManagedNpmRootOpenClawPeer,
  r as readManagedNpmRootPeerDependencySnapshot,
  s as resolveManagedNpmRootDependencySpec,
  t as listMissingRequiredPlatformPackages,
  u as upsertManagedNpmRootDependency,
} from "./npm-managed-root-CquJQX-K.js";
import {
  a as isPrereleaseResolutionAllowed,
  c as validateRegistryNpmSpec,
  n as formatPrereleaseResolutionError,
  o as isPrereleaseSemverVersion,
  r as isExactSemverVersion,
  s as parseRegistryNpmSpec,
  t as compareOpenClawReleaseVersions,
} from "./npm-registry-spec-CqBTTiC9.js";
import {
  i as resolvePackagePluginApiRange,
  r as validatePackageExtensionEntriesForInstall,
} from "./package-entry-resolution-BGL_bDuB.js";
import { n as installedPackageNeedsOpenClawPeerLinkRepair } from "./package-update-utils-T2vDkLHN.js";
import {
  i as relinkOpenClawPeerDependenciesInManagedNpmRoot,
  r as linkOpenClawPeerDependencies,
} from "./plugin-peer-link-CMrc53yA.js";
import {
  n as createSafeNpmInstallEnv,
  t as createSafeNpmInstallArgs,
} from "./safe-package-install-CCGE7D0Q.js";
import { n as compareValidSemver } from "./semver-aYpwYdrQ.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/plugins/security-events.ts
function pluginLifecycleAction(mode) {
  return mode === "update" ? "plugin.updated" : "plugin.installed";
}
function pluginAuditOutcomeForReason(reason) {
  return reason === "security_scan_failed" ? "error" : "denied";
}
function emitPluginInstallSecurityEvent(params) {
  emitTrustedSecurityEvent({
    category: "plugin",
    action: pluginLifecycleAction(params.mode),
    outcome: "success",
    severity: "medium",
    actor: { kind: "operator" },
    target: {
      kind: "plugin",
      name: params.pluginId,
    },
    policy: {
      id: "plugin.install",
      decision: "allow",
    },
    control: {
      id: "plugin.install",
      family: "supply_chain",
    },
    attributes: {
      source_family: params.sourceFamily,
      mode: params.mode,
      extension_count: params.extensionCount ?? 0,
      has_version: params.hasVersion ?? false,
      trusted_official_source: params.trustedSourceLinkedOfficialInstall === true,
    },
  });
}
function emitPluginAuditSecurityEvent(params) {
  emitTrustedSecurityEvent({
    category: "plugin",
    action: "plugin.audit.failed",
    outcome: params.outcome,
    severity: params.outcome === "error" ? "high" : "medium",
    actor: { kind: "operator" },
    target: {
      kind: "plugin",
      ...(params.pluginId ? { name: params.pluginId } : {}),
    },
    policy: {
      id: "plugin.install",
      decision: "deny",
      reason: params.reason,
    },
    control: {
      id: "plugin.install.audit",
      family: "supply_chain",
    },
    reason: params.reason,
    attributes: {
      ...(params.sourceFamily ? { source_family: params.sourceFamily } : {}),
      ...(params.mode ? { mode: params.mode } : {}),
    },
  });
}
//#endregion
//#region src/plugins/install.ts
const pluginInstallRuntimeLoader = createLazyImportLoader(() => import("./install.runtime.js"));
const rollbackSnapshotCopyMode = constants.COPYFILE_FICLONE;
async function loadPluginInstallRuntime() {
  return await pluginInstallRuntimeLoader.load();
}
function formatUnresolvedOpenClawPeerLinkError(packageName) {
  return `Installed plugin ${packageName} declares openclaw as a peer dependency, but OpenClaw could not create a plugin-local node_modules/openclaw link. Run from a packaged OpenClaw install or reinstall OpenClaw, then retry.`;
}
function isNpmAliasOverrideComparatorError(result) {
  return `${result.stderr}\n${result.stdout}`.includes("Invalid comparator: npm:");
}
const MISSING_EXTENSIONS_ERROR =
  'package.json missing openclaw.extensions; update the plugin package to include openclaw.extensions (for example ["./dist/index.js"]). See https://docs.openclaw.ai/help/troubleshooting#plugin-install-fails-with-missing-openclaw-extensions';
const PLUGIN_ARCHIVE_ROOT_MARKERS = [
  "package.json",
  "openclaw.plugin.json",
  ".codex-plugin/plugin.json",
  ".claude-plugin/plugin.json",
  ".cursor-plugin/plugin.json",
];
const MANAGED_NPM_PACK_ARCHIVE_DIR = "_openclaw-pack-archives";
const MANAGED_NPM_PROJECT_QUARANTINE_DIR = "_openclaw-quarantined-npm-projects";
const MANAGED_NPM_PROJECT_REBUILD_ARTIFACTS = [
  "node_modules",
  "package-lock.json",
  "npm-shrinkwrap.json",
];
const PLUGIN_INSTALL_ERROR_CODE = {
  INVALID_NPM_SPEC: "invalid_npm_spec",
  INVALID_MIN_HOST_VERSION: "invalid_min_host_version",
  UNKNOWN_HOST_VERSION: "unknown_host_version",
  INCOMPATIBLE_HOST_VERSION: "incompatible_host_version",
  INCOMPATIBLE_PLUGIN_API: "incompatible_plugin_api",
  INVALID_PLUGIN_API: "invalid_plugin_api",
  MISSING_OPENCLAW_EXTENSIONS: "missing_openclaw_extensions",
  MISSING_PLUGIN_MANIFEST: "missing_plugin_manifest",
  EMPTY_OPENCLAW_EXTENSIONS: "empty_openclaw_extensions",
  INVALID_OPENCLAW_EXTENSIONS: "invalid_openclaw_extensions",
  NPM_PACKAGE_NOT_FOUND: "npm_package_not_found",
  PLUGIN_ID_MISMATCH: "plugin_id_mismatch",
  SECURITY_SCAN_BLOCKED: "security_scan_blocked",
  SECURITY_SCAN_FAILED: "security_scan_failed",
  UNSUPPORTED_PLAIN_FILE_PLUGIN: "unsupported_plain_file_plugin",
};
function validateOpenClawPackageCompatibility(params) {
  const pluginApiRangeCheck = resolvePackagePluginApiRange(params.packageMetadata);
  if (!pluginApiRangeCheck.ok)
    return {
      ok: false,
      error: `invalid package.json openclaw.compat.pluginApi: ${pluginApiRangeCheck.error}`,
      code: PLUGIN_INSTALL_ERROR_CODE.INVALID_PLUGIN_API,
    };
  const pluginApiRange = pluginApiRangeCheck.range;
  if (pluginApiRange && !satisfiesPluginApiRange(params.currentHostVersion, pluginApiRange))
    return {
      ok: false,
      error: `plugin "${params.pluginId}" requires plugin API ${pluginApiRange}, but this OpenClaw runtime exposes ${params.currentHostVersion}. Upgrade OpenClaw or install a compatible plugin version and retry.`,
      code: PLUGIN_INSTALL_ERROR_CODE.INCOMPATIBLE_PLUGIN_API,
    };
  return null;
}
function validateOpenClawPackageInstallCompatibility(params) {
  const currentHostVersion = params.runtime.resolveCompatibilityHostVersion();
  const minHostVersionCheck = params.runtime.checkMinHostVersion({
    currentVersion: currentHostVersion,
    minHostVersion: params.packageMetadata?.install?.minHostVersion,
  });
  if (!minHostVersionCheck.ok) {
    if (minHostVersionCheck.kind === "invalid")
      return {
        ok: false,
        error: `invalid package.json openclaw.install.minHostVersion: ${minHostVersionCheck.error}`,
        code: PLUGIN_INSTALL_ERROR_CODE.INVALID_MIN_HOST_VERSION,
      };
    if (minHostVersionCheck.kind === "unknown_host_version")
      return {
        ok: false,
        error: `plugin "${params.pluginId}" requires OpenClaw >=${minHostVersionCheck.requirement.minimumLabel}, but this host version could not be determined. Re-run from a released build or set OPENCLAW_VERSION and retry.`,
        code: PLUGIN_INSTALL_ERROR_CODE.UNKNOWN_HOST_VERSION,
      };
    return {
      ok: false,
      error: `plugin "${params.pluginId}" requires OpenClaw >=${minHostVersionCheck.requirement.minimumLabel}, but this host is ${minHostVersionCheck.currentVersion}. Upgrade OpenClaw and retry.`,
      code: PLUGIN_INSTALL_ERROR_CODE.INCOMPATIBLE_HOST_VERSION,
    };
  }
  return validateOpenClawPackageCompatibility({
    pluginId: params.pluginId,
    currentHostVersion,
    packageMetadata: params.packageMetadata,
  });
}
async function readOptionalPackageManifest(params) {
  const manifestPath = path.join(params.packageDir, "package.json");
  if (!(await params.runtime.fileExists(manifestPath))) return { ok: true };
  try {
    return {
      ok: true,
      manifest: await params.runtime.readJsonFile(manifestPath),
    };
  } catch (err) {
    return {
      ok: false,
      error: `invalid package.json: ${String(err)}`,
    };
  }
}
const defaultLogger = {};
function ensureOpenClawExtensions(params) {
  const resolved = resolvePackageExtensionEntries(params.manifest);
  if (resolved.status === "missing")
    return {
      ok: false,
      error: MISSING_EXTENSIONS_ERROR,
      code: PLUGIN_INSTALL_ERROR_CODE.MISSING_OPENCLAW_EXTENSIONS,
    };
  if (resolved.status === "empty")
    return {
      ok: false,
      error: "package.json openclaw.extensions is empty",
      code: PLUGIN_INSTALL_ERROR_CODE.EMPTY_OPENCLAW_EXTENSIONS,
    };
  if (resolved.status === "invalid")
    return {
      ok: false,
      error: resolved.error,
      code: PLUGIN_INSTALL_ERROR_CODE.INVALID_OPENCLAW_EXTENSIONS,
    };
  return {
    ok: true,
    entries: resolved.entries,
  };
}
function isNpmPackageNotFoundMessage(error) {
  const normalized = error.trim();
  if (normalized.startsWith("Package not found on npm:")) return true;
  return /E404|404 not found|not in this registry/i.test(normalized);
}
function compareNpmSemver(a, b) {
  const releaseCmp = compareOpenClawReleaseVersions(a, b);
  if (releaseCmp !== null) return releaseCmp;
  return compareValidSemver(a, b) ?? 0;
}
async function loadNpmPackageVersions(params) {
  const versions = await runCommandWithTimeout(
    ["npm", "view", params.packageName, "versions", "--json"],
    {
      timeoutMs: Math.max(params.timeoutMs, 6e4),
      env: createNpmMetadataEnv(),
    },
  );
  if (versions.code !== 0) return null;
  let parsed;
  try {
    parsed = JSON.parse(versions.stdout.trim());
  } catch {
    return null;
  }
  return (Array.isArray(parsed) ? parsed : [parsed]).filter(
    (value) => typeof value === "string" && isExactSemverVersion(value),
  );
}
async function resolveTrustedOfficialPrereleaseResolution(params) {
  if (!params.spec.name.startsWith("@openclaw/")) return null;
  const semverVersions = await loadNpmPackageVersions({
    packageName: params.spec.name,
    timeoutMs: params.timeoutMs,
  });
  if (!semverVersions) return null;
  const stableVersion = semverVersions
    .filter((value) => !isPrereleaseSemverVersion(value))
    .toSorted(compareNpmSemver)
    .at(-1);
  if (!stableVersion) {
    const prereleaseVersion = semverVersions
      .filter(isPrereleaseSemverVersion)
      .toSorted(compareNpmSemver)
      .at(-1);
    if (prereleaseVersion && semverVersions.every(isPrereleaseSemverVersion)) {
      if (prereleaseVersion !== params.resolvedPrereleaseVersion) {
        const prereleaseSpec = `${params.spec.name}@${prereleaseVersion}`;
        const metadataResult = await resolveNpmSpecMetadata({
          spec: prereleaseSpec,
          timeoutMs: params.timeoutMs,
        });
        if (!metadataResult.ok) return null;
        params.logger.warn?.(
          `Resolved ${params.spec.raw} to prerelease version ${params.resolvedPrereleaseVersion}; using newest prerelease ${prereleaseSpec} because this trusted official OpenClaw package has no stable npm versions yet.`,
        );
        return {
          kind: "prerelease-only",
          resolution: metadataResult.metadata,
        };
      }
      params.logger.warn?.(
        `Resolved ${params.spec.raw} to prerelease version ${params.resolvedPrereleaseVersion}; allowing it because this trusted official OpenClaw package has no stable npm versions yet.`,
      );
      return { kind: "allow-prerelease-only" };
    }
    return null;
  }
  const stableSpec = `${params.spec.name}@${stableVersion}`;
  const metadataResult = await resolveNpmSpecMetadata({
    spec: stableSpec,
    timeoutMs: params.timeoutMs,
  });
  if (!metadataResult.ok) return null;
  params.logger.warn?.(
    `Resolved ${params.spec.raw} to prerelease version ${params.resolvedPrereleaseVersion}; falling back to stable ${stableSpec} for this trusted official OpenClaw install.`,
  );
  return {
    kind: "stable",
    resolution: metadataResult.metadata,
  };
}
function shouldResolveLatestCompatibleNpmVersion(spec) {
  return (
    spec.selectorKind === "none" ||
    (spec.selectorKind === "tag" && (spec.selector ?? "").toLowerCase() === "latest")
  );
}
function shouldResolveCompatiblePrereleaseNpmVersion(params) {
  if (!isPrereleaseSemverVersion(params.currentVersion)) return false;
  if (params.spec.selectorKind === "none") return true;
  return (
    params.spec.selectorKind === "tag" && (params.spec.selector ?? "").toLowerCase() !== "latest"
  );
}
function resolvePrereleaseChannel(version) {
  if (!isPrereleaseSemverVersion(version)) return null;
  return /^\s*v?\d+\.\d+\.\d+-([0-9A-Za-z]+)(?:[.-]|$)/.exec(version)?.[1]?.toLowerCase() ?? null;
}
function canResolveAroundCompatibilityError(error) {
  return (
    error.code === PLUGIN_INSTALL_ERROR_CODE.INCOMPATIBLE_HOST_VERSION ||
    error.code === PLUGIN_INSTALL_ERROR_CODE.INCOMPATIBLE_PLUGIN_API
  );
}
function validateNpmResolutionCompatibility(params) {
  return validateOpenClawPackageInstallCompatibility({
    runtime: params.runtime,
    pluginId: params.expectedPluginId ?? params.resolution.name ?? params.parsedSpec.name,
    packageMetadata: params.resolution.packageOpenClaw,
  });
}
async function resolveLatestCompatibleNpmResolution(params) {
  if (!params.currentResolution.version) return null;
  const currentVersion = params.currentResolution.version;
  const allowPrereleaseCandidates = shouldResolveCompatiblePrereleaseNpmVersion({
    spec: params.parsedSpec,
    currentVersion,
  });
  const prereleaseChannel = allowPrereleaseCandidates
    ? resolvePrereleaseChannel(currentVersion)
    : null;
  if (!shouldResolveLatestCompatibleNpmVersion(params.parsedSpec) && !allowPrereleaseCandidates)
    return null;
  const versions = await loadNpmPackageVersions({
    packageName: params.parsedSpec.name,
    timeoutMs: params.timeoutMs,
  });
  if (!versions) return null;
  const candidates = versions
    .filter((version) =>
      allowPrereleaseCandidates
        ? resolvePrereleaseChannel(version) === prereleaseChannel
        : !isPrereleaseSemverVersion(version),
    )
    .filter((version) => compareNpmSemver(version, currentVersion) < 0)
    .toSorted(compareNpmSemver)
    .toReversed();
  for (const version of candidates) {
    const spec = `${params.parsedSpec.name}@${version}`;
    const metadataResult = await resolveNpmSpecMetadata({
      spec,
      timeoutMs: params.timeoutMs,
    });
    if (!metadataResult.ok) {
      params.logger.warn?.(
        `Could not inspect ${spec} while looking for a compatible plugin version: ${metadataResult.error}`,
      );
      continue;
    }
    if (
      !validateNpmResolutionCompatibility({
        runtime: params.runtime,
        parsedSpec: params.parsedSpec,
        expectedPluginId: params.expectedPluginId,
        resolution: metadataResult.metadata,
      })
    ) {
      params.logger.warn?.(
        `Resolved ${params.parsedSpec.raw} to ${params.currentResolution.resolvedSpec ?? currentVersion}, but that version is incompatible with this OpenClaw runtime; using newest compatible ${metadataResult.metadata.resolvedSpec ?? spec}.`,
      );
      return metadataResult.metadata;
    }
  }
  return null;
}
function buildDirectoryInstallResult(params) {
  return {
    ok: true,
    pluginId: params.pluginId,
    targetDir: params.targetDir,
    manifestName: params.manifestName,
    version: params.version,
    extensions: params.extensions,
  };
}
function emitSuccessfulPluginInstallSecurityEvent(result, params) {
  if (params.dryRun || !result.ok) return;
  emitPluginInstallSecurityEvent({
    pluginId: result.pluginId,
    mode: params.mode,
    sourceFamily: params.sourceFamily,
    extensionCount: result.extensions.length,
    hasVersion: Boolean(result.version),
    trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
  });
}
function hasPackageRuntimeDependencies(manifest) {
  return (
    Object.keys(manifest.dependencies ?? {}).length > 0 ||
    Object.keys(manifest.optionalDependencies ?? {}).length > 0
  );
}
function buildBlockedInstallResult(params) {
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
async function rollbackManagedNpmPluginInstall(params) {
  if (params.snapshot) {
    try {
      await restoreManagedNpmPluginInstallRollbackSnapshot({
        npmRoot: params.npmRoot,
        snapshot: params.snapshot,
      });
      await relinkOpenClawPeerDependenciesInManagedNpmRoot({
        npmRoot: params.npmRoot,
        logger: params.logger,
      });
    } catch (error) {
      params.logger.warn?.(
        `Failed to restore managed npm plugin root after installing ${params.packageName}: ${String(error)}`,
      );
    }
    return;
  }
  try {
    await runCommandWithTimeout(
      [
        "npm",
        "uninstall",
        "--loglevel=error",
        "--legacy-peer-deps",
        "--ignore-scripts",
        "--no-audit",
        "--no-fund",
        params.packageName,
      ],
      {
        cwd: params.npmRoot,
        timeoutMs: Math.max(params.timeoutMs, 3e5),
        env: createSafeNpmInstallEnv(process.env, {
          legacyPeerDeps: true,
          npmConfigCwd: params.npmRoot,
          packageLock: true,
          quiet: true,
        }),
      },
    );
  } catch (error) {
    params.logger.warn?.(
      `Failed to run npm uninstall rollback for ${params.packageName}: ${String(error)}`,
    );
  }
  try {
    await fs$1.rm(params.targetDir, {
      recursive: true,
      force: true,
    });
  } catch (error) {
    params.logger.warn?.(
      `Failed to remove failed plugin install directory ${params.targetDir}: ${String(error)}`,
    );
  }
  try {
    await removeManagedNpmRootDependency({
      npmRoot: params.npmRoot,
      packageName: params.packageName,
    });
  } catch (error) {
    params.logger.warn?.(
      `Failed to remove managed npm dependency ${params.packageName}: ${String(error)}`,
    );
  }
  if (params.peerDependencySnapshot)
    try {
      const preRestorePeerDependencySnapshot = await readManagedNpmRootPeerDependencySnapshot({
        npmRoot: params.npmRoot,
      });
      const restoredPeerDependencyNames = new Set(
        params.peerDependencySnapshot.managedPeerDependencies,
      );
      const addedPeerDependencyNames =
        preRestorePeerDependencySnapshot.managedPeerDependencies.filter(
          (packageName) => !restoredPeerDependencyNames.has(packageName),
        );
      await restoreManagedNpmRootPeerDependencySnapshot({
        npmRoot: params.npmRoot,
        snapshot: params.peerDependencySnapshot,
      });
      const cleanupResult = await runCommandWithTimeout(
        [
          "npm",
          "install",
          "--omit=dev",
          "--omit=peer",
          "--loglevel=error",
          "--legacy-peer-deps",
          "--ignore-scripts",
          "--no-audit",
          "--no-fund",
        ],
        {
          cwd: params.npmRoot,
          timeoutMs: Math.max(params.timeoutMs, 3e5),
          env: createSafeNpmInstallEnv(process.env, {
            legacyPeerDeps: true,
            npmConfigCwd: params.npmRoot,
            packageLock: true,
            quiet: true,
          }),
        },
      );
      if (cleanupResult.code !== 0) {
        params.logger.warn?.(
          `npm install cleanup after rollback for ${params.packageName} exited ${cleanupResult.code}: ${cleanupResult.stderr.trim() || cleanupResult.stdout.trim()}`,
        );
        await Promise.all(
          addedPeerDependencyNames.map(async (packageName) => {
            try {
              await fs$1.rm(resolveManagedNpmRootPackageDir(params.npmRoot, packageName), {
                recursive: true,
                force: true,
              });
            } catch (error) {
              params.logger.warn?.(
                `Failed to remove rolled-back managed peer dependency ${packageName}: ${String(error)}`,
              );
            }
          }),
        );
      }
    } catch (error) {
      params.logger.warn?.(
        `Failed to restore managed npm peer dependencies after rollback for ${params.packageName}: ${String(error)}`,
      );
    }
  if (params.packageName !== "openclaw")
    try {
      await repairManagedNpmRootOpenClawPeer({
        npmRoot: params.npmRoot,
        timeoutMs: params.timeoutMs,
        logger: params.logger,
      });
    } catch (error) {
      params.logger.warn?.(
        `Failed to repair managed npm openclaw peer after rollback: ${String(error)}`,
      );
    }
  try {
    await relinkOpenClawPeerDependenciesInManagedNpmRoot({
      npmRoot: params.npmRoot,
      logger: params.logger,
    });
  } catch (error) {
    params.logger.warn?.(
      `Failed to repair managed npm peer links after rollback for ${params.packageName}: ${String(error)}`,
    );
  }
}
async function resolveManagedNpmRootDependencySpecForInstall(params) {
  if (params.prepareDependencySpec)
    try {
      return await params.prepareDependencySpec({ npmRoot: params.npmRoot });
    } catch (error) {
      return {
        ok: false,
        error: `Failed to prepare managed npm dependency for ${params.packageName}: ${String(error)}`,
      };
    }
  if (params.dependencySpec === void 0)
    return {
      ok: false,
      error: `missing managed npm dependency spec for ${params.packageName}`,
    };
  return {
    ok: true,
    dependencySpec: params.dependencySpec,
  };
}
async function rollbackManagedNpmRootPreparedDependency(params) {
  if (!params.preparedDependency.rollback) return;
  try {
    await params.preparedDependency.rollback();
  } catch (error) {
    params.logger.warn?.(
      `Failed to roll back prepared managed npm dependency artifacts for ${params.packageName}: ${String(error)}`,
    );
  }
}
async function cleanupManagedNpmRootPreparedDependency(params) {
  if (!params.preparedDependency?.cleanup) return;
  try {
    await params.preparedDependency.cleanup();
  } catch (error) {
    params.logger.warn?.(
      `Failed to clean up prepared managed npm dependency artifacts for ${params.packageName}: ${String(error)}`,
    );
  }
}
async function removeEmptyDirectoryIfPresent(dir) {
  try {
    await fs$1.rmdir(dir);
  } catch (error) {
    if (!["ENOENT", "ENOTEMPTY", "EEXIST"].includes(error.code ?? "")) throw error;
  }
}
async function readRollbackFileIfPresent(filePath) {
  try {
    return await fs$1.readFile(filePath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }
}
async function writeOrRemoveRollbackFile(filePath, contents) {
  if (contents === void 0) {
    await fs$1.rm(filePath, { force: true });
    return;
  }
  await fs$1.mkdir(path.dirname(filePath), { recursive: true });
  await fs$1.writeFile(filePath, contents, "utf8");
}
async function createManagedNpmPluginInstallRollbackSnapshot(params) {
  const tempDir = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-npm-plugin-rollback-"));
  let nodeModulesBackupDir;
  const nodeModulesDir = path.join(params.npmRoot, "node_modules");
  try {
    await fs$1.stat(nodeModulesDir);
    nodeModulesBackupDir = path.join(tempDir, "node_modules");
    await fs$1.cp(nodeModulesDir, nodeModulesBackupDir, {
      recursive: true,
      force: true,
      filter: (sourcePath) =>
        shouldCopyManagedNpmRollbackSnapshotEntry({
          nodeModulesDir,
          sourcePath,
        }),
      mode: rollbackSnapshotCopyMode,
      verbatimSymlinks: true,
    });
  } catch (error) {
    if (error.code !== "ENOENT") {
      await fs$1.rm(tempDir, {
        recursive: true,
        force: true,
      });
      throw error;
    }
  }
  try {
    return {
      packageJson: await readRollbackFileIfPresent(path.join(params.npmRoot, "package.json")),
      packageLockJson: await readRollbackFileIfPresent(
        path.join(params.npmRoot, "package-lock.json"),
      ),
      ...(nodeModulesBackupDir ? { nodeModulesBackupDir } : {}),
      tempDir,
    };
  } catch (error) {
    await fs$1.rm(tempDir, {
      recursive: true,
      force: true,
    });
    throw error;
  }
}
async function shouldCopyManagedNpmRollbackSnapshotEntry(params) {
  if (typeof params.sourcePath !== "string") return true;
  const relativeParts = path.relative(params.nodeModulesDir, params.sourcePath).split(path.sep);
  if (
    !(
      (relativeParts.length === 3 &&
        relativeParts[1] === "node_modules" &&
        relativeParts[2] === "openclaw") ||
      (relativeParts.length === 4 &&
        relativeParts[0]?.startsWith("@") &&
        relativeParts[2] === "node_modules" &&
        relativeParts[3] === "openclaw")
    )
  )
    return true;
  try {
    return !(await fs$1.lstat(params.sourcePath)).isSymbolicLink();
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}
async function restoreManagedNpmPluginInstallRollbackSnapshot(params) {
  const nodeModulesDir = path.join(params.npmRoot, "node_modules");
  await fs$1.rm(nodeModulesDir, {
    recursive: true,
    force: true,
  });
  if (params.snapshot.nodeModulesBackupDir) {
    await fs$1.mkdir(params.npmRoot, { recursive: true });
    await fs$1.cp(params.snapshot.nodeModulesBackupDir, nodeModulesDir, {
      recursive: true,
      force: true,
      mode: rollbackSnapshotCopyMode,
      verbatimSymlinks: true,
    });
  }
  await writeOrRemoveRollbackFile(
    path.join(params.npmRoot, "package.json"),
    params.snapshot.packageJson,
  );
  await writeOrRemoveRollbackFile(
    path.join(params.npmRoot, "package-lock.json"),
    params.snapshot.packageLockJson,
  );
}
async function cleanupManagedNpmPluginInstallRollbackSnapshot(params) {
  if (!params.snapshot) return;
  try {
    await fs$1.rm(params.snapshot.tempDir, {
      recursive: true,
      force: true,
    });
  } catch (error) {
    params.logger.warn?.(
      `Failed to remove temporary managed npm rollback snapshot ${params.snapshot.tempDir}: ${String(error)}`,
    );
  }
}
function formatNpmCommandFailureOutput(result) {
  return result.stderr.trim() || result.stdout.trim();
}
function isManagedNpmProjectCorruptionInstallFailure(result) {
  const output = `${result.stderr}\n${result.stdout}`;
  return (
    output.includes("ERR_INVALID_ARG_TYPE") &&
    output.includes('"from" argument') &&
    output.includes("Received undefined")
  );
}
function formatManagedNpmProjectQuarantineArtifacts(artifactNames) {
  return artifactNames.length > 0 ? artifactNames.join(", ") : "no rebuild artifacts";
}
async function quarantineManagedNpmProjectRebuildArtifacts(params) {
  await fs$1.mkdir(params.npmRoot, { recursive: true });
  const quarantineParent = path.join(params.npmRoot, MANAGED_NPM_PROJECT_QUARANTINE_DIR);
  await fs$1.mkdir(quarantineParent, { recursive: true });
  const quarantineDir = await fs$1.mkdtemp(path.join(quarantineParent, "corrupt-"));
  const movedArtifactNames = [];
  for (const artifactName of MANAGED_NPM_PROJECT_REBUILD_ARTIFACTS) {
    const source = path.join(params.npmRoot, artifactName);
    try {
      await fs$1.rename(source, path.join(quarantineDir, artifactName));
      movedArtifactNames.push(artifactName);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  return {
    quarantineDir,
    movedArtifactNames,
  };
}
function resolveInstalledNpmResolutionMismatch(params) {
  if (!params.installed)
    return `npm install did not record package-lock metadata for ${params.packageName}`;
  if (params.expected.version && params.installed.version !== params.expected.version)
    return `npm install resolved ${params.packageName} to version ${params.installed.version ?? "unknown"}, expected ${params.expected.version}`;
  if (params.expected.integrity && params.installed.integrity !== params.expected.integrity)
    return `npm install resolved ${params.packageName} with integrity ${params.installed.integrity ?? "unknown"}, expected ${params.expected.integrity}`;
  return null;
}
async function listManagedNpmRootPackageNames(npmRoot) {
  const nodeModulesDir = path.join(npmRoot, "node_modules");
  let entries;
  try {
    entries = await fs$1.readdir(nodeModulesDir, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return /* @__PURE__ */ new Set();
    throw error;
  }
  const packageNames = /* @__PURE__ */ new Set();
  for (const entry of entries.toSorted((left, right) => left.name.localeCompare(right.name))) {
    if (entry.name === ".bin" || entry.name === "openclaw") continue;
    if (entry.name.startsWith("@")) {
      const scopeDir = path.join(nodeModulesDir, entry.name);
      let scopedEntries;
      try {
        scopedEntries = await fs$1.readdir(scopeDir, { withFileTypes: true });
      } catch (error) {
        if (error.code === "ENOENT") continue;
        throw error;
      }
      for (const scopedEntry of scopedEntries.toSorted((left, right) =>
        left.name.localeCompare(right.name),
      ))
        if (scopedEntry.isDirectory() || scopedEntry.isSymbolicLink())
          packageNames.add(`${entry.name}/${scopedEntry.name}`);
      continue;
    }
    if (entry.isDirectory() || entry.isSymbolicLink()) packageNames.add(entry.name);
  }
  return packageNames;
}
function resolveManagedNpmRootPackageDir(npmRoot, packageName) {
  return path.join(npmRoot, "node_modules", ...packageName.split("/"));
}
function resolveManagedNpmRootGenerationKey(params) {
  return [
    params.npmResolution.name ?? params.packageName,
    params.npmResolution.version ?? "",
    params.npmResolution.resolvedSpec ?? "",
    params.npmResolution.integrity ?? "",
    params.npmResolution.shasum ?? "",
  ].join("\n");
}
function resolveManagedNpmRootForInstall(params) {
  if (!params.useGeneration)
    return resolvePluginNpmProjectDir({
      npmDir: params.npmBaseDir,
      packageName: params.packageName,
    });
  return resolvePluginNpmGenerationProjectDir({
    npmDir: params.npmBaseDir,
    packageName: params.packageName,
    generationKey: resolveManagedNpmRootGenerationKey({
      packageName: params.packageName,
      npmResolution: params.npmResolution,
    }),
  });
}
function resolveManagedNpmInstallRoot(params) {
  const generationKey = resolveManagedNpmRootGenerationKey({
    packageName: params.packageName,
    npmResolution: params.npmResolution,
  });
  const npmRoot = resolveManagedNpmRootForInstall(params);
  if (
    !hasRetainedManagedNpmInstallMarker(
      resolveManagedNpmRootPackageDir(npmRoot, params.packageName),
    )
  )
    return npmRoot;
  return resolvePluginNpmGenerationProjectDir({
    npmDir: params.npmBaseDir,
    packageName: params.packageName,
    generationKey: `${generationKey}\nactivation\n${randomUUID()}`,
  });
}
async function listManagedNpmPackageDirsForPackage(params) {
  const packageDirs = [];
  const legacyProjectRoot = resolvePluginNpmProjectDir({
    npmDir: params.npmBaseDir,
    packageName: params.packageName,
  });
  const legacyPackageDir = resolveManagedNpmRootPackageDir(legacyProjectRoot, params.packageName);
  if (await params.runtime.fileExists(legacyPackageDir)) packageDirs.push(legacyPackageDir);
  const projectsDir = path.dirname(legacyProjectRoot);
  const generationPrefix = resolvePluginNpmGenerationProjectDirPrefix(params.packageName);
  let entries;
  try {
    entries = await fs$1.readdir(projectsDir, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return packageDirs;
    throw error;
  }
  for (const entry of entries) {
    if (!entry.isDirectory() || !entry.name.startsWith(generationPrefix)) continue;
    const packageDir = resolveManagedNpmRootPackageDir(
      path.join(projectsDir, entry.name),
      params.packageName,
    );
    if (await params.runtime.fileExists(packageDir)) packageDirs.push(packageDir);
  }
  return packageDirs;
}
async function resolveManagedNpmGenerationUseForInstall(params) {
  const packageDirs = await listManagedNpmPackageDirsForPackage({
    runtime: params.runtime,
    npmBaseDir: params.npmBaseDir,
    packageName: params.packageName,
  });
  const hasNonRetainedPackageDir = packageDirs.some(
    (packageDir) => !hasRetainedManagedNpmInstallMarker(packageDir),
  );
  if (packageDirs.length > 0 && !hasNonRetainedPackageDir) return "retained-install";
  const generationUse =
    params.requestedMode === "update" && hasNonRetainedPackageDir ? "update" : "none";
  if (params.npmResolution) {
    if (
      hasRetainedManagedNpmInstallMarker(
        resolveManagedNpmRootPackageDir(
          resolveManagedNpmRootForInstall({
            npmBaseDir: params.npmBaseDir,
            packageName: params.packageName,
            npmResolution: params.npmResolution,
            useGeneration: generationUse !== "none",
          }),
          params.packageName,
        ),
      )
    )
      return "retained-install";
  }
  if (params.requestedMode === "update") return hasNonRetainedPackageDir ? "update" : "none";
  return "none";
}
function resolveRequiredPlatformPackageNames(packageMetadata) {
  const raw = packageMetadata?.install?.requiredPlatformPackages;
  if (raw === void 0)
    return {
      ok: true,
      packageNames: [],
    };
  if (!Array.isArray(raw))
    return {
      ok: false,
      error: "package.json openclaw.install.requiredPlatformPackages must be an array",
    };
  const packageNames = /* @__PURE__ */ new Set();
  for (const value of raw) {
    if (typeof value !== "string")
      return {
        ok: false,
        error:
          "package.json openclaw.install.requiredPlatformPackages must contain only npm package names",
      };
    const specError = validateRegistryNpmSpec(value);
    const parsed = parseRegistryNpmSpec(value);
    if (specError || !parsed || parsed.selectorKind !== "none")
      return {
        ok: false,
        error: `package.json openclaw.install.requiredPlatformPackages contains invalid package name: ${value}`,
      };
    packageNames.add(parsed.name);
  }
  return {
    ok: true,
    packageNames: [...packageNames],
  };
}
async function listNewManagedNpmRootPackageDirs(params) {
  return [...(await listManagedNpmRootPackageNames(params.npmRoot))]
    .filter((packageName) => !params.beforeInstallPackageNames.has(packageName))
    .map((packageName) => resolveManagedNpmRootPackageDir(params.npmRoot, packageName))
    .toSorted((left, right) => left.localeCompare(right));
}
function resolveTrustedNpmPackPackageName(packageName) {
  if (!packageName)
    return {
      ok: false,
      error: "npm pack metadata missing package name",
      code: PLUGIN_INSTALL_ERROR_CODE.INVALID_NPM_SPEC,
    };
  const specError = validateRegistryNpmSpec(packageName);
  const parsedSpec = parseRegistryNpmSpec(packageName);
  if (specError || !parsedSpec || parsedSpec.selectorKind !== "none")
    return {
      ok: false,
      error: `unsupported npm pack package name: ${packageName}`,
      code: PLUGIN_INSTALL_ERROR_CODE.INVALID_NPM_SPEC,
    };
  return {
    ok: true,
    packageName: parsedSpec.name,
  };
}
async function installPluginFromManagedNpmRoot(params) {
  const runtime = await loadPluginInstallRuntime();
  const { logger, timeoutMs, mode, dryRun } = runtime.resolveTimedInstallModeOptions(
    params,
    defaultLogger,
  );
  const expectedPluginId = params.expectedPluginId;
  const npmBaseDir = params.npmDir ? resolveUserPath(params.npmDir) : resolveDefaultPluginNpmDir();
  const generationUse = await resolveManagedNpmGenerationUseForInstall({
    runtime,
    npmBaseDir,
    packageName: params.packageName,
    requestedMode: mode,
    npmResolution: params.npmResolution,
  });
  const npmRoot = resolveManagedNpmInstallRoot({
    npmBaseDir,
    packageName: params.packageName,
    npmResolution: params.npmResolution,
    useGeneration: generationUse !== "none",
  });
  const installRoot = resolveManagedNpmRootPackageDir(npmRoot, params.packageName);
  const targetMode =
    generationUse === "retained-install" && hasRetainedManagedNpmInstallMarker(installRoot)
      ? "update"
      : await resolveEffectiveInstallMode({
          runtime,
          requestedMode: mode,
          targetPath: installRoot,
        });
  const policyMode =
    generationUse === "update"
      ? "update"
      : generationUse === "retained-install"
        ? "install"
        : targetMode;
  const availability = await ensureInstallTargetAvailableForMode({
    runtime,
    targetPath: installRoot,
    mode: targetMode,
  });
  if (!availability.ok) return availability;
  if (!params.skipPolicyPreflight) {
    const preflightPolicyResult = await runInstallSourceScan({
      subject: `Plugin "${expectedPluginId ?? params.packageName}"`,
      pluginId: expectedPluginId ?? params.packageName,
      mode: policyMode,
      sourceFamily: sourceFamilyForInstallPolicySource(params.installPolicyRequest.source, "npm"),
      scan: async () =>
        await preflightPluginNpmInstallPolicy({
          config: params.config,
          logger,
          mode: policyMode,
          packageName: params.packageName,
          ...(expectedPluginId ? { pluginId: expectedPluginId } : {}),
          requestedSpecifier: params.installPolicyRequest.requestedSpecifier ?? params.displaySpec,
          source: params.installPolicyRequest.source,
          sourcePath: params.policyPreflightSourcePath ?? npmRoot,
          sourcePathKind: params.policyPreflightSourcePathKind ?? "directory",
        }),
    });
    if (preflightPolicyResult) return preflightPolicyResult;
  }
  if (dryRun)
    return {
      ok: true,
      pluginId: expectedPluginId ?? params.packageName,
      targetDir: installRoot,
      extensions: [],
      npmResolution: params.npmResolution,
      ...(params.integrityDrift ? { integrityDrift: params.integrityDrift } : {}),
    };
  let rollbackSnapshot;
  let preparedDependency;
  try {
    rollbackSnapshot = await createManagedNpmPluginInstallRollbackSnapshot({ npmRoot });
  } catch (error) {
    return {
      ok: false,
      error: `Failed to snapshot managed npm root before installing ${params.packageName}: ${String(error)}`,
    };
  }
  const runManagedNpmInstall = async (prepared) => {
    logger.info?.(`Installing ${params.displaySpec} into ${npmRoot}…`);
    if (params.packageName !== "openclaw") {
      if (
        await repairManagedNpmRootOpenClawPeer({
          npmRoot,
          timeoutMs,
          logger,
        })
      )
        logger.info?.(`Repaired stale openclaw peer dependency in ${npmRoot}`);
    }
    let preInstallRootPackageNames = await listManagedNpmRootPackageNames(npmRoot);
    const managedOverrides = await readOpenClawManagedNpmRootOverrides();
    const rollbackPeerDependencySnapshot = await readManagedNpmRootPeerDependencySnapshot({
      npmRoot,
    });
    const rollbackFailedManagedNpmInstall = async (failure) => {
      await rollbackManagedNpmPluginInstall({
        npmRoot,
        packageName: params.packageName,
        targetDir: installRoot,
        timeoutMs,
        logger,
        peerDependencySnapshot: rollbackPeerDependencySnapshot,
        snapshot: rollbackSnapshot,
      });
      await rollbackManagedNpmRootPreparedDependency({
        packageName: params.packageName,
        preparedDependency: prepared,
        logger,
      });
      return failure;
    };
    const rollbackFailedManagedNpmInstallAfterQuarantine = async (failure) => {
      await rollbackManagedNpmPluginInstall({
        npmRoot,
        packageName: params.packageName,
        targetDir: installRoot,
        timeoutMs,
        logger,
        peerDependencySnapshot: rollbackPeerDependencySnapshot,
      });
      await rollbackManagedNpmRootPreparedDependency({
        packageName: params.packageName,
        preparedDependency: prepared,
        logger,
      });
      return failure;
    };
    const syncManagedPeerDependenciesForInstall = async (options) => {
      try {
        return {
          ok: true,
          changed: await syncManagedNpmRootPeerDependencies({
            npmRoot,
            managedOverrides,
            omitUnsupportedManagedOverrides: options?.omitUnsupportedManagedOverrides,
            timeoutMs,
          }),
        };
      } catch (error) {
        return {
          ok: false,
          error: `npm peer dependency planning failed: ${error instanceof Error ? error.message : String(error)}`,
        };
      }
    };
    await upsertManagedNpmRootDependency({
      npmRoot,
      packageName: params.packageName,
      dependencySpec: prepared.dependencySpec,
      managedOverrides,
    });
    const initialPeerSync = await syncManagedPeerDependenciesForInstall();
    if (!initialPeerSync.ok)
      return await rollbackFailedManagedNpmInstall({
        ok: false,
        error: initialPeerSync.error,
      });
    const npmInstallArgs = [
      "npm",
      ...createSafeNpmInstallArgs({
        omitDev: true,
        omitPeer: true,
        loglevel: "error",
        legacyPeerDeps: true,
        noAudit: true,
        noFund: true,
      }),
    ];
    const npmInstallOptions = {
      cwd: npmRoot,
      timeoutMs: Math.max(timeoutMs, 3e5),
      env: createSafeNpmInstallEnv(process.env, {
        legacyPeerDeps: true,
        npmConfigCwd: npmRoot,
        packageLock: true,
        quiet: true,
      }),
    };
    let install = await runCommandWithTimeout(npmInstallArgs, npmInstallOptions);
    let omitUnsupportedManagedOverrides = false;
    if (install.code !== 0 && isNpmAliasOverrideComparatorError(install)) {
      logger.warn?.(
        "npm rejected managed npm alias overrides; retrying plugin install without alias overrides for this npm version.",
      );
      omitUnsupportedManagedOverrides = true;
      await upsertManagedNpmRootDependency({
        npmRoot,
        packageName: params.packageName,
        dependencySpec: prepared.dependencySpec,
        managedOverrides,
        omitUnsupportedManagedOverrides: true,
      });
      const aliasRetryPeerSync = await syncManagedPeerDependenciesForInstall({
        omitUnsupportedManagedOverrides: true,
      });
      if (!aliasRetryPeerSync.ok)
        return await rollbackFailedManagedNpmInstall({
          ok: false,
          error: aliasRetryPeerSync.error,
        });
      install = await runCommandWithTimeout(npmInstallArgs, npmInstallOptions);
    }
    if (install.code !== 0 && isManagedNpmProjectCorruptionInstallFailure(install)) {
      const originalError = formatNpmCommandFailureOutput(install);
      let quarantine;
      try {
        quarantine = await quarantineManagedNpmProjectRebuildArtifacts({ npmRoot });
      } catch (error) {
        return await rollbackFailedManagedNpmInstall({
          ok: false,
          error: `npm install failed with a managed npm project corruption signature, but OpenClaw could not quarantine ${npmRoot} for rebuild: ${String(error)}. Original npm error: ${originalError}`,
        });
      }
      logger.warn?.(
        `npm reported a managed npm project corruption signature; quarantined ${formatManagedNpmProjectQuarantineArtifacts(quarantine.movedArtifactNames)} at ${quarantine.quarantineDir} and rebuilding once before retrying.`,
      );
      preInstallRootPackageNames = await listManagedNpmRootPackageNames(npmRoot);
      const recoveryPeerSync = await syncManagedPeerDependenciesForInstall({
        omitUnsupportedManagedOverrides,
      });
      if (!recoveryPeerSync.ok)
        return await rollbackFailedManagedNpmInstallAfterQuarantine({
          ok: false,
          error: `managed npm project recovery failed after quarantining ${formatManagedNpmProjectQuarantineArtifacts(quarantine.movedArtifactNames)} at ${quarantine.quarantineDir}: ${recoveryPeerSync.error}. Original npm error: ${originalError}`,
        });
      install = await runCommandWithTimeout(npmInstallArgs, npmInstallOptions);
      if (install.code !== 0)
        return await rollbackFailedManagedNpmInstallAfterQuarantine({
          ok: false,
          error: `npm install failed after managed npm project recovery (quarantine: ${quarantine.quarantineDir}): ${formatNpmCommandFailureOutput(install)}. Original npm error: ${originalError}`,
        });
    }
    if (install.code !== 0)
      return await rollbackFailedManagedNpmInstall({
        ok: false,
        error: `npm install failed: ${formatNpmCommandFailureOutput(install)}`,
      });
    let settledManagedPeerDependencies = false;
    for (let peerSyncPass = 0; peerSyncPass < 10; peerSyncPass += 1) {
      const peerSync = await syncManagedPeerDependenciesForInstall({
        omitUnsupportedManagedOverrides,
      });
      if (!peerSync.ok)
        return await rollbackFailedManagedNpmInstall({
          ok: false,
          error: peerSync.error,
        });
      if (!peerSync.changed) {
        settledManagedPeerDependencies = true;
        break;
      }
      install = await runCommandWithTimeout(npmInstallArgs, npmInstallOptions);
      if (install.code !== 0)
        return await rollbackFailedManagedNpmInstall({
          ok: false,
          error: `npm install failed after syncing managed peer dependencies: ${install.stderr.trim() || install.stdout.trim()}`,
        });
    }
    if (!settledManagedPeerDependencies) {
      const peerSync = await syncManagedPeerDependenciesForInstall({
        omitUnsupportedManagedOverrides,
      });
      if (!peerSync.ok)
        return await rollbackFailedManagedNpmInstall({
          ok: false,
          error: peerSync.error,
        });
      settledManagedPeerDependencies = !peerSync.changed;
    }
    if (!settledManagedPeerDependencies)
      return await rollbackFailedManagedNpmInstall({
        ok: false,
        error:
          "npm install could not settle managed peer dependencies after 10 sync passes; refusing to leave a partially reconciled plugin dependency tree.",
      });
    const packageManifestResult = await readOptionalPackageManifest({
      runtime,
      packageDir: installRoot,
    });
    if (!packageManifestResult.ok)
      return await rollbackFailedManagedNpmInstall(packageManifestResult);
    const requiredPlatformPackageNames = resolveRequiredPlatformPackageNames(
      packageManifestResult.manifest
        ? runtime.getPackageManifestMetadata(packageManifestResult.manifest)
        : void 0,
    );
    if (!requiredPlatformPackageNames.ok)
      return await rollbackFailedManagedNpmInstall({
        ok: false,
        error: requiredPlatformPackageNames.error,
      });
    let omittedPlatformPackages;
    try {
      omittedPlatformPackages = await listMissingRequiredPlatformPackages({
        npmRoot,
        requiredPackageNames: requiredPlatformPackageNames.packageNames,
      });
    } catch (error) {
      return await rollbackFailedManagedNpmInstall({
        ok: false,
        error: `Failed to verify platform-specific npm dependencies for ${params.packageName}: ${String(error)}`,
      });
    }
    if (omittedPlatformPackages.length > 0) {
      const omittedPlatformPackageNames = omittedPlatformPackages.map((entry) => entry.name);
      logger.warn?.(
        `npm omitted current-platform package(s) ${omittedPlatformPackageNames.join(", ")}; retrying once with a fresh cache.`,
      );
      let freshCacheDir;
      try {
        freshCacheDir = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-npm-cache-"));
        install = await runCommandWithTimeout(npmInstallArgs, {
          ...npmInstallOptions,
          env: {
            ...npmInstallOptions.env,
            NPM_CONFIG_CACHE: freshCacheDir,
            npm_config_cache: freshCacheDir,
          },
        });
      } catch (error) {
        return await rollbackFailedManagedNpmInstall({
          ok: false,
          error: `Failed to repair omitted current-platform package(s) ${omittedPlatformPackageNames.join(", ")}: ${String(error)}`,
        });
      } finally {
        if (freshCacheDir)
          try {
            await fs$1.rm(freshCacheDir, {
              recursive: true,
              force: true,
            });
          } catch (error) {
            logger.warn?.(
              `Failed to remove temporary npm cache ${freshCacheDir}: ${String(error)}`,
            );
          }
      }
      if (install.code !== 0)
        return await rollbackFailedManagedNpmInstall({
          ok: false,
          error: `npm install failed while repairing omitted current-platform package(s) ${omittedPlatformPackageNames.join(", ")}: ${formatNpmCommandFailureOutput(install)}`,
        });
      let stillOmittedPlatformPackages;
      try {
        stillOmittedPlatformPackages = await listMissingRequiredPlatformPackages({
          npmRoot,
          requiredPackageNames: requiredPlatformPackageNames.packageNames,
        });
      } catch (error) {
        return await rollbackFailedManagedNpmInstall({
          ok: false,
          error: `Failed to verify repaired platform-specific npm dependencies for ${params.packageName}: ${String(error)}`,
        });
      }
      if (stillOmittedPlatformPackages.length > 0)
        return await rollbackFailedManagedNpmInstall({
          ok: false,
          error: `npm install reported success but omitted required current-platform package(s): ${stillOmittedPlatformPackages.map((entry) => entry.name).join(", ")}`,
        });
    }
    if (params.packageName !== "openclaw") {
      if (
        await repairManagedNpmRootOpenClawPeer({
          npmRoot,
          timeoutMs,
          logger,
        })
      )
        logger.info?.(`Repaired stale openclaw peer dependency in ${npmRoot} after npm install`);
    }
    try {
      await relinkOpenClawPeerDependenciesInManagedNpmRoot({
        npmRoot,
        logger,
      });
    } catch (error) {
      return await rollbackFailedManagedNpmInstall({
        ok: false,
        error: `Failed to repair openclaw peer links after npm install: ${String(error)}`,
      });
    }
    if (installedPackageNeedsOpenClawPeerLinkRepair(installRoot))
      return await rollbackFailedManagedNpmInstall({
        ok: false,
        error: formatUnresolvedOpenClawPeerLinkError(params.packageName),
      });
    let installedDependency;
    try {
      installedDependency = await readManagedNpmRootInstalledDependency({
        npmRoot,
        packageName: params.packageName,
      });
    } catch (error) {
      return await rollbackFailedManagedNpmInstall({
        ok: false,
        error: `Failed to verify npm install metadata for ${params.packageName}: ${String(error)}`,
      });
    }
    const resolutionMismatch = resolveInstalledNpmResolutionMismatch({
      packageName: params.packageName,
      expected: params.npmResolution,
      installed: installedDependency,
    });
    if (resolutionMismatch)
      return await rollbackFailedManagedNpmInstall({
        ok: false,
        error: resolutionMismatch,
      });
    const newRootPackageDirs = await listNewManagedNpmRootPackageDirs({
      beforeInstallPackageNames: preInstallRootPackageNames,
      npmRoot,
    });
    const result = await installPluginFromInstalledPackageDirInternal({
      dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
      config: params.config,
      additionalDependencyPackageDirs: newRootPackageDirs,
      packageDir: installRoot,
      dependencyScanRootDir: npmRoot,
      logger,
      expectedPluginId,
      trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
      mode: policyMode,
      installPolicyRequest: params.installPolicyRequest,
      emitSuccessSecurityEvent: false,
    });
    if (!result.ok) return await rollbackFailedManagedNpmInstall(result);
    return {
      ...result,
      npmResolution: params.npmResolution,
      ...(params.integrityDrift ? { integrityDrift: params.integrityDrift } : {}),
    };
  };
  try {
    const dependencyResult = await resolveManagedNpmRootDependencySpecForInstall({
      npmRoot,
      packageName: params.packageName,
      dependencySpec: params.dependencySpec,
      prepareDependencySpec: params.prepareDependencySpec,
    });
    if (!dependencyResult.ok) return dependencyResult;
    preparedDependency = dependencyResult;
    return await runManagedNpmInstall(preparedDependency);
  } finally {
    await cleanupManagedNpmRootPreparedDependency({
      packageName: params.packageName,
      preparedDependency,
      logger,
    });
    await cleanupManagedNpmPluginInstallRollbackSnapshot({
      snapshot: rollbackSnapshot,
      logger,
    });
  }
}
async function stageNpmPackArchiveInManagedRoot(params) {
  const archiveStoreDir = path.join(params.npmRoot, MANAGED_NPM_PACK_ARCHIVE_DIR);
  const identitySlug = sha256HexPrefix(params.integrity ?? params.shasum ?? params.tarballName, 16);
  const archiveFileName = `${safePluginInstallFileName(params.packageName) || "plugin"}-${safePluginInstallFileName(params.version ?? "pack") || "pack"}-${identitySlug}.tgz`;
  const stableArchivePath = path.join(archiveStoreDir, archiveFileName);
  const tempArchivePath = path.join(
    archiveStoreDir,
    `.${archiveFileName}.${process.pid}.${Date.now()}.tmp`,
  );
  let archiveStoreExisted = true;
  let backupTempDir;
  let previousArchiveBackupPath;
  const cleanupBackup = async () => {
    if (!backupTempDir) return;
    const tempDir = backupTempDir;
    backupTempDir = void 0;
    previousArchiveBackupPath = void 0;
    await fs$1.rm(tempDir, {
      recursive: true,
      force: true,
    });
  };
  try {
    await fs$1.access(archiveStoreDir);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    archiveStoreExisted = false;
  }
  try {
    await fs$1.access(stableArchivePath);
    backupTempDir = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-npm-pack-archive-"));
    previousArchiveBackupPath = path.join(backupTempDir, archiveFileName);
    await fs$1.copyFile(stableArchivePath, previousArchiveBackupPath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      await cleanupBackup();
      throw error;
    }
  }
  try {
    await fs$1.mkdir(archiveStoreDir, { recursive: true });
    await fs$1.copyFile(params.archivePath, tempArchivePath);
    await fs$1.rename(tempArchivePath, stableArchivePath);
  } catch (error) {
    await fs$1.rm(tempArchivePath, { force: true });
    await cleanupBackup();
    if (!archiveStoreExisted) await removeEmptyDirectoryIfPresent(archiveStoreDir);
    throw error;
  }
  return {
    stableArchivePath,
    dependencySpec: `file:./${path.posix.join(MANAGED_NPM_PACK_ARCHIVE_DIR, archiveFileName)}`,
    rollback: async () => {
      if (previousArchiveBackupPath) {
        await fs$1.mkdir(archiveStoreDir, { recursive: true });
        await fs$1.copyFile(previousArchiveBackupPath, stableArchivePath);
      } else await fs$1.rm(stableArchivePath, { force: true });
      await cleanupBackup();
      if (!archiveStoreExisted) await removeEmptyDirectoryIfPresent(archiveStoreDir);
    },
    cleanup: cleanupBackup,
  };
}
function pickPackageInstallCommonParams(params) {
  return {
    config: params.config,
    dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
    trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
    extensionsDir: params.extensionsDir,
    npmDir: params.npmDir,
    timeoutMs: params.timeoutMs,
    logger: params.logger,
    mode: params.mode,
    dryRun: params.dryRun,
    expectedPluginId: params.expectedPluginId,
    requirePluginManifest: params.requirePluginManifest,
    allowSourceTypeScriptEntries: params.allowSourceTypeScriptEntries,
    installPolicyRequest: params.installPolicyRequest,
    onEffectiveMode: params.onEffectiveMode,
  };
}
function installPolicyRequestForPath(params, kind) {
  const requestKind =
    params.installPolicyRequest?.kind === "plugin-git" && kind === "plugin-dir"
      ? "plugin-git"
      : kind;
  return {
    kind: requestKind,
    requestedSpecifier: params.installPolicyRequest?.requestedSpecifier ?? params.path,
    source: params.installPolicyRequest?.source ?? localPluginInstallPolicySource(requestKind),
  };
}
function localPluginInstallPolicySource(kind) {
  if (kind === "plugin-archive")
    return {
      kind: "archive",
      authority: "user",
      mutable: true,
      network: false,
    };
  if (kind === "plugin-git")
    return {
      kind: "git",
      authority: "third-party",
      mutable: true,
      network: true,
    };
  return {
    kind: "local-path",
    authority: "user",
    mutable: true,
    network: false,
  };
}
function sourceFamilyForInstallPolicyKind(kind, fallback) {
  switch (kind) {
    case "plugin-archive":
      return "archive";
    case "plugin-dir":
      return "directory";
    case "plugin-git":
      return "git";
    case "plugin-npm":
      return "npm";
    case void 0:
      return fallback;
  }
  return fallback;
}
function sourceFamilyForInstallPolicySource(source, fallback) {
  switch (source?.kind) {
    case "archive":
      return "archive";
    case "file":
      return "file";
    case "git":
      return "git";
    case "npm":
      return "npm";
    case "bundled":
    case "clawhub":
    case "local-path":
    case "managed":
    case "upload":
    case "workspace":
    case void 0:
      return fallback;
  }
  return fallback;
}
async function ensureInstallTargetAvailableForMode(params) {
  return await params.runtime.ensureInstallTargetAvailable({
    mode: params.mode,
    targetDir: params.targetPath,
    alreadyExistsError: `plugin already exists: ${params.targetPath} (delete it first)`,
  });
}
async function resolvePreparedDirectoryInstallTarget(params) {
  const targetDirResult = await resolvePluginInstallTarget({
    runtime: params.runtime,
    pluginId: params.pluginId,
    extensionsDir: params.extensionsDir,
    nameEncoder: params.nameEncoder,
  });
  if (!targetDirResult.ok) return targetDirResult;
  return {
    ok: true,
    target: {
      targetPath: targetDirResult.targetDir,
      effectiveMode: await resolveEffectiveInstallMode({
        runtime: params.runtime,
        requestedMode: params.requestedMode,
        targetPath: targetDirResult.targetDir,
      }),
    },
  };
}
async function runInstallSourceScan(params) {
  try {
    const scanResult = await params.scan();
    if (scanResult?.blocked) {
      const reason =
        scanResult.blocked.code === "security_scan_failed"
          ? "security_scan_failed"
          : "security_scan_blocked";
      emitPluginAuditSecurityEvent({
        outcome: pluginAuditOutcomeForReason(reason),
        reason,
        pluginId: params.pluginId,
        mode: params.mode,
        sourceFamily: params.sourceFamily,
      });
      return buildBlockedInstallResult({ blocked: scanResult.blocked });
    }
    return null;
  } catch (err) {
    emitPluginAuditSecurityEvent({
      outcome: "error",
      reason: "security_scan_failed",
      pluginId: params.pluginId,
      mode: params.mode,
      sourceFamily: params.sourceFamily,
    });
    return {
      ok: false,
      error: `${params.subject} installation blocked: code safety scan failed (${String(err)}). Run "openclaw security audit --deep" for details.`,
      code: PLUGIN_INSTALL_ERROR_CODE.SECURITY_SCAN_FAILED,
    };
  }
}
async function installPluginDirectoryIntoExtensions(params) {
  const runtime = await loadPluginInstallRuntime();
  let targetDir = params.targetDir;
  if (!targetDir) {
    const targetDirResult = await resolvePluginInstallTarget({
      runtime,
      pluginId: params.pluginId,
      extensionsDir: params.extensionsDir,
      nameEncoder: params.nameEncoder,
    });
    if (!targetDirResult.ok)
      return {
        ok: false,
        error: targetDirResult.error,
      };
    targetDir = targetDirResult.targetDir;
  }
  const availability = await ensureInstallTargetAvailableForMode({
    runtime,
    targetPath: targetDir,
    mode: params.mode,
  });
  if (!availability.ok) return availability;
  if (params.dryRun)
    return buildDirectoryInstallResult({
      pluginId: params.pluginId,
      targetDir,
      manifestName: params.manifestName,
      version: params.version,
      extensions: params.extensions,
    });
  const installRes = await runtime.installPackageDir({
    sourceDir: params.sourceDir,
    targetDir,
    mode: params.mode,
    timeoutMs: params.timeoutMs,
    logger: params.logger,
    copyErrorPrefix: params.copyErrorPrefix,
    hasDeps: params.hasDeps,
    sourceHardlinks: params.sourceHardlinks ?? "reject",
    depsLogMessage: params.depsLogMessage,
    afterCopy: params.afterCopy,
    afterInstall: async (installedDir) => {
      const postInstallResult = await params.afterInstall?.(installedDir);
      if (!postInstallResult) return { ok: true };
      return {
        ok: false,
        error: postInstallResult.error,
        ...(postInstallResult.code ? { code: postInstallResult.code } : {}),
      };
    },
  });
  if (!installRes.ok)
    return {
      ok: false,
      error: installRes.error,
      ...(installRes.code ? { code: installRes.code } : {}),
    };
  return buildDirectoryInstallResult({
    pluginId: params.pluginId,
    targetDir,
    manifestName: params.manifestName,
    version: params.version,
    extensions: params.extensions,
  });
}
async function resolvePluginInstallTarget(params) {
  const extensionsDir = params.extensionsDir
    ? resolveUserPath(params.extensionsDir)
    : resolveDefaultPluginExtensionsDir();
  return await params.runtime.resolveCanonicalInstallTarget({
    baseDir: extensionsDir,
    id: params.pluginId,
    invalidNameMessage: "invalid plugin name: path traversal detected",
    boundaryLabel: "extensions directory",
    nameEncoder: params.nameEncoder,
  });
}
async function resolveEffectiveInstallMode(params) {
  if (params.requestedMode !== "update") return "install";
  return (await params.runtime.fileExists(params.targetPath)) ? "update" : "install";
}
async function installBundleFromSourceDir(params) {
  const runtime = await loadPluginInstallRuntime();
  const bundleFormat = runtime.detectBundleManifestFormat(params.sourceDir);
  if (!bundleFormat) return null;
  const { logger, timeoutMs, mode, dryRun } = runtime.resolveTimedInstallModeOptions(
    params,
    defaultLogger,
  );
  const manifestRes = runtime.loadBundleManifest({
    rootDir: params.sourceDir,
    bundleFormat,
    rejectHardlinks: true,
  });
  if (!manifestRes.ok)
    return {
      ok: false,
      error: manifestRes.error,
    };
  const pluginId = manifestRes.manifest.id;
  const pluginIdError = validatePluginId(pluginId);
  if (pluginIdError)
    return {
      ok: false,
      error: pluginIdError,
    };
  if (params.expectedPluginId && params.expectedPluginId !== pluginId)
    return {
      ok: false,
      error: `plugin id mismatch: expected ${params.expectedPluginId}, got ${pluginId}`,
      code: PLUGIN_INSTALL_ERROR_CODE.PLUGIN_ID_MISMATCH,
    };
  const packageManifestResult = await readOptionalPackageManifest({
    runtime,
    packageDir: params.sourceDir,
  });
  if (!packageManifestResult.ok) return packageManifestResult;
  const compatibilityError = validateOpenClawPackageInstallCompatibility({
    runtime,
    pluginId,
    packageMetadata: packageManifestResult.manifest
      ? runtime.getPackageManifestMetadata(packageManifestResult.manifest)
      : void 0,
  });
  if (compatibilityError) return compatibilityError;
  const targetResult = await resolvePreparedDirectoryInstallTarget({
    runtime,
    pluginId,
    extensionsDir: params.extensionsDir,
    requestedMode: mode,
  });
  if (!targetResult.ok)
    return {
      ok: false,
      error: targetResult.error,
    };
  params.onEffectiveMode?.(targetResult.target.effectiveMode);
  const scanResult = await runInstallSourceScan({
    subject: `Bundle "${pluginId}"`,
    pluginId,
    mode: targetResult.target.effectiveMode,
    sourceFamily: sourceFamilyForInstallPolicyKind(params.installPolicyRequest?.kind, "archive"),
    scan: async () =>
      await runtime.scanBundleInstallSource({
        dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
        config: params.config,
        sourceDir: params.sourceDir,
        pluginId,
        logger,
        requestKind: params.installPolicyRequest?.kind,
        requestedSpecifier: params.installPolicyRequest?.requestedSpecifier,
        source: params.installPolicyRequest?.source,
        mode: targetResult.target.effectiveMode,
        version: manifestRes.manifest.version,
      }),
  });
  if (scanResult) return scanResult;
  return await installPluginDirectoryIntoExtensions({
    sourceDir: params.sourceDir,
    pluginId,
    manifestName: manifestRes.manifest.name,
    version: manifestRes.manifest.version,
    extensions: [],
    targetDir: targetResult.target.targetPath,
    extensionsDir: params.extensionsDir,
    logger,
    timeoutMs,
    mode: targetResult.target.effectiveMode,
    dryRun,
    copyErrorPrefix: "failed to copy plugin bundle",
    hasDeps: false,
    depsLogMessage: "",
  });
}
async function installPluginFromSourceDir(params) {
  if (await detectNativePackageInstallSource(params.sourceDir))
    return await installPluginFromPackageDir({
      packageDir: params.sourceDir,
      ...pickPackageInstallCommonParams(params),
    });
  const bundleResult = await installBundleFromSourceDir({
    sourceDir: params.sourceDir,
    ...pickPackageInstallCommonParams(params),
  });
  if (bundleResult) return bundleResult;
  return await installPluginFromPackageDir({
    packageDir: params.sourceDir,
    ...pickPackageInstallCommonParams(params),
  });
}
async function detectNativePackageInstallSource(packageDir) {
  const runtime = await loadPluginInstallRuntime();
  const manifestPath = path.join(packageDir, "package.json");
  if (!(await runtime.fileExists(manifestPath))) return false;
  try {
    return ensureOpenClawExtensions({ manifest: await runtime.readJsonFile(manifestPath) }).ok;
  } catch {
    return false;
  }
}
async function validatePackagePluginInstallSource(params) {
  const manifestPath = path.join(params.packageDir, "package.json");
  if (!(await params.runtime.fileExists(manifestPath)))
    return {
      ok: false,
      error: "extracted package missing package.json",
    };
  let manifest;
  try {
    manifest = await params.runtime.readJsonFile(manifestPath);
  } catch (err) {
    return {
      ok: false,
      error: `invalid package.json: ${String(err)}`,
    };
  }
  const pkgName = normalizeOptionalString(manifest.name) ?? "";
  const npmPluginId = pkgName || "plugin";
  const ocManifestResult = params.runtime.loadPluginManifest(params.packageDir);
  if (!ocManifestResult.ok && params.requirePluginManifest)
    return {
      ok: false,
      error: `package missing valid openclaw.plugin.json: ${ocManifestResult.error}`,
      code: PLUGIN_INSTALL_ERROR_CODE.MISSING_PLUGIN_MANIFEST,
    };
  const manifestPluginId =
    ocManifestResult.ok && ocManifestResult.manifest.id
      ? ocManifestResult.manifest.id.trim()
      : void 0;
  const pluginId = manifestPluginId ?? npmPluginId;
  const pluginIdError = validatePluginId(pluginId);
  if (pluginIdError)
    return {
      ok: false,
      error: pluginIdError,
    };
  if (
    !matchesExpectedPluginId({
      expectedPluginId: params.expectedPluginId,
      pluginId,
      manifestPluginId,
      npmPluginId,
    })
  )
    return {
      ok: false,
      error: `plugin id mismatch: expected ${params.expectedPluginId}, got ${pluginId}`,
      code: PLUGIN_INSTALL_ERROR_CODE.PLUGIN_ID_MISMATCH,
    };
  if (manifestPluginId && !packageNameMatchesId(npmPluginId, manifestPluginId))
    params.logger.info?.(
      `Plugin manifest id "${manifestPluginId}" differs from npm package name "${npmPluginId}"; using manifest id as the config key.`,
    );
  const packageMetadata = params.runtime.getPackageManifestMetadata(manifest);
  const compatibilityError = validateOpenClawPackageInstallCompatibility({
    runtime: params.runtime,
    pluginId,
    packageMetadata,
  });
  if (compatibilityError) return compatibilityError;
  const extensionsResult = ensureOpenClawExtensions({ manifest });
  if (!extensionsResult.ok)
    return {
      ok: false,
      error: extensionsResult.error,
      code: extensionsResult.code,
    };
  const extensions = extensionsResult.entries;
  const extensionValidation = await validatePackageExtensionEntriesForInstall({
    packageDir: params.packageDir,
    extensions,
    manifest,
    allowSourceTypeScriptEntries: params.allowSourceTypeScriptEntries,
  });
  if (!extensionValidation.ok)
    return {
      ok: false,
      error: extensionValidation.error,
      code: PLUGIN_INSTALL_ERROR_CODE.INVALID_OPENCLAW_EXTENSIONS,
    };
  const scanMode = params.resolveEffectiveMode
    ? await params.resolveEffectiveMode(pluginId)
    : params.mode;
  const scanResult = await runInstallSourceScan({
    subject: `Plugin "${pluginId}"`,
    pluginId,
    mode: scanMode,
    sourceFamily: sourceFamilyForInstallPolicySource(
      params.installPolicyRequest?.source,
      sourceFamilyForInstallPolicyKind(params.installPolicyRequest?.kind, "installed-package"),
    ),
    scan: async () =>
      await params.runtime.scanPackageInstallSource({
        dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
        trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
        packageDir: params.packageDir,
        config: params.config,
        pluginId,
        logger: params.logger,
        extensions,
        ...(packageMetadata ? { packageMetadata } : {}),
        requestKind: params.installPolicyRequest?.kind,
        requestedSpecifier: params.installPolicyRequest?.requestedSpecifier,
        source: params.installPolicyRequest?.source,
        mode: scanMode,
        packageName: pkgName || void 0,
        manifestId: manifestPluginId,
        version: typeof manifest.version === "string" ? manifest.version : void 0,
      }),
  });
  if (scanResult) return scanResult;
  return {
    ok: true,
    plugin: {
      manifest,
      pluginId,
      manifestName: pkgName || void 0,
      version: typeof manifest.version === "string" ? manifest.version : void 0,
      extensions,
      hasRuntimeDependencies: hasPackageRuntimeDependencies(manifest),
      peerDependencies: manifest.peerDependencies ?? {},
    },
  };
}
async function scanAndLinkInstalledPackage(params) {
  const scanResult = await runInstallSourceScan({
    subject: `Plugin "${params.pluginId}"`,
    pluginId: params.pluginId,
    mode: params.mode,
    sourceFamily: sourceFamilyForInstallPolicySource(
      params.source,
      sourceFamilyForInstallPolicyKind(params.requestKind, "installed-package"),
    ),
    scan: async () =>
      await params.runtime.scanInstalledPackageDependencyTree({
        ...(params.additionalDependencyPackageDirs
          ? { additionalPackageDirs: params.additionalDependencyPackageDirs }
          : {}),
        allowManagedNpmRootPackagePeerSymlinks:
          params.dependencyScanRootDir !== void 0 &&
          path.resolve(params.dependencyScanRootDir) !== path.resolve(params.installedDir),
        dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
        dependencyScanRootDir: params.dependencyScanRootDir,
        logger: params.logger,
        mode: params.mode,
        packageDir: params.installedDir,
        pluginId: params.pluginId,
        config: params.config,
        ...(params.requestKind ? { requestKind: params.requestKind } : {}),
        requestedSpecifier: params.requestedSpecifier,
        source: params.source,
        trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
      }),
  });
  if (scanResult) return scanResult;
  if (
    (
      await linkOpenClawPeerDependencies({
        installedDir: params.installedDir,
        peerDependencies: params.peerDependencies,
        logger: params.logger,
      })
    ).skipped > 0
  )
    return {
      ok: false,
      error: formatUnresolvedOpenClawPeerLinkError(params.pluginId),
    };
  return null;
}
async function installPluginFromInstalledPackageDir(params) {
  return await installPluginFromInstalledPackageDirInternal(params);
}
async function installPluginFromInstalledPackageDirInternal(params) {
  const runtime = await loadPluginInstallRuntime();
  const { logger } = runtime.resolveTimedInstallModeOptions(params, defaultLogger);
  const validated = await validatePackagePluginInstallSource({
    runtime,
    packageDir: params.packageDir,
    expectedPluginId: params.expectedPluginId,
    requirePluginManifest: params.requirePluginManifest,
    allowSourceTypeScriptEntries: params.allowSourceTypeScriptEntries,
    dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
    trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
    config: params.config,
    installPolicyRequest: params.installPolicyRequest,
    logger,
    mode: params.mode ?? "install",
  });
  if (!validated.ok) return validated;
  const postInstallError = await scanAndLinkInstalledPackage({
    runtime,
    installedDir: params.packageDir,
    ...(params.additionalDependencyPackageDirs
      ? { additionalDependencyPackageDirs: params.additionalDependencyPackageDirs }
      : {}),
    dependencyScanRootDir: params.dependencyScanRootDir,
    pluginId: validated.plugin.pluginId,
    peerDependencies: validated.plugin.peerDependencies,
    dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
    trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
    config: params.config,
    mode: params.mode ?? "install",
    ...(params.installPolicyRequest?.kind ? { requestKind: params.installPolicyRequest.kind } : {}),
    requestedSpecifier: params.installPolicyRequest?.requestedSpecifier,
    source: params.installPolicyRequest?.source,
    logger,
  });
  if (postInstallError) return postInstallError;
  const result = buildDirectoryInstallResult({
    pluginId: validated.plugin.pluginId,
    targetDir: params.packageDir,
    manifestName: validated.plugin.manifestName,
    version: validated.plugin.version,
    extensions: validated.plugin.extensions,
  });
  if (params.emitSuccessSecurityEvent !== false)
    emitSuccessfulPluginInstallSecurityEvent(result, {
      dryRun: params.dryRun,
      mode: params.mode ?? "install",
      sourceFamily: sourceFamilyForInstallPolicyKind(
        params.installPolicyRequest?.kind,
        "installed-package",
      ),
      trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
    });
  return result;
}
async function installPluginFromPackageDir(params) {
  const runtime = await loadPluginInstallRuntime();
  const { logger, timeoutMs, mode, dryRun } = runtime.resolveTimedInstallModeOptions(
    params,
    defaultLogger,
  );
  let preparedTarget;
  const resolvePreparedTargetForPluginId = async (pluginId) => {
    if (!preparedTarget) {
      const targetResult = await resolvePreparedDirectoryInstallTarget({
        runtime,
        pluginId,
        extensionsDir: params.extensionsDir,
        requestedMode: mode,
        nameEncoder: encodePluginInstallDirName,
      });
      if (!targetResult.ok) throw new Error(targetResult.error);
      preparedTarget = targetResult.target;
    }
    return preparedTarget;
  };
  const validated = await validatePackagePluginInstallSource({
    runtime,
    packageDir: params.packageDir,
    expectedPluginId: params.expectedPluginId,
    requirePluginManifest: params.requirePluginManifest,
    allowSourceTypeScriptEntries: params.allowSourceTypeScriptEntries,
    dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
    trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
    config: params.config,
    installPolicyRequest: params.installPolicyRequest,
    logger,
    mode,
    resolveEffectiveMode: async (pluginId) =>
      (await resolvePreparedTargetForPluginId(pluginId)).effectiveMode,
  });
  if (!validated.ok) return validated;
  const { plugin } = validated;
  preparedTarget = await resolvePreparedTargetForPluginId(plugin.pluginId);
  const effectiveMode = preparedTarget.effectiveMode;
  params.onEffectiveMode?.(effectiveMode);
  const hasBundleManifest = Boolean(runtime.detectBundleManifestFormat(params.packageDir));
  const shouldInstallRuntimeDeps =
    plugin.hasRuntimeDependencies &&
    !hasBundleManifest &&
    params.installPolicyRequest?.kind === "plugin-archive";
  return await installPluginDirectoryIntoExtensions({
    sourceDir: params.packageDir,
    pluginId: plugin.pluginId,
    manifestName: plugin.manifestName,
    version: plugin.version,
    extensions: plugin.extensions,
    targetDir: preparedTarget.targetPath,
    extensionsDir: params.extensionsDir,
    logger,
    timeoutMs,
    mode: effectiveMode,
    dryRun,
    copyErrorPrefix: "failed to copy plugin",
    hasDeps: shouldInstallRuntimeDeps,
    sourceHardlinks: shouldInstallRuntimeDeps ? "package-manager" : "reject",
    depsLogMessage: "Installing plugin dependencies…",
    nameEncoder: encodePluginInstallDirName,
    afterInstall: async (installedDir) => {
      return await scanAndLinkInstalledPackage({
        runtime,
        installedDir,
        pluginId: plugin.pluginId,
        peerDependencies: plugin.peerDependencies,
        dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
        trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
        config: params.config,
        mode: effectiveMode,
        ...(params.installPolicyRequest?.kind
          ? { requestKind: params.installPolicyRequest.kind }
          : {}),
        requestedSpecifier: params.installPolicyRequest?.requestedSpecifier,
        source: params.installPolicyRequest?.source,
        logger,
      });
    },
  });
}
async function installPluginFromArchive(params) {
  const runtime = await loadPluginInstallRuntime();
  const logger = params.logger ?? defaultLogger;
  const timeoutMs = params.timeoutMs ?? 12e4;
  const mode = params.mode ?? "install";
  const installPolicyRequest = params.installPolicyRequest ?? {
    kind: "plugin-archive",
    requestedSpecifier: params.archivePath,
    source: localPluginInstallPolicySource("plugin-archive"),
  };
  const archivePathResult = await runtime.resolveArchiveSourcePath(params.archivePath);
  if (!archivePathResult.ok) return archivePathResult;
  const archivePath = archivePathResult.path;
  let effectiveMode = mode;
  const result = await runtime.withExtractedArchiveRoot({
    archivePath,
    tempDirPrefix: "openclaw-plugin-",
    timeoutMs,
    logger,
    rootMarkers: PLUGIN_ARCHIVE_ROOT_MARKERS,
    onExtracted: async (sourceDir) =>
      await installPluginFromSourceDir({
        sourceDir,
        ...pickPackageInstallCommonParams({
          dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
          extensionsDir: params.extensionsDir,
          timeoutMs,
          logger,
          mode,
          dryRun: params.dryRun,
          config: params.config,
          expectedPluginId: params.expectedPluginId,
          trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
          requirePluginManifest: true,
          installPolicyRequest,
          onEffectiveMode: (resolvedMode) => {
            effectiveMode = resolvedMode;
          },
        }),
      }),
  });
  emitSuccessfulPluginInstallSecurityEvent(result, {
    dryRun: params.dryRun,
    mode: effectiveMode,
    sourceFamily: "archive",
    trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
  });
  return result;
}
async function installPluginFromDir(params) {
  const runtime = await loadPluginInstallRuntime();
  const dirPath = resolveUserPath(params.dirPath);
  const installPolicyRequest = params.installPolicyRequest ?? {
    kind: "plugin-dir",
    requestedSpecifier: params.dirPath,
    source: localPluginInstallPolicySource("plugin-dir"),
  };
  if (!(await runtime.fileExists(dirPath)))
    return {
      ok: false,
      error: `directory not found: ${dirPath}`,
    };
  if (!(await fs$1.stat(dirPath)).isDirectory())
    return {
      ok: false,
      error: `not a directory: ${dirPath}`,
    };
  let effectiveMode = params.mode ?? "install";
  const result = await installPluginFromSourceDir({
    sourceDir: dirPath,
    ...pickPackageInstallCommonParams({
      ...params,
      installPolicyRequest,
      onEffectiveMode: (resolvedMode) => {
        effectiveMode = resolvedMode;
      },
    }),
  });
  emitSuccessfulPluginInstallSecurityEvent(result, {
    dryRun: params.dryRun,
    mode: effectiveMode,
    sourceFamily: sourceFamilyForInstallPolicyKind(installPolicyRequest.kind, "directory"),
    trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
  });
  return result;
}
async function installPluginFromNpmSpec(params) {
  const runtime = await loadPluginInstallRuntime();
  const { logger, timeoutMs, mode, dryRun } = runtime.resolveTimedInstallModeOptions(
    params,
    defaultLogger,
  );
  const expectedPluginId = params.expectedPluginId;
  const spec = params.spec.trim();
  const specError = runtime.validateRegistryNpmSpec(spec);
  if (specError)
    return {
      ok: false,
      error: specError,
      code: PLUGIN_INSTALL_ERROR_CODE.INVALID_NPM_SPEC,
    };
  const parsedSpec = parseRegistryNpmSpec(spec);
  if (!parsedSpec)
    return {
      ok: false,
      error: "unsupported npm spec",
      code: PLUGIN_INSTALL_ERROR_CODE.INVALID_NPM_SPEC,
    };
  const metadataResult = await resolveNpmSpecMetadata({
    spec,
    timeoutMs,
  });
  if (!metadataResult.ok)
    return {
      ok: false,
      error: metadataResult.error,
      ...(isNpmPackageNotFoundMessage(metadataResult.error)
        ? { code: PLUGIN_INSTALL_ERROR_CODE.NPM_PACKAGE_NOT_FOUND }
        : {}),
    };
  const npmResolution = {
    ...metadataResult.metadata,
    resolvedAt: /* @__PURE__ */ new Date().toISOString(),
  };
  if (
    npmResolution.version &&
    !isPrereleaseResolutionAllowed({
      spec: parsedSpec,
      resolvedVersion: npmResolution.version,
    })
  ) {
    const trustedResolution = params.trustedSourceLinkedOfficialInstall
      ? await resolveTrustedOfficialPrereleaseResolution({
          spec: parsedSpec,
          resolvedPrereleaseVersion: npmResolution.version,
          timeoutMs,
          logger,
        })
      : null;
    if (trustedResolution?.kind === "stable" || trustedResolution?.kind === "prerelease-only")
      Object.assign(npmResolution, trustedResolution.resolution, {
        resolvedAt: npmResolution.resolvedAt,
      });
    else if (trustedResolution?.kind === "allow-prerelease-only") {
    } else
      return {
        ok: false,
        error: formatPrereleaseResolutionError({
          spec: parsedSpec,
          resolvedVersion: npmResolution.version,
        }),
      };
  }
  let compatibilityError = validateNpmResolutionCompatibility({
    runtime,
    parsedSpec,
    expectedPluginId,
    resolution: npmResolution,
  });
  if (compatibilityError && canResolveAroundCompatibilityError(compatibilityError)) {
    const compatibleResolution = await resolveLatestCompatibleNpmResolution({
      runtime,
      parsedSpec,
      expectedPluginId,
      currentResolution: npmResolution,
      timeoutMs,
      logger,
    });
    if (compatibleResolution) {
      Object.assign(npmResolution, compatibleResolution, { resolvedAt: npmResolution.resolvedAt });
      compatibilityError = validateNpmResolutionCompatibility({
        runtime,
        parsedSpec,
        expectedPluginId,
        resolution: npmResolution,
      });
    }
  }
  if (compatibilityError) return compatibilityError;
  const npmInstallPolicySource = {
    kind: "npm",
    authority: params.trustedSourceLinkedOfficialInstall ? "official" : "third-party",
    mutable: false,
    network: true,
  };
  const driftResult = await resolveNpmIntegrityDriftWithDefaultMessage({
    spec,
    expectedIntegrity: params.expectedIntegrity,
    resolution: npmResolution,
    onIntegrityDrift: params.onIntegrityDrift,
    warn: (message) => logger.warn?.(message),
  });
  if (driftResult.error)
    return {
      ok: false,
      error: driftResult.error,
    };
  const npmBaseDir = params.npmDir ? resolveUserPath(params.npmDir) : resolveDefaultPluginNpmDir();
  const generationUse = await resolveManagedNpmGenerationUseForInstall({
    runtime,
    npmBaseDir,
    packageName: parsedSpec.name,
    requestedMode: mode,
    npmResolution,
  });
  const installRoot = resolveManagedNpmRootPackageDir(
    resolveManagedNpmRootForInstall({
      npmBaseDir,
      packageName: parsedSpec.name,
      npmResolution,
      useGeneration: generationUse !== "none",
    }),
    parsedSpec.name,
  );
  const targetMode =
    generationUse === "retained-install" && hasRetainedManagedNpmInstallMarker(installRoot)
      ? "update"
      : await resolveEffectiveInstallMode({
          runtime,
          requestedMode: mode,
          targetPath: installRoot,
        });
  const policyMode =
    generationUse === "update"
      ? "update"
      : generationUse === "retained-install"
        ? "install"
        : targetMode;
  const policyTempDir = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-npm-policy-"));
  try {
    const policyMetadataPath = path.join(policyTempDir, "npm-package-metadata.json");
    await fs$1.writeFile(
      policyMetadataPath,
      `${JSON.stringify(
        {
          packageName: parsedSpec.name,
          requestedSpecifier: spec,
          resolution: npmResolution,
        },
        null,
        2,
      )}\n`,
      "utf8",
    );
    const preflightPolicyResult = await runInstallSourceScan({
      subject: `Plugin "${expectedPluginId ?? parsedSpec.name}"`,
      pluginId: expectedPluginId ?? parsedSpec.name,
      mode: policyMode,
      sourceFamily: "npm",
      scan: async () =>
        await preflightPluginNpmInstallPolicy({
          config: params.config,
          logger,
          mode: policyMode,
          packageName: parsedSpec.name,
          ...(expectedPluginId ? { pluginId: expectedPluginId } : {}),
          requestedSpecifier: spec,
          source: npmInstallPolicySource,
          sourcePath: policyMetadataPath,
          sourcePathKind: "file",
        }),
    });
    if (preflightPolicyResult) return preflightPolicyResult;
  } finally {
    await fs$1.rm(policyTempDir, {
      recursive: true,
      force: true,
    });
  }
  const result = await installPluginFromManagedNpmRoot({
    dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
    trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
    config: params.config,
    packageName: parsedSpec.name,
    dependencySpec: resolveManagedNpmRootDependencySpec({
      parsedSpec,
      resolution: npmResolution,
    }),
    displaySpec: spec,
    installPolicyRequest: {
      kind: "plugin-npm",
      requestedSpecifier: spec,
      source: npmInstallPolicySource,
    },
    extensionsDir: params.extensionsDir,
    npmDir: params.npmDir,
    timeoutMs,
    logger,
    mode,
    dryRun,
    skipPolicyPreflight: true,
    expectedPluginId,
    npmResolution,
    ...(driftResult.integrityDrift ? { integrityDrift: driftResult.integrityDrift } : {}),
  });
  emitSuccessfulPluginInstallSecurityEvent(result, {
    dryRun,
    mode: policyMode,
    sourceFamily: "npm",
    trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
  });
  return result;
}
async function installPluginFromNpmPackArchive(params) {
  const runtime = await loadPluginInstallRuntime();
  const { logger, timeoutMs, mode, dryRun } = runtime.resolveTimedInstallModeOptions(
    params,
    defaultLogger,
  );
  const metadataResult = await resolveNpmPackArchiveMetadata({
    archivePath: params.archivePath,
    timeoutMs,
  });
  if (!metadataResult.ok) return metadataResult;
  const npmResolution = {
    ...metadataResult.metadata,
    resolvedAt: /* @__PURE__ */ new Date().toISOString(),
  };
  const driftResult = await resolveNpmIntegrityDriftWithDefaultMessage({
    spec: metadataResult.archivePath,
    expectedIntegrity: params.expectedIntegrity,
    resolution: npmResolution,
    onIntegrityDrift: params.onIntegrityDrift,
    warn: (message) => logger.warn?.(message),
  });
  if (driftResult.error)
    return {
      ok: false,
      error: driftResult.error,
    };
  const packageNameResult = resolveTrustedNpmPackPackageName(metadataResult.metadata.name);
  if (!packageNameResult.ok) return packageNameResult;
  const packageName = packageNameResult.packageName;
  const npmBaseDir = params.npmDir ? resolveUserPath(params.npmDir) : resolveDefaultPluginNpmDir();
  const generationUse = await resolveManagedNpmGenerationUseForInstall({
    runtime,
    npmBaseDir,
    packageName,
    requestedMode: mode,
    npmResolution,
  });
  const installRoot = resolveManagedNpmRootPackageDir(
    resolveManagedNpmRootForInstall({
      npmBaseDir,
      packageName,
      npmResolution,
      useGeneration: generationUse !== "none",
    }),
    packageName,
  );
  const targetMode =
    generationUse === "retained-install" && hasRetainedManagedNpmInstallMarker(installRoot)
      ? "update"
      : await resolveEffectiveInstallMode({
          runtime,
          requestedMode: mode,
          targetPath: installRoot,
        });
  const policyMode =
    generationUse === "update"
      ? "update"
      : generationUse === "retained-install"
        ? "install"
        : targetMode;
  const result = await installPluginFromManagedNpmRoot({
    dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
    trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
    config: params.config,
    packageName,
    prepareDependencySpec: async ({ npmRoot }) => {
      try {
        return {
          ok: true,
          ...(await stageNpmPackArchiveInManagedRoot({
            archivePath: metadataResult.archivePath,
            npmRoot,
            packageName,
            version: metadataResult.metadata.version,
            integrity: metadataResult.metadata.integrity,
            shasum: metadataResult.metadata.shasum,
            tarballName: metadataResult.tarballName,
          })),
        };
      } catch (error) {
        return {
          ok: false,
          error: `Failed to stage npm pack archive in managed npm root: ${String(error)}`,
        };
      }
    },
    displaySpec: metadataResult.archivePath,
    installPolicyRequest: {
      kind: "plugin-npm",
      requestedSpecifier: `npm-pack:${metadataResult.archivePath}`,
      source: {
        kind: "archive",
        authority: "user",
        mutable: true,
        network: false,
      },
    },
    policyPreflightSourcePath: metadataResult.archivePath,
    policyPreflightSourcePathKind: "file",
    extensionsDir: params.extensionsDir,
    npmDir: npmBaseDir,
    timeoutMs,
    logger,
    mode,
    dryRun,
    expectedPluginId: params.expectedPluginId,
    npmResolution,
    ...(driftResult.integrityDrift ? { integrityDrift: driftResult.integrityDrift } : {}),
  });
  emitSuccessfulPluginInstallSecurityEvent(result, {
    dryRun,
    mode: policyMode,
    sourceFamily: "archive",
    trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
  });
  return {
    ...result,
    ...(result.ok ? { npmTarballName: metadataResult.tarballName } : {}),
  };
}
async function installPluginFromPath(params) {
  const runtime = await loadPluginInstallRuntime();
  const pathResult = await runtime.resolveExistingInstallPath(params.path);
  if (!pathResult.ok) return pathResult;
  const { resolvedPath: resolved, stat } = pathResult;
  const packageInstallOptions = pickPackageInstallCommonParams(params);
  if (stat.isDirectory())
    return await installPluginFromDir({
      dirPath: resolved,
      ...packageInstallOptions,
      installPolicyRequest: installPolicyRequestForPath(params, "plugin-dir"),
    });
  if (runtime.resolveArchiveKind(resolved))
    return await installPluginFromArchive({
      archivePath: resolved,
      ...packageInstallOptions,
      installPolicyRequest: installPolicyRequestForPath(params, "plugin-archive"),
    });
  return {
    ok: false,
    code: PLUGIN_INSTALL_ERROR_CODE.UNSUPPORTED_PLAIN_FILE_PLUGIN,
    error:
      "Plain file plugin installs are not supported. Install a plugin directory or archive that contains openclaw.plugin.json, or list standalone plugin files in plugins.load.paths.",
  };
}
//#endregion
export {
  installPluginFromNpmSpec as a,
  emitPluginInstallSecurityEvent as c,
  installPluginFromNpmPackArchive as i,
  pluginAuditOutcomeForReason as l,
  installPluginFromArchive as n,
  installPluginFromPath as o,
  installPluginFromInstalledPackageDir as r,
  emitPluginAuditSecurityEvent as s,
  PLUGIN_INSTALL_ERROR_CODE as t,
};
