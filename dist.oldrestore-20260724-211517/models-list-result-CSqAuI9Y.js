import {
  a as resolveAgentDir,
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-y9xQv_q1.js";
import { r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { t as createModelAuthAvailabilityResolver } from "./model-auth-availability-CHBQPrVn.js";
import { u as hasSyntheticLocalProviderAuthConfig } from "./model-auth-BWFdcEzF.js";
import {
  n as loadModelCatalogSnapshotForBrowse,
  t as buildProviderConfigModelCatalogForBrowse,
} from "./model-catalog-browse-D-Xu_sqI.js";
import {
  n as projectModelCatalogEntryForRoute,
  r as resolveConfiguredModelCatalogOverrides,
  t as findModelCatalogRouteDonor,
} from "./model-catalog-route-DQhHLLvX.js";
import {
  n as resolveLogicalVisibleModelCatalog,
  t as resolveLogicalModelCatalogEntryState,
} from "./model-catalog-visibility-DRLQNOZh.js";
import { a as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-DMpABeI4.js";
import "./config-BDv-QbJ6.js";
import {
  n as createModelVisibilityPolicy,
  t as RUNTIME_MODEL_VISIBILITY_NORMALIZATION,
} from "./model-visibility-policy-BqHiELXR.js";
import "./auth-profiles-CX7JDmZ9.js";
import { p as openAIModelCatalogRoutePolicy } from "./openai-routing-Cu28Ynzk.js";
import { p as loadPluginRegistrySnapshotWithMetadata } from "./plugin-registry-BckMdz4f.js";
import "./workspace-DXzCbuC0.js";
import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-RaEzqkSo.js";
import { r as resolveManifestProviderAuthChoices } from "./provider-auth-choices-LxMRetjr.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import { s as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-BbbqRiDR.js";
import { f as loadAuthProfileStoreWithoutExternalProfiles } from "./store-B7DoDdVM.js";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-h9TzWSvp.js";
//#region src/gateway/server-methods/models-list-result.ts
let loggedSlowModelsListCatalog = false;
function resolveModelsListView(params) {
  const view = params.view;
  return view === "configured" || view === "provider-config" || view === "all" ? view : "default";
}
function resolvePositiveSafeInteger(value) {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0 ? value : void 0;
}
function buildPublicModelProjection(entry) {
  const contextWindow = resolvePositiveSafeInteger(entry.contextWindow);
  return {
    id: entry.id,
    name: entry.name,
    provider: entry.provider,
    ...(entry.alias ? { alias: entry.alias } : {}),
    ...(contextWindow ? { contextWindow } : {}),
    ...(typeof entry.reasoning === "boolean" ? { reasoning: entry.reasoning } : {}),
  };
}
function listEnabledSyntheticAuthProviderRefs(params) {
  const result = loadPluginRegistrySnapshotWithMetadata({
    config: params.cfg,
    workspaceDir: params.workspaceDir,
    env: process.env,
  });
  if (result.source !== "persisted" && result.source !== "provided") return [];
  return result.snapshot.plugins
    .filter((plugin) => plugin.enabled)
    .flatMap((plugin) => plugin.syntheticAuthRefs ?? []);
}
function createModelsListAuthResolver(params) {
  const agentDir = resolveAgentDir(params.cfg, params.agentId);
  const authStore = loadAuthProfileStoreWithoutExternalProfiles(agentDir, {
    allowKeychainPrompt: false,
  });
  return createModelAuthAvailabilityResolver({
    cfg: params.cfg,
    authStore,
    agentDir,
    workspaceDir: params.workspaceDir,
    env: process.env,
    skipSetupProviderFallback: true,
    syntheticAuthProviderRefs: listEnabledSyntheticAuthProviderRefs(params),
    externalCliProviderIds: params.includeOpenAIExternalProfiles ? ["openai"] : [],
    routeResolverFactory: params.routeResolverFactory,
  });
}
function resolveLegacyEntryAvailability(params) {
  if (params.primaryAvailability === true) return true;
  let available = params.primaryAvailability;
  const runtimeProvider = resolveCliRuntimeExecutionProvider({
    provider: params.entry.provider,
    cfg: params.cfg,
    agentId: params.agentId,
    modelId: params.entry.id,
  });
  if (
    runtimeProvider &&
    normalizeProviderId(runtimeProvider) !== normalizeProviderId(params.entry.provider)
  ) {
    const runtimeAvailable = params.authResolver.resolveProviderAuthAvailability(runtimeProvider);
    if (runtimeAvailable === true) return true;
    if (available === false && runtimeAvailable === void 0) available = void 0;
  }
  return available;
}
function createModelsListEntryEvaluator(params) {
  const pending = /* @__PURE__ */ new Map();
  return (entry, routeVariants = [entry]) => {
    const identity = openAIModelCatalogRoutePolicy.resolveIdentity(entry);
    const cacheKey = resolveGatewayModelCatalogRouteKey(entry);
    const cached = pending.get(cacheKey);
    if (cached) return cached;
    const next = Promise.resolve().then(() => {
      const evaluation = params.authResolver.evaluateModelAuth(entry.provider, {
        modelId: identity?.id ?? entry.id,
        ...(params.preferredProfileId ? { preferredProfileId: params.preferredProfileId } : {}),
        ...(params.lockedProfileId ? { lockedProfileId: params.lockedProfileId } : {}),
        observedRoutes: routeVariants.map((variant) => ({
          api: variant.api,
          baseUrl: variant.baseUrl,
        })),
      });
      return evaluation.routeResolution === null && normalizeProviderId(entry.provider) !== "openai"
        ? {
            ...evaluation,
            availability: resolveLegacyEntryAvailability({
              authResolver: params.authResolver,
              entry,
              primaryAvailability: evaluation.availability,
              cfg: params.cfg,
              agentId: params.agentId,
            }),
          }
        : evaluation;
    });
    pending.set(cacheKey, next);
    return next;
  };
}
function resolveGatewayModelCatalogRouteKey(entry) {
  return (
    openAIModelCatalogRoutePolicy.resolveIdentity(entry)?.key ??
    `${normalizeProviderId(entry.provider)}/${entry.id}`
  );
}
function resolveProviderConfigInventoryEntries(params) {
  const canonicalByKey = /* @__PURE__ */ new Map();
  for (const entry of params.canonicalEntries) {
    const key = resolveGatewayModelCatalogRouteKey(entry);
    if (!canonicalByKey.has(key)) canonicalByKey.set(key, entry);
  }
  const seen = /* @__PURE__ */ new Set();
  const inventory = [];
  for (const authoredEntry of params.authoredEntries) {
    const key = resolveGatewayModelCatalogRouteKey(authoredEntry);
    if (seen.has(key)) continue;
    seen.add(key);
    inventory.push(canonicalByKey.get(key) ?? authoredEntry);
  }
  return inventory;
}
/** Builds one per-agent, snapshot-scoped route projection for Gateway thinking metadata. */
function createGatewayAgentModelCatalogProjector(params) {
  const defaultModel = resolveAgentEffectiveModelPrimary(params.cfg, params.agentId);
  const visibilityPolicy = createModelVisibilityPolicy({
    cfg: params.cfg,
    catalog: params.snapshot.entries,
    defaultProvider: DEFAULT_PROVIDER,
    defaultModel,
    agentId: params.agentId,
    ...RUNTIME_MODEL_VISIBILITY_NORMALIZATION,
  });
  const workspaceDir =
    resolveAgentWorkspaceDir(params.cfg, params.agentId) ?? resolveDefaultAgentWorkspaceDir();
  const projectionCatalog =
    params.snapshot.routeVariants.length > 0
      ? params.snapshot.routeVariants
      : params.snapshot.entries;
  const routeVariantsByKey = /* @__PURE__ */ new Map();
  for (const entry of projectionCatalog) {
    const key = resolveGatewayModelCatalogRouteKey(entry);
    const variants = routeVariantsByKey.get(key) ?? [];
    variants.push(entry);
    routeVariantsByKey.set(key, variants);
  }
  const resolveRouteVariants = (entry) =>
    routeVariantsByKey.get(resolveGatewayModelCatalogRouteKey(entry)) ?? [entry];
  const logicalEntries = [];
  const logicalEntryKeys = /* @__PURE__ */ new Set();
  for (const entry of params.snapshot.entries) {
    const key = resolveGatewayModelCatalogRouteKey(entry);
    if (!logicalEntryKeys.has(key)) {
      logicalEntryKeys.add(key);
      logicalEntries.push(entry);
    }
  }
  const authResolver = createModelsListAuthResolver({
    cfg: params.cfg,
    agentId: params.agentId,
    includeOpenAIExternalProfiles:
      projectionCatalog.some((entry) => normalizeProviderId(entry.provider) === "openai") ||
      [...visibilityPolicy.configuredKeys].some((key) => key.startsWith("openai/")),
    workspaceDir,
    routeResolverFactory: params.routeResolverFactory,
  });
  const evaluateEntry = createModelsListEntryEvaluator({
    cfg: params.cfg,
    agentId: params.agentId,
    authResolver,
    ...(params.preferredProfileId ? { preferredProfileId: params.preferredProfileId } : {}),
    ...(params.lockedProfileId ? { lockedProfileId: params.lockedProfileId } : {}),
  });
  let projectedCatalog;
  return {
    evaluateEntry,
    projectCatalog: () =>
      (projectedCatalog ??= Promise.all(
        logicalEntries.map(async (entry) => {
          const routeVariants = resolveRouteVariants(entry);
          const state = resolveLogicalModelCatalogEntryState({
            entry,
            evaluation: await evaluateEntry(entry, routeVariants),
            routePolicy: openAIModelCatalogRoutePolicy,
          });
          const overrides = resolveConfiguredModelCatalogOverrides({
            cfg: params.cfg,
            entry,
            policy: openAIModelCatalogRoutePolicy,
          });
          const projected = projectModelCatalogEntryForRoute({
            entry,
            projection: state.routeProjection,
            catalog: routeVariants,
            ...(overrides ? { overrides } : {}),
          });
          if (state.routeProjection.kind !== "selected") return projected;
          const donor = findModelCatalogRouteDonor({
            entry,
            route: state.routeProjection.route,
            policy: openAIModelCatalogRoutePolicy,
            catalog: routeVariants,
          });
          if (donor && Object.hasOwn(donor, "compat")) projected.compat = donor.compat;
          if (donor && Object.hasOwn(donor, "params")) projected.params = donor.params;
          return projected;
        }),
      )),
  };
}
async function buildPublicModelsListEntries(params) {
  return await Promise.all(
    params.catalog.map(async (entry) => {
      const evaluation = await params.evaluateEntry(entry);
      const publicEntry = buildPublicModelProjection(entry);
      const syntheticLocalAvailable =
        evaluation.availability === void 0 &&
        evaluation.routeResolution === null &&
        normalizeProviderId(entry.provider) !== "openai" &&
        hasSyntheticLocalProviderAuthConfig({
          cfg: params.cfg,
          provider: entry.provider,
        });
      const available = evaluation.availability ?? (syntheticLocalAvailable ? true : void 0);
      const capabilityProvider = params.apiKeyCapabilities?.resolveProvider(entry.provider);
      return {
        ...publicEntry,
        ...(capabilityProvider && params.apiKeyCapabilities?.providers.has(capabilityProvider)
          ? {
              apiKeySupported: params.apiKeyCapabilities.providers.get(capabilityProvider) === true,
            }
          : {}),
        ...(params.includeInput && entry.input?.length ? { input: entry.input } : {}),
        ...(params.preserveUnknownAvailability && available === void 0
          ? {}
          : { available: available ?? false }),
      };
    }),
  );
}
function apiKeyProviderCapabilities(params) {
  const capabilities = /* @__PURE__ */ new Map();
  const resolveProvider = (provider) =>
    resolveProviderIdForAuth(provider, {
      config: params.cfg,
      workspaceDir: params.workspaceDir,
      env: process.env,
      includeUntrustedWorkspacePlugins: false,
    });
  for (const choice of resolveManifestProviderAuthChoices({
    config: params.cfg,
    workspaceDir: params.workspaceDir,
    env: process.env,
    includeUntrustedWorkspacePlugins: false,
  })) {
    const provider = resolveProvider(choice.providerId);
    capabilities.set(
      provider,
      capabilities.get(provider) === true || choice.methodId === "api-key",
    );
  }
  return {
    providers: capabilities,
    resolveProvider,
  };
}
async function buildModelsListResult(params) {
  const cfg = params.context.getRuntimeConfig();
  const agentId = params.agentId ?? resolveDefaultAgentId(cfg);
  const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId) ?? resolveDefaultAgentWorkspaceDir();
  const view = resolveModelsListView(params.params);
  const snapshot = await loadModelCatalogSnapshotForBrowse({
    cfg,
    view,
    loadCatalog: async (loadParams) => {
      const readOnlyLoad = loadParams.readOnly ?? true;
      if (params.preloadedCatalog && readOnlyLoad) return params.preloadedCatalog;
      return await params.context.loadGatewayModelCatalogSnapshot(loadParams);
    },
    onTimeout: (timeoutMs) => {
      if (loggedSlowModelsListCatalog) return;
      loggedSlowModelsListCatalog = true;
      params.context.logGateway.debug(
        `models.list continuing without model catalog after ${timeoutMs}ms`,
      );
    },
  });
  const catalog = snapshot.entries;
  const routeVariants = snapshot.routeVariants;
  const capableProviders =
    params.params.includeProviderCapabilities === true
      ? apiKeyProviderCapabilities({
          cfg,
          workspaceDir,
        })
      : void 0;
  if (view === "provider-config") {
    const inventoryProjector = createGatewayAgentModelCatalogProjector({
      cfg,
      agentId,
      snapshot: {
        entries: resolveProviderConfigInventoryEntries({
          authoredEntries: buildProviderConfigModelCatalogForBrowse({
            cfg: getRuntimeConfigSourceSnapshot() ?? cfg,
            workspaceDir,
          }),
          canonicalEntries: catalog,
        }),
        routeVariants,
      },
      ...(params.routeResolverFactory ? { routeResolverFactory: params.routeResolverFactory } : {}),
    });
    return {
      models: await buildPublicModelsListEntries({
        catalog: await inventoryProjector.projectCatalog(),
        cfg,
        evaluateEntry: inventoryProjector.evaluateEntry,
        includeInput: true,
        preserveUnknownAvailability: true,
        ...(capableProviders ? { apiKeyCapabilities: capableProviders } : {}),
      }),
    };
  }
  const defaultModel = resolveAgentEffectiveModelPrimary(cfg, agentId);
  const visibilityPolicy = createModelVisibilityPolicy({
    cfg,
    catalog,
    defaultProvider: DEFAULT_PROVIDER,
    defaultModel,
    agentId,
    ...RUNTIME_MODEL_VISIBILITY_NORMALIZATION,
  });
  const evaluateEntry =
    params.catalogProjector?.evaluateEntry ??
    createModelsListEntryEvaluator({
      cfg,
      agentId,
      authResolver: createModelsListAuthResolver({
        cfg,
        agentId,
        includeOpenAIExternalProfiles:
          catalog.some((entry) => normalizeProviderId(entry.provider) === "openai") ||
          [...visibilityPolicy.configuredKeys].some((key) => key.startsWith("openai/")),
        workspaceDir,
        routeResolverFactory: params.routeResolverFactory,
      }),
    });
  return {
    models: await buildPublicModelsListEntries({
      catalog: await resolveLogicalVisibleModelCatalog({
        cfg,
        catalog,
        defaultProvider: DEFAULT_PROVIDER,
        defaultModel,
        agentId,
        workspaceDir,
        view,
        policy: visibilityPolicy,
        routePolicy: openAIModelCatalogRoutePolicy,
        routeVariants,
        evaluateEntry: async (entry, variants) => {
          const evaluation = await evaluateEntry(entry, variants);
          const syntheticLocal =
            !(evaluation.routeResolution !== null) &&
            normalizeProviderId(entry.provider) !== "openai" &&
            evaluation.availability === void 0 &&
            evaluation.evidence === "synthetic";
          return resolveLogicalModelCatalogEntryState({
            entry,
            evaluation,
            authBacked: evaluation.availability === true || syntheticLocal,
            routePolicy: openAIModelCatalogRoutePolicy,
          });
        },
      }),
      cfg,
      evaluateEntry,
      ...(capableProviders ? { apiKeyCapabilities: capableProviders } : {}),
    }),
  };
}
//#endregion
export { createGatewayAgentModelCatalogProjector as n, buildModelsListResult as t };
