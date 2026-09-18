//#region src/agents/subagent-registry-steer-runtime.ts
let replaceSubagentRunAfterSteerImpl = null;
let finalizeInterruptedSubagentRunImpl = null;
/** Installs registry mutation hooks used by steer/recovery runtime paths. */
function configureSubagentRegistrySteerRuntime(params) {
  replaceSubagentRunAfterSteerImpl = params.replaceSubagentRunAfterSteer;
  finalizeInterruptedSubagentRunImpl = params.finalizeInterruptedSubagentRun ?? null;
}
/** Replaces a previous run id after steering, returning false when no hook is installed. */
function replaceSubagentRunAfterSteer(params) {
  return replaceSubagentRunAfterSteerImpl?.(params) ?? false;
}
/** Finalizes one interrupted run generation through the installed registry hook. */
async function finalizeInterruptedSubagentRun(params) {
  return (await finalizeInterruptedSubagentRunImpl?.(params)) ?? 0;
}
//#endregion
export {
  finalizeInterruptedSubagentRun as n,
  replaceSubagentRunAfterSteer as r,
  configureSubagentRegistrySteerRuntime as t,
};
