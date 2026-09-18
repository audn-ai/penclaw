import {
  T as reloadTaskRegistryFromStore,
  a as ensureTaskRegistryReady,
  q as reloadTaskFlowRegistryFromStore,
  z as ensureTaskFlowRegistryReady,
} from "./task-registry-C44yDrOW.js";
//#region src/tasks/runtime-internal.ts
function ensureTaskRuntimeStateReady() {
  ensureTaskFlowRegistryReady();
  ensureTaskRegistryReady();
}
function reloadTaskRuntimeStateFromStore() {
  reloadTaskFlowRegistryFromStore();
  reloadTaskRegistryFromStore();
}
//#endregion
export { reloadTaskRuntimeStateFromStore as n, ensureTaskRuntimeStateReady as t };
