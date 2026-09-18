import crypto from "node:crypto";
import path from "node:path";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-C7N4Rwku.js";
import { f as summarizeMapping, u as mergeAllowlist } from "./allow-from-BCaLdTTU.js";
import { n as formatAllowlistMatchMeta } from "./allowlist-match-Cg15MVcF.js";
import { a as resolveInboundSessionEnvelopeContext } from "./channel-inbound-vhkYEe2n.js";
import { r as keepHttpServerTaskAlive } from "./channel-lifecycle.core-BZ1pethE.js";
import { n as createChannelPairingController } from "./channel-pairing-1V8FM4wM.js";
import { t as parseMediaContentLength } from "./content-length-CHOuQ9D3.js";
import { t as buildChannelInboundEventContext } from "./context-DMJN91Z-.js";
import { t as resolveChannelContextVisibilityMode } from "./context-visibility-BVlvSMUZ.js";
import { n as filterSupplementalContextItems } from "./context-visibility-C5CaKMWO.js";
import { n as isDangerousNameMatchingEnabled } from "./dangerous-name-matching-Z6nhxFXz.js";
import { t as createPersistentDedupeCache } from "./dedupe-runtime-Cpo1VwnM.js";
import {
  n as formatMSTeamsSendErrorHint,
  r as formatUnknownError,
  t as classifyMSTeamsSendError,
} from "./errors-H7JG5Gly.js";
import { o as saveResponseMedia } from "./fetch-BZzOpPxp.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-Da47iiZE.js";
import {
  A as resolveMSTeamsSdkCloudOptions,
  B as isDownloadableAttachment,
  C as loadMSTeamsSdkWithAuth,
  F as applyAuthorizationHeaderForUrl,
  G as resolveMediaSsrfPolicy,
  H as isUrlAllowed,
  I as encodeGraphShareId,
  J as safeHostForUrl,
  K as resolveRequestUrl,
  L as extractHtmlFromAttachment,
  M as ATTACHMENT_TAG_RE,
  N as GRAPH_ROOT,
  P as IMG_SRC_RE,
  Q as withMSTeamsRequestDeadline,
  R as extractInlineImageCandidates,
  S as createMSTeamsTokenProvider,
  T as ensureUserAgentHeader,
  U as normalizeContentType,
  V as isLikelyImageAttachment,
  W as resolveAttachmentFetchPolicy,
  X as createMSTeamsInboundDeadline,
  Y as tryBuildGraphSharesUrlForSharedLink,
  Z as resolveMSTeamsRequestTimeoutMs,
  k as tryNormalizeBotFrameworkServiceUrl,
  q as safeFetchWithPolicy,
  v as resolveMSTeamsCredentials,
  x as createMSTeamsExpressAdapter,
  z as inferPlaceholder,
} from "./graph-users-s5ZqGi_X.js";
import "./number-runtime-B-n-wjMn.js";
import "./security-runtime-CraX8Pqe.js";
import { n as DEFAULT_WEBHOOK_MAX_BODY_BYTES } from "./http-body-aoMvQQlg.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./text-utility-runtime-CJESZCN5.js";
import "./routing-CwvmVRHd.js";
import { o as dispatchReplyFromConfigWithSettledDispatcher } from "./inbound-reply-dispatch-DquY2pbK.js";
import {
  d as resolveChannelTurnDispatchCounts,
  l as hasFinalChannelTurnDispatch,
  m as formatInboundMediaUnavailableText,
} from "./kernel-BhdvbEs2.js";
import { n as logInboundDrop, r as logTypingFailure } from "./logging-gUWPKC5g.js";
import "./history-DdfM33Aj.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { a as resolveChannelMediaMaxBytes } from "./media-runtime-BhmZORKM.js";
import { n as resolveInboundMentionDecision } from "./mention-gating-3P8aSD7o.js";
import {
  i as resolveStableChannelMessageIngress,
  t as channelIngressRoutes,
} from "./message-access-DY5sc0VK.js";
import {
  A as formatThreadContext,
  C as parseFileConsentInvoke,
  D as fetchChannelMessage,
  E as resolveMSTeamsReactionEmoji,
  O as fetchChatMessageText,
  S as buildFileInfoCard,
  _ as removePendingUpload,
  a as sendMSTeamsActivityWithReference,
  b as removePendingUploadFs,
  g as getPendingUpload,
  j as stripHtmlFromTeamsMessage,
  k as fetchThreadReplies,
  n as renderReplyPayloadsToMessages,
  r as sendMSTeamsMessages,
  s as withRevokedProxyFallback,
  t as buildConversationReference,
  w as uploadToConsentUrl,
  y as getPendingUploadFs,
} from "./messenger-CaT39Loc.js";
import {
  C as resolveExpiresAtMsFromDurationMs,
  o as asDateTimestampMs,
} from "./number-coercion-CJQ8TR--.js";
import {
  i as resolveMSTeamsRouteConfig,
  r as resolveMSTeamsReplyPolicy,
  t as resolveMSTeamsAllowlistMatch,
} from "./policy-BV-fZxju.js";
import "./channel-outbound-DlkFd7rO.js";
import {
  l as createMSTeamsPollStoreState,
  u as extractMSTeamsPollVote,
  v as createMSTeamsConversationStoreState,
} from "./polls-XDDfaapC.js";
import {
  f as readProviderJsonArrayFieldResponse,
  m as readProviderJsonResponse,
} from "./provider-http-errors-DLMRBkZU.js";
import "./ssrf-runtime-DJ478vv8.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { t as appendRegularFile } from "./regular-file-CuvhUtZS.js";
import "./channel-ingress-runtime-B6CHO2ZB.js";
import { t as createChannelHistoryWindow } from "./reply-history-DTabwFaD.js";
import "./provider-http-BDIltggC.js";
import { S as buildMediaPayload } from "./reply-payload-DDwHXDkv.js";
import "./runtime-api-Btu8oXbZ.js";
import { t as createChannelReplyPipeline } from "./reply-pipeline-uYpC1TSz.js";
import {
  c as projectStableMSTeamsTeamsConfig,
  d as resolveMSTeamsTeamsConfig,
  f as resolveMSTeamsUserAllowlist,
  l as projectStableMSTeamsUserAllowlist,
} from "./resolve-allowlist-Du9yhYbg.js";
import { n as getOptionalMSTeamsRuntime, t as getMSTeamsRuntime } from "./runtime-6g-cPOGH.js";
import { r as resolveDefaultGroupPolicy } from "./runtime-group-policy-BEjP88cf.js";
import { p as resolveThreadSessionKeys } from "./session-key-druuY-GG.js";
import { i as createMSTeamsSsoTokenStoreFs } from "./sso-token-store-RYuVZ3SE.js";
import {
  D as resolveChannelStreamingSuppressDefaultToolProgressMessages,
  a as createChannelProgressDraftGate,
  b as resolveChannelProgressDraftMaxLines,
  c as formatChannelProgressDraftText,
  h as resolveChannelPreviewStreamMode,
  i as buildChannelProgressDraftLineForEntry,
  j as resolveChannelStreamingBlockEnabled,
  m as normalizeChannelProgressDraftLineIdentity,
  p as mergeChannelProgressDraftLine,
  r as buildChannelProgressDraftLine,
  u as isChannelProgressDraftWorkToolName,
  w as resolveChannelStreamingPreviewToolProgress,
} from "./streaming-D_YE0SPS.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import {
  a as parseMSTeamsActivityTimestamp,
  i as normalizeMSTeamsConversationId,
  n as extractMSTeamsConversationMessageId,
  o as stripMSTeamsMentionTags,
  r as extractMSTeamsQuoteInfo,
  s as wasMSTeamsBotMentioned,
  t as resolveMSTeamsRouteSessionKey,
} from "./thread-session-fdhTGrrY.js";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region extensions/msteams/src/feedback-reflection-prompt.ts
/** Max chars of the thumbed-down response to include in the reflection prompt. */
const MAX_RESPONSE_CHARS = 500;
function buildReflectionPrompt(params) {
  const parts = ["A user indicated your previous response wasn't helpful."];
  if (params.thumbedDownResponse) {
    const truncated =
      params.thumbedDownResponse.length > MAX_RESPONSE_CHARS
        ? `${truncateUtf16Safe(params.thumbedDownResponse, MAX_RESPONSE_CHARS)}...`
        : params.thumbedDownResponse;
    parts.push(`\nYour response was:\n> ${truncated}`);
  }
  if (params.userComment) parts.push(`\nUser's comment: "${params.userComment}"`);
  parts.push(
    '\nBriefly reflect: what could you improve? Consider tone, length, accuracy, relevance, and specificity. Reply with a single JSON object only, no markdown or prose, using this exact shape:\n{"learning":"...","followUp":false,"userMessage":""}\n- learning: a short internal adjustment note (1-2 sentences) for your future behavior in this conversation.\n- followUp: true only if the user needs a direct follow-up message.\n- userMessage: only the exact user-facing message to send; empty string when followUp is false.',
  );
  return parts.join("\n");
}
function parseBooleanLike(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = normalizeOptionalLowercaseString(value);
    if (normalized === "true" || normalized === "yes") return true;
    if (normalized === "false" || normalized === "no") return false;
  }
}
function parseStructuredReflectionValue(value) {
  if (value == null || typeof value !== "object" || Array.isArray(value)) return null;
  const candidate = value;
  const learning = typeof candidate.learning === "string" ? candidate.learning.trim() : void 0;
  if (!learning) return null;
  return {
    learning,
    followUp: parseBooleanLike(candidate.followUp) ?? false,
    userMessage:
      typeof candidate.userMessage === "string" && candidate.userMessage.trim()
        ? candidate.userMessage.trim()
        : void 0,
  };
}
function parseReflectionResponse(text) {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const candidates = [
    trimmed,
    ...(trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)?.slice(1, 2) ?? []),
  ];
  for (const candidateText of candidates) {
    const candidate = candidateText.trim();
    if (!candidate) continue;
    try {
      const parsed = parseStructuredReflectionValue(JSON.parse(candidate));
      if (parsed) return parsed;
    } catch {}
  }
  return {
    learning: trimmed,
    followUp: false,
  };
}
/** Tracks last reflection time per session to enforce cooldown. */
const lastReflectionBySession = /* @__PURE__ */ new Map();
/** Maximum cooldown entries before pruning expired ones. */
const MAX_COOLDOWN_ENTRIES = 500;
const LEARNINGS_NAMESPACE = "feedback-learnings";
const MAX_LEARNING_ENTRIES = 1e4;
function learningStoreKey(storePath, sessionKey) {
  return crypto.createHash("sha256").update(`${storePath}\0${sessionKey}`, "utf8").digest("hex");
}
function openLearningStore() {
  return getMSTeamsRuntime().state.openKeyedStore({
    namespace: LEARNINGS_NAMESPACE,
    maxEntries: MAX_LEARNING_ENTRIES,
  });
}
/** Prune expired cooldown entries to prevent unbounded memory growth. */
function pruneExpiredCooldowns(cooldownMs) {
  if (lastReflectionBySession.size <= MAX_COOLDOWN_ENTRIES) return;
  const now = Date.now();
  for (const [key, time] of lastReflectionBySession)
    if (now - time >= cooldownMs) lastReflectionBySession.delete(key);
}
/** Check if a reflection is allowed (cooldown not active). */
function isReflectionAllowed(sessionKey, cooldownMs) {
  const cooldown = cooldownMs ?? 3e5;
  const lastTime = lastReflectionBySession.get(sessionKey);
  if (lastTime == null) return true;
  return Date.now() - lastTime >= cooldown;
}
/** Record that a reflection was run for a session. */
function recordReflectionTime(sessionKey, cooldownMs) {
  lastReflectionBySession.set(sessionKey, Date.now());
  pruneExpiredCooldowns(cooldownMs ?? 3e5);
}
/** Store a learning derived from feedback reflection. */
async function storeSessionLearning(params) {
  const store = openLearningStore();
  const key = learningStoreKey(params.storePath, params.sessionKey);
  let learnings = (await store.lookup(key))?.learnings ?? [];
  learnings.push(params.learning);
  if (learnings.length > 10) learnings = learnings.slice(-10);
  await store.register(key, {
    sessionKey: params.sessionKey,
    learnings,
    updatedAt: Date.now(),
  });
}
//#endregion
//#region extensions/msteams/src/feedback-reflection.ts
function buildFeedbackEvent(params) {
  return {
    type: "custom",
    event: "feedback",
    ts: Date.now(),
    messageId: params.messageId,
    value: params.value,
    comment: params.comment,
    sessionKey: params.sessionKey,
    agentId: params.agentId,
    conversationId: params.conversationId,
  };
}
function buildReflectionContext(params) {
  const core = getMSTeamsRuntime();
  const envelopeOptions = core.channel.reply.resolveEnvelopeFormatOptions(params.cfg);
  const body = core.channel.reply.formatAgentEnvelope({
    channel: "Teams",
    from: "system",
    body: params.reflectionPrompt,
    envelope: envelopeOptions,
  });
  return {
    ctxPayload: core.channel.reply.finalizeInboundContext({
      Body: body,
      BodyForAgent: params.reflectionPrompt,
      RawBody: params.reflectionPrompt,
      CommandBody: params.reflectionPrompt,
      From: `msteams:system:${params.conversationId}`,
      To: `conversation:${params.conversationId}`,
      SessionKey: params.sessionKey,
      ChatType: "direct",
      SenderName: "system",
      SenderId: "system",
      Provider: "msteams",
      Surface: "msteams",
      Timestamp: Date.now(),
      WasMentioned: true,
      CommandAuthorized: false,
      OriginatingChannel: "msteams",
      OriginatingTo: `conversation:${params.conversationId}`,
    }),
  };
}
function createReflectionCaptureDispatcher(params) {
  const core = getMSTeamsRuntime();
  let response = "";
  const { dispatcher, replyOptions } = core.channel.reply.createReplyDispatcherWithTyping({
    deliver: async (payload) => {
      if (payload.text) response += (response ? "\n" : "") + payload.text;
    },
    typingCallbacks: {
      onReplyStart: async () => {},
      onIdle: () => {},
      onCleanup: () => {},
    },
    humanDelay: core.channel.reply.resolveHumanDelayConfig(params.cfg, params.agentId),
    onError: (err) => {
      params.log.debug?.("reflection reply error", { error: formatUnknownError(err) });
    },
  });
  return {
    dispatcher,
    replyOptions,
    readResponse: () => response,
  };
}
async function sendReflectionFollowUp(params) {
  const baseRef = buildConversationReference(params.conversationRef);
  await sendMSTeamsActivityWithReference(
    params.app,
    baseRef,
    {
      type: "message",
      text: params.userMessage,
    },
    { serviceUrlBoundary: resolveMSTeamsSdkCloudOptions(params.cfg.channels?.msteams) },
  );
}
/**
 * Run a background reflection after negative feedback.
 * This is designed to be called fire-and-forget (don't await in the invoke handler).
 */
async function runFeedbackReflection(params) {
  const { cfg, log, sessionKey } = params;
  const cooldownMs = cfg.channels?.msteams?.feedbackReflectionCooldownMs ?? 3e5;
  if (!isReflectionAllowed(sessionKey, cooldownMs)) {
    log.debug?.("skipping reflection (cooldown active)", { sessionKey });
    return;
  }
  const reflectionPrompt = buildReflectionPrompt({
    thumbedDownResponse: params.thumbedDownResponse,
    userComment: params.userComment,
  });
  const storePath = getMSTeamsRuntime().channel.session.resolveStorePath(cfg.session?.store, {
    agentId: params.agentId,
  });
  const { ctxPayload } = buildReflectionContext({
    cfg,
    conversationId: params.conversationId,
    sessionKey: params.sessionKey,
    reflectionPrompt,
  });
  const capture = createReflectionCaptureDispatcher({
    cfg,
    agentId: params.agentId,
    log,
  });
  try {
    await dispatchReplyFromConfigWithSettledDispatcher({
      ctxPayload,
      cfg,
      dispatcher: capture.dispatcher,
      onSettled: () => {},
      replyOptions: capture.replyOptions,
    });
  } catch (err) {
    log.error("reflection dispatch failed", { error: formatUnknownError(err) });
    return;
  }
  const reflectionResponse = capture.readResponse().trim();
  if (!reflectionResponse) {
    log.debug?.("reflection produced no output");
    return;
  }
  const parsedReflection = parseReflectionResponse(reflectionResponse);
  if (!parsedReflection) {
    log.debug?.("reflection produced no structured output");
    return;
  }
  recordReflectionTime(sessionKey, cooldownMs);
  log.info("reflection complete", {
    sessionKey,
    responseLength: reflectionResponse.length,
    followUp: parsedReflection.followUp,
  });
  try {
    await storeSessionLearning({
      storePath,
      sessionKey: params.sessionKey,
      learning: parsedReflection.learning,
    });
  } catch (err) {
    log.debug?.("failed to store reflection learning", { error: formatUnknownError(err) });
  }
  const conversationType = normalizeOptionalLowercaseString(
    params.conversationRef.conversation?.conversationType,
  );
  if (
    !(
      conversationType === "personal" &&
      parsedReflection.followUp &&
      Boolean(parsedReflection.userMessage)
    )
  ) {
    if (parsedReflection.followUp && conversationType !== "personal")
      log.debug?.("skipping reflection follow-up outside direct message", {
        sessionKey,
        conversationType,
      });
    return;
  }
  try {
    await sendReflectionFollowUp({
      cfg,
      app: params.app,
      conversationRef: params.conversationRef,
      userMessage: parsedReflection.userMessage,
    });
    log.info("sent reflection follow-up", { sessionKey });
  } catch (err) {
    log.debug?.("failed to send reflection follow-up", { error: formatUnknownError(err) });
  }
}
//#endregion
//#region extensions/msteams/src/adaptive-card-submit.ts
function extractAdaptiveCardSubmittedData(value) {
  if (!isRecord(value)) return value;
  const action = isRecord(value.action) ? value.action : void 0;
  if (
    action &&
    normalizeOptionalLowercaseString(action.type) === "action.submit" &&
    "data" in action
  )
    return action.data;
  return value;
}
function readMSTeamsImBackValue(value) {
  if (!isRecord(value)) return null;
  const msteams = isRecord(value.msteams) ? value.msteams : void 0;
  if (!msteams || normalizeOptionalLowercaseString(msteams.type) !== "imback") return null;
  return normalizeOptionalString(msteams.value) ?? null;
}
function serializeMSTeamsAdaptiveCardActionValue(value) {
  const submittedValue = extractAdaptiveCardSubmittedData(value);
  if (typeof submittedValue === "string") {
    const trimmed = submittedValue.trim();
    return trimmed ? trimmed : null;
  }
  const imBackValue = readMSTeamsImBackValue(submittedValue);
  if (imBackValue) return imBackValue;
  if (submittedValue == null) return null;
  try {
    return JSON.stringify(submittedValue);
  } catch {
    return null;
  }
}
//#endregion
//#region extensions/msteams/src/monitor-handler/access.ts
const msteamsIngressIdentity = {
  key: "sender-id",
  normalize: normalizeIngressValue,
  aliases: [
    {
      key: "sender-name",
      kind: "plugin:msteams-sender-name",
      normalizeEntry: normalizeIngressValue,
      normalizeSubject: normalizeIngressValue,
      dangerous: true,
    },
  ],
  isWildcardEntry: (entry) => normalizeIngressValue(entry) === "*",
  resolveEntryId: ({ entryIndex, fieldKey }) =>
    `msteams-entry-${entryIndex + 1}:${fieldKey === "sender-name" ? "name" : "id"}`,
};
function normalizeIngressValue(value) {
  return normalizeOptionalLowercaseString(value) ?? null;
}
async function resolveMSTeamsSenderAccess(params) {
  const activity = params.activity;
  const msteamsCfg = params.cfg.channels?.msteams;
  const conversationId = normalizeMSTeamsConversationId(activity.conversation?.id ?? "unknown");
  const convType = normalizeOptionalLowercaseString(activity.conversation?.conversationType);
  const isDirectMessage = convType === "personal" || (!convType && !activity.conversation?.isGroup);
  const senderId = activity.from?.aadObjectId ?? activity.from?.id ?? "unknown";
  const senderName = activity.from?.name ?? activity.from?.id ?? senderId;
  const pairing = createChannelPairingController({
    core: getMSTeamsRuntime(),
    channel: "msteams",
    accountId: DEFAULT_ACCOUNT_ID,
  });
  const dmPolicy = msteamsCfg?.dmPolicy ?? "pairing";
  const configuredDmAllowFrom = msteamsCfg?.allowFrom ?? [];
  const groupAllowFrom = msteamsCfg?.groupAllowFrom;
  const defaultGroupPolicy = resolveDefaultGroupPolicy(params.cfg);
  const groupPolicy =
    !isDirectMessage && msteamsCfg
      ? (msteamsCfg.groupPolicy ?? defaultGroupPolicy ?? "allowlist")
      : "disabled";
  const allowNameMatching = isDangerousNameMatchingEnabled(msteamsCfg);
  const channelGate = resolveMSTeamsRouteConfig({
    cfg: msteamsCfg,
    teamId: activity.channelData?.team?.id,
    teamName: activity.channelData?.team?.name,
    conversationId,
    channelName: activity.channelData?.channel?.name,
    allowNameMatching,
  });
  return {
    ...(await resolveStableChannelMessageIngress({
      channelId: "msteams",
      accountId: pairing.accountId,
      identity: msteamsIngressIdentity,
      cfg: params.cfg,
      readStoreAllowFrom: pairing.readAllowFromStore,
      subject: {
        stableId: senderId,
        aliases: { "sender-name": senderName },
      },
      conversation: {
        kind: isDirectMessage ? "direct" : convType === "channel" ? "channel" : "group",
        id: conversationId,
        parentId: activity.channelData?.team?.id,
      },
      route: channelIngressRoutes(
        !isDirectMessage &&
          channelGate.allowlistConfigured && {
            id: "msteams:team-channel",
            kind: "nestedAllowlist",
            allowed: channelGate.allowed,
            precedence: 0,
            matchId: "msteams-route",
            ...(channelGate.allowed && groupPolicy === "allowlist"
              ? {
                  senderPolicy: "deny-when-empty",
                  senderAllowFromSource: "effective-group",
                }
              : {}),
          },
      ),
      dmPolicy,
      groupPolicy,
      policy: {
        groupAllowFromFallbackToAllowFrom: true,
        mutableIdentifierMatching: allowNameMatching ? "enabled" : "disabled",
      },
      allowFrom: configuredDmAllowFrom,
      groupAllowFrom,
      command: {
        allowTextCommands: true,
        hasControlCommand: params.hasControlCommand === true,
        directGroupAllowFrom: isDirectMessage ? "effective" : "none",
      },
    })),
    pairing,
    isDirectMessage,
    conversationId,
    senderId,
    senderName,
    msteamsCfg,
    dmPolicy,
    channelGate,
    allowNameMatching,
    groupPolicy,
  };
}
//#endregion
//#region extensions/msteams/src/attachments/bot-framework.ts
/**
 * Bot Framework Service token scope for requesting a token used against
 * the Bot Connector (v3) REST endpoints such as `/v3/attachments/{id}`.
 */
