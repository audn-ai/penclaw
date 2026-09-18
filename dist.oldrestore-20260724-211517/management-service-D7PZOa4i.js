import path from "node:path";
import { t as createAsyncLock } from "./async-lock-CaiUOILd.js";
import { t as installPluginFromClawHub } from "./clawhub-BhV81Pwz.js";
import { t as CLAWHUB_INSTALL_ERROR_CODE } from "./clawhub-error-codes-OgrR1N6P.js";
import { t as buildClawHubPluginInstallRecordFields } from "./clawhub-install-records-Dy2deHKG.js";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-CzLwxQg_.js";
import "./json-files-CTWRDHag.js";
import { r as replaceConfigFile } from "./config-BDv-QbJ6.js";
import { t as enableExplicitlySelectedPluginInConfig } from "./enable-DK_lFguo.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { a as installPluginFromNpmSpec } from "./install-CjCRVnj8.js";
import { r as resolveDefaultPluginExtensionsDir } from "./install-paths-CqMnrXsY.js";
import {
  a as selectInstallMutationWriteOptions,
  i as resolveInstallConfigMutationPreflights,
  n as persistPluginInstall,
} from "./install-persistence-BSkHA7t9.js";
import { r as commitPluginInstallRecordsWithConfig } from "./install-record-commit-BKVujmT7.js";
import { t as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-D7CXgzhH.js";
import {
  a as withPluginInstallRecords,
  l as buildNpmResolutionInstallFields,
  o as withoutPluginInstallRecords,
  r as removePluginInstallRecordFromRecords,
} from "./installed-plugin-index-records-BP7rp3ti.js";
import { J as collectChangedPaths, f as readConfigFileSnapshotForWrite } from "./io-B3ne6NxF.js";
import { n as MANIFEST_KEY } from "./legacy-names-NIXaj2oi.js";
import { n as assertConfigWriteAllowedInCurrentMode } from "./nix-mode-write-guard-e6xDJfpJ.js";
import { s as parseRegistryNpmSpec } from "./npm-registry-spec-CqBTTiC9.js";
import {
  d as resolveOfficialExternalPluginInstall,
  f as resolveOfficialExternalPluginLabel,
  l as loadConfiguredHostedOfficialExternalPluginCatalogEntries,
  r as getOfficialExternalPluginCatalogManifest,
  s as listOfficialExternalPluginCatalogEntries,
  u as resolveOfficialExternalPluginId,
} from "./official-external-plugin-catalog-B2V9K3em.js";
import { m as resolveIsNixMode } from "./paths-DEklnbzU.js";
import { i as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-BMgImu0m.js";
import { t as ensurePluginAllowlisted } from "./plugins-allowlist-DGbUrepm.js";
import { n as refreshPluginRegistryAfterConfigMutation } from "./registry-refresh-XzeGvhvw.js";
import { t as applySlotSelectionForPlugin } from "./slot-selection-DGEUVrfR.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as setPluginEnabledInConfig } from "./toggle-config-Dhj9dhHJ.js";
import {
  a as planPluginUninstall,
  n as applyPluginUninstallDirectoryRemoval,
  r as formatUninstallActionLabels,
} from "./uninstall-gwewgRmX.js";
//#region src/plugins/management-service.ts
var ManagedPluginLifecycleError = class extends Error {
  constructor(message, details) {
    super(message, details?.cause !== void 0 ? { cause: details.cause } : void 0);
    this.name = "ManagedPluginLifecycleError";
    this.kind = details?.kind ?? "invalid-request";
    this.code = details?.code;
    this.version = details?.version;
    this.warning = details?.warning;
  }
};
let officialCatalogCache;
function officialCatalogCacheKey(config) {
  return JSON.stringify(config.marketplaces ?? null);
}
/** Clear the process-stable hosted catalog snapshot after an explicit owner reload. */
function clearManagedPluginOfficialCatalogCache() {
  officialCatalogCache = void 0;
}
function mergeCatalogMetadata(hosted, bundled) {
  const hostedManifest = getOfficialExternalPluginCatalogManifest(hosted);
  const bundledManifest = getOfficialExternalPluginCatalogManifest(bundled);
  const bundledCatalog = bundledManifest?.catalog;
  const bundledPlugin = bundledManifest?.plugin;
  const bundledName = normalizeOptionalString(bundled.name);
  const bundledDescription = normalizeOptionalString(bundled.description);
  const bundledKind = normalizeOptionalString(bundled.kind);
  const bundledSource = normalizeOptionalString(bundled.source);
  if (!bundledCatalog && !bundledPlugin) return hosted;
  return {
    ...hosted,
    ...(!normalizeOptionalString(hosted.name) && bundledName ? { name: bundledName } : {}),
    ...(!normalizeOptionalString(hosted.description) && bundledDescription
      ? { description: bundledDescription }
      : {}),
    ...(!normalizeOptionalString(hosted.kind) && bundledKind ? { kind: bundledKind } : {}),
    ...(!normalizeOptionalString(hosted.source) && bundledSource ? { source: bundledSource } : {}),
    [MANIFEST_KEY]: {
      ...hostedManifest,
      ...(bundledPlugin
        ? {
            plugin: {
              ...hostedManifest?.plugin,
              ...bundledPlugin,
            },
          }
        : {}),
      ...(bundledCatalog
        ? {
            catalog: {
              ...hostedManifest?.catalog,
              ...bundledCatalog,
            },
          }
        : {}),
    },
  };
}
function resolveCatalogPackageSourceIdentities(entry) {
  const install = resolveOfficialExternalPluginInstall(entry);
  const clawhubPackage = install?.clawhubSpec
    ? parseClawHubPluginSpec(install.clawhubSpec)?.name
    : void 0;
  const npmPackage = install?.npmSpec ? parseRegistryNpmSpec(install.npmSpec)?.name : void 0;
  return /* @__PURE__ */ new Set([
    ...(clawhubPackage ? [`clawhub:${clawhubPackage}`] : []),
    ...(npmPackage ? [`npm:${npmPackage}`] : []),
  ]);
}
function matchesBundledCatalogIdentity(params) {
  const hostedSources = resolveCatalogPackageSourceIdentities(params.hosted);
  const bundledSources = resolveCatalogPackageSourceIdentities(params.bundled);
  return [...hostedSources].some((identity) => bundledSources.has(identity));
}
/** Overlay local runtime identity and editorial hints after an exact package/source match. */
function overlayBundledOfficialPluginCatalogMetadata(
  entries,
  bundledEntries = listOfficialExternalPluginCatalogEntries(),
) {
  return entries.map((entry) => {
    const matches = bundledEntries.filter((bundled) =>
      matchesBundledCatalogIdentity({
        hosted: entry,
        bundled,
      }),
    );
    const bundled = matches.length === 1 ? matches[0] : void 0;
    return bundled ? mergeCatalogMetadata(entry, bundled) : entry;
  });
}
async function loadOfficialCatalog(config) {
  const key = officialCatalogCacheKey(config);
  if (officialCatalogCache?.key !== key)
    officialCatalogCache = {
      key,
      result: loadConfiguredHostedOfficialExternalPluginCatalogEntries(config),
    };
  const result = await officialCatalogCache.result;
  return {
    entries: overlayBundledOfficialPluginCatalogMetadata(result.entries),
    ...("error" in result ? { error: result.error } : {}),
  };
}
function normalizeKinds(kind) {
  const values = (typeof kind === "string" ? [kind] : (kind ?? []))
    .map((value) => value.trim())
    .filter(Boolean);
  return values.length > 0 ? [...new Set(values)] : void 0;
}
function normalizeCatalogMetadata(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  const record = value;
  const featured = typeof record.featured === "boolean" ? record.featured : void 0;
  const order =
    typeof record.order === "number" && Number.isFinite(record.order) ? record.order : void 0;
  return featured === void 0 && order === void 0
    ? void 0
    : {
        ...(featured !== void 0 ? { featured } : {}),
        ...(order !== void 0 ? { order } : {}),
      };
}
function resolveCatalogInstallAction(params) {
  const install = resolveOfficialExternalPluginInstall(params.entry, {
    catalogConfig: params.config.marketplaces,
  });
  const clawhub = install?.clawhubSpec ? parseClawHubPluginSpec(install.clawhubSpec) : void 0;
  if (clawhub && !clawhub.version)
    return {
      source: "clawhub",
      packageName: clawhub.name,
    };
  return install
    ? {
        source: "official",
        pluginId: params.pluginId,
      }
    : void 0;
}
/** Coarse manifest-derived grouping so catalog UIs can shelve a large inventory. */
function derivePluginCategory(manifest) {
  if (!manifest) return;
  if (manifest.channels.length > 0 || Object.keys(manifest.channelConfigs ?? {}).length > 0)
    return "channel";
  const mediaProvider =
    Object.keys(manifest.imageGenerationProviderMetadata ?? {}).length > 0 ||
    Object.keys(manifest.videoGenerationProviderMetadata ?? {}).length > 0 ||
    Object.keys(manifest.musicGenerationProviderMetadata ?? {}).length > 0 ||
    Object.keys(manifest.mediaUnderstandingProviderMetadata ?? {}).length > 0;
  if (
    manifest.providers.length > 0 ||
    manifest.providerEndpoints?.length ||
    manifest.modelCatalog ||
    mediaProvider
  )
    return "provider";
  const kinds = normalizeKinds(manifest.kind);
  if (kinds?.includes("memory")) return "memory";
  if (kinds?.includes("context-engine")) return "context-engine";
  if (
    manifest.contracts?.tools?.length ||
    Object.keys(manifest.toolMetadata ?? {}).length > 0 ||
    manifest.skills.length > 0
  )
    return "tool";
}
function firstPluginError(diagnostics, pluginId) {
  return diagnostics.find(
    (diagnostic) => diagnostic.level === "error" && diagnostic.pluginId === pluginId,
  )?.message;
}
function compareCatalogEntries(left, right) {
  const featured = Number(Boolean(right.featured)) - Number(Boolean(left.featured));
  if (featured !== 0) return featured;
  const order = (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER);
  return order !== 0 ? order : left.name.localeCompare(right.name);
}
/** Build cold installed state merged with the hosted official catalog and bundled curation. */
async function listManagedPlugins(params) {
  const env = params.env ?? process.env;
  const metadata = loadPluginMetadataSnapshot({
    config: params.config,
    env,
  });
  const officialCatalog = params.officialCatalog ?? (await loadOfficialCatalog(params.config));
  const plugins = metadata.index.plugins.map((record) => {
    const manifest = metadata.byPluginId.get(record.pluginId);
    const catalog = normalizeCatalogMetadata(manifest?.catalog);
    const error = firstPluginError(metadata.diagnostics, record.pluginId);
    const kind = normalizeKinds(manifest?.kind);
    const category = derivePluginCategory(manifest);
    const removable =
      record.origin !== "bundled" && Boolean(metadata.index.installRecords[record.pluginId]);
    const name =
      (manifest?.name && manifest.name !== record.packageName ? manifest.name : void 0) ??
      manifest?.channelCatalogMeta?.label ??
      record.pluginId;
    const description =
      manifest?.description ?? manifest?.channelCatalogMeta?.blurb ?? manifest?.packageDescription;
    return {
      id: record.pluginId,
      name,
      ...(record.packageName ? { packageName: record.packageName } : {}),
      ...(description ? { description } : {}),
      ...(record.packageVersion || manifest?.version
        ? { version: record.packageVersion ?? manifest?.version }
        : {}),
      ...(kind ? { kind } : {}),
      ...(record.origin ? { origin: record.origin } : {}),
      installed: true,
      enabled: record.enabled,
      state: error ? "error" : record.enabled ? "enabled" : "disabled",
      ...(catalog?.featured !== void 0 ? { featured: catalog.featured } : {}),
      ...(catalog?.order !== void 0 ? { order: catalog.order } : {}),
      ...(error ? { error } : {}),
      ...(category ? { category } : {}),
      removable,
    };
  });
  const installedIds = new Set(plugins.map((plugin) => plugin.id));
  const installedPackageNames = new Set(
    plugins.flatMap((plugin) => (plugin.packageName ? [plugin.packageName] : [])),
  );
  const entryPackageInstalled = (entry) =>
    [...resolveCatalogPackageSourceIdentities(entry)].some((identity) =>
      installedPackageNames.has(identity.slice(identity.indexOf(":") + 1)),
    );
  for (const entry of officialCatalog.entries) {
    const pluginId = resolveOfficialExternalPluginId(entry);
    const catalog = normalizeCatalogMetadata(
      getOfficialExternalPluginCatalogManifest(entry)?.catalog,
    );
    if (!pluginId || !catalog || installedIds.has(pluginId) || entryPackageInstalled(entry))
      continue;
    const kind = normalizeKinds(entry.kind);
    const install = resolveCatalogInstallAction({
      config: params.config,
      entry,
      pluginId,
    });
    const description = normalizeOptionalString(entry.description);
    const version = normalizeOptionalString(entry.version);
    plugins.push({
      id: pluginId,
      name: resolveOfficialExternalPluginLabel(entry),
      ...(description ? { description } : {}),
      ...(version ? { version } : {}),
      ...(kind ? { kind } : {}),
      origin: "official",
      installed: false,
      enabled: false,
      state: "not-installed",
      ...(catalog.featured !== void 0 ? { featured: catalog.featured } : {}),
      ...(catalog.order !== void 0 ? { order: catalog.order } : {}),
      ...(install ? { install } : {}),
    });
  }
  const diagnostics = [...metadata.diagnostics];
  if (officialCatalog.error)
    diagnostics.push({
      level: "warn",
      message: `Official plugin catalog fallback: ${officialCatalog.error}`,
    });
  return {
    plugins: plugins.toSorted(compareCatalogEntries),
    diagnostics,
    mutationAllowed: !resolveIsNixMode(env),
  };
}
const withManagedPluginMutationLock = createAsyncLock();
function assertValidConfigSnapshot(prepared) {
  const { snapshot, writeOptions } = prepared;
  if (!snapshot.valid)
    throw new ManagedPluginLifecycleError(
      "Config invalid; run `openclaw doctor --fix` before managing plugins.",
    );
  const mutationWriteOptions = selectInstallMutationWriteOptions(writeOptions);
  const { pluginMutation } = resolveInstallConfigMutationPreflights({
    parsed: snapshot.parsed ?? {},
    snapshotPath: snapshot.path,
    writeOptions: mutationWriteOptions,
  });
  if (pluginMutation.mode === "blocked")
    throw new ManagedPluginLifecycleError(pluginMutation.reason);
  return {
    config: snapshot.sourceConfig,
    baseHash: snapshot.hash,
    writeOptions: mutationWriteOptions,
  };
}
async function readPluginMutationSnapshot(env) {
  try {
    assertConfigWriteAllowedInCurrentMode({ env });
  } catch (error) {
    throw new ManagedPluginLifecycleError(formatErrorMessage(error), { cause: error });
  }
  return assertValidConfigSnapshot(await readConfigFileSnapshotForWrite());
}
function createSilentRuntime() {
  return {
    log: () => void 0,
    error: () => void 0,
    exit: (code) => {
      throw new ManagedPluginLifecycleError(`plugin lifecycle exited with code ${code}`);
    },
  };
}
function createInstallLogger(warnings) {
  return {
    info: () => void 0,
    warn: (message) => warnings.push(message),
  };
}
function resolveOfficialEntryById(entries, pluginId) {
  return entries.find((entry) => resolveOfficialExternalPluginId(entry) === pluginId);
}
/** Explicitly declared runtime id, ignoring the entry-id fallback used for display. */
function resolveDeclaredOfficialPluginId(entry) {
  const manifest = getOfficialExternalPluginCatalogManifest(entry);
  return (
    normalizeOptionalString(manifest?.plugin?.id) ??
    normalizeOptionalString(manifest?.channel?.id) ??
    normalizeOptionalString(manifest?.providers?.[0]?.id)
  );
}
function resolveOfficialEntryByClawHubPackage(entries, config, packageName) {
  return [...listOfficialExternalPluginCatalogEntries(), ...entries].find((entry) => {
    return (
      parseClawHubPluginSpec(
        resolveOfficialExternalPluginInstall(entry, { catalogConfig: config.marketplaces })
          ?.clawhubSpec ?? "",
      )?.name === packageName
    );
  });
}
function resolveHostedOfficialEntryByClawHubPackage(entries, config, packageName) {
  return entries.find((entry) => {
    return (
      parseClawHubPluginSpec(
        resolveOfficialExternalPluginInstall(entry, { catalogConfig: config.marketplaces })
          ?.clawhubSpec ?? "",
      )?.name === packageName
    );
  });
}
function buildClawHubSpec(packageName, version) {
  const parsed = parseClawHubPluginSpec(`clawhub:${packageName}`);
  if (!parsed || parsed.version)
    throw new ManagedPluginLifecycleError(`invalid ClawHub package name: ${packageName}`);
  return `clawhub:${packageName}${version ? `@${version}` : ""}`;
}
function throwInstallFailure(result) {
  const unavailable =
    !result.code ||
    result.code === CLAWHUB_INSTALL_ERROR_CODE.ARTIFACT_UNAVAILABLE ||
    result.code === CLAWHUB_INSTALL_ERROR_CODE.ARTIFACT_DOWNLOAD_UNAVAILABLE ||
    result.code === CLAWHUB_INSTALL_ERROR_CODE.CLAWHUB_SECURITY_UNAVAILABLE;
  throw new ManagedPluginLifecycleError(result.error, {
    kind: unavailable ? "unavailable" : "invalid-request",
    code: result.code,
    version: result.version,
    warning: result.warning,
    cause: result,
  });
}
function installRecordOwnsTarget(record, targetDir) {
  return Boolean(
    record?.installPath && path.resolve(record.installPath) === path.resolve(targetDir),
  );
}
async function cleanupFailedManagedPluginInstall(params) {
  let installRecords;
  try {
    installRecords = await loadInstalledPluginIndexInstallRecords();
  } catch (error) {
    return [
      `Could not verify whether the failed plugin install was committed; retained ${params.targetDir}: ${formatErrorMessage(error)}`,
    ];
  }
  if (installRecordOwnsTarget(installRecords[params.pluginId], params.targetDir))
    return [
      `Plugin install persistence reported an error after ${params.targetDir} was recorded; retained the managed target.`,
    ];
  const plan = planPluginUninstall({
    config: { plugins: { installs: { [params.pluginId]: params.install } } },
    pluginId: params.pluginId,
    deleteFiles: true,
    extensionsDir: params.extensionsDir,
  });
  if (!plan.ok) return [`Could not plan cleanup for failed plugin install: ${plan.error}`];
  if (!plan.directoryRemoval)
    return [
      `Could not resolve a managed cleanup target for failed plugin install ${params.pluginId}.`,
    ];
  if (path.resolve(plan.directoryRemoval.target) !== path.resolve(params.targetDir))
    return [
      `Refused cleanup for failed plugin install ${params.pluginId}: planned target does not match the newly installed target.`,
    ];
  try {
    return (await applyPluginUninstallDirectoryRemoval(plan.directoryRemoval)).warnings;
  } catch (error) {
    return [
      `Failed to remove the newly installed target after plugin persistence failed: ${formatErrorMessage(error)}`,
    ];
  }
}
function throwPersistenceFailureWithCleanupWarnings(error, warnings) {
  if (warnings.length === 0) throw error;
  const cleanupWarning = [...new Set(warnings)].join("\n");
  if (error instanceof ManagedPluginLifecycleError)
    throw new ManagedPluginLifecycleError(error.message, {
      kind: error.kind,
      code: error.code,
      version: error.version,
      warning: [error.warning, cleanupWarning].filter(Boolean).join("\n"),
      cause: error,
    });
  throw new ManagedPluginLifecycleError(formatErrorMessage(error), {
    kind: "unavailable",
    warning: cleanupWarning,
    cause: error,
  });
}
async function persistManagedPluginInstall(params) {
  try {
    return await persistPluginInstall({
      snapshot: params.snapshot,
      pluginId: params.pluginId,
      install: params.install,
      invalidateRuntimeCache: false,
      runtime: createSilentRuntime(),
    });
  } catch (error) {
    return throwPersistenceFailureWithCleanupWarnings(
      error,
      await cleanupFailedManagedPluginInstall({
        pluginId: params.pluginId,
        install: params.install,
        targetDir: params.targetDir,
        extensionsDir: params.extensionsDir,
      }),
    );
  }
}
async function installFromClawHub(params) {
  const packageName = params.request.packageName.trim();
  const official = resolveOfficialEntryByClawHubPackage(
    params.officialEntries,
    params.snapshot.config,
    packageName,
  );
  const expectedPluginId = official ? resolveDeclaredOfficialPluginId(official) : void 0;
  const hostedOfficial = resolveHostedOfficialEntryByClawHubPackage(
    params.officialEntries,
    params.snapshot.config,
    packageName,
  );
  const hostedInstall = hostedOfficial
    ? resolveOfficialExternalPluginInstall(hostedOfficial, {
        catalogConfig: params.snapshot.config.marketplaces,
      })
    : void 0;
  const hostedClawHub = parseClawHubPluginSpec(hostedInstall?.clawhubSpec ?? "");
  const requestMatchesHostedCandidate =
    !params.request.version || params.request.version === hostedClawHub?.version;
  const expectedIntegrity =
    params.expectedIntegrity ??
    (requestMatchesHostedCandidate ? hostedInstall?.expectedIntegrity : void 0);
  const spec = buildClawHubSpec(
    packageName,
    params.request.version ?? (requestMatchesHostedCandidate ? hostedClawHub?.version : void 0),
  );
  const extensionsDir = resolveDefaultPluginExtensionsDir(params.env);
  const result = await installPluginFromClawHub({
    spec,
    config: params.snapshot.config,
    extensionsDir,
    logger: createInstallLogger(params.warnings),
    ...(expectedPluginId ? { expectedPluginId } : {}),
    ...(expectedIntegrity ? { expectedIntegrity } : {}),
    ...(params.request.acknowledgeClawHubRisk ? { acknowledgeClawHubRisk: true } : {}),
  });
  if (!result.ok) return throwInstallFailure(result);
  if (expectedPluginId && result.pluginId !== expectedPluginId)
    throw new ManagedPluginLifecycleError(
      `official catalog plugin id mismatch: expected ${expectedPluginId}, got ${result.pluginId}`,
    );
  const install = {
    ...buildClawHubPluginInstallRecordFields(result.clawhub),
    spec,
    installPath: result.targetDir,
  };
  const config = await persistManagedPluginInstall({
    snapshot: params.snapshot,
    pluginId: result.pluginId,
    install,
    targetDir: result.targetDir,
    extensionsDir,
  });
  return {
    pluginId: result.pluginId,
    config,
  };
}
async function installFromOfficialCatalog(params) {
  const entry = resolveOfficialEntryById(params.officialEntries, params.request.pluginId);
  if (!entry)
    throw new ManagedPluginLifecycleError(
      `unknown official plugin catalog entry: ${params.request.pluginId}`,
    );
  const pluginId = resolveOfficialExternalPluginId(entry);
  const install = resolveOfficialExternalPluginInstall(entry, {
    catalogConfig: params.snapshot.config.marketplaces,
  });
  if (!pluginId || !install)
    throw new ManagedPluginLifecycleError(
      `official plugin catalog entry is not installable: ${params.request.pluginId}`,
    );
  const clawhub = install.clawhubSpec ? parseClawHubPluginSpec(install.clawhubSpec) : void 0;
  if (clawhub)
    return await installFromClawHub({
      request: {
        source: "clawhub",
        packageName: clawhub.name,
        ...(clawhub.version ? { version: clawhub.version } : {}),
      },
      snapshot: params.snapshot,
      officialEntries: params.officialEntries,
      env: params.env,
      warnings: params.warnings,
      ...(install.expectedIntegrity ? { expectedIntegrity: install.expectedIntegrity } : {}),
    });
  if (!install.npmSpec)
    throw new ManagedPluginLifecycleError(
      `official plugin catalog entry has no supported install source: ${params.request.pluginId}`,
    );
  const extensionsDir = resolveDefaultPluginExtensionsDir(params.env);
  const result = await installPluginFromNpmSpec({
    spec: install.npmSpec,
    config: params.snapshot.config,
    extensionsDir,
    expectedPluginId: pluginId,
    ...(install.expectedIntegrity ? { expectedIntegrity: install.expectedIntegrity } : {}),
    trustedSourceLinkedOfficialInstall: true,
    logger: createInstallLogger(params.warnings),
  });
  if (!result.ok) return throwInstallFailure(result);
  if (result.pluginId !== pluginId)
    throw new ManagedPluginLifecycleError(
      `official catalog plugin id mismatch: expected ${pluginId}, got ${result.pluginId}`,
    );
  const installRecord = {
    source: "npm",
    spec: install.npmSpec,
    installPath: result.targetDir,
    ...(result.version ? { version: result.version } : {}),
    ...buildNpmResolutionInstallFields(result.npmResolution),
  };
  return {
    pluginId,
    config: await persistManagedPluginInstall({
      snapshot: params.snapshot,
      pluginId,
      install: installRecord,
      targetDir: result.targetDir,
      extensionsDir,
    }),
  };
}
/** Install a ClawHub or curated official plugin through the canonical install pipeline. */
async function installManagedPlugin(params) {
  return await withManagedPluginMutationLock(async () => {
    const env = params.env ?? process.env;
    const snapshot = await readPluginMutationSnapshot(env);
    const officialCatalog = await loadOfficialCatalog(snapshot.config);
    const warnings = [];
    const installed =
      params.request.source === "clawhub"
        ? await installFromClawHub({
            request: params.request,
            snapshot,
            officialEntries: officialCatalog.entries,
            env,
            warnings,
          })
        : await installFromOfficialCatalog({
            request: params.request,
            snapshot,
            officialEntries: officialCatalog.entries,
            env,
            warnings,
          });
    const plugin = (
      await listManagedPlugins({
        config: installed.config,
        env,
        officialCatalog,
      })
    ).plugins.find((entry) => entry.id === installed.pluginId);
    if (!plugin)
      throw new ManagedPluginLifecycleError(
        `installed plugin missing from refreshed registry: ${installed.pluginId}`,
      );
    return {
      plugin,
      ...(warnings.length > 0 ? { warnings: [...new Set(warnings)] } : {}),
    };
  });
}
/** Persist desired plugin policy while preserving allow/deny, slot, include, and hash guards. */
async function setManagedPluginEnabled(params) {
  return await withManagedPluginMutationLock(async () => {
    const env = params.env ?? process.env;
    const snapshot = await readPluginMutationSnapshot(env);
    const metadata = loadPluginMetadataSnapshot({
      config: snapshot.config,
      env,
    });
    const pluginId = metadata.normalizePluginId(params.pluginId.trim());
    if (!metadata.index.plugins.some((plugin) => plugin.pluginId === pluginId))
      throw new ManagedPluginLifecycleError(`plugin not installed: ${params.pluginId}`);
    let next = snapshot.config;
    const warnings = [];
    let policyPluginId = pluginId;
    if (params.enabled) {
      if ((next.plugins?.allow?.length ?? 0) > 0) next = ensurePluginAllowlisted(next, pluginId);
      const enableResult = enableExplicitlySelectedPluginInConfig(next, pluginId, {
        updateChannelConfig: false,
      });
      if (!enableResult.enabled)
        throw new ManagedPluginLifecycleError(
          `plugin "${pluginId}" could not be enabled (${enableResult.reason ?? "unknown reason"})`,
        );
      next = enableResult.config;
      policyPluginId = enableResult.pluginId;
      const slotResult = applySlotSelectionForPlugin(next, pluginId);
      next = slotResult.config;
      warnings.push(...slotResult.warnings);
    } else next = setPluginEnabledInConfig(next, pluginId, false, { updateChannelConfig: false });
    const changedPaths = /* @__PURE__ */ new Set();
    collectChangedPaths(snapshot.config, next, "", changedPaths);
    await replaceConfigFile({
      nextConfig: next,
      baseHash: snapshot.baseHash,
      writeOptions: snapshot.writeOptions,
    });
    await refreshPluginRegistryAfterConfigMutation({
      config: next,
      reason: "policy-changed",
      invalidateRuntimeCache: false,
      policyPluginIds: [policyPluginId],
    });
    const plugin = (
      await listManagedPlugins({
        config: next,
        env,
      })
    ).plugins.find((entry) => entry.id === pluginId);
    if (!plugin)
      throw new ManagedPluginLifecycleError(
        `updated plugin missing from refreshed registry: ${pluginId}`,
      );
    return {
      plugin,
      changedPaths: [...changedPaths].filter(Boolean).toSorted(),
      ...(warnings.length > 0 ? { warnings } : {}),
    };
  });
}
/** Remove an installed plugin: config references, install record, and managed files. */
async function uninstallManagedPlugin(params) {
  return await withManagedPluginMutationLock(async () => {
    const env = params.env ?? process.env;
    const snapshot = await readPluginMutationSnapshot(env);
    const installRecords = await loadInstalledPluginIndexInstallRecords();
    const configWithRecords = withPluginInstallRecords(snapshot.config, installRecords);
    const metadata = loadPluginMetadataSnapshot({
      config: configWithRecords,
      env,
    });
    const pluginId = metadata.normalizePluginId(params.pluginId.trim());
    if (metadata.index.plugins.find((plugin) => plugin.pluginId === pluginId)?.origin === "bundled")
      throw new ManagedPluginLifecycleError(
        `bundled plugin cannot be uninstalled: ${pluginId}; disable it instead`,
      );
    const manifest = metadata.byPluginId.get(pluginId);
    const channelIds = manifest && manifest.channels.length > 0 ? manifest.channels : void 0;
    const extensionsDir = resolveDefaultPluginExtensionsDir(env);
    const plan = planPluginUninstall({
      config: configWithRecords,
      pluginId,
      ...(channelIds ? { channelIds } : {}),
      deleteFiles: true,
      extensionsDir,
    });
    if (!plan.ok) throw new ManagedPluginLifecycleError(plan.error);
    const nextConfig = withoutPluginInstallRecords(plan.config);
    const nextInstallRecords = removePluginInstallRecordFromRecords(installRecords, pluginId);
    await commitPluginInstallRecordsWithConfig({
      previousInstallRecords: installRecords,
      nextInstallRecords,
      nextConfig,
      baseHash: snapshot.baseHash,
      writeOptions: snapshot.writeOptions,
    });
    const directoryResult = await applyPluginUninstallDirectoryRemoval(plan.directoryRemoval);
    const warnings = [...directoryResult.warnings];
    await refreshPluginRegistryAfterConfigMutation({
      config: nextConfig,
      reason: "source-changed",
      installRecords: nextInstallRecords,
      invalidateRuntimeCache: false,
      logger: { warn: (message) => warnings.push(message) },
    });
    return {
      pluginId,
      removed: formatUninstallActionLabels({
        ...plan.actions,
        directory: directoryResult.directoryRemoved,
      }),
      ...(warnings.length > 0 ? { warnings: [...new Set(warnings)] } : {}),
    };
  });
}
/** Normalize unexpected lifecycle failures for Gateway response adapters. */
function formatManagedPluginLifecycleError(error) {
  return formatErrorMessage(error);
}
//#endregion
export {
  listManagedPlugins as a,
  installManagedPlugin as i,
  clearManagedPluginOfficialCatalogCache as n,
  setManagedPluginEnabled as o,
  formatManagedPluginLifecycleError as r,
  uninstallManagedPlugin as s,
  ManagedPluginLifecycleError as t,
};
