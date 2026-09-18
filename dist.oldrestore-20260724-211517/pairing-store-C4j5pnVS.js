import crypto from "node:crypto";
import os from "node:os";
import path from "node:path";
import { o as resolveRequiredHomeDir } from "./home-dir-DxrrpDft.js";
import "./account-id-C7N4Rwku.js";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-Bsa8Tv1Z.js";
import {
  c as resolveAllowFromAccountId,
  d as getPairingAdapter,
  i as sqliteOptionsForEnv,
  l as safeAccountKey,
  n as readChannelPairingStateFromDatabase,
  o as writeChannelPairingStateToDatabase,
  r as resolvePairingRequestAccountId,
  t as readChannelPairingState,
  u as safeChannelKey,
} from "./pairing-store-sqlite-SSIWpzi1.js";
import { _ as resolveOAuthDir, y as resolveStateDir } from "./paths-DEklnbzU.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  f as normalizeStringifiedOptionalString,
  o as normalizeNullableString,
} from "./string-coerce-DW4mBlAt.js";
//#region src/pairing/pairing-store.ts
/** @deprecated Compatibility helper for doctor/plugin migrations of the retired JSON store. */
function resolveChannelAllowFromPath(channel, env = process.env, accountId) {
  const credentialsDir = resolveOAuthDir(
    env,
    resolveStateDir(env, () => resolveRequiredHomeDir(env, os.homedir)),
  );
  const normalizedAccountId = normalizeOptionalString(accountId);
  const suffix = normalizedAccountId ? `-${safeAccountKey(normalizedAccountId)}` : "";
  return path.join(credentialsDir, `${safeChannelKey(channel)}${suffix}-allowFrom.json`);
}
const PAIRING_CODE_LENGTH = 8;
const PAIRING_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const PAIRING_CODE_MAX_ATTEMPTS = 500;
const PAIRING_PENDING_TTL_MS = 3600 * 1e3;
const PAIRING_PENDING_MAX = 3;
function parseTimestamp(value) {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}
function isExpired(entry, nowMs) {
  const createdAt = parseTimestamp(entry.createdAt);
  return createdAt === null || nowMs - createdAt > PAIRING_PENDING_TTL_MS;
}
function pruneExpiredRequests(reqs, nowMs) {
  const kept = [];
  let removed = false;
  for (const req of reqs) {
    if (isExpired(req, nowMs)) {
      removed = true;
      continue;
    }
    kept.push(req);
  }
  return {
    requests: kept,
    removed,
  };
}
function resolveLastSeenAt(entry) {
  return parseTimestamp(entry.lastSeenAt) ?? parseTimestamp(entry.createdAt) ?? 0;
}
function normalizePairingAccountId(accountId) {
  return normalizeLowercaseStringOrEmpty(accountId);
}
function requestMatchesAccountId(entry, normalizedAccountId) {
  return !normalizedAccountId || resolvePairingRequestAccountId(entry) === normalizedAccountId;
}
function pruneExcessRequestsByAccount(reqs, maxPending) {
  if (maxPending <= 0 || reqs.length <= maxPending)
    return {
      requests: reqs,
      removed: false,
    };
  const grouped = /* @__PURE__ */ new Map();
  for (const [index, entry] of reqs.entries()) {
    const accountId = resolvePairingRequestAccountId(entry);
    const current = grouped.get(accountId);
    if (current)
      current.push({
        index,
        request: entry,
      });
    else
      grouped.set(accountId, [
        {
          index,
          request: entry,
        },
      ]);
  }
  const droppedIndexes = /* @__PURE__ */ new Set();
  for (const entries of grouped.values()) {
    if (entries.length <= maxPending) continue;
    const sorted = entries.toSorted(
      (left, right) => resolveLastSeenAt(left.request) - resolveLastSeenAt(right.request),
    );
    for (const { index } of sorted.slice(0, sorted.length - maxPending)) droppedIndexes.add(index);
  }
  return droppedIndexes.size === 0
    ? {
        requests: reqs,
        removed: false,
      }
    : {
        requests: reqs.filter((_, index) => !droppedIndexes.has(index)),
        removed: true,
      };
}
function randomCode() {
  let out = "";
  for (let i = 0; i < PAIRING_CODE_LENGTH; i++)
    out += PAIRING_CODE_ALPHABET[crypto.randomInt(0, 32)];
  return out;
}
function generateUniqueCode(existing) {
  for (let attempt = 0; attempt < PAIRING_CODE_MAX_ATTEMPTS; attempt += 1) {
    const code = randomCode();
    if (!existing.has(code)) return code;
  }
  throw new Error(
    `failed to generate unique pairing code after ${PAIRING_CODE_MAX_ATTEMPTS} attempts; existing code count: ${existing.size}`,
  );
}
function normalizeId(value) {
  return normalizeStringifiedOptionalString(value) ?? "";
}
function resolvePairingAdapter(channel, pairingAdapter) {
  return pairingAdapter ?? getPairingAdapter(channel) ?? void 0;
}
function normalizeAllowEntry(channel, entry, pairingAdapter) {
  const trimmed = entry.trim();
  if (!trimmed || trimmed === "*") return "";
  const adapter = resolvePairingAdapter(channel, pairingAdapter);
  const normalizedEntry =
    normalizeOptionalString(
      adapter?.normalizeAllowEntry ? adapter.normalizeAllowEntry(trimmed) : trimmed,
    ) ?? "";
  return normalizedEntry === "*" ? "" : normalizedEntry;
}
function normalizeAllowFromInput(channel, entry, pairingAdapter) {
  return normalizeAllowEntry(channel, normalizeId(entry), pairingAdapter);
}
function readAllowFromState(channel, env, accountId) {
  const resolvedAccountId = resolveAllowFromAccountId(accountId);
  return (readChannelPairingState(channel, env).allowFrom?.[resolvedAccountId] ?? []).slice();
}
async function updateAllowFromStoreEntry(params) {
  const env = params.env ?? process.env;
  const accountId = resolveAllowFromAccountId(params.accountId);
  const normalized = normalizeAllowFromInput(params.channel, params.entry, params.pairingAdapter);
  return runOpenClawStateWriteTransaction((database) => {
    const state = readChannelPairingStateFromDatabase(database, params.channel);
    const current = (state.allowFrom?.[accountId] ?? []).slice();
    if (!normalized)
      return {
        changed: false,
        allowFrom: current,
      };
    const next = params.apply(current, normalized);
    if (!next)
      return {
        changed: false,
        allowFrom: current,
      };
    state.allowFrom ??= {};
    state.allowFrom[accountId] = next;
    writeChannelPairingStateToDatabase(database, params.channel, state);
    return {
      changed: true,
      allowFrom: next,
    };
  }, sqliteOptionsForEnv(env));
}
async function readChannelAllowFromStore(channel, env = process.env, accountId) {
  return readAllowFromState(channel, env, accountId);
}
function readChannelAllowFromStoreSync(channel, env = process.env, accountId) {
  return readAllowFromState(channel, env, accountId);
}
async function addChannelAllowFromStoreEntry(params) {
  return updateAllowFromStoreEntry({
    ...params,
    apply: (current, normalized) =>
      current.includes(normalized) ? null : [...current, normalized],
  });
}
async function removeChannelAllowFromStoreEntry(params) {
  return updateAllowFromStoreEntry({
    ...params,
    apply: (current, normalized) => {
      const next = current.filter((entry) => entry !== normalized);
      return next.length === current.length ? null : next;
    },
  });
}
async function listChannelPairingRequests(channel, env = process.env, accountId) {
  return runOpenClawStateWriteTransaction((database) => {
    const state = readChannelPairingStateFromDatabase(database, channel);
    const expired = pruneExpiredRequests(state.requests, Date.now());
    const capped = pruneExcessRequestsByAccount(expired.requests, PAIRING_PENDING_MAX);
    if (expired.removed || capped.removed) {
      state.requests = capped.requests;
      writeChannelPairingStateToDatabase(database, channel, state);
    }
    const normalizedAccountId = normalizePairingAccountId(accountId);
    return capped.requests
      .filter((entry) => requestMatchesAccountId(entry, normalizedAccountId))
      .toSorted((left, right) => {
        const createdOrder = left.createdAt.localeCompare(right.createdAt);
        if (createdOrder !== 0) return createdOrder;
        return (
          resolvePairingRequestAccountId(left).localeCompare(
            resolvePairingRequestAccountId(right),
          ) || left.id.localeCompare(right.id)
        );
      });
  }, sqliteOptionsForEnv(env));
}
async function upsertChannelPairingRequest(params) {
  return runOpenClawStateWriteTransaction(
    (database) => {
      const now = /* @__PURE__ */ new Date().toISOString();
      const id = normalizeId(params.id);
      const accountId = normalizePairingAccountId(params.accountId) || "default";
      const meta = {
        ...(params.meta
          ? Object.fromEntries(
              Object.entries(params.meta)
                .map(([key, value]) => [key, normalizeOptionalString(value) ?? ""])
                .filter(([, value]) => Boolean(value)),
            )
          : void 0),
        accountId,
      };
      const state = readChannelPairingStateFromDatabase(database, params.channel);
      const expired = pruneExpiredRequests(state.requests, Date.now());
      let requests = expired.requests;
      const existingIndex = requests.findIndex(
        (request) => request.id === id && requestMatchesAccountId(request, accountId),
      );
      const existingCodes = new Set(
        requests.map((request) => (normalizeOptionalString(request.code) ?? "").toUpperCase()),
      );
      if (existingIndex >= 0) {
        const existing = requests[existingIndex];
        const code = normalizeOptionalString(existing?.code) || generateUniqueCode(existingCodes);
        requests[existingIndex] = {
          id,
          code,
          createdAt: existing?.createdAt ?? now,
          lastSeenAt: now,
          meta,
        };
        state.requests = pruneExcessRequestsByAccount(requests, PAIRING_PENDING_MAX).requests;
        writeChannelPairingStateToDatabase(database, params.channel, state);
        return {
          code,
          created: false,
        };
      }
      const capped = pruneExcessRequestsByAccount(requests, PAIRING_PENDING_MAX);
      requests = capped.requests;
      if (
        requests.filter((request) => requestMatchesAccountId(request, accountId)).length >=
        PAIRING_PENDING_MAX
      ) {
        if (expired.removed || capped.removed) {
          state.requests = requests;
          writeChannelPairingStateToDatabase(database, params.channel, state);
        }
        return {
          code: "",
          created: false,
        };
      }
      const code = generateUniqueCode(existingCodes);
      state.requests = [
        ...requests,
        {
          id,
          code,
          createdAt: now,
          lastSeenAt: now,
          meta,
        },
      ];
      writeChannelPairingStateToDatabase(database, params.channel, state);
      return {
        code,
        created: true,
      };
    },
    sqliteOptionsForEnv(params.env ?? process.env),
  );
}
async function approveChannelPairingCode(params) {
  const env = params.env ?? process.env;
  const code = (normalizeNullableString(params.code) ?? "").toUpperCase();
  if (!code) return null;
  return runOpenClawStateWriteTransaction((database) => {
    const state = readChannelPairingStateFromDatabase(database, params.channel);
    const pruned = pruneExpiredRequests(state.requests, Date.now());
    const accountId = normalizePairingAccountId(params.accountId);
    const index = pruned.requests.findIndex(
      (request) =>
        request.code.toUpperCase() === code && requestMatchesAccountId(request, accountId),
    );
    if (index < 0) {
      if (pruned.removed) {
        state.requests = pruned.requests;
        writeChannelPairingStateToDatabase(database, params.channel, state);
      }
      return null;
    }
    const entry = pruned.requests[index];
    if (!entry) return null;
    pruned.requests.splice(index, 1);
    state.requests = pruned.requests;
    const allowAccountId = resolveAllowFromAccountId(
      normalizeOptionalString(params.accountId) ?? normalizeOptionalString(entry.meta?.accountId),
    );
    const currentAllow = state.allowFrom?.[allowAccountId] ?? [];
    const normalizedAllow = normalizeAllowFromInput(
      params.channel,
      entry.id,
      params.pairingAdapter,
    );
    if (normalizedAllow && !currentAllow.includes(normalizedAllow)) {
      state.allowFrom ??= {};
      state.allowFrom[allowAccountId] = [...currentAllow, normalizedAllow];
    }
    writeChannelPairingStateToDatabase(database, params.channel, state);
    return {
      id: entry.id,
      entry,
    };
  }, sqliteOptionsForEnv(env));
}
//#endregion
export {
  readChannelAllowFromStoreSync as a,
  upsertChannelPairingRequest as c,
  readChannelAllowFromStore as i,
  approveChannelPairingCode as n,
  removeChannelAllowFromStoreEntry as o,
  listChannelPairingRequests as r,
  resolveChannelAllowFromPath as s,
  addChannelAllowFromStoreEntry as t,
};
