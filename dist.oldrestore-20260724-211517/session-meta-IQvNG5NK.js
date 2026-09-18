import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import {
  L as executeSqliteQuerySync,
  R as executeSqliteQueryTakeFirstSync,
  l as runOpenClawStateWriteTransaction,
  s as openOpenClawStateDatabase,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import { l as resolveStorePath } from "./paths-TfuVT-K8.js";
import { i as asOptionalRecord } from "./record-coerce-DHZ4bFlT.js";
import {
  k as patchSessionEntryWithKey,
  y as listSessionEntries,
} from "./session-accessor-PZVNxFCV.js";
import { c as parseAgentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import "./config-BDv-QbJ6.js";
import { n as safeParseJson } from "./src-Bl7G9qvi.js";
import { v as mergeSessionEntry } from "./store-CzZJhTF6.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/acp/runtime/session-meta.ts
function resolveStoreSessionKey(entries, sessionKey) {
  const normalized = sessionKey.trim();
  if (!normalized) return "";
  if (entries.some((entry) => entry.sessionKey === normalized)) return normalized;
  const lower = normalizeLowercaseStringOrEmpty(normalized);
  if (entries.some((entry) => entry.sessionKey === lower)) return lower;
  for (const entry of entries)
    if (normalizeLowercaseStringOrEmpty(entry.sessionKey) === lower) return entry.sessionKey;
  return lower;
}
/** Resolves the session store path that owns an ACP session key. */
function resolveSessionStorePathForAcp(params) {
  const cfg = params.cfg ?? getRuntimeConfig();
  const parsed = parseAgentSessionKey(params.sessionKey);
  const storePath = resolveStorePath(cfg.session?.store, {
    agentId: parsed?.agentId,
    env: params.env,
  });
  return {
    cfg,
    ...(parsed?.agentId ? { agentId: parsed.agentId } : {}),
    storePath,
  };
}
function getAcpSessionKysely(db) {
  return getNodeSqliteKysely(db);
}
function rowToAcpSessionMeta(row) {
  const identity = asOptionalRecord(safeParseJson(row.identity_json ?? ""));
  const runtimeOptions = asOptionalRecord(safeParseJson(row.runtime_options_json ?? ""));
  return {
    backend: row.backend,
    agent: row.agent,
    runtimeSessionName: row.runtime_session_name,
    ...(identity ? { identity } : {}),
    mode: row.mode === "oneshot" ? "oneshot" : "persistent",
    ...(runtimeOptions ? { runtimeOptions } : {}),
    ...(row.cwd != null ? { cwd: row.cwd } : {}),
    state: row.state === "running" || row.state === "error" ? row.state : "idle",
    lastActivityAt: row.last_activity_at,
    ...(row.last_error != null ? { lastError: row.last_error } : {}),
  };
}
function bindAcpSessionMeta(params) {
  return {
    session_key: params.sessionKey,
    session_id: params.sessionId ?? null,
    backend: params.meta.backend,
    agent: params.meta.agent,
    runtime_session_name: params.meta.runtimeSessionName,
    identity_json: params.meta.identity ? JSON.stringify(params.meta.identity) : null,
    mode: params.meta.mode,
    runtime_options_json: params.meta.runtimeOptions
      ? JSON.stringify(params.meta.runtimeOptions)
      : null,
    cwd: params.meta.cwd ?? null,
    state: params.meta.state,
    last_activity_at: params.meta.lastActivityAt,
    last_error: params.meta.lastError ?? null,
    updated_at: params.updatedAt,
  };
}
function selectAcpSessionRow(db, sessionKey) {
  return executeSqliteQueryTakeFirstSync(
    db,
    getAcpSessionKysely(db)
      .selectFrom("acp_sessions")
      .selectAll()
      .where("session_key", "=", sessionKey),
  );
}
function acpSessionRowMatchesEntry(row, entry) {
  return row.session_id == null || row.session_id === entry?.sessionId;
}
function readAcpSessionMeta(params) {
  const sessionKey = params.sessionKey.trim();
  if (!sessionKey) return;
  const storeEntry = readSessionEntryFromStore({
    sessionKey,
    cfg: params.cfg,
    env: params.env,
    clone: false,
  });
  const row = selectAcpSessionRow(
    openOpenClawStateDatabase({
      env: params.env,
      path: params.databasePath,
    }).db,
    storeEntry.storeSessionKey,
  );
  if (!row || !acpSessionRowMatchesEntry(row, storeEntry.entry)) return;
  return rowToAcpSessionMeta(row);
}
function readAcpSessionMetaForEntry(params) {
  const sessionKey = params.sessionKey.trim();
  if (!sessionKey) return;
  const row = selectAcpSessionRow(
    openOpenClawStateDatabase({
      env: params.env,
      path: params.databasePath,
    }).db,
    sessionKey,
  );
  if (!row || !acpSessionRowMatchesEntry(row, params.entry)) return;
  return rowToAcpSessionMeta(row);
}
function selectAcpSessionRows(options = {}) {
  const database = openOpenClawStateDatabase(options);
  return executeSqliteQuerySync(
    database.db,
    getAcpSessionKysely(database.db)
      .selectFrom("acp_sessions")
      .selectAll()
      .orderBy("last_activity_at", "desc")
      .orderBy("session_key", "asc"),
  ).rows;
}
function writeAcpSessionMetaForMigration(params) {
  const sessionKey = params.sessionKey.trim();
  if (!sessionKey) return;
  const row = bindAcpSessionMeta({
    sessionKey,
    sessionId: params.sessionId,
    meta: params.meta,
    updatedAt: params.now?.() ?? Date.now(),
  });
  runOpenClawStateWriteTransaction(
    (database) => {
      upsertAcpSessionMetaRow(database.db, row);
    },
    {
      env: params.env,
      path: params.databasePath,
    },
  );
}
function repairAcpSessionMetaKeyForMigration(params) {
  const sessionKey = params.sessionKey.trim();
  if (!sessionKey) return false;
  let repaired = false;
  runOpenClawStateWriteTransaction(
    (database) => {
      const currentRow = selectAcpSessionRow(database.db, sessionKey);
      if (currentRow && acpSessionRowMatchesEntry(currentRow, params.entry)) return;
      const normalizedSessionKey = normalizeLowercaseStringOrEmpty(sessionKey);
      const candidateKeys = /* @__PURE__ */ new Set();
      candidateKeys.add(normalizedSessionKey);
      for (const candidate of params.candidateSessionKeys ?? []) {
        const trimmed = typeof candidate === "string" ? candidate.trim() : "";
        if (
          trimmed &&
          trimmed !== sessionKey &&
          normalizeLowercaseStringOrEmpty(trimmed) === normalizedSessionKey
        )
          candidateKeys.add(trimmed);
      }
      let row;
      for (const candidateKey of candidateKeys) {
        const candidateRow = selectAcpSessionRow(database.db, candidateKey);
        if (candidateRow && acpSessionRowMatchesEntry(candidateRow, params.entry)) {
          row = candidateRow;
          break;
        }
      }
      row ??= executeSqliteQuerySync(
        database.db,
        getAcpSessionKysely(database.db)
          .selectFrom("acp_sessions")
          .selectAll()
          .where((eb) => eb.fn("lower", ["session_key"]), "=", normalizedSessionKey)
          .orderBy("last_activity_at", "desc")
          .orderBy("session_key", "asc"),
      ).rows.find(
        (candidate) =>
          candidate.session_key !== sessionKey &&
          acpSessionRowMatchesEntry(candidate, params.entry),
      );
      if (!row) return;
      upsertAcpSessionMetaRow(database.db, {
        ...row,
        session_key: sessionKey,
        updated_at: params.now?.() ?? Date.now(),
      });
      executeSqliteQuerySync(
        database.db,
        getAcpSessionKysely(database.db)
          .deleteFrom("acp_sessions")
          .where("session_key", "=", row.session_key),
      );
      repaired = true;
    },
    {
      env: params.env,
      path: params.databasePath,
    },
  );
  return repaired;
}
function upsertAcpSessionMetaRow(db, row) {
  executeSqliteQuerySync(
    db,
    getAcpSessionKysely(db)
      .insertInto("acp_sessions")
      .values(row)
      .onConflict((conflict) =>
        conflict.column("session_key").doUpdateSet({
          session_id: (eb) => eb.ref("excluded.session_id"),
          backend: (eb) => eb.ref("excluded.backend"),
          agent: (eb) => eb.ref("excluded.agent"),
          runtime_session_name: (eb) => eb.ref("excluded.runtime_session_name"),
          identity_json: (eb) => eb.ref("excluded.identity_json"),
          mode: (eb) => eb.ref("excluded.mode"),
          runtime_options_json: (eb) => eb.ref("excluded.runtime_options_json"),
          cwd: (eb) => eb.ref("excluded.cwd"),
          state: (eb) => eb.ref("excluded.state"),
          last_activity_at: (eb) => eb.ref("excluded.last_activity_at"),
          last_error: (eb) => eb.ref("excluded.last_error"),
          updated_at: (eb) => eb.ref("excluded.updated_at"),
        }),
      ),
  );
}
function readSessionEntryFromStore(params) {
  const { cfg, agentId, storePath } = resolveSessionStorePathForAcp({
    sessionKey: params.sessionKey,
    cfg: params.cfg,
    env: params.env,
  });
  try {
    const entries = listSessionEntries({
      ...(agentId ? { agentId } : {}),
      storePath,
      ...(params.clone === false ? { clone: false } : {}),
    });
    const storeSessionKey = resolveStoreSessionKey(entries, params.sessionKey);
    return {
      cfg,
      agentId,
      storePath,
      storeSessionKey,
      entry: entries.find((candidate) => candidate.sessionKey === storeSessionKey)?.entry,
    };
  } catch {
    return {
      cfg,
      agentId,
      storePath,
      storeSessionKey: normalizeLowercaseStringOrEmpty(params.sessionKey),
      storeReadFailed: true,
    };
  }
}
function readAcpSessionEntry(params) {
  const sessionKey = params.sessionKey.trim();
  if (!sessionKey) return null;
  const storeEntry = readSessionEntryFromStore(params);
  const row = selectAcpSessionRow(
    openOpenClawStateDatabase({
      env: params.env,
      path: params.databasePath,
    }).db,
    storeEntry.storeSessionKey,
  );
  const acp =
    row && acpSessionRowMatchesEntry(row, storeEntry.entry) ? rowToAcpSessionMeta(row) : void 0;
  return {
    cfg: storeEntry.cfg,
    agentId: storeEntry.agentId,
    storePath: storeEntry.storePath,
    sessionKey,
    storeSessionKey: storeEntry.storeSessionKey,
    entry: storeEntry.entry,
    acp,
    storeReadFailed: storeEntry.storeReadFailed,
  };
}
async function listAcpSessionEntries(params) {
  const cfg = params.cfg ?? getRuntimeConfig();
  const rows = selectAcpSessionRows({
    env: params.env,
    path: params.databasePath,
  });
  const entries = [];
  for (const row of rows) {
    const sessionKey = row.session_key;
    const { agentId, storePath } = resolveSessionStorePathForAcp({
      sessionKey,
      cfg,
      env: params.env,
    });
    let sessionEntries;
    try {
      sessionEntries = listSessionEntries({
        ...(agentId ? { agentId } : {}),
        storePath,
        ...(params.clone === false ? { clone: false } : {}),
      });
    } catch {
      continue;
    }
    const storeSessionKey = resolveStoreSessionKey(sessionEntries, sessionKey);
    const entry = sessionEntries.find(
      (candidate) => candidate.sessionKey === storeSessionKey,
    )?.entry;
    if (!entry || !acpSessionRowMatchesEntry(row, entry)) continue;
    entries.push({
      cfg,
      agentId,
      storePath,
      sessionKey,
      storeSessionKey,
      entry,
      acp: rowToAcpSessionMeta(row),
    });
  }
  return entries;
}
function mergeAcpForReturn(entry, acp) {
  return mergeSessionEntry(entry, { acp });
}
function sessionStoreUpdateOptions(params) {
  return {
    activeSessionKey: normalizeLowercaseStringOrEmpty(params.sessionKey),
    ...(params.skipMaintenance === true ? { skipMaintenance: true } : {}),
    ...(params.takeCacheOwnership === true ? { takeCacheOwnership: true } : {}),
  };
}
async function clearLegacyEmbeddedAcpMetadata(params) {
  const sessionKeys = new Set(
    Array.from(params.sessionKeys, (sessionKey) => sessionKey?.trim()).filter((sessionKey) =>
      Boolean(sessionKey),
    ),
  );
  if (sessionKeys.size === 0) return;
  for (const sessionKey of sessionKeys)
    await patchSessionEntryWithKey(
      {
        storePath: params.storePath,
        sessionKey,
      },
      (entry) => {
        if (!entry.acp) return null;
        const next = { ...entry };
        delete next.acp;
        return next;
      },
      {
        replaceEntry: true,
        skipMaintenance: true,
      },
    );
}
async function upsertAcpSessionMeta(params) {
  const sessionKey = params.sessionKey.trim();
  if (!sessionKey) return null;
  const storeEntry = readSessionEntryFromStore({
    sessionKey,
    cfg: params.cfg,
    env: params.env,
    clone: false,
  });
  const { entry } = storeEntry;
  const storageSessionKey = storeEntry.storeSessionKey;
  let current;
  let nextMeta;
  let preparedEntry;
  const updatedAt = params.now?.() ?? Date.now();
  runOpenClawStateWriteTransaction(
    (database) => {
      const currentRow = selectAcpSessionRow(database.db, storageSessionKey);
      current =
        currentRow && acpSessionRowMatchesEntry(currentRow, entry)
          ? rowToAcpSessionMeta(currentRow)
          : void 0;
      preparedEntry = mergeSessionEntry(entry, { updatedAt });
      nextMeta = params.mutate(
        current,
        current ? mergeAcpForReturn(preparedEntry, current) : entry,
      );
    },
    {
      env: params.env,
      path: params.databasePath,
    },
  );
  const metaToPersist = nextMeta;
  if (metaToPersist === void 0)
    return current ? mergeAcpForReturn(entry, current) : (entry ?? null);
  if (metaToPersist === null) {
    const patched = entry
      ? await patchSessionEntryWithKey(
          {
            ...(storeEntry.agentId ? { agentId: storeEntry.agentId } : {}),
            storePath: storeEntry.storePath,
            sessionKey: storageSessionKey,
          },
          (currentEntry) => {
            const next = { ...currentEntry };
            delete next.acp;
            return next;
          },
          {
            ...sessionStoreUpdateOptions({
              ...params,
              sessionKey: storageSessionKey,
            }),
            replaceEntry: true,
          },
        )
      : null;
    runOpenClawStateWriteTransaction(
      (database) => {
        const sessionKeysToDelete = /* @__PURE__ */ new Set([storageSessionKey]);
        if (patched?.sessionKey) sessionKeysToDelete.add(patched.sessionKey);
        for (const key of sessionKeysToDelete)
          executeSqliteQuerySync(
            database.db,
            getAcpSessionKysely(database.db)
              .deleteFrom("acp_sessions")
              .where("session_key", "=", key),
          );
      },
      {
        env: params.env,
        path: params.databasePath,
      },
    );
    await clearLegacyEmbeddedAcpMetadata({
      storePath: storeEntry.storePath,
      sessionKeys: [storageSessionKey, patched?.sessionKey],
    });
    return patched?.entry ?? null;
  }
  const persisted = await patchSessionEntryWithKey(
    {
      ...(storeEntry.agentId ? { agentId: storeEntry.agentId } : {}),
      storePath: storeEntry.storePath,
      sessionKey: storageSessionKey,
    },
    (currentEntry) => {
      const next = mergeSessionEntry(currentEntry, { updatedAt });
      delete next.acp;
      return next;
    },
    {
      ...sessionStoreUpdateOptions({
        ...params,
        sessionKey: storageSessionKey,
      }),
      fallbackEntry: preparedEntry,
      replaceEntry: true,
    },
  );
  if (!persisted) return null;
  await clearLegacyEmbeddedAcpMetadata({
    storePath: storeEntry.storePath,
    sessionKeys: [storageSessionKey, persisted.sessionKey],
  });
  runOpenClawStateWriteTransaction(
    (database) => {
      upsertAcpSessionMetaRow(
        database.db,
        bindAcpSessionMeta({
          sessionKey: persisted.sessionKey,
          sessionId: persisted.entry.sessionId,
          meta: metaToPersist,
          updatedAt,
        }),
      );
      if (persisted.sessionKey !== storageSessionKey)
        executeSqliteQuerySync(
          database.db,
          getAcpSessionKysely(database.db)
            .deleteFrom("acp_sessions")
            .where("session_key", "=", storageSessionKey),
        );
    },
    {
      env: params.env,
      path: params.databasePath,
    },
  );
  return mergeAcpForReturn(persisted.entry, metaToPersist);
}
//#endregion
export {
  repairAcpSessionMetaKeyForMigration as a,
  readAcpSessionMetaForEntry as i,
  readAcpSessionEntry as n,
  upsertAcpSessionMeta as o,
  readAcpSessionMeta as r,
  writeAcpSessionMetaForMigration as s,
  listAcpSessionEntries as t,
};
