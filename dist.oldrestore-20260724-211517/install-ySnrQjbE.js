import path from "node:path";
import { i as detectBundleManifestFormat } from "./bundle-manifest-Dxp5qa20.js";
import { t as parseFrontmatter } from "./frontmatter-D_LnCPcN.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import {
  i as resolveSafeInstallDir,
  n as unscopedPackageName,
} from "./install-safe-path-EhqVsq3P.js";
import {
  o as scanInstalledPackageDependencyTree,
  s as scanPackageInstallSource,
} from "./install-security-scan-Bu6soO4h.js";
import "./regular-file-CBe_wA_B.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import "./manifest-DnFAzqZi.js";
import { n as MANIFEST_KEY } from "./legacy-names-NIXaj2oi.js";
import { r as readRegularFile } from "./regular-file-CuvhUtZS.js";
import { d as normalizeTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
import { t as CONFIG_DIR } from "./utils-DtcDeqWS.js";
//#region src/hooks/install.ts
const HOOK_MD_MAX_BYTES = 1024 * 1024;
const loadHookInstallRuntime = createLazyRuntimeModule(
  () => import("./install.runtime-BH20EQoA.js"),
);
const HOOK_INSTALL_ERROR_CODE = {
  MISSING_OPENCLAW_HOOKS: "missing_openclaw_hooks",
  EMPTY_OPENCLAW_HOOKS: "empty_openclaw_hooks",
};
const defaultLogger = {};
function buildHookInstallForwardParams(params) {
  return {
    config: params.config,
    dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
    trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
    hooksDir: params.hooksDir,
    timeoutMs: params.timeoutMs,
    logger: params.logger,
    mode: params.mode,
    dryRun: params.dryRun,
    expectedHookPackId: params.expectedHookPackId,
    expectedPackageKind: params.expectedPackageKind,
    inspection: params.inspection,
    installPolicyRequest: params.installPolicyRequest,
  };
}
function localHookInstallPolicySource(kind) {
  return kind === "plugin-archive"
    ? {
        kind: "archive",
        authority: "user",
        mutable: true,
        network: false,
      }
    : {
        kind: "local-path",
        authority: "user",
        mutable: true,
        network: false,
      };
}
async function runHookInstallScan(params) {
  try {
    const result = await params.scan();
    if (!result?.blocked) return null;
    return {
      ok: false,
      error: result.blocked.reason,
      ...(result.blocked.code ? { code: result.blocked.code } : {}),
    };
  } catch (error) {
    return {
      ok: false,
      error: `Hook pack "${params.hookPackId}" installation blocked: install policy failed (${String(error)})`,
      code: "security_scan_failed",
    };
  }
}
async function runHookInstallPolicy(params) {
  const request = params.forward.installPolicyRequest;
  if (!request) return null;
  return await runHookInstallScan({
    hookPackId: params.hookPackId,
    scan: async () =>
      await scanPackageInstallSource({
        config: params.forward.config,
        dangerouslyForceUnsafeInstall: params.forward.dangerouslyForceUnsafeInstall,
        trustedSourceLinkedOfficialInstall: params.forward.trustedSourceLinkedOfficialInstall,
        packageDir: params.packageDir,
        pluginId: params.hookPackId,
        extensions: params.hookEntries,
        ...(params.packageName ? { packageName: params.packageName } : {}),
        ...(params.version ? { version: params.version } : {}),
        logger: params.logger,
        requestKind: request.kind,
        requestedSpecifier: request.requestedSpecifier,
        source: request.source,
        mode: params.mode,
      }),
  });
}
async function runHookInstalledDependencyPolicy(params) {
  const request = params.forward.installPolicyRequest;
  if (!request) return null;
  return await runHookInstallScan({
    hookPackId: params.hookPackId,
    scan: async () =>
      await scanInstalledPackageDependencyTree({
        config: params.forward.config,
        dangerouslyForceUnsafeInstall: params.forward.dangerouslyForceUnsafeInstall,
        trustedSourceLinkedOfficialInstall: params.forward.trustedSourceLinkedOfficialInstall,
        packageDir: params.installedDir,
        pluginId: params.hookPackId,
        logger: params.logger,
        requestKind: request.kind,
        requestedSpecifier: request.requestedSpecifier,
        source: request.source,
        mode: params.mode,
      }),
  });
}
function validateHookId(hookId) {
  if (!hookId) return "invalid hook name: missing";
  if (hookId === "." || hookId === "..") return "invalid hook name: reserved path segment";
  if (hookId.includes("/") || hookId.includes("\\"))
    return "invalid hook name: path separators not allowed";
  return null;
}
/** Resolve the canonical local install directory for one hook pack id. */
function resolveHookInstallDir(hookId, hooksDir) {
  const hooksBase = hooksDir ? resolveUserPath(hooksDir) : path.join(CONFIG_DIR, "hooks");
  const hookIdError = validateHookId(hookId);
  if (hookIdError) throw new Error(hookIdError);
  const targetDirResult = resolveSafeInstallDir({
    baseDir: hooksBase,
    id: hookId,
    invalidNameMessage: "invalid hook name: path traversal detected",
  });
  if (!targetDirResult.ok) throw new Error(targetDirResult.error);
  return targetDirResult.path;
}
function resolveOpenClawHooks(manifest) {
  const hooks = manifest[MANIFEST_KEY]?.hooks;
  if (!Array.isArray(hooks))
    return {
      ok: false,
      error: "package.json missing openclaw.hooks",
      code: HOOK_INSTALL_ERROR_CODE.MISSING_OPENCLAW_HOOKS,
    };
  const list = normalizeTrimmedStringList(hooks);
  if (list.length === 0)
    return {
      ok: false,
      error: "package.json openclaw.hooks is empty",
      code: HOOK_INSTALL_ERROR_CODE.EMPTY_OPENCLAW_HOOKS,
    };
  return {
    ok: true,
    entries: list,
  };
}
function resolveHookPackageKind(manifest, packageKind) {
  if (packageKind) return packageKind;
  const extensions = manifest[MANIFEST_KEY]?.extensions;
  if (extensions === void 0) return "hook-only";
  return Array.isArray(extensions) && normalizeTrimmedStringList(extensions).length === 0
    ? "hook-only"
    : "plugin-capable";
}
function resolveHookInstallTargetPath(id, hooksDir) {
  const result = resolveSafeInstallDir({
    baseDir: hooksDir ? resolveUserPath(hooksDir) : path.join(CONFIG_DIR, "hooks"),
    id,
    invalidNameMessage: "invalid hook name: path traversal detected",
  });
  return result.ok
    ? {
        ok: true,
        targetDir: result.path,
      }
    : result;
}
async function resolveInstallTargetDir(id, hooksDir) {
  const runtime = await loadHookInstallRuntime();
  const baseHooksDir = hooksDir ? resolveUserPath(hooksDir) : path.join(CONFIG_DIR, "hooks");
  return await runtime.resolveCanonicalInstallTarget({
    baseDir: baseHooksDir,
    id,
    invalidNameMessage: "invalid hook name: path traversal detected",
    boundaryLabel: "hooks directory",
  });
}
async function resolvePreparedHookInstallTarget(params) {
  const runtime = await loadHookInstallRuntime();
  const targetDirResult = await resolveInstallTargetDir(params.id, params.hooksDir);
  if (!targetDirResult.ok) return targetDirResult;
  const targetDir = targetDirResult.targetDir;
  const effectiveMode =
    params.requestedMode === "update" && (await runtime.fileExists(targetDir))
      ? "update"
      : "install";
  const availability = await runtime.ensureInstallTargetAvailable({
    mode: effectiveMode,
    targetDir,
    alreadyExistsError: params.alreadyExistsError(targetDir),
  });
  if (!availability.ok) return availability;
  return {
    ok: true,
    target: {
      targetDir,
      effectiveMode,
    },
  };
}
async function installFromResolvedHookDir(resolvedDir, params) {
  const runtime = await loadHookInstallRuntime();
  const manifestPath = path.join(resolvedDir, "package.json");
  const packageKind =
    (await runtime.fileExists(path.join(resolvedDir, "openclaw.plugin.json"))) ||
    detectBundleManifestFormat(resolvedDir) !== null
      ? "plugin-capable"
      : void 0;
  if (await runtime.fileExists(manifestPath))
    return await installHookPackageFromDir({
      packageDir: resolvedDir,
      ...(packageKind ? { packageKind } : {}),
      ...buildHookInstallForwardParams(params),
    });
  return await installHookFromDir({
    hookDir: resolvedDir,
    ...(packageKind ? { packageKind } : {}),
    ...buildHookInstallForwardParams(params),
  });
}
async function resolveHookNameFromDir(hookDir) {
  const runtime = await loadHookInstallRuntime();
  const hookMdPath = path.join(hookDir, "HOOK.md");
  if (!(await runtime.fileExists(hookMdPath))) throw new Error(`HOOK.md missing in ${hookDir}`);
  const { buffer } = await readRegularFile({
    filePath: hookMdPath,
    maxBytes: HOOK_MD_MAX_BYTES,
  });
  return parseFrontmatter(buffer.toString("utf-8")).name || path.basename(hookDir);
}
async function validateHookDir(hookDir) {
  const runtime = await loadHookInstallRuntime();
  const hookMdPath = path.join(hookDir, "HOOK.md");
  if (!(await runtime.fileExists(hookMdPath))) throw new Error(`HOOK.md missing in ${hookDir}`);
  const handlerCandidates = ["handler.ts", "handler.js", "index.ts", "index.js"];
  const handlerEntry =
    handlerCandidates[
      (
        await Promise.all(
          handlerCandidates.map(async (candidate) =>
            runtime.fileExists(path.join(hookDir, candidate)),
          ),
        )
      ).findIndex(Boolean)
    ];
  if (!handlerEntry)
    throw new Error(`handler.ts/handler.js/index.ts/index.js missing in ${hookDir}`);
  return { handlerEntry };
}
async function installHookPackageFromDir(params) {
  const runtime = await loadHookInstallRuntime();
  const { logger, timeoutMs, mode, dryRun } = runtime.resolveTimedInstallModeOptions(
    params,
    defaultLogger,
  );
  const manifestPath = path.join(params.packageDir, "package.json");
  if (!(await runtime.fileExists(manifestPath)))
    return {
      ok: false,
      error: "package.json missing",
    };
  let manifest;
  try {
    manifest = await runtime.readJsonFile(manifestPath);
  } catch (err) {
    return {
      ok: false,
      error: `invalid package.json: ${String(err)}`,
    };
  }
  const hookManifest = resolveOpenClawHooks(manifest);
  if (!hookManifest.ok) return hookManifest;
  const hookEntries = hookManifest.entries;
  const pkgName = typeof manifest.name === "string" ? manifest.name : "";
  const hookPackId = pkgName ? unscopedPackageName(pkgName) : path.basename(params.packageDir);
  const packageKind = resolveHookPackageKind(manifest, params.packageKind);
  if (params.expectedPackageKind && packageKind !== params.expectedPackageKind)
    return {
      ok: false,
      error: `hook package kind mismatch: expected ${params.expectedPackageKind}, got ${packageKind}`,
    };
  const hookIdError = validateHookId(hookPackId);
  if (hookIdError)
    return {
      ok: false,
      error: hookIdError,
    };
  if (params.expectedHookPackId && params.expectedHookPackId !== hookPackId)
    return {
      ok: false,
      error: `hook pack id mismatch: expected ${params.expectedHookPackId}, got ${hookPackId}`,
    };
  const resolvedHooks = [];
  for (const entry of hookEntries) {
    const hookDir = path.resolve(params.packageDir, entry);
    if (!runtime.isPathInside(params.packageDir, hookDir))
      return {
        ok: false,
        error: `openclaw.hooks entry escapes package directory: ${entry}`,
      };
    await validateHookDir(hookDir);
    if (!runtime.isPathInsideWithRealpath(params.packageDir, hookDir, { requireRealpath: true }))
      return {
        ok: false,
        error: `openclaw.hooks entry resolves outside package directory: ${entry}`,
      };
    const hookName = await resolveHookNameFromDir(hookDir);
    resolvedHooks.push(hookName);
  }
  if (params.inspection === "package-kind") {
    const targetDirResult = resolveHookInstallTargetPath(hookPackId, params.hooksDir);
    if (!targetDirResult.ok) return targetDirResult;
    return {
      ok: true,
      hookPackId,
      hooks: resolvedHooks,
      packageKind,
      targetDir: targetDirResult.targetDir,
      version: typeof manifest.version === "string" ? manifest.version : void 0,
    };
  }
  const preparedTarget = await resolvePreparedHookInstallTarget({
    id: hookPackId,
    hooksDir: params.hooksDir,
    requestedMode: mode,
    alreadyExistsError: (targetDir) => `hook pack already exists: ${targetDir} (delete it first)`,
  });
  if (!preparedTarget.ok) return preparedTarget;
  const { targetDir, effectiveMode } = preparedTarget.target;
  const policyFailure = await runHookInstallPolicy({
    hookPackId,
    hookEntries,
    ...(pkgName ? { packageName: pkgName } : {}),
    ...(typeof manifest.version === "string" ? { version: manifest.version } : {}),
    packageDir: params.packageDir,
    forward: params,
    logger,
    mode: effectiveMode,
  });
  if (policyFailure) return policyFailure;
  if (dryRun)
    return {
      ok: true,
      hookPackId,
      hooks: resolvedHooks,
      packageKind,
      targetDir,
      version: typeof manifest.version === "string" ? manifest.version : void 0,
    };
  const installRes = await runtime.installPackageDirWithManifestDeps({
    sourceDir: params.packageDir,
    targetDir,
    mode: effectiveMode,
    timeoutMs,
    logger,
    copyErrorPrefix: "failed to copy hook pack",
    depsLogMessage: "Installing hook pack dependencies…",
    manifestDependencies: manifest.dependencies,
    afterInstall: async (installedDir) => {
      return (
        (await runHookInstalledDependencyPolicy({
          hookPackId,
          installedDir,
          forward: params,
          logger,
          mode: effectiveMode,
        })) ?? { ok: true }
      );
    },
  });
  if (!installRes.ok) return installRes;
  return {
    ok: true,
    hookPackId,
    hooks: resolvedHooks,
    packageKind,
    targetDir,
    version: typeof manifest.version === "string" ? manifest.version : void 0,
  };
}
async function installHookFromDir(params) {
  const runtime = await loadHookInstallRuntime();
  const { logger, mode, dryRun } = runtime.resolveInstallModeOptions(params, defaultLogger);
  const { handlerEntry } = await validateHookDir(params.hookDir);
  const hookName = await resolveHookNameFromDir(params.hookDir);
  const packageKind = params.packageKind ?? "hook-only";
  if (params.expectedPackageKind && packageKind !== params.expectedPackageKind)
    return {
      ok: false,
      error: `hook package kind mismatch: expected ${params.expectedPackageKind}, got ${packageKind}`,
    };
  const hookIdError = validateHookId(hookName);
  if (hookIdError)
    return {
      ok: false,
      error: hookIdError,
    };
  if (params.expectedHookPackId && params.expectedHookPackId !== hookName)
    return {
      ok: false,
      error: `hook id mismatch: expected ${params.expectedHookPackId}, got ${hookName}`,
    };
  if (params.inspection === "package-kind") {
    const targetDirResult = resolveHookInstallTargetPath(hookName, params.hooksDir);
    if (!targetDirResult.ok) return targetDirResult;
    return {
      ok: true,
      hookPackId: hookName,
      hooks: [hookName],
      packageKind,
      targetDir: targetDirResult.targetDir,
    };
  }
  const preparedTarget = await resolvePreparedHookInstallTarget({
    id: hookName,
    hooksDir: params.hooksDir,
    requestedMode: mode,
    alreadyExistsError: (targetDir) => `hook already exists: ${targetDir} (delete it first)`,
  });
  if (!preparedTarget.ok) return preparedTarget;
  const { targetDir, effectiveMode } = preparedTarget.target;
  const policyFailure = await runHookInstallPolicy({
    hookPackId: hookName,
    hookEntries: [handlerEntry],
    packageDir: params.hookDir,
    forward: params,
    logger,
    mode: effectiveMode,
  });
  if (policyFailure) return policyFailure;
  if (dryRun)
    return {
      ok: true,
      hookPackId: hookName,
      hooks: [hookName],
      packageKind,
      targetDir,
    };
  const installRes = await runtime.installPackageDir({
    sourceDir: params.hookDir,
    targetDir,
    mode: effectiveMode,
    timeoutMs: 12e4,
    logger,
    copyErrorPrefix: "failed to copy hook",
    hasDeps: false,
    depsLogMessage: "Installing hook dependencies…",
    afterInstall: async (installedDir) => {
      return (
        (await runHookInstalledDependencyPolicy({
          hookPackId: hookName,
          installedDir,
          forward: params,
          logger,
          mode: effectiveMode,
        })) ?? { ok: true }
      );
    },
  });
  if (!installRes.ok) return installRes;
  return {
    ok: true,
    hookPackId: hookName,
    hooks: [hookName],
    packageKind,
    targetDir,
  };
}
/** Install hooks from an archive after extracting and validating the archive root. */
async function installHooksFromArchive(params) {
  const runtime = await loadHookInstallRuntime();
  const logger = params.logger ?? defaultLogger;
  const timeoutMs = params.timeoutMs ?? 12e4;
  const archivePathResult = await runtime.resolveArchiveSourcePath(params.archivePath);
  if (!archivePathResult.ok) return archivePathResult;
  const archivePath = archivePathResult.path;
  const installPolicyRequest = params.installPolicyRequest ?? {
    kind: "plugin-archive",
    requestedSpecifier: params.archivePath,
    source: localHookInstallPolicySource("plugin-archive"),
  };
  return await runtime.withExtractedArchiveRoot({
    archivePath,
    tempDirPrefix: "openclaw-hook-",
    timeoutMs,
    logger,
    onExtracted: async (rootDir) =>
      await installFromResolvedHookDir(
        rootDir,
        buildHookInstallForwardParams({
          ...params,
          timeoutMs,
          logger,
          installPolicyRequest,
        }),
      ),
  });
}
/** Download, verify, and install an npm hook pack tarball. */
async function installHooksFromNpmSpec(params) {
  const runtime = await loadHookInstallRuntime();
  const { logger, timeoutMs, mode, dryRun } = runtime.resolveTimedInstallModeOptions(
    params,
    defaultLogger,
  );
  const spec = params.spec;
  logger.info?.(`Downloading ${spec.trim()}…`);
  return await runtime.installFromValidatedNpmSpecArchive({
    tempDirPrefix: "openclaw-hook-pack-",
    spec,
    timeoutMs,
    expectedIntegrity: params.expectedIntegrity,
    onIntegrityDrift: params.onIntegrityDrift,
    warn: (message) => {
      logger.warn?.(message);
    },
    installFromArchive: installHooksFromArchive,
    archiveInstallParams: buildHookInstallForwardParams({
      ...params,
      timeoutMs,
      logger,
      mode,
      dryRun,
      installPolicyRequest: {
        kind: "plugin-npm",
        requestedSpecifier: spec,
        source: {
          kind: "npm",
          authority: "third-party",
          mutable: false,
          network: true,
        },
      },
    }),
  });
}
/** Install a hook pack or single hook from a local directory/archive path. */
async function installHooksFromPath(params) {
  const runtime = await loadHookInstallRuntime();
  const pathResult = await runtime.resolveExistingInstallPath(params.path);
  if (!pathResult.ok) return pathResult;
  const { resolvedPath: resolved, stat } = pathResult;
  const installPolicyKind = stat.isDirectory() ? "plugin-dir" : "plugin-archive";
  const forwardParams = buildHookInstallForwardParams({
    ...params,
    installPolicyRequest: {
      kind: installPolicyKind,
      requestedSpecifier: params.path,
      source: localHookInstallPolicySource(installPolicyKind),
    },
  });
  if (stat.isDirectory()) return await installFromResolvedHookDir(resolved, forwardParams);
  if (!runtime.resolveArchiveKind(resolved))
    return {
      ok: false,
      error: `unsupported hook file: ${resolved}`,
    };
  return await installHooksFromArchive({
    archivePath: resolved,
    ...forwardParams,
  });
}
//#endregion
export {
  resolveHookInstallDir as i,
  installHooksFromNpmSpec as n,
  installHooksFromPath as r,
  HOOK_INSTALL_ERROR_CODE as t,
};
