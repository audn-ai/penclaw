import {
  n as createCommandTurnContext,
  t as commandTurnKindToSource,
} from "./command-turn-context-DXqYoJ8B.js";
import { r as shouldIncludeSupplementalContext } from "./context-visibility-C5CaKMWO.js";
import { t as finalizeInboundContext } from "./inbound-context-DpKaYErg.js";
import { t as normalizeInboundTextNewlines } from "./inbound-text-B6lb_yrL.js";
import { p as buildChannelInboundMediaPayload } from "./kernel-BhdvbEs2.js";
import { t as sanitizeInboundSystemTags } from "./system-tags-Q468PeYF.js";
//#region src/channels/inbound-event/context.ts
/**
 * Channel inbound event context builder.
 *
 * Converts route, sender, command, media, and supplemental facts into finalized message context.
 */
function keepSupplementalContext(params) {
  if (!params.mode || params.mode === "all") return true;
  if (params.senderAllowed === void 0) return false;
  return shouldIncludeSupplementalContext({
    mode: params.mode,
    kind: params.kind,
    senderAllowed: params.senderAllowed,
  });
}
function filterChannelInboundSupplementalContext(params) {
  const supplemental = params.supplemental;
  if (!supplemental) return;
  const quote = keepSupplementalContext({
    mode: params.contextVisibility,
    kind: "quote",
    senderAllowed: supplemental.quote?.senderAllowed,
  })
    ? supplemental.quote
    : void 0;
  const forwarded = keepSupplementalContext({
    mode: params.contextVisibility,
    kind: "forwarded",
    senderAllowed: supplemental.forwarded?.senderAllowed,
  })
    ? supplemental.forwarded
    : void 0;
  const thread = keepSupplementalContext({
    mode: params.contextVisibility,
    kind: "thread",
    senderAllowed: supplemental.thread?.senderAllowed,
  })
    ? supplemental.thread
    : void 0;
  return {
    ...supplemental,
    quote,
    forwarded,
    thread,
  };
}
function filterChannelInboundQuoteContext(contextVisibility, quote) {
  return filterChannelInboundSupplementalContext({
    contextVisibility,
    supplemental: quote ? { quote } : void 0,
  })?.quote;
}
function definedFields(fields) {
  return Object.fromEntries(Object.entries(fields).filter((entry) => entry[1] !== void 0));
}
function isPromiseLike(value) {
  return Boolean(value) && typeof value.then === "function";
}
function stripQuoteRuntimeFields(quote) {
  const { media: _media, isSelf: _isSelf, ...stripped } = quote;
  return stripped;
}
function resolveChannelInboundSupplementalForFinalizer(params) {
  const rawSupplemental = params.supplemental;
  const filtered = filterChannelInboundSupplementalContext({
    supplemental: rawSupplemental,
    contextVisibility: params.contextVisibility,
  });
  const media = [...(params.media ?? [])];
  if (!rawSupplemental?.quote || !filtered?.quote)
    return {
      rawSupplemental,
      supplemental: filtered,
      media,
    };
  const quote = filtered.quote;
  const selfQuote = quote.isSelf === true;
  const suppressSelfQuoteBody = params.suppressSelfQuoteBody ?? true;
  const suppressSelfQuoteMedia = params.suppressSelfQuoteMedia ?? true;
  const finalizeQuote = (quoteMedia) => {
    if (!(selfQuote && suppressSelfQuoteMedia)) media.push(...(quoteMedia ?? []));
    const stripped = stripQuoteRuntimeFields(quote);
    const visibleQuote =
      selfQuote && suppressSelfQuoteBody
        ? (({ body: _body, ...withoutBody }) => withoutBody)(stripped)
        : stripped;
    return {
      rawSupplemental,
      supplemental: {
        ...filtered,
        quote: visibleQuote,
      },
      media,
    };
  };
  if (selfQuote && suppressSelfQuoteMedia) return finalizeQuote(void 0);
  if (!params.resolveSupplementalMedia)
    return finalizeQuote(Array.isArray(quote.media) ? quote.media : void 0);
  if (typeof quote.media !== "function") return finalizeQuote(quote.media);
  const resolved = quote.media();
  return isPromiseLike(resolved) ? resolved.then(finalizeQuote) : finalizeQuote(resolved);
}
/**
 * @deprecated Prefer `buildChannelInboundEventContext({ resolveSupplementalMedia: true })`
 * for channel inbound payloads.
 */
