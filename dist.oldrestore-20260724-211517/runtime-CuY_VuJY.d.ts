import { Bot } from "grammy";
import { Message } from "grammy/types";
import {
  n as collectTelegramUnmentionedGroupIds,
  t as auditTelegramGroupMembership,
} from "./audit-Drq02iIY.js";
import { n as ChannelRuntimeSurface } from "./channel-runtime-surface.types-CouuvmKm.js";
import { n as RetryConfig } from "./index-btg4aXoO.js";
import { n as PollInput } from "./polls-CfHkU59X.js";
import { a as TelegramBotInfo, r as probeTelegram } from "./probe-CqqU3R6r.js";
import { p as OutboundLocation } from "./reply-payload-DPFdJynw.js";
import { n as RuntimeEnv } from "./runtime-Bxifh4bY.js";
import { r as resolveTelegramToken } from "./token-BmfcHrcM.js";
import { P as MessageReceipt } from "./types-FwtQl4mH.js";
import { cr as PluginRuntime } from "./types-Ga3mNO_F.js";
import { C as MarkdownTableMode, E as ReplyToMode } from "./types.base-ibSxQuK3.js";
import {
  r as ChannelAccountSnapshot,
  v as ChannelMessageActionAdapter,
} from "./types.core-CcwzPNhX.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region extensions/telegram/src/button-types.d.ts
type TelegramButtonStyle = "danger" | "success" | "primary";
type TelegramInlineButton = {
  text: string;
  callback_data?: string;
  url?: string;
  web_app?: {
    url: string;
  };
  style?: TelegramButtonStyle;
};
type TelegramInlineButtons = ReadonlyArray<ReadonlyArray<TelegramInlineButton>>;
//#endregion
//#region extensions/telegram/src/prompt-context-projection.d.ts
type TelegramPromptContextSource = {
  transcriptMessageId: string;
};
type TelegramPromptContextProjection = TelegramPromptContextSource & {
  partIndex: number;
  finalPart: boolean;
};
declare function createTelegramPromptContextProjectionCursor(source: TelegramPromptContextSource): {
  source: TelegramPromptContextSource;
  nextPartIndex: number;
  complete: boolean;
  invalidate(): void;
  take(finalPart: boolean): TelegramPromptContextProjection;
};
//#endregion
//#region extensions/telegram/src/send.d.ts
type TelegramApi = Bot["api"];
type TelegramApiOverride = Partial<TelegramApi>;
type TelegramCreateForumTopicParams = NonNullable<Parameters<TelegramApi["createForumTopic"]>[2]>;
type TelegramSendOpts = {
  cfg: OpenClawConfig;
  token?: string;
  accountId?: string;
  verbose?: boolean;
  mediaUrl?: string;
  mediaLocalRoots?: readonly string[];
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  gatewayClientScopes?: readonly string[];
  maxBytes?: number;
  api?: TelegramApiOverride;
  retry?: RetryConfig;
  textMode?: "markdown" | "html";
  tableMode?: MarkdownTableMode /** Send audio as voice message instead of audio file. Defaults to false. */;
  asVoice?: boolean /** Send video as video note instead of regular video. Defaults to false. */;
  asVideoNote?: boolean /** Send message silently (no notification). Defaults to false. */;
  silent?: boolean /** Shared cursor keeps one transcript projection contiguous across concrete sends. */;
  promptContextProjectionPlan?: {
    cursor: ReturnType<typeof createTelegramPromptContextProjectionCursor>;
    finalPart: boolean;
  } /** Message ID to reply to (for threading) */;
  replyToMessageId?: number /** Whether replyToMessageId came from ambient context or explicit payload/action input. */;
  replyToIdSource?:
    | "explicit"
    | "implicit" /** Controls whether replyToMessageId is applied to every internal text chunk. */;
  replyToMode?: ReplyToMode /** Quote text for Telegram reply_parameters. */;
  quoteText?: string /** Forum topic thread ID (for forum supergroups) */;
  messageThreadId?: number /** Inline keyboard buttons (reply markup). */;
  buttons?: TelegramInlineButtons /** Send image as document to avoid Telegram compression. Defaults to false. */;
  forceDocument?: boolean /** Persist each concrete platform send before any later chunk can fail. */;
  onDeliveryResult?: (result: TelegramSendResult) => Promise<void> | void;
};
type TelegramSendResult = {
  messageId: string;
  chatId: string;
  receipt?: MessageReceipt;
};
type TelegramLocationSendOpts = Pick<
  TelegramSendOpts,
  | "cfg"
  | "token"
  | "accountId"
  | "verbose"
  | "api"
  | "retry"
  | "gatewayClientScopes"
  | "replyToMessageId"
  | "messageThreadId"
  | "buttons"
  | "quoteText"
  | "promptContextProjectionPlan"
  | "silent"
  | "onDeliveryResult"
