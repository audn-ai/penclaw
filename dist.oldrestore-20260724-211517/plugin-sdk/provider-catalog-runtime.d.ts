import { t as PluginLoadOptions } from "../loader-4jMbhejc.js";
import { n as PluginManifestRegistry } from "../manifest-registry-CHEq75Tu.js";
import { n as PluginMetadataSnapshot } from "../plugin-metadata-snapshot.types-Cto61spH.js";
import {
  n as resolvePluginProviders,
  t as isPluginProvidersLoadInFlight,
} from "../providers.runtime-BO7CjzRB.js";
import { Zu as augmentModelCatalogWithProviderPlugins } from "../types-Ga3mNO_F.js";

//#region src/plugins/providers.d.ts
declare function resolveOwningPluginIdsForProvider(params: {
  provider: string;
  config?: PluginLoadOptions["config"];
  workspaceDir?: string;
  env?: PluginLoadOptions["env"];
  manifestRegistry?: PluginManifestRegistry;
  metadataSnapshot?: Pick<PluginMetadataSnapshot, "owners" | "manifestRegistry" | "byPluginId">;
}): string[] | undefined;
declare function resolveCatalogHookProviderPluginIds(params: {
  config?: PluginLoadOptions["config"];
  workspaceDir?: string;
  env?: PluginLoadOptions["env"];
}): string[];
//#endregion
export {
  augmentModelCatalogWithProviderPlugins,
  isPluginProvidersLoadInFlight,
  resolveCatalogHookProviderPluginIds,
  resolveOwningPluginIdsForProvider,
  resolvePluginProviders,
};
