import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { a as resolveIMessageAccount } from "./accounts--1GXl2sX.js";
import { t as CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY } from "./approval-handler-adapter-runtime-DjbKLbMW.js";
import {
  c as handleIMessageApprovalReaction,
  d as registerIMessageApprovalReactionTarget,
  g as resolveIMessageReactionContext,
  l as listPendingIMessageApprovalReactionPollTargets,
  s as extractIMessageApprovalPromptBinding,
  u as maybeResolveIMessageApprovalReaction,
} from "./approval-reactions-BxzyMVQA.js";
import { _ as isInsideCode, g as findCodeRegions } from "./assistant-visible-text-DV1Yognj.js";
import {
  n as resolveConfiguredBindingRoute,
  r as resolveRuntimeConversationBindingRoute,
} from "./binding-routing-Z88YfeFH.js";
import {
  a as resolveCatchupConfig,
  i as performIMessageCatchup,
  n as advanceIMessageCatchupCursor,
} from "./catchup-Chv08ub7.js";
import {
  o as createChannelInboundDebouncer,
  s as shouldDebounceTextInbound,
} from "./channel-inbound-vhkYEe2n.js";
import { t as deliverInboundReplyWithMessageSendContext } from "./channel-outbound-DlkFd7rO.js";
import { t as createChannelPairingChallengeIssuer } from "./channel-pairing-1V8FM4wM.js";
import { r as registerChannelRuntimeContext } from "./channel-runtime-context-gztTEkoq.js";
import {
  c as resolveTextChunkLimit,
  o as chunkTextWithMode,
  s as resolveChunkMode,
} from "./chunk-DtO_2oor.js";
import { t as createIMessageRpcClient } from "./client-B2SbygAK.js";
import { t as hasControlCommand } from "./command-detection-DtT_SU8u.js";
import {
  n as filterChannelInboundQuoteContext,
  t as buildChannelInboundEventContext,
} from "./context-DMJN91Z-.js";
import { t as resolveChannelContextVisibilityMode } from "./context-visibility-BVlvSMUZ.js";
import { t as createDedupeCache } from "./dedupe-BqZ2YTEC.js";
import { a as settleReplyDispatcher, t as dispatchInboundMessage } from "./dispatch-BG0SdZGw.js";
import { l as resolvePinnedMainDmOwnerFromAllowlist } from "./dm-policy-shared-d7KFGRtT.js";
import {
  a as resolveEnvelopeFormatOptions,
  i as formatInboundFromLabel,
  r as formatInboundEnvelope,
} from "./envelope-W2SlFUX-.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import {
  a as shouldLogVerbose,
  r as logVerbose,
  s as warn,
  t as danger,
} from "./globals-CNUzHTcU.js";
import {
  n as resolveChannelGroupRequireMention,
  t as resolveChannelGroupPolicy,
} from "./group-policy-7QrY--DR.js";
import "./media-runtime-BhmZORKM.js";
import "./number-runtime-B-n-wjMn.js";
import "./runtime-config-snapshot-hRn3WGyJ.js";
import "./runtime-env-D0V-7Gqz.js";
import "./security-runtime-CraX8Pqe.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { i as resolveHumanDelayConfig } from "./identity-CceraXdn.js";
import "./text-chunking-Dr19ggf-.js";
import "./text-utility-runtime-CJESZCN5.js";
import { t as isInboundPathAllowed } from "./inbound-path-policy-CH_uJYn5.js";
import { f as runChannelInboundEvent } from "./inbound-reply-dispatch-DquY2pbK.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import {
  g as toInboundMediaFacts,
  m as formatInboundMediaUnavailableText,
} from "./kernel-BhdvbEs2.js";
import { n as logInboundDrop, r as logTypingFailure } from "./logging-gUWPKC5g.js";
import "./routing-CwvmVRHd.js";
import { t as resolveMarkdownTableMode } from "./markdown-tables-pi6oiKnf.js";
import {
  n as resolveIMessageAttachmentRoots,
  r as resolveIMessageRemoteAttachmentRoots,
} from "./media-contract-D9j7tfog.js";
import { n as resolveInboundMentionDecision } from "./mention-gating-3P8aSD7o.js";
import { n as buildMentionRegexes, r as matchesMentionPatterns } from "./mentions-BFTjjd4G.js";
import {
  n as createChannelIngressResolver,
  o as defineStableChannelIngressIdentity,
} from "./message-access-DY5sc0VK.js";
import "./history-DdfM33Aj.js";
import { c as kindFromMime } from "./mime-BSEMEb3s.js";
import {
  l as rememberIMessageReplyCache,
  s as isKnownFromMeIMessageMessageId,
} from "./monitor-reply-cache-BmVsaTWs.js";
import {
  C as resolveExpiresAtMsFromDurationMs,
  P as timestampMsToIsoString,
  o as asDateTimestampMs,
} from "./number-coercion-CJQ8TR--.js";
import "./channel-policy-DXOn_tKS.js";
import {
  c as upsertChannelPairingRequest,
  i as readChannelAllowFromStore,
} from "./pairing-store-C4j5pnVS.js";
import {
  i as hasPersistedIMessageEcho,
  s as stripLeadingEchoTextCorruptionMarkers,
} from "./persisted-echo-cache-DgrS4aLB.js";
import { t as createClaimableDedupe } from "./persistent-dedupe-CMTHL22F.js";
import "./approval-handler-runtime-Ik2UNXyz.js";
import { t as requireRuntimeConfig } from "./plugin-config-runtime-ef53THzv.js";
import {
  n as imessageRpcSupportsMethod,
  t as getCachedIMessagePrivateApiStatus,
} from "./private-api-status-lj9GJ_TF.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import "./reply-runtime-5VE4tjLA.js";
import { a as createReplyDispatcherWithTyping } from "./reply-dispatcher-BdFXrJUS.js";
import { t as createChannelHistoryWindow } from "./reply-history-DTabwFaD.js";
import {
  i as deliverTextOrMediaReply,
  m as resolveSendableOutboundReplyParts,
} from "./reply-payload-DDwHXDkv.js";
import { t as createChannelReplyPipeline } from "./reply-pipeline-uYpC1TSz.js";
import "./web-media-Cv2iCdbz.js";
import "./dedupe-runtime-Cpo1VwnM.js";
import "./system-event-runtime-BCfCTl5a.js";
import "./transport-ready-runtime-CNgIhrSF.js";
import "./media-store-CLUM1Syr.js";
import {
  a as resolveInboundLastRouteSessionKey,
  i as resolveAgentRoute,
} from "./resolve-route-oiOq6bK9.js";
import "./conversation-runtime-DuXhVyjf.js";
import "./agent-runtime-BiQiwmwD.js";
import "./markdown-table-runtime-DkTgtzZ0.js";
import "./command-auth-native-D63iLZoQ.js";
import { n as createNonExitingRuntime } from "./runtime-Bz6o617W.js";
import "./channel-feedback-lNNgzRXo.js";
import { t as getIMessageRuntime } from "./runtime-CKNRV1AW.js";
import "./channel-ingress-runtime-B6CHO2ZB.js";
import {
  a as warnMissingProviderGroupPolicyFallbackOnce,
  i as resolveOpenProviderRuntimeGroupPolicy,
  r as resolveDefaultGroupPolicy,
} from "./runtime-group-policy-BEjP88cf.js";
import { t as sanitizeTerminalText } from "./safe-text-DiGQuw-e.js";
import {
  n as resolveIMessageInboundConversationId,
  o as probeIMessage,
  t as sanitizeOutboundText,
} from "./sanitize-outbound-DuVgJyZw.js";
import { r as normalizeScpRemoteHost } from "./scp-host-BtrM4IVE.js";
import { t as sendMessageIMessage } from "./send-CPGPD4PZ.js";
import { n as resolveSendPolicy } from "./send-policy-2la2ZHDC.js";
import { t as recordInboundSession } from "./session-Fo42_iaz.js";
import {
  l as readSessionUpdatedAt,
  m as resolveStorePath,
  r as getSessionEntry,
} from "./session-store-runtime-BwE6SlGz.js";
import { u as saveMediaBuffer } from "./store-BfbXoJVN.js";
import { j as resolveChannelStreamingBlockEnabled } from "./streaming-D_YE0SPS.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import {
  _ as uniqueStrings,
  l as normalizeStringEntries,
} from "./string-normalization-CRyoFBPt.js";
import { a as enqueueSystemEvent } from "./system-events-CIAdjAwz.js";
import { t as convertMarkdownTables } from "./tables-YoFSvuf8.js";
import {
  c as parseIMessageTarget,
  o as normalizeIMessageHandle,
  r as isAllowedIMessageReplyContextSender,
  s as parseIMessageAllowTarget,
  t as formatIMessageChatTarget,
} from "./targets-BO9NhvfG.js";
import { t as waitForTransportReady } from "./transport-ready-B0PBRD38.js";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { n as loadWebMedia } from "./web-media-3hQ71Ejp.js";
//#region extensions/imessage/src/approval-reaction-poller.ts
const RECENT_CHAT_LIMIT = 50;
const PER_CHAT_HISTORY_LIMIT = 30;
const OBSERVED_APPROVAL_PROMPT_TARGET_TTL_MS = 300 * 1e3;
const accountIdsWithCompletedNoTargetDiscovery = /* @__PURE__ */ new Set();
function normalizeChatId(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;
}
function listTargetChatIds(targets) {
  const chatIds = /* @__PURE__ */ new Set();
  for (const target of targets) {
    const chatId = normalizeChatId(target.conversation.chatId);
    if (chatId !== null) chatIds.add(chatId);
  }
  return [...chatIds];
}
function hasUnscopedTarget(targets) {
  return targets.some((target) => normalizeChatId(target.conversation.chatId) === null);
}
function uniqueChatIds(chatIds) {
  return [...new Set(chatIds)];
}
function normalizeMessageGuid(value) {
  return value.trim().replace(/^p:\d+\//iu, "");
}
function enumerateMessageGuidCandidates(value) {
  const trimmed = value.trim();
  if (!trimmed) return [];
  return [trimmed, normalizeMessageGuid(trimmed)].filter(
    (candidate, index, candidates) =>
      candidate.length > 0 && candidates.indexOf(candidate) === index,
  );
}
function buildPendingTargetsByMessageId(targets) {
  const pendingByMessageId = /* @__PURE__ */ new Map();
  for (const target of targets)
    for (const candidate of enumerateMessageGuidCandidates(target.messageId))
      pendingByMessageId.set(candidate, target);
  return pendingByMessageId;
}
async function listRecentChatIds(client) {
  return (
    (await client.request("chats.list", { limit: RECENT_CHAT_LIMIT }, { timeoutMs: 1e4 })).chats ??
    []
  )
    .map((chat) => normalizeChatId(chat.id))
    .filter((chatId) => chatId !== null);
}
async function fetchRecentHistory(params) {
  return (
    (
      await params.client.request(
        "messages.history",
        {
          chat_id: params.chatId,
          limit: PER_CHAT_HISTORY_LIMIT,
        },
        { timeoutMs: 1e4 },
      )
    ).messages ?? []
  ).filter((message) => Boolean(message && typeof message === "object"));
}
function buildReactionPayload(params) {
  const emoji = params.reaction.emoji?.trim();
  const sender = params.reaction.sender?.trim();
  const targetGuid = params.targetMessage.guid?.trim();
  if (!emoji || !sender || !targetGuid) return null;
  const reactionId = normalizeChatId(params.reaction.id);
  return {
    ...(reactionId !== null ? { id: reactionId } : {}),
    guid: `reaction:${targetGuid}:${sender}:${emoji}:${params.reaction.created_at ?? ""}`,
    chat_id: params.targetMessage.chat_id,
    chat_guid: params.targetMessage.chat_guid,
    chat_identifier: params.targetMessage.chat_identifier,
    chat_name: params.targetMessage.chat_name,
    participants: params.targetMessage.participants,
    is_group: params.targetMessage.is_group,
    sender,
    destination_caller_id: params.targetMessage.destination_caller_id,
    is_from_me: params.reaction.is_from_me,
    text: `${params.reaction.type ?? "reaction"} "${params.targetMessage.text ?? ""}"`,
    created_at: params.reaction.created_at,
    is_reaction: true,
    is_tapback: true,
    associated_message_guid: targetGuid,
    associated_message_type: 2e3,
    reaction_type: params.reaction.type ?? void 0,
    reaction_emoji: emoji,
    is_reaction_add: true,
    reacted_to_guid: targetGuid,
  };
}
function buildConversationKeyFromMessage(message) {
  return {
    ...(message.chat_guid?.trim() ? { chatGuid: message.chat_guid.trim() } : {}),
    ...(message.chat_identifier?.trim() ? { chatIdentifier: message.chat_identifier.trim() } : {}),
    ...(normalizeChatId(message.chat_id) !== null ? { chatId: message.chat_id } : {}),
  };
}
function bindObservedConversation(params) {
  const nowMs = asDateTimestampMs(Date.now());
  const expiresAtMs = asDateTimestampMs(params.target.expiresAtMs);
  if (nowMs === void 0 || expiresAtMs === void 0 || expiresAtMs <= nowMs) return;
  const ttlMs = expiresAtMs - nowMs;
  const conversation = buildConversationKeyFromMessage(params.message);
  const messageIds = /* @__PURE__ */ new Set([
    ...enumerateMessageGuidCandidates(params.target.messageId),
    ...enumerateMessageGuidCandidates(params.message.guid ?? ""),
  ]);
  for (const messageId of messageIds)
    registerIMessageApprovalReactionTarget({
      accountId: params.target.accountId,
      conversation,
      messageId,
      approvalId: params.target.approvalId,
      approvalKind: params.target.approvalKind,
      allowedDecisions: params.target.allowedDecisions,
      ttlMs,
    });
}
function bindObservedApprovalPrompt(params) {
  if (params.message.is_from_me !== true) return null;
  const messageId = params.message.guid?.trim();
  if (!messageId) return null;
  const binding = extractIMessageApprovalPromptBinding(params.message.text ?? "");
  if (!binding) return null;
  const conversation = buildConversationKeyFromMessage(params.message);
  const expiresAtMs = resolveExpiresAtMsFromDurationMs(OBSERVED_APPROVAL_PROMPT_TARGET_TTL_MS);
  if (expiresAtMs === void 0) return null;
  const target = {
    accountId: params.accountId,
    conversation,
    messageId,
    approvalId: binding.approvalId,
    approvalKind: binding.approvalKind,
    allowedDecisions: binding.allowedDecisions,
    expiresAtMs,
  };
  bindObservedConversation({
    target,
    message: params.message,
  });
  return target;
}
async function pollPendingIMessageApprovalReactions(params) {
  const targets = listPendingIMessageApprovalReactionPollTargets({ accountId: params.accountId });
  const shouldAttemptNoTargetDiscovery =
    targets.length === 0 &&
    params.allowRecentChatDiscovery === true &&
    !accountIdsWithCompletedNoTargetDiscovery.has(params.accountId);
  if (targets.length === 0 && !shouldAttemptNoTargetDiscovery) return;
  const pendingByMessageId = buildPendingTargetsByMessageId(targets);
  const explicitChatIds = listTargetChatIds(targets);
  const chatIds =
    params.allowRecentChatDiscovery === true && (targets.length === 0 || hasUnscopedTarget(targets))
      ? uniqueChatIds([...explicitChatIds, ...(await listRecentChatIds(params.client))])
      : explicitChatIds;
  if (chatIds.length === 0) {
    if (shouldAttemptNoTargetDiscovery)
      accountIdsWithCompletedNoTargetDiscovery.add(params.accountId);
    return;
  }
  let hadHistoryFetchError = false;
  for (const chatId of chatIds) {
    let messages;
    try {
      messages = await fetchRecentHistory({
        client: params.client,
        chatId,
      });
    } catch (err) {
      hadHistoryFetchError = true;
      params.logVerboseMessage?.(
        `imessage: approval reaction poll skipped chat_id=${chatId}: ${String(err)}`,
      );
      continue;
    }
    for (const message of messages) {
      const targetGuid = message.guid?.trim();
      if (!targetGuid) continue;
      const target =
        pendingByMessageId.get(targetGuid) ??
        pendingByMessageId.get(normalizeMessageGuid(targetGuid)) ??
        bindObservedApprovalPrompt({
          accountId: params.accountId,
          message,
        });
      if (!target) continue;
      bindObservedConversation({
        target,
        message,
      });
      for (const reaction of message.reactions ?? []) {
        const reactionPayload = buildReactionPayload({
          targetMessage: message,
          reaction,
        });
        if (!reactionPayload) continue;
        const handled = await handleIMessageApprovalReaction({
          cfg: params.cfg,
          accountId: params.accountId,
          message: reactionPayload,
          bodyText: reactionPayload.text ?? "",
          logVerboseMessage: params.logVerboseMessage,
        });
        if (handled.stopPolling) {
          if (shouldAttemptNoTargetDiscovery && handled.stopPollingReason !== "resolver-error")
            break;
          return;
        }
      }
    }
  }
  if (shouldAttemptNoTargetDiscovery && !hadHistoryFetchError)
    accountIdsWithCompletedNoTargetDiscovery.add(params.accountId);
}
//#endregion
//#region extensions/imessage/src/chat.ts
function buildChatTargetParams(to, opts) {
  const cfg = requireRuntimeConfig(opts.cfg, "iMessage chat action");
  const account =
    opts.account ??
    resolveIMessageAccount({
      cfg,
      accountId: opts.accountId,
    });
  const target = parseIMessageTarget(opts.chatId ? formatIMessageChatTarget(opts.chatId) : to);
  const params = {};
  if (target.kind === "chat_id") params.chat_id = target.chatId;
  else if (target.kind === "chat_guid") params.chat_guid = target.chatGuid;
  else if (target.kind === "chat_identifier") params.chat_identifier = target.chatIdentifier;
  else params.to = target.to;
  return {
    params,
    service:
      opts.service ??
      (target.kind === "handle" ? target.service : void 0) ??
      account.config.service,
    region: opts.region?.trim() || account.config.region?.trim() || "US",
    account,
  };
}
async function runChatAction(method, params, opts) {
  const cfg = requireRuntimeConfig(opts.cfg, "iMessage chat action");
  const account =
    opts.account ??
    resolveIMessageAccount({
      cfg,
      accountId: opts.accountId,
    });
  const cliPath = opts.cliPath?.trim() || account.config.cliPath?.trim() || "imsg";
  const dbPath = opts.dbPath?.trim() || account.config.dbPath?.trim();
  const client =
    opts.client ??
    (await createIMessageRpcClient({
      cliPath,
      dbPath,
    }));
  const shouldClose = !opts.client;
  try {
    return await client.request(method, params, { timeoutMs: opts.timeoutMs });
  } finally {
    if (shouldClose) await client.stop();
  }
}
async function sendIMessageTyping(to, isTyping, opts) {
  const { params, service } = buildChatTargetParams(to, opts);
  params.typing = isTyping;
  if (service) params.service = service;
  await runChatAction("typing", params, opts);
}
async function markIMessageChatRead(to, opts) {
  const { params } = buildChatTargetParams(to, opts);
  await runChatAction("read", params, opts);
}
//#endregion
//#region extensions/imessage/src/monitor/abort-handler.ts
function attachIMessageMonitorAbortHandler(params) {
  const abort = params.abortSignal;
  if (!abort) return () => {};
  const onAbort = () => {
    const subscriptionId = params.getSubscriptionId();
    if (subscriptionId)
      params.client.request("watch.unsubscribe", { subscription: subscriptionId }).catch(() => {});
    params.client.stop().catch(() => {});
  };
  abort.addEventListener("abort", onAbort, { once: true });
  return () => abort.removeEventListener("abort", onAbort);
}
//#endregion
//#region extensions/imessage/src/monitor/strip-imsg-length-prefixed-text.ts
const utf8Decoder = new TextDecoder();
function readVarint(buf, start) {
  let offset = start;
  let value = 0;
  let shift = 0;
  while (offset < buf.length && shift <= 28) {
    const byte = buf[offset];
    if (byte === void 0) return null;
    offset += 1;
    value |= (byte & 127) << shift;
    if ((byte & 128) === 0)
      return {
        nextOffset: offset,
        value,
      };
    shift += 7;
  }
  return null;
}
function tryStripImessageLengthPrefixedUtf8Buffer(buf) {
  const key = readVarint(buf, 0);
  if (!key || key.nextOffset >= buf.length) return null;
  if (key.value !== 10) return null;
  const length = readVarint(buf, key.nextOffset);
  if (!length || length.value === 0) return null;
  if (length.nextOffset + length.value !== buf.length) return null;
  return buf.subarray(length.nextOffset, buf.length);
}
function stripImessageLengthPrefixedUtf8Text(text) {
  if (!text) return text;
  const stripped = tryStripImessageLengthPrefixedUtf8Buffer(Buffer.from(text, "utf8"));
  if (!stripped) return text;
  const inner = utf8Decoder.decode(stripped);
  return inner.length > 0 ? inner : text;
}
//#endregion
//#region extensions/imessage/src/monitor/parse-notification.ts
function isOptionalString(value) {
  return value === void 0 || value === null || typeof value === "string";
}
function isOptionalStringOrNumber(value) {
  return (
    value === void 0 || value === null || typeof value === "string" || typeof value === "number"
  );
}
function isOptionalNumber(value) {
  return value === void 0 || value === null || typeof value === "number";
}
function isOptionalBoolean(value) {
  return value === void 0 || value === null || typeof value === "boolean";
}
function isOptionalStringArray(value) {
  return (
    value === void 0 ||
    value === null ||
    (Array.isArray(value) && value.every((entry) => typeof entry === "string"))
  );
}
function isOptionalAttachments(value) {
  if (value === void 0 || value === null) return true;
  if (!Array.isArray(value)) return false;
  return value.every((attachment) => {
    if (!isRecord(attachment)) return false;
    return (
      isOptionalString(attachment.original_path) &&
      isOptionalString(attachment.mime_type) &&
      isOptionalBoolean(attachment.missing) &&
      isOptionalString(attachment.transfer_name) &&
      isOptionalString(attachment.uti)
    );
  });
}
function parseIMessageNotification(raw) {
  if (!isRecord(raw)) return null;
  const maybeMessage = raw.message;
  if (!isRecord(maybeMessage)) return null;
  const message = maybeMessage;
  if (
    !isOptionalNumber(message.id) ||
    !isOptionalString(message.guid) ||
    !isOptionalNumber(message.chat_id) ||
    !isOptionalString(message.sender) ||
    !isOptionalString(message.destination_caller_id) ||
    !isOptionalString(message.balloon_bundle_id) ||
    !isOptionalBoolean(message.is_from_me) ||
    !isOptionalString(message.text) ||
    !isOptionalStringOrNumber(message.reply_to_id) ||
    !isOptionalString(message.reply_to_guid) ||
    !isOptionalString(message.reply_to_text) ||
    !isOptionalString(message.reply_to_sender) ||
    !isOptionalString(message.created_at) ||
    !isOptionalBoolean(message.is_reaction) ||
    !isOptionalBoolean(message.is_tapback) ||
    !isOptionalString(message.associated_message_guid) ||
    !isOptionalNumber(message.associated_message_type) ||
    !isOptionalString(message.reaction_type) ||
    !isOptionalString(message.reaction_emoji) ||
    !isOptionalBoolean(message.is_reaction_add) ||
    !isOptionalString(message.reacted_to_guid) ||
    !isOptionalAttachments(message.attachments) ||
    !isOptionalString(message.chat_identifier) ||
    !isOptionalString(message.chat_guid) ||
    !isOptionalString(message.chat_name) ||
    !isOptionalStringArray(message.participants) ||
    !isOptionalBoolean(message.is_group)
  )
    return null;
  return {
    ...message,
    text:
      typeof message.text === "string"
        ? stripImessageLengthPrefixedUtf8Text(message.text)
        : message.text,
    reply_to_text:
      typeof message.reply_to_text === "string"
        ? stripImessageLengthPrefixedUtf8Text(message.reply_to_text)
        : message.reply_to_text,
  };
}
//#endregion
//#region extensions/imessage/src/monitor/catchup-bridge.ts
const PER_CHAT_HISTORY_LIMIT_CAP = 500;
const CATCHUP_CHATS_LIST_LIMIT = 200;
const CATCHUP_RPC_TIMEOUT_MS = 3e4;
/**
 * Wire `performIMessageCatchup` against the live `imsg` JSON-RPC client.
 *
 * Catchup recovers messages that landed in `chat.db` while the gateway was
 * offline (crash, restart, mac sleep) by:
 *   1. listing recently-active chats via `chats.list`,
 *   2. fetching per-chat history since the cursor via `messages.history`,
 *   3. sorting cross-chat by `rowid`, capping at `perRunLimit`,
 *   4. replaying each row through the same `dispatchPayload` handler used
 *      by the live notification loop, so existing dedupe / coalesce / echo
 *      / read-receipt behavior covers replayed rows for free.
 *
 * Runs at most once per `monitorIMessageProvider` invocation, between
 * `watch.subscribe` and the live dispatch loop. Anything that arrives during
 * catchup itself flows through live dispatch; the existing inbound-dedupe
 * cache absorbs any overlap.
 */
async function runIMessageCatchup(params) {
  const { client, accountId, config, includeAttachments, dispatchPayload, runtime } = params;
  const log = (msg) => runtime?.log?.(msg);
  const warnLog = (msg) => runtime?.log?.(warn(msg));
  const payloadByGuid = /* @__PURE__ */ new Map();
  const fetchFn = async ({ sinceMs, sinceRowid, limit }) => {
    const sinceISO = timestampMsToIsoString(sinceMs);
    if (!sinceISO) {
      warnLog(`imessage catchup: invalid since timestamp ${sinceMs}`);
      return {
        resolved: false,
        rows: [],
      };
    }
    let chatsResult;
    try {
      chatsResult = await client.request(
        "chats.list",
        { limit: CATCHUP_CHATS_LIST_LIMIT },
        { timeoutMs: CATCHUP_RPC_TIMEOUT_MS },
      );
    } catch (err) {
      warnLog(`imessage catchup: chats.list failed: ${String(err)}`);
      return {
        resolved: false,
        rows: [],
      };
    }
    const chats = chatsResult?.chats ?? [];
    const collected = [];
    const perChatLimit = Math.min(limit, PER_CHAT_HISTORY_LIMIT_CAP);
    let historyFetchFailed = false;
    let rawWatermarkRowid = -Infinity;
    let rawWatermarkMs = -Infinity;
    for (const chat of chats) {
      const chatId = typeof chat.id === "number" && Number.isFinite(chat.id) ? chat.id : null;
      if (chatId === null) continue;
      const lastMs =
        typeof chat.last_message_at === "string" ? Date.parse(chat.last_message_at) : NaN;
      if (Number.isFinite(lastMs) && lastMs < sinceMs) continue;
      let historyResult;
      try {
        historyResult = await client.request(
          "messages.history",
          {
            chat_id: chatId,
            limit: perChatLimit,
            start: sinceISO,
            attachments: includeAttachments,
          },
          { timeoutMs: CATCHUP_RPC_TIMEOUT_MS },
        );
      } catch (err) {
        historyFetchFailed = true;
        warnLog(`imessage catchup: messages.history failed for chat_id=${chatId}: ${String(err)}`);
        continue;
      }
      const messages = Array.isArray(historyResult?.messages) ? historyResult.messages : [];
      for (const raw of messages) {
        const rawRecord = raw && typeof raw === "object" ? raw : null;
        const rawRowid =
          rawRecord && typeof rawRecord.id === "number" && Number.isFinite(rawRecord.id)
            ? rawRecord.id
            : null;
        const rawCreatedAt =
          rawRecord && typeof rawRecord.created_at === "string" ? rawRecord.created_at : null;
        const rawDateMs = rawCreatedAt ? Date.parse(rawCreatedAt) : NaN;
        if (rawRowid !== null) rawWatermarkRowid = Math.max(rawWatermarkRowid, rawRowid);
        if (Number.isFinite(rawDateMs)) rawWatermarkMs = Math.max(rawWatermarkMs, rawDateMs);
        const payload = parseIMessageNotification({ message: raw });
        if (!payload) continue;
        const guid = payload.guid?.trim();
        const rowid = typeof payload.id === "number" ? payload.id : null;
        const dateMs =
          typeof payload.created_at === "string" ? Date.parse(payload.created_at) : NaN;
        if (!guid || rowid === null || !Number.isFinite(rowid) || !Number.isFinite(dateMs))
          continue;
        if (rowid <= sinceRowid) continue;
        collected.push({
          guid,
          rowid,
          date: dateMs,
          isFromMe: payload.is_from_me === true,
        });
        payloadByGuid.set(guid, payload);
      }
    }
    const sorted = collected.toSorted((a, b) => a.rowid - b.rowid);
    const capped = sorted.slice(0, limit);
    const isCapTruncated = capped.length < sorted.length;
    if (isCapTruncated) {
      warnLog(
        `imessage catchup: fetched ${sorted.length} rows across chats, capped to perRunLimit=${limit} (oldest first); next startup picks up the rest`,
      );
      const keep = new Set(capped.map((row) => row.guid));
      for (const guid of payloadByGuid.keys()) if (!keep.has(guid)) payloadByGuid.delete(guid);
    }
    let effectiveWatermarkRowid = rawWatermarkRowid;
    let effectiveWatermarkMs = rawWatermarkMs;
    if (isCapTruncated && capped.length > 0) {
      const last = capped.at(-1);
      if (last) {
        effectiveWatermarkRowid = Math.min(effectiveWatermarkRowid, last.rowid);
        effectiveWatermarkMs = Math.min(effectiveWatermarkMs, last.date);
      }
    } else if (isCapTruncated && capped.length === 0) {
      effectiveWatermarkRowid = NaN;
      effectiveWatermarkMs = NaN;
    }
    return {
      resolved: true,
      rows: capped,
      fullyCaughtUp: !historyFetchFailed && !isCapTruncated,
      ...(Number.isFinite(effectiveWatermarkRowid)
        ? { highWatermarkRowid: effectiveWatermarkRowid }
        : {}),
      ...(Number.isFinite(effectiveWatermarkMs) ? { highWatermarkMs: effectiveWatermarkMs } : {}),
    };
  };
  const dispatchFn = async (row) => {
    const payload = payloadByGuid.get(row.guid);
    if (!payload) {
      warnLog(`imessage catchup: missing payload for guid=${row.guid}, skipping`);
      return { ok: false };
    }
    try {
      await dispatchPayload(payload);
      return { ok: true };
    } catch (err) {
      warnLog(`imessage catchup: dispatch threw for guid=${row.guid}: ${String(err)}`);
      return { ok: false };
    }
  };
  return await performIMessageCatchup({
    accountId,
    config,
    fetch: fetchFn,
    dispatch: dispatchFn,
    observeSkippedFromMe: async (row) => {
      const payload = payloadByGuid.get(row.guid);
      if (!payload) {
        warnLog(`imessage catchup: missing skipped from-me payload for guid=${row.guid}`);
        return;
      }
      await params.observeSkippedFromMePayload?.(payload);
    },
    log,
    warn: warnLog,
    ...(params.now ? { now: params.now() } : {}),
  });
}
//#endregion
//#region extensions/imessage/src/monitor/coalesce.ts
/**
 * Bounds on the merged output when multiple inbound iMessage payloads are
 * folded into one agent turn. Caps each merge so a sender who
 * rapid-fires DMs inside the debounce window cannot amplify the downstream
 * prompt past a safe ceiling. Every source GUID still surfaces via
 * `coalescedMessageGuids` so a future replay path can recognize duplicates.
 */
const MAX_COALESCED_TEXT_CHARS = 4e3;
const MAX_COALESCED_ATTACHMENTS = 20;
const MAX_COALESCED_ENTRIES = 10;
const IMESSAGE_URL_BALLOON_BUNDLE_ID = "com.apple.messages.URLBalloonProvider";
function hasIMessageUrlBalloonBundleID(payload) {
  return payload.balloon_bundle_id === IMESSAGE_URL_BALLOON_BUNDLE_ID;
}
function isSingleUrlToken(text) {
  if (/\s/.test(text)) return false;
  if (/^www\.[^\s.]+\.[^\s]+$/i.test(text)) return true;
  try {
    const url = new URL(text);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
function isStandaloneIMessageUrlPreviewPayload(payload) {
  if (!hasIMessageUrlBalloonBundleID(payload)) return false;
  const text = (payload.text ?? "").trim();
  return text.length === 0 || isSingleUrlToken(text);
}
function hasIMessageBalloonMetadata(payload) {
  return typeof payload.balloon_bundle_id === "string" && payload.balloon_bundle_id.length > 0;
}
/**
 * Decide whether a debounced same-sender iMessage bucket should merge.
 *
 * URL-preview rows are merged with their preceding command row so Apple's
 * command+URL split-send still reaches the agent as one turn. Once a bridge
 * session has emitted balloon metadata, ordinary same-sender DMs without the
 * URL marker flush separately instead of being collapsed.
 */
function shouldCombineIMessagePayloadBucket(payloads, buildEmitsBalloonMetadata) {
  if (payloads.some(hasIMessageUrlBalloonBundleID)) return true;
  if (buildEmitsBalloonMetadata || payloads.some(hasIMessageBalloonMetadata)) return false;
  return true;
}
/**
 * Combine consecutive same-sender iMessage payloads into a single payload for
 * downstream dispatch. Used for Apple's URL-preview split-send, and for the
 * general inbound debounce (`messages.inbound`, off by default) when configured.
 *
 * The first payload anchors the merged shape (preserving its GUID for reply
 * threading). Text is concatenated with deduplication, attachments are merged
 * (capped), and the latest `created_at` wins so downstream sees the most
 * recent activity timestamp.
 */
function combineIMessagePayloads(payloads) {
  if (payloads.length === 0)
    throw new Error("combineIMessagePayloads: cannot combine empty payloads");
  const first = expectDefined(payloads[0], "first iMessage payload to coalesce");
  if (payloads.length === 1) return first;
  const last = expectDefined(payloads.at(-1), "last iMessage payload to coalesce");
  const boundedPayloads =
    payloads.length > MAX_COALESCED_ENTRIES
      ? [...payloads.slice(0, MAX_COALESCED_ENTRIES - 1), last]
      : payloads;
  const seenTexts = /* @__PURE__ */ new Set();
  const textParts = [];
  for (const payload of boundedPayloads) {
    const text = (payload.text ?? "").trim();
    if (!text) continue;
    const normalized = text.toLowerCase();
    if (seenTexts.has(normalized)) continue;
    seenTexts.add(normalized);
    textParts.push(text);
  }
  let combinedText = textParts.join(" ");
  if (combinedText.length > MAX_COALESCED_TEXT_CHARS)
    combinedText = `${sliceUtf16Safe(combinedText, 0, MAX_COALESCED_TEXT_CHARS)}…[truncated]`;
  const allAttachments = boundedPayloads
    .flatMap((p) => p.attachments ?? [])
    .slice(0, MAX_COALESCED_ATTACHMENTS);
  const createdAts = payloads
    .map((p) => p.created_at)
    .filter((c) => typeof c === "string" && c.length > 0);
  const latestCreatedAt =
    createdAts.length > 0 ? createdAts.reduce((a, b) => (a > b ? a : b)) : first.created_at;
  let maxRowid = -Infinity;
  let maxDateMs = -Infinity;
  for (const payload of payloads) {
    if (typeof payload.id === "number" && Number.isFinite(payload.id))
      maxRowid = Math.max(maxRowid, payload.id);
    const dateMs = typeof payload.created_at === "string" ? Date.parse(payload.created_at) : NaN;
    if (Number.isFinite(dateMs)) maxDateMs = Math.max(maxDateMs, dateMs);
  }
  const seenGuids = /* @__PURE__ */ new Set();
  const coalescedMessageGuids = [];
  for (const payload of payloads) {
    const guid = payload.guid?.trim();
    if (!guid || seenGuids.has(guid)) continue;
    seenGuids.add(guid);
    coalescedMessageGuids.push(guid);
  }
  const entryWithReply = payloads.find((p) => p.reply_to_id != null);
  return {
    ...first,
    text: combinedText,
    attachments: allAttachments.length > 0 ? allAttachments : null,
    created_at: latestCreatedAt,
    reply_to_id: entryWithReply?.reply_to_id ?? first.reply_to_id ?? null,
    reply_to_text: entryWithReply?.reply_to_text ?? first.reply_to_text ?? null,
    reply_to_sender: entryWithReply?.reply_to_sender ?? first.reply_to_sender ?? null,
    coalescedMessageGuids: coalescedMessageGuids.length > 0 ? coalescedMessageGuids : void 0,
    coalescedCatchupCursor:
      Number.isFinite(maxRowid) && Number.isFinite(maxDateMs)
        ? {
            lastSeenMs: maxDateMs,
            lastSeenRowid: maxRowid,
          }
        : void 0,
  };
}
//#endregion
//#region extensions/imessage/src/monitor/conversation-repair.ts
const DEFAULT_CHATS_LIMIT = 20;
const DEFAULT_PER_CHAT_HISTORY_LIMIT = 50;
const DEFAULT_RPC_TIMEOUT_MS = 5e3;
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}
function hasPositiveChatId(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}
function isExplicitEmptyString(value) {
  return typeof value === "string" && value.trim() === "";
}
function hasUsableConversationAnchor(projection) {
  return (
    hasPositiveChatId(projection.chat_id) ||
    isNonEmptyString(projection.chat_guid) ||
    isNonEmptyString(projection.chat_identifier)
  );
}
function isIMessageAnchorless(message) {
  if (
    hasPositiveChatId(message.chat_id) ||
    isNonEmptyString(message.chat_guid) ||
    isNonEmptyString(message.chat_identifier)
  )
    return false;
  return (
    message.chat_id === null ||
    (typeof message.chat_id === "number" &&
      (!Number.isFinite(message.chat_id) || message.chat_id <= 0)) ||
    isExplicitEmptyString(message.chat_guid) ||
    isExplicitEmptyString(message.chat_identifier)
  );
}
function extractAuthoritativeRecoveryProjection(entry) {
  if (typeof entry.is_group !== "boolean" || typeof entry.is_from_me !== "boolean") return null;
  if (!isNonEmptyString(entry.sender)) return null;
  const projection = {
    sender: entry.sender.trim(),
    is_from_me: entry.is_from_me,
    is_group: entry.is_group,
  };
  if (isNonEmptyString(entry.destination_caller_id))
    projection.destination_caller_id = entry.destination_caller_id.trim();
  if (hasPositiveChatId(entry.chat_id)) projection.chat_id = entry.chat_id;
  if (isNonEmptyString(entry.chat_guid)) projection.chat_guid = entry.chat_guid;
  if (isNonEmptyString(entry.chat_identifier)) projection.chat_identifier = entry.chat_identifier;
  if (typeof entry.chat_name === "string") projection.chat_name = entry.chat_name;
  if (
    Array.isArray(entry.participants) &&
    entry.participants.every((participant) => typeof participant === "string")
  )
    projection.participants = entry.participants;
  return hasUsableConversationAnchor(projection) ? projection : null;
}
function projectionConflictKey(projection) {
  return JSON.stringify({
    chat_id: projection.chat_id ?? null,
    chat_guid: projection.chat_guid ?? null,
    chat_identifier: projection.chat_identifier ?? null,
    is_group: projection.is_group,
    sender: projection.sender,
    destination_caller_id: projection.destination_caller_id ?? null,
    is_from_me: projection.is_from_me,
  });
}
function applyAuthoritativeRecoveryProjection(message, projection) {
  return {
    ...message,
    ...(projection.chat_id !== void 0 ? { chat_id: projection.chat_id } : {}),
    ...(projection.chat_guid !== void 0 ? { chat_guid: projection.chat_guid } : {}),
    ...(projection.chat_identifier !== void 0
      ? { chat_identifier: projection.chat_identifier }
      : {}),
    ...(projection.chat_name !== void 0 ? { chat_name: projection.chat_name } : {}),
    ...(projection.participants !== void 0 ? { participants: projection.participants } : {}),
    is_group: projection.is_group,
    sender: projection.sender,
    destination_caller_id: projection.destination_caller_id ?? null,
    is_from_me: projection.is_from_me,
  };
}
async function repairIMessageConversationAnchor(params) {
  const { client, message, runtime } = params;
  if (!isIMessageAnchorless(message)) return message;
  const guid = message.guid?.trim();
  if (!guid) {
    runtime?.error?.("imessage: dropping anchorless message without GUID");
    return null;
  }
  let chatsResult;
  try {
    chatsResult = await client.request(
      "chats.list",
      { limit: params.chatsLimit ?? DEFAULT_CHATS_LIMIT },
      { timeoutMs: params.rpcTimeoutMs ?? DEFAULT_RPC_TIMEOUT_MS },
    );
  } catch (err) {
    runtime?.error?.(`imessage: anchorless message recovery failed listing chats: ${String(err)}`);
    return null;
  }
  const matchedProjections = [];
  const chats = chatsResult?.chats ?? [];
  for (const chat of chats) {
    const chatId = hasPositiveChatId(chat.id) ? chat.id : null;
    if (chatId === null) continue;
    let historyResult;
    try {
      historyResult = await client.request(
        "messages.history",
        {
          attachments: false,
          chat_id: chatId,
          limit: params.perChatHistoryLimit ?? DEFAULT_PER_CHAT_HISTORY_LIMIT,
        },
        { timeoutMs: params.rpcTimeoutMs ?? DEFAULT_RPC_TIMEOUT_MS },
      );
    } catch {
      continue;
    }
    const messages = Array.isArray(historyResult?.messages) ? historyResult.messages : [];
    for (const raw of messages) {
      if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
      const entry = raw;
      if (entry.guid !== guid) continue;
      const projection = extractAuthoritativeRecoveryProjection(entry);
      if (!projection) {
        runtime?.error?.(
          `imessage: dropping anchorless message GUID=${guid}; exact-GUID history row is incomplete`,
        );
        return null;
      }
      matchedProjections.push(projection);
    }
  }
  const [projection] = matchedProjections;
  if (!projection) {
    runtime?.error?.(`imessage: dropping anchorless message GUID=${guid}; no recent chat matched`);
    return null;
  }
  if (new Set(matchedProjections.map(projectionConflictKey)).size > 1) {
    runtime?.error?.(
      `imessage: dropping anchorless message GUID=${guid}; conflicting exact-GUID history projections`,
    );
    return null;
  }
  if (projection.is_from_me) {
    runtime?.error?.(
      `imessage: dropping anchorless message GUID=${guid}; recovered authoritative row is from-me`,
    );
    return null;
  }
  const repaired = applyAuthoritativeRecoveryProjection(message, projection);
  if (isIMessageAnchorless(repaired)) {
    runtime?.error?.(
      `imessage: dropping anchorless message GUID=${guid} after recovery found no usable conversation anchor`,
    );
    return null;
  }
  runtime?.log?.(
    `imessage: recovered anchorless message GUID=${guid} chat_id=${repaired.chat_id ?? "unknown"} is_group=${repaired.is_group === true}`,
  );
  return repaired;
}
//#endregion
//#region extensions/imessage/src/monitor/deliver.ts
async function deliverReplies(params) {
  const { replies, target, runtime, maxBytes, textLimit, accountId, sentMessageCache } = params;
  const scope = `${accountId ?? ""}:${target}`;
  const { cfg } = params;
  const tableMode = resolveMarkdownTableMode({
    cfg,
    channel: "imessage",
    accountId,
  });
  const chunkMode = resolveChunkMode(cfg, "imessage", accountId);
  for (const payload of replies)
    if (
      (await deliverTextOrMediaReply({
        payload,
        text: resolveSendableOutboundReplyParts(payload, {
          text: convertMarkdownTables(sanitizeOutboundText(payload.text ?? ""), tableMode),
        }).text,
        chunkText: (value) => chunkTextWithMode(value, textLimit, chunkMode),
        sendText: async (chunk) => {
          const sent = await sendMessageIMessage(target, chunk, {
            config: params.cfg,
            maxBytes,
            accountId,
            replyToId: payload.replyToId,
          });
          sentMessageCache?.remember(scope, {
            text: sent.echoText ?? sent.sentText,
            messageId: sent.messageId,
          });
        },
        sendMedia: async ({ mediaUrl, caption }) => {
          const sent = await sendMessageIMessage(target, caption ?? "", {
            config: params.cfg,
            mediaUrl,
            maxBytes,
            accountId,
            replyToId: payload.replyToId,
          });
          sentMessageCache?.remember(scope, {
            text: sent.echoText ?? (sent.sentText || void 0),
            messageId: sent.messageId,
          });
        },
      })) !== "empty"
    )
      runtime.log?.(`imessage: delivered reply to ${target}`);
}
function createIMessageEchoCachingSend(params) {
  return async (target, text, opts) => {
    const sent = await sendMessageIMessage(target, sanitizeOutboundText(text), opts);
    const scope = `${params.accountId ?? opts.accountId ?? ""}:${target}`;
    params.sentMessageCache?.remember(scope, {
      text: sent.echoText ?? (sent.sentText || void 0),
      messageId: sent.messageId,
    });
    return sent;
  };
}
//#endregion
//#region extensions/imessage/src/monitor/dm-history.ts
const DM_HISTORY_RPC_TIMEOUT_MS = 1e4;
function resolveIMessageDmHistoryLimit(params) {
  const senderCandidates = [
    normalizeOptionalString(params.senderNormalized),
    normalizeOptionalString(params.sender),
    params.sender ? normalizeIMessageHandle(params.sender) : void 0,
  ].filter((candidate) => Boolean(candidate));
  for (const candidate of senderCandidates) {
    const override = params.config.dms?.[candidate]?.historyLimit;
    if (override !== void 0) return Math.max(0, override);
  }
  return Math.max(0, params.config.dmHistoryLimit ?? 0);
}
function historyRowSortValue(message) {
  if (typeof message.id === "number" && Number.isFinite(message.id)) return message.id;
  const createdAtMs = typeof message.created_at === "string" ? Date.parse(message.created_at) : NaN;
  return Number.isFinite(createdAtMs) ? createdAtMs : 0;
}
function isBeforeCurrentMessage(params) {
  const { message, currentMessage } = params;
  if (
    typeof message.id === "number" &&
    typeof currentMessage.id === "number" &&
    Number.isFinite(message.id) &&
    Number.isFinite(currentMessage.id)
  )
    return message.id < currentMessage.id;
  const guid = normalizeOptionalString(message.guid);
  const currentGuid = normalizeOptionalString(currentMessage.guid);
  if (guid && currentGuid) return guid !== currentGuid;
  return true;
}
function historyEntryFromMessage(message, fallbackSender) {
  const body = normalizeOptionalString(message.text);
  if (!body) return null;
  const timestamp = typeof message.created_at === "string" ? Date.parse(message.created_at) : NaN;
  return {
    sender:
      message.is_from_me === true
        ? "Me"
        : normalizeIMessageHandle(normalizeOptionalString(message.sender) ?? fallbackSender) ||
          fallbackSender,
    body,
    ...(Number.isFinite(timestamp) ? { timestamp } : {}),
  };
}
async function resolveIMessageDmHistoryContext(params) {
  const maxMessages = Math.max(0, Math.floor(params.limit));
  const chatId =
    typeof params.message.chat_id === "number" && Number.isFinite(params.message.chat_id)
      ? params.message.chat_id
      : void 0;
  if (maxMessages <= 0 || chatId === void 0) return {};
  let result;
  try {
    result = await params.client.request(
      "messages.history",
      {
        chat_id: chatId,
        limit: maxMessages + 1,
        attachments: false,
      },
      { timeoutMs: DM_HISTORY_RPC_TIMEOUT_MS },
    );
  } catch (err) {
    params.logVerbose?.(`imessage: DM history fetch failed for chat_id=${chatId}: ${String(err)}`);
    return {};
  }
  const history = (Array.isArray(result?.messages) ? result.messages : [])
    .map((row) => parseIMessageNotification({ message: row }))
    .filter((message) => Boolean(message))
    .filter((message) => message.is_group !== true)
    .filter((message) =>
      isBeforeCurrentMessage({
        message,
        currentMessage: params.message,
      }),
    )
    .toSorted((a, b) => historyRowSortValue(a) - historyRowSortValue(b))
    .map((message) => historyEntryFromMessage(message, params.senderNormalized))
    .filter((entry) => Boolean(entry))
    .slice(-maxMessages);
  if (history.length === 0) return {};
  return {
    inboundHistory: history,
    body: history
      .map((entry) =>
        formatInboundEnvelope({
          channel: "iMessage",
          from: entry.sender,
          timestamp: entry.timestamp,
          body: entry.body,
          chatType: "direct",
          senderLabel: entry.sender,
          envelope: params.envelopeOptions,
        }),
      )
      .join("\n\n"),
  };
}
//#endregion
//#region extensions/imessage/src/monitor/echo-cache.ts
const SENT_MESSAGE_TEXT_TTL_MS = 4e3;
const SENT_MESSAGE_ID_TTL_MS = 6e4;
function normalizeEchoTextKey(text) {
  if (!text) return null;
  const normalized = stripLeadingEchoTextCorruptionMarkers(
    text.replace(/\r\n?/g, "\n").trim(),
  ).trim();
  return normalized ? normalized : null;
}
function normalizeEchoMessageIdKey(messageId) {
  if (!messageId) return null;
  const normalized = messageId.trim();
  if (!normalized || normalized === "ok" || normalized === "unknown") return null;
  return normalized;
}
var DefaultSentMessageCache = class {
  constructor() {
    this.textCache = /* @__PURE__ */ new Map();
    this.textBackedByIdCache = /* @__PURE__ */ new Map();
    this.messageIdCache = /* @__PURE__ */ new Map();
  }
  remember(scope, lookup) {
    const textKey = normalizeEchoTextKey(lookup.text);
    if (textKey) this.textCache.set(`${scope}:${textKey}`, Date.now());
    const messageIdKey = normalizeEchoMessageIdKey(lookup.messageId);
    if (messageIdKey) {
      this.messageIdCache.set(`${scope}:${messageIdKey}`, Date.now());
      if (textKey) this.textBackedByIdCache.set(`${scope}:${textKey}`, Date.now());
    }
    this.cleanup();
  }
  has(scope, lookup, options = false) {
    this.cleanup();
    const resolvedOptions =
      typeof options === "boolean" ? { skipIdShortCircuit: options } : options;
    if (
      hasPersistedIMessageEcho({
        scope,
        ...lookup,
        includePendingText: resolvedOptions.includePendingText,
      })
    )
      return true;
    const textKey = normalizeEchoTextKey(lookup.text);
    const messageIdKey = normalizeEchoMessageIdKey(lookup.messageId);
    if (messageIdKey) {
      const idTimestamp = this.messageIdCache.get(`${scope}:${messageIdKey}`);
      if (idTimestamp && Date.now() - idTimestamp <= SENT_MESSAGE_ID_TTL_MS) return true;
      const textTimestamp = textKey ? this.textCache.get(`${scope}:${textKey}`) : void 0;
      const textBackedByIdTimestamp = textKey
        ? this.textBackedByIdCache.get(`${scope}:${textKey}`)
        : void 0;
      const hasTextOnlyMatch =
        typeof textTimestamp === "number" &&
        (!textBackedByIdTimestamp || textTimestamp > textBackedByIdTimestamp);
      if (!resolvedOptions.skipIdShortCircuit && !hasTextOnlyMatch) return false;
    }
    if (textKey) {
      const textTimestamp = this.textCache.get(`${scope}:${textKey}`);
      if (textTimestamp && Date.now() - textTimestamp <= SENT_MESSAGE_TEXT_TTL_MS) return true;
    }
    return false;
  }
  cleanup() {
    const now = Date.now();
    for (const [key, timestamp] of this.textCache.entries())
      if (now - timestamp > SENT_MESSAGE_TEXT_TTL_MS) this.textCache.delete(key);
    for (const [key, timestamp] of this.textBackedByIdCache.entries())
      if (now - timestamp > SENT_MESSAGE_TEXT_TTL_MS) this.textBackedByIdCache.delete(key);
    for (const [key, timestamp] of this.messageIdCache.entries())
      if (now - timestamp > SENT_MESSAGE_ID_TTL_MS) this.messageIdCache.delete(key);
  }
};
function createSentMessageCache() {
  return new DefaultSentMessageCache();
}
//#endregion
//#region extensions/imessage/src/monitor/group-allowlist-warnings.ts
const PER_CHAT_WARNING_CACHE_MAX_SIZE = 512;
const startupWarned = /* @__PURE__ */ new Set();
const perChatWarned = createDedupeCache({
  maxSize: PER_CHAT_WARNING_CACHE_MAX_SIZE,
  ttlMs: 0,
});
/**
 * Fires once per `accountId` at monitor startup when `groupPolicy === "allowlist"`
 * and the effective group sender allowlist is empty. The sender gate runs
 * before the group registry, so `channels.imessage.groups` entries cannot admit
 * traffic without a sender allowlist. A non-empty `groupAllowFrom` makes the
 * configuration potentially valid and suppresses this drop-all warning.
 */
function warnGroupAllowlistMisconfigOnce(params) {
  if (params.groupPolicy !== "allowlist") return false;
  if (params.hasGroupAllowFrom) return false;
  const key = `imessage:${params.accountId}`;
  if (startupWarned.has(key)) return false;
  startupWarned.add(key);
  params.log(
    `imessage: groupPolicy="allowlist" for account "${params.accountId}" but no group sender allowlist is configured (channels.imessage.groupAllowFrom, or its allowFrom fallback). Every inbound group message will be dropped. Set channels.imessage.groupAllowFrom (sender handles, chat targets like chat_id:<id>, or "*") to admit group senders, and optionally add channels.imessage.groups entries to scope which chats are allowed.`,
  );
  return true;
}
/**
 * Fires once per `accountId:chat_id` when the runtime allowlist gate drops a
 * group message because that chat_id is not in `channels.imessage.groups`.
 * Retains up to 512 recently active account/chat pairs; evicted chats may warn again.
 */
function warnGroupAllowlistDropPerChatOnce(params) {
  const chat = params.chatId == null ? "" : String(params.chatId).trim();
  if (!chat) return false;
  const key = `imessage:${params.accountId}:${chat}`;
  if (perChatWarned.check(key)) return false;
  params.log(
    `imessage: dropping group message from chat_id=${chat} (account "${params.accountId}") — not in channels.imessage.groups allowlist. Add channels.imessage.groups["${chat}"] or channels.imessage.groups["*"] to allow it.`,
  );
  return true;
}
//#endregion
//#region extensions/imessage/src/monitor/inbound-dedupe.ts
const IMESSAGE_INBOUND_DEDUPE_PLUGIN_ID = "imessage";
const IMESSAGE_INBOUND_DEDUPE_NAMESPACE_PREFIX = "imessage.inbound-dedupe";
const IMESSAGE_INBOUND_DEDUPE_TTL_MS = 14400 * 1e3;
const IMESSAGE_INBOUND_DEDUPE_MEMORY_MAX = 5e3;
const IMESSAGE_INBOUND_DEDUPE_STATE_MAX_ENTRIES = 1e4;
const IMESSAGE_STALE_INBOUND_THRESHOLD_MS = 900 * 1e3;
const IMESSAGE_RECOVERY_MAX_AGE_MS = 7200 * 1e3;
/**
 * Persistent inbound replay guard. Claimable (not a bare check/record) so the
 * claim is atomic: a duplicate emitted twice in a reconnect burst while the
 * first copy is still in flight is reported as a duplicate/inflight instead of
 * racing through. Persistent so a claim committed before a crash still blocks a
 * post-restart re-emit; release on dispatch failure lets a transient failure
 * retry instead of being permanently suppressed.
 */
function createIMessageInboundReplayGuard() {
  return createClaimableDedupe({
    pluginId: IMESSAGE_INBOUND_DEDUPE_PLUGIN_ID,
    namespacePrefix: IMESSAGE_INBOUND_DEDUPE_NAMESPACE_PREFIX,
    ttlMs: IMESSAGE_INBOUND_DEDUPE_TTL_MS,
    memoryMaxSize: IMESSAGE_INBOUND_DEDUPE_MEMORY_MAX,
    stateMaxEntries: IMESSAGE_INBOUND_DEDUPE_STATE_MAX_ENTRIES,
  });
}
/**
 * Claim a message before handling. Returns the key to commit/release later, and
 * `claimed=false` when a recent copy already owns the key (duplicate/inflight)
 * so the caller drops it. A message with no derivable key fails open (claimed,
 * key=null) so it is always handled and nothing to commit.
 */
async function claimIMessageInboundReplay(params) {
  const key = buildIMessageInboundReplayKey({
    accountId: params.accountId,
    message: params.message,
  });
  if (!key)
    return {
      claimed: true,
      key: null,
    };
  return {
    claimed: (await params.guard.claim(key, { namespace: params.accountId })).kind === "claimed",
    key,
  };
}
async function commitIMessageInboundReplay(params) {
  for (const key of new Set(params.keys))
    await params.guard.commit(key, { namespace: params.accountId });
}
function releaseIMessageInboundReplay(params) {
  for (const key of new Set(params.keys))
    params.guard.release(key, {
      namespace: params.accountId,
      error: params.error,
    });
}
/**
 * Stable replay key for an inbound message. Prefers the Apple GUID (globally
 * unique, survives chat.db rowid churn). Falls back to a composite of the
 * fields that identify a distinct send when no GUID is present, and returns
 * null when the message cannot be identified at all (fail open: never suppress
 * an unidentifiable message).
 */
function buildIMessageInboundReplayKey(params) {
  const { accountId, message } = params;
  const guid = message.guid?.trim();
  if (guid) return `${accountId}:guid:${guid}`;
  const sender = message.sender?.trim();
  const conversation =
    message.chat_id != null
      ? `chat:${message.chat_id}`
      : (message.chat_guid?.trim() ?? message.chat_identifier?.trim());
  const createdAt = message.created_at?.trim();
  if (!sender || !conversation || !createdAt) return null;
  const text = (message.text ?? "").trim();
  return `${accountId}:c:${createHash("sha256").update(`${conversation}\0${sender}\0${createdAt}\0${text}`).digest("hex").slice(0, 32)}`;
}
/**
 * Age fence: true when the message's own send date is materially older than
 * now, i.e. stale backlog rather than a live message. Fails open (returns
 * false) when the send date is missing or unparseable so an undateable message
 * is never suppressed on a timestamp we cannot read.
 */
function isStaleIMessageBacklog(message, nowMs, thresholdMs = IMESSAGE_STALE_INBOUND_THRESHOLD_MS) {
  const createdAt = message.created_at?.trim();
  if (!createdAt) return false;
  const sentMs = Date.parse(createdAt);
  if (!Number.isFinite(sentMs)) return false;
  return nowMs - sentMs > thresholdMs;
}
//#endregion
//#region extensions/imessage/src/conversation-route.ts
function resolveIMessageConversationRoute(params) {
  let route = resolveAgentRoute({
    cfg: params.cfg,
    channel: "imessage",
    accountId: params.accountId,
    peer: {
      kind: params.isGroup ? "group" : "direct",
      id: params.peerId,
    },
  });
  const conversationId = resolveIMessageInboundConversationId({
    isGroup: params.isGroup,
    sender: params.sender,
    chatId: params.chatId,
  });
  if (!conversationId) return route;
  route = resolveConfiguredBindingRoute({
    cfg: params.cfg,
    route,
    conversation: {
      channel: "imessage",
      accountId: params.accountId,
      conversationId,
    },
  }).route;
  const runtimeRoute = resolveRuntimeConversationBindingRoute({
    route,
    conversation: {
      channel: "imessage",
      accountId: params.accountId,
      conversationId,
    },
  });
  route = runtimeRoute.route;
  if (runtimeRoute.bindingRecord && !runtimeRoute.boundSessionKey)
    logVerbose(`imessage: plugin-bound conversation ${conversationId}`);
  else if (runtimeRoute.boundSessionKey)
    logVerbose(
      `imessage: routed via bound conversation ${conversationId} -> ${runtimeRoute.boundSessionKey}`,
    );
  return route;
}
//#endregion
//#region extensions/imessage/src/monitor/reflection-guard.ts
const REFLECTION_PATTERNS = [
  {
    re: /(?:#\+){2,}#?/,
    label: "internal-separator",
  },
  {
    re: /\bassistant\s+to\s*=\s*\w+/i,
    label: "assistant-role-marker",
  },
  {
    re: /<\s*\/?\s*(?:(?:antml:|mm:)?(?:think(?:ing)?|thought)|antthinking)\b[^<>]*>/i,
    label: "thinking-tag",
  },
  {
    re: /<\s*\/?\s*relevant[-_]memories\b[^<>]*>/i,
    label: "relevant-memories-tag",
  },
  {
    re: /<\s*\/?\s*final\b[^<>]*>/i,
    label: "final-tag",
  },
  {
    re: /\bACP error\s*\(\s*ACP_[A-Z0-9_]+\s*\):/i,
    label: "acp-error",
  },
  {
    re: /\bMissing API key for\b.+\bon the gateway\b/i,
    label: "gateway-missing-api-key",
  },
];
function hasMatchOutsideCode(text, re) {
  const codeRegions = findCodeRegions(text);
  const globalRe = new RegExp(re.source, re.flags.includes("g") ? re.flags : `${re.flags}g`);
  for (const match of text.matchAll(globalRe)) {
    const start = match.index ?? -1;
    if (start >= 0 && !isInsideCode(start, codeRegions)) return true;
  }
  return false;
}
/**
 * Check whether an inbound message appears to be a reflection of
 * assistant-originated content. Returns matched pattern labels for telemetry.
 */
function detectReflectedContent(text) {
  if (!text)
    return {
      isReflection: false,
      matchedLabels: [],
    };
  const matchedLabels = [];
  for (const { re, label } of REFLECTION_PATTERNS)
    if (hasMatchOutsideCode(text, re)) matchedLabels.push(label);
  return {
    isReflection: matchedLabels.length > 0,
    matchedLabels,
  };
}
//#endregion
//#region extensions/imessage/src/monitor/inbound-processing.ts
const normalizeNonEmpty = (value) => value.trim() || null;
const imessageConversationIdentityKinds = /* @__PURE__ */ new Set([
  "plugin:imessage-chat-id",
  "plugin:imessage-chat-guid",
  "plugin:imessage-chat-identifier",
]);
const matchIMessageIngressEntry = ({ entry, context }) => {
  if (imessageConversationIdentityKinds.has(entry.kind) && context !== "group") return false;
};
function isIMessageConversationAllowTarget(entry) {
  const parsed = parseIMessageAllowTarget(entry);
  return (
    parsed.kind === "chat_id" || parsed.kind === "chat_guid" || parsed.kind === "chat_identifier"
  );
}
function mergeIMessageGroupAllowFromWithLegacyChatTargets(params) {
  if (params.groupAllowFrom.length > 0 || !params.allowLegacyConversationTargets)
    return params.groupAllowFrom;
  const legacyChatTargets = params.allowFrom.filter((entry) =>
    isIMessageConversationAllowTarget(entry),
  );
  if (legacyChatTargets.length === 0) return params.groupAllowFrom;
  return uniqueStrings([...params.groupAllowFrom, ...legacyChatTargets]);
}
const imessageIngressIdentity = defineStableChannelIngressIdentity({
  key: "imessage-sender",
  normalizeEntry: normalizeIMessageHandleEntry,
  normalizeSubject: normalizeIMessageHandle,
  sensitivity: "pii",
  matchEntry: matchIMessageIngressEntry,
  aliases: [
    ["imessage-chat-id", "plugin:imessage-chat-id", normalizeIMessageChatIdEntry],
    ["imessage-chat-guid", "plugin:imessage-chat-guid", normalizeIMessageChatGuidEntry],
    [
      "imessage-chat-identifier",
      "plugin:imessage-chat-identifier",
      normalizeIMessageChatIdentifierEntry,
    ],
  ].map(([key, kind, normalizeEntry]) => ({
    key,
    kind,
    normalizeEntry,
    normalizeSubject: normalizeNonEmpty,
    sensitivity: "pii",
  })),
  resolveEntryId: ({ entryIndex }) => `imessage-entry-${entryIndex + 1}`,
});
function normalizeIMessageHandleEntry(entry) {
  const parsed = parseIMessageAllowTarget(entry.trim());
  return parsed.kind === "handle" ? normalizeIMessageHandle(parsed.handle) : null;
}
function normalizeIMessageChatIdEntry(entry) {
  const parsed = parseIMessageAllowTarget(entry.trim());
  return parsed.kind === "chat_id" ? String(parsed.chatId) : null;
}
function normalizeIMessageChatGuidEntry(entry) {
  const parsed = parseIMessageAllowTarget(entry.trim());
  return parsed.kind === "chat_guid" ? parsed.chatGuid.trim() || null : null;
}
function normalizeIMessageChatIdentifierEntry(entry) {
  const parsed = parseIMessageAllowTarget(entry.trim());
  return parsed.kind === "chat_identifier" ? parsed.chatIdentifier.trim() || null : null;
}
function normalizeDmPolicy(policy) {
  return policy === "open" || policy === "allowlist" || policy === "disabled" ? policy : "pairing";
}
function normalizeGroupPolicy(policy) {
  return policy === "open" || policy === "disabled" ? policy : "allowlist";
}
function normalizeReplyField(value) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? trimmed : void 0;
  }
  if (typeof value === "number") return String(value);
}
function describeReplyContext(message) {
  const body = normalizeReplyField(message.reply_to_text);
  if (!body) return null;
  return {
    body,
    id: normalizeReplyField(message.reply_to_id),
    sender: normalizeReplyField(message.reply_to_sender),
  };
}
function resolveInboundEchoMessageIds(message) {
  const values = [
    message.id != null ? String(message.id) : void 0,
    normalizeReplyField(message.guid),
  ];
  const ids = [];
  for (const value of values) {
    if (!value || ids.includes(value)) continue;
    ids.push(value);
  }
  return ids;
}
function rememberIMessageSkippedFromMeForSelfChatDedupe(params) {
  if (params.message.is_from_me !== true) return;
  const sender = params.message.sender?.trim();
  if (!sender) return;
  const chatId = params.message.chat_id ?? void 0;
  const isGroup = Boolean(params.message.is_group);
  const chatIdentifierNormalized =
    normalizeIMessageHandle(params.message.chat_identifier ?? "") || void 0;
  const destinationCallerIdNormalized =
    normalizeIMessageHandle(params.message.destination_caller_id ?? "") || void 0;
  const senderNormalized = normalizeIMessageHandle(sender);
  const createdAt = params.message.created_at ? Date.parse(params.message.created_at) : void 0;
  const lookup = {
    accountId: params.accountId,
    isGroup,
    chatId,
    sender,
    text: params.bodyText.trim(),
    createdAt,
  };
  const isSelfChat =
    !isGroup &&
    chatIdentifierNormalized != null &&
    senderNormalized === chatIdentifierNormalized &&
    destinationCallerIdNormalized != null &&
    destinationCallerIdNormalized === senderNormalized;
  const isAmbiguousSelfThread =
    !isGroup &&
    chatIdentifierNormalized != null &&
    senderNormalized === chatIdentifierNormalized &&
    destinationCallerIdNormalized == null;
  if (isSelfChat)
    params.selfChatCache?.remember({
      ...lookup,
      allowCreatedAtSkew: true,
    });
  else if (isAmbiguousSelfThread) params.selfChatCache?.remember(lookup);
}
function hasIMessageEchoMatch(params) {
  const scopes = typeof params.scope === "string" ? [params.scope] : params.scope;
  for (const scope of scopes) {
    if (!scope) continue;
    for (const messageId of params.messageIds)
      if (params.echoCache.has(scope, { messageId })) return true;
    const fallbackMessageId = params.messageIds[0];
    if (!params.text && !fallbackMessageId) continue;
    if (
      params.echoCache.has(
        scope,
        {
          text: params.text,
          messageId: fallbackMessageId,
        },
        {
          skipIdShortCircuit: params.skipIdShortCircuit,
          includePendingText: params.includePendingText,
        },
      )
    )
      return true;
  }
  return false;
}
function isKnownFromMeIMessageReactionTarget(params) {
  const { messageId, accountId, chatId, chatGuid, chatIdentifier } = params;
  const ctx = {
    accountId,
    chatId,
    chatGuid,
    chatIdentifier,
  };
  if (params.isKnownFromMeMessageId) return params.isKnownFromMeMessageId(messageId, ctx);
  return isKnownFromMeIMessageMessageId(messageId, ctx);
}
/**
 * Per-group `systemPrompt` resolution. Mirrors `resolveWhatsAppGroupSystemPrompt`
 * in `extensions/whatsapp/src/system-prompt.ts`:
 *
 * 1. If the matched per-`chat_id` entry exists AND defines `systemPrompt` (key
 *    is present, value is non-null), use it. Trim whitespace; if the trim
 *    leaves an empty string, return `undefined` and DO NOT fall through to the
 *    wildcard. This is how operators say "this specific group has no prompt"
 *    without inheriting from `groups["*"]`.
 * 2. Otherwise, return the wildcard `groups["*"].systemPrompt` (trimmed; empty
 *    after trim → `undefined`).
 */
function resolveIMessageGroupSystemPrompt(params) {
  const specific = params.groupConfig;
  if (specific != null && specific.systemPrompt != null)
    return specific.systemPrompt.trim() || void 0;
  const wildcard = params.defaultConfig?.systemPrompt;
  return wildcard != null ? wildcard.trim() || void 0 : void 0;
}
async function resolveIMessageInboundDecision(params) {
  const sender = (params.message.sender ?? "").trim();
  if (!sender)
    return {
      kind: "drop",
      reason: "missing sender",
    };
  const senderNormalized = normalizeIMessageHandle(sender);
  const chatId = params.message.chat_id ?? void 0;
  const chatGuid = params.message.chat_guid ?? void 0;
  const chatIdentifier = params.message.chat_identifier ?? void 0;
  const destinationCallerId = params.message.destination_caller_id ?? void 0;
  const createdAt = params.message.created_at ? Date.parse(params.message.created_at) : void 0;
  const messageText = params.messageText.trim();
  const bodyText = params.bodyText.trim();
  const reactionContext = resolveIMessageReactionContext(params.message, bodyText || messageText);
  const groupIdCandidate = chatId !== void 0 ? String(chatId) : void 0;
  const groupAllowFromWithLegacyChatTargets = mergeIMessageGroupAllowFromWithLegacyChatTargets({
    groupAllowFrom: params.groupAllowFrom,
    allowFrom: params.allowFrom,
    allowLegacyConversationTargets: params.allowLegacyConversationAllowFromForGroup,
  });
  const groupListPolicy = groupIdCandidate
    ? resolveChannelGroupPolicy({
        cfg: params.cfg,
        channel: "imessage",
        accountId: params.accountId,
        groupId: groupIdCandidate,
        hasGroupAllowFrom: groupAllowFromWithLegacyChatTargets.length > 0,
      })
    : {
        allowlistEnabled: false,
        allowed: true,
        groupConfig: void 0,
        defaultConfig: void 0,
      };
  const treatAsGroupByConfig = Boolean(
    groupIdCandidate && groupListPolicy.allowlistEnabled && groupListPolicy.groupConfig,
  );
  const isGroup = Boolean(params.message.is_group) || treatAsGroupByConfig;
  const selfChatLookup = {
    accountId: params.accountId,
    isGroup,
    chatId,
    sender,
    text: bodyText,
    createdAt,
  };
  const chatIdentifierNormalized = normalizeIMessageHandle(chatIdentifier ?? "") || void 0;
  const destinationCallerIdNormalized =
    normalizeIMessageHandle(destinationCallerId ?? "") || void 0;
  const isSelfChat =
    !isGroup &&
    chatIdentifierNormalized != null &&
    senderNormalized === chatIdentifierNormalized &&
    destinationCallerIdNormalized != null &&
    destinationCallerIdNormalized === senderNormalized;
  const isAmbiguousSelfThread =
    !isGroup &&
    chatIdentifierNormalized != null &&
    senderNormalized === chatIdentifierNormalized &&
    destinationCallerIdNormalized == null;
  let skipSelfChatHasCheck = false;
  const inboundMessageIds = resolveInboundEchoMessageIds(params.message);
  const inboundMessageId = inboundMessageIds[0];
  const hasInboundGuid = Boolean(normalizeReplyField(params.message.guid));
  if (params.message.is_from_me) {
    if (isAmbiguousSelfThread) params.selfChatCache?.remember(selfChatLookup);
    if (isSelfChat) {
      params.selfChatCache?.remember({
        ...selfChatLookup,
        allowCreatedAtSkew: true,
      });
      const echoScope = buildIMessageEchoScope({
        accountId: params.accountId,
        isGroup,
        chatId,
        chatGuid,
        chatIdentifier,
        sender,
      });
      if (
        params.echoCache &&
        (bodyText || inboundMessageId) &&
        hasIMessageEchoMatch({
          echoCache: params.echoCache,
          scope: echoScope,
          text: bodyText || void 0,
          messageIds: inboundMessageIds,
          skipIdShortCircuit: !hasInboundGuid,
          includePendingText: true,
        })
      )
        return {
          kind: "drop",
          reason: "agent echo in self-chat",
        };
      skipSelfChatHasCheck = true;
    } else
      return {
        kind: "drop",
        reason: "from me",
      };
  }
  if (isGroup && !chatId)
    return {
      kind: "drop",
      reason: "group without chat_id",
    };
  const groupId = isGroup ? groupIdCandidate : void 0;
  const hasControlCommandInMessage = hasControlCommand(messageText, params.cfg);
  const groupAllowFromForAccess = isGroup
    ? groupAllowFromWithLegacyChatTargets
    : params.groupAllowFrom;
  const { commandAccess, senderAccess } = await createChannelIngressResolver({
    channelId: "imessage",
    accountId: params.accountId,
    identity: imessageIngressIdentity,
    cfg: params.cfg,
    readStoreAllowFrom: async () => params.storeAllowFrom,
  }).message({
    subject: {
      stableId: sender,
      aliases: {
        ...(chatId != null ? { "imessage-chat-id": String(chatId) } : {}),
        ...(chatGuid ? { "imessage-chat-guid": chatGuid } : {}),
        ...(chatIdentifier ? { "imessage-chat-identifier": chatIdentifier } : {}),
      },
    },
    conversation: {
      kind: isGroup ? "group" : "direct",
      id: isGroup
        ? String(chatId ?? chatGuid ?? chatIdentifier ?? "unknown")
        : normalizeIMessageHandle(sender),
    },
    dmPolicy: normalizeDmPolicy(params.dmPolicy),
    groupPolicy: normalizeGroupPolicy(params.groupPolicy),
    policy: { groupAllowFromFallbackToAllowFrom: false },
    allowFrom: params.allowFrom,
    groupAllowFrom: groupAllowFromForAccess,
    command: {
      allowTextCommands: isGroup,
      hasControlCommand: hasControlCommandInMessage,
      directGroupAllowFrom: "effective",
    },
  });
  const effectiveGroupAllowFrom = senderAccess.effectiveGroupAllowFrom;
  if (senderAccess.decision !== "allow") {
    if (isGroup) {
      if (senderAccess.reasonCode === "group_policy_disabled") {
        params.logVerbose?.("Blocked iMessage group message (groupPolicy: disabled)");
        return {
          kind: "drop",
          reason: "groupPolicy disabled",
        };
      }
      if (senderAccess.reasonCode === "group_policy_empty_allowlist") {
        params.logVerbose?.(
          "Blocked iMessage group message (groupPolicy: allowlist, no groupAllowFrom)",
        );
        return {
          kind: "drop",
          reason: "groupPolicy allowlist (empty groupAllowFrom)",
        };
      }
      if (senderAccess.reasonCode === "group_policy_not_allowlisted") {
        params.logVerbose?.(`Blocked iMessage sender ${sender} (not in groupAllowFrom)`);
        return {
          kind: "drop",
          reason: "not in groupAllowFrom",
        };
      }
      params.logVerbose?.(`Blocked iMessage group message (${senderAccess.reasonCode})`);
      return {
        kind: "drop",
        reason: senderAccess.reasonCode,
      };
    }
    if (senderAccess.reasonCode === "dm_policy_disabled")
      return {
        kind: "drop",
        reason: "dmPolicy disabled",
      };
    if (senderAccess.decision === "pairing")
      return {
        kind: "pairing",
        senderId: senderNormalized,
      };
    params.logVerbose?.(`Blocked iMessage sender ${sender} (dmPolicy=${params.dmPolicy})`);
    return {
      kind: "drop",
      reason: "dmPolicy blocked",
    };
  }
  if (isGroup && groupListPolicy.allowlistEnabled && !groupListPolicy.allowed) {
    params.logVerbose?.(
      `imessage: skipping group message (${groupId ?? "unknown"}) not in allowlist`,
    );
    return {
      kind: "drop",
      reason: "group id not in allowlist",
    };
  }
  const route = resolveIMessageConversationRoute({
    cfg: params.cfg,
    accountId: params.accountId,
    isGroup,
    peerId: isGroup ? String(chatId ?? "unknown") : senderNormalized,
    sender,
    chatId,
  });
  if (reactionContext) {
    const notificationMode = params.reactionNotifications ?? "own";
    if (notificationMode === "off")
      return {
        kind: "drop",
        reason: "reaction notifications disabled",
      };
    const targetGuid = reactionContext.targetGuid;
    const targetGuids = reactionContext.targetGuids ?? (targetGuid ? [targetGuid] : []);
    const targetIsOwn = Boolean(
      targetGuid &&
      ((params.echoCache &&
        hasIMessageEchoMatch({
          echoCache: params.echoCache,
          scope: buildIMessageEchoScope({
            accountId: params.accountId,
            isGroup,
            chatId,
            chatGuid,
            chatIdentifier,
            sender,
          }),
          messageIds: targetGuids,
        })) ||
        targetGuids.some((messageId) =>
          isKnownFromMeIMessageReactionTarget({
            messageId,
            accountId: params.accountId,
            chatId,
            chatGuid,
            chatIdentifier,
            isKnownFromMeMessageId: params.isKnownFromMeMessageId,
          }),
        )),
    );
    if (notificationMode === "own" && !targetIsOwn)
      return {
        kind: "drop",
        reason: "reaction target not sent by agent",
      };
    const target = targetGuid
      ? `msg ${targetGuid}`
      : reactionContext.targetText
        ? `message "${truncateUtf16Safe(reactionContext.targetText, 80)}"`
        : "a message";
    return {
      kind: "reaction",
      isGroup,
      chatId,
      chatGuid,
      chatIdentifier,
      sender,
      senderNormalized,
      route,
      reaction: reactionContext,
      text: `iMessage reaction ${reactionContext.action}: ${reactionContext.emoji} by ${senderNormalized} on ${target}`,
      contextKey: [
        "imessage",
        "reaction",
        reactionContext.action,
        chatId ?? chatGuid ?? chatIdentifier ?? senderNormalized,
        targetGuid ?? reactionContext.targetText ?? "unknown",
        senderNormalized,
        reactionContext.emoji,
      ].join(":"),
    };
  }
  const mentionRegexes = buildMentionRegexes(params.cfg, route.agentId);
  if (!bodyText)
    return {
      kind: "drop",
      reason: "empty body",
    };
  if (
    skipSelfChatHasCheck
      ? false
      : params.selfChatCache?.has({
          ...selfChatLookup,
          text: bodyText,
        })
  ) {
    const preview = sanitizeTerminalText(truncateUtf16Safe(bodyText, 50));
    params.logVerbose?.(`imessage: dropping self-chat reflected duplicate: "${preview}"`);
    return {
      kind: "drop",
      reason: "self-chat echo",
    };
  }
  if (params.echoCache && (messageText || inboundMessageId)) {
    const echoScope = buildIMessageEchoScope({
      accountId: params.accountId,
      isGroup,
      chatId,
      chatGuid,
      chatIdentifier,
      sender,
    });
    if (
      hasIMessageEchoMatch({
        echoCache: params.echoCache,
        scope: echoScope,
        text: bodyText || void 0,
        messageIds: inboundMessageIds,
        includePendingText: isSelfChat,
      })
    ) {
      params.logVerbose?.(
        describeIMessageEchoDropLog({
          messageText: bodyText,
          messageId: inboundMessageId,
        }),
      );
      return {
        kind: "drop",
        reason: "echo",
      };
    }
  }
  const reflection = detectReflectedContent(messageText);
  if (reflection.isReflection) {
    params.logVerbose?.(
      `imessage: dropping reflected assistant content (markers: ${reflection.matchedLabels.join(", ")})`,
    );
    return {
      kind: "drop",
      reason: "reflected assistant content",
    };
  }
  const replyContext = describeReplyContext(params.message);
  const contextVisibilityMode = resolveChannelContextVisibilityMode({
    cfg: params.cfg,
    channel: "imessage",
    accountId: params.accountId,
  });
  const replyContextAllowFrom = Array.from(
    /* @__PURE__ */ new Set([...groupAllowFromForAccess, ...effectiveGroupAllowFrom]),
  );
  const replySenderAllowed =
    !isGroup || replyContextAllowFrom.length === 0
      ? true
      : replyContext?.sender
        ? isAllowedIMessageReplyContextSender({
            allowFrom: replyContextAllowFrom,
            sender: replyContext.sender,
            chatId,
            chatGuid,
            chatIdentifier,
          })
        : false;
  const visibleReply = filterChannelInboundQuoteContext(
    contextVisibilityMode,
    replyContext
      ? {
          id: replyContext.id,
          body: replyContext.body,
          sender: replyContext.sender,
          senderAllowed: replySenderAllowed,
        }
      : void 0,
  );
  const filteredReplyContext = visibleReply
    ? {
        id: visibleReply.id,
        body: visibleReply.body ?? "",
        sender: visibleReply.sender,
      }
    : null;
  if (replyContext && !filteredReplyContext && isGroup)
    params.logVerbose?.(
      `imessage: drop reply context (mode=${contextVisibilityMode}, sender_allowed=${replySenderAllowed ? "yes" : "no"})`,
    );
  const historyKey = isGroup ? String(chatId ?? chatGuid ?? chatIdentifier ?? "unknown") : void 0;
  const mentioned = isGroup ? matchesMentionPatterns(messageText, mentionRegexes) : true;
  const requireMention = resolveChannelGroupRequireMention({
    cfg: params.cfg,
    channel: "imessage",
    accountId: params.accountId,
    groupId,
    requireMentionOverride: params.opts?.requireMention,
    overrideOrder: "before-config",
  });
  const canDetectMention = mentionRegexes.length > 0;
  const commandAuthorized = commandAccess.authorized;
  if (commandAccess.shouldBlockControlCommand) {
    if (params.logVerbose)
      logInboundDrop({
        log: params.logVerbose,
        channel: "imessage",
        reason: "control command (unauthorized)",
        target: sender,
      });
    return {
      kind: "drop",
      reason: "control command (unauthorized)",
    };
  }
  const mentionDecision = resolveInboundMentionDecision({
    facts: {
      canDetectMention,
      wasMentioned: mentioned,
      hasAnyMention: false,
      implicitMentionKinds: [],
    },
    policy: {
      isGroup,
      requireMention,
      allowTextCommands: true,
      hasControlCommand: hasControlCommandInMessage,
      commandAuthorized,
    },
  });
  const effectiveWasMentioned = mentionDecision.effectiveWasMentioned;
  if (isGroup && requireMention && canDetectMention && mentionDecision.shouldSkip) {
    params.logVerbose?.(`imessage: skipping group message (no mention)`);
    createChannelHistoryWindow({ historyMap: params.groupHistories }).record({
      historyKey: historyKey ?? "",
      limit: params.historyLimit,
      entry: historyKey
        ? {
            sender: senderNormalized,
            body: bodyText,
            timestamp: createdAt,
            messageId: params.message.id ? String(params.message.id) : void 0,
          }
        : null,
    });
    return {
      kind: "drop",
      reason: "no mention",
    };
  }
  return {
    kind: "dispatch",
    isGroup,
    chatId,
    chatGuid,
    chatIdentifier,
    groupId,
    historyKey,
    sender,
    senderNormalized,
    route,
    bodyText,
    createdAt,
    replyContext: filteredReplyContext,
    effectiveWasMentioned,
    groupRequireMention: requireMention,
    commandAuthorized,
    hasControlCommand: hasControlCommandInMessage,
    groupSystemPrompt: isGroup
      ? resolveIMessageGroupSystemPrompt({
          groupConfig: groupListPolicy.groupConfig,
          defaultConfig: groupListPolicy.defaultConfig,
        })
      : void 0,
  };
}
async function buildIMessageInboundContext(params) {
  const envelopeOptions = params.envelopeOptions ?? resolveEnvelopeFormatOptions(params.cfg);
  const { decision } = params;
  const chatId = decision.chatId;
  const chatTarget = decision.isGroup && chatId != null ? formatIMessageChatTarget(chatId) : void 0;
  const messageGuid = normalizeReplyField(params.message.guid);
  const messageSid =
    (messageGuid
      ? rememberIMessageReplyCache({
          accountId: decision.route.accountId,
          messageId: messageGuid,
          chatGuid: decision.chatGuid,
          chatIdentifier: decision.chatIdentifier,
          chatId: decision.chatId,
          timestamp: Date.now(),
          isFromMe: false,
        })
      : null
    )?.shortId || void 0;
  const replySuffix = decision.replyContext
    ? `\n\n[Replying to ${decision.replyContext.sender ?? "unknown sender"}${decision.replyContext.id ? ` id:${decision.replyContext.id}` : ""}]\n${decision.replyContext.body}\n[/Replying]`
    : "";
  const fromLabel = formatInboundFromLabel({
    isGroup: decision.isGroup,
    groupLabel: params.message.chat_name ?? void 0,
    groupId: chatId !== void 0 ? String(chatId) : "unknown",
    groupFallback: "Group",
    directLabel: decision.senderNormalized,
    directId: decision.sender,
  });
  let combinedBody = formatInboundEnvelope({
    channel: "iMessage",
    from: fromLabel,
    timestamp: decision.createdAt,
    body: `${decision.agentBodyText ?? decision.bodyText}${replySuffix}`,
    chatType: decision.isGroup ? "group" : "direct",
    sender: {
      name: decision.senderNormalized,
      id: decision.sender,
    },
    previousTimestamp: params.previousTimestamp,
    envelope: envelopeOptions,
  });
  if (!decision.isGroup && params.dmHistory?.body)
    combinedBody = `${params.dmHistory.body}\n\n${combinedBody}`;
  if (decision.isGroup && decision.historyKey)
    combinedBody = createChannelHistoryWindow({
      historyMap: params.groupHistories,
    }).buildPendingContext({
      historyKey: decision.historyKey,
      limit: params.historyLimit,
      currentMessage: combinedBody,
      formatEntry: (entry) =>
        formatInboundEnvelope({
          channel: "iMessage",
          from: fromLabel,
          timestamp: entry.timestamp,
          body: `${entry.body}${entry.messageId ? ` [id:${entry.messageId}]` : ""}`,
          chatType: "group",
          senderLabel: entry.sender,
          envelope: envelopeOptions,
        }),
    });
  const imessageTo = decision.isGroup
    ? chatTarget || `imessage:${decision.sender}`
    : buildDirectIMessageReplyTarget({
        cfg: params.cfg,
        accountId: decision.route.accountId,
        sender: decision.sender,
      });
  const imessageFrom = decision.isGroup ? `imessage:group:${chatId ?? "unknown"}` : imessageTo;
  const inboundHistory =
    !decision.isGroup && params.dmHistory?.inboundHistory
      ? params.dmHistory.inboundHistory
      : decision.isGroup && decision.historyKey && params.historyLimit > 0
        ? createChannelHistoryWindow({ historyMap: params.groupHistories }).buildInboundHistory({
            historyKey: decision.historyKey,
            limit: params.historyLimit,
          })
        : void 0;
  const media = toInboundMediaFacts(
    params.media?.paths && params.media.paths.length > 0
      ? params.media.paths.map((path, index) => ({
          path,
          url: path,
          contentType: params.media?.types?.[index],
        }))
      : params.media?.path
        ? [
            {
              path: params.media.path,
              url: params.media.path,
              contentType: params.media.type,
            },
          ]
        : void 0,
  );
  return {
    ctxPayload: buildChannelInboundEventContext({
      channel: "imessage",
      supplemental: {
        quote: decision.replyContext
          ? {
              id: decision.replyContext.id,
              body: decision.replyContext.body,
              sender: decision.replyContext.sender,
            }
          : void 0,
        groupSystemPrompt: decision.isGroup ? decision.groupSystemPrompt : void 0,
      },
      media,
      messageId: messageSid,
      messageIdFull: messageGuid,
      timestamp: decision.createdAt,
      from: imessageFrom,
      sender: {
        id: decision.sender,
        name: decision.senderNormalized,
      },
      conversation: {
        kind: decision.isGroup ? "group" : "direct",
        id: chatId != null ? String(chatId) : decision.sender,
        label: fromLabel,
      },
      route: {
        agentId: decision.route.agentId,
        accountId: decision.route.accountId,
        routeSessionKey: decision.route.sessionKey,
      },
      reply: { to: imessageTo },
      message: {
        body: combinedBody,
        bodyForAgent: decision.agentBodyText ?? decision.bodyText,
        inboundHistory,
        rawBody: decision.bodyText,
        commandBody: decision.bodyText,
      },
      access: {
        mentions: {
          canDetectMention: decision.isGroup,
          wasMentioned: decision.effectiveWasMentioned,
        },
        commands: { authorized: decision.commandAuthorized },
      },
      extra: {
        GroupSubject: decision.isGroup ? (params.message.chat_name ?? void 0) : void 0,
        GroupRequireMention: decision.isGroup ? decision.groupRequireMention : void 0,
        GroupMembers: decision.isGroup
          ? (params.message.participants ?? []).filter(Boolean).join(", ")
          : void 0,
        MediaRemoteHost: params.remoteHost,
        CommandSource: decision.commandAuthorized && decision.hasControlCommand ? "text" : void 0,
      },
    }),
    fromLabel,
    chatTarget,
    imessageTo,
    inboundHistory,
  };
}
function buildIMessageEchoScope(params) {
  const scopes = [];
  if (params.isGroup) {
    const chatIdScope = formatIMessageChatTarget(params.chatId);
    if (chatIdScope) scopes.push(`${params.accountId}:${chatIdScope}`);
  } else scopes.push(`${params.accountId}:imessage:${params.sender}`);
  if (params.chatGuid) scopes.push(`${params.accountId}:chat_guid:${params.chatGuid}`);
  if (params.chatIdentifier)
    scopes.push(`${params.accountId}:chat_identifier:${params.chatIdentifier}`);
  return scopes;
}
function buildDirectIMessageReplyTarget(params) {
  if (
    resolveIMessageAccount({
      cfg: params.cfg,
      accountId: params.accountId,
    }).config.service === "sms"
  )
    return `sms:${params.sender}`;
  return `imessage:${params.sender}`;
}
function describeIMessageEchoDropLog(params) {
  const preview = truncateUtf16Safe(params.messageText, 50);
  return `imessage: skipping echo message${params.messageId ? ` id=${params.messageId}` : ""}: "${preview}"`;
}
//#endregion
//#region extensions/imessage/src/monitor/loop-rate-limiter.ts
/**
 * Per-conversation rate limiter that detects rapid-fire identical echo
 * patterns and suppresses them before they amplify into queue overflow.
 */
const DEFAULT_WINDOW_MS = 6e4;
const DEFAULT_MAX_HITS = 5;
const CLEANUP_INTERVAL_MS = 12e4;
function createLoopRateLimiter(opts) {
  const windowMs = opts?.windowMs ?? DEFAULT_WINDOW_MS;
  const maxHits = opts?.maxHits ?? DEFAULT_MAX_HITS;
  const conversations = /* @__PURE__ */ new Map();
  let lastCleanup = Date.now();
  function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
    lastCleanup = now;
    for (const [key, win] of conversations.entries()) {
      const recent = win.timestamps.filter((ts) => now - ts <= windowMs);
      if (recent.length === 0) conversations.delete(key);
      else win.timestamps = recent;
    }
  }
  return {
    record(conversationKey) {
      cleanup();
      let win = conversations.get(conversationKey);
      if (!win) {
        win = { timestamps: [] };
        conversations.set(conversationKey, win);
      }
      win.timestamps.push(Date.now());
    },
    isRateLimited(conversationKey) {
      cleanup();
      const win = conversations.get(conversationKey);
      if (!win) return false;
      const now = Date.now();
      const recent = win.timestamps.filter((ts) => now - ts <= windowMs);
      win.timestamps = recent;
      return recent.length >= maxHits;
    },
  };
}
//#endregion
//#region extensions/imessage/src/monitor/media-staging.ts
function isHeicAttachment(attachmentPath, mimeType) {
  const normalizedMime = mimeType?.toLowerCase();
  if (normalizedMime === "image/heic" || normalizedMime === "image/heif") return true;
  const ext = path.extname(attachmentPath).toLowerCase();
  return ext === ".heic" || ext === ".heif";
}
function jpegFilenameForAttachment(attachmentPath) {
  return `${path.parse(attachmentPath).name || "imessage-attachment"}.jpg`;
}
function hasWildcardSegment(root) {
  return root.replaceAll("\\", "/").split("/").includes("*");
}
async function canonicalizeAllowedRoots(roots) {
  const canonicalRoots = [];
  for (const root of roots) {
    canonicalRoots.push(root);
    if (hasWildcardSegment(root)) continue;
    const canonicalRoot = await fs.realpath(root).catch(() => void 0);
    if (canonicalRoot && canonicalRoot !== root) canonicalRoots.push(canonicalRoot);
  }
  return canonicalRoots;
}
async function resolveAllowedCanonicalAttachmentPath(params) {
  if (!params.allowedRoots) return params.attachmentPath;
  const canonicalPath = await fs.realpath(params.attachmentPath);
  if (
    !isInboundPathAllowed({
      filePath: canonicalPath,
      roots: await canonicalizeAllowedRoots(params.allowedRoots),
    })
  )
    throw new Error("attachment path resolves outside allowed roots");
  return canonicalPath;
}
async function readAttachmentBuffer(params) {
  const stat = await fs.lstat(params.attachmentPath);
  if (stat.isSymbolicLink()) throw new Error("attachment path is a symlink");
  if (!stat.isFile()) throw new Error("attachment path is not a file");
  if (stat.size > params.maxBytes)
    throw new Error(`attachment exceeds ${Math.round(params.maxBytes / (1024 * 1024))}MB limit`);
  const canonicalPath = await resolveAllowedCanonicalAttachmentPath({
    attachmentPath: params.attachmentPath,
    allowedRoots: params.allowedRoots,
  });
  const canonicalStat = await fs.stat(canonicalPath);
  if (!canonicalStat.isFile()) throw new Error("attachment path is not a file");
  if (canonicalStat.size > params.maxBytes)
    throw new Error(`attachment exceeds ${Math.round(params.maxBytes / (1024 * 1024))}MB limit`);
  if (isHeicAttachment(params.attachmentPath, params.mimeType))
    try {
      const convert = params.deps.convertHeicToJpeg;
      const converted = convert
        ? {
            buffer: await convert(canonicalPath, params.maxBytes),
            fileName: jpegFilenameForAttachment(params.attachmentPath),
          }
        : await loadWebMedia(canonicalPath, {
            maxBytes: params.maxBytes,
            localRoots: [path.dirname(canonicalPath)],
          });
      return {
        buffer: converted.buffer,
        contentType: "image/jpeg",
        originalFilename: converted.fileName ?? jpegFilenameForAttachment(params.attachmentPath),
      };
    } catch (err) {
      params.deps.logVerbose?.(
        `imessage: HEIC attachment conversion failed; staging original instead: ${String(err)}`,
      );
    }
  return {
    buffer: await fs.readFile(canonicalPath),
    contentType: params.mimeType ?? void 0,
    originalFilename: path.basename(params.attachmentPath),
  };
}
async function stageIMessageAttachments(attachments, params) {
  const deps = params.deps ?? {};
  const save = deps.saveMediaBuffer ?? saveMediaBuffer;
  const staged = [];
  let unavailableCount = 0;
  for (const attachment of attachments) {
    const attachmentPath = attachment.original_path?.trim();
    if (!attachmentPath || attachment.missing) {
      unavailableCount += 1;
      continue;
    }
    try {
      const media = await readAttachmentBuffer({
        attachmentPath,
        mimeType: attachment.mime_type,
        maxBytes: params.maxBytes,
        allowedRoots: params.allowedRoots,
        deps,
      });
      const saved = await save(
        media.buffer,
        media.contentType,
        "inbound",
        params.maxBytes,
        media.originalFilename,
      );
      staged.push({
        path: saved.path,
        contentType: saved.contentType,
      });
    } catch (err) {
      unavailableCount += 1;
      deps.logVerbose?.(`imessage: failed to stage inbound attachment: ${String(err)}`);
    }
  }
  return {
    attachments: staged,
    unavailableCount,
  };
}
//#endregion
//#region extensions/imessage/src/monitor/poll-comment.ts
const DEFAULT_COMMENT_WINDOW_MS = 15e3;
function normalizeGuid(guid) {
  return guid?.trim() ?? "";
}
function normalizeSender(sender) {
  return sender?.trim().toLowerCase() ?? "";
}
function createPollCommentFolder(options) {
  const windowMs = options?.windowMs ?? DEFAULT_COMMENT_WINDOW_MS;
  const seenPolls = /* @__PURE__ */ new Map();
  function prune(referenceMs) {
    for (const [key, seen] of seenPolls)
      if (referenceMs - seen.atMs > windowMs) seenPolls.delete(key);
  }
  return {
    rememberPoll(guid, atMs, sender) {
      const key = normalizeGuid(guid);
      if (!key || !Number.isFinite(atMs)) return;
      prune(atMs);
      seenPolls.set(key, {
        atMs,
        sender: normalizeSender(sender),
      });
    },
    isPollComment(replyToGuid, atMs, sender) {
      const key = normalizeGuid(replyToGuid);
      if (!key || !Number.isFinite(atMs)) return false;
      const seen = seenPolls.get(key);
      if (!seen || atMs < seen.atMs || atMs - seen.atMs > windowMs) return false;
      const replySender = normalizeSender(sender);
      return seen.sender.length > 0 && replySender.length > 0 && seen.sender === replySender;
    },
  };
}
//#endregion
//#region extensions/imessage/src/monitor/poll-render.ts
function renderIMessagePollBody(poll) {
  const options = poll.options ?? [];
  if (poll.kind === "vote" || (poll.vote && options.length === 0)) {
    const vote = poll.vote;
    if (!vote) return "📊 Poll vote received";
    const who = vote.participant?.trim() || "someone";
    const what = vote.option_text?.trim() || vote.option_id || "an option";
    return `\u{1F4CA} Poll vote: ${who} ${vote.event_type === "removed" ? "removed their vote for" : "voted for"} "${what}"`;
  }
  if (options.length === 0) return null;
  const tally = /* @__PURE__ */ new Map();
  for (const vote of poll.votes ?? []) {
    if (vote.event_type === "removed" || !vote.option_id) continue;
    tally.set(vote.option_id, (tally.get(vote.option_id) ?? 0) + 1);
  }
  const optionList = options
    .map((option, index) => {
      const count = tally.get(option.id) ?? 0;
      return `${index + 1}) ${option.text}${count > 0 ? ` [${count}]` : ""}`;
    })
    .join("  ");
  const question = poll.question?.trim();
  return `\u{1F4CA} Poll${question ? `: ${question}` : ""} — options: ${optionList}. Cast your vote on this poll with the poll-vote action (pollOptionIndex = the option number); do not answer in a text reply.`;
}
//#endregion
//#region extensions/imessage/src/monitor/reaction-system-event.ts
function enqueueIMessageReactionSystemEvent(params) {
  const { decision, runtime } = params;
  const queued = enqueueSystemEvent(decision.text, {
    sessionKey: decision.route.sessionKey,
    contextKey: decision.contextKey,
  });
  runtime.log?.(
    `imessage: reaction system event ${queued ? "queued" : "deduped"} session=${decision.route.sessionKey} target=${decision.reaction.targetGuid ?? "unknown"} action=${decision.reaction.action} emoji=${decision.reaction.emoji}`,
  );
  params.logVerbose?.(`imessage: reaction event enqueued: ${decision.text}`);
  return queued;
}
//#endregion
//#region extensions/imessage/src/monitor/recovery-cursor.ts
const IMESSAGE_RECOVERY_CURSOR_NAMESPACE = "imessage.recovery-cursor";
const IMESSAGE_RECOVERY_CURSOR_MAX_ENTRIES = 64;
const LEGACY_CATCHUP_CURSOR_NAMESPACE = "imessage.catchup-cursors";
const LEGACY_CATCHUP_CURSOR_MAX_ENTRIES = 256;
function openRecoveryCursorStore() {
  return getIMessageRuntime().state.openSyncKeyedStore({
    namespace: IMESSAGE_RECOVERY_CURSOR_NAMESPACE,
    maxEntries: IMESSAGE_RECOVERY_CURSOR_MAX_ENTRIES,
  });
}
function localMessagesHomeDir() {
  const home = process.env.HOME?.trim();
  if (home) return home;
  try {
    return os.homedir().trim() || void 0;
  } catch {
    return;
  }
}
function normalizeLocalDbPath(dbPath) {
  let resolved = dbPath.trim();
  if (resolved.startsWith("~")) {
    const home = localMessagesHomeDir();
    if (home) resolved = path.join(home, resolved.slice(1).replace(/^\/+/, ""));
  }
  return path.resolve(resolved);
}
/**
 * Stable identity for the watched Messages database. A changed identity means a
 * different chat.db (different `dbPath`, custom `cliPath`, or a remote host),
 * whose rowids share no ordering with the previous one, so the cursor must not
 * carry across. Local paths are canonicalized so the implicit default and an
 * explicit path to the same chat.db resolve to one identity.
 */
