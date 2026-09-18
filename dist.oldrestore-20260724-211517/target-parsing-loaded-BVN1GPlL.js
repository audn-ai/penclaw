import { r as getLoadedChannelPluginForRead } from "./registry-loaded-D8eZo-vR.js";
import { a as normalizeChannelId, t as getChannelPlugin } from "./registry-mc8oBRx8.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  u as normalizeOptionalThreadValue,
} from "./string-coerce-DW4mBlAt.js";
import "./plugins-BKdf-5tW.js";
//#region src/channels/plugins/target-parsing-loaded.ts
/**
 * Loaded-channel target parsing helpers.
 *
 * Bridges deprecated explicit target parsing with modern channel route target helpers.
 */
function resolveCompatParsedRouteTarget(params) {
  const channel = normalizeLowercaseStringOrEmpty(params.channel);
  const rawTo = normalizeOptionalString(params.rawTarget);
  if (!channel || !rawTo) return null;
  const parsed = params.parseTarget(channel, rawTo);
  const fallbackThreadId = normalizeOptionalThreadValue(params.fallbackThreadId);
  return {
    channel,
    rawTo,
    to: parsed?.to ?? rawTo,
    threadId: normalizeOptionalThreadValue(parsed?.threadId ?? fallbackThreadId),
    chatType: parsed?.chatType,
  };
}
/** @deprecated Use `messaging.targetResolver` and `messaging.resolveOutboundSessionRoute`. */
function parseExplicitTargetForLoadedChannel(channel, rawTarget) {
  const resolvedChannel = normalizeOptionalString(channel);
  if (!resolvedChannel) return null;
  const normalizedChannel = normalizeChannelId(resolvedChannel) ?? resolvedChannel;
  return (
    getLoadedChannelPluginForRead(normalizedChannel)?.messaging?.parseExplicitTarget?.({
      raw: rawTarget,
    }) ??
    getChannelPlugin(normalizedChannel)?.messaging?.parseExplicitTarget?.({ raw: rawTarget }) ??
    null
  );
}
/** @deprecated Use `messaging.resolveOutboundSessionRoute` for provider-specific target grammar. */
function resolveRouteTargetForLoadedChannel(params) {
  return resolveCompatParsedRouteTarget({
    ...params,
    parseTarget: parseExplicitTargetForLoadedChannel,
  });
}
function resolveExplicitDeliveryTargetCompat(params) {
  return resolveRouteTargetForLoadedChannel(params);
}
//#endregion
export { resolveExplicitDeliveryTargetCompat as t };
