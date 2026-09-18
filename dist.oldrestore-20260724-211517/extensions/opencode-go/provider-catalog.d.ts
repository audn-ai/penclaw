import { t as ModelCatalogEntry } from "../../model-catalog.types-DCVmZqMZ.js";
import { a as LiveModelCatalogFetchGuard } from "../../provider-catalog-live-runtime-Ndcwxy1x.js";
import { nd as ProviderRuntimeModel } from "../../types-Ga3mNO_F.js";
import { m as ModelProviderDeclarationConfig } from "../../types.models-BqJSiNyu.js";

//#region extensions/opencode-go/provider-catalog.d.ts
type FetchOpencodeGoLiveModelIdsParams = {
  apiKey?: string;
  discoveryApiKey?: string;
  fetchGuard?: LiveModelCatalogFetchGuard;
  signal?: AbortSignal;
};
declare function buildStaticOpencodeGoProviderConfig(
  apiKey?: string,
): ModelProviderDeclarationConfig;
declare function buildOpencodeGoLiveProviderConfig(
  params?: FetchOpencodeGoLiveModelIdsParams,
): Promise<ModelProviderDeclarationConfig>;
declare function listOpencodeGoModelCatalogEntries(): ModelCatalogEntry[];
declare function resolveOpencodeGoModel(modelId: string): ProviderRuntimeModel | undefined;
declare function isOpencodeGoKimiNoReasoningModelId(modelId: unknown): boolean;
declare function normalizeOpencodeGoResolvedModel(
  model: ProviderRuntimeModel,
): ProviderRuntimeModel | undefined;
declare function normalizeOpencodeGoBaseUrl(params: {
  api?: string | null;
  baseUrl?: string;
}): string | undefined;
//#endregion
export {
  buildOpencodeGoLiveProviderConfig,
  buildStaticOpencodeGoProviderConfig,
  isOpencodeGoKimiNoReasoningModelId,
  listOpencodeGoModelCatalogEntries,
  normalizeOpencodeGoBaseUrl,
  normalizeOpencodeGoResolvedModel,
  resolveOpencodeGoModel,
};