>;
type TelegramReactionOpts = {
  cfg: OpenClawConfig;
  token?: string;
  accountId?: string;
  api?: TelegramApiOverride;
  remove?: boolean;
  verbose?: boolean;
  retry?: RetryConfig;
  gatewayClientScopes?: readonly string[];
};
type TelegramTypingOpts = {
  cfg: OpenClawConfig;
  token?: string;
  accountId?: string;
  verbose?: boolean;
  api?: TelegramApiOverride;
  retry?: RetryConfig;
  messageThreadId?: number;
};
declare function sendMessageTelegram(
  to: string,
  text: string,
  opts: TelegramSendOpts,
): Promise<TelegramSendResult>;
/** Send a standalone location pin or named venue through Telegram's native payload. */
declare function sendLocationTelegram(
  to: string,
  input: OutboundLocation,
  opts: TelegramLocationSendOpts,
): Promise<TelegramSendResult>;
declare function sendTypingTelegram(
  to: string,
  opts: TelegramTypingOpts,
): Promise<{
  ok: true;
}>;
declare function reactMessageTelegram(
  chatIdInput: string | number,
  messageIdInput: string | number,
  emoji: string,
  opts: TelegramReactionOpts,
): Promise<
  | {
      ok: true;
    }
  | {
      ok: false;
      warning: string;
    }
>;
type TelegramDeleteOpts = {
  cfg: OpenClawConfig;
  token?: string;
  accountId?: string;
  notify?: boolean;
  verbose?: boolean;
  api?: TelegramApiOverride;
  retry?: RetryConfig;
  gatewayClientScopes?: readonly string[];
};
declare function deleteMessageTelegram(
  chatIdInput: string | number,
  messageIdInput: string | number,
  opts: TelegramDeleteOpts,
): Promise<
  | {
      ok: true;
    }
  | {
      ok: false;
      warning: string;
    }
