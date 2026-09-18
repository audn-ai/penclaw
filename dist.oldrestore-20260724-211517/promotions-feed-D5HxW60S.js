import {
  f as fetchClawHubPromotionsFeed,
  x as parseClawHubPromotionsFeed,
} from "./clawhub-CgGOpxts.js";
import {
  L as executeSqliteQuerySync,
  R as executeSqliteQueryTakeFirstSync,
  l as runOpenClawStateWriteTransaction,
  s as openOpenClawStateDatabase,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
//#region src/infra/promotions-feed.ts
const PROMOTIONS_FEED_STATE_KEY = "default";
const PROMOTIONS_FEED_CHECK_INTERVAL_MS = 1440 * 60 * 1e3;
const PROMOTIONS_FEED_FETCH_TIMEOUT_MS = 2500;
const EMPTY_STATE = {
  entries: [],
  notifiedSlugs: /* @__PURE__ */ new Set(),
};
function parseSlugListJson(raw) {
  if (!raw) return /* @__PURE__ */ new Set();
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) return /* @__PURE__ */ new Set();
  return new Set(parsed.filter((entry) => typeof entry === "string"));
}
function readPromotionsFeedStateWithMetadata() {
  try {
    const database = openOpenClawStateDatabase();
    const db = getNodeSqliteKysely(database.db);
    const row = executeSqliteQueryTakeFirstSync(
      database.db,
      db
        .selectFrom("clawhub_promotions_feed_state")
        .select([
          "etag",
          "payload_json",
          "feed_sequence",
          "last_checked_at_ms",
          "notified_slugs_json",
        ])
        .where("state_key", "=", PROMOTIONS_FEED_STATE_KEY),
    );
    if (!row)
      return {
        state: {
          ...EMPTY_STATE,
          notifiedSlugs: /* @__PURE__ */ new Set(),
        },
        payloadInvalid: false,
      };
    let entries = [];
    let expiresAtMs;
    let payloadInvalid = false;
    if (row.payload_json)
      try {
        const feed = parseClawHubPromotionsFeed(JSON.parse(row.payload_json));
        entries = feed.entries;
        expiresAtMs = Date.parse(feed.expiresAt);
      } catch {
        payloadInvalid = true;
      }
    return {
      state: {
        ...(!payloadInvalid && row.etag ? { etag: row.etag } : {}),
        ...(!payloadInvalid && typeof row.feed_sequence === "number"
          ? { sequence: row.feed_sequence }
          : {}),
        ...(!payloadInvalid && expiresAtMs !== void 0 ? { expiresAtMs } : {}),
        entries,
        ...(typeof row.last_checked_at_ms === "number"
          ? { lastCheckedAtMs: row.last_checked_at_ms }
          : {}),
        notifiedSlugs: parseSlugListJson(row.notified_slugs_json),
      },
      payloadInvalid,
    };
  } catch {
    return {
      state: {
        ...EMPTY_STATE,
        notifiedSlugs: /* @__PURE__ */ new Set(),
      },
      payloadInvalid: false,
    };
  }
}
function readPromotionsFeedState() {
  return readPromotionsFeedStateWithMetadata().state;
}
function writePromotionsFeedState(params) {
  runOpenClawStateWriteTransaction((database) => {
    const db = getNodeSqliteKysely(database.db);
    const existing = executeSqliteQueryTakeFirstSync(
      database.db,
      db
        .selectFrom("clawhub_promotions_feed_state")
        .select([
          "etag",
          "payload_json",
          "feed_sequence",
          "last_checked_at_ms",
          "notified_slugs_json",
        ])
        .where("state_key", "=", PROMOTIONS_FEED_STATE_KEY),
    );
    const next = {
      etag: params.etag === void 0 ? (existing?.etag ?? null) : params.etag,
      payload_json:
        params.payloadJson === void 0 ? (existing?.payload_json ?? null) : params.payloadJson,
      feed_sequence:
        params.sequence === void 0 ? (existing?.feed_sequence ?? null) : params.sequence,
      last_checked_at_ms: params.lastCheckedAtMs ?? existing?.last_checked_at_ms ?? null,
      notified_slugs_json: params.notifiedSlugs
        ? JSON.stringify([...params.notifiedSlugs].toSorted())
        : (existing?.notified_slugs_json ?? "[]"),
      updated_at_ms: Date.now(),
    };
    executeSqliteQuerySync(
      database.db,
      db
        .insertInto("clawhub_promotions_feed_state")
        .values({
          state_key: PROMOTIONS_FEED_STATE_KEY,
          ...next,
        })
        .onConflict((conflict) => conflict.column("state_key").doUpdateSet(next)),
    );
  });
}
function markPromotionSlugsNotified(slugs) {
  try {
    const state = readPromotionsFeedState();
    const merged = new Set(state.notifiedSlugs);
    let changed = false;
    for (const slug of slugs)
      if (!merged.has(slug)) {
        merged.add(slug);
        changed = true;
      }
    if (changed) writePromotionsFeedState({ notifiedSlugs: merged });
  } catch {}
}
function isPromotionWindowLive(entry, nowMs) {
  return entry.startsAt <= nowMs && nowMs <= entry.endsAt;
}
function listLivePromotionEntries(state, nowMs) {
  if (state.expiresAtMs !== void 0 && nowMs >= state.expiresAtMs) return [];
  return state.entries.filter((entry) => isPromotionWindowLive(entry, nowMs));
}
/**
 * Cadence-gated, fail-silent feed refresh. At most one conditional GET per
 * check interval; offline or malformed responses leave the cached state
 * untouched (aside from the attempt timestamp, so failures do not retry on
 * every command). Returns the freshest available state.
 */
