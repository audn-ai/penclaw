import * as crypto$1 from "node:crypto";
import crypto, { createHash } from "node:crypto";
import fs from "node:fs";
import * as http$1 from "node:http";
import os from "node:os";
import path from "node:path";
import * as Lark from "@larksuiteoapi/node-sdk";
import { n as isAbortRequestText } from "./abort-primitives-CsS4KkjK.js";
import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import {
  _ as requestFeishuApi,
  d as extractReplyText,
  g as readString,
  h as parseCommentContentElements,
  l as resolveFeishuRuntimeAccount,
  m as normalizeString,
  p as isRecord$1,
  s as resolveFeishuAccount,
  u as encodeQuery,
  v as buildFeishuCommentTarget,
  y as normalizeCommentFileType,
} from "./accounts-upJPqv8I.js";
import { n as normalizeAgentId$1 } from "./agent-id-DDgUze4y.js";
import { f as stripReasoningTagsFromText } from "./assistant-visible-text-DV1Yognj.js";
import {
  n as resolveConfiguredBindingRoute,
  r as resolveRuntimeConversationBindingRoute,
  t as ensureConfiguredBindingRouteReady,
} from "./binding-routing-Z88YfeFH.js";
import { t as asBoolean } from "./boolean-CrriykWV.js";
import { n as isBtwRequestText } from "./btw-command-BFvbns93.js";
import { h as resolveChannelConfigWrites } from "./channel-config-helpers-BFvX3ldW.js";
import { n as createChannelPairingController } from "./channel-pairing-1V8FM4wM.js";
import {
  i as getFeishuUserAgent,
  n as createFeishuClient,
  o as resolveConfiguredHttpTimeoutMs,
  r as createFeishuWSClient,
  t as createEventDispatcher,
} from "./client-BCjLU970.js";
import { t as buildChannelInboundEventContext } from "./context-DMJN91Z-.js";
import { t as resolveChannelContextVisibilityMode } from "./context-visibility-BVlvSMUZ.js";
import { t as evaluateSupplementalContextVisibility } from "./context-visibility-C5CaKMWO.js";
import {
  o as resolveConfiguredFeishuGroupSessionScope,
  t as buildFeishuConversationId,
} from "./conversation-id-BvaiLsbQ.js";
import "./error-runtime-BIAwr399.js";
import "./number-runtime-B-n-wjMn.js";
import "./security-runtime-CraX8Pqe.js";
import { l as resolvePinnedMainDmOwnerFromAllowlist } from "./dm-policy-shared-d7KFGRtT.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./text-chunking-Dr19ggf-.js";
import "./text-utility-runtime-CJESZCN5.js";
import {
  i as createCommentTypingReactionLifecycle,
  l as getChatInfo,
  t as deliverCommentThreadText,
} from "./drive-DIXColLB.js";
import { c as formatReasoningMessage } from "./embedded-agent-utils-Coji3F8W.js";
import "./routing-CwvmVRHd.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-Da47iiZE.js";
import "./history-DdfM33Aj.js";
import { i as installRequestBodyLimitGuard } from "./http-body-aoMvQQlg.js";
import { n as resolveAgentOutboundIdentity } from "./identity-SEW64WfD.js";
import { t as readFeishuJsonResponse } from "./json-response-BANLr5Ru.js";
import {
  g as toInboundMediaFacts,
  m as formatInboundMediaUnavailableText,
} from "./kernel-BhdvbEs2.js";
import { r as logTypingFailure } from "./logging-gUWPKC5g.js";
import "./channel-outbound-DlkFd7rO.js";
import { t as fetchBotIdentityForMonitor } from "./monitor.startup-Ch3u6kYe.js";
import "./ssrf-runtime-DJ478vv8.js";
import { _ as resolveRequestClientIp } from "./net-BpMGIYrw.js";
import "./conversation-runtime-DuXhVyjf.js";
import "./agent-runtime-BiQiwmwD.js";
import "./command-primitives-runtime-DqAUH7bQ.js";
import "./channel-inbound-vhkYEe2n.js";
import "./channel-feedback-lNNgzRXo.js";
import {
  C as resolveExpiresAtMsFromDurationMs,
  S as resolveDateTimestampMs,
  T as resolveExpiresAtMsFromDurationSeconds,
  j as resolveTimerTimeoutMs,
  m as isFutureDateTimestampMs,
  o as asDateTimestampMs,
  y as parseStrictNonNegativeInteger,
} from "./number-coercion-CJQ8TR--.js";
import { t as createClaimableDedupe } from "./persistent-dedupe-CMTHL22F.js";
import { n as raceWithTimeoutAndAbort, r as waitForAbortableDelay } from "./probe-gUyS3oUp.js";
import { n as asNullableRecord, o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { t as createChannelHistoryWindow } from "./reply-history-DTabwFaD.js";
import {
  g as sendMediaWithLeadingCaption,
  h as resolveTextChunksWithFallback,
  m as resolveSendableOutboundReplyParts,
} from "./reply-payload-DDwHXDkv.js";
import { t as createChannelReplyPipeline } from "./reply-pipeline-uYpC1TSz.js";
import { t as createReplyPrefixContext } from "./reply-prefix-C5dokQJN.js";
import {
  a as resolveInboundLastRouteSessionKey,
  i as resolveAgentRoute,
} from "./resolve-route-oiOq6bK9.js";
import { t as getFeishuRuntime } from "./runtime-BP4XWQ9i.js";
import {
  a as warnMissingProviderGroupPolicyFallbackOnce,
  i as resolveOpenProviderRuntimeGroupPolicy,
  r as resolveDefaultGroupPolicy,
} from "./runtime-group-policy-BEjP88cf.js";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.js";
import "./runtime-api-BMHCi6Eq.js";
import {
  _ as resolveFeishuIdentityEmoji,
  c as parsePostContent,
  d as isMentionForwardRequest,
  f as isFeishuGroupChatType,
  g as normalizeFeishuExternalKey,
  h as shouldSuppressFeishuTextForVoiceMedia,
  i as sendCardFeishu,
  l as extractMentionTargets,
  m as sendMediaFeishu,
  n as getMessageFeishu,
  o as sendMessageFeishu,
  p as saveMessageResourceFeishu,
  r as listFeishuThreadMessages,
  s as sendStructuredCardFeishu,
  u as isFeishuBroadcastMention,
} from "./send-CHsdxp9H.js";
import {
  C as normalizeFeishuChatType$2,
  D as createFeishuCardInteractionEnvelope,
  E as buildFeishuCardActionTextFallback,
  O as decodeFeishuCardAction,
  S as resolveFeishuReplyPolicy,
  _ as resolveFeishuDmIngressAccess,
  b as resolveFeishuGroupSenderActivationIngressAccess,
  g as normalizeFeishuAllowEntry,
  h as hasExplicitFeishuGroupConfig,
  o as resolveFeishuCardTemplate,
  v as resolveFeishuGroupConfig,
  w as resolveFeishuChatType,
  y as resolveFeishuGroupConversationIngressAccess,
} from "./send-result-BY9GGIVt.js";
import { r as getSessionEntry } from "./session-store-runtime-BwE6SlGz.js";
import {
  h as resolveChannelPreviewStreamMode,
  j as resolveChannelStreamingBlockEnabled,
  s as formatChannelProgressDraftLineForEntry,
  u as isChannelProgressDraftWorkToolName,
} from "./streaming-D_YE0SPS.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  p as readStringValue,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { i as resolveReceiveIdType } from "./targets-5VnlkfaZ.js";
import { t as createFeishuThreadBindingManager } from "./thread-bindings-DNvmknT8.js";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import {
  a as createFixedWindowRateLimiter,
  o as createWebhookAnomalyTracker,
  r as WEBHOOK_RATE_LIMIT_DEFAULTS,
  t as WEBHOOK_ANOMALY_COUNTER_DEFAULTS,
} from "./webhook-ingress-BloIhSnv.js";
import {
  c as readWebhookBodyOrReject,
  r as applyBasicWebhookRequestGuards,
} from "./webhook-request-guards-B3epkORT.js";
//#region extensions/feishu/src/bot-agent-body.ts
const MAX_MENTION_CONTEXT_NAME_LENGTH = 80;
function formatMentionNameForAgentContext(name) {
  const normalized = Array.from(name, (char) => {
    return char.charCodeAt(0) < 32 || char === "[" || char === "]" ? " " : char;
  })
    .join("")
    .replace(/\s+/g, " ")
    .trim();
  const bounded =
    normalized.length > MAX_MENTION_CONTEXT_NAME_LENGTH
      ? `${truncateUtf16Safe(normalized, MAX_MENTION_CONTEXT_NAME_LENGTH - 3)}...`
      : normalized;
  return JSON.stringify(bounded || "unknown");
}
function buildFeishuAgentBody(params) {
  const { ctx, quotedContent, permissionErrorForAgent, botOpenId } = params;
  let messageBody = ctx.content;
  if (quotedContent) messageBody = `[Replying to: "${quotedContent}"]\n\n${ctx.content}`;
  messageBody = `${ctx.senderName ?? ctx.senderOpenId}: ${messageBody}`;
  if (ctx.hasAnyMention) {
    const botIdHint = botOpenId?.trim();
    messageBody +=
      '\n\n[System: The content may include mention tags in the form <at user_id="...">name</at>. Treat these as real mentions of Feishu entities (users or bots).]';
    if (botIdHint)
      messageBody += `\n[System: If user_id is "${botIdHint}", that mention refers to you.]`;
  }
  if (ctx.mentionTargets && ctx.mentionTargets.length > 0) {
    const targetNames = ctx.mentionTargets
      .map((target) => formatMentionNameForAgentContext(target.name))
      .join(", ");
    messageBody += `\n\n[System: Feishu users mentioned in the incoming message, for context only: ${targetNames}. Do not notify or mention these users solely because they are listed here.]`;
  }
  messageBody = `[message_id: ${ctx.messageId}]\n${messageBody}`;
  if (permissionErrorForAgent) {
    const grantUrl = permissionErrorForAgent.grantUrl ?? "";
    messageBody += `\n\n[System: The bot encountered a Feishu API permission error. Please inform the user about this issue and provide the permission grant URL for the admin to authorize. Permission grant URL: ${grantUrl}]`;
  }
  return messageBody;
}
//#endregion
//#region extensions/feishu/src/bot-broadcast.ts
function resolveBroadcastAgents(cfg, peerId) {
  const broadcast = cfg.broadcast;
  if (!broadcast || typeof broadcast !== "object") return null;
  const agents = broadcast[peerId];
  return Array.isArray(agents) && agents.length > 0 ? agents : null;
}
function buildBroadcastSessionKey(baseSessionKey, originalAgentId, targetAgentId) {
  const prefix = `agent:${originalAgentId}:`;
  return baseSessionKey.startsWith(prefix)
    ? `agent:${targetAgentId}:${baseSessionKey.slice(prefix.length)}`
    : baseSessionKey;
}
//#endregion
//#region extensions/feishu/src/bot-content.ts
function resolveFeishuGroupSession(params) {
  const { chatId, senderOpenId, messageId, rootId, threadId, chatType, groupConfig, feishuCfg } =
    params;
  const normalizedThreadId = threadId?.trim();
  const normalizedRootId = rootId?.trim();
  const threadReply = Boolean(normalizedThreadId || normalizedRootId);
  const replyInThread =
    (groupConfig?.replyInThread ?? feishuCfg?.replyInThread ?? "disabled") === "enabled" ||
    threadReply;
  const legacyTopicSessionMode =
    groupConfig?.topicSessionMode ?? feishuCfg?.topicSessionMode ?? "disabled";
  const groupSessionScope =
    groupConfig?.groupSessionScope ??
    feishuCfg?.groupSessionScope ??
    (legacyTopicSessionMode === "enabled" ? "group_topic" : "group");
  const topicScope =
    groupSessionScope === "group_topic" || groupSessionScope === "group_topic_sender"
      ? ((chatType === "topic_group" ? (normalizedThreadId ?? normalizedRootId) : void 0) ??
        normalizedRootId ??
        normalizedThreadId ??
        (replyInThread ? messageId : null))
      : null;
  let peerId;
  switch (groupSessionScope) {
    case "group_sender":
      peerId = buildFeishuConversationId({
        chatId,
        scope: "group_sender",
        senderOpenId,
      });
      break;
    case "group_topic":
      peerId = topicScope
        ? buildFeishuConversationId({
            chatId,
            scope: "group_topic",
            topicId: topicScope,
          })
        : chatId;
      break;
    case "group_topic_sender":
      peerId = topicScope
        ? buildFeishuConversationId({
            chatId,
            scope: "group_topic_sender",
            topicId: topicScope,
            senderOpenId,
          })
        : buildFeishuConversationId({
            chatId,
            scope: "group_sender",
            senderOpenId,
          });
      break;
    default:
      peerId = chatId;
      break;
  }
  return {
    peerId,
    parentPeer:
      topicScope &&
      (groupSessionScope === "group_topic" || groupSessionScope === "group_topic_sender")
        ? {
            kind: "group",
            id: chatId,
          }
        : null,
    groupSessionScope,
    replyInThread,
    threadReply,
  };
}
function parseMessageContent(content, messageType) {
  if (messageType === "post") return parsePostContent(content).textContent;
  try {
    const parsed = JSON.parse(content);
    if (messageType === "text") return parsed.text || "";
    if (FEISHU_MEDIA_MESSAGE_TYPES.has(messageType))
      return formatFeishuMediaContent(parsed, messageType).body;
    if (messageType === "share_chat") {
      if (parsed && typeof parsed === "object") {
        const share = parsed;
        if (typeof share.body === "string" && share.body.trim()) return share.body.trim();
        if (typeof share.summary === "string" && share.summary.trim()) return share.summary.trim();
        if (typeof share.share_chat_id === "string" && share.share_chat_id.trim())
          return `[Forwarded message: ${share.share_chat_id.trim()}]`;
      }
      return "[Forwarded message]";
    }
    if (messageType === "merge_forward") return "[Merged and Forwarded Message - loading...]";
    return content;
  } catch {
    return content;
  }
}
const FEISHU_MEDIA_MESSAGE_TYPES = /* @__PURE__ */ new Set([
  "image",
  "file",
  "audio",
  "video",
  "media",
  "sticker",
]);
function formatFeishuMediaContent(parsed, messageType) {
  const speechToText =
    messageType === "audio" && typeof parsed.speech_to_text === "string"
      ? parsed.speech_to_text.trim()
      : "";
  if (speechToText) return { body: speechToText };
  const placeholder = inferPlaceholder(messageType);
  const fileName = typeof parsed.file_name === "string" ? parsed.file_name.trim() : "";
  return {
    body: fileName ? `${placeholder} (${fileName})` : placeholder,
    mediaPlaceholder: placeholder,
    unavailableBody: fileName || void 0,
  };
}
function resolveFeishuMediaFailurePresentation(content, messageType) {
  if (messageType === "post")
    return {
      unavailableBody: parsePostContent(content, {
        renderMediaPlaceholders: false,
        emptyTextFallback: "",
      }).textContent,
    };
  if (!FEISHU_MEDIA_MESSAGE_TYPES.has(messageType)) return {};
  try {
    const parsed = JSON.parse(content);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const presentation = formatFeishuMediaContent(parsed, messageType);
    return {
      mediaPlaceholder: presentation.mediaPlaceholder,
      unavailableBody: presentation.unavailableBody,
    };
  } catch {
    return {};
  }
}
function formatSubMessageContent(content, contentType) {
  try {
    const parsed = JSON.parse(content);
    switch (contentType) {
      case "text":
        return parsed.text || content;
      case "post":
        return parsePostContent(content).textContent;
      case "image":
        return "[Image]";
      case "file":
        return `[File: ${parsed.file_name || "unknown"}]`;
      case "audio":
        return "[Audio]";
      case "video":
        return "[Video]";
      case "sticker":
        return "[Sticker]";
      case "merge_forward":
        return "[Nested Merged Forward]";
      default:
        return `[${contentType}]`;
    }
  } catch {
    return content;
  }
}
function parseMergeForwardContent(params) {
  const { content, log } = params;
  const maxMessages = 50;
  log?.("feishu: parsing merge_forward sub-messages from API response");
  let items;
  try {
    items = JSON.parse(content);
  } catch {
    log?.("feishu: merge_forward items parse failed");
    return "[Merged and Forwarded Message - parse error]";
  }
  if (!Array.isArray(items) || items.length === 0)
    return "[Merged and Forwarded Message - no sub-messages]";
  const subMessages = items.filter((item) => item.upper_message_id);
  if (subMessages.length === 0) return "[Merged and Forwarded Message - no sub-messages found]";
  log?.(`feishu: merge_forward contains ${subMessages.length} sub-messages`);
  subMessages.sort(
    (a, b) =>
      (parseStrictNonNegativeInteger(a.create_time) ?? 0) -
      (parseStrictNonNegativeInteger(b.create_time) ?? 0),
  );
  const lines = ["[Merged and Forwarded Messages]"];
  for (const item of subMessages.slice(0, maxMessages))
    lines.push(`- ${formatSubMessageContent(item.body?.content || "", item.msg_type || "text")}`);
  if (subMessages.length > maxMessages)
    lines.push(`... and ${subMessages.length - maxMessages} more messages`);
  return lines.join("\n");
}
function checkBotMentioned(event, botOpenId) {
  if (!botOpenId) return false;
  const mentions = event.message.mentions ?? [];
  if (mentions.length > 0)
    return mentions.some(
      (mention) => !isFeishuBroadcastMention(mention) && mention.id.open_id === botOpenId,
    );
  if (event.message.message_type === "post")
    return parsePostContent(event.message.content).mentionedOpenIds.some(
      (id) => id.trim().toLowerCase() !== "all" && id === botOpenId,
    );
  return false;
}
function normalizeMentions(text, mentions, botStripId) {
  if (!mentions || mentions.length === 0) return text;
  const escaped = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapeName = (value) => value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  let result = text;
  for (const mention of mentions) {
    const mentionId = mention.id.open_id;
    const replacement =
      botStripId && mentionId === botStripId
        ? ""
        : mentionId
          ? `<at user_id="${mentionId}">${escapeName(mention.name)}</at>`
          : `@${mention.name}`;
    result = result.replace(new RegExp(escaped(mention.key), "g"), () => replacement).trim();
  }
  return result;
}
function normalizeFeishuCommandProbeBody(text) {
  if (!text) return "";
  return text
    .replace(/<at\b[^>]*>[^<]*<\/at>/giu, " ")
    .replace(/(^|\s)@[^/\s]+(?=\s|$|\/)/gu, "$1")
    .replace(/\s+/g, " ")
    .trim();
}
function parseMediaKeys(content, messageType) {
  try {
    const parsed = JSON.parse(content);
    const imageKey = normalizeFeishuExternalKey(parsed.image_key);
    const fileKey = normalizeFeishuExternalKey(parsed.file_key);
    switch (messageType) {
      case "image":
        return {
          imageKey,
          fileName: parsed.file_name,
        };
      case "file":
      case "audio":
      case "sticker":
        return {
          fileKey,
          fileName: parsed.file_name,
        };
      case "video":
      case "media":
        return {
          fileKey,
          imageKey,
          fileName: parsed.file_name,
        };
      default:
        return {};
    }
  } catch {
    return {};
  }
}
function toMessageResourceType(messageType) {
  return messageType === "image" ? "image" : "file";
}
async function resolveSavedFeishuMedia(params) {
  if ("saved" in params.result) return params.result.saved;
  const core = getFeishuRuntime();
  const contentType =
    params.result.contentType ?? (await core.media.detectMime({ buffer: params.result.buffer }));
  return await core.channel.media.saveMediaBuffer(
    params.result.buffer,
    contentType,
    "inbound",
    params.maxBytes,
    params.result.fileName ?? params.originalFilename,
  );
}
function inferPlaceholder(messageType) {
  switch (messageType) {
    case "image":
      return "<media:image>";
    case "file":
      return "<media:document>";
    case "audio":
      return "<media:audio>";
    case "video":
    case "media":
      return "<media:video>";
    case "sticker":
      return "<media:sticker>";
    default:
      return "<media:document>";
  }
}
async function resolveFeishuMediaList(params) {
  const { cfg, messageId, messageType, content, maxBytes, log, accountId } = params;
  if (!["image", "file", "audio", "video", "media", "sticker", "post"].includes(messageType))
    return {
      media: [],
      unavailableCount: 0,
    };
  const out = [];
  let unavailableCount = 0;
  if (messageType === "post") {
    const { imageKeys, mediaKeys } = parsePostContent(content);
    if (imageKeys.length === 0 && mediaKeys.length === 0)
      return {
        media: [],
        unavailableCount: 0,
      };
    if (imageKeys.length > 0)
      log?.(`feishu: post message contains ${imageKeys.length} embedded image(s)`);
    if (mediaKeys.length > 0)
      log?.(`feishu: post message contains ${mediaKeys.length} embedded media file(s)`);
    for (const imageKey of imageKeys)
      try {
        const saved = await resolveSavedFeishuMedia({
          result: await saveMessageResourceFeishu({
            cfg,
            messageId,
            fileKey: imageKey,
            type: "image",
            accountId,
            maxBytes,
          }),
          maxBytes,
        });
        out.push({
          path: saved.path,
          contentType: saved.contentType,
          placeholder: "<media:image>",
        });
        log?.(`feishu: downloaded embedded image ${imageKey}, saved to ${saved.path}`);
      } catch (err) {
        unavailableCount += 1;
        log?.(`feishu: failed to download embedded image ${imageKey}: ${String(err)}`);
      }
    for (const media of mediaKeys)
      try {
        const saved = await resolveSavedFeishuMedia({
          result: await saveMessageResourceFeishu({
            cfg,
            messageId,
            fileKey: media.fileKey,
            type: "file",
            accountId,
            maxBytes,
            originalFilename: media.fileName,
          }),
          maxBytes,
          originalFilename: media.fileName,
        });
        out.push({
          path: saved.path,
          contentType: saved.contentType,
          placeholder: "<media:video>",
        });
        log?.(`feishu: downloaded embedded media ${media.fileKey}, saved to ${saved.path}`);
      } catch (err) {
        unavailableCount += 1;
        log?.(`feishu: failed to download embedded media ${media.fileKey}: ${String(err)}`);
      }
    return {
      media: out,
      unavailableCount,
    };
  }
  const mediaKeys = parseMediaKeys(content, messageType);
  if (!mediaKeys.imageKey && !mediaKeys.fileKey)
    return {
      media: [],
      unavailableCount: 1,
    };
  try {
    const fileKey = mediaKeys.fileKey || mediaKeys.imageKey;
    if (!fileKey)
      return {
        media: [],
        unavailableCount: 1,
      };
    const saved = await resolveSavedFeishuMedia({
      result: await saveMessageResourceFeishu({
        cfg,
        messageId,
        fileKey,
        type: toMessageResourceType(messageType),
        accountId,
        maxBytes,
        originalFilename: mediaKeys.fileName,
      }),
      maxBytes,
      originalFilename: mediaKeys.fileName,
    });
    out.push({
      path: saved.path,
      contentType: saved.contentType,
      placeholder: inferPlaceholder(messageType),
    });
    log?.(`feishu: downloaded ${messageType} media, saved to ${saved.path}`);
  } catch (err) {
    unavailableCount += 1;
    log?.(`feishu: failed to download ${messageType} media: ${String(err)}`);
  }
  return {
    media: out,
    unavailableCount,
  };
}
//#endregion
//#region extensions/feishu/src/bot-group-name-state.ts
const feishuGroupNameCache = /* @__PURE__ */ new Map();
//#endregion
//#region extensions/feishu/src/bot-group-name.ts
const GROUP_NAME_CACHE_TTL_MS = 1800 * 1e3;
const GROUP_NAME_CACHE_MAX_SIZE = 500;
function evictGroupNameCache() {
  const now = asDateTimestampMs(Date.now());
  if (now === void 0) {
    feishuGroupNameCache.clear();
    return;
  }
  for (const [key, value] of feishuGroupNameCache) {
    const expiresAt = asDateTimestampMs(value.expiresAt);
    if (expiresAt === void 0 || expiresAt <= now) feishuGroupNameCache.delete(key);
  }
  const excess = feishuGroupNameCache.size - GROUP_NAME_CACHE_MAX_SIZE;
  if (excess <= 0) return;
  let removed = 0;
  for (const key of feishuGroupNameCache.keys()) {
    if (removed >= excess) break;
    feishuGroupNameCache.delete(key);
    removed++;
  }
}
function setCacheEntry(key, name) {
  const expiresAt = resolveExpiresAtMsFromDurationMs(GROUP_NAME_CACHE_TTL_MS);
  feishuGroupNameCache.delete(key);
  if (expiresAt !== void 0)
    feishuGroupNameCache.set(key, {
      name,
      expiresAt,
    });
}
async function resolveGroupName(params) {
  const { account, chatId, log } = params;
  if (!account.configured) return;
  const cacheKey = `${account.accountId}:${chatId}`;
  const cached = feishuGroupNameCache.get(cacheKey);
  if (cached) {
    const now = asDateTimestampMs(Date.now());
    const expiresAt = asDateTimestampMs(cached.expiresAt);
    if (now !== void 0 && expiresAt !== void 0 && expiresAt > now) return cached.name || void 0;
    feishuGroupNameCache.delete(cacheKey);
  }
  let resolvedName;
  try {
    const name = (await getChatInfo(createFeishuClient(account), chatId))?.name?.trim();
    if (name) {
      setCacheEntry(cacheKey, name);
      resolvedName = name;
    } else setCacheEntry(cacheKey, "");
  } catch (err) {
    log(`feishu[${account.accountId}]: getChatInfo failed for ${chatId}: ${String(err)}`);
    setCacheEntry(cacheKey, "");
  }
  evictGroupNameCache();
  return resolvedName;
}
//#endregion
//#region extensions/feishu/src/bot-sender-name.ts
const IGNORED_PERMISSION_SCOPE_TOKENS = ["contact:contact.base:readonly"];
const FEISHU_SCOPE_CORRECTIONS = { "contact:contact.base:readonly": "contact:user.base:readonly" };
const SENDER_NAME_TTL_MS = 600 * 1e3;
const senderNameCache = /* @__PURE__ */ new Map();
function correctFeishuScopeInUrl(url) {
  let corrected = url;
  for (const [wrong, right] of Object.entries(FEISHU_SCOPE_CORRECTIONS)) {
    corrected = corrected.replaceAll(encodeURIComponent(wrong), encodeURIComponent(right));
    corrected = corrected.replaceAll(wrong, right);
  }
  return corrected;
}
function shouldSuppressPermissionErrorNotice(permissionError) {
  const message = normalizeLowercaseStringOrEmpty(permissionError.message);
  return IGNORED_PERMISSION_SCOPE_TOKENS.some((token) => message.includes(token));
}
function extractPermissionError(err) {
  if (!err || typeof err !== "object") return null;
  const data = err.response?.data;
  if (!data || typeof data !== "object") return null;
  const feishuErr = data;
  if (feishuErr.code !== 99991672) return null;
  const msg = feishuErr.msg ?? "";
  const urlMatch = msg.match(/https:\/\/[^\s,]+\/app\/[^\s,]+/);
  return {
    code: feishuErr.code,
    message: msg,
    grantUrl: urlMatch?.[0] ? correctFeishuScopeInUrl(urlMatch[0]) : void 0,
  };
}
function resolveSenderLookupIdType(senderId) {
  const trimmed = senderId.trim();
  if (trimmed.startsWith("ou_")) return "open_id";
  if (trimmed.startsWith("on_")) return "union_id";
  return "user_id";
}
async function resolveFeishuSenderName(params) {
  const { account, senderId, log } = params;
  if (!account.configured) return {};
  const normalizedSenderId = senderId.trim();
  if (!normalizedSenderId) return {};
  const cached = senderNameCache.get(normalizedSenderId);
  const now = asDateTimestampMs(Date.now());
  const cachedExpireAt = cached ? asDateTimestampMs(cached.expireAt) : void 0;
  if (cached && now !== void 0 && cachedExpireAt !== void 0 && cachedExpireAt > now)
    return { name: cached.name };
  if (cached) senderNameCache.delete(normalizedSenderId);
  try {
    const client = createFeishuClient(account);
    const userIdType = resolveSenderLookupIdType(normalizedSenderId);
    const user = (
      await client.contact.user.get({
        path: { user_id: normalizedSenderId },
        params: { user_id_type: userIdType },
      })
    ).data?.user;
    const name = user?.name ?? user?.nickname ?? user?.en_name;
    if (name) {
      const expireAt = resolveExpiresAtMsFromDurationMs(SENDER_NAME_TTL_MS);
      if (expireAt !== void 0)
        senderNameCache.set(normalizedSenderId, {
          name,
          expireAt,
        });
      return { name };
    }
    return {};
  } catch (err) {
    const permErr = extractPermissionError(err);
    if (permErr) {
      if (shouldSuppressPermissionErrorNotice(permErr)) {
        log(`feishu: ignoring stale permission scope error: ${permErr.message}`);
        return {};
      }
      log(`feishu: permission error resolving sender name: code=${permErr.code}`);
      return { permissionError: permErr };
    }
    log(`feishu: failed to resolve sender name for ${normalizedSenderId}: ${String(err)}`);
    return {};
  }
}
//#endregion
//#region extensions/feishu/src/dedup-state.ts
const DEDUPE_NAMESPACE_PREFIX = "feishu.dedup";
const DEDUP_TTL_MS = 1440 * 60 * 1e3;
const MEMORY_MAX_SIZE = 1e3;
const STORE_MAX_ENTRIES = 1e4;
function createFeishuDedupeGuard() {
  return createClaimableDedupe({
    pluginId: "feishu",
    namespacePrefix: DEDUPE_NAMESPACE_PREFIX,
    ttlMs: DEDUP_TTL_MS,
    memoryMaxSize: MEMORY_MAX_SIZE,
    stateMaxEntries: STORE_MAX_ENTRIES,
  });
}
const feishuDedupeState = {
  guard: createFeishuDedupeGuard(),
  reset() {
    this.guard = createFeishuDedupeGuard();
  },
};
//#endregion
//#region extensions/feishu/src/dedup.ts
function dedupeKey(messageId) {
  return messageId?.trim() ?? "";
}
function dedupeOptions(namespace, log) {
  return {
    ...(namespace ? { namespace } : {}),
    ...(log
      ? { onDiskError: (error) => log(`feishu-dedup: persistent state error: ${String(error)}`) }
      : {}),
  };
}
/**
 * Claims a dedupe key for exclusive handling. Duplicate (already committed)
 * and in-flight keys are reported; blank keys fail open as claimed so an
 * unidentifiable event is never suppressed.
 */
async function claimUnprocessedFeishuMessage(params) {
  const key = dedupeKey(params.messageId);
  if (!key) return "claimed";
  return (await feishuDedupeState.guard.claim(key, dedupeOptions(params.namespace, params.log)))
    .kind;
}
/** Drops an uncommitted claim so a failed handler can retry the message. */
function releaseFeishuMessageProcessing(messageId, namespace = "global") {
  const key = dedupeKey(messageId);
  if (key) feishuDedupeState.guard.release(key, { namespace });
}
/**
 * Claims (unless the caller already holds the claim) and commits a message.
 * False means another handler owns it, it was already handled, or the key is
 * blank; handlers must skip dispatch then.
 */
async function finalizeFeishuMessageProcessing(params) {
  const key = dedupeKey(params.messageId);
  if (!key) return false;
  const options = dedupeOptions(params.namespace, params.log);
  if (!params.claimHeld && (await feishuDedupeState.guard.claim(key, options)).kind !== "claimed")
    return false;
  return await feishuDedupeState.guard.commit(key, options);
}
/** Records a handled message so restart/replay cannot dispatch it again; false when already recorded. */
async function recordProcessedFeishuMessage(messageId, namespace = "global", log) {
  const key = dedupeKey(messageId);
  if (!key) return false;
  return await feishuDedupeState.guard.commit(key, dedupeOptions(namespace, log));
}
/** Forgets a recorded message so a retryable synthetic event can be handled on redelivery. */
async function forgetProcessedFeishuMessage(messageId, namespace = "global", log) {
  const key = dedupeKey(messageId);
  if (!key) return false;
  return await feishuDedupeState.guard.forget(key, dedupeOptions(namespace, log));
}
/** Checks recency without claiming or recording. */
async function hasProcessedFeishuMessage(messageId, namespace = "global", log) {
  const key = dedupeKey(messageId);
  if (!key) return false;
  return await feishuDedupeState.guard.hasRecent(key, dedupeOptions(namespace, log));
}
/** Loads recent persisted entries into memory at account start; returns the loaded count. */
async function warmupDedupFromPluginState(namespace, log) {
  return await feishuDedupeState.guard.warmup(namespace, (error) =>
    log?.(`feishu-dedup: warmup persistent state error: ${String(error)}`),
  );
}
//#endregion
//#region extensions/feishu/src/dedupe-key.ts
function readExternalKey(value) {
  return normalizeFeishuExternalKey(typeof value === "string" ? value : "");
}
function parseContentRecord(content) {
  try {
    return asNullableRecord(JSON.parse(content));
  } catch {
    return null;
  }
}
function buildMediaDedupeKey(messageId, mediaParts) {
  return JSON.stringify([messageId, ...mediaParts]);
}
function resolvePostMediaParts(content) {
  const parsed = parsePostContent(content);
  return [
    ...parsed.imageKeys.map((imageKey) => `image_key:${imageKey}`),
    ...parsed.mediaKeys.map((media) => `file_key:${media.fileKey}`),
  ];
}
function resolveMessageMediaParts(messageType, content) {
  if (messageType === "post") return resolvePostMediaParts(content);
  const parsed = parseContentRecord(content);
  if (!parsed) return [];
  const imageKey = readExternalKey(parsed.image_key);
  const fileKey = readExternalKey(parsed.file_key);
  switch (messageType) {
    case "image":
      return imageKey ? [`image_key:${imageKey}`] : [];
    case "file":
    case "audio":
    case "sticker":
      return fileKey ? [`file_key:${fileKey}`] : [];
    case "video":
    case "media":
      return fileKey ? [`file_key:${fileKey}`] : imageKey ? [`image_key:${imageKey}`] : [];
    default:
      return fileKey ? [`file_key:${fileKey}`] : imageKey ? [`image_key:${imageKey}`] : [];
  }
}
function resolveSenderIdentity(event) {
  const senderId = event.sender?.sender_id;
  return (
    senderId?.open_id?.trim() || senderId?.union_id?.trim() || senderId?.user_id?.trim() || void 0
  );
}
function resolveTextRetryDedupeKey(event) {
  const createTime = event.message.create_time?.trim();
  const chatId = event.message.chat_id?.trim();
  const senderId = resolveSenderIdentity(event);
  if (!createTime || parseStrictNonNegativeInteger(createTime) === void 0 || !chatId || !senderId)
    return;
  const contentHash = createHash("sha256")
    .update(event.message.content, "utf8")
    .digest("hex")
    .slice(0, 32);
  return JSON.stringify(["text-retry", senderId, chatId, createTime, contentHash]);
}
function resolveFeishuMessageDedupeKey(event) {
  const messageId = event.message.message_id?.trim();
  if (!messageId) return;
  const messageType = event.message.message_type.trim();
  const mediaParts = resolveMessageMediaParts(messageType, event.message.content);
  if (mediaParts.length > 0) return buildMediaDedupeKey(messageId, mediaParts);
  if (messageType === "text") return resolveTextRetryDedupeKey(event) ?? messageId;
  return messageId;
}
//#endregion
//#region extensions/feishu/src/dynamic-agent.ts
var DynamicAgentMutationSkipped = class extends Error {
  constructor(cfg) {
    super("dynamic agent mutation skipped");
    this.cfg = cfg;
  }
};
function hasDefaultDirectRoute(cfg, accountId, senderOpenId) {
  return (
    resolveAgentRoute({
      cfg,
      channel: "feishu",
      accountId,
      peer: {
        kind: "direct",
        id: senderOpenId,
      },
    }).matchedBy === "default"
  );
}
function resolveDynamicAgentConfig(cfg, accountId) {
  return resolveFeishuAccount({
    cfg,
    accountId,
  }).config.dynamicAgentCreation;
}
function isAtDynamicAgentLimit(cfg, dynamicCfg) {
  if (dynamicCfg.maxAgents === void 0) return false;
  return (
    (cfg.agents?.list ?? []).filter((agent) => agent.id.startsWith("feishu-")).length >=
    dynamicCfg.maxAgents
  );
}
function resolveDynamicAgentId(accountId, senderOpenId) {
  if (accountId === "default") return `feishu-${senderOpenId}`;
  const identityDigest = createHash("sha256")
    .update(accountId)
    .update("\0")
    .update(senderOpenId)
    .digest("hex")
    .slice(0, 32);
  return `feishu-${accountId.slice(0, 12)}-${identityDigest}`;
}
/**
 * Refresh an existing DM binding or create its dynamic agent when current
 * account policy permits config writes.
 */
async function maybeCreateDynamicAgent(params) {
  const { cfg, runtime, senderOpenId, canCreateForConfig, log } = params;
  const accountId = normalizeAccountId(params.accountId);
  if (!hasDefaultDirectRoute(cfg, accountId, senderOpenId))
    return {
      created: false,
      updatedCfg: cfg,
    };
  const currentCfg = runtime.config.current();
  if (!hasDefaultDirectRoute(currentCfg, accountId, senderOpenId))
    return {
      created: false,
      updatedCfg: currentCfg,
    };
  const currentDynamicCfg = resolveDynamicAgentConfig(currentCfg, accountId);
  if (!currentDynamicCfg?.enabled)
    return {
      created: false,
      updatedCfg: currentCfg,
    };
  if (
    !resolveChannelConfigWrites({
      cfg: currentCfg,
      channelId: "feishu",
      accountId,
    })
  ) {
    log(`feishu: config writes disabled, not creating agent for ${senderOpenId}`);
    return {
      created: false,
      updatedCfg: currentCfg,
    };
  }
  const agentId = resolveDynamicAgentId(accountId, senderOpenId);
  if (
    !(currentCfg.agents?.list ?? []).some((agent) => agent.id === agentId) &&
    isAtDynamicAgentLimit(currentCfg, currentDynamicCfg)
  ) {
    log(
      `feishu: maxAgents limit (${currentDynamicCfg.maxAgents}) reached, not creating agent for ${senderOpenId}`,
    );
    return {
      created: false,
      updatedCfg: currentCfg,
    };
  }
  if (!(await canCreateForConfig(currentCfg)))
    return {
      created: false,
      updatedCfg: currentCfg,
    };
  let skippedCfg;
  const committed = await runtime.config
    .mutateConfigFile({
      base: "runtime",
      afterWrite: { mode: "auto" },
      mutate: async (draft) => {
        if (!hasDefaultDirectRoute(draft, accountId, senderOpenId))
          throw new DynamicAgentMutationSkipped(draft);
        const dynamicCfg = resolveDynamicAgentConfig(draft, accountId);
        if (
          !dynamicCfg?.enabled ||
          !resolveChannelConfigWrites({
            cfg: draft,
            channelId: "feishu",
            accountId,
          })
        )
          throw new DynamicAgentMutationSkipped(draft);
        const agentExists = (draft.agents?.list ?? []).some((agent) => agent.id === agentId);
        if (!agentExists && isAtDynamicAgentLimit(draft, dynamicCfg)) {
          log(
            `feishu: maxAgents limit (${dynamicCfg.maxAgents}) reached, not creating agent for ${senderOpenId}`,
          );
          throw new DynamicAgentMutationSkipped(draft);
        }
        if (!(await canCreateForConfig(draft))) throw new DynamicAgentMutationSkipped(draft);
        if (!agentExists) {
          const workspaceTemplate =
            dynamicCfg.workspaceTemplate ?? "~/.openclaw/workspace-{agentId}";
          const agentDirTemplate =
            dynamicCfg.agentDirTemplate ?? "~/.openclaw/agents/{agentId}/agent";
          const workspace = resolveUserPath(
            workspaceTemplate.replace("{userId}", senderOpenId).replace("{agentId}", agentId),
          );
          const agentDir = resolveUserPath(
            agentDirTemplate.replace("{userId}", senderOpenId).replace("{agentId}", agentId),
          );
          log(`feishu: creating dynamic agent "${agentId}" for user ${senderOpenId}`);
          log(`  workspace: ${workspace}`);
          log(`  agentDir: ${agentDir}`);
          await fs.promises.mkdir(workspace, { recursive: true });
          await fs.promises.mkdir(agentDir, { recursive: true });
          draft.agents = {
            ...draft.agents,
            list: [
              ...(draft.agents?.list ?? []),
              {
                id: agentId,
                workspace,
                agentDir,
              },
            ],
          };
        } else log(`feishu: agent "${agentId}" exists, adding missing binding for ${senderOpenId}`);
        draft.bindings = [
          ...(draft.bindings ?? []),
          {
            agentId,
            match: {
              channel: "feishu",
              accountId,
              peer: {
                kind: "direct",
                id: senderOpenId,
              },
            },
          },
        ];
        return {
          created: true,
          agentId,
        };
      },
    })
    .catch((error) => {
      if (error instanceof DynamicAgentMutationSkipped) {
        skippedCfg = error.cfg;
        return null;
      }
      throw error;
    });
  if (!committed)
    return {
      created: false,
      updatedCfg: skippedCfg ?? currentCfg,
    };
  return {
    created: committed.result?.created ?? false,
    updatedCfg: runtime.config.current(),
    agentId: committed.result?.agentId,
  };
}
/**
 * Resolve a path that may start with ~ to the user's home directory.
 */
function resolveUserPath(p) {
  if (p.startsWith("~/")) return path.join(os.homedir(), p.slice(2));
  return p;
}
//#endregion
//#region extensions/feishu/src/agent-config.ts
const DEFAULT_AGENT_ID = "main";
function normalizeAgentId(value) {
  return (value ?? "").trim().toLowerCase() || DEFAULT_AGENT_ID;
}
function resolveFeishuConfigReasoningDefault(cfg, agentId) {
  const id = normalizeAgentId(agentId);
  return (
    cfg.agents?.list?.find((entry) => normalizeAgentId(entry?.id) === id)?.reasoningDefault ??
    cfg.agents?.defaults?.reasoningDefault ??
    "off"
  );
}
//#endregion
//#region extensions/feishu/src/reasoning-preview.ts
function resolveFeishuReasoningPreviewEnabled(params) {
  const configDefault = resolveFeishuConfigReasoningDefault(params.cfg, params.agentId);
  if (!params.sessionKey) return configDefault === "stream";
  try {
    const level = getSessionEntry({
      storePath: params.storePath,
      sessionKey: params.sessionKey,
      readConsistency: "latest",
    })?.reasoningLevel;
    if (level === "on" || level === "stream" || level === "off") return level === "stream";
  } catch {
    return false;
  }
  return configDefault === "stream";
}
//#endregion
//#region extensions/feishu/src/reply-dispatcher-state.ts
const streamingStartBackoffUntilByAccount = /* @__PURE__ */ new Map();
//#endregion
//#region extensions/feishu/src/streaming-card-send-mode.ts
function resolveStreamingCardSendMode(options) {
  if (options?.replyToMessageId) return "reply";
  if (options?.rootId) return "root_create";
  return "create";
}
//#endregion
//#region extensions/feishu/src/streaming-card.ts
const STREAMING_UPDATE_THROTTLE_MS = 160;
const STREAMING_SIGNIFICANT_DELTA_CHARS = 18;
const FEISHU_STREAMING_TOKEN_DEFAULT_LIFETIME_SECONDS = 7200;
const tokenCache = /* @__PURE__ */ new Map();
function resolveStreamingTokenExpiresAt(value, nowMs = Date.now()) {
  const now = resolveDateTimestampMs(nowMs);
  if (typeof value === "number" && Number.isFinite(value) && value <= 0) return now;
  return (
    resolveExpiresAtMsFromDurationSeconds(value, { nowMs: now }) ??
    resolveExpiresAtMsFromDurationSeconds(FEISHU_STREAMING_TOKEN_DEFAULT_LIFETIME_SECONDS, {
      nowMs: now,
    }) ??
    now
  );
}
function resolveApiBase(domain) {
  if (domain === "lark") return "https://open.larksuite.com/open-apis";
  if (domain && domain !== "feishu" && domain.startsWith("http"))
    return `${domain.replace(/\/+$/, "")}/open-apis`;
  return "https://open.feishu.cn/open-apis";
}
function resolveAllowedHostnames(domain) {
  if (domain === "lark") return ["open.larksuite.com"];
  if (domain && domain !== "feishu" && domain.startsWith("http"))
    try {
      return [new URL(domain).hostname];
    } catch {
      return [];
    }
  return ["open.feishu.cn"];
}
async function assertSuccessfulCardKitResponse(response, auditContext, action) {
  if (!response.ok) throw new Error(`${action} failed with HTTP ${response.status}`);
  const data = await readFeishuJsonResponse(response, auditContext);
  if (data.code !== 0)
    throw new Error(`${action} failed: ${data.msg ?? "unknown error"} (code=${String(data.code)})`);
}
async function getToken(creds, deps) {
  const key = `${creds.domain ?? "feishu"}|${creds.appId}`;
  const cached = tokenCache.get(key);
  const rawNow = Date.now();
  const hasValidClock = asDateTimestampMs(rawNow) !== void 0;
  const now = resolveDateTimestampMs(rawNow);
  const minUsableExpiresAt = resolveExpiresAtMsFromDurationSeconds(60, { nowMs: now }) ?? now;
  if (cached && hasValidClock && cached.expiresAt > minUsableExpiresAt) return cached.token;
  const { response, release } = await fetchWithSsrFGuard({
    url: `${resolveApiBase(creds.domain)}/auth/v3/tenant_access_token/internal`,
    init: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": getFeishuUserAgent(),
      },
      body: JSON.stringify({
        app_id: creds.appId,
        app_secret: creds.appSecret,
      }),
    },
    fetchImpl: deps?.fetchImpl,
    lookupFn: deps?.lookupFn,
    policy: { allowedHostnames: resolveAllowedHostnames(creds.domain) },
    auditContext: "feishu.streaming-card.token",
    timeoutMs: creds.httpTimeoutMs ?? 3e4,
  });
  let data;
  try {
    if (!response.ok) throw new Error(`Token request failed with HTTP ${response.status}`);
    data = await readFeishuJsonResponse(response, "feishu.streaming-card.token");
  } finally {
    await release();
  }
  if (data.code !== 0 || !data.tenant_access_token) throw new Error(`Token error: ${data.msg}`);
  tokenCache.set(key, {
    token: data.tenant_access_token,
    expiresAt: resolveStreamingTokenExpiresAt(data.expire, now),
  });
  return data.tenant_access_token;
}
function truncateSummary(text, max = 50) {
  if (!text) return "";
  const clean = text.replace(/\n/g, " ").trim();
  return clean.length <= max ? clean : sliceUtf16Safe(clean, 0, max - 3) + "...";
}
function hasNaturalStreamingBoundary(text) {
  return /[\n。！？!?；;：:]$/.test(text);
}
function shouldPushStreamingUpdate(previousText, nextText) {
  if (!previousText) return true;
  if (hasNaturalStreamingBoundary(nextText)) return true;
  return nextText.length - previousText.length >= STREAMING_SIGNIFICANT_DELTA_CHARS;
}
function mergeStreamingText(previousText, nextText) {
  const previous = typeof previousText === "string" ? previousText : "";
  const next = typeof nextText === "string" ? nextText : "";
  if (!next) return previous;
  if (!previous || next === previous) return next;
  if (next.startsWith(previous)) return next;
  if (previous.startsWith(next)) return previous;
  if (next.includes(previous)) return next;
  if (previous.includes(next)) return previous;
  const maxOverlap = Math.min(previous.length, next.length);
  for (let overlap = maxOverlap; overlap > 0; overlap -= 1)
    if (previous.slice(-overlap) === next.slice(0, overlap))
      return `${previous}${next.slice(overlap)}`;
  return `${previous}${next}`;
}
/** Streaming card session manager */
var FeishuStreamingSession = class {
  constructor(client, creds, log, deps) {
    this.state = null;
    this.queue = Promise.resolve();
    this.closed = false;
    this.lastUpdateTime = 0;
    this.pendingText = null;
    this.flushTimer = null;
    this.updateThrottleMs = STREAMING_UPDATE_THROTTLE_MS;
    this.client = client;
    this.creds = creds;
    this.log = log;
    this.fetchImpl = deps?.fetchImpl;
    this.lookupFn = deps?.lookupFn;
  }
  async start(receiveId, receiveIdType = "chat_id", options) {
    if (this.state) return;
    const apiBase = resolveApiBase(this.creds.domain);
    const elements = [
      {
        tag: "markdown",
        content: "",
        element_id: "content",
      },
    ];
    if (options?.note) {
      elements.push({ tag: "hr" });
      elements.push({
        tag: "markdown",
        content: `<font color='grey'>${options.note}</font>`,
        element_id: "note",
      });
    }
    const cardJson = {
      schema: "2.0",
      config: {
        streaming_mode: true,
        summary: { content: "[Generating...]" },
        streaming_config: {
          print_frequency_ms: { default: 50 },
          print_step: { default: 1 },
        },
      },
      body: { elements },
    };
    if (options?.header)
      cardJson.header = {
        title: {
          tag: "plain_text",
          content: options.header.title,
        },
        template: resolveFeishuCardTemplate(options.header.template) ?? "blue",
      };
    const { response: createRes, release: releaseCreate } = await fetchWithSsrFGuard({
      url: `${apiBase}/cardkit/v1/cards`,
      init: {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await getToken(this.creds, {
            fetchImpl: this.fetchImpl,
            lookupFn: this.lookupFn,
          })}`,
          "Content-Type": "application/json",
          "User-Agent": getFeishuUserAgent(),
        },
        body: JSON.stringify({
          type: "card_json",
          data: JSON.stringify(cardJson),
        }),
      },
      fetchImpl: this.fetchImpl,
      lookupFn: this.lookupFn,
      policy: { allowedHostnames: resolveAllowedHostnames(this.creds.domain) },
      auditContext: "feishu.streaming-card.create",
      timeoutMs: this.creds.httpTimeoutMs ?? 3e4,
    });
    let createData;
    try {
      if (!createRes.ok)
        throw new Error(`Create card request failed with HTTP ${createRes.status}`);
      createData = await readFeishuJsonResponse(createRes, "feishu.streaming-card.create");
    } finally {
      await releaseCreate();
    }
    if (createData.code !== 0 || !createData.data?.card_id)
      throw new Error(`Create card failed: ${createData.msg}`);
    const cardId = createData.data.card_id;
    const cardContent = JSON.stringify({
      type: "card",
      data: { card_id: cardId },
    });
    let sendRes;
    const sendOptions = options ?? {};
    const sendMode = resolveStreamingCardSendMode(sendOptions);
    if (sendMode === "reply")
      sendRes = await requestFeishuApi(
        () =>
          this.client.im.message.reply({
            path: { message_id: sendOptions.replyToMessageId },
            data: {
              msg_type: "interactive",
              content: cardContent,
              ...(sendOptions.replyInThread ? { reply_in_thread: true } : {}),
            },
          }),
        "Send card failed",
      );
    else if (sendMode === "root_create")
      sendRes = await requestFeishuApi(
        () =>
          this.client.im.message.create({
            params: { receive_id_type: receiveIdType },
            data: Object.assign(
              {
                receive_id: receiveId,
                msg_type: "interactive",
                content: cardContent,
              },
              { root_id: sendOptions.rootId },
            ),
          }),
        "Send card failed",
      );
    else
      sendRes = await requestFeishuApi(
        () =>
          this.client.im.message.create({
            params: { receive_id_type: receiveIdType },
            data: {
              receive_id: receiveId,
              msg_type: "interactive",
              content: cardContent,
            },
          }),
        "Send card failed",
      );
    if (sendRes.code !== 0 || !sendRes.data?.message_id)
      throw new Error(`Send card failed: ${sendRes.msg}`);
    this.state = {
      cardId,
      messageId: sendRes.data.message_id,
      sequence: 1,
      currentText: "",
      sentText: "",
      hasNote: Boolean(options?.note),
    };
    this.log?.(`Started streaming: cardId=${cardId}, messageId=${sendRes.data.message_id}`);
  }
  async updateCardContent(text, onError) {
    if (!this.state) return false;
    const apiBase = resolveApiBase(this.creds.domain);
    this.state.sequence += 1;
    try {
      const { response, release } = await fetchWithSsrFGuard({
        url: `${apiBase}/cardkit/v1/cards/${this.state.cardId}/elements/content/content`,
        init: {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${await getToken(this.creds, {
              fetchImpl: this.fetchImpl,
              lookupFn: this.lookupFn,
            })}`,
            "Content-Type": "application/json",
            "User-Agent": getFeishuUserAgent(),
          },
          body: JSON.stringify({
            content: text,
            sequence: this.state.sequence,
            uuid: `s_${this.state.cardId}_${this.state.sequence}`,
          }),
        },
        fetchImpl: this.fetchImpl,
        lookupFn: this.lookupFn,
        policy: { allowedHostnames: resolveAllowedHostnames(this.creds.domain) },
        auditContext: "feishu.streaming-card.update",
        timeoutMs: this.creds.httpTimeoutMs ?? 3e4,
      });
      try {
        await assertSuccessfulCardKitResponse(
          response,
          "feishu.streaming-card.update",
          "Update card content",
        );
      } finally {
        await release();
      }
      return true;
    } catch (error) {
      onError?.(error);
      return false;
    }
  }
  async replaceCardContent(text, onError) {
    if (!this.state) return false;
    const apiBase = resolveApiBase(this.creds.domain);
    this.state.sequence += 1;
    try {
      const { response, release } = await fetchWithSsrFGuard({
        url: `${apiBase}/cardkit/v1/cards/${this.state.cardId}/elements/content`,
        init: {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${await getToken(this.creds, {
              fetchImpl: this.fetchImpl,
              lookupFn: this.lookupFn,
            })}`,
            "Content-Type": "application/json",
            "User-Agent": getFeishuUserAgent(),
          },
          body: JSON.stringify({
            element: JSON.stringify({
              tag: "markdown",
              content: text,
              element_id: "content",
            }),
            sequence: this.state.sequence,
            uuid: `r_${this.state.cardId}_${this.state.sequence}`,
          }),
        },
        fetchImpl: this.fetchImpl,
        lookupFn: this.lookupFn,
        policy: { allowedHostnames: resolveAllowedHostnames(this.creds.domain) },
        auditContext: "feishu.streaming-card.replace",
        timeoutMs: this.creds.httpTimeoutMs ?? 3e4,
      });
      try {
        await assertSuccessfulCardKitResponse(
          response,
          "feishu.streaming-card.replace",
          "Replace card content",
        );
      } finally {
        await release();
      }
      return true;
    } catch (error) {
      onError?.(error);
      return false;
    }
  }
  clearFlushTimer() {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
  }
  schedulePendingFlush() {
    if (this.flushTimer || !this.pendingText || this.closed) return;
    const delayMs = Math.max(0, this.updateThrottleMs - (Date.now() - this.lastUpdateTime));
    this.flushTimer = setTimeout(() => {
      this.flushTimer = null;
      if (!this.pendingText || this.closed) return;
      this.lastUpdateTime = Date.now();
      this.flushPendingUpdate().catch((error) =>
        this.log?.(`Scheduled flush update failed: ${String(error)}`),
      );
    }, delayMs);
  }
  async flushPendingUpdate() {
    this.queue = this.queue.then(async () => {
      if (!this.state || this.closed) return;
      const nextText = this.pendingText;
      if (!nextText) return;
      this.pendingText = null;
      if (nextText === this.state.sentText) return;
      if (
        (await this.updateCardContent(nextText, (e) =>
          this.log?.(`Update failed: ${String(e)}`),
        )) &&
        this.state
      )
        this.state.sentText = nextText;
    });
    await this.queue;
  }
  async update(text) {
    if (!this.state || this.closed || !text) return;
    this.state.currentText = text;
    this.pendingText = text;
    this.clearFlushTimer();
    const shouldForceUpdate = shouldPushStreamingUpdate(this.state.sentText, text);
    const now = Date.now();
    if (!shouldForceUpdate && now - this.lastUpdateTime < this.updateThrottleMs) {
      this.schedulePendingFlush();
      return;
    }
    this.lastUpdateTime = now;
    await this.flushPendingUpdate();
  }
  async updateNoteContent(note) {
    if (!this.state || !this.state.hasNote) return;
    const apiBase = resolveApiBase(this.creds.domain);
    this.state.sequence += 1;
    await fetchWithSsrFGuard({
      url: `${apiBase}/cardkit/v1/cards/${this.state.cardId}/elements/note/content`,
      init: {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${await getToken(this.creds, {
            fetchImpl: this.fetchImpl,
            lookupFn: this.lookupFn,
          })}`,
          "Content-Type": "application/json",
          "User-Agent": getFeishuUserAgent(),
        },
        body: JSON.stringify({
          content: `<font color='grey'>${note}</font>`,
          sequence: this.state.sequence,
          uuid: `n_${this.state.cardId}_${this.state.sequence}`,
        }),
      },
      fetchImpl: this.fetchImpl,
      lookupFn: this.lookupFn,
      policy: { allowedHostnames: resolveAllowedHostnames(this.creds.domain) },
      auditContext: "feishu.streaming-card.note-update",
      timeoutMs: this.creds.httpTimeoutMs ?? 3e4,
    })
      .then(async ({ response, release }) => {
        try {
          await assertSuccessfulCardKitResponse(
            response,
            "feishu.streaming-card.note-update",
            "Update card note",
          );
        } finally {
          await release();
        }
      })
      .catch((e) => this.log?.(`Note update failed: ${String(e)}`));
  }
  async close(finalText, options) {
    if (!this.state || this.closed) return false;
    this.closed = true;
    this.clearFlushTimer();
    await this.queue;
    const text = finalText ?? this.pendingText ?? this.state.currentText;
    const apiBase = resolveApiBase(this.creds.domain);
    let visibleContentSent = Boolean(this.state.sentText.trim());
    if ((text || finalText !== void 0) && text !== this.state.sentText) {
      const sent = text.startsWith(this.state.sentText)
        ? await this.updateCardContent(text, (e) => this.log?.(`Final update failed: ${String(e)}`))
        : await this.replaceCardContent(text, (e) =>
            this.log?.(`Final replace failed: ${String(e)}`),
          );
      this.state.currentText = text;
      if (sent) {
        this.state.sentText = text;
        visibleContentSent = Boolean(text.trim());
      }
    }
    if (options?.note) await this.updateNoteContent(options.note);
    const acceptedText = this.state.sentText;
    this.state.sequence += 1;
    await fetchWithSsrFGuard({
      url: `${apiBase}/cardkit/v1/cards/${this.state.cardId}/settings`,
      init: {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${await getToken(this.creds, {
            fetchImpl: this.fetchImpl,
            lookupFn: this.lookupFn,
          })}`,
          "Content-Type": "application/json; charset=utf-8",
          "User-Agent": getFeishuUserAgent(),
        },
        body: JSON.stringify({
          settings: JSON.stringify({
            config: {
              streaming_mode: false,
              summary: { content: truncateSummary(acceptedText) },
            },
          }),
          sequence: this.state.sequence,
          uuid: `c_${this.state.cardId}_${this.state.sequence}`,
        }),
      },
      fetchImpl: this.fetchImpl,
      lookupFn: this.lookupFn,
      policy: { allowedHostnames: resolveAllowedHostnames(this.creds.domain) },
      auditContext: "feishu.streaming-card.close",
      timeoutMs: this.creds.httpTimeoutMs ?? 3e4,
    })
      .then(async ({ response, release }) => {
        try {
          await assertSuccessfulCardKitResponse(
            response,
            "feishu.streaming-card.close",
            "Close streaming card",
          );
        } finally {
          await release();
        }
      })
      .catch((e) => this.log?.(`Close failed: ${String(e)}`));
    const finalState = this.state;
    this.state = null;
    this.pendingText = null;
    this.log?.(`Closed streaming: cardId=${finalState.cardId}`);
    return visibleContentSent;
  }
  async discard() {
    if (!this.state || this.closed) return;
    this.closed = true;
    this.clearFlushTimer();
    await this.queue;
    const currentState = this.state;
    try {
      const response = await this.client.im.message.delete({
        path: { message_id: currentState.messageId },
      });
      if (response.code !== void 0 && response.code !== 0)
        throw new Error(`Delete streaming card message failed: ${response.msg ?? response.code}`);
      this.state = null;
      this.pendingText = null;
      this.log?.(`Discarded streaming card: cardId=${currentState.cardId}`);
    } catch (error) {
      this.log?.(`Discard failed: ${String(error)}`);
      this.closed = false;
      await this.close("");
    }
  }
  isActive() {
    return this.state !== null && !this.closed;
  }
};
//#endregion
//#region extensions/feishu/src/typing-backoff.ts
/** Feishu API codes that should trip the typing circuit breaker. */
const FEISHU_BACKOFF_CODES = /* @__PURE__ */ new Set([99991400, 99991403, 429]);
var FeishuBackoffError = class extends Error {
  constructor(code) {
    super(`Feishu API backoff: code ${code}`);
    this.name = "FeishuBackoffError";
    this.code = code;
  }
};
function isFeishuBackoffError(err) {
  if (typeof err !== "object" || err === null) return false;
  const response = err.response;
  if (response) {
    if (response.status === 429) return true;
    if (typeof response.data?.code === "number" && FEISHU_BACKOFF_CODES.has(response.data.code))
      return true;
  }
  const code = err.code;
  return typeof code === "number" && FEISHU_BACKOFF_CODES.has(code);
}
function getBackoffCodeFromResponse(response) {
  if (typeof response !== "object" || response === null) return;
  const code = response.code;
  return typeof code === "number" && FEISHU_BACKOFF_CODES.has(code) ? code : void 0;
}
//#endregion
//#region extensions/feishu/src/typing.ts
const TYPING_EMOJI = "Typing";
/**
 * Add a typing indicator (reaction) to a message.
 *
 * Rate-limit and quota errors are re-thrown so the circuit breaker in
 * `createTypingCallbacks` (typing-start-guard) can trip and stop the
 * keepalive loop. See #28062.
 *
 * Also checks for backoff codes in non-throwing SDK responses (#28157).
 */
async function addTypingIndicator(params) {
  const { cfg, messageId, accountId, runtime } = params;
  const account = resolveFeishuRuntimeAccount({
    cfg,
    accountId,
  });
  if (!account.configured)
    return {
      messageId,
      reactionId: null,
    };
  const client = createFeishuClient(account);
  try {
    const response = await client.im.messageReaction.create({
      path: { message_id: messageId },
      data: { reaction_type: { emoji_type: TYPING_EMOJI } },
    });
    const backoffCode = getBackoffCodeFromResponse(response);
    if (backoffCode !== void 0) {
      if (getFeishuRuntime().logging.shouldLogVerbose())
        runtime?.log?.(
          `[feishu] typing indicator response contains backoff code ${backoffCode}, stopping keepalive`,
        );
      throw new FeishuBackoffError(backoffCode);
    }
    return {
      messageId,
      reactionId: response.data?.reaction_id ?? null,
    };
  } catch (err) {
    if (isFeishuBackoffError(err)) {
      if (getFeishuRuntime().logging.shouldLogVerbose())
        runtime?.log?.("[feishu] typing indicator hit rate-limit/quota, stopping keepalive");
      throw err;
    }
    if (getFeishuRuntime().logging.shouldLogVerbose())
      runtime?.log?.(`[feishu] failed to add typing indicator: ${String(err)}`);
    return {
      messageId,
      reactionId: null,
    };
  }
}
/**
 * Remove a typing indicator (reaction) from a message.
 *
 * Rate-limit and quota errors are re-thrown for the same reason as above.
 */
async function removeTypingIndicator(params) {
  const { cfg, state, accountId, runtime } = params;
  if (!state.reactionId) return;
  const account = resolveFeishuRuntimeAccount({
    cfg,
    accountId,
  });
  if (!account.configured) return;
  const client = createFeishuClient(account);
  try {
    const backoffCode = getBackoffCodeFromResponse(
      await client.im.messageReaction.delete({
        path: {
          message_id: state.messageId,
          reaction_id: state.reactionId,
        },
      }),
    );
    if (backoffCode !== void 0) {
      if (getFeishuRuntime().logging.shouldLogVerbose())
        runtime?.log?.(
          `[feishu] typing indicator removal response contains backoff code ${backoffCode}, stopping keepalive`,
        );
      throw new FeishuBackoffError(backoffCode);
    }
  } catch (err) {
    if (isFeishuBackoffError(err)) {
      if (getFeishuRuntime().logging.shouldLogVerbose())
        runtime?.log?.(
          "[feishu] typing indicator removal hit rate-limit/quota, stopping keepalive",
        );
      throw err;
    }
    if (getFeishuRuntime().logging.shouldLogVerbose())
      runtime?.log?.(`[feishu] failed to remove typing indicator: ${String(err)}`);
  }
}
//#endregion
//#region extensions/feishu/src/reply-dispatcher.ts
/** Detect if text contains markdown elements that benefit from card rendering */
function shouldUseCard(text) {
  return /```[\s\S]*?```/.test(text) || /\|.+\|[\r\n]+\|[-:| ]+\|/.test(text);
}
function mergeStreamingFinalText(previousText, nextText, appendError) {
  if (!appendError || !previousText) return nextText;
  if (nextText.startsWith(previousText)) return nextText;
  if (previousText.endsWith(`\n\n${nextText}`)) return previousText;
  return `${previousText}\n\n${nextText}`;
}
/** Maximum age (ms) for a message to receive a typing indicator reaction.
 * Messages older than this are likely replays after context compaction (#30418). */
const TYPING_INDICATOR_MAX_AGE_MS = 2 * 6e4;
const MS_EPOCH_MIN = 0xe8d4a51000;
const STREAMING_START_FAILURE_BACKOFF_MS = 6e4;
const NO_VISIBLE_REPLY_FALLBACK_TEXT =
  "⚠️ This reply completed without visible content. The turn may have been interrupted; please retry or ask me to recover from recent context.";
function isStreamingStartBackedOff(accountId, now = Date.now()) {
  const backoffUntil = streamingStartBackoffUntilByAccount.get(accountId);
  if (backoffUntil === void 0) return false;
  if (backoffUntil <= now) {
    streamingStartBackoffUntilByAccount.delete(accountId);
    return false;
  }
  return true;
}
function rememberStreamingStartFailure(accountId, now = Date.now()) {
  const backoffUntil = now + STREAMING_START_FAILURE_BACKOFF_MS;
  streamingStartBackoffUntilByAccount.set(accountId, backoffUntil);
  return backoffUntil;
}
function formatMediaFallbackText(text, mediaUrl) {
  const trimmedText = text?.trim() ?? "";
  const attachmentText = `📎 ${mediaUrl}`;
  return trimmedText ? `${trimmedText}\n\n${attachmentText}` : attachmentText;
}
function normalizeEpochMs(timestamp) {
  if (!Number.isFinite(timestamp) || timestamp === void 0 || timestamp <= 0) return;
  return timestamp < MS_EPOCH_MIN ? timestamp * 1e3 : timestamp;
}
/** Build a card header from agent identity config. */
function resolveCardHeader(agentId, identity) {
  const name = identity?.name?.trim() || (agentId === "main" ? "" : agentId);
  const emoji = resolveFeishuIdentityEmoji(identity?.emoji);
  const title = (emoji ? `${emoji} ${name}` : name).trim();
  if (!title) return;
  return {
    title,
    template: identity?.theme ?? "blue",
  };
}
/** Build a card note footer from agent identity and model context. */
function resolveCardNote(agentId, identity, prefixCtx) {
  const parts = [`Agent: ${identity?.name?.trim() || agentId}`];
  if (prefixCtx.model) parts.push(`Model: ${prefixCtx.model}`);
  if (prefixCtx.provider) parts.push(`Provider: ${prefixCtx.provider}`);
  return parts.join(" | ");
}
function createFeishuReplyDispatcher(params) {
  const core = getFeishuRuntime();
  const {
    cfg,
    agentId,
    chatId,
    sendTarget,
    replyToMessageId,
    typingTargetMessageId: explicitTypingTargetMessageId,
    skipReplyToInMessages,
    replyInThread,
    threadReply,
    rootId,
    accountId,
    identity,
    mentionTargets,
  } = params;
  const sendReplyToMessageId = skipReplyToInMessages ? void 0 : replyToMessageId;
  const typingTargetMessageId = explicitTypingTargetMessageId?.trim() || replyToMessageId;
  const threadReplyMode = threadReply === true;
  const effectiveReplyInThread = threadReplyMode ? true : replyInThread;
  const allowTopLevelReplyFallback =
    effectiveReplyInThread === true &&
    threadReplyMode &&
    rootId !== void 0 &&
    sendReplyToMessageId !== void 0 &&
    sendReplyToMessageId !== rootId;
  const account = resolveFeishuRuntimeAccount({
    cfg,
    accountId,
  });
  const prefixContext = createReplyPrefixContext({
    cfg,
    agentId,
  });
  let typingState = null;
  const { typingCallbacks } = createChannelReplyPipeline({
    cfg,
    agentId,
    channel: "feishu",
    accountId,
    typing: {
      start: async () => {
        if (!(account.config.typingIndicator ?? true)) return;
        if (!typingTargetMessageId) return;
        const messageCreateTimeMs = normalizeEpochMs(params.messageCreateTimeMs);
        if (
          messageCreateTimeMs !== void 0 &&
          Date.now() - messageCreateTimeMs > TYPING_INDICATOR_MAX_AGE_MS
        )
          return;
        if (typingState?.reactionId) return;
        typingState = await addTypingIndicator({
          cfg,
          messageId: typingTargetMessageId,
          accountId,
          runtime: params.runtime,
        });
      },
      stop: async () => {
        if (!typingState) return;
        await removeTypingIndicator({
          cfg,
          state: typingState,
          accountId,
          runtime: params.runtime,
        });
        typingState = null;
      },
      onStartError: (err) =>
        logTypingFailure({
          log: (message) => params.runtime.log?.(message),
          channel: "feishu",
          action: "start",
          error: err,
        }),
      onStopError: (err) =>
        logTypingFailure({
          log: (message) => params.runtime.log?.(message),
          channel: "feishu",
          action: "stop",
          error: err,
        }),
    },
  });
  const textChunkLimit = core.channel.text.resolveTextChunkLimit(cfg, "feishu", accountId, {
    fallbackLimit: 4e3,
  });
  const chunkMode = core.channel.text.resolveChunkMode(cfg, "feishu", accountId);
  const tableMode = core.channel.text.resolveMarkdownTableMode({
    cfg,
    channel: "feishu",
  });
  const renderMode = account.config?.renderMode ?? "auto";
  const streamingEnabled =
    resolveChannelPreviewStreamMode(account.config, "partial") !== "off" && renderMode !== "raw";
  const blockStreamingEnabled = resolveChannelStreamingBlockEnabled(account.config);
  const coreBlockStreamingEnabled = blockStreamingEnabled === true;
  const reasoningPreviewEnabled = streamingEnabled && params.allowReasoningPreview === true;
  let streaming = null;
  let streamText = "";
  let lastPartial = "";
  let reasoningText = "";
  let statusLine = "";
  let snapshotBaseText = "";
  let lastSnapshotTextLength = 0;
  let hasStreamingFinalText = false;
  const deliveredFinalTexts = /* @__PURE__ */ new Set();
  let sentIndependentBlockText = false;
  let partialUpdateQueue = Promise.resolve();
  let streamingStartPromise = null;
  let streamingClosedForReply = false;
  let streamingCloseErroredForReply = false;
  let visibleReplySent = false;
  let skippedFinalReason = null;
  let idleSideEffectsPromise = Promise.resolve();
  let replyLifecycleStateInitialized = false;
  const markVisibleReplySent = () => {
    visibleReplySent = true;
  };
  const formatReasoningPrefix = (thinking) => {
    if (!thinking) return "";
    return `> 💭 **Thinking**\n${thinking
      .replace(/^(?:Reasoning:|Thinking\.{0,3})\s*/u, "")
      .replace(/^_(.*)_$/gm, "$1")
      .split("\n")
      .map((line) => `> ${line}`)
      .join("\n")}`;
  };
  const buildCombinedStreamText = (thinking, answer) => {
    const parts = [];
    if (thinking) parts.push(formatReasoningPrefix(thinking));
    if (thinking && answer) parts.push("\n\n---\n\n");
    if (answer) parts.push(answer);
    if (statusLine) parts.push(parts.length > 0 ? `\n\n${statusLine}` : statusLine);
    return parts.join("");
  };
  const flushStreamingCardUpdate = (combined) => {
    partialUpdateQueue = partialUpdateQueue.then(async () => {
      if (streamingStartPromise) await streamingStartPromise;
      if (streaming?.isActive()) await streaming.update(combined);
    });
  };
  const queueStreamingUpdate = (nextText, options) => {
    if (!nextText) return;
    if (options?.dedupeWithLastPartial && nextText === lastPartial) return;
    if (options?.dedupeWithLastPartial) lastPartial = nextText;
    if ((options?.mode ?? "snapshot") === "delta") streamText = `${streamText}${nextText}`;
    else {
      const currentSnapshotText = snapshotBaseText
        ? streamText.slice(snapshotBaseText.length)
        : streamText;
      if (
        lastSnapshotTextLength >= 20 &&
        nextText.length < lastSnapshotTextLength * 0.5 &&
        !currentSnapshotText.includes(nextText)
      ) {
        snapshotBaseText = streamText;
        streamText = `${snapshotBaseText}${nextText}`;
      } else streamText = `${snapshotBaseText}${mergeStreamingText(currentSnapshotText, nextText)}`;
      lastSnapshotTextLength = nextText.length;
    }
    flushStreamingCardUpdate(buildCombinedStreamText(reasoningText, streamText));
  };
  const queueReasoningUpdate = (nextThinking) => {
    if (!nextThinking) return;
    reasoningText = nextThinking;
    flushStreamingCardUpdate(buildCombinedStreamText(reasoningText, streamText));
  };
  const startStreaming = () => {
    if (
      !streamingEnabled ||
      streamingStartPromise ||
      streaming ||
      isStreamingStartBackedOff(account.accountId)
    )
      return;
    streamingStartPromise = (async () => {
      const creds =
        account.appId && account.appSecret
          ? {
              appId: account.appId,
              appSecret: account.appSecret,
              domain: account.domain,
              httpTimeoutMs: resolveConfiguredHttpTimeoutMs(account),
            }
          : null;
      if (!creds) return;
      streaming = new FeishuStreamingSession(createFeishuClient(account), creds, (message) =>
        params.runtime.log?.(`feishu[${account.accountId}] ${message}`),
      );
      try {
        const cardHeader = resolveCardHeader(agentId, identity);
        const cardNote = resolveCardNote(agentId, identity, prefixContext.prefixContext);
        const streamingTarget = sendTarget
          .replace(/^(feishu|lark):/i, "")
          .replace(/^(chat|user|group|dm|open_id):/i, "")
          .trim();
        await streaming.start(streamingTarget, resolveReceiveIdType(sendTarget), {
          replyToMessageId: sendReplyToMessageId,
          replyInThread: effectiveReplyInThread,
          rootId,
          header: cardHeader,
          note: cardNote,
        });
        streamingStartBackoffUntilByAccount.delete(account.accountId);
      } catch (error) {
        rememberStreamingStartFailure(account.accountId);
        params.runtime.error?.(
          `feishu[${account.accountId}]: streaming start failed; using non-streaming card fallback for ${STREAMING_START_FAILURE_BACKOFF_MS / 1e3}s: ${String(error)}`,
        );
        streaming = null;
        streamingStartPromise = null;
      }
    })();
  };
  const resetStreamingState = () => {
    streaming = null;
    streamingStartPromise = null;
    partialUpdateQueue = Promise.resolve();
    streamText = "";
    lastPartial = "";
    reasoningText = "";
    statusLine = "";
    snapshotBaseText = "";
    lastSnapshotTextLength = 0;
    hasStreamingFinalText = false;
  };
  const closeStreaming = async (options) => {
    try {
      if (streamingStartPromise) await streamingStartPromise;
      await partialUpdateQueue;
      if (streaming?.isActive()) {
        statusLine = "";
        const text = buildCombinedStreamText(reasoningText, streamText);
        const finalNote = resolveCardNote(agentId, identity, prefixContext.prefixContext);
        const contentVisible = await streaming.close(text, { note: finalNote });
        if (contentVisible) markVisibleReplySent();
        if (contentVisible && streamText) {
          deliveredFinalTexts.add(streamText);
          if (options?.markClosedForReply !== false && !streamingCloseErroredForReply)
            streamingClosedForReply = true;
        }
      }
    } finally {
      resetStreamingState();
    }
  };
  const discardStreamingPreview = async () => {
    try {
      if (streamingStartPromise) await streamingStartPromise;
      await partialUpdateQueue;
      if (streaming?.isActive()) await streaming.discard();
    } finally {
      resetStreamingState();
    }
  };
  const updateStreamingStatusLine = (nextStatusLine, options) => {
    statusLine = nextStatusLine;
    if (
      !Boolean(streaming?.isActive() || streamingStartPromise) &&
      (options?.startIfNeeded === false || renderMode !== "card")
    )
      return;
    startStreaming();
    flushStreamingCardUpdate(buildCombinedStreamText(reasoningText, streamText));
  };
  const sendChunkedTextReply = async (paramsLocal) => {
    const chunkSource = paramsLocal.useCard
      ? paramsLocal.text
      : core.channel.text.convertMarkdownTables(paramsLocal.text, tableMode);
    const chunks = resolveTextChunksWithFallback(
      chunkSource,
      (paramsLocal.useCard
        ? core.channel.text.chunkMarkdownTextWithMode
        : core.channel.text.chunkTextWithMode)(chunkSource, textChunkLimit, chunkMode),
    );
    for (const [index, chunk] of chunks.entries()) {
      await paramsLocal.sendChunk({
        chunk,
        isFirst: index === 0,
      });
      markVisibleReplySent();
    }
    if (paramsLocal.infoKind === "final") deliveredFinalTexts.add(paramsLocal.text);
  };
  const sendMediaReplies = async (payload, options) => {
    const mediaUrls = resolveSendableOutboundReplyParts(payload).mediaUrls;
    let sentFallbackText = false;
    await sendMediaWithLeadingCaption({
      mediaUrls,
      caption: "",
      send: async ({ mediaUrl }) => {
        const result = await sendMediaFeishu({
          cfg,
          to: sendTarget,
          mediaUrl,
          replyToMessageId: sendReplyToMessageId,
          replyInThread: effectiveReplyInThread,
          accountId,
          ...(payload.audioAsVoice === true ? { audioAsVoice: true } : {}),
        });
        markVisibleReplySent();
        if (result?.voiceIntentDegradedToFile && options?.fallbackText && !sentFallbackText) {
          sentFallbackText = true;
          await sendChunkedTextReply({
            text: options.fallbackText,
            useCard: false,
            infoKind: "final",
            sendChunk: async ({ chunk }) => {
              await sendMessageFeishu({
                cfg,
                to: sendTarget,
                text: chunk,
                replyToMessageId: sendReplyToMessageId,
                replyInThread: effectiveReplyInThread,
                allowTopLevelReplyFallback,
                accountId,
              });
            },
          });
        }
      },
      onError:
        options?.fallbackText === void 0
          ? void 0
          : async ({ mediaUrl }) => {
              const fallbackText = formatMediaFallbackText(
                sentFallbackText ? void 0 : options.fallbackText,
                mediaUrl,
              );
              sentFallbackText = true;
              await sendChunkedTextReply({
                text: fallbackText,
                useCard: false,
                infoKind: "final",
                sendChunk: async ({ chunk }) => {
                  await sendMessageFeishu({
                    cfg,
                    to: sendTarget,
                    text: chunk,
                    replyToMessageId: sendReplyToMessageId,
                    replyInThread: effectiveReplyInThread,
                    allowTopLevelReplyFallback,
                    accountId,
                  });
                },
              });
            },
    });
  };
  const ensureNoVisibleReplyFallback = async (reason) => {
    await idleSideEffectsPromise;
    if (visibleReplySent) return false;
    if (skippedFinalReason === "silent") {
      params.runtime.log?.(
        `feishu[${account.accountId}]: no-visible-reply fallback skipped for intentional silence (${reason})`,
      );
      return false;
    }
    await sendMessageFeishu({
      cfg,
      to: sendTarget,
      text: NO_VISIBLE_REPLY_FALLBACK_TEXT,
      replyToMessageId: sendReplyToMessageId,
      replyInThread: effectiveReplyInThread,
      allowTopLevelReplyFallback,
      accountId,
    });
    markVisibleReplySent();
    params.runtime.error?.(
      `feishu[${account.accountId}]: sent no-visible-reply fallback (${reason})`,
    );
    return true;
  };
  const queueIdleSideEffects = (options) => {
    const nextIdleSideEffects = idleSideEffectsPromise.then(async () => {
      await closeStreaming(options);
      typingCallbacks?.onIdle?.();
    });
    idleSideEffectsPromise = nextIdleSideEffects.catch(() => {});
    return nextIdleSideEffects;
  };
  const { dispatcher, replyOptions, markDispatchIdle } =
    core.channel.reply.createReplyDispatcherWithTyping({
      responsePrefix: prefixContext.responsePrefix,
      responsePrefixContextProvider: prefixContext.responsePrefixContextProvider,
      humanDelay: core.channel.reply.resolveHumanDelayConfig(cfg, agentId),
      silentReplyContext: {
        cfg,
        sessionKey: params.sessionKey,
        surface: "feishu",
        conversationType: chatId.startsWith("oc_") ? "group" : "direct",
      },
      onSkip: (_payload, info) => {
        if (info.kind === "final") skippedFinalReason = info.reason;
      },
      onReplyStart: async () => {
        if (!replyLifecycleStateInitialized) {
          replyLifecycleStateInitialized = true;
          deliveredFinalTexts.clear();
          sentIndependentBlockText = false;
          streamingClosedForReply = false;
          streamingCloseErroredForReply = false;
          visibleReplySent = false;
          skippedFinalReason = null;
        }
        if (streamingEnabled && renderMode === "card") startStreaming();
        await Promise.resolve(typingCallbacks?.onReplyStart?.());
      },
      deliver: async (payload, info) => {
        if (info?.kind === "final") skippedFinalReason = null;
        const payloadText =
          payload.isReasoning && payload.text ? formatReasoningMessage(payload.text) : payload.text;
        const reply = resolveSendableOutboundReplyParts({
          ...payload,
          text: payloadText,
        });
        const text =
          info?.kind === "final"
            ? mergeStreamingFinalText(
                streamText,
                reply.text,
                payload.isError === true && hasStreamingFinalText,
              )
            : reply.text;
        const hasText = reply.hasText;
        const hasMedia = reply.hasMedia;
        const hasVoiceMedia =
          hasMedia &&
          reply.mediaUrls.some((mediaUrl) =>
            shouldSuppressFeishuTextForVoiceMedia({
              mediaUrl,
              ...(payload.audioAsVoice === true ? { audioAsVoice: true } : {}),
            }),
          );
        const finalTextExceedsStreamingLimit =
          info?.kind === "final" && hasText && text.length > textChunkLimit;
        const useStaticCard =
          hasText &&
          (renderMode === "card" ||
            (info?.kind === "block" && coreBlockStreamingEnabled && renderMode !== "raw") ||
            (renderMode === "auto" && shouldUseCard(text)));
        const useStreamingCard =
          hasText &&
          streamingEnabled &&
          !finalTextExceedsStreamingLimit &&
          (info?.kind === "final" || useStaticCard);
        const finalTextWouldUseStreamingCard =
          info?.kind === "final" && hasText && streamingEnabled;
        const useCard = useStaticCard || useStreamingCard;
        const skipTextForDuplicateFinal =
          info?.kind === "final" && hasText && deliveredFinalTexts.has(text);
        const skipTextForClosedStreamingFinal =
          info?.kind === "final" &&
          hasText &&
          streamingClosedForReply &&
          !streamingCloseErroredForReply &&
          finalTextWouldUseStreamingCard;
        const shouldDeliverText =
          hasText &&
          !hasVoiceMedia &&
          !skipTextForDuplicateFinal &&
          !skipTextForClosedStreamingFinal;
        const shouldDiscardStreamingPreview =
          info?.kind === "final" &&
          (finalTextExceedsStreamingLimit ||
            (hasMedia && ((hasVoiceMedia && !shouldDeliverText) || skipTextForDuplicateFinal)));
        if (!shouldDeliverText && !hasMedia) return;
        if (shouldDiscardStreamingPreview) await discardStreamingPreview();
        if (shouldDeliverText) {
          if (info?.kind === "block") {
            if (!useStreamingCard) {
              if (coreBlockStreamingEnabled) {
                const isFirstBlock = !sentIndependentBlockText;
                await sendChunkedTextReply({
                  text,
                  useCard: false,
                  infoKind: "block",
                  sendChunk: async ({ chunk, isFirst }) => {
                    await sendMessageFeishu({
                      cfg,
                      to: sendTarget,
                      text: chunk,
                      replyToMessageId: sendReplyToMessageId,
                      replyInThread: effectiveReplyInThread,
                      allowTopLevelReplyFallback,
                      accountId,
                      ...(isFirstBlock && isFirst && mentionTargets?.length
                        ? { mentions: mentionTargets }
                        : {}),
                    });
                  },
                });
                sentIndependentBlockText = true;
                if (hasMedia) await sendMediaReplies(payload);
              }
              return;
            }
            startStreaming();
            if (streamingStartPromise) await streamingStartPromise;
          }
          if (info?.kind === "final" && useStreamingCard) {
            startStreaming();
            if (streamingStartPromise) await streamingStartPromise;
          }
          const shouldStreamText = info?.kind === "block" || info?.kind === "final";
          if (streaming?.isActive() && shouldStreamText) {
            if (info?.kind === "block")
              queueStreamingUpdate(text, {
                mode: "delta",
                dedupeWithLastPartial: true,
              });
            if (info?.kind === "final") {
              streamText = text;
              hasStreamingFinalText = true;
              snapshotBaseText = "";
              lastSnapshotTextLength = text.length;
              flushStreamingCardUpdate(buildCombinedStreamText(reasoningText, streamText));
            }
            if (hasMedia) await sendMediaReplies(payload);
            return;
          }
          if (useCard) {
            const cardHeader = resolveCardHeader(agentId, identity);
            const cardNote = resolveCardNote(agentId, identity, prefixContext.prefixContext);
            await sendChunkedTextReply({
              text,
              useCard: true,
              infoKind: info?.kind,
              sendChunk: async ({ chunk }) => {
                await sendStructuredCardFeishu({
                  cfg,
                  to: sendTarget,
                  text: chunk,
                  replyToMessageId: sendReplyToMessageId,
                  replyInThread: effectiveReplyInThread,
                  allowTopLevelReplyFallback,
                  accountId,
                  header: cardHeader,
                  note: cardNote,
                });
              },
            });
          } else
            await sendChunkedTextReply({
              text,
              useCard: false,
              infoKind: info?.kind,
              sendChunk: async ({ chunk, isFirst }) => {
                await sendMessageFeishu({
                  cfg,
                  to: sendTarget,
                  text: chunk,
                  replyToMessageId: sendReplyToMessageId,
                  replyInThread: effectiveReplyInThread,
                  allowTopLevelReplyFallback,
                  accountId,
                  ...(info?.kind === "final" && isFirst && mentionTargets?.length
                    ? { mentions: mentionTargets }
                    : {}),
                });
              },
            });
        }
        if (hasMedia)
          await sendMediaReplies(
            payload,
            hasVoiceMedia && hasText ? { fallbackText: text } : void 0,
          );
      },
      onError: async (error, info) => {
        streamingCloseErroredForReply = true;
        streamingClosedForReply = false;
        params.runtime.error?.(
          `feishu[${account.accountId}] ${info.kind} reply failed: ${String(error)}`,
        );
        await queueIdleSideEffects({ markClosedForReply: false });
      },
      onIdle: () => queueIdleSideEffects(),
      onCleanup: () => {
        typingCallbacks?.onCleanup?.();
      },
    });
  return {
    dispatcher,
    replyOptions: {
      ...replyOptions,
      onModelSelected: prefixContext.onModelSelected,
      disableBlockStreaming:
        typeof blockStreamingEnabled === "boolean" ? !blockStreamingEnabled : true,
      onPartialReply: streamingEnabled
        ? (payload) => {
            if (!payload.text) return;
            const cleaned = stripReasoningTagsFromText(payload.text, {
              mode: "strict",
              trim: "both",
            });
            if (!cleaned) return;
            startStreaming();
            queueStreamingUpdate(cleaned, {
              dedupeWithLastPartial: true,
              mode: "snapshot",
            });
          }
        : void 0,
      onReasoningStream: reasoningPreviewEnabled
        ? (payload) => {
            if (!payload.text) return;
            startStreaming();
            queueReasoningUpdate(formatReasoningMessage(payload.text));
          }
        : void 0,
      onReasoningEnd: reasoningPreviewEnabled ? () => {} : void 0,
      onToolStart: streamingEnabled
        ? (payload) => {
            if (!isChannelProgressDraftWorkToolName(payload.name)) return;
            const statusLineLocal = formatChannelProgressDraftLineForEntry(
              account.config,
              {
                event: "tool",
                name: payload.name,
                phase: payload.phase,
                args: payload.args,
              },
              { detailMode: payload.detailMode },
            );
            if (statusLineLocal) updateStreamingStatusLine(statusLineLocal);
          }
        : void 0,
      onAssistantMessageStart: streamingEnabled
        ? () => {
            updateStreamingStatusLine("", { startIfNeeded: false });
          }
        : void 0,
      onCompactionStart: streamingEnabled
        ? () => {
            updateStreamingStatusLine("📦 **Compacting context...**");
          }
        : void 0,
      onCompactionEnd: streamingEnabled
        ? () => {
            updateStreamingStatusLine("");
          }
        : void 0,
    },
    markDispatchIdle,
    ensureNoVisibleReplyFallback,
    getVisibleReplyState: () => ({
      visibleReplySent,
      skippedFinalReason,
    }),
  };
}
//#endregion
//#region extensions/feishu/src/bot.ts
const permissionErrorNotifiedAt = /* @__PURE__ */ new Map();
const PERMISSION_ERROR_COOLDOWN_MS = 300 * 1e3;
function shouldSendNoVisibleReplyFallback(dispatchResult) {
  const finalCount = dispatchResult.counts.final ?? 0;
  const failedFinalCount = dispatchResult.failedCounts?.final ?? 0;
  const emptyEligibleDispatch =
    dispatchResult.noVisibleReplyFallbackEligible === true &&
    dispatchResult.queuedFinal !== true &&
    finalCount === 0;
  const queuedFinalFailed = dispatchResult.queuedFinal === true && failedFinalCount > 0;
  return (
    dispatchResult.sendPolicyDenied !== true &&
    dispatchResult.sourceReplyDeliveryMode !== "message_tool_only" &&
    (emptyEligibleDispatch || queuedFinalFailed)
  );
}
function isFeishuTopicSessionScope(scope) {
  return scope === "group_topic" || scope === "group_topic_sender";
}
async function resolveFeishuAudioPreflightTranscript(params) {
  if (params.content.trim() !== "<media:audio>") return;
  const audioMedia = params.mediaList.filter((media) => media.contentType?.startsWith("audio/"));
  if (audioMedia.length === 0) return;
  try {
    const { transcribeFirstAudio } = await import("./audio-preflight.runtime.js");
    return await transcribeFirstAudio({
      ctx: {
        MediaPaths: audioMedia.map((media) => media.path),
        MediaTypes: audioMedia.map((media) => media.contentType).filter(Boolean),
        ChatType: params.chatType,
      },
      cfg: params.cfg,
    });
  } catch (err) {
    params.log(`feishu: audio preflight transcription failed: ${String(err)}`);
    return;
  }
}
/**
 * Build media payload for inbound context.
 * Similar to Discord's buildDiscordMediaPayload().
 */
function parseFeishuMessageEvent(event, botOpenId, _botName) {
  const rawContent = parseMessageContent(event.message.content, event.message.message_type);
  const mentionedBot = checkBotMentioned(event, botOpenId);
  const hasAnyMention = (event.message.mentions?.length ?? 0) > 0;
  const content = normalizeMentions(rawContent, event.message.mentions, botOpenId);
  const senderOpenId = event.sender.sender_id.open_id?.trim();
  const senderUserId = event.sender.sender_id.user_id?.trim();
  const senderFallbackId = senderOpenId || senderUserId || "";
  const ctx = {
    chatId: event.message.chat_id,
    messageId: event.message.message_id,
    replyTargetMessageId: event.message.reply_target_message_id?.trim() || void 0,
    typingTargetMessageId: event.message.typing_target_message_id?.trim() || void 0,
    suppressReplyTarget: event.message.suppress_reply_target === true,
    senderId: senderUserId || senderOpenId || "",
    senderOpenId: senderFallbackId,
    chatType: event.message.chat_type,
    mentionedBot,
    hasAnyMention,
    rootId: event.message.root_id || void 0,
    parentId: event.message.parent_id || void 0,
    threadId: event.message.thread_id || void 0,
    content,
    contentType: event.message.message_type,
  };
  const mentionForwardBotOpenId = botOpenId?.trim();
  if (mentionForwardBotOpenId && isMentionForwardRequest(event, mentionForwardBotOpenId)) {
    const mentionTargets = extractMentionTargets(event, mentionForwardBotOpenId);
    if (mentionTargets.length > 0) ctx.mentionTargets = mentionTargets;
  }
  return ctx;
}
async function shouldIncludeFetchedGroupContextMessage(params) {
  let senderAllowed =
    !params.isGroup || params.allowFrom.length === 0 || params.senderType === "app";
  const senderId = params.senderId?.trim();
  if (!senderAllowed && senderId)
    senderAllowed =
      (
        await resolveFeishuGroupSenderActivationIngressAccess({
          cfg: params.cfg,
          accountId: params.accountId,
          chatId: params.chatId,
          allowFrom: params.allowFrom,
          senderOpenId: senderId,
          senderUserId: senderId,
          requireMention: false,
          mentionedBot: true,
        })
      ).senderAccess.decision === "allow";
  return evaluateSupplementalContextVisibility({
    mode: params.mode,
    kind: params.kind,
    senderAllowed,
  }).include;
}
async function filterFetchedGroupContextMessages(messages, params) {
  return (
    await Promise.all(
      messages.map(async (message) =>
        (await shouldIncludeFetchedGroupContextMessage({
          cfg: params.cfg,
          accountId: params.accountId,
          chatId: params.chatId,
          isGroup: params.isGroup,
          allowFrom: params.allowFrom,
          mode: params.mode,
          kind: params.kind,
          senderId: message.senderId,
          senderType: message.senderType,
        }))
          ? message
          : void 0,
      ),
    )
  ).filter((message) => message !== void 0);
}
async function handleFeishuMessage(params) {
  const {
    cfg,
    event,
    botOpenId,
    botName,
    runtime,
    channelRuntime,
    chatHistories,
    accountId,
    processingClaimHeld = false,
    messageDedupeKey: messageDedupeKeyOverride,
  } = params;
  const account = resolveFeishuRuntimeAccount({
    cfg,
    accountId,
  });
  const feishuCfg = account.config;
  const log = runtime?.log ?? console.log;
  const error = runtime?.error ?? console.error;
  const messageId = event.message.message_id;
  const messageDedupeKey = messageDedupeKeyOverride ?? resolveFeishuMessageDedupeKey(event);
  if (
    !(await finalizeFeishuMessageProcessing({
      messageId: messageDedupeKey,
      namespace: account.accountId,
      log,
      claimHeld: processingClaimHeld,
    }))
  ) {
    log(`feishu: skipping duplicate message ${messageId}`);
    return;
  }
  let ctx = parseFeishuMessageEvent(event, botOpenId, botName);
  const isGroup = isFeishuGroupChatType(ctx.chatType);
  const isDirect = !isGroup;
  const senderUserId = normalizeOptionalString(event.sender.sender_id.user_id);
  if (event.message.message_type === "merge_forward") {
    log(
      `feishu[${account.accountId}]: processing merge_forward message, fetching full content via API`,
    );
    try {
      const response = await createFeishuClient(account).im.message.get({
        path: { message_id: event.message.message_id },
      });
      if (response.code === 0 && response.data?.items && response.data.items.length > 0) {
        log(
          `feishu[${account.accountId}]: merge_forward API returned ${response.data.items.length} items`,
        );
        const expandedContent = parseMergeForwardContent({
          content: JSON.stringify(response.data.items),
          log,
        });
        ctx = {
          ...ctx,
          content: expandedContent,
        };
      } else {
        log(`feishu[${account.accountId}]: merge_forward API returned no items`);
        ctx = {
          ...ctx,
          content: "[Merged and Forwarded Message - could not fetch]",
        };
      }
    } catch (err) {
      log(`feishu[${account.accountId}]: merge_forward fetch failed: ${String(err)}`);
      ctx = {
        ...ctx,
        content: "[Merged and Forwarded Message - fetch error]",
      };
    }
  }
  let permissionErrorForAgent;
  if (feishuCfg?.resolveSenderNames ?? true) {
    const senderResult = await resolveFeishuSenderName({
      account,
      senderId: ctx.senderOpenId,
      log,
    });
    if (senderResult.name)
      ctx = {
        ...ctx,
        senderName: senderResult.name,
      };
    if (senderResult.permissionError) {
      const appKey = account.appId ?? "default";
      const now = Date.now();
      if (now - (permissionErrorNotifiedAt.get(appKey) ?? 0) > PERMISSION_ERROR_COOLDOWN_MS) {
        permissionErrorNotifiedAt.set(appKey, now);
        permissionErrorForAgent = senderResult.permissionError;
      }
    }
  }
  log(
    `feishu[${account.accountId}]: received message from ${ctx.senderOpenId} in ${ctx.chatId} (${ctx.chatType})`,
  );
  if (ctx.mentionTargets && ctx.mentionTargets.length > 0) {
    const names = ctx.mentionTargets.map((t) => t.name).join(", ");
    log(`feishu[${account.accountId}]: detected @ forward request, targets: [${names}]`);
  }
  const historyLimit = Math.max(
    0,
    feishuCfg?.historyLimit ?? cfg.messages?.groupChat?.historyLimit ?? 50,
  );
  const groupConfig = isGroup
    ? resolveFeishuGroupConfig({
        cfg: feishuCfg,
        groupId: ctx.chatId,
      })
    : void 0;
  const groupSessionScope = isGroup
    ? resolveConfiguredFeishuGroupSessionScope({
        groupConfig,
        feishuCfg,
      })
    : null;
  let effectiveThreadId = ctx.threadId;
  if (
    isGroup &&
    ctx.chatType === "topic_group" &&
    !effectiveThreadId &&
    isFeishuTopicSessionScope(groupSessionScope ?? "group")
  )
    try {
      const hydratedThreadId = (
        await getMessageFeishu({
          cfg,
          accountId: account.accountId,
          messageId: ctx.messageId,
        })
      )?.threadId?.trim();
      if (hydratedThreadId) {
        ctx = {
          ...ctx,
          threadId: hydratedThreadId,
        };
        effectiveThreadId = hydratedThreadId;
        log(
          `feishu[${account.accountId}]: hydrated topic thread_id=${hydratedThreadId} for message=${ctx.messageId}`,
        );
      }
    } catch (err) {
      log(
        `feishu[${account.accountId}]: failed to hydrate topic thread_id for message=${ctx.messageId}: ${String(err)}`,
      );
    }
  const effectiveGroupSenderAllowFrom = isGroup
    ? (groupConfig?.allowFrom?.length ?? 0) > 0
      ? (groupConfig?.allowFrom ?? [])
      : (feishuCfg?.groupSenderAllowFrom ?? [])
    : [];
  const groupSession = isGroup
    ? resolveFeishuGroupSession({
        chatId: ctx.chatId,
        senderOpenId: ctx.senderOpenId,
        messageId: ctx.messageId,
        rootId: ctx.rootId,
        threadId: effectiveThreadId,
        chatType: ctx.chatType,
        groupConfig,
        feishuCfg,
      })
    : null;
  const groupHistoryKey = isGroup ? (groupSession?.peerId ?? ctx.chatId) : void 0;
  const dmPolicy = feishuCfg?.dmPolicy ?? "pairing";
  const configAllowFrom = feishuCfg?.allowFrom ?? [];
  const rawBroadcastAgents = isGroup ? resolveBroadcastAgents(cfg, ctx.chatId) : null;
  const broadcastAgents = rawBroadcastAgents
    ? uniqueStrings(rawBroadcastAgents.map((id) => normalizeAgentId$1(id)))
    : null;
  const messageCreateTimeMs =
    parseStrictNonNegativeInteger(event.message.create_time) ?? Date.now();
  let requireMention = false;
  if (isGroup) {
    if (groupConfig?.enabled === false) {
      log(`feishu[${account.accountId}]: group ${ctx.chatId} is disabled`);
      return;
    }
    const defaultGroupPolicy = resolveDefaultGroupPolicy(cfg);
    const { groupPolicy, providerMissingFallbackApplied } = resolveOpenProviderRuntimeGroupPolicy({
      providerConfigPresent: cfg.channels?.feishu !== void 0,
      groupPolicy: feishuCfg?.groupPolicy,
      defaultGroupPolicy,
    });
    warnMissingProviderGroupPolicyFallbackOnce({
      providerMissingFallbackApplied,
      providerKey: "feishu",
      accountId: account.accountId,
      log,
    });
    const groupAllowFrom = feishuCfg?.groupAllowFrom ?? [];
    const groupExplicitlyConfigured = hasExplicitFeishuGroupConfig({
      cfg: feishuCfg,
      groupId: ctx.chatId,
    });
    if (
      (
        await resolveFeishuGroupConversationIngressAccess({
          cfg,
          accountId: account.accountId,
          chatId: ctx.chatId,
          groupPolicy,
          groupAllowFrom,
          groupExplicitlyConfigured,
        })
      ).ingress.admission !== "dispatch"
    ) {
      log(
        `feishu[${account.accountId}]: group ${ctx.chatId} not in groupAllowFrom (groupPolicy=${groupPolicy})`,
      );
      return;
    }
    ({ requireMention } = resolveFeishuReplyPolicy({
      isDirectMessage: false,
      cfg,
      accountId: account.accountId,
      groupId: ctx.chatId,
      groupPolicy,
    }));
    const groupSenderActivationIngress = await resolveFeishuGroupSenderActivationIngressAccess({
      cfg,
      accountId: account.accountId,
      chatId: ctx.chatId,
      allowFrom: effectiveGroupSenderAllowFrom,
      senderOpenId: ctx.senderOpenId,
      senderUserId,
      requireMention,
      mentionedBot: ctx.mentionedBot,
    });
    if (groupSenderActivationIngress.senderAccess.decision !== "allow") {
      log(`feishu: sender ${ctx.senderOpenId} not in group ${ctx.chatId} sender allowlist`);
      return;
    }
    if (groupSenderActivationIngress.ingress.admission !== "dispatch") {
      log(`feishu[${account.accountId}]: message in group ${ctx.chatId} did not mention bot`);
      if (!broadcastAgents && chatHistories && groupHistoryKey)
        createChannelHistoryWindow({ historyMap: chatHistories }).record({
          historyKey: groupHistoryKey,
          limit: historyLimit,
          entry: {
            sender: ctx.senderOpenId,
            body: `${ctx.senderName ?? ctx.senderOpenId}: ${ctx.content}`,
            timestamp: messageCreateTimeMs,
            messageId: ctx.messageId,
          },
        });
      return;
    }
  }
  try {
    const core = { channel: channelRuntime?.inbound ? channelRuntime : getFeishuRuntime().channel };
    const pairing = createChannelPairingController({
      core,
      channel: "feishu",
      accountId: account.accountId,
    });
    const commandProbeBody = isGroup ? normalizeFeishuCommandProbeBody(ctx.content) : ctx.content;
    const shouldComputeCommandAuthorized = core.channel.commands.shouldComputeCommandAuthorized(
      commandProbeBody,
      cfg,
    );
    const resolveDirectAuthorization = async (
      candidateCfg,
      mayPair,
      shouldComputeCommand = core.channel.commands.shouldComputeCommandAuthorized(
        commandProbeBody,
        candidateCfg,
      ),
    ) => {
      const candidateAccount = resolveFeishuRuntimeAccount({
        cfg: candidateCfg,
        accountId: account.accountId,
      });
      const candidateDmPolicy = candidateAccount.config.dmPolicy ?? "pairing";
      const candidateConfigAllowFrom = candidateAccount.config.allowFrom ?? [];
      return {
        cfg: candidateCfg,
        dmPolicy: candidateDmPolicy,
        configAllowFrom: candidateConfigAllowFrom,
        ingress: await resolveFeishuDmIngressAccess({
          cfg: candidateCfg,
          accountId: candidateAccount.accountId,
          dmPolicy: candidateDmPolicy,
          allowFrom: candidateConfigAllowFrom,
          readAllowFromStore: pairing.readAllowFromStore,
          senderOpenId: ctx.senderOpenId,
          senderUserId,
          conversationId: ctx.senderOpenId,
          mayPair,
          ...(shouldComputeCommand ? { command: { hasControlCommand: true } } : {}),
        }),
        shouldComputeCommandAuthorized: shouldComputeCommand,
      };
    };
    const rejectDirectAuthorization = async (authorization) => {
      if (authorization.ingress.ingress.admission === "pairing-required")
        await pairing.issueChallenge({
          senderId: ctx.senderOpenId,
          senderIdLine: `Your Feishu user id: ${ctx.senderOpenId}`,
          meta: { name: ctx.senderName },
          onCreated: () => {
            log(`feishu[${account.accountId}]: pairing request sender=${ctx.senderOpenId}`);
          },
          sendPairingReply: async (text) => {
            await sendMessageFeishu({
              cfg: authorization.cfg,
              to: `chat:${ctx.chatId}`,
              text,
              accountId: account.accountId,
            });
          },
          onReplyError: (err) => {
            log(
              `feishu[${account.accountId}]: pairing reply failed for ${ctx.senderOpenId}: ${String(err)}`,
            );
          },
        });
      else
        log(
          `feishu[${account.accountId}]: blocked unauthorized sender ${ctx.senderOpenId} (dmPolicy=${authorization.dmPolicy})`,
        );
    };
    const directAuthorization = isDirect
      ? await resolveDirectAuthorization(cfg, true, shouldComputeCommandAuthorized)
      : null;
    const dmIngress = directAuthorization?.ingress ?? null;
    if (isDirect && dmIngress?.ingress.admission !== "dispatch") {
      if (directAuthorization) await rejectDirectAuthorization(directAuthorization);
      return;
    }
    let effectiveDmPolicy = directAuthorization?.dmPolicy ?? dmPolicy;
    let effectiveConfigAllowFrom = directAuthorization?.configAllowFrom ?? configAllowFrom;
    let effectiveDmIngress = dmIngress;
    let effectiveShouldComputeCommandAuthorized =
      directAuthorization?.shouldComputeCommandAuthorized ?? shouldComputeCommandAuthorized;
    let effectiveCfg = cfg;
    if (isDirect) {
      const currentCfg = getFeishuRuntime().config.current();
      if (currentCfg !== effectiveCfg) {
        const currentAuthorization = await resolveDirectAuthorization(currentCfg, true);
        if (currentAuthorization.ingress.ingress.admission !== "dispatch") {
          await rejectDirectAuthorization(currentAuthorization);
          return;
        }
        effectiveCfg = currentCfg;
        effectiveDmPolicy = currentAuthorization.dmPolicy;
        effectiveConfigAllowFrom = currentAuthorization.configAllowFrom;
        effectiveDmIngress = currentAuthorization.ingress;
        effectiveShouldComputeCommandAuthorized =
          currentAuthorization.shouldComputeCommandAuthorized;
      }
    }
    const feishuFrom = `feishu:${ctx.senderOpenId}`;
    const feishuTo = isGroup ? `chat:${ctx.chatId}` : `user:${ctx.senderOpenId}`;
    const peerId = isGroup ? (groupSession?.peerId ?? ctx.chatId) : ctx.senderOpenId;
    const parentPeer = isGroup ? (groupSession?.parentPeer ?? null) : null;
    const directThreadReply = !isGroup && Boolean(ctx.threadId?.trim());
    const defaultReplyTargetMessageId =
      ctx.replyTargetMessageId ?? (ctx.suppressReplyTarget ? void 0 : ctx.messageId);
    const directThreadRootId = directThreadReply ? ctx.rootId?.trim() || void 0 : void 0;
    const directThreadReplyTargetMessageId = directThreadReply
      ? (directThreadRootId ?? defaultReplyTargetMessageId)
      : void 0;
    const replyInThread = isGroup ? (groupSession?.replyInThread ?? false) : directThreadReply;
    const feishuAcpConversationSupported =
      !isGroup ||
      groupSession?.groupSessionScope === "group_topic" ||
      groupSession?.groupSessionScope === "group_topic_sender";
    if (isGroup && groupSession)
      log(
        `feishu[${account.accountId}]: group session scope=${groupSession.groupSessionScope}, peer=${peerId}`,
      );
    let route = core.channel.routing.resolveAgentRoute({
      cfg: effectiveCfg,
      channel: "feishu",
      accountId: account.accountId,
      peer: {
        kind: isGroup ? "group" : "direct",
        id: peerId,
      },
      parentPeer,
    });
    if (!isGroup && route.matchedBy === "default") {
      const runtimeLocal = getFeishuRuntime();
      const result = await maybeCreateDynamicAgent({
        cfg: effectiveCfg,
        runtime: runtimeLocal,
        accountId: account.accountId,
        senderOpenId: ctx.senderOpenId,
        canCreateForConfig: async (candidateCfg) => {
          return (
            (await resolveDirectAuthorization(candidateCfg, false)).ingress.ingress.admission ===
            "dispatch"
          );
        },
        log: (msg) => log(msg),
      });
      if (result.created || result.updatedCfg !== effectiveCfg) {
        const refreshedAuthorization = await resolveDirectAuthorization(result.updatedCfg, false);
        if (refreshedAuthorization.ingress.ingress.admission !== "dispatch") {
          log(
            `feishu[${account.accountId}]: current policy rejected stale DM from ${ctx.senderOpenId} before adopting refreshed dynamic route (dmPolicy=${refreshedAuthorization.dmPolicy})`,
          );
          return;
        }
        effectiveCfg = result.updatedCfg;
        effectiveDmPolicy = refreshedAuthorization.dmPolicy;
        effectiveConfigAllowFrom = refreshedAuthorization.configAllowFrom;
        effectiveDmIngress = refreshedAuthorization.ingress;
        effectiveShouldComputeCommandAuthorized =
          refreshedAuthorization.shouldComputeCommandAuthorized;
        route = core.channel.routing.resolveAgentRoute({
          cfg: result.updatedCfg,
          channel: "feishu",
          accountId: account.accountId,
          peer: {
            kind: "direct",
            id: ctx.senderOpenId,
          },
        });
        if (result.created)
          log(
            `feishu[${account.accountId}]: dynamic agent created, new route: ${route.sessionKey}`,
          );
      }
    }
    const commandAllowFrom = isGroup
      ? (groupConfig?.allowFrom ?? effectiveConfigAllowFrom)
      : (effectiveDmIngress?.senderAccess.effectiveAllowFrom ?? effectiveConfigAllowFrom);
    const currentConversationId = peerId;
    const parentConversationId = isGroup ? (parentPeer?.id ?? ctx.chatId) : void 0;
    let configuredBinding = null;
    if (feishuAcpConversationSupported) {
      const configuredRoute = resolveConfiguredBindingRoute({
        cfg: effectiveCfg,
        route,
        conversation: {
          channel: "feishu",
          accountId: account.accountId,
          conversationId: currentConversationId,
          parentConversationId,
        },
      });
      configuredBinding = configuredRoute.bindingResolution;
      route = configuredRoute.route;
      const runtimeRoute = resolveRuntimeConversationBindingRoute({
        route,
        conversation: {
          channel: "feishu",
          accountId: account.accountId,
          conversationId: currentConversationId,
          ...(parentConversationId ? { parentConversationId } : {}),
        },
      });
      route = runtimeRoute.route;
      if (runtimeRoute.bindingRecord) {
        configuredBinding = null;
        log(
          runtimeRoute.boundSessionKey
            ? `feishu[${account.accountId}]: routed via bound conversation ${currentConversationId} -> ${runtimeRoute.boundSessionKey}`
            : `feishu[${account.accountId}]: plugin-bound conversation ${currentConversationId}`,
        );
      }
    }
    if (configuredBinding) {
      const ensured = await ensureConfiguredBindingRouteReady({
        cfg: effectiveCfg,
        bindingResolution: configuredBinding,
      });
      if (!ensured.ok) {
        const acpTopicReply =
          isGroup &&
          (groupSession?.groupSessionScope === "group_topic" ||
            groupSession?.groupSessionScope === "group_topic_sender");
        const replyTargetMessageId = directThreadReply
          ? directThreadReplyTargetMessageId
          : acpTopicReply
            ? (ctx.rootId ?? ctx.messageId)
            : ctx.messageId;
        await sendMessageFeishu({
          cfg: effectiveCfg,
          to: `chat:${ctx.chatId}`,
          text: `⚠️ Failed to initialize the configured ACP session for this Feishu conversation: ${ensured.error}`,
          replyToMessageId: replyTargetMessageId,
          replyInThread,
          accountId: account.accountId,
        }).catch((err) => {
          log(`feishu[${account.accountId}]: failed to send ACP init error reply: ${String(err)}`);
        });
        return;
      }
    }
    const preview = truncateUtf16Safe(ctx.content.replace(/\s+/g, " "), 160);
    const inboundLabel = isGroup
      ? `Feishu[${account.accountId}] message in group ${ctx.chatId}`
      : `Feishu[${account.accountId}] DM from ${ctx.senderOpenId}`;
    const contextVisibilityMode = resolveChannelContextVisibilityMode({
      cfg: effectiveCfg,
      channel: "feishu",
      accountId: account.accountId,
    });
    log(`feishu[${account.accountId}]: ${inboundLabel}: ${preview}`);
    const mediaMaxBytes = (feishuCfg?.mediaMaxMb ?? 30) * 1024 * 1024;
    const mediaResolution = await resolveFeishuMediaList({
      cfg,
      messageId: ctx.messageId,
      messageType: event.message.message_type,
      content: event.message.content,
      maxBytes: mediaMaxBytes,
      log,
      accountId: account.accountId,
    });
    const mediaList = mediaResolution.media;
    const mediaFailurePresentation = resolveFeishuMediaFailurePresentation(
      event.message.content,
      event.message.message_type,
    );
    const mediaFailureContent =
      mediaResolution.unavailableCount > 0
        ? formatInboundMediaUnavailableText({
            body: mediaFailurePresentation.unavailableBody ?? ctx.content,
            mediaPlaceholder: mediaFailurePresentation.mediaPlaceholder,
            notice: `[feishu ${mediaResolution.unavailableCount > 1 ? `${mediaResolution.unavailableCount} attachments` : "attachment"} unavailable]`,
          })
        : ctx.content;
    let quotedMessageInfo = null;
    let quotedContent;
    if (ctx.parentId)
      try {
        quotedMessageInfo = await getMessageFeishu({
          cfg,
          messageId: ctx.parentId,
          accountId: account.accountId,
        });
        if (
          quotedMessageInfo &&
          (await shouldIncludeFetchedGroupContextMessage({
            cfg,
            accountId: account.accountId,
            chatId: ctx.chatId,
            isGroup,
            allowFrom: effectiveGroupSenderAllowFrom,
            mode: contextVisibilityMode,
            kind: "quote",
            senderId: quotedMessageInfo.senderId,
            senderType: quotedMessageInfo.senderType,
          }))
        ) {
          quotedContent = quotedMessageInfo.content;
          log(
            `feishu[${account.accountId}]: fetched quoted message: ${truncateUtf16Safe(quotedContent, 100)}`,
          );
        } else if (quotedMessageInfo)
          log(
            `feishu[${account.accountId}]: skipped quoted message from sender ${quotedMessageInfo.senderId ?? "unknown"} (mode=${contextVisibilityMode})`,
          );
      } catch (err) {
        log(`feishu[${account.accountId}]: failed to fetch quoted message: ${String(err)}`);
      }
    if (!mediaFailureContent.trim() && mediaList.length === 0 && !quotedContent?.trim()) {
      log(
        `feishu[${account.accountId}]: skipping empty message (no text, no media, no quoted) from ${ctx.senderOpenId}`,
      );
      return;
    }
    const audioTranscript = await resolveFeishuAudioPreflightTranscript({
      cfg: effectiveCfg,
      mediaList,
      content: ctx.content,
      chatType: isGroup ? "group" : "direct",
      log,
    });
    const preflightAudioIndex =
      audioTranscript === void 0
        ? -1
        : mediaList.findIndex((media) => media.contentType?.startsWith("audio/"));
    const inboundMedia = toInboundMediaFacts(mediaList, {
      transcribed: (_media, index) => index === preflightAudioIndex,
    });
    const agentFacingContent = audioTranscript ?? mediaFailureContent;
    const commandFacingContent = audioTranscript ?? ctx.content;
    const agentFacingCtx =
      agentFacingContent === ctx.content
        ? ctx
        : {
            ...ctx,
            content: agentFacingContent,
          };
    const effectiveCommandProbeBody =
      audioTranscript === void 0
        ? commandProbeBody
        : isGroup
          ? normalizeFeishuCommandProbeBody(audioTranscript)
          : audioTranscript;
    const commandAuthorized = (
      audioTranscript === void 0
        ? effectiveShouldComputeCommandAuthorized
        : core.channel.commands.shouldComputeCommandAuthorized(
            effectiveCommandProbeBody,
            effectiveCfg,
          )
    )
      ? isDirect && audioTranscript === void 0 && effectiveDmIngress
        ? effectiveDmIngress.commandAccess.authorized
        : isGroup
          ? (
              await resolveFeishuGroupSenderActivationIngressAccess({
                cfg: effectiveCfg,
                accountId: account.accountId,
                chatId: ctx.chatId,
                allowFrom: commandAllowFrom,
                senderOpenId: ctx.senderOpenId,
                senderUserId,
                requireMention: false,
                mentionedBot: true,
                command: { hasControlCommand: true },
              })
            ).commandAccess.authorized
          : (
              await resolveFeishuDmIngressAccess({
                cfg: effectiveCfg,
                accountId: account.accountId,
                dmPolicy: effectiveDmPolicy,
                allowFrom: effectiveConfigAllowFrom,
                readAllowFromStore: pairing.readAllowFromStore,
                senderOpenId: ctx.senderOpenId,
                senderUserId,
                conversationId: ctx.senderOpenId,
                mayPair: false,
                command: { hasControlCommand: true },
              })
            ).commandAccess.authorized
      : void 0;
    const isTopicSessionForThread =
      isGroup &&
      (groupSession?.groupSessionScope === "group_topic" ||
        groupSession?.groupSessionScope === "group_topic_sender");
    const envelopeOptions = core.channel.reply.resolveEnvelopeFormatOptions(cfg);
    const messageBody = buildFeishuAgentBody({
      ctx: agentFacingCtx,
      quotedContent,
      permissionErrorForAgent,
      botOpenId,
    });
    const envelopeFrom = isGroup ? `${ctx.chatId}:${ctx.senderOpenId}` : ctx.senderOpenId;
    if (permissionErrorForAgent)
      log(`feishu[${account.accountId}]: appending permission error notice to message body`);
    let combinedBody = core.channel.reply.formatAgentEnvelope({
      channel: "Feishu",
      from: envelopeFrom,
      timestamp: /* @__PURE__ */ new Date(),
      envelope: envelopeOptions,
      body: messageBody,
    });
    const historyKey = groupHistoryKey;
    if (isGroup && historyKey && chatHistories)
      combinedBody = createChannelHistoryWindow({ historyMap: chatHistories }).buildPendingContext({
        historyKey,
        limit: historyLimit,
        currentMessage: combinedBody,
        formatEntry: (entry) =>
          core.channel.reply.formatAgentEnvelope({
            channel: "Feishu",
            from: `${ctx.chatId}:${entry.sender}`,
            timestamp: entry.timestamp,
            body: entry.body,
            envelope: envelopeOptions,
          }),
      });
    const inboundHistory =
      isGroup && historyKey && historyLimit > 0 && chatHistories
        ? createChannelHistoryWindow({ historyMap: chatHistories }).buildInboundHistory({
            historyKey,
            limit: historyLimit,
          })
        : void 0;
    const threadContextBySessionKey = /* @__PURE__ */ new Map();
    let rootMessageInfo;
    let rootMessageThreadId;
    let rootMessageFetched = false;
    const getRootMessageInfo = async () => {
      if (!ctx.rootId) return null;
      if (!rootMessageFetched) {
        rootMessageFetched = true;
        if (ctx.rootId === ctx.parentId && quotedMessageInfo) rootMessageInfo = quotedMessageInfo;
        else
          try {
            rootMessageInfo = await getMessageFeishu({
              cfg,
              messageId: ctx.rootId,
              accountId: account.accountId,
            });
          } catch (err) {
            log(`feishu[${account.accountId}]: failed to fetch root message: ${String(err)}`);
            rootMessageInfo = null;
          }
        rootMessageThreadId = rootMessageInfo?.threadId;
        if (
          rootMessageInfo &&
          !(await shouldIncludeFetchedGroupContextMessage({
            cfg,
            accountId: account.accountId,
            chatId: ctx.chatId,
            isGroup,
            allowFrom: effectiveGroupSenderAllowFrom,
            mode: contextVisibilityMode,
            kind: "thread",
            senderId: rootMessageInfo.senderId,
            senderType: rootMessageInfo.senderType,
          }))
        ) {
          log(
            `feishu[${account.accountId}]: skipped thread starter from sender ${rootMessageInfo.senderId ?? "unknown"} (mode=${contextVisibilityMode})`,
          );
          rootMessageInfo = null;
        }
      }
      return rootMessageInfo ?? null;
    };
    let groupNamePromise;
    const resolveGroupNameForLabel = () => {
      if (!isGroup) return Promise.resolve(void 0);
      groupNamePromise ??= resolveGroupName({
        account,
        chatId: ctx.chatId,
        log,
      });
      return groupNamePromise;
    };
    const resolveThreadContextForAgent = async (agentId, agentSessionKey, groupName) => {
      const cached = threadContextBySessionKey.get(agentSessionKey);
      if (cached) return cached;
      const threadContext = {
        threadLabel:
          (ctx.rootId || ctx.threadId) && isTopicSessionForThread
            ? `Feishu thread in ${groupName ?? ctx.chatId}`
            : void 0,
      };
      if (!(ctx.rootId || ctx.threadId) || !isTopicSessionForThread) {
        threadContextBySessionKey.set(agentSessionKey, threadContext);
        return threadContext;
      }
      const storePath = core.channel.session.resolveStorePath(cfg.session?.store, { agentId });
      if (
        core.channel.session.readSessionUpdatedAt({
          storePath,
          sessionKey: agentSessionKey,
        })
      ) {
        log(
          `feishu[${account.accountId}]: skipping thread bootstrap for existing session ${agentSessionKey}`,
        );
        threadContextBySessionKey.set(agentSessionKey, threadContext);
        return threadContext;
      }
      const rootMsg = await getRootMessageInfo();
      const feishuThreadId = ctx.threadId ?? rootMessageThreadId ?? rootMsg?.threadId;
      if (feishuThreadId)
        log(`feishu[${account.accountId}]: resolved thread ID: ${feishuThreadId}`);
      if (!feishuThreadId) {
        log(
          `feishu[${account.accountId}]: no threadId found for root message ${ctx.rootId ?? "none"}, skipping thread history`,
        );
        threadContextBySessionKey.set(agentSessionKey, threadContext);
        return threadContext;
      }
      try {
        const threadMessages = await listFeishuThreadMessages({
          cfg,
          threadId: feishuThreadId,
          currentMessageId: ctx.messageId,
          rootMessageId: ctx.rootId,
          limit: 20,
          accountId: account.accountId,
        });
        const senderScoped = groupSession?.groupSessionScope === "group_topic_sender";
        const senderIds = new Set(
          [ctx.senderOpenId, senderUserId]
            .map((id) => id?.trim())
            .filter((id) => id !== void 0 && id.length > 0),
        );
        const allowlistedMessages = await filterFetchedGroupContextMessages(threadMessages, {
          cfg,
          accountId: account.accountId,
          chatId: ctx.chatId,
          isGroup,
          allowFrom: effectiveGroupSenderAllowFrom,
          mode: contextVisibilityMode,
          kind: "history",
        });
        const relevantMessages =
          (senderScoped
            ? allowlistedMessages.filter(
                (msg) =>
                  msg.senderType === "app" ||
                  (msg.senderId !== void 0 && senderIds.has(msg.senderId.trim())),
              )
            : allowlistedMessages) ?? [];
        const threadStarterBody = rootMsg?.content ?? relevantMessages[0]?.content;
        const historyMessages = Boolean(rootMsg?.content || ctx.rootId)
          ? relevantMessages
          : relevantMessages.slice(1);
        const historyParts = historyMessages.map((msg) => {
          const role = msg.senderType === "app" ? "assistant" : "user";
          return core.channel.reply.formatAgentEnvelope({
            channel: "Feishu",
            from: `${msg.senderId ?? "Unknown"} (${role})`,
            timestamp: msg.createTime,
            body: msg.content,
            envelope: envelopeOptions,
          });
        });
        threadContext.threadStarterBody = threadStarterBody;
        threadContext.threadHistoryBody =
          historyParts.length > 0 ? historyParts.join("\n\n") : void 0;
        log(
          `feishu[${account.accountId}]: populated thread bootstrap with starter=${threadStarterBody ? "yes" : "no"} history=${historyMessages.length}`,
        );
      } catch (err) {
        log(`feishu[${account.accountId}]: failed to fetch thread history: ${String(err)}`);
      }
      threadContextBySessionKey.set(agentSessionKey, threadContext);
      return threadContext;
    };
    const buildCtxPayloadForAgent = async (
      agentId,
      agentSessionKey,
      agentAccountId,
      wasMentioned,
    ) => {
      const groupName = await resolveGroupNameForLabel();
      const threadContext = await resolveThreadContextForAgent(agentId, agentSessionKey, groupName);
      return buildChannelInboundEventContext({
        channel: "feishu",
        finalize: core.channel.reply.finalizeInboundContext,
        supplemental: {
          quote: quotedContent
            ? {
                id: ctx.parentId,
                body: quotedContent,
              }
            : void 0,
          thread: {
            starterBody: threadContext.threadStarterBody,
            historyBody: threadContext.threadHistoryBody,
            label: threadContext.threadLabel,
          },
          groupSystemPrompt: isGroup ? normalizeOptionalString(groupConfig?.systemPrompt) : void 0,
        },
        media: inboundMedia,
        messageId: ctx.messageId,
        timestamp: messageCreateTimeMs,
        from: feishuFrom,
        sender: {
          id: ctx.senderOpenId,
          name: ctx.senderName ?? ctx.senderOpenId,
        },
        conversation: {
          kind: isGroup ? "group" : "direct",
          id: ctx.chatId,
          nativeChannelId: ctx.chatId,
          label: isGroup && groupName && !isTopicSessionForThread ? groupName : void 0,
          threadId: ctx.rootId && isTopicSessionForThread ? ctx.rootId : void 0,
        },
        route: {
          agentId,
          accountId: agentAccountId,
          routeSessionKey: agentSessionKey,
        },
        reply: {
          to: feishuTo,
          replyToId: ctx.parentId,
          messageThreadId: ctx.rootId && isTopicSessionForThread ? ctx.rootId : void 0,
        },
        message: {
          body: combinedBody,
          bodyForAgent: messageBody,
          inboundHistory,
          rawBody: commandFacingContent,
          commandBody: commandFacingContent,
        },
        access: {
          mentions: {
            canDetectMention: isGroup,
            wasMentioned,
            requireMention,
          },
          commands: { authorized: commandAuthorized },
        },
        extra: {
          RootMessageId: ctx.rootId,
          Transcript: audioTranscript,
          GroupSubject: isGroup ? groupName || ctx.chatId : void 0,
        },
      });
    };
    const isTopicSession =
      isGroup &&
      (groupSession?.groupSessionScope === "group_topic" ||
        groupSession?.groupSessionScope === "group_topic_sender");
    const configReplyInThread =
      isGroup &&
      (groupConfig?.replyInThread ?? feishuCfg?.replyInThread ?? "disabled") === "enabled";
    const topicReplyTargetMessageId = ctx.rootId ?? defaultReplyTargetMessageId;
    const replyTargetMessageId = directThreadReply
      ? directThreadReplyTargetMessageId
      : isTopicSession || configReplyInThread
        ? topicReplyTargetMessageId
        : defaultReplyTargetMessageId;
    const typingTargetMessageId =
      ctx.typingTargetMessageId ?? (ctx.suppressReplyTarget ? void 0 : ctx.messageId);
    const threadReply = isGroup ? (groupSession?.threadReply ?? false) : directThreadReply;
    const lastRouteThreadId =
      isGroup && (isTopicSession || configReplyInThread || threadReply)
        ? replyTargetMessageId
        : void 0;
    const pinnedMainDmOwner = !isGroup
      ? resolvePinnedMainDmOwnerFromAllowlist({
          dmScope: effectiveCfg.session?.dmScope,
          allowFrom: effectiveConfigAllowFrom,
          normalizeEntry: normalizeFeishuAllowEntry,
        })
      : null;
    const pinnedMainDmSenderRecipient = pinnedMainDmOwner
      ? [ctx.senderOpenId, senderUserId]
          .map((id) => (id ? normalizeFeishuAllowEntry(id) : ""))
          .find((recipient) => recipient === pinnedMainDmOwner)
      : void 0;
    const buildFeishuInboundLastRouteUpdate = (paramsLocal) => {
      const inboundLastRouteSessionKey =
        paramsLocal.sessionKey === route.sessionKey
          ? resolveInboundLastRouteSessionKey({
              route,
              sessionKey: paramsLocal.sessionKey,
            })
          : paramsLocal.sessionKey;
      return {
        sessionKey: inboundLastRouteSessionKey,
        channel: "feishu",
        to: feishuTo,
        accountId: paramsLocal.accountId,
        ...(lastRouteThreadId ? { threadId: lastRouteThreadId } : {}),
        mainDmOwnerPin:
          !isGroup && inboundLastRouteSessionKey === route.mainSessionKey && pinnedMainDmOwner
            ? {
                ownerRecipient: pinnedMainDmOwner,
                senderRecipient: pinnedMainDmSenderRecipient ?? feishuTo,
                onSkip: (skipParams) => {
                  log(
                    `feishu[${account.accountId}]: skip main-session last route for ${skipParams.senderRecipient} (pinned owner ${skipParams.ownerRecipient})`,
                  );
                },
              }
            : void 0,
      };
    };
    if (broadcastAgents) {
      if (
        !(await recordProcessedFeishuMessage(messageDedupeKey ?? ctx.messageId, "broadcast", log))
      ) {
        log(
          `feishu[${account.accountId}]: broadcast already claimed by another account for message ${ctx.messageId}; skipping`,
        );
        return;
      }
      const strategy = cfg.broadcast?.strategy === "sequential" ? "sequential" : "parallel";
      const activeAgentId =
        ctx.mentionedBot || !requireMention ? normalizeAgentId$1(route.agentId) : null;
      const agentIds = (cfg.agents?.list ?? []).map((a) => normalizeAgentId$1(a.id));
      const hasKnownAgents = agentIds.length > 0;
      log(
        `feishu[${account.accountId}]: broadcasting to ${broadcastAgents.length} agents (strategy=${strategy}, active=${activeAgentId ?? "none"})`,
      );
      const dispatchForAgent = async (agentId) => {
        if (hasKnownAgents && !agentIds.includes(normalizeAgentId$1(agentId))) {
          log(
            `feishu[${account.accountId}]: broadcast agent ${agentId} not found in agents.list; skipping`,
          );
          return;
        }
        const agentSessionKey = buildBroadcastSessionKey(route.sessionKey, route.agentId, agentId);
        const agentStorePath = core.channel.session.resolveStorePath(cfg.session?.store, {
          agentId,
        });
        const agentRecord = {
          updateLastRoute: buildFeishuInboundLastRouteUpdate({
            sessionKey: agentSessionKey,
            accountId: route.accountId,
          }),
          onRecordError: (err) => {
            log(
              `feishu[${account.accountId}]: failed to record broadcast inbound session ${agentSessionKey}: ${String(err)}`,
            );
          },
        };
        const allowReasoningPreview = resolveFeishuReasoningPreviewEnabled({
          cfg,
          agentId,
          storePath: agentStorePath,
          sessionKey: agentSessionKey,
        });
        const agentCtx = await buildCtxPayloadForAgent(
          agentId,
          agentSessionKey,
          route.accountId,
          ctx.mentionedBot && agentId === activeAgentId,
        );
        if (agentId === activeAgentId) {
          const identity = resolveAgentOutboundIdentity(cfg, agentId);
          const { dispatcher, replyOptions, markDispatchIdle, ensureNoVisibleReplyFallback } =
            createFeishuReplyDispatcher({
              cfg,
              agentId,
              runtime,
              chatId: ctx.chatId,
              sendTarget: feishuTo,
              allowReasoningPreview,
              replyToMessageId: replyTargetMessageId,
              typingTargetMessageId,
              skipReplyToInMessages: !isGroup && !directThreadReply,
              replyInThread,
              rootId: ctx.rootId,
              threadReply,
              accountId: account.accountId,
              identity,
              mentionTargets: ctx.mentionTargets,
              messageCreateTimeMs,
              sessionKey: agentSessionKey,
            });
          log(
            `feishu[${account.accountId}]: broadcast active dispatch agent=${agentId} (session=${agentSessionKey})`,
          );
          const turnResult = await core.channel.inbound.run({
            channel: "feishu",
            accountId: route.accountId,
            raw: ctx,
            adapter: {
              ingest: () => ({
                id: ctx.messageId,
                timestamp: messageCreateTimeMs,
                rawText: ctx.content,
                textForAgent: agentCtx.BodyForAgent,
                textForCommands: agentCtx.CommandBody,
                raw: ctx,
              }),
              resolveTurn: () => ({
                channel: "feishu",
                accountId: route.accountId,
                routeSessionKey: agentSessionKey,
                storePath: agentStorePath,
                ctxPayload: agentCtx,
                recordInboundSession: core.channel.session.recordInboundSession,
                record: agentRecord,
                onPreDispatchFailure: () =>
                  core.channel.reply.settleReplyDispatcher({
                    dispatcher,
                    onSettled: () => markDispatchIdle(),
                  }),
                runDispatch: () =>
                  core.channel.reply.withReplyDispatcher({
                    dispatcher,
                    onSettled: () => markDispatchIdle(),
                    run: () =>
                      core.channel.reply.dispatchReplyFromConfig({
                        ctx: agentCtx,
                        cfg,
                        dispatcher,
                        replyOptions,
                      }),
                  }),
              }),
            },
          });
          if (
            turnResult.dispatched &&
            shouldSendNoVisibleReplyFallback({
              ...turnResult.dispatchResult,
              failedCounts: dispatcher.getFailedCounts?.() ?? {
                tool: 0,
                block: 0,
                final: 0,
              },
            })
          )
            await ensureNoVisibleReplyFallback("broadcast-dispatch-complete-no-visible-reply");
        } else {
          delete agentCtx.CommandAuthorized;
          const noopDispatcher = {
            sendToolResult: () => false,
            sendBlockReply: () => false,
            sendFinalReply: () => false,
            waitForIdle: async () => {},
            getQueuedCounts: () => ({
              tool: 0,
              block: 0,
              final: 0,
            }),
            getFailedCounts: () => ({
              tool: 0,
              block: 0,
              final: 0,
            }),
            markComplete: () => {},
          };
          log(
            `feishu[${account.accountId}]: broadcast observer dispatch agent=${agentId} (session=${agentSessionKey})`,
          );
          await core.channel.inbound.run({
            channel: "feishu",
            accountId: route.accountId,
            raw: ctx,
            adapter: {
              ingest: () => ({
                id: ctx.messageId,
                timestamp: messageCreateTimeMs,
                rawText: ctx.content,
                textForAgent: agentCtx.BodyForAgent,
                textForCommands: agentCtx.CommandBody,
                raw: ctx,
              }),
              resolveTurn: () => ({
                channel: "feishu",
                accountId: route.accountId,
                routeSessionKey: agentSessionKey,
                storePath: agentStorePath,
                ctxPayload: agentCtx,
                recordInboundSession: core.channel.session.recordInboundSession,
                record: agentRecord,
                runDispatch: () =>
                  core.channel.reply.withReplyDispatcher({
                    dispatcher: noopDispatcher,
                    run: () =>
                      core.channel.reply.dispatchReplyFromConfig({
                        ctx: agentCtx,
                        cfg,
                        dispatcher: noopDispatcher,
                      }),
                  }),
              }),
            },
          });
        }
      };
      if (strategy === "sequential")
        for (const agentId of broadcastAgents)
          try {
            await dispatchForAgent(agentId);
          } catch (err) {
            log(
              `feishu[${account.accountId}]: broadcast dispatch failed for agent=${agentId}: ${String(err)}`,
            );
          }
      else {
        const results = await Promise.allSettled(broadcastAgents.map(dispatchForAgent));
        for (const [i, result] of results.entries())
          if (result.status === "rejected") {
            const agentId = broadcastAgents.at(i);
            if (agentId === void 0) continue;
            log(
              `feishu[${account.accountId}]: broadcast dispatch failed for agent=${agentId}: ${String(result.reason)}`,
            );
          }
      }
      if (isGroup && historyKey && chatHistories)
        createChannelHistoryWindow({ historyMap: chatHistories }).clear({
          historyKey,
          limit: historyLimit,
        });
      log(
        `feishu[${account.accountId}]: broadcast dispatch complete for ${broadcastAgents.length} agents`,
      );
    } else {
      const ctxPayload = await buildCtxPayloadForAgent(
        route.agentId,
        route.sessionKey,
        route.accountId,
        ctx.mentionedBot,
      );
      const identity = resolveAgentOutboundIdentity(effectiveCfg, route.agentId);
      const storePath = core.channel.session.resolveStorePath(effectiveCfg.session?.store, {
        agentId: route.agentId,
      });
      const allowReasoningPreview = resolveFeishuReasoningPreviewEnabled({
        cfg: effectiveCfg,
        agentId: route.agentId,
        storePath,
        sessionKey: route.sessionKey,
      });
      const { dispatcher, replyOptions, markDispatchIdle, ensureNoVisibleReplyFallback } =
        createFeishuReplyDispatcher({
          cfg: effectiveCfg,
          agentId: route.agentId,
          runtime,
          chatId: ctx.chatId,
          sendTarget: feishuTo,
          allowReasoningPreview,
          replyToMessageId: replyTargetMessageId,
          typingTargetMessageId,
          skipReplyToInMessages: !isGroup && !directThreadReply,
          replyInThread,
          rootId: ctx.rootId,
          threadReply,
          accountId: account.accountId,
          identity,
          mentionTargets: ctx.mentionTargets,
          messageCreateTimeMs,
          sessionKey: route.sessionKey,
        });
      log(`feishu[${account.accountId}]: dispatching to agent (session=${route.sessionKey})`);
      const turnResult = await core.channel.inbound.run({
        channel: "feishu",
        accountId: route.accountId,
        raw: ctx,
        adapter: {
          ingest: () => ({
            id: ctx.messageId,
            timestamp: messageCreateTimeMs,
            rawText: ctx.content,
            textForAgent: ctxPayload.BodyForAgent,
            textForCommands: ctxPayload.CommandBody,
            raw: ctx,
          }),
          resolveTurn: () => ({
            channel: "feishu",
            accountId: route.accountId,
            routeSessionKey: route.sessionKey,
            storePath,
            ctxPayload,
            recordInboundSession: core.channel.session.recordInboundSession,
            record: {
              updateLastRoute: buildFeishuInboundLastRouteUpdate({
                sessionKey: route.sessionKey,
                accountId: route.accountId,
              }),
              onRecordError: (err) => {
                log(
                  `feishu[${account.accountId}]: failed to record inbound session ${route.sessionKey}: ${String(err)}`,
                );
              },
            },
            history: {
              isGroup,
              historyKey,
              historyMap: chatHistories,
              limit: historyLimit,
            },
            onPreDispatchFailure: () =>
              core.channel.reply.settleReplyDispatcher({
                dispatcher,
                onSettled: () => markDispatchIdle(),
              }),
            runDispatch: () =>
              core.channel.reply.withReplyDispatcher({
                dispatcher,
                onSettled: () => {
                  markDispatchIdle();
                },
                run: () =>
                  core.channel.reply.dispatchReplyFromConfig({
                    ctx: ctxPayload,
                    cfg: effectiveCfg,
                    dispatcher,
                    replyOptions,
                  }),
              }),
          }),
        },
      });
      if (!turnResult.dispatched) return;
      const { dispatchResult } = turnResult;
      const { queuedFinal, counts } = dispatchResult;
      if (
        shouldSendNoVisibleReplyFallback({
          ...dispatchResult,
          failedCounts: dispatcher.getFailedCounts?.() ?? {
            tool: 0,
            block: 0,
            final: 0,
          },
        })
      )
        await ensureNoVisibleReplyFallback("dispatch-complete-no-visible-reply");
      log(
        `feishu[${account.accountId}]: dispatch complete (queuedFinal=${queuedFinal}, replies=${counts.final})`,
      );
    }
  } catch (err) {
    error(`feishu[${account.accountId}]: failed to dispatch message: ${String(err)}`);
  }
}
//#endregion
//#region extensions/feishu/src/card-action-state.ts
const processedCardActions = /* @__PURE__ */ new Map();
const resolvedCardActionChatTypes = /* @__PURE__ */ new Map();
//#endregion
//#region extensions/feishu/src/card-ux-shared.ts
function buildFeishuCardButton(params) {
  return {
    tag: "button",
    text: {
      tag: "plain_text",
      content: params.label,
    },
    type: params.type ?? "default",
    value: params.value,
  };
}
function buildFeishuCardInteractionContext(params) {
  return {
    u: params.operatorOpenId,
    ...(params.chatId ? { h: params.chatId } : {}),
    ...(params.sessionKey ? { s: params.sessionKey } : {}),
    e: params.expiresAt,
    ...(params.chatType ? { t: params.chatType } : {}),
  };
}
//#endregion
//#region extensions/feishu/src/card-ux-approval.ts
const FEISHU_APPROVAL_REQUEST_ACTION = "feishu.quick_actions.request_approval";
const FEISHU_APPROVAL_CONFIRM_ACTION = "feishu.approval.confirm";
const FEISHU_APPROVAL_CANCEL_ACTION = "feishu.approval.cancel";
function createApprovalCard(params) {
  const context = buildFeishuCardInteractionContext(params);
  return {
    schema: "2.0",
    config: { width_mode: "fill" },
    header: {
      title: {
        tag: "plain_text",
        content: "Confirm action",
      },
      template: "orange",
    },
    body: {
      elements: [
        {
          tag: "markdown",
          content: params.prompt,
        },
        {
          tag: "action",
          actions: [
            buildFeishuCardButton({
              label: params.confirmLabel ?? "Confirm",
              type: "primary",
              value: createFeishuCardInteractionEnvelope({
                k: "quick",
                a: FEISHU_APPROVAL_CONFIRM_ACTION,
                q: params.command,
                c: context,
              }),
            }),
            buildFeishuCardButton({
              label: params.cancelLabel ?? "Cancel",
              value: createFeishuCardInteractionEnvelope({
                k: "button",
                a: FEISHU_APPROVAL_CANCEL_ACTION,
                c: context,
              }),
            }),
          ],
        },
      ],
    },
  };
}
//#endregion
//#region extensions/feishu/src/card-action.ts
const FEISHU_APPROVAL_CARD_TTL_MS = 5 * 6e4;
const FEISHU_CARD_ACTION_TOKEN_TTL_MS = 15 * 6e4;
function pruneProcessedCardActionTokens(now) {
  const validNow = asDateTimestampMs(now);
  if (validNow === void 0) {
    processedCardActions.clear();
    return;
  }
  for (const [key, entry] of processedCardActions.entries())
    if (!isFutureDateTimestampMs(entry.expiresAt, { nowMs: validNow }))
      processedCardActions.delete(key);
}
function resolveProcessedCardActionTokenExpiresAt(now) {
  return resolveExpiresAtMsFromDurationMs(FEISHU_CARD_ACTION_TOKEN_TTL_MS, { nowMs: now });
}
function beginFeishuCardActionToken(params) {
  const now = params.now ?? Date.now();
  pruneProcessedCardActionTokens(now);
  const normalizedToken = params.token.trim();
  if (!normalizedToken) return false;
  const key = `${params.accountId}:${normalizedToken}`;
  const existing = processedCardActions.get(key);
  if (existing && isFutureDateTimestampMs(existing.expiresAt, { nowMs: now })) return false;
  processedCardActions.delete(key);
  const expiresAt = resolveProcessedCardActionTokenExpiresAt(now);
  if (expiresAt !== void 0)
    processedCardActions.set(key, {
      status: "inflight",
      expiresAt,
    });
  return true;
}
function completeFeishuCardAction(actionId, accountId, now = Date.now()) {
  const normalizedActionId = actionId.trim();
  if (!normalizedActionId) return;
  const key = `${accountId}:${normalizedActionId}`;
  const expiresAt = resolveProcessedCardActionTokenExpiresAt(now);
  if (expiresAt === void 0) {
    processedCardActions.delete(key);
    return;
  }
  processedCardActions.set(key, {
    status: "completed",
    expiresAt,
  });
}
function buildSyntheticMessageEvent(event, content, chatType) {
  const replyTargetMessageId = event.context.open_message_id ?? event.open_message_id;
  const isTemporaryCardActionId = replyTargetMessageId?.startsWith("card-action-c-");
  const validReplyTargetId =
    replyTargetMessageId && !isTemporaryCardActionId ? replyTargetMessageId : void 0;
  return {
    sender: {
      sender_id: {
        open_id: event.operator.open_id,
        user_id: event.operator.user_id,
        union_id: event.operator.union_id,
      },
    },
    message: {
      message_id: `card-action-${event.token}`,
      ...(validReplyTargetId ? { reply_target_message_id: validReplyTargetId } : {}),
      ...(validReplyTargetId ? { typing_target_message_id: validReplyTargetId } : {}),
      ...(!validReplyTargetId ? { suppress_reply_target: true } : {}),
      chat_id: event.context.chat_id || event.operator.open_id,
      chat_type: chatType,
      message_type: "text",
      content: JSON.stringify({ text: content }),
    },
  };
}
function resolveCallbackTarget(event) {
  const chatId = event.context.chat_id?.trim();
  if (chatId) return `chat:${chatId}`;
  return `user:${event.operator.open_id}`;
}
async function dispatchSyntheticCommand(params) {
  const resolvedChatType = await resolveCardActionChatType({
    event: params.event,
    account: params.account,
    chatType: params.chatType,
    log: params.runtime?.log ?? console.log,
  });
  await handleFeishuMessage({
    cfg: params.cfg,
    event: buildSyntheticMessageEvent(params.event, params.command, resolvedChatType),
    botOpenId: params.botOpenId,
    runtime: params.runtime,
    channelRuntime: params.channelRuntime,
    accountId: params.accountId,
  });
}
const resolvedChatTypeCache = resolvedCardActionChatTypes;
const CHAT_TYPE_CACHE_TTL_MS = 30 * 6e4;
const CHAT_TYPE_CACHE_MAX_SIZE = 5e3;
function pruneChatTypeCache(now) {
  const validNow = asDateTimestampMs(now);
  if (validNow === void 0) {
    resolvedChatTypeCache.clear();
    return;
  }
  for (const [key, entry] of resolvedChatTypeCache.entries()) {
    const expiresAt = asDateTimestampMs(entry.expiresAt);
    if (expiresAt === void 0 || expiresAt <= validNow) resolvedChatTypeCache.delete(key);
  }
  if (resolvedChatTypeCache.size > CHAT_TYPE_CACHE_MAX_SIZE) {
    const excess = resolvedChatTypeCache.size - CHAT_TYPE_CACHE_MAX_SIZE;
    const iter = resolvedChatTypeCache.keys();
    for (let i = 0; i < excess; i++) {
      const key = iter.next().value;
      if (key !== void 0) resolvedChatTypeCache.delete(key);
    }
  }
}
function sanitizeLogValue(v) {
  return truncateUtf16Safe(v.replace(/[\r\n]/g, " "), 500);
}
function resolveFeishuApprovalCardExpiresAt(nowRaw = Date.now()) {
  const now = asDateTimestampMs(nowRaw);
  return now === void 0
    ? void 0
    : resolveExpiresAtMsFromDurationMs(FEISHU_APPROVAL_CARD_TTL_MS, { nowMs: now });
}
function cacheResolvedCardActionChatType(cacheKey, value, now) {
  const expiresAt = resolveExpiresAtMsFromDurationMs(CHAT_TYPE_CACHE_TTL_MS, { nowMs: now });
  resolvedChatTypeCache.delete(cacheKey);
  if (expiresAt !== void 0)
    resolvedChatTypeCache.set(cacheKey, {
      value,
      expiresAt,
    });
}
async function resolveCardActionChatType(params) {
  const explicitChatType = normalizeFeishuChatType$2(params.chatType);
  if (explicitChatType) return explicitChatType;
  const chatId = params.event.context.chat_id?.trim();
  if (!chatId) return "p2p";
  const cacheKey = `${params.account.accountId}:${chatId}`;
  const now = Date.now();
  pruneChatTypeCache(now);
  const cached = resolvedChatTypeCache.get(cacheKey);
  const cachedExpiresAt = cached ? asDateTimestampMs(cached.expiresAt) : void 0;
  if (cached && cachedExpiresAt !== void 0) return cached.value;
  if (cached) resolvedChatTypeCache.delete(cacheKey);
  try {
    const response = await createFeishuClient(params.account).im.chat.get({
      path: { chat_id: chatId },
    });
    if (response.code === 0) {
      const resolvedChatType = resolveFeishuChatType(response.data ?? {});
      if (resolvedChatType) {
        cacheResolvedCardActionChatType(cacheKey, resolvedChatType, now);
        return resolvedChatType;
      }
      params.log(
        `feishu[${params.account.accountId}]: card action missing chat type for chat; defaulting to p2p`,
      );
    } else
      params.log(
        `feishu[${params.account.accountId}]: failed to resolve chat type: ${sanitizeLogValue(response.msg ?? "unknown error")}; defaulting to p2p`,
      );
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    params.log(
      `feishu[${params.account.accountId}]: failed to resolve chat type: ${sanitizeLogValue(message)}; defaulting to p2p`,
    );
  }
  return "p2p";
}
async function sendInvalidInteractionNotice(params) {
  const reasonText =
    params.reason === "stale"
      ? "This card action has expired. Open a fresh launcher card and try again."
      : params.reason === "wrong_user"
        ? "This card action belongs to a different user."
        : params.reason === "wrong_conversation"
          ? "This card action belongs to a different conversation."
          : "This card action payload is invalid.";
  await sendMessageFeishu({
    cfg: params.cfg,
    to: resolveCallbackTarget(params.event),
    text: `⚠️ ${reasonText}`,
    accountId: params.accountId,
  });
}
async function handleFeishuCardAction(params) {
  const { cfg, event, runtime, accountId } = params;
  const account = resolveFeishuRuntimeAccount({
    cfg,
    accountId,
  });
  const log = runtime?.log ?? console.log;
  if (!event.token.trim()) {
    log(
      `feishu[${account.accountId}]: rejected card action from ${event.operator.open_id}: missing token`,
    );
    return;
  }
  const decoded = decodeFeishuCardAction({ event });
  if (
    !beginFeishuCardActionToken({
      token: event.token,
      accountId: account.accountId,
    })
  ) {
    log(`feishu[${account.accountId}]: skipping duplicate card action token`);
    return;
  }
  try {
    if (decoded.kind === "invalid") {
      log(
        `feishu[${account.accountId}]: rejected card action from ${event.operator.open_id}: ${decoded.reason}`,
      );
      await sendInvalidInteractionNotice({
        cfg,
        event,
        reason: decoded.reason,
        accountId,
      });
      completeFeishuCardAction(event.token, account.accountId);
      return;
    }
    if (decoded.kind === "structured") {
      const { envelope } = decoded;
      log(
        `feishu[${account.accountId}]: handling structured card action ${envelope.a} from ${event.operator.open_id}`,
      );
      if (envelope.a === "feishu.quick_actions.request_approval") {
        const command = typeof envelope.m?.command === "string" ? envelope.m.command.trim() : "";
        if (!command) {
          await sendInvalidInteractionNotice({
            cfg,
            event,
            reason: "malformed",
            accountId,
          });
          completeFeishuCardAction(event.token, account.accountId);
          return;
        }
        const prompt =
          typeof envelope.m?.prompt === "string" && envelope.m.prompt.trim()
            ? envelope.m.prompt
            : `Run \`${command}\` in this Feishu conversation?`;
        const expiresAt = resolveFeishuApprovalCardExpiresAt();
        if (expiresAt === void 0) {
          await sendInvalidInteractionNotice({
            cfg,
            event,
            reason: "malformed",
            accountId,
          });
          completeFeishuCardAction(event.token, account.accountId);
          return;
        }
        await sendCardFeishu({
          cfg,
          to: resolveCallbackTarget(event),
          card: createApprovalCard({
            operatorOpenId: event.operator.open_id,
            chatId: event.context.chat_id || void 0,
            command,
            prompt,
            sessionKey: envelope.c?.s,
            expiresAt,
            chatType: await resolveCardActionChatType({
              event,
              account,
              chatType: envelope.c?.t,
              log,
            }),
            confirmLabel: command === "/reset" ? "Reset" : "Confirm",
          }),
          accountId,
        });
        completeFeishuCardAction(event.token, account.accountId);
        return;
      }
      if (envelope.a === "feishu.approval.cancel") {
        await sendMessageFeishu({
          cfg,
          to: resolveCallbackTarget(event),
          text: "Cancelled.",
          accountId,
        });
        completeFeishuCardAction(event.token, account.accountId);
        return;
      }
      if (envelope.a === "feishu.approval.confirm" || envelope.k === "quick") {
        const command = envelope.q?.trim();
        if (!command) {
          await sendInvalidInteractionNotice({
            cfg,
            event,
            reason: "malformed",
            accountId,
          });
          completeFeishuCardAction(event.token, account.accountId);
          return;
        }
        await dispatchSyntheticCommand({
          cfg,
          event,
          command,
          account,
          botOpenId: params.botOpenId,
          runtime,
          channelRuntime: params.channelRuntime,
          accountId,
          chatType: envelope.c?.t,
        });
        completeFeishuCardAction(event.token, account.accountId);
        return;
      }
      await sendInvalidInteractionNotice({
        cfg,
        event,
        reason: "malformed",
        accountId,
      });
      completeFeishuCardAction(event.token, account.accountId);
      return;
    }
    const content = buildFeishuCardActionTextFallback(event);
    log(
      `feishu[${account.accountId}]: handling card action from ${event.operator.open_id}: ${content}`,
    );
    await dispatchSyntheticCommand({
      cfg,
      event,
      command: content,
      account,
      botOpenId: params.botOpenId,
      runtime,
      channelRuntime: params.channelRuntime,
      accountId,
    });
    completeFeishuCardAction(event.token, account.accountId);
  } catch (err) {
    completeFeishuCardAction(event.token, account.accountId);
    throw err;
  }
}
//#endregion
//#region extensions/feishu/src/monitor-defaults.ts
const FEISHU_WEBHOOK_RATE_LIMIT_FALLBACK_DEFAULTS = {
  windowMs: 6e4,
  maxRequests: 120,
  maxTrackedKeys: 4096,
};
const FEISHU_WEBHOOK_ANOMALY_FALLBACK_DEFAULTS = {
  maxTrackedKeys: 4096,
  ttlMs: 360 * 6e4,
  logEvery: 25,
};
function coercePositiveInt(value, fallback) {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  const normalized = Math.floor(value);
  return normalized > 0 ? normalized : fallback;
}
function resolveFeishuWebhookRateLimitDefaults(defaults) {
  const resolved = defaults;
  return {
    windowMs: coercePositiveInt(
      resolved?.windowMs,
      FEISHU_WEBHOOK_RATE_LIMIT_FALLBACK_DEFAULTS.windowMs,
    ),
    maxRequests: coercePositiveInt(
      resolved?.maxRequests,
      FEISHU_WEBHOOK_RATE_LIMIT_FALLBACK_DEFAULTS.maxRequests,
    ),
    maxTrackedKeys: coercePositiveInt(
      resolved?.maxTrackedKeys,
      FEISHU_WEBHOOK_RATE_LIMIT_FALLBACK_DEFAULTS.maxTrackedKeys,
    ),
  };
}
function resolveFeishuWebhookAnomalyDefaults(defaults) {
  const resolved = defaults;
  return {
    maxTrackedKeys: coercePositiveInt(
      resolved?.maxTrackedKeys,
      FEISHU_WEBHOOK_ANOMALY_FALLBACK_DEFAULTS.maxTrackedKeys,
    ),
    ttlMs: coercePositiveInt(resolved?.ttlMs, FEISHU_WEBHOOK_ANOMALY_FALLBACK_DEFAULTS.ttlMs),
    logEvery: coercePositiveInt(
      resolved?.logEvery,
      FEISHU_WEBHOOK_ANOMALY_FALLBACK_DEFAULTS.logEvery,
    ),
  };
}
//#endregion
//#region extensions/feishu/src/monitor.state.ts
const wsClients = /* @__PURE__ */ new Map();
const httpServers = /* @__PURE__ */ new Map();
const botOpenIds = /* @__PURE__ */ new Map();
const botNames = /* @__PURE__ */ new Map();
const botIdentityRevisions = /* @__PURE__ */ new Map();
const FEISHU_WEBHOOK_MAX_BODY_BYTES = 64 * 1024;
const FEISHU_WEBHOOK_BODY_TIMEOUT_MS = 5e3;
const FEISHU_HTTP_SERVER_CLOSE_TIMEOUT_MS = 5e3;
const feishuWebhookRateLimitDefaults = resolveFeishuWebhookRateLimitDefaults(
  WEBHOOK_RATE_LIMIT_DEFAULTS,
);
const feishuWebhookAnomalyDefaults = resolveFeishuWebhookAnomalyDefaults(
  WEBHOOK_ANOMALY_COUNTER_DEFAULTS,
);
const feishuWebhookRateLimiter = createFixedWindowRateLimiter({
  windowMs: feishuWebhookRateLimitDefaults.windowMs,
  maxRequests: feishuWebhookRateLimitDefaults.maxRequests,
  maxTrackedKeys: feishuWebhookRateLimitDefaults.maxTrackedKeys,
});
const feishuWebhookAnomalyTracker = createWebhookAnomalyTracker({
  maxTrackedKeys: feishuWebhookAnomalyDefaults.maxTrackedKeys,
  ttlMs: feishuWebhookAnomalyDefaults.ttlMs,
  logEvery: feishuWebhookAnomalyDefaults.logEvery,
});
function readBotIdentityRevision(accountId) {
  return botIdentityRevisions.get(accountId) ?? 0;
}
function bumpBotIdentityRevision(accountId) {
  botIdentityRevisions.set(accountId, readBotIdentityRevision(accountId) + 1);
}
function captureBotIdentitySnapshot(accountId) {
  return { revision: readBotIdentityRevision(accountId) };
}
function clearFeishuBotIdentityStateIfUnchanged(accountId, snapshot) {
  if (readBotIdentityRevision(accountId) !== snapshot.revision) return;
  botOpenIds.delete(accountId);
  botNames.delete(accountId);
  bumpBotIdentityRevision(accountId);
}
function setFeishuBotIdentityState(accountId, identity) {
  botOpenIds.set(accountId, identity.botOpenId);
  if (identity.botName) botNames.set(accountId, identity.botName);
  else botNames.delete(accountId);
  bumpBotIdentityRevision(accountId);
}
function clearFeishuBotIdentityState(accountId) {
  botOpenIds.delete(accountId);
  botNames.delete(accountId);
  bumpBotIdentityRevision(accountId);
}
function isServerNotRunningError(error) {
  return error.code === "ERR_SERVER_NOT_RUNNING";
}
async function closeFeishuHttpServer(server) {
  await new Promise((resolve, reject) => {
    let settled = false;
    const settle = (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(fallbackTimer);
      if (!err || isServerNotRunningError(err)) {
        resolve();
        return;
      }
      reject(err);
    };
    const fallbackTimer = setTimeout(() => {
      try {
        server.closeAllConnections();
        settle();
      } catch (err) {
        settle(err instanceof Error ? err : new Error(String(err)));
      }
    }, FEISHU_HTTP_SERVER_CLOSE_TIMEOUT_MS);
    try {
      server.close((err) => {
        settle(err);
      });
    } catch (err) {
      settle(err instanceof Error ? err : new Error(String(err)));
    }
  });
}
async function closeTrackedFeishuHttpServer(accountId, server) {
  const identitySnapshot = captureBotIdentitySnapshot(accountId);
  try {
    await closeFeishuHttpServer(server);
  } finally {
    if (httpServers.get(accountId) === server) {
      httpServers.delete(accountId);
      clearFeishuBotIdentityStateIfUnchanged(accountId, identitySnapshot);
    }
  }
}
function recordWebhookStatus(runtime, accountId, path, statusCode) {
  feishuWebhookAnomalyTracker.record({
    key: `${accountId}:${path}:${statusCode}`,
    statusCode,
    log: runtime?.log ?? console.log,
    message: (count) =>
      `feishu[${accountId}]: webhook anomaly path=${path} status=${statusCode} count=${count}`,
  });
}
//#endregion
//#region extensions/feishu/src/monitor.bot-identity.ts
const BOT_IDENTITY_RETRY_DELAYS_MS = [6e4, 12e4, 3e5, 6e5, 9e5];
function applyBotIdentityState(accountId, identity) {
  const botOpenId = normalizeOptionalString(identity.botOpenId);
  const botName = normalizeOptionalString(identity.botName);
  setFeishuBotIdentityState(accountId, {
    botOpenId: botOpenId ?? "",
    botName,
  });
  return {
    botOpenId,
    botName,
  };
}
async function retryBotIdentityProbe(account, accountId, runtime, abortSignal) {
  const log = runtime?.log ?? console.log;
  const error = runtime?.error ?? console.error;
  const nextDelays = BOT_IDENTITY_RETRY_DELAYS_MS.slice(1)[Symbol.iterator]();
  for (const [i, delayMs] of BOT_IDENTITY_RETRY_DELAYS_MS.entries()) {
    if (abortSignal?.aborted) return;
    if (!(await waitForAbortableDelay(delayMs, abortSignal))) return;
    const resolved = applyBotIdentityState(
      accountId,
      await fetchBotIdentityForMonitor(account, {
        runtime,
        abortSignal,
      }),
    );
    if (resolved.botOpenId) {
      log(
        `feishu[${accountId}]: bot open_id recovered via background retry: ${resolved.botOpenId}`,
      );
      return;
    }
    const nextDelayResult = nextDelays.next();
    const nextDelay = nextDelayResult.done ? void 0 : nextDelayResult.value;
    error(
      `feishu[${accountId}]: bot identity background retry ${i + 1}/${BOT_IDENTITY_RETRY_DELAYS_MS.length} failed` +
        (nextDelay ? `; next attempt in ${nextDelay / 1e3}s` : ""),
    );
  }
  error(
    `feishu[${accountId}]: bot identity background retry exhausted; requireMention group messages may be skipped until restart`,
  );
}
function startBotIdentityRecovery(params) {
  const { account, accountId, runtime, abortSignal } = params;
  const log = runtime?.log ?? console.log;
  log(
    `feishu[${accountId}]: bot open_id unknown; starting background retry (delays: ${BOT_IDENTITY_RETRY_DELAYS_MS.map((delay) => `${delay / 1e3}s`).join(", ")})`,
  );
  log(
    `feishu[${accountId}]: requireMention group messages stay gated until bot identity recovery succeeds`,
  );
  retryBotIdentityProbe(account, accountId, runtime, abortSignal);
}
//#endregion
//#region extensions/feishu/src/card-ux-launcher.ts
const FEISHU_QUICK_ACTION_CARD_TTL_MS = 10 * 6e4;
const QUICK_ACTION_MENU_KEYS = /* @__PURE__ */ new Set([
  "quick-actions",
  "quick_actions",
  "launcher",
]);
function isFeishuQuickActionMenuEventKey(eventKey) {
  return QUICK_ACTION_MENU_KEYS.has(normalizeOptionalLowercaseString(eventKey) ?? "");
}
function createQuickActionLauncherCard(params) {
  const context = buildFeishuCardInteractionContext(params);
  return {
    schema: "2.0",
    config: { width_mode: "fill" },
    header: {
      title: {
        tag: "plain_text",
        content: "Quick actions",
      },
      template: "indigo",
    },
    body: {
      elements: [
        {
          tag: "markdown",
          content: "Run common actions without typing raw commands.",
        },
        {
          tag: "action",
          actions: [
            buildFeishuCardButton({
              label: "Help",
              value: createFeishuCardInteractionEnvelope({
                k: "quick",
                a: "feishu.quick_actions.help",
                q: "/help",
                c: context,
              }),
            }),
            buildFeishuCardButton({
              label: "New session",
              type: "primary",
              value: createFeishuCardInteractionEnvelope({
                k: "meta",
                a: FEISHU_APPROVAL_REQUEST_ACTION,
                m: {
                  command: "/new",
                  prompt: "Start a fresh session? This will reset the current chat context.",
                },
                c: context,
              }),
            }),
            buildFeishuCardButton({
              label: "Reset",
              type: "danger",
              value: createFeishuCardInteractionEnvelope({
                k: "meta",
                a: FEISHU_APPROVAL_REQUEST_ACTION,
                m: {
                  command: "/reset",
                  prompt: "Reset this session now? Any active conversation state will be cleared.",
                },
                c: context,
              }),
            }),
          ],
        },
      ],
    },
  };
}
async function maybeHandleFeishuQuickActionMenu(params) {
  if (!isFeishuQuickActionMenuEventKey(params.eventKey)) return false;
  const now = asDateTimestampMs(params.now ?? Date.now());
  const expiresAt =
    now === void 0
      ? void 0
      : resolveExpiresAtMsFromDurationMs(FEISHU_QUICK_ACTION_CARD_TTL_MS, { nowMs: now });
  if (expiresAt === void 0) {
    params.runtime?.log?.(
      `feishu[${params.accountId ?? "default"}]: failed to open quick-action launcher for ${params.operatorOpenId}: invalid expiry clock`,
    );
    return false;
  }
  try {
    await sendCardFeishu({
      cfg: params.cfg,
      to: `user:${params.operatorOpenId}`,
      card: createQuickActionLauncherCard({
        operatorOpenId: params.operatorOpenId,
        expiresAt,
        chatType: "p2p",
      }),
      accountId: params.accountId,
    });
  } catch (err) {
    params.runtime?.log?.(
      `feishu[${params.accountId ?? "default"}]: failed to open quick-action launcher for ${params.operatorOpenId}: ${String(err)}`,
    );
    return false;
  }
  params.runtime?.log?.(
    `feishu[${params.accountId ?? "default"}]: opened quick-action launcher for ${params.operatorOpenId}`,
  );
  return true;
}
//#endregion
//#region extensions/feishu/src/monitor.synthetic-error.ts
var FeishuRetryableSyntheticEventError = class extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "FeishuRetryableSyntheticEventError";
  }
};
function isFeishuRetryableSyntheticEventError(error) {
  return (
    error instanceof FeishuRetryableSyntheticEventError ||
    (typeof error === "object" &&
      error !== null &&
      "name" in error &&
      error.name === "FeishuRetryableSyntheticEventError")
  );
}
//#endregion
//#region extensions/feishu/src/monitor.bot-menu-handler.ts
function readStringOrNumber(value) {
  return typeof value === "string" || typeof value === "number" ? value : void 0;
}
function parseFeishuBotMenuEvent(value) {
  if (!isRecord(value)) return null;
  const operator = value.operator;
  if (operator !== void 0 && !isRecord(operator)) return null;
  return {
    event_key: readStringValue(value.event_key),
    timestamp: readStringOrNumber(value.timestamp),
    operator: operator
      ? {
          operator_name: readStringValue(operator.operator_name),
          operator_id: isRecord(operator.operator_id)
            ? {
                open_id: readStringValue(operator.operator_id.open_id),
                user_id: readStringValue(operator.operator_id.user_id),
                union_id: readStringValue(operator.operator_id.union_id),
              }
            : void 0,
        }
      : void 0,
  };
}
function createFeishuBotMenuHandler(params) {
  const { cfg, accountId, runtime, chatHistories, fireAndForget } = params;
  const log = runtime?.log ?? console.log;
  const error = runtime?.error ?? console.error;
  const getBotOpenId = params.getBotOpenId ?? ((id) => botOpenIds.get(id));
  const getBotName = params.getBotName ?? ((id) => botNames.get(id));
  return async (data) => {
    try {
      const event = parseFeishuBotMenuEvent(data);
      if (!event) return;
      const operatorOpenId = event.operator?.operator_id?.open_id?.trim();
      const eventKey = event.event_key?.trim();
      if (!operatorOpenId || !eventKey) return;
      const syntheticEvent = {
        sender: {
          sender_id: {
            open_id: operatorOpenId,
            user_id: event.operator?.operator_id?.user_id,
            union_id: event.operator?.operator_id?.union_id,
          },
          sender_type: "user",
        },
        message: {
          message_id: `bot-menu:${eventKey}:${event.timestamp ?? Date.now()}`,
          suppress_reply_target: true,
          chat_id: `p2p:${operatorOpenId}`,
          chat_type: "p2p",
          message_type: "text",
          content: JSON.stringify({ text: `/menu ${eventKey}` }),
        },
      };
      const syntheticMessageId = syntheticEvent.message.message_id;
      const claim = await claimUnprocessedFeishuMessage({
        messageId: syntheticMessageId,
        namespace: accountId,
        log,
      });
      if (claim === "duplicate") {
        log(`feishu[${accountId}]: dropping duplicate bot-menu event for ${syntheticMessageId}`);
        return;
      }
      if (claim === "inflight") {
        log(`feishu[${accountId}]: dropping in-flight bot-menu event for ${syntheticMessageId}`);
        return;
      }
      const handleLegacyMenu = () =>
        handleFeishuMessage({
          cfg,
          event: syntheticEvent,
          botOpenId: getBotOpenId(accountId),
          botName: getBotName(accountId),
          runtime,
          channelRuntime: params.channelRuntime,
          chatHistories,
          accountId,
          processingClaimHeld: true,
        });
      const promise = maybeHandleFeishuQuickActionMenu({
        cfg,
        eventKey,
        operatorOpenId,
        runtime,
        accountId,
      })
        .then(async (handledMenu) => {
          if (handledMenu) {
            await recordProcessedFeishuMessage(syntheticMessageId, accountId, log);
            return;
          }
          return await handleLegacyMenu();
        })
        .catch(async (err) => {
          if (isFeishuRetryableSyntheticEventError(err))
            await forgetProcessedFeishuMessage(syntheticMessageId, accountId, log);
          else await recordProcessedFeishuMessage(syntheticMessageId, accountId, log);
          throw err;
        })
        .finally(() => {
          releaseFeishuMessageProcessing(syntheticMessageId, accountId);
        });
      if (fireAndForget) {
        promise.catch((err) => {
          error(`feishu[${accountId}]: error handling bot menu event: ${String(err)}`);
        });
        return;
      }
      await promise;
    } catch (err) {
      error(`feishu[${accountId}]: error handling bot menu event: ${String(err)}`);
    }
  };
}
//#endregion
//#region extensions/feishu/src/comment-dispatcher.ts
function createFeishuCommentReplyDispatcher(params) {
  const core = getFeishuRuntime();
  const prefixContext = createReplyPrefixContext({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: "feishu",
    accountId: params.accountId,
  });
  const client = createFeishuClient(
    resolveFeishuRuntimeAccount({
      cfg: params.cfg,
      accountId: params.accountId,
    }),
  );
  const textChunkLimit = core.channel.text.resolveTextChunkLimit(
    params.cfg,
    "feishu",
    params.accountId,
    { fallbackLimit: 4e3 },
  );
  const chunkMode = core.channel.text.resolveChunkMode(params.cfg, "feishu", params.accountId);
  const typingReaction = createCommentTypingReactionLifecycle({
    cfg: params.cfg,
    fileToken: params.fileToken,
    fileType: params.fileType,
    replyId: params.replyId,
    accountId: params.accountId,
    runtime: params.runtime,
  });
  const { dispatcher, replyOptions, markDispatchIdle, markRunComplete } =
    core.channel.reply.createReplyDispatcherWithTyping({
      responsePrefix: prefixContext.responsePrefix,
      responsePrefixContextProvider: prefixContext.responsePrefixContextProvider,
      humanDelay: core.channel.reply.resolveHumanDelayConfig(params.cfg, params.agentId),
      onReplyStart: async () => {
        await typingReaction.start();
      },
      deliver: async (payload, info) => {
        if (info.kind !== "final") return;
        const reply = resolveSendableOutboundReplyParts(payload);
        if (!reply.hasText) {
          if (reply.hasMedia)
            params.runtime.log?.(
              `feishu[${params.accountId ?? "default"}]: comment reply ignored media-only payload for comment=${params.commentId}`,
            );
          return;
        }
        const chunks = core.channel.text.chunkTextWithMode(reply.text, textChunkLimit, chunkMode);
        for (const chunk of chunks)
          await deliverCommentThreadText(client, {
            file_token: params.fileToken,
            file_type: params.fileType,
            comment_id: params.commentId,
            content: chunk,
            is_whole_comment: params.isWholeComment,
          });
      },
      onError: (err, info) => {
        params.runtime.error?.(
          `feishu[${params.accountId ?? "default"}]: comment dispatcher failed kind=${info.kind} comment=${params.commentId}: ${String(err)}`,
        );
      },
      onCleanup: () => {
        typingReaction.cleanup();
      },
    });
  return {
    dispatcher,
    replyOptions,
    markDispatchIdle,
    markRunComplete,
    startTypingReaction: typingReaction.start,
    cleanupTypingReaction: typingReaction.cleanup,
  };
}
//#endregion
//#region extensions/feishu/src/monitor.comment.ts
const FEISHU_COMMENT_VERIFY_TIMEOUT_MS = 3e3;
const FEISHU_COMMENT_LIST_PAGE_SIZE = 100;
const FEISHU_COMMENT_LIST_PAGE_LIMIT = 5;
const FEISHU_COMMENT_REPLY_PAGE_SIZE = 100;
const FEISHU_COMMENT_REPLY_PAGE_LIMIT = 5;
const FEISHU_COMMENT_REPLY_MISS_RETRY_DELAY_MS = 1e3;
const FEISHU_COMMENT_REPLY_MISS_RETRY_LIMIT = 6;
const FEISHU_COMMENT_THREAD_PROMPT_LIMIT = 20;
const FEISHU_WHOLE_COMMENT_PROMPT_LIMIT = 12;
const FEISHU_PROMPT_TEXT_LIMIT = 220;
function safeJsonStringify(value) {
  try {
    return JSON.stringify(value);
  } catch (error) {
    return JSON.stringify({ error: formatErrorMessage(error) });
  }
}
function truncatePromptText(text, maxLength = FEISHU_PROMPT_TEXT_LIMIT) {
  const normalized = normalizeString(text);
  if (!normalized) return "";
  return normalized.length > maxLength
    ? `${sliceUtf16Safe(normalized, 0, maxLength - 1)}…`
    : normalized;
}
function formatPromptTextValue(text) {
  return safeJsonStringify(truncatePromptText(text) || "");
}
function formatPromptBoolean(value) {
  return value === true ? "yes" : "no";
}
function buildDriveCommentsListUrl(params) {
  return (
    `/open-apis/drive/v1/files/${encodeURIComponent(params.fileToken)}/comments` +
    encodeQuery({
      file_type: params.fileType,
      is_whole: params.isWholeOnly === true ? "true" : void 0,
      page_size: String(FEISHU_COMMENT_LIST_PAGE_SIZE),
      page_token: params.pageToken,
      user_id_type: "open_id",
    })
  );
}
function compareCommentTimelineEntries(left, right) {
  const leftTime = left.createTime ?? Number.MAX_SAFE_INTEGER;
  const rightTime = right.createTime ?? Number.MAX_SAFE_INTEGER;
  if (leftTime !== rightTime) return leftTime - rightTime;
  return (left.stableId ?? "").localeCompare(right.stableId ?? "");
}
function formatLinkedDocumentInline(link) {
  return [
    `raw_url=${link.rawUrl}`,
    `url_kind=${link.urlKind}`,
    link.wikiNodeToken ? `wiki_node_token=${link.wikiNodeToken}` : null,
    `resolved_type=${link.resolvedObjType ?? "UNKNOWN"}`,
    `resolved_token=${link.resolvedObjToken ?? "UNKNOWN"}`,
    `same_as_current_document=${formatPromptBoolean(link.isCurrentDocument)}`,
  ]
    .filter((part) => Boolean(part))
    .join(" ");
}
function formatLinkedDocumentsPromptLines(params) {
  if (params.linkedDocuments.length === 0) return [];
  return [
    params.title,
    ...params.linkedDocuments.map(
      (link, index) => `- [${index + 1}] ${formatLinkedDocumentInline(link)}`,
    ),
  ];
}
function formatLinkedDocumentsInlineSummary(linkedDocuments) {
  if (linkedDocuments.length === 0) return "none";
  return linkedDocuments
    .map(
      (link) =>
        `${link.resolvedObjType ?? link.urlKind}:${link.resolvedObjToken ?? link.wikiNodeToken ?? "UNKNOWN"}`,
    )
    .join(",");
}
function summarizeCommentRepliesForLog(replies) {
  return safeJsonStringify(
    replies.map((reply) => ({
      reply_id: reply.reply_id,
      text_len: extractReplyText(reply)?.length ?? 0,
    })),
  );
}
async function resolveParsedCommentContent(params) {
  const parsed = parseCommentContentElements({
    elements: params.elements,
    botOpenIds: params.botOpenIds,
    currentDocument: params.currentDocument,
  });
  if (!parsed.linkedDocuments.some((link) => link.urlKind === "wiki" && link.wikiNodeToken))
    return parsed;
  const resolvedLinkedDocuments = await Promise.all(
    parsed.linkedDocuments.map(async (link) => {
      if (link.urlKind !== "wiki" || !link.wikiNodeToken) return link;
      let pending = params.wikiCache.get(link.wikiNodeToken);
      if (!pending) {
        pending = params.client.wiki.space
          .getNode({ params: { token: link.wikiNodeToken } })
          .then((response) => {
            if (response.code !== 0) {
              params.logger?.(
                `feishu[${params.accountId}]: wiki link resolution failed token=${link.wikiNodeToken} code=${response.code ?? "unknown"} msg=${response.msg ?? "unknown"}`,
              );
              return null;
            }
            const objType = normalizeCommentFileType(response.data?.node?.obj_type);
            const objToken = normalizeString(response.data?.node?.obj_token);
            if (!objType || !objToken) return null;
            return {
              resolvedObjType: objType,
              resolvedObjToken: objToken,
            };
          })
          .catch((error) => {
            params.logger?.(
              `feishu[${params.accountId}]: wiki link resolution threw token=${link.wikiNodeToken} error=${formatErrorMessage(error)}`,
            );
            return null;
          });
        params.wikiCache.set(link.wikiNodeToken, pending);
      }
      const resolved = await pending;
      if (!resolved) return link;
      return {
        ...link,
        resolvedObjType: resolved.resolvedObjType,
        resolvedObjToken: resolved.resolvedObjToken,
        isCurrentDocument:
          resolved.resolvedObjType === params.currentDocument.fileType &&
          resolved.resolvedObjToken === params.currentDocument.fileToken,
      };
    }),
  );
  return {
    ...parsed,
    linkedDocuments: resolvedLinkedDocuments,
  };
}
async function delayMs(ms) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
function buildDriveCommentTargetUrl(params) {
  return (
    `/open-apis/drive/v1/files/${encodeURIComponent(params.fileToken)}/comments/batch_query` +
    encodeQuery({
      file_type: params.fileType,
      user_id_type: "open_id",
    })
  );
}
function buildDriveCommentRepliesUrl(params) {
  return (
    `/open-apis/drive/v1/files/${encodeURIComponent(params.fileToken)}/comments/${encodeURIComponent(params.commentId)}/replies` +
    encodeQuery({
      file_type: params.fileType,
      page_token: params.pageToken,
      page_size: String(FEISHU_COMMENT_REPLY_PAGE_SIZE),
      user_id_type: "open_id",
    })
  );
}
async function fetchDriveComments(params) {
  const comments = [];
  let pageToken;
  for (let page = 0; page < FEISHU_COMMENT_LIST_PAGE_LIMIT; page += 1) {
    const response = await requestFeishuOpenApi({
      client: params.client,
      method: "GET",
      url: buildDriveCommentsListUrl({
        fileToken: params.fileToken,
        fileType: params.fileType,
        isWholeOnly: params.isWholeOnly,
        pageToken,
      }),
      timeoutMs: params.timeoutMs,
      logger: params.logger,
      errorLabel: `feishu[${params.accountId}]: failed to list drive comments for ${params.fileToken}`,
    });
    if (response?.code !== 0) {
      if (response)
        params.logger?.(
          `feishu[${params.accountId}]: failed to list drive comments for ${params.fileToken}: ${response.msg ?? "unknown error"} log_id=${response.log_id?.trim() || "unknown"}`,
        );
      break;
    }
    comments.push(...(response.data?.items ?? []));
    if (response.data?.has_more !== true || !response.data.page_token?.trim()) break;
    pageToken = response.data.page_token.trim();
  }
  return comments;
}
async function requestFeishuOpenApi(params) {
  const formatErrorDetails = (error) => {
    if (!isRecord$1(error)) return typeof error === "string" ? error : JSON.stringify(error);
    const response = isRecord$1(error.response) ? error.response : void 0;
    const responseData = isRecord$1(response?.data) ? response?.data : void 0;
    return safeJsonStringify({
      message:
        typeof error.message === "string"
          ? error.message
          : typeof error === "string"
            ? error
            : JSON.stringify(error),
      code: readString(error.code),
      method: readString(isRecord$1(error.config) ? error.config.method : void 0),
      url: readString(isRecord$1(error.config) ? error.config.url : void 0),
      http_status: typeof response?.status === "number" ? response.status : void 0,
      feishu_code:
        typeof responseData?.code === "number" ? responseData.code : readString(responseData?.code),
      feishu_msg: readString(responseData?.msg),
      feishu_log_id: readString(responseData?.log_id),
    });
  };
  const result = await raceWithTimeoutAndAbort(
    params.client.request({
      method: params.method,
      url: params.url,
      data: params.data ?? {},
      timeout: params.timeoutMs,
    }),
    { timeoutMs: params.timeoutMs },
  )
    .then((resolved) => (resolved.status === "resolved" ? resolved.value : null))
    .catch((error) => {
      params.logger?.(`${params.errorLabel}: ${formatErrorDetails(error)}`);
      return null;
    });
  if (!result) params.logger?.(`${params.errorLabel}: request timed out or returned no data`);
  return result;
}
async function fetchDriveCommentReplies(params) {
  const replies = [];
  const logIds = [];
  let pageToken;
  for (let page = 0; page < FEISHU_COMMENT_REPLY_PAGE_LIMIT; page += 1) {
    const response = await requestFeishuOpenApi({
      client: params.client,
      method: "GET",
      url: buildDriveCommentRepliesUrl({
        fileToken: params.fileToken,
        commentId: params.commentId,
        fileType: params.fileType,
        pageToken,
      }),
      timeoutMs: params.timeoutMs,
      logger: params.logger,
      errorLabel: `feishu[${params.accountId}]: failed to fetch comment replies for ${params.commentId}`,
    });
    if (response?.log_id?.trim()) logIds.push(response.log_id.trim());
    if (response?.code !== 0) {
      if (response)
        params.logger?.(
          `feishu[${params.accountId}]: failed to fetch comment replies for ${params.commentId}: ${response.msg ?? "unknown error"} log_id=${response.log_id?.trim() || "unknown"}`,
        );
      break;
    }
    replies.push(...(response.data?.items ?? []));
    if (response.data?.has_more !== true || !response.data.page_token?.trim()) break;
    pageToken = response.data.page_token.trim();
  }
  return {
    replies,
    logIds,
  };
}
async function resolveCommentReplyContext(params) {
  const userId = normalizeString(params.reply.user_id);
  const normalizedBotOpenIds = new Set(
    Array.from(params.botOpenIds ?? [])
      .map((botId) => normalizeString(botId))
      .filter((botId) => Boolean(botId)),
  );
  return {
    replyId: normalizeString(params.reply.reply_id),
    userId,
    createTime: typeof params.reply.create_time === "number" ? params.reply.create_time : void 0,
    isBotAuthored: typeof userId === "string" && normalizedBotOpenIds.has(userId),
    content: await resolveParsedCommentContent({
      elements: isRecord$1(params.reply.content) ? params.reply.content.elements : void 0,
      botOpenIds: params.botOpenIds,
      currentDocument: params.currentDocument,
      client: params.client,
      wikiCache: params.wikiCache,
      logger: params.logger,
      accountId: params.accountId,
    }),
  };
}
function selectCommentThreadPromptReplies(replies, targetReplyId) {
  if (replies.length <= FEISHU_COMMENT_THREAD_PROMPT_LIMIT) return replies;
  const targetIndex = replies.findIndex((reply) => reply.replyId === targetReplyId);
  const currentIndex = targetIndex >= 0 ? targetIndex : replies.length - 1;
  const selected = /* @__PURE__ */ new Set([0, currentIndex, replies.length - 1]);
  for (let radius = 1; selected.size < FEISHU_COMMENT_THREAD_PROMPT_LIMIT; radius += 1) {
    const before = currentIndex - radius;
    const after = currentIndex + radius;
    if (before >= 0) selected.add(before);
    if (selected.size >= FEISHU_COMMENT_THREAD_PROMPT_LIMIT) break;
    if (after < replies.length) selected.add(after);
    if (before < 0 && after >= replies.length) break;
  }
  return [...selected]
    .toSorted((left, right) => left - right)
    .map((index) => replies[index])
    .filter((reply) => Boolean(reply));
}
function formatCommentThreadPromptLines(params) {
  return selectCommentThreadPromptReplies(params.replies, params.targetReplyId).map(
    (reply, index) => {
      const text = reply.content.semanticText ?? reply.content.plainText;
      return `- [${index + 1}] author=${reply.isBotAuthored ? "assistant" : "user"} user_id=${reply.userId ?? "UNKNOWN"} reply_id=${reply.replyId ?? "UNKNOWN"} current_event=${reply.replyId === params.targetReplyId ? "yes" : "no"} text=${formatPromptTextValue(text)} referenced_docs=${formatLinkedDocumentsInlineSummary(reply.content.linkedDocuments)}`;
    },
  );
}
function findNearestBotTimelineEntry(params) {
  const step = params.direction === "after" ? 1 : -1;
  for (
    let index = params.currentIndex + step;
    index >= 0 && index < params.entries.length;
    index += step
  ) {
    const candidate = params.entries[index];
    if (candidate?.isBotAuthored) return candidate;
  }
}
function selectWholeCommentTimelineEntries(params) {
  if (params.entries.length <= FEISHU_WHOLE_COMMENT_PROMPT_LIMIT) return params.entries;
  const currentIndex = params.entries.findIndex(
    (entry) => entry.commentId === params.currentCommentId,
  );
  if (currentIndex < 0) return params.entries.slice(-12);
  const selected = /* @__PURE__ */ new Set([currentIndex]);
  const nearestBotAfter = params.entries.findIndex(
    (entry, index) => index > currentIndex && entry.isBotAuthored,
  );
  if (nearestBotAfter >= 0) selected.add(nearestBotAfter);
  for (let index = currentIndex - 1; index >= 0; index -= 1)
    if (params.entries[index]?.isBotAuthored) {
      selected.add(index);
      break;
    }
  for (let radius = 1; selected.size < FEISHU_WHOLE_COMMENT_PROMPT_LIMIT; radius += 1) {
    const before = currentIndex - radius;
    const after = currentIndex + radius;
    if (before >= 0) selected.add(before);
    if (selected.size >= FEISHU_WHOLE_COMMENT_PROMPT_LIMIT) break;
    if (after < params.entries.length) selected.add(after);
    if (before < 0 && after >= params.entries.length) break;
  }
  return [...selected]
    .toSorted((left, right) => left - right)
    .map((index) => params.entries[index])
    .filter((entry) => Boolean(entry));
}
function formatWholeCommentTimelinePromptLines(params) {
  return selectWholeCommentTimelineEntries(params).map((entry, index) => {
    const text = entry.content.semanticText ?? entry.content.plainText;
    return `- [${index + 1}] create_time=${entry.createTime ?? "UNKNOWN"} comment_id=${entry.commentId} author=${entry.isBotAuthored ? "assistant" : "user"} user_id=${entry.userId ?? "UNKNOWN"} current_comment=${entry.commentId === params.currentCommentId ? "yes" : "no"} text=${formatPromptTextValue(text)} referenced_docs=${formatLinkedDocumentsInlineSummary(entry.content.linkedDocuments)}`;
  });
}
async function fetchDriveCommentContext(params) {
  const [metaResponse, commentResponse] = await Promise.all([
    requestFeishuOpenApi({
      client: params.client,
      method: "POST",
      url: "/open-apis/drive/v1/metas/batch_query",
      data: {
        request_docs: [
          {
            doc_token: params.fileToken,
            doc_type: params.fileType,
          },
        ],
        with_url: true,
      },
      timeoutMs: params.timeoutMs,
      logger: params.logger,
      errorLabel: `feishu[${params.accountId}]: failed to fetch drive metadata for ${params.fileToken}`,
    }),
    requestFeishuOpenApi({
      client: params.client,
      method: "POST",
      url: buildDriveCommentTargetUrl({
        fileToken: params.fileToken,
        fileType: params.fileType,
      }),
      data: { comment_ids: [params.commentId] },
      timeoutMs: params.timeoutMs,
      logger: params.logger,
      errorLabel: `feishu[${params.accountId}]: failed to fetch drive comment ${params.commentId}`,
    }),
  ]);
  const wikiCache = /* @__PURE__ */ new Map();
  const commentCard =
    commentResponse?.code === 0
      ? (commentResponse.data?.items ?? []).find(
          (item) => item.comment_id?.trim() === params.commentId,
        )
      : void 0;
  const embeddedReplies = commentCard?.reply_list?.replies ?? [];
  params.logger?.(
    `feishu[${params.accountId}]: embedded comment replies comment=${params.commentId} count=${embeddedReplies.length} summary=${summarizeCommentRepliesForLog(embeddedReplies)}`,
  );
  const embeddedTargetReply = params.replyId
    ? embeddedReplies.find((reply) => reply.reply_id?.trim() === params.replyId?.trim())
    : embeddedReplies.at(-1);
  let replies = embeddedReplies;
  let fetchedMatchedReply = params.replyId
    ? replies.find((reply) => reply.reply_id?.trim() === params.replyId?.trim())
    : void 0;
  if (!embeddedTargetReply || replies.length === 0 || commentCard?.has_more === true) {
    params.logger?.(
      `feishu[${params.accountId}]: fetching extra comment replies comment=${params.commentId} requested_reply=${params.replyId ?? "none"} embedded_count=${embeddedReplies.length} embedded_hit=${embeddedTargetReply ? "yes" : "no"} embedded_has_more=${commentCard?.has_more === true ? "yes" : "no"}`,
    );
    const fetched = await fetchDriveCommentReplies(params);
    if (fetched.replies.length > 0) {
      params.logger?.(
        `feishu[${params.accountId}]: fetched extra comment replies comment=${params.commentId} count=${fetched.replies.length} log_ids=${safeJsonStringify(fetched.logIds)} summary=${summarizeCommentRepliesForLog(fetched.replies)}`,
      );
      replies = fetched.replies;
      fetchedMatchedReply = params.replyId
        ? replies.find((reply) => reply.reply_id?.trim() === params.replyId?.trim())
        : void 0;
    }
    if (params.replyId && !embeddedTargetReply && !fetchedMatchedReply)
      for (let attempt = 1; attempt <= FEISHU_COMMENT_REPLY_MISS_RETRY_LIMIT; attempt += 1) {
        params.logger?.(
          `feishu[${params.accountId}]: retrying comment reply lookup comment=${params.commentId} requested_reply=${params.replyId} attempt=${attempt}/${FEISHU_COMMENT_REPLY_MISS_RETRY_LIMIT} delay_ms=${FEISHU_COMMENT_REPLY_MISS_RETRY_DELAY_MS}`,
        );
        await params.waitMs(FEISHU_COMMENT_REPLY_MISS_RETRY_DELAY_MS);
        const retried = await fetchDriveCommentReplies(params);
        if (retried.replies.length > 0) {
          params.logger?.(
            `feishu[${params.accountId}]: fetched retried comment replies comment=${params.commentId} attempt=${attempt} count=${retried.replies.length} log_ids=${safeJsonStringify(retried.logIds)} summary=${summarizeCommentRepliesForLog(retried.replies)}`,
          );
          replies = retried.replies;
        }
        fetchedMatchedReply = replies.find((reply) => reply.reply_id?.trim() === params.replyId);
        if (fetchedMatchedReply) break;
      }
  }
  const rootReply = replies[0] ?? embeddedReplies[0];
  const targetReply = params.replyId
    ? (embeddedTargetReply ?? fetchedMatchedReply ?? void 0)
    : (replies.at(-1) ?? embeddedTargetReply ?? rootReply);
  const matchSource = params.replyId
    ? embeddedTargetReply
      ? "embedded"
      : fetchedMatchedReply
        ? "fetched"
        : "miss"
    : targetReply === rootReply
      ? "fallback_root"
      : targetReply === embeddedTargetReply
        ? "embedded_latest"
        : "fetched_latest";
  params.logger?.(
    `feishu[${params.accountId}]: comment reply resolution comment=${params.commentId} requested_reply=${params.replyId ?? "none"} match_source=${matchSource} root=${safeJsonStringify(
      {
        reply_id: rootReply?.reply_id,
        text_len: extractReplyText(rootReply)?.length ?? 0,
      },
    )} target=${safeJsonStringify({
      reply_id: targetReply?.reply_id,
      text_len: extractReplyText(targetReply)?.length ?? 0,
    })}`,
  );
  const meta = metaResponse?.code === 0 ? metaResponse.data?.metas?.[0] : void 0;
  const currentDocument = {
    fileType: params.fileType,
    fileToken: params.fileToken,
  };
  const resolvedReplies = await Promise.all(
    replies.map((reply) =>
      resolveCommentReplyContext({
        reply,
        botOpenIds: params.botOpenIds,
        currentDocument,
        client: params.client,
        wikiCache,
        logger: params.logger,
        accountId: params.accountId,
      }),
    ),
  );
  resolvedReplies.sort((left, right) =>
    compareCommentTimelineEntries(
      {
        createTime: left.createTime,
        stableId: left.replyId,
      },
      {
        createTime: right.createTime,
        stableId: right.replyId,
      },
    ),
  );
  const rootReplyContext =
    resolvedReplies.find((reply) => reply.replyId === normalizeString(rootReply?.reply_id)) ??
    resolvedReplies[0];
  const targetReplyContext =
    resolvedReplies.find((reply) => reply.replyId === normalizeString(targetReply?.reply_id)) ??
    (params.replyId ? void 0 : (resolvedReplies.at(-1) ?? rootReplyContext));
  let wholeCommentTimeline = [];
  if (commentCard?.is_whole === true) {
    const wholeComments = (
      await fetchDriveComments({
        client: params.client,
        fileToken: params.fileToken,
        fileType: params.fileType,
        isWholeOnly: true,
        timeoutMs: params.timeoutMs,
        logger: params.logger,
        accountId: params.accountId,
      })
    ).filter((comment) => comment.is_whole === true);
    wholeCommentTimeline = await Promise.all(
      wholeComments.map(async (comment) => {
        const rootWholeReply = comment.reply_list?.replies?.[0];
        const normalizedBotOpenIds = new Set(
          Array.from(params.botOpenIds ?? [])
            .map((botId) => normalizeString(botId))
            .filter((botId) => Boolean(botId)),
        );
        const content = await resolveParsedCommentContent({
          elements: isRecord$1(rootWholeReply?.content) ? rootWholeReply.content.elements : void 0,
          botOpenIds: params.botOpenIds,
          currentDocument,
          client: params.client,
          wikiCache,
          logger: params.logger,
          accountId: params.accountId,
        });
        const commentUserId =
          normalizeString(rootWholeReply?.user_id) || normalizeString(comment.user_id);
        return {
          commentId: normalizeString(comment.comment_id) ?? "",
          userId: commentUserId,
          createTime:
            typeof comment.create_time === "number"
              ? comment.create_time
              : typeof rootWholeReply?.create_time === "number"
                ? rootWholeReply.create_time
                : void 0,
          isCurrentComment: normalizeString(comment.comment_id) === params.commentId,
          isBotAuthored:
            typeof commentUserId === "string" && normalizedBotOpenIds.has(commentUserId),
          content,
        };
      }),
    );
    wholeCommentTimeline = wholeCommentTimeline
      .filter((entry) => Boolean(entry.commentId))
      .toSorted((left, right) =>
        compareCommentTimelineEntries(
          {
            createTime: left.createTime,
            stableId: left.commentId,
          },
          {
            createTime: right.createTime,
            stableId: right.commentId,
          },
        ),
      );
  }
  const currentWholeCommentIndex = wholeCommentTimeline.findIndex(
    (entry) => entry.commentId === params.commentId,
  );
  return {
    documentTitle: normalizeString(meta?.title),
    documentUrl: normalizeString(meta?.url),
    isWholeComment: commentCard?.is_whole,
    quoteText: normalizeString(commentCard?.quote),
    rootCommentText: rootReplyContext?.content.semanticText ?? rootReplyContext?.content.plainText,
    targetReplyText:
      targetReplyContext?.content.semanticText ?? targetReplyContext?.content.plainText,
    rootCommentContent: rootReplyContext?.content,
    targetReplyContent: targetReplyContext?.content,
    currentCommentThreadReplies: resolvedReplies,
    wholeCommentTimeline,
    nearestBotWholeCommentAfter:
      currentWholeCommentIndex >= 0
        ? findNearestBotTimelineEntry({
            entries: wholeCommentTimeline,
            currentIndex: currentWholeCommentIndex,
            direction: "after",
          })
        : void 0,
    nearestBotWholeCommentBefore:
      currentWholeCommentIndex >= 0
        ? findNearestBotTimelineEntry({
            entries: wholeCommentTimeline,
            currentIndex: currentWholeCommentIndex,
            direction: "before",
          })
        : void 0,
  };
}
function buildDriveCommentSurfacePrompt(params) {
  const documentLabel = params.documentTitle
    ? `"${params.documentTitle}"`
    : `${params.fileType} document ${params.fileToken}`;
  const lines = [
    `The user added a ${params.noticeType === "add_reply" ? "reply" : "comment"} in ${documentLabel}.`,
  ];
  if (params.targetReplyText)
    lines.push(`Current user comment text: ${formatPromptTextValue(params.targetReplyText)}`);
  if (
    params.noticeType === "add_reply" &&
    params.rootCommentText &&
    params.rootCommentText !== params.targetReplyText
  )
    lines.push(`Original comment text: ${formatPromptTextValue(params.rootCommentText)}`);
  if (params.quoteText) lines.push(`Quoted content: ${formatPromptTextValue(params.quoteText)}`);
  if (params.isMentioned === true) lines.push("This comment mentioned you.");
  if (params.documentUrl) lines.push(`Document link: ${params.documentUrl}`);
  lines.push(
    "Current commented document:",
    `- file_type=${params.fileType}`,
    `- file_token=${params.fileToken}`,
  );
  if (params.documentTitle) lines.push(`- title=${params.documentTitle}`);
  if (params.documentUrl) lines.push(`- url=${params.documentUrl}`);
  lines.push(
    `Event type: ${params.noticeType}`,
    `file_token: ${params.fileToken}`,
    `file_type: ${params.fileType}`,
    `comment_id: ${params.commentId}`,
  );
  if (params.isWholeComment === true) lines.push("This is a whole-document comment.");
  if (params.replyId?.trim()) lines.push(`reply_id: ${params.replyId.trim()}`);
  if (params.targetReplyContent?.semanticText)
    lines.push(
      `Current user comment semantic text: ${formatPromptTextValue(params.targetReplyContent.semanticText)}`,
    );
  if (params.targetReplyContent?.botMentioned)
    lines.push(
      "Bot routing mention detected in the current user comment. Treat that mention as routing only, not task content.",
    );
  const nonBotMentions = (params.targetReplyContent?.mentions ?? [])
    .filter((mention) => !mention.isBotMention)
    .map((mention) => mention.displayText);
  if (nonBotMentions.length > 0)
    lines.push(`Other mentioned users in current comment: ${nonBotMentions.join(", ")}`);
  lines.push(
    ...formatLinkedDocumentsPromptLines({
      title: "Referenced documents from current user comment:",
      linkedDocuments: params.targetReplyContent?.linkedDocuments ?? [],
    }),
  );
  if (!params.isWholeComment && params.currentCommentThreadReplies.length > 0)
    lines.push(
      "Current comment card timeline (primary context for follow-ups on this comment card):",
      ...formatCommentThreadPromptLines({
        replies: params.currentCommentThreadReplies,
        targetReplyId: params.replyId,
      }),
      "For this non-whole comment, use the current comment card timeline above as the primary source for phrases like 'above', 'previous result', 'that summary', or 'insert it'.",
      "Document-level session history is auxiliary background only. Do not use another comment card's recent output as the primary referent.",
    );
  if (params.isWholeComment && params.wholeCommentTimeline.length > 0) {
    lines.push(
      "Whole-document comment timeline (primary context for whole-comment follow-ups):",
      ...formatWholeCommentTimelinePromptLines({
        entries: params.wholeCommentTimeline,
        currentCommentId: params.commentId,
      }),
    );
    if (params.nearestBotWholeCommentAfter)
      lines.push(
        `Nearest bot-authored whole-comment after the current comment: comment_id=${params.nearestBotWholeCommentAfter.commentId} text=${formatPromptTextValue(params.nearestBotWholeCommentAfter.content.semanticText ?? params.nearestBotWholeCommentAfter.content.plainText)}`,
      );
    if (params.nearestBotWholeCommentBefore)
      lines.push(
        `Nearest bot-authored whole-comment before the current comment: comment_id=${params.nearestBotWholeCommentBefore.commentId} text=${formatPromptTextValue(params.nearestBotWholeCommentBefore.content.semanticText ?? params.nearestBotWholeCommentBefore.content.plainText)}`,
      );
    lines.push(
      "For this whole-document comment, use the whole-comment timeline above as the primary source for phrases like 'just now', 'previous result', 'that summary', or 'write it back'.",
      "Document-level session history is auxiliary background only. Do not resolve whole-comment follow-ups by blindly using the most recent document-session output.",
    );
  }
  lines.push(
    "This is a Feishu document comment thread.",
    "It is not a Feishu IM chat.",
    "Your final text reply will be posted to the current comment thread automatically.",
    "Use the thread timeline above as the main context for follow-up requests.",
    "Do not use another comment card or document-session output as the main reference.",
    "If you need comment thread context, use feishu_drive.list_comments or feishu_drive.list_comment_replies.",
    "If you modify the document, post a user-visible follow-up in the comment thread.",
    "Use feishu_drive.reply_comment or feishu_drive.add_comment for that follow-up.",
    "Whole-document comments do not support direct replies.",
    "For whole-document comments, use feishu_drive.add_comment.",
    'Only treat URLs listed under "Referenced documents from current user comment" as structured Feishu document references.',
    "URLs that appear only in comment text are plain links unless you verify them.",
    "If the user asks about a linked Feishu document or wiki page, treat that linked document as the read target.",
    "If the user asks you to use a linked document as guidance, treat the linked document as the reference source and the current commented document as the edit target.",
    "If a referenced document resolves to the same file_token and file_type as the current commented document, treat it as the current document.",
    "If the user asks you to modify document content, you must use feishu_doc to make the change.",
    'Do not reply with only "done", "I\'ll handle it", or a restated plan without calling tools.',
    "If the comment quotes document content, treat the quoted content as the main anchor.",
    'For requests like "insert xxx below this content", locate the quoted content first, then edit the document.',
    'For requests like "summarize the content below", "explain this section", or "continue writing from here", use the quoted content as the main target.',
    "If the quote is not enough, use feishu_doc.read or feishu_doc.list_blocks to read nearby context.",
    "Do not guess document content from the comment alone.",
    "Do not give a vague answer before reading enough context.",
    "Unless the user asks for the whole document, handle only the local content around the quoted anchor.",
    "If document edits are involved, read the anchor first, then edit.",
    "If the edit fails or the anchor cannot be found, say so clearly.",
    "If this is a reading task, such as summarization, explanation, or extraction, you may output the final answer directly after confirming the context.",
    "Use the same language as the user's comment or reply, unless the user asks for another language.",
    "Use plain text only.",
    "Do not use Markdown.",
    "Do not use headings.",
    "Do not use bullet lists.",
    "Do not use numbered lists.",
    "Do not use tables.",
    "Do not use blockquotes.",
    "Do not use code blocks.",
    "Do not show reasoning.",
    "Do not show analysis.",
    "Do not show chain-of-thought.",
    "Do not show scratch work.",
    "Do not describe your plan.",
    "Do not describe your steps.",
    "Do not describe tool use.",
    'Do not start with phrases like "I will", "I’ll first", "I need to", "The user wants", or "I have updated".',
    "Output only the final user-facing reply.",
    "If you already sent the user-visible reply with feishu_drive.reply_comment or feishu_drive.add_comment, output exactly NO_REPLY.",
    "If no user-visible reply is needed, output exactly NO_REPLY.",
    "Be concise.",
    "Do not omit requested content.",
  );
  lines.push(
    "Choose one outcome: output the final plain-text reply, edit the document and then post a user-visible follow-up in the comment thread, or output exactly NO_REPLY.",
  );
  return lines.join("\n");
}
async function resolveDriveCommentEventCore(params) {
  const {
    cfg,
    accountId,
    event,
    account,
    botOpenId,
    createClient,
    verificationTimeoutMs = FEISHU_COMMENT_VERIFY_TIMEOUT_MS,
    logger,
    waitMs = delayMs,
  } = params;
  const eventId = event.event_id?.trim();
  const commentId = event.comment_id?.trim();
  const replyId = event.reply_id?.trim();
  const noticeType = event.notice_meta?.notice_type?.trim();
  const fileToken = event.notice_meta?.file_token?.trim();
  const fileType = normalizeCommentFileType(event.notice_meta?.file_type);
  const senderId = event.notice_meta?.from_user_id?.open_id?.trim();
  const senderUserId = normalizeString(event.notice_meta?.from_user_id?.user_id);
  if (!eventId || !commentId || !noticeType || !fileToken || !fileType || !senderId) {
    logger?.(
      `feishu[${accountId}]: drive comment notice missing required fields event=${eventId ?? "unknown"} comment=${commentId ?? "unknown"}`,
    );
    return null;
  }
  if (noticeType !== "add_comment" && noticeType !== "add_reply") {
    logger?.(`feishu[${accountId}]: unsupported drive comment notice type ${noticeType}`);
    return null;
  }
  if (!botOpenId) {
    logger?.(
      `feishu[${accountId}]: skipping drive comment notice because bot open_id is unavailable event=${eventId}`,
    );
    return null;
  }
  if (senderId === botOpenId) {
    logger?.(
      `feishu[${accountId}]: ignoring self-authored drive comment notice event=${eventId} sender=${senderId}`,
    );
    return null;
  }
  const context = await fetchDriveCommentContext({
    client: createClient
      ? createClient(account ?? { accountId })
      : createFeishuClient(
          (await import("./accounts-D22Egp7J.js")).resolveFeishuAccount({
            cfg,
            accountId,
          }),
        ),
    fileToken,
    fileType,
    commentId,
    replyId,
    botOpenIds: [botOpenId, event.notice_meta?.to_user_id?.open_id],
    timeoutMs: verificationTimeoutMs,
    logger,
    accountId,
    waitMs,
  });
  return {
    eventId,
    commentId,
    replyId,
    noticeType,
    fileToken,
    fileType,
    isWholeComment: context.isWholeComment,
    senderId,
    senderUserId,
    timestamp: event.timestamp,
    isMentioned: event.is_mentioned,
    context,
  };
}
function parseFeishuDriveCommentNoticeEventPayload(value) {
  if (!isRecord$1(value) || !isRecord$1(value.notice_meta)) return null;
  const noticeMeta = value.notice_meta;
  const fromUserId = isRecord$1(noticeMeta.from_user_id) ? noticeMeta.from_user_id : void 0;
  const toUserId = isRecord$1(noticeMeta.to_user_id) ? noticeMeta.to_user_id : void 0;
  return {
    comment_id: readString(value.comment_id),
    event_id: readString(value.event_id),
    is_mentioned: asBoolean(value.is_mentioned),
    notice_meta: {
      file_token: readString(noticeMeta.file_token),
      file_type: readString(noticeMeta.file_type),
      from_user_id: fromUserId
        ? {
            open_id: readString(fromUserId.open_id),
            user_id: readString(fromUserId.user_id),
            union_id: readString(fromUserId.union_id),
          }
        : void 0,
      notice_type: readString(noticeMeta.notice_type),
      to_user_id: toUserId
        ? {
            open_id: readString(toUserId.open_id),
            user_id: readString(toUserId.user_id),
            union_id: readString(toUserId.union_id),
          }
        : void 0,
    },
    reply_id: readString(value.reply_id),
    timestamp: readString(value.timestamp),
    type: readString(value.type),
  };
}
async function resolveDriveCommentEventTurn(params) {
  const resolved = await resolveDriveCommentEventCore(params);
  if (!resolved) return null;
  const prompt = buildDriveCommentSurfacePrompt({
    noticeType: resolved.noticeType,
    fileType: resolved.fileType,
    fileToken: resolved.fileToken,
    commentId: resolved.commentId,
    replyId: resolved.replyId,
    isWholeComment: resolved.isWholeComment,
    isMentioned: resolved.isMentioned,
    documentTitle: resolved.context.documentTitle,
    documentUrl: resolved.context.documentUrl,
    quoteText: resolved.context.quoteText,
    rootCommentText: resolved.context.rootCommentText,
    targetReplyText: resolved.context.targetReplyText,
    rootCommentContent: resolved.context.rootCommentContent,
    targetReplyContent: resolved.context.targetReplyContent,
    currentCommentThreadReplies: resolved.context.currentCommentThreadReplies,
    wholeCommentTimeline: resolved.context.wholeCommentTimeline,
    nearestBotWholeCommentAfter: resolved.context.nearestBotWholeCommentAfter,
    nearestBotWholeCommentBefore: resolved.context.nearestBotWholeCommentBefore,
  });
  const preview = truncateUtf16Safe(prompt.replace(/\s+/g, " "), 160);
  return {
    eventId: resolved.eventId,
    messageId: `drive-comment:${resolved.eventId}`,
    commentId: resolved.commentId,
    replyId: resolved.replyId,
    noticeType: resolved.noticeType,
    fileToken: resolved.fileToken,
    fileType: resolved.fileType,
    isWholeComment: resolved.isWholeComment,
    senderId: resolved.senderId,
    senderUserId: resolved.senderUserId,
    timestamp: resolved.timestamp,
    isMentioned: resolved.isMentioned,
    documentTitle: resolved.context.documentTitle,
    documentUrl: resolved.context.documentUrl,
    quoteText: resolved.context.quoteText,
    rootCommentText: resolved.context.rootCommentText,
    targetReplyText: resolved.context.targetReplyText,
    prompt,
    preview,
  };
}
//#endregion
//#region extensions/feishu/src/comment-handler.ts
function buildCommentSessionKey(params) {
  return params.core.channel.routing.buildAgentSessionKey({
    agentId: params.route.agentId,
    channel: "feishu",
    accountId: params.route.accountId,
    peer: {
      kind: "direct",
      id: `comment-doc:${params.fileType}:${params.fileToken}`,
    },
    dmScope: "per-account-channel-peer",
  });
}
function parseTimestampMs(value) {
  return parseStrictNonNegativeInteger(value) ?? Date.now();
}
async function handleFeishuCommentEvent(params) {
  const account = resolveFeishuRuntimeAccount({
    cfg: params.cfg,
    accountId: params.accountId,
  });
  const core = getFeishuRuntime();
  const log = params.runtime?.log ?? console.log;
  const error = params.runtime?.error ?? console.error;
  const runtime = params.runtime ?? {
    log,
    error,
  };
  const turn = await resolveDriveCommentEventTurn({
    cfg: params.cfg,
    accountId: account.accountId,
    event: params.event,
    botOpenId: params.botOpenId,
    logger: log,
  });
  if (!turn) {
    log(
      `feishu[${account.accountId}]: drive comment notice skipped event=${params.event.event_id ?? "unknown"} comment=${params.event.comment_id ?? "unknown"}`,
    );
    return;
  }
  const commentTarget = buildFeishuCommentTarget({
    fileType: turn.fileType,
    fileToken: turn.fileToken,
    commentId: turn.commentId,
  });
  const pairing = createChannelPairingController({
    core,
    channel: "feishu",
    accountId: account.accountId,
  });
  const resolveCommentAuthorization = async (candidateCfg, mayPair) => {
    const candidateAccount = resolveFeishuRuntimeAccount({
      cfg: candidateCfg,
      accountId: account.accountId,
    });
    const candidateDmPolicy = candidateAccount.config.dmPolicy ?? "pairing";
    return {
      account: candidateAccount,
      cfg: candidateCfg,
      dmPolicy: candidateDmPolicy,
      ingress: await resolveFeishuDmIngressAccess({
        cfg: candidateCfg,
        accountId: candidateAccount.accountId,
        dmPolicy: candidateDmPolicy,
        allowFrom: candidateAccount.config.allowFrom ?? [],
        readAllowFromStore: pairing.readAllowFromStore,
        senderOpenId: turn.senderId,
        senderUserId: turn.senderUserId,
        conversationId: turn.senderId,
        mayPair,
      }),
    };
  };
  const rejectCommentAuthorization = async (authorization) => {
    if (authorization.ingress.ingress.admission === "pairing-required") {
      const client = createFeishuClient(authorization.account);
      await pairing.issueChallenge({
        senderId: turn.senderId,
        senderIdLine: `Your Feishu user id: ${turn.senderId}`,
        meta: { name: turn.senderId },
        onCreated: ({ code }) => {
          log(
            `feishu[${account.accountId}]: comment pairing request sender=${turn.senderId} code=${code}`,
          );
        },
        sendPairingReply: async (text) => {
          await deliverCommentThreadText(client, {
            file_token: turn.fileToken,
            file_type: turn.fileType,
            comment_id: turn.commentId,
            content: text,
            is_whole_comment: turn.isWholeComment,
          });
        },
        onReplyError: (err) => {
          log(
            `feishu[${account.accountId}]: comment pairing reply failed for ${turn.senderId}: ${String(err)}`,
          );
        },
      });
    } else
      log(
        `feishu[${account.accountId}]: blocked unauthorized comment sender ${turn.senderId} (dmPolicy=${authorization.dmPolicy}, comment=${turn.commentId})`,
      );
  };
  const commentAuthorization = await resolveCommentAuthorization(params.cfg, true);
  if (commentAuthorization.ingress.ingress.admission !== "dispatch") {
    await rejectCommentAuthorization(commentAuthorization);
    return;
  }
  let effectiveCfg = params.cfg;
  const currentCfg = core.config.current();
  if (currentCfg !== effectiveCfg) {
    const currentAuthorization = await resolveCommentAuthorization(currentCfg, true);
    if (currentAuthorization.ingress.ingress.admission !== "dispatch") {
      await rejectCommentAuthorization(currentAuthorization);
      return;
    }
    effectiveCfg = currentCfg;
  }
  let route = core.channel.routing.resolveAgentRoute({
    cfg: effectiveCfg,
    channel: "feishu",
    accountId: account.accountId,
    peer: {
      kind: "direct",
      id: turn.senderId,
    },
  });
  if (route.matchedBy === "default") {
    const dynamicResult = await maybeCreateDynamicAgent({
      cfg: effectiveCfg,
      runtime: core,
      accountId: account.accountId,
      senderOpenId: turn.senderId,
      canCreateForConfig: async (candidateCfg) => {
        return (
          (await resolveCommentAuthorization(candidateCfg, false)).ingress.ingress.admission ===
          "dispatch"
        );
      },
      log: (message) => log(message),
    });
    if (dynamicResult.created || dynamicResult.updatedCfg !== effectiveCfg) {
      const refreshedAuthorization = await resolveCommentAuthorization(
        dynamicResult.updatedCfg,
        false,
      );
      if (refreshedAuthorization.ingress.ingress.admission !== "dispatch") {
        log(
          `feishu[${account.accountId}]: current policy rejected stale comment sender ${turn.senderId} before adopting refreshed dynamic route (dmPolicy=${refreshedAuthorization.dmPolicy}, comment=${turn.commentId})`,
        );
        return;
      }
      effectiveCfg = dynamicResult.updatedCfg;
      route = core.channel.routing.resolveAgentRoute({
        cfg: dynamicResult.updatedCfg,
        channel: "feishu",
        accountId: account.accountId,
        peer: {
          kind: "direct",
          id: turn.senderId,
        },
      });
      if (dynamicResult.created)
        log(
          `feishu[${account.accountId}]: dynamic agent created for comment flow, route=${route.sessionKey}`,
        );
    }
  }
  const commentSessionKey = buildCommentSessionKey({
    core,
    route,
    fileType: turn.fileType,
    fileToken: turn.fileToken,
  });
  const bodyForAgent = `[message_id: ${turn.messageId}]\n${turn.prompt}`;
  const ctxPayload = core.channel.reply.finalizeInboundContext({
    Body: bodyForAgent,
    BodyForAgent: bodyForAgent,
    RawBody: turn.targetReplyText ?? turn.rootCommentText ?? turn.prompt,
    CommandBody: turn.targetReplyText ?? turn.rootCommentText ?? turn.prompt,
    From: `feishu:${turn.senderId}`,
    To: commentTarget,
    SessionKey: commentSessionKey,
    AccountId: route.accountId,
    ChatType: "direct",
    ConversationLabel: turn.documentTitle
      ? `Feishu comment · ${turn.documentTitle}`
      : "Feishu comment",
    SenderName: turn.senderId,
    SenderId: turn.senderId,
    Provider: "feishu",
    Surface: "feishu-comment",
    MessageSid: turn.messageId,
    MessageThreadId: turn.replyId,
    Timestamp: parseTimestampMs(turn.timestamp),
    WasMentioned: turn.isMentioned,
    CommandAuthorized: false,
    OriginatingChannel: "feishu",
    OriginatingTo: commentTarget,
  });
  const storePath = core.channel.session.resolveStorePath(effectiveCfg.session?.store, {
    agentId: route.agentId,
  });
  const { dispatcher, replyOptions, markDispatchIdle, markRunComplete, cleanupTypingReaction } =
    createFeishuCommentReplyDispatcher({
      cfg: effectiveCfg,
      agentId: route.agentId,
      runtime,
      accountId: account.accountId,
      fileToken: turn.fileToken,
      fileType: turn.fileType,
      commentId: turn.commentId,
      replyId: turn.replyId,
      isWholeComment: turn.isWholeComment,
    });
  let dispatchSettledBeforeStart = false;
  try {
    log(
      `feishu[${account.accountId}]: dispatching drive comment to agent (session=${commentSessionKey} comment=${turn.commentId} type=${turn.noticeType})`,
    );
    const turnResult = await core.channel.inbound.run({
      channel: "feishu",
      accountId: route.accountId,
      raw: turn,
      adapter: {
        ingest: () => ({
          id: turn.messageId,
          timestamp: parseTimestampMs(turn.timestamp),
          rawText: ctxPayload.RawBody ?? "",
          textForAgent: ctxPayload.BodyForAgent,
          textForCommands: ctxPayload.CommandBody,
          raw: turn,
        }),
        resolveTurn: () => ({
          channel: "feishu",
          accountId: route.accountId,
          routeSessionKey: commentSessionKey,
          storePath,
          ctxPayload,
          recordInboundSession: core.channel.session.recordInboundSession,
          record: {
            onRecordError: (err) => {
              error(
                `feishu[${account.accountId}]: failed to record comment inbound session ${commentSessionKey}: ${String(err)}`,
              );
            },
          },
          onPreDispatchFailure: async () => {
            dispatchSettledBeforeStart = true;
            await core.channel.reply.settleReplyDispatcher({
              dispatcher,
              onSettled: () => {
                markRunComplete();
                markDispatchIdle();
              },
            });
          },
          runDispatch: () =>
            core.channel.reply.withReplyDispatcher({
              dispatcher,
              run: () =>
                core.channel.reply.dispatchReplyFromConfig({
                  ctx: ctxPayload,
                  cfg: effectiveCfg,
                  dispatcher,
                  replyOptions,
                }),
            }),
        }),
      },
    });
    const dispatchResult = turnResult.dispatched ? turnResult.dispatchResult : void 0;
    const queuedFinal = dispatchResult?.queuedFinal ?? false;
    const counts = dispatchResult?.counts ?? {
      tool: 0,
      block: 0,
      final: 0,
    };
    log(
      `feishu[${account.accountId}]: drive comment dispatch complete (queuedFinal=${queuedFinal}, replies=${counts.final}, session=${commentSessionKey})`,
    );
  } finally {
    if (!dispatchSettledBeforeStart) {
      markRunComplete();
      markDispatchIdle();
    }
    cleanupTypingReaction();
  }
}
//#endregion
//#region extensions/feishu/src/sequential-queue.ts
/**
 * Per-key serial task queue for Feishu inbound message handling.
 *
 * Tasks enqueued under the same key run in FIFO order. Different keys run
 * concurrently. This preserves the channel's same-chat ordering contract
 * (see #64324) while letting cross-chat work proceed in parallel.
 *
 * `taskTimeoutMs` bounds how long the queue will block subsequent same-key
 * tasks behind a single in-flight task. After the cap, the in-flight task
 * is evicted from the blocking chain so newer messages for the same key
 * can proceed. The original task is NOT aborted — it continues running in
 * the background; it just stops starving the queue.
 *
 * Without this cap, a single hung dispatch (e.g. an agent call that never
 * resolves) keeps later same-chat messages in `queued` state until the
 * gateway is restarted. See #70133.
 */
