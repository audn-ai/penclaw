import { t as DiagnosticTraceContext } from "../diagnostic-trace-context-c5mRZYEt.js";
import {
  a as resetGlobalHookRunner,
  i as initializeGlobalHookRunner,
} from "../hook-runner-global-CTCX7Vbc.js";
import {
  $t as PluginHookMessageReceivedEvent,
  Qt as PluginHookMessageContext,
  Xt as PluginHookInboundClaimContext,
  Zt as PluginHookInboundClaimEvent,
  nn as PluginHookMessageSentEvent,
} from "../hook-types-BPL4xByC.js";
import {
  n as InternalHookEventType,
  r as InternalHookHandler,
  t as InternalHookEvent,
} from "../internal-hook-types-BohNPEA8.js";
import {
  C as isMessageSentEvent,
  D as setInternalHooksEnabled,
  E as registerInternalHook,
  O as triggerInternalHook,
  S as isMessageReceivedEvent,
  T as isSessionPatchEvent,
  _ as getRegisteredEventKeys,
  a as MessagePreprocessedHookContext,
  b as isGatewayStartupEvent,
  c as MessageReceivedHookEvent,
  d as MessageTranscribedHookContext,
  f as MessageTranscribedHookEvent,
  g as createInternalHookEvent,
  h as clearInternalHooks,
  i as GatewayStartupHookEvent,
  k as unregisterInternalHook,
  l as MessageSentHookContext,
  m as SessionPatchHookEvent,
  n as AgentBootstrapHookEvent,
  o as MessagePreprocessedHookEvent,
  p as SessionPatchHookContext,
  r as GatewayStartupHookContext,
  s as MessageReceivedHookContext,
  t as AgentBootstrapHookContext,
  u as MessageSentHookEvent,
  v as hasInternalHookListeners,
  w as isMessageTranscribedEvent,
  x as isMessagePreprocessedEvent,
  y as isAgentBootstrapEvent,
} from "../internal-hooks-FxYKTUaR.js";
import { t as FinalizedMsgContext } from "../templating-h3OQefFR.js";
import { i as OpenClawConfig } from "../types.openclaw-DDo8sH3F.js";

