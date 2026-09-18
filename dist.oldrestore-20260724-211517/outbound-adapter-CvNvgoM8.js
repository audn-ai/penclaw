import { n as sanitizeAssistantVisibleText } from "./assistant-visible-text-DV1Yognj.js";
import { n as resolveTelegramInlineButtons } from "./button-types-B6rcRmmv.js";
import {
  i as createAttachedChannelResultAdapter,
  t as attachChannelToResult,
} from "./channel-send-result-Dn_C6AJS.js";
import { i as chunkMarkdownTextWithMode } from "./chunk-DtO_2oor.js";
import {
  n as canonicalizeTelegramPresentationPayload,
  r as resolveTelegramInteractiveTextFallback,
  t as TELEGRAM_PRESENTATION_CAPABILITIES,
} from "./interactive-fallback-DyphsAa-.js";
import "./text-chunking-Dr19ggf-.js";
import {
  m as resolveSendableOutboundReplyParts,
  y as sendPayloadMediaSequenceOrFallback,
} from "./reply-payload-DDwHXDkv.js";
import "./reply-reference-BM3zoGu5.js";
import "./reply-chunking-aJZ4F_cw.js";
import "./channel-outbound-DlkFd7rO.js";
import { n as isSingleUseReplyToMode } from "./reply-reference-CblWzjbF.js";
import { t as sanitizeForPlainText } from "./sanitize-text-BCxyPW9Z.js";
import { n as resolveOutboundSendDep } from "./send-deps-DjbvQHZ4.js";
import { t as loadTelegramSendModule } from "./send-runtime-yXUW08X7.js";
import {
  _ as createTelegramPromptContextProjectionCursor,
  bt as parseTelegramReplyToMessageId,
  mt as splitTelegramHtmlChunks,
  x as resolveTelegramPromptContextSource,
  xt as parseTelegramThreadId,
} from "./sent-message-cache-D-3cw6_g.js";
import {
  a as parseTelegramTarget,
  i as normalizeTelegramOutboundTarget,
} from "./targets-Cb32iLpC.js";
//#region extensions/telegram/src/outbound-adapter.ts
const TELEGRAM_TEXT_CHUNK_LIMIT = 4e3;
const TELEGRAM_POLL_OPTION_LIMIT = 12;
async function resolveDefaultTelegramSend(deps) {
  return (
    resolveOutboundSendDep(deps, "telegram") ?? (await loadTelegramSendModule()).sendMessageTelegram
  );
}
function chunkTelegramOutboundText(text, limit, ctx) {
  return ctx?.formatting?.parseMode === "HTML"
    ? splitTelegramHtmlChunks(text, limit)
    : chunkMarkdownTextWithMode(text, limit, ctx?.formatting?.chunkMode ?? "length");
}
async function resolveTelegramSendContext(params) {
  return {
    send: await params.resolveSend(params.deps),
    baseOpts: {
      verbose: false,
      cfg: params.cfg,
      messageThreadId: parseTelegramThreadId(params.threadId),
      replyToMessageId: parseTelegramReplyToMessageId(params.replyToId),
      ...(params.replyToIdSource !== void 0 ? { replyToIdSource: params.replyToIdSource } : {}),
      ...(params.replyToMode !== void 0 ? { replyToMode: params.replyToMode } : {}),
      accountId: params.accountId ?? void 0,
      silent: params.silent,
      gatewayClientScopes: params.gatewayClientScopes,
      onDeliveryResult: params.onDeliveryResult
        ? async (result) => {
            await params.onDeliveryResult?.(attachChannelToResult("telegram", result));
          }
        : void 0,
      ...(params.formatting?.parseMode === "HTML" ? { textMode: "html" } : {}),
      tableMode: params.formatting?.tableMode,
    },
  };
}
async function resolveTelegramOutboundSendContext(params) {
  const outboundTo = normalizeTelegramOutboundTarget(params.to);
  const { send, baseOpts } = await resolveTelegramSendContext(params);
  return {
    outboundTo,
    send,
    baseOpts,
  };
}
async function sendTelegramPayloadMessages(params) {
  const payload = canonicalizeTelegramPresentationPayload(params.payload);
  const telegramData = payload.channelData?.telegram;
  const quoteText = typeof telegramData?.quoteText === "string" ? telegramData.quoteText : void 0;
  const reactionEmoji =
    typeof telegramData?.reaction?.emoji === "string" ? telegramData.reaction.emoji : void 0;
  const text =
    resolveTelegramInteractiveTextFallback({
      text: payload.text,
      interactive: payload.interactive,
      presentation: payload.presentation,
    }) ?? "";
  const mediaUrls = resolveSendableOutboundReplyParts(payload).mediaUrls;
  const buttons = resolveTelegramInlineButtons({
    buttons: telegramData?.buttons,
    presentation: payload.presentation,
    interactive: payload.interactive,
  });
  const replyToMessageId = params.baseOpts.replyToMessageId;
  const promptContextSource = resolveTelegramPromptContextSource(params.payload);
  const projectionCursor = promptContextSource
    ? createTelegramPromptContextProjectionCursor(promptContextSource)
    : void 0;
  const projectionOptions = (finalPart) =>
    projectionCursor
      ? {
          promptContextProjectionPlan: {
            cursor: projectionCursor,
            finalPart,
          },
        }
      : {};
  const payloadOpts = {
    ...params.baseOpts,
    quoteText,
    ...(payload.audioAsVoice === true ? { asVoice: true } : {}),
    ...(payload.videoAsNote === true ? { asVideoNote: true } : {}),
  };
  if (payload.location) {
    if (
      mediaUrls.length > 0 ||
      reactionEmoji ||
      payload.audioAsVoice === true ||
      payload.videoAsNote === true
    )
      throw new Error("Telegram location sends cannot be combined with media or reactions.");
    if (text.trim())
      await params.send(params.to, text, {
        ...params.baseOpts,
        replyToMessageId: void 0,
        replyToIdSource: void 0,
        replyToMode: void 0,
      });
    return await params.sendLocation(params.to, payload.location, {
      ...params.baseOpts,
      ...projectionOptions(true),
      buttons,
      quoteText,
    });
  }
  if (payload.videoAsNote === true && mediaUrls.length !== 1)
    throw new Error("Telegram video notes require exactly one media attachment.");
  const shouldConsumeImplicitReplyTarget =
    payloadOpts.replyToIdSource === "implicit" &&
    payloadOpts.replyToMode !== void 0 &&
    isSingleUseReplyToMode(payloadOpts.replyToMode);
  const consumedImplicitReplyPayloadOpts = shouldConsumeImplicitReplyTarget
    ? {
        ...payloadOpts,
        replyToMessageId: void 0,
        replyToIdSource: void 0,
        replyToMode: void 0,
      }
    : payloadOpts;
  let implicitReplyTargetAvailable = true;
  if (reactionEmoji) {
    if (typeof replyToMessageId !== "number")
      throw new Error("Telegram reaction requires a reply target");
    const reactionResult = await params.react(params.to, replyToMessageId, reactionEmoji, {
      cfg: params.baseOpts.cfg,
      accountId: params.baseOpts.accountId,
      gatewayClientScopes: params.baseOpts.gatewayClientScopes,
      verbose: false,
    });
    if (!reactionResult.ok) throw new Error(reactionResult.warning);
  }
  if (reactionEmoji && !text && mediaUrls.length === 0 && !buttons?.length)
    return {
      messageId: String(replyToMessageId),
      chatId: params.to,
    };
  return await sendPayloadMediaSequenceOrFallback({
    text,
    mediaUrls,
    fallbackResult: {
      messageId: "unknown",
      chatId: params.to,
    },
    sendNoMedia: async () =>
      await params.send(params.to, text, {
        ...payloadOpts,
        ...projectionOptions(true),
        buttons,
      }),
    send: async ({ text: textLocal, mediaUrl, index, isFirst }) => {
      const mediaPayloadOpts =
        shouldConsumeImplicitReplyTarget && !implicitReplyTargetAvailable
          ? consumedImplicitReplyPayloadOpts
          : payloadOpts;
      implicitReplyTargetAvailable = false;
      return await params.send(params.to, textLocal, {
        ...mediaPayloadOpts,
        ...projectionOptions(index === mediaUrls.length - 1),
        mediaUrl,
        ...(isFirst ? { buttons } : {}),
      });
    },
  });
}
function createTelegramOutboundAdapter(options = {}) {
  const resolveSend = options.resolveSend ?? resolveDefaultTelegramSend;
  const loadSendModule = options.loadSendModule ?? loadTelegramSendModule;
  return {
    deliveryMode: "direct",
    chunker: chunkTelegramOutboundText,
    chunkerMode: "markdown",
    extractMarkdownImages: true,
    textChunkLimit: TELEGRAM_TEXT_CHUNK_LIMIT,
    sanitizeText: ({ text }) =>
      sanitizeForPlainText(sanitizeAssistantVisibleText(text), { style: "markdown" }),
    shouldSuppressLocalPayloadPrompt: options.shouldSuppressLocalPayloadPrompt,
    beforeDeliverPayload: options.beforeDeliverPayload,
    shouldTreatDeliveredTextAsVisible: options.shouldTreatDeliveredTextAsVisible,
    targetsMatchForReplySuppression: options.targetsMatchForReplySuppression,
    preferFinalAssistantVisibleText: options.preferFinalAssistantVisibleText,
    presentationCapabilities: TELEGRAM_PRESENTATION_CAPABILITIES,
    deliveryCapabilities: {
      pin: true,
      durableFinal: {
        text: true,
        media: true,
        payload: true,
        silent: true,
        replyTo: true,
        thread: true,
        nativeQuote: false,
        messageSendingHooks: true,
        batch: true,
      },
    },
    renderPresentation: ({ payload, presentation }) =>
      canonicalizeTelegramPresentationPayload({
        ...payload,
        presentation,
      }),
    pinDeliveredMessage: async ({ cfg, target, messageId, pin, gatewayClientScopes }) => {
      const { pinMessageTelegram } = await loadSendModule();
      await pinMessageTelegram(
        parseTelegramTarget(normalizeTelegramOutboundTarget(target.to)).chatId,
        messageId,
        {
          cfg,
          accountId: target.accountId ?? void 0,
          notify: pin.notify,
          verbose: false,
          gatewayClientScopes,
        },
      );
    },
    resolveEffectiveTextChunkLimit: ({ fallbackLimit }) =>
      typeof fallbackLimit === "number" ? Math.min(fallbackLimit, 4096) : 4096,
    pollMaxOptions: TELEGRAM_POLL_OPTION_LIMIT,
    supportsPollDurationSeconds: true,
    supportsAnonymousPolls: true,
    ...createAttachedChannelResultAdapter({
      channel: "telegram",
      sendText: async (params) => {
        const { outboundTo, send, baseOpts } = await resolveTelegramOutboundSendContext({
          ...params,
          resolveSend,
        });
        return await send(outboundTo, params.text, { ...baseOpts });
      },
      sendMedia: async (params) => {
        const { outboundTo, send, baseOpts } = await resolveTelegramOutboundSendContext({
          ...params,
          resolveSend,
        });
        return await send(outboundTo, params.text, {
          ...baseOpts,
          mediaUrl: params.mediaUrl,
          mediaLocalRoots: params.mediaLocalRoots,
          mediaReadFile: params.mediaReadFile,
          forceDocument: params.forceDocument ?? false,
        });
      },
    }),
    sendPayload: async (params) => {
      const { outboundTo, send, baseOpts } = await resolveTelegramOutboundSendContext({
        ...params,
        resolveSend,
      });
      const { reactMessageTelegram, sendLocationTelegram } = await loadSendModule();
      return attachChannelToResult(
        "telegram",
        await sendTelegramPayloadMessages({
          send,
          sendLocation: sendLocationTelegram,
          react: reactMessageTelegram,
          to: outboundTo,
          payload: params.payload,
          baseOpts: {
            ...baseOpts,
            mediaLocalRoots: params.mediaLocalRoots,
            mediaReadFile: params.mediaReadFile,
            forceDocument: params.forceDocument ?? false,
          },
        }),
      );
    },
    sendPoll: async ({
      cfg,
      to,
      poll,
      accountId,
      threadId,
      silent,
      isAnonymous,
      gatewayClientScopes,
    }) => {
      const outboundTo = normalizeTelegramOutboundTarget(to);
      const { sendPollTelegram } = await loadSendModule();
      return await sendPollTelegram(outboundTo, poll, {
        cfg,
        accountId: accountId ?? void 0,
        messageThreadId: parseTelegramThreadId(threadId),
        silent: silent ?? void 0,
        isAnonymous: isAnonymous ?? void 0,
        gatewayClientScopes,
      });
    },
  };
}
const telegramOutbound = createTelegramOutboundAdapter();
//#endregion
export {
  telegramOutbound as i,
  createTelegramOutboundAdapter as n,
  sendTelegramPayloadMessages as r,
  TELEGRAM_TEXT_CHUNK_LIMIT as t,
};
