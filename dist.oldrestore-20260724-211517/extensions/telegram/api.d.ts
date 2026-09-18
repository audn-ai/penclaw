import {
  Chat,
  ChatFullInfo,
  Message,
  Message as TelegramBotMessage,
  Update as TelegramBotUpdate,
  UserFromGetMe,
} from "grammy/types";
import {
  n as TelegramCredentialStatus,
  r as inspectTelegramAccount,
  t as InspectedTelegramAccount,
} from "../../account-inspect-DxiNhXrb.js";
import {
  a as listEnabledTelegramAccounts,
  c as resolveDefaultTelegramAccountId,
  d as resolveTelegramPollActionGateState,
  f as mergeTelegramAccountConfig,
  i as createTelegramActionGate,
  l as resolveTelegramAccount,
  n as TelegramMediaRuntimeOptions,
  o as listTelegramAccountIds,
  p as resolveTelegramAccountConfig,
  r as TelegramPollActionGateState,
  s as resetMissingDefaultWarnFlag,
  t as ResolvedTelegramAccount,
  u as resolveTelegramMediaRuntimeOptions,
} from "../../accounts-B_z9gHZ0.js";
import {
  n as isNumericTelegramUserId,
  r as normalizeTelegramAllowFromEntry,
  t as isNumericTelegramSenderUserId,
} from "../../allow-from-CUKXV9ZT.js";
import { t as telegramPlugin } from "../../channel-DCGHMA5R.js";
import { t as telegramSetupPlugin } from "../../channel.setup-BPZMuHSg.js";
import {
  a as normalizeTelegramCommandName,
  i as normalizeTelegramCommandDescription,
  n as TelegramCustomCommandInput,
  o as resolveTelegramCustomCommands,
  r as TelegramCustomCommandIssue,
  t as TELEGRAM_COMMAND_NAME_PATTERN,
} from "../../command-config-B5uSKuEF.js";
import {
  n as listTelegramDirectoryPeersFromConfig,
  t as listTelegramDirectoryGroupsFromConfig,
} from "../../directory-config-BhdSqKeu.js";
import { l as ExecApprovalRequest } from "../../exec-approvals-B59RubLo.js";
import {
  _ as parseModelCallbackData,
  a as buildTelegramModelsProviderChannelData,
  c as ParsedModelCallback,
  d as buildBrowseProvidersButton,
  f as buildModelSelectionCallbackData,
  g as getModelsPageSize,
  h as calculateTotalPages,
  i as buildCommandsPaginationKeyboard,
  l as ProviderInfo,
  m as buildProviderKeyboard,
  n as TelegramInteractiveHandlerRegistration,
  o as ButtonRow,
  p as buildModelsKeyboard,
  r as TelegramInteractiveHandlerResult,
  s as ModelsKeyboardParams,
  t as TelegramInteractiveHandlerContext,
  u as ResolveModelSelectionResult,
  v as resolveModelSelection,
} from "../../interactive-dispatch-CnSyXBVc.js";
import { n as ChannelOutboundAdapter } from "../../outbound.types-Bu7WWq9f.js";
import { a as readChannelAllowFromStore } from "../../pairing-store-CaT4kVxr.js";
import { s as PluginApprovalRequest } from "../../plugin-approvals-DCKU3bfY.js";
import {
  i as resetTelegramProbeFetcherCacheForTests,
  n as TelegramProbeOptions,
  r as probeTelegram,
  t as TelegramProbe,
} from "../../probe-CqqU3R6r.js";
import { r as ReplyPayload } from "../../reply-payload-D9hNZyN3.js";
import { f as NormalizedLocation } from "../../reply-payload-DPFdJynw.js";
import {
  c as describeStickerImage,
  d as getAllCachedStickers,
  f as getCacheStats,
  g as shouldSuppressTelegramExecApprovalForwardingFallback,
  h as buildTelegramExecApprovalPendingPayload,
  l as CachedSticker,
  m as searchStickers,
  p as getCachedSticker,
  s as DescribeStickerParams,
  u as cacheSticker,
  v as NormalizedAllowFrom,
} from "../../runtime-api-BHLv84Uu.js";
import {
  f as sendLocationTelegram,
  p as sendMessageTelegram,
  u as reactMessageTelegram,
  v as TelegramButtonStyle,
  y as TelegramInlineButtons,
} from "../../runtime-CuY_VuJY.js";
import { t as collectTelegramSecurityAuditFindings } from "../../security-audit-Bp9sqxt-.js";
import { t as TelegramTokenResolution } from "../../token-BmfcHrcM.js";
import {
  n as parseTelegramTopicConversation,
  t as ParsedTelegramTopicConversation,
} from "../../topic-conversation-DB0Kpc_a.js";
import { C as MarkdownTableMode, g as DmPolicy } from "../../types.base-ibSxQuK3.js";
import {
  A as TelegramNetworkConfig,
  C as TelegramDirectConfig,
  E as TelegramExecApprovalConfig,
  O as TelegramGroupConfig,
  P as TelegramTopicConfig,
  h as ResolvedReactionLevel$1,
  k as TelegramInlineButtonsScope,
  m as ReactionLevel,
} from "../../types.channels-CYB_Xphv.js";
import {
  P as ChannelStatusIssue,
  m as ChannelGroupContext,
  r as ChannelAccountSnapshot,
} from "../../types.core-CcwzPNhX.js";
import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";
import { ct as GroupToolPolicyConfig } from "../../types.slack-DOPma3IJ.js";
import {
  n as readTelegramUpdateOffset,
  r as writeTelegramUpdateOffset,
  t as deleteTelegramUpdateOffset,
} from "../../update-offset-store-C0iicdOm.js";

