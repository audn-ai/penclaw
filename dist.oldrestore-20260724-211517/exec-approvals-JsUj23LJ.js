import { s as resolveDiscordAccount } from "./accounts-BNPpAWWI.js";
import { a as resolveApprovalApprovers } from "./approval-auth-helpers-BtEiGp-a.js";
import { n as isChannelExecApprovalClientEnabledFromConfig } from "./approval-client-helpers-B4E-EYXE.js";
import { t as matchesApprovalRequestFilters } from "./approval-request-filters-DAUeQDD1.js";
import "./approval-client-runtime-CjDhaUWt.js";
import "./approval-delivery-runtime-D6blv2E7.js";
import "./approval-native-runtime-BCKDIyz_.js";
import { h as getExecApprovalReplyMetadata } from "./exec-approval-reply-Djiq6tOJ.js";
import { t as parseDiscordTarget } from "./target-parsing-DA2e4aeg.js";
//#region extensions/discord/src/exec-approvals.ts
function normalizeDiscordApproverId(value) {
  const trimmed = value.trim();
  if (!trimmed) return;
  if (/^\d+$/.test(trimmed)) return trimmed;
  try {
    const target = parseDiscordTarget(trimmed);
    return target?.kind === "user" ? target.id : void 0;
  } catch {
    return;
  }
}
function resolveDiscordOwnerApprovers(cfg) {
  const ownerAllowFrom = cfg.commands?.ownerAllowFrom;
  if (!Array.isArray(ownerAllowFrom) || ownerAllowFrom.length === 0) return [];
  return resolveApprovalApprovers({
    explicit: ownerAllowFrom,
    normalizeApprover: (value) => normalizeDiscordApproverId(String(value)),
  });
}
function getDiscordExecApprovalApprovers(params) {
  return resolveApprovalApprovers({
    explicit:
      params.configOverride?.approvers ??
      resolveDiscordAccount(params).config.execApprovals?.approvers ??
      resolveDiscordOwnerApprovers(params.cfg),
    normalizeApprover: (value) => normalizeDiscordApproverId(String(value)),
  });
}
function isDiscordExecApprovalClientEnabled(params) {
  return isChannelExecApprovalClientEnabledFromConfig({
    enabled: (params.configOverride ?? resolveDiscordAccount(params).config.execApprovals)?.enabled,
    approverCount: getDiscordExecApprovalApprovers({
      cfg: params.cfg,
      accountId: params.accountId,
      configOverride: params.configOverride,
    }).length,
  });
}
function isDiscordExecApprovalApprover(params) {
  const senderId = params.senderId?.trim();
  if (!senderId) return false;
  return getDiscordExecApprovalApprovers({
    cfg: params.cfg,
    accountId: params.accountId,
    configOverride: params.configOverride,
  }).includes(senderId);
}
function shouldSuppressLocalDiscordExecApprovalPrompt(params) {
  const metadata = getExecApprovalReplyMetadata(params.payload);
  const config = resolveDiscordAccount(params).config.execApprovals;
  return (
    params.hint?.kind === "approval-pending" &&
    params.hint.nativeRouteActive === true &&
    isDiscordExecApprovalClientEnabled(params) &&
    metadata !== null &&
    matchesApprovalRequestFilters({
      request: {
        agentId: metadata.agentId,
        sessionKey: metadata.sessionKey,
      },
      agentFilter: config?.agentFilter,
      sessionFilter: config?.sessionFilter,
    })
  );
}
//#endregion
export {
  shouldSuppressLocalDiscordExecApprovalPrompt as i,
  isDiscordExecApprovalApprover as n,
  isDiscordExecApprovalClientEnabled as r,
  getDiscordExecApprovalApprovers as t,
};
