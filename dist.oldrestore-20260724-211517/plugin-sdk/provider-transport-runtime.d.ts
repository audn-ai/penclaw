import { OpenAICompletionsToolChoice, OpenAIReasoningEffort } from "@openclaw/ai/internal/openai";
import {
  describeToolResultMediaPlaceholder,
  extractToolResultText,
  stripSystemPromptCacheBoundary,
} from "@openclaw/ai/internal/shared";
import OpenAI from "openai";
import { c as Context, f as Model, n as Api } from "../types-CqrbBnUB.js";
import { o as ModelCompatConfig } from "../types.models-BqJSiNyu.js";
import { t as ContextUsage } from "../usage-DzTfux3q.js";
import { r as AssistantMessageEventStream } from "../validation-Bz0Wu-U6.js";
//#region src/agents/provider-transport-fetch.d.ts
declare function buildGuardedModelFetch(
  model: Model,
  timeoutMs?: number,
  options?: {
    sanitizeSse?: boolean;
  },
): typeof fetch;
//#endregion
//#region src/agents/openai-transport-shared.d.ts
type BaseOpenAIStreamOptions = {
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  stop?: string[];
  signal?: AbortSignal;
  apiKey?: string;
  cacheRetention?: "none" | "short" | "long";
  sessionId?: string;
  promptCacheKey?: string;
  authProfileId?: string;
  onPayload?: (payload: unknown, model: Model) => unknown;
  headers?: Record<string, string>;
  firstEventTimeoutMs?: number;
  onFirstEventTimeout?: (reason: Error) => void;
  openclawCodeModeToolSurface?: boolean;
  responseFormat?: Record<string, unknown>;
  frequencyPenalty?: number;
  presencePenalty?: number;
  seed?: number;
};
type OpenAICompletionsOptions = BaseOpenAIStreamOptions & {
  toolChoice?: OpenAICompletionsToolChoice;
  reasoning?: OpenAIReasoningEffort;
  reasoningEffort?: OpenAIReasoningEffort;
};
type OpenAIModeCompatInput = Omit<ModelCompatConfig, "thinkingFormat"> & {
  thinkingFormat?: string;
};
type OpenAIModeModel = Omit<Model, "compat"> & {
  compat?: OpenAIModeCompatInput | null;
};
//#endregion
//#region src/agents/openai-transport-stream.d.ts
declare function buildOpenAICompletionsParams(
  model: OpenAIModeModel,
  context: Context,
  options: OpenAICompletionsOptions | undefined,
): Record<string, unknown>;
//#endregion
//#region src/agents/transport-message-transform.d.ts
/** Transforms transcript messages into a provider-safe replay context. */
declare function transformTransportMessages(
  messages: Context["messages"],
  model: Model,
  normalizeToolCallId?: (
    id: string,
    targetModel: Model,
    source: {
      provider: string;
      api: Api;
      model: string;
    },
  ) => string,
  options?: {
    normalizeSameModelToolCallIds?: boolean;
    preserveCrossModelToolCallThoughtSignature?: boolean;
  },
): Context["messages"];
//#endregion
//#region src/agents/transport-stream-shared.d.ts
type TransportUsage = {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  contextUsage?: ContextUsage;
  totalTokens: number;
  cost: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
    total: number;
  };
};
type WritableTransportStream = {
  push(event: unknown): void;
  end(): void;
};
type TransportOutputShape = {
  stopReason: string;
  errorMessage?: string;
  errorCode?: string;
  errorType?: string;
  errorBody?: string;
};
/**
 * Encodes an assistant text-block phase signature (v1). Channels and the
 * embedded handler read this to route commentary/narration out of the final
 * reply. Shared so every provider transport tags phases identically.
 */
declare function sanitizeTransportPayloadText(text: string): string;
declare function coerceTransportToolCallArguments(argumentsValue: unknown): Record<string, unknown>;
declare function mergeTransportHeaders(
  ...headerSources: Array<Record<string, string> | undefined>
): Record<string, string> | undefined;
declare function createEmptyTransportUsage(): TransportUsage;
declare function createWritableTransportEventStream(): {
  eventStream: AssistantMessageEventStream;
  stream: WritableTransportStream;
};
declare function finalizeTransportStream(params: {
  stream: WritableTransportStream;
  output: TransportOutputShape;
  signal?: AbortSignal;
}): void;
declare function failTransportStream(params: {
  stream: WritableTransportStream;
  output: TransportOutputShape;
  signal?: AbortSignal;
  error: unknown;
  cleanup?: () => void;
}): void;
//#endregion
export {
  type WritableTransportStream,
  buildGuardedModelFetch,
  buildOpenAICompletionsParams,
  coerceTransportToolCallArguments,
  createEmptyTransportUsage,
  createWritableTransportEventStream,
  describeToolResultMediaPlaceholder,
  extractToolResultText,
  failTransportStream,
  finalizeTransportStream,
  mergeTransportHeaders,
  sanitizeTransportPayloadText,
  stripSystemPromptCacheBoundary,
  transformTransportMessages,
};
