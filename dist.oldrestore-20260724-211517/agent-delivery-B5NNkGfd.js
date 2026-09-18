import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { o as normalizeRouteBindingChannelId } from "./bindings-chzymeI6.js";
import { i as listRouteBindings } from "./bindings-CI-O7TMQ.js";
import { r as resolveOutboundChannelPlugin } from "./channel-resolution-B-NyvoRP.js";
import { c as normalizeAccountId } from "./delivery-context.shared-WPZGmi9R.js";
import { i as resolveChannelDefaultAccountId } from "./helpers-BzNF0htn.js";
import "./message-channel-NQc9DJ6B.js";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-CvbXi0yz.js";
import {
  i as normalizeMessageChannel,
  n as isGatewayMessageChannel,
  t as isDeliverableMessageChannel,
} from "./message-channel-normalize-Be6uJOzO.js";
import { n as resolveOutboundSessionRoute } from "./outbound-session-D11Wm5tD.js";
import { i as resolveAgentRoute } from "./resolve-route-oiOq6bK9.js";
import { i as buildAgentMainSessionKey } from "./session-key-druuY-GG.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { n as isReservedTargetLiteralError } from "./target-errors-CZ0A80hz.js";
import { i as resolveChannelTarget } from "./target-resolver-BQojPYwH.js";
import { i as resolveOutboundTarget } from "./targets-CnpDCogZ.js";
import { t as resolveSessionDeliveryTarget } from "./targets-session-C5nmiRSl.js";
//#region src/infra/outbound/agent-delivery.ts
function rebaseOutboundSessionRoute(route, baseSessionKey) {
  if (route.baseSessionKey === baseSessionKey) return route;
  if (route.sessionKey === route.baseSessionKey)
    return {
      ...route,
      sessionKey: baseSessionKey,
      baseSessionKey,
    };
  const basePrefix = `${route.baseSessionKey}:`;
  if (!route.sessionKey.startsWith(basePrefix)) return null;
  return {
    ...route,
    sessionKey: `${baseSessionKey}:${route.sessionKey.slice(basePrefix.length)}`,
    baseSessionKey,
  };
}
function resolveAgentDeliveryPlan(params) {
  const requestedRaw = normalizeOptionalString(params.requestedChannel) ?? "";
  const requestedChannel =
    (requestedRaw ? normalizeMessageChannel(requestedRaw) : void 0) || "last";
  const explicitTo = normalizeOptionalString(params.explicitTo) ?? void 0;
  const normalizedTurnSource = params.turnSourceChannel
    ? normalizeMessageChannel(params.turnSourceChannel)
    : void 0;
  const turnSourceChannel =
    normalizedTurnSource && isDeliverableMessageChannel(normalizedTurnSource)
      ? normalizedTurnSource
      : void 0;
  const turnSourceTo = normalizeOptionalString(params.turnSourceTo) ?? void 0;
  const turnSourceAccountId = normalizeAccountId(params.turnSourceAccountId);
  const turnSourceThreadId =
    params.turnSourceThreadId != null && params.turnSourceThreadId !== ""
      ? params.turnSourceThreadId
      : void 0;
  const baseDelivery = resolveSessionDeliveryTarget({
    entry: params.sessionEntry,
    requestedChannel: requestedChannel === "webchat" ? "last" : requestedChannel,
    explicitTo,
    explicitThreadId: params.explicitThreadId,
    turnSourceChannel,
    turnSourceTo,
    turnSourceAccountId,
    turnSourceThreadId,
  });
  const resolvedChannel = (() => {
    if (requestedChannel === "webchat") return INTERNAL_MESSAGE_CHANNEL;
    if (requestedChannel === "last") {
      if (baseDelivery.channel && baseDelivery.channel !== "webchat") return baseDelivery.channel;
      return INTERNAL_MESSAGE_CHANNEL;
    }
    if (isGatewayMessageChannel(requestedChannel)) return requestedChannel;
    if (baseDelivery.channel && baseDelivery.channel !== "webchat") return baseDelivery.channel;
    return INTERNAL_MESSAGE_CHANNEL;
  })();
  const deliveryTargetMode = explicitTo
    ? "explicit"
    : isDeliverableMessageChannel(resolvedChannel)
      ? "implicit"
      : void 0;
  const resolvedAccountId =
    normalizeAccountId(params.accountId) ??
    (deliveryTargetMode === "implicit" ? baseDelivery.accountId : void 0);
  let resolvedTo = explicitTo;
  if (
    !resolvedTo &&
    isDeliverableMessageChannel(resolvedChannel) &&
    resolvedChannel === baseDelivery.lastChannel
  )
    resolvedTo = baseDelivery.lastTo;
  return {
    baseDelivery,
    resolvedChannel,
    resolvedTo,
    resolvedAccountId,
    resolvedThreadId: baseDelivery.threadId,
    deliveryTargetMode,
  };
}
async function resolveAgentDeliveryPlanWithSessionRoute(params) {
  const plan = resolveAgentDeliveryPlan(params);
  const { resolvedChannel, resolvedTo } = plan;
  if (!params.wantsDelivery || !resolvedTo || !isDeliverableMessageChannel(resolvedChannel))
    return plan;
  const plugin = resolveOutboundChannelPlugin({
    channel: resolvedChannel,
    cfg: params.cfg,
    allowBootstrap: true,
  });
  const hasPluginSessionRoute = Boolean(plugin?.messaging?.resolveOutboundSessionRoute);
  if (!hasPluginSessionRoute && params.sessionRouteMode !== "allow-fallback") return plan;
  const resolvedAccountId =
    plan.resolvedAccountId ??
    (plugin && params.sessionRouteMode === "allow-fallback"
      ? resolveChannelDefaultAccountId({
          plugin,
          cfg: params.cfg,
        })
      : void 0);
  const routedPlan =
    resolvedAccountId === plan.resolvedAccountId
      ? plan
      : {
          ...plan,
          resolvedAccountId,
        };
  const normalizedTarget = resolveOutboundTarget({
    channel: resolvedChannel,
    to: resolvedTo,
    cfg: params.cfg,
    accountId: routedPlan.resolvedAccountId,
    mode: routedPlan.deliveryTargetMode ?? "explicit",
  });
  let sessionRouteTarget;
  let resolvedSessionRouteTarget;
  if (normalizedTarget.ok) sessionRouteTarget = normalizedTarget.to;
  else {
    if (!isReservedTargetLiteralError(normalizedTarget.error))
      return {
        ...routedPlan,
        targetResolutionError: normalizedTarget.error,
      };
    const resolvedTarget = await resolveChannelTarget({
      cfg: params.cfg,
      channel: resolvedChannel,
      input: resolvedTo,
      accountId: routedPlan.resolvedAccountId,
      unknownTargetMode: "normalized",
      plugin,
    });
    if (!resolvedTarget.ok)
      return {
        ...routedPlan,
        targetResolutionError: resolvedTarget.error,
      };
    sessionRouteTarget = resolvedTarget.target.to;
    resolvedSessionRouteTarget = resolvedTarget.target;
  }
  const explicitThreadId =
    params.explicitThreadId != null && params.explicitThreadId !== ""
      ? params.explicitThreadId
      : void 0;
  const route = await (async () => {
    try {
      return await resolveOutboundSessionRoute({
        cfg: params.cfg,
        channel: resolvedChannel,
        plugin,
        agentId: params.agentId,
        accountId: routedPlan.resolvedAccountId,
        target: sessionRouteTarget,
        ...(resolvedSessionRouteTarget ? { resolvedTarget: resolvedSessionRouteTarget } : {}),
        currentSessionKey: params.currentSessionKey,
        threadId:
          routedPlan.deliveryTargetMode === "explicit"
            ? explicitThreadId
            : routedPlan.resolvedThreadId,
      });
    } catch {
      return null;
    }
  })();
  const globalDmScope = params.cfg.session?.dmScope ?? "main";
  const bindingRoute =
    route?.recipientSessionExact === true &&
    route.chatType === "direct" &&
    route.peer.kind === "direct"
      ? resolveAgentRoute({
          cfg: params.cfg,
          channel: resolvedChannel,
          accountId: routedPlan.resolvedAccountId,
          peer: route.peer,
        })
      : null;
  const bindingAwareRoute =
    route &&
    bindingRoute?.dmScope !== void 0 &&
    bindingRoute.dmScope !== globalDmScope &&
    normalizeAgentId(bindingRoute.agentId) === normalizeAgentId(params.agentId)
      ? rebaseOutboundSessionRoute(route, bindingRoute.sessionKey)
      : route;
  const knownNonExactRoute =
    params.sessionRouteMode === "allow-fallback" &&
    (bindingAwareRoute?.recipientSessionExact === false ||
      bindingAwareRoute?.recipientSessionExact === "direct-alias");
  const canonicalMainSessionKey = buildAgentMainSessionKey({
    agentId: params.agentId,
    mainKey: params.cfg.session?.mainKey,
  });
  const usesCanonicalMainSession =
    bindingAwareRoute?.recipientSessionExact === "direct-alias" &&
    bindingAwareRoute.chatType === "direct" &&
    bindingAwareRoute.sessionKey === bindingAwareRoute.baseSessionKey &&
    bindingAwareRoute.sessionKey === canonicalMainSessionKey &&
    globalDmScope === "main" &&
    !listRouteBindings(params.cfg).some(
      (binding) =>
        binding.session?.dmScope !== void 0 &&
        binding.session.dmScope !== "main" &&
        normalizeRouteBindingChannelId(binding.match.channel) === resolvedChannel,
    );
  const usesIsolatedDeliveryIdentity =
    bindingAwareRoute?.recipientSessionExact === "delivery-identity" &&
    bindingAwareRoute.baseSessionKey !== canonicalMainSessionKey &&
    bindingAwareRoute.baseSessionKey.startsWith(
      `agent:${normalizeAgentId(params.agentId)}:${resolvedChannel}:`,
    ) &&
    (bindingAwareRoute.sessionKey === bindingAwareRoute.baseSessionKey ||
      bindingAwareRoute.sessionKey.startsWith(`${bindingAwareRoute.baseSessionKey}:`));
  const selectedRoute =
    bindingAwareRoute &&
    (bindingAwareRoute.recipientSessionExact === "delivery-identity"
      ? usesIsolatedDeliveryIdentity
      : !knownNonExactRoute || usesCanonicalMainSession)
      ? bindingAwareRoute
      : null;
  if (!selectedRoute) {
    if (resolvedSessionRouteTarget)
      return {
        ...routedPlan,
        resolvedTo: resolvedSessionRouteTarget.to,
        resolvedThreadId:
          routedPlan.deliveryTargetMode === "explicit"
            ? explicitThreadId
            : routedPlan.resolvedThreadId,
      };
    return routedPlan;
  }
  return {
    ...routedPlan,
    resolvedSessionKey: selectedRoute.sessionKey,
    resolvedTo: hasPluginSessionRoute
      ? selectedRoute.to
      : (resolvedSessionRouteTarget?.to ?? sessionRouteTarget),
    resolvedThreadId:
      selectedRoute.threadId ??
      (routedPlan.deliveryTargetMode === "explicit"
        ? explicitThreadId
        : routedPlan.resolvedThreadId),
  };
}
/** Resolves an explicit recipient into its canonical or stable provider-owned session. */
async function resolveAgentExplicitRecipientSession(params) {
  const plan = await resolveAgentDeliveryPlanWithSessionRoute({
    cfg: params.cfg,
    agentId: params.agentId,
    requestedChannel: params.channel,
    explicitTo: params.to,
    explicitThreadId: params.threadId,
    accountId: params.accountId,
    wantsDelivery: true,
    sessionRouteMode: "allow-fallback",
  });
  if (!plan.resolvedSessionKey && !plan.targetResolutionError)
    return {
      error: /* @__PURE__ */ new Error(
        `Unable to resolve a session route for channel "${params.channel}"`,
      ),
    };
  return {
    sessionKey: plan.resolvedSessionKey,
    channel: plan.resolvedChannel,
    to: plan.resolvedTo,
    accountId: plan.resolvedAccountId,
    threadId: plan.resolvedThreadId,
    error: plan.targetResolutionError,
  };
}
function resolveAgentOutboundTarget(params) {
  const targetMode =
    params.targetMode ??
    params.plan.deliveryTargetMode ??
    (params.plan.resolvedTo ? "explicit" : "implicit");
  if (params.plan.targetResolutionError)
    return {
      resolvedTarget: {
        ok: false,
        error: params.plan.targetResolutionError,
      },
      resolvedTo: void 0,
      targetMode,
    };
  if (!isDeliverableMessageChannel(params.plan.resolvedChannel))
    return {
      resolvedTarget: null,
      resolvedTo: params.plan.resolvedTo,
      targetMode,
    };
  if (params.validateExplicitTarget !== true && params.plan.resolvedTo)
    return {
      resolvedTarget: null,
      resolvedTo: params.plan.resolvedTo,
      targetMode,
    };
  const resolvedTarget = resolveOutboundTarget({
    channel: params.plan.resolvedChannel,
    to: params.plan.resolvedTo,
    cfg: params.cfg,
    accountId: params.plan.resolvedAccountId,
    mode: targetMode,
  });
  return {
    resolvedTarget,
    resolvedTo: resolvedTarget.ok ? resolvedTarget.to : params.plan.resolvedTo,
    targetMode,
  };
}
//#endregion
export {
  resolveAgentOutboundTarget as i,
  resolveAgentDeliveryPlanWithSessionRoute as n,
  resolveAgentExplicitRecipientSession as r,
  resolveAgentDeliveryPlan as t,
};
