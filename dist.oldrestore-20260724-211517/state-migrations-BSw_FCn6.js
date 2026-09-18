import fs from "node:fs";
import os from "node:os";
import "./src-Bl7G9qvi.js";
import path from "node:path";
import { gunzipSync } from "node:zlib";
import { n as normalizeAgentId, t as isValidAgentId } from "./agent-id-DDgUze4y.js";
import { c as resolveDefaultAgentId } from "./agent-scope-config-DVIR1nBa.js";
import {
  c as listBundledChannelLegacyStateMigrationDetectors,
  s as listBundledChannelLegacySessionSurfaces,
} from "./bundled-CmD3EzUu.js";
import { a as sha256Hex } from "./crypto-digest-CNeb2i19.js";
import {
  n as collectRelevantDoctorPluginIds,
  o as listPluginDoctorSessionStoreAgentIds,
  s as listPluginDoctorStateMigrationEntries,
} from "./doctor-contract-registry-BkL2a5GC.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { t as sameFileIdentity } from "./file-identity-C0fBiekR.js";
import { i as resolveChannelDefaultAccountId } from "./helpers-BzNF0htn.js";
import { o as resolveRequiredHomeDir, t as expandHomePrefix } from "./home-dir-DxrrpDft.js";
import "./path-safety-CBe_wA_B.js";
import { t as CHANNEL_IDS } from "./ids-lBaN9yr4.js";
import { g as hashJson } from "./installed-plugin-index-lBfkb-7L.js";
import { s as resolveLegacyInstalledPluginIndexStorePath } from "./installed-plugin-index-record-reader-D7CXgzhH.js";
import "./agent-scope-y9xQv_q1.js";
import {
  c as writePersistedInstalledPluginIndexSync,
  i as readPersistedInstalledPluginIndexSync,
  n as parseInstalledPluginIndex,
} from "./installed-plugin-index-store-XopnPfaM.js";
import { n as canonicalizeMainSessionAlias } from "./main-session-nrmKYo2W.js";
import "./account-id-C7N4Rwku.js";
import { t as requireNodeSqlite } from "./node-sqlite-BJtdZavS.js";
import { s as parseRegistryNpmSpec } from "./npm-registry-spec-CqBTTiC9.js";
import {
  L as executeSqliteQuerySync,
  R as executeSqliteQueryTakeFirstSync,
  c as repairOpenClawStateDatabaseSchema,
  f as resolveOpenClawStateSqlitePath,
  i as detectOpenClawStateDatabaseSchemaMigrations,
  l as runOpenClawStateWriteTransaction,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import {
  a as updateChannelPairingStateSnapshot,
  c as resolveAllowFromAccountId,
  d as getPairingAdapter,
  l as safeAccountKey,
  s as dedupePreserveOrder,
} from "./pairing-store-sqlite-SSIWpzi1.js";
import "./fs-safe-advanced-CBe_wA_B.js";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-CmZHj-1e.js";
import { c as isWithinDir } from "./path-DILYn_gk.js";
import {
  _ as resolveOAuthDir,
  g as resolveNewStateDir,
  h as resolveLegacyStateDirs,
  i as isNamedProfile,
  y as resolveStateDir,
} from "./paths-DEklnbzU.js";
import { t as resolveAgentsDirFromSessionStorePath } from "./paths-TfuVT-K8.js";
import {
  i as MAX_PLUGIN_STATE_ENTRIES_PER_PLUGIN,
  n as createPluginStateKeyedStore,
  o as countPluginStateLiveEntries,
} from "./plugin-state-store-CdAHpy0G.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { t as getChannelPlugin } from "./registry-mc8oBRx8.js";
import { n as normalizeConversationRef } from "./session-binding-normalization-sQL-8bRz.js";
import {
  d as resolveAgentIdFromSessionKey,
  i as buildAgentMainSessionKey,
  l as normalizeMainKey,
  n as DEFAULT_MAIN_KEY,
  t as DEFAULT_AGENT_ID,
} from "./session-key-druuY-GG.js";
import "./sessions-CEG7v41b.js";
import {
  c as parseAgentSessionKey,
  o as normalizeSessionKeyPreservingOpaquePeerIds,
} from "./session-key-utils-B8sNp9l4.js";
import { s as writeAcpSessionMetaForMigration } from "./session-meta-IQvNG5NK.js";
import {
  i as saveSessionStore,
  p as normalizePersistedSessionEntryShape,
} from "./store-CzZJhTF6.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { n as assertNoSymlinkParentsSync } from "./symlink-parents-D3bl9xr3.js";
import {
  a as resolveSessionStoreTargets,
  i as resolveAllAgentSessionStoreTargetsSync,
  t as listConfiguredSessionStoreAgentIds,
} from "./targets-CjMfpXbt.js";
import { n as normalizeVoiceWakeRoutingConfig } from "./voicewake-routing-j3uhTgYy.js";
//#region src/infra/state-migrations.channel-pairing.ts
const PAIRING_SUFFIX = "-pairing.json";
const ALLOW_FROM_SUFFIX = "-allowFrom.json";
function detectLegacyChannelPairingState(params) {
  let directoryEntries = [];
  try {
    directoryEntries = fs.readdirSync(params.sourceDir, { withFileTypes: true });
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
  const files = directoryEntries
    .filter(
      (entry) =>
        entry.isFile() &&
        (entry.name.endsWith(PAIRING_SUFFIX) || entry.name.endsWith(ALLOW_FROM_SUFFIX)),
    )
    .map((entry) => entry.name)
    .toSorted();
  const pairedChannelIds = files
    .filter((filename) => filename.endsWith(PAIRING_SUFFIX))
    .map((filename) => filename.slice(0, -13));
  const knownChannelIds = dedupePreserveOrder([
    ...CHANNEL_IDS,
    ...(params.configuredChannelIds ?? []),
    ...pairedChannelIds,
  ]).toSorted((left, right) => right.length - left.length || left.localeCompare(right));
  return {
    sourceDir: params.sourceDir,
    files,
    knownChannelIds,
    defaultAccountIds: { ...params.configuredDefaultAccountIds },
    accountIds: Object.fromEntries(
      Object.entries(params.configuredAccountIds ?? {}).map(([channel, accountIds]) => [
        channel,
        dedupePreserveOrder(accountIds.map((accountId) => resolveAllowFromAccountId(accountId))),
      ]),
    ),
    hasLegacy: files.length > 0,
  };
}
function parsePairingFilename(filename) {
  return filename.endsWith(PAIRING_SUFFIX) ? filename.slice(0, -13) : null;
}
function parseAllowFromFilename(filename, knownChannelIds, defaultAccountIds, accountIds) {
  if (!filename.endsWith(ALLOW_FROM_SUFFIX)) return null;
  const stem = filename.slice(0, -15);
  const targets = [];
  let hasAccountCollision = false;
  for (const channel of knownChannelIds) {
    if (stem === channel) {
      targets.push({
        channel,
        accountId: normalizeOptionalString(defaultAccountIds[channel]) ?? "default",
      });
      continue;
    }
    if (!stem.startsWith(`${channel}-`)) continue;
    const accountKey = stem.slice(channel.length + 1);
    const matchingAccountIds = (accountIds[channel] ?? []).filter(
      (accountId) => safeAccountKey(accountId) === accountKey,
    );
    if (matchingAccountIds.length === 1 && matchingAccountIds[0])
      targets.push({
        channel,
        accountId: matchingAccountIds[0],
      });
    else if (matchingAccountIds.length > 1) hasAccountCollision = true;
  }
  if (hasAccountCollision || targets.length > 1)
    return {
      target: null,
      reason: "ambiguous",
    };
  return targets[0]
    ? { target: targets[0] }
    : {
        target: null,
        reason: "unresolved",
      };
}
function normalizeLegacyPairingRequest(value) {
  if (!isRecord(value)) return null;
  const id = normalizeOptionalString(value.id);
  const code = normalizeOptionalString(value.code);
  const createdAt = normalizeOptionalString(value.createdAt);
  const lastSeenAt = normalizeOptionalString(value.lastSeenAt) ?? createdAt;
  if (!id || !code || !createdAt || !lastSeenAt) return null;
  const meta = isRecord(value.meta)
    ? Object.fromEntries(
        Object.entries(value.meta)
          .map(([key, entry]) => [key, normalizeOptionalString(entry) ?? ""])
          .filter(([, entry]) => Boolean(entry)),
      )
    : void 0;
  return {
    id,
    code,
    createdAt,
    lastSeenAt,
    ...(meta && Object.keys(meta).length ? { meta } : {}),
  };
}
function readLegacyPairingRequests(filePath) {
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (!isRecord(parsed) || !Array.isArray(parsed.requests)) return null;
    return parsed.requests.flatMap((entry) => {
      const request = normalizeLegacyPairingRequest(entry);
      return request ? [request] : [];
    });
  } catch {
    return null;
  }
}
function normalizeAllowEntry(channel, value) {
  const raw = typeof value === "string" || typeof value === "number" ? String(value).trim() : "";
  if (!raw || raw === "*") return "";
  let adapter;
  try {
    adapter = getPairingAdapter(channel);
  } catch {
    adapter = null;
  }
  const entry =
    normalizeOptionalString(
      adapter?.normalizeAllowEntry ? adapter.normalizeAllowEntry(raw) : raw,
    ) ?? "";
  return entry === "*" ? "" : entry;
}
function readLegacyAllowFrom(filePath, channel) {
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const values = Array.isArray(parsed)
      ? parsed
      : isRecord(parsed) && Array.isArray(parsed.allowFrom)
        ? parsed.allowFrom
        : null;
    if (!values) return null;
    return dedupePreserveOrder(
      values.map((value) => normalizeAllowEntry(channel, value)).filter(Boolean),
    );
  } catch {
    return null;
  }
}
function mergePairingRequests(current, legacy) {
  const merged = current.slice();
  const keys = new Set(
    current.map(
      (request) => `${resolveAllowFromAccountId(request.meta?.accountId)}\0${request.id}`,
    ),
  );
  for (const request of legacy) {
    const key = `${resolveAllowFromAccountId(request.meta?.accountId)}\0${request.id}`;
    if (!keys.has(key)) {
      keys.add(key);
      merged.push(request);
    }
  }
  return merged;
}
function removeImportedSource(filePath, warnings) {
  try {
    fs.rmSync(filePath, { force: true });
    return true;
  } catch (err) {
    warnings.push(
      `Imported legacy channel pairing state but failed removing ${filePath}: ${String(err)}`,
    );
    return false;
  }
}
function migrateLegacyChannelPairingState(params) {
  const changes = [];
  const warnings = [];
  for (const filename of params.detected.files) {
    const filePath = path.join(params.detected.sourceDir, filename);
    const pairingChannel = parsePairingFilename(filename);
    if (pairingChannel) {
      const requests = readLegacyPairingRequests(filePath);
      if (!requests) {
        warnings.push(`Legacy channel pairing file unreadable; left in place at ${filePath}`);
        continue;
      }
      updateChannelPairingStateSnapshot(pairingChannel, params.env, (state) => {
        state.requests = mergePairingRequests(state.requests, requests);
      });
      removeImportedSource(filePath, warnings);
      changes.push(
        `Migrated ${requests.length} ${pairingChannel} pairing request(s) → shared SQLite state`,
      );
      continue;
    }
    const allowTarget = parseAllowFromFilename(
      filename,
      params.detected.knownChannelIds,
      params.detected.defaultAccountIds,
      params.detected.accountIds,
    );
    if (!allowTarget) continue;
    if (!allowTarget.target) {
      const reason = allowTarget.reason === "ambiguous" ? "ambiguous" : "unresolved";
      warnings.push(
        `Legacy channel allowFrom channel/account is ${reason}; left in place at ${filePath}`,
      );
      continue;
    }
    const entries = readLegacyAllowFrom(filePath, allowTarget.target.channel);
    if (!entries) {
      warnings.push(`Legacy channel allowFrom file unreadable; left in place at ${filePath}`);
      continue;
    }
    const accountId = resolveAllowFromAccountId(allowTarget.target.accountId);
    updateChannelPairingStateSnapshot(allowTarget.target.channel, params.env, (state) => {
      state.allowFrom ??= {};
      state.allowFrom[accountId] = dedupePreserveOrder([
        ...(state.allowFrom[accountId] ?? []),
        ...entries,
      ]);
    });
    removeImportedSource(filePath, warnings);
    changes.push(
      `Migrated ${entries.length} ${allowTarget.target.channel}/${accountId} allowFrom entr${entries.length === 1 ? "y" : "ies"} → shared SQLite state`,
    );
  }
  return {
    changes,
    warnings,
  };
}
//#endregion
//#region src/infra/state-migrations.debug-proxy.ts
const DEBUG_PROXY_SQLITE_SIDECAR_SUFFIXES = ["", "-shm", "-wal", "-journal"];
var LegacyDebugProxyBlobConflictError = class extends Error {
  constructor(blobId) {
    super(`legacy debug proxy blob conflicts with shared state: ${blobId}`);
    this.blobId = blobId;
  }
};
var LegacyDebugProxySessionConflictError = class extends Error {
  constructor(sessionId) {
    super(`legacy debug proxy session conflicts with shared state: ${sessionId}`);
    this.sessionId = sessionId;
  }
};
function fileExists$1(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}
function dirExists(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch {
    return false;
  }
}
function resolveLegacyDebugProxyCapturePaths(stateDir, env) {
  const rootDir = path.join(stateDir, "debug-proxy");
  return {
    sourcePath: env.OPENCLAW_DEBUG_PROXY_DB_PATH?.trim() || path.join(rootDir, "capture.sqlite"),
    blobDir: env.OPENCLAW_DEBUG_PROXY_BLOB_DIR?.trim() || path.join(rootDir, "blobs"),
  };
}
function hasPendingSqliteArchive(sourcePath) {
  return (
    !fileExists$1(sourcePath) &&
    fileExists$1(`${sourcePath}.migrated`) &&
    DEBUG_PROXY_SQLITE_SIDECAR_SUFFIXES.some(
      (suffix) => suffix !== "" && fileExists$1(`${sourcePath}${suffix}`),
    )
  );
}
function detectLegacyDebugProxyCaptureSidecar(stateDir, env = process.env) {
  const paths = resolveLegacyDebugProxyCapturePaths(stateDir, env);
  if (
    path.resolve(paths.sourcePath) ===
    path.resolve(
      resolveOpenClawStateSqlitePath({
        ...env,
        OPENCLAW_STATE_DIR: stateDir,
      }),
    )
  )
    return {
      ...paths,
      hasLegacy: false,
    };
  const hasArchivedDatabase = fileExists$1(`${paths.sourcePath}.migrated`);
  return {
    ...paths,
    hasLegacy:
      fileExists$1(paths.sourcePath) ||
      hasPendingSqliteArchive(paths.sourcePath) ||
      (hasArchivedDatabase && dirExists(paths.blobDir)),
  };
}
function listSqliteColumns$1(db, table) {
  const rows = db.prepare(`PRAGMA table_info(${table})`).all();
  return new Set(rows.flatMap((row) => (typeof row.name === "string" ? [row.name] : [])));
}
function assertTableColumns(db, table, expected) {
  const columns = listSqliteColumns$1(db, table);
  const missing = expected.filter((column) => !columns.has(column));
  if (missing.length > 0) throw new Error(`legacy ${table} table is missing ${missing.join(", ")}`);
}
function normalizeSqliteInteger(value) {
  return typeof value === "bigint" ? Number(value) : value;
}
function readLegacyDebugProxyCapture(params) {
  const db = new (requireNodeSqlite().DatabaseSync)(params.sourcePath, { readOnly: true });
  try {
    assertTableColumns(db, "capture_sessions", [
      "id",
      "started_at",
      "ended_at",
      "mode",
      "source_scope",
      "source_process",
      "proxy_url",
      "db_path",
      "blob_dir",
    ]);
    assertTableColumns(db, "capture_events", [
      "session_id",
      "ts",
      "source_scope",
      "source_process",
      "protocol",
      "direction",
      "kind",
      "flow_id",
      "method",
      "host",
      "path",
      "status",
      "close_code",
      "content_type",
      "headers_json",
      "data_text",
      "data_blob_id",
      "data_sha256",
      "error_text",
      "meta_json",
    ]);
    const sessions = db
      .prepare(`SELECT id, started_at, ended_at, mode, source_scope, source_process, proxy_url, blob_dir
         FROM capture_sessions
         ORDER BY started_at ASC, id ASC`)
      .all();
    const events = db
      .prepare(`SELECT
           session_id, ts, source_scope, source_process, protocol, direction, kind, flow_id,
           method, host, path, status, close_code, content_type, headers_json, data_text,
           data_blob_id, data_sha256, error_text, meta_json
         FROM capture_events
         ORDER BY ts ASC, id ASC`)
      .all();
    const sessionIds = new Set(sessions.map((session) => session.id));
    for (const event of events) {
      if (sessionIds.has(event.session_id)) continue;
      sessions.push({
        id: event.session_id,
        started_at: event.ts,
        ended_at: null,
        mode: "implicit",
        source_scope: event.source_scope,
        source_process: event.source_process,
        proxy_url: null,
        blob_dir: params.blobDir,
      });
      sessionIds.add(event.session_id);
    }
    const blobEvents = /* @__PURE__ */ new Map();
    for (const event of events) {
      if (!event.data_blob_id) continue;
      const rows = blobEvents.get(event.data_blob_id) ?? [];
      rows.push(event);
      blobEvents.set(event.data_blob_id, rows);
    }
    const blobDirBySession = new Map(sessions.map((session) => [session.id, session.blob_dir]));
    const usedBlobDirs = /* @__PURE__ */ new Set();
    const blobs = [];
    for (const [blobId, referencingEvents] of blobEvents) {
      const candidateBlobDirs = [
        .../* @__PURE__ */ new Set([
          ...referencingEvents.map(
            (event) => blobDirBySession.get(event.session_id) ?? params.blobDir,
          ),
          params.blobDir,
        ]),
      ];
      const blobPath =
        candidateBlobDirs
          .map((blobDir) => path.join(blobDir, `${blobId}.bin.gz`))
          .find(fileExists$1) ??
        path.join(candidateBlobDirs[0] ?? params.blobDir, `${blobId}.bin.gz`);
      const data = fs.readFileSync(blobPath);
      const raw = gunzipSync(data);
      const sha256 = sha256Hex(raw);
      if (sha256.slice(0, 24) !== blobId)
        throw new Error(`legacy debug proxy blob hash mismatch: ${blobPath}`);
      usedBlobDirs.add(path.dirname(blobPath));
      blobs.push({
        blobId,
        contentType: referencingEvents.find((event) => event.content_type)?.content_type ?? null,
        encoding: "gzip",
        sizeBytes: raw.byteLength,
        sha256,
        data,
        createdAt: Math.min(
          ...referencingEvents.map((event) => normalizeSqliteInteger(event.ts) ?? 0),
        ),
      });
    }
    return {
      sessions,
      events,
      blobs,
      blobDirs: [...usedBlobDirs],
    };
  } finally {
    db.close();
  }
}
function eventValues(event) {
  return [
    event.session_id,
    normalizeSqliteInteger(event.ts),
    event.source_scope,
    event.source_process,
    event.protocol,
    event.direction,
    event.kind,
    event.flow_id,
    event.method,
    event.host,
    event.path,
    normalizeSqliteInteger(event.status),
    normalizeSqliteInteger(event.close_code),
    event.content_type,
    event.headers_json,
    event.data_text,
    event.data_blob_id,
    event.data_sha256,
    event.error_text,
    event.meta_json,
  ];
}
function eventKey(values) {
  return JSON.stringify(values);
}
function archiveLegacyDebugProxySqlite(params) {
  const existingSources = DEBUG_PROXY_SQLITE_SIDECAR_SUFFIXES.map(
    (suffix) => `${params.sourcePath}${suffix}`,
  ).filter(fileExists$1);
  if (existingSources.length === 0) return;
  const resolutions = [];
  for (const sourcePath of existingSources) {
    const archivedPath = `${sourcePath}.migrated`;
    try {
      if (fileExists$1(archivedPath)) {
        if (fs.readFileSync(sourcePath).equals(fs.readFileSync(archivedPath))) {
          fs.rmSync(sourcePath, { force: true });
          resolutions.push({
            sourcePath,
            targetPath: archivedPath,
            removed: true,
          });
          continue;
        }
        let index = 2;
        while (fs.existsSync(`${sourcePath}.migrated.${index}`)) index++;
        const nextArchivePath = `${sourcePath}.migrated.${index}`;
        fs.renameSync(sourcePath, nextArchivePath);
        resolutions.push({
          sourcePath,
          targetPath: nextArchivePath,
          removed: false,
        });
        continue;
      }
      fs.renameSync(sourcePath, archivedPath);
      resolutions.push({
        sourcePath,
        targetPath: archivedPath,
        removed: false,
      });
    } catch (err) {
      params.warnings.push(
        `Failed archiving debug proxy capture sidecar ${sourcePath}: ${String(err)}`,
      );
      return;
    }
  }
  if (
    resolutions.every(
      (resolution) =>
        !resolution.removed && resolution.targetPath === `${resolution.sourcePath}.migrated`,
    )
  ) {
    params.changes.push(
      `Archived debug proxy capture sidecar legacy source → ${params.sourcePath}.migrated`,
    );
    return;
  }
  for (const resolution of resolutions)
    params.changes.push(
      resolution.removed
        ? `Removed already-archived debug proxy capture sidecar legacy source ${resolution.sourcePath}`
        : `Archived debug proxy capture sidecar legacy source → ${resolution.targetPath}`,
    );
}
function archiveLegacyDebugProxyBlobs(params) {
  if (!dirExists(params.blobDir)) return;
  const archivePath = `${params.blobDir}.migrated`;
  try {
    let targetPath = archivePath;
    if (dirExists(archivePath)) {
      let index = 2;
      while (fs.existsSync(`${params.blobDir}.migrated.${index}`)) index++;
      targetPath = `${params.blobDir}.migrated.${index}`;
    }
    fs.renameSync(params.blobDir, targetPath);
    params.changes.push(`Archived debug proxy capture blobs → ${targetPath}`);
  } catch (err) {
    params.warnings.push(
      `Failed archiving debug proxy capture blobs ${params.blobDir}: ${String(err)}`,
    );
  }
}
function migrateLegacyDebugProxyCaptureSidecar(params) {
  const detected = params.detected ?? detectLegacyDebugProxyCaptureSidecar(params.stateDir);
  const changes = [];
  const warnings = [];
  if (!detected.hasLegacy)
    return {
      changes,
      warnings,
    };
  if (!fileExists$1(detected.sourcePath)) {
    archiveLegacyDebugProxySqlite({
      sourcePath: detected.sourcePath,
      changes,
      warnings,
    });
    if (fileExists$1(`${detected.sourcePath}.migrated`))
      archiveLegacyDebugProxyBlobs({
        blobDir: detected.blobDir,
        changes,
        warnings,
      });
    return {
      changes,
      warnings,
    };
  }
  let legacy;
  try {
    legacy = readLegacyDebugProxyCapture(detected);
  } catch (err) {
    return {
      changes,
      warnings: [
        `Failed reading debug proxy capture sidecar ${detected.sourcePath}: ${String(err)}`,
      ],
    };
  }
  try {
    runOpenClawStateWriteTransaction(
      ({ db }) => {
        const selectBlob = db.prepare(`SELECT encoding, size_bytes AS sizeBytes, sha256, data
           FROM capture_blobs
           WHERE blob_id = ?`);
        const insertBlob = db.prepare(`INSERT INTO capture_blobs (
            blob_id, content_type, encoding, size_bytes, sha256, data, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`);
        for (const blob of legacy.blobs) {
          const existing = selectBlob.get(blob.blobId);
          if (existing) {
            if (
              existing.encoding !== blob.encoding ||
              Number(existing.sizeBytes) !== blob.sizeBytes ||
              existing.sha256 !== blob.sha256 ||
              !existing.data ||
              !Buffer.from(existing.data).equals(blob.data)
            )
              throw new LegacyDebugProxyBlobConflictError(blob.blobId);
            continue;
          }
          insertBlob.run(
            blob.blobId,
            blob.contentType,
            blob.encoding,
            blob.sizeBytes,
            blob.sha256,
            blob.data,
            blob.createdAt,
          );
        }
        const selectSession = db.prepare(`SELECT
            started_at AS startedAt,
            ended_at AS endedAt,
            mode,
            source_scope AS sourceScope,
            source_process AS sourceProcess,
            proxy_url AS proxyUrl
           FROM capture_sessions
           WHERE id = ?`);
        const insertSession = db.prepare(`INSERT INTO capture_sessions (
            id, started_at, ended_at, mode, source_scope, source_process, proxy_url
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`);
        for (const session of legacy.sessions) {
          const values = [
            session.id,
            normalizeSqliteInteger(session.started_at),
            normalizeSqliteInteger(session.ended_at),
            session.mode,
            session.source_scope,
            session.source_process,
            session.proxy_url,
          ];
          const existing = selectSession.get(session.id);
          if (existing) {
            const expected = {
              startedAt: values[1],
              endedAt: values[2],
              mode: values[3],
              sourceScope: values[4],
              sourceProcess: values[5],
              proxyUrl: values[6],
            };
            if (JSON.stringify(existing) !== JSON.stringify(expected))
              throw new LegacyDebugProxySessionConflictError(session.id);
            continue;
          }
          insertSession.run(...values);
        }
        const existingEventCount = db.prepare(`SELECT COUNT(*) AS count
           FROM capture_events
           WHERE session_id IS ? AND ts IS ? AND source_scope IS ? AND source_process IS ?
             AND protocol IS ? AND direction IS ? AND kind IS ? AND flow_id IS ?
             AND method IS ? AND host IS ? AND path IS ? AND status IS ? AND close_code IS ?
             AND content_type IS ? AND headers_json IS ? AND data_text IS ? AND data_blob_id IS ?
             AND data_sha256 IS ? AND error_text IS ? AND meta_json IS ?
          `);
        const insertEvent = db.prepare(`INSERT INTO capture_events (
            session_id, ts, source_scope, source_process, protocol, direction, kind, flow_id,
            method, host, path, status, close_code, content_type, headers_json, data_text,
            data_blob_id, data_sha256, error_text, meta_json
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
        const existingCounts = /* @__PURE__ */ new Map();
        const seenCounts = /* @__PURE__ */ new Map();
        for (const event of legacy.events) {
          const values = eventValues(event);
          const key = eventKey(values);
          const seenCount = (seenCounts.get(key) ?? 0) + 1;
          seenCounts.set(key, seenCount);
          let existingCount = existingCounts.get(key);
          if (existingCount === void 0) {
            const row = existingEventCount.get(...values);
            existingCount = Number(row?.count ?? 0);
            existingCounts.set(key, existingCount);
          }
          if (seenCount > existingCount) insertEvent.run(...values);
        }
      },
      {
        env: {
          ...process.env,
          OPENCLAW_STATE_DIR: params.stateDir,
        },
      },
    );
    changes.push(
      `Migrated ${legacy.sessions.length} debug proxy capture ${legacy.sessions.length === 1 ? "session" : "sessions"}, ${legacy.events.length} ${legacy.events.length === 1 ? "event" : "events"}, and ${legacy.blobs.length} ${legacy.blobs.length === 1 ? "blob" : "blobs"} → shared SQLite state`,
    );
  } catch (err) {
    const detail =
      err instanceof LegacyDebugProxyBlobConflictError
        ? `blob ${err.blobId} already exists with different data`
        : err instanceof LegacyDebugProxySessionConflictError
          ? `session ${err.sessionId} already exists with different data`
          : String(err);
    return {
      changes,
      warnings: [`Failed migrating debug proxy capture sidecar ${detected.sourcePath}: ${detail}`],
    };
  }
  archiveLegacyDebugProxySqlite({
    sourcePath: detected.sourcePath,
    changes,
    warnings,
  });
  if (!fileExists$1(detected.sourcePath) && fileExists$1(`${detected.sourcePath}.migrated`)) {
    archiveLegacyDebugProxyBlobs({
      blobDir: detected.blobDir,
      changes,
      warnings,
    });
    for (const blobDir of legacy.blobDirs) {
      if (path.resolve(blobDir) === path.resolve(detected.blobDir) || !dirExists(blobDir)) continue;
      warnings.push(
        `Left migrated debug proxy capture blobs in stored session directory: ${blobDir}`,
      );
    }
  }
  return {
    changes,
    warnings,
  };
}
//#endregion
//#region src/infra/state-migrations.fs.ts
/** Reads directory entries or returns an empty list when the directory is missing/unreadable. */
function safeReadDir(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}
/** Returns whether a path exists and resolves to a directory. */
function existsDir(dir) {
  try {
    return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
  } catch {
    return false;
  }
}
/** Creates a directory tree for migration targets. */
function ensureMigrationDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}
/** Returns whether a path exists and resolves to a regular file. */
function fileExists(p) {
  try {
    return fs.existsSync(p) && fs.statSync(p).isFile();
  } catch {
    return false;
  }
}
/** Reads a session store from disk, accepting JSON first and JSON5 as legacy/operator input. */
function readSessionStoreJson5(storePath) {
  try {
    return parseSessionStoreJson5(fs.readFileSync(storePath, "utf-8"));
  } catch {}
  return {
    store: {},
    ok: false,
  };
}
/** Parses session-store text, preferring strict JSON before JSON5 compatibility. */
function parseSessionStoreJson5(raw) {
  try {
    const parsed = parseJsonWithJson5Fallback(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed))
      return {
        store: parsed,
        ok: true,
      };
  } catch {}
  return {
    store: {},
    ok: false,
  };
}
//#endregion
//#region src/infra/state-migrations.exec-approvals.ts
const EXEC_APPROVALS_FILENAME = "exec-approvals.json";
const EXEC_APPROVALS_SOCKET_FILENAME = "exec-approvals.sock";
function resolveDefaultExecApprovalsStateDir(env, homedir) {
  return path.join(resolveRequiredHomeDir(env, homedir), ".openclaw");
}
function resolveDefaultExecApprovalsPath(env, homedir) {
  return path.join(resolveDefaultExecApprovalsStateDir(env, homedir), EXEC_APPROVALS_FILENAME);
}
function resolveExecApprovalsPathForStateDir(stateDir) {
  return path.join(stateDir, EXEC_APPROVALS_FILENAME);
}
function resolveExecApprovalsSocketPathForStateDir(stateDir) {
  return path.join(stateDir, EXEC_APPROVALS_SOCKET_FILENAME);
}
function detectLegacyExecApprovalsMigration(params) {
  const sourcePath = resolveDefaultExecApprovalsPath(params.env, params.homedir);
  const targetPath = resolveExecApprovalsPathForStateDir(params.stateDir);
  return {
    sourcePath,
    targetPath,
    hasLegacy:
      Boolean(params.env.OPENCLAW_STATE_DIR?.trim()) &&
      !isNamedProfile(params.env) &&
      path.resolve(sourcePath) !== path.resolve(targetPath) &&
      fileExists(sourcePath) &&
      !fileExists(targetPath),
  };
}
function isPlainJsonObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function isDefaultLegacyExecApprovalsSocketPath(params) {
  const expanded = expandHomePrefix(params.socketPath);
  return (
    path.resolve(expanded) ===
    path.join(path.dirname(params.sourcePath), EXEC_APPROVALS_SOCKET_FILENAME)
  );
}
function prepareMigratedExecApprovalsFile(params) {
  let parsed;
  try {
    parsed = JSON.parse(params.raw);
  } catch {
    return {
      raw: "",
      warning: `Legacy exec approvals file unreadable; left in place at ${params.sourcePath}`,
    };
  }
  if (!isPlainJsonObject(parsed) || parsed.version !== 1)
    return {
      raw: "",
      warning: `Legacy exec approvals file has unsupported shape; left in place at ${params.sourcePath}`,
    };
  const next = { ...parsed };
  const socket = isPlainJsonObject(next.socket) ? { ...next.socket } : {};
  const rawSocketPath = typeof socket.path === "string" ? socket.path.trim() : "";
  if (
    !rawSocketPath ||
    isDefaultLegacyExecApprovalsSocketPath({
      socketPath: rawSocketPath,
      sourcePath: params.sourcePath,
    })
  )
    socket.path = resolveExecApprovalsSocketPathForStateDir(path.dirname(params.targetPath));
  next.socket = socket;
  return { raw: `${JSON.stringify(next, null, 2)}\n` };
}
function assertSafeExecApprovalsMigrationTarget(targetPath) {
  const targetDir = path.dirname(targetPath);
  assertNoSymlinkParentsSync({
    rootDir: resolveRequiredHomeDir(),
    targetPath: targetDir,
    allowOutsideRoot: true,
    messagePrefix: "Refusing to traverse symlink in exec approvals migration path",
  });
  try {
    if (fs.lstatSync(targetPath).isSymbolicLink())
      throw new Error(`Refusing to migrate exec approvals via symlink: ${targetPath}`);
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
}
function writeMigratedExecApprovalsFile(targetPath, raw) {
  const targetDir = path.dirname(targetPath);
  assertSafeExecApprovalsMigrationTarget(targetPath);
  fs.mkdirSync(targetDir, {
    recursive: true,
    mode: 448,
  });
  assertSafeExecApprovalsMigrationTarget(targetPath);
  const dirStat = fs.lstatSync(targetDir);
  if (!dirStat.isDirectory() || dirStat.isSymbolicLink())
    throw new Error(`Refusing to migrate exec approvals into unsafe directory: ${targetDir}`);
  try {
    fs.chmodSync(targetDir, 448);
  } catch {}
  const tempPath = path.join(targetDir, `.exec-approvals.migration.${process.pid}.tmp`);
  fs.writeFileSync(tempPath, raw, {
    encoding: "utf8",
    mode: 384,
    flag: "wx",
  });
  try {
    try {
      fs.copyFileSync(tempPath, targetPath, fs.constants.COPYFILE_EXCL);
    } catch (err) {
      if (err.code === "EEXIST") return false;
      try {
        fs.rmSync(targetPath, { force: true });
      } catch {}
      throw err;
    }
    try {
      fs.chmodSync(targetPath, 384);
    } catch {}
    return true;
  } finally {
    fs.rmSync(tempPath, { force: true });
  }
}
function archiveMigratedExecApprovalsSource(sourcePath) {
  let archivePath = `${sourcePath}.migrated`;
  if (fileExists(archivePath)) archivePath = `${archivePath}-${Date.now()}`;
  fs.renameSync(sourcePath, archivePath);
  return archivePath;
}
function migrateLegacyExecApprovals(detected) {
  const changes = [];
  const warnings = [];
  if (!detected.hasLegacy)
    return {
      changes,
      warnings,
    };
  if (fileExists(detected.targetPath))
    return {
      changes,
      warnings,
    };
  try {
    const sourceStat = fs.lstatSync(detected.sourcePath);
    if (!sourceStat.isFile() || sourceStat.isSymbolicLink()) {
      warnings.push(
        `Legacy exec approvals file is not a regular file; left in place at ${detected.sourcePath}`,
      );
      return {
        changes,
        warnings,
      };
    }
    try {
      if (fs.lstatSync(detected.targetPath).isSymbolicLink()) {
        warnings.push(
          `Target exec approvals path is a symlink; skipped migration at ${detected.targetPath}`,
        );
        return {
          changes,
          warnings,
        };
      }
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
    }
    const prepared = prepareMigratedExecApprovalsFile({
      raw: fs.readFileSync(detected.sourcePath, "utf8"),
      sourcePath: detected.sourcePath,
      targetPath: detected.targetPath,
    });
    if (prepared.warning) {
      warnings.push(prepared.warning);
      return {
        changes,
        warnings,
      };
    }
    if (!writeMigratedExecApprovalsFile(detected.targetPath, prepared.raw))
      return {
        changes,
        warnings,
      };
    changes.push(`Migrated exec approvals → ${detected.targetPath}`);
    try {
      const archivePath = archiveMigratedExecApprovalsSource(detected.sourcePath);
      changes.push(`Archived legacy exec approvals → ${archivePath}`);
    } catch (err) {
      warnings.push(
        `Failed archiving legacy exec approvals at ${detected.sourcePath}: ${String(err)}`,
      );
    }
  } catch (err) {
    warnings.push(
      `Failed migrating exec approvals (${detected.sourcePath} → ${detected.targetPath}): ${String(err)}`,
    );
  }
  return {
    changes,
    warnings,
  };
}
//#endregion
//#region src/infra/state-migrations.session-surfaces.ts
let cachedLegacySessionSurfaces = null;
function getLegacySessionSurfaces() {
  cachedLegacySessionSurfaces ??= [...listBundledChannelLegacySessionSurfaces()];
  return cachedLegacySessionSurfaces;
}
function isSurfaceGroupKey(key) {
  return key.includes(":group:") || key.includes(":channel:");
}
function isLegacyGroupKey(key) {
  const trimmed = key.trim();
  if (!trimmed) return false;
  const lower = normalizeLowercaseStringOrEmpty(trimmed);
  if (lower.startsWith("group:") || lower.startsWith("channel:")) return true;
  for (const surface of getLegacySessionSurfaces())
    if (surface.isLegacyGroupSessionKey?.(trimmed)) return true;
  return false;
}
function resetLegacySessionSurfacesForTest() {
  cachedLegacySessionSurfaces = null;
}
//#endregion
//#region src/infra/state-migrations.session-store.ts
function isLegacyDefaultMainAliasKey(key, mainKey) {
  const lower = normalizeLowercaseStringOrEmpty(key.trim());
  const canonicalMainKey = normalizeMainKey(mainKey);
  return lower === `agent:main:main` || lower === `agent:main:${canonicalMainKey}`;
}
function resolveCanonicalAgentSessionOwner(key) {
  const parsed = parseAgentSessionKey(key);
  if (
    parsed === null ||
    !isValidAgentId(parsed.agentId) ||
    normalizeAgentId(parsed.agentId) !== parsed.agentId
  )
    return;
  return parsed.agentId;
}
function canonicalizeSessionKeyForAgent(params) {
  const raw = params.key.trim();
  if (!raw) return raw;
  const rawLower = normalizeLowercaseStringOrEmpty(raw);
  const legacyDefaultMainAlias = isLegacyDefaultMainAliasKey(rawLower, params.mainKey);
  const configuredAgentId = normalizeAgentId(params.agentId);
  const canonicalRowOwner = resolveCanonicalAgentSessionOwner(raw);
  const candidateOwner = params.preserveCanonicalAgentOwner ? canonicalRowOwner : void 0;
  const agentId =
    (candidateOwner === "main" && configuredAgentId !== "main" && legacyDefaultMainAlias
      ? void 0
      : candidateOwner) ?? configuredAgentId;
  const normalized = normalizeSessionKeyPreservingOpaquePeerIds(raw);
  if (rawLower === "global" || rawLower === "unknown") return rawLower;
  if (params.preserveForeignMainAliases && legacyDefaultMainAlias) return params.key;
  const canonicalMain = canonicalizeMainSessionAlias({
    cfg: {
      session: {
        scope: params.scope,
        mainKey: params.mainKey,
      },
    },
    agentId,
    sessionKey: normalized,
  });
  if (params.scope === "global" && canonicalMain === "global") return canonicalMain;
  if (params.preserveAmbiguousKeys && (!canonicalRowOwner || legacyDefaultMainAlias))
    return params.key;
  if (params.skipCrossAgentRemap) {
    const parsed = parseAgentSessionKey(raw);
    if (parsed && normalizeAgentId(parsed.agentId) !== agentId) return normalized;
    if (agentId !== "main" && (rawLower === "main" || rawLower === params.mainKey)) return rawLower;
  }
  if (canonicalMain !== normalized) return normalizeLowercaseStringOrEmpty(canonicalMain);
  const defaultPrefix = `agent:${DEFAULT_AGENT_ID}:`;
  if (rawLower.startsWith(defaultPrefix) && agentId !== "main" && !params.skipCrossAgentRemap) {
    const rest = rawLower.slice(defaultPrefix.length);
    if (rest === "main" || rest === params.mainKey) {
      const remapped = `agent:${agentId}:${rest}`;
      return normalizeLowercaseStringOrEmpty(
        canonicalizeMainSessionAlias({
          cfg: {
            session: {
              scope: params.scope,
              mainKey: params.mainKey,
            },
          },
          agentId,
          sessionKey: remapped,
        }),
      );
    }
  }
  if (rawLower.startsWith("agent:") && canonicalRowOwner) return normalized;
  if (rawLower.startsWith("subagent:"))
    return normalizeLowercaseStringOrEmpty(`agent:${agentId}:subagent:${raw.slice(9)}`);
  for (const surface of getLegacySessionSurfaces()) {
    const canonicalized = surface.canonicalizeLegacySessionKey?.({
      key: raw,
      agentId,
    });
    const normalizedCanonicalized = normalizeSessionKeyPreservingOpaquePeerIds(canonicalized);
    if (normalizedCanonicalized) return normalizedCanonicalized;
  }
  if (rawLower.startsWith("group:") || rawLower.startsWith("channel:"))
    return normalizeLowercaseStringOrEmpty(`agent:${agentId}:unknown:${raw}`);
  if (isSurfaceGroupKey(raw)) return `agent:${agentId}:${normalized}`;
  return normalizeSessionKeyPreservingOpaquePeerIds(`agent:${agentId}:${raw}`);
}
function pickLatestLegacyDirectEntry(store) {
  let best = null;
  let bestUpdated = -1;
  for (const [key, entry] of Object.entries(store)) {
    if (!entry || typeof entry !== "object") continue;
    const normalized = key.trim();
    if (!normalized) continue;
    const normalizedLower = normalizeLowercaseStringOrEmpty(normalized);
    if (normalizedLower === "global") continue;
    if (normalizedLower.startsWith("agent:")) continue;
    if (normalizedLower.startsWith("subagent:")) continue;
    if (isLegacyGroupKey(normalized) || isSurfaceGroupKey(normalized)) continue;
    const updatedAt = typeof entry.updatedAt === "number" ? entry.updatedAt : 0;
    if (updatedAt > bestUpdated) {
      bestUpdated = updatedAt;
      best = entry;
    }
  }
  return best;
}
function normalizeSessionEntry(entry) {
  const shaped = normalizePersistedSessionEntryShape(entry);
  if (!shaped) return null;
  const normalized = { ...shaped };
  if (typeof normalized.sessionId === "string")
    normalized.updatedAt =
      typeof normalized.updatedAt === "number" && Number.isFinite(normalized.updatedAt)
        ? normalized.updatedAt
        : Date.now();
  const rec = normalized;
  if (typeof rec.groupChannel !== "string" && typeof rec.room === "string")
    rec.groupChannel = rec.room;
  delete rec.room;
  return normalized;
}
function resolveUpdatedAt(entry) {
  return typeof entry.updatedAt === "number" && Number.isFinite(entry.updatedAt)
    ? entry.updatedAt
    : 0;
}
function mergeSessionEntry(params) {
  if (!params.existing) return params.incoming;
  const existingUpdated = resolveUpdatedAt(params.existing);
  const incomingUpdated = resolveUpdatedAt(params.incoming);
  if (incomingUpdated > existingUpdated) return params.incoming;
  if (incomingUpdated < existingUpdated) return params.existing;
  return params.preferIncomingOnTie ? params.incoming : params.existing;
}
function canonicalizeSessionStore(params) {
  const canonical = Object.create(null);
  const meta = /* @__PURE__ */ new Map();
  const legacyKeys = [];
  for (const [key, entry] of Object.entries(params.store)) {
    if (!entry || typeof entry !== "object") continue;
    const canonicalKey = canonicalizeSessionKeyForAgent({
      key,
      agentId: params.agentId,
      mainKey: params.mainKey,
      scope: params.scope,
      skipCrossAgentRemap: params.skipCrossAgentRemap,
      preserveCanonicalAgentOwner: params.preserveCanonicalAgentOwner,
      preserveAmbiguousKeys: params.preserveAmbiguousKeys,
      preserveForeignMainAliases: params.preserveForeignMainAliases,
    });
    const isCanonical = canonicalKey === key;
    if (!isCanonical) legacyKeys.push(key);
    const existing = canonical[canonicalKey];
    if (!existing) {
      canonical[canonicalKey] = entry;
      meta.set(canonicalKey, {
        isCanonical,
        updatedAt: resolveUpdatedAt(entry),
      });
      continue;
    }
    const existingMeta = meta.get(canonicalKey);
    const incomingUpdated = resolveUpdatedAt(entry);
    const existingUpdated = existingMeta?.updatedAt ?? resolveUpdatedAt(existing);
    if (incomingUpdated > existingUpdated) {
      canonical[canonicalKey] = entry;
      meta.set(canonicalKey, {
        isCanonical,
        updatedAt: incomingUpdated,
      });
      continue;
    }
    if (incomingUpdated < existingUpdated) continue;
    if (existingMeta?.isCanonical && !isCanonical) continue;
    if (!existingMeta?.isCanonical && isCanonical) {
      canonical[canonicalKey] = entry;
      meta.set(canonicalKey, {
        isCanonical,
        updatedAt: incomingUpdated,
      });
      continue;
    }
  }
  return {
    store: canonical,
    legacyKeys,
  };
}
function isAmbiguousSharedStoreKey(key, mainKey, scope) {
  const raw = key.trim();
  const lower = normalizeLowercaseStringOrEmpty(raw);
  if (!raw || lower === "global" || lower === "unknown") return false;
  if (
    scope === "global" &&
    canonicalizeMainSessionAlias({
      cfg: {
        session: {
          scope,
          mainKey,
        },
      },
      agentId: "main",
      sessionKey: lower,
    }) === "global"
  )
    return false;
  return !resolveCanonicalAgentSessionOwner(raw) || isLegacyDefaultMainAliasKey(lower, mainKey);
}
function aliasedSessionStoreMigrationWarning(params) {
  return `Deferred ${params.subject} ${params.count} ambiguous session key(s) in aliased store ${params.storePath}; remove filesystem aliases or configure one canonical session.store path, then rerun openclaw doctor --fix`;
}
function unresolvedSessionStoreIdentityWarning(subject, storePath) {
  return `Deferred ${subject} for ${storePath}; filesystem identity could not be established for every configured store path. Restore path access or configure one canonical session.store path, then rerun openclaw doctor --fix`;
}
function distinctSessionStoreAliasWarning(subject, storePath) {
  return `Deferred ${subject} in aliased store ${storePath}; atomic replacement cannot update distinct filesystem aliases as one operation. Remove filesystem aliases or configure one canonical session.store path, then rerun openclaw doctor --fix`;
}
function resolveStaleLegacySessionFile(params) {
  if (!params.entry || typeof params.entry !== "object" || Array.isArray(params.entry)) return;
  const entry = params.entry;
  const rawSessionFile = entry.sessionFile;
  if (typeof rawSessionFile !== "string") return;
  const legacySessionFile = path.isAbsolute(rawSessionFile)
    ? path.resolve(rawSessionFile)
    : path.resolve(params.legacyDir, rawSessionFile);
  const relative = path.relative(path.resolve(params.legacyDir), legacySessionFile);
  if (relative.startsWith("..") || path.isAbsolute(relative) || fileExists(legacySessionFile))
    return;
  if (
    safeReadDir(path.dirname(params.legacyDir)).some(
      (dirent) =>
        dirent.isDirectory() &&
        dirent.name.startsWith(`${path.basename(params.legacyDir)}.legacy-`) &&
        fileExists(
          path.join(path.dirname(params.legacyDir), dirent.name, path.basename(legacySessionFile)),
        ),
    )
  )
    return;
  const parsed = path.parse(path.basename(legacySessionFile));
  if (
    safeReadDir(params.targetDir).some(
      (dirent) =>
        dirent.isFile() &&
        dirent.name.startsWith(`${parsed.name}.legacy-`) &&
        dirent.name.endsWith(parsed.ext),
    )
  )
    return;
  const targetSessionFile = path.join(params.targetDir, path.basename(legacySessionFile));
  if (!fileExists(targetSessionFile) || typeof entry.sessionId !== "string") return;
  const readFirstLine = () => {
    const fd = fs.openSync(targetSessionFile, "r");
    try {
      const buffer = Buffer.alloc(8192);
      const bytesRead = fs.readSync(fd, buffer, 0, buffer.length, 0);
      if (bytesRead <= 0) return;
      const chunk = buffer.subarray(0, bytesRead).toString("utf8");
      const newline = chunk.indexOf("\n");
      return newline >= 0 ? chunk.slice(0, newline) : chunk;
    } finally {
      fs.closeSync(fd);
    }
  };
  try {
    const firstLine = readFirstLine();
    const header = firstLine ? JSON.parse(firstLine) : void 0;
    if (!header || typeof header !== "object" || Array.isArray(header)) return;
    if (header.type === "session")
      return header.id === entry.sessionId ? targetSessionFile : void 0;
    return (path.basename(entry.sessionId) === entry.sessionId
      ? `${entry.sessionId}.jsonl`
      : void 0) === path.basename(targetSessionFile)
      ? targetSessionFile
      : void 0;
  } catch {
    return;
  }
}
function skipJson5Trivia(raw, index) {
  let i = index;
  while (i < raw.length) {
    const ch = raw[i];
    if (ch === " " || ch === "\n" || ch === "\r" || ch === "	") {
      i++;
      continue;
    }
    if (ch === "/" && raw[i + 1] === "/") {
      i += 2;
      while (i < raw.length && raw[i] !== "\n") i++;
      continue;
    }
    if (ch === "/" && raw[i + 1] === "*") {
      i += 2;
      while (i < raw.length && !(raw[i] === "*" && raw[i + 1] === "/")) i++;
      return i < raw.length ? i + 2 : i;
    }
    break;
  }
  return i;
}
function readJson5String(raw, index) {
  const quote = raw[index];
  if (quote !== '"' && quote !== "'") return null;
  let i = index + 1;
  let value = "";
  while (i < raw.length) {
    const ch = raw[i];
    if (ch === quote)
      return {
        value,
        next: i + 1,
      };
    if (ch === "\\") return null;
    value += ch;
    i++;
  }
  return null;
}
function readJson5BareKey(raw, index) {
  let i = index;
  while (i < raw.length) {
    const ch = raw[i];
    if (
      ch === ":" ||
      ch === " " ||
      ch === "\n" ||
      ch === "\r" ||
      ch === "	" ||
      ch === "," ||
      ch === "}" ||
      ch === "{" ||
      ch === "[" ||
      ch === "]"
    )
      break;
    i++;
  }
  if (i === index) return null;
  return {
    value: raw.slice(index, i),
    next: i,
  };
}
function listTopLevelSessionStoreKeys(raw) {
  let i = skipJson5Trivia(raw, 0);
  if (raw[i] !== "{") return null;
  i++;
  const keys = [];
  let depth = 1;
  let expectingKey = true;
  while (i < raw.length) {
    i = skipJson5Trivia(raw, i);
    const ch = raw[i];
    if (ch === void 0) return null;
    if (depth === 1 && ch === "}") return keys;
    if (depth === 1 && expectingKey) {
      const key = ch === '"' || ch === "'" ? readJson5String(raw, i) : readJson5BareKey(raw, i);
      if (!key) return null;
      i = skipJson5Trivia(raw, key.next);
      if (raw[i] !== ":") return null;
      keys.push(key.value);
      i++;
      expectingKey = false;
      continue;
    }
    if (ch === '"' || ch === "'") {
      const str = readJson5String(raw, i);
      if (!str) return null;
      i = str.next;
      continue;
    }
    if (ch === "{" || ch === "[") {
      depth++;
      i++;
      continue;
    }
    if (ch === "}" || ch === "]") {
      depth--;
      i++;
      if (depth < 1) return keys;
      continue;
    }
    if (depth === 1 && ch === ",") {
      expectingKey = true;
      i++;
      continue;
    }
    i++;
  }
  return null;
}
function sessionStoreTextMayNeedCanonicalization(params) {
  const keys = listTopLevelSessionStoreKeys(params.raw);
  if (!keys) return true;
  const storeAgentIds = new Set([...params.storeAgentIds].map((id) => normalizeAgentId(id)));
  const hasNonMainAgent = [...storeAgentIds].some((id) => id !== DEFAULT_AGENT_ID);
  for (const key of keys) {
    const rawKey = key.trim();
    if (rawKey !== key) return true;
    if (!rawKey) continue;
    const lowerKey = normalizeLowercaseStringOrEmpty(rawKey);
    if (lowerKey !== rawKey) return true;
    if (lowerKey === "global" || lowerKey === "unknown") continue;
    if (params.preserveForeignMainAliases && isLegacyDefaultMainAliasKey(lowerKey, params.mainKey))
      return true;
    if (lowerKey === "main" || lowerKey === params.mainKey) return true;
    if (lowerKey.startsWith("subagent:")) return true;
    if (lowerKey.startsWith("group:") || lowerKey.startsWith("channel:")) return true;
    if (!lowerKey.startsWith("agent:")) return true;
    const rowOwner = resolveCanonicalAgentSessionOwner(rawKey);
    if (!rowOwner) return true;
    const agentMainAlias = `agent:${rowOwner}:${DEFAULT_MAIN_KEY}`;
    const agentMainKey = `agent:${rowOwner}:${params.mainKey}`;
    if (lowerKey === agentMainAlias && (params.mainKey !== "main" || params.scope === "global"))
      return true;
    if (lowerKey === agentMainKey && params.scope === "global") return true;
    if (
      lowerKey === `agent:main:main` &&
      (params.mainKey !== "main" || hasNonMainAgent || params.scope === "global")
    )
      return true;
    if (
      lowerKey === `agent:main:${params.mainKey}` &&
      hasNonMainAgent &&
      !storeAgentIds.has("main")
    )
      return true;
  }
  return false;
}
function listLegacySessionKeys(params) {
  const legacy = [];
  for (const key of Object.keys(params.store))
    if (
      canonicalizeSessionKeyForAgent({
        key,
        agentId: params.agentId,
        mainKey: params.mainKey,
        scope: params.scope,
        skipCrossAgentRemap: params.preserveAmbiguousKeys,
        preserveCanonicalAgentOwner: params.preserveAmbiguousKeys,
        preserveAmbiguousKeys: params.preserveAmbiguousKeys,
        preserveForeignMainAliases: params.preserveForeignMainAliases,
      }) !== key
    )
      legacy.push(key);
  return legacy;
}
function emptyDirOrMissing(dir) {
  if (!existsDir(dir)) return true;
  return safeReadDir(dir).length === 0;
}
function removeDirIfEmpty(dir) {
  if (!existsDir(dir)) return;
  if (!emptyDirOrMissing(dir)) return;
  try {
    fs.rmdirSync(dir);
  } catch {}
}
async function migrateOrphanedSessionKeys(params) {
  const changes = [];
  const warnings = [];
  const env = params.env ?? process.env;
  const stateDir = resolveStateDir(env);
  const mainKey = normalizeMainKey(params.cfg.session?.mainKey);
  const scope = params.cfg.session?.scope;
  const storeConfig = params.cfg.session?.store;
  const pluginAgentIds =
    params.additionalAgentIds ??
    listPluginDoctorSessionStoreAgentIds({
      config: params.cfg,
      env,
      pluginIds: collectRelevantDoctorPluginIds(params.cfg),
    });
  const pluginAgentIdSet = new Set(pluginAgentIds.map((id) => normalizeAgentId(id)));
  const storeMap = /* @__PURE__ */ new Map();
  const storeAliasCandidates = /* @__PURE__ */ new Map();
  const addToStoreMap = (p, id) => {
    const storePath =
      [...storeMap.keys()].find((candidate) => sessionStorePathsMatch(candidate, p)) ?? p;
    const aliasCandidates =
      storeAliasCandidates.get(storePath) ?? /* @__PURE__ */ new Set([storePath]);
    aliasCandidates.add(p);
    storeAliasCandidates.set(storePath, aliasCandidates);
    const existing = storeMap.get(storePath);
    if (existing) existing.add(id);
    else storeMap.set(storePath, /* @__PURE__ */ new Set([id]));
  };
  for (const configuredAgentId of listConfiguredSessionStoreAgentIds(params.cfg)) {
    const id = normalizeAgentId(configuredAgentId);
    addToStoreMap(
      storeConfig
        ? resolveStorePathFromTemplate(storeConfig, id, env)
        : path.join(stateDir, "agents", id, "sessions", "sessions.json"),
      id,
    );
  }
  for (const pluginAgentId of pluginAgentIds) {
    const id = normalizeAgentId(pluginAgentId);
    addToStoreMap(
      storeConfig
        ? resolveStorePathFromTemplate(storeConfig, id, env)
        : path.join(stateDir, "agents", id, "sessions", "sessions.json"),
      id,
    );
  }
  const agentsDir = path.join(stateDir, "agents");
  if (existsDir(agentsDir)) {
    for (const dirEntry of safeReadDir(agentsDir))
      if (dirEntry.isDirectory()) {
        const diskAgentId = normalizeAgentId(dirEntry.name);
        if (diskAgentId)
          addToStoreMap(
            path.join(agentsDir, diskAgentId, "sessions", "sessions.json"),
            diskAgentId,
          );
      }
  }
  for (const [mappedStorePath, storeAgentIds] of storeMap) {
    const storePaths =
      storeAliasCandidates.get(mappedStorePath) ?? /* @__PURE__ */ new Set([mappedStorePath]);
    const storePath = [...storePaths].find((candidate) => fileExists(candidate));
    if (!storePath) continue;
    const pluginForeignMainAliasRisk = [...storeAgentIds].some(
      (id) => pluginAgentIdSet.has(id) && id !== "main",
    );
    let raw;
    try {
      raw = fs.readFileSync(storePath, "utf-8");
    } catch (err) {
      warnings.push(`Could not read ${storePath}: ${String(err)}`);
      continue;
    }
    if (
      !sessionStoreTextMayNeedCanonicalization({
        raw,
        storeAgentIds,
        mainKey,
        scope,
        preserveForeignMainAliases: pluginForeignMainAliasRisk,
      })
    )
      continue;
    let parsed;
    try {
      parsed = parseSessionStoreJson5(raw);
    } catch (err) {
      warnings.push(`Could not read ${storePath}: ${String(err)}`);
      continue;
    }
    if (!parsed.ok) continue;
    let working = parsed.store;
    let totalLegacy = 0;
    const storeAliases = resolveSessionStoreAliasPlan(storePath, storePaths);
    const hasDistinctAliases = storeAliases.hasDistinctAliases;
    const preserveAmbiguousKeys = storeAgentIds.size > 1;
    const preservedAmbiguousKeyCount = Object.keys(working).filter(
      (key) =>
        (preserveAmbiguousKeys && isAmbiguousSharedStoreKey(key, mainKey, scope)) ||
        (pluginForeignMainAliasRisk && isLegacyDefaultMainAliasKey(key, mainKey)),
    ).length;
    if (storeAliases.hasUnresolvedIdentity) {
      warnings.push(unresolvedSessionStoreIdentityWarning("session key migration", storePath));
      continue;
    }
    if (hasDistinctAliases && preservedAmbiguousKeyCount > 0) {
      warnings.push(
        aliasedSessionStoreMigrationWarning({
          subject: "migration of",
          count: preservedAmbiguousKeyCount,
          storePath,
        }),
      );
      continue;
    }
    if (storeAliases.hasFinalSymlink) {
      warnings.push(
        `Deferred session key migration in final-component symlink store ${storePath}; configure one canonical session.store path, then rerun openclaw doctor --fix`,
      );
      continue;
    }
    if (hasDistinctAliases) {
      warnings.push(distinctSessionStoreAliasWarning("session key migration", storePath));
      continue;
    }
    for (const storeAgentId of storeAgentIds) {
      const { store: canonicalized, legacyKeys } = canonicalizeSessionStore({
        store: working,
        agentId: storeAgentId,
        mainKey,
        scope,
        skipCrossAgentRemap: preserveAmbiguousKeys,
        preserveCanonicalAgentOwner: true,
        preserveAmbiguousKeys,
        preserveForeignMainAliases: pluginForeignMainAliasRisk,
      });
      working = canonicalized;
      totalLegacy += legacyKeys.length;
    }
    if (preservedAmbiguousKeyCount > 0)
      warnings.push(
        `Preserved ${preservedAmbiguousKeyCount} ambiguous session key(s) in potentially shared store ${storePath}`,
      );
    if (totalLegacy === 0) continue;
    const normalized = Object.create(null);
    for (const [key, entry] of Object.entries(working)) {
      const ne = normalizeSessionEntry(entry);
      if (ne) normalized[key] = ne;
    }
    try {
      await saveSessionStoreStrict(storePath, normalized);
      changes.push(`Canonicalized ${totalLegacy} orphaned session key(s) in ${storePath}`);
    } catch (err) {
      warnings.push(`Failed to write canonicalized store ${storePath}: ${String(err)}`);
    }
  }
  return {
    changes,
    warnings,
  };
}
async function migrateLegacyAcpSessionMetadata(params) {
  const changes = [];
  const warnings = [];
  const env = params.env ?? process.env;
  const now = params.now ?? (() => Date.now());
  const stateDir = resolveStateDir(env);
  const storeConfig = params.cfg.session?.store;
  const pluginAgentIds =
    params.pluginSessionStoreAgentIds ??
    listPluginDoctorSessionStoreAgentIds({
      config: params.cfg,
      env,
      pluginIds: collectRelevantDoctorPluginIds(params.cfg),
    });
  const normalizedPluginAgentIds = new Set(pluginAgentIds.map((id) => normalizeAgentId(id)));
  const declaredAgentIds = /* @__PURE__ */ new Set([
    ...listConfiguredSessionStoreAgentIds(params.cfg).map((id) => normalizeAgentId(id)),
    ...normalizedPluginAgentIds,
  ]);
  const declaredTargets = [...declaredAgentIds].map((agentId) => ({
    agentId,
    storePath: storeConfig
      ? resolveStorePathFromTemplate(storeConfig, agentId, env)
      : path.join(stateDir, "agents", agentId, "sessions", "sessions.json"),
  }));
  const pluginTargets = declaredTargets.filter(
    ({ agentId }) => agentId !== "main" && normalizedPluginAgentIds.has(agentId),
  );
  const configuredAgents = Array.isArray(params.cfg.agents?.list) ? params.cfg.agents.list : [];
  const configuredAgentIds = new Set(
    configuredAgents.flatMap((entry) => (entry?.id ? [normalizeAgentId(entry.id)] : [])),
  );
  const targets = resolveLegacyAcpMetadataSessionStoreTargets(
    [...declaredAgentIds].some((agentId) => !configuredAgentIds.has(agentId))
      ? {
          ...params.cfg,
          agents: {
            ...params.cfg.agents,
            list: [
              ...configuredAgents,
              ...[...declaredAgentIds]
                .filter((agentId) => !configuredAgentIds.has(agentId))
                .map((id) => ({ id })),
            ],
          },
        }
      : params.cfg,
    env,
  );
  const mainKey = normalizeMainKey(params.cfg.session?.mainKey);
  const scope = params.cfg.session?.scope;
  const storeGroups = [];
  for (const target of targets) {
    if (!fileExists(target.storePath)) continue;
    const group = storeGroups.find(({ target: existing }) =>
      sessionStorePathsMatch(existing.storePath, target.storePath),
    );
    const matchingDeclaredTargets = declaredTargets.filter((declaredTarget) =>
      sessionStorePathsMatch(target.storePath, declaredTarget.storePath),
    );
    if (group) {
      group.agentIds.add(normalizeAgentId(target.agentId));
      group.aliasCandidates.add(target.storePath);
      for (const declaredTarget of matchingDeclaredTargets) {
        group.agentIds.add(declaredTarget.agentId);
        group.aliasCandidates.add(declaredTarget.storePath);
      }
      continue;
    }
    storeGroups.push({
      target,
      agentIds: /* @__PURE__ */ new Set([
        normalizeAgentId(target.agentId),
        ...matchingDeclaredTargets.map((declaredTarget) => declaredTarget.agentId),
      ]),
      aliasCandidates: /* @__PURE__ */ new Set([
        target.storePath,
        ...matchingDeclaredTargets.map((declaredTarget) => declaredTarget.storePath),
      ]),
    });
  }
  for (const { target, agentIds, aliasCandidates } of storeGroups) {
    const storePath = target.storePath;
    const storeAliases = resolveSessionStoreAliasPlan(storePath, aliasCandidates);
    const pluginForeignMainAliasRisk = pluginTargets.some((pluginTarget) =>
      sessionStorePathsMatch(storePath, pluginTarget.storePath),
    );
    let parsed;
    try {
      parsed = readSessionStoreJson5(storePath);
    } catch (err) {
      warnings.push(`Could not read ${storePath}: ${String(err)}`);
      continue;
    }
    if (!parsed.ok) continue;
    const ambiguousKeyCount = Object.keys(parsed.store).filter(
      (key) =>
        isAmbiguousSharedStoreKey(key, mainKey, scope) ||
        (pluginForeignMainAliasRisk && isLegacyDefaultMainAliasKey(key, mainKey)),
    ).length;
    const hasLegacyAcpMetadata = Object.values(parsed.store).some(
      (entry) => normalizeSessionEntry(entry)?.acp !== void 0,
    );
    if (hasLegacyAcpMetadata && storeAliases.hasUnresolvedIdentity) {
      warnings.push(unresolvedSessionStoreIdentityWarning("ACP metadata migration", storePath));
      continue;
    }
    if (hasLegacyAcpMetadata && storeAliases.hasFinalSymlink) {
      warnings.push(
        `Deferred ACP metadata migration in final-component symlink store ${storePath}; configure one canonical session.store path, then rerun openclaw doctor --fix`,
      );
      continue;
    }
    if (hasLegacyAcpMetadata && storeAliases.hasDistinctAliases) {
      warnings.push(
        ambiguousKeyCount > 0
          ? aliasedSessionStoreMigrationWarning({
              subject: "ACP metadata migration for",
              count: ambiguousKeyCount,
              storePath,
            })
          : distinctSessionStoreAliasWarning("ACP metadata migration", storePath),
      );
      continue;
    }
    const normalized = Object.create(null);
    let migrated = 0;
    let preserved = 0;
    for (const [sessionKey, entry] of Object.entries(parsed.store)) {
      const normalizedEntry = normalizeSessionEntry(entry);
      if (!normalizedEntry) continue;
      if (normalizedEntry.acp) {
        const ambiguousSharedStoreKey = isAmbiguousSharedStoreKey(sessionKey, mainKey, scope);
        const ambiguousMultiOwnerKey = agentIds.size > 1 && ambiguousSharedStoreKey;
        const foreignMainAlias =
          pluginForeignMainAliasRisk && isLegacyDefaultMainAliasKey(sessionKey, mainKey);
        if (ambiguousMultiOwnerKey || foreignMainAlias) {
          preserved++;
          normalized[sessionKey] = normalizedEntry;
          continue;
        }
        writeAcpSessionMetaForMigration({
          sessionKey: canonicalizeSessionKeyForAgent({
            key: sessionKey,
            agentId: resolveCanonicalAgentSessionOwner(sessionKey) ?? target.agentId,
            mainKey,
            scope,
            skipCrossAgentRemap: true,
          }),
          sessionId: normalizedEntry.sessionId,
          meta: normalizedEntry.acp,
          env,
          now,
        });
        delete normalizedEntry.acp;
        migrated++;
      }
      normalized[sessionKey] = normalizedEntry;
    }
    if (preserved > 0)
      warnings.push(
        `Preserved ACP metadata for ${preserved} ambiguous session key(s) in potentially shared store ${storePath}`,
      );
    if (migrated === 0) continue;
    try {
      await saveSessionStoreStrict(storePath, normalized);
      changes.push(
        `Migrated ${migrated} ACP session metadata ${migrated === 1 ? "row" : "rows"} → shared SQLite state`,
      );
    } catch (err) {
      warnings.push(`Failed to write ACP metadata migration source ${storePath}: ${String(err)}`);
    }
  }
  return {
    changes,
    warnings,
  };
}
function resolveLegacyAcpMetadataSessionStoreTargets(cfg, env) {
  const stateDir = resolveStateDir(env);
  const agentsDirs = /* @__PURE__ */ new Set([path.join(stateDir, "agents")]);
  const targets = /* @__PURE__ */ new Map();
  const addTarget = (agentId, storePath) => {
    if (!isManagedLegacySessionStorePathSafe(storePath)) return;
    const agentsDir = resolveAgentsDirFromSessionStorePath(storePath);
    if (agentsDir) agentsDirs.add(agentsDir);
    if (!targets.has(storePath))
      targets.set(storePath, {
        agentId,
        storePath,
      });
  };
  for (const target of resolveAllAgentSessionStoreTargetsSync(cfg, { env }))
    addTarget(target.agentId, target.storePath);
  for (const target of resolveSessionStoreTargets(cfg, { allAgents: true }, { env }))
    addTarget(target.agentId, target.storePath);
  for (const agentsDir of agentsDirs) {
    if (!existsDir(agentsDir)) continue;
    for (const entry of safeReadDir(agentsDir)) {
      if (!entry.isDirectory()) continue;
      const agentId = normalizeAgentId(entry.name);
      const normalizedDirName = normalizeLowercaseStringOrEmpty(entry.name);
      if (agentId === "main" && normalizedDirName !== agentId) continue;
      addTarget(agentId, path.join(agentsDir, entry.name, "sessions", "sessions.json"));
    }
  }
  return [...targets.values()];
}
function isManagedLegacySessionStorePathSafe(storePath) {
  const resolvedStorePath = path.resolve(storePath);
  const agentsDir = resolveAgentsDirFromSessionStorePath(resolvedStorePath);
  if (!agentsDir) return true;
  if (!fileExists(resolvedStorePath)) return true;
  try {
    const stat = fs.lstatSync(resolvedStorePath);
    if (stat.isSymbolicLink() || !stat.isFile()) return false;
    const resolvedAgentsDir = path.resolve(agentsDir);
    const realStorePath = fs.realpathSync.native(resolvedStorePath);
    return isWithinDir(fs.realpathSync.native(resolvedAgentsDir), realStorePath);
  } catch {
    return false;
  }
}
function resolveStorePathFromTemplate(template, agentId, env) {
  const expand = (s) =>
    s.startsWith("~")
      ? expandHomePrefix(s, {
          env: env ?? process.env,
          homedir: os.homedir,
        })
      : s;
  if (template.includes("{agentId}"))
    return path.resolve(expand(template.replaceAll("{agentId}", agentId)));
  return path.resolve(expand(template));
}
function resolveSessionStorePathRelationship(left, right) {
  if (left === right) return "same";
  try {
    return sameFileIdentity(fs.statSync(left), fs.statSync(right)) ? "same" : "different";
  } catch (err) {
    const code = err.code;
    if (code !== "ENOENT" && code !== "ENOTDIR") return "unknown";
    const resolvedLeft = resolvePathThroughExistingParents(left);
    const resolvedRight = resolvePathThroughExistingParents(right);
    if (resolvedLeft === void 0 || resolvedRight === void 0) return "unknown";
    return resolvedLeft === resolvedRight ? "same" : "different";
  }
}
function sessionStorePathsMatch(left, right) {
  return resolveSessionStorePathRelationship(left, right) !== "different";
}
function resolvePathThroughExistingParents(filePath) {
  const resolvedPath = path.resolve(filePath);
  const suffix = [path.basename(resolvedPath)];
  let parentPath = path.dirname(resolvedPath);
  while (true)
    try {
      return path.join(fs.realpathSync.native(parentPath), ...suffix);
    } catch (err) {
      const code = err.code;
      if (code !== "ENOENT" && code !== "ENOTDIR") return;
      const nextParent = path.dirname(parentPath);
      if (nextParent === parentPath) return;
      suffix.unshift(path.basename(parentPath));
      parentPath = nextParent;
    }
}
function sessionStorePathIsFinalSymlink(storePath) {
  try {
    return fs.lstatSync(storePath).isSymbolicLink();
  } catch {
    return false;
  }
}
function sessionStorePathsHaveDistinctEntries(left, right) {
  if (left === right) return false;
  try {
    if (fs.lstatSync(left).isSymbolicLink() || fs.lstatSync(right).isSymbolicLink()) return true;
    return fs.realpathSync.native(left) !== fs.realpathSync.native(right);
  } catch (err) {
    const code = err.code;
    if (code !== "ENOENT" && code !== "ENOTDIR") return true;
    const resolvedLeft = resolvePathThroughExistingParents(left);
    const resolvedRight = resolvePathThroughExistingParents(right);
    return resolvedLeft === void 0 || resolvedLeft !== resolvedRight;
  }
}
function resolveSessionStoreAliasPlan(storePath, candidatePaths) {
  let hasDistinctEntries = false;
  let hasFinalSymlink = sessionStorePathIsFinalSymlink(storePath);
  let hasUnresolvedIdentity = false;
  for (const candidatePath of candidatePaths) {
    const relationship = resolveSessionStorePathRelationship(storePath, candidatePath);
    if (relationship === "different") continue;
    if (relationship === "unknown") {
      hasUnresolvedIdentity = true;
      continue;
    }
    hasFinalSymlink ||= sessionStorePathIsFinalSymlink(candidatePath);
    if (sessionStorePathsHaveDistinctEntries(storePath, candidatePath)) hasDistinctEntries = true;
  }
  return {
    hasDistinctAliases: hasFinalSymlink || hasDistinctEntries || hasUnresolvedIdentity,
    hasFinalSymlink,
    hasUnresolvedIdentity,
  };
}
function mergeSessionStoreAliasPlans(left, right) {
  if (!left) return right;
  return {
    hasDistinctAliases: left.hasDistinctAliases || right.hasDistinctAliases,
    hasFinalSymlink: left.hasFinalSymlink || right.hasFinalSymlink,
    hasUnresolvedIdentity: left.hasUnresolvedIdentity || right.hasUnresolvedIdentity,
  };
}
async function saveSessionStoreStrict(storePath, store) {
  await saveSessionStore(storePath, store, {
    skipMaintenance: true,
    requireWriteSuccess: true,
  });
}
function resolveSessionStoreOwnership(params) {
  const targetStorePath = path.join(
    params.stateDir,
    "agents",
    params.targetAgentId,
    "sessions",
    "sessions.json",
  );
  const configuredStore = params.cfg.session?.store;
  const resolveAgentStorePath = (agentId) =>
    configuredStore
      ? resolveStorePathFromTemplate(configuredStore, agentId, params.env)
      : path.join(params.stateDir, "agents", agentId, "sessions", "sessions.json");
  const preserveForeignMainAliases = params.pluginSessionStoreAgentIds.some((pluginAgentId) => {
    const id = normalizeAgentId(pluginAgentId);
    if (id === "main") return false;
    return sessionStorePathsMatch(resolveAgentStorePath(id), targetStorePath);
  });
  const configuredOwnerStorePaths = [
    .../* @__PURE__ */ new Set([
      ...listConfiguredSessionStoreAgentIds(params.cfg).map((id) => normalizeAgentId(id)),
      ...params.pluginSessionStoreAgentIds.map((id) => normalizeAgentId(id)),
    ]),
  ].map(resolveAgentStorePath);
  const preserveAmbiguousKeys =
    configuredOwnerStorePaths.filter((storePath) =>
      sessionStorePathsMatch(storePath, targetStorePath),
    ).length > 1;
  const candidateStorePaths = [...configuredOwnerStorePaths];
  const agentsDir = path.join(params.stateDir, "agents");
  for (const entry of safeReadDir(agentsDir))
    if (entry.isDirectory())
      candidateStorePaths.push(path.join(agentsDir, entry.name, "sessions", "sessions.json"));
  return {
    preserveAmbiguousKeys,
    preserveForeignMainAliases,
    targetStoreAliases: resolveSessionStoreAliasPlan(targetStorePath, candidateStorePaths),
  };
}
//#endregion
//#region src/infra/state-migrations.legacy-sessions.ts
async function migrateLegacySessions(detected, now, options = {}) {
  const changes = [];
  const warnings = [];
  if (!detected.sessions.hasLegacy)
    return {
      changes,
      warnings,
    };
  ensureMigrationDir(detected.sessions.targetDir);
  const legacyParsed = fileExists(detected.sessions.legacyStorePath)
    ? readSessionStoreJson5(detected.sessions.legacyStorePath)
    : {
        store: {},
        ok: true,
      };
  const targetParsed = fileExists(detected.sessions.targetStorePath)
    ? readSessionStoreJson5(detected.sessions.targetStorePath)
    : {
        store: {},
        ok: true,
      };
  const legacyStore = legacyParsed.store;
  const targetStore = targetParsed.store;
  if (detected.sessions.targetStoreAliases.hasUnresolvedIdentity) {
    warnings.push(
      unresolvedSessionStoreIdentityWarning(
        "legacy session migration",
        detected.sessions.targetStorePath,
      ),
    );
    return {
      changes,
      warnings,
    };
  }
  if (detected.sessions.targetStoreAliases.hasFinalSymlink) {
    warnings.push(
      `Deferred legacy session migration in final-component symlink store ${detected.sessions.targetStorePath}; configure one canonical session.store path, then rerun openclaw doctor --fix`,
    );
    return {
      changes,
      warnings,
    };
  }
  const ambiguousAliasedKeys = new Set(
    [...Object.keys(targetStore), ...Object.keys(legacyStore)].filter(
      (key) =>
        isAmbiguousSharedStoreKey(key, detected.targetMainKey, detected.targetScope) ||
        (detected.sessions.preserveForeignMainAliases &&
          isLegacyDefaultMainAliasKey(key, detected.targetMainKey)),
    ),
  );
  if (detected.sessions.targetStoreAliases.hasDistinctAliases) {
    warnings.push(
      ambiguousAliasedKeys.size > 0
        ? aliasedSessionStoreMigrationWarning({
            subject: "migration of",
            count: ambiguousAliasedKeys.size,
            storePath: detected.sessions.targetStorePath,
          })
        : distinctSessionStoreAliasWarning(
            "legacy session migration",
            detected.sessions.targetStorePath,
          ),
    );
    return {
      changes,
      warnings,
    };
  }
  const canonicalizedTarget = canonicalizeSessionStore({
    store: targetStore,
    agentId: detected.targetAgentId,
    mainKey: detected.targetMainKey,
    scope: detected.targetScope,
    skipCrossAgentRemap: detected.sessions.preserveAmbiguousKeys,
    preserveCanonicalAgentOwner: true,
    preserveAmbiguousKeys: detected.sessions.preserveAmbiguousKeys,
    preserveForeignMainAliases: detected.sessions.preserveForeignMainAliases,
  });
  const canonicalizedLegacy = canonicalizeSessionStore({
    store: legacyStore,
    agentId: detected.targetAgentId,
    mainKey: detected.targetMainKey,
    scope: detected.targetScope,
    preserveCanonicalAgentOwner: true,
    preserveForeignMainAliases: detected.sessions.preserveForeignMainAliases,
  });
  const preservedLegacyForeignMainAliasCount = detected.sessions.preserveForeignMainAliases
    ? Object.keys(legacyStore).filter((key) =>
        isLegacyDefaultMainAliasKey(key, detected.targetMainKey),
      ).length
    : 0;
  let repairedStaleSessionFiles = false;
  for (const entry of Object.values(canonicalizedTarget.store)) {
    const targetSessionFile = resolveStaleLegacySessionFile({
      entry,
      legacyDir: detected.sessions.legacyDir,
      targetDir: detected.sessions.targetDir,
    });
    if (targetSessionFile) {
      entry.sessionFile = targetSessionFile;
      repairedStaleSessionFiles = true;
    }
  }
  const merged = Object.create(null);
  for (const [key, entry] of Object.entries(canonicalizedTarget.store)) merged[key] = entry;
  for (const [key, entry] of Object.entries(canonicalizedLegacy.store))
    merged[key] = mergeSessionEntry({
      existing: merged[key],
      incoming: entry,
      preferIncomingOnTie: false,
    });
  const mainKey = buildAgentMainSessionKey({
    agentId: detected.targetAgentId,
    mainKey: detected.targetMainKey,
  });
  let migratedDirectChatKey;
  if (!merged[mainKey]) {
    const latest = pickLatestLegacyDirectEntry(legacyStore);
    if (latest?.sessionId) {
      merged[mainKey] = latest;
      migratedDirectChatKey = mainKey;
    }
  }
  if (!legacyParsed.ok)
    warnings.push(
      `Legacy sessions store unreadable; left in place at ${detected.sessions.legacyStorePath}`,
    );
  let targetReadable = !fileExists(detected.sessions.targetStorePath) || targetParsed.ok;
  if (!targetReadable)
    if (options.recoverCorruptTargetStore) {
      const archivedTargetPath = `${detected.sessions.targetStorePath}.corrupt-${now()}`;
      try {
        fs.renameSync(detected.sessions.targetStorePath, archivedTargetPath);
        changes.push(`Archived corrupt target sessions store → ${archivedTargetPath}`);
        targetReadable = true;
      } catch (err) {
        warnings.push(
          `Target sessions store unreadable; failed to archive ${detected.sessions.targetStorePath}: ${String(err)}`,
        );
      }
    } else
      warnings.push(
        `Target sessions store unreadable; left untouched to avoid overwriting at ${detected.sessions.targetStorePath}. Run openclaw doctor --fix to archive it and retry the legacy merge.`,
      );
  if (
    targetReadable &&
    (legacyParsed.ok || targetParsed.ok) &&
    (Object.keys(legacyStore).length > 0 || Object.keys(targetStore).length > 0)
  ) {
    const normalized = Object.create(null);
    for (const [key, entry] of Object.entries(merged)) {
      const normalizedEntry = normalizeSessionEntry(entry);
      if (!normalizedEntry) continue;
      normalized[key] = normalizedEntry;
    }
    await saveSessionStoreStrict(detected.sessions.targetStorePath, normalized);
    if (migratedDirectChatKey)
      changes.push(`Migrated latest direct-chat session → ${migratedDirectChatKey}`);
    changes.push(`Merged sessions store → ${detected.sessions.targetStorePath}`);
    if (preservedLegacyForeignMainAliasCount > 0)
      warnings.push(
        `Preserved ${preservedLegacyForeignMainAliasCount} ambiguous session key(s) while importing legacy sessions into ${detected.sessions.targetStorePath}`,
      );
    if (canonicalizedTarget.legacyKeys.length > 0)
      changes.push(`Canonicalized ${canonicalizedTarget.legacyKeys.length} legacy session key(s)`);
    if (repairedStaleSessionFiles) changes.push("Repaired migrated session transcript paths");
  }
  if (!targetReadable)
    return {
      changes,
      warnings,
    };
  const movedSessionFiles = /* @__PURE__ */ new Map();
  const entries = safeReadDir(detected.sessions.legacyDir);
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (entry.name === "sessions.json") continue;
    const from = path.join(detected.sessions.legacyDir, entry.name);
    let to = path.join(detected.sessions.targetDir, entry.name);
    if (fileExists(to)) {
      const parsed = path.parse(entry.name);
      to = path.join(detected.sessions.targetDir, `${parsed.name}.legacy-${now()}${parsed.ext}`);
    }
    try {
      fs.renameSync(from, to);
      movedSessionFiles.set(path.resolve(from), to);
      changes.push(`Moved ${entry.name} → agents/${detected.targetAgentId}/sessions`);
    } catch (err) {
      warnings.push(`Failed moving ${from}: ${String(err)}`);
    }
  }
  if (movedSessionFiles.size > 0) {
    let rewroteSessionFiles = false;
    for (const entry of Object.values(merged)) {
      const rawSessionFile = entry.sessionFile;
      const legacySessionFile =
        typeof rawSessionFile === "string"
          ? path.resolve(detected.sessions.legacyDir, rawSessionFile)
          : typeof entry.sessionId === "string"
            ? path.join(detected.sessions.legacyDir, `${entry.sessionId}.jsonl`)
            : void 0;
      const movedSessionFile = legacySessionFile
        ? movedSessionFiles.get(path.resolve(legacySessionFile))
        : void 0;
      if (!movedSessionFile) continue;
      entry.sessionFile = movedSessionFile;
      rewroteSessionFiles = true;
    }
    if (rewroteSessionFiles) {
      const normalized = Object.create(null);
      for (const [key, entry] of Object.entries(merged)) {
        const normalizedEntry = normalizeSessionEntry(entry);
        if (normalizedEntry) normalized[key] = normalizedEntry;
      }
      await saveSessionStoreStrict(detected.sessions.targetStorePath, normalized);
      changes.push("Rewrote migrated session transcript paths");
    }
  }
  if (legacyParsed.ok && targetReadable)
    try {
      if (fileExists(detected.sessions.legacyStorePath))
        fs.rmSync(detected.sessions.legacyStorePath, { force: true });
    } catch {}
  removeDirIfEmpty(detected.sessions.legacyDir);
  if (safeReadDir(detected.sessions.legacyDir).filter((e) => e.isFile()).length > 0) {
    const backupDir = `${detected.sessions.legacyDir}.legacy-${now()}`;
    try {
      fs.renameSync(detected.sessions.legacyDir, backupDir);
      warnings.push(`Left legacy sessions at ${backupDir}`);
    } catch {}
  }
  return {
    changes,
    warnings,
  };
}
async function migrateLegacyAgentDir(detected, now) {
  const changes = [];
  const warnings = [];
  if (!detected.agentDir.hasLegacy)
    return {
      changes,
      warnings,
    };
  ensureMigrationDir(detected.agentDir.targetDir);
  const entries = safeReadDir(detected.agentDir.legacyDir);
  for (const entry of entries) {
    const from = path.join(detected.agentDir.legacyDir, entry.name);
    const to = path.join(detected.agentDir.targetDir, entry.name);
    if (fs.existsSync(to)) continue;
    try {
      fs.renameSync(from, to);
      changes.push(`Moved agent file ${entry.name} → agents/${detected.targetAgentId}/agent`);
    } catch (err) {
      warnings.push(`Failed moving ${from}: ${String(err)}`);
    }
  }
  removeDirIfEmpty(detected.agentDir.legacyDir);
  if (!emptyDirOrMissing(detected.agentDir.legacyDir)) {
    const backupDir = path.join(
      detected.stateDir,
      "agents",
      detected.targetAgentId,
      `agent.legacy-${now()}`,
    );
    try {
      fs.renameSync(detected.agentDir.legacyDir, backupDir);
      warnings.push(`Left legacy agent dir at ${backupDir}`);
    } catch (err) {
      warnings.push(`Failed relocating legacy agent dir: ${String(err)}`);
    }
  }
  return {
    changes,
    warnings,
  };
}
//#endregion
//#region src/infra/state-migrations.messages.ts
function mergeNotices(sources) {
  return [...new Set(sources.flatMap((source) => (source?.notices ? [...source.notices] : [])))];
}
//#endregion
//#region src/infra/state-migrations.task-sidecar-rows.ts
function normalizeLegacySqliteInteger(value) {
  if (typeof value === "bigint") return Number(value);
  return value;
}
function listSqliteColumns(db, table) {
  const rows = db.prepare(`PRAGMA table_info(${table})`).all();
  return new Set(rows.flatMap((row) => (row.name ? [row.name] : [])));
}
function pickLegacyColumn(columns, name, fallbackSql = "NULL") {
  return columns.has(name) ? name : `${fallbackSql} AS ${name}`;
}
function legacyBindValue(value) {
  if (
    value == null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "bigint" ||
    value instanceof Uint8Array
  )
    return value ?? null;
  return JSON.stringify(value);
}
function legacyStringValue(value) {
  return typeof value === "string" ? value : "";
}
function normalizeLegacyTaskRow(row) {
  const runtime = legacyStringValue(row.runtime);
  const sourceId = typeof row.source_id === "string" ? row.source_id : "";
  const taskId = legacyStringValue(row.task_id);
  const ownerRaw = typeof row.owner_key === "string" ? row.owner_key.trim() : "";
  const requesterRaw =
    typeof row.requester_session_key === "string" ? row.requester_session_key.trim() : "";
  const ownerKey = ownerRaw || requesterRaw || `system:${runtime}:${sourceId || taskId}`;
  const scopeKind =
    (typeof row.scope_kind === "string" ? row.scope_kind : "") === "system" ||
    ownerKey.startsWith("system:")
      ? "system"
      : "session";
  const childSessionKey =
    typeof row.child_session_key === "string" ? row.child_session_key.trim() : "";
  const persistedAgentId = typeof row.agent_id === "string" ? row.agent_id.trim() : "";
  const isSpawnRuntime = runtime === "subagent" || runtime === "acp";
  const childAgentId = isSpawnRuntime ? parseAgentSessionKey(childSessionKey)?.agentId : void 0;
  const requesterAgentId =
    (typeof row.requester_agent_id === "string" ? row.requester_agent_id.trim() : "") ||
    (isSpawnRuntime
      ? (parseAgentSessionKey(ownerKey)?.agentId ??
        parseAgentSessionKey(requesterRaw)?.agentId ??
        (childAgentId && persistedAgentId !== childAgentId ? persistedAgentId : ""))
      : "");
  const executorAgentId = requesterAgentId ? childAgentId || persistedAgentId : persistedAgentId;
  const deliveryStatus =
    row.delivery_status === "not-requested" ? "not_applicable" : row.delivery_status;
  return {
    task_id: taskId,
    runtime,
    task_kind: legacyBindValue(row.task_kind),
    source_id: legacyBindValue(row.source_id),
    requester_session_key: scopeKind === "system" ? "" : requesterRaw || ownerKey,
    owner_key: ownerKey,
    scope_kind: scopeKind,
    child_session_key: childSessionKey || null,
    parent_flow_id: legacyBindValue(row.parent_flow_id),
    parent_task_id: legacyBindValue(row.parent_task_id),
    agent_id: executorAgentId || null,
    requester_agent_id: requesterAgentId || null,
    run_id: legacyBindValue(row.run_id),
    label: legacyBindValue(row.label),
    task: legacyBindValue(row.task ?? ""),
    status: legacyBindValue(row.status ?? ""),
    delivery_status: legacyBindValue(deliveryStatus ?? ""),
    notify_policy: legacyBindValue(row.notify_policy ?? ""),
    created_at: normalizeLegacySqliteInteger(row.created_at) ?? 0,
    started_at: normalizeLegacySqliteInteger(row.started_at),
    ended_at: normalizeLegacySqliteInteger(row.ended_at),
    last_event_at: normalizeLegacySqliteInteger(row.last_event_at),
    cleanup_after: normalizeLegacySqliteInteger(row.cleanup_after),
    error: legacyBindValue(row.error),
    progress_summary: legacyBindValue(row.progress_summary),
    terminal_summary: legacyBindValue(row.terminal_summary),
    terminal_outcome: legacyBindValue(row.terminal_outcome),
    detail_json: legacyBindValue(row.detail_json),
  };
}
function readLegacyTaskRows(sourcePath) {
  const db = new (requireNodeSqlite().DatabaseSync)(sourcePath, { readOnly: true });
  try {
    const columns = listSqliteColumns(db, "task_runs");
    if (columns.size === 0) return [];
    const selectColumns = [
      "task_id",
      "runtime",
      pickLegacyColumn(columns, "task_kind"),
      pickLegacyColumn(columns, "source_id"),
      pickLegacyColumn(columns, "requester_session_key"),
      pickLegacyColumn(columns, "owner_key"),
      pickLegacyColumn(columns, "scope_kind"),
      pickLegacyColumn(columns, "child_session_key"),
      pickLegacyColumn(columns, "parent_flow_id"),
      pickLegacyColumn(columns, "parent_task_id"),
      pickLegacyColumn(columns, "agent_id"),
      pickLegacyColumn(columns, "requester_agent_id"),
      pickLegacyColumn(columns, "run_id"),
      pickLegacyColumn(columns, "label"),
      "task",
      "status",
      "delivery_status",
      "notify_policy",
      "created_at",
      pickLegacyColumn(columns, "started_at"),
      pickLegacyColumn(columns, "ended_at"),
      pickLegacyColumn(columns, "last_event_at"),
      pickLegacyColumn(columns, "cleanup_after"),
      pickLegacyColumn(columns, "error"),
      pickLegacyColumn(columns, "progress_summary"),
      pickLegacyColumn(columns, "terminal_summary"),
      pickLegacyColumn(columns, "terminal_outcome"),
      pickLegacyColumn(columns, "detail_json"),
    ];
    return db
      .prepare(
        `SELECT ${selectColumns.join(", ")} FROM task_runs ORDER BY created_at ASC, task_id ASC`,
      )
      .all()
      .map((row) => normalizeLegacyTaskRow(row));
  } finally {
    db.close();
  }
}
function readLegacyTaskDeliveryRows(sourcePath) {
  const db = new (requireNodeSqlite().DatabaseSync)(sourcePath, { readOnly: true });
  try {
    if (listSqliteColumns(db, "task_delivery_state").size === 0) return [];
    return db
      .prepare(
        `SELECT task_id, requester_origin_json, last_notified_event_at FROM task_delivery_state ORDER BY task_id ASC`,
      )
      .all();
  } finally {
    db.close();
  }
}
function insertTaskRunRowSql(db, row) {
  db.prepare(`
      INSERT INTO task_runs (
        task_id, runtime, task_kind, source_id, requester_session_key, owner_key, scope_kind,
        child_session_key, parent_flow_id, parent_task_id, agent_id, requester_agent_id, run_id,
        label, task, status, delivery_status, notify_policy, created_at, started_at, ended_at,
        last_event_at, cleanup_after, error, progress_summary, terminal_summary, terminal_outcome,
        detail_json
      ) VALUES (
        @task_id, @runtime, @task_kind, @source_id, @requester_session_key, @owner_key,
        @scope_kind, @child_session_key, @parent_flow_id, @parent_task_id, @agent_id,
        @requester_agent_id, @run_id, @label, @task, @status, @delivery_status, @notify_policy,
        @created_at, @started_at, @ended_at, @last_event_at, @cleanup_after, @error,
        @progress_summary, @terminal_summary, @terminal_outcome, @detail_json
      )
    `).run(row);
}
function insertTaskDeliveryRowSql(db, row) {
  db.prepare(`
      INSERT INTO task_delivery_state (
        task_id, requester_origin_json, last_notified_event_at
      ) VALUES (
        @task_id, @requester_origin_json, @last_notified_event_at
      )
    `).run(row);
}
//#endregion
//#region src/infra/state-migrations.storage.ts
const PLUGIN_STATE_SQLITE_SIDECAR_SUFFIXES = ["", "-shm", "-wal", "-journal"];
const TASK_STATE_SQLITE_SIDECAR_SUFFIXES = ["", "-shm", "-wal", "-journal"];
const LEGACY_DELIVERY_QUEUE_DIRS = [
  {
    label: "outbound delivery queue",
    queueName: "outbound",
    dirName: "delivery-queue",
  },
  {
    label: "session delivery queue",
    queueName: "session",
    dirName: "session-delivery-queue",
  },
];
var LegacyTaskStateSidecarConflictError = class extends Error {
  constructor(conflictedKeys) {
    super("legacy task-state sidecar conflicts with shared state");
    this.conflictedKeys = conflictedKeys;
  }
};
function buildLegacyMigrationPreview(plan) {
  if (plan.kind === "plugin-state-import")
    return plan.preview ?? `- ${plan.label}: ${plan.sourcePath}`;
  return `- ${plan.label}: ${plan.sourcePath} → ${plan.targetPath}`;
}
function resolveLegacyPluginStateSidecarPath(stateDir) {
  return path.join(stateDir, "plugin-state", "state.sqlite");
}
function resolveLegacyTaskRunsSidecarPath(stateDir) {
  return path.join(stateDir, "tasks", "runs.sqlite");
}
function resolveLegacyFlowRunsSidecarPath(stateDir) {
  return path.join(stateDir, "flows", "registry.sqlite");
}
function readLegacyPluginStateSidecarRows(sourcePath) {
  const db = new (requireNodeSqlite().DatabaseSync)(sourcePath, { readOnly: true });
  try {
    return db
      .prepare(`
          SELECT plugin_id, namespace, entry_key, value_json, created_at, expires_at
          FROM plugin_state_entries
          ORDER BY plugin_id ASC, namespace ASC, entry_key ASC
        `)
      .all();
  } finally {
    db.close();
  }
}
function legacyPluginStateRowsMatch(existing, legacy) {
  return (
    existing.value_json === legacy.value_json &&
    normalizeLegacySqliteInteger(existing.created_at) ===
      normalizeLegacySqliteInteger(legacy.created_at) &&
    normalizeLegacySqliteInteger(existing.expires_at) ===
      normalizeLegacySqliteInteger(legacy.expires_at)
  );
}
function isLegacyPluginStateRowExpired(row, now) {
  const expiresAt = normalizeLegacySqliteInteger(row.expires_at);
  return expiresAt !== null && expiresAt <= now;
}
function hasPendingSqliteSidecarArchive(sourcePath, suffixes) {
  return (
    !fileExists(sourcePath) &&
    fileExists(`${sourcePath}.migrated`) &&
    suffixes.some((suffix) => suffix !== "" && fileExists(`${sourcePath}${suffix}`))
  );
}
function firstFreeArchivePath(sourcePath) {
  for (let index = 2; ; index++) {
    const candidate = `${sourcePath}.migrated.${index}`;
    if (!fs.existsSync(candidate)) return candidate;
  }
}
function archiveLegacyFileSource(params) {
  const archivedPath = `${params.sourcePath}.migrated`;
  try {
    if (fileExists(archivedPath)) {
      if (fs.readFileSync(params.sourcePath).equals(fs.readFileSync(archivedPath))) {
        fs.rmSync(params.sourcePath, { force: true });
        return {
          sourcePath: params.sourcePath,
          targetPath: archivedPath,
          action: "removed",
        };
      }
      const nextArchivePath = firstFreeArchivePath(params.sourcePath);
      fs.renameSync(params.sourcePath, nextArchivePath);
      return {
        sourcePath: params.sourcePath,
        targetPath: nextArchivePath,
        action: "archived",
      };
    }
    fs.renameSync(params.sourcePath, archivedPath);
    return {
      sourcePath: params.sourcePath,
      targetPath: archivedPath,
      action: "archived",
    };
  } catch (err) {
    params.warnings.push(`Failed archiving ${params.label} ${params.sourcePath}: ${String(err)}`);
    return null;
  }
}
function recordArchiveCollisionResolutions(changes, label, resolutions) {
  for (const resolution of resolutions)
    changes.push(
      resolution.action === "removed"
        ? `Removed already-archived ${label} legacy source ${resolution.sourcePath}`
        : `Archived ${label} legacy source → ${resolution.targetPath}`,
    );
}
function archiveLegacyPluginStateSidecar(params) {
  const existingSources = PLUGIN_STATE_SQLITE_SIDECAR_SUFFIXES.map(
    (suffix) => `${params.sourcePath}${suffix}`,
  ).filter(fileExists);
  if (existingSources.length === 0) return;
  const resolutions = [];
  for (const sourcePath of existingSources) {
    const resolution = archiveLegacyFileSource({
      sourcePath,
      label: "plugin-state sidecar",
      warnings: params.warnings,
    });
    if (!resolution) return;
    resolutions.push(resolution);
  }
  if (
    resolutions.every(
      (resolution) =>
        resolution.action === "archived" &&
        resolution.targetPath === `${resolution.sourcePath}.migrated`,
    )
  )
    params.changes.push(
      `Archived plugin-state sidecar legacy source → ${params.sourcePath}.migrated`,
    );
  else recordArchiveCollisionResolutions(params.changes, "plugin-state sidecar", resolutions);
}
function readLegacyInstalledPluginIndex(sourcePath) {
  try {
    const parsed = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
    const current = parseInstalledPluginIndex(parsed);
    if (current) return current;
    const installRecords =
      readLegacyTopLevelInstallRecords(parsed) ?? readLegacyEmbeddedInstallRecords(parsed);
    if (!installRecords || typeof installRecords !== "object" || Array.isArray(installRecords))
      return null;
    return parseInstalledPluginIndex({
      version: 1,
      hostContractVersion: "legacy",
      compatRegistryVersion: "legacy",
      migrationVersion: 1,
      policyHash: "legacy",
      generatedAtMs: 0,
      installRecords,
      plugins: [],
      diagnostics: [],
    });
  } catch {
    return null;
  }
}
function readLegacyTopLevelInstallRecords(parsed) {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
  const legacy = parsed;
  return legacy.installRecords ?? legacy.records;
}
function readLegacyEmbeddedInstallRecords(parsed) {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
  const plugins = parsed.plugins;
  if (!Array.isArray(plugins)) return null;
  const records = {};
  for (const plugin of plugins) {
    if (!plugin || typeof plugin !== "object" || Array.isArray(plugin)) continue;
    const pluginId = plugin.pluginId;
    const installRecord = plugin.installRecord;
    if (
      typeof pluginId === "string" &&
      pluginId.trim() &&
      installRecord &&
      typeof installRecord === "object" &&
      !Array.isArray(installRecord)
    )
      records[pluginId] = installRecord;
  }
  return Object.keys(records).length > 0 ? records : null;
}
function legacyInstalledPluginIndexMatches(current, legacy) {
  return (
    JSON.stringify(current.installRecords) === JSON.stringify(legacy.installRecords) &&
    JSON.stringify(current.plugins) === JSON.stringify(legacy.plugins) &&
    JSON.stringify(current.diagnostics) === JSON.stringify(legacy.diagnostics)
  );
}
function readInstallRecordField(record, key) {
  return record[key];
}
function readInstallRecordStringField(record, key) {
  const value = readInstallRecordField(record, key);
  return typeof value === "string" ? value : void 0;
}
function legacyInstallRecordHasCurrentResolvedIdentity(params) {
  const { currentRecord, legacyRecord } = params;
  const currentResolvedSpec = readInstallRecordStringField(currentRecord, "resolvedSpec");
  const legacySpec = readInstallRecordStringField(legacyRecord, "spec");
  if (legacySpec) return currentResolvedSpec === legacySpec;
  const legacyResolvedSpec = readInstallRecordStringField(legacyRecord, "resolvedSpec");
  return Boolean(legacyResolvedSpec && currentResolvedSpec === legacyResolvedSpec);
}
function readAuthoritativeCurrentNpmIdentity(record) {
  const resolvedName = readInstallRecordStringField(record, "resolvedName");
  const resolvedVersion = readInstallRecordStringField(record, "resolvedVersion");
  if (resolvedName && resolvedVersion)
    return {
      name: resolvedName,
      version: resolvedVersion,
    };
  const resolvedSpec = readInstallRecordStringField(record, "resolvedSpec");
  const parsed = resolvedSpec ? parseRegistryNpmSpec(resolvedSpec) : null;
  if (parsed?.selectorKind === "exact-version" && parsed.selector)
    return {
      name: parsed.name,
      version: parsed.selector,
    };
  return null;
}
function legacyNpmInstallRecordSupersededByCurrent(params) {
  const { currentRecord, legacyRecord } = params;
  if (currentRecord.source !== "npm" || legacyRecord.source !== "npm") return false;
  const legacySpec = readInstallRecordStringField(legacyRecord, "spec");
  const legacyParsedSpec = legacySpec ? parseRegistryNpmSpec(legacySpec) : null;
  if (legacyParsedSpec?.selectorKind !== "exact-version") return false;
  const currentIdentity = readAuthoritativeCurrentNpmIdentity(currentRecord);
  return Boolean(
    currentIdentity &&
    legacyParsedSpec.selector &&
    currentIdentity.name === legacyParsedSpec.name &&
    currentIdentity.version === legacyParsedSpec.selector,
  );
}
function legacyInstallRecordCoveredByCurrent(currentRecord, legacyRecord) {
  if (currentRecord.source !== legacyRecord.source) return false;
  if (
    legacyNpmInstallRecordSupersededByCurrent({
      currentRecord,
      legacyRecord,
    })
  )
    return true;
  for (const key of Object.keys(legacyRecord).toSorted()) {
    const currentValue = readInstallRecordField(currentRecord, key);
    if (currentValue === readInstallRecordField(legacyRecord, key)) continue;
    if (
      key === "spec" &&
      legacyInstallRecordHasCurrentResolvedIdentity({
        currentRecord,
        legacyRecord,
      })
    )
      continue;
    if ((key === "resolvedAt" || key === "installedAt") && typeof currentValue === "string")
      continue;
    return false;
  }
  return true;
}
function mergeLegacyInstalledPluginIndexRecords(current, legacy) {
  const installRecords = { ...current.installRecords };
  const conflicts = [];
  let addedCount = 0;
  for (const [pluginId, legacyRecord] of Object.entries(legacy.installRecords)) {
    const currentRecord = installRecords[pluginId];
    if (!currentRecord) {
      installRecords[pluginId] = legacyRecord;
      addedCount += 1;
      continue;
    }
    if (!legacyInstallRecordCoveredByCurrent(currentRecord, legacyRecord)) conflicts.push(pluginId);
  }
  return {
    merged: {
      ...current,
      installRecords,
    },
    addedCount,
    conflicts,
  };
}
function archiveLegacyInstalledPluginIndex(params) {
  const resolution = archiveLegacyFileSource({
    sourcePath: params.sourcePath,
    label: "plugin install index",
    warnings: params.warnings,
  });
  if (!resolution) return;
  params.changes.push(
    resolution.action === "removed"
      ? `Removed already-archived plugin install index legacy source ${params.sourcePath}`
      : `Archived plugin install index legacy source → ${resolution.targetPath}`,
  );
}
function archiveLegacyTaskStateSidecar(params) {
  const existingSources = TASK_STATE_SQLITE_SIDECAR_SUFFIXES.map(
    (suffix) => `${params.sourcePath}${suffix}`,
  ).filter(fileExists);
  if (existingSources.length === 0) return;
  const resolutions = [];
  for (const sourcePath of existingSources) {
    const resolution = archiveLegacyFileSource({
      sourcePath,
      label: `${params.label} sidecar`,
      warnings: params.warnings,
    });
    if (!resolution) return;
    resolutions.push(resolution);
  }
  if (
    resolutions.every(
      (resolution) =>
        resolution.action === "archived" &&
        resolution.targetPath === `${resolution.sourcePath}.migrated`,
    )
  )
    params.changes.push(
      `Archived ${params.label} sidecar legacy source → ${params.sourcePath}.migrated`,
    );
  else recordArchiveCollisionResolutions(params.changes, `${params.label} sidecar`, resolutions);
}
function hardenLegacyImportSource(params) {
  try {
    fs.chmodSync(params.sourcePath, 384);
    return true;
  } catch (err) {
    params.warnings.push(`Failed securing ${params.label} legacy source: ${String(err)}`);
    return false;
  }
}
function archiveLegacyImportSource(params) {
  if (!hardenLegacyImportSource(params)) return;
  const resolution = archiveLegacyFileSource({
    sourcePath: params.sourcePath,
    label: `${params.label} legacy source`,
    warnings: params.warnings,
  });
  if (!resolution) return;
  if (resolution.action === "archived")
    try {
      fs.chmodSync(resolution.targetPath, 384);
    } catch (err) {
      params.warnings.push(
        `Failed securing archived ${params.label} legacy source: ${String(err)}`,
      );
    }
  params.changes.push(
    resolution.action === "removed"
      ? `Removed already-archived ${params.label} legacy source ${params.sourcePath}`
      : `Archived ${params.label} legacy source → ${resolution.targetPath}`,
  );
}
function legacyKeyValue(value) {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "bigint") return `${value}`;
  return "";
}
function normalizeLegacyFlowRow(row) {
  const syncMode =
    row.sync_mode === "task_mirrored" || row.shape === "single_task" ? "task_mirrored" : "managed";
  const ownerKey =
    typeof row.owner_key === "string" && row.owner_key.trim()
      ? row.owner_key.trim()
      : typeof row.owner_session_key === "string"
        ? row.owner_session_key.trim()
        : "";
  const controllerId =
    syncMode === "managed"
      ? typeof row.controller_id === "string" && row.controller_id.trim()
        ? row.controller_id.trim()
        : "core/legacy-restored"
      : null;
  return {
    flow_id: legacyBindValue(row.flow_id ?? ""),
    shape: legacyBindValue(row.shape),
    sync_mode: syncMode,
    owner_key: ownerKey,
    requester_origin_json: legacyBindValue(row.requester_origin_json),
    controller_id: controllerId,
    revision: normalizeLegacySqliteInteger(row.revision) ?? 0,
    status: legacyBindValue(row.status ?? ""),
    notify_policy: legacyBindValue(row.notify_policy ?? ""),
    goal: legacyBindValue(row.goal ?? ""),
    current_step: legacyBindValue(row.current_step),
    blocked_task_id: legacyBindValue(row.blocked_task_id),
    blocked_summary: legacyBindValue(row.blocked_summary),
    state_json: legacyBindValue(row.state_json),
    wait_json: legacyBindValue(row.wait_json),
    cancel_requested_at: normalizeLegacySqliteInteger(row.cancel_requested_at),
    created_at: normalizeLegacySqliteInteger(row.created_at) ?? 0,
    updated_at: normalizeLegacySqliteInteger(row.updated_at) ?? 0,
    ended_at: normalizeLegacySqliteInteger(row.ended_at),
  };
}
function legacyRowsMatch(existing, incoming, columns) {
  return columns.every(
    (column) =>
      normalizeLegacySqliteInteger(existing[column]) ===
      normalizeLegacySqliteInteger(incoming[column]),
  );
}
function readLegacyFlowRows(sourcePath) {
  const db = new (requireNodeSqlite().DatabaseSync)(sourcePath, { readOnly: true });
  try {
    const columns = listSqliteColumns(db, "flow_runs");
    if (columns.size === 0) return [];
    const selectColumns = [
      "flow_id",
      pickLegacyColumn(columns, "shape"),
      pickLegacyColumn(columns, "sync_mode"),
      pickLegacyColumn(columns, "owner_key"),
      pickLegacyColumn(columns, "owner_session_key"),
      pickLegacyColumn(columns, "requester_origin_json"),
      pickLegacyColumn(columns, "controller_id"),
      pickLegacyColumn(columns, "revision", "0"),
      "status",
      "notify_policy",
      "goal",
      pickLegacyColumn(columns, "current_step"),
      pickLegacyColumn(columns, "blocked_task_id"),
      pickLegacyColumn(columns, "blocked_summary"),
      pickLegacyColumn(columns, "state_json"),
      pickLegacyColumn(columns, "wait_json"),
      pickLegacyColumn(columns, "cancel_requested_at"),
      "created_at",
      "updated_at",
      pickLegacyColumn(columns, "ended_at"),
    ];
    return db
      .prepare(
        `SELECT ${selectColumns.join(", ")} FROM flow_runs ORDER BY created_at ASC, flow_id ASC`,
      )
      .all()
      .map((row) => normalizeLegacyFlowRow(row));
  } finally {
    db.close();
  }
}
function insertFlowRunRowSql(db, row) {
  db.prepare(`
      INSERT INTO flow_runs (
        flow_id, shape, sync_mode, owner_key, requester_origin_json, controller_id, revision,
        status, notify_policy, goal, current_step, blocked_task_id, blocked_summary, state_json,
        wait_json, cancel_requested_at, created_at, updated_at, ended_at
      ) VALUES (
        @flow_id, @shape, @sync_mode, @owner_key, @requester_origin_json, @controller_id,
        @revision, @status, @notify_policy, @goal, @current_step, @blocked_task_id,
        @blocked_summary, @state_json, @wait_json, @cancel_requested_at, @created_at,
        @updated_at, @ended_at
      )
    `).run(row);
}
async function migrateLegacyTaskRunsSidecar(params) {
  const sourcePath = resolveLegacyTaskRunsSidecarPath(params.stateDir);
  if (!fileExists(sourcePath)) {
    const changes = [];
    const warnings = [];
    if (hasPendingSqliteSidecarArchive(sourcePath, TASK_STATE_SQLITE_SIDECAR_SUFFIXES))
      archiveLegacyTaskStateSidecar({
        sourcePath,
        label: "task registry",
        changes,
        warnings,
      });
    return {
      changes,
      warnings,
    };
  }
  const changes = [];
  const warnings = [];
  let taskRows;
  let deliveryRows;
  try {
    taskRows = readLegacyTaskRows(sourcePath);
    deliveryRows = readLegacyTaskDeliveryRows(sourcePath);
  } catch (err) {
    return {
      changes,
      warnings: [`Failed reading task registry sidecar ${sourcePath}: ${String(err)}`],
    };
  }
  try {
    const conflicts = [];
    let importedTasks = 0;
    let importedDeliveryStates = 0;
    let skippedOrphanDeliveryStates = 0;
    runOpenClawStateWriteTransaction(
      ({ db }) => {
        const taskColumns = [
          "runtime",
          "task_kind",
          "source_id",
          "requester_session_key",
          "owner_key",
          "scope_kind",
          "child_session_key",
          "parent_flow_id",
          "parent_task_id",
          "agent_id",
          "requester_agent_id",
          "run_id",
          "label",
          "task",
          "status",
          "delivery_status",
          "notify_policy",
          "created_at",
          "started_at",
          "ended_at",
          "last_event_at",
          "cleanup_after",
          "error",
          "progress_summary",
          "terminal_summary",
          "terminal_outcome",
          "detail_json",
        ];
        for (const row of taskRows) {
          const taskId = legacyKeyValue(expectDefined(row.task_id, "task migration row key"));
          const existing = db
            .prepare(`SELECT ${taskColumns.join(", ")} FROM task_runs WHERE task_id = ?`)
            .get(taskId);
          if (existing) {
            if (!legacyRowsMatch(existing, row, taskColumns)) conflicts.push(taskId);
            continue;
          }
          insertTaskRunRowSql(db, row);
          importedTasks++;
        }
        const deliveryColumns = ["requester_origin_json", "last_notified_event_at"];
        for (const row of deliveryRows) {
          const taskId = legacyKeyValue(expectDefined(row.task_id, "delivery migration row key"));
          const existing = db
            .prepare(
              `SELECT requester_origin_json, last_notified_event_at FROM task_delivery_state WHERE task_id = ?`,
            )
            .get(taskId);
          if (existing) {
            if (!legacyRowsMatch(existing, row, deliveryColumns))
              conflicts.push(`${taskId}/delivery`);
            continue;
          }
          if (!db.prepare("SELECT 1 FROM task_runs WHERE task_id = ?").get(taskId)) {
            skippedOrphanDeliveryStates++;
            continue;
          }
          insertTaskDeliveryRowSql(db, row);
          importedDeliveryStates++;
        }
        if (conflicts.length > 0) throw new LegacyTaskStateSidecarConflictError(conflicts);
      },
      {
        env: {
          ...process.env,
          OPENCLAW_STATE_DIR: params.stateDir,
        },
      },
    );
    if (importedTasks > 0)
      changes.push(
        `Migrated ${importedTasks} task registry sidecar ${importedTasks === 1 ? "row" : "rows"} → shared SQLite state`,
      );
    if (importedDeliveryStates > 0)
      changes.push(
        `Migrated ${importedDeliveryStates} task delivery sidecar ${importedDeliveryStates === 1 ? "row" : "rows"} → shared SQLite state`,
      );
    if (skippedOrphanDeliveryStates > 0)
      warnings.push(
        `Skipped ${skippedOrphanDeliveryStates} orphan task delivery sidecar ${skippedOrphanDeliveryStates === 1 ? "row" : "rows"} with no task run`,
      );
  } catch (err) {
    if (err instanceof LegacyTaskStateSidecarConflictError)
      return {
        changes,
        warnings: [
          `Left task registry sidecar in place because ${err.conflictedKeys.length} ${err.conflictedKeys.length === 1 ? "row" : "rows"} already existed in shared state: ${err.conflictedKeys[0]}`,
        ],
      };
    return {
      changes,
      warnings: [`Failed migrating task registry sidecar ${sourcePath}: ${String(err)}`],
    };
  }
  archiveLegacyTaskStateSidecar({
    sourcePath,
    label: "task registry",
    changes,
    warnings,
  });
  return {
    changes,
    warnings,
  };
}
async function migrateLegacyFlowRunsSidecar(params) {
  const sourcePath = resolveLegacyFlowRunsSidecarPath(params.stateDir);
  if (!fileExists(sourcePath)) {
    const changes = [];
    const warnings = [];
    if (hasPendingSqliteSidecarArchive(sourcePath, TASK_STATE_SQLITE_SIDECAR_SUFFIXES))
      archiveLegacyTaskStateSidecar({
        sourcePath,
        label: "task flow",
        changes,
        warnings,
      });
    return {
      changes,
      warnings,
    };
  }
  const changes = [];
  const warnings = [];
  let rows;
  try {
    rows = readLegacyFlowRows(sourcePath);
  } catch (err) {
    return {
      changes,
      warnings: [`Failed reading task flow sidecar ${sourcePath}: ${String(err)}`],
    };
  }
  try {
    const conflicts = [];
    let imported = 0;
    runOpenClawStateWriteTransaction(
      ({ db }) => {
        const columns = [
          "shape",
          "sync_mode",
          "owner_key",
          "requester_origin_json",
          "controller_id",
          "revision",
          "status",
          "notify_policy",
          "goal",
          "current_step",
          "blocked_task_id",
          "blocked_summary",
          "state_json",
          "wait_json",
          "cancel_requested_at",
          "created_at",
          "updated_at",
          "ended_at",
        ];
        for (const row of rows) {
          const flowId = legacyKeyValue(expectDefined(row.flow_id, "flow migration row key"));
          const existing = db
            .prepare(`SELECT ${columns.join(", ")} FROM flow_runs WHERE flow_id = ?`)
            .get(flowId);
          if (existing) {
            if (!legacyRowsMatch(existing, row, columns)) conflicts.push(flowId);
            continue;
          }
          insertFlowRunRowSql(db, row);
          imported++;
        }
        if (conflicts.length > 0) throw new LegacyTaskStateSidecarConflictError(conflicts);
      },
      {
        env: {
          ...process.env,
          OPENCLAW_STATE_DIR: params.stateDir,
        },
      },
    );
    if (imported > 0)
      changes.push(
        `Migrated ${imported} task flow sidecar ${imported === 1 ? "row" : "rows"} → shared SQLite state`,
      );
  } catch (err) {
    if (err instanceof LegacyTaskStateSidecarConflictError)
      return {
        changes,
        warnings: [
          `Left task flow sidecar in place because ${err.conflictedKeys.length} ${err.conflictedKeys.length === 1 ? "row" : "rows"} already existed in shared state: ${err.conflictedKeys[0]}`,
        ],
      };
    return {
      changes,
      warnings: [`Failed migrating task flow sidecar ${sourcePath}: ${String(err)}`],
    };
  }
  archiveLegacyTaskStateSidecar({
    sourcePath,
    label: "task flow",
    changes,
    warnings,
  });
  return {
    changes,
    warnings,
  };
}
async function migrateLegacyTaskStateSidecars(params) {
  const taskRuns = await migrateLegacyTaskRunsSidecar(params);
  const flowRuns = await migrateLegacyFlowRunsSidecar(params);
  return {
    changes: [...taskRuns.changes, ...flowRuns.changes],
    warnings: [...taskRuns.warnings, ...flowRuns.warnings],
  };
}
function resolveLegacyDeliveryQueuePath(stateDir, dirName) {
  return path.join(stateDir, dirName);
}
function listLegacyDeliveryQueueFiles(queueDir) {
  const pending = safeReadDir(queueDir)
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => ({
      sourcePath: path.join(queueDir, entry.name),
      status: "pending",
    }));
  const failedDir = path.join(queueDir, "failed");
  const failed = safeReadDir(failedDir)
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => ({
      sourcePath: path.join(failedDir, entry.name),
      status: "failed",
    }));
  return [...pending, ...failed];
}
function listLegacyDeliveryQueueDeliveredMarkers(queueDir) {
  return safeReadDir(queueDir)
    .filter((entry) => entry.isFile() && entry.name.endsWith(".delivered"))
    .map((entry) => path.join(queueDir, entry.name));
}
function readLegacyDeliveryQueueEntry(sourcePath) {
  try {
    const parsed = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
function legacyQueueMetadata(entry) {
  const session = entry.session;
  const route = entry.route;
  const deliveryContext = entry.deliveryContext;
  const stringOrNull = (value) => (typeof value === "string" ? value : null);
  return {
    entryKind: stringOrNull(entry.kind) ?? "outbound",
    sessionKey: stringOrNull(entry.sessionKey) ?? stringOrNull(session?.key),
    channel:
      stringOrNull(entry.channel) ??
      stringOrNull(route?.channel) ??
      stringOrNull(deliveryContext?.channel),
    target: stringOrNull(entry.to) ?? stringOrNull(route?.to) ?? stringOrNull(deliveryContext?.to),
    accountId:
      stringOrNull(entry.accountId) ??
      stringOrNull(route?.accountId) ??
      stringOrNull(deliveryContext?.accountId),
  };
}
function buildLegacyDeliveryQueueRow(params) {
  const enqueuedAt =
    typeof params.entry.enqueuedAt === "number" ? params.entry.enqueuedAt : params.now;
  const retryCount = typeof params.entry.retryCount === "number" ? params.entry.retryCount : 0;
  const failedAt =
    params.status === "failed"
      ? typeof params.entry.failedAt === "number"
        ? params.entry.failedAt
        : typeof params.entry.lastAttemptAt === "number"
          ? params.entry.lastAttemptAt
          : enqueuedAt
      : null;
  const meta = legacyQueueMetadata(params.entry);
  return {
    queue_name: params.queueName,
    id: params.id,
    status: params.status,
    entry_kind: meta.entryKind,
    session_key: meta.sessionKey,
    channel: meta.channel,
    target: meta.target,
    account_id: meta.accountId,
    retry_count: retryCount,
    last_attempt_at:
      typeof params.entry.lastAttemptAt === "number" ? params.entry.lastAttemptAt : null,
    last_error: typeof params.entry.lastError === "string" ? params.entry.lastError : null,
    recovery_state:
      typeof params.entry.recoveryState === "string" ? params.entry.recoveryState : null,
    platform_send_started_at:
      typeof params.entry.platformSendStartedAt === "number"
        ? params.entry.platformSendStartedAt
        : null,
    entry_json: JSON.stringify({
      ...params.entry,
      id: params.id,
      enqueuedAt,
      retryCount,
    }),
    enqueued_at: enqueuedAt,
    updated_at: params.now,
    failed_at: failedAt,
  };
}
function legacyDeliveryQueueRowsMatch(existing, incoming) {
  return [
    "status",
    "entry_kind",
    "session_key",
    "channel",
    "target",
    "account_id",
    "retry_count",
    "last_attempt_at",
    "last_error",
    "recovery_state",
    "platform_send_started_at",
    "entry_json",
    "enqueued_at",
    "failed_at",
  ].every((column) => {
    const left = existing[column];
    const right = incoming[column];
    if (typeof left === "bigint" || typeof right === "bigint")
      return normalizeLegacySqliteInteger(left) === normalizeLegacySqliteInteger(right);
    return left === right;
  });
}
function removeLegacyDeliveryQueueDir(params) {
  try {
    fs.rmSync(params.queueDir, { recursive: true });
    params.changes.push(`Removed ${params.label} legacy source ${params.queueDir}`);
  } catch (err) {
    params.warnings.push(`Failed removing ${params.label} ${params.queueDir}: ${String(err)}`);
  }
}
function removeLegacyDeliveryQueueMarkers(markerPaths, label, warnings) {
  let removed = 0;
  for (const markerPath of markerPaths)
    try {
      fs.rmSync(markerPath, { force: true });
      removed++;
    } catch (err) {
      warnings.push(`Failed removing ${label} marker ${markerPath}: ${String(err)}`);
      return null;
    }
  return removed;
}
async function migrateLegacyDeliveryQueues(params) {
  const changes = [];
  const warnings = [];
  for (const queue of LEGACY_DELIVERY_QUEUE_DIRS) {
    const queueDir = resolveLegacyDeliveryQueuePath(params.stateDir, queue.dirName);
    const files = listLegacyDeliveryQueueFiles(queueDir);
    const markerPaths = listLegacyDeliveryQueueDeliveredMarkers(queueDir);
    if (files.length === 0 && markerPaths.length === 0) continue;
    let imported = 0;
    let skipped = 0;
    const conflicts = [];
    try {
      runOpenClawStateWriteTransaction(
        ({ db }) => {
          const insert = db.prepare(`
            INSERT INTO delivery_queue_entries (
              queue_name, id, status, entry_kind, session_key, channel, target, account_id,
              retry_count, last_attempt_at, last_error, recovery_state,
              platform_send_started_at, entry_json, enqueued_at, updated_at, failed_at
            ) VALUES (
              @queue_name, @id, @status, @entry_kind, @session_key, @channel, @target,
              @account_id, @retry_count, @last_attempt_at, @last_error, @recovery_state,
              @platform_send_started_at, @entry_json, @enqueued_at, @updated_at, @failed_at
            )
          `);
          const now = Date.now();
          for (const file of files) {
            const entry = readLegacyDeliveryQueueEntry(file.sourcePath);
            const id =
              typeof entry?.id === "string" ? entry.id : path.basename(file.sourcePath, ".json");
            if (!entry || !id) {
              skipped++;
              continue;
            }
            const row = buildLegacyDeliveryQueueRow({
              queueName: queue.queueName,
              id,
              status: file.status,
              entry,
              now,
            });
            const existing = db
              .prepare(`
                SELECT status, entry_kind, session_key, channel, target, account_id,
                       retry_count, last_attempt_at, last_error, recovery_state,
                       platform_send_started_at, entry_json, enqueued_at, failed_at
                  FROM delivery_queue_entries
                 WHERE queue_name = ? AND id = ?
              `)
              .get(queue.queueName, id);
            if (existing) {
              if (!legacyDeliveryQueueRowsMatch(existing, row)) conflicts.push(id);
              continue;
            }
            insert.run(row);
            imported++;
          }
        },
        {
          env: {
            ...process.env,
            OPENCLAW_STATE_DIR: params.stateDir,
          },
        },
      );
    } catch (err) {
      warnings.push(`Failed migrating ${queue.label} ${queueDir}: ${String(err)}`);
      continue;
    }
    const removedMarkers = removeLegacyDeliveryQueueMarkers(markerPaths, queue.label, warnings);
    if (removedMarkers === null) continue;
    if (removedMarkers > 0)
      changes.push(
        `Removed ${removedMarkers} ${queue.label} delivered ${removedMarkers === 1 ? "marker" : "markers"}`,
      );
    if (imported > 0)
      changes.push(
        `Migrated ${imported} ${queue.label} ${imported === 1 ? "entry" : "entries"} → shared SQLite state`,
      );
    if (skipped > 0) {
      warnings.push(
        `Skipped ${skipped} malformed ${queue.label} ${skipped === 1 ? "entry" : "entries"}`,
      );
      warnings.push(`Left ${queue.label} in place because malformed entries need manual cleanup`);
      continue;
    }
    if (conflicts.length > 0) {
      warnings.push(
        `Left ${queue.label} in place because ${conflicts.length} ${conflicts.length === 1 ? "entry" : "entries"} already existed in shared state: ${conflicts[0]}`,
      );
      continue;
    }
    removeLegacyDeliveryQueueDir({
      queueDir,
      label: queue.label,
      changes,
      warnings,
    });
  }
  return {
    changes,
    warnings,
  };
}
//#endregion
//#region src/infra/state-migrations.plugin-state.ts
function hasCanonicalInstallRecord(current, pluginId) {
  const installRecord = current.installRecords[pluginId];
  if (!installRecord) return false;
  return current.plugins.some(
    (plugin) =>
      plugin.pluginId === pluginId && plugin.installRecordHash === hashJson(installRecord),
  );
}
async function migrateLegacyPluginStateSidecar(params) {
  const sourcePath = resolveLegacyPluginStateSidecarPath(params.stateDir);
  if (!fileExists(sourcePath)) {
    const changes = [];
    const warnings = [];
    if (hasPendingSqliteSidecarArchive(sourcePath, PLUGIN_STATE_SQLITE_SIDECAR_SUFFIXES))
      archiveLegacyPluginStateSidecar({
        sourcePath,
        changes,
        warnings,
      });
    return {
      changes,
      warnings,
    };
  }
  const changes = [];
  const warnings = [];
  let rows;
  try {
    rows = readLegacyPluginStateSidecarRows(sourcePath);
  } catch (err) {
    return {
      changes,
      warnings: [`Failed reading plugin-state sidecar ${sourcePath}: ${String(err)}`],
    };
  }
  try {
    const conflictedKeys = [];
    const rowsToInsert = [];
    let imported = 0;
    let skippedExpired = 0;
    const now = Date.now();
    runOpenClawStateWriteTransaction(
      ({ db }) => {
        const stateDb = getNodeSqliteKysely(db);
        for (const row of rows) {
          executeSqliteQuerySync(
            db,
            stateDb
              .deleteFrom("plugin_state_entries")
              .where("plugin_id", "=", row.plugin_id)
              .where("namespace", "=", row.namespace)
              .where("entry_key", "=", row.entry_key)
              .where("expires_at", "is not", null)
              .where("expires_at", "<=", now),
          );
          const existing = executeSqliteQueryTakeFirstSync(
            db,
            stateDb
              .selectFrom("plugin_state_entries")
              .select(["value_json", "created_at", "expires_at"])
              .where("plugin_id", "=", row.plugin_id)
              .where("namespace", "=", row.namespace)
              .where("entry_key", "=", row.entry_key),
          );
          const legacyExpired = isLegacyPluginStateRowExpired(row, now);
          if (existing) {
            if (!legacyPluginStateRowsMatch(existing, row))
              if (legacyExpired) skippedExpired += 1;
              else conflictedKeys.push(`${row.plugin_id}/${row.namespace}/${row.entry_key}`);
            continue;
          }
          if (legacyExpired) {
            skippedExpired += 1;
            continue;
          }
          rowsToInsert.push(row);
        }
        for (const row of rowsToInsert) {
          executeSqliteQuerySync(
            db,
            stateDb
              .insertInto("plugin_state_entries")
              .values({
                plugin_id: row.plugin_id,
                namespace: row.namespace,
                entry_key: row.entry_key,
                value_json: row.value_json,
                created_at: normalizeLegacySqliteInteger(row.created_at) ?? 0,
                expires_at: normalizeLegacySqliteInteger(row.expires_at),
              })
              .onConflict((conflict) =>
                conflict.columns(["plugin_id", "namespace", "entry_key"]).doNothing(),
              ),
          );
          imported += 1;
        }
      },
      {
        env: {
          ...process.env,
          OPENCLAW_STATE_DIR: params.stateDir,
        },
      },
    );
    if (imported > 0)
      changes.push(
        `Migrated ${imported} plugin-state sidecar ${imported === 1 ? "entry" : "entries"} → shared SQLite state`,
      );
    if (conflictedKeys.length > 0)
      return {
        changes,
        warnings: [
          `Left plugin-state sidecar in place because ${conflictedKeys.length} ${conflictedKeys.length === 1 ? "row" : "rows"} already existed in shared state: ${conflictedKeys[0]}`,
        ],
      };
    if (skippedExpired > 0)
      changes.push(
        `Dropped ${skippedExpired} expired plugin-state sidecar ${skippedExpired === 1 ? "entry" : "entries"}`,
      );
  } catch (err) {
    return {
      changes,
      warnings: [`Failed migrating plugin-state sidecar ${sourcePath}: ${String(err)}`],
    };
  }
  archiveLegacyPluginStateSidecar({
    sourcePath,
    changes,
    warnings,
  });
  return {
    changes,
    warnings,
  };
}
async function migrateLegacyInstalledPluginIndex(params) {
  const sourcePath = resolveLegacyInstalledPluginIndexStorePath({ stateDir: params.stateDir });
  if (!fileExists(sourcePath))
    return {
      changes: [],
      warnings: [],
    };
  const changes = [];
  const warnings = [];
  const legacy = readLegacyInstalledPluginIndex(sourcePath);
  if (!legacy)
    return {
      changes,
      warnings: [`Left plugin install index in place because ${sourcePath} is invalid`],
    };
  const storeOptions = { stateDir: params.stateDir };
  const current = readPersistedInstalledPluginIndexSync(storeOptions);
  if (current && !legacyInstalledPluginIndexMatches(current, legacy)) {
    const merged = mergeLegacyInstalledPluginIndexRecords(current, legacy);
    if (merged.addedCount > 0)
      try {
        writePersistedInstalledPluginIndexSync(merged.merged, storeOptions);
        changes.push(
          `Merged ${merged.addedCount} legacy plugin install ${merged.addedCount === 1 ? "record" : "records"} → shared SQLite state`,
        );
      } catch (err) {
        return {
          changes,
          warnings: [`Failed merging plugin install index ${sourcePath}: ${String(err)}`],
        };
      }
    if (merged.conflicts.length > 0) {
      const acknowledged = merged.conflicts.filter((pluginId) =>
        hasCanonicalInstallRecord(current, pluginId),
      );
      const unresolved = merged.conflicts.filter((pluginId) => !acknowledged.includes(pluginId));
      if (unresolved.length === 0)
        archiveLegacyInstalledPluginIndex({
          sourcePath,
          changes,
          warnings,
        });
      return {
        changes,
        warnings:
          unresolved.length > 0
            ? [
                `Left plugin install index in place because shared SQLite state has conflicting plugin install metadata for: ${unresolved.join(", ")}`,
              ]
            : [],
        ...(acknowledged.length > 0
          ? {
              notices: [
                `Kept canonical shared SQLite plugin install metadata despite differing legacy records for: ${acknowledged.join(", ")}`,
              ],
            }
          : {}),
      };
    }
  }
  if (!current)
    try {
      writePersistedInstalledPluginIndexSync(legacy, storeOptions);
      const recordCount = Object.keys(legacy.installRecords).length;
      changes.push(
        `Migrated plugin install index ${recordCount} ${recordCount === 1 ? "record" : "records"} → shared SQLite state`,
      );
    } catch (err) {
      return {
        changes,
        warnings: [`Failed migrating plugin install index ${sourcePath}: ${String(err)}`],
      };
    }
  archiveLegacyInstalledPluginIndex({
    sourcePath,
    changes,
    warnings,
  });
  return {
    changes,
    warnings,
  };
}
function resolvePluginStateImportTargetKey(scopeKey, key) {
  return scopeKey ? `${scopeKey}:${key}` : key;
}
function findMissingKey(expected, actual) {
  for (const key of expected) if (!actual.has(key)) return key;
}
async function withPluginStateImportEnv(plan, run) {
  if (!plan.stateDir) return await run();
  const previous = process.env.OPENCLAW_STATE_DIR;
  process.env.OPENCLAW_STATE_DIR = plan.stateDir;
  try {
    return await run();
  } finally {
    if (previous === void 0) delete process.env.OPENCLAW_STATE_DIR;
    else process.env.OPENCLAW_STATE_DIR = previous;
  }
}
async function runLegacyMigrationPlans(plans) {
  const changes = [];
  const warnings = [];
  for (const plan of plans) {
    if (plan.kind === "plugin-state-import") {
      await withPluginStateImportEnv(plan, async () => {
        let storeEntries;
        let pluginEntryCount;
        const store = createPluginStateKeyedStore(plan.pluginId, {
          namespace: plan.namespace,
          maxEntries: plan.maxEntries,
          ...(plan.defaultTtlMs != null ? { defaultTtlMs: plan.defaultTtlMs } : {}),
        });
        try {
          storeEntries = await store.entries();
          pluginEntryCount = countPluginStateLiveEntries(plan.pluginId);
        } catch (err) {
          warnings.push(
            `Failed reading ${plan.label} plugin state before migration: ${String(err)}`,
          );
          return;
        }
        const existingKeys = new Set(storeEntries.map(({ key }) => key));
        const existingValuesByKey = new Map(storeEntries.map(({ key, value }) => [key, value]));
        const expectedKeys = new Set(existingKeys);
        let remainingCapacity = Math.max(0, plan.maxEntries - storeEntries.length);
        let entries;
        try {
          entries = await plan.readEntries();
        } catch (err) {
          warnings.push(`Failed reading ${plan.label} legacy source: ${String(err)}`);
          return;
        }
        const candidateEntries = [];
        const failedTargetKeys = /* @__PURE__ */ new Set();
        let missingEntryCount = 0;
        for (const entry of entries) {
          const targetKey = resolvePluginStateImportTargetKey(plan.scopeKey, entry.key);
          const existingValue = existingValuesByKey.get(targetKey);
          if (existingKeys.has(targetKey)) {
            if (
              existingValue !== void 0 &&
              (await plan.shouldReplaceExistingEntry?.({
                key: entry.key,
                existingValue,
                incomingValue: entry.value,
              }))
            )
              candidateEntries.push({
                ...entry,
                targetKey,
                existedBefore: true,
              });
            continue;
          }
          candidateEntries.push({
            ...entry,
            targetKey,
            existedBefore: false,
          });
          missingEntryCount++;
        }
        const pluginRemainingCapacity = Math.max(
          0,
          MAX_PLUGIN_STATE_ENTRIES_PER_PLUGIN - pluginEntryCount,
        );
        if (missingEntryCount > pluginRemainingCapacity) {
          warnings.push(
            `Skipped migrating ${plan.label} because plugin state has room for ${pluginRemainingCapacity} of ${missingEntryCount} missing entries; left legacy source in place`,
          );
          return;
        }
        let imported = 0;
        const changedKeys = [];
        for (const entry of candidateEntries) {
          if (!entry.existedBefore && remainingCapacity <= 0) break;
          try {
            await store.register(
              entry.targetKey,
              entry.value,
              entry.ttlMs != null ? { ttlMs: entry.ttlMs } : void 0,
            );
            const nextExpectedKeys = new Set(expectedKeys);
            nextExpectedKeys.add(entry.targetKey);
            const missingKey = findMissingKey(
              nextExpectedKeys,
              new Set((await store.entries()).map(({ key }) => key)),
            );
            if (missingKey) {
              for (const changedKey of changedKeys.toReversed())
                if (existingValuesByKey.has(changedKey))
                  await store.register(changedKey, existingValuesByKey.get(changedKey));
                else await store.delete(changedKey);
              if (existingValuesByKey.has(entry.targetKey))
                await store.register(entry.targetKey, existingValuesByKey.get(entry.targetKey));
              else await store.delete(entry.targetKey);
              warnings.push(
                `Stopped migrating ${plan.label} because plugin state cap evicted ${missingKey}; left legacy source in place`,
              );
              return;
            }
            expectedKeys.add(entry.targetKey);
            existingKeys.add(entry.targetKey);
            changedKeys.push(entry.targetKey);
            if (!entry.existedBefore) remainingCapacity--;
            imported++;
          } catch (err) {
            failedTargetKeys.add(entry.targetKey);
            warnings.push(`Failed migrating ${plan.label} entry ${entry.key}: ${String(err)}`);
          }
        }
        if (imported > 0)
          changes.push(
            `Migrated ${imported} ${plan.label} ${imported === 1 ? "entry" : "entries"} → plugin state`,
          );
        let cleanupKeys = existingKeys;
        if (plan.cleanupSource === "rename") cleanupKeys = expectedKeys;
        const allEntriesCovered =
          (entries.length === 0 && plan.cleanupWhenEmpty === true) ||
          (entries.length > 0 &&
            entries.every(
              ({ key }) =>
                cleanupKeys.has(resolvePluginStateImportTargetKey(plan.scopeKey, key)) &&
                !failedTargetKeys.has(resolvePluginStateImportTargetKey(plan.scopeKey, key)),
            ));
        if (allEntriesCovered && plan.cleanupSource === "rename" && fileExists(plan.sourcePath))
          archiveLegacyImportSource({
            sourcePath: plan.sourcePath,
            label: plan.label,
            changes,
            warnings,
          });
        if (allEntriesCovered && plan.removeSource)
          try {
            await plan.removeSource();
            changes.push(`Removed ${plan.label} legacy source (${plan.sourcePath})`);
          } catch (err) {
            warnings.push(`Failed removing ${plan.label} legacy source: ${String(err)}`);
          }
      });
      continue;
    }
    if (fileExists(plan.targetPath)) continue;
    try {
      ensureMigrationDir(path.dirname(plan.targetPath));
      if (plan.kind === "move") {
        fs.renameSync(plan.sourcePath, plan.targetPath);
        changes.push(`Moved ${plan.label} → ${plan.targetPath}`);
      } else {
        fs.copyFileSync(plan.sourcePath, plan.targetPath);
        changes.push(`Copied ${plan.label} → ${plan.targetPath}`);
      }
    } catch (err) {
      warnings.push(`Failed migrating ${plan.label} (${plan.sourcePath}): ${String(err)}`);
    }
  }
  return {
    changes,
    warnings,
  };
}
//#endregion
//#region src/infra/state-migrations.runtime-state.ts
const VOICEWAKE_CONFIG_KEY = "default";
const DEFAULT_VOICEWAKE_TRIGGERS = ["openclaw", "claude", "computer"];
function resolveLegacyVoiceWakeTriggersPath(stateDir) {
  return path.join(stateDir, "settings", "voicewake.json");
}
function resolveLegacyVoiceWakeRoutingPath(stateDir) {
  return path.join(stateDir, "settings", "voicewake-routing.json");
}
function readLegacyJsonObject(sourcePath) {
  return JSON.parse(fs.readFileSync(sourcePath, "utf8"));
}
function normalizeLegacyVoiceWakeTriggers(input) {
  const rec = input && typeof input === "object" ? input : {};
  const triggers = Array.isArray(rec.triggers)
    ? rec.triggers
        .flatMap((entry) => (typeof entry === "string" ? [entry.trim()] : []))
        .filter((entry) => entry.length > 0)
    : [];
  return triggers.length > 0 ? triggers : DEFAULT_VOICEWAKE_TRIGGERS;
}
function legacyVoiceWakeTriggersMatch(rows, triggers) {
  return (
    rows.length === triggers.length && rows.every((row, index) => row.trigger === triggers[index])
  );
}
function legacyVoiceWakeTargetColumns(target) {
  if (target.agentId)
    return {
      targetAgentId: target.agentId,
      targetMode: "agent",
      targetSessionKey: null,
    };
  if (target.sessionKey)
    return {
      targetAgentId: null,
      targetMode: "session",
      targetSessionKey: target.sessionKey,
    };
  return {
    targetAgentId: null,
    targetMode: "current",
    targetSessionKey: null,
  };
}
function legacyVoiceWakeTargetColumnsMatch(left, right) {
  return (
    left.targetAgentId === (right.target_agent_id ?? null) &&
    left.targetMode === right.target_mode &&
    left.targetSessionKey === (right.target_session_key ?? null)
  );
}
function legacyVoiceWakeRoutingMatches(configRow, routeRows, routingConfig) {
  if (
    !legacyVoiceWakeTargetColumnsMatch(legacyVoiceWakeTargetColumns(routingConfig.defaultTarget), {
      target_agent_id: configRow.default_target_agent_id,
      target_mode: configRow.default_target_mode,
      target_session_key: configRow.default_target_session_key,
    })
  )
    return false;
  return (
    routeRows.length === routingConfig.routes.length &&
    routeRows.every((row, index) => {
      const route = routingConfig.routes[index];
      if (!route || row.trigger !== route.trigger) return false;
      return legacyVoiceWakeTargetColumnsMatch(legacyVoiceWakeTargetColumns(route.target), row);
    })
  );
}
function migrateLegacyVoiceWakeSettings(params) {
  const changes = [];
  const warnings = [];
  const env = {
    ...process.env,
    OPENCLAW_STATE_DIR: params.stateDir,
  };
  if (fileExists(params.detected.triggersPath)) {
    let triggers;
    try {
      triggers = normalizeLegacyVoiceWakeTriggers(
        readLegacyJsonObject(params.detected.triggersPath),
      );
    } catch (err) {
      warnings.push(
        `Failed reading legacy voice wake triggers ${params.detected.triggersPath}: ${String(err)}`,
      );
      triggers = [];
    }
    if (triggers.length > 0) {
      let imported = false;
      let shouldArchive = false;
      try {
        runOpenClawStateWriteTransaction(
          ({ db }) => {
            const stateDb = getNodeSqliteKysely(db);
            const existing = executeSqliteQuerySync(
              db,
              stateDb
                .selectFrom("voicewake_triggers")
                .select(["trigger"])
                .where("config_key", "=", VOICEWAKE_CONFIG_KEY)
                .orderBy("position", "asc"),
            ).rows;
            if (existing.length > 0) {
              if (!legacyVoiceWakeTriggersMatch(existing, triggers))
                warnings.push(
                  `Left legacy voice wake triggers in place because shared SQLite state already has different triggers: ${params.detected.triggersPath}`,
                );
              else shouldArchive = true;
              return;
            }
            const updatedAtMs = Date.now();
            executeSqliteQuerySync(
              db,
              stateDb.insertInto("voicewake_triggers").values(
                triggers.map((trigger, position) => ({
                  config_key: VOICEWAKE_CONFIG_KEY,
                  position,
                  trigger,
                  updated_at_ms: updatedAtMs,
                })),
              ),
            );
            imported = true;
            shouldArchive = true;
          },
          { env },
        );
      } catch (err) {
        warnings.push(`Failed migrating legacy voice wake triggers: ${String(err)}`);
      }
      if (imported)
        changes.push(
          `Migrated ${triggers.length} voice wake ${triggers.length === 1 ? "trigger" : "triggers"} → shared SQLite state`,
        );
      if (shouldArchive)
        archiveLegacyImportSource({
          sourcePath: params.detected.triggersPath,
          label: "voice wake triggers",
          changes,
          warnings,
        });
    }
  }
  if (fileExists(params.detected.routingPath)) {
    let routingConfig = null;
    try {
      routingConfig = normalizeVoiceWakeRoutingConfig(
        readLegacyJsonObject(params.detected.routingPath),
      );
    } catch (err) {
      warnings.push(
        `Failed reading legacy voice wake routing ${params.detected.routingPath}: ${String(err)}`,
      );
    }
    if (routingConfig) {
      let imported = false;
      let shouldArchive = false;
      try {
        runOpenClawStateWriteTransaction(
          ({ db }) => {
            const stateDb = getNodeSqliteKysely(db);
            const existing = executeSqliteQueryTakeFirstSync(
              db,
              stateDb
                .selectFrom("voicewake_routing_config")
                .select([
                  "default_target_agent_id",
                  "default_target_mode",
                  "default_target_session_key",
                ])
                .where("config_key", "=", VOICEWAKE_CONFIG_KEY),
            );
            if (existing) {
              const routeRows = executeSqliteQuerySync(
                db,
                stateDb
                  .selectFrom("voicewake_routing_routes")
                  .select(["target_agent_id", "target_mode", "target_session_key", "trigger"])
                  .where("config_key", "=", VOICEWAKE_CONFIG_KEY)
                  .orderBy("position", "asc"),
              ).rows;
              if (legacyVoiceWakeRoutingMatches(existing, routeRows, routingConfig))
                shouldArchive = true;
              else
                warnings.push(
                  `Left legacy voice wake routing in place because shared SQLite routing already exists with different routes: ${params.detected.routingPath}`,
                );
              return;
            }
            const updatedAtMs = Date.now();
            const defaultTarget = legacyVoiceWakeTargetColumns(routingConfig.defaultTarget);
            executeSqliteQuerySync(
              db,
              stateDb.insertInto("voicewake_routing_config").values({
                config_key: VOICEWAKE_CONFIG_KEY,
                version: 1,
                default_target_mode: defaultTarget.targetMode,
                default_target_agent_id: defaultTarget.targetAgentId,
                default_target_session_key: defaultTarget.targetSessionKey,
                updated_at_ms: updatedAtMs,
              }),
            );
            if (routingConfig.routes.length > 0)
              executeSqliteQuerySync(
                db,
                stateDb.insertInto("voicewake_routing_routes").values(
                  routingConfig.routes.map((route, position) => {
                    const target = legacyVoiceWakeTargetColumns(route.target);
                    return {
                      config_key: VOICEWAKE_CONFIG_KEY,
                      position,
                      trigger: route.trigger,
                      target_mode: target.targetMode,
                      target_agent_id: target.targetAgentId,
                      target_session_key: target.targetSessionKey,
                      updated_at_ms: updatedAtMs,
                    };
                  }),
                ),
              );
            imported = true;
            shouldArchive = true;
          },
          { env },
        );
      } catch (err) {
        warnings.push(`Failed migrating legacy voice wake routing: ${String(err)}`);
      }
      if (imported)
        changes.push(
          `Migrated voice wake routing config with ${routingConfig.routes.length} ${routingConfig.routes.length === 1 ? "route" : "routes"} → shared SQLite state`,
        );
      if (shouldArchive)
        archiveLegacyImportSource({
          sourcePath: params.detected.routingPath,
          label: "voice wake routing",
          changes,
          warnings,
        });
    }
  }
  return {
    changes,
    warnings,
  };
}
function resolveLegacyConfigHealthPath(stateDir) {
  return path.join(stateDir, "logs", "config-health.json");
}
function normalizeLegacyConfigHealthEntry(configPath, input) {
  if (!configPath.trim() || !input || typeof input !== "object" || Array.isArray(input))
    return null;
  const entry = input;
  const lastKnownGoodJson =
    entry.lastKnownGood && typeof entry.lastKnownGood === "object"
      ? JSON.stringify(entry.lastKnownGood)
      : null;
  const lastPromotedGoodJson =
    entry.lastPromotedGood && typeof entry.lastPromotedGood === "object"
      ? JSON.stringify(entry.lastPromotedGood)
      : null;
  const lastObservedSuspiciousSignature =
    typeof entry.lastObservedSuspiciousSignature === "string"
      ? entry.lastObservedSuspiciousSignature
      : null;
  if (!lastKnownGoodJson && !lastPromotedGoodJson && !lastObservedSuspiciousSignature) return null;
  return {
    configPath,
    lastKnownGoodJson,
    lastPromotedGoodJson,
    lastObservedSuspiciousSignature,
  };
}
function normalizeLegacyConfigHealthFile(input) {
  const entries = (input && typeof input === "object" ? input : {}).entries;
  if (!entries || typeof entries !== "object" || Array.isArray(entries)) return [];
  return Object.entries(entries)
    .flatMap(([configPath, entry]) => {
      const normalized = normalizeLegacyConfigHealthEntry(configPath, entry);
      return normalized ? [normalized] : [];
    })
    .toSorted((a, b) => a.configPath.localeCompare(b.configPath));
}
function configHealthRow(entry) {
  return {
    config_path: entry.configPath,
    last_known_good_json: entry.lastKnownGoodJson,
    last_promoted_good_json: entry.lastPromotedGoodJson,
    last_observed_suspicious_signature: entry.lastObservedSuspiciousSignature,
    updated_at_ms: Date.now(),
  };
}
function retireLegacyConfigHealthSource(params) {
  if (!fileExists(`${params.sourcePath}.migrated`)) {
    archiveLegacyImportSource({
      sourcePath: params.sourcePath,
      label: "config health state",
      changes: params.changes,
      warnings: params.warnings,
    });
    return;
  }
  try {
    fs.rmSync(params.sourcePath, { force: true });
    params.changes.push("Removed regenerated config health legacy source");
  } catch (err) {
    params.warnings.push(`Failed removing regenerated config health legacy source: ${String(err)}`);
  }
}
function migrateLegacyConfigHealth(params) {
  const changes = [];
  const warnings = [];
  if (!fileExists(params.detected.sourcePath))
    return {
      changes,
      warnings,
    };
  let entries;
  try {
    entries = normalizeLegacyConfigHealthFile(readLegacyJsonObject(params.detected.sourcePath));
  } catch (err) {
    warnings.push(
      `Failed reading legacy config health state ${params.detected.sourcePath}: ${String(err)}`,
    );
    return {
      changes,
      warnings,
    };
  }
  let importedCount = 0;
  let reconciledCount = 0;
  let shouldArchive = false;
  try {
    const result = runOpenClawStateWriteTransaction(
      ({ db }) => {
        const stateDb = getNodeSqliteKysely(db);
        const existing = executeSqliteQuerySync(
          db,
          stateDb
            .selectFrom("config_health_entries")
            .select([
              "config_path",
              "last_known_good_json",
              "last_promoted_good_json",
              "last_observed_suspicious_signature",
            ]),
        ).rows;
        const existingByPath = new Map(existing.map((row) => [row.config_path, row]));
        const entriesToInsert = [];
        let transactionReconciledCount = 0;
        for (const entry of entries) {
          const existingEntry = existingByPath.get(entry.configPath);
          if (!existingEntry) {
            entriesToInsert.push(entry);
            continue;
          }
          const lastKnownGoodJson = existingEntry.last_known_good_json ?? entry.lastKnownGoodJson;
          const lastPromotedGoodJson =
            existingEntry.last_promoted_good_json ?? entry.lastPromotedGoodJson;
          if (
            lastKnownGoodJson === existingEntry.last_known_good_json &&
            lastPromotedGoodJson === existingEntry.last_promoted_good_json
          )
            continue;
          executeSqliteQuerySync(
            db,
            stateDb
              .updateTable("config_health_entries")
              .set({
                last_known_good_json: lastKnownGoodJson,
                last_promoted_good_json: lastPromotedGoodJson,
                updated_at_ms: Date.now(),
              })
              .where("config_path", "=", entry.configPath),
          );
          transactionReconciledCount += 1;
        }
        if (entriesToInsert.length > 0)
          executeSqliteQuerySync(
            db,
            stateDb
              .insertInto("config_health_entries")
              .values(entriesToInsert.map(configHealthRow)),
          );
        return {
          importedCount: entriesToInsert.length,
          reconciledCount: transactionReconciledCount,
        };
      },
      {
        env: {
          ...process.env,
          OPENCLAW_STATE_DIR: params.stateDir,
        },
      },
    );
    importedCount = result.importedCount;
    reconciledCount = result.reconciledCount;
    shouldArchive = true;
  } catch (err) {
    warnings.push(`Failed migrating legacy config health state: ${String(err)}`);
  }
  if (importedCount > 0)
    changes.push(
      `Migrated ${importedCount} config health ${importedCount === 1 ? "entry" : "entries"} → shared SQLite state`,
    );
  if (reconciledCount > 0)
    changes.push(
      `Reconciled ${reconciledCount} config health ${reconciledCount === 1 ? "entry" : "entries"} → shared SQLite state`,
    );
  if (shouldArchive)
    retireLegacyConfigHealthSource({
      sourcePath: params.detected.sourcePath,
      changes,
      warnings,
    });
  return {
    changes,
    warnings,
  };
}
function resolveLegacyPluginBindingApprovalsPath(env, homedir) {
  return path.join(
    resolveRequiredHomeDir(env, homedir),
    ".openclaw",
    "plugin-binding-approvals.json",
  );
}
function pluginBindingApprovalScopeKey(entry) {
  return [entry.pluginRoot, normalizeLowercaseStringOrEmpty(entry.channel), entry.accountId].join(
    "::",
  );
}
function normalizeLegacyPluginBindingApprovalEntry(input) {
  const entry = input && typeof input === "object" ? input : {};
  const pluginRoot = typeof entry.pluginRoot === "string" ? entry.pluginRoot.trim() : "";
  const pluginId = typeof entry.pluginId === "string" ? entry.pluginId.trim() : "";
  const channel =
    typeof entry.channel === "string" ? normalizeLowercaseStringOrEmpty(entry.channel) : "";
  const accountId =
    typeof entry.accountId === "string" && entry.accountId.trim()
      ? entry.accountId.trim()
      : "default";
  if (!pluginRoot || !pluginId || !channel) return null;
  return {
    pluginRoot,
    pluginId,
    pluginName: typeof entry.pluginName === "string" ? entry.pluginName : void 0,
    channel,
    accountId,
    approvedAt:
      typeof entry.approvedAt === "number" && Number.isFinite(entry.approvedAt)
        ? Math.floor(entry.approvedAt)
        : Date.now(),
  };
}
function normalizeLegacyPluginBindingApprovalsFile(input) {
  const file = input && typeof input === "object" ? input : {};
  if (file.version !== 1 || !Array.isArray(file.approvals)) return [];
  const approvals = /* @__PURE__ */ new Map();
  for (const item of file.approvals) {
    const entry = normalizeLegacyPluginBindingApprovalEntry(item);
    if (!entry) continue;
    approvals.set(pluginBindingApprovalScopeKey(entry), entry);
  }
  return [...approvals.values()].toSorted((a, b) =>
    pluginBindingApprovalScopeKey(a).localeCompare(pluginBindingApprovalScopeKey(b)),
  );
}
function pluginBindingApprovalRow(entry) {
  return {
    plugin_root: entry.pluginRoot,
    channel: entry.channel,
    account_id: entry.accountId,
    plugin_id: entry.pluginId,
    plugin_name: entry.pluginName ?? null,
    approved_at: entry.approvedAt,
  };
}
function pluginBindingApprovalComparable(entry) {
  return JSON.stringify(pluginBindingApprovalRow(entry));
}
function migrateLegacyPluginBindingApprovals(params) {
  const changes = [];
  const warnings = [];
  if (!params.detected.hasLegacy || !fileExists(params.detected.sourcePath))
    return {
      changes,
      warnings,
    };
  let approvals;
  try {
    approvals = normalizeLegacyPluginBindingApprovalsFile(
      readLegacyJsonObject(params.detected.sourcePath),
    );
  } catch (err) {
    warnings.push(
      `Failed reading legacy plugin binding approvals ${params.detected.sourcePath}: ${String(err)}`,
    );
    return {
      changes,
      warnings,
    };
  }
  let importedCount = 0;
  let shouldArchive = approvals.length === 0;
  try {
    runOpenClawStateWriteTransaction(
      ({ db }) => {
        const stateDb = getNodeSqliteKysely(db);
        const existing = executeSqliteQuerySync(
          db,
          stateDb
            .selectFrom("plugin_binding_approvals")
            .select([
              "plugin_root",
              "channel",
              "account_id",
              "plugin_id",
              "plugin_name",
              "approved_at",
            ]),
        ).rows;
        const existingByKey = new Map(
          existing.map((row) => [
            pluginBindingApprovalScopeKey({
              pluginRoot: row.plugin_root,
              channel: row.channel,
              accountId: row.account_id,
            }),
            JSON.stringify({
              plugin_root: row.plugin_root,
              channel: row.channel,
              account_id: row.account_id,
              plugin_id: row.plugin_id,
              plugin_name: row.plugin_name,
              approved_at: row.approved_at,
            }),
          ]),
        );
        const approvalsToInsert = [];
        let conflictCount = 0;
        for (const approval of approvals) {
          const key = pluginBindingApprovalScopeKey(approval);
          const existingApprovalJson = existingByKey.get(key);
          if (existingApprovalJson === void 0) approvalsToInsert.push(approval);
          else if (existingApprovalJson !== pluginBindingApprovalComparable(approval))
            conflictCount += 1;
        }
        if (approvalsToInsert.length > 0) {
          executeSqliteQuerySync(
            db,
            stateDb
              .insertInto("plugin_binding_approvals")
              .values(approvalsToInsert.map(pluginBindingApprovalRow)),
          );
          importedCount = approvalsToInsert.length;
        }
        shouldArchive = conflictCount === 0;
        if (conflictCount > 0)
          warnings.push(
            `Left legacy plugin binding approvals in place because ${conflictCount} ${conflictCount === 1 ? "approval conflicts" : "approvals conflict"} with shared SQLite state: ${params.detected.sourcePath}`,
          );
      },
      {
        env: {
          ...process.env,
          OPENCLAW_STATE_DIR: params.stateDir,
        },
      },
    );
  } catch (err) {
    warnings.push(`Failed migrating legacy plugin binding approvals: ${String(err)}`);
  }
  if (importedCount > 0)
    changes.push(
      `Migrated ${importedCount} plugin binding ${importedCount === 1 ? "approval" : "approvals"} → shared SQLite state`,
    );
  if (shouldArchive)
    archiveLegacyImportSource({
      sourcePath: params.detected.sourcePath,
      label: "plugin binding approvals",
      changes,
      warnings,
    });
  return {
    changes,
    warnings,
  };
}
const CURRENT_BINDING_CONVERSATION_KIND = "current";
function resolveLegacyCurrentConversationBindingsPath(stateDir) {
  return path.join(stateDir, "bindings", "current-conversations.json");
}
function currentConversationBindingKey(ref) {
  const normalized = normalizeConversationRef(ref);
  return [
    normalized.channel,
    normalized.accountId,
    normalized.parentConversationId ?? "",
    normalized.conversationId,
  ].join("␟");
}
function normalizeLegacyCurrentConversationBindingRecord(input) {
  const record = input && typeof input === "object" ? input : {};
  if (!record.conversation?.conversationId) return null;
  const conversation = normalizeConversationRef(record.conversation);
  const targetSessionKey =
    typeof record.targetSessionKey === "string" ? record.targetSessionKey.trim() : "";
  if (!targetSessionKey) return null;
  const targetKind = record.targetKind === "subagent" ? "subagent" : "session";
  const status = record.status === "ending" || record.status === "ended" ? record.status : "active";
  const boundAt =
    typeof record.boundAt === "number" && Number.isFinite(record.boundAt)
      ? Math.floor(record.boundAt)
      : Date.now();
  const expiresAt =
    typeof record.expiresAt === "number" && Number.isFinite(record.expiresAt)
      ? Math.floor(record.expiresAt)
      : void 0;
  return {
    bindingId: `generic:${currentConversationBindingKey(conversation)}`,
    targetSessionKey,
    targetKind,
    conversation,
    status,
    boundAt,
    ...(expiresAt !== void 0 ? { expiresAt } : {}),
    ...(record.metadata && typeof record.metadata === "object" && !Array.isArray(record.metadata)
      ? { metadata: record.metadata }
      : {}),
  };
}
function normalizeLegacyCurrentConversationBindingFile(input) {
  const file = input && typeof input === "object" ? input : {};
  if (file.version !== 1 || !Array.isArray(file.bindings)) return [];
  const records = /* @__PURE__ */ new Map();
  for (const item of file.bindings) {
    const record = normalizeLegacyCurrentConversationBindingRecord(item);
    if (!record) continue;
    records.set(currentConversationBindingKey(record.conversation), record);
  }
  return [...records.values()].toSorted((a, b) => a.bindingId.localeCompare(b.bindingId));
}
function currentConversationBindingRow(record) {
  const conversation = normalizeConversationRef(record.conversation);
  return {
    binding_key: currentConversationBindingKey(conversation),
    binding_id: record.bindingId,
    target_agent_id: resolveAgentIdFromSessionKey(record.targetSessionKey),
    target_session_id: null,
    target_session_key: record.targetSessionKey,
    channel: conversation.channel,
    account_id: conversation.accountId,
    conversation_kind: CURRENT_BINDING_CONVERSATION_KIND,
    parent_conversation_id: conversation.parentConversationId ?? null,
    conversation_id: conversation.conversationId,
    target_kind: record.targetKind,
    status: record.status,
    bound_at: record.boundAt,
    expires_at: record.expiresAt ?? null,
    metadata_json: record.metadata ? JSON.stringify(record.metadata) : null,
    record_json: JSON.stringify(record),
    updated_at: Date.now(),
  };
}
function migrateLegacyCurrentConversationBindings(params) {
  const changes = [];
  const warnings = [];
  if (!fileExists(params.detected.sourcePath))
    return {
      changes,
      warnings,
    };
  let records;
  try {
    records = normalizeLegacyCurrentConversationBindingFile(
      readLegacyJsonObject(params.detected.sourcePath),
    );
  } catch (err) {
    warnings.push(
      `Failed reading legacy current-conversation bindings ${params.detected.sourcePath}: ${String(err)}`,
    );
    return {
      changes,
      warnings,
    };
  }
  let importedCount = 0;
  let shouldArchive = records.length === 0;
  try {
    runOpenClawStateWriteTransaction(
      ({ db }) => {
        const stateDb = getNodeSqliteKysely(db);
        const existing = executeSqliteQuerySync(
          db,
          stateDb
            .selectFrom("current_conversation_bindings")
            .select(["binding_key", "record_json"]),
        ).rows;
        const existingByKey = new Map(existing.map((row) => [row.binding_key, row.record_json]));
        const recordsToInsert = [];
        let conflictCount = 0;
        for (const record of records) {
          const key = currentConversationBindingKey(record.conversation);
          const existingRecordJson = existingByKey.get(key);
          if (existingRecordJson === void 0) recordsToInsert.push(record);
          else if (existingRecordJson !== JSON.stringify(record)) conflictCount += 1;
        }
        if (recordsToInsert.length === 0) {
          shouldArchive = conflictCount === 0;
          if (conflictCount > 0)
            warnings.push(
              `Left legacy current-conversation bindings in place because ${conflictCount} ${conflictCount === 1 ? "binding conflicts" : "bindings conflict"} with shared SQLite state: ${params.detected.sourcePath}`,
            );
          return;
        }
        executeSqliteQuerySync(
          db,
          stateDb
            .insertInto("current_conversation_bindings")
            .values(recordsToInsert.map(currentConversationBindingRow)),
        );
        importedCount = recordsToInsert.length;
        shouldArchive = conflictCount === 0;
        if (conflictCount > 0)
          warnings.push(
            `Left legacy current-conversation bindings in place because ${conflictCount} ${conflictCount === 1 ? "binding conflicts" : "bindings conflict"} with shared SQLite state: ${params.detected.sourcePath}`,
          );
      },
      {
        env: {
          ...process.env,
          OPENCLAW_STATE_DIR: params.stateDir,
        },
      },
    );
  } catch (err) {
    warnings.push(`Failed migrating legacy current-conversation bindings: ${String(err)}`);
  }
  if (importedCount > 0)
    changes.push(
      `Migrated ${importedCount} current-conversation ${importedCount === 1 ? "binding" : "bindings"} → shared SQLite state`,
    );
  if (shouldArchive)
    archiveLegacyImportSource({
      sourcePath: params.detected.sourcePath,
      label: "current-conversation bindings",
      changes,
      warnings,
    });
  return {
    changes,
    warnings,
  };
}
//#endregion
//#region src/infra/state-migrations.state-dir.ts
let autoMigrateStateDirChecked = false;
let autoMigrateTaskStateSidecarsChecked = false;
function resetAutoMigrateLegacyStateDirForTest() {
  autoMigrateStateDirChecked = false;
}
function resetAutoMigrateLegacyTaskStateSidecarsForTest() {
  autoMigrateTaskStateSidecarsChecked = false;
}
function resolveSymlinkTarget(linkPath) {
  try {
    const target = fs.readlinkSync(linkPath);
    return path.resolve(path.dirname(linkPath), target);
  } catch {
    return null;
  }
}
function formatStateDirMigration(legacyDir, targetDir) {
  return `State dir: ${legacyDir} → ${targetDir} (legacy path now symlinked)`;
}
function isDirPath(filePath) {
  try {
    return fs.statSync(filePath).isDirectory();
  } catch {
    return false;
  }
}
function isLegacyTreeSymlinkMirror(currentDir, realTargetDir) {
  let entries;
  try {
    entries = fs.readdirSync(currentDir, { withFileTypes: true });
  } catch {
    return false;
  }
  if (entries.length === 0) return false;
  for (const entry of entries) {
    const entryPath = path.join(currentDir, entry.name);
    let stat;
    try {
      stat = fs.lstatSync(entryPath);
    } catch {
      return false;
    }
    if (stat.isSymbolicLink()) {
      const resolvedTarget = resolveSymlinkTarget(entryPath);
      if (!resolvedTarget) return false;
      let resolvedRealTarget;
      try {
        resolvedRealTarget = fs.realpathSync(resolvedTarget);
      } catch {
        return false;
      }
      if (!isWithinDir(realTargetDir, resolvedRealTarget)) return false;
      continue;
    }
    if (stat.isDirectory()) {
      if (!isLegacyTreeSymlinkMirror(entryPath, realTargetDir)) return false;
      continue;
    }
    return false;
  }
  return true;
}
function isLegacyDirSymlinkMirror(legacyDir, targetDir) {
  let realTargetDir;
  try {
    realTargetDir = fs.realpathSync(targetDir);
  } catch {
    return false;
  }
  return isLegacyTreeSymlinkMirror(legacyDir, realTargetDir);
}
async function autoMigrateLegacyStateDir(params) {
  if (autoMigrateStateDirChecked)
    return {
      migrated: false,
      skipped: true,
      changes: [],
      warnings: [],
    };
  autoMigrateStateDirChecked = true;
  const homedir = params.homedir ?? os.homedir;
  const env = params.env ?? process.env;
  const warnings = [];
  const changes = [];
  const notices = [];
  const hasCustomStateDir = Boolean(env.OPENCLAW_STATE_DIR?.trim());
  const targetDir = hasCustomStateDir ? resolveStateDir(env, homedir) : resolveNewStateDir(homedir);
  const migratePluginInstallIndex = async () => {
    const result = await migrateLegacyInstalledPluginIndex({ stateDir: targetDir });
    changes.push(...result.changes);
    warnings.push(...result.warnings);
    notices.push(...(result.notices ?? []));
  };
  if (hasCustomStateDir) {
    await migratePluginInstallIndex();
    return {
      migrated: changes.length > 0,
      skipped: changes.length === 0 && warnings.length === 0 && notices.length === 0,
      changes,
      warnings,
      ...(notices.length > 0 ? { notices } : {}),
    };
  }
  const legacyDirs = resolveLegacyStateDirs(homedir);
  let legacyDir = legacyDirs.find((dir) => {
    try {
      return fs.existsSync(dir);
    } catch {
      return false;
    }
  });
  let legacyStat;
  try {
    legacyStat = legacyDir ? fs.lstatSync(legacyDir) : null;
  } catch {
    legacyStat = null;
  }
  if (!legacyStat) {
    await migratePluginInstallIndex();
    return {
      migrated: changes.length > 0,
      skipped: false,
      changes,
      warnings,
      ...(notices.length > 0 ? { notices } : {}),
    };
  }
  if (!legacyStat.isDirectory() && !legacyStat.isSymbolicLink()) {
    warnings.push(`Legacy state path is not a directory: ${legacyDir}`);
    return {
      migrated: false,
      skipped: false,
      changes,
      warnings,
    };
  }
  let symlinkDepth = 0;
  while (legacyStat.isSymbolicLink()) {
    const legacyTarget = legacyDir ? resolveSymlinkTarget(legacyDir) : null;
    if (!legacyTarget) {
      warnings.push(
        `Legacy state dir is a symlink (${legacyDir ?? "unknown"}); could not resolve target.`,
      );
      return {
        migrated: false,
        skipped: false,
        changes,
        warnings,
      };
    }
    if (path.resolve(legacyTarget) === path.resolve(targetDir)) {
      await migratePluginInstallIndex();
      return {
        migrated: changes.length > 0,
        skipped: false,
        changes,
        warnings,
        ...(notices.length > 0 ? { notices } : {}),
      };
    }
    if (legacyDirs.some((dir) => path.resolve(dir) === path.resolve(legacyTarget))) {
      legacyDir = legacyTarget;
      try {
        legacyStat = fs.lstatSync(legacyDir);
      } catch {
        legacyStat = null;
      }
      if (!legacyStat) {
        warnings.push(`Legacy state dir missing after symlink resolution: ${legacyDir}`);
        return {
          migrated: false,
          skipped: false,
          changes,
          warnings,
        };
      }
      if (!legacyStat.isDirectory() && !legacyStat.isSymbolicLink()) {
        warnings.push(`Legacy state path is not a directory: ${legacyDir}`);
        return {
          migrated: false,
          skipped: false,
          changes,
          warnings,
        };
      }
      symlinkDepth += 1;
      if (symlinkDepth > 2) {
        warnings.push(`Legacy state dir symlink chain too deep: ${legacyDir}`);
        return {
          migrated: false,
          skipped: false,
          changes,
          warnings,
        };
      }
      continue;
    }
    warnings.push(
      `Legacy state dir is a symlink (${legacyDir ?? "unknown"} → ${legacyTarget}); skipping auto-migration.`,
    );
    return {
      migrated: false,
      skipped: false,
      changes,
      warnings,
    };
  }
  if (isDirPath(targetDir)) {
    if (legacyDir && isLegacyDirSymlinkMirror(legacyDir, targetDir)) {
      await migratePluginInstallIndex();
      return {
        migrated: changes.length > 0,
        skipped: false,
        changes,
        warnings,
        ...(notices.length > 0 ? { notices } : {}),
      };
    }
    await migratePluginInstallIndex();
    warnings.push(
      `State dir migration skipped: target already exists (${targetDir}). Remove or merge manually.`,
    );
    return {
      migrated: changes.length > 0,
      skipped: false,
      changes,
      warnings,
      ...(notices.length > 0 ? { notices } : {}),
    };
  }
  try {
    if (!legacyDir) throw new Error("Legacy state dir not found");
    fs.renameSync(legacyDir, targetDir);
  } catch (err) {
    warnings.push(
      `Failed to move legacy state dir (${legacyDir ?? "unknown"} → ${targetDir}): ${String(err)}`,
    );
    return {
      migrated: false,
      skipped: false,
      changes,
      warnings,
    };
  }
  try {
    if (!legacyDir) throw new Error("Legacy state dir not found");
    fs.symlinkSync(targetDir, legacyDir, "dir");
    changes.push(formatStateDirMigration(legacyDir, targetDir));
  } catch (err) {
    try {
      if (process.platform === "win32") {
        if (!legacyDir) throw new Error("Legacy state dir not found", { cause: err });
        fs.symlinkSync(targetDir, legacyDir, "junction");
        changes.push(formatStateDirMigration(legacyDir, targetDir));
      } else throw err;
    } catch (fallbackErr) {
      try {
        if (!legacyDir) throw new Error("Legacy state dir not found", { cause: fallbackErr });
        fs.renameSync(targetDir, legacyDir);
        warnings.push(
          `State dir migration rolled back (failed to link legacy path): ${String(fallbackErr)}`,
        );
        return {
          migrated: false,
          skipped: false,
          changes: [],
          warnings,
        };
      } catch (rollbackErr) {
        warnings.push(
          `State dir moved but failed to link legacy path (${legacyDir ?? "unknown"} → ${targetDir}): ${String(fallbackErr)}`,
        );
        warnings.push(
          `Rollback failed; set OPENCLAW_STATE_DIR=${targetDir} to avoid split state: ${String(rollbackErr)}`,
        );
        changes.push(`State dir: ${legacyDir ?? "unknown"} → ${targetDir}`);
      }
    }
  }
  await migratePluginInstallIndex();
  return {
    migrated: changes.length > 0,
    skipped: false,
    changes,
    warnings,
    ...(notices.length > 0 ? { notices } : {}),
  };
}
async function autoMigrateLegacyTaskStateSidecars(params) {
  if (autoMigrateTaskStateSidecarsChecked)
    return {
      migrated: false,
      skipped: true,
      changes: [],
      warnings: [],
    };
  autoMigrateTaskStateSidecarsChecked = true;
  const stateDir = resolveStateDir(params.env ?? process.env, params.homedir);
  const result = await migrateLegacyTaskStateSidecars({ stateDir });
  const detectedExecApprovals = detectLegacyExecApprovalsMigration({
    env: params.env ?? process.env,
    homedir: params.homedir ?? os.homedir,
    stateDir,
  });
  const crossStateDirImports = params.crossStateDirImports === true;
  const execApprovals = migrateLegacyExecApprovals(
    crossStateDirImports
      ? detectedExecApprovals
      : {
          ...detectedExecApprovals,
          hasLegacy: false,
        },
  );
  const notices = [];
  if (detectedExecApprovals.hasLegacy && !crossStateDirImports)
    notices.push(
      `Exec approvals in the default state dir were not imported into OPENCLAW_STATE_DIR automatically (${detectedExecApprovals.sourcePath} -> ${detectedExecApprovals.targetPath}); run \`openclaw doctor --fix\` to import them.`,
    );
  const changes = [...result.changes, ...execApprovals.changes];
  const warnings = [...result.warnings, ...execApprovals.warnings];
  const logger = params.log ?? createSubsystemLogger("state-migrations");
  if (changes.length > 0)
    logger.info(`Auto-migrated legacy state:\n${changes.map((entry) => `- ${entry}`).join("\n")}`);
  if (warnings.length > 0)
    logger.warn(
      `Legacy state migration warnings:\n${warnings.map((entry) => `- ${entry}`).join("\n")}`,
    );
  if (notices.length > 0)
    logger.info(
      `Legacy state migration notes:\n${notices.map((entry) => `- ${entry}`).join("\n")}`,
    );
  return {
    migrated: changes.length > 0,
    skipped: false,
    changes,
    warnings,
    ...(notices.length > 0 ? { notices } : {}),
  };
}
//#endregion
//#region src/infra/state-migrations.update-check.ts
const UPDATE_CHECK_STATE_KEY = "default";
function resolveLegacyUpdateCheckPath(stateDir) {
  return path.join(stateDir, "update-check.json");
}
function normalizeLegacyUpdateCheckState(input) {
  const record = input && typeof input === "object" ? input : {};
  const readString = (key) => {
    const value = record[key];
    return typeof value === "string" && value.trim().length > 0 ? value : void 0;
  };
  return {
    lastCheckedAt: readString("lastCheckedAt"),
    lastNotifiedVersion: readString("lastNotifiedVersion"),
    lastNotifiedTag: readString("lastNotifiedTag"),
    lastAvailableVersion: readString("lastAvailableVersion"),
    lastAvailableTag: readString("lastAvailableTag"),
    autoInstallId: readString("autoInstallId"),
    autoFirstSeenVersion: readString("autoFirstSeenVersion"),
    autoFirstSeenTag: readString("autoFirstSeenTag"),
    autoFirstSeenAt: readString("autoFirstSeenAt"),
    autoLastAttemptVersion: readString("autoLastAttemptVersion"),
    autoLastAttemptAt: readString("autoLastAttemptAt"),
    autoLastSuccessVersion: readString("autoLastSuccessVersion"),
    autoLastSuccessAt: readString("autoLastSuccessAt"),
  };
}
function legacyUpdateCheckStateMatches(row, state) {
  return (
    (state.lastCheckedAt ?? null) === row.last_checked_at &&
    (state.lastNotifiedVersion ?? null) === row.last_notified_version &&
    (state.lastNotifiedTag ?? null) === row.last_notified_tag &&
    (state.lastAvailableVersion ?? null) === row.last_available_version &&
    (state.lastAvailableTag ?? null) === row.last_available_tag &&
    (state.autoInstallId ?? null) === row.auto_install_id &&
    (state.autoFirstSeenVersion ?? null) === row.auto_first_seen_version &&
    (state.autoFirstSeenTag ?? null) === row.auto_first_seen_tag &&
    (state.autoFirstSeenAt ?? null) === row.auto_first_seen_at &&
    (state.autoLastAttemptVersion ?? null) === row.auto_last_attempt_version &&
    (state.autoLastAttemptAt ?? null) === row.auto_last_attempt_at &&
    (state.autoLastSuccessVersion ?? null) === row.auto_last_success_version &&
    (state.autoLastSuccessAt ?? null) === row.auto_last_success_at
  );
}
function migrateLegacyUpdateCheckState(params) {
  const changes = [];
  const warnings = [];
  let notice;
  if (!fileExists(params.detected.sourcePath))
    return {
      changes,
      warnings,
    };
  let state;
  try {
    state = normalizeLegacyUpdateCheckState(
      JSON.parse(fs.readFileSync(params.detected.sourcePath, "utf8")),
    );
  } catch (err) {
    warnings.push(
      `Failed reading legacy update-check state ${params.detected.sourcePath}: ${String(err)}`,
    );
    return {
      changes,
      warnings,
    };
  }
  let imported = false;
  let shouldArchive = false;
  try {
    runOpenClawStateWriteTransaction(
      ({ db }) => {
        const stateDb = getNodeSqliteKysely(db);
        const existing = executeSqliteQueryTakeFirstSync(
          db,
          stateDb
            .selectFrom("update_check_state")
            .selectAll()
            .where("state_key", "=", UPDATE_CHECK_STATE_KEY),
        );
        if (existing) {
          if (!legacyUpdateCheckStateMatches(existing, state))
            notice = `Kept shared SQLite update-check state because legacy cache differs: ${params.detected.sourcePath}`;
          shouldArchive = true;
          return;
        }
        executeSqliteQuerySync(
          db,
          stateDb.insertInto("update_check_state").values({
            state_key: UPDATE_CHECK_STATE_KEY,
            last_checked_at: state.lastCheckedAt ?? null,
            last_notified_version: state.lastNotifiedVersion ?? null,
            last_notified_tag: state.lastNotifiedTag ?? null,
            last_available_version: state.lastAvailableVersion ?? null,
            last_available_tag: state.lastAvailableTag ?? null,
            auto_install_id: state.autoInstallId ?? null,
            auto_first_seen_version: state.autoFirstSeenVersion ?? null,
            auto_first_seen_tag: state.autoFirstSeenTag ?? null,
            auto_first_seen_at: state.autoFirstSeenAt ?? null,
            auto_last_attempt_version: state.autoLastAttemptVersion ?? null,
            auto_last_attempt_at: state.autoLastAttemptAt ?? null,
            auto_last_success_version: state.autoLastSuccessVersion ?? null,
            auto_last_success_at: state.autoLastSuccessAt ?? null,
            updated_at_ms: Date.now(),
          }),
        );
        imported = true;
        shouldArchive = true;
      },
      {
        env: {
          ...process.env,
          OPENCLAW_STATE_DIR: params.stateDir,
        },
      },
    );
  } catch (err) {
    warnings.push(`Failed migrating legacy update-check state: ${String(err)}`);
  }
  if (imported) changes.push("Migrated update-check state → shared SQLite state");
  if (shouldArchive)
    archiveLegacyImportSource({
      sourcePath: params.detected.sourcePath,
      label: "update-check state",
      changes,
      warnings,
    });
  return {
    changes,
    warnings,
    ...(notice ? { notices: [notice] } : {}),
  };
}
//#endregion
//#region src/infra/state-migrations.doctor.ts
let autoMigrateChecked = false;
function resetAutoMigrateLegacyStateForTest() {
  autoMigrateChecked = false;
  resetAutoMigrateLegacyTaskStateSidecarsForTest();
  resetLegacySessionSurfacesForTest();
}
async function collectChannelLegacyStateMigrationPlans(params) {
  const plans = [];
  const detectors = listBundledChannelLegacyStateMigrationDetectors({ config: params.cfg });
  for (const detectLegacyStateMigrationsLocal of detectors) {
    const detected = await detectLegacyStateMigrationsLocal({
      cfg: params.cfg,
      env: params.env,
      stateDir: params.stateDir,
      oauthDir: params.oauthDir,
    });
    if (detected?.length)
      for (const detectedPlan of detected) {
        const plan =
          detectedPlan.kind === "plugin-state-import" && !detectedPlan.stateDir
            ? {
                ...detectedPlan,
                stateDir: params.stateDir,
              }
            : detectedPlan;
        plans.push(plan);
      }
  }
  return plans;
}
async function collectPluginDoctorStateMigrationPlans(params) {
  const plans = [];
  const config = params.pluginDoctorConfig ?? params.cfg;
  for (const entry of listPluginDoctorStateMigrationEntries({
    config,
    env: params.env,
  })) {
    let detected;
    try {
      detected = await entry.migration.detectLegacyState({
        config,
        env: params.env,
        stateDir: params.stateDir,
        oauthDir: params.oauthDir,
        context: createPluginDoctorStateMigrationContext(entry.pluginId, params.env),
      });
    } catch (err) {
      params.warnings?.push(`Failed detecting ${entry.migration.label}: ${String(err)}`);
      continue;
    }
    if (detected?.preview.length)
      plans.push({
        pluginId: entry.pluginId,
        migration: entry.migration,
        preview: detected.preview,
      });
  }
  return plans;
}
function createPluginDoctorStateMigrationContext(pluginId, env) {
  return {
    openPluginStateKeyedStore(options) {
      return createPluginStateKeyedStore(pluginId, {
        ...options,
        env: options.env ?? env,
      });
    },
  };
}
async function detectLegacyStateMigrations(params) {
  const env = params.env ?? process.env;
  const homedir = params.homedir ?? os.homedir;
  const stateDir = resolveStateDir(env, homedir);
  const oauthDir = resolveOAuthDir(env, stateDir);
  const crossStateDirImports = params.crossStateDirImports === true;
  const notices = [];
  const detectedExecApprovals = detectLegacyExecApprovalsMigration({
    env,
    homedir,
    stateDir,
  });
  const execApprovals = crossStateDirImports
    ? detectedExecApprovals
    : {
        ...detectedExecApprovals,
        hasLegacy: false,
      };
  if (detectedExecApprovals.hasLegacy && !crossStateDirImports)
    notices.push(
      `Exec approvals in the default state dir were not imported into OPENCLAW_STATE_DIR automatically (${detectedExecApprovals.sourcePath} -> ${detectedExecApprovals.targetPath}); run \`openclaw doctor --fix\` to import them.`,
    );
  const targetAgentId = normalizeAgentId(resolveDefaultAgentId(params.cfg));
  const rawMainKey = params.cfg.session?.mainKey;
  const targetMainKey =
    typeof rawMainKey === "string" && rawMainKey.trim().length > 0
      ? rawMainKey.trim()
      : DEFAULT_MAIN_KEY;
  const targetScope = params.cfg.session?.scope;
  const sessionsLegacyDir = path.join(stateDir, "sessions");
  const sessionsLegacyStorePath = path.join(sessionsLegacyDir, "sessions.json");
  const sessionsTargetDir = path.join(stateDir, "agents", targetAgentId, "sessions");
  const sessionsTargetStorePath = path.join(sessionsTargetDir, "sessions.json");
  const pluginConfig = params.pluginDoctorConfig ?? params.cfg;
  const pluginSessionStoreAgentIds =
    params.pluginSessionStoreAgentIds ??
    listPluginDoctorSessionStoreAgentIds({
      config: pluginConfig,
      env,
      pluginIds: collectRelevantDoctorPluginIds(pluginConfig),
    });
  const currentSessionStoreOwnership = resolveSessionStoreOwnership({
    cfg: params.cfg,
    env,
    stateDir,
    targetAgentId,
    pluginSessionStoreAgentIds,
  });
  const sessionStoreOwnership = {
    preserveAmbiguousKeys:
      params.sessionStoreOwnership?.preserveAmbiguousKeys === true ||
      currentSessionStoreOwnership.preserveAmbiguousKeys,
    preserveForeignMainAliases:
      params.sessionStoreOwnership?.preserveForeignMainAliases === true ||
      currentSessionStoreOwnership.preserveForeignMainAliases,
    targetStoreAliases: mergeSessionStoreAliasPlans(
      params.sessionStoreOwnership?.targetStoreAliases,
      currentSessionStoreOwnership.targetStoreAliases,
    ),
  };
  const { preserveForeignMainAliases } = sessionStoreOwnership;
  const legacySessionEntries = safeReadDir(sessionsLegacyDir);
  const hasLegacySessions =
    fileExists(sessionsLegacyStorePath) ||
    legacySessionEntries.some((e) => e.isFile() && e.name.endsWith(".jsonl"));
  const targetSessionParsed = fileExists(sessionsTargetStorePath)
    ? readSessionStoreJson5(sessionsTargetStorePath)
    : {
        store: {},
        ok: true,
      };
  const legacyKeys = targetSessionParsed.ok
    ? listLegacySessionKeys({
        store: targetSessionParsed.store,
        agentId: targetAgentId,
        mainKey: targetMainKey,
        scope: targetScope,
        preserveAmbiguousKeys: sessionStoreOwnership.preserveAmbiguousKeys,
        preserveForeignMainAliases,
      })
    : [];
  const hasStaleSessionFiles =
    targetSessionParsed.ok &&
    Object.values(targetSessionParsed.store).some((entry) =>
      Boolean(
        resolveStaleLegacySessionFile({
          entry,
          legacyDir: sessionsLegacyDir,
          targetDir: sessionsTargetDir,
        }),
      ),
    );
  const legacyAgentDir = path.join(stateDir, "agent");
  const targetAgentDir = path.join(stateDir, "agents", targetAgentId, "agent");
  const hasLegacyAgentDir = existsDir(legacyAgentDir);
  const pluginStateSidecarPath = resolveLegacyPluginStateSidecarPath(stateDir);
  const hasPluginStateSidecar = fileExists(pluginStateSidecarPath);
  const hasPendingPluginStateSidecarArchive = hasPendingSqliteSidecarArchive(
    pluginStateSidecarPath,
    PLUGIN_STATE_SQLITE_SIDECAR_SUFFIXES,
  );
  const pluginInstallIndexPath = resolveLegacyInstalledPluginIndexStorePath({ stateDir });
  const hasPluginInstallIndex = fileExists(pluginInstallIndexPath);
  const debugProxyCaptureSidecar = detectLegacyDebugProxyCaptureSidecar(stateDir, env);
  const stateSchemaMigrations = detectOpenClawStateDatabaseSchemaMigrations({
    env: {
      ...env,
      OPENCLAW_STATE_DIR: stateDir,
    },
  });
  const taskRunsSidecarPath = resolveLegacyTaskRunsSidecarPath(stateDir);
  const flowRunsSidecarPath = resolveLegacyFlowRunsSidecarPath(stateDir);
  const hasPendingTaskRunsSidecarArchive = hasPendingSqliteSidecarArchive(
    taskRunsSidecarPath,
    TASK_STATE_SQLITE_SIDECAR_SUFFIXES,
  );
  const hasPendingFlowRunsSidecarArchive = hasPendingSqliteSidecarArchive(
    flowRunsSidecarPath,
    TASK_STATE_SQLITE_SIDECAR_SUFFIXES,
  );
  const hasTaskStateSidecars =
    fileExists(taskRunsSidecarPath) ||
    fileExists(flowRunsSidecarPath) ||
    hasPendingTaskRunsSidecarArchive ||
    hasPendingFlowRunsSidecarArchive;
  const deliveryQueuePaths = {
    outboundPath: resolveLegacyDeliveryQueuePath(stateDir, "delivery-queue"),
    sessionPath: resolveLegacyDeliveryQueuePath(stateDir, "session-delivery-queue"),
  };
  const hasDeliveryQueues =
    listLegacyDeliveryQueueFiles(deliveryQueuePaths.outboundPath).length > 0 ||
    listLegacyDeliveryQueueDeliveredMarkers(deliveryQueuePaths.outboundPath).length > 0 ||
    listLegacyDeliveryQueueFiles(deliveryQueuePaths.sessionPath).length > 0 ||
    listLegacyDeliveryQueueDeliveredMarkers(deliveryQueuePaths.sessionPath).length > 0;
  const voiceWake = {
    triggersPath: resolveLegacyVoiceWakeTriggersPath(stateDir),
    routingPath: resolveLegacyVoiceWakeRoutingPath(stateDir),
  };
  const hasVoiceWake = fileExists(voiceWake.triggersPath) || fileExists(voiceWake.routingPath);
  const updateCheck = { sourcePath: resolveLegacyUpdateCheckPath(stateDir) };
  const hasUpdateCheck = fileExists(updateCheck.sourcePath);
  const configHealth = { sourcePath: resolveLegacyConfigHealthPath(stateDir) };
  const hasConfigHealth = fileExists(configHealth.sourcePath);
  const pluginBindingApprovals = {
    sourcePath: resolveLegacyPluginBindingApprovalsPath(env, homedir),
  };
  const pluginBindingApprovalsCrossDir =
    path.resolve(path.dirname(pluginBindingApprovals.sourcePath)) !== path.resolve(stateDir);
  const hasPluginBindingApprovals =
    !isNamedProfile(env) &&
    fileExists(pluginBindingApprovals.sourcePath) &&
    (crossStateDirImports || !pluginBindingApprovalsCrossDir);
  if (
    !isNamedProfile(env) &&
    fileExists(pluginBindingApprovals.sourcePath) &&
    pluginBindingApprovalsCrossDir &&
    !crossStateDirImports
  )
    notices.push(
      `Plugin binding approvals in the default state dir were not imported into OPENCLAW_STATE_DIR automatically (${pluginBindingApprovals.sourcePath}); run \`openclaw doctor --fix\` to import them.`,
    );
  const currentConversationBindings = {
    sourcePath: resolveLegacyCurrentConversationBindingsPath(stateDir),
  };
  const hasCurrentConversationBindings = fileExists(currentConversationBindings.sourcePath);
  const configuredChannels = Object.entries(params.cfg.channels ?? {});
  const configuredAccountIds = Object.fromEntries(
    configuredChannels.map(([channelId, value]) => {
      const channelConfig =
        value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
      const accountIds = [
        ...(getChannelPlugin(channelId)?.config.listAccountIds(params.cfg) ?? []),
        ...(channelConfig?.accounts &&
        typeof channelConfig.accounts === "object" &&
        !Array.isArray(channelConfig.accounts)
          ? Object.keys(channelConfig.accounts)
          : []),
        ...(typeof channelConfig?.defaultAccount === "string"
          ? [channelConfig.defaultAccount]
          : []),
        ...(params.cfg.bindings ?? []).flatMap((binding) =>
          binding.match?.channel === channelId && typeof binding.match.accountId === "string"
            ? [binding.match.accountId]
            : [],
        ),
      ];
      return [
        channelId,
        Array.from(new Set(accountIds.map((entry) => entry.trim()).filter(Boolean))),
      ];
    }),
  );
  const channelPairing = detectLegacyChannelPairingState({
    sourceDir: oauthDir,
    configuredChannelIds: configuredChannels.map(([channelId]) => channelId),
    configuredDefaultAccountIds: Object.fromEntries(
      configuredChannels.flatMap(([channelId, value]) => {
        const boundAccountId = params.cfg.bindings?.find(
          (binding) =>
            normalizeAgentId(binding.agentId) === targetAgentId &&
            binding.match?.channel === channelId &&
            typeof binding.match.accountId === "string",
        )?.match.accountId;
        if (typeof boundAccountId === "string" && boundAccountId.trim())
          return [[channelId, boundAccountId.trim()]];
        const defaultAccount =
          value && typeof value === "object" && !Array.isArray(value)
            ? value.defaultAccount
            : void 0;
        if (typeof defaultAccount === "string" && defaultAccount.trim())
          return [[channelId, defaultAccount.trim()]];
        const plugin = getChannelPlugin(channelId);
        if (plugin)
          return [
            [
              channelId,
              resolveChannelDefaultAccountId({
                plugin,
                cfg: params.cfg,
              }),
            ],
          ];
        return [[channelId, configuredAccountIds[channelId]?.toSorted()[0] ?? "default"]];
      }),
    ),
    configuredAccountIds,
  });
  const channelPlans = await collectChannelLegacyStateMigrationPlans({
    cfg: params.cfg,
    env,
    stateDir,
    oauthDir,
  });
  const pluginPlanWarnings = [];
  const pluginPlans =
    stateSchemaMigrations.length > 0
      ? []
      : await collectPluginDoctorStateMigrationPlans({
          cfg: params.cfg,
          pluginDoctorConfig: params.pluginDoctorConfig,
          env,
          stateDir,
          oauthDir,
          warnings: pluginPlanWarnings,
        });
  const preview = [];
  if (hasLegacySessions) preview.push(`- Sessions: ${sessionsLegacyDir} → ${sessionsTargetDir}`);
  if (legacyKeys.length > 0)
    preview.push(`- Sessions: canonicalize legacy keys in ${sessionsTargetStorePath}`);
  if (hasStaleSessionFiles)
    preview.push(`- Sessions: repair migrated transcript paths in ${sessionsTargetStorePath}`);
  if (hasLegacyAgentDir) preview.push(`- Agent dir: ${legacyAgentDir} → ${targetAgentDir}`);
  if (hasPluginStateSidecar)
    preview.push(`- Plugin state sidecar: ${pluginStateSidecarPath} → shared SQLite state`);
  else if (hasPendingPluginStateSidecarArchive)
    preview.push(`- Plugin state sidecar: finish archive cleanup for ${pluginStateSidecarPath}`);
  if (hasPluginInstallIndex)
    preview.push(`- Plugin install index: ${pluginInstallIndexPath} → shared SQLite state`);
  if (debugProxyCaptureSidecar.hasLegacy)
    preview.push(
      `- Debug proxy capture sidecar: ${debugProxyCaptureSidecar.sourcePath} → shared SQLite state`,
    );
  if (stateSchemaMigrations.length > 0) {
    for (const migration of stateSchemaMigrations)
      preview.push(
        migration.kind === "agent-databases-composite-primary-key"
          ? "- Shared SQLite schema: agent database registry primary key → agent_id,path"
          : "- Shared SQLite schema: audit event ledger → versioned message lifecycle schema",
      );
    preview.push(
      "- Rerun doctor after shared SQLite schema repair to detect plugin state migrations",
    );
  }
  if (fileExists(taskRunsSidecarPath))
    preview.push(`- Task registry sidecar: ${taskRunsSidecarPath} → shared SQLite state`);
  else if (hasPendingTaskRunsSidecarArchive)
    preview.push(`- Task registry sidecar: finish archive cleanup for ${taskRunsSidecarPath}`);
  if (fileExists(flowRunsSidecarPath))
    preview.push(`- Task flow sidecar: ${flowRunsSidecarPath} → shared SQLite state`);
  else if (hasPendingFlowRunsSidecarArchive)
    preview.push(`- Task flow sidecar: finish archive cleanup for ${flowRunsSidecarPath}`);
  if (hasDeliveryQueues)
    preview.push("- Delivery queues: legacy JSON queue files → shared SQLite state");
  if (hasVoiceWake) preview.push("- Voice Wake settings: legacy JSON files → shared SQLite state");
  if (hasUpdateCheck) preview.push("- Update-check state: legacy JSON file → shared SQLite state");
  if (hasConfigHealth)
    preview.push("- Config health state: legacy JSON file → shared SQLite state");
  if (hasPluginBindingApprovals)
    preview.push("- Plugin binding approvals: legacy JSON file → shared SQLite state");
  if (hasCurrentConversationBindings)
    preview.push("- Current-conversation bindings: legacy JSON file → shared SQLite state");
  if (channelPairing.hasLegacy)
    preview.push("- Channel pairing state: legacy JSON files → shared SQLite state");
  if (execApprovals.hasLegacy)
    preview.push(`- Exec approvals: ${execApprovals.sourcePath} → ${execApprovals.targetPath}`);
  if (channelPlans.length > 0) preview.push(...channelPlans.map(buildLegacyMigrationPreview));
  if (pluginPlans.length > 0) preview.push(...pluginPlans.flatMap((plan) => plan.preview));
  return {
    targetAgentId,
    targetMainKey,
    targetScope,
    stateDir,
    oauthDir,
    sessions: {
      legacyDir: sessionsLegacyDir,
      legacyStorePath: sessionsLegacyStorePath,
      targetDir: sessionsTargetDir,
      targetStorePath: sessionsTargetStorePath,
      hasLegacy: hasLegacySessions || legacyKeys.length > 0 || hasStaleSessionFiles,
      legacyKeys,
      preserveAmbiguousKeys: sessionStoreOwnership.preserveAmbiguousKeys,
      preserveForeignMainAliases,
      targetStoreAliases: sessionStoreOwnership.targetStoreAliases,
    },
    agentDir: {
      legacyDir: legacyAgentDir,
      targetDir: targetAgentDir,
      hasLegacy: hasLegacyAgentDir,
    },
    channelPlans: {
      hasLegacy: channelPlans.length > 0,
      plans: channelPlans,
    },
    pluginPlans: {
      hasLegacy: pluginPlans.length > 0,
      plans: pluginPlans,
    },
    pluginStateSidecar: {
      sourcePath: pluginStateSidecarPath,
      hasLegacy: hasPluginStateSidecar || hasPendingPluginStateSidecarArchive,
    },
    pluginInstallIndex: {
      sourcePath: pluginInstallIndexPath,
      hasLegacy: hasPluginInstallIndex,
    },
    debugProxyCaptureSidecar,
    stateSchema: {
      hasLegacy: stateSchemaMigrations.length > 0,
      preview: stateSchemaMigrations.map((migration) => migration.path),
    },
    taskStateSidecars: {
      taskRunsPath: taskRunsSidecarPath,
      flowRunsPath: flowRunsSidecarPath,
      hasLegacy: hasTaskStateSidecars,
    },
    deliveryQueues: {
      ...deliveryQueuePaths,
      hasLegacy: hasDeliveryQueues,
    },
    voiceWake: {
      ...voiceWake,
      hasLegacy: hasVoiceWake,
    },
    updateCheck: {
      ...updateCheck,
      hasLegacy: hasUpdateCheck,
    },
    configHealth: {
      ...configHealth,
      hasLegacy: hasConfigHealth,
    },
    pluginBindingApprovals: {
      ...pluginBindingApprovals,
      hasLegacy: hasPluginBindingApprovals,
    },
    currentConversationBindings: {
      ...currentConversationBindings,
      hasLegacy: hasCurrentConversationBindings,
    },
    channelPairing,
    execApprovals,
    warnings: pluginPlanWarnings,
    notices,
    preview,
  };
}
async function runPluginDoctorStateMigrationPlans(params) {
  const changes = [];
  const warnings = [];
  const notices = [];
  const refreshedPlans = await collectPluginDoctorStateMigrationPlans({
    cfg: params.config,
    env: params.env,
    stateDir: params.detected.stateDir,
    oauthDir: params.detected.oauthDir,
    warnings,
  });
  const hasDetectorFailure = warnings.length > 0;
  const plans =
    refreshedPlans.length > 0 || hasDetectorFailure
      ? refreshedPlans
      : (params.detected.pluginPlans?.plans ?? []);
  for (const plan of plans)
    try {
      const result = await plan.migration.migrateLegacyState({
        config: params.config,
        env: params.env,
        stateDir: params.detected.stateDir,
        oauthDir: params.detected.oauthDir,
        context: createPluginDoctorStateMigrationContext(plan.pluginId, params.env),
      });
      changes.push(...result.changes);
      warnings.push(...result.warnings);
      notices.push(...(result.notices ?? []));
    } catch (err) {
      warnings.push(`Failed migrating ${plan.migration.label}: ${String(err)}`);
    }
  return notices.length > 0
    ? {
        changes,
        warnings,
        notices,
      }
    : {
        changes,
        warnings,
      };
}
async function autoMigrateLegacyPluginDoctorState(params) {
  const env = params.env ?? process.env;
  const stateDirResult = await autoMigrateLegacyStateDir({
    env,
    homedir: params.homedir,
    log: params.log,
  });
  const stateDir = resolveStateDir(env, params.homedir ?? os.homedir);
  const oauthDir = resolveOAuthDir(env, stateDir);
  const stateSchema = repairOpenClawStateDatabaseSchema({
    env: {
      ...env,
      OPENCLAW_STATE_DIR: stateDir,
    },
  });
  const changes = [...stateDirResult.changes, ...stateSchema.changes];
  const warnings = [...stateDirResult.warnings, ...stateSchema.warnings];
  const notices = [...(stateDirResult.notices ?? [])];
  if (stateSchema.warnings.length > 0)
    return {
      migrated: stateDirResult.migrated || stateSchema.changes.length > 0,
      skipped: false,
      changes,
      warnings,
      ...(notices.length > 0 ? { notices } : {}),
    };
  const plans = await collectPluginDoctorStateMigrationPlans({
    cfg: params.config,
    env,
    stateDir,
    oauthDir,
    warnings,
  });
  for (const plan of plans)
    try {
      const result = await plan.migration.migrateLegacyState({
        config: params.config,
        env,
        stateDir,
        oauthDir,
        context: createPluginDoctorStateMigrationContext(plan.pluginId, env),
      });
      changes.push(...result.changes);
      warnings.push(...result.warnings);
      notices.push(...(result.notices ?? []));
    } catch (err) {
      warnings.push(`Failed migrating ${plan.migration.label}: ${String(err)}`);
    }
  return {
    migrated: stateDirResult.migrated || stateSchema.changes.length > 0 || plans.length > 0,
    skipped: false,
    changes,
    warnings,
    ...(notices.length > 0 ? { notices } : {}),
  };
}
function migrateLegacyStateSchema(detected, env) {
  return repairOpenClawStateDatabaseSchema({
    env: {
      ...env,
      OPENCLAW_STATE_DIR: detected.stateDir,
    },
  });
}
async function runLegacyStateMigrations(params) {
  const now = params.now ?? (() => Date.now());
  const detected = params.detected;
  const env = params.env ?? process.env;
  const stateSchema = migrateLegacyStateSchema(detected, env);
  if (detected.stateSchema.hasLegacy && stateSchema.warnings.length > 0) return stateSchema;
  const pluginStateSidecar = await migrateLegacyPluginStateSidecar({ stateDir: detected.stateDir });
  const pluginInstallIndex = await migrateLegacyInstalledPluginIndex({
    stateDir: detected.stateDir,
  });
  const debugProxyCaptureSidecar = migrateLegacyDebugProxyCaptureSidecar({
    stateDir: detected.stateDir,
    detected: detected.debugProxyCaptureSidecar,
  });
  const taskStateSidecars = await migrateLegacyTaskStateSidecars({ stateDir: detected.stateDir });
  const deliveryQueues = await migrateLegacyDeliveryQueues({ stateDir: detected.stateDir });
  const voiceWake = migrateLegacyVoiceWakeSettings({
    detected: detected.voiceWake,
    stateDir: detected.stateDir,
  });
  const updateCheck = migrateLegacyUpdateCheckState({
    detected: detected.updateCheck,
    stateDir: detected.stateDir,
  });
  const configHealth = migrateLegacyConfigHealth({
    detected: detected.configHealth,
    stateDir: detected.stateDir,
  });
  const pluginBindingApprovals = migrateLegacyPluginBindingApprovals({
    detected: detected.pluginBindingApprovals,
    stateDir: detected.stateDir,
  });
  const currentConversationBindings = migrateLegacyCurrentConversationBindings({
    detected: detected.currentConversationBindings,
    stateDir: detected.stateDir,
  });
  const channelPairing = migrateLegacyChannelPairingState({
    detected: detected.channelPairing,
    env: {
      ...env,
      OPENCLAW_STATE_DIR: detected.stateDir,
    },
  });
  const execApprovals = migrateLegacyExecApprovals(detected.execApprovals);
  const preSessionChannelPlans = await runLegacyMigrationPlans(
    detected.channelPlans.plans.filter((plan) => plan.kind === "plugin-state-import"),
  );
  const pluginPlans = detected.stateSchema.hasLegacy
    ? {
        changes: [],
        warnings: [],
      }
    : await runPluginDoctorStateMigrationPlans({
        detected,
        config: params.config ?? {},
        env,
      });
  const sessions = await migrateLegacySessions(detected, now, {
    recoverCorruptTargetStore: params.recoverCorruptTargetStore,
  });
  const acpSessionMetadata = await migrateLegacyAcpSessionMetadata({
    cfg: params.config ?? {},
    env: {
      ...env,
      OPENCLAW_STATE_DIR: detected.stateDir,
    },
    now,
  });
  const agentDir = await migrateLegacyAgentDir(detected, now);
  const channelPlans = await runLegacyMigrationPlans(
    detected.channelPlans.plans.filter((plan) => plan.kind !== "plugin-state-import"),
  );
  const notices = mergeNotices([pluginInstallIndex, updateCheck, pluginPlans]);
  return {
    changes: [
      ...stateSchema.changes,
      ...pluginStateSidecar.changes,
      ...pluginInstallIndex.changes,
      ...debugProxyCaptureSidecar.changes,
      ...taskStateSidecars.changes,
      ...deliveryQueues.changes,
      ...voiceWake.changes,
      ...updateCheck.changes,
      ...configHealth.changes,
      ...pluginBindingApprovals.changes,
      ...currentConversationBindings.changes,
      ...channelPairing.changes,
      ...execApprovals.changes,
      ...preSessionChannelPlans.changes,
      ...pluginPlans.changes,
      ...sessions.changes,
      ...acpSessionMetadata.changes,
      ...agentDir.changes,
      ...channelPlans.changes,
    ],
    warnings: [
      ...stateSchema.warnings,
      ...detected.warnings,
      ...pluginStateSidecar.warnings,
      ...pluginInstallIndex.warnings,
      ...debugProxyCaptureSidecar.warnings,
      ...taskStateSidecars.warnings,
      ...deliveryQueues.warnings,
      ...voiceWake.warnings,
      ...updateCheck.warnings,
      ...configHealth.warnings,
      ...pluginBindingApprovals.warnings,
      ...currentConversationBindings.warnings,
      ...channelPairing.warnings,
      ...execApprovals.warnings,
      ...preSessionChannelPlans.warnings,
      ...pluginPlans.warnings,
      ...sessions.warnings,
      ...acpSessionMetadata.warnings,
      ...agentDir.warnings,
      ...channelPlans.warnings,
    ],
    ...(notices.length > 0 ? { notices } : {}),
  };
}
/**
 * Canonicalize orphaned raw session keys in all known agent session stores.
 *
 * Keys written by resolveSessionKey() used DEFAULT_AGENT_ID="main" regardless
 * of the configured default agent; reads always use resolveSessionStoreKey()
 * which canonicalizes via canonicalizeMainSessionAlias. This migration renames
 * any orphaned raw keys to their canonical form in-place, merging with any
 * existing canonical entry by preferring the most recently updated.
 *
 * Safe to run multiple times (idempotent). See #29683.
 */
async function autoMigrateLegacyState(params) {
  if (autoMigrateChecked)
    return {
      migrated: false,
      skipped: true,
      changes: [],
      warnings: [],
    };
  autoMigrateChecked = true;
  const env = params.env ?? process.env;
  const stateDirResult = await autoMigrateLegacyStateDir({
    env,
    homedir: params.homedir,
    log: params.log,
  });
  const stateDir = resolveStateDir(env, params.homedir ?? os.homedir);
  const stateSchema = repairOpenClawStateDatabaseSchema({
    env: {
      ...env,
      OPENCLAW_STATE_DIR: stateDir,
    },
  });
  if (stateSchema.warnings.length > 0)
    return {
      migrated: stateDirResult.migrated || stateSchema.changes.length > 0,
      skipped: false,
      changes: [...stateDirResult.changes, ...stateSchema.changes],
      warnings: [...stateDirResult.warnings, ...stateSchema.warnings],
      ...(stateDirResult.notices?.length ? { notices: stateDirResult.notices } : {}),
    };
  const pluginDoctorConfig = params.pluginDoctorConfig ?? params.cfg;
  const pluginSessionStoreAgentIds = listPluginDoctorSessionStoreAgentIds({
    config: pluginDoctorConfig,
    env,
    pluginIds: collectRelevantDoctorPluginIds(pluginDoctorConfig),
  });
  const sessionStoreOwnership = resolveSessionStoreOwnership({
    cfg: params.cfg,
    env,
    stateDir,
    targetAgentId: normalizeAgentId(resolveDefaultAgentId(params.cfg)),
    pluginSessionStoreAgentIds,
  });
  const orphanKeys = await migrateOrphanedSessionKeys({
    cfg: params.cfg,
    env,
    additionalAgentIds: pluginSessionStoreAgentIds,
  });
  const acpSessionMetadata = await migrateLegacyAcpSessionMetadata({
    cfg: params.cfg,
    env,
    now: params.now,
    pluginSessionStoreAgentIds,
  });
  const logMigrationResults = (changes, warnings, notices) => {
    const logger = params.log ?? createSubsystemLogger("state-migrations");
    if (changes.length > 0)
      logger.info(
        `Auto-migrated legacy state:\n${changes.map((entry) => `- ${entry}`).join("\n")}`,
      );
    if (warnings.length > 0)
      logger.warn(
        `Legacy state migration warnings:\n${warnings.map((entry) => `- ${entry}`).join("\n")}`,
      );
    if (notices.length > 0)
      logger.info(
        `Legacy state migration notes:\n${notices.map((entry) => `- ${entry}`).join("\n")}`,
      );
  };
  const detected = await detectLegacyStateMigrations({
    cfg: params.cfg,
    pluginDoctorConfig: params.pluginDoctorConfig,
    pluginSessionStoreAgentIds,
    sessionStoreOwnership,
    env,
    homedir: params.homedir,
    crossStateDirImports: params.crossStateDirImports,
  });
  if (env.OPENCLAW_AGENT_DIR?.trim() || env.PI_CODING_AGENT_DIR?.trim()) {
    const pluginStateSidecar = await migrateLegacyPluginStateSidecar({
      stateDir: detected.stateDir,
    });
    const pluginInstallIndex = await migrateLegacyInstalledPluginIndex({
      stateDir: detected.stateDir,
    });
    const debugProxyCaptureSidecar = migrateLegacyDebugProxyCaptureSidecar({
      stateDir: detected.stateDir,
      detected: detected.debugProxyCaptureSidecar,
    });
    const taskStateSidecars = await migrateLegacyTaskStateSidecars({ stateDir: detected.stateDir });
    const deliveryQueues = await migrateLegacyDeliveryQueues({ stateDir: detected.stateDir });
    const voiceWake = migrateLegacyVoiceWakeSettings({
      detected: detected.voiceWake,
      stateDir: detected.stateDir,
    });
    const updateCheck = migrateLegacyUpdateCheckState({
      detected: detected.updateCheck,
      stateDir: detected.stateDir,
    });
    const configHealth = migrateLegacyConfigHealth({
      detected: detected.configHealth,
      stateDir: detected.stateDir,
    });
    const pluginBindingApprovals = migrateLegacyPluginBindingApprovals({
      detected: detected.pluginBindingApprovals,
      stateDir: detected.stateDir,
    });
    const currentConversationBindings = migrateLegacyCurrentConversationBindings({
      detected: detected.currentConversationBindings,
      stateDir: detected.stateDir,
    });
    const channelPairing = migrateLegacyChannelPairingState({
      detected: detected.channelPairing,
      env: {
        ...env,
        OPENCLAW_STATE_DIR: detected.stateDir,
      },
    });
    const execApprovals = migrateLegacyExecApprovals(detected.execApprovals);
    const preSessionChannelPlans = await runLegacyMigrationPlans(
      detected.channelPlans.plans.filter((plan) => plan.kind === "plugin-state-import"),
    );
    const pluginPlans = await runPluginDoctorStateMigrationPlans({
      detected,
      config: params.pluginDoctorConfig ?? params.cfg,
      env,
    });
    const changes = [
      ...stateDirResult.changes,
      ...stateSchema.changes,
      ...orphanKeys.changes,
      ...acpSessionMetadata.changes,
      ...pluginStateSidecar.changes,
      ...pluginInstallIndex.changes,
      ...debugProxyCaptureSidecar.changes,
      ...taskStateSidecars.changes,
      ...deliveryQueues.changes,
      ...voiceWake.changes,
      ...updateCheck.changes,
      ...configHealth.changes,
      ...pluginBindingApprovals.changes,
      ...currentConversationBindings.changes,
      ...channelPairing.changes,
      ...execApprovals.changes,
      ...preSessionChannelPlans.changes,
      ...pluginPlans.changes,
    ];
    const warnings = [
      ...stateDirResult.warnings,
      ...stateSchema.warnings,
      ...detected.warnings,
      ...orphanKeys.warnings,
      ...acpSessionMetadata.warnings,
      ...pluginStateSidecar.warnings,
      ...pluginInstallIndex.warnings,
      ...debugProxyCaptureSidecar.warnings,
      ...taskStateSidecars.warnings,
      ...deliveryQueues.warnings,
      ...voiceWake.warnings,
      ...updateCheck.warnings,
      ...configHealth.warnings,
      ...pluginBindingApprovals.warnings,
      ...currentConversationBindings.warnings,
      ...channelPairing.warnings,
      ...execApprovals.warnings,
      ...preSessionChannelPlans.warnings,
      ...pluginPlans.warnings,
    ];
    const notices = mergeNotices([
      stateDirResult,
      detected,
      pluginInstallIndex,
      updateCheck,
      pluginPlans,
    ]);
    logMigrationResults(changes, warnings, notices);
    return {
      migrated:
        stateDirResult.migrated ||
        stateSchema.changes.length > 0 ||
        orphanKeys.changes.length > 0 ||
        acpSessionMetadata.changes.length > 0 ||
        pluginStateSidecar.changes.length > 0 ||
        pluginInstallIndex.changes.length > 0 ||
        debugProxyCaptureSidecar.changes.length > 0 ||
        taskStateSidecars.changes.length > 0 ||
        deliveryQueues.changes.length > 0 ||
        voiceWake.changes.length > 0 ||
        updateCheck.changes.length > 0 ||
        configHealth.changes.length > 0 ||
        pluginBindingApprovals.changes.length > 0 ||
        currentConversationBindings.changes.length > 0 ||
        channelPairing.changes.length > 0 ||
        execApprovals.changes.length > 0 ||
        preSessionChannelPlans.changes.length > 0 ||
        pluginPlans.changes.length > 0,
      skipped: true,
      changes,
      warnings,
      ...(notices.length > 0 ? { notices } : {}),
    };
  }
  if (
    !detected.sessions.hasLegacy &&
    !detected.agentDir.hasLegacy &&
    !detected.channelPlans.hasLegacy &&
    !detected.pluginPlans?.hasLegacy &&
    !detected.pluginStateSidecar.hasLegacy &&
    !detected.pluginInstallIndex.hasLegacy &&
    !detected.debugProxyCaptureSidecar.hasLegacy &&
    !detected.stateSchema.hasLegacy &&
    !detected.taskStateSidecars.hasLegacy &&
    !detected.deliveryQueues.hasLegacy &&
    !detected.voiceWake.hasLegacy &&
    !detected.updateCheck.hasLegacy &&
    !detected.configHealth.hasLegacy &&
    !detected.pluginBindingApprovals.hasLegacy &&
    !detected.currentConversationBindings.hasLegacy &&
    !detected.channelPairing.hasLegacy &&
    !detected.execApprovals.hasLegacy
  ) {
    const changes = [
      ...stateDirResult.changes,
      ...stateSchema.changes,
      ...orphanKeys.changes,
      ...acpSessionMetadata.changes,
    ];
    const warnings = [
      ...stateDirResult.warnings,
      ...stateSchema.warnings,
      ...detected.warnings,
      ...orphanKeys.warnings,
      ...acpSessionMetadata.warnings,
    ];
    const notices = [...(stateDirResult.notices ?? []), ...detected.notices];
    logMigrationResults(changes, warnings, notices);
    return {
      migrated:
        stateDirResult.migrated ||
        stateSchema.changes.length > 0 ||
        orphanKeys.changes.length > 0 ||
        acpSessionMetadata.changes.length > 0,
      skipped: false,
      changes,
      warnings,
      ...(notices.length > 0 ? { notices } : {}),
    };
  }
  const now = params.now ?? (() => Date.now());
  const pluginStateSidecar = await migrateLegacyPluginStateSidecar({ stateDir: detected.stateDir });
  const pluginInstallIndex = await migrateLegacyInstalledPluginIndex({
    stateDir: detected.stateDir,
  });
  const debugProxyCaptureSidecar = migrateLegacyDebugProxyCaptureSidecar({
    stateDir: detected.stateDir,
    detected: detected.debugProxyCaptureSidecar,
  });
  const taskStateSidecars = await migrateLegacyTaskStateSidecars({ stateDir: detected.stateDir });
  const deliveryQueues = await migrateLegacyDeliveryQueues({ stateDir: detected.stateDir });
  const voiceWake = migrateLegacyVoiceWakeSettings({
    detected: detected.voiceWake,
    stateDir: detected.stateDir,
  });
  const updateCheck = migrateLegacyUpdateCheckState({
    detected: detected.updateCheck,
    stateDir: detected.stateDir,
  });
  const configHealth = migrateLegacyConfigHealth({
    detected: detected.configHealth,
    stateDir: detected.stateDir,
  });
  const pluginBindingApprovals = migrateLegacyPluginBindingApprovals({
    detected: detected.pluginBindingApprovals,
    stateDir: detected.stateDir,
  });
  const currentConversationBindings = migrateLegacyCurrentConversationBindings({
    detected: detected.currentConversationBindings,
    stateDir: detected.stateDir,
  });
  const channelPairing = migrateLegacyChannelPairingState({
    detected: detected.channelPairing,
    env: {
      ...env,
      OPENCLAW_STATE_DIR: detected.stateDir,
    },
  });
  const execApprovals = migrateLegacyExecApprovals(detected.execApprovals);
  const preSessionChannelPlans = await runLegacyMigrationPlans(
    detected.channelPlans.plans.filter((plan) => plan.kind === "plugin-state-import"),
  );
  const pluginPlans = await runPluginDoctorStateMigrationPlans({
    detected,
    config: params.pluginDoctorConfig ?? params.cfg,
    env,
  });
  const sessions = await migrateLegacySessions(detected, now, {
    recoverCorruptTargetStore: params.recoverCorruptTargetStore,
  });
  const postSessionAcpMetadata = await migrateLegacyAcpSessionMetadata({
    cfg: params.cfg,
    env,
    now,
    pluginSessionStoreAgentIds,
  });
  const agentDir = await migrateLegacyAgentDir(detected, now);
  const channelPlans = await runLegacyMigrationPlans(
    detected.channelPlans.plans.filter((plan) => plan.kind !== "plugin-state-import"),
  );
  const changes = [
    ...stateDirResult.changes,
    ...stateSchema.changes,
    ...orphanKeys.changes,
    ...acpSessionMetadata.changes,
    ...pluginStateSidecar.changes,
    ...pluginInstallIndex.changes,
    ...debugProxyCaptureSidecar.changes,
    ...taskStateSidecars.changes,
    ...deliveryQueues.changes,
    ...voiceWake.changes,
    ...updateCheck.changes,
    ...configHealth.changes,
    ...pluginBindingApprovals.changes,
    ...currentConversationBindings.changes,
    ...channelPairing.changes,
    ...execApprovals.changes,
    ...preSessionChannelPlans.changes,
    ...pluginPlans.changes,
    ...sessions.changes,
    ...postSessionAcpMetadata.changes,
    ...agentDir.changes,
    ...channelPlans.changes,
  ];
  const warnings = [
    ...stateDirResult.warnings,
    ...stateSchema.warnings,
    ...detected.warnings,
    ...orphanKeys.warnings,
    ...acpSessionMetadata.warnings,
    ...pluginStateSidecar.warnings,
    ...pluginInstallIndex.warnings,
    ...debugProxyCaptureSidecar.warnings,
    ...taskStateSidecars.warnings,
    ...deliveryQueues.warnings,
    ...voiceWake.warnings,
    ...updateCheck.warnings,
    ...configHealth.warnings,
    ...pluginBindingApprovals.warnings,
    ...currentConversationBindings.warnings,
    ...channelPairing.warnings,
    ...execApprovals.warnings,
    ...preSessionChannelPlans.warnings,
    ...pluginPlans.warnings,
    ...sessions.warnings,
    ...postSessionAcpMetadata.warnings,
    ...agentDir.warnings,
    ...channelPlans.warnings,
  ];
  const notices = mergeNotices([
    stateDirResult,
    detected,
    pluginInstallIndex,
    updateCheck,
    pluginPlans,
  ]);
  logMigrationResults(changes, warnings, notices);
  return {
    migrated: changes.length > 0,
    skipped: false,
    changes,
    warnings,
    ...(notices.length > 0 ? { notices } : {}),
  };
}
//#endregion
export {
  runLegacyStateMigrations as a,
  resetAutoMigrateLegacyStateDirForTest as c,
  migrateOrphanedSessionKeys as d,
  resetAutoMigrateLegacyStateForTest as i,
  resetAutoMigrateLegacyTaskStateSidecarsForTest as l,
  autoMigrateLegacyState as n,
  autoMigrateLegacyStateDir as o,
  detectLegacyStateMigrations as r,
  autoMigrateLegacyTaskStateSidecars as s,
  autoMigrateLegacyPluginDoctorState as t,
  migrateLegacyAgentDir as u,
};