const DEFAULT_TASK_TIMEOUT_MS = 300 * 1e3;
function createSequentialQueue(options = {}) {
  const queues = /* @__PURE__ */ new Map();
  const taskTimeoutMs = options.taskTimeoutMs ?? DEFAULT_TASK_TIMEOUT_MS;
  const onTaskTimeout = options.onTaskTimeout;
  return (key, task) => {
    const previous = queues.get(key) ?? Promise.resolve();
    const wrapped = () => boundedRun(key, task, taskTimeoutMs, onTaskTimeout);
    const next = previous.then(wrapped, wrapped);
    queues.set(key, next);
    const cleanup = () => {
      if (queues.get(key) === next) queues.delete(key);
    };
    next.then(cleanup, cleanup);
    return next;
  };
}
async function boundedRun(key, task, timeoutMs, onTaskTimeout) {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) return task();
  const resolvedTimeoutMs = resolveTimerTimeoutMs(timeoutMs, DEFAULT_TASK_TIMEOUT_MS);
  let timeoutHandle;
  const timeoutPromise = new Promise((resolve) => {
    timeoutHandle = setTimeout(() => {
      try {
        onTaskTimeout?.(key, resolvedTimeoutMs);
      } catch {}
      resolve();
    }, resolvedTimeoutMs);
  });
  try {
    await Promise.race([task(), timeoutPromise]);
  } finally {
    if (timeoutHandle) clearTimeout(timeoutHandle);
  }
}
//#endregion
//#region extensions/feishu/src/monitor.comment-notice-handler.ts
function buildCommentNoticeQueueKey(event) {
  return `comment-doc:${event.notice_meta?.file_type?.trim() || "unknown"}:${event.notice_meta?.file_token?.trim() || "unknown"}`;
}
function createFeishuDriveCommentNoticeHandler(params) {
  const { cfg, accountId, runtime, fireAndForget } = params;
  const log = runtime?.log ?? console.log;
  const error = runtime?.error ?? console.error;
  const enqueue = createSequentialQueue();
  const getBotOpenId = params.getBotOpenId ?? ((id) => botOpenIds.get(id));
  const runFeishuHandler = async (task) => {
    const promise = task().catch((err) => {
      error(`feishu[${accountId}]: error handling drive comment notice: ${String(err)}`);
    });
    if (!fireAndForget) await promise;
  };
  return async (data) => {
    await runFeishuHandler(async () => {
      const event = parseFeishuDriveCommentNoticeEventPayload(data);
      if (!event) {
        error(`feishu[${accountId}]: ignoring malformed drive comment notice payload`);
        return;
      }
      const eventId = event.event_id?.trim();
      const syntheticMessageId = eventId ? `drive-comment:${eventId}` : void 0;
      if (syntheticMessageId) {
        const claim = await claimUnprocessedFeishuMessage({
          messageId: syntheticMessageId,
          namespace: accountId,
          log,
        });
        if (claim === "duplicate") {
          log(`feishu[${accountId}]: dropping duplicate comment event ${syntheticMessageId}`);
          return;
        }
        if (claim === "inflight") {
          log(`feishu[${accountId}]: dropping in-flight comment event ${syntheticMessageId}`);
          return;
        }
      }
      log(
        `feishu[${accountId}]: received drive comment notice event=${event.event_id ?? "unknown"} type=${event.notice_meta?.notice_type ?? "unknown"} file=${event.notice_meta?.file_type ?? "unknown"}:${event.notice_meta?.file_token ?? "unknown"} comment=${event.comment_id ?? "unknown"} reply=${event.reply_id ?? "none"} from=${event.notice_meta?.from_user_id?.open_id ?? "unknown"} mentioned=${event.is_mentioned === true ? "yes" : "no"}`,
      );
      try {
        await enqueue(buildCommentNoticeQueueKey(event), async () => {
          await handleFeishuCommentEvent({
            cfg,
            accountId,
            event,
            botOpenId: getBotOpenId(accountId),
            runtime,
          });
        });
        if (syntheticMessageId)
          await recordProcessedFeishuMessage(syntheticMessageId, accountId, log);
      } catch (err) {
        if (syntheticMessageId && !isFeishuRetryableSyntheticEventError(err))
          await recordProcessedFeishuMessage(syntheticMessageId, accountId, log);
        throw err;
      } finally {
        if (syntheticMessageId) releaseFeishuMessageProcessing(syntheticMessageId, accountId);
      }
    });
  };
}
//#endregion
//#region extensions/feishu/src/monitor.message-handler.ts
function normalizeFeishuChatType$1(value) {
  return value === "group" || value === "topic_group" || value === "private" || value === "p2p"
    ? value
    : void 0;
}
function parseFeishuMessageEventPayload(value) {
  if (!isRecord(value)) return null;
  const sender = value.sender;
  const message = value.message;
  if (!isRecord(sender) || !isRecord(message)) return null;
  const senderId = sender.sender_id;
  if (!isRecord(senderId)) return null;
  const messageId = readStringValue(message.message_id);
  const chatId = readStringValue(message.chat_id);
  const chatType = normalizeFeishuChatType$1(message.chat_type);
  const messageType = readStringValue(message.message_type);
  const content = readStringValue(message.content);
  if (!messageId || !chatId || !chatType || !messageType || !content) return null;
  return value;
}
function mergeFeishuDebounceMentions(entries) {
  const merged = /* @__PURE__ */ new Map();
  for (const entry of entries)
    for (const mention of entry.message.mentions ?? []) {
      const stableId =
        mention.id.open_id?.trim() || mention.id.user_id?.trim() || mention.id.union_id?.trim();
      const mentionName = mention.name?.trim();
      const mentionKey = mention.key?.trim();
      const fallback =
        mentionName && mentionKey ? `${mentionName}|${mentionKey}` : mentionName || mentionKey;
      const key = stableId || fallback;
      if (!key || merged.has(key)) continue;
      merged.set(key, mention);
    }
  return merged.size > 0 ? Array.from(merged.values()) : void 0;
}
function dedupeFeishuDebounceEntriesByDedupeKey(entries) {
  const seen = /* @__PURE__ */ new Set();
  const deduped = [];
  for (const entry of entries) {
    const dedupeKey = resolveFeishuMessageDedupeKey(entry);
    if (!dedupeKey) {
      deduped.push(entry);
      continue;
    }
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    deduped.push(entry);
  }
  return deduped;
}
function resolveFeishuDebounceMentions(params) {
  const { entries, botOpenId } = params;
  if (entries.length === 0) return;
  for (const entry of entries.toReversed())
    if (isMentionForwardRequest(entry, botOpenId)) return mergeFeishuDebounceMentions([entry]);
  const merged = mergeFeishuDebounceMentions(entries);
  if (!merged) return;
  const normalizedBotOpenId = botOpenId?.trim();
  if (!normalizedBotOpenId) return;
  const botMentions = merged.filter(
    (mention) => mention.id.open_id?.trim() === normalizedBotOpenId,
  );
  return botMentions.length > 0 ? botMentions : void 0;
}
function createFeishuMessageReceiveHandler({
  cfg,
  channelRuntime,
  accountId,
  runtime,
  chatHistories,
  fireAndForget,
  handleMessage,
  resolveDebounceText: resolveText,
  hasProcessedMessage,
  recordProcessedMessage,
  getBotOpenId = () => void 0,
  getBotName = () => void 0,
  resolveSequentialKey = ({ accountId: accountIdLocal, event }) =>
    `feishu:${accountIdLocal}:${event.message.chat_id?.trim() || "unknown"}`,
  statusSink,
}) {
  const inboundDebounceMs = channelRuntime.debounce.resolveInboundDebounceMs({
    cfg,
    channel: "feishu",
  });
  const log = runtime?.log ?? console.log;
  const error = runtime?.error ?? console.error;
  const enqueue = createSequentialQueue({
    onTaskTimeout: (key, timeoutMs) => {
      log(
        `feishu[${accountId}]: per-chat task exceeded ${timeoutMs}ms cap (key=${key}); evicting from queue so later same-key messages can proceed (#70133)`,
      );
    },
  });
  const dispatchFeishuMessage = async (event, messageDedupeKey) => {
    const sequentialKey = resolveSequentialKey({
      accountId,
      event,
      botOpenId: getBotOpenId(accountId),
      botName: getBotName(accountId),
    });
    const task = () =>
      handleMessage({
        cfg,
        event,
        botOpenId: getBotOpenId(accountId),
        botName: getBotName(accountId),
        runtime,
        channelRuntime,
        chatHistories,
        accountId,
        processingClaimHeld: true,
        messageDedupeKey,
      });
    await enqueue(sequentialKey, task);
  };
  const resolveSenderDebounceId = (event) => {
    return (
      event.sender.sender_id.open_id?.trim() || event.sender.sender_id.user_id?.trim() || void 0
    );
  };
  const resolveDebounceText = (event) => {
    return resolveText({
      event,
      botOpenId: getBotOpenId(accountId),
      botName: getBotName(accountId),
    }).trim();
  };
  const recordSuppressedMessageIds = async (entries, dispatchDedupeKey) => {
    const keepDedupeKey = dispatchDedupeKey?.trim();
    const suppressedIds = new Set(
      entries
        .map((entry) => resolveFeishuMessageDedupeKey(entry))
        .filter((id) => Boolean(id) && (!keepDedupeKey || id !== keepDedupeKey)),
    );
    for (const messageId of suppressedIds)
      try {
        await recordProcessedMessage(messageId, accountId, log);
      } catch (err) {
        error(
          `feishu[${accountId}]: failed to record merged dedupe id ${messageId}: ${String(err)}`,
        );
      }
  };
  const inboundDebouncer = channelRuntime.debounce.createInboundDebouncer({
    debounceMs: inboundDebounceMs,
    buildKey: (event) => {
      const chatId = event.message.chat_id?.trim();
      const senderId = resolveSenderDebounceId(event);
      if (!chatId || !senderId) return null;
      const rootId = event.message.root_id?.trim();
      return `feishu:${accountId}:${chatId}:${rootId ? `thread:${rootId}` : "chat"}:${senderId}`;
    },
    shouldDebounce: (event) => {
      if (event.message.message_type !== "text") return false;
      const text = resolveDebounceText(event);
      return Boolean(text) && !channelRuntime.commands.isControlCommandMessage(text, cfg);
    },
    onFlush: async (entries) => {
      const last = entries.at(-1);
      if (!last) return;
      if (entries.length === 1) {
        await dispatchFeishuMessage(last, resolveFeishuMessageDedupeKey(last));
        return;
      }
      const dedupedEntries = dedupeFeishuDebounceEntriesByDedupeKey(entries);
      const freshEntries = [];
      for (const entry of dedupedEntries)
        if (!(await hasProcessedMessage(resolveFeishuMessageDedupeKey(entry), accountId, log)))
          freshEntries.push(entry);
      const dispatchEntry = freshEntries.at(-1);
      if (!dispatchEntry) return;
      const dispatchDedupeKey = resolveFeishuMessageDedupeKey(dispatchEntry);
      await recordSuppressedMessageIds(dedupedEntries, dispatchDedupeKey);
      const combinedText = freshEntries
        .map((entry) => resolveDebounceText(entry))
        .filter(Boolean)
        .join("\n");
      const mergedMentions = resolveFeishuDebounceMentions({
        entries: freshEntries,
        botOpenId: getBotOpenId(accountId),
      });
      await dispatchFeishuMessage(
        {
          ...dispatchEntry,
          message: {
            ...dispatchEntry.message,
            ...(combinedText.trim()
              ? {
                  message_type: "text",
                  content: JSON.stringify({ text: combinedText }),
                }
              : {}),
            mentions: mergedMentions ?? dispatchEntry.message.mentions,
          },
        },
        dispatchDedupeKey,
      );
    },
    onError: (err, entries) => {
      for (const entry of entries)
        releaseFeishuMessageProcessing(resolveFeishuMessageDedupeKey(entry), accountId);
      error(`feishu[${accountId}]: inbound debounce flush failed: ${String(err)}`);
    },
  });
  return async (data) => {
    statusSink?.({ lastEventAt: Date.now() });
    const event = parseFeishuMessageEventPayload(data);
    if (!event) {
      error(`feishu[${accountId}]: ignoring malformed message event payload`);
      return;
    }
    const messageId = event.message?.message_id?.trim();
    const botOpenId = getBotOpenId(accountId)?.trim();
    const senderOpenId = event.sender.sender_id.open_id?.trim();
    if (botOpenId && senderOpenId === botOpenId) {
      log(`feishu[${accountId}]: dropping self-authored message ${messageId ?? "unknown"}`);
      return;
    }
    const messageDedupeKey = resolveFeishuMessageDedupeKey(event);
    const claim = await claimUnprocessedFeishuMessage({
      messageId: messageDedupeKey,
      namespace: accountId,
      log,
    });
    if (claim !== "claimed") {
      log(`feishu[${accountId}]: dropping ${claim} event for message ${messageId}`);
      return;
    }
    const processMessage = async () => {
      await inboundDebouncer.enqueue(event);
    };
    if (fireAndForget) {
      processMessage().catch((err) => {
        releaseFeishuMessageProcessing(messageDedupeKey, accountId);
        error(`feishu[${accountId}]: error handling message: ${String(err)}`);
      });
      return;
    }
    try {
      await processMessage();
    } catch (err) {
      releaseFeishuMessageProcessing(messageDedupeKey, accountId);
      error(`feishu[${accountId}]: error handling message: ${String(err)}`);
    }
  };
}
//#endregion
//#region extensions/feishu/src/monitor-rate-limit-key.ts
function normalizeFeishuWebhookRateLimitClient(clientIp) {
  if (!clientIp) return "unknown";
  if (clientIp === "::1" || clientIp.startsWith("127.")) return "loopback";
  return clientIp;
}
function buildFeishuWebhookRateLimitKey(params) {
  return `${params.accountId}:${params.path}:${normalizeFeishuWebhookRateLimitClient(params.clientIp)}`;
}
//#endregion
//#region extensions/feishu/src/monitor.transport.ts
const FEISHU_WS_RECONNECT_INITIAL_DELAY_MS = 1e3;
const FEISHU_WS_RECONNECT_MAX_DELAY_MS = 3e4;
const FEISHU_WS_LOG_ERROR_MAX_LENGTH = 500;
const FEISHU_WS_RECONNECT_EXHAUSTED_RE = /^WebSocket reconnect exhausted after \d+ attempts?/;
const FEISHU_WS_AUTORECONNECT_DISABLED_ERROR =
  "WebSocket connect failed and autoReconnect is disabled";
