import fs from "node:fs";
import path from "node:path";
import { s as resolveArchiveKind } from "./archive-CR1500gV.js";
import { t as findBundledPluginSource } from "./bundled-sources-D7CuFv_v.js";
import { t as installPluginFromClawHub } from "./clawhub-BhV81Pwz.js";
import { t as CLAWHUB_INSTALL_ERROR_CODE } from "./clawhub-error-codes-OgrR1N6P.js";
import { t as buildClawHubPluginInstallRecordFields } from "./clawhub-install-records-Dy2deHKG.js";
import { t as resolveClawHubRiskAcknowledgementCliOptions } from "./clawhub-risk-acknowledgement-B_IQ9VgH.js";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-CzLwxQg_.js";
import "./clawhub-CgGOpxts.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { r as replaceConfigFile } from "./config-BDv-QbJ6.js";
import { o as tracePluginLifecyclePhaseAsync } from "./discovery-Df2IhoW5.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { r as parseGitPluginSpec, t as installPluginFromGitSpec } from "./git-install-JvNiWiSz.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import {
  a as installPluginFromNpmSpec,
  i as installPluginFromNpmPackArchive,
  o as installPluginFromPath,
  t as PLUGIN_INSTALL_ERROR_CODE,
} from "./install-CjCRVnj8.js";
import { r as resolveDefaultPluginExtensionsDir } from "./install-paths-CqMnrXsY.js";
import "./archive-CBe_wA_B.js";
import "./installed-plugin-index-records-BP7rp3ti.js";
import {
  a as selectInstallMutationWriteOptions,
  i as resolveInstallConfigMutationPreflights,
  n as persistPluginInstall,
  o as supportsInstallConfigSingleTopLevelIncludeShape,
} from "./install-persistence-BSkHA7t9.js";
import { n as installHooksFromNpmSpec, r as installHooksFromPath } from "./install-ySnrQjbE.js";
import { t as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-D7CXgzhH.js";
import { t as recordHookInstall } from "./installs-BKTJdEeS.js";
import { f as readConfigFileSnapshotForWrite } from "./io-B3ne6NxF.js";
import {
  r as resolveMarketplaceInstallShortcut,
  t as installPluginFromMarketplace,
} from "./marketplace-CTGR0h9d.js";
import { n as assertConfigWriteAllowedInCurrentMode } from "./nix-mode-write-guard-e6xDJfpJ.js";
import { n as resolvePinnedNpmInstallRecordForCli } from "./npm-resolution-BbZG2aeU.js";
import {
  d as resolveOfficialExternalPluginInstall,
  n as getOfficialExternalPluginCatalogEntryForPackage,
  t as getOfficialExternalPluginCatalogEntry,
  u as resolveOfficialExternalPluginId,
} from "./official-external-plugin-catalog-B2V9K3em.js";
import {
  r as resolvePluginInstallRequestContext,
  t as resolvePluginInstallInvalidConfigPolicy,
} from "./plugin-install-config-policy-BjOUKpcF.js";
import {
  a as resolveOfficialExternalNpmPackageTrust,
  i as resolveOfficialExternalInstallPlanBeforeNpm,
  r as resolveBundledInstallPlanForNpmFailure,
  t as resolveBundledInstallPlanBeforeNpm,
} from "./plugin-install-plan-BhAMBjAf.js";
import {
  a as logHookPackRestartHint,
  c as parseNpmPrefixSpec,
  i as formatPluginInstallWithHookFallbackError,
  n as createPluginInstallLogger,
  r as enableInternalHookEntries,
  s as parseNpmPackPrefixPath,
  t as createHookPackInstallLogger,
} from "./plugins-command-helpers-DFgsS_UB.js";
import { n as listPersistedBundledPluginRecoveryLocations } from "./plugins-location-bridges-GGlgWM3O.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { t as validateJsonSchemaValue } from "./schema-validator-BAYKPBuJ.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { h as shortenHomePath } from "./utils-DtcDeqWS.js";
//#region src/cli/hook-install-persistence.ts
async function persistHookPackInstall(params) {
  const runtime = params.runtime ?? defaultRuntime;
  let next = enableInternalHookEntries(params.snapshot.config, params.hooks);
  next = recordHookInstall(next, {
    hookId: params.hookPackId,
    hooks: params.hooks,
    ...params.install,
  });
  await replaceConfigFile({
    nextConfig: next,
    baseHash: params.snapshot.baseHash,
    writeOptions: params.snapshot.writeOptions,
  });
  runtime.log(params.successMessage ?? `Installed hook pack: ${params.hookPackId}`);
  logHookPackRestartHint(runtime);
  return next;
}
//#endregion
//#region src/cli/install-spec.ts
/** Detect specs that should be interpreted as local file/path installs. */
function looksLikeLocalInstallSpec(spec, knownSuffixes) {
  return (
    spec.startsWith(".") ||
    spec.startsWith("~") ||
    path.isAbsolute(spec) ||
    knownSuffixes.some((suffix) => spec.endsWith(suffix))
  );
}
//#endregion
//#region src/cli/plugins-install-command.ts
function isClawHubBlockedCliFailure(result) {
  return (
    result.code === CLAWHUB_INSTALL_ERROR_CODE.CLAWHUB_DOWNLOAD_BLOCKED &&
    typeof result.warning === "string" &&
    result.warning.trim().length > 0
  );
}
function resolveInstallMode(force) {
  return force ? "update" : "install";
}
function resolveInstallSafetyOverrides(overrides) {
  return {
    config: overrides.config,
    dangerouslyForceUnsafeInstall: overrides.dangerouslyForceUnsafeInstall,
    trustedSourceLinkedOfficialInstall: overrides.trustedSourceLinkedOfficialInstall,
  };
}
async function probeHookPackFromNpmSpec(params) {
  try {
    return await installHooksFromNpmSpec(params);
  } catch (error) {
    return {
      ok: false,
      error: formatErrorMessage(error),
    };
  }
}
async function probeHookPackFromPath(params) {
  try {
    return await installHooksFromPath(params);
  } catch (error) {
    return {
      ok: false,
      error: formatErrorMessage(error),
    };
  }
}
const DEPRECATED_DANGEROUS_FORCE_UNSAFE_INSTALL_WARNING =
  "--dangerously-force-unsafe-install is deprecated and no longer affects plugin installs because built-in install-time dangerous-code scanning has been removed. Configure security.installPolicy for operator-owned install decisions.";
function findTrustedCatalogPackageInstall(packageName) {
  const entry = getOfficialExternalPluginCatalogEntryForPackage(packageName);
  if (!entry) return;
  const pluginId = resolveOfficialExternalPluginId(entry);
  if (!pluginId) return;
  const install = resolveOfficialExternalPluginInstall(entry);
  return {
    pluginId,
    ...(install?.npmSpec ? { npmSpec: install.npmSpec } : {}),
    ...(install?.expectedIntegrity ? { expectedIntegrity: install.expectedIntegrity } : {}),
  };
}
function isEmptyRecord(value) {
  return Object.keys(value).length === 0;
}
function supportsPluginRecoveryIncludeShape(parsed) {
  if (Object.hasOwn(parsed, "$include")) return false;
  return supportsInstallConfigSingleTopLevelIncludeShape(parsed.plugins);
}
function resolveFullyBlockedConfigMutationReason(snapshot) {
  if (snapshot.pluginMutation.mode !== "blocked" || snapshot.hookMutation.mode !== "blocked")
    return null;
  if (snapshot.pluginMutation.reason === snapshot.hookMutation.reason)
    return snapshot.pluginMutation.reason;
  return `Config plugin and hook mutations are both blocked. ${snapshot.pluginMutation.reason} ${snapshot.hookMutation.reason}`;
}
function assertPluginConfigMutationAllowed(preflight) {
  if (preflight.mode === "blocked") throw buildInvalidPluginInstallConfigError(preflight.reason);
}
function hasValidBundledPluginConfig(params) {
  if (!params.bundledSource.requiresConfig) return true;
  if (!isRecord(params.existingEntry)) return false;
  const config = params.existingEntry.config;
  if (!isRecord(config)) return false;
  if (!params.bundledSource.configSchema) return !isEmptyRecord(config);
  return validateJsonSchemaValue({
    schema: params.bundledSource.configSchema,
    cacheKey: `bundled-install:${params.bundledSource.pluginId}`,
    value: config,
    applyDefaults: true,
  }).ok;
}
function prepareConfigForDisabledBundledInstall(config, pluginId) {
  const { [pluginId]: _removedEntry, ...nextEntries } = config.plugins?.entries ?? {};
  return {
    ...config,
    plugins: {
      ...config.plugins,
      entries: nextEntries,
    },
  };
}
async function installBundledPluginSource(params) {
  const existingEntry = params.snapshot.config.plugins?.entries?.[params.bundledSource.pluginId];
  const shouldEnable = hasValidBundledPluginConfig({
    bundledSource: params.bundledSource,
    existingEntry,
  });
  const configBase = shouldEnable
    ? params.snapshot.config
    : prepareConfigForDisabledBundledInstall(params.snapshot.config, params.bundledSource.pluginId);
  const configWarning = shouldEnable
    ? ""
    : `Installed bundled plugin "${params.bundledSource.pluginId}" without enabling it because it requires configuration first. Configure it, then run \`openclaw plugins enable ${params.bundledSource.pluginId}\`.`;
  await persistPluginInstall({
    snapshot: {
      ...params.snapshot,
      config: configBase,
    },
    pluginId: params.bundledSource.pluginId,
    install: {
      source: "path",
      spec: params.rawSpec,
      sourcePath: params.bundledSource.localPath,
      installPath: params.bundledSource.localPath,
    },
    enable: shouldEnable,
    invalidateRuntimeCache: params.invalidateRuntimeCache,
    warningMessage: [params.warning, configWarning].filter(Boolean).join("\n"),
    runtime: params.runtime,
  });
}
async function tryInstallHookPackFromLocalPath(params) {
  if (params.snapshot.hookMutation.mode === "blocked")
    return {
      ok: false,
      error: params.snapshot.hookMutation.reason,
    };
  if (params.link) {
    if (!fs.statSync(params.resolvedPath).isDirectory())
      return {
        ok: false,
        error: "Linked hook pack paths must be directories.",
      };
    const probe = await installHooksFromPath({
      ...resolveInstallSafetyOverrides(params.safetyOverrides ?? {}),
      path: params.resolvedPath,
      dryRun: true,
      ...(params.expectedPackageKind ? { expectedPackageKind: params.expectedPackageKind } : {}),
    });
    if (!probe.ok) return probe;
    const merged = uniqueStrings([
      ...(params.snapshot.config.hooks?.internal?.load?.extraDirs ?? []),
      params.resolvedPath,
    ]);
    await persistHookPackInstall({
      snapshot: {
        ...params.snapshot,
        config: {
          ...params.snapshot.config,
          hooks: {
            ...params.snapshot.config.hooks,
            internal: {
              ...params.snapshot.config.hooks?.internal,
              enabled: true,
              load: {
                ...params.snapshot.config.hooks?.internal?.load,
                extraDirs: merged,
              },
            },
          },
        },
      },
      hookPackId: probe.hookPackId,
      hooks: probe.hooks,
      install: {
        source: "path",
        sourcePath: params.resolvedPath,
        installPath: params.resolvedPath,
        version: probe.version,
      },
      successMessage: `Linked hook pack path: ${shortenHomePath(params.resolvedPath)}`,
      runtime: params.runtime,
    });
    return { ok: true };
  }
  const result = await installHooksFromPath({
    ...resolveInstallSafetyOverrides(params.safetyOverrides ?? {}),
    path: params.resolvedPath,
    mode: params.installMode,
    ...(params.expectedPackageKind ? { expectedPackageKind: params.expectedPackageKind } : {}),
    logger: createHookPackInstallLogger(params.runtime),
  });
  if (!result.ok) return result;
  const source = resolveArchiveKind(params.resolvedPath) ? "archive" : "path";
  await persistHookPackInstall({
    snapshot: params.snapshot,
    hookPackId: result.hookPackId,
    hooks: result.hooks,
    install: {
      source,
      sourcePath: params.resolvedPath,
      installPath: result.targetDir,
      version: result.version,
    },
    runtime: params.runtime,
  });
  return { ok: true };
}
async function tryInstallHookPackFromNpmSpec(params) {
  if (params.snapshot.hookMutation.mode === "blocked")
    return {
      ok: false,
      error: params.snapshot.hookMutation.reason,
    };
  const result = await installHooksFromNpmSpec({
    config: params.snapshot.config,
    spec: params.spec,
    mode: params.installMode,
    ...(params.expectedIntegrity ? { expectedIntegrity: params.expectedIntegrity } : {}),
    ...(params.expectedPackageKind ? { expectedPackageKind: params.expectedPackageKind } : {}),
    logger: createHookPackInstallLogger(params.runtime),
  });
  if (!result.ok) return result;
  const installRecord = resolvePinnedNpmInstallRecordForCli(
    params.spec,
    Boolean(params.pin),
    result.targetDir,
    result.version,
    result.npmResolution,
    params.runtime?.log ?? defaultRuntime.log,
    theme.warn,
  );
  await persistHookPackInstall({
    snapshot: params.snapshot,
    hookPackId: result.hookPackId,
    hooks: result.hooks,
    install: installRecord,
    runtime: params.runtime,
  });
  return { ok: true };
}
async function tryInstallPluginOrHookPackFromNpmSpec(params) {
  const fullyBlockedReason = resolveFullyBlockedConfigMutationReason(params.snapshot);
  if (fullyBlockedReason) {
    (params.runtime ?? defaultRuntime).error(fullyBlockedReason);
    return { ok: false };
  }
  if (
    params.snapshot.pluginMutation.mode === "blocked" ||
    params.snapshot.hookMutation.mode === "blocked"
  ) {
    const hookProbe = await probeHookPackFromNpmSpec({
      config: params.snapshot.config,
      spec: params.spec,
      mode: params.installMode,
      inspection: "package-kind",
      ...(params.expectedIntegrity ? { expectedIntegrity: params.expectedIntegrity } : {}),
      logger: createHookPackInstallLogger(params.runtime),
    });
    if (hookProbe.ok && hookProbe.packageKind === "hook-only") {
      if (params.snapshot.hookMutation.mode === "blocked") {
        (params.runtime ?? defaultRuntime).error(params.snapshot.hookMutation.reason);
        return { ok: false };
      }
      const hookFallback = await tryInstallHookPackFromNpmSpec({
        snapshot: params.snapshot,
        installMode: params.installMode,
        spec: params.spec,
        pin: params.pin,
        expectedIntegrity: hookProbe.npmResolution?.integrity ?? params.expectedIntegrity,
        expectedPackageKind: "hook-only",
        runtime: params.runtime,
      });
      if (hookFallback.ok) return { ok: true };
      (params.runtime ?? defaultRuntime).error(hookFallback.error);
      return { ok: false };
    }
    if (params.snapshot.pluginMutation.mode === "blocked") {
      (params.runtime ?? defaultRuntime).error(params.snapshot.pluginMutation.reason);
      return { ok: false };
    }
  }
  const result = await installPluginFromNpmSpec({
    ...params.safetyOverrides,
    mode: params.installMode,
    spec: params.spec,
    ...(params.expectedPluginId ? { expectedPluginId: params.expectedPluginId } : {}),
    ...(params.expectedIntegrity ? { expectedIntegrity: params.expectedIntegrity } : {}),
    ...(params.trustedSourceLinkedOfficialInstall
      ? { trustedSourceLinkedOfficialInstall: true }
      : {}),
    extensionsDir: params.extensionsDir,
    logger: createPluginInstallLogger(params.runtime),
  });
  if (!result.ok) {
    if (isTerminalPluginInstallFailure(result.code)) {
      (params.runtime ?? defaultRuntime).error(result.error);
      return { ok: false };
    }
    if (params.allowBundledFallback) {
      const bundledFallbackPlan = resolveBundledInstallPlanForNpmFailure({
        rawSpec: params.spec,
        code: result.code,
        findBundledSource: (lookup) => findBundledPluginSource({ lookup }),
      });
      if (bundledFallbackPlan) {
        await installBundledPluginSource({
          snapshot: params.snapshot,
          rawSpec: params.spec,
          bundledSource: bundledFallbackPlan.bundledSource,
          warning: bundledFallbackPlan.warning,
          invalidateRuntimeCache: params.invalidateRuntimeCache,
          runtime: params.runtime,
        });
        return { ok: true };
      }
    }
    const hookFallback = await tryInstallHookPackFromNpmSpec({
      snapshot: params.snapshot,
      installMode: params.installMode,
      spec: params.spec,
      pin: params.pin,
      expectedIntegrity: params.expectedIntegrity,
      runtime: params.runtime,
    });
    if (hookFallback.ok) return { ok: true };
    (params.runtime ?? defaultRuntime).error(
      formatPluginInstallWithHookFallbackError(result.error, hookFallback),
    );
    return { ok: false };
  }
  const installRecord = resolvePinnedNpmInstallRecordForCli(
    params.spec,
    Boolean(params.pin),
    result.targetDir,
    result.version,
    result.npmResolution,
    params.runtime?.log ?? defaultRuntime.log,
    theme.warn,
  );
  await persistPluginInstall({
    snapshot: params.snapshot,
    pluginId: result.pluginId,
    install: installRecord,
    invalidateRuntimeCache: params.invalidateRuntimeCache,
    runtime: params.runtime,
  });
  return { ok: true };
}
async function tryInstallPluginFromNpmPackArchive(params) {
  const result = await installPluginFromNpmPackArchive({
    ...params.safetyOverrides,
    mode: params.installMode,
    archivePath: params.archivePath,
    extensionsDir: params.extensionsDir,
    logger: createPluginInstallLogger(params.runtime),
  });
  if (!result.ok) {
    (params.runtime ?? defaultRuntime).error(result.error);
    return { ok: false };
  }
  await persistPluginInstall({
    snapshot: params.snapshot,
    pluginId: result.pluginId,
    install: {
      source: "npm",
      spec: result.npmResolution?.resolvedSpec ?? result.manifestName ?? result.pluginId,
      sourcePath: params.archivePath,
      installPath: result.targetDir,
      ...(result.version ? { version: result.version } : {}),
      ...(result.npmResolution?.name ? { resolvedName: result.npmResolution.name } : {}),
      ...(result.npmResolution?.version ? { resolvedVersion: result.npmResolution.version } : {}),
      ...(result.npmResolution?.resolvedSpec
        ? { resolvedSpec: result.npmResolution.resolvedSpec }
        : {}),
      ...(result.npmResolution?.integrity ? { integrity: result.npmResolution.integrity } : {}),
      ...(result.npmResolution?.shasum ? { shasum: result.npmResolution.shasum } : {}),
      ...(result.npmResolution?.resolvedAt ? { resolvedAt: result.npmResolution.resolvedAt } : {}),
      artifactKind: "npm-pack",
      artifactFormat: "tgz",
      ...(result.npmResolution?.integrity ? { npmIntegrity: result.npmResolution.integrity } : {}),
      ...(result.npmResolution?.shasum ? { npmShasum: result.npmResolution.shasum } : {}),
      ...(result.npmTarballName ? { npmTarballName: result.npmTarballName } : {}),
    },
    invalidateRuntimeCache: params.invalidateRuntimeCache,
    runtime: params.runtime,
  });
  return { ok: true };
}
async function tryInstallPluginFromGitSpec(params) {
  const result = await installPluginFromGitSpec({
    ...params.safetyOverrides,
    mode: params.installMode,
    spec: params.spec,
    extensionsDir: params.extensionsDir,
    logger: createPluginInstallLogger(params.runtime),
  });
  if (!result.ok) {
    (params.runtime ?? defaultRuntime).error(result.error);
    return { ok: false };
  }
  await persistPluginInstall({
    snapshot: params.snapshot,
    pluginId: result.pluginId,
    install: {
      source: "git",
      spec: params.spec,
      installPath: result.targetDir,
      version: result.version,
      resolvedAt: result.git.resolvedAt,
      gitUrl: result.git.url,
      gitRef: result.git.ref,
      gitCommit: result.git.commit,
    },
    invalidateRuntimeCache: params.invalidateRuntimeCache,
    runtime: params.runtime,
  });
  return { ok: true };
}
function isTerminalPluginInstallFailure(code) {
  return (
    code === PLUGIN_INSTALL_ERROR_CODE.SECURITY_SCAN_BLOCKED ||
    code === PLUGIN_INSTALL_ERROR_CODE.SECURITY_SCAN_FAILED ||
    code === PLUGIN_INSTALL_ERROR_CODE.UNSUPPORTED_PLAIN_FILE_PLUGIN
  );
}
function isAllowedPluginRecoveryIssue(issue, request, ownedLoadPaths) {
  const pluginId = request.bundledPluginId?.trim();
  if (!pluginId) return false;
  return (
    (issue.path === `channels.${pluginId}` &&
      issue.message === `unknown channel id: ${pluginId}`) ||
    isOwnedMissingPluginLoadPathIssue(issue, ownedLoadPaths) ||
    (issue.path === `plugins.entries.${pluginId}` &&
      typeof issue.message === "string" &&
      issue.message.includes("requires compiled runtime output")) ||
    (issue.path === "tools.web.search.provider" &&
      typeof issue.message === "string" &&
      issue.message.includes(`plugin "${pluginId}"`))
  );
}
function buildInvalidPluginInstallConfigError(message) {
  const error = new Error(message);
  error.code = "INVALID_CONFIG";
  return error;
}
function extractMissingPluginLoadPath(issue) {
  if (issue.path !== "plugins.load.paths" || typeof issue.message !== "string") return null;
  const markerIndex = issue.message.indexOf("plugin path not found:");
  if (markerIndex < 0) return null;
  return issue.message.slice(markerIndex + 22).trim() || null;
}
function collectRequestedPluginInstallPaths(cfg, installRecords, request, env = process.env) {
  const pluginId = request.bundledPluginId?.trim();
  if (!pluginId) return /* @__PURE__ */ new Set();
  const paths = /* @__PURE__ */ new Set();
  const record = installRecords[pluginId] ?? cfg.plugins?.installs?.[pluginId];
  for (const value of [record?.sourcePath, record?.installPath])
    if (typeof value === "string" && value.trim()) paths.add(resolveUserPath(value, env));
  return paths;
}
function isOwnedMissingPluginLoadPathIssue(issue, ownedLoadPaths, env = process.env) {
  const missingPath = extractMissingPluginLoadPath(issue);
  return missingPath !== null && ownedLoadPaths.has(resolveUserPath(missingPath, env));
}
async function collectRequestedPluginLocationBridgePaths(request, env) {
  const pluginId = request.bundledPluginId?.trim();
  if (!pluginId) return /* @__PURE__ */ new Set();
  const locations = await listPersistedBundledPluginRecoveryLocations({ env });
  return new Set(
    locations
      .filter((location) => location.pluginId === pluginId)
      .flatMap((location) => location.loadPaths.map((loadPath) => resolveUserPath(loadPath, env))),
  );
}
function removeOwnedMissingPluginLoadPaths(cfg, issues, ownedLoadPaths, env = process.env) {
  const missingPaths = /* @__PURE__ */ new Set();
  for (const issue of issues) {
    const missingPath = extractMissingPluginLoadPath(issue);
    if (!missingPath) continue;
    const resolved = resolveUserPath(missingPath, env);
    if (ownedLoadPaths.has(resolved)) missingPaths.add(resolved);
  }
  const paths = cfg.plugins?.load?.paths;
  if (missingPaths.size === 0 || !Array.isArray(paths)) return cfg;
  const nextPaths = paths.filter(
    (entry) => typeof entry !== "string" || !missingPaths.has(resolveUserPath(entry, env)),
  );
  if (nextPaths.length === paths.length) return cfg;
  return {
    ...cfg,
    plugins: {
      ...cfg.plugins,
      load: {
        ...cfg.plugins?.load,
        paths: nextPaths,
      },
    },
  };
}
async function resolveRequestedPluginInstallPaths(cfg, issues, request, env = process.env) {
  if (!issues.some((issue) => extractMissingPluginLoadPath(issue) !== null))
    return /* @__PURE__ */ new Set();
  const ownedLoadPaths = collectRequestedPluginInstallPaths(
    cfg,
    await loadInstalledPluginIndexInstallRecords(),
    request,
    env,
  );
  if (
    issues.some(
      (issue) =>
        extractMissingPluginLoadPath(issue) !== null &&
        !isOwnedMissingPluginLoadPathIssue(issue, ownedLoadPaths, env),
    )
  )
    for (const loadPath of await collectRequestedPluginLocationBridgePaths(request, env))
      ownedLoadPaths.add(loadPath);
  return ownedLoadPaths;
}
async function loadConfigFromSnapshotForInstall(request, prepared) {
  const { snapshot, writeOptions } = prepared;
  const mutationWriteOptions = selectInstallMutationWriteOptions(writeOptions);
  if (resolvePluginInstallInvalidConfigPolicy(request) !== "allow-plugin-recovery")
    throw buildInvalidPluginInstallConfigError(
      "Config invalid; run `openclaw doctor --fix` before installing plugins.",
    );
  const parsed = snapshot.parsed ?? {};
  if (!snapshot.exists || Object.keys(parsed).length === 0)
    throw buildInvalidPluginInstallConfigError(
      "Config file could not be parsed; run `openclaw doctor` to repair it.",
    );
  const ownedLoadPaths = await resolveRequestedPluginInstallPaths(
    snapshot.config,
    snapshot.issues,
    request,
    process.env,
  );
  if (
    snapshot.legacyIssues.length > 0 ||
    snapshot.issues.length === 0 ||
    snapshot.issues.some((issue) => !isAllowedPluginRecoveryIssue(issue, request, ownedLoadPaths))
  )
    throw buildInvalidPluginInstallConfigError(
      `Config invalid outside the plugin recovery path for ${request.bundledPluginId ?? "the requested plugin"}; run \`openclaw doctor --fix\` before reinstalling it.`,
    );
  if (!supportsPluginRecoveryIncludeShape(parsed))
    throw buildInvalidPluginInstallConfigError(
      "Config plugin recovery uses an unsupported $include shape; use a single-file top-level plugins include or run `openclaw doctor --fix` before reinstalling it.",
    );
  const { hookMutation, pluginMutation } = resolveInstallConfigMutationPreflights({
    parsed,
    snapshotPath: snapshot.path,
    writeOptions: mutationWriteOptions,
  });
  assertPluginConfigMutationAllowed(pluginMutation);
  return {
    config: removeOwnedMissingPluginLoadPaths(
      snapshot.config,
      snapshot.issues,
      ownedLoadPaths,
      process.env,
    ),
    baseHash: snapshot.hash,
    writeOptions: mutationWriteOptions,
    hookMutation,
    pluginMutation,
  };
}
async function loadConfigForInstall(request) {
  const prepared = await tracePluginLifecyclePhaseAsync(
    "config read",
    () => readConfigFileSnapshotForWrite(),
    { command: "install" },
  );
  const { snapshot, writeOptions } = prepared;
  const mutationWriteOptions = selectInstallMutationWriteOptions(writeOptions);
  if (snapshot.valid) {
    const { hookMutation, pluginMutation } = resolveInstallConfigMutationPreflights({
      parsed: snapshot.parsed ?? {},
      snapshotPath: snapshot.path,
      writeOptions: mutationWriteOptions,
    });
    if (request.installKind === "plugin") assertPluginConfigMutationAllowed(pluginMutation);
    return {
      config: snapshot.sourceConfig,
      baseHash: snapshot.hash,
      writeOptions: mutationWriteOptions,
      hookMutation,
      pluginMutation,
    };
  }
  return loadConfigFromSnapshotForInstall(request, prepared);
}
async function runPluginInstallCommand(params) {
  assertConfigWriteAllowedInCurrentMode();
  const runtime = params.runtime ?? defaultRuntime;
  const invalidateRuntimeCache = params.invalidateRuntimeCache ?? true;
  const shorthand = !params.opts.marketplace
    ? await tracePluginLifecyclePhaseAsync(
        "marketplace shortcut resolution",
        () => resolveMarketplaceInstallShortcut(params.raw),
        { command: "install" },
      )
    : null;
  if (shorthand?.ok === false) {
    runtime.error(shorthand.error);
    return runtime.exit(1);
  }
  const raw = shorthand?.ok ? shorthand.plugin : params.raw;
  const opts = {
    ...params.opts,
    marketplace: params.opts.marketplace ?? (shorthand?.ok ? shorthand.marketplaceSource : void 0),
  };
  if (opts.dangerouslyForceUnsafeInstall)
    runtime.log(theme.warn(DEPRECATED_DANGEROUS_FORCE_UNSAFE_INSTALL_WARNING));
  if (opts.marketplace) {
    if (opts.link) {
      runtime.error(
        `--link is not supported with --marketplace. Remove --link, or install a local path with ${formatCliCommand("openclaw plugins install --link <path>")}.`,
      );
      return runtime.exit(1);
    }
    if (opts.pin) {
      runtime.error(
        `--pin is not supported with --marketplace. Use ${formatCliCommand("openclaw plugins install <plugin> --marketplace <name>")} without --pin.`,
      );
      return runtime.exit(1);
    }
  }
  const gitPrefix = raw.trim().toLowerCase().startsWith("git:");
  const gitSpec = parseGitPluginSpec(raw);
  if (gitPrefix && !gitSpec) {
    runtime.error(
      `Unsupported git plugin spec: ${raw}. Use ${formatCliCommand("openclaw plugins install git:<repo>@<ref>")}.`,
    );
    return runtime.exit(1);
  }
  if (gitSpec && opts.link) {
    runtime.error(
      `--link is not supported with git: installs. Use ${formatCliCommand("openclaw plugins install git:<repo>@<ref>")} for Git installs or ${formatCliCommand("openclaw plugins install --link <path>")} for local paths.`,
    );
    return runtime.exit(1);
  }
  if (gitSpec && opts.pin) {
    runtime.error(
      `--pin is not supported with git: installs. Pin the ref in the spec instead, for example ${formatCliCommand("openclaw plugins install git:<repo>@<ref>")}.`,
    );
    return runtime.exit(1);
  }
  if (opts.link && opts.force) {
    runtime.error(
      `--force is not supported with --link. Linked plugins point at the source path directly; remove --force and re-run ${formatCliCommand("openclaw plugins install --link <path>")}.`,
    );
    return runtime.exit(1);
  }
  const npmPackPath = parseNpmPackPrefixPath(raw);
  const clawhubSpec = parseClawHubPluginSpec(raw);
  const requestResolution = resolvePluginInstallRequestContext({
    rawSpec: raw,
    marketplace: opts.marketplace,
  });
  if (!requestResolution.ok) {
    runtime.error(requestResolution.error);
    return runtime.exit(1);
  }
  let request = requestResolution.request;
  const resolved = request.resolvedPath ?? request.normalizedSpec;
  const resolvesToLocalPath = fs.existsSync(resolved);
  if (!resolvesToLocalPath && (gitSpec || npmPackPath !== null || clawhubSpec))
    request = {
      ...request,
      installKind: "plugin",
    };
  const bundledPreNpmPlan = resolvesToLocalPath
    ? null
    : resolveBundledInstallPlanBeforeNpm({
        rawSpec: raw,
        findBundledSource: (lookup) => findBundledPluginSource({ lookup }),
      });
  const officialExternalPlan = resolvesToLocalPath
    ? null
    : resolveOfficialExternalInstallPlanBeforeNpm({
        rawSpec: raw,
        findOfficialExternalPlugin: (pluginId) => {
          const entry = getOfficialExternalPluginCatalogEntry(pluginId);
          const resolvedPluginId = entry ? resolveOfficialExternalPluginId(entry) : void 0;
          const install = entry ? resolveOfficialExternalPluginInstall(entry) : null;
          const npmSpec = install?.npmSpec;
          return resolvedPluginId && npmSpec
            ? {
                pluginId: resolvedPluginId,
                npmSpec,
                ...(install.expectedIntegrity
                  ? { expectedIntegrity: install.expectedIntegrity }
                  : {}),
              }
            : void 0;
        },
      });
  if (bundledPreNpmPlan || officialExternalPlan)
    request = {
      ...request,
      installKind: "plugin",
    };
  const snapshot = await loadConfigForInstall(request).catch((error) => {
    runtime.error(formatErrorMessage(error));
    return null;
  });
  if (!snapshot) return runtime.exit(1);
  const cfg = snapshot.config;
  const installMode = resolveInstallMode(opts.force);
  const safetyOverrides = resolveInstallSafetyOverrides({
    ...opts,
    config: cfg,
  });
  const extensionsDir = resolveDefaultPluginExtensionsDir();
  if (opts.marketplace) {
    const result = await installPluginFromMarketplace({
      ...safetyOverrides,
      marketplace: opts.marketplace,
      mode: installMode,
      plugin: raw,
      extensionsDir,
      logger: createPluginInstallLogger(runtime),
    });
    if (!result.ok) {
      if (!isClawHubBlockedCliFailure(result)) runtime.error(result.error);
      return runtime.exit(1);
    }
    await persistPluginInstall({
      snapshot,
      pluginId: result.pluginId,
      install: {
        source: "marketplace",
        installPath: result.targetDir,
        version: result.version,
        marketplaceName: result.marketplaceName,
        marketplaceSource: result.marketplaceSource,
        marketplacePlugin: result.marketplacePlugin,
      },
      invalidateRuntimeCache,
      runtime,
    });
    return;
  }
  if (fs.existsSync(resolved)) {
    const fullyBlockedReason = resolveFullyBlockedConfigMutationReason(snapshot);
    if (fullyBlockedReason) {
      runtime.error(fullyBlockedReason);
      return runtime.exit(1);
    }
    if (snapshot.pluginMutation.mode === "blocked" || snapshot.hookMutation.mode === "blocked") {
      const hookProbe = await probeHookPackFromPath({
        ...safetyOverrides,
        path: resolved,
        mode: installMode,
        inspection: "package-kind",
      });
      if (hookProbe.ok && hookProbe.packageKind === "hook-only") {
        if (snapshot.hookMutation.mode === "blocked") {
          runtime.error(snapshot.hookMutation.reason);
          return runtime.exit(1);
        }
        const hookFallback = await tryInstallHookPackFromLocalPath({
          snapshot,
          installMode,
          resolvedPath: resolved,
          safetyOverrides,
          ...(opts.link ? { link: true } : {}),
          expectedPackageKind: "hook-only",
          runtime,
        });
        if (hookFallback.ok) return;
        runtime.error(hookFallback.error);
        return runtime.exit(1);
      }
      if (snapshot.pluginMutation.mode === "blocked") {
        runtime.error(snapshot.pluginMutation.reason);
        return runtime.exit(1);
      }
    }
    if (opts.link) {
      const merged = uniqueStrings([...(cfg.plugins?.load?.paths ?? []), resolved]);
      const probe = await installPluginFromPath({
        ...safetyOverrides,
        mode: installMode,
        path: resolved,
        dryRun: true,
        allowSourceTypeScriptEntries: true,
        extensionsDir,
        logger: createPluginInstallLogger(runtime),
      });
      if (!probe.ok) {
        if (isTerminalPluginInstallFailure(probe.code)) {
          runtime.error(probe.error);
          return runtime.exit(1);
        }
        const hookFallback = await tryInstallHookPackFromLocalPath({
          snapshot,
          installMode,
          resolvedPath: resolved,
          safetyOverrides,
          link: true,
          runtime,
        });
        if (hookFallback.ok) return;
        runtime.error(formatPluginInstallWithHookFallbackError(probe.error, hookFallback));
        return runtime.exit(1);
      }
      await persistPluginInstall({
        snapshot: {
          ...snapshot,
          config: {
            ...cfg,
            plugins: {
              ...cfg.plugins,
              load: {
                ...cfg.plugins?.load,
                paths: merged,
              },
            },
          },
        },
        pluginId: probe.pluginId,
        install: {
          source: "path",
          sourcePath: resolved,
          installPath: resolved,
          version: probe.version,
        },
        invalidateRuntimeCache,
        successMessage: `Linked plugin path: ${shortenHomePath(resolved)}`,
        runtime,
      });
      return;
    }
    const result = await installPluginFromPath({
      ...safetyOverrides,
      mode: installMode,
      path: resolved,
      extensionsDir,
      logger: createPluginInstallLogger(runtime),
    });
    if (!result.ok) {
      if (isTerminalPluginInstallFailure(result.code)) {
        runtime.error(result.error);
        return runtime.exit(1);
      }
      const hookFallback = await tryInstallHookPackFromLocalPath({
        snapshot,
        installMode,
        resolvedPath: resolved,
        safetyOverrides,
        runtime,
      });
      if (hookFallback.ok) return;
      runtime.error(formatPluginInstallWithHookFallbackError(result.error, hookFallback));
      return runtime.exit(1);
    }
    const source = resolveArchiveKind(resolved) ? "archive" : "path";
    await persistPluginInstall({
      snapshot,
      pluginId: result.pluginId,
      install: {
        source,
        sourcePath: resolved,
        installPath: result.targetDir,
        version: result.version,
      },
      invalidateRuntimeCache,
      runtime,
    });
    return;
  }
  if (opts.link) {
    runtime.error(
      `--link requires a local path. Run ${formatCliCommand("openclaw plugins install --link <path>")}.`,
    );
    return runtime.exit(1);
  }
  const npmPrefixSpec = parseNpmPrefixSpec(raw);
  if (npmPrefixSpec !== null) {
    if (!npmPrefixSpec) {
      runtime.error(
        `Unsupported npm plugin spec: missing package. Use ${formatCliCommand("openclaw plugins install npm:<package>")}.`,
      );
      return runtime.exit(1);
    }
    const officialNpmTrust = resolveOfficialExternalNpmPackageTrust({
      npmSpec: npmPrefixSpec,
      findOfficialExternalPackage: findTrustedCatalogPackageInstall,
    });
    if (
      !(
        await tryInstallPluginOrHookPackFromNpmSpec({
          snapshot,
          installMode,
          spec: npmPrefixSpec,
          pin: opts.pin,
          safetyOverrides,
          allowBundledFallback: false,
          extensionsDir,
          invalidateRuntimeCache,
          ...(officialNpmTrust
            ? {
                expectedPluginId: officialNpmTrust.pluginId,
                ...(officialNpmTrust.expectedIntegrity
                  ? { expectedIntegrity: officialNpmTrust.expectedIntegrity }
                  : {}),
                trustedSourceLinkedOfficialInstall: true,
              }
            : {}),
          runtime,
        })
      ).ok
    )
      return runtime.exit(1);
    return;
  }
  if (npmPackPath !== null) {
    if (!npmPackPath) {
      runtime.error(
        `Unsupported npm-pack plugin spec: missing archive path. Use ${formatCliCommand("openclaw plugins install npm-pack:<path-to.tgz>")}.`,
      );
      return runtime.exit(1);
    }
    if (
      !(
        await tryInstallPluginFromNpmPackArchive({
          snapshot,
          installMode,
          archivePath: npmPackPath,
          safetyOverrides,
          extensionsDir,
          invalidateRuntimeCache,
          runtime,
        })
      ).ok
    )
      return runtime.exit(1);
    return;
  }
  if (gitSpec) {
    if (
      !(
        await tryInstallPluginFromGitSpec({
          snapshot,
          installMode,
          spec: raw,
          safetyOverrides,
          extensionsDir,
          invalidateRuntimeCache,
          runtime,
        })
      ).ok
    )
      return runtime.exit(1);
    return;
  }
  if (
    looksLikeLocalInstallSpec(raw, [
      ".ts",
      ".js",
      ".mjs",
      ".cjs",
      ".tgz",
      ".tar.gz",
      ".tar",
      ".zip",
    ])
  ) {
    runtime.error(
      `Plugin path not found: ${resolved}. Check the path, or install from npm with ${formatCliCommand("openclaw plugins install npm:<package>")}.`,
    );
    return runtime.exit(1);
  }
  if (bundledPreNpmPlan) {
    await tracePluginLifecyclePhaseAsync(
      "install execution",
      () =>
        installBundledPluginSource({
          snapshot,
          rawSpec: raw,
          bundledSource: bundledPreNpmPlan.bundledSource,
          warning: bundledPreNpmPlan.warning,
          invalidateRuntimeCache,
          runtime,
        }),
      {
        command: "install",
        source: "bundled",
        pluginId: bundledPreNpmPlan.bundledSource.pluginId,
      },
    );
    return;
  }
  if (officialExternalPlan) {
    if (
      !(
        await tryInstallPluginOrHookPackFromNpmSpec({
          snapshot,
          installMode,
          spec: officialExternalPlan.npmSpec,
          pin: opts.pin,
          safetyOverrides,
          allowBundledFallback: false,
          extensionsDir,
          expectedPluginId: officialExternalPlan.pluginId,
          expectedIntegrity: officialExternalPlan.expectedIntegrity,
          trustedSourceLinkedOfficialInstall: true,
          invalidateRuntimeCache,
          runtime,
        })
      ).ok
    )
      return runtime.exit(1);
    return;
  }
  if (clawhubSpec) {
    const result = await installPluginFromClawHub({
      ...safetyOverrides,
      ...resolveClawHubRiskAcknowledgementCliOptions({
        acknowledgeClawHubRisk: opts.acknowledgeClawHubRisk,
        action: "installing",
      }),
      mode: installMode,
      spec: raw,
      extensionsDir,
      logger: createPluginInstallLogger(runtime),
    });
    if (!result.ok) {
      if (!isClawHubBlockedCliFailure(result)) runtime.error(result.error);
      return runtime.exit(1);
    }
    await persistPluginInstall({
      snapshot,
      pluginId: result.pluginId,
      install: {
        ...buildClawHubPluginInstallRecordFields(result.clawhub),
        spec: raw,
        installPath: result.targetDir,
      },
      invalidateRuntimeCache,
      runtime,
    });
    return;
  }
  const officialNpmTrust = resolveOfficialExternalNpmPackageTrust({
    npmSpec: raw,
    findOfficialExternalPackage: findTrustedCatalogPackageInstall,
  });
  if (
    !(
      await tryInstallPluginOrHookPackFromNpmSpec({
        snapshot,
        installMode,
        spec: raw,
        pin: opts.pin,
        safetyOverrides,
        allowBundledFallback: true,
        extensionsDir,
        invalidateRuntimeCache,
        ...(officialNpmTrust
          ? {
              expectedPluginId: officialNpmTrust.pluginId,
              ...(officialNpmTrust.expectedIntegrity
                ? { expectedIntegrity: officialNpmTrust.expectedIntegrity }
                : {}),
              trustedSourceLinkedOfficialInstall: true,
            }
          : {}),
        runtime,
      })
    ).ok
  )
    return runtime.exit(1);
}
//#endregion
export { runPluginInstallCommand as n, loadConfigForInstall as t };
