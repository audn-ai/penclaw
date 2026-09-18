import { M as Usage } from "./types-CqrbBnUB.js";

//#region src/agents/usage.d.ts
type ContextUsage = NonNullable<Usage["contextUsage"]>;
/** Provider/SDK usage payload variants accepted by usage normalization. */
type UsageLike = {
  input?: number;
  output?: number;
  cacheRead?: number;
  cacheWrite?: number;
  contextUsage?: ContextUsage;
  total?: number;
  inputTokens?: number;
  outputTokens?: number;
  promptTokens?: number;
  completionTokens?: number;
  input_tokens?: number;
  output_tokens?: number;
  prompt_tokens?: number;
  completion_tokens?: number;
  cache_read_input_tokens?: number;
  cache_creation_input_tokens?: number;
  reasoningTokens?: number;
  reasoning_tokens?: number;
  completion_tokens_details?: {
    reasoning_tokens?: number;
  };
  output_tokens_details?: {
    reasoning_tokens?: number;
  };
  cached_tokens?: number;
  input_tokens_details?: {
    cached_tokens?: number;
  };
  prompt_tokens_details?: {
    cached_tokens?: number;
  };
  totalTokens?: number;
  total_tokens?: number;
  cache_read?: number;
  cache_write?: number;
  prompt_n?: number;
  predicted_n?: number;
  timings?: {
    prompt_n?: number;
    predicted_n?: number;
  };
  cost?: Partial<Usage["cost"]>;
};
/** Normalized token counts used by runtime accounting. */
type NormalizedUsage = {
  input?: number;
  output?: number;
  cacheRead?: number;
  cacheWrite?: number;
  contextUsage?: ContextUsage;
  reasoningTokens?: number;
  total?: number;
};
/** Normalize provider-specific token usage fields into OpenClaw usage buckets. */
declare function normalizeUsage(raw?: UsageLike | null): NormalizedUsage | undefined;
//#endregion
export { NormalizedUsage as n, normalizeUsage as r, ContextUsage as t };