//#region extensions/telegram/src/action-threading.d.ts
declare function resolveTelegramAutoThreadId(params: {
  to: string;
  toolContext?: {
    currentThreadTs?: string;
    currentChannelId?: string;
  };
}): string | undefined;
//#endregion
//#region extensions/telegram/src/api-fetch.d.ts
declare function resolveTelegramChatLookupFetch(params?: {
  proxyUrl?: string;
  network?: TelegramNetworkConfig;
}): typeof fetch;
declare function lookupTelegramChatId(params: {
  token: string;
  chatId: string;
  signal?: AbortSignal;
  apiRoot?: string;
  proxyUrl?: string;
  network?: TelegramNetworkConfig;
  timeoutSeconds?: unknown;
}): Promise<string | null>;
declare function fetchTelegramChatId(params: {
  token: string;
  chatId: string;
  signal?: AbortSignal;
  apiRoot?: string;
  fetchImpl?: typeof fetch;
  timeoutSeconds?: unknown;
}): Promise<string | null>;
//#endregion
//#region extensions/telegram/src/bot/body-helpers.d.ts
type TelegramMediaMessage = Pick<
  Message,
  "photo" | "video" | "video_note" | "audio" | "voice" | "document" | "sticker"
>;
declare function buildSenderName(msg: Message): string | undefined;
declare function resolveTelegramMediaPlaceholder(
  msg: TelegramMediaMessage | undefined | null,
): string | undefined;
declare function buildSenderLabel(msg: Message, senderId?: number | string): string;
type TelegramTextEntity = NonNullable<Message["entities"]>[number];
type TelegramTextMessage = Pick<Message, "text" | "caption" | "entities" | "caption_entities"> & {
  rich_message?: unknown;
};
declare function isBinaryContent(text: string): boolean;
declare function getTelegramTextParts(msg: TelegramTextMessage): {
  text: string;
  entities: TelegramTextEntity[];
};
declare function hasBotMention(msg: Message, botUsername: string): boolean;
type TelegramForwardedContext = {
  from: string;
  date?: number;
  fromType: string;
  fromId?: string;
  fromUsername?: string;
  fromTitle?: string;
  fromSignature?: string;
  fromChatType?: Chat["type"];
  fromMessageId?: number;
};
declare function normalizeForwardedContext(msg: Message): TelegramForwardedContext | null;
declare function extractTelegramLocation(msg: Message): NormalizedLocation | null;
//#endregion
//#region extensions/telegram/src/bot/types.d.ts
/** App-specific stream mode for Telegram stream previews. */
type TelegramStreamMode = "off" | "partial" | "block" | "progress";
type TelegramChatDetails = {
  id?: number | string;
  available_reactions?: ChatFullInfo["available_reactions"] | null;
  is_forum?: boolean;
};
type TelegramGetChat = (chatId: number | string) => Promise<TelegramChatDetails>;
/** Telegram sticker metadata for context enrichment and caching. */
interface StickerMetadata {
  /** Emoji associated with the sticker. */
  emoji?: string;
  /** Name of the sticker set the sticker belongs to. */
  setName?: string;
  /** Telegram file_id for sending the sticker back. */
  fileId?: string;
  /** Stable file_unique_id for cache deduplication. */
  fileUniqueId?: string;
  /** Cached description from previous vision processing (skip re-processing if present). */
  cachedDescription?: string;
}
//#endregion
//#region extensions/telegram/src/bot/helpers.d.ts
declare function resetTelegramForumFlagCacheForTest(): void;
type TelegramThreadSpec = {
  id?: number;
  scope: "dm" | "forum" | "none";
};
declare function extractTelegramForumFlag(value: unknown): boolean | undefined;
declare function resolveTelegramForumFlag(params: {
  chatId: string | number;
  chatType?: Chat["type"];
  isGroup: boolean;
  isForum?: boolean;
  isTopicMessage?: boolean;
  getChat?: TelegramGetChat;
}): Promise<boolean>;
declare function withResolvedTelegramForumFlag<
  T extends {
    chat: object;
  },
