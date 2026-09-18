import { i as resolveLineAccount } from "./accounts-ClT4gAGW.js";
import { n as recordChannelActivity } from "./channel-activity-4piA219h.js";
import "./runtime-env-D0V-7Gqz.js";
import { n as stripMarkdown } from "./chunk-items-BB3E9W12.js";
import "./text-chunking-Dr19ggf-.js";
import "./text-utility-runtime-CJESZCN5.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import {
  c as uriAction,
  d as createReceiptCard,
  o as messageAction,
  s as postbackAction,
  t as toFlexMessage,
} from "./flex-templates-BBTGBUm1.js";
import { r as logVerbose } from "./globals-CNUzHTcU.js";
import { t as MessagingApiClient } from "./messagingApiClient-BSDrulNf.js";
import { t as requireRuntimeConfig } from "./plugin-config-runtime-ef53THzv.js";
import { r as validateLineMediaUrl, t as createLineSendReceipt } from "./send-receipt-BMb6Box5.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region extensions/line/src/template-messages.ts
const COMPACT_TEMPLATE_TEXT_LIMIT = 60;
const graphemeSegmenter = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function buildTemplatePayloadAction(action) {
  if (action.type === "uri" && action.uri) return uriAction(action.label, action.uri);
  if (action.type === "postback" && action.data)
    return postbackAction(action.label, action.data, action.label);
  return messageAction(action.label, action.data ?? action.label);
}
function resolveTemplateTextLimit(params) {
  return params.title !== void 0 || params.thumbnailImageUrl !== void 0
    ? COMPACT_TEMPLATE_TEXT_LIMIT
    : params.textOnlyLimit;
}
function truncateTemplateText(text, limit) {
  let result = "";
  for (const { segment } of graphemeSegmenter.segment(text)) {
    if (result.length + segment.length > limit) {
      if (!result)
        for (const codePoint of segment) {
          if (result.length + codePoint.length > limit) break;
          result += codePoint;
        }
      break;
    }
    result += segment;
  }
  return result;
}
function truncateOptionalTemplateText(value, limit) {
  return value === void 0 ? void 0 : truncateTemplateText(value, limit);
}
function formatProductCarouselText(description, price) {
  if (!price) return description;
  const priceText = truncateTemplateText(price, COMPACT_TEMPLATE_TEXT_LIMIT);
  const descriptionText = truncateTemplateText(
    description,
    Math.max(0, COMPACT_TEMPLATE_TEXT_LIMIT - priceText.length - 1),
  );
  return descriptionText ? `${descriptionText}\n${priceText}` : priceText;
}
/**
 * Create a confirm template (yes/no style dialog)
 */
function createConfirmTemplate(text, confirmAction, cancelAction, altText) {
  const template = {
    type: "confirm",
    text: truncateTemplateText(text, 240),
    actions: [confirmAction, cancelAction],
  };
  return {
    type: "template",
    altText: truncateOptionalTemplateText(altText, 400) ?? truncateTemplateText(text, 400),
    template,
  };
}
/**
 * Create a button template with title, text, and action buttons
 */
function createButtonTemplate(title, text, actions, options) {
  const normalizedTitle = title || void 0;
  const textLimit = resolveTemplateTextLimit({
    title: normalizedTitle,
    thumbnailImageUrl: options?.thumbnailImageUrl,
    textOnlyLimit: 160,
  });
  const template = {
    type: "buttons",
    ...(normalizedTitle ? { title: truncateTemplateText(normalizedTitle, 40) } : {}),
    text: truncateTemplateText(text, textLimit),
    actions: actions.slice(0, 4),
    thumbnailImageUrl: options?.thumbnailImageUrl,
    imageAspectRatio: options?.imageAspectRatio ?? "rectangle",
    imageSize: options?.imageSize ?? "cover",
    imageBackgroundColor: options?.imageBackgroundColor,
    defaultAction: options?.defaultAction,
  };
  return {
    type: "template",
    altText:
      truncateOptionalTemplateText(options?.altText, 400) ??
      truncateTemplateText(normalizedTitle ? `${normalizedTitle}: ${text}` : text, 400),
    template,
  };
}
/**
 * Create a carousel template with multiple columns
 */
