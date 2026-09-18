import { n as VoyageEmbeddingClient } from "../../embedding-provider-C9cncLK7.js";
import {
  Ds as EmbeddingBatchExecutionParams,
  Ns as postJsonWithRetry,
  Uo as withRemoteHttpResponse,
  js as EmbeddingBatchStatus,
  vs as uploadBatchJsonlFile,
} from "../../types-Ga3mNO_F.js";

//#region extensions/voyage/embedding-batch.d.ts
/**
 * Voyage Batch API Input Line format.
 * See: https://docs.voyageai.com/docs/batch-inference
 */
type VoyageBatchRequest = {
  custom_id: string;
  body: {
    input: string | string[];
  };
};
type VoyageBatchStatus = EmbeddingBatchStatus;
type VoyageBatchDeps = {
  now: () => number;
  sleep: (ms: number) => Promise<void>;
  postJsonWithRetry: typeof postJsonWithRetry<VoyageBatchStatus>;
  uploadBatchJsonlFile: typeof uploadBatchJsonlFile;
  withRemoteHttpResponse: typeof withRemoteHttpResponse;
};
declare function fetchVoyageBatchStatus(params: {
  client: VoyageEmbeddingClient;
  batchId: string;
  deps: VoyageBatchDeps;
  maxResponseBytes?: number;
}): Promise<VoyageBatchStatus>;
declare function readVoyageBatchError(params: {
  client: VoyageEmbeddingClient;
  errorFileId: string;
  deps: VoyageBatchDeps;
  maxResponseBytes?: number;
}): Promise<string | undefined>;
declare function runVoyageEmbeddingBatches(
  params: {
    client: VoyageEmbeddingClient;
    agentId: string;
    requests: VoyageBatchRequest[];
    deps?: Partial<VoyageBatchDeps>;
  } & EmbeddingBatchExecutionParams,
): Promise<Map<string, number[]>>;
declare const testing: {
  readonly fetchVoyageBatchStatus: typeof fetchVoyageBatchStatus;
  readonly readVoyageBatchError: typeof readVoyageBatchError;
  readonly VOYAGE_BATCH_RESPONSE_MAX_BYTES: number;
};
//#endregion
export { runVoyageEmbeddingBatches, testing };