>(message: T, isForum: boolean): T;
declare function resolveTelegramGroupAllowFromContext(params: {
  cfg: OpenClawConfig;
  chatId: string | number;
  accountId?: string;
  dmPolicy?: DmPolicy;
  allowFrom?: Array<string | number>;
  senderId?: string;
  isGroup?: boolean;
  isForum?: boolean;
  messageThreadId?: number | null;
  groupAllowFrom?: Array<string | number>;
  skipPairingStoreRead?: boolean;
  readChannelAllowFromStore?: typeof readChannelAllowFromStore;
  resolveTelegramGroupConfig: (
    chatId: string | number,
    messageThreadId: number | undefined,
    cfg: OpenClawConfig,
  ) => {
    groupConfig?: TelegramGroupConfig | TelegramDirectConfig;
    topicConfig?: TelegramTopicConfig;
  };
}): Promise<{
  resolvedThreadId?: number;
  dmThreadId?: number;
  storeAllowFrom: string[];
  groupConfig?: TelegramGroupConfig | TelegramDirectConfig;
  topicConfig?: TelegramTopicConfig;
  groupAllowOverride?: Array<string | number>;
  effectiveGroupAllow: NormalizedAllowFrom;
  hasGroupAllowOverride: boolean;
}>;
/**
 * Resolve the thread ID for Telegram forum topics.
 * For non-forum groups, returns undefined even if messageThreadId is present
 * (reply threads in regular groups should not create separate sessions).
 * For forum groups, returns the topic ID (or General topic ID=1 if unspecified).
 */
declare function resolveTelegramForumThreadId(params: {
  isForum?: boolean;
  messageThreadId?: number | null;
}): number | undefined;
declare function resolveTelegramThreadSpec(params: {
  isGroup: boolean;
  isForum?: boolean;
  messageThreadId?: number | null;
}): TelegramThreadSpec;
/**
 * Build thread params for Telegram API calls (messages, media).
 *
 * IMPORTANT: Thread IDs behave differently based on chat type:
 * - DMs (private chats): Include message_thread_id when present (DM topics)
 * - Forum topics: Skip thread_id=1 (General topic), include others
 * - Regular groups: Thread IDs are ignored by Telegram
 *
 * General forum topic (id=1) must be treated like a regular supergroup send:
 * Telegram rejects sendMessage/sendMedia with message_thread_id=1 ("thread not found").
 *
 * @param thread - Thread specification with ID and scope
 * @returns API params object or undefined if thread_id should be omitted
 */
declare function buildTelegramThreadParams(thread?: TelegramThreadSpec | null):
  | {
      message_thread_id: number;
    }
  | undefined;
/**
 * Build a Telegram routing target that keeps real topic/thread ids in-band.
 *
 * This is used by generic reply plumbing that may not always carry a separate
 * `threadId` field through every hop. General forum topic stays chat-scoped
 * because Telegram rejects `message_thread_id=1` for message sends.
 */
declare function buildTelegramRoutingTarget(
  chatId: number | string,
  thread?: TelegramThreadSpec | null,
): string;
/**
 * Build thread params for typing indicators (sendChatAction).
 * Empirically, General topic (id=1) needs message_thread_id for typing to appear.
 */
declare function buildTypingThreadParams(messageThreadId?: number):
  | {
      message_thread_id: number;
    }
  | undefined;
declare function resolveTelegramStreamMode(telegramCfg?: {
  streaming?: unknown;
}): TelegramStreamMode;
declare function buildTelegramGroupPeerId(
  chatId: number | string,
  messageThreadId?: number,
): string;
/**
 * Resolve the direct-message peer identifier for Telegram routing/session keys.
 *
 * In some Telegram DM deliveries (for example certain business/chat bridge flows),
 * `chat.id` can differ from the actual sender user id. Prefer sender id when present
 * so per-peer DM scopes isolate users correctly.
 */