function resolveIMessageRecoveryCursorDbIdentity(params) {
  const remoteHost = params.remoteHost?.trim();
  if (remoteHost) return `remote:${remoteHost}:${params.dbPath?.trim() || "default"}`;
  const dbPath = params.dbPath?.trim();
  if (dbPath) return `local:${normalizeLocalDbPath(dbPath)}`;
  const cliPath = params.cliPath?.trim();
  if (!cliPath || cliPath === "imsg" || path.basename(cliPath) === "imsg") {
    const home = localMessagesHomeDir();
    return home
      ? `local:${normalizeLocalDbPath(path.join(home, "Library", "Messages", "chat.db"))}`
      : "local:default";
  }
  return `local:cli:${cliPath}`;
}
function recoveryCursorStoreKey(accountId, dbIdentity) {
  return `${accountId}\u0000${dbIdentity}`;
}
function readRecoveryCursor(accountId, dbIdentity) {
  try {
    const store = openRecoveryCursorStore();
    const key = recoveryCursorStoreKey(accountId, dbIdentity);
    const value = store.lookup(key);
    if (value) return Number.isFinite(value.lastRowid) ? value.lastRowid : null;
    const legacy = store.consume(accountId);
    if (legacy && Number.isFinite(legacy.lastRowid)) {
      store.register(key, { lastRowid: legacy.lastRowid });
      return legacy.lastRowid;
    }
    return null;
  } catch {
    return null;
  }
}
function migrateLegacyCatchupCursor(accountId, dbIdentity) {
  try {
    const legacy = getIMessageRuntime().state.openSyncKeyedStore({
      namespace: LEGACY_CATCHUP_CURSOR_NAMESPACE,
      maxEntries: LEGACY_CATCHUP_CURSOR_MAX_ENTRIES,
    });
    const key = createHash("sha256").update(accountId, "utf8").digest("hex").slice(0, 32);
    const value = legacy.consume(key);
    const rowid =
      typeof value?.lastSeenRowid === "number" && Number.isFinite(value.lastSeenRowid)
        ? value.lastSeenRowid
        : null;
    if (rowid !== null) advanceIMessageRecoveryCursor(accountId, dbIdentity, rowid);
    return rowid;
  } catch {
    return null;
  }
}
/**
 * Last dispatched rowid for this account on `dbIdentity`, or null when none is
 * recorded yet (including when the only stored cursor belongs to a different
 * database).
 */