>;
declare function pinMessageTelegram(
  chatIdInput: string | number,
  messageIdInput: string | number,
  opts: TelegramDeleteOpts,
): Promise<{
  ok: true;
  messageId: string;
  chatId: string;
}>;
declare function unpinMessageTelegram(
  chatIdInput: string | number,
  messageIdInput: string | number | undefined,
  opts: TelegramDeleteOpts,
): Promise<{
  ok: true;
  chatId: string;
  messageId?: string;
}>;
type TelegramEditForumTopicOpts = TelegramDeleteOpts & {
  name?: string;
  iconCustomEmojiId?: string;
};
declare function editForumTopicTelegram(
  chatIdInput: string | number,
  messageThreadIdInput: string | number,
  opts: TelegramEditForumTopicOpts,
): Promise<{
  ok: true;
  chatId: string;
  messageThreadId: number;
  name?: string;
  iconCustomEmojiId?: string;
}>;
declare function renameForumTopicTelegram(
  chatIdInput: string | number,
  messageThreadIdInput: string | number,
  name: string,
  opts: TelegramDeleteOpts,
): Promise<{
  ok: true;
  chatId: string;
  messageThreadId: number;
  name: string;
}>;
type TelegramEditOpts = {
  token?: string;
  accountId?: string;
  verbose?: boolean;
  api?: TelegramApiOverride;
  retry?: RetryConfig;
  gatewayClientScopes?: readonly string[];
  textMode?:
    | "markdown"
    | "html" /** Controls whether link previews are shown in the edited message. */;
  linkPreview?: boolean /** Inline keyboard buttons (reply markup). Pass empty array to remove buttons. */;
  buttons?: TelegramInlineButtons /** Use Telegram's media-caption edit endpoint, or fall back to it when text edits target media. */;
  editMode?:
    | "text"
    | "caption"
    | "auto" /** Resolved runtime config from the command or gateway boundary. */;
  cfg: OpenClawConfig;
};
type TelegramEditReplyMarkupOpts = {
  token?: string;
  accountId?: string;
  verbose?: boolean;
  api?: TelegramApiOverride;
  retry?: RetryConfig;
  gatewayClientScopes?: readonly string[] /** Inline keyboard buttons (reply markup). Pass empty array to remove buttons. */;
  buttons?: TelegramInlineButtons /** Resolved runtime config from the command or gateway boundary. */;
  cfg: OpenClawConfig;
};
declare function editMessageReplyMarkupTelegram(
  chatIdInput: string | number,
  messageIdInput: string | number,
  buttons: TelegramInlineButtons,
  opts: TelegramEditReplyMarkupOpts,
): Promise<{
  ok: true;
  messageId: string;
  chatId: string;
}>;
declare function editMessageTelegram(
  chatIdInput: string | number,
  messageIdInput: string | number,
  text: string,
  opts: TelegramEditOpts,
): Promise<{
  ok: true;
  messageId: string;
  chatId: string;
}>;
type TelegramStickerOpts = {
  cfg: OpenClawConfig;
  token?: string;
  accountId?: string;
  verbose?: boolean;
  api?: TelegramApiOverride;
  retry?: RetryConfig;
  gatewayClientScopes?: readonly string[] /** Message ID to reply to (for threading) */;
  replyToMessageId?: number /** Forum topic thread ID (for forum supergroups) */;
  messageThreadId?: number;
};
/**
 * Send a sticker to a Telegram chat by file_id.
 * @param to - Chat ID or username (e.g., "123456789" or "@username")
 * @param fileId - Telegram file_id of the sticker to send
 * @param opts - Optional configuration
 */
declare function sendStickerTelegram(
  to: string,
  fileId: string,
  opts: TelegramStickerOpts,
): Promise<TelegramSendResult>;
type TelegramPollOpts = {
  cfg: OpenClawConfig;
  token?: string;
  accountId?: string;
  verbose?: boolean;
  api?: TelegramApiOverride;
  retry?: RetryConfig;
  gatewayClientScopes?: readonly string[] /** Message ID to reply to (for threading) */;
  replyToMessageId?: number /** Forum topic thread ID (for forum supergroups) */;
  messageThreadId?: number /** Send message silently (no notification). Defaults to false. */;
  silent?: boolean /** Whether votes are anonymous. Defaults to true (Telegram default). */;
  isAnonymous?: boolean;
};
/**
 * Send a poll to a Telegram chat.
 * @param to - Chat ID or username (e.g., "123456789" or "@username")
 * @param poll - Poll input with question, options, maxSelections, and optional durationHours
 * @param opts - Optional configuration
 */
declare function sendPollTelegram(
  to: string,
  poll: PollInput,
  opts: TelegramPollOpts,
): Promise<{
  messageId: string;
  chatId: string;
  pollId?: string;
}>;
type TelegramCreateForumTopicOpts = {
  cfg: OpenClawConfig;
  token?: string;
  accountId?: string;
  api?: TelegramApiOverride;
  verbose?: boolean;
  retry?: RetryConfig;
  gatewayClientScopes?: readonly string[] /** Icon color for the topic (must be one of 0x6FB9F0, 0xFFD67E, 0xCB86DB, 0x8EEE98, 0xFF93B2, 0xFB6F5F). */;
  iconColor?: TelegramCreateForumTopicParams["icon_color"] /** Custom emoji ID for the topic icon. */;
  iconCustomEmojiId?: string;
};
type TelegramCreateForumTopicResult = {
  topicId: number;
  name: string;
  chatId: string;
};
/**
 * Create a forum topic in a Telegram supergroup.
 * Requires the bot to have `can_manage_topics` permission.
 *
 * @param chatId - Supergroup chat ID
 * @param name - Topic name (1-128 characters)
 * @param opts - Optional configuration
 */
