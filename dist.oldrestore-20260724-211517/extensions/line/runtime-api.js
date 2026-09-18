import { t as DEFAULT_ACCOUNT_ID } from "../../account-id-C7N4Rwku.js";
import {
  i as resolveLineAccount,
  n as normalizeAccountId,
  r as resolveDefaultLineAccountId,
  t as listLineAccountIds,
} from "../../accounts-ClT4gAGW.js";
import { n as firstDefined } from "../../allow-from-o-cfFFcK.js";
import { s as createMessageReceiveContext } from "../../channel-outbound-DlkFd7rO.js";
import { n as stripMarkdown } from "../../chunk-items-BB3E9W12.js";
import { t as clearAccountEntryFields } from "../../config-helpers-CGWarYiR.js";
import { r as buildChannelConfigSchema } from "../../config-schema-qmCQZl6j.js";
import {
  _ as createNotificationBubble,
  a as datetimePickerAction,
  c as uriAction,
  d as createReceiptCard,
  f as createActionCard,
  g as createListCard,
  h as createInfoCard,
  i as createMediaPlayerCard,
  l as createAgendaCard,
  m as createImageCard,
  n as createAppleTvRemoteCard,
  o as messageAction,
  p as createCarousel,
  r as createDeviceControlCard,
  s as postbackAction,
  t as toFlexMessage,
  u as createEventCard,
} from "../../flex-templates-BBTGBUm1.js";
import { r as logVerbose, t as danger } from "../../globals-CNUzHTcU.js";
import "../../agent-media-payload-B2wNYTcU.js";
import "../../runtime-env-D0V-7Gqz.js";
import { t as formatDocsLink } from "../../links-ClIwBcy4.js";
import "../../core-V3U0lOIj.js";
import "../../channel-config-schema-C-vJvjtu.js";
import { r as getAgentScopedMediaLocalRoots } from "../../local-roots-CgMgS9r2.js";
import "../../setup-CM3hyaUe.js";
import {
  A as createButtonMenu,
  C as pushTemplateMessage,
  D as showLoadingAnimation,
  E as sendMessageLine,
  F as createImageCarouselColumn,
  I as createLinkMenu,
  L as createProductCarousel,
  M as createCarouselColumn,
  N as createConfirmTemplate,
  O as resolveLineChannelAccessToken,
  P as createImageCarousel,
  R as createTemplateCarousel,
  S as pushMessagesLine,
  T as replyMessageLine,
  _ as getUserProfile,
  a as extractLinks,
  b as pushLocationMessage,
  c as processLineMessage,
  d as createImageMessage,
  f as createLocationMessage,
  g as getUserDisplayName,
  h as createVideoMessage,
  i as extractCodeBlocks,
  j as createButtonTemplate,
  k as buildTemplateMessageFromPayload,
  l as createAudioMessage,
  m as createTextMessageWithQuickReplies,
  n as convertLinksToFlexBubble,
  o as extractMarkdownTables,
  p as createQuickReplyItems,
  r as convertTableToFlexBubble,
  s as hasMarkdownToConvert,
  t as convertCodeBlockToFlexBubble,
  u as createFlexMessage,
  v as pushFlexMessage,
  w as pushTextMessageWithQuickReplies,
  x as pushMessageLine,
  y as pushImageMessage,
  z as createYesNoConfirm,
} from "../../markdown-to-line-BFRzwV-n.js";
import "../../web-media-Cv2iCdbz.js";
import "../../media-mime-B8w43n5Y.js";
import { t as MessagingApiClient } from "../../messagingApiClient-BSDrulNf.js";
import { l as mimeTypeFromFilePath } from "../../mime-BSEMEb3s.js";
import {
  a as validateLineSignature,
  c as normalizeAllowFrom,
  i as parseLineWebhookBody,
  n as createLineNodeWebhookHandler,
  o as downloadLineMedia,
  r as readLineWebhookRequestBody,
  s as MessagingApiBlobClient,
  t as monitorLineProvider,
} from "../../monitor-BA9UQ5MB.js";
import { t as probeLineBot } from "../../probe-Bm2Oy6jM.js";
import {
  a as resolveLineGroupConfigEntry,
  i as resolveExactLineGroupConfigKey,
  o as resolveLineGroupLookupIds,
  r as setLineRuntime,
  s as resolveLineGroupsConfig,
} from "../../quick-reply-fallback-m7ZkEiL4.js";
import {
  i as LineConfigSchema,
  n as parseLineDirectives,
  r as LineChannelConfigSchema,
  t as hasLineDirectives,
} from "../../reply-payload-transform-DCcbAKUq.js";
import {
  J as setSetupChannelEnabled,
  Q as splitSetupEntries,
} from "../../setup-wizard-helpers-Kz9xlQ7e.js";
import {
  o as buildTokenChannelStatusSummary,
  r as buildComputedAccountStatusSnapshot,
} from "../../status-helpers-SdoCNDDu.js";
import { r as loadWebMediaRaw } from "../../web-media-3hQ71Ejp.js";
//#region extensions/line/src/webhook.ts
const LINE_WEBHOOK_MAX_RAW_BODY_BYTES = 64 * 1024;
function readRawBody(req) {
  const rawBody =
    req.rawBody ?? (typeof req.body === "string" || Buffer.isBuffer(req.body) ? req.body : null);
  if (!rawBody) return null;
  return Buffer.isBuffer(rawBody) ? rawBody.toString("utf-8") : rawBody;
}
function parseWebhookBody(rawBody) {
  if (!rawBody) return null;
  return parseLineWebhookBody(rawBody);
}
function logLineWebhookDispatchError(runtime, err) {
  runtime?.error?.(danger(`line webhook dispatch failed: ${String(err)}`));
}
function createLineWebhookMiddleware(options) {
  const { channelSecret, onEvents, runtime } = options;
  return async (req, res, _next) => {
    let receiveContext;
    try {
      const signature = req.headers["x-line-signature"];
      if (!signature || typeof signature !== "string") {
        res.status(400).json({ error: "Missing X-Line-Signature header" });
        return;
      }
      const rawBody = readRawBody(req);
      if (!rawBody) {
        res.status(400).json({ error: "Missing raw request body for signature verification" });
        return;
      }
      if (Buffer.byteLength(rawBody, "utf-8") > LINE_WEBHOOK_MAX_RAW_BODY_BYTES) {
        res.status(413).json({ error: "Payload too large" });
        return;
      }
      if (!validateLineSignature(rawBody, signature, channelSecret)) {
        logVerbose("line: webhook signature validation failed");
        res.status(401).json({ error: "Invalid signature" });
        return;
      }
      const body = parseWebhookBody(rawBody);
      if (!body) {
        res.status(400).json({ error: "Invalid webhook payload" });
        return;
      }
      receiveContext = createMessageReceiveContext({
        id: `${Date.now()}:line:webhook`,
        channel: "line",
        message: body,
        ackPolicy: "after_receive_record",
        onAck: () => {
          res.status(200).json({ status: "ok" });
        },
      });
      if (receiveContext.shouldAckAfter("receive_record")) await receiveContext.ack();
      if (body.events && body.events.length > 0) {
        logVerbose(`line: received ${body.events.length} webhook events`);
        Promise.resolve()
          .then(() => onEvents(body))
          .catch((err) => logLineWebhookDispatchError(runtime, err));
      }
    } catch (err) {
      await receiveContext?.nack(err);
      runtime?.error?.(danger(`line webhook error: ${String(err)}`));
      if (!res.headersSent) res.status(500).json({ error: "Internal server error" });
    }
  };
}
function startLineWebhook(options) {
  const channelSecret =
    typeof options.channelSecret === "string" ? options.channelSecret.trim() : "";
  if (!channelSecret)
    throw new Error(
      "LINE webhook mode requires a non-empty channel secret. Set channels.line.channelSecret in your config.",
    );
  return {
    path: options.path ?? "/line/webhook",
    handler: createLineWebhookMiddleware({
      channelSecret,
      onEvents: options.onEvents,
      runtime: options.runtime,
    }),
  };
}
//#endregion
//#region extensions/line/src/rich-menu.ts
const graphemeSegmenter = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function getClient(opts) {
  const account = resolveLineAccount({
    cfg: opts.cfg,
    accountId: opts.accountId,
  });
  return new MessagingApiClient({
    channelAccessToken: resolveLineChannelAccessToken(opts.channelAccessToken, account),
  });
}
function getBlobClient(opts) {
  const account = resolveLineAccount({
    cfg: opts.cfg,
    accountId: opts.accountId,
  });
  return new MessagingApiBlobClient({
    channelAccessToken: resolveLineChannelAccessToken(opts.channelAccessToken, account),
  });
}
function truncateGraphemes(input, maxLength) {
  let result = "";
  let count = 0;
  for (const { segment } of graphemeSegmenter.segment(input)) {
    if (count >= maxLength) break;
    result += segment;
    count += 1;
  }
  return result;
}
async function createRichMenu(menu, opts) {
  const client = getClient(opts);
  const richMenuRequest = {
    size: menu.size,
    selected: menu.selected ?? false,
    name: truncateGraphemes(menu.name, 300),
    chatBarText: truncateGraphemes(menu.chatBarText, 14),
    areas: menu.areas,
  };
  const response = await client.createRichMenu(richMenuRequest);
  if (opts.verbose) logVerbose(`line: created rich menu ${response.richMenuId}`);
  return response.richMenuId;
}
async function uploadRichMenuImage(richMenuId, imagePath, opts) {
  const blobClient = getBlobClient(opts);
  const media = await loadWebMediaRaw(imagePath, {
    localRoots: opts.mediaLocalRoots ?? getAgentScopedMediaLocalRoots(opts.cfg),
  });
  const contentType =
    media.contentType === "image/png" || media.contentType === "image/jpeg"
      ? media.contentType
      : mimeTypeFromFilePath(imagePath) === "image/png"
        ? "image/png"
        : "image/jpeg";
  const imageBytes = new ArrayBuffer(media.buffer.byteLength);
  new Uint8Array(imageBytes).set(media.buffer);
  await blobClient.setRichMenuImage(richMenuId, new Blob([imageBytes], { type: contentType }));
  if (opts.verbose) logVerbose(`line: uploaded image to rich menu ${richMenuId}`);
}
async function setDefaultRichMenu(richMenuId, opts) {
  await getClient(opts).setDefaultRichMenu(richMenuId);
  if (opts.verbose) logVerbose(`line: set default rich menu to ${richMenuId}`);
}
async function cancelDefaultRichMenu(opts) {
  await getClient(opts).cancelDefaultRichMenu();
  if (opts.verbose) logVerbose("line: cancelled default rich menu");
}
async function getDefaultRichMenuId(opts) {
  const client = getClient(opts);
  try {
    return (await client.getDefaultRichMenuId()).richMenuId ?? null;
  } catch {
    return null;
  }
}
async function getRichMenuIdOfUser(userId, opts) {
  const client = getClient(opts);
  try {
    return (await client.getRichMenuIdOfUser(userId)).richMenuId ?? null;
  } catch {
    return null;
  }
}
async function getRichMenuList(opts) {
  return (await getClient(opts).getRichMenuList()).richmenus ?? [];
}
async function getRichMenu(richMenuId, opts) {
  const client = getClient(opts);
  try {
    return await client.getRichMenu(richMenuId);
  } catch {
    return null;
  }
}
async function deleteRichMenu(richMenuId, opts) {
  await getClient(opts).deleteRichMenu(richMenuId);
  if (opts.verbose) logVerbose(`line: deleted rich menu ${richMenuId}`);
}
async function createRichMenuAlias(richMenuId, aliasId, opts) {
  await getClient(opts).createRichMenuAlias({
    richMenuId,
    richMenuAliasId: aliasId,
  });
  if (opts.verbose) logVerbose(`line: created alias ${aliasId} for rich menu ${richMenuId}`);
}
async function deleteRichMenuAlias(aliasId, opts) {
  await getClient(opts).deleteRichMenuAlias(aliasId);
  if (opts.verbose) logVerbose(`line: deleted alias ${aliasId}`);
}
function createGridLayout(height, actions) {
  const colWidth = Math.floor(2500 / 3);
  const rowHeight = Math.floor(height / 2);
  return [
    {
      bounds: {
        x: 0,
        y: 0,
        width: colWidth,
        height: rowHeight,
      },
      action: actions[0],
    },
    {
      bounds: {
        x: colWidth,
        y: 0,
        width: colWidth,
        height: rowHeight,
      },
      action: actions[1],
    },
    {
      bounds: {
        x: colWidth * 2,
        y: 0,
        width: colWidth,
        height: rowHeight,
      },
      action: actions[2],
    },
    {
      bounds: {
        x: 0,
        y: rowHeight,
        width: colWidth,
        height: rowHeight,
      },
      action: actions[3],
    },
    {
      bounds: {
        x: colWidth,
        y: rowHeight,
        width: colWidth,
        height: rowHeight,
      },
      action: actions[4],
    },
    {
      bounds: {
        x: colWidth * 2,
        y: rowHeight,
        width: colWidth,
        height: rowHeight,
      },
      action: actions[5],
    },
  ];
}
function createDefaultMenuConfig() {
  return {
    size: {
      width: 2500,
      height: 843,
    },
    selected: false,
    name: "Default Menu",
    chatBarText: "Menu",
    areas: createGridLayout(843, [
      messageAction("Help", "/help"),
      messageAction("Status", "/status"),
      messageAction("Settings", "/settings"),
      messageAction("About", "/about"),
      messageAction("Feedback", "/feedback"),
      messageAction("Contact", "/contact"),
    ]),
  };
}
//#endregion
export {
  DEFAULT_ACCOUNT_ID,
  LineChannelConfigSchema,
  LineConfigSchema,
  buildChannelConfigSchema,
  buildComputedAccountStatusSnapshot,
  buildTemplateMessageFromPayload,
  buildTokenChannelStatusSummary,
  cancelDefaultRichMenu,
  clearAccountEntryFields,
  convertCodeBlockToFlexBubble,
  convertLinksToFlexBubble,
  convertTableToFlexBubble,
  createActionCard,
  createAgendaCard,
  createAppleTvRemoteCard,
  createAudioMessage,
  createButtonMenu,
  createButtonTemplate,
  createCarousel,
  createCarouselColumn,
  createConfirmTemplate,
  createDefaultMenuConfig,
  createDeviceControlCard,
  createEventCard,
  createFlexMessage,
  createGridLayout,
  createImageCard,
  createImageCarousel,
  createImageCarouselColumn,
  createImageMessage,
  createInfoCard,
  createLineNodeWebhookHandler,
  createLineWebhookMiddleware,
  createLinkMenu,
  createListCard,
  createLocationMessage,
  createMediaPlayerCard,
  createNotificationBubble,
  createProductCarousel,
  createQuickReplyItems,
  createReceiptCard,
  createRichMenu,
  createRichMenuAlias,
  createTemplateCarousel,
  createTextMessageWithQuickReplies,
  createVideoMessage,
  createYesNoConfirm,
  datetimePickerAction,
  deleteRichMenu,
  deleteRichMenuAlias,
  downloadLineMedia,
  extractCodeBlocks,
  extractLinks,
  extractMarkdownTables,
  firstDefined,
  formatDocsLink,
  getDefaultRichMenuId,
  getRichMenu,
  getRichMenuIdOfUser,
  getRichMenuList,
  getUserDisplayName,
  getUserProfile,
  hasLineDirectives,
  hasMarkdownToConvert,
  listLineAccountIds,
  messageAction,
  monitorLineProvider,
  normalizeAccountId,
  normalizeAllowFrom,
  parseLineDirectives,
  parseLineWebhookBody,
  postbackAction,
  probeLineBot,
  processLineMessage,
  pushFlexMessage,
  pushImageMessage,
  pushLocationMessage,
  pushMessageLine,
  pushMessagesLine,
  pushTemplateMessage,
  pushTextMessageWithQuickReplies,
  readLineWebhookRequestBody,
  replyMessageLine,
  resolveDefaultLineAccountId,
  resolveExactLineGroupConfigKey,
  resolveLineAccount,
  resolveLineChannelAccessToken,
  resolveLineGroupConfigEntry,
  resolveLineGroupLookupIds,
  resolveLineGroupsConfig,
  sendMessageLine,
  setDefaultRichMenu,
  setLineRuntime,
  setSetupChannelEnabled,
  showLoadingAnimation,
  splitSetupEntries,
  startLineWebhook,
  stripMarkdown,
  toFlexMessage,
  uploadRichMenuImage,
  uriAction,
  validateLineSignature,
};