declare function resolveTelegramDirectPeerId(params: {
  chatId: number | string;
  senderId?: number | string | null;
}): string;
declare function buildTelegramGroupFrom(chatId: number | string, messageThreadId?: number): string;
/**
 * Build parentPeer for forum topic binding inheritance.
 * When a message comes from a forum topic, the peer ID includes the topic suffix
 * (e.g., `-1001234567890:topic:99`). To allow bindings configured for the base
 * group ID to match, we provide the parent group as `parentPeer` so the routing
 * layer can fall back to it when the exact peer doesn't match.
 */
declare function buildTelegramParentPeer(params: {
  isGroup: boolean;
  resolvedThreadId?: number;
  chatId: number | string;
}):
  | {
      kind: "group";
      id: string;
    }
  | undefined;
declare function buildGroupLabel(
  msg: Message,
  chatId: number | string,
  messageThreadId?: number,
): string;
declare function resolveTelegramReplyId(raw?: string): number | undefined;
type TelegramReplyTarget = {
  id?: string;
  sender: string;
  senderId?: string;
  senderUsername?: string;
  body?: string;
  kind: "reply" | "quote";
  source: "reply_to_message" | "external_reply";
  quoteText?: string;
  quotePosition?: number;
  quoteEntities?: TelegramTextEntity[] /** Forward context if the reply target was itself a forwarded message (issue #9619). */;
  forwardedFrom?: TelegramForwardedContext;
  quoteSourceText?: string;
  quoteSourceEntities?: TelegramTextEntity[];
};
declare function describeReplyTarget(msg: Message): TelegramReplyTarget | null;
//#endregion
//#region extensions/telegram/src/exec-approvals.d.ts
declare function resolveTelegramExecApprovalConfig(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): TelegramExecApprovalConfig | undefined;
declare function getTelegramExecApprovalApprovers(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): string[];
declare function isTelegramExecApprovalTargetRecipient(params: {
  cfg: OpenClawConfig;
  senderId?: string | null;
  accountId?: string | null;
}): boolean;
declare const isTelegramExecApprovalClientEnabled: (input: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}) => boolean;
declare const isTelegramExecApprovalApprover: (
  input: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  } & {
    senderId?: string | null;
  },
) => boolean;
declare const isTelegramExecApprovalAuthorizedSender: (
  input: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  } & {
    senderId?: string | null;
  },
) => boolean;
declare const resolveTelegramExecApprovalTarget: (input: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}) => "both" | "channel" | "dm";
declare const shouldHandleTelegramExecApprovalRequest: (
  input: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  } & {
    request: ExecApprovalRequest | PluginApprovalRequest;
  },
) => boolean;
declare function shouldInjectTelegramExecApprovalButtons(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  to: string;
}): boolean;
declare function shouldSuppressLocalTelegramExecApprovalPrompt(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  payload: ReplyPayload;
}): boolean;
declare function isTelegramExecApprovalHandlerConfigured(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): boolean;
//#endregion
//#region extensions/telegram/src/group-policy.d.ts
declare function resolveTelegramGroupRequireMention(
  params: ChannelGroupContext,
): boolean | undefined;
declare function resolveTelegramGroupToolPolicy(
  params: ChannelGroupContext,
): GroupToolPolicyConfig | undefined;
//#endregion
//#region extensions/telegram/src/targets.d.ts
type TelegramTarget = {
  chatId: string;
  messageThreadId?: number;
  chatType: "direct" | "group" | "unknown";
};
declare function stripTelegramInternalPrefixes(to: string): string;
declare function normalizeTelegramChatId(raw: string): string | undefined;
declare function isNumericTelegramChatId(raw: string): boolean;
declare function normalizeTelegramLookupTarget(raw: string): string | undefined;
declare function parseTelegramTarget(to: string): TelegramTarget;
declare function resolveTelegramTargetChatType(target: string): "direct" | "group" | "unknown";
//#endregion
//#region extensions/telegram/src/inline-buttons.d.ts
declare function resolveTelegramInlineButtonsConfigScope(
  capabilities: unknown,
): TelegramInlineButtonsScope | undefined;
declare function resolveTelegramInlineButtonsScopeFromCapabilities(
  capabilities: unknown,
): TelegramInlineButtonsScope;
declare function resolveTelegramInlineButtonsScope(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): TelegramInlineButtonsScope;
declare function isTelegramInlineButtonsEnabled(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): boolean;
//#endregion
//#region extensions/telegram/src/normalize.d.ts
declare function normalizeTelegramMessagingTarget(raw: string): string | undefined;
declare function looksLikeTelegramTargetId(raw: string): boolean;
//#endregion
//#region extensions/telegram/src/outbound-adapter.d.ts
declare const TELEGRAM_TEXT_CHUNK_LIMIT = 4000;
type TelegramSendFn = typeof sendMessageTelegram;
type TelegramSendOpts = Parameters<TelegramSendFn>[2];
type TelegramReactionFn = typeof reactMessageTelegram;
type TelegramLocationFn = typeof sendLocationTelegram;
declare function sendTelegramPayloadMessages(params: {
  send: TelegramSendFn;
  sendLocation: TelegramLocationFn;
  react: TelegramReactionFn;
  to: string;
  payload: ReplyPayload;
  baseOpts: Omit<NonNullable<TelegramSendOpts>, "buttons" | "mediaUrl" | "quoteText">;
}): Promise<Awaited<ReturnType<TelegramSendFn>>>;
declare const telegramOutbound: ChannelOutboundAdapter;
//#endregion
//#region extensions/telegram/src/outbound-params.d.ts
declare function normalizeTelegramReplyToMessageId(value: unknown): number | undefined;
declare function parseTelegramReplyToMessageId(replyToId?: unknown): number | undefined;
declare function parseTelegramThreadId(threadId?: string | number | null): number | undefined;
//#endregion
//#region extensions/telegram/src/reaction-level.d.ts
type TelegramReactionLevel = ReactionLevel;
type ResolvedReactionLevel = ResolvedReactionLevel$1;
/**
 * Resolve the effective reaction level and its implications.
 */
