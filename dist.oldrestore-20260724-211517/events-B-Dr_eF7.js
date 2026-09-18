import "./fs-safe-RNq3oO57.js";
import fs from "node:fs/promises";
import path from "node:path";
import { t as appendRegularFile } from "./regular-file-CuvhUtZS.js";
//#region src/memory-host-sdk/events.ts
/** Workspace-relative JSONL audit log for memory recall, promotion, and dream events. */
const MEMORY_HOST_EVENT_LOG_RELATIVE_PATH = path.join("memory", ".dreams", "events.jsonl");
/** Resolve the event log path inside a workspace without touching the filesystem. */
function resolveMemoryHostEventLogPath(workspaceDir) {
  return path.join(workspaceDir, MEMORY_HOST_EVENT_LOG_RELATIVE_PATH);
}
/** Append one memory host event, creating the dreams directory with symlink-safe writes. */
async function appendMemoryHostEvent(workspaceDir, event) {
  const eventLogPath = resolveMemoryHostEventLogPath(workspaceDir);
  await fs.mkdir(path.dirname(eventLogPath), { recursive: true });
  await appendRegularFile({
    filePath: eventLogPath,
    content: `${JSON.stringify(event)}\n`,
    rejectSymlinkParents: true,
  });
}
function parseMemoryHostEventRecord(line) {
  try {
    const record = JSON.parse(line);
    if (
      record.type === "memory.recall.recorded" ||
      record.type === "memory.recall.skipped" ||
      record.type === "memory.promotion.applied" ||
      record.type === "memory.dream.completed"
    )
      return record;
  } catch {}
  return null;
}
async function readMemoryHostEventRecordsRaw(params) {
  const eventLogPath = resolveMemoryHostEventLogPath(params.workspaceDir);
  const raw = await fs.readFile(eventLogPath, "utf8").catch((err) => {
    if (err?.code === "ENOENT") return "";
    throw err;
  });
  if (!raw.trim()) return [];
  const events = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      const record = parseMemoryHostEventRecord(line);
      return record ? [record] : [];
    });
  if (!Number.isFinite(params.limit)) return events;
  const limit = Math.max(0, Math.floor(params.limit));
  return limit === 0 ? [] : events.slice(-limit);
}
function applyMemoryHostEventLimit(events, limit) {
  if (!Number.isFinite(limit)) return events;
  const normalizedLimit = Math.max(0, Math.floor(limit));
  return normalizedLimit === 0 ? [] : events.slice(-normalizedLimit);
}
/** Read recent memory host events, ignoring corrupt JSONL lines left by partial writes. */
async function readMemoryHostEvents(params) {
  return applyMemoryHostEventLimit(
    (await readMemoryHostEventRecordsRaw({ workspaceDir: params.workspaceDir })).filter(
      (event) => event.type !== "memory.recall.skipped",
    ),
    params.limit,
  );
}
/** Read recent memory host event records, including opt-in diagnostic variants. */
async function readMemoryHostEventRecords(params) {
  return await readMemoryHostEventRecordsRaw(params);
}
//#endregion
export {
  resolveMemoryHostEventLogPath as a,
  readMemoryHostEvents as i,
  appendMemoryHostEvent as n,
  readMemoryHostEventRecords as r,
  MEMORY_HOST_EVENT_LOG_RELATIVE_PATH as t,
};
