import { sequentialize } from "@grammyjs/runner";
import { apiThrottler } from "@grammyjs/transformer-throttler";
import * as grammy from "grammy";
import { Bot, Bot as Bot$1, GrammyError, HttpError } from "grammy";
import { o as resolveTelegramAccount } from "./accounts-BBOSygpA.js";
import { n as recordChannelActivity } from "./channel-activity-4piA219h.js";
import {
  c as resolveTextChunkLimit,
  i as chunkMarkdownTextWithMode,
  s as resolveChunkMode,
} from "./chunk-DtO_2oor.js";
import { r as replaceConfigFile } from "./config-BDv-QbJ6.js";
import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-DoJxaJiY.js";
import { i as formatUncaughtError, r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import { o as normalizeTelegramApiRoot, r as resolveTelegramTransport } from "./fetch-C3cVXJjY.js";
import { r as logVerbose } from "./globals-CNUzHTcU.js";
import { t as buildInlineKeyboard } from "./inline-keyboard-aDe2_Kii.js";
import { f as readConfigFileSnapshotForWrite } from "./io-B3ne6NxF.js";
import { t as buildOutboundMediaLoadOptions } from "./load-options-VzbF4ozo.js";
import { t as resolveMarkdownTableMode } from "./markdown-tables-pi6oiKnf.js";
import { f as isVoiceCompatibleAudio } from "./media-runtime-BhmZORKM.js";
import { n as probeVideoDimensions, u as getImageMetadata } from "./media-services-Czws84B5.js";
import "./error-runtime-BIAwr399.js";
import "./logging-core-QnL1iLWg.js";
import { c as kindFromMime, s as isGifMedia } from "./mime-BSEMEb3s.js";
import {
  c as isTelegramMisdirectedRequestError,
  d as isTelegramServerError,
  p as tagTelegramNetworkError,
  r as isSafeToRetrySendError,
  t as isRecoverableTelegramNetworkError,
  u as isTelegramRateLimitError,
} from "./network-errors-CFprAVtH.js";
import "./number-runtime-B-n-wjMn.js";
import "./runtime-env-D0V-7Gqz.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { v as parseStrictInteger } from "./number-coercion-CJQ8TR--.js";
import { t as requireRuntimeConfig } from "./plugin-config-runtime-ef53THzv.js";
import { n as normalizePollInput } from "./polls-C-v11_tu.js";
import { r as makeProxyFetch } from "./proxy-fetch-BNm7PiNO.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-C0uxiauk.js";
import { c as redactSensitiveText } from "./redact-CUe6Oey5.js";
import { t as createChannelHistoryWindow } from "./reply-history-DTabwFaD.js";
import {
  D as normalizeOutboundLocation,
  E as formatLocationText,
} from "./reply-payload-DDwHXDkv.js";
import { n as isSingleUseReplyToMode } from "./reply-reference-CblWzjbF.js";
import { r as resolveTelegramRequestTimeoutMs } from "./request-timeouts-B5fpzT_g.js";
import "./config-mutation-FDl4lip6.js";
import "./cron-store-runtime-DsMF_04p.js";
import "./reply-reference-BM3zoGu5.js";
import "./reply-chunking-aJZ4F_cw.js";
import "./channel-outbound-DlkFd7rO.js";
import "./web-media-Cv2iCdbz.js";
import { n as createChannelApiRetryRunner } from "./retry-policy-ib5882j9.js";
import "./ssrf-runtime-DJ478vv8.js";
import "./markdown-table-runtime-DkTgtzZ0.js";
import "./diagnostic-runtime-CpZ_ot5_.js";
import "./channel-inbound-vhkYEe2n.js";
import "./retry-runtime-DCStwGTN.js";
import {
  A as buildTelegramThreadParams,
  dt as markdownToTelegramRichHtml,
  ft as normalizeTelegramOutboundRichHtml,
  g as resolveTelegramMessageCacheScope,
  ht as telegramHtmlToPlainTextFallback,
  i as recordSentMessage,
  j as buildTypingThreadParams,
  mt as splitTelegramHtmlChunks,
  pt as renderTelegramHtmlText,
  st as escapeTelegramHtml,
  u as createTelegramMessageCache,
  vt as normalizeTelegramReplyToMessageId,
} from "./sent-message-cache-D-3cw6_g.js";
import { m as resolveStorePath } from "./session-store-runtime-BwE6SlGz.js";
import {
  l as resolveCronStorePath,
  o as loadCronStore,
  p as saveCronStore,
} from "./store-D02kEgQU.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import {
  a as parseTelegramTarget,
  n as normalizeTelegramChatId,
  r as normalizeTelegramLookupTarget,
} from "./targets-Cb32iLpC.js";
import { t as resolveTelegramBotUserIdFromToken } from "./token-iK1olK6e.js";
import { n as loadWebMedia } from "./web-media-3hQ71Ejp.js";
//#region extensions/telegram/src/account-throttler.ts
var GroupFairQueue = class {
  constructor() {
    this.lanes = /* @__PURE__ */ new Map();
    this.laneOrder = [];
    this.nextLaneIndex = 0;
    this.running = false;
  }
  enqueue(laneKey, run) {
    return new Promise((resolve, reject) => {
      const request = {
        run,
        resolve,
        reject,
      };
      const existing = this.lanes.get(laneKey);
      if (existing) existing.push(request);
      else {
        this.lanes.set(laneKey, [request]);
        this.laneOrder.push(laneKey);
      }
      this.start();
    });
  }
  start() {
    if (this.running) return;
    this.running = true;
    this.drain();
  }
  async drain() {
    try {
      while (true) {
        const request = this.takeNext();
        if (!request) return;
        try {
          request.resolve(await request.run());
        } catch (err) {
          request.reject(err);
        }
      }
    } finally {
      this.running = false;
      if (this.laneOrder.length > 0) this.start();
    }
  }
  takeNext() {
    for (let remaining = this.laneOrder.length; remaining > 0; remaining -= 1) {
      this.nextLaneIndex %= this.laneOrder.length;
      const laneKey = expectDefined(
        this.laneOrder[this.nextLaneIndex],
        "non-empty Telegram throttle lane order",
      );
      const queue = this.lanes.get(laneKey);
      if (!queue || queue.length === 0) {
        this.lanes.delete(laneKey);
        this.laneOrder.splice(this.nextLaneIndex, 1);
        if (this.laneOrder.length === 0) {
          this.nextLaneIndex = 0;
          return;
        }
        continue;
      }
      const request = queue.shift();
      this.nextLaneIndex += 1;
      return request;
    }
  }
};
const throttlerByToken = /* @__PURE__ */ new Map();
function readNumericId(value) {
  return parseStrictInteger(value);
}
function readPayload(payload) {
  return payload && typeof payload === "object" ? payload : void 0;
}
function resolveGroupChatKey(payload) {
  const chatId = readNumericId(payload.chat_id);
  return chatId !== void 0 && chatId < 0 ? String(chatId) : void 0;
}
function resolveForumLaneKey(payload) {
  const threadId = readNumericId(payload.message_thread_id);
  if (threadId !== void 0) return `topic:${threadId}`;
  const directTopicId = readNumericId(payload.direct_messages_topic_id);
  if (directTopicId !== void 0) return `direct-topic:${directTopicId}`;
  const messageId = readNumericId(payload.message_id);
  if (messageId !== void 0) return `message:${messageId}`;
  return "main";
}
function createTelegramAccountThrottler(createThrottler = apiThrottler) {
  const baseThrottler = createThrottler();
  const fairQueuesByChat = /* @__PURE__ */ new Map();
  return (prev, method, payload, signal) => {
    const apiPayload = readPayload(payload);
    const groupChatKey = apiPayload ? resolveGroupChatKey(apiPayload) : void 0;
    if (!apiPayload || !groupChatKey) return baseThrottler(prev, method, payload, signal);
    let fairQueue = fairQueuesByChat.get(groupChatKey);
    if (!fairQueue) {
      fairQueue = new GroupFairQueue();
      fairQueuesByChat.set(groupChatKey, fairQueue);
    }
    const laneKey = resolveForumLaneKey(apiPayload);
    return fairQueue.enqueue(laneKey, () => baseThrottler(prev, method, payload, signal));
  };
}
function getOrCreateAccountThrottler(token, createThrottler = apiThrottler) {
  let throttler = throttlerByToken.get(token);
  if (!throttler) {
    throttler = createTelegramAccountThrottler(createThrottler);
    throttlerByToken.set(token, throttler);
  }
  return throttler;
}
//#endregion
//#region extensions/telegram/src/api-logging.ts
const fallbackLogger = createSubsystemLogger("telegram/api");
function resolveTelegramApiLogger(runtime, logger) {
  if (logger) return logger;
  if (runtime?.error) return runtime.error;
  return (message) => fallbackLogger.error(message);
}
async function withTelegramApiErrorLogging({ operation, fn, runtime, logger, shouldLog }) {
  try {
    return await fn();
  } catch (err) {
    if (!shouldLog || shouldLog(err)) {
      const errText = formatErrorMessage(err);
      resolveTelegramApiLogger(runtime, logger)(`telegram ${operation} failed: ${errText}`);
    }
    throw err;
  }
}
//#endregion
//#region extensions/telegram/src/caption.ts
const TELEGRAM_MAX_CAPTION_LENGTH = 1024;
function splitTelegramCaption(text) {
  const trimmed = text?.trim() ?? "";
  if (!trimmed)
    return {
      caption: void 0,
      followUpText: void 0,
    };
  if (trimmed.length > TELEGRAM_MAX_CAPTION_LENGTH)
    return {
      caption: void 0,
      followUpText: trimmed,
    };
  return {
    caption: trimmed,
    followUpText: void 0,
  };
}
//#endregion
//#region extensions/telegram/src/client-fetch.ts
function asTelegramClientFetch(fetchImpl) {
  return fetchImpl;
}
function asTelegramCompatFetch(fetchImpl) {
  return fetchImpl;
}
function isTelegramAbortSignalLike(value) {
  return (
    typeof value === "object" &&
    value !== null &&
    "aborted" in value &&
    typeof value.aborted === "boolean" &&
    typeof value.addEventListener === "function" &&
    typeof value.removeEventListener === "function"
  );
}
function readRequestUrl(input) {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.toString();
  if (input instanceof Request) return input.url;
  return null;
}
function extractTelegramApiMethod(input) {
  const url = readRequestUrl(input);
  if (!url) return null;
  try {
    const segments = new URL(url).pathname.split("/").filter(Boolean);
    return (
      normalizeOptionalLowercaseString(segments.length > 0 ? (segments.at(-1) ?? null) : null) ??
      null
    );
  } catch {
    return null;
  }
}
const TELEGRAM_TIMEOUT_FALLBACK_METHODS = /* @__PURE__ */ new Set([
  "deletemycommands",
  "deletewebhook",
  "getme",
  "sendchataction",
  "setmycommands",
  "setwebhook",
]);
function shouldRetryTimedOutTelegramControlRequest(method) {
  return method !== null && TELEGRAM_TIMEOUT_FALLBACK_METHODS.has(method);
}
function resolveTelegramClientTimeoutSeconds(params) {
  const { value, minimum } = params;
  if (typeof value !== "number" || !Number.isFinite(value)) return;
  const configured = Math.max(1, Math.floor(value));
  if (typeof minimum !== "number" || !Number.isFinite(minimum)) return configured;
  return Math.max(configured, Math.max(1, Math.floor(minimum)));
}
function resolveTelegramClientTimeoutMinimumSeconds(values) {
  let minimum;
  for (const value of values) {
    if (typeof value !== "number" || !Number.isFinite(value)) continue;
    const normalized = Math.max(1, Math.ceil(value));
    minimum = minimum === void 0 ? normalized : Math.max(minimum, normalized);
  }
  return minimum;
}
function resolveTelegramOutboundClientTimeoutFloorSeconds(timeoutSeconds) {
  const timeoutMs = resolveTelegramRequestTimeoutMs("sendmessage", timeoutSeconds);
  return timeoutMs === void 0 ? void 0 : timeoutMs / 1e3;
}
function createTelegramClientFetch(params) {
  if (!params.fetchImpl && !params.shutdownSignal) return;
  const callFetch = asTelegramCompatFetch(
    params.fetchImpl ?? asTelegramClientFetch(globalThis.fetch),
  );
  const wrappedFetch = async (input, init) => {
    const method = extractTelegramApiMethod(input);
    const requestTimeoutMs = resolveTelegramRequestTimeoutMs(method, params.timeoutSeconds);
    const shutdownSignal = isTelegramAbortSignalLike(params.shutdownSignal)
      ? params.shutdownSignal
      : void 0;
    const requestSignal = isTelegramAbortSignalLike(init?.signal) ? init.signal : void 0;
    const canForceTransportFallback = (reason) =>
      !shutdownSignal?.aborted &&
      !requestSignal?.aborted &&
      params.transport?.forceFallback?.(reason) === true;
    const runFetch = async () => {
      const controller = new AbortController();
      const abortWith = (signal) => controller.abort(signal.reason);
      const onShutdown = () => {
        if (shutdownSignal) abortWith(shutdownSignal);
      };
      let requestTimeout;
      let onRequestAbort;
      let requestTimedOut = false;
      const timeoutError =
        requestTimeoutMs !== void 0
          ? /* @__PURE__ */ new Error(`Telegram ${method} timed out after ${requestTimeoutMs}ms`)
          : void 0;
      if (shutdownSignal?.aborted) abortWith(shutdownSignal);
      else if (shutdownSignal) shutdownSignal.addEventListener("abort", onShutdown, { once: true });
      if (requestSignal)
        if (requestSignal.aborted) abortWith(requestSignal);
        else {
          onRequestAbort = () => abortWith(requestSignal);
          requestSignal.addEventListener("abort", onRequestAbort);
        }
      if (requestTimeoutMs && timeoutError) {
        requestTimeout = setTimeout(() => {
          requestTimedOut = true;
          controller.abort(timeoutError);
        }, requestTimeoutMs);
        requestTimeout.unref?.();
      }
      try {
        return await callFetch(input, {
          ...init,
          signal: controller.signal,
        });
      } catch (err) {
        if (requestTimedOut && timeoutError) throw timeoutError;
        throw err;
      } finally {
        if (requestTimeout) clearTimeout(requestTimeout);
        shutdownSignal?.removeEventListener("abort", onShutdown);
        if (requestSignal && onRequestAbort)
          requestSignal.removeEventListener("abort", onRequestAbort);
      }
    };
    try {
      const response = await runFetch();
      if (response.status === 421 && canForceTransportFallback("misdirected-request"))
        return await runFetch();
      return response;
    } catch (err) {
      if (
        requestTimeoutMs &&
        shouldRetryTimedOutTelegramControlRequest(method) &&
        canForceTransportFallback("request-timeout")
      )
        return await runFetch();
      if (
        isTelegramMisdirectedRequestError(err) &&
        canForceTransportFallback("misdirected-request")
      )
        return await runFetch();
      throw err;
    }
  };
  return (input, init) => {
    return Promise.resolve(wrappedFetch(input, init)).catch((err) => {
      try {
        tagTelegramNetworkError(err, {
          method: extractTelegramApiMethod(input),
          url: readRequestUrl(input),
        });
      } catch {}
      throw err;
    });
  };
}
//#endregion
//#region extensions/telegram/src/group-history-window.ts
const TELEGRAM_SELF_SENDER_SUFFIX = " (you)";
function buildTelegramSelfSenderName(configuredName, telegramIdentity) {
  return `${configuredName?.trim() || telegramIdentity?.first_name?.trim() || telegramIdentity?.username?.trim() || "OpenClaw"}${TELEGRAM_SELF_SENDER_SUFFIX}`;
}
function isTelegramSelfSenderName(name) {
  return name?.endsWith(TELEGRAM_SELF_SENDER_SUFFIX) === true;
}
function isTelegramGroupHistorySelfEntry(entry) {
  return isTelegramSelfSenderName(entry.sender);
}
function telegramPromptMessageKey(message) {
  const messageId = message["message_id"];
  const body = message["body"];
  const timestampMs = message["timestamp_ms"];
  if (typeof messageId === "string" && messageId.trim()) return `id:${messageId.trim()}`;
  if (typeof body === "string" && typeof timestampMs === "number")
    return `text:${timestampMs}:${body.trim()}`;
}
function telegramHistoryEntryKey(entry) {
  if (entry.messageId?.trim()) return `id:${entry.messageId.trim()}`;
  if (entry.timestamp !== void 0) return `text:${entry.timestamp}:${entry.body.trim()}`;
}
function numericMessageId(value) {
  if (!value?.trim()) return;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : void 0;
}
function isTelegramHistoryEntryAfterAmbientWatermark(entry, watermark) {
  if (!watermark) return true;
  if (entry.timestamp !== void 0 && watermark.timestampMs !== void 0) {
    if (entry.timestamp !== watermark.timestampMs) return entry.timestamp > watermark.timestampMs;
    const entryMessageId = numericMessageId(entry.messageId);
    const watermarkMessageId = numericMessageId(watermark.messageId);
    return (
      entryMessageId !== void 0 &&
      watermarkMessageId !== void 0 &&
      entryMessageId > watermarkMessageId
    );
  }
  const entryMessageId = numericMessageId(entry.messageId);
  const watermarkMessageId = numericMessageId(watermark.messageId);
  if (entryMessageId !== void 0 && watermarkMessageId !== void 0)
    return entryMessageId > watermarkMessageId;
  return entry.messageId !== watermark.messageId;
}
function telegramChatWindowPayload(entry) {
  return entry?.payload && typeof entry.payload === "object" && !Array.isArray(entry.payload)
    ? entry.payload
    : void 0;
}
function telegramPromptMessages(payload) {
  return Array.isArray(payload?.["messages"])
    ? payload["messages"].filter(
        (message) => Boolean(message) && typeof message === "object" && !Array.isArray(message),
      )
    : [];
}
function selectTelegramGroupHistoryAfterLastSelf(entries) {
  const lastSelfIndex = entries.findLastIndex(isTelegramGroupHistorySelfEntry);
  return lastSelfIndex === -1 ? [...entries] : entries.slice(lastSelfIndex + 1);
}
function isTelegramChatWindowPromptContext(entry) {
  return entry.source === "telegram" && entry.type === "chat_window";
}
function retainTelegramGroupHistoryPromptContext(params) {
  const entryKeys = new Set(
    params.entries.flatMap((entry) => {
      const key = telegramHistoryEntryKey(entry);
      return key ? [key] : [];
    }),
  );
  return params.promptContext.flatMap((entry) => {
    if (!isTelegramChatWindowPromptContext(entry)) return [entry];
    if (entryKeys.size === 0) return [];
    const payload = telegramChatWindowPayload(entry);
    const messages = telegramPromptMessages(payload).filter((message) => {
      const key = telegramPromptMessageKey(message);
      return Boolean(key && entryKeys.has(key));
    });
    if (messages.length === 0) return [];
    return [
      {
        ...entry,
        payload: {
          ...payload,
          messages,
        },
      },
    ];
  });
}
function mergeTelegramGroupHistoryPromptContext(params) {
  if (params.entries.length === 0) return params.promptContext;
  const historyMessages = params.entries.map((entry) => ({
    ...(entry.messageId ? { message_id: entry.messageId } : {}),
    sender: entry.sender,
    ...(entry.timestamp !== void 0 ? { timestamp_ms: entry.timestamp } : {}),
    body: entry.body,
  }));
  const chatWindowIndex = params.promptContext.findIndex(isTelegramChatWindowPromptContext);
  const baseEntry = params.promptContext[chatWindowIndex];
  const existingMessages = telegramPromptMessages(telegramChatWindowPayload(baseEntry));
  const messagesByKey = /* @__PURE__ */ new Map();
  for (const message of [...historyMessages, ...existingMessages]) {
    const key = telegramPromptMessageKey(message);
    if (key) messagesByKey.set(key, message);
  }
  const mergedMessages = [...messagesByKey.values()].toSorted((left, right) => {
    return (
      (typeof left["timestamp_ms"] === "number" ? left["timestamp_ms"] : 0) -
      (typeof right["timestamp_ms"] === "number" ? right["timestamp_ms"] : 0)
    );
  });
  const mergedEntry = {
    label: "Conversation context",
    source: baseEntry?.source ?? "telegram",
    type: "chat_window",
    payload: {
      order: "chronological",
      relation: "selected_for_current_message",
      messages: mergedMessages,
    },
  };
  if (!baseEntry) return [...params.promptContext, mergedEntry];
  return params.promptContext.map((entry, index) =>
    index === chatWindowIndex ? mergedEntry : entry,
  );
}
function recordTelegramGroupHistoryEntry(params) {
  if (!params.historyKey) return;
  createChannelHistoryWindow({ historyMap: params.historyMap }).record({
    historyKey: params.historyKey,
    limit: params.limit,
    entry: params.entry,
  });
}
//#endregion
//#region extensions/telegram/src/outbound-message-context.ts
const outboundGroupHistoryRecorders = /* @__PURE__ */ new Map();
function registerTelegramOutboundGroupHistoryRecorder(params) {
  outboundGroupHistoryRecorders.set(params.accountId, params.recorder);
  return () => {
    if (outboundGroupHistoryRecorders.get(params.accountId) === params.recorder)
      outboundGroupHistoryRecorders.delete(params.accountId);
  };
}
function resolveOutboundCacheMessageTimestamp(msg) {
  if (
    typeof msg.openclaw_prompt_context_timestamp_ms === "number" &&
    Number.isFinite(msg.openclaw_prompt_context_timestamp_ms)
  )
    return msg.openclaw_prompt_context_timestamp_ms;
  return typeof msg.date === "number" && Number.isFinite(msg.date) ? msg.date * 1e3 : void 0;
}
function inferTelegramChatType(chatId) {
  return String(chatId).startsWith("-") ? "supergroup" : "private";
}
function buildOutboundCacheMessage(params) {
  const chat = params.message.chat ?? {};
  const text = params.message.text ?? params.message.caption ?? params.text;
  const rawSender = params.message.from;
  const stableSender = params.message.sender_chat ? void 0 : rawSender;
  const selfSenderName = buildTelegramSelfSenderName(
    params.account.name,
    params.account.bot ?? stableSender,
  );
  return {
    ...params.message,
    message_id: params.messageId,
    ...(params.promptContextTimestampMs !== void 0
      ? { openclaw_prompt_context_timestamp_ms: params.promptContextTimestampMs }
      : {}),
    date:
      typeof params.message.date === "number" && Number.isFinite(params.message.date)
        ? params.message.date
        : Math.floor(Date.now() / 1e3),
    chat: {
      id: chat.id ?? params.chatId,
      type: chat.type ?? inferTelegramChatType(params.chatId),
      ...(chat.title ? { title: chat.title } : {}),
      ...(chat.username ? { username: chat.username } : {}),
    },
    from: {
      id: params.message.sender_chat ? 0 : (stableSender?.id ?? params.botUserId ?? 0),
      is_bot: true,
      first_name: selfSenderName,
      ...(stableSender?.username ? { username: stableSender.username } : {}),
    },
    ...(text ? { text } : {}),
    ...(params.messageThreadId !== void 0 ? { message_thread_id: params.messageThreadId } : {}),
  };
}
async function recordOutboundMessageForPromptContext(params) {
  try {
    const cacheMessage = buildOutboundCacheMessage(params);
    await createTelegramMessageCache({
      scope: resolveTelegramMessageCacheScope(resolveStorePath(params.cfg.session?.store)),
    }).record({
      accountId: params.account.accountId,
      chatId: params.chatId,
      msg: cacheMessage,
      ...(params.botUserId !== void 0 ? { botUserId: params.botUserId } : {}),
      ...(params.promptContextProjection
        ? { promptContextProjection: params.promptContextProjection }
        : {}),
      ...(params.messageThreadId !== void 0 ? { threadId: params.messageThreadId } : {}),
    });
    const timestamp = resolveOutboundCacheMessageTimestamp(cacheMessage);
    outboundGroupHistoryRecorders.get(params.account.accountId)?.({
      chatId: params.chatId,
      messageId: params.messageId,
      text: params.text ?? cacheMessage.text ?? cacheMessage.caption,
      ...(params.messageThreadId !== void 0 ? { messageThreadId: params.messageThreadId } : {}),
      ...(timestamp !== void 0 ? { timestamp } : {}),
    });
    return true;
  } catch (error) {
    logVerbose(`telegram: failed to record outbound message context: ${String(error)}`);
    return false;
  }
}
//#endregion
//#region extensions/telegram/src/reply-parameters.ts
const QUOTE_PARAM_RE = /\bquote not found\b|\bQUOTE_TEXT_INVALID\b|\bquote text invalid\b/i;
const GrammyErrorCtor = typeof GrammyError === "function" ? GrammyError : void 0;
function resolveTelegramSendThreadSpec(params) {
  const messageThreadId =
    params.messageThreadId != null ? params.messageThreadId : params.targetMessageThreadId;
  if (messageThreadId == null) return;
  return {
    id: messageThreadId,
    scope: params.chatType === "direct" ? "dm" : "forum",
  };
}
function buildTelegramThreadReplyParams(opts) {
  const params = {};
  const threadParams = buildTelegramThreadParams(opts?.thread);
  if (threadParams) params.message_thread_id = threadParams.message_thread_id;
  const replyToMessageId = normalizeTelegramReplyToMessageId(opts?.replyToMessageId);
  if (replyToMessageId == null) return params;
  const defaultQuoteMessageId = opts?.useReplyIdAsQuoteSource === true ? replyToMessageId : void 0;
  const replyQuoteTextRaw =
    normalizeTelegramReplyToMessageId(opts?.replyQuoteMessageId ?? defaultQuoteMessageId) ===
    replyToMessageId
      ? opts?.replyQuoteText
      : void 0;
  const replyQuoteText = replyQuoteTextRaw?.trim() ? replyQuoteTextRaw : void 0;
  if (!replyQuoteText) {
    params.reply_to_message_id = replyToMessageId;
    params.allow_sending_without_reply = true;
    return params;
  }
  const replyParameters = {
    message_id: replyToMessageId,
    quote: replyQuoteText,
    allow_sending_without_reply: true,
  };
  if (typeof opts?.replyQuotePosition === "number" && Number.isFinite(opts.replyQuotePosition))
    replyParameters.quote_position = Math.trunc(opts.replyQuotePosition);
  if (Array.isArray(opts?.replyQuoteEntities) && opts.replyQuoteEntities.length > 0)
    replyParameters.quote_entities = opts.replyQuoteEntities;
  params.reply_parameters = replyParameters;
  return params;
}
function buildTelegramSendParams(opts) {
  const params = { ...buildTelegramThreadReplyParams(opts) };
  if (opts?.silent === true) params.disable_notification = true;
  return params;
}
function getTelegramNativeQuoteReplyMessageId(params) {
  const replyParameters = params?.reply_parameters;
  if (!replyParameters || typeof replyParameters !== "object") return;
  const messageId = replyParameters.message_id;
  return typeof messageId === "number" && Number.isFinite(messageId) ? messageId : void 0;
}
function isTelegramQuoteParamError(err) {
  if (GrammyErrorCtor && err instanceof GrammyErrorCtor)
    return QUOTE_PARAM_RE.test(err.description);
  return QUOTE_PARAM_RE.test(formatErrorMessage(err));
}
function removeTelegramNativeQuoteParam(params) {
  if (!params) return {};
  const replyMessageId = getTelegramNativeQuoteReplyMessageId(params);
  const { reply_parameters: _ignored, ...rest } = params;
  if (replyMessageId != null) {
    rest.reply_to_message_id = replyMessageId;
    rest.allow_sending_without_reply = true;
  }
  return rest;
}
//#endregion
//#region extensions/telegram/src/retry-after.ts
const TELEGRAM_OUTBOUND_RETRY_AFTER_CAP_MS = 6e4;
//#endregion
//#region extensions/telegram/src/rich-message.ts
const TELEGRAM_RICH_TEXT_LIMIT = 32768;
const TELEGRAM_RICH_BLOCK_LIMIT = 500;
const TELEGRAM_RICH_MEDIA_LIMIT = 50;
const TELEGRAM_RICH_EMAIL_TOKEN_RE =
  /[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+/iu;
function shouldSkipTelegramRichEntityDetection(text, options) {
  return options?.skipEntityDetection === true || TELEGRAM_RICH_EMAIL_TOKEN_RE.test(text);
}
function getTelegramRichRawApi(api) {
  const raw = api.raw;
  if (raw) return raw;
  throw new Error("Telegram rich messages require grammY api.raw");
}
function finiteInteger(value) {
  return typeof value === "number" && Number.isFinite(value) ? Math.trunc(value) : void 0;
}
function isReplyParameters(value) {
  if (!value || typeof value !== "object") return false;
  return finiteInteger(value.message_id) !== void 0;
}
function toTelegramRichMessageContextParams(params) {
  const richParams = {};
  const messageThreadId = finiteInteger(params?.message_thread_id);
  if (messageThreadId !== void 0) richParams.message_thread_id = messageThreadId;
  if (params?.disable_notification === true) richParams.disable_notification = true;
  if (isReplyParameters(params?.reply_parameters)) {
    richParams.reply_parameters = params.reply_parameters;
    return richParams;
  }
  const replyToMessageId = finiteInteger(params?.reply_to_message_id);
  if (replyToMessageId !== void 0)
    richParams.reply_parameters = {
      message_id: replyToMessageId,
      allow_sending_without_reply: true,
    };
  return richParams;
}
function removeTelegramRichNativeQuoteParam(params) {
  const richParams = toTelegramRichMessageContextParams(params);
  if (!richParams.reply_parameters) return richParams;
  const {
    quote: _quote,
    quote_entities: _quoteEntities,
    quote_parse_mode: _quoteParseMode,
    quote_position: _quotePosition,
    ...replyParameters
  } = richParams.reply_parameters;
  return {
    ...richParams,
    reply_parameters: replyParameters,
  };
}
function buildTelegramRichMarkdownPlan(markdown, options) {
  const richOptions = {
    ...options,
    skipEntityDetection: shouldSkipTelegramRichEntityDetection(markdown, options),
  };
  return buildTelegramRichHtmlPlan(markdownToTelegramRichHtml(markdown, richOptions), richOptions);
}
function buildTelegramRichMarkdown(markdown, options) {
  return buildTelegramRichMarkdownPlan(markdown, options).richMessage;
}
function buildTelegramRichHtmlPlan(html, options) {
  const normalized = prepareTelegramRichHtml(html);
  return {
    richMessage: shouldSkipTelegramRichEntityDetection(normalized.html, options)
      ? {
          html: normalized.html,
          skip_entity_detection: true,
        }
      : { html: normalized.html },
    degradationReasons: normalized.degradationReasons,
  };
}
function buildTelegramRichHtml(html, options) {
  return buildTelegramRichHtmlPlan(html, options).richMessage;
}
function buildTelegramRichMessagePlan(text, textMode, options) {
  return textMode === "html"
    ? buildTelegramRichHtmlPlan(text, options)
    : buildTelegramRichMarkdownPlan(text, options);
}
function prepareTelegramRichHtml(html) {
  return normalizeTelegramOutboundRichHtml(html);
}
const TELEGRAM_RICH_HTML_CHUNK_LIMITS = {
  blockLimit: TELEGRAM_RICH_BLOCK_LIMIT,
  mediaLimit: TELEGRAM_RICH_MEDIA_LIMIT,
};
function splitPreparedTelegramRichHtml(params) {
  try {
    const chunks = splitTelegramHtmlChunks(
      params.html,
      params.textLimit,
      TELEGRAM_RICH_HTML_CHUNK_LIMITS,
    );
    if (chunks.length > 0) return chunks;
  } catch {}
  return splitTelegramHtmlChunks(escapeTelegramHtml(params.sourceFallback), params.textLimit);
}
function parseRichMarkdownFenceSpans(markdown) {
  const spans = [];
  let open;
  let offset = 0;
  while (offset <= markdown.length) {
    const nextNewline = markdown.indexOf("\n", offset);
    const lineEnd = nextNewline === -1 ? markdown.length : nextNewline;
    const match = markdown.slice(offset, lineEnd).match(/^( {0,3})(`{3,}|~{3,})/);
    if (match) {
      const marker = expectDefined(match[2], "Markdown fence marker capture");
      const markerChar = marker.charAt(0);
      if (!open)
        open = {
          start: offset,
          markerChar,
          markerLength: marker.length,
        };
      else if (open.markerChar === markerChar && marker.length >= open.markerLength) {
        spans.push({
          start: open.start,
          end: lineEnd,
        });
        open = void 0;
      }
    }
    if (nextNewline === -1) break;
    offset = nextNewline + 1;
  }
  if (open)
    spans.push({
      start: open.start,
      end: markdown.length,
    });
  return spans;
}
function isSafeRichMarkdownBlockBreak(spans, index) {
  return !spans.some((span) => index > span.start && index < span.end);
}
function findTelegramRichMarkdownBlockBreaks(markdown) {
  const breaks = [];
  for (const match of markdown.matchAll(/\n[\t ]*\n+/g)) {
    const start = match.index ?? 0;
    breaks.push({
      start,
      end: start + match[0].length,
      separator: match[0],
    });
  }
  for (const match of markdown.matchAll(/^ {0,3}#{1,6}\s+\S.*$/gm)) {
    const headingStart = match.index ?? 0;
    if (headingStart > 0 && markdown[headingStart - 1] === "\n")
      breaks.push({
        start: headingStart - 1,
        end: headingStart,
        separator: "\n",
      });
  }
  return breaks.toSorted((left, right) => left.start - right.start || right.end - left.end);
}
function splitTelegramRichMarkdownBlocks(markdown, blockLimit) {
  if (!markdown.trim()) return markdown ? [markdown] : [];
  const blocks = [];
  const fenceSpans = parseRichMarkdownFenceSpans(markdown);
  let lastIndex = 0;
  let separatorBefore;
  for (const blockBreak of findTelegramRichMarkdownBlockBreaks(markdown)) {
    if (blockBreak.start < lastIndex) continue;
    if (!isSafeRichMarkdownBlockBreak(fenceSpans, blockBreak.start)) continue;
    const text = markdown.slice(lastIndex, blockBreak.start);
    if (text.trim())
      blocks.push({
        text,
        ...(separatorBefore ? { separatorBefore } : {}),
      });
    separatorBefore = blockBreak.separator;
    lastIndex = blockBreak.end;
  }
  const tail = markdown.slice(lastIndex);
  if (tail.trim())
    blocks.push({
      text: tail,
      ...(separatorBefore ? { separatorBefore } : {}),
    });
  if (blocks.length <= blockLimit) return [markdown];
  const chunks = [];
  let chunk = "";
  let chunkBlocks = 0;
  for (const block of blocks) {
    if (chunkBlocks >= blockLimit) {
      chunks.push(chunk);
      chunk = "";
      chunkBlocks = 0;
    }
    const separator = chunk ? (block.separatorBefore ?? "\n\n") : "";
    chunk += `${separator}${block.text}`;
    chunkBlocks += 1;
  }
  if (chunk) chunks.push(chunk);
  return chunks;
}
function splitTelegramRichMarkdownTextChunks(markdown, textLimit, chunkMode) {
  const chunks = [];
  const queue = chunkMarkdownTextWithMode(markdown, textLimit, chunkMode);
  for (let index = 0; index < queue.length; index += 1) {
    const chunk = queue[index] ?? "";
    if (chunk.length <= textLimit) {
      chunks.push(chunk);
      continue;
    }
    const nextChunks = chunkMarkdownTextWithMode(
      chunk,
      Math.max(1, Math.min(chunk.length - 1, textLimit - 16)),
      chunkMode,
    );
    if (nextChunks.length <= 1) {
      chunks.push(chunk);
      continue;
    }
    queue.splice(index, 1, ...nextChunks);
    index -= 1;
  }
  return chunks;
}
function splitTelegramRichMarkdownChunks(markdown, textLimit, chunkMode) {
  if (markdown.length <= textLimit)
    return splitTelegramRichMarkdownBlocks(markdown, TELEGRAM_RICH_BLOCK_LIMIT);
  return splitTelegramRichMarkdownTextChunks(markdown, textLimit, chunkMode).flatMap((chunk) =>
    splitTelegramRichMarkdownBlocks(chunk, TELEGRAM_RICH_BLOCK_LIMIT),
  );
}
function splitTelegramRichMessageTextChunks(params) {
  const renderRichChunk = (chunk, textMode) => {
    const skipEntityDetection = shouldSkipTelegramRichEntityDetection(chunk, {
      skipEntityDetection: params.skipEntityDetection,
    });
    return {
      normalized:
        textMode === "html"
          ? prepareTelegramRichHtml(chunk)
          : prepareTelegramRichHtml(
              markdownToTelegramRichHtml(chunk, {
                tableMode: params.tableMode,
                skipEntityDetection,
              }),
            ),
      skipEntityDetection,
    };
  };
  return (
    params.textMode === "html"
      ? [
          {
            source: params.text,
            rendered: renderRichChunk(params.text, "html"),
          },
        ]
      : splitTelegramRichMarkdownChunks(params.text, params.textLimit, params.chunkMode).map(
          (chunk) => ({
            source: chunk,
            rendered: renderRichChunk(chunk, "markdown"),
          }),
        )
  ).flatMap(({ source, rendered }) =>
    splitPreparedTelegramRichHtml({
      html: rendered.normalized.html,
      sourceFallback: source,
      textLimit: params.textLimit,
    }).map((chunk, index) => ({
      text: chunk,
      textMode: "html",
      plainText: telegramHtmlToPlainTextFallback(chunk),
      skipEntityDetection: shouldSkipTelegramRichEntityDetection(chunk, {
        skipEntityDetection: params.skipEntityDetection,
      }),
      degradationReasons: index === 0 ? rendered.normalized.degradationReasons : [],
    })),
  );
}
//#endregion
//#region extensions/telegram/src/rich-plain-fallback.ts
const RICH_ENTITY_INVALID_RE =
  /RICH_MESSAGE_(?:EMAIL|URL|MENTION|HASHTAG|CASHTAG|BOT_COMMAND|PHONE|BANK_CARD)_INVALID/i;
const RICH_CONTENT_REQUIRED_RE = /RICH_MESSAGE_CONTENT_REQUIRED/i;
const PARSE_ERR_RE = /can't parse entities|parse entities|find end of the entity/i;
function isTelegramRichEntityInvalidError(err) {
  return RICH_ENTITY_INVALID_RE.test(formatErrorMessage(err));
}
function isTelegramHtmlParseError(err) {
  return PARSE_ERR_RE.test(formatErrorMessage(err));
}
function getTelegramPlainFallbackTrigger(err) {
  if (isTelegramRichEntityInvalidError(err)) return "rich-entity-invalid";
  if (RICH_CONTENT_REQUIRED_RE.test(formatErrorMessage(err))) return "rich-content-required";
  if (isTelegramHtmlParseError(err)) return "html-parse";
}
function surrogateSafeChunkEnd(text, end, start) {
  const high = text.charCodeAt(end - 1);
  const low = text.charCodeAt(end);
  if (!(end > 0 && high >= 55296 && high <= 56319 && low >= 56320 && low <= 57343)) return end;
  const clamped = end - 1;
  return clamped > start ? clamped : start + 2;
}
function splitTelegramPlainTextChunks(text, limit) {
  if (!text) return [];
  const normalizedLimit = Math.max(1, Math.floor(limit));
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    const end = surrogateSafeChunkEnd(text, start + normalizedLimit, start);
    chunks.push(text.slice(start, end));
    start = end;
  }
  return chunks;
}
function splitTelegramPlainTextFallback(text, chunkCount, limit) {
  if (!text) return [];
  const normalizedLimit = Math.max(1, Math.floor(limit));
  const fixedChunks = splitTelegramPlainTextChunks(text, normalizedLimit);
  if (chunkCount <= 1 || fixedChunks.length >= chunkCount) return fixedChunks;
  const chunks = [];
  let offset = 0;
  for (let index = 0; index < chunkCount; index += 1) {
    const remainingChars = text.length - offset;
    const remainingChunks = chunkCount - index;
    const nextChunkLength =
      remainingChunks === 1
        ? remainingChars
        : Math.min(normalizedLimit, Math.ceil(remainingChars / remainingChunks));
    const end = surrogateSafeChunkEnd(text, offset + nextChunkLength, offset);
    chunks.push(text.slice(offset, end));
    offset = end;
  }
  return chunks;
}
function buildTelegramPlainFallbackPlan(params) {
  const trigger = getTelegramPlainFallbackTrigger(params.err);
  if (!trigger) return;
  const plainText = telegramHtmlToPlainTextFallback(params.html);
  const limit = params.limit ?? 4e3;
  const chunks =
    params.chunkCount === void 0
      ? splitTelegramPlainTextChunks(plainText, limit)
      : splitTelegramPlainTextFallback(plainText, params.chunkCount, limit);
  params.warn(
    `telegram ${params.context} rich-degrade=plain-fallback:${trigger}: ${formatErrorMessage(params.err)}`,
  );
  return {
    plainText,
    chunks,
  };
}
function warnTelegramRichHtmlDegradations(params) {
  for (const reason of new Set(params.reasons))
    params.warn(`telegram ${params.context} rich-degrade=${reason}`);
}
//#endregion
//#region extensions/telegram/src/target-writeback.ts
const writebackLogger = createSubsystemLogger("telegram/target-writeback");
const TELEGRAM_ADMIN_SCOPE = "operator.admin";
function asObjectRecord(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value;
}
function normalizeTelegramLookupTargetForMatch(raw) {
  const normalized = normalizeTelegramLookupTarget(raw);
  if (!normalized) return;
  return normalized.startsWith("@") ? normalizeLowercaseStringOrEmpty(normalized) : normalized;
}
function normalizeTelegramTargetForMatch(raw) {
  const parsed = parseTelegramTarget(raw);
  const normalized = normalizeTelegramLookupTargetForMatch(parsed.chatId);
  if (!normalized) return;
  return `${normalized}|${parsed.messageThreadId == null ? "" : String(parsed.messageThreadId)}`;
}
function buildResolvedTelegramTarget(params) {
  const { raw, parsed, resolvedChatId } = params;
  if (parsed.messageThreadId == null) return resolvedChatId;
  return raw.includes(":topic:")
    ? `${resolvedChatId}:topic:${parsed.messageThreadId}`
    : `${resolvedChatId}:${parsed.messageThreadId}`;
}
function resolveLegacyRewrite(params) {
  const parsed = parseTelegramTarget(params.raw);
  if (normalizeTelegramChatId(parsed.chatId)) return null;
  const normalized = normalizeTelegramLookupTargetForMatch(parsed.chatId);
  if (!normalized) return null;
  return {
    matchKey: `${normalized}|${parsed.messageThreadId == null ? "" : String(parsed.messageThreadId)}`,
    resolvedTarget: buildResolvedTelegramTarget({
      raw: params.raw,
      parsed,
      resolvedChatId: params.resolvedChatId,
    }),
  };
}
function rewriteTargetIfMatch(params) {
  if (typeof params.rawValue !== "string" && typeof params.rawValue !== "number") return null;
  const value = normalizeOptionalString(String(params.rawValue)) ?? "";
  if (!value) return null;
  if (normalizeTelegramTargetForMatch(value) !== params.matchKey) return null;
  return params.resolvedTarget;
}
function replaceTelegramDefaultToTargets(params) {
  let changed = false;
  const telegram = asObjectRecord(params.cfg.channels?.telegram);
  if (!telegram) return changed;
  const maybeReplace = (holder, key) => {
    const nextTarget = rewriteTargetIfMatch({
      rawValue: holder[key],
      matchKey: params.matchKey,
      resolvedTarget: params.resolvedTarget,
    });
    if (!nextTarget) return;
    holder[key] = nextTarget;
    changed = true;
  };
  maybeReplace(telegram, "defaultTo");
  const accounts = asObjectRecord(telegram.accounts);
  if (!accounts) return changed;
  for (const accountId of Object.keys(accounts)) {
    const account = asObjectRecord(accounts[accountId]);
    if (!account) continue;
    maybeReplace(account, "defaultTo");
  }
  return changed;
}
async function maybePersistResolvedTelegramTarget(params) {
  const raw = params.rawTarget.trim();
  if (!raw) return;
  const rewrite = resolveLegacyRewrite({
    raw,
    resolvedChatId: params.resolvedChatId,
  });
  if (!rewrite) return;
  const { matchKey, resolvedTarget } = rewrite;
  const hasGatewayAdminScope = params.gatewayClientScopes?.includes(TELEGRAM_ADMIN_SCOPE) === true;
  const trustedInternalWriteback =
    params.gatewayClientScopes === void 0 && params.trustedInternalWriteback === true;
  if (!hasGatewayAdminScope && !trustedInternalWriteback) {
    writebackLogger.warn(
      `skipping Telegram target writeback for ${raw} because gateway caller is missing ${TELEGRAM_ADMIN_SCOPE}`,
    );
    return;
  }
  try {
    const { snapshot, writeOptions } = await readConfigFileSnapshotForWrite();
    const nextConfig = structuredClone(snapshot.config ?? {});
    if (
      replaceTelegramDefaultToTargets({
        cfg: nextConfig,
        matchKey,
        resolvedTarget,
      })
    ) {
      await replaceConfigFile({
        nextConfig,
        snapshot,
        writeOptions,
        afterWrite: { mode: "auto" },
      });
      if (params.verbose)
        writebackLogger.warn(`resolved Telegram defaultTo target ${raw} -> ${resolvedTarget}`);
    }
  } catch (err) {
    if (params.verbose)
      writebackLogger.warn(`failed to persist Telegram defaultTo target ${raw}: ${String(err)}`);
  }
  try {
    const storePath = resolveCronStorePath(params.cfg.cron?.store);
    const store = await loadCronStore(storePath);
    let cronChanged = false;
    for (const job of store.jobs) {
      if (job.delivery?.channel !== "telegram") continue;
      const nextTarget = rewriteTargetIfMatch({
        rawValue: job.delivery.to,
        matchKey,
        resolvedTarget,
      });
      if (!nextTarget) continue;
      job.delivery.to = nextTarget;
      cronChanged = true;
    }
    if (cronChanged) {
      await saveCronStore(storePath, store);
      if (params.verbose)
        writebackLogger.warn(`resolved Telegram cron delivery target ${raw} -> ${resolvedTarget}`);
    }
  } catch (err) {
    if (params.verbose)
      writebackLogger.warn(`failed to persist Telegram cron target ${raw}: ${String(err)}`);
  }
}
//#endregion
//#region extensions/telegram/src/voice.ts
function resolveTelegramVoiceDecision(opts) {
  if (!opts.wantsVoice) return { useVoice: false };
  if (isVoiceCompatibleAudio(opts)) return { useVoice: true };
  return {
    useVoice: false,
    reason: `media is ${opts.contentType ?? "unknown"} (${opts.fileName ?? "unknown"})`,
  };
}
function resolveTelegramVoiceSend(opts) {
  const decision = resolveTelegramVoiceDecision(opts);
  if (decision.reason && opts.logFallback)
    opts.logFallback(
      `Telegram voice requested but ${decision.reason}; sending as audio file instead.`,
    );
  return { useVoice: decision.useVoice };
}
//#endregion
//#region extensions/telegram/src/send.ts
const InputFileCtor = grammy.InputFile;
const MAX_TELEGRAM_PHOTO_DIMENSION_SUM = 1e4;
const MAX_TELEGRAM_PHOTO_ASPECT_RATIO = 20;
function resolveTelegramMessageIdOrThrow(result, context) {
  if (typeof result?.message_id === "number" && Number.isFinite(result.message_id))
    return Math.trunc(result.message_id);
  throw new Error(`Telegram ${context} returned no message_id`);
}
function splitTelegramPlainTextChunksForTests(text, limit) {
  return splitTelegramPlainTextChunks(text, limit);
}
function logTelegramOutboundSendOk(params) {
  const parts = [
    "telegram outbound send ok",
    `accountId=${params.accountId}`,
    `chatId=${params.chatId}`,
    `messageId=${params.messageId}`,
    `operation=${params.operation}`,
  ];
  if (params.deliveryKind) parts.push(`deliveryKind=${params.deliveryKind}`);
  if (typeof params.messageThreadId === "number") parts.push(`threadId=${params.messageThreadId}`);
  if (typeof params.replyToMessageId === "number")
    parts.push(`replyToMessageId=${params.replyToMessageId}`);
  if (params.silent === true) parts.push("silent=true");
  if (typeof params.chunkCount === "number") parts.push(`chunkCount=${params.chunkCount}`);
  sendLogger.info(parts.join(" "));
}
function buildTelegramTextSendReceipt(params) {
  if (params.messageIds.length <= 1) return;
  return createMessageReceiptFromOutboundResults({
    results: params.messageIds.map((messageId) => ({
      messageId,
      chatId: params.chatId,
    })),
    kind: "text",
    ...(typeof params.messageThreadId === "number"
      ? { threadId: String(params.messageThreadId) }
      : {}),
    ...(typeof params.replyToMessageId === "number"
      ? { replyToId: String(params.replyToMessageId) }
      : {}),
  });
}
function resolveAcceptedReplyToMessageId(params) {
  if (!params) return;
  if ("reply_to_message_id" in params) return params.reply_to_message_id;
  return params.reply_parameters?.message_id;
}
function toAcceptedThreadScopedParams(params) {
  if (!params) return;
  const scoped = {};
  if (typeof params.message_thread_id === "number" && Number.isFinite(params.message_thread_id))
    scoped.message_thread_id = params.message_thread_id;
  if (typeof params.reply_to_message_id === "number" && Number.isFinite(params.reply_to_message_id))
    scoped.reply_to_message_id = params.reply_to_message_id;
  const replyParameters = params.reply_parameters;
  if (replyParameters && typeof replyParameters === "object") {
    const messageId = replyParameters.message_id;
    if (typeof messageId === "number" && Number.isFinite(messageId))
      scoped.reply_parameters = { message_id: messageId };
  }
  return Object.keys(scoped).length > 0 ? scoped : void 0;
}
const MESSAGE_NOT_MODIFIED_RE =
  /400:\s*Bad Request:\s*message is not modified|MESSAGE_NOT_MODIFIED/i;
const MESSAGE_HAS_NO_TEXT_RE = /400:\s*Bad Request:\s*there is no text in the message to edit/i;
const MESSAGE_DELETE_NOOP_RE =
  /message to delete not found|message can't be deleted|MESSAGE_ID_INVALID|MESSAGE_DELETE_FORBIDDEN/i;
const CHAT_NOT_FOUND_RE = /400: Bad Request: chat not found/i;
const sendLogger = createSubsystemLogger("telegram/send");
const diagLogger = createSubsystemLogger("telegram/diagnostic");
const telegramClientOptionsCache = /* @__PURE__ */ new Map();
const MAX_TELEGRAM_CLIENT_OPTIONS_CACHE_SIZE = 64;
function resetTelegramClientOptionsCacheForTests() {
  telegramClientOptionsCache.clear();
}
function createTelegramHttpLogger(cfg) {
  if (!isDiagnosticFlagEnabled("telegram.http", cfg)) return () => {};
  return (label, err) => {
    if (!(err instanceof HttpError)) return;
    const detail = redactSensitiveText(formatUncaughtError(err.error ?? err));
    diagLogger.warn(`telegram http error (${label}): ${detail}`);
  };
}
function shouldUseTelegramClientOptionsCache() {
  return !process.env.VITEST && true;
}
function buildTelegramClientOptionsCacheKey(params) {
  const proxyKey = params.account.config.proxy?.trim() ?? "";
  const autoSelectFamily = params.account.config.network?.autoSelectFamily;
  const autoSelectFamilyKey =
    typeof autoSelectFamily === "boolean" ? String(autoSelectFamily) : "default";
  const dnsResultOrderKey = params.account.config.network?.dnsResultOrder ?? "default";
  const apiRootKey = params.account.config.apiRoot?.trim() ?? "";
  const timeoutSecondsKey =
    typeof params.timeoutSeconds === "number" ? String(params.timeoutSeconds) : "default";
  return `${params.account.accountId}::${proxyKey}::${autoSelectFamilyKey}::${dnsResultOrderKey}::${apiRootKey}::${timeoutSecondsKey}`;
}
function closeCachedTelegramClientOptions(entry) {
  entry.retired = true;
  if (entry.activeLeases > 0 || entry.closeStarted) return;
  entry.closeStarted = true;
  entry.transport.close().catch((err) => {
    diagLogger.warn(
      `telegram client options cache transport close failed: ${redactSensitiveText(formatUncaughtError(err))}`,
    );
  });
}
function leaseCachedTelegramClientOptions(entry) {
  entry.activeLeases += 1;
  let released = false;
  return {
    release: () => {
      if (released) return;
      released = true;
      entry.activeLeases = Math.max(0, entry.activeLeases - 1);
      if (entry.retired) closeCachedTelegramClientOptions(entry);
    },
  };
}
function setCachedTelegramClientOptions(cacheKey, entry) {
  telegramClientOptionsCache.set(cacheKey, entry);
  if (telegramClientOptionsCache.size > MAX_TELEGRAM_CLIENT_OPTIONS_CACHE_SIZE) {
    const oldestKey = telegramClientOptionsCache.keys().next().value;
    if (oldestKey !== void 0) {
      const evictedEntry = telegramClientOptionsCache.get(oldestKey);
      telegramClientOptionsCache.delete(oldestKey);
      if (evictedEntry) closeCachedTelegramClientOptions(evictedEntry);
    }
  }
  return {
    clientOptions: entry.clientOptions,
    lease: () => leaseCachedTelegramClientOptions(entry),
  };
}
function resolveTelegramClientOptions(account) {
  const timeoutSeconds =
    typeof account.config.timeoutSeconds === "number" &&
    Number.isFinite(account.config.timeoutSeconds)
      ? Math.max(1, Math.floor(account.config.timeoutSeconds))
      : void 0;
  const cacheKey = shouldUseTelegramClientOptionsCache()
    ? buildTelegramClientOptionsCacheKey({
        account,
        timeoutSeconds,
      })
    : null;
  if (cacheKey && telegramClientOptionsCache.has(cacheKey)) {
    const entry = telegramClientOptionsCache.get(cacheKey);
    if (entry)
      return {
        clientOptions: entry.clientOptions,
        lease: () => leaseCachedTelegramClientOptions(entry),
      };
  }
  const proxyUrl = normalizeOptionalString(account.config.proxy);
  const proxyFetch = proxyUrl ? makeProxyFetch(proxyUrl) : void 0;
  const apiRoot = normalizeOptionalString(account.config.apiRoot);
  const normalizedApiRoot = apiRoot ? normalizeTelegramApiRoot(apiRoot) : void 0;
  const transport = resolveTelegramTransport(proxyFetch, { network: account.config.network });
  const fetchImpl = createTelegramClientFetch({
    fetchImpl: asTelegramClientFetch(transport.fetch),
    timeoutSeconds,
    transport,
  });
  const clientOptions =
    fetchImpl || timeoutSeconds || normalizedApiRoot
      ? {
          ...(fetchImpl ? { fetch: asTelegramClientFetch(fetchImpl) } : {}),
          ...(timeoutSeconds ? { timeoutSeconds } : {}),
          ...(normalizedApiRoot ? { apiRoot: normalizedApiRoot } : {}),
        }
      : void 0;
  if (cacheKey)
    return setCachedTelegramClientOptions(cacheKey, {
      activeLeases: 0,
      clientOptions,
      closeStarted: false,
      retired: false,
      transport,
    });
  return { clientOptions };
}
function resolveToken(explicit, params) {
  if (explicit?.trim()) return explicit.trim();
  if (!params.token)
    throw new Error(
      `Telegram bot token missing for account "${params.accountId}" (set channels.telegram.accounts.${params.accountId}.botToken/tokenFile or TELEGRAM_BOT_TOKEN for default).`,
    );
  return params.token.trim();
}
async function resolveChatId(to, params) {
  const numericChatId = normalizeTelegramChatId(to);
  if (numericChatId) return numericChatId;
  const lookupTarget = normalizeTelegramLookupTarget(to);
  const getChat = params.api.getChat;
  if (!lookupTarget || typeof getChat !== "function")
    throw new Error("Telegram recipient must be a numeric chat ID");
  try {
    const chat = await getChat.call(params.api, lookupTarget);
    const resolved = normalizeTelegramChatId(String(chat?.id ?? ""));
    if (!resolved) throw new Error(`resolved chat id is not numeric (${String(chat?.id ?? "")})`);
    if (params.verbose)
      sendLogger.warn(`telegram recipient ${lookupTarget} resolved to numeric chat id ${resolved}`);
    return resolved;
  } catch (err) {
    const detail = formatErrorMessage(err);
    throw new Error(
      `Telegram recipient ${lookupTarget} could not be resolved to a numeric chat ID (${detail})`,
      { cause: err },
    );
  }
}
async function resolveAndPersistChatId(params) {
  const chatId = await resolveChatId(params.lookupTarget, {
    api: params.api,
    verbose: params.verbose,
  });
  await maybePersistResolvedTelegramTarget({
    cfg: params.cfg,
    rawTarget: params.persistTarget,
    resolvedChatId: chatId,
    verbose: params.verbose,
    gatewayClientScopes: params.gatewayClientScopes,
    ...(params.gatewayClientScopes === void 0 ? { trustedInternalWriteback: true } : {}),
  });
  return chatId;
}
function normalizeMessageId(raw) {
  if (typeof raw === "number" && Number.isFinite(raw)) return Math.trunc(raw);
  if (typeof raw === "string") {
    const value = raw.trim();
    if (!value) throw new Error("Message id is required for Telegram actions");
    const parsed = parseStrictInteger(value);
    if (parsed !== void 0) return parsed;
  }
  throw new Error("Message id is required for Telegram actions");
}
function isTelegramMessageNotModifiedError(err) {
  return MESSAGE_NOT_MODIFIED_RE.test(formatErrorMessage(err));
}
function isTelegramMessageHasNoTextError(err) {
  return MESSAGE_HAS_NO_TEXT_RE.test(formatErrorMessage(err));
}
function isTelegramMessageDeleteNoopError(err) {
  return MESSAGE_DELETE_NOOP_RE.test(formatErrorMessage(err));
}
async function withTelegramHtmlParseFallback(params) {
  try {
    return await params.requestHtml(params.label);
  } catch (err) {
    if (!isTelegramHtmlParseError(err)) throw err;
    if (params.verbose)
      sendLogger.warn(
        `telegram ${params.label} failed with HTML parse error, retrying as plain text: ${formatErrorMessage(err)}`,
      );
    return await params.requestPlain(`${params.label}-plain`);
  }
}
async function withTelegramNativeQuoteFallback(params) {
  try {
    return {
      result: await params.request(params.requestParams, params.label),
      acceptedParams: params.requestParams,
    };
  } catch (err) {
    if (
      getTelegramNativeQuoteReplyMessageId(params.requestParams) == null ||
      !isTelegramQuoteParamError(err)
    )
      throw err;
    sendLogger.warn(
      `telegram ${params.label} native quote rejected, retrying with legacy reply_to_message_id: ${formatErrorMessage(err)}`,
    );
    const acceptedParams = (params.removeNativeQuoteParam ?? removeTelegramNativeQuoteParam)(
      params.requestParams,
    );
    return {
      result: await params.request(acceptedParams, `${params.label}-legacy-reply`),
      acceptedParams,
    };
  }
}
function resolveTelegramApiContext(opts) {
  const cfg = requireRuntimeConfig(opts.cfg, "Telegram API context");
  const account = resolveTelegramAccount({
    cfg,
    accountId: opts.accountId,
  });
  const token = resolveToken(opts.token, account);
  let api;
  let clientOptionsLease;
  if (opts.api) api = opts.api;
  else {
    const client = resolveTelegramClientOptions(account);
    clientOptionsLease = client.lease?.();
    const bot = new Bot(token, client.clientOptions ? { client: client.clientOptions } : void 0);
    bot.api.config.use(getOrCreateAccountThrottler(token));
    api = bot.api;
  }
  return {
    cfg,
    account,
    api,
    ...(clientOptionsLease ? { clientOptionsLease } : {}),
  };
}
function withTelegramApiContextLease(context, operation) {
  return operation.finally(() => context.clientOptionsLease?.release());
}
function createTelegramRequestWithDiag(params) {
  const request = createChannelApiRetryRunner({
    retry: params.retry,
    configRetry: params.account.config.retry,
    verbose: params.verbose,
    ...(params.retryAfterMaxDelayMs !== void 0
      ? { retryAfterMaxDelayMs: params.retryAfterMaxDelayMs }
      : {}),
    ...(params.shouldRetry ? { shouldRetry: params.shouldRetry } : {}),
    ...(params.strictShouldRetry ? { strictShouldRetry: true } : {}),
  });
  const logHttpError = createTelegramHttpLogger(params.cfg);
  return (fn, label, options) => {
    const runRequest = () => request(fn, label);
    return (
      params.useApiErrorLogging === false
        ? runRequest()
        : withTelegramApiErrorLogging({
            operation: label ?? "request",
            fn: runRequest,
            ...(options?.shouldLog ? { shouldLog: options.shouldLog } : {}),
          })
    ).catch((err) => {
      logHttpError(label ?? "request", err);
      throw err;
    });
  };
}
function wrapTelegramChatNotFoundError(err, params) {
  const errorMsg = formatErrorMessage(err);
  if (/403.*(bot.*not.*member|bot.*blocked|bot.*kicked)/i.test(errorMsg))
    return new Error(
      [
        `Telegram send failed: bot is not a member of the chat, was blocked, or was kicked (chat_id=${params.chatId}).`,
        `Telegram API said: ${errorMsg}.`,
        "Fix: Add the bot to the channel/group, or ensure it has not been removed/blocked/kicked by the user.",
        `Input was: ${JSON.stringify(params.input)}.`,
      ].join(" "),
    );
  if (!CHAT_NOT_FOUND_RE.test(errorMsg)) return err;
  return new Error(
    [
      `Telegram send failed: chat not found (chat_id=${params.chatId}).`,
      "Likely: bot not started in DM, bot removed from group/channel, group migrated (new -100… id), or wrong bot token.",
      `Input was: ${JSON.stringify(params.input)}.`,
    ].join(" "),
  );
}
function createRequestWithChatNotFound(params) {
  return async (fn, label) =>
    params.requestWithDiag(fn, label).catch((err) => {
      throw wrapTelegramChatNotFoundError(err, {
        chatId: params.chatId,
        input: params.input,
      });
    });
}
function createTelegramNonIdempotentRequestWithDiag(params) {
  return createTelegramRequestWithDiag({
    cfg: params.cfg,
    account: params.account,
    retry: params.retry,
    verbose: params.verbose,
    useApiErrorLogging: params.useApiErrorLogging,
    retryAfterMaxDelayMs: TELEGRAM_OUTBOUND_RETRY_AFTER_CAP_MS,
    shouldRetry: (err) => isSafeToRetrySendError(err) || isTelegramRateLimitError(err),
    strictShouldRetry: true,
  });
}
async function sendMessageTelegram(to, text, opts) {
  const context = resolveTelegramApiContext(opts);
  return withTelegramApiContextLease(
    context,
    sendMessageTelegramWithContext(to, text, opts, context),
  );
}
async function sendMessageTelegramWithContext(to, text, opts, apiContext) {
  const { cfg, account, api } = apiContext;
  const botUserId = resolveTelegramBotUserIdFromToken(opts.token || account.token);
  const target = parseTelegramTarget(to);
  const chatId = await resolveAndPersistChatId({
    cfg,
    api,
    lookupTarget: target.chatId,
    persistTarget: to,
    verbose: opts.verbose,
    gatewayClientScopes: opts.gatewayClientScopes,
  });
  const reportDelivery = async (messageId, deliveredChatId) => {
    await opts.onDeliveryResult?.({
      messageId: String(messageId),
      chatId: String(deliveredChatId),
    });
  };
  const recordDeliveredPromptContext = async (params, finalPart) => {
    const plan = opts.promptContextProjectionPlan;
    const projection = plan?.cursor.take(plan.finalPart && finalPart);
    const recorded = await recordOutboundMessageForPromptContext({
      cfg,
      account,
      ...(botUserId !== void 0 ? { botUserId } : {}),
      chatId,
      ...params,
      promptContextProjection: projection,
    });
    if (projection && !recorded) plan?.cursor.invalidate();
  };
  const mediaUrl = opts.mediaUrl?.trim();
  const mediaMaxBytes =
    opts.maxBytes ??
    (typeof account.config.mediaMaxMb === "number" ? account.config.mediaMaxMb : 100) * 1024 * 1024;
  const replyMarkup = buildInlineKeyboard(opts.buttons);
  const threadSpec = resolveTelegramSendThreadSpec({
    targetMessageThreadId: target.messageThreadId,
    messageThreadId: opts.messageThreadId,
    chatType: target.chatType,
  });
  const singleUseReplyTo =
    opts.replyToIdSource === "implicit" &&
    opts.replyToMode !== void 0 &&
    isSingleUseReplyToMode(opts.replyToMode);
  const buildThreadParams = (includeReplyTo) =>
    buildTelegramThreadReplyParams({
      thread: threadSpec,
      ...(includeReplyTo
        ? {
            replyToMessageId: opts.replyToMessageId,
            replyQuoteText: opts.quoteText,
            useReplyIdAsQuoteSource: true,
          }
        : {}),
    });
  const requestWithChatNotFound = createRequestWithChatNotFound({
    requestWithDiag: createTelegramNonIdempotentRequestWithDiag({
      cfg,
      account,
      retry: opts.retry,
      verbose: opts.verbose,
    }),
    chatId,
    input: to,
  });
  const textMode = opts.textMode ?? "markdown";
  const useRichMessages = account.config.richMessages === true;
  const tableMode =
    opts.tableMode ??
    resolveMarkdownTableMode({
      cfg,
      channel: "telegram",
      accountId: account.accountId,
      supportsBlockTables: useRichMessages,
    });
  const renderHtmlText = (value) =>
    renderTelegramHtmlText(value, {
      textMode,
      tableMode,
    });
  const linkPreviewOptions = (account.config.linkPreview ?? true) ? void 0 : { is_disabled: true };
  const sendTelegramTextChunk = async (chunk, params) => {
    const baseParams = params ? { ...params } : {};
    if (linkPreviewOptions) baseParams.link_preview_options = linkPreviewOptions;
    const plainParams = {
      ...baseParams,
      ...(opts.silent === true ? { disable_notification: true } : {}),
    };
    const requestSendMessage = (label, messageText, requestParams) =>
      withTelegramNativeQuoteFallback({
        label,
        requestParams,
        request: (effectiveParams, retryLabel) =>
          requestWithChatNotFound(
            () =>
              Object.keys(effectiveParams).length > 0
                ? api.sendMessage(chatId, messageText, effectiveParams)
                : api.sendMessage(chatId, messageText),
            retryLabel,
          ),
      });
    const requestPlain = (label) => requestSendMessage(label, chunk.plainText, plainParams ?? {});
    const result = !chunk.htmlText
      ? await requestPlain("message")
      : await withTelegramHtmlParseFallback({
          label: "message",
          verbose: opts.verbose,
          requestHtml: (label) =>
            requestSendMessage(label, chunk.htmlText ?? chunk.plainText, {
              parse_mode: "HTML",
              ...plainParams,
            }),
          requestPlain,
        });
    return {
      result: result.result,
      acceptedParams: toAcceptedThreadScopedParams(result.acceptedParams),
    };
  };
  const shouldIncludeReplyForChunk = (index, chunkCount, replyToAlreadyUsed) =>
    !replyToAlreadyUsed && (!singleUseReplyTo || (chunkCount === 1 && index === 0));
  const buildTextParams = (index, chunkCount, isLastChunk, replyToAlreadyUsed) => {
    const params = buildThreadParams(
      shouldIncludeReplyForChunk(index, chunkCount, replyToAlreadyUsed),
    );
    return Object.keys(params).length > 0 || (isLastChunk && replyMarkup)
      ? {
          ...params,
          ...(isLastChunk && replyMarkup ? { reply_markup: replyMarkup } : {}),
        }
      : void 0;
  };
  const buildRichTextParams = (index, chunkCount, isLastChunk, replyToAlreadyUsed) => {
    const params = toTelegramRichMessageContextParams(
      buildThreadParams(shouldIncludeReplyForChunk(index, chunkCount, replyToAlreadyUsed)),
    );
    return Object.keys(params).length > 0 || (isLastChunk && replyMarkup)
      ? {
          ...params,
          ...(isLastChunk && replyMarkup ? { reply_markup: replyMarkup } : {}),
        }
      : void 0;
  };
  const sendTelegramTextChunks = async (chunks, context, options = {}) => {
    let lastMessageId = "";
    let lastChatId = chatId;
    let lastAcceptedParams;
    let acceptedReplyToMessageId;
    const messageIds = [];
    let sentChunkCount = 0;
    for (let index = 0; index < chunks.length; index += 1) {
      const chunk = chunks[index];
      if (!chunk) continue;
      const { result: res, acceptedParams } = await sendTelegramTextChunk(
        chunk,
        buildTextParams(
          index,
          chunks.length,
          index === chunks.length - 1,
          options.replyToAlreadyUsed === true,
        ),
      );
      const messageId = resolveTelegramMessageIdOrThrow(res, context);
      recordSentMessage(chatId, messageId, cfg);
      await reportDelivery(messageId, res?.chat?.id ?? chatId);
      await recordDeliveredPromptContext(
        {
          message: res,
          messageId,
          text: chunk.plainText,
          ...(acceptedParams?.message_thread_id !== void 0
            ? { messageThreadId: acceptedParams.message_thread_id }
            : {}),
        },
        index === chunks.length - 1,
      );
      lastMessageId = String(messageId);
      lastChatId = String(res?.chat?.id ?? chatId);
      lastAcceptedParams = acceptedParams;
      acceptedReplyToMessageId ??= resolveAcceptedReplyToMessageId(acceptedParams);
      messageIds.push(lastMessageId);
      sentChunkCount += 1;
    }
    if (lastMessageId)
      logTelegramOutboundSendOk({
        accountId: account.accountId,
        chatId: lastChatId,
        messageId: lastMessageId,
        operation: "sendMessage",
        deliveryKind: "text",
        messageThreadId: lastAcceptedParams?.message_thread_id,
        replyToMessageId: opts.replyToMessageId,
        silent: opts.silent,
        chunkCount: sentChunkCount,
      });
    const receipt = buildTelegramTextSendReceipt({
      messageIds,
      chatId: lastChatId,
      messageThreadId: lastAcceptedParams?.message_thread_id,
      replyToMessageId: acceptedReplyToMessageId,
    });
    return {
      messageId: lastMessageId,
      chatId: lastChatId,
      ...(receipt ? { receipt } : {}),
    };
  };
  const buildChunkedTextPlan = (rawText, context) => {
    const htmlText = renderHtmlText(rawText);
    const fallbackText = textMode === "html" ? telegramHtmlToPlainTextFallback(htmlText) : rawText;
    let htmlChunks;
    try {
      htmlChunks = splitTelegramHtmlChunks(htmlText, 4e3);
    } catch (error) {
      logVerbose(
        `telegram ${context} failed HTML chunk planning, retrying as plain text: ${formatErrorMessage(error)}`,
      );
      return splitTelegramPlainTextChunks(fallbackText, 4e3).map((plainText) => ({ plainText }));
    }
    const fixedPlainTextChunks = splitTelegramPlainTextChunks(fallbackText, 4e3);
    if (fixedPlainTextChunks.length > htmlChunks.length) {
      logVerbose(
        `telegram ${context} plain-text fallback needs more chunks than HTML; sending plain text`,
      );
      return fixedPlainTextChunks.map((plainText) => ({ plainText }));
    }
    return htmlChunks.map((htmlTextLocal) => ({
      htmlText: htmlTextLocal,
      plainText: telegramHtmlToPlainTextFallback(htmlTextLocal),
    }));
  };
  const sendChunkedText = async (rawText, context, options = {}) => {
    try {
      return useRichMessages
        ? await sendTelegramRichTextChunks(buildRichTextPlan(rawText), context, options)
        : await sendTelegramTextChunks(buildChunkedTextPlan(rawText, context), context, options);
    } catch (error) {
      opts.promptContextProjectionPlan?.cursor.invalidate();
      throw error;
    }
  };
  const buildRichTextPlan = (rawText) => {
    return splitTelegramRichMessageTextChunks({
      text: rawText,
      textLimit: Math.min(
        resolveTextChunkLimit(cfg, "telegram", account.accountId, {
          fallbackLimit: TELEGRAM_RICH_TEXT_LIMIT,
        }),
        TELEGRAM_RICH_TEXT_LIMIT,
      ),
      textMode,
      chunkMode: resolveChunkMode(cfg, "telegram", account.accountId),
      tableMode,
      skipEntityDetection: account.config.linkPreview === false,
    });
  };
  const sendTelegramRichTextChunks = async (chunks, context, options = {}) => {
    const richRawApi = getTelegramRichRawApi(api);
    let lastMessageId = "";
    let lastChatId = chatId;
    let lastAcceptedParams;
    let acceptedReplyToMessageId;
    const messageIds = [];
    let sentChunkCount = 0;
    for (let index = 0; index < chunks.length; index += 1) {
      const chunk = chunks[index];
      if (!chunk) continue;
      const acceptedParams = buildRichTextParams(
        index,
        chunks.length,
        index === chunks.length - 1,
        options.replyToAlreadyUsed === true,
      );
      let result;
      let recordedParams;
      if (!chunk.text?.trim()) {
        sendLogger.warn("telegram richMessage chunk rendered empty HTML; skipping");
        continue;
      }
      try {
        warnTelegramRichHtmlDegradations({
          context: "richMessage",
          reasons: chunk.degradationReasons,
          warn: (message) => sendLogger.warn(message),
        });
        const richResult = await withTelegramNativeQuoteFallback({
          label: "richMessage",
          requestParams: acceptedParams ?? {},
          removeNativeQuoteParam: removeTelegramRichNativeQuoteParam,
          request: (effectiveParams, retryLabel) =>
            requestWithChatNotFound(
              () =>
                richRawApi.sendRichMessage({
                  chat_id: chatId,
                  rich_message: chunk.skipEntityDetection
                    ? {
                        html: chunk.text,
                        skip_entity_detection: true,
                      }
                    : { html: chunk.text },
                  ...effectiveParams,
                  ...(opts.silent === true ? { disable_notification: true } : {}),
                }),
              retryLabel,
            ),
        });
        result = richResult.result;
        recordedParams = toTelegramRichMessageContextParams(richResult.acceptedParams);
      } catch (err) {
        const fallbackPlan = buildTelegramPlainFallbackPlan({
          html: chunk.text,
          err,
          context: "richMessage",
          warn: (message) => sendLogger.warn(message),
        });
        if (!fallbackPlan) throw err;
        const fallbackChunks = fallbackPlan.chunks;
        const fallbackReplyChunkCount = Math.max(chunks.length, fallbackChunks.length);
        for (let fallbackIndex = 0; fallbackIndex < fallbackChunks.length; fallbackIndex += 1) {
          const fallbackText = fallbackChunks[fallbackIndex] ?? "";
          const fallbackReplyIndex = chunks.length === 1 ? fallbackIndex : index;
          const fallbackParams = buildTextParams(
            fallbackReplyIndex,
            fallbackReplyChunkCount,
            index === chunks.length - 1 && fallbackIndex === fallbackChunks.length - 1,
            options.replyToAlreadyUsed === true,
          );
          const plainResult = await sendTelegramTextChunk(
            { plainText: fallbackText },
            fallbackParams,
          );
          const fallbackMessageId = resolveTelegramMessageIdOrThrow(plainResult.result, context);
          recordSentMessage(chatId, fallbackMessageId, cfg);
          await reportDelivery(fallbackMessageId, plainResult.result?.chat?.id ?? chatId);
          await recordDeliveredPromptContext(
            {
              message: plainResult.result,
              messageId: fallbackMessageId,
              text: fallbackText,
              ...(plainResult.acceptedParams?.message_thread_id !== void 0
                ? { messageThreadId: plainResult.acceptedParams.message_thread_id }
                : {}),
            },
            index === chunks.length - 1 && fallbackIndex === fallbackChunks.length - 1,
          );
          lastMessageId = String(fallbackMessageId);
          lastChatId = String(plainResult.result?.chat?.id ?? chatId);
          lastAcceptedParams = plainResult.acceptedParams;
          acceptedReplyToMessageId ??= resolveAcceptedReplyToMessageId(plainResult.acceptedParams);
          messageIds.push(lastMessageId);
          sentChunkCount += 1;
        }
        continue;
      }
      const messageId = resolveTelegramMessageIdOrThrow(result, context);
      recordSentMessage(chatId, messageId, cfg);
      await reportDelivery(messageId, result?.chat?.id ?? chatId);
      await recordDeliveredPromptContext(
        {
          message: result,
          messageId,
          text: chunk.plainText,
          ...(recordedParams?.message_thread_id !== void 0
            ? { messageThreadId: recordedParams.message_thread_id }
            : {}),
        },
        index === chunks.length - 1,
      );
      lastMessageId = String(messageId);
      lastChatId = String(result?.chat?.id ?? chatId);
      lastAcceptedParams = recordedParams;
      acceptedReplyToMessageId ??= resolveAcceptedReplyToMessageId(recordedParams);
      messageIds.push(lastMessageId);
      sentChunkCount += 1;
    }
    if (lastMessageId)
      logTelegramOutboundSendOk({
        accountId: account.accountId,
        chatId: lastChatId,
        messageId: lastMessageId,
        operation: "sendRichMessage",
        deliveryKind: "text",
        messageThreadId: lastAcceptedParams?.message_thread_id,
        replyToMessageId: opts.replyToMessageId,
        silent: opts.silent,
        chunkCount: sentChunkCount,
      });
    const receipt = buildTelegramTextSendReceipt({
      messageIds,
      chatId: lastChatId,
      messageThreadId: lastAcceptedParams?.message_thread_id,
      replyToMessageId: acceptedReplyToMessageId,
    });
    return {
      messageId: lastMessageId,
      chatId: lastChatId,
      ...(receipt ? { receipt } : {}),
    };
  };
  async function shouldSendTelegramImageAsPhoto(buffer) {
    try {
      const metadata = await getImageMetadata(buffer);
      const width = metadata?.width;
      const height = metadata?.height;
      if (typeof width !== "number" || typeof height !== "number") {
        sendLogger.warn("Photo dimensions are unavailable. Sending as document instead.");
        return false;
      }
      const shorterSide = Math.min(width, height);
      const longerSide = Math.max(width, height);
      if (
        !(
          width + height <= MAX_TELEGRAM_PHOTO_DIMENSION_SUM &&
          shorterSide > 0 &&
          longerSide <= shorterSide * MAX_TELEGRAM_PHOTO_ASPECT_RATIO
        )
      ) {
        sendLogger.warn(
          `Photo dimensions (${width}x${height}) are not valid for Telegram photos. Sending as document instead.`,
        );
        return false;
      }
      return true;
    } catch (err) {
      sendLogger.warn(
        `Failed to validate photo dimensions: ${formatErrorMessage(err)}. Sending as document instead.`,
      );
      return false;
    }
  }
  if (mediaUrl) {
    const media = await loadWebMedia(
      mediaUrl,
      buildOutboundMediaLoadOptions({
        maxBytes: mediaMaxBytes,
        mediaLocalRoots: opts.mediaLocalRoots,
        mediaReadFile: opts.mediaReadFile,
        optimizeImages: opts.forceDocument ? false : void 0,
      }),
    );
    const kind = kindFromMime(media.contentType ?? void 0);
    const isGif = isGifMedia({
      contentType: media.contentType,
      fileName: media.fileName,
    });
    let sendImageAsPhoto = true;
    const deliveryKind =
      opts.forceDocument === true && (kind === "image" || kind === "video") ? "document" : kind;
    if (opts.asVideoNote === true && deliveryKind !== "video")
      throw new Error("Telegram video notes require video media.");
    if (deliveryKind === "image" && !isGif)
      sendImageAsPhoto = await shouldSendTelegramImageAsPhoto(media.buffer);
    const isVideoNote = deliveryKind === "video" && opts.asVideoNote === true;
    const fileName =
      media.fileName ?? (isGif ? "animation.gif" : inferFilename(kind ?? "document")) ?? "file";
    const file = new InputFileCtor(media.buffer, fileName);
    let caption;
    let followUpText;
    if (isVideoNote) {
      caption = void 0;
      followUpText = text.trim() ? text : void 0;
    } else {
      const split = splitTelegramCaption(text);
      caption = split.caption;
      followUpText = split.followUpText;
    }
    const htmlCaption = caption ? renderHtmlText(caption) : void 0;
    const plainCaption =
      caption && textMode === "html" ? telegramHtmlToPlainTextFallback(caption) : caption;
    const needsSeparateText = Boolean(followUpText);
    const mediaThreadParams = buildThreadParams(true);
    const mediaUsedReplyTo = resolveAcceptedReplyToMessageId(mediaThreadParams) !== void 0;
    const baseMediaParams = {
      ...mediaThreadParams,
      ...(!needsSeparateText && replyMarkup ? { reply_markup: replyMarkup } : {}),
    };
    const videoDimensions =
      deliveryKind === "video" && !isVideoNote ? await probeVideoDimensions(media.buffer) : void 0;
    const mediaParams = {
      ...(htmlCaption
        ? {
            caption: htmlCaption,
            parse_mode: "HTML",
          }
        : {}),
      ...baseMediaParams,
      ...(opts.silent === true ? { disable_notification: true } : {}),
      ...(videoDimensions
        ? {
            width: videoDimensions.width,
            height: videoDimensions.height,
          }
        : {}),
    };
    const plainMediaParams = {
      ...(plainCaption ? { caption: plainCaption } : {}),
      ...baseMediaParams,
      ...(opts.silent === true ? { disable_notification: true } : {}),
      ...(videoDimensions
        ? {
            width: videoDimensions.width,
            height: videoDimensions.height,
          }
        : {}),
    };
    const sendMedia = async (label, sender) => {
      const requestMedia = (requestParams, retryLabel) =>
        withTelegramNativeQuoteFallback({
          label: retryLabel,
          requestParams,
          request: (effectiveParams, effectiveLabel) =>
            requestWithChatNotFound(() => sender(effectiveParams), effectiveLabel),
        });
      if (!htmlCaption || !plainCaption) return await requestMedia(mediaParams, label);
      return await withTelegramHtmlParseFallback({
        label,
        verbose: opts.verbose,
        requestHtml: (retryLabel) => requestMedia(mediaParams, retryLabel),
        requestPlain: (retryLabel) => requestMedia(plainMediaParams, retryLabel),
      });
    };
    const mediaSender = (() => {
      if (isGif && deliveryKind !== "document")
        return {
          label: "animation",
          sender: (effectiveParams) => api.sendAnimation(chatId, file, effectiveParams),
        };
      if (deliveryKind === "image" && !isGif && sendImageAsPhoto)
        return {
          label: "photo",
          sender: (effectiveParams) => api.sendPhoto(chatId, file, effectiveParams),
        };
      if (deliveryKind === "video") {
        if (isVideoNote)
          return {
            label: "video_note",
            sender: (effectiveParams) => api.sendVideoNote(chatId, file, effectiveParams),
          };
        return {
          label: "video",
          sender: (effectiveParams) => api.sendVideo(chatId, file, effectiveParams),
        };
      }
      if (kind === "audio") {
        const { useVoice } = resolveTelegramVoiceSend({
          wantsVoice: opts.asVoice === true,
          contentType: media.contentType,
          fileName,
          logFallback: logVerbose,
        });
        if (useVoice)
          return {
            label: "voice",
            sender: (effectiveParams) => api.sendVoice(chatId, file, effectiveParams),
          };
        return {
          label: "audio",
          sender: (effectiveParams) => api.sendAudio(chatId, file, effectiveParams),
        };
      }
      return {
        label: "document",
        sender: (effectiveParams) =>
          api.sendDocument(
            chatId,
            file,
            opts.forceDocument
              ? {
                  ...effectiveParams,
                  disable_content_type_detection: true,
                }
              : effectiveParams,
          ),
      };
    })();
    let mediaDelivery;
    try {
      mediaDelivery = await sendMedia(mediaSender.label, mediaSender.sender);
    } catch (error) {
      opts.promptContextProjectionPlan?.cursor.invalidate();
      throw error;
    }
    const result = mediaDelivery.result;
    const acceptedMediaParams = toAcceptedThreadScopedParams(mediaDelivery.acceptedParams);
    const mediaMessageId = resolveTelegramMessageIdOrThrow(result, "media send");
    const resolvedChatId = String(result?.chat?.id ?? chatId);
    recordSentMessage(chatId, mediaMessageId, cfg);
    await reportDelivery(mediaMessageId, resolvedChatId);
    await recordDeliveredPromptContext(
      {
        message: result,
        messageId: mediaMessageId,
        ...(caption ? { text: caption } : {}),
        ...(acceptedMediaParams?.message_thread_id !== void 0
          ? { messageThreadId: acceptedMediaParams.message_thread_id }
          : {}),
      },
      !needsSeparateText,
    );
    logTelegramOutboundSendOk({
      accountId: account.accountId,
      chatId: resolvedChatId,
      messageId: String(mediaMessageId),
      operation: `send${mediaSender.label
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("")}`,
      deliveryKind: mediaSender.label,
      messageThreadId: acceptedMediaParams?.message_thread_id,
      replyToMessageId: opts.replyToMessageId,
      silent: opts.silent,
    });
    recordChannelActivity({
      channel: "telegram",
      accountId: account.accountId,
      direction: "outbound",
    });
    if (needsSeparateText && followUpText)
      return {
        ...(await sendChunkedText(followUpText, "text follow-up send", {
          replyToAlreadyUsed: singleUseReplyTo && mediaUsedReplyTo,
        })),
        chatId: resolvedChatId,
      };
    return {
      messageId: String(mediaMessageId),
      chatId: resolvedChatId,
    };
  }
  if (!text || !text.trim()) throw new Error("Message must be non-empty for Telegram sends");
  const textResult = await sendChunkedText(text, "text send");
  recordChannelActivity({
    channel: "telegram",
    accountId: account.accountId,
    direction: "outbound",
  });
  return textResult;
}
/** Send a standalone location pin or named venue through Telegram's native payload. */
async function sendLocationTelegram(to, input, opts) {
  const context = resolveTelegramApiContext(opts);
  return withTelegramApiContextLease(
    context,
    sendLocationTelegramWithContext(to, input, opts, context),
  );
}
async function sendLocationTelegramWithContext(to, input, opts, context) {
  const location = normalizeOutboundLocation(input);
  if (!location) throw new Error("Telegram location is required.");
  const hasName = Boolean(location.name);
  if (hasName !== Boolean(location.address))
    throw new Error("Telegram venues require both location.name and location.address.");
  const { cfg, account, api } = context;
  const botUserId = resolveTelegramBotUserIdFromToken(opts.token || account.token);
  const target = parseTelegramTarget(to);
  const chatId = await resolveAndPersistChatId({
    cfg,
    api,
    lookupTarget: target.chatId,
    persistTarget: to,
    verbose: opts.verbose,
    gatewayClientScopes: opts.gatewayClientScopes,
  });
  const threadParams = buildTelegramThreadReplyParams({
    thread: resolveTelegramSendThreadSpec({
      targetMessageThreadId: target.messageThreadId,
      messageThreadId: opts.messageThreadId,
      chatType: target.chatType,
    }),
    replyToMessageId: opts.replyToMessageId,
    replyQuoteText: opts.quoteText,
    useReplyIdAsQuoteSource: true,
  });
  const replyMarkup = buildInlineKeyboard(opts.buttons);
  const commonParams = {
    ...threadParams,
    ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
    ...(opts.silent === true ? { disable_notification: true } : {}),
  };
  const requestWithChatNotFound = createRequestWithChatNotFound({
    requestWithDiag: createTelegramNonIdempotentRequestWithDiag({
      cfg,
      account,
      retry: opts.retry,
      verbose: opts.verbose,
    }),
    chatId,
    input: to,
  });
  const label = hasName ? "venue" : "location";
  const delivery = await withTelegramNativeQuoteFallback({
    label,
    requestParams: commonParams,
    request: (effectiveParams, retryLabel) =>
      requestWithChatNotFound(
        () =>
          hasName
            ? api.sendVenue(
                chatId,
                location.latitude,
                location.longitude,
                location.name ?? "",
                location.address ?? "",
                effectiveParams,
              )
            : api.sendLocation(chatId, location.latitude, location.longitude, {
                ...effectiveParams,
                ...(location.accuracy !== void 0 ? { horizontal_accuracy: location.accuracy } : {}),
              }),
        retryLabel,
      ),
  });
  const result = delivery.result;
  const acceptedParams = toAcceptedThreadScopedParams(delivery.acceptedParams);
  const messageId = resolveTelegramMessageIdOrThrow(result, `${label} send`);
  const resolvedChatId = String(result?.chat?.id ?? chatId);
  recordSentMessage(chatId, messageId, cfg);
  await opts.onDeliveryResult?.({
    messageId: String(messageId),
    chatId: resolvedChatId,
  });
  const projectionPlan = opts.promptContextProjectionPlan;
  const projection = projectionPlan?.cursor.take(projectionPlan.finalPart);
  const recorded = await recordOutboundMessageForPromptContext({
    cfg,
    account,
    ...(botUserId !== void 0 ? { botUserId } : {}),
    chatId,
    message: result,
    messageId,
    text: formatLocationText(location),
    ...(acceptedParams?.message_thread_id !== void 0
      ? { messageThreadId: acceptedParams.message_thread_id }
      : {}),
    promptContextProjection: projection,
  });
  if (projection && !recorded) projectionPlan?.cursor.invalidate();
  logTelegramOutboundSendOk({
    accountId: account.accountId,
    chatId: resolvedChatId,
    messageId: String(messageId),
    operation: hasName ? "sendVenue" : "sendLocation",
    deliveryKind: label,
    messageThreadId: acceptedParams?.message_thread_id,
    replyToMessageId: opts.replyToMessageId,
    silent: opts.silent,
  });
  recordChannelActivity({
    channel: "telegram",
    accountId: account.accountId,
    direction: "outbound",
  });
  return {
    messageId: String(messageId),
    chatId: resolvedChatId,
  };
}
async function sendTypingTelegram(to, opts) {
  const context = resolveTelegramApiContext(opts);
  return withTelegramApiContextLease(context, sendTypingTelegramWithContext(to, opts, context));
}
async function sendTypingTelegramWithContext(to, opts, context) {
  const { cfg, account, api } = context;
  const target = parseTelegramTarget(to);
  const chatId = await resolveAndPersistChatId({
    cfg,
    api,
    lookupTarget: target.chatId,
    persistTarget: to,
    verbose: opts.verbose,
  });
  const requestWithDiag = createTelegramRequestWithDiag({
    cfg,
    account,
    retry: opts.retry,
    verbose: opts.verbose,
    shouldRetry: (err) => isRecoverableTelegramNetworkError(err, { context: "action" }),
  });
  const threadParams = buildTypingThreadParams(target.messageThreadId ?? opts.messageThreadId);
  await requestWithDiag(() => api.sendChatAction(chatId, "typing", threadParams), "typing");
  return { ok: true };
}
async function reactMessageTelegram(chatIdInput, messageIdInput, emoji, opts) {
  const context = resolveTelegramApiContext(opts);
  return withTelegramApiContextLease(
    context,
    reactMessageTelegramWithContext(chatIdInput, messageIdInput, emoji, opts, context),
  );
}
async function reactMessageTelegramWithContext(chatIdInput, messageIdInput, emoji, opts, context) {
  const { cfg, account, api } = context;
  const rawTarget = String(chatIdInput);
  const chatId = await resolveAndPersistChatId({
    cfg,
    api,
    lookupTarget: rawTarget,
    persistTarget: rawTarget,
    verbose: opts.verbose,
    gatewayClientScopes: opts.gatewayClientScopes,
  });
  const messageId = normalizeMessageId(messageIdInput);
  const requestWithDiag = createTelegramRequestWithDiag({
    cfg,
    account,
    retry: opts.retry,
    verbose: opts.verbose,
    shouldRetry: (err) => isRecoverableTelegramNetworkError(err, { context: "react" }),
  });
  const remove = opts.remove === true;
  const trimmedEmoji = emoji.trim();
  const reactions =
    remove || !trimmedEmoji
      ? []
      : [
          {
            type: "emoji",
            emoji: trimmedEmoji,
          },
        ];
  if (typeof api.setMessageReaction !== "function")
    throw new Error("Telegram reactions are unavailable in this bot API.");
  try {
    await requestWithDiag(() => api.setMessageReaction(chatId, messageId, reactions), "reaction");
  } catch (err) {
    const msg = formatErrorMessage(err);
    if (/REACTION_INVALID/i.test(msg))
      return {
        ok: false,
        warning: `Reaction unavailable: ${trimmedEmoji}`,
      };
    throw err;
  }
  return { ok: true };
}
async function deleteMessageTelegram(chatIdInput, messageIdInput, opts) {
  const context = resolveTelegramApiContext(opts);
  return withTelegramApiContextLease(
    context,
    deleteMessageTelegramWithContext(chatIdInput, messageIdInput, opts, context),
  );
}
async function deleteMessageTelegramWithContext(chatIdInput, messageIdInput, opts, context) {
  const { cfg, account, api } = context;
  const rawTarget = String(chatIdInput);
  const chatId = await resolveAndPersistChatId({
    cfg,
    api,
    lookupTarget: rawTarget,
    persistTarget: rawTarget,
    verbose: opts.verbose,
    gatewayClientScopes: opts.gatewayClientScopes,
  });
  const messageId = normalizeMessageId(messageIdInput);
  const requestWithDiag = createTelegramRequestWithDiag({
    cfg,
    account,
    retry: opts.retry,
    verbose: opts.verbose,
    shouldRetry: (err) => isRecoverableTelegramNetworkError(err, { context: "delete" }),
  });
  try {
    await requestWithDiag(() => api.deleteMessage(chatId, messageId), "deleteMessage", {
      shouldLog: (err) => !isTelegramMessageDeleteNoopError(err),
    });
  } catch (err) {
    if (!isTelegramMessageDeleteNoopError(err)) throw err;
    const detail = formatErrorMessage(err);
    logVerbose(`[telegram] Delete skipped for message ${messageId} in chat ${chatId}: ${detail}`);
    return {
      ok: false,
      warning: `Message ${messageId} was not deleted: ${detail}`,
    };
  }
  logVerbose(`[telegram] Deleted message ${messageId} from chat ${chatId}`);
  return { ok: true };
}
async function pinMessageTelegram(chatIdInput, messageIdInput, opts) {
  const context = resolveTelegramApiContext(opts);
  return withTelegramApiContextLease(
    context,
    pinMessageTelegramWithContext(chatIdInput, messageIdInput, opts, context),
  );
}
async function pinMessageTelegramWithContext(chatIdInput, messageIdInput, opts, context) {
  const { cfg, account, api } = context;
  const rawTarget = String(chatIdInput);
  const chatId = await resolveAndPersistChatId({
    cfg,
    api,
    lookupTarget: rawTarget,
    persistTarget: rawTarget,
    verbose: opts.verbose,
    gatewayClientScopes: opts.gatewayClientScopes,
  });
  const messageId = normalizeMessageId(messageIdInput);
  await createTelegramRequestWithDiag({
    cfg,
    account,
    retry: opts.retry,
    verbose: opts.verbose,
  })(
    () => api.pinChatMessage(chatId, messageId, { disable_notification: opts.notify !== true }),
    "pinChatMessage",
  );
  logVerbose(`[telegram] Pinned message ${messageId} in chat ${chatId}`);
  return {
    ok: true,
    messageId: String(messageId),
    chatId,
  };
}
async function unpinMessageTelegram(chatIdInput, messageIdInput, opts) {
  const context = resolveTelegramApiContext(opts);
  return withTelegramApiContextLease(
    context,
    unpinMessageTelegramWithContext(chatIdInput, messageIdInput, opts, context),
  );
}
async function unpinMessageTelegramWithContext(chatIdInput, messageIdInput, opts, context) {
  const { cfg, account, api } = context;
  const rawTarget = String(chatIdInput);
  const chatId = await resolveAndPersistChatId({
    cfg,
    api,
    lookupTarget: rawTarget,
    persistTarget: rawTarget,
    verbose: opts.verbose,
    gatewayClientScopes: opts.gatewayClientScopes,
  });
  const messageId = messageIdInput === void 0 ? void 0 : normalizeMessageId(messageIdInput);
  await createTelegramRequestWithDiag({
    cfg,
    account,
    retry: opts.retry,
    verbose: opts.verbose,
  })(() => api.unpinChatMessage(chatId, messageId), "unpinChatMessage");
  logVerbose(
    `[telegram] Unpinned ${messageId != null ? `message ${messageId}` : "active message"} in chat ${chatId}`,
  );
  return {
    ok: true,
    chatId,
    ...(messageId != null ? { messageId: String(messageId) } : {}),
  };
}
async function editForumTopicTelegram(chatIdInput, messageThreadIdInput, opts) {
  const nameProvided = opts.name !== void 0;
  const trimmedName = opts.name?.trim();
  if (nameProvided && !trimmedName) throw new Error("Telegram forum topic name is required");
  if (trimmedName && trimmedName.length > 128)
    throw new Error("Telegram forum topic name must be 128 characters or fewer");
  const iconProvided = opts.iconCustomEmojiId !== void 0;
  const trimmedIconCustomEmojiId = opts.iconCustomEmojiId?.trim();
  if (iconProvided && !trimmedIconCustomEmojiId)
    throw new Error("Telegram forum topic icon custom emoji ID is required");
  if (!trimmedName && !trimmedIconCustomEmojiId)
    throw new Error("Telegram forum topic update requires a name or iconCustomEmojiId");
  const context = resolveTelegramApiContext(opts);
  return withTelegramApiContextLease(
    context,
    editForumTopicTelegramWithContext(chatIdInput, messageThreadIdInput, opts, context),
  );
}
async function editForumTopicTelegramWithContext(chatIdInput, messageThreadIdInput, opts, context) {
  const trimmedName = opts.name?.trim();
  const trimmedIconCustomEmojiId = opts.iconCustomEmojiId?.trim();
  const { cfg, account, api } = context;
  const rawTarget = String(chatIdInput);
  const chatId = await resolveAndPersistChatId({
    cfg,
    api,
    lookupTarget: parseTelegramTarget(rawTarget).chatId,
    persistTarget: rawTarget,
    verbose: opts.verbose,
    gatewayClientScopes: opts.gatewayClientScopes,
  });
  const messageThreadId = normalizeMessageId(messageThreadIdInput);
  const requestWithDiag = createTelegramRequestWithDiag({
    cfg,
    account,
    retry: opts.retry,
    verbose: opts.verbose,
  });
  const payload = {
    ...(trimmedName ? { name: trimmedName } : {}),
    ...(trimmedIconCustomEmojiId ? { icon_custom_emoji_id: trimmedIconCustomEmojiId } : {}),
  };
  await requestWithDiag(
    () => api.editForumTopic(chatId, messageThreadId, payload),
    "editForumTopic",
  );
  logVerbose(`[telegram] Edited forum topic ${messageThreadId} in chat ${chatId}`);
  return {
    ok: true,
    chatId,
    messageThreadId,
    ...(trimmedName ? { name: trimmedName } : {}),
    ...(trimmedIconCustomEmojiId ? { iconCustomEmojiId: trimmedIconCustomEmojiId } : {}),
  };
}
async function renameForumTopicTelegram(chatIdInput, messageThreadIdInput, name, opts) {
  const result = await editForumTopicTelegram(chatIdInput, messageThreadIdInput, {
    ...opts,
    name,
  });
  return {
    ok: true,
    chatId: result.chatId,
    messageThreadId: result.messageThreadId,
    name: result.name ?? name.trim(),
  };
}
async function editMessageReplyMarkupTelegram(chatIdInput, messageIdInput, buttons, opts) {
  const context = resolveTelegramApiContext(opts);
  return withTelegramApiContextLease(
    context,
    editMessageReplyMarkupTelegramWithContext(chatIdInput, messageIdInput, buttons, opts, context),
  );
}
async function editMessageReplyMarkupTelegramWithContext(
  chatIdInput,
  messageIdInput,
  buttons,
  opts,
  context,
) {
  const { cfg, account, api } = context;
  const rawTarget = String(chatIdInput);
  const chatId = await resolveAndPersistChatId({
    cfg,
    api,
    lookupTarget: rawTarget,
    persistTarget: rawTarget,
    verbose: opts.verbose,
    gatewayClientScopes: opts.gatewayClientScopes,
  });
  const messageId = normalizeMessageId(messageIdInput);
  const requestWithDiag = createTelegramRequestWithDiag({
    cfg,
    account,
    retry: opts.retry,
    verbose: opts.verbose,
  });
  const replyMarkup = buildInlineKeyboard(buttons) ?? { inline_keyboard: [] };
  try {
    await requestWithDiag(
      () => api.editMessageReplyMarkup(chatId, messageId, { reply_markup: replyMarkup }),
      "editMessageReplyMarkup",
      { shouldLog: (err) => !isTelegramMessageNotModifiedError(err) },
    );
  } catch (err) {
    if (!isTelegramMessageNotModifiedError(err)) throw err;
  }
  logVerbose(`[telegram] Edited reply markup for message ${messageId} in chat ${chatId}`);
  return {
    ok: true,
    messageId: String(messageId),
    chatId,
  };
}
async function editMessageTelegram(chatIdInput, messageIdInput, text, opts) {
  const context = resolveTelegramApiContext(opts);
  return withTelegramApiContextLease(
    context,
    editMessageTelegramWithContext(chatIdInput, messageIdInput, text, opts, context),
  );
}
async function editMessageTelegramWithContext(chatIdInput, messageIdInput, text, opts, context) {
  const { cfg, account, api } = context;
  const rawTarget = String(chatIdInput);
  const chatId = await resolveAndPersistChatId({
    cfg,
    api,
    lookupTarget: rawTarget,
    persistTarget: rawTarget,
    verbose: opts.verbose,
    gatewayClientScopes: opts.gatewayClientScopes,
  });
  const messageId = normalizeMessageId(messageIdInput);
  const requestWithDiag = createTelegramRequestWithDiag({
    cfg,
    account,
    retry: opts.retry,
    verbose: opts.verbose,
    shouldRetry: (err) =>
      isRecoverableTelegramNetworkError(err, { context: "edit" }) || isTelegramServerError(err),
  });
  const requestWithEditShouldLog = (fn, label, shouldLog) =>
    requestWithDiag(fn, label, shouldLog ? { shouldLog } : void 0);
  const textMode = opts.textMode ?? "markdown";
  const useRichMessages = account.config.richMessages === true;
  const tableMode = resolveMarkdownTableMode({
    cfg,
    channel: "telegram",
    accountId: account.accountId,
    supportsBlockTables: useRichMessages,
  });
  const htmlText = renderTelegramHtmlText(text, {
    textMode,
    tableMode,
  });
  const plainText = textMode === "html" ? telegramHtmlToPlainTextFallback(htmlText) : text;
  const richRawApi = useRichMessages ? getTelegramRichRawApi(api) : void 0;
  const richMessagePlan = useRichMessages
    ? buildTelegramRichMessagePlan(text, textMode, {
        skipEntityDetection: opts.linkPreview === false,
        tableMode,
      })
    : void 0;
  const shouldTouchButtons = opts.buttons !== void 0;
  const builtKeyboard = shouldTouchButtons ? buildInlineKeyboard(opts.buttons) : void 0;
  const replyMarkup = shouldTouchButtons ? (builtKeyboard ?? { inline_keyboard: [] }) : void 0;
  const textEditParams = { parse_mode: "HTML" };
  if (opts.linkPreview === false) textEditParams.link_preview_options = { is_disabled: true };
  if (replyMarkup !== void 0) textEditParams.reply_markup = replyMarkup;
  const plainTextParams = {};
  if (opts.linkPreview === false) plainTextParams.link_preview_options = { is_disabled: true };
  if (replyMarkup !== void 0) plainTextParams.reply_markup = replyMarkup;
  const captionEditParams = {
    caption: htmlText,
    parse_mode: "HTML",
  };
  if (replyMarkup !== void 0) captionEditParams.reply_markup = replyMarkup;
  const plainCaptionParams = { caption: plainText };
  if (replyMarkup !== void 0) plainCaptionParams.reply_markup = replyMarkup;
  const performTextEdit = () => {
    if (richRawApi && richMessagePlan) {
      const richEditParams = replyMarkup === void 0 ? {} : { reply_markup: replyMarkup };
      warnTelegramRichHtmlDegradations({
        context: "editMessage",
        reasons: richMessagePlan.degradationReasons,
        warn: (message) => sendLogger.warn(message),
      });
      return requestWithEditShouldLog(
        () =>
          richRawApi.editMessageText({
            chat_id: chatId,
            message_id: messageId,
            rich_message: richMessagePlan.richMessage,
            ...richEditParams,
          }),
        "editMessage",
        (err) => !isTelegramMessageNotModifiedError(err),
      ).catch((err) => {
        const fallbackPlan = buildTelegramPlainFallbackPlan({
          html: richMessagePlan.richMessage.html,
          err,
          context: "editMessage",
          warn: (message) => sendLogger.warn(message),
        });
        if (!fallbackPlan) throw err;
        return requestWithEditShouldLog(
          () =>
            Object.keys(plainTextParams).length > 0
              ? api.editMessageText(chatId, messageId, fallbackPlan.plainText, plainTextParams)
              : api.editMessageText(chatId, messageId, fallbackPlan.plainText),
          "editMessage-plain",
          (plainErr) => !isTelegramMessageNotModifiedError(plainErr),
        );
      });
    }
    return withTelegramHtmlParseFallback({
      label: "editMessage",
      verbose: opts.verbose,
      requestHtml: (retryLabel) =>
        requestWithEditShouldLog(
          () => api.editMessageText(chatId, messageId, htmlText, textEditParams),
          retryLabel,
          (err) => !isTelegramMessageNotModifiedError(err),
        ),
      requestPlain: (retryLabel) =>
        requestWithEditShouldLog(
          () =>
            Object.keys(plainTextParams).length > 0
              ? api.editMessageText(chatId, messageId, plainText, plainTextParams)
              : api.editMessageText(chatId, messageId, plainText),
          retryLabel,
          (plainErr) => !isTelegramMessageNotModifiedError(plainErr),
        ),
    });
  };
  const performCaptionEdit = () =>
    withTelegramHtmlParseFallback({
      label: "editMessageCaption",
      verbose: opts.verbose,
      requestHtml: (retryLabel) =>
        requestWithEditShouldLog(
          () => api.editMessageCaption(chatId, messageId, captionEditParams),
          retryLabel,
          (err) => !isTelegramMessageNotModifiedError(err),
        ),
      requestPlain: (retryLabel) =>
        requestWithEditShouldLog(
          () => api.editMessageCaption(chatId, messageId, plainCaptionParams),
          retryLabel,
          (plainErr) => !isTelegramMessageNotModifiedError(plainErr),
        ),
    });
  try {
    const editMode = opts.editMode ?? "text";
    if (editMode === "caption") await performCaptionEdit();
    else
      try {
        await performTextEdit();
      } catch (err) {
        if (editMode === "auto" && isTelegramMessageHasNoTextError(err)) await performCaptionEdit();
        else throw err;
      }
  } catch (err) {
    if (isTelegramMessageNotModifiedError(err)) {
    } else throw err;
  }
  logVerbose(`[telegram] Edited message ${messageId} in chat ${chatId}`);
  return {
    ok: true,
    messageId: String(messageId),
    chatId,
  };
}
function inferFilename(kind) {
  switch (kind) {
    case "image":
      return "image.jpg";
    case "video":
      return "video.mp4";
    case "audio":
      return "audio.ogg";
    default:
      return "file.bin";
  }
}
/**
 * Send a sticker to a Telegram chat by file_id.
 * @param to - Chat ID or username (e.g., "123456789" or "@username")
 * @param fileId - Telegram file_id of the sticker to send
 * @param opts - Optional configuration
 */
async function sendStickerTelegram(to, fileId, opts) {
  if (!fileId?.trim()) throw new Error("Telegram sticker file_id is required");
  const context = resolveTelegramApiContext(opts);
  return withTelegramApiContextLease(
    context,
    sendStickerTelegramWithContext(to, fileId, opts, context),
  );
}
async function sendStickerTelegramWithContext(to, fileId, opts, context) {
  const { cfg, account, api } = context;
  const target = parseTelegramTarget(to);
  const chatId = await resolveAndPersistChatId({
    cfg,
    api,
    lookupTarget: target.chatId,
    persistTarget: to,
    verbose: opts.verbose,
    gatewayClientScopes: opts.gatewayClientScopes,
  });
  const threadParams = buildTelegramThreadReplyParams({
    thread: resolveTelegramSendThreadSpec({
      targetMessageThreadId: target.messageThreadId,
      messageThreadId: opts.messageThreadId,
      chatType: target.chatType,
    }),
    replyToMessageId: opts.replyToMessageId,
  });
  const hasThreadParams = Object.keys(threadParams).length > 0;
  const requestWithChatNotFound = createRequestWithChatNotFound({
    requestWithDiag: createTelegramNonIdempotentRequestWithDiag({
      cfg,
      account,
      retry: opts.retry,
      verbose: opts.verbose,
      useApiErrorLogging: false,
    }),
    chatId,
    input: to,
  });
  const stickerParams = hasThreadParams ? threadParams : void 0;
  const result = await requestWithChatNotFound(
    () => api.sendSticker(chatId, fileId.trim(), stickerParams),
    "sticker",
  );
  const messageId = resolveTelegramMessageIdOrThrow(result, "sticker send");
  const resolvedChatId = String(result?.chat?.id ?? chatId);
  recordSentMessage(chatId, messageId, opts.cfg);
  recordChannelActivity({
    channel: "telegram",
    accountId: account.accountId,
    direction: "outbound",
  });
  return {
    messageId: String(messageId),
    chatId: resolvedChatId,
  };
}
/**
 * Send a poll to a Telegram chat.
 * @param to - Chat ID or username (e.g., "123456789" or "@username")
 * @param poll - Poll input with question, options, maxSelections, and optional durationHours
 * @param opts - Optional configuration
 */
async function sendPollTelegram(to, poll, opts) {
  const context = resolveTelegramApiContext(opts);
  return withTelegramApiContextLease(context, sendPollTelegramWithContext(to, poll, opts, context));
}
async function sendPollTelegramWithContext(to, poll, opts, context) {
  const { cfg, account, api } = context;
  const target = parseTelegramTarget(to);
  const chatId = await resolveAndPersistChatId({
    cfg,
    api,
    lookupTarget: target.chatId,
    persistTarget: to,
    verbose: opts.verbose,
    gatewayClientScopes: opts.gatewayClientScopes,
  });
  const normalizedPoll = normalizePollInput(poll, { maxOptions: 12 });
  const threadParams = buildTelegramThreadReplyParams({
    thread: resolveTelegramSendThreadSpec({
      targetMessageThreadId: target.messageThreadId,
      messageThreadId: opts.messageThreadId,
      chatType: target.chatType,
    }),
    replyToMessageId: opts.replyToMessageId,
  });
  const pollOptions = normalizedPoll.options;
  const requestWithChatNotFound = createRequestWithChatNotFound({
    requestWithDiag: createTelegramNonIdempotentRequestWithDiag({
      cfg,
      account,
      retry: opts.retry,
      verbose: opts.verbose,
    }),
    chatId,
    input: to,
  });
  const durationSeconds = normalizedPoll.durationSeconds;
  if (durationSeconds === void 0 && normalizedPoll.durationHours !== void 0)
    throw new Error(
      "Telegram poll durationHours is not supported. Use durationSeconds (5-600) instead.",
    );
  if (durationSeconds !== void 0 && (durationSeconds < 5 || durationSeconds > 600))
    throw new Error("Telegram poll durationSeconds must be between 5 and 600");
  const pollParams = {
    allows_multiple_answers: normalizedPoll.maxSelections > 1,
    is_anonymous: opts.isAnonymous ?? true,
    ...(durationSeconds !== void 0 ? { open_period: durationSeconds } : {}),
    ...(Object.keys(threadParams).length > 0 ? threadParams : {}),
    ...(opts.silent === true ? { disable_notification: true } : {}),
  };
  const result = await requestWithChatNotFound(
    () => api.sendPoll(chatId, normalizedPoll.question, pollOptions, pollParams),
    "poll",
  );
  const messageId = resolveTelegramMessageIdOrThrow(result, "poll send");
  const resolvedChatId = String(result?.chat?.id ?? chatId);
  const pollId = result?.poll?.id;
  recordSentMessage(chatId, messageId, opts.cfg);
  recordChannelActivity({
    channel: "telegram",
    accountId: account.accountId,
    direction: "outbound",
  });
  return {
    messageId: String(messageId),
    chatId: resolvedChatId,
    pollId,
  };
}
/**
 * Create a forum topic in a Telegram supergroup.
 * Requires the bot to have `can_manage_topics` permission.
 *
 * @param chatId - Supergroup chat ID
 * @param name - Topic name (1-128 characters)
 * @param opts - Optional configuration
 */
async function createForumTopicTelegram(chatId, name, opts) {
  if (!name?.trim()) throw new Error("Forum topic name is required");
  if (name.trim().length > 128) throw new Error("Forum topic name must be 128 characters or fewer");
  const context = resolveTelegramApiContext(opts);
  return withTelegramApiContextLease(
    context,
    createForumTopicTelegramWithContext(chatId, name, opts, context),
  );
}
async function createForumTopicTelegramWithContext(chatId, name, opts, context) {
  const trimmedName = name.trim();
  const { cfg, account, api } = context;
  const normalizedChatId = await resolveAndPersistChatId({
    cfg,
    api,
    lookupTarget: parseTelegramTarget(chatId).chatId,
    persistTarget: chatId,
    verbose: opts.verbose,
    gatewayClientScopes: opts.gatewayClientScopes,
  });
  const requestWithDiag = createTelegramNonIdempotentRequestWithDiag({
    cfg,
    account,
    retry: opts.retry,
    verbose: opts.verbose,
  });
  const extra = {};
  if (opts.iconColor != null) extra.icon_color = opts.iconColor;
  if (opts.iconCustomEmojiId?.trim()) extra.icon_custom_emoji_id = opts.iconCustomEmojiId.trim();
  const hasExtra = Object.keys(extra).length > 0;
  const result = await requestWithDiag(
    () => api.createForumTopic(normalizedChatId, trimmedName, hasExtra ? extra : void 0),
    "createForumTopic",
  );
  const topicId = result.message_thread_id;
  recordChannelActivity({
    channel: "telegram",
    accountId: account.accountId,
    direction: "outbound",
  });
  return {
    topicId,
    name: result.name ?? trimmedName,
    chatId: normalizedChatId,
  };
}
//#endregion
export {
  splitTelegramCaption as $,
  splitTelegramRichMarkdownChunks as A,
  buildTelegramSelfSenderName as B,
  buildTelegramRichHtml as C,
  buildTelegramRichMessagePlan as D,
  buildTelegramRichMarkdownPlan as E,
  getTelegramNativeQuoteReplyMessageId as F,
  recordTelegramGroupHistoryEntry as G,
  isTelegramHistoryEntryAfterAmbientWatermark as H,
  isTelegramQuoteParamError as I,
  asTelegramClientFetch as J,
  retainTelegramGroupHistoryPromptContext as K,
  removeTelegramNativeQuoteParam as L,
  toTelegramRichMessageContextParams as M,
  TELEGRAM_OUTBOUND_RETRY_AFTER_CAP_MS as N,
  getTelegramRichRawApi as O,
  buildTelegramSendParams as P,
  resolveTelegramOutboundClientTimeoutFloorSeconds as Q,
  recordOutboundMessageForPromptContext as R,
  TELEGRAM_RICH_TEXT_LIMIT as S,
  buildTelegramRichMarkdown as T,
  isTelegramSelfSenderName as U,
  isTelegramChatWindowPromptContext as V,
  mergeTelegramGroupHistoryPromptContext as W,
  resolveTelegramClientTimeoutMinimumSeconds as X,
  createTelegramClientFetch as Y,
  resolveTelegramClientTimeoutSeconds as Z,
  resolveTelegramVoiceSend as _,
  editMessageTelegram as a,
  splitTelegramPlainTextChunks as b,
  renameForumTopicTelegram as c,
  sendMessageTelegram as d,
  withTelegramApiErrorLogging as et,
  sendPollTelegram as f,
  unpinMessageTelegram as g,
  splitTelegramPlainTextChunksForTests as h,
  editMessageReplyMarkupTelegram as i,
  sequentialize as it,
  splitTelegramRichMessageTextChunks as j,
  removeTelegramRichNativeQuoteParam as k,
  resetTelegramClientOptionsCacheForTests as l,
  sendTypingTelegram as m,
  deleteMessageTelegram as n,
  Bot$1 as nt,
  pinMessageTelegram as o,
  sendStickerTelegram as p,
  selectTelegramGroupHistoryAfterLastSelf as q,
  editForumTopicTelegram as r,
  apiThrottler as rt,
  reactMessageTelegram as s,
  createForumTopicTelegram as t,
  getOrCreateAccountThrottler as tt,
  sendLocationTelegram as u,
  buildTelegramPlainFallbackPlan as v,
  buildTelegramRichHtmlPlan as w,
  warnTelegramRichHtmlDegradations as x,
  isTelegramHtmlParseError as y,
  registerTelegramOutboundGroupHistoryRecorder as z,
};