declare function resolveTelegramReactionLevel(params: {
  cfg: OpenClawConfig;
  accountId?: string;
}): ResolvedReactionLevel;
//#endregion
//#region extensions/telegram/src/status-issues.d.ts
declare function collectTelegramStatusIssues(
  accounts: ChannelAccountSnapshot[],
): ChannelStatusIssue[];
//#endregion
//#region extensions/telegram/src/format.d.ts
type TelegramFormattedChunk = {
  html: string;
  text: string;
};
declare function escapeTelegramHtml(text: string): string;
declare function markdownToTelegramHtml(
  markdown: string,
  options?: {
    tableMode?: MarkdownTableMode;
    wrapFileRefs?: boolean;
  },
): string;
declare function splitTelegramHtmlChunks(
  html: string,
  limit: number,
  options?: {
    blockLimit?: number;
    mediaLimit?: number;
  },
): string[];
declare function markdownToTelegramChunks(
  markdown: string,
  limit: number,
  options?: {
    tableMode?: MarkdownTableMode;
  },
): TelegramFormattedChunk[];
declare function markdownToTelegramHtmlChunks(
  markdown: string,
  limit: number,
  options?: {
    tableMode?: MarkdownTableMode;
  },
): string[];
//#endregion
export {
  type ButtonRow,
  type CachedSticker,
  type DescribeStickerParams,
  type InspectedTelegramAccount,
  type ModelsKeyboardParams,
  type ParsedModelCallback,
  type ParsedTelegramTopicConversation,
  type ProviderInfo,
  type ResolveModelSelectionResult,
  type ResolvedReactionLevel,
  type ResolvedTelegramAccount,
  type StickerMetadata,
  TELEGRAM_COMMAND_NAME_PATTERN,
  TELEGRAM_TEXT_CHUNK_LIMIT,
  type TelegramBotMessage,
  type TelegramBotUpdate,
  type TelegramButtonStyle,
  type TelegramCredentialStatus,
  type TelegramCustomCommandInput,
  type TelegramCustomCommandIssue,
  type TelegramFormattedChunk,
  type TelegramForwardedContext,
  type TelegramInlineButtons,
  type TelegramInteractiveHandlerContext,
  type TelegramInteractiveHandlerRegistration,
  type TelegramInteractiveHandlerResult,
  type TelegramMediaRuntimeOptions,
  type TelegramPollActionGateState,
  type TelegramProbe,
  type TelegramProbeOptions,
  type TelegramReactionLevel,
  type TelegramReplyTarget,
  type TelegramTarget,
  type TelegramTextEntity,
  type TelegramThreadSpec,
  type TelegramTokenResolution,
  buildBrowseProvidersButton,
  buildCommandsPaginationKeyboard,
  buildGroupLabel,
  buildModelSelectionCallbackData,
  buildModelsKeyboard,
  buildProviderKeyboard,
  buildSenderLabel,
  buildSenderName,
  buildTelegramExecApprovalPendingPayload,
  buildTelegramGroupFrom,
  buildTelegramGroupPeerId,
  buildTelegramModelsProviderChannelData,
  buildTelegramParentPeer,
  buildTelegramRoutingTarget,
  buildTelegramThreadParams,
  buildTypingThreadParams,
  cacheSticker,
  calculateTotalPages,
  collectTelegramSecurityAuditFindings,
  collectTelegramStatusIssues,
  createTelegramActionGate,
  deleteTelegramUpdateOffset,
  describeReplyTarget,
  describeStickerImage,
  escapeTelegramHtml,
  extractTelegramForumFlag,
  extractTelegramLocation,
  fetchTelegramChatId,
  getAllCachedStickers,
  getCacheStats,
  getCachedSticker,
  getModelsPageSize,
  getTelegramExecApprovalApprovers,
  getTelegramTextParts,
  hasBotMention,
  inspectTelegramAccount,
  isBinaryContent,
  isNumericTelegramChatId,
  isNumericTelegramSenderUserId,
  isNumericTelegramUserId,
  isTelegramExecApprovalApprover,
  isTelegramExecApprovalAuthorizedSender,
  isTelegramExecApprovalClientEnabled,
  isTelegramExecApprovalHandlerConfigured,
  isTelegramExecApprovalTargetRecipient,
  isTelegramInlineButtonsEnabled,
  listEnabledTelegramAccounts,
  listTelegramAccountIds,
  listTelegramDirectoryGroupsFromConfig,
  listTelegramDirectoryPeersFromConfig,
  looksLikeTelegramTargetId,
  lookupTelegramChatId,
  markdownToTelegramChunks,
  markdownToTelegramHtml,
  markdownToTelegramHtmlChunks,
  mergeTelegramAccountConfig,
  normalizeForwardedContext,
  normalizeTelegramAllowFromEntry,
  normalizeTelegramChatId,
  normalizeTelegramCommandDescription,
  normalizeTelegramCommandName,
  normalizeTelegramLookupTarget,
  normalizeTelegramMessagingTarget,
  normalizeTelegramReplyToMessageId,
  parseModelCallbackData,
  parseTelegramReplyToMessageId,
  parseTelegramTarget,
  parseTelegramThreadId,
  parseTelegramTopicConversation,
  probeTelegram,
  readTelegramUpdateOffset,
  resetMissingDefaultWarnFlag,
  resetTelegramForumFlagCacheForTest,
  resetTelegramProbeFetcherCacheForTests,
  resolveDefaultTelegramAccountId,
  resolveModelSelection,
  resolveTelegramAccount,
  resolveTelegramAccountConfig,
  resolveTelegramAutoThreadId,
  resolveTelegramChatLookupFetch,
  resolveTelegramCustomCommands,
  resolveTelegramDirectPeerId,
  resolveTelegramExecApprovalConfig,
  resolveTelegramExecApprovalTarget,
  resolveTelegramForumFlag,
  resolveTelegramForumThreadId,
  resolveTelegramGroupAllowFromContext,
  resolveTelegramGroupRequireMention,
  resolveTelegramGroupToolPolicy,
  resolveTelegramInlineButtonsConfigScope,
  resolveTelegramInlineButtonsScope,
  resolveTelegramInlineButtonsScopeFromCapabilities,
  resolveTelegramMediaPlaceholder,
  resolveTelegramMediaRuntimeOptions,
  resolveTelegramPollActionGateState,
  resolveTelegramReactionLevel,
  resolveTelegramReplyId,
  resolveTelegramStreamMode,
  resolveTelegramTargetChatType,
  resolveTelegramThreadSpec,
  searchStickers,
  sendTelegramPayloadMessages,
  shouldHandleTelegramExecApprovalRequest,
  shouldInjectTelegramExecApprovalButtons,
  shouldSuppressLocalTelegramExecApprovalPrompt,
  shouldSuppressTelegramExecApprovalForwardingFallback,
  splitTelegramHtmlChunks,
  stripTelegramInternalPrefixes,
  telegramOutbound,
  telegramPlugin,
  telegramSetupPlugin,
  withResolvedTelegramForumFlag,
  writeTelegramUpdateOffset,
};