function createTemplateCarousel(columns, options) {
  const template = {
    type: "carousel",
    columns: columns.slice(0, 10),
    imageAspectRatio: options?.imageAspectRatio ?? "rectangle",
    imageSize: options?.imageSize ?? "cover",
  };
  return {
    type: "template",
    altText: truncateOptionalTemplateText(options?.altText, 400) ?? "View carousel",
    template,
  };
}
/**
 * Create a carousel column for use with createTemplateCarousel
 */
function createCarouselColumn(params) {
  const textLimit = resolveTemplateTextLimit({
    ...params,
    textOnlyLimit: 120,
  });
  return {
    title: truncateOptionalTemplateText(params.title, 40),
    text: truncateTemplateText(params.text, textLimit),
    actions: params.actions.slice(0, 3),
    thumbnailImageUrl: params.thumbnailImageUrl,
    imageBackgroundColor: params.imageBackgroundColor,
    defaultAction: params.defaultAction,
  };
}
/**
 * Create an image carousel template (simpler, image-focused carousel)
 */
function createImageCarousel(columns, altText) {
  const template = {
    type: "image_carousel",
    columns: columns.slice(0, 10),
  };
  return {
    type: "template",
    altText: truncateOptionalTemplateText(altText, 400) ?? "View images",
    template,
  };
}
/**
 * Create an image carousel column for use with createImageCarousel
 */
function createImageCarouselColumn(imageUrl, action) {
  return {
    imageUrl,
    action,
  };
}
/**
 * Create a simple yes/no confirmation dialog
 */
function createYesNoConfirm(question, options) {
  return createConfirmTemplate(
    question,
    options?.yesData
      ? postbackAction(options.yesText ?? "Yes", options.yesData, options.yesText ?? "Yes")
      : messageAction(options?.yesText ?? "Yes"),
    options?.noData
      ? postbackAction(options.noText ?? "No", options.noData, options.noText ?? "No")
      : messageAction(options?.noText ?? "No"),
    options?.altText,
  );
}
/**
 * Create a button menu with simple text buttons
 */
function createButtonMenu(title, text, buttons, options) {
  return createButtonTemplate(
    title,
    text,
    buttons.slice(0, 4).map((btn) => messageAction(btn.label, btn.text)),
    {
      thumbnailImageUrl: options?.thumbnailImageUrl,
      altText: options?.altText,
    },
  );
}
/**
 * Create a button menu with URL links
 */
function createLinkMenu(title, text, links, options) {
  return createButtonTemplate(
    title,
    text,
    links.slice(0, 4).map((link) => uriAction(link.label, link.url)),
    {
      thumbnailImageUrl: options?.thumbnailImageUrl,
      altText: options?.altText,
    },
  );
}
/**
 * Create a simple product/item carousel
 */
function createProductCarousel(products, altText) {
  return createTemplateCarousel(
    products.slice(0, 10).map((product) => {
      const actions = [];
      if (product.actionUrl)
        actions.push(uriAction(product.actionLabel ?? "View", product.actionUrl));
      else if (product.actionData)
        actions.push(postbackAction(product.actionLabel ?? "Select", product.actionData));
      else actions.push(messageAction(product.actionLabel ?? "Select", product.title));
      return createCarouselColumn({
        title: product.title,
        text: formatProductCarouselText(product.description, product.price),
        thumbnailImageUrl: product.imageUrl,
        actions,
      });
    }),
    { altText },
  );
}
/**
 * Convert a TemplateMessagePayload from ReplyPayload to a LINE TemplateMessage
 */
