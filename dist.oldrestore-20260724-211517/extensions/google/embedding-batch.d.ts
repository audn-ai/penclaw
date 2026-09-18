import {
  i as GeminiTextEmbeddingRequest,
  r as GeminiEmbeddingClient,
} from "../../embedding-provider-BAjD1IAS.js";
import { Ds as EmbeddingBatchExecutionParams } from "../../types-Ga3mNO_F.js";

//#region extensions/google/embedding-batch.d.ts
type GeminiBatchRequest = {
  custom_id: string;
  request: GeminiTextEmbeddingRequest;
};
declare function runGeminiEmbeddingBatches(
  params: {
    gemini: GeminiEmbeddingClient;
    agentId: string;
    requests: GeminiBatchRequest[];
  } & EmbeddingBatchExecutionParams,
): Promise<Map<string, number[]>>;
//#endregion
export { runGeminiEmbeddingBatches };
