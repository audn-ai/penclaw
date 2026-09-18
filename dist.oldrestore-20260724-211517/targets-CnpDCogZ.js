import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import "./src-Bl7G9qvi.js";
import { m as mapAllowFromEntries } from "./channel-config-helpers-BFvX3ldW.js";
import {
  r as resolveOutboundChannelPlugin,
  t as normalizeDeliverableOutboundChannel,
} from "./channel-resolution-B-NyvoRP.js";
import "./message-channel-constants-CvbXi0yz.js";
import { t as normalizeChatType } from "./chat-type-BARlA53h.js";
import {
  i as mergeDeliveryContext,
  n as deliveryContextFromSession,
} from "./delivery-context.shared-WPZGmi9R.js";
import "./message-channel-NQc9DJ6B.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-Be6uJOzO.js";
import { n as resolveOutboundSessionRoute } from "./outbound-session-D11Wm5tD.js";
import { n as isReservedTargetLiteralError } from "./target-errors-CZ0A80hz.js";
import { i as resolveChannelTarget } from "./target-resolver-BQojPYwH.js";
import {
  n as resolveOutboundTargetWithPlugin,
  t as resolveSessionDeliveryTarget,
} from "./targets-session-C5nmiRSl.js";
//#region src/infra/outbound/targets.ts
/** Resolves a user-supplied outbound destination through the channel plugin. */
function resolveOutboundTarget(params) {
  return (
    resolveOutboundTargetWithPlugin({
      plugin: resolveOutboundChannelPlugin({
        channel: params.channel,
        cfg: params.cfg,
        allowBootstrap: params.allowBootstrap,
      }),
      target: params,
      onMissingPlugin: () =>
        params.channel === "webchat"
          ? void 0
          : {
              ok: false,
              error: /* @__PURE__ */ new Error(`Unsupported channel: ${params.channel}`),
            },
    }) ?? {
      ok: false,
      error: /* @__PURE__ */ new Error(`Unsupported channel: ${params.channel}`),
    }
  );
}
/** Resolves the heartbeat delivery destination from config, session state, and turn source. */
function resolveHeartbeatDeliveryTarget(params) {
  const { cfg, entry } = params;
  const heartbeat = params.heartbeat ?? cfg.agents?.defaults?.heartbeat;
  const rawTarget = heartbeat?.target;
  let target = "none";
  let preparedExplicitPlugin;
  let preparedExplicitTo;
  if (rawTarget === "none" || rawTarget === "last") target = rawTarget;
  else if (typeof rawTarget === "string") {
    const normalized = normalizeDeliverableOutboundChannel(rawTarget);
    if (normalized) target = normalized;
    else {
      const explicitTo = heartbeat?.to?.trim();
      if (explicitTo) {
        preparedExplicitPlugin = resolveOutboundChannelPlugin({
          channel: rawTarget,
          cfg,
          allowBootstrap: true,
        });
        if (preparedExplicitPlugin) {
          target = preparedExplicitPlugin.id;
          preparedExplicitTo = explicitTo;
        }
      }
    }
  } else if (
    rawTarget === void 0 &&
    params.turnSource?.to &&
    params.turnSource.channel &&
    isDeliverableMessageChannel(params.turnSource.channel)
  )
    target = "last";
  if (target === "none") {
    const base = resolveSessionDeliveryTarget({ entry });
    return buildNoHeartbeatDeliveryTarget({
      reason: "target-none",
      lastChannel: base.lastChannel,
      lastAccountId: base.lastAccountId,
    });
  }
  const resolvedTurnSource =
    target === "last"
      ? mergeDeliveryContext(params.turnSource, deliveryContextFromSession(entry))
      : void 0;
  const resolvedTarget =
    preparedExplicitPlugin && preparedExplicitTo
      ? resolveSessionDeliveryTarget({
          entry,
          requestedChannel: target,
          explicitTo: preparedExplicitTo,
          mode: "heartbeat",
        })
      : resolveSessionDeliveryTarget({
          entry,
          requestedChannel: target === "last" ? "last" : target,
          explicitTo: heartbeat?.to,
          mode: "heartbeat",
          turnSourceChannel:
            resolvedTurnSource?.channel && isDeliverableMessageChannel(resolvedTurnSource.channel)
              ? resolvedTurnSource.channel
              : void 0,
          turnSourceTo: resolvedTurnSource?.to,
          turnSourceAccountId: resolvedTurnSource?.accountId,
          turnSourceThreadId: params.turnSource?.threadId,
        });
  const heartbeatAccountId = heartbeat?.accountId?.trim();
  let effectiveAccountId = heartbeatAccountId || resolvedTarget.accountId;
  if (!resolvedTarget.channel || !resolvedTarget.to)
    return buildNoHeartbeatDeliveryTarget({
      reason: "no-target",
      accountId: effectiveAccountId,
      lastChannel: resolvedTarget.lastChannel,
      lastAccountId: resolvedTarget.lastAccountId,
    });
  const plugin =
    preparedExplicitPlugin ??
    resolveOutboundChannelPlugin({
      channel: resolvedTarget.channel,
      cfg,
      allowBootstrap: true,
    });
  if (heartbeatAccountId) {
    const listAccountIds = plugin?.config.listAccountIds;
    const accountIds = listAccountIds ? listAccountIds(cfg) : [];
    if (accountIds.length > 0) {
      const normalizedAccountId = normalizeAccountId(heartbeatAccountId);
      if (
        !new Set(accountIds.map((accountId) => normalizeAccountId(accountId))).has(
          normalizedAccountId,
        )
      )
        return buildNoHeartbeatDeliveryTarget({
          reason: "unknown-account",
          accountId: normalizedAccountId,
          lastChannel: resolvedTarget.lastChannel,
          lastAccountId: resolvedTarget.lastAccountId,
        });
      effectiveAccountId = normalizedAccountId;
    }
  }
  const resolved = resolveOutboundTargetWithPlugin({
    plugin,
    target: {
      channel: resolvedTarget.channel,
      to: resolvedTarget.to,
      cfg,
      accountId: effectiveAccountId,
      mode: "heartbeat",
    },
  });
  if (!resolved?.ok)
    return buildNoHeartbeatDeliveryTarget({
      reason: "no-target",
      accountId: effectiveAccountId,
      lastChannel: resolvedTarget.lastChannel,
      lastAccountId: resolvedTarget.lastAccountId,
    });
  const sessionChatTypeHint =
    target === "last" && !heartbeat?.to ? normalizeChatType(entry?.chatType) : void 0;
  const deliveryChatType = resolveHeartbeatDeliveryChatType({
    channel: resolvedTarget.channel,
    to: resolved.to,
    sessionChatType: sessionChatTypeHint,
    plugin,
  });
  if (deliveryChatType === "direct" && heartbeat?.directPolicy === "block")
    return buildNoHeartbeatDeliveryTarget({
      reason: "dm-blocked",
      accountId: effectiveAccountId,
      lastChannel: resolvedTarget.lastChannel,
      lastAccountId: resolvedTarget.lastAccountId,
    });
  let reason;
  if (plugin?.config.resolveAllowFrom) {
    const explicit = resolveOutboundTargetWithPlugin({
      plugin,
      target: {
        channel: resolvedTarget.channel,
        to: resolvedTarget.to,
        cfg,
        accountId: effectiveAccountId,
        mode: "explicit",
      },
    });
    if (explicit?.ok && explicit.to !== resolved.to) reason = "allowFrom-fallback";
  }
  const inheritedHeartbeatThreadId = shouldReuseHeartbeatRouteThreadId({
    cfg,
    target,
    heartbeat,
    turnSource: params.turnSource,
    entry,
    resolvedTarget,
    plugin,
  })
    ? resolvedTarget.lastThreadId
    : void 0;
  return {
    channel: resolvedTarget.channel,
    to: resolved.to,
    chatType: deliveryChatType,
    reason,
    accountId: effectiveAccountId,
    threadId: resolvedTarget.threadId ?? inheritedHeartbeatThreadId,
    lastChannel: resolvedTarget.lastChannel,
    lastAccountId: resolvedTarget.lastAccountId,
  };
}
function buildNoHeartbeatDeliveryTarget(params) {
  return {
    channel: "none",
    reason: params.reason,
    accountId: params.accountId,
    lastChannel: params.lastChannel,
    lastAccountId: params.lastAccountId,
  };
}
/** Resolves heartbeat delivery and lets plugins refine the outbound session route. */
async function resolveHeartbeatDeliveryTargetWithSessionRoute(params) {
  const delivery = resolveHeartbeatDeliveryTarget(params);
  const heartbeat = params.heartbeat ?? params.cfg.agents?.defaults?.heartbeat;
  if (delivery.channel === "none" || !delivery.to) return delivery;
  const deliveryTo = delivery.to;
  const plugin = resolveOutboundChannelPlugin({
    channel: delivery.channel,
    cfg: params.cfg,
    allowBootstrap: true,
  });
  const resolveSessionRoute = plugin?.messaging?.resolveOutboundSessionRoute;
  if (!resolveSessionRoute && !plugin?.messaging?.targetResolver) return delivery;
  let routeResolvedTarget;
  const targetResolution = await (async () => {
    try {
      return await resolveChannelTarget({
        cfg: params.cfg,
        channel: delivery.channel,
        input: deliveryTo,
        accountId: delivery.accountId,
        unknownTargetMode: "normalized",
        plugin,
      });
    } catch {
      return null;
    }
  })();
  if (targetResolution?.ok) routeResolvedTarget = targetResolution.target;
  else if (targetResolution && isReservedTargetLiteralError(targetResolution.error))
    return buildNoHeartbeatDeliveryTarget({
      reason: "no-target",
      accountId: delivery.accountId,
      lastChannel: delivery.lastChannel,
      lastAccountId: delivery.lastAccountId,
    });
  if (routeResolvedTarget?.kind === "user" && heartbeat?.directPolicy === "block")
    return buildNoHeartbeatDeliveryTarget({
      reason: "dm-blocked",
      accountId: delivery.accountId,
      lastChannel: delivery.lastChannel,
      lastAccountId: delivery.lastAccountId,
    });
  if (!resolveSessionRoute) return delivery;
  const route = await (async () => {
    try {
      return await resolveOutboundSessionRoute({
        cfg: params.cfg,
        channel: delivery.channel,
        plugin,
        agentId: params.agentId,
        accountId: delivery.accountId,
        target: routeResolvedTarget?.to ?? deliveryTo,
        resolvedTarget: routeResolvedTarget,
        currentSessionKey: params.currentSessionKey,
        threadId: delivery.threadId,
      });
    } catch {
      return null;
    }
  })();
  if (!route) return delivery;
  if (route.chatType === "direct" && heartbeat?.directPolicy === "block")
    return buildNoHeartbeatDeliveryTarget({
      reason: "dm-blocked",
      accountId: delivery.accountId,
      lastChannel: delivery.lastChannel,
      lastAccountId: delivery.lastAccountId,
    });
  return {
    ...delivery,
    to: route.to,
    chatType: route.chatType,
    threadId: route.threadId ?? delivery.threadId,
  };
}
function inferChatTypeFromTarget(params) {
  const to = params.to.trim();
  if (!to) return;
  if (/^user:/i.test(to)) return "direct";
  if (/^(channel:|thread:)/i.test(to)) return "channel";
  if (/^group:/i.test(to)) return "group";
  return (
    (
      params.plugin ?? resolveOutboundChannelPlugin({ channel: params.channel })
    )?.messaging?.inferTargetChatType?.({ to }) ?? void 0
  );
}
function resolveHeartbeatDeliveryChatType(params) {
  if (params.sessionChatType) return params.sessionChatType;
  return inferChatTypeFromTarget({
    channel: params.channel,
    to: params.to,
    plugin: params.plugin,
  });
}
function shouldReuseHeartbeatRouteThreadId(params) {
  const channel = params.resolvedTarget.channel;
  return (
    (params.plugin
      ? params.plugin.messaging
      : channel &&
        resolveOutboundChannelPlugin({
          channel,
          cfg: params.cfg,
        })?.messaging
    )?.preserveHeartbeatThreadIdForGroupRoute === true &&
    params.resolvedTarget.threadId == null &&
    params.target === "last" &&
    !params.heartbeat?.to &&
    params.turnSource?.threadId == null &&
    params.resolvedTarget.channel === params.resolvedTarget.lastChannel &&
    Boolean(params.resolvedTarget.to) &&
    Boolean(params.resolvedTarget.lastTo) &&
    params.resolvedTarget.to === params.resolvedTarget.lastTo &&
    normalizeChatType(params.entry?.chatType) === "group"
  );
}
function resolveHeartbeatSenderId(params) {
  const { allowFrom, deliveryTo, lastTo, provider } = params;
  const candidates = [
    deliveryTo?.trim(),
    provider && deliveryTo ? `${provider}:${deliveryTo}` : void 0,
    lastTo?.trim(),
    provider && lastTo ? `${provider}:${lastTo}` : void 0,
  ].filter((val) => Boolean(val?.trim()));
  const allowList = mapAllowFromEntries(allowFrom).filter((entry) => entry && entry !== "*");
  if (allowFrom.includes("*")) return candidates[0] ?? "heartbeat";
  if (candidates.length > 0 && allowList.length > 0) {
    const matched = candidates.find((candidate) => allowList.includes(candidate));
    if (matched) return matched;
  }
  if (candidates.length > 0 && allowList.length === 0) return candidates[0];
  if (allowList.length > 0) return allowList[0];
  return candidates[0] ?? "heartbeat";
}
/** Resolves the sender id/allow-list context used for heartbeat sends. */
function resolveHeartbeatSenderContext(params) {
  const provider =
    params.delivery.channel !== "none" ? params.delivery.channel : params.delivery.lastChannel;
  const accountId =
    params.delivery.accountId ??
    (provider === params.delivery.lastChannel ? params.delivery.lastAccountId : void 0);
  const allowFrom = mapAllowFromEntries(
    provider
      ? (resolveOutboundChannelPlugin({
          channel: provider,
          cfg: params.cfg,
        })?.config.resolveAllowFrom?.({
          cfg: params.cfg,
          accountId,
        }) ?? [])
      : [],
  );
  return {
    sender: expectDefined(
      resolveHeartbeatSenderId({
        allowFrom,
        deliveryTo: params.delivery.to,
        lastTo: params.entry?.lastTo,
        provider,
      }),
      "resolved sender",
    ),
    provider,
    allowFrom,
  };
}
//#endregion
export {
  resolveOutboundTarget as i,
  resolveHeartbeatDeliveryTargetWithSessionRoute as n,
  resolveHeartbeatSenderContext as r,
  resolveHeartbeatDeliveryTarget as t,
};
