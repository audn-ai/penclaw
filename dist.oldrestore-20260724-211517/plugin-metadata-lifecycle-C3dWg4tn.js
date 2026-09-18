//#region src/plugins/current-plugin-metadata-state.ts
let currentPluginMetadataSnapshot;
let currentPluginMetadataSnapshotConfigFingerprint;
let currentPluginMetadataSnapshotCompatiblePolicyHashes;
let currentPluginMetadataSnapshotCompatibleConfigFingerprints;
/** Stores the process-current plugin metadata snapshot and compatible config fingerprints. */
function setCurrentPluginMetadataSnapshotState(
  snapshot,
  configFingerprint,
  compatiblePolicyHashes,
  compatibleConfigFingerprints,
) {
  currentPluginMetadataSnapshot = snapshot;
  currentPluginMetadataSnapshotConfigFingerprint = snapshot ? configFingerprint : void 0;
  currentPluginMetadataSnapshotCompatiblePolicyHashes = snapshot ? compatiblePolicyHashes : void 0;
  currentPluginMetadataSnapshotCompatibleConfigFingerprints = snapshot
    ? compatibleConfigFingerprints
    : void 0;
}
/** Clears the process-current plugin metadata snapshot. */
function clearCurrentPluginMetadataSnapshotState() {
  currentPluginMetadataSnapshot = void 0;
  currentPluginMetadataSnapshotConfigFingerprint = void 0;
  currentPluginMetadataSnapshotCompatiblePolicyHashes = void 0;
  currentPluginMetadataSnapshotCompatibleConfigFingerprints = void 0;
}
/** Returns the process-current plugin metadata snapshot state. */
function getCurrentPluginMetadataSnapshotState() {
  return {
    snapshot: currentPluginMetadataSnapshot,
    configFingerprint: currentPluginMetadataSnapshotConfigFingerprint,
    compatiblePolicyHashes: currentPluginMetadataSnapshotCompatiblePolicyHashes,
    compatibleConfigFingerprints: currentPluginMetadataSnapshotCompatibleConfigFingerprints,
  };
}
//#endregion
//#region src/plugins/plugin-metadata-lifecycle.ts
/** Coordinates plugin metadata snapshot and process memo cache lifecycle resets. */
const pluginMetadataProcessMemoClears = /* @__PURE__ */ new Set();
/** Registers a process-local plugin metadata memo clear hook. */
function registerPluginMetadataProcessMemoLifecycleClear(clearProcessMemo) {
  pluginMetadataProcessMemoClears.add(clearProcessMemo);
}
/** Clears plugin metadata snapshots and registered process memo caches. */
function clearPluginMetadataLifecycleCaches() {
  clearCurrentPluginMetadataSnapshotState();
  for (const clearProcessMemo of pluginMetadataProcessMemoClears) clearProcessMemo();
}
//#endregion
export {
  setCurrentPluginMetadataSnapshotState as a,
  getCurrentPluginMetadataSnapshotState as i,
  registerPluginMetadataProcessMemoLifecycleClear as n,
  clearCurrentPluginMetadataSnapshotState as r,
  clearPluginMetadataLifecycleCaches as t,
};
