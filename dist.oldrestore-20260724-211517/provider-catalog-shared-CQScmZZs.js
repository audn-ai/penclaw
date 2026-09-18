import { createHash } from "node:crypto";
import { t as normalizeModelCatalog } from "./model-catalog-normalize-Ji73MOA0.js";
import { n as normalizeConfiguredProviderCatalogModelId } from "./model-ref-shared-Bs7ONe2Q.js";
import {
  C as resolveExpiresAtMsFromDurationMs,
  m as isFutureDateTimestampMs,
} from "./number-coercion-CJQ8TR--.js";
import { r as resolveProviderRequestCapabilities } from "./provider-attribution-CdW1rMjo.js";
import {
  r as normalizeProviderId,
  t as findNormalizedProviderKey,
} from "./provider-id-BIcU_2-A.js";
import { n as copyRecordEntries } from "./safe-record-Cx9ufCqd.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
//#region src/plugins/provider-catalog.ts
function addApiKeyToProvider(provider, apiKey) {
  try {
    return {
      ...provider,
      apiKey,
    };
  } catch {
    return;
  }
}
/** Finds a provider catalog template entry by normalized provider and template id. */
function findCatalogTemplate(params) {
  return params.templateIds
    .map((templateId) =>
      params.entries.find(
        (entry) =>
          normalizeProviderId(entry.provider) === normalizeProviderId(params.providerId) &&
          normalizeLowercaseStringOrEmpty(entry.id) === normalizeLowercaseStringOrEmpty(templateId),
      ),
    )
    .find((entry) => entry !== void 0);
}
/** Builds a provider catalog result for providers that share one API key. */
async function buildSingleProviderApiKeyCatalog(params) {
  const providerId = normalizeProviderId(params.providerId);
  const apiKey = params.ctx.resolveProviderApiKey(providerId).apiKey;
  if (!apiKey) return null;
  const explicitBaseUrl =
    normalizeOptionalString(
      (params.allowExplicitBaseUrl && params.ctx.config.models?.providers
        ? Object.entries(params.ctx.config.models.providers).find(
            ([configuredProviderId]) => normalizeProviderId(configuredProviderId) === providerId,
          )?.[1]
        : void 0
      )?.baseUrl,
    ) ?? "";
  return {
    provider: {
      ...(await params.buildProvider()),
      ...(explicitBaseUrl ? { baseUrl: explicitBaseUrl } : {}),
      apiKey,
    },
  };
}
/** Builds a multi-provider catalog result backed by one provider API key. */
async function buildPairedProviderApiKeyCatalog(params) {
  const apiKey = params.ctx.resolveProviderApiKey(normalizeProviderId(params.providerId)).apiKey;
  if (!apiKey) return null;
  const providers = await params.buildProviders();
  return {
    providers: Object.fromEntries(
      copyRecordEntries(providers).flatMap(([id, provider]) => {
        const providerWithApiKey = addApiKeyToProvider(provider, apiKey);
        return providerWithApiKey ? [[id, providerWithApiKey]] : [];
      }),
    ),
  };
}
//#endregion
//#region src/plugin-sdk/provider-catalog-shared.ts
const LIVE_CATALOG_CACHE_MAX_ENTRIES = 100;
const liveCatalogCache = /* @__PURE__ */ new Map();
function buildLiveCatalogCacheKey(parts) {
  return createHash("sha256").update(JSON.stringify(parts)).digest("hex");
}
/**
 * Caches one live catalog load promise by stable key parts for a short TTL.
 */
