import { randomUUID } from "node:crypto";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import chokidar from "chokidar";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import {
  a as resolveAgentDir,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import { t as getEmbeddingProvider } from "./embedding-provider-runtime-BSH7bFMk.js";
import {
  _ as sessionPathForFile,
  b as listSessionTranscriptCorpusEntriesForAgent,
  h as resolveSessionFileForSyncTarget,
  l as buildSessionEntry,
  m as parseCanonicalSessionSyncTargetFromPath,
  v as sessionPathForSessionIdentity,
  y as statSessionEntrySync,
} from "./engine-qmd-sbHvD8ZT.js";
import {
  i as loadSqliteVecExtension,
  n as configureMemorySqliteWalMaintenance,
  r as requireMemoryHostNodeSqlite,
  t as closeMemorySqliteWalMaintenance,
} from "./engine-storage-DV2x5DKD.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import { t as isFileMissingError } from "./fs-utils-urkAyyL8.js";
import { n as resolveGlobalSingleton } from "./global-singleton-PwlQSEal.js";
import { r as retryTransientMemoryRead, t as hashText } from "./hash-DsDOoPhE.js";
import "./error-runtime-BIAwr399.js";
import "./number-runtime-B-n-wjMn.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import {
  a as ensureMemoryHostDir,
  c as normalizeExtraMemoryPaths,
  d as runMemoryHostTasksWithConcurrency,
  f as hasNonTextEmbeddingParts,
  i as cosineSimilarity,
  l as parseEmbedding,
  n as buildMultimodalChunkForIndexing,
  r as chunkMarkdown,
  s as listMemoryFiles,
  t as buildFileEntry,
  u as remapChunkLines,
} from "./internal-Dd4OzKYD.js";
import {
  A as isEmbeddingBatchUnavailableError,
  u as enforceEmbeddingMaxInputTokens,
} from "./memory-core-host-engine-embeddings-C-z4ELNB.js";
import {
  r as listRegisteredMemoryEmbeddingProviderAdapters,
  t as getMemoryEmbeddingProvider,
} from "./memory-embedding-provider-runtime-DO4orj5r.js";
import { t as resolveMemorySearchConfig } from "./memory-search-C1x_ATR9.js";
import "./routing-CwvmVRHd.js";
import { r as classifyMemoryMultimodalPath } from "./multimodal-1dt2YOuy.js";
import {
  j as resolveTimerTimeoutMs,
  n as MAX_TIMER_TIMEOUT_MS,
} from "./number-coercion-CJQ8TR--.js";
import {
  C as ensureMemoryIndexSchema,
  S as dropMemoryPathFtsTriggers,
  g as MEMORY_INDEX_FTS_TABLE,
  m as MEMORY_EMBEDDING_CACHE_TABLE,
  s as ensureOpenClawAgentDatabaseSchema,
  v as MEMORY_INDEX_PATHS_FTS_TABLE,
  w as ensureMemoryPathFtsTriggers,
  x as MEMORY_INDEX_VECTOR_TABLE,
} from "./openclaw-agent-db-VC51jrBW.js";
import {
  c as resolveSessionTranscriptsDirForAgent,
  g as isSessionArchiveArtifactName,
  x as parseUsageCountedSessionIdFromFileName,
  y as isUsageCountedSessionTranscriptFileName,
} from "./paths-TfuVT-K8.js";
import { t as extractKeywords } from "./query-expansion-DzoKGtnD.js";
import { n as readMemoryFile } from "./read-file-B9SxqQrC.js";
import "./embedding-providers-DR7cHtDv.js";
import "./sqlite-runtime-CAq0c_tq.js";
import "./memory-core-host-embedding-registry-DvATEsxC.js";
import { n as parseSqliteSessionFileMarker } from "./sqlite-marker-BejbySI1.js";
import "./memory-core-host-engine-foundation-GFDZKXDt.js";
import { r as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DLqNjJHV.js";
import "./memory-core-host-engine-qmd-Cgk374S9.js";
import "./memory-core-host-engine-storage-eNQx81fD.js";
import "./dreaming-shared-BS6J1klu.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import {
  _ as uniqueStrings,
  l as normalizeStringEntries,
  u as normalizeStringEntriesLower,
  v as uniqueValues,
} from "./string-normalization-CRyoFBPt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { r as tokenize, t as jaccardSimilarity } from "./tokenize-C8vgcu8i.js";
import { n as onInternalSessionTranscriptUpdate } from "./transcript-events-BodrDS39.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import {
  i as warnIfMemoryWatchPressureHigh,
  n as settleMemoryWatchEventPaths,
  r as countChokidarWatchedEntries,
  t as recordMemoryWatchEventPath,
} from "./watch-settle-C1cbmodw.js";
//#region extensions/memory-core/src/memory/embedding-local-service.ts
const LOCAL_SERVICE_HOST_IDENTITIES = resolveGlobalSingleton(
  Symbol.for("openclaw.memoryLocalServiceHostIdentities"),
  () => ({
    ids: /* @__PURE__ */ new WeakMap(),
    nextId: 1,
  }),
);
function resolveMemoryCoreLocalServiceHostIdentity(acquireLocalService) {
  if (!acquireLocalService) return "none";
  let id = LOCAL_SERVICE_HOST_IDENTITIES.ids.get(acquireLocalService);
  if (id === void 0) {
    id = LOCAL_SERVICE_HOST_IDENTITIES.nextId;
    LOCAL_SERVICE_HOST_IDENTITIES.nextId += 1;
    LOCAL_SERVICE_HOST_IDENTITIES.ids.set(acquireLocalService, id);
  }
  return String(id);
}
//#endregion
//#region extensions/memory-core/src/memory/embeddings.ts
const DEFAULT_MEMORY_EMBEDDING_PROVIDER = "openai";
const LOCAL_LLAMA_CPP_PROVIDER_ID = "local";
const LOCAL_EMBEDDING_RUNTIME_FACTS$1 = Symbol.for("openclaw.localEmbeddingRuntimeFacts");
function createMissingLlamaCppProviderError() {
  return new Error(
    [
      "Unknown memory embedding provider: local.",
      "Local GGUF embeddings are provided by the official llama.cpp provider plugin.",
      "Install it with: openclaw plugins install @openclaw/llama-cpp-provider",
      "Then restart OpenClaw and retry: openclaw memory status --deep",
    ].join("\n"),
  );
}
function adaptGenericEmbeddingProvider(provider) {
  const adapted = {
    id: provider.id,
    model: provider.model,
    ...(typeof provider.maxInputTokens === "number"
      ? { maxInputTokens: provider.maxInputTokens }
      : {}),
    embedQuery: async (text, options) =>
      await provider.embed(text, {
        ...options,
        inputType: "query",
      }),
    embedBatch: async (texts, options) =>
      await provider.embedBatch(texts, {
        ...options,
        inputType: "document",
      }),
    embedBatchInputs: async (inputs, options) =>
      await provider.embedBatch(inputs, {
        ...options,
        inputType: "document",
      }),
    ...(provider.close ? { close: provider.close } : {}),
  };
  const getRuntimeFacts = Reflect.get(provider, LOCAL_EMBEDDING_RUNTIME_FACTS$1);
  if (typeof getRuntimeFacts === "function")
    Object.defineProperty(adapted, LOCAL_EMBEDDING_RUNTIME_FACTS$1, {
      enumerable: false,
      value: getRuntimeFacts,
    });
  return adapted;
}
function adaptGenericRuntime(runtime) {
  if (!runtime) return;
  return {
    id: runtime.id,
    ...(runtime.cacheKeyData ? { cacheKeyData: runtime.cacheKeyData } : {}),
    ...(runtime.indexIdentityAliases?.length
      ? { indexIdentityAliases: runtime.indexIdentityAliases }
      : {}),
    ...(typeof runtime.inlineQueryTimeoutMs === "number"
      ? { inlineQueryTimeoutMs: runtime.inlineQueryTimeoutMs }
      : {}),
    ...(typeof runtime.inlineBatchTimeoutMs === "number"
      ? { inlineBatchTimeoutMs: runtime.inlineBatchTimeoutMs }
      : {}),
  };
}
function adaptGenericEmbeddingAdapter(adapter) {
  const resolveIndexIdentity = adapter.resolveIndexIdentity;
  return {
    id: adapter.id,
    ...(adapter.defaultModel ? { defaultModel: adapter.defaultModel } : {}),
    ...(adapter.transport ? { transport: adapter.transport } : {}),
    ...(adapter.authProviderId ? { authProviderId: adapter.authProviderId } : {}),
    ...(adapter.formatSetupError ? { formatSetupError: adapter.formatSetupError } : {}),
    ...(resolveIndexIdentity
      ? {
          resolveIndexIdentity: (options) =>
            resolveIndexIdentity({
              ...options,
              ...(typeof options.outputDimensionality === "number"
                ? { dimensions: options.outputDimensionality }
                : {}),
            }),
        }
      : {}),
    create: async (options) => {
      const result = await adapter.create({
        ...options,
        ...(typeof options.outputDimensionality === "number"
          ? { dimensions: options.outputDimensionality }
          : {}),
      });
      return {
        provider: result.provider ? adaptGenericEmbeddingProvider(result.provider) : null,
        runtime: adaptGenericRuntime(result.runtime),
      };
    },
  };
}
function formatProviderError(adapter, err) {
  return adapter.formatSetupError?.(err) ?? formatErrorMessage(err);
}
function getAdapter(id, config) {
  const adapter = getMemoryEmbeddingProvider(id, config);
  if (adapter) return adapter;
  const genericAdapter = getEmbeddingProvider(id, config);
  if (genericAdapter) return adaptGenericEmbeddingAdapter(genericAdapter);
  if (id === LOCAL_LLAMA_CPP_PROVIDER_ID) throw createMissingLlamaCppProviderError();
  throw new Error(`Unknown memory embedding provider: ${id}`);
}
function resolveProviderModel(adapter, requestedModel) {
  const trimmed = requestedModel.trim();
  if (trimmed) return trimmed;
  return adapter.defaultModel ?? "";
}
function resolveEmbeddingProviderFallbackModel(providerId, fallbackSourceModel, config) {
  return (
    (getMemoryEmbeddingProvider(providerId, config) ?? getEmbeddingProvider(providerId, config))
      ?.defaultModel ?? fallbackSourceModel
  );
}
function resolveEmbeddingProviderAdapterId(providerId, config) {
  try {
    return getAdapter(providerId, config).id;
  } catch {
    return;
  }
}
function resolveEmbeddingProviderAdapterTransport(providerId, config) {
  try {
    return getAdapter(providerId, config).transport;
  } catch {
    return;
  }
}
function resolveEmbeddingProviderIndexIdentity(options) {
  const provider =
    options.provider === "auto" ? DEFAULT_MEMORY_EMBEDDING_PROVIDER : options.provider;
  try {
    const adapter = getAdapter(provider, options.config);
    const model = resolveProviderModel(adapter, options.model);
    const identity = adapter.resolveIndexIdentity?.({
      ...options,
      provider,
      model,
    });
    return identity
      ? {
          provider: {
            id: adapter.id,
            model: identity.model,
          },
          cacheKeyData: identity.cacheKeyData,
          aliases: identity.aliases,
        }
      : void 0;
  } catch {
    return;
  }
}
async function createWithAdapter(adapter, options) {
  const createOptions = {
    ...options,
    model: resolveProviderModel(adapter, options.model),
  };
  const result = await adapter.create(createOptions);
  return {
    provider: result.provider,
    requestedProvider: options.provider,
    runtime: result.runtime,
  };
}
async function createEmbeddingProvider(options) {
  const provider =
    options.provider === "auto" ? DEFAULT_MEMORY_EMBEDDING_PROVIDER : options.provider;
  const primaryAdapter = getAdapter(provider, options.config);
  try {
    return await createWithAdapter(primaryAdapter, {
      ...options,
      provider,
    });
  } catch (primaryErr) {
    const reason = formatProviderError(primaryAdapter, primaryErr);
    if (options.fallback && options.fallback !== "none" && options.fallback !== provider) {
      const fallbackAdapter = getAdapter(options.fallback, options.config);
      try {
        return {
          ...(await createWithAdapter(fallbackAdapter, {
            ...options,
            provider: options.fallback,
          })),
          requestedProvider: provider,
          fallbackFrom: provider,
          fallbackReason: reason,
        };
      } catch (fallbackErr) {
        const fallbackReason = formatProviderError(fallbackAdapter, fallbackErr);
        const wrapped = /* @__PURE__ */ new Error(
          `${reason}\n\nFallback to ${options.fallback} failed: ${fallbackReason}`,
        );
        wrapped.cause = primaryErr;
        throw wrapped;
      }
    }
    const wrapped = new Error(reason);
    wrapped.cause = primaryErr;
    throw wrapped;
  }
}
//#endregion
//#region extensions/memory-core/src/memory/mmr.ts
const DEFAULT_MMR_CONFIG = {
  enabled: false,
  lambda: 0.7,
};
/**
 * Compute the maximum similarity between an item and all selected items.
 */
function maxSimilarityToSelected(item, selectedItems, tokenCache) {
  if (selectedItems.length === 0) return 0;
  let maxSim = 0;
  const itemTokens = tokenCache.get(item.id) ?? tokenize(item.content);
  for (const selected of selectedItems) {
    const sim = jaccardSimilarity(
      itemTokens,
      tokenCache.get(selected.id) ?? tokenize(selected.content),
    );
    if (sim > maxSim) maxSim = sim;
  }
  return maxSim;
}
/**
 * Compute MMR score for a candidate item.
 * MMR = λ * relevance - (1-λ) * max_similarity_to_selected
 */
function computeMMRScore(relevance, maxSimilarity, lambda) {
  return lambda * relevance - (1 - lambda) * maxSimilarity;
}
/**
 * Re-rank items using Maximal Marginal Relevance (MMR).
 *
 * The algorithm iteratively selects items that balance relevance with diversity:
 * 1. Start with the highest-scoring item
 * 2. For each remaining slot, select the item that maximizes the MMR score
 * 3. MMR score = λ * relevance - (1-λ) * max_similarity_to_already_selected
 *
 * @param items - Items to re-rank, must have score and content
 * @param config - MMR configuration (lambda, enabled)
 * @returns Re-ranked items in MMR order
 */
function mmrRerank(items, config = {}) {
  const { enabled = DEFAULT_MMR_CONFIG.enabled, lambda = DEFAULT_MMR_CONFIG.lambda } = config;
  if (!enabled || items.length <= 1) return [...items];
  const clampedLambda = Math.max(0, Math.min(1, lambda));
  if (clampedLambda === 1) return [...items].toSorted((a, b) => b.score - a.score);
  const tokenCache = /* @__PURE__ */ new Map();
  for (const item of items) tokenCache.set(item.id, tokenize(item.content));
  const maxScore = Math.max(...items.map((i) => i.score));
  const minScore = Math.min(...items.map((i) => i.score));
  const scoreRange = maxScore - minScore;
  const normalizeScore = (score) => {
    if (scoreRange === 0) return 1;
    return (score - minScore) / scoreRange;
  };
  const selected = [];
  const remaining = new Set(items);
  while (remaining.size > 0) {
    let bestItem = null;
    let bestMMRScore = -Infinity;
    for (const candidate of remaining) {
      const mmrScore = computeMMRScore(
        normalizeScore(candidate.score),
        maxSimilarityToSelected(candidate, selected, tokenCache),
        clampedLambda,
      );
      if (
        mmrScore > bestMMRScore ||
        (mmrScore === bestMMRScore && candidate.score > (bestItem?.score ?? -Infinity))
      ) {
        bestMMRScore = mmrScore;
        bestItem = candidate;
      }
    }
    if (bestItem) {
      selected.push(bestItem);
      remaining.delete(bestItem);
    } else break;
  }
  return selected;
}
/**
 * Apply MMR re-ranking to hybrid search results.
 * Adapts the generic MMR function to work with the hybrid search result format.
 */
function applyMMRToHybridResults(results, config = {}) {
  if (results.length === 0) return results;
  const itemById = /* @__PURE__ */ new Map();
  return mmrRerank(
    results.map((r, index) => {
      const id = `${r.path}:${r.startLine}:${index}`;
      itemById.set(id, r);
      return {
        id,
        score: r.score,
        content: r.snippet,
      };
    }),
    config,
  ).map((item) => itemById.get(item.id));
}
//#endregion
//#region extensions/memory-core/src/memory/temporal-decay.ts
const DEFAULT_TEMPORAL_DECAY_CONFIG = {
  enabled: false,
  halfLifeDays: 30,
};
const DAY_MS = 1440 * 60 * 1e3;
const DATED_MEMORY_PATH_RE = /(?:^|\/)memory\/(\d{4})-(\d{2})-(\d{2})\.md$/;
function toDecayLambda(halfLifeDays) {
  if (!Number.isFinite(halfLifeDays) || halfLifeDays <= 0) return 0;
  return Math.LN2 / halfLifeDays;
}
function calculateTemporalDecayMultiplier(params) {
  const lambda = toDecayLambda(params.halfLifeDays);
  const clampedAge = Math.max(0, params.ageInDays);
  if (lambda <= 0 || !Number.isFinite(clampedAge)) return 1;
  return Math.exp(-lambda * clampedAge);
}
function applyTemporalDecayToScore(params) {
  return params.score * calculateTemporalDecayMultiplier(params);
}
function parseMemoryDateFromPath(filePath) {
  const normalized = filePath.replaceAll("\\", "/").replace(/^\.\//, "");
  const match = DATED_MEMORY_PATH_RE.exec(normalized);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null;
  const timestamp = Date.UTC(year, month - 1, day);
  const parsed = new Date(timestamp);
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  )
    return null;
  return parsed;
}
function isEvergreenMemoryPath(filePath) {
  const normalized = filePath.replaceAll("\\", "/").replace(/^\.\//, "");
  if (normalized === "MEMORY.md") return true;
  if (!normalized.startsWith("memory/")) return false;
  return !DATED_MEMORY_PATH_RE.test(normalized);
}
async function extractTimestamp(params) {
  const fromPath = parseMemoryDateFromPath(params.filePath);
  if (fromPath) return fromPath;
  if (params.source === "memory" && isEvergreenMemoryPath(params.filePath)) return null;
  if (!params.workspaceDir) return null;
  const absolutePath = path.isAbsolute(params.filePath)
    ? params.filePath
    : path.resolve(params.workspaceDir, params.filePath);
  try {
    const stat = await fs$1.stat(absolutePath);
    if (!Number.isFinite(stat.mtimeMs)) return null;
    return new Date(stat.mtimeMs);
  } catch {
    return null;
  }
}
function ageInDaysFromTimestamp(timestamp, nowMs) {
  return Math.max(0, nowMs - timestamp.getTime()) / DAY_MS;
}
async function applyTemporalDecayToHybridResults(params) {
  const config = {
    ...DEFAULT_TEMPORAL_DECAY_CONFIG,
    ...params.temporalDecay,
  };
  if (!config.enabled) return [...params.results];
  const nowMs = params.nowMs ?? Date.now();
  const timestampPromiseCache = /* @__PURE__ */ new Map();
  return Promise.all(
    params.results.map(async (entry) => {
      const cacheKey = `${entry.source}:${entry.path}`;
      let timestampPromise = timestampPromiseCache.get(cacheKey);
      if (!timestampPromise) {
        timestampPromise = extractTimestamp({
          filePath: entry.path,
          source: entry.source,
          workspaceDir: params.workspaceDir,
        });
        timestampPromiseCache.set(cacheKey, timestampPromise);
      }
      const timestamp = await timestampPromise;
      if (!timestamp) return entry;
      const decayedScore = applyTemporalDecayToScore({
        score: entry.score,
        ageInDays: ageInDaysFromTimestamp(timestamp, nowMs),
        halfLifeDays: config.halfLifeDays,
      });
      return {
        ...entry,
        score: decayedScore,
      };
    }),
  );
}
//#endregion
//#region extensions/memory-core/src/memory/hybrid.ts
function buildFtsQuery(raw) {
  const tokens = normalizeStringEntries(raw.match(/[\p{L}\p{N}_]+/gu) ?? []);
  if (tokens.length === 0) return null;
  return tokens.map((t) => `"${t.replaceAll('"', "")}"`).join(" AND ");
}
function bm25RankToScore(rank) {
  if (!Number.isFinite(rank)) return 1 / 1e3;
  if (rank < 0) {
    const relevance = -rank;
    return relevance / (1 + relevance);
  }
  return 1 / (1 + rank);
}
function scoreExactPathTieForTemporalDecay(contentScore) {
  return (1 + Math.max(0, Math.min(1, contentScore))) / 2;
}
async function mergeHybridResults(params) {
  const byId = /* @__PURE__ */ new Map();
  for (const r of params.vector)
    byId.set(r.id, {
      id: r.id,
      path: r.path,
      startLine: r.startLine,
      endLine: r.endLine,
      source: r.source,
      snippet: r.snippet,
      vectorScore: r.vectorScore,
      textScore: 0,
      rankingScore: 0,
      pathScore: 0,
      exactPathSpecificity: r.exactPathSpecificity ?? 0,
    });
  for (const r of params.keyword) {
    const exactPathSpecificity = r.exactPathSpecificity ?? 0;
    const existing = byId.get(r.id);
    if (existing) {
      existing.textScore = r.textScore;
      existing.rankingScore = r.rankingScore ?? r.textScore;
      existing.pathScore = r.pathScore ?? 0;
      existing.exactPathSpecificity = Math.max(existing.exactPathSpecificity, exactPathSpecificity);
      if (r.snippet && r.snippet.length > 0) existing.snippet = r.snippet;
    } else
      byId.set(r.id, {
        id: r.id,
        path: r.path,
        startLine: r.startLine,
        endLine: r.endLine,
        source: r.source,
        snippet: r.snippet,
        vectorScore: 0,
        textScore: r.textScore,
        rankingScore: r.rankingScore ?? r.textScore,
        pathScore: r.pathScore ?? 0,
        exactPathSpecificity,
      });
  }
  const temporalDecayConfig = {
    ...DEFAULT_TEMPORAL_DECAY_CONFIG,
    ...params.temporalDecay,
  };
  const rankable = (
    await applyTemporalDecayToHybridResults({
      results: Array.from(byId.values()).map((entry) => {
        const keywordScore =
          entry.textScore > 0
            ? entry.rankingScore
            : entry.exactPathSpecificity > 0
              ? 0
              : entry.pathScore;
        const contentScore =
          params.vectorWeight * entry.vectorScore + params.textWeight * keywordScore;
        const hasWeightedContentRelevance = contentScore > 0;
        const weightedScore =
          entry.exactPathSpecificity > 0
            ? temporalDecayConfig.enabled
              ? scoreExactPathTieForTemporalDecay(contentScore)
              : hasWeightedContentRelevance
                ? contentScore
                : 1
            : contentScore;
        return {
          path: entry.path,
          startLine: entry.startLine,
          endLine: entry.endLine,
          score: weightedScore,
          vectorScore: entry.vectorScore,
          textScore: entry.textScore,
          exactPathSpecificity: entry.exactPathSpecificity,
          hasWeightedContentRelevance,
          snippet: entry.snippet,
          source: entry.source,
        };
      }),
      temporalDecay: temporalDecayConfig,
      workspaceDir: params.workspaceDir,
      nowMs: params.nowMs,
    })
  ).map((entry) => {
    const exactPathTieScore = entry.score;
    return Object.assign(entry, {
      exactPathTieScore,
      score: entry.exactPathSpecificity > 0 ? 1 : entry.score,
    });
  });
  const nonExact = rankable
    .filter((entry) => entry.exactPathSpecificity === 0)
    .toSorted((a, b) => b.score - a.score);
  const mmrConfig = {
    ...DEFAULT_MMR_CONFIG,
    ...params.mmr,
  };
  const rerankExactGroup = (entries) => {
    if (!mmrConfig.enabled) return entries;
    return applyMMRToHybridResults(
      entries.map((entry) => Object.assign(entry, { score: entry.exactPathTieScore })),
      mmrConfig,
    ).map((entry) => Object.assign(entry, { score: 1 }));
  };
  const compareExactTieScores = (a, b) =>
    b.exactPathTieScore - a.exactPathTieScore ||
    a.path.localeCompare(b.path) ||
    a.startLine - b.startLine ||
    a.endLine - b.endLine;
  return [
    ...[3, 2, 1].flatMap((specificity) => {
      const tier = rankable
        .filter((entry) => entry.exactPathSpecificity === specificity)
        .toSorted(compareExactTieScores);
      if (temporalDecayConfig.enabled) return rerankExactGroup(tier);
      const contentBacked = tier.filter((entry) => entry.hasWeightedContentRelevance);
      const pathOnly = tier.filter((entry) => !entry.hasWeightedContentRelevance);
      return rerankExactGroup(contentBacked).concat(rerankExactGroup(pathOnly));
    }),
    ...(mmrConfig.enabled ? applyMMRToHybridResults(nonExact, mmrConfig) : nonExact),
  ].map(
    ({
      exactPathSpecificity: _exactPathSpecificity,
      exactPathTieScore: _exactPathTieScore,
      hasWeightedContentRelevance: _hasWeightedContentRelevance,
      ...entry
    }) => entry,
  );
}
//#endregion
//#region extensions/memory-core/src/memory/manager-async-state.ts
async function startAsyncSearchSync(params) {
  if (!params.enabled || (!params.dirty && !params.sessionsDirty)) return;
  try {
    await params.sync({ reason: "search" });
  } catch (err) {
    params.onError(err);
  }
}
async function awaitPendingManagerWork(params) {
  if (params.pendingSync)
    try {
      await params.pendingSync;
    } catch (err) {
      params.onError?.(err);
    }
  if (params.pendingProviderInit)
    try {
      await params.pendingProviderInit;
    } catch (err) {
      params.onError?.(err);
    }
}
function resetMemoryBatchFailureState(state) {
  return {
    ...state,
    count: 0,
    lastError: void 0,
    lastProvider: void 0,
  };
}
function recordMemoryBatchFailure(state, params) {
  if (!state.enabled) return state;
  const increment = params.forceDisable ? 2 : params.attempts;
  const count = state.count + increment;
  return {
    enabled: !(params.forceDisable || count >= 2),
    count,
    lastError: params.message,
    lastProvider: params.provider,
  };
}
//#endregion
//#region extensions/memory-core/src/memory/manager-cache.ts
function resolveSingletonManagedCache(cacheKey) {
  const resolved = resolveGlobalSingleton(cacheKey, () => ({
    cache: /* @__PURE__ */ new Map(),
    pending: /* @__PURE__ */ new Map(),
  }));
  if (
    typeof resolved === "object" &&
    resolved !== null &&
    resolved.cache instanceof Map &&
    resolved.pending instanceof Map
  )
    return resolved;
  const repaired = {
    cache: /* @__PURE__ */ new Map(),
    pending: /* @__PURE__ */ new Map(),
  };
  globalThis[cacheKey] = repaired;
  return repaired;
}
async function getOrCreateManagedCacheEntry(params) {
  if (params.bypassCache) return await params.create();
  const existing = params.cache.get(params.key);
  if (existing) return existing;
  const pending = params.pending.get(params.key);
  if (pending) return pending;
  const createPromise = (async () => {
    const refreshed = params.cache.get(params.key);
    if (refreshed) return refreshed;
    const entry = await params.create();
    params.cache.set(params.key, entry);
    return entry;
  })();
  params.pending.set(params.key, createPromise);
  try {
    return await createPromise;
  } finally {
    if (params.pending.get(params.key) === createPromise) params.pending.delete(params.key);
  }
}
async function closeManagedCacheEntries(params) {
  const pending = Array.from(params.pending.values());
  if (pending.length > 0) await Promise.allSettled(pending);
  const entries = Array.from(params.cache.values());
  params.cache.clear();
  for (const entry of entries) {
    if (typeof entry.close !== "function") continue;
    try {
      await entry.close();
    } catch (err) {
      params.onCloseError?.(err);
    }
  }
}
//#endregion
//#region extensions/memory-core/src/memory/manager-reindex-lock.ts
function resolveMemoryReindexLockPath(dbPath) {
  return `${dbPath}.reindex-lock.sqlite`;
}
function isSqliteBusyError(err) {
  const code = err.code;
  if (code === "SQLITE_BUSY" || code === "SQLITE_LOCKED") return true;
  const message = err instanceof Error ? err.message : String(err);
  return /SQLITE_(?:BUSY|LOCKED)|database is locked/i.test(message);
}
function openMemoryLockDatabase(lockPath) {
  const { DatabaseSync } = requireMemoryHostNodeSqlite();
  const lockDb = new DatabaseSync(lockPath);
  try {
    lockDb.exec("PRAGMA busy_timeout = 0");
    return lockDb;
  } catch (err) {
    try {
      lockDb.close();
    } catch {}
    throw err;
  }
}
function createMemoryReindexLockHandle(lockDb) {
  return {
    release: () => {
      let releaseError;
      try {
        lockDb.exec("ROLLBACK");
      } catch (err) {
        releaseError = err;
      }
      try {
        lockDb.close();
      } catch (err) {
        releaseError ??= err;
      }
      if (releaseError)
        throw new Error("Failed to release memory reindex lock", { cause: releaseError });
    },
  };
}
/** Try to acquire the build lock without locking readers of the live agent database. */
function tryAcquireMemoryReindexLock(dbPath) {
  const lockDb = openMemoryLockDatabase(resolveMemoryReindexLockPath(dbPath));
  try {
    lockDb.exec("BEGIN EXCLUSIVE");
  } catch (err) {
    lockDb.close();
    if (isSqliteBusyError(err)) return;
    throw err;
  }
  return createMemoryReindexLockHandle(lockDb);
}
/** Acquire an exclusive build lock without locking readers of the live agent database. */
function acquireMemoryReindexLock(dbPath) {
  const lock = tryAcquireMemoryReindexLock(dbPath);
  if (lock) return lock;
  throw Object.assign(
    /* @__PURE__ */ new Error(
      `Memory reindex lock is held at ${resolveMemoryReindexLockPath(dbPath)}; another reindex is active.`,
    ),
    { code: "SQLITE_BUSY" },
  );
}
//#endregion
//#region extensions/memory-core/src/memory/manager-db.ts
const MEMORY_REINDEX_SCHEMA = "memory_reindex";
const MEMORY_INDEX_STATE_ID = 1;
const MEMORY_DATABASE_FILE_SUFFIXES = ["", "-wal", "-shm", "-journal"];
const MEMORY_REINDEX_ENTRY_SUFFIXES = ["-wal", "-shm", "-journal", ""];
const MEMORY_REINDEX_UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const MEMORY_REINDEX_ORPHAN_MIN_AGE_MS = 1440 * 6e4;
function resolveMemoryReindexBaseName(databaseBaseName, entryName) {
  for (const suffix of MEMORY_REINDEX_ENTRY_SUFFIXES) {
    if (!entryName.endsWith(suffix)) continue;
    const baseName = entryName.slice(0, entryName.length - suffix.length);
    const prefix = `${databaseBaseName}.memory-reindex-`;
    if (
      baseName.startsWith(prefix) &&
      MEMORY_REINDEX_UUID_PATTERN.test(baseName.slice(prefix.length))
    )
      return baseName;
  }
}
function isRegularFile(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}
function tableExists(db, schema, tableName) {
  return (
    db
      .prepare(`SELECT 1 AS ok FROM ${schema}.sqlite_master WHERE type = 'table' AND name = ?`)
      .get(tableName)?.ok === 1
  );
}
function readTableSql(db, schema, tableName) {
  const row = db
    .prepare(`SELECT sql FROM ${schema}.sqlite_master WHERE type = 'table' AND name = ?`)
    .get(tableName);
  return typeof row?.sql === "string" && row.sql.trim() ? row.sql : null;
}
function hasSqliteVecExtension(db) {
  try {
    const row = db.prepare("SELECT vec_version() AS version").get();
    return typeof row?.version === "string" && row.version.trim().length > 0;
  } catch {
    return false;
  }
}
function readMemoryDatabaseRevision(db) {
  const row = db
    .prepare("SELECT revision FROM memory_index_state WHERE id = ?")
    .get(MEMORY_INDEX_STATE_ID);
  if (typeof row?.revision !== "number" || !Number.isSafeInteger(row.revision))
    throw new Error("Memory index revision is missing or invalid");
  return row.revision;
}
function replaceVirtualTable(params) {
  const { db, tableName, columns } = params;
  const createSql = readTableSql(db, MEMORY_REINDEX_SCHEMA, tableName);
  if (!createSql) {
    try {
      db.exec(`DROP TABLE IF EXISTS main.${tableName}`);
    } catch (err) {
      if (!params.ignoreDropErrorWhenSourceMissing) throw err;
    }
    return;
  }
  db.exec(`DROP TABLE IF EXISTS main.${tableName}`);
  db.exec(createSql);
  db.exec(
    `INSERT INTO main.${tableName} (${columns}) SELECT ${columns} FROM ${MEMORY_REINDEX_SCHEMA}.${tableName}`,
  );
}
function replaceMemoryPathFtsTable(db) {
  const createSql = readTableSql(db, MEMORY_REINDEX_SCHEMA, MEMORY_INDEX_PATHS_FTS_TABLE);
  db.exec(`DROP TABLE IF EXISTS main.${MEMORY_INDEX_PATHS_FTS_TABLE}`);
  if (!createSql) return;
  db.exec(createSql);
  db.exec(
    `INSERT INTO main.${MEMORY_INDEX_PATHS_FTS_TABLE} (rowid, path, source) SELECT id, path, source FROM main.memory_index_sources`,
  );
}
/** Publish a completed shadow memory index without replacing the shared agent database file. */
async function publishMemoryDatabaseTables(params) {
  params.targetDb.prepare(`ATTACH DATABASE ? AS ${MEMORY_REINDEX_SCHEMA}`).run(params.sourcePath);
  try {
    if (
      tableExists(params.targetDb, MEMORY_REINDEX_SCHEMA, "memory_index_chunks_vec") &&
      !hasSqliteVecExtension(params.targetDb)
    ) {
      const loaded = await loadSqliteVecExtension({
        db: params.targetDb,
        extensionPath: params.vectorExtensionPath,
      });
      if (!loaded.ok)
        throw new Error(
          `Failed to load sqlite-vec before publishing the full memory reindex: ` +
            (loaded.error ?? "unknown sqlite-vec load error"),
        );
    }
    runSqliteImmediateTransactionSync(params.targetDb, () => {
      const liveRevision = readMemoryDatabaseRevision(params.targetDb);
      if (liveRevision !== params.expectedRevision)
        throw new Error(
          `Memory index changed while full reindex was building (expected revision ${params.expectedRevision}, found ${liveRevision}); retry the full reindex.`,
        );
      const publishesPathFts = tableExists(
        params.targetDb,
        MEMORY_REINDEX_SCHEMA,
        MEMORY_INDEX_PATHS_FTS_TABLE,
      );
      dropMemoryPathFtsTriggers(params.targetDb);
      params.targetDb
        .prepare("DELETE FROM main.memory_index_meta WHERE key = ?")
        .run(params.metaKey);
      params.targetDb
        .prepare(`INSERT INTO main.memory_index_meta (key, value)
           SELECT key, value FROM ${MEMORY_REINDEX_SCHEMA}.memory_index_meta WHERE key = ?`)
        .run(params.metaKey);
      params.targetDb.exec(`
        DELETE FROM main.memory_index_sources;
        INSERT INTO main.memory_index_sources (id, path, source, hash, mtime, size)
        SELECT id, path, source, hash, mtime, size
        FROM ${MEMORY_REINDEX_SCHEMA}.memory_index_sources;

        DELETE FROM main.memory_index_chunks;
        INSERT INTO main.memory_index_chunks (
          id, path, source, start_line, end_line, hash, model, text, embedding, updated_at
        )
        SELECT
          id, path, source, start_line, end_line, hash, model, text, embedding, updated_at
        FROM ${MEMORY_REINDEX_SCHEMA}.memory_index_chunks;
      `);
      if (tableExists(params.targetDb, MEMORY_REINDEX_SCHEMA, "memory_embedding_cache"))
        params.targetDb.exec(`
          DELETE FROM main.memory_embedding_cache;
          INSERT INTO main.memory_embedding_cache (
            provider, model, provider_key, hash, embedding, dims, updated_at
          )
          SELECT provider, model, provider_key, hash, embedding, dims, updated_at
          FROM ${MEMORY_REINDEX_SCHEMA}.memory_embedding_cache;
        `);
      replaceVirtualTable({
        db: params.targetDb,
        tableName: "memory_index_chunks_fts",
        columns: "text, id, path, source, model, start_line, end_line",
      });
      replaceMemoryPathFtsTable(params.targetDb);
      if (publishesPathFts) ensureMemoryPathFtsTriggers(params.targetDb);
      replaceVirtualTable({
        db: params.targetDb,
        tableName: "memory_index_chunks_vec",
        columns: "id, embedding",
        ignoreDropErrorWhenSourceMissing: true,
      });
    });
  } finally {
    params.targetDb.exec(`DETACH DATABASE ${MEMORY_REINDEX_SCHEMA}`);
  }
}
/** Remove one closed shadow memory database and its journal-mode sidecars. */
function removeMemoryDatabaseFiles(dbPath) {
  for (const suffix of MEMORY_DATABASE_FILE_SUFFIXES)
    fs.rmSync(`${dbPath}${suffix}`, { force: true });
}
/** Remove crash-left shadow databases only when no full reindex is active. */
function cleanupAgedMemoryReindexTempFiles(dbPath, nowMs = Date.now()) {
  if (!isRegularFile(dbPath)) return;
  let reindexLock;
  try {
    reindexLock = tryAcquireMemoryReindexLock(dbPath);
  } catch {
    return;
  }
  if (!reindexLock) return;
  try {
    const dir = path.dirname(dbPath);
    const databaseBaseName = path.basename(dbPath);
    const shadowBaseNames = /* @__PURE__ */ new Set();
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const shadowBaseName = resolveMemoryReindexBaseName(databaseBaseName, entry.name);
      if (shadowBaseName) shadowBaseNames.add(shadowBaseName);
    }
    for (const shadowBaseName of shadowBaseNames) {
      const filePaths = MEMORY_DATABASE_FILE_SUFFIXES.map((suffix) =>
        path.join(dir, `${shadowBaseName}${suffix}`),
      );
      const stats = [];
      let hasUnknownFileState = false;
      for (const filePath of filePaths)
        try {
          stats.push(fs.statSync(filePath));
        } catch (err) {
          if (err.code !== "ENOENT") {
            hasUnknownFileState = true;
            break;
          }
        }
      if (hasUnknownFileState || stats.length === 0) continue;
      if (nowMs - Math.max(...stats.map((stat) => stat.mtimeMs)) < MEMORY_REINDEX_ORPHAN_MIN_AGE_MS)
        continue;
      for (const filePath of filePaths)
        try {
          fs.rmSync(filePath, { force: true });
        } catch {}
    }
  } finally {
    try {
      reindexLock.release();
    } catch {}
  }
}
function openMemoryDatabaseAtPath(dbPath, allowExtension, agentId) {
  ensureMemoryHostDir(path.dirname(dbPath));
  const { DatabaseSync } = requireMemoryHostNodeSqlite();
  const db = new DatabaseSync(dbPath, { allowExtension });
  try {
    configureMemorySqliteWalMaintenance(db, {
      busyTimeoutMs: 5e3,
      databasePath: dbPath,
    });
    if (agentId)
      ensureOpenClawAgentDatabaseSchema(db, {
        agentId,
        path: dbPath,
        register: true,
      });
    return db;
  } catch (err) {
    try {
      closeMemorySqliteWalMaintenance(db);
      db.close();
    } catch {}
    throw err;
  }
}
function closeMemoryDatabase(db) {
  closeMemorySqliteWalMaintenance(db);
  db.close();
}
//#endregion
//#region extensions/memory-core/src/memory/manager-embedding-cache.ts
function loadMemoryEmbeddingCache(params) {
  if (!params.enabled || params.providerIdentities.length === 0 || params.hashes.length === 0)
    return /* @__PURE__ */ new Map();
  const unique = [];
  const seen = /* @__PURE__ */ new Set();
  for (const hash of params.hashes) {
    if (!hash || seen.has(hash)) continue;
    seen.add(hash);
    unique.push(hash);
  }
  if (unique.length === 0) return /* @__PURE__ */ new Map();
  const tableName = params.tableName ?? "memory_embedding_cache";
  const out = /* @__PURE__ */ new Map();
  const batchSize = 400;
  for (const identity of params.providerIdentities) {
    const baseParams = [identity.provider, identity.model, identity.providerKey];
    for (let start = 0; start < unique.length; start += batchSize) {
      const batch = unique.slice(start, start + batchSize);
      const placeholders = batch.map(() => "?").join(", ");
      const rows = params.db
        .prepare(
          `SELECT hash, embedding FROM ${tableName}\n WHERE provider = ? AND model = ? AND provider_key = ? AND hash IN (${placeholders})`,
        )
        .all(...baseParams, ...batch);
      for (const row of rows)
        if (!out.has(row.hash)) out.set(row.hash, parseEmbedding(row.embedding));
    }
  }
  return out;
}
function upsertMemoryEmbeddingCache(params) {
  const provider = params.provider;
  if (!params.enabled || !provider || !params.providerKey || params.entries.length === 0) return;
  const tableName = params.tableName ?? "memory_embedding_cache";
  const now = params.now ?? Date.now();
  const stmt = params.db.prepare(
    `INSERT INTO ${tableName} (provider, model, provider_key, hash, embedding, dims, updated_at)\n VALUES (?, ?, ?, ?, ?, ?, ?)\n ON CONFLICT(provider, model, provider_key, hash) DO UPDATE SET\n   embedding=excluded.embedding,\n   dims=excluded.dims,\n   updated_at=excluded.updated_at`,
  );
  for (const entry of params.entries) {
    const embedding = entry.embedding ?? [];
    stmt.run(
      provider.id,
      provider.model,
      params.providerKey,
      entry.hash,
      JSON.stringify(embedding),
      embedding.length,
      now,
    );
  }
}
function collectMemoryCachedEmbeddings(params) {
  const embeddings = Array.from({ length: params.chunks.length }, () => []);
  const missing = [];
  for (let index = 0; index < params.chunks.length; index += 1) {
    const chunk = params.chunks[index];
    const hit = chunk?.hash ? params.cached.get(chunk.hash) : void 0;
    if (hit && hit.length > 0) embeddings[index] = hit;
    else if (chunk)
      missing.push({
        index,
        chunk,
      });
  }
  return {
    embeddings,
    missing,
  };
}
//#endregion
//#region extensions/memory-core/src/memory/manager-embedding-errors.ts
const MEMORY_EMBEDDING_OPERATION_ERROR_CODE = "MEMORY_EMBEDDING_OPERATION_FAILED";
function createMemoryEmbeddingOperationError(params) {
  const message = formatErrorMessage(params.cause);
  const error = new Error(message);
  error.code = MEMORY_EMBEDDING_OPERATION_ERROR_CODE;
  error.operation = params.operation;
  if (params.providerId) error.providerId = params.providerId;
  error.cause = params.cause;
  return error;
}
function isMemoryEmbeddingOperationError(err) {
  return err instanceof Error && err.code === MEMORY_EMBEDDING_OPERATION_ERROR_CODE;
}
//#endregion
//#region extensions/memory-core/src/memory/manager-embedding-policy.ts
function estimateUtf8Bytes(text) {
  if (!text) return 0;
  return Buffer.byteLength(text, "utf8");
}
function estimateStructuredEmbeddingInputBytes(input) {
  if (!input.parts?.length) return estimateUtf8Bytes(input.text);
  let total = 0;
  for (const part of input.parts)
    if (part.type === "text") total += estimateUtf8Bytes(part.text);
    else {
      total += estimateUtf8Bytes(part.mimeType);
      total += estimateUtf8Bytes(part.data);
    }
  return total;
}
function filterNonEmptyMemoryChunks(chunks) {
  return chunks.filter((chunk) => chunk.text.trim().length > 0);
}
function buildMemoryEmbeddingBatches(chunks, maxTokens) {
  const batches = [];
  let current = [];
  let currentTokens = 0;
  for (const chunk of chunks) {
    const estimate = chunk.embeddingInput
      ? estimateStructuredEmbeddingInputBytes(chunk.embeddingInput)
      : estimateUtf8Bytes(chunk.text);
    if (current.length > 0 && currentTokens + estimate > maxTokens) {
      batches.push(current);
      current = [];
      currentTokens = 0;
    }
    if (current.length === 0 && estimate > maxTokens) {
      batches.push([chunk]);
      continue;
    }
    current.push(chunk);
    currentTokens += estimate;
  }
  if (current.length > 0) batches.push(current);
  return batches;
}
const RETRYABLE_MEMORY_EMBEDDING_SERVICE_ERROR_RE =
  /(rate[_ ]limit|too many requests|429|resource has been exhausted|5\d\d|cloudflare|tokens per day)/i;
