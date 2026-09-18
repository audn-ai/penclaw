import { r as normalizeOptionalAccountId } from "./account-id-C7N4Rwku.js";
import {
  a as channelRouteTarget,
  c as channelRouteThreadId,
  d as normalizeChannelRouteRef,
  f as normalizeChannelRouteTarget,
  t as channelRouteCompactKey,
} from "./channel-route-u-lrE52s.js";
import { r as isInternalNonDeliveryChannel } from "./message-channel-constants-CvbXi0yz.js";
import {
  n as normalizeMessageChannel,
  t as isDeliverableMessageChannel,
} from "./message-channel-core-CgTCmAZC.js";
//#region src/utils/account-id.ts
/**
 * Compatibility wrapper for account-id normalization.
 *
 * Runtime code imports this utility when it needs the older utils path while
 * the canonical normalization logic lives in routing/account-id.
 */
/** Normalize an optional account id, returning undefined for blank/invalid input. */
function normalizeAccountId(value) {
  return normalizeOptionalAccountId(value);
}
//#endregion
//#region src/utils/delivery-context.shared.ts
/**
 * Delivery-context normalization and projection helpers.
 *
 * Sessions still carry route metadata plus older `last*` fields; this module
 * keeps those shapes converged on the canonical SDK channel-route contract.
 */
