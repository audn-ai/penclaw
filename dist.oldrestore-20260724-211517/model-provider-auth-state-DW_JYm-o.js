//#region src/agents/model-provider-auth-state.ts
let currentProviderAuthStates = null;
let currentProviderAuthStateGeneration = 0;
let currentProviderAuthWarmWorker;
function getCurrentProviderAuthStates() {
  return currentProviderAuthStates;
}
function claimCurrentProviderAuthStateGeneration() {
  currentProviderAuthStateGeneration += 1;
  return currentProviderAuthStateGeneration;
}
function isCurrentProviderAuthStateGeneration(generation) {
  return generation === currentProviderAuthStateGeneration;
}
function setCurrentProviderAuthWarmWorker(handle) {
  currentProviderAuthWarmWorker = handle;
}
function clearCurrentProviderAuthWarmWorker(handle) {
  if (currentProviderAuthWarmWorker === handle) currentProviderAuthWarmWorker = void 0;
}
function cancelCurrentProviderAuthWarmWorker() {
  const current = currentProviderAuthWarmWorker;
  if (!current) return;
  current.cancelled = true;
  currentProviderAuthWarmWorker = void 0;
  current.worker.terminate();
}
function clearCurrentProviderAuthState() {
  currentProviderAuthStates = null;
  claimCurrentProviderAuthStateGeneration();
  cancelCurrentProviderAuthWarmWorker();
}
function publishProviderAuthWarmSnapshot(snapshot) {
  currentProviderAuthStates = new Map(
    snapshot.agents.map((state) => [
      state.agentId,
      {
        agentId: state.agentId,
        configFingerprint: state.configFingerprint,
        providers: new Map(state.providers),
      },
    ]),
  );
}
//#endregion
export {
  getCurrentProviderAuthStates as a,
  setCurrentProviderAuthWarmWorker as c,
  clearCurrentProviderAuthWarmWorker as i,
  claimCurrentProviderAuthStateGeneration as n,
  isCurrentProviderAuthStateGeneration as o,
  clearCurrentProviderAuthState as r,
  publishProviderAuthWarmSnapshot as s,
  cancelCurrentProviderAuthWarmWorker as t,
};