function buildTemplateMessageFromPayload(payload) {
  switch (payload.type) {
    case "confirm": {
      const confirmAction = payload.confirmData.startsWith("http")
        ? uriAction(payload.confirmLabel, payload.confirmData)
        : payload.confirmData.includes("=")
          ? postbackAction(payload.confirmLabel, payload.confirmData, payload.confirmLabel)
          : messageAction(payload.confirmLabel, payload.confirmData);
      const cancelAction = payload.cancelData.startsWith("http")
        ? uriAction(payload.cancelLabel, payload.cancelData)
        : payload.cancelData.includes("=")
          ? postbackAction(payload.cancelLabel, payload.cancelData, payload.cancelLabel)
          : messageAction(payload.cancelLabel, payload.cancelData);
      return createConfirmTemplate(payload.text, confirmAction, cancelAction, payload.altText);
    }
    case "buttons": {
      const actions = payload.actions
        .slice(0, 4)
        .map((action) => buildTemplatePayloadAction(action));
      return createButtonTemplate(payload.title, payload.text, actions, {
        thumbnailImageUrl: payload.thumbnailImageUrl,
        altText: payload.altText,
      });
    }
    case "carousel":
      return createTemplateCarousel(
        payload.columns.slice(0, 10).map((col) => {
          const colActions = col.actions
            .slice(0, 3)
            .map((action) => buildTemplatePayloadAction(action));
          return createCarouselColumn({
            title: col.title,
            text: col.text,
            thumbnailImageUrl: col.thumbnailImageUrl,
            actions: colActions,
          });
        }),
        { altText: payload.altText },
      );
    default:
      return null;
  }
}
//#endregion
//#region extensions/line/src/channel-access-token.ts
function resolveLineChannelAccessToken(explicit, params) {
  if (explicit?.trim()) return explicit.trim();
  if (!params.channelAccessToken)
    throw new Error(
      `LINE channel access token missing for account "${params.accountId}" (set channels.line.channelAccessToken or LINE_CHANNEL_ACCESS_TOKEN).`,
    );
  return params.channelAccessToken.trim();
}
//#endregion
//#region extensions/line/src/send.ts
const userProfileCache = /* @__PURE__ */ new Map();
const PROFILE_CACHE_TTL_MS = 300 * 1e3;
function normalizeTarget(to) {
  const trimmed = to.trim();
  if (!trimmed) throw new Error("Recipient is required for LINE sends");
  const normalized = trimmed
    .replace(/^line:group:/i, "")
    .replace(/^line:room:/i, "")
    .replace(/^line:user:/i, "")
    .replace(/^line:/i, "");
  if (!normalized) throw new Error("Recipient is required for LINE sends");
  if (normalized.length >= 33 && !/^[CUR]/.test(normalized))
    throw new Error(
      `Recipient is not a valid LINE id (case-sensitive; expected leading capital C/U/R): ${truncateUtf16Safe(normalized, 4)}…`,
    );
  return normalized;
}
function isLineUserChatId(chatId) {
  return /^U/i.test(chatId);
}
function createLineMessagingClient(opts) {
  const account = resolveLineAccount({
    cfg: requireRuntimeConfig(opts.cfg, "LINE send"),
    accountId: opts.accountId,
  });
  return {
    account,
    client: new MessagingApiClient({
      channelAccessToken: resolveLineChannelAccessToken(opts.channelAccessToken, account),
    }),
  };
}
function createLinePushContext(to, opts) {
  const { account, client } = createLineMessagingClient(opts);
  return {
    account,
    client,
    chatId: normalizeTarget(to),
  };
}
function createTextMessage(text) {
  return {
    type: "text",
    text,
  };
}
function createImageMessage(originalContentUrl, previewImageUrl) {
  return {
    type: "image",
    originalContentUrl,
    previewImageUrl: previewImageUrl ?? originalContentUrl,
  };
}
function createVideoMessage(originalContentUrl, previewImageUrl, trackingId) {
  return {
    type: "video",
    originalContentUrl,
    previewImageUrl,
    ...(trackingId ? { trackingId } : {}),
  };
}
function createAudioMessage(originalContentUrl, durationMs) {
  return {
    type: "audio",
    originalContentUrl,
    duration: durationMs,
  };
}
function createLocationMessage(location) {
  return {
    type: "location",
    title: truncateUtf16Safe(location.title, 100),
    address: truncateUtf16Safe(location.address, 100),
    latitude: location.latitude,
    longitude: location.longitude,
  };
}
function logLineHttpError(err, context) {
  if (!err || typeof err !== "object") return;
  const { status, statusText, body } = err;
  if (typeof body === "string")
    logVerbose(
      `line: ${context} failed (${status ? `${status} ${statusText ?? ""}`.trim() : "unknown status"}): ${body}`,
    );
}
function recordLineOutboundActivity(accountId) {
  recordChannelActivity({
    channel: "line",
    accountId,
    direction: "outbound",
  });
}
function resolveLineReceiptKind(messages) {
  const types = new Set(messages.map((message) => message.type));
  if (types.has("audio")) return "voice";
  if (types.has("image") || types.has("video")) return "media";
  if (types.has("flex") || types.has("template") || types.has("location")) return "card";
  if (types.has("text")) return "text";
  return "unknown";
}
async function pushLineMessages(to, messages, opts, behavior = {}) {
  if (messages.length === 0) throw new Error("Message must be non-empty for LINE sends");
  const { account, client, chatId } = createLinePushContext(to, opts);
  const pushRequest = client.pushMessage({
    to: chatId,
    messages,
  });
  if (behavior.errorContext)
    await pushRequest.catch((err) => {
      logLineHttpError(err, behavior.errorContext);
      throw err;
    });
  else await pushRequest;
  recordLineOutboundActivity(account.accountId);
  if (opts.verbose)
    logVerbose(
      behavior.verboseMessage?.(chatId, messages.length) ??
        `line: pushed ${messages.length} messages to ${chatId}`,
    );
  return {
    messageId: "push",
    chatId,
    receipt: createLineSendReceipt({
      messageId: "push",
      chatId,
      kind: resolveLineReceiptKind(messages),
      messageCount: messages.length,
    }),
  };
}
async function replyLineMessages(replyToken, messages, opts, behavior = {}) {
  const { account, client } = createLineMessagingClient(opts);
  await client.replyMessage({
    replyToken,
    messages,
  });
  recordLineOutboundActivity(account.accountId);
  if (opts.verbose)
    logVerbose(
      behavior.verboseMessage?.(messages.length) ??
        `line: replied with ${messages.length} messages`,
    );
}
async function sendMessageLine(to, text, opts) {
  const chatId = normalizeTarget(to);
  const messages = [];
  const mediaUrl = opts.mediaUrl?.trim();
  if (mediaUrl) {
    await validateLineMediaUrl(mediaUrl);
    switch (opts.mediaKind) {
      case "video": {
        const previewImageUrl = opts.previewImageUrl?.trim();
        if (!previewImageUrl)
          throw new Error("LINE video messages require previewImageUrl to reference an image URL");
        await validateLineMediaUrl(previewImageUrl);
        const trackingId = isLineUserChatId(chatId) ? opts.trackingId : void 0;
        messages.push(createVideoMessage(mediaUrl, previewImageUrl, trackingId));
        break;
      }
      case "audio":
        messages.push(createAudioMessage(mediaUrl, opts.durationMs ?? 6e4));
        break;
      default:
        {
          const previewImageUrl = opts.previewImageUrl?.trim() || mediaUrl;
          await validateLineMediaUrl(previewImageUrl);
          messages.push(createImageMessage(mediaUrl, previewImageUrl));
        }
        break;
    }
  }
  if (text?.trim()) messages.push(createTextMessage(text.trim()));
  if (messages.length === 0) throw new Error("Message must be non-empty for LINE sends");
  if (opts.replyToken) {
    await replyLineMessages(opts.replyToken, messages, opts, {
      verboseMessage: () => `line: replied to ${chatId}`,
    });
    return {
      messageId: "reply",
      chatId,
      receipt: createLineSendReceipt({
        messageId: "reply",
        chatId,
        kind: resolveLineReceiptKind(messages),
        messageCount: messages.length,
      }),
    };
  }
  return pushLineMessages(chatId, messages, opts, {
    verboseMessage: (resolvedChatId) => `line: pushed message to ${resolvedChatId}`,
  });
}
async function pushMessageLine(to, text, opts) {
  return sendMessageLine(to, text, {
    ...opts,
    replyToken: void 0,
  });
}
async function replyMessageLine(replyToken, messages, opts) {
  await replyLineMessages(replyToken, messages, opts);
}
async function pushMessagesLine(to, messages, opts) {
  return pushLineMessages(to, messages, opts, { errorContext: "push message" });
}
function createFlexMessage(altText, contents) {
  return {
    type: "flex",
    altText,
    contents,
  };
}
async function pushImageMessage(to, originalContentUrl, previewImageUrl, opts) {
  await validateLineMediaUrl(originalContentUrl);
  if (previewImageUrl) await validateLineMediaUrl(previewImageUrl);
  return pushLineMessages(to, [createImageMessage(originalContentUrl, previewImageUrl)], opts, {
    verboseMessage: (chatId) => `line: pushed image to ${chatId}`,
  });
}
async function pushLocationMessage(to, location, opts) {
  return pushLineMessages(to, [createLocationMessage(location)], opts, {
    verboseMessage: (chatId) => `line: pushed location to ${chatId}`,
  });
}
async function pushFlexMessage(to, altText, contents, opts) {
  return pushLineMessages(
    to,
    [
      {
        type: "flex",
        altText: truncateUtf16Safe(altText, 400),
        contents,
      },
    ],
    opts,
    {
      errorContext: "push flex message",
      verboseMessage: (chatId) => `line: pushed flex message to ${chatId}`,
    },
  );
}
async function pushTemplateMessage(to, template, opts) {
  return pushLineMessages(to, [template], opts, {
    verboseMessage: (chatId) => `line: pushed template message to ${chatId}`,
  });
}
async function pushTextMessageWithQuickReplies(to, text, quickReplyLabels, opts) {
  return pushLineMessages(to, [createTextMessageWithQuickReplies(text, quickReplyLabels)], opts, {
    verboseMessage: (chatId) => `line: pushed message with quick replies to ${chatId}`,
  });
}
function createQuickReplyItems(labels) {
  return {
    items: labels.slice(0, 13).map((label) => ({
      type: "action",
      action: messageAction(label, label),
    })),
  };
}
function createTextMessageWithQuickReplies(text, quickReplyLabels) {
  return {
    type: "text",
    text,
    quickReply: createQuickReplyItems(quickReplyLabels),
  };
}
async function showLoadingAnimation(chatId, opts) {
  const { client } = createLineMessagingClient(opts);
  try {
    await client.showLoadingAnimation({
      chatId: normalizeTarget(chatId),
      loadingSeconds: opts.loadingSeconds ?? 20,
    });
    logVerbose(`line: showing loading animation to ${chatId}`);
  } catch (err) {
    logVerbose(`line: loading animation failed (non-fatal): ${String(err)}`);
  }
}
async function getUserProfile(userId, opts) {
  if (opts.useCache ?? true) {
    const cached = userProfileCache.get(userId);
    if (cached && Date.now() - cached.fetchedAt < PROFILE_CACHE_TTL_MS)
      return {
        displayName: cached.displayName,
        pictureUrl: cached.pictureUrl,
      };
  }
  const { client } = createLineMessagingClient(opts);
  try {
    const profile = await client.getProfile(userId);
    const result = {
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
    };
    userProfileCache.set(userId, {
      ...result,
      fetchedAt: Date.now(),
    });
    return result;
  } catch (err) {
    logVerbose(`line: failed to fetch profile for ${userId}: ${String(err)}`);
    return null;
  }
}
async function getUserDisplayName(userId, opts) {
  return (await getUserProfile(userId, opts))?.displayName ?? userId;
}
//#endregion
//#region extensions/line/src/markdown-to-line.ts
/**
 * Regex patterns for markdown detection
 */
