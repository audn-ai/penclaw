import * as import__openclaw_ai_event_stream from "@openclaw/ai/event-stream";
import { Hn as Agent$1, Un as AgentOptions } from "./index--Mxo3qUC.js";
//#region src/llm/utils/event-stream.d.ts
import {
  b as StreamFn,
  c as Context,
  f as Model,
  i as AssistantMessageEvent,
  r as AssistantMessage,
  s as CompleteSimpleFn,
  v as SimpleStreamOptions,
  y as StopReason,
} from "./types-CqrbBnUB.js";
//#endregion
//#region src/agents/runtime/proxy.d.ts
declare class ProxyMessageEventStream extends event_stream_d_exports.EventStream<
  AssistantMessageEvent,
  AssistantMessage
> {
  constructor();
}
/**
 * Proxy event types - server sends these with partial field stripped to reduce bandwidth.
 */
type ProxyAssistantMessageEvent =
  | {
      type: "start";
    }
  | {
      type: "text_start";
      contentIndex: number;
      contentSignature?: string;
    }
  | {
      type: "text_delta";
      contentIndex: number;
      delta: string;
    }
  | {
      type: "text_end";
      contentIndex: number;
      contentSignature?: string;
    }
  | {
      type: "thinking_start";
      contentIndex: number;
    }
  | {
      type: "thinking_delta";
      contentIndex: number;
      delta: string;
    }
  | {
      type: "thinking_end";
      contentIndex: number;
      contentSignature?: string;
    }
  | {
      type: "toolcall_start";
      contentIndex: number;
      id: string;
      toolName: string;
    }
  | {
      type: "toolcall_delta";
      contentIndex: number;
      delta: string;
    }
  | {
      type: "toolcall_end";
      contentIndex: number;
    }
  | {
      type: "done";
      reason: Extract<StopReason, "stop" | "length" | "toolUse">;
      usage: AssistantMessage["usage"];
    }
  | {
      type: "error";
      reason: Extract<StopReason, "aborted" | "error">;
      errorMessage?: string;
      usage: AssistantMessage["usage"];
    };
type ProxySerializableStreamOptions = Pick<
  SimpleStreamOptions,
  | "temperature"
  | "maxTokens"
  | "reasoning"
  | "cacheRetention"
  | "sessionId"
  | "promptCacheKey"
  | "metadata"
  | "transport"
  | "thinkingBudgets"
  | "maxRetryDelayMs"
  | "timeoutMs"
>;
interface ProxyStreamOptions extends ProxySerializableStreamOptions {
  /** Local abort signal for the proxy request */
  signal?: AbortSignal;
  /** Auth token for the proxy server */
  authToken: string;
  /** Proxy server URL (e.g., "https://genai.example.com") */
  proxyUrl: string;
}
declare function streamProxy(
  model: Model,
  context: Context,
  options: ProxyStreamOptions,
): ProxyMessageEventStream;
//#endregion
//#region src/plugin-sdk/agent-core.d.ts
/** Runtime adapter that lets the package agent-core use OpenClaw LLM helpers. */
declare const openClawAgentCoreRuntime: {
  completeSimple: CompleteSimpleFn;
  streamSimple: StreamFn;
};
/** Agent-core class preconfigured with OpenClaw runtime dependencies. */
declare class Agent extends Agent$1 {
  constructor(options?: AgentOptions);
}
//#endregion
export {
  streamProxy as a,
  ProxyStreamOptions as i,
  openClawAgentCoreRuntime as n,
  ProxyAssistantMessageEvent as r,
  Agent as t,
};
