import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { t as matchesApprovalRequestFilters } from "./approval-request-filters-DAUeQDD1.js";
import "./routing-CwvmVRHd.js";
import { h as getExecApprovalReplyMetadata } from "./exec-approval-reply-Djiq6tOJ.js";
import {
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
//#region src/plugin-sdk/approval-client-helpers.ts
function isApprovalTargetsMode(cfg) {
  const execApprovals = cfg.approvals?.exec;
  if (!execApprovals?.enabled) return false;
  return execApprovals.mode === "targets" || execApprovals.mode === "both";
}
/** Return whether a channel account has an enabled approval client and at least one approver. */
function isChannelExecApprovalClientEnabledFromConfig(params) {
  if (params.approverCount <= 0) return false;
  return params.enabled === true || params.enabled === "auto";
}
/**
 * Return whether a sender is one of the configured global exec approval forward targets.
 * Channel plugins provide the target matcher because `to` shapes differ by provider.
 */
function isChannelExecApprovalTargetRecipient(params) {
  const normalizeSenderId = params.normalizeSenderId ?? normalizeOptionalString;
  const normalizedSenderId = params.senderId ? normalizeSenderId(params.senderId) : void 0;
  const normalizedChannel = normalizeOptionalLowercaseString(params.channel);
  if (!normalizedSenderId || !isApprovalTargetsMode(params.cfg)) return false;
  const targets = params.cfg.approvals?.exec?.targets;
  if (!targets) return false;
  const normalizedAccountId = params.accountId ? normalizeAccountId(params.accountId) : void 0;
  return targets.some((target) => {
    if (normalizeOptionalLowercaseString(target.channel) !== normalizedChannel) return false;
    if (
      normalizedAccountId &&
      target.accountId &&
      normalizeAccountId(target.accountId) !== normalizedAccountId
    )
      return false;
    return params.matchTarget({
      target,
      normalizedSenderId,
      normalizedAccountId,
    });
  });
}
/**
 * Build the common approval-client profile used by channel plugins.
 * The returned helpers centralize enablement, approver auth, request filters, and local prompt suppression.
 */
function createChannelExecApprovalProfile(params) {
  const normalizeSenderId = params.normalizeSenderId ?? normalizeOptionalString;
  const isClientEnabled = (input) => {
    return isChannelExecApprovalClientEnabledFromConfig({
      enabled: params.resolveConfig(input)?.enabled,
      approverCount: params.resolveApprovers(input).length,
    });
  };
  const isApprover = (input) => {
    const normalizedSenderId = input.senderId ? normalizeSenderId(input.senderId) : void 0;
    if (!normalizedSenderId) return false;
    return params.resolveApprovers(input).includes(normalizedSenderId);
  };
  const isAuthorizedSender = (input) => {
    return isApprover(input) || (params.isTargetRecipient?.(input) ?? false);
  };
  const resolveTarget = (input) => {
    return params.resolveConfig(input)?.target ?? "dm";
  };
  const shouldHandleRequest = (input) => {
    if (params.matchesRequestAccount && !params.matchesRequestAccount(input)) return false;
    const config = params.resolveConfig(input);
    const approverCount = params.resolveApprovers(input).length;
    if (
      !isChannelExecApprovalClientEnabledFromConfig({
        enabled: config?.enabled,
        approverCount,
      })
    )
      return false;
    return matchesApprovalRequestFilters({
      request: input.request.request,
      agentFilter: config?.agentFilter,
      sessionFilter: config?.sessionFilter,
      fallbackAgentIdFromSessionKey: params.fallbackAgentIdFromSessionKey === true,
    });
  };
  const shouldSuppressLocalPrompt = (input) => {
    if (params.requireClientEnabledForLocalPromptSuppression !== false && !isClientEnabled(input))
      return false;
    return getExecApprovalReplyMetadata(input.payload) !== null;
  };
  return {
    /** Whether this account has an enabled channel approval client and approvers. */
    isClientEnabled,
    /** Whether a sender is in the resolved approver set. */
    isApprover,
    /** Whether a sender is either an approver or a configured approval target. */
    isAuthorizedSender,
    /** Preferred delivery target, defaulting to approver DMs. */
    resolveTarget,
    /** Whether this profile should handle a forwarded approval request. */
    shouldHandleRequest,
    /** Whether a local approval prompt should be suppressed for an already-rendered payload. */
    shouldSuppressLocalPrompt,
  };
}
//#endregion
export {
  isChannelExecApprovalClientEnabledFromConfig as n,
  isChannelExecApprovalTargetRecipient as r,
  createChannelExecApprovalProfile as t,
};