const MARKDOWN_TABLE_REGEX = /^\|(.+)\|[\r\n]+\|[-:\s|]+\|[\r\n]+((?:\|.+\|[\r\n]*)+)/gm;
const MARKDOWN_CODE_BLOCK_REGEX = /```(\w*)\n([\s\S]*?)```/g;
const MARKDOWN_LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g;
/**
 * Detect and extract markdown tables from text
 */
function extractMarkdownTables(text) {
  const tables = [];
  let textWithoutTables = text;
  MARKDOWN_TABLE_REGEX.lastIndex = 0;
  let match;
  const matches = [];
  while ((match = MARKDOWN_TABLE_REGEX.exec(text)) !== null) {
    const fullMatch = expectDefined(match[0], "Markdown table match");
    const headerLine = expectDefined(match[1], "Markdown table header capture");
    const bodyLines = expectDefined(match[2], "Markdown table body capture");
    const headers = parseTableRow(headerLine);
    const rows = bodyLines
      .trim()
      .split(/[\r\n]+/)
      .filter((line) => line.trim())
      .map(parseTableRow);
    if (headers.length > 0 && rows.length > 0)
      matches.push({
        fullMatch,
        table: {
          headers,
          rows,
        },
      });
  }
  for (const { fullMatch, table } of matches.toReversed()) {
    tables.unshift(table);
    textWithoutTables = textWithoutTables.replace(fullMatch, "");
  }
  return {
    tables,
    textWithoutTables,
  };
}
/**
 * Parse a single table row (pipe-separated values)
 */
