import { parentPort, workerData } from "node:worker_threads";
import "../auth-profiles-CX7JDmZ9.js";
import { t as buildCurrentProviderAuthStateSnapshot } from "../model-provider-auth-DNlLhknV.js";
import { p as replaceRuntimeAuthProfileStoreSnapshots } from "../store-B7DoDdVM.js";
//#region src/agents/model-provider-auth.worker.ts
/**
 * Worker entrypoint for warming provider auth state off the main thread.
 */
function isWorkerInput(value) {
  if (!value || typeof value !== "object") return false;
  const record = value;
  return (
    "cfg" in record &&
    (!("runtimeAuthStores" in record) || Array.isArray(record.runtimeAuthStores)) &&
    (!("runtimeAuthLookups" in record) || Array.isArray(record.runtimeAuthLookups)) &&
    (!("omitFalseProviderAuth" in record) || typeof record.omitFalseProviderAuth === "boolean")
  );
}
/** Validates worker input and returns a provider auth snapshot or a serializable failure. */
async function runProviderAuthWarmWorkerInput(input) {
  if (!isWorkerInput(input))
    return {
      status: "failed",
      error: "invalid provider auth warm worker input",
    };
  try {
    if (input.runtimeAuthStores?.length)
      replaceRuntimeAuthProfileStoreSnapshots(input.runtimeAuthStores);
    return {
      status: "ok",
      snapshot: await buildCurrentProviderAuthStateSnapshot(input.cfg, {
        readOnlyAuthStore: true,
        runtimeAuthLookups: new Map(
          input.runtimeAuthLookups?.map(({ agentId, lookup }) => [agentId, lookup]),
        ),
        omitFalseProviderAuth: input.omitFalseProviderAuth,
      }),
    };
  } catch (error) {
    return {
      status: "failed",
      error: String(error),
    };
  }
}
if (parentPort)
  parentPort.postMessage.bind(parentPort)(await runProviderAuthWarmWorkerInput(workerData));
//#endregion
export { runProviderAuthWarmWorkerInput };
