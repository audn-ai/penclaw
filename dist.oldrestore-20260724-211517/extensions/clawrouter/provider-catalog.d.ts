import { a as LiveModelCatalogFetchGuard } from "../../provider-catalog-live-runtime-Ndcwxy1x.js";
import { nd as ProviderRuntimeModel } from "../../types-Ga3mNO_F.js";
import { m as ModelProviderDeclarationConfig } from "../../types.models-BqJSiNyu.js";

//#region extensions/clawrouter/provider-catalog.d.ts
declare function normalizeClawRouterRootUrl(baseUrl: string | undefined): string;
declare function normalizeClawRouterApiBaseUrl(baseUrl: string | undefined): string;
declare function buildClawRouterProviderConfig(params: {
  apiKey: string;
  discoveryApiKey?: string;
  baseUrl?: string;
  fetchGuard?: LiveModelCatalogFetchGuard;
}): Promise<ModelProviderDeclarationConfig>;
declare function normalizeClawRouterResolvedModel(
  model: ProviderRuntimeModel,
): ProviderRuntimeModel | undefined;
declare function prepareClawRouterRequestModel(model: ProviderRuntimeModel): ProviderRuntimeModel;
//#endregion
export {
  buildClawRouterProviderConfig,
  normalizeClawRouterApiBaseUrl,
  normalizeClawRouterResolvedModel,
  normalizeClawRouterRootUrl,
  prepareClawRouterRequestModel,
};
