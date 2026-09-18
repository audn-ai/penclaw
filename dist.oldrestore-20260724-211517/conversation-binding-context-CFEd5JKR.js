import { h as stringifyRouteThreadId } from "./channel-route-u-lrE52s.js";
import {
  i as stripTargetTopicSuffix,
  n as stripTargetKindPrefix,
  r as stripTargetProviderPrefix,
  t as resolveTargetPrefixedChannel,
} from "./channel-target-prefix-Co3r_2wp.js";
import "./registry-xXjI-8UE.js";
import { a as normalizeChannelId, n as getLoadedChannelPlugin } from "./registry-mc8oBRx8.js";
import { t as normalizeAnyChannelId } from "./registry-normalize-CWirNxxC.js";
import { n as getActivePluginChannelRegistry } from "./runtime-CcYnX0B4.js";
import "./plugins-BKdf-5tW.js";
import { r as normalizeConversationTargetRef } from "./session-binding-normalization-sQL-8bRz.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { t as resolveExplicitDeliveryTargetCompat } from "./target-parsing-loaded-BVN1GPlL.js";
import {
  n as resolveBundledChannelThreadBindingInboundConversation,
  t as resolveBundledChannelThreadBindingDefaultPlacement,
} from "./thread-binding-api-CegKXiaq.js";
//#region src/infra/outbound/conversation-id.ts
function resolveExplicitConversationTargetId(target) {
  for (const prefix of ["channel:", "conversation:", "group:", "room:", "dm:"])
    if (normalizeLowercaseStringOrEmpty(target).startsWith(prefix))
      return normalizeOptionalString(target.slice(prefix.length));
}
/**
 * Chooses the best conversation id from an explicit thread id or outbound targets.
 */
