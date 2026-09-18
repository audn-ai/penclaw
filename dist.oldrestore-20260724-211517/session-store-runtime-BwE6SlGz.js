import fs from "node:fs";
import "./replace-file-CaPU6XwS.js";
import path from "node:path";
import { t as readAmbientTranscriptWatermark$1 } from "./ambient-transcript-watermark-ZvdDmxy7.js";
import { l as resolveStorePath$1, r as resolveSessionFilePath$1 } from "./paths-TfuVT-K8.js";
import { n as replaceFileAtomicSync } from "./replace-file-DfwQ8_Mi.js";
import "./group-DxnHkVUi.js";
import {
  $ as resolveTranscriptSessionKeyBySessionId$1,
  D as patchSessionEntry$1,
  R as readSessionUpdatedAt$1,
  S as loadSessionEntry,
  V as replaceSessionEntry,
  at as updateSessionEntry,
  c as applySessionStoreProjection,
  f as cleanupSessionLifecycleArtifacts$1,
  h as deleteSessionEntryLifecycle,
  w as loadTranscriptEventsSync$1,
  y as listSessionEntries$1,
  z as readTranscriptStatsSync$1,
} from "./session-accessor-PZVNxFCV.js";
import { d as resolveAgentIdFromSessionKey } from "./session-key-druuY-GG.js";
import "./reset-DwjOm4Ug.js";
import "./session-key-Beu1vXbM.js";
import "./transcript-kgNtplfz.js";
import "./send-policy-2la2ZHDC.js";
import {
  n as parseSqliteSessionFileMarker,
  t as formatSqliteSessionFileMarker,
} from "./sqlite-marker-BejbySI1.js";
import {
  _t as resolveSessionStoreEntry$1,
  j as normalizeResolvedMaintenanceConfigInput,
} from "./store-CzZJhTF6.js";
import { o as resolveSqliteTargetFromSessionStorePath } from "./targets-CjMfpXbt.js";
//#region src/plugin-sdk/session-store-runtime.ts
const SQLITE_SESSION_STORE_BACKUP_SUFFIXES = ["", "-wal", "-shm", "-journal"];
const LEGACY_TRANSCRIPT_INSPECTION_MAX_BYTES = 16 * 1024 * 1024;
const legacyStoreAgentIds = /* @__PURE__ */ new Map();
function toSessionAccessScope(params) {
  return {
    sessionKey: params.sessionKey,
    ...(params.agentId !== void 0 ? { agentId: params.agentId } : {}),
    ...(params.env !== void 0 ? { env: params.env } : {}),
    ...(params.hydrateSkillPromptRefs !== void 0
      ? { hydrateSkillPromptRefs: params.hydrateSkillPromptRefs }
      : {}),
    ...(params.readConsistency !== void 0 ? { readConsistency: params.readConsistency } : {}),
    ...(params.storePath !== void 0 ? { storePath: params.storePath } : {}),
  };
}
function resolveLegacySessionStoreTarget(storePath) {
  const resolvedStorePath = path.resolve(storePath);
  const selectedAgentId = legacyStoreAgentIds.get(resolvedStorePath);
  const target = resolveSqliteTargetFromSessionStorePath(resolvedStorePath, {
    agentId: selectedAgentId,
  });
  const agentId = target.agentId ?? selectedAgentId;
  return {
    ...(agentId ? { agentId } : {}),
    storePath: target.path ?? resolvedStorePath,
  };
}
function materializeLegacyTranscriptFile(sessionFile, options) {
  const marker = parseSqliteSessionFileMarker(sessionFile);
  if (!marker) return sessionFile;
  const transcriptScope = {
    agentId: marker.agentId,
    sessionId: marker.sessionId,
    storePath: marker.storePath,
  };
  const transcriptPath = resolveSessionFilePath$1(marker.sessionId, void 0, {
    agentId: marker.agentId,
    ...(options?.sessionsDir ? { sessionsDir: options.sessionsDir } : {}),
  });
  const stats = readTranscriptStatsSync$1(transcriptScope);
  const isOversized =
    stats.sizeBytes + (stats.eventCount > 0 ? 1 : 0) > LEGACY_TRANSCRIPT_INSPECTION_MAX_BYTES;
  replaceFileAtomicSync({
    filePath: transcriptPath,
    content: isOversized
      ? ""
      : (() => {
          const events = loadTranscriptEventsSync$1(transcriptScope);
          return events.length > 0
            ? `${events.map((event) => JSON.stringify(event)).join("\n")}\n`
            : "";
        })(),
    dirMode: 448,
    mode: 384,
    tempPrefix: `${path.basename(transcriptPath)}.sqlite-compat`,
    copyFallbackOnPermissionError: true,
    syncParentDir: true,
    syncTempFile: true,
    ...(isOversized
      ? {
          beforeRename: ({ tempPath }) => {
            fs.truncateSync(tempPath, 16777217);
            const fd = fs.openSync(tempPath, "r+");
            try {
              fs.fsyncSync(fd);
            } finally {
              fs.closeSync(fd);
            }
          },
        }
      : {}),
  });
  return transcriptPath;
}
/**
 * @deprecated Use getSessionEntry or listSessionEntries.
 *
 * Official plugins released with v2026.7.1-beta.5 import this symbol. Keep the
 * compatibility projection through 2026-10-12, then remove it only after the
 * minimum supported plugin version excludes that release.
 */
