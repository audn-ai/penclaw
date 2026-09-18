import { existsSync } from "node:fs";
import { readFile, rm } from "node:fs/promises";
import path from "node:path";
import { r as stripAnsi } from "./ansi-D4OHEz5F.js";
import "./utils-DtcDeqWS.js";
import { r as listRawChannelPluginCatalogEntries } from "./catalog-wn_skeE9.js";
import { s as resolveConfiguredChannelPresencePolicy } from "./channel-presence-policy-5sGDOKpp.js";
import { t as installPluginFromClawHub } from "./clawhub-BhV81Pwz.js";
import { t as CLAWHUB_INSTALL_ERROR_CODE } from "./clawhub-error-codes-OgrR1N6P.js";
import { t as buildClawHubPluginInstallRecordFields } from "./clawhub-install-records-Dy2deHKG.js";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-CzLwxQg_.js";
import {
  n as listExplicitlyDisabledChannelIdsForConfig,
  r as listPotentialConfiguredChannelIds,
} from "./config-presence-dDm96tuW.js";
import {
  n as collectConfiguredModelProviderSelectionIds,
  r as collectConfiguredProviderSelectionIds,
  t as collectConfiguredMediaProviderSelectionIds,
} from "./configured-provider-selection-ids-ZpDbWKnj.js";
import {
  n as collectConfiguredRuntimePluginIds,
  t as CONFIGURED_RUNTIME_PLUGIN_INSTALL_CANDIDATES,
} from "./configured-runtime-plugin-installs-CEY-UO20.js";
import { s as readLegacyNpmPluginDeclaration } from "./discovery-Df2IhoW5.js";
import { t as collectConfiguredMemoryEmbeddingProviderIds } from "./gateway-startup-plugin-ids-C7oHc3ol.js";
import { t as collectConfiguredSpeechProviderIds } from "./gateway-startup-speech-providers-DRg9FZJd.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import {
  n as resolveNpmInstallSpecsForUpdateChannel,
  t as resolveClawHubInstallSpecsForUpdateChannel,
} from "./install-channel-specs-CA1vcdo6.js";
import { a as installPluginFromNpmSpec } from "./install-CjCRVnj8.js";
import "./channel-plugin-ids-B1yGqL5H.js";
import {
  a as resolveDefaultPluginNpmDir,
  l as resolvePluginNpmPackageDir,
  o as resolvePluginInstallDir,
  r as resolveDefaultPluginExtensionsDir,
} from "./install-paths-CqMnrXsY.js";
import { r as loadInstalledPluginIndex } from "./installed-plugin-index-lBfkb-7L.js";
import { t as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-D7CXgzhH.js";
import {
  d as resolveNpmInstallRecordSpec,
  l as buildNpmResolutionInstallFields,
  s as writePersistedInstalledPluginIndexInstallRecords,
} from "./installed-plugin-index-records-BP7rp3ti.js";
import { s as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-3WxfNDRv.js";
import {
  i as isOpenClawOrgNpmSpec,
  s as parseRegistryNpmSpec,
  t as compareOpenClawReleaseVersions,
} from "./npm-registry-spec-CqBTTiC9.js";
import { t as asObjectRecord } from "./object-BsiS9JXh.js";
import {
  d as resolveOfficialExternalPluginInstall,
  f as resolveOfficialExternalPluginLabel,
  g as resolveOfficialExternalWebProviderContractPluginIdsForEnv,
  h as resolveOfficialExternalProviderPluginIdsForEnv,
  m as resolveOfficialExternalProviderPluginIds,
  p as resolveOfficialExternalProviderContractPluginIds,
  s as listOfficialExternalPluginCatalogEntries,
  u as resolveOfficialExternalPluginId,
} from "./official-external-plugin-catalog-B2V9K3em.js";
import { n as resolveProviderInstallCatalogEntries } from "./provider-install-catalog-BrWdgyBm.js";
import { t as sanitizeTerminalText } from "./safe-text-DiGQuw-e.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import {
  d as resolveRegistryUpdateChannel,
  l as normalizeUpdateChannel,
} from "./update-channels-CQNa2YMG.js";
import {
  a as updateNpmInstalledPlugins,
  t as isClawHubTrustSkippedOutcome,
} from "./update-Dap2BNUK.js";
import {
  c as isLegacyPackageUpdateDoctorPass,
  f as shouldDeferConfiguredPluginInstallRepair,
  u as isPostCoreConvergencePass,
} from "./update-phase-RYqcMEby.js";
import { n as VERSION, o as resolveCompatibilityHostVersion } from "./version-CeFj_iGk.js";
import {
  n as resolveWebSearchInstallCatalogEntriesForEnv,
  r as resolveWebSearchInstallCatalogEntry,
} from "./web-search-install-catalog-BFwolsTM.js";
//#region src/commands/doctor/shared/configured-provider-plugin-ids.ts
/** Lists official external provider plugins without loading installed plugin registries. */
function collectConfiguredOfficialProviderPluginIds(params) {
  const configuredProviderIds = collectConfiguredModelProviderSelectionIds(params.cfg);
  const configuredMediaProviderIds = collectConfiguredMediaProviderSelectionIds(params.cfg);
  const pluginIds = new Set(
    resolveOfficialExternalProviderPluginIds({ providerIds: configuredProviderIds }),
  );
  for (const pluginId of resolveOfficialExternalProviderPluginIdsForEnv(params.env ?? process.env))
    pluginIds.add(pluginId);
  for (const pluginId of resolveOfficialExternalProviderContractPluginIds({
    contract: "mediaUnderstandingProviders",
    providerIds: configuredMediaProviderIds,
  }))
    pluginIds.add(pluginId);
  for (const pluginId of resolveOfficialExternalProviderContractPluginIds({
    contract: "speechProviders",
    providerIds: configuredProviderIds,
  }))
    pluginIds.add(pluginId);
  return [...pluginIds].toSorted((left, right) => left.localeCompare(right));
}
//#endregion
//#region src/commands/doctor/shared/configured-provider-plugin-installs.ts
/** Lists external provider plugins implied by configured auth profiles and model refs. */
function collectConfiguredProviderPluginIds(params) {
  const selectedProviderIds = collectConfiguredProviderSelectionIds(params.cfg);
  const pluginIds = new Set(collectConfiguredOfficialProviderPluginIds(params));
  for (const entry of resolveProviderInstallCatalogEntries({
    config: params.cfg,
    env: params.env,
    includeUntrustedWorkspacePlugins: false,
  }))
    if (
      [entry.providerId, ...(entry.providerAliases ?? [])].some((providerId) =>
        selectedProviderIds.has(providerId.toLowerCase()),
      )
    )
      pluginIds.add(entry.pluginId);
  return [...pluginIds].toSorted((left, right) => left.localeCompare(right));
}
//#endregion
//#region src/commands/doctor/shared/missing-configured-plugin-install.ts
const CONFIGURED_PLUGIN_INSTALLS_CHECK_ID = "core/doctor/configured-plugin-installs";
const MISSING_CHANNEL_CONFIG_DESCRIPTOR_DIAGNOSTIC = "without channelConfigs metadata";
const REPAIRABLE_PACKAGE_ENTRY_DIAGNOSTIC_MARKERS = [
  "extension entry escapes package directory",
  "extension entry unreadable",
  "requires compiled runtime output",
];
const VERSION_BOUND_RUNTIME_PLUGIN_IDS = /* @__PURE__ */ new Set(["codex"]);
const OPENCLAW_BETA_COMPANION_VERSION_RE = /^(\d{4}\.[1-9]\d?\.[1-9]\d?)-beta\.[1-9]\d*$/;
const OPENCLAW_STABLE_OR_BETA_COMPANION_VERSION_RE =
  /^(\d{4}\.[1-9]\d?\.[1-9]\d?)(?:-beta\.[1-9]\d*)?$/;
function shouldFallbackClawHubToNpm(params) {
  if (!isOpenClawOrgNpmSpec(params.npmSpec)) return false;
  return (
    params.result.code === CLAWHUB_INSTALL_ERROR_CODE.PACKAGE_NOT_FOUND ||
    params.result.code === CLAWHUB_INSTALL_ERROR_CODE.VERSION_NOT_FOUND ||
    params.result.code === CLAWHUB_INSTALL_ERROR_CODE.ARTIFACT_DOWNLOAD_UNAVAILABLE ||
    params.result.code === CLAWHUB_INSTALL_ERROR_CODE.ARTIFACT_UNAVAILABLE
  );
}
function appendClawHubRiskAcknowledgementGuidance(params) {
  if (!params.spec || !params.message.includes("--acknowledge-clawhub-risk")) return params.message;
  const shellSpec = shellQuotePosixArg(sanitizeTerminalText(params.spec));
  return `${params.message} To review and acknowledge this ClawHub package, run \`openclaw plugins install ${shellSpec} --acknowledge-clawhub-risk\` from a trusted shell, then rerun repair.`;
}
function shellQuotePosixArg(value) {
  if (/^[A-Za-z0-9_./:@%+=,-]+$/u.test(value)) return value;
  return `'${value.replaceAll("'", "'\\''")}'`;
}
function isActionableClawHubSkippedOutcome(outcome) {
  return isClawHubTrustSkippedOutcome(outcome);
}
function isClawHubReviewNotice(message) {
  const trimmed = stripAnsi(message).trimStart();
  return (
    trimmed.startsWith("╭─ REVIEW RECOMMENDED - ClawHub ") ||
    trimmed.startsWith("╭─ WARNING - ClawHub found security risks ")
  );
}
function recordClawHubInstallSpec(record) {
  if (!record || record.source !== "clawhub") return;
  if (record.spec) return record.spec;
  if (record.clawhubPackage) return `clawhub:${record.clawhubPackage}`;
}
function resolveCandidateClawHubSpec(install) {
  const explicit = install.clawhubSpec?.trim();
  if (explicit) return explicit;
}
function addConfiguredPluginId(ids, value) {
  if (typeof value !== "string") return;
  const pluginId = value.trim();
  if (pluginId) ids.add(pluginId);
}
function addConfiguredAgentRuntimePluginIds(ids, cfg) {
  for (const runtime of collectConfiguredRuntimePluginIds(cfg)) addConfiguredPluginId(ids, runtime);
}
function addConfiguredMemoryEmbeddingProviderPluginIds(ids, cfg) {
  const configuredProviderIds = collectConfiguredMemoryEmbeddingProviderIds(cfg);
  if (configuredProviderIds.size === 0) return;
  for (const contract of ["embeddingProviders", "memoryEmbeddingProviders"])
    for (const pluginId of resolveOfficialExternalProviderContractPluginIds({
      contract,
      providerIds: configuredProviderIds,
    }))
      ids.add(pluginId);
}
function addConfiguredSpeechProviderPluginIds(ids, cfg) {
  for (const pluginId of resolveOfficialExternalProviderContractPluginIds({
    contract: "speechProviders",
    providerIds: collectConfiguredSpeechProviderIds(cfg),
  }))
    ids.add(pluginId);
}
function addConfiguredWebFetchProviderPluginIds(ids, cfg) {
  const webFetch = cfg.tools?.web?.fetch;
  if (webFetch?.enabled === false) return;
  const providerId = normalizeOptionalLowercaseString(webFetch?.provider);
  if (!providerId) return;
  for (const pluginId of resolveOfficialExternalProviderContractPluginIds({
    contract: "webFetchProviders",
    providerIds: /* @__PURE__ */ new Set([providerId]),
  }))
    ids.add(pluginId);
}
function addEnvWebFetchProviderPluginIds(ids, cfg, env) {
  if (cfg.tools?.web?.fetch?.enabled === false) return;
  for (const pluginId of resolveOfficialExternalWebProviderContractPluginIdsForEnv({
    contract: "webFetchProviders",
    env: env ?? process.env,
  }))
    ids.add(pluginId);
}
function collectConfiguredPluginIds(cfg, env) {
  const ids = /* @__PURE__ */ new Set();
  const plugins = asObjectRecord(cfg.plugins);
  if (plugins?.enabled === false) return ids;
  const entries = asObjectRecord(plugins?.entries);
  for (const [pluginId, entry] of Object.entries(entries ?? {})) {
    if (asObjectRecord(entry)?.enabled === false) continue;
    addConfiguredPluginId(ids, pluginId);
  }
  const searchProvider = cfg.tools?.web?.search?.provider;
  if (cfg.tools?.web?.search?.enabled !== false && typeof searchProvider === "string") {
    const installEntry = resolveWebSearchInstallCatalogEntry({ providerId: searchProvider });
    if (installEntry?.pluginId) ids.add(installEntry.pluginId);
  }
  if (cfg.tools?.web?.search?.enabled !== false)
    for (const entry of resolveWebSearchInstallCatalogEntriesForEnv(env ?? process.env))
      ids.add(entry.pluginId);
  addConfiguredAgentRuntimePluginIds(ids, cfg);
  for (const pluginId of collectConfiguredProviderPluginIds({
    cfg,
    env,
  }))
    ids.add(pluginId);
  addConfiguredMemoryEmbeddingProviderPluginIds(ids, cfg);
  addConfiguredSpeechProviderPluginIds(ids, cfg);
  addConfiguredWebFetchProviderPluginIds(ids, cfg);
  addEnvWebFetchProviderPluginIds(ids, cfg, env);
  return ids;
}
function collectBlockedPluginIds(cfg) {
  const ids = /* @__PURE__ */ new Set();
  const deny = cfg.plugins?.deny;
  if (Array.isArray(deny)) {
    for (const pluginId of deny)
      if (typeof pluginId === "string" && pluginId.trim()) ids.add(pluginId.trim());
  }
  const entries = asObjectRecord(cfg.plugins?.entries);
  for (const [pluginId, entry] of Object.entries(entries ?? {}))
    if (pluginId.trim() && asObjectRecord(entry)?.enabled === false) ids.add(pluginId.trim());
  return ids;
}
function collectConfiguredChannelIds(cfg, env) {
  const ids = /* @__PURE__ */ new Set();
  if (asObjectRecord(cfg.plugins)?.enabled === false) return ids;
  const disabled = new Set(listExplicitlyDisabledChannelIdsForConfig(cfg));
  const candidateChannelIds = listRawChannelPluginCatalogEntries({
    env,
    excludeWorkspace: true,
  }).map((entry) => entry.id);
  for (const channelId of listPotentialConfiguredChannelIds(cfg, env, {
    channelIds: candidateChannelIds,
    includePersistedAuthState: false,
  })) {
    const normalized = channelId.trim();
    if (normalized && !disabled.has(normalized.toLowerCase())) ids.add(normalized);
  }
  return ids;
}
function collectEffectiveConfiguredChannelOwnerPluginIds(params) {
  const owners = /* @__PURE__ */ new Map();
  const configuredChannelIds = new Set(
    [...params.configuredChannelIds]
      .map((channelId) => normalizeOptionalLowercaseString(channelId))
      .filter((channelId) => Boolean(channelId)),
  );
  if (configuredChannelIds.size === 0) return owners;
  for (const entry of resolveConfiguredChannelPresencePolicy({
    config: params.cfg,
    env: params.env,
    includePersistedAuthState: false,
    manifestRecords: params.snapshot.plugins,
  })) {
    if (!entry.effective || !configuredChannelIds.has(entry.channelId)) continue;
    const pluginIds = new Set(entry.pluginIds);
    if (pluginIds.size > 0) owners.set(entry.channelId, pluginIds);
  }
  return owners;
}
function collectDownloadableInstallCandidates(params) {
  const configuredPluginIds = params.configuredPluginIds ?? collectConfiguredPluginIds(params.cfg);
  const configuredChannelIds =
    params.configuredChannelIds ?? collectConfiguredChannelIds(params.cfg, params.env);
  const candidates = /* @__PURE__ */ new Map();
  for (const entry of listRawChannelPluginCatalogEntries({
    env: params.env,
    excludeWorkspace: true,
  })) {
    if (entry.origin === "bundled") continue;
    const pluginId = entry.pluginId ?? entry.id;
    const channelId = normalizeOptionalLowercaseString(entry.id);
    if (params.blockedPluginIds?.has(pluginId)) continue;
    const selectedOnlyByChannel =
      !params.missingPluginIds.has(pluginId) &&
      !configuredPluginIds.has(pluginId) &&
      (channelId ? configuredChannelIds.has(channelId) : configuredChannelIds.has(entry.id));
    const configuredChannelOwnerPluginIds = channelId
      ? params.configuredChannelOwnerPluginIds?.get(channelId)
      : void 0;
    if (
      selectedOnlyByChannel &&
      configuredChannelOwnerPluginIds &&
      configuredChannelOwnerPluginIds.size > 0 &&
      !configuredChannelOwnerPluginIds.has(pluginId)
    )
      continue;
    if (
      !params.missingPluginIds.has(pluginId) &&
      !configuredPluginIds.has(pluginId) &&
      !configuredChannelIds.has(entry.id)
    )
      continue;
    const npmSpec = entry.install.npmSpec?.trim();
    const clawhubSpec = resolveCandidateClawHubSpec(entry.install);
    if (!npmSpec && !clawhubSpec) continue;
    candidates.set(pluginId, {
      pluginId,
      label: entry.meta.label,
      ...(npmSpec ? { npmSpec } : {}),
      ...(clawhubSpec ? { clawhubSpec } : {}),
      ...(entry.install.expectedIntegrity
        ? { expectedIntegrity: entry.install.expectedIntegrity }
        : {}),
      ...(entry.trustedSourceLinkedOfficialInstall
        ? { trustedSourceLinkedOfficialInstall: true }
        : {}),
      ...(entry.install.defaultChoice ? { defaultChoice: entry.install.defaultChoice } : {}),
    });
  }
  for (const entry of resolveProviderInstallCatalogEntries({
    config: params.cfg,
    env: params.env,
    includeUntrustedWorkspacePlugins: false,
  })) {
    if (!configuredPluginIds.has(entry.pluginId) && !params.missingPluginIds.has(entry.pluginId))
      continue;
    if (params.blockedPluginIds?.has(entry.pluginId)) continue;
    const npmSpec = entry.install.npmSpec?.trim();
    const clawhubSpec = resolveCandidateClawHubSpec(entry.install);
    if (!npmSpec && !clawhubSpec) continue;
    candidates.set(entry.pluginId, {
      pluginId: entry.pluginId,
      label: entry.label,
      ...(npmSpec ? { npmSpec } : {}),
      ...(clawhubSpec ? { clawhubSpec } : {}),
      ...(entry.install.expectedIntegrity
        ? { expectedIntegrity: entry.install.expectedIntegrity }
        : {}),
      ...(entry.origin === "bundled" ? { trustedSourceLinkedOfficialInstall: true } : {}),
      ...(entry.install.defaultChoice ? { defaultChoice: entry.install.defaultChoice } : {}),
    });
  }
  for (const entry of listOfficialExternalPluginCatalogEntries()) {
    const pluginId = resolveOfficialExternalPluginId(entry);
    if (!pluginId || candidates.has(pluginId) || params.blockedPluginIds?.has(pluginId)) continue;
    if (!configuredPluginIds.has(pluginId) && !params.missingPluginIds.has(pluginId)) continue;
    const install = resolveOfficialExternalPluginInstall(entry);
    if (!install) continue;
    const npmSpec = install.npmSpec?.trim();
    const clawhubSpec = resolveCandidateClawHubSpec(install);
    if (!npmSpec && !clawhubSpec) continue;
    candidates.set(pluginId, {
      pluginId,
      label: resolveOfficialExternalPluginLabel(entry),
      ...(npmSpec ? { npmSpec } : {}),
      ...(clawhubSpec ? { clawhubSpec } : {}),
      ...(install.expectedIntegrity ? { expectedIntegrity: install.expectedIntegrity } : {}),
      trustedSourceLinkedOfficialInstall: true,
      ...(install.defaultChoice ? { defaultChoice: install.defaultChoice } : {}),
    });
  }
  for (const entry of CONFIGURED_RUNTIME_PLUGIN_INSTALL_CANDIDATES) {
    if (!configuredPluginIds.has(entry.pluginId) && !params.missingPluginIds.has(entry.pluginId))
      continue;
    if (params.blockedPluginIds?.has(entry.pluginId)) continue;
    if (!candidates.has(entry.pluginId)) candidates.set(entry.pluginId, entry);
  }
  for (const candidate of collectLegacyNpmDeclarationInstallCandidates({
    cfg: params.cfg,
    env: params.env,
    configuredPluginIds,
    missingPluginIds: params.missingPluginIds,
    blockedPluginIds: params.blockedPluginIds,
  }))
    if (!candidates.has(candidate.pluginId)) candidates.set(candidate.pluginId, candidate);
  return [...candidates.values()].toSorted((left, right) =>
    left.pluginId.localeCompare(right.pluginId),
  );
}
function addLegacyNpmDeclarationInstallCandidate(params) {
  const declaration = readLegacyNpmPluginDeclaration(params.pluginDir);
  if (!declaration) return;
  if (
    params.blockedPluginIds?.has(declaration.pluginId) ||
    (!params.configuredPluginIds.has(declaration.pluginId) &&
      !params.missingPluginIds.has(declaration.pluginId))
  )
    return;
  params.candidates.set(declaration.pluginId, {
    pluginId: declaration.pluginId,
    label: declaration.pluginId,
    npmSpec: declaration.npmSpec,
    defaultChoice: "npm",
  });
}
function collectLegacyNpmDeclarationInstallCandidates(params) {
  const candidates = /* @__PURE__ */ new Map();
  const env = params.env ?? process.env;
  const loadPaths = params.cfg.plugins?.load?.paths;
  if (Array.isArray(loadPaths))
    for (const rawPath of loadPaths) {
      if (typeof rawPath !== "string" || !rawPath.trim()) continue;
      addLegacyNpmDeclarationInstallCandidate({
        candidates,
        pluginDir: resolveUserPath(rawPath, env),
        configuredPluginIds: params.configuredPluginIds,
        missingPluginIds: params.missingPluginIds,
        blockedPluginIds: params.blockedPluginIds,
      });
    }
  const extensionsDir = resolveDefaultPluginExtensionsDir(env);
  const configuredOrMissingPluginIds = /* @__PURE__ */ new Set([
    ...params.configuredPluginIds,
    ...params.missingPluginIds,
  ]);
  for (const pluginId of configuredOrMissingPluginIds)
    try {
      addLegacyNpmDeclarationInstallCandidate({
        candidates,
        pluginDir: resolvePluginInstallDir(pluginId, extensionsDir),
        configuredPluginIds: params.configuredPluginIds,
        missingPluginIds: params.missingPluginIds,
        blockedPluginIds: params.blockedPluginIds,
      });
    } catch {
      continue;
    }
  return [...candidates.values()].toSorted((left, right) =>
    left.pluginId.localeCompare(right.pluginId),
  );
}
function collectUpdateDeferredPluginIds(params) {
  const pluginIds = new Set(params.configuredPluginIds);
  for (const candidate of collectDownloadableInstallCandidates({
    cfg: params.cfg,
    env: params.env,
    missingPluginIds: /* @__PURE__ */ new Set(),
    configuredPluginIds: params.configuredPluginIds,
    configuredChannelIds: params.configuredChannelIds,
    configuredChannelOwnerPluginIds: params.configuredChannelOwnerPluginIds,
    blockedPluginIds: params.blockedPluginIds,
  }))
    pluginIds.add(candidate.pluginId);
  return pluginIds;
}
function collectConfiguredPluginIdsWithMissingChannelConfigDescriptors(params) {
  const stalePluginIds = /* @__PURE__ */ new Set();
  const pluginsById = new Map(params.snapshot.plugins.map((plugin) => [plugin.id, plugin]));
  for (const diagnostic of params.snapshot.diagnostics) {
    const pluginId = diagnostic.pluginId?.trim();
    if (!pluginId || !diagnostic.message.includes(MISSING_CHANNEL_CONFIG_DESCRIPTOR_DIAGNOSTIC))
      continue;
    const ownsConfiguredChannel = pluginsById
      .get(pluginId)
      ?.channels.some((channelId) => params.configuredChannelIds.has(channelId));
    if (params.configuredPluginIds.has(pluginId) || ownsConfiguredChannel)
      stalePluginIds.add(pluginId);
  }
  return stalePluginIds;
}
function collectInstalledPluginIdsWithRepairablePackageDiagnostics(params) {
  const pluginIds = /* @__PURE__ */ new Set();
  for (const diagnostic of params.snapshot.diagnostics) {
    const pluginId = diagnostic.pluginId?.trim();
    if (!pluginId || !Object.hasOwn(params.installRecords, pluginId)) continue;
    if (
      REPAIRABLE_PACKAGE_ENTRY_DIAGNOSTIC_MARKERS.some((marker) =>
        diagnostic.message.includes(marker),
      )
    )
      pluginIds.add(pluginId);
  }
  return pluginIds;
}
function resolveInstalledRuntimePackageVersion(params) {
  const plugin =
    params.snapshot.byPluginId?.get(params.pluginId) ??
    params.snapshot.plugins.find((entry) => entry.id === params.pluginId);
  return normalizeOptionalLowercaseString(
    params.record.resolvedVersion ??
      params.record.version ??
      plugin?.packageVersion ??
      plugin?.version,
  );
}
function installedRuntimePackageVersionIsStale(params) {
  if (!params.installedVersion) return false;
  if (
    params.updateChannel === "beta" &&
    betaCompanionMatchesCurrentStableVersion({
      installedVersion: params.installedVersion,
      currentVersion: params.currentVersion,
    })
  )
    return false;
  const comparison = compareOpenClawReleaseVersions(params.installedVersion, params.currentVersion);
  return comparison === null ? params.installedVersion !== params.currentVersion : comparison < 0;
}
function betaCompanionMatchesCurrentStableVersion(params) {
  const installedBase = OPENCLAW_BETA_COMPANION_VERSION_RE.exec(params.installedVersion)?.[1];
  const currentBase = OPENCLAW_STABLE_OR_BETA_COMPANION_VERSION_RE.exec(params.currentVersion)?.[1];
  return Boolean(installedBase && currentBase && installedBase === currentBase);
}
function collectInstalledPluginIdsWithStaleVersionBoundRuntimePackages(params) {
  const pluginIds = /* @__PURE__ */ new Set();
  const currentVersion = normalizeOptionalLowercaseString(VERSION);
  if (!currentVersion) return pluginIds;
  for (const candidate of CONFIGURED_RUNTIME_PLUGIN_INSTALL_CANDIDATES) {
    if (
      !VERSION_BOUND_RUNTIME_PLUGIN_IDS.has(candidate.pluginId) ||
      !params.configuredPluginIds.has(candidate.pluginId)
    )
      continue;
    const record = params.installRecords[candidate.pluginId];
    if (!record) continue;
    if (
      installedRuntimePackageVersionIsStale({
        installedVersion: resolveInstalledRuntimePackageVersion({
          pluginId: candidate.pluginId,
          snapshot: params.snapshot,
          record,
        }),
        currentVersion,
        updateChannel: params.updateChannel,
      })
    )
      pluginIds.add(candidate.pluginId);
  }
  return pluginIds;
}
function isConfiguredPluginRepairTarget(params) {
  if (params.configuredPluginIds.has(params.pluginId)) return true;
  if (params.configuredChannelIds.has(params.pluginId)) return true;
  for (const ownerIds of params.configuredChannelOwnerPluginIds.values())
    if (ownerIds.has(params.pluginId)) return true;
  return false;
}
function collectOfficialReplacementInstallCandidates(params) {
  const repairableConfiguredPluginIds = new Set(
    [...params.repairablePluginIds].filter((pluginId) =>
      isConfiguredPluginRepairTarget({
        pluginId,
        configuredPluginIds: params.configuredPluginIds,
        configuredChannelIds: params.configuredChannelIds,
        configuredChannelOwnerPluginIds: params.configuredChannelOwnerPluginIds,
      }),
    ),
  );
  if (repairableConfiguredPluginIds.size === 0) return /* @__PURE__ */ new Map();
  const candidates = collectDownloadableInstallCandidates({
    cfg: params.cfg,
    env: params.env,
    missingPluginIds: repairableConfiguredPluginIds,
    configuredPluginIds: params.configuredPluginIds,
    configuredChannelIds: params.configuredChannelIds,
    configuredChannelOwnerPluginIds: params.configuredChannelOwnerPluginIds,
    blockedPluginIds: params.blockedPluginIds,
  });
  return new Map(
    candidates
      .filter(
        (candidate) =>
          repairableConfiguredPluginIds.has(candidate.pluginId) &&
          candidate.trustedSourceLinkedOfficialInstall,
      )
      .map((candidate) => [candidate.pluginId, candidate]),
  );
}
function forceNpmInstallRecordRepair(record) {
  if (record.source !== "npm") return record;
  const next = { ...record };
  delete next.resolvedSpec;
  delete next.resolvedVersion;
  return next;
}
function isInstalledRecordMissingOnDisk(record, env) {
  const installPath = record?.installPath?.trim();
  if (!installPath) return true;
  const resolved = resolveUserPath(installPath, env);
  return !existsSync(path.join(resolved, "package.json"));
}
function pathsEqual(left, right) {
  return path.resolve(left) === path.resolve(right);
}
function resolveNpmPackageInstallPath(params) {
  return resolvePluginNpmPackageDir({
    npmDir: params.npmRoot,
    packageName: params.packageName,
  });
}
function resolveLegacyNpmPackageInstallPath(params) {
  return path.join(params.npmRoot, "node_modules", ...params.packageName.split("/"));
}
function collectCandidateOfficialPackageNames(candidate) {
  const names = /* @__PURE__ */ new Set();
  const npmName = candidate.npmSpec ? parseRegistryNpmSpec(candidate.npmSpec)?.name : void 0;
  const clawhubName = candidate.clawhubSpec
    ? parseClawHubPluginSpec(candidate.clawhubSpec)?.name
    : void 0;
  if (npmName) names.add(npmName);
  if (clawhubName) names.add(clawhubName);
  return names;
}
function collectInstalledRecordPackageNames(record) {
  const names = /* @__PURE__ */ new Set();
  if (record.source === "npm") {
    const specName = record.spec ? parseRegistryNpmSpec(record.spec)?.name : void 0;
    const resolvedSpecName = record.resolvedSpec
      ? parseRegistryNpmSpec(record.resolvedSpec)?.name
      : void 0;
    for (const value of [record.resolvedName, specName, resolvedSpecName])
      if (value) names.add(value);
  }
  if (record.source === "clawhub") {
    const specName = record.spec ? parseClawHubPluginSpec(record.spec)?.name : void 0;
    for (const value of [record.clawhubPackage, specName]) if (value) names.add(value);
  }
  return names;
}
function isTrustedOfficialInstallRecordForCandidate(params) {
  const record = params.record;
  if (!record) return false;
  if (record.source !== "npm" && record.source !== "clawhub") return false;
  if (record.source === "clawhub" && record.clawhubChannel !== "official") return false;
  const candidatePackageNames = collectCandidateOfficialPackageNames(params.candidate);
  if (candidatePackageNames.size === 0) return false;
  for (const installedPackageName of collectInstalledRecordPackageNames(record))
    if (candidatePackageNames.has(installedPackageName)) return true;
  return false;
}
function resolveSafeBrokenOfficialInstallRemovalPath(params) {
  const installPath = params.record?.installPath?.trim();
  if (!installPath) return null;
  const resolvedInstallPath = resolveUserPath(installPath, params.env);
  try {
    const extensionsDir = resolveDefaultPluginExtensionsDir(params.env);
    if (pathsEqual(resolvedInstallPath, resolvePluginInstallDir(params.pluginId, extensionsDir)))
      return resolvedInstallPath;
  } catch {}
  const parsedNpmSpec = params.candidate.npmSpec
    ? parseRegistryNpmSpec(params.candidate.npmSpec)
    : null;
  if (!parsedNpmSpec?.name) return null;
  const npmRoot = resolveDefaultPluginNpmDir(params.env);
  return [
    resolveNpmPackageInstallPath({
      packageName: parsedNpmSpec.name,
      npmRoot,
    }),
    resolveLegacyNpmPackageInstallPath({
      packageName: parsedNpmSpec.name,
      npmRoot,
    }),
  ].some((expectedPath) => pathsEqual(resolvedInstallPath, expectedPath))
    ? resolvedInstallPath
    : null;
}
function recordMatchesBundledPackage(record, bundled) {
  const packageName = bundled.packageName?.trim() || bundled.name?.trim();
  if (!packageName) return false;
  if (record.source === "npm")
    return [record.spec, record.resolvedName, record.resolvedSpec].some(
      (value) => recordNpmPackageName(value) === packageName,
    );
  if (record.source === "clawhub")
    return [record.clawhubPackage, record.spec].some(
      (value) => recordClawHubPackageName(value) === packageName,
    );
  return false;
}
function recordNpmPackageName(value) {
  const trimmed = value?.trim();
  return trimmed ? parseRegistryNpmSpec(trimmed)?.name : void 0;
}
function recordClawHubPackageName(value) {
  const trimmed = value?.trim();
  if (!trimmed) return;
  return parseClawHubPluginSpec(trimmed)?.name ?? trimmed;
}
function formatInstalledConfiguredPluginChange(params) {
  return params.repairReason === "stale-version-bound-runtime"
    ? `Refreshed stale configured plugin "${params.pluginId}" from ${params.installSpec}.`
    : `Installed missing configured plugin "${params.pluginId}" from ${params.installSpec}.`;
}
async function installCandidate(params) {
  const { candidate } = params;
  const extensionsDir = resolveDefaultPluginExtensionsDir(params.env);
  const changes = [];
  const warnings = [];
  const clawhubSpecs = candidate.clawhubSpec
    ? resolveClawHubInstallSpecsForUpdateChannel({
        spec: candidate.clawhubSpec,
        updateChannel: params.updateChannel,
      })
    : null;
  const npmSpecs = candidate.npmSpec
    ? resolveNpmInstallSpecsForUpdateChannel({
        spec: candidate.npmSpec,
        updateChannel: params.updateChannel,
        officialPackageName: candidate.trustedSourceLinkedOfficialInstall
          ? parseRegistryNpmSpec(candidate.npmSpec)?.name
          : void 0,
        coreVersion: resolveCompatibilityHostVersion(params.env),
      })
    : null;
  const clawhubInstallSpec = clawhubSpecs?.installSpec ?? candidate.clawhubSpec;
  const npmInstallSpec = npmSpecs?.installSpec ?? candidate.npmSpec;
  const npmDir = resolveDefaultPluginNpmDir(params.env);
  const existingClawHubPackagePath = clawhubInstallSpec
    ? resolveExistingCandidateClawHubPackagePath({
        candidate,
        extensionsDir,
      })
    : null;
  const existingNpmPackagePath = npmInstallSpec
    ? resolveExistingCandidateNpmPackagePath({
        candidate,
        npmDir,
      })
    : null;
  const existingNpmPackageVersion = existingNpmPackagePath
    ? await readNpmPackageVersion(existingNpmPackagePath)
    : void 0;
  if (
    existingNpmPackagePath &&
    existingNpmPackageVersion &&
    npmInstallSpec &&
    params.mode !== "update" &&
    isPostCoreConvergencePass(params.env)
  )
    return await adoptExistingNpmPackage({
      candidate,
      records: params.records,
      npmInstallSpec,
      npmRecordSpec: npmSpecs?.recordSpec ?? npmInstallSpec,
      pinResolvedRegistrySpec: false,
      packagePath: existingNpmPackagePath,
      version: existingNpmPackageVersion,
    });
  if (
    clawhubInstallSpec &&
    !existingNpmPackagePath &&
    !(params.preferNpm && npmInstallSpec) &&
    candidate.defaultChoice !== "npm"
  ) {
    const clawhubInstallSpecLabel = sanitizeTerminalText(clawhubInstallSpec);
    const clawhubResult = await installPluginFromClawHub({
      spec: clawhubInstallSpec,
      extensionsDir,
      env: params.env,
      expectedPluginId: candidate.pluginId,
      mode: params.mode === "update" || existingClawHubPackagePath ? "update" : "install",
      logger: {
        terminalLinks: false,
        warn: (message) => warnings.push(stripAnsi(message)),
      },
      ...(params.acknowledgeClawHubRisk ? { acknowledgeClawHubRisk: true } : {}),
      ...(params.onClawHubRisk ? { onClawHubRisk: params.onClawHubRisk } : {}),
    });
    if (clawhubResult.ok) {
      const pluginId = clawhubResult.pluginId;
      return {
        records: {
          ...params.records,
          [pluginId]: {
            ...buildClawHubPluginInstallRecordFields(clawhubResult.clawhub),
            spec: clawhubSpecs?.recordSpec ?? clawhubInstallSpec,
            installPath: clawhubResult.targetDir,
            installedAt: /* @__PURE__ */ new Date().toISOString(),
          },
        },
        changes: [
          formatInstalledConfiguredPluginChange({
            pluginId,
            installSpec: clawhubInstallSpecLabel,
            repairReason: params.repairReason,
          }),
        ],
        notices: warnings,
        warnings: [],
      };
    }
    if (
      !npmInstallSpec ||
      !shouldFallbackClawHubToNpm({
        result: clawhubResult,
        npmSpec: npmInstallSpec,
      })
    ) {
      const failure = `Failed to install missing configured plugin "${candidate.pluginId}" from ${clawhubInstallSpecLabel}: ${clawhubResult.error}`;
      return {
        records: params.records,
        changes: [],
        notices: [],
        warnings: [
          ...warnings,
          appendClawHubRiskAcknowledgementGuidance({
            message: failure,
            spec: clawhubInstallSpec,
          }),
        ],
        failedPluginId: candidate.pluginId,
      };
    }
    const npmInstallSpecLabel = sanitizeTerminalText(npmInstallSpec);
    changes.push(
      `ClawHub ${clawhubInstallSpecLabel} unavailable for "${candidate.pluginId}"; falling back to npm ${npmInstallSpecLabel}.`,
    );
  }
  if (!npmInstallSpec)
    return {
      records: params.records,
      changes: [],
      notices: [],
      warnings: [
        ...warnings,
        `Failed to install missing configured plugin "${candidate.pluginId}": missing npm spec.`,
      ],
      failedPluginId: candidate.pluginId,
    };
  const npmInstallMode = params.mode === "update" || existingNpmPackagePath ? "update" : "install";
  let result = await installPluginFromNpmSpec({
    spec: npmInstallSpec,
    extensionsDir,
    npmDir,
    expectedPluginId: candidate.pluginId,
    expectedIntegrity: candidate.expectedIntegrity,
    ...(candidate.trustedSourceLinkedOfficialInstall
      ? { trustedSourceLinkedOfficialInstall: true }
      : {}),
    mode: npmInstallMode,
  });
  if (!result.ok && npmInstallMode === "install" && isPluginAlreadyExistsError(result.error))
    result = await installPluginFromNpmSpec({
      spec: npmInstallSpec,
      extensionsDir,
      npmDir,
      expectedPluginId: candidate.pluginId,
      expectedIntegrity: candidate.expectedIntegrity,
      ...(candidate.trustedSourceLinkedOfficialInstall
        ? { trustedSourceLinkedOfficialInstall: true }
        : {}),
      mode: "update",
    });
  if (!result.ok)
    return {
      records: params.records,
      changes: [],
      notices: [],
      warnings: [
        ...warnings,
        `Failed to install missing configured plugin "${candidate.pluginId}" from ${npmInstallSpec}: ${result.error}`,
      ],
      failedPluginId: candidate.pluginId,
    };
  const pluginId = result.pluginId;
  return {
    records: {
      ...params.records,
      [pluginId]: {
        source: "npm",
        spec: resolveNpmInstallRecordSpec({
          requestedSpec: npmSpecs?.recordSpec ?? npmInstallSpec,
          resolution: result.npmResolution,
          pinResolvedRegistrySpec: false,
        }),
        installPath: result.targetDir,
        version: result.version,
        installedAt: /* @__PURE__ */ new Date().toISOString(),
        ...buildNpmResolutionInstallFields(result.npmResolution),
      },
    },
    changes: [
      ...changes,
      formatInstalledConfiguredPluginChange({
        pluginId,
        installSpec: npmInstallSpec,
        repairReason: params.repairReason,
      }),
    ],
    notices: [],
    warnings: [],
  };
}
function isPluginAlreadyExistsError(error) {
  return /\bplugin already exists:/.test(error);
}
function resolveExistingCandidateNpmPackagePath(params) {
  const npmName = params.candidate.npmSpec
    ? parseRegistryNpmSpec(params.candidate.npmSpec)?.name
    : void 0;
  if (!npmName) return null;
  const packagePath = resolveNpmPackageInstallPath({
    packageName: npmName,
    npmRoot: params.npmDir,
  });
  if (existsSync(packagePath)) return packagePath;
  const legacyPackagePath = resolveLegacyNpmPackageInstallPath({
    packageName: npmName,
    npmRoot: params.npmDir,
  });
  return existsSync(legacyPackagePath) ? legacyPackagePath : null;
}
function resolveExistingCandidateClawHubPackagePath(params) {
  try {
    const packagePath = resolvePluginInstallDir(params.candidate.pluginId, params.extensionsDir);
    return existsSync(packagePath) ? packagePath : null;
  } catch {
    return null;
  }
}
async function readNpmPackageVersion(packagePath) {
  try {
    const parsed = JSON.parse(await readFile(path.join(packagePath, "package.json"), "utf-8"));
    return typeof parsed.version === "string" && parsed.version.trim()
      ? parsed.version.trim()
      : void 0;
  } catch {
    return;
  }
}
async function adoptExistingNpmPackage(params) {
  const npmName = parseRegistryNpmSpec(params.npmInstallSpec)?.name;
  const npmResolution = npmName
    ? {
        name: npmName,
        version: params.version,
        resolvedSpec: `${npmName}@${params.version}`,
      }
    : void 0;
  return {
    records: {
      ...params.records,
      [params.candidate.pluginId]: {
        source: "npm",
        spec: resolveNpmInstallRecordSpec({
          requestedSpec: params.npmRecordSpec,
          resolution: npmResolution,
          pinResolvedRegistrySpec: params.pinResolvedRegistrySpec,
        }),
        installPath: params.packagePath,
        installedAt: /* @__PURE__ */ new Date().toISOString(),
        version: params.version,
        resolvedVersion: params.version,
        ...(npmName ? { resolvedName: npmName } : {}),
        ...(npmResolution ? { resolvedSpec: npmResolution.resolvedSpec } : {}),
      },
    },
    changes: [
      `Repaired missing configured plugin "${params.candidate.pluginId}" from existing npm payload ${params.npmInstallSpec}.`,
    ],
    notices: [],
    warnings: [],
  };
}
function resolveCandidateInstallSpec(params) {
  if (params.candidate.defaultChoice !== "npm" && params.candidate.clawhubSpec)
    return resolveClawHubInstallSpecsForUpdateChannel({
      spec: params.candidate.clawhubSpec,
      updateChannel: params.updateChannel,
    }).installSpec;
  if (params.candidate.npmSpec)
    return resolveNpmInstallSpecsForUpdateChannel({
      spec: params.candidate.npmSpec,
      updateChannel: params.updateChannel,
      officialPackageName: params.candidate.trustedSourceLinkedOfficialInstall
        ? parseRegistryNpmSpec(params.candidate.npmSpec)?.name
        : void 0,
      coreVersion: params.coreVersion,
    }).installSpec;
  if (params.candidate.clawhubSpec)
    return resolveClawHubInstallSpecsForUpdateChannel({
      spec: params.candidate.clawhubSpec,
      updateChannel: params.updateChannel,
    }).installSpec;
}
function resolveRecordInstallPath(record, env) {
  const installPath = record?.installPath?.trim();
  return installPath ? resolveUserPath(installPath, env) : void 0;
}
function missingRecordedPluginIssueKind(params) {
  if (params.staleVersionBoundRuntimePluginIds.has(params.pluginId))
    return "stale-version-bound-runtime";
  if (params.repairablePackageDiagnosticPluginIds.has(params.pluginId))
    return "repairable-installed-plugin";
  if (params.staleDescriptorPluginIds.has(params.pluginId))
    return "stale-channel-config-descriptor";
  return "missing-installed-payload";
}
/** Detect configured plugin installs that Doctor can repair without mutating package state. */
async function detectConfiguredPluginInstallHealthIssues(params) {
  const env = params.env ?? process.env;
  const pluginIds = collectConfiguredPluginIds(params.cfg, env);
  const channelIds = collectConfiguredChannelIds(params.cfg, env);
  const blockedPluginIds = collectBlockedPluginIds(params.cfg);
  const snapshot = loadManifestMetadataSnapshot({
    config: params.cfg,
    env,
  });
  const currentBundledPlugins = loadInstalledPluginIndex({
    config: params.cfg,
    env,
    installRecords: {},
  }).plugins.filter((plugin) => plugin.origin === "bundled");
  const knownIds = /* @__PURE__ */ new Set([
    ...snapshot.plugins.map((plugin) => plugin.id),
    ...currentBundledPlugins.map((plugin) => plugin.pluginId),
  ]);
  const configuredChannelOwnerPluginIds = collectEffectiveConfiguredChannelOwnerPluginIds({
    cfg: params.cfg,
    env,
    snapshot,
    configuredChannelIds: channelIds,
  });
  const bundledPluginsById = new Map([
    ...snapshot.plugins
      .filter((plugin) => plugin.origin === "bundled")
      .map((plugin) => [plugin.id, plugin]),
    ...currentBundledPlugins.map((plugin) => [
      plugin.pluginId,
      { packageName: plugin.packageName },
    ]),
  ]);
  const staleDescriptorPluginIds = collectConfiguredPluginIdsWithMissingChannelConfigDescriptors({
    snapshot,
    configuredPluginIds: pluginIds,
    configuredChannelIds: channelIds,
  });
  const records = params.baselineRecords ?? (await loadInstalledPluginIndexInstallRecords({ env }));
  const updateChannel = resolveRegistryUpdateChannel({
    configChannel: normalizeUpdateChannel(params.cfg.update?.channel),
    currentVersion: VERSION,
  });
  const repairablePackageDiagnosticPluginIds =
    collectInstalledPluginIdsWithRepairablePackageDiagnostics({
      snapshot,
      installRecords: records,
    });
  const staleVersionBoundRuntimePluginIds =
    collectInstalledPluginIdsWithStaleVersionBoundRuntimePackages({
      snapshot,
      installRecords: records,
      configuredPluginIds: pluginIds,
      updateChannel,
    });
  const repairableInstalledPluginIds = /* @__PURE__ */ new Set([
    ...repairablePackageDiagnosticPluginIds,
    ...staleVersionBoundRuntimePluginIds,
  ]);
  const officialReplacementInstallCandidates = collectOfficialReplacementInstallCandidates({
    cfg: params.cfg,
    env,
    repairablePluginIds: repairableInstalledPluginIds,
    configuredPluginIds: pluginIds,
    configuredChannelIds: channelIds,
    configuredChannelOwnerPluginIds,
    blockedPluginIds,
  });
  const officialReplacementPluginIds = new Set(officialReplacementInstallCandidates.keys());
  const deferredPluginIds = /* @__PURE__ */ new Set();
  const reportedPluginIds = /* @__PURE__ */ new Set();
  const issues = [];
  if (shouldDeferConfiguredPluginInstallRepair(env))
    for (const pluginId of collectUpdateDeferredPluginIds({
      cfg: params.cfg,
      env,
      configuredPluginIds: pluginIds,
      configuredChannelIds: channelIds,
      configuredChannelOwnerPluginIds,
      blockedPluginIds,
    })) {
      deferredPluginIds.add(pluginId);
      const record = records[pluginId];
      if (!record || !isInstalledRecordMissingOnDisk(record, env)) continue;
      issues.push({
        kind: "deferred-package-manager-repair",
        pluginId,
        ...(resolveRecordInstallPath(record, env)
          ? { installPath: resolveRecordInstallPath(record, env) }
          : {}),
      });
      reportedPluginIds.add(pluginId);
    }
  const missingRecordedPluginIds = Object.keys(records).filter(
    (pluginId) =>
      !deferredPluginIds.has(pluginId) &&
      !officialReplacementPluginIds.has(pluginId) &&
      !bundledPluginsById.has(pluginId) &&
      ((pluginIds.has(pluginId) &&
        (!knownIds.has(pluginId) || isInstalledRecordMissingOnDisk(records[pluginId], env))) ||
        staleDescriptorPluginIds.has(pluginId) ||
        repairableInstalledPluginIds.has(pluginId)),
  );
  for (const pluginId of missingRecordedPluginIds) {
    const record = records[pluginId];
    const kind = missingRecordedPluginIssueKind({
      pluginId,
      staleVersionBoundRuntimePluginIds,
      repairablePackageDiagnosticPluginIds,
      staleDescriptorPluginIds,
    });
    const installPath = resolveRecordInstallPath(record, env);
    if (kind === "stale-channel-config-descriptor") {
      issues.push({
        kind,
        pluginId,
        ...(installPath ? { installPath } : {}),
      });
      reportedPluginIds.add(pluginId);
      continue;
    }
    issues.push({
      kind,
      pluginId,
      ...(installPath ? { installPath } : {}),
      ...(record?.spec ? { installSpec: record.spec } : {}),
    });
    reportedPluginIds.add(pluginId);
  }
  const missingPluginIds = new Set(
    [...pluginIds].filter((pluginId) => {
      if (deferredPluginIds.has(pluginId)) return false;
      const hasRecord = Object.hasOwn(records, pluginId);
      return (
        (!knownIds.has(pluginId) && !hasRecord && !bundledPluginsById.has(pluginId)) ||
        (hasRecord &&
          !bundledPluginsById.has(pluginId) &&
          isInstalledRecordMissingOnDisk(records[pluginId], env))
      );
    }),
  );
  const installCandidatePluginIds = /* @__PURE__ */ new Set([
    ...missingPluginIds,
    ...officialReplacementPluginIds,
  ]);
  for (const candidate of collectDownloadableInstallCandidates({
    cfg: params.cfg,
    env,
    missingPluginIds: installCandidatePluginIds,
    configuredPluginIds: pluginIds,
    configuredChannelIds: channelIds,
    configuredChannelOwnerPluginIds,
    blockedPluginIds:
      deferredPluginIds.size > 0
        ? /* @__PURE__ */ new Set([...blockedPluginIds, ...deferredPluginIds])
        : blockedPluginIds,
  })) {
    if (bundledPluginsById.has(candidate.pluginId)) continue;
    if (reportedPluginIds.has(candidate.pluginId)) continue;
    const shouldReplaceBrokenOfficialInstall = officialReplacementPluginIds.has(candidate.pluginId);
    if (shouldReplaceBrokenOfficialInstall && !candidate.trustedSourceLinkedOfficialInstall)
      continue;
    const record = records[candidate.pluginId];
    if (
      shouldReplaceBrokenOfficialInstall &&
      !isTrustedOfficialInstallRecordForCandidate({
        record,
        candidate,
      })
    )
      continue;
    const hasUsableRecord =
      Object.hasOwn(records, candidate.pluginId) &&
      !isInstalledRecordMissingOnDisk(records[candidate.pluginId], env);
    if (!shouldReplaceBrokenOfficialInstall && knownIds.has(candidate.pluginId) && hasUsableRecord)
      continue;
    if (!shouldReplaceBrokenOfficialInstall && hasUsableRecord) continue;
    const installSpec = resolveCandidateInstallSpec({
      candidate,
      updateChannel,
      coreVersion: resolveCompatibilityHostVersion(env),
    });
    if (shouldReplaceBrokenOfficialInstall) {
      const installPath = resolveRecordInstallPath(record, env);
      if (staleVersionBoundRuntimePluginIds.has(candidate.pluginId))
        issues.push({
          kind: "stale-version-bound-runtime",
          pluginId: candidate.pluginId,
          ...(installPath ? { installPath } : {}),
          ...(installSpec ? { installSpec } : {}),
        });
      else
        issues.push({
          kind: "repairable-installed-plugin",
          pluginId: candidate.pluginId,
          ...(installPath ? { installPath } : {}),
          ...(installSpec ? { installSpec } : {}),
        });
      continue;
    }
    if (record) {
      const installPath = resolveRecordInstallPath(record, env);
      issues.push({
        kind: "missing-installed-payload",
        pluginId: candidate.pluginId,
        ...(installPath ? { installPath } : {}),
        ...(installSpec ? { installSpec } : {}),
      });
    } else if (installSpec)
      issues.push({
        kind: "missing-install-record",
        pluginId: candidate.pluginId,
        installSpec,
      });
  }
  return issues.toSorted((left, right) => left.pluginId.localeCompare(right.pluginId));
}
function configuredPluginInstallIssueToHealthFinding(issue) {
  const target = issue.pluginId;
  switch (issue.kind) {
    case "missing-install-record":
      return {
        checkId: CONFIGURED_PLUGIN_INSTALLS_CHECK_ID,
        severity: "warning",
        message: `Configured plugin ${issue.pluginId} is not installed.`,
        target,
        fixHint: `Run \`openclaw doctor --fix\` to install ${issue.installSpec}.`,
      };
    case "missing-installed-payload":
      return {
        checkId: CONFIGURED_PLUGIN_INSTALLS_CHECK_ID,
        severity: "warning",
        message: `Configured plugin ${issue.pluginId} has an install record but its package payload is missing.`,
        target,
        ...(issue.installPath ? { path: issue.installPath } : {}),
        fixHint: "Run `openclaw doctor --fix` to reinstall the configured plugin package.",
      };
    case "repairable-installed-plugin":
      return {
        checkId: CONFIGURED_PLUGIN_INSTALLS_CHECK_ID,
        severity: "warning",
        message: `Configured plugin ${issue.pluginId} has a repairable package install problem.`,
        target,
        ...(issue.installPath ? { path: issue.installPath } : {}),
        fixHint: "Run `openclaw doctor --fix` to repair the configured plugin package.",
      };
    case "stale-version-bound-runtime":
      return {
        checkId: CONFIGURED_PLUGIN_INSTALLS_CHECK_ID,
        severity: "warning",
        message: `Configured runtime plugin ${issue.pluginId} is older than this OpenClaw version.`,
        target,
        ...(issue.installPath ? { path: issue.installPath } : {}),
        fixHint: "Run `openclaw doctor --fix` to refresh the configured runtime plugin.",
      };
    case "stale-channel-config-descriptor":
      return {
        checkId: CONFIGURED_PLUGIN_INSTALLS_CHECK_ID,
        severity: "warning",
        message: `Configured plugin ${issue.pluginId} has stale channel config metadata.`,
        target,
        ...(issue.installPath ? { path: issue.installPath } : {}),
        fixHint: "Run `openclaw doctor --fix` to repair the configured plugin install metadata.",
      };
    case "deferred-package-manager-repair":
      return {
        checkId: CONFIGURED_PLUGIN_INSTALLS_CHECK_ID,
        severity: "warning",
        message: `Configured plugin ${issue.pluginId} package repair is deferred until the package update finishes.`,
        target,
        ...(issue.installPath ? { path: issue.installPath } : {}),
        fixHint: "Rerun `openclaw doctor --fix` after the package update completes.",
      };
  }
  return assertNeverConfiguredPluginInstallIssue(issue);
}
function configuredPluginInstallIssueToRepairEffect(issue) {
  switch (issue.kind) {
    case "missing-install-record":
      return {
        kind: "package",
        action: "would-install-configured-plugin",
        target: issue.pluginId,
        dryRunSafe: false,
      };
    case "missing-installed-payload":
      return {
        kind: "package",
        action: "would-reinstall-configured-plugin",
        target: issue.pluginId,
        dryRunSafe: false,
      };
    case "repairable-installed-plugin":
    case "stale-channel-config-descriptor":
      return {
        kind: "package",
        action: "would-repair-configured-plugin-install",
        target: issue.pluginId,
        dryRunSafe: false,
      };
    case "stale-version-bound-runtime":
      return {
        kind: "package",
        action: "would-refresh-configured-runtime-plugin",
        target: issue.pluginId,
        dryRunSafe: false,
      };
    case "deferred-package-manager-repair":
      return {
        kind: "package",
        action: "would-defer-configured-plugin-install-repair",
        target: issue.pluginId,
        dryRunSafe: true,
      };
  }
  return assertNeverConfiguredPluginInstallIssue(issue);
}
function assertNeverConfiguredPluginInstallIssue(issue) {
  throw new Error(`Unhandled configured plugin install issue kind: ${String(issue.kind)}`);
}
/** Repair missing installs inferred from the current OpenClaw config. */
async function repairMissingConfiguredPluginInstalls(params) {
  return repairMissingPluginInstalls({
    cfg: params.cfg,
    env: params.env,
    pluginIds: collectConfiguredPluginIds(params.cfg, params.env),
    channelIds: collectConfiguredChannelIds(params.cfg, params.env),
    blockedPluginIds: collectBlockedPluginIds(params.cfg),
    ...(params.acknowledgeClawHubRisk ? { acknowledgeClawHubRisk: true } : {}),
    ...(params.onClawHubRisk ? { onClawHubRisk: params.onClawHubRisk } : {}),
    ...(params.baselineRecords ? { baselineRecords: params.baselineRecords } : {}),
  });
}
/** Repair missing installs for an explicit plugin/channel id set. */
async function repairMissingPluginInstallsForIds(params) {
  return repairMissingPluginInstalls({
    cfg: params.cfg,
    env: params.env,
    pluginIds: new Set(
      [...params.pluginIds].map((pluginId) => pluginId.trim()).filter((pluginId) => pluginId),
    ),
    channelIds: new Set(
      [...(params.channelIds ?? [])]
        .map((channelId) => channelId.trim())
        .filter((channelId) => channelId),
    ),
    blockedPluginIds: new Set(
      [...(params.blockedPluginIds ?? [])]
        .map((pluginId) => pluginId.trim())
        .filter((pluginId) => pluginId),
    ),
    ...(params.acknowledgeClawHubRisk ? { acknowledgeClawHubRisk: true } : {}),
    ...(params.onClawHubRisk ? { onClawHubRisk: params.onClawHubRisk } : {}),
    ...(params.baselineRecords ? { baselineRecords: params.baselineRecords } : {}),
  });
}
async function repairMissingPluginInstalls(params) {
  const env = params.env ?? process.env;
  const snapshot = loadManifestMetadataSnapshot({
    config: params.cfg,
    env,
  });
  const currentBundledPlugins = loadInstalledPluginIndex({
    config: params.cfg,
    env,
    installRecords: {},
  }).plugins.filter((plugin) => plugin.origin === "bundled");
  const knownIds = /* @__PURE__ */ new Set([
    ...snapshot.plugins.map((plugin) => plugin.id),
    ...currentBundledPlugins.map((plugin) => plugin.pluginId),
  ]);
  const configuredChannelOwnerPluginIds = collectEffectiveConfiguredChannelOwnerPluginIds({
    cfg: params.cfg,
    env,
    snapshot,
    configuredChannelIds: params.channelIds,
  });
  const bundledPluginsById = new Map([
    ...snapshot.plugins
      .filter((plugin) => plugin.origin === "bundled")
      .map((plugin) => [plugin.id, plugin]),
    ...currentBundledPlugins.map((plugin) => [
      plugin.pluginId,
      { packageName: plugin.packageName },
    ]),
  ]);
  const configuredPluginIdsWithStaleDescriptors =
    collectConfiguredPluginIdsWithMissingChannelConfigDescriptors({
      snapshot,
      configuredPluginIds: params.pluginIds,
      configuredChannelIds: params.channelIds,
    });
  const records = params.baselineRecords ?? (await loadInstalledPluginIndexInstallRecords({ env }));
  const updateChannel = resolveRegistryUpdateChannel({
    configChannel: normalizeUpdateChannel(params.cfg.update?.channel),
    currentVersion: VERSION,
  });
  const installedPluginIdsWithRepairablePackageDiagnostics =
    collectInstalledPluginIdsWithRepairablePackageDiagnostics({
      snapshot,
      installRecords: records,
    });
  const installedPluginIdsWithStaleVersionBoundRuntimePackages =
    collectInstalledPluginIdsWithStaleVersionBoundRuntimePackages({
      snapshot,
      installRecords: records,
      configuredPluginIds: params.pluginIds,
      updateChannel,
    });
  const installedPluginIdsWithRepairablePackages = /* @__PURE__ */ new Set([
    ...installedPluginIdsWithRepairablePackageDiagnostics,
    ...installedPluginIdsWithStaleVersionBoundRuntimePackages,
  ]);
  const officialReplacementInstallCandidates = collectOfficialReplacementInstallCandidates({
    cfg: params.cfg,
    env,
    repairablePluginIds: installedPluginIdsWithRepairablePackages,
    configuredPluginIds: params.pluginIds,
    configuredChannelIds: params.channelIds,
    configuredChannelOwnerPluginIds,
    blockedPluginIds: params.blockedPluginIds,
  });
  const officialReplacementPluginIds = new Set(officialReplacementInstallCandidates.keys());
  const changes = [];
  const notices = [];
  const warnings = [];
  const deferredRepairDetails = [];
  const failedPluginIds = /* @__PURE__ */ new Set();
  const repairedPluginIds = /* @__PURE__ */ new Set();
  const deferredPluginIds = /* @__PURE__ */ new Set();
  const preferNpmInstalls = isLegacyPackageUpdateDoctorPass(env);
  let nextRecords = records;
  for (const [pluginId, record] of Object.entries(records)) {
    const bundled = bundledPluginsById.get(pluginId);
    if (!bundled || !recordMatchesBundledPackage(record, bundled)) continue;
    if (nextRecords === records) nextRecords = { ...records };
    delete nextRecords[pluginId];
    changes.push(`Removed stale managed install record for bundled plugin "${pluginId}".`);
  }
  if (shouldDeferConfiguredPluginInstallRepair(env)) {
    const updateDeferredPluginIds = collectUpdateDeferredPluginIds({
      cfg: params.cfg,
      env,
      configuredPluginIds: params.pluginIds,
      configuredChannelIds: params.channelIds,
      configuredChannelOwnerPluginIds,
      blockedPluginIds: params.blockedPluginIds,
    });
    for (const pluginId of updateDeferredPluginIds) {
      deferredPluginIds.add(pluginId);
      const record = nextRecords[pluginId];
      if (!record || !isInstalledRecordMissingOnDisk(record, env)) continue;
      const detail = `Skipped package-manager repair for configured plugin "${pluginId}" during package update; rerun "openclaw doctor --fix" after the update completes.`;
      changes.push(detail);
      deferredRepairDetails.push(detail);
    }
  }
  const missingRecordedPluginIds = Object.keys(records).filter(
    (pluginId) =>
      !deferredPluginIds.has(pluginId) &&
      !officialReplacementPluginIds.has(pluginId) &&
      Object.hasOwn(nextRecords, pluginId) &&
      !bundledPluginsById.has(pluginId) &&
      ((params.pluginIds.has(pluginId) &&
        (!knownIds.has(pluginId) || isInstalledRecordMissingOnDisk(nextRecords[pluginId], env))) ||
        configuredPluginIdsWithStaleDescriptors.has(pluginId) ||
        installedPluginIdsWithRepairablePackages.has(pluginId)),
  );
  if (missingRecordedPluginIds.length > 0) {
    for (const pluginId of missingRecordedPluginIds) {
      const record = nextRecords[pluginId];
      if (!record) continue;
      const forced = forceNpmInstallRecordRepair(record);
      if (forced !== record) {
        if (nextRecords === records) nextRecords = { ...records };
        nextRecords[pluginId] = forced;
      }
    }
    const updateResult = await updateNpmInstalledPlugins({
      config: {
        ...params.cfg,
        plugins: {
          ...params.cfg.plugins,
          installs: nextRecords,
        },
      },
      pluginIds: missingRecordedPluginIds,
      updateChannel,
      coreVersion: resolveCompatibilityHostVersion(env),
      logger: {
        terminalLinks: false,
        warn: (message) => {
          if (isClawHubReviewNotice(message)) {
            notices.push(stripAnsi(message));
            return;
          }
          warnings.push(message);
        },
        error: (message) => warnings.push(message),
      },
      ...(params.acknowledgeClawHubRisk ? { acknowledgeClawHubRisk: true } : {}),
      ...(params.onClawHubRisk ? { onClawHubRisk: params.onClawHubRisk } : {}),
    });
    for (const outcome of updateResult.outcomes)
      if (outcome.status === "updated" || outcome.status === "unchanged") {
        repairedPluginIds.add(outcome.pluginId);
        changes.push(
          installedPluginIdsWithStaleVersionBoundRuntimePackages.has(outcome.pluginId)
            ? `Refreshed stale configured plugin "${outcome.pluginId}".`
            : installedPluginIdsWithRepairablePackageDiagnostics.has(outcome.pluginId)
              ? `Repaired broken installed plugin "${outcome.pluginId}".`
              : `Repaired missing configured plugin "${outcome.pluginId}".`,
        );
      } else if (outcome.status === "error") {
        warnings.push(outcome.message);
        failedPluginIds.add(outcome.pluginId);
      } else if (isActionableClawHubSkippedOutcome(outcome)) {
        warnings.push(
          appendClawHubRiskAcknowledgementGuidance({
            message: outcome.message,
            spec: recordClawHubInstallSpec(nextRecords[outcome.pluginId]),
          }),
        );
        failedPluginIds.add(outcome.pluginId);
      }
    nextRecords = updateResult.config.plugins?.installs ?? nextRecords;
  }
  const missingPluginIds = new Set(
    [...params.pluginIds].filter((pluginId) => {
      if (deferredPluginIds.has(pluginId)) return false;
      const hasRecord = Object.hasOwn(nextRecords, pluginId);
      return (
        (!knownIds.has(pluginId) && !hasRecord && !bundledPluginsById.has(pluginId)) ||
        (hasRecord &&
          !bundledPluginsById.has(pluginId) &&
          isInstalledRecordMissingOnDisk(nextRecords[pluginId], env))
      );
    }),
  );
  const installCandidatePluginIds = /* @__PURE__ */ new Set([
    ...missingPluginIds,
    ...officialReplacementPluginIds,
  ]);
  for (const candidate of collectDownloadableInstallCandidates({
    cfg: params.cfg,
    env,
    missingPluginIds: installCandidatePluginIds,
    configuredPluginIds: params.pluginIds,
    configuredChannelIds: params.channelIds,
    configuredChannelOwnerPluginIds,
    blockedPluginIds:
      deferredPluginIds.size > 0
        ? /* @__PURE__ */ new Set([...(params.blockedPluginIds ?? []), ...deferredPluginIds])
        : params.blockedPluginIds,
  })) {
    if (bundledPluginsById.has(candidate.pluginId)) continue;
    const shouldReplaceBrokenOfficialInstall = officialReplacementPluginIds.has(candidate.pluginId);
    if (shouldReplaceBrokenOfficialInstall && !candidate.trustedSourceLinkedOfficialInstall)
      continue;
    const record = nextRecords[candidate.pluginId];
    if (
      shouldReplaceBrokenOfficialInstall &&
      !isTrustedOfficialInstallRecordForCandidate({
        record,
        candidate,
      })
    )
      continue;
    const hasUsableRecord =
      Object.hasOwn(nextRecords, candidate.pluginId) &&
      !isInstalledRecordMissingOnDisk(nextRecords[candidate.pluginId], env);
    if (!shouldReplaceBrokenOfficialInstall && knownIds.has(candidate.pluginId) && hasUsableRecord)
      continue;
    if (!shouldReplaceBrokenOfficialInstall && hasUsableRecord) continue;
    const removalPath = shouldReplaceBrokenOfficialInstall
      ? resolveSafeBrokenOfficialInstallRemovalPath({
          pluginId: candidate.pluginId,
          candidate,
          record,
          env,
        })
      : null;
    const previousRecords = nextRecords;
    const installed = await installCandidate({
      candidate,
      records: nextRecords,
      env,
      updateChannel,
      mode: shouldReplaceBrokenOfficialInstall ? "update" : "install",
      preferNpm: preferNpmInstalls,
      ...(installedPluginIdsWithStaleVersionBoundRuntimePackages.has(candidate.pluginId)
        ? { repairReason: "stale-version-bound-runtime" }
        : {}),
      ...(params.acknowledgeClawHubRisk ? { acknowledgeClawHubRisk: true } : {}),
      ...(params.onClawHubRisk ? { onClawHubRisk: params.onClawHubRisk } : {}),
    });
    if (shouldReplaceBrokenOfficialInstall) {
      const installedRecord = installed.records[candidate.pluginId];
      if (
        installed.records !== previousRecords &&
        removalPath &&
        (!installedRecord?.installPath ||
          !pathsEqual(resolveUserPath(installedRecord.installPath, env), removalPath))
      )
        try {
          await rm(removalPath, {
            recursive: true,
            force: true,
          });
        } catch (error) {
          warnings.push(
            `Failed to remove broken installed plugin "${candidate.pluginId}" at ${removalPath}: ${String(error)}`,
          );
        }
    }
    nextRecords = installed.records;
    changes.push(...installed.changes);
    notices.push(...installed.notices);
    warnings.push(...installed.warnings);
    if (!installed.failedPluginId && installed.records[candidate.pluginId])
      repairedPluginIds.add(candidate.pluginId);
    if (installed.failedPluginId) failedPluginIds.add(installed.failedPluginId);
  }
  if (nextRecords !== records)
    await writePersistedInstalledPluginIndexInstallRecords(nextRecords, { env });
  else if (params.baselineRecords)
    await writePersistedInstalledPluginIndexInstallRecords(nextRecords, { env });
  return {
    changes,
    warnings,
    ...(notices.length > 0 ? { notices } : {}),
    ...(deferredRepairDetails.length > 0 ? { deferredRepairDetails } : {}),
    ...(repairedPluginIds.size > 0
      ? {
          repairedPluginIds: [...repairedPluginIds].toSorted((left, right) =>
            left.localeCompare(right),
          ),
        }
      : {}),
    ...(failedPluginIds.size > 0
      ? {
          failedPluginIds: [...failedPluginIds].toSorted((left, right) =>
            left.localeCompare(right),
          ),
        }
      : {}),
    records: nextRecords,
  };
}
//#endregion
export {
  repairMissingPluginInstallsForIds as a,
  repairMissingConfiguredPluginInstalls as i,
  configuredPluginInstallIssueToRepairEffect as n,
  collectConfiguredProviderPluginIds as o,
  detectConfiguredPluginInstallHealthIssues as r,
  configuredPluginInstallIssueToHealthFinding as t,
};
