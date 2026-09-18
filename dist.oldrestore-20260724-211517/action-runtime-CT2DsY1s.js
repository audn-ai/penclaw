import {
  a as resolveDefaultTelegramAccountId,
  c as resolveTelegramPollActionGateState,
  t as createTelegramActionGate,
} from "./accounts-BBOSygpA.js";
import { t as readBooleanParam } from "./boolean-param-AuSHeYDH.js";
import { n as resolveTelegramInlineButtons } from "./button-types-B6rcRmmv.js";
import { r as resolveReactionMessageId } from "./channel-actions-C9vNf9jw.js";
import { n as sendDurableMessageBatch } from "./channel-outbound-DlkFd7rO.js";
import {
  _ as readStringArrayParam,
  g as readReactionParams,
  h as readPositiveIntegerParam,
  v as readStringOrNumberParam,
  y as readStringParam,
} from "./common-DyDSUect.js";
import { n as notifyTelegramInboundEventOutboundSuccess } from "./inbound-event-delivery-C23ey9cb.js";
import { r as resolveTelegramInlineButtonsScope } from "./inline-buttons-CwHG__q7.js";
import { r as resolveTelegramInteractiveTextFallback } from "./interactive-fallback-DyphsAa-.js";
import {
  l as normalizeMessagePresentation,
  p as renderMessagePresentationFallbackText,
} from "./payload-BFbDi85B.js";
import { t as resolveTelegramPollVisibility } from "./poll-visibility-Ds4ydsWS.js";
import "./channel-inbound-vhkYEe2n.js";
import { r as resolvePollMaxSelections } from "./polls-C-v11_tu.js";
import { t as resolveTelegramReactionLevel } from "./reaction-level-VyxXTXmy.js";
import { D as normalizeOutboundLocation } from "./reply-payload-DDwHXDkv.js";
import {
  a as editMessageTelegram,
  d as sendMessageTelegram,
  f as sendPollTelegram,
  i as editMessageReplyMarkupTelegram,
  n as deleteMessageTelegram,
  o as pinMessageTelegram,
  p as sendStickerTelegram,
  r as editForumTopicTelegram,
  s as reactMessageTelegram,
  t as createForumTopicTelegram,
} from "./send-CfVpuwvn.js";
import { t as buildOutboundSessionContext } from "./session-context-CryOjB_1.js";
import { m as resolveStorePath } from "./session-store-runtime-BwE6SlGz.js";
import {
  a as parseTelegramTarget,
  i as normalizeTelegramOutboundTarget,
  o as resolveTelegramTargetChatType,
} from "./targets-Cb32iLpC.js";
import "./sticker-cache-BpYXQ2f-.js";
import { n as resolveTelegramToken } from "./token-iK1olK6e.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import {
  f as getCacheStats,
  h as searchStickers,
  o as resolveTopicNameCacheScope,
  s as updateTopicName,
} from "./topic-name-cache-BWDqVym9.js";
//#region extensions/telegram/src/action-runtime.ts
const telegramActionRuntime = {
  createForumTopicTelegram,
  deleteMessageTelegram,
  editForumTopicTelegram,
  editMessageReplyMarkupTelegram,
  editMessageTelegram,
  getCacheStats,
  pinMessageTelegram,
  reactMessageTelegram,
  searchStickers,
  sendDurableMessageBatch,
  sendMessageTelegram,
  sendPollTelegram,
  sendStickerTelegram,
};
const TELEGRAM_FORUM_TOPIC_ICON_COLORS = [7322096, 16766590, 13338331, 9367192, 16749490, 16478047];
const TELEGRAM_ACTION_ALIASES = {
  createForumTopic: "createForumTopic",
  delete: "deleteMessage",
  deleteMessage: "deleteMessage",
  edit: "editMessage",
  editForumTopic: "editForumTopic",
  editMessage: "editMessage",
  poll: "poll",
  react: "react",
  searchSticker: "searchSticker",
  send: "sendMessage",
  sendMessage: "sendMessage",
  sendSticker: "sendSticker",
  sticker: "sendSticker",
  stickerCacheStats: "stickerCacheStats",
  "sticker-search": "searchSticker",
  "topic-create": "createForumTopic",
  "topic-edit": "editForumTopic",
};
function readTelegramForumTopicIconColor(params) {
  const iconColor = readPositiveIntegerParam(params, "iconColor", {
    message: "iconColor must be one of Telegram's supported forum topic colors.",
  });
  if (iconColor == null) return;
  if (!TELEGRAM_FORUM_TOPIC_ICON_COLORS.includes(iconColor))
    throw new Error("iconColor must be one of Telegram's supported forum topic colors.");
  return iconColor;
}
function normalizeTelegramActionName(action) {
  const normalized = TELEGRAM_ACTION_ALIASES[action];
  if (!normalized) throw new Error(`Unsupported Telegram action: ${action}`);
  return normalized;
}
function readTelegramChatId(params) {
  return (
    readStringOrNumberParam(params, "chatId") ??
    readStringOrNumberParam(params, "channelId") ??
    readStringOrNumberParam(params, "to", { required: true })
  );
}
function readTelegramThreadId(params) {
  return (
    readPositiveIntegerParam(params, "messageThreadId", {
      message: "messageThreadId must be a positive integer.",
    }) ??
    readPositiveIntegerParam(params, "threadId", {
      message: "threadId must be a positive integer.",
    })
  );
}
function resolveActionTopicNameCacheScope(cfg, accountId) {
  return resolveTopicNameCacheScope(
    resolveStorePath(cfg.session?.store, {
      agentId: accountId ?? resolveDefaultTelegramAccountId(cfg),
    }),
  );
}
function formatTelegramDeliveryTarget(to, messageThreadId) {
  const parsed = parseTelegramTarget(to);
  const topicId = parsed.messageThreadId ?? messageThreadId;
  if (topicId == null) return to;
  return `${parsed.chatId}:topic:${topicId}`;
}
function readTelegramReplyToMessageId(params) {
  return (
    readPositiveIntegerParam(params, "replyToMessageId", {
      message: "replyToMessageId must be a positive integer.",
    }) ??
    readPositiveIntegerParam(params, "replyTo", { message: "replyTo must be a positive integer." })
  );
}
function pushTelegramMediaUrl(mediaUrls, seen, value) {
  if (typeof value !== "string") return;
  const normalized = value.trim();
  if (!normalized || seen.has(normalized)) return;
  seen.add(normalized);
  mediaUrls.push(normalized);
}
function readTelegramSendMediaUrls(params) {
  const mediaUrls = [];
  const seen = /* @__PURE__ */ new Set();
  pushTelegramMediaUrl(mediaUrls, seen, params.mediaUrl);
  pushTelegramMediaUrl(mediaUrls, seen, params.media);
  pushTelegramMediaUrl(mediaUrls, seen, params.path);
  pushTelegramMediaUrl(mediaUrls, seen, params.filePath);
  pushTelegramMediaUrl(mediaUrls, seen, params.fileUrl);
  if (Array.isArray(params.mediaUrls))
    for (const mediaUrl of params.mediaUrls) pushTelegramMediaUrl(mediaUrls, seen, mediaUrl);
  if (Array.isArray(params.attachments))
    for (const attachment of params.attachments) {
      if (!attachment || typeof attachment !== "object" || Array.isArray(attachment)) continue;
      const record = attachment;
      pushTelegramMediaUrl(mediaUrls, seen, record.media);
      pushTelegramMediaUrl(mediaUrls, seen, record.mediaUrl);
      pushTelegramMediaUrl(mediaUrls, seen, record.path);
      pushTelegramMediaUrl(mediaUrls, seen, record.filePath);
      pushTelegramMediaUrl(mediaUrls, seen, record.fileUrl);
      pushTelegramMediaUrl(mediaUrls, seen, record.url);
    }
  return mediaUrls;
}
function resolveTelegramButtonsFromParams(
  params,
  presentation = normalizeMessagePresentation(params.presentation),
) {
  return resolveTelegramInlineButtons({
    presentation,
    interactive: params.interactive,
  });
}
function readTelegramSendContent(params) {
  const explicitContent =
    readStringParam(params.args, "content", { allowEmpty: true }) ??
    readStringParam(params.args, "message", { allowEmpty: true }) ??
    readStringParam(params.args, "caption", { allowEmpty: true });
  const unsupportedBlocks =
    params.presentation?.blocks.filter(
      (block) => block.type === "chart" || block.type === "table",
    ) ?? [];
  const presentationText =
    explicitContent == null && params.presentation
      ? renderMessagePresentationFallbackText({ presentation: params.presentation })
      : explicitContent != null && unsupportedBlocks.length > 0
        ? renderMessagePresentationFallbackText({
            text: explicitContent,
            presentation: {
              ...params.presentation,
              blocks: unsupportedBlocks,
            },
          })
        : void 0;
  const interactiveText =
    explicitContent == null && !params.presentation
      ? resolveTelegramInteractiveTextFallback({ interactive: params.interactive })
      : void 0;
  let content =
    (presentationText?.trim() ? presentationText : void 0) ??
    explicitContent ??
    (interactiveText?.trim() ? interactiveText : void 0);
  if ((content == null || content.trim().length === 0) && !params.mediaUrl && params.hasButtons) {
    const fallback = presentationText?.trim() ? presentationText : interactiveText;
    if (fallback?.trim()) content = fallback;
  }
  if (content == null && !params.mediaUrl && !params.hasButtons && !params.hasLocation)
    throw new Error("content required.");
  return content ?? "";
}
function normalizeTelegramDeliveryPin(params) {
  const delivery = params.delivery;
  const pin =
    delivery && typeof delivery === "object" && !Array.isArray(delivery)
      ? delivery.pin
      : params.pin === true
        ? true
        : void 0;
  if (pin === true) return { enabled: true };
  if (!pin || typeof pin !== "object" || Array.isArray(pin)) return;
  const raw = pin;
  if (raw.enabled !== true) return;
  return {
    enabled: true,
    ...(raw.notify === true ? { notify: true } : {}),
    ...(raw.required === true ? { required: true } : {}),
  };
}
function buildTelegramActionSendPayload(params) {
  const telegramData =
    params.buttons || params.quoteText
      ? {
          ...(params.buttons ? { buttons: params.buttons } : {}),
          ...(params.quoteText ? { quoteText: params.quoteText } : {}),
        }
      : void 0;
  return {
    text: params.content,
    ...(params.mediaUrls.length > 0 ? { mediaUrls: params.mediaUrls } : {}),
    ...(params.asVoice === true ? { audioAsVoice: true } : {}),
    ...(params.asVideoNote === true ? { videoAsNote: true } : {}),
    ...(params.location ? { location: params.location } : {}),
    ...(params.pin ? { delivery: { pin: params.pin } } : {}),
    ...(telegramData ? { channelData: { telegram: telegramData } } : {}),
  };
}
function getLastDurableTelegramActionResult(result) {
  const lastResult = result.results.at(-1);
  const receipt = result.receipt;
  return {
    messageId:
      lastResult?.messageId ??
      receipt.primaryPlatformMessageId ??
      receipt.platformMessageIds.at(-1),
    chatId: lastResult?.chatId,
  };
}
async function handleTelegramAction(params, cfg, options) {
  const { action, accountId } = {
    action: normalizeTelegramActionName(readStringParam(params, "action", { required: true })),
    accountId: readStringParam(params, "accountId"),
  };
  const isActionEnabled = createTelegramActionGate({
    cfg,
    accountId,
  });
  const notifyVisibleOutboundSuccess = (to, messageThreadId) => {
    notifyTelegramInboundEventOutboundSuccess({
      sessionKey: options?.sessionKey ?? void 0,
      to: formatTelegramDeliveryTarget(to, messageThreadId),
      accountId,
      inboundEventKind: options?.inboundEventKind,
    });
  };
  if (action === "react") {
    const reactionLevelInfo = resolveTelegramReactionLevel({
      cfg,
      accountId: accountId ?? void 0,
    });
    if (!reactionLevelInfo.agentReactionsEnabled)
      return jsonResult({
        ok: false,
        reason: "disabled",
        hint: `Telegram agent reactions disabled (reactionLevel="${reactionLevelInfo.level}"). Do not retry.`,
      });
    if (!isActionEnabled("reactions"))
      return jsonResult({
        ok: false,
        reason: "disabled",
        hint: "Telegram reactions are disabled via actions.reactions. Do not retry.",
      });
    const chatId = readTelegramChatId(params);
    let explicitMessageId;
    try {
      explicitMessageId = readPositiveIntegerParam(params, "messageId", {
        message: "messageId must be a positive integer.",
      });
    } catch {
      return jsonResult({
        ok: false,
        reason: "missing_message_id",
        hint: "Telegram reaction requires a valid messageId (or inbound context fallback). Do not retry.",
      });
    }
    const messageId = explicitMessageId ?? resolveReactionMessageId({ args: params });
    if (typeof messageId !== "number" || !Number.isFinite(messageId) || messageId <= 0)
      return jsonResult({
        ok: false,
        reason: "missing_message_id",
        hint: "Telegram reaction requires a valid messageId (or inbound context fallback). Do not retry.",
      });
    const { emoji, remove, isEmpty } = readReactionParams(params, {
      removeErrorMessage: "Emoji is required to remove a Telegram reaction.",
    });
    const token = resolveTelegramToken(cfg, { accountId }).token;
    if (!token)
      return jsonResult({
        ok: false,
        reason: "missing_token",
        hint: "Telegram bot token missing. Do not retry.",
      });
    let reactionResult;
    try {
      reactionResult = await telegramActionRuntime.reactMessageTelegram(
        chatId ?? "",
        messageId ?? 0,
        emoji ?? "",
        {
          cfg,
          token,
          remove,
          accountId: accountId ?? void 0,
          gatewayClientScopes: options?.gatewayClientScopes,
        },
      );
    } catch (err) {
      const isInvalid = String(err).includes("REACTION_INVALID");
      return jsonResult({
        ok: false,
        reason: isInvalid ? "REACTION_INVALID" : "error",
        emoji,
        hint: isInvalid
          ? "This emoji is not supported for Telegram reactions. Add it to your reaction disallow list so you do not try it again."
          : "Reaction failed. Do not retry.",
      });
    }
    if (!reactionResult.ok)
      return jsonResult({
        ok: false,
        warning: reactionResult.warning,
        ...(remove || isEmpty ? { removed: true } : { added: emoji }),
      });
    if (!remove && !isEmpty)
      return jsonResult({
        ok: true,
        added: emoji,
      });
    return jsonResult({
      ok: true,
      removed: true,
    });
  }
  if (action === "sendMessage") {
    if (!isActionEnabled("sendMessage")) throw new Error("Telegram sendMessage is disabled.");
    const to = normalizeTelegramOutboundTarget(readStringParam(params, "to", { required: true }));
    const mediaUrls = readTelegramSendMediaUrls(params);
    const firstMediaUrl = mediaUrls[0];
    const location = normalizeOutboundLocation(params.location);
    const presentation = normalizeMessagePresentation(params.presentation);
    const buttons = resolveTelegramButtonsFromParams(params, presentation);
    const content = readTelegramSendContent({
      args: params,
      mediaUrl: firstMediaUrl,
      hasButtons: Array.isArray(buttons) && buttons.length > 0,
      hasLocation: Boolean(location),
      interactive: params.interactive,
      presentation,
    });
    const asVideoNote = readBooleanParam(params, "asVideoNote") ?? false;
    if (location && (content.trim() || mediaUrls.length > 0 || asVideoNote))
      throw new Error("Telegram location sends cannot be combined with message text or media.");
    if (asVideoNote && mediaUrls.length !== 1)
      throw new Error("Telegram video notes require exactly one media attachment.");
    if (buttons) {
      const inlineButtonsScope = resolveTelegramInlineButtonsScope({
        cfg,
        accountId: accountId ?? void 0,
      });
      if (inlineButtonsScope === "off")
        throw new Error(
          'Telegram inline buttons are disabled. Set channels.telegram.capabilities.inlineButtons to "dm", "group", "all", or "allowlist".',
        );
      if (inlineButtonsScope === "dm" || inlineButtonsScope === "group") {
        const targetType = resolveTelegramTargetChatType(to);
        if (targetType === "unknown")
          throw new Error(
            `Telegram inline buttons require a numeric chat id when inlineButtons="${inlineButtonsScope}".`,
          );
        if (inlineButtonsScope === "dm" && targetType !== "direct")
          throw new Error('Telegram inline buttons are limited to DMs when inlineButtons="dm".');
        if (inlineButtonsScope === "group" && targetType !== "group")
          throw new Error(
            'Telegram inline buttons are limited to groups when inlineButtons="group".',
          );
      }
    }
    const replyToMessageId = readTelegramReplyToMessageId(params);
    const messageThreadId = readTelegramThreadId(params);
    const quoteText = readStringParam(params, "quoteText");
    if (!resolveTelegramToken(cfg, { accountId }).token)
      throw new Error(
        "Telegram bot token missing. Set TELEGRAM_BOT_TOKEN or channels.telegram.botToken.",
      );
    const sendOptions = {
      cfg,
      accountId: accountId ?? void 0,
      gatewayClientScopes: options?.gatewayClientScopes,
      replyToMessageId: replyToMessageId ?? void 0,
      messageThreadId: messageThreadId ?? void 0,
      quoteText: quoteText ?? void 0,
      asVoice: readBooleanParam(params, "asVoice"),
      asVideoNote,
      silent: readBooleanParam(params, "silent"),
      forceDocument:
        readBooleanParam(params, "forceDocument") ??
        readBooleanParam(params, "asDocument") ??
        false,
    };
    const payload = buildTelegramActionSendPayload({
      content,
      mediaUrls,
      asVoice: sendOptions.asVoice,
      asVideoNote: sendOptions.asVideoNote,
      location,
      pin: normalizeTelegramDeliveryPin(params),
      buttons,
      quoteText,
    });
    const mediaAccess =
      options?.mediaLocalRoots || options?.mediaReadFile
        ? {
            ...(options.mediaLocalRoots ? { localRoots: options.mediaLocalRoots } : {}),
            ...(options.mediaReadFile ? { readFile: options.mediaReadFile } : {}),
          }
        : void 0;
    const outboundSession = buildOutboundSessionContext({
      cfg,
      sessionKey: options?.sessionKey,
      requesterAccountId: accountId,
    });
    const durableResult = await telegramActionRuntime.sendDurableMessageBatch({
      cfg,
      channel: "telegram",
      to,
      accountId: accountId ?? void 0,
      payloads: [payload],
      replyToId: replyToMessageId == null ? void 0 : String(replyToMessageId),
      threadId: messageThreadId,
      forceDocument: sendOptions.forceDocument,
      silent: sendOptions.silent,
      durability: "required",
      gatewayClientScopes: options?.gatewayClientScopes,
      ...(mediaAccess ? { mediaAccess } : {}),
      ...(outboundSession ? { session: outboundSession } : {}),
    });
    if (durableResult.status === "failed" || durableResult.status === "partial_failed")
      throw durableResult.error;
    if (durableResult.status === "suppressed")
      throw new Error("Telegram sendMessage was suppressed before delivery.");
    const result = getLastDurableTelegramActionResult(durableResult);
    notifyVisibleOutboundSuccess(to, messageThreadId);
    return jsonResult({
      ok: true,
      messageId: result.messageId,
      chatId: result.chatId,
    });
  }
  if (action === "poll") {
    const pollActionState = resolveTelegramPollActionGateState(isActionEnabled);
    if (!pollActionState.sendMessageEnabled) throw new Error("Telegram sendMessage is disabled.");
    if (!pollActionState.pollEnabled) throw new Error("Telegram polls are disabled.");
    const to = readStringParam(params, "to", { required: true });
    const question =
      readStringParam(params, "question") ??
      readStringParam(params, "pollQuestion", { required: true });
    const answers =
      readStringArrayParam(params, "answers") ??
      readStringArrayParam(params, "pollOption", { required: true });
    const allowMultiselect =
      readBooleanParam(params, "allowMultiselect") ?? readBooleanParam(params, "pollMulti");
    const durationSeconds =
      readPositiveIntegerParam(params, "durationSeconds", {
        message: "durationSeconds must be a positive integer.",
      }) ??
      readPositiveIntegerParam(params, "pollDurationSeconds", {
        message: "pollDurationSeconds must be a positive integer.",
      });
    const durationHours =
      readPositiveIntegerParam(params, "durationHours", {
        message: "durationHours must be a positive integer.",
      }) ??
      readPositiveIntegerParam(params, "pollDurationHours", {
        message: "pollDurationHours must be a positive integer.",
      });
    const replyToMessageId = readTelegramReplyToMessageId(params);
    const messageThreadId = readTelegramThreadId(params);
    const isAnonymous =
      readBooleanParam(params, "isAnonymous") ??
      resolveTelegramPollVisibility({
        pollAnonymous: readBooleanParam(params, "pollAnonymous"),
        pollPublic: readBooleanParam(params, "pollPublic"),
      });
    const silent = readBooleanParam(params, "silent");
    const token = resolveTelegramToken(cfg, { accountId }).token;
    if (!token)
      throw new Error(
        "Telegram bot token missing. Set TELEGRAM_BOT_TOKEN or channels.telegram.botToken.",
      );
    const result = await telegramActionRuntime.sendPollTelegram(
      to,
      {
        question,
        options: answers,
        maxSelections: resolvePollMaxSelections(answers.length, allowMultiselect ?? false),
        durationSeconds: durationSeconds ?? void 0,
        durationHours: durationHours ?? void 0,
      },
      {
        cfg,
        token,
        accountId: accountId ?? void 0,
        replyToMessageId: replyToMessageId ?? void 0,
        messageThreadId: messageThreadId ?? void 0,
        isAnonymous: isAnonymous ?? void 0,
        silent: silent ?? void 0,
        gatewayClientScopes: options?.gatewayClientScopes,
      },
    );
    notifyVisibleOutboundSuccess(to, messageThreadId);
    return jsonResult({
      ok: true,
      messageId: result.messageId,
      chatId: result.chatId,
      pollId: result.pollId,
    });
  }
  if (action === "deleteMessage") {
    if (!isActionEnabled("deleteMessage")) throw new Error("Telegram deleteMessage is disabled.");
    const chatId = readTelegramChatId(params);
    const messageId = readPositiveIntegerParam(params, "messageId", {
      message: "messageId must be a positive integer.",
    });
    if (messageId === void 0) throw new Error("messageId required");
    const token = resolveTelegramToken(cfg, { accountId }).token;
    if (!token)
      throw new Error(
        "Telegram bot token missing. Set TELEGRAM_BOT_TOKEN or channels.telegram.botToken.",
      );
    const result = await telegramActionRuntime.deleteMessageTelegram(chatId ?? "", messageId ?? 0, {
      cfg,
      token,
      accountId: accountId ?? void 0,
      gatewayClientScopes: options?.gatewayClientScopes,
    });
    if (!result.ok)
      return jsonResult({
        ok: false,
        deleted: false,
        warning: result.warning,
      });
    return jsonResult({
      ok: true,
      deleted: true,
    });
  }
  if (action === "editMessage") {
    if (!isActionEnabled("editMessage")) throw new Error("Telegram editMessage is disabled.");
    const chatId = readTelegramChatId(params);
    const messageId = readPositiveIntegerParam(params, "messageId", {
      message: "messageId must be a positive integer.",
    });
    if (messageId === void 0) throw new Error("messageId required");
    const content =
      readStringParam(params, "content", { allowEmpty: false }) ??
      readStringParam(params, "message", { allowEmpty: false });
    const caption = readStringParam(params, "caption", { allowEmpty: false });
    const buttons = resolveTelegramButtonsFromParams(params);
    if (content == null && caption == null && buttons === void 0)
      throw new Error("content required.");
    if (buttons !== void 0) {
      if (
        resolveTelegramInlineButtonsScope({
          cfg,
          accountId: accountId ?? void 0,
        }) === "off"
      )
        throw new Error(
          'Telegram inline buttons are disabled. Set channels.telegram.capabilities.inlineButtons to "dm", "group", "all", or "allowlist".',
        );
    }
    const token = resolveTelegramToken(cfg, { accountId }).token;
    if (!token)
      throw new Error(
        "Telegram bot token missing. Set TELEGRAM_BOT_TOKEN or channels.telegram.botToken.",
      );
    if (content == null && caption == null && buttons !== void 0) {
      const result = await telegramActionRuntime.editMessageReplyMarkupTelegram(
        chatId ?? "",
        messageId ?? 0,
        buttons,
        {
          cfg,
          token,
          accountId: accountId ?? void 0,
          gatewayClientScopes: options?.gatewayClientScopes,
        },
      );
      return jsonResult({
        ok: true,
        messageId: result.messageId,
        chatId: result.chatId,
      });
    }
    const result = await telegramActionRuntime.editMessageTelegram(
      chatId ?? "",
      messageId ?? 0,
      caption ?? content ?? "",
      {
        cfg,
        token,
        accountId: accountId ?? void 0,
        buttons,
        editMode: caption != null ? "caption" : "auto",
        gatewayClientScopes: options?.gatewayClientScopes,
      },
    );
    return jsonResult({
      ok: true,
      messageId: result.messageId,
      chatId: result.chatId,
    });
  }
  if (action === "sendSticker") {
    if (!isActionEnabled("sticker", false))
      throw new Error(
        "Telegram sticker actions are disabled. Set channels.telegram.actions.sticker to true.",
      );
    const to =
      readStringParam(params, "to") ?? readStringParam(params, "target", { required: true });
    const fileId =
      readStringParam(params, "fileId") ?? readStringArrayParam(params, "stickerId")?.[0];
    if (!fileId) throw new Error("fileId is required.");
    const replyToMessageId = readTelegramReplyToMessageId(params);
    const messageThreadId = readTelegramThreadId(params);
    const token = resolveTelegramToken(cfg, { accountId }).token;
    if (!token)
      throw new Error(
        "Telegram bot token missing. Set TELEGRAM_BOT_TOKEN or channels.telegram.botToken.",
      );
    const result = await telegramActionRuntime.sendStickerTelegram(to, fileId, {
      cfg,
      token,
      accountId: accountId ?? void 0,
      replyToMessageId: replyToMessageId ?? void 0,
      messageThreadId: messageThreadId ?? void 0,
      gatewayClientScopes: options?.gatewayClientScopes,
    });
    notifyVisibleOutboundSuccess(to, messageThreadId);
    return jsonResult({
      ok: true,
      messageId: result.messageId,
      chatId: result.chatId,
    });
  }
  if (action === "searchSticker") {
    if (!isActionEnabled("sticker", false))
      throw new Error(
        "Telegram sticker actions are disabled. Set channels.telegram.actions.sticker to true.",
      );
    const query = readStringParam(params, "query", { required: true });
    const limit =
      readPositiveIntegerParam(params, "limit", { message: "limit must be a positive integer." }) ??
      5;
    const results = telegramActionRuntime.searchStickers(query, limit);
    return jsonResult({
      ok: true,
      count: results.length,
      stickers: results.map((s) => ({
        fileId: s.fileId,
        emoji: s.emoji,
        description: s.description,
        setName: s.setName,
      })),
    });
  }
  if (action === "stickerCacheStats")
    return jsonResult({
      ok: true,
      ...telegramActionRuntime.getCacheStats(),
    });
  if (action === "createForumTopic") {
    if (!isActionEnabled("createForumTopic"))
      throw new Error("Telegram createForumTopic is disabled.");
    const chatId = readTelegramChatId(params);
    const name = readStringParam(params, "name", { required: true });
    const iconColor = readTelegramForumTopicIconColor(params);
    const iconCustomEmojiId = readStringParam(params, "iconCustomEmojiId");
    const token = resolveTelegramToken(cfg, { accountId }).token;
    if (!token)
      throw new Error(
        "Telegram bot token missing. Set TELEGRAM_BOT_TOKEN or channels.telegram.botToken.",
      );
    const result = await telegramActionRuntime.createForumTopicTelegram(chatId ?? "", name, {
      cfg,
      token,
      accountId: accountId ?? void 0,
      iconColor,
      iconCustomEmojiId: iconCustomEmojiId ?? void 0,
      gatewayClientScopes: options?.gatewayClientScopes,
    });
    if (result.topicId != null && result.chatId)
      await updateTopicName(
        result.chatId,
        result.topicId,
        {
          name,
          ...(iconColor != null ? { iconColor } : {}),
          ...(iconCustomEmojiId ? { iconCustomEmojiId } : {}),
        },
        resolveActionTopicNameCacheScope(cfg, accountId),
      ).catch(() => {});
    return jsonResult({
      ok: true,
      topicId: result.topicId,
      name: result.name,
      chatId: result.chatId,
    });
  }
  if (action === "editForumTopic") {
    if (!isActionEnabled("editForumTopic")) throw new Error("Telegram editForumTopic is disabled.");
    const chatId = readTelegramChatId(params);
    const messageThreadId = readTelegramThreadId(params);
    if (typeof messageThreadId !== "number")
      throw new Error("messageThreadId or threadId is required.");
    const name = readStringParam(params, "name");
    const iconCustomEmojiId = readStringParam(params, "iconCustomEmojiId");
    const token = resolveTelegramToken(cfg, { accountId }).token;
    if (!token)
      throw new Error(
        "Telegram bot token missing. Set TELEGRAM_BOT_TOKEN or channels.telegram.botToken.",
      );
    const result = await telegramActionRuntime.editForumTopicTelegram(
      chatId ?? "",
      messageThreadId,
      {
        cfg,
        token,
        accountId: accountId ?? void 0,
        name: name ?? void 0,
        iconCustomEmojiId: iconCustomEmojiId ?? void 0,
        gatewayClientScopes: options?.gatewayClientScopes,
      },
    );
    if (result.chatId) {
      const patch = {};
      if (name) patch.name = name;
      if (iconCustomEmojiId) patch.iconCustomEmojiId = iconCustomEmojiId;
      if (Object.keys(patch).length > 0)
        await updateTopicName(
          result.chatId,
          result.messageThreadId,
          patch,
          resolveActionTopicNameCacheScope(cfg, accountId),
        ).catch(() => {});
    }
    return jsonResult(result);
  }
  throw new Error(`Unsupported Telegram action: ${String(action)}`);
}
//#endregion
export { handleTelegramAction, telegramActionRuntime };
