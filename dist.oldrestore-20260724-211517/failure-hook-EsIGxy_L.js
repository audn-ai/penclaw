//#region src/agents/auth-profiles/failure-hook.ts
let authProfileFailureHook;
/** Installs or clears the process-local auth profile failure hook. */
function setAuthProfileFailureHook(hook) {
  authProfileFailureHook = hook;
}
/** Notifies the process-local auth profile failure hook. */
function notifyAuthProfileFailureHook() {
  authProfileFailureHook?.();
}
//#endregion
export { setAuthProfileFailureHook as n, notifyAuthProfileFailureHook as t };
