import {
  a as listTaskRegistryRecordsByOwnerKeyFromSqlite,
  c as saveTaskRegistryStateToSqlite,
  d as upsertTaskWithDeliveryStateToSqlite,
  i as deleteTaskRegistryRecordFromSqlite,
  l as upsertTaskDeliveryStateToSqlite,
  n as deleteTaskAndDeliveryStateFromSqlite,
  r as deleteTaskDeliveryStateFromSqlite,
  s as loadTaskRegistryStateFromSqlite,
  t as closeTaskRegistryDatabase,
  u as upsertTaskRegistryRecordToSqlite,
} from "./task-registry.store.sqlite-W50bLikV.js";
//#region src/tasks/task-registry.store.ts
const defaultTaskRegistryStore = {
  loadSnapshot: loadTaskRegistryStateFromSqlite,
  saveSnapshot: saveTaskRegistryStateToSqlite,
  listTasksForOwnerKey: listTaskRegistryRecordsByOwnerKeyFromSqlite,
  upsertTaskWithDeliveryState: upsertTaskWithDeliveryStateToSqlite,
  upsertTask: upsertTaskRegistryRecordToSqlite,
  deleteTaskWithDeliveryState: deleteTaskAndDeliveryStateFromSqlite,
  deleteTask: deleteTaskRegistryRecordFromSqlite,
  upsertDeliveryState: upsertTaskDeliveryStateToSqlite,
  deleteDeliveryState: deleteTaskDeliveryStateFromSqlite,
  close: closeTaskRegistryDatabase,
};
let configuredTaskRegistryStore = defaultTaskRegistryStore;
let configuredTaskRegistryObservers = null;
function getTaskRegistryStore() {
  return configuredTaskRegistryStore;
}
function getTaskRegistryObservers() {
  return configuredTaskRegistryObservers;
}
function configureTaskRegistryRuntime(params) {
  if (params.store) configuredTaskRegistryStore = params.store;
  if ("observers" in params) configuredTaskRegistryObservers = params.observers ?? null;
}
function resetTaskRegistryRuntimeForTests() {
  configuredTaskRegistryStore.close?.();
  configuredTaskRegistryStore = defaultTaskRegistryStore;
  configuredTaskRegistryObservers = null;
}
//#endregion
export {
  resetTaskRegistryRuntimeForTests as i,
  getTaskRegistryObservers as n,
  getTaskRegistryStore as r,
  configureTaskRegistryRuntime as t,
};
