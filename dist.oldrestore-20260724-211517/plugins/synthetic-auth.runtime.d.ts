import {
  n as PluginRegistrySnapshot,
  t as LoadPluginRegistryParams,
} from "../plugin-registry-CT_-_J_j.js";

//#region src/plugins/synthetic-auth.runtime.d.ts
type SyntheticAuthProviderRefParams = LoadPluginRegistryParams & {
  index?: PluginRegistrySnapshot;
  registryDiagnostics?: readonly unknown[];
};
/** Lists provider refs that can satisfy synthetic auth profile lookups. */
declare function resolveRuntimeSyntheticAuthProviderRefs(
  params?: SyntheticAuthProviderRefParams,
): string[];
/** Returns synthetic-auth refs plus whether the control-plane data source was complete. */
declare function resolveRuntimeSyntheticAuthProviderRefState(
  params?: SyntheticAuthProviderRefParams,
): {
  refs: string[];
  complete: boolean;
};
/** Lists provider refs that can expose external auth profiles to runtime consumers. */
declare function resolveRuntimeExternalAuthProviderRefs(
  params?: SyntheticAuthProviderRefParams,
): string[];
//#endregion
export {
  resolveRuntimeExternalAuthProviderRefs,
  resolveRuntimeSyntheticAuthProviderRefState,
  resolveRuntimeSyntheticAuthProviderRefs,
};