function loadSessionStore(storePath, options = {}) {
  options.skipCache;
  const target = resolveLegacySessionStoreTarget(storePath);
  return Object.fromEntries(
    listSessionEntries$1({
      ...target,
      clone: true,
      hydrateSkillPromptRefs: options.hydrateSkillPromptRefs,
    }).map(({ sessionKey, entry }) => {
      const sessionId = entry.sessionId?.trim();
      if (entry.sessionFile || !sessionId) return [sessionKey, entry];
      return [
        sessionKey,
        {
          ...entry,
          sessionFile: formatSqliteSessionFileMarker({
            agentId: target.agentId ?? resolveAgentIdFromSessionKey(sessionKey),
            sessionId,
            storePath: target.storePath,
          }),
        },
      ];
    }),
  );
}
/**
 * @deprecated Use patchSessionEntry, upsertSessionEntry, or deleteSessionEntry.
 *
 * Official plugins released with v2026.7.1-beta.5 import this symbol. Keep the
 * compatibility bridge through 2026-10-12. The callback mutates a detached
 * projection; the resulting row diff commits through the SQLite accessor.
 * Beta.5 memory-core already uses cleanupSessionLifecycleArtifacts; this
 * whole-store callback remains only for Feishu doctor's explicit repair flow.
 */
async function updateSessionStore(storePath, mutator, options = {}) {
  const target = resolveLegacySessionStoreTarget(storePath);
  return await applySessionStoreProjection({
    activeSessionKey: options.activeSessionKey,
    ...(target.agentId ? { agentId: target.agentId } : {}),
    storePath: target.storePath,
    skipMaintenance: options.skipMaintenance,
    update: async (store) => {
      const result = await mutator(store);
      return {
        persist: !options.skipSaveWhenResult?.(result),
        result,
      };
    },
  });
}
/**
 * @deprecated Resolve transcript identities with loadTranscriptEventsSync.
 *
 * Beta.5 Feishu doctor still inspects JSONL paths synchronously. SQLite
 * markers therefore materialize a bounded export at the canonical legacy path
 * rather than making the old doctor classify every healthy transcript as
 * missing. These files are durable because beta.5 renames repaired transcripts
 * to recovery archives; remove this bridge only after beta.5 is unsupported.
 */
function resolveSessionFilePath(sessionId, entry, options) {
  return materializeLegacyTranscriptFile(
    resolveSessionFilePath$1(sessionId, entry, options),
    options,
  );
}
/**
 * Resolves the configured session store path.
 *
 * Beta.5 resolves a configured path with an agent id, then passes only the
 * path to loadSessionStore/updateSessionStore. Its shipped callers either
 * consume the selection synchronously or dedupe by path, so retaining the
 * latest selection preserves that bounded compatibility contract.
 */
function resolveStorePath(store, options) {
  const storePath = resolveStorePath$1(store, options);
  if (options?.agentId) legacyStoreAgentIds.set(path.resolve(storePath), options.agentId);
  return storePath;
}
/**
 * @deprecated Use getSessionEntry with a storage-neutral session identity.
 *
 * Official plugins released with v2026.7.1-beta.5 import this whole-store
 * lookup helper. Keep it through 2026-10-12 with the other beta.5 bridge.
 */