function parseTableRow(row) {
  return row
    .split("|")
    .map((cell) => cell.trim())
    .filter((cell, index, arr) => {
      if (index === 0 && cell === "") return false;
      if (index === arr.length - 1 && cell === "") return false;
      return true;
    });
}
/**
 * Convert a markdown table to a LINE Flex Message bubble
 */
function convertTableToFlexBubble(table) {
  const parseCell = (value) => {
    const raw = value?.trim() ?? "";
    if (!raw)
      return {
        text: "-",
        bold: false,
        hasMarkup: false,
      };
    let hasMarkup = false;
    return {
      text:
        raw
          .replace(/\*\*(.+?)\*\*/g, (_, inner) => {
            hasMarkup = true;
            return String(inner);
          })
          .trim() || "-",
      bold: /^\*\*.+\*\*$/.test(raw),
      hasMarkup,
    };
  };
  const headerCells = table.headers.map((header) => parseCell(header));
  const rowCells = table.rows.map((row) => row.map((cell) => parseCell(cell)));
  const hasInlineMarkup =
    headerCells.some((cell) => cell.hasMarkup) ||
    rowCells.some((row) => row.some((cell) => cell.hasMarkup));
  if (table.headers.length === 2 && !hasInlineMarkup) {
    const items = rowCells.map((row) => ({
      name: row[0]?.text ?? "-",
      value: row[1]?.text ?? "-",
    }));
    return createReceiptCard({
      title: headerCells.map((cell) => cell.text).join(" / "),
      items,
    });
  }
  return {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          contents: headerCells.map((cell) => ({
            type: "text",
            text: cell.text,
            weight: "bold",
            size: "sm",
            color: "#333333",
            flex: 1,
            wrap: true,
          })),
          paddingBottom: "sm",
        },
        {
          type: "separator",
          margin: "sm",
        },
        ...rowCells.slice(0, 10).map((row, rowIndex) => {
          return {
            type: "box",
            layout: "horizontal",
            contents: table.headers.map((_, colIndex) => {
              const cell = row[colIndex] ?? {
                text: "-",
                bold: false,
                hasMarkup: false,
              };
              return {
                type: "text",
                text: cell.text,
                size: "sm",
                color: "#666666",
                flex: 1,
                wrap: true,
                weight: cell.bold ? "bold" : void 0,
              };
            }),
            margin: rowIndex === 0 ? "md" : "sm",
          };
        }),
      ],
      paddingAll: "lg",
    },
  };
}
/**
 * Detect and extract code blocks from text
 */