async function maybeRefreshPromotionsFeed(params = {}) {
  const { state, payloadInvalid } = readPromotionsFeedStateWithMetadata();
  const nowMs = params.nowMs ?? Date.now();
  const skipForTests = !params.fetchImpl && (process.env.VITEST !== void 0 || false);
  const checkedBeforeSnapshotExpired =
    state.expiresAtMs !== void 0 &&
    state.lastCheckedAtMs !== void 0 &&
    state.lastCheckedAtMs < state.expiresAtMs;
  const fresh =
    !payloadInvalid &&
    state.lastCheckedAtMs !== void 0 &&
    nowMs - state.lastCheckedAtMs < PROMOTIONS_FEED_CHECK_INTERVAL_MS &&
    (!checkedBeforeSnapshotExpired || state.expiresAtMs === void 0 || nowMs < state.expiresAtMs);
  if (skipForTests || (fresh && !params.force)) return state;
  try {
    const result = await fetchClawHubPromotionsFeed({
      ...(state.etag ? { etag: state.etag } : {}),
      ...(params.fetchImpl ? { fetchImpl: params.fetchImpl } : {}),
      timeoutMs: params.timeoutMs ?? PROMOTIONS_FEED_FETCH_TIMEOUT_MS,
    });
    if (result.status === "not-modified") {
      writePromotionsFeedState({ lastCheckedAtMs: nowMs });
      return {
        ...state,
        lastCheckedAtMs: nowMs,
      };
    }
    if (state.sequence !== void 0 && result.feed.sequence < state.sequence) {
      writePromotionsFeedState({ lastCheckedAtMs: nowMs });
      return {
        ...state,
        lastCheckedAtMs: nowMs,
      };
    }
    writePromotionsFeedState({
      etag: result.etag ?? null,
      sequence: result.feed.sequence,
      payloadJson: result.payload,
      lastCheckedAtMs: nowMs,
    });
    return {
      ...(result.etag ? { etag: result.etag } : {}),
      sequence: result.feed.sequence,
      expiresAtMs: Date.parse(result.feed.expiresAt),
      entries: result.feed.entries,
      lastCheckedAtMs: nowMs,
      notifiedSlugs: state.notifiedSlugs,
    };
  } catch {
    try {
      writePromotionsFeedState({
        ...(payloadInvalid
          ? {
              etag: null,
              sequence: null,
              payloadJson: null,
            }
          : {}),
        lastCheckedAtMs: nowMs,
      });
    } catch {}
    return {
      ...state,
      lastCheckedAtMs: nowMs,
    };
  }
}
function recordPromotionClaim(record) {
  try {
    runOpenClawStateWriteTransaction((database) => {
      const db = getNodeSqliteKysely(database.db);
      const values = {
        slug: record.slug,
        provider: record.provider ?? null,
        model_keys_json: JSON.stringify(record.modelKeys),
        ends_at_ms: record.endsAtMs,
        claimed_at_ms: record.claimedAtMs,
      };
      executeSqliteQuerySync(
        database.db,
        db
          .insertInto("clawhub_promotion_claims")
          .values(values)
          .onConflict((conflict) => conflict.column("slug").doUpdateSet(values)),
      );
    });
  } catch {}
}
function readPromotionClaims() {
  try {
    const database = openOpenClawStateDatabase();
    const db = getNodeSqliteKysely(database.db);
    const { rows } = executeSqliteQuerySync(
      database.db,
      db
        .selectFrom("clawhub_promotion_claims")
        .select(["slug", "provider", "model_keys_json", "ends_at_ms", "claimed_at_ms"]),
    );
    return rows.map((row) => {
      let modelKeys = [];
      try {
        const parsed = JSON.parse(row.model_keys_json);
        if (Array.isArray(parsed)) modelKeys = parsed.filter((entry) => typeof entry === "string");
      } catch {}
      const record = {
        slug: row.slug,
        modelKeys,
        endsAtMs: row.ends_at_ms,
        claimedAtMs: row.claimed_at_ms,
      };
      if (row.provider) record.provider = row.provider;
      return record;
    });
  } catch {
    return [];
  }
}
//#endregion
export {
  recordPromotionClaim as a,
  readPromotionClaims as i,
  markPromotionSlugsNotified as n,
  maybeRefreshPromotionsFeed as r,
  listLivePromotionEntries as t,
};
