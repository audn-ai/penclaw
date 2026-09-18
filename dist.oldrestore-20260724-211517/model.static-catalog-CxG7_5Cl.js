import { c as normalizePluginsConfig } from "./config-state-C1Qyxaws.js";
import { r as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-DGhQ40qh.js";
import { n as normalizeGoogleApiBaseUrl } from "./google-api-base-url-UBNiBOzj.js";
import { i as loadPluginManifest } from "./manifest-DnFAzqZi.js";
import { i as passesManifestOwnerBasePolicy } from "./manifest-owner-policy-Bl1TJHcS.js";
import { t as planManifestModelCatalogRows } from "./manifest-planner-DSmSdykb.js";
import { t as loadPluginManifestRegistry } from "./manifest-registry-CXy9BBfE.js";
import { p as isSecretRefHeaderValueMarker } from "./model-auth-markers-CA2Xy59Z.js";
import "./defaults-CdX9UGcX.js";
import { r as normalizeStaticProviderModelId } from "./model-ref-shared-Bs7ONe2Q.js";
import { a as listOpenClawPluginManifestMetadata } from "./provider-attribution-CdW1rMjo.js";
import {
  i as resolveRuntimePluginDiscoveryProviders,
  n as normalizePluginDiscoveryResult,
  o as runProviderStaticCatalog,
} from "./provider-discovery-ag_BJ05f.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import { t as attachModelProviderLocalService } from "./provider-local-service-DLgcYp6u.js";
import {
  n as attachModelProviderRequestTransport,
  s as resolveProviderRequestConfig,
  u as sanitizeConfiguredModelProviderRequest,
} from "./provider-request-config-DpW-uV6A.js";
import {
  f as resolveOwningPluginIdsForProviderRef,
  n as resolveBundledProviderCompatPluginIds,
  t as resolveActivatableProviderOwnerPluginIds,
} from "./providers-D0H29WPB.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region src/agents/embedded-agent-runner/model.inline-provider.ts
/**
 * Converts inline provider model config into runtime model definitions.
 */
/** Returns a supported transport API id from raw config values. */
function normalizeResolvedTransportApi(api) {
  switch (api) {
    case "anthropic-messages":
    case "bedrock-converse-stream":
    case "github-copilot":
    case "google-generative-ai":
    case "google-vertex":
    case "ollama":
    case "openai-chatgpt-responses":
    case "openai-completions":
    case "openai-responses":
    case "azure-openai-responses":
      return api;
    default:
      return;
  }
}
/** Sanitizes configured provider/model headers before they enter runtime model metadata. */
function sanitizeModelHeaders(headers, opts) {
  if (!headers || typeof headers !== "object" || Array.isArray(headers)) return;
  const next = {};
  for (const [headerName, headerValue] of Object.entries(headers)) {
    if (typeof headerValue !== "string") continue;
    if (opts?.stripSecretRefMarkers && isSecretRefHeaderValueMarker(headerValue)) continue;
    next[headerName] = headerValue;
  }
  return Object.keys(next).length > 0 ? next : void 0;
}
function isLegacyFoundryVisionModelCandidate(params) {
  if (normalizeOptionalLowercaseString(params.provider) !== "microsoft-foundry") return false;
  return [params.modelId, params.modelName]
    .filter((value) => typeof value === "string")
    .map((value) => normalizeOptionalLowercaseString(value))
    .filter((value) => Boolean(value))
    .some(
      (candidate) =>
        candidate.startsWith("gpt-") ||
        candidate.startsWith("o1") ||
        candidate.startsWith("o3") ||
        candidate.startsWith("o4") ||
        candidate === "computer-use-preview",
    );
}
/** Resolves model input modalities with Foundry legacy vision-model compatibility. */
function resolveProviderModelInput(params) {
  const resolvedInput = Array.isArray(params.input) ? params.input : params.fallbackInput;
  const normalizedInput = Array.isArray(resolvedInput)
    ? resolvedInput.filter((item) => item === "text" || item === "image")
    : [];
  if (
    normalizedInput.length > 0 &&
    !normalizedInput.includes("image") &&
    isLegacyFoundryVisionModelCandidate(params)
  )
    return ["text", "image"];
  return normalizedInput.length > 0 ? normalizedInput : ["text"];
}
function resolveInlineProviderTransport(params) {
  const api = normalizeResolvedTransportApi(params.api);
  return {
    api,
    baseUrl:
      api === "google-generative-ai" ? normalizeGoogleApiBaseUrl(params.baseUrl) : params.baseUrl,
  };
}
/** Builds runtime model records from inline provider config, inheriting provider-level defaults. */
function buildInlineProviderModels(providers) {
  return Object.entries(providers).flatMap(([providerId, entry]) => {
    const trimmed = providerId.trim();
    if (!trimmed) return [];
    const providerHeaders = sanitizeModelHeaders(entry?.headers, { stripSecretRefMarkers: true });
    const providerRequest = sanitizeConfiguredModelProviderRequest(entry?.request);
    return (entry?.models ?? []).map((model) => {
      const transport = resolveInlineProviderTransport({
        api: model.api ?? entry?.api,
        baseUrl: model.baseUrl ?? entry?.baseUrl,
      });
      const modelHeaders = sanitizeModelHeaders(model.headers, { stripSecretRefMarkers: true });
      const requestConfig = resolveProviderRequestConfig({
        provider: trimmed,
        api: transport.api ?? model.api,
        baseUrl: transport.baseUrl,
        providerHeaders,
        modelHeaders,
        authHeader: entry?.authHeader,
        request: providerRequest,
        capability: "llm",
        transport: "stream",
      });
      return attachModelProviderLocalService(
        attachModelProviderRequestTransport(
          {
            ...model,
            contextWindow: model.contextWindow ?? entry?.contextWindow,
            contextTokens: model.contextTokens ?? entry?.contextTokens,
            maxTokens: model.maxTokens ?? entry?.maxTokens,
            input: resolveProviderModelInput({
              provider: trimmed,
              modelId: model.id,
              modelName: model.name,
              input: model.input,
            }),
            provider: trimmed,
            baseUrl: requestConfig.baseUrl ?? transport.baseUrl,
            api: requestConfig.api ?? model.api,
            headers: requestConfig.headers,
          },
          providerRequest,
        ),
        entry?.localService,
      );
    });
  });
}
//#endregion
//#region src/agents/embedded-agent-runner/model.static-catalog.ts
/**
 * Resolves bundled plugin static model-catalog rows into runtime model records.
 */
function rowMatchesModel(params) {
  return staticModelIdMatches({
    candidateId: params.row.id,
    provider: params.provider,
    modelId: params.modelId,
    rowProvider: params.row.provider,
  });
}
function staticModelIdMatches(params) {
  const normalizedProvider = normalizeProviderId(params.provider);
  if (params.rowProvider && normalizeProviderId(params.rowProvider) !== normalizedProvider)
    return false;
  return (
    normalizeStaticProviderModelId(normalizedProvider, params.candidateId).trim().toLowerCase() ===
    normalizeStaticProviderModelId(normalizedProvider, params.modelId).trim().toLowerCase()
  );
}
function normalizeStaticCatalogInput(input) {
  const normalizedInput = (input ?? []).filter((item) => item === "text" || item === "image");
  return normalizedInput.length > 0 ? normalizedInput : ["text"];
}
function normalizeStaticCatalogCost(cost) {
  return {
    input: cost?.input ?? 0,
    output: cost?.output ?? 0,
    cacheRead: cost?.cacheRead ?? 0,
    cacheWrite: cost?.cacheWrite ?? 0,
  };
}
/** Converts a normalized catalog row into the provider runtime model shape. */
function modelFromStaticCatalogRow(row) {
  return {
    id: row.id,
    name: row.name || row.id,
    provider: row.provider,
    api: row.api ?? "openai-responses",
    baseUrl: row.baseUrl ?? "",
    reasoning: row.reasoning,
    input: normalizeStaticCatalogInput(row.input),
    cost: normalizeStaticCatalogCost(row.cost),
    contextWindow: row.contextWindow ?? 2e5,
    contextTokens: row.contextTokens,
    maxTokens: row.maxTokens ?? 2e5,
    thinkingLevelMap: row.thinkingLevelMap ? { ...row.thinkingLevelMap } : void 0,
    headers: row.headers,
    compat: row.compat,
    mediaInput: row.mediaInput,
  };
}
function modelFromProviderStaticCatalog(params) {
  const [model] = buildInlineProviderModels({
    [params.provider]: {
      ...params.providerConfig,
      models: [params.model],
    },
  });
  return {
    ...model,
    id: model?.id ?? params.model.id,
    name: model?.name || params.model.name || params.model.id,
    provider: params.provider,
    api: model?.api ?? params.model.api ?? params.providerConfig.api ?? "openai-responses",
    baseUrl: model?.baseUrl ?? params.model.baseUrl ?? params.providerConfig.baseUrl ?? "",
    reasoning: model?.reasoning ?? params.model.reasoning ?? false,
    input: normalizeStaticCatalogInput(model?.input ?? params.model.input),
    cost: model?.cost ?? normalizeStaticCatalogCost(params.model.cost),
    contextWindow:
      model?.contextWindow ??
      params.model.contextWindow ??
      params.providerConfig.contextWindow ??
      2e5,
    contextTokens:
      model?.contextTokens ?? params.model.contextTokens ?? params.providerConfig.contextTokens,
    maxTokens: model?.maxTokens ?? params.model.maxTokens ?? params.providerConfig.maxTokens ?? 2e5,
    ...(params.providerConfig.authHeader !== void 0
      ? { authHeader: params.providerConfig.authHeader }
      : {}),
  };
}
function listBundledStaticCatalogPlugins(params) {
  const normalizedConfig = normalizePluginsConfig(params.cfg?.plugins);
  return listOpenClawPluginManifestMetadata(params.env).flatMap((record) => {
    if (record.origin !== "bundled") return [];
    const loaded = loadPluginManifest(record.pluginDir);
    if (!loaded.ok || !loaded.manifest.modelCatalog) return [];
    if (
      !passesManifestOwnerBasePolicy({
        plugin: { id: loaded.manifest.id },
        normalizedConfig,
      })
    )
      return [];
    return [
      {
        id: loaded.manifest.id,
        providers: loaded.manifest.providers,
        modelCatalog: loaded.manifest.modelCatalog,
      },
    ];
  });
}
function resolveManifestModelCatalogProviderAlias(params) {
  const provider = normalizeProviderId(params.provider);
  if (!provider) return;
  const targets = /* @__PURE__ */ new Set();
  for (const plugin of params.plugins)
    for (const [rawAlias, alias] of Object.entries(plugin.modelCatalog?.aliases ?? {})) {
      const normalizedAlias = normalizeProviderId(rawAlias);
      const normalizedTarget = normalizeProviderId(alias.provider);
      if (
        normalizedAlias === provider &&
        normalizedTarget &&
        plugin.providers.some((providerId) => normalizeProviderId(providerId) === normalizedTarget)
      )
        targets.add(normalizedTarget);
    }
  return targets.size === 1 ? [...targets][0] : void 0;
}
/** Resolves a provider alias from plugin model-catalog metadata when the alias is unambiguous. */
function canonicalizeManifestModelCatalogProviderAlias(params) {
  const provider = normalizeProviderId(params.provider);
  if (!provider) return params.provider;
  const env = params.env ?? process.env;
  return (
    resolveManifestModelCatalogProviderAlias({
      provider,
      plugins:
        (env === process.env
          ? getCurrentPluginMetadataSnapshot({
              config: params.cfg,
              workspaceDir: params.workspaceDir,
              env,
              ...(params.cfg === void 0 ? { requireDefaultDiscoveryContext: true } : {}),
            })?.plugins
          : void 0) ??
        loadPluginManifestRegistry({
          config: params.cfg,
          workspaceDir: params.workspaceDir,
          env,
        }).plugins,
    }) ?? params.provider
  );
}
/** Returns whether a bundled static catalog asks runtime discovery to augment its rows. */
function bundledStaticCatalogProviderUsesRuntimeAugment(params) {
  const provider = normalizeProviderId(params.provider);
  if (!provider) return false;
  return listBundledStaticCatalogPlugins({
    cfg: params.cfg,
    env: params.env ?? process.env,
  }).some((plugin) => {
    const catalog = plugin.modelCatalog;
    if (catalog?.runtimeAugment !== true) return false;
    return (
      Object.keys(catalog.providers ?? {}).some(
        (candidate) => normalizeProviderId(candidate) === provider,
      ) ||
      Object.keys(catalog.aliases ?? {}).some(
        (candidate) => normalizeProviderId(candidate) === provider,
      )
    );
  });
}
/**
 * Prepares a process-stable bundled manifest catalog lookup.
 * Manifest discovery runs once; provider-specific plans are cached on demand.
 */
function createBundledStaticCatalogModelResolver(params) {
  const bundledStaticPlugins = listBundledStaticCatalogPlugins({
    cfg: params?.cfg,
    env: params?.env ?? process.env,
  });
  const plans = /* @__PURE__ */ new Map();
  return (lookup) => {
    const provider = normalizeProviderId(lookup.provider);
    if (!provider || !lookup.modelId.trim() || bundledStaticPlugins.length === 0) return;
    let plan = plans.get(provider);
    if (!plan) {
      plan = planManifestModelCatalogRows({
        registry: { plugins: bundledStaticPlugins },
        providerFilter: provider,
      });
      plans.set(provider, plan);
    }
    for (const entry of plan.entries) {
      if (
        entry.discovery !== "static" &&
        !(params?.includeRuntimeDiscovery && entry.discovery === "runtime")
      )
        continue;
      const row = entry.rows.find((candidate) =>
        rowMatchesModel({
          row: candidate,
          provider,
          modelId: lookup.modelId,
        }),
      );
      if (row) return modelFromStaticCatalogRow(row);
    }
  };
}
/** Resolves one bundled static-catalog model row for provider/model lookup. */
function resolveBundledStaticCatalogModel(params) {
  return createBundledStaticCatalogModelResolver({
    cfg: params.cfg,
    ...(params.env ? { env: params.env } : {}),
    ...(params.includeRuntimeDiscovery !== void 0
      ? { includeRuntimeDiscovery: params.includeRuntimeDiscovery }
      : {}),
  })(params);
}
function resolveBundledProviderStaticCatalogPluginIds(params) {
  const pluginIds = resolveOwningPluginIdsForProviderRef({
    provider: params.provider,
    config: params.cfg,
    workspaceDir: params.workspaceDir,
    env: params.env,
  });
  if (!pluginIds || pluginIds.length === 0) return [];
  const activatablePluginIds = resolveActivatableProviderOwnerPluginIds({
    pluginIds,
    config: params.cfg,
    workspaceDir: params.workspaceDir,
    env: params.env,
  });
  if (activatablePluginIds.length === 0) return [];
  const bundledPluginIds = new Set(
    resolveBundledProviderCompatPluginIds({
      config: params.cfg,
      workspaceDir: params.workspaceDir,
      env: params.env,
    }),
  );
  return activatablePluginIds.filter((pluginId) => bundledPluginIds.has(pluginId)).toSorted();
}
async function loadBundledProviderStaticCatalogModels(params) {
  const providers = await resolveRuntimePluginDiscoveryProviders({
    config: params.cfg,
    workspaceDir: params.workspaceDir,
    env: params.env,
    onlyPluginIds: params.pluginIds,
    includeUntrustedWorkspacePlugins: false,
    requireCompleteDiscoveryEntryCoverage: true,
    discoveryEntriesOnly: true,
    includeManifestModelCatalogProviders: false,
  });
  const modelsByProvider = /* @__PURE__ */ new Map();
  for (const catalogProvider of providers) {
    const normalized = normalizePluginDiscoveryResult({
      provider: catalogProvider,
      result: await runProviderStaticCatalog({
        provider: catalogProvider,
        config: params.cfg ?? {},
        workspaceDir: params.workspaceDir,
        env: params.env,
      }),
    });
    for (const [providerIdRaw, providerConfig] of Object.entries(normalized)) {
      const provider = normalizeProviderId(providerIdRaw);
      if (!provider || !Array.isArray(providerConfig.models)) continue;
      const models = modelsByProvider.get(provider) ?? [];
      models.push(
        ...providerConfig.models.map((model) =>
          modelFromProviderStaticCatalog({
            provider,
            providerConfig,
            model,
          }),
        ),
      );
      modelsByProvider.set(provider, models);
    }
  }
  return modelsByProvider;
}
/** Loads all enabled bundled provider static-catalog rows without live discovery or writes. */
async function loadBundledProviderStaticCatalogContextModels(params = {}) {
  const env = params.env ?? process.env;
  const discoveryEntryPluginIds = new Set(
    loadPluginManifestRegistry({
      config: params.cfg,
      workspaceDir: params.workspaceDir,
      env,
    }).plugins.flatMap((plugin) =>
      plugin.origin === "bundled" && plugin.providerDiscoverySource ? [plugin.id] : [],
    ),
  );
  const pluginIds = resolveBundledProviderCompatPluginIds({
    config: params.cfg,
    workspaceDir: params.workspaceDir,
    env,
  }).filter((pluginId) => discoveryEntryPluginIds.has(pluginId));
  if (pluginIds.length === 0) return [];
  return (
    await Promise.allSettled(
      pluginIds.map(
        async (pluginId) =>
          await loadBundledProviderStaticCatalogModels({
            pluginIds: [pluginId],
            cfg: params.cfg,
            workspaceDir: params.workspaceDir,
            env,
          }),
      ),
    )
  ).flatMap((result) => (result.status === "fulfilled" ? [...result.value.values()].flat() : []));
}
function createScopedBundledProviderStaticCatalogModelResolver(params = {}) {
  const env = params.env ?? process.env;
  const pluginCatalogs = /* @__PURE__ */ new Map();
  const providerPluginIds = /* @__PURE__ */ new Map();
  return async (lookup, scopedPluginIds) => {
    const provider = normalizeProviderId(lookup.provider);
    if (!provider || !lookup.modelId.trim()) return;
    let pluginIds = scopedPluginIds;
    if (!pluginIds) pluginIds = providerPluginIds.get(provider);
    if (!pluginIds) {
      pluginIds = resolveBundledProviderStaticCatalogPluginIds({
        provider,
        cfg: params.cfg,
        workspaceDir: params.workspaceDir,
        env,
      });
      providerPluginIds.set(provider, pluginIds);
    }
    if (pluginIds.length === 0) return;
    const catalogKey = pluginIds.join("\0");
    let catalog = pluginCatalogs.get(catalogKey);
    if (!catalog) {
      catalog = loadBundledProviderStaticCatalogModels({
        pluginIds,
        cfg: params.cfg,
        workspaceDir: params.workspaceDir,
        env,
      });
      pluginCatalogs.set(catalogKey, catalog);
    }
    return ((await catalog).get(provider) ?? []).find((candidate) =>
      staticModelIdMatches({
        candidateId: candidate.id,
        provider,
        modelId: lookup.modelId,
      }),
    );
  };
}
/**
 * Prepares bundled provider static-catalog lookup.
 * Each provider hook runs at most once for the resolver lifetime.
 */
function createBundledProviderStaticCatalogModelResolver(params = {}) {
  const resolveModel = createScopedBundledProviderStaticCatalogModelResolver(params);
  return async (lookup) => await resolveModel(lookup);
}
function resolveOwnedNestedProviderLookup(params) {
  const provider = normalizeProviderId(params.lookup.provider);
  const modelId = params.lookup.modelId.trim();
  const slash = modelId.indexOf("/");
  if (!provider || slash <= 0 || slash >= modelId.length - 1) return;
  const nestedProvider = normalizeProviderId(modelId.slice(0, slash));
  const nestedModelId = modelId.slice(slash + 1).trim();
  if (!nestedProvider || nestedProvider === provider || !nestedModelId) return;
  const resolveBundledOwners = (candidateProvider) =>
    resolveBundledProviderStaticCatalogPluginIds({
      provider: candidateProvider,
      cfg: params.resolverParams.cfg,
      workspaceDir: params.resolverParams.workspaceDir,
      env: params.env,
    });
  const nestedProviderOwners = new Set(resolveBundledOwners(nestedProvider));
  const sharedPluginIds = resolveBundledOwners(provider).filter((pluginId) =>
    nestedProviderOwners.has(pluginId),
  );
  if (sharedPluginIds.length === 0) return;
  return {
    lookup: {
      provider: nestedProvider,
      modelId: nestedModelId,
    },
    pluginIds: sharedPluginIds,
  };
}
/**
 * Prepares context-only provider catalog lookup.
 * Nested provider refs may reuse metadata only when both providers have the same plugin owner.
 */
function createBundledProviderStaticCatalogContextResolver(params = {}) {
  const env = params.env ?? process.env;
  const resolveModel = createScopedBundledProviderStaticCatalogModelResolver(params);
  return async (lookup) => {
    const exactModel = await resolveModel(lookup);
    const nested = exactModel
      ? void 0
      : resolveOwnedNestedProviderLookup({
          lookup,
          resolverParams: params,
          env,
        });
    const model =
      exactModel ?? (nested ? await resolveModel(nested.lookup, nested.pluginIds) : void 0);
    if (!model) return;
    return {
      ...(model.contextWindow > 0 ? { contextWindow: model.contextWindow } : {}),
      ...(typeof model.contextTokens === "number" && model.contextTokens > 0
        ? { contextTokens: model.contextTokens }
        : {}),
    };
  };
}
/**
 * Resolves one bundled provider static-catalog model row for provider/model lookup.
 *
 * Some bundled providers expose their canonical offline rows through
 * `providerCatalogEntry` instead of manifest `modelCatalog`. This keeps the
 * skip-discovery fallback aligned with model list/inspect without running live
 * discovery or untrusted workspace plugins.
 */
async function resolveBundledProviderStaticCatalogModel(params) {
  return createBundledProviderStaticCatalogModelResolver(params)(params);
}
//#endregion
export {
  createBundledStaticCatalogModelResolver as a,
  resolveBundledStaticCatalogModel as c,
  resolveProviderModelInput as d,
  sanitizeModelHeaders as f,
  createBundledProviderStaticCatalogModelResolver as i,
  buildInlineProviderModels as l,
  canonicalizeManifestModelCatalogProviderAlias as n,
  loadBundledProviderStaticCatalogContextModels as o,
  createBundledProviderStaticCatalogContextResolver as r,
  resolveBundledProviderStaticCatalogModel as s,
  bundledStaticCatalogProviderUsesRuntimeAugment as t,
  normalizeResolvedTransportApi as u,
};
