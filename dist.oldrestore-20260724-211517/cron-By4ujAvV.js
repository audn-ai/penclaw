import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { n as resolveCronDeliveryPlan } from "./delivery-plan-DoSj9Ji-.js";
import { V as MEMORY_DREAMING_SYSTEM_EVENT_TEXT } from "./dreaming-CM8RB1ct.js";
import { n as runExec } from "./exec-CXKmx4dL.js";
import { r as normalizeChatChannelId } from "./ids-lBaN9yr4.js";
import { i as resolveAgentModelPrimaryValue } from "./model-input-B7OGjVYg.js";
import { t as requireNodeSqlite } from "./node-sqlite-BJtdZavS.js";
import { i as coerceFiniteScheduleNumber, t as inferCronJobName } from "./normalize-CSef2SY2.js";
import {
  a as LowercaseNonEmptyStringFieldSchema,
  i as DeliveryThreadIdFieldSchema,
  n as normalizeCronJobInput,
  o as TrimmedNonEmptyStringFieldSchema,
  s as parseOptionalField,
} from "./normalize-pVPLopSK.js";
import { t as note } from "./note-Uvqr4R1d.js";
import { P as timestampMsToIsoString } from "./number-coercion-CJQ8TR--.js";
import {
  L as executeSqliteQuerySync,
  R as executeSqliteQueryTakeFirstSync,
  b as parseCronRunLogEntryObject,
  f as resolveOpenClawStateSqlitePath,
  l as runOpenClawStateWriteTransaction,
  p as migrateLegacyCronRunLogsToTaskRuns,
  s as openOpenClawStateDatabase,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import { t as parseAbsoluteTimeMs } from "./parse-CbtxGw67.js";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-CmZHj-1e.js";
import { n as listReadOnlyChannelPluginsForConfig } from "./read-only-D7WTn1n5.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { c as getInvalidPersistedCronJobReason, u as cronStoreKey } from "./row-codec-CaYtaRTs.js";
import "./schedule-DsVY1zm0.js";
import { At as boolean } from "./schemas-CBJjibl3.js";
import {
  r as resolveDefaultCronStaggerMs,
  t as normalizeCronStaggerMs,
} from "./stagger-N9cGukpI.js";
import {
  a as loadCronQuarantineFile,
  c as resolveCronQuarantinePath,
  d as saveCronJobsStoreWithMetadata,
  f as saveCronQuarantineFile,
  i as loadCronJobsStoreWithConfigJobsReadOnly,
  r as loadCronJobsStoreWithConfigJobs,
  s as resolveCronJobsStorePath,
  u as saveCronJobsStore,
} from "./store-D02kEgQU.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  l as normalizeOptionalStringifiedId,
  p as readStringValue,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { h as shortenHomePath } from "./utils-DtcDeqWS.js";
import { t as normalizeHttpWebhookUrl } from "./webhook-url-BOvGxtq0.js";
//#region src/commands/doctor/cron/dreaming-payload-migration.ts
function isManagedDreamingJob(raw) {
  if (
    normalizeOptionalString(raw.description)?.includes(
      "[managed-by=memory-core.short-term-promotion]",
    )
  )
    return true;
  if (normalizeOptionalString(raw.name) !== "Memory Dreaming Promotion") return false;
  const payload = raw.payload ?? void 0;
  const payloadKind = normalizeOptionalLowercaseString(payload?.kind);
  if (payloadKind === "systemevent")
    return normalizeOptionalString(payload?.text) === MEMORY_DREAMING_SYSTEM_EVENT_TEXT;
  if (payloadKind === "agentturn")
    return normalizeOptionalString(payload?.message) === MEMORY_DREAMING_SYSTEM_EVENT_TEXT;
  return false;
}
function isStaleDreamingJob(raw) {
  if (normalizeOptionalLowercaseString(raw.sessionTarget) !== "isolated") return true;
  const payload = raw.payload ?? void 0;
  if (normalizeOptionalLowercaseString(payload?.kind) !== "agentturn") return true;
  if (payload?.lightContext !== true) return true;
  if (normalizeOptionalLowercaseString((raw.delivery ?? void 0)?.mode) !== "none") return true;
  return false;
}
function rewriteDreamingJobShape(raw) {
  raw.sessionTarget = "isolated";
  raw.payload = {
    kind: "agentTurn",
    message: MEMORY_DREAMING_SYSTEM_EVENT_TEXT,
    lightContext: true,
  };
  raw.delivery = { mode: "none" };
}
/** Rewrite managed dreaming jobs to the isolated light-context agent-turn shape. */
function migrateLegacyDreamingPayloadShape(jobs) {
  let rewrittenCount = 0;
  for (const raw of jobs) {
    if (!isManagedDreamingJob(raw)) continue;
    if (!isStaleDreamingJob(raw)) continue;
    rewriteDreamingJobShape(raw);
    rewrittenCount += 1;
  }
  return {
    changed: rewrittenCount > 0,
    rewrittenCount,
  };
}
/** Count managed dreaming jobs that still need payload/session/delivery migration. */
function countStaleDreamingJobs(jobs) {
  let count = 0;
  for (const raw of jobs) if (isManagedDreamingJob(raw) && isStaleDreamingJob(raw)) count += 1;
  return count;
}
//#endregion
//#region src/commands/doctor/cron/legacy-notify.ts
/** Migrate legacy notify fallback flags into explicit delivery destinations when possible. */
function migrateLegacyNotifyFallback(params) {
  let changed = false;
  const warnings = [];
  const configuredLegacyWebhook = normalizeOptionalString(params.legacyWebhook);
  const legacyWebhook = configuredLegacyWebhook
    ? normalizeHttpWebhookUrl(configuredLegacyWebhook)
    : void 0;
  for (const raw of params.jobs) {
    if (!("notify" in raw)) continue;
    const jobName =
      normalizeOptionalString(raw.name) ?? normalizeOptionalString(raw.id) ?? "<unnamed>";
    if (!(raw.notify === true)) {
      delete raw.notify;
      changed = true;
      continue;
    }
    const delivery =
      raw.delivery && typeof raw.delivery === "object" && !Array.isArray(raw.delivery)
        ? raw.delivery
        : null;
    const mode = normalizeOptionalLowercaseString(delivery?.mode);
    const to = normalizeOptionalString(delivery?.to);
    const hasLegacyChatDelivery =
      mode === void 0 &&
      delivery !== null &&
      (normalizeOptionalString(delivery.channel) !== void 0 ||
        normalizeOptionalString(delivery.accountId) !== void 0 ||
        "threadId" in delivery ||
        (to !== void 0 && !normalizeHttpWebhookUrl(to)));
    const completionDestination =
      delivery?.completionDestination &&
      typeof delivery.completionDestination === "object" &&
      !Array.isArray(delivery.completionDestination)
        ? delivery.completionDestination
        : null;
    const completionMode = normalizeOptionalLowercaseString(completionDestination?.mode);
    const completionTo = normalizeOptionalString(completionDestination?.to);
    const validWebhookTo = to ? normalizeHttpWebhookUrl(to) : void 0;
    const validCompletionTo = completionTo ? normalizeHttpWebhookUrl(completionTo) : void 0;
    if (
      (mode === "webhook" && validWebhookTo) ||
      (completionMode === "webhook" && validCompletionTo)
    ) {
      delete raw.notify;
      changed = true;
      continue;
    }
    if (configuredLegacyWebhook && !legacyWebhook) {
      warnings.push(
        `Cron job "${jobName}" still uses legacy notify fallback, but cron.webhook is not a valid HTTP(S) URL so doctor cannot migrate it automatically.`,
      );
      continue;
    }
    if (!legacyWebhook) {
      delete raw.notify;
      changed = true;
      continue;
    }
    if ((mode === void 0 && !hasLegacyChatDelivery) || mode === "none" || mode === "webhook") {
      raw.delivery = {
        ...delivery,
        mode: "webhook",
        to: mode === "none" ? legacyWebhook : (validWebhookTo ?? legacyWebhook),
      };
      delete raw.notify;
      changed = true;
      continue;
    }
    raw.delivery = {
      ...delivery,
      ...(hasLegacyChatDelivery ? { mode: "announce" } : {}),
      completionDestination: {
        ...completionDestination,
        mode: "webhook",
        to: legacyWebhook,
      },
    };
    delete raw.notify;
    changed = true;
  }
  return {
    changed,
    warnings,
  };
}
//#endregion
//#region src/commands/doctor/cron/legacy-run-log-migration.ts
const LEGACY_CRON_RUN_LOG_ARCHIVE_SUFFIX = ".migrated";
function parseCronRunLogEntriesFromJsonl(raw, opts) {
  const entries = [];
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const entry = parseCronRunLogEntryObject(JSON.parse(trimmed), opts);
      if (entry) entries.push(entry);
    } catch {}
  }
  return entries;
}
function archiveLegacyCronRunLogSync(filePath) {
  const archivePath = `${filePath}${LEGACY_CRON_RUN_LOG_ARCHIVE_SUFFIX}`;
  if (!fs.existsSync(filePath) || fs.existsSync(archivePath)) return;
  try {
    fs.renameSync(filePath, archivePath);
  } catch {}
}
/** Import legacy per-job JSONL run logs into task_runs and archive migrated files. */
async function migrateLegacyCronRunLogsToSqlite(storePath) {
  const resolvedStorePath = path.resolve(storePath);
  const runsDir = path.resolve(path.dirname(resolvedStorePath), "runs");
  const jsonlFiles = (await fs$1.readdir(runsDir, { withFileTypes: true }).catch(() => [])).filter(
    (entry) => entry.isFile() && entry.name.endsWith(".jsonl"),
  );
  if (jsonlFiles.length === 0) return { importedFiles: 0 };
  for (const file of jsonlFiles) {
    const filePath = path.join(runsDir, file.name);
    const jobId = path.basename(file.name, ".jsonl");
    const entries = parseCronRunLogEntriesFromJsonl(fs.readFileSync(filePath, "utf-8"), { jobId });
    runOpenClawStateWriteTransaction(({ db }) => {
      db.exec(`
        CREATE TABLE cron_run_logs (
          store_key TEXT NOT NULL,
          job_id TEXT NOT NULL,
          seq INTEGER NOT NULL,
          ts INTEGER NOT NULL,
          entry_json TEXT NOT NULL,
          created_at INTEGER NOT NULL,
          PRIMARY KEY (store_key, job_id, seq)
        );
      `);
      const insert = db.prepare(`INSERT INTO cron_run_logs
          (store_key, job_id, seq, ts, entry_json, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`);
      const storeKey = cronStoreKey(resolvedStorePath);
      for (const [index, entry] of entries.entries())
        insert.run(storeKey, jobId, index + 1, entry.ts, JSON.stringify(entry), Date.now());
      migrateLegacyCronRunLogsToTaskRuns(db);
    });
    archiveLegacyCronRunLogSync(filePath);
  }
  return { importedFiles: jsonlFiles.length };
}
/** Return true when legacy cron JSONL run log files exist next to a store path. */
async function legacyCronRunLogFilesExist(storePath) {
  const resolvedStorePath = path.resolve(storePath);
  const runsDir = path.resolve(path.dirname(resolvedStorePath), "runs");
  return (await fs$1.readdir(runsDir, { withFileTypes: true }).catch(() => [])).some(
    (entry) => entry.isFile() && entry.name.endsWith(".jsonl"),
  );
}
//#endregion
//#region src/commands/doctor/cron/legacy-store-migration.ts
const LEGACY_CRON_ARCHIVE_SUFFIX = ".migrated";
const legacyCronMigrationIds = /* @__PURE__ */ new WeakMap();
function resolveLegacyCronMigrationId(job) {
  return legacyCronMigrationIds.get(job);
}
function markLegacyCronMigrationIdentity(job, sourceIndex) {
  if (normalizeOptionalStringifiedId(job.id) ?? normalizeOptionalStringifiedId(job.jobId)) return;
  const digest = createHash("sha256").update(JSON.stringify(job)).digest("hex");
  legacyCronMigrationIds.set(job, `cron-migrated-${sourceIndex}-${digest}`);
}
function resolveLegacyCronStatePath(storePath) {
  if (storePath.endsWith(".json")) return storePath.replace(/\.json$/, "-state.json");
  return `${storePath}-state.json`;
}
function createLegacyCronMigrationSource(params) {
  const sourceSha256 = createHash("sha256").update(params.raw).digest("hex");
  const stateSha256 =
    params.stateRaw !== void 0
      ? createHash("sha256").update(params.stateRaw).digest("hex")
      : void 0;
  return {
    sourceKey: `cron-json:${createHash("sha256")
      .update(`${params.sourcePath}\0${sourceSha256}\0${stateSha256 ?? ""}`)
      .digest("hex")}`,
    sourcePath: params.sourcePath,
    sourceSha256,
    statePath: params.statePath,
    stateSha256,
    sourceSizeBytes: Buffer.byteLength(params.raw) + Buffer.byteLength(params.stateRaw ?? ""),
    sourceRecordCount: params.recordCount,
  };
}
async function legacyCronFileExists(filePath) {
  try {
    await fs$1.access(filePath);
    return true;
  } catch (err) {
    if (err.code === "ENOENT") return false;
    throw err;
  }
}
function formatArchiveError(err) {
  return err instanceof Error ? err.message : String(err);
}
function isUnsupportedDirectorySyncError(err) {
  const code = err.code;
  if (code === "EINVAL" || code === "ENOTSUP" || code === "ENOSYS") return true;
  return (
    process.platform === "win32" && (code === "EISDIR" || code === "EPERM" || code === "EACCES")
  );
}
async function syncArchiveDirectory(dirPath) {
  let handle;
  try {
    handle = await fs$1.open(dirPath, "r");
    await handle.sync();
  } catch (err) {
    if (!isUnsupportedDirectorySyncError(err)) throw err;
  } finally {
    await handle?.close();
  }
}
async function sha256File(filePath) {
  return createHash("sha256")
    .update(await fs$1.readFile(filePath))
    .digest("hex");
}
/** Refuse to persist a migration plan built from legacy files that changed after loading. */
async function assertLegacyCronMigrationSourceCurrent(source) {
  if ((await sha256File(source.sourcePath)) !== source.sourceSha256)
    throw new Error("legacy cron source changed while doctor was preparing its migration");
  if (source.stateSha256) {
    if ((await sha256File(source.statePath)) !== source.stateSha256)
      throw new Error("legacy cron state changed while doctor was preparing its migration");
  } else if (await legacyCronFileExists(source.statePath))
    throw new Error("legacy cron state appeared while doctor was preparing its migration");
}
async function restoreArchivedSource(archivePath, sourcePath, expectedSha256) {
  try {
    if (await legacyCronFileExists(sourcePath))
      return {
        ok: false,
        reason: `archive remains at ${archivePath} because a new source exists at ${sourcePath}`,
      };
  } catch (err) {
    return {
      ok: false,
      reason: `archive remains at ${archivePath} because the source path could not be checked: ${formatArchiveError(err)}`,
    };
  }
  try {
    await fs$1.rename(archivePath, sourcePath);
  } catch (err) {
    if (err.code === "EXDEV") {
      const outcome = await copyLegacyCronFileAcrossDevices(
        archivePath,
        sourcePath,
        expectedSha256,
        false,
      );
      return outcome.ok ? { ok: true } : outcome;
    }
    return {
      ok: false,
      reason: `archive remains at ${archivePath} because restoration failed: ${formatArchiveError(err)}`,
    };
  }
  try {
    await syncArchiveDirectory(path.dirname(sourcePath));
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      reason: `the source was restored, but rollback directory sync failed: ${formatArchiveError(err)}`,
    };
  }
}
async function copyLegacyCronFileAcrossDevices(
  filePath,
  initialArchivePath,
  expectedSha256,
  useNumberedArchive = true,
) {
  let archivePath = initialArchivePath;
  let archiveCreated = false;
  let sourceRemoved = false;
  try {
    const sourceStat = await fs$1.stat(filePath);
    if (!sourceStat.isFile()) throw new Error("legacy cron source is not a regular file");
    if (expectedSha256 && (await sha256File(filePath)) !== expectedSha256)
      throw new Error("legacy cron source changed after it was imported; refusing to archive it");
    const sourceMode = sourceStat.mode & 511;
    for (let index = 2; ; index += 1)
      try {
        const archiveHandle = await fs$1.open(archivePath, "wx", sourceMode | 384);
        archiveCreated = true;
        await archiveHandle.close();
        break;
      } catch (err) {
        if (err.code !== "EEXIST" || !useNumberedArchive) throw err;
        archivePath = `${filePath}${LEGACY_CRON_ARCHIVE_SUFFIX}.${index}`;
      }
    await fs$1.copyFile(filePath, archivePath);
    if (expectedSha256 && (await sha256File(archivePath)) !== expectedSha256)
      throw new Error("copied legacy cron archive does not match the imported source");
    await fs$1.chmod(archivePath, sourceMode | 384);
    const archiveHandle = await fs$1.open(archivePath, "r+");
    try {
      await archiveHandle.chmod(sourceMode);
      await archiveHandle.utimes(sourceStat.atime, sourceStat.mtime);
      await archiveHandle.sync();
    } finally {
      await archiveHandle.close();
    }
    await syncArchiveDirectory(path.dirname(archivePath));
    const currentSourceStat = await fs$1.stat(filePath);
    if (
      currentSourceStat.dev !== sourceStat.dev ||
      currentSourceStat.ino !== sourceStat.ino ||
      (expectedSha256 && (await sha256File(filePath)) !== expectedSha256)
    )
      throw new Error("legacy cron source changed during archival; refusing to remove it");
    await fs$1.unlink(filePath);
    sourceRemoved = true;
    await syncArchiveDirectory(path.dirname(filePath));
    return {
      ok: true,
      archivePath,
    };
  } catch (err) {
    if (sourceRemoved)
      return {
        ok: false,
        reason: `${formatArchiveError(err)}; the durable archive is preserved at ${archivePath} because the source was already removed`,
      };
    const cleanupFailures = [];
    if (archiveCreated) {
      let archiveRemoved = false;
      try {
        try {
          await fs$1.unlink(archivePath);
        } catch (cleanupErr) {
          if (cleanupErr.code !== "ENOENT") throw cleanupErr;
        }
        archiveRemoved = true;
        await syncArchiveDirectory(path.dirname(archivePath));
      } catch (cleanupErr) {
        cleanupFailures.push(
          archiveRemoved
            ? `the partial archive was removed, but cleanup directory sync failed: ${formatArchiveError(cleanupErr)}`
            : `partial archive remains at ${archivePath} because cleanup failed: ${formatArchiveError(cleanupErr)}`,
        );
      }
    }
    const cleanupReason = cleanupFailures.length > 0 ? `; ${cleanupFailures.join("; ")}` : "";
    return {
      ok: false,
      reason: `${formatArchiveError(err)}${cleanupReason}`,
    };
  }
}
async function archiveLegacyCronFile(filePath, expectedSha256) {
  let archivePath = `${filePath}${LEGACY_CRON_ARCHIVE_SUFFIX}`;
  try {
    if (!(await legacyCronFileExists(filePath))) return { ok: true };
    for (let index = 2; await legacyCronFileExists(archivePath); index += 1)
      archivePath = `${filePath}${LEGACY_CRON_ARCHIVE_SUFFIX}.${index}`;
  } catch (err) {
    return {
      ok: false,
      reason: formatArchiveError(err),
    };
  }
  try {
    await fs$1.rename(filePath, archivePath);
  } catch (err) {
    if (err?.code !== "EXDEV")
      return {
        ok: false,
        reason: formatArchiveError(err),
      };
    return await copyLegacyCronFileAcrossDevices(filePath, archivePath, expectedSha256);
  }
  try {
    if (expectedSha256 && (await sha256File(archivePath)) !== expectedSha256)
      throw new Error("legacy cron source changed after it was imported; refusing to archive it");
    await syncArchiveDirectory(path.dirname(filePath));
    if (await legacyCronFileExists(filePath))
      return {
        ok: false,
        reason: `the imported source was archived, but a new legacy cron source now exists at ${filePath}`,
      };
    return {
      ok: true,
      archivePath,
    };
  } catch (err) {
    const restoreFailure = await restoreArchivedSource(archivePath, filePath, expectedSha256);
    return {
      ok: false,
      reason: restoreFailure.ok
        ? formatArchiveError(err)
        : `${formatArchiveError(err)}; ${restoreFailure.reason}`,
    };
  }
}
function parseCronStateFile(raw) {
  try {
    const parsed = parseJsonWithJson5Fallback(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const record = parsed;
    if (
      record.version !== 1 ||
      typeof record.jobs !== "object" ||
      record.jobs === null ||
      Array.isArray(record.jobs)
    )
      return null;
    return {
      version: 1,
      jobs: record.jobs,
    };
  } catch {
    return null;
  }
}
function readString(record, key) {
  return normalizeOptionalString(record[key]);
}
function readNumber(record, key) {
  return coerceFiniteScheduleNumber(record[key]);
}
function legacySchedulePayloadFromRecord(schedule) {
  const rawKind = readString(schedule, "kind")?.toLowerCase();
  const expr = readString(schedule, "expr") ?? readString(schedule, "cron");
  const at = readString(schedule, "at");
  const atMs = readNumber(schedule, "atMs");
  const everyMs = readNumber(schedule, "everyMs");
  const anchorMs = readNumber(schedule, "anchorMs");
  const tz = readString(schedule, "tz");
  const staggerMs = normalizeCronStaggerMs(schedule.staggerMs);
  const kind =
    rawKind === "at" || rawKind === "every" || rawKind === "cron"
      ? rawKind
      : at || atMs !== void 0
        ? "at"
        : everyMs !== void 0
          ? "every"
          : expr
            ? "cron"
            : void 0;
  if (kind === "at")
    return at
      ? {
          kind: "at",
          at,
        }
      : atMs !== void 0
        ? {
            kind: "at",
            at: String(atMs),
          }
        : void 0;
  if (kind === "every" && everyMs !== void 0)
    return {
      kind: "every",
      everyMs,
      anchorMs,
    };
  if (kind === "cron" && expr)
    return {
      kind: "cron",
      expr,
      tz,
      staggerMs,
    };
}
function tryLegacyCronScheduleIdentity(job) {
  const schedule =
    job.schedule && typeof job.schedule === "object" && !Array.isArray(job.schedule)
      ? legacySchedulePayloadFromRecord(job.schedule)
      : legacySchedulePayloadFromRecord(job);
  if (!schedule) return;
  return JSON.stringify({
    version: 1,
    enabled: typeof job.enabled === "boolean" ? job.enabled : true,
    schedule,
  });
}
function getRawCronJobs(parsed) {
  return Array.isArray(parsed)
    ? parsed
    : isRecord(parsed) && Array.isArray(parsed.jobs)
      ? parsed.jobs
      : [];
}
function cloneConfigJobs(jobs) {
  return jobs.map((job) => structuredClone(job));
}
async function loadStateFile(statePath) {
  let raw;
  try {
    raw = await fs$1.readFile(statePath, "utf-8");
  } catch (err) {
    if (err?.code === "ENOENT") return { state: null };
    throw new Error(`Failed to read cron state at ${statePath}: ${String(err)}`, { cause: err });
  }
  return {
    state: parseCronStateFile(raw),
    raw,
  };
}
function hasInlineState(jobs) {
  return jobs.some(
    (job) => job != null && isRecord(job.state) && Object.keys(job.state).length > 0,
  );
}
function ensureJobStateObject(job) {
  if (!isRecord(job.state)) job.state = {};
}
function backfillMissingRuntimeFields(job) {
  ensureJobStateObject(job);
  if (typeof job.updatedAtMs !== "number")
    job.updatedAtMs = typeof job.createdAtMs === "number" ? job.createdAtMs : Date.now();
}
function resolveUpdatedAtMs(job, updatedAtMs) {
  if (typeof updatedAtMs === "number" && Number.isFinite(updatedAtMs)) return updatedAtMs;
  if (typeof job.updatedAtMs === "number" && Number.isFinite(job.updatedAtMs))
    return job.updatedAtMs;
  return typeof job.createdAtMs === "number" && Number.isFinite(job.createdAtMs)
    ? job.createdAtMs
    : Date.now();
}
function mergeStateFileEntry(job, entry) {
  if (!isRecord(entry)) {
    backfillMissingRuntimeFields(job);
    return;
  }
  job.updatedAtMs = resolveUpdatedAtMs(job, entry.updatedAtMs);
  job.state = isRecord(entry.state) ? entry.state : {};
  if (
    typeof entry.scheduleIdentity === "string" &&
    entry.scheduleIdentity !== tryLegacyCronScheduleIdentity(job)
  ) {
    ensureJobStateObject(job);
    job.state.nextRunAtMs = void 0;
  }
}
function resolveCronStateId(job) {
  return normalizeOptionalString(job.id) ?? normalizeOptionalString(job.jobId);
}
/** Return true when legacy cron JSON or state files exist for a store path. */
async function legacyCronStoreFilesExist(storePath) {
  const resolvedStorePath = path.resolve(storePath);
  return (
    (await legacyCronFileExists(resolvedStorePath)) ||
    (await legacyCronFileExists(resolveLegacyCronStatePath(resolvedStorePath)))
  );
}
/** Archive legacy cron JSON/state files after successful migration. */
async function archiveLegacyCronStoreForMigration(storePath, source) {
  const resolvedStorePath = path.resolve(storePath);
  const statePath = resolveLegacyCronStatePath(resolvedStorePath);
  const failures = [];
  const archived = [];
  const rollbackArchived = async () => {
    for (const target of archived.toReversed()) {
      const outcome = await restoreArchivedSource(target.archivePath, target.path, target.sha256);
      if (!outcome.ok)
        failures.push({
          path: target.path,
          reason: `archive rollback failed: ${outcome.reason}`,
        });
    }
  };
  const unexpectedStateReason = async () => {
    try {
      return (await legacyCronFileExists(statePath))
        ? "legacy cron state appeared after the store was imported; refusing to archive it"
        : void 0;
    } catch (err) {
      return `legacy cron state path could not be checked: ${formatArchiveError(err)}`;
    }
  };
  if (source && !source.stateSha256) {
    const reason = await unexpectedStateReason();
    if (reason)
      return {
        ok: false,
        failures: [
          {
            path: statePath,
            reason,
          },
        ],
      };
  }
  const targets = source
    ? [
        ...(source.stateSha256
          ? [
              {
                path: statePath,
                sha256: source.stateSha256,
              },
            ]
          : []),
        {
          path: resolvedStorePath,
          sha256: source.sourceSha256,
        },
      ]
    : [{ path: statePath }, { path: resolvedStorePath }];
  for (const target of targets) {
    const outcome = await archiveLegacyCronFile(target.path, target.sha256);
    if (!outcome.ok) {
      failures.push({
        path: target.path,
        reason: outcome.reason,
      });
      await rollbackArchived();
      break;
    }
    if (outcome.archivePath)
      archived.push({
        ...target,
        archivePath: outcome.archivePath,
      });
  }
  if (failures.length === 0 && source) {
    const reason = await unexpectedStateReason();
    if (reason) {
      failures.push({
        path: statePath,
        reason,
      });
      await rollbackArchived();
    }
  }
  return failures.length === 0
    ? { ok: true }
    : {
        ok: false,
        failures,
      };
}
/** Load legacy cron JSON/state files into the current loaded-store shape for migration. */
async function loadLegacyCronStoreForMigration(storePath) {
  const resolvedStorePath = path.resolve(storePath);
  try {
    const raw = await fs$1.readFile(resolvedStorePath, "utf-8");
    let parsed;
    try {
      parsed = parseJsonWithJson5Fallback(raw);
    } catch (err) {
      throw new Error(`Failed to parse cron store at ${resolvedStorePath}: ${String(err)}`, {
        cause: err,
      });
    }
    const rawJobs = getRawCronJobs(parsed);
    const configJobIndexes = [];
    const configRows = [];
    const configJobRuntimeEntries = [];
    const invalidConfigRows = [];
    for (const [index, row] of rawJobs.entries())
      if (isRecord(row)) {
        markLegacyCronMigrationIdentity(row, index);
        configJobIndexes.push(index);
        configRows.push(row);
      } else
        invalidConfigRows.push({
          sourceIndex: index,
          reason: "non-object-row",
          raw: structuredClone(row),
        });
    const store = {
      version: 1,
      jobs: configRows,
    };
    const jobs = store.jobs;
    const configJobs = cloneConfigJobs(configRows);
    const statePath = resolveLegacyCronStatePath(resolvedStorePath);
    const loadedStateFile = await loadStateFile(statePath);
    const stateFile = loadedStateFile.state;
    const hasLegacyInlineState = !stateFile && hasInlineState(jobs);
    if (stateFile)
      for (const job of store.jobs) {
        const stateId = resolveCronStateId(job);
        const entry = stateId ? stateFile.jobs[stateId] : void 0;
        configJobRuntimeEntries.push(isRecord(entry) ? structuredClone(entry) : {});
        if (entry) mergeStateFileEntry(job, entry);
        else backfillMissingRuntimeFields(job);
      }
    else if (!hasLegacyInlineState) for (const job of store.jobs) backfillMissingRuntimeFields(job);
    for (const job of store.jobs) ensureJobStateObject(job);
    return {
      store,
      configJobs,
      configJobIndexes,
      configJobRuntimeEntries,
      invalidConfigRows,
      migrationSource: createLegacyCronMigrationSource({
        sourcePath: resolvedStorePath,
        raw,
        statePath,
        stateRaw: loadedStateFile.raw,
        recordCount: rawJobs.length,
      }),
    };
  } catch (err) {
    if (err?.code === "ENOENT")
      return {
        store: {
          version: 1,
          jobs: [],
        },
        configJobs: [],
        configJobIndexes: [],
        configJobRuntimeEntries: [],
        invalidConfigRows: [],
      };
    throw err;
  }
}
//#endregion
//#region src/commands/doctor/cron/migration-ledger.ts
function migrationRunId(source) {
  return `cron-legacy:${source.sourceKey}`;
}
function hasLegacyCronMigrationReceiptInDatabase(db, source) {
  return (
    executeSqliteQueryTakeFirstSync(
      db,
      getNodeSqliteKysely(db)
        .selectFrom("migration_sources")
        .select("status")
        .where("source_key", "=", source.sourceKey),
    )?.status === "completed"
  );
}
function hasLegacyCronMigrationReceipt(source) {
  return hasLegacyCronMigrationReceiptInDatabase(openOpenClawStateDatabase().db, source);
}
function tableExists(db, tableName) {
  return (
    db
      .prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?")
      .get(tableName) !== void 0
  );
}
function hasLegacyCronMigrationReceiptReadOnly(source) {
  const statePath = resolveOpenClawStateSqlitePath(process.env);
  if (!fs.existsSync(statePath)) return false;
  const db = new (requireNodeSqlite().DatabaseSync)(statePath, { readOnly: true });
  try {
    if (!tableExists(db, "migration_sources")) return false;
    return hasLegacyCronMigrationReceiptInDatabase(db, source);
  } finally {
    db.close();
  }
}
function acquireLegacyCronMigrationReceipt(db, source) {
  if (hasLegacyCronMigrationReceiptInDatabase(db, source)) return false;
  const now = Date.now();
  const runId = migrationRunId(source);
  const reportJson = JSON.stringify({
    source: "legacy-cron-json",
    target: "cron_jobs",
    statePath: source.stateSha256 ? source.statePath : void 0,
    stateSha256: source.stateSha256,
  });
  const kysely = getNodeSqliteKysely(db);
  executeSqliteQuerySync(
    db,
    kysely
      .insertInto("migration_runs")
      .values({
        id: runId,
        started_at: now,
        finished_at: now,
        status: "completed",
        report_json: reportJson,
      })
      .onConflict((conflict) =>
        conflict.column("id").doUpdateSet({
          finished_at: now,
          status: "completed",
          report_json: reportJson,
        }),
      ),
  );
  executeSqliteQuerySync(
    db,
    kysely
      .insertInto("migration_sources")
      .values({
        source_key: source.sourceKey,
        migration_kind: "legacy-cron-json",
        source_path: source.sourcePath,
        target_table: "cron_jobs",
        source_sha256: source.sourceSha256,
        source_size_bytes: source.sourceSizeBytes,
        source_record_count: source.sourceRecordCount,
        last_run_id: runId,
        status: "completed",
        imported_at: now,
        removed_source: 0,
        report_json: reportJson,
      })
      .onConflict((conflict) =>
        conflict.column("source_key").doUpdateSet({
          last_run_id: runId,
          status: "completed",
          imported_at: now,
          removed_source: 0,
          report_json: reportJson,
        }),
      ),
  );
  return true;
}
function markLegacyCronMigrationSourceRemoved(source) {
  runOpenClawStateWriteTransaction(({ db }) => {
    executeSqliteQuerySync(
      db,
      getNodeSqliteKysely(db)
        .updateTable("migration_sources")
        .set({ removed_source: 1 })
        .where("source_key", "=", source.sourceKey),
    );
  });
}
//#endregion
//#region src/commands/doctor/cron/repair-plan.ts
function pluralize$2(count, noun) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}
function formatJobNameList(names) {
  const preview = names.slice(0, 5).map((name) => `\`${name}\``);
  const remaining = names.length - preview.length;
  return remaining > 0 ? `: ${preview.join(", ")} (+${remaining} more)` : `: ${preview.join(", ")}`;
}
/**
 * Advisory for isolated agentTurn cron jobs that describe a command but cannot access shell tools.
 * These need operator attention, but `doctor --fix` cannot safely infer whether to grant tool
 * access or recreate them as command cron jobs.
 */
