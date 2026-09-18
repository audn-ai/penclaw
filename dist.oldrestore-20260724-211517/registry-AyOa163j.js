import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { t as loadBundledCapabilityRuntimeRegistry } from "./bundled-capability-runtime-B7foDGjr.js";
import "./json-files-CTWRDHag.js";
import {
  a as normalizeBundledPluginStringList,
  o as resolveBundledPluginScanDir,
} from "./bundled-plugin-metadata-Dl89Jc_X.js";
import { n as discoverOpenClawPlugins } from "./discovery-Df2IhoW5.js";
import { c as tryReadJsonSync } from "./json-7OTJmMaB.js";
import {
  n as PLUGIN_MANIFEST_FILENAME,
  r as getPackageManifestMetadata,
} from "./manifest-DnFAzqZi.js";
import { t as loadPluginManifestRegistry } from "./manifest-registry-CXy9BBfE.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import { n as loadBundledPluginPublicArtifactModuleSync } from "./public-surface-loader-X-jDa4d1.js";
import "./web-provider-public-artifacts.explicit-D3xJnZ0e.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { a as resolveLoaderPackageRoot } from "./sdk-alias-huj8Ygt2.js";
import { g as sortUniqueStrings } from "./string-normalization-CRyoFBPt.js";
//#region src/plugins/provider-contract-public-artifacts.ts
function isProviderPlugin(value) {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.label === "string" &&
    Array.isArray(value.auth)
  );
}
function tryLoadProviderContractApi(pluginId) {
  try {
    return loadBundledPluginPublicArtifactModuleSync({
      dirName: pluginId,
      artifactBasename: "provider-contract-api.js",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith("Unable to resolve bundled plugin public surface ")
    )
      return null;
    throw error;
  }
}
function collectProviderContractEntries(params) {
  const providers = [];
  for (const [name, exported] of Object.entries(params.mod).toSorted(([left], [right]) =>
    left.localeCompare(right),
  )) {
    if (
      typeof exported !== "function" ||
      exported.length !== 0 ||
      !name.startsWith("create") ||
      !name.endsWith("Provider")
    )
      continue;
    const candidate = exported();
    if (isProviderPlugin(candidate))
      providers.push({
        pluginId: params.pluginId,
        provider: candidate,
      });
  }
  return providers;
}
function resolveBundledExplicitProviderContractsFromPublicArtifacts(params) {
  const providers = [];
  for (const pluginId of sortUniqueStrings(params.onlyPluginIds)) {
    const mod = tryLoadProviderContractApi(pluginId);
    if (!mod) return null;
    const entries = collectProviderContractEntries({
      pluginId,
      mod,
    });
    if (entries.length === 0) return null;
    providers.push(...entries);
  }
  return providers;
}
//#endregion
//#region src/plugins/contracts/shared.ts
/** Returns unique normalized string values while preserving first-seen order. */
function uniqueStrings(values, normalize = (value) => value) {
  const result = [];
  const seen = /* @__PURE__ */ new Set();
  for (const value of values ?? []) {
    const normalized = normalize(value);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }
  return result;
}
//#endregion
//#region src/plugins/contracts/inventory/bundled-capability-metadata.ts
const CURRENT_MODULE_PATH = fileURLToPath(import.meta.url);
const OPENCLAW_PACKAGE_ROOT =
  resolveLoaderPackageRoot({
    modulePath: CURRENT_MODULE_PATH,
    moduleUrl: import.meta.url,
  }) ?? fileURLToPath(new URL("../../../..", import.meta.url));
const RUNNING_FROM_BUILT_ARTIFACT =
  CURRENT_MODULE_PATH.includes(`${path.sep}dist${path.sep}`) ||
  CURRENT_MODULE_PATH.includes(`${path.sep}dist-runtime${path.sep}`);
function readJsonRecord(filePath) {
  const raw = tryReadJsonSync(filePath);
  return raw && typeof raw === "object" && !Array.isArray(raw) ? raw : void 0;
}
function readBundledCapabilityManifest(pluginDir) {
  if (
    normalizeBundledPluginStringList(
      getPackageManifestMetadata(readJsonRecord(path.join(pluginDir, "package.json")))?.extensions,
    ).length === 0
  )
    return;
  const raw = readJsonRecord(path.join(pluginDir, PLUGIN_MANIFEST_FILENAME));
  if (!(typeof raw?.id === "string" ? raw.id.trim() : "")) return;
  return raw;
}
function listBundledCapabilityManifests() {
  const scanDir = resolveBundledPluginScanDir({
    packageRoot: OPENCLAW_PACKAGE_ROOT,
    runningFromBuiltArtifact: RUNNING_FROM_BUILT_ARTIFACT,
  });
  if (!scanDir) return [];
  return fs
    .readdirSync(scanDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => readBundledCapabilityManifest(path.join(scanDir, entry.name)))
    .filter((manifest) => manifest !== void 0)
    .toSorted((left, right) => left.id.localeCompare(right.id));
}
const BUNDLED_CAPABILITY_MANIFESTS = listBundledCapabilityManifests();
function normalizeSetupProviderEnvVars(setup) {
  return Object.fromEntries(
    (setup?.providers ?? [])
      .map((provider) => [
        provider.id.trim(),
        uniqueStrings(provider.envVars ?? [], (value) =>
          typeof value === "string" ? value.trim() : "",
        ),
      ])
      .filter(([key, values]) => key && values.length > 0)
      .toSorted(([left], [right]) => left.localeCompare(right)),
  );
}
function buildBundledPluginContractSnapshot(manifest) {
  return {
    pluginId: manifest.id,
    cliBackendIds: uniqueStrings(manifest.cliBackends, (value) => value.trim()),
    providerIds: uniqueStrings(manifest.providers, (value) => value.trim()),
    providerEnvVars: normalizeSetupProviderEnvVars(manifest.setup),
    workerProviderIds: uniqueStrings(manifest.contracts?.workerProviders, (value) => value.trim()),
    embeddingProviderIds: uniqueStrings(manifest.contracts?.embeddingProviders, (value) =>
      value.trim(),
    ),
    speechProviderIds: uniqueStrings(manifest.contracts?.speechProviders, (value) => value.trim()),
    realtimeTranscriptionProviderIds: uniqueStrings(
      manifest.contracts?.realtimeTranscriptionProviders,
      (value) => value.trim(),
    ),
    realtimeVoiceProviderIds: uniqueStrings(manifest.contracts?.realtimeVoiceProviders, (value) =>
      value.trim(),
    ),
    mediaUnderstandingProviderIds: uniqueStrings(
      manifest.contracts?.mediaUnderstandingProviders,
      (value) => value.trim(),
    ),
    transcriptSourceProviderIds: uniqueStrings(
      manifest.contracts?.transcriptSourceProviders,
      (value) => value.trim(),
    ),
    documentExtractorIds: uniqueStrings(manifest.contracts?.documentExtractors, (value) =>
      value.trim(),
    ),
    imageGenerationProviderIds: uniqueStrings(
      manifest.contracts?.imageGenerationProviders,
      (value) => value.trim(),
    ),
    videoGenerationProviderIds: uniqueStrings(
      manifest.contracts?.videoGenerationProviders,
      (value) => value.trim(),
    ),
    musicGenerationProviderIds: uniqueStrings(
      manifest.contracts?.musicGenerationProviders,
      (value) => value.trim(),
    ),
    webContentExtractorIds: uniqueStrings(manifest.contracts?.webContentExtractors, (value) =>
      value.trim(),
    ),
    webFetchProviderIds: uniqueStrings(manifest.contracts?.webFetchProviders, (value) =>
      value.trim(),
    ),
    webSearchProviderIds: uniqueStrings(manifest.contracts?.webSearchProviders, (value) =>
      value.trim(),
    ),
    migrationProviderIds: uniqueStrings(manifest.contracts?.migrationProviders, (value) =>
      value.trim(),
    ),
    toolNames: uniqueStrings(manifest.contracts?.tools, (value) => value.trim()),
  };
}
function hasBundledPluginContractSnapshotCapabilities(entry) {
  return (
    entry.cliBackendIds.length > 0 ||
    entry.providerIds.length > 0 ||
    entry.workerProviderIds.length > 0 ||
    entry.embeddingProviderIds.length > 0 ||
    entry.speechProviderIds.length > 0 ||
    entry.realtimeTranscriptionProviderIds.length > 0 ||
    entry.realtimeVoiceProviderIds.length > 0 ||
    entry.mediaUnderstandingProviderIds.length > 0 ||
    entry.transcriptSourceProviderIds.length > 0 ||
    entry.documentExtractorIds.length > 0 ||
    entry.imageGenerationProviderIds.length > 0 ||
    entry.videoGenerationProviderIds.length > 0 ||
    entry.musicGenerationProviderIds.length > 0 ||
    entry.webContentExtractorIds.length > 0 ||
    entry.webFetchProviderIds.length > 0 ||
    entry.webSearchProviderIds.length > 0 ||
    entry.migrationProviderIds.length > 0 ||
    entry.toolNames.length > 0
  );
}
const BUNDLED_PLUGIN_CONTRACT_SNAPSHOTS = BUNDLED_CAPABILITY_MANIFESTS.map(
  buildBundledPluginContractSnapshot,
)
  .filter(hasBundledPluginContractSnapshotCapabilities)
  .toSorted((left, right) => left.pluginId.localeCompare(right.pluginId));
//#endregion
//#region src/plugins/contracts/registry.ts
function normalizeProviderEnvVars(providerEnvVars) {
  return Object.fromEntries(
    Object.entries(providerEnvVars ?? {}).map(([providerId, envVars]) => [
      providerId,
      uniqueStrings(envVars),
    ]),
  );
}
function resolvePluginProviderEnvVars(plugin) {
  const envVars = {};
  for (const provider of plugin.setup?.providers ?? [])
    envVars[provider.id] = uniqueStrings(provider.envVars ?? []);
  for (const [providerId, keys] of Object.entries(plugin.providerAuthEnvVars ?? {}))
    envVars[providerId] = uniqueStrings([...(envVars[providerId] ?? []), ...keys]);
  return normalizeProviderEnvVars(envVars);
}
function resolveBundledManifestContracts() {
  if (process.env.VITEST)
    return BUNDLED_PLUGIN_CONTRACT_SNAPSHOTS.map((entry) => ({
      pluginId: entry.pluginId,
      cliBackendIds: [...entry.cliBackendIds],
      providerIds: [...entry.providerIds],
      providerEnvVars: normalizeProviderEnvVars(entry.providerEnvVars),
      workerProviderIds: [...entry.workerProviderIds],
      embeddingProviderIds: [...entry.embeddingProviderIds],
      speechProviderIds: [...entry.speechProviderIds],
      realtimeTranscriptionProviderIds: [...entry.realtimeTranscriptionProviderIds],
      realtimeVoiceProviderIds: [...entry.realtimeVoiceProviderIds],
      mediaUnderstandingProviderIds: [...entry.mediaUnderstandingProviderIds],
      transcriptSourceProviderIds: [...entry.transcriptSourceProviderIds],
      documentExtractorIds: [...entry.documentExtractorIds],
      imageGenerationProviderIds: [...entry.imageGenerationProviderIds],
      videoGenerationProviderIds: [...entry.videoGenerationProviderIds],
      musicGenerationProviderIds: [...entry.musicGenerationProviderIds],
      webContentExtractorIds: [...entry.webContentExtractorIds],
      webFetchProviderIds: [...entry.webFetchProviderIds],
      webSearchProviderIds: [...entry.webSearchProviderIds],
      migrationProviderIds: [...entry.migrationProviderIds],
      toolNames: [...entry.toolNames],
    }));
  return loadPluginManifestRegistry({})
    .plugins.filter(
      (plugin) =>
        plugin.origin === "bundled" &&
        (plugin.cliBackends.length > 0 ||
          plugin.providers.length > 0 ||
          (plugin.contracts?.workerProviders?.length ?? 0) > 0 ||
          (plugin.contracts?.embeddingProviders?.length ?? 0) > 0 ||
          (plugin.contracts?.speechProviders?.length ?? 0) > 0 ||
          (plugin.contracts?.realtimeTranscriptionProviders?.length ?? 0) > 0 ||
          (plugin.contracts?.realtimeVoiceProviders?.length ?? 0) > 0 ||
          (plugin.contracts?.mediaUnderstandingProviders?.length ?? 0) > 0 ||
          (plugin.contracts?.transcriptSourceProviders?.length ?? 0) > 0 ||
          (plugin.contracts?.documentExtractors?.length ?? 0) > 0 ||
          (plugin.contracts?.imageGenerationProviders?.length ?? 0) > 0 ||
          (plugin.contracts?.videoGenerationProviders?.length ?? 0) > 0 ||
          (plugin.contracts?.musicGenerationProviders?.length ?? 0) > 0 ||
          (plugin.contracts?.webContentExtractors?.length ?? 0) > 0 ||
          (plugin.contracts?.webFetchProviders?.length ?? 0) > 0 ||
          (plugin.contracts?.webSearchProviders?.length ?? 0) > 0 ||
          (plugin.contracts?.migrationProviders?.length ?? 0) > 0 ||
          (plugin.contracts?.tools?.length ?? 0) > 0),
    )
    .map((plugin) => ({
      pluginId: plugin.id,
      cliBackendIds: uniqueStrings(plugin.cliBackends),
      providerIds: uniqueStrings(plugin.providers),
      providerEnvVars: resolvePluginProviderEnvVars(plugin),
      workerProviderIds: uniqueStrings(plugin.contracts?.workerProviders ?? []),
      embeddingProviderIds: uniqueStrings(plugin.contracts?.embeddingProviders ?? []),
      speechProviderIds: uniqueStrings(plugin.contracts?.speechProviders ?? []),
      realtimeTranscriptionProviderIds: uniqueStrings(
        plugin.contracts?.realtimeTranscriptionProviders ?? [],
      ),
      realtimeVoiceProviderIds: uniqueStrings(plugin.contracts?.realtimeVoiceProviders ?? []),
      mediaUnderstandingProviderIds: uniqueStrings(
        plugin.contracts?.mediaUnderstandingProviders ?? [],
      ),
      transcriptSourceProviderIds: uniqueStrings(plugin.contracts?.transcriptSourceProviders ?? []),
      documentExtractorIds: uniqueStrings(plugin.contracts?.documentExtractors ?? []),
      imageGenerationProviderIds: uniqueStrings(plugin.contracts?.imageGenerationProviders ?? []),
      videoGenerationProviderIds: uniqueStrings(plugin.contracts?.videoGenerationProviders ?? []),
      musicGenerationProviderIds: uniqueStrings(plugin.contracts?.musicGenerationProviders ?? []),
      webContentExtractorIds: uniqueStrings(plugin.contracts?.webContentExtractors ?? []),
      webFetchProviderIds: uniqueStrings(plugin.contracts?.webFetchProviders ?? []),
      webSearchProviderIds: uniqueStrings(plugin.contracts?.webSearchProviders ?? []),
      migrationProviderIds: uniqueStrings(plugin.contracts?.migrationProviders ?? []),
      toolNames: uniqueStrings(plugin.contracts?.tools ?? []),
    }));
}
function resolveBundledProviderContractPluginIds() {
  return uniqueStrings(
    resolveBundledManifestContracts()
      .filter((entry) => entry.providerIds.length > 0)
      .map((entry) => entry.pluginId),
  ).toSorted((left, right) => left.localeCompare(right));
}
function formatBundledCapabilityPluginLoadError(params) {
  const plugin = params.registry.plugins.find((entry) => entry.id === params.pluginId);
  const diagnostics = params.registry.diagnostics
    .filter((entry) => entry.pluginId === params.pluginId)
    .map((entry) => entry.message);
  const detailParts = plugin
    ? [
        `status=${plugin.status}`,
        ...(plugin.error ? [`error=${plugin.error}`] : []),
        `providerIds=[${plugin.providerIds.join(", ")}]`,
        `webFetchProviderIds=[${plugin.webFetchProviderIds.join(", ")}]`,
        `webSearchProviderIds=[${plugin.webSearchProviderIds.join(", ")}]`,
      ]
    : ["plugin record missing"];
  if (diagnostics.length > 0) detailParts.push(`diagnostics=${diagnostics.join(" | ")}`);
  return /* @__PURE__ */ new Error(
    `bundled ${params.capabilityLabel} contract load failed for ${params.pluginId}: ${detailParts.join("; ")}`,
  );
}
function loadScopedCapabilityRuntimeRegistryEntries(params) {
  const discovery = discoverOpenClawPlugins({});
  let lastFailure;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const registry = loadBundledCapabilityRuntimeRegistry({
      pluginIds: [params.pluginId],
      pluginSdkResolution: "dist",
      discovery,
    });
    const entries = params.loadEntries(registry);
    if (entries.length > 0) return entries;
    const plugin = registry.plugins.find((entry) => entry.id === params.pluginId);
    lastFailure = formatBundledCapabilityPluginLoadError({
      pluginId: params.pluginId,
      capabilityLabel: params.capabilityLabel,
      registry,
    });
    if (
      !(
        attempt === 0 &&
        (!plugin || plugin.status !== "loaded" || params.loadDeclaredIds(plugin).length === 0)
      )
    )
      break;
  }
  throw (
    lastFailure ??
    /* @__PURE__ */ new Error(
      `bundled ${params.capabilityLabel} contract load failed for ${params.pluginId}: no entries`,
    )
  );
}
function loadProviderContractEntriesForPluginIds(pluginIds) {
  return pluginIds.flatMap((pluginId) => loadProviderContractEntriesForPluginId(pluginId));
}
function loadProviderContractEntriesForPluginId(pluginId) {
  const publicArtifactEntries = resolveBundledExplicitProviderContractsFromPublicArtifacts({
    onlyPluginIds: [pluginId],
  });
  if (publicArtifactEntries) return publicArtifactEntries;
  try {
    return loadScopedCapabilityRuntimeRegistryEntries({
      pluginId,
      capabilityLabel: "provider",
      loadEntries: (registry) =>
        registry.providers
          .filter((entry) => entry.pluginId === pluginId)
          .map((entry) => ({
            pluginId: entry.pluginId,
            provider: entry.provider,
          })),
      loadDeclaredIds: (plugin) => plugin.providerIds,
    }).map((entry) => ({
      pluginId: entry.pluginId,
      provider: entry.provider,
    }));
  } catch (error) {
    error instanceof Error || new Error(String(error));
    return [];
  }
}
function createLazyArrayView(load) {
  return new Proxy([], {
    get(_target, prop) {
      const actual = load();
      const value = Reflect.get(actual, prop, actual);
      return typeof value === "function" ? value.bind(actual) : value;
    },
    has(_target, prop) {
      return Reflect.has(load(), prop);
    },
    ownKeys() {
      return Reflect.ownKeys(load());
    },
    getOwnPropertyDescriptor(_target, prop) {
      const actual = load();
      const descriptor = Reflect.getOwnPropertyDescriptor(actual, prop);
      if (descriptor) return descriptor;
      if (Reflect.has(actual, prop))
        return {
          configurable: true,
          enumerable: true,
          writable: false,
          value: Reflect.get(actual, prop, actual),
        };
    },
  });
}
function resolveProviderContractPluginIdsForProviderAlias(providerId) {
  const normalizedProvider = normalizeProviderId(providerId);
  if (!normalizedProvider) return;
  const pluginIds = uniqueStrings(
    loadProviderContractEntriesForPluginIds(resolveBundledProviderContractPluginIds())
      .filter((entry) => {
        return [
          entry.provider.id,
          ...(entry.provider.aliases ?? []),
          ...(entry.provider.hookAliases ?? []),
        ].some((candidate) => normalizeProviderId(candidate) === normalizedProvider);
      })
      .map((entry) => entry.pluginId),
  ).toSorted((left, right) => left.localeCompare(right));
  return pluginIds.length > 0 ? pluginIds : void 0;
}
function loadPluginRegistrationContractRegistry() {
  return resolveBundledManifestContracts();
}
createLazyArrayView(loadPluginRegistrationContractRegistry);
//#endregion
export { resolveProviderContractPluginIdsForProviderAlias };
