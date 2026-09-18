import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import "./src-Bl7G9qvi.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { t as createTimeZoneDayKeyFormatter } from "./format-datetime-Bp7Mn3G9.js";
import { s as asFiniteNumber } from "./number-coercion-CJQ8TR--.js";
import {
  d as openOpenClawAgentDatabase,
  f as runOpenClawAgentWriteTransaction,
  p as resolveOpenClawAgentSqlitePath,
} from "./openclaw-agent-db-VC51jrBW.js";
import {
  L as executeSqliteQuerySync,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import {
  b as parseSessionArchiveTimestamp,
  c as resolveSessionTranscriptsDirForAgent,
  g as isSessionArchiveArtifactName,
  h as isPrimarySessionTranscriptFileName,
  n as resolveDefaultSessionStorePath,
  r as resolveSessionFilePath,
  w as materializeSessionArchiveForRead,
  x as parseUsageCountedSessionIdFromFileName,
  y as isUsageCountedSessionTranscriptFileName,
} from "./paths-TfuVT-K8.js";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-BHgpSCM6.js";
import {
  Ht as normalizeUsage,
  Mt as selectVisibleTranscriptEvents,
  w as loadTranscriptEventsSync,
  y as listSessionEntries,
  z as readTranscriptStatsSync,
} from "./session-accessor-PZVNxFCV.js";
import {
  A as countToolResults,
  O as stripEnvelope,
  j as extractToolCallNames,
  k as stripMessageIdHints,
} from "./session-transcript-readers-Bv0ty7AX.js";
import {
  n as parseSqliteSessionFileMarker,
  t as formatSqliteSessionFileMarker,
} from "./sqlite-marker-BejbySI1.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { r as stripInboundMetadata } from "./strip-inbound-meta-CbJ4Y6Dq.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import {
  a as resolveModelCostConfigFingerprint,
  i as resolveModelCostConfig,
  t as estimateUsageCost,
} from "./usage-format-D2Sx-NyU.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/infra/session-cost-usage-cache.sqlite.ts
const CACHE_SCOPE = "session-cost-usage";
const CACHE_KEY = "cache";
const REFRESH_LOCK_KEY = "refresh-lock";
function readCacheValue(agentId, key, databasePath) {
  const database = openOpenClawAgentDatabase({
    agentId: normalizeAgentId(agentId),
    ...(databasePath ? { path: databasePath } : {}),
  });
  const kysely = getNodeSqliteKysely(database.db);
  return (
    executeSqliteQuerySync(
      database.db,
      kysely
        .selectFrom("cache_entries")
        .select("value_json")
        .where("scope", "=", CACHE_SCOPE)
        .where("key", "=", key)
        .limit(1),
    ).rows[0]?.value_json ?? null
  );
}
function upsertCacheValue(params) {
  runOpenClawAgentWriteTransaction(
    (database) => {
      const kysely = getNodeSqliteKysely(database.db);
      executeSqliteQuerySync(
        database.db,
        kysely
          .insertInto("cache_entries")
          .values({
            scope: CACHE_SCOPE,
            key: params.key,
            value_json: params.valueJson,
            blob: null,
            expires_at: null,
            updated_at: params.updatedAt,
          })
          .onConflict((conflict) =>
            conflict.columns(["scope", "key"]).doUpdateSet({
              value_json: params.valueJson,
              blob: null,
              expires_at: null,
              updated_at: params.updatedAt,
            }),
          ),
      );
    },
    {
      agentId: normalizeAgentId(params.agentId),
      ...(params.databasePath ? { path: params.databasePath } : {}),
    },
    { operationLabel: `session-cost-usage.${params.key}.write` },
  );
}
function deleteCacheValueIfUnchanged(params) {
  runOpenClawAgentWriteTransaction(
    (database) => {
      const kysely = getNodeSqliteKysely(database.db);
      executeSqliteQuerySync(
        database.db,
        kysely
          .deleteFrom("cache_entries")
          .where("scope", "=", CACHE_SCOPE)
          .where("key", "=", params.key)
          .where("value_json", "=", params.valueJson),
      );
    },
    {
      agentId: normalizeAgentId(params.agentId),
      ...(params.databasePath ? { path: params.databasePath } : {}),
    },
    { operationLabel: `session-cost-usage.${params.key}.delete` },
  );
}
function readSessionCostUsageCacheJson(agentId, databasePath) {
  return readCacheValue(agentId, CACHE_KEY, databasePath);
}
function writeSessionCostUsageCacheJson(params) {
  upsertCacheValue({
    ...params,
    key: CACHE_KEY,
  });
}
function parseRefreshLock(raw) {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    if (
      !value ||
      typeof value.pid !== "number" ||
      !Number.isInteger(value.pid) ||
      value.pid <= 0 ||
      typeof value.startedAt !== "number" ||
      !Number.isFinite(value.startedAt) ||
      typeof value.ownerNonce !== "string" ||
      !value.ownerNonce
    )
      return null;
    return {
      pid: value.pid,
      startedAt: value.startedAt,
      ownerNonce: value.ownerNonce,
    };
  } catch {
    return null;
  }
}
function isProcessRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === "EPERM";
  }
}
function isSessionCostUsageRefreshRunning(agentId, databasePath) {
  const raw = readCacheValue(agentId, REFRESH_LOCK_KEY, databasePath);
  const lock = parseRefreshLock(raw);
  if (lock && isProcessRunning(lock.pid)) return true;
  if (raw !== null)
    deleteCacheValueIfUnchanged({
      agentId,
      databasePath,
      key: REFRESH_LOCK_KEY,
      valueJson: raw,
    });
  return false;
}
function acquireSessionCostUsageRefreshLock(agentId, databasePath) {
  const previousRaw = readCacheValue(agentId, REFRESH_LOCK_KEY, databasePath);
  const previousLock = parseRefreshLock(previousRaw);
  const previousOwnerIsRunning = previousLock ? isProcessRunning(previousLock.pid) : false;
  const lock = {
    pid: process.pid,
    startedAt: Date.now(),
    ownerNonce: `${process.pid}:${Date.now()}:${process.hrtime.bigint()}`,
  };
  const lockJson = JSON.stringify(lock);
  const acquired = runOpenClawAgentWriteTransaction(
    (database) => {
      const kysely = getNodeSqliteKysely(database.db);
      if (
        (executeSqliteQuerySync(
          database.db,
          kysely
            .selectFrom("cache_entries")
            .select("value_json")
            .where("scope", "=", CACHE_SCOPE)
            .where("key", "=", REFRESH_LOCK_KEY)
            .limit(1),
        ).rows[0]?.value_json ?? null) !== previousRaw ||
        previousOwnerIsRunning
      )
        return false;
      executeSqliteQuerySync(
        database.db,
        kysely
          .insertInto("cache_entries")
          .values({
            scope: CACHE_SCOPE,
            key: REFRESH_LOCK_KEY,
            value_json: lockJson,
            blob: null,
            expires_at: null,
            updated_at: lock.startedAt,
          })
          .onConflict((conflict) =>
            conflict.columns(["scope", "key"]).doUpdateSet({
              value_json: lockJson,
              blob: null,
              expires_at: null,
              updated_at: lock.startedAt,
            }),
          ),
      );
      return true;
    },
    {
      agentId: normalizeAgentId(agentId),
      ...(databasePath ? { path: databasePath } : {}),
    },
    { operationLabel: "session-cost-usage.refresh-lock.acquire" },
  );
  return {
    acquired,
    release: () => {
      if (acquired)
        deleteCacheValueIfUnchanged({
          agentId,
          databasePath,
          key: REFRESH_LOCK_KEY,
          valueJson: lockJson,
        });
    },
  };
}
//#endregion
//#region src/infra/session-cost-usage-totals.ts
function createEmptyCostUsageTotals() {
  return {
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheWrite: 0,
    totalTokens: 0,
    totalCost: 0,
    inputCost: 0,
    outputCost: 0,
    cacheReadCost: 0,
    cacheWriteCost: 0,
    missingCostEntries: 0,
  };
}
function cloneCostUsageTotals(totals) {
  return {
    input: totals.input,
    output: totals.output,
    cacheRead: totals.cacheRead,
    cacheWrite: totals.cacheWrite,
    totalTokens: totals.totalTokens,
    totalCost: totals.totalCost,
    inputCost: totals.inputCost,
    outputCost: totals.outputCost,
    cacheReadCost: totals.cacheReadCost,
    cacheWriteCost: totals.cacheWriteCost,
    missingCostEntries: totals.missingCostEntries,
  };
}
function addCostUsageTotals(target, source) {
  target.input += source.input;
  target.output += source.output;
  target.cacheRead += source.cacheRead;
  target.cacheWrite += source.cacheWrite;
  target.totalTokens += source.totalTokens;
  target.totalCost += source.totalCost;
  target.inputCost += source.inputCost;
  target.outputCost += source.outputCost;
  target.cacheReadCost += source.cacheReadCost;
  target.cacheWriteCost += source.cacheWriteCost;
  target.missingCostEntries += source.missingCostEntries;
}
//#endregion
//#region src/infra/session-cost-usage.ts
const USAGE_COST_CACHE_VERSION = 7;
const USAGE_COST_TRANSCRIPT_STAT_CONCURRENCY = 32;
const USAGE_COST_CACHE_CHECKPOINT_FILES = 256;
const USAGE_COST_CACHE_CHECKPOINT_INTERVAL_MS = 5e3;
const logger = createSubsystemLogger("usage-cost-cache");
const usageCostRefreshes = /* @__PURE__ */ new Map();
function resolveUsageCostCacheDatabasePath(agentId) {
  return resolveOpenClawAgentSqlitePath({ agentId: normalizeAgentId(agentId) });
}
function resolveUsageCostPricingFingerprint(config) {
  return resolveModelCostConfigFingerprint(config);
}
function resolveUsageCostSessionStorePath(params) {
  return params?.sessionsDir
    ? path.join(params.sessionsDir, "sessions.json")
    : resolveDefaultSessionStorePath(params?.agentId);
}
function createEmptyUsageCostCache(pricingFingerprint) {
  return {
    version: USAGE_COST_CACHE_VERSION,
    updatedAt: 0,
    pricingFingerprint,
    files: {},
  };
}
function normalizeUsageCostCache(raw, pricingFingerprint) {
  if (!raw || typeof raw !== "object") return createEmptyUsageCostCache(pricingFingerprint);
  const record = raw;
  if (
    record.version !== USAGE_COST_CACHE_VERSION ||
    typeof record.pricingFingerprint !== "string" ||
    record.pricingFingerprint !== pricingFingerprint ||
    !record.files ||
    typeof record.files !== "object"
  )
    return createEmptyUsageCostCache(pricingFingerprint);
  return {
    version: USAGE_COST_CACHE_VERSION,
    updatedAt: asFiniteNumber(record.updatedAt) ?? 0,
    pricingFingerprint: record.pricingFingerprint,
    files: record.files,
  };
}
function readUsageCostCache(agentId, pricingFingerprint, databasePath) {
  try {
    const raw = readSessionCostUsageCacheJson(agentId, databasePath);
    if (!raw) return createEmptyUsageCostCache(pricingFingerprint);
    return normalizeUsageCostCache(JSON.parse(raw), pricingFingerprint);
  } catch {
    return createEmptyUsageCostCache(pricingFingerprint);
  }
}
function writeUsageCostCache(agentId, cache, databasePath) {
  writeSessionCostUsageCacheJson({
    agentId,
    databasePath,
    valueJson: JSON.stringify(cache),
    updatedAt: cache.updatedAt,
  });
}
async function listUsageCountedTranscriptFileStats(agentId, params) {
  const sessionsDir = params?.sessionsDir ?? resolveSessionTranscriptsDirForAgent(agentId);
  const { results } = await runTasksWithConcurrency({
    tasks: (await fs.promises.readdir(sessionsDir, { withFileTypes: true }).catch(() => []))
      .filter((entry) => entry.isFile() && isUsageCountedSessionTranscriptFileName(entry.name))
      .map((entry) => async () => {
        const filePath = path.join(sessionsDir, entry.name);
        const stats = await fs.promises.stat(filePath).catch(() => null);
        if (!stats) return;
        if (params?.minMtimeMs !== void 0 && stats.mtimeMs < params.minMtimeMs) return;
        if (filePath.endsWith(".zst"))
          try {
            const materialized = materializeSessionArchiveForRead(filePath);
            return {
              filePath: materialized,
              size: (await fs.promises.stat(materialized)).size,
              mtimeMs: stats.mtimeMs,
            };
          } catch {
            return;
          }
        return {
          filePath,
          size: stats.size,
          mtimeMs: stats.mtimeMs,
        };
      }),
    limit: USAGE_COST_TRANSCRIPT_STAT_CONCURRENCY,
  });
  return results.filter((file) => Boolean(file));
}
function listUsageCountedSqliteTranscriptStats(agentId, params) {
  const storePath = resolveUsageCostSessionStorePath({
    agentId,
    ...(params?.sessionsDir ? { sessionsDir: params.sessionsDir } : {}),
  });
  const files = [];
  for (const { entry } of listSessionEntries({ storePath })) {
    const marker = parseSqliteSessionFileMarker(entry.sessionFile);
    if (!marker) continue;
    const mtimeMs = asFiniteNumber(entry.updatedAt) ?? 0;
    if (params?.minMtimeMs !== void 0 && mtimeMs < params.minMtimeMs) continue;
    const stats = readTranscriptStatsSync({
      agentId: marker.agentId,
      sessionId: marker.sessionId,
      storePath: marker.storePath,
    });
    files.push({
      filePath: formatSqliteSessionFileMarker(marker),
      mtimeMs,
      sessionId: marker.sessionId,
      size: stats.sizeBytes,
    });
  }
  return files;
}
async function listUsageCountedTranscriptFiles(agentId, params) {
  return await listUsageCountedTranscriptStats(agentId, params);
}
async function listUsageCountedTranscriptStats(agentId, params) {
  const fileBacked = await listUsageCountedTranscriptFileStats(agentId, params);
  const sqliteBacked = listUsageCountedSqliteTranscriptStats(agentId, params);
  const sqliteSessionIds = new Set(sqliteBacked.map((file) => file.sessionId).filter(Boolean));
  return [
    ...fileBacked.filter((file) => {
      const sessionId = parseUsageCountedSessionIdFromFileName(path.basename(file.filePath));
      return !sessionId || !sqliteSessionIds.has(sessionId);
    }),
    ...sqliteBacked,
  ];
}
async function resolveUsageCostTranscriptFile(sessionFile) {
  const marker = parseSqliteSessionFileMarker(sessionFile);
  if (marker) {
    const entry = listSessionEntries({ storePath: marker.storePath }).find(
      ({ entry: sessionEntry }) => sessionEntry.sessionId === marker.sessionId,
    )?.entry;
    const stats = readTranscriptStatsSync({
      agentId: marker.agentId,
      sessionId: marker.sessionId,
      storePath: marker.storePath,
    });
    return {
      filePath: formatSqliteSessionFileMarker(marker),
      mtimeMs: asFiniteNumber(entry?.updatedAt) ?? 0,
      sessionId: marker.sessionId,
      size: stats.sizeBytes,
    };
  }
  if (sessionFile.endsWith(".zst"))
    try {
      const materialized = materializeSessionArchiveForRead(sessionFile);
      const materializedStats = await fs.promises.stat(materialized);
      return {
        filePath: materialized,
        size: materializedStats.size,
        mtimeMs: materializedStats.mtimeMs,
      };
    } catch {
      return;
    }
  const stats = await fs.promises.stat(sessionFile).catch(() => null);
  return stats
    ? {
        filePath: sessionFile,
        size: stats.size,
        mtimeMs: stats.mtimeMs,
      }
    : void 0;
}
function isUsageCostCacheEntryFresh(params) {
  return Boolean(
    params.entry &&
    params.entry.size === params.file.size &&
    params.entry.mtimeMs === params.file.mtimeMs &&
    (!params.requireSessionSummary || params.entry.sessionSummary),
  );
}
function canUseUsageCostCacheEntryForPartial(params) {
  return Boolean(
    params.entry &&
    params.entry.size <= params.file.size &&
    params.entry.mtimeMs <= params.file.mtimeMs,
  );
}
function getUsageCostStaleFiles(params) {
  const sessionSummaryFiles = params.sessionSummaryFiles ?? /* @__PURE__ */ new Set();
  return params.files.filter(
    (file) =>
      !isUsageCostCacheEntryFresh({
        entry: params.cache.files[file.filePath],
        file,
        requireSessionSummary: sessionSummaryFiles.has(file.filePath),
      }),
  );
}
function countUsableUsageCostCacheFiles(params) {
  const filesByPath = new Map(params.files.map((file) => [file.filePath, file]));
  let cachedFiles = 0;
  for (const [filePath, entry] of Object.entries(params.cache.files)) {
    const file = filesByPath.get(filePath);
    if (
      file &&
      canUseUsageCostCacheEntryForPartial({
        entry,
        file,
      })
    )
      cachedFiles += 1;
  }
  return cachedFiles;
}
function buildCostUsageSummaryFromCache(params) {
  const dailyMap = /* @__PURE__ */ new Map();
  const formatDayKey = createUsageDayKeyFormatter(params.dayBucket);
  const totals = createEmptyCostUsageTotals();
  const filesByPath = new Map(params.files.map((file) => [file.filePath, file]));
  const staleFiles = getUsageCostStaleFiles({
    cache: params.cache,
    files: params.files,
  });
  const cachedFiles = countUsableUsageCostCacheFiles({
    cache: params.cache,
    files: params.files,
  });
  for (const [filePath, entry] of Object.entries(params.cache.files)) {
    const file = filesByPath.get(filePath);
    if (
      !file ||
      !canUseUsageCostCacheEntryForPartial({
        entry,
        file,
      })
    )
      continue;
    for (const usageEntry of entry.usageEntries) {
      if (usageEntry.timestamp < params.startMs || usageEntry.timestamp > params.endMs) continue;
      const date = formatDayKey(new Date(usageEntry.timestamp));
      const bucket = dailyMap.get(date) ?? createEmptyCostUsageTotals();
      addCostUsageTotals(bucket, usageEntry);
      dailyMap.set(date, bucket);
      addCostUsageTotals(totals, usageEntry);
    }
  }
  fillMissingDays(dailyMap, params.startMs, params.endMs, formatDayKey);
  const daily = Array.from(dailyMap.entries())
    .map(([date, bucket]) => Object.assign({ date }, bucket))
    .toSorted((a, b) => a.date.localeCompare(b.date));
  const days = countCalendarDays(params.startMs, params.endMs, formatDayKey);
  const status = params.refreshing
    ? "refreshing"
    : staleFiles.length > 0
      ? cachedFiles > 0
        ? "partial"
        : "stale"
      : "fresh";
  return {
    updatedAt: Date.now(),
    days,
    daily,
    totals,
    cacheStatus: {
      status,
      cachedFiles,
      pendingFiles: staleFiles.length,
      staleFiles: staleFiles.length,
      refreshedAt: params.cache.updatedAt || void 0,
    },
  };
}
function isSessionSummaryContainedInRange(summary, startMs, endMs) {
  return (
    (summary.firstActivity === void 0 || summary.firstActivity >= startMs) &&
    (summary.lastActivity === void 0 || summary.lastActivity <= endMs)
  );
}
function buildSessionCostSummaryFromCacheEntry(params) {
  if (!params.entry.transcriptEntries) return null;
  const totals = createEmptyCostUsageTotals();
  const activityDatesSet = /* @__PURE__ */ new Set();
  const dailyMap = /* @__PURE__ */ new Map();
  const dailyMessageMap = /* @__PURE__ */ new Map();
  const utcQuarterHourMessageMap = /* @__PURE__ */ new Map();
  const utcQuarterHourTokenMap = /* @__PURE__ */ new Map();
  const dailyLatencyMap = /* @__PURE__ */ new Map();
  const dailyModelUsageMap = /* @__PURE__ */ new Map();
  const formatDayKey = params.formatDayKey;
  const messageCounts = {
    total: 0,
    user: 0,
    assistant: 0,
    toolCalls: 0,
    toolResults: 0,
    errors: 0,
  };
  const toolUsageMap = /* @__PURE__ */ new Map();
  const modelUsageMap = /* @__PURE__ */ new Map();
  const errorStopReasons = /* @__PURE__ */ new Set(["error", "aborted", "timeout"]);
  const latencyValues = [];
  let firstActivity;
  let lastActivity;
  let lastUserTimestamp;
  const maxLatencyMs = 720 * 60 * 1e3;
  for (const entry of params.entry.transcriptEntries) {
    const ts = entry.timestamp;
    if (ts !== void 0 && ts < params.startMs) continue;
    if (ts !== void 0 && ts > params.endMs) continue;
    const date = ts === void 0 ? void 0 : new Date(ts);
    const dayKey = date ? formatDayKey(date) : void 0;
    const quarterBucket = date ? getUtcQuarterHourBucketKey(date) : void 0;
    if (ts !== void 0) {
      firstActivity = firstActivity === void 0 ? ts : Math.min(firstActivity, ts);
      lastActivity = lastActivity === void 0 ? ts : Math.max(lastActivity, ts);
    }
    if (entry.role === "user") {
      messageCounts.user += 1;
      messageCounts.total += 1;
      if (ts !== void 0) lastUserTimestamp = ts;
    }
    if (entry.role === "assistant") {
      messageCounts.assistant += 1;
      messageCounts.total += 1;
      if (ts !== void 0) {
        const latencyMs =
          entry.durationMs ??
          (lastUserTimestamp !== void 0 ? Math.max(0, ts - lastUserTimestamp) : void 0);
        if (
          latencyMs !== void 0 &&
          Number.isFinite(latencyMs) &&
          latencyMs <= maxLatencyMs &&
          dayKey !== void 0
        ) {
          latencyValues.push(latencyMs);
          const dailyLatencies = dailyLatencyMap.get(dayKey) ?? [];
          dailyLatencies.push(latencyMs);
          dailyLatencyMap.set(dayKey, dailyLatencies);
        }
      }
    }
    if (entry.toolNames.length > 0) {
      messageCounts.toolCalls += entry.toolNames.length;
      for (const name of entry.toolNames) toolUsageMap.set(name, (toolUsageMap.get(name) ?? 0) + 1);
    }
    if (entry.toolResultCounts.total > 0) {
      messageCounts.toolResults += entry.toolResultCounts.total;
      messageCounts.errors += entry.toolResultCounts.errors;
    }
    if (entry.stopReason && errorStopReasons.has(entry.stopReason)) messageCounts.errors += 1;
    if (dayKey !== void 0 && quarterBucket) {
      activityDatesSet.add(dayKey);
      const daily = dailyMessageMap.get(dayKey) ?? {
        date: dayKey,
        total: 0,
        user: 0,
        assistant: 0,
        toolCalls: 0,
        toolResults: 0,
        errors: 0,
      };
      daily.total += entry.role === "user" || entry.role === "assistant" ? 1 : 0;
      if (entry.role === "user") daily.user += 1;
      else if (entry.role === "assistant") daily.assistant += 1;
      daily.toolCalls += entry.toolNames.length;
      daily.toolResults += entry.toolResultCounts.total;
      daily.errors += entry.toolResultCounts.errors;
      if (entry.stopReason && errorStopReasons.has(entry.stopReason)) daily.errors += 1;
      dailyMessageMap.set(dayKey, daily);
      const utcQuarterHour = utcQuarterHourMessageMap.get(quarterBucket.key) ?? {
        date: quarterBucket.date,
        quarterIndex: quarterBucket.quarterIndex,
        total: 0,
        user: 0,
        assistant: 0,
        toolCalls: 0,
        toolResults: 0,
        errors: 0,
      };
      utcQuarterHour.total += entry.role === "user" || entry.role === "assistant" ? 1 : 0;
      if (entry.role === "user") utcQuarterHour.user += 1;
      else if (entry.role === "assistant") utcQuarterHour.assistant += 1;
      utcQuarterHour.toolCalls += entry.toolNames.length;
      utcQuarterHour.toolResults += entry.toolResultCounts.total;
      utcQuarterHour.errors += entry.toolResultCounts.errors;
      if (entry.stopReason && errorStopReasons.has(entry.stopReason)) utcQuarterHour.errors += 1;
      utcQuarterHourMessageMap.set(quarterBucket.key, utcQuarterHour);
    }
    const usageTotals = entry.usageTotals;
    if (!usageTotals) continue;
    addCostUsageTotals(totals, usageTotals);
    if (dayKey !== void 0 && quarterBucket) {
      const componentTokens =
        usageTotals.input + usageTotals.output + usageTotals.cacheRead + usageTotals.cacheWrite;
      const existingDaily = dailyMap.get(dayKey) ?? {
        tokens: 0,
        cost: 0,
      };
      existingDaily.tokens += componentTokens;
      existingDaily.cost += usageTotals.totalCost;
      dailyMap.set(dayKey, existingDaily);
      const utcQuarterHourToken = utcQuarterHourTokenMap.get(quarterBucket.key) ?? {
        date: quarterBucket.date,
        quarterIndex: quarterBucket.quarterIndex,
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0,
        totalTokens: 0,
        totalCost: 0,
      };
      utcQuarterHourToken.input += usageTotals.input;
      utcQuarterHourToken.output += usageTotals.output;
      utcQuarterHourToken.cacheRead += usageTotals.cacheRead;
      utcQuarterHourToken.cacheWrite += usageTotals.cacheWrite;
      utcQuarterHourToken.totalTokens += usageTotals.totalTokens;
      utcQuarterHourToken.totalCost += usageTotals.totalCost;
      utcQuarterHourTokenMap.set(quarterBucket.key, utcQuarterHourToken);
      if (entry.provider || entry.model) {
        const dailyModelKey = `${dayKey}::${entry.provider ?? "unknown"}::${entry.model ?? "unknown"}`;
        const dailyModel = dailyModelUsageMap.get(dailyModelKey) ?? {
          date: dayKey,
          provider: entry.provider,
          model: entry.model,
          tokens: 0,
          cost: 0,
          count: 0,
        };
        dailyModel.tokens += componentTokens;
        dailyModel.cost += usageTotals.totalCost;
        dailyModel.count += 1;
        dailyModelUsageMap.set(dailyModelKey, dailyModel);
      }
    }
    if (entry.provider || entry.model) {
      const modelKey = `${entry.provider ?? "unknown"}::${entry.model ?? "unknown"}`;
      const modelUsage = modelUsageMap.get(modelKey) ?? {
        provider: entry.provider,
        model: entry.model,
        count: 0,
        totals: createEmptyCostUsageTotals(),
      };
      modelUsage.count += 1;
      addCostUsageTotals(modelUsage.totals, usageTotals);
      modelUsageMap.set(modelKey, modelUsage);
    }
  }
  const dailyBreakdown = Array.from(dailyMap.entries())
    .map(([date, data]) => ({
      date,
      tokens: data.tokens,
      cost: data.cost,
    }))
    .toSorted((a, b) => a.date.localeCompare(b.date));
  const dailyMessageCounts = Array.from(dailyMessageMap.values()).toSorted((a, b) =>
    a.date.localeCompare(b.date),
  );
  const utcQuarterHourMessageCounts = Array.from(utcQuarterHourMessageMap.values()).toSorted(
    (a, b) => a.date.localeCompare(b.date) || a.quarterIndex - b.quarterIndex,
  );
  const utcQuarterHourTokenUsage = Array.from(utcQuarterHourTokenMap.values()).toSorted(
    (a, b) => a.date.localeCompare(b.date) || a.quarterIndex - b.quarterIndex,
  );
  const dailyLatency = Array.from(dailyLatencyMap.entries())
    .map(([date, values]) => {
      const stats = computeLatencyStats(values);
      if (!stats) return null;
      return Object.assign({ date }, stats);
    })
    .filter((entry) => Boolean(entry))
    .toSorted((a, b) => a.date.localeCompare(b.date));
  const dailyModelUsage = Array.from(dailyModelUsageMap.values()).toSorted(
    (a, b) => a.date.localeCompare(b.date) || b.cost - a.cost,
  );
  const toolUsage = toolUsageMap.size
    ? {
        totalCalls: Array.from(toolUsageMap.values()).reduce((sum, count) => sum + count, 0),
        uniqueTools: toolUsageMap.size,
        tools: Array.from(toolUsageMap.entries())
          .map(([name, count]) => ({
            name,
            count,
          }))
          .toSorted((a, b) => b.count - a.count),
      }
    : void 0;
  const modelUsage = Array.from(modelUsageMap.values()).toSorted((a, b) => {
    const costDiff = (b.totals?.totalCost ?? 0) - (a.totals?.totalCost ?? 0);
    if (costDiff !== 0) return costDiff;
    return (b.totals?.totalTokens ?? 0) - (a.totals?.totalTokens ?? 0);
  });
  return {
    sessionId: params.sessionId,
    sessionFile: params.sessionFile,
    firstActivity,
    lastActivity,
    durationMs:
      firstActivity !== void 0 && lastActivity !== void 0
        ? Math.max(0, lastActivity - firstActivity)
        : void 0,
    activityDates: Array.from(activityDatesSet).toSorted(),
    dailyBreakdown,
    dailyMessageCounts,
    utcQuarterHourMessageCounts: utcQuarterHourMessageCounts.length
      ? utcQuarterHourMessageCounts
      : void 0,
    utcQuarterHourTokenUsage: utcQuarterHourTokenUsage.length ? utcQuarterHourTokenUsage : void 0,
    dailyLatency: dailyLatency.length ? dailyLatency : void 0,
    dailyModelUsage: dailyModelUsage.length ? dailyModelUsage : void 0,
    messageCounts,
    toolUsage,
    modelUsage: modelUsage.length ? modelUsage : void 0,
    latency: computeLatencyStats(latencyValues),
    ...totals,
  };
}
const normalizeUsageCostTotalOrigin = (value) => (value === "provider-billed" ? value : void 0);
const extractCostBreakdown = (usageRaw) => {
  if (!usageRaw || typeof usageRaw !== "object") return;
  const cost = usageRaw.cost;
  if (!cost) return;
  const total = asFiniteNumber(cost.total);
  if (total === void 0 || total < 0) return;
  return {
    total,
    input: asFiniteNumber(cost.input),
    output: asFiniteNumber(cost.output),
    cacheRead: asFiniteNumber(cost.cacheRead),
    cacheWrite: asFiniteNumber(cost.cacheWrite),
    totalOrigin: normalizeUsageCostTotalOrigin(cost.totalOrigin),
  };
};
const parseTimestamp = (entry) => {
  const message = entry.message;
  const messageTimestamp = asFiniteNumber(message?.timestamp);
  if (messageTimestamp !== void 0) {
    const parsed = new Date(messageTimestamp);
    if (!Number.isNaN(parsed.valueOf())) return parsed;
  }
  const raw = entry.timestamp;
  if (typeof raw === "string") {
    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.valueOf())) return parsed;
  }
};
const parseTranscriptEntry = (entry) => {
  const message = entry.message;
  if (!message || typeof message !== "object") return null;
  const roleRaw = message.role;
  const role = roleRaw === "user" || roleRaw === "assistant" ? roleRaw : void 0;
  if (!role) return null;
  const usageRaw = message.usage ?? entry.usage;
  const usage = usageRaw ? (normalizeUsage(usageRaw) ?? void 0) : void 0;
  const provider =
    (typeof message.provider === "string" ? message.provider : void 0) ??
    (typeof entry.provider === "string" ? entry.provider : void 0);
  const model =
    (typeof message.model === "string" ? message.model : void 0) ??
    (typeof entry.model === "string" ? entry.model : void 0);
  const costBreakdown = extractCostBreakdown(usageRaw);
  const stopReason = typeof message.stopReason === "string" ? message.stopReason : void 0;
  const durationMs = asFiniteNumber(message.durationMs ?? entry.durationMs);
  return {
    message,
    role,
    timestamp: parseTimestamp(entry),
    durationMs,
    usage,
    costTotal: costBreakdown?.total,
    costBreakdown,
    provider,
    model,
    stopReason,
    toolNames: extractToolCallNames(message),
    toolResultCounts: countToolResults(message),
  };
};
const formatUtcDayKey = (date) =>
  `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
const createUsageDayKeyFormatter = (dayBucket) => {
  if (dayBucket?.mode === "utc-offset")
    return (date) =>
      formatUtcDayKey(new Date(date.getTime() + dayBucket.utcOffsetMinutes * 60 * 1e3));
  return createTimeZoneDayKeyFormatter(
    dayBucket?.mode === "time-zone"
      ? dayBucket.timeZone
      : Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
};
/**
 * Maximum window (in days) for which we will zero-fill missing calendar
 * days. Bounded ranges from the UI's range filter top out at 90 days for
 * the explicit picker and "All" is the wildcard escape hatch — anything
 * wider than this threshold is treated as an all-time / open-ended range
 * and falls back to sparse behavior (only days with activity), since a
 * dense series at that scale would produce tens of thousands of zero
 * buckets (e.g. a 1970-based startMs → ~20k entries) without any user
 * value. 366 days covers a full year + leap-day cushion.
 */
const MAX_ZERO_FILL_DAYS = 366;
/**
 * Parse a `YYYY-MM-DD` day key into its UTC calendar-day timestamp. The
 * timestamp is only used to enumerate calendar labels; usage timestamps stay
 * in their requested timezone bucket.
 */
const parseDayKeyToUtcMs = (dayKey) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dayKey);
  if (!match) return null;
  const year = Number(match[1]);
  const monthIdx = Number(match[2]) - 1;
  const day = Number(match[3]);
  const dayMs = Date.UTC(year, monthIdx, day);
  const date = new Date(dayMs);
  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === monthIdx &&
    date.getUTCDate() === day
    ? dayMs
    : null;
};
/**
 * Ensure the daily map has an entry for every calendar day in [startMs, endMs].
 * Days without activity are inserted with a zero-valued totals bucket so the
 * resulting `daily` series matches the requested range length (one bar per
 * calendar day) instead of only covering days with recorded usage.
 *
 * Day keys must use the same calendar zone as the request range. Otherwise a
 * remote Gateway can return local-date labels for UTC/browser-local ranges,
 * which drops boundary usage when the UI compares calendar windows.
 */
const fillMissingDays = (dailyMap, startMs, endMs, formatDayKey) => {
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs < startMs) return;
  const dayMs = 1440 * 60 * 1e3;
  const startKey = formatDayKey(new Date(startMs));
  const endKey = formatDayKey(new Date(endMs));
  const startDayMs = parseDayKeyToUtcMs(startKey);
  const endDayMs = parseDayKeyToUtcMs(endKey);
  if (startDayMs === null || endDayMs === null) {
    if (!dailyMap.has(startKey)) dailyMap.set(startKey, createEmptyCostUsageTotals());
    if (!dailyMap.has(endKey)) dailyMap.set(endKey, createEmptyCostUsageTotals());
    return;
  }
  if (Math.floor((endDayMs - startDayMs) / dayMs) + 1 > MAX_ZERO_FILL_DAYS) return;
  const maxIterations = 367;
  for (let cursorMs = startDayMs, i = 0; cursorMs <= endDayMs && i < maxIterations; i += 1) {
    const key = formatUtcDayKey(new Date(cursorMs));
    if (!dailyMap.has(key)) dailyMap.set(key, createEmptyCostUsageTotals());
    cursorMs += dayMs;
  }
  if (!dailyMap.has(endKey)) dailyMap.set(endKey, createEmptyCostUsageTotals());
};
const countCalendarDays = (startMs, endMs, formatDayKey) => {
  const startDayMs = parseDayKeyToUtcMs(formatDayKey(new Date(startMs)));
  const endDayMs = parseDayKeyToUtcMs(formatDayKey(new Date(endMs)));
  if (startDayMs === null || endDayMs === null || endDayMs < startDayMs)
    return Math.ceil((endMs - startMs) / (1440 * 60 * 1e3)) + 1;
  return Math.floor((endDayMs - startDayMs) / (1440 * 60 * 1e3)) + 1;
};
const getUtcQuarterHourBucketKey = (date) => {
  const quarterIndex = Math.floor((date.getUTCHours() * 60 + date.getUTCMinutes()) / 15);
  const utcDayKey = formatUtcDayKey(date);
  return {
    date: utcDayKey,
    quarterIndex,
    key: `${utcDayKey}::${quarterIndex}`,
  };
};
/**
 * Accumulate message-level counts into a bucket (daily or UTC quarter-hour).
 * Avoids duplicating the same logic for both daily and quarter-hour message counts.
 */
const accumulateMessageCounts = (bucket, entry, errorStopReasons) => {
  bucket.total += entry.role === "user" || entry.role === "assistant" ? 1 : 0;
  if (entry.role === "user") bucket.user += 1;
  else if (entry.role === "assistant") bucket.assistant += 1;
  bucket.toolCalls += entry.toolNames.length;
  bucket.toolResults += entry.toolResultCounts.total;
  bucket.errors += entry.toolResultCounts.errors;
  if (entry.stopReason && errorStopReasons.has(entry.stopReason)) bucket.errors += 1;
};
const computeLatencyStats = (values) => {
  if (!values.length) return;
  const sorted = values.toSorted((a, b) => a - b);
  const total = sorted.reduce((sum, v) => sum + v, 0);
  const count = sorted.length;
  const p95Index = Math.max(0, Math.ceil(count * 0.95) - 1);
  return {
    count,
    avgMs: total / count,
    p95Ms: sorted[p95Index] ?? expectDefined(sorted[count - 1], "last latency sample"),
    minMs: expectDefined(sorted[0], "sorted entry at 0"),
    maxMs: expectDefined(sorted[count - 1], "sorted entry at count 1"),
  };
};
const computeUsageTokenTotals = (usage) => {
  const input = usage.input ?? 0;
  const output = usage.output ?? 0;
  const cacheRead = usage.cacheRead ?? 0;
  const cacheWrite = usage.cacheWrite ?? 0;
  const componentTotal = input + output + cacheRead + cacheWrite;
  return {
    input,
    output,
    cacheRead,
    cacheWrite,
    componentTotal,
    totalTokens: usage.total ?? componentTotal,
  };
};
const applyUsageTotals = (totals, usage) => {
  const usageTotals = computeUsageTokenTotals(usage);
  totals.input += usageTotals.input;
  totals.output += usageTotals.output;
  totals.cacheRead += usageTotals.cacheRead;
  totals.cacheWrite += usageTotals.cacheWrite;
  totals.totalTokens += usageTotals.totalTokens;
};
const applyCostBreakdown = (totals, costBreakdown) => {
  if (costBreakdown === void 0 || costBreakdown.total === void 0) return;
  totals.totalCost += costBreakdown.total;
  totals.inputCost += costBreakdown.input ?? 0;
  totals.outputCost += costBreakdown.output ?? 0;
  totals.cacheReadCost += costBreakdown.cacheRead ?? 0;
  totals.cacheWriteCost += costBreakdown.cacheWrite ?? 0;
};
const applyCostTotal = (totals, costTotal) => {
  if (costTotal === void 0) {
    totals.missingCostEntries += 1;
    return;
  }
  totals.totalCost += costTotal;
};
const isModelPricingKnown = (cost) => {
  if (!cost) return false;
  if (cost.tieredPricing && cost.tieredPricing.length > 0) return true;
  return cost.input > 0 || cost.output > 0 || cost.cacheRead > 0 || cost.cacheWrite > 0;
};
const shouldPreserveRecordedZeroCost = (costBreakdown) =>
  costBreakdown?.total === 0 &&
  (costBreakdown.totalOrigin === "provider-billed" ||
    [
      costBreakdown.input,
      costBreakdown.output,
      costBreakdown.cacheRead,
      costBreakdown.cacheWrite,
    ].some((value) => value !== void 0 && value !== 0));
const shouldRecomputeRecordedZeroCost = (params) =>
  params.costTotal === 0 &&
  !shouldPreserveRecordedZeroCost(params.costBreakdown) &&
  isModelPricingKnown(params.cost) &&
  computeUsageTokenTotals(params.usage).totalTokens > 0;
function createUsageCostResolver(config) {
  const cache = /* @__PURE__ */ new Map();
  return ({ provider, model }) => {
    const key = `${provider ?? ""}\0${model ?? ""}`;
    if (cache.has(key)) return cache.get(key);
    const cost = resolveModelCostConfig({
      provider,
      model,
      config,
    });
    cache.set(key, cost);
    return cost;
  };
}
async function canReadJsonlFromOffset(filePath, startOffset) {
  if (startOffset <= 0) return true;
  const handle = await fs.promises.open(filePath, "r").catch(() => null);
  if (!handle) return false;
  try {
    const buffer = Buffer.alloc(1);
    return (await handle.read(buffer, 0, 1, startOffset - 1)).bytesRead === 1 && buffer[0] === 10;
  } finally {
    await handle.close().catch(() => void 0);
  }
}
async function* readJsonlRecords(filePath, startOffset = 0, endOffset) {
  if (endOffset !== void 0 && endOffset <= startOffset) return;
  const streamOptions = {
    encoding: "utf-8",
    start: Math.max(0, startOffset),
  };
  if (endOffset !== void 0) streamOptions.end = endOffset - 1;
  const fileStream = fs.createReadStream(filePath, streamOptions);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  try {
    for await (const line of rl) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const parsed = JSON.parse(trimmed);
        if (!parsed || typeof parsed !== "object") continue;
        yield parsed;
      } catch {}
    }
  } finally {
    rl.close();
    fileStream.destroy();
  }
}
function loadSqliteUsageTranscriptEvents(marker) {
  return selectVisibleTranscriptEvents(
    loadTranscriptEventsSync({
      agentId: marker.agentId,
      sessionId: marker.sessionId,
      storePath: marker.storePath,
    }),
  ).filter((event) => Boolean(event) && typeof event === "object" && !Array.isArray(event));
}
async function* readTranscriptRecords(filePath, startOffset = 0, endOffset) {
  const marker = parseSqliteSessionFileMarker(filePath);
  if (marker) {
    for (const event of loadSqliteUsageTranscriptEvents(marker)) yield event;
    return;
  }
  if (filePath.endsWith(".zst")) {
    yield* readJsonlRecords(materializeSessionArchiveForRead(filePath), startOffset, endOffset);
    return;
  }
  yield* readJsonlRecords(filePath, startOffset, endOffset);
}
async function* readTranscriptRecordsBestEffort(filePath) {
  try {
    yield* readTranscriptRecords(filePath);
  } catch {}
}
async function scanTranscriptFile(params) {
  const resolveCost = params.resolveCost ?? createUsageCostResolver(params.config);
  for await (const parsed of readTranscriptRecords(
    params.filePath,
    params.startOffset,
    params.endOffset,
  )) {
    const entry = parseTranscriptEntry(parsed);
    if (!entry) continue;
    if (entry.usage) {
      const cost = resolveCost({
        provider: entry.provider,
        model: entry.model,
      });
      const usageTotals = computeUsageTokenTotals(entry.usage);
      const pricingKnown = isModelPricingKnown(cost);
      const preserveRecordedZeroCost = shouldPreserveRecordedZeroCost(entry.costBreakdown);
      if (cost?.tieredPricing && cost.tieredPricing.length > 0 && !preserveRecordedZeroCost) {
        entry.costTotal = estimateUsageCost({
          usage: entry.usage,
          cost,
        });
        entry.costBreakdown = void 0;
      } else if (
        !pricingKnown &&
        !preserveRecordedZeroCost &&
        (entry.costTotal === void 0 || entry.costTotal === 0) &&
        usageTotals.totalTokens > 0
      ) {
        entry.costTotal = void 0;
        entry.costBreakdown = void 0;
      } else if (
        entry.costTotal === void 0 ||
        shouldRecomputeRecordedZeroCost({
          usage: entry.usage,
          cost,
          costBreakdown: entry.costBreakdown,
          costTotal: entry.costTotal,
        })
      ) {
        entry.costTotal = estimateUsageCost({
          usage: entry.usage,
          cost,
        });
        entry.costBreakdown = void 0;
      }
    }
    params.onEntry(entry);
  }
}
async function scanUsageFile(params) {
  await scanTranscriptFile({
    filePath: params.filePath,
    config: params.config,
    resolveCost: params.resolveCost,
    startOffset: params.startOffset,
    endOffset: params.endOffset,
    onEntry: (entry) => {
      if (!entry.usage) return;
      params.onEntry({
        usage: entry.usage,
        costTotal: entry.costTotal,
        costBreakdown: entry.costBreakdown,
        provider: entry.provider,
        model: entry.model,
        timestamp: entry.timestamp,
      });
    },
  });
}
function resolveExistingUsageSessionFile(params) {
  const sessionId = params.sessionId?.trim();
  const entryMarker = parseSqliteSessionFileMarker(params.sessionEntry?.sessionFile);
  const explicitMarker = parseSqliteSessionFileMarker(params.sessionFile);
  const sqliteMarker = entryMarker ?? explicitMarker;
  if (sqliteMarker) {
    if (sessionId && sqliteMarker.sessionId !== sessionId) return;
    return formatSqliteSessionFileMarker(sqliteMarker);
  }
  const candidate =
    params.sessionFile ??
    (sessionId
      ? resolveSessionFilePath(sessionId, params.sessionEntry, { agentId: params.agentId })
      : void 0);
  if (candidate && fs.existsSync(candidate)) return candidate;
  if (!sessionId) return candidate;
  try {
    const sessionsDir = candidate
      ? path.dirname(candidate)
      : resolveSessionTranscriptsDirForAgent(params.agentId);
    const baseFileName = `${sessionId}.jsonl`;
    const entries = fs.readdirSync(sessionsDir, { withFileTypes: true }).filter((entry) => {
      return (
        entry.isFile() &&
        (entry.name === baseFileName ||
          entry.name.startsWith(`${baseFileName}.reset.`) ||
          entry.name.startsWith(`${baseFileName}.deleted.`))
      );
    });
    const primary = entries.find((entry) => entry.name === baseFileName);
    if (primary) return path.join(sessionsDir, primary.name);
    const latestArchive = entries
      .filter((entry) => isSessionArchiveArtifactName(entry.name))
      .map((entry) => entry.name)
      .toSorted((a, b) => {
        const tsA =
          parseSessionArchiveTimestamp(a, "deleted") ??
          parseSessionArchiveTimestamp(a, "reset") ??
          0;
        return (
          (parseSessionArchiveTimestamp(b, "deleted") ??
            parseSessionArchiveTimestamp(b, "reset") ??
            0) - tsA || b.localeCompare(a)
        );
      })[0];
    return latestArchive ? path.join(sessionsDir, latestArchive) : candidate;
  } catch {
    return candidate;
  }
}
async function loadCostUsageSummary(params) {
  const now = /* @__PURE__ */ new Date();
  let sinceTime;
  let untilTime;
  if (params?.startMs !== void 0 && params?.endMs !== void 0) {
    sinceTime = params.startMs;
    untilTime = params.endMs;
  } else {
    const days = 30;
    const since = new Date(now);
    since.setDate(since.getDate() - (days - 1));
    sinceTime = since.getTime();
    untilTime = now.getTime();
  }
  const dailyMap = /* @__PURE__ */ new Map();
  const formatDayKey = createUsageDayKeyFormatter(params?.dayBucket);
  const totals = createEmptyCostUsageTotals();
  const resolveCost = createUsageCostResolver(params?.config);
  const files = await listUsageCountedTranscriptStats(params?.agentId, { minMtimeMs: sinceTime });
  for (const file of files)
    await scanUsageFile({
      filePath: file.filePath,
      config: params?.config,
      resolveCost,
      onEntry: (entry) => {
        const ts = entry.timestamp?.getTime();
        if (!ts || ts < sinceTime || ts > untilTime) return;
        const dayKey = formatDayKey(entry.timestamp ?? now);
        const bucket = dailyMap.get(dayKey) ?? createEmptyCostUsageTotals();
        applyUsageTotals(bucket, entry.usage);
        if (entry.costBreakdown?.total !== void 0) applyCostBreakdown(bucket, entry.costBreakdown);
        else applyCostTotal(bucket, entry.costTotal);
        dailyMap.set(dayKey, bucket);
        applyUsageTotals(totals, entry.usage);
        if (entry.costBreakdown?.total !== void 0) applyCostBreakdown(totals, entry.costBreakdown);
        else applyCostTotal(totals, entry.costTotal);
      },
    });
  fillMissingDays(dailyMap, sinceTime, untilTime, formatDayKey);
  const daily = Array.from(dailyMap.entries())
    .map(([date, bucket]) => Object.assign({ date }, bucket))
    .toSorted((a, b) => a.date.localeCompare(b.date));
  const days = countCalendarDays(sinceTime, untilTime, formatDayKey);
  return {
    updatedAt: Date.now(),
    days,
    daily,
    totals,
  };
}
async function scanUsageFileForCache(params) {
  const appendOnlyPreviousCandidate =
    params.previous &&
    params.previous.size > 0 &&
    params.previous.size < params.file.size &&
    params.previous.mtimeMs <= params.file.mtimeMs
      ? params.previous
      : void 0;
  const appendOnlyPrevious =
    appendOnlyPreviousCandidate &&
    (!params.includeSessionSummary || appendOnlyPreviousCandidate.transcriptEntries)
      ? appendOnlyPreviousCandidate
      : void 0;
  const totals = createEmptyCostUsageTotals();
  const usageEntries = [];
  const shouldTrackTranscriptEntries =
    params.includeSessionSummary || Boolean(appendOnlyPrevious?.transcriptEntries);
  const transcriptEntries = shouldTrackTranscriptEntries ? [] : void 0;
  let parsedRecords = 0;
  let countedRecords = 0;
  const startOffset =
    appendOnlyPrevious &&
    (await canReadJsonlFromOffset(params.file.filePath, appendOnlyPrevious.size))
      ? appendOnlyPrevious.size
      : void 0;
  await scanTranscriptFile({
    filePath: params.file.filePath,
    config: params.config,
    resolveCost: params.resolveCost,
    startOffset,
    endOffset: params.file.size,
    onEntry: (entry) => {
      const ts = entry.timestamp?.getTime();
      let entryTotals;
      if (entry.usage) {
        parsedRecords += 1;
        entryTotals = createEmptyCostUsageTotals();
        applyUsageTotals(entryTotals, entry.usage);
        if (entry.costBreakdown?.total !== void 0)
          applyCostBreakdown(entryTotals, entry.costBreakdown);
        else applyCostTotal(entryTotals, entry.costTotal);
        addCostUsageTotals(totals, entryTotals);
        if (ts !== void 0) {
          countedRecords += 1;
          usageEntries.push({
            timestamp: ts,
            provider: entry.provider,
            model: entry.model,
            ...entryTotals,
          });
        }
      }
      transcriptEntries?.push({
        timestamp: ts,
        role: entry.role,
        durationMs: entry.durationMs,
        provider: entry.provider,
        model: entry.model,
        stopReason: entry.stopReason,
        toolNames: entry.toolNames,
        toolResultCounts: entry.toolResultCounts,
        usageTotals: entryTotals ? cloneCostUsageTotals(entryTotals) : void 0,
      });
    },
  });
  const sessionId =
    parseSqliteSessionFileMarker(params.file.filePath)?.sessionId ??
    parseUsageCountedSessionIdFromFileName(path.basename(params.file.filePath)) ??
    void 0;
  const combinedTranscriptEntries = shouldTrackTranscriptEntries
    ? [
        ...((appendOnlyPrevious && startOffset !== void 0
          ? appendOnlyPrevious.transcriptEntries
          : void 0) ?? []),
        ...(transcriptEntries ?? []),
      ]
    : void 0;
  const sessionSummary =
    combinedTranscriptEntries &&
    (params.includeSessionSummary || appendOnlyPrevious?.sessionSummary)
      ? (buildSessionCostSummaryFromCacheEntry({
          entry: {
            size: params.file.size,
            mtimeMs: params.file.mtimeMs,
            scannedAt: Date.now(),
            parsedRecords,
            countedRecords,
            usageEntries,
            transcriptEntries: combinedTranscriptEntries,
            totals,
          },
          sessionId,
          sessionFile: params.file.filePath,
          startMs: Number.NEGATIVE_INFINITY,
          endMs: Number.POSITIVE_INFINITY,
          formatDayKey: createUsageDayKeyFormatter(),
        }) ?? void 0)
      : void 0;
  if (appendOnlyPrevious && startOffset !== void 0) {
    const previousTotals = cloneCostUsageTotals(appendOnlyPrevious.totals);
    addCostUsageTotals(previousTotals, totals);
    return {
      ...appendOnlyPrevious,
      size: params.file.size,
      mtimeMs: params.file.mtimeMs,
      scannedAt: Date.now(),
      parsedRecords: appendOnlyPrevious.parsedRecords + parsedRecords,
      countedRecords: appendOnlyPrevious.countedRecords + countedRecords,
      usageEntries: [...appendOnlyPrevious.usageEntries, ...usageEntries],
      transcriptEntries: combinedTranscriptEntries,
      totals: previousTotals,
      sessionSummary,
    };
  }
  return {
    size: params.file.size,
    mtimeMs: params.file.mtimeMs,
    scannedAt: Date.now(),
    parsedRecords,
    countedRecords,
    usageEntries,
    transcriptEntries: combinedTranscriptEntries,
    totals,
    sessionSummary,
  };
}
async function refreshCostUsageCacheForAgent(params) {
  const databasePath =
    params?.databasePath ??
    resolveOpenClawAgentSqlitePath({ agentId: normalizeAgentId(params?.agentId) });
  const lock = acquireSessionCostUsageRefreshLock(params?.agentId, databasePath);
  if (!lock.acquired) return "busy";
  try {
    const pricingFingerprint = resolveUsageCostPricingFingerprint(params?.config);
    const cache = readUsageCostCache(params?.agentId, pricingFingerprint, databasePath);
    const files = await listUsageCountedTranscriptFiles(params?.agentId, {
      sessionsDir: params?.sessionsDir,
    });
    let cacheMutated = cache.updatedAt === 0;
    const sessionSummaryFiles = new Set(params?.sessionFiles ?? []);
    const refreshStartMs = params?.startMs;
    const refreshFiles =
      sessionSummaryFiles.size > 0
        ? files.filter((file) => sessionSummaryFiles.has(file.filePath))
        : refreshStartMs === void 0
          ? files
          : files.filter((file) => file.mtimeMs >= refreshStartMs);
    const livePaths = new Set(files.map((file) => file.filePath));
    for (const filePath of Object.keys(cache.files))
      if (!livePaths.has(filePath)) {
        delete cache.files[filePath];
        cacheMutated = true;
      }
    const maxFiles =
      params?.maxFiles !== void 0 && Number.isFinite(params.maxFiles) && params.maxFiles > 0
        ? Math.floor(params.maxFiles)
        : void 0;
    const staleFiles = getUsageCostStaleFiles({
      cache,
      files: refreshFiles,
      sessionSummaryFiles,
    })
      .toSorted((a, b) => {
        return (
          (sessionSummaryFiles.has(a.filePath) ? 0 : 1) -
            (sessionSummaryFiles.has(b.filePath) ? 0 : 1) ||
          a.size - b.size ||
          a.filePath.localeCompare(b.filePath)
        );
      })
      .slice(0, maxFiles);
    const resolveCost = createUsageCostResolver(params?.config);
    let dirtyCount = 0;
    let lastCheckpointMs = Date.now();
    for (const file of staleFiles) {
      cache.files[file.filePath] = await scanUsageFileForCache({
        file,
        config: params?.config,
        resolveCost,
        previous: cache.files[file.filePath],
        includeSessionSummary: sessionSummaryFiles.has(file.filePath),
      });
      dirtyCount += 1;
      cacheMutated = true;
      const now = Date.now();
      if (
        dirtyCount >= USAGE_COST_CACHE_CHECKPOINT_FILES ||
        now - lastCheckpointMs >= USAGE_COST_CACHE_CHECKPOINT_INTERVAL_MS
      ) {
        cache.updatedAt = now;
        writeUsageCostCache(params?.agentId, cache, databasePath);
        dirtyCount = 0;
        lastCheckpointMs = Date.now();
      }
    }
    if (cacheMutated || dirtyCount > 0) {
      cache.updatedAt = Date.now();
      writeUsageCostCache(params?.agentId, cache, databasePath);
    }
    return "refreshed";
  } finally {
    lock.release();
  }
}
async function refreshCostUsageCache(params) {
  return await refreshCostUsageCacheForAgent(params);
}
async function loadCostUsageSummaryFromCache(params) {
  const databasePath = resolveUsageCostCacheDatabasePath(params.agentId);
  const refreshKey = databasePath;
  const pricingFingerprint = resolveUsageCostPricingFingerprint(params.config);
  let cache = readUsageCostCache(params.agentId, pricingFingerprint, databasePath);
  let files = await listUsageCountedTranscriptFiles(params.agentId);
  const staleFiles = getUsageCostStaleFiles({
    cache,
    files,
  });
  if (params.requestRefresh !== false && staleFiles.length > 0) {
    const cachedFiles = countUsableUsageCostCacheFiles({
      cache,
      files,
    });
    if (params.refreshMode === "sync-when-empty" && cachedFiles === 0) {
      const result = await refreshCostUsageCache({
        config: params.config,
        agentId: params.agentId,
        startMs: params.startMs,
      });
      cache = readUsageCostCache(params.agentId, pricingFingerprint, databasePath);
      files = await listUsageCountedTranscriptFiles(params.agentId);
      if (result === "refreshed") {
        if (
          getUsageCostStaleFiles({
            cache,
            files,
          }).length > 0
        )
          requestCostUsageCacheRefresh({
            config: params.config,
            agentId: params.agentId,
          });
      }
    } else
      requestCostUsageCacheRefresh({
        config: params.config,
        agentId: params.agentId,
      });
  }
  const refreshRunning = isSessionCostUsageRefreshRunning(params.agentId, databasePath);
  return buildCostUsageSummaryFromCache({
    cache,
    files,
    startMs: params.startMs,
    endMs: params.endMs,
    dayBucket: params.dayBucket,
    refreshing: usageCostRefreshes.has(refreshKey) || refreshRunning,
  });
}
async function loadSessionCostSummariesFromCache(params) {
  const databasePath = resolveUsageCostCacheDatabasePath(params.agentId);
  const pricingFingerprint = resolveUsageCostPricingFingerprint(params.config);
  const filesPromise = runTasksWithConcurrency({
    tasks: params.sessions.map(
      (session) => async () => await resolveUsageCostTranscriptFile(session.sessionFile),
    ),
    limit: USAGE_COST_TRANSCRIPT_STAT_CONCURRENCY,
  }).then(({ results }) => results);
  const cache = readUsageCostCache(params.agentId, pricingFingerprint, databasePath);
  const refreshRunning = isSessionCostUsageRefreshRunning(params.agentId, databasePath);
  const files = await filesPromise;
  const staleFiles = /* @__PURE__ */ new Set();
  let cachedFiles = 0;
  const requiresDailyRebucket = params.dayBucket !== void 0;
  let sharedFormatDayKey;
  const getFormatDayKey = () =>
    (sharedFormatDayKey ??= createUsageDayKeyFormatter(params.dayBucket));
  const summaries = params.sessions.map((session, index) => {
    const file = files[index];
    const entry = cache.files[session.sessionFile];
    if (
      !file ||
      !isUsageCostCacheEntryFresh({
        entry,
        file,
        requireSessionSummary: true,
      })
    ) {
      staleFiles.add(session.sessionFile);
      return null;
    }
    cachedFiles += 1;
    const summary = entry?.sessionSummary ?? null;
    if (
      summary &&
      params.startMs !== void 0 &&
      params.endMs !== void 0 &&
      (requiresDailyRebucket ||
        !isSessionSummaryContainedInRange(summary, params.startMs, params.endMs))
    )
      return entry
        ? buildSessionCostSummaryFromCacheEntry({
            entry,
            sessionId: session.sessionId,
            sessionFile: session.sessionFile,
            startMs: params.startMs,
            endMs: params.endMs,
            formatDayKey: getFormatDayKey(),
          })
        : null;
    return summary;
  });
  const refreshRequested = params.requestRefresh !== false && staleFiles.size > 0;
  if (refreshRequested)
    requestCostUsageCacheRefresh({
      config: params.config,
      agentId: params.agentId,
      sessionFiles: [...staleFiles],
    });
  const staleFileCount = staleFiles.size;
  return {
    summaries,
    cacheStatus: {
      status:
        staleFileCount === 0
          ? "fresh"
          : refreshRunning || refreshRequested
            ? "refreshing"
            : cachedFiles > 0
              ? "partial"
              : "stale",
      cachedFiles,
      pendingFiles: staleFileCount,
      staleFiles: staleFileCount,
      refreshedAt: cache.updatedAt || void 0,
    },
  };
}
function requestCostUsageCacheRefresh(params) {
  const databasePath = resolveUsageCostCacheDatabasePath(params?.agentId);
  const refreshKey = databasePath;
  const existing = usageCostRefreshes.get(refreshKey);
  if (existing) {
    mergeUsageCostRefreshRequest(existing, params);
    return;
  }
  const state = {
    agentId: params?.agentId,
    config: params?.config,
    databasePath,
    fullRefreshRequested: false,
    pendingSessionFiles: /* @__PURE__ */ new Set(),
    running: false,
    sessionsDir: resolveSessionTranscriptsDirForAgent(params?.agentId),
  };
  mergeUsageCostRefreshRequest(state, params);
  usageCostRefreshes.set(refreshKey, state);
  scheduleUsageCostRefresh(refreshKey, state);
}
function mergeUsageCostRefreshRequest(state, params) {
  if (params?.config) state.config = params.config;
  if (params?.agentId) state.agentId = params.agentId;
  if (!params?.sessionFiles) {
    state.fullRefreshRequested = true;
    return;
  }
  for (const sessionFile of params.sessionFiles) state.pendingSessionFiles.add(sessionFile);
}
function scheduleUsageCostRefresh(refreshKey, state, delayMs = 0) {
  if (state.running || state.timer) return;
  const timer = setTimeout(() => {
    state.timer = void 0;
    runQueuedUsageCostRefresh(refreshKey, state);
  }, delayMs);
  timer.unref?.();
  state.timer = timer;
}
async function runQueuedUsageCostRefresh(refreshKey, state) {
  state.running = true;
  let retryDelayMs = 0;
  try {
    while (state.fullRefreshRequested || state.pendingSessionFiles.size > 0) {
      const fullRefreshRequested = state.fullRefreshRequested;
      const sessionFiles = fullRefreshRequested ? [] : [...state.pendingSessionFiles];
      if (!fullRefreshRequested) state.pendingSessionFiles.clear();
      state.fullRefreshRequested = false;
      if (
        (await refreshCostUsageCacheForAgent({
          config: state.config,
          agentId: state.agentId,
          databasePath: state.databasePath,
          sessionsDir: state.sessionsDir,
          sessionFiles: fullRefreshRequested ? void 0 : sessionFiles,
        })) === "busy"
      ) {
        if (fullRefreshRequested) state.fullRefreshRequested = true;
        else for (const sessionFile of sessionFiles) state.pendingSessionFiles.add(sessionFile);
        retryDelayMs = 50;
        break;
      }
    }
  } catch (error) {
    logger.warn(`background refresh failed: ${formatErrorMessage(error)}`, { error });
  } finally {
    state.running = false;
    if (state.fullRefreshRequested || state.pendingSessionFiles.size > 0)
      scheduleUsageCostRefresh(refreshKey, state, retryDelayMs);
    else usageCostRefreshes.delete(refreshKey);
  }
}
/**
 * Scan all transcript files to discover sessions not in the session store.
 * Returns basic metadata for each discovered session.
 */
async function discoverAllSessions(params) {
  const files = await listUsageCountedTranscriptStats(params?.agentId, {
    minMtimeMs: params?.startMs,
  });
  const discovered = /* @__PURE__ */ new Map();
  for (const file of files) {
    const filePath = file.filePath;
    const fileName = path.basename(filePath);
    const sqliteMarker = parseSqliteSessionFileMarker(filePath);
    const sessionId = sqliteMarker?.sessionId ?? parseUsageCountedSessionIdFromFileName(fileName);
    if (!sessionId) continue;
    const isPrimaryTranscript = sqliteMarker ? true : isPrimarySessionTranscriptFileName(fileName);
    let firstUserMessage;
    if (params?.includeFirstUserMessage !== false)
      try {
        for await (const parsed of readTranscriptRecords(filePath))
          try {
            const message = parsed.message;
            if (message?.role === "user") {
              const content = message.content;
              if (typeof content === "string") firstUserMessage = truncateUtf16Safe(content, 100);
              else if (Array.isArray(content)) {
                for (const block of content)
                  if (typeof block === "object" && block && block.type === "text") {
                    const text = block.text;
                    if (typeof text === "string") firstUserMessage = truncateUtf16Safe(text, 100);
                    break;
                  }
              }
              break;
            }
          } catch {}
      } catch {}
    const existing = discovered.get(sessionId);
    const existingIsPrimary = existing
      ? isPrimarySessionTranscriptFileName(path.basename(existing.sessionFile))
      : false;
    if (
      !existing ||
      (isPrimaryTranscript && !existingIsPrimary) ||
      (isPrimaryTranscript === existingIsPrimary && file.mtimeMs >= existing.mtime)
    ) {
      discovered.set(sessionId, {
        sessionId,
        sessionFile: filePath,
        mtime: file.mtimeMs,
        firstUserMessage: firstUserMessage ?? existing?.firstUserMessage,
      });
      continue;
    }
    if (!existing.firstUserMessage && firstUserMessage) {
      existing.firstUserMessage = firstUserMessage;
      discovered.set(sessionId, existing);
    }
  }
  return Array.from(discovered.values()).toSorted((a, b) => b.mtime - a.mtime);
}
async function loadSessionCostSummary(params) {
  const sessionFile = resolveExistingUsageSessionFile(params);
  if (!sessionFile) return null;
  if (!parseSqliteSessionFileMarker(sessionFile) && !fs.existsSync(sessionFile)) return null;
  const totals = createEmptyCostUsageTotals();
  let firstActivity;
  let lastActivity;
  const activityDatesSet = /* @__PURE__ */ new Set();
  const dailyMap = /* @__PURE__ */ new Map();
  const dailyMessageMap = /* @__PURE__ */ new Map();
  const utcQuarterHourMessageMap = /* @__PURE__ */ new Map();
  const utcQuarterHourTokenMap = /* @__PURE__ */ new Map();
  const dailyLatencyMap = /* @__PURE__ */ new Map();
  const dailyModelUsageMap = /* @__PURE__ */ new Map();
  const formatDayKey = createUsageDayKeyFormatter(params.dayBucket);
  const messageCounts = {
    total: 0,
    user: 0,
    assistant: 0,
    toolCalls: 0,
    toolResults: 0,
    errors: 0,
  };
  const toolUsageMap = /* @__PURE__ */ new Map();
  const modelUsageMap = /* @__PURE__ */ new Map();
  const errorStopReasons = /* @__PURE__ */ new Set(["error", "aborted", "timeout"]);
  const latencyValues = [];
  let lastUserTimestamp;
  const MAX_LATENCY_MS = 720 * 60 * 1e3;
  const resolveCost = createUsageCostResolver(params.config);
  await scanTranscriptFile({
    filePath: sessionFile,
    config: params.config,
    resolveCost,
    onEntry: (entry) => {
      const timestamp = entry.timestamp;
      const ts = timestamp?.getTime();
      if (params.startMs !== void 0 && ts !== void 0 && ts < params.startMs) return;
      if (params.endMs !== void 0 && ts !== void 0 && ts > params.endMs) return;
      const dayKey = timestamp ? formatDayKey(timestamp) : void 0;
      const quarterBucket = timestamp ? getUtcQuarterHourBucketKey(timestamp) : void 0;
      if (ts !== void 0) {
        if (!firstActivity || ts < firstActivity) firstActivity = ts;
        if (!lastActivity || ts > lastActivity) lastActivity = ts;
      }
      if (entry.role === "user") {
        messageCounts.user += 1;
        messageCounts.total += 1;
        if (ts !== void 0) lastUserTimestamp = ts;
      }
      if (entry.role === "assistant") {
        messageCounts.assistant += 1;
        messageCounts.total += 1;
        if (ts !== void 0) {
          const latencyMs =
            entry.durationMs ??
            (lastUserTimestamp !== void 0 ? Math.max(0, ts - lastUserTimestamp) : void 0);
          if (
            latencyMs !== void 0 &&
            Number.isFinite(latencyMs) &&
            latencyMs <= MAX_LATENCY_MS &&
            dayKey !== void 0
          ) {
            latencyValues.push(latencyMs);
            const dailyLatencies = dailyLatencyMap.get(dayKey) ?? [];
            dailyLatencies.push(latencyMs);
            dailyLatencyMap.set(dayKey, dailyLatencies);
          }
        }
      }
      if (entry.toolNames.length > 0) {
        messageCounts.toolCalls += entry.toolNames.length;
        for (const name of entry.toolNames)
          toolUsageMap.set(name, (toolUsageMap.get(name) ?? 0) + 1);
      }
      if (entry.toolResultCounts.total > 0) {
        messageCounts.toolResults += entry.toolResultCounts.total;
        messageCounts.errors += entry.toolResultCounts.errors;
      }
      if (entry.stopReason && errorStopReasons.has(entry.stopReason)) messageCounts.errors += 1;
      if (dayKey !== void 0 && quarterBucket) {
        activityDatesSet.add(dayKey);
        const daily = dailyMessageMap.get(dayKey) ?? {
          date: dayKey,
          total: 0,
          user: 0,
          assistant: 0,
          toolCalls: 0,
          toolResults: 0,
          errors: 0,
        };
        accumulateMessageCounts(daily, entry, errorStopReasons);
        dailyMessageMap.set(dayKey, daily);
        const utcQuarterHour = utcQuarterHourMessageMap.get(quarterBucket.key) ?? {
          date: quarterBucket.date,
          quarterIndex: quarterBucket.quarterIndex,
          total: 0,
          user: 0,
          assistant: 0,
          toolCalls: 0,
          toolResults: 0,
          errors: 0,
        };
        accumulateMessageCounts(utcQuarterHour, entry, errorStopReasons);
        utcQuarterHourMessageMap.set(quarterBucket.key, utcQuarterHour);
      }
      if (!entry.usage) return;
      applyUsageTotals(totals, entry.usage);
      if (entry.costBreakdown?.total !== void 0) applyCostBreakdown(totals, entry.costBreakdown);
      else applyCostTotal(totals, entry.costTotal);
      if (dayKey !== void 0 && quarterBucket) {
        const entryTokenTotals = computeUsageTokenTotals(entry.usage);
        const entryTokens = entryTokenTotals.componentTotal;
        const entryCost =
          entry.costBreakdown?.total ??
          (entry.costBreakdown
            ? (entry.costBreakdown.input ?? 0) +
              (entry.costBreakdown.output ?? 0) +
              (entry.costBreakdown.cacheRead ?? 0) +
              (entry.costBreakdown.cacheWrite ?? 0)
            : (entry.costTotal ?? 0));
        const utcQuarterHourToken = utcQuarterHourTokenMap.get(quarterBucket.key) ?? {
          date: quarterBucket.date,
          quarterIndex: quarterBucket.quarterIndex,
          input: 0,
          output: 0,
          cacheRead: 0,
          cacheWrite: 0,
          totalTokens: 0,
          totalCost: 0,
        };
        utcQuarterHourToken.input += entryTokenTotals.input;
        utcQuarterHourToken.output += entryTokenTotals.output;
        utcQuarterHourToken.cacheRead += entryTokenTotals.cacheRead;
        utcQuarterHourToken.cacheWrite += entryTokenTotals.cacheWrite;
        utcQuarterHourToken.totalTokens += entryTokenTotals.totalTokens;
        utcQuarterHourToken.totalCost += entryCost;
        utcQuarterHourTokenMap.set(quarterBucket.key, utcQuarterHourToken);
        const existing = dailyMap.get(dayKey) ?? {
          tokens: 0,
          cost: 0,
        };
        dailyMap.set(dayKey, {
          tokens: existing.tokens + entryTokens,
          cost: existing.cost + entryCost,
        });
        if (entry.provider || entry.model) {
          const modelKey = `${dayKey}::${entry.provider ?? "unknown"}::${entry.model ?? "unknown"}`;
          const dailyModel = dailyModelUsageMap.get(modelKey) ?? {
            date: dayKey,
            provider: entry.provider,
            model: entry.model,
            tokens: 0,
            cost: 0,
            count: 0,
          };
          dailyModel.tokens += entryTokens;
          dailyModel.cost += entryCost;
          dailyModel.count += 1;
          dailyModelUsageMap.set(modelKey, dailyModel);
        }
      }
      if (entry.provider || entry.model) {
        const key = `${entry.provider ?? "unknown"}::${entry.model ?? "unknown"}`;
        const existing = modelUsageMap.get(key) ?? {
          provider: entry.provider,
          model: entry.model,
          count: 0,
          totals: createEmptyCostUsageTotals(),
        };
        existing.count += 1;
        applyUsageTotals(existing.totals, entry.usage);
        if (entry.costBreakdown?.total !== void 0)
          applyCostBreakdown(existing.totals, entry.costBreakdown);
        else applyCostTotal(existing.totals, entry.costTotal);
        modelUsageMap.set(key, existing);
      }
    },
  });
  const dailyBreakdown = Array.from(dailyMap.entries())
    .map(([date, data]) => ({
      date,
      tokens: data.tokens,
      cost: data.cost,
    }))
    .toSorted((a, b) => a.date.localeCompare(b.date));
  const dailyMessageCounts = Array.from(dailyMessageMap.values()).toSorted((a, b) =>
    a.date.localeCompare(b.date),
  );
  const utcQuarterHourMessageCounts = Array.from(utcQuarterHourMessageMap.values()).toSorted(
    (a, b) => a.date.localeCompare(b.date) || a.quarterIndex - b.quarterIndex,
  );
  const utcQuarterHourTokenUsage = Array.from(utcQuarterHourTokenMap.values()).toSorted(
    (a, b) => a.date.localeCompare(b.date) || a.quarterIndex - b.quarterIndex,
  );
  const dailyLatency = Array.from(dailyLatencyMap.entries())
    .map(([date, values]) => {
      const stats = computeLatencyStats(values);
      if (!stats) return null;
      return Object.assign({ date }, stats);
    })
    .filter((entry) => Boolean(entry))
    .toSorted((a, b) => a.date.localeCompare(b.date));
  const dailyModelUsage = Array.from(dailyModelUsageMap.values()).toSorted(
    (a, b) => a.date.localeCompare(b.date) || b.cost - a.cost,
  );
  const toolUsage = toolUsageMap.size
    ? {
        totalCalls: Array.from(toolUsageMap.values()).reduce((sum, count) => sum + count, 0),
        uniqueTools: toolUsageMap.size,
        tools: Array.from(toolUsageMap.entries())
          .map(([name, count]) => ({
            name,
            count,
          }))
          .toSorted((a, b) => b.count - a.count),
      }
    : void 0;
  const modelUsage = modelUsageMap.size
    ? Array.from(modelUsageMap.values()).toSorted((a, b) => {
        const costDiff = (b.totals?.totalCost ?? 0) - (a.totals?.totalCost ?? 0);
        if (costDiff !== 0) return costDiff;
        return (b.totals?.totalTokens ?? 0) - (a.totals?.totalTokens ?? 0);
      })
    : void 0;
  return {
    sessionId: params.sessionId,
    sessionFile,
    firstActivity,
    lastActivity,
    durationMs:
      firstActivity !== void 0 && lastActivity !== void 0
        ? Math.max(0, lastActivity - firstActivity)
        : void 0,
    activityDates: Array.from(activityDatesSet).toSorted(),
    dailyBreakdown,
    dailyMessageCounts,
    utcQuarterHourMessageCounts: utcQuarterHourMessageCounts.length
      ? utcQuarterHourMessageCounts
      : void 0,
    utcQuarterHourTokenUsage: utcQuarterHourTokenUsage.length ? utcQuarterHourTokenUsage : void 0,
    dailyLatency: dailyLatency.length ? dailyLatency : void 0,
    dailyModelUsage: dailyModelUsage.length ? dailyModelUsage : void 0,
    messageCounts,
    toolUsage,
    modelUsage,
    latency: computeLatencyStats(latencyValues),
    ...totals,
  };
}
async function loadSessionUsageTimeSeries(params) {
  const sessionFile = resolveExistingUsageSessionFile(params);
  if (!sessionFile) return null;
  if (!parseSqliteSessionFileMarker(sessionFile) && !fs.existsSync(sessionFile)) return null;
  if (params.maxPoints !== void 0 && params.maxPoints !== null) {
    if (!Number.isFinite(params.maxPoints) || params.maxPoints <= 0)
      return {
        sessionId: params.sessionId,
        points: [],
      };
  }
  const points = [];
  let cumulativeTokens = 0;
  let cumulativeCost = 0;
  const resolveCost = createUsageCostResolver(params.config);
  await scanUsageFile({
    filePath: sessionFile,
    config: params.config,
    resolveCost,
    onEntry: (entry) => {
      const ts = entry.timestamp?.getTime();
      if (!ts) return;
      const { input, output, cacheRead, cacheWrite, totalTokens } = computeUsageTokenTotals(
        entry.usage,
      );
      const cost = entry.costTotal ?? 0;
      cumulativeTokens += totalTokens;
      cumulativeCost += cost;
      points.push({
        timestamp: ts,
        input,
        output,
        cacheRead,
        cacheWrite,
        totalTokens,
        cost,
        cumulativeTokens,
        cumulativeCost,
      });
    },
  });
  const sortedPoints = points.toSorted((a, b) => a.timestamp - b.timestamp);
  const maxPoints = params.maxPoints ?? 100;
  if (sortedPoints.length > maxPoints) {
    const step = Math.ceil(sortedPoints.length / maxPoints);
    const downsampled = [];
    let downsampledCumulativeTokens = 0;
    let downsampledCumulativeCost = 0;
    for (let i = 0; i < sortedPoints.length; i += step) {
      const bucket = sortedPoints.slice(i, i + step);
      const bucketLast = bucket[bucket.length - 1];
      if (!bucketLast) continue;
      let bucketInput = 0;
      let bucketOutput = 0;
      let bucketCacheRead = 0;
      let bucketCacheWrite = 0;
      let bucketTotalTokens = 0;
      let bucketCost = 0;
      for (const point of bucket) {
        bucketInput += point.input;
        bucketOutput += point.output;
        bucketCacheRead += point.cacheRead;
        bucketCacheWrite += point.cacheWrite;
        bucketTotalTokens += point.totalTokens;
        bucketCost += point.cost;
      }
      downsampledCumulativeTokens += bucketTotalTokens;
      downsampledCumulativeCost += bucketCost;
      downsampled.push({
        timestamp: bucketLast.timestamp,
        input: bucketInput,
        output: bucketOutput,
        cacheRead: bucketCacheRead,
        cacheWrite: bucketCacheWrite,
        totalTokens: bucketTotalTokens,
        cost: bucketCost,
        cumulativeTokens: downsampledCumulativeTokens,
        cumulativeCost: downsampledCumulativeCost,
      });
    }
    return {
      sessionId: params.sessionId,
      points: downsampled,
    };
  }
  return {
    sessionId: params.sessionId,
    points: sortedPoints,
  };
}
async function loadSessionLogs(params) {
  const sessionFile = resolveExistingUsageSessionFile(params);
  if (!sessionFile) return null;
  if (!parseSqliteSessionFileMarker(sessionFile) && !fs.existsSync(sessionFile)) return null;
  const logs = [];
  if (params.limit !== void 0 && params.limit !== null) {
    if (!Number.isFinite(params.limit) || params.limit <= 0) return [];
  }
  const limit = params.limit ?? 50;
  const boundedLimit = Number.isInteger(limit);
  const retentionLimit = limit * 2;
  const resolveCost = createUsageCostResolver(params.config);
  for await (const parsed of readTranscriptRecordsBestEffort(sessionFile))
    try {
      const message = parsed.message;
      if (!message) continue;
      const role = message.role;
      if (role !== "user" && role !== "assistant" && role !== "tool" && role !== "toolResult")
        continue;
      const contentParts = [];
      const toolName = normalizeOptionalString(
        message.toolName ?? message.tool_name ?? message.name ?? message.tool,
      );
      if (role === "tool" || role === "toolResult") {
        contentParts.push(`[Tool: ${toolName ?? "tool"}]`);
        contentParts.push("[Tool Result]");
      }
      const rawContent = message.content;
      if (typeof rawContent === "string") contentParts.push(rawContent);
      else if (Array.isArray(rawContent)) {
        const contentText = rawContent
          .map((block) => {
            if (typeof block === "string") return block;
            const b = block;
            if (b.type === "text" && typeof b.text === "string") return b.text;
            if (b.type === "tool_use")
              return `[Tool: ${typeof b.name === "string" ? b.name : "unknown"}]`;
            if (b.type === "tool_result") return `[Tool Result]`;
            return "";
          })
          .filter(Boolean)
          .join("\n");
        if (contentText) contentParts.push(contentText);
      }
      const rawToolCalls =
        message.tool_calls ?? message.toolCalls ?? message.function_call ?? message.functionCall;
      const toolCalls = Array.isArray(rawToolCalls)
        ? rawToolCalls
        : rawToolCalls
          ? [rawToolCalls]
          : [];
      if (toolCalls.length > 0)
        for (const call of toolCalls) {
          const callObj = call;
          const directName = typeof callObj.name === "string" ? callObj.name : void 0;
          const fn = callObj.function;
          const fnName = typeof fn?.name === "string" ? fn.name : void 0;
          const name = directName ?? fnName ?? "unknown";
          contentParts.push(`[Tool: ${name}]`);
        }
      let content = contentParts.join("\n").trim();
      if (!content) continue;
      content = stripInboundMetadata(content);
      if (role === "user") content = stripMessageIdHints(stripEnvelope(content)).trim();
      if (!content) continue;
      const maxLen = 2e3;
      if (content.length > maxLen) content = truncateUtf16Safe(content, maxLen) + "…";
      const timestamp = parseTimestamp(parsed)?.getTime() ?? 0;
      let tokens;
      let cost;
      if (role === "assistant") {
        const usageRaw = message.usage;
        const usage = normalizeUsage(usageRaw);
        if (usage) {
          tokens =
            usage.total ??
            (usage.input ?? 0) +
              (usage.output ?? 0) +
              (usage.cacheRead ?? 0) +
              (usage.cacheWrite ?? 0);
          const breakdown = extractCostBreakdown(usageRaw);
          const costConfig = resolveCost({
            provider:
              (typeof message.provider === "string" ? message.provider : void 0) ??
              (typeof parsed.provider === "string" ? parsed.provider : void 0),
            model:
              (typeof message.model === "string" ? message.model : void 0) ??
              (typeof parsed.model === "string" ? parsed.model : void 0),
          });
          if (
            breakdown?.total !== void 0 &&
            !shouldRecomputeRecordedZeroCost({
              usage,
              cost: costConfig,
              costBreakdown: breakdown,
              costTotal: breakdown.total,
            })
          )
            cost = breakdown.total;
          else
            cost = estimateUsageCost({
              usage,
              cost: costConfig,
            });
        }
      }
      logs.push({
        timestamp,
        role,
        content,
        tokens,
        cost,
      });
      if (boundedLimit && logs.length > retentionLimit) {
        logs.sort((a, b) => a.timestamp - b.timestamp);
        logs.splice(0, logs.length - limit);
      }
    } catch {}
  if (boundedLimit) {
    logs.sort((a, b) => a.timestamp - b.timestamp);
    return logs.length > limit ? logs.slice(-limit) : logs;
  }
  const sortedLogs = logs.toSorted((a, b) => a.timestamp - b.timestamp);
  if (sortedLogs.length > limit) return sortedLogs.slice(-limit);
  return sortedLogs;
}
//#endregion
export {
  loadSessionCostSummary as a,
  resolveExistingUsageSessionFile as c,
  loadSessionCostSummariesFromCache as i,
  addCostUsageTotals as l,
  loadCostUsageSummary as n,
  loadSessionLogs as o,
  loadCostUsageSummaryFromCache as r,
  loadSessionUsageTimeSeries as s,
  discoverAllSessions as t,
  createEmptyCostUsageTotals as u,
};
