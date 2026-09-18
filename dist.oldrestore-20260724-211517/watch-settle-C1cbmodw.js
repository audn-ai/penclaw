import fs from "node:fs";
import "./runtime-env-D0V-7Gqz.js";
import path from "node:path";
import { t as sleep } from "./sleep-DZm1epyW.js";
//#region extensions/memory-core/src/memory/watch-pressure.ts
const MEMORY_WATCH_PRESSURE_WARNING_THRESHOLD = 2e3;
function countChokidarWatchedEntries(watcher) {
  const watched = watcher.getWatched();
  let count = Object.keys(watched).length;
  for (const entries of Object.values(watched)) count += entries.length;
  return count;
}
function warnIfMemoryWatchPressureHigh(state, count, unit, pressureDetail, remediation, warn) {
  if (state.shown || count <= MEMORY_WATCH_PRESSURE_WARNING_THRESHOLD) return false;
  state.shown = true;
  warn(`Memory file watching is tracking ${count} ${unit}. ${pressureDetail} ${remediation}`);
  return true;
}
//#endregion
//#region extensions/memory-core/src/memory/watch-settle.ts
const MEMORY_WATCH_SETTLE_RECHECK_MS = 100;
function snapshotFromStats(stats) {
  if (!stats || stats.isDirectory?.()) return null;
  if (typeof stats.size !== "number" || typeof stats.mtimeMs !== "number") return null;
  return {
    size: stats.size,
    mtimeMs: stats.mtimeMs,
  };
}
function snapshotsMatch(left, right) {
  if (left === null || right === null) return left === right;
  return left.size === right.size && left.mtimeMs === right.mtimeMs;
}
function snapshotPath(filePath) {
  try {
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) return null;
    return {
      size: stats.size,
      mtimeMs: stats.mtimeMs,
    };
  } catch {
    return null;
  }
}
function recordMemoryWatchEventPath(queue, watchPath, stats) {
  if (!watchPath) return;
  const trimmed = watchPath.trim();
  if (!trimmed) return;
  queue.set(path.resolve(trimmed), snapshotFromStats(stats));
}
async function settleMemoryWatchEventPaths(queue) {
  if (queue.size === 0) return true;
  const entries = Array.from(queue.entries());
  queue.clear();
  const missingBaseline = [];
  for (const [filePath, previousSnapshot] of entries) {
    const currentSnapshot = snapshotPath(filePath);
    if (previousSnapshot === null) {
      if (currentSnapshot !== null)
        missingBaseline.push({
          filePath,
          snapshot: currentSnapshot,
        });
      continue;
    }
    if (!snapshotsMatch(previousSnapshot, currentSnapshot)) queue.set(filePath, currentSnapshot);
  }
  if (missingBaseline.length > 0) {
    await sleep(MEMORY_WATCH_SETTLE_RECHECK_MS);
    for (const entry of missingBaseline) {
      const currentSnapshot = snapshotPath(entry.filePath);
      if (!snapshotsMatch(entry.snapshot, currentSnapshot))
        queue.set(entry.filePath, currentSnapshot);
    }
  }
  return queue.size === 0;
}
//#endregion
export {
  warnIfMemoryWatchPressureHigh as i,
  settleMemoryWatchEventPaths as n,
  countChokidarWatchedEntries as r,
  recordMemoryWatchEventPath as t,
};
