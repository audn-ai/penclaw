import { createHash } from "node:crypto";
import path from "node:path";
//#region extensions/memory-core/src/dreaming-state.ts
const MEMORY_CORE_PLUGIN_ID = "memory-core";
const DREAMING_DAILY_INGESTION_NAMESPACE = "dreaming-daily-ingestion";
const DREAMING_SESSION_INGESTION_FILES_NAMESPACE = "dreaming-session-ingestion-files";
const DREAMING_SESSION_INGESTION_SEEN_NAMESPACE = "dreaming-session-ingestion-seen";
const SHORT_TERM_RECALL_NAMESPACE = "short-term-recall";
const SHORT_TERM_PHASE_SIGNAL_NAMESPACE = "short-term-phase-signals";
const SHORT_TERM_META_NAMESPACE = "short-term-meta";
const SHORT_TERM_LOCK_NAMESPACE = "short-term-locks";
const DREAMING_WORKSPACE_STATE_MAX_ENTRIES = 5e4;
const SHORT_TERM_LOCK_MAX_ENTRIES = 4096;
let configuredOpenKeyedStore;
function configureMemoryCoreDreamingState(openKeyedStore) {
  configuredOpenKeyedStore = openKeyedStore;
}
function openMemoryCoreStateStore(options) {
  if (!configuredOpenKeyedStore)
    throw new Error("memory-core dreaming SQLite state store is not configured");
  return configuredOpenKeyedStore(options);
}
function normalizeMemoryCoreWorkspaceKey(workspaceDir) {
  const resolved = path.resolve(workspaceDir).replace(/\\/g, "/");
  return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}
function memoryCoreWorkspaceStateKey(workspaceDir) {
  return createHash("sha256").update(normalizeMemoryCoreWorkspaceKey(workspaceDir)).digest("hex");
}
function memoryCoreWorkspaceEntryKey(workspaceDir, logicalKey) {
  return `${memoryCoreWorkspaceStateKey(workspaceDir)}:${createHash("sha256").update(logicalKey).digest("hex")}`;
}
function memoryCoreStateReference(namespace, workspaceDir) {
  return `plugin-state:${MEMORY_CORE_PLUGIN_ID}/${namespace}/${memoryCoreWorkspaceStateKey(workspaceDir)}`;
}
function openWorkspaceStore(namespace) {
  return openMemoryCoreStateStore({
    namespace,
    maxEntries: DREAMING_WORKSPACE_STATE_MAX_ENTRIES,
  });
}
async function readMemoryCoreWorkspaceEntries(params) {
  const workspaceKey = memoryCoreWorkspaceStateKey(params.workspaceDir);
  const prefix = `${workspaceKey}:`;
  return (await openWorkspaceStore(params.namespace).entries())
    .filter((entry) => entry.key.startsWith(prefix) && entry.value.workspaceKey === workspaceKey)
    .map((entry) => ({
      key: entry.value.key,
      value: entry.value.value,
    }));
}
async function writeMemoryCoreWorkspaceEntries(params) {
  const store = openWorkspaceStore(params.namespace);
  const workspaceKey = memoryCoreWorkspaceStateKey(params.workspaceDir);
  const prefix = `${workspaceKey}:`;
  const replacementKeys = /* @__PURE__ */ new Set();
  for (const entry of params.entries) {
    const stateKey = memoryCoreWorkspaceEntryKey(params.workspaceDir, entry.key);
    replacementKeys.add(stateKey);
    await store.register(stateKey, {
      version: 1,
      workspaceKey,
      workspaceDir: path.resolve(params.workspaceDir),
      key: entry.key,
      value: entry.value,
    });
  }
  for (const entry of await store.entries())
    if (entry.key.startsWith(prefix) && !replacementKeys.has(entry.key))
      await store.delete(entry.key);
}
async function writeMemoryCoreWorkspaceEntry(params) {
  const workspaceKey = memoryCoreWorkspaceStateKey(params.workspaceDir);
  await openWorkspaceStore(params.namespace).register(
    memoryCoreWorkspaceEntryKey(params.workspaceDir, params.key),
    {
      version: 1,
      workspaceKey,
      workspaceDir: path.resolve(params.workspaceDir),
      key: params.key,
      value: params.value,
    },
  );
}
async function clearMemoryCoreWorkspaceNamespace(params) {
  const store = openWorkspaceStore(params.namespace);
  const prefix = `${memoryCoreWorkspaceStateKey(params.workspaceDir)}:`;
  for (const entry of await store.entries())
    if (entry.key.startsWith(prefix)) await store.delete(entry.key);
}
//#endregion
export {
  writeMemoryCoreWorkspaceEntries as _,
  SHORT_TERM_LOCK_NAMESPACE as a,
  SHORT_TERM_RECALL_NAMESPACE as c,
  memoryCoreStateReference as d,
  memoryCoreWorkspaceEntryKey as f,
  readMemoryCoreWorkspaceEntries as g,
  openMemoryCoreStateStore as h,
  SHORT_TERM_LOCK_MAX_ENTRIES as i,
  clearMemoryCoreWorkspaceNamespace as l,
  normalizeMemoryCoreWorkspaceKey as m,
  DREAMING_SESSION_INGESTION_FILES_NAMESPACE as n,
  SHORT_TERM_META_NAMESPACE as o,
  memoryCoreWorkspaceStateKey as p,
  DREAMING_SESSION_INGESTION_SEEN_NAMESPACE as r,
  SHORT_TERM_PHASE_SIGNAL_NAMESPACE as s,
  DREAMING_DAILY_INGESTION_NAMESPACE as t,
  configureMemoryCoreDreamingState as u,
  writeMemoryCoreWorkspaceEntry as v,
};
