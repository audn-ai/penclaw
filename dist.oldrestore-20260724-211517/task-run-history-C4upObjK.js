import { n as sha256Base64Url } from "./crypto-digest-CNeb2i19.js";
import {
  _ as cronTaskRecordStoreKey,
  v as cronTaskRecordToRunLogEntry,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import { t as stableStringify } from "./stable-stringify-Cd9_EGsU.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { v as uniqueValues } from "./string-normalization-CRyoFBPt.js";
import { o as listTaskRegistryRecordsByRuntimeSourceIdFromSqlite } from "./task-registry.store.sqlite-W50bLikV.js";
//#region src/cron/list-snapshot-revision.ts
function resolveCronListSnapshotRevision(jobs) {
  return `sha256:${sha256Base64Url(stableStringify(jobs))}`;
}
//#endregion
//#region src/cron/task-run-history.ts
/** Cron run-history reads backed by authoritative task-ledger rows. */
const INVALID_CRON_TASK_RUN_JOB_ID_MESSAGE = "invalid cron task run job id";
function normalizeCronTaskRunJobId(jobId) {
  const trimmed = jobId.trim();
  if (!trimmed || trimmed.includes("/") || trimmed.includes("\\") || trimmed.includes("\0"))
    throw new Error(INVALID_CRON_TASK_RUN_JOB_ID_MESSAGE);
  return trimmed;
}
function isInvalidCronTaskRunJobIdError(error) {
  return error instanceof Error && error.message === INVALID_CRON_TASK_RUN_JOB_ID_MESSAGE;
}
function normalizeStatuses(options) {
  if (options.statuses?.length) {
    const statuses = options.statuses.filter(isCronRunStatus);
    if (statuses.length > 0) return uniqueValues(statuses);
  }
  return isCronRunStatus(options.status) ? [options.status] : null;
}
function isCronRunStatus(value) {
  return value === "ok" || value === "error" || value === "skipped";
}
function isCronDeliveryStatus(value) {
  return (
    value === "delivered" ||
    value === "not-delivered" ||
    value === "unknown" ||
    value === "not-requested"
  );
}
function normalizeDeliveryStatuses(options) {
  if (options.deliveryStatuses?.length) {
    const statuses = options.deliveryStatuses.filter(isCronDeliveryStatus);
    if (statuses.length > 0) return uniqueValues(statuses);
  }
  return isCronDeliveryStatus(options.deliveryStatus) ? [options.deliveryStatus] : null;
}
function queryText(entry, jobNameById) {
  return [
    entry.summary ?? "",
    entry.error ?? "",
    entry.errorReason ?? "",
    entry.diagnostics?.summary ?? "",
    ...(entry.diagnostics?.entries ?? []).map((diagnostic) => diagnostic.message),
    entry.jobId,
    jobNameById?.[entry.jobId] ?? "",
    entry.delivery?.intended?.channel ?? "",
    entry.delivery?.resolved?.channel ?? "",
    ...(entry.delivery?.messageToolSentTo ?? []).map((target) => target.channel),
  ].join(" ");
}
function compareHistoryRows(left, right, direction) {
  const multiplier = direction === "asc" ? 1 : -1;
  return (
    multiplier * (left.entry.ts - right.entry.ts) ||
    multiplier * (left.task.createdAt - right.task.createdAt) ||
    multiplier * left.task.taskId.localeCompare(right.task.taskId)
  );
}
function attachJobNames(entries, jobNameById) {
  for (const entry of entries) {
    const jobName = jobNameById?.[entry.jobId];
    if (jobName) entry.jobName = jobName;
  }
}
/** Reads and filters cron task rows with the legacy run-history paging contract. */
function readCronTaskRunHistoryPage(options) {
  const jobId = options.jobId ? normalizeCronTaskRunJobId(options.jobId) : void 0;
  const limit = Math.max(1, Math.min(200, Math.floor(options.limit ?? 50)));
  const offset = Math.max(0, Math.floor(options.offset ?? 0));
  const statuses = normalizeStatuses(options);
  const deliveryStatuses = normalizeDeliveryStatuses(options);
  const runId = normalizeOptionalString(options.runId);
  const jobIds = options.jobIds ? new Set(options.jobIds) : void 0;
  const query = normalizeLowercaseStringOrEmpty(options.query);
  const sortDir = options.sortDir === "asc" ? "asc" : "desc";
  const rows = listTaskRegistryRecordsByRuntimeSourceIdFromSqlite({
    runtime: "cron",
    sourceId: jobId,
  })
    .filter((task) => cronTaskRecordStoreKey(task) === options.storeKey)
    .map((task) => ({
      task,
      entry: cronTaskRecordToRunLogEntry(task),
    }))
    .filter((row) => row.entry !== null)
    .filter(({ entry }) => {
      if (jobIds && !jobIds.has(entry.jobId)) return false;
      if (runId && entry.runId !== runId) return false;
      if (statuses && (!entry.status || !statuses.includes(entry.status))) return false;
      if (deliveryStatuses && !deliveryStatuses.includes(entry.deliveryStatus ?? "not-requested"))
        return false;
      return (
        !query ||
        normalizeLowercaseStringOrEmpty(queryText(entry, options.jobNameById)).includes(query)
      );
    })
    .toSorted((left, right) => compareHistoryRows(left, right, sortDir));
  const total = rows.length;
  const boundedOffset = Math.min(total, offset);
  const entries = rows.slice(boundedOffset, boundedOffset + limit).map(({ entry }) => entry);
  attachJobNames(entries, options.jobNameById);
  const nextOffset = boundedOffset + entries.length;
  return {
    entries,
    total,
    offset: boundedOffset,
    limit,
    hasMore: nextOffset < total,
    nextOffset: nextOffset < total ? nextOffset : null,
  };
}
//#endregion
export {
  resolveCronListSnapshotRevision as i,
  normalizeCronTaskRunJobId as n,
  readCronTaskRunHistoryPage as r,
  isInvalidCronTaskRunJobIdError as t,
};
