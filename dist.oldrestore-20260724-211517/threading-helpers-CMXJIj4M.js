//#region src/channels/plugins/threading-helpers.ts
/**
 * Creates a reply-to-mode resolver that always returns one mode.
 */
function createStaticReplyToModeResolver(mode) {
  return () => mode;
}
/**
 * Creates a resolver that reads reply-to mode from top-level channel config.
 */
function createTopLevelChannelReplyToModeResolver(channelId) {
  return ({ cfg }) => {
    return cfg.channels?.[channelId]?.replyToMode ?? "off";
  };
}
/**
 * Creates a resolver that reads reply-to mode from account-scoped config.
 */
function createScopedAccountReplyToModeResolver(params) {
  return ({ cfg, accountId, chatType }) =>
    params.resolveReplyToMode(params.resolveAccount(cfg, accountId), chatType) ??
    params.fallback ??
    "off";
}
//#endregion
export {
  createStaticReplyToModeResolver as n,
  createTopLevelChannelReplyToModeResolver as r,
  createScopedAccountReplyToModeResolver as t,
};