declare function createForumTopicTelegram(
  chatId: string,
  name: string,
  opts: TelegramCreateForumTopicOpts,
): Promise<TelegramCreateForumTopicResult>;
//#endregion
//#region extensions/telegram/src/monitor.types.d.ts
type MonitorTelegramOpts = {
  token?: string;
  accountId?: string;
  config?: OpenClawConfig;
  runtime?: RuntimeEnv;
  channelRuntime?: ChannelRuntimeSurface;
  abortSignal?: AbortSignal;
  useWebhook?: boolean;
  webhookPath?: string;
  webhookPort?: number;
  webhookSecret?: string;
  webhookHost?: string;
  proxyFetch?: typeof fetch;
  webhookUrl?: string;
  webhookCertPath?: string;
  botInfo?: TelegramBotInfo;
  setStatus?: (patch: Omit<ChannelAccountSnapshot, "accountId">) => void;
  isolatedIngress?: {
    enabled?: boolean;
  };
};
type TelegramMonitorFn = (opts?: MonitorTelegramOpts) => Promise<void>;
//#endregion
//#region extensions/telegram/src/runtime.types.d.ts
type TelegramProbeFn = typeof probeTelegram;
type TelegramAuditCollectFn = typeof collectTelegramUnmentionedGroupIds;
type TelegramAuditMembershipFn = typeof auditTelegramGroupMembership;
type TelegramSendFn = typeof sendMessageTelegram;
type TelegramResolveTokenFn = typeof resolveTelegramToken;
type BasePluginRuntimeChannel = PluginRuntime extends {
  channel: infer T;
}
  ? T
  : never;
type TelegramChannelRuntime = {
  probeTelegram?: TelegramProbeFn;
  collectTelegramUnmentionedGroupIds?: TelegramAuditCollectFn;
  auditTelegramGroupMembership?: TelegramAuditMembershipFn;
  monitorTelegramProvider?: TelegramMonitorFn;
  sendMessageTelegram?: TelegramSendFn;
  resolveTelegramToken?: TelegramResolveTokenFn;
  messageActions?: ChannelMessageActionAdapter;
};
interface TelegramRuntimeChannel extends BasePluginRuntimeChannel {
  telegram?: TelegramChannelRuntime;
}
interface TelegramRuntime extends PluginRuntime {
  channel: TelegramRuntimeChannel;
}
//#endregion
//#region extensions/telegram/src/runtime.d.ts
declare const setTelegramRuntime: (next: TelegramRuntime) => void,
  clearTelegramRuntime: () => void,
  getTelegramRuntime: () => TelegramRuntime,
  getOptionalTelegramRuntime: () => TelegramRuntime | null;
//#endregion
export {
  unpinMessageTelegram as _,
  deleteMessageTelegram as a,
  editMessageTelegram as c,
  renameForumTopicTelegram as d,
  sendLocationTelegram as f,
  sendTypingTelegram as g,
  sendStickerTelegram as h,
  createForumTopicTelegram as i,
  pinMessageTelegram as l,
  sendPollTelegram as m,
  MonitorTelegramOpts as n,
  editForumTopicTelegram as o,
  sendMessageTelegram as p,
  TelegramApiOverride as r,
  editMessageReplyMarkupTelegram as s,
  setTelegramRuntime as t,
  reactMessageTelegram as u,
  TelegramButtonStyle as v,
  TelegramInlineButtons as y,
};
