import { g as loadWorkspaceBootstrapFiles } from "./workspace-DXzCbuC0.js";
//#region src/agents/bootstrap-cache.ts
/**
 * Per-session workspace bootstrap snapshot cache.
 * Reuses unchanged bootstrap file arrays while refreshing each turn so edits
 * become visible to long-lived agent sessions.
 */
const MAX_BOOTSTRAP_SNAPSHOTS = 64;
const cache = /* @__PURE__ */ new Map();
function bootstrapFilesEqual(previous, next) {
  if (previous.length !== next.length) return false;
  return previous.every((file, index) => {
    const updated = next[index];
    return (
      updated !== void 0 &&
      file.name === updated.name &&
      file.path === updated.path &&
      file.content === updated.content &&
      file.missing === updated.missing
    );
  });
}
function pruneOldestBootstrapSnapshots() {
  while (cache.size > MAX_BOOTSTRAP_SNAPSHOTS) {
    const oldestKey = cache.keys().next().value;
    if (typeof oldestKey !== "string") return;
    cache.delete(oldestKey);
  }
}
/** Load bootstrap files for a session, reusing the prior snapshot when content is unchanged. */
async function getOrLoadBootstrapFiles(params) {
  pruneOldestBootstrapSnapshots();
  const existing = cache.get(params.sessionKey);
  const files = await loadWorkspaceBootstrapFiles(params.workspaceDir);
  if (
    existing &&
    existing.workspaceDir === params.workspaceDir &&
    bootstrapFilesEqual(existing.files, files)
  ) {
    cache.delete(params.sessionKey);
    cache.set(params.sessionKey, existing);
    return existing.files;
  }
  cache.set(params.sessionKey, {
    workspaceDir: params.workspaceDir,
    files,
  });
  pruneOldestBootstrapSnapshots();
  return files;
}
/** Drop one cached bootstrap snapshot. */
function clearBootstrapSnapshot(sessionKey) {
  cache.delete(sessionKey);
}
/** Clear bootstrap state when a visible session rolls over to a new backing session. */
function clearBootstrapSnapshotOnSessionRollover(params) {
  if (!params.sessionKey || !params.previousSessionId) return;
  clearBootstrapSnapshot(params.sessionKey);
}
//#endregion
export {
  clearBootstrapSnapshotOnSessionRollover as n,
  getOrLoadBootstrapFiles as r,
  clearBootstrapSnapshot as t,
};