async function resolveChannelInboundSupplementalContext(params) {
  const resolved = await resolveChannelInboundSupplementalForFinalizer({
    ...params,
    resolveSupplementalMedia: true,
  });
  return {
    supplemental: resolved.supplemental,
    media: [...(resolved.media ?? [])],
    quoteHidden: Boolean(resolved.rawSupplemental?.quote && !resolved.supplemental?.quote),
  };
}
function finalizePreparedChannelInboundContext(params) {
  const mediaPayload = params.media
    ? definedFields(buildChannelInboundMediaPayload([...params.media]))
    : {};
  const baseContext = {
    ...params.originalContext,
    SupplementalContext: params.supplemental,
    ...mediaPayload,
  };
  const untrustedStructuredContext = resolveUntrustedStructuredContext({
    supplemental: params.supplemental,
    extra: baseContext,
  });
  return {
    context: (params.finalize ?? finalizeInboundContext)(
      {
        ...baseContext,
        UntrustedStructuredContext: untrustedStructuredContext,
      },
      params.finalizeOptions,
    ),
    supplemental: params.supplemental,
    quoteHidden: Boolean(params.rawSupplemental?.quote && !params.supplemental?.quote),
    forwardedHidden: Boolean(params.rawSupplemental?.forwarded && !params.supplemental?.forwarded),
    threadHidden: Boolean(params.rawSupplemental?.thread && !params.supplemental?.thread),
  };
}
function finalizeChannelInboundContext(params) {
  const contextSupplemental = params.context.SupplementalContext;
  const prepared = resolveChannelInboundSupplementalForFinalizer({
    supplemental: params.supplemental ?? contextSupplemental,
    contextVisibility: params.contextVisibility,
    media: params.media,
    resolveSupplementalMedia: params.resolveSupplementalMedia,
    suppressSelfQuoteBody: params.suppressSelfQuoteBody,
    suppressSelfQuoteMedia: params.suppressSelfQuoteMedia,
  });
  const finish = (result) =>
    finalizePreparedChannelInboundContext({
      originalContext: params.context,
      finalize: params.finalize,
      finalizeOptions: params.finalizeOptions,
      ...result,
    });
  if (params.resolveSupplementalMedia) return Promise.resolve(prepared).then(finish);
  return isPromiseLike(prepared) ? prepared.then(finish) : finish(prepared);
}
function resolveAccessFactsCommandAuthorized(access) {
  const commands = access?.commands;
  return typeof commands?.authorized === "boolean"
    ? commands.authorized
    : commands?.authorizers?.some((entry) => entry.allowed);
}
function normalizeUntrustedGroupPrompt(value) {
  if (typeof value !== "string") return;
  const normalized = sanitizeInboundSystemTags(normalizeInboundTextNewlines(value));
  return normalized.trim().length > 0 ? normalized : void 0;
}
function resolveUntrustedStructuredContext(params) {
  const entries = [];
  const extraEntries = params.extra?.UntrustedStructuredContext;
  if (Array.isArray(extraEntries)) entries.push(...extraEntries);
  entries.push(...(params.supplemental?.untrustedContext ?? []));
  const groupPrompt = normalizeUntrustedGroupPrompt(
    params.supplemental?.untrustedGroupSystemPrompt,
  );
  if (groupPrompt)
    entries.push({
      label: "Group prompt context",
      type: "group_prompt_context",
      payload: { text: groupPrompt },
    });
  return entries.length > 0 ? entries : void 0;
}
function resolveChannelCommandContext(params) {
  if (params.commandTurn) return params.commandTurn;
  const command = params.command;
  if (!command) return;
  const body = command.body ?? params.message.commandBody ?? params.message.rawBody;
  return createCommandTurnContext(commandTurnKindToSource(command.kind), {
    authorized:
      command.kind === "normal"
        ? false
        : (command.authorized ?? resolveAccessFactsCommandAuthorized(params.access) === true),
    commandName: command.name,
    body,
  });
}
function buildChannelInboundEventContext(params) {
  const body = params.message.body ?? params.message.rawBody;
  const commandTurn = resolveChannelCommandContext({
    command: params.command,
    commandTurn: params.commandTurn,
    message: params.message,
    access: params.access,
  });
  const context = {
    Body: body,
    InboundEventKind: params.message.inboundEventKind ?? "user_request",
    BodyForAgent: params.message.bodyForAgent ?? params.message.rawBody,
    InboundHistory: params.message.inboundHistory,
    SourceModality: params.message.sourceModality,
    RawBody: params.message.rawBody,
    CommandBody: params.message.commandBody ?? params.message.rawBody,
    BodyForCommands: params.message.commandBody ?? params.message.rawBody,
    From: params.from,
    To: params.reply.to,
    SessionKey: params.route.dispatchSessionKey ?? params.route.routeSessionKey,
    AgentId: params.route.agentId,
    AccountId: params.route.accountId ?? params.accountId,
    ParentSessionKey: params.route.parentSessionKey,
    ModelParentSessionKey: params.route.modelParentSessionKey,
    MessageSid: params.messageId,
    MessageSidFull: params.messageIdFull,
    ReplyToId: params.reply.replyToId,
    ReplyToIdFull: params.reply.replyToIdFull,
    ChatType: params.conversation.kind,
    ChatId: params.conversation.id,
    ConversationLabel: params.conversation.label,
    GroupSubject: params.conversation.kind !== "direct" ? params.conversation.label : void 0,
    GroupSpace: params.conversation.spaceId,
    SenderName: params.sender.name ?? params.sender.displayLabel,
    SenderId: params.sender.id,
    SenderUsername: params.sender.username,
    SenderTag: params.sender.tag,
    SenderIsBot: params.sender.isBot,
    MemberRoleIds: params.sender.roles,
    Timestamp: params.timestamp,
    Provider: params.provider ?? params.channel,
    Surface: params.surface ?? params.provider ?? params.channel,
    WasMentioned: params.access?.mentions?.wasMentioned,
    GroupRequireMention: params.access?.mentions?.requireMention,
    ExplicitlyMentionedBot: params.access?.mentions?.explicitlyMentionedBot,
    MentionedUserIds: params.access?.mentions?.mentionedUserIds,
    MentionedSubteamIds: params.access?.mentions?.mentionedSubteamIds,
    ImplicitMentionKinds: params.access?.mentions?.implicitMentionKinds,
    MentionSource: params.access?.mentions?.mentionSource,
    CommandAuthorized: resolveAccessFactsCommandAuthorized(params.access) === true,
    CommandTurn: commandTurn,
    MessageThreadId: params.reply.messageThreadId ?? params.conversation.threadId,
    NativeChannelId: params.reply.nativeChannelId ?? params.conversation.nativeChannelId,
    ChannelContext: params.channelContext,
    OriginatingChannel: params.channel,
    OriginatingTo: params.reply.originatingTo ?? params.reply.to,
    ThreadParentId: params.reply.threadParentId ?? params.conversation.parentId,
    ...params.extra,
  };
  const finalizeParams = {
    finalize: params.finalize,
    finalizeOptions: params.finalizeOptions,
    supplemental: params.supplemental,
    contextVisibility: params.contextVisibility,
    media: params.media,
    context,
  };
  const result = params.resolveSupplementalMedia
    ? finalizeChannelInboundContext({
        ...finalizeParams,
        resolveSupplementalMedia: true,
        suppressSelfQuoteBody: params.suppressSelfQuoteBody,
        suppressSelfQuoteMedia: params.suppressSelfQuoteMedia,
      })
    : finalizeChannelInboundContext(finalizeParams);
  return isPromiseLike(result) ? result.then((finalized) => finalized.context) : result.context;
}
//#endregion
export {
  resolveChannelInboundSupplementalContext as a,
  finalizeChannelInboundContext as i,
  filterChannelInboundQuoteContext as n,
  filterChannelInboundSupplementalContext as r,
  buildChannelInboundEventContext as t,
};
