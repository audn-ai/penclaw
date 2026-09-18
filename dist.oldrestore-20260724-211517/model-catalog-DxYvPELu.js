import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { s as resolveDefaultAgentDir } from "./agent-scope-config-DVIR1nBa.js";
import { r as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-DGhQ40qh.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import "./agent-scope-y9xQv_q1.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import {
  n as isManifestPluginAvailableForControlPlane,
  s as loadManifestMetadataSnapshot,
} from "./manifest-contract-eligibility-3WxfNDRv.js";
import { t as planManifestModelCatalogRows } from "./manifest-planner-DSmSdykb.js";
import {
  i as writeCachedAgentModelCatalog,
  r as readCachedAgentModelCatalogSnapshot,
  t as buildAgentModelCatalogCacheKey,
} from "./model-catalog-state-cache-GF_Tt_1I.js";
import { n as resolveModelWorkspaceDir } from "./model-discovery-context-B688uj_v.js";
import { t as modelKey } from "./model-key-BaNhQShd.js";
import { n as normalizeConfiguredProviderCatalogModelId } from "./model-ref-shared-Bs7ONe2Q.js";
import {
  c as hasConfiguredProviderModelRows,
  r as buildConfiguredModelCatalog,
  w as modelSupportsInput,
} from "./model-selection-shared-BliwFXJy.js";
import {
  i as prepareOpenClawModelsJsonSource,
  t as buildModelsJsonSourceFingerprint,
} from "./models-config-GFqrAsQr.js";
import "./config-BDv-QbJ6.js";
import { a as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BMgImu0m.js";
import {
  i as filterGeneratedPluginModelCatalogProviders,
  s as listPluginModelCatalogFiles,
} from "./plugin-model-catalog-BJCkxvM0.js";
import "./auth-profiles-CX7JDmZ9.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import { t as augmentModelCatalogWithProviderPlugins } from "./provider-runtime.runtime.js";
import { a as resolveClaudeFable5ModelIdentity } from "./src-Dcc_hMY6.js";
import { o as ensureAuthProfileStoreWithoutExternalProfiles } from "./store-B7DoDdVM.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region src/agents/model-catalog.ts
/**
 * Loads bundled, manifest, and discovered model catalog entries.
 */
const log = createSubsystemLogger("model-catalog");
const AGENT_CUSTOM_MODEL_DEFAULT_CONTEXT_WINDOW = 128e3;
let modelCatalogPromise = null;
let loadedModelCatalogSnapshot;
let loadedModelCatalogGeneration = -1;
let modelCatalogGeneration = 0;
let hasLoggedModelCatalogError = false;
let hasLoggedReadOnlyStaticCatalogError = false;
let manifestModelCatalogCache = /* @__PURE__ */ new WeakMap();
function buildLoadModelCatalogStateCacheKey(params) {
  return buildAgentModelCatalogCacheKey({
    agentDir: params.agentDir,
    cacheScope: {
      source: "load-model-catalog",
      sourceFingerprint: params.sourceFingerprint,
    },
    config: params.config,
    metadataSnapshot: params.metadataSnapshot,
    workspaceDir: params.workspaceDir,
  });
}
const defaultImportAgentDiscovery = () => import("./agent-model-discovery-BvUHT6x9.js");
let importAgentDiscovery = defaultImportAgentDiscovery;
const modelSuppressionLoader = createLazyImportLoader(
  () => import("./model-suppression.runtime.js"),
);
const providerApiKeyResolverLoader = createLazyImportLoader(
  () => import("./models-config.providers.secrets-D0cFVNdy.js"),
);
function shouldLogModelCatalogTiming() {
  return process.env.OPENCLAW_DEBUG_INGRESS_TIMING === "1";
}
function loadModelSuppression() {
  return modelSuppressionLoader.load();
}
function loadProviderApiKeyResolver() {
  return providerApiKeyResolverLoader.load();
}
function resetModelCatalogCache() {
  modelCatalogPromise = null;
  modelCatalogGeneration += 1;
  manifestModelCatalogCache = /* @__PURE__ */ new WeakMap();
  hasLoggedModelCatalogError = false;
  hasLoggedReadOnlyStaticCatalogError = false;
}
function resetModelCatalogCacheForTest() {
  resetModelCatalogCache();
  loadedModelCatalogSnapshot = void 0;
  loadedModelCatalogGeneration = -1;
  importAgentDiscovery = defaultImportAgentDiscovery;
}
function setModelCatalogImportForTest(loader) {
  importAgentDiscovery = loader ?? defaultImportAgentDiscovery;
}
function catalogEntryDedupeKey(provider, id) {
  return normalizeLowercaseStringOrEmpty(modelKey(normalizeProviderId(provider), id));
}
function mergeCatalogCompat(base, override) {
  if (!base) return override;
  if (!override) return base;
  return {
    ...base,
    ...override,
  };
}
function mergeCatalogParams(base, override) {
  if (!base) return override;
  if (!override) return base;
  return {
    ...base,
    ...override,
  };
}
function normalizeCatalogRouteBaseUrl(value) {
  if (!value) return;
  try {
    const url = new URL(value);
    url.pathname = url.pathname.replace(/\/+$/u, "") || "/";
    return url.toString();
  } catch {
    return value.replace(/\/+$/u, "");
  }
}
function catalogRouteChanges(base, overlay) {
  if (overlay.api === void 0 && overlay.baseUrl === void 0) return false;
  return (
    (overlay.api !== void 0 && base.api !== void 0 && overlay.api !== base.api) ||
    (overlay.baseUrl !== void 0 &&
      base.baseUrl !== void 0 &&
      normalizeCatalogRouteBaseUrl(overlay.baseUrl) !== normalizeCatalogRouteBaseUrl(base.baseUrl))
  );
}
function clearRouteBoundCatalogMetadata(entry) {
  const {
    contextWindow: _contextWindow,
    contextTokens: _contextTokens,
    reasoning: _reasoning,
    input: _input,
    params: _params,
    compat: _compat,
    mediaInput: _mediaInput,
    ...routeNeutral
  } = entry;
  return routeNeutral;
}
function overlayCatalogMetadata(base, overlay, options) {
  const routeChanged = catalogRouteChanges(base, overlay);
  const routeBase = routeChanged ? clearRouteBoundCatalogMetadata(base) : base;
  const params = mergeCatalogParams(routeBase.params, overlay.params);
  return {
    ...routeBase,
    ...(routeChanged && !options?.preserveBaseName ? { name: overlay.name } : {}),
    ...(overlay.api !== void 0 ? { api: overlay.api } : {}),
    ...(overlay.baseUrl !== void 0 ? { baseUrl: overlay.baseUrl } : {}),
    ...(overlay.contextWindow !== void 0 ? { contextWindow: overlay.contextWindow } : {}),
    ...(overlay.contextTokens !== void 0 ? { contextTokens: overlay.contextTokens } : {}),
    ...(overlay.reasoning !== void 0 ? { reasoning: overlay.reasoning } : {}),
    ...(overlay.input !== void 0 ? { input: overlay.input } : {}),
    ...(params ? { params } : {}),
    ...(overlay.mediaInput !== void 0 ? { mediaInput: overlay.mediaInput } : {}),
    compat: mergeCatalogCompat(routeBase.compat, overlay.compat),
  };
}
function normalizeCatalogEntryContract(entry) {
  if (
    entry.api === "anthropic-messages" &&
    resolveClaudeFable5ModelIdentity({
      id: entry.id,
      params: entry.params,
    })
  )
    return {
      ...entry,
      reasoning: true,
    };
  return entry;
}
function mergeCatalogEntries(models, entries, options) {
  const indexByKey = new Map(
    models.map((entry, index) => [catalogEntryDedupeKey(entry.provider, entry.id), index]),
  );
  for (const entry of entries) {
    const key = catalogEntryDedupeKey(entry.provider, entry.id);
    const existingIndex = indexByKey.get(key);
    if (existingIndex === void 0) {
      models.push(entry);
      indexByKey.set(key, models.length - 1);
      continue;
    }
    const existing = models.at(existingIndex);
    if (existing) models[existingIndex] = overlayCatalogMetadata(existing, entry, options);
  }
}
function catalogRouteVariantKey(entry) {
  return [
    catalogEntryDedupeKey(entry.provider, entry.id),
    entry.api ?? "",
    normalizeCatalogRouteBaseUrl(entry.baseUrl) ?? "",
  ].join("\0");
}
function createModelCatalogRouteVariantCollector() {
  return {
    entries: [],
    indexByKey: /* @__PURE__ */ new Map(),
  };
}
function mergeCatalogRouteVariants(collector, entries) {
  for (const entry of entries) {
    const key = catalogRouteVariantKey(entry);
    const existingIndex = collector.indexByKey.get(key);
    if (existingIndex === void 0) {
      collector.entries.push(entry);
      collector.indexByKey.set(key, collector.entries.length - 1);
      continue;
    }
    const existingEntry = collector.entries[existingIndex];
    if (existingEntry === void 0) continue;
    collector.entries[existingIndex] = overlayCatalogMetadata(existingEntry, entry);
  }
}
function createModelCatalogSnapshot(entries, routeVariants) {
  return {
    entries: sortModelCatalogEntries(entries),
    routeVariants: sortModelCatalogEntries(routeVariants.entries),
  };
}
function loadManifestModelCatalog(params) {
  const resolvedSnapshot =
    params.metadataSnapshot ??
    (params.fallbackToMetadataScan === false
      ? getCurrentPluginMetadataSnapshot({
          config: params.config,
          env: params.env,
          ...(params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {}),
          ...(params.workspaceDir === void 0 ? { allowWorkspaceScopedSnapshot: true } : {}),
        })
      : resolvePluginMetadataSnapshot({
          config: params.config,
          ...(params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {}),
          env: params.env ?? process.env,
          allowWorkspaceScopedCurrent: params.workspaceDir === void 0,
        }));
  if (!resolvedSnapshot) return [];
  const cached = manifestModelCatalogCache.get(params.config);
  if (cached?.snapshot === resolvedSnapshot) return cached.rows;
  const rows = planManifestModelCatalogRows({
    registry: {
      plugins: resolvedSnapshot.plugins.filter(
        (plugin) =>
          plugin.modelCatalog &&
          isManifestPluginAvailableForControlPlane({
            snapshot: resolvedSnapshot,
            plugin,
            config: params.config,
          }),
      ),
    },
  }).rows.map((row) => {
    const entry = {
      id: row.id,
      name: row.name,
      provider: row.provider,
      api: row.api,
    };
    if (row.baseUrl) entry.baseUrl = row.baseUrl;
    const contextWindow = row.contextWindow ?? row.contextTokens;
    if (contextWindow) entry.contextWindow = contextWindow;
    if (row.contextTokens) entry.contextTokens = row.contextTokens;
    if (typeof row.reasoning === "boolean") entry.reasoning = row.reasoning;
    if (row.input?.length) entry.input = [...row.input];
    if (row.compat) entry.compat = row.compat;
    return entry;
  });
  manifestModelCatalogCache.set(params.config, {
    snapshot: resolvedSnapshot,
    rows,
  });
  return rows;
}
function sortModelCatalogEntries(entries) {
  return entries.map(normalizeCatalogEntryContract).toSorted((a, b) => {
    const p = a.provider.localeCompare(b.provider);
    if (p !== 0) return p;
    return a.name.localeCompare(b.name);
  });
}
function normalizePersistedModelCatalogEntry(providerRaw, entry, defaults, options = {}) {
  const rawId = normalizeOptionalString(entry.id) ?? "";
  if (!rawId) return;
  const provider = normalizeProviderId(providerRaw);
  if (!provider) return;
  const id = normalizeConfiguredProviderCatalogModelId(provider, rawId, options);
  const name = normalizeOptionalString(entry.name ?? id) || id;
  const contextWindow =
    typeof entry?.contextWindow === "number" && entry.contextWindow > 0
      ? entry.contextWindow
      : defaults?.contextWindow !== void 0
        ? defaults.contextWindow
        : AGENT_CUSTOM_MODEL_DEFAULT_CONTEXT_WINDOW;
  const contextTokens =
    typeof entry?.contextTokens === "number" && entry.contextTokens > 0
      ? entry.contextTokens
      : defaults?.contextTokens !== void 0
        ? defaults.contextTokens
        : void 0;
  const reasoning = typeof entry?.reasoning === "boolean" ? entry.reasoning : false;
  const api = typeof entry?.api === "string" ? entry.api : defaults?.api;
  const baseUrl = normalizeOptionalString(entry?.baseUrl) ?? defaults?.baseUrl;
  const parsedInput = Array.isArray(entry?.input)
    ? entry.input.filter((value) =>
        ["text", "image", "audio", "video", "document"].includes(String(value)),
      )
    : void 0;
  const input = parsedInput?.length ? parsedInput : ["text"];
  const compat = entry?.compat && typeof entry.compat === "object" ? entry.compat : void 0;
  const modelParams = entry?.params && typeof entry.params === "object" ? entry.params : void 0;
  return {
    id,
    name,
    provider,
    ...(api ? { api } : {}),
    ...(baseUrl ? { baseUrl } : {}),
    contextWindow,
    ...(contextTokens !== void 0 ? { contextTokens } : {}),
    reasoning,
    input,
    ...(modelParams ? { params: modelParams } : {}),
    compat,
  };
}
function readProviderCatalogRows(parsed) {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
  const providers = parsed.providers;
  return providers && typeof providers === "object" && !Array.isArray(providers) ? providers : {};
}
async function loadReadOnlyPersistedProviderRows(agentDir, getPluginMetadataSnapshot) {
  const raw = await readFile(join(agentDir, "models.json"), "utf8");
  const providers = { ...readProviderCatalogRows(JSON.parse(raw)) };
  for (const catalogFile of listPluginModelCatalogFiles(agentDir)) {
    const catalogRaw = await readFile(catalogFile.path, "utf8").catch(() => void 0);
    if (!catalogRaw) continue;
    let parsed;
    try {
      parsed = JSON.parse(catalogRaw);
    } catch {
      continue;
    }
    Object.assign(
      providers,
      filterGeneratedPluginModelCatalogProviders({
        catalogPluginId: catalogFile.pluginId,
        parsedCatalog: parsed,
        pluginMetadataSnapshot: getPluginMetadataSnapshot(),
        providers: readProviderCatalogRows(parsed),
      }),
    );
  }
  return providers;
}
async function loadReadOnlyPersistedModelCatalog(params) {
  const cfg = params?.config ?? getRuntimeConfig();
  const agentDir = resolveDefaultAgentDir(cfg);
  const workspaceDir = resolveModelWorkspaceDir(cfg, void 0);
  const models = [];
  const routeVariants = createModelCatalogRouteVariantCollector();
  const { buildShouldSuppressBuiltInModel } = await loadModelSuppression();
  const shouldSuppressBuiltInModel = buildShouldSuppressBuiltInModel({ config: cfg });
  let metadataSnapshot = params?.metadataSnapshot;
  const getMetadataSnapshot = () => {
    metadataSnapshot ??= loadManifestMetadataSnapshot({
      config: cfg,
      env: process.env,
      workspaceDir,
    });
    return metadataSnapshot;
  };
  let manifestPlugins;
  const getManifestPlugins = () => {
    manifestPlugins ??= getMetadataSnapshot().plugins;
    return manifestPlugins;
  };
  const providers = await loadReadOnlyPersistedProviderRows(agentDir, getMetadataSnapshot);
  for (const [providerRaw, providerConfig] of Object.entries(providers)) {
    if (!Array.isArray(providerConfig?.models)) continue;
    const providerContextWindow =
      typeof providerConfig?.contextWindow === "number" && providerConfig.contextWindow > 0
        ? providerConfig.contextWindow
        : void 0;
    const providerContextTokens =
      typeof providerConfig?.contextTokens === "number" && providerConfig.contextTokens > 0
        ? providerConfig.contextTokens
        : void 0;
    const providerApi = typeof providerConfig?.api === "string" ? providerConfig.api : void 0;
    const providerBaseUrl = normalizeOptionalString(providerConfig?.baseUrl);
    for (const entry of providerConfig.models) {
      const normalized = normalizePersistedModelCatalogEntry(
        providerRaw,
        entry,
        {
          api: providerApi,
          baseUrl: providerBaseUrl,
          contextWindow: providerContextWindow,
          contextTokens: providerContextTokens,
        },
        { manifestPlugins: getManifestPlugins() },
      );
      if (normalized && !shouldSuppressBuiltInModel(normalized)) {
        models.push(normalized);
        mergeCatalogRouteVariants(routeVariants, [normalized]);
      }
    }
  }
  if (models.length === 0) throw new Error("persisted model catalog has no usable model rows");
  try {
    const manifestModels = loadManifestModelCatalog({
      config: cfg,
      env: process.env,
      fallbackToMetadataScan: false,
      metadataSnapshot: getMetadataSnapshot(),
    });
    mergeCatalogRouteVariants(routeVariants, manifestModels);
    mergeCatalogEntries(models, manifestModels);
  } catch {}
  const configuredModels = buildConfiguredModelCatalog({
    cfg,
    manifestPlugins: hasConfiguredProviderModelRows(cfg) ? getManifestPlugins() : void 0,
  });
  if (configuredModels.length > 0) {
    mergeCatalogRouteVariants(routeVariants, configuredModels);
    mergeCatalogEntries(models, configuredModels, { preserveBaseName: true });
  }
  return createModelCatalogSnapshot(models, routeVariants);
}
function hasConfiguredProviderRowsNeedingManifestLookup(cfg) {
  const providers = cfg.models?.providers;
  if (!providers || typeof providers !== "object") return false;
  return Object.entries(providers).some(
    ([providerRaw, provider]) =>
      Array.isArray(provider?.models) && normalizeProviderId(providerRaw) !== "openai",
  );
}
function loadReadOnlyStaticModelCatalog(params) {
  const cfg = params?.config ?? getRuntimeConfig();
  const models = [];
  const routeVariants = createModelCatalogRouteVariantCollector();
  try {
    const manifestModels = loadManifestModelCatalog({
      config: cfg,
      env: process.env,
      fallbackToMetadataScan: false,
      metadataSnapshot: params?.metadataSnapshot,
    });
    mergeCatalogRouteVariants(routeVariants, manifestModels);
    mergeCatalogEntries(models, manifestModels);
  } catch (error) {
    if (!hasLoggedReadOnlyStaticCatalogError) {
      hasLoggedReadOnlyStaticCatalogError = true;
      log.warn(`Failed to load read-only manifest model catalog: ${String(error)}`);
    }
  }
  const configuredModels = buildConfiguredModelCatalog({
    cfg,
    manifestPlugins: hasConfiguredProviderRowsNeedingManifestLookup(cfg)
      ? (params?.metadataSnapshot?.plugins ??
        resolvePluginMetadataSnapshot({
          config: cfg,
          env: process.env,
          allowWorkspaceScopedCurrent: true,
        }).plugins)
      : [],
  });
  if (configuredModels.length > 0) {
    mergeCatalogRouteVariants(routeVariants, configuredModels);
    mergeCatalogEntries(models, configuredModels, { preserveBaseName: true });
  }
  return createModelCatalogSnapshot(models, routeVariants);
}
/** Loads logical entries together with browse-only physical route provenance. */
async function loadModelCatalogSnapshot(params) {
  if (params?.cacheOnly === true)
    return loadedModelCatalogGeneration === modelCatalogGeneration
      ? (loadedModelCatalogSnapshot ?? {
          entries: [],
          routeVariants: [],
        })
      : {
          entries: [],
          routeVariants: [],
        };
  const readOnly = params?.readOnly === true;
  if (readOnly)
    try {
      return await loadReadOnlyPersistedModelCatalog(params);
    } catch {
      return loadReadOnlyStaticModelCatalog(params);
    }
  if (!readOnly && params?.useCache === false) {
    modelCatalogPromise = null;
    modelCatalogGeneration += 1;
  }
  const useSharedCache = !readOnly && !params?.metadataSnapshot;
  if (useSharedCache && modelCatalogPromise) return modelCatalogPromise;
  const loadCatalog = async () => {
    const models = [];
    const routeVariants = createModelCatalogRouteVariantCollector();
    const timingEnabled = shouldLogModelCatalogTiming();
    const startMs = timingEnabled ? Date.now() : 0;
    const logStage = (stage, extra) => {
      if (!timingEnabled) return;
      const suffix = extra ? ` ${extra}` : "";
      log.info(`model-catalog stage=${stage} elapsedMs=${Date.now() - startMs}${suffix}`);
    };
    try {
      const cfg = params?.config ?? getRuntimeConfig();
      const workspaceDir = params?.workspaceDir ?? resolveModelWorkspaceDir(cfg, void 0);
      let manifestMetadataSnapshot;
      let manifestPlugins;
      const getManifestMetadataSnapshot = () => {
        manifestMetadataSnapshot ??=
          params?.metadataSnapshot ??
          loadManifestMetadataSnapshot({
            config: cfg,
            env: process.env,
            workspaceDir,
          });
        return manifestMetadataSnapshot;
      };
      const getManifestPlugins = () => {
        manifestPlugins ??= getManifestMetadataSnapshot().plugins;
        return manifestPlugins;
      };
      const agentDir = params?.agentDir ?? resolveDefaultAgentDir(cfg);
      const sourceFingerprint = await buildModelsJsonSourceFingerprint(cfg, agentDir, {
        pluginMetadataSnapshot: params?.metadataSnapshot,
        workspaceDir,
      });
      let catalogKey = buildLoadModelCatalogStateCacheKey({
        agentDir,
        config: cfg,
        metadataSnapshot: params?.metadataSnapshot,
        sourceFingerprint: sourceFingerprint.fingerprint,
        workspaceDir,
      });
      if (!readOnly && params?.useCache !== false) {
        const cachedSnapshot = readCachedAgentModelCatalogSnapshot({
          agentDir,
          catalogKey,
        });
        if (cachedSnapshot?.entries.length) {
          logStage("state-cache-hit", `entries=${cachedSnapshot.entries.length}`);
          return cachedSnapshot;
        }
      }
      if (!readOnly) {
        const preparedSource = await prepareOpenClawModelsJsonSource(cfg, agentDir, {
          pluginMetadataSnapshot: params?.metadataSnapshot,
          workspaceDir,
        });
        const preparedCatalogKey = buildLoadModelCatalogStateCacheKey({
          agentDir,
          config: cfg,
          metadataSnapshot: params?.metadataSnapshot,
          sourceFingerprint: preparedSource.fingerprint,
          workspaceDir: preparedSource.workspaceDir ?? workspaceDir,
        });
        logStage("models-json-ready");
        if (preparedCatalogKey !== catalogKey) {
          catalogKey = preparedCatalogKey;
          if (params?.useCache !== false) {
            const cachedSnapshot = readCachedAgentModelCatalogSnapshot({
              agentDir,
              catalogKey,
            });
            if (cachedSnapshot?.entries.length) {
              logStage("state-cache-hit", `entries=${cachedSnapshot.entries.length}`);
              return cachedSnapshot;
            }
          }
        }
      }
      const agentDiscovery = await importAgentDiscovery();
      logStage("agent-discovery-imported");
      const { buildShouldSuppressBuiltInModel } = await loadModelSuppression();
      logStage("catalog-deps-ready");
      const authStorage = agentDiscovery.discoverAuthStorage(
        agentDir,
        readOnly ? { readOnly: true } : void 0,
      );
      logStage("auth-storage-ready");
      const registry = agentDiscovery.discoverModels(authStorage, agentDir, {
        config: cfg,
        pluginMetadataSnapshot: getManifestMetadataSnapshot(),
        workspaceDir,
      });
      logStage("registry-ready");
      const entries = registry.getAll();
      logStage("registry-read", `entries=${entries.length}`);
      const shouldSuppressBuiltInModel = buildShouldSuppressBuiltInModel({ config: cfg });
      logStage("suppress-resolver-ready");
      for (const entry of entries) {
        const rawId = normalizeOptionalString(entry?.id) ?? "";
        if (!rawId) continue;
        const provider = normalizeOptionalString(entry?.provider) ?? "";
        if (!provider) continue;
        const id = normalizeConfiguredProviderCatalogModelId(provider, rawId, {
          manifestPlugins: getManifestPlugins(),
        });
        const baseUrl = normalizeOptionalString(entry?.baseUrl);
        if (
          shouldSuppressBuiltInModel({
            provider,
            id,
            baseUrl,
          })
        )
          continue;
        const name = normalizeOptionalString(entry?.name ?? id) || id;
        const contextWindow =
          typeof entry?.contextWindow === "number" && entry.contextWindow > 0
            ? entry.contextWindow
            : void 0;
        const contextTokens =
          typeof entry?.contextTokens === "number" && entry.contextTokens > 0
            ? entry.contextTokens
            : void 0;
        const reasoning = typeof entry?.reasoning === "boolean" ? entry.reasoning : void 0;
        const api = typeof entry?.api === "string" ? entry.api : void 0;
        const input = Array.isArray(entry?.input) ? entry.input : void 0;
        const modelParams =
          entry?.params && typeof entry.params === "object" ? entry.params : void 0;
        const compat = entry?.compat && typeof entry.compat === "object" ? entry.compat : void 0;
        const model = {
          id,
          name,
          provider,
          ...(api ? { api } : {}),
          ...(baseUrl ? { baseUrl } : {}),
          contextWindow,
          ...(contextTokens !== void 0 ? { contextTokens } : {}),
          reasoning,
          input,
          ...(modelParams ? { params: modelParams } : {}),
          compat,
        };
        models.push(model);
        mergeCatalogRouteVariants(routeVariants, [model]);
      }
      const manifestModels = loadManifestModelCatalog({
        config: cfg,
        env: process.env,
        metadataSnapshot: getManifestMetadataSnapshot(),
      });
      mergeCatalogRouteVariants(routeVariants, manifestModels);
      mergeCatalogEntries(models, manifestModels);
      logStage("manifest-models-merged", `entries=${models.length}`);
      const configuredModels = buildConfiguredModelCatalog({
        cfg,
        manifestPlugins: hasConfiguredProviderModelRows(cfg) ? getManifestPlugins() : void 0,
      });
      let augmentEntries;
      if (configuredModels.length > 0) {
        const entriesForAugment = [...models];
        mergeCatalogEntries(entriesForAugment, configuredModels, { preserveBaseName: true });
        augmentEntries = entriesForAugment;
      }
      logStage("configured-models-prepared", `entries=${models.length}`);
      if (!readOnly) {
        const { createProviderApiKeyResolver } = await loadProviderApiKeyResolver();
        let authStore;
        const resolveProviderApiKeyForProvider = createProviderApiKeyResolver(
          process.env,
          () =>
            (authStore ??= ensureAuthProfileStoreWithoutExternalProfiles(agentDir, {
              allowKeychainPrompt: false,
            })),
          cfg,
        );
        const resolveProviderApiKey = (providerId) =>
          providerId?.trim()
            ? resolveProviderApiKeyForProvider(providerId)
            : {
                apiKey: void 0,
                discoveryApiKey: void 0,
              };
        const supplemental = await augmentModelCatalogWithProviderPlugins({
          config: cfg,
          workspaceDir,
          env: process.env,
          context: {
            config: cfg,
            agentDir,
            workspaceDir,
            env: process.env,
            resolveProviderApiKey,
            entries: augmentEntries ?? [...models],
          },
        });
        if (supplemental.length > 0) {
          const normalizedSupplemental = [];
          for (const entry of supplemental)
            normalizedSupplemental.push({
              ...entry,
              id: normalizeConfiguredProviderCatalogModelId(entry.provider, entry.id, {
                manifestPlugins: getManifestPlugins(),
              }),
            });
          mergeCatalogRouteVariants(routeVariants, normalizedSupplemental);
          mergeCatalogEntries(models, normalizedSupplemental);
        }
      }
      logStage("plugin-models-merged", `entries=${models.length}`);
      if (configuredModels.length > 0) {
        mergeCatalogRouteVariants(routeVariants, configuredModels);
        mergeCatalogEntries(models, configuredModels, { preserveBaseName: true });
      }
      logStage("configured-models-finalized", `entries=${models.length}`);
      if (models.length === 0) {
        if (useSharedCache) modelCatalogPromise = null;
      }
      const snapshot = createModelCatalogSnapshot(models, routeVariants);
      if (!readOnly)
        writeCachedAgentModelCatalog({
          agentDir,
          catalogKey,
          entries: snapshot.entries,
          routeVariants: snapshot.routeVariants,
        });
      logStage("complete", `entries=${snapshot.entries.length}`);
      return snapshot;
    } catch (error) {
      if (!hasLoggedModelCatalogError) {
        hasLoggedModelCatalogError = true;
        log.warn(`Failed to load model catalog: ${String(error)}`);
      }
      if (useSharedCache) modelCatalogPromise = null;
      if (models.length > 0) return createModelCatalogSnapshot(models, routeVariants);
      return {
        entries: [],
        routeVariants: [],
      };
    }
  };
  if (readOnly || params?.metadataSnapshot) return loadCatalog();
  const loadGeneration = modelCatalogGeneration;
  const publishedPromise = loadCatalog().then((snapshot) => {
    if (
      snapshot.entries.length > 0 &&
      modelCatalogGeneration === loadGeneration &&
      modelCatalogPromise === publishedPromise
    ) {
      loadedModelCatalogSnapshot = snapshot;
      loadedModelCatalogGeneration = loadGeneration;
    }
    return snapshot;
  });
  modelCatalogPromise = publishedPromise;
  return publishedPromise;
}
/** Loads the deduplicated logical catalog for runtime and legacy consumers. */
async function loadModelCatalog(params) {
  return (await loadModelCatalogSnapshot(params)).entries;
}
/**
 * Check if a model supports image input based on its catalog entry.
 */
function modelSupportsVision(entry) {
  return modelSupportsInput(entry, "image");
}
/**
 * Check if a model supports native document/PDF input based on its catalog entry.
 */
function modelSupportsDocument(entry) {
  return modelSupportsInput(entry, "document");
}
//#endregion
export {
  modelSupportsVision as a,
  setModelCatalogImportForTest as c,
  modelSupportsDocument as i,
  loadModelCatalog as n,
  resetModelCatalogCache as o,
  loadModelCatalogSnapshot as r,
  resetModelCatalogCacheForTest as s,
  loadManifestModelCatalog as t,
};
