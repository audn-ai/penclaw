import path from "node:path";
import { i as resolveBundledPluginSources } from "./bundled-sources-D7CuFv_v.js";
import { t as installPluginFromClawHub } from "./clawhub-BhV81Pwz.js";
import "./utils-DtcDeqWS.js";
import { E as satisfiesPluginApiRange } from "./clawhub-CgGOpxts.js";
import { t as CLAWHUB_INSTALL_ERROR_CODE } from "./clawhub-error-codes-OgrR1N6P.js";
import { t as buildClawHubPluginInstallRecordFields } from "./clawhub-install-records-Dy2deHKG.js";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-CzLwxQg_.js";
import {
  c as normalizePluginsConfig,
  l as resolveEffectiveEnableState,
} from "./config-state-C1Qyxaws.js";
import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import { t as installPluginFromGitSpec } from "./git-install-JvNiWiSz.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import {
  n as resolveNpmInstallSpecsForUpdateChannel,
  t as resolveClawHubInstallSpecsForUpdateChannel,
} from "./install-channel-specs-CA1vcdo6.js";
import {
  a as installPluginFromNpmSpec,
  t as PLUGIN_INSTALL_ERROR_CODE,
} from "./install-CjCRVnj8.js";
import { o as resolvePluginInstallDir } from "./install-paths-CqMnrXsY.js";
import { n as unscopedPackageName } from "./install-safe-path-EhqVsq3P.js";
import {
  n as createNpmMetadataEnv,
  o as resolveNpmSpecMetadata,
} from "./install-source-utils-Cvk6wk9f.js";
import {
  d as resolveNpmInstallRecordSpec,
  l as buildNpmResolutionInstallFields,
  u as recordPluginInstall,
} from "./installed-plugin-index-records-BP7rp3ti.js";
import {
  i as resolveTrustedSourceLinkedOfficialNpmSpec,
  r as resolveTrustedSourceLinkedOfficialClawHubSpec,
} from "./manifest-registry-CXy9BBfE.js";
import { t as installPluginFromMarketplace } from "./marketplace-CTGR0h9d.js";
import { t as checkMinHostVersion } from "./min-host-version-X0iggZMD.js";
import {
  a as isPrereleaseResolutionAllowed,
  i as isOpenClawOrgNpmSpec,
  o as isPrereleaseSemverVersion,
  r as isExactSemverVersion,
  s as parseRegistryNpmSpec,
  t as compareOpenClawReleaseVersions,
} from "./npm-registry-spec-CqBTTiC9.js";
import {
  d as resolveOfficialExternalPluginInstall,
  t as getOfficialExternalPluginCatalogEntry,
} from "./official-external-plugin-catalog-B2V9K3em.js";
import { i as resolvePackagePluginApiRange } from "./package-entry-resolution-BGL_bDuB.js";
import {
  i as readInstalledPackageVersion,
  n as installedPackageNeedsOpenClawPeerLinkRepair,
  r as readInstalledPackagePeerDependencies,
  t as expectedIntegrityForUpdate,
} from "./package-update-utils-T2vDkLHN.js";
import { r as linkOpenClawPeerDependencies } from "./plugin-peer-link-CMrc53yA.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { n as compareValidSemver } from "./semver-aYpwYdrQ.js";
import { n as defaultSlotIdForKey } from "./slots-kpL659LX.js";
import { o as resolveCompatibilityHostVersion } from "./version-CeFj_iGk.js";
//#region src/plugins/externalized-bundled-plugins.ts
function normalizePluginId(value) {
  return value?.trim() ?? "";
}
function normalizeOptionalSpec(value) {
  return value?.trim() ?? "";
}
function getExternalizedBundledPluginPreferredSource(bridge) {
  if (bridge.preferredSource === "clawhub") return "clawhub";
  if (bridge.preferredSource === "npm") return "npm";
  return normalizeOptionalSpec(bridge.clawhubSpec) && !normalizeOptionalSpec(bridge.npmSpec)
    ? "clawhub"
    : "npm";
}
function getExternalizedBundledPluginNpmSpec(bridge) {
  return normalizeOptionalSpec(bridge.npmSpec);
}
function getExternalizedBundledPluginClawHubSpec(bridge) {
  return normalizeOptionalSpec(bridge.clawhubSpec);
}
function getExternalizedBundledPluginTargetId(bridge) {
  return normalizePluginId(bridge.pluginId) || normalizePluginId(bridge.bundledPluginId);
}
function getExternalizedBundledPluginLookupIds(bridge) {
  return Array.from(
    new Set(
      [
        bridge.bundledPluginId,
        bridge.pluginId,
        ...(bridge.legacyPluginIds ?? []),
        ...(bridge.channelIds ?? []),
      ]
        .map(normalizePluginId)
        .filter(Boolean),
    ),
  );
}
function getExternalizedBundledPluginLegacyPathSuffix(bridge) {
  return ["extensions", bridge.bundledDirName ?? bridge.bundledPluginId].join("/");
}
//#endregion
//#region src/plugins/update.ts
/** Updates installed plugins across npm, ClawHub, marketplace, Git, and bundled bridge sources. */
/** Return whether a tracked plugin install source can be updated in place. */
function isPluginInstallRecordUpdateSource(record) {
  return (
    record?.source === "npm" ||
    record?.source === "marketplace" ||
    record?.source === "clawhub" ||
    record?.source === "git"
  );
}
/** Return whether update identity compatibility can migrate an unscoped install key. */
function pluginInstallRecordMayMigrateConfigId(params) {
  if (!isPluginInstallRecordUpdateSource(params.record)) return false;
  if (params.record?.source !== "npm") return !params.pluginId.includes("/");
  const packageName =
    resolveNpmSpecPackageName(params.specOverride ?? params.record.spec) ??
    params.record.resolvedName ??
    resolveNpmSpecPackageName(params.record.resolvedSpec);
  return Boolean(
    packageName &&
    packageName !== params.pluginId &&
    unscopedPackageName(packageName) === params.pluginId,
  );
}
function formatNpmInstallFailure(params) {
  if (params.result.code === PLUGIN_INSTALL_ERROR_CODE.NPM_PACKAGE_NOT_FOUND)
    return `Failed to ${params.phase} ${params.pluginId}: npm package not found for ${params.spec}.`;
  return `Failed to ${params.phase} ${params.pluginId}: ${params.result.error}`;
}
function formatMarketplaceInstallFailure(params) {
  return `Failed to ${params.phase} ${params.pluginId}: ${params.error} (marketplace plugin ${params.marketplacePlugin} from ${params.marketplaceSource}).`;
}
function formatClawHubInstallFailure(params) {
  return `Failed to ${params.phase} ${params.pluginId}: ${params.error} (ClawHub ${params.spec}).`;
}
function isClawHubRiskAcknowledgementRequired(result) {
  return result.code === CLAWHUB_INSTALL_ERROR_CODE.CLAWHUB_RISK_ACKNOWLEDGEMENT_REQUIRED;
}
function isClawHubDownloadBlocked(result) {
  return result.code === CLAWHUB_INSTALL_ERROR_CODE.CLAWHUB_DOWNLOAD_BLOCKED;
}
function isClawHubSecurityUnavailable(result) {
  return result.code === CLAWHUB_INSTALL_ERROR_CODE.CLAWHUB_SECURITY_UNAVAILABLE;
}
function readClawHubTrustErrorCode(result) {
  if (
    result.code === CLAWHUB_INSTALL_ERROR_CODE.CLAWHUB_RISK_ACKNOWLEDGEMENT_REQUIRED ||
    result.code === CLAWHUB_INSTALL_ERROR_CODE.CLAWHUB_DOWNLOAD_BLOCKED ||
    result.code === CLAWHUB_INSTALL_ERROR_CODE.CLAWHUB_SECURITY_UNAVAILABLE
  )
    return result.code;
}
function shouldSkipClawHubTrustFailureForExistingInstall(params) {
  if (isClawHubRiskAcknowledgementRequired(params.result)) return Boolean(params.currentVersion);
  if (isClawHubSecurityUnavailable(params.result)) return Boolean(params.currentVersion);
  if (!isClawHubDownloadBlocked(params.result)) return false;
  return Boolean(
    params.result.version &&
    params.currentVersion &&
    params.result.version !== params.currentVersion,
  );
}
function buildClawHubTrustSkippedOutcome(params) {
  return {
    pluginId: params.pluginId,
    status: "skipped",
    ...(params.code ? { code: params.code } : {}),
    ...(params.currentVersion ? { currentVersion: params.currentVersion } : {}),
    ...(params.warning ? { warning: params.warning } : {}),
    message: `Skipped ${params.pluginId} ClawHub ${params.phase}: ${params.error} Existing installed plugin left unchanged.`,
  };
}
function isClawHubTrustSkippedOutcome(outcome) {
  return (
    outcome.status === "skipped" &&
    (outcome.code === CLAWHUB_INSTALL_ERROR_CODE.CLAWHUB_RISK_ACKNOWLEDGEMENT_REQUIRED ||
      outcome.code === CLAWHUB_INSTALL_ERROR_CODE.CLAWHUB_DOWNLOAD_BLOCKED ||
      outcome.code === CLAWHUB_INSTALL_ERROR_CODE.CLAWHUB_SECURITY_UNAVAILABLE)
  );
}
function formatGitInstallFailure(params) {
  return `Failed to ${params.phase} ${params.pluginId}: ${params.error} (git ${params.spec}).`;
}
function shouldSkipUnchangedNpmInstall(params) {
  if (!params.currentVersion || !params.metadata.version) return false;
  if (params.currentVersion !== params.metadata.version) return false;
  if (!params.record.resolvedName || !params.record.resolvedSpec || !params.record.resolvedVersion)
    return false;
  if (!params.metadata.name || !params.metadata.resolvedSpec) return false;
  if (params.metadata.integrity && !params.record.integrity) return false;
  if (params.metadata.shasum && !params.record.shasum) return false;
  return (
    (!params.metadata.integrity || params.record.integrity === params.metadata.integrity) &&
    (!params.metadata.shasum || params.record.shasum === params.metadata.shasum) &&
    params.record.resolvedName === params.metadata.name &&
    params.record.resolvedSpec === params.metadata.resolvedSpec &&
    params.record.resolvedVersion === params.metadata.version
  );
}
function shouldBypassTrustedOfficialUnchangedNpmCheck(params) {
  if (!params.trustedSourceLinkedOfficialInstall || !params.metadata.version) return false;
  const parsedSpec = parseRegistryNpmSpec(params.spec);
  return Boolean(
    parsedSpec &&
    !isPrereleaseResolutionAllowed({
      spec: parsedSpec,
      resolvedVersion: params.metadata.version,
    }),
  );
}
function expectedIntegrityForNpmUpdate(params) {
  if (params.record.source !== "npm") return;
  if (params.effectiveSpec === params.record.spec)
    return expectedIntegrityForUpdate(params.record.spec, params.record.integrity);
  if (!params.trustedSourceLinkedOfficialInstall || !params.metadata) return;
  const metadataName = params.metadata.name ?? resolveNpmSpecPackageName(params.effectiveSpec);
  const recordName =
    params.record.resolvedName ??
    resolveNpmSpecPackageName(params.record.resolvedSpec) ??
    resolveNpmSpecPackageName(params.record.spec);
  if (!metadataName || metadataName !== recordName) return;
  if (!params.metadata.version || params.metadata.version !== params.record.resolvedVersion) return;
  return expectedIntegrityForUpdate(
    params.record.resolvedSpec ?? params.record.spec,
    params.record.integrity,
  );
}
function compareNpmSemverForUpdate(left, right) {
  const releaseCmp = compareOpenClawReleaseVersions(left, right);
  if (releaseCmp !== null) return releaseCmp;
  return compareValidSemver(left, right) ?? 0;
}
async function resolveNewerExactPinnedNpmDefaultLine(params) {
  if (!params.currentVersion || !params.probeNpmVersion || !params.effectiveSpec) return;
  const packageName = resolveNpmSpecPackageName(params.effectiveSpec);
  const exactVersion = resolveExactNpmSpecVersion(params.effectiveSpec);
  const probeNpmVersion = normalizeExactNpmVersion(params.probeNpmVersion);
  if (!packageName || !exactVersion || probeNpmVersion !== exactVersion) return;
  const metadataResult = await resolveNpmSpecMetadata({
    spec: packageName,
    timeoutMs: params.timeoutMs,
  }).catch(() => void 0);
  if (
    !metadataResult?.ok ||
    metadataResult.metadata.name !== packageName ||
    !metadataResult.metadata.version
  )
    return;
  return compareNpmSemverForUpdate(metadataResult.metadata.version, params.currentVersion) > 0
    ? {
        packageName,
        version: metadataResult.metadata.version,
      }
    : void 0;
}
async function loadNpmPackageVersionsForUpdate(params) {
  const versions = await runCommandWithTimeout(
    ["npm", "view", params.packageName, "versions", "--json"],
    {
      timeoutMs: Math.max(params.timeoutMs ?? 0, 6e4),
      env: createNpmMetadataEnv(),
    },
  );
  if (!versions || versions.code !== 0) return null;
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
async function resolveTrustedOfficialPrereleaseFallbackMetadataForUpdate(params) {
  const parsedSpec = parseRegistryNpmSpec(params.spec);
  if (
    !parsedSpec ||
    !parsedSpec.name.startsWith("@openclaw/") ||
    !params.metadata.version ||
    isPrereleaseResolutionAllowed({
      spec: parsedSpec,
      resolvedVersion: params.metadata.version,
    })
  )
    return;
  const versions = await loadNpmPackageVersionsForUpdate({
    packageName: parsedSpec.name,
    timeoutMs: params.timeoutMs,
  });
  const stableVersion = versions
    ?.filter((value) => !isPrereleaseSemverVersion(value))
    .toSorted(compareNpmSemverForUpdate)
    .at(-1);
  if (stableVersion) {
    const stableMetadata = await resolveNpmSpecMetadata({
      spec: `${parsedSpec.name}@${stableVersion}`,
      timeoutMs: params.timeoutMs,
    });
    return stableMetadata.ok
      ? {
          kind: "stable",
          metadata: stableMetadata.metadata,
        }
      : void 0;
  }
  const prereleaseVersion = versions
    ?.filter(isPrereleaseSemverVersion)
    .toSorted(compareNpmSemverForUpdate)
    .at(-1);
  if (!prereleaseVersion || !versions?.every(isPrereleaseSemverVersion)) return;
  if (prereleaseVersion === params.metadata.version)
    return {
      kind: "prerelease-only",
      metadata: params.metadata,
    };
  const prereleaseMetadata = await resolveNpmSpecMetadata({
    spec: `${parsedSpec.name}@${prereleaseVersion}`,
    timeoutMs: params.timeoutMs,
  });
  return prereleaseMetadata.ok
    ? {
        kind: "prerelease-only",
        metadata: prereleaseMetadata.metadata,
      }
    : void 0;
}
async function expectedIntegrityForNpmFallback(params) {
  if (params.record.source !== "npm" || !params.fallbackSpec) return;
  if (params.fallbackSpec === params.record.spec)
    return expectedIntegrityForUpdate(params.record.spec, params.record.integrity);
  if (!params.trustedSourceLinkedOfficialInstall) return;
  const fallbackMetadata = await resolveNpmSpecMetadata({
    spec: params.fallbackSpec,
    timeoutMs: params.timeoutMs,
  });
  if (!fallbackMetadata.ok) return;
  const expectedIntegrityMetadata =
    (
      await resolveTrustedOfficialPrereleaseFallbackMetadataForUpdate({
        metadata: fallbackMetadata.metadata,
        spec: params.fallbackSpec,
        timeoutMs: params.timeoutMs,
      })
    )?.metadata ?? fallbackMetadata.metadata;
  if (!isNpmMetadataCompatibleWithCurrentHost(expectedIntegrityMetadata)) return;
  return expectedIntegrityForNpmUpdate({
    effectiveSpec: params.fallbackSpec,
    metadata: expectedIntegrityMetadata,
    record: params.record,
    trustedSourceLinkedOfficialInstall: true,
  });
}
function isNpmMetadataCompatibleWithCurrentHost(metadata) {
  const hostVersion = resolveCompatibilityHostVersion();
  const installMetadata = metadata.packageOpenClaw?.install;
  if (
    !checkMinHostVersion({
      currentVersion: hostVersion,
      minHostVersion: isRecord(installMetadata) ? installMetadata.minHostVersion : void 0,
    }).ok
  )
    return false;
  const pluginApiRangeCheck = resolvePackagePluginApiRange(metadata.packageOpenClaw);
  if (!pluginApiRangeCheck.ok) return false;
  const pluginApiRange = pluginApiRangeCheck.range;
  if (!pluginApiRange) return true;
  return satisfiesPluginApiRange(hostVersion, pluginApiRange);
}
function isBundledVersionNewer(bundledVersion, installedVersion) {
  const releaseCmp = compareOpenClawReleaseVersions(bundledVersion, installedVersion);
  if (releaseCmp !== null) return releaseCmp > 0;
  return (compareValidSemver(bundledVersion, installedVersion) ?? 0) > 0;
}
function pathsEqual(left, right, env = process.env) {
  if (!left || !right) return false;
  return resolveUserPath(left, env) === resolveUserPath(right, env);
}
function resolveRecordedExtensionsDir(params) {
  const parentDir = path.dirname(params.installPath);
  try {
    return pathsEqual(resolvePluginInstallDir(params.pluginId, parentDir), params.installPath)
      ? parentDir
      : void 0;
  } catch {
    return;
  }
}
function buildLoadPathHelpers(existing, env = process.env) {
  let paths = [...existing];
  const resolveSet = () => new Set(paths.map((entry) => resolveUserPath(entry, env)));
  let resolved = resolveSet();
  let changed = false;
  const addPath = (value) => {
    const normalized = resolveUserPath(value, env);
    if (resolved.has(normalized)) return;
    paths.push(value);
    resolved.add(normalized);
    changed = true;
  };
  const removePath = (value) => {
    const normalized = resolveUserPath(value, env);
    if (!resolved.has(normalized)) return;
    paths = paths.filter((entry) => resolveUserPath(entry, env) !== normalized);
    resolved = resolveSet();
    changed = true;
  };
  const removeMatching = (predicate) => {
    const next = paths.filter((entry) => !predicate(entry));
    if (next.length === paths.length) return;
    paths = next;
    resolved = resolveSet();
    changed = true;
  };
  return {
    addPath,
    removePath,
    removeMatching,
    get changed() {
      return changed;
    },
    get paths() {
      return paths;
    },
  };
}
function normalizePathSegment(value) {
  return (
    value
      ?.trim()
      .replaceAll("\\", "/")
      .replace(/^\/+|\/+$/g, "") ?? ""
  );
}
function pathEndsWithSegment(params) {
  const value = normalizePathSegment(params.value ? resolveUserPath(params.value, params.env) : "");
  const segment = normalizePathSegment(params.segment);
  return Boolean(value && segment && (value === segment || value.endsWith(`/${segment}`)));
}
function isBridgeBundledPathRecord(params) {
  if (params.record.source !== "path") return false;
  if (
    params.bundledLocalPath &&
    (pathsEqual(params.record.sourcePath, params.bundledLocalPath, params.env) ||
      pathsEqual(params.record.installPath, params.bundledLocalPath, params.env))
  )
    return true;
  const bundledPathSuffix = getExternalizedBundledPluginLegacyPathSuffix(params.bridge);
  return (
    pathEndsWithSegment({
      value: params.record.sourcePath,
      segment: bundledPathSuffix,
      env: params.env,
    }) ||
    pathEndsWithSegment({
      value: params.record.installPath,
      segment: bundledPathSuffix,
      env: params.env,
    })
  );
}
function removeBridgeBundledLoadPaths(params) {
  const bundledPathSuffix = getExternalizedBundledPluginLegacyPathSuffix(params.bridge);
  params.loadPaths.removeMatching((entry) =>
    pathEndsWithSegment({
      value: entry,
      segment: bundledPathSuffix,
      env: params.env,
    }),
  );
}
function resolveBridgeInstallRecord(params) {
  for (const pluginId of getExternalizedBundledPluginLookupIds(params.bridge)) {
    if (!Object.hasOwn(params.installs, pluginId)) continue;
    const record = params.installs[pluginId];
    if (record)
      return {
        pluginId,
        record,
      };
  }
}
function isBridgeChannelEnabledByConfig(params) {
  const channels = params.config.channels;
  if (!channels || typeof channels !== "object" || Array.isArray(channels)) return false;
  for (const channelId of params.bridge.channelIds ?? []) {
    const entry = channels[channelId];
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
    if (Object.is(entry.enabled, true)) return true;
  }
  return false;
}
function isExternalizedBundledPluginEnabled(params) {
  const normalized = normalizePluginsConfig(params.config.plugins);
  if (!normalized.enabled) return false;
  const pluginIds = getExternalizedBundledPluginLookupIds(params.bridge);
  if (
    pluginIds.some(
      (pluginId) =>
        normalized.deny.includes(pluginId) ||
        Object.is(normalized.entries[pluginId]?.enabled, false),
    )
  )
    return false;
  for (const pluginId of pluginIds)
    if (
      resolveEffectiveEnableState({
        id: pluginId,
        origin: "bundled",
        config: normalized,
        rootConfig: params.config,
        enabledByDefault: params.bridge.enabledByDefault,
      }).enabled
    )
      return true;
  if (isBridgeChannelEnabledByConfig(params)) return true;
  return false;
}
function shouldFallbackClawHubBridgeToNpm(params) {
  if (!isOpenClawOrgNpmSpec(params.npmSpec)) return false;
  return (
    params.result.code === CLAWHUB_INSTALL_ERROR_CODE.PACKAGE_NOT_FOUND ||
    params.result.code === CLAWHUB_INSTALL_ERROR_CODE.VERSION_NOT_FOUND ||
    params.result.code === CLAWHUB_INSTALL_ERROR_CODE.ARTIFACT_DOWNLOAD_UNAVAILABLE ||
    params.result.code === CLAWHUB_INSTALL_ERROR_CODE.ARTIFACT_UNAVAILABLE
  );
}
function shouldFallbackClawHubToDefault(result) {
  return (
    result.code === CLAWHUB_INSTALL_ERROR_CODE.PACKAGE_NOT_FOUND ||
    result.code === CLAWHUB_INSTALL_ERROR_CODE.VERSION_NOT_FOUND
  );
}
function shouldFallbackBetaClawHubUpdate(result) {
  return shouldFallbackClawHubToDefault(result);
}
function isUnavailableNpmTarget(result) {
  return (
    result.code === PLUGIN_INSTALL_ERROR_CODE.NPM_PACKAGE_NOT_FOUND ||
    /\b(ETARGET|notarget)\b|No matching version found|dist-tag|tag .*not found/i.test(result.error)
  );
}
function describeBetaNpmFallback(params) {
  const betaSpec = params.betaSpec ?? "the beta npm release";
  const reason = isUnavailableNpmTarget(params.result)
    ? "has no beta npm release"
    : "failed beta npm update";
  return `Plugin "${params.pluginId}" ${reason} for ${betaSpec}; using ${params.fallbackSpec} instead. Core update can still complete.`;
}
function formatNpmSpecSelectorLabel(spec) {
  const parsed = spec ? parseRegistryNpmSpec(spec) : void 0;
  if (!parsed) return spec ?? "unknown";
  if (parsed.selectorKind === "none") return "@latest";
  return `@${parsed.selector}`;
}
function describeNpmChannelFallback(params) {
  const requestedSpec = params.requestedSpec ?? "unknown";
  const requestedLabel = formatNpmSpecSelectorLabel(params.requestedSpec);
  const usedLabel = formatNpmSpecSelectorLabel(params.usedSpec);
  const reason = isUnavailableNpmTarget(params.result) ? "unavailable" : "failed";
  const message =
    reason === "unavailable"
      ? `plugin channel fallback: ${params.pluginId} ${params.verb} ${usedLabel} because ${requestedLabel} was unavailable`
      : `plugin channel fallback: ${params.pluginId} ${params.verb} ${usedLabel} after ${requestedLabel} failed`;
  return {
    requestedSpec,
    usedSpec: params.usedSpec,
    requestedLabel,
    usedLabel,
    reason,
    message,
  };
}
function formatBetaChannelFallbackOutcomeSuffix(params) {
  if (!params.fallbackSpec) return "";
  const betaTarget = params.fallbackLabel ?? "beta target";
  return ` (warning: beta channel fallback ${params.verb} ${params.fallbackSpec} because ${betaTarget} could not be used).`;
}
function npmUpdateFailureSpec(params) {
  if (params.usedFallback && params.fallbackSpec) return params.fallbackSpec;
  return params.effectiveSpec ?? params.fallbackSpec ?? "unknown";
}
function resolveNpmSpecPackageName(spec) {
  return spec ? parseRegistryNpmSpec(spec)?.name : void 0;
}
function resolveExactNpmSpecVersion(spec) {
  const parsed = spec ? parseRegistryNpmSpec(spec) : null;
  return parsed?.selectorKind === "exact-version"
    ? normalizeExactNpmVersion(parsed.selector)
    : void 0;
}
function normalizeExactNpmVersion(value) {
  if (!value) return;
  const trimmed = value.trim();
  if (!isExactSemverVersion(trimmed)) return;
  return trimmed.startsWith("v") ? trimmed.slice(1) : trimmed;
}
function resolveNpmResultVersion(result) {
  return result.npmResolution?.version;
}
function resolveClawHubSpecPackageName(spec) {
  return spec ? parseClawHubPluginSpec(spec)?.name : void 0;
}
function isOfficialClawHubInstallRecord(record) {
  if (record.source !== "clawhub" || record.clawhubChannel !== "official") return false;
  return (record.clawhubUrl ?? "").replace(/\/+$/, "") === "https://clawhub.ai";
}
function resolveTrustedSourceLinkedOfficialNpmFallbackForClawHubUpdate(params) {
  if (!isOfficialClawHubInstallRecord(params.record)) return null;
  const entry = getOfficialExternalPluginCatalogEntry(params.pluginId);
  if (!entry) return null;
  const officialSpec = resolveOfficialExternalPluginInstall(entry)?.npmSpec;
  const officialPackageName = resolveNpmSpecPackageName(officialSpec);
  if (!officialSpec || !officialPackageName) return null;
  if (
    ![
      params.record.clawhubPackage,
      resolveClawHubSpecPackageName(params.record.spec),
      resolveClawHubSpecPackageName(params.effectiveClawHubSpec),
    ]
      .filter((value) => Boolean(value))
      .includes(officialPackageName)
  )
    return null;
  const effectiveClawHubVersion = params.effectiveClawHubSpec
    ? parseClawHubPluginSpec(params.effectiveClawHubSpec)?.version
    : void 0;
  const recordClawHubVersion = params.recordClawHubSpec
    ? parseClawHubPluginSpec(params.recordClawHubSpec)?.version
    : void 0;
  if (effectiveClawHubVersion && effectiveClawHubVersion.toLowerCase() !== "latest")
    return {
      installSpec: `${officialPackageName}@${effectiveClawHubVersion}`,
      recordSpec:
        recordClawHubVersion && recordClawHubVersion.toLowerCase() !== "latest"
          ? `${officialPackageName}@${recordClawHubVersion}`
          : officialSpec,
      ...(params.updateChannel === "beta" && effectiveClawHubVersion.toLowerCase() === "beta"
        ? {
            fallbackSpec: officialSpec,
            fallbackLabel: `${officialPackageName}@beta`,
          }
        : {}),
    };
  return resolveNpmInstallSpecsForUpdateChannel({
    spec: officialSpec,
    updateChannel: params.updateChannel,
    officialPackageName,
    coreVersion: params.coreVersion,
  });
}
function isTrustedSourceLinkedOfficialNpmUpdate(params) {
  const officialPackageName = resolveNpmSpecPackageName(
    resolveTrustedSourceLinkedOfficialNpmSpec(params),
  );
  const requestedPackageName = resolveNpmSpecPackageName(params.spec);
  return Boolean(officialPackageName && requestedPackageName === officialPackageName);
}
function isTrustedSourceLinkedOfficialBridgeNpmInstall(params) {
  const entry = getOfficialExternalPluginCatalogEntry(params.targetPluginId);
  if (!entry) return false;
  const officialPackageName = resolveNpmSpecPackageName(
    resolveOfficialExternalPluginInstall(entry)?.npmSpec,
  );
  const requestedPackageName = resolveNpmSpecPackageName(params.npmSpec);
  return Boolean(officialPackageName && requestedPackageName === officialPackageName);
}
function isBridgeNpmInstall(params) {
  const npmSpec = getExternalizedBundledPluginNpmSpec(params.bridge);
  if (!npmSpec || params.record.source !== "npm") return false;
  const bridgePackageName = resolveNpmSpecPackageName(npmSpec);
  const recordPackageName =
    params.record.resolvedName ??
    resolveNpmSpecPackageName(params.record.spec) ??
    resolveNpmSpecPackageName(params.record.resolvedSpec);
  return Boolean(bridgePackageName && recordPackageName === bridgePackageName);
}
function isBridgeClawHubInstall(params) {
  if (params.record.source !== "clawhub") return false;
  const clawhubSpec = getExternalizedBundledPluginClawHubSpec(params.bridge);
  const bridgeClawHubPackage = clawhubSpec ? parseClawHubPluginSpec(clawhubSpec)?.name : void 0;
  const recordClawHubPackage =
    params.record.clawhubPackage ?? parseClawHubPluginSpec(params.record.spec ?? "")?.name;
  return Boolean(bridgeClawHubPackage && recordClawHubPackage === bridgeClawHubPackage);
}
function resolveNpmUpdateSpecs(params) {
  const recordSpec =
    params.specOverride ??
    (params.updateChannel === "extended-stable" && params.record.spec
      ? params.record.spec
      : (params.officialSpecOverride ?? params.record.spec));
  if (!recordSpec) return {};
  if (params.specOverride)
    return resolveNpmInstallSpecsForUpdateChannel({
      spec: recordSpec,
      updateChannel: params.updateChannel,
      officialPackageName: params.officialPackageName,
      coreVersion: params.coreVersion,
    });
  return resolveNpmInstallSpecsForUpdateChannel({
    spec: recordSpec,
    updateChannel: params.updateChannel,
    officialPackageName: params.officialPackageName,
    coreVersion: params.coreVersion,
  });
}
function resolveClawHubUpdateSpecs(params) {
  if (!params.officialSpecOverride && !params.record.clawhubPackage) return {};
  return resolveClawHubInstallSpecsForUpdateChannel({
    spec:
      params.officialSpecOverride ??
      params.record.spec ??
      `clawhub:${params.record.clawhubPackage}`,
    updateChannel: params.updateChannel,
  });
}
function isBridgeAlreadyInstalledFromPreferredSource(params) {
  return getExternalizedBundledPluginPreferredSource(params.bridge) === "clawhub"
    ? isBridgeClawHubInstall(params)
    : isBridgeNpmInstall(params);
}
function isBridgeInstalledFromFallbackSource(params) {
  return getExternalizedBundledPluginPreferredSource(params.bridge) === "clawhub"
    ? isBridgeNpmInstall(params)
    : isBridgeClawHubInstall(params);
}
function replacePluginIdInList(entries, fromId, toId) {
  if (!entries || entries.length === 0 || fromId === toId || !entries.includes(fromId))
    return entries;
  const next = [];
  for (const entry of entries) {
    const value = entry === fromId ? toId : entry;
    if (!next.includes(value)) next.push(value);
  }
  return next;
}
function migratePluginConfigId(cfg, fromId, toId) {
  const plugins = cfg.plugins;
  if (fromId === toId || !plugins) return cfg;
  let nextPlugins = plugins;
  const ensureNextPlugins = () => {
    if (nextPlugins === plugins) nextPlugins = { ...plugins };
    return nextPlugins;
  };
  const installs = plugins.installs;
  if (installs && Object.hasOwn(installs, fromId)) {
    const record = installs[fromId];
    const nextInstalls = { ...installs };
    if (record && !Object.hasOwn(installs, toId))
      Object.defineProperty(nextInstalls, toId, {
        configurable: true,
        enumerable: true,
        value: record,
        writable: true,
      });
    delete nextInstalls[fromId];
    ensureNextPlugins().installs = nextInstalls;
  }
  const entries = plugins.entries;
  if (entries && Object.hasOwn(entries, fromId)) {
    const entry = entries[fromId];
    const existingEntry = Object.hasOwn(entries, toId) ? entries[toId] : void 0;
    const nextEntries = { ...entries };
    if (entry)
      Object.defineProperty(nextEntries, toId, {
        configurable: true,
        enumerable: true,
        value: existingEntry
          ? {
              ...entry,
              ...existingEntry,
            }
          : entry,
        writable: true,
      });
    delete nextEntries[fromId];
    ensureNextPlugins().entries = nextEntries;
  }
  const allow = replacePluginIdInList(plugins.allow, fromId, toId);
  if (allow !== plugins.allow) ensureNextPlugins().allow = allow;
  const deny = replacePluginIdInList(plugins.deny, fromId, toId);
  if (deny !== plugins.deny) ensureNextPlugins().deny = deny;
  const slots = plugins.slots;
  if (slots?.memory === fromId || slots?.contextEngine === fromId)
    ensureNextPlugins().slots = {
      ...slots,
      ...(slots.memory === fromId ? { memory: toId } : {}),
      ...(slots.contextEngine === fromId ? { contextEngine: toId } : {}),
    };
  return nextPlugins === plugins
    ? cfg
    : {
        ...cfg,
        plugins: nextPlugins,
      };
}
function withoutPluginInstallRecord(cfg, pluginId) {
  const installs = cfg.plugins?.installs;
  if (!installs || !Object.hasOwn(installs, pluginId)) return cfg;
  const { [pluginId]: _removed, ...nextInstalls } = installs;
  return {
    ...cfg,
    plugins: {
      ...cfg.plugins,
      installs: nextInstalls,
    },
  };
}
function createPluginUpdateIntegrityDriftHandler(params) {
  return async (drift) => {
    const payload = {
      pluginId: params.pluginId,
      spec: drift.spec,
      expectedIntegrity: drift.expectedIntegrity,
      actualIntegrity: drift.actualIntegrity,
      resolvedSpec: drift.resolution.resolvedSpec,
      resolvedVersion: drift.resolution.version,
      dryRun: params.dryRun,
    };
    if (params.onIntegrityDrift) return await params.onIntegrityDrift(payload);
    params.logger.warn?.(
      `Integrity drift for "${params.pluginId}" (${payload.resolvedSpec ?? payload.spec}): expected ${payload.expectedIntegrity}, got ${payload.actualIntegrity}`,
    );
    return false;
  };
}
function removeDisabledPluginIdFromList(list, pluginId) {
  if (!Array.isArray(list) || !list.includes(pluginId)) return list;
  const next = list.filter((id) => id !== pluginId);
  return next.length > 0 ? next : void 0;
}
function resetDisabledPluginSlots(slots, pluginId) {
  if (!slots) return slots;
  let next = slots;
  if (next.memory === pluginId)
    next = {
      ...next,
      memory: defaultSlotIdForKey("memory"),
    };
  if (next.contextEngine === pluginId)
    next = {
      ...next,
      contextEngine: defaultSlotIdForKey("contextEngine"),
    };
  return next;
}
function disablePluginConfigEntry(config, pluginId) {
  const pluginsConfig = config.plugins ?? {};
  const existingEntry = pluginsConfig.entries?.[pluginId];
  return {
    ...config,
    plugins: {
      ...pluginsConfig,
      allow: removeDisabledPluginIdFromList(pluginsConfig.allow, pluginId),
      deny: removeDisabledPluginIdFromList(pluginsConfig.deny, pluginId),
      slots: resetDisabledPluginSlots(pluginsConfig.slots, pluginId),
      entries: {
        ...pluginsConfig.entries,
        [pluginId]: {
          ...existingEntry,
          enabled: false,
        },
      },
    },
  };
}
async function repairOpenClawPeerLinksForNpmInstalls(params) {
  let repaired = false;
  for (const [pluginId, record] of Object.entries(params.config.plugins?.installs ?? {})) {
    if (record.source !== "npm") continue;
    let installPath;
    try {
      installPath = resolveUserPath(
        record.installPath?.trim() || resolvePluginInstallDir(pluginId),
      );
    } catch (err) {
      params.logger.warn?.(
        `Could not repair openclaw peer link for "${pluginId}" due to invalid install path: ${String(err)}`,
      );
      continue;
    }
    if (!installedPackageNeedsOpenClawPeerLinkRepair(installPath)) continue;
    const peerDependencies = readInstalledPackagePeerDependencies(installPath);
    if (!Object.hasOwn(peerDependencies, "openclaw")) continue;
    try {
      const warnings = [];
      if (
        (
          await linkOpenClawPeerDependencies({
            installedDir: installPath,
            peerDependencies,
            logger: {
              info: (message) => params.logger.info?.(message),
              warn: (message) => warnings.push(message),
            },
          })
        ).skipped > 0
      ) {
        params.logger.warn?.(
          `Could not repair openclaw peer link for "${pluginId}" at ${installPath}: ${warnings.join("; ") || "peer link repair was skipped"}`,
        );
        continue;
      }
      repaired = !installedPackageNeedsOpenClawPeerLinkRepair(installPath) || repaired;
    } catch (err) {
      params.logger.warn?.(
        `Could not repair openclaw peer link for "${pluginId}" at ${installPath}: ${String(err)}`,
      );
    }
  }
  return repaired;
}
async function updateNpmInstalledPlugins(params) {
  const logger = params.logger ?? {};
  const installs = params.config.plugins?.installs ?? {};
  const targets = params.pluginIds?.length ? params.pluginIds : Object.keys(installs);
  const normalizedPluginConfig = params.skipDisabledPlugins
    ? normalizePluginsConfig(params.config.plugins)
    : void 0;
  const bundled = resolveBundledPluginSources({});
  const outcomes = [];
  let next = params.config;
  let changed = false;
  let ranNpmInstaller = false;
  const installNpmSpecForUpdate = async (installParams) => {
    ranNpmInstaller = true;
    return await installPluginFromNpmSpec(installParams);
  };
  const clawHubRiskAcknowledgementOptions = {
    ...(params.acknowledgeClawHubRisk ? { acknowledgeClawHubRisk: true } : {}),
    ...(!params.dryRun && params.onClawHubRisk ? { onClawHubRisk: params.onClawHubRisk } : {}),
  };
  const recordFailure = (pluginId, message, channelFallback) => {
    if (params.disableOnFailure && !params.dryRun) {
      const disabledMessage =
        `Disabled "${pluginId}" after plugin update failure; OpenClaw will continue without it. ` +
        message;
      logger.warn?.(disabledMessage);
      next = disablePluginConfigEntry(next, pluginId);
      changed = true;
      outcomes.push({
        pluginId,
        status: "skipped",
        message: disabledMessage,
        ...(channelFallback ? { channelFallback } : {}),
      });
      return;
    }
    outcomes.push({
      pluginId,
      status: "error",
      message,
      ...(channelFallback ? { channelFallback } : {}),
    });
  };
  for (const pluginId of targets) {
    if (params.skipIds?.has(pluginId)) {
      outcomes.push({
        pluginId,
        status: "skipped",
        message: `Skipping "${pluginId}" (already updated).`,
      });
      continue;
    }
    const record = Object.hasOwn(installs, pluginId) ? installs[pluginId] : void 0;
    if (!record) {
      outcomes.push({
        pluginId,
        status: "skipped",
        message: `No install record for "${pluginId}".`,
      });
      continue;
    }
    const trustedOfficialNpmSpec = resolveTrustedSourceLinkedOfficialNpmSpec({
      pluginId,
      record,
    });
    const officialNpmSpec = params.syncOfficialPluginInstalls ? trustedOfficialNpmSpec : void 0;
    const officialClawHubSpec = params.syncOfficialPluginInstalls
      ? resolveTrustedSourceLinkedOfficialClawHubSpec({
          pluginId,
          record,
        })
      : void 0;
    const officialSyncUpdateChannel = params.officialPluginUpdateChannel ?? params.updateChannel;
    const officialNpmPackageName = resolveNpmSpecPackageName(trustedOfficialNpmSpec);
    if (normalizedPluginConfig) {
      const enableState = resolveEffectiveEnableState({
        id: pluginId,
        origin: "global",
        config: normalizedPluginConfig,
        rootConfig: params.config,
      });
      if (!enableState.enabled && !officialNpmSpec && !officialClawHubSpec) {
        outcomes.push({
          pluginId,
          status: "skipped",
          message: `Skipping "${pluginId}" (${enableState.reason ?? "disabled by plugin config"}).`,
        });
        continue;
      }
    }
    if (!isPluginInstallRecordUpdateSource(record)) {
      outcomes.push({
        pluginId,
        status: "skipped",
        message: `Skipping "${pluginId}" (source: ${record.source}).`,
      });
      continue;
    }
    const npmSpecs =
      record.source === "npm"
        ? resolveNpmUpdateSpecs({
            record,
            specOverride: params.specOverrides?.[pluginId],
            officialSpecOverride: officialNpmSpec,
            updateChannel: officialNpmSpec ? officialSyncUpdateChannel : params.updateChannel,
            officialPackageName: officialNpmPackageName,
            coreVersion: params.coreVersion,
          })
        : void 0;
    const clawhubSpecs =
      record.source === "clawhub"
        ? resolveClawHubUpdateSpecs({
            record,
            officialSpecOverride: officialClawHubSpec,
            updateChannel: officialClawHubSpec ? officialSyncUpdateChannel : params.updateChannel,
          })
        : void 0;
    const effectiveSpec =
      record.source === "npm"
        ? npmSpecs?.installSpec
        : record.source === "clawhub"
          ? clawhubSpecs?.installSpec
          : record.spec;
    const recordSpec =
      record.source === "npm"
        ? npmSpecs?.recordSpec
        : record.source === "clawhub"
          ? clawhubSpecs?.recordSpec
          : record.spec;
    const preserveNpmRecordIntent =
      record.source === "npm" &&
      npmSpecs?.installSpec !== npmSpecs?.recordSpec &&
      (officialNpmSpec ? officialSyncUpdateChannel : params.updateChannel) === "extended-stable";
    const officialNpmFallbackSpecs =
      record.source === "clawhub"
        ? resolveTrustedSourceLinkedOfficialNpmFallbackForClawHubUpdate({
            pluginId,
            record,
            effectiveClawHubSpec: effectiveSpec,
            recordClawHubSpec: recordSpec,
            updateChannel: params.syncOfficialPluginInstalls
              ? officialSyncUpdateChannel
              : params.updateChannel,
            coreVersion: params.coreVersion,
          })
        : null;
    let officialNpmFallbackInstallSpec = officialNpmFallbackSpecs?.installSpec;
    let officialNpmFallbackRecordSpec = officialNpmFallbackSpecs?.recordSpec;
    let activeClawHubInstallSpec = effectiveSpec;
    const trustedSourceLinkedOfficialInstall = isTrustedSourceLinkedOfficialNpmUpdate({
      pluginId,
      spec: effectiveSpec,
      record,
    });
    let expectedIntegrity = expectedIntegrityForNpmUpdate({
      effectiveSpec,
      record,
      trustedSourceLinkedOfficialInstall,
    });
    let fallbackExpectedIntegrityLoaded = false;
    let fallbackExpectedIntegrity;
    const getFallbackExpectedIntegrity = async () => {
      if (!fallbackExpectedIntegrityLoaded) {
        fallbackExpectedIntegrity = await expectedIntegrityForNpmFallback({
          fallbackSpec: npmSpecs?.fallbackSpec,
          record,
          timeoutMs: params.timeoutMs,
          trustedSourceLinkedOfficialInstall,
        });
        fallbackExpectedIntegrityLoaded = true;
      }
      return fallbackExpectedIntegrity;
    };
    if (record.source === "npm" && !effectiveSpec) {
      outcomes.push({
        pluginId,
        status: "skipped",
        message: `Skipping "${pluginId}" (missing npm spec).`,
      });
      continue;
    }
    if (record.source === "git" && !effectiveSpec) {
      outcomes.push({
        pluginId,
        status: "skipped",
        message: `Skipping "${pluginId}" (missing git spec).`,
      });
      continue;
    }
    if (record.source === "clawhub" && !record.clawhubPackage && !officialClawHubSpec) {
      outcomes.push({
        pluginId,
        status: "skipped",
        message: `Skipping "${pluginId}" (missing ClawHub package metadata).`,
      });
      continue;
    }
    if (record.source === "clawhub" || record.source === "marketplace") {
      const bundledSource = bundled.get(pluginId);
      if (
        bundledSource?.version &&
        record.version &&
        isBundledVersionNewer(bundledSource.version, record.version)
      ) {
        logger.warn?.(
          `Skipping "${pluginId}" update: bundled version ${bundledSource.version} is newer than the installed ${record.source} version ${record.version}. Uninstall the ${record.source} plugin to use the bundled version, or pin a newer version explicitly.`,
        );
        outcomes.push({
          pluginId,
          status: "skipped",
          message: `Skipping "${pluginId}": bundled version ${bundledSource.version} is newer than ${record.source} version ${record.version}.`,
        });
        continue;
      }
    }
    if (
      record.source === "marketplace" &&
      (!record.marketplaceSource || !record.marketplacePlugin)
    ) {
      outcomes.push({
        pluginId,
        status: "skipped",
        message: `Skipping "${pluginId}" (missing marketplace source metadata).`,
      });
      continue;
    }
    let installPath;
    try {
      installPath = resolveUserPath(
        record.installPath?.trim() || resolvePluginInstallDir(pluginId),
      );
    } catch (err) {
      recordFailure(pluginId, `Invalid install path for "${pluginId}": ${String(err)}`);
      continue;
    }
    let currentVersion;
    try {
      currentVersion = await readInstalledPackageVersion(installPath);
    } catch (err) {
      recordFailure(
        pluginId,
        `Failed to inspect installed package for ${pluginId}: ${String(err)}`,
      );
      continue;
    }
    const extensionsDir = resolveRecordedExtensionsDir({
      pluginId,
      installPath,
    });
    if (
      !params.dryRun &&
      record.source === "npm" &&
      (currentVersion || (params.syncOfficialPluginInstalls && trustedSourceLinkedOfficialInstall))
    ) {
      const metadataResult = await resolveNpmSpecMetadata({
        spec: effectiveSpec,
        timeoutMs: params.timeoutMs,
      });
      if (metadataResult.ok) {
        const bypassTrustedOfficialUnchangedNpmCheck = shouldBypassTrustedOfficialUnchangedNpmCheck(
          {
            metadata: metadataResult.metadata,
            spec: effectiveSpec,
            trustedSourceLinkedOfficialInstall,
          },
        );
        const trustedPrereleaseFallback = trustedSourceLinkedOfficialInstall
          ? await resolveTrustedOfficialPrereleaseFallbackMetadataForUpdate({
              metadata: metadataResult.metadata,
              spec: effectiveSpec,
              timeoutMs: params.timeoutMs,
            })
          : void 0;
        const expectedIntegrityMetadata =
          trustedPrereleaseFallback?.metadata ?? metadataResult.metadata;
        expectedIntegrity = expectedIntegrityForNpmUpdate({
          effectiveSpec,
          metadata: expectedIntegrityMetadata,
          record,
          trustedSourceLinkedOfficialInstall,
        });
        if (!isNpmMetadataCompatibleWithCurrentHost(expectedIntegrityMetadata))
          expectedIntegrity = void 0;
        if (bypassTrustedOfficialUnchangedNpmCheck && !trustedPrereleaseFallback)
          expectedIntegrity = void 0;
        if (
          currentVersion &&
          !bypassTrustedOfficialUnchangedNpmCheck &&
          isNpmMetadataCompatibleWithCurrentHost(metadataResult.metadata) &&
          !installedPackageNeedsOpenClawPeerLinkRepair(installPath) &&
          shouldSkipUnchangedNpmInstall({
            currentVersion,
            record,
            metadata: metadataResult.metadata,
          })
        ) {
          if (params.syncOfficialPluginInstalls && trustedSourceLinkedOfficialInstall) {
            const nextRecordSpec = resolveNpmInstallRecordSpec({
              requestedSpec: recordSpec,
              resolution: metadataResult.metadata,
              pinResolvedRegistrySpec: !preserveNpmRecordIntent,
            });
            if (nextRecordSpec !== record.spec) {
              const resolutionFields = buildNpmResolutionInstallFields(metadataResult.metadata);
              next = {
                ...next,
                plugins: {
                  ...next.plugins,
                  installs: {
                    ...next.plugins?.installs,
                    [pluginId]: {
                      ...record,
                      spec: nextRecordSpec,
                      resolvedName: resolutionFields.resolvedName ?? record.resolvedName,
                      resolvedVersion: resolutionFields.resolvedVersion ?? record.resolvedVersion,
                      resolvedSpec: resolutionFields.resolvedSpec ?? record.resolvedSpec,
                      integrity: resolutionFields.integrity ?? record.integrity,
                      shasum: resolutionFields.shasum ?? record.shasum,
                      resolvedAt: resolutionFields.resolvedAt ?? record.resolvedAt,
                    },
                  },
                },
              };
              changed = true;
            }
          }
          outcomes.push({
            pluginId,
            status: "unchanged",
            currentVersion,
            nextVersion: metadataResult.metadata.version,
            message: `${pluginId} is up to date (${currentVersion}).`,
          });
          continue;
        }
      } else {
        if (!parseRegistryNpmSpec(effectiveSpec)) {
          recordFailure(pluginId, `Failed to check ${pluginId}: ${metadataResult.error}`);
          continue;
        }
        logger.warn?.(
          `Could not check ${pluginId} before update; falling back to installer path: ${metadataResult.error}`,
        );
      }
    }
    if (params.dryRun) {
      let probe;
      try {
        probe =
          record.source === "npm"
            ? await installPluginFromNpmSpec({
                spec: effectiveSpec,
                config: params.config,
                mode: "update",
                extensionsDir,
                timeoutMs: params.timeoutMs,
                dryRun: true,
                dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
                trustedSourceLinkedOfficialInstall,
                expectedPluginId: pluginId,
                expectedIntegrity,
                onIntegrityDrift: createPluginUpdateIntegrityDriftHandler({
                  pluginId,
                  dryRun: true,
                  logger,
                  onIntegrityDrift: params.onIntegrityDrift,
                }),
                logger,
              })
            : record.source === "clawhub"
              ? await installPluginFromClawHub({
                  spec: effectiveSpec ?? `clawhub:${record.clawhubPackage}`,
                  config: params.config,
                  baseUrl: record.clawhubUrl,
                  mode: "update",
                  extensionsDir,
                  timeoutMs: params.timeoutMs,
                  dryRun: true,
                  dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
                  expectedPluginId: pluginId,
                  ...clawHubRiskAcknowledgementOptions,
                  logger,
                })
              : record.source === "git"
                ? await installPluginFromGitSpec({
                    spec: effectiveSpec,
                    config: params.config,
                    mode: "update",
                    extensionsDir,
                    timeoutMs: params.timeoutMs,
                    dryRun: true,
                    dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
                    expectedPluginId: pluginId,
                    logger,
                  })
                : await installPluginFromMarketplace({
                    marketplace: record.marketplaceSource,
                    plugin: record.marketplacePlugin,
                    config: params.config,
                    mode: "update",
                    extensionsDir,
                    timeoutMs: params.timeoutMs,
                    dryRun: true,
                    dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
                    expectedPluginId: pluginId,
                    logger,
                  });
      } catch (err) {
        recordFailure(pluginId, `Failed to check ${pluginId}: ${String(err)}`);
        continue;
      }
      let usedNpmFallback = false;
      let usedOfficialNpmFallback = false;
      let channelFallbackSuffix = "";
      let npmChannelFallback;
      if (!probe.ok && record.source === "npm" && npmSpecs?.fallbackSpec) {
        logger.warn?.(
          describeBetaNpmFallback({
            pluginId,
            betaSpec: npmSpecs.fallbackLabel ?? effectiveSpec,
            fallbackSpec: npmSpecs.fallbackSpec,
            result: probe,
          }),
        );
        usedNpmFallback = true;
        npmChannelFallback = describeNpmChannelFallback({
          pluginId,
          requestedSpec: npmSpecs.fallbackLabel ?? effectiveSpec,
          usedSpec: npmSpecs.fallbackSpec,
          result: probe,
          verb: "would use",
        });
        channelFallbackSuffix = formatBetaChannelFallbackOutcomeSuffix({
          fallbackLabel: npmSpecs.fallbackLabel ?? effectiveSpec,
          fallbackSpec: npmSpecs.fallbackSpec,
          verb: "would use",
        });
        probe = await installPluginFromNpmSpec({
          spec: npmSpecs.fallbackSpec,
          config: params.config,
          mode: "update",
          extensionsDir,
          timeoutMs: params.timeoutMs,
          dryRun: true,
          dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
          trustedSourceLinkedOfficialInstall,
          expectedPluginId: pluginId,
          expectedIntegrity: await getFallbackExpectedIntegrity(),
          onIntegrityDrift: createPluginUpdateIntegrityDriftHandler({
            pluginId,
            dryRun: true,
            logger,
            onIntegrityDrift: params.onIntegrityDrift,
          }),
          logger,
        });
      }
      if (
        !probe.ok &&
        record.source === "clawhub" &&
        clawhubSpecs?.fallbackSpec &&
        shouldFallbackBetaClawHubUpdate(probe)
      ) {
        channelFallbackSuffix = formatBetaChannelFallbackOutcomeSuffix({
          fallbackLabel: clawhubSpecs.fallbackLabel ?? effectiveSpec,
          fallbackSpec: clawhubSpecs.fallbackSpec,
          verb: "would use",
        });
        logger.warn?.(
          `Plugin "${pluginId}" has no beta ClawHub release for ${clawhubSpecs.fallbackLabel ?? effectiveSpec}; using ${clawhubSpecs.fallbackSpec} instead. Core update can still complete.`,
        );
        probe = await installPluginFromClawHub({
          spec: clawhubSpecs.fallbackSpec,
          config: params.config,
          baseUrl: record.clawhubUrl,
          mode: "update",
          extensionsDir,
          timeoutMs: params.timeoutMs,
          dryRun: true,
          dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
          expectedPluginId: pluginId,
          ...clawHubRiskAcknowledgementOptions,
          logger,
        });
        activeClawHubInstallSpec = clawhubSpecs.fallbackSpec;
        if (officialNpmFallbackSpecs?.fallbackSpec)
          officialNpmFallbackInstallSpec = officialNpmFallbackSpecs.fallbackSpec;
      }
      if (
        !probe.ok &&
        record.source === "clawhub" &&
        officialNpmFallbackInstallSpec &&
        shouldFallbackClawHubBridgeToNpm({
          result: probe,
          npmSpec: officialNpmFallbackInstallSpec,
        })
      ) {
        channelFallbackSuffix = ` (warning: official ClawHub artifact fallback would use ${officialNpmFallbackInstallSpec}).`;
        logger.warn?.(
          `Plugin "${pluginId}" could not download official ClawHub artifact for ${activeClawHubInstallSpec ?? `clawhub:${record.clawhubPackage}`}; using npm ${officialNpmFallbackInstallSpec} instead. Core update can still complete.`,
        );
        usedNpmFallback = true;
        usedOfficialNpmFallback = true;
        probe = await installPluginFromNpmSpec({
          spec: officialNpmFallbackInstallSpec,
          config: params.config,
          mode: "update",
          extensionsDir,
          timeoutMs: params.timeoutMs,
          dryRun: true,
          dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
          trustedSourceLinkedOfficialInstall: true,
          expectedPluginId: pluginId,
          logger,
        });
      }
      if (!probe.ok) {
        if (
          record.source === "clawhub" &&
          shouldSkipClawHubTrustFailureForExistingInstall({
            result: probe,
            currentVersion,
          })
        ) {
          const code = readClawHubTrustErrorCode(probe);
          if (!code) continue;
          outcomes.push(
            buildClawHubTrustSkippedOutcome({
              pluginId,
              phase: "check",
              error: probe.error,
              code,
              ...("warning" in probe && probe.warning ? { warning: probe.warning } : {}),
              ...(currentVersion ? { currentVersion } : {}),
            }),
          );
          continue;
        }
        recordFailure(
          pluginId,
          record.source === "npm" || usedOfficialNpmFallback
            ? formatNpmInstallFailure({
                pluginId,
                spec: usedOfficialNpmFallback
                  ? (officialNpmFallbackInstallSpec ?? effectiveSpec ?? "")
                  : npmUpdateFailureSpec({
                      effectiveSpec,
                      fallbackSpec: npmSpecs?.fallbackSpec,
                      usedFallback: usedNpmFallback,
                    }),
                phase: "check",
                result: probe,
              })
            : record.source === "clawhub"
              ? formatClawHubInstallFailure({
                  pluginId,
                  spec: activeClawHubInstallSpec ?? `clawhub:${record.clawhubPackage}`,
                  phase: "check",
                  error: probe.error,
                })
              : record.source === "git"
                ? formatGitInstallFailure({
                    pluginId,
                    spec: effectiveSpec,
                    phase: "check",
                    error: probe.error,
                  })
                : formatMarketplaceInstallFailure({
                    pluginId,
                    marketplaceSource: record.marketplaceSource,
                    marketplacePlugin: record.marketplacePlugin,
                    phase: "check",
                    error: probe.error,
                  }),
          npmChannelFallback,
        );
        continue;
      }
      const probeSpec = usedNpmFallback
        ? (npmSpecs?.fallbackSpec ?? officialNpmFallbackInstallSpec)
        : effectiveSpec;
      const npmProbeVersion =
        record.source === "npm" || usedOfficialNpmFallback
          ? resolveNpmResultVersion(probe)
          : void 0;
      const resolvedProbeVersion =
        probe.version ??
        npmProbeVersion ??
        (record.source === "npm" || usedOfficialNpmFallback
          ? resolveExactNpmSpecVersion(probeSpec)
          : void 0);
      const nextVersion = resolvedProbeVersion ?? "unknown";
      const currentLabel = currentVersion ?? "unknown";
      const gitProbe = record.source === "git" ? probe.git : void 0;
      const unchanged =
        record.source === "git" && record.gitCommit && gitProbe?.commit
          ? record.gitCommit === gitProbe.commit
          : Boolean(
              currentVersion && resolvedProbeVersion && currentVersion === resolvedProbeVersion,
            );
      const newerExactPinnedDefaultLine =
        unchanged &&
        record.source === "npm" &&
        !params.specOverrides?.[pluginId] &&
        !officialNpmSpec
          ? await resolveNewerExactPinnedNpmDefaultLine({
              currentVersion,
              effectiveSpec,
              probeNpmVersion: npmProbeVersion,
              timeoutMs: params.timeoutMs,
            })
          : void 0;
      if (unchanged) {
        const message =
          newerExactPinnedDefaultLine && effectiveSpec
            ? `${pluginId} is pinned to ${effectiveSpec} (installed ${currentLabel}); registry default resolves to ${newerExactPinnedDefaultLine.version}. Pass \`openclaw plugins update ${newerExactPinnedDefaultLine.packageName}@latest\` to follow the registry default line.` +
              channelFallbackSuffix
            : `${pluginId} is up to date (${currentLabel}).${channelFallbackSuffix}`;
        outcomes.push({
          pluginId,
          status: "unchanged",
          currentVersion: currentVersion ?? void 0,
          nextVersion: resolvedProbeVersion,
          message,
          ...(npmChannelFallback ? { channelFallback: npmChannelFallback } : {}),
        });
      } else
        outcomes.push({
          pluginId,
          status: "updated",
          currentVersion: currentVersion ?? void 0,
          nextVersion: resolvedProbeVersion,
          message: `Would update ${pluginId}: ${currentLabel} -> ${nextVersion}.${channelFallbackSuffix}`,
          ...(npmChannelFallback ? { channelFallback: npmChannelFallback } : {}),
        });
      continue;
    }
    let result;
    try {
      result =
        record.source === "npm"
          ? await installNpmSpecForUpdate({
              spec: effectiveSpec,
              config: params.config,
              mode: "update",
              extensionsDir,
              timeoutMs: params.timeoutMs,
              dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
              trustedSourceLinkedOfficialInstall,
              expectedPluginId: pluginId,
              expectedIntegrity,
              onIntegrityDrift: createPluginUpdateIntegrityDriftHandler({
                pluginId,
                dryRun: false,
                logger,
                onIntegrityDrift: params.onIntegrityDrift,
              }),
              logger,
            })
          : record.source === "clawhub"
            ? await installPluginFromClawHub({
                spec: effectiveSpec ?? `clawhub:${record.clawhubPackage}`,
                config: params.config,
                baseUrl: record.clawhubUrl,
                mode: "update",
                extensionsDir,
                timeoutMs: params.timeoutMs,
                dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
                expectedPluginId: pluginId,
                ...clawHubRiskAcknowledgementOptions,
                logger,
              })
            : record.source === "git"
              ? await installPluginFromGitSpec({
                  spec: effectiveSpec,
                  config: params.config,
                  mode: "update",
                  extensionsDir,
                  timeoutMs: params.timeoutMs,
                  dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
                  expectedPluginId: pluginId,
                  logger,
                })
              : await installPluginFromMarketplace({
                  marketplace: record.marketplaceSource,
                  plugin: record.marketplacePlugin,
                  config: params.config,
                  mode: "update",
                  extensionsDir,
                  timeoutMs: params.timeoutMs,
                  dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
                  expectedPluginId: pluginId,
                  logger,
                });
    } catch (err) {
      recordFailure(pluginId, `Failed to update ${pluginId}: ${String(err)}`);
      continue;
    }
    let usedNpmFallback = false;
    let usedOfficialNpmFallback = false;
    let channelFallbackSuffix = "";
    let resultSource = record.source;
    activeClawHubInstallSpec = effectiveSpec;
    let npmChannelFallback;
    if (!result.ok && record.source === "npm" && npmSpecs?.fallbackSpec) {
      logger.warn?.(
        describeBetaNpmFallback({
          pluginId,
          betaSpec: npmSpecs.fallbackLabel ?? effectiveSpec,
          fallbackSpec: npmSpecs.fallbackSpec,
          result,
        }),
      );
      usedNpmFallback = true;
      npmChannelFallback = describeNpmChannelFallback({
        pluginId,
        requestedSpec: npmSpecs.fallbackLabel ?? effectiveSpec,
        usedSpec: npmSpecs.fallbackSpec,
        result,
        verb: "used",
      });
      channelFallbackSuffix = formatBetaChannelFallbackOutcomeSuffix({
        fallbackLabel: npmSpecs.fallbackLabel ?? effectiveSpec,
        fallbackSpec: npmSpecs.fallbackSpec,
        verb: "used",
      });
      result = await installNpmSpecForUpdate({
        spec: npmSpecs.fallbackSpec,
        mode: "update",
        extensionsDir,
        timeoutMs: params.timeoutMs,
        dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
        trustedSourceLinkedOfficialInstall,
        expectedPluginId: pluginId,
        expectedIntegrity: await getFallbackExpectedIntegrity(),
        onIntegrityDrift: createPluginUpdateIntegrityDriftHandler({
          pluginId,
          dryRun: false,
          logger,
          onIntegrityDrift: params.onIntegrityDrift,
        }),
        logger,
      });
    }
    if (
      !result.ok &&
      record.source === "clawhub" &&
      clawhubSpecs?.fallbackSpec &&
      shouldFallbackBetaClawHubUpdate(result)
    ) {
      channelFallbackSuffix = formatBetaChannelFallbackOutcomeSuffix({
        fallbackLabel: clawhubSpecs.fallbackLabel ?? effectiveSpec,
        fallbackSpec: clawhubSpecs.fallbackSpec,
        verb: "used",
      });
      logger.warn?.(
        `Plugin "${pluginId}" has no beta ClawHub release for ${clawhubSpecs.fallbackLabel ?? effectiveSpec}; using ${clawhubSpecs.fallbackSpec} instead. Core update can still complete.`,
      );
      result = await installPluginFromClawHub({
        spec: clawhubSpecs.fallbackSpec,
        config: params.config,
        baseUrl: record.clawhubUrl,
        mode: "update",
        extensionsDir,
        timeoutMs: params.timeoutMs,
        dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
        expectedPluginId: pluginId,
        ...clawHubRiskAcknowledgementOptions,
        logger,
      });
      activeClawHubInstallSpec = clawhubSpecs.fallbackSpec;
      if (officialNpmFallbackSpecs?.fallbackSpec) {
        officialNpmFallbackInstallSpec = officialNpmFallbackSpecs.fallbackSpec;
        officialNpmFallbackRecordSpec = officialNpmFallbackSpecs.fallbackSpec;
      }
    }
    if (
      !result.ok &&
      record.source === "clawhub" &&
      officialNpmFallbackInstallSpec &&
      shouldFallbackClawHubBridgeToNpm({
        result,
        npmSpec: officialNpmFallbackInstallSpec,
      })
    ) {
      logger.warn?.(
        `Plugin "${pluginId}" could not download official ClawHub artifact for ${activeClawHubInstallSpec ?? `clawhub:${record.clawhubPackage}`}; using npm ${officialNpmFallbackInstallSpec} instead. Core update can still complete.`,
      );
      usedNpmFallback = true;
      usedOfficialNpmFallback = true;
      resultSource = "npm";
      channelFallbackSuffix = ` (warning: official ClawHub artifact fallback used ${officialNpmFallbackInstallSpec}).`;
      result = await installNpmSpecForUpdate({
        spec: officialNpmFallbackInstallSpec,
        config: params.config,
        mode: "update",
        extensionsDir,
        timeoutMs: params.timeoutMs,
        dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
        trustedSourceLinkedOfficialInstall: true,
        expectedPluginId: pluginId,
        logger,
      });
    }
    if (!result.ok) {
      if (
        record.source === "clawhub" &&
        shouldSkipClawHubTrustFailureForExistingInstall({
          result,
          currentVersion,
        })
      ) {
        const code = readClawHubTrustErrorCode(result);
        if (!code) continue;
        outcomes.push(
          buildClawHubTrustSkippedOutcome({
            pluginId,
            phase: "update",
            error: result.error,
            code,
            ...("warning" in result && result.warning ? { warning: result.warning } : {}),
            ...(currentVersion ? { currentVersion } : {}),
          }),
        );
        continue;
      }
      recordFailure(
        pluginId,
        resultSource === "npm"
          ? formatNpmInstallFailure({
              pluginId,
              spec: usedOfficialNpmFallback
                ? (officialNpmFallbackInstallSpec ?? effectiveSpec ?? "")
                : npmUpdateFailureSpec({
                    effectiveSpec,
                    fallbackSpec: npmSpecs?.fallbackSpec,
                    usedFallback: usedNpmFallback,
                  }),
              phase: "update",
              result,
            })
          : resultSource === "clawhub"
            ? formatClawHubInstallFailure({
                pluginId,
                spec: activeClawHubInstallSpec ?? `clawhub:${record.clawhubPackage}`,
                phase: "update",
                error: result.error,
              })
            : record.source === "git"
              ? formatGitInstallFailure({
                  pluginId,
                  spec: effectiveSpec,
                  phase: "update",
                  error: result.error,
                })
              : formatMarketplaceInstallFailure({
                  pluginId,
                  marketplaceSource: record.marketplaceSource,
                  marketplacePlugin: record.marketplacePlugin,
                  phase: "update",
                  error: result.error,
                }),
        npmChannelFallback,
      );
      continue;
    }
    const resolvedPluginId = result.pluginId;
    if (resolvedPluginId !== pluginId)
      next = migratePluginConfigId(next, pluginId, resolvedPluginId);
    const nextVersion = result.version ?? (await readInstalledPackageVersion(result.targetDir));
    if (resultSource === "npm") {
      const npmResult = result;
      next = recordPluginInstall(
        usedOfficialNpmFallback ? withoutPluginInstallRecord(next, resolvedPluginId) : next,
        {
          pluginId: resolvedPluginId,
          source: "npm",
          spec: resolveNpmInstallRecordSpec({
            requestedSpec: usedOfficialNpmFallback ? officialNpmFallbackRecordSpec : recordSpec,
            resolution: npmResult.npmResolution,
            pinResolvedRegistrySpec:
              (params.syncOfficialPluginInstalls &&
                trustedSourceLinkedOfficialInstall &&
                !preserveNpmRecordIntent) ||
              (usedOfficialNpmFallback && officialSyncUpdateChannel !== "extended-stable"),
          }),
          installPath: result.targetDir,
          version: nextVersion,
          ...buildNpmResolutionInstallFields(npmResult.npmResolution),
        },
      );
    } else if (resultSource === "clawhub")
      next = recordPluginInstall(next, {
        pluginId: resolvedPluginId,
        ...buildClawHubPluginInstallRecordFields(result.clawhub),
        spec: recordSpec ?? record.spec ?? `clawhub:${record.clawhubPackage}`,
        installPath: result.targetDir,
        version: nextVersion,
      });
    else if (record.source === "git") {
      const gitResult = result;
      next = recordPluginInstall(next, {
        pluginId: resolvedPluginId,
        source: "git",
        spec: effectiveSpec ?? record.spec,
        installPath: result.targetDir,
        version: nextVersion,
        resolvedAt: gitResult.git.resolvedAt,
        gitUrl: gitResult.git.url,
        gitRef: gitResult.git.ref,
        gitCommit: gitResult.git.commit,
      });
    } else {
      const marketplaceResult = result;
      next = recordPluginInstall(next, {
        pluginId: resolvedPluginId,
        source: "marketplace",
        installPath: result.targetDir,
        version: nextVersion,
        marketplaceName: marketplaceResult.marketplaceName ?? record.marketplaceName,
        marketplaceSource: record.marketplaceSource,
        marketplacePlugin: record.marketplacePlugin,
      });
    }
    changed = true;
    const currentLabel = currentVersion ?? "unknown";
    const nextLabel = nextVersion ?? "unknown";
    if (currentVersion && nextVersion && currentVersion === nextVersion)
      outcomes.push({
        pluginId,
        status: "unchanged",
        currentVersion: currentVersion ?? void 0,
        nextVersion: nextVersion ?? void 0,
        message: `${pluginId} already at ${currentLabel}.${channelFallbackSuffix}`,
        ...(npmChannelFallback ? { channelFallback: npmChannelFallback } : {}),
      });
    else
      outcomes.push({
        pluginId,
        status: "updated",
        currentVersion: currentVersion ?? void 0,
        nextVersion: nextVersion ?? void 0,
        message: `Updated ${pluginId}: ${currentLabel} -> ${nextLabel}.${channelFallbackSuffix}`,
        ...(npmChannelFallback ? { channelFallback: npmChannelFallback } : {}),
      });
  }
  if (ranNpmInstaller)
    changed =
      (await repairOpenClawPeerLinksForNpmInstalls({
        config: next,
        logger,
      })) || changed;
  return {
    config: next,
    changed,
    outcomes,
  };
}
async function syncPluginsForUpdateChannel(params) {
  const env = params.env ?? process.env;
  const logger = params.logger ?? {};
  const summary = {
    switchedToBundled: [],
    switchedToClawHub: [],
    switchedToNpm: [],
    warnings: [],
    errors: [],
  };
  const bundled = resolveBundledPluginSources({
    workspaceDir: params.workspaceDir,
    env,
  });
  let next = params.config;
  const loadHelpers = buildLoadPathHelpers(next.plugins?.load?.paths ?? [], env);
  let installs = next.plugins?.installs ?? {};
  let changed = false;
  const clawHubRiskAcknowledgementOptions = {
    ...(params.acknowledgeClawHubRisk ? { acknowledgeClawHubRisk: true } : {}),
    ...(params.onClawHubRisk ? { onClawHubRisk: params.onClawHubRisk } : {}),
  };
  if (params.channel === "dev")
    for (const [pluginId, record] of Object.entries(installs)) {
      const bundledInfo = bundled.get(pluginId);
      if (!bundledInfo) continue;
      loadHelpers.addPath(bundledInfo.localPath);
      if (record.source === "path" && pathsEqual(record.sourcePath, bundledInfo.localPath, env))
        continue;
      next = recordPluginInstall(next, {
        pluginId,
        source: "path",
        sourcePath: bundledInfo.localPath,
        installPath: bundledInfo.localPath,
        spec: record.spec ?? bundledInfo.npmSpec,
        version: record.version,
      });
      summary.switchedToBundled.push(pluginId);
      changed = true;
    }
  else {
    const bridges = params.externalizedBundledPluginBridges ?? [];
    for (const bridge of bridges) {
      const targetPluginId = getExternalizedBundledPluginTargetId(bridge);
      if (bundled.get(bridge.bundledPluginId)) continue;
      const existing = resolveBridgeInstallRecord({
        installs,
        bridge,
      });
      if (
        !existing &&
        !isExternalizedBundledPluginEnabled({
          config: next,
          bridge,
        })
      )
        continue;
      if (
        existing &&
        !isExternalizedBundledPluginEnabled({
          config: next,
          bridge,
        })
      )
        continue;
      if (
        existing &&
        isBridgeAlreadyInstalledFromPreferredSource({
          bridge,
          record: existing.record,
        })
      ) {
        if (existing.pluginId !== targetPluginId) {
          next = migratePluginConfigId(next, existing.pluginId, targetPluginId);
          installs = next.plugins?.installs ?? {};
          changed = true;
        }
        removeBridgeBundledLoadPaths({
          bridge,
          loadPaths: loadHelpers,
          env,
        });
        continue;
      }
      if (
        existing &&
        !isBridgeBundledPathRecord({
          bridge,
          record: existing.record,
          env,
        }) &&
        !isBridgeInstalledFromFallbackSource({
          bridge,
          record: existing.record,
        })
      )
        continue;
      const preferredSource = getExternalizedBundledPluginPreferredSource(bridge);
      const npmSpec = getExternalizedBundledPluginNpmSpec(bridge);
      const clawhubSpec = getExternalizedBundledPluginClawHubSpec(bridge);
      const trustedSourceLinkedOfficialInstall = isTrustedSourceLinkedOfficialBridgeNpmInstall({
        targetPluginId,
        npmSpec,
      });
      const channelNpmSpecs =
        npmSpec && trustedSourceLinkedOfficialInstall
          ? resolveNpmInstallSpecsForUpdateChannel({
              spec: npmSpec,
              updateChannel: params.channel,
              officialPackageName: resolveNpmSpecPackageName(npmSpec),
              coreVersion: params.coreVersion,
            })
          : null;
      const effectiveNpmSpec = channelNpmSpecs?.installSpec ?? npmSpec;
      let installSource = preferredSource;
      let installSpec = preferredSource === "clawhub" ? clawhubSpec : effectiveNpmSpec;
      let result;
      if (!installSpec) {
        const message = `Failed to update ${targetPluginId}: missing ${preferredSource} install spec for externalized bundled plugin.`;
        summary.errors.push(message);
        logger.error?.(message);
        continue;
      }
      if (preferredSource === "clawhub") {
        result = await installPluginFromClawHub({
          spec: clawhubSpec,
          config: params.config,
          ...(bridge.clawhubUrl ? { baseUrl: bridge.clawhubUrl } : {}),
          mode: "update",
          expectedPluginId: targetPluginId,
          ...clawHubRiskAcknowledgementOptions,
          logger,
        });
        if (
          !result.ok &&
          npmSpec &&
          shouldFallbackClawHubBridgeToNpm({
            result,
            npmSpec,
          })
        ) {
          const warning = `ClawHub ${clawhubSpec} unavailable for ${targetPluginId}; falling back to npm ${effectiveNpmSpec}.`;
          summary.warnings.push(warning);
          logger.warn?.(warning);
          installSource = "npm";
          installSpec = effectiveNpmSpec;
          result = await installPluginFromNpmSpec({
            spec: effectiveNpmSpec,
            config: params.config,
            mode: "update",
            expectedPluginId: targetPluginId,
            trustedSourceLinkedOfficialInstall,
            logger,
          });
        }
      } else
        result = await installPluginFromNpmSpec({
          spec: effectiveNpmSpec,
          config: params.config,
          mode: "update",
          expectedPluginId: targetPluginId,
          trustedSourceLinkedOfficialInstall,
          logger,
        });
      if (!result.ok) {
        const clawHubTrustWarning =
          installSource === "clawhub" &&
          "warning" in result &&
          typeof result.warning === "string" &&
          result.warning.trim().length > 0
            ? result.warning
            : null;
        if (clawHubTrustWarning) summary.warnings.push(clawHubTrustWarning);
        const message =
          installSource === "clawhub"
            ? formatClawHubInstallFailure({
                pluginId: targetPluginId,
                spec: installSpec,
                phase: "update",
                error: result.error,
              })
            : formatNpmInstallFailure({
                pluginId: targetPluginId,
                spec: installSpec,
                phase: "update",
                result,
              });
        summary.errors.push(message);
        logger.error?.(message);
        continue;
      }
      const resolvedPluginId = result.pluginId;
      if (existing && existing.pluginId !== resolvedPluginId)
        next = migratePluginConfigId(next, existing.pluginId, resolvedPluginId);
      const nextVersion = result.version ?? (await readInstalledPackageVersion(result.targetDir));
      if (installSource === "clawhub")
        next = recordPluginInstall(next, {
          pluginId: resolvedPluginId,
          ...buildClawHubPluginInstallRecordFields(result.clawhub),
          spec: installSpec,
          installPath: result.targetDir,
          version: nextVersion,
        });
      else {
        const npmResult = result;
        next = recordPluginInstall(next, {
          pluginId: resolvedPluginId,
          source: "npm",
          spec: resolveNpmInstallRecordSpec({
            requestedSpec:
              params.channel === "extended-stable" && installSource === "npm"
                ? (channelNpmSpecs?.recordSpec ?? installSpec)
                : installSpec,
            resolution: npmResult.npmResolution,
            pinResolvedRegistrySpec:
              trustedSourceLinkedOfficialInstall && params.channel !== "extended-stable",
          }),
          installPath: result.targetDir,
          version: nextVersion,
          ...buildNpmResolutionInstallFields(npmResult.npmResolution),
        });
      }
      installs = next.plugins?.installs ?? {};
      if (existing?.record.sourcePath) loadHelpers.removePath(existing.record.sourcePath);
      if (existing?.record.installPath) loadHelpers.removePath(existing.record.installPath);
      removeBridgeBundledLoadPaths({
        bridge,
        loadPaths: loadHelpers,
        env,
      });
      if (installSource === "clawhub") summary.switchedToClawHub.push(resolvedPluginId);
      else summary.switchedToNpm.push(resolvedPluginId);
      changed = true;
    }
    for (const [pluginId, record] of Object.entries(installs)) {
      const bundledInfo = bundled.get(pluginId);
      if (!bundledInfo) continue;
      if (record.source === "npm") {
        loadHelpers.removePath(bundledInfo.localPath);
        continue;
      }
      if (record.source !== "path") continue;
      if (!pathsEqual(record.sourcePath, bundledInfo.localPath, env)) continue;
      loadHelpers.addPath(bundledInfo.localPath);
      if (
        record.source === "path" &&
        pathsEqual(record.sourcePath, bundledInfo.localPath, env) &&
        pathsEqual(record.installPath, bundledInfo.localPath, env)
      )
        continue;
      next = recordPluginInstall(next, {
        pluginId,
        source: "path",
        sourcePath: bundledInfo.localPath,
        installPath: bundledInfo.localPath,
        spec: record.spec ?? bundledInfo.npmSpec,
        version: record.version,
      });
      changed = true;
    }
  }
  if (loadHelpers.changed) {
    next = {
      ...next,
      plugins: {
        ...next.plugins,
        load: {
          ...next.plugins?.load,
          paths: loadHelpers.paths,
        },
      },
    };
    changed = true;
  }
  return {
    config: next,
    changed,
    summary,
  };
}
//#endregion
export {
  updateNpmInstalledPlugins as a,
  syncPluginsForUpdateChannel as i,
  isPluginInstallRecordUpdateSource as n,
  pluginInstallRecordMayMigrateConfigId as r,
  isClawHubTrustSkippedOutcome as t,
};