function resolveConversationIdFromTargets(params) {
  const threadId = stringifyRouteThreadId(params.threadId);
  if (threadId) return threadId;
  for (const rawTarget of params.targets) {
    const target = normalizeOptionalString(rawTarget);
    if (!target) continue;
    const explicitConversationId = resolveExplicitConversationTargetId(target);
    if (explicitConversationId) return explicitConversationId;
    if (target.includes(":") && explicitConversationId === void 0) continue;
    const mentionMatch = target.match(/^<#(\d+)>$/);
    if (mentionMatch?.[1]) return mentionMatch[1];
    if (/^\d{6,}$/.test(target)) return target;
  }
}
//#endregion
//#region src/channels/conversation-resolution.ts
/**
 * Canonical conversation resolution for command and inbound channel flows.
 * This module turns channel targets, thread ids, aliases, and plugin hooks into stable binding ids.
 */
const CANONICAL_TARGET_PREFIXES = ["user:", "spaces/"];
function resolveChannelId(raw) {
  const normalizedRaw = normalizeOptionalString(raw);
  if (!normalizedRaw) return null;
  return (
    normalizeAnyChannelId(normalizedRaw) ??
    normalizeChannelId(normalizedRaw) ??
    normalizeOptionalLowercaseString(normalizedRaw) ??
    null
  );
}
function getActiveRegistryChannelPlugin(rawChannel) {
  const normalized = normalizeAnyChannelId(rawChannel) ?? normalizeOptionalString(rawChannel);
  if (!normalized) return;
  return getActivePluginChannelRegistry()?.channels.find((entry) => entry.plugin.id === normalized)
    ?.plugin;
}
function getRuntimeChannelPluginCandidates(channel) {
  const candidates = [
    getActiveRegistryChannelPlugin(channel),
    getLoadedChannelPlugin(channel),
  ].filter((plugin) => Boolean(plugin));
  return [...new Map(candidates.map((plugin) => [plugin.id, plugin])).values()];
}
function resolveRuntimeChannelPlugin(channel) {
  return getRuntimeChannelPluginCandidates(channel)[0];
}
function shouldDefaultParentConversationToSelf(plugin) {
  return plugin?.bindings?.selfParentConversationByDefault === true;
}
function normalizeResolutionTarget(params) {
  const conversationId = normalizeOptionalString(params.conversation?.conversationId);
  if (!conversationId) return null;
  const parentConversationId = normalizeOptionalString(params.conversation?.parentConversationId);
  const defaultParentToSelf =
    shouldDefaultParentConversationToSelf(params.plugin) &&
    !params.threadId &&
    !parentConversationId;
  const normalized = normalizeConversationTargetRef({
    conversationId,
    parentConversationId: defaultParentToSelf ? conversationId : parentConversationId,
  });
  const normalizedParentConversationId = defaultParentToSelf
    ? normalized.conversationId
    : normalized.parentConversationId;
  const placementHint =
    params.includePlacementHint === false
      ? void 0
      : resolveChannelDefaultBindingPlacement(params.channel);
  return {
    canonical: {
      channel: params.channel,
      accountId: params.accountId,
      conversationId: normalized.conversationId,
      ...(normalizedParentConversationId
        ? { parentConversationId: normalizedParentConversationId }
        : {}),
    },
    ...(params.threadId ? { threadId: params.threadId } : {}),
    ...(placementHint ? { placementHint } : {}),
    source: params.source,
  };
}
function resolveBindingAccountId(params) {
  return (
    normalizeOptionalString(params.rawAccountId) ||
    normalizeOptionalString(params.plugin?.config.defaultAccountId?.(params.cfg)) ||
    "default"
  );
}
function resolveFallbackConversationTargetId(params) {
  const { allowNumericTopicShorthand = false } = params;
  const target = normalizeOptionalString(params.rawTarget);
  if (!target) return;
  const withoutKind = stripTargetKindPrefix(target);
  const withoutTopic =
    params.preserveExplicitTopicSuffix && /:topic:/iu.test(withoutKind)
      ? withoutKind
      : stripTargetTopicSuffix(withoutKind, { allowNumericShorthand: allowNumericTopicShorthand });
  return (
    resolveConversationIdFromTargets({ targets: [withoutTopic] }) ??
    (withoutTopic !== target ? withoutTopic : void 0) ??
    resolveConversationIdFromTargets({ targets: [target] })
  );
}
function resolveChannelTargetId(params) {
  const target = normalizeOptionalString(params.target);
  if (!target) return;
  const lower = normalizeLowercaseStringOrEmpty(target);
  const channelPrefix = `${params.channel}:`;
  if (lower.startsWith(channelPrefix))
    return resolveChannelTargetId({
      channel: params.channel,
      target: target.slice(channelPrefix.length),
      preserveExplicitTopicSuffix: params.preserveExplicitTopicSuffix,
    });
  if (CANONICAL_TARGET_PREFIXES.some((prefix) => lower.startsWith(prefix))) return target;
  const prefixedChannel = resolveTargetPrefixedChannel(target);
  if (!prefixedChannel || prefixedChannel !== params.channel) {
    const explicitConversationId = resolveFallbackConversationTargetId({
      rawTarget: target,
      allowNumericTopicShorthand: params.channel === "telegram",
      preserveExplicitTopicSuffix: params.preserveExplicitTopicSuffix,
    });
    if (explicitConversationId) return explicitConversationId;
  }
  const normalizedTarget = normalizeOptionalString(
    resolveRuntimeChannelPlugin(params.channel)?.messaging?.normalizeTarget?.(target),
  );
  if (normalizedTarget) {
    const withoutProvider = stripTargetProviderPrefix(normalizedTarget, params.channel);
    return (
      resolveFallbackConversationTargetId({
        rawTarget: withoutProvider,
        allowNumericTopicShorthand: params.channel === "telegram",
        preserveExplicitTopicSuffix: params.preserveExplicitTopicSuffix,
      }) ||
      withoutProvider ||
      normalizedTarget
    );
  }
  const parsedTarget = resolveExplicitDeliveryTargetCompat({
    channel: params.channel,
    rawTarget: target,
  });
  if (parsedTarget?.to)
    return resolveConversationIdFromTargets({ targets: [parsedTarget.to] }) ?? parsedTarget.to;
  return target;
}
function buildThreadingContext(params) {
  const to =
    normalizeOptionalString(params.originatingTo) ?? normalizeOptionalString(params.fallbackTo);
  return {
    ...(to ? { To: to } : {}),
    ...(params.from ? { From: params.from } : {}),
    ...(params.chatType ? { ChatType: params.chatType } : {}),
    ...(params.threadId ? { MessageThreadId: params.threadId } : {}),
    ...(params.nativeChannelId ? { NativeChannelId: params.nativeChannelId } : {}),
  };
}
/**
 * Resolves whether top-level bindings default to the current conversation or a child thread.
 */
function resolveChannelDefaultBindingPlacement(rawChannel) {
  const channel = resolveChannelId(rawChannel);
  if (!channel) return;
  return (
    resolveRuntimeChannelPlugin(channel)?.conversationBindings?.defaultTopLevelPlacement ??
    resolveBundledChannelThreadBindingDefaultPlacement(channel)
  );
}
/**
 * Resolves command context into a canonical channel/account/conversation tuple.
 */
function resolveCommandConversationResolution(params) {
  const channel = resolveChannelId(params.channel);
  if (!channel) return null;
  const plugin = resolveRuntimeChannelPlugin(channel);
  const accountId = resolveBindingAccountId({
    rawAccountId: params.accountId,
    plugin,
    cfg: params.cfg,
  });
  const threadId = stringifyRouteThreadId(params.threadId);
  const commandParams = {
    accountId,
    threadId,
    threadParentId: normalizeOptionalString(params.threadParentId),
    senderId: normalizeOptionalString(params.senderId),
    sessionKey: normalizeOptionalString(params.sessionKey),
    parentSessionKey: normalizeOptionalString(params.parentSessionKey),
    from: normalizeOptionalString(params.from),
    chatType: normalizeOptionalString(params.chatType),
    originatingTo: params.originatingTo ?? void 0,
    commandTo: params.commandTo ?? void 0,
    fallbackTo: params.fallbackTo ?? void 0,
  };
  const resolvedByProvider = plugin?.bindings?.resolveCommandConversation?.(commandParams);
  const providerResolution = normalizeResolutionTarget({
    channel,
    accountId,
    conversation: resolvedByProvider,
    source: "command-provider",
    threadId,
    plugin,
    includePlacementHint: params.includePlacementHint,
  });
  if (providerResolution) return providerResolution;
  const focusedBinding = plugin?.threading?.resolveFocusedBinding?.({
    cfg: params.cfg,
    accountId,
    context: buildThreadingContext({
      fallbackTo: params.fallbackTo ?? void 0,
      originatingTo: params.originatingTo ?? void 0,
      threadId,
      from: normalizeOptionalString(params.from),
      chatType: normalizeOptionalString(params.chatType),
      nativeChannelId: normalizeOptionalString(params.nativeChannelId),
    }),
  });
  const focusedResolution = normalizeResolutionTarget({
    channel,
    accountId,
    conversation: focusedBinding,
    source: "focused-binding",
    threadId,
    plugin,
    includePlacementHint: params.includePlacementHint,
  });
  if (focusedResolution) return focusedResolution;
  const baseConversationId =
    resolveChannelTargetId({
      channel,
      target: params.originatingTo,
    }) ??
    resolveChannelTargetId({
      channel,
      target: params.commandTo,
    }) ??
    resolveChannelTargetId({
      channel,
      target: params.fallbackTo,
    });
  const parentConversationId =
    resolveChannelTargetId({
      channel,
      target: params.threadParentId,
    }) ??
    (threadId && baseConversationId && baseConversationId !== threadId
      ? baseConversationId
      : void 0);
  const conversationId = threadId || baseConversationId;
  if (!conversationId) return null;
  return normalizeResolutionTarget({
    channel,
    accountId,
    conversation: {
      conversationId,
      parentConversationId,
    },
    source: "command-fallback",
    threadId,
    plugin,
    includePlacementHint: params.includePlacementHint,
  });
}
/**
 * Resolves inbound message context into the canonical binding conversation tuple.
 */
function resolveInboundConversationResolution(params) {
  const channel = resolveChannelId(params.channel);
  if (!channel) return null;
  const plugin = resolveRuntimeChannelPlugin(channel);
  const accountId = resolveBindingAccountId({
    rawAccountId: params.accountId,
    plugin,
    cfg: params.cfg,
  });
  const threadId = stringifyRouteThreadId(params.threadId);
  const resolverParams = {
    from: normalizeOptionalString(params.from),
    to: normalizeOptionalString(params.to),
    conversationId:
      normalizeOptionalString(params.conversationId) ??
      normalizeOptionalString(params.groupId) ??
      normalizeOptionalString(params.to),
    threadId,
    threadParentId: stringifyRouteThreadId(params.threadParentId),
    isGroup: params.isGroup ?? true,
  };
  const providerConversation = plugin?.messaging?.resolveInboundConversation?.(resolverParams);
  const providerResolution = normalizeResolutionTarget({
    channel,
    accountId,
    conversation: providerConversation,
    source: "inbound-provider",
    threadId,
    plugin,
  });
  if (providerResolution || providerConversation === null) return providerResolution;
  const artifactConversation = resolveBundledChannelThreadBindingInboundConversation({
    channelId: channel,
    ...resolverParams,
  });
  const artifactResolution = normalizeResolutionTarget({
    channel,
    accountId,
    conversation: artifactConversation,
    source: "inbound-bundled-artifact",
    threadId,
    plugin,
  });
  if (artifactResolution || artifactConversation === null) return artifactResolution;
  const parentConversationId =
    resolveChannelTargetId({
      channel,
      target: params.threadParentId == null ? void 0 : String(params.threadParentId),
      preserveExplicitTopicSuffix: threadId == null,
    }) ??
    resolveChannelTargetId({
      channel,
      target: params.to,
      preserveExplicitTopicSuffix: threadId == null,
    }) ??
    resolveChannelTargetId({
      channel,
      target: params.conversationId,
      preserveExplicitTopicSuffix: threadId == null,
    }) ??
    resolveChannelTargetId({
      channel,
      target: params.groupId,
      preserveExplicitTopicSuffix: threadId == null,
    });
  const genericConversationId =
    threadId ??
    resolveChannelTargetId({
      channel,
      target: params.conversationId,
      preserveExplicitTopicSuffix: threadId == null,
    }) ??
    resolveChannelTargetId({
      channel,
      target: params.groupId,
      preserveExplicitTopicSuffix: threadId == null,
    }) ??
    parentConversationId;
  if (!genericConversationId) return null;
  return normalizeResolutionTarget({
    channel,
    accountId,
    conversation: {
      conversationId: genericConversationId,
      parentConversationId: threadId != null ? parentConversationId : void 0,
    },
    source: "inbound-fallback",
    threadId,
    plugin,
  });
}
//#endregion
//#region src/channels/conversation-binding-context.ts
/**
 * Resolves the canonical channel/account/conversation tuple used for conversation bindings.
 */
function resolveConversationBindingContext(params) {
  const resolution = resolveCommandConversationResolution({
    ...params,
    includePlacementHint: false,
  });
  if (!resolution) return null;
  return {
    channel: resolution.canonical.channel,
    accountId: resolution.canonical.accountId,
    conversationId: resolution.canonical.conversationId,
    ...(resolution.canonical.parentConversationId
      ? { parentConversationId: resolution.canonical.parentConversationId }
      : {}),
    ...(resolution.threadId ? { threadId: resolution.threadId } : {}),
  };
}
//#endregion
export {
  resolveConversationIdFromTargets as i,
  resolveChannelDefaultBindingPlacement as n,
  resolveInboundConversationResolution as r,
  resolveConversationBindingContext as t,
};
