import { s as resolveDiscordAccount } from "./accounts-BNPpAWWI.js";
import { n as isChannelExecApprovalClientEnabledFromConfig } from "./approval-client-helpers-B4E-EYXE.js";
import { t as matchesApprovalRequestFilters } from "./approval-request-filters-DAUeQDD1.js";
import "./approval-native-runtime-BCKDIyz_.js";
import { a as doesApprovalRequestMatchChannelAccount } from "./exec-approval-session-target-GSisVfGX.js";
import { t as getDiscordExecApprovalApprovers } from "./exec-approvals-JsUj23LJ.js";
//#region extensions/discord/src/approval-shared.ts
function shouldHandleDiscordApprovalRequest(params) {
  const config =
    params.configOverride ??
    resolveDiscordAccount({
      cfg: params.cfg,
      accountId: params.accountId,
    }).config.execApprovals;
  const approvers = getDiscordExecApprovalApprovers({
    cfg: params.cfg,
    accountId: params.accountId,
    configOverride: params.configOverride,
  });
  if (
    !doesApprovalRequestMatchChannelAccount({
      cfg: params.cfg,
      request: params.request,
      channel: "discord",
      accountId: params.accountId,
    })
  )
    return false;
  if (
    !isChannelExecApprovalClientEnabledFromConfig({
      enabled: config?.enabled,
      approverCount: approvers.length,
    })
  )
    return false;
  return matchesApprovalRequestFilters({
    request: params.request.request,
    agentFilter: config?.agentFilter,
    sessionFilter: config?.sessionFilter,
  });
}
//#endregion
export { shouldHandleDiscordApprovalRequest as t };