function formatUnresolvedCommandPromptAdvisory(names) {
  if (names.length === 0) return null;
  const describeVerb = names.length === 1 ? "describes" : "describe";
  const accessVerb = names.length === 1 ? "lacks" : "lack";
  return [
    `${pluralize$2(names.length, "isolated cron job")} ${describeVerb} a shell command in the agent prompt but ${accessVerb} shell/process tool access${formatJobNameList(names)}.`,
    "- This is not the supported shell-tool prompt shape, so doctor cannot prove the job will execute the requested command.",
    '- Recreate the job as a command cron job (`openclaw cron add ... --command "<shell>"`) or grant explicit shell/process tool access before relying on it.',
  ].join("\n");
}
/**
 * Advisory for isolated agentTurn cron jobs that drive shell/process tools from the prompt.
 * These keep running and are not a legacy store row, so `doctor --fix` cannot rewrite them;
 * routing this through the auto-repair preview made the finding persist after every --fix.
 */
function formatUnresolvedShellPromptAdvisory(names) {
  if (names.length === 0) return null;
  const verb = names.length === 1 ? "drives" : "drive";
  const keepVerb = names.length === 1 ? "keeps" : "keep";
  return [
    `${pluralize$2(names.length, "isolated cron job")} ${verb} shell/process tools from the agent prompt and ${keepVerb} running as-is${formatJobNameList(names)}.`,
    "- This is a supported shape, not a legacy store row, so the doctor fix path cannot convert it and the finding is informational only.",
    '- For a deterministic run, recreate the job as a command cron job (`openclaw cron add ... --command "<shell>"`).',
  ].join("\n");
}
/** Convert legacy cron issue counts into doctor preview lines. */
function formatLegacyIssuePreview(issues) {
  const lines = [];
  if (issues.jobId) lines.push(`- ${pluralize$2(issues.jobId, "job")} still uses legacy \`jobId\``);
  if (issues.missingId)
    lines.push(`- ${pluralize$2(issues.missingId, "job")} is missing a canonical string \`id\``);
  if (issues.nonStringId)
    lines.push(`- ${pluralize$2(issues.nonStringId, "job")} stores \`id\` as a non-string value`);
  if (issues.legacyScheduleString)
    lines.push(
      `- ${pluralize$2(issues.legacyScheduleString, "job")} stores schedule as a bare string`,
    );
  if (issues.legacyScheduleCron)
    lines.push(`- ${pluralize$2(issues.legacyScheduleCron, "job")} still uses \`schedule.cron\``);
  if (issues.legacyPayloadKind)
    lines.push(
      `- ${pluralize$2(issues.legacyPayloadKind, "job")} needs payload kind normalization`,
    );
  if (issues.legacyPayloadCodexModel)
    lines.push(
      `- ${pluralize$2(issues.legacyPayloadCodexModel, "job")} still uses legacy \`openai-codex/*\` cron model refs`,
    );
  if (issues.legacyAgentTurnCommandPayload)
    lines.push(
      `- ${pluralize$2(issues.legacyAgentTurnCommandPayload, "job")} uses an agent prompt to run a shell command`,
    );
  if (issues.legacyPayloadProvider)
    lines.push(
      `- ${pluralize$2(issues.legacyPayloadProvider, "job")} still uses payload \`provider\` as a delivery alias`,
    );
  if (issues.legacyTopLevelPayloadFields)
    lines.push(
      `- ${pluralize$2(issues.legacyTopLevelPayloadFields, "job")} still uses top-level payload fields`,
    );
  if (issues.legacyTopLevelDeliveryFields)
    lines.push(
      `- ${pluralize$2(issues.legacyTopLevelDeliveryFields, "job")} still uses top-level delivery fields`,
    );
  if (issues.legacyDeliveryMode)
    lines.push(
      `- ${pluralize$2(issues.legacyDeliveryMode, "job")} still uses delivery mode \`deliver\``,
    );
  if (issues.invalidSchedule)
    lines.push(
      `- ${pluralize$2(issues.invalidSchedule, "job")} has an invalid persisted schedule and will be removed`,
    );
  if (issues.invalidPayload)
    lines.push(
      `- ${pluralize$2(issues.invalidPayload, "job")} has an invalid persisted payload and will be removed`,
    );
  return lines;
}
function cronJobMigrationKey(job) {
  return (
    normalizeOptionalStringifiedId(job.id) ??
    normalizeOptionalStringifiedId(job.jobId) ??
    resolveLegacyCronMigrationId(job)
  );
}
/** Merge legacy JSON jobs into current jobs without duplicating matching ids/jobIds. */
function mergeLegacyCronJobs(params) {
  const merged = [...params.currentJobs];
  const currentKeys = new Set(
    params.currentJobs.map((job) => cronJobMigrationKey(job)).filter((key) => key !== void 0),
  );
  let importedCount = 0;
  for (const legacyJob of params.legacyJobs) {
    const key = cronJobMigrationKey(legacyJob);
    if (key && currentKeys.has(key)) continue;
    if (key) currentKeys.add(key);
    merged.push(legacyJob);
    importedCount += 1;
  }
  return {
    jobs: merged,
    importedCount,
  };
}
/** Attach runtime SQLite state columns back onto a config-defined cron job row. */
function mergeRuntimeEntryIntoConfigJob(params) {
  return {
    ...params.job,
    ...(params.runtimeEntry?.updatedAtMs !== void 0
      ? { updatedAtMs: params.runtimeEntry.updatedAtMs }
      : {}),
    ...(params.runtimeEntry?.state ? { state: structuredClone(params.runtimeEntry.state) } : {}),
  };
}
/** Return true when a SQLite cron projection row no longer matches config JSON. */
function needsSqliteProjectionBackfill(params) {
  if (!params.projectedJob) return true;
  const normalizedConfig = normalizeCronJobInput(params.configJob, { applyDefaults: true });
  if (!normalizedConfig) return true;
  const projected = params.projectedJob;
  for (const field of [
    "agentId",
    "deleteAfterRun",
    "delivery",
    "description",
    "enabled",
    "failureAlert",
    "name",
    "payload",
    "schedule",
    "sessionKey",
    "sessionTarget",
    "wakeMode",
  ])
    if (!isDeepStrictEqual(normalizedConfig[field], projected[field])) return true;
  return false;
}
//#endregion
//#region src/commands/doctor/cron/legacy-delivery.ts
function parseLegacyDeliveryHintsInput(payload) {
  return {
    deliver: parseOptionalField(boolean(), payload.deliver),
    bestEffortDeliver: parseOptionalField(boolean(), payload.bestEffortDeliver),
    channel: parseOptionalField(LowercaseNonEmptyStringFieldSchema, payload.channel),
    provider: parseOptionalField(LowercaseNonEmptyStringFieldSchema, payload.provider),
    to: parseOptionalField(TrimmedNonEmptyStringFieldSchema, payload.to),
    threadId: parseOptionalField(
      DeliveryThreadIdFieldSchema.transform((value) => String(value)),
      payload.threadId,
    ),
  };
}
/** Return true when a payload still carries legacy delivery hint fields. */
function hasLegacyDeliveryHints(payload) {
  const hints = parseLegacyDeliveryHintsInput(payload);
  return (
    hints.deliver !== void 0 ||
    hints.bestEffortDeliver !== void 0 ||
    hints.channel !== void 0 ||
    hints.provider !== void 0 ||
    hints.to !== void 0 ||
    hints.threadId !== void 0
  );
}
/** Build a new delivery object from legacy top-level payload delivery fields. */
function buildDeliveryFromLegacyPayload(payload) {
  const hints = parseLegacyDeliveryHintsInput(payload);
  const next = { mode: hints.deliver === false ? "none" : "announce" };
  if (hints.channel ?? hints.provider) next.channel = hints.channel ?? hints.provider;
  if (hints.to) next.to = hints.to;
  if (hints.threadId) next.threadId = hints.threadId;
  if (hints.bestEffortDeliver !== void 0) next.bestEffort = hints.bestEffortDeliver;
  return next;
}
/** Build a partial delivery patch from legacy payload fields, or null when none exist. */
function buildDeliveryPatchFromLegacyPayload(payload) {
  const hints = parseLegacyDeliveryHintsInput(payload);
  const next = {};
  let hasPatch = false;
  if (hints.deliver === false) {
    next.mode = "none";
    hasPatch = true;
  } else if (
    hints.deliver === true ||
    hints.channel ||
    hints.provider ||
    hints.to ||
    hints.threadId ||
    hints.bestEffortDeliver !== void 0
  ) {
    next.mode = "announce";
    hasPatch = true;
  }
  if (hints.channel ?? hints.provider) {
    next.channel = hints.channel ?? hints.provider;
    hasPatch = true;
  }
  if (hints.to) {
    next.to = hints.to;
    hasPatch = true;
  }
  if (hints.threadId) {
    next.threadId = hints.threadId;
    hasPatch = true;
  }
  if (hints.bestEffortDeliver !== void 0) {
    next.bestEffort = hints.bestEffortDeliver;
    hasPatch = true;
  }
  return hasPatch ? next : null;
}
/** Merge legacy payload delivery hints into an existing delivery object. */
function mergeLegacyDeliveryInto(delivery, payload) {
  const patch = buildDeliveryPatchFromLegacyPayload(payload);
  if (!patch)
    return {
      delivery,
      mutated: false,
    };
  const next = { ...delivery };
  let mutated = false;
  if ("mode" in patch && patch.mode !== next.mode) {
    next.mode = patch.mode;
    mutated = true;
  }
  if ("channel" in patch && patch.channel !== next.channel) {
    next.channel = patch.channel;
    mutated = true;
  }
  if ("to" in patch && patch.to !== next.to) {
    next.to = patch.to;
    mutated = true;
  }
  if ("threadId" in patch && patch.threadId !== next.threadId) {
    next.threadId = patch.threadId;
    mutated = true;
  }
  if ("bestEffort" in patch && patch.bestEffort !== next.bestEffort) {
    next.bestEffort = patch.bestEffort;
    mutated = true;
  }
  return {
    delivery: next,
    mutated,
  };
}
/** Normalize delivery and strip consumed legacy delivery fields from the payload. */
function normalizeLegacyDeliveryInput(params) {
  if (!params.payload || !hasLegacyDeliveryHints(params.payload))
    return {
      delivery: params.delivery ?? void 0,
      mutated: false,
    };
  const nextDelivery = params.delivery
    ? mergeLegacyDeliveryInto(params.delivery, params.payload)
    : {
        delivery: buildDeliveryFromLegacyPayload(params.payload),
        mutated: true,
      };
  stripLegacyDeliveryFields(params.payload);
  return {
    delivery: nextDelivery.delivery,
    mutated: true,
  };
}
function stripLegacyDeliveryFields(payload) {
  if ("deliver" in payload) delete payload.deliver;
  if ("channel" in payload) delete payload.channel;
  if ("provider" in payload) delete payload.provider;
  if ("to" in payload) delete payload.to;
  if ("threadId" in payload) delete payload.threadId;
  if ("bestEffortDeliver" in payload) delete payload.bestEffortDeliver;
}
//#endregion
//#region src/commands/doctor/cron/payload-migration.ts
const LEGACY_AGENT_TURN_COMMAND_MARKER_RE = /\bCommand to run\s*:/iu;
const LEGACY_AGENT_TURN_COMMAND_FIELD_RE = /^\s*-\s*(command|workdir|timeout)\s*:\s*(.*?)\s*$/iu;
const SHELL_TOOL_NAMES = /* @__PURE__ */ new Set([
  "bash",
  "command",
  "exec",
  "process",
  "shell",
  "sh",
]);
const SHELL_COMMAND_MESSAGE_RE =
  /\b(?:bash|command|execute|exec|process|run|shell)\b[\s\S]{0,240}\b(?:python3?|node|bun|pnpm|npm|npx|yarn|sh|bash|sudo|cd|\.\/|\/[A-Za-z0-9._/-]+)\b/iu;