function isFeishuWebhookPayload(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function buildFeishuWebhookEnvelope(req, payload) {
  return Object.assign(Object.create({ headers: req.headers }), payload);
}
function parseFeishuWebhookPayload(rawBody) {
  try {
    const parsed = JSON.parse(rawBody);
    return isFeishuWebhookPayload(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
function isFeishuWebhookSignatureValid(params) {
  const encryptKey = params.encryptKey?.trim();
  if (!encryptKey) return false;
  const timestampHeader = params.headers["x-lark-request-timestamp"];
  const nonceHeader = params.headers["x-lark-request-nonce"];
  const signatureHeader = params.headers["x-lark-signature"];
  const timestamp = Array.isArray(timestampHeader) ? timestampHeader[0] : timestampHeader;
  const nonce = Array.isArray(nonceHeader) ? nonceHeader[0] : nonceHeader;
  const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
  if (!timestamp || !nonce || !signature) return false;
  return safeEqualSecret(
    crypto
      .createHash("sha256")
      .update(timestamp + nonce + encryptKey + params.rawBody)
      .digest("hex"),
    signature,
  );
}
function respondText(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end(body);
}
function getFeishuWsReconnectDelayMs(attempt) {
  return Math.min(
    FEISHU_WS_RECONNECT_INITIAL_DELAY_MS * 2 ** Math.max(0, attempt - 1),
    FEISHU_WS_RECONNECT_MAX_DELAY_MS,
  );
}
function formatFeishuWsErrorForLog(err) {
  const raw = err instanceof Error ? err.message || err.name : String(err);
  const redacted = Array.from(raw, (char) => {
    const code = char.charCodeAt(0);
    return code <= 31 || code === 127 ? " " : char;
  })
    .join("")
    .replace(/:\/\/[^:@/\s]+:[^@/\s]+@/g, "://[redacted]@")
    .replace(/\b(authorization\s*[:=]\s*Bearer\s+)[^\s,;]+/gi, "$1[redacted]")
    .replace(/\b(Bearer\s+)[A-Za-z0-9._~+/-]+=*/g, "$1[redacted]")
    .replace(
      /\b((?:app[_-]?secret|tenant[_-]?access[_-]?token|access[_-]?token|refresh[_-]?token|token|secret|password)\s*[:=]\s*)[^\s&;,]+/gi,
      "$1[redacted]",
    )
    .replace(/\s+/g, " ")
    .trim();
  if (!redacted) return "unknown error";
  if (redacted.length <= FEISHU_WS_LOG_ERROR_MAX_LENGTH) return redacted;
  return `${truncateUtf16Safe(redacted, FEISHU_WS_LOG_ERROR_MAX_LENGTH)}...`;
}
function isFeishuWsTerminalError(err) {
  const message = err.message.trim();
  return (
    FEISHU_WS_RECONNECT_EXHAUSTED_RE.test(message) ||
    message.startsWith(FEISHU_WS_AUTORECONNECT_DISABLED_ERROR)
  );
}
function cleanupFeishuWsClient(params) {
  const { accountId, wsClient, error, clearIdentity } = params;
  if (wsClient)
    try {
      wsClient.close();
    } catch (err) {
      error(
        `feishu[${accountId}]: error closing WebSocket client: ${formatFeishuWsErrorForLog(err)}`,
      );
    }
  wsClients.delete(accountId);
  if (clearIdentity) clearFeishuBotIdentityState(accountId);
}
function waitForFeishuWsCycleEnd(params) {
  if (params.abortSignal?.aborted) return Promise.resolve("abort");
  return new Promise((resolve) => {
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      if (handleAbort) params.abortSignal?.removeEventListener("abort", handleAbort);
      resolve(result);
    };
    const handleAbort = () => finish("abort");
    params.abortSignal?.addEventListener("abort", handleAbort, { once: true });
    if (params.abortSignal?.aborted) {
      finish("abort");
      return;
    }
    params.terminalError.then(finish);
  });
}
async function monitorWebSocket({
  account,
  accountId,
  runtime,
  abortSignal,
  eventDispatcher,
  statusSink,
}) {
  const log = runtime?.log ?? console.log;
  const error = runtime?.error ?? console.error;
  let attempt = 0;
  while (true) {
    if (abortSignal?.aborted) break;
    let wsClient;
    try {
      let reportTerminalError = () => {};
      const terminalError = new Promise((resolve) => {
        reportTerminalError = resolve;
      });
      const handleWsError = (err) => {
        if (isFeishuWsTerminalError(err)) {
          reportTerminalError(err);
          return;
        }
        error(
          `feishu[${accountId}]: WebSocket SDK reported recoverable error: ${formatFeishuWsErrorForLog(err)}`,
        );
      };
      const publishWsConnected = () => {
        const connectedAt = Date.now();
        statusSink?.({
          connected: true,
          lastConnectedAt: connectedAt,
          lastEventAt: connectedAt,
          lastError: null,
        });
      };
      const publishWsReconnecting = () => {
        statusSink?.({
          connected: false,
          lastEventAt: Date.now(),
        });
      };
      log(`feishu[${accountId}]: starting WebSocket connection...`);
      wsClient = await createFeishuWSClient(account, {
        onError: handleWsError,
        onReady: publishWsConnected,
        onReconnected: publishWsConnected,
        onReconnecting: publishWsReconnecting,
      });
      if (abortSignal?.aborted) {
        cleanupFeishuWsClient({
          accountId,
          wsClient,
          error,
          clearIdentity: true,
        });
        break;
      }
      wsClients.set(accountId, wsClient);
      await wsClient.start({ eventDispatcher });
      attempt = 0;
      log(`feishu[${accountId}]: WebSocket client started`);
      const cycleEnd = await waitForFeishuWsCycleEnd({
        abortSignal,
        terminalError,
      });
      if (cycleEnd === "abort") {
        log(`feishu[${accountId}]: abort signal received, stopping`);
        cleanupFeishuWsClient({
          accountId,
          wsClient,
          error,
          clearIdentity: true,
        });
        return;
      }
      cleanupFeishuWsClient({
        accountId,
        wsClient,
        error,
        clearIdentity: false,
      });
      if (abortSignal?.aborted) break;
      statusSink?.({
        connected: false,
        lastEventAt: Date.now(),
      });
      attempt += 1;
      const delayMs = getFeishuWsReconnectDelayMs(attempt);
      error(
        `feishu[${accountId}]: WebSocket connection ended, recreating client in ${delayMs}ms: ${formatFeishuWsErrorForLog(cycleEnd)}`,
      );
      if (!(await waitForAbortableDelay(delayMs, abortSignal))) break;
    } catch (err) {
      cleanupFeishuWsClient({
        accountId,
        wsClient,
        error,
        clearIdentity: false,
      });
      if (abortSignal?.aborted) break;
      statusSink?.({
        connected: false,
        lastEventAt: Date.now(),
      });
      attempt += 1;
      const delayMs = getFeishuWsReconnectDelayMs(attempt);
      error(
        `feishu[${accountId}]: WebSocket start failed, retrying in ${delayMs}ms: ${formatFeishuWsErrorForLog(err)}`,
      );
      if (!(await waitForAbortableDelay(delayMs, abortSignal))) break;
    }
  }
  cleanupFeishuWsClient({
    accountId,
    wsClient: void 0,
    error,
    clearIdentity: true,
  });
}
async function monitorWebhook({
  account,
  accountId,
  runtime,
  abortSignal,
  eventDispatcher,
  statusSink,
}) {
  const log = runtime?.log ?? console.log;
  const error = runtime?.error ?? console.error;
  const encryptKey = account.encryptKey?.trim();
  if (!encryptKey)
    throw new Error(`Feishu account "${accountId}" webhook mode requires encryptKey`);
  const port = account.config.webhookPort ?? 3e3;
  const path = account.config.webhookPath ?? "/feishu/events";
  const host = account.config.webhookHost ?? "127.0.0.1";
  log(`feishu[${accountId}]: starting Webhook server on ${host}:${port}, path ${path}...`);
  const server = http$1.createServer();
  server.on("request", (req, res) => {
    res.on("finish", () => {
      recordWebhookStatus(runtime, accountId, path, res.statusCode);
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const inboundAt = Date.now();
        statusSink?.({
          lastEventAt: inboundAt,
          lastTransportActivityAt: inboundAt,
        });
      }
    });
    if (
      !applyBasicWebhookRequestGuards({
        req,
        res,
        rateLimiter: feishuWebhookRateLimiter,
        rateLimitKey: buildFeishuWebhookRateLimitKey({
          accountId,
          path,
          clientIp: resolveRequestClientIp(req),
        }),
        nowMs: Date.now(),
        requireJsonContentType: true,
      })
    )
      return;
    const guard = installRequestBodyLimitGuard(req, res, {
      maxBytes: FEISHU_WEBHOOK_MAX_BODY_BYTES,
      timeoutMs: FEISHU_WEBHOOK_BODY_TIMEOUT_MS,
      responseFormat: "text",
    });
    if (guard.isTripped()) return;
    (async () => {
      try {
        const body = await readWebhookBodyOrReject({
          req,
          res,
          maxBytes: FEISHU_WEBHOOK_MAX_BODY_BYTES,
          timeoutMs: FEISHU_WEBHOOK_BODY_TIMEOUT_MS,
          profile: "pre-auth",
        });
        if (!body.ok || res.writableEnded) return;
        if (guard.isTripped()) return;
        const rawBody = body.value;
        if (
          !isFeishuWebhookSignatureValid({
            headers: req.headers,
            rawBody,
            encryptKey,
          })
        ) {
          respondText(res, 401, "Invalid signature");
          return;
        }
        const payload = parseFeishuWebhookPayload(rawBody);
        if (!payload) {
          respondText(res, 400, "Invalid JSON");
          return;
        }
        const { isChallenge, challenge } = Lark.generateChallenge(payload, { encryptKey });
        if (isChallenge) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify(challenge));
          return;
        }
        const value = await eventDispatcher.invoke(buildFeishuWebhookEnvelope(req, payload), {
          needCheck: false,
        });
        if (!res.headersSent) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify(value));
        }
      } catch (err) {
        error(`feishu[${accountId}]: webhook handler error: ${String(err)}`);
        if (!res.headersSent) respondText(res, 500, "Internal Server Error");
      } finally {
        guard.dispose();
      }
    })();
  });
  httpServers.set(accountId, server);
  return await new Promise((resolve, reject) => {
    let cleanupStarted = false;
    const cleanup = async () => {
      if (cleanupStarted) return;
      cleanupStarted = true;
      await closeTrackedFeishuHttpServer(accountId, server);
    };
    const handleAbort = () => {
      log(`feishu[${accountId}]: abort signal received, stopping Webhook server`);
      cleanup().then(resolve, reject);
    };
    if (abortSignal?.aborted) {
      cleanup().then(resolve, reject);
      return;
    }
    abortSignal?.addEventListener("abort", handleAbort, { once: true });
    server.listen(port, host, () => {
      log(`feishu[${accountId}]: Webhook server listening on ${host}:${port}`);
      const webhookConnectedAt = Date.now();
      statusSink?.({
        connected: true,
        lastConnectedAt: webhookConnectedAt,
        lastEventAt: webhookConnectedAt,
        lastError: null,
      });
    });
    server.on("error", (err) => {
      error(`feishu[${accountId}]: Webhook server error: ${err}`);
      abortSignal?.removeEventListener("abort", handleAbort);
      reject(err);
    });
  });
}
//#endregion
//#region extensions/feishu/src/sequential-key.ts
function getFeishuSequentialKey(params) {
  const { accountId, event, botOpenId, botName } = params;
  const baseKey = `feishu:${accountId}:${event.message.chat_id?.trim() || "unknown"}`;
  const text = parseFeishuMessageEvent(event, botOpenId, botName).content.trim();
  if (isAbortRequestText(text)) return `${baseKey}:control`;
  if (isBtwRequestText(text)) return `${baseKey}:btw`;
  return baseKey;
}
//#endregion
//#region extensions/feishu/src/monitor.account.ts
const FEISHU_REACTION_VERIFY_TIMEOUT_MS = 1500;
async function resolveReactionSyntheticEvent(params) {
  const {
    cfg,
    accountId,
    event,
    botOpenId,
    fetchMessage = getMessageFeishu,
    verificationTimeoutMs = FEISHU_REACTION_VERIFY_TIMEOUT_MS,
    logger,
    uuid = () => crypto$1.randomUUID(),
    action = "created",
  } = params;
  const emoji = event.reaction_type?.emoji_type;
  const messageId = event.message_id;
  const senderId = event.user_id?.open_id;
  const senderUserId = event.user_id?.user_id;
  if (!emoji || !messageId || !senderId) return null;
  const { resolveFeishuAccount } = await import("./accounts-D22Egp7J.js");
  const reactionNotifications =
    resolveFeishuAccount({
      cfg,
      accountId,
    }).config.reactionNotifications ?? "own";
  if (reactionNotifications === "off") return null;
  if (event.operator_type === "app" || senderId === botOpenId) return null;
  if (emoji === "Typing") return null;
  if (reactionNotifications === "own" && !botOpenId) {
    logger?.(
      `feishu[${accountId}]: bot open_id unavailable, skipping reaction ${emoji} on ${messageId}`,
    );
    return null;
  }
  const reactedMsg = await raceWithTimeoutAndAbort(
    fetchMessage({
      cfg,
      messageId,
      accountId,
    }),
    { timeoutMs: verificationTimeoutMs },
  )
    .then((result) => (result.status === "resolved" ? result.value : null))
    .catch(() => null);
  const isBotMessage = reactedMsg?.senderType === "app" || reactedMsg?.senderOpenId === botOpenId;
  if (!reactedMsg || (reactionNotifications === "own" && !isBotMessage)) {
    logger?.(
      `feishu[${accountId}]: ignoring reaction on non-bot/unverified message ${messageId} (sender: ${reactedMsg?.senderOpenId ?? "unknown"})`,
    );
    return null;
  }
  const fallbackChatType = reactedMsg.chatType;
  const resolvedChatType = normalizeFeishuChatType(event.chat_type) ?? fallbackChatType;
  if (!resolvedChatType) {
    logger?.(
      `feishu[${accountId}]: skipping reaction ${emoji} on ${messageId} without chat type context`,
    );
    return null;
  }
  const syntheticChatIdRaw = event.chat_id ?? reactedMsg.chatId;
  const syntheticChatId = syntheticChatIdRaw?.trim() ? syntheticChatIdRaw : `p2p:${senderId}`;
  const syntheticChatType = resolvedChatType;
  return {
    sender: {
      sender_id: {
        open_id: senderId,
        ...(senderUserId ? { user_id: senderUserId } : {}),
      },
      sender_type: "user",
    },
    message: {
      message_id: `${messageId}:reaction:${emoji}:${uuid()}`,
      typing_target_message_id: messageId,
      chat_id: syntheticChatId,
      chat_type: syntheticChatType,
      message_type: "text",
      content: JSON.stringify({
        text:
          action === "deleted"
            ? `[removed reaction ${emoji} from message ${messageId}]`
            : `[reacted with ${emoji} to message ${messageId}]`,
      }),
    },
  };
}
function normalizeFeishuChatType(value) {
  return value === "group" || value === "topic_group" || value === "private" || value === "p2p"
    ? value
    : void 0;
}
function parseFeishuBotAddedEventPayload(value) {
  if (!isRecord$1(value) || !readString(value.chat_id) || !isRecord$1(value.operator_id))
    return null;
  return value;
}
function parseFeishuBotRemovedChatId(value) {
  if (!isRecord$1(value)) return null;
  return readString(value.chat_id) ?? null;
}
function firstString(...values) {
  for (const value of values) {
    const trimmed = readString(value)?.trim();
    if (trimmed) return trimmed;
  }
}
function readFeishuIdentityField(value, field) {
  if (!isRecord$1(value)) return;
  return firstString(value[field]);
}
function parseFeishuCardActionEventPayload(value) {
  if (!isRecord$1(value)) return null;
  const operator = isRecord$1(value.operator) ? value.operator : {};
  const action = value.action;
  const context = isRecord$1(value.context) ? value.context : {};
  if (!isRecord$1(action)) return null;
  const operatorUserId = operator.user_id;
  const token = readString(value.token);
  const openId = firstString(
    operator.open_id,
    readFeishuIdentityField(operatorUserId, "open_id"),
    value.open_id,
    context.open_id,
  );
  const userId = firstString(
    operator.user_id,
    readFeishuIdentityField(operatorUserId, "user_id"),
    value.user_id,
    context.user_id,
  );
  const unionId = firstString(
    operator.union_id,
    readFeishuIdentityField(operatorUserId, "union_id"),
  );
  const tag = readString(action.tag);
  const actionValue = action.value;
  const openMessageId = firstString(context.open_message_id, value.open_message_id);
  const contextOpenId = firstString(context.open_id, openId);
  const contextUserId = firstString(context.user_id, userId);
  const chatId = firstString(context.chat_id, context.open_chat_id);
  if (!token || !openId || !tag || !isRecord$1(actionValue)) return null;
  return {
    operator: {
      open_id: openId,
      ...(userId ? { user_id: userId } : {}),
      ...(unionId ? { union_id: unionId } : {}),
    },
    token,
    action: {
      value: actionValue,
      tag,
    },
    ...(openMessageId ? { open_message_id: openMessageId } : {}),
    context: {
      ...(openMessageId ? { open_message_id: openMessageId } : {}),
      ...(contextOpenId ? { open_id: contextOpenId } : {}),
      ...(contextUserId ? { user_id: contextUserId } : {}),
      ...(chatId ? { chat_id: chatId } : {}),
    },
  };
}
function registerEventHandlers(eventDispatcher, context) {
  const { cfg, accountId, channelRuntime, runtime, chatHistories, fireAndForget } = context;
  const log = runtime?.log ?? console.log;
  const error = runtime?.error ?? console.error;
  const runFeishuHandler = async (params) => {
    if (fireAndForget) {
      params.task().catch((err) => {
        error(`${params.errorMessage}: ${String(err)}`);
      });
      return;
    }
    try {
      await params.task();
    } catch (err) {
      error(`${params.errorMessage}: ${String(err)}`);
    }
  };
  eventDispatcher.register({
    "im.message.receive_v1": createFeishuMessageReceiveHandler({
      cfg,
      channelRuntime,
      accountId,
      runtime,
      chatHistories,
      fireAndForget,
      handleMessage: handleFeishuMessage,
      resolveDebounceText: ({ event, botOpenId, botName }) =>
        parseFeishuMessageEvent(event, botOpenId, botName).content,
      hasProcessedMessage: hasProcessedFeishuMessage,
      recordProcessedMessage: recordProcessedFeishuMessage,
      getBotOpenId: (id) => botOpenIds.get(id),
      getBotName: (id) => botNames.get(id),
      resolveSequentialKey: getFeishuSequentialKey,
      ...(context.statusSink ? { statusSink: context.statusSink } : {}),
    }),
    "im.message.message_read_v1": async () => {},
    "im.chat.access_event.bot_p2p_chat_entered_v1": async () => {},
    "im.chat.member.bot.added_v1": async (data) => {
      try {
        const event = parseFeishuBotAddedEventPayload(data);
        if (!event) return;
        log(`feishu[${accountId}]: bot added to chat ${event.chat_id}`);
      } catch (err) {
        error(`feishu[${accountId}]: error handling bot added event: ${String(err)}`);
      }
    },
    "im.chat.member.bot.deleted_v1": async (data) => {
      try {
        const chatId = parseFeishuBotRemovedChatId(data);
        if (!chatId) return;
        log(`feishu[${accountId}]: bot removed from chat ${chatId}`);
      } catch (err) {
        error(`feishu[${accountId}]: error handling bot removed event: ${String(err)}`);
      }
    },
    "drive.notice.comment_add_v1": createFeishuDriveCommentNoticeHandler({
      cfg,
      accountId,
      runtime,
      fireAndForget,
    }),
    "im.message.reaction.created_v1": async (data) => {
      await runFeishuHandler({
        errorMessage: `feishu[${accountId}]: error handling reaction event`,
        task: async () => {
          const event = data;
          const myBotId = botOpenIds.get(accountId);
          const syntheticEvent = await resolveReactionSyntheticEvent({
            cfg,
            accountId,
            event,
            botOpenId: myBotId,
            logger: log,
          });
          if (!syntheticEvent) return;
          await handleFeishuMessage({
            cfg,
            event: syntheticEvent,
            botOpenId: myBotId,
            botName: botNames.get(accountId),
            runtime,
            channelRuntime,
            chatHistories,
            accountId,
          });
        },
      });
    },
    "im.message.reaction.deleted_v1": async (data) => {
      await runFeishuHandler({
        errorMessage: `feishu[${accountId}]: error handling reaction removal event`,
        task: async () => {
          const event = data;
          const myBotId = botOpenIds.get(accountId);
          const syntheticEvent = await resolveReactionSyntheticEvent({
            cfg,
            accountId,
            event,
            botOpenId: myBotId,
            logger: log,
            action: "deleted",
          });
          if (!syntheticEvent) return;
          await handleFeishuMessage({
            cfg,
            event: syntheticEvent,
            botOpenId: myBotId,
            botName: botNames.get(accountId),
            runtime,
            channelRuntime,
            chatHistories,
            accountId,
          });
        },
      });
    },
    "application.bot.menu_v6": createFeishuBotMenuHandler({
      cfg,
      accountId,
      runtime,
      chatHistories,
      fireAndForget,
      channelRuntime,
    }),
    "card.action.trigger": async (data) => {
      try {
        const event = parseFeishuCardActionEventPayload(data);
        if (!event) {
          error(`feishu[${accountId}]: ignoring malformed card action payload`);
          return;
        }
        const promise = handleFeishuCardAction({
          cfg,
          event,
          botOpenId: botOpenIds.get(accountId),
          runtime,
          channelRuntime,
          accountId,
        });
        if (fireAndForget)
          promise.catch((err) => {
            error(`feishu[${accountId}]: error handling card action: ${String(err)}`);
          });
        else await promise;
      } catch (err) {
        error(`feishu[${accountId}]: error handling card action: ${String(err)}`);
      }
    },
  });
}
async function monitorSingleAccount(params) {
  const { cfg, account, runtime, abortSignal } = params;
  const { accountId } = account;
  const log = runtime?.log ?? console.log;
  const botOpenIdSource = params.botOpenIdSource ?? { kind: "fetch" };
  const { botOpenId } = applyBotIdentityState(
    accountId,
    botOpenIdSource.kind === "prefetched"
      ? {
          botOpenId: botOpenIdSource.botOpenId,
          botName: botOpenIdSource.botName,
        }
      : await fetchBotIdentityForMonitor(account, {
          runtime,
          abortSignal,
        }),
  );
  log(`feishu[${accountId}]: bot open_id resolved: ${botOpenId ?? "unknown"}`);
  if (!botOpenId && !abortSignal?.aborted)
    startBotIdentityRecovery({
      account,
      accountId,
      runtime,
      abortSignal,
    });
  const connectionMode = account.config.connectionMode ?? "websocket";
  if (connectionMode === "webhook" && !account.verificationToken?.trim())
    throw new Error(`Feishu account "${accountId}" webhook mode requires verificationToken`);
  if (connectionMode === "webhook" && !account.encryptKey?.trim())
    throw new Error(`Feishu account "${accountId}" webhook mode requires encryptKey`);
  const warmupCount = await warmupDedupFromPluginState(accountId, log);
  if (warmupCount > 0)
    log(`feishu[${accountId}]: dedup warmup loaded ${warmupCount} entries from plugin state`);
  let threadBindingManager;
  try {
    const eventDispatcher = createEventDispatcher(account);
    const chatHistories = /* @__PURE__ */ new Map();
    threadBindingManager = createFeishuThreadBindingManager({
      accountId,
      cfg,
    });
    registerEventHandlers(eventDispatcher, {
      cfg,
      accountId,
      channelRuntime: params.channelRuntime?.inbound
        ? params.channelRuntime
        : getFeishuRuntime().channel,
      runtime,
      chatHistories,
      fireAndForget: params.fireAndForget ?? true,
      ...(params.statusSink ? { statusSink: params.statusSink } : {}),
    });
    if (connectionMode === "webhook")
      return await monitorWebhook({
        account,
        accountId,
        runtime,
        abortSignal,
        eventDispatcher,
        ...(params.statusSink ? { statusSink: params.statusSink } : {}),
      });
    return await monitorWebSocket({
      account,
      accountId,
      runtime,
      abortSignal,
      eventDispatcher,
      ...(params.statusSink ? { statusSink: params.statusSink } : {}),
    });
  } finally {
    threadBindingManager?.stop();
  }
}
//#endregion
export { FeishuRetryableSyntheticEventError, monitorSingleAccount, resolveReactionSyntheticEvent };
