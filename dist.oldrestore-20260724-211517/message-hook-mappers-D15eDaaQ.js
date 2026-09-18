import { T as freezeDiagnosticTraceContext } from "./diagnostic-events-5-gsFhkM.js";
import { n as internalSessionConversationId } from "./message-channel-constants-CvbXi0yz.js";
import { a as normalizeChannelId, t as getChannelPlugin } from "./registry-mc8oBRx8.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { i as stripChannelPrefix } from "./string-readers-A0wspDGq.js";
import "./plugins-BKdf-5tW.js";
//#region src/hooks/message-hook-mappers.ts
function readNonBlankString(value) {
  return typeof value === "string" && value.trim().length > 0 ? value : void 0;
}
function assignRemoteMediaStagingMetadata(target, canonical) {
  const metadata = {
    mediaRemoteHost: canonical.mediaRemoteHost,
    mediaStagingPending: canonical.mediaStagingPending,
    originalMediaPath: canonical.originalMediaPath,
    originalMediaUrl: canonical.originalMediaUrl,
    originalMediaType: canonical.originalMediaType,
    originalMediaPaths: canonical.originalMediaPaths,
    originalMediaUrls: canonical.originalMediaUrls,
    originalMediaTypes: canonical.originalMediaTypes,
  };
  for (const [key, value] of Object.entries(metadata)) if (value !== void 0) target[key] = value;
}
function deriveInboundMessageHookContext(ctx, overrides) {
  const content =
    overrides?.content ??
    readNonBlankString(ctx.BodyForCommands) ??
    readNonBlankString(ctx.RawBody) ??
    readNonBlankString(ctx.Body) ??
    "";
  const channelId = normalizeLowercaseStringOrEmpty(
    ctx.OriginatingChannel ?? ctx.Surface ?? ctx.Provider ?? "",
  );
  const conversationId =
    ctx.OriginatingTo ??
    ctx.To ??
    ctx.From ??
    internalSessionConversationId(channelId, ctx.SessionKey);
  const isGroup = Boolean(ctx.GroupSubject || ctx.GroupChannel);
  const mediaPaths = Array.isArray(ctx.MediaPaths)
    ? ctx.MediaPaths.filter((value) => typeof value === "string" && value.length > 0)
    : void 0;
  const mediaTypes = Array.isArray(ctx.MediaTypes)
    ? ctx.MediaTypes.filter((value) => typeof value === "string" && value.length > 0)
    : void 0;
  const mediaUrls = Array.isArray(ctx.MediaUrls)
    ? ctx.MediaUrls.filter((value) => typeof value === "string" && value.length > 0)
    : void 0;
  return {
    from: ctx.From ?? "",
    to: ctx.To,
    content,
    body: ctx.Body,
    bodyForAgent: ctx.BodyForAgent,
    transcript: ctx.Transcript,
    timestamp:
      typeof ctx.Timestamp === "number" && Number.isFinite(ctx.Timestamp) ? ctx.Timestamp : void 0,
    channelId,
    accountId: ctx.AccountId,
    conversationId,
    sessionKey: ctx.SessionKey,
    agentId: ctx.AgentId,
    messageId:
      overrides?.messageId ??
      ctx.MessageSidFull ??
      ctx.MessageSid ??
      ctx.MessageSidFirst ??
      ctx.MessageSidLast,
    senderId: ctx.SenderId,
    senderName: ctx.SenderName,
    senderUsername: ctx.SenderUsername,
    senderE164: ctx.SenderE164,
    replyToId: ctx.ReplyToId,
    replyToIdFull: ctx.ReplyToIdFull,
    replyToBody: ctx.ReplyToBody,
    replyToSender: ctx.ReplyToSender,
    replyToIsQuote: ctx.ReplyToIsQuote,
    provider: ctx.Provider,
    surface: ctx.Surface,
    threadId: ctx.MessageThreadId,
    threadParentId: ctx.ThreadParentId,
    mediaPath: ctx.MediaPath ?? mediaPaths?.[0],
    mediaUrl: ctx.MediaUrl ?? mediaUrls?.[0],
    mediaType: ctx.MediaType ?? mediaTypes?.[0],
    mediaPaths,
    mediaUrls,
    mediaTypes,
    originatingChannel: ctx.OriginatingChannel,
    originatingTo: ctx.OriginatingTo,
    guildId: ctx.GroupSpace,
    channelName: ctx.GroupChannel,
    isGroup,
    groupId: isGroup ? conversationId : void 0,
    topicName: ctx.TopicName,
  };
}
function buildCanonicalSentMessageHookContext(params) {
  return {
    to: params.to,
    content: params.content,
    success: params.success,
    error: params.error,
    channelId: params.channelId,
    accountId: params.accountId,
    conversationId: params.conversationId ?? params.to,
    sessionKey: params.sessionKey,
    runId: params.runId,
    messageId: params.messageId,
    trace: params.trace,
    callDepth: params.callDepth,
    isGroup: params.isGroup,
    groupId: params.groupId,
  };
}
function assignTraceFields(target, trace) {
  if (!trace) return;
  const safeTrace = freezeDiagnosticTraceContext(trace);
  target.trace = safeTrace;
  target.traceId = safeTrace.traceId;
  if (safeTrace.spanId) target.spanId = safeTrace.spanId;
  if (safeTrace.parentSpanId) target.parentSpanId = safeTrace.parentSpanId;
}
function toPluginMessageContext(canonical) {
  const context = {
    channelId: canonical.channelId,
    accountId: canonical.accountId,
    conversationId: canonical.conversationId,
  };
  if (canonical.sessionKey) context.sessionKey = canonical.sessionKey;
  if (canonical.runId) context.runId = canonical.runId;
  if (canonical.messageId) context.messageId = canonical.messageId;
  if ("senderId" in canonical && canonical.senderId) context.senderId = canonical.senderId;
  if ("replyToId" in canonical && canonical.replyToId !== void 0)
    context.replyToId = canonical.replyToId;
  if ("replyToIdFull" in canonical && canonical.replyToIdFull !== void 0)
    context.replyToIdFull = canonical.replyToIdFull;
  if ("replyToBody" in canonical && canonical.replyToBody !== void 0)
    context.replyToBody = canonical.replyToBody;
  if ("replyToSender" in canonical && canonical.replyToSender !== void 0)
    context.replyToSender = canonical.replyToSender;
  if ("replyToIsQuote" in canonical && canonical.replyToIsQuote !== void 0)
    context.replyToIsQuote = canonical.replyToIsQuote;
  assignTraceFields(context, canonical.trace);
  if (canonical.callDepth != null) context.callDepth = canonical.callDepth;
  return context;
}
function resolveInboundConversation(canonical) {
  const channelId = normalizeChannelId(canonical.channelId);
  const pluginResolved = channelId
    ? getChannelPlugin(channelId)?.messaging?.resolveInboundConversation?.({
        from: canonical.from,
        to: canonical.to ?? canonical.originatingTo,
        conversationId: canonical.conversationId,
        threadId: canonical.threadId,
        threadParentId: canonical.threadParentId,
        isGroup: canonical.isGroup,
      })
    : null;
  if (pluginResolved)
    return {
      conversationId: normalizeOptionalString(pluginResolved.conversationId),
      parentConversationId: normalizeOptionalString(pluginResolved.parentConversationId),
    };
  return {
    conversationId: stripChannelPrefix(
      canonical.to ?? canonical.originatingTo ?? canonical.conversationId,
      canonical.channelId,
    ),
  };
}
function toPluginInboundClaimContext(canonical) {
  const conversation = resolveInboundConversation(canonical);
  const context = {
    channelId: canonical.channelId,
    accountId: canonical.accountId,
    conversationId: conversation.conversationId,
    sessionKey: canonical.sessionKey,
    agentId: canonical.agentId,
    parentConversationId: conversation.parentConversationId,
    senderId: canonical.senderId,
    messageId: canonical.messageId,
    runId: canonical.runId,
    callDepth: canonical.callDepth,
  };
  if (canonical.replyToId !== void 0) context.replyToId = canonical.replyToId;
  if (canonical.replyToIdFull !== void 0) context.replyToIdFull = canonical.replyToIdFull;
  if (canonical.replyToBody !== void 0) context.replyToBody = canonical.replyToBody;
  if (canonical.replyToSender !== void 0) context.replyToSender = canonical.replyToSender;
  if (canonical.replyToIsQuote !== void 0) context.replyToIsQuote = canonical.replyToIsQuote;
  assignTraceFields(context, canonical.trace);
  return context;
}
function toPluginInboundClaimEvent(canonical, extras) {
  const context = toPluginInboundClaimContext(canonical);
  const event = {
    content: canonical.content,
    body: canonical.body,
    bodyForAgent: canonical.bodyForAgent,
    transcript: canonical.transcript,
    timestamp: canonical.timestamp,
    channel: canonical.channelId,
    accountId: canonical.accountId,
    conversationId: context.conversationId,
    parentConversationId: context.parentConversationId,
    senderId: canonical.senderId,
    senderName: canonical.senderName,
    senderUsername: canonical.senderUsername,
    ...(canonical.replyToId !== void 0 ? { replyToId: canonical.replyToId } : {}),
    ...(canonical.replyToIdFull !== void 0 ? { replyToIdFull: canonical.replyToIdFull } : {}),
    ...(canonical.replyToBody !== void 0 ? { replyToBody: canonical.replyToBody } : {}),
    ...(canonical.replyToSender !== void 0 ? { replyToSender: canonical.replyToSender } : {}),
    ...(canonical.replyToIsQuote !== void 0 ? { replyToIsQuote: canonical.replyToIsQuote } : {}),
    threadId: canonical.threadId,
    messageId: canonical.messageId,
    sessionKey: canonical.sessionKey,
    runId: canonical.runId,
    isGroup: canonical.isGroup,
    commandAuthorized: extras?.commandAuthorized,
    wasMentioned: extras?.wasMentioned,
    metadata: {
      from: canonical.from,
      to: canonical.to,
      provider: canonical.provider,
      surface: canonical.surface,
      originatingChannel: canonical.originatingChannel,
      originatingTo: canonical.originatingTo,
      senderE164: canonical.senderE164,
      replyToId: canonical.replyToId,
      replyToIdFull: canonical.replyToIdFull,
      replyToBody: canonical.replyToBody,
      replyToSender: canonical.replyToSender,
      replyToIsQuote: canonical.replyToIsQuote,
      mediaPath: canonical.mediaPath,
      mediaUrl: canonical.mediaUrl,
      mediaType: canonical.mediaType,
      mediaPaths: canonical.mediaPaths,
      mediaUrls: canonical.mediaUrls,
      mediaTypes: canonical.mediaTypes,
      guildId: canonical.guildId,
      channelName: canonical.channelName,
      groupId: canonical.groupId,
      topicName: canonical.topicName,
    },
  };
  if (event.metadata) assignRemoteMediaStagingMetadata(event.metadata, canonical);
  assignTraceFields(event, canonical.trace);
  return event;
}
function toPluginMessageReceivedEvent(canonical) {
  const event = {
    from: canonical.from,
    content: canonical.content,
    timestamp: canonical.timestamp,
    threadId: canonical.threadId,
    messageId: canonical.messageId,
    senderId: canonical.senderId,
    ...(canonical.replyToId !== void 0 ? { replyToId: canonical.replyToId } : {}),
    ...(canonical.replyToIdFull !== void 0 ? { replyToIdFull: canonical.replyToIdFull } : {}),
    ...(canonical.replyToBody !== void 0 ? { replyToBody: canonical.replyToBody } : {}),
    ...(canonical.replyToSender !== void 0 ? { replyToSender: canonical.replyToSender } : {}),
    ...(canonical.replyToIsQuote !== void 0 ? { replyToIsQuote: canonical.replyToIsQuote } : {}),
    sessionKey: canonical.sessionKey,
    runId: canonical.runId,
    metadata: {
      to: canonical.to,
      provider: canonical.provider,
      surface: canonical.surface,
      threadId: canonical.threadId,
      originatingChannel: canonical.originatingChannel,
      originatingTo: canonical.originatingTo,
      messageId: canonical.messageId,
      senderId: canonical.senderId,
      senderName: canonical.senderName,
      senderUsername: canonical.senderUsername,
      senderE164: canonical.senderE164,
      replyToId: canonical.replyToId,
      replyToIdFull: canonical.replyToIdFull,
      replyToBody: canonical.replyToBody,
      replyToSender: canonical.replyToSender,
      replyToIsQuote: canonical.replyToIsQuote,
      mediaPath: canonical.mediaPath,
      mediaUrl: canonical.mediaUrl,
      mediaType: canonical.mediaType,
      mediaPaths: canonical.mediaPaths,
      mediaUrls: canonical.mediaUrls,
      mediaTypes: canonical.mediaTypes,
      guildId: canonical.guildId,
      channelName: canonical.channelName,
      topicName: canonical.topicName,
    },
  };
  if (event.metadata) assignRemoteMediaStagingMetadata(event.metadata, canonical);
  assignTraceFields(event, canonical.trace);
  return event;
}
function toPluginMessageSentEvent(canonical) {
  const event = {
    to: canonical.to,
    content: canonical.content,
    success: canonical.success,
    ...(canonical.messageId ? { messageId: canonical.messageId } : {}),
    ...(canonical.sessionKey ? { sessionKey: canonical.sessionKey } : {}),
    ...(canonical.runId ? { runId: canonical.runId } : {}),
    ...(canonical.error ? { error: canonical.error } : {}),
  };
  assignTraceFields(event, canonical.trace);
  return event;
}
function toInternalMessageReceivedContext(canonical) {
  const context = {
    from: canonical.from,
    content: canonical.content,
    timestamp: canonical.timestamp,
    channelId: canonical.channelId,
    accountId: canonical.accountId,
    conversationId: canonical.conversationId,
    messageId: canonical.messageId,
    metadata: {
      to: canonical.to,
      provider: canonical.provider,
      surface: canonical.surface,
      threadId: canonical.threadId,
      senderId: canonical.senderId,
      senderName: canonical.senderName,
      senderUsername: canonical.senderUsername,
      senderE164: canonical.senderE164,
      mediaPath: canonical.mediaPath,
      mediaUrl: canonical.mediaUrl,
      mediaType: canonical.mediaType,
      mediaPaths: canonical.mediaPaths,
      mediaUrls: canonical.mediaUrls,
      mediaTypes: canonical.mediaTypes,
      guildId: canonical.guildId,
      channelName: canonical.channelName,
      topicName: canonical.topicName,
    },
  };
  if (context.metadata) assignRemoteMediaStagingMetadata(context.metadata, canonical);
  return context;
}
function toInternalMessageTranscribedContext(canonical, cfg) {
  return {
    ...toInternalInboundMessageHookContextBase(canonical),
    transcript: canonical.transcript ?? "",
    cfg,
  };
}
function toInternalMessagePreprocessedContext(canonical, cfg) {
  return {
    ...toInternalInboundMessageHookContextBase(canonical),
    transcript: canonical.transcript,
    isGroup: canonical.isGroup,
    groupId: canonical.groupId,
    cfg,
  };
}
function toInternalInboundMessageHookContextBase(canonical) {
  return {
    from: canonical.from,
    to: canonical.to,
    body: canonical.body,
    bodyForAgent: canonical.bodyForAgent,
    timestamp: canonical.timestamp,
    channelId: canonical.channelId,
    conversationId: canonical.conversationId,
    messageId: canonical.messageId,
    senderId: canonical.senderId,
    senderName: canonical.senderName,
    senderUsername: canonical.senderUsername,
    provider: canonical.provider,
    surface: canonical.surface,
    mediaPath: canonical.mediaPath,
    mediaType: canonical.mediaType,
  };
}
function toInternalMessageSentContext(canonical) {
  return {
    to: canonical.to,
    content: canonical.content,
    success: canonical.success,
    ...(canonical.error ? { error: canonical.error } : {}),
    channelId: canonical.channelId,
    accountId: canonical.accountId,
    conversationId: canonical.conversationId,
    messageId: canonical.messageId,
    ...(canonical.isGroup != null ? { isGroup: canonical.isGroup } : {}),
    ...(canonical.groupId ? { groupId: canonical.groupId } : {}),
  };
}
//#endregion
export {
  toInternalMessageSentContext as a,
  toPluginInboundClaimEvent as c,
  toPluginMessageSentEvent as d,
  toInternalMessageReceivedContext as i,
  toPluginMessageContext as l,
  deriveInboundMessageHookContext as n,
  toInternalMessageTranscribedContext as o,
  toInternalMessagePreprocessedContext as r,
  toPluginInboundClaimContext as s,
  buildCanonicalSentMessageHookContext as t,
  toPluginMessageReceivedEvent as u,
};