/** Normalizes a delivery context into canonical channel route fields, dropping invalid routes. */
function normalizeDeliveryContext(context) {
  if (!context) return;
  const route = normalizeChannelRouteTarget({
    channel:
      typeof context.channel === "string"
        ? (normalizeMessageChannel(context.channel) ?? context.channel.trim())
        : void 0,
    to: context.to,
    accountId: context.accountId,
    threadId: context.threadId,
  });
  if (!route) return;
  const normalized = {
    channel: route.channel,
    to: channelRouteTarget(route),
    accountId: normalizeAccountId(route.accountId),
  };
  const threadId = channelRouteThreadId(route);
  if (threadId != null) normalized.threadId = threadId;
  return normalized;
}
/** Normalizes an unknown channel route payload from persisted session/plugin metadata. */
function normalizeDeliveryChannelRoute(route) {
  if (!route || typeof route !== "object" || Array.isArray(route)) return;
  const candidate = route;
  return normalizeChannelRouteRef({
    channel: candidate.channel,
    to: candidate.target?.to,
    rawTo: candidate.target?.rawTo,
    chatType: candidate.target?.chatType,
    accountId: candidate.accountId,
    threadId: candidate.thread?.id,
    threadKind: candidate.thread?.kind,
    threadSource: candidate.thread?.source,
  });
}
/** Converts a normalized channel route reference into a delivery context. */
function deliveryContextFromChannelRoute(route) {
  const normalized = normalizeDeliveryChannelRoute(route);
  return normalizeDeliveryContext({
    channel: normalized?.channel,
    to: channelRouteTarget(normalized),
    accountId: normalized?.accountId,
    threadId: channelRouteThreadId(normalized),
  });
}
/** Converts delivery context fields into the SDK channel route reference shape. */
function channelRouteFromDeliveryContext(context) {
  return normalizeChannelRouteTarget(normalizeDeliveryContext(context));
}
function mergeRouteMetadataWithDeliveryContext(route, context) {
  if (!route) return channelRouteFromDeliveryContext(context);
  return normalizeChannelRouteRef({
    channel: route.channel ?? context.channel,
    to: route.target?.to ?? context.to,
    rawTo: route.target?.rawTo,
    chatType: route.target?.chatType,
    accountId: route.accountId ?? context.accountId,
    threadId: route.thread?.id ?? context.threadId,
    threadKind: route.thread?.kind,
    threadSource: route.thread?.source,
  });
}
function isInternalRouteContext(context) {
  const channel = context?.channel;
  return Boolean(channel && (channel === "webchat" || isInternalNonDeliveryChannel(channel)));
}
function hasExternalDeliveryTarget(context) {
  const channel = normalizeMessageChannel(context?.channel);
  return Boolean(
    channel &&
    !isInternalNonDeliveryChannel(channel) &&
    isDeliverableMessageChannel(channel) &&
    context?.to,
  );
}
function mergeExternalDeliveryContextOverInternalRoute(deliveryContext, internalContext) {
  return normalizeDeliveryContext({
    channel: deliveryContext?.channel,
    to: deliveryContext?.to,
    accountId: deliveryContext?.accountId ?? internalContext?.accountId,
    threadId: deliveryContext?.threadId ?? internalContext?.threadId,
  });
}
/** Reconciles legacy session delivery fields, route metadata, and explicit delivery context. */
function normalizeSessionDeliveryFields(source) {
  if (!source)
    return {
      route: void 0,
      deliveryContext: void 0,
      lastChannel: void 0,
      lastTo: void 0,
      lastAccountId: void 0,
      lastThreadId: void 0,
    };
  const normalizedRoute = normalizeDeliveryChannelRoute(source.route);
  const routeContext = deliveryContextFromChannelRoute(normalizedRoute);
  const legacyContext = normalizeDeliveryContext({
    channel: source.lastChannel ?? source.channel,
    to: source.lastTo,
    accountId: source.lastAccountId,
    threadId: source.lastThreadId,
  });
  const deliveryContext = normalizeDeliveryContext(source.deliveryContext);
  const sessionContext =
    isInternalRouteContext(legacyContext) && hasExternalDeliveryTarget(deliveryContext)
      ? mergeExternalDeliveryContextOverInternalRoute(deliveryContext, legacyContext)
      : mergeDeliveryContext(legacyContext, deliveryContext);
  const routeInternalContext = mergeDeliveryContext(routeContext, legacyContext);
  const routeIsInternalFallback =
    isInternalRouteContext(routeContext) && hasExternalDeliveryTarget(deliveryContext);
  const merged = routeIsInternalFallback
    ? mergeExternalDeliveryContextOverInternalRoute(deliveryContext, routeInternalContext)
    : mergeDeliveryContext(routeContext, sessionContext);
  if (!merged)
    return {
      route: void 0,
      deliveryContext: void 0,
      lastChannel: void 0,
      lastTo: void 0,
      lastAccountId: void 0,
      lastThreadId: void 0,
    };
  return {
    route: mergeRouteMetadataWithDeliveryContext(
      routeIsInternalFallback ? void 0 : normalizedRoute,
      merged,
    ),
    deliveryContext: merged,
    lastChannel: merged.channel,
    lastTo: merged.to,
    lastAccountId: merged.accountId,
    lastThreadId: merged.threadId,
  };
}
/** Derives the best delivery context from current and legacy session fields. */
function deliveryContextFromSession(entry) {
  if (!entry) return;
  return normalizeSessionDeliveryFields({
    route: entry.route,
    channel: entry.channel ?? entry.origin?.provider,
    lastChannel: entry.lastChannel,
    lastTo: entry.lastTo,
    lastAccountId: entry.lastAccountId ?? entry.origin?.accountId,
    lastThreadId: entry.lastThreadId ?? entry.deliveryContext?.threadId ?? entry.origin?.threadId,
    origin: entry.origin,
    deliveryContext: entry.deliveryContext,
  }).deliveryContext;
}
/** Merges delivery contexts without mixing target/account/thread fields across route owners. */
function mergeDeliveryContext(primary, fallback) {
  const normalizedPrimary = normalizeDeliveryContext(primary);
  const normalizedFallback = normalizeDeliveryContext(fallback);
  if (!normalizedPrimary && !normalizedFallback) return;
  const channelsConflict =
    normalizedPrimary?.channel &&
    normalizedFallback?.channel &&
    normalizedPrimary.channel !== normalizedFallback.channel;
  const accountsConflict =
    normalizedPrimary?.accountId &&
    normalizedFallback?.accountId &&
    normalizedPrimary.accountId !== normalizedFallback.accountId;
  const routesConflict = channelsConflict || accountsConflict;
  return normalizeDeliveryContext({
    channel: accountsConflict
      ? normalizedPrimary?.channel
      : (normalizedPrimary?.channel ?? normalizedFallback?.channel),
    to: routesConflict ? normalizedPrimary?.to : (normalizedPrimary?.to ?? normalizedFallback?.to),
    accountId: routesConflict
      ? normalizedPrimary?.accountId
      : (normalizedPrimary?.accountId ?? normalizedFallback?.accountId),
    threadId: routesConflict
      ? normalizedPrimary?.threadId
      : (normalizedPrimary?.threadId ?? normalizedFallback?.threadId),
  });
}
/** Builds a compact stable key for a routable delivery context. */
function deliveryContextKey(context) {
  return channelRouteCompactKey(normalizeDeliveryContext(context));
}
//#endregion
export {
  normalizeDeliveryChannelRoute as a,
  normalizeAccountId as c,
  mergeDeliveryContext as i,
  deliveryContextFromSession as n,
  normalizeDeliveryContext as o,
  deliveryContextKey as r,
  normalizeSessionDeliveryFields as s,
  deliveryContextFromChannelRoute as t,
};
