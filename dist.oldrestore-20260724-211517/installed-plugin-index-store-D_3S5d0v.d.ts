import {
  n as InstalledPluginIndexRefreshReason,
  t as InstalledPluginIndex,
} from "./installed-plugin-index-types-75ZYFT43.js";
//#region src/plugins/installed-plugin-index-store-path.d.ts
/** Options for resolving installed plugin index storage paths. */
type InstalledPluginIndexStoreOptions = {
  env?: NodeJS.ProcessEnv;
  stateDir?: string;
  filePath?: string;
};
//#endregion
//#region src/plugins/installed-plugin-index-store.d.ts
/** Freshness state for the persisted installed plugin index. */
type InstalledPluginIndexStoreState = "missing" | "fresh" | "stale";
type InstalledPluginIndexStoreInspection = {
  state: InstalledPluginIndexStoreState;
  refreshReasons: readonly InstalledPluginIndexRefreshReason[];
  persisted: InstalledPluginIndex | null;
  current: InstalledPluginIndex;
};
//#endregion
export { InstalledPluginIndexStoreOptions as n, InstalledPluginIndexStoreInspection as t };
