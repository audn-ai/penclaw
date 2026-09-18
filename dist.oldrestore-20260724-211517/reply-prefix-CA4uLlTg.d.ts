import { n as GetReplyOptions } from "./types-BgrDi5xH.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/channels/typing.d.ts
type TypingCallbacks = {
  onReplyStart: () => Promise<void>;
  onIdle?: () => void /** Called when the typing controller is cleaned up (e.g. on NO_REPLY). */;
  onCleanup?: () => void;
};
type CreateTypingCallbacksParams = {
  start: () => Promise<void>;
  stop?: () => Promise<void>;
  onStartError: (err: unknown) => void;
  onStopError?: (err: unknown) => void;
  keepaliveIntervalMs?: number /** Stop keepalive after this many consecutive start() failures. Default: 2 */;
  maxConsecutiveFailures?: number /** Maximum duration for typing indicator before auto-cleanup (safety TTL). Default: 60s */;
  maxDurationMs?: number;
};
declare function createTypingCallbacks(params: CreateTypingCallbacksParams): TypingCallbacks;
//#endregion
//#region src/auto-reply/reply/response-prefix-template.d.ts
/**
 * Template interpolation for response prefix.
 *
 * Supports variables like `{model}`, `{provider}`, `{thinkingLevel}`, etc.
 * Variables are case-insensitive and unresolved ones remain as literal text.
 */
type ResponsePrefixContext = {
  /** Short model name (e.g., "gpt-5.4", "claude-opus-4-6") */ model?: string /** Full model ID including provider (e.g., "openai/gpt-5.6-sol") */;
  modelFull?: string /** Provider name (e.g., "openai", "anthropic") */;
  provider?: string /** Current thinking level (e.g., "high", "low", "off") */;
  thinkingLevel?: string /** Agent identity name */;
  identityName?: string;
};
//#endregion
//#region src/channels/reply-prefix.d.ts
type ModelSelectionContext = Parameters<NonNullable<GetReplyOptions["onModelSelected"]>>[0];
/**
 * Mutable response-prefix state shared between reply setup and model selection callbacks.
 */
type ReplyPrefixContextBundle = {
  prefixContext: ResponsePrefixContext;
  responsePrefix?: string;
  responsePrefixContextProvider: () => ResponsePrefixContext;
  onModelSelected: (ctx: ModelSelectionContext) => void;
};
/**
 * Reply option subset consumed by channel reply dispatchers.
 */
type ReplyPrefixOptions = Pick<
  ReplyPrefixContextBundle,
  "responsePrefix" | "responsePrefixContextProvider" | "onModelSelected"
>;
/**
 * Creates response-prefix options and a live context provider for the selected model.
 */
declare function createReplyPrefixContext(params: {
  cfg: OpenClawConfig;
  agentId: string;
  channel?: string;
  accountId?: string;
}): ReplyPrefixContextBundle;
/**
 * Creates the reply-prefix options object expected by `getReply` call sites.
 */
declare function createReplyPrefixOptions(params: {
  cfg: OpenClawConfig;
  agentId: string;
  channel?: string;
  accountId?: string;
}): ReplyPrefixOptions;
//#endregion
export {
  ResponsePrefixContext as a,
  createTypingCallbacks as c,
  createReplyPrefixOptions as i,
  ReplyPrefixOptions as n,
  CreateTypingCallbacksParams as o,
  createReplyPrefixContext as r,
  TypingCallbacks as s,
  ReplyPrefixContextBundle as t,
};
