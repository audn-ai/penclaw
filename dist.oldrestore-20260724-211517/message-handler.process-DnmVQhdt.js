import { f as resolveDiscordMaxLinesPerMessage } from "./accounts-BNPpAWWI.js";
import { i as shouldAckReaction } from "./ack-reactions-CSknIPuI.js";
import {
  a as normalizeDiscordSlug,
  r as normalizeDiscordAllowList,
} from "./allow-list-DdPHme1x.js";
import { f as stripReasoningTagsFromText } from "./assistant-visible-text-DV1Yognj.js";
import {
  a as DEFAULT_TIMING,
  c as createStatusReactionController,
} from "./channel-feedback-lNNgzRXo.js";
import { i as resolveChannelDraftStreamingChunking } from "./channel-outbound-DlkFd7rO.js";
import { s as resolveChunkMode } from "./chunk-DtO_2oor.js";
import { t as buildChannelInboundEventContext } from "./context-DMJN91Z-.js";
import { t as resolveChannelContextVisibilityMode } from "./context-visibility-BVlvSMUZ.js";
import { t as evaluateSupplementalContextVisibility } from "./context-visibility-C5CaKMWO.js";
import { t as resolveDiscordConversationIdentity } from "./conversation-identity-B8ctpwXe.js";
import { n as isDangerousNameMatchingEnabled } from "./dangerous-name-matching-Z6nhxFXz.js";
import { r as stripInlineDirectiveTagsForDelivery } from "./directive-tags-Btb1ssgA.js";
import {
  Lt as ChannelType,
  at as editChannelMessage,
  et as createChannelMessage,
  rt as deleteChannelMessage,
} from "./discord-bgbU23Hx.js";
import { l as resolvePinnedMainDmOwnerFromAllowlist } from "./dm-policy-shared-d7KFGRtT.js";
import { n as createFinalizableDraftLifecycle } from "./draft-stream-controls-CaxJNqVC.js";
import { t as EmbeddedBlockChunker } from "./embedded-agent-block-chunker-C20J1EzQ.js";
import {
  a as resolveEnvelopeFormatOptions,
  r as formatInboundEnvelope,
} from "./envelope-W2SlFUX-.js";
import "./error-runtime-BIAwr399.js";
import "./media-runtime-BhmZORKM.js";
import "./runtime-env-D0V-7Gqz.js";
import "./security-runtime-CraX8Pqe.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import "./text-chunking-Dr19ggf-.js";
import "./text-utility-runtime-CJESZCN5.js";
import { i as resolveTimestampMs } from "./format-DZW075F7.js";
import { a as shouldLogVerbose, r as logVerbose, t as danger } from "./globals-CNUzHTcU.js";
import "./routing-CwvmVRHd.js";
import { i as resolveHumanDelayConfig, t as resolveAckReaction } from "./identity-CceraXdn.js";
import {
  n as buildDiscordInboundAccessContext,
  r as createDiscordSupplementalContextAccessChecker,
} from "./inbound-context-DxpTwKP9.js";
import { t as beginDiscordInboundEventDeliveryCorrelation } from "./inbound-event-delivery-DO43mRtB.js";
import { r as dispatchChannelInboundReply } from "./inbound-reply-dispatch-DquY2pbK.js";
import {
  g as toInboundMediaFacts,
  h as toHistoryMediaEntries,
  l as hasFinalChannelTurnDispatch,
} from "./kernel-BhdvbEs2.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import {
  a as deliverWithFinalizableLivePreviewAdapter,
  r as defineFinalizableLivePreviewAdapter,
} from "./live-DjttXqqq.js";
import { r as getAgentScopedMediaLocalRoots } from "./local-roots-CgMgS9r2.js";
import { t as logAckFailure } from "./logging-gUWPKC5g.js";
import { t as resolveMarkdownTableMode } from "./markdown-tables-pi6oiKnf.js";
import { t as discordTextHasBroadcastMention } from "./mentions-DPSZx-Fv.js";
import {
  r as resolveDiscordMessageText,
  s as resolveReferencedReplyMediaList,
} from "./message-utils-prcoeLfb.js";
import "./reply-chunking-aJZ4F_cw.js";
import { t as DISCORD_TEXT_CHUNK_LIMIT } from "./outbound-adapter-Y0vWRo-E.js";
import { n as createChannelProgressDraftCompositor } from "./progress-draft-compositor-DC3-BWzZ.js";
import {
  a as buildGuildLabel,
  i as buildDirectLabel,
  n as formatDiscordReplyDeliveryFailure,
  o as resolveReplyContext,
  r as sanitizeDiscordFrontChannelReplyPayloads,
  t as deliverDiscordReply,
} from "./reply-delivery-CcImzyZT.js";
import { t as createChannelHistoryWindow } from "./reply-history-DTabwFaD.js";
import "./conversation-runtime-DuXhVyjf.js";
import "./agent-runtime-BiQiwmwD.js";
import "./markdown-table-runtime-DkTgtzZ0.js";
import "./dangerous-name-runtime-cJriWyuh.js";
import "./channel-inbound-vhkYEe2n.js";
import {
  c as isReplyPayloadNonTerminalToolErrorWarning,
  o as getReplyPayloadTtsSupplement,
} from "./reply-payload-BK_jICQ3.js";
import { m as resolveSendableOutboundReplyParts } from "./reply-payload-DDwHXDkv.js";
import {
  n as resolveChannelSourceReplyDeliveryMode,
  t as createChannelReplyPipeline,
} from "./reply-pipeline-uYpC1TSz.js";
import { i as chunkDiscordTextWithMode } from "./reply-reference-CeynpHZu.js";
import {
  n as DiscordRetryableInboundError,
  t as createDiscordReplyTypingFeedback,
} from "./reply-typing-feedback-CjAhBXbc.js";
import { t as buildAgentSessionKey } from "./resolve-route-oiOq6bK9.js";
import {
  d as editMessageDiscord,
  i as removeReactionDiscord,
  n as reactMessageDiscord,
} from "./send-BrvWC0qr.js";
import {
  I as createDiscordRestClient,
  L as createDiscordRuntimeAccountContext,
  _ as resolveDiscordMessageFlags,
  d as resolveDiscordTargetChannelId,
} from "./send.shared-Ciix19qx.js";
import { t as recordInboundSession } from "./session-Fo42_iaz.js";
import { p as resolveThreadSessionKeys } from "./session-key-druuY-GG.js";
import {
  l as readSessionUpdatedAt,
  m as resolveStorePath,
  r as getSessionEntry,
} from "./session-store-runtime-BwE6SlGz.js";
import { i as readLatestAssistantTextByIdentity } from "./session-transcript-runtime-B2hvNHEH.js";
import "./targets-C9fFpaW3.js";
import { t as sleep } from "./sleep-DZm1epyW.js";
import { s as sleepWithAbort } from "./src-Dqmh2693.js";
import {
  C as resolveChannelStreamingPreviewCommandText,
  D as resolveChannelStreamingSuppressDefaultToolProgressMessages,
  E as resolveChannelStreamingProgressNarration,
  O as resolveTranscriptBackedChannelFinalText,
  g as resolveChannelProgressDraftConfig,
  h as resolveChannelPreviewStreamMode,
  i as buildChannelProgressDraftLineForEntry,
  j as resolveChannelStreamingBlockEnabled,
  r as buildChannelProgressDraftLine,
  u as isChannelProgressDraftWorkToolName,
  w as resolveChannelStreamingPreviewToolProgress,
} from "./streaming-D_YE0SPS.js";
import { t as convertMarkdownTables } from "./tables-YoFSvuf8.js";
import { n as resolveDiscordChannelId } from "./target-parsing-DA2e4aeg.js";
import {
  c as resolveDiscordThreadStarter,
  r as resolveDiscordAutoThreadReplyPlan,
} from "./threading-UQvctHcU.js";
import {
  n as DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS,
  t as DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS,
} from "./timeouts-Bj-qI9VL.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region extensions/discord/src/monitor/ack-reactions.ts
function createDiscordAckReactionContext(params) {
  return {
    rest: params.rest,
    ...createDiscordRuntimeAccountContext({
      cfg: params.cfg,
      accountId: params.accountId,
    }),
  };
}
function createDiscordAckReactionAdapter(params) {
  return {
    setReaction: async (emoji) => {
      await reactMessageDiscord(params.channelId, params.messageId, emoji, params.reactionContext);
    },
    removeReaction: async (emoji) => {
      await removeReactionDiscord(
        params.channelId,
        params.messageId,
        emoji,
        params.reactionContext,
      );
    },
  };
}
function queueInitialDiscordAckReaction(params) {
  if (params.enabled) {
    params.statusReactions.setQueued();
    return;
  }
  if (!params.shouldSendAckReaction || !params.ackReaction) return;
  params.reactionAdapter.setReaction(params.ackReaction).catch((err) => {
    logAckFailure({
      log: logVerbose,
      channel: "discord",
      target: params.target,
      error: err,
    });
  });
}
//#endregion
//#region extensions/discord/src/monitor/message-handler.retry.ts
const REPLY_SESSION_INIT_CONFLICT_MESSAGE_RE = /^reply session initialization conflicted for \S+$/u;
const DISCORD_SESSION_INIT_CONFLICT_RETRY_DELAYS_MS = [250, 1e3, 2500];
const DISCORD_SESSION_CONFLICT_FAILURE_TEXT =
  "⚠️ Couldn't process this message because the session stayed busy. Please try again in a moment.";
