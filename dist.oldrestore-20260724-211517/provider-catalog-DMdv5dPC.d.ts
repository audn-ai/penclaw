import { a as LiveModelCatalogFetchGuard } from "./provider-catalog-live-runtime-Ndcwxy1x.js";
import { m as ModelProviderDeclarationConfig } from "./types.models-BqJSiNyu.js";

//#region extensions/xai/provider-catalog.d.ts
declare function buildXaiProvider(
  api?: ModelProviderDeclarationConfig["api"],
): ModelProviderDeclarationConfig;
declare function buildLiveXaiProvider(params: {
  apiKey?: string;
  discoveryApiKey?: string;
  fetchGuard?: LiveModelCatalogFetchGuard;
  signal?: AbortSignal;
}): Promise<ModelProviderDeclarationConfig>;
declare function buildLiveXaiOAuthProvider(params: {
  discoveryApiKey: string;
  fetchGuard?: LiveModelCatalogFetchGuard;
  signal?: AbortSignal;
}): Promise<ModelProviderDeclarationConfig>;
//#endregion
export { buildLiveXaiProvider as n, buildXaiProvider as r, buildLiveXaiOAuthProvider as t };
