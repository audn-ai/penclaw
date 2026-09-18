import { n as InstalledPluginIndexStoreOptions } from "./installed-plugin-index-store-D_3S5d0v.js";
import {
  r as LoadInstalledPluginIndexParams,
  t as InstalledPluginIndex,
} from "./installed-plugin-index-types-75ZYFT43.js";

//#region src/plugins/plugin-registry-snapshot.d.ts
type PluginRegistrySnapshot = InstalledPluginIndex;
type LoadPluginRegistryParams = LoadInstalledPluginIndexParams &
  InstalledPluginIndexStoreOptions & {
    index?: PluginRegistrySnapshot;
    preferPersisted?: boolean;
  };
//#endregion
export { PluginRegistrySnapshot as n, LoadPluginRegistryParams as t };
