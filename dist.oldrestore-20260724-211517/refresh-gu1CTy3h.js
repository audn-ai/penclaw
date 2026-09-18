import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import chokidar from "chokidar";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { t as resolvePluginSkillDirs } from "./plugin-skills-BprXnaI4.js";
import {
  a as resetSkillsRefreshStateForTest,
  n as clearSkillsSnapshotVersionForWorkspace,
  o as setSkillsChangeListenerErrorHandler,
  t as bumpSkillsSnapshotVersion,
} from "./refresh-state-DHnXO3IV.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import {
  n as resolveAllowedSkillSymlinkTargetRealPaths,
  r as tryRealpath,
} from "./symlink-targets-eds-KwyT.js";
import { t as CONFIG_DIR } from "./utils-DtcDeqWS.js";
//#region src/skills/runtime/refresh.ts
const log = createSubsystemLogger("gateway/skills");
const GROUPED_SKILLS_WATCH_DEPTH = 6;
const CONFIGURED_ROOT_WATCH_DEPTH = 2;
const MAX_SYMLINK_WATCH_TARGETS_PER_ROOT = 100;
const MAX_SYMLINK_WATCH_DIRECTORY_SCANS_PER_ROOT = 200;
const MAX_SYMLINK_WATCH_RAW_ENTRIES_PER_ROOT = 2e3;
const RAW_SKILL_FILE_POLL_INTERVAL_MS = 100;
const pathWatchers = /* @__PURE__ */ new Map();
const workspaceWatchTargets = /* @__PURE__ */ new Map();
const workspaceWatchTargetCache = /* @__PURE__ */ new Map();
const workspaceWatchLastEnsuredAt = /* @__PURE__ */ new Map();
const SKILLS_WORKSPACE_WATCH_IDLE_TTL_MS = 60 * 6e4;
setSkillsChangeListenerErrorHandler((err) => {
  log.warn(`skills change listener failed: ${String(err)}`);
});
const DEFAULT_SKILLS_WATCH_IGNORED = [
  /(^|[\\/])\.git([\\/]|$)/,
  /(^|[\\/])node_modules([\\/]|$)/,
  /(^|[\\/])dist([\\/]|$)/,
  /(^|[\\/])\.venv([\\/]|$)/,
  /(^|[\\/])venv([\\/]|$)/,
  /(^|[\\/])__pycache__([\\/]|$)/,
  /(^|[\\/])\.mypy_cache([\\/]|$)/,
  /(^|[\\/])\.pytest_cache([\\/]|$)/,
  /(^|[\\/])build([\\/]|$)/,
  /(^|[\\/])\.cache([\\/]|$)/,
];
function resolveWatchTargets(workspaceDir, config) {
  const baseRoots = [];
  if (workspaceDir.trim()) {
    baseRoots.push({
      path: path.join(workspaceDir, "skills"),
      source: "openclaw-workspace",
    });
    baseRoots.push({
      path: path.join(workspaceDir, ".agents", "skills"),
      source: "agents-skills-project",
    });
  }
  baseRoots.push({
    path: path.join(CONFIG_DIR, "skills"),
    source: "openclaw-managed",
  });
  baseRoots.push({
    path: path.join(os.homedir(), ".agents", "skills"),
    source: "agents-skills-personal",
  });
  const extraDirs = (config?.skills?.load?.extraDirs ?? [])
    .map((d) => normalizeOptionalString(d) ?? "")
    .filter(Boolean)
    .map((dir) => resolveUserPath(dir));
  const pluginSkillDirs = resolvePluginSkillDirs({
    workspaceDir,
    config,
  });
  const allowedSymlinkTargetRealPaths = resolveAllowedSkillSymlinkTargetRealPaths(config);
  const signature = JSON.stringify({
    basePaths: baseRoots.map((root) => toWatchRoot(root.path)),
    extraDirs: extraDirs.map(toWatchRoot),
    pluginSkillDirs: pluginSkillDirs.map(toWatchRoot),
    allowSymlinkTargets: allowedSymlinkTargetRealPaths,
  });
  const cached = workspaceWatchTargetCache.get(workspaceDir);
  if (cached?.signature === signature) return cached.targets;
  const targets = /* @__PURE__ */ new Map();
  for (const root of baseRoots) {
    addSkillRootWatchTargets(targets, root.path, GROUPED_SKILLS_WATCH_DEPTH);
    addTrustedSymlinkSkillWatchTargets(
      targets,
      root.path,
      root.source,
      allowedSymlinkTargetRealPaths,
      GROUPED_SKILLS_WATCH_DEPTH,
      root.path,
    );
    addTrustedSymlinkSkillWatchTargets(
      targets,
      path.join(root.path, "skills"),
      root.source,
      allowedSymlinkTargetRealPaths,
      GROUPED_SKILLS_WATCH_DEPTH,
      root.path,
    );
  }
  for (const resolved of extraDirs) {
    const rootDepth =
      path.basename(resolved) === "skills"
        ? GROUPED_SKILLS_WATCH_DEPTH
        : CONFIGURED_ROOT_WATCH_DEPTH;
    addSkillRootWatchTargets(targets, resolved, rootDepth);
    addTrustedSymlinkSkillWatchTargets(
      targets,
      resolved,
      "openclaw-extra",
      allowedSymlinkTargetRealPaths,
      rootDepth,
      resolved,
    );
    addTrustedSymlinkSkillWatchTargets(
      targets,
      path.join(resolved, "skills"),
      "openclaw-extra",
      allowedSymlinkTargetRealPaths,
      GROUPED_SKILLS_WATCH_DEPTH,
      resolved,
    );
  }
  for (const dir of pluginSkillDirs) {
    const rootDepth =
      path.basename(dir) === "skills" ? GROUPED_SKILLS_WATCH_DEPTH : CONFIGURED_ROOT_WATCH_DEPTH;
    addSkillRootWatchTargets(targets, dir, rootDepth);
    addTrustedSymlinkSkillWatchTargets(
      targets,
      dir,
      "openclaw-plugin",
      allowedSymlinkTargetRealPaths,
      rootDepth,
      dir,
    );
    addTrustedSymlinkSkillWatchTargets(
      targets,
      path.join(dir, "skills"),
      "openclaw-plugin",
      allowedSymlinkTargetRealPaths,
      GROUPED_SKILLS_WATCH_DEPTH,
      dir,
    );
  }
  const sortedTargets = Array.from(targets.values()).toSorted((a, b) => a.key.localeCompare(b.key));
  workspaceWatchTargetCache.set(workspaceDir, {
    signature,
    targets: sortedTargets,
  });
  return sortedTargets;
}
function toWatchRoot(raw) {
  const normalized = raw.replaceAll("\\", "/");
  return normalized.replace(/\/+$/, "") || normalized;
}
function makeWatchTarget(raw, depth) {
  const watchPath = toWatchRoot(raw);
  return {
    path: watchPath,
    depth,
    key: watchPath,
  };
}
function addWatchTarget(targets, raw, depth) {
  const target = makeWatchTarget(raw, depth);
  const existing = targets.get(target.key);
  if (existing) {
    existing.depth = Math.max(existing.depth, target.depth);
    return;
  }
  targets.set(target.key, target);
}
function addSkillRootWatchTargets(targets, root, rootDepth) {
  addWatchTarget(targets, root, watchDepthForPath(root, rootDepth));
  const companionSkillsRoot = path.join(root, "skills");
  addWatchTarget(
    targets,
    companionSkillsRoot,
    watchDepthForPath(companionSkillsRoot, GROUPED_SKILLS_WATCH_DEPTH),
  );
}
function addTrustedSymlinkSkillWatchTargets(
  targets,
  root,
  source,
  allowedSymlinkTargetRealPaths,
  maxDepth,
  containmentRoot,
) {
  const containmentRootRealPath = tryRealpath(containmentRoot) ?? path.resolve(containmentRoot);
  const rootRealPath = tryRealpath(root) ?? path.resolve(root);
  try {
    if (
      fs.lstatSync(root).isSymbolicLink() &&
      isTrustedSymlinkSkillTarget(
        source,
        containmentRootRealPath,
        rootRealPath,
        allowedSymlinkTargetRealPaths,
      )
    )
      addSkillRootWatchTargets(targets, rootRealPath, maxDepth);
  } catch {
    return;
  }
  const queue = [
    {
      dir: root,
      depth: 0,
    },
  ];
  let watched = 0;
  let directoryScans = 0;
  let rawEntries = 0;
  for (const queued of queue) {
    if (
      watched >= MAX_SYMLINK_WATCH_TARGETS_PER_ROOT ||
      directoryScans >= MAX_SYMLINK_WATCH_DIRECTORY_SCANS_PER_ROOT ||
      rawEntries >= MAX_SYMLINK_WATCH_RAW_ENTRIES_PER_ROOT
    )
      break;
    const current = queued;
    if (!current) continue;
    const scan = readBudgetedDirEntries(
      current.dir,
      MAX_SYMLINK_WATCH_RAW_ENTRIES_PER_ROOT - rawEntries,
    );
    directoryScans += 1;
    rawEntries += scan.scannedEntryCount;
    if (!scan.ok) continue;
    for (const entry of scan.entries.toSorted((a, b) => a.name.localeCompare(b.name))) {
      if (watched >= MAX_SYMLINK_WATCH_TARGETS_PER_ROOT) break;
      if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
      const childPath = path.join(current.dir, entry.name);
      if (DEFAULT_SKILLS_WATCH_IGNORED.some((re) => re.test(childPath))) continue;
      if (entry.isSymbolicLink()) {
        const targetRealPath = tryRealpath(childPath);
        if (
          targetRealPath &&
          isTrustedSymlinkSkillTarget(
            source,
            containmentRootRealPath,
            targetRealPath,
            allowedSymlinkTargetRealPaths,
          )
        ) {
          addSkillRootWatchTargets(targets, targetRealPath, GROUPED_SKILLS_WATCH_DEPTH);
          watched += 1;
        }
        continue;
      }
      if (entry.isDirectory() && current.depth < maxDepth)
        queue.push({
          dir: childPath,
          depth: current.depth + 1,
        });
    }
  }
}
function readBudgetedDirEntries(dir, maxEntries) {
  const entries = [];
  const limit = Math.max(0, maxEntries);
  let handle;
  try {
    handle = fs.opendirSync(dir);
    for (let scanned = 0; scanned < limit; scanned += 1) {
      const entry = handle.readSync();
      if (!entry)
        return {
          ok: true,
          entries,
          scannedEntryCount: scanned,
        };
      entries.push(entry);
    }
    return {
      ok: true,
      entries,
      scannedEntryCount: limit,
    };
  } catch {
    return {
      ok: false,
      scannedEntryCount: 0,
    };
  } finally {
    handle?.closeSync();
  }
}
function isTrustedSymlinkSkillTarget(
  source,
  rootRealPath,
  targetRealPath,
  allowedSymlinkTargetRealPaths,
) {
  if (source === "openclaw-managed" || source === "agents-skills-personal") return true;
  return (
    isPathInside(rootRealPath, targetRealPath) ||
    isPathInsideAnyRoot(allowedSymlinkTargetRealPaths, targetRealPath)
  );
}
function watchDepthForPath(raw, depth) {
  let missingSegments = 0;
  let candidate = raw;
  while (!fs.existsSync(candidate)) {
    const parent = path.dirname(candidate);
    if (parent === candidate) break;
    missingSegments += 1;
    candidate = parent;
  }
  return depth + missingSegments;
}
function isPathInside(parent, child) {
  const relative = path.relative(parent, child);
  return (
    relative === "" || (relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative))
  );
}
function isPathInsideAnyRoot(roots, child) {
  return roots.some((root) => isPathInside(root, child));
}
function shouldIgnoreSkillsWatchPath(watchPath, stats, options = {}) {
  if (DEFAULT_SKILLS_WATCH_IGNORED.some((re) => re.test(watchPath))) return true;
  if (stats?.isDirectory?.() || stats?.isSymbolicLink?.()) return false;
  if (!stats) return false;
  if (options.usePolling && isSkillFileWatchPath(watchPath)) return false;
  return true;
}
function isSkillFileWatchPath(watchPath) {
  if (DEFAULT_SKILLS_WATCH_IGNORED.some((re) => re.test(watchPath))) return false;
  const normalized = watchPath.replaceAll("\\", "/");
  return path.posix.basename(normalized) === "SKILL.md";
}
function getRawWatchedPath(details) {
  return typeof details === "object" && details !== null && typeof details.watchedPath === "string"
    ? details.watchedPath
    : void 0;
}
function rawPathToString(rawPath) {
  if (typeof rawPath === "string") return rawPath || void 0;
  if (Buffer.isBuffer(rawPath)) return rawPath.toString() || void 0;
}
function resolveRawSkillsWatchPath(rawPath, details) {
  if (path.isAbsolute(rawPath)) return rawPath;
  const watchedPath = getRawWatchedPath(details);
  return watchedPath ? path.join(watchedPath, rawPath) : void 0;
}
function readFileStabilitySnapshot(filePath) {
  try {
    const stat = fs.statSync(filePath);
    return stat.isFile()
      ? {
          size: stat.size,
          mtimeMs: stat.mtimeMs,
        }
      : void 0;
  } catch {
    return;
  }
}
async function waitForStableSkillFile(filePath, stabilityMs) {
  if (stabilityMs <= 0) return;
  let previous = readFileStabilitySnapshot(filePath);
  if (!previous) return;
  let stableForMs = 0;
  while (stableForMs < stabilityMs) {
    const delayMs = Math.min(RAW_SKILL_FILE_POLL_INTERVAL_MS, stabilityMs - stableForMs);
    await new Promise((resolve) => {
      setTimeout(resolve, delayMs);
    });
    const next = readFileStabilitySnapshot(filePath);
    if (!next) return;
    if (next.size === previous.size && next.mtimeMs === previous.mtimeMs) {
      stableForMs += delayMs;
      continue;
    }
    previous = next;
    stableForMs = 0;
  }
}
function resolveWatchDebounceMs(config) {
  const raw = config?.skills?.load?.watchDebounceMs;
  return typeof raw === "number" && Number.isFinite(raw) ? Math.max(0, raw) : 250;
}
function resolveSkillsWatcherUsePolling() {
  const envPolling = process.env.CHOKIDAR_USEPOLLING;
  if (envPolling === void 0) return process.platform === "os400";
  const normalized = envPolling.toLowerCase();
  if (normalized === "false" || normalized === "0") return false;
  if (normalized === "true" || normalized === "1") return true;
  return Boolean(normalized);
}
function sameWatchTargets(a, b) {
  if (a.length !== b.length) return false;
  for (let index = 0; index < a.length; index++)
    if (a[index]?.key !== b[index]?.key || a[index]?.depth !== b[index]?.depth) return false;
  return true;
}
function createSkillsPathWatcher(target, debounceMs) {
  const usePolling = resolveSkillsWatcherUsePolling();
  const watcher = chokidar.watch(target.path, {
    ignoreInitial: true,
    followSymlinks: false,
    usePolling,
    depth: target.depth,
    awaitWriteFinish: {
      stabilityThreshold: debounceMs,
      pollInterval: 100,
    },
    ignored: (watchPath, stats) => shouldIgnoreSkillsWatchPath(watchPath, stats, { usePolling }),
  });
  const state = {
    watcher,
    depth: target.depth,
    debounceMs,
    subscribers: /* @__PURE__ */ new Set(),
  };
  const schedule = (changedPath) => {
    state.pendingPath = changedPath ?? state.pendingPath;
    if (state.timer) clearTimeout(state.timer);
    state.timer = setTimeout(() => {
      const pendingPath = state.pendingPath;
      state.pendingPath = void 0;
      state.timer = void 0;
      for (const workspaceDir of state.subscribers) {
        workspaceWatchTargetCache.delete(workspaceDir);
        bumpSkillsSnapshotVersion({
          workspaceDir,
          reason: "watch",
          changedPath: pendingPath,
        });
      }
    }, debounceMs);
  };
  const scheduleRawSkillFile = (changedPath) => {
    waitForStableSkillFile(changedPath, debounceMs)
      .catch((err) => {
        log.warn(`skills watcher stability check failed (${changedPath}): ${String(err)}`);
      })
      .then(() => schedule(changedPath));
  };
  watcher.on("all", (_event, changedPath) => schedule(changedPath));
  watcher.on("raw", (_eventName, rawPath, details) => {
    const rawPathText = rawPathToString(rawPath);
    if (!rawPathText) {
      const watchedPath = getRawWatchedPath(details);
      if (watchedPath) schedule(watchedPath);
      return;
    }
    const changedPath = resolveRawSkillsWatchPath(rawPathText, details);
    if (changedPath && isSkillFileWatchPath(changedPath)) {
      if (usePolling) return;
      scheduleRawSkillFile(changedPath);
    }
  });
  watcher.on("error", (err) => {
    log.warn(`skills watcher error (${target.path}): ${String(err)}`);
  });
  return state;
}
function teardownSkillsPathWatcher(state) {
  if (state.timer) clearTimeout(state.timer);
  state.watcher.close().catch(() => {});
}
function subscribeWorkspaceToPath(workspaceDir, watchTarget, debounceMs) {
  const existing = pathWatchers.get(watchTarget.key);
  if (existing && existing.debounceMs === debounceMs && existing.depth >= watchTarget.depth) {
    existing.subscribers.add(workspaceDir);
    return;
  }
  if (existing) {
    const next = createSkillsPathWatcher(
      {
        ...watchTarget,
        depth: Math.max(existing.depth, watchTarget.depth),
      },
      debounceMs,
    );
    for (const subscriber of existing.subscribers) next.subscribers.add(subscriber);
    next.subscribers.add(workspaceDir);
    teardownSkillsPathWatcher(existing);
    pathWatchers.set(watchTarget.key, next);
    return;
  }
  const state = createSkillsPathWatcher(watchTarget, debounceMs);
  state.subscribers.add(workspaceDir);
  pathWatchers.set(watchTarget.key, state);
}
function unsubscribeWorkspaceFromPath(workspaceDir, watchTarget) {
  const state = pathWatchers.get(watchTarget.key);
  if (!state) return;
  state.subscribers.delete(workspaceDir);
  if (state.subscribers.size === 0) {
    teardownSkillsPathWatcher(state);
    pathWatchers.delete(watchTarget.key);
  }
}
function disposeWorkspaceWatchState(
  workspaceDir,
  watchTargets = workspaceWatchTargets.get(workspaceDir) ?? [],
) {
  const hadWatchTargets = watchTargets.length > 0;
  for (const watchTarget of watchTargets) unsubscribeWorkspaceFromPath(workspaceDir, watchTarget);
  workspaceWatchTargets.delete(workspaceDir);
  workspaceWatchTargetCache.delete(workspaceDir);
  workspaceWatchLastEnsuredAt.delete(workspaceDir);
  if (hadWatchTargets)
    bumpSkillsSnapshotVersion({
      workspaceDir,
      reason: "watch-targets",
    });
  clearSkillsSnapshotVersionForWorkspace(workspaceDir);
}
function evictIdleWorkspaceWatchStates(now) {
  const cutoff = now - SKILLS_WORKSPACE_WATCH_IDLE_TTL_MS;
  for (const [workspaceDir, lastEnsuredAt] of workspaceWatchLastEnsuredAt)
    if (lastEnsuredAt < cutoff) disposeWorkspaceWatchState(workspaceDir);
}
function ensureSkillsWatcher(params) {
  const workspaceDir = params.workspaceDir.trim();
  if (!workspaceDir) return;
  const now = Date.now();
  const watchEnabled = params.config?.skills?.load?.watch !== false;
  const debounceMs = resolveWatchDebounceMs(params.config);
  const previousTargets = workspaceWatchTargets.get(workspaceDir) ?? [];
  if (!watchEnabled) {
    disposeWorkspaceWatchState(workspaceDir, previousTargets);
    evictIdleWorkspaceWatchStates(now);
    return;
  }
  workspaceWatchLastEnsuredAt.set(workspaceDir, now);
  const watchTargets = resolveWatchTargets(workspaceDir, params.config);
  const targetsUnchanged = sameWatchTargets(previousTargets, watchTargets);
  const debounceUnchanged = watchTargets.every((watchTarget) => {
    const pathWatcher = pathWatchers.get(watchTarget.key);
    return pathWatcher?.debounceMs === debounceMs && pathWatcher.depth >= watchTarget.depth;
  });
  if (targetsUnchanged && debounceUnchanged) {
    evictIdleWorkspaceWatchStates(now);
    return;
  }
  const watchTargetsChanged = previousTargets.length > 0 && !targetsUnchanged;
  const nextTargetKeys = new Set(watchTargets.map((target) => target.key));
  for (const watchTarget of previousTargets)
    if (!nextTargetKeys.has(watchTarget.key))
      unsubscribeWorkspaceFromPath(workspaceDir, watchTarget);
  for (const watchTarget of watchTargets)
    subscribeWorkspaceToPath(workspaceDir, watchTarget, debounceMs);
  workspaceWatchTargets.set(workspaceDir, watchTargets);
  if (watchTargetsChanged)
    bumpSkillsSnapshotVersion({
      workspaceDir,
      reason: "watch-targets",
      changedPath: watchTargets.map((target) => target.path).join("|"),
    });
  evictIdleWorkspaceWatchStates(now);
}
async function resetSkillsRefreshForTest() {
  resetSkillsRefreshStateForTest();
  const active = Array.from(pathWatchers.values());
  pathWatchers.clear();
  workspaceWatchTargets.clear();
  workspaceWatchTargetCache.clear();
  workspaceWatchLastEnsuredAt.clear();
  await Promise.all(
    active.map(async (state) => {
      if (state.timer) clearTimeout(state.timer);
      try {
        await state.watcher.close();
      } catch {}
    }),
  );
}
//#endregion
export { resetSkillsRefreshForTest as n, ensureSkillsWatcher as t };
