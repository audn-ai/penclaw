import { createHash } from "node:crypto";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import { t as getIMessageRuntime } from "./runtime-CKNRV1AW.js";
//#region extensions/imessage/src/monitor/catchup.ts
const DEFAULT_MAX_AGE_MINUTES = 120;
const MAX_MAX_AGE_MINUTES = 720;
const DEFAULT_PER_RUN_LIMIT = 50;
const MAX_PER_RUN_LIMIT = 500;
const DEFAULT_FIRST_RUN_LOOKBACK_MINUTES = 30;
const DEFAULT_MAX_FAILURE_RETRIES = 10;
const MAX_MAX_FAILURE_RETRIES = 1e3;
const MAX_FAILURE_RETRY_MAP_SIZE = 512;
const MAX_FAILURE_RETRY_MAP_JSON_BYTES = 48e3;
const textEncoder = new TextEncoder();
const IMESSAGE_CATCHUP_CURSOR_NAMESPACE = "imessage.catchup-cursors";
const cursorWriteQueue = new KeyedAsyncQueue();
function resolveIMessageCatchupCursorKey(accountId) {
  return createHash("sha256").update(accountId, "utf8").digest("hex").slice(0, 32);
}
function openCatchupCursorStore() {
  return getIMessageRuntime().state.openSyncKeyedStore({
    namespace: IMESSAGE_CATCHUP_CURSOR_NAMESPACE,
    maxEntries: 256,
  });
}
function updateCatchupCursorStore(key, updateValue) {
  const store = openCatchupCursorStore();
  if (!store.update)
    throw new Error("iMessage catchup cursor persistence requires atomic plugin-state update.");
  return store.update(key, updateValue);
}
function enqueueCursorWrite(accountId, fn) {
  const key = resolveIMessageCatchupCursorKey(accountId);
  return cursorWriteQueue.enqueue(key, fn);
}
function sanitizeFailureRetriesInput(raw) {
  if (!raw || typeof raw !== "object") return {};
  const out = {};
  for (const [guid, count] of Object.entries(raw)) {
    if (!guid || typeof guid !== "string") continue;
    if (typeof count !== "number" || !Number.isFinite(count) || count <= 0) continue;
    out[guid] = Math.floor(count);
  }
  return out;
}
function normalizeIMessageCatchupCursor(value) {
  if (!value || typeof value !== "object") return null;
  const raw = value;
  if (typeof raw.lastSeenMs !== "number" || !Number.isFinite(raw.lastSeenMs)) return null;
  if (typeof raw.lastSeenRowid !== "number" || !Number.isFinite(raw.lastSeenRowid)) return null;
  const failureRetries = sanitizeFailureRetriesInput(raw.failureRetries);
  const hasRetries = Object.keys(failureRetries).length > 0;
  return {
    lastSeenMs: raw.lastSeenMs,
    lastSeenRowid: raw.lastSeenRowid,
    updatedAt: typeof raw.updatedAt === "number" ? raw.updatedAt : 0,
    ...(hasRetries ? { failureRetries } : {}),
  };
}
function readIMessageCatchupCursor(accountId) {
  return normalizeIMessageCatchupCursor(
    openCatchupCursorStore().lookup(resolveIMessageCatchupCursorKey(accountId)),
  );
}
async function loadIMessageCatchupCursor(accountId) {
  return readIMessageCatchupCursor(accountId);
}
function buildIMessageCatchupCursor(next) {
  const sanitized = sanitizeFailureRetriesInput(next.failureRetries);
  const hasRetries = Object.keys(sanitized).length > 0;
  return {
    lastSeenMs: next.lastSeenMs,
    lastSeenRowid: next.lastSeenRowid,
    updatedAt: Date.now(),
    ...(hasRetries ? { failureRetries: sanitized } : {}),
  };
}
async function saveIMessageCatchupCursor(accountId, next, options = {}) {
  const cursor = buildIMessageCatchupCursor(next);
  updateCatchupCursorStore(resolveIMessageCatchupCursorKey(accountId), (existingValue) => {
    const existing = normalizeIMessageCatchupCursor(existingValue);
    if (existing && cursor.lastSeenRowid < existing.lastSeenRowid) {
      if (!options.allowCursorRewindForRetries) return;
      return buildIMessageCatchupCursor({
        lastSeenMs: cursor.lastSeenMs,
        lastSeenRowid: cursor.lastSeenRowid,
        failureRetries: {
          ...existing.failureRetries,
          ...cursor.failureRetries,
        },
      });
    }
    return cursor;
  });
}
/**
 * Bound the retry map so a pathological storm of unique failing GUIDs
 * cannot grow the cursor file without limit. Keeps the `maxSize` entries
 * with the highest counts (closest to give-up) when over the bound.
 */
