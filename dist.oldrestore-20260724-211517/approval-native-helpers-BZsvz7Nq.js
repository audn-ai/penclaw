import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { t as matchesApprovalRequestFilters } from "./approval-request-filters-DAUeQDD1.js";
import { o as channelRouteTargetsMatchExact } from "./channel-route-u-lrE52s.js";
import { h as getExecApprovalReplyMetadata } from "./exec-approval-reply-Djiq6tOJ.js";
import {
  a as doesApprovalRequestMatchChannelAccount,
  r as resolveApprovalRequestSessionTarget,
  t as resolveApprovalRequestOriginTarget,
} from "./exec-approval-session-target-GSisVfGX.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
//#region src/plugin-sdk/approval-native-helpers.ts
/** Compare channel-native approval targets with the same normalization used by outbound routes. */
function nativeApprovalTargetsMatch(params) {
  return channelRouteTargetsMatchExact({
    left: {
      channel: params.channel,
      to: params.left.to,
      accountId: params.left.accountId,
      threadId: params.left.threadId,
    },
    right: {
      channel: params.channel,
      to: params.right.to,
      accountId: params.right.accountId,
      threadId: params.right.threadId,
    },
  });
}
/** Decide whether a channel-native exec approval route replaces the local text prompt. */
function shouldSuppressLocalNativeExecApprovalPrompt(params) {
  if (params.hint?.kind !== "approval-pending" || params.hint.approvalKind !== "exec") return false;
  if (params.hint.nativeRouteActive !== true) return false;
  const metadata = getExecApprovalReplyMetadata(params.payload);
  if (!metadata || metadata.approvalKind !== "exec") return false;
  if (
    !(params.isNativeDeliveryEnabled ?? params.isTransportEnabled)?.({
      cfg: params.cfg,
      accountId: params.accountId,
    })
  )
    return false;
  const config =
    params.resolveApprovalConfig?.({
      cfg: params.cfg,
      accountId: params.accountId,
      metadata,
    }) ?? params.cfg.approvals?.exec;
  if (
    (params.requireApprovalConfigEnabled ?? params.resolveApprovalConfig === void 0) &&
    !config?.enabled
  )
    return false;
  if (params.enforceForwardingMode ?? params.resolveApprovalConfig === void 0) {
    const mode = config?.mode ?? "session";
    if (mode !== "session" && mode !== "both" && !params.hasExactTargetProof) return false;
  }
  if (
    params.isSessionRouteEligible &&
    !params.isSessionRouteEligible({
      cfg: params.cfg,
      accountId: params.accountId,
      metadata,
    })
  )
    return false;
  return matchesApprovalRequestFilters({
    request: {
      agentId: metadata.agentId,
      sessionKey: metadata.sessionKey,
    },
    agentFilter: config?.agentFilter,
    sessionFilter: config?.sessionFilter,
    fallbackAgentIdFromSessionKey: params.fallbackAgentIdFromSessionKey ?? true,
  });
}
function isNativeApprovalTarget(value) {
  return Boolean(value && typeof value === "object" && typeof value.to === "string");
}
function nativeApprovalTargetMatcher(channel) {
  return (left, right) =>
    isNativeApprovalTarget(left) &&
    isNativeApprovalTarget(right) &&
    nativeApprovalTargetsMatch({
      channel,
      left,
      right,
    });
}
/** Infer approval family from the request shape unless the caller already knows it. */
function resolveApprovalKind(request, approvalKind) {
  if (approvalKind) return approvalKind;
  return "command" in request.request ? "exec" : "plugin";
}
function resolveApprovalForwardingConfig(params) {
  return params.approvalKind === "plugin"
    ? params.cfg.approvals?.plugin
    : params.cfg.approvals?.exec;
}
function normalizeApprovalForwardingMode(mode) {
  return mode ?? "session";
}
function approvalModeIncludesSession(mode) {
  return mode === "session" || mode === "both";
}
function approvalModeIncludesTargets(mode) {
  return mode === "targets" || mode === "both";
}
function matchesForwardingFilters(params) {
  return matchesApprovalRequestFilters({
    request: params.request.request,
    agentFilter: params.config.agentFilter,
    sessionFilter: params.config.sessionFilter,
    fallbackAgentIdFromSessionKey: true,
  });
}
function resolveActiveApprovalForwarding(params) {
  if (!params.isTransportEnabled(params)) return null;
  const config = resolveApprovalForwardingConfig(params);
  if (!config?.enabled) return null;
  return {
    config,
    mode: params.resolveMode(config),
  };
}
function canApprovalPotentiallyRoute(params) {
  const forwarding = resolveActiveApprovalForwarding(params);
  if (!forwarding) return false;
  if (approvalModeIncludesSession(forwarding.mode)) return true;
  if (params.nativeSessionOnly) return false;
  return (
    approvalModeIncludesTargets(forwarding.mode) &&
    params.hasMatchingTarget({
      cfg: params.cfg,
      config: forwarding.config,
      accountId: params.accountId,
    })
  );
}
function isSessionApprovalEligibleViaForwarding(params) {
  const forwarding = resolveActiveApprovalForwarding(params);
  if (!forwarding) return false;
  if (!approvalModeIncludesSession(forwarding.mode)) return false;
  if (
    !matchesForwardingFilters({
      config: forwarding.config,
      request: params.request,
    })
  )
    return false;
  if (
    !doesApprovalRequestMatchChannelAccount({
      cfg: params.cfg,
      request: params.request,
      channel: params.channel,
      accountId: params.accountId,
    })
  )
    return false;
  return params.hasOriginOrSessionTarget({
    cfg: params.cfg,
    accountId: params.accountId,
    request: params.request,
  });
}
function isExplicitTargetApprovalEligibleViaForwarding(params) {
  const forwarding = resolveActiveApprovalForwarding(params);
  if (!forwarding) return false;
  if (!approvalModeIncludesTargets(forwarding.mode)) return false;
  if (
    !matchesForwardingFilters({
      config: forwarding.config,
      request: params.request,
    })
  )
    return false;
  return params.hasMatchingTarget({
    cfg: params.cfg,
    config: forwarding.config,
    accountId: params.accountId,
    target: params.target,
  });
}
/** Build reusable forwarding gates for channels with custom target matching logic. */
function createChannelApprovalForwardingEvaluator(params) {
  const resolveForwardingMode = (config) => normalizeApprovalForwardingMode(config.mode);
  const isPotentialRoute = (input) => {
    return canApprovalPotentiallyRoute({
      ...input,
      isTransportEnabled: params.isTransportEnabled,
      resolveMode: resolveForwardingMode,
      hasMatchingTarget: params.hasMatchingTarget,
    });
  };
  const isSessionEligible = (input) => {
    return isSessionApprovalEligibleViaForwarding({
      ...input,
      channel: params.channel,
      isTransportEnabled: params.isTransportEnabled,
      resolveMode: resolveForwardingMode,
      hasOriginOrSessionTarget: params.hasOriginOrSessionTarget,
    });
  };
  const isExplicitTargetEligible = (input) => {
    return isExplicitTargetApprovalEligibleViaForwarding({
      ...input,
      isTransportEnabled: params.isTransportEnabled,
      resolveMode: resolveForwardingMode,
      hasMatchingTarget: params.hasMatchingTarget,
    });
  };
  const canAnyPotentiallyRoute = (input) =>
    isPotentialRoute({
      ...input,
      approvalKind: "exec",
    }) ||
    isPotentialRoute({
      ...input,
      approvalKind: "plugin",
    });
  const shouldHandleRequest = (input) =>
    isSessionEligible({
      ...input,
      approvalKind: resolveApprovalKind(input.request, input.approvalKind),
    });
  return {
    canAnyPotentiallyRoute,
    isExplicitTargetEligible,
    isPotentialRoute,
    isSessionEligible,
    shouldHandleRequest,
  };
}
function normalizeApprovalForwardingModeWithDefault(params) {
  return params.config.mode ?? params.defaultForwardingMode;
}
/** Create the standard route gates for native channel approval forwarding. */
function createNativeApprovalChannelRouteGates(params) {
  const resolveForwardingMode = (config) =>
    normalizeApprovalForwardingModeWithDefault({
      config,
      defaultForwardingMode: params.defaultForwardingMode,
    });
  const targetsMatch =
    params.targetsMatch ??
    ((left, right) =>
      nativeApprovalTargetsMatch({
        channel: params.channel,
        left,
        right,
      }));
  const targetAccountMatchesChannelAccount = (input) => {
    const targetAccountId = normalizeOptionalString(input.targetAccountId);
    const accountId = normalizeOptionalString(input.accountId);
    if (targetAccountId)
      return !accountId || normalizeAccountId(targetAccountId) === normalizeAccountId(accountId);
    if (!accountId) return true;
    const normalizedAccountId = normalizeAccountId(accountId);
    if (normalizedAccountId === normalizeAccountId(params.resolveDefaultAccountId(input.cfg)))
      return true;
    const enabledAccountIds = params
      .listAccountIds(input.cfg)
      .filter((candidateAccountId) =>
        params.isTransportEnabled({
          cfg: input.cfg,
          accountId: candidateAccountId,
        }),
      )
      .map((candidateAccountId) => normalizeAccountId(candidateAccountId));
    return enabledAccountIds.length === 1 && enabledAccountIds[0] === normalizedAccountId;
  };
  const hasMatchingChannelTarget = (input) => {
    const candidateTarget = input.target ? params.normalizeForwardTarget(input.target) : null;
    return (input.config.targets ?? []).some((target) => {
      const configuredTarget = params.normalizeForwardTarget(target);
      if (!configuredTarget) return false;
      if (
        !targetAccountMatchesChannelAccount({
          cfg: input.cfg,
          targetAccountId: configuredTarget.accountId,
          accountId: input.accountId,
        })
      )
        return false;
      if (!candidateTarget) return true;
      return targetsMatch(configuredTarget, candidateTarget);
    });
  };
  const hasChannelOriginOrSessionTarget = (input) => {
    if (params.resolveTurnSourceTarget(input.request)) return true;
    const sessionTarget = resolveApprovalRequestSessionTarget({
      cfg: input.cfg,
      request: input.request,
    });
    return (
      normalizeLowercaseStringOrEmpty(sessionTarget?.channel) === params.channel &&
      targetAccountMatchesChannelAccount({
        cfg: input.cfg,
        targetAccountId: sessionTarget?.accountId,
        accountId: input.accountId,
      })
    );
  };
  const canApprovalPotentiallyRouteToChannel = (input) => {
    return canApprovalPotentiallyRoute({
      ...input,
      isTransportEnabled: params.isTransportEnabled,
      resolveMode: resolveForwardingMode,
      hasMatchingTarget: hasMatchingChannelTarget,
    });
  };
  const canAnyApprovalPotentiallyRouteToChannel = (input) =>
    canApprovalPotentiallyRouteToChannel({
      ...input,
      approvalKind: "exec",
    }) ||
    canApprovalPotentiallyRouteToChannel({
      ...input,
      approvalKind: "plugin",
    });
  const isSessionApprovalEligible = (input) => {
    return isSessionApprovalEligibleViaForwarding({
      ...input,
      channel: params.channel,
      isTransportEnabled: params.isTransportEnabled,
      resolveMode: resolveForwardingMode,
      hasOriginOrSessionTarget: hasChannelOriginOrSessionTarget,
    });
  };
  const isExplicitTargetEligible = (input) => {
    return isExplicitTargetApprovalEligibleViaForwarding({
      ...input,
      isTransportEnabled: params.isTransportEnabled,
      resolveMode: resolveForwardingMode,
      hasMatchingTarget: hasMatchingChannelTarget,
    });
  };
  const shouldHandleApprovalRequest = (input) =>
    isSessionApprovalEligible({
      ...input,
      approvalKind: resolveApprovalKind(input.request, input.approvalKind),
    });
  return {
    canApprovalPotentiallyRouteToChannel,
    canAnyApprovalPotentiallyRouteToChannel,
    isNativeApprovalHandlerConfigured: (input) =>
      canAnyApprovalPotentiallyRouteToChannel({
        ...input,
        nativeSessionOnly: true,
      }),
    isSessionApprovalEligible,
    isExplicitTargetEligible,
    shouldHandleApprovalRequest,
  };
}
function normalizeOptionalAccountId(value) {
  return value?.trim() || void 0;
}
/** Create a fallback suppressor that avoids duplicate approval prompts after native delivery. */
function createNativeApprovalForwardingFallbackSuppressor(params) {
  const targetsMatch =
    params.targetsMatch ??
    ((left, right) =>
      nativeApprovalTargetsMatch({
        channel: params.channel,
        left,
        right,
      }));
  return (input) => {
    const forwardingTarget = params.normalizeForwardTarget(input.target);
    if (!forwardingTarget) return false;
    const accountId =
      normalizeOptionalAccountId(
        params.resolveAccountId?.({
          forwardingTarget,
          target: input.target,
          request: input.request,
        }),
      ) ??
      normalizeOptionalAccountId(forwardingTarget.accountId) ??
      normalizeOptionalAccountId(input.request.request.turnSourceAccountId);
    const approvalKind =
      params.resolveApprovalKind?.({
        approvalKind: input.approvalKind,
        request: input.request,
      }) ?? resolveApprovalKind(input.request, input.approvalKind);
    if (
      !(input.target.source === "target"
        ? (params.isExplicitTargetEligible?.({
            cfg: input.cfg,
            accountId,
            approvalKind,
            request: input.request,
            target: input.target,
          }) ?? false)
        : params.isSessionRouteEligible({
            cfg: input.cfg,
            accountId,
            approvalKind,
            request: input.request,
          }))
    )
      return false;
    const forwardingTargetForMatch =
      params.resolveForwardingTargetForMatch?.({
        forwardingTarget,
        accountId,
        target: input.target,
        approvalKind,
        request: input.request,
      }) ?? forwardingTarget;
    if (!forwardingTargetForMatch) return false;
    const originTarget = params.resolveOriginTarget({
      cfg: input.cfg,
      accountId,
      approvalKind,
      request: input.request,
    });
    if (originTarget && targetsMatch(forwardingTargetForMatch, originTarget)) return true;
    return params
      .resolveApproverDmTargets({
        cfg: input.cfg,
        accountId,
        approvalKind,
        request: input.request,
      })
      .some((approverTarget) => targetsMatch(forwardingTargetForMatch, approverTarget));
  };
}
function createOriginTargetResolver(params) {
  return (input) => {
    if (params.shouldHandleRequest && !params.shouldHandleRequest(input)) return null;
    const normalizeTarget = (target) => {
      if (!target) return null;
      return params.normalizeTarget
        ? (params.normalizeTarget(target, input.request) ?? null)
        : target;
    };
    const normalizeTargetForMatch = (target) =>
      params.normalizeTargetForMatch?.(target, input.request) ?? target;
    return resolveApprovalRequestOriginTarget({
      cfg: input.cfg,
      request: input.request,
      channel: params.channel,
      accountId: input.accountId,
      resolveTurnSourceTarget: (request) =>
        normalizeTarget(params.resolveTurnSourceTarget(request)),
      resolveSessionTarget: (sessionTarget) =>
        normalizeTarget(params.resolveSessionTarget(sessionTarget, input.request)),
      targetsMatch: (left, right) => {
        const normalizedLeft = normalizeTargetForMatch(left);
        const normalizedRight = normalizeTargetForMatch(right);
        return Boolean(
          normalizedLeft && normalizedRight && params.targetsMatch(normalizedLeft, normalizedRight),
        );
      },
      resolveFallbackTarget: params.resolveFallbackTarget
        ? (request) => normalizeTarget(params.resolveFallbackTarget?.(request) ?? null)
        : void 0,
    });
  };
}
function hasCustomTargetsMatch(params) {
  return typeof params.targetsMatch === "function";
}
function createChannelNativeOriginTargetResolver(params) {
  if (hasCustomTargetsMatch(params)) return createOriginTargetResolver(params);
  return createOriginTargetResolver({
    ...params,
    targetsMatch: nativeApprovalTargetMatcher(params.channel),
  });
}
/** Create a resolver for configured approver DM targets. */
function createChannelApproverDmTargetResolver(params) {
  return (input) => {
    if (params.shouldHandleRequest && !params.shouldHandleRequest(input)) return [];
    const targets = [];
    for (const approver of params.resolveApprovers({
      cfg: input.cfg,
      accountId: input.accountId,
    })) {
      const target = params.mapApprover(approver, input);
      if (target) targets.push(target);
    }
    return targets;
  };
}
//#endregion
export {
  createNativeApprovalForwardingFallbackSuppressor as a,
  shouldSuppressLocalNativeExecApprovalPrompt as c,
  createNativeApprovalChannelRouteGates as i,
  createChannelApproverDmTargetResolver as n,
  nativeApprovalTargetsMatch as o,
  createChannelNativeOriginTargetResolver as r,
  resolveApprovalKind as s,
  createChannelApprovalForwardingEvaluator as t,
};
