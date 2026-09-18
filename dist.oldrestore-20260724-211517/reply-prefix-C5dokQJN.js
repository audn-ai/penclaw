import {
  n as resolveAgentIdentity,
  r as resolveEffectiveMessagesConfig,
} from "./identity-CceraXdn.js";
import { t as extractShortModelName } from "./response-prefix-template-DdRpfl7D.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/channels/reply-prefix.ts
/**
 * Creates response-prefix options and a live context provider for the selected model.
 */
function createReplyPrefixContext(params) {
  const { cfg, agentId } = params;
  const prefixContext = {
    identityName: normalizeOptionalString(resolveAgentIdentity(cfg, agentId)?.name),
  };
  const onModelSelected = (ctx) => {
    prefixContext.provider = ctx.provider;
    prefixContext.model = extractShortModelName(ctx.model);
    prefixContext.modelFull = `${ctx.provider}/${ctx.model}`;
    prefixContext.thinkingLevel = ctx.thinkLevel ?? "off";
  };
  return {
    prefixContext,
    responsePrefix: resolveEffectiveMessagesConfig(cfg, agentId, {
      channel: params.channel,
      accountId: params.accountId,
    }).responsePrefix,
    responsePrefixContextProvider: () => prefixContext,
    onModelSelected,
  };
}
/**
 * Creates the reply-prefix options object expected by `getReply` call sites.
 */
function createReplyPrefixOptions(params) {
  const { responsePrefix, responsePrefixContextProvider, onModelSelected } =
    createReplyPrefixContext(params);
  return {
    responsePrefix,
    responsePrefixContextProvider,
    onModelSelected,
  };
}
//#endregion
export { createReplyPrefixOptions as n, createReplyPrefixContext as t };