function capFailureRetriesMap(
  map,
  maxSize = MAX_FAILURE_RETRY_MAP_SIZE,
  maxBytes = MAX_FAILURE_RETRY_MAP_JSON_BYTES,
) {
  const entries = Object.entries(map);
  if (entries.length <= maxSize && textEncoder.encode(JSON.stringify(map)).byteLength <= maxBytes)
    return map;
  entries.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const capped = {};
  for (const [guid, count] of entries.slice(0, maxSize)) {
    capped[guid] = count;
    if (textEncoder.encode(JSON.stringify(capped)).byteLength > maxBytes) {
      delete capped[guid];
      break;
    }
  }
  return capped;
}
function clampInt(value, min, max, fallback) {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(value)));
}
function resolveCatchupConfig(raw) {
  return {
    enabled: Boolean(raw?.enabled),
    maxAgeMinutes: clampInt(raw?.maxAgeMinutes, 1, MAX_MAX_AGE_MINUTES, DEFAULT_MAX_AGE_MINUTES),
    perRunLimit: clampInt(raw?.perRunLimit, 1, MAX_PER_RUN_LIMIT, DEFAULT_PER_RUN_LIMIT),
    firstRunLookbackMinutes: clampInt(
      raw?.firstRunLookbackMinutes,
      1,
      MAX_MAX_AGE_MINUTES,
      DEFAULT_FIRST_RUN_LOOKBACK_MINUTES,
    ),
    maxFailureRetries: clampInt(
      raw?.maxFailureRetries,
      1,
      MAX_MAX_FAILURE_RETRIES,
      DEFAULT_MAX_FAILURE_RETRIES,
    ),
  };
}
async function advanceIMessageCatchupCursor(accountId, next, config) {
  if (!Number.isFinite(next.lastSeenMs) || !Number.isFinite(next.lastSeenRowid)) return false;
  return await enqueueCursorWrite(accountId, async () => {
    let advanced = false;
    updateCatchupCursorStore(resolveIMessageCatchupCursorKey(accountId), (existingValue) => {
      const cursor = normalizeIMessageCatchupCursor(existingValue);
      if (cursor && next.lastSeenRowid <= cursor.lastSeenRowid) return;
      if (
        Object.values(cursor?.failureRetries ?? {}).some(
          (count) => count < config.maxFailureRetries,
        )
      )
        return;
      advanced = true;
      return buildIMessageCatchupCursor({
        lastSeenMs: Math.max(cursor?.lastSeenMs ?? next.lastSeenMs, next.lastSeenMs),
        lastSeenRowid: next.lastSeenRowid,
        failureRetries: cursor?.failureRetries,
      });
    });
    return advanced;
  });
}
/**
 * One catchup pass. Loads the cursor, fetches `messages.history`, replays
 * each row through `dispatch`, advances the cursor on success / give-up,
 * persists the cursor, returns a summary.
 *
 * The fetch and dispatch functions are injected so this loop is unit-testable
 * without standing up an `imsg` daemon. The wiring in `monitor-provider.ts`
 * passes the live `client.request("messages.history", ...)` adapter as
 * `fetch` and the `evaluateIMessageInbound` + `dispatchInboundMessage`
 * pipeline as `dispatch`.
 */