function extractCodeBlocks(text) {
  const codeBlocks = [];
  let textWithoutCode = text;
  MARKDOWN_CODE_BLOCK_REGEX.lastIndex = 0;
  let match;
  const matches = [];
  while ((match = MARKDOWN_CODE_BLOCK_REGEX.exec(text)) !== null) {
    const fullMatch = expectDefined(match[0], "Markdown code block match");
    const language = match[1] || void 0;
    const code = expectDefined(match[2], "Markdown code body capture");
    matches.push({
      fullMatch,
      block: {
        language,
        code: code.trim(),
      },
    });
  }
  for (const { fullMatch, block } of matches.toReversed()) {
    codeBlocks.unshift(block);
    textWithoutCode = textWithoutCode.replace(fullMatch, "");
  }
  return {
    codeBlocks,
    textWithoutCode,
  };
}
/**
 * Convert a code block to a LINE Flex Message bubble
 */
function convertCodeBlockToFlexBubble(block) {
  const titleText = block.language ? `Code (${block.language})` : "Code";
  const displayCode =
    block.code.length > 2e3 ? truncateUtf16Safe(block.code, 2e3) + "\n..." : block.code;
  return {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: titleText,
          weight: "bold",
          size: "sm",
          color: "#666666",
        },
        {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: displayCode,
              size: "xs",
              color: "#333333",
              wrap: true,
            },
          ],
          backgroundColor: "#F5F5F5",
          paddingAll: "md",
          cornerRadius: "md",
          margin: "sm",
        },
      ],
      paddingAll: "lg",
    },
  };
}
/**
 * Extract markdown links from text
 */