function resolveSessionStoreEntry(params) {
  return resolveSessionStoreEntry$1(params);
}
/** Loads one session entry by agent/session identity. */
function getSessionEntry(params) {
  return loadSessionEntry(toSessionAccessScope(params));
}
/** Lists session entries for one agent. */
function listSessionEntries(params = {}) {
  return listSessionEntries$1({
    ...(params.agentId !== void 0 ? { agentId: params.agentId } : {}),
    ...(params.env !== void 0 ? { env: params.env } : {}),
    ...(params.hydrateSkillPromptRefs !== void 0
      ? { hydrateSkillPromptRefs: params.hydrateSkillPromptRefs }
      : {}),
    ...(params.storePath !== void 0 ? { storePath: params.storePath } : {}),
  });
}
/** Reads transcript events for a live SQLite-backed session identity. */
function loadTranscriptEventsSync(params) {
  return loadTranscriptEventsSync$1(params);
}
/** Reads transcript freshness and byte size without materializing event rows. */
function readTranscriptStatsSync(params) {
  return readTranscriptStatsSync$1(params);
}
/** Resolves the persisted session key for one SQLite transcript identity. */
function resolveTranscriptSessionKeyBySessionId(params) {
  return resolveTranscriptSessionKeyBySessionId$1(params);
}
/** Patches one session entry by agent/session identity. */
async function patchSessionEntry(params) {
  return await patchSessionEntry$1(toSessionAccessScope(params), params.update, {
    fallbackEntry: params.fallbackEntry,
    maintenanceConfig:
      params.maintenanceConfig !== void 0
        ? normalizeResolvedMaintenanceConfigInput(params.maintenanceConfig)
        : void 0,
    preserveActivity: params.preserveActivity,
    requireWriteSuccess: params.requireWriteSuccess,
    replaceEntry: params.replaceEntry,
    skipMaintenance: params.skipMaintenance,
  });
}
/** Reads the last activity timestamp for one session entry. */
function readSessionUpdatedAt(params) {
  return readSessionUpdatedAt$1(toSessionAccessScope(params));
}
function readAmbientTranscriptWatermark(params) {
  return readAmbientTranscriptWatermark$1(getSessionEntry(params), params.key);
}
/** Updates an existing session entry by store path and session key. */
async function updateSessionStoreEntry(params) {
  return await updateSessionEntry(
    {
      sessionKey: params.sessionKey,
      storePath: params.storePath,
    },
    params.update,
    {
      skipMaintenance: params.skipMaintenance,
      takeCacheOwnership: params.takeCacheOwnership,
      requireWriteSuccess: params.requireWriteSuccess,
    },
  );
}
/** Replaces or creates one session entry by agent/session identity. */
async function upsertSessionEntry(params) {
  await replaceSessionEntry(toSessionAccessScope(params), params.entry);
}
/** Deletes one session entry by agent/session identity. */
async function deleteSessionEntry(params) {
  const storePath =
    params.storePath ??
    resolveStorePath$1(void 0, {
      agentId: params.agentId,
      env: params.env,
    });
  return (
    await deleteSessionEntryLifecycle({
      ...(params.agentId !== void 0 ? { agentId: params.agentId } : {}),
      archiveTranscript: params.archiveTranscript ?? false,
      storePath,
      target: {
        canonicalKey: params.sessionKey,
        storeKeys: [params.sessionKey],
      },
    })
  ).deleted;
}
/** Resolves the file artifacts that should be backed up before mutating a session store. */
function resolveSessionStoreBackupPaths(params) {
  const backupPaths = /* @__PURE__ */ new Set();
  backupPaths.add(path.resolve(params.storePath));
  const sqlitePath = resolveSqliteTargetFromSessionStorePath(params.storePath, {
    agentId: params.agentId,
  }).path;
  if (sqlitePath)
    for (const suffix of SQLITE_SESSION_STORE_BACKUP_SUFFIXES)
      backupPaths.add(`${sqlitePath}${suffix}`);
  return [...backupPaths];
}
/** Cleans stale lifecycle-owned session entries and orphan transcripts for one agent store. */
async function cleanupSessionLifecycleArtifacts(params) {
  return await cleanupSessionLifecycleArtifacts$1({
    storePath:
      params.storePath ??
      resolveStorePath$1(params.sessionStore, {
        agentId: params.agentId,
        env: params.env,
      }),
    ...(params.agentId !== void 0 ? { agentId: params.agentId } : {}),
    archiveRemovedEntryTranscripts: params.archiveRemovedEntryTranscripts,
    sessionKeySegmentPrefix: params.sessionKeySegmentPrefix,
    transcriptContentMarker: params.transcriptContentMarker,
    orphanTranscriptMinAgeMs: params.orphanTranscriptMinAgeMs,
    nowMs: params.nowMs,
  });
}
//#endregion
export {
  updateSessionStoreEntry as _,
  loadSessionStore as a,
  readAmbientTranscriptWatermark as c,
  resolveSessionFilePath as d,
  resolveSessionStoreBackupPaths as f,
  updateSessionStore as g,
  resolveTranscriptSessionKeyBySessionId as h,
  listSessionEntries as i,
  readSessionUpdatedAt as l,
  resolveStorePath as m,
  deleteSessionEntry as n,
  loadTranscriptEventsSync as o,
  resolveSessionStoreEntry as p,
  getSessionEntry as r,
  patchSessionEntry as s,
  cleanupSessionLifecycleArtifacts as t,
  readTranscriptStatsSync as u,
  upsertSessionEntry as v,
};