const RETRYABLE_MEMORY_EMBEDDING_TRANSPORT_ERROR_RE =
  /(fetch failed|other side closed|ECONNRESET|ECONNREFUSED|ETIMEDOUT|EPIPE|UND_ERR_|socket hang up|socket terminated|network error|read ECONN|timed out|connection (?:reset|refused|aborted|timed out)|EHOSTUNREACH|ENETUNREACH|ECONNABORTED|EAI_AGAIN)/i;
const SPLITTABLE_MEMORY_EMBEDDING_TRANSPORT_ERROR_RE =
  /(request_headers_too_large|request header fields too large|other side closed|ECONNRESET|EPIPE|UND_ERR_SOCKET|socket hang up|socket terminated|read ECONN|connection (?:reset|aborted))/i;
function isRetryableMemoryEmbeddingTransportError(message) {
  return RETRYABLE_MEMORY_EMBEDDING_TRANSPORT_ERROR_RE.test(message);
}
function isSplittableMemoryEmbeddingTransportError(message) {
  return SPLITTABLE_MEMORY_EMBEDDING_TRANSPORT_ERROR_RE.test(message);
}
function isRetryableMemoryEmbeddingError(message) {
  return (
    RETRYABLE_MEMORY_EMBEDDING_SERVICE_ERROR_RE.test(message) ||
    isRetryableMemoryEmbeddingTransportError(message)
  );
}
function resolveMemoryEmbeddingRetryDelay(delayMs, randomValue, maxDelayMs) {
  return Math.min(maxDelayMs, Math.round(delayMs * (1 + randomValue * 0.2)));
}
async function runMemoryEmbeddingRetryLoop(params) {
  const attempts = Math.max(1, params.maxAttempts);
  for (const attempt of Array.from({ length: attempts }, (_, index) => index + 1)) {
    const delayMs = params.baseDelayMs * 2 ** (attempt - 1);
    try {
      return await params.run();
    } catch (err) {
      if (params.signal?.aborted) throw err;
      const message = formatErrorMessage(err);
      if (!params.isRetryable(message) || attempt >= params.maxAttempts) throw err;
      await params.waitForRetry(delayMs);
    }
  }
  throw new Error("retry loop exhausted");
}
async function runMemoryEmbeddingBatchRetryWithSplit(params) {
  try {
    return await runMemoryEmbeddingRetryLoop({
      run: async () => await params.run(params.items),
      isRetryable: params.isRetryable,
      waitForRetry: params.waitForRetry,
      maxAttempts: params.maxAttempts,
      baseDelayMs: params.baseDelayMs,
    });
  } catch (err) {
    const message = formatErrorMessage(err);
    if (params.items.length <= 1 || !params.isSplittable(message)) throw err;
    const splitAt = Math.ceil(params.items.length / 2);
    params.onSplit?.({
      itemCount: params.items.length,
      splitAt,
      message,
    });
    const left = await runMemoryEmbeddingBatchRetryWithSplit({
      ...params,
      items: params.items.slice(0, splitAt),
    });
    const right = await runMemoryEmbeddingBatchRetryWithSplit({
      ...params,
      items: params.items.slice(splitAt),
    });
    return [...left, ...right];
  }
}
function buildTextEmbeddingInputs(chunks) {
  return chunks.map((chunk) => chunk.embeddingInput ?? { text: chunk.text });
}
//#endregion
//#region extensions/memory-core/src/memory/manager-fts-state.ts
function deleteMemoryFtsRows(params) {
  const tableName = params.tableName ?? "memory_index_chunks_fts";
  params.db
    .prepare(`DELETE FROM ${tableName} WHERE path = ? AND source = ?`)
    .run(params.path, params.source);
}
//#endregion
//#region extensions/memory-core/src/memory/manager-reindex-state.ts
function resolveMemoryIndexProviderIdentities(params) {
  const provider = params.provider ?? {
    id: "none",
    model: "fts-only",
  };
  const candidates = [
    {
      model: provider.model,
      cacheKeyData: params.cacheKeyData ?? {
        provider: provider.id,
        model: provider.model,
      },
    },
    ...(params.provider ? (params.aliases ?? []) : []),
  ];
  const seen = /* @__PURE__ */ new Set();
  const identities = [];
  for (const [index, candidate] of candidates.entries()) {
    const providerKey = hashText(JSON.stringify(candidate.cacheKeyData));
    const key = `${candidate.model}\u0000${providerKey}`;
    if ((index > 0 && !candidate.model) || seen.has(key)) continue;
    seen.add(key);
    identities.push({
      provider: provider.id,
      model: candidate.model,
      providerKey,
    });
  }
  return identities;
}
function resolveConfiguredSourcesForMeta(sources) {
  const normalized = Array.from(sources)
    .filter((source) => source === "memory" || source === "sessions")
    .toSorted((left, right) => left.localeCompare(right));
  return normalized.length > 0 ? normalized : ["memory"];
}
function normalizeMetaSources(meta) {
  if (!Array.isArray(meta.sources)) return ["memory"];
  const normalized = Array.from(
    new Set(meta.sources.filter((source) => source === "memory" || source === "sessions")),
  ).toSorted((left, right) => left.localeCompare(right));
  return normalized.length > 0 ? normalized : ["memory"];
}
function configuredMetaSourcesDiffer(params) {
  const metaSources = normalizeMetaSources(params.meta);
  if (metaSources.length !== params.configuredSources.length) return true;
  return metaSources.some((source, index) => source !== params.configuredSources[index]);
}
function resolveConfiguredScopeHash(params) {
  const extraPaths = normalizeExtraMemoryPaths(params.workspaceDir, params.extraPaths)
    .map((value) => value.replace(/\\/g, "/"))
    .toSorted();
  return hashText(
    JSON.stringify({
      extraPaths,
      multimodal: {
        enabled: params.multimodal.enabled,
        modalities: [...params.multimodal.modalities].toSorted(),
        maxFileBytes: params.multimodal.maxFileBytes,
      },
    }),
  );
}
function resolveMemoryIndexIdentityState(params) {
  const { meta } = params;
  if (!meta)
    return {
      status: "missing",
      reason: "index metadata is missing",
    };
  const expectedModel = params.provider?.model?.trim() || "fts-only";
  const matchingModelIdentities = [
    {
      model: expectedModel,
      providerKey: params.providerKey,
    },
    ...(params.providerAliases ?? []),
  ].filter((identity) => identity.model === meta.model);
  if (matchingModelIdentities.length === 0)
    return {
      status: "mismatched",
      reason: `index was built for model ${meta.model}, expected ${expectedModel}`,
    };
  const expectedProvider = params.provider ? params.provider.id : "none";
  if (meta.provider !== expectedProvider)
    return {
      status: "mismatched",
      reason: `index was built for provider ${meta.provider}, expected ${expectedProvider}`,
    };
  if (
    params.providerKeyKnown !== false &&
    !matchingModelIdentities.some((identity) => identity.providerKey === meta.providerKey)
  )
    return {
      status: "mismatched",
      reason: "index provider settings changed",
    };
  if (
    configuredMetaSourcesDiffer({
      meta,
      configuredSources: params.configuredSources,
    })
  )
    return {
      status: "mismatched",
      reason: "index sources changed",
    };
  if (meta.scopeHash !== params.configuredScopeHash)
    return {
      status: "mismatched",
      reason: "index scope changed",
    };
  if (meta.chunkTokens !== params.chunkTokens || meta.chunkOverlap !== params.chunkOverlap)
    return {
      status: "mismatched",
      reason: "index chunking changed",
    };
  if (params.vectorReady && params.hasIndexedChunks !== false && !meta.vectorDims)
    return {
      status: "mismatched",
      reason: "index vector dimensions are missing",
    };
  if ((meta.ftsTokenizer ?? "unicode61") !== params.ftsTokenizer)
    return {
      status: "mismatched",
      reason: "index FTS tokenizer changed",
    };
  return { status: "valid" };
}
//#endregion
//#region extensions/memory-core/src/memory/manager-provider-state.ts
function createPendingMemoryProviderLifecycle(requestedProvider) {
  return {
    mode: "pending",
    requestedProvider,
  };
}
function createDegradedMemoryProviderLifecycle(params) {
  return {
    mode: "degraded",
    providerId: params.providerId,
    reason: params.reason,
    ...(params.code ? { code: params.code } : {}),
  };
}
function resolveProviderLifecycle(result) {
  if (result.provider && result.fallbackFrom)
    return {
      mode: "fallback-active",
      providerId: result.provider.id,
      fallbackFrom: result.fallbackFrom,
      reason: result.fallbackReason ?? "fallback activated",
    };
  if (result.provider)
    return {
      mode: "active",
      providerId: result.provider.id,
    };
  return {
    mode: "fts-only",
    reason: result.providerUnavailableReason ?? "No embedding provider available",
    attemptedProviderId: result.requestedProvider,
  };
}
function resolveFallbackCurrentProviderId(params) {
  if (params.provider) return params.provider.id;
  if (params.lifecycle.mode === "degraded") return params.lifecycle.providerId;
  return null;
}
function resolveMemoryPrimaryProviderRequest(params) {
  return {
    provider: params.settings.provider,
    model: params.settings.model,
    remote: params.settings.remote,
    inputType: params.settings.inputType,
    queryInputType: params.settings.queryInputType,
    documentInputType: params.settings.documentInputType,
    outputDimensionality: params.settings.outputDimensionality,
    fallback: params.settings.fallback,
    local: params.settings.local,
  };
}
function resolveMemoryProviderState(result) {
  return {
    provider: result.provider,
    fallbackFrom: result.fallbackFrom,
    fallbackReason: result.fallbackReason,
    providerUnavailableReason: result.providerUnavailableReason,
    providerRuntime: result.runtime,
    lifecycle: resolveProviderLifecycle(result),
  };
}
function applyMemoryFallbackProviderState(params) {
  return {
    ...params.current,
    fallbackFrom: params.fallbackFrom,
    fallbackReason: params.reason,
    providerUnavailableReason: void 0,
    provider: params.result.provider,
    providerRuntime: params.result.runtime,
    lifecycle: params.result.provider
      ? {
          mode: "fallback-active",
          providerId: params.result.provider.id,
          fallbackFrom: params.fallbackFrom,
          reason: params.reason,
        }
      : {
          mode: "fts-only",
          reason: params.reason,
          attemptedProviderId: params.fallbackFrom,
        },
  };
}
function resolveMemoryFallbackProviderRequest(params) {
  const fallback = params.settings.fallback;
  if (
    !fallback ||
    fallback === "none" ||
    !params.currentProviderId ||
    fallback === params.currentProviderId
  )
    return null;
  return {
    provider: fallback,
    model: resolveEmbeddingProviderFallbackModel(fallback, params.settings.model, params.cfg),
    remote: params.settings.remote,
    inputType: params.settings.inputType,
    queryInputType: params.settings.queryInputType,
    documentInputType: params.settings.documentInputType,
    outputDimensionality: params.settings.outputDimensionality,
    fallback: "none",
    local: params.settings.local,
  };
}
//#endregion
//#region extensions/memory-core/src/memory/manager-session-reindex.ts
function shouldSyncSessionsForReindex(params) {
  if (!params.hasSessionSource) return false;
  if (params.sync?.sessions?.some((session) => session.sessionId.trim().length > 0)) return true;
  if (params.sync?.archiveFiles?.some((sessionFile) => sessionFile.trim().length > 0)) return true;
  if (params.sync?.force) return true;
  if (params.needsFullReindex) return true;
  if (params.sessionsFullRetryDirty) return true;
  const reason = params.sync?.reason;
  if (reason === "session-start" || reason === "watch") return false;
  return params.sessionsDirty && params.dirtySessionFileCount > 0;
}
//#endregion
//#region extensions/memory-core/src/memory/manager-session-sync-state.ts
function resolveMemorySessionStartupDirtyFiles(params) {
  const indexedRows = new Map((params.existingRows ?? []).map((row) => [row.path, row]));
  const dirtyFiles = [];
  for (const file of params.files) {
    const existing = indexedRows.get(file.path);
    if (!existing) {
      dirtyFiles.push(file.absPath);
      continue;
    }
    const indexedMtimeMs = Number(existing.mtime);
    const indexedSize = Number(existing.size);
    if (!Number.isFinite(indexedMtimeMs) || !Number.isFinite(indexedSize)) {
      dirtyFiles.push(file.absPath);
      continue;
    }
    if (file.size !== indexedSize || file.mtimeMs > indexedMtimeMs) dirtyFiles.push(file.absPath);
  }
  return dirtyFiles;
}
function resolveMemorySessionSyncPlan(params) {
  const activePaths = params.targetSessionFiles
    ? null
    : new Set(params.files.map((file) => params.sessionPathForFile(file)));
  const existingRows = activePaths === null ? null : (params.existingRows ?? []);
  return {
    activePaths,
    existingRows,
    existingHashes: existingRows ? new Map(existingRows.map((row) => [row.path, row.hash])) : null,
    indexAll:
      params.needsFullReindex ||
      Boolean(params.targetSessionFiles) ||
      params.sessionsDirtyFiles.size === 0,
  };
}
//#endregion
//#region extensions/memory-core/src/memory/manager-source-state.ts
const MEMORY_SOURCE_FILE_STATE_SQL = `SELECT path, hash, mtime, size FROM memory_index_sources WHERE source = ?`;
const MEMORY_SOURCE_FILE_HASH_SQL = `SELECT hash FROM memory_index_sources WHERE path = ? AND source = ?`;
function loadMemorySourceFileState(params) {
  const normalizedRows = params.db.prepare(MEMORY_SOURCE_FILE_STATE_SQL).all(params.source) ?? [];
  return {
    rows: normalizedRows,
    hashes: new Map(normalizedRows.map((row) => [row.path, row.hash])),
  };
}
function resolveMemorySourceExistingHash(params) {
  if (params.existingHashes) return params.existingHashes.get(params.path);
  return params.db.prepare(MEMORY_SOURCE_FILE_HASH_SQL).get(params.path, params.source)?.hash;
}
//#endregion
//#region extensions/memory-core/src/memory/manager-targeted-sync.ts
function clearMemorySyncedArchiveFiles(params) {
  if (!params.targetArchiveFiles) params.sessionsDirtyFiles.clear();
  else
    for (const targetArchiveFile of params.targetArchiveFiles)
      params.sessionsDirtyFiles.delete(targetArchiveFile);
  return params.sessionsDirtyFiles.size > 0;
}
function markMemoryTargetArchiveFilesDirty(params) {
  if (params.targetArchiveFiles)
    for (const targetArchiveFile of params.targetArchiveFiles)
      params.sessionsDirtyFiles.add(targetArchiveFile);
  return params.sessionsDirtyFiles.size > 0;
}
async function runMemoryTargetedSessionSync(params) {
  if (!params.hasSessionSource || !params.targetArchiveFiles)
    return {
      handled: false,
      sessionsDirty: Boolean(params.sessionsFullRetryDirty) || params.sessionsDirtyFiles.size > 0,
    };
  try {
    await params.syncArchiveFiles({
      needsFullReindex: false,
      targetArchiveFiles: Array.from(params.targetArchiveFiles),
      progress: params.progress,
    });
    const remainingSessionsDirty = clearMemorySyncedArchiveFiles({
      sessionsDirtyFiles: params.sessionsDirtyFiles,
      targetArchiveFiles: params.targetArchiveFiles,
    });
    return {
      handled: true,
      sessionsDirty: Boolean(params.sessionsFullRetryDirty) || remainingSessionsDirty,
    };
  } catch (err) {
    const reason = formatErrorMessage(err);
    if (!(params.shouldFallbackOnError(err) && (await params.activateFallbackProvider(reason))))
      throw err;
    const remainingSessionsDirty = markMemoryTargetArchiveFilesDirty({
      sessionsDirtyFiles: params.sessionsDirtyFiles,
      targetArchiveFiles: params.targetArchiveFiles,
    });
    return {
      handled: true,
      sessionsDirty: Boolean(params.sessionsFullRetryDirty) || remainingSessionsDirty,
    };
  }
}
//#endregion
//#region extensions/memory-core/src/memory/manager-sync-ops.ts
function sessionPathForCorpusEntry(entry) {
  return entry.transcriptSource === "sqlite"
    ? sessionPathForSessionIdentity(entry.agentId, entry.sessionId)
    : sessionPathForFile(entry.sessionFile);
}
function legacyExtensionlessSessionPathForIdentity(agentId, sessionId) {
  return path.join("sessions", normalizeAgentId(agentId), sessionId).replace(/\\/g, "/");
}
function buildSessionEntryOptions(entry) {
  return {
    generatedByDreamingNarrative: entry.generatedByDreamingNarrative === true,
    generatedByCronRun: entry.generatedByCronRun === true,
    ...(entry.sessionKey ? { sessionKey: entry.sessionKey } : {}),
    ...(entry.updatedAtMs !== void 0 ? { updatedAtMs: entry.updatedAtMs } : {}),
  };
}
const META_KEY = "memory_index_meta_v1";
const VECTOR_TABLE$2 = MEMORY_INDEX_VECTOR_TABLE;
const LEGACY_VECTOR_TABLE = "chunks_vec";
const FTS_TABLE$2 = MEMORY_INDEX_FTS_TABLE;
const EMBEDDING_CACHE_TABLE$2 = MEMORY_EMBEDDING_CACHE_TABLE;
const SESSION_DIRTY_DEBOUNCE_MS = 5e3;
const SESSION_DELTA_READ_CHUNK_BYTES = 64 * 1024;
const SESSION_SYNC_YIELD_EVERY = 10;
const SOURCE_WIDE_SESSION_INDEX_FLUSH_FILES = 128;
const VECTOR_LOAD_TIMEOUT_MS = 3e4;
const MEMORY_WATCH_PRESSURE_STARTUP_CHECK_DELAY_MS = 1e4;
const IGNORED_MEMORY_WATCH_DIR_NAMES = /* @__PURE__ */ new Set([
  ".git",
  "node_modules",
  ".pnpm-store",
  ".venv",
  "venv",
  ".tox",
  "__pycache__",
]);
const log$3 = createSubsystemLogger("memory");
const TEST_MEMORY_WATCH_FACTORY_KEY = Symbol.for("openclaw.test.memoryWatchFactory");
const TEST_MEMORY_NATIVE_WATCH_FACTORY_KEY = Symbol.for("openclaw.test.memoryNativeWatchFactory");
function memoryTableExists(db, tableName) {
  return Boolean(
    db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName),
  );
}
function resolveMemoryWatchFactory() {
  if (process.env.VITEST === "true" || false) {
    const override = globalThis[TEST_MEMORY_WATCH_FACTORY_KEY];
    if (typeof override === "function") return override;
  }
  return chokidar.watch.bind(chokidar);
}
function resolveMemoryNativeWatchFactory() {
  if (process.env.VITEST === "true" || false) {
    const override = globalThis[TEST_MEMORY_NATIVE_WATCH_FACTORY_KEY];
    if (typeof override === "function") return override;
  }
  return fs.watch.bind(fs);
}
function shouldIgnoreMemoryWatchPath(watchPath, stats, multimodalSettings) {
  const normalized = path.normalize(watchPath);
  if (
    normalized
      .split(path.sep)
      .map((segment) => normalizeLowercaseStringOrEmpty(segment))
      .some((segment) => IGNORED_MEMORY_WATCH_DIR_NAMES.has(segment))
  )
    return true;
  if (stats?.isDirectory?.()) return false;
  if (!stats) return false;
  const extension = normalizeLowercaseStringOrEmpty(path.extname(normalized));
  if (extension.length === 0 || extension === ".md") return false;
  if (!multimodalSettings) return true;
  return classifyMemoryMultimodalPath(normalized, multimodalSettings) === null;
}
function runDetachedMemorySync(sync, reason) {
  sync().catch((err) => {
    log$3.warn(`memory sync failed (${reason}): ${String(err)}`);
  });
}
function createSessionSyncYield(total) {
  let completed = 0;
  return async () => {
    completed += 1;
    if (completed < total && completed % SESSION_SYNC_YIELD_EVERY === 0)
      await new Promise((resolve) => {
        setImmediate(resolve);
      });
  };
}
var MemoryManagerSyncOps = class {
  constructor() {
    this.provider = null;
    this.sources = /* @__PURE__ */ new Set();
    this.providerKey = null;
    this.fts = {
      enabled: false,
      available: false,
    };
    this.vectorReady = null;
    this.watcher = null;
    this.nativeMemoryWatchPairs = [];
    this.watchTimer = null;
    this.sessionWatchTimer = null;
    this.sessionUnsubscribe = null;
    this.intervalTimer = null;
    this.memoryWatchPressureStartupTimer = null;
    this.closed = false;
    this.dirty = false;
    this.memoryFullRetryDirty = false;
    this.pendingWatchPaths = /* @__PURE__ */ new Map();
    this.sessionsDirty = false;
    this.sessionsFullRetryDirty = false;
    this.memoryWatchPressureWarning = { shown: false };
    this.sessionsDirtyFiles = /* @__PURE__ */ new Set();
    this.sessionPendingFiles = /* @__PURE__ */ new Set();
    this.sessionPendingTargets = /* @__PURE__ */ new Map();
    this.sessionDeltas = /* @__PURE__ */ new Map();
    this.vectorDegradedWriteWarningShown = false;
    this.lastMetaSerialized = null;
  }
  async indexFiles(items) {
    for (const item of items) await this.indexFile(item.entry, { source: item.source });
  }
  emptySourceSyncPlan() {
    return {
      indexItems: [],
      finalize: () => {},
    };
  }
  snapshotReindexRetryState() {
    return {
      dirty: this.dirty,
      memoryFullRetryDirty: this.memoryFullRetryDirty,
      sessionsDirty: this.sessionsDirty,
      sessionsFullRetryDirty: this.sessionsFullRetryDirty,
      sessionsDirtyFiles: new Set(this.sessionsDirtyFiles),
      sessionDeltas: new Map(
        Array.from(this.sessionDeltas, ([file, state]) => [file, { ...state }]),
      ),
    };
  }
  restoreReindexRetryState(snapshot) {
    this.dirty = snapshot.dirty || this.dirty;
    this.memoryFullRetryDirty = snapshot.memoryFullRetryDirty || this.memoryFullRetryDirty;
    this.sessionsFullRetryDirty = snapshot.sessionsFullRetryDirty || this.sessionsFullRetryDirty;
    this.sessionsDirtyFiles = /* @__PURE__ */ new Set([
      ...snapshot.sessionsDirtyFiles,
      ...this.sessionsDirtyFiles,
    ]);
    const currentDeltas = this.sessionDeltas;
    this.sessionDeltas = new Map(
      Array.from(currentDeltas, ([file, state]) => [file, { ...state }]),
    );
    for (const [file, state] of snapshot.sessionDeltas) this.sessionDeltas.set(file, { ...state });
    this.sessionsDirty =
      snapshot.sessionsDirty ||
      this.sessionsDirty ||
      this.sessionsFullRetryDirty ||
      this.sessionsDirtyFiles.size > 0;
  }
  markFailedFullReindexRetry(params) {
    if (params.memory) {
      this.dirty = true;
      this.memoryFullRetryDirty = true;
    }
    if (params.sessions) {
      this.sessionsDirty = true;
      this.sessionsFullRetryDirty = true;
    }
  }
  clearSessionRetryState() {
    this.sessionsDirty = false;
    this.sessionsFullRetryDirty = false;
    this.sessionsDirtyFiles.clear();
  }
  clearMemoryRetryState() {
    this.dirty = false;
    this.memoryFullRetryDirty = false;
  }
  refreshSessionDirtyFlag() {
    this.sessionsDirty = this.sessionsFullRetryDirty || this.sessionsDirtyFiles.size > 0;
  }
  shouldDeferSourceWideBatch() {
    return Boolean(
      this.batch.enabled &&
      this.provider &&
      this.providerRuntime?.batchEmbed &&
      this.providerRuntime.sourceWideBatchEmbed === true,
    );
  }
  async indexQueuedFiles(items, progress, label) {
    if (items.length === 0) return;
    if (progress && label)
      progress.report({
        completed: progress.completed,
        total: progress.total,
        label,
      });
    await this.indexFiles(items);
    for (const item of items) item.afterIndex?.();
    if (progress) {
      progress.completed += items.length;
      progress.report({
        completed: progress.completed,
        total: progress.total,
      });
    }
  }
  async executeSourceSyncPlans(plans, progress) {
    const indexItems = plans.flatMap((plan) => plan.indexItems);
    const sources = new Set(indexItems.map((item) => item.source));
    await this.indexQueuedFiles(
      indexItems,
      progress,
      sources.size > 1 ? "Indexing memory sources (batch)..." : void 0,
    );
    for (const plan of plans) await plan.finalize();
  }
  async executeSourceWideSync(params) {
    const memoryPlan = params.shouldSyncMemory
      ? await this.syncMemoryFiles({
          needsFullReindex: params.needsFullReindex,
          progress: params.progress,
          deferIndex: true,
        })
      : this.emptySourceSyncPlan();
    if (params.shouldSyncSessions) {
      await this.syncArchiveFiles({
        needsFullReindex: params.needsFullSessionReindex ?? params.needsFullReindex,
        targetArchiveFiles: params.targetArchiveFiles,
        progress: params.progress,
        deferIndex: true,
        prefixIndexItems: memoryPlan.indexItems,
      });
      await memoryPlan.finalize();
      return;
    }
    await this.executeSourceSyncPlans([memoryPlan], params.progress);
  }
  hasIndexedChunks() {
    return this.db.prepare(`SELECT 1 as found FROM memory_index_chunks LIMIT 1`).get()?.found === 1;
  }
  hasSemanticChunks() {
    return (
      this.db
        .prepare(`SELECT 1 as found FROM memory_index_chunks WHERE model != 'fts-only' LIMIT 1`)
        .get()?.found === 1
    );
  }
  resolveCurrentIndexIdentityState(params) {
    const hasProviderOverride = params && "provider" in params;
    const configuredIndexIdentity =
      !hasProviderOverride && !this.provider && this.settings.provider !== "none"
        ? resolveEmbeddingProviderIndexIdentity({
            config: this.cfg,
            agentDir: resolveAgentDir(this.cfg, this.agentId),
            ...resolveMemoryPrimaryProviderRequest({ settings: this.settings }),
          })
        : void 0;
    const configuredProvider =
      this.settings.provider === "none"
        ? null
        : (configuredIndexIdentity?.provider ?? {
            id:
              resolveEmbeddingProviderAdapterId(this.settings.provider, this.cfg) ??
              this.settings.provider,
            model:
              this.settings.model.trim() ||
              resolveEmbeddingProviderFallbackModel(this.settings.provider, "fts-only", this.cfg),
          });
    const provider = hasProviderOverride
      ? params.provider
      : this.provider
        ? {
            id: this.provider.id,
            model: this.provider.model,
          }
        : configuredProvider;
    const vectorReady =
      params && "vectorReady" in params
        ? Boolean(params.vectorReady)
        : this.vector.available === true;
    const initializedProviderIdentities =
      provider &&
      this.provider &&
      provider.id === this.provider.id &&
      provider.model === this.provider.model
        ? this.resolveProviderIndexIdentities()
        : [];
    const configuredProviderIdentities = configuredIndexIdentity
      ? resolveMemoryIndexProviderIdentities({
          provider: configuredIndexIdentity.provider,
          cacheKeyData: configuredIndexIdentity.cacheKeyData,
          aliases: configuredIndexIdentity.aliases,
        })
      : [];
    const providerIdentities =
      initializedProviderIdentities.length > 0
        ? initializedProviderIdentities
        : configuredProviderIdentities;
    const configuredProviderKeyKnown = configuredProviderIdentities.length > 0;
    return resolveMemoryIndexIdentityState({
      meta: params && "meta" in params ? params.meta : this.readMeta(),
      provider,
      providerKey: configuredProviderKeyKnown
        ? providerIdentities[0]?.providerKey
        : params?.providerKeyKnown === false
          ? void 0
          : (this.providerKey ?? void 0),
      providerAliases: providerIdentities.slice(1),
      providerKeyKnown: configuredProviderKeyKnown ? true : params?.providerKeyKnown,
      configuredSources: resolveConfiguredSourcesForMeta(this.sources),
      configuredScopeHash: resolveConfiguredScopeHash({
        workspaceDir: this.workspaceDir,
        extraPaths: this.settings.extraPaths,
        multimodal: {
          enabled: this.settings.multimodal.enabled,
          modalities: this.settings.multimodal.modalities,
          maxFileBytes: this.settings.multimodal.maxFileBytes,
        },
      }),
      chunkTokens: this.settings.chunking.tokens,
      chunkOverlap: this.settings.chunking.overlap,
      vectorReady,
      hasIndexedChunks:
        params && "hasIndexedChunks" in params
          ? Boolean(params.hasIndexedChunks)
          : this.hasIndexedChunks(),
      ftsTokenizer: this.settings.store.fts.tokenizer,
    });
  }
  resetVectorState() {
    this.vectorReady = null;
    this.vector.available = null;
    this.vector.semanticAvailable = void 0;
    this.vector.loadError = void 0;
    this.vector.dims = void 0;
    this.vectorDegradedWriteWarningShown = false;
  }
  async ensureVectorReady(dimensions) {
    if (!this.vector.enabled) return false;
    if (!this.vectorReady)
      this.vectorReady = this.withTimeout(
        this.loadVectorExtension(),
        VECTOR_LOAD_TIMEOUT_MS,
        `sqlite-vec load timed out after ${Math.round(VECTOR_LOAD_TIMEOUT_MS / 1e3)}s`,
      );
    let ready;
    try {
      ready = (await this.vectorReady) || false;
    } catch (err) {
      const message = formatErrorMessage(err);
      this.vector.available = false;
      this.vector.loadError = message;
      this.vectorReady = null;
      log$3.warn(`sqlite-vec unavailable: ${message}`);
      return false;
    }
    if (ready && typeof dimensions === "number" && dimensions > 0) {
      const persistedMeta = this.readMeta();
      if (persistedMeta && persistedMeta.vectorDims !== this.vector.dims)
        this.vector.dims = persistedMeta.vectorDims;
      this.ensureVectorTable(dimensions);
    }
    return ready;
  }
  async loadVectorExtension() {
    if (this.vector.available !== null) return this.vector.available;
    if (!this.vector.enabled) {
      this.vector.available = false;
      return false;
    }
    try {
      const resolvedPath = this.vector.extensionPath?.trim()
        ? resolveUserPath(this.vector.extensionPath)
        : void 0;
      const loaded = await loadSqliteVecExtension({
        db: this.db,
        extensionPath: resolvedPath,
      });
      if (!loaded.ok) throw new Error(loaded.error ?? "unknown sqlite-vec load error");
      this.vector.extensionPath = loaded.extensionPath;
      this.vector.available = true;
      if (this.dropLegacyVectorTable()) {
        this.dirty = true;
        this.memoryFullRetryDirty = true;
      }
      return true;
    } catch (err) {
      const message = formatErrorMessage(err);
      this.vector.available = false;
      this.vector.loadError = message;
      log$3.warn(`sqlite-vec unavailable: ${message}`);
      return false;
    }
  }
  ensureVectorTable(dimensions) {
    if (this.vector.dims === dimensions && memoryTableExists(this.db, VECTOR_TABLE$2)) return;
    if (!this.dropVectorTable())
      throw new Error(`Failed to reset ${VECTOR_TABLE$2} before rebuilding vector dimensions`);
    this.db.exec(
      `CREATE VIRTUAL TABLE IF NOT EXISTS ${VECTOR_TABLE$2} USING vec0(\n  id TEXT PRIMARY KEY,\n  embedding FLOAT[${dimensions}]\n)`,
    );
    this.vector.dims = dimensions;
  }
  dropLegacyVectorTable() {
    if (!memoryTableExists(this.db, LEGACY_VECTOR_TABLE)) return false;
    try {
      this.db.exec(`DROP TABLE ${LEGACY_VECTOR_TABLE}`);
      return true;
    } catch (err) {
      log$3.debug(`Failed to drop ${LEGACY_VECTOR_TABLE}: ${formatErrorMessage(err)}`);
      return false;
    }
  }
  dropVectorTable() {
    try {
      this.db.exec(`DROP TABLE IF EXISTS ${VECTOR_TABLE$2}`);
      return true;
    } catch (err) {
      const message = formatErrorMessage(err);
      log$3.debug(`Failed to drop ${VECTOR_TABLE$2}: ${message}`);
      return false;
    }
  }
  buildSourceFilter(alias, sourcesOverride) {
    const sources = sourcesOverride ?? Array.from(this.sources);
    if (sources.length === 0)
      return {
        sql: "",
        params: [],
      };
    return {
      sql: ` AND ${alias ? `${alias}.source` : "source"} IN (${sources.map(() => "?").join(", ")})`,
      params: sources,
    };
  }
  openDatabase() {
    return openMemoryDatabaseAtPath(
      resolveUserPath(this.settings.store.databasePath),
      this.settings.store.vector.enabled,
      this.agentId,
    );
  }
  async seedEmbeddingCache(sourceDb) {
    if (!this.cache.enabled) return;
    let transactionStarted = false;
    try {
      const rows = sourceDb
        .prepare(
          `SELECT provider, model, provider_key, hash, embedding, dims, updated_at FROM ${EMBEDDING_CACHE_TABLE$2}`,
        )
        .iterate();
      let rowCount = 0;
      let insert = null;
      for (const row of rows) {
        if (!insert) {
          insert = this.db
            .prepare(`INSERT INTO ${EMBEDDING_CACHE_TABLE$2} (provider, model, provider_key, hash, embedding, dims, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(provider, model, provider_key, hash) DO UPDATE SET
               embedding=excluded.embedding,
               dims=excluded.dims,
               updated_at=excluded.updated_at`);
          this.db.exec("BEGIN");
          transactionStarted = true;
        }
        insert.run(
          row.provider,
          row.model,
          row.provider_key,
          row.hash,
          row.embedding,
          row.dims,
          row.updated_at,
        );
        rowCount += 1;
        if (rowCount % 1e3 === 0)
          await new Promise((resolve) => {
            setImmediate(resolve);
          });
      }
      if (transactionStarted) this.db.exec("COMMIT");
    } catch (err) {
      if (transactionStarted)
        try {
          this.db.exec("ROLLBACK");
        } catch {}
      throw err;
    }
  }
  ensureSchema() {
    const result = ensureMemoryIndexSchema({
      db: this.db,
      cacheEnabled: this.cache.enabled,
      ftsEnabled: this.fts.enabled,
      ftsTokenizer: this.settings.store.fts.tokenizer,
    });
    this.fts.available = result.ftsAvailable;
    if (result.ftsError) {
      this.fts.loadError = result.ftsError;
      if (this.fts.enabled) log$3.warn(`fts unavailable: ${result.ftsError}`);
    }
  }
  ensureWatcher() {
    if (!this.sources.has("memory") || !this.settings.sync.watch) return;
    if (this.watcher || this.nativeMemoryWatchPairs.length > 0) return;
    const fileWatchPaths = /* @__PURE__ */ new Set([path.join(this.workspaceDir, "MEMORY.md")]);
    const dirWatchPaths = /* @__PURE__ */ new Set([path.join(this.workspaceDir, "memory")]);
    const additionalPaths = normalizeExtraMemoryPaths(this.workspaceDir, this.settings.extraPaths);
    for (const entry of additionalPaths)
      try {
        const stat = fs.lstatSync(entry);
        if (stat.isSymbolicLink()) continue;
        if (stat.isDirectory()) {
          dirWatchPaths.add(entry);
          continue;
        }
        if (
          stat.isFile() &&
          (normalizeLowercaseStringOrEmpty(entry).endsWith(".md") ||
            classifyMemoryMultimodalPath(entry, this.settings.multimodal) !== null)
        )
          fileWatchPaths.add(entry);
      } catch {}
    const markDirty = (watchPath, stats) => {
      recordMemoryWatchEventPath(this.pendingWatchPaths, watchPath, stats);
      this.dirty = true;
      this.scheduleWatchSync();
    };
    const nativeRecursiveSupported = process.platform === "darwin" || process.platform === "win32";
    for (const dir of dirWatchPaths)
      if (
        !(nativeRecursiveSupported
          ? this.attachNativeMemoryWatchForDir(dir, markDirty)
          : process.platform === "linux"
            ? this.attachLinuxMemoryDirectoryTreeWatchForDir(dir, markDirty)
            : false)
      )
        fileWatchPaths.add(dir);
    if (fileWatchPaths.size > 0) {
      const existingWatcher = this.currentMemoryChokidarWatcher();
      if (existingWatcher) existingWatcher.add(Array.from(fileWatchPaths));
      else {
        const watcher = resolveMemoryWatchFactory()(Array.from(fileWatchPaths), {
          ignoreInitial: true,
          ignored: (watchPath, stats) =>
            shouldIgnoreMemoryWatchPath(watchPath, stats, this.settings.multimodal),
        });
        this.watcher = watcher;
        watcher.on("add", markDirty);
        watcher.on("change", markDirty);
        watcher.on("unlink", markDirty);
        watcher.on("unlinkDir", markDirty);
        watcher.on("error", (err) => {
          const message = err instanceof Error ? err.message : String(err);
          log$3.warn(`memory watcher error: ${message}`);
        });
        watcher.once("ready", () => {
          this.warnIfMemoryWatchPressure(countChokidarWatchedEntries(watcher), "paths");
        });
      }
    }
    this.scheduleMemoryWatchPressureStartupCheck();
  }
  scheduleMemoryWatchPressureStartupCheck() {
    if (
      this.memoryWatchPressureStartupTimer ||
      this.memoryWatchPressureWarning.shown ||
      this.closed ||
      (this.nativeMemoryWatchPairs.length === 0 && !this.watcher)
    )
      return;
    this.memoryWatchPressureStartupTimer = setTimeout(() => {
      this.memoryWatchPressureStartupTimer = null;
      if (this.closed || this.memoryWatchPressureWarning.shown) return;
      if (this.watcher)
        this.warnIfMemoryWatchPressure(countChokidarWatchedEntries(this.watcher), "paths");
      if (this.memoryWatchPressureWarning.shown) return;
      let directoryCount = 0;
      for (const pair of this.nativeMemoryWatchPairs)
        directoryCount += pair.treeWatchers?.size ?? 0;
      this.warnIfMemoryWatchPressure(directoryCount, "directories");
    }, MEMORY_WATCH_PRESSURE_STARTUP_CHECK_DELAY_MS);
  }
  warnIfMemoryWatchPressure(count, unit) {
    warnIfMemoryWatchPressureHigh(
      this.memoryWatchPressureWarning,
      count,
      unit,
      "Large memory folders or extraPaths can make OpenClaw run out of file watchers or open files.",
      "Remove large extraPaths, or set memorySearch.sync.watch to false and refresh memory manually or with sync.intervalMinutes.",
      (message) => log$3.warn(message),
    );
  }
  currentMemoryChokidarWatcher() {
    return this.watcher;
  }
  attachNativeMemoryWatchForDir(dir, markDirty) {
    if (this.closed) return false;
    let recordedInode;
    try {
      recordedInode = fs.statSync(dir).ino;
    } catch {
      return false;
    }
    let mainWatcher;
    try {
      mainWatcher = resolveMemoryNativeWatchFactory()(
        dir,
        { recursive: true },
        (_eventType, filename) => {
          if (filename == null) {
            markDirty();
            return;
          }
          const full = path.join(dir, filename);
          let stats;
          try {
            stats = fs.lstatSync(full, { throwIfNoEntry: false }) ?? void 0;
          } catch {
            stats = void 0;
          }
          if (shouldIgnoreMemoryWatchPath(full, stats, this.settings.multimodal)) return;
          markDirty(full, stats);
        },
      );
    } catch (err) {
      log$3.warn(
        `failed to start native recursive watcher on ${dir}: ${String(err)}; falling back to chokidar`,
      );
      return false;
    }
    const pair = {
      dir,
      main: mainWatcher,
      parent: null,
    };
    mainWatcher.on("error", (err) => {
      const message = err instanceof Error ? err.message : String(err);
      log$3.warn(`memory native watcher error on ${dir}: ${message}`);
      this.closeNativeMemoryWatchPair(pair);
      if (this.closed) return;
      markDirty();
      this.attachMemoryChokidarFallback(dir, markDirty);
    });
    this.nativeMemoryWatchPairs.push(pair);
    try {
      const parentDir = path.dirname(dir);
      const baseName = path.basename(dir);
      const parentWatcher = resolveMemoryNativeWatchFactory()(
        parentDir,
        { recursive: false },
        (_eventType, filename) => {
          if (filename !== null && filename !== baseName) return;
          let currentInode;
          try {
            currentInode = fs.statSync(dir).ino;
          } catch {
            currentInode = null;
          }
          if (currentInode === recordedInode) return;
          this.closeNativeMemoryWatchPair(pair);
          if (this.closed) return;
          markDirty();
          if (currentInode !== null) {
            if (!this.attachNativeMemoryWatchForDir(dir, markDirty))
              this.attachMemoryChokidarFallback(dir, markDirty);
          } else this.attachMemoryChokidarFallback(dir, markDirty);
        },
      );
      parentWatcher.on("error", (err) => {
        const message = err instanceof Error ? err.message : String(err);
        log$3.warn(`memory native parent watcher error on ${path.dirname(dir)}: ${message}`);
        try {
          parentWatcher.close();
        } catch {}
        this.removeNativeMemoryParentWatch(parentWatcher);
        if (pair.parent === parentWatcher) pair.parent = null;
      });
      pair.parent = parentWatcher;
    } catch (err) {
      log$3.warn(
        `memory native parent watcher could not start on ${path.dirname(dir)}: ${String(err)}`,
      );
    }
    return true;
  }
  attachLinuxMemoryDirectoryTreeWatchForDir(dir, markDirty) {
    if (this.closed) return false;
    let recordedInode;
    try {
      recordedInode = fs.statSync(dir).ino;
    } catch {
      return false;
    }
    let pair = null;
    const treeWatchers = /* @__PURE__ */ new Map();
    const closeAndFallback = (message) => {
      log$3.warn(message);
      if (pair) this.closeNativeMemoryWatchPair(pair);
      if (this.closed) return;
      markDirty();
      this.attachMemoryChokidarFallback(dir, markDirty);
    };
    const closeDirectorySubtree = (watchDir) => {
      const watchDirPrefix = `${watchDir}${path.sep}`;
      for (const [entryDir, entry] of Array.from(treeWatchers.entries())) {
        if (entryDir !== watchDir && !entryDir.startsWith(watchDirPrefix)) continue;
        try {
          entry.watcher.close();
        } catch {}
        treeWatchers.delete(entryDir);
      }
    };
    const attachDirectory = (watchDir) => {
      if (this.closed) return null;
      let currentInode;
      try {
        const currentStat = fs.statSync(watchDir);
        if (!currentStat.isDirectory()) return null;
        currentInode = currentStat.ino;
      } catch {
        return null;
      }
      const existing = treeWatchers.get(watchDir);
      if (existing) {
        if (existing.ino === currentInode) return existing.watcher;
        closeDirectorySubtree(watchDir);
      }
      let watcher;
      try {
        watcher = resolveMemoryNativeWatchFactory()(
          watchDir,
          { recursive: false },
          (eventType, filename) => {
            if (filename == null) {
              markDirty();
              if (!this.attachLinuxMemoryDirectoryTreeSubtree(watchDir, attachDirectory))
                closeAndFallback(
                  `failed to refresh Linux memory directory watchers under ${watchDir}; falling back to chokidar`,
                );
              return;
            }
            const full = path.join(watchDir, filename);
            let stats;
            try {
              stats = fs.lstatSync(full, { throwIfNoEntry: false }) ?? void 0;
            } catch {
              stats = void 0;
            }
            if (!stats) closeDirectorySubtree(full);
            if (stats?.isDirectory()) {
              if (eventType === "rename") closeDirectorySubtree(full);
              if (!this.attachLinuxMemoryDirectoryTreeSubtree(full, attachDirectory)) {
                closeAndFallback(
                  `failed to attach Linux memory directory watcher under ${full}; falling back to chokidar`,
                );
                return;
              }
            }
            if (shouldIgnoreMemoryWatchPath(full, stats, this.settings.multimodal)) return;
            markDirty(full, stats);
          },
        );
      } catch (err) {
        if (watchDir === dir)
          log$3.warn(
            `failed to start Linux memory directory watcher on ${watchDir}: ${String(err)}; falling back to chokidar`,
          );
        return null;
      }
      treeWatchers.set(watchDir, {
        watcher,
        ino: currentInode,
      });
      watcher.on("error", (err) => {
        const detail = err instanceof Error ? err.message : String(err);
        closeAndFallback(`memory Linux directory watcher error on ${watchDir}: ${detail}`);
      });
      return watcher;
    };
    const mainWatcher = attachDirectory(dir);
    if (!mainWatcher) return false;
    pair = {
      dir,
      main: mainWatcher,
      parent: null,
      treeWatchers,
    };
    this.nativeMemoryWatchPairs.push(pair);
    if (!this.attachLinuxMemoryDirectoryTreeSubtree(dir, attachDirectory)) {
      closeAndFallback(
        `failed to attach Linux memory directory watcher subtree under ${dir}; falling back to chokidar`,
      );
      return true;
    }
    try {
      const parentDir = path.dirname(dir);
      const baseName = path.basename(dir);
      const parentWatcher = resolveMemoryNativeWatchFactory()(
        parentDir,
        { recursive: false },
        (_eventType, filename) => {
          if (filename !== null && filename !== baseName) return;
          let currentInode;
          try {
            currentInode = fs.statSync(dir).ino;
          } catch {
            currentInode = null;
          }
          if (currentInode === recordedInode) return;
          this.closeNativeMemoryWatchPair(pair);
          if (this.closed) return;
          markDirty();
          if (currentInode !== null) {
            if (!this.attachLinuxMemoryDirectoryTreeWatchForDir(dir, markDirty))
              this.attachMemoryChokidarFallback(dir, markDirty);
          } else this.attachMemoryChokidarFallback(dir, markDirty);
        },
      );
      parentWatcher.on("error", (err) => {
        const message = err instanceof Error ? err.message : String(err);
        log$3.warn(`memory Linux parent watcher error on ${path.dirname(dir)}: ${message}`);
        try {
          parentWatcher.close();
        } catch {}
        this.removeNativeMemoryParentWatch(parentWatcher);
        if (pair?.parent === parentWatcher) pair.parent = null;
      });
      pair.parent = parentWatcher;
    } catch (err) {
      log$3.warn(
        `memory Linux parent watcher could not start on ${path.dirname(dir)}: ${String(err)}`,
      );
    }
    return true;
  }
  attachLinuxMemoryDirectoryTreeSubtree(root, attachDirectory) {
    let rootStats;
    try {
      rootStats = fs.lstatSync(root, { throwIfNoEntry: false }) ?? void 0;
    } catch {
      return false;
    }
    if (
      !rootStats?.isDirectory() ||
      shouldIgnoreMemoryWatchPath(root, rootStats, this.settings.multimodal)
    )
      return true;
    if (!attachDirectory(root)) return false;
    let entries;
    try {
      entries = fs.readdirSync(root, { withFileTypes: true });
    } catch {
      return false;
    }
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.isSymbolicLink()) continue;
      if (!this.attachLinuxMemoryDirectoryTreeSubtree(path.join(root, entry.name), attachDirectory))
        return false;
    }
    return true;
  }
  closeNativeMemoryWatchPair(pair) {
    if (pair.treeWatchers) {
      for (const entry of pair.treeWatchers.values())
        try {
          entry.watcher.close();
        } catch {}
      pair.treeWatchers.clear();
    } else
      try {
        pair.main.close();
      } catch {}
    if (pair.parent) {
      try {
        pair.parent.close();
      } catch {}
      pair.parent = null;
    }
    this.removeNativeMemoryWatchPair(pair);
  }
  closeNativeMemoryWatchPairs() {
    while (this.nativeMemoryWatchPairs.length > 0) {
      const pair = this.nativeMemoryWatchPairs[0];
      if (!pair) return;
      this.closeNativeMemoryWatchPair(pair);
    }
  }
  removeNativeMemoryParentWatch(w) {
    for (const pair of this.nativeMemoryWatchPairs)
      if (pair.parent === w) {
        pair.parent = null;
        return;
      }
  }
  removeNativeMemoryWatchPair(pair) {
    const idx = this.nativeMemoryWatchPairs.indexOf(pair);
    if (idx >= 0) this.nativeMemoryWatchPairs.splice(idx, 1);
  }
  attachMemoryChokidarFallback(dir, markDirty) {
    if (this.closed) return;
    try {
      if (this.watcher) {
        this.watcher.add(dir);
        return;
      }
      const watcher = resolveMemoryWatchFactory()([dir], {
        ignoreInitial: true,
        ignored: (watchPath, stats) =>
          shouldIgnoreMemoryWatchPath(watchPath, stats, this.settings.multimodal),
      });
      this.watcher = watcher;
      watcher.on("add", markDirty);
      watcher.on("change", markDirty);
      watcher.on("unlink", markDirty);
      watcher.on("unlinkDir", markDirty);
      watcher.on("error", (err) => {
        const message = err instanceof Error ? err.message : String(err);
        log$3.warn(`memory watcher error: ${message}`);
      });
      watcher.once("ready", () => {
        this.warnIfMemoryWatchPressure(countChokidarWatchedEntries(watcher), "paths");
      });
    } catch (err) {
      log$3.warn(`failed to attach chokidar fallback for ${dir}: ${String(err)}`);
    }
  }
  ensureSessionListener() {
    if (!this.sources.has("sessions") || this.sessionUnsubscribe) return;
    this.sessionUnsubscribe = this.subscribeSessionTranscriptUpdates((update) => {
      if (this.closed) return;
      const sessionFile = update.sessionFile;
      if (sessionFile && isSessionArchiveArtifactName(path.basename(sessionFile))) return;
      if (sessionFile && this.isSessionFileForAgent(sessionFile)) {
        this.scheduleSessionDirty(sessionFile);
        return;
      }
      const target = this.resolveSessionTranscriptUpdateSyncTarget(update);
      if (target) {
        this.scheduleSessionDirty(target);
        return;
      }
      if (sessionFile)
        this.scheduleCorpusSessionFileDirty(sessionFile).catch((err) => {
          log$3.warn(`memory session corpus update failed: ${String(err)}`);
        });
    });
  }
  subscribeSessionTranscriptUpdates(listener) {
    return onInternalSessionTranscriptUpdate(listener);
  }
  async scheduleCorpusSessionFileDirty(sessionFile) {
    const resolvedSessionFile = path.resolve(sessionFile);
    if (
      (await listSessionTranscriptCorpusEntriesForAgent(this.agentId)).some(
        (entry) => path.resolve(entry.sessionFile) === resolvedSessionFile,
      )
    )
      this.scheduleSessionDirty(resolvedSessionFile);
  }
  ensureSessionStartupCatchup() {
    if (!this.sources.has("sessions")) return;
    this.runSessionStartupCatchup().catch((err) => {
      log$3.warn("memory session startup catch-up failed: " + String(err));
    });
  }
  async markSessionStartupCatchupDirtyFiles() {
    if (!this.sources.has("sessions") || this.closed) return [];
    const corpusEntries = await listSessionTranscriptCorpusEntriesForAgent(this.agentId);
    if (corpusEntries.length === 0 || this.closed) return [];
    const existingRows = loadMemorySourceFileState({
      db: this.db,
      source: "sessions",
    }).rows;
    const dirtyFiles = resolveMemorySessionStartupDirtyFiles({
      files: (
        await runMemoryHostTasksWithConcurrency(
          corpusEntries.map((corpusEntry) => async () => {
            if (corpusEntry.transcriptSource === "sqlite")
              return statSessionEntrySync(
                corpusEntry.sessionFile,
                buildSessionEntryOptions(corpusEntry),
              );
            const file = corpusEntry.sessionFile;
            try {
              const stat = await fs$1.stat(file);
              if (!stat.isFile()) return null;
              return {
                absPath: file,
                path: sessionPathForCorpusEntry(corpusEntry),
                mtimeMs: stat.mtimeMs,
                size: stat.size,
              };
            } catch (err) {
              if (isFileMissingError(err)) return null;
              throw err;
            }
          }),
          this.getIndexConcurrency(),
        )
      ).filter((file) => file !== null),
      existingRows,
    });
    if (dirtyFiles.length === 0 || this.closed) return dirtyFiles;
    for (const file of dirtyFiles) this.sessionsDirtyFiles.add(file);
    this.sessionsDirty = true;
    return dirtyFiles;
  }
  async runSessionStartupCatchup() {
    const dirtyFiles = await this.markSessionStartupCatchupDirtyFiles();
    if (dirtyFiles.length === 0 || this.closed) return dirtyFiles;
    this.sync({ reason: "session-startup-catchup" }).catch((err) => {
      log$3.warn("memory sync failed (session-startup-catchup): " + String(err));
    });
    return dirtyFiles;
  }
  scheduleSessionDirty(target) {
    if (typeof target === "string") this.sessionPendingFiles.add(target);
    else this.sessionPendingTargets.set(this.memorySessionSyncTargetKey(target), target);
    if (this.sessionWatchTimer) return;
    this.sessionWatchTimer = setTimeout(() => {
      this.sessionWatchTimer = null;
      this.processSessionDeltaBatch().catch((err) => {
        log$3.warn(`memory session delta failed: ${String(err)}`);
      });
    }, SESSION_DIRTY_DEBOUNCE_MS);
  }
  async processSessionDeltaBatch() {
    if (this.sessionPendingFiles.size === 0 && this.sessionPendingTargets.size === 0) return;
    const pending = Array.from(this.sessionPendingFiles);
    const pendingTargets = Array.from(this.sessionPendingTargets.values());
    this.sessionPendingFiles.clear();
    this.sessionPendingTargets.clear();
    pending.push(...Array.from(await this.resolveArchiveFilesForSyncTargets(pendingTargets)));
    let shouldSync = false;
    for (const sessionFile of pending) {
      if (!path.isAbsolute(sessionFile)) {
        this.sessionsDirtyFiles.add(sessionFile);
        this.sessionsDirty = true;
        shouldSync = true;
        continue;
      }
      const baseName = path.basename(sessionFile);
      if (
        isSessionArchiveArtifactName(baseName) &&
        isUsageCountedSessionTranscriptFileName(baseName)
      ) {
        this.sessionsDirtyFiles.add(sessionFile);
        this.sessionsDirty = true;
        shouldSync = true;
        continue;
      }
      const delta = await this.updateSessionDelta(sessionFile);
      if (!delta) continue;
      const bytesThreshold = delta.deltaBytes;
      const messagesThreshold = delta.deltaMessages;
      const bytesHit =
        bytesThreshold <= 0 ? delta.pendingBytes > 0 : delta.pendingBytes >= bytesThreshold;
      const messagesHit =
        messagesThreshold <= 0
          ? delta.pendingMessages > 0
          : delta.pendingMessages >= messagesThreshold;
      if (!bytesHit && !messagesHit) continue;
      this.sessionsDirtyFiles.add(sessionFile);
      this.sessionsDirty = true;
      delta.pendingBytes =
        bytesThreshold > 0 ? Math.max(0, delta.pendingBytes - bytesThreshold) : 0;
      delta.pendingMessages =
        messagesThreshold > 0 ? Math.max(0, delta.pendingMessages - messagesThreshold) : 0;
      shouldSync = true;
    }
    if (shouldSync)
      this.sync({ reason: "session-delta" }).catch((err) => {
        log$3.warn(`memory sync failed (session-delta): ${String(err)}`);
      });
  }
  async updateSessionDelta(sessionFile) {
    const thresholds = this.settings.sync.sessions;
    if (!thresholds) return null;
    let stat;
    try {
      stat = await fs$1.stat(sessionFile);
    } catch {
      return null;
    }
    const size = stat.size;
    let state = this.sessionDeltas.get(sessionFile);
    if (!state) {
      state = {
        lastSize: 0,
        pendingBytes: 0,
        pendingMessages: 0,
      };
      this.sessionDeltas.set(sessionFile, state);
    }
    const deltaBytes = Math.max(0, size - state.lastSize);
    if (deltaBytes === 0 && size === state.lastSize)
      return {
        deltaBytes: thresholds.deltaBytes,
        deltaMessages: thresholds.deltaMessages,
        pendingBytes: state.pendingBytes,
        pendingMessages: state.pendingMessages,
      };
    if (size < state.lastSize) {
      state.lastSize = size;
      state.pendingBytes += size;
      if (
        thresholds.deltaMessages > 0 &&
        (thresholds.deltaBytes <= 0 || state.pendingBytes < thresholds.deltaBytes)
      )
        state.pendingMessages += await this.countNewlines(sessionFile, 0, size);
    } else {
      state.pendingBytes += deltaBytes;
      if (
        thresholds.deltaMessages > 0 &&
        (thresholds.deltaBytes <= 0 || state.pendingBytes < thresholds.deltaBytes)
      )
        state.pendingMessages += await this.countNewlines(sessionFile, state.lastSize, size);
      state.lastSize = size;
    }
    this.sessionDeltas.set(sessionFile, state);
    return {
      deltaBytes: thresholds.deltaBytes,
      deltaMessages: thresholds.deltaMessages,
      pendingBytes: state.pendingBytes,
      pendingMessages: state.pendingMessages,
    };
  }
  async countNewlines(absPath, start, end) {
    if (end <= start) return 0;
    let handle;
    try {
      handle = await retryTransientMemoryRead(
        () => fs$1.open(absPath, "r"),
        `open session transcript for newline count ${absPath}`,
      );
    } catch (err) {
      if (isFileMissingError(err)) return 0;
      throw err;
    }
    try {
      let offset = start;
      let count = 0;
      const buffer = Buffer.alloc(SESSION_DELTA_READ_CHUNK_BYTES);
      while (offset < end) {
        const toRead = Math.min(buffer.length, end - offset);
        const { bytesRead } = await retryTransientMemoryRead(
          () => handle.read(buffer, 0, toRead, offset),
          `count session transcript newlines ${absPath}`,
        );
        if (bytesRead <= 0) break;
        for (let i = 0; i < bytesRead; i += 1) if (buffer[i] === 10) count += 1;
        offset += bytesRead;
      }
      return count;
    } finally {
      await handle.close();
    }
  }
  resetSessionDelta(absPath, size) {
    const state = this.sessionDeltas.get(absPath);
    if (!state) return;
    state.lastSize = size;
    state.pendingBytes = 0;
    state.pendingMessages = 0;
  }
  isSessionFileForAgent(sessionFile) {
    if (!sessionFile) return false;
    const sessionsDir = resolveSessionTranscriptsDirForAgent(this.agentId);
    const resolvedFile = path.resolve(sessionFile);
    const resolvedDir = path.resolve(sessionsDir);
    return resolvedFile.startsWith(`${resolvedDir}${path.sep}`);
  }
  resolveSessionTranscriptUpdateSyncTarget(update) {
    if (update.sessionFile && isSessionArchiveArtifactName(path.basename(update.sessionFile)))
      return null;
    if (update.target) {
      const agentId = update.target.agentId.trim();
      const sessionId = update.target.sessionId.trim();
      const sessionKey = update.target.sessionKey.trim();
      if (!agentId || !sessionId || normalizeAgentId(agentId) !== normalizeAgentId(this.agentId))
        return null;
      return {
        agentId,
        sessionId,
        ...(sessionKey ? { sessionKey } : {}),
      };
    }
    if (!update.sessionFile) return null;
    const parsed = parseCanonicalSessionSyncTargetFromPath(update.sessionFile);
    if (!parsed) return null;
    const agentId = update.agentId?.trim() || parsed.agentId;
    if (!agentId || normalizeAgentId(agentId) !== normalizeAgentId(this.agentId)) return null;
    const sessionKey = update.sessionKey?.trim();
    return {
      agentId,
      sessionId: parsed.sessionId,
      ...(sessionKey ? { sessionKey } : {}),
    };
  }
  normalizeTargetArchiveFiles(archiveFiles, corpusEntries = []) {
    if (!archiveFiles || archiveFiles.length === 0) return null;
    const normalized = /* @__PURE__ */ new Set();
    const corpusMarkers = new Set(
      corpusEntries
        .filter((entry) => entry.transcriptSource === "sqlite")
        .map((entry) => entry.sessionFile),
    );
    const corpusPaths = new Set(
      corpusEntries
        .filter((entry) => entry.transcriptSource !== "sqlite")
        .map((entry) => path.resolve(entry.sessionFile)),
    );
    for (const sessionFile of archiveFiles) {
      const trimmed = sessionFile.trim();
      if (!trimmed) continue;
      if (corpusMarkers.has(trimmed)) {
        normalized.add(trimmed);
        continue;
      }
      const sqliteMarker = parseSqliteSessionFileMarker(trimmed);
      if (
        sqliteMarker &&
        normalizeAgentId(sqliteMarker.agentId) === normalizeAgentId(this.agentId)
      ) {
        normalized.add(trimmed);
        continue;
      }
      const resolved = path.resolve(trimmed);
      if (
        this.isSessionFileForAgent(resolved) &&
        parseCanonicalSessionSyncTargetFromPath(resolved)
      ) {
        normalized.add(resolved);
        continue;
      }
      if (corpusPaths.has(resolved)) normalized.add(resolved);
    }
    return normalized.size > 0 ? normalized : null;
  }
  normalizeTargetSessions(sessions) {
    if (!sessions || sessions.length === 0) return null;
    const normalized = /* @__PURE__ */ new Map();
    for (const session of sessions) {
      const sessionId = session.sessionId.trim();
      const agentId = session.agentId?.trim() || this.agentId;
      if (!sessionId || normalizeAgentId(agentId) !== normalizeAgentId(this.agentId)) continue;
      const sessionKey = session.sessionKey?.trim();
      const target = {
        agentId,
        sessionId,
        ...(sessionKey ? { sessionKey } : {}),
      };
      normalized.set(this.memorySessionSyncTargetKey(target), target);
    }
    return normalized.size > 0 ? normalized : null;
  }
  async resolveArchiveFilesForSyncTargets(sessions, knownCorpusEntries) {
    const files = /* @__PURE__ */ new Set();
    const targets = Array.from(sessions ?? []);
    if (targets.length === 0) return files;
    const corpusEntries =
      knownCorpusEntries ?? (await listSessionTranscriptCorpusEntriesForAgent(this.agentId));
    for (const session of targets) {
      const sessionKey = session.sessionKey?.trim();
      let matchedCorpusEntry = false;
      for (const entry of corpusEntries) {
        if (normalizeAgentId(entry.agentId) !== normalizeAgentId(this.agentId)) continue;
        if (entry.sessionId !== session.sessionId) continue;
        if (sessionKey && entry.sessionKey !== sessionKey) continue;
        files.add(
          entry.transcriptSource === "sqlite" ? entry.sessionFile : path.resolve(entry.sessionFile),
        );
        matchedCorpusEntry = true;
      }
      if (matchedCorpusEntry) continue;
      const resolved = resolveSessionFileForSyncTarget(session, this.agentId);
      if (!resolved || normalizeAgentId(resolved.agentId) !== normalizeAgentId(this.agentId))
        continue;
      const sessionFile = path.resolve(resolved.sessionFile);
      if (
        this.isSessionFileForAgent(sessionFile) &&
        parseCanonicalSessionSyncTargetFromPath(sessionFile)
      )
        files.add(sessionFile);
    }
    return files;
  }
  async combineTargetArchiveFiles(params) {
    const files = /* @__PURE__ */ new Set();
    const corpusEntries = await listSessionTranscriptCorpusEntriesForAgent(this.agentId);
    for (const file of this.normalizeTargetArchiveFiles(params.archiveFiles, corpusEntries) ?? [])
      files.add(file);
    for (const file of await this.resolveArchiveFilesForSyncTargets(
      this.normalizeTargetSessions(params.sessions)?.values(),
      corpusEntries,
    ))
      files.add(file);
    return files.size > 0 ? files : null;
  }
  memorySessionSyncTargetKey(target) {
    return [target.agentId ?? "", target.sessionId, target.sessionKey ?? ""].join("\0");
  }
  ensureIntervalSync() {
    const minutes = this.settings.sync.intervalMinutes;
    if (!minutes || minutes <= 0 || this.intervalTimer) return;
    const ms = resolveTimerTimeoutMs(minutes * 60 * 1e3, 0, 0);
    if (ms <= 0) return;
    this.intervalTimer = setInterval(() => {
      runDetachedMemorySync(() => this.sync({ reason: "interval" }), "interval");
    }, ms);
  }
  scheduleWatchSync() {
    if (!this.sources.has("memory") || !this.settings.sync.watch) return;
    if (this.watchTimer) clearTimeout(this.watchTimer);
    this.watchTimer = setTimeout(() => {
      this.watchTimer = null;
      runDetachedMemorySync(async () => {
        if (this.closed) return;
        if (!(await settleMemoryWatchEventPaths(this.pendingWatchPaths))) {
          if (!this.closed) this.scheduleWatchSync();
          return;
        }
        if (this.closed) return;
        await this.sync({ reason: "watch" });
      }, "watch");
    }, this.settings.sync.watchDebounceMs);
  }
  shouldSyncSessions(params, needsFullReindex = false) {
    return shouldSyncSessionsForReindex({
      hasSessionSource: this.sources.has("sessions"),
      sessionsDirty: this.sessionsDirty,
      sessionsFullRetryDirty: this.sessionsFullRetryDirty,
      dirtySessionFileCount: this.sessionsDirtyFiles.size,
      sync: params,
      needsFullReindex,
    });
  }
  async syncMemoryFiles(params) {
    const deleteFileByPathAndSource = this.db.prepare(
      `DELETE FROM memory_index_sources WHERE path = ? AND source = ?`,
    );
    const deleteChunksByPathAndSource = this.db.prepare(
      `DELETE FROM memory_index_chunks WHERE path = ? AND source = ?`,
    );
    const deleteVectorRowsByPathAndSource =
      this.vector.enabled && this.vector.available
        ? this.db.prepare(
            `DELETE FROM ${VECTOR_TABLE$2} WHERE id IN (SELECT id FROM memory_index_chunks WHERE path = ? AND source = ?)`,
          )
        : null;
    const deleteFtsRowsByPathAndSource =
      this.fts.enabled && this.fts.available
        ? this.db.prepare(`DELETE FROM ${FTS_TABLE$2} WHERE path = ? AND source = ?`)
        : null;
    const fileEntries = (
      await runMemoryHostTasksWithConcurrency(
        (
          await listMemoryFiles(
            this.workspaceDir,
            this.settings.extraPaths,
            this.settings.multimodal,
          )
        ).map(
          (file) => async () =>
            await buildFileEntry(file, this.workspaceDir, this.settings.multimodal),
        ),
        this.getIndexConcurrency(),
      )
    ).filter((entry) => entry !== null);
    log$3.debug("memory sync: indexing memory files", {
      files: fileEntries.length,
      needsFullReindex: params.needsFullReindex,
      batch: this.batch.enabled,
      concurrency: this.getIndexConcurrency(),
    });
    const existingState = loadMemorySourceFileState({
      db: this.db,
      source: "memory",
    });
    const existingRows = existingState.rows;
    const existingHashes = existingState.hashes;
    const activePaths = new Set(fileEntries.map((entry) => entry.path));
    if (params.progress) {
      params.progress.total += fileEntries.length;
      params.progress.report({
        completed: params.progress.completed,
        total: params.progress.total,
        label: this.batch.enabled ? "Indexing memory files (batch)..." : "Indexing memory files…",
      });
    }
    const deleteStaleRows = async () => {
      for (const stale of existingRows) {
        if (activePaths.has(stale.path)) continue;
        deleteFileByPathAndSource.run(stale.path, "memory");
        if (deleteVectorRowsByPathAndSource)
          try {
            deleteVectorRowsByPathAndSource.run(stale.path, "memory");
          } catch {}
        deleteChunksByPathAndSource.run(stale.path, "memory");
        if (deleteFtsRowsByPathAndSource)
          try {
            deleteFtsRowsByPathAndSource.run(stale.path, "memory");
          } catch {}
      }
    };
    if (this.batch.enabled) {
      const dirtyEntries = [];
      for (const entry of fileEntries) {
        if (!params.needsFullReindex && existingHashes.get(entry.path) === entry.hash) {
          if (params.progress) {
            params.progress.completed += 1;
            params.progress.report({
              completed: params.progress.completed,
              total: params.progress.total,
            });
          }
          continue;
        }
        dirtyEntries.push(entry);
      }
      const indexItems = dirtyEntries.map((entry) => ({
        entry,
        source: "memory",
      }));
      if (params.deferIndex)
        return {
          indexItems,
          finalize: deleteStaleRows,
        };
      await this.indexQueuedFiles(indexItems, params.progress);
    } else
      await runMemoryHostTasksWithConcurrency(
        fileEntries.map((entry) => async () => {
          if (!params.needsFullReindex && existingHashes.get(entry.path) === entry.hash) {
            if (params.progress) {
              params.progress.completed += 1;
              params.progress.report({
                completed: params.progress.completed,
                total: params.progress.total,
              });
            }
            return;
          }
          await this.indexFile(entry, { source: "memory" });
          if (params.progress) {
            params.progress.completed += 1;
            params.progress.report({
              completed: params.progress.completed,
              total: params.progress.total,
            });
          }
        }),
        this.getIndexConcurrency(),
      );
    await deleteStaleRows();
    return this.emptySourceSyncPlan();
  }
  async syncArchiveFiles(params) {
    const deleteFileByPathAndSource = this.db.prepare(
      `DELETE FROM memory_index_sources WHERE path = ? AND source = ?`,
    );
    const deleteChunksByPathAndSource = this.db.prepare(
      `DELETE FROM memory_index_chunks WHERE path = ? AND source = ?`,
    );
    const deleteVectorRowsByPathAndSource =
      this.vector.enabled && this.vector.available
        ? this.db.prepare(
            `DELETE FROM ${VECTOR_TABLE$2} WHERE id IN (SELECT id FROM memory_index_chunks WHERE path = ? AND source = ?)`,
          )
        : null;
    const deleteFtsRowsByPathAndSource =
      this.fts.enabled && this.fts.available
        ? this.db.prepare(`DELETE FROM ${FTS_TABLE$2} WHERE path = ? AND source = ?`)
        : null;
    const corpusEntries = await listSessionTranscriptCorpusEntriesForAgent(this.agentId);
    const targetArchiveFiles = params.needsFullReindex
      ? null
      : this.normalizeTargetArchiveFiles(params.targetArchiveFiles, corpusEntries);
    const corpusEntryByPath = new Map(corpusEntries.map((entry) => [entry.sessionFile, entry]));
    const files = targetArchiveFiles
      ? Array.from(targetArchiveFiles)
      : corpusEntries.map((entry) => entry.sessionFile);
    const { activePaths, existingRows, existingHashes, indexAll } = resolveMemorySessionSyncPlan({
      needsFullReindex: params.needsFullReindex,
      files,
      targetSessionFiles: targetArchiveFiles,
      sessionsDirtyFiles: this.sessionsDirtyFiles,
      existingRows: targetArchiveFiles
        ? null
        : loadMemorySourceFileState({
            db: this.db,
            source: "sessions",
          }).rows,
      sessionPathForFile: (file) => {
        const corpusEntry = corpusEntryByPath.get(file);
        if (corpusEntry) return sessionPathForCorpusEntry(corpusEntry);
        const sqliteMarker = parseSqliteSessionFileMarker(file);
        return sqliteMarker
          ? sessionPathForSessionIdentity(sqliteMarker.agentId, sqliteMarker.sessionId)
          : sessionPathForFile(file);
      },
    });
    log$3.debug("memory sync: indexing session files", {
      files: files.length,
      indexAll,
      dirtyFiles: this.sessionsDirtyFiles.size,
      targetedFiles: targetArchiveFiles?.size ?? 0,
      batch: this.batch.enabled,
      concurrency: this.getIndexConcurrency(),
    });
    if (params.progress) {
      params.progress.total += files.length;
      params.progress.report({
        completed: params.progress.completed,
        total: params.progress.total,
        label: this.batch.enabled ? "Indexing session files (batch)..." : "Indexing session files…",
      });
    }
    const yieldAfterSessionFile = createSessionSyncYield(files.length);
    const deleteIndexedSessionPath = (memoryPath) => {
      deleteFileByPathAndSource.run(memoryPath, "sessions");
      if (deleteVectorRowsByPathAndSource)
        try {
          deleteVectorRowsByPathAndSource.run(memoryPath, "sessions");
        } catch {}
      deleteChunksByPathAndSource.run(memoryPath, "sessions");
      if (deleteFtsRowsByPathAndSource)
        try {
          deleteFtsRowsByPathAndSource.run(memoryPath, "sessions");
        } catch {}
    };
    const deleteStaleRows = async () => {
      if (activePaths === null) return;
      const staleRows = existingRows ?? [];
      const yieldAfterStaleSessionRow = createSessionSyncYield(staleRows.length);
      for (const stale of staleRows)
        try {
          if (activePaths.has(stale.path)) continue;
          deleteIndexedSessionPath(stale.path);
        } finally {
          await yieldAfterStaleSessionRow();
        }
    };
    const deleteTargetArchiveStaleLiveRows = () => {
      if (!targetArchiveFiles) return;
      const activeCorpusPaths = new Set(
        corpusEntries
          .filter((entry) => entry.artifactKind === "active-session")
          .map((entry) => sessionPathForCorpusEntry(entry)),
      );
      const existingSessionPaths = new Set(
        loadMemorySourceFileState({
          db: this.db,
          source: "sessions",
        }).rows.map((row) => row.path),
      );
      for (const file of targetArchiveFiles) {
        const corpusEntry = corpusEntryByPath.get(file);
        const sqliteMarker = parseSqliteSessionFileMarker(file);
        const sessionId =
          corpusEntry?.sessionId ??
          sqliteMarker?.sessionId ??
          parseUsageCountedSessionIdFromFileName(path.basename(file));
        if (!sessionId) continue;
        const staleAgentId = corpusEntry?.agentId ?? sqliteMarker?.agentId ?? this.agentId;
        const staleLivePaths = [
          sessionPathForSessionIdentity(staleAgentId, sessionId),
          legacyExtensionlessSessionPathForIdentity(staleAgentId, sessionId),
        ];
        for (const staleLivePath of staleLivePaths) {
          if (activeCorpusPaths.has(staleLivePath) || !existingSessionPaths.has(staleLivePath))
            continue;
          deleteIndexedSessionPath(staleLivePath);
        }
      }
    };
    if (params.deferIndex) {
      const pendingIndexItems = [...(params.prefixIndexItems ?? [])];
      const flushPendingIndexItems = async () => {
        if (pendingIndexItems.length === 0) return;
        const current = pendingIndexItems.splice(0);
        const sources = new Set(current.map((item) => item.source));
        await this.indexQueuedFiles(
          current,
          params.progress,
          sources.size > 1 ? "Indexing memory sources (batch)..." : void 0,
        );
      };
      for (let start = 0; start < files.length; start += SOURCE_WIDE_SESSION_INDEX_FLUSH_FILES) {
        const dirtyEntries = (
          await runMemoryHostTasksWithConcurrency(
            files
              .slice(start, start + SOURCE_WIDE_SESSION_INDEX_FLUSH_FILES)
              .map((absPath) => async () => {
                try {
                  if (!indexAll && !this.sessionsDirtyFiles.has(absPath)) {
                    if (params.progress) {
                      params.progress.completed += 1;
                      params.progress.report({
                        completed: params.progress.completed,
                        total: params.progress.total,
                      });
                    }
                    return null;
                  }
                  const corpusEntry = corpusEntryByPath.get(absPath);
                  const entry = await buildSessionEntry(
                    absPath,
                    corpusEntry ? buildSessionEntryOptions(corpusEntry) : void 0,
                  );
                  if (!entry) {
                    if (params.progress) {
                      params.progress.completed += 1;
                      params.progress.report({
                        completed: params.progress.completed,
                        total: params.progress.total,
                      });
                    }
                    return null;
                  }
                  const existingHash = resolveMemorySourceExistingHash({
                    db: this.db,
                    source: "sessions",
                    path: entry.path,
                    existingHashes,
                  });
                  if (!params.needsFullReindex && existingHash === entry.hash) {
                    if (params.progress) {
                      params.progress.completed += 1;
                      params.progress.report({
                        completed: params.progress.completed,
                        total: params.progress.total,
                      });
                    }
                    this.resetSessionDelta(absPath, entry.size);
                    return null;
                  }
                  return entry;
                } finally {
                  await yieldAfterSessionFile();
                }
              }),
            this.getIndexConcurrency(),
          )
        ).filter((entry) => entry !== null);
        pendingIndexItems.push(
          ...dirtyEntries.map((entry) => ({
            entry,
            source: "sessions",
            afterIndex: () => this.resetSessionDelta(entry.absPath, entry.size),
          })),
        );
        if (pendingIndexItems.length >= SOURCE_WIDE_SESSION_INDEX_FLUSH_FILES)
          await flushPendingIndexItems();
      }
      await flushPendingIndexItems();
      deleteTargetArchiveStaleLiveRows();
      await deleteStaleRows();
      return this.emptySourceSyncPlan();
    }
    if ((params.prefixIndexItems?.length ?? 0) > 0)
      throw new Error("Memory session sync prefix requires deferred source-wide indexing.");
    await runMemoryHostTasksWithConcurrency(
      files.map((absPath) => async () => {
        try {
          if (!indexAll && !this.sessionsDirtyFiles.has(absPath)) {
            if (params.progress) {
              params.progress.completed += 1;
              params.progress.report({
                completed: params.progress.completed,
                total: params.progress.total,
              });
            }
            return;
          }
          const corpusEntry = corpusEntryByPath.get(absPath);
          const entry = await buildSessionEntry(
            absPath,
            corpusEntry ? buildSessionEntryOptions(corpusEntry) : void 0,
          );
          if (!entry) {
            if (params.progress) {
              params.progress.completed += 1;
              params.progress.report({
                completed: params.progress.completed,
                total: params.progress.total,
              });
            }
            return;
          }
          const existingHash = resolveMemorySourceExistingHash({
            db: this.db,
            source: "sessions",
            path: entry.path,
            existingHashes,
          });
          if (!params.needsFullReindex && existingHash === entry.hash) {
            if (params.progress) {
              params.progress.completed += 1;
              params.progress.report({
                completed: params.progress.completed,
                total: params.progress.total,
              });
            }
            this.resetSessionDelta(absPath, entry.size);
            return;
          }
          await this.indexFile(entry, {
            source: "sessions",
            content: entry.content,
          });
          this.resetSessionDelta(absPath, entry.size);
          if (params.progress) {
            params.progress.completed += 1;
            params.progress.report({
              completed: params.progress.completed,
              total: params.progress.total,
            });
          }
        } finally {
          await yieldAfterSessionFile();
        }
      }),
      this.getIndexConcurrency(),
    );
    deleteTargetArchiveStaleLiveRows();
    await deleteStaleRows();
    return this.emptySourceSyncPlan();
  }
  createSyncProgress(onProgress) {
    const state = {
      completed: 0,
      total: 0,
      label: void 0,
      report: (update) => {
        if (update.label) state.label = update.label;
        const label =
          update.total > 0 && state.label
            ? `${state.label} ${update.completed}/${update.total}`
            : state.label;
        onProgress({
          completed: update.completed,
          total: update.total,
          label,
        });
      },
    };
    return state;
  }
  assertFtsOnlySyncAllowed() {
    if (this.provider) return;
    this.assertRequiredProviderAvailable("sync");
    const existingMeta = this.readMeta();
    if (
      !existingMeta ||
      existingMeta.model === "fts-only" ||
      !this.settings.provider ||
      this.settings.provider === "none"
    )
      return;
    this.resetProviderInitializationForRetry();
    throw new Error(
      `Memory sync aborted: embedding provider "${this.settings.provider}" is configured but unavailable. Refusing to run sync in fts-only fallback mode to protect existing vector index (current model: ${existingMeta.model}).`,
    );
  }
  async runSync(params) {
    this.assertFtsOnlySyncAllowed();
    const progress = params?.progress ? this.createSyncProgress(params.progress) : void 0;
    if (progress)
      progress.report({
        completed: progress.completed,
        total: progress.total,
        label: "Loading vector extension…",
      });
    const vectorReady = await this.ensureVectorReady();
    const meta = this.readMeta();
    const targetArchiveFiles = await this.combineTargetArchiveFiles({
      sessions: params?.sessions,
      archiveFiles: params?.archiveFiles,
    });
    const hasTargetArchiveFiles = targetArchiveFiles !== null;
    if (this.hasRequestedTargetSessionSync(params) && !hasTargetArchiveFiles) return;
    if (params?.reason === "cli" && !params.force && !hasTargetArchiveFiles)
      await this.markSessionStartupCatchupDirtyFiles();
    const indexIdentity = resolveMemoryIndexIdentityState({
      meta,
      provider: this.provider
        ? {
            id: this.provider.id,
            model: this.provider.model,
          }
        : null,
      providerKey: this.providerKey ?? void 0,
      providerAliases: this.resolveProviderIndexIdentities().slice(1),
      configuredSources: resolveConfiguredSourcesForMeta(this.sources),
      configuredScopeHash: resolveConfiguredScopeHash({
        workspaceDir: this.workspaceDir,
        extraPaths: this.settings.extraPaths,
        multimodal: {
          enabled: this.settings.multimodal.enabled,
          modalities: this.settings.multimodal.modalities,
          maxFileBytes: this.settings.multimodal.maxFileBytes,
        },
      }),
      chunkTokens: this.settings.chunking.tokens,
      chunkOverlap: this.settings.chunking.overlap,
      vectorReady,
      hasIndexedChunks: this.hasIndexedChunks(),
      ftsTokenizer: this.settings.store.fts.tokenizer,
    });
    const hasIndexedChunks = this.hasIndexedChunks();
    const needsInitialIndex = indexIdentity.status !== "valid" && !hasIndexedChunks;
    const hasOnlyFtsChunks =
      indexIdentity.status === "missing" &&
      hasIndexedChunks &&
      this.provider === null &&
      Boolean(this.settings.provider) &&
      this.settings.provider !== "none" &&
      !this.hasSemanticChunks();
    const canRebuildMissingIdentity =
      this.provider !== null ||
      !this.settings.provider ||
      this.settings.provider === "none" ||
      hasOnlyFtsChunks;
    const needsMissingIdentityReindex =
      indexIdentity.status === "missing" && !hasTargetArchiveFiles && canRebuildMissingIdentity;
    const needsExplicitIdentityReindex =
      params?.reason === "cli" && indexIdentity.status !== "valid" && !hasTargetArchiveFiles;
    const canRunRetryFullReindex =
      indexIdentity.status !== "missing" || needsInitialIndex || canRebuildMissingIdentity;
    const needsFullReindex =
      (params?.force && !hasTargetArchiveFiles) ||
      needsInitialIndex ||
      needsMissingIdentityReindex ||
      needsExplicitIdentityReindex ||
      (this.memoryFullRetryDirty && canRunRetryFullReindex) ||
      (this.sessionsFullRetryDirty && indexIdentity.status !== "valid" && canRunRetryFullReindex);
    const needsFullSessionReindex = needsFullReindex || this.sessionsFullRetryDirty;
    if (indexIdentity.status !== "valid" && !needsFullReindex) {
      this.dirty = true;
      if (
        markMemoryTargetArchiveFilesDirty({
          sessionsDirtyFiles: this.sessionsDirtyFiles,
          targetArchiveFiles,
        })
      )
        this.sessionsDirty = true;
      return;
    }
    if (!needsFullSessionReindex) {
      const targetedSessionSync = await runMemoryTargetedSessionSync({
        hasSessionSource: this.sources.has("sessions"),
        targetArchiveFiles,
        reason: params?.reason,
        progress: progress ?? void 0,
        sessionsFullRetryDirty: this.sessionsFullRetryDirty,
        sessionsDirtyFiles: this.sessionsDirtyFiles,
        syncArchiveFiles: async (targetedParams) => {
          await this.syncArchiveFiles(targetedParams);
        },
        shouldFallbackOnError: (err) => this.shouldFallbackOnError(err),
        activateFallbackProvider: async (reason) => await this.activateFallbackProvider(reason),
      });
      if (targetedSessionSync.handled) {
        this.sessionsDirty = targetedSessionSync.sessionsDirty;
        return;
      }
    }
    try {
      if (needsFullReindex) {
        await this.runInPlaceReindex({
          reason: params?.reason,
          force: params?.force,
          progress: progress ?? void 0,
        });
        return;
      }
      const shouldSyncMemory =
        this.sources.has("memory") &&
        ((!hasTargetArchiveFiles && params?.force) || needsFullReindex || this.dirty);
      const shouldSyncSessions = this.shouldSyncSessions(params, needsFullReindex);
      if (this.shouldDeferSourceWideBatch()) {
        await this.executeSourceWideSync({
          shouldSyncMemory,
          shouldSyncSessions,
          needsFullReindex,
          needsFullSessionReindex,
          targetArchiveFiles: targetArchiveFiles ? Array.from(targetArchiveFiles) : void 0,
          progress: progress ?? void 0,
        });
        if (shouldSyncMemory) this.clearMemoryRetryState();
        if (shouldSyncSessions) this.clearSessionRetryState();
        else this.refreshSessionDirtyFlag();
      } else {
        if (shouldSyncMemory) {
          await this.syncMemoryFiles({
            needsFullReindex,
            progress: progress ?? void 0,
          });
          this.clearMemoryRetryState();
        }
        if (shouldSyncSessions) {
          await this.syncArchiveFiles({
            needsFullReindex: needsFullSessionReindex,
            targetArchiveFiles: targetArchiveFiles ? Array.from(targetArchiveFiles) : void 0,
            progress: progress ?? void 0,
          });
          this.clearSessionRetryState();
        } else this.refreshSessionDirtyFlag();
      }
    } catch (err) {
      const reason = formatErrorMessage(err);
      if (this.shouldFallbackOnError(err) && (await this.activateFallbackProvider(reason))) {
        if (needsFullReindex && !hasTargetArchiveFiles)
          await this.runInPlaceReindex({
            reason: params?.reason ?? "fallback",
            force: true,
            progress: progress ?? void 0,
          });
        return;
      }
      if (!this.provider && this.fts.enabled && this.shouldFallbackOnError(err)) {
        log$3.warn(`memory embeddings unavailable; leaving memory index dirty: ${reason}`);
        return;
      }
      throw err;
    }
  }
  shouldFallbackOnError(err) {
    return isMemoryEmbeddingOperationError(err);
  }
  hasRequestedTargetSessionSync(params) {
    return Boolean(
      params?.sessions?.some((session) => session.sessionId.trim().length > 0) ||
      params?.archiveFiles?.some((sessionFile) => sessionFile.trim().length > 0),
    );
  }
  resolveBatchConfig() {
    const batch = this.settings.remote?.batch;
    return {
      enabled: Boolean(batch?.enabled && this.provider && this.providerRuntime?.batchEmbed),
      wait: batch?.wait ?? true,
      concurrency: Math.max(1, batch?.concurrency ?? 2),
      pollIntervalMs: batch?.pollIntervalMs ?? 2e3,
      timeoutMs: resolveTimerTimeoutMs((batch?.timeoutMinutes ?? 60) * 60 * 1e3, 60 * 6e4),
    };
  }
  async activateFallbackProvider(reason) {
    const currentProviderId = resolveFallbackCurrentProviderId({
      provider: this.provider,
      lifecycle: this.providerLifecycle,
    });
    const fallbackRequest = resolveMemoryFallbackProviderRequest({
      cfg: this.cfg,
      settings: this.settings,
      currentProviderId,
    });
    if (!fallbackRequest || !currentProviderId) return false;
    if (this.fallbackFrom) return false;
    const fallbackResult = await createEmbeddingProvider({
      config: this.cfg,
      agentDir: resolveAgentDir(this.cfg, this.agentId),
      ...(this.acquireLocalService ? { acquireLocalService: this.acquireLocalService } : {}),
      ...fallbackRequest,
    });
    const fallbackState = applyMemoryFallbackProviderState({
      current: {
        provider: this.provider,
        fallbackFrom: this.fallbackFrom,
        fallbackReason: this.fallbackReason,
        providerUnavailableReason: void 0,
        providerRuntime: this.providerRuntime,
        lifecycle: this.providerLifecycle,
      },
      fallbackFrom: currentProviderId,
      reason,
      result: fallbackResult,
    });
    this.fallbackFrom = fallbackState.fallbackFrom;
    this.fallbackReason = fallbackState.fallbackReason;
    this.provider = fallbackState.provider;
    this.providerRuntime = fallbackState.providerRuntime;
    this.providerUnavailableReason = fallbackState.providerUnavailableReason;
    this.providerLifecycle = fallbackState.lifecycle;
    this.providerKey = this.computeProviderKey();
    this.batch = this.resolveBatchConfig();
    log$3.warn(`memory embeddings: switched to fallback provider (${fallbackRequest.provider})`, {
      reason,
    });
    return true;
  }
  async runInPlaceReindex(params) {
    const dbPath = resolveUserPath(this.settings.store.databasePath);
    const tempDbPath = `${dbPath}.memory-reindex-${randomUUID()}`;
    const originalDb = this.db;
    let reindexLock;
    let tempDb;
    let tempDbClosed = false;
    const originalRetryState = this.snapshotReindexRetryState();
    const shouldRetryMemoryOnFailure = this.sources.has("memory");
    const shouldRetrySessionsOnFailure = this.shouldSyncSessions(
      {
        reason: params.reason,
        force: params.force,
      },
      true,
    );
    const originalState = {
      ftsAvailable: this.fts.available,
      ftsError: this.fts.loadError,
      lastMetaSerialized: this.lastMetaSerialized,
      vectorAvailable: this.vector.available,
      vectorLoadError: this.vector.loadError,
      vectorDims: this.vector.dims,
      vectorDegradedWriteWarningShown: this.vectorDegradedWriteWarningShown,
      vectorReady: this.vectorReady,
    };
    const restoreOriginalState = () => {
      this.db = originalDb;
      this.fts.available = originalState.ftsAvailable;
      this.fts.loadError = originalState.ftsError;
      this.lastMetaSerialized = originalState.lastMetaSerialized;
      this.vector.available = originalState.vectorAvailable;
      this.vector.loadError = originalState.vectorLoadError;
      this.vector.dims = originalState.vectorDims;
      this.vectorDegradedWriteWarningShown = originalState.vectorDegradedWriteWarningShown;
      this.vectorReady = originalState.vectorReady;
    };
    try {
      cleanupAgedMemoryReindexTempFiles(dbPath);
      reindexLock = acquireMemoryReindexLock(dbPath);
      const originalRevision = readMemoryDatabaseRevision(originalDb);
      tempDb = openMemoryDatabaseAtPath(tempDbPath, this.settings.store.vector.enabled);
      this.db = tempDb;
      this.lastMetaSerialized = null;
      this.resetVectorState();
      this.fts.available = false;
      this.fts.loadError = void 0;
      this.ensureSchema();
      await this.seedEmbeddingCache(originalDb);
      const shouldSyncMemory = shouldRetryMemoryOnFailure;
      const shouldSyncSessions = shouldRetrySessionsOnFailure;
      if (this.shouldDeferSourceWideBatch()) {
        await this.executeSourceWideSync({
          shouldSyncMemory,
          shouldSyncSessions,
          needsFullReindex: true,
          progress: params.progress,
        });
        if (shouldSyncMemory) this.clearMemoryRetryState();
        if (shouldSyncSessions) this.clearSessionRetryState();
        else this.refreshSessionDirtyFlag();
      } else {
        if (shouldSyncMemory) {
          await this.syncMemoryFiles({
            needsFullReindex: true,
            progress: params.progress,
          });
          this.clearMemoryRetryState();
        }
        if (shouldSyncSessions) {
          await this.syncArchiveFiles({
            needsFullReindex: true,
            progress: params.progress,
          });
          this.clearSessionRetryState();
        } else this.refreshSessionDirtyFlag();
      }
      if (!shouldSyncMemory) this.dirty = false;
      const nextMeta = {
        model: this.provider?.model ?? "fts-only",
        provider: this.provider?.id ?? "none",
        providerKey: this.providerKey,
        sources: resolveConfiguredSourcesForMeta(this.sources),
        scopeHash: resolveConfiguredScopeHash({
          workspaceDir: this.workspaceDir,
          extraPaths: this.settings.extraPaths,
          multimodal: {
            enabled: this.settings.multimodal.enabled,
            modalities: this.settings.multimodal.modalities,
            maxFileBytes: this.settings.multimodal.maxFileBytes,
          },
        }),
        chunkTokens: this.settings.chunking.tokens,
        chunkOverlap: this.settings.chunking.overlap,
        ftsTokenizer: this.settings.store.fts.tokenizer,
      };
      if (this.vector.available && this.vector.dims) nextMeta.vectorDims = this.vector.dims;
      this.writeMeta(nextMeta);
      this.pruneEmbeddingCacheIfNeeded?.();
      const nextFtsState = {
        available: this.fts.available,
        loadError: this.fts.loadError,
      };
      closeMemoryDatabase(tempDb);
      tempDbClosed = true;
      await publishMemoryDatabaseTables({
        targetDb: originalDb,
        sourcePath: tempDbPath,
        metaKey: META_KEY,
        expectedRevision: originalRevision,
        vectorExtensionPath: this.vector.extensionPath,
      });
      this.db = originalDb;
      this.resetVectorState();
      this.fts.available = nextFtsState.available;
      this.fts.loadError = nextFtsState.loadError;
      this.vector.dims = nextMeta.vectorDims;
    } catch (err) {
      if (tempDb && !tempDbClosed)
        try {
          closeMemoryDatabase(tempDb);
          tempDbClosed = true;
        } catch {}
      restoreOriginalState();
      this.restoreReindexRetryState(originalRetryState);
      this.markFailedFullReindexRetry({
        memory: shouldRetryMemoryOnFailure,
        sessions: shouldRetrySessionsOnFailure,
      });
      throw err;
    } finally {
      if (tempDb && !tempDbClosed)
        try {
          closeMemoryDatabase(tempDb);
        } catch {}
      try {
        removeMemoryDatabaseFiles(tempDbPath);
      } catch (err) {
        log$3.warn(`failed to remove memory reindex shadow database: ${formatErrorMessage(err)}`);
      }
      try {
        reindexLock?.release();
      } catch (err) {
        log$3.warn(
          `failed to release memory reindex lock for ${dbPath}: ${formatErrorMessage(err)}`,
        );
      }
    }
  }
  readMeta() {
    const row = this.db.prepare(`SELECT value FROM memory_index_meta WHERE key = ?`).get(META_KEY);
    if (!row?.value) {
      this.lastMetaSerialized = null;
      return null;
    }
    try {
      const parsed = JSON.parse(row.value);
      this.lastMetaSerialized = row.value;
      return parsed;
    } catch {
      this.lastMetaSerialized = null;
      return null;
    }
  }
  writeMeta(meta) {
    const value = JSON.stringify(meta);
    if (this.lastMetaSerialized === value) return;
    this.db
      .prepare(
        `INSERT INTO memory_index_meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value`,
      )
      .run(META_KEY, value);
    this.lastMetaSerialized = value;
  }
};
//#endregion
//#region extensions/memory-core/src/memory/manager-vector-warning.ts
function formatMemoryVectorDegradedWriteReason(loadError) {
  return loadError
    ? `sqlite-vec unavailable: ${loadError}`
    : "semantic vector embeddings unavailable — no vector dimensions resolved";
}
function logMemoryVectorDegradedWrite(params) {
  if (!params.vectorEnabled || params.vectorReady || params.chunkCount <= 0 || params.warningShown)
    return params.warningShown;
  params.warn(
    `memory_index_chunks_vec not updated — ${formatMemoryVectorDegradedWriteReason(params.loadError)}. Vector recall degraded. Further duplicate warnings suppressed.`,
  );
  return true;
}
//#endregion
//#region extensions/memory-core/src/memory/vector-blob.ts
const vectorToBlob = (embedding) => Buffer.from(new Float32Array(embedding).buffer);
//#endregion
//#region extensions/memory-core/src/memory/manager-vector-write.ts
function replaceMemoryVectorRow(params) {
  const tableName = params.tableName ?? "memory_index_chunks_vec";
  try {
    params.db.prepare(`DELETE FROM ${tableName} WHERE id = ?`).run(params.id);
  } catch {}
  params.db
    .prepare(`INSERT INTO ${tableName} (id, embedding) VALUES (?, ?)`)
    .run(params.id, vectorToBlob(params.embedding));
}
//#endregion
//#region extensions/memory-core/src/memory/manager-embedding-ops.ts
const VECTOR_TABLE$1 = MEMORY_INDEX_VECTOR_TABLE;
const FTS_TABLE$1 = MEMORY_INDEX_FTS_TABLE;
const EMBEDDING_CACHE_TABLE$1 = MEMORY_EMBEDDING_CACHE_TABLE;
const EMBEDDING_BATCH_MAX_TOKENS = 8e3;
const EMBEDDING_INDEX_CONCURRENCY = 4;
const EMBEDDING_RETRY_MAX_ATTEMPTS = 3;
const EMBEDDING_RETRY_BASE_DELAY_MS = 500;
const EMBEDDING_RETRY_MAX_DELAY_MS = 8e3;
const EMBEDDING_QUERY_TIMEOUT_REMOTE_MS = 6e4;
const EMBEDDING_QUERY_TIMEOUT_LOCAL_MS = 5 * 6e4;
const EMBEDDING_BATCH_TIMEOUT_REMOTE_MS = 2 * 6e4;
const EMBEDDING_BATCH_TIMEOUT_LOCAL_MS = 10 * 6e4;
const SOURCE_WIDE_BATCH_MAX_FILES = 2048;
const SOURCE_WIDE_BATCH_MAX_REQUESTS = 5e4;
const log$2 = createSubsystemLogger("memory");
function resolveEmbeddingSecondsTimeoutMs(seconds) {
  if (!Number.isFinite(seconds)) return MAX_TIMER_TIMEOUT_MS;
  const timeoutMs = Math.floor(seconds * 1e3);
  return resolveTimerTimeoutMs(
    Number.isFinite(timeoutMs) ? timeoutMs : MAX_TIMER_TIMEOUT_MS,
    MAX_TIMER_TIMEOUT_MS,
  );
}
function countBatchSources(items) {
  const counts = {};
  for (const item of items) counts[item.source] = (counts[item.source] ?? 0) + 1;
  return counts;
}
function formatBatchSourceLabel(counts) {
  const sources = Object.keys(counts).toSorted();
  return sources.length > 0 ? sources.join("+") : "unknown";
}
function formatBatchSourceCounts(counts) {
  return (
    Object.entries(counts)
      .toSorted(([left], [right]) => left.localeCompare(right))
      .map(([source, count]) => `${source}=${count}`)
      .join(",") || "none"
  );
}
function splitSourceWideEmbeddingChunks(chunks, maxRequests) {
  const limit = Math.max(1, Math.floor(maxRequests));
  const batches = [];
  for (let start = 0; start < chunks.length; start += limit)
    batches.push(chunks.slice(start, start + limit));
  return batches;
}
function resolveEmbeddingTimeoutMs(params) {
  if (params.kind === "query") {
    const runtimeTimeoutMs = params.providerRuntime?.inlineQueryTimeoutMs;
    if (typeof runtimeTimeoutMs === "number" && runtimeTimeoutMs > 0)
      return resolveTimerTimeoutMs(runtimeTimeoutMs, EMBEDDING_QUERY_TIMEOUT_REMOTE_MS);
    return params.providerId === "local"
      ? EMBEDDING_QUERY_TIMEOUT_LOCAL_MS
      : EMBEDDING_QUERY_TIMEOUT_REMOTE_MS;
  }
  const configuredTimeoutSeconds = params.configuredBatchTimeoutSeconds;
  if (typeof configuredTimeoutSeconds === "number" && configuredTimeoutSeconds > 0)
    return resolveEmbeddingSecondsTimeoutMs(configuredTimeoutSeconds);
  const runtimeTimeoutMs = params.providerRuntime?.inlineBatchTimeoutMs;
  if (typeof runtimeTimeoutMs === "number" && runtimeTimeoutMs > 0)
    return resolveTimerTimeoutMs(runtimeTimeoutMs, EMBEDDING_BATCH_TIMEOUT_REMOTE_MS);
  return params.providerId === "local"
    ? EMBEDDING_BATCH_TIMEOUT_LOCAL_MS
    : EMBEDDING_BATCH_TIMEOUT_REMOTE_MS;
}
function resolveMemoryIndexConcurrency(params) {
  if (params.batch.enabled) return params.batch.concurrency;
  const configured = params.configuredNonBatchConcurrency;
  if (typeof configured === "number" && Number.isFinite(configured))
    return Math.max(1, Math.floor(configured));
  return params.providerId === "ollama" ? 1 : EMBEDDING_INDEX_CONCURRENCY;
}
async function runEmbeddingOperationWithTimeout(params) {
  const controller = new AbortController();
  const signal = params.signal
    ? AbortSignal.any([params.signal, controller.signal])
    : controller.signal;
  if (!Number.isFinite(params.timeoutMs) || params.timeoutMs <= 0) return await params.run(signal);
  const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 1);
  let timer = null;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const error = new Error(params.message);
      reject(error);
      controller.abort(error);
    }, timeoutMs);
  });
  try {
    const operation = params.run(signal);
    return await Promise.race([operation, timeoutPromise]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
var MemoryManagerEmbeddingOps = class extends MemoryManagerSyncOps {
  pruneEmbeddingCacheIfNeeded() {
    if (!this.cache.enabled) return;
    const max = this.cache.maxEntries;
    if (!max || max <= 0) return;
    const count =
      this.db.prepare(`SELECT COUNT(*) as c FROM ${EMBEDDING_CACHE_TABLE$1}`).get()?.c ?? 0;
    if (count <= max) return;
    const excess = count - max;
    this.db
      .prepare(
        `DELETE FROM ${EMBEDDING_CACHE_TABLE$1}\n WHERE rowid IN (\n   SELECT rowid FROM ${EMBEDDING_CACHE_TABLE$1}\n   ORDER BY updated_at ASC\n   LIMIT ?\n )`,
      )
      .run(excess);
  }
  upsertEmbeddingCacheEntries(entries, provider = this.provider) {
    upsertMemoryEmbeddingCache({
      db: this.db,
      enabled: this.cache.enabled,
      provider,
      providerKey: this.providerKey,
      entries,
      tableName: EMBEDDING_CACHE_TABLE$1,
    });
  }
  async embedChunksInBatches(chunks) {
    if (chunks.length === 0) return [];
    const { embeddings, missing } = this.collectCachedEmbeddings(chunks);
    if (missing.length === 0) return embeddings;
    const batches = buildMemoryEmbeddingBatches(
      missing.map((m) => m.chunk),
      EMBEDDING_BATCH_MAX_TOKENS,
    );
    const provider = this.provider;
    if (!provider) throw new Error("Cannot embed batch in FTS-only mode (no embedding provider)");
    let cursor = 0;
    for (const batch of batches) {
      const inputs = buildTextEmbeddingInputs(batch);
      const hasStructuredInputs = inputs.some((input) => hasNonTextEmbeddingParts(input));
      if (hasStructuredInputs && !provider.embedBatchInputs)
        throw createMemoryEmbeddingOperationError({
          operation: "structured-batch",
          providerId: provider.id,
          cause: /* @__PURE__ */ new Error(
            `Embedding provider "${provider.id}" does not support multimodal memory inputs.`,
          ),
        });
      const batchEmbeddings = hasStructuredInputs
        ? await this.embedBatchInputsWithRetry(inputs)
        : await this.embedBatchWithRetry(batch.map((chunk) => chunk.text));
      const batchCacheEntries = [];
      for (let i = 0; i < batch.length; i += 1) {
        const item = missing[cursor + i];
        const embedding = batchEmbeddings[i] ?? [];
        if (item) {
          embeddings[item.index] = embedding;
          batchCacheEntries.push({
            hash: item.chunk.hash,
            embedding,
          });
        }
      }
      this.upsertEmbeddingCacheEntries(batchCacheEntries);
      cursor += batch.length;
    }
    return embeddings;
  }
  computeProviderKey() {
    return expectDefined(
      this.resolveProviderIndexIdentities().at(0),
      "primary memory provider identity",
    ).providerKey;
  }
  resolveProviderIndexIdentities() {
    return resolveMemoryIndexProviderIdentities({
      provider: this.provider,
      cacheKeyData: this.providerRuntime?.cacheKeyData,
      aliases: this.providerRuntime?.indexIdentityAliases,
    });
  }
  buildBatchDebug(source, chunks, context = {}) {
    return (message, data) =>
      log$2.debug(
        message,
        data
          ? {
              ...data,
              source,
              chunks: chunks.length,
              ...context,
            }
          : {
              source,
              chunks: chunks.length,
              ...context,
            },
      );
  }
  async embedChunksWithBatch(chunks, _entry, source, debugContext = {}) {
    const provider = this.provider;
    const batchEmbed = this.providerRuntime?.batchEmbed;
    if (!provider || !batchEmbed) return this.embedChunksInBatches(chunks);
    if (chunks.length === 0) return [];
    const { embeddings, missing } = this.collectCachedEmbeddings(chunks);
    if (missing.length === 0) return embeddings;
    const missingChunks = missing.map((item) => item.chunk);
    const batchResult = await this.runBatchWithFallback({
      provider: provider.id,
      run: async () =>
        await batchEmbed({
          agentId: this.agentId,
          chunks: missingChunks,
          wait: this.batch.wait,
          concurrency: this.batch.concurrency,
          pollIntervalMs: this.batch.pollIntervalMs,
          timeoutMs: this.batch.timeoutMs,
          debug: this.buildBatchDebug(source, chunks, debugContext),
        }),
      fallback: async () => await this.embedChunksInBatches(missingChunks),
    });
    if (!batchResult) return this.embedChunksInBatches(chunks);
    const toCache = [];
    for (let index = 0; index < missing.length; index += 1) {
      const item = missing[index];
      const embedding = batchResult[index] ?? [];
      if (!item) continue;
      embeddings[item.index] = embedding;
      toCache.push({
        hash: item.chunk.hash,
        embedding,
      });
    }
    this.upsertEmbeddingCacheEntries(toCache, provider);
    return embeddings;
  }
  collectCachedEmbeddings(chunks) {
    return collectMemoryCachedEmbeddings({
      chunks,
      cached: loadMemoryEmbeddingCache({
        db: this.db,
        enabled: this.cache.enabled,
        providerIdentities: this.provider ? this.resolveProviderIndexIdentities() : [],
        hashes: chunks.map((chunk) => chunk.hash),
        tableName: EMBEDDING_CACHE_TABLE$1,
      }),
    });
  }
  async embedBatchWithRetry(texts) {
    if (texts.length === 0) return [];
    const provider = this.provider;
    if (!provider) throw new Error("Cannot embed batch in FTS-only mode (no embedding provider)");
    try {
      return await runMemoryEmbeddingBatchRetryWithSplit({
        items: texts,
        run: async (batchTexts) => {
          const timeoutMs = this.resolveEmbeddingTimeout("batch");
          log$2.debug("memory embeddings: batch start", {
            provider: provider.id,
            items: batchTexts.length,
            timeoutMs,
          });
          const result = await runEmbeddingOperationWithTimeout({
            timeoutMs,
            message: `memory embeddings batch timed out after ${Math.round(timeoutMs / 1e3)}s`,
            run: async (signal) => await provider.embedBatch(batchTexts, { signal }),
          });
          log$2.debug("memory embeddings: batch completed", {
            provider: provider.id,
            items: batchTexts.length,
          });
          return result;
        },
        isRetryable: isRetryableMemoryEmbeddingError,
        isSplittable: isSplittableMemoryEmbeddingTransportError,
        waitForRetry: async (delayMs) => {
          await this.waitForEmbeddingRetry(delayMs, "retrying");
        },
        maxAttempts: EMBEDDING_RETRY_MAX_ATTEMPTS,
        baseDelayMs: EMBEDDING_RETRY_BASE_DELAY_MS,
        onSplit: ({ itemCount, splitAt }) => {
          log$2.warn(
            `memory embeddings transport failed after retries; splitting batch of ${itemCount} into ${splitAt} + ${itemCount - splitAt}`,
          );
        },
      });
    } catch (err) {
      log$2.debug("memory embeddings: batch failed", {
        provider: provider.id,
        error: formatErrorMessage(err),
      });
      this.markLocalEmbeddingProviderDegraded(err);
      throw createMemoryEmbeddingOperationError({
        operation: "batch",
        providerId: provider.id,
        cause: err,
      });
    }
  }
  async embedBatchInputsWithRetry(inputs) {
    if (inputs.length === 0) return [];
    const provider = this.provider;
    const embedBatchInputs = provider?.embedBatchInputs;
    if (!embedBatchInputs) return await this.embedBatchWithRetry(inputs.map((input) => input.text));
    try {
      return await runMemoryEmbeddingBatchRetryWithSplit({
        items: inputs,
        run: async (batchInputs) => {
          const timeoutMs = this.resolveEmbeddingTimeout("batch");
          log$2.debug("memory embeddings: structured batch start", {
            provider: provider.id,
            items: batchInputs.length,
            timeoutMs,
          });
          return await runEmbeddingOperationWithTimeout({
            timeoutMs,
            message: `memory embeddings batch timed out after ${Math.round(timeoutMs / 1e3)}s`,
            run: async (signal) => await embedBatchInputs(batchInputs, { signal }),
          });
        },
        isRetryable: isRetryableMemoryEmbeddingError,
        isSplittable: isSplittableMemoryEmbeddingTransportError,
        waitForRetry: async (delayMs) => {
          await this.waitForEmbeddingRetry(delayMs, "retrying structured batch");
        },
        maxAttempts: EMBEDDING_RETRY_MAX_ATTEMPTS,
        baseDelayMs: EMBEDDING_RETRY_BASE_DELAY_MS,
        onSplit: ({ itemCount, splitAt }) => {
          log$2.warn(
            `memory embeddings transport failed after retries; splitting structured batch of ${itemCount} into ${splitAt} + ${itemCount - splitAt}`,
          );
        },
      });
    } catch (err) {
      this.markLocalEmbeddingProviderDegraded(err);
      throw createMemoryEmbeddingOperationError({
        operation: "structured-batch",
        providerId: provider.id,
        cause: err,
      });
    }
  }
  async waitForEmbeddingRetry(delayMs, action) {
    const waitMs = resolveMemoryEmbeddingRetryDelay(
      delayMs,
      Math.random(),
      EMBEDDING_RETRY_MAX_DELAY_MS,
    );
    log$2.warn(`memory embeddings retryable error; ${action} in ${waitMs}ms`);
    await new Promise((resolve) => {
      setTimeout(resolve, waitMs);
    });
  }
  resolveEmbeddingTimeout(kind) {
    return resolveEmbeddingTimeoutMs({
      kind,
      providerId: this.provider?.id,
      providerRuntime: this.providerRuntime,
      configuredBatchTimeoutSeconds: this.settings.sync.embeddingBatchTimeoutSeconds,
    });
  }
  async embedQueryWithRetry(text, signal) {
    const provider = this.provider;
    if (!provider) throw new Error("Cannot embed query in FTS-only mode (no embedding provider)");
    try {
      return await runMemoryEmbeddingRetryLoop({
        run: async () => {
          signal?.throwIfAborted();
          const timeoutMs = this.resolveEmbeddingTimeout("query");
          log$2.debug("memory embeddings: query start", {
            provider: provider.id,
            timeoutMs,
          });
          return await runEmbeddingOperationWithTimeout({
            timeoutMs,
            message: `memory embeddings query timed out after ${Math.round(timeoutMs / 1e3)}s`,
            signal,
            run: async (opSignal) => await provider.embedQuery(text, { signal: opSignal }),
          });
        },
        signal,
        isRetryable: isRetryableMemoryEmbeddingError,
        waitForRetry: async (delayMs) => {
          await this.waitForEmbeddingRetry(delayMs, "retrying query");
        },
        maxAttempts: EMBEDDING_RETRY_MAX_ATTEMPTS,
        baseDelayMs: EMBEDDING_RETRY_BASE_DELAY_MS,
      });
    } catch (err) {
      this.markLocalEmbeddingProviderDegraded(err);
      throw createMemoryEmbeddingOperationError({
        operation: "query",
        providerId: provider.id,
        cause: err,
      });
    }
  }
  async withTimeout(promise, timeoutMs, message) {
    if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) return await promise;
    const resolvedTimeoutMs = resolveTimerTimeoutMs(timeoutMs, 1);
    let timer = null;
    const timeoutPromise = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(message)), resolvedTimeoutMs);
    });
    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
  async withBatchFailureLock(fn) {
    let release;
    const wait = this.batchFailureLock;
    this.batchFailureLock = new Promise((resolve) => {
      release = resolve;
    });
    await wait;
    try {
      return await fn();
    } finally {
      release();
    }
  }
  async resetBatchFailureCount() {
    await this.withBatchFailureLock(async () => {
      if (this.batchFailureCount > 0)
        log$2.debug("memory embeddings: batch recovered; resetting failure count");
      const nextState = resetMemoryBatchFailureState({
        enabled: this.batch.enabled,
        count: this.batchFailureCount,
        lastError: this.batchFailureLastError,
        lastProvider: this.batchFailureLastProvider,
      });
      this.batch.enabled = nextState.enabled;
      this.batchFailureCount = nextState.count;
      this.batchFailureLastError = nextState.lastError;
      this.batchFailureLastProvider = nextState.lastProvider;
    });
  }
  async recordBatchFailure(params) {
    return await this.withBatchFailureLock(async () => {
      if (!this.batch.enabled)
        return {
          disabled: true,
          count: this.batchFailureCount,
        };
      const nextState = recordMemoryBatchFailure(
        {
          enabled: this.batch.enabled,
          count: this.batchFailureCount,
          lastError: this.batchFailureLastError,
          lastProvider: this.batchFailureLastProvider,
        },
        params,
      );
      this.batch.enabled = nextState.enabled;
      this.batchFailureCount = nextState.count;
      this.batchFailureLastError = nextState.lastError;
      this.batchFailureLastProvider = nextState.lastProvider;
      return {
        disabled: !nextState.enabled,
        count: nextState.count,
      };
    });
  }
  async runBatchWithTimeoutRetry(params) {
    try {
      return {
        kind: "success",
        value: await params.run(),
      };
    } catch (error) {
      if (!/timed out|timeout/i.test(formatErrorMessage(error)))
        return {
          kind: "failure",
          error,
          attempts: 1,
        };
    }
    log$2.warn(`memory embeddings: ${params.provider} batch timed out; retrying once`);
    try {
      return {
        kind: "success",
        value: await params.run(),
      };
    } catch (error) {
      return {
        kind: "failure",
        error,
        attempts: 2,
      };
    }
  }
  async runBatchWithFallback(params) {
    if (!this.batch.enabled) return await params.fallback();
    const result = await this.runBatchWithTimeoutRetry({
      provider: params.provider,
      run: params.run,
    });
    if (result.kind === "success") {
      await this.resetBatchFailureCount();
      return result.value;
    }
    const message = formatErrorMessage(result.error);
    const forceDisable = isEmbeddingBatchUnavailableError(result.error);
    const failure = await this.recordBatchFailure({
      provider: params.provider,
      message,
      attempts: result.attempts,
      forceDisable,
    });
    const suffix = failure.disabled ? "disabling batch" : "keeping batch enabled";
    log$2.warn(
      `memory embeddings: ${params.provider} batch failed (${failure.count}/2); ${suffix}; falling back to non-batch embeddings: ${message}`,
    );
    return await params.fallback();
  }
  getIndexConcurrency() {
    return resolveMemoryIndexConcurrency({
      batch: this.batch,
      configuredNonBatchConcurrency: this.settings.remote?.nonBatchConcurrency,
      providerId: this.provider?.id,
    });
  }
  clearIndexedFileData(pathname, source) {
    if (this.vector.enabled)
      try {
        this.db
          .prepare(
            `DELETE FROM ${VECTOR_TABLE$1} WHERE id IN (SELECT id FROM memory_index_chunks WHERE path = ? AND source = ?)`,
          )
          .run(pathname, source);
      } catch {}
    if (this.fts.enabled && this.fts.available)
      try {
        deleteMemoryFtsRows({
          db: this.db,
          tableName: FTS_TABLE$1,
          path: pathname,
          source,
          currentModel: this.provider?.model,
        });
      } catch {}
    this.db
      .prepare(`DELETE FROM memory_index_chunks WHERE path = ? AND source = ?`)
      .run(pathname, source);
  }
  upsertFileRecord(entry, source) {
    this.db
      .prepare(`INSERT INTO memory_index_sources (path, source, hash, mtime, size) VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(path, source) DO UPDATE SET
           hash=excluded.hash,
           mtime=excluded.mtime,
           size=excluded.size`)
      .run(entry.path, source, entry.hash, entry.mtimeMs, entry.size);
  }
  deleteFileRecord(pathname, source) {
    this.db
      .prepare(`DELETE FROM memory_index_sources WHERE path = ? AND source = ?`)
      .run(pathname, source);
  }
  /**
   * Write chunks (and optional embeddings) for a file into the index.
   * Handles both the chunks table, the vector table, and the FTS table.
   * Pass an empty embeddings array to skip vector writes (FTS-only mode).
   */
  writeChunks(entry, source, model, chunks, embeddings, vectorReady) {
    const now = Date.now();
    runSqliteImmediateTransactionSync(this.db, () => {
      this.clearIndexedFileData(entry.path, source);
      for (const [i, chunk] of chunks.entries()) {
        const embedding = embeddings[i] ?? [];
        const id = hashText(
          `${source}:${entry.path}:${chunk.startLine}:${chunk.endLine}:${chunk.hash}:${model}`,
        );
        this.db
          .prepare(`INSERT INTO memory_index_chunks (id, path, source, start_line, end_line, hash, model, text, embedding, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(id) DO UPDATE SET
               hash=excluded.hash,
               model=excluded.model,
               text=excluded.text,
               embedding=excluded.embedding,
               updated_at=excluded.updated_at`)
          .run(
            id,
            entry.path,
            source,
            chunk.startLine,
            chunk.endLine,
            chunk.hash,
            model,
            chunk.text,
            JSON.stringify(embedding),
            now,
          );
        if (vectorReady && embedding.length > 0)
          replaceMemoryVectorRow({
            db: this.db,
            tableName: VECTOR_TABLE$1,
            id,
            embedding,
          });
        if (this.fts.enabled && this.fts.available)
          this.db
            .prepare(
              `INSERT INTO ${FTS_TABLE$1} (text, id, path, source, model, start_line, end_line)\n VALUES (?, ?, ?, ?, ?, ?, ?)`,
            )
            .run(chunk.text, id, entry.path, source, model, chunk.startLine, chunk.endLine);
      }
      this.upsertFileRecord(entry, source);
    });
    this.vectorDegradedWriteWarningShown = logMemoryVectorDegradedWrite({
      vectorEnabled: this.vector.enabled,
      vectorReady,
      chunkCount: chunks.length,
      warningShown: this.vectorDegradedWriteWarningShown,
      loadError: this.vector.loadError,
      warn: (message) => log$2.warn(message),
    });
  }
  async prepareIndexEntry(entry, options) {
    if ("kind" in entry && entry.kind === "multimodal") {
      const multimodalChunk = await buildMultimodalChunkForIndexing(entry);
      if (!multimodalChunk) {
        this.clearIndexedFileData(entry.path, options.source);
        this.deleteFileRecord(entry.path, options.source);
        return null;
      }
      return {
        entry,
        source: options.source,
        chunks: [multimodalChunk.chunk],
        structuredInputBytes: multimodalChunk.structuredInputBytes,
      };
    }
    const baseChunks = filterNonEmptyMemoryChunks(
      chunkMarkdown(
        options.content ??
          entry.content ??
          (await retryTransientMemoryRead(
            () => fs$1.readFile(entry.absPath, "utf-8"),
            `read memory markdown for indexing ${entry.absPath}`,
          )),
        this.settings.chunking,
      ),
    );
    const chunks = this.provider
      ? enforceEmbeddingMaxInputTokens(this.provider, baseChunks, EMBEDDING_BATCH_MAX_TOKENS)
      : baseChunks;
    if (options.source === "sessions" && "lineMap" in entry) remapChunkLines(chunks, entry.lineMap);
    return {
      entry,
      source: options.source,
      chunks,
    };
  }
  async indexFiles(items) {
    if (items.length === 0) return;
    const provider = this.provider;
    const batchEmbed = this.providerRuntime?.batchEmbed;
    if (
      !provider ||
      !this.batch.enabled ||
      !batchEmbed ||
      this.providerRuntime?.sourceWideBatchEmbed !== true
    ) {
      await runMemoryHostTasksWithConcurrency(
        items.map((item) => async () => await this.indexFile(item.entry, { source: item.source })),
        this.getIndexConcurrency(),
      );
      return;
    }
    const itemSourceCounts = countBatchSources(items);
    log$2.debug(
      `memory embeddings: source-wide batch prepare files=${items.length} sources=${formatBatchSourceCounts(itemSourceCounts)} maxFiles=${SOURCE_WIDE_BATCH_MAX_FILES} maxRequests=${SOURCE_WIDE_BATCH_MAX_REQUESTS}`,
      {
        files: items.length,
        sources: itemSourceCounts,
        maxFiles: SOURCE_WIDE_BATCH_MAX_FILES,
        maxRequests: SOURCE_WIDE_BATCH_MAX_REQUESTS,
      },
    );
    let prepared = [];
    let preparedRequestCount = 0;
    let sourceWideBatchGroup = 0;
    const flushPrepared = async (reason) => {
      const firstEntry = prepared[0]?.entry;
      if (!firstEntry) return;
      const current = prepared;
      const chunks = current.flatMap((item) => item.chunks);
      const sourceCounts = countBatchSources(current);
      const source = formatBatchSourceLabel(sourceCounts);
      sourceWideBatchGroup += 1;
      const chunkBatches = splitSourceWideEmbeddingChunks(chunks, SOURCE_WIDE_BATCH_MAX_REQUESTS);
      log$2.debug(
        `memory embeddings: source-wide batch submit group=${sourceWideBatchGroup} source=${source} files=${current.length} chunks=${chunks.length} requests=${chunkBatches.length} sources=${formatBatchSourceCounts(sourceCounts)} reason=${reason}`,
        {
          source,
          files: current.length,
          chunks: chunks.length,
          requests: chunkBatches.length,
          sources: sourceCounts,
          group: sourceWideBatchGroup,
          reason,
          maxFiles: SOURCE_WIDE_BATCH_MAX_FILES,
          maxRequests: SOURCE_WIDE_BATCH_MAX_REQUESTS,
        },
      );
      const embeddings = [];
      for (let requestIndex = 0; requestIndex < chunkBatches.length; requestIndex += 1) {
        const chunkBatch = chunkBatches[requestIndex] ?? [];
        embeddings.push(
          ...(await this.embedChunksWithBatch(chunkBatch, firstEntry, source, {
            sourceWideFiles: current.length,
            sourceWideSources: sourceCounts,
            sourceWideBatchGroup,
            sourceWideRequestGroup: requestIndex + 1,
            sourceWideRequestGroups: chunkBatches.length,
          })),
        );
      }
      const sample = embeddings.find((embedding) => embedding.length > 0);
      const vectorReady = sample ? await this.ensureVectorReady(sample.length) : false;
      let offset = 0;
      for (const item of current) {
        const fileEmbeddings = embeddings.slice(offset, offset + item.chunks.length);
        offset += item.chunks.length;
        this.writeChunks(
          item.entry,
          item.source,
          provider.model,
          item.chunks,
          fileEmbeddings,
          vectorReady,
        );
      }
      prepared = [];
      preparedRequestCount = 0;
    };
    for (const item of items) {
      if ("kind" in item.entry && item.entry.kind === "multimodal") {
        await this.indexFile(item.entry, { source: item.source });
        continue;
      }
      const preparedEntry = await this.prepareIndexEntry(item.entry, { source: item.source });
      if (!preparedEntry) continue;
      const nextWouldExceedFiles = prepared.length >= SOURCE_WIDE_BATCH_MAX_FILES;
      const nextWouldExceedRequests =
        preparedRequestCount + preparedEntry.chunks.length > SOURCE_WIDE_BATCH_MAX_REQUESTS;
      if (prepared.length > 0 && (nextWouldExceedFiles || nextWouldExceedRequests))
        await flushPrepared(nextWouldExceedFiles ? "max-files" : "max-requests");
      prepared.push(preparedEntry);
      preparedRequestCount += preparedEntry.chunks.length;
      if (
        prepared.length >= SOURCE_WIDE_BATCH_MAX_FILES ||
        preparedRequestCount >= SOURCE_WIDE_BATCH_MAX_REQUESTS
      )
        await flushPrepared(
          prepared.length >= SOURCE_WIDE_BATCH_MAX_FILES ? "max-files" : "max-requests",
        );
    }
    await flushPrepared("end");
  }
  async indexFile(entry, options) {
    if (!this.provider) {
      if ("kind" in entry && entry.kind === "multimodal") return;
      const prepared = await this.prepareIndexEntry(entry, options);
      this.writeChunks(entry, options.source, "fts-only", prepared?.chunks ?? [], [], false);
      return;
    }
    const prepared = await this.prepareIndexEntry(entry, options);
    if (!prepared) return;
    let embeddings;
    try {
      embeddings = this.batch.enabled
        ? await this.embedChunksWithBatch(prepared.chunks, entry, options.source)
        : await this.embedChunksInBatches(prepared.chunks);
    } catch (err) {
      const message = formatErrorMessage(err);
      if (
        "kind" in entry &&
        entry.kind === "multimodal" &&
        /(413|payload too large|request too large|input too large|too many tokens|input limit|request size)/i.test(
          message,
        )
      ) {
        log$2.warn("memory embeddings: skipping multimodal file rejected as too large", {
          path: entry.path,
          bytes: prepared.structuredInputBytes,
          provider: this.provider.id,
          model: this.provider.model,
          error: message,
        });
        this.clearIndexedFileData(entry.path, options.source);
        this.upsertFileRecord(entry, options.source);
        return;
      }
      throw err;
    }
    const sample = embeddings.find((embedding) => embedding.length > 0);
    const vectorReady = sample ? await this.ensureVectorReady(sample.length) : false;
    this.writeChunks(
      entry,
      options.source,
      this.provider.model,
      prepared.chunks,
      embeddings,
      vectorReady,
    );
  }
};
//#endregion
//#region extensions/memory-core/src/memory/manager-local-worker-errors.ts
const LOCAL_EMBEDDING_WORKER_FAILURE_CODES = new Set(
  Object.values({
    exited: "LOCAL_EMBEDDING_WORKER_EXITED",
    processError: "LOCAL_EMBEDDING_WORKER_PROCESS_ERROR",
    ipcError: "LOCAL_EMBEDDING_WORKER_IPC_ERROR",
  }),
);
function isLocalEmbeddingWorkerFailure(err) {
  return err instanceof Error && LOCAL_EMBEDDING_WORKER_FAILURE_CODES.has(String(err.code));
}
//#endregion
//#region extensions/memory-core/src/memory/manager-search-preflight.ts
function resolveMemorySearchPreflight(params) {
  const normalizedQuery = params.query.trim();
  if (!normalizedQuery)
    return {
      normalizedQuery,
      shouldInitializeProvider: false,
      shouldSearch: false,
    };
  if (!params.hasIndexedContent)
    return {
      normalizedQuery,
      shouldInitializeProvider: false,
      shouldSearch: false,
    };
  return {
    normalizedQuery,
    shouldInitializeProvider: true,
    shouldSearch: true,
  };
}
//#endregion
//#region extensions/memory-core/src/memory/manager-search.ts
const FTS_QUERY_TOKEN_RE = /[\p{L}\p{N}_]+/gu;
const SHORT_CJK_TRIGRAM_RE = /[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af\u3131-\u3163]/u;
const EXACT_PATH_SPECIFICITY_SQL_FUNCTION = "openclaw_memory_exact_path_specificity";
const NORMALIZED_PATH_CONTAINS_SQL_FUNCTION = "openclaw_memory_normalized_path_contains";
const VECTOR_KNN_OVERSAMPLE_FACTOR = 8;
const MAX_VECTOR_KNN_K = 4096;
const FALLBACK_VECTOR_BATCH_SIZE = 256;
function yieldToEventLoop() {
  return new Promise((resolve) => {
    setImmediate(resolve);
  });
}
function comparePathKeywordSearchResults(left, right) {
  const specificityDelta = right.exactPathSpecificity - left.exactPathSpecificity;
  if (specificityDelta !== 0) return specificityDelta;
  if (left.exactPathSpecificity === 0) {
    const pathDelta = right.pathScore - left.pathScore;
    if (pathDelta !== 0) return pathDelta;
  }
  return (
    left.path.localeCompare(right.path) ||
    left.startLine - right.startLine ||
    left.id.localeCompare(right.id)
  );
}
function normalizeSearchTokens(raw) {
  return normalizeStringEntriesLower(raw.match(FTS_QUERY_TOKEN_RE) ?? []);
}
function scoreFallbackKeywordResult(params) {
  const queryTokens = uniqueStrings(normalizeSearchTokens(params.query));
  if (queryTokens.length === 0) return params.ftsScore;
  const textTokens = normalizeSearchTokens(params.text);
  const textTokenSet = new Set(textTokens);
  const pathLower = params.path.toLowerCase();
  const overlap = queryTokens.filter((token) => textTokenSet.has(token)).length;
  const uniqueQueryOverlap = overlap / Math.max(new Set(queryTokens).size, 1);
  const density = overlap / Math.max(textTokenSet.size, 1);
  const pathBoost = queryTokens.reduce(
    (score, token) => score + (pathLower.includes(token) ? 0.18 : 0),
    0,
  );
  const textLengthBoost = Math.min(params.text.length / 160, 0.18);
  const lexicalBoost = uniqueQueryOverlap * 0.45 + density * 0.2 + pathBoost + textLengthBoost;
  return Math.min(1, params.ftsScore + lexicalBoost);
}
function escapeLikePattern(term) {
  return term.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");
}
function isAscii(value) {
  for (const codePoint of value) if ((codePoint.codePointAt(0) ?? 0) > 127) return false;
  return true;
}
function resolveUnicodeCandidateAnchors(value) {
  const firstNonAsciiCodePoint = Array.from(value).find((codePoint) => !isAscii(codePoint));
  if (!firstNonAsciiCodePoint) return [];
  return [
    .../* @__PURE__ */ new Set([
      firstNonAsciiCodePoint,
      firstNonAsciiCodePoint.toLowerCase(),
      firstNonAsciiCodePoint.toUpperCase(),
    ]),
  ];
}
function normalizePathIdentifier(value) {
  return value.trim().replaceAll("\\", "/").replace(/^\.\//, "").normalize("NFC").toLowerCase();
}
function resolveExactPathSpecificity(query, candidatePath) {
  const normalizedQuery = normalizePathIdentifier(query);
  const normalizedPath = normalizePathIdentifier(candidatePath);
  if (!normalizedQuery || normalizedQuery === ".") return 0;
  if (normalizedQuery === normalizedPath) return 3;
  if (normalizedQuery.includes("/")) return 0;
  const basename = normalizedPath.split("/").at(-1) ?? normalizedPath;
  if (normalizedQuery === basename) return 2;
  const extensionIndex = basename.lastIndexOf(".");
  return normalizedQuery === (extensionIndex > 0 ? basename.slice(0, extensionIndex) : basename)
    ? 1
    : 0;
}
function registerPathSearchSqlFunctions(db) {
  db.function(
    EXACT_PATH_SPECIFICITY_SQL_FUNCTION,
    { deterministic: true },
    (candidatePath, query) =>
      typeof candidatePath === "string" && typeof query === "string"
        ? resolveExactPathSpecificity(query, candidatePath)
        : 0,
  );
  db.function(
    NORMALIZED_PATH_CONTAINS_SQL_FUNCTION,
    { deterministic: true },
    (candidatePath, query) =>
      typeof candidatePath === "string" && typeof query === "string"
        ? Number(
            candidatePath
              .normalize("NFC")
              .toLowerCase()
              .includes(query.normalize("NFC").toLowerCase()),
          )
        : 0,
  );
}
function buildPathSubstringFilter(params) {
  const candidateClauses = [];
  const candidateParams = [];
  const normalizedClauses = [];
  const normalizedParams = [];
  for (const term of params.terms) {
    if (isAscii(term)) {
      candidateClauses.push(`${params.candidatePathColumn} LIKE ? ESCAPE '\\'`);
      candidateParams.push(`%${escapeLikePattern(term)}%`);
      continue;
    }
    const anchors = resolveUnicodeCandidateAnchors(term);
    if (anchors.length === 0) continue;
    candidateClauses.push(
      `(${anchors.map(() => `${params.candidatePathColumn} LIKE ? ESCAPE '\\'`).join(" OR ")})`,
    );
    candidateParams.push(...anchors.map((anchor) => `%${escapeLikePattern(anchor)}%`));
    normalizedClauses.push(
      `${NORMALIZED_PATH_CONTAINS_SQL_FUNCTION}(${params.normalizedPathColumn}, ?) = 1`,
    );
    normalizedParams.push(term);
  }
  return {
    candidateClause: candidateClauses.map((clause) => ` AND ${clause}`).join(""),
    candidateParams,
    normalizedClause: normalizedClauses.map((clause) => ` AND ${clause}`).join(""),
    normalizedParams,
  };
}
function buildExactPathCandidatePatterns(query) {
  const normalized = query.trim().replaceAll("\\", "/").replace(/^\.\//, "");
  if (!normalized || normalized === ".") return [];
  const canonicalForms = [normalized.normalize("NFC"), normalized.normalize("NFD")];
  const forms = new Set(canonicalForms);
  if (!isAscii(normalized))
    for (const form of canonicalForms) {
      forms.add(form.toLowerCase());
      forms.add(form.toUpperCase());
    }
  const patterns = /* @__PURE__ */ new Set();
  for (const form of forms) {
    const escaped = escapeLikePattern(form);
    if (normalized.includes("/")) {
      patterns.add(escaped);
      continue;
    }
    patterns.add(escaped);
    patterns.add(`${escaped}.%`);
    patterns.add(`%/${escaped}`);
    patterns.add(`%/${escaped}.%`);
  }
  if (!isAscii(normalized)) {
    const asciiAnchor = normalized
      .normalize("NFD")
      .toLowerCase()
      .match(/[a-z0-9_]+/g)
      ?.toSorted((left, right) => right.length - left.length)[0];
    if (asciiAnchor) patterns.add(`%${escapeLikePattern(asciiAnchor)}%`);
    if (normalized.toLowerCase() !== normalized.toUpperCase())
      for (const anchor of resolveUnicodeCandidateAnchors(normalized))
        patterns.add(`%${escapeLikePattern(anchor)}%`);
  }
  return [...patterns];
}
function buildMatchQueryFromTerms(terms) {
  if (terms.length === 0) return null;
  return terms.map((term) => `"${term.replaceAll('"', "")}"`).join(" AND ");
}
function readCount(row) {
  if (typeof row?.count === "bigint") return Number(row.count);
  if (typeof row?.count === "number") return row.count;
  return 0;
}
function resolveProviderModels(primary, aliases) {
  return Array.from(/* @__PURE__ */ new Set([primary, ...(aliases ?? []).filter(Boolean)]));
}
function buildModelFilter(column, models) {
  return models.length === 1
    ? `${column} = ?`
    : `${column} IN (${models.map(() => "?").join(", ")})`;
}
function planKeywordSearch(params) {
  if (params.ftsTokenizer !== "trigram")
    return {
      matchQuery: params.buildFtsQuery(params.query),
      substringTerms: [],
    };
  const tokenPattern = params.includeCombiningMarks ? /[\p{L}\p{M}\p{N}_]+/gu : FTS_QUERY_TOKEN_RE;
  const tokens = normalizeStringEntries(params.query.match(tokenPattern) ?? []);
  if (tokens.length === 0)
    return {
      matchQuery: null,
      substringTerms: [],
    };
  const matchTerms = [];
  const substringTerms = [];
  for (const token of tokens) {
    if (
      Array.from(token).length < 3 &&
      (params.includeAllShortTrigramTerms || SHORT_CJK_TRIGRAM_RE.test(token))
    ) {
      substringTerms.push(token);
      continue;
    }
    matchTerms.push(token);
  }
  return {
    matchQuery: buildMatchQueryFromTerms(matchTerms),
    substringTerms,
  };
}
function planPathKeywordSearch(params) {
  const forms =
    params.ftsTokenizer === "trigram"
      ? /* @__PURE__ */ new Set([params.query.normalize("NFC"), params.query.normalize("NFD")])
      : /* @__PURE__ */ new Set([params.query]);
  const seen = /* @__PURE__ */ new Set();
  const plans = [];
  const addPlan = (query, plan) => {
    const key = JSON.stringify([plan.matchQuery, plan.substringTerms]);
    if (!seen.has(key)) {
      seen.add(key);
      plans.push({
        query,
        ...plan,
      });
    }
  };
  for (const query of forms)
    addPlan(
      query,
      planKeywordSearch({
        ...params,
        query,
        includeAllShortTrigramTerms: true,
        includeCombiningMarks: true,
      }),
    );
  if (params.ftsTokenizer !== "trigram")
    for (const query of /* @__PURE__ */ new Set([
      params.query.normalize("NFC"),
      params.query.normalize("NFD"),
    ])) {
      const tokens = normalizeStringEntries(query.match(/[\p{L}\p{M}\p{N}_]+/gu) ?? []);
      const substringTerms = tokens.filter((token) => !isAscii(token));
      if (substringTerms.length > 0)
        addPlan(query, {
          matchQuery: buildMatchQueryFromTerms(tokens.filter(isAscii)),
          substringTerms,
        });
    }
  return plans;
}
async function searchVector(params) {
  if (params.queryVec.length === 0 || params.limit <= 0) return [];
  const providerModels = resolveProviderModels(params.providerModel, params.providerModelAliases);
  const vectorModelFilter = buildModelFilter("c.model", providerModels);
  const searchFallback = () =>
    searchChunksByEmbedding({
      db: params.db,
      providerModel: params.providerModel,
      providerModelAliases: params.providerModelAliases,
      sourceFilter: params.sourceFilterChunks,
      queryVec: params.queryVec,
      limit: params.limit,
      snippetMaxChars: params.snippetMaxChars,
    });
  if (await params.ensureVectorReady(params.queryVec.length)) {
    const qBlob = vectorToBlob(params.queryVec);
    const runVectorQuery = (candidateLimit) =>
      params.db
        .prepare(`SELECT c.id, c.path, c.start_line, c.end_line, c.text,
       c.source,
       vec_distance_cosine(v.embedding, ?) AS dist
  FROM ${params.vectorTable} v\n  JOIN memory_index_chunks c ON c.id = v.id\n WHERE v.embedding MATCH ? AND k = ? AND ${vectorModelFilter}${params.sourceFilterVec.sql}\n ORDER BY dist ASC\n LIMIT ?`)
        .all(
          qBlob,
          qBlob,
          candidateLimit,
          ...providerModels,
          ...params.sourceFilterVec.params,
          params.limit,
        );
    const candidateLimit = Math.min(params.limit * VECTOR_KNN_OVERSAMPLE_FACTOR, MAX_VECTOR_KNN_K);
    let rows = runVectorQuery(candidateLimit);
    if (rows.length < params.limit) {
      const matchingChunkCount = readCount(
        params.db
          .prepare(
            `SELECT COUNT(*) AS count FROM memory_index_chunks c WHERE ${vectorModelFilter}${params.sourceFilterVec.sql}`,
          )
          .get(...providerModels, ...params.sourceFilterVec.params),
      );
      if (matchingChunkCount > rows.length) {
        const vectorCount = readCount(
          params.db.prepare(`SELECT COUNT(*) AS count FROM ${params.vectorTable}`).get(),
        );
        const widenedLimit = Math.min(vectorCount, MAX_VECTOR_KNN_K);
        if (widenedLimit > candidateLimit) rows = runVectorQuery(widenedLimit);
        const requiredMatches = Math.min(params.limit, matchingChunkCount);
        if (vectorCount > MAX_VECTOR_KNN_K && rows.length < requiredMatches)
          return await searchFallback();
      }
    }
    return rows.map((row) => ({
      id: row.id,
      path: row.path,
      startLine: row.start_line,
      endLine: row.end_line,
      score: 1 - row.dist,
      snippet: truncateUtf16Safe(row.text, params.snippetMaxChars),
      source: row.source,
    }));
  }
  return await searchFallback();
}
async function searchChunksByEmbedding(params) {
  if (params.limit <= 0) return [];
  const providerModels = resolveProviderModels(params.providerModel, params.providerModelAliases);
  const modelFilter = buildModelFilter("model", providerModels);
  const stmt = params.db
    .prepare(`SELECT rowid, id, path, start_line, end_line, text, embedding, source
  FROM memory_index_chunks
 WHERE ${modelFilter} AND rowid > ?${params.sourceFilter.sql}\n ORDER BY rowid ASC\n LIMIT ?`);
  const topResults = [];
  let lastRowid = 0;
  while (true) {
    const batch = stmt.all(
      ...providerModels,
      lastRowid,
      ...params.sourceFilter.params,
      FALLBACK_VECTOR_BATCH_SIZE,
    );
    if (batch.length === 0) break;
    for (const row of batch) {
      const score = cosineSimilarity(params.queryVec, parseEmbedding(row.embedding));
      if (Number.isFinite(score)) {
        const result = {
          id: row.id,
          path: row.path,
          startLine: row.start_line,
          endLine: row.end_line,
          score,
          snippet: truncateUtf16Safe(row.text, params.snippetMaxChars),
          source: row.source,
        };
        if (topResults.length < params.limit) {
          topResults.push(result);
          if (topResults.length === params.limit) topResults.sort((a, b) => b.score - a.score);
        } else {
          const lowest = topResults.at(-1);
          if (lowest && result.score > lowest.score) {
            topResults[topResults.length - 1] = result;
            topResults.sort((a, b) => b.score - a.score);
          }
        }
      }
    }
    const nextRowid = batch.at(-1)?.rowid;
    lastRowid = typeof nextRowid === "bigint" ? Number(nextRowid) : (nextRowid ?? lastRowid);
    if (batch.length < FALLBACK_VECTOR_BATCH_SIZE) break;
    await yieldToEventLoop();
  }
  topResults.sort((a, b) => b.score - a.score);
  return topResults;
}
async function searchKeyword(params) {
  if (params.limit <= 0) return [];
  const plan = planKeywordSearch({
    query: params.query,
    ftsTokenizer: params.ftsTokenizer,
    buildFtsQuery: params.buildFtsQuery,
  });
  if (!plan.matchQuery && plan.substringTerms.length === 0) return [];
  const liveChunkClause = ` AND EXISTS (SELECT 1 FROM memory_index_chunks c WHERE c.id = ${params.ftsTable}.id)`;
  const substringClause = plan.substringTerms.map(() => " AND text LIKE ? ESCAPE '\\'").join("");
  const substringParams = plan.substringTerms.map((term) => `%${escapeLikePattern(term)}%`);
  let rows;
  let usedMatch = false;
  if (plan.matchQuery)
    try {
      rows = params.db
        .prepare(
          `SELECT id, path, source, start_line, end_line, text,\n       bm25(${params.ftsTable}) AS rank\n  FROM ${params.ftsTable}\n WHERE ${params.ftsTable} MATCH ?${substringClause}${liveChunkClause}${params.sourceFilter.sql}\n ORDER BY rank ASC\n LIMIT ?`,
        )
        .all(plan.matchQuery, ...substringParams, ...params.sourceFilter.params, params.limit);
      usedMatch = true;
    } catch (matchErr) {
      console.warn(`memory search: FTS5 MATCH failed, falling back to LIKE: ${String(matchErr)}`);
      const allTerms = uniqueStrings([
        ...normalizeStringEntries(params.query.match(FTS_QUERY_TOKEN_RE) ?? []),
        ...plan.substringTerms,
      ]);
      const fallbackLikeClause = allTerms.map(() => " AND text LIKE ? ESCAPE '\\'").join("");
      const fallbackLikeParams = allTerms.map((term) => `%${escapeLikePattern(term)}%`);
      rows = params.db
        .prepare(`SELECT id, path, source, start_line, end_line, text,
       0 AS rank
  FROM ${params.ftsTable}\n WHERE 1=1${fallbackLikeClause}${liveChunkClause}${params.sourceFilter.sql}\n LIMIT ?`)
        .all(...fallbackLikeParams, ...params.sourceFilter.params, params.limit);
    }
  else
    rows = params.db
      .prepare(`SELECT id, path, source, start_line, end_line, text,
       0 AS rank
  FROM ${params.ftsTable}\n WHERE 1=1${substringClause}${liveChunkClause}${params.sourceFilter.sql}\n LIMIT ?`)
      .all(...substringParams, ...params.sourceFilter.params, params.limit);
  return rows.map((row) => {
    const textScore = usedMatch ? params.bm25RankToScore(row.rank) : 1;
    const score = params.boostFallbackRanking
      ? scoreFallbackKeywordResult({
          query: params.query,
          path: row.path,
          text: row.text,
          ftsScore: textScore,
        })
      : textScore;
    return {
      id: row.id,
      path: row.path,
      startLine: row.start_line,
      endLine: row.end_line,
      score,
      textScore,
      snippet: truncateUtf16Safe(row.text, params.snippetMaxChars),
      source: row.source,
    };
  });
}
async function searchPathKeyword(params) {
  if (params.limit <= 0) return [];
  const pathColumn = `${params.pathFtsTable}.path`;
  const pathPlans = planPathKeywordSearch({
    query: params.query,
    ftsTokenizer: params.ftsTokenizer,
    buildFtsQuery: params.buildFtsQuery,
  });
  const plan = pathPlans[0] ?? {
    query: params.query,
    matchQuery: null,
    substringTerms: [],
  };
  const planSubstringFilter = buildPathSubstringFilter({
    terms: plan.substringTerms,
    candidatePathColumn: pathColumn,
    normalizedPathColumn: "path",
  });
  registerPathSearchSqlFunctions(params.db);
  const exactPathQuery = params.exactPathQuery ?? params.query;
  const hasExplicitExactPathHeadroom = params.exactPathLimit !== void 0;
  const exactPathLimit = Math.max(0, Math.floor(params.exactPathLimit ?? params.limit));
  const exactCandidatePatterns = buildExactPathCandidatePatterns(exactPathQuery);
  const loadExactRows = (useLexicalCandidates) => {
    const qualifiedPatternClause = exactCandidatePatterns
      .map(() => `${pathColumn} LIKE ? ESCAPE '\\'`)
      .join(" OR ");
    const candidateCtes = useLexicalCandidates
      ? `candidates AS MATERIALIZED (\n  SELECT ${params.pathFtsTable}.path, ${params.pathFtsTable}.source\n    FROM ${params.pathFtsTable}\n   WHERE ${plan.matchQuery ? `${params.pathFtsTable} MATCH ?` : "1=1"}${planSubstringFilter.candidateClause}${params.sourceFilter.sql}\n), pattern_candidates AS MATERIALIZED (\n  SELECT path, source FROM candidates\n   WHERE (${exactCandidatePatterns.map(() => "path LIKE ? ESCAPE '\\'").join(" OR ")})\n)`
      : `pattern_candidates AS MATERIALIZED (\n  SELECT ${params.pathFtsTable}.path, ${params.pathFtsTable}.source\n    FROM ${params.pathFtsTable}\n   WHERE (${qualifiedPatternClause})${params.sourceFilter.sql}\n)`;
    const candidateParams = useLexicalCandidates
      ? [
          ...(plan.matchQuery ? [plan.matchQuery] : []),
          ...planSubstringFilter.candidateParams,
          ...params.sourceFilter.params,
          ...exactCandidatePatterns,
        ]
      : [...exactCandidatePatterns, ...params.sourceFilter.params];
    return params.db
      .prepare(
        `WITH ${candidateCtes}, scored_paths AS MATERIALIZED (\n  SELECT path, source,\n         ${EXACT_PATH_SPECIFICITY_SQL_FUNCTION}(path, ?) AS exact_path_specificity\n    FROM pattern_candidates\n), exact_paths AS MATERIALIZED (\n  SELECT path, source, exact_path_specificity FROM scored_paths\n   WHERE exact_path_specificity > 0\n)\nSELECT c.id, exact_paths.path, exact_paths.source,\n       c.start_line, c.end_line, c.text, exact_paths.exact_path_specificity\n  FROM exact_paths\n  JOIN memory_index_chunks c ON c.id = (\n    SELECT candidate.id FROM memory_index_chunks candidate\n     WHERE candidate.path = exact_paths.path\n       AND candidate.source = exact_paths.source\n     ORDER BY candidate.start_line, candidate.end_line, candidate.id\n     LIMIT 1\n  )\n ORDER BY exact_paths.exact_path_specificity DESC,\n          exact_paths.path ASC, exact_paths.source ASC\n LIMIT ?`,
      )
      .all(...candidateParams, exactPathQuery, exactPathLimit);
  };
  const useLexicalExactCandidates =
    isAscii(exactPathQuery) && (plan.matchQuery !== null || plan.substringTerms.length > 0);
  let exactRows = [];
  if (exactCandidatePatterns.length > 0 && exactPathLimit > 0)
    try {
      exactRows = loadExactRows(useLexicalExactCandidates);
    } catch (err) {
      if (!useLexicalExactCandidates) throw err;
      exactRows = loadExactRows(false);
    }
  const exactResults = exactRows.map((row) => ({
    id: row.id,
    path: row.path,
    startLine: row.start_line,
    endLine: row.end_line,
    score: 0,
    textScore: 0,
    pathScore: 0,
    exactPathSpecificity: row.exact_path_specificity,
    snippet: truncateUtf16Safe(row.text, params.snippetMaxChars),
    source: row.source,
  }));
  if (!pathPlans.some((entry) => entry.matchQuery || entry.substringTerms.length > 0))
    return exactResults;
  const loadFilteredLexicalRows = (matchQuery, terms, specificity, resultLimit) => {
    const filter = buildPathSubstringFilter({
      terms,
      candidatePathColumn: pathColumn,
      normalizedPathColumn: "path",
    });
    const specificityOperator = specificity === "exact" ? ">" : "=";
    const qualifiedSpecificityClause = ` AND ${EXACT_PATH_SPECIFICITY_SQL_FUNCTION}(${pathColumn}, ?) ${specificityOperator} 0`;
    const normalizedSpecificityClause = ` AND ${EXACT_PATH_SPECIFICITY_SQL_FUNCTION}(path, ?) ${specificityOperator} 0`;
    const queryParams = [
      ...(matchQuery ? [matchQuery] : []),
      ...filter.candidateParams,
      ...params.sourceFilter.params,
    ];
    if (!filter.normalizedClause)
      return params.db
        .prepare(
          `SELECT c.id, ${params.pathFtsTable}.path, ${params.pathFtsTable}.source,\n       c.start_line, c.end_line, c.text,\n       ${matchQuery ? `bm25(${params.pathFtsTable})` : "0"} AS rank\n  FROM ${params.pathFtsTable}\n  JOIN memory_index_chunks c ON c.id = (\n    SELECT candidate.id FROM memory_index_chunks candidate\n     WHERE candidate.path = ${params.pathFtsTable}.path\n       AND candidate.source = ${params.pathFtsTable}.source\n     ORDER BY candidate.start_line, candidate.end_line, candidate.id\n     LIMIT 1\n  )\n WHERE ${matchQuery ? `${params.pathFtsTable} MATCH ?` : "1=1"}${filter.candidateClause}${params.sourceFilter.sql}${qualifiedSpecificityClause}\n ORDER BY rank ASC, ${params.pathFtsTable}.path ASC, ${params.pathFtsTable}.source ASC\n LIMIT ?`,
        )
        .all(...queryParams, exactPathQuery, resultLimit);
    return params.db
      .prepare(
        `WITH path_candidates AS MATERIALIZED (\n  SELECT ${params.pathFtsTable}.path, ${params.pathFtsTable}.source,\n         ${matchQuery ? `bm25(${params.pathFtsTable})` : "0"} AS rank\n    FROM ${params.pathFtsTable}\n   WHERE ${matchQuery ? `${params.pathFtsTable} MATCH ?` : "1=1"}${filter.candidateClause}${params.sourceFilter.sql}\n), normalized_paths AS MATERIALIZED (\n  SELECT path, source, rank FROM path_candidates\n   WHERE 1=1${filter.normalizedClause}${normalizedSpecificityClause}\n)\nSELECT c.id, normalized_paths.path, normalized_paths.source,\n       c.start_line, c.end_line, c.text, normalized_paths.rank\n  FROM normalized_paths\n  JOIN memory_index_chunks c ON c.id = (\n    SELECT candidate.id FROM memory_index_chunks candidate\n     WHERE candidate.path = normalized_paths.path\n       AND candidate.source = normalized_paths.source\n     ORDER BY candidate.start_line, candidate.end_line, candidate.id\n     LIMIT 1\n  )\n ORDER BY normalized_paths.rank ASC, normalized_paths.path ASC, normalized_paths.source ASC\n LIMIT ?`,
      )
      .all(...queryParams, ...filter.normalizedParams, exactPathQuery, resultLimit);
  };
  const loadLexicalRows = (lexicalPlan) => {
    const loadPartitions = (matchQuery, terms) => [
      ...(exactPathLimit > 0
        ? loadFilteredLexicalRows(matchQuery, terms, "exact", exactPathLimit)
        : []),
      ...loadFilteredLexicalRows(matchQuery, terms, "non-exact", params.limit),
    ];
    if (lexicalPlan.matchQuery)
      try {
        return {
          rows: loadPartitions(lexicalPlan.matchQuery, lexicalPlan.substringTerms),
          usedMatch: true,
        };
      } catch (matchErr) {
        console.warn(
          `memory search: path FTS5 MATCH failed, falling back to LIKE: ${String(matchErr)}`,
        );
        return {
          rows: loadPartitions(
            null,
            uniqueStrings([
              ...normalizeStringEntries(lexicalPlan.query.match(/[\p{L}\p{M}\p{N}_]+/gu) ?? []),
              ...lexicalPlan.substringTerms,
            ]),
          ),
          usedMatch: false,
        };
      }
    return {
      rows: loadPartitions(null, lexicalPlan.substringTerms),
      usedMatch: false,
    };
  };
  const lexicalById = /* @__PURE__ */ new Map();
  for (const lexicalPlan of pathPlans) {
    if (!lexicalPlan.matchQuery && lexicalPlan.substringTerms.length === 0) continue;
    const { rows, usedMatch } = loadLexicalRows(lexicalPlan);
    for (const row of rows) {
      const pathScore = usedMatch ? params.bm25RankToScore(row.rank) : 1;
      const exactPathSpecificity = resolveExactPathSpecificity(exactPathQuery, row.path);
      const result = {
        id: row.id,
        path: row.path,
        startLine: row.start_line,
        endLine: row.end_line,
        score: pathScore,
        textScore: 0,
        pathScore,
        exactPathSpecificity,
        snippet: truncateUtf16Safe(row.text, params.snippetMaxChars),
        source: row.source,
      };
      const existing = lexicalById.get(result.id);
      if (!existing) {
        lexicalById.set(result.id, result);
        continue;
      }
      existing.pathScore = Math.max(existing.pathScore, result.pathScore);
      existing.score = Math.max(existing.score, result.score);
      existing.exactPathSpecificity = Math.max(
        existing.exactPathSpecificity,
        result.exactPathSpecificity,
      );
    }
  }
  const byId = new Map(exactResults.map((entry) => [entry.id, entry]));
  let nonExactCount = 0;
  for (const entry of [...lexicalById.values()].toSorted(comparePathKeywordSearchResults)) {
    const exact = byId.get(entry.id);
    if (entry.exactPathSpecificity > 0) {
      if (!exact) continue;
      exact.pathScore = Math.max(exact.pathScore, entry.pathScore);
      exact.score = Math.max(exact.score, entry.score);
      exact.exactPathSpecificity = Math.max(exact.exactPathSpecificity, entry.exactPathSpecificity);
      continue;
    }
    if (nonExactCount >= params.limit) continue;
    byId.set(entry.id, entry);
    nonExactCount += 1;
  }
  const resultLimit = hasExplicitExactPathHeadroom ? exactPathLimit + params.limit : params.limit;
  return [...byId.values()].toSorted(comparePathKeywordSearchResults).slice(0, resultLimit);
}
//#endregion
//#region extensions/memory-core/src/memory/manager-status-state.ts
const MEMORY_STATUS_AGGREGATE_SQL =
  "SELECT 'files' AS kind, source, COUNT(*) as c FROM memory_index_sources WHERE 1=1__FILTER__ GROUP BY source\nUNION ALL\nSELECT 'chunks' AS kind, source, COUNT(*) as c FROM memory_index_chunks WHERE 1=1__FILTER__ GROUP BY source";
function resolveInitialMemoryDirty(params) {
  return (
    Boolean(params.indexIdentityMismatched) ||
    (params.hasMemorySource && (params.statusOnly ? !params.hasIndexedMeta : true))
  );
}
function resolveStatusProviderInfo(params) {
  if (params.provider)
    return {
      provider: params.provider.id,
      model: params.provider.model,
      searchMode: "hybrid",
    };
  if (params.providerInitialized)
    return {
      provider: "none",
      model: void 0,
      searchMode: "fts-only",
    };
  return {
    provider: params.requestedProvider,
    model: params.configuredModel || void 0,
    searchMode: "hybrid",
  };
}
function collectMemoryStatusAggregate(params) {
  const sources = Array.from(params.sources);
  const bySource = /* @__PURE__ */ new Map();
  for (const source of sources)
    bySource.set(source, {
      files: 0,
      chunks: 0,
    });
  const sourceFilterSql = params.sourceFilterSql ?? "";
  const sourceFilterParams = params.sourceFilterParams ?? [];
  const aggregateRows = params.db
    .prepare(MEMORY_STATUS_AGGREGATE_SQL.replaceAll("__FILTER__", sourceFilterSql))
    .all(...sourceFilterParams, ...sourceFilterParams);
  let files = 0;
  let chunks = 0;
  for (const row of aggregateRows) {
    const count = row.c ?? 0;
    const entry = bySource.get(row.source) ?? {
      files: 0,
      chunks: 0,
    };
    if (row.kind === "files") {
      entry.files = count;
      files += count;
    } else {
      entry.chunks = count;
      chunks += count;
    }
    bySource.set(row.source, entry);
  }
  return {
    files,
    chunks,
    sourceCounts: sources.map((source) => Object.assign({ source }, bySource.get(source))),
  };
}
//#endregion
//#region extensions/memory-core/src/memory/manager-sync-control.ts
const log$1 = createSubsystemLogger("memory");
function isMemoryReadonlyDbError(err) {
  const readonlyPattern =
    /attempt to write a readonly database|database is read-only|SQLITE_READONLY/i;
  const messages = /* @__PURE__ */ new Set();
  const pushValue = (value) => {
    if (typeof value !== "string") return;
    const normalized = value.trim();
    if (!normalized) return;
    messages.add(normalized);
  };
  pushValue(formatErrorMessage(err));
  if (err && typeof err === "object") {
    const record = err;
    pushValue(record.message);
    pushValue(record.code);
    pushValue(record.name);
    if (record.cause && typeof record.cause === "object") {
      const cause = record.cause;
      pushValue(cause.message);
      pushValue(cause.code);
      pushValue(cause.name);
    }
  }
  return [...messages].some((value) => readonlyPattern.test(value));
}
function extractMemoryErrorReason(err) {
  if (err instanceof Error && err.message.trim()) return err.message;
  if (err && typeof err === "object") {
    const record = err;
    if (typeof record.message === "string" && record.message.trim()) return record.message;
    if (typeof record.code === "string" && record.code.trim()) return record.code;
  }
  return String(err);
}
async function runMemorySyncWithReadonlyRecovery(state, params) {
  try {
    await state.runSync(params);
  } catch (err) {
    if (!isMemoryReadonlyDbError(err) || state.closed) throw err;
    const reason = extractMemoryErrorReason(err);
    state.readonlyRecoveryAttempts += 1;
    state.readonlyRecoveryLastError = reason;
    log$1.warn(`memory sync readonly handle detected; reopening sqlite connection`, { reason });
    try {
      state.closeDatabase(state.db);
    } catch {}
    const previousVectorDims = state.vector.dims;
    state.db = state.openDatabase();
    state.resetVectorState();
    state.ensureSchema();
    const meta = state.readMeta();
    state.vector.dims = meta?.vectorDims ?? previousVectorDims;
    try {
      await state.runSync(params);
      state.readonlyRecoverySuccesses += 1;
    } catch (retryErr) {
      state.readonlyRecoveryFailures += 1;
      throw retryErr;
    }
  }
}
function enqueueMemoryTargetedSessionSync(state, targets) {
  const queuedArchiveFiles = state.getQueuedArchiveFiles();
  for (const sessionFile of targets?.archiveFiles ?? []) {
    const trimmed = sessionFile.trim();
    if (trimmed) queuedArchiveFiles.add(trimmed);
  }
  const queuedSessions = state.getQueuedSessions();
  for (const session of targets?.sessions ?? []) {
    const normalized = normalizeQueuedMemorySessionSyncTarget(session);
    if (normalized) queuedSessions.set(memorySessionSyncTargetKey(normalized), normalized);
  }
  if (queuedArchiveFiles.size === 0 && queuedSessions.size === 0)
    return state.getSyncing() ?? Promise.resolve();
  if (!state.getQueuedSessionSync())
    state.setQueuedSessionSync(
      (async () => {
        try {
          await state.getSyncing()?.catch(() => void 0);
          while (
            !state.isClosed() &&
            (state.getQueuedArchiveFiles().size > 0 || state.getQueuedSessions().size > 0)
          ) {
            const pendingArchiveFiles = Array.from(state.getQueuedArchiveFiles());
            const pendingSessions = Array.from(state.getQueuedSessions().values());
            state.getQueuedArchiveFiles().clear();
            state.getQueuedSessions().clear();
            await state.sync({
              reason: "queued-sessions",
              sessions: pendingSessions,
              archiveFiles: pendingArchiveFiles,
            });
          }
        } finally {
          state.setQueuedSessionSync(null);
        }
      })(),
    );
  return state.getQueuedSessionSync() ?? Promise.resolve();
}
function normalizeQueuedMemorySessionSyncTarget(target) {
  const sessionId = target.sessionId.trim();
  if (!sessionId) return null;
  const agentId = target.agentId?.trim();
  const sessionKey = target.sessionKey?.trim();
  return {
    ...(agentId ? { agentId } : {}),
    sessionId,
    ...(sessionKey ? { sessionKey } : {}),
  };
}
function memorySessionSyncTargetKey(target) {
  return [target.agentId ?? "", target.sessionId, target.sessionKey ?? ""].join("\0");
}
//#endregion
//#region extensions/memory-core/src/memory/manager.ts
const LOCAL_EMBEDDING_RUNTIME_FACTS = Symbol.for("openclaw.localEmbeddingRuntimeFacts");
function getLocalEmbeddingRuntimeFacts(provider) {
  if (!provider) return;
  const getRuntimeFacts = Reflect.get(provider, LOCAL_EMBEDDING_RUNTIME_FACTS);
  return typeof getRuntimeFacts === "function" ? getRuntimeFacts() : void 0;
}
const SNIPPET_MAX_CHARS = 700;
const VECTOR_TABLE = MEMORY_INDEX_VECTOR_TABLE;
const FTS_TABLE = MEMORY_INDEX_FTS_TABLE;
const PATH_FTS_TABLE = MEMORY_INDEX_PATHS_FTS_TABLE;
const EMBEDDING_CACHE_TABLE = MEMORY_EMBEDDING_CACHE_TABLE;
const MEMORY_INDEX_MANAGER_CACHE_KEY = Symbol.for("openclaw.memoryIndexManagerCache");
const EMBEDDING_PROBE_CACHE_TTL_MS = 3e4;
const KEYWORD_FALLBACK_SEARCH_TERM_LIMIT = 6;
const EXACT_PATH_CANDIDATE_LIMIT = 200;
const log = createSubsystemLogger("memory");
const { cache: INDEX_CACHE, pending: INDEX_CACHE_PENDING } = resolveSingletonManagedCache(
  MEMORY_INDEX_MANAGER_CACHE_KEY,
);
function compareKeywordSearchHits(a, b, preferExactBody = true) {
  const specificityDelta = b.exactPathSpecificity - a.exactPathSpecificity;
  if (specificityDelta !== 0) return specificityDelta;
  if (preferExactBody && a.exactPathSpecificity > 0) {
    const bodyPresenceDelta = Number(b.textScore > 0) - Number(a.textScore > 0);
    if (bodyPresenceDelta !== 0) return bodyPresenceDelta;
  }
  const relevanceDelta = b.score - a.score;
  if (relevanceDelta !== 0) return relevanceDelta;
  const textDelta = b.textScore - a.textScore;
  if (textDelta !== 0) return textDelta;
  if (a.exactPathSpecificity === 0) {
    const pathDelta = b.pathScore - a.pathScore;
    if (pathDelta !== 0) return pathDelta;
  }
  return a.path.localeCompare(b.path) || a.startLine - b.startLine || a.id.localeCompare(b.id);
}
const EMBEDDING_PROBE_CACHE = /* @__PURE__ */ new Map();
async function closeAllMemoryIndexManagers() {
  EMBEDDING_PROBE_CACHE.clear();
  await closeManagedCacheEntries({
    cache: INDEX_CACHE,
    pending: INDEX_CACHE_PENDING,
    onCloseError: (err) => {
      log.warn(`failed to close memory index manager: ${String(err)}`);
    },
  });
}
async function closeMemoryIndexManagersForAgent(params) {
  const workspaceDir = resolveAgentWorkspaceDir(params.cfg, params.agentId);
  await closeMemoryIndexManagersForScope({
    agentId: params.agentId,
    workspaceDir,
    purpose: "default",
  });
}
function resolveEffectiveMemorySearchSettings(settings) {
  if (settings.provider !== "none" || !settings.store.vector.enabled) return settings;
  return {
    ...settings,
    store: {
      ...settings.store,
      vector: {
        ...settings.store.vector,
        enabled: false,
      },
    },
  };
}
function resolveConfiguredMemoryEmbeddingProvider(params) {
  const normalizedAgentId = normalizeAgentId(params.agentId);
  return (
    params.cfg.agents?.list?.find(
      (entry) => entry && normalizeAgentId(entry.id) === normalizedAgentId,
    )?.memorySearch?.provider ?? params.cfg.agents?.defaults?.memorySearch?.provider
  );
}
function resolveMemoryEmbeddingProviderRequirement(params) {
  const configuredProvider = resolveConfiguredMemoryEmbeddingProvider(params)?.trim();
  if (params.settings.provider === "none" || configuredProvider === "none")
    return {
      mode: "fts-only",
      provider: params.settings.provider,
    };
  const adapterTransport = resolveEmbeddingProviderAdapterTransport(
    params.settings.provider,
    params.cfg,
  );
  if (!configuredProvider || configuredProvider === "auto" || adapterTransport === "local")
    return {
      mode: "optional",
      provider: params.settings.provider,
    };
  return {
    mode: "required",
    provider: params.settings.provider,
    configuredProvider,
  };
}
function resolveMemoryIndexManagerCacheKey(params) {
  return [
    params.agentId,
    params.workspaceDir,
    JSON.stringify(params.settings),
    JSON.stringify(params.providerRequirement),
    resolveMemoryCoreLocalServiceHostIdentity(params.acquireLocalService),
    params.purpose,
  ].join(":");
}
function isMemoryIndexManagerCacheKeyInScope(key, params) {
  return (
    key.startsWith(`${params.agentId}:${params.workspaceDir}:`) &&
    key.endsWith(`:${params.purpose}`)
  );
}
async function closeMemoryIndexManagersForScope(params) {
  const isScopedKey = (key) =>
    key !== params.exceptKey && isMemoryIndexManagerCacheKeyInScope(key, params);
  const pending = Array.from(INDEX_CACHE_PENDING.entries())
    .filter(([key]) => isScopedKey(key))
    .map(([, value]) => value);
  if (pending.length > 0) await Promise.allSettled(pending);
  const entries = Array.from(INDEX_CACHE.entries()).filter(([key]) => isScopedKey(key));
  for (const [key, manager] of entries) {
    INDEX_CACHE.delete(key);
    try {
      await manager.close();
    } catch (err) {
      log.warn(`failed to close memory index manager for agent ${params.agentId}: ${String(err)}`);
    }
  }
}
var MemoryIndexManager = class MemoryIndexManager extends MemoryManagerEmbeddingOps {
  static async loadProviderResult(params) {
    return await createEmbeddingProvider({
      config: params.cfg,
      agentDir: resolveAgentDir(params.cfg, params.agentId),
      ...(params.acquireLocalService ? { acquireLocalService: params.acquireLocalService } : {}),
      ...resolveMemoryPrimaryProviderRequest({ settings: params.settings }),
    });
  }
  static async get(params) {
    const { cfg, agentId } = params;
    const settings = resolveMemorySearchConfig(cfg, agentId);
    if (!settings) return null;
    const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
    const purpose =
      params.purpose === "status" || params.purpose === "cli" ? params.purpose : "default";
    const providerRequirement = resolveMemoryEmbeddingProviderRequirement({
      cfg,
      agentId,
      settings,
    });
    const key = resolveMemoryIndexManagerCacheKey({
      agentId,
      workspaceDir,
      settings,
      providerRequirement,
      purpose,
      acquireLocalService: params.acquireLocalService,
    });
    const transient = purpose === "status" || purpose === "cli";
    if (!transient)
      await closeMemoryIndexManagersForScope({
        agentId,
        workspaceDir,
        purpose,
        exceptKey: key,
      });
    return await getOrCreateManagedCacheEntry({
      cache: INDEX_CACHE,
      pending: INDEX_CACHE_PENDING,
      key,
      bypassCache: transient,
      create: async () => {
        const manager = new MemoryIndexManager({
          cacheKey: key,
          cfg,
          agentId,
          workspaceDir,
          settings,
          providerRequirement,
          purpose: params.purpose,
          acquireLocalService: params.acquireLocalService,
        });
        if (purpose === "status" && manager.sources.has("sessions"))
          try {
            await manager.markSessionStartupCatchupDirtyFiles();
          } catch (err) {
            log.warn("memory status session dirty detection failed: " + String(err));
          }
        return manager;
      },
    });
  }
  constructor(params) {
    super();
    this.providerInitPromise = null;
    this.providerInitialized = false;
    this.batchFailureCount = 0;
    this.batchFailureLock = Promise.resolve();
    this.vectorReady = null;
    this.watcher = null;
    this.watchTimer = null;
    this.sessionWatchTimer = null;
    this.sessionUnsubscribe = null;
    this.intervalTimer = null;
    this.memoryWatchPressureStartupTimer = null;
    this.closed = false;
    this.dirty = false;
    this.sessionsDirty = false;
    this.sessionsDirtyFiles = /* @__PURE__ */ new Set();
    this.sessionPendingFiles = /* @__PURE__ */ new Set();
    this.sessionPendingTargets = /* @__PURE__ */ new Map();
    this.indexIdentityDirty = false;
    this.sessionDeltas = /* @__PURE__ */ new Map();
    this.sessionWarm = /* @__PURE__ */ new Set();
    this.syncing = null;
    this.queuedArchiveFiles = /* @__PURE__ */ new Set();
    this.queuedSessions = /* @__PURE__ */ new Map();
    this.queuedSessionSync = null;
    this.readonlyRecoveryAttempts = 0;
    this.readonlyRecoverySuccesses = 0;
    this.readonlyRecoveryFailures = 0;
    this.indexIdentityState = {
      status: "missing",
      reason: "index metadata is missing",
    };
    const effectiveSettings = resolveEffectiveMemorySearchSettings(params.settings);
    this.cacheKey = params.cacheKey;
    this.acquireLocalService = params.acquireLocalService;
    this.purpose =
      params.purpose === "status" || params.purpose === "cli" ? params.purpose : "default";
    this.cfg = params.cfg;
    this.agentId = params.agentId;
    this.workspaceDir = params.workspaceDir;
    this.settings = effectiveSettings;
    this.providerRequirement = params.providerRequirement;
    this.provider = null;
    this.requestedProvider = effectiveSettings.provider;
    this.providerLifecycle = createPendingMemoryProviderLifecycle(this.requestedProvider);
    if (params.providerResult) this.applyProviderResult(params.providerResult);
    this.sources = new Set(effectiveSettings.sources);
    this.db = this.openDatabase();
    try {
      this.providerKey = this.computeProviderKey();
      this.cache = {
        enabled: effectiveSettings.cache.enabled,
        maxEntries: effectiveSettings.cache.maxEntries,
      };
      this.fts = {
        enabled: effectiveSettings.query.hybrid.enabled,
        available: false,
      };
      this.ensureSchema();
      this.vector = {
        enabled: effectiveSettings.store.vector.enabled,
        available: null,
        extensionPath: effectiveSettings.store.vector.extensionPath,
      };
      const meta = this.readMeta();
      if (meta?.vectorDims) this.vector.dims = meta.vectorDims;
      const initialIndexIdentity = this.resolveCurrentIndexIdentityState({
        meta,
        providerKeyKnown: Boolean(params.providerResult),
      });
      this.indexIdentityState = initialIndexIdentity;
      this.indexIdentityDirty =
        initialIndexIdentity.status === "mismatched" ||
        (initialIndexIdentity.status === "missing" && this.sources.has("memory"));
      const transient = params.purpose === "status" || params.purpose === "cli";
      if (!transient) {
        this.ensureWatcher();
        this.ensureSessionListener();
        this.ensureIntervalSync();
      }
      this.dirty = resolveInitialMemoryDirty({
        hasMemorySource: this.sources.has("memory"),
        statusOnly: params.purpose === "status",
        hasIndexedMeta: Boolean(meta),
      });
      this.batch = this.resolveBatchConfig();
      if (!transient) this.ensureSessionStartupCatchup();
    } catch (err) {
      closeMemoryDatabase(this.db);
      throw err;
    }
  }
  applyProviderResult(providerResult) {
    const providerState = resolveMemoryProviderState(providerResult);
    this.provider = providerState.provider;
    this.fallbackFrom = providerState.fallbackFrom;
    this.fallbackReason = providerState.fallbackReason;
    this.providerUnavailableReason = providerState.providerUnavailableReason;
    this.providerLifecycle = providerState.lifecycle;
    this.providerRuntime = providerState.providerRuntime;
    this.providerInitialized = true;
  }
  async ensureProviderInitialized() {
    if (this.providerInitialized) return;
    if (this.settings.provider === "none") {
      this.applyProviderResult({
        provider: null,
        requestedProvider: "none",
        providerUnavailableReason: "No embedding provider available (FTS-only mode)",
      });
      this.providerKey = this.computeProviderKey();
      this.batch = this.resolveBatchConfig();
      return;
    }
    if (!this.providerInitPromise)
      this.providerInitPromise = (async () => {
        const providerResult = await MemoryIndexManager.loadProviderResult({
          cfg: this.cfg,
          agentId: this.agentId,
          settings: this.settings,
          acquireLocalService: this.acquireLocalService,
        });
        this.applyProviderResult(providerResult);
        this.providerKey = this.computeProviderKey();
        this.batch = this.resolveBatchConfig();
      })();
    try {
      await this.providerInitPromise;
    } catch (err) {
      this.providerInitPromise = null;
      throw err;
    } finally {
      if (this.providerInitialized) this.providerInitPromise = null;
    }
  }
  resetProviderInitializationForRetry() {
    this.providerInitialized = false;
    this.providerInitPromise = null;
    this.providerUnavailableReason = void 0;
    this.providerLifecycle = createPendingMemoryProviderLifecycle(this.requestedProvider);
  }
  markLocalEmbeddingProviderDegraded(err) {
    if (this.provider?.id !== "local") return;
    if (!isLocalEmbeddingWorkerFailure(err)) return;
    const message = formatErrorMessage(err);
    const degradedProvider = this.provider;
    this.provider = null;
    this.providerRuntime = void 0;
    this.providerUnavailableReason = `Local embeddings degraded: ${message}`;
    this.providerLifecycle = createDegradedMemoryProviderLifecycle({
      providerId: degradedProvider.id,
      reason: message,
      code: err.code,
    });
    EMBEDDING_PROBE_CACHE.delete(this.cacheKey);
    this.providerKey = this.computeProviderKey();
    this.batch = this.resolveBatchConfig();
    this.vector.semanticAvailable = false;
    Promise.resolve(degradedProvider.close?.()).catch((errLocal) => {
      log.debug(`memory embeddings: failed to close degraded local provider: ${String(errLocal)}`);
    });
    log.warn("memory embeddings: local provider degraded after worker failure", { error: message });
  }
  isRequiredProviderUnavailable() {
    return this.providerRequirement.mode === "required" && !this.provider;
  }
  buildRequiredProviderUnavailableError(operation) {
    const registeredProviderIds = listRegisteredMemoryEmbeddingProviderAdapters()
      .map((adapter) => adapter.id)
      .toSorted();
    const registeredProviders =
      registeredProviderIds.length > 0 ? registeredProviderIds.join(",") : "none";
    const reason =
      this.providerUnavailableReason ??
      (this.providerLifecycle.mode === "fts-only"
        ? this.providerLifecycle.reason
        : "provider is unavailable");
    return /* @__PURE__ */ new Error(
      `Memory ${operation} unavailable: embedding provider "${this.settings.provider}" is configured but unavailable. Reason: ${reason}. agentId=${this.agentId} purpose=${this.purpose} lifecycle=${JSON.stringify(this.providerLifecycle)} registeredMemoryEmbeddingProviders=${registeredProviders}`,
    );
  }
  assertRequiredProviderAvailable(operation) {
    if (this.isRequiredProviderUnavailable()) {
      const error = this.buildRequiredProviderUnavailableError(operation);
      this.resetProviderInitializationForRetry();
      throw error;
    }
  }
  async warmSession(sessionKey) {
    if (!this.settings.sync.onSessionStart) return;
    const key = sessionKey?.trim() || "";
    if (key && this.sessionWarm.has(key)) return;
    this.sync({ reason: "session-start" }).catch((err) => {
      log.warn(`memory sync failed (session-start): ${String(err)}`);
    });
    if (key) this.sessionWarm.add(key);
  }
  refreshIndexIdentityDirty(params) {
    const provider =
      this.settings.provider === "none"
        ? null
        : this.providerInitialized
          ? this.provider
            ? {
                id: this.provider.id,
                model: this.provider.model,
              }
            : null
          : void 0;
    const state = this.resolveCurrentIndexIdentityState({
      ...(provider !== void 0 ? { provider } : {}),
      providerKeyKnown: params?.providerKeyKnown,
    });
    this.indexIdentityState = state;
    this.indexIdentityDirty =
      state.status === "mismatched" ||
      (state.status === "missing" && (this.sources.has("memory") || this.hasIndexedChunks()));
    return state;
  }
  async search(query, opts) {
    opts?.onDebug?.({ backend: "builtin" });
    const normalizedQuery = query.trim();
    if (!normalizedQuery) return [];
    if (this.providerRequirement.mode === "required") {
      await this.ensureProviderInitialized();
      this.assertRequiredProviderAvailable("search");
    }
    let hasIndexedContent = this.hasIndexedContent();
    if (!hasIndexedContent) {
      try {
        await this.sync({
          reason: "search",
          force: true,
        });
      } catch (err) {
        log.warn(`memory sync failed (search-bootstrap): ${String(err)}`);
      }
      hasIndexedContent = this.hasIndexedContent();
    }
    const preflight = resolveMemorySearchPreflight({
      query: normalizedQuery,
      hasIndexedContent,
    });
    if (!preflight.shouldSearch) return [];
    const cleaned = preflight.normalizedQuery;
    this.warmSession(opts?.sessionKey);
    await startAsyncSearchSync({
      enabled: this.settings.sync.onSearch,
      dirty: this.dirty,
      sessionsDirty: this.sessionsDirty,
      sync: async (params) => await this.sync(params),
      onError: (err) => {
        log.warn(`memory sync failed (search): ${String(err)}`);
      },
    });
    if (preflight.shouldInitializeProvider) {
      await this.ensureProviderInitialized();
      this.assertRequiredProviderAvailable("search");
    }
    if (!this.provider && this.providerLifecycle.mode === "degraded") {
      if (
        await this.activateFallbackProvider(this.providerLifecycle.reason).catch((fallbackErr) => {
          log.warn(
            `memory search: failed to activate fallback provider: ${formatErrorMessage(fallbackErr)}`,
          );
          return false;
        })
      )
        this.refreshIndexIdentityDirty({ providerKeyKnown: this.providerInitialized });
    }
    if (
      this.refreshIndexIdentityDirty({ providerKeyKnown: this.providerInitialized }).status !==
      "valid"
    )
      return [];
    const minScore = opts?.minScore ?? this.settings.query.minScore;
    const maxResults = opts?.maxResults ?? this.settings.query.maxResults;
    const searchSources =
      opts?.sources && opts.sources.length > 0
        ? uniqueValues(opts.sources).filter((s) => this.sources.has(s))
        : void 0;
    if (opts?.sources && opts.sources.length > 0 && (!searchSources || searchSources.length === 0))
      return [];
    const sourceFilterList = searchSources ?? [...this.sources];
    const hybrid = this.settings.query.hybrid;
    const candidates = Math.min(
      200,
      Math.max(1, Math.floor(maxResults * hybrid.candidateMultiplier)),
    );
    if (!this.provider) {
      this.assertRequiredProviderAvailable("search");
      if (!this.fts.enabled || !this.fts.available) {
        log.warn("memory search: no provider and FTS unavailable");
        return [];
      }
      const keywordResults = await this.searchKeywordWithFallback(
        cleaned,
        candidates,
        { boostFallbackRanking: true },
        sourceFilterList,
      ).catch((err) => {
        log.warn(`memory search: FTS keyword query failed: ${formatErrorMessage(err)}`);
        return [];
      });
      return await this.finalizeKeywordOnlyResults({
        results: keywordResults,
        temporalDecay: hybrid.temporalDecay,
        maxResults,
        minScore,
      });
    }
    const loadKeywordResults = async () =>
      hybrid.enabled && this.fts.enabled && this.fts.available
        ? await this.searchKeywordWithFallback(
            cleaned,
            candidates,
            { boostFallbackRanking: true },
            sourceFilterList,
          ).catch((err) => {
            log.warn(`memory search: FTS hybrid keyword query failed: ${formatErrorMessage(err)}`);
            return [];
          })
        : [];
    let keywordResults = await loadKeywordResults();
    let queryVec;
    try {
      queryVec = await this.embedQueryWithRetry(cleaned, opts?.signal);
    } catch (err) {
      if (opts?.signal?.aborted) throw err;
      const message = formatErrorMessage(err);
      if (
        this.shouldFallbackOnError(err)
          ? await this.activateFallbackProvider(message).catch((fallbackErr) => {
              log.warn(
                `memory search: failed to activate fallback provider: ${formatErrorMessage(fallbackErr)}`,
              );
              return false;
            })
          : false
      ) {
        if (
          this.refreshIndexIdentityDirty({ providerKeyKnown: this.providerInitialized }).status !==
          "valid"
        )
          return [];
        keywordResults = await loadKeywordResults();
        queryVec = await this.embedQueryWithRetry(cleaned, opts?.signal);
      } else if (!this.provider && this.fts.enabled && this.fts.available) {
        log.warn(`memory search: embeddings unavailable; using keyword-only results: ${message}`);
        return await this.finalizeKeywordOnlyResults({
          results: keywordResults,
          temporalDecay: hybrid.temporalDecay,
          maxResults,
          minScore,
        });
      } else throw err;
    }
    const vectorResults = queryVec.some((v) => v !== 0)
      ? await this.searchVector(queryVec, candidates, sourceFilterList).catch((err) => {
          log.warn(`memory search: vector query failed: ${formatErrorMessage(err)}`);
          return [];
        })
      : [];
    if (!hybrid.enabled || !this.fts.enabled || !this.fts.available)
      return vectorResults.filter((entry) => entry.score >= minScore).slice(0, maxResults);
    const merged = await this.mergeHybridResults({
      query: cleaned,
      vector: vectorResults,
      keyword: keywordResults,
      vectorWeight: hybrid.vectorWeight,
      textWeight: hybrid.textWeight,
      mmr: hybrid.mmr,
      temporalDecay: hybrid.temporalDecay,
    });
    const strict = merged.filter((entry) => entry.score >= minScore);
    if (strict.length > 0 || keywordResults.length === 0) return strict.slice(0, maxResults);
    const relaxedMinScore = 0;
    const keywordKeys = new Set(
      keywordResults.map(
        (entry) => `${entry.source}:${entry.path}:${entry.startLine}:${entry.endLine}`,
      ),
    );
    return this.selectScoredResults(
      merged.filter((entry) =>
        keywordKeys.has(`${entry.source}:${entry.path}:${entry.startLine}:${entry.endLine}`),
      ),
      maxResults,
      minScore,
      relaxedMinScore,
    );
  }
  selectScoredResults(results, maxResults, minScore, relaxedMinScore = minScore) {
    const strict = results.filter((entry) => entry.score >= minScore);
    if (strict.length > 0) return strict.slice(0, maxResults);
    return results.filter((entry) => entry.score >= relaxedMinScore).slice(0, maxResults);
  }
  rankKeywordOnlyResults(results, preferExactBody = true) {
    return results
      .toSorted((left, right) => compareKeywordSearchHits(left, right, preferExactBody))
      .map((entry) =>
        entry.exactPathSpecificity > 0 ? Object.assign(entry, { score: 1 }) : entry,
      );
  }
  async finalizeKeywordOnlyResults(params) {
    const appliesTemporalDecay = params.temporalDecay?.enabled === true;
    const decayed = await applyTemporalDecayToHybridResults({
      results: appliesTemporalDecay
        ? params.results.map((entry) => {
            if (entry.exactPathSpecificity === 0) return entry;
            const contentScore = entry.textScore > 0 ? entry.score : 0;
            return {
              ...entry,
              score: scoreExactPathTieForTemporalDecay(contentScore),
            };
          })
        : params.results,
      temporalDecay: params.temporalDecay,
      workspaceDir: this.workspaceDir,
    });
    const ranked = this.rankKeywordOnlyResults(decayed, !appliesTemporalDecay);
    return this.toMemorySearchResults(
      this.selectScoredResults(ranked, params.maxResults, params.minScore, 0),
    );
  }
  hasIndexedContent() {
    if (this.db.prepare(`SELECT 1 as found FROM memory_index_chunks LIMIT 1`).get()?.found === 1)
      return true;
    if (!this.fts.enabled || !this.fts.available) return false;
    return this.db.prepare(`SELECT 1 as found FROM ${FTS_TABLE} LIMIT 1`).get()?.found === 1;
  }
  async searchVector(queryVec, limit, sourceFilterList) {
    if (!this.provider) return [];
    return (
      await searchVector({
        db: this.db,
        vectorTable: VECTOR_TABLE,
        providerModel: this.provider.model,
        providerModelAliases: this.resolveProviderIndexIdentities()
          .slice(1)
          .map((identity) => identity.model),
        queryVec,
        limit,
        snippetMaxChars: SNIPPET_MAX_CHARS,
        ensureVectorReady: async (dimensions) => await this.ensureVectorReady(dimensions),
        sourceFilterVec: this.buildSourceFilter("c", sourceFilterList),
        sourceFilterChunks: this.buildSourceFilter(void 0, sourceFilterList),
      })
    ).map((entry) => entry);
  }
  buildFtsQuery(raw) {
    return buildFtsQuery(raw);
  }
  async searchKeyword(query, limit, options, sourceFilterList) {
    if (!this.fts.enabled || !this.fts.available) return [];
    const bodySearch = searchKeyword({
      db: this.db,
      ftsTable: FTS_TABLE,
      query,
      ftsTokenizer: this.settings.store.fts.tokenizer,
      limit,
      snippetMaxChars: SNIPPET_MAX_CHARS,
      sourceFilter: this.buildSourceFilter(void 0, sourceFilterList),
      buildFtsQuery: (raw) => this.buildFtsQuery(raw),
      bm25RankToScore,
      boostFallbackRanking: options?.boostFallbackRanking,
    }).catch((err) => {
      log.warn(`memory search: body keyword query failed: ${formatErrorMessage(err)}`);
      return [];
    });
    const exactPathQuery = options?.exactPathQuery ?? query;
    const pathSearch = searchPathKeyword({
      db: this.db,
      pathFtsTable: PATH_FTS_TABLE,
      query,
      exactPathQuery,
      exactPathLimit: EXACT_PATH_CANDIDATE_LIMIT,
      ftsTokenizer: this.settings.store.fts.tokenizer,
      limit,
      snippetMaxChars: SNIPPET_MAX_CHARS,
      sourceFilter: this.buildSourceFilter(PATH_FTS_TABLE, sourceFilterList),
      buildFtsQuery: (raw) => this.buildFtsQuery(raw),
      bm25RankToScore,
    }).catch((err) => {
      log.warn(`memory search: path keyword query failed: ${formatErrorMessage(err)}`);
      return [];
    });
    const [bodyResults, pathResults] = await Promise.all([bodySearch, pathSearch]);
    const merged = this.mergeKeywordSearchHits(
      [
        bodyResults.map((entry) =>
          Object.assign(entry, {
            exactPathSpecificity: resolveExactPathSpecificity(exactPathQuery, entry.path),
            pathScore: 0,
          }),
        ),
        pathResults,
      ],
      exactPathQuery,
    );
    return this.limitKeywordSearchHits(merged, limit);
  }
  async searchKeywordWithFallback(query, limit, options, sourceFilterList) {
    const fullQueryResults = await this.searchKeyword(
      query,
      limit,
      options,
      sourceFilterList,
    ).catch(() => []);
    if (fullQueryResults.length > 0) return fullQueryResults;
    const fallbackTerms = this.resolveKeywordFallbackTerms(query);
    if (fallbackTerms.length === 0) return [];
    const resultSets = await Promise.all(
      fallbackTerms.map((term) =>
        this.searchKeyword(
          term,
          limit,
          {
            ...options,
            exactPathQuery: query,
          },
          sourceFilterList,
        ).catch(() => []),
      ),
    );
    return this.limitKeywordSearchHits(this.mergeKeywordSearchHits(resultSets, query), limit);
  }
  resolveKeywordFallbackTerms(query) {
    return extractKeywords(query, { ftsTokenizer: this.settings.store.fts.tokenizer })
      .filter((term) => term !== query)
      .slice(0, KEYWORD_FALLBACK_SEARCH_TERM_LIMIT);
  }
  mergeKeywordSearchHits(resultSets, exactPathQuery) {
    const seenIds = /* @__PURE__ */ new Map();
    for (const results of resultSets)
      for (const result of results) {
        const existing = seenIds.get(result.id);
        if (!existing) {
          seenIds.set(result.id, result);
          continue;
        }
        const existingHasBody = existing.textScore > 0;
        const resultHasBody = result.textScore > 0;
        const existingBodyScore = existingHasBody ? existing.score : 0;
        const resultBodyScore = resultHasBody ? result.score : 0;
        existing.textScore = Math.max(existing.textScore, result.textScore);
        existing.pathScore = Math.max(existing.pathScore, result.pathScore);
        existing.exactPathSpecificity = Math.max(
          existing.exactPathSpecificity,
          result.exactPathSpecificity,
        );
        const bodyScore = Math.max(existingBodyScore, resultBodyScore);
        existing.score = bodyScore > 0 ? bodyScore : existing.pathScore;
        if (
          (resultHasBody && !existingHasBody) ||
          (resultHasBody === existingHasBody && result.snippet.length > existing.snippet.length)
        )
          existing.snippet = result.snippet;
      }
    const merged = [...seenIds.values()];
    if (exactPathQuery !== void 0)
      for (const result of merged)
        result.exactPathSpecificity = resolveExactPathSpecificity(exactPathQuery, result.path);
    for (const result of merged)
      if (result.textScore === 0)
        result.score = result.exactPathSpecificity > 0 ? 1 : result.pathScore;
    return merged.toSorted(compareKeywordSearchHits);
  }
  limitKeywordSearchHits(results, nonExactLimit) {
    const ranked = results.toSorted(compareKeywordSearchHits);
    const exactBody = ranked
      .filter((entry) => entry.exactPathSpecificity > 0 && entry.textScore > 0)
      .slice(0, nonExactLimit);
    const exactPathOnly = ranked.filter(
      (entry) => entry.exactPathSpecificity > 0 && entry.textScore === 0,
    );
    const boundedExact = exactBody.concat(exactPathOnly).toSorted(compareKeywordSearchHits);
    const selectedPathKeys = /* @__PURE__ */ new Set();
    for (const entry of boundedExact) {
      selectedPathKeys.add(`${entry.source}:${entry.path}`);
      if (selectedPathKeys.size === EXACT_PATH_CANDIDATE_LIMIT) break;
    }
    const exact = boundedExact.filter((entry) =>
      selectedPathKeys.has(`${entry.source}:${entry.path}`),
    );
    const nonExact = ranked
      .filter((entry) => entry.exactPathSpecificity === 0)
      .slice(0, nonExactLimit);
    return exact.concat(nonExact);
  }
  toMemorySearchResults(results) {
    return results.map(
      ({
        id: _id,
        pathScore: _pathScore,
        exactPathSpecificity: _exactPathSpecificity,
        ...result
      }) => result,
    );
  }
  mergeHybridResults(params) {
    return mergeHybridResults({
      vector: params.vector.map((r) => ({
        id: r.id,
        path: r.path,
        startLine: r.startLine,
        endLine: r.endLine,
        source: r.source,
        snippet: r.snippet,
        vectorScore: r.score,
        exactPathSpecificity: resolveExactPathSpecificity(params.query, r.path),
      })),
      keyword: params.keyword.map((r) => ({
        id: r.id,
        path: r.path,
        startLine: r.startLine,
        endLine: r.endLine,
        source: r.source,
        snippet: r.snippet,
        textScore: r.textScore,
        rankingScore: r.score,
        pathScore: r.pathScore,
        exactPathSpecificity: r.exactPathSpecificity,
      })),
      vectorWeight: params.vectorWeight,
      textWeight: params.textWeight,
      mmr: params.mmr,
      temporalDecay: params.temporalDecay,
      workspaceDir: this.workspaceDir,
    }).then((entries) => entries.map((entry) => entry));
  }
  async sync(params) {
    if (this.closed) return;
    if (this.syncing) {
      if (hasTargetedSessionSyncParams(params)) return this.enqueueTargetedSessionSync(params);
      return this.syncing;
    }
    this.syncing = (async () => {
      await this.ensureProviderInitialized();
      await this.runSyncWithReadonlyRecovery(params);
    })().finally(() => {
      this.syncing = null;
    });
    return this.syncing ?? Promise.resolve();
  }
  enqueueTargetedSessionSync(targets) {
    return enqueueMemoryTargetedSessionSync(
      {
        isClosed: () => this.closed,
        getSyncing: () => this.syncing,
        getQueuedArchiveFiles: () => this.queuedArchiveFiles,
        getQueuedSessions: () => this.queuedSessions,
        getQueuedSessionSync: () => this.queuedSessionSync,
        setQueuedSessionSync: (value) => {
          this.queuedSessionSync = value;
        },
        sync: async (params) => await this.sync(params),
      },
      targets,
    );
  }
  async runSyncWithReadonlyRecovery(params) {
    const getClosed = () => this.closed;
    const getDb = () => this.db;
    const setDb = (value) => {
      this.db = value;
    };
    const getReadonlyRecoveryAttempts = () => this.readonlyRecoveryAttempts;
    const setReadonlyRecoveryAttempts = (value) => {
      this.readonlyRecoveryAttempts = value;
    };
    const getReadonlyRecoverySuccesses = () => this.readonlyRecoverySuccesses;
    const setReadonlyRecoverySuccesses = (value) => {
      this.readonlyRecoverySuccesses = value;
    };
    const getReadonlyRecoveryFailures = () => this.readonlyRecoveryFailures;
    const setReadonlyRecoveryFailures = (value) => {
      this.readonlyRecoveryFailures = value;
    };
    const getReadonlyRecoveryLastError = () => this.readonlyRecoveryLastError;
    const setReadonlyRecoveryLastError = (value) => {
      this.readonlyRecoveryLastError = value;
    };
    await runMemorySyncWithReadonlyRecovery(
      {
        get closed() {
          return getClosed();
        },
        get db() {
          return getDb();
        },
        set db(value) {
          setDb(value);
        },
        vector: this.vector,
        get readonlyRecoveryAttempts() {
          return getReadonlyRecoveryAttempts();
        },
        set readonlyRecoveryAttempts(value) {
          setReadonlyRecoveryAttempts(value);
        },
        get readonlyRecoverySuccesses() {
          return getReadonlyRecoverySuccesses();
        },
        set readonlyRecoverySuccesses(value) {
          setReadonlyRecoverySuccesses(value);
        },
        get readonlyRecoveryFailures() {
          return getReadonlyRecoveryFailures();
        },
        set readonlyRecoveryFailures(value) {
          setReadonlyRecoveryFailures(value);
        },
        get readonlyRecoveryLastError() {
          return getReadonlyRecoveryLastError();
        },
        set readonlyRecoveryLastError(value) {
          setReadonlyRecoveryLastError(value);
        },
        runSync: (nextParams) => this.runSync(nextParams),
        openDatabase: () => this.openDatabase(),
        closeDatabase: (db) => closeMemoryDatabase(db),
        resetVectorState: () => this.resetVectorState(),
        ensureSchema: () => this.ensureSchema(),
        readMeta: () => this.readMeta() ?? void 0,
      },
      params,
    );
  }
  async readFile(params) {
    return await readMemoryFile({
      workspaceDir: this.workspaceDir,
      extraPaths: this.settings.extraPaths,
      relPath: params.relPath,
      from: params.from,
      lines: params.lines,
    });
  }
  status() {
    this.refreshIndexIdentityDirty({ providerKeyKnown: this.providerInitialized });
    const sourceFilter = this.buildSourceFilter();
    const aggregateState = collectMemoryStatusAggregate({
      db: { prepare: (sql) => ({ all: (...args) => this.db.prepare(sql).all(...args) }) },
      sources: this.sources,
      sourceFilterSql: sourceFilter.sql,
      sourceFilterParams: sourceFilter.params,
    });
    const providerInfo = resolveStatusProviderInfo({
      provider: this.provider,
      providerInitialized: this.providerInitialized,
      requestedProvider: this.requestedProvider,
      configuredModel: this.settings.model || void 0,
    });
    return {
      backend: "builtin",
      files: aggregateState.files,
      chunks: aggregateState.chunks,
      dirty: this.dirty || this.sessionsDirty || this.indexIdentityDirty,
      workspaceDir: this.workspaceDir,
      dbPath: this.settings.store.databasePath,
      provider: providerInfo.provider,
      model: providerInfo.model,
      requestedProvider: this.requestedProvider,
      sources: Array.from(this.sources),
      extraPaths: this.settings.extraPaths,
      sourceCounts: aggregateState.sourceCounts,
      cache: this.cache.enabled
        ? {
            enabled: true,
            entries:
              this.db.prepare(`SELECT COUNT(*) as c FROM ${EMBEDDING_CACHE_TABLE}`).get()?.c ?? 0,
            maxEntries: this.cache.maxEntries,
          }
        : {
            enabled: false,
            maxEntries: this.cache.maxEntries,
          },
      fts: {
        enabled: this.fts.enabled,
        available: this.fts.available,
        error: this.fts.loadError,
      },
      fallback: this.fallbackReason
        ? {
            from: this.fallbackFrom ?? "local",
            reason: this.fallbackReason,
          }
        : void 0,
      vector: {
        enabled: this.vector.enabled,
        storeAvailable: this.vector.available ?? void 0,
        semanticAvailable: this.vector.semanticAvailable,
        available: this.vector.semanticAvailable,
        extensionPath: this.vector.extensionPath,
        loadError: this.vector.loadError,
        dims: this.vector.dims,
      },
      batch: {
        enabled: this.batch.enabled,
        failures: this.batchFailureCount,
        limit: 2,
        wait: this.batch.wait,
        concurrency: this.batch.concurrency,
        pollIntervalMs: this.batch.pollIntervalMs,
        timeoutMs: this.batch.timeoutMs,
        lastError: this.batchFailureLastError,
        lastProvider: this.batchFailureLastProvider,
      },
      custom: {
        llamaCppRuntime: getLocalEmbeddingRuntimeFacts(this.provider),
        searchMode: providerInfo.searchMode,
        providerState: this.providerLifecycle,
        providerUnavailableReason: this.providerUnavailableReason,
        indexIdentity: this.indexIdentityState,
        readonlyRecovery: {
          attempts: this.readonlyRecoveryAttempts,
          successes: this.readonlyRecoverySuccesses,
          failures: this.readonlyRecoveryFailures,
          lastError: this.readonlyRecoveryLastError,
        },
      },
    };
  }
  async probeVectorAvailability() {
    if (!this.vector.enabled) {
      this.vector.semanticAvailable = false;
      return false;
    }
    await this.ensureProviderInitialized();
    if (!this.provider) {
      this.vector.semanticAvailable = false;
      return false;
    }
    const ready = await this.probeVectorStoreAvailability();
    this.vector.semanticAvailable = ready;
    return ready;
  }
  async probeVectorStoreAvailability() {
    if (!this.vector.enabled) {
      this.vector.available = false;
      return false;
    }
    return await this.ensureVectorReady();
  }
  cacheProbeResult(result) {
    const checkedAtMs = Date.now();
    EMBEDDING_PROBE_CACHE.set(this.cacheKey, {
      result,
      checkedAtMs,
      expireAtMs: checkedAtMs + EMBEDDING_PROBE_CACHE_TTL_MS,
    });
    return result;
  }
  getCachedEmbeddingAvailability() {
    const cached = EMBEDDING_PROBE_CACHE.get(this.cacheKey);
    if (!cached) return null;
    if (Date.now() >= cached.expireAtMs) {
      EMBEDDING_PROBE_CACHE.delete(this.cacheKey);
      return null;
    }
    return {
      ...cached.result,
      checked: true,
      cached: true,
      checkedAtMs: cached.checkedAtMs,
      cacheExpiresAtMs: cached.expireAtMs,
    };
  }
  async probeEmbeddingAvailability() {
    const cached = this.getCachedEmbeddingAvailability();
    if (cached) return cached;
    await this.ensureProviderInitialized();
    if (!this.provider)
      return this.cacheProbeResult({
        ok: false,
        error: this.providerUnavailableReason ?? "No embedding provider available (FTS-only mode)",
      });
    try {
      await this.embedBatchWithRetry(["ping"]);
      return this.cacheProbeResult({ ok: true });
    } catch (err) {
      const message = formatErrorMessage(err);
      return this.cacheProbeResult({
        ok: false,
        error: message,
      });
    }
  }
  async close() {
    if (this.closed) return;
    this.closed = true;
    const pendingProviderInit = this.providerInitPromise;
    if (this.watchTimer) {
      clearTimeout(this.watchTimer);
      this.watchTimer = null;
    }
    if (this.sessionWatchTimer) {
      clearTimeout(this.sessionWatchTimer);
      this.sessionWatchTimer = null;
    }
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }
    if (this.memoryWatchPressureStartupTimer) {
      clearTimeout(this.memoryWatchPressureStartupTimer);
      this.memoryWatchPressureStartupTimer = null;
    }
    if (this.watcher) {
      await this.watcher.close();
      this.watcher = null;
    }
    this.closeNativeMemoryWatchPairs();
    if (this.sessionUnsubscribe) {
      this.sessionUnsubscribe();
      this.sessionUnsubscribe = null;
    }
    const closeErrors = /* @__PURE__ */ new Map();
    const providersToClose = /* @__PURE__ */ new Set();
    const rememberCurrentProvider = () => {
      const provider = this.provider;
      if (!provider) return;
      providersToClose.add(provider);
    };
    const closeProvider = async (provider) => {
      try {
        await provider.close?.();
        closeErrors.delete(provider);
        if (this.provider === provider) this.provider = null;
      } catch (err) {
        closeErrors.set(provider, err);
        providersToClose.add(provider);
      } finally {
        rememberCurrentProvider();
      }
    };
    const drainTrackedProviders = async () => {
      for (let attempt = 0; attempt < 2 && providersToClose.size > 0; attempt += 1) {
        const providers = Array.from(providersToClose);
        providersToClose.clear();
        try {
          for (const provider of providers) await closeProvider(provider);
        } finally {
          rememberCurrentProvider();
        }
      }
    };
    const reportPendingWorkError = (err) => {
      log.warn(`memory close: pending manager work failed: ${formatErrorMessage(err)}`);
    };
    const awaitCurrentSync = async () => {
      const pendingSync = this.syncing;
      if (!pendingSync) return;
      await awaitPendingManagerWork({
        pendingSync,
        onError: reportPendingWorkError,
      });
    };
    await awaitPendingManagerWork({
      pendingProviderInit,
      onError: reportPendingWorkError,
    });
    rememberCurrentProvider();
    try {
      await awaitCurrentSync();
      rememberCurrentProvider();
      await drainTrackedProviders();
    } finally {
      closeMemoryDatabase(this.db);
      if (INDEX_CACHE.get(this.cacheKey) === this) INDEX_CACHE.delete(this.cacheKey);
    }
    const closeError = closeErrors.values().next().value;
    if (closeError) throw toLintErrorObject(closeError, "Non-Error thrown");
  }
};
function hasTargetedSessionSyncParams(params) {
  return Boolean(
    params?.sessions?.some((session) => session.sessionId.trim().length > 0) ||
    params?.archiveFiles?.some((sessionFile) => sessionFile.trim().length > 0),
  );
}
function toLintErrorObject(value, fallbackMessage) {
  if (value instanceof Error) return value;
  if (typeof value === "string") return new Error(value);
  const error = new Error(fallbackMessage, { cause: value });
  if ((typeof value === "object" && value !== null) || typeof value === "function")
    Object.assign(error, value);
  return error;
}
//#endregion
export {
  createEmbeddingProvider as a,
  formatMemoryVectorDegradedWriteReason as i,
  closeAllMemoryIndexManagers as n,
  resolveMemoryCoreLocalServiceHostIdentity as o,
  closeMemoryIndexManagersForAgent as r,
  MemoryIndexManager as t,
};
