import { createHash } from "node:crypto";
import "./src-Bl7G9qvi.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import {
  i as writeCachedAgentModelCatalog,
  n as readCachedAgentModelCatalog,
  t as buildAgentModelCatalogCacheKey,
} from "./model-catalog-state-cache-GF_Tt_1I.js";
import { t as buildModelsJsonSourceFingerprint } from "./models-config-GFqrAsQr.js";
import {
  n as createProviderAuthResolver,
  t as createProviderApiKeyResolver,
} from "./models-config.providers.secrets-Dh4joY6h.js";
import {
  c as resolveProviderOwners,
  p as loadPluginRegistrySnapshotWithMetadata,
  s as resolvePluginContributionOwners,
} from "./plugin-registry-BckMdz4f.js";
import {
  a as runProviderCatalog,
  i as resolveRuntimePluginDiscoveryProviders,
  n as normalizePluginDiscoveryResult,
  o as runProviderStaticCatalog,
  r as providerMatchesFilter,
  t as groupPluginDiscoveryProvidersByOrder,
} from "./provider-discovery-ag_BJ05f.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import {
  f as resolveOwningPluginIdsForProviderRef,
  n as resolveBundledProviderCompatPluginIds,
} from "./providers-D0H29WPB.js";
import { f as loadAuthProfileStoreWithoutExternalProfiles } from "./store-B7DoDdVM.js";
import { g as sortUniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region src/commands/models/list.provider-catalog.ts
/** Provider plugin catalog loading for model-list output. */
const DISCOVERY_ORDERS = ["simple", "profile", "paired", "late"];
const SELF_HOSTED_DISCOVERY_PROVIDER_IDS = /* @__PURE__ */ new Set([
  "lmstudio",
  "ollama",
  "sglang",
  "vllm",
]);
const log = createSubsystemLogger("models/list-provider-catalog");
function buildProviderCatalogEnvCacheFingerprint(env) {
  const entries = Object.entries(env)
    .filter((entry) => entry[1] !== void 0)
    .map(([key, value]) => [key, createHash("sha256").update(value).digest("hex")])
    .toSorted(([left], [right]) =>
      expectDefined(left, "list.provider catalog left").localeCompare(
        expectDefined(right, "list.provider catalog right"),
      ),
    );
  return createHash("sha256").update(JSON.stringify(entries)).digest("hex");
}
function collectMatchingContributionOwners(index, contribution, providerFilter, cfg, options = {}) {
  if (contribution === "providers")
    return [
      ...resolveProviderOwners({
        index,
        providerId: providerFilter,
        includeDisabled: options.includeDisabled,
        config: cfg,
      }),
    ];
  return [
    ...resolvePluginContributionOwners({
      index,
      contribution: "cliBackends",
      matches: (contributionId) => normalizeProviderId(contributionId) === providerFilter,
      includeDisabled: options.includeDisabled,
      config: cfg,
    }),
  ];
}
function resolveInstalledIndexPluginIdsForProviderFilter(params) {
  const snapshot = loadPluginRegistrySnapshotWithMetadata({
    config: params.cfg,
    env: params.env,
    index: params.registryIndex,
  });
  if (snapshot.source !== "persisted" && snapshot.source !== "provided") return;
  const index = snapshot.snapshot;
  const pluginIds = [
    ...collectMatchingContributionOwners(index, "providers", params.providerFilter, params.cfg),
    ...collectMatchingContributionOwners(index, "cliBackends", params.providerFilter, params.cfg),
  ];
  if (pluginIds.length > 0) return sortUniqueStrings(pluginIds);
  return [
    ...collectMatchingContributionOwners(index, "providers", params.providerFilter, params.cfg, {
      includeDisabled: true,
    }),
    ...collectMatchingContributionOwners(index, "cliBackends", params.providerFilter, params.cfg, {
      includeDisabled: true,
    }),
  ].length > 0
    ? []
    : void 0;
}
/** Resolves plugin ids that can provide catalog rows for a provider filter. */
async function resolveProviderCatalogPluginIdsForFilter(params) {
  const providerFilter = normalizeProviderId(params.providerFilter);
  if (!providerFilter) return;
  const installedIndexPluginIds = resolveInstalledIndexPluginIdsForProviderFilter({
    cfg: params.cfg,
    env: params.env,
    providerFilter,
    registryIndex: params.metadataSnapshot?.index ?? params.registryIndex,
  });
  if (installedIndexPluginIds) return installedIndexPluginIds;
  const manifestPluginIds = resolveOwningPluginIdsForProviderRef({
    provider: providerFilter,
    config: params.cfg,
    env: params.env,
    manifestRegistry: params.metadataSnapshot?.manifestRegistry,
  });
  if (manifestPluginIds) return manifestPluginIds;
  const { resolveProviderContractPluginIdsForProviderAlias } =
    await import("./registry-AyOa163j.js");
  const bundledAliasPluginIds = resolveProviderContractPluginIdsForProviderAlias(providerFilter);
  if (bundledAliasPluginIds) return bundledAliasPluginIds;
}
/** Returns true when a provider filter can be satisfied by a static bundled catalog. */
async function hasProviderStaticCatalogForFilter(params) {
  return await hasProviderCatalogForFilter(
    params,
    (provider) => typeof provider.staticCatalog?.run === "function",
    { discoveryEntriesOnly: true },
  );
}
async function hasProviderRuntimeCatalogForFilter(params) {
  return await hasProviderCatalogForFilter(
    params,
    (provider) =>
      typeof provider.catalog?.run === "function" || typeof provider.discovery?.run === "function",
    { discoveryEntriesOnly: false },
  );
}
async function hasProviderCatalogForFilter(params, predicate, options) {
  const env = params.env ?? process.env;
  const providerFilter = normalizeProviderId(params.providerFilter);
  if (!providerFilter) return false;
  const pluginIds = await resolveProviderCatalogPluginIdsForFilter({
    ...params,
    env,
    registryIndex: params.metadataSnapshot?.index ?? params.registryIndex,
  });
  if (!pluginIds || pluginIds.length === 0) return false;
  const bundledPluginIds = resolveBundledProviderCompatPluginIds({
    config: params.cfg,
    env,
    manifestRegistry: params.metadataSnapshot?.manifestRegistry,
  });
  const bundledPluginIdSet = new Set(bundledPluginIds);
  const scopedPluginIds = pluginIds.filter((pluginId) => bundledPluginIdSet.has(pluginId));
  if (scopedPluginIds.length === 0) return false;
  return (
    await resolveRuntimePluginDiscoveryProviders({
      config: params.cfg,
      env,
      onlyPluginIds: scopedPluginIds,
      includeUntrustedWorkspacePlugins: false,
      requireCompleteDiscoveryEntryCoverage: options.discoveryEntriesOnly,
      discoveryEntriesOnly: options.discoveryEntriesOnly,
      pluginMetadataSnapshot: params.metadataSnapshot,
    })
  ).some(
    (provider) =>
      predicate(provider) &&
      providerMatchesFilter({
        provider,
        providerFilter,
      }),
  );
}
function modelFromProviderCatalog(params) {
  return {
    id: params.model.id,
    name: params.model.name || params.model.id,
    provider: params.provider,
    api: params.model.api ?? params.providerConfig.api ?? "openai-responses",
    baseUrl: params.model.baseUrl ?? params.providerConfig.baseUrl,
    reasoning: params.model.reasoning,
    input: params.model.input ?? ["text"],
    cost: params.model.cost,
    contextWindow: params.model.contextWindow,
    contextTokens: params.model.contextTokens,
    maxTokens: params.model.maxTokens,
    headers: params.model.headers,
    compat: params.model.compat,
  };
}
async function runProviderCatalogForList(params) {
  if (params.staticOnly === true)
    return (
      (await runProviderStaticCatalog({
        provider: params.provider,
        config: params.cfg,
        agentDir: params.agentDir,
        env: params.env,
      })) ?? null
    );
  if (
    typeof params.provider.catalog?.run === "function" ||
    typeof params.provider.discovery?.run === "function"
  ) {
    const authStore = loadAuthProfileStoreWithoutExternalProfiles(params.agentDir);
    const resolveProviderApiKey = createProviderApiKeyResolver(params.env, authStore, params.cfg);
    const resolveProviderAuth = createProviderAuthResolver(params.env, authStore, params.cfg);
    try {
      const runtimeResult = await runProviderCatalog({
        provider: params.provider,
        config: params.cfg,
        agentDir: params.agentDir,
        env: params.env,
        resolveProviderApiKey: (providerId) =>
          resolveProviderApiKey(providerId?.trim() || params.provider.id),
        resolveProviderAuth: (providerId, options) =>
          resolveProviderAuth(providerId?.trim() || params.provider.id, options),
      });
      if (runtimeResult) return runtimeResult;
    } catch (error) {
      log.warn(
        `provider runtime catalog failed for ${params.provider.id}: ${formatErrorMessage(error)}`,
      );
    }
  }
  if (typeof params.provider.staticCatalog?.run !== "function") return null;
  return (
    (await runProviderStaticCatalog({
      provider: params.provider,
      config: params.cfg,
      agentDir: params.agentDir,
      env: params.env,
    })) ?? null
  );
}
/** Loads model rows from provider static/runtime catalog hooks for model-list output. */
async function loadProviderCatalogModelsForList(params) {
  const env = params.env ?? process.env;
  const providerFilter = params.providerFilter ? normalizeProviderId(params.providerFilter) : "";
  const onlyPluginIds = providerFilter
    ? await resolveProviderCatalogPluginIdsForFilter({
        cfg: params.cfg,
        env,
        providerFilter,
        registryIndex: params.metadataSnapshot?.index ?? params.registryIndex,
        metadataSnapshot: params.metadataSnapshot,
      })
    : void 0;
  if (providerFilter && !onlyPluginIds) return [];
  const bundledPluginIds = resolveBundledProviderCompatPluginIds({
    config: params.cfg,
    env,
    manifestRegistry: params.metadataSnapshot?.manifestRegistry,
  });
  const bundledPluginIdSet = new Set(bundledPluginIds);
  const scopedPluginIds = onlyPluginIds
    ? onlyPluginIds.filter((pluginId) => bundledPluginIdSet.has(pluginId))
    : bundledPluginIds;
  if (scopedPluginIds.length === 0) return [];
  const sourceFingerprint = await buildModelsJsonSourceFingerprint(params.cfg, params.agentDir, {
    pluginMetadataSnapshot: params.metadataSnapshot,
    providerDiscoveryEntriesOnly: params.staticOnly === true,
    providerDiscoveryProviderIds: scopedPluginIds,
    workspaceDir: params.metadataSnapshot?.workspaceDir,
  });
  const catalogKey = buildAgentModelCatalogCacheKey({
    agentDir: params.agentDir,
    cacheScope: {
      envFingerprint: buildProviderCatalogEnvCacheFingerprint(env),
      source: "models-list-provider-catalog",
      providerFilter,
      scopedPluginIds,
      sourceFingerprint: sourceFingerprint.fingerprint,
      staticOnly: params.staticOnly === true,
    },
    config: params.cfg,
    metadataSnapshot: params.metadataSnapshot,
    workspaceDir: params.metadataSnapshot?.workspaceDir,
  });
  const cached = readCachedAgentModelCatalog({
    agentDir: params.agentDir,
    catalogKey,
  });
  if (cached?.length) return cached;
  const byOrder = groupPluginDiscoveryProvidersByOrder(
    (
      await resolveRuntimePluginDiscoveryProviders({
        config: params.cfg,
        env,
        onlyPluginIds: scopedPluginIds,
        includeUntrustedWorkspacePlugins: false,
        requireCompleteDiscoveryEntryCoverage: params.staticOnly === true,
        discoveryEntriesOnly: params.staticOnly === true,
        pluginMetadataSnapshot: params.metadataSnapshot,
      })
    ).filter(
      (provider) =>
        typeof provider.pluginId === "string" && bundledPluginIdSet.has(provider.pluginId),
    ),
  );
  const rows = [];
  const seen = /* @__PURE__ */ new Set();
  for (const order of DISCOVERY_ORDERS)
    for (const provider of byOrder[order] ?? []) {
      if (!providerFilter && SELF_HOSTED_DISCOVERY_PROVIDER_IDS.has(provider.id)) continue;
      let result;
      try {
        result = await runProviderCatalogForList({
          provider,
          cfg: params.cfg,
          agentDir: params.agentDir,
          env,
          staticOnly: params.staticOnly,
        });
      } catch (error) {
        log.warn(`provider catalog failed for ${provider.id}: ${formatErrorMessage(error)}`);
        result = null;
      }
      const normalized = normalizePluginDiscoveryResult({
        provider,
        result,
      });
      for (const [providerIdRaw, providerConfig] of Object.entries(normalized)) {
        const providerId = normalizeProviderId(providerIdRaw);
        if (providerFilter && providerId !== providerFilter) continue;
        if (!providerId || !Array.isArray(providerConfig.models)) continue;
        for (const model of providerConfig.models) {
          const key = `${providerId}/${model.id}`;
          if (seen.has(key)) continue;
          seen.add(key);
          rows.push(
            modelFromProviderCatalog({
              provider: providerId,
              providerConfig,
              model,
            }),
          );
        }
      }
    }
  const sorted = rows.toSorted((left, right) => {
    const provider = left.provider.localeCompare(right.provider);
    if (provider !== 0) return provider;
    return left.id.localeCompare(right.id);
  });
  writeCachedAgentModelCatalog({
    agentDir: params.agentDir,
    catalogKey,
    entries: sorted,
  });
  return sorted;
}
//#endregion
export {
  resolveProviderCatalogPluginIdsForFilter as i,
  hasProviderStaticCatalogForFilter as n,
  loadProviderCatalogModelsForList as r,
  hasProviderRuntimeCatalogForFilter as t,
};