function isReplySessionInitConflictError(error) {
  const message = error instanceof Error ? error.message : String(error);
  return REPLY_SESSION_INIT_CONFLICT_MESSAGE_RE.test(message);
}
var DiscordReplySessionConflictExhaustedError = class extends DiscordRetryableInboundError {
  constructor(message, options) {
    super(message, options);
    this.name = "DiscordReplySessionConflictExhaustedError";
  }
};
async function dispatchDiscordReplyWithSessionConflictRetry(params) {
  for (let retryIndex = 0; ; retryIndex += 1)
    try {
      return await params.dispatch();
    } catch (error) {
      if (!isReplySessionInitConflictError(error)) throw error;
      const delayMs = DISCORD_SESSION_INIT_CONFLICT_RETRY_DELAYS_MS[retryIndex];
      if (delayMs === void 0)
        throw new DiscordReplySessionConflictExhaustedError(
          `discord: reply session init conflict persisted after shared and channel retries: ${error instanceof Error ? error.message : String(error)}`,
          { cause: error },
        );
      params.onRetry?.(retryIndex + 1, delayMs);
      await sleepWithAbort(delayMs, params.abortSignal);
    }
}
function withDiscordSessionRetry(dispatch, abortSignal) {
  return (dispatchParams) =>
    dispatchDiscordReplyWithSessionConflictRetry({
      dispatch: () => dispatch(dispatchParams),
      abortSignal,
      onRetry: (attempt, delayMs) => {
        logVerbose(
          `discord: reply session init conflict; retrying dispatch ${attempt} after ${delayMs}ms`,
        );
      },
    });
}
async function completeDiscordSessionConflict(error, deliver, onDeliveryError) {
  if (!(error instanceof DiscordReplySessionConflictExhaustedError)) return false;
  try {
    await deliver(
      {
        text: DISCORD_SESSION_CONFLICT_FAILURE_TEXT,
        isError: true,
      },
      { kind: "final" },
    );
    return true;
  } catch (deliveryError) {
    onDeliveryError(deliveryError, { kind: "final" });
    return false;
  }
}
function removeDiscordReplayHistoryEntry(historyMap, historyKey, messageId) {
  const history = historyMap.get(historyKey);
  if (!history) return;
  for (let index = history.length - 1; index >= 0; index -= 1)
    if (history[index]?.messageId === messageId) history.splice(index, 1);
}
//#endregion
//#region extensions/discord/src/monitor/message-handler.context.ts
function normalizeDiscordDmOwnerEntry(entry) {
  const candidate = normalizeDiscordAllowList([entry], ["discord:", "user:", "pk:"])
    ?.ids.values()
    .next().value;
  return typeof candidate === "string" && /^\d+$/.test(candidate) ? candidate : void 0;
}
function isContextAborted(abortSignal) {
  return Boolean(abortSignal?.aborted);
}
async function buildDiscordMessageProcessContext(params) {
  const { ctx, text, mediaList } = params;
  const {
    cfg,
    discordConfig,
    accountId,
    runtime,
    botUserId,
    mediaMaxBytes,
    discordRestFetch,
    abortSignal,
    guildHistories,
    historyLimit,
    replyToMode,
    message,
    author,
    sender,
    canonicalMessageId,
    data,
    client,
    channelInfo,
    channelName,
    messageChannelId,
    isGuildMessage,
    isDirectMessage,
    baseText,
    preflightAudioTranscript,
    threadChannel,
    threadParentId,
    threadParentName,
    threadParentType,
    threadName,
    displayChannelSlug,
    guildInfo,
    guildSlug,
    memberRoleIds,
    channelConfig,
    baseSessionKey,
    boundSessionKey,
    route,
    commandAuthorized,
  } = ctx;
  const fromLabel = isDirectMessage
    ? buildDirectLabel(author)
    : buildGuildLabel({
        guild: data.guild ?? void 0,
        channelName: channelName ?? messageChannelId,
        channelId: messageChannelId,
      });
  const senderLabel = sender.label;
  const isForumParent =
    threadParentType === ChannelType.GuildForum || threadParentType === ChannelType.GuildMedia;
  const forumParentSlug =
    isForumParent && threadParentName ? normalizeDiscordSlug(threadParentName) : "";
  const threadChannelId = threadChannel?.id;
  const threadParentInheritanceEnabled = discordConfig?.thread?.inheritParent ?? false;
  const forumContextLine =
    Boolean(threadChannelId && isForumParent && forumParentSlug) && message.id === threadChannelId
      ? `[Forum parent: #${forumParentSlug}]`
      : null;
  const groupChannel = isGuildMessage && displayChannelSlug ? `#${displayChannelSlug}` : void 0;
  const senderName = sender.isPluralKit
    ? (sender.name ?? author.username)
    : (data.member?.nickname ?? author.globalName ?? author.username);
  const senderUsername = sender.isPluralKit
    ? (sender.tag ?? sender.name ?? author.username)
    : author.username;
  const { groupSystemPrompt, ownerAllowFrom, untrustedContext } = buildDiscordInboundAccessContext({
    channelConfig,
    guildInfo,
    sender: {
      id: sender.id,
      name: sender.name,
      tag: sender.tag,
    },
    allowNameMatching: isDangerousNameMatchingEnabled(discordConfig),
    isGuild: isGuildMessage,
    channelTopic: channelInfo?.topic,
  });
  const pinnedMainDmOwner = isDirectMessage
    ? resolvePinnedMainDmOwnerFromAllowlist({
        dmScope: cfg.session?.dmScope,
        allowFrom: channelConfig?.users ?? guildInfo?.users,
        normalizeEntry: normalizeDiscordDmOwnerEntry,
      })
    : null;
  const contextVisibilityMode = resolveChannelContextVisibilityMode({
    cfg,
    channel: "discord",
    accountId,
  });
  const isSupplementalContextSenderAllowed = createDiscordSupplementalContextAccessChecker({
    channelConfig,
    guildInfo,
    allowNameMatching: isDangerousNameMatchingEnabled(discordConfig),
    isGuild: isGuildMessage,
  });
  const storePath = resolveStorePath(cfg.session?.store, { agentId: route.agentId });
  const envelopeOptions = resolveEnvelopeFormatOptions(cfg);
  const previousTimestamp = readSessionUpdatedAt({
    storePath,
    sessionKey: route.sessionKey,
  });
  const channelHistory = createChannelHistoryWindow({ historyMap: guildHistories });
  let combinedBody = formatInboundEnvelope({
    channel: "Discord",
    from: fromLabel,
    timestamp: resolveTimestampMs(message.timestamp),
    body: text,
    chatType: isDirectMessage ? "direct" : "channel",
    senderLabel,
    previousTimestamp,
    envelope: envelopeOptions,
  });
  const shouldIncludeChannelHistory =
    !isDirectMessage &&
    (ctx.inboundEventKind === "room_event" ||
      !(isGuildMessage && channelConfig?.autoThread && !threadChannel));
  if (shouldIncludeChannelHistory) {
    removeDiscordReplayHistoryEntry(guildHistories, messageChannelId, message.id);
    combinedBody = channelHistory.buildPendingContext({
      historyKey: messageChannelId,
      limit: historyLimit,
      currentMessage: combinedBody,
      formatEntry: (entry) =>
        formatInboundEnvelope({
          channel: "Discord",
          from: fromLabel,
          timestamp: entry.timestamp,
          body: `${entry.body} [id:${entry.messageId ?? "unknown"} channel:${messageChannelId}]`,
          chatType: "channel",
          senderLabel: entry.sender,
          envelope: envelopeOptions,
        }),
    });
  }
  const replyContext = resolveReplyContext(message, resolveDiscordMessageText);
  const replySenderAllowed = replyContext
    ? isSupplementalContextSenderAllowed({
        id: replyContext.senderId,
        name: replyContext.senderName,
        tag: replyContext.senderTag,
        memberRoleIds: replyContext.memberRoleIds,
      })
    : true;
  const replyVisible = evaluateSupplementalContextVisibility({
    mode: contextVisibilityMode,
    kind: "quote",
    senderAllowed: replySenderAllowed,
  }).include;
  if (replyContext && !replyVisible && isGuildMessage)
    logVerbose(`discord: drop reply context (mode=${contextVisibilityMode})`);
  if (forumContextLine) combinedBody = `${combinedBody}\n${forumContextLine}`;
  let threadStarterBody;
  let threadLabel;
  let parentSessionKey;
  let modelParentSessionKey;
  if (threadChannel) {
    if (channelConfig?.includeThreadStarter !== false) {
      const starter = await resolveDiscordThreadStarter({
        channel: threadChannel,
        client,
        parentId: threadParentId,
        parentType: threadParentType,
        resolveTimestampMs,
      });
      if (starter?.text)
        if (
          evaluateSupplementalContextVisibility({
            mode: contextVisibilityMode,
            kind: "thread",
            senderAllowed: isSupplementalContextSenderAllowed({
              id: starter.authorId,
              name: starter.authorName ?? starter.author,
              tag: starter.authorTag,
              memberRoleIds: starter.memberRoleIds,
            }),
          }).include
        )
          threadStarterBody = starter.text;
        else logVerbose(`discord: drop thread starter context (mode=${contextVisibilityMode})`);
    }
    const parentName = threadParentName ?? "parent";
    threadLabel = threadName
      ? `Discord thread #${normalizeDiscordSlug(parentName)} › ${threadName}`
      : `Discord thread #${normalizeDiscordSlug(parentName)}`;
    if (threadParentId) {
      parentSessionKey = buildAgentSessionKey({
        agentId: route.agentId,
        channel: route.channel,
        peer: {
          kind: "channel",
          id: threadParentId,
        },
      });
      modelParentSessionKey = parentSessionKey;
    }
    if (!threadParentInheritanceEnabled) parentSessionKey = void 0;
  }
  const preflightAudioIndex =
    preflightAudioTranscript === void 0
      ? -1
      : mediaList.findIndex((media) => media.contentType?.startsWith("audio/"));
  const threadKeys = resolveThreadSessionKeys({
    baseSessionKey,
    threadId: threadChannel ? messageChannelId : void 0,
    parentSessionKey,
    useSuffix: false,
  });
  const replyPlan = await resolveDiscordAutoThreadReplyPlan({
    client,
    message,
    messageChannelId,
    isGuildMessage,
    channelConfig: ctx.inboundEventKind === "room_event" ? null : channelConfig,
    threadChannel,
    channelType: channelInfo?.type,
    channelName: channelInfo?.name,
    channelDescription: channelInfo?.topic,
    baseText: baseText ?? "",
    combinedBody,
    replyToMode,
    agentId: route.agentId,
    channel: route.channel,
    cfg,
    threadParentInheritanceEnabled,
  });
  const deliverTarget = replyPlan.deliverTarget;
  const replyTarget = replyPlan.replyTarget;
  const replyReference = replyPlan.replyReference;
  const autoThreadContext = replyPlan.autoThreadContext;
  const effectiveFrom = isDirectMessage
    ? `discord:${author.id}`
    : (autoThreadContext?.From ?? `discord:channel:${messageChannelId}`);
  const dmConversationTarget = isDirectMessage
    ? resolveDiscordConversationIdentity({
        isDirectMessage,
        userId: author.id,
      })
    : void 0;
  const effectiveTo = autoThreadContext?.To ?? dmConversationTarget ?? replyTarget;
  if (!effectiveTo) {
    runtime.error(danger("discord: missing reply target"));
    return null;
  }
  const lastRouteTo = dmConversationTarget ?? effectiveTo;
  const inboundHistory = shouldIncludeChannelHistory
    ? channelHistory.buildInboundHistory({
        historyKey: messageChannelId,
        limit: historyLimit,
      })
    : void 0;
  const originatingTo = autoThreadContext?.OriginatingTo ?? dmConversationTarget ?? replyTarget;
  const effectiveSessionKey =
    boundSessionKey ?? autoThreadContext?.SessionKey ?? threadKeys.sessionKey;
  const effectivePreviousTimestamp =
    effectiveSessionKey === route.sessionKey
      ? previousTimestamp
      : readSessionUpdatedAt({
          storePath,
          sessionKey: effectiveSessionKey,
        });
  const ctxPayload = await buildChannelInboundEventContext({
    channel: "discord",
    resolveSupplementalMedia: true,
    contextVisibility: contextVisibilityMode,
    accountId: route.accountId,
    messageId: canonicalMessageId ?? message.id,
    messageIdFull: canonicalMessageId && canonicalMessageId !== message.id ? message.id : void 0,
    timestamp: resolveTimestampMs(message.timestamp),
    from: effectiveFrom,
    sender: {
      id: sender.id,
      name: senderName,
      username: senderUsername,
      tag: sender.tag,
      roles: memberRoleIds,
      displayLabel: senderLabel,
      isBot: author.bot && !sender.isPluralKit ? true : void 0,
    },
    conversation: {
      kind: isDirectMessage ? "direct" : "channel",
      id: messageChannelId,
      nativeChannelId: messageChannelId,
      label: fromLabel,
      spaceId: isGuildMessage ? (guildInfo?.id ?? guildSlug) || void 0 : void 0,
      parentId: threadChannel ? threadParentId : void 0,
      threadId: threadChannel?.id ?? autoThreadContext?.createdThreadId ?? void 0,
    },
    route: {
      agentId: route.agentId,
      accountId: route.accountId,
      routeSessionKey: route.sessionKey,
      dispatchSessionKey: effectiveSessionKey,
      parentSessionKey: autoThreadContext?.ParentSessionKey ?? threadKeys.parentSessionKey,
      modelParentSessionKey:
        autoThreadContext?.ModelParentSessionKey ?? modelParentSessionKey ?? void 0,
    },
    reply: {
      to: effectiveTo,
      ...(originatingTo !== effectiveTo ? { originatingTo } : {}),
    },
    message: {
      inboundEventKind: ctx.inboundEventKind,
      body: combinedBody,
      rawBody: preflightAudioTranscript ?? baseText,
      bodyForAgent: preflightAudioTranscript ?? baseText ?? text,
      commandBody: preflightAudioTranscript ?? baseText,
      inboundHistory,
    },
    access: {
      mentions: {
        canDetectMention: ctx.canDetectMention,
        wasMentioned: ctx.effectiveWasMentioned,
        hasAnyMention: ctx.hasAnyMention,
        requireMention: ctx.shouldRequireMention,
        effectiveWasMentioned: ctx.effectiveWasMentioned,
      },
      commands: { authorized: commandAuthorized },
    },
    commandTurn: {
      kind: "text-slash",
      source: "text",
      authorized: commandAuthorized,
      body: preflightAudioTranscript ?? baseText,
    },
    media: toInboundMediaFacts(mediaList, {
      transcribed: (_media, index) => index === preflightAudioIndex,
    }),
    supplemental: {
      quote:
        replyContext && replyVisible
          ? {
              id: replyContext.id,
              body: replyContext.body,
              sender: replyContext.sender,
              senderAllowed: replySenderAllowed,
              isSelf: Boolean(botUserId && replyContext.senderId === botUserId),
              media: async () => {
                const referencedReplyMediaList = await resolveReferencedReplyMediaList(
                  message,
                  mediaMaxBytes,
                  {
                    fetchImpl: discordRestFetch,
                    ssrfPolicy: cfg.browser?.ssrfPolicy,
                    readIdleTimeoutMs: DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS,
                    totalTimeoutMs: DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS,
                    abortSignal,
                  },
                );
                return isContextAborted(abortSignal)
                  ? []
                  : toInboundMediaFacts(referencedReplyMediaList);
              },
            }
          : void 0,
      thread: {
        starterBody: !effectivePreviousTimestamp ? threadStarterBody : void 0,
        label: threadLabel,
        senderAllowed: true,
      },
      groupSystemPrompt: isGuildMessage ? groupSystemPrompt : void 0,
    },
    extra: {
      ...(preflightAudioTranscript !== void 0 ? { Transcript: preflightAudioTranscript } : {}),
      GroupSubject: isDirectMessage ? void 0 : groupChannel,
      GroupChannel: groupChannel,
      ...(isGuildMessage ? { GroupRequireMention: ctx.groupRequireMention } : {}),
      UntrustedStructuredContext: untrustedContext,
      OwnerAllowFrom: ownerAllowFrom,
    },
  });
  const persistedSessionKey = ctxPayload.SessionKey ?? route.sessionKey;
  if (ctx.inboundEventKind === "room_event" && shouldIncludeChannelHistory)
    await channelHistory.recordWithMedia({
      historyKey: messageChannelId,
      limit: historyLimit,
      entry: {
        sender: senderName,
        body: text,
        timestamp: resolveTimestampMs(message.timestamp),
        messageId: message.id,
      },
      media: toHistoryMediaEntries(mediaList, { messageId: message.id }),
      messageId: message.id,
    });
  if (shouldLogVerbose()) {
    const preview = truncateUtf16Safe(combinedBody, 200).replace(/\n/g, "\\n");
    logVerbose(
      `discord inbound: channel=${messageChannelId} deliver=${deliverTarget} from=${ctxPayload.From} preview="${preview}"`,
    );
  }
  return {
    ctxPayload,
    persistedSessionKey,
    turn: {
      storePath,
      record: {
        updateLastRoute: {
          sessionKey: persistedSessionKey,
          channel: "discord",
          to: lastRouteTo,
          accountId: route.accountId,
          mainDmOwnerPin:
            isDirectMessage && persistedSessionKey === route.mainSessionKey && pinnedMainDmOwner
              ? {
                  ownerRecipient: pinnedMainDmOwner,
                  senderRecipient: author.id,
                  onSkip: ({ ownerRecipient, senderRecipient }) => {
                    logVerbose(
                      `discord: skip main-session last route for ${senderRecipient} (pinned owner ${ownerRecipient})`,
                    );
                  },
                }
              : void 0,
        },
        onRecordError: (err) => {
          logVerbose(`discord: failed updating session meta: ${String(err)}`);
        },
      },
    },
    replyPlan,
    deliverTarget,
    replyTarget,
    replyReference,
  };
}
//#endregion
//#region extensions/discord/src/draft-chunking.ts
function resolveDiscordDraftStreamingChunking(cfg, accountId) {
  return resolveChannelDraftStreamingChunking(cfg, "discord", accountId, {
    fallbackLimit: DISCORD_TEXT_CHUNK_LIMIT,
  });
}
//#endregion
//#region extensions/discord/src/draft-stream.ts
/** Discord messages cap at 2000 characters. */
const DISCORD_STREAM_MAX_CHARS = 2e3;
const DEFAULT_THROTTLE_MS = 1200;
const DISCORD_PREVIEW_ALLOWED_MENTIONS = { parse: [] };
function createDiscordDraftStream(params) {
  const maxChars = Math.min(params.maxChars ?? DISCORD_STREAM_MAX_CHARS, DISCORD_STREAM_MAX_CHARS);
  const throttleMs = Math.max(250, params.throttleMs ?? DEFAULT_THROTTLE_MS);
  const minInitialChars = params.minInitialChars;
  const channelId = params.channelId;
  const rest = params.rest;
  const flags = resolveDiscordMessageFlags({ suppressEmbeds: params.suppressEmbeds });
  const resolveReplyToMessageId = () =>
    typeof params.replyToMessageId === "function"
      ? params.replyToMessageId()
      : params.replyToMessageId;
  const streamState = {
    stopped: false,
    final: false,
  };
  let streamMessageId;
  let lastSentText = "";
  let streamGeneration = 0;
  let activeCreateGeneration;
  let discardActiveCreate = false;
  const sendOrEditStreamMessage = async (text) => {
    const generation = streamGeneration;
    if (streamState.stopped && !streamState.final) return false;
    const trimmed = text.trimEnd();
    if (!trimmed) return false;
    if (trimmed.length > maxChars) {
      streamState.stopped = true;
      params.warn?.(`discord stream preview stopped (text length ${trimmed.length} > ${maxChars})`);
      return false;
    }
    if (trimmed === lastSentText) return true;
    if (streamMessageId === void 0 && minInitialChars != null && !streamState.final) {
      if (trimmed.length < minInitialChars) return false;
    }
    lastSentText = trimmed;
    try {
      if (streamMessageId !== void 0) {
        await editChannelMessage(rest, channelId, streamMessageId, {
          body: {
            content: trimmed,
            allowed_mentions: DISCORD_PREVIEW_ALLOWED_MENTIONS,
            ...(flags ? { flags } : {}),
          },
        });
        return true;
      }
      const replyToMessageId = resolveReplyToMessageId()?.trim();
      const messageReference = replyToMessageId
        ? {
            message_id: replyToMessageId,
            fail_if_not_exists: false,
          }
        : void 0;
      activeCreateGeneration = generation;
      const sentMessageId = (
        await createChannelMessage(rest, channelId, {
          body: {
            content: trimmed,
            allowed_mentions: DISCORD_PREVIEW_ALLOWED_MENTIONS,
            ...(flags ? { flags } : {}),
            ...(messageReference ? { message_reference: messageReference } : {}),
          },
        })
      )?.id;
      const shouldDiscardStaleCreate = activeCreateGeneration === generation && discardActiveCreate;
      activeCreateGeneration = void 0;
      discardActiveCreate = false;
      if (generation !== streamGeneration) {
        if (shouldDiscardStaleCreate && typeof sentMessageId === "string" && sentMessageId)
          try {
            await deleteChannelMessage(rest, channelId, sentMessageId);
          } catch (err) {
            params.warn?.(
              `discord stale stream preview cleanup failed: ${formatErrorMessage(err)}`,
            );
          }
        return true;
      }
      if (typeof sentMessageId !== "string" || !sentMessageId) {
        streamState.stopped = true;
        params.warn?.("discord stream preview stopped (missing message id from send)");
        return false;
      }
      streamMessageId = sentMessageId;
      return true;
    } catch (err) {
      if (activeCreateGeneration === generation) {
        activeCreateGeneration = void 0;
        discardActiveCreate = false;
      }
      if (generation !== streamGeneration) return true;
      streamState.stopped = true;
      params.warn?.(`discord stream preview failed: ${formatErrorMessage(err)}`);
      return false;
    }
  };
  const readMessageId = () => streamMessageId;
  const clearMessageId = () => {
    streamMessageId = void 0;
  };
  const isValidStreamMessageId = (value) => typeof value === "string";
  const deleteStreamMessage = async (messageId) => {
    await deleteChannelMessage(rest, channelId, messageId);
  };
  const { loop, update, stop, clear, discardPending, seal } = createFinalizableDraftLifecycle({
    throttleMs,
    state: streamState,
    sendOrEditStreamMessage,
    readMessageId,
    clearMessageId,
    isValidMessageId: isValidStreamMessageId,
    deleteMessage: deleteStreamMessage,
    warn: params.warn,
    warnPrefix: "discord stream preview cleanup failed",
  });
  const forceNewMessage = (mode = "preserve") => {
    if (mode === "discard" && activeCreateGeneration !== void 0) discardActiveCreate = true;
    streamGeneration += 1;
    streamState.stopped = false;
    streamState.final = false;
    streamMessageId = void 0;
    lastSentText = "";
    loop.resetPending();
    loop.resetThrottleWindow();
  };
  const deleteCurrentMessage = async () => {
    loop.resetPending();
    await loop.waitForInFlight();
    const messageId = streamMessageId;
    streamMessageId = void 0;
    lastSentText = "";
    loop.resetThrottleWindow();
    if (!isValidStreamMessageId(messageId)) return;
    try {
      await deleteStreamMessage(messageId);
    } catch (err) {
      params.warn?.(`discord stream preview cleanup failed: ${formatErrorMessage(err)}`);
    }
  };
  params.log?.(`discord stream preview ready (maxChars=${maxChars}, throttleMs=${throttleMs})`);
  return {
    update,
    flush: loop.flush,
    messageId: () => streamMessageId,
    clear,
    deleteCurrentMessage,
    discardPending,
    seal,
    stop,
    forceNewMessage,
  };
}
//#endregion
//#region extensions/discord/src/preview-streaming.ts
function resolveDiscordPreviewStreamMode(params = {}) {
  if (params.streaming === void 0) return "progress";
  return resolveChannelPreviewStreamMode(params, "off");
}
//#endregion
//#region extensions/discord/src/monitor/message-handler.draft-preview.ts
function createDiscordDraftPreviewController(params) {
  const discordStreamMode = resolveDiscordPreviewStreamMode(params.discordConfig);
  const draftMaxChars = Math.min(params.textLimit, 2e3);
  const accountBlockStreamingEnabled =
    resolveChannelStreamingBlockEnabled(params.discordConfig) ??
    params.cfg.agents?.defaults?.blockStreamingDefault === "on";
  const canStreamProgressDraftForToolOnlySource =
    params.sourceRepliesAreToolOnly && discordStreamMode === "progress";
  const draftStream =
    (!params.sourceRepliesAreToolOnly || canStreamProgressDraftForToolOnlySource) &&
    discordStreamMode !== "off" &&
    !accountBlockStreamingEnabled
      ? createDiscordDraftStream({
          rest: params.deliveryRest,
          channelId: params.deliverChannelId,
          maxChars: draftMaxChars,
          replyToMessageId: () => params.replyReference.peek(),
          minInitialChars: discordStreamMode === "progress" ? 0 : 30,
          suppressEmbeds: params.discordConfig?.suppressEmbeds ?? true,
          throttleMs: 1200,
          log: params.log,
          warn: params.log,
        })
      : void 0;
  const draftChunking =
    draftStream && discordStreamMode === "block"
      ? resolveDiscordDraftStreamingChunking(params.cfg, params.accountId)
      : void 0;
  const shouldSplitPreviewMessages = discordStreamMode === "block";
  const draftChunker = draftChunking ? new EmbeddedBlockChunker(draftChunking) : void 0;
  let lastPartialText = "";
  let draftText = "";
  let hasStreamedMessage = false;
  let finalizedViaPreviewMessage = false;
  let finalReplyDelivered = false;
  let progressDraftStartedBeforeFinal = false;
  let progressDraftCollapsed = false;
  let progressNarratorLifecycle;
  const progressConfig = resolveChannelProgressDraftConfig(params.discordConfig);
  const progressHasExplicitLabel =
    progressConfig.label !== void 0 || progressConfig.labels !== void 0;
  const progressToolDefault = progressConfig.toolProgress ?? progressHasExplicitLabel;
  const previewToolProgressEnabled =
    Boolean(draftStream) &&
    resolveChannelStreamingPreviewToolProgress(
      params.discordConfig,
      discordStreamMode === "progress" ? progressToolDefault : true,
    );
  const narrationProgressEnabled =
    Boolean(draftStream) &&
    discordStreamMode === "progress" &&
    resolveChannelStreamingProgressNarration(params.discordConfig);
  const narrationHideCommandText =
    narrationProgressEnabled &&
    resolveChannelStreamingPreviewCommandText(params.discordConfig) === "status";
  const suppressDefaultToolProgressMessages =
    Boolean(draftStream) &&
    resolveChannelStreamingSuppressDefaultToolProgressMessages(params.discordConfig, {
      draftStreamActive: true,
      previewToolProgressEnabled,
    });
  const progressSeed = `${params.accountId}:${params.deliverChannelId}`;
  const progressDraft = createChannelProgressDraftCompositor({
    entry: params.discordConfig,
    mode: discordStreamMode,
    active: Boolean(draftStream),
    seed: progressSeed,
    reasoningLinePrefix: "🧠 ",
    commentaryLinePrefix: "💬 ",
    reasoningGate: previewToolProgressEnabled,
    commentaryItalics: false,
    update: async (previewText, options) => {
      lastPartialText = previewText;
      draftText = previewText;
      hasStreamedMessage = true;
      draftChunker?.reset();
      draftStream?.update(previewText);
      if (options?.flush) await draftStream?.flush();
    },
    deleteCurrent: async () => {
      lastPartialText = "";
      draftText = "";
      hasStreamedMessage = false;
      if (draftStream?.messageId()) await draftStream.deleteCurrentMessage();
    },
    isEmptyLine: isEmptyDiscordProgressLine,
    shouldStartNow: shouldStartDiscordProgressDraftNow,
  });
  const resetProgressState = () => {
    lastPartialText = "";
    draftText = "";
    draftChunker?.reset();
    progressDraft.reset();
  };
  const forceNewMessageIfNeeded = () => {
    if (shouldSplitPreviewMessages && hasStreamedMessage) {
      params.log("discord: calling forceNewMessage() for draft stream");
      draftStream?.forceNewMessage();
    }
    resetProgressState();
  };
  const pushPreambleHeadline = async (text, options) => {
    if (discordStreamMode === "progress") await progressDraft.pushPreambleHeadline(text, options);
  };
  return {
    draftStream,
    previewToolProgressEnabled,
    narrationProgressEnabled,
    narrationHideCommandText,
    commentaryProgressEnabled: progressDraft.commentaryProgressEnabled,
    suppressDefaultToolProgressMessages,
    get isProgressMode() {
      return discordStreamMode === "progress";
    },
    get hasProgressDraftStarted() {
      return progressDraft.hasStarted;
    },
    get isProgressDraftVisible() {
      return progressDraft.isVisible;
    },
    get hasProgressDraftToCollapse() {
      return (
        !progressDraftCollapsed && (progressDraft.hasStarted || progressDraftStartedBeforeFinal)
      );
    },
    markProgressDraftCollapsed() {
      progressDraftCollapsed = true;
      progressDraftStartedBeforeFinal = false;
    },
    get finalizedViaPreviewMessage() {
      return finalizedViaPreviewMessage;
    },
    setProgressNarratorLifecycle(lifecycle) {
      progressNarratorLifecycle = lifecycle;
    },
    markFinalReplyStarted() {
      progressDraftStartedBeforeFinal ||= progressDraft.hasStarted;
      progressDraft.markFinalReplyStarted();
      progressNarratorLifecycle?.stopTurn();
    },
    markFinalReplyDelivered() {
      finalReplyDelivered = true;
      progressDraft.markFinalReplyDelivered();
    },
    markPreviewFinalized() {
      finalizedViaPreviewMessage = true;
    },
    disableBlockStreamingForDraft: draftStream ? true : void 0,
    async pushToolProgress(line, options) {
      await progressDraft.pushToolProgress(line, options);
    },
    async pushReasoningProgress(text, options) {
      await progressDraft.pushReasoningProgress(text, options);
    },
    async pushNarrationProgress(text) {
      await progressDraft.pushNarrationProgress(text);
    },
    pushPreambleHeadline,
    async pushPreambleItemEvent(payload, noteCommentary) {
      await pushPreambleHeadline(payload.progressText, { itemId: payload.itemId });
      if (!progressDraft.commentaryProgressEnabled) return;
      if (
        await progressDraft.pushCommentaryProgress(payload.progressText, { itemId: payload.itemId })
      )
        noteCommentary(payload.itemId, payload.progressText);
    },
    async pushCommentaryProgress(text, options) {
      await progressDraft.pushCommentaryProgress(text, options);
    },
    resolvePreviewFinalText(text) {
      if (typeof text !== "string") return;
      const formatted = convertMarkdownTables(
        stripInlineDirectiveTagsForDelivery(text).text,
        params.tableMode,
      );
      const chunks = chunkDiscordTextWithMode(formatted, {
        maxChars: draftMaxChars,
        maxLines: params.maxLinesPerMessage,
        chunkMode: params.chunkMode,
      });
      if (!chunks.length && formatted) chunks.push(formatted);
      if (chunks.length !== 1) return;
      const trimmed = expectDefined(chunks.at(0), "single Discord preview chunk").trim();
      if (!trimmed) return;
      const currentPreviewText = discordStreamMode === "block" ? draftText : lastPartialText;
      if (
        currentPreviewText &&
        currentPreviewText.startsWith(trimmed) &&
        trimmed.length < currentPreviewText.length
      )
        return;
      return trimmed;
    },
    updateFromPartial(text) {
      if (!draftStream || !text) return;
      const cleaned = stripInlineDirectiveTagsForDelivery(
        stripReasoningTagsFromText(text, {
          mode: "strict",
          trim: "both",
        }),
      ).text;
      if (!cleaned || cleaned.startsWith("Reasoning:\n")) return;
      if (cleaned === lastPartialText) return;
      if (discordStreamMode === "progress") return;
      progressDraft.suppress();
      hasStreamedMessage = true;
      if (discordStreamMode === "partial") {
        if (
          lastPartialText &&
          lastPartialText.startsWith(cleaned) &&
          cleaned.length < lastPartialText.length
        )
          return;
        lastPartialText = cleaned;
        draftStream.update(cleaned);
        return;
      }
      let delta = cleaned;
      if (cleaned.startsWith(lastPartialText)) delta = cleaned.slice(lastPartialText.length);
      else {
        draftChunker?.reset();
        draftText = "";
      }
      lastPartialText = cleaned;
      if (!delta) return;
      if (!draftChunker) {
        draftText = cleaned;
        draftStream.update(draftText);
        return;
      }
      draftChunker.append(delta);
      draftChunker.drain({
        force: false,
        emit: (chunk) => {
          draftText += chunk;
          draftStream.update(draftText);
        },
      });
    },
    handleAssistantMessageBoundary() {
      const beganNewTurn = progressDraft.beginNewTurn();
      if (beganNewTurn) {
        progressDraftCollapsed = false;
        progressDraftStartedBeforeFinal = false;
        finalReplyDelivered = false;
        finalizedViaPreviewMessage = false;
        progressNarratorLifecycle?.beginTurn();
      }
      if (discordStreamMode === "progress") {
        if (beganNewTurn) draftStream?.forceNewMessage("discard");
        return beganNewTurn;
      }
      forceNewMessageIfNeeded();
      return beganNewTurn;
    },
    async flush() {
      if (!draftStream) return;
      if (draftChunker?.hasBuffered()) {
        draftChunker.drain({
          force: true,
          emit: (chunk) => {
            draftText += chunk;
          },
        });
        draftChunker.reset();
        if (draftText) draftStream.update(draftText);
      }
      await draftStream.flush();
    },
    async cleanup() {
      try {
        progressDraft.cancel();
        if (!finalReplyDelivered) await draftStream?.discardPending();
        if (!finalizedViaPreviewMessage && draftStream?.messageId()) await draftStream.clear();
      } catch (err) {
        params.log(`discord: draft cleanup failed: ${String(err)}`);
      }
    },
  };
}
function isEmptyDiscordProgressLine(line) {
  if (!line || typeof line === "string") return false;
  return line.toolName === "apply_patch" && !line.detail && !line.status;
}
function shouldStartDiscordProgressDraftNow(line) {
  return typeof line === "object" && line?.kind === "patch" && Boolean(line.detail);
}
//#endregion
//#region extensions/discord/src/monitor/message-handler.process.ts
const loadReplyRuntime = createLazyRuntimeModule(() => import("./plugin-sdk/reply-runtime.js"));
const TARGETED_ONLY_ALLOWED_MENTIONS = { parse: ["users", "roles"] };
function isProcessAborted(abortSignal) {
  return Boolean(abortSignal?.aborted);
}
function isFallbackOnlyToolWarningFinal(payload) {
  if (payload.isError !== true || !isReplyPayloadNonTerminalToolErrorWarning(payload)) return false;
  return !resolveSendableOutboundReplyParts(payload).hasMedia;
}
function isFailedProgress(payload) {
  return (
    payload.phase === "error" ||
    payload.status === "failed" ||
    payload.status === "error" ||
    (typeof payload.exitCode === "number" && payload.exitCode !== 0)
  );
}
function formatDiscordReplySkip(params) {
  const context = [
    `target=${params.target}`,
    params.sessionKey ? `session=${params.sessionKey}` : void 0,
  ]
    .filter(Boolean)
    .join(" ");
  return `discord ${params.kind} reply skipped (${params.reason}): ${context}`;
}
function readToolStringArg(args, key) {
  const value = args[key];
  return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function readToolBooleanArg(args, key) {
  return args[key] === true;
}
async function processDiscordMessage(ctx, observer) {
  try {
    await processDiscordMessageInner(ctx, observer);
  } finally {
    ctx.replyTypingFeedback?.onCleanup?.();
  }
}
async function processDiscordMessageInner(ctx, observer) {
  const dispatchStartedAt = Date.now();
  const {
    cfg,
    discordConfig,
    accountId,
    token,
    runtime,
    guildHistories,
    historyLimit,
    textLimit,
    replyToMode,
    ackReactionScope,
    message,
    messageChannelId,
    isGuildMessage,
    isDirectMessage,
    isGroupDm,
    messageText,
    shouldRequireMention,
    canDetectMention,
    effectiveWasMentioned,
    shouldBypassMention,
    channelConfig,
    threadBindings,
    route,
    abortSignal,
    replyTypingFeedback,
    preparedMedia: mediaList,
  } = ctx;
  if (isProcessAborted(abortSignal)) return;
  const text = messageText;
  if (!text) {
    logVerbose("discord: drop message " + message.id + " (empty content)");
    return;
  }
  const boundThreadId = ctx.threadBinding?.conversation?.conversationId?.trim();
  if (boundThreadId && typeof threadBindings.touchThread === "function")
    threadBindings.touchThread({ threadId: boundThreadId });
  const { dispatchReplyWithBufferedBlockDispatcher: dispatchReply } = await loadReplyRuntime();
  const sourceReplyDeliveryMode = resolveChannelSourceReplyDeliveryMode({
    cfg,
    ctx: {
      ChatType: isDirectMessage
        ? "direct"
        : isGroupDm
          ? "group"
          : isGuildMessage
            ? "channel"
            : void 0,
      InboundEventKind: ctx.inboundEventKind,
    },
  });
  const sourceRepliesAreToolOnly = sourceReplyDeliveryMode === "message_tool_only";
  const configuredTypingMode = cfg.session?.typingMode ?? cfg.agents?.defaults?.typingMode;
  const configuredTypingInterval =
    cfg.agents?.defaults?.typingIntervalSeconds ?? cfg.session?.typingIntervalSeconds;
  const shouldDisableCoreTypingKeepalive =
    Boolean(replyTypingFeedback) ||
    (sourceRepliesAreToolOnly &&
      configuredTypingMode === void 0 &&
      configuredTypingInterval === void 0);
  const ackReaction = resolveAckReaction(cfg, route.agentId, {
    channel: "discord",
    accountId,
  });
  const removeAckAfterReply = cfg.messages?.removeAckAfterReply ?? false;
  const mediaLocalRoots = getAgentScopedMediaLocalRoots(cfg, route.agentId);
  const isRoomEvent = ctx.inboundEventKind === "room_event";
  const shouldAckReaction$1 = () =>
    Boolean(
      ackReaction &&
      shouldAckReaction({
        scope: ackReactionScope,
        inboundEventKind: ctx.inboundEventKind,
        isDirect: isDirectMessage,
        isGroup: isGuildMessage || isGroupDm,
        isMentionableGroup: isGuildMessage,
        requireMention: shouldRequireMention,
        canDetectMention,
        effectiveWasMentioned,
        shouldBypassMention,
      }),
    );
  const shouldSendAckReaction = shouldAckReaction$1();
  const statusReactionsExplicitlyEnabled = cfg.messages?.statusReactions?.enabled === true;
  const statusReactionsEnabled =
    !isRoomEvent &&
    shouldSendAckReaction &&
    cfg.messages?.statusReactions?.enabled !== false &&
    (!sourceRepliesAreToolOnly || statusReactionsExplicitlyEnabled);
  const feedbackRest = createDiscordRestClient({
    cfg,
    token,
    accountId,
  }).rest;
  const deliveryRest = createDiscordRestClient({
    cfg,
    token,
    accountId,
  }).rest;
  const ackReactionContext = createDiscordAckReactionContext({
    rest: feedbackRest,
    cfg,
    accountId,
  });
  const discordAdapter = createDiscordAckReactionAdapter({
    channelId: messageChannelId,
    messageId: message.id,
    reactionContext: ackReactionContext,
  });
  const statusReactionTiming = {
    ...DEFAULT_TIMING,
    ...cfg.messages?.statusReactions?.timing,
  };
  let statusReactionTarget = `${messageChannelId}/${message.id}`;
  let statusReactionsActive = statusReactionsEnabled;
  let statusReactions = createStatusReactionController({
    enabled: statusReactionsEnabled,
    adapter: discordAdapter,
    initialEmoji: ackReaction,
    emojis: cfg.messages?.statusReactions?.emojis,
    timing: statusReactionTiming,
    onError: (err) => {
      logAckFailure({
        log: logVerbose,
        channel: "discord",
        target: statusReactionTarget,
        error: err,
      });
    },
  });
  const resolveTrackedReactionChannelId = async (args) => {
    const target =
      readToolStringArg(args, "channelId") ??
      readToolStringArg(args, "channel_id") ??
      readToolStringArg(args, "to");
    if (!target) return messageChannelId;
    try {
      return resolveDiscordChannelId(target);
    } catch {
      return (
        await resolveDiscordTargetChannelId(target, {
          cfg,
          token,
          accountId,
        })
      ).channelId;
    }
  };
  const maybeBindStatusReactionsToToolReaction = async (payload) => {
    if (
      sourceRepliesAreToolOnly ||
      cfg.messages?.statusReactions?.enabled === false ||
      payload.phase !== "start" ||
      payload.name !== "message" ||
      !payload.args
    )
      return;
    const args = payload.args;
    if (readToolStringArg(args, "action")?.toLowerCase() !== "react") return;
    if (
      !(readToolBooleanArg(args, "trackToolCalls") || readToolBooleanArg(args, "track_tool_calls"))
    )
      return;
    const emoji = readToolStringArg(args, "emoji");
    const remove = readToolBooleanArg(args, "remove");
    if (!emoji || remove) return;
    const trackedMessageId =
      readToolStringArg(args, "messageId") ?? readToolStringArg(args, "message_id") ?? message.id;
    let trackedChannelId;
    try {
      trackedChannelId = await resolveTrackedReactionChannelId(args);
    } catch (err) {
      logAckFailure({
        log: logVerbose,
        channel: "discord",
        target: `${readToolStringArg(args, "to") ?? readToolStringArg(args, "channelId") ?? messageChannelId}/${trackedMessageId}`,
        error: err,
      });
      return;
    }
    statusReactionTarget = `${trackedChannelId}/${trackedMessageId}`;
    if (statusReactionsActive) statusReactions.clear();
    statusReactions = createStatusReactionController({
      enabled: true,
      adapter: createDiscordAckReactionAdapter({
        channelId: trackedChannelId,
        messageId: trackedMessageId,
        reactionContext: ackReactionContext,
      }),
      initialEmoji: emoji,
      emojis: cfg.messages?.statusReactions?.emojis,
      timing: statusReactionTiming,
      onError: (err) => {
        logAckFailure({
          log: logVerbose,
          channel: "discord",
          target: statusReactionTarget,
          error: err,
        });
      },
    });
    statusReactionsActive = true;
    statusReactions.setQueued();
  };
  let initialAckReactionQueued = false;
  const queueInitialAckReactionAfterRecord = () => {
    if (initialAckReactionQueued) return;
    initialAckReactionQueued = true;
    if (statusReactionsEnabled) statusReactionsActive = true;
    queueInitialDiscordAckReaction({
      enabled: statusReactionsEnabled,
      shouldSendAckReaction,
      ackReaction,
      statusReactions,
      reactionAdapter: discordAdapter,
      target: `${messageChannelId}/${message.id}`,
    });
  };
  const processContext = await buildDiscordMessageProcessContext({
    ctx,
    text,
    mediaList,
  });
  if (!processContext) return;
  const {
    ctxPayload,
    persistedSessionKey,
    turn,
    replyPlan,
    deliverTarget,
    replyTarget,
    replyReference,
  } = processContext;
  observer?.onReplyPlanResolved?.({
    createdThreadId: replyPlan.createdThreadId,
    sessionKey: persistedSessionKey,
  });
  const typingChannelId = deliverTarget.startsWith("channel:")
    ? deliverTarget.slice(8)
    : messageChannelId;
  const typingFeedback =
    replyTypingFeedback ??
    createDiscordReplyTypingFeedback({
      cfg,
      token,
      accountId,
      channelId: typingChannelId,
      rest: feedbackRest,
      log: logVerbose,
      keepaliveIntervalMs: shouldDisableCoreTypingKeepalive ? void 0 : 0,
    });
  if (replyTypingFeedback) replyTypingFeedback.restartForDispatch(typingChannelId);
  else typingFeedback.updateChannelId(typingChannelId);
  const { onModelSelected, ...replyPipeline } = createChannelReplyPipeline({
    cfg,
    agentId: route.agentId,
    channel: "discord",
    accountId: route.accountId,
    typingCallbacks: typingFeedback,
  });
  const tableMode = resolveMarkdownTableMode({
    cfg,
    channel: "discord",
    accountId,
  });
  const maxLinesPerMessage = resolveDiscordMaxLinesPerMessage({
    cfg,
    discordConfig,
    accountId,
  });
  const chunkMode = resolveChunkMode(cfg, "discord", accountId);
  const clearGroupHistory = () => {
    if (isDirectMessage) return;
    createChannelHistoryWindow({ historyMap: guildHistories }).clear({
      historyKey: messageChannelId,
      limit: historyLimit,
    });
  };
  const beginDeliveryCorrelation = () =>
    isRoomEvent
      ? beginDiscordInboundEventDeliveryCorrelation(
          ctxPayload.SessionKey,
          {
            outboundTo: messageChannelId,
            outboundAccountId: route.accountId,
            markInboundEventDelivered: clearGroupHistory,
          },
          { inboundEventKind: ctxPayload.InboundEventKind },
        )
      : () => {};
  const endDiscordInboundEventDeliveryCorrelation = beginDeliveryCorrelation();
  const resolveCurrentTurnTranscriptFinalText = async () => {
    const sessionKey = ctxPayload.SessionKey;
    if (!sessionKey) return;
    try {
      const storePath = resolveStorePath(cfg.session?.store, { agentId: route.agentId });
      const sessionEntry = getSessionEntry({
        agentId: route.agentId,
        sessionKey,
        storePath,
      });
      if (!sessionEntry?.sessionId) return;
      const latest = await readLatestAssistantTextByIdentity({
        agentId: route.agentId,
        sessionId: sessionEntry.sessionId,
        sessionKey,
        storePath,
      });
      if (!latest?.timestamp || latest.timestamp < dispatchStartedAt) return;
      return latest.text;
    } catch (err) {
      logVerbose(`discord transcript final candidate lookup failed: ${String(err)}`);
      return;
    }
  };
  const deliverChannelId = deliverTarget.startsWith("channel:")
    ? deliverTarget.slice(8)
    : messageChannelId;
  const draftPreview = createDiscordDraftPreviewController({
    cfg,
    discordConfig,
    accountId,
    sourceRepliesAreToolOnly,
    textLimit,
    deliveryRest,
    deliverChannelId,
    replyReference,
    tableMode,
    maxLinesPerMessage,
    chunkMode,
    log: logVerbose,
  });
  let shouldYieldDraftProgress = () => false;
  let finalReplyStartNotified = false;
  const notifyFinalReplyStart = () => {
    if (finalReplyStartNotified) return;
    finalReplyStartNotified = true;
    draftPreview.markFinalReplyStarted();
    observer?.onFinalReplyStart?.();
  };
  let userFacingFinalDelivered = false;
  let userFacingFinalDeliveryFailed = false;
  let pendingToolWarningFinal;
  const markUserFacingFinalDelivered = () => {
    userFacingFinalDelivered = true;
    userFacingFinalDeliveryFailed = false;
    pendingToolWarningFinal = void 0;
    draftPreview.markFinalReplyDelivered();
    observer?.onFinalReplyDelivered?.();
  };
  const formatDiscordReasoningQuote = (quoteText) => {
    const lines = quoteText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (!lines.length) return;
    lines[0] = `🧠 ${lines[0]}`;
    return lines.map((line) => `> ${line}`).join("\n");
  };
  const reasoningLevel = (() => {
    const normalizedAgentId = (route.agentId ?? "").trim().toLowerCase() || "main";
    const cfgDefault =
      cfg.agents?.list?.find(
        (entry) => ((entry?.id ?? "").trim().toLowerCase() || "main") === normalizedAgentId,
      )?.reasoningDefault ?? cfg.agents?.defaults?.reasoningDefault;
    const configDefault = cfgDefault === "on" || cfgDefault === "stream" ? cfgDefault : "off";
    const sessionKey = ctxPayload.SessionKey;
    if (!sessionKey) return configDefault;
    try {
      const storePath = resolveStorePath(cfg.session?.store, { agentId: route.agentId });
      const level = getSessionEntry({
        agentId: route.agentId,
        sessionKey,
        storePath,
      })?.reasoningLevel;
      if (level === "on" || level === "stream" || level === "off") return level;
    } catch {
      return "off";
    }
    return configDefault;
  })();
  const reasoningDurableEnabled = reasoningLevel === "on";
  const reasoningWindowEnabled = reasoningLevel === "stream";
  let progressTurnStartedAt = Date.now();
  let progressReasoningSteps = 0;
  let progressToolCalls = 0;
  let progressCommentaryNotes = 0;
  let progressReceiptLine;
  let clearProgressDraftAfterFinalDelivery = false;
  const seenCommentaryIds = /* @__PURE__ */ new Set();
  let lastCommentaryNoteText = "";
  const noteWindowCommentary = (itemId, noteText) => {
    const trimmed = noteText?.trim();
    if (!trimmed) return;
    if (itemId) {
      if (seenCommentaryIds.has(itemId)) return;
      seenCommentaryIds.add(itemId);
      progressCommentaryNotes += 1;
      return;
    }
    if (trimmed !== lastCommentaryNoteText) {
      lastCommentaryNoteText = trimmed;
      progressCommentaryNotes += 1;
    }
  };
  let windowReasoningOpen = false;
  const closePendingWindowThought = () => {
    if (windowReasoningOpen) {
      windowReasoningOpen = false;
      progressReasoningSteps += 1;
    }
  };
  const resetProgressTurnState = () => {
    finalReplyStartNotified = false;
    userFacingFinalDelivered = false;
    userFacingFinalDeliveryFailed = false;
    pendingToolWarningFinal = void 0;
    progressTurnStartedAt = Date.now();
    progressReasoningSteps = 0;
    progressToolCalls = 0;
    progressCommentaryNotes = 0;
    progressReceiptLine = void 0;
    clearProgressDraftAfterFinalDelivery = false;
    seenCommentaryIds.clear();
    lastCommentaryNoteText = "";
    windowReasoningOpen = false;
  };
  const handleAssistantMessageBoundary = () => {
    if (draftPreview.handleAssistantMessageBoundary()) resetProgressTurnState();
  };
  const buildProgressSummaryLine = () => {
    closePendingWindowThought();
    const seconds = Math.max(1, Math.round((Date.now() - progressTurnStartedAt) / 1e3));
    return `-# ${[
      ...(progressReasoningSteps > 0
        ? [`🧠 ${progressReasoningSteps} thought${progressReasoningSteps === 1 ? "" : "s"}`]
        : []),
      ...(progressCommentaryNotes > 0
        ? [`💬 ${progressCommentaryNotes} note${progressCommentaryNotes === 1 ? "" : "s"}`]
        : []),
      ...(progressToolCalls > 0
        ? [`🛠️ ${progressToolCalls} tool call${progressToolCalls === 1 ? "" : "s"}`]
        : []),
      `⏱️ ${seconds}s`,
    ].join(" · ")}`;
  };
  const beforeDiscordPayloadDelivery = (payload, info) => {
    if (isProcessAborted(abortSignal)) {
      logVerbose(
        formatDiscordReplySkip({
          kind: info.kind,
          reason: "aborted before delivery",
          target: deliverTarget,
          sessionKey: ctxPayload.SessionKey,
        }),
      );
      return null;
    }
    if (payload.isReasoning || payload.isCommentary) return payload;
    if (draftPreview.draftStream && draftPreview.isProgressMode && info.kind === "block") {
      if (!resolveSendableOutboundReplyParts(payload).hasMedia && !payload.isError) return null;
    }
    if (info.kind === "final" && !isFallbackOnlyToolWarningFinal(payload))
      draftPreview.markFinalReplyStarted();
    return payload;
  };
  const deliverDiscordPayload = async (payload, info, options) => {
    if (isProcessAborted(abortSignal)) {
      logVerbose(
        formatDiscordReplySkip({
          kind: info.kind,
          reason: "aborted before delivery",
          target: deliverTarget,
          sessionKey: ctxPayload.SessionKey,
        }),
      );
      return { visibleReplySent: false };
    }
    const isFinal = info.kind === "final";
    if (payload.isReasoning) {
      const raw = (payload.text ?? "").trim();
      const body = raw.startsWith("Reasoning:\n") ? raw.slice(11).trim() : raw;
      if (!body) return { visibleReplySent: false };
      const chunks = chunkDiscordTextWithMode(body, {
        maxChars: Math.max(256, Math.min(textLimit, 2e3) - 8),
        maxLines: maxLinesPerMessage,
        chunkMode,
      });
      const replies = (chunks.length ? chunks : [body])
        .map((chunk) => formatDiscordReasoningQuote(chunk))
        .filter((quote) => Boolean(quote))
        .map((quote) =>
          Object.assign({}, payload, {
            text: quote,
            isReasoning: void 0,
          }),
        );
      if (!replies.length) return { visibleReplySent: false };
      await deliverDiscordReply({
        cfg,
        replies,
        target: deliverTarget,
        token,
        accountId,
        rest: deliveryRest,
        runtime,
        replyToId: replyReference.use(),
        replyToMode,
        textLimit,
        maxLinesPerMessage,
        tableMode,
        chunkMode,
        sessionKey: ctxPayload.SessionKey,
        threadBindings,
        mediaLocalRoots,
        kind: "block",
      });
      replyReference.markSent();
      return { visibleReplySent: true };
    }
    if (
      isFinal &&
      !options?.allowFallbackOnlyToolWarning &&
      isFallbackOnlyToolWarningFinal(payload)
    ) {
      if (!userFacingFinalDelivered && (!finalReplyStartNotified || userFacingFinalDeliveryFailed))
        pendingToolWarningFinal = {
          payload,
          info,
        };
      return { visibleReplySent: false };
    }
    if (isFinal) draftPreview.markFinalReplyStarted();
    const finalText =
      isFinal && typeof payload.text === "string"
        ? await resolveTranscriptBackedChannelFinalText({
            finalText: payload.text,
            resolveCandidateText: resolveCurrentTurnTranscriptFinalText,
          })
        : payload.text;
    const [deliverablePayload] = sanitizeDiscordFrontChannelReplyPayloads(
      [
        finalText !== payload.text
          ? {
              ...payload,
              text: finalText,
            }
          : payload,
      ],
      { kind: info.kind },
    );
    if (!deliverablePayload) {
      logVerbose(
        formatDiscordReplySkip({
          kind: info.kind,
          reason: "internal-only payload",
          target: deliverTarget,
          sessionKey: ctxPayload.SessionKey,
        }),
      );
      return { visibleReplySent: false };
    }
    const draftStream = draftPreview.draftStream;
    if (draftStream && draftPreview.isProgressMode && info.kind === "block") {
      if (
        !resolveSendableOutboundReplyParts(deliverablePayload).hasMedia &&
        !deliverablePayload.isError
      )
        return { visibleReplySent: false };
    }
    if (
      draftStream &&
      isFinal &&
      draftPreview.isProgressMode &&
      !deliverablePayload.isError &&
      draftPreview.hasProgressDraftToCollapse &&
      draftStream
    ) {
      await draftPreview.flush();
      progressReceiptLine = buildProgressSummaryLine();
      clearProgressDraftAfterFinalDelivery = true;
    }
    if (draftStream && isFinal && !draftPreview.isProgressMode && !deliverablePayload.isError) {
      const ttsSupplement = getReplyPayloadTtsSupplement(deliverablePayload);
      if (
        (
          await deliverWithFinalizableLivePreviewAdapter({
            kind: info.kind,
            payload: deliverablePayload,
            adapter: defineFinalizableLivePreviewAdapter({
              draft: {
                flush: () => draftPreview.flush(),
                clear: () => draftStream.clear(),
                discardPending: () => draftStream.discardPending(),
                seal: () => draftStream.seal(),
                id: draftStream.messageId,
              },
              buildFinalEdit: () => {},
              editFinal: async (previewMessageId, edit) => {
                if (isProcessAborted(abortSignal)) throw new Error("process aborted");
                notifyFinalReplyStart();
                await editMessageDiscord(deliverChannelId, previewMessageId, edit, {
                  cfg,
                  accountId,
                  rest: deliveryRest,
                });
              },
              onPreviewFinalized: () => {
                markUserFacingFinalDelivered();
                draftPreview.markPreviewFinalized();
                replyReference.markSent();
              },
              logPreviewEditFailure: (err) => {
                logVerbose(
                  `discord: preview final edit failed; falling back to standard send (${String(err)})`,
                );
              },
            }),
            deliverNormally: async () => {
              if (isProcessAborted(abortSignal)) return false;
              const fallbackPayload =
                ttsSupplement &&
                ttsSupplement.visibleTextAlreadyDelivered !== true &&
                !deliverablePayload.text?.trim()
                  ? {
                      ...deliverablePayload,
                      text: ttsSupplement.spokenText,
                    }
                  : deliverablePayload;
              const allowedMentions = discordTextHasBroadcastMention(fallbackPayload.text ?? "")
                ? TARGETED_ONLY_ALLOWED_MENTIONS
                : void 0;
              const replyToId = replyReference.use();
              notifyFinalReplyStart();
              await deliverDiscordReply({
                cfg,
                replies: [fallbackPayload],
                target: deliverTarget,
                token,
                accountId,
                rest: deliveryRest,
                runtime,
                replyToId,
                replyToMode,
                textLimit,
                maxLinesPerMessage,
                tableMode,
                chunkMode,
                sessionKey: ctxPayload.SessionKey,
                threadBindings,
                mediaLocalRoots,
                allowedMentions,
                kind: info.kind,
              });
              return true;
            },
            onNormalDelivered: () => {
              markUserFacingFinalDelivered();
              replyReference.markSent();
            },
          })
        ).kind !== "normal-skipped"
      )
        return { visibleReplySent: true };
    }
    if (isProcessAborted(abortSignal)) {
      logVerbose(
        formatDiscordReplySkip({
          kind: info.kind,
          reason: "aborted before delivery",
          target: deliverTarget,
          sessionKey: ctxPayload.SessionKey,
        }),
      );
      return { visibleReplySent: false };
    }
    const replyToId = replyReference.use();
    if (isFinal) notifyFinalReplyStart();
    const receiptLine =
      isFinal && deliverablePayload.isError !== true ? progressReceiptLine : void 0;
    const payloadForDelivery = receiptLine
      ? {
          ...deliverablePayload,
          text: deliverablePayload.text?.trim()
            ? `${deliverablePayload.text.trimEnd()}\n${receiptLine}`
            : receiptLine,
        }
      : deliverablePayload;
    await deliverDiscordReply({
      cfg,
      replies: [payloadForDelivery],
      target: deliverTarget,
      token,
      accountId,
      rest: deliveryRest,
      runtime,
      replyToId,
      replyToMode,
      textLimit,
      maxLinesPerMessage,
      tableMode,
      chunkMode,
      sessionKey: ctxPayload.SessionKey,
      threadBindings,
      mediaLocalRoots,
      kind: info.kind,
    });
    replyReference.markSent();
    if (isFinal && deliverablePayload.isError !== true) {
      if (receiptLine) {
        progressReceiptLine = void 0;
        draftPreview.markProgressDraftCollapsed();
      }
      markUserFacingFinalDelivered();
      if (clearProgressDraftAfterFinalDelivery) {
        clearProgressDraftAfterFinalDelivery = false;
        await draftStream?.discardPending();
        await draftStream?.clear();
      }
    }
    return { visibleReplySent: true };
  };
  const onDiscordDeliveryError = (err, info) => {
    if (info.kind === "final" && finalReplyStartNotified && !userFacingFinalDelivered)
      userFacingFinalDeliveryFailed = true;
    runtime.error(
      danger(
        formatDiscordReplyDeliveryFailure({
          kind: info.kind,
          err,
          target: deliverTarget,
          sessionKey: ctxPayload.SessionKey,
        }),
      ),
    );
  };
  const onDiscordReplyStart = async () => {
    if (isProcessAborted(abortSignal)) return;
    await replyPipeline.typingCallbacks?.onReplyStart();
    await statusReactions.setThinking();
  };
  const resolvedBlockStreamingEnabled = resolveChannelStreamingBlockEnabled(discordConfig);
  let dispatchResult = null;
  let dispatchError = false;
  let dispatchAborted = false;
  const deliverPendingToolWarningFinalIfNeeded = async () => {
    if (!pendingToolWarningFinal || userFacingFinalDelivered || isProcessAborted(abortSignal))
      return;
    const pending = pendingToolWarningFinal;
    pendingToolWarningFinal = void 0;
    try {
      return await deliverDiscordPayload(pending.payload, pending.info, {
        allowFallbackOnlyToolWarning: true,
      });
    } catch (err) {
      dispatchError = true;
      onDiscordDeliveryError(err, pending.info);
      return { visibleReplySent: false };
    }
  };
  try {
    if (isProcessAborted(abortSignal)) {
      dispatchAborted = true;
      return;
    }
    const preparedResult = await dispatchChannelInboundReply({
      cfg,
      channel: "discord",
      accountId: route.accountId,
      agentId: route.agentId,
      routeSessionKey: persistedSessionKey,
      storePath: turn.storePath,
      ctxPayload,
      recordInboundSession,
      afterRecord: queueInitialAckReactionAfterRecord,
      dispatchReplyWithBufferedBlockDispatcher: withDiscordSessionRetry(dispatchReply, abortSignal),
      dispatcherOptions: {
        ...replyPipeline,
        humanDelay: resolveHumanDelayConfig(cfg, route.agentId),
        beforeDeliver: beforeDiscordPayloadDelivery,
        onReplyStart: onDiscordReplyStart,
        onFreshSettledDelivery: deliverPendingToolWarningFinalIfNeeded,
      },
      delivery: {
        deliver: deliverDiscordPayload,
        onError: onDiscordDeliveryError,
      },
      record: turn.record,
      history: isRoomEvent
        ? void 0
        : {
            isGroup: isGuildMessage,
            historyKey: messageChannelId,
            historyMap: guildHistories,
            limit: historyLimit,
          },
      replyOptions: {
        abortSignal,
        skillFilter: channelConfig?.skills,
        sourceReplyDeliveryMode,
        typingKeepalive: shouldDisableCoreTypingKeepalive ? false : void 0,
        queuedDeliveryCorrelations: isRoomEvent ? [{ begin: beginDeliveryCorrelation }] : void 0,
        suppressTyping: isRoomEvent ? true : void 0,
        allowProgressCallbacksWhenSourceDeliverySuppressed:
          sourceRepliesAreToolOnly && draftPreview.draftStream && draftPreview.isProgressMode
            ? true
            : void 0,
        disableBlockStreaming: sourceRepliesAreToolOnly
          ? true
          : (draftPreview.disableBlockStreamingForDraft ??
            (typeof resolvedBlockStreamingEnabled === "boolean"
              ? !resolvedBlockStreamingEnabled
              : void 0)),
        onPartialReply:
          draftPreview.draftStream && !draftPreview.isProgressMode
            ? (payload) => draftPreview.updateFromPartial(payload.text)
            : void 0,
        onAssistantMessageStart: draftPreview.draftStream ? handleAssistantMessageBoundary : void 0,
        onReasoningEnd: draftPreview.draftStream
          ? () => {
              closePendingWindowThought();
              handleAssistantMessageBoundary();
            }
          : void 0,
        onModelSelected,
        suppressDefaultToolProgressMessages:
          (sourceRepliesAreToolOnly && statusReactionsExplicitlyEnabled) ||
          draftPreview.suppressDefaultToolProgressMessages
            ? true
            : void 0,
        allowToolLifecycleWhenProgressHidden: statusReactionsEnabled ? true : void 0,
        commentaryProgressEnabled: draftPreview.isProgressMode
          ? draftPreview.commentaryProgressEnabled
          : void 0,
        progressPreambleEnabled:
          draftPreview.draftStream && draftPreview.isProgressMode ? true : void 0,
        commentaryPayloadsEnabled: draftPreview.isProgressMode
          ? draftPreview.commentaryProgressEnabled
          : void 0,
        reasoningPayloadsEnabled: reasoningDurableEnabled,
        onVerboseProgressVisibility: (isActive) => {
          shouldYieldDraftProgress = isActive;
        },
        onNarrationUpdate: draftPreview.narrationProgressEnabled
          ? async (payload) => {
              if (isProcessAborted(abortSignal) || shouldYieldDraftProgress()) return;
              await draftPreview.pushNarrationProgress(payload.text);
            }
          : void 0,
        onProgressNarratorLifecycle: draftPreview.narrationProgressEnabled
          ? (lifecycle) => draftPreview.setProgressNarratorLifecycle(lifecycle)
          : void 0,
        isProgressDraftVisible: draftPreview.narrationProgressEnabled
          ? () => draftPreview.isProgressDraftVisible
          : void 0,
        narrationHideCommandText: draftPreview.narrationHideCommandText ? true : void 0,
        onReasoningStream: async (payload) => {
          if (payload?.requiresReasoningProgressOptIn === true && !reasoningWindowEnabled) return;
          if (payload?.text) windowReasoningOpen = true;
          await statusReactions.setThinking();
          await draftPreview.pushReasoningProgress(payload?.text, {
            snapshot: payload?.isReasoningSnapshot === true,
          });
        },
        streamReasoningInNonStreamModes: reasoningWindowEnabled,
        onToolStart: async (payload) => {
          if (isProcessAborted(abortSignal)) return;
          await maybeBindStatusReactionsToToolReaction(payload);
          await statusReactions.setTool(payload.name);
          if (payload.phase === "start") closePendingWindowThought();
          if (shouldYieldDraftProgress()) return;
          if (payload.phase === "start" && isChannelProgressDraftWorkToolName(payload.name))
            progressToolCalls += 1;
          await draftPreview.pushToolProgress(
            buildChannelProgressDraftLineForEntry(
              discordConfig,
              {
                event: "tool",
                itemId: payload.itemId,
                toolCallId: payload.toolCallId,
                name: payload.name,
                phase: payload.phase,
                args: payload.args,
              },
              payload.detailMode ? { detailMode: payload.detailMode } : void 0,
            ),
            { toolName: payload.name },
          );
        },
        onItemEvent: async (payload) => {
          if (isFailedProgress(payload)) return false;
          if (payload.kind === "preamble") {
            if (shouldYieldDraftProgress()) return;
            return await draftPreview.pushPreambleItemEvent(payload, noteWindowCommentary);
          }
          if (shouldYieldDraftProgress()) return;
          await draftPreview.pushToolProgress(
            buildChannelProgressDraftLineForEntry(discordConfig, {
              event: "item",
              itemId: payload.itemId,
              toolCallId: payload.toolCallId,
              itemKind: payload.kind,
              title: payload.title,
              name: payload.name,
              phase: payload.phase,
              status: payload.status,
              summary: payload.summary,
              progressText: payload.progressText,
              meta: payload.meta,
            }),
          );
        },
        onPlanUpdate: async (payload) => {
          if (payload.phase !== "update") return;
          await draftPreview.pushToolProgress(
            buildChannelProgressDraftLine({
              event: "plan",
              phase: payload.phase,
              title: payload.title,
              explanation: payload.explanation,
              steps: payload.steps,
            }),
          );
        },
        onApprovalEvent: async (payload) => {
          if (payload.phase !== "requested") return;
          await draftPreview.pushToolProgress(
            buildChannelProgressDraftLine({
              event: "approval",
              phase: payload.phase,
              title: payload.title,
              command: payload.command,
              reason: payload.reason,
              message: payload.message,
            }),
          );
        },
        onCommandOutput: async (payload) => {
          if (isFailedProgress(payload)) return false;
          if (payload.phase !== "end") return;
          if (shouldYieldDraftProgress()) return;
          await draftPreview.pushToolProgress(
            buildChannelProgressDraftLine({
              event: "command-output",
              itemId: payload.itemId,
              toolCallId: payload.toolCallId,
              phase: payload.phase,
              title: payload.title,
              name: payload.name,
              status: payload.status,
              exitCode: payload.exitCode,
            }),
          );
        },
        onPatchSummary: async (payload) => {
          if (payload.phase !== "end") return;
          if (shouldYieldDraftProgress()) return;
          await draftPreview.pushToolProgress(
            buildChannelProgressDraftLine({
              event: "patch",
              itemId: payload.itemId,
              toolCallId: payload.toolCallId,
              phase: payload.phase,
              title: payload.title,
              name: payload.name,
              added: payload.added,
              modified: payload.modified,
              deleted: payload.deleted,
              summary: payload.summary,
            }),
          );
        },
        onCompactionStart: async () => {
          if (isProcessAborted(abortSignal)) return;
          await statusReactions.setCompacting();
        },
        onCompactionEnd: async () => {
          if (isProcessAborted(abortSignal)) return;
          statusReactions.cancelPending();
          await statusReactions.setThinking();
        },
      },
    });
    if (!preparedResult.dispatched) return;
    dispatchResult = preparedResult.dispatchResult;
    if (isProcessAborted(abortSignal)) {
      dispatchAborted = true;
      return;
    }
  } catch (err) {
    if (isProcessAborted(abortSignal)) {
      dispatchAborted = true;
      return;
    }
    dispatchError = true;
    if (await completeDiscordSessionConflict(err, deliverDiscordPayload, onDiscordDeliveryError))
      return;
    throw err;
  } finally {
    endDiscordInboundEventDeliveryCorrelation();
    await draftPreview.cleanup();
    const finalDeliveryFailed = (dispatchResult?.failedCounts?.final ?? 0) > 0;
    if (statusReactionsActive)
      if (dispatchAborted)
        if (removeAckAfterReply) statusReactions.clear();
        else statusReactions.restoreInitial();
      else {
        if (dispatchError || finalDeliveryFailed) await statusReactions.setError();
        else await statusReactions.setDone();
        if (removeAckAfterReply)
          (async () => {
            await sleep(
              dispatchError || finalDeliveryFailed
                ? statusReactionTiming.errorHoldMs
                : statusReactionTiming.doneHoldMs,
            );
            await statusReactions.clear();
          })();
        else statusReactions.restoreInitial();
      }
    else if (shouldSendAckReaction && ackReaction && removeAckAfterReply)
      removeReactionDiscord(messageChannelId, message.id, ackReaction, ackReactionContext).catch(
        (err) => {
          logAckFailure({
            log: logVerbose,
            channel: "discord",
            target: `${messageChannelId}/${message.id}`,
            error: err,
          });
        },
      );
  }
  if (dispatchAborted) return;
  const finalDispatchResult = dispatchResult;
  if (!finalDispatchResult || !hasFinalChannelTurnDispatch(finalDispatchResult)) return;
  if (shouldLogVerbose()) {
    const finalCount = finalDispatchResult.counts.final;
    logVerbose(
      `discord: delivered ${finalCount} reply${finalCount === 1 ? "" : "ies"} to ${replyTarget}`,
    );
  }
}
//#endregion
export { formatDiscordReplySkip, processDiscordMessage };
