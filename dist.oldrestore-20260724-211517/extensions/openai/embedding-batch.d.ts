import { n as OpenAiEmbeddingClient } from "../../embedding-provider-D6OXXFqV.js";
import {
  Ds as EmbeddingBatchExecutionParams,
  Ms as ProviderBatchOutputLine,
} from "../../types-Ga3mNO_F.js";

//#region extensions/openai/embedding-batch.d.ts
type OpenAiBatchRequest = {
  custom_id: string;
  method: "POST";
  url: "/v1/embeddings";
  body: {
    model: string;
    input: string;
  };
};
type OpenAiBatchOutputLine = ProviderBatchOutputLine;
declare const OPENAI_BATCH_ENDPOINT = "/v1/embeddings";
declare function parseOpenAiBatchOutput(text: string): OpenAiBatchOutputLine[];
declare function runOpenAiEmbeddingBatches(
  params: {
    openAi: OpenAiEmbeddingClient;
    agentId: string;
    requests: OpenAiBatchRequest[];
    maxJsonlBytes?: number;
  } & EmbeddingBatchExecutionParams,
): Promise<Map<string, number[]>>;
//#endregion
export { OPENAI_BATCH_ENDPOINT, parseOpenAiBatchOutput, runOpenAiEmbeddingBatches };