function loadIMessageRecoveryCursor(accountId, dbIdentity, options = {}) {
  const current = readRecoveryCursor(accountId, dbIdentity);
  if (current !== null) return current;
  if (options.migrateLegacyCatchup === false) return null;
  return migrateLegacyCatchupCursor(accountId, dbIdentity);
}
/** Advance the cursor forward to `rowid` (monotonic per database; never rewinds). */
function advanceIMessageRecoveryCursor(accountId, dbIdentity, rowid) {
  if (!Number.isFinite(rowid)) return;
  try {
    const store = openRecoveryCursorStore();
    const key = recoveryCursorStoreKey(accountId, dbIdentity);
    const current = store.lookup(key);
    if (current && current.lastRowid >= rowid) return;
    store.register(key, { lastRowid: rowid });
  } catch {}
}
//#endregion
//#region extensions/imessage/src/monitor/runtime.ts
function resolveRuntime(opts) {
  return opts.runtime ?? createNonExitingRuntime();
}
function normalizeAllowList(list) {
  return normalizeStringEntries(list);
}
//#endregion
//#region extensions/imessage/src/monitor/self-chat-cache.ts
const SELF_CHAT_TTL_MS = 1e4;
const SELF_CHAT_CREATED_AT_TOLERANCE_MS = 1e3;
const MAX_SELF_CHAT_CACHE_ENTRIES = 512;
const CLEANUP_MIN_INTERVAL_MS = 1e3;
function normalizeText(text) {
  if (!text) return null;
  const normalized = text.replace(/\r\n?/g, "\n").trim();
  return normalized ? normalized : null;
}
function isUsableTimestamp(createdAt) {
  return typeof createdAt === "number" && Number.isFinite(createdAt);
}
function digestText(text) {
  return createHash("sha256").update(text).digest("hex");
}
function buildScope(parts) {
  if (!parts.isGroup) return `${parts.accountId}:imessage:${parts.sender}`;
  const chatTarget = formatIMessageChatTarget(parts.chatId) || "chat_id:unknown";
  return `${parts.accountId}:${chatTarget}:imessage:${parts.sender}`;
}
var DefaultSelfChatCache = class {
  constructor() {
    this.cache = /* @__PURE__ */ new Map();
    this.insertionOrder = [];
    this.insertionOrderOffset = 0;
    this.entryCount = 0;
    this.lastCleanupAt = 0;
    this.nextEntryId = 1;
  }
  buildBucketKey(lookup) {
    const text = normalizeText(lookup.text);
    if (!text) return null;
    return `${buildScope(lookup)}:${digestText(text)}`;
  }
  remember(lookup) {
    const key = this.buildBucketKey(lookup);
    if (!key || !isUsableTimestamp(lookup.createdAt)) return;
    const entries = this.cache.get(key) ?? /* @__PURE__ */ new Map();
    const entry = {
      id: this.nextEntryId,
      createdAt: lookup.createdAt,
      createdAtSkewToleranceMs: lookup.allowCreatedAtSkew ? SELF_CHAT_CREATED_AT_TOLERANCE_MS : 0,
      rememberedAt: Date.now(),
    };
    this.nextEntryId += 1;
    entries.set(entry.id, entry);
    this.cache.set(key, entries);
    this.insertionOrder.push({
      key,
      id: entry.id,
    });
    this.entryCount += 1;
    this.maybeCleanup();
  }
  has(lookup) {
    this.maybeCleanup();
    const key = this.buildBucketKey(lookup);
    if (!key || !isUsableTimestamp(lookup.createdAt)) return false;
    const entries = this.cache.get(key);
    if (!entries) return false;
    const now = Date.now();
    const createdAt = lookup.createdAt;
    return [...entries.values()].some((entry) => {
      const createdAtDelta = Math.abs(entry.createdAt - createdAt);
      return (
        now - entry.rememberedAt <= SELF_CHAT_TTL_MS &&
        (createdAtDelta === 0 || createdAtDelta < entry.createdAtSkewToleranceMs)
      );
    });
  }
  maybeCleanup() {
    const now = Date.now();
    if (now - this.lastCleanupAt < CLEANUP_MIN_INTERVAL_MS) return;
    this.lastCleanupAt = now;
    for (const [key, entries] of this.cache.entries()) {
      for (const [id, entry] of entries.entries())
        if (now - entry.rememberedAt > SELF_CHAT_TTL_MS) {
          entries.delete(id);
          this.entryCount -= 1;
        }
      if (entries.size === 0) this.cache.delete(key);
    }
    while (
      this.entryCount > MAX_SELF_CHAT_CACHE_ENTRIES &&
      this.insertionOrderOffset < this.insertionOrder.length
    ) {
      const oldest = expectDefined(
        this.insertionOrder[this.insertionOrderOffset],
        "oldest iMessage self-chat cache entry",
      );
      this.insertionOrderOffset += 1;
      const entries = this.cache.get(oldest.key);
      if (!entries) continue;
      if (!entries.delete(oldest.id)) continue;
      this.entryCount -= 1;
      if (entries.size === 0) this.cache.delete(oldest.key);
    }
    this.compactInsertionOrder();
  }
  compactInsertionOrder() {
    if (this.insertionOrderOffset <= 1024 && this.insertionOrder.length <= this.entryCount + 1024)
      return;
    this.insertionOrder = this.insertionOrder
      .slice(this.insertionOrderOffset)
      .filter((entry) => this.cache.get(entry.key)?.has(entry.id));
    this.insertionOrderOffset = 0;
  }
};
function createSelfChatCache() {
  return new DefaultSelfChatCache();
}
//#endregion
//#region extensions/imessage/src/monitor/watch-error-log.ts
const MAX_WATCH_ERROR_MESSAGE_CHARS = 200;
function sanitizeIMessageWatchErrorPayload(payload) {
  if (!isRecord(payload)) return {};
  const safe = {};
  if (typeof payload.code === "number" && Number.isFinite(payload.code)) safe.code = payload.code;
  if (typeof payload.message === "string") {
    const sanitizedMessage = sanitizeTerminalText(payload.message);
    if (sanitizedMessage)
      safe.message =
        sanitizedMessage.length > MAX_WATCH_ERROR_MESSAGE_CHARS
          ? `${truncateUtf16Safe(sanitizedMessage, MAX_WATCH_ERROR_MESSAGE_CHARS - 1)}…`
          : sanitizedMessage;
  }
  return safe;
}
//#endregion
//#region extensions/imessage/src/monitor/monitor-provider.ts
const WATCH_SUBSCRIBE_MAX_ATTEMPTS = 3;
const WATCH_SUBSCRIBE_RETRY_DELAY_MS = 1e3;
const APPROVAL_REACTION_POLL_INTERVAL_MS = 2e3;
const APPROVAL_REACTION_DISCOVERY_INTERVAL_MS = 6e4;
const IMESSAGE_TYPING_KEEPALIVE_INTERVAL_MS = 8e3;
const IMESSAGE_TYPING_KEEPALIVE_MAX_DURATION_MS = 10 * 6e4;
const IMESSAGE_SPLIT_SEND_COMPAT_DEBOUNCE_MS = 7e3;
function resolveConfiguredIMessageTypingMode(cfg) {
  return cfg.session?.typingMode ?? cfg.agents?.defaults?.typingMode;
}
function resolveIMessageSplitSendCompatDebounceMs(cfg, coalesceSameSenderDms) {
  if (!coalesceSameSenderDms) return;
  const inbound = cfg.messages?.inbound;
  const channelOverride = inbound?.byChannel?.imessage;
  if (typeof channelOverride === "number" && Number.isFinite(channelOverride)) return;
  if (typeof inbound?.debounceMs === "number" && Number.isFinite(inbound.debounceMs)) return;
  return IMESSAGE_SPLIT_SEND_COMPAT_DEBOUNCE_MS;
}
function isIMessagePluginPayloadAttachment(attachment) {
  const attachmentPath = attachment.original_path?.trim().toLowerCase() ?? "";
  const transferName = attachment.transfer_name?.trim().toLowerCase() ?? "";
  const uti = attachment.uti?.trim().toLowerCase() ?? "";
  return (
    attachmentPath.endsWith(".pluginpayloadattachment") ||
    transferName.endsWith(".pluginpayloadattachment") ||
    uti === "com.apple.messages.pluginpayloadattachment"
  );
}
function resolveIMessageInboundMediaInput(params) {
  const mediaCandidates = params.attachments.filter(
    (entry) => !isIMessagePluginPayloadAttachment(entry),
  );
  const rawMediaAttachments = mediaCandidates.flatMap((attachment) => {
    const attachmentPath = attachment.original_path?.trim();
    if (!attachmentPath || attachment.missing) return [];
    if (
      !isInboundPathAllowed({
        filePath: attachmentPath,
        roots: params.effectiveAttachmentRoots,
      })
    ) {
      params.logVerbose?.(
        `imessage: dropping inbound attachment outside allowed roots: ${attachmentPath}`,
      );
      return [];
    }
    return [
      {
        path: attachmentPath,
        contentType: attachment.mime_type ?? void 0,
      },
    ];
  });
  const kind = kindFromMime(
    rawMediaAttachments[0]?.contentType ?? mediaCandidates[0]?.mime_type ?? void 0,
  );
  const mediaPlaceholder = kind
    ? `<media:${kind}>`
    : mediaCandidates.length
      ? "<media:attachment>"
      : "";
  return {
    bodyText: params.messageText || mediaPlaceholder,
    mediaPlaceholder,
    mediaCandidates,
    rawMediaAttachments,
  };
}
function formatIMessageInboundMediaBody(params) {
  const materializedKind = kindFromMime(params.mediaAttachments[0]?.contentType);
  const materializedPlaceholder = materializedKind
    ? `<media:${materializedKind}>`
    : params.mediaAttachments.length > 0
      ? "<media:attachment>"
      : "";
  return formatInboundMediaUnavailableText({
    body: params.messageText || materializedPlaceholder || params.optimisticPlaceholder,
    mediaPlaceholder: params.mediaAttachments.length === 0 ? params.optimisticPlaceholder : void 0,
    notice: `[imessage ${params.unavailableCount > 1 ? `${params.unavailableCount} attachments` : "attachment"} unavailable]`,
  });
}
async function detectRemoteHostFromCliPath(cliPath) {
  try {
    const expanded = cliPath.startsWith("~")
      ? cliPath.replace(/^~/, process.env.HOME ?? "")
      : cliPath;
    const content = await fs.readFile(expanded, "utf8");
    const userHostMatch = content.match(/\bssh\b[^\n]*?\s+([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+)/);
    if (userHostMatch) return userHostMatch[1];
    return content.match(/\bssh\b[^\n]*?\s+([a-zA-Z][a-zA-Z0-9._-]*)\s+\S*\bimsg\b/)?.[1];
  } catch (err) {
    const code = err?.code;
    if (code !== "ENOENT" && code !== "ENOTDIR")
      logVerbose(
        `imessage: failed to inspect cliPath ${cliPath} for remoteHost detection: ${String(err)}`,
      );
    return;
  }
}
function resolveLocalMessagesHomeDir() {
  const home = process.env.HOME?.trim();
  if (home) return home;
  try {
    return os.homedir().trim() || void 0;
  } catch {
    return;
  }
}
function resolveLocalMessagesDbPath(dbPath) {
  if (!dbPath.startsWith("~")) return dbPath;
  const home = resolveLocalMessagesHomeDir();
  return home ? path.join(home, dbPath.slice(1).replace(/^\/+/, "")) : dbPath;
}
function resolveIMessageWatchSourceDbPath(params) {
  if (params.remoteHost) return;
  const configured = params.dbPath?.trim();
  if (configured) return configured;
  const cliPath = params.cliPath.trim();
  if (cliPath !== "imsg" && path.basename(cliPath) !== "imsg") return;
  const home = resolveLocalMessagesHomeDir();
  return home ? path.join(home, "Library", "Messages", "chat.db") : void 0;
}
async function resolveIMessageStartupRowidWatermark(dbPath) {
  const resolvedDbPath = resolveLocalMessagesDbPath(dbPath);
  let database;
  try {
    const { DatabaseSync } = await import("node:sqlite");
    database = new DatabaseSync(resolvedDbPath, { readOnly: true });
    const row = database.prepare("SELECT MAX(ROWID) AS maxRowid FROM message").get();
    return typeof row?.maxRowid === "number" && Number.isFinite(row.maxRowid) ? row.maxRowid : null;
  } catch (err) {
    logVerbose(`imessage: startup rowid watermark unavailable for db=${dbPath}: ${String(err)}`);
    return null;
  } finally {
    database?.close();
  }
}
const warnIfImsgUpgradeNeeded = (() => {
  let fired = false;
  return {
    fireOnce: (rpcMethods, runtime) => {
      if (fired) return;
      fired = true;
      const detail =
        rpcMethods.length === 0
          ? "imsg build pre-dates the rpc_methods capability list"
          : `imsg rpc_methods=[${rpcMethods.join(", ")}] does not include typing/read`;
      runtime.log?.(
        warn(
          `imessage: typing indicators / read receipts gated off (${detail}). Upgrade imsg (current bridge needs typing+read in rpc_methods).`,
        ),
      );
    },
  };
})();
function isRetriableWatchSubscribeStartupError(error) {
  return /imsg rpc timeout \(watch\.subscribe\)|imsg rpc (closed|exited|not running)/i.test(
    String(error),
  );
}
const IMESSAGE_DIAGNOSTIC_DROP_REASONS = /* @__PURE__ */ new Set([
  "agent echo in self-chat",
  "echo",
  "from me",
  "reflected assistant content",
  "self-chat echo",
]);
const IMESSAGE_THROTTLED_DIAGNOSTIC_DROP_REASONS = /* @__PURE__ */ new Set(["from me"]);
function shouldThrottleIMessageInboundDropDiagnostic(reason) {
  return IMESSAGE_THROTTLED_DIAGNOSTIC_DROP_REASONS.has(reason);
}
function describeIMessageInboundDropDiagnostic(params) {
  if (!IMESSAGE_DIAGNOSTIC_DROP_REASONS.has(params.reason)) return null;
  const messageId =
    typeof params.message.id === "number" || typeof params.message.id === "string"
      ? String(params.message.id)
      : "unknown";
  return `imessage: dropped inbound message account=${params.accountId} reason=${JSON.stringify(params.reason)} chat_id=${params.message.chat_id ?? "unknown"} group=${params.message.is_group === true} message_id=${messageId} guid=${params.message.guid ? "present" : "missing"} created_at=${params.message.created_at ?? "unknown"}`;
}
function describeIMessageWatchSubscribeStartupFailure(params) {
  const retry = params.retryDelayMs !== void 0 ? ` retry_in_ms=${params.retryDelayMs}` : "";
  return `imessage: watch.subscribe startup failed attempt=${params.attempt}/${params.maxAttempts} account=${params.accountId} cliPath=${params.cliPath} dbPath=${params.dbPath ? "configured" : "default"} remoteHost=${params.remoteHost ? "configured" : "none"} timeoutMs=${params.probeTimeoutMs} since_rowid=${params.watchSinceRowid ?? "none"} attachments=${params.includeAttachments} include_reactions=true${retry}: ${String(params.error)}`;
}
async function waitForWatchSubscribeRetryDelay(params) {
  if (params.ms <= 0) return;
  await new Promise((resolve) => {
    const timer = setTimeout(() => {
      params.abortSignal?.removeEventListener("abort", onAbort);
      resolve();
    }, params.ms);
    const onAbort = () => {
      clearTimeout(timer);
      params.abortSignal?.removeEventListener("abort", onAbort);
      resolve();
    };
    params.abortSignal?.addEventListener("abort", onAbort, { once: true });
  });
}
async function monitorIMessageProvider(opts = {}) {
  const runtime = resolveRuntime(opts);
  const cfg = opts.config ?? getRuntimeConfig();
  const accountInfo = resolveIMessageAccount({
    cfg,
    accountId: opts.accountId,
  });
  const imessageCfg = accountInfo.config;
  const historyLimit = Math.max(
    0,
    imessageCfg.historyLimit ?? cfg.messages?.groupChat?.historyLimit ?? 50,
  );
  const groupHistories = /* @__PURE__ */ new Map();
  const sentMessageCache = createSentMessageCache();
  const selfChatCache = createSelfChatCache();
  const loopRateLimiter = createLoopRateLimiter();
  const textLimit = resolveTextChunkLimit(cfg, "imessage", accountInfo.accountId);
  const allowFrom = normalizeAllowList(opts.allowFrom ?? imessageCfg.allowFrom);
  const configuredGroupAllowFrom = opts.groupAllowFrom ?? imessageCfg.groupAllowFrom;
  const groupAllowFrom = normalizeAllowList(
    configuredGroupAllowFrom ??
      (imessageCfg.allowFrom && imessageCfg.allowFrom.length > 0 ? imessageCfg.allowFrom : []),
  );
  const allowLegacyConversationAllowFromForGroup = configuredGroupAllowFrom == null;
  const defaultGroupPolicy = resolveDefaultGroupPolicy(cfg);
  const { groupPolicy, providerMissingFallbackApplied } = resolveOpenProviderRuntimeGroupPolicy({
    providerConfigPresent: cfg.channels?.imessage !== void 0,
    groupPolicy: imessageCfg.groupPolicy,
    defaultGroupPolicy,
  });
  warnMissingProviderGroupPolicyFallbackOnce({
    providerMissingFallbackApplied,
    providerKey: "imessage",
    accountId: accountInfo.accountId,
    log: (message) => runtime.log?.(warn(message)),
  });
  warnGroupAllowlistMisconfigOnce({
    groupPolicy,
    hasGroupAllowFrom:
      mergeIMessageGroupAllowFromWithLegacyChatTargets({
        groupAllowFrom,
        allowFrom,
        allowLegacyConversationTargets: allowLegacyConversationAllowFromForGroup,
      }).length > 0,
    accountId: accountInfo.accountId,
    log: (message) => runtime.log?.(warn(message)),
  });
  const dmPolicy = imessageCfg.dmPolicy ?? "pairing";
  const catchupCfg = resolveCatchupConfig(imessageCfg.catchup);
  const includeAttachments = opts.includeAttachments ?? imessageCfg.includeAttachments ?? false;
  const mediaMaxBytes = (opts.mediaMaxMb ?? imessageCfg.mediaMaxMb ?? 16) * 1024 * 1024;
  const cliPath = opts.cliPath ?? imessageCfg.cliPath ?? "imsg";
  const dbPath = opts.dbPath ?? imessageCfg.dbPath;
  const probeTimeoutMs = imessageCfg.probeTimeoutMs ?? 1e4;
  const attachmentRoots = resolveIMessageAttachmentRoots({
    cfg,
    accountId: accountInfo.accountId,
  });
  const remoteAttachmentRoots = resolveIMessageRemoteAttachmentRoots({
    cfg,
    accountId: accountInfo.accountId,
  });
  const configuredRemoteHost = normalizeScpRemoteHost(imessageCfg.remoteHost);
  if (imessageCfg.remoteHost && !configuredRemoteHost)
    logVerbose("imessage: ignoring unsafe channels.imessage.remoteHost value");
  let remoteHost = configuredRemoteHost;
  if (!remoteHost && cliPath && cliPath !== "imsg") {
    const detected = await detectRemoteHostFromCliPath(cliPath);
    const normalizedDetected = normalizeScpRemoteHost(detected);
    if (detected && !normalizedDetected)
      logVerbose("imessage: ignoring unsafe auto-detected remoteHost from cliPath");
    remoteHost = normalizedDetected;
    if (remoteHost) logVerbose(`imessage: detected remoteHost=${remoteHost} from cliPath`);
  }
  const inboundReplayGuard = createIMessageInboundReplayGuard();
  let staleBacklogSuppressed = 0;
  const loggedThrottledDropDiagnostics = /* @__PURE__ */ new Set();
  const watchSourceDbPath = resolveIMessageWatchSourceDbPath({
    cliPath,
    dbPath,
    remoteHost,
  });
  const recoveryBoundaryRowid = watchSourceDbPath
    ? await resolveIMessageStartupRowidWatermark(watchSourceDbPath)
    : null;
  const recoveryCursorDbIdentity = resolveIMessageRecoveryCursorDbIdentity({
    cliPath,
    dbPath,
    remoteHost,
  });
  const recoveryCursorRowid = loadIMessageRecoveryCursor(
    accountInfo.accountId,
    recoveryCursorDbIdentity,
    { migrateLegacyCatchup: !catchupCfg.enabled },
  );
  const watchSinceRowid = catchupCfg.enabled
    ? null
    : recoveryCursorRowid !== null
      ? recoveryBoundaryRowid !== null
        ? Math.max(recoveryCursorRowid, recoveryBoundaryRowid - 500)
        : recoveryCursorRowid
      : recoveryBoundaryRowid;
  const coalesceSameSenderDms = imessageCfg.coalesceSameSenderDms === true;
  const debounceMsOverride = resolveIMessageSplitSendCompatDebounceMs(cfg, coalesceSameSenderDms);
  let imsgEmitsBalloonMetadata = false;
  let recoveryCursorHoldBeforeRowid = null;
  let latestAdvancedRecoveryCursorRowid = recoveryCursorRowid ?? -1;
  const pendingRecoveryReplayRowids = /* @__PURE__ */ new Set();
  const handledRecoveryCursorRowids = /* @__PURE__ */ new Set();
  function collectFiniteRowids(entries) {
    const rowids = [];
    for (const entry of entries)
      if (typeof entry.message.id === "number" && Number.isFinite(entry.message.id))
        rowids.push(entry.message.id);
    return rowids;
  }
  function holdRecoveryCursorBeforeFailedRows(entries) {
    if (catchupCfg.enabled || recoveryCursorRowid === null) return;
    if (recoveryBoundaryRowid === null) return;
    const failedReplayRowids = collectFiniteRowids(entries).filter(
      (rowid) => rowid <= recoveryBoundaryRowid,
    );
    if (failedReplayRowids.length === 0) return;
    const firstFailedRowid = Math.min(...failedReplayRowids);
    for (const rowid of failedReplayRowids) pendingRecoveryReplayRowids.delete(rowid);
    recoveryCursorHoldBeforeRowid =
      recoveryCursorHoldBeforeRowid === null
        ? firstFailedRowid
        : Math.min(recoveryCursorHoldBeforeRowid, firstFailedRowid);
  }
  function trackPendingRecoveryReplayRow(message) {
    if (catchupCfg.enabled || recoveryCursorRowid === null || recoveryBoundaryRowid === null)
      return;
    if (
      typeof message.id === "number" &&
      Number.isFinite(message.id) &&
      message.id <= recoveryBoundaryRowid
    )
      pendingRecoveryReplayRowids.add(message.id);
  }
  function minSetValue(values) {
    let min = null;
    for (const value of values) min = min === null ? value : Math.min(min, value);
    return min;
  }
  function resolveRecoveryCursorHoldFloor() {
    const pendingFloor = minSetValue(pendingRecoveryReplayRowids);
    if (pendingFloor === null) return recoveryCursorHoldBeforeRowid;
    if (recoveryCursorHoldBeforeRowid === null) return pendingFloor;
    return Math.min(pendingFloor, recoveryCursorHoldBeforeRowid);
  }
  function advanceRecoveryCursorAfterHandled(entries) {
    if (catchupCfg.enabled) return;
    const rowids = collectFiniteRowids(entries);
    if (rowids.length === 0) return;
    for (const rowid of rowids) {
      pendingRecoveryReplayRowids.delete(rowid);
      handledRecoveryCursorRowids.add(rowid);
    }
    const maxHandledRowid = Math.max(...handledRecoveryCursorRowids);
    const holdFloor = resolveRecoveryCursorHoldFloor();
    const nextCursorRowid =
      holdFloor !== null && maxHandledRowid >= holdFloor ? holdFloor - 1 : maxHandledRowid;
    if (nextCursorRowid >= 0 && nextCursorRowid > latestAdvancedRecoveryCursorRowid) {
      advanceIMessageRecoveryCursor(
        accountInfo.accountId,
        recoveryCursorDbIdentity,
        nextCursorRowid,
      );
      latestAdvancedRecoveryCursorRowid = nextCursorRowid;
      for (const rowid of handledRecoveryCursorRowids)
        if (rowid <= nextCursorRowid) handledRecoveryCursorRowids.delete(rowid);
    }
  }
  const { debouncer: inboundDebouncer } = createChannelInboundDebouncer({
    cfg,
    channel: "imessage",
    debounceMsOverride,
    buildKey: (entry) => {
      const msg = entry.message;
      const sender = msg.sender?.trim();
      if (!sender) return null;
      const conversationId =
        msg.chat_id != null
          ? `chat:${msg.chat_id}`
          : (msg.chat_guid ?? msg.chat_identifier ?? "unknown");
      if (coalesceSameSenderDms && msg.is_group !== true)
        return `imessage:${accountInfo.accountId}:dm:${conversationId}:${sender}`;
      return `imessage:${accountInfo.accountId}:${conversationId}:${sender}`;
    },
    shouldDebounce: (entry) => {
      const msg = entry.message;
      if (resolveIMessageReactionContext(msg, (msg.text ?? "").trim())) return false;
      if (msg.is_from_me === true) return false;
      if (coalesceSameSenderDms) return msg.is_group !== true;
      return shouldDebounceTextInbound({
        text: msg.text,
        cfg,
        hasMedia: Boolean(
          msg.attachments?.some((attachment) => !isIMessagePluginPayloadAttachment(attachment)),
        ),
      });
    },
    onFlush: async (entries) => {
      if (entries.length === 0) return;
      const dispatchUnit = async (unitEntries, message) => {
        const keys = unitEntries.map((entry) => entry.replayKey).filter((key) => key !== null);
        try {
          await handleMessageNow(message);
          await commitIMessageInboundReplay({
            guard: inboundReplayGuard,
            accountId: accountInfo.accountId,
            keys,
          });
          advanceRecoveryCursorAfterHandled(unitEntries);
        } catch (err) {
          holdRecoveryCursorBeforeFailedRows(unitEntries);
          releaseIMessageInboundReplay({
            guard: inboundReplayGuard,
            accountId: accountInfo.accountId,
            keys,
            error: err,
          });
          runtime.error?.(`imessage: inbound dispatch failed: ${String(err)}`);
        }
      };
      if (entries.length === 1) {
        await dispatchUnit(
          entries,
          expectDefined(entries[0], "single iMessage dispatch entry").message,
        );
        return;
      }
      const messages = entries.map((e) => e.message);
      if (!shouldCombineIMessagePayloadBucket(messages, imsgEmitsBalloonMetadata)) {
        for (const entry of entries) await dispatchUnit([entry], entry.message);
        return;
      }
      if (messages.some(hasIMessageUrlBalloonBundleID)) {
        let pending = null;
        for (const entry of entries) {
          if (isStandaloneIMessageUrlPreviewPayload(entry.message) && pending) {
            const unitEntries = [pending, entry];
            await dispatchUnit(
              unitEntries,
              combineIMessagePayloads(unitEntries.map((e) => e.message)),
            );
            pending = null;
            continue;
          }
          if (hasIMessageUrlBalloonBundleID(entry.message)) {
            if (pending) {
              await dispatchUnit([pending], pending.message);
              pending = null;
            }
            await dispatchUnit([entry], entry.message);
            continue;
          }
          if (pending) await dispatchUnit([pending], pending.message);
          pending = entry;
        }
        if (pending) await dispatchUnit([pending], pending.message);
        return;
      }
      const combined = combineIMessagePayloads(messages);
      if (shouldLogVerbose()) {
        const text = combined.text ?? "";
        const preview = sliceUtf16Safe(text, 0, 50);
        const ellipsis = text.length > 50 ? "..." : "";
        logVerbose(
          `[imessage] merged ${entries.length} debounced messages: "${preview}${ellipsis}"`,
        );
      }
      await dispatchUnit(entries, combined);
    },
    onError: (err) => {
      runtime.error?.(`imessage debounce flush failed: ${String(err)}`);
    },
  });
  let client;
  let detachAbortHandler = () => {};
  let liveCatchupCursorAdvanceEnabled = false;
  let startupCatchupInProgress = false;
  const pendingLiveCatchupCursorAdvances = [];
  const getActiveClient = () => {
    if (!client) throw new Error("imessage monitor client not initialized");
    return client;
  };
  async function repairMessageConversationAnchor(message) {
    return await repairIMessageConversationAnchor({
      client: getActiveClient(),
      message,
      runtime,
    });
  }
  function resolveLiveCatchupCursor(message) {
    const coalescedCursor = message.coalescedCatchupCursor;
    const rowid =
      typeof coalescedCursor?.lastSeenRowid === "number" &&
      Number.isFinite(coalescedCursor.lastSeenRowid)
        ? coalescedCursor.lastSeenRowid
        : typeof message.id === "number" && Number.isFinite(message.id)
          ? message.id
          : null;
    const dateMs =
      typeof coalescedCursor?.lastSeenMs === "number" && Number.isFinite(coalescedCursor.lastSeenMs)
        ? coalescedCursor.lastSeenMs
        : typeof message.created_at === "string"
          ? Date.parse(message.created_at)
          : NaN;
    if (rowid === null || !Number.isFinite(dateMs)) return null;
    return {
      lastSeenMs: dateMs,
      lastSeenRowid: rowid,
    };
  }
  async function maybeAdvanceLiveCatchupCursor(message) {
    if (!catchupCfg.enabled) return;
    const cursor = resolveLiveCatchupCursor(message);
    if (!cursor) return;
    if (!liveCatchupCursorAdvanceEnabled) {
      if (startupCatchupInProgress) pendingLiveCatchupCursorAdvances.push(cursor);
      return;
    }
    try {
      await advanceIMessageCatchupCursor(accountInfo.accountId, cursor, catchupCfg);
    } catch (err) {
      runtime.error?.(`imessage catchup: failed to advance live cursor: ${String(err)}`);
    }
  }
  async function flushPendingLiveCatchupCursorAdvances() {
    for (const cursor of pendingLiveCatchupCursorAdvances.splice(0))
      try {
        await advanceIMessageCatchupCursor(accountInfo.accountId, cursor, catchupCfg);
      } catch (err) {
        runtime.error?.(`imessage catchup: failed to advance pending live cursor: ${String(err)}`);
      }
  }
  async function handleMessageNow(message, options = {}) {
    await handleMessageNowInner(message);
    if (options.advanceCatchupCursor !== false) await maybeAdvanceLiveCatchupCursor(message);
  }
  const pollCommentFolder = createPollCommentFolder();
  function resolveIMessageInboundBodyText(message) {
    const messageText = (
      (message.poll ? renderIMessagePollBody(message.poll) : null) ??
      message.text ??
      ""
    ).trim();
    const attachments = includeAttachments ? (message.attachments ?? []) : [];
    const effectiveAttachmentRoots = remoteHost ? remoteAttachmentRoots : attachmentRoots;
    return {
      messageText,
      ...resolveIMessageInboundMediaInput({
        messageText,
        attachments,
        effectiveAttachmentRoots,
        logVerbose,
      }),
      effectiveAttachmentRoots,
    };
  }
  async function handleMessageNowInner(rawMessage) {
    const message = await repairMessageConversationAnchor(rawMessage);
    if (!message) return;
    const pollFoldAtMs = message.created_at ? Date.parse(message.created_at) : NaN;
    if (message.poll) pollCommentFolder.rememberPoll(message.guid, pollFoldAtMs, message.sender);
    else if (
      message.reply_to_guid != null &&
      pollCommentFolder.isPollComment(message.reply_to_guid, pollFoldAtMs, message.sender)
    ) {
      logVerbose(
        "imessage: folding poll comment (inline reply sent with a poll) into the poll; not delivering standalone",
      );
      return;
    }
    const {
      messageText,
      bodyText,
      mediaPlaceholder,
      mediaCandidates,
      rawMediaAttachments,
      effectiveAttachmentRoots,
    } = resolveIMessageInboundBodyText(message);
    if (
      await maybeResolveIMessageApprovalReaction({
        cfg,
        accountId: accountInfo.accountId,
        message,
        bodyText,
        logVerboseMessage: logVerbose,
      })
    )
      return;
    const storeAllowFrom = await readChannelAllowFromStore(
      "imessage",
      process.env,
      accountInfo.accountId,
    ).catch(() => []);
    const decision = await resolveIMessageInboundDecision({
      cfg,
      accountId: accountInfo.accountId,
      message,
      opts,
      messageText,
      bodyText,
      allowFrom,
      groupAllowFrom,
      allowLegacyConversationAllowFromForGroup,
      groupPolicy,
      dmPolicy,
      storeAllowFrom,
      historyLimit,
      groupHistories,
      echoCache: sentMessageCache,
      selfChatCache,
      reactionNotifications: imessageCfg.reactionNotifications,
      logVerbose,
    });
    const chatId = message.chat_id ?? void 0;
    const senderForKey = (message.sender ?? "").trim();
    const conversationKey = chatId != null ? `group:${chatId}` : `dm:${senderForKey}`;
    const rateLimitKey = `${accountInfo.accountId}:${conversationKey}`;
    if (decision.kind === "drop") {
      if (
        decision.reason === "echo" ||
        decision.reason === "self-chat echo" ||
        decision.reason === "reflected assistant content" ||
        decision.reason === "from me"
      )
        loopRateLimiter.record(rateLimitKey);
      const diagnostic = describeIMessageInboundDropDiagnostic({
        accountId: accountInfo.accountId,
        reason: decision.reason,
        message,
      });
      if (diagnostic) {
        const throttleKey = `${rateLimitKey}:${decision.reason}`;
        const shouldThrottleDiagnostic = shouldThrottleIMessageInboundDropDiagnostic(
          decision.reason,
        );
        if (!shouldThrottleDiagnostic || !loggedThrottledDropDiagnostics.has(throttleKey)) {
          if (shouldThrottleDiagnostic) loggedThrottledDropDiagnostics.add(throttleKey);
          runtime.log?.(warn(diagnostic));
        }
      }
      if (decision.reason === "group id not in allowlist")
        warnGroupAllowlistDropPerChatOnce({
          accountId: accountInfo.accountId,
          chatId: message.chat_id ?? void 0,
          log: (msg) => runtime.log?.(warn(msg)),
        });
      return;
    }
    if (decision.kind === "dispatch" && loopRateLimiter.isRateLimited(rateLimitKey)) {
      logVerbose(`imessage: rate-limited conversation ${conversationKey} (echo loop detected)`);
      return;
    }
    if (decision.kind === "pairing") {
      const sender = (message.sender ?? "").trim();
      if (!sender) return;
      await createChannelPairingChallengeIssuer({
        channel: "imessage",
        accountId: accountInfo.accountId,
        upsertPairingRequest: async ({ id, meta }) =>
          await upsertChannelPairingRequest({
            channel: "imessage",
            id,
            accountId: accountInfo.accountId,
            meta,
          }),
      })({
        senderId: decision.senderId,
        senderIdLine: `Your iMessage sender id: ${decision.senderId}`,
        meta: {
          sender: decision.senderId,
          chatId: chatId ? String(chatId) : void 0,
        },
        onCreated: () => {
          logVerbose(`imessage pairing request sender=${decision.senderId}`);
        },
        sendPairingReply: async (text) => {
          await sendMessageIMessage(sender, text, {
            config: cfg,
            client: getActiveClient(),
            maxBytes: mediaMaxBytes,
            accountId: accountInfo.accountId,
            ...(chatId ? { chatId } : {}),
          });
        },
        onReplyError: (err) => {
          runtime.error?.(`imessage pairing reply failed for ${decision.senderId}: ${String(err)}`);
        },
      });
      return;
    }
    if (decision.kind === "reaction") {
      enqueueIMessageReactionSystemEvent({
        decision,
        runtime,
        logVerbose,
      });
      return;
    }
    const storePath = resolveStorePath(cfg.session?.store, { agentId: decision.route.agentId });
    const privateApiStatus = getCachedIMessagePrivateApiStatus(cliPath);
    const supportsTyping = imessageRpcSupportsMethod(privateApiStatus, "typing");
    const supportsRead = imessageRpcSupportsMethod(privateApiStatus, "read");
    if (privateApiStatus?.available === true) {
      if (!supportsTyping || !supportsRead)
        warnIfImsgUpgradeNeeded.fireOnce(privateApiStatus.rpcMethods, runtime);
    }
    const configuredTypingMode = resolveConfiguredIMessageTypingMode(cfg);
    const sendPolicy = resolveSendPolicy({
      cfg,
      entry: getSessionEntry({
        storePath,
        sessionKey: decision.route.sessionKey,
      }),
      sessionKey: decision.route.sessionKey,
      channel: "imessage",
      chatType: decision.isGroup ? "group" : "direct",
    });
    const shouldUseDirectToolTypingOptions =
      !decision.isGroup &&
      sendPolicy !== "deny" &&
      (configuredTypingMode === void 0 || configuredTypingMode === "instant");
    const earlyDirectTypingTarget =
      supportsTyping && shouldUseDirectToolTypingOptions
        ? buildDirectIMessageReplyTarget({
            cfg,
            accountId: decision.route.accountId,
            sender: decision.sender,
          })
        : void 0;
    let stopEarlyDirectTyping;
    if (earlyDirectTypingTarget) {
      const earlyDirectTypingStarted = sendIMessageTyping(earlyDirectTypingTarget, true, {
        cfg,
        accountId: accountInfo.accountId,
      }).then(
        () => true,
        (err) => {
          logTypingFailure({
            log: (msg) => logVerbose(msg),
            channel: "imessage",
            action: "start",
            target: earlyDirectTypingTarget,
            error: err,
          });
          return false;
        },
      );
      let earlyTypingStopQueued = false;
      stopEarlyDirectTyping = () => {
        if (earlyTypingStopQueued) return;
        earlyTypingStopQueued = true;
        earlyDirectTypingStarted
          .then(async (started) => {
            if (!started) return;
            await sendIMessageTyping(earlyDirectTypingTarget, false, {
              cfg,
              accountId: accountInfo.accountId,
            });
          })
          .catch((err) => {
            logTypingFailure({
              log: (msg) => logVerbose(msg),
              channel: "imessage",
              action: "stop",
              target: earlyDirectTypingTarget,
              error: err,
            });
          });
      };
    }
    const staged = remoteHost
      ? {
          attachments: rawMediaAttachments,
          unavailableCount: mediaCandidates.length - rawMediaAttachments.length,
        }
      : await stageIMessageAttachments(mediaCandidates, {
          maxBytes: mediaMaxBytes,
          allowedRoots: effectiveAttachmentRoots,
          deps: { logVerbose },
        });
    const mediaAttachments = staged.attachments;
    const firstAttachment = mediaAttachments[0];
    const mediaPath = firstAttachment?.path ?? void 0;
    const mediaType = firstAttachment?.contentType ?? void 0;
    const mediaPaths = mediaAttachments.map((a) => a.path).filter(Boolean);
    const mediaTypes = mediaAttachments.map((a) => a.contentType ?? void 0);
    const unavailableCount = staged.unavailableCount;
    const contextDecision =
      unavailableCount > 0
        ? {
            ...decision,
            agentBodyText: formatIMessageInboundMediaBody({
              messageText,
              optimisticPlaceholder: mediaPlaceholder,
              mediaAttachments,
              unavailableCount,
            }),
          }
        : decision;
    const previousTimestamp = readSessionUpdatedAt({
      storePath,
      sessionKey: decision.route.sessionKey,
    });
    const dmHistoryLimit = !decision.isGroup
      ? resolveIMessageDmHistoryLimit({
          config: imessageCfg,
          sender: decision.sender,
          senderNormalized: decision.senderNormalized,
        })
      : 0;
    const dmHistory =
      !decision.isGroup && dmHistoryLimit > 0 && !previousTimestamp
        ? await resolveIMessageDmHistoryContext({
            client: getActiveClient(),
            message,
            senderNormalized: decision.senderNormalized,
            limit: dmHistoryLimit,
            envelopeOptions: resolveEnvelopeFormatOptions(cfg),
            logVerbose,
          })
        : void 0;
    const { ctxPayload, chatTarget, imessageTo } = await buildIMessageInboundContext({
      cfg,
      decision: contextDecision,
      message,
      previousTimestamp,
      remoteHost,
      historyLimit,
      groupHistories,
      dmHistory,
      media: {
        path: mediaPath,
        type: mediaType,
        paths: mediaPaths,
        types: mediaTypes,
      },
    });
    const updateTarget = chatTarget || imessageTo;
    const pinnedMainDmOwner = resolvePinnedMainDmOwnerFromAllowlist({
      dmScope: cfg.session?.dmScope,
      allowFrom,
      normalizeEntry: normalizeIMessageHandle,
    });
    if (shouldLogVerbose()) {
      const preview = truncateUtf16Safe(ctxPayload.Body ?? "", 200).replace(/\n/g, "\\n");
      logVerbose(
        `imessage inbound: chatId=${chatId ?? "unknown"} from=${ctxPayload.From} len=${(ctxPayload.Body ?? "").length} preview="${preview}"`,
      );
    }
    const sendReadReceipts = imessageCfg.sendReadReceipts !== false;
    const typingTarget = ctxPayload.To;
    if (supportsRead && sendReadReceipts && typingTarget)
      markIMessageChatRead(typingTarget, {
        cfg,
        accountId: accountInfo.accountId,
      }).catch((err) => {
        runtime.error?.(`imessage: mark read failed: ${String(err)}`);
      });
    const { onModelSelected, ...replyPipeline } = createChannelReplyPipeline({
      cfg,
      agentId: decision.route.agentId,
      channel: "imessage",
      accountId: decision.route.accountId,
      typing:
        supportsTyping && typingTarget
          ? {
              start: async () => {
                await sendIMessageTyping(typingTarget, true, {
                  cfg,
                  accountId: accountInfo.accountId,
                  client: getActiveClient(),
                });
              },
              stop: async () => {
                await sendIMessageTyping(typingTarget, false, {
                  cfg,
                  accountId: accountInfo.accountId,
                  client: getActiveClient(),
                });
              },
              keepaliveIntervalMs: IMESSAGE_TYPING_KEEPALIVE_INTERVAL_MS,
              maxDurationMs: IMESSAGE_TYPING_KEEPALIVE_MAX_DURATION_MS,
              onStartError: (err) => {
                logTypingFailure({
                  log: (msg) => logVerbose(msg),
                  channel: "imessage",
                  action: "start",
                  target: typingTarget,
                  error: err,
                });
              },
              onStopError: (err) => {
                logTypingFailure({
                  log: (msg) => logVerbose(msg),
                  channel: "imessage",
                  action: "stop",
                  target: typingTarget,
                  error: err,
                });
              },
            }
          : void 0,
    });
    const {
      dispatcher,
      replyOptions: typingReplyOptions,
      markDispatchIdle,
    } = createReplyDispatcherWithTyping({
      ...replyPipeline,
      humanDelay: resolveHumanDelayConfig(cfg, decision.route.agentId),
      deliver: async (payload, info) => {
        const target = ctxPayload.To;
        if (!target) {
          runtime.error?.(danger("imessage: missing delivery target"));
          return;
        }
        const durable = await deliverInboundReplyWithMessageSendContext({
          cfg,
          channel: "imessage",
          accountId: accountInfo.accountId,
          agentId: decision.route.agentId,
          ctxPayload,
          payload,
          info,
          to: target,
          deps: {
            imessage: createIMessageEchoCachingSend({
              accountId: accountInfo.accountId,
              sentMessageCache,
            }),
          },
        });
        if (durable.status === "failed") throw durable.error;
        if (durable.status === "handled_visible" || durable.status === "handled_no_send") return;
        await deliverReplies({
          cfg,
          replies: [payload],
          target,
          accountId: accountInfo.accountId,
          runtime,
          maxBytes: mediaMaxBytes,
          textLimit,
          sentMessageCache,
        });
      },
      onError: (err, info) => {
        runtime.error?.(danger(`imessage ${info.kind} reply failed: ${String(err)}`));
      },
    });
    let directTypingController;
    const directToolTypingOptions = shouldUseDirectToolTypingOptions
      ? {
          suppressDefaultToolProgressMessages: true,
          allowProgressCallbacksWhenSourceDeliverySuppressed: true,
          onTypingController: (typing) => {
            directTypingController = typing;
            typingReplyOptions.onTypingController?.(typing);
          },
          ...(supportsTyping
            ? {
                onToolStart: async () => {
                  await directTypingController?.startTypingLoop();
                },
              }
            : {}),
        }
      : {};
    const configuredBlockStreaming = resolveChannelStreamingBlockEnabled(accountInfo.config);
    const inboundLastRouteSessionKey = resolveInboundLastRouteSessionKey({
      route: decision.route,
      sessionKey: decision.route.sessionKey,
    });
    await runChannelInboundEvent({
      channel: "imessage",
      accountId: decision.route.accountId,
      raw: decision,
      adapter: {
        ingest: () => ({
          id: ctxPayload.MessageSid ?? `${ctxPayload.From}:${Date.now()}`,
          timestamp: typeof ctxPayload.Timestamp === "number" ? ctxPayload.Timestamp : void 0,
          rawText: ctxPayload.RawBody ?? "",
          textForAgent: ctxPayload.BodyForAgent,
          textForCommands: ctxPayload.CommandBody,
          raw: decision,
        }),
        resolveTurn: () => ({
          channel: "imessage",
          accountId: decision.route.accountId,
          routeSessionKey: decision.route.sessionKey,
          storePath,
          ctxPayload,
          recordInboundSession,
          record: {
            updateLastRoute:
              !decision.isGroup && updateTarget
                ? {
                    sessionKey: inboundLastRouteSessionKey,
                    channel: "imessage",
                    to: updateTarget,
                    accountId: decision.route.accountId,
                    mainDmOwnerPin:
                      inboundLastRouteSessionKey === decision.route.mainSessionKey &&
                      pinnedMainDmOwner &&
                      decision.senderNormalized
                        ? {
                            ownerRecipient: pinnedMainDmOwner,
                            senderRecipient: decision.senderNormalized,
                            onSkip: ({ ownerRecipient, senderRecipient }) => {
                              logVerbose(
                                `imessage: skip main-session last route for ${senderRecipient} (pinned owner ${ownerRecipient})`,
                              );
                            },
                          }
                        : void 0,
                  }
                : void 0,
            onRecordError: (err) => {
              logVerbose(`imessage: failed updating session meta: ${String(err)}`);
            },
          },
          history: {
            isGroup: decision.isGroup,
            historyKey: decision.historyKey,
            historyMap: groupHistories,
            limit: historyLimit,
          },
          onPreDispatchFailure: () => {
            stopEarlyDirectTyping?.();
            settleReplyDispatcher({
              dispatcher,
              onSettled: () => markDispatchIdle(),
            });
          },
          runDispatch: async () => {
            try {
              return await dispatchInboundMessage({
                ctx: ctxPayload,
                cfg,
                dispatcher,
                replyOptions: {
                  ...typingReplyOptions,
                  disableBlockStreaming:
                    typeof configuredBlockStreaming === "boolean"
                      ? !configuredBlockStreaming
                      : void 0,
                  onModelSelected,
                  ...directToolTypingOptions,
                },
              });
            } finally {
              markDispatchIdle();
              stopEarlyDirectTyping?.();
            }
          },
        }),
      },
    });
  }
  const handleMessage = async (raw) => {
    const message = parseIMessageNotification(raw);
    if (!message) {
      const shape =
        raw && typeof raw === "object" && !Array.isArray(raw)
          ? Object.keys(raw).toSorted().join(",")
          : typeof raw;
      runtime.error?.(`imessage: dropping malformed RPC message payload (keys=${shape})`);
      return;
    }
    if (!imsgEmitsBalloonMetadata && hasIMessageBalloonMetadata(message))
      imsgEmitsBalloonMetadata = true;
    const isRecoveryReplay =
      recoveryCursorRowid !== null &&
      recoveryBoundaryRowid !== null &&
      typeof message.id === "number" &&
      message.id <= recoveryBoundaryRowid;
    const staleThresholdMs = isRecoveryReplay
      ? IMESSAGE_RECOVERY_MAX_AGE_MS
      : IMESSAGE_STALE_INBOUND_THRESHOLD_MS;
    if (isStaleIMessageBacklog(message, Date.now(), staleThresholdMs)) {
      staleBacklogSuppressed += 1;
      runtime.log?.(
        warn(
          `imessage: suppressed stale inbound backlog account=${accountInfo.accountId} sent=${message.created_at ?? "unknown"} recovery=${isRecoveryReplay} (${staleBacklogSuppressed} suppressed since start)`,
        ),
      );
      const suppressedKey = buildIMessageInboundReplayKey({
        accountId: accountInfo.accountId,
        message,
      });
      if (suppressedKey)
        await commitIMessageInboundReplay({
          guard: inboundReplayGuard,
          accountId: accountInfo.accountId,
          keys: [suppressedKey],
        });
      return;
    }
    const repairedMessage = await repairMessageConversationAnchor(message);
    if (!repairedMessage) return;
    const replay = await claimIMessageInboundReplay({
      guard: inboundReplayGuard,
      accountId: accountInfo.accountId,
      message: repairedMessage,
    });
    if (!replay.claimed) {
      logVerbose(
        `imessage: dropping duplicate inbound notification account=${accountInfo.accountId}`,
      );
      return;
    }
    trackPendingRecoveryReplayRow(repairedMessage);
    await inboundDebouncer.enqueue({
      message: repairedMessage,
      replayKey: replay.key,
    });
  };
  await waitForTransportReady({
    label: "imsg rpc",
    timeoutMs: 3e4,
    logAfterMs: 1e4,
    logIntervalMs: 1e4,
    pollIntervalMs: 500,
    abortSignal: opts.abortSignal,
    runtime,
    check: async () => {
      const probe = await probeIMessage(probeTimeoutMs, {
        cliPath,
        dbPath,
        runtime,
      });
      if (probe.ok) return { ok: true };
      if (probe.fatal) throw new Error(probe.error ?? "imsg rpc unavailable");
      return {
        ok: false,
        error: probe.error ?? "unreachable",
      };
    },
  });
  if (opts.abortSignal?.aborted) return;
  const abort = opts.abortSignal;
  const createWatchClient = async () =>
    await createIMessageRpcClient({
      cliPath,
      dbPath,
      runtime,
      onNotification: (msg) => {
        if (msg.method === "message")
          handleMessage(msg.params).catch((err) => {
            runtime.error?.(`imessage: handler failed: ${String(err)}`);
          });
        else if (msg.method === "error")
          runtime.error?.(
            `imessage: watch error ${JSON.stringify(sanitizeIMessageWatchErrorPayload(msg.params))}`,
          );
      },
    });
  const requireWatchClient = (watchClient) => {
    if (!watchClient) throw new Error("imessage monitor client not initialized");
    return watchClient;
  };
  for (let attempt = 1; attempt <= WATCH_SUBSCRIBE_MAX_ATTEMPTS; attempt++) {
    if (abort?.aborted) return;
    let attemptClient;
    let attemptDetachAbortHandler = () => {};
    let keepAttemptClient = false;
    try {
      attemptClient = requireWatchClient(await createWatchClient());
      let attemptSubscriptionId = null;
      attemptDetachAbortHandler = attachIMessageMonitorAbortHandler({
        abortSignal: abort,
        client: attemptClient,
        getSubscriptionId: () => attemptSubscriptionId,
      });
      attemptSubscriptionId =
        (
          await attemptClient.request(
            "watch.subscribe",
            {
              attachments: includeAttachments,
              include_reactions: true,
              ...(watchSinceRowid !== null ? { since_rowid: watchSinceRowid } : {}),
            },
            { timeoutMs: probeTimeoutMs },
          )
        )?.subscription ?? null;
      client = attemptClient;
      detachAbortHandler = attemptDetachAbortHandler;
      keepAttemptClient = true;
      break;
    } catch (err) {
      if (abort?.aborted) return;
      if (!(attempt < WATCH_SUBSCRIBE_MAX_ATTEMPTS && isRetriableWatchSubscribeStartupError(err))) {
        runtime.error?.(
          danger(
            `imessage: monitor failed: ${describeIMessageWatchSubscribeStartupFailure({
              accountId: accountInfo.accountId,
              attempt,
              maxAttempts: WATCH_SUBSCRIBE_MAX_ATTEMPTS,
              cliPath,
              dbPath,
              remoteHost,
              includeAttachments,
              probeTimeoutMs,
              watchSinceRowid,
              error: err,
            })}`,
          ),
        );
        throw err;
      }
      runtime.log?.(
        warn(
          describeIMessageWatchSubscribeStartupFailure({
            accountId: accountInfo.accountId,
            attempt,
            maxAttempts: WATCH_SUBSCRIBE_MAX_ATTEMPTS,
            cliPath,
            dbPath,
            remoteHost,
            includeAttachments,
            probeTimeoutMs,
            watchSinceRowid,
            error: err,
            retryDelayMs: WATCH_SUBSCRIBE_RETRY_DELAY_MS,
          }),
        ),
      );
      attemptDetachAbortHandler();
      attemptDetachAbortHandler = () => {};
      await attemptClient?.stop();
      attemptClient = void 0;
      await waitForWatchSubscribeRetryDelay({
        ms: WATCH_SUBSCRIBE_RETRY_DELAY_MS,
        abortSignal: abort,
      });
      if (abort?.aborted) return;
    } finally {
      if (!keepAttemptClient) {
        attemptDetachAbortHandler();
        await attemptClient?.stop();
      }
    }
  }
  const activeClient = client;
  if (!activeClient) return;
  const approvalContextLease = opts.channelRuntime
    ? registerChannelRuntimeContext({
        channelRuntime: opts.channelRuntime,
        channelId: "imessage",
        accountId: accountInfo.accountId,
        capability: CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY,
        context: { accountId: accountInfo.accountId },
        abortSignal: abort,
      })
    : void 0;
  let approvalReactionPollInFlight = false;
  const pollApprovalReactions = async (allowRecentChatDiscovery = false) => {
    if (approvalReactionPollInFlight) return;
    approvalReactionPollInFlight = true;
    try {
      await pollPendingIMessageApprovalReactions({
        client: activeClient,
        cfg,
        accountId: accountInfo.accountId,
        allowRecentChatDiscovery,
        logVerboseMessage: logVerbose,
      });
    } catch (err) {
      logVerbose(`imessage: approval reaction poll failed: ${String(err)}`);
    } finally {
      approvalReactionPollInFlight = false;
    }
  };
  const approvalReactionPollTimer = setInterval(() => {
    pollApprovalReactions();
  }, APPROVAL_REACTION_POLL_INTERVAL_MS);
  const approvalReactionDiscoveryTimer = setInterval(() => {
    pollApprovalReactions(true);
  }, APPROVAL_REACTION_DISCOVERY_INTERVAL_MS);
  pollApprovalReactions(true);
  if (catchupCfg.enabled && !abort?.aborted) {
    startupCatchupInProgress = true;
    try {
      const catchupSummary = await runIMessageCatchup({
        client: activeClient,
        accountId: accountInfo.accountId,
        config: catchupCfg,
        includeAttachments,
        dispatchPayload: (message) => handleMessageNow(message, { advanceCatchupCursor: false }),
        observeSkippedFromMePayload: (message) => {
          const { bodyText } = resolveIMessageInboundBodyText(message);
          rememberIMessageSkippedFromMeForSelfChatDedupe({
            accountId: accountInfo.accountId,
            message,
            bodyText,
            selfChatCache,
          });
        },
        runtime,
      });
      liveCatchupCursorAdvanceEnabled =
        catchupSummary.querySucceeded && catchupSummary.fullyCaughtUp;
      if (liveCatchupCursorAdvanceEnabled) await flushPendingLiveCatchupCursorAdvances();
      else pendingLiveCatchupCursorAdvances.length = 0;
    } catch (err) {
      pendingLiveCatchupCursorAdvances.length = 0;
      runtime.error?.(`imessage catchup: pass failed: ${String(err)}`);
    } finally {
      startupCatchupInProgress = false;
    }
  }
  try {
    await activeClient.waitForClose();
  } catch (err) {
    if (abort?.aborted) return;
    runtime.error?.(danger(`imessage: monitor failed: ${String(err)}`));
    throw err;
  } finally {
    clearInterval(approvalReactionPollTimer);
    clearInterval(approvalReactionDiscoveryTimer);
    approvalContextLease?.dispose();
    detachAbortHandler();
    await activeClient.stop();
  }
}
//#endregion
export { monitorIMessageProvider as t };
