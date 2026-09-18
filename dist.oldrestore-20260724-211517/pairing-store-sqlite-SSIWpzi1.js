import {
  L as executeSqliteQuerySync,
  l as runOpenClawStateWriteTransaction,
  s as openOpenClawStateDatabase,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { i as listChannelPlugins, t as getChannelPlugin } from "./registry-mc8oBRx8.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import "./account-id-C7N4Rwku.js";
import { p as normalizeUniqueStringEntries } from "./string-normalization-CRyoFBPt.js";
//#region src/channels/plugins/pairing.ts
function listPairingChannels() {
  return listChannelPlugins()
    .filter((plugin) => plugin.pairing)
    .map((plugin) => plugin.id);
}
function getPairingAdapter(channelId) {
  return getChannelPlugin(channelId)?.pairing ?? null;
}
function requirePairingAdapter(channelId) {
  const adapter = getPairingAdapter(channelId);
  if (!adapter) throw new Error(`Channel ${channelId} does not support pairing`);
  return adapter;
}
async function notifyPairingApproved(params) {
  const adapter = params.pairingAdapter ?? requirePairingAdapter(params.channelId);
  if (!adapter.notifyApproval) return;
  await adapter.notifyApproval({
    cfg: params.cfg,
    id: params.id,
    ...(params.accountId ? { accountId: params.accountId } : {}),
    runtime: params.runtime,
  });
}
//#endregion
//#region src/pairing/pairing-store-keys.ts
function describePairingKeyInput(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? `string length ${trimmed.length}` : "empty string";
  }
  if (typeof value === "number" && !Number.isFinite(value)) return "non-finite number";
  return typeof value;
}
function invalidPairingKeyError(kind, reason, value) {
  return /* @__PURE__ */ new Error(
    `invalid pairing ${kind}: ${reason}; got ${describePairingKeyInput(value)}`,
  );
}
function normalizePairingKey(value, kind) {
  if (typeof value !== "string")
    throw invalidPairingKeyError(kind, "expected non-empty string", value);
  const raw = normalizeLowercaseStringOrEmpty(value);
  if (!raw) throw invalidPairingKeyError(kind, "expected non-empty string", value);
  const safe = raw.replace(/[\\/:*?"<>|]/g, "_").replace(/\.\./g, "_");
  if (!safe || safe === "_") throw invalidPairingKeyError(kind, "sanitized key is empty", value);
  return safe;
}
function safeChannelKey(channel) {
  return normalizePairingKey(channel, "channel");
}
function safeAccountKey(accountId) {
  return normalizePairingKey(accountId, "account id");
}
function dedupePreserveOrder(entries) {
  return normalizeUniqueStringEntries(entries);
}
function resolveAllowFromAccountId(accountId) {
  if (accountId != null && typeof accountId !== "string")
    throw invalidPairingKeyError("account id", "expected non-empty string", accountId);
  return normalizeLowercaseStringOrEmpty(accountId) || "default";
}
//#endregion
//#region src/pairing/pairing-store-sqlite.ts
function parseTimestamp(value) {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}
function normalizePersistedPairingMeta(value) {
  if (!isRecord(value)) return;
  const out = {};
  for (const [key, entry] of Object.entries(value)) {
    const normalized = normalizeOptionalString(entry);
    if (normalized) out[key] = normalized;
  }
  return Object.keys(out).length > 0 ? out : void 0;
}
function normalizePersistedPairingRequest(value) {
  if (!isRecord(value)) return;
  const id = normalizeOptionalString(value.id);
  const code = normalizeOptionalString(value.code);
  const createdAt = normalizeOptionalString(value.createdAt);
  const lastSeenAt = normalizeOptionalString(value.lastSeenAt) ?? createdAt;
  if (
    !id ||
    !code ||
    !createdAt ||
    !lastSeenAt ||
    parseTimestamp(createdAt) === null ||
    parseTimestamp(lastSeenAt) === null
  )
    return;
  const meta = normalizePersistedPairingMeta(value.meta);
  return {
    id,
    code,
    createdAt,
    lastSeenAt,
    ...(meta ? { meta } : {}),
  };
}
function resolvePairingRequestAccountId(entry) {
  return resolveAllowFromAccountId(entry.meta?.accountId) || "default";
}
function sqliteOptionsForEnv(env) {
  return { env };
}
function readChannelPairingStateFromDatabase(database, channel) {
  const db = getNodeSqliteKysely(database.db);
  const channelKey = safeChannelKey(channel);
  const requestRows = executeSqliteQuerySync(
    database.db,
    db
      .selectFrom("channel_pairing_requests")
      .selectAll()
      .where("channel_key", "=", channelKey)
      .orderBy("created_at", "asc")
      .orderBy("account_id", "asc")
      .orderBy("request_id", "asc"),
  ).rows;
  const allowRows = executeSqliteQuerySync(
    database.db,
    db
      .selectFrom("channel_pairing_allow_entries")
      .selectAll()
      .where("channel_key", "=", channelKey)
      .orderBy("account_id", "asc")
      .orderBy("sort_order", "asc")
      .orderBy("entry", "asc"),
  ).rows;
  const allowFrom = {};
  for (const row of allowRows) {
    const accountId = resolveAllowFromAccountId(row.account_id);
    (allowFrom[accountId] ??= []).push(row.entry);
  }
  return {
    version: 1,
    requests: requestRows.flatMap((row) => {
      let meta;
      if (row.meta_json)
        try {
          meta = normalizePersistedPairingMeta(JSON.parse(row.meta_json));
        } catch {
          meta = void 0;
        }
      meta = {
        ...meta,
        accountId: resolveAllowFromAccountId(row.account_id),
      };
      const request = normalizePersistedPairingRequest({
        id: row.request_id,
        code: row.code,
        createdAt: row.created_at,
        lastSeenAt: row.last_seen_at,
        meta,
      });
      return request ? [request] : [];
    }),
    allowFrom,
  };
}
function readChannelPairingState(channel, env) {
  return readChannelPairingStateFromDatabase(
    openOpenClawStateDatabase(sqliteOptionsForEnv(env)),
    channel,
  );
}
function writeChannelPairingStateToDatabase(database, channel, state) {
  const db = getNodeSqliteKysely(database.db);
  const channelKey = safeChannelKey(channel);
  executeSqliteQuerySync(
    database.db,
    db.deleteFrom("channel_pairing_requests").where("channel_key", "=", channelKey),
  );
  executeSqliteQuerySync(
    database.db,
    db.deleteFrom("channel_pairing_allow_entries").where("channel_key", "=", channelKey),
  );
  for (const request of state.requests) {
    const normalized = normalizePersistedPairingRequest(request);
    if (!normalized) continue;
    executeSqliteQuerySync(
      database.db,
      db.insertInto("channel_pairing_requests").values({
        channel_key: channelKey,
        account_id: resolvePairingRequestAccountId(normalized),
        request_id: normalized.id,
        code: normalized.code,
        created_at: normalized.createdAt,
        last_seen_at: normalized.lastSeenAt,
        meta_json: normalized.meta ? JSON.stringify(normalized.meta) : null,
      }),
    );
  }
  const updatedAt = Date.now();
  for (const [accountId, entries] of Object.entries(state.allowFrom ?? {})) {
    const normalizedEntries = dedupePreserveOrder(
      entries
        .map((entry) => normalizeOptionalString(entry) ?? "")
        .filter((entry) => entry && entry !== "*"),
    );
    for (const [sortOrder, entry] of normalizedEntries.entries())
      executeSqliteQuerySync(
        database.db,
        db.insertInto("channel_pairing_allow_entries").values({
          channel_key: channelKey,
          account_id: resolveAllowFromAccountId(accountId),
          entry,
          sort_order: sortOrder,
          updated_at: updatedAt,
        }),
      );
  }
}
function updateChannelPairingStateSnapshot(channel, env, update) {
  return runOpenClawStateWriteTransaction((database) => {
    const state = readChannelPairingStateFromDatabase(database, channel);
    const result = update(state);
    writeChannelPairingStateToDatabase(database, channel, state);
    return result;
  }, sqliteOptionsForEnv(env));
}
//#endregion
export {
  updateChannelPairingStateSnapshot as a,
  resolveAllowFromAccountId as c,
  getPairingAdapter as d,
  listPairingChannels as f,
  sqliteOptionsForEnv as i,
  safeAccountKey as l,
  readChannelPairingStateFromDatabase as n,
  writeChannelPairingStateToDatabase as o,
  notifyPairingApproved as p,
  resolvePairingRequestAccountId as r,
  dedupePreserveOrder as s,
  readChannelPairingState as t,
  safeChannelKey as u,
};
