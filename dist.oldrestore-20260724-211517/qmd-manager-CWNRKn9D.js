import crypto, { createHash } from "node:crypto";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import readline from "node:readline";
import chokidar from "chokidar";
import {
  i as resolveAgentContextLimits,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import {
  f as memoryCoreWorkspaceEntryKey,
  h as openMemoryCoreStateStore,
} from "./dreaming-state-DLMGVRgZ.js";
import {
  a as deriveQmdScopeChannel,
  b as listSessionTranscriptCorpusEntriesForAgent,
  c as parseQmdQueryJson,
  g as resolveSessionIdentityForTranscriptFile,
  i as runCliCommand,
  l as buildSessionEntry,
  n as resolveCliSpawnInvocation,
  o as deriveQmdScopeChatType,
  s as isQmdScopeAllowed,
} from "./engine-qmd-sbHvD8ZT.js";
import { r as requireMemoryHostNodeSqlite } from "./engine-storage-DV2x5DKD.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import { o as withFileLock } from "./file-lock-C2Kr7iLJ.js";
import { t as isFileMissingError } from "./fs-utils-urkAyyL8.js";
import "./error-runtime-BIAwr399.js";
import "./number-runtime-B-n-wjMn.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { n as resolveGlobalSingleton } from "./global-singleton-PwlQSEal.js";
import { n as resolveMemorySearchSyncConfig } from "./memory-search-C1x_ATR9.js";
import {
  C as resolveExpiresAtMsFromDurationMs,
  a as addTimerTimeoutGraceMs,
  m as isFutureDateTimestampMs,
} from "./number-coercion-CJQ8TR--.js";
import { i as isPathInside } from "./path-DILYn_gk.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import { g as isSessionArchiveArtifactName } from "./paths-TfuVT-K8.js";
import "./session-transcript-hit-CBK6A4kv.js";
import "./memory-core-host-engine-foundation-GFDZKXDt.js";
import {
  a as replaceQmdSessionArtifactMappings,
  i as refreshQmdSessionArtifactDocIds,
  n as copyQmdSessionArtifactHit,
  o as resolveQmdSessionArtifactIdentity,
  t as attachQmdSessionArtifactHit,
} from "./qmd-session-artifacts-DOcNqyKn.js";
import "./memory-core-host-engine-qmd-Cgk374S9.js";
import "./memory-core-host-engine-storage-eNQx81fD.js";
import {
  a as buildMemoryReadResult,
  o as buildMemoryReadResultFromSlice,
} from "./read-file-B9SxqQrC.js";
import "./dreaming-shared-BS6J1klu.js";
import { n as asNullableRecord } from "./record-coerce-DHZ4bFlT.js";
import { o as statRegularFile } from "./regular-file-CuvhUtZS.js";
import { n as MEMORY_SEARCH_DEADLINE_CONTROL } from "./search-deadline-BtL8D_eO.js";
import { a as root } from "./secure-temp-dir-DMUMnweR.js";
import { t as formatSessionTranscriptMemoryHitKey } from "./session-transcript-memory-hit-BhhXJl1H.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  n as localeLowercasePreservingWhitespace,
} from "./string-coerce-DW4mBlAt.js";
import { v as uniqueValues } from "./string-normalization-CRyoFBPt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import {
  i as warnIfMemoryWatchPressureHigh,
  n as settleMemoryWatchEventPaths,
  r as countChokidarWatchedEntries,
  t as recordMemoryWatchEventPath,
} from "./watch-settle-C1cbmodw.js";
//#region extensions/memory-core/src/memory/qmd-compat.ts
function resolveQmdCollectionPatternFlags(preferredFlag) {
  return preferredFlag === "--glob" ? ["--glob", "--mask"] : ["--mask", "--glob"];
}
//#endregion
//#region extensions/memory-core/src/memory/qmd-runtime-cache.ts
const QMD_RUNTIME_CACHE_COLLECTION_VALIDATION_NAMESPACE = "qmd-runtime-cache.collection-validation";
const QMD_RUNTIME_CACHE_MULTI_COLLECTION_PROBE_NAMESPACE =
  "qmd-runtime-cache.multi-collection-probe";
const QMD_RUNTIME_CACHE_COLLECTION_VALIDATION_MAX_ENTRIES = 1e3;
const QMD_RUNTIME_CACHE_MULTI_COLLECTION_PROBE_MAX_ENTRIES = 1e3;
const QMD_RUNTIME_CACHE_COLLECTION_VALIDATION_TTL_MS = 5 * 6e4;
const QMD_RUNTIME_CACHE_MULTI_COLLECTION_PROBE_TTL_MS = 10 * 6e4;
const QMD_RUNTIME_CACHE_ENTRY_VERSION = 1;
function normalizeText(value) {
  return value.trim();
}
function normalizeCollection(collection) {
  return {
    name: normalizeText(collection.name),
    kind: collection.kind,
    pathHash: normalizePathIdentity(collection.path),
    pattern: normalizeText(collection.pattern),
  };
}
function hashText(value) {
  return createHash("sha256").update(value).digest("hex");
}
function normalizePathIdentity(value) {
  return hashText(
    process.platform === "win32" ? normalizeText(value).toLowerCase() : normalizeText(value),
  );
}
function sortedUnique(values) {
  return [...new Set(values.map((value) => normalizeText(value)).filter(Boolean))].toSorted();
}
function buildCollectionConfigHash(collections) {
  return hashText(
    collections
      .map((collection) => ({ ...normalizeCollection(collection) }))
      .toSorted(
        (left, right) =>
          left.name.localeCompare(right.name) ||
          left.kind.localeCompare(right.kind) ||
          left.pathHash.localeCompare(right.pathHash) ||
          left.pattern.localeCompare(right.pattern),
      )
      .map((entry) => `${entry.name}|${entry.kind}|${entry.pathHash}|${entry.pattern}`)
      .join(";"),
  );
}
function buildRuntimeCacheContextRecord(params) {
  return {
    agentId: normalizeText(params.agentId),
    commandHash: hashText(normalizeText(params.qmdCommand)),
    environmentHash: normalizeText(params.qmdEnvironmentHash ?? ""),
    indexPathHash: normalizePathIdentity(params.qmdIndexPath),
    qmdVersion: normalizeText(params.qmdVersion ?? ""),
    searchMode: params.searchMode,
    sourceSet: sortedUnique(params.sources),
  };
}
function buildCollectionValidationCacheContextInput(params) {
  return JSON.stringify({
    ...buildRuntimeCacheContextRecord(params),
    collectionConfigHash: buildCollectionConfigHash(params.collections),
  });
}
function buildMultiCollectionProbeCacheContextInput(params) {
  return JSON.stringify(buildRuntimeCacheContextRecord(params));
}
function buildQmdCollectionValidationCacheContextHash(params) {
  return hashText(buildCollectionValidationCacheContextInput(params));
}
function buildQmdMultiCollectionProbeCacheContextHash(params) {
  return hashText(buildMultiCollectionProbeCacheContextInput(params));
}
function collectionValidationStore() {
  return openMemoryCoreStateStore({
    namespace: QMD_RUNTIME_CACHE_COLLECTION_VALIDATION_NAMESPACE,
    maxEntries: QMD_RUNTIME_CACHE_COLLECTION_VALIDATION_MAX_ENTRIES,
  });
}
function multiCollectionProbeStore() {
  return openMemoryCoreStateStore({
    namespace: QMD_RUNTIME_CACHE_MULTI_COLLECTION_PROBE_NAMESPACE,
    maxEntries: QMD_RUNTIME_CACHE_MULTI_COLLECTION_PROBE_MAX_ENTRIES,
  });
}
function collectionValidationEntryKey(params) {
  return memoryCoreWorkspaceEntryKey(
    params.workspaceDir,
    `qmd-runtime-cache.collection-validation:${buildQmdCollectionValidationCacheContextHash(params)}`,
  );
}
function multiCollectionProbeEntryKey(params) {
  return memoryCoreWorkspaceEntryKey(
    params.workspaceDir,
    `qmd-runtime-cache.multi-collection-probe:${buildQmdMultiCollectionProbeCacheContextHash(params)}`,
  );
}
/** Validates the shared cache-entry envelope: version, expiry window, and key hash. */
function normalizeCacheEntryEnvelope(value, nowMs, expectedKeyHash) {
  if (typeof value !== "object" || value === null) return;
  const record = value;
  if (record.version !== QMD_RUNTIME_CACHE_ENTRY_VERSION) return;
  const createdAtMs =
    typeof record.createdAtMs === "number" ? Math.max(0, Math.floor(record.createdAtMs)) : NaN;
  const expiresAtMs =
    typeof record.expiresAtMs === "number" ? Math.max(0, Math.floor(record.expiresAtMs)) : NaN;
  if (
    !Number.isFinite(createdAtMs) ||
    !Number.isFinite(expiresAtMs) ||
    !Number.isFinite(nowMs) ||
    nowMs >= expiresAtMs
  )
    return;
  const keyHash = normalizeText(typeof record.keyHash === "string" ? record.keyHash : "");
  if (keyHash !== expectedKeyHash) return;
  return {
    record,
    createdAtMs,
    expiresAtMs,
    keyHash,
  };
}
function normalizeCollectionValidationEntry(value, nowMs, expectedKeyHash) {
  const envelope = normalizeCacheEntryEnvelope(value, nowMs, expectedKeyHash);
  if (!envelope) return;
  const { record, createdAtMs, expiresAtMs, keyHash } = envelope;
  const validation = record.validation;
  if (typeof validation !== "object" || validation === null) return;
  const validationRecord = validation;
  if (validationRecord.ok !== true) return;
  if (typeof validationRecord.collectionConfigHash !== "string") return;
  if (typeof validationRecord.collectionCount !== "number") return;
  return {
    version: QMD_RUNTIME_CACHE_ENTRY_VERSION,
    createdAtMs,
    expiresAtMs,
    keyHash,
    validation: {
      ok: true,
      collectionConfigHash: normalizeText(validationRecord.collectionConfigHash),
      collectionCount: Math.max(0, Math.floor(validationRecord.collectionCount)),
    },
  };
}
function normalizeMultiCollectionProbeEntry(value, nowMs, expectedKeyHash) {
  const envelope = normalizeCacheEntryEnvelope(value, nowMs, expectedKeyHash);
  if (!envelope) return;
  const { record, createdAtMs, expiresAtMs, keyHash } = envelope;
  const probe = record.multiCollectionProbe;
  if (typeof probe !== "object" || probe === null) return;
  const probeRecord = probe;
  if (typeof probeRecord.supported !== "boolean") return;
  return {
    version: QMD_RUNTIME_CACHE_ENTRY_VERSION,
    createdAtMs,
    expiresAtMs,
    keyHash,
    multiCollectionProbe: { supported: probeRecord.supported },
  };
}
async function readQmdCollectionValidationCache(params, nowMs = Date.now()) {
  try {
    const store = collectionValidationStore();
    const key = collectionValidationEntryKey(params);
    const expectedKeyHash = buildQmdCollectionValidationCacheContextHash(params);
    const raw = await store.lookup(key);
    if (!raw) return { state: "miss" };
    const validated = normalizeCollectionValidationEntry(raw, nowMs, expectedKeyHash);
    return validated
      ? {
          state: "hit",
          value: validated,
        }
      : { state: "miss" };
  } catch {
    return { state: "miss" };
  }
}
async function writeQmdCollectionValidationCache(params, nowMs = Date.now()) {
  try {
    const key = collectionValidationEntryKey(params);
    const keyHash = buildQmdCollectionValidationCacheContextHash(params);
    const collectionConfigHash = buildCollectionConfigHash(params.collections);
    const createdAtMs = Math.max(0, Math.floor(nowMs));
    const ttlMs = QMD_RUNTIME_CACHE_COLLECTION_VALIDATION_TTL_MS;
    await collectionValidationStore().register(
      key,
      {
        version: QMD_RUNTIME_CACHE_ENTRY_VERSION,
        createdAtMs,
        expiresAtMs: createdAtMs + ttlMs,
        keyHash,
        validation: {
          ok: true,
          collectionConfigHash,
          collectionCount: params.collections.length,
        },
      },
      { ttlMs },
    );
    return true;
  } catch {
    return false;
  }
}
async function readQmdMultiCollectionProbeCache(params, nowMs = Date.now()) {
  try {
    const store = multiCollectionProbeStore();
    const key = multiCollectionProbeEntryKey(params);
    const expectedKeyHash = buildQmdMultiCollectionProbeCacheContextHash(params);
    const raw = await store.lookup(key);
    if (!raw) return { state: "miss" };
    const validated = normalizeMultiCollectionProbeEntry(raw, nowMs, expectedKeyHash);
    return validated
      ? {
          state: "hit",
          value: validated,
        }
      : { state: "miss" };
  } catch {
    return { state: "miss" };
  }
}
async function writeQmdMultiCollectionProbeCache(params, supported, nowMs = Date.now()) {
  try {
    const key = multiCollectionProbeEntryKey(params);
    const keyHash = buildQmdMultiCollectionProbeCacheContextHash(params);
    const createdAtMs = Math.max(0, Math.floor(nowMs));
    const ttlMs = QMD_RUNTIME_CACHE_MULTI_COLLECTION_PROBE_TTL_MS;
    await multiCollectionProbeStore().register(
      key,
      {
        version: QMD_RUNTIME_CACHE_ENTRY_VERSION,
        createdAtMs,
        expiresAtMs: createdAtMs + ttlMs,
        keyHash,
        multiCollectionProbe: { supported },
      },
      { ttlMs },
    );
    return true;
  } catch {
    return false;
  }
}
async function clearQmdMultiCollectionProbeCache(params) {
  try {
    await multiCollectionProbeStore().delete(multiCollectionProbeEntryKey(params));
  } catch {}
}
//#endregion
//#region extensions/memory-core/src/memory/qmd-manager.ts
const log = createSubsystemLogger("memory");
/**
 * Normalize an already-aborted search signal into the error thrown before any
 * qmd work starts. Prefers the caller-supplied abort reason (so a deadline
 * message such as "memory_search timed out after 15s" survives) and falls back
 * to a stable abort error.
 */
