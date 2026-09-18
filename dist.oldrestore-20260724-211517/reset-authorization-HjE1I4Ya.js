import { t as resolveCommandAuthorization } from "./command-auth-CUBmRLXD.js";
import { r as normalizeCommandBody } from "./commands-registry-normalize-C6c5CQe0.js";
import "./registry-xXjI-8UE.js";
import { o as stripMentions } from "./mentions-BFTjjd4G.js";
import { i as isInternalMessageChannel } from "./message-channel-NQc9DJ6B.js";
import { t as normalizeAnyChannelId } from "./registry-normalize-CWirNxxC.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
//#region src/auto-reply/reply/commands-context.ts
/** Builds normalized command context from inbound message and authorization state. */
/** Builds command routing/auth metadata consumed by command handlers. */
function buildCommandContext(params) {
  const { ctx, cfg, agentId, sessionKey, isGroup, triggerBodyNormalized } = params;
  const auth = resolveCommandAuthorization({
    ctx,
    cfg,
    commandAuthorized: params.commandAuthorized,
  });
  const surface = normalizeLowercaseStringOrEmpty(ctx.Surface ?? ctx.Provider);
  const channel = normalizeLowercaseStringOrEmpty(
    ctx.OriginatingChannel ?? ctx.Provider ?? surface,
  );
  const from = auth.from ?? normalizeOptionalString(ctx.SenderId);
  const to = auth.to ?? normalizeOptionalString(ctx.OriginatingTo);
  const abortKey = sessionKey ?? from ?? to;
  const channelId = normalizeAnyChannelId(channel) ?? (channel ? channel : void 0);
  const rawBodyNormalized = triggerBodyNormalized;
  const commandBodyNormalized = normalizeCommandBody(
    isGroup ? stripMentions(rawBodyNormalized, ctx, cfg, agentId) : rawBodyNormalized,
    { botUsername: ctx.BotUsername },
  );
  return {
    surface,
    channel,
    channelId: channelId ?? auth.providerId,
    accountId: normalizeOptionalString(ctx.AccountId),
    ownerList: auth.ownerList,
    senderIsOwner: auth.senderIsOwner,
    isAuthorizedSender: auth.isAuthorizedSender,
    senderId: auth.senderId,
    abortKey,
    rawBodyNormalized,
    commandBodyNormalized,
    from,
    to,
  };
}
//#endregion
//#region src/auto-reply/reply/reset-authorization.ts
function isResetAuthorizedForContext(params) {
  const auth = resolveCommandAuthorization(params);
  if (!params.commandAuthorized && !auth.isAuthorizedSender) return false;
  const provider = params.ctx.Provider;
  if (
    !(provider ? isInternalMessageChannel(provider) : isInternalMessageChannel(params.ctx.Surface))
  )
    return true;
  const scopes = params.ctx.GatewayClientScopes;
  if (!Array.isArray(scopes) || scopes.length === 0) return true;
  return scopes.includes("operator.admin");
}
//#endregion
export { buildCommandContext as n, isResetAuthorizedForContext as t };
