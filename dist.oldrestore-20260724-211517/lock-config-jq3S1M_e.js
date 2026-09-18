//#region node_modules/@openclaw/fs-safe/dist/lock-config.js
let lockConfig = { staleRecovery: "fail-closed" };
function getFsSafeLockConfig() {
  return {
    ...lockConfig,
    retry: lockConfig.retry ? { ...lockConfig.retry } : void 0,
  };
}
//#endregion
export { getFsSafeLockConfig as t };