const LEGACY_DELIVERY_HINT_FIELDS = [
  "deliver",
  "bestEffortDeliver",
  "channel",
  "provider",
  "to",
  "threadId",
];
function hasShellToolAccess(toolsAllow) {
  if (toolsAllow === void 0) return true;
  if (!Array.isArray(toolsAllow)) return false;
  return toolsAllow.some((tool) => {
    const normalized = normalizeOptionalLowercaseString(tool);
    return normalized === "*" || (normalized ? SHELL_TOOL_NAMES.has(normalized) : false);
  });
}
function toCanonicalOpenAIModelRef(value) {
  const raw = readStringValue(value);
  if (typeof raw !== "string") return;
  const trimmed = raw.trim();
  const slash = trimmed.indexOf("/");
  if (slash <= 0) return;
  if (trimmed.slice(0, slash).trim().toLowerCase() !== "openai-codex") return;
  const model = trimmed.slice(slash + 1).trim();
  return model ? `openai/${model}` : void 0;
}
function normalizeChannel(value) {
  return normalizeOptionalLowercaseString(value) ?? "";
}
function parsePositiveInteger(value) {
  const trimmed = value.trim();
  if (!/^\d+$/u.test(trimmed)) return;
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : void 0;
}
function readPositiveInteger(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : void 0;
}
function parseLegacyAgentTurnCommandMessage(message) {
  if (!LEGACY_AGENT_TURN_COMMAND_MARKER_RE.test(message)) return null;
  let command = "";
  let cwd;
  let timeoutSeconds;
  for (const line of message.split(/\r?\n/u)) {
    const match = LEGACY_AGENT_TURN_COMMAND_FIELD_RE.exec(line);
    if (!match) continue;
    const key = match[1]?.toLowerCase();
    const value = match[2]?.trim() ?? "";
    if (key === "command" && value && !command) command = value;
    else if (key === "workdir" && value && !cwd) cwd = value;
    else if (key === "timeout" && value && timeoutSeconds === void 0)
      timeoutSeconds = parsePositiveInteger(value);
  }
  if (!command) return null;
  return {
    command,
    ...(cwd ? { cwd } : {}),
    ...(timeoutSeconds ? { timeoutSeconds } : {}),
  };
}
/** Return true when a cron payload contains legacy `openai-codex/*` model refs. */
function hasLegacyOpenAICodexCronModelRef(payload) {
  if (toCanonicalOpenAIModelRef(payload.model)) return true;
  const fallbacks = payload.fallbacks;
  return (
    Array.isArray(fallbacks) && fallbacks.some((fallback) => toCanonicalOpenAIModelRef(fallback))
  );
}
function migrateLegacyOpenAICodexModelRefs(payload) {
  let mutated = false;
  const model = toCanonicalOpenAIModelRef(payload.model);
  if (model && payload.model !== model) {
    payload.model = model;
    mutated = true;
  }
  const fallbacks = payload.fallbacks;
  if (Array.isArray(fallbacks)) {
    const next = fallbacks.map((fallback) => toCanonicalOpenAIModelRef(fallback) ?? fallback);
    if (next.some((fallback, index) => fallback !== fallbacks[index])) {
      payload.fallbacks = next;
      mutated = true;
    }
  }
  return mutated;
}
/** Normalize legacy cron payload channel/provider and model reference fields in place. */
function migrateLegacyCronPayload(payload) {
  let mutated = false;
  const channelValue = readStringValue(payload.channel);
  const providerValue = readStringValue(payload.provider);
  const nextChannel =
    typeof channelValue === "string" && channelValue.trim().length > 0
      ? normalizeChannel(channelValue)
      : typeof providerValue === "string" && providerValue.trim().length > 0
        ? normalizeChannel(providerValue)
        : "";
  if (nextChannel) {
    if (channelValue !== nextChannel) {
      payload.channel = nextChannel;
      mutated = true;
    }
  }
  if ("provider" in payload) {
    delete payload.provider;
    mutated = true;
  }
  if (migrateLegacyOpenAICodexModelRefs(payload)) mutated = true;
  return mutated;
}
function migrateLegacyAgentTurnCommandPayload(payload) {
  if (payload.kind !== "agentTurn") return false;
  const message = readStringValue(payload.message);
  if (typeof message !== "string") return false;
  const parsed = parseLegacyAgentTurnCommandMessage(message);
  if (!parsed) return false;
  if (!hasShellToolAccess(payload.toolsAllow)) return false;
  const timeoutSeconds = readPositiveInteger(payload.timeoutSeconds) ?? parsed.timeoutSeconds;
  const deliveryHints = {};
  for (const key of LEGACY_DELIVERY_HINT_FIELDS)
    if (key in payload) deliveryHints[key] = payload[key];
  for (const key of Object.keys(payload)) delete payload[key];
  payload.kind = "command";
  payload.argv = ["sh", "-lc", parsed.command];
  if (parsed.cwd) payload.cwd = parsed.cwd;
  if (timeoutSeconds !== void 0) payload.timeoutSeconds = timeoutSeconds;
  Object.assign(payload, deliveryHints);
  return true;
}
function classifyUnresolvedAgentTurnShellToolPrompt(payload) {
  if (payload.kind !== "agentTurn") return null;
  const message = readStringValue(payload.message);
  if (typeof message !== "string") return null;
  const parsed = parseLegacyAgentTurnCommandMessage(message);
  const shellToolAccess = hasShellToolAccess(payload.toolsAllow);
  if (parsed && !shellToolAccess) return "commandPromptWithoutShellAccess";
  if (shellToolAccess && SHELL_COMMAND_MESSAGE_RE.test(message)) return "shellToolPrompt";
  return null;
}
//#endregion
//#region src/commands/doctor/cron/store-migration.ts
function incrementIssue(issues, key) {
  issues[key] = (issues[key] ?? 0) + 1;
}
function normalizeStoredCronJobIdentity(raw) {
  const hadIdKey = "id" in raw;
  const hadJobIdKey = "jobId" in raw;
  const id = normalizeOptionalStringifiedId(raw.id);
  const legacyJobId = normalizeOptionalStringifiedId(raw.jobId);
  const canonicalId =
    id ?? legacyJobId ?? resolveLegacyCronMigrationId(raw) ?? `cron-${randomUUID()}`;
  const nonStringIdIssue = hadIdKey && raw.id != null && typeof raw.id !== "string";
  const missingIdIssue = !id && !legacyJobId;
  let mutated = false;
  if (raw.id !== canonicalId) {
    raw.id = canonicalId;
    mutated = true;
  }
  if (hadJobIdKey) {
    delete raw.jobId;
    mutated = true;
  }
  return {
    mutated,
    legacyJobIdIssue: hadJobIdKey,
    missingIdIssue,
    nonStringIdIssue,
  };
}
function normalizePayloadKind(payload) {
  const raw = normalizeOptionalLowercaseString(payload.kind) ?? "";
  if (raw === "agentturn") {
    if (payload.kind !== "agentTurn") {
      payload.kind = "agentTurn";
      return true;
    }
    return false;
  }
  if (raw === "systemevent") {
    if (payload.kind !== "systemEvent") {
      payload.kind = "systemEvent";
      return true;
    }
    return false;
  }
  return false;
}
function inferPayloadIfMissing(raw) {
  const message = normalizeOptionalString(raw.message) ?? "";
  const text = normalizeOptionalString(raw.text) ?? "";
  const command = normalizeOptionalString(raw.command) ?? "";
  if (message) {
    raw.payload = {
      kind: "agentTurn",
      message,
    };
    return true;
  }
  if (text) {
    raw.payload = {
      kind: "systemEvent",
      text,
    };
    return true;
  }
  if (command) {
    raw.payload = {
      kind: "systemEvent",
      text: command,
    };
    return true;
  }
  return false;
}
function copyTopLevelAgentTurnFields(raw, payload) {
  let mutated = false;
  const copyTrimmedString = (field) => {
    if (normalizeOptionalString(payload[field])) return;
    const value = normalizeOptionalString(raw[field]);
    if (value) {
      payload[field] = value;
      mutated = true;
    }
  };
  copyTrimmedString("model");
  copyTrimmedString("thinking");
  if (
    typeof payload.timeoutSeconds !== "number" &&
    typeof raw.timeoutSeconds === "number" &&
    Number.isFinite(raw.timeoutSeconds)
  ) {
    payload.timeoutSeconds = Math.max(0, Math.floor(raw.timeoutSeconds));
    mutated = true;
  }
  if (
    typeof payload.allowUnsafeExternalContent !== "boolean" &&
    typeof raw.allowUnsafeExternalContent === "boolean"
  ) {
    payload.allowUnsafeExternalContent = raw.allowUnsafeExternalContent;
    mutated = true;
  }
  if (typeof payload.deliver !== "boolean" && typeof raw.deliver === "boolean") {
    payload.deliver = raw.deliver;
    mutated = true;
  }
  const channel = normalizeOptionalString(raw.channel);
  if (typeof payload.channel !== "string" && channel) {
    payload.channel = channel;
    mutated = true;
  }
  const to = normalizeOptionalString(raw.to);
  if (typeof payload.to !== "string" && to) {
    payload.to = to;
    mutated = true;
  }
  const rawThreadId = normalizeOptionalString(raw.threadId);
  if (
    !("threadId" in payload) &&
    ((typeof raw.threadId === "number" && Number.isFinite(raw.threadId)) || Boolean(rawThreadId))
  ) {
    payload.threadId = rawThreadId ?? raw.threadId;
    mutated = true;
  }
  if (
    typeof payload.bestEffortDeliver !== "boolean" &&
    typeof raw.bestEffortDeliver === "boolean"
  ) {
    payload.bestEffortDeliver = raw.bestEffortDeliver;
    mutated = true;
  }
  const provider = normalizeOptionalString(raw.provider);
  if (typeof payload.provider !== "string" && provider) {
    payload.provider = provider;
    mutated = true;
  }
  return mutated;
}
function stripLegacyTopLevelFields(raw) {
  if ("model" in raw) delete raw.model;
  if ("thinking" in raw) delete raw.thinking;
  if ("timeoutSeconds" in raw) delete raw.timeoutSeconds;
  if ("allowUnsafeExternalContent" in raw) delete raw.allowUnsafeExternalContent;
  if ("message" in raw) delete raw.message;
  if ("text" in raw) delete raw.text;
  if ("deliver" in raw) delete raw.deliver;
  if ("channel" in raw) delete raw.channel;
  if ("to" in raw) delete raw.to;
  if ("threadId" in raw) delete raw.threadId;
  if ("bestEffortDeliver" in raw) delete raw.bestEffortDeliver;
  if ("provider" in raw) delete raw.provider;
  if ("command" in raw) delete raw.command;
  if ("timeout" in raw) delete raw.timeout;
}
/** Normalize persisted cron jobs in place and report issues plus rows to quarantine. */
function normalizeStoredCronJobs(jobs) {
  const issues = {};
  const unresolvedAgentTurnCommandPromptJobs = [];
  const unresolvedAgentTurnShellToolPromptJobs = [];
  const unresolvedAgentTurnPromptJobsByKind = {
    commandPromptWithoutShellAccess: unresolvedAgentTurnCommandPromptJobs,
    shellToolPrompt: unresolvedAgentTurnShellToolPromptJobs,
  };
  let mutated = false;
  const keptJobs = [];
  const removedJobs = [];
  for (const [sourceIndex, raw] of jobs.entries()) {
    const jobIssues = /* @__PURE__ */ new Set();
    const trackIssue = (key) => {
      if (jobIssues.has(key)) return;
      jobIssues.add(key);
      incrementIssue(issues, key);
    };
    const idNorm = normalizeStoredCronJobIdentity(raw);
    if (idNorm.mutated) mutated = true;
    if (idNorm.legacyJobIdIssue) trackIssue("jobId");
    if (idNorm.missingIdIssue) trackIssue("missingId");
    if (idNorm.nonStringIdIssue) trackIssue("nonStringId");
    const state = raw.state;
    if (!state || typeof state !== "object" || Array.isArray(state)) {
      raw.state = {};
      mutated = true;
    }
    if (typeof raw.schedule === "string") {
      raw.schedule = {
        kind: "cron",
        expr: raw.schedule.trim(),
      };
      mutated = true;
      trackIssue("legacyScheduleString");
    }
    const nameRaw = raw.name;
    if (typeof nameRaw !== "string" || nameRaw.trim().length === 0) {
      raw.name = inferCronJobName({
        schedule: raw.schedule,
        payload: raw.payload,
      });
      mutated = true;
    } else raw.name = nameRaw.trim();
    const desc = normalizeOptionalString(raw.description);
    if (raw.description !== desc) {
      raw.description = desc;
      mutated = true;
    }
    if ("sessionKey" in raw) {
      const sessionKey =
        typeof raw.sessionKey === "string" ? normalizeOptionalString(raw.sessionKey) : void 0;
      if (raw.sessionKey !== sessionKey) {
        raw.sessionKey = sessionKey;
        mutated = true;
      }
    }
    if (typeof raw.enabled !== "boolean") {
      raw.enabled = true;
      mutated = true;
    }
    const wakeModeRaw = normalizeOptionalLowercaseString(raw.wakeMode) ?? "";
    if (wakeModeRaw === "next-heartbeat") {
      if (raw.wakeMode !== "next-heartbeat") {
        raw.wakeMode = "next-heartbeat";
        mutated = true;
      }
    } else if (wakeModeRaw === "now") {
      if (raw.wakeMode !== "now") {
        raw.wakeMode = "now";
        mutated = true;
      }
    } else {
      raw.wakeMode = "now";
      mutated = true;
    }
    const payload = raw.payload;
    if (
      (!payload || typeof payload !== "object" || Array.isArray(payload)) &&
      inferPayloadIfMissing(raw)
    ) {
      mutated = true;
      trackIssue("legacyTopLevelPayloadFields");
    }
    const payloadRecord =
      raw.payload && typeof raw.payload === "object" && !Array.isArray(raw.payload)
        ? raw.payload
        : null;
    if (payloadRecord) {
      if (normalizePayloadKind(payloadRecord)) {
        mutated = true;
        trackIssue("legacyPayloadKind");
      }
      if (!payloadRecord.kind) {
        if (normalizeOptionalString(payloadRecord.message)) {
          payloadRecord.kind = "agentTurn";
          mutated = true;
          trackIssue("legacyPayloadKind");
        } else if (normalizeOptionalString(payloadRecord.text)) {
          payloadRecord.kind = "systemEvent";
          mutated = true;
          trackIssue("legacyPayloadKind");
        }
      }
      if (payloadRecord.kind === "agentTurn" && copyTopLevelAgentTurnFields(raw, payloadRecord))
        mutated = true;
      if (payloadRecord.kind === "systemEvent" && !normalizeOptionalString(payloadRecord.text)) {
        const message = normalizeOptionalString(payloadRecord.message);
        if (message) {
          payloadRecord.text = message;
          delete payloadRecord.message;
          mutated = true;
          trackIssue("legacyPayloadKind");
        }
      }
    }
    const hadLegacyTopLevelPayloadFields =
      "model" in raw ||
      "thinking" in raw ||
      "timeoutSeconds" in raw ||
      "allowUnsafeExternalContent" in raw ||
      "message" in raw ||
      "text" in raw ||
      "command" in raw ||
      "timeout" in raw;
    const hadLegacyTopLevelDeliveryFields =
      "deliver" in raw ||
      "channel" in raw ||
      "to" in raw ||
      "threadId" in raw ||
      "bestEffortDeliver" in raw ||
      "provider" in raw;
    if (hadLegacyTopLevelPayloadFields || hadLegacyTopLevelDeliveryFields) {
      stripLegacyTopLevelFields(raw);
      mutated = true;
      if (hadLegacyTopLevelPayloadFields) trackIssue("legacyTopLevelPayloadFields");
      if (hadLegacyTopLevelDeliveryFields) trackIssue("legacyTopLevelDeliveryFields");
    }
    if (payloadRecord) {
      const hadLegacyPayloadProvider = Boolean(normalizeOptionalString(payloadRecord.provider));
      const hadLegacyPayloadCodexModel = hasLegacyOpenAICodexCronModelRef(payloadRecord);
      if (migrateLegacyCronPayload(payloadRecord)) {
        mutated = true;
        if (hadLegacyPayloadCodexModel) trackIssue("legacyPayloadCodexModel");
        if (hadLegacyPayloadProvider) trackIssue("legacyPayloadProvider");
      }
      if (migrateLegacyAgentTurnCommandPayload(payloadRecord)) {
        mutated = true;
        trackIssue("legacyAgentTurnCommandPayload");
      } else {
        const unresolvedPromptKind = classifyUnresolvedAgentTurnShellToolPrompt(payloadRecord);
        if (unresolvedPromptKind) {
          trackIssue("unresolvedAgentTurnShellToolPrompt");
          const name = normalizeOptionalString(raw.name) ?? normalizeOptionalString(raw.id);
          if (name) unresolvedAgentTurnPromptJobsByKind[unresolvedPromptKind].push(name);
        }
      }
    }
    const schedule = raw.schedule;
    if (schedule && typeof schedule === "object" && !Array.isArray(schedule)) {
      const sched = schedule;
      const kind = normalizeOptionalLowercaseString(sched.kind) ?? "";
      if (!kind && ("at" in sched || "atMs" in sched)) {
        sched.kind = "at";
        mutated = true;
      }
      const atRaw = normalizeOptionalString(sched.at) ?? "";
      const atMsRaw = sched.atMs;
      const parsedAtMs =
        typeof atMsRaw === "number"
          ? atMsRaw
          : typeof atMsRaw === "string"
            ? parseAbsoluteTimeMs(atMsRaw)
            : atRaw
              ? parseAbsoluteTimeMs(atRaw)
              : null;
      const parsedAt = parsedAtMs !== null ? timestampMsToIsoString(parsedAtMs) : void 0;
      const fallbackAtMs = !parsedAt && atRaw ? parseAbsoluteTimeMs(atRaw) : null;
      const fallbackAt = fallbackAtMs !== null ? timestampMsToIsoString(fallbackAtMs) : void 0;
      const normalizedAt = parsedAt ?? fallbackAt;
      if (normalizedAt) {
        sched.at = normalizedAt;
        if ("atMs" in sched) delete sched.atMs;
        mutated = true;
      }
      const everyMsRaw = sched.everyMs;
      const everyMsCoerced = coerceFiniteScheduleNumber(everyMsRaw);
      const everyMs = everyMsCoerced !== void 0 ? Math.floor(everyMsCoerced) : null;
      if (everyMs !== null && everyMsRaw !== everyMs) {
        sched.everyMs = everyMs;
        mutated = true;
      }
      if ((kind === "every" || sched.kind === "every") && everyMs !== null) {
        const anchorRaw = sched.anchorMs;
        const anchorCoerced = coerceFiniteScheduleNumber(anchorRaw);
        const normalizedAnchor =
          anchorCoerced !== void 0
            ? Math.max(0, Math.floor(anchorCoerced))
            : typeof raw.createdAtMs === "number" && Number.isFinite(raw.createdAtMs)
              ? Math.max(0, Math.floor(raw.createdAtMs))
              : typeof raw.updatedAtMs === "number" && Number.isFinite(raw.updatedAtMs)
                ? Math.max(0, Math.floor(raw.updatedAtMs))
                : null;
        if (normalizedAnchor !== null && anchorRaw !== normalizedAnchor) {
          sched.anchorMs = normalizedAnchor;
          mutated = true;
        }
      }
      const exprRaw = normalizeOptionalString(sched.expr) ?? "";
      const legacyCronRaw = normalizeOptionalString(sched.cron) ?? "";
      let normalizedExpr = exprRaw;
      if (!normalizedExpr && legacyCronRaw) {
        normalizedExpr = legacyCronRaw;
        sched.expr = normalizedExpr;
        mutated = true;
        trackIssue("legacyScheduleCron");
      }
      if (typeof sched.expr === "string" && sched.expr !== normalizedExpr) {
        sched.expr = normalizedExpr;
        mutated = true;
      }
      if ("cron" in sched) {
        delete sched.cron;
        mutated = true;
        trackIssue("legacyScheduleCron");
      }
      if ((kind === "cron" || sched.kind === "cron") && normalizedExpr) {
        const explicitStaggerMs = normalizeCronStaggerMs(sched.staggerMs);
        const defaultStaggerMs = resolveDefaultCronStaggerMs(normalizedExpr);
        const targetStaggerMs = explicitStaggerMs ?? defaultStaggerMs;
        if (targetStaggerMs === void 0) {
          if ("staggerMs" in sched) {
            delete sched.staggerMs;
            mutated = true;
          }
        } else if (sched.staggerMs !== targetStaggerMs) {
          sched.staggerMs = targetStaggerMs;
          mutated = true;
        }
      }
    }
    const delivery = raw.delivery;
    if (delivery && typeof delivery === "object" && !Array.isArray(delivery)) {
      const modeRaw = delivery.mode;
      if (typeof modeRaw === "string") {
        if ((normalizeOptionalLowercaseString(modeRaw) ?? "") === "deliver") {
          delivery.mode = "announce";
          mutated = true;
          trackIssue("legacyDeliveryMode");
        }
      } else if (modeRaw === void 0 || modeRaw === null) {
        delivery.mode = "announce";
        mutated = true;
      }
    }
    const isolation = raw.isolation;
    if (isolation && typeof isolation === "object" && !Array.isArray(isolation)) {
      delete raw.isolation;
      mutated = true;
    }
    const payloadKind =
      payloadRecord && typeof payloadRecord.kind === "string" ? payloadRecord.kind : "";
    const rawSessionTarget = normalizeOptionalString(raw.sessionTarget) ?? "";
    const loweredSessionTarget = normalizeLowercaseStringOrEmpty(rawSessionTarget);
    if (loweredSessionTarget === "main" || loweredSessionTarget === "isolated") {
      if (raw.sessionTarget !== loweredSessionTarget) {
        raw.sessionTarget = loweredSessionTarget;
        mutated = true;
      }
    } else if (loweredSessionTarget.startsWith("session:")) {
      const customSessionId = rawSessionTarget.slice(8).trim();
      if (customSessionId) {
        const normalizedSessionTarget = `session:${customSessionId}`;
        if (raw.sessionTarget !== normalizedSessionTarget) {
          raw.sessionTarget = normalizedSessionTarget;
          mutated = true;
        }
      }
    } else if (loweredSessionTarget === "current") {
      if (raw.sessionTarget !== "isolated") {
        raw.sessionTarget = "isolated";
        mutated = true;
      }
    } else {
      const inferredSessionTarget =
        payloadKind === "agentTurn" || payloadKind === "command" ? "isolated" : "main";
      if (raw.sessionTarget !== inferredSessionTarget) {
        raw.sessionTarget = inferredSessionTarget;
        mutated = true;
      }
    }
    const sessionTarget = normalizeOptionalLowercaseString(raw.sessionTarget) ?? "";
    const isIsolatedRunnablePayload =
      sessionTarget === "isolated" ||
      sessionTarget === "current" ||
      sessionTarget.startsWith("session:") ||
      (sessionTarget === "" && (payloadKind === "agentTurn" || payloadKind === "command"));
    const hasDelivery = delivery && typeof delivery === "object" && !Array.isArray(delivery);
    const normalizedLegacy = normalizeLegacyDeliveryInput({
      delivery: hasDelivery ? delivery : null,
      payload: payloadRecord,
    });
    if (isIsolatedRunnablePayload && (payloadKind === "agentTurn" || payloadKind === "command")) {
      if (!hasDelivery && normalizedLegacy.delivery) {
        raw.delivery = normalizedLegacy.delivery;
        mutated = true;
      } else if (!hasDelivery) {
        raw.delivery = { mode: "announce" };
        mutated = true;
      } else if (normalizedLegacy.mutated && normalizedLegacy.delivery) {
        raw.delivery = normalizedLegacy.delivery;
        mutated = true;
      }
    } else if (normalizedLegacy.mutated && normalizedLegacy.delivery) {
      raw.delivery = normalizedLegacy.delivery;
      mutated = true;
    }
    const invalidPersistedReason = getInvalidPersistedCronJobReason(raw);
    if (
      invalidPersistedReason === "missing-schedule" ||
      invalidPersistedReason === "invalid-schedule"
    ) {
      trackIssue("invalidSchedule");
      removedJobs.push({
        job: structuredClone(raw),
        reason: invalidPersistedReason,
        sourceIndex,
      });
      mutated = true;
      continue;
    }
    if (
      invalidPersistedReason === "missing-payload" ||
      invalidPersistedReason === "invalid-payload"
    ) {
      trackIssue("invalidPayload");
      removedJobs.push({
        job: structuredClone(raw),
        reason: invalidPersistedReason,
        sourceIndex,
      });
      mutated = true;
      continue;
    }
    keptJobs.push(raw);
  }
  if (keptJobs.length !== jobs.length) jobs.splice(0, jobs.length, ...keptJobs);
  return {
    issues,
    unresolvedAgentTurnCommandPromptJobs,
    unresolvedAgentTurnShellToolPromptJobs,
    jobs,
    mutated,
    removedJobs,
  };
}
//#endregion
//#region src/commands/doctor/cron/warnings.ts
const LEGACY_WHATSAPP_HEALTH_SCRIPT_RE =
  /(?:^|\s)(?:"[^"]*ensure-whatsapp\.sh"|'[^']*ensure-whatsapp\.sh'|[^\s#;|&]*ensure-whatsapp\.sh)\b/u;