//#region src/hooks/fire-and-forget.d.ts
/** Queue limits for bounded fire-and-forget hook execution. */
type FireAndForgetBoundedHookOptions = {
  maxConcurrency?: number;
  maxQueue?: number;
  timeoutMs?: number;
};
/** Format hook errors as bounded single-line log messages with secrets redacted upstream. */
declare function formatHookErrorForLog(err: unknown): string;
/** Run a hook promise without awaiting it, logging rejection safely. */
declare function fireAndForgetHook(
  task: Promise<unknown>,
  label: string,
  logger?: (message: string) => void,
): void;
/** Queue a fire-and-forget hook with bounded concurrency, queue depth, and timeout logs. */
declare function fireAndForgetBoundedHook(
  task: () => Promise<unknown>,
  label: string,
  logger?: (message: string) => void,
  options?: FireAndForgetBoundedHookOptions,
): void;
//#endregion
//#region src/hooks/message-hook-mappers.d.ts
type CanonicalInboundMessageHookContext = {
  from: string;
  to?: string;
  content: string;
  body?: string;
  bodyForAgent?: string;
  transcript?: string;
  timestamp?: number;
  channelId: string;
  accountId?: string;
  conversationId?: string;
  sessionKey?: string;
  agentId?: string;
  runId?: string;
  messageId?: string;
  senderId?: string;
  senderName?: string;
  senderUsername?: string;
  senderE164?: string;
  replyToId?: string;
  replyToIdFull?: string;
  replyToBody?: string;
  replyToSender?: string;
  replyToIsQuote?: boolean;
  provider?: string;
  surface?: string;
  threadId?: string | number;
  threadParentId?: string | number;
  mediaPath?: string;
  mediaUrl?: string;
  mediaType?: string;
  mediaPaths?: string[];
  mediaUrls?: string[];
  mediaTypes?: string[];
  mediaRemoteHost?: string;
  mediaStagingPending?: boolean;
  originalMediaPath?: string;
  originalMediaUrl?: string;
  originalMediaType?: string;
  originalMediaPaths?: string[];
  originalMediaUrls?: string[];
  originalMediaTypes?: string[];
  originatingChannel?: string;
  originatingTo?: string;
  guildId?: string;
  channelName?: string;
  isGroup: boolean;
  groupId?: string;
  topicName?: string;
  trace?: DiagnosticTraceContext;
  callDepth?: number;
};
type CanonicalSentMessageHookContext = {
  to: string;
  content: string;
  success: boolean;
  error?: string;
  channelId: string;
  accountId?: string;
  conversationId?: string;
  sessionKey?: string;
  runId?: string;
  messageId?: string;
  trace?: DiagnosticTraceContext;
  callDepth?: number;
  isGroup?: boolean;
  groupId?: string;
};
declare function deriveInboundMessageHookContext(
  ctx: FinalizedMsgContext,
  overrides?: {
    content?: string;
    messageId?: string;
  },
): CanonicalInboundMessageHookContext;
declare function buildCanonicalSentMessageHookContext(params: {
  to: string;
  content: string;
  success: boolean;
  error?: string;
  channelId: string;
  accountId?: string;
  conversationId?: string;
  sessionKey?: string;
  runId?: string;
  messageId?: string;
  trace?: DiagnosticTraceContext;
  callDepth?: number;
  isGroup?: boolean;
  groupId?: string;
}): CanonicalSentMessageHookContext;
declare function toPluginMessageContext(
  canonical: CanonicalInboundMessageHookContext | CanonicalSentMessageHookContext,
): PluginHookMessageContext;
declare function toPluginInboundClaimContext(
  canonical: CanonicalInboundMessageHookContext,
): PluginHookInboundClaimContext;
declare function toPluginInboundClaimEvent(
  canonical: CanonicalInboundMessageHookContext,
  extras?: {
    commandAuthorized?: boolean;
    wasMentioned?: boolean;
  },
): PluginHookInboundClaimEvent;
declare function toPluginMessageReceivedEvent(
  canonical: CanonicalInboundMessageHookContext,
): PluginHookMessageReceivedEvent;
declare function toPluginMessageSentEvent(
  canonical: CanonicalSentMessageHookContext,
): PluginHookMessageSentEvent;
declare function toInternalMessageReceivedContext(
  canonical: CanonicalInboundMessageHookContext,
): MessageReceivedHookContext;
declare function toInternalMessageTranscribedContext(
  canonical: CanonicalInboundMessageHookContext,
  cfg: OpenClawConfig,
): MessageTranscribedHookContext & {
  cfg: OpenClawConfig;
};
declare function toInternalMessagePreprocessedContext(
  canonical: CanonicalInboundMessageHookContext,
  cfg: OpenClawConfig,
): MessagePreprocessedHookContext & {
  cfg: OpenClawConfig;
};
declare function toInternalMessageSentContext(
  canonical: CanonicalSentMessageHookContext,
): MessageSentHookContext;
//#endregion
export {
  AgentBootstrapHookContext,
  AgentBootstrapHookEvent,
  CanonicalInboundMessageHookContext,
  CanonicalSentMessageHookContext,
  FireAndForgetBoundedHookOptions,
  GatewayStartupHookContext,
  GatewayStartupHookEvent,
  type InternalHookEvent,
  type InternalHookEventType,
  type InternalHookHandler,
  MessagePreprocessedHookContext,
  MessagePreprocessedHookEvent,
  MessageReceivedHookContext,
  MessageReceivedHookEvent,
  MessageSentHookContext,
  MessageSentHookEvent,
  MessageTranscribedHookContext,
  MessageTranscribedHookEvent,
  SessionPatchHookContext,
  SessionPatchHookEvent,
  buildCanonicalSentMessageHookContext,
  clearInternalHooks,
  createInternalHookEvent,
  deriveInboundMessageHookContext,
  fireAndForgetBoundedHook,
  fireAndForgetHook,
  formatHookErrorForLog,
  getRegisteredEventKeys,
  hasInternalHookListeners,
  initializeGlobalHookRunner,
  isAgentBootstrapEvent,
  isGatewayStartupEvent,
  isMessagePreprocessedEvent,
  isMessageReceivedEvent,
  isMessageSentEvent,
  isMessageTranscribedEvent,
  isSessionPatchEvent,
  registerInternalHook,
  resetGlobalHookRunner,
  setInternalHooksEnabled,
  toInternalMessagePreprocessedContext,
  toInternalMessageReceivedContext,
  toInternalMessageSentContext,
  toInternalMessageTranscribedContext,
  toPluginInboundClaimContext,
  toPluginInboundClaimEvent,
  toPluginMessageContext,
  toPluginMessageReceivedEvent,
  toPluginMessageSentEvent,
  triggerInternalHook,
  unregisterInternalHook,
};
