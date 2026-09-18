import { isUtf8 } from "node:buffer";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { StringDecoder } from "node:string_decoder";
import { URL } from "node:url";
import { gunzipSync, gzipSync } from "node:zlib";
import { a as sha256Hex } from "./crypto-digest-CNeb2i19.js";
import { r as resolveDebugProxySettings } from "./env-CAvwY92q.js";
import { n as normalizeRequestInitHeadersForFetch } from "./fetch-headers-DPnOMwOE.js";
import { t as requireNodeSqlite } from "./node-sqlite-BJtdZavS.js";
import {
  M as resolveSqliteDatabaseFilePaths,
  N as applyPrivateModeSync,
  s as openOpenClawStateDatabase,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import {
  h as redactRegisteredSecretValues,
  p as hasRegisteredSecretValuesForRedaction,
} from "./redact-CUe6Oey5.js";
import { r as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DLqNjJHV.js";
import {
  i as registerSqliteCacheExitClose,
  t as configureSqliteConnectionPragmas,
} from "./sqlite-wal-C_AVzaTm.js";
import { o as normalizeNullableString } from "./string-coerce-DW4mBlAt.js";
import { p as normalizeUniqueStringEntries } from "./string-normalization-CRyoFBPt.js";
//#region src/proxy-capture/store.sqlite.ts
const DEBUG_PROXY_CAPTURE_DIR_MODE = 448;
const DEBUG_PROXY_CAPTURE_FILE_MODE = 384;
function isInMemoryDatabasePath(dbPath) {
  if (dbPath === ":memory:") return true;
  if (!dbPath.startsWith("file:")) return false;
  const fragmentIndex = dbPath.indexOf("#");
  const uriWithoutFragment = fragmentIndex === -1 ? dbPath : dbPath.slice(0, fragmentIndex);
  const queryIndex = uriWithoutFragment.indexOf("?");
  const uriPath = queryIndex === -1 ? uriWithoutFragment : uriWithoutFragment.slice(0, queryIndex);
  try {
    if (decodeURIComponent(uriPath.slice(5)) === ":memory:") return true;
  } catch {}
  return (
    queryIndex !== -1 &&
    new URLSearchParams(uriWithoutFragment.slice(queryIndex + 1)).get("mode") === "memory"
  );
}
function hardenLegacyDatabaseFiles(dbPath) {
  for (const candidate of resolveSqliteDatabaseFilePaths(dbPath))
    if (fs.existsSync(candidate)) applyPrivateModeSync(candidate, DEBUG_PROXY_CAPTURE_FILE_MODE);
}
function openPathBasedDebugProxyCaptureStore(dbPath, blobDir) {
  const fileBackedPath = isInMemoryDatabasePath(dbPath) ? void 0 : dbPath;
  if (fileBackedPath) {
    fs.mkdirSync(path.dirname(fileBackedPath), {
      recursive: true,
      mode: DEBUG_PROXY_CAPTURE_DIR_MODE,
    });
    if (!fs.existsSync(fileBackedPath))
      fs.closeSync(fs.openSync(fileBackedPath, "a", DEBUG_PROXY_CAPTURE_FILE_MODE));
  }
  const { DatabaseSync } = requireNodeSqlite();
  const db = new DatabaseSync(dbPath);
  let walMaintenance;
  try {
    if (fileBackedPath) applyPrivateModeSync(fileBackedPath, DEBUG_PROXY_CAPTURE_FILE_MODE);
    walMaintenance = configureSqliteConnectionPragmas(db, {
      busyTimeoutMs: 5e3,
      databaseLabel: "debug-proxy-capture-sdk",
      ...(fileBackedPath ? { databasePath: fileBackedPath } : {}),
      foreignKeys: true,
    });
    db.exec(`
      CREATE TABLE IF NOT EXISTS capture_sessions (
        id TEXT PRIMARY KEY,
        started_at INTEGER NOT NULL,
        ended_at INTEGER,
        mode TEXT NOT NULL,
        source_scope TEXT NOT NULL,
        source_process TEXT NOT NULL,
        proxy_url TEXT,
        db_path TEXT NOT NULL,
        blob_dir TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS capture_events (
        id INTEGER PRIMARY KEY,
        session_id TEXT NOT NULL,
        ts INTEGER NOT NULL,
        source_scope TEXT NOT NULL,
        source_process TEXT NOT NULL,
        protocol TEXT NOT NULL,
        direction TEXT NOT NULL,
        kind TEXT NOT NULL,
        flow_id TEXT NOT NULL,
        method TEXT,
        host TEXT,
        path TEXT,
        status INTEGER,
        close_code INTEGER,
        content_type TEXT,
        headers_json TEXT,
        data_text TEXT,
        data_blob_id TEXT,
        data_sha256 TEXT,
        error_text TEXT,
        meta_json TEXT
      );
      CREATE INDEX IF NOT EXISTS capture_events_session_ts_idx ON capture_events(session_id, ts);
      CREATE INDEX IF NOT EXISTS capture_events_flow_idx ON capture_events(flow_id, ts);
    `);
    if (fileBackedPath) hardenLegacyDatabaseFiles(fileBackedPath);
    return {
      db,
      pathBased: {
        blobDir,
        walMaintenance,
      },
    };
  } catch (err) {
    walMaintenance?.close();
    db.close();
    throw err;
  }
}
function serializeJson(value) {
  return value == null ? null : JSON.stringify(value);
}
function parseMetaJson(metaJson) {
  if (typeof metaJson !== "string" || metaJson.trim().length === 0) return null;
  try {
    const parsed = JSON.parse(metaJson);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}
function sortObservedCounts(counts) {
  return [...counts.entries()]
    .map(([value, count]) => ({
      value,
      count,
    }))
    .toSorted((left, right) => right.count - left.count || left.value.localeCompare(right.value));
}
var DebugProxyCaptureStoreImpl = class {
  constructor(optionsOrDbPath = {}, legacyBlobDir) {
    this.closed = false;
    if (typeof optionsOrDbPath === "string") {
      if (!legacyBlobDir)
        throw new TypeError("legacy debug proxy capture store requires a blob directory");
      const opened = openPathBasedDebugProxyCaptureStore(optionsOrDbPath, legacyBlobDir);
      this.db = opened.db;
      this.dbPath = optionsOrDbPath;
      this.blobDir = legacyBlobDir;
      this.pathBased = opened.pathBased;
      return;
    }
    const database = openOpenClawStateDatabase({ env: optionsOrDbPath.env });
    this.db = database.db;
    this.dbPath = database.path;
    this.blobDir = database.path;
  }
  close() {
    if (this.closed) return;
    if (this.pathBased) {
      this.pathBased.walMaintenance.close();
      this.db.close();
    }
    this.closed = true;
  }
  get isClosed() {
    return this.closed || !this.db.isOpen;
  }
  upsertSession(session) {
    if (this.pathBased) {
      this.db
        .prepare(`INSERT INTO capture_sessions (
            id, started_at, ended_at, mode, source_scope, source_process, proxy_url, db_path, blob_dir
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            ended_at=excluded.ended_at,
            proxy_url=excluded.proxy_url,
            source_process=excluded.source_process`)
        .run(
          session.id,
          session.startedAt,
          session.endedAt ?? null,
          session.mode,
          session.sourceScope,
          session.sourceProcess,
          session.proxyUrl ?? null,
          session.dbPath ?? this.dbPath,
          session.blobDir ?? this.pathBased.blobDir,
        );
      return;
    }
    this.db
      .prepare(`INSERT INTO capture_sessions (
          id, started_at, ended_at, mode, source_scope, source_process, proxy_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          started_at=MIN(capture_sessions.started_at, excluded.started_at),
          ended_at=excluded.ended_at,
          mode=CASE
            WHEN capture_sessions.mode = 'implicit' THEN excluded.mode
            ELSE capture_sessions.mode
          END,
          proxy_url=excluded.proxy_url,
          source_process=excluded.source_process`)
      .run(
        session.id,
        session.startedAt,
        session.endedAt ?? null,
        session.mode,
        session.sourceScope,
        session.sourceProcess,
        session.proxyUrl ?? null,
      );
  }
  endSession(sessionId, endedAt = Date.now()) {
    this.db
      .prepare(`UPDATE capture_sessions SET ended_at = ? WHERE id = ?`)
      .run(endedAt, sessionId);
  }
  persistPayload(data, contentType) {
    const sha256 = sha256Hex(data);
    const blobId = sha256.slice(0, 24);
    if (this.pathBased) {
      fs.mkdirSync(this.pathBased.blobDir, {
        recursive: true,
        mode: DEBUG_PROXY_CAPTURE_DIR_MODE,
      });
      const outputPath = path.join(this.pathBased.blobDir, `${blobId}.bin.gz`);
      if (!fs.existsSync(outputPath))
        fs.writeFileSync(outputPath, gzipSync(data), { mode: DEBUG_PROXY_CAPTURE_FILE_MODE });
      applyPrivateModeSync(outputPath, DEBUG_PROXY_CAPTURE_FILE_MODE);
      return {
        blobId,
        path: outputPath,
        encoding: "gzip",
        sizeBytes: data.byteLength,
        sha256,
        ...(contentType ? { contentType } : {}),
      };
    }
    this.db
      .prepare(`INSERT OR IGNORE INTO capture_blobs (
          blob_id, content_type, encoding, size_bytes, sha256, data, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .run(
        blobId,
        contentType ?? null,
        "gzip",
        data.byteLength,
        sha256,
        gzipSync(data),
        Date.now(),
      );
    return {
      blobId,
      encoding: "gzip",
      sizeBytes: data.byteLength,
      sha256,
      ...(contentType ? { contentType } : {}),
    };
  }
  recordEvent(event) {
    if (this.pathBased) {
      this.insertEvent(event, event.dataBlobId ?? null);
      return;
    }
    runSqliteImmediateTransactionSync(this.db, () => {
      this.db
        .prepare(`INSERT OR IGNORE INTO capture_sessions (
            id, started_at, mode, source_scope, source_process
          ) VALUES (?, ?, 'implicit', ?, ?)`)
        .run(event.sessionId, event.ts, event.sourceScope, event.sourceProcess);
      const dataBlobId =
        event.dataBlobId &&
        this.db.prepare(`SELECT 1 FROM capture_blobs WHERE blob_id = ?`).get(event.dataBlobId)
          ? event.dataBlobId
          : null;
      this.insertEvent(event, dataBlobId);
    });
  }
  insertEvent(event, dataBlobId) {
    this.db
      .prepare(`INSERT INTO capture_events (
          session_id, ts, source_scope, source_process, protocol, direction, kind, flow_id,
          method, host, path, status, close_code, content_type, headers_json,
          data_text, data_blob_id, data_sha256, error_text, meta_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(
        event.sessionId,
        event.ts,
        event.sourceScope,
        event.sourceProcess,
        event.protocol,
        event.direction,
        event.kind,
        event.flowId,
        event.method ?? null,
        event.host ?? null,
        event.path ?? null,
        event.status ?? null,
        event.closeCode ?? null,
        event.contentType ?? null,
        event.headersJson ?? null,
        event.dataText ?? null,
        dataBlobId,
        event.dataSha256 ?? null,
        event.errorText ?? null,
        event.metaJson ?? null,
      );
  }
  listSessions(limit = 50) {
    return this.db
      .prepare(`SELECT
           s.id,
           s.started_at AS startedAt,
           s.ended_at AS endedAt,
           s.mode,
           s.source_process AS sourceProcess,
           s.proxy_url AS proxyUrl,
           COUNT(e.id) AS eventCount
         FROM capture_sessions s
         LEFT JOIN capture_events e ON e.session_id = s.id
         GROUP BY s.id
         ORDER BY s.started_at DESC
         LIMIT ?`)
      .all(limit);
  }
  getSessionEvents(sessionId, limit = 500) {
    return this.db
      .prepare(`SELECT
           id, session_id AS sessionId, ts, source_scope AS sourceScope, source_process AS sourceProcess,
           protocol, direction, kind, flow_id AS flowId, method, host, path, status, close_code AS closeCode,
           content_type AS contentType, headers_json AS headersJson, data_text AS dataText,
           data_blob_id AS dataBlobId, data_sha256 AS dataSha256, error_text AS errorText, meta_json AS metaJson
         FROM capture_events
         WHERE session_id = ?
         ORDER BY ts DESC, id DESC
         LIMIT ?`)
      .all(sessionId, limit);
  }
  summarizeSessionCoverage(sessionId) {
    const rows = this.db
      .prepare(`SELECT host, meta_json AS metaJson
         FROM capture_events
         WHERE session_id = ?`)
      .all(sessionId);
    const providers = /* @__PURE__ */ new Map();
    const apis = /* @__PURE__ */ new Map();
    const models = /* @__PURE__ */ new Map();
    const hosts = /* @__PURE__ */ new Map();
    const localPeers = /* @__PURE__ */ new Map();
    let unlabeledEventCount = 0;
    for (const row of rows) {
      const meta = parseMetaJson(row.metaJson);
      const provider = normalizeNullableString(meta?.provider);
      const api = normalizeNullableString(meta?.api);
      const model = normalizeNullableString(meta?.model);
      const host = normalizeNullableString(row.host);
      if (!provider && !api && !model) unlabeledEventCount += 1;
      if (provider) providers.set(provider, (providers.get(provider) ?? 0) + 1);
      if (api) apis.set(api, (apis.get(api) ?? 0) + 1);
      if (model) models.set(model, (models.get(model) ?? 0) + 1);
      if (host) {
        hosts.set(host, (hosts.get(host) ?? 0) + 1);
        if (
          host === "127.0.0.1:11434" ||
          host.startsWith("127.0.0.1:") ||
          host.startsWith("localhost:")
        )
          localPeers.set(host, (localPeers.get(host) ?? 0) + 1);
      }
    }
    return {
      sessionId,
      totalEvents: rows.length,
      unlabeledEventCount,
      providers: sortObservedCounts(providers),
      apis: sortObservedCounts(apis),
      models: sortObservedCounts(models),
      hosts: sortObservedCounts(hosts),
      localPeers: sortObservedCounts(localPeers),
    };
  }
  readBlob(blobId) {
    if (this.pathBased) {
      const legacyRow = this.db
        .prepare(`SELECT data_blob_id AS blobId FROM capture_events WHERE data_blob_id = ? LIMIT 1`)
        .get(blobId);
      if (!legacyRow?.blobId) return null;
      const blobPath = path.join(this.pathBased.blobDir, `${legacyRow.blobId}.bin.gz`);
      return fs.existsSync(blobPath)
        ? gunzipSync(fs.readFileSync(blobPath)).toString("utf8")
        : null;
    }
    const row = this.db
      .prepare(`SELECT encoding, data FROM capture_blobs WHERE blob_id = ?`)
      .get(blobId);
    if (row?.data) {
      const data = Buffer.from(row.data);
      return (row.encoding === "gzip" ? gunzipSync(data) : data).toString("utf8");
    }
    return null;
  }
  queryPreset(preset, sessionId) {
    const sessionWhere = sessionId ? "AND session_id = ?" : "";
    const args = sessionId ? [sessionId] : [];
    switch (preset) {
      case "double-sends":
        return this.db
          .prepare(`SELECT host, path, method, COUNT(*) AS duplicateCount
             FROM capture_events
             WHERE kind = 'request' ${sessionWhere}
             GROUP BY host, path, method, data_sha256
             HAVING COUNT(*) > 1
             ORDER BY duplicateCount DESC, host ASC`)
          .all(...args);
      case "retry-storms":
        return this.db
          .prepare(`SELECT host, path, COUNT(*) AS errorCount
             FROM capture_events
             WHERE kind = 'response' AND status >= 429 ${sessionWhere}
             GROUP BY host, path
             HAVING COUNT(*) > 1
             ORDER BY errorCount DESC, host ASC`)
          .all(...args);
      case "cache-busting":
        return this.db
          .prepare(`SELECT host, path, COUNT(*) AS variantCount
             FROM capture_events
             WHERE kind = 'request'
               AND (path LIKE '%?%' OR headers_json LIKE '%cache-control%' OR headers_json LIKE '%pragma%')
               ${sessionWhere}
             GROUP BY host, path
             ORDER BY variantCount DESC, host ASC`)
          .all(...args);
      case "ws-duplicate-frames":
        return this.db
          .prepare(`SELECT host, path, COUNT(*) AS duplicateFrames
             FROM capture_events
             WHERE kind = 'ws-frame' AND direction = 'outbound' ${sessionWhere}
             GROUP BY host, path, data_sha256
             HAVING COUNT(*) > 1
             ORDER BY duplicateFrames DESC, host ASC`)
          .all(...args);
      case "missing-ack":
        return this.db
          .prepare(`SELECT flow_id AS flowId, host, path, COUNT(*) AS outboundFrames
             FROM capture_events
             WHERE kind = 'ws-frame' AND direction = 'outbound' ${sessionWhere}
               AND flow_id NOT IN (
                 SELECT flow_id FROM capture_events
                 WHERE kind = 'ws-frame' AND direction = 'inbound' ${sessionId ? "AND session_id = ?" : ""}
               )
             GROUP BY flow_id, host, path
             ORDER BY outboundFrames DESC`)
          .all(...(sessionId ? [sessionId, sessionId] : []));
      case "error-bursts":
        return this.db
          .prepare(`SELECT host, path, COUNT(*) AS errorCount
             FROM capture_events
             WHERE kind = 'error' ${sessionWhere}
             GROUP BY host, path
             ORDER BY errorCount DESC, host ASC`)
          .all(...args);
      default:
        return [];
    }
  }
  purgeAll() {
    if (this.pathBased) {
      const sessionCount =
        this.db.prepare(`SELECT COUNT(*) AS count FROM capture_sessions`).get().count ?? 0;
      const eventCount =
        this.db.prepare(`SELECT COUNT(*) AS count FROM capture_events`).get().count ?? 0;
      this.db.exec(`DELETE FROM capture_events; DELETE FROM capture_sessions;`);
      let blobs = 0;
      if (fs.existsSync(this.pathBased.blobDir))
        for (const entry of fs.readdirSync(this.pathBased.blobDir)) {
          fs.rmSync(path.join(this.pathBased.blobDir, entry), { force: true });
          blobs += 1;
        }
      return {
        sessions: sessionCount,
        events: eventCount,
        blobs,
      };
    }
    return runSqliteImmediateTransactionSync(this.db, () => {
      const sessionCount =
        this.db.prepare(`SELECT COUNT(*) AS count FROM capture_sessions`).get().count ?? 0;
      const eventCount =
        this.db.prepare(`SELECT COUNT(*) AS count FROM capture_events`).get().count ?? 0;
      const blobCount =
        this.db.prepare(`SELECT COUNT(*) AS count FROM capture_blobs`).get().count ?? 0;
      this.db.exec(
        `DELETE FROM capture_events; DELETE FROM capture_sessions; DELETE FROM capture_blobs;`,
      );
      return {
        sessions: sessionCount,
        events: eventCount,
        blobs: blobCount,
      };
    });
  }
  deleteSessions(sessionIds) {
    const uniqueSessionIds = normalizeUniqueStringEntries(sessionIds);
    if (uniqueSessionIds.length === 0)
      return {
        sessions: 0,
        events: 0,
        blobs: 0,
      };
    if (this.pathBased) return this.deletePathBasedSessions(uniqueSessionIds);
    return runSqliteImmediateTransactionSync(this.db, () => {
      const placeholders = uniqueSessionIds.map(() => "?").join(", ");
      const blobRows = this.db
        .prepare(`SELECT DISTINCT data_blob_id AS blobId
           FROM capture_events
           WHERE session_id IN (${placeholders})
             AND data_blob_id IS NOT NULL`)
        .all(...uniqueSessionIds);
      const eventCount =
        this.db
          .prepare(`SELECT COUNT(*) AS count
               FROM capture_events
               WHERE session_id IN (${placeholders})`)
          .get(...uniqueSessionIds).count ?? 0;
      const sessionCount =
        this.db
          .prepare(`SELECT COUNT(*) AS count
               FROM capture_sessions
               WHERE id IN (${placeholders})`)
          .get(...uniqueSessionIds).count ?? 0;
      this.db
        .prepare(`DELETE FROM capture_events WHERE session_id IN (${placeholders})`)
        .run(...uniqueSessionIds);
      this.db
        .prepare(`DELETE FROM capture_sessions WHERE id IN (${placeholders})`)
        .run(...uniqueSessionIds);
      const candidateBlobIds = blobRows
        .map((row) => row.blobId?.trim())
        .filter((blobId) => Boolean(blobId));
      const remainingBlobRefs =
        candidateBlobIds.length > 0
          ? new Set(
              this.db
                .prepare(`SELECT DISTINCT data_blob_id AS blobId
                     FROM capture_events
                     WHERE data_blob_id IN (${candidateBlobIds.map(() => "?").join(", ")})
                       AND data_blob_id IS NOT NULL`)
                .all(...candidateBlobIds)
                .map((row) => row.blobId?.trim())
                .filter((blobId) => Boolean(blobId)),
            )
          : /* @__PURE__ */ new Set();
      let blobs = 0;
      const deleteBlob = this.db.prepare(`DELETE FROM capture_blobs WHERE blob_id = ?`);
      for (const blobId of candidateBlobIds) {
        if (remainingBlobRefs.has(blobId)) continue;
        const result = deleteBlob.run(blobId);
        if (Number(result.changes) > 0) blobs += 1;
      }
      return {
        sessions: sessionCount,
        events: eventCount,
        blobs,
      };
    });
  }
  deletePathBasedSessions(sessionIds) {
    const pathBased = this.pathBased;
    if (!pathBased) throw new Error("path-based debug proxy capture store is unavailable");
    const placeholders = sessionIds.map(() => "?").join(", ");
    const blobRows = this.db
      .prepare(`SELECT DISTINCT data_blob_id AS blobId
         FROM capture_events
         WHERE session_id IN (${placeholders})
           AND data_blob_id IS NOT NULL`)
      .all(...sessionIds);
    const eventCount =
      this.db
        .prepare(`SELECT COUNT(*) AS count
             FROM capture_events
             WHERE session_id IN (${placeholders})`)
        .get(...sessionIds).count ?? 0;
    const sessionCount =
      this.db
        .prepare(`SELECT COUNT(*) AS count
             FROM capture_sessions
             WHERE id IN (${placeholders})`)
        .get(...sessionIds).count ?? 0;
    this.db
      .prepare(`DELETE FROM capture_events WHERE session_id IN (${placeholders})`)
      .run(...sessionIds);
    this.db
      .prepare(`DELETE FROM capture_sessions WHERE id IN (${placeholders})`)
      .run(...sessionIds);
    const candidateBlobIds = blobRows
      .map((row) => row.blobId?.trim())
      .filter((blobId) => Boolean(blobId));
    const remainingBlobRefs =
      candidateBlobIds.length > 0
        ? new Set(
            this.db
              .prepare(`SELECT DISTINCT data_blob_id AS blobId
                   FROM capture_events
                   WHERE data_blob_id IN (${candidateBlobIds.map(() => "?").join(", ")})
                     AND data_blob_id IS NOT NULL`)
              .all(...candidateBlobIds)
              .map((row) => row.blobId?.trim())
              .filter((blobId) => Boolean(blobId)),
          )
        : /* @__PURE__ */ new Set();
    let blobs = 0;
    for (const blobId of candidateBlobIds) {
      if (remainingBlobRefs.has(blobId)) continue;
      const blobPath = path.join(pathBased.blobDir, `${blobId}.bin.gz`);
      if (fs.existsSync(blobPath)) {
        fs.rmSync(blobPath, { force: true });
        blobs += 1;
      }
    }
    return {
      sessions: sessionCount,
      events: eventCount,
      blobs,
    };
  }
};
const DebugProxyCaptureStore = DebugProxyCaptureStoreImpl;
const cachedStores = /* @__PURE__ */ new Map();
let unregisterExitClose = null;
function resolveDebugProxyCaptureStoreKey(optionsOrDbPath, legacyBlobDir) {
  return typeof optionsOrDbPath === "string"
    ? `legacy:${optionsOrDbPath}:${legacyBlobDir ?? ""}`
    : `shared:${openOpenClawStateDatabase({ env: optionsOrDbPath.env }).path}`;
}
function getDebugProxyCaptureStoreImpl(optionsOrDbPath = {}, legacyBlobDir) {
  const key = resolveDebugProxyCaptureStoreKey(optionsOrDbPath, legacyBlobDir);
  const cached = cachedStores.get(key);
  if (cached && !cached.store.isClosed) return cached.store;
  const store = new DebugProxyCaptureStoreImpl(optionsOrDbPath, legacyBlobDir);
  cachedStores.set(key, {
    store,
    leases: 0,
  });
  unregisterExitClose ??= registerSqliteCacheExitClose(closeDebugProxyCaptureStore);
  return store;
}
function getDebugProxyCaptureStore(optionsOrDbPath = {}, legacyBlobDir) {
  return getDebugProxyCaptureStoreImpl(optionsOrDbPath, legacyBlobDir);
}
function closeDebugProxyCaptureStore() {
  unregisterExitClose?.();
  unregisterExitClose = null;
  for (const cached of cachedStores.values()) cached.store.close();
  cachedStores.clear();
}
function acquireDebugProxyCaptureStore(optionsOrDbPath = {}, legacyBlobDir) {
  const key = resolveDebugProxyCaptureStoreKey(optionsOrDbPath, legacyBlobDir);
  const store = getDebugProxyCaptureStoreImpl(optionsOrDbPath, legacyBlobDir);
  const cached = cachedStores.get(key);
  if (!cached || cached.store !== store)
    throw new Error("debug proxy capture store cache changed while acquiring a lease");
  cached.leases += 1;
  let released = false;
  return {
    store,
    release: () => {
      if (released) return;
      released = true;
      const current = cachedStores.get(key);
      if (!current || current.store !== store) return;
      current.leases = Math.max(0, current.leases - 1);
      if (current.leases === 0) {
        current.store.close();
        cachedStores.delete(key);
      }
    },
  };
}
function persistEventPayload(store, params) {
  if (params.data == null) return {};
  const buffer = Buffer.isBuffer(params.data) ? params.data : Buffer.from(params.data);
  const previewLimit = params.previewLimit ?? 8192;
  const blob = store.persistPayload(buffer, params.contentType);
  return {
    dataText: new StringDecoder("utf8").write(buffer.subarray(0, previewLimit)),
    dataBlobId: blob.blobId,
    dataSha256: blob.sha256,
  };
}
function safeJsonString(value) {
  return serializeJson(value) ?? void 0;
}
//#endregion
//#region src/proxy-capture/runtime.ts
const DEBUG_PROXY_FETCH_PATCH_KEY = Symbol.for("openclaw.debugProxy.fetchPatch");
const REDACTED_CAPTURE_HEADER_VALUE = "[REDACTED]";
const REDACTED_CAPTURE_BINARY_PAYLOAD = Buffer.from("[REDACTED BINARY PAYLOAD]", "utf8");
const MAX_CAPTURED_RESPONSE_BODY_BYTES = 16 * 1024 * 1024;
async function readCapturedResponseBodyBounded(response, maxBytes) {
  const clone = response.clone();
  const body = clone.body;
  if (!body || typeof body.getReader !== "function") {
    const bytes = Buffer.from(await clone.arrayBuffer());
    return bytes.length > maxBytes
      ? {
          buffer: Buffer.alloc(0),
          truncated: true,
        }
      : {
          buffer: bytes,
          truncated: false,
        };
  }
  const reader = body.getReader();
  const chunks = [];
  let total = 0;
  let truncated = false;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value?.length) continue;
      if (total + value.length > maxBytes) {
        truncated = true;
        break;
      }
      chunks.push(Buffer.from(value));
      total += value.length;
    }
  } finally {
    if (truncated) reader.cancel().catch(() => void 0);
    try {
      reader.releaseLock();
    } catch {}
  }
  return truncated
    ? {
        buffer: Buffer.alloc(0),
        truncated: true,
      }
    : {
        buffer: Buffer.concat(chunks, total),
        truncated: false,
      };
}
const SENSITIVE_CAPTURE_HEADER_NAMES = /* @__PURE__ */ new Set([
  "authorization",
  "proxy-authorization",
  "cookie",
  "set-cookie",
  "x-api-key",
  "api-key",
  "apikey",
  "x-auth-token",
  "auth-token",
  "x-access-token",
  "access-token",
]);
const SENSITIVE_CAPTURE_HEADER_NAME_FRAGMENTS = [
  "api-key",
  "apikey",
  "token",
  "secret",
  "password",
  "credential",
  "session",
];
function resolveRuntimeDeps(deps = {}) {
  return {
    getStore: deps.getStore ?? getDebugProxyCaptureStore,
    closeStore: deps.closeStore ?? closeDebugProxyCaptureStore,
    persistEventPayload:
      deps.persistEventPayload ?? ((store, payload) => persistEventPayload(store, payload)),
    safeJsonString: deps.safeJsonString ?? safeJsonString,
    fetchTarget: deps.fetchTarget ?? globalThis,
  };
}
function protocolFromUrl(rawUrl) {
  try {
    switch (new URL(rawUrl).protocol) {
      case "https:":
        return "https";
      case "wss:":
        return "wss";
      case "ws:":
        return "ws";
      default:
        return "http";
    }
  } catch {
    return "http";
  }
}
function resolveUrlString(input) {
  if (input instanceof URL) return input.toString();
  if (typeof input === "string") return input;
  if (typeof Request !== "undefined" && input instanceof Request) return input.url;
  return null;
}
function isSensitiveCaptureHeaderName(name) {
  const normalized = name.trim().toLowerCase();
  if (!normalized) return false;
  if (SENSITIVE_CAPTURE_HEADER_NAMES.has(normalized)) return true;
  return SENSITIVE_CAPTURE_HEADER_NAME_FRAGMENTS.some((fragment) => normalized.includes(fragment));
}
function redactedCaptureHeaders(headers) {
  if (!headers) return;
  const entries =
    headers instanceof Headers ? Array.from(headers.entries()) : Object.entries(headers);
  const redacted = {};
  for (const [name, value] of entries)
    redacted[name] = isSensitiveCaptureHeaderName(name)
      ? REDACTED_CAPTURE_HEADER_VALUE
      : redactRegisteredSecretValues(value, () => REDACTED_CAPTURE_HEADER_VALUE);
  return redacted;
}
function redactCaptureUrl(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    return "https://redacted.invalid/%5BREDACTED%5D";
  }
  const redactComponent = (value) =>
    redactRegisteredSecretValues(value, () => REDACTED_CAPTURE_HEADER_VALUE);
  const decodeComponent = (value) => {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  };
  if (redactComponent(url.hostname) !== url.hostname) url.hostname = "redacted.invalid";
  for (const key of ["username", "password"]) {
    const decoded = decodeComponent(url[key]);
    const redacted = redactComponent(decoded);
    if (redacted !== decoded) url[key] = redacted;
  }
  url.pathname = url.pathname
    .split("/")
    .map((segment) => {
      try {
        const decoded = decodeURIComponent(segment);
        const redacted = redactComponent(decoded);
        return redacted === decoded ? segment : encodeURIComponent(redacted);
      } catch {
        return segment;
      }
    })
    .join("/");
  const searchParams = new URLSearchParams();
  let searchChanged = false;
  for (const [name, value] of url.searchParams.entries()) {
    const redactedName = redactComponent(name);
    const redactedValue = redactComponent(value);
    searchParams.append(redactedName, redactedValue);
    if (redactedName !== name || redactedValue !== value) searchChanged = true;
  }
  if (searchChanged) url.search = searchParams.toString();
  const decodedHash = decodeComponent(url.hash.slice(1));
  const redactedHash = redactComponent(decodedHash);
  if (redactedHash !== decodedHash) url.hash = redactedHash;
  const serialized = url.toString();
  return redactComponent(serialized) === serialized
    ? serialized
    : `${url.protocol}//redacted.invalid/%5BREDACTED%5D`;
}
function redactCaptureText(value) {
  return redactRegisteredSecretValues(value, () => REDACTED_CAPTURE_HEADER_VALUE);
}
function redactCapturePayload(value) {
  if (typeof value === "string") return redactCaptureText(value);
  if (!Buffer.isBuffer(value)) return value ?? null;
  if (!isUtf8(value))
    return hasRegisteredSecretValuesForRedaction() ? REDACTED_CAPTURE_BINARY_PAYLOAD : value;
  const text = value.toString("utf8");
  const redacted = redactCaptureText(text);
  return redacted === text ? value : Buffer.from(redacted, "utf8");
}
function redactedCaptureJson(value, stringify = safeJsonString) {
  const serialized = stringify(value);
  return serialized === void 0 ? void 0 : redactCaptureText(serialized);
}
function createHttpCaptureEventBase(params) {
  return {
    sessionId: params.settings.sessionId,
    ts: Date.now(),
    sourceScope: "openclaw",
    sourceProcess: params.settings.sourceProcess,
    protocol: params.transport ?? protocolFromUrl(params.rawUrl),
    direction: params.direction,
    kind: params.kind,
    flowId: params.flowId,
    method: params.method,
    host: params.url.host,
    path: `${params.url.pathname}${params.url.search}`,
  };
}
function installDebugProxyGlobalFetchPatch(settings, deps = {}) {
  const runtime = resolveRuntimeDeps(deps);
  const fetchTarget = runtime.fetchTarget;
  if (typeof fetchTarget.fetch !== "function") return;
  if (fetchTarget[DEBUG_PROXY_FETCH_PATCH_KEY]) return;
  const fetchImpl = fetchTarget.fetch;
  const originalFetch = fetchImpl.bind(fetchTarget);
  fetchTarget[DEBUG_PROXY_FETCH_PATCH_KEY] = { originalFetch };
  const patchedFetch = async (input, init) => {
    const url = resolveUrlString(input);
    const normalizedInit = normalizeRequestInitHeadersForFetch(init);
    try {
      const response = await originalFetch(input, normalizedInit);
      if (url && /^https?:/i.test(url))
        captureHttpExchange(
          {
            url,
            method:
              (typeof Request !== "undefined" && input instanceof Request
                ? input.method
                : void 0) ??
              normalizedInit?.method ??
              "GET",
            requestHeaders:
              (typeof Request !== "undefined" && input instanceof Request
                ? input.headers
                : void 0) ?? normalizedInit?.headers,
            requestBody:
              (typeof Request !== "undefined" && input instanceof Request ? input.body : void 0) ??
              normalizedInit?.body ??
              null,
            response,
            transport: "http",
            meta: {
              captureOrigin: "global-fetch",
              source: settings.sourceProcess,
            },
          },
          settings,
          deps,
        );
      return response;
    } catch (error) {
      if (url && /^https?:/i.test(url)) {
        const store = runtime.getStore();
        const captureUrl = redactCaptureUrl(url);
        const parsed = new URL(captureUrl);
        store.recordEvent({
          sessionId: settings.sessionId,
          ts: Date.now(),
          sourceScope: "openclaw",
          sourceProcess: settings.sourceProcess,
          protocol: protocolFromUrl(captureUrl),
          direction: "local",
          kind: "error",
          flowId: randomUUID(),
          method:
            (typeof Request !== "undefined" && input instanceof Request ? input.method : void 0) ??
            normalizedInit?.method ??
            "GET",
          host: parsed.host,
          path: `${parsed.pathname}${parsed.search}`,
          errorText: redactCaptureText(error instanceof Error ? error.message : String(error)),
          metaJson: redactedCaptureJson({ captureOrigin: "global-fetch" }, runtime.safeJsonString),
        });
      }
      throw error;
    }
  };
  const mockState = fetchImpl.mock;
  if (typeof mockState === "object" && mockState !== null) patchedFetch.mock = mockState;
  fetchTarget.fetch = patchedFetch;
}
function uninstallDebugProxyGlobalFetchPatch(deps = {}) {
  const fetchTarget = resolveRuntimeDeps(deps).fetchTarget;
  const state = fetchTarget[DEBUG_PROXY_FETCH_PATCH_KEY];
  if (!state) return;
  fetchTarget.fetch = state.originalFetch;
  delete fetchTarget[DEBUG_PROXY_FETCH_PATCH_KEY];
}
function isDebugProxyGlobalFetchPatchInstalled() {
  return Boolean(globalThis[DEBUG_PROXY_FETCH_PATCH_KEY]);
}
function initializeDebugProxyCapture(mode, resolved, deps = {}) {
  const settings = resolved ?? resolveDebugProxySettings();
  if (!settings.enabled) return;
  resolveRuntimeDeps(deps).getStore().upsertSession({
    id: settings.sessionId,
    startedAt: Date.now(),
    mode,
    sourceScope: "openclaw",
    sourceProcess: settings.sourceProcess,
    proxyUrl: settings.proxyUrl,
  });
  installDebugProxyGlobalFetchPatch(settings, deps);
}
function finalizeDebugProxyCapture(resolved, deps = {}) {
  const settings = resolved ?? resolveDebugProxySettings();
  if (!settings.enabled) return;
  const runtime = resolveRuntimeDeps(deps);
  runtime.getStore().endSession(settings.sessionId);
  uninstallDebugProxyGlobalFetchPatch(deps);
  runtime.closeStore();
}
function captureHttpExchange(params, resolved, deps = {}) {
  const settings = resolved ?? resolveDebugProxySettings();
  if (!settings.enabled) return;
  const runtime = resolveRuntimeDeps(deps);
  const store = runtime.getStore();
  const flowId = params.flowId ?? randomUUID();
  const captureUrl = redactCaptureUrl(params.url);
  const url = new URL(captureUrl);
  const requestBody =
    typeof params.requestBody === "string" || Buffer.isBuffer(params.requestBody)
      ? params.requestBody
      : null;
  const rawRequestContentType =
    params.requestHeaders instanceof Headers
      ? (params.requestHeaders.get("content-type") ?? void 0)
      : params.requestHeaders?.["content-type"];
  const requestContentType =
    rawRequestContentType === void 0 ? void 0 : redactCaptureText(rawRequestContentType);
  const rawResponseContentType =
    typeof params.response.headers?.get === "function"
      ? (params.response.headers.get("content-type") ?? void 0)
      : void 0;
  const responseContentType =
    rawResponseContentType === void 0 ? void 0 : redactCaptureText(rawResponseContentType);
  const requestPayload = runtime.persistEventPayload(store, {
    data: redactCapturePayload(requestBody),
    contentType: requestContentType,
  });
  store.recordEvent({
    ...createHttpCaptureEventBase({
      settings,
      rawUrl: captureUrl,
      url,
      transport: params.transport,
      direction: "outbound",
      kind: "request",
      flowId,
      method: params.method,
    }),
    contentType: requestContentType,
    headersJson: runtime.safeJsonString(redactedCaptureHeaders(params.requestHeaders)),
    metaJson: redactedCaptureJson(params.meta, runtime.safeJsonString),
    ...requestPayload,
  });
  const recordResponseMetadataOnly = (bodyCapture) => {
    store.recordEvent({
      ...createHttpCaptureEventBase({
        settings,
        rawUrl: captureUrl,
        url,
        transport: params.transport,
        direction: "inbound",
        kind: "response",
        flowId,
        method: params.method,
      }),
      status: params.response.status,
      contentType: responseContentType,
      headersJson:
        params.response.headers && typeof params.response.headers.entries === "function"
          ? runtime.safeJsonString(redactedCaptureHeaders(params.response.headers))
          : void 0,
      metaJson: redactedCaptureJson(
        {
          ...params.meta,
          bodyCapture,
        },
        runtime.safeJsonString,
      ),
    });
  };
  if (
    !(
      params.response &&
      typeof params.response.clone === "function" &&
      typeof params.response.arrayBuffer === "function"
    )
  ) {
    recordResponseMetadataOnly("unavailable");
    return;
  }
  const declaredLength = Number(
    typeof params.response.headers?.get === "function"
      ? params.response.headers.get("content-length")
      : void 0,
  );
  if (Number.isFinite(declaredLength) && declaredLength > MAX_CAPTURED_RESPONSE_BODY_BYTES) {
    recordResponseMetadataOnly("too-large");
    return;
  }
  readCapturedResponseBodyBounded(params.response, MAX_CAPTURED_RESPONSE_BODY_BYTES)
    .then(({ buffer, truncated }) => {
      if (truncated) {
        recordResponseMetadataOnly("too-large");
        return;
      }
      const responsePayload = runtime.persistEventPayload(store, {
        data: redactCapturePayload(buffer),
        contentType: responseContentType,
      });
      store.recordEvent({
        ...createHttpCaptureEventBase({
          settings,
          rawUrl: captureUrl,
          url,
          transport: params.transport,
          direction: "inbound",
          kind: "response",
          flowId,
          method: params.method,
        }),
        status: params.response.status,
        contentType: responseContentType,
        headersJson: runtime.safeJsonString(redactedCaptureHeaders(params.response.headers)),
        metaJson: redactedCaptureJson(params.meta, runtime.safeJsonString),
        ...responsePayload,
      });
    })
    .catch((error) => {
      store.recordEvent({
        ...createHttpCaptureEventBase({
          settings,
          rawUrl: captureUrl,
          url,
          transport: params.transport,
          direction: "local",
          kind: "error",
          flowId,
          method: params.method,
        }),
        errorText: redactCaptureText(error instanceof Error ? error.message : String(error)),
      });
    });
}
function captureWsEvent(params, resolved, deps = {}) {
  const settings = resolved ?? resolveDebugProxySettings();
  if (!settings.enabled) return;
  const runtime = resolveRuntimeDeps(deps);
  const store = runtime.getStore();
  const captureUrl = redactCaptureUrl(params.url);
  const url = new URL(captureUrl);
  const payload = runtime.persistEventPayload(store, {
    data: redactCapturePayload(params.payload),
    contentType: "application/json",
  });
  store.recordEvent({
    sessionId: settings.sessionId,
    ts: Date.now(),
    sourceScope: "openclaw",
    sourceProcess: settings.sourceProcess,
    protocol: protocolFromUrl(captureUrl),
    direction: params.direction,
    kind: params.kind,
    flowId: params.flowId,
    host: url.host,
    path: `${url.pathname}${url.search}`,
    closeCode: params.closeCode,
    errorText: params.errorText === void 0 ? void 0 : redactCaptureText(params.errorText),
    metaJson: redactedCaptureJson(params.meta, runtime.safeJsonString),
    ...payload,
  });
}
//#endregion
export {
  isDebugProxyGlobalFetchPatchInstalled as a,
  closeDebugProxyCaptureStore as c,
  initializeDebugProxyCapture as i,
  getDebugProxyCaptureStore as l,
  captureWsEvent as n,
  DebugProxyCaptureStore as o,
  finalizeDebugProxyCapture as r,
  acquireDebugProxyCaptureStore as s,
  captureHttpExchange as t,
};