async function getCachedLiveCatalogValue(params) {
  const rawNow = params.now?.() ?? Date.now();
  const ttlMs = params.ttlMs ?? 3e4;
  const key = buildLiveCatalogCacheKey(params.keyParts);
  const existing = liveCatalogCache.get(key);
  if (existing) {
    if (isFutureDateTimestampMs(existing.expiresAt, { nowMs: rawNow })) return await existing.value;
    liveCatalogCache.delete(key);
  }
  const value = params.load();
  const expiresAt = resolveExpiresAtMsFromDurationMs(ttlMs, { nowMs: rawNow });
  if (expiresAt !== void 0) {
    if (liveCatalogCache.size >= LIVE_CATALOG_CACHE_MAX_ENTRIES) {
      const oldestKey = liveCatalogCache.keys().next();
      if (!oldestKey.done) liveCatalogCache.delete(oldestKey.value);
    }
    liveCatalogCache.set(key, {
      expiresAt,
      value,
    });
  }
  try {
    const resolved = await value;
    if (params.shouldCache && !params.shouldCache(resolved)) liveCatalogCache.delete(key);
    return resolved;
  } catch (err) {
    liveCatalogCache.delete(key);
    throw err;
  }
}
/**
 * Clears the process-local live catalog cache for tests and isolated plugin probes.
 */
function clearLiveCatalogCacheForTests() {
  liveCatalogCache.clear();
}
function countRawManifestCatalogModels(catalog) {
  if (!catalog || typeof catalog !== "object") return;
  const models = catalog.models;
  return Array.isArray(models) ? models.length : void 0;
}
function cloneManifestCatalogTieredCost(tier) {
  return {
    input: tier.input,
    output: tier.output,
    cacheRead: tier.cacheRead,
    cacheWrite: tier.cacheWrite,
    range: tier.range.length === 1 ? [tier.range[0]] : [tier.range[0], tier.range[1]],
  };
}
function cloneManifestCatalogCost(cost) {
  return {
    input: cost.input ?? 0,
    output: cost.output ?? 0,
    cacheRead: cost.cacheRead ?? 0,
    cacheWrite: cost.cacheWrite ?? 0,
    ...(cost.tieredPricing
      ? { tieredPricing: cost.tieredPricing.map(cloneManifestCatalogTieredCost) }
      : {}),
  };
}
function buildManifestCatalogModelInput(model) {
  if (model.input?.includes("document"))
    throw new Error(
      `Manifest modelCatalog row ${model.id} uses unsupported runtime input document`,
    );
  return model.input?.filter((item) => item !== "document") ?? ["text"];
}
function cloneManifestCatalogMediaInput(mediaInput) {
  if (!mediaInput?.image) return;
  return { image: { ...mediaInput.image } };
}
function buildManifestCatalogModel(providerId, model) {
  if (model.contextWindow === void 0)
    throw new Error(`Manifest modelCatalog row ${model.id} is missing contextWindow`);
  if (model.maxTokens === void 0)
    throw new Error(`Manifest modelCatalog row ${model.id} is missing maxTokens`);
  const id = normalizeConfiguredProviderCatalogModelId(providerId, model.id, {
    allowManifestNormalization: false,
  });
  return {
    id,
    name: model.name ?? id,
    ...(model.api ? { api: model.api } : {}),
    ...(model.baseUrl ? { baseUrl: model.baseUrl } : {}),
    reasoning: model.reasoning ?? false,
    input: buildManifestCatalogModelInput(model),
    cost: cloneManifestCatalogCost(model.cost ?? {}),
    contextWindow: model.contextWindow,
    ...(model.contextTokens !== void 0 ? { contextTokens: model.contextTokens } : {}),
    maxTokens: model.maxTokens,
    ...(model.thinkingLevelMap ? { thinkingLevelMap: { ...model.thinkingLevelMap } } : {}),
    ...(model.headers ? { headers: { ...model.headers } } : {}),
    ...(model.compat ? { compat: { ...model.compat } } : {}),
    ...(model.mediaInput ? { mediaInput: cloneManifestCatalogMediaInput(model.mediaInput) } : {}),
  };
}
/**
 * Converts a plugin manifest modelCatalog provider into runtime provider config.
 */
