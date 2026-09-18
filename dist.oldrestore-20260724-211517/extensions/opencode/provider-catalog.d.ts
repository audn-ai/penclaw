import { t as ModelCatalogEntry } from "../../model-catalog.types-DCVmZqMZ.js";
import { a as LiveModelCatalogFetchGuard } from "../../provider-catalog-live-runtime-Ndcwxy1x.js";
import { nd as ProviderRuntimeModel } from "../../types-Ga3mNO_F.js";
import { m as ModelProviderDeclarationConfig } from "../../types.models-BqJSiNyu.js";

//#region extensions/opencode/provider-catalog.d.ts
type FetchOpencodeZenLiveModelIdsParams = {
  apiKey?: string;
  discoveryApiKey?: string;
  fetchGuard?: LiveModelCatalogFetchGuard;
  signal?: AbortSignal;
};
declare function buildStaticOpencodeZenProviderConfig(
  apiKey?: string,
): ModelProviderDeclarationConfig;
declare function buildOpencodeZenLiveProviderConfig(
  params?: FetchOpencodeZenLiveModelIdsParams,
): Promise<ModelProviderDeclarationConfig>;
declare function listOpencodeZenModelCatalogEntries(): ModelCatalogEntry[];
declare function resolveOpencodeZenModel(modelId: string): ProviderRuntimeModel | undefined;
declare function normalizeOpencodeZenBaseUrl(params: {
  api?: string | null;
  baseUrl?: string;
}): string | undefined;
//#endregion
export {
  FetchOpencodeZenLiveModelIdsParams,
  buildOpencodeZenLiveProviderConfig,
  buildStaticOpencodeZenProviderConfig,
  listOpencodeZenModelCatalogEntries,
  normalizeOpencodeZenBaseUrl,
  resolveOpencodeZenModel,
};
