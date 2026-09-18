//#region src/secrets/runtime-web-tools-state.ts
let activeRuntimeWebToolsMetadata = null;
/**
 * Clears active web-tool metadata when the secrets runtime snapshot is reset.
 */
function clearActiveRuntimeWebToolsMetadata() {
  activeRuntimeWebToolsMetadata = null;
}
/**
 * Stores web-tool metadata with clone isolation from caller-owned objects.
 */
function setActiveRuntimeWebToolsMetadata(metadata) {
  activeRuntimeWebToolsMetadata = structuredClone(metadata);
}
/**
 * Returns active web-tool metadata without exposing mutable runtime state.
 */
function getActiveRuntimeWebToolsMetadata() {
  if (!activeRuntimeWebToolsMetadata) return null;
  return structuredClone(activeRuntimeWebToolsMetadata);
}
//#endregion
export {
  getActiveRuntimeWebToolsMetadata as n,
  setActiveRuntimeWebToolsMetadata as r,
  clearActiveRuntimeWebToolsMetadata as t,
};