const CRON_MODEL_OVERRIDE_EXAMPLE_LIMIT = 3;
const CRON_DELIVERY_TARGET_ADVISORY_EXAMPLE_LIMIT = 3;
function pluralize$1(count, noun) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}
function normalizeModelProvider(value) {
  const raw = normalizeOptionalString(value);
  if (!raw) return;
  const slash = raw.indexOf("/");
  if (slash <= 0 || slash >= raw.length - 1) return;
  return raw.slice(0, slash).trim().toLowerCase() || void 0;
}
function normalizeModelRef(value) {
  const raw = normalizeOptionalString(value);
  if (!raw) return;
  const slash = raw.indexOf("/");
  if (slash <= 0 || slash >= raw.length - 1) return;
  const provider = raw.slice(0, slash).trim().toLowerCase();
  const model = raw.slice(slash + 1).trim();
  return provider && model ? `${provider}/${model}` : void 0;
}
function normalizeModelMismatchKey(value) {
  return normalizeModelRef(value) ?? normalizeOptionalString(value)?.toLowerCase();
}
function getRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}
function formatSortedCounts(counts) {
  return [...counts.entries()]
    .toSorted(([left], [right]) => left.localeCompare(right))
    .map(([label, count]) => `${label}=${count}`)
    .join(", ");
}
/** Emit a note when cron jobs pin models instead of inheriting the default model. */
function noteCronModelOverrides(params) {
  const defaultModel = resolveAgentModelPrimaryValue(params.cfg.agents?.defaults?.model);
  const defaultKey = normalizeModelMismatchKey(defaultModel);
  const providerCounts = /* @__PURE__ */ new Map();
  const mismatchExamples = [];
  let overrideCount = 0;
  let mismatchCount = 0;
  for (const rawJob of params.jobs) {
    const payload = getRecord(rawJob.payload);
    const kind = normalizeOptionalString(payload?.kind)?.toLowerCase();
    if (kind && kind !== "agentturn") continue;
    const model = normalizeOptionalString(payload?.model);
    if (!model) continue;
    overrideCount += 1;
    const provider = normalizeModelProvider(model) ?? "bare/alias";
    providerCounts.set(provider, (providerCounts.get(provider) ?? 0) + 1);
    const modelKey = normalizeModelMismatchKey(model);
    if (defaultKey && modelKey && modelKey !== defaultKey) {
      mismatchCount += 1;
      if (mismatchExamples.length < CRON_MODEL_OVERRIDE_EXAMPLE_LIMIT) {
        const id = normalizeOptionalString(rawJob.id) ?? normalizeOptionalString(rawJob.jobId);
        const name = normalizeOptionalString(rawJob.name);
        mismatchExamples.push(`${id ?? name ?? "<unnamed>"} -> ${model}`);
      }
    }
  }
  if (overrideCount === 0) return;
  const lines = [
    `Cron model overrides detected at ${shortenHomePath(params.storePath)}.`,
    `- ${pluralize$1(overrideCount, "job")} set \`payload.model\` and will not inherit \`agents.defaults.model\`${defaultModel ? ` (${defaultModel})` : ""}`,
    `- Provider namespaces: ${formatSortedCounts(providerCounts)}`,
  ];
  if (mismatchCount > 0) {
    lines.push(
      `- ${pluralize$1(mismatchCount, "job")} ${mismatchCount === 1 ? "uses" : "use"} a different model than \`agents.defaults.model\`${defaultModel ? ` (${defaultModel})` : ""}`,
    );
    lines.push(`- Examples: ${mismatchExamples.join(", ")}`);
  }
  lines.push(
    `Review with ${formatCliCommand("openclaw cron list")} and ${formatCliCommand("openclaw cron show <job-id>")}; remove \`payload.model\` from jobs that should inherit the default.`,
  );
  note(lines.join("\n"), "Cron");
}
/** Canonicalizes a channel id/alias for comparison, falling back to lowercase for external plugin ids. */
function canonicalChannelKey(value) {
  return normalizeChatChannelId(value) ?? value.trim().toLowerCase();
}
/** Collects the concrete announce channels cron jobs pin, skipping pseudo/relative targets. */
function listConcreteCronDeliveryTargets(jobs) {
  const targets = [];
  for (const job of jobs) {
    if (job.enabled === false) continue;
    if (!getRecord(job.delivery)) continue;
    const plan = resolveCronDeliveryPlan(job);
    if (plan.mode !== "announce" || !plan.channel || plan.channel === "last") continue;
    targets.push({
      channel: plan.channel,
      job,
    });
  }
  return targets;
}
/**
 * Builds an advisory when persisted cron jobs announce to a concrete channel whose plugin
 * is not active in the current config, so their next scheduled run will fail-closed on
 * delivery. Pseudo/relative targets (announce-to-`last`, webhook, `none`) are skipped because
 * they resolve at run time. Observer-only: it never repairs jobs or writes config. The channel
 * list is resolved lazily so doctor skips the read-only channel snapshot when no job can drift.
 * Returns `null` when no job pins a concrete target or every concrete target is active.
 */
