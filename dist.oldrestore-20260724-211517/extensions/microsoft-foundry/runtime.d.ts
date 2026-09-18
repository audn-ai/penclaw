import {
  Rt as ProviderPrepareRuntimeAuthContext,
  zt as ProviderPreparedRuntimeAuth,
} from "../../plugin-entry-DPCR66aO.js";
//#region extensions/microsoft-foundry/runtime.d.ts
declare function resetFoundryRuntimeAuthCaches(): void;
declare function prepareFoundryRuntimeAuth(
  ctx: ProviderPrepareRuntimeAuthContext,
): Promise<ProviderPreparedRuntimeAuth>;
//#endregion
export { prepareFoundryRuntimeAuth, resetFoundryRuntimeAuthCaches };
