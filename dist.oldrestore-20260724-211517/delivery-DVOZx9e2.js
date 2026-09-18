import { GrammyError, InputFile } from "grammy";
import { n as resolveTelegramInlineButtons } from "./button-types-B6rcRmmv.js";
import { i as chunkMarkdownTextWithMode } from "./chunk-DtO_2oor.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { r as logVerbose, t as danger } from "./globals-CNUzHTcU.js";
import { t as getGlobalHookRunner, u as fireAndForgetHook } from "./hook-runner-global-CPEPIvCK.js";
import { t as buildInlineKeyboard } from "./inline-keyboard-aDe2_Kii.js";
import {
  n as canonicalizeTelegramPresentationPayload,
  r as resolveTelegramInteractiveTextFallback,
} from "./interactive-fallback-DyphsAa-.js";
import {
  m as triggerInternalHook,
  n as createInternalHookEvent,
} from "./internal-hooks-CckLIOgu.js";
import { t as buildOutboundMediaLoadOptions } from "./load-options-VzbF4ozo.js";
import { n as probeVideoDimensions } from "./media-services-Czws84B5.js";
import {
  a as toInternalMessageSentContext,
  d as toPluginMessageSentEvent,
  l as toPluginMessageContext,
  t as buildCanonicalSentMessageHookContext,
} from "./message-hook-mappers-D15eDaaQ.js";
import { c as kindFromMime, s as isGifMedia } from "./mime-BSEMEb3s.js";
import "./media-runtime-BhmZORKM.js";
import "./runtime-env-D0V-7Gqz.js";
import {
  r as isSafeToRetrySendError,
  u as isTelegramRateLimitError,
} from "./network-errors-CFprAVtH.js";
import "./reply-reference-BM3zoGu5.js";
import "./reply-chunking-aJZ4F_cw.js";
import "./channel-outbound-DlkFd7rO.js";
import "./web-media-Cv2iCdbz.js";
import { l as normalizeMessagePresentation } from "./payload-BFbDi85B.js";
import "./ssrf-runtime-DJ478vv8.js";
import "./plugin-runtime-Cwru8G47.js";
import "./hook-runtime-DXX5EQWy.js";
import "./retry-runtime-DCStwGTN.js";
import {
  a as projectOutboundPayloadPlanForDelivery,
  t as createOutboundPayloadPlan,
} from "./payloads-BRNPux3W.js";
import { n as isSingleUseReplyToMode } from "./reply-reference-CblWzjbF.js";
import { n as createChannelApiRetryRunner } from "./retry-policy-ib5882j9.js";
import {
  $ as splitTelegramCaption,
  D as buildTelegramRichMessagePlan,
  F as getTelegramNativeQuoteReplyMessageId,
  I as isTelegramQuoteParamError,
  L as removeTelegramNativeQuoteParam,
  M as toTelegramRichMessageContextParams,
  N as TELEGRAM_OUTBOUND_RETRY_AFTER_CAP_MS,
  O as getTelegramRichRawApi,
  P as buildTelegramSendParams,
  S as TELEGRAM_RICH_TEXT_LIMIT,
  _ as resolveTelegramVoiceSend,
  et as withTelegramApiErrorLogging,
  j as splitTelegramRichMessageTextChunks,
  k as removeTelegramRichNativeQuoteParam,
  s as reactMessageTelegram,
  v as buildTelegramPlainFallbackPlan,
  x as warnTelegramRichHtmlDegradations,
  y as isTelegramHtmlParseError,
} from "./send-CfVpuwvn.js";
import {
  U as resolveTelegramReplyId,
  ct as markdownToTelegramChunks,
  gt as wrapFileReferencesInHtml,
  ht as telegramHtmlToPlainTextFallback,
  lt as markdownToTelegramHtml,
  mt as splitTelegramHtmlChunks,
  pt as renderTelegramHtmlText,
} from "./sent-message-cache-D-3cw6_g.js";
import { n as loadWebMedia } from "./web-media-3hQ71Ejp.js";
//#region extensions/telegram/src/bot/delivery.send.ts
const EMPTY_TEXT_ERR_RE = /message text is empty/i;
function createTelegramDeliverySendRetry() {
  return createChannelApiRetryRunner({
    shouldRetry: (err) => isSafeToRetrySendError(err) || isTelegramRateLimitError(err),
    strictShouldRetry: true,
    retryAfterMaxDelayMs: TELEGRAM_OUTBOUND_RETRY_AFTER_CAP_MS,
  });
}
async function sendTelegramWithThreadFallback(params) {
  const hasNativeQuote = getTelegramNativeQuoteReplyMessageId(params.requestParams) != null;
  const shouldSuppressFirstErrorLog = (err) => hasNativeQuote && isTelegramQuoteParamError(err);
  const mergedShouldLog = params.shouldLog
    ? (err) => params.shouldLog(err) && !shouldSuppressFirstErrorLog(err)
    : (err) => !shouldSuppressFirstErrorLog(err);
  const requestWithRetry = createTelegramDeliverySendRetry();
  const runLoggedSend = (operation, requestParams, shouldLog) =>
    withTelegramApiErrorLogging({
      operation,
      runtime: params.runtime,
      ...(shouldLog ? { shouldLog } : {}),
      fn: () => requestWithRetry(() => params.send(requestParams), operation),
    });
  try {
    return await runLoggedSend(params.operation, params.requestParams, mergedShouldLog);
  } catch (err) {
    if (hasNativeQuote && isTelegramQuoteParamError(err)) {
      params.runtime.log?.(
        `telegram ${params.operation}: native quote rejected; retrying with legacy reply_to_message_id`,
      );
      return await sendTelegramWithThreadFallback({
        ...params,
        operation: `${params.operation} (legacy reply retry)`,
        requestParams: (params.removeNativeQuoteParam ?? removeTelegramNativeQuoteParam)(
          params.requestParams,
        ),
      });
    }
    throw err;
  }
}
async function sendTelegramText(bot, chatId, text, runtime, opts) {
  const baseParams = buildTelegramSendParams({
    replyToMessageId: opts?.replyToMessageId,
    replyQuoteMessageId: opts?.replyQuoteMessageId,
    replyQuoteText: opts?.replyQuoteText,
    replyQuotePosition: opts?.replyQuotePosition,
    replyQuoteEntities: opts?.replyQuoteEntities,
    thread: opts?.thread,
    silent: opts?.silent,
  });
  const textMode = opts?.textMode ?? "markdown";
  const linkPreviewOptions = (opts?.linkPreview ?? true) ? void 0 : { is_disabled: true };
  const htmlText = textMode === "html" ? text : markdownToTelegramHtml(text);
  const fallbackText = opts?.plainText ?? text;
  const hasFallbackText = fallbackText.trim().length > 0;
  const sendPlainFallback = async (plainText = fallbackText) => {
    const res = await sendTelegramWithThreadFallback({
      operation: "sendMessage",
      runtime,
      thread: opts?.thread,
      requestParams: baseParams,
      send: (effectiveParams) =>
        bot.api.sendMessage(chatId, plainText, {
          ...(linkPreviewOptions ? { link_preview_options: linkPreviewOptions } : {}),
          ...(opts?.replyMarkup ? { reply_markup: opts.replyMarkup } : {}),
          ...effectiveParams,
        }),
    });
    runtime.log?.(`telegram sendMessage ok chat=${chatId} message=${res.message_id} (plain)`);
    return res.message_id;
  };
  if (opts?.richMessages === true) {
    const richPlan = buildTelegramRichMessagePlan(text, textMode, {
      skipEntityDetection: opts.linkPreview === false,
      tableMode: opts.tableMode,
    });
    warnTelegramRichHtmlDegradations({
      context: "sendRichMessage",
      reasons: richPlan.degradationReasons,
      warn: (message) => runtime.log?.(message),
    });
    if (!richPlan.richMessage.html?.trim()) {
      if (!hasFallbackText)
        throw new Error(
          "telegram sendRichMessage failed: empty rich text and empty plain fallback",
        );
      runtime.log?.("telegram sendRichMessage rendered empty; falling back to plain text");
      return await sendPlainFallback();
    }
    try {
      const res = await sendTelegramWithThreadFallback({
        operation: "sendRichMessage",
        runtime,
        thread: opts.thread,
        requestParams: toTelegramRichMessageContextParams(baseParams),
        removeNativeQuoteParam: removeTelegramRichNativeQuoteParam,
        send: (effectiveParams) =>
          getTelegramRichRawApi(bot.api).sendRichMessage({
            chat_id: chatId,
            rich_message: richPlan.richMessage,
            ...(opts.replyMarkup ? { reply_markup: opts.replyMarkup } : {}),
            ...effectiveParams,
          }),
      });
      runtime.log?.(`telegram sendRichMessage ok chat=${chatId} message=${res.message_id}`);
      return res.message_id;
    } catch (err) {
      const fallbackPlan = buildTelegramPlainFallbackPlan({
        html: richPlan.richMessage.html,
        err,
        context: "sendRichMessage",
        warn: (message) => runtime.log?.(message),
      });
      if (!fallbackPlan || !hasFallbackText) throw err;
      return await sendPlainFallback(fallbackPlan.plainText);
    }
  }
  if (!htmlText.trim()) {
    if (!hasFallbackText)
      throw new Error("telegram sendMessage failed: empty formatted text and empty plain fallback");
    return await sendPlainFallback();
  }
  try {
    const res = await sendTelegramWithThreadFallback({
      operation: "sendMessage",
      runtime,
      thread: opts?.thread,
      requestParams: baseParams,
      shouldLog: (err) => {
        const errText = formatErrorMessage(err);
        return !isTelegramHtmlParseError(err) && !EMPTY_TEXT_ERR_RE.test(errText);
      },
      send: (effectiveParams) =>
        bot.api.sendMessage(chatId, htmlText, {
          parse_mode: "HTML",
          ...(linkPreviewOptions ? { link_preview_options: linkPreviewOptions } : {}),
          ...(opts?.replyMarkup ? { reply_markup: opts.replyMarkup } : {}),
          ...effectiveParams,
        }),
    });
    runtime.log?.(`telegram sendMessage ok chat=${chatId} message=${res.message_id}`);
    return res.message_id;
  } catch (err) {
    const errText = formatErrorMessage(err);
    if (isTelegramHtmlParseError(err) || EMPTY_TEXT_ERR_RE.test(errText)) {
      if (!hasFallbackText) throw err;
      runtime.log?.(`telegram formatted send failed; retrying without formatting: ${errText}`);
      return await sendPlainFallback();
    }
    throw err;
  }
}
//#endregion
//#region extensions/telegram/src/bot/reply-threading.ts
function resolveReplyToForSend(params) {
  return params.replyToId && (params.replyToMode === "all" || !params.progress.hasReplied)
    ? params.replyToId
    : void 0;
}
function markReplyApplied(progress, replyToId) {
  if (replyToId && !progress.hasReplied) progress.hasReplied = true;
}
function markDelivered$1(progress) {
  progress.hasDelivered = true;
}
async function sendChunkedTelegramReplyText(params) {
  const applyDelivered = params.markDelivered ?? markDelivered$1;
  const suppressSingleUseReply =
    params.chunks.length > 1 && isSingleUseReplyToMode(params.replyToMode);
  for (let i = 0; i < params.chunks.length; i += 1) {
    const chunk = params.chunks[i];
    if (!chunk) continue;
    const isFirstChunk = i === 0;
    const replyToMessageId = suppressSingleUseReply
      ? void 0
      : resolveReplyToForSend({
          replyToId: params.replyToId,
          replyToMode: params.replyToMode,
          progress: params.progress,
        });
    const shouldAttachQuote =
      Boolean(replyToMessageId) &&
      Boolean(params.replyQuoteText) &&
      (params.quoteOnlyOnFirstChunk !== true || isFirstChunk);
    await params.sendChunk({
      chunk,
      isFirstChunk,
      replyToMessageId,
      replyMarkup: isFirstChunk ? params.replyMarkup : void 0,
      replyQuoteText: shouldAttachQuote ? params.replyQuoteText : void 0,
    });
    markReplyApplied(
      params.progress,
      suppressSingleUseReply && isFirstChunk ? params.replyToId : replyToMessageId,
    );
    applyDelivered(params.progress);
  }
}
//#endregion
//#region extensions/telegram/src/bot/delivery.replies.ts
const VOICE_FORBIDDEN_MARKER = "VOICE_MESSAGES_FORBIDDEN";
const CAPTION_TOO_LONG_RE = /caption is too long/i;
const GrammyErrorCtor = typeof GrammyError === "function" ? GrammyError : void 0;
function buildChunkTextResolver(params) {
  if (params.richMessages === true)
    return (text) =>
      splitTelegramRichMessageTextChunks({
        text,
        textLimit: Math.min(params.textLimit, TELEGRAM_RICH_TEXT_LIMIT),
        textMode: params.textMode ?? "markdown",
        chunkMode: params.chunkMode,
        tableMode: params.tableMode,
        skipEntityDetection: params.skipEntityDetection,
      });
  if (params.textMode === "html")
    return (html) =>
      splitTelegramHtmlChunks(html, params.textLimit).map((text) => ({
        text,
        plainText: telegramHtmlToPlainTextFallback(text),
        textMode: "html",
      }));
  return (markdown) => {
    const markdownChunks =
      params.chunkMode === "newline"
        ? chunkMarkdownTextWithMode(markdown, params.textLimit, params.chunkMode)
        : [markdown];
    const chunks = [];
    for (const chunk of markdownChunks) {
      const nested = markdownToTelegramChunks(chunk, params.textLimit, {
        tableMode: params.tableMode,
      });
      if (!nested.length && chunk) {
        chunks.push({
          html: wrapFileReferencesInHtml(
            markdownToTelegramHtml(chunk, {
              tableMode: params.tableMode,
              wrapFileRefs: false,
            }),
          ),
          text: chunk,
        });
        continue;
      }
      chunks.push(...nested);
    }
    return chunks.map((chunk) => ({
      text: chunk.html,
      plainText: chunk.text,
      textMode: "html",
    }));
  };
}
function markDelivered(progress) {
  progress.hasDelivered = true;
  progress.deliveredCount += 1;
}
function filterEmptyTelegramTextChunks(chunks) {
  return chunks.filter((chunk) => chunk.text.trim().length > 0);
}
function resolveReplyQuoteForSend(params) {
  if (params.replyToId != null) {
    const mapped = params.replyQuoteByMessageId?.[String(params.replyToId)];
    if (mapped?.text) {
      const quote = {
        messageId: params.replyToId,
        text: mapped.text,
      };
      if (typeof mapped.position === "number") quote.position = mapped.position;
      if (mapped.entities) quote.entities = mapped.entities;
      return quote;
    }
  }
  const quote = {};
  if (params.replyQuoteMessageId != null) quote.messageId = params.replyQuoteMessageId;
  if (params.replyQuoteText != null) quote.text = params.replyQuoteText;
  if (params.replyQuotePosition != null) quote.position = params.replyQuotePosition;
  if (params.replyQuoteEntities != null) quote.entities = params.replyQuoteEntities;
  return quote;
}
async function deliverTextReply(params) {
  let firstDeliveredMessageId;
  await sendChunkedTelegramReplyText({
    chunks: filterEmptyTelegramTextChunks(params.chunkText(params.text)),
    progress: params.progress,
    replyToId: params.replyToId,
    replyToMode: params.replyToMode,
    replyMarkup: params.replyMarkup,
    replyQuoteText: params.replyQuoteText,
    quoteOnlyOnFirstChunk: params.quoteOnlyOnFirstChunk,
    markDelivered,
    sendChunk: async ({ chunk, isFirstChunk, replyToMessageId, replyMarkup, replyQuoteText }) => {
      const includeQuoteMetadata = params.quoteOnlyOnFirstChunk !== true || isFirstChunk;
      const messageId = await sendTelegramText(
        params.bot,
        params.chatId,
        chunk.text,
        params.runtime,
        {
          replyToMessageId,
          replyQuoteMessageId: includeQuoteMetadata ? params.replyQuoteMessageId : void 0,
          replyQuoteText,
          replyQuotePosition: includeQuoteMetadata ? params.replyQuotePosition : void 0,
          replyQuoteEntities: includeQuoteMetadata ? params.replyQuoteEntities : void 0,
          thread: params.thread,
          textMode: chunk.textMode,
          plainText: chunk.plainText,
          richMessages: params.richMessages,
          linkPreview: params.linkPreview,
          tableMode: params.tableMode,
          silent: params.silent,
          replyMarkup,
        },
      );
      if (firstDeliveredMessageId == null) firstDeliveredMessageId = messageId;
      await params.progress.promptContext?.accept({
        messageId,
        text: chunk.plainText,
      });
    },
  });
  return firstDeliveredMessageId;
}
function isVoiceMessagesForbidden(err) {
  if (GrammyErrorCtor && err instanceof GrammyErrorCtor)
    return err.description.includes(VOICE_FORBIDDEN_MARKER);
  return formatErrorMessage(err).includes(VOICE_FORBIDDEN_MARKER);
}
function isCaptionTooLong(err) {
  if (GrammyErrorCtor && err instanceof GrammyErrorCtor)
    return CAPTION_TOO_LONG_RE.test(err.description);
  return CAPTION_TOO_LONG_RE.test(formatErrorMessage(err));
}
function resolveVoiceFallbackText(reply) {
  if (reply.text?.trim()) return reply.text;
  if (reply.spokenText?.trim()) return reply.spokenText;
}
function buildPlainCaptionParams(mediaParams, plainCaption) {
  const nextParams = {
    ...mediaParams,
    caption: plainCaption,
  };
  delete nextParams.parse_mode;
  return nextParams;
}
async function sendTelegramCaptionedMediaWithFallback(params) {
  const sendMedia = (requestParams, shouldLog) =>
    sendTelegramWithThreadFallback({
      operation: params.operation,
      runtime: params.runtime,
      thread: params.thread,
      requestParams,
      ...(shouldLog ? { shouldLog } : {}),
      send: params.send,
    });
  if (!params.plainCaption) return await sendMedia(params.requestParams);
  try {
    return await sendMedia(
      params.requestParams,
      (err) => !isTelegramHtmlParseError(err) && (params.shouldLog ? params.shouldLog(err) : true),
    );
  } catch (err) {
    if (!isTelegramHtmlParseError(err)) throw err;
    logVerbose(
      `telegram ${params.operation} caption HTML rejected; retrying as plain caption: ${formatErrorMessage(err)}`,
    );
    return await sendMedia(buildPlainCaptionParams(params.requestParams, params.plainCaption));
  }
}
async function deliverMediaReply(params) {
  let firstDeliveredMessageId;
  let visibleFallbackText;
  let first = true;
  let pendingFollowUpText;
  const recordPromptContextMessage = async (message, text) => {
    const promptContextMessage = {
      messageId: message.message_id,
      message,
      ...(text ? { text } : {}),
    };
    await params.progress.promptContext?.accept(promptContextMessage);
  };
  const deliverAcceptedMedia = async (options) => {
    const message = await sendTelegramCaptionedMediaWithFallback({
      ...options,
      runtime: params.runtime,
      thread: params.thread,
    });
    firstDeliveredMessageId ??= message.message_id;
    await recordPromptContextMessage(message, options.text);
    markDelivered(params.progress);
  };
  const createVoiceFallbackProgress = () => ({
    hasReplied: false,
    hasDelivered: false,
    deliveredCount: 0,
    ...(params.progress.promptContext ? { promptContext: params.progress.promptContext } : {}),
  });
  for (const mediaUrl of params.mediaList) {
    const isFirstMedia = first;
    const media = await params.mediaLoader(
      mediaUrl,
      buildOutboundMediaLoadOptions({
        mediaLocalRoots: params.mediaLocalRoots,
        maxBytes: params.mediaMaxBytes,
      }),
    );
    const kind = kindFromMime(media.contentType ?? void 0);
    const isGif = isGifMedia({
      contentType: media.contentType,
      fileName: media.fileName,
    });
    const fileName = media.fileName ?? (isGif ? "animation.gif" : "file");
    const file = new InputFile(media.buffer, fileName);
    const { caption, followUpText } = splitTelegramCaption(
      isFirstMedia ? (params.reply.text ?? void 0) : void 0,
    );
    const htmlCaption = caption
      ? params.textMode === "html"
        ? caption
        : renderTelegramHtmlText(caption, { tableMode: params.tableMode })
      : void 0;
    const plainCaption =
      caption && params.textMode === "html" ? telegramHtmlToPlainTextFallback(caption) : caption;
    if (followUpText) pendingFollowUpText = followUpText;
    first = false;
    const replyToMessageId = resolveReplyToForSend({
      replyToId: params.replyToId,
      replyToMode: params.replyToMode,
      progress: params.progress,
    });
    const shouldAttachButtonsToMedia = isFirstMedia && params.replyMarkup && !followUpText;
    const videoDimensions = kind === "video" ? await probeVideoDimensions(media.buffer) : void 0;
    const mediaParams = {
      caption: htmlCaption,
      ...(htmlCaption ? { parse_mode: "HTML" } : {}),
      ...(shouldAttachButtonsToMedia ? { reply_markup: params.replyMarkup } : {}),
      ...(videoDimensions
        ? {
            width: videoDimensions.width,
            height: videoDimensions.height,
          }
        : {}),
      ...buildTelegramSendParams({
        replyToMessageId,
        replyQuoteMessageId: params.replyQuoteMessageId,
        replyQuoteText: params.replyQuoteText,
        replyQuotePosition: params.replyQuotePosition,
        replyQuoteEntities: params.replyQuoteEntities,
        thread: params.thread,
        silent: params.silent,
      }),
    };
    if (isGif)
      await deliverAcceptedMedia({
        operation: "sendAnimation",
        requestParams: mediaParams,
        plainCaption,
        text: plainCaption,
        send: (effectiveParams) =>
          params.bot.api.sendAnimation(params.chatId, file, { ...effectiveParams }),
      });
    else if (kind === "image")
      await deliverAcceptedMedia({
        operation: "sendPhoto",
        requestParams: mediaParams,
        plainCaption,
        text: plainCaption,
        send: (effectiveParams) =>
          params.bot.api.sendPhoto(params.chatId, file, { ...effectiveParams }),
      });
    else if (kind === "video")
      await deliverAcceptedMedia({
        operation: "sendVideo",
        requestParams: mediaParams,
        plainCaption,
        text: plainCaption,
        send: (effectiveParams) =>
          params.bot.api.sendVideo(params.chatId, file, { ...effectiveParams }),
      });
    else if (kind === "audio") {
      const { useVoice } = resolveTelegramVoiceSend({
        wantsVoice: params.reply.audioAsVoice === true,
        contentType: media.contentType,
        fileName,
        logFallback: logVerbose,
      });
      if (useVoice) {
        const sendVoiceMedia = async (requestParams, shouldLog) => {
          const hasCaption = typeof requestParams.caption === "string";
          await deliverAcceptedMedia({
            operation: "sendVoice",
            requestParams,
            plainCaption: hasCaption ? plainCaption : void 0,
            text: hasCaption ? plainCaption : void 0,
            shouldLog,
            send: (effectiveParams) =>
              params.bot.api.sendVoice(params.chatId, file, { ...effectiveParams }),
          });
        };
        await params.onVoiceRecording?.();
        try {
          await sendVoiceMedia(mediaParams, (err) => !isVoiceMessagesForbidden(err));
        } catch (voiceErr) {
          if (isVoiceMessagesForbidden(voiceErr)) {
            const fallbackText = resolveVoiceFallbackText(params.reply);
            if (!fallbackText || !fallbackText.trim()) throw voiceErr;
            logVerbose(
              "telegram sendVoice forbidden (recipient has voice messages blocked in privacy settings); falling back to text",
            );
            const voiceFallbackReplyTo = resolveReplyToForSend({
              replyToId: params.replyToId,
              replyToMode: params.replyToMode,
              progress: params.progress,
            });
            const fallbackMessageId = await deliverTextReply({
              bot: params.bot,
              chatId: params.chatId,
              runtime: params.runtime,
              text: fallbackText,
              chunkText: params.chunkText,
              replyToId: voiceFallbackReplyTo,
              replyQuoteMessageId: params.replyQuoteMessageId,
              replyQuotePosition: params.replyQuotePosition,
              replyQuoteEntities: params.replyQuoteEntities,
              thread: params.thread,
              richMessages: params.richMessages,
              tableMode: params.tableMode,
              linkPreview: params.linkPreview,
              silent: params.silent,
              replyMarkup: params.replyMarkup,
              replyQuoteText: params.replyQuoteText,
              replyToMode: params.replyToMode,
              progress: createVoiceFallbackProgress(),
              quoteOnlyOnFirstChunk: true,
            });
            if (firstDeliveredMessageId == null) firstDeliveredMessageId = fallbackMessageId;
            visibleFallbackText = fallbackText;
            markReplyApplied(params.progress, voiceFallbackReplyTo);
            markDelivered(params.progress);
            continue;
          }
          if (isCaptionTooLong(voiceErr)) {
            logVerbose(
              "telegram sendVoice caption too long; resending voice without caption + text separately",
            );
            const noCaptionParams = { ...mediaParams };
            delete noCaptionParams.caption;
            delete noCaptionParams.parse_mode;
            await sendVoiceMedia(noCaptionParams);
            const fallbackText = resolveVoiceFallbackText(params.reply);
            if (fallbackText?.trim()) {
              await deliverTextReply({
                bot: params.bot,
                chatId: params.chatId,
                runtime: params.runtime,
                text: fallbackText,
                chunkText: params.chunkText,
                replyToId: void 0,
                thread: params.thread,
                richMessages: params.richMessages,
                tableMode: params.tableMode,
                linkPreview: params.linkPreview,
                silent: params.silent,
                replyMarkup: params.replyMarkup,
                replyToMode: "first",
                progress: createVoiceFallbackProgress(),
                quoteOnlyOnFirstChunk: true,
              });
              visibleFallbackText = fallbackText;
            }
            markReplyApplied(params.progress, replyToMessageId);
            continue;
          }
          throw voiceErr;
        }
      } else
        await deliverAcceptedMedia({
          operation: "sendAudio",
          requestParams: mediaParams,
          plainCaption,
          text: plainCaption,
          send: (effectiveParams) =>
            params.bot.api.sendAudio(params.chatId, file, { ...effectiveParams }),
        });
    } else
      await deliverAcceptedMedia({
        operation: "sendDocument",
        requestParams: mediaParams,
        plainCaption,
        text: plainCaption,
        send: (effectiveParams) =>
          params.bot.api.sendDocument(params.chatId, file, { ...effectiveParams }),
      });
    markReplyApplied(params.progress, replyToMessageId);
    if (pendingFollowUpText && isFirstMedia) {
      await deliverTextReply({
        bot: params.bot,
        chatId: params.chatId,
        runtime: params.runtime,
        thread: params.thread,
        chunkText: params.chunkText,
        text: pendingFollowUpText,
        replyMarkup: params.replyMarkup,
        richMessages: params.richMessages,
        tableMode: params.tableMode,
        linkPreview: params.linkPreview,
        silent: params.silent,
        replyToId: params.replyToId,
        replyToMode: params.replyToMode,
        progress: params.progress,
      });
      pendingFollowUpText = void 0;
    }
  }
  return {
    firstDeliveredMessageId,
    visibleFallbackText,
  };
}
async function maybePinFirstDeliveredMessage(params) {
  if (
    !(params.pin === true || (typeof params.pin === "object" && params.pin.enabled)) ||
    typeof params.firstDeliveredMessageId !== "number"
  )
    return;
  const notify = typeof params.pin === "object" && params.pin.notify === true;
  try {
    await params.bot.api.pinChatMessage(params.chatId, params.firstDeliveredMessageId, {
      disable_notification: !notify,
    });
  } catch (err) {
    logVerbose(
      `telegram pinChatMessage failed chat=${params.chatId} message=${params.firstDeliveredMessageId}: ${formatErrorMessage(err)}`,
    );
  }
}
function buildTelegramSentHookContext(params) {
  return buildCanonicalSentMessageHookContext({
    to: params.chatId,
    content: params.content,
    success: params.success,
    error: params.error,
    channelId: "telegram",
    accountId: params.accountId,
    conversationId: params.chatId,
    messageId: typeof params.messageId === "number" ? String(params.messageId) : void 0,
    isGroup: params.isGroup,
    groupId: params.groupId,
  });
}
function emitInternalMessageSentHook(params) {
  if (!params.sessionKeyForInternalHooks) return;
  const canonical = buildTelegramSentHookContext(params);
  fireAndForgetHook(
    triggerInternalHook(
      createInternalHookEvent(
        "message",
        "sent",
        params.sessionKeyForInternalHooks,
        toInternalMessageSentContext(canonical),
      ),
    ),
    "telegram: message:sent internal hook failed",
  );
}
function emitMessageSentHooks(params) {
  if (!params.enabled && !params.sessionKeyForInternalHooks) return;
  const canonical = buildTelegramSentHookContext(params);
  if (params.enabled)
    fireAndForgetHook(
      Promise.resolve(
        params.hookRunner.runMessageSent(
          toPluginMessageSentEvent(canonical),
          toPluginMessageContext(canonical),
        ),
      ),
      "telegram: message_sent plugin hook failed",
    );
  emitInternalMessageSentHook(params);
}
function emitTelegramMessageSentHooks(params) {
  const hookRunner = getGlobalHookRunner();
  emitMessageSentHooks({
    ...params,
    hookRunner,
    enabled: hookRunner?.hasHooks("message_sent") ?? false,
  });
}
async function deliverReplies(params) {
  const progress = {
    hasReplied: false,
    hasDelivered: false,
    deliveredCount: 0,
    ...(params.promptContextSequence ? { promptContext: params.promptContextSequence } : {}),
  };
  const mediaLoader = params.mediaLoader ?? loadWebMedia;
  const transcriptMirror = params.transcriptMirror;
  const deliveredContents = [];
  const hookRunner = getGlobalHookRunner();
  const hasMessageSendingHooks = hookRunner?.hasHooks("message_sending") ?? false;
  const hasMessageSentHooks = hookRunner?.hasHooks("message_sent") ?? false;
  const chunkText = buildChunkTextResolver({
    textLimit:
      params.richMessages === true
        ? Math.min(params.textLimit, TELEGRAM_RICH_TEXT_LIMIT)
        : Math.min(params.textLimit, 4e3),
    chunkMode: params.chunkMode ?? "length",
    tableMode: params.tableMode,
    richMessages: params.richMessages,
    skipEntityDetection: params.linkPreview === false,
    ...(params.textMode ? { textMode: params.textMode } : {}),
  });
  const candidateReplies = [];
  for (const reply of params.replies) {
    if (!reply || typeof reply !== "object") {
      params.runtime.error?.(danger("reply missing text/media"));
      continue;
    }
    candidateReplies.push(reply);
  }
  const normalizedReplies = projectOutboundPayloadPlanForDelivery(
    createOutboundPayloadPlan(candidateReplies, {
      cfg: params.cfg,
      sessionKey: params.policySessionKey ?? params.sessionKeyForInternalHooks,
      surface: "telegram",
    }),
  );
  for (const originalReply of normalizedReplies) {
    let reply = canonicalizeTelegramPresentationPayload(originalReply);
    const mediaList = reply?.mediaUrls?.length
      ? reply.mediaUrls
      : reply?.mediaUrl
        ? [reply.mediaUrl]
        : [];
    const hasMedia = mediaList.length > 0;
    const presentation = normalizeMessagePresentation(reply?.presentation);
    const interactive = reply?.interactive;
    const resolvedReplyText =
      resolveTelegramInteractiveTextFallback({
        text: reply?.text,
        interactive,
        presentation,
      }) ??
      reply?.text ??
      "";
    if (reply && resolvedReplyText !== (reply.text ?? ""))
      reply = {
        ...reply,
        text: resolvedReplyText,
      };
    const telegramData = reply.channelData?.telegram;
    const reactionEmoji =
      typeof telegramData?.reaction?.emoji === "string" ? telegramData.reaction.emoji : void 0;
    const replyToId =
      params.replyToMode === "off" ? void 0 : resolveTelegramReplyId(reply.replyToId);
    if (reactionEmoji && typeof replyToId !== "number") {
      params.runtime.error?.(danger("Telegram reaction requires a reply target"));
      continue;
    }
    if (!resolvedReplyText && !hasMedia && !reactionEmoji) {
      if (reply?.audioAsVoice) {
        logVerbose("telegram reply has audioAsVoice without media/text; skipping");
        continue;
      }
      params.runtime.error?.(danger("reply missing text/media"));
      continue;
    }
    const rawContent = resolvedReplyText;
    const spokenHookContent =
      !rawContent && reply.audioAsVoice === true && reply.spokenText?.trim()
        ? reply.spokenText
        : void 0;
    const hookContent = spokenHookContent ?? rawContent;
    const replyQuote = resolveReplyQuoteForSend({
      replyToId,
      replyQuoteByMessageId: params.replyQuoteByMessageId,
      replyQuoteMessageId: params.replyQuoteMessageId,
      replyQuoteText: params.replyQuoteText,
      replyQuotePosition: params.replyQuotePosition,
      replyQuoteEntities: params.replyQuoteEntities,
    });
    if (hasMessageSendingHooks) {
      const hookResult = await hookRunner?.runMessageSending(
        {
          to: params.chatId,
          content: hookContent,
          replyToId,
          threadId: params.thread?.id,
          metadata: {
            channel: "telegram",
            mediaUrls: mediaList,
            threadId: params.thread?.id,
          },
        },
        {
          channelId: "telegram",
          accountId: params.accountId,
          conversationId: params.chatId,
        },
      );
      if (hookResult?.cancel) continue;
      if (typeof hookResult?.content === "string" && hookResult.content !== hookContent) {
        progress.promptContext?.detach();
        reply = spokenHookContent
          ? {
              ...reply,
              spokenText: hookResult.content,
            }
          : {
              ...reply,
              text: hookResult.content,
            };
      }
    }
    let contentForSentHook =
      reply.text || (reply.audioAsVoice === true ? resolveVoiceFallbackText(reply) : "") || "";
    try {
      const deliveredCountBeforeReply = progress.deliveredCount;
      const replyMarkup = buildInlineKeyboard(
        resolveTelegramInlineButtons({
          buttons: telegramData?.buttons,
          presentation,
          interactive,
        }),
      );
      let firstDeliveredMessageId;
      if (reactionEmoji && typeof replyToId === "number") {
        const reactionResult = await reactMessageTelegram(params.chatId, replyToId, reactionEmoji, {
          cfg: params.cfg ?? { channels: { telegram: { botToken: params.token } } },
          token: params.token,
          accountId: params.accountId,
          api: params.bot.api,
          verbose: false,
        });
        if (reactionResult.ok) {
          progress.hasDelivered = true;
          progress.deliveredCount += 1;
        } else {
          params.runtime.error?.(danger(reactionResult.warning));
          continue;
        }
      }
      if (mediaList.length === 0 && resolvedReplyText)
        firstDeliveredMessageId = await deliverTextReply({
          bot: params.bot,
          chatId: params.chatId,
          runtime: params.runtime,
          thread: params.thread,
          chunkText,
          text: reply.text || "",
          replyMarkup,
          replyQuoteMessageId: replyQuote.messageId,
          replyQuoteText: replyQuote.text,
          replyQuotePosition: replyQuote.position,
          replyQuoteEntities: replyQuote.entities,
          richMessages: params.richMessages,
          tableMode: params.tableMode,
          linkPreview: params.linkPreview,
          silent: params.silent,
          replyToId,
          replyToMode: params.replyToMode,
          progress,
        });
      else if (mediaList.length > 0) {
        const mediaDelivery = await deliverMediaReply({
          reply,
          mediaList,
          bot: params.bot,
          chatId: params.chatId,
          runtime: params.runtime,
          thread: params.thread,
          tableMode: params.tableMode,
          richMessages: params.richMessages,
          mediaLocalRoots: params.mediaLocalRoots,
          mediaMaxBytes: params.mediaMaxBytes,
          chunkText,
          mediaLoader,
          onVoiceRecording: params.onVoiceRecording,
          linkPreview: params.linkPreview,
          silent: params.silent,
          replyQuoteMessageId: replyQuote.messageId,
          replyQuoteText: replyQuote.text,
          replyQuotePosition: replyQuote.position,
          replyQuoteEntities: replyQuote.entities,
          replyMarkup,
          replyToId,
          replyToMode: params.replyToMode,
          progress,
          ...(params.textMode ? { textMode: params.textMode } : {}),
        });
        firstDeliveredMessageId = mediaDelivery.firstDeliveredMessageId;
        if (mediaDelivery.visibleFallbackText)
          contentForSentHook = mediaDelivery.visibleFallbackText;
      }
      await maybePinFirstDeliveredMessage({
        pin: reply.delivery?.pin,
        bot: params.bot,
        chatId: params.chatId,
        runtime: params.runtime,
        firstDeliveredMessageId,
      });
      if (progress.deliveredCount > deliveredCountBeforeReply && transcriptMirror)
        deliveredContents.push({
          text: contentForSentHook,
          mediaUrls: mediaList,
        });
      emitMessageSentHooks({
        hookRunner,
        enabled: hasMessageSentHooks,
        sessionKeyForInternalHooks: params.sessionKeyForInternalHooks,
        chatId: params.chatId,
        accountId: params.accountId,
        content: contentForSentHook,
        success: progress.deliveredCount > deliveredCountBeforeReply,
        messageId: firstDeliveredMessageId,
        isGroup: params.mirrorIsGroup,
        groupId: params.mirrorGroupId,
      });
    } catch (error) {
      emitMessageSentHooks({
        hookRunner,
        enabled: hasMessageSentHooks,
        sessionKeyForInternalHooks: params.sessionKeyForInternalHooks,
        chatId: params.chatId,
        accountId: params.accountId,
        content: contentForSentHook,
        success: false,
        error: formatErrorMessage(error),
        isGroup: params.mirrorIsGroup,
        groupId: params.mirrorGroupId,
      });
      throw error;
    }
  }
  if (progress.hasDelivered && transcriptMirror) {
    const text = deliveredContents
      .map((content) => content.text)
      .filter(Boolean)
      .join("\n\n");
    const mediaUrls = deliveredContents.flatMap((content) => content.mediaUrls);
    if (text || mediaUrls.length > 0)
      try {
        await transcriptMirror({
          text: text || void 0,
          mediaUrls: mediaUrls.length > 0 ? mediaUrls : void 0,
        });
      } catch (mirrorErr) {
        logVerbose(`telegram transcriptMirror failed: ${formatErrorMessage(mirrorErr)}`);
      }
  }
  return { delivered: progress.hasDelivered };
}
//#endregion
export { emitInternalMessageSentHook as n, emitTelegramMessageSentHooks as r, deliverReplies as t };