function asAbortError(signal) {
  const reason = signal.reason;
  if (reason instanceof Error) return reason;
  if (typeof reason === "string" && reason.length > 0) return new Error(reason);
  return /* @__PURE__ */ new Error("qmd search aborted");
}
const SNIPPET_HEADER_RE = /@@\s*-([0-9]+),([0-9]+)/;
const SEARCH_PENDING_UPDATE_WAIT_MS = 500;
const MAX_QMD_OUTPUT_CHARS = 2e5;
const NUL_MARKER_RE = /(?:\^@|\\0|\\x00|\\u0000|null\s*byte|nul\s*byte)/i;
const QMD_EMBED_BACKOFF_BASE_MS = 6e4;
const QMD_EMBED_BACKOFF_MAX_MS = 3600 * 1e3;
const QMD_EMBED_LOCK_MIN_WAIT_MS = 900 * 1e3;
const QMD_WRITE_LOCK_MIN_WAIT_MS = 300 * 1e3;
const QMD_EMBED_LOCK_RETRY_TEMPLATE = {
  factor: 1.2,
  minTimeout: 250,
  maxTimeout: 1e4,
  randomize: true,
};
const QMD_INDEX_CONFIG_FILE = "index.yml";
const MCPORTER_STATE_KEY = Symbol.for("openclaw.mcporterState");
const QMD_EMBED_QUEUE_KEY = Symbol.for("openclaw.qmdEmbedQueueTail");
const QMD_UPDATE_QUEUE_KEY = Symbol.for("openclaw.qmdUpdateQueueState");
const IGNORED_MEMORY_WATCH_DIR_NAMES = /* @__PURE__ */ new Set([
  ".git",
  ".cache",
  "node_modules",
  "vendor",
  "dist",
  "build",
  ".pnpm-store",
  ".venv",
  "venv",
  ".tox",
  "__pycache__",
]);
function qmdUsesVectors(searchMode) {
  return searchMode !== "search";
}
function isDefaultMemoryPath(relPath) {
  const normalized = relPath.trim().replace(/^\.\//, "").replace(/\\/g, "/");
  if (!normalized) return false;
  if (normalized === "MEMORY.md" || normalized === "DREAMS.md" || normalized === "dreams.md")
    return true;
  return normalized.startsWith("memory/");
}
function buildQmdProcessPath(rawPath) {
  const nodeBinDir = path.dirname(process.execPath);
  const entries = rawPath?.split(path.delimiter).filter(Boolean) ?? [];
  if (entries.includes(nodeBinDir)) return rawPath ?? nodeBinDir;
  return [...entries, nodeBinDir].join(path.delimiter);
}
function normalizePositiveInteger(value, fallback) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(1, Math.floor(value))
    : fallback;
}
function getMcporterState() {
  return resolveGlobalSingleton(MCPORTER_STATE_KEY, () => ({
    coldStartWarned: false,
    daemonStart: null,
  }));
}
function getQmdEmbedQueueState() {
  return resolveGlobalSingleton(QMD_EMBED_QUEUE_KEY, () => ({ tail: Promise.resolve() }));
}
function getQmdUpdateQueueState() {
  return resolveGlobalSingleton(QMD_UPDATE_QUEUE_KEY, () => ({ tails: /* @__PURE__ */ new Map() }));
}
function normalizeHanBm25Query(query) {
  return query.trim();
}
function parseQmdStatusVectorCount(raw) {
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^\s*Vectors(?:\s*[:=]\s*|\s+)(\d+)\b/i);
    if (match?.[1]) {
      const count = Number.parseInt(match[1], 10);
      if (Number.isFinite(count)) return count;
    }
  }
  return null;
}
function resolveStableJitterMs(params) {
  if (params.windowMs <= 0) return 0;
  return (
    crypto.createHash("sha256").update(params.seed).digest().readUInt32BE(0) %
    (Math.floor(params.windowMs) + 1)
  );
}
function resolveQmdWriteLockOptions(expectedMs, minWaitMs) {
  const expected = Math.max(1, expectedMs);
  const waitBudgetMs = Math.max(minWaitMs, expected * 6);
  return {
    retries: {
      retries: Math.max(60, Math.ceil(waitBudgetMs / QMD_EMBED_LOCK_RETRY_TEMPLATE.maxTimeout)),
      ...QMD_EMBED_LOCK_RETRY_TEMPLATE,
    },
    stale: Math.max(minWaitMs, expected * 2),
  };
}
function resolveQmdMcporterSearchProcessTimeoutMs(timeoutMs) {
  return Math.max(addTimerTimeoutGraceMs(timeoutMs, 2e3) ?? 1, 5e3);
}
function resolveQmdEmbedLockOptions(embedTimeoutMs) {
  return resolveQmdWriteLockOptions(embedTimeoutMs, QMD_EMBED_LOCK_MIN_WAIT_MS);
}
function resolveQmdStoreWriteLockOptions(updateTimeoutMs, embedTimeoutMs) {
  return resolveQmdWriteLockOptions(
    Math.max(updateTimeoutMs, embedTimeoutMs),
    QMD_WRITE_LOCK_MIN_WAIT_MS,
  );
}
function hasIgnoredMemoryWatchSegment(relativePath) {
  return relativePath
    .split(path.sep)
    .map((segment) => normalizeLowercaseStringOrEmpty(segment))
    .filter(Boolean)
    .some((segment) => IGNORED_MEMORY_WATCH_DIR_NAMES.has(segment));
}
function shouldIgnoreMemoryWatchPath(watchPath, roots) {
  const normalized = path.normalize(watchPath);
  let matchedRelative = null;
  let matchedRootLength = -1;
  for (const watchRoot of roots) {
    const normalizedRoot = path.normalize(watchRoot);
    const relative = path.relative(normalizedRoot, normalized);
    if (relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative)) {
      if (normalizedRoot.length > matchedRootLength) {
        matchedRelative = relative;
        matchedRootLength = normalizedRoot.length;
      }
    }
  }
  if (matchedRelative !== null) {
    if (matchedRelative === "") return false;
    return hasIgnoredMemoryWatchSegment(matchedRelative);
  }
  return hasIgnoredMemoryWatchSegment(normalized);
}
async function runInQmdCommandPhase(report, task) {
  report?.("pause");
  try {
    return await task();
  } finally {
    report?.("resume");
  }
}
var QmdMemoryManager = class QmdMemoryManager {
  static async create(params) {
    const resolved = params.resolved.qmd;
    if (!resolved) return null;
    const runtimeConfig =
      params.runtimeConfig ?? resolveQmdManagerRuntimeConfig(params.cfg, params.agentId);
    const manager = new QmdMemoryManager({
      agentId: params.agentId,
      resolved,
      runtimeConfig,
    });
    await manager.initialize(params.mode ?? "full");
    return manager;
  }
  constructor(params) {
    this.collectionRoots = /* @__PURE__ */ new Map();
    this.sources = /* @__PURE__ */ new Set();
    this.docPathCache = /* @__PURE__ */ new Map();
    this.exportedSessionState = /* @__PURE__ */ new Map();
    this.maxQmdOutputChars = MAX_QMD_OUTPUT_CHARS;
    this.updateTimer = null;
    this.embedTimer = null;
    this.watcher = null;
    this.watchTimer = null;
    this.pendingWatchPaths = /* @__PURE__ */ new Map();
    this.watchPressureWarning = { shown: false };
    this.pendingUpdate = null;
    this.queuedForcedUpdate = null;
    this.queuedForcedRuns = 0;
    this.dirty = false;
    this.closed = false;
    this.mode = "full";
    this.qmdRuntimeIdentityPromise = null;
    this.db = null;
    this.lastUpdateAt = null;
    this.lastEmbedAt = null;
    this.embedBackoffUntil = null;
    this.embedFailureCount = 0;
    this.vectorAvailable = null;
    this.vectorStatusDetail = null;
    this.attemptedNullByteCollectionRepair = false;
    this.attemptedDuplicateDocumentRepair = false;
    this.sessionWarm = /* @__PURE__ */ new Set();
    this.collectionPatternFlag = "--mask";
    this.multiCollectionFilterSupported = null;
    this.qmdMcpToolVersion = null;
    this.agentId = params.agentId;
    this.qmd = params.resolved;
    this.workspaceDir = params.runtimeConfig.workspaceDir;
    this.contextLimits = params.runtimeConfig.contextLimits;
    this.stateDir = resolveStateDir(process.env, os.homedir);
    this.agentStateDir = path.join(this.stateDir, "agents", this.agentId);
    this.qmdDir = path.join(this.agentStateDir, "qmd");
    this.syncSettings = params.runtimeConfig.syncSettings;
    this.xdgConfigHome = path.join(this.qmdDir, "xdg-config");
    this.xdgCacheHome = path.join(this.qmdDir, "xdg-cache");
    this.indexPath = path.join(this.xdgCacheHome, "qmd", "index.sqlite");
    this.env = {
      ...process.env,
      PATH: buildQmdProcessPath(process.env.PATH),
      XDG_CONFIG_HOME: this.xdgConfigHome,
      QMD_CONFIG_DIR: path.join(this.xdgConfigHome, "qmd"),
      XDG_CACHE_HOME: this.xdgCacheHome,
      NO_COLOR: "1",
    };
    this.closeSignal = new Promise((resolve) => {
      this.resolveCloseSignal = resolve;
    });
    this.sessionExporter = this.qmd.sessions.enabled
      ? {
          dir: this.qmd.sessions.exportDir ?? path.join(this.qmdDir, "sessions"),
          retentionMs: this.qmd.sessions.retentionDays
            ? this.qmd.sessions.retentionDays * 24 * 60 * 60 * 1e3
            : void 0,
          collectionName: this.pickSessionCollectionName(),
        }
      : null;
    if (this.sessionExporter)
      this.qmd.collections = [
        ...this.qmd.collections,
        {
          name: this.sessionExporter.collectionName,
          path: this.sessionExporter.dir,
          pattern: "**/*.md",
          kind: "sessions",
        },
      ];
    this.managedCollectionNames = this.computeManagedCollectionNames();
  }
  async initialize(mode) {
    this.mode = mode;
    const startTime = Date.now();
    this.bootstrapCollections();
    if (mode === "status") return;
    await fs$1.mkdir(this.xdgConfigHome, { recursive: true });
    await fs$1.mkdir(this.xdgCacheHome, { recursive: true });
    await fs$1.mkdir(path.dirname(this.indexPath), { recursive: true });
    if (this.sessionExporter) await fs$1.mkdir(this.sessionExporter.dir, { recursive: true });
    await this.symlinkSharedModels();
    await this.ensureCollections();
    if (mode === "cli") {
      if (this.qmd.update.onBoot && this.qmd.update.waitForBootSync)
        await this.runUpdate("boot:cli", true).catch((err) => {
          log.warn(`qmd cli boot update failed: ${String(err)}`);
        });
      log.info(
        `qmd manager initialized for agent "${this.agentId}" mode=cli collections=${this.qmd.collections.length} durationMs=${Date.now() - startTime}`,
      );
      return;
    }
    this.ensureWatcher();
    log.info(
      `qmd manager initialized for agent "${this.agentId}" mode=full collections=${this.qmd.collections.length} durationMs=${Date.now() - startTime}`,
    );
    if (this.qmd.update.onBoot) {
      const bootRun = this.runUpdate("boot", true);
      if (this.qmd.update.waitForBootSync)
        await bootRun.catch((err) => {
          log.warn(`qmd boot update failed: ${String(err)}`);
        });
      else
        bootRun.catch((err) => {
          log.warn(`qmd boot update failed: ${String(err)}`);
        });
    }
    if (this.qmd.update.intervalMs > 0)
      this.updateTimer = setInterval(() => {
        this.runUpdate("interval").catch((err) => {
          log.warn(`qmd update failed (${String(err)})`);
        });
      }, this.qmd.update.intervalMs);
    if (this.shouldScheduleEmbedTimer()) {
      const startPeriodicEmbedTimer = () => {
        this.embedTimer = setInterval(() => {
          this.runUpdate("embed-interval").catch((err) => {
            log.warn(`qmd embed interval update failed (${String(err)})`);
          });
        }, this.qmd.update.embedIntervalMs);
      };
      const initialDelayMs = this.resolveEmbedStartupJitterMs();
      if (initialDelayMs > 0)
        this.embedTimer = setTimeout(() => {
          this.embedTimer = null;
          if (this.closed) return;
          this.runUpdate("embed-interval")
            .catch((err) => {
              log.warn(`qmd embed interval update failed (${String(err)})`);
            })
            .finally(() => {
              if (!this.closed) startPeriodicEmbedTimer();
            });
        }, initialDelayMs);
      else startPeriodicEmbedTimer();
    }
  }
  bootstrapCollections() {
    this.collectionRoots.clear();
    this.sources.clear();
    for (const collection of this.qmd.collections) {
      const kind = collection.kind === "sessions" ? "sessions" : "memory";
      this.collectionRoots.set(collection.name, {
        path: collection.path,
        kind,
      });
      this.sources.add(kind);
    }
  }
  qmdRuntimeCacheSources() {
    return [...this.sources].toSorted();
  }
  qmdRuntimeCacheCollections() {
    return this.qmd.collections.map((collection) => ({
      name: collection.name,
      kind: collection.kind,
      path: collection.path,
      pattern: collection.pattern,
    }));
  }
  buildQmdRuntimeEnvironmentHash() {
    const relevantEnv = Object.fromEntries(
      Object.keys(this.env)
        .filter(
          (key) =>
            key === "PATH" ||
            key === "HOME" ||
            key === "LOCALAPPDATA" ||
            key === "XDG_CONFIG_HOME" ||
            key === "XDG_CACHE_HOME" ||
            key === "QMD_CONFIG_DIR" ||
            key.startsWith("QMD_"),
        )
        .toSorted()
        .map((key) => [key, this.env[key] ?? ""]),
    );
    return crypto.createHash("sha256").update(JSON.stringify(relevantEnv)).digest("hex");
  }
  async buildQmdCollectionValidationCacheContext() {
    return {
      workspaceDir: this.workspaceDir,
      agentId: this.agentId,
      qmdCommand: this.qmd.command,
      qmdVersion: await this.resolveQmdRuntimeIdentity(),
      qmdEnvironmentHash: this.buildQmdRuntimeEnvironmentHash(),
      qmdIndexPath: this.indexPath,
      searchMode: this.qmd.searchMode,
      collections: this.qmdRuntimeCacheCollections(),
      sources: this.qmdRuntimeCacheSources(),
    };
  }
  async buildQmdMultiCollectionProbeCacheContext() {
    return {
      workspaceDir: this.workspaceDir,
      agentId: this.agentId,
      qmdCommand: this.qmd.command,
      qmdVersion: await this.resolveQmdRuntimeIdentity(),
      qmdEnvironmentHash: this.buildQmdRuntimeEnvironmentHash(),
      qmdIndexPath: this.indexPath,
      searchMode: this.qmd.searchMode,
      sources: this.qmdRuntimeCacheSources(),
    };
  }
  resolveQmdRuntimeIdentity() {
    this.qmdRuntimeIdentityPromise ??= this.readQmdRuntimeIdentity();
    return this.qmdRuntimeIdentityPromise;
  }
  async readQmdRuntimeIdentity() {
    const commandIdentity = `command:${this.qmd.command}`;
    try {
      const result = await this.runQmd(["--version"], {
        timeoutMs: Math.min(this.qmd.limits.timeoutMs, 2e3),
      });
      const versionText = `${result.stdout}\n${result.stderr}`.trim();
      return versionText ? `${commandIdentity};version:${versionText}` : commandIdentity;
    } catch {
      return commandIdentity;
    }
  }
  recordSearchPlanDebug(params) {
    const sources = uniqueValues(
      params.collectionNames
        .map((collectionName) => this.collectionRoots.get(collectionName)?.kind)
        .filter((source) => Boolean(source)),
    );
    params.debugContext.searchPlan = {
      command: params.command,
      collectionCount: params.collectionNames.length,
      groupCount: params.collectionGroups.length,
      sources,
    };
  }
  beginQmdSearchRuntimeDebug() {
    const debugContext = {};
    if (this.pendingCollectionValidationDebug) {
      debugContext.collectionValidation = this.pendingCollectionValidationDebug;
      this.pendingCollectionValidationDebug = void 0;
    }
    return debugContext;
  }
  consumeQmdRuntimeDebug(debugContext) {
    const debug = {};
    if (debugContext.collectionValidation)
      debug.collectionValidation = debugContext.collectionValidation;
    if (debugContext.multiCollectionProbe)
      debug.multiCollectionProbe = debugContext.multiCollectionProbe;
    if (debugContext.searchPlan) debug.searchPlan = debugContext.searchPlan;
    return Object.keys(debug).length > 0 ? debug : void 0;
  }
  async ensureCollectionPathsBestEffort() {
    for (const collection of this.qmd.collections)
      try {
        await this.ensureCollectionPath(collection);
      } catch (err) {
        log.warn(
          `qmd collection path prepare failed for ${collection.name}: ${formatErrorMessage(err)}`,
        );
      }
  }
  async ensureCollections(options) {
    const startedAt = Date.now();
    const cacheContext = await this.buildQmdCollectionValidationCacheContext();
    if (!options?.force) {
      const cached = await readQmdCollectionValidationCache(cacheContext);
      if (cached.state === "hit") {
        await this.ensureCollectionPathsBestEffort();
        const debug = {
          cacheState: "hit",
          elapsedMs: Math.max(0, Date.now() - startedAt),
          collectionCount: cached.value.validation.collectionCount,
          listCalls: 0,
          showCalls: 0,
        };
        if (options?.debugContext) options.debugContext.collectionValidation = debug;
        else this.pendingCollectionValidationDebug = debug;
        return;
      }
    }
    const stats = {
      listCalls: 0,
      showCalls: 0,
    };
    let validationComplete = true;
    const existing = await this.listCollectionsBestEffort(stats);
    await this.migrateLegacyUnscopedCollections(existing);
    for (const collection of this.qmd.collections) {
      const listed = existing.get(collection.name);
      if (listed && !this.shouldRebindCollection(collection, listed)) continue;
      if (listed)
        try {
          await this.removeCollection(collection.name);
        } catch (err) {
          const message = formatErrorMessage(err);
          if (!this.isCollectionMissingError(message)) {
            validationComplete = false;
            log.warn(`qmd collection remove failed for ${collection.name}: ${message}`);
          }
        }
      try {
        await this.ensureCollectionPath(collection);
        await this.addCollection(collection.path, collection.name, collection.pattern);
        existing.set(collection.name, {
          path: collection.path,
          pattern: collection.pattern,
        });
      } catch (err) {
        const message = formatErrorMessage(err);
        if (this.isCollectionAlreadyExistsError(message)) {
          if (
            (await this.tryRebindSameNameCollection({
              collection,
              addErrorMessage: message,
            })) ||
            (await this.tryRebindConflictingCollection({
              collection,
              existing,
              addErrorMessage: message,
            }))
          )
            existing.set(collection.name, {
              path: collection.path,
              pattern: collection.pattern,
            });
          else {
            validationComplete = false;
            log.warn(`qmd collection add skipped for ${collection.name}: ${message}`);
          }
          continue;
        }
        validationComplete = false;
        log.warn(`qmd collection add failed for ${collection.name}: ${message}`);
      }
    }
    const wroteCache = validationComplete
      ? await writeQmdCollectionValidationCache(cacheContext)
      : false;
    const debug = {
      cacheState: validationComplete
        ? options?.force
          ? "bypass-force"
          : wroteCache
            ? "write"
            : "error"
        : "error",
      elapsedMs: Math.max(0, Date.now() - startedAt),
      collectionCount: this.qmd.collections.length,
      listCalls: stats.listCalls,
      showCalls: stats.showCalls,
    };
    if (options?.debugContext) options.debugContext.collectionValidation = debug;
    else this.pendingCollectionValidationDebug = debug;
  }
  async tryRebindSameNameCollection(params) {
    const { collection, addErrorMessage } = params;
    if (!this.isSameNameCollectionAlreadyExistsError(collection.name, addErrorMessage))
      return false;
    log.warn(
      `qmd collection add conflict for ${collection.name}: collection name already exists; recreating managed collection`,
    );
    try {
      await this.removeCollection(collection.name);
    } catch (removeErr) {
      const removeMessage = formatErrorMessage(removeErr);
      if (!this.isCollectionMissingError(removeMessage)) {
        log.warn(`qmd collection remove failed for ${collection.name}: ${removeMessage}`);
        return false;
      }
    }
    try {
      await this.ensureCollectionPath(collection);
      await this.addCollection(collection.path, collection.name, collection.pattern);
      return true;
    } catch (retryErr) {
      const retryMessage = formatErrorMessage(retryErr);
      log.warn(
        `qmd collection add failed for ${collection.name} after recreating same-name collection: ${retryMessage} (initial: ${addErrorMessage})`,
      );
      return false;
    }
  }
  isSameNameCollectionAlreadyExistsError(name, message) {
    const lowerName = normalizeLowercaseStringOrEmpty(name);
    const lowerMessage = normalizeLowercaseStringOrEmpty(message);
    return (
      lowerMessage.includes(`collection '${lowerName}' already exists`) ||
      lowerMessage.includes(`collection "${lowerName}" already exists`)
    );
  }
  async listCollectionsBestEffort(stats) {
    const existing = /* @__PURE__ */ new Map();
    try {
      if (stats) stats.listCalls += 1;
      const result = await this.runQmd(["collection", "list", "--json"], {
        timeoutMs: this.qmd.update.commandTimeoutMs,
      });
      const parsed = this.parseListedCollections(result.stdout);
      for (const [name, details] of parsed) existing.set(name, details);
    } catch {}
    for (const collection of this.qmd.collections) {
      const entry = existing.get(collection.name);
      if (!entry || entry.path) continue;
      try {
        if (stats) stats.showCalls += 1;
        const showResult = await this.runQmd(["collection", "show", collection.name], {
          timeoutMs: this.qmd.update.commandTimeoutMs,
        });
        const shown = this.parseShownCollection(showResult.stdout);
        if (shown.path) entry.path = shown.path;
        if (shown.pattern && !entry.pattern) entry.pattern = shown.pattern;
      } catch {}
    }
    return existing;
  }
  findCollectionByPathPattern(collection, listed) {
    for (const [name, details] of listed) {
      if (!details.path || typeof details.pattern !== "string") continue;
      if (!this.pathsMatch(details.path, collection.path)) continue;
      if (
        !this.patternsMatchForManagedCollection(
          collection.path,
          details.pattern,
          collection.pattern,
        )
      )
        continue;
      return name;
    }
    return null;
  }
  parseConflictingCollectionNameFromAddError(message) {
    if (
      !normalizeLowercaseStringOrEmpty(message).includes(
        "a collection already exists for this path and pattern",
      )
    )
      return null;
    return /^\s*Name:\s*([a-z0-9._-]+)\s*\(qmd:\/\/[^)\s]+\/?\)\s*$/im.exec(message)?.[1] ?? null;
  }
  async tryRebindConflictingCollection(params) {
    const { collection, existing, addErrorMessage } = params;
    let conflictName = this.findCollectionByPathPattern(collection, existing);
    if (!conflictName) {
      const refreshed = await this.listCollectionsBestEffort();
      existing.clear();
      for (const [name, details] of refreshed) existing.set(name, details);
      conflictName = this.findCollectionByPathPattern(collection, existing);
    }
    if (!conflictName) {
      const parsedConflictName = this.parseConflictingCollectionNameFromAddError(addErrorMessage);
      if (parsedConflictName)
        log.warn(
          `qmd collection add conflict for ${collection.name}: qmd reported existing collection ${parsedConflictName}, but list output did not include verifiable path/pattern metadata; refusing automatic rebind. If ${parsedConflictName} is stale, remove it manually with 'qmd collection remove ${parsedConflictName}'`,
        );
      return false;
    }
    if (conflictName === collection.name) {
      existing.set(collection.name, {
        path: collection.path,
        pattern: collection.pattern,
      });
      return true;
    }
    log.warn(
      `qmd collection add conflict for ${collection.name}: path+pattern already bound by ${conflictName}; rebinding`,
    );
    try {
      await this.removeCollection(conflictName);
      existing.delete(conflictName);
    } catch (removeErr) {
      const removeMessage = formatErrorMessage(removeErr);
      if (!this.isCollectionMissingError(removeMessage))
        log.warn(`qmd collection remove failed for ${conflictName}: ${removeMessage}`);
      return false;
    }
    try {
      await this.addCollection(collection.path, collection.name, collection.pattern);
      existing.set(collection.name, {
        path: collection.path,
        pattern: collection.pattern,
      });
      return true;
    } catch (retryErr) {
      const retryMessage = formatErrorMessage(retryErr);
      log.warn(
        `qmd collection add failed for ${collection.name} after rebinding ${conflictName}: ${retryMessage} (initial: ${addErrorMessage})`,
      );
      return false;
    }
  }
  async migrateLegacyUnscopedCollections(existing) {
    for (const collection of this.qmd.collections) {
      if (existing.has(collection.name)) continue;
      const legacyName = this.deriveLegacyCollectionName(collection.name);
      if (!legacyName) continue;
      const listedLegacy = existing.get(legacyName);
      if (!listedLegacy) continue;
      if (!this.canMigrateLegacyCollection(collection, listedLegacy)) {
        log.debug(
          `qmd legacy collection migration skipped for ${legacyName} (path/pattern mismatch)`,
        );
        continue;
      }
      try {
        await this.removeCollection(legacyName);
        existing.delete(legacyName);
      } catch (err) {
        const message = formatErrorMessage(err);
        if (!this.isCollectionMissingError(message))
          log.warn(`qmd collection remove failed for ${legacyName}: ${message}`);
      }
    }
  }
  deriveLegacyCollectionName(scopedName) {
    const agentSuffix = `-${this.sanitizeCollectionNameSegment(this.agentId)}`;
    if (!scopedName.endsWith(agentSuffix)) return null;
    return scopedName.slice(0, -agentSuffix.length).trim() || null;
  }
  canMigrateLegacyCollection(collection, listedLegacy) {
    if (listedLegacy.path && !this.pathsMatch(listedLegacy.path, collection.path)) return false;
    if (
      typeof listedLegacy.pattern === "string" &&
      !this.patternsMatchForManagedCollection(
        collection.path,
        listedLegacy.pattern,
        collection.pattern,
      )
    )
      return false;
    return true;
  }
  async ensureCollectionPath(collection) {
    if (!this.isDirectoryGlobPattern(collection.pattern)) return;
    await fs$1.mkdir(collection.path, { recursive: true });
  }
  isDirectoryGlobPattern(pattern) {
    return pattern.includes("*") || pattern.includes("?") || pattern.includes("[");
  }
  isCollectionAlreadyExistsError(message) {
    const lower = normalizeLowercaseStringOrEmpty(message);
    return lower.includes("already exists") || lower.includes("exists");
  }
  isCollectionMissingError(message) {
    const lower = normalizeLowercaseStringOrEmpty(message);
    return (
      lower.includes("not found") || lower.includes("does not exist") || lower.includes("missing")
    );
  }
  isMissingCollectionSearchError(err) {
    const message = formatErrorMessage(err);
    return (
      this.isCollectionMissingError(message) &&
      normalizeLowercaseStringOrEmpty(message).includes("collection")
    );
  }
  async tryRepairMissingCollectionSearch(err, debugContext) {
    if (!this.isMissingCollectionSearchError(err)) return false;
    log.warn(
      "qmd search failed because a managed collection is missing; repairing collections and retrying once",
    );
    await this.ensureCollections({
      force: true,
      debugContext,
    });
    return true;
  }
  async addCollection(pathArg, name, pattern) {
    const candidateFlags = resolveQmdCollectionPatternFlags(this.collectionPatternFlag);
    let lastError;
    for (const flag of candidateFlags)
      try {
        await this.runQmd(["collection", "add", pathArg, "--name", name, flag, pattern], {
          timeoutMs: this.qmd.update.commandTimeoutMs,
        });
        this.collectionPatternFlag = flag;
        return;
      } catch (err) {
        lastError = err;
        if (!this.isUnsupportedQmdOptionError(err) || candidateFlags.at(-1) === flag) throw err;
        log.warn(`qmd collection add rejected ${flag}; retrying with legacy compatibility flag`);
      }
    throw lastError instanceof Error ? lastError : new Error(String(lastError));
  }
  async removeCollection(name) {
    await this.runQmd(["collection", "remove", name], {
      timeoutMs: this.qmd.update.commandTimeoutMs,
    });
  }
  parseListedCollections(output) {
    const listed = /* @__PURE__ */ new Map();
    const trimmed = output.trim();
    if (!trimmed) return listed;
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        for (const entry of parsed) {
          if (typeof entry === "string") {
            listed.set(entry, {});
            continue;
          }
          if (!entry || typeof entry !== "object") continue;
          const name = entry.name;
          if (typeof name !== "string") continue;
          const listedPath = entry.path;
          const listedPattern = entry.pattern;
          const listedMask = entry.mask;
          listed.set(name, {
            path: typeof listedPath === "string" ? listedPath : void 0,
            pattern:
              typeof listedPattern === "string"
                ? listedPattern
                : typeof listedMask === "string"
                  ? listedMask
                  : void 0,
          });
        }
        return listed;
      }
    } catch {}
    let currentName = null;
    for (const rawLine of output.split(/\r?\n/)) {
      const line = rawLine.trimEnd();
      if (!line.trim()) {
        currentName = null;
        continue;
      }
      const collectionLine = /^\s*([a-z0-9._-]+)\s+\(qmd:\/\/[^)]+\)\s*$/i.exec(line);
      if (collectionLine) {
        currentName = collectionLine[1] ?? null;
        if (currentName === null) continue;
        if (!listed.has(currentName)) listed.set(currentName, {});
        continue;
      }
      if (/^\s*collections\b/i.test(line)) continue;
      const bareNameLine = /^\s*([a-z0-9._-]+)\s*$/i.exec(line);
      if (bareNameLine && !line.includes(":")) {
        currentName = bareNameLine[1] ?? null;
        if (currentName === null) continue;
        if (!listed.has(currentName)) listed.set(currentName, {});
        continue;
      }
      if (!currentName) continue;
      const patternLine = /^\s*(?:pattern|mask)\s*:\s*(.+?)\s*$/i.exec(line);
      if (patternLine) {
        const pattern = patternLine[1];
        if (pattern === void 0) continue;
        const existing = listed.get(currentName) ?? {};
        existing.pattern = pattern.trim();
        listed.set(currentName, existing);
        continue;
      }
      const pathLine = /^\s*path\s*:\s*(.+?)\s*$/i.exec(line);
      if (pathLine) {
        const listedPath = pathLine[1];
        if (listedPath === void 0) continue;
        const existing = listed.get(currentName) ?? {};
        existing.path = listedPath.trim();
        listed.set(currentName, existing);
      }
    }
    return listed;
  }
  parseShownCollection(output) {
    const result = {};
    for (const rawLine of output.split(/\r?\n/)) {
      const pathMatch = /^\s*Path\s*:\s*(.+?)\s*$/.exec(rawLine);
      if (pathMatch) {
        const shownPath = pathMatch[1];
        if (shownPath !== void 0) result.path = shownPath.trim();
        continue;
      }
      const patternMatch = /^\s*Pattern\s*:\s*(.+?)\s*$/.exec(rawLine);
      if (patternMatch) {
        const shownPattern = patternMatch[1];
        if (shownPattern !== void 0) result.pattern = shownPattern.trim();
      }
    }
    return result;
  }
  shouldRebindCollection(collection, listed) {
    if (!listed.path) {
      if (typeof listed.pattern === "string" && listed.pattern !== collection.pattern) return true;
      return false;
    }
    if (!this.pathsMatch(listed.path, collection.path)) return true;
    if (
      typeof listed.pattern === "string" &&
      !this.patternsMatchForManagedCollection(collection.path, listed.pattern, collection.pattern)
    )
      return true;
    return false;
  }
  patternsMatchForManagedCollection(collectionPath, leftPattern, rightPattern) {
    if (leftPattern === rightPattern) return true;
    return this.isEquivalentDefaultMemoryRootPattern(collectionPath, leftPattern, rightPattern);
  }
  isEquivalentDefaultMemoryRootPattern(collectionPath, leftPattern, rightPattern) {
    if (
      !this.isDefaultMemoryRootPattern(leftPattern) ||
      !this.isDefaultMemoryRootPattern(rightPattern)
    )
      return false;
    try {
      for (const entry of fs.readdirSync(collectionPath, { withFileTypes: true })) {
        if (entry.isSymbolicLink() || !entry.isFile()) continue;
        if (entry.name === "MEMORY.md") return true;
      }
      return false;
    } catch {
      return false;
    }
  }
  isDefaultMemoryRootPattern(pattern) {
    return pattern === "MEMORY.md";
  }
  pathsMatch(left, right) {
    const normalize = (value) => {
      const resolved = path.isAbsolute(value)
        ? path.resolve(value)
        : path.resolve(this.workspaceDir, value);
      const normalized = path.normalize(resolved);
      return process.platform === "win32"
        ? normalizeLowercaseStringOrEmpty(normalized)
        : normalized;
    };
    return normalize(left) === normalize(right);
  }
  resolveQmdIndexConfigPath() {
    return path.join(this.xdgConfigHome, "qmd", QMD_INDEX_CONFIG_FILE);
  }
  async refreshManagedCollectionIndexConfig() {
    const configPath = this.resolveQmdIndexConfigPath();
    await fs$1.mkdir(path.dirname(configPath), { recursive: true });
    await fs$1.writeFile(configPath, this.renderManagedCollectionIndexConfig(), "utf8");
  }
  renderManagedCollectionIndexConfig() {
    if (this.qmd.collections.length === 0) return "collections: {}\n";
    const lines = ["collections:"];
    for (const collection of this.qmd.collections)
      lines.push(
        `  ${this.quoteYamlString(collection.name)}:`,
        `    path: ${this.quoteYamlString(collection.path)}`,
        `    pattern: ${this.quoteYamlString(collection.pattern)}`,
      );
    return `${lines.join("\n")}\n`;
  }
  quoteYamlString(value) {
    return JSON.stringify(value);
  }
  shouldRepairNullByteCollectionError(err) {
    const message = formatErrorMessage(err);
    const lower = normalizeLowercaseStringOrEmpty(message);
    return (
      (lower.includes("enotdir") ||
        lower.includes("not a directory") ||
        lower.includes("enoent") ||
        lower.includes("no such file")) &&
      NUL_MARKER_RE.test(message)
    );
  }
  shouldRepairDuplicateDocumentConstraint(err) {
    const lower = normalizeLowercaseStringOrEmpty(formatErrorMessage(err));
    return (
      lower.includes("unique constraint failed") &&
      lower.includes("documents.collection") &&
      lower.includes("documents.path")
    );
  }
  async rebuildManagedCollectionsForRepair(reason) {
    try {
      await this.refreshManagedCollectionIndexConfig();
    } catch (configErr) {
      log.warn(
        `qmd managed collection index refresh failed for update repair (${reason}): ${formatErrorMessage(configErr)}`,
      );
    }
    for (const collection of this.qmd.collections) {
      try {
        await this.removeCollection(collection.name);
      } catch (removeErr) {
        const removeMessage = formatErrorMessage(removeErr);
        if (!this.isCollectionMissingError(removeMessage))
          log.warn(`qmd collection remove failed for ${collection.name}: ${removeMessage}`);
      }
      try {
        await this.addCollection(collection.path, collection.name, collection.pattern);
      } catch (addErr) {
        const addMessage = formatErrorMessage(addErr);
        if (!this.isCollectionAlreadyExistsError(addMessage))
          log.warn(`qmd collection add failed for ${collection.name}: ${addMessage}`);
      }
    }
    log.warn(`qmd managed collections rebuilt for update repair (${reason})`);
  }
  async tryRepairNullByteCollections(err, reason) {
    if (this.attemptedNullByteCollectionRepair) return false;
    if (!this.shouldRepairNullByteCollectionError(err)) return false;
    this.attemptedNullByteCollectionRepair = true;
    log.warn(
      `qmd update failed with suspected null-byte collection metadata (${reason}); rebuilding managed collections and retrying once`,
    );
    await this.rebuildManagedCollectionsForRepair(`null-byte metadata (${reason})`);
    return true;
  }
  async tryRepairDuplicateDocumentConstraint(err, reason) {
    if (this.attemptedDuplicateDocumentRepair) return false;
    if (!this.shouldRepairDuplicateDocumentConstraint(err)) return false;
    this.attemptedDuplicateDocumentRepair = true;
    log.warn(
      `qmd update failed with duplicate document constraint (${reason}); rebuilding managed collections and retrying once`,
    );
    await this.rebuildManagedCollectionsForRepair(`duplicate-document constraint (${reason})`);
    return true;
  }
  async search(query, opts) {
    if (!this.isScopeAllowed(opts?.sessionKey)) {
      this.logScopeDenied(opts?.sessionKey);
      return [];
    }
    const searchSignal = opts?.signal;
    const reportCommandPhase = opts?.[MEMORY_SEARCH_DEADLINE_CONTROL];
    if (searchSignal?.aborted) throw asAbortError(searchSignal);
    const debugContext = this.beginQmdSearchRuntimeDebug();
    const trimmed = query.trim();
    if (!trimmed) return [];
    await this.maybeWarmSession(opts?.sessionKey);
    await this.maybeSyncDirtySearchState();
    await this.waitForPendingUpdateBeforeSearch();
    const resultLimit = Math.min(
      this.qmd.limits.maxResults,
      opts?.maxResults ?? this.qmd.limits.maxResults,
    );
    const requestedSources = opts?.sources?.length ? uniqueValues(opts.sources) : void 0;
    const collectionNames = this.listManagedCollectionNames(requestedSources);
    const limit = resultLimit;
    if (collectionNames.length === 0) {
      log.warn("qmd query skipped: no managed collections configured");
      return [];
    }
    const qmdSearchCommand = opts?.qmdSearchModeOverride ?? this.qmd.searchMode;
    let effectiveSearchMode = qmdSearchCommand;
    let searchFallbackReason;
    const explicitSearchTool = this.qmd.searchTool;
    const mcporterEnabled = this.qmd.mcporter.enabled;
    const runSearchAttempt = async (allowMissingCollectionRepair) => {
      let attemptedCombinedCollectionFilter = false;
      try {
        if (mcporterEnabled) {
          const minScore = opts?.minScore ?? 0;
          if (explicitSearchTool) {
            if (collectionNames.length > 1)
              return await this.runMcporterAcrossCollections({
                tool: explicitSearchTool,
                searchCommand: qmdSearchCommand,
                explicitToolOverride: true,
                query: trimmed,
                limit,
                minScore,
                collectionNames,
                signal: searchSignal,
                reportCommandPhase,
              });
            return await this.runQmdSearchViaMcporter({
              mcporter: this.qmd.mcporter,
              tool: explicitSearchTool,
              searchCommand: qmdSearchCommand,
              explicitToolOverride: true,
              query: trimmed,
              limit,
              minScore,
              collection: collectionNames[0],
              timeoutMs: this.qmd.limits.timeoutMs,
              signal: searchSignal,
              reportCommandPhase,
            });
          }
          const tool = this.resolveQmdMcpTool(qmdSearchCommand);
          if (collectionNames.length > 1)
            return await this.runMcporterAcrossCollections({
              tool,
              searchCommand: qmdSearchCommand,
              explicitToolOverride: false,
              query: trimmed,
              limit,
              minScore,
              collectionNames,
              signal: searchSignal,
              reportCommandPhase,
            });
          return await this.runQmdSearchViaMcporter({
            mcporter: this.qmd.mcporter,
            tool,
            searchCommand: qmdSearchCommand,
            explicitToolOverride: false,
            query: trimmed,
            limit,
            minScore,
            collection: collectionNames[0],
            timeoutMs: this.qmd.limits.timeoutMs,
            signal: searchSignal,
            reportCommandPhase,
          });
        }
        const collectionGroups = await this.resolveCollectionSearchGroups(
          collectionNames,
          searchSignal,
          debugContext,
        );
        this.recordSearchPlanDebug({
          debugContext,
          command: qmdSearchCommand,
          collectionNames,
          collectionGroups,
        });
        attemptedCombinedCollectionFilter = collectionGroups.some((group) => group.length > 1);
        if (collectionGroups.length > 1)
          return await this.runQueryAcrossCollectionGroups(
            trimmed,
            limit,
            collectionGroups,
            qmdSearchCommand,
            searchSignal,
            reportCommandPhase,
          );
        const args = this.buildSearchArgs(qmdSearchCommand, trimmed, limit);
        args.push(...this.buildCollectionFilterArgs(collectionGroups[0] ?? collectionNames));
        return await this.runQmdSearch(args, qmdSearchCommand, searchSignal, reportCommandPhase);
      } catch (err) {
        if (allowMissingCollectionRepair && this.isMissingCollectionSearchError(err)) throw err;
        if (
          !mcporterEnabled &&
          qmdSearchCommand !== "query" &&
          this.isUnsupportedQmdOptionError(err)
        ) {
          if (attemptedCombinedCollectionFilter)
            await this.markQmdMultiCollectionFiltersUnsupported(debugContext);
          effectiveSearchMode = "query";
          searchFallbackReason = "unsupported-search-flags";
          log.warn(
            `qmd ${qmdSearchCommand} does not support configured flags; retrying search with qmd query`,
          );
          try {
            const collectionGroups = await this.resolveCollectionSearchGroups(
              collectionNames,
              searchSignal,
              debugContext,
            );
            this.recordSearchPlanDebug({
              debugContext,
              command: "query",
              collectionNames,
              collectionGroups,
            });
            if (collectionGroups.length > 1)
              return await this.runQueryAcrossCollectionGroups(
                trimmed,
                limit,
                collectionGroups,
                "query",
                searchSignal,
                reportCommandPhase,
              );
            const fallbackArgs = this.buildSearchArgs("query", trimmed, limit);
            fallbackArgs.push(
              ...this.buildCollectionFilterArgs(collectionGroups[0] ?? collectionNames),
            );
            return await this.runQmdSearch(fallbackArgs, "query", searchSignal, reportCommandPhase);
          } catch (fallbackErr) {
            log.warn(`qmd query fallback failed: ${String(fallbackErr)}`);
            throw fallbackErr instanceof Error ? fallbackErr : new Error(String(fallbackErr));
          }
        }
        const label = mcporterEnabled ? "mcporter/qmd" : `qmd ${qmdSearchCommand}`;
        log.warn(`${label} failed: ${String(err)}`);
        throw err instanceof Error ? err : new Error(String(err));
      }
    };
    let parsed;
    try {
      parsed = await runSearchAttempt(true);
    } catch (err) {
      if (!(await this.tryRepairMissingCollectionSearch(err, debugContext)))
        throw err instanceof Error ? err : new Error(String(err));
      parsed = await runSearchAttempt(false);
    }
    const results = [];
    for (const entry of parsed) {
      const docHints = this.normalizeDocHints({
        preferredCollection: entry.collection,
        preferredFile: entry.file,
      });
      const doc = await this.resolveDocLocation(entry.docid, docHints);
      if (!doc) continue;
      const snippet = truncateUtf16Safe(entry.snippet ?? "", this.qmd.limits.maxSnippetChars);
      const lines = this.resolveSnippetLines(entry, snippet);
      const score = typeof entry.score === "number" ? entry.score : 0;
      if (score < (opts?.minScore ?? 0)) continue;
      const result = {
        path: doc.rel,
        startLine: lines.startLine,
        endLine: lines.endLine,
        score,
        snippet,
        source: doc.source,
      };
      const artifactIdentity =
        doc.source === "sessions"
          ? resolveQmdSessionArtifactIdentity({
              artifactPath: doc.collectionRelativePath,
              collection: doc.collection,
              docid: entry.docid?.trim() || void 0,
              indexPath: this.indexPath,
              searchPath: doc.rel,
            })
          : null;
      results.push(
        artifactIdentity ? attachQmdSessionArtifactHit(result, artifactIdentity) : result,
      );
    }
    opts?.onDebug?.({
      backend: "qmd",
      configuredMode: qmdSearchCommand,
      effectiveMode: effectiveSearchMode,
      fallback: searchFallbackReason,
      qmd: this.consumeQmdRuntimeDebug(debugContext),
    });
    let ranked = results;
    if (opts?.sources?.length) {
      const allow = new Set(opts.sources);
      ranked = results.filter((r) => allow.has(r.source));
    }
    return this.clampResultsByInjectedChars(this.diversifyResultsBySource(ranked, resultLimit));
  }
  async sync(params) {
    if (
      params?.sessions?.some((session) => session.sessionId.trim().length > 0) ||
      params?.archiveFiles?.some((sessionFile) => sessionFile.trim().length > 0)
    )
      log.debug("qmd sync ignoring targeted session hint; running regular update");
    if (params?.progress)
      params.progress({
        completed: 0,
        total: 1,
        label: "Updating QMD index…",
      });
    await this.runUpdate(params?.reason ?? "manual", params?.force);
    if (params?.progress)
      params.progress({
        completed: 1,
        total: 1,
        label: "QMD index updated",
      });
  }
  async readFile(params) {
    const relPath = params.relPath?.trim();
    if (!relPath) throw new Error("path required");
    const absPath = this.resolveReadPath(relPath);
    if (!absPath.endsWith(".md")) throw new Error("path required");
    let statResult;
    try {
      statResult = await statRegularFile(absPath);
    } catch (err) {
      if (err instanceof Error && err.message === "path must be a regular file")
        throw new Error("path required", { cause: err });
      throw err;
    }
    if (statResult.missing)
      return {
        text: "",
        path: relPath,
      };
    const contextLimits = this.contextLimits;
    if (params.from !== void 0 || params.lines !== void 0) {
      const startLine = normalizePositiveInteger(params.from, 1);
      const requestedCount = normalizePositiveInteger(
        params.lines ?? contextLimits?.memoryGetDefaultLines ?? 120,
        120,
      );
      const partial = await this.readPartialText(absPath, startLine, requestedCount);
      if (partial.missing)
        return {
          text: "",
          path: relPath,
        };
      return buildMemoryReadResultFromSlice({
        selectedLines: partial.selectedLines,
        relPath,
        startLine,
        moreSourceLinesRemain: partial.moreSourceLinesRemain,
        maxChars: contextLimits?.memoryGetMaxChars,
        suggestReadFallback: isDefaultMemoryPath(relPath),
      });
    }
    const full = await this.readFullText(absPath);
    if (full.missing)
      return {
        text: "",
        path: relPath,
      };
    return buildMemoryReadResult({
      content: full.text,
      relPath,
      from: params.from,
      lines: params.lines,
      defaultLines: contextLimits?.memoryGetDefaultLines ?? 120,
      maxChars: contextLimits?.memoryGetMaxChars,
      suggestReadFallback: isDefaultMemoryPath(relPath),
    });
  }
  status() {
    const counts = this.readCounts();
    return {
      backend: "qmd",
      provider: "qmd",
      model: "qmd",
      requestedProvider: "qmd",
      files: counts.totalDocuments,
      chunks: counts.totalDocuments,
      dirty: this.dirty,
      workspaceDir: this.workspaceDir,
      dbPath: this.indexPath,
      sources: Array.from(this.sources),
      sourceCounts: counts.sourceCounts,
      vector: {
        enabled: qmdUsesVectors(this.qmd.searchMode),
        available: this.vectorAvailable ?? void 0,
        semanticAvailable: this.vectorAvailable ?? void 0,
        loadError: this.vectorStatusDetail ?? void 0,
      },
      batch: {
        enabled: false,
        failures: 0,
        limit: 0,
        wait: false,
        concurrency: 0,
        pollIntervalMs: 0,
        timeoutMs: 0,
      },
      custom: {
        qmd: {
          collections: this.qmd.collections.length,
          lastUpdateAt: this.lastUpdateAt,
          embedFailures: this.embedFailureCount,
          embedBackoffUntil: this.embedBackoffUntil,
        },
      },
    };
  }
  async probeEmbeddingAvailability() {
    if (!qmdUsesVectors(this.qmd.searchMode))
      return {
        ok: true,
        checked: false,
      };
    const ok = await this.probeVectorAvailability();
    return {
      ok,
      error: ok ? void 0 : (this.vectorStatusDetail ?? "QMD semantic vectors are unavailable"),
    };
  }
  async probeVectorAvailability() {
    if (!qmdUsesVectors(this.qmd.searchMode)) {
      this.vectorAvailable = false;
      this.vectorStatusDetail = null;
      return false;
    }
    try {
      const timeoutMs = this.qmd.limits.timeoutMs;
      const result = await this.runQmd(["status"], { timeoutMs });
      const vectorCount = parseQmdStatusVectorCount(`${result.stdout}\n${result.stderr}`);
      if (vectorCount === null) {
        this.vectorAvailable = false;
        this.vectorStatusDetail = "Could not determine QMD vector status from `qmd status`";
        return false;
      }
      this.vectorAvailable = vectorCount > 0;
      this.vectorStatusDetail =
        vectorCount > 0
          ? null
          : "QMD index has 0 vectors; semantic search is unavailable until embeddings finish";
      return this.vectorAvailable;
    } catch (err) {
      const message = formatErrorMessage(err);
      this.vectorAvailable = false;
      this.vectorStatusDetail = `QMD status probe failed: ${message}`;
      return false;
    }
  }
  async close() {
    if (this.closed) return;
    this.closed = true;
    this.resolveCloseSignal();
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
    if (this.embedTimer) {
      clearTimeout(this.embedTimer);
      this.embedTimer = null;
    }
    if (this.watchTimer) {
      clearTimeout(this.watchTimer);
      this.watchTimer = null;
    }
    if (this.watcher) {
      await this.watcher.close().catch(() => void 0);
      this.watcher = null;
    }
    this.queuedForcedRuns = 0;
    await this.pendingUpdate?.catch(() => void 0);
    await this.queuedForcedUpdate?.catch(() => void 0);
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
  async runUpdate(reason, force, opts) {
    if (this.closed) return;
    if (this.pendingUpdate) {
      if (force) return this.enqueueForcedUpdate(reason);
      return this.pendingUpdate;
    }
    if (this.queuedForcedUpdate && !opts?.fromForcedQueue) {
      if (force) return this.enqueueForcedUpdate(reason);
      return this.queuedForcedUpdate;
    }
    if (this.shouldSkipUpdate(force)) return;
    const run = async () => {
      const startTime = Date.now();
      log.debug(
        `qmd sync started for agent "${this.agentId}" reason=${reason} force=${force === true}`,
      );
      await this.withQmdUpdateQueue(async () => {
        if (this.closed) return;
        if (this.sessionExporter) await this.exportSessions();
        await this.runQmdUpdateWithRetry(reason);
        if (this.sessionExporter) this.refreshSessionArtifactDocIds();
        this.dirty = false;
      });
      if (this.closed) return;
      if (this.shouldRunEmbed(force))
        try {
          await this.withQmdEmbedQueue(() =>
            this.withQmdGlobalEmbedLock(() =>
              this.withQmdStoreWriteLock(async () => {
                await this.runQmd(["embed"], {
                  timeoutMs: this.qmd.update.embedTimeoutMs,
                  discardOutput: true,
                });
              }),
            ),
          );
          this.lastEmbedAt = Date.now();
          this.embedBackoffUntil = null;
          this.embedFailureCount = 0;
        } catch (err) {
          this.noteEmbedFailure(reason, err);
        }
      if (this.closed) return;
      this.lastUpdateAt = Date.now();
      this.docPathCache.clear();
      log.info(
        `qmd sync completed for agent "${this.agentId}" reason=${reason} durationMs=${Date.now() - startTime}`,
      );
    };
    this.pendingUpdate = run().finally(() => {
      this.pendingUpdate = null;
    });
    await this.pendingUpdate;
  }
  ensureWatcher() {
    if (!this.syncSettings?.watch || this.watcher || this.closed) return;
    const watchPaths = /* @__PURE__ */ new Set();
    const watchRoots = /* @__PURE__ */ new Set();
    for (const collection of this.qmd.collections) {
      if (collection.kind === "sessions") continue;
      watchRoots.add(path.normalize(collection.path));
      watchPaths.add(this.resolveCollectionWatchPath(collection));
    }
    if (watchPaths.size === 0) return;
    const watchPathList = Array.from(watchPaths);
    const startTime = Date.now();
    log.info(`qmd watcher starting for agent "${this.agentId}" paths=${watchPathList.length}`);
    const watchRootList = Array.from(watchRoots);
    const watcher = chokidar.watch(watchPathList, {
      ignoreInitial: true,
      ignored: (watchPath) => shouldIgnoreMemoryWatchPath(watchPath, watchRootList),
    });
    this.watcher = watcher;
    const markDirty = (watchPath, stats) => {
      recordMemoryWatchEventPath(this.pendingWatchPaths, watchPath, stats);
      this.dirty = true;
      this.scheduleWatchSync();
    };
    watcher.on("add", markDirty);
    watcher.on("change", markDirty);
    watcher.on("unlink", markDirty);
    watcher.once("ready", () => {
      this.warnIfWatchPressure(countChokidarWatchedEntries(watcher));
      log.info(
        `qmd watcher ready for agent "${this.agentId}" paths=${watchPathList.length} durationMs=${Date.now() - startTime}`,
      );
    });
  }
  warnIfWatchPressure(count) {
    warnIfMemoryWatchPressureHigh(
      this.watchPressureWarning,
      count,
      "paths",
      "Large QMD collections can make OpenClaw run out of file watchers or open files.",
      "Remove large collections, or set memorySearch.sync.watch to false and refresh memory manually or with sync.intervalMinutes.",
      (message) => log.warn(message),
    );
  }
  resolveCollectionWatchPath(collection) {
    return path.join(path.normalize(collection.path), collection.pattern);
  }
  scheduleWatchSync() {
    if (!this.syncSettings?.watch) return;
    if (this.watchTimer) clearTimeout(this.watchTimer);
    this.watchTimer = setTimeout(() => {
      this.watchTimer = null;
      (async () => {
        if (this.closed) return;
        if (!(await settleMemoryWatchEventPaths(this.pendingWatchPaths))) {
          if (!this.closed) this.scheduleWatchSync();
          return;
        }
        if (this.closed) return;
        await this.sync({ reason: "watch" });
      })().catch((err) => {
        log.warn(`qmd watch sync failed: ${String(err)}`);
      });
    }, this.syncSettings.watchDebounceMs);
  }
  async maybeWarmSession(sessionKey) {
    if (this.mode === "cli") return;
    if (!this.syncSettings?.onSessionStart) return;
    const key = sessionKey?.trim() || "";
    if (!key || this.sessionWarm.has(key)) return;
    this.sessionWarm.add(key);
    this.sync({ reason: "session-start" }).catch((err) => {
      log.warn(`qmd session-start sync failed: ${String(err)}`);
    });
  }
  async maybeSyncDirtySearchState() {
    if (this.mode === "cli") return;
    if (!this.syncSettings?.onSearch || !this.dirty) return;
    await this.sync({ reason: "search" });
  }
  async runQmdUpdateWithRetry(reason) {
    const maxAttempts = reason === "boot" || reason.startsWith("boot:") ? 3 : 1;
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1)
      try {
        await this.runQmdUpdateOnce(reason);
        return;
      } catch (err) {
        if (attempt >= maxAttempts || !this.isRetryableUpdateError(err)) throw err;
        const delayMs = 500 * 2 ** (attempt - 1);
        log.warn(
          `qmd update retry ${attempt}/${maxAttempts - 1} after failure (${reason}): ${String(err)}`,
        );
        await new Promise((resolve) => {
          setTimeout(resolve, delayMs);
        });
      }
  }
  async runQmdUpdateOnce(reason) {
    try {
      await this.runQmd(["update"], {
        timeoutMs: this.qmd.update.updateTimeoutMs,
        discardOutput: true,
      });
    } catch (err) {
      if (
        !(await this.tryRepairNullByteCollections(err, reason)) &&
        !(await this.tryRepairDuplicateDocumentConstraint(err, reason))
      )
        throw err;
      await this.runQmd(["update"], {
        timeoutMs: this.qmd.update.updateTimeoutMs,
        discardOutput: true,
      });
    }
  }
  isRetryableUpdateError(err) {
    if (this.isSqliteBusyError(err)) return true;
    return normalizeLowercaseStringOrEmpty(formatErrorMessage(err)).includes("timed out");
  }
  shouldRunEmbed(force) {
    if (!qmdUsesVectors(this.qmd.searchMode)) return false;
    const now = Date.now();
    if (this.embedBackoffUntil !== null && isFutureDateTimestampMs(this.embedBackoffUntil))
      return false;
    const embedIntervalMs = this.qmd.update.embedIntervalMs;
    return (
      Boolean(force) ||
      this.lastEmbedAt === null ||
      (embedIntervalMs > 0 && now - this.lastEmbedAt > embedIntervalMs)
    );
  }
  shouldScheduleEmbedTimer() {
    if (!qmdUsesVectors(this.qmd.searchMode)) return false;
    const embedIntervalMs = this.qmd.update.embedIntervalMs;
    if (embedIntervalMs <= 0) return false;
    const updateIntervalMs = this.qmd.update.intervalMs;
    return updateIntervalMs <= 0 || updateIntervalMs > embedIntervalMs;
  }
  resolveEmbedStartupJitterMs() {
    const windowMs = this.qmd.update.embedIntervalMs;
    if (windowMs <= 0) return 0;
    const customCollections = this.qmd.collections
      .filter((collection) => collection.kind === "custom")
      .map((collection) => `${collection.path}\u0000${collection.pattern}`)
      .toSorted()
      .join("");
    if (!customCollections) return 0;
    return resolveStableJitterMs({
      seed: `${this.agentId}:${customCollections}`,
      windowMs,
    });
  }
  async withQmdEmbedQueue(task) {
    const queue = getQmdEmbedQueueState();
    const previous = queue.tail;
    let releaseCurrent;
    const current = new Promise((resolve) => {
      releaseCurrent = resolve;
    });
    queue.tail = previous.then(
      () => current,
      () => current,
    );
    await previous.catch(() => void 0);
    try {
      return await task();
    } finally {
      releaseCurrent();
    }
  }
  async withQmdGlobalEmbedLock(task) {
    return await withFileLock(
      path.join(this.stateDir, "qmd", "embed.lock"),
      resolveQmdEmbedLockOptions(this.qmd.update.embedTimeoutMs),
      task,
    );
  }
  async withQmdStoreWriteLock(task) {
    return await withFileLock(
      path.join(this.agentStateDir, "qmd-write.lock"),
      resolveQmdStoreWriteLockOptions(
        this.qmd.update.updateTimeoutMs,
        this.qmd.update.embedTimeoutMs,
      ),
      task,
    );
  }
  async withQmdUpdateQueue(task) {
    const queue = getQmdUpdateQueueState();
    const key = this.qmdDir;
    const previous = queue.tails.get(key) ?? Promise.resolve();
    let releaseCurrent;
    const current = new Promise((resolve) => {
      releaseCurrent = resolve;
    });
    const next = previous.then(
      () => current,
      () => current,
    );
    queue.tails.set(key, next);
    try {
      if (
        (await Promise.race([
          previous.then(
            () => "ready",
            () => "ready",
          ),
          this.closeSignal.then(() => "closed"),
        ])) === "closed"
      )
        return;
      return await this.withQmdStoreWriteLock(task);
    } finally {
      releaseCurrent();
      next.finally(() => {
        if (queue.tails.get(key) === next) queue.tails.delete(key);
      });
    }
  }
  noteEmbedFailure(reason, err) {
    this.embedFailureCount += 1;
    const delayMs = Math.min(
      QMD_EMBED_BACKOFF_MAX_MS,
      QMD_EMBED_BACKOFF_BASE_MS * 2 ** Math.max(0, this.embedFailureCount - 1),
    );
    this.embedBackoffUntil = resolveExpiresAtMsFromDurationMs(delayMs) ?? null;
    log.warn(
      `qmd embed failed (${reason}): ${String(err)}; backing off for ${Math.ceil(delayMs / 1e3)}s`,
    );
  }
  enqueueForcedUpdate(reason) {
    this.queuedForcedRuns += 1;
    if (!this.queuedForcedUpdate)
      this.queuedForcedUpdate = this.drainForcedUpdates(reason).finally(() => {
        this.queuedForcedUpdate = null;
      });
    return this.queuedForcedUpdate;
  }
  async drainForcedUpdates(reason) {
    await this.pendingUpdate?.catch(() => void 0);
    while (!this.closed && this.queuedForcedRuns > 0) {
      this.queuedForcedRuns -= 1;
      await this.runUpdate(`${reason}:queued`, true, { fromForcedQueue: true });
    }
  }
  /**
   * Symlink the default QMD models directory into our custom XDG_CACHE_HOME so
   * that the pre-installed ML models (~/.cache/qmd/models/) are reused rather
   * than re-downloaded for every agent.  If the default models directory does
   * not exist, or a models directory/symlink already exists in the target, this
   * is a no-op.
   */
  async symlinkSharedModels() {
    const defaultCacheHome =
      process.env.XDG_CACHE_HOME ||
      (process.platform === "win32" ? process.env.LOCALAPPDATA : void 0) ||
      path.join(os.homedir(), ".cache");
    const defaultModelsDir = path.join(defaultCacheHome, "qmd", "models");
    const targetModelsDir = path.join(this.xdgCacheHome, "qmd", "models");
    try {
      if (
        !(
          await fs$1.stat(defaultModelsDir).catch((err) => {
            if (err.code === "ENOENT") return null;
            throw err;
          })
        )?.isDirectory()
      )
        return;
      try {
        await fs$1.lstat(targetModelsDir);
        return;
      } catch {}
      try {
        await fs$1.symlink(defaultModelsDir, targetModelsDir, "dir");
      } catch (symlinkErr) {
        const code = symlinkErr.code;
        if (process.platform === "win32" && (code === "EPERM" || code === "ENOTSUP"))
          await fs$1.symlink(defaultModelsDir, targetModelsDir, "junction");
        else throw symlinkErr;
      }
      log.debug(`symlinked qmd models: ${defaultModelsDir} → ${targetModelsDir}`);
    } catch (err) {
      log.warn(`failed to symlink qmd models directory: ${String(err)}`);
    }
  }
  async runQmd(args, opts) {
    return await runCliCommand({
      commandSummary: `qmd ${args.join(" ")}`,
      spawnInvocation: resolveCliSpawnInvocation({
        command: this.qmd.command,
        args,
        env: this.env,
        packageName: "qmd",
      }),
      env: this.env,
      cwd: this.workspaceDir,
      timeoutMs: opts?.timeoutMs,
      maxOutputChars: this.maxQmdOutputChars,
      discardStdout: opts?.discardOutput,
      signal: opts?.signal,
    });
  }
  async runQmdSearch(args, command, signal, reportCommandPhase) {
    try {
      const result = await runInQmdCommandPhase(reportCommandPhase, async () =>
        this.runQmd(args, {
          timeoutMs: this.qmd.limits.timeoutMs,
          signal,
        }),
      );
      return parseQmdQueryJson(result.stdout, result.stderr);
    } catch (err) {
      const recovered = this.parseFailedQmdSearchJson(err, command);
      if (recovered) return recovered;
      throw err instanceof Error ? err : new Error(String(err));
    }
  }
  parseFailedQmdSearchJson(err, command) {
    if (
      !isQmdCliCommandError(err) ||
      this.isMissingCollectionSearchError(err) ||
      this.isUnsupportedQmdOptionError(err) ||
      this.isSqliteBusyError(err) ||
      !isQmdNativeAbortAfterOutput(err)
    )
      return null;
    try {
      const parsed = parseQmdQueryJson(err.stdout, err.stderr);
      log.warn(
        `qmd ${command} exited non-zero after producing valid JSON; using captured search results (${formatQmdSearchExit(err)})`,
      );
      return parsed;
    } catch {
      return null;
    }
  }
  resolveQmdMcpTool(searchCommand) {
    if (this.qmdMcpToolVersion === "v2") return "query";
    if (this.qmdMcpToolVersion === "v1")
      return searchCommand === "search"
        ? "search"
        : searchCommand === "vsearch"
          ? "vector_search"
          : "deep_search";
    return "query";
  }
  markQmdV1Fallback() {
    if (this.qmdMcpToolVersion !== "v1") {
      this.qmdMcpToolVersion = "v1";
      log.warn(
        "QMD MCP server does not expose the v2 'query' tool; falling back to v1 tool names (search/vector_search/deep_search).",
      );
    }
  }
  markQmdV2() {
    this.qmdMcpToolVersion = "v2";
  }
  /**
   * Build the `searches` array for QMD 1.1+ `query` tool, respecting
   * the configured searchMode so lexical-only or vector-only modes
   * don't trigger unnecessary LLM/embedding work.
   */
  buildV2Searches(query, searchCommand) {
    const semanticQuery = normalizeQmdSemanticQuery(query);
    switch (searchCommand) {
      case "search":
        return [
          {
            type: "lex",
            query,
          },
        ];
      case "vsearch":
        return [
          {
            type: "vec",
            query: semanticQuery,
          },
        ];
      default:
        return [
          {
            type: "lex",
            query,
          },
          {
            type: "vec",
            query: semanticQuery,
          },
          {
            type: "hyde",
            query: semanticQuery,
          },
        ];
    }
  }
  isQueryToolNotFoundError(err) {
    const detail = formatErrorMessage(err).match(/ failed \(code \d+\): ([\s\S]*)$/)?.[1];
    if (!detail) return false;
    return /(?:^|\n|:\s)(?:MCP error [^:\n]+:\s*)?Tool ['"]?query['"]? not found\b/i.test(detail);
  }
  async ensureMcporterDaemonStarted(mcporter) {
    if (!mcporter.enabled) return;
    const state = getMcporterState();
    if (!mcporter.startDaemon) {
      if (!state.coldStartWarned) {
        state.coldStartWarned = true;
        log.warn(
          "mcporter qmd bridge enabled but startDaemon=false; each query may cold-start QMD MCP. Consider setting memory.qmd.mcporter.startDaemon=true to keep it warm.",
        );
      }
      return;
    }
    if (!state.daemonStart)
      state.daemonStart = (async () => {
        try {
          await this.runMcporter(["daemon", "start"], { timeoutMs: 1e4 });
        } catch (err) {
          log.warn(`mcporter daemon start failed: ${String(err)}`);
          state.daemonStart = null;
        }
      })();
    await state.daemonStart;
  }
  async runMcporter(args, opts) {
    const spawnInvocation = resolveCliSpawnInvocation({
      command: "mcporter",
      args,
      env: this.env,
      packageName: "mcporter",
    });
    return await runCliCommand({
      commandSummary: `${spawnInvocation.command} ${spawnInvocation.argv.join(" ")}`,
      spawnInvocation,
      env: this.env,
      cwd: this.workspaceDir,
      timeoutMs: opts?.timeoutMs,
      maxOutputChars: this.maxQmdOutputChars,
      signal: opts?.signal,
    });
  }
  async runQmdSearchViaMcporter(params) {
    if (params.signal?.aborted) throw asAbortError(params.signal);
    await this.ensureMcporterDaemonStarted(params.mcporter);
    const effectiveTool =
      params.tool === "query" && this.qmdMcpToolVersion === "v1"
        ? this.resolveQmdMcpTool(params.searchCommand ?? "query")
        : params.tool;
    const selector = `${params.mcporter.serverName}.${effectiveTool}`;
    const useUnifiedQueryTool = effectiveTool === "query";
    const callArgs = useUnifiedQueryTool
      ? {
          searches: this.buildV2Searches(params.query, params.searchCommand),
          limit: params.limit,
          ...(params.searchCommand === "search" || params.searchCommand === "vsearch"
            ? { rerank: false }
            : {}),
        }
      : {
          query: params.query,
          limit: params.limit,
          minScore: params.minScore,
        };
    if (params.collection)
      if (useUnifiedQueryTool) callArgs.collections = [params.collection];
      else callArgs.collection = params.collection;
    if (
      useUnifiedQueryTool &&
      params.searchCommand === "query" &&
      this.qmd.searchMode === "query" &&
      this.qmd.rerank === false
    )
      callArgs.rerank = false;
    let result;
    try {
      result = await runInQmdCommandPhase(params.reportCommandPhase, async () =>
        this.runMcporter(
          [
            "call",
            selector,
            "--args",
            JSON.stringify(callArgs),
            "--output",
            "json",
            "--timeout",
            String(Math.max(0, params.timeoutMs)),
          ],
          {
            timeoutMs: resolveQmdMcporterSearchProcessTimeoutMs(params.timeoutMs),
            signal: params.signal,
          },
        ),
      );
      if (useUnifiedQueryTool && this.qmdMcpToolVersion === null) this.markQmdV2();
    } catch (err) {
      if (useUnifiedQueryTool && this.isQueryToolNotFoundError(err)) {
        this.markQmdV1Fallback();
        const v1Tool = this.resolveQmdMcpTool(params.searchCommand ?? "query");
        return this.runQmdSearchViaMcporter({
          mcporter: params.mcporter,
          tool: v1Tool,
          searchCommand: params.searchCommand,
          explicitToolOverride: false,
          query: params.query,
          limit: params.limit,
          minScore: params.minScore,
          collection: params.collection,
          timeoutMs: params.timeoutMs,
          signal: params.signal,
          reportCommandPhase: params.reportCommandPhase,
        });
      }
      throw err;
    }
    let parsedUnknown;
    try {
      parsedUnknown = JSON.parse(result.stdout);
    } catch {
      throw new Error("qmd mcporter returned non-JSON stdout", {
        cause: /* @__PURE__ */ new Error("mcporter stdout was not valid JSON"),
      });
    }
    const parsedRecord = asNullableRecord(parsedUnknown);
    const structured =
      (parsedRecord ? asNullableRecord(parsedRecord.structuredContent) : null) ?? parsedUnknown;
    const structuredRecord = asNullableRecord(structured);
    const results =
      structuredRecord && Array.isArray(structuredRecord.results)
        ? structuredRecord.results
        : Array.isArray(structured)
          ? structured
          : [];
    const out = [];
    for (const item of results) {
      const itemRecord = asNullableRecord(item);
      if (!itemRecord) continue;
      const docidRaw = itemRecord.docid;
      const docid = typeof docidRaw === "string" ? docidRaw.replace(/^#/, "").trim() : "";
      if (!docid) continue;
      const scoreRaw = itemRecord.score;
      const score = typeof scoreRaw === "number" ? scoreRaw : Number(scoreRaw);
      const snippet = typeof itemRecord.snippet === "string" ? itemRecord.snippet : "";
      out.push({
        docid,
        score: Number.isFinite(score) ? score : 0,
        snippet,
        collection: typeof itemRecord.collection === "string" ? itemRecord.collection : void 0,
        file: typeof itemRecord.file === "string" ? itemRecord.file : void 0,
        body: typeof itemRecord.body === "string" ? itemRecord.body : void 0,
        startLine: this.normalizeSnippetLine(itemRecord.start_line ?? itemRecord.startLine),
        endLine: this.normalizeSnippetLine(itemRecord.end_line ?? itemRecord.endLine),
      });
    }
    return out;
  }
  async readPartialText(absPath, from, lines) {
    const start = normalizePositiveInteger(from, 1);
    const count = normalizePositiveInteger(lines, Number.MAX_SAFE_INTEGER);
    let handle;
    try {
      handle = await fs$1.open(absPath);
    } catch (err) {
      if (isFileMissingError(err)) return { missing: true };
      throw err;
    }
    const stream = handle.createReadStream({ encoding: "utf-8" });
    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity,
    });
    const selected = [];
    let index = 0;
    let moreSourceLinesRemain = false;
    try {
      for await (const line of rl) {
        index += 1;
        if (index < start) continue;
        if (selected.length >= count) {
          moreSourceLinesRemain = true;
          break;
        }
        selected.push(line);
      }
    } finally {
      rl.close();
      await handle.close();
    }
    return {
      missing: false,
      selectedLines: selected.slice(0, count),
      moreSourceLinesRemain,
    };
  }
  async readFullText(absPath) {
    try {
      return {
        missing: false,
        text: await fs$1.readFile(absPath, "utf-8"),
      };
    } catch (err) {
      if (isFileMissingError(err)) return { missing: true };
      throw err;
    }
  }
  ensureDb() {
    if (this.db) return this.db;
    const { DatabaseSync } = requireMemoryHostNodeSqlite();
    this.db = new DatabaseSync(this.indexPath, { readOnly: true });
    this.db.exec("PRAGMA busy_timeout = 1000");
    return this.db;
  }
  async exportSessions() {
    if (!this.sessionExporter) return;
    const exportDir = this.sessionExporter.dir;
    await fs$1.mkdir(exportDir, { recursive: true });
    const exportRoot = await root(exportDir);
    const corpusEntries = await listSessionTranscriptCorpusEntriesForAgent(this.agentId);
    const keep = /* @__PURE__ */ new Set();
    const tracked = /* @__PURE__ */ new Set();
    const artifactMappings = [];
    const cutoff = this.sessionExporter.retentionMs
      ? Date.now() - this.sessionExporter.retentionMs
      : null;
    for (const corpusEntry of corpusEntries) {
      const sessionFile = corpusEntry.sessionFile;
      const entry = await buildSessionEntry(sessionFile, {
        generatedByDreamingNarrative: corpusEntry.generatedByDreamingNarrative === true,
        generatedByCronRun: corpusEntry.generatedByCronRun === true,
        ...(corpusEntry.sessionKey ? { sessionKey: corpusEntry.sessionKey } : {}),
        ...(corpusEntry.updatedAtMs !== void 0 ? { updatedAtMs: corpusEntry.updatedAtMs } : {}),
      });
      if (!entry) continue;
      if (cutoff && entry.mtimeMs < cutoff) continue;
      const targetName = `${this.sessionExportStem(corpusEntry)}.md`;
      const target = path.join(exportDir, targetName);
      tracked.add(sessionFile);
      const identity = this.buildSessionArtifactMapping(
        sessionFile,
        targetName,
        target,
        corpusEntry,
      );
      if (identity) artifactMappings.push(identity);
      const state = this.exportedSessionState.get(sessionFile);
      if (!state || state.hash !== entry.hash || state.mtimeMs !== entry.mtimeMs)
        await exportRoot.write(targetName, this.renderSessionMarkdown(entry), {
          encoding: "utf-8",
        });
      this.exportedSessionState.set(sessionFile, {
        hash: entry.hash,
        mtimeMs: entry.mtimeMs,
        target,
      });
      keep.add(target);
    }
    const exported = await exportRoot.list(".").catch(() => []);
    for (const name of exported) {
      if (!name.endsWith(".md")) continue;
      const full = path.join(exportDir, name);
      if (!keep.has(full)) await exportRoot.remove(name).catch(() => void 0);
    }
    for (const [sessionFile, state] of this.exportedSessionState)
      if (!tracked.has(sessionFile) || !isPathInside(exportDir, state.target))
        this.exportedSessionState.delete(sessionFile);
    replaceQmdSessionArtifactMappings({
      collection: this.sessionExporter.collectionName,
      indexPath: this.indexPath,
      mappings: artifactMappings,
    });
  }
  buildSessionArtifactMapping(sessionFile, artifactPath, target, corpusEntry) {
    if (!this.sessionExporter) return null;
    const identity = corpusEntry ?? resolveSessionIdentityForTranscriptFile(sessionFile);
    if (!identity?.agentId) return null;
    return {
      agentId: identity.agentId,
      archived: isSessionArchiveArtifactName(path.basename(sessionFile)),
      artifactPath,
      collection: this.sessionExporter.collectionName,
      memoryKey: formatSessionTranscriptMemoryHitKey({
        agentId: identity.agentId,
        sessionId: identity.sessionId,
      }),
      searchPath: this.buildSearchPath(
        this.sessionExporter.collectionName,
        artifactPath,
        path.relative(this.workspaceDir, target),
        target,
      ),
      sessionId: identity.sessionId,
    };
  }
  sessionExportStem(corpusEntry) {
    return corpusEntry.transcriptSource === "sqlite"
      ? corpusEntry.sessionId
      : path.basename(corpusEntry.sessionFile, ".jsonl");
  }
  refreshSessionArtifactDocIds() {
    if (!this.sessionExporter) return;
    try {
      refreshQmdSessionArtifactDocIds({
        collection: this.sessionExporter.collectionName,
        indexPath: this.indexPath,
      });
    } catch (err) {
      log.warn(`failed to refresh qmd session artifact identity docids: ${String(err)}`);
    }
  }
  renderSessionMarkdown(entry) {
    return `${`# Session ${path.basename(entry.path, path.extname(entry.path))}`}\n\n${entry.content?.trim().length ? entry.content.trim() : "(empty)"}\n`;
  }
  pickSessionCollectionName() {
    const existing = new Set(this.qmd.collections.map((collection) => collection.name));
    const base = `sessions-${this.sanitizeCollectionNameSegment(this.agentId)}`;
    if (!existing.has(base)) return base;
    let counter = 2;
    let candidate = `${base}-${counter}`;
    while (existing.has(candidate)) {
      counter += 1;
      candidate = `${base}-${counter}`;
    }
    return candidate;
  }
  sanitizeCollectionNameSegment(input) {
    return (
      normalizeLowercaseStringOrEmpty(input)
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-+|-+$/g, "") || "agent"
    );
  }
  async resolveDocLocation(docid, hints) {
    const normalizedHints = this.normalizeDocHints(hints);
    if (!docid) return this.resolveDocLocationFromHints(normalizedHints);
    const normalized = docid.startsWith("#") ? docid.slice(1) : docid;
    if (!normalized) return null;
    const cacheKey = `${normalizedHints.preferredCollection ?? "*"}:${normalized}`;
    const cached = this.docPathCache.get(cacheKey);
    if (cached) return cached;
    const db = this.ensureDb();
    let rows;
    try {
      rows = db
        .prepare("SELECT collection, path FROM documents WHERE hash = ? AND active = 1")
        .all(normalized);
      if (rows.length === 0)
        rows = db
          .prepare("SELECT collection, path FROM documents WHERE hash LIKE ? AND active = 1")
          .all(`${normalized}%`);
    } catch (err) {
      if (this.isSqliteBusyError(err)) {
        log.debug(`qmd index is busy while resolving doc path: ${String(err)}`);
        throw this.createQmdBusyError(err);
      }
      throw err;
    }
    if (rows.length === 0) return null;
    const location = this.pickDocLocation(rows, normalizedHints);
    if (!location) return null;
    this.docPathCache.set(cacheKey, location);
    return location;
  }
  resolveDocLocationFromHints(hints) {
    if (!hints.preferredCollection || !hints.preferredFile) return null;
    const indexedLocation = this.resolveIndexedDocLocationFromHint(
      hints.preferredCollection,
      hints.preferredFile,
    );
    if (indexedLocation) return indexedLocation;
    const collectionRelativePath = this.toCollectionRelativePath(
      hints.preferredCollection,
      hints.preferredFile,
    );
    if (!collectionRelativePath) return null;
    return this.toDocLocation(hints.preferredCollection, collectionRelativePath);
  }
  resolveIndexedDocLocationFromHint(collection, preferredFile) {
    const trimmedCollection = collection.trim();
    const trimmedFile = preferredFile.trim();
    if (!trimmedCollection || !trimmedFile) return null;
    const exactPath = path.normalize(trimmedFile).replace(/\\/g, "/");
    let rows;
    try {
      const db = this.ensureDb();
      const exactRows = db
        .prepare("SELECT path FROM documents WHERE collection = ? AND path = ? AND active = 1")
        .all(trimmedCollection, exactPath);
      if (exactRows.length > 0) {
        const exactRow = expectDefined(exactRows.at(0), "single exact QMD document row");
        return this.toDocLocation(trimmedCollection, exactRow.path);
      }
      rows = db
        .prepare("SELECT path FROM documents WHERE collection = ? AND active = 1")
        .all(trimmedCollection);
    } catch (err) {
      if (this.isSqliteBusyError(err)) {
        log.debug(`qmd index is busy while resolving hinted path: ${String(err)}`);
        throw this.createQmdBusyError(err);
      }
      log.debug(`qmd index hint lookup skipped: ${String(err)}`);
      return null;
    }
    const matches = rows.filter((row) => this.matchesPreferredFileHint(row.path, trimmedFile));
    if (matches.length !== 1) return null;
    const match = expectDefined(matches.at(0), "single preferred QMD document match");
    return this.toDocLocation(trimmedCollection, match.path);
  }
  normalizeDocHints(hints) {
    const preferredCollection = hints?.preferredCollection?.trim();
    const preferredFile = hints?.preferredFile?.trim();
    if (!preferredFile) return preferredCollection ? { preferredCollection } : {};
    const parsedQmdFile = this.parseQmdFileUri(preferredFile);
    return {
      preferredCollection: parsedQmdFile?.collection ?? preferredCollection,
      preferredFile: parsedQmdFile?.collectionRelativePath ?? preferredFile,
    };
  }
  parseQmdFileUri(fileRef) {
    if (!normalizeLowercaseStringOrEmpty(fileRef).startsWith("qmd://")) return null;
    try {
      const parsed = new URL(fileRef);
      const collection = decodeURIComponent(parsed.hostname).trim();
      const pathname = decodeURIComponent(parsed.pathname).replace(/^\/+/, "").trim();
      if (!collection && !pathname) return null;
      return {
        collection: collection || void 0,
        collectionRelativePath: pathname || void 0,
      };
    } catch {
      return null;
    }
  }
  toCollectionRelativePath(collection, filePath) {
    const rootItem = this.collectionRoots.get(collection);
    if (!rootItem) return null;
    const trimmedFilePath = filePath.trim();
    if (!trimmedFilePath) return null;
    const normalizedInput = path.normalize(trimmedFilePath);
    const absolutePath = path.isAbsolute(normalizedInput)
      ? normalizedInput
      : path.resolve(rootItem.path, normalizedInput);
    if (!this.isWithinRoot(rootItem.path, absolutePath)) return null;
    const relative = path.relative(rootItem.path, absolutePath);
    if (!relative || relative === ".") return null;
    return relative.replace(/\\/g, "/");
  }
  pickDocLocation(rows, hints) {
    if (hints?.preferredCollection)
      for (const row of rows) {
        if (row.collection !== hints.preferredCollection) continue;
        const location = this.toDocLocation(row.collection, row.path);
        if (location) return location;
      }
    if (hints?.preferredFile)
      for (const row of rows) {
        if (!this.matchesPreferredFileHint(row.path, hints.preferredFile)) continue;
        const location = this.toDocLocation(row.collection, row.path);
        if (location) return location;
      }
    for (const row of rows) {
      const location = this.toDocLocation(row.collection, row.path);
      if (location) return location;
    }
    return null;
  }
  matchesPreferredFileHint(rowPath, preferredFile) {
    const preferred = path.normalize(preferredFile).replace(/\\/g, "/");
    const normalizedRowPath = path.normalize(rowPath).replace(/\\/g, "/");
    if (normalizedRowPath === preferred || normalizedRowPath.endsWith(`/${preferred}`)) return true;
    const normalizedPreferredLookup = this.normalizeQmdLookupPath(preferredFile);
    if (!normalizedPreferredLookup) return false;
    const normalizedRowLookup = this.normalizeQmdLookupPath(rowPath);
    return (
      normalizedRowLookup === normalizedPreferredLookup ||
      normalizedRowLookup.endsWith(`/${normalizedPreferredLookup}`)
    );
  }
  normalizeQmdLookupPath(filePath) {
    return filePath
      .replace(/\\/g, "/")
      .split("/")
      .filter((segment) => segment.length > 0 && segment !== ".")
      .map((segment) => this.normalizeQmdLookupSegment(segment))
      .filter(Boolean)
      .join("/");
  }
  normalizeQmdLookupSegment(segment) {
    const trimmed = segment.trim();
    if (!trimmed) return "";
    if (trimmed === "." || trimmed === "..") return trimmed;
    const parsed = path.posix.parse(trimmed);
    const normalizePart = (value) =>
      localeLowercasePreservingWhitespace(value.normalize("NFKD"))
        .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
        .replace(/-{2,}/g, "-")
        .replace(/^-+|-+$/g, "");
    const normalizedName = normalizePart(parsed.name);
    const normalizedExt = localeLowercasePreservingWhitespace(parsed.ext.normalize("NFKD")).replace(
      /[^\p{Letter}\p{Number}.]+/gu,
      "",
    );
    const fallbackName = normalizeLowercaseStringOrEmpty(parsed.name.normalize("NFKD")).replace(
      /\s+/g,
      "-",
    );
    return `${normalizedName || fallbackName || "file"}${normalizedExt}`;
  }
  resolveSnippetLines(entry, snippet) {
    const explicitStart = this.normalizeSnippetLine(entry.startLine);
    const explicitEnd = this.normalizeSnippetLine(entry.endLine);
    const headerLines = this.parseSnippetHeaderLines(snippet);
    if (explicitStart !== void 0 && explicitEnd !== void 0)
      return explicitStart <= explicitEnd
        ? {
            startLine: explicitStart,
            endLine: explicitEnd,
          }
        : {
            startLine: explicitEnd,
            endLine: explicitStart,
          };
    if (explicitStart !== void 0) {
      if (headerLines) {
        const width = headerLines.endLine - headerLines.startLine;
        return {
          startLine: explicitStart,
          endLine: explicitStart + Math.max(0, width),
        };
      }
      return {
        startLine: explicitStart,
        endLine: explicitStart,
      };
    }
    if (explicitEnd !== void 0) {
      if (headerLines) {
        const width = headerLines.endLine - headerLines.startLine;
        return {
          startLine: Math.max(1, explicitEnd - Math.max(0, width)),
          endLine: explicitEnd,
        };
      }
      return {
        startLine: explicitEnd,
        endLine: explicitEnd,
      };
    }
    if (headerLines) return headerLines;
    return {
      startLine: 1,
      endLine: snippet.split("\n").length,
    };
  }
  normalizeSnippetLine(value) {
    return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : void 0;
  }
  parseSnippetHeaderLines(snippet) {
    const match = SNIPPET_HEADER_RE.exec(snippet);
    if (!match) return null;
    const start = Number(match[1]);
    const count = Number(match[2]);
    if (Number.isFinite(start) && Number.isFinite(count))
      return {
        startLine: start,
        endLine: start + count - 1,
      };
    return null;
  }
  readCounts() {
    try {
      const rows = this.ensureDb()
        .prepare(
          "SELECT collection, COUNT(*) as c FROM documents WHERE active = 1 GROUP BY collection",
        )
        .all();
      const bySource = /* @__PURE__ */ new Map();
      for (const source of this.sources)
        bySource.set(source, {
          files: 0,
          chunks: 0,
        });
      let total = 0;
      for (const row of rows) {
        const source = this.collectionRoots.get(row.collection)?.kind ?? "memory";
        const entry = bySource.get(source) ?? {
          files: 0,
          chunks: 0,
        };
        entry.files += row.c ?? 0;
        entry.chunks += row.c ?? 0;
        bySource.set(source, entry);
        total += row.c ?? 0;
      }
      return {
        totalDocuments: total,
        sourceCounts: Array.from(bySource.entries()).map(([source, value]) => ({
          source,
          files: value.files,
          chunks: value.chunks,
        })),
      };
    } catch (err) {
      log.warn(`failed to read qmd index stats: ${String(err)}`);
      return {
        totalDocuments: 0,
        sourceCounts: Array.from(this.sources).map((source) => ({
          source,
          files: 0,
          chunks: 0,
        })),
      };
    }
  }
  logScopeDenied(sessionKey) {
    const channel = deriveQmdScopeChannel(sessionKey) ?? "unknown";
    const chatType = deriveQmdScopeChatType(sessionKey) ?? "unknown";
    const key = sessionKey?.trim() || "<none>";
    log.warn(
      `qmd search denied by scope (channel=${channel}, chatType=${chatType}, session=${key})`,
    );
  }
  isScopeAllowed(sessionKey) {
    return isQmdScopeAllowed(this.qmd.scope, sessionKey);
  }
  toDocLocation(collection, collectionRelativePath) {
    const rootEntry = this.collectionRoots.get(collection);
    if (!rootEntry) return null;
    const normalizedRelative = collectionRelativePath.replace(/\\/g, "/");
    const absPath = path.normalize(path.resolve(rootEntry.path, collectionRelativePath));
    const relativeToWorkspace = path.relative(this.workspaceDir, absPath);
    return {
      rel: this.buildSearchPath(collection, normalizedRelative, relativeToWorkspace, absPath),
      abs: absPath,
      collection,
      collectionRelativePath: normalizedRelative,
      source: rootEntry.kind,
    };
  }
  buildSearchPath(collection, collectionRelativePath, relativeToWorkspace, absPath) {
    const sanitized = collectionRelativePath.replace(/^\/+/, "");
    if (this.isInsideWorkspace(relativeToWorkspace)) {
      const normalized = relativeToWorkspace.replace(/\\/g, "/");
      if (!normalized) return path.basename(absPath);
      if (normalized === "qmd" || normalized.startsWith("qmd/"))
        return `qmd/${collection}/${sanitized}`;
      return normalized;
    }
    return `qmd/${collection}/${sanitized}`;
  }
  isInsideWorkspace(relativePath) {
    if (!relativePath) return true;
    if (relativePath.startsWith("..")) return false;
    if (relativePath.startsWith(`..${path.sep}`)) return false;
    return !path.isAbsolute(relativePath);
  }
  resolveReadPath(relPath) {
    if (relPath.startsWith("qmd/")) {
      const [, collection, ...rest] = relPath.split("/");
      if (!collection || rest.length === 0) throw new Error("invalid qmd path");
      const rootResult = this.collectionRoots.get(collection);
      if (!rootResult) throw new Error(`unknown qmd collection: ${collection}`);
      const joined = rest.join("/");
      const resolved = path.resolve(rootResult.path, joined);
      if (!this.isWithinRoot(rootResult.path, resolved))
        throw new Error("qmd path escapes collection");
      return resolved;
    }
    const absPath = path.resolve(this.workspaceDir, relPath);
    if (!this.isWithinWorkspace(absPath)) throw new Error("path escapes workspace");
    if (
      !isDefaultMemoryPath(path.relative(this.workspaceDir, absPath).replace(/\\/g, "/")) &&
      !this.isIndexedWorkspaceReadPath(absPath)
    )
      throw new Error("path required");
    return absPath;
  }
  isIndexedWorkspaceReadPath(absPath) {
    const normalizedAbsPath = path.normalize(absPath);
    for (const [collection, rootValue] of this.collectionRoots.entries()) {
      if (!this.isWithinRoot(rootValue.path, normalizedAbsPath)) continue;
      const collectionRelativePath = path
        .relative(rootValue.path, normalizedAbsPath)
        .replace(/\\/g, "/");
      if (!collectionRelativePath || collectionRelativePath.startsWith("..")) continue;
      try {
        const exactRow = this.ensureDb()
          .prepare("SELECT path FROM documents WHERE collection = ? AND active = 1 AND path = ?")
          .get(collection, collectionRelativePath);
        if (
          exactRow &&
          path.normalize(path.resolve(rootValue.path, exactRow.path)) === normalizedAbsPath
        )
          return true;
        const match = this.ensureDb()
          .prepare("SELECT path FROM documents WHERE collection = ? AND active = 1")
          .all(collection)
          .find((row) => this.matchesPreferredFileHint(row.path, collectionRelativePath));
        if (match && path.normalize(path.resolve(rootValue.path, match.path)) === normalizedAbsPath)
          return true;
      } catch (err) {
        if (this.isSqliteBusyError(err)) {
          log.debug(`qmd index is busy while checking read path: ${String(err)}`);
          throw this.createQmdBusyError(err);
        }
        log.debug(`qmd indexed read-path lookup skipped: ${String(err)}`);
      }
    }
    return false;
  }
  isWithinWorkspace(absPath) {
    return isPathInside(this.workspaceDir, absPath);
  }
  isWithinRoot(rootLocal, candidate) {
    return isPathInside(rootLocal, candidate);
  }
  clampResultsByInjectedChars(results) {
    const budget = this.qmd.limits.maxInjectedChars;
    if (!budget || budget <= 0) return results;
    let remaining = budget;
    const clamped = [];
    for (const entry of results) {
      if (remaining <= 0) break;
      const snippet = entry.snippet ?? "";
      if (snippet.length <= remaining) {
        clamped.push(entry);
        remaining -= snippet.length;
      } else {
        const trimmed = truncateUtf16Safe(snippet, remaining);
        clamped.push(
          copyQmdSessionArtifactHit(entry, {
            ...entry,
            snippet: trimmed,
          }),
        );
        break;
      }
    }
    return clamped;
  }
  diversifyResultsBySource(results, limit) {
    const target = Math.max(0, limit);
    if (target <= 0) return [];
    if (results.length <= 1) return results.slice(0, target);
    const bySource = /* @__PURE__ */ new Map();
    for (const entry of results) {
      const list = bySource.get(entry.source) ?? [];
      list.push(entry);
      bySource.set(entry.source, list);
    }
    const hasSessions = bySource.has("sessions");
    const hasMemory = bySource.has("memory");
    if (!hasSessions || !hasMemory) return results.slice(0, target);
    const sourceOrder = Array.from(bySource.entries())
      .toSorted((a, b) => (b[1][0]?.score ?? 0) - (a[1][0]?.score ?? 0))
      .map(([source]) => source);
    const diversified = [];
    while (diversified.length < target) {
      let emitted = false;
      for (const source of sourceOrder) {
        const next = bySource.get(source)?.shift();
        if (!next) continue;
        diversified.push(next);
        emitted = true;
        if (diversified.length >= target) break;
      }
      if (!emitted) break;
    }
    return diversified;
  }
  shouldSkipUpdate(force) {
    if (force) return false;
    const debounceMs = this.qmd.update.debounceMs;
    if (debounceMs <= 0) return false;
    if (!this.lastUpdateAt) return false;
    return Date.now() - this.lastUpdateAt < debounceMs;
  }
  isSqliteBusyError(err) {
    const normalized = normalizeLowercaseStringOrEmpty(formatErrorMessage(err));
    return normalized.includes("sqlite_busy") || normalized.includes("database is locked");
  }
  isUnsupportedQmdOptionError(err) {
    const normalized = normalizeLowercaseStringOrEmpty(formatErrorMessage(err));
    return (
      normalized.includes("unknown flag") ||
      normalized.includes("unknown option") ||
      normalized.includes("unrecognized option") ||
      normalized.includes("flag provided but not defined") ||
      normalized.includes("unexpected argument")
    );
  }
  createQmdBusyError(err) {
    const message = formatErrorMessage(err);
    return /* @__PURE__ */ new Error(`qmd index busy while reading results: ${message}`);
  }
  async waitForPendingUpdateBeforeSearch() {
    const pending = this.pendingUpdate;
    if (!pending) return;
    let timeout;
    const wait = new Promise((resolve) => {
      timeout = setTimeout(resolve, SEARCH_PENDING_UPDATE_WAIT_MS);
    });
    await Promise.race([pending.catch(() => void 0), wait]).finally(() => clearTimeout(timeout));
  }
  async resolveCollectionSearchGroups(collectionNames, signal, debugContext) {
    if (collectionNames.length <= 1) return [collectionNames];
    if (!(await this.supportsQmdMultiCollectionFilters(signal, debugContext)))
      return collectionNames.map((collectionName) => [collectionName]);
    return this.groupCollectionNamesBySource(collectionNames);
  }
  async supportsQmdMultiCollectionFilters(signal, debugContext) {
    if (signal?.aborted) throw asAbortError(signal);
    if (this.multiCollectionFilterSupported !== null) return this.multiCollectionFilterSupported;
    const startedAt = Date.now();
    const cacheContext = await this.buildQmdMultiCollectionProbeCacheContext();
    const cached = await readQmdMultiCollectionProbeCache(cacheContext);
    if (cached.state === "hit") {
      this.multiCollectionFilterSupported = cached.value.multiCollectionProbe.supported;
      if (debugContext)
        debugContext.multiCollectionProbe = {
          cacheState: "hit",
          elapsedMs: Math.max(0, Date.now() - startedAt),
          supported: this.multiCollectionFilterSupported,
        };
      return this.multiCollectionFilterSupported;
    }
    try {
      const result = await this.runQmd(["--help"], {
        timeoutMs: Math.min(this.qmd.limits.timeoutMs, 5e3),
        signal,
      });
      const helpText = `${result.stdout}\n${result.stderr}`;
      this.multiCollectionFilterSupported =
        /\b(?:one or more collections|collection\(s\)|multiple -c flags)\b/i.test(helpText);
      const wroteCache = await writeQmdMultiCollectionProbeCache(
        cacheContext,
        this.multiCollectionFilterSupported,
      );
      if (debugContext)
        debugContext.multiCollectionProbe = {
          cacheState: wroteCache ? "write" : "error",
          elapsedMs: Math.max(0, Date.now() - startedAt),
          supported: this.multiCollectionFilterSupported,
        };
    } catch (err) {
      if (signal?.aborted) throw asAbortError(signal);
      this.multiCollectionFilterSupported = false;
      if (debugContext)
        debugContext.multiCollectionProbe = {
          cacheState: "error",
          elapsedMs: Math.max(0, Date.now() - startedAt),
          supported: false,
        };
      log.debug(`qmd multi-collection filter probe failed: ${String(err)}`);
    }
    return this.multiCollectionFilterSupported;
  }
  async markQmdMultiCollectionFiltersUnsupported(debugContext) {
    const startedAt = Date.now();
    const cacheContext = await this.buildQmdMultiCollectionProbeCacheContext();
    this.multiCollectionFilterSupported = false;
    await clearQmdMultiCollectionProbeCache(cacheContext);
    debugContext.multiCollectionProbe = {
      cacheState: (await writeQmdMultiCollectionProbeCache(cacheContext, false))
        ? "write"
        : "error",
      elapsedMs: Math.max(0, Date.now() - startedAt),
      supported: false,
    };
  }
  async runQueryAcrossCollectionGroups(
    query,
    limit,
    collectionGroups,
    command,
    signal,
    reportCommandPhase,
  ) {
    log.debug(
      `qmd ${command} multi-source collection grouping active (${collectionGroups.length} groups)`,
    );
    const bestByResultKey = /* @__PURE__ */ new Map();
    for (const collectionNames of collectionGroups) {
      const args = this.buildSearchArgs(command, query, limit);
      args.push(...this.buildCollectionFilterArgs(collectionNames));
      const parsed = await this.runQmdSearch(args, command, signal, reportCommandPhase);
      for (const entry of parsed) {
        const defaultCollection = collectionNames.length === 1 ? collectionNames[0] : void 0;
        const normalizedHints = this.normalizeDocHints({
          preferredCollection: entry.collection ?? defaultCollection,
          preferredFile: entry.file,
        });
        const normalizedDocId =
          typeof entry.docid === "string" && entry.docid.trim().length > 0 ? entry.docid : void 0;
        const withCollection = {
          ...entry,
          docid: normalizedDocId,
          collection: normalizedHints.preferredCollection ?? entry.collection ?? defaultCollection,
          file: normalizedHints.preferredFile ?? entry.file,
        };
        const resultKey = this.buildQmdResultKey(withCollection);
        if (!resultKey) continue;
        const prev = bestByResultKey.get(resultKey);
        const prevScore = typeof prev?.score === "number" ? prev.score : Number.NEGATIVE_INFINITY;
        const nextScore =
          typeof withCollection.score === "number"
            ? withCollection.score
            : Number.NEGATIVE_INFINITY;
        if (!prev || nextScore > prevScore) bestByResultKey.set(resultKey, withCollection);
      }
    }
    return [...bestByResultKey.values()].toSorted((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }
  groupCollectionNamesBySource(collectionNames) {
    const groups = /* @__PURE__ */ new Map();
    for (const collectionName of collectionNames) {
      const source = this.collectionRoots.get(collectionName)?.kind ?? collectionName;
      const group = groups.get(source) ?? [];
      group.push(collectionName);
      groups.set(source, group);
    }
    return [...groups.values()];
  }
  buildQmdResultKey(entry) {
    if (typeof entry.docid === "string" && entry.docid.trim().length > 0)
      return `docid:${entry.docid}`;
    const hints = this.normalizeDocHints({
      preferredCollection: entry.collection,
      preferredFile: entry.file,
    });
    if (!hints.preferredCollection || !hints.preferredFile) return null;
    const collectionRelativePath = this.toCollectionRelativePath(
      hints.preferredCollection,
      hints.preferredFile,
    );
    if (!collectionRelativePath) return null;
    return `file:${hints.preferredCollection}:${collectionRelativePath}`;
  }
  async runMcporterAcrossCollections(params) {
    const bestByDocId = /* @__PURE__ */ new Map();
    for (const collectionName of params.collectionNames) {
      const parsed = params.explicitToolOverride
        ? await this.runQmdSearchViaMcporter({
            mcporter: this.qmd.mcporter,
            tool: params.tool,
            searchCommand: params.searchCommand,
            explicitToolOverride: true,
            query: params.query,
            limit: params.limit,
            minScore: params.minScore,
            collection: collectionName,
            timeoutMs: this.qmd.limits.timeoutMs,
            signal: params.signal,
            reportCommandPhase: params.reportCommandPhase,
          })
        : await this.runQmdSearchViaMcporter({
            mcporter: this.qmd.mcporter,
            tool: params.tool,
            searchCommand: params.searchCommand,
            explicitToolOverride: false,
            query: params.query,
            limit: params.limit,
            minScore: params.minScore,
            collection: collectionName,
            timeoutMs: this.qmd.limits.timeoutMs,
            signal: params.signal,
            reportCommandPhase: params.reportCommandPhase,
          });
      for (const entry of parsed) {
        if (typeof entry.docid !== "string" || !entry.docid.trim()) continue;
        const prev = bestByDocId.get(entry.docid);
        const prevScore = typeof prev?.score === "number" ? prev.score : Number.NEGATIVE_INFINITY;
        const nextScore = typeof entry.score === "number" ? entry.score : Number.NEGATIVE_INFINITY;
        if (!prev || nextScore > prevScore) bestByDocId.set(entry.docid, entry);
      }
    }
    return [...bestByDocId.values()].toSorted((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }
  listManagedCollectionNames(sources) {
    if (!sources?.length) return this.managedCollectionNames;
    const allowed = new Set(sources);
    return this.managedCollectionNames.filter((name) => {
      const source = this.collectionRoots.get(name)?.kind;
      return source ? allowed.has(source) : false;
    });
  }
  computeManagedCollectionNames() {
    const seen = /* @__PURE__ */ new Set();
    const names = [];
    for (const collection of this.qmd.collections) {
      const name = collection.name?.trim();
      if (!name || seen.has(name)) continue;
      seen.add(name);
      names.push(name);
    }
    return names;
  }
  buildCollectionFilterArgs(collectionNames) {
    if (collectionNames.length === 0) return [];
    return collectionNames.filter(Boolean).flatMap((name) => ["-c", name]);
  }
  buildSearchArgs(command, query, limit) {
    const normalizedQuery = command === "search" ? normalizeHanBm25Query(query) : query;
    if (command === "query") {
      const args = ["query", normalizedQuery, "--json", "-n", String(limit)];
      if (this.qmd.searchMode === "query" && this.qmd.rerank === false) args.push("--no-rerank");
      return args;
    }
    return [command, normalizedQuery, "--json", "-n", String(limit)];
  }
};
function resolveQmdManagerRuntimeConfig(cfg, agentId) {
  return {
    workspaceDir: resolveAgentWorkspaceDir(cfg, agentId),
    syncSettings: resolveMemorySearchSyncConfig(cfg, agentId),
    contextLimits: resolveAgentContextLimits(cfg, agentId),
  };
}
function normalizeQmdSemanticQuery(query) {
  return query.replace(/(\w)-(?=\w)/g, "$1 ");
}
function formatQmdSearchExit(err) {
  if (err.code === null) return `signal ${err.signal ?? "unknown"}`;
  return `code ${err.code}`;
}
function isQmdCliCommandError(err) {
  if (!(err instanceof Error)) return false;
  const candidate = err;
  return (
    (typeof candidate.code === "number" || candidate.code === null) &&
    (typeof candidate.signal === "string" || candidate.signal === null) &&
    typeof candidate.stdout === "string" &&
    typeof candidate.stderr === "string"
  );
}
function isQmdNativeAbortAfterOutput(err) {
  if (!(err.code === 134 || err.signal === "SIGABRT")) return false;
  const stderr = normalizeLowercaseStringOrEmpty(err.stderr);
  return (
    stderr.includes("ggml-metal") ||
    stderr.includes("node-llama-cpp") ||
    stderr.includes("llama.cpp") ||
    stderr.includes("abort trap") ||
    stderr.includes("assertion failed")
  );
}
//#endregion
export { QmdMemoryManager, resolveQmdMcporterSearchProcessTimeoutMs };