function buildManifestModelProviderConfig(params) {
  const catalog = normalizeModelCatalog(
    { providers: { [params.providerId]: params.catalog } },
    { ownedProviders: /* @__PURE__ */ new Set([params.providerId]) },
  )?.providers?.[params.providerId];
  if (!catalog) throw new Error(`Missing modelCatalog.providers.${params.providerId}`);
  if (!catalog.baseUrl)
    throw new Error(`Missing modelCatalog.providers.${params.providerId}.baseUrl`);
  const rawModelCount = countRawManifestCatalogModels(params.catalog);
  if (rawModelCount !== void 0 && rawModelCount !== catalog.models.length)
    throw new Error(`Invalid modelCatalog.providers.${params.providerId}.models`);
  return {
    baseUrl: catalog.baseUrl,
    ...(catalog.api ? { api: catalog.api } : {}),
    ...(catalog.headers ? { headers: { ...catalog.headers } } : {}),
    models: catalog.models.map((model) => buildManifestCatalogModel(params.providerId, model)),
  };
}
function normalizeConfiguredCatalogModelInput(input) {
  if (!Array.isArray(input)) return;
  const normalized = input.filter(
    (item) =>
      item === "text" ||
      item === "image" ||
      item === "audio" ||
      item === "video" ||
      item === "document",
  );
  return normalized.length > 0 ? normalized : void 0;
}
function resolveConfiguredProviderModels(config, providerId) {
  const providers = config?.models?.providers;
  if (!providers || typeof providers !== "object") return [];
  const providerKey = findNormalizedProviderKey(providers, providerId);
  if (!providerKey) return [];
  const providerConfig = providers[providerKey];
  if (!providerConfig || typeof providerConfig !== "object") return [];
  return Array.isArray(providerConfig.models) ? providerConfig.models : [];
}
/**
 * Reads user-configured provider models as catalog entries for plugin discovery output.
 */
function readConfiguredProviderCatalogEntries(params) {
  const provider = params.publishedProviderId ?? params.providerId;
  const models = resolveConfiguredProviderModels(params.config, params.providerId);
  const entries = [];
  for (const model of models) {
    if (!model || typeof model !== "object") continue;
    const id = typeof model.id === "string" ? model.id.trim() : "";
    if (!id) continue;
    const normalizedId = normalizeConfiguredProviderCatalogModelId(provider, id);
    const name =
      (typeof model.name === "string" ? model.name : normalizedId).trim() || normalizedId;
    const contextWindow =
      typeof model.contextWindow === "number" && model.contextWindow > 0
        ? model.contextWindow
        : void 0;
    const reasoning = typeof model.reasoning === "boolean" ? model.reasoning : void 0;
    const input = normalizeConfiguredCatalogModelInput(model.input);
    entries.push({
      provider,
      id: normalizedId,
      name,
      ...(contextWindow ? { contextWindow } : {}),
      ...(reasoning !== void 0 ? { reasoning } : {}),
      ...(input ? { input } : {}),
    });
  }
  return entries;
}
function withStreamingUsageCompat(provider) {
  if (!Array.isArray(provider.models) || provider.models.length === 0) return provider;
  let changed = false;
  const models = provider.models.map((model) => {
    if (model.compat?.supportsUsageInStreaming !== void 0) return model;
    changed = true;
    return {
      ...model,
      compat: {
        ...model.compat,
        supportsUsageInStreaming: true,
      },
    };
  });
  return changed
    ? {
        ...provider,
        models,
      }
    : provider;
}
/**
 * Returns whether a provider transport can report native usage while streaming.
 */
function supportsNativeStreamingUsageCompat(params) {
  return resolveProviderRequestCapabilities({
    provider: params.providerId,
    api: "openai-completions",
    baseUrl: params.baseUrl,
    capability: "llm",
    transport: "stream",
  }).supportsNativeStreamingUsageCompat;
}
/**
 * Marks models as streaming-usage compatible when provider transport capabilities allow it.
 */
function applyProviderNativeStreamingUsageCompat(params) {
  return supportsNativeStreamingUsageCompat({
    providerId: params.providerId,
    baseUrl: params.providerConfig.baseUrl,
  })
    ? withStreamingUsageCompat(params.providerConfig)
    : params.providerConfig;
}
//#endregion
export {
  readConfiguredProviderCatalogEntries as a,
  buildSingleProviderApiKeyCatalog as c,
  getCachedLiveCatalogValue as i,
  findCatalogTemplate as l,
  buildManifestModelProviderConfig as n,
  supportsNativeStreamingUsageCompat as o,
  clearLiveCatalogCacheForTests as r,
  buildPairedProviderApiKeyCatalog as s,
  applyProviderNativeStreamingUsageCompat as t,
};