function extractLinks(text) {
  const links = [];
  MARKDOWN_LINK_REGEX.lastIndex = 0;
  let match;
  while ((match = MARKDOWN_LINK_REGEX.exec(text)) !== null)
    links.push({
      text: expectDefined(match[1], "Markdown link text capture"),
      url: expectDefined(match[2], "Markdown link URL capture"),
    });
  return {
    links,
    textWithLinks: text.replace(MARKDOWN_LINK_REGEX, "$1"),
  };
}
/**
 * Create a Flex Message with tappable link buttons
 */
function convertLinksToFlexBubble(links) {
  return {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "Links",
          weight: "bold",
          size: "md",
          color: "#333333",
        },
      ],
      paddingAll: "lg",
      paddingBottom: "sm",
    },
    footer: {
      type: "box",
      layout: "vertical",
      contents: links.slice(0, 4).map((link, index) => ({
        type: "button",
        action: uriAction(link.text, link.url),
        style: index === 0 ? "primary" : "secondary",
        margin: index > 0 ? "sm" : void 0,
      })),
      paddingAll: "md",
    },
  };
}
/**
 * Main function: Process text for LINE output
 * - Extracts tables → Flex Messages
 * - Extracts code blocks → Flex Messages
 * - Strips remaining markdown
 * - Returns processed text + Flex Messages
 */
function processLineMessage(text) {
  const flexMessages = [];
  let processedText = text;
  const { tables, textWithoutTables } = extractMarkdownTables(processedText);
  processedText = textWithoutTables;
  for (const table of tables) {
    const bubble = convertTableToFlexBubble(table);
    flexMessages.push(toFlexMessage("Table", bubble));
  }
  const { codeBlocks, textWithoutCode } = extractCodeBlocks(processedText);
  processedText = textWithoutCode;
  for (const block of codeBlocks) {
    const bubble = convertCodeBlockToFlexBubble(block);
    flexMessages.push(toFlexMessage("Code", bubble));
  }
  const { textWithLinks } = extractLinks(processedText);
  processedText = textWithLinks;
  processedText = stripMarkdown(processedText, { assistantTranscriptRoleHeaders: true });
  return {
    text: processedText,
    flexMessages,
  };
}
/**
 * Check if text contains markdown that needs conversion
 */
function hasMarkdownToConvert(text) {
  MARKDOWN_TABLE_REGEX.lastIndex = 0;
  if (MARKDOWN_TABLE_REGEX.test(text)) return true;
  MARKDOWN_CODE_BLOCK_REGEX.lastIndex = 0;
  if (MARKDOWN_CODE_BLOCK_REGEX.test(text)) return true;
  if (/\*\*[^*]+\*\*/.test(text)) return true;
  if (/~~[^~]+~~/.test(text)) return true;
  if (/^#{1,6}\s+/m.test(text)) return true;
  if (/^>\s+/m.test(text)) return true;
  return false;
}
//#endregion
export {
  createButtonMenu as A,
  pushTemplateMessage as C,
  showLoadingAnimation as D,
  sendMessageLine as E,
  createImageCarouselColumn as F,
  createLinkMenu as I,
  createProductCarousel as L,
  createCarouselColumn as M,
  createConfirmTemplate as N,
  resolveLineChannelAccessToken as O,
  createImageCarousel as P,
  createTemplateCarousel as R,
  pushMessagesLine as S,
  replyMessageLine as T,
  getUserProfile as _,
  extractLinks as a,
  pushLocationMessage as b,
  processLineMessage as c,
  createImageMessage as d,
  createLocationMessage as f,
  getUserDisplayName as g,
  createVideoMessage as h,
  extractCodeBlocks as i,
  createButtonTemplate as j,
  buildTemplateMessageFromPayload as k,
  createAudioMessage as l,
  createTextMessageWithQuickReplies as m,
  convertLinksToFlexBubble as n,
  extractMarkdownTables as o,
  createQuickReplyItems as p,
  convertTableToFlexBubble as r,
  hasMarkdownToConvert as s,
  convertCodeBlockToFlexBubble as t,
  createFlexMessage as u,
  pushFlexMessage as v,
  pushTextMessageWithQuickReplies as w,
  pushMessageLine as x,
  pushImageMessage as y,
  createYesNoConfirm as z,
};