function collectCronDeliveryTargetAdvisory(params) {
  const concreteTargets = listConcreteCronDeliveryTargets(params.jobs);
  if (concreteTargets.length === 0) return null;
  const availableKeys = /* @__PURE__ */ new Set();
  for (const id of params.resolveAvailableChannelIds()) {
    const normalized = normalizeOptionalString(id);
    if (normalized) availableKeys.add(canonicalChannelKey(normalized));
  }
  const channelCounts = /* @__PURE__ */ new Map();
  const examples = [];
  let unavailableCount = 0;
  for (const { channel, job } of concreteTargets) {
    if (availableKeys.has(canonicalChannelKey(channel))) continue;
    unavailableCount += 1;
    channelCounts.set(channel, (channelCounts.get(channel) ?? 0) + 1);
    if (examples.length < CRON_DELIVERY_TARGET_ADVISORY_EXAMPLE_LIMIT) {
      const id = normalizeOptionalString(job.id) ?? normalizeOptionalString(job.jobId);
      const name = normalizeOptionalString(job.name);
      examples.push(`${id ?? name ?? "<unnamed>"} -> ${channel}`);
    }
  }
  if (unavailableCount === 0) return null;
  return [
    `Cron delivery targets unavailable channels at ${shortenHomePath(params.storePath)}.`,
    `- ${pluralize$1(unavailableCount, "job")} ${unavailableCount === 1 ? "announces" : "announce"} to a channel whose plugin is not active; the next scheduled run will fail to deliver`,
    `- Channels: ${formatSortedCounts(channelCounts)}`,
    `- Examples: ${examples.join(", ")}`,
    `Reactivate the channel plugin or update the job's \`delivery.channel\` after reviewing with ${formatCliCommand("openclaw cron list")} and ${formatCliCommand("openclaw cron show <job-id>")}.`,
  ].join("\n");
}
/** Emit a note when cron jobs announce to a concrete channel whose plugin is not active. */
function noteCronDeliveryTargetAdvisory(params) {
  let advisory;
  try {
    advisory = collectCronDeliveryTargetAdvisory({
      jobs: params.jobs,
      storePath: params.storePath,
      resolveAvailableChannelIds: () =>
        listReadOnlyChannelPluginsForConfig(params.cfg, {
          includePersistedAuthState: false,
          includeSetupFallbackPlugins: true,
        }).map((plugin) => plugin.id),
    });
  } catch {
    return;
  }
  if (advisory) note(advisory, "Cron");
}
async function readUserCrontab() {
  const result = await runExec("crontab", ["-l"], { logOutput: false });
  return {
    stdout: result.stdout,
    stderr: result.stderr,
  };
}
function coerceCrontabText(crontab) {
  if (typeof crontab === "string") return crontab;
  if (crontab == null) return "";
  if (typeof crontab === "number" || typeof crontab === "boolean" || typeof crontab === "bigint")
    return String(crontab);
  return "";
}
function findLegacyWhatsAppHealthCrontabLines(crontab) {
  return coerceCrontabText(crontab)
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .filter((line) => LEGACY_WHATSAPP_HEALTH_SCRIPT_RE.test(line));
}
/** Return a warning when the user's crontab still runs the old WhatsApp health script. */
async function collectLegacyWhatsAppCrontabHealthWarning(params = {}) {
  if ((params.platform ?? process.platform) !== "linux") return null;
  let crontab;
  try {
    crontab = (await (params.readCrontab ?? readUserCrontab)()).stdout;
  } catch {
    return null;
  }
  const legacyLines = findLegacyWhatsAppHealthCrontabLines(crontab);
  if (legacyLines.length === 0) return null;
  return [
    "Legacy WhatsApp crontab health check detected.",
    "`~/.openclaw/bin/ensure-whatsapp.sh` is not maintained by current OpenClaw and can misreport `Gateway inactive` from cron when the systemd user bus environment is missing.",
    `Remove the stale crontab entry with ${formatCliCommand("crontab -e")}; use ${formatCliCommand("openclaw channels status --probe")}, ${formatCliCommand("openclaw doctor")}, and ${formatCliCommand("openclaw gateway status")} for current health checks.`,
    `Matched ${pluralize$1(legacyLines.length, "entry")}.`,
  ].join("\n");
}
/** Emit the legacy WhatsApp crontab warning when present. */
async function noteLegacyWhatsAppCrontabHealthCheck(params = {}) {
  const warning = await collectLegacyWhatsAppCrontabHealthWarning(params);
  if (warning) note(warning, "Cron");
}
//#endregion
//#region src/commands/doctor/cron/index.ts
function pluralize(count, noun) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}
function formatRunLogMigrationNote(importedFiles) {
  return importedFiles > 0
    ? ` Imported ${pluralize(importedFiles, "legacy cron run log")} into SQLite.`
    : "";
}
function errorMessage(err) {
  return err instanceof Error ? err.message : String(err);
}
function countInFlightCronJobs(jobs) {
  return jobs.filter((job) => {
    const state = job.state;
    return typeof state === "object" && state !== null && typeof state.runningAtMs === "number";
  }).length;
}
const CHRONIC_FAILURE_MIN_CONSECUTIVE_ERRORS = 3;
function countChronicallyFailingCronJobs(jobs) {
  return jobs.filter((job) => {
    if (job.enabled === false) return false;
    const state = job.state;
    if (typeof state !== "object" || state === null) return false;
    const consecutiveErrors = state.consecutiveErrors;
    return (
      typeof consecutiveErrors === "number" &&
      consecutiveErrors >= CHRONIC_FAILURE_MIN_CONSECUTIVE_ERRORS
    );
  }).length;
}
const LEGACY_CRON_STORE_CHECK_ID = "core/doctor/legacy-cron-store";
function legacyCronStoreFinding(params) {
  return {
    checkId: LEGACY_CRON_STORE_CHECK_ID,
    severity: "warning",
    message: params.message,
    path: params.path,
    requirement: params.requirement,
    fixHint:
      params.fixHint ??
      `Run ${formatCliCommand("openclaw doctor --fix")} to normalize legacy cron storage.`,
  };
}
async function loadLegacyCronRepairState(params) {
  const storePath = resolveCronJobsStorePath(params.cfg.cron?.store);
  const quarantinePath = resolveCronQuarantinePath(storePath);
  const legacyStoreDetected = await legacyCronStoreFilesExist(storePath);
  const legacyRunLogDetected = await legacyCronRunLogFilesExist(storePath);
  if (params.onlyIfLegacyDetected && !legacyStoreDetected && !legacyRunLogDetected) return null;
  const loaded = params.readOnly
    ? await loadCronJobsStoreWithConfigJobsReadOnly(storePath)
    : await loadCronJobsStoreWithConfigJobs(storePath);
  const currentJobs =
    loaded.configJobs.length > 0
      ? loaded.configJobs.map((job, index) =>
          mergeRuntimeEntryIntoConfigJob({
            job,
            runtimeEntry: loaded.configJobRuntimeEntries[index],
          }),
        )
      : loaded.store.jobs;
  const sqliteProjectionBackfillCount =
    loaded.configJobs.length > 0
      ? currentJobs.filter((job, index) =>
          needsSqliteProjectionBackfill({
            configJob: job,
            projectedJob: loaded.store.jobs[index],
          }),
        ).length
      : 0;
  let rawJobs = currentJobs;
  let legacyImportCount = 0;
  let legacyMigrationSource;
  let legacyMigrationAlreadyImported = false;
  if (legacyStoreDetected) {
    const loadedLegacy = await loadLegacyCronStoreForMigration(storePath);
    legacyMigrationSource = loadedLegacy.migrationSource;
    legacyMigrationAlreadyImported = legacyMigrationSource
      ? params.readOnly
        ? hasLegacyCronMigrationReceiptReadOnly(legacyMigrationSource)
        : hasLegacyCronMigrationReceipt(legacyMigrationSource)
      : false;
    if (!legacyMigrationAlreadyImported) {
      const merged = mergeLegacyCronJobs({
        currentJobs: rawJobs,
        legacyJobs: loadedLegacy.store.jobs,
      });
      rawJobs = merged.jobs;
      legacyImportCount = merged.importedCount;
    }
  }
  return {
    storePath,
    quarantinePath,
    legacyStoreDetected,
    legacyRunLogDetected,
    legacyMigrationSource,
    legacyMigrationAlreadyImported,
    legacyImportCount,
    sqliteProjectionBackfillCount,
    rawJobs,
  };
}
async function applyLegacyCronStoreRepair(params) {
  const { state } = params;
  const changes = [];
  const warnings = [];
  const normalized = params.normalized ?? normalizeStoredCronJobs(state.rawJobs);
  const legacyWebhook = normalizeOptionalString(params.cfg.cron?.webhook);
  const notifyMigration = migrateLegacyNotifyFallback({
    jobs: state.rawJobs,
    legacyWebhook,
  });
  const dreamingMigration = migrateLegacyDreamingPayloadShape(state.rawJobs);
  warnings.push(...notifyMigration.warnings);
  const storeChanged =
    (state.legacyStoreDetected && !state.legacyMigrationAlreadyImported) ||
    state.sqliteProjectionBackfillCount > 0 ||
    normalized.mutated ||
    notifyMigration.changed ||
    dreamingMigration.changed;
  if (
    !(state.legacyStoreDetected || state.legacyRunLogDetected || storeChanged) &&
    warnings.length === 0
  )
    return {
      changes,
      warnings,
    };
  if (storeChanged)
    try {
      if (normalized.removedJobs.length > 0)
        await saveCronQuarantineFile({
          storePath: state.storePath,
          nowMs: Date.now(),
          entries: normalized.removedJobs.map((entry) => ({
            sourceIndex: entry.sourceIndex,
            reason: entry.reason,
            job: entry.job,
          })),
        });
      const store = {
        version: 1,
        jobs: state.rawJobs,
      };
      const migrationSource = state.legacyMigrationSource;
      if (migrationSource && !state.legacyMigrationAlreadyImported) {
        await assertLegacyCronMigrationSourceCurrent(migrationSource);
        await saveCronJobsStoreWithMetadata(state.storePath, store, (db) => {
          return acquireLegacyCronMigrationReceipt(db, migrationSource);
        });
      } else await saveCronJobsStore(state.storePath, store);
    } catch (err) {
      return {
        changes,
        warnings: [
          ...warnings,
          `Failed writing migrated cron store at ${shortenHomePath(state.storePath)}: ${errorMessage(err)}`,
        ],
      };
    }
  let importedRunLogs = 0;
  if (state.legacyRunLogDetected)
    try {
      importedRunLogs = (await migrateLegacyCronRunLogsToSqlite(state.storePath)).importedFiles;
    } catch (err) {
      warnings.push(
        `Failed importing legacy cron run logs at ${shortenHomePath(state.storePath)}: ${errorMessage(err)}`,
      );
    }
  if (state.legacyStoreDetected) {
    const archiveResult = await archiveLegacyCronStoreForMigration(
      state.storePath,
      state.legacyMigrationSource,
    );
    if (archiveResult.ok) {
      if (state.legacyMigrationSource)
        try {
          markLegacyCronMigrationSourceRemoved(state.legacyMigrationSource);
        } catch (err) {
          warnings.push(
            `Cron store was archived, but its migration receipt could not be finalized: ${errorMessage(err)}`,
          );
        }
      changes.push(
        `Cron store migrated to SQLite at ${shortenHomePath(state.storePath)}.${formatRunLogMigrationNote(importedRunLogs)}`,
      );
    } else
      for (const failure of archiveResult.failures)
        warnings.push(
          `Migrated cron jobs to SQLite but could not archive the legacy cron file at ${shortenHomePath(failure.path)}: ${failure.reason}. Remove it manually or rerun ${formatCliCommand("openclaw doctor --fix")} to retry.`,
        );
  } else if (state.legacyRunLogDetected && importedRunLogs > 0)
    changes.push(
      `Cron run logs migrated to SQLite at ${shortenHomePath(state.storePath)}.${formatRunLogMigrationNote(importedRunLogs)}`,
    );
  else if (storeChanged)
    changes.push(`Cron store normalized at ${shortenHomePath(state.storePath)}.`);
  if (dreamingMigration.rewrittenCount > 0)
    changes.push(
      `Rewrote ${pluralize(dreamingMigration.rewrittenCount, "managed dreaming job")} to run as an isolated agent turn so dreaming no longer requires heartbeat.`,
    );
  return {
    changes,
    warnings,
  };
}
async function collectLegacyCronStoreHealthFindings(params) {
  let state;
  try {
    state = await loadLegacyCronRepairState({
      cfg: params.cfg,
      readOnly: true,
    });
  } catch (err) {
    const storePath = resolveCronJobsStorePath(params.cfg.cron?.store);
    return [
      legacyCronStoreFinding({
        message: `Unable to read cron job store at ${shortenHomePath(storePath)}.`,
        path: storePath,
        requirement: "cron-store-readable",
        fixHint: [
          `Fix the file's permissions or contents and re-run ${formatCliCommand("openclaw doctor")}.`,
          "Later health checks will continue.",
          `Details: ${errorMessage(err)}`,
        ].join(" "),
      }),
    ];
  }
  if (!state) return [];
  const findings = [];
  const {
    storePath,
    quarantinePath,
    legacyStoreDetected,
    legacyRunLogDetected,
    legacyImportCount,
    sqliteProjectionBackfillCount,
    rawJobs,
  } = state;
  try {
    const quarantine = await loadCronQuarantineFile(quarantinePath);
    if (quarantine.jobs.length > 0)
      findings.push(
        legacyCronStoreFinding({
          message: `${pluralize(quarantine.jobs.length, "quarantined cron job row")} found at ${shortenHomePath(quarantinePath)}.`,
          path: quarantinePath,
          requirement: "quarantined-cron-rows",
          fixHint: `Review or repair the quarantined rows manually before copying any job back into ${shortenHomePath(storePath)}.`,
        }),
      );
  } catch (err) {
    findings.push(
      legacyCronStoreFinding({
        message: `Unable to read quarantined cron rows at ${shortenHomePath(quarantinePath)}.`,
        path: quarantinePath,
        requirement: "cron-quarantine-readable",
        fixHint: `Fix the quarantine file's permissions or contents. Details: ${errorMessage(err)}`,
      }),
    );
  }
  if (legacyStoreDetected)
    findings.push(
      legacyCronStoreFinding({
        message:
          legacyImportCount > 0
            ? `${pluralize(legacyImportCount, "legacy JSON cron job")} will be imported into SQLite.`
            : `Legacy JSON cron store was found at ${shortenHomePath(storePath)}.`,
        path: storePath,
        requirement: "legacy-cron-store",
      }),
    );
  if (legacyRunLogDetected)
    findings.push(
      legacyCronStoreFinding({
        message: `Legacy JSON cron run logs will be imported into SQLite for ${shortenHomePath(storePath)}.`,
        path: storePath,
        requirement: "legacy-cron-run-logs",
      }),
    );
  if (rawJobs.length === 0) return findings;
  const normalized = normalizeStoredCronJobs(rawJobs);
  for (const line of formatLegacyIssuePreview(normalized.issues))
    findings.push(
      legacyCronStoreFinding({
        message: line.replace(/^- /u, ""),
        path: storePath,
        requirement: "legacy-cron-store-shape",
      }),
    );
  if (sqliteProjectionBackfillCount > 0)
    findings.push(
      legacyCronStoreFinding({
        message: `${pluralize(sqliteProjectionBackfillCount, "SQLite cron row")} will be backfilled from stored config JSON into split columns.`,
        path: storePath,
        requirement: "sqlite-projection-backfill",
      }),
    );
  const notifyCount = rawJobs.filter((job) => job.notify === true).length;
  if (notifyCount > 0)
    findings.push(
      legacyCronStoreFinding({
        message: `${pluralize(notifyCount, "job")} still uses legacy notify webhook fallback.`,
        path: storePath,
        requirement: "legacy-notify-fallback",
      }),
    );
  const dreamingStaleCount = countStaleDreamingJobs(rawJobs);
  if (dreamingStaleCount > 0)
    findings.push(
      legacyCronStoreFinding({
        message: `${pluralize(dreamingStaleCount, "managed dreaming job")} still has the legacy heartbeat-coupled shape.`,
        path: storePath,
        requirement: "legacy-dreaming-payload",
      }),
    );
  return findings;
}
async function repairLegacyCronStoreWithoutPrompt(params) {
  const storePath = resolveCronJobsStorePath(normalizeOptionalString(params.cfg.cron?.store));
  let state;
  try {
    state = await loadLegacyCronRepairState({
      cfg: params.cfg,
      onlyIfLegacyDetected: true,
    });
  } catch (err) {
    return {
      changes: [],
      warnings: [
        `Failed reading legacy cron storage at ${shortenHomePath(storePath)}: ${errorMessage(err)}`,
      ],
    };
  }
  if (!state)
    return {
      changes: [],
      warnings: [],
    };
  return await applyLegacyCronStoreRepair({
    cfg: params.cfg,
    state,
  });
}
function noteLegacyCronRepairResult(result) {
  if (result.changes.length > 0) note(result.changes.join("\n"), "Doctor changes");
  if (result.warnings.length > 0) note(result.warnings.join("\n"), "Doctor warnings");
}
/** Inspect cron storage and optionally repair legacy JSON/SQLite/payload shapes. */
async function maybeRepairLegacyCronStore(params) {
  let state;
  try {
    state = await loadLegacyCronRepairState({ cfg: params.cfg });
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    note(
      [
        `Unable to read cron job store at ${shortenHomePath(resolveCronJobsStorePath(params.cfg.cron?.store))}.`,
        `- ${reason}`,
        `Fix the file's permissions or contents and re-run ${formatCliCommand("openclaw doctor")}; later health checks will continue.`,
      ].join("\n"),
      "Cron",
    );
    return;
  }
  if (!state) return;
  const {
    storePath,
    quarantinePath,
    legacyStoreDetected,
    legacyRunLogDetected,
    legacyImportCount,
    sqliteProjectionBackfillCount,
    rawJobs,
  } = state;
  try {
    const quarantine = await loadCronQuarantineFile(quarantinePath);
    if (quarantine.jobs.length > 0)
      note(
        [
          `Quarantined cron job rows found at ${shortenHomePath(quarantinePath)}.`,
          `- ${pluralize(quarantine.jobs.length, "row")} was removed from the active cron store after runtime validation failed.`,
          `- Review or repair the quarantined rows manually before copying any job back into ${shortenHomePath(storePath)}.`,
        ].join("\n"),
        "Cron",
      );
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    note(
      [
        `Unable to read quarantined cron rows at ${shortenHomePath(quarantinePath)}.`,
        `- ${reason}`,
      ].join("\n"),
      "Cron",
    );
  }
  if (rawJobs.length === 0) {
    if (!legacyStoreDetected && !legacyRunLogDetected) return;
    const previewLines = [];
    if (legacyStoreDetected)
      previewLines.push("- legacy JSON cron store will be archived after SQLite migration");
    if (legacyRunLogDetected)
      previewLines.push("- legacy JSON cron run logs will be imported into SQLite");
    note(
      [
        `Legacy cron storage detected at ${shortenHomePath(storePath)}.`,
        ...previewLines,
        `Repair with ${formatCliCommand("openclaw doctor --fix")} to finish the migration.`,
      ].join("\n"),
      "Cron",
    );
    if (
      !(await params.prompter.confirm({
        message: "Repair legacy cron jobs now?",
        initialValue: true,
      }))
    )
      return;
    noteLegacyCronRepairResult(
      await applyLegacyCronStoreRepair({
        cfg: params.cfg,
        state,
      }),
    );
    return;
  }
  noteCronModelOverrides({
    cfg: params.cfg,
    jobs: rawJobs,
    storePath,
  });
  noteCronDeliveryTargetAdvisory({
    cfg: params.cfg,
    jobs: rawJobs,
    storePath,
  });
  const inFlightCount = countInFlightCronJobs(rawJobs);
  if (inFlightCount > 0) {
    const subject = inFlightCount === 1 ? "it" : "them";
    note(
      [
        `${pluralize(inFlightCount, "cron job")} ${inFlightCount === 1 ? "is" : "are"} still marked in-flight (\`state.runningAtMs\` is set), so ${formatCliCommand("openclaw cron list")} shows ${subject} as \`running\`.`,
        `- If no gateway is currently executing ${subject}, the marker is left over from an interrupted run; the gateway marks such runs interrupted the next time it starts.`,
        `- Review with ${formatCliCommand("openclaw cron list")} or ${formatCliCommand("openclaw cron show <id>")}.`,
      ].join("\n"),
      "Cron",
    );
  }
  const chronicFailureCount = countChronicallyFailingCronJobs(rawJobs);
  if (chronicFailureCount > 0)
    note(
      [
        `${pluralize(chronicFailureCount, "cron job")} ${chronicFailureCount === 1 ? "has" : "have"} failed ${CHRONIC_FAILURE_MIN_CONSECUTIVE_ERRORS}+ runs in a row (\`state.consecutiveErrors\`), so the scheduler only re-fires ${chronicFailureCount === 1 ? "it" : "them"} on error backoff.`,
        `- The count resets on the next successful run and also counts runs interrupted by a gateway restart, so a lasting streak means repeated task failures, repeatedly interrupted runs, or a mix. Failure alerts are opt-in, so this may be the only notice.`,
        `- Review with ${formatCliCommand("openclaw cron list")} or ${formatCliCommand("openclaw cron show <id>")}.`,
      ].join("\n"),
      "Cron",
    );
  const normalized = normalizeStoredCronJobs(rawJobs);
  const notifyCount = rawJobs.filter((job) => job.notify === true).length;
  const dreamingStaleCount = countStaleDreamingJobs(rawJobs);
  const commandPromptAdvisory = formatUnresolvedCommandPromptAdvisory(
    normalized.unresolvedAgentTurnCommandPromptJobs,
  );
  if (commandPromptAdvisory) note(commandPromptAdvisory, "Cron");
  const shellPromptAdvisory = formatUnresolvedShellPromptAdvisory(
    normalized.unresolvedAgentTurnShellToolPromptJobs,
  );
  if (shellPromptAdvisory) note(shellPromptAdvisory, "Cron");
  const previewLines = formatLegacyIssuePreview(normalized.issues);
  if (legacyStoreDetected)
    previewLines.unshift(
      legacyImportCount > 0
        ? `- ${pluralize(legacyImportCount, "legacy JSON cron job")} will be imported into SQLite`
        : "- legacy JSON cron store will be archived after SQLite migration",
    );
  if (legacyRunLogDetected)
    previewLines.push("- legacy JSON cron run logs will be imported into SQLite");
  if (sqliteProjectionBackfillCount > 0)
    previewLines.push(
      `- ${pluralize(sqliteProjectionBackfillCount, "SQLite cron row")} will be backfilled from stored config JSON into split columns`,
    );
  if (notifyCount > 0)
    previewLines.push(
      `- ${pluralize(notifyCount, "job")} still uses legacy \`notify: true\` webhook fallback`,
    );
  if (dreamingStaleCount > 0)
    previewLines.push(
      `- ${pluralize(dreamingStaleCount, "managed dreaming job")} still has the legacy heartbeat-coupled shape`,
    );
  if (previewLines.length === 0 && !legacyStoreDetected) return;
  note(
    [
      legacyStoreDetected
        ? `Legacy cron job storage detected at ${shortenHomePath(storePath)}.`
        : `Cron store issues detected at ${shortenHomePath(storePath)}.`,
      ...previewLines,
      `Repair with ${formatCliCommand("openclaw doctor --fix")} to normalize the store before the next scheduler run.`,
    ].join("\n"),
    "Cron",
  );
  if (
    !(await params.prompter.confirm({
      message: "Repair legacy cron jobs now?",
      initialValue: true,
    }))
  )
    return;
  noteLegacyCronRepairResult(
    await applyLegacyCronStoreRepair({
      cfg: params.cfg,
      state,
      normalized,
    }),
  );
}
//#endregion
export {
  collectLegacyCronStoreHealthFindings,
  collectLegacyWhatsAppCrontabHealthWarning,
  maybeRepairLegacyCronStore,
  noteLegacyWhatsAppCrontabHealthCheck,
  repairLegacyCronStoreWithoutPrompt,
};
