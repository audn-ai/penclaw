import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import {
  n as projectModelCatalogEntryForRoute,
  r as resolveConfiguredModelCatalogOverrides,
} from "./model-catalog-route-DQhHLLvX.js";
import { t as modelKey } from "./model-key-BaNhQShd.js";
import { i as modelKey$1 } from "./model-selection-normalize-BoKGJiBx.js";
import { f as modelCatalogLogicalKey } from "./model-selection-shared-BliwFXJy.js";
import "./defaults-CdX9UGcX.js";
import {
  i as shouldSuppressBuiltInModelFromManifest,
  r as shouldSuppressBuiltInModel,
} from "./model-suppression-BEIowhn6.js";
import "./model-ref-shared-Bs7ONe2Q.js";
import { p as openAIModelCatalogRoutePolicy } from "./openai-routing-Cu28Ynzk.js";
import {
  i as normalizeProviderIdForAuth,
  r as normalizeProviderId,
} from "./provider-id-BIcU_2-A.js";
import { g as normalizeProviderResolvedModelWithPlugin } from "./provider-runtime-DyIHJ2cX.js";
import { p as canonicalizeModelCatalogProviderAlias } from "./shared-DFGOIlxJ.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/commands/models/list.local-url.ts
/** Local URL classifier for model provider status/list output. */
/** Returns true for loopback, wildcard, and mDNS local base URLs. */
const isLocalBaseUrl = (baseUrl) => {
  try {
    const host = normalizeLowercaseStringOrEmpty(new URL(baseUrl).hostname).replace(/^\[|\]$/g, "");
    return (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host === "::" ||
      host === "::1" ||
      host.endsWith(".local")
    );
  } catch {
    return false;
  }
};
//#endregion
//#region src/commands/models/list.model-row.ts
/** Converts registry/catalog models into printable model-list rows. */
/** Builds a display row, preserving configured tags and alias metadata. */
function toModelRow(params) {
  const {
    model,
    key,
    tags,
    aliases = [],
    availableKeys,
    authAvailability,
    authAvailabilityAuthoritative = false,
  } = params;
  if (!model)
    return {
      key,
      name: key,
      input: "-",
      contextWindow: null,
      local: null,
      available: null,
      tags: [...tags, "missing"],
      missing: true,
    };
  const input = model.input?.join("+") || "-";
  const local = isLocalBaseUrl(model.baseUrl ?? "");
  const modelIsAvailable =
    local || (availableKeys?.has(modelKey(model.provider, model.id)) ?? false);
  const available = authAvailabilityAuthoritative
    ? (authAvailability ?? null)
    : availableKeys !== void 0
      ? modelIsAvailable
      : (authAvailability ?? (modelIsAvailable ? true : null));
  const aliasTags = aliases.length > 0 ? [`alias:${aliases.join(",")}`] : [];
  const mergedTags = new Set(tags);
  if (aliasTags.length > 0) {
    for (const tag of mergedTags)
      if (tag === "alias" || tag.startsWith("alias:")) mergedTags.delete(tag);
    for (const tag of aliasTags) mergedTags.add(tag);
  }
  return {
    key,
    name: model.name || model.id,
    input,
    contextWindow: model.contextWindow ?? null,
    ...(typeof model.contextTokens === "number" ? { contextTokens: model.contextTokens } : {}),
    local,
    available,
    tags: Array.from(mergedTags),
    missing: false,
  };
}
//#endregion
//#region src/commands/models/list.rows.ts
const modelCatalogModuleLoader = createLazyImportLoader(
  () => import("./model-catalog-CKXmb4DJ.js"),
);
const modelResolverModuleLoader = createLazyImportLoader(() => import("./model-BQLQU_46.js"));
const providerCatalogModuleLoader = createLazyImportLoader(
  () => import("./list.provider-catalog-NDece3on.js"),
);
function loadModelCatalogModule() {
  return modelCatalogModuleLoader.load();
}
function loadModelResolverModule() {
  return modelResolverModuleLoader.load();
}
function loadProviderCatalogModule() {
  return providerCatalogModuleLoader.load();
}
function matchesProviderFilter(context, provider) {
  const providerFilter = context.filter.provider;
  if (!providerFilter) return true;
  return (
    normalizeProviderId(
      canonicalizeModelCatalogProviderAlias(provider, {
        cfg: context.cfg,
        metadataSnapshot: context.metadataSnapshot,
      }),
    ) === providerFilter
  );
}
function matchesRowFilter(context, model) {
  if (!matchesProviderFilter(context, model.provider)) return false;
  if (context.filter.local && !isLocalBaseUrl(model.baseUrl ?? "")) return false;
  return true;
}
function resolveCatalogLogicalKey(model) {
  return openAIModelCatalogRoutePolicy.resolveIdentity(model)?.key ?? modelCatalogLogicalKey(model);
}
function createModelCatalogLogicalRouteIndex(catalog) {
  const index = /* @__PURE__ */ new Map();
  for (const entry of catalog) {
    const key = resolveCatalogLogicalKey(entry);
    const variants = index.get(key) ?? [];
    variants.push(entry);
    index.set(key, variants);
  }
  return index;
}
function resolveCatalogLogicalRoutes(model, routeIndex) {
  return routeIndex?.get(resolveCatalogLogicalKey(model));
}
function toModelAuthRef(model, routeIndex) {
  const identity = openAIModelCatalogRoutePolicy.resolveIdentity(model);
  const observedRoutes = resolveCatalogLogicalRoutes(model, routeIndex)?.map((entry) => ({
    api: entry.api,
    baseUrl: entry.baseUrl,
  }));
  return {
    modelId: identity?.id ?? model.id,
    ...(observedRoutes && observedRoutes.length > 0
      ? { observedRoutes }
      : {
          api: model.api,
          baseUrl: model.baseUrl,
        }),
  };
}
function toCatalogProjectionEntry(model) {
  return {
    id: model.id,
    name: model.name,
    provider: model.provider,
    ...(typeof model.api === "string" ? { api: model.api } : {}),
    ...(model.baseUrl !== void 0 ? { baseUrl: model.baseUrl } : {}),
    ...(typeof model.contextWindow === "number" ? { contextWindow: model.contextWindow } : {}),
    ...(typeof model.contextTokens === "number" ? { contextTokens: model.contextTokens } : {}),
    ...(model.input !== void 0 ? { input: model.input } : {}),
  };
}
function hasSameCatalogRoute(left, right) {
  return left.api === right.api && left.baseUrl === right.baseUrl;
}
function projectListRowModel(params) {
  const projection =
    params.evaluation.routeResolution === null
      ? { kind: "unmanaged" }
      : params.evaluation.selectedRoute
        ? {
            kind: "selected",
            route: params.evaluation.selectedRoute,
            policy: openAIModelCatalogRoutePolicy,
          }
        : {
            kind: "unresolved",
            policy: openAIModelCatalogRoutePolicy,
          };
  const entry = toCatalogProjectionEntry(params.model);
  const overrides = resolveConfiguredModelCatalogOverrides({
    cfg: params.cfg,
    entry,
    policy: openAIModelCatalogRoutePolicy,
  });
  const routeVariants = resolveCatalogLogicalRoutes(entry, params.routeIndex);
  const projected = projectModelCatalogEntryForRoute({
    entry,
    projection,
    ...(routeVariants ? { catalog: routeVariants } : {}),
    ...(overrides ? { overrides } : {}),
  });
  return {
    ...params.model,
    name: projected.name,
    api: projected.api,
    baseUrl: projected.baseUrl,
    input: projected.input?.filter(
      (item) => item === "text" || item === "image" || item === "document",
    ),
    contextWindow: projected.contextWindow,
    contextTokens: projected.contextTokens,
  };
}
async function buildRow(params) {
  const configured = params.context.configuredByKey.get(params.key);
  const authRef = toModelAuthRef(params.model, params.routeIndex);
  const authEvaluation =
    params.authEvaluation ??
    params.context.authIndex.evaluateModelAuth(params.model.provider, authRef);
  return toModelRow({
    model: projectListRowModel({
      model: params.model,
      evaluation: authEvaluation,
      cfg: params.context.cfg,
      ...(params.routeIndex ? { routeIndex: params.routeIndex } : {}),
    }),
    key: params.key,
    tags: configured ? Array.from(configured.tags) : [],
    aliases: configured?.aliases ?? [],
    availableKeys: params.context.availableKeys,
    authAvailability: authEvaluation.availability,
    authAvailabilityAuthoritative:
      params.allowAuthAvailabilityOverride === true ||
      normalizeProviderIdForAuth(params.model.provider) === "openai" ||
      authEvaluation.routeResolution !== null,
  });
}
function shouldSuppressListModel(params) {
  if (params.context.skipRuntimeModelSuppression)
    return shouldSuppressBuiltInModelFromManifest({
      provider: params.model.provider,
      id: params.model.id,
      baseUrl: params.model.baseUrl,
      config: params.context.cfg,
    });
  return shouldSuppressBuiltInModel({
    provider: params.model.provider,
    id: params.model.id,
    baseUrl: params.model.baseUrl,
    config: params.context.cfg,
  });
}
function normalizeListRowWithProviderPlugin(params) {
  const normalized = normalizeProviderResolvedModelWithPlugin({
    provider: params.model.provider,
    config: params.context.cfg,
    workspaceDir: params.context.workspaceDir,
    pluginMetadataSnapshot: params.context.metadataSnapshot,
    context: {
      config: params.context.cfg,
      agentDir: params.context.agentDir,
      workspaceDir: params.context.workspaceDir,
      provider: params.model.provider,
      modelId: params.model.id,
      model: params.model,
    },
  });
  if (!normalized) return params.model;
  return {
    ...params.model,
    id: normalized.id,
    name: normalized.name,
    provider: normalized.provider,
    api: normalized.api ?? params.model.api,
    baseUrl: normalized.baseUrl ?? params.model.baseUrl,
    input: toListRowInput(normalized.input),
    contextWindow: normalized.contextWindow,
    contextTokens: normalized.contextTokens,
  };
}
async function appendVisibleRow(params) {
  if (params.seenKeys?.has(params.key)) return false;
  const model = params.normalizeWithProviderPlugin
    ? normalizeListRowWithProviderPlugin({
        model: params.model,
        context: params.context,
      })
    : params.model;
  const authEvaluation =
    params.authEvaluation ??
    params.context.authIndex.evaluateModelAuth(
      model.provider,
      toModelAuthRef(model, params.routeIndex),
    );
  const projectedModel = projectListRowModel({
    model,
    evaluation: authEvaluation,
    cfg: params.context.cfg,
    ...(params.routeIndex ? { routeIndex: params.routeIndex } : {}),
  });
  if (!matchesRowFilter(params.context, projectedModel)) return false;
  if (
    !params.skipSuppression &&
    shouldSuppressListModel({
      model: projectedModel,
      context: params.context,
    })
  )
    return false;
  params.rows.push(
    await buildRow({
      model,
      key: params.key,
      context: params.context,
      ...(params.routeIndex ? { routeIndex: params.routeIndex } : {}),
      authEvaluation,
      allowAuthAvailabilityOverride: params.allowAuthAvailabilityOverride,
    }),
  );
  params.seenKeys?.add(params.key);
  return true;
}
function resolveConfiguredModelInput(params) {
  const input = Array.isArray(params.model.input)
    ? params.model.input.filter((item) => item === "text" || item === "image")
    : [];
  return input.length > 0 ? input : ["text"];
}
function toConfiguredProviderListModel(params) {
  return {
    provider: params.provider,
    id: params.model.id,
    name: params.model.name ?? params.model.id,
    api: params.model.api ?? params.providerConfig.api,
    baseUrl: params.model.baseUrl ?? params.providerConfig.baseUrl,
    input: resolveConfiguredModelInput({ model: params.model }),
    contextWindow: params.model.contextWindow ?? 2e5,
    contextTokens: params.model.contextTokens,
  };
}
function toListRowInput(input) {
  const parsed = input?.filter(
    (item) => item === "text" || item === "image" || item === "document",
  );
  return parsed?.length ? parsed : ["text"];
}
function toManifestCatalogListModel(row) {
  return {
    provider: row.provider,
    id: row.id,
    name: row.name,
    api: row.api,
    baseUrl: row.baseUrl,
    input: toListRowInput(row.input),
    contextWindow: row.contextWindow ?? 2e5,
    contextTokens: row.contextTokens,
  };
}
function shouldListConfiguredProviderModel(params) {
  return params.providerConfig.api !== void 0 || params.model.api !== void 0;
}
function findConfiguredProviderModel(params) {
  const providerConfig = params.cfg.models?.providers?.[params.provider];
  const configuredModel = providerConfig?.models?.find((model) => model.id === params.modelId);
  if (!providerConfig || !configuredModel) return;
  return toConfiguredProviderListModel({
    provider: params.provider,
    providerConfig,
    model: configuredModel,
  });
}
function toFallbackConfiguredListModel(entry, cfg) {
  return (
    findConfiguredProviderModel({
      cfg,
      provider: entry.ref.provider,
      modelId: entry.ref.model,
    }) ?? {
      provider: entry.ref.provider,
      id: entry.ref.model,
      name: entry.ref.model,
      input: ["text"],
      contextWindow: 2e5,
    }
  );
}
/** Appends rows discovered from the loaded model registry. */
async function appendDiscoveredRows(params) {
  const seenKeys = /* @__PURE__ */ new Set();
  const modelResolver =
    params.modelRegistry && params.resolveWithRegistry !== false
      ? (await loadModelResolverModule()).resolveModelWithRegistry
      : void 0;
  const preparedModels = [...params.models]
    .toSorted((a, b) => {
      const providerCompare = a.provider.localeCompare(b.provider);
      if (providerCompare !== 0) return providerCompare;
      return a.id.localeCompare(b.id);
    })
    .map((model) => {
      const key = modelKey$1(model.provider, model.id);
      const resolvedModel =
        params.modelRegistry && modelResolver
          ? modelResolver({
              provider: model.provider,
              modelId: model.id,
              modelRegistry: params.modelRegistry,
              cfg: params.context.cfg,
              agentDir: params.context.agentDir,
            })
          : void 0;
      return {
        key,
        model,
        rowModel:
          resolvedModel && modelKey$1(resolvedModel.provider, resolvedModel.id) === key
            ? resolvedModel
            : model,
      };
    });
  const routeIndex = createModelCatalogLogicalRouteIndex(
    preparedModels.map(({ model, rowModel }) =>
      toCatalogProjectionEntry(hasSameCatalogRoute(model, rowModel) ? rowModel : model),
    ),
  );
  for (const { key, rowModel } of preparedModels)
    await appendVisibleRow({
      rows: params.rows,
      model: rowModel,
      key,
      context: params.context,
      seenKeys,
      routeIndex,
      skipSuppression: params.skipSuppression,
    });
  return seenKeys;
}
/** Appends models explicitly configured under models.providers. */
async function appendConfiguredProviderRows(params) {
  for (const [provider, providerConfig] of Object.entries(
    params.context.cfg.models?.providers ?? {},
  ))
    for (const configuredModel of providerConfig.models ?? []) {
      if (
        !shouldListConfiguredProviderModel({
          providerConfig,
          model: configuredModel,
        })
      )
        continue;
      const key = modelKey$1(provider, configuredModel.id);
      const model = toConfiguredProviderListModel({
        provider,
        providerConfig,
        model: configuredModel,
      });
      await appendVisibleRow({
        rows: params.rows,
        model,
        key,
        context: params.context,
        seenKeys: params.seenKeys,
        allowAuthAvailabilityOverride: true,
        normalizeWithProviderPlugin: true,
      });
    }
}
/** Appends catalog models for providers that have configured auth. */
async function appendAuthenticatedCatalogRows(params) {
  const { loadModelCatalogSnapshot } = await loadModelCatalogModule();
  const { entries: catalog, routeVariants } = await loadModelCatalogSnapshot({
    config: params.context.cfg,
    readOnly: true,
    metadataSnapshot: params.context.metadataSnapshot,
  });
  const routeIndex = createModelCatalogLogicalRouteIndex(routeVariants);
  for (const entry of catalog) {
    const model = toManifestCatalogListModel(entry);
    const authEvaluation = params.context.authIndex.evaluateModelAuth(
      entry.provider,
      toModelAuthRef(model, routeIndex),
    );
    const hasRunnableSyntheticAuth =
      authEvaluation.availability === void 0 && authEvaluation.evidence === "synthetic";
    if (authEvaluation.availability !== true && !hasRunnableSyntheticAuth) continue;
    const key = modelKey$1(entry.provider, entry.id);
    await appendVisibleRow({
      rows: params.rows,
      model,
      key,
      context: params.context,
      seenKeys: params.seenKeys,
      routeIndex,
      authEvaluation,
      allowAuthAvailabilityOverride: !hasRunnableSyntheticAuth,
    });
  }
}
/** Appends normalized model catalog rows into the shared row list. */
async function appendModelCatalogRows(params) {
  let appended = 0;
  const routeIndex = createModelCatalogLogicalRouteIndex(
    params.catalogRows.map((row) => toCatalogProjectionEntry(toManifestCatalogListModel(row))),
  );
  for (const catalogRow of params.catalogRows) {
    const key = modelKey$1(catalogRow.provider, catalogRow.id);
    if (
      await appendVisibleRow({
        rows: params.rows,
        model: toManifestCatalogListModel(catalogRow),
        key,
        context: params.context,
        seenKeys: params.seenKeys,
        routeIndex,
        allowAuthAvailabilityOverride: true,
      })
    )
      appended += 1;
  }
  return appended;
}
/** Appends manifest catalog rows through the generic catalog-row path. */
function appendManifestCatalogRows(params) {
  return appendModelCatalogRows({
    ...params,
    catalogRows: params.manifestRows,
  });
}
/** Appends catalog rows that are resolvable by the registry but missing from registry output. */
async function appendCatalogSupplementRows(params) {
  const [modelCatalog, { resolveModelWithRegistry }] = await Promise.all([
    loadModelCatalogModule(),
    loadModelResolverModule(),
  ]);
  const { entries: catalog, routeVariants } = await modelCatalog.loadModelCatalogSnapshot({
    config: params.context.cfg,
    readOnly: true,
    metadataSnapshot: params.context.metadataSnapshot,
  });
  const routeIndex = createModelCatalogLogicalRouteIndex(routeVariants);
  for (const entry of catalog) {
    if (!matchesProviderFilter(params.context, entry.provider)) continue;
    const key = modelKey$1(entry.provider, entry.id);
    if (params.seenKeys.has(key)) continue;
    const model = resolveModelWithRegistry({
      provider: entry.provider,
      modelId: entry.id,
      modelRegistry: params.modelRegistry,
      cfg: params.context.cfg,
    });
    if (!model) continue;
    await appendVisibleRow({
      rows: params.rows,
      model,
      key,
      context: params.context,
      seenKeys: params.seenKeys,
      routeIndex,
      allowAuthAvailabilityOverride: !params.context.discoveredKeys.has(key),
    });
  }
  if (params.context.filter.local || !params.context.filter.provider) return;
  await appendProviderCatalogRows({
    rows: params.rows,
    context: params.context,
    seenKeys: params.seenKeys,
  });
}
/** Appends model rows returned by provider catalog hooks. */
async function appendProviderCatalogRows(params) {
  let appended = 0;
  let catalogModels = params.catalogModels;
  if (catalogModels == null) {
    const { loadProviderCatalogModelsForList } = await loadProviderCatalogModule();
    catalogModels = await loadProviderCatalogModelsForList({
      cfg: params.context.cfg,
      agentDir: params.context.agentDir,
      providerFilter: params.context.filter.provider,
      staticOnly: params.staticOnly,
      metadataSnapshot: params.context.metadataSnapshot,
    });
  }
  const routeIndex = createModelCatalogLogicalRouteIndex(
    catalogModels.map((model) => toCatalogProjectionEntry(model)),
  );
  for (const model of catalogModels) {
    const key = modelKey$1(model.provider, model.id);
    if (
      await appendVisibleRow({
        rows: params.rows,
        model,
        key,
        context: params.context,
        seenKeys: params.seenKeys,
        routeIndex,
        allowAuthAvailabilityOverride: !params.context.discoveredKeys.has(key),
      })
    )
      appended += 1;
  }
  return appended;
}
/** Appends rows from default/fallback/configured model references. */
async function appendConfiguredRows(params) {
  const resolveModelWithRegistry = params.modelRegistry
    ? (await loadModelResolverModule()).resolveModelWithRegistry
    : void 0;
  for (const entry of params.entries) {
    if (!matchesProviderFilter(params.context, entry.ref.provider)) continue;
    const resolvedModel =
      params.modelRegistry && resolveModelWithRegistry
        ? resolveModelWithRegistry({
            provider: entry.ref.provider,
            modelId: entry.ref.model,
            modelRegistry: params.modelRegistry,
            cfg: params.context.cfg,
          })
        : toFallbackConfiguredListModel(entry, params.context.cfg);
    const model = resolvedModel
      ? normalizeListRowWithProviderPlugin({
          model: resolvedModel,
          context: params.context,
        })
      : resolvedModel;
    if (params.context.filter.local && !model) continue;
    const authEvaluation = model
      ? params.context.authIndex.evaluateModelAuth(model.provider, toModelAuthRef(model))
      : void 0;
    const projectedModel =
      model && authEvaluation
        ? projectListRowModel({
            model,
            evaluation: authEvaluation,
            cfg: params.context.cfg,
          })
        : model;
    if (
      params.context.filter.local &&
      projectedModel &&
      !isLocalBaseUrl(projectedModel.baseUrl ?? "")
    )
      continue;
    if (
      projectedModel &&
      shouldSuppressListModel({
        model: projectedModel,
        context: params.context,
      })
    )
      continue;
    params.rows.push(
      toModelRow({
        model: projectedModel,
        key: entry.key,
        tags: Array.from(entry.tags),
        aliases: entry.aliases,
        availableKeys: params.context.availableKeys,
        authAvailability: authEvaluation?.availability,
        authAvailabilityAuthoritative:
          Boolean(
            model && !params.context.discoveredKeys.has(modelKey$1(model.provider, model.id)),
          ) ||
          normalizeProviderIdForAuth(model?.provider ?? entry.ref.provider) === "openai" ||
          (authEvaluation !== void 0 && authEvaluation.routeResolution !== null),
      }),
    );
  }
}
//#endregion
//#region src/commands/models/list.row-sources.ts
/** Appends all rows requested by `models list --all` or a provider-filtered list. */
async function appendAllModelRowSources(params) {
  if (params.context.filter.provider && params.sourcePlan.kind !== "registry") {
    const seenKeys = /* @__PURE__ */ new Set();
    let catalogRows = 0;
    if (params.sourcePlan.kind === "manifest")
      catalogRows = await appendManifestCatalogRows({
        rows: params.rows,
        context: params.context,
        seenKeys,
        manifestRows: params.sourcePlan.manifestCatalogRows,
      });
    if (catalogRows === 0 && params.sourcePlan.kind === "provider-index")
      catalogRows = await appendModelCatalogRows({
        rows: params.rows,
        context: params.context,
        seenKeys,
        catalogRows: params.sourcePlan.providerIndexCatalogRows,
      });
    if (
      catalogRows === 0 &&
      (params.sourcePlan.kind === "provider-runtime-static" ||
        params.sourcePlan.kind === "provider-runtime-scoped")
    )
      catalogRows = await appendProviderCatalogRows({
        rows: params.rows,
        context: params.context,
        seenKeys,
        staticOnly: params.sourcePlan.kind === "provider-runtime-static",
      });
    if (params.entries && params.entries.length > 0) {
      const missingEntries = params.entries.filter((entry) => !seenKeys.has(entry.key));
      if (missingEntries.length > 0) {
        await appendConfiguredRows({
          rows: params.rows,
          entries: missingEntries,
          modelRegistry: params.modelRegistry,
          context: params.context,
        });
        for (const row of params.rows) seenKeys.add(row.key);
      }
    }
    await appendConfiguredProviderRows({
      rows: params.rows,
      context: params.context,
      seenKeys,
    });
    if (
      catalogRows === 0 &&
      params.rows.length === 0 &&
      params.sourcePlan.fallbackToRegistryWhenEmpty
    ) {
      if (!params.modelRegistry) return { requiresRegistryFallback: true };
      await appendDiscoveredRows({
        rows: params.rows,
        models: params.registryModels ?? params.modelRegistry.getAll(),
        modelRegistry: params.modelRegistry,
        context: params.context,
        resolveWithRegistry: false,
      });
    }
    return { requiresRegistryFallback: false };
  }
  const seenKeys = await appendDiscoveredRows({
    rows: params.rows,
    models: params.registryModels ?? params.modelRegistry?.getAll() ?? [],
    modelRegistry: params.modelRegistry,
    context: params.context,
    resolveWithRegistry: Boolean(params.context.filter.provider),
    skipSuppression: Boolean(params.modelRegistry),
  });
  if (params.context.filter.provider && params.entries && params.entries.length > 0) {
    const missingEntries = params.entries.filter((entry) => !seenKeys.has(entry.key));
    if (missingEntries.length > 0) {
      const appendedRowsStart = params.rows.length;
      await appendConfiguredRows({
        rows: params.rows,
        entries: missingEntries,
        modelRegistry: params.modelRegistry,
        context: params.context,
      });
      for (const row of params.rows.slice(appendedRowsStart)) seenKeys.add(row.key);
    }
  }
  await appendConfiguredProviderRows({
    rows: params.rows,
    context: params.context,
    seenKeys,
  });
  if (params.sourcePlan.manifestCatalogRows.length > 0)
    await appendManifestCatalogRows({
      rows: params.rows,
      context: {
        ...params.context,
        skipRuntimeModelSuppression: true,
      },
      seenKeys,
      manifestRows: params.sourcePlan.manifestCatalogRows,
    });
  if (params.sourcePlan.providerIndexCatalogRows.length > 0)
    await appendModelCatalogRows({
      rows: params.rows,
      context: {
        ...params.context,
        skipRuntimeModelSuppression: true,
      },
      seenKeys,
      catalogRows: params.sourcePlan.providerIndexCatalogRows,
    });
  if (params.modelRegistry && params.context.filter.provider)
    await appendCatalogSupplementRows({
      rows: params.rows,
      modelRegistry: params.modelRegistry,
      context: params.context,
      seenKeys,
    });
  if (params.modelRegistry) return { requiresRegistryFallback: false };
  await appendProviderCatalogRows({
    rows: params.rows,
    context: params.context,
    seenKeys,
  });
  return { requiresRegistryFallback: false };
}
/** Appends the configured/default rows used by the cheap default list path. */
async function appendConfiguredModelRowSources(params) {
  await appendConfiguredRows(params);
  const seenKeys = new Set(params.rows.map((row) => row.key));
  await appendConfiguredProviderRows({
    rows: params.rows,
    context: params.context,
    seenKeys,
  });
  await appendAuthenticatedCatalogRows({
    rows: params.rows,
    context: params.context,
    seenKeys,
  });
}
//#endregion
export { appendAllModelRowSources, appendConfiguredModelRowSources };
