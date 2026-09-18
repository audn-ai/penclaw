//#region src/plugin-sdk/memory-host-search.ts
async function loadMemoryHostSearchRuntime() {
  return await import("./memory-host-search.runtime.js");
}
/** Loads the active memory search manager for one agent and purpose. */
async function getActiveMemorySearchManager(params) {
  return await (await loadMemoryHostSearchRuntime()).getActiveMemorySearchManager(params);
}
/** Closes every active memory search manager for the provided config. */
async function closeActiveMemorySearchManagers(cfg) {
  await (await loadMemoryHostSearchRuntime()).closeActiveMemorySearchManagers(cfg);
}
/** Closes the active memory search manager for one agent. */
async function closeActiveMemorySearchManager(params) {
  await (await loadMemoryHostSearchRuntime()).closeActiveMemorySearchManager(params);
}
//#endregion
export {
  closeActiveMemorySearchManagers as n,
  getActiveMemorySearchManager as r,
  closeActiveMemorySearchManager as t,
};