async function performIMessageCatchup(params) {
  const now = params.now ?? Date.now();
  const cfg = params.config;
  const cursor = await loadIMessageCatchupCursor(params.accountId);
  const lookbackMs = cursor === null ? cfg.firstRunLookbackMinutes * 6e4 : cfg.maxAgeMinutes * 6e4;
  const ageBoundMs = now - cfg.maxAgeMinutes * 6e4;
  const windowStartMs = Math.max(cursor?.lastSeenMs ?? now - lookbackMs, ageBoundMs);
  const windowEndMs = now;
  const sinceRowid = cursor?.lastSeenRowid ?? 0;
  const summary = {
    querySucceeded: false,
    fullyCaughtUp: false,
    fetchedCount: 0,
    replayed: 0,
    skippedFromMe: 0,
    skippedPreCursor: 0,
    skippedGivenUp: 0,
    failed: 0,
    givenUp: 0,
    cursorBefore: cursor
      ? {
          lastSeenMs: cursor.lastSeenMs,
          lastSeenRowid: cursor.lastSeenRowid,
        }
      : null,
    cursorAfter: {
      lastSeenMs: cursor?.lastSeenMs ?? windowStartMs,
      lastSeenRowid: cursor?.lastSeenRowid ?? 0,
    },
    windowStartMs,
    windowEndMs,
  };
  let fetchResult;
  try {
    fetchResult = await params.fetch({
      sinceMs: windowStartMs,
      sinceRowid,
      limit: cfg.perRunLimit,
    });
  } catch (err) {
    params.warn?.(`imessage catchup: fetch failed: ${String(err)}`);
    return summary;
  }
  if (!fetchResult.resolved) {
    params.warn?.(`imessage catchup: fetch returned unresolved result`);
    return summary;
  }
  summary.querySucceeded = true;
  summary.fullyCaughtUp = fetchResult.fullyCaughtUp !== false;
  summary.fetchedCount = fetchResult.rows.length;
  const rows = fetchResult.rows.toSorted((a, b) => a.rowid - b.rowid);
  const failureRetries = { ...cursor?.failureRetries };
  const cursorBeforeMs = cursor?.lastSeenMs ?? windowStartMs;
  const cursorBeforeRowid = cursor?.lastSeenRowid ?? 0;
  let highWatermarkMs = cursorBeforeMs;
  let highWatermarkRowid = cursorBeforeRowid;
  let earliestHeldFailureRow = null;
  for (const row of rows) {
    if (row.rowid <= sinceRowid) {
      summary.skippedPreCursor += 1;
      continue;
    }
    if (row.date < ageBoundMs) {
      summary.skippedPreCursor += 1;
      highWatermarkMs = Math.max(highWatermarkMs, row.date);
      highWatermarkRowid = Math.max(highWatermarkRowid, row.rowid);
      continue;
    }
    if (row.isFromMe) {
      try {
        await params.observeSkippedFromMe?.(row);
      } catch (err) {
        params.warn?.(
          `imessage catchup: from-me observer failed for guid=${row.guid}: ${String(err)}`,
        );
      }
      summary.skippedFromMe += 1;
      highWatermarkMs = Math.max(highWatermarkMs, row.date);
      highWatermarkRowid = Math.max(highWatermarkRowid, row.rowid);
      continue;
    }
    const priorCount = failureRetries[row.guid] ?? 0;
    if (priorCount >= cfg.maxFailureRetries) {
      summary.skippedGivenUp += 1;
      highWatermarkMs = Math.max(highWatermarkMs, row.date);
      highWatermarkRowid = Math.max(highWatermarkRowid, row.rowid);
      continue;
    }
    let dispatched;
    try {
      dispatched = await params.dispatch(row);
    } catch (err) {
      params.warn?.(`imessage catchup: dispatch threw for guid=${row.guid}: ${String(err)}`);
      dispatched = { ok: false };
    }
    if (dispatched.ok) {
      summary.replayed += 1;
      delete failureRetries[row.guid];
      highWatermarkMs = Math.max(highWatermarkMs, row.date);
      highWatermarkRowid = Math.max(highWatermarkRowid, row.rowid);
      continue;
    }
    const nextCount = priorCount + 1;
    failureRetries[row.guid] = nextCount;
    summary.failed += 1;
    if (nextCount >= cfg.maxFailureRetries) {
      summary.givenUp += 1;
      params.warn?.(
        `imessage catchup: giving up on guid=${row.guid} after ${nextCount} failures; advancing cursor past it`,
      );
      highWatermarkMs = Math.max(highWatermarkMs, row.date);
      highWatermarkRowid = Math.max(highWatermarkRowid, row.rowid);
      continue;
    }
    if (earliestHeldFailureRow === null || row.rowid < earliestHeldFailureRow.rowid)
      earliestHeldFailureRow = row;
  }
  if (earliestHeldFailureRow === null) {
    if (typeof fetchResult.highWatermarkMs === "number")
      highWatermarkMs = Math.max(highWatermarkMs, fetchResult.highWatermarkMs);
    if (typeof fetchResult.highWatermarkRowid === "number")
      highWatermarkRowid = Math.max(highWatermarkRowid, fetchResult.highWatermarkRowid);
  }
  let lastSeenMs;
  let lastSeenRowid;
  if (earliestHeldFailureRow !== null) {
    lastSeenMs = Math.max(cursorBeforeMs, earliestHeldFailureRow.date - 1);
    lastSeenRowid = Math.max(cursorBeforeRowid, earliestHeldFailureRow.rowid - 1);
  } else {
    lastSeenMs = highWatermarkMs;
    lastSeenRowid = highWatermarkRowid;
  }
  const capped = capFailureRetriesMap(failureRetries);
  summary.cursorAfter = {
    lastSeenMs,
    lastSeenRowid,
  };
  await saveIMessageCatchupCursor(
    params.accountId,
    {
      lastSeenMs,
      lastSeenRowid,
      failureRetries: capped,
    },
    { allowCursorRewindForRetries: earliestHeldFailureRow !== null },
  );
  if (summary.replayed > 0 || summary.failed > 0 || summary.givenUp > 0)
    params.log?.(
      `imessage catchup: replayed=${summary.replayed} skippedFromMe=${summary.skippedFromMe} skippedGivenUp=${summary.skippedGivenUp} failed=${summary.failed} givenUp=${summary.givenUp} fetchedCount=${summary.fetchedCount}`,
    );
  return summary;
}
//#endregion
export {
  resolveCatchupConfig as a,
  performIMessageCatchup as i,
  advanceIMessageCatchupCursor as n,
  resolveIMessageCatchupCursorKey as o,
  capFailureRetriesMap as r,
  IMESSAGE_CATCHUP_CURSOR_NAMESPACE as t,
};