const BOT_FRAMEWORK_SCOPE = "https://api.botframework.com";
/**
 * Detect Bot Framework personal chat ("a:") and MSA orgid ("8:orgid:") conversation
 * IDs. These identifiers are not recognized by Graph's `/chats/{id}` endpoint, so we
 * must fetch media via the Bot Framework v3 attachments endpoint instead.
 *
 * Graph-compatible IDs start with `19:` and are left untouched by this detector.
 */
function isBotFrameworkPersonalChatId(conversationId) {
  if (typeof conversationId !== "string") return false;
  const trimmed = conversationId.trim();
  return trimmed.startsWith("a:") || trimmed.startsWith("8:orgid:");
}
function normalizeServiceUrl(serviceUrl) {
  return serviceUrl.replace(/\/+$/, "");
}
function buildBotFrameworkAttachmentHeaders(params) {
  const headers = ensureUserAgentHeader();
  applyAuthorizationHeaderForUrl({
    headers,
    url: params.url,
    authAllowHosts: params.policy.authAllowHosts,
    bearerToken: params.accessToken,
  });
  return headers;
}
async function fetchBotFrameworkAttachmentInfo(params) {
  const url = `${normalizeServiceUrl(params.serviceUrl)}/v3/attachments/${encodeURIComponent(params.attachmentId)}`;
  let response;
  try {
    response = await safeFetchWithPolicy({
      url,
      policy: params.policy,
      fetchFn: params.fetchFn,
      fetchFnSupportsDispatcher: params.fetchFnSupportsDispatcher,
      resolveFn: params.resolveFn,
      requestInit: {
        headers: buildBotFrameworkAttachmentHeaders({
          url,
          accessToken: params.accessToken,
          policy: params.policy,
        }),
      },
      timeoutMs: resolveMSTeamsRequestTimeoutMs(params.deadline),
    });
  } catch (err) {
    params.logger?.warn?.("msteams botFramework attachmentInfo fetch failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    return;
  }
  if (!response.ok) {
    await response.body?.cancel();
    params.logger?.warn?.("msteams botFramework attachmentInfo non-ok", {
      status: response.status,
    });
    return;
  }
  try {
    return await readProviderJsonResponse(response, "msteams botFramework attachmentInfo");
  } catch (err) {
    params.logger?.warn?.("msteams botFramework attachmentInfo parse failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    return;
  }
}
async function saveBotFrameworkAttachmentView(params) {
  const url = `${normalizeServiceUrl(params.serviceUrl)}/v3/attachments/${encodeURIComponent(params.attachmentId)}/views/${encodeURIComponent(params.viewId)}`;
  let response;
  try {
    response = await safeFetchWithPolicy({
      url,
      policy: params.policy,
      fetchFn: params.fetchFn,
      fetchFnSupportsDispatcher: params.fetchFnSupportsDispatcher,
      resolveFn: params.resolveFn,
      requestInit: {
        headers: buildBotFrameworkAttachmentHeaders({
          url,
          accessToken: params.accessToken,
          policy: params.policy,
        }),
      },
      timeoutMs: resolveMSTeamsRequestTimeoutMs(params.deadline),
    });
  } catch (err) {
    params.logger?.warn?.("msteams botFramework attachmentView fetch failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    return;
  }
  if (!response.ok) {
    await response.body?.cancel();
    params.logger?.warn?.("msteams botFramework attachmentView non-ok", {
      status: response.status,
    });
    return;
  }
  let contentLength;
  try {
    contentLength = parseMediaContentLength(response.headers.get("content-length"));
  } catch (err) {
    await response.body?.cancel();
    params.logger?.warn?.("msteams botFramework attachmentView invalid content-length", {
      error: err instanceof Error ? err.message : String(err),
    });
    return;
  }
  if (contentLength !== null && contentLength > params.maxBytes) {
    await response.body?.cancel();
    return;
  }
  try {
    return await getMSTeamsRuntime().channel.media.saveResponseMedia(response, {
      sourceUrl: url,
      filePathHint: params.fileNameHint,
      maxBytes: params.maxBytes,
      fallbackContentType: params.contentTypeHint,
      subdir: "inbound",
      originalFilename: params.preserveFilenames ? params.fileNameHint : void 0,
    });
  } catch (err) {
    params.logger?.warn?.("msteams botFramework attachmentView save failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    return;
  } finally {
    await response.body?.cancel().catch(() => void 0);
  }
}
/**
 * Download media for a single attachment via the Bot Framework v3 attachments
 * endpoint. Used for personal DM conversations where the Graph `/chats/{id}`
 * path is not usable because the Bot Framework conversation ID (`a:...`) is
 * not a valid Graph chat identifier.
 */
async function downloadMSTeamsBotFrameworkAttachment(params) {
  if (!params.serviceUrl || !params.attachmentId || !params.tokenProvider) return;
  const tokenProvider = params.tokenProvider;
  const policy = resolveAttachmentFetchPolicy({
    allowHosts: params.allowHosts,
    authAllowHosts: params.authAllowHosts,
  });
  if (
    !isUrlAllowed(
      `${normalizeServiceUrl(params.serviceUrl)}/v3/attachments/${encodeURIComponent(params.attachmentId)}`,
      policy.allowHosts,
    )
  )
    return;
  let accessToken;
  try {
    accessToken = await withMSTeamsRequestDeadline({
      deadline: params.deadline,
      label: "MS Teams Bot Framework token",
      work: () => tokenProvider.getAccessToken(BOT_FRAMEWORK_SCOPE),
    });
  } catch (err) {
    params.logger?.warn?.("msteams botFramework token acquisition failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    return;
  }
  if (!accessToken) return;
  const info = await fetchBotFrameworkAttachmentInfo({
    serviceUrl: params.serviceUrl,
    attachmentId: params.attachmentId,
    accessToken,
    policy,
    fetchFn: params.fetchFn,
    fetchFnSupportsDispatcher: params.fetchFnSupportsDispatcher,
    resolveFn: params.resolveFn,
    logger: params.logger,
    deadline: params.deadline,
  });
  if (!info) return;
  const views = Array.isArray(info.views) ? info.views : [];
  const candidateView =
    views.find((view) => view?.viewId === "original") ??
    views.find((view) => typeof view?.viewId === "string");
  const viewId =
    typeof candidateView?.viewId === "string" && candidateView.viewId
      ? candidateView.viewId
      : void 0;
  if (!viewId) return;
  if (
    typeof candidateView?.size === "number" &&
    candidateView.size > 0 &&
    candidateView.size > params.maxBytes
  )
    return;
  const fileNameHint =
    (typeof params.fileNameHint === "string" && params.fileNameHint) ||
    (typeof info.name === "string" && info.name) ||
    void 0;
  const contentTypeHint =
    (typeof params.contentTypeHint === "string" && params.contentTypeHint) ||
    (typeof info.type === "string" && info.type) ||
    void 0;
  const saved = await saveBotFrameworkAttachmentView({
    serviceUrl: params.serviceUrl,
    attachmentId: params.attachmentId,
    viewId,
    accessToken,
    maxBytes: params.maxBytes,
    fileNameHint,
    contentTypeHint,
    preserveFilenames: params.preserveFilenames,
    policy,
    fetchFn: params.fetchFn,
    fetchFnSupportsDispatcher: params.fetchFnSupportsDispatcher,
    resolveFn: params.resolveFn,
    logger: params.logger,
    deadline: params.deadline,
  });
  if (!saved) return;
  return {
    path: saved.path,
    contentType: saved.contentType,
    placeholder: inferPlaceholder({
      contentType: saved.contentType,
      fileName: fileNameHint,
    }),
  };
}
/**
 * Download media for every attachment referenced by a Bot Framework personal
 * chat activity. Returns all successfully fetched media along with diagnostics
 * compatible with `downloadMSTeamsGraphMedia`'s result shape so callers can
 * reuse the existing logging path.
 */
async function downloadMSTeamsBotFrameworkAttachments(params) {
  const seen = /* @__PURE__ */ new Set();
  const unique = [];
  for (const id of params.attachmentIds ?? []) {
    if (typeof id !== "string") continue;
    const trimmed = id.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    unique.push(trimmed);
  }
  if (unique.length === 0 || !params.serviceUrl || !params.tokenProvider)
    return {
      media: [],
      attachmentCount: unique.length,
    };
  const media = [];
  for (const attachmentId of unique)
    try {
      const item = await downloadMSTeamsBotFrameworkAttachment({
        serviceUrl: params.serviceUrl,
        attachmentId,
        tokenProvider: params.tokenProvider,
        maxBytes: params.maxBytes,
        allowHosts: params.allowHosts,
        authAllowHosts: params.authAllowHosts,
        fetchFn: params.fetchFn,
        fetchFnSupportsDispatcher: params.fetchFnSupportsDispatcher,
        resolveFn: params.resolveFn,
        deadline: params.deadline,
        fileNameHint: params.fileNameHint,
        contentTypeHint: params.contentTypeHint,
        preserveFilenames: params.preserveFilenames,
        logger: params.logger,
      });
      if (item) media.push(item);
    } catch (err) {
      params.logger?.warn?.("msteams botFramework attachment download failed", {
        error: err instanceof Error ? err.message : String(err),
        attachmentId,
      });
    }
  return {
    media,
    attachmentCount: unique.length,
  };
}
//#endregion
//#region extensions/msteams/src/attachments/remote-media.ts
/**
 * Direct save path used when the caller supplies the already-guarded fetch
 * implementation. This lets Teams-specific auth fallback own the request
 * sequence while keeping redirect and DNS pinning inside `safeFetchWithPolicy`.
 */
async function saveRemoteMediaDirect(params) {
  const response = await params.fetchImpl(params.url, { redirect: "follow" });
  try {
    return await saveResponseMedia(response, {
      sourceUrl: params.url,
      filePathHint: params.filePathHint,
      maxBytes: params.maxBytes,
      fallbackContentType: params.contentTypeHint,
      originalFilename: params.originalFilename,
    });
  } finally {
    await response.body?.cancel().catch(() => void 0);
  }
}
async function downloadAndStoreMSTeamsRemoteMedia(params) {
  const originalFilename = params.preserveFilenames ? params.filePathHint : void 0;
  let saved;
  if (params.useDirectFetch && params.fetchImpl)
    saved = await saveRemoteMediaDirect({
      url: params.url,
      filePathHint: params.filePathHint,
      fetchImpl: params.fetchImpl,
      maxBytes: params.maxBytes,
      contentTypeHint: params.contentTypeHint,
      originalFilename,
    });
  else
    saved = await getMSTeamsRuntime().channel.media.saveRemoteMedia({
      url: params.url,
      fetchImpl: params.fetchImpl,
      filePathHint: params.filePathHint,
      maxBytes: params.maxBytes,
      ssrfPolicy: params.ssrfPolicy,
      fallbackContentType: params.contentTypeHint,
      originalFilename,
    });
  return {
    path: saved.path,
    contentType: saved.contentType,
    placeholder:
      params.placeholder ??
      inferPlaceholder({
        contentType: saved.contentType,
        fileName: params.filePathHint,
      }),
  };
}
//#endregion
//#region extensions/msteams/src/attachments/download.ts
function resolveDownloadCandidate(att) {
  const contentType = normalizeContentType(att.contentType);
  const name = normalizeOptionalString(att.name) ?? "";
  if (contentType === "application/vnd.microsoft.teams.file.download.info") {
    if (!isRecord(att.content)) return null;
    const downloadUrl = normalizeOptionalString(att.content.downloadUrl) ?? "";
    if (!downloadUrl) return null;
    const fileType = normalizeOptionalString(att.content.fileType) ?? "";
    const uniqueId = normalizeOptionalString(att.content.uniqueId) ?? "";
    const fileName = normalizeOptionalString(att.content.fileName) ?? "";
    const fileHint = name || fileName || (uniqueId && fileType ? `${uniqueId}.${fileType}` : "");
    return {
      url: downloadUrl,
      fileHint: fileHint || void 0,
      contentTypeHint: void 0,
      placeholder: inferPlaceholder({
        contentType,
        fileName: fileHint,
        fileType,
      }),
    };
  }
  const contentUrl = normalizeOptionalString(att.contentUrl) ?? "";
  if (!contentUrl) return null;
  const sharesUrl = tryBuildGraphSharesUrlForSharedLink(contentUrl);
  return {
    url: sharesUrl ?? contentUrl,
    fileHint: name || void 0,
    contentTypeHint: sharesUrl ? void 0 : contentType,
    placeholder: inferPlaceholder({
      contentType,
      fileName: name,
    }),
  };
}
function scopeCandidatesForUrl(url) {
  try {
    const host = normalizeLowercaseStringOrEmpty(new URL(url).hostname);
    return host.endsWith("graph.microsoft.com") ||
      host.endsWith("sharepoint.com") ||
      host.endsWith("1drv.ms") ||
      host.includes("sharepoint")
      ? ["https://graph.microsoft.com", "https://api.botframework.com"]
      : ["https://api.botframework.com", "https://graph.microsoft.com"];
  } catch {
    return ["https://api.botframework.com", "https://graph.microsoft.com"];
  }
}
function isRedirectStatus(status) {
  return status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
}
async function resolveInlineDataImageMime(inline) {
  const mime = normalizeOptionalLowercaseString(
    (await getMSTeamsRuntime().media.detectMime({
      buffer: inline.data,
      headerMime: inline.contentType,
    })) ?? inline.contentType,
  );
  return mime?.startsWith("image/") ? mime : void 0;
}
async function fetchWithAuthFallback(params) {
  const firstAttempt = await safeFetchWithPolicy({
    url: params.url,
    policy: params.policy,
    fetchFn: params.fetchFn,
    fetchFnSupportsDispatcher: params.fetchFnSupportsDispatcher,
    requestInit: params.requestInit,
    resolveFn: params.resolveFn,
    timeoutMs: resolveMSTeamsRequestTimeoutMs(params.deadline),
  });
  if (firstAttempt.ok) return firstAttempt;
  if (!params.tokenProvider) return firstAttempt;
  const tokenProvider = params.tokenProvider;
  if (firstAttempt.status !== 401 && firstAttempt.status !== 403) return firstAttempt;
  if (!isUrlAllowed(params.url, params.policy.authAllowHosts)) return firstAttempt;
  await firstAttempt.body?.cancel();
  const scopes = scopeCandidatesForUrl(params.url);
  const fetchFn = params.fetchFn ?? fetch;
  for (const scope of scopes)
    try {
      const token = await withMSTeamsRequestDeadline({
        deadline: params.deadline,
        label: "MS Teams attachment token",
        work: () => tokenProvider.getAccessToken(scope),
      });
      const authHeaders = new Headers(params.requestInit?.headers);
      authHeaders.set("Authorization", `Bearer ${token}`);
      const authAttempt = await safeFetchWithPolicy({
        url: params.url,
        policy: params.policy,
        fetchFn,
        fetchFnSupportsDispatcher: params.fetchFnSupportsDispatcher,
        requestInit: {
          ...params.requestInit,
          headers: authHeaders,
        },
        resolveFn: params.resolveFn,
        timeoutMs: resolveMSTeamsRequestTimeoutMs(params.deadline),
      });
      if (authAttempt.ok) return authAttempt;
      if (isRedirectStatus(authAttempt.status)) return authAttempt;
      if (authAttempt.status !== 401 && authAttempt.status !== 403) {
        await authAttempt.body?.cancel();
        continue;
      }
      await authAttempt.body?.cancel();
    } catch {}
  return firstAttempt;
}
/**
 * Download all file attachments from a Teams message (images, documents, etc.).
 * Renamed from downloadMSTeamsImageAttachments to support all file types.
 */
async function downloadMSTeamsAttachments(params) {
  const list = Array.isArray(params.attachments) ? params.attachments : [];
  if (list.length === 0) return [];
  const policy = resolveAttachmentFetchPolicy({
    allowHosts: params.allowHosts,
    authAllowHosts: params.authAllowHosts,
  });
  const allowHosts = policy.allowHosts;
  const ssrfPolicy = resolveMediaSsrfPolicy(allowHosts);
  const candidates = list
    .filter(isDownloadableAttachment)
    .map(resolveDownloadCandidate)
    .filter(Boolean);
  const inlineCandidates = extractInlineImageCandidates(list, {
    maxInlineBytes: params.maxBytes,
    maxInlineTotalBytes: params.maxBytes,
  });
  const seenUrls = /* @__PURE__ */ new Set();
  for (const inline of inlineCandidates)
    if (inline.kind === "url") {
      if (!isUrlAllowed(inline.url, allowHosts)) continue;
      if (seenUrls.has(inline.url)) continue;
      seenUrls.add(inline.url);
      candidates.push({
        url: inline.url,
        fileHint: inline.fileHint,
        contentTypeHint: inline.contentType,
        placeholder: inline.placeholder,
      });
    }
  if (candidates.length === 0 && inlineCandidates.length === 0) return [];
  const out = [];
  for (const inline of inlineCandidates) {
    if (inline.kind !== "data") continue;
    if (inline.data.byteLength > params.maxBytes) continue;
    try {
      const contentType = await resolveInlineDataImageMime(inline);
      if (!contentType) continue;
      const saved = await getMSTeamsRuntime().channel.media.saveMediaBuffer(
        inline.data,
        contentType,
        "inbound",
        params.maxBytes,
      );
      out.push({
        path: saved.path,
        contentType: saved.contentType,
        placeholder: inferPlaceholder({ contentType: saved.contentType ?? contentType }),
      });
    } catch (err) {
      params.logger?.warn?.("msteams inline attachment decode failed", {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
  for (const candidate of candidates) {
    if (!isUrlAllowed(candidate.url, allowHosts)) continue;
    try {
      const media = await downloadAndStoreMSTeamsRemoteMedia({
        url: candidate.url,
        filePathHint: candidate.fileHint ?? candidate.url,
        maxBytes: params.maxBytes,
        contentTypeHint: candidate.contentTypeHint,
        placeholder: candidate.placeholder,
        preserveFilenames: params.preserveFilenames,
        ssrfPolicy,
        useDirectFetch: true,
        fetchImpl: (input, init) =>
          fetchWithAuthFallback({
            url: resolveRequestUrl(input),
            tokenProvider: params.tokenProvider,
            fetchFn: params.fetchFn,
            fetchFnSupportsDispatcher: params.fetchFnSupportsDispatcher,
            requestInit: init,
            resolveFn: params.resolveFn,
            policy,
            deadline: params.deadline,
          }),
      });
      out.push(media);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      params.logger?.warn?.(
        `msteams attachment download failed host=${safeHostForLog(candidate.url)} error=${msg}`,
      );
    }
  }
  return out;
}
function safeHostForLog(url) {
  try {
    return new URL(url).host;
  } catch {
    return "invalid-url";
  }
}
//#endregion
//#region extensions/msteams/src/attachments/graph.ts
function buildMSTeamsGraphMessageUrl(params) {
  const conversationType = normalizeLowercaseStringOrEmpty(params.conversationType ?? "");
  const messageId = normalizeOptionalString(params.messageId);
  if (!messageId) return;
  if (conversationType === "channel") {
    const teamAadGroupId = normalizeOptionalString(params.teamAadGroupId);
    const channelId = normalizeOptionalString(params.channelId);
    if (!teamAadGroupId || !channelId) return;
    const messageRoot = `${GRAPH_ROOT}/teams/${encodeURIComponent(teamAadGroupId)}/channels/${encodeURIComponent(channelId)}/messages`;
    const threadRootMessageId = normalizeOptionalString(params.threadRootMessageId);
    return threadRootMessageId && threadRootMessageId !== messageId
      ? `${messageRoot}/${encodeURIComponent(threadRootMessageId)}/replies/${encodeURIComponent(messageId)}`
      : `${messageRoot}/${encodeURIComponent(messageId)}`;
  }
  const chatId = normalizeOptionalString(params.conversationId);
  if (!chatId) return;
  return `${GRAPH_ROOT}/chats/${encodeURIComponent(chatId)}/messages/${encodeURIComponent(messageId)}`;
}
async function fetchGraphCollection(params) {
  const fetchFn = params.fetchFn ?? fetch;
  const { response, release } = await fetchWithSsrFGuard({
    url: params.url,
    fetchImpl: fetchFn,
    init: { headers: ensureUserAgentHeader({ Authorization: `Bearer ${params.accessToken}` }) },
    policy: params.ssrfPolicy,
    auditContext: "msteams.graph.collection",
    timeoutMs: resolveMSTeamsRequestTimeoutMs(params.deadline),
  });
  try {
    const status = response.status;
    if (!response.ok)
      return {
        status,
        items: [],
      };
    try {
      return {
        status,
        items: await readProviderJsonArrayFieldResponse(
          response,
          "MS Teams Graph collection",
          "value",
        ),
      };
    } catch {
      return {
        status,
        items: [],
      };
    }
  } finally {
    await release();
  }
}
function normalizeGraphAttachment(att) {
  let content = att.content;
  if (typeof content === "string")
    try {
      content = JSON.parse(content);
    } catch {}
  return {
    contentType: normalizeContentType(att.contentType) ?? void 0,
    contentUrl: att.contentUrl ?? void 0,
    name: att.name ?? void 0,
    thumbnailUrl: att.thumbnailUrl ?? void 0,
    content,
  };
}
/**
 * Download all hosted content from a Teams message (images, documents, etc.).
 * Renamed from downloadGraphHostedImages to support all file types.
 */
async function downloadGraphHostedContent(params) {
  let hosted;
  try {
    hosted = await fetchGraphCollection({
      url: `${params.messageUrl}/hostedContents`,
      accessToken: params.accessToken,
      fetchFn: params.fetchFn,
      ssrfPolicy: params.ssrfPolicy,
      deadline: params.deadline,
    });
  } catch (err) {
    params.logger?.warn?.("msteams graph hostedContents fetch failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    return {
      media: [],
      count: 0,
    };
  }
  if (hosted.items.length === 0)
    return {
      media: [],
      status: hosted.status,
      count: 0,
    };
  const out = [];
  for (const item of hosted.items) {
    if (!item.id) continue;
    try {
      const valueUrl = `${params.messageUrl}/hostedContents/${encodeURIComponent(item.id)}/$value`;
      const { response: valRes, release } = await fetchWithSsrFGuard({
        url: valueUrl,
        fetchImpl: params.fetchFn ?? fetch,
        init: { headers: ensureUserAgentHeader({ Authorization: `Bearer ${params.accessToken}` }) },
        policy: params.ssrfPolicy,
        auditContext: "msteams.graph.hostedContent.value",
        timeoutMs: resolveMSTeamsRequestTimeoutMs(params.deadline),
      });
      try {
        if (!valRes.ok) continue;
        const saved = await getMSTeamsRuntime().channel.media.saveResponseMedia(valRes, {
          sourceUrl: valueUrl,
          maxBytes: params.maxBytes,
          fallbackContentType: item.contentType ?? void 0,
          subdir: "inbound",
        });
        out.push({
          path: saved.path,
          contentType: saved.contentType,
          placeholder: inferPlaceholder({ contentType: saved.contentType }),
        });
      } finally {
        await release();
      }
    } catch (err) {
      params.logger?.warn?.("msteams graph hostedContent value fetch failed", {
        error: err instanceof Error ? err.message : String(err),
      });
      continue;
    }
  }
  return {
    media: out,
    status: hosted.status,
    count: hosted.items.length,
  };
}
async function downloadMSTeamsGraphMedia(params) {
  if (!params.messageUrl || !params.tokenProvider) return { media: [] };
  const tokenProvider = params.tokenProvider;
  const policy = resolveAttachmentFetchPolicy({
    allowHosts: params.allowHosts,
    authAllowHosts: params.authAllowHosts,
  });
  const ssrfPolicy = resolveMediaSsrfPolicy(policy.allowHosts);
  const messageUrl = params.messageUrl;
  let accessToken;
  try {
    accessToken = await withMSTeamsRequestDeadline({
      deadline: params.deadline,
      label: "MS Teams Graph media token",
      work: () => tokenProvider.getAccessToken("https://graph.microsoft.com"),
    });
  } catch (err) {
    params.logger?.debug?.("graph media token acquisition failed", {
      messageUrl,
      error: err instanceof Error ? err.message : String(err),
    });
    params.logger?.warn?.("msteams graph token acquisition failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    return {
      media: [],
      messageUrl,
      tokenError: true,
    };
  }
  const fetchFn = params.fetchFn ?? fetch;
  const sharePointMedia = [];
  const downloadedReferenceUrls = /* @__PURE__ */ new Set();
  let messageAttachments = [];
  let referenceAttachments = [];
  let messageStatus;
  try {
    const { response: msgRes, release } = await fetchWithSsrFGuard({
      url: messageUrl,
      fetchImpl: fetchFn,
      init: { headers: ensureUserAgentHeader({ Authorization: `Bearer ${accessToken}` }) },
      policy: ssrfPolicy,
      auditContext: "msteams.graph.message",
      timeoutMs: resolveMSTeamsRequestTimeoutMs(params.deadline),
    });
    try {
      messageStatus = msgRes.status;
      if (msgRes.ok) {
        let msgData;
        try {
          msgData = await readProviderJsonResponse(msgRes, "MS Teams Graph message");
        } catch (err) {
          params.logger?.debug?.("graph media message parse failed", {
            messageUrl,
            error: err instanceof Error ? err.message : String(err),
          });
          params.logger?.warn?.("msteams graph message parse failed", {
            error: err instanceof Error ? err.message : String(err),
            messageUrl,
          });
          msgData = {};
        }
        messageAttachments = Array.isArray(msgData.attachments) ? msgData.attachments : [];
        referenceAttachments = messageAttachments.filter(
          (a) => a.contentType === "reference" && a.contentUrl && a.name,
        );
      } else
        params.logger?.debug?.("graph media message fetch not ok", {
          messageUrl,
          status: messageStatus,
        });
    } finally {
      await release();
    }
  } catch (err) {
    params.logger?.debug?.("graph media message fetch failed", {
      messageUrl,
      error: err instanceof Error ? err.message : String(err),
    });
    params.logger?.warn?.("msteams graph message fetch failed", {
      error: err instanceof Error ? err.message : String(err),
    });
  }
  for (const att of referenceAttachments) {
    const name = att.name ?? "file";
    const shareUrl = att.contentUrl ?? "";
    if (!shareUrl) continue;
    try {
      const sharesUrl = `${GRAPH_ROOT}/shares/${encodeGraphShareId(shareUrl)}/driveItem/content`;
      if (!isUrlAllowed(sharesUrl, policy.allowHosts)) {
        params.logger?.debug?.("graph media sharepoint url not in allowHosts", {
          messageUrl,
          sharesUrl,
        });
        continue;
      }
      const media = await downloadAndStoreMSTeamsRemoteMedia({
        url: sharesUrl,
        filePathHint: name,
        maxBytes: params.maxBytes,
        contentTypeHint: "application/octet-stream",
        preserveFilenames: params.preserveFilenames,
        ssrfPolicy,
        useDirectFetch: true,
        fetchImpl: async (input, init) => {
          const requestUrl = resolveRequestUrl(input);
          const headers = ensureUserAgentHeader(init?.headers);
          applyAuthorizationHeaderForUrl({
            headers,
            url: requestUrl,
            authAllowHosts: policy.authAllowHosts,
            bearerToken: accessToken,
          });
          return await safeFetchWithPolicy({
            url: requestUrl,
            policy,
            fetchFn,
            fetchFnSupportsDispatcher: params.fetchFnSupportsDispatcher,
            requestInit: {
              ...init,
              headers,
            },
            resolveFn: params.resolveFn,
            timeoutMs: resolveMSTeamsRequestTimeoutMs(params.deadline),
          });
        },
      });
      sharePointMedia.push(media);
      downloadedReferenceUrls.add(shareUrl);
    } catch (err) {
      params.logger?.warn?.("msteams SharePoint reference download failed", {
        error: err instanceof Error ? err.message : String(err),
        name,
      });
    }
  }
  const hosted = await downloadGraphHostedContent({
    accessToken,
    messageUrl,
    maxBytes: params.maxBytes,
    fetchFn: params.fetchFn,
    preserveFilenames: params.preserveFilenames,
    ssrfPolicy,
    logger: params.logger,
    deadline: params.deadline,
  });
  const normalizedAttachments = messageAttachments.map(normalizeGraphAttachment);
  const filteredAttachments =
    sharePointMedia.length > 0
      ? normalizedAttachments.filter((att) => {
          if (normalizeOptionalLowercaseString(att.contentType) !== "reference") return true;
          const url = typeof att.contentUrl === "string" ? att.contentUrl : "";
          if (!url) return true;
          return !downloadedReferenceUrls.has(url);
        })
      : normalizedAttachments;
  let attachmentMedia = [];
  try {
    attachmentMedia = await downloadMSTeamsAttachments({
      attachments: filteredAttachments,
      maxBytes: params.maxBytes,
      tokenProvider: params.tokenProvider,
      allowHosts: policy.allowHosts,
      authAllowHosts: policy.authAllowHosts,
      fetchFn: params.fetchFn,
      fetchFnSupportsDispatcher: params.fetchFnSupportsDispatcher,
      resolveFn: params.resolveFn,
      deadline: params.deadline,
      preserveFilenames: params.preserveFilenames,
      logger: params.logger,
    });
  } catch (err) {
    params.logger?.warn?.("msteams graph attachment download failed", {
      error: err instanceof Error ? err.message : String(err),
      messageUrl,
    });
  }
  return {
    media: [...sharePointMedia, ...hosted.media, ...attachmentMedia],
    hostedCount: hosted.count,
    attachmentCount: filteredAttachments.length + sharePointMedia.length,
    hostedStatus: hosted.status,
    attachmentStatus: messageStatus,
    messageUrl,
  };
}
//#endregion
//#region extensions/msteams/src/attachments/html.ts
/**
 * Extract every `<attachment id="...">` reference from the HTML attachments in
 * the inbound activity. Returns the complete (non-sliced) list; callers that
 * need a capped diagnostic summary can truncate after calling this helper.
 */
function extractMSTeamsHtmlAttachmentIds(attachments) {
  const list = Array.isArray(attachments) ? attachments : [];
  if (list.length === 0) return [];
  const ids = /* @__PURE__ */ new Set();
  for (const att of list) {
    const html = extractHtmlFromAttachment(att);
    if (!html) continue;
    ATTACHMENT_TAG_RE.lastIndex = 0;
    let match = ATTACHMENT_TAG_RE.exec(html);
    while (match) {
      const id = match[1]?.trim();
      if (id) ids.add(id);
      match = ATTACHMENT_TAG_RE.exec(html);
    }
  }
  return Array.from(ids);
}
function summarizeMSTeamsHtmlAttachments(attachments) {
  const list = Array.isArray(attachments) ? attachments : [];
  if (list.length === 0) return;
  let htmlAttachments = 0;
  let imgTags = 0;
  let dataImages = 0;
  let cidImages = 0;
  const srcHosts = /* @__PURE__ */ new Set();
  let attachmentTags = 0;
  const attachmentIds = /* @__PURE__ */ new Set();
  for (const att of list) {
    const html = extractHtmlFromAttachment(att);
    if (!html) continue;
    htmlAttachments += 1;
    IMG_SRC_RE.lastIndex = 0;
    let match = IMG_SRC_RE.exec(html);
    while (match) {
      imgTags += 1;
      const src = match[1]?.trim();
      if (src)
        if (src.startsWith("data:")) dataImages += 1;
        else if (src.startsWith("cid:")) cidImages += 1;
        else srcHosts.add(safeHostForUrl(src));
      match = IMG_SRC_RE.exec(html);
    }
    ATTACHMENT_TAG_RE.lastIndex = 0;
    let attachmentMatch = ATTACHMENT_TAG_RE.exec(html);
    while (attachmentMatch) {
      attachmentTags += 1;
      const id = attachmentMatch[1]?.trim();
      if (id) attachmentIds.add(id);
      attachmentMatch = ATTACHMENT_TAG_RE.exec(html);
    }
  }
  if (htmlAttachments === 0) return;
  return {
    htmlAttachments,
    imgTags,
    dataImages,
    cidImages,
    srcHosts: Array.from(srcHosts).slice(0, 5),
    attachmentTags,
    attachmentIds: Array.from(attachmentIds).slice(0, 5),
  };
}
function isAdvertisedFileAttachment(attachment) {
  const contentType = normalizeContentType(attachment.contentType) ?? "";
  if (
    contentType.startsWith("text/html") ||
    contentType.startsWith("application/vnd.microsoft.card.") ||
    contentType.startsWith("application/vnd.microsoft.teams.card.")
  )
    return false;
  return Boolean(
    isDownloadableAttachment(attachment) ||
    isLikelyImageAttachment(attachment) ||
    attachment.name?.trim() ||
    contentType,
  );
}
function countDistinctInlineImages(attachments) {
  const seenReferences = /* @__PURE__ */ new Set();
  let count = 0;
  for (const attachment of attachments) {
    const html = extractHtmlFromAttachment(attachment);
    if (!html) continue;
    IMG_SRC_RE.lastIndex = 0;
    let match = IMG_SRC_RE.exec(html);
    while (match) {
      const src = match[1]?.trim();
      if (src?.startsWith("data:")) count += 1;
      else if (src && !seenReferences.has(src)) {
        seenReferences.add(src);
        count += 1;
      }
      match = IMG_SRC_RE.exec(html);
    }
  }
  return count;
}
function countDistinctInlineCandidates(attachments, limits) {
  const seenUrls = /* @__PURE__ */ new Set();
  let dataCount = 0;
  for (const candidate of extractInlineImageCandidates(attachments, limits))
    if (candidate.kind === "data") dataCount += 1;
    else seenUrls.add(candidate.url);
  return dataCount + seenUrls.size;
}
function countUnrepresentedHtmlAttachmentIds(attachments) {
  const representedIds = /* @__PURE__ */ new Set();
  for (const attachment of attachments) {
    if ((normalizeContentType(attachment.contentType) ?? "").startsWith("text/html")) continue;
    const id = attachment.id?.trim();
    if (id) representedIds.add(id);
  }
  return extractMSTeamsHtmlAttachmentIds(attachments).filter((id) => !representedIds.has(id))
    .length;
}
function resolveMSTeamsInboundAttachmentPresentation(attachments, limits) {
  const list = Array.isArray(attachments) ? attachments : [];
  if (list.length === 0)
    return {
      placeholder: "",
      expectedMediaCount: 0,
    };
  const fileAttachments = list.filter(isAdvertisedFileAttachment);
  const inlinePlaceholderCount = countDistinctInlineCandidates(list, limits);
  const inlineExpectedCount = countDistinctInlineImages(list);
  const htmlAttachmentCount = countUnrepresentedHtmlAttachmentIds(list);
  const expectedMediaCount = fileAttachments.length + inlineExpectedCount + htmlAttachmentCount;
  if (expectedMediaCount === 0)
    return {
      placeholder: "",
      expectedMediaCount: 0,
    };
  const totalImages =
    fileAttachments.filter(isLikelyImageAttachment).length + inlinePlaceholderCount;
  if (totalImages > 0)
    return {
      placeholder: `<media:image>${totalImages > 1 ? ` (${totalImages} images)` : ""}`,
      expectedMediaCount,
    };
  return {
    placeholder: `<media:document>${expectedMediaCount > 1 ? ` (${expectedMediaCount} files)` : ""}`,
    expectedMediaCount,
  };
}
//#endregion
//#region extensions/msteams/src/attachments/payload.ts
function buildMSTeamsMediaPayload(mediaList) {
  return buildMediaPayload(mediaList, { preserveMediaTypeCardinality: true });
}
//#endregion
//#region extensions/msteams/src/thread-parent-context.ts
const PARENT_CACHE_TTL_MS = 300 * 1e3;
const PARENT_CACHE_MAX = 100;
const parentCache = /* @__PURE__ */ new Map();
const INJECTED_MAX = 200;
const injectedParents = /* @__PURE__ */ new Map();
function touchLru(map, key, value, max) {
  if (map.has(key)) map.delete(key);
  else if (map.size >= max) {
    const firstKey = map.keys().next().value;
    if (firstKey !== void 0) map.delete(firstKey);
  }
  map.set(key, value);
}
function buildParentCacheKey(groupId, channelId, parentId) {
  return `${groupId}\u0000${channelId}\u0000${parentId}`;
}
function resolveParentCacheExpiresAt(nowRaw) {
  const nowMs = asDateTimestampMs(nowRaw);
  return nowMs === void 0
    ? void 0
    : resolveExpiresAtMsFromDurationMs(PARENT_CACHE_TTL_MS, { nowMs });
}
/**
 * Fetch a channel parent message with an LRU+TTL cache.
 *
 * Uses the injected `fetchParent` (defaults to `fetchChannelMessage`) so
 * tests can swap in a stub without mocking the Graph transport.
 */
async function fetchParentMessageCached(
  token,
  groupId,
  channelId,
  parentId,
  fetchParent = fetchChannelMessage,
) {
  const key = buildParentCacheKey(groupId, channelId, parentId);
  const now = asDateTimestampMs(Date.now());
  const cached = parentCache.get(key);
  const cachedExpiresAt = cached ? asDateTimestampMs(cached.expiresAt) : void 0;
  if (cached && now !== void 0 && cachedExpiresAt !== void 0 && cachedExpiresAt > now) {
    parentCache.delete(key);
    parentCache.set(key, cached);
    return cached.message;
  }
  if (cached) parentCache.delete(key);
  const message = await fetchParent(token, groupId, channelId, parentId);
  const expiresAt = resolveParentCacheExpiresAt(Date.now());
  if (expiresAt !== void 0)
    touchLru(
      parentCache,
      key,
      {
        message,
        expiresAt,
      },
      PARENT_CACHE_MAX,
    );
  return message;
}
const PARENT_TEXT_MAX_CHARS = 400;
/**
 * Extract a compact summary (sender + plain-text body) from a Graph parent
 * message. Returns undefined when the parent cannot be summarized (missing
 * or blank body).
 */
function summarizeParentMessage(message) {
  if (!message) return;
  const sender =
    message.from?.user?.displayName ?? message.from?.application?.displayName ?? "unknown";
  const contentType = message.body?.contentType ?? "text";
  const raw = message.body?.content ?? "";
  const text =
    contentType === "html" ? stripHtmlFromTeamsMessage(raw) : raw.replace(/\s+/g, " ").trim();
  if (!text) return;
  return {
    sender,
    text:
      text.length > PARENT_TEXT_MAX_CHARS
        ? `${truncateUtf16Safe(text, PARENT_TEXT_MAX_CHARS - 1)}…`
        : text,
  };
}
/**
 * Build the single-line `Replying to @sender: body` system event text.
 * Callers should pass this text to `enqueueSystemEvent` together with a
 * stable contextKey derived from the parent id.
 */
function formatParentContextEvent(summary) {
  return `Replying to @${summary.sender}: ${summary.text}`;
}
/**
 * Decide whether a parent context event should be enqueued for the current
 * session. Returns `false` when we already injected the same parent for this
 * session recently (prevents re-prepending identical context on every reply
 * in the thread).
 */
function shouldInjectParentContext(sessionKey, parentId) {
  const key = sessionKey;
  return injectedParents.get(key) !== parentId;
}
/**
 * Record that `parentId` was just injected for `sessionKey` so subsequent
 * replies with the same parent can short-circuit via `shouldInjectParentContext`.
 */
function markParentContextInjected(sessionKey, parentId) {
  touchLru(injectedParents, sessionKey, parentId, INJECTED_MAX);
}
//#endregion
//#region extensions/msteams/src/reply-stream-controller.ts
function isStreamCancelledError(err) {
  return err instanceof Error && err.name === "StreamCancelledError";
}
/**
 * Bridges openclaw's reply pipeline callbacks to the SDK's `ctx.stream`.
 * Streaming is enabled for personal (DM) conversations only; group/channel
 * messages fall through to block delivery.
 *
 * Streaming modes (resolved from `cfg.channels.msteams.streaming.preview`):
 * - "partial" (default): per-token streaming via `stream.emit(text)`. Each
 *   chunk goes onto the live preview card in Teams.
 * - "progress": no per-token streaming; the preview card carries an
 *   informative status that updates as tools run (e.g. "Looking up the
 *   schema..." → "Generating SQL..."). When tool-progress streaming is also
 *   enabled, raw tool names appear as bullets above the label.
 * - "block": disable native streaming entirely; the reply lands as a regular
 *   block message. We bypass the controller in that case.
 */
function createTeamsReplyStreamController(params) {
  const isPersonal = normalizeOptionalLowercaseString(params.conversationType) === "personal";
  const streamMode = resolveChannelPreviewStreamMode(params.msteamsConfig, "partial");
  const shouldUseNativeStream =
    isPersonal && (streamMode === "partial" || streamMode === "progress");
  const shouldStreamPreviewToolProgress =
    streamMode === "progress" && resolveChannelStreamingPreviewToolProgress(params.msteamsConfig);
  const stream = shouldUseNativeStream ? params.context.stream : void 0;
  let tokensEmitted = false;
  let streamFinalizationPending = false;
  let canceledLocally = false;
  let streamFailed = false;
  let lastInformativeText = "";
  let progressLines = [];
  let pendingFinalPayload;
  let emittedText = "";
  const wasCanceled = () => canceledLocally || Boolean(stream?.canceled);
  const fallbackPayloadForSuppressedFinal = (payload) => {
    return Boolean(payload.mediaUrl || payload.mediaUrls?.length)
      ? {
          ...payload,
          mediaUrl: void 0,
          mediaUrls: void 0,
        }
      : payload;
  };
  /**
   * Render the current informative status line into the streaming card. Pulls
   * the rotating "Thinking..." label from msteams config (or the plugin-sdk
   * default) and prepends collected tool-progress lines when configured.
   */
  const renderInformativeUpdate = () => {
    if (!stream || wasCanceled() || streamFinalizationPending) return;
    const informativeText = formatChannelProgressDraftText({
      entry: params.msteamsConfig,
      lines: shouldStreamPreviewToolProgress ? progressLines : [],
      seed: params.progressSeed,
      bullet: "-",
    });
    if (!informativeText || informativeText === lastInformativeText) return;
    lastInformativeText = informativeText;
    try {
      stream.update(informativeText);
    } catch (err) {
      if (isStreamCancelledError(err)) {
        canceledLocally = true;
        return;
      }
      params.log?.debug?.(
        `stream informative update failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };
  const progressDraftGate = createChannelProgressDraftGate({ onStart: renderInformativeUpdate });
  return {
    async onReplyStart() {},
    onPartialReply(payload) {
      if (
        !stream ||
        !payload.text ||
        wasCanceled() ||
        streamMode !== "partial" ||
        streamFinalizationPending
      )
        return;
      const fullText = payload.text;
      let prefixLength = 0;
      while (
        prefixLength < emittedText.length &&
        prefixLength < fullText.length &&
        emittedText[prefixLength] === fullText[prefixLength]
      )
        prefixLength += 1;
      const previousRemainder = emittedText.slice(prefixLength);
      const delta = fullText.slice(prefixLength);
      if (!delta) return;
      if (previousRemainder.trim()) {
        stream.clearText();
        streamFailed = true;
        streamFinalizationPending = true;
        return;
      }
      try {
        stream.emit(delta);
        emittedText = fullText;
        tokensEmitted = true;
      } catch (err) {
        if (isStreamCancelledError(err)) {
          canceledLocally = true;
          return;
        }
        streamFailed = true;
        params.log?.warn?.(
          `msteams stream emit failed, falling back to block delivery: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    },
    /**
     * Note that the agent is working — bumps the progress-draft gate so the
     * informative status starts (or refreshes) on the next render. Called
     * from the reply-dispatcher's typing callbacks.
     */
    async noteProgressWork(options) {
      if (!stream || streamMode !== "progress") return;
      if (options?.toolName !== void 0 && !isChannelProgressDraftWorkToolName(options.toolName))
        return;
      const hadStarted = progressDraftGate.hasStarted;
      const progressActive = await progressDraftGate.noteWork();
      if ((hadStarted || progressActive) && progressDraftGate.hasStarted) renderInformativeUpdate();
    },
    /**
     * Append a tool-progress line (e.g. a tool name being invoked) into the
     * preview card's informative status. Only takes effect in "progress" mode
     * with `streaming.previewToolProgress` enabled in config.
     */
    async pushProgressLine(line, options) {
      if (!stream || streamMode !== "progress") return;
      if (options?.toolName !== void 0 && !isChannelProgressDraftWorkToolName(options.toolName))
        return;
      if (shouldStreamPreviewToolProgress) {
        const normalized = normalizeChannelProgressDraftLineIdentity(line);
        if (normalized)
          progressLines = mergeChannelProgressDraftLine(
            progressLines,
            typeof line === "object" && line !== void 0 ? line : normalized,
            { maxLines: resolveChannelProgressDraftMaxLines(params.msteamsConfig) },
          );
      }
      const hadStarted = progressDraftGate.hasStarted;
      const progressActive = await progressDraftGate.noteWork();
      if ((hadStarted || progressActive) && progressDraftGate.hasStarted) renderInformativeUpdate();
    },
    preparePayload(payload) {
      if (!stream) return payload;
      if (wasCanceled()) return;
      if (tokensEmitted && !streamFailed) {
        const hasMedia = Boolean(payload.mediaUrl || payload.mediaUrls?.length);
        pendingFinalPayload = fallbackPayloadForSuppressedFinal(payload);
        streamFinalizationPending = true;
        tokensEmitted = false;
        return hasMedia
          ? {
              ...payload,
              text: void 0,
            }
          : void 0;
      }
      if (streamMode === "progress" && payload.text)
        try {
          stream.emit(payload.text);
          pendingFinalPayload = fallbackPayloadForSuppressedFinal(payload);
          streamFinalizationPending = true;
          return Boolean(payload.mediaUrl || payload.mediaUrls?.length)
            ? {
                ...payload,
                text: void 0,
              }
            : void 0;
        } catch (err) {
          if (isStreamCancelledError(err)) {
            canceledLocally = true;
            return;
          }
          params.log?.debug?.(
            `progress-mode finalize failed: ${err instanceof Error ? err.message : String(err)}`,
          );
        }
      return payload;
    },
    async finalize() {
      progressDraftGate.cancel();
      if (!stream || !streamFinalizationPending || wasCanceled()) return;
      const finalEntities = [
        {
          type: "https://schema.org/Message",
          "@type": "Message",
          "@context": "https://schema.org",
          "@id": "",
          additionalType: ["AIGeneratedContent"],
        },
      ];
      const finalChannelData = params.feedbackLoopEnabled ? { feedbackLoopEnabled: true } : {};
      try {
        stream.emit({
          type: "message",
          entities: finalEntities,
          channelData: finalChannelData,
        });
        const result = await stream.close();
        streamFinalizationPending = false;
        if (!result) {
          const fallback = pendingFinalPayload;
          pendingFinalPayload = void 0;
          return fallback;
        }
        pendingFinalPayload = void 0;
        return;
      } catch (err) {
        if (isStreamCancelledError(err)) {
          canceledLocally = true;
          pendingFinalPayload = void 0;
          streamFinalizationPending = false;
          return;
        }
        streamFailed = true;
        streamFinalizationPending = false;
        params.log?.warn?.(
          `msteams stream finalize failed: ${err instanceof Error ? err.message : String(err)}`,
        );
        const fallback = pendingFinalPayload;
        pendingFinalPayload = void 0;
        return fallback;
      }
    },
    hasStream() {
      return Boolean(stream);
    },
    isStreamActive() {
      return Boolean(stream) && tokensEmitted && !wasCanceled() && !streamFailed;
    },
    wasCanceled,
  };
}
//#endregion
//#region extensions/msteams/src/reply-dispatcher.ts
function createMSTeamsReplyDispatcher(params) {
  const core = getMSTeamsRuntime();
  const msteamsCfg = params.cfg.channels?.msteams;
  const conversationType = normalizeOptionalLowercaseString(
    params.conversationRef.conversation?.conversationType,
  );
  const isTypingSupported = conversationType === "personal" || conversationType === "groupchat";
  /**
   * Keepalive cadence for the typing indicator while the bot is running
   * (including long tool chains). Bot Framework 1:1 TurnContext proxies
   * expire after ~30s of inactivity; sending a typing activity every 8s
   * keeps the proxy alive so the post-tool reply can still land via the
   * turn context. Sits in the middle of the 5-10s range recommended in
   * #59731.
   */
  const TYPING_KEEPALIVE_INTERVAL_MS = 8e3;
  /**
   * TTL ceiling for the typing keepalive loop. The default in
   * createTypingCallbacks is 60s, which is too short for the Teams long tool
   * chains described in #59731 (60s+ total runs are common). Give tool
   * chains up to 10 minutes before auto-stopping the keepalive.
   */
  const TYPING_KEEPALIVE_MAX_DURATION_MS = 10 * 6e4;
  const streamActiveRef = { current: () => false };
  const streamCanceledRef = { current: () => false };
  const rawSendTypingIndicator = async () => {
    await withRevokedProxyFallback({
      run: async () => {
        await params.context.sendActivity({ type: "typing" });
      },
      onRevoked: async () => {
        const baseRef = buildConversationReference(params.conversationRef);
        await sendMSTeamsActivityWithReference(
          params.app,
          baseRef,
          { type: "typing" },
          { serviceUrlBoundary: resolveMSTeamsSdkCloudOptions(msteamsCfg) },
        );
      },
      onRevokedLog: () => {
        params.log.debug?.("turn context revoked, sending typing via proactive messaging");
      },
    });
  };
  const sendTypingIndicator = isTypingSupported
    ? async () => {
        if (streamActiveRef.current()) return;
        if (streamCanceledRef.current()) return;
        await rawSendTypingIndicator();
      }
    : async () => {};
  const { onModelSelected, typingCallbacks, ...replyPipeline } = createChannelReplyPipeline({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: "msteams",
    accountId: params.accountId,
    typing: {
      start: sendTypingIndicator,
      keepaliveIntervalMs: TYPING_KEEPALIVE_INTERVAL_MS,
      maxDurationMs: TYPING_KEEPALIVE_MAX_DURATION_MS,
      onStartError: (err) => {
        logTypingFailure({
          log: (message) => params.log.debug?.(message),
          channel: "msteams",
          action: "start",
          error: err,
        });
      },
    },
  });
  const chunkMode = core.channel.text.resolveChunkMode(params.cfg, "msteams");
  const tableMode = core.channel.text.resolveMarkdownTableMode({
    cfg: params.cfg,
    channel: "msteams",
  });
  const mediaMaxBytes = resolveChannelMediaMaxBytes({
    cfg: params.cfg,
    resolveChannelLimitMb: ({ cfg }) => cfg.channels?.msteams?.mediaMaxMb,
  });
  const feedbackLoopEnabled = params.cfg.channels?.msteams?.feedbackEnabled !== false;
  const streamController = createTeamsReplyStreamController({
    conversationType,
    context: params.context,
    feedbackLoopEnabled,
    log: params.log,
    msteamsConfig: msteamsCfg,
    progressSeed: `${params.accountId ?? "default"}:${params.conversationRef.conversation?.id ?? ""}`,
  });
  streamActiveRef.current = () => streamController.isStreamActive();
  streamCanceledRef.current = () => streamController.wasCanceled();
  const teamsStreamMode = resolveChannelPreviewStreamMode(msteamsCfg, "partial");
  const blockStreamingResolved =
    teamsStreamMode === "block" ? true : resolveChannelStreamingBlockEnabled(msteamsCfg);
  const blockStreamingEnabled = blockStreamingResolved ?? false;
  const typingIndicatorEnabled =
    typeof msteamsCfg?.typingIndicator === "boolean" ? msteamsCfg.typingIndicator : true;
  const pendingMessages = [];
  const sendMessages = async (messages) => {
    return sendMSTeamsMessages({
      replyStyle: params.replyStyle,
      app: params.app,
      appId: params.appId,
      conversationRef: params.conversationRef,
      context: params.context,
      messages,
      retry: {},
      onRetry: (event) => {
        params.log.debug?.("retrying send", {
          replyStyle: params.replyStyle,
          ...event,
        });
      },
      tokenProvider: params.tokenProvider,
      sharePointSiteId: params.sharePointSiteId,
      mediaMaxBytes,
      feedbackLoopEnabled,
      serviceUrlBoundary: resolveMSTeamsSdkCloudOptions(msteamsCfg),
    });
  };
  const queueDeliveryFailureSystemEvent = (failure) => {
    const classification = classifyMSTeamsSendError(failure.error);
    const errorText = formatUnknownError(failure.error);
    const failedAll = failure.failed >= failure.total;
    const sentences = [
      `Microsoft Teams delivery failed: ${failedAll ? "the previous reply was not delivered" : `${failure.failed} of ${failure.total} message blocks were not delivered`}.`,
      `The user may not have received ${failedAll ? "that reply" : "the full reply"}.`,
      `Error: ${errorText}.`,
      classification.statusCode != null ? `Status: ${classification.statusCode}.` : void 0,
      classification.kind === "transient" || classification.kind === "throttled"
        ? "Retrying later may succeed."
        : void 0,
    ].filter(Boolean);
    core.system.enqueueSystemEvent(sentences.join(" "), {
      sessionKey: params.sessionKey,
      contextKey: `msteams:delivery-failure:${params.conversationRef.conversation?.id ?? "unknown"}`,
    });
  };
  const queueReplyPayload = (payload) => {
    const messages = renderReplyPayloadsToMessages([payload], {
      textChunkLimit: params.textLimit,
      chunkText: true,
      mediaMode: "split",
      tableMode,
      chunkMode,
    });
    pendingMessages.push(...messages);
  };
  const flushPendingMessages = async () => {
    if (pendingMessages.length === 0) return;
    const toSend = pendingMessages.splice(0);
    const total = toSend.length;
    let ids;
    try {
      ids = await sendMessages(toSend);
    } catch (batchError) {
      ids = [];
      let failed = 0;
      let lastFailedError = batchError;
      for (const msg of toSend)
        try {
          const msgIds = await sendMessages([msg]);
          ids.push(...msgIds);
        } catch (msgError) {
          failed += 1;
          lastFailedError = msgError;
          params.log.debug?.("individual message send failed, continuing with remaining blocks");
        }
      if (failed > 0) {
        params.log.warn?.(`failed to deliver ${failed} of ${total} message blocks`, {
          failed,
          total,
        });
        queueDeliveryFailureSystemEvent({
          failed,
          total,
          error: lastFailedError,
        });
      }
    }
    if (ids.length > 0) params.onSentMessageIds?.(ids);
  };
  const {
    dispatcher,
    replyOptions,
    markDispatchIdle: baseMarkDispatchIdle,
  } = core.channel.reply.createReplyDispatcherWithTyping({
    ...replyPipeline,
    humanDelay: core.channel.reply.resolveHumanDelayConfig(params.cfg, params.agentId),
    onReplyStart: async () => {
      await streamController.onReplyStart();
      if (typingIndicatorEnabled) await typingCallbacks?.onReplyStart?.();
    },
    typingCallbacks,
    deliver: async (payload) => {
      const preparedPayload = streamController.preparePayload(payload);
      if (!preparedPayload) return;
      queueReplyPayload(preparedPayload);
      if (blockStreamingEnabled) await flushPendingMessages();
    },
    onError: (err, info) => {
      const errMsg = formatUnknownError(err);
      const classification = classifyMSTeamsSendError(err);
      const hint = formatMSTeamsSendErrorHint(classification);
      params.runtime.error?.(
        `msteams ${info.kind} reply failed: ${errMsg}${hint ? ` (${hint})` : ""}`,
      );
      params.log.error("reply failed", {
        kind: info.kind,
        error: errMsg,
        classification,
        hint,
      });
    },
  });
  const markDispatchIdle = () => {
    return flushPendingMessages()
      .catch((err) => {
        const errMsg = formatUnknownError(err);
        const classification = classifyMSTeamsSendError(err);
        const hint = formatMSTeamsSendErrorHint(classification);
        params.runtime.error?.(`msteams flush reply failed: ${errMsg}${hint ? ` (${hint})` : ""}`);
        params.log.error("flush reply failed", {
          error: errMsg,
          classification,
          hint,
        });
      })
      .then(async () => {
        const fallbackPayload = await streamController.finalize().catch((err) => {
          params.log.debug?.("stream finalize failed", { error: formatUnknownError(err) });
        });
        if (fallbackPayload) {
          queueReplyPayload(fallbackPayload);
          await flushPendingMessages();
        }
      })
      .finally(() => {
        baseMarkDispatchIdle();
      });
  };
  const previewToolProgressEnabled = resolveChannelStreamingPreviewToolProgress(msteamsCfg);
  const suppressDefaultToolProgressMessages =
    resolveChannelStreamingSuppressDefaultToolProgressMessages(msteamsCfg);
  const shouldSuppressDefaultToolProgressMessages =
    teamsStreamMode === "progress" &&
    suppressDefaultToolProgressMessages &&
    previewToolProgressEnabled;
  const progressCallbacks = streamController.hasStream()
    ? {
        onReasoningStream: async (payload) => {
          const text = typeof payload?.text === "string" ? payload.text : void 0;
          if (!text) return;
          if (payload?.isReasoningSnapshot !== true) {
            await streamController.pushProgressLine(text);
            return;
          }
          await streamController.pushProgressLine(
            buildChannelProgressDraftLine({
              event: "item",
              itemId: "reasoning",
              itemKind: "analysis",
              title: "Reasoning",
              progressText: text,
            }),
          );
        },
        onToolStart: async (payload) => {
          const name = typeof payload?.name === "string" ? payload.name : void 0;
          const detailMode = typeof payload?.detailMode === "string" ? payload.detailMode : void 0;
          await streamController.pushProgressLine(
            buildChannelProgressDraftLineForEntry(
              msteamsCfg,
              {
                event: "tool",
                ...(typeof payload?.itemId === "string" ? { itemId: payload.itemId } : {}),
                ...(typeof payload?.toolCallId === "string"
                  ? { toolCallId: payload.toolCallId }
                  : {}),
                ...(name ? { name } : {}),
                ...(typeof payload?.phase === "string" ? { phase: payload.phase } : {}),
                ...(payload?.args && typeof payload.args === "object"
                  ? { args: payload.args }
                  : {}),
              },
              detailMode === "explain" || detailMode === "raw" ? { detailMode } : void 0,
            ),
            name ? { toolName: name } : void 0,
          );
        },
        onItemEvent: async (payload) => {
          await streamController.pushProgressLine(
            buildChannelProgressDraftLineForEntry(msteamsCfg, {
              event: "item",
              ...(typeof payload?.itemId === "string" ? { itemId: payload.itemId } : {}),
              ...(typeof payload?.toolCallId === "string"
                ? { toolCallId: payload.toolCallId }
                : {}),
              ...(typeof payload?.kind === "string" ? { itemKind: payload.kind } : {}),
              ...(typeof payload?.title === "string" ? { title: payload.title } : {}),
              ...(typeof payload?.name === "string" ? { name: payload.name } : {}),
              ...(typeof payload?.phase === "string" ? { phase: payload.phase } : {}),
              ...(typeof payload?.status === "string" ? { status: payload.status } : {}),
              ...(typeof payload?.summary === "string" ? { summary: payload.summary } : {}),
              ...(typeof payload?.progressText === "string"
                ? { progressText: payload.progressText }
                : {}),
              ...(typeof payload?.meta === "string" ? { meta: payload.meta } : {}),
            }),
          );
        },
        onPlanUpdate: async (payload) => {
          if (payload?.phase !== "update") return;
          await streamController.pushProgressLine(
            buildChannelProgressDraftLine({
              event: "plan",
              phase: payload.phase,
              ...(typeof payload?.title === "string" ? { title: payload.title } : {}),
              ...(typeof payload?.explanation === "string"
                ? { explanation: payload.explanation }
                : {}),
              ...(Array.isArray(payload?.steps) && payload.steps.every((s) => typeof s === "string")
                ? { steps: payload.steps }
                : {}),
            }),
          );
        },
        onApprovalEvent: async (payload) => {
          if (payload?.phase !== "requested") return;
          await streamController.pushProgressLine(
            buildChannelProgressDraftLine({
              event: "approval",
              phase: payload.phase,
              ...(typeof payload?.title === "string" ? { title: payload.title } : {}),
              ...(typeof payload?.command === "string" ? { command: payload.command } : {}),
              ...(typeof payload?.reason === "string" ? { reason: payload.reason } : {}),
              ...(typeof payload?.message === "string" ? { message: payload.message } : {}),
            }),
          );
        },
        onCommandOutput: async (payload) => {
          if (payload?.phase !== "end") return;
          await streamController.pushProgressLine(
            buildChannelProgressDraftLine({
              event: "command-output",
              ...(typeof payload?.itemId === "string" ? { itemId: payload.itemId } : {}),
              ...(typeof payload?.toolCallId === "string"
                ? { toolCallId: payload.toolCallId }
                : {}),
              phase: payload.phase,
              ...(typeof payload?.title === "string" ? { title: payload.title } : {}),
              ...(typeof payload?.name === "string" ? { name: payload.name } : {}),
              ...(typeof payload?.status === "string" ? { status: payload.status } : {}),
              ...(typeof payload?.exitCode === "number" ? { exitCode: payload.exitCode } : {}),
            }),
          );
        },
        onPatchSummary: async (payload) => {
          if (payload?.phase !== "end") return;
          await streamController.pushProgressLine(
            buildChannelProgressDraftLine({
              event: "patch",
              ...(typeof payload?.itemId === "string" ? { itemId: payload.itemId } : {}),
              ...(typeof payload?.toolCallId === "string"
                ? { toolCallId: payload.toolCallId }
                : {}),
              phase: payload.phase,
              ...(typeof payload?.title === "string" ? { title: payload.title } : {}),
              ...(typeof payload?.name === "string" ? { name: payload.name } : {}),
              ...(Array.isArray(payload?.added) && payload.added.every((s) => typeof s === "string")
                ? { added: payload.added }
                : {}),
              ...(Array.isArray(payload?.modified) &&
              payload.modified.every((s) => typeof s === "string")
                ? { modified: payload.modified }
                : {}),
              ...(Array.isArray(payload?.deleted) &&
              payload.deleted.every((s) => typeof s === "string")
                ? { deleted: payload.deleted }
                : {}),
              ...(typeof payload?.summary === "string" ? { summary: payload.summary } : {}),
            }),
          );
        },
      }
    : {};
  return {
    dispatcher,
    replyOptions: {
      ...replyOptions,
      ...(streamController.hasStream()
        ? { onPartialReply: (payload) => streamController.onPartialReply(payload) }
        : {}),
      ...progressCallbacks,
      ...(shouldSuppressDefaultToolProgressMessages
        ? { suppressDefaultToolProgressMessages: true }
        : {}),
      disableBlockStreaming: blockStreamingResolved == null ? void 0 : !blockStreamingResolved,
      onModelSelected,
    },
    markDispatchIdle,
  };
}
//#endregion
//#region extensions/msteams/src/sent-message-cache.ts
const sentMessages = createPersistentDedupeCache({
  globalKey: Symbol.for("openclaw.msteamsSentMessages"),
  ttlMs: 1440 * 60 * 1e3,
  maxSize: 2e4,
  persistent: {
    namespace: "msteams.sent-messages",
    maxEntries: 1e3,
    openStore: (options) => getOptionalMSTeamsRuntime()?.state.openKeyedStore(options),
    logError: (error) => {
      try {
        getOptionalMSTeamsRuntime()
          ?.logging.getChildLogger({
            plugin: "msteams",
            feature: "sent-message-state",
          })
          .warn("Microsoft Teams persistent sent-message state failed", { error: String(error) });
      } catch {}
    },
    readTimestamp: (record) => record.sentAt,
  },
});
function makeKey(conversationId, messageId) {
  return `${conversationId}:${messageId}`;
}
function recordMSTeamsSentMessage(conversationId, messageId) {
  if (!conversationId || !messageId) return;
  const sentAt = Date.now();
  sentMessages.register(makeKey(conversationId, messageId), { sentAt }, { at: sentAt });
}
async function wasMSTeamsMessageSentWithPersistence(params) {
  if (!params.conversationId || !params.messageId) return false;
  return await sentMessages.lookup(makeKey(params.conversationId, params.messageId));
}
//#endregion
//#region extensions/msteams/src/team-identity.ts
const teamGroupIdCache = /* @__PURE__ */ new Map();
const TEAM_GROUP_ID_CACHE_MAX_ENTRIES = 500;
function cacheTeamGroupId(conversationTeamId, groupId) {
  teamGroupIdCache.set(conversationTeamId, groupId);
  pruneMapToMaxSize(teamGroupIdCache, TEAM_GROUP_ID_CACHE_MAX_ENTRIES);
}
/** Resolve the Graph team GUID without ever treating a Bot Framework team ID as equivalent. */
async function resolveTeamGroupId(params) {
  const activityGroupId = params.aadGroupId?.trim();
  if (activityGroupId) {
    cacheTeamGroupId(params.conversationTeamId, activityGroupId);
    return activityGroupId;
  }
  const cached = teamGroupIdCache.get(params.conversationTeamId);
  if (cached) return cached;
  const getTeamDetails = params.getTeamDetails;
  if (!getTeamDetails) return;
  const groupId = (
    await withMSTeamsRequestDeadline({
      deadline: params.deadline,
      label: "MS Teams team details",
      work: () => getTeamDetails(params.conversationTeamId),
    })
  ).aadGroupId?.trim();
  if (!groupId) return;
  cacheTeamGroupId(params.conversationTeamId, groupId);
  return groupId;
}
//#endregion
//#region extensions/msteams/src/monitor-handler/inbound-media.ts
function shouldAttemptMSTeamsGraphMediaFallback(params) {
  const conversationType = params.conversationType.trim().toLowerCase();
  return (
    params.graphMediaFallback === true &&
    (conversationType === "channel" || conversationType === "groupchat") &&
    (params.htmlSummary?.htmlAttachments ?? 0) > 0
  );
}
function resolveMSTeamsInboundMediaBody(params) {
  const unavailableCount = Math.max(0, params.expectedMediaCount - params.mediaCount);
  if (unavailableCount === 0) return params.body;
  return formatInboundMediaUnavailableText({
    body:
      params.mediaCount > 0 && params.body === params.mediaPlaceholder
        ? params.materializedMediaPlaceholder
        : params.body,
    mediaPlaceholder: params.mediaCount === 0 ? params.mediaPlaceholder : void 0,
    notice: `[msteams ${unavailableCount > 1 ? `${unavailableCount} attachments` : "attachment"} unavailable]`,
  });
}
async function resolveMSTeamsInboundMedia(params) {
  const {
    attachments,
    htmlSummary,
    maxBytes,
    tokenProvider,
    allowHosts,
    conversationType,
    conversationId,
    conversationMessageId,
    teamAadGroupId,
    serviceUrl,
    activity,
    log,
    preserveFilenames,
  } = params;
  let mediaList = await downloadMSTeamsAttachments({
    attachments,
    maxBytes,
    tokenProvider,
    allowHosts,
    authAllowHosts: params.authAllowHosts,
    preserveFilenames,
    deadline: params.deadline,
    logger: log,
  });
  if (mediaList.length === 0) {
    const attachmentIds = extractMSTeamsHtmlAttachmentIds(attachments);
    const hasHtmlFileAttachment = attachmentIds.length > 0;
    const hasChannelOrGroupHtml = shouldAttemptMSTeamsGraphMediaFallback({
      conversationType,
      htmlSummary,
      graphMediaFallback: params.graphMediaFallback,
    });
    const shouldFetchGraphMessage = hasHtmlFileAttachment || hasChannelOrGroupHtml;
    const isBotFrameworkPersonalChat = isBotFrameworkPersonalChatId(conversationId);
    if (hasHtmlFileAttachment && isBotFrameworkPersonalChat)
      if (!serviceUrl)
        log.debug?.("bot framework attachment skipped (missing serviceUrl)", {
          conversationType,
          conversationId,
        });
      else {
        const bfMedia = await downloadMSTeamsBotFrameworkAttachments({
          serviceUrl,
          attachmentIds,
          tokenProvider,
          maxBytes,
          allowHosts,
          authAllowHosts: params.authAllowHosts,
          preserveFilenames,
          deadline: params.deadline,
        });
        if (bfMedia.media.length > 0) mediaList = bfMedia.media;
        else
          log.debug?.("bot framework attachments fetch empty", {
            conversationType,
            attachmentCount: bfMedia.attachmentCount ?? attachmentIds.length,
          });
      }
    if (shouldFetchGraphMessage && mediaList.length === 0 && !isBotFrameworkPersonalChat) {
      const graphTeamAadGroupId =
        conversationType.trim().toLowerCase() === "channel" && !teamAadGroupId
          ? await params.resolveTeamAadGroupId?.()
          : teamAadGroupId;
      const messageUrl = buildMSTeamsGraphMessageUrl({
        conversationType,
        conversationId,
        messageId: activity.id ?? void 0,
        threadRootMessageId: conversationMessageId ?? activity.replyToId,
        teamAadGroupId: graphTeamAadGroupId,
        channelId: activity.channelData?.channel?.id,
      });
      if (!messageUrl)
        log.debug?.("graph message url unavailable", {
          conversationType,
          hasChannelData: Boolean(activity.channelData),
          messageId: activity.id ?? void 0,
          replyToId: activity.replyToId ?? void 0,
        });
      else {
        const graphMedia = await downloadMSTeamsGraphMedia({
          messageUrl,
          tokenProvider,
          maxBytes,
          allowHosts,
          authAllowHosts: params.authAllowHosts,
          preserveFilenames,
          deadline: params.deadline,
          logger: log,
        });
        if (graphMedia.media.length > 0) mediaList = graphMedia.media;
        if (mediaList.length === 0)
          log.debug?.("graph media fetch empty", {
            messageUrl,
            hostedStatus: graphMedia.hostedStatus,
            attachmentStatus: graphMedia.attachmentStatus,
            hostedCount: graphMedia.hostedCount,
            attachmentCount: graphMedia.attachmentCount,
            tokenError: graphMedia.tokenError,
            attachmentIdCount: attachmentIds.length,
          });
      }
    }
  }
  if (mediaList.length > 0) log.debug?.("downloaded attachments", { count: mediaList.length });
  else if (htmlSummary?.imgTags)
    log.debug?.("inline images detected but none downloaded", {
      imgTags: htmlSummary.imgTags,
      srcHosts: htmlSummary.srcHosts,
      dataImages: htmlSummary.dataImages,
      cidImages: htmlSummary.cidImages,
    });
  return mediaList;
}
//#endregion
//#region extensions/msteams/src/monitor-handler/message-handler.ts
function extractTextFromHtmlAttachments(attachments) {
  for (const attachment of attachments) {
    const raw = extractHtmlFromAttachment(attachment);
    if (!raw) continue;
    const text = raw
      .replace(/<at[^>]*>.*?<\/at>/gis, " ")
      .replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gis, "$2 $1")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/\s+/g, " ")
      .trim();
    if (text) return text;
  }
  return "";
}
function formatMSTeamsSenderReason(params) {
  switch (params.reasonCode) {
    case "dm_policy_open":
      return "dmPolicy=open";
    case "dm_policy_disabled":
      return "dmPolicy=disabled";
    case "dm_policy_pairing_required":
      return "dmPolicy=pairing (not allowlisted)";
    case "dm_policy_allowlisted":
      return `dmPolicy=${params.dmPolicy ?? "allowlist"} (allowlisted)`;
    case "dm_policy_not_allowlisted":
      return `dmPolicy=${params.dmPolicy ?? "allowlist"} (not allowlisted)`;
    case "group_policy_disabled":
      return "groupPolicy=disabled";
    case "group_policy_empty_allowlist":
    case "route_sender_empty":
      return "groupPolicy=allowlist (empty allowlist)";
    case "group_policy_not_allowlisted":
      return "groupPolicy=allowlist (not allowlisted)";
    case "group_policy_open":
      return "groupPolicy=open";
    case "group_policy_allowed":
      return `groupPolicy=${params.groupPolicy ?? "allowlist"}`;
    default:
      return params.reasonCode;
  }
}
function buildStoredConversationReference(params) {
  const { activity, conversationId, conversationType, teamId, threadId } = params;
  const from = activity.from;
  const conversation = activity.conversation;
  const agent = activity.recipient;
  const clientInfo = activity.entities?.find((e) => e.type === "clientInfo");
  const tenantId = activity.channelData?.tenant?.id ?? conversation?.tenantId;
  const aadObjectId = from?.aadObjectId;
  const serviceUrl = tryNormalizeBotFrameworkServiceUrl(activity.serviceUrl);
  return {
    activityId: activity.id,
    user: from
      ? {
          id: from.id,
          name: from.name,
          aadObjectId: from.aadObjectId,
        }
      : void 0,
    agent,
    conversation: {
      id: conversationId,
      conversationType,
      tenantId,
    },
    ...(tenantId ? { tenantId } : {}),
    ...(aadObjectId ? { aadObjectId } : {}),
    teamId,
    channelId: activity.channelId,
    ...(serviceUrl ? { serviceUrl } : {}),
    locale: activity.locale,
    ...(clientInfo?.timezone ? { timezone: clientInfo.timezone } : {}),
    ...(threadId ? { threadId } : {}),
  };
}
function createMSTeamsMessageHandler(deps) {
  const {
    cfg,
    runtime,
    appId,
    app,
    tokenProvider,
    textLimit,
    mediaMaxBytes,
    conversationStore,
    pollStore,
    log,
  } = deps;
  const core = getMSTeamsRuntime();
  const logVerboseMessage = (message) => {
    if (core.logging.shouldLogVerbose()) log.debug?.(message);
  };
  const msteamsCfg = cfg.channels?.msteams;
  const contextVisibilityMode = resolveChannelContextVisibilityMode({
    cfg,
    channel: "msteams",
  });
  const historyLimit = Math.max(
    0,
    msteamsCfg?.historyLimit ?? cfg.messages?.groupChat?.historyLimit ?? 50,
  );
  const conversationHistories = /* @__PURE__ */ new Map();
  const inboundDebounceMs = core.channel.debounce.resolveInboundDebounceMs({
    cfg,
    channel: "msteams",
  });
  const handleTeamsMessageNow = async (params) => {
    const context = params.context;
    const activity = context.activity;
    const rawText = params.rawText;
    const text = params.text;
    const attachments = params.attachments;
    const attachmentPresentation = resolveMSTeamsInboundAttachmentPresentation(attachments, {
      maxInlineBytes: mediaMaxBytes,
      maxInlineTotalBytes: mediaMaxBytes,
    });
    const attachmentPlaceholder = attachmentPresentation.placeholder;
    const rawBody = text || attachmentPlaceholder;
    const quoteInfo = extractMSTeamsQuoteInfo(attachments);
    let quoteSenderId;
    let quoteSenderName;
    const from = activity.from;
    const conversation = activity.conversation;
    const attachmentTypes = attachments
      .map((att) => (typeof att.contentType === "string" ? att.contentType : void 0))
      .filter(Boolean)
      .slice(0, 3);
    const htmlSummary = summarizeMSTeamsHtmlAttachments(attachments);
    log.info("received message", {
      rawText: truncateUtf16Safe(rawText, 50),
      text: truncateUtf16Safe(text, 50),
      attachments: attachments.length,
      attachmentTypes,
      from: from?.id,
      conversation: conversation?.id,
    });
    if (htmlSummary) log.debug?.("html attachment summary", htmlSummary);
    if (!from?.id) {
      log.debug?.("skipping message without from.id");
      return;
    }
    const rawConversationId = conversation?.id ?? "";
    const conversationId = normalizeMSTeamsConversationId(rawConversationId);
    const conversationMessageId = extractMSTeamsConversationMessageId(rawConversationId);
    const conversationType = conversation?.conversationType ?? "personal";
    const teamId = activity.channelData?.team?.id;
    const graphChannelId = activity.channelData?.channel?.id?.trim() || conversationId;
    const conversationRef = buildStoredConversationReference({
      activity,
      conversationId,
      conversationType,
      teamId,
      threadId:
        conversationType === "channel"
          ? (conversationMessageId ?? activity.replyToId ?? void 0)
          : void 0,
    });
    const allowTextCommands = core.channel.commands.shouldHandleTextCommands({
      cfg,
      surface: "msteams",
    });
    const isControlCommand =
      allowTextCommands && core.channel.commands.isControlCommandMessage(text, cfg);
    const {
      dmPolicy,
      senderId,
      senderName,
      pairing,
      isDirectMessage,
      channelGate,
      senderAccess,
      commandAccess,
      allowNameMatching,
      groupPolicy,
    } = await resolveMSTeamsSenderAccess({
      cfg,
      activity,
      hasControlCommand: isControlCommand,
    });
    const commandAuthorized = commandAccess.requested ? commandAccess.authorized : void 0;
    const effectiveDmAllowFrom = senderAccess.effectiveAllowFrom;
    const effectiveGroupAllowFrom = senderAccess.effectiveGroupAllowFrom;
    const isChannel = conversationType === "channel";
    if (isDirectMessage && msteamsCfg && senderAccess.decision !== "allow") {
      if (senderAccess.reasonCode === "dm_policy_disabled") {
        log.info("dropping dm (dms disabled)", {
          sender: senderId,
          label: senderName,
        });
        log.debug?.("dropping dm (dms disabled)");
        return;
      }
      const allowMatch = resolveMSTeamsAllowlistMatch({
        allowFrom: effectiveDmAllowFrom,
        senderId,
        senderName,
        allowNameMatching,
      });
      if (senderAccess.decision === "pairing") {
        conversationStore.upsert(conversationId, conversationRef).catch((err) => {
          log.debug?.("failed to save conversation reference", { error: formatUnknownError(err) });
        });
        if (
          await pairing.upsertPairingRequest({
            id: senderId,
            meta: { name: senderName },
          })
        )
          log.info("msteams pairing request created", {
            sender: senderId,
            label: senderName,
          });
      }
      log.debug?.("dropping dm (not allowlisted)", {
        sender: senderId,
        label: senderName,
        allowlistMatch: formatAllowlistMatchMeta(allowMatch),
      });
      log.info("dropping dm (not allowlisted)", {
        sender: senderId,
        label: senderName,
        dmPolicy,
        reason: formatMSTeamsSenderReason({
          reasonCode: senderAccess.reasonCode,
          dmPolicy,
          groupPolicy,
        }),
        allowlistMatch: formatAllowlistMatchMeta(allowMatch),
      });
      return;
    }
    if (!isDirectMessage && msteamsCfg) {
      if (channelGate.allowlistConfigured && !channelGate.allowed) {
        log.info("dropping group message (not in team/channel allowlist)", {
          conversationId,
          teamKey: channelGate.teamKey ?? "none",
          channelKey: channelGate.channelKey ?? "none",
          channelMatchKey: channelGate.channelMatchKey ?? "none",
          channelMatchSource: channelGate.channelMatchSource ?? "none",
        });
        log.debug?.("dropping group message (not in team/channel allowlist)", {
          conversationId,
          teamKey: channelGate.teamKey ?? "none",
          channelKey: channelGate.channelKey ?? "none",
          channelMatchKey: channelGate.channelMatchKey ?? "none",
          channelMatchSource: channelGate.channelMatchSource ?? "none",
        });
        return;
      }
      if (!senderAccess.allowed && senderAccess.reasonCode === "group_policy_disabled") {
        log.info("dropping group message (groupPolicy: disabled)", { conversationId });
        log.debug?.("dropping group message (groupPolicy: disabled)", { conversationId });
        return;
      }
      if (
        !senderAccess.allowed &&
        (senderAccess.reasonCode === "group_policy_empty_allowlist" ||
          senderAccess.reasonCode === "route_sender_empty")
      ) {
        log.info("dropping group message (groupPolicy: allowlist, no allowlist)", {
          conversationId,
        });
        log.debug?.("dropping group message (groupPolicy: allowlist, no allowlist)", {
          conversationId,
        });
        return;
      }
      if (!senderAccess.allowed && senderAccess.reasonCode === "group_policy_not_allowlisted") {
        const allowMatch = resolveMSTeamsAllowlistMatch({
          allowFrom: effectiveGroupAllowFrom,
          senderId,
          senderName,
          allowNameMatching,
        });
        log.debug?.("dropping group message (not in groupAllowFrom)", {
          sender: senderId,
          label: senderName,
          allowlistMatch: formatAllowlistMatchMeta(allowMatch),
        });
        log.info("dropping group message (not in groupAllowFrom)", {
          sender: senderId,
          label: senderName,
          allowlistMatch: formatAllowlistMatchMeta(allowMatch),
        });
        return;
      }
    }
    if (commandAccess.shouldBlockControlCommand) {
      logInboundDrop({
        log: logVerboseMessage,
        channel: "msteams",
        reason: "control command (unauthorized)",
        target: senderId,
      });
      return;
    }
    conversationStore.upsert(conversationId, conversationRef).catch((err) => {
      log.debug?.("failed to save conversation reference", { error: formatUnknownError(err) });
    });
    const pollVote = extractMSTeamsPollVote(activity);
    if (pollVote) {
      try {
        if (
          !(await pollStore.recordVote({
            pollId: pollVote.pollId,
            voterId: senderId,
            selections: pollVote.selections,
          }))
        )
          log.debug?.("poll vote ignored (poll not found)", { pollId: pollVote.pollId });
        else
          log.info("recorded poll vote", {
            pollId: pollVote.pollId,
            voter: senderId,
            selections: pollVote.selections,
          });
      } catch (err) {
        log.error("failed to record poll vote", {
          pollId: pollVote.pollId,
          error: formatUnknownError(err),
        });
      }
      return;
    }
    const mayRecoverGraphMedia =
      Boolean(htmlSummary?.attachmentIds.length) ||
      shouldAttemptMSTeamsGraphMediaFallback({
        conversationType,
        htmlSummary: htmlSummary ?? void 0,
        graphMediaFallback: msteamsCfg?.graphMediaFallback,
      });
    if (!rawBody && !mayRecoverGraphMedia) {
      log.debug?.("skipping empty message after stripping mentions");
      return;
    }
    const teamsFrom = isDirectMessage
      ? `msteams:${senderId}`
      : isChannel
        ? `msteams:channel:${conversationId}`
        : `msteams:group:${conversationId}`;
    const teamsTo = isDirectMessage ? `user:${senderId}` : `conversation:${conversationId}`;
    const route = core.channel.routing.resolveAgentRoute({
      cfg,
      channel: "msteams",
      teamId,
      peer: {
        kind: isDirectMessage ? "direct" : isChannel ? "channel" : "group",
        id: isDirectMessage ? senderId : conversationId,
      },
    });
    route.sessionKey = resolveMSTeamsRouteSessionKey({
      baseSessionKey: route.sessionKey,
      isChannel,
      conversationMessageId,
      replyToId: activity.replyToId,
    });
    const preview = sliceUtf16Safe(rawBody.replace(/\s+/g, " "), 0, 160);
    const inboundLabel = isDirectMessage
      ? `Teams DM from ${senderName}`
      : `Teams message in ${conversationType} from ${senderName}`;
    const enqueuePrimaryMessageSystemEvent = () =>
      core.system.enqueueSystemEvent(inboundLabel, {
        sessionKey: route.sessionKey,
        contextKey: `msteams:message:${conversationId}:${activity.id ?? "unknown"}`,
      });
    const channelId = conversationId;
    const { teamConfig, channelConfig } = channelGate;
    const { requireMention, replyStyle } = resolveMSTeamsReplyPolicy({
      isDirectMessage,
      globalConfig: msteamsCfg,
      teamConfig,
      channelConfig,
    });
    const timestamp = parseMSTeamsActivityTimestamp(activity.timestamp);
    const mentionDecision = resolveInboundMentionDecision({
      facts: {
        canDetectMention: true,
        wasMentioned: params.wasMentioned,
        implicitMentionKinds: params.implicitMentionKinds,
      },
      policy: {
        isGroup: !isDirectMessage,
        requireMention,
        allowTextCommands,
        hasControlCommand: isControlCommand,
        commandAuthorized: commandAuthorized === true,
      },
    });
    if (!isDirectMessage) {
      const mentioned = mentionDecision.effectiveWasMentioned;
      if (requireMention && mentionDecision.shouldSkip) {
        log.debug?.("skipping message (mention required)", {
          teamId,
          channelId,
          requireMention,
          mentioned,
        });
        if (rawBody) {
          enqueuePrimaryMessageSystemEvent();
          createChannelHistoryWindow({ historyMap: conversationHistories }).record({
            historyKey: conversationId,
            limit: historyLimit,
            entry: {
              sender: senderName,
              body: rawBody,
              timestamp: timestamp?.getTime(),
              messageId: activity.id ?? void 0,
            },
          });
        }
        return;
      }
    }
    const preprocessingDeadline = createMSTeamsInboundDeadline();
    let teamAadGroupId = activity.channelData?.team?.aadGroupId?.trim() || void 0;
    const conversationTeamId = isChannel ? teamId : void 0;
    let teamGroupIdPromise;
    const resolveChannelTeamGroupId = async () => {
      if (!conversationTeamId) return;
      teamGroupIdPromise ??= resolveTeamGroupId({
        conversationTeamId,
        aadGroupId: teamAadGroupId,
        getTeamDetails: context.getTeamDetails,
        deadline: preprocessingDeadline,
      }).catch((err) => {
        log.debug?.("failed to resolve Teams AAD group ID", {
          teamId: conversationTeamId,
          error: formatUnknownError(err),
        });
      });
      teamAadGroupId = await teamGroupIdPromise;
      return teamAadGroupId;
    };
    let mediaList = [];
    try {
      mediaList = await withMSTeamsRequestDeadline({
        deadline: preprocessingDeadline,
        label: "MS Teams inbound media",
        work: () =>
          resolveMSTeamsInboundMedia({
            attachments,
            htmlSummary: htmlSummary ?? void 0,
            maxBytes: mediaMaxBytes,
            tokenProvider,
            allowHosts: msteamsCfg?.mediaAllowHosts,
            authAllowHosts: msteamsCfg?.mediaAuthAllowHosts,
            graphMediaFallback: msteamsCfg?.graphMediaFallback,
            conversationType,
            conversationId,
            conversationMessageId: conversationMessageId ?? void 0,
            teamAadGroupId,
            resolveTeamAadGroupId: resolveChannelTeamGroupId,
            serviceUrl: activity.serviceUrl,
            activity: {
              id: activity.id,
              replyToId: activity.replyToId,
              channelData: activity.channelData,
            },
            log,
            deadline: preprocessingDeadline,
            preserveFilenames: cfg.media?.preserveFilenames,
          }),
      });
    } catch (err) {
      log.debug?.("failed to resolve inbound Teams media", { error: formatUnknownError(err) });
    }
    const mediaPayload = buildMSTeamsMediaPayload(mediaList);
    const materializedMediaPlaceholder = resolveMSTeamsInboundAttachmentPresentation(
      mediaList.map((media) => ({
        contentType: media.contentType,
        name: media.path,
      })),
    ).placeholder;
    const agentBody = resolveMSTeamsInboundMediaBody({
      body: rawBody || materializedMediaPlaceholder,
      mediaPlaceholder: attachmentPlaceholder,
      materializedMediaPlaceholder,
      expectedMediaCount: attachmentPresentation.expectedMediaCount,
      mediaCount: mediaList.length,
    });
    if (!agentBody) {
      log.debug?.("skipping empty message after Graph media recovery");
      return;
    }
    enqueuePrimaryMessageSystemEvent();
    teamAadGroupId = await resolveChannelTeamGroupId();
    let quoteBodyFull;
    const quoteMessageId = quoteInfo?.id;
    if (quoteMessageId && isDirectMessage && conversationId.startsWith("19:"))
      try {
        const graphToken = await withMSTeamsRequestDeadline({
          deadline: preprocessingDeadline,
          label: "MS Teams quote token",
          work: () => tokenProvider.getAccessToken("https://graph.microsoft.com"),
        });
        quoteBodyFull = await withMSTeamsRequestDeadline({
          deadline: preprocessingDeadline,
          label: "MS Teams quote lookup",
          work: () =>
            fetchChatMessageText(graphToken, conversationId, quoteMessageId, preprocessingDeadline),
        });
      } catch (err) {
        log.debug?.("failed to fetch full quoted message text", { error: formatUnknownError(err) });
      }
    let threadContext;
    const threadParentId = activity.replyToId;
    const channelGroupId = teamAadGroupId;
    if (threadParentId && isChannel && channelGroupId)
      try {
        const graphToken = await withMSTeamsRequestDeadline({
          deadline: preprocessingDeadline,
          label: "MS Teams thread token",
          work: () => tokenProvider.getAccessToken("https://graph.microsoft.com"),
        });
        const [parentResult, repliesResult] = await withMSTeamsRequestDeadline({
          deadline: preprocessingDeadline,
          label: "MS Teams thread history",
          work: () =>
            Promise.allSettled([
              fetchParentMessageCached(
                graphToken,
                channelGroupId,
                conversationId,
                threadParentId,
                (token, groupId, requestedChannelId, messageId) =>
                  fetchChannelMessage(
                    token,
                    groupId,
                    requestedChannelId,
                    messageId,
                    preprocessingDeadline,
                  ),
              ),
              fetchThreadReplies(
                graphToken,
                channelGroupId,
                conversationId,
                threadParentId,
                50,
                preprocessingDeadline,
              ),
            ]),
        });
        const parentMsg = parentResult.status === "fulfilled" ? parentResult.value : void 0;
        const replies = repliesResult.status === "fulfilled" ? repliesResult.value : [];
        if (parentResult.status === "rejected")
          log.debug?.("failed to fetch parent message", {
            error: formatUnknownError(parentResult.reason),
          });
        if (repliesResult.status === "rejected")
          log.debug?.("failed to fetch thread replies", {
            error: formatUnknownError(repliesResult.reason),
          });
        const isThreadSenderAllowed = (msg) =>
          groupPolicy === "allowlist"
            ? resolveMSTeamsAllowlistMatch({
                allowFrom: effectiveGroupAllowFrom,
                senderId: msg.from?.user?.id ?? "",
                senderName: msg.from?.user?.displayName,
                allowNameMatching,
              }).allowed
            : true;
        const parentSummary = summarizeParentMessage(parentMsg);
        const visibleParentMessages = parentMsg
          ? filterSupplementalContextItems({
              items: [parentMsg],
              mode: contextVisibilityMode,
              kind: "thread",
              isSenderAllowed: isThreadSenderAllowed,
            }).items
          : [];
        if (
          parentSummary &&
          visibleParentMessages.length > 0 &&
          shouldInjectParentContext(route.sessionKey, threadParentId)
        ) {
          core.system.enqueueSystemEvent(formatParentContextEvent(parentSummary), {
            sessionKey: route.sessionKey,
            contextKey: `msteams:thread-parent:${conversationId}:${threadParentId}`,
          });
          markParentContextInjected(route.sessionKey, threadParentId);
        }
        const allMessages = parentMsg ? [parentMsg, ...replies] : replies;
        quoteSenderId = parentMsg?.from?.user?.id ?? parentMsg?.from?.application?.id ?? void 0;
        quoteSenderName =
          parentMsg?.from?.user?.displayName ??
          parentMsg?.from?.application?.displayName ??
          quoteInfo?.sender;
        const { items: threadMessages } = filterSupplementalContextItems({
          items: allMessages,
          mode: contextVisibilityMode,
          kind: "thread",
          isSenderAllowed: isThreadSenderAllowed,
        });
        const formatted = formatThreadContext(threadMessages, activity.id);
        if (formatted) threadContext = formatted;
      } catch (err) {
        log.debug?.("failed to fetch thread history", { error: formatUnknownError(err) });
      }
    quoteSenderName ??= quoteInfo?.sender;
    const envelopeFrom = isDirectMessage ? senderName : conversationType;
    const { storePath, envelopeOptions, previousTimestamp } = resolveInboundSessionEnvelopeContext({
      cfg,
      agentId: route.agentId,
      sessionKey: route.sessionKey,
    });
    let combinedBody = core.channel.reply.formatAgentEnvelope({
      channel: "Teams",
      from: envelopeFrom,
      timestamp,
      previousTimestamp,
      envelope: envelopeOptions,
      body: agentBody,
    });
    const isRoomish = !isDirectMessage;
    const historyKey = isRoomish ? conversationId : void 0;
    if (isRoomish && historyKey)
      combinedBody = createChannelHistoryWindow({
        historyMap: conversationHistories,
      }).buildPendingContext({
        historyKey,
        limit: historyLimit,
        currentMessage: combinedBody,
        formatEntry: (entry) =>
          core.channel.reply.formatAgentEnvelope({
            channel: "Teams",
            from: conversationType,
            timestamp: entry.timestamp,
            body: `${entry.sender}: ${entry.body}${entry.messageId ? ` [id:${entry.messageId}]` : ""}`,
            envelope: envelopeOptions,
          }),
      });
    const inboundHistory =
      isRoomish && historyKey && historyLimit > 0
        ? createChannelHistoryWindow({ historyMap: conversationHistories }).buildInboundHistory({
            historyKey,
            limit: historyLimit,
          })
        : void 0;
    const commandBody = text.trim();
    const quoteSenderAllowed =
      quoteInfo && quoteInfo.sender
        ? !isChannel || groupPolicy !== "allowlist"
          ? true
          : resolveMSTeamsAllowlistMatch({
              allowFrom: effectiveGroupAllowFrom,
              senderId: quoteSenderId ?? "",
              senderName: quoteSenderName,
              allowNameMatching,
            }).allowed
        : true;
    const bodyForAgent = threadContext
      ? `[Thread history]\n${threadContext}\n[/Thread history]\n\n${agentBody}`
      : agentBody;
    const nativeChannelId =
      isChannel && teamAadGroupId ? `${teamAadGroupId}/${graphChannelId}` : void 0;
    const ctxPayload = buildChannelInboundEventContext({
      channel: "msteams",
      finalize: core.channel.reply.finalizeInboundContext,
      contextVisibility: contextVisibilityMode,
      supplemental: {
        quote: quoteInfo
          ? {
              id: quoteInfo.id ?? activity.replyToId ?? void 0,
              body: quoteBodyFull ?? quoteInfo.body,
              sender: quoteInfo.sender,
              senderAllowed: quoteSenderAllowed,
              isQuote: true,
            }
          : void 0,
      },
      messageId: activity.id,
      timestamp: timestamp?.getTime() ?? Date.now(),
      from: teamsFrom,
      sender: {
        id: senderId,
        name: senderName,
      },
      conversation: {
        kind: isDirectMessage ? "direct" : isChannel ? "channel" : "group",
        id: conversationId,
        label: envelopeFrom,
        spaceId: teamId,
        nativeChannelId,
      },
      route: {
        agentId: route.agentId,
        accountId: route.accountId,
        routeSessionKey: route.sessionKey,
      },
      reply: {
        to: teamsTo,
        replyToId: activity.replyToId ?? void 0,
        nativeChannelId,
      },
      message: {
        body: combinedBody,
        bodyForAgent,
        inboundHistory,
        rawBody,
        commandBody,
      },
      access: {
        mentions: {
          canDetectMention: !isDirectMessage,
          wasMentioned: isDirectMessage || mentionDecision.effectiveWasMentioned,
        },
        commands: { authorized: commandAuthorized },
      },
      extra: {
        GroupSubject: !isDirectMessage ? conversationType : void 0,
        ReplyToIsQuote: quoteInfo ? true : void 0,
        ...mediaPayload,
      },
    });
    logVerboseMessage(`msteams inbound: from=${ctxPayload.From} preview="${preview}"`);
    const sharePointSiteId = msteamsCfg?.sharePointSiteId;
    const { dispatcher, replyOptions, markDispatchIdle } = createMSTeamsReplyDispatcher({
      cfg,
      agentId: route.agentId,
      sessionKey: route.sessionKey,
      accountId: route.accountId,
      runtime,
      log,
      app,
      appId,
      conversationRef,
      context,
      replyStyle,
      textLimit,
      onSentMessageIds: (ids) => {
        for (const id of ids) recordMSTeamsSentMessage(conversationId, id);
      },
      tokenProvider,
      sharePointSiteId,
    });
    const senderTimezone =
      activity.entities?.find((e) => e.type === "clientInfo")?.timezone || conversationRef.timezone;
    const configOverride =
      senderTimezone && !cfg.agents?.defaults?.userTimezone
        ? {
            agents: {
              defaults: {
                ...cfg.agents?.defaults,
                userTimezone: senderTimezone,
              },
            },
          }
        : void 0;
    log.info("dispatching to agent", { sessionKey: route.sessionKey });
    try {
      const turnResult = await core.channel.inbound.run({
        channel: "msteams",
        accountId: route.accountId,
        raw: context,
        adapter: {
          ingest: () => ({
            id: activity.id ?? `${teamsFrom}:${Date.now()}`,
            timestamp: timestamp?.getTime(),
            rawText: rawBody,
            textForAgent: bodyForAgent,
            textForCommands: commandBody,
            raw: activity,
          }),
          resolveTurn: () => ({
            channel: "msteams",
            accountId: route.accountId,
            routeSessionKey: route.sessionKey,
            storePath,
            ctxPayload,
            recordInboundSession: core.channel.session.recordInboundSession,
            record: {
              onRecordError: (err) => {
                logVerboseMessage(
                  `msteams: failed updating session meta: ${formatUnknownError(err)}`,
                );
              },
            },
            history: {
              isGroup: isRoomish,
              historyKey,
              historyMap: conversationHistories,
              limit: historyLimit,
            },
            onPreDispatchFailure: () =>
              core.channel.reply.settleReplyDispatcher({
                dispatcher,
                onSettled: () => markDispatchIdle(),
              }),
            runDispatch: () =>
              dispatchReplyFromConfigWithSettledDispatcher({
                cfg,
                ctxPayload,
                dispatcher,
                onSettled: () => markDispatchIdle(),
                replyOptions,
                configOverride,
              }),
          }),
        },
      });
      const dispatchResult = turnResult.dispatched ? turnResult.dispatchResult : void 0;
      const queuedFinal = dispatchResult?.queuedFinal ?? false;
      const counts = resolveChannelTurnDispatchCounts(dispatchResult);
      const hasFinalResponse = hasFinalChannelTurnDispatch(dispatchResult);
      log.info("dispatch complete", {
        queuedFinal,
        counts,
      });
      if (!hasFinalResponse) return;
      const finalCount = counts.final;
      logVerboseMessage(
        `msteams: delivered ${finalCount} reply${finalCount === 1 ? "" : "ies"} to ${teamsTo}`,
      );
    } catch (err) {
      log.error("dispatch failed", { error: formatUnknownError(err) });
      runtime.error(`msteams dispatch failed: ${formatUnknownError(err)}`);
      try {
        await context.sendActivity("⚠️ Something went wrong. Please try again.");
      } catch {}
    }
  };
  const inboundDebouncer = core.channel.debounce.createInboundDebouncer({
    debounceMs: inboundDebounceMs,
    buildKey: (entry) => {
      const conversationId = normalizeMSTeamsConversationId(
        entry.context.activity.conversation?.id ?? "",
      );
      const senderId =
        entry.context.activity.from?.aadObjectId ?? entry.context.activity.from?.id ?? "";
      if (!senderId || !conversationId) return null;
      return `msteams:${appId}:${conversationId}:${senderId}`;
    },
    shouldDebounce: (entry) => {
      if (!entry.text.trim()) return false;
      if (entry.attachments.length > 0) return false;
      return !core.channel.commands.isControlCommandMessage(entry.text, cfg);
    },
    onFlush: async (entries) => {
      const last = entries.at(-1);
      if (!last) return;
      if (entries.length === 1) {
        await handleTeamsMessageNow(last);
        return;
      }
      const combinedText = entries
        .map((entry) => entry.text)
        .filter(Boolean)
        .join("\n");
      if (!combinedText.trim()) return;
      const combinedRawText = entries
        .map((entry) => entry.rawText)
        .filter(Boolean)
        .join("\n");
      const wasMentioned = entries.some((entry) => entry.wasMentioned);
      const implicitMentionKinds = entries.flatMap((entry) => entry.implicitMentionKinds);
      await handleTeamsMessageNow({
        context: last.context,
        rawText: combinedRawText,
        text: combinedText,
        attachments: [],
        wasMentioned,
        implicitMentionKinds,
      });
    },
    onError: (err) => {
      runtime.error(`msteams debounce flush failed: ${formatUnknownError(err)}`);
    },
  });
  return async function handleTeamsMessage(context) {
    const activity = context.activity;
    const attachments = Array.isArray(activity.attachments) ? activity.attachments : [];
    const rawText = activity.text?.trim() ?? "";
    const htmlText = extractTextFromHtmlAttachments(attachments);
    const valueText =
      rawText || htmlText ? "" : serializeMSTeamsAdaptiveCardActionValue(activity.value);
    const text = stripMSTeamsMentionTags(rawText || htmlText || valueText || "");
    const wasMentioned = wasMSTeamsBotMentioned(activity);
    const conversationId = normalizeMSTeamsConversationId(activity.conversation?.id ?? "");
    const replyToId = activity.replyToId ?? void 0;
    const implicitMentionKinds =
      conversationId &&
      replyToId &&
      (await wasMSTeamsMessageSentWithPersistence({
        conversationId,
        messageId: replyToId,
      }))
        ? ["reply_to_bot"]
        : [];
    await inboundDebouncer.enqueue({
      context,
      rawText,
      text,
      attachments,
      wasMentioned,
      implicitMentionKinds,
    });
  };
}
//#endregion
//#region extensions/msteams/src/monitor-handler/reaction-handler.ts
/**
 * Create a handler for MS Teams reaction activities (reactionsAdded / reactionsRemoved).
 * The returned function accepts a turn context and a direction string.
 */
function createMSTeamsReactionHandler(deps) {
  const { cfg, log } = deps;
  const core = getMSTeamsRuntime();
  const msteamsCfg = cfg.channels?.msteams;
  return async function handleReaction(context, direction) {
    const activity = context.activity;
    const reactions =
      direction === "added" ? (activity.reactionsAdded ?? []) : (activity.reactionsRemoved ?? []);
    if (reactions.length === 0) {
      log.debug?.("reaction activity has no reactions; skipping");
      return;
    }
    const from = activity.from;
    if (!from?.id) {
      log.debug?.("reaction activity missing from.id; skipping");
      return;
    }
    const conversationId = normalizeMSTeamsConversationId(activity.conversation?.id ?? "");
    const conversationType = activity.conversation?.conversationType ?? "personal";
    const isGroupChat = conversationType === "groupChat" || activity.conversation?.isGroup === true;
    const isChannel = conversationType === "channel";
    const isDirectMessage = !isGroupChat && !isChannel;
    const senderId = from.aadObjectId ?? from.id;
    const senderName = from.name ?? from.id;
    if (msteamsCfg) {
      const senderAccess = await resolveMSTeamsSenderAccess({
        cfg,
        activity,
      });
      if (senderAccess.senderAccess.decision !== "allow") {
        log.debug?.("dropping reaction (access denied)", {
          sender: senderId,
          reason: senderAccess.senderAccess.reasonCode,
        });
        return;
      }
    }
    const teamId = isDirectMessage ? void 0 : activity.channelData?.team?.id;
    const route = core.channel.routing.resolveAgentRoute({
      cfg,
      channel: "msteams",
      peer: {
        kind: isDirectMessage ? "direct" : isChannel ? "channel" : "group",
        id: isDirectMessage ? senderId : conversationId,
      },
      ...(teamId ? { teamId } : {}),
    });
    const targetMessageId = activity.replyToId ?? "unknown";
    for (const reaction of reactions) {
      const reactionType = reaction.type ?? "unknown";
      const emoji = resolveMSTeamsReactionEmoji(reactionType);
      const label =
        direction === "added"
          ? `Teams reaction ${emoji} added by ${senderName} on message ${targetMessageId}`
          : `Teams reaction ${emoji} removed by ${senderName} from message ${targetMessageId}`;
      log.info(`reaction ${direction}`, {
        sender: senderId,
        reactionType,
        emoji,
        targetMessageId,
        conversationId,
      });
      core.system.enqueueSystemEvent(label, {
        sessionKey: route.sessionKey,
        contextKey: `msteams:reaction:${conversationId}:${targetMessageId}:${senderId}:${reactionType}:${direction}`,
      });
    }
  };
}
//#endregion
//#region extensions/msteams/src/welcome-card.ts
/**
 * Builds an Adaptive Card for welcoming users when the bot is added to a conversation.
 */
const DEFAULT_PROMPT_STARTERS = [
  "What can you do?",
  "Summarize my last meeting",
  "Help me draft an email",
];
/**
 * Build a welcome Adaptive Card for 1:1 personal chats.
 */
function buildWelcomeCard(options) {
  const botName = options?.botName || "OpenClaw";
  const starters = options?.promptStarters?.length
    ? options.promptStarters
    : DEFAULT_PROMPT_STARTERS;
  return {
    type: "AdaptiveCard",
    version: "1.5",
    body: [
      {
        type: "TextBlock",
        text: `Hi! I'm ${botName}.`,
        weight: "Bolder",
        size: "Medium",
      },
      {
        type: "TextBlock",
        text: "I can help you with questions, tasks, and more. Here are some things to try:",
        wrap: true,
      },
    ],
    actions: starters.map((label) => ({
      type: "Action.Submit",
      title: label,
      data: {
        msteams: {
          type: "imBack",
          value: label,
        },
      },
    })),
  };
}
/**
 * Build a brief welcome message for group chats (when the bot is @mentioned).
 */
function buildGroupWelcomeText(botName) {
  const name = botName || "OpenClaw";
  return `Hi! I'm ${name}. Mention me with @${name} to get started.`;
}
//#endregion
//#region extensions/msteams/src/monitor-handler.ts
async function isInvokeAuthorized(params) {
  const { context, deps, deniedLogs, includeInvokeName = false } = params;
  const resolved = await resolveMSTeamsSenderAccess({
    cfg: deps.cfg,
    activity: context.activity,
  });
  const { msteamsCfg, isDirectMessage, conversationId, senderId } = resolved;
  if (!msteamsCfg) return true;
  const maybeInvokeName = includeInvokeName ? { name: context.activity.name } : void 0;
  if (isDirectMessage && resolved.senderAccess.decision !== "allow") {
    deps.log.debug?.(deniedLogs.dm, {
      sender: senderId,
      conversationId,
      ...maybeInvokeName,
    });
    return false;
  }
  if (
    !isDirectMessage &&
    resolved.channelGate.allowlistConfigured &&
    !resolved.channelGate.allowed
  ) {
    deps.log.debug?.(deniedLogs.channel, {
      conversationId,
      teamKey: resolved.channelGate.teamKey ?? "none",
      channelKey: resolved.channelGate.channelKey ?? "none",
      ...maybeInvokeName,
    });
    return false;
  }
  if (!isDirectMessage && !resolved.senderAccess.allowed) {
    deps.log.debug?.(deniedLogs.group, {
      sender: senderId,
      conversationId,
      ...maybeInvokeName,
    });
    return false;
  }
  return true;
}
async function isFeedbackInvokeAuthorized(context, deps) {
  return isInvokeAuthorized({
    context,
    deps,
    deniedLogs: {
      dm: "dropping feedback invoke (dm sender not allowlisted)",
      channel: "dropping feedback invoke (not in team/channel allowlist)",
      group: "dropping feedback invoke (group sender not allowlisted)",
    },
  });
}
async function isSigninInvokeAuthorized(context, deps) {
  return isInvokeAuthorized({
    context,
    deps,
    deniedLogs: {
      dm: "dropping signin invoke (dm sender not allowlisted)",
      channel: "dropping signin invoke (not in team/channel allowlist)",
      group: "dropping signin invoke (group sender not allowlisted)",
    },
    includeInvokeName: true,
  });
}
async function isCardActionInvokeAuthorized(context, deps) {
  return isInvokeAuthorized({
    context,
    deps,
    deniedLogs: {
      dm: "dropping card action invoke (dm sender not allowlisted)",
      channel: "dropping card action invoke (not in team/channel allowlist)",
      group: "dropping card action invoke (group sender not allowlisted)",
    },
    includeInvokeName: true,
  });
}
function registerMSTeamsHandlers(handler, deps) {
  const handleTeamsMessage = createMSTeamsMessageHandler(deps);
  const handleReaction = createMSTeamsReactionHandler(deps);
  const originalRun = handler.run;
  if (originalRun)
    handler.run = async (context) => {
      const ctx = context;
      if (ctx.activity?.type === "invoke" && ctx.activity?.name === "adaptiveCard/action") {
        const text = serializeMSTeamsAdaptiveCardActionValue(ctx.activity?.value);
        if (text)
          await handleTeamsMessage({
            ...ctx,
            activity: {
              ...ctx.activity,
              type: "message",
              text,
            },
          });
        return;
      }
      return originalRun.call(handler, context);
    };
  handler.onMessage(async (context, next) => {
    try {
      await handleTeamsMessage(context);
    } catch (err) {
      deps.runtime.error(`msteams handler failed: ${formatUnknownError(err)}`);
    }
    await next();
  });
  handler.onMembersAdded(async (context, next) => {
    const ctx = context;
    const membersAdded = ctx.activity?.membersAdded ?? [];
    const botId = ctx.activity?.recipient?.id;
    const msteamsCfg = deps.cfg.channels?.msteams;
    for (const member of membersAdded)
      if (member.id === botId) {
        const isPersonal =
          (normalizeOptionalLowercaseString(ctx.activity?.conversation?.conversationType) ??
            "personal") === "personal";
        if (isPersonal && msteamsCfg?.welcomeCard !== false) {
          const card = buildWelcomeCard({
            botName: ctx.activity?.recipient?.name ?? void 0,
            promptStarters: msteamsCfg?.promptStarters,
          });
          try {
            await ctx.sendActivity({
              type: "message",
              attachments: [
                {
                  contentType: "application/vnd.microsoft.card.adaptive",
                  content: card,
                },
              ],
            });
            deps.log.info("sent welcome card");
          } catch (err) {
            deps.log.debug?.("failed to send welcome card", { error: formatUnknownError(err) });
          }
        } else if (!isPersonal && msteamsCfg?.groupWelcomeCard === true) {
          const botName = ctx.activity?.recipient?.name ?? void 0;
          try {
            await ctx.sendActivity(buildGroupWelcomeText(botName));
            deps.log.info("sent group welcome message");
          } catch (err) {
            deps.log.debug?.("failed to send group welcome", { error: formatUnknownError(err) });
          }
        } else deps.log.debug?.("skipping welcome (disabled by config or conversation type)");
      } else deps.log.debug?.("member added", { member: member.id });
    await next();
  });
  handler.onReactionsAdded(async (context, next) => {
    try {
      await handleReaction(context, "added");
    } catch (err) {
      deps.runtime.error(`msteams reaction handler failed: ${String(err)}`);
    }
    await next();
  });
  handler.onReactionsRemoved(async (context, next) => {
    try {
      await handleReaction(context, "removed");
    } catch (err) {
      deps.runtime.error(`msteams reaction handler failed: ${String(err)}`);
    }
    await next();
  });
  return handler;
}
//#endregion
//#region extensions/msteams/src/feedback-invoke.ts
/**
 * Run the message-submit (feedback) invoke handler.
 *
 * Teams delivers feedback (`actionName === "feedback"`) on AI-generated
 * messages as a `message/submitAction` invoke. The SDK wraps a void return
 * into the HTTP 200 InvokeResponse, so this function intentionally does
 * not ack itself — the legacy `ctx.sendActivity({ type: "invokeResponse",
 * … })` shape is gone (it became an outbound BF activity on the new SDK
 * instead of the HTTP response).
 *
 * Returns `true` if the invoke matched the feedback shape and was
 * consumed (whether or not it was authorized / written / reflected on),
 * `false` if the invoke didn't look like feedback at all and the caller
 * should fall through to other handlers.
 */
async function runMSTeamsFeedbackInvokeHandler(context, deps) {
  const activity = context.activity;
  const value = activity.value;
  if (!value) return false;
  if (value.actionName !== "feedback") return false;
  const reaction = value.actionValue?.reaction;
  if (reaction !== "like" && reaction !== "dislike") {
    deps.log.debug?.("ignoring feedback with unknown reaction", { reaction });
    return false;
  }
  const msteamsCfg = deps.cfg.channels?.msteams;
  if (msteamsCfg?.feedbackEnabled === false) {
    deps.log.debug?.("feedback handling disabled");
    return true;
  }
  if (!(await isFeedbackInvokeAuthorized(context, deps))) return true;
  let userComment;
  if (value.actionValue?.feedback)
    try {
      userComment = JSON.parse(value.actionValue.feedback).feedbackText || void 0;
    } catch {}
  const rawConversationId = activity.conversation?.id ?? "unknown";
  const conversationId = normalizeMSTeamsConversationId(rawConversationId);
  const senderId = activity.from?.aadObjectId ?? activity.from?.id ?? "unknown";
  const messageId = value.replyToId ?? activity.replyToId ?? "unknown";
  const isNegative = reaction === "dislike";
  const convType = normalizeOptionalLowercaseString(activity.conversation?.conversationType);
  const isDirectMessage = convType === "personal" || (!convType && !activity.conversation?.isGroup);
  const isChannel = convType === "channel";
  const core = getMSTeamsRuntime();
  const route = core.channel.routing.resolveAgentRoute({
    cfg: deps.cfg,
    channel: "msteams",
    peer: {
      kind: isDirectMessage ? "direct" : isChannel ? "channel" : "group",
      id: isDirectMessage ? senderId : conversationId,
    },
  });
  const feedbackThreadId = isChannel
    ? (extractMSTeamsConversationMessageId(rawConversationId) ?? activity.replyToId ?? void 0)
    : void 0;
  if (feedbackThreadId)
    route.sessionKey = resolveThreadSessionKeys({
      baseSessionKey: route.sessionKey,
      threadId: feedbackThreadId,
      parentSessionKey: route.sessionKey,
    }).sessionKey;
  const feedbackEvent = buildFeedbackEvent({
    messageId,
    value: isNegative ? "negative" : "positive",
    comment: userComment,
    sessionKey: route.sessionKey,
    agentId: route.agentId,
    conversationId,
  });
  deps.log.info("received feedback", {
    value: feedbackEvent.value,
    messageId,
    conversationId,
    hasComment: Boolean(userComment),
  });
  try {
    const storePath = core.channel.session.resolveStorePath(deps.cfg.session?.store, {
      agentId: route.agentId,
    });
    const safeKey = route.sessionKey.replace(/[^a-zA-Z0-9_-]/g, "_");
    await appendRegularFile({
      filePath: path.join(storePath, `${safeKey}.jsonl`),
      content: `${JSON.stringify(feedbackEvent)}\n`,
      rejectSymlinkParents: true,
    }).catch(() => {});
  } catch {}
  const conversationRef = {
    activityId: activity.id,
    user: {
      id: activity.from?.id,
      name: activity.from?.name,
      aadObjectId: activity.from?.aadObjectId,
    },
    agent: activity.recipient
      ? {
          id: activity.recipient.id,
          name: activity.recipient.name,
        }
      : void 0,
    conversation: {
      id: conversationId,
      conversationType: activity.conversation?.conversationType,
      tenantId: activity.conversation?.tenantId,
    },
    channelId: activity.channelId ?? "msteams",
    serviceUrl: activity.serviceUrl,
    locale: activity.locale,
  };
  if (isNegative && msteamsCfg?.feedbackReflection !== false)
    runFeedbackReflection({
      cfg: deps.cfg,
      app: deps.app,
      appId: deps.appId,
      conversationRef,
      sessionKey: route.sessionKey,
      agentId: route.agentId,
      conversationId,
      feedbackMessageId: messageId,
      userComment,
      log: deps.log,
    }).catch((err) => {
      deps.log.error("feedback reflection failed", { error: formatUnknownError(err) });
    });
  return true;
}
//#endregion
//#region extensions/msteams/src/file-consent-invoke.ts
/**
 * Handle fileConsent/invoke activities for large file uploads.
 */
async function handleMSTeamsFileConsentInvoke(context, log) {
  const expiredUploadMessage =
    "The file upload request has expired. Please try sending the file again.";
  const activity = context.activity;
  if (activity.type !== "invoke" || activity.name !== "fileConsent/invoke") return false;
  const consentResponse = parseFileConsentInvoke(activity);
  if (!consentResponse) {
    log.debug?.("invalid file consent invoke", { value: activity.value });
    return false;
  }
  const uploadId =
    typeof consentResponse.context?.uploadId === "string"
      ? consentResponse.context.uploadId
      : void 0;
  const inMemoryFile = getPendingUpload(uploadId);
  const fsFile = inMemoryFile ? void 0 : await getPendingUploadFs(uploadId);
  const pendingFile = inMemoryFile ?? fsFile;
  if (pendingFile) {
    const pendingConversationId = normalizeMSTeamsConversationId(pendingFile.conversationId);
    const invokeConversationId = normalizeMSTeamsConversationId(activity.conversation?.id ?? "");
    if (!invokeConversationId || pendingConversationId !== invokeConversationId) {
      log.info("file consent conversation mismatch", {
        uploadId,
        expectedConversationId: pendingConversationId,
        receivedConversationId: invokeConversationId || void 0,
      });
      if (consentResponse.action === "accept") await context.sendActivity(expiredUploadMessage);
      return true;
    }
  }
  if (consentResponse.action === "accept" && consentResponse.uploadInfo)
    if (pendingFile) {
      log.debug?.("user accepted file consent, uploading", {
        uploadId,
        filename: pendingFile.filename,
        size: pendingFile.buffer.length,
      });
      try {
        await uploadToConsentUrl({
          url: consentResponse.uploadInfo.uploadUrl,
          buffer: pendingFile.buffer,
          contentType: pendingFile.contentType,
        });
        const fileInfoCard = buildFileInfoCard({
          filename: consentResponse.uploadInfo.name,
          contentUrl: consentResponse.uploadInfo.contentUrl,
          uniqueId: consentResponse.uploadInfo.uniqueId,
          fileType: consentResponse.uploadInfo.fileType,
        });
        if (!pendingFile.consentCardActivityId)
          await context.sendActivity({
            type: "message",
            attachments: [fileInfoCard],
          });
        if (pendingFile.consentCardActivityId)
          try {
            await context.updateActivity({
              id: pendingFile.consentCardActivityId,
              type: "message",
              attachments: [fileInfoCard],
            });
          } catch {
            await context.sendActivity({
              type: "message",
              attachments: [fileInfoCard],
            });
          }
        log.info("file upload complete", {
          uploadId,
          filename: consentResponse.uploadInfo.name,
          uniqueId: consentResponse.uploadInfo.uniqueId,
        });
      } catch (err) {
        log.error("file upload failed", {
          uploadId,
          error: formatUnknownError(err),
        });
        await context.sendActivity("File upload failed. Please try again.");
      } finally {
        removePendingUpload(uploadId);
        await removePendingUploadFs(uploadId);
      }
    } else {
      log.debug?.("pending file not found for consent", { uploadId });
      await context.sendActivity(expiredUploadMessage);
    }
  else {
    log.debug?.("user declined file consent", { uploadId });
    removePendingUpload(uploadId);
    await removePendingUploadFs(uploadId);
  }
  return true;
}
/**
 * Run the file-consent invoke handler after the SDK route has acknowledged the
 * invoke. This intentionally does not send its own invokeResponse; it only does
 * the delayed upload/update work.
 */
async function runMSTeamsFileConsentInvokeHandler(context, log) {
  try {
    await withRevokedProxyFallback({
      run: async () => await handleMSTeamsFileConsentInvoke(context, log),
      onRevoked: async () => true,
      onRevokedLog: () => {
        log.debug?.("turn context revoked during file consent invoke; skipping delayed response");
      },
    });
  } catch (err) {
    log.debug?.("file consent handler error", { error: formatUnknownError(err) });
  }
}
//#endregion
//#region extensions/msteams/src/webhook-timeouts.ts
const MSTEAMS_WEBHOOK_INACTIVITY_TIMEOUT_MS = 3e4;
const MSTEAMS_WEBHOOK_REQUEST_TIMEOUT_MS = 3e4;
const MSTEAMS_WEBHOOK_HEADERS_TIMEOUT_MS = 15e3;
function applyMSTeamsWebhookTimeouts(httpServer, opts) {
  const inactivityTimeoutMs = opts?.inactivityTimeoutMs ?? MSTEAMS_WEBHOOK_INACTIVITY_TIMEOUT_MS;
  const requestTimeoutMs = opts?.requestTimeoutMs ?? MSTEAMS_WEBHOOK_REQUEST_TIMEOUT_MS;
  const headersTimeoutMs = Math.min(
    opts?.headersTimeoutMs ?? MSTEAMS_WEBHOOK_HEADERS_TIMEOUT_MS,
    requestTimeoutMs,
  );
  httpServer.setTimeout(inactivityTimeoutMs);
  httpServer.requestTimeout = requestTimeoutMs;
  httpServer.headersTimeout = headersTimeoutMs;
}
//#endregion
//#region extensions/msteams/src/monitor.ts
async function monitorMSTeamsProvider(opts) {
  const core = getMSTeamsRuntime();
  const log = core.logging.getChildLogger({ name: "msteams" });
  let cfg = opts.cfg;
  let msteamsCfg = cfg.channels?.msteams;
  if (!msteamsCfg?.enabled) {
    log.debug?.("msteams provider disabled");
    return {
      app: null,
      shutdown: async () => {},
    };
  }
  const creds = resolveMSTeamsCredentials(msteamsCfg);
  if (!creds) {
    log.error("msteams credentials not configured");
    return {
      app: null,
      shutdown: async () => {},
    };
  }
  const appId = creds.appId;
  const runtime = opts.runtime ?? {
    log: console.log,
    error: console.error,
    exit: (code) => {
      throw new Error(`exit ${code}`);
    },
  };
  const configuredAllowFrom = msteamsCfg.allowFrom;
  const configuredGroupAllowFrom = msteamsCfg.groupAllowFrom;
  let allowFrom = projectStableMSTeamsUserAllowlist(configuredAllowFrom);
  let groupAllowFrom = projectStableMSTeamsUserAllowlist(configuredGroupAllowFrom);
  let teamsConfig = projectStableMSTeamsTeamsConfig(msteamsCfg.teams);
  const allowNameMatching = isDangerousNameMatchingEnabled(msteamsCfg);
  const cleanAllowEntry = (entry) =>
    entry
      .replace(/^(msteams|teams):/i, "")
      .replace(/^user:/i, "")
      .trim();
  const isStableUserId = (entry) => /^[0-9a-fA-F-]{16,}$/.test(entry);
  const cleanAllowEntries = (entries) =>
    entries?.map((entry) => cleanAllowEntry(entry)).filter((entry) => entry && entry !== "*") ?? [];
  const isMutableUserEntry = (entry) => !isStableUserId(entry) && !/^accessGroup:/i.test(entry);
  const resolveAllowlistUsers = async (label, entries) => {
    if (entries.length === 0)
      return {
        additions: [],
        unresolved: [],
      };
    const resolved = await resolveMSTeamsUserAllowlist({
      cfg,
      entries,
    });
    const additions = [];
    const unresolved = [];
    for (const entry of resolved)
      if (entry.resolved && entry.id) additions.push(entry.id);
      else unresolved.push(entry.input);
    summarizeMapping(
      label,
      resolved
        .filter((entry) => entry.resolved && entry.id)
        .map((entry) => `${entry.input}→${entry.id}`),
      unresolved,
      runtime,
    );
    return {
      additions,
      unresolved,
    };
  };
  try {
    if (allowNameMatching) {
      const allowEntries = cleanAllowEntries(configuredAllowFrom).filter(isMutableUserEntry);
      if (allowEntries.length > 0) {
        const { additions } = await resolveAllowlistUsers("msteams users", allowEntries);
        allowFrom = mergeAllowlist({
          existing: allowFrom,
          additions,
        });
      }
      if (Array.isArray(configuredGroupAllowFrom) && configuredGroupAllowFrom.length > 0) {
        const groupEntries = cleanAllowEntries(configuredGroupAllowFrom).filter(isMutableUserEntry);
        if (groupEntries.length > 0) {
          const { additions } = await resolveAllowlistUsers("msteams group users", groupEntries);
          groupAllowFrom = mergeAllowlist({
            existing: groupAllowFrom,
            additions,
          });
        }
      }
    }
    if (msteamsCfg.teams && Object.keys(msteamsCfg.teams).length > 0) {
      const resolved = await resolveMSTeamsTeamsConfig({
        cfg,
        teamIdMode: "bot-framework",
        teams: msteamsCfg.teams,
      });
      teamsConfig = resolved.teams;
      summarizeMapping("msteams channels", resolved.mapping, resolved.unresolved, runtime);
    }
  } catch (err) {
    runtime.error?.(
      `msteams resolve failed; mutable allowlist entries are disabled. ${formatUnknownError(err)}`,
    );
  }
  msteamsCfg = {
    ...msteamsCfg,
    allowFrom,
    groupAllowFrom,
    teams: teamsConfig,
  };
  cfg = {
    ...cfg,
    channels: {
      ...cfg.channels,
      msteams: msteamsCfg,
    },
  };
  const port = msteamsCfg.webhook?.port ?? 3978;
  const textLimit = core.channel.text.resolveTextChunkLimit(cfg, "msteams");
  const MB = 1024 * 1024;
  const agentDefaults = cfg.agents?.defaults;
  const mediaMaxBytes =
    typeof agentDefaults?.mediaMaxMb === "number" && agentDefaults.mediaMaxMb > 0
      ? Math.floor(agentDefaults.mediaMaxMb * MB)
      : 8 * MB;
  const conversationStore = opts.conversationStore ?? createMSTeamsConversationStoreState();
  const pollStore = opts.pollStore ?? createMSTeamsPollStoreState();
  log.info(`starting provider (port ${port})`);
  const express = await import("express");
  const expressApp = express.default();
  expressApp.use((req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    next();
  });
  expressApp.use(express.json({ limit: DEFAULT_WEBHOOK_MAX_BODY_BYTES }));
  expressApp.use((err, _req, res, next) => {
    if (err && typeof err === "object" && "status" in err && err.status === 413) {
      res.status(413).json({ error: "Payload too large" });
      return;
    }
    next(err);
  });
  const configuredPath = msteamsCfg.webhook?.path ?? "/api/messages";
  const ssoConnectionName =
    msteamsCfg.sso?.enabled && msteamsCfg.sso.connectionName
      ? msteamsCfg.sso.connectionName
      : void 0;
  const { app } = await loadMSTeamsSdkWithAuth(creds, {
    ...resolveMSTeamsSdkCloudOptions(msteamsCfg),
    httpServerAdapter: await createMSTeamsExpressAdapter(expressApp),
    messagingEndpoint: configuredPath,
    ...(ssoConnectionName ? { oauthDefaultConnectionName: ssoConnectionName } : {}),
  });
  if (configuredPath !== "/api/messages") {
    let warnedLegacyMessagesRoute = false;
    expressApp.post("/api/messages", (req, res, next) => {
      if (!warnedLegacyMessagesRoute) {
        warnedLegacyMessagesRoute = true;
        log.warn?.(
          `received request on /api/messages but webhook.path is ${configuredPath}; update your Azure Bot endpoint — this fallback will be removed in a future release`,
        );
      }
      req.url = configuredPath;
      expressApp(req, res, next);
    });
  }
  const tokenProvider = createMSTeamsTokenProvider(app);
  const ssoDeps = ssoConnectionName
    ? {
        tokenStore: createMSTeamsSsoTokenStoreFs(),
        connectionName: ssoConnectionName,
      }
    : void 0;
  if (ssoDeps) log.debug?.("msteams sso enabled", { connectionName: ssoDeps.connectionName });
  const handler = buildActivityHandler();
  const handlerDeps = {
    cfg,
    runtime,
    appId,
    app,
    tokenProvider,
    textLimit,
    mediaMaxBytes,
    conversationStore,
    pollStore,
    log,
  };
  registerMSTeamsHandlers(handler, handlerDeps);
  app.on("card.action", async (ctx) => {
    const adaptedCtx = adaptSdkContext(ctx, app);
    try {
      const activity = adaptedCtx.activity;
      const vote = extractMSTeamsPollVote(activity);
      if (vote) {
        const voterId = activity?.from?.aadObjectId ?? activity?.from?.id ?? "unknown";
        try {
          if (!(await isCardActionInvokeAuthorized(adaptedCtx, handlerDeps)))
            return {
              statusCode: 200,
              type: "application/vnd.microsoft.activity.message",
              value: "Not authorized.",
            };
          const existingPoll = await pollStore.getPoll(vote.pollId);
          if (!existingPoll) {
            log.debug?.("poll vote ignored (poll not found)", { pollId: vote.pollId });
            return {
              statusCode: 200,
              type: "application/vnd.microsoft.activity.message",
              value: "Poll not found.",
            };
          }
          const pollConversationId = existingPoll.conversationId
            ? normalizeMSTeamsConversationId(existingPoll.conversationId)
            : void 0;
          const activityConversationId = normalizeMSTeamsConversationId(
            activity?.conversation?.id ?? "",
          );
          if (pollConversationId && pollConversationId !== activityConversationId) {
            log.info("poll vote ignored (conversation mismatch)", {
              pollId: vote.pollId,
              expectedConversationId: pollConversationId,
              receivedConversationId: activityConversationId || void 0,
            });
            return {
              statusCode: 200,
              type: "application/vnd.microsoft.activity.message",
              value: "Poll not found.",
            };
          }
          if (
            await pollStore.recordVote({
              pollId: vote.pollId,
              voterId,
              selections: vote.selections,
            })
          ) {
            log.info("recorded poll vote", {
              pollId: vote.pollId,
              voterId,
            });
            return {
              statusCode: 200,
              type: "application/vnd.microsoft.activity.message",
              value: "Vote recorded.",
            };
          }
          log.debug?.("poll vote ignored (poll not found)", { pollId: vote.pollId });
          return {
            statusCode: 200,
            type: "application/vnd.microsoft.activity.message",
            value: "Poll not found.",
          };
        } catch (err) {
          log.error("failed to record poll vote", {
            pollId: vote.pollId,
            error: formatUnknownError(err),
          });
          return {
            statusCode: 500,
            type: "application/vnd.microsoft.error",
            value: {
              code: "RECORD_VOTE_FAILED",
              message: "Could not record vote.",
              innerHttpError: {
                statusCode: 500,
                body: null,
              },
            },
          };
        }
      }
      handler.run(adaptedCtx).catch((err) => {
        log.error("msteams card.action dispatch failed", { error: formatUnknownError(err) });
      });
      return {
        statusCode: 200,
        type: "application/vnd.microsoft.activity.message",
        value: "OK",
      };
    } catch (err) {
      log.error("msteams card.action failed", { error: formatUnknownError(err) });
      return {
        statusCode: 500,
        type: "application/vnd.microsoft.error",
        value: {
          code: "CARD_ACTION_FAILED",
          message: "Card action failed.",
          innerHttpError: {
            statusCode: 500,
            body: null,
          },
        },
      };
    }
  });
  app.on("file.consent.accept", (ctx) => {
    runMSTeamsFileConsentInvokeHandler(adaptSdkContext(ctx, app), log);
  });
  app.on("file.consent.decline", (ctx) => {
    runMSTeamsFileConsentInvokeHandler(adaptSdkContext(ctx, app), log);
  });
  const handleSdkSigninInvoke = async (ctx, delegateName) => {
    const adaptedCtx = adaptSdkContext(ctx, app);
    if (!(await isSigninInvokeAuthorized(adaptedCtx, handlerDeps)))
      return {
        status: 200,
        body: {},
      };
    if (!ssoDeps) {
      log.debug?.("signin invoke received but msteams.sso is not configured", {
        name: adaptedCtx.activity?.name,
      });
      return {
        status: 200,
        body: {},
      };
    }
    const sdkSigninApp = app;
    const delegate = sdkSigninApp[delegateName];
    if (typeof delegate !== "function")
      throw new Error(`Teams SDK ${delegateName} handler is unavailable`);
    return delegate.call(sdkSigninApp, ctx);
  };
  app.on("signin.token-exchange", (ctx) => handleSdkSigninInvoke(ctx, "onTokenExchange"));
  app.on("signin.verify-state", (ctx) => handleSdkSigninInvoke(ctx, "onVerifyState"));
  if (ssoDeps)
    app.event("signin", (ctx) => {
      (async () => {
        if (!(await isSigninInvokeAuthorized(adaptSdkContext(ctx, app), handlerDeps))) return;
        const activity = ctx.activity;
        const userIds = Array.from(
          new Set([activity.from?.id, activity.from?.aadObjectId].filter((id) => Boolean(id))),
        );
        const connectionName = ctx.token.connectionName || ssoDeps.connectionName;
        if (!connectionName || !ctx.token.token || userIds.length === 0) {
          log.warn?.("msteams sso signin event missing token metadata", {
            hasConnectionName: Boolean(connectionName),
            hasToken: Boolean(ctx.token.token),
            hasUser: userIds.length > 0,
          });
          return;
        }
        await Promise.all(
          userIds.map((userId) =>
            ssoDeps.tokenStore.save({
              connectionName,
              userId,
              token: ctx.token.token,
              expiresAt: ctx.token.expiration,
              updatedAt: /* @__PURE__ */ new Date().toISOString(),
            }),
          ),
        );
        log.info("msteams sso token persisted", {
          connectionName,
          userIdCount: userIds.length,
          hasExpiry: Boolean(ctx.token.expiration),
        });
      })().catch((err) => {
        log.error("msteams sso token persistence failed", { error: formatUnknownError(err) });
      });
    });
  app.on("message.submit", async (ctx) => {
    if (!(await runMSTeamsFeedbackInvokeHandler(adaptSdkContext(ctx, app), handlerDeps)))
      await ctx.next?.call(ctx);
  });
  app.on("activity", async (ctx) => {
    try {
      const adaptedCtx = adaptSdkContext(ctx, app);
      const activity = adaptedCtx.activity;
      if (activity?.type === "invoke") {
        if (activity?.name === "adaptiveCard/action") return;
        if (activity?.name === "fileConsent/invoke") return;
        if (activity?.name === "signin/tokenExchange" || activity?.name === "signin/verifyState")
          return;
      }
      await handler.run(adaptedCtx);
    } catch (err) {
      log.error("msteams webhook failed", { error: formatUnknownError(err) });
    }
  });
  await app.initialize();
  const httpServer = await new Promise((resolve, reject) => {
    const server = expressApp.listen(port, (err) => (err ? reject(err) : resolve(server)));
  }).catch((err) => {
    log.error("msteams server error", { error: formatUnknownError(err) });
    throw err;
  });
  log.info(`msteams provider started on port ${port}`);
  applyMSTeamsWebhookTimeouts(httpServer);
  httpServer.on("error", (err) => {
    log.error("msteams server error", { error: formatUnknownError(err) });
  });
  const shutdown = async () => {
    log.info("shutting down msteams provider");
    return new Promise((resolve) => {
      httpServer.close((err) => {
        if (err) log.debug?.("msteams server close error", { error: formatUnknownError(err) });
        resolve();
      });
    });
  };
  await keepHttpServerTaskAlive({
    server: httpServer,
    abortSignal: opts.abortSignal,
    onAbort: shutdown,
  });
  return {
    app: expressApp,
    shutdown,
  };
}
/**
 * Build a minimal ActivityHandler-compatible object that supports
 * onMessage / onMembersAdded registration and a run() method.
 */
function buildActivityHandler() {
  const messageHandlers = [];
  const membersAddedHandlers = [];
  const reactionsAddedHandlers = [];
  const reactionsRemovedHandlers = [];
  const handler = {
    onMessage(cb) {
      messageHandlers.push(cb);
      return handler;
    },
    onMembersAdded(cb) {
      membersAddedHandlers.push(cb);
      return handler;
    },
    onReactionsAdded(cb) {
      reactionsAddedHandlers.push(cb);
      return handler;
    },
    onReactionsRemoved(cb) {
      reactionsRemovedHandlers.push(cb);
      return handler;
    },
    async run(context) {
      const ctx = context;
      const activityType = ctx?.activity?.type;
      const noop = async () => {};
      if (activityType === "message") for (const h of messageHandlers) await h(context, noop);
      else if (activityType === "conversationUpdate")
        for (const h of membersAddedHandlers) await h(context, noop);
      else if (activityType === "messageReaction") {
        const activity = ctx?.activity;
        if (activity?.reactionsAdded?.length)
          for (const h of reactionsAddedHandlers) await h(context, noop);
        if (activity?.reactionsRemoved?.length)
          for (const h of reactionsRemovedHandlers) await h(context, noop);
      }
    },
  };
  return handler;
}
/**
 * Adapt a new @microsoft/teams.apps SDK context to the MSTeamsTurnContext interface
 * our handlers expect. The new SDK uses reply()/send() instead of sendActivity().
 */
function adaptSdkContext(ctx, app) {
  const sdkCtx = ctx ?? {};
  if (typeof sdkCtx.reply !== "function" && typeof sdkCtx.send !== "function") return ctx;
  const conversationId = sdkCtx.activity?.conversation?.id ?? "";
  const inboundApi = sdkCtx.api;
  const activityApi = inboundApi ?? app.api;
  const getTeamDetails = inboundApi ? (teamId) => inboundApi.teams.getById(teamId) : void 0;
  const conversationType = (sdkCtx.activity?.conversation?.conversationType ?? "").toLowerCase();
  const isThreadable = conversationType === "channel" || conversationType === "groupchat";
  const sendActivity = (activity) =>
    isThreadable ? sdkCtx.reply(activity) : sdkCtx.send(activity);
  return Object.assign(Object.create(Object.getPrototypeOf(ctx)), ctx, {
    sendActivity,
    sendActivities: async (activities) => {
      const results = [];
      for (const a of activities) results.push(await sendActivity(a));
      return results;
    },
    updateActivity: async (activity) => {
      const activityId = activity.id ?? "";
      return activityApi.conversations.activities(conversationId).update(activityId, activity);
    },
    deleteActivity: async (activityId) => {
      return activityApi.conversations.activities(conversationId).delete(activityId);
    },
    getTeamDetails,
    stream: sdkCtx.stream,
  });
}
//#endregion
export { monitorMSTeamsProvider };
