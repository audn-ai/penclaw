import { n as buildApprovalResolvedReplyPayload } from "./approval-renderers-DA2dW1_1.js";
import {
  l as buildPluginApprovalResolvedMessage,
  s as buildPluginApprovalExpiredMessage,
} from "./plugin-approvals-D2muXfhg.js";
import "./approval-gateway-runtime-DpnfEvUS.js";
import "./approval-handler-runtime-DQaz0bRA.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/plugin-sdk/approval-handler-runtime.ts
/** Builds channel-visible resolved approval text for exec and plugin approvals. */
function buildChannelApprovalResolvedText(params) {
  if (params.view.approvalKind === "plugin")
    return buildPluginApprovalResolvedMessage(params.resolved);
  const resolvedByText = params.resolved.resolvedBy
    ? ` Resolved by ${params.resolved.resolvedBy}.`
    : "";
  return (
    buildApprovalResolvedReplyPayload({
      approvalId: params.request.id,
      approvalSlug: params.request.id.slice(0, 8),
      text: `✅ Exec approval ${params.resolved.decision}.${resolvedByText} ID: ${params.request.id}`,
    }).text ?? ""
  );
}
/** Builds channel-visible expiration text for exec and plugin approvals. */
function buildChannelApprovalExpiredText(params) {
  if (params.view.approvalKind === "plugin")
    return buildPluginApprovalExpiredMessage(params.request);
  return `⏱️ Exec approval expired. ID: ${params.request.id}`;
}
function resolvePreparedApprovalAccountId(params) {
  return (
    normalizeOptionalString(params.plannedAccountId) ??
    normalizeOptionalString(params.contextAccountId) ??
    normalizeOptionalString(params.fallbackAccountId)
  );
}
//#endregion
export {
  buildChannelApprovalResolvedText as n,
  resolvePreparedApprovalAccountId as r,
  buildChannelApprovalExpiredText as t,
};
