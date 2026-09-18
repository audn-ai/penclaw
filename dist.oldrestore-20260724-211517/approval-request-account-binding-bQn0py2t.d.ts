import { l as ExecApprovalRequest } from "./exec-approvals-B59RubLo.js";
import { s as PluginApprovalRequest } from "./plugin-approvals-DCKU3bfY.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/infra/approval-request-account-binding.d.ts
type ApprovalRequestLike = ExecApprovalRequest | PluginApprovalRequest;
/** Resolves the account id an approval request belongs to for an optional channel filter. */
declare function resolveApprovalRequestAccountId(params: {
  cfg: OpenClawConfig;
  request: ApprovalRequestLike;
  channel?: string | null;
}): string | null;
/** Resolves an approval request account only when the request can be routed to a channel. */
declare function resolveApprovalRequestChannelAccountId(params: {
  cfg: OpenClawConfig;
  request: ApprovalRequestLike;
  channel: string;
}): string | null;
/** Checks whether a channel/account pair is eligible to handle an approval request. */
declare function doesApprovalRequestMatchChannelAccount(params: {
  cfg: OpenClawConfig;
  request: ApprovalRequestLike;
  channel: string;
  accountId?: string | null;
}): boolean;
//#endregion
export {
  resolveApprovalRequestAccountId as n,
  resolveApprovalRequestChannelAccountId as r,
  doesApprovalRequestMatchChannelAccount as t,
};
