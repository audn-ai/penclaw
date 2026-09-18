//#region src/infra/outbound/send-deps.d.ts
/**
 * Dynamic bag of per-channel send functions, keyed by channel ID.
 * Each outbound adapter resolves its own function from this record and
 * falls back to a direct import when the key is absent.
 */
type OutboundSendDeps = {
  [channelId: string]: unknown;
};
/**
 * Builds historical dependency keys for channel send functions.
 */
declare function resolveLegacyOutboundSendDepKeys(channelId: string): string[];
/**
 * Extra historical keys to try after the normalized channel-derived keys.
 */
type ResolveOutboundSendDepOptions = {
  legacyKeys?: readonly string[];
};
/**
 * Resolves a channel send dependency from modern channel IDs or legacy helper keys.
 */
declare function resolveOutboundSendDep<T>(
  deps: OutboundSendDeps | null | undefined,
  channelId: string,
  options?: ResolveOutboundSendDepOptions,
): T | undefined;
//#endregion
export {
  resolveOutboundSendDep as i,
  ResolveOutboundSendDepOptions as n,
  resolveLegacyOutboundSendDepKeys as r,
  OutboundSendDeps as t,
};
