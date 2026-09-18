import { t as isApprovalNotFoundError } from "./approval-errors-BEB18t3G.js";
import "./error-runtime-BIAwr399.js";
import { t as resolveApprovalOverGateway } from "./approval-gateway-resolver-BfeFoNXV.js";
import "./approval-gateway-runtime-DpnfEvUS.js";
//#region extensions/matrix/src/exec-approval-resolver.ts
async function resolveMatrixApproval(params) {
  return await resolveApprovalOverGateway({
    cfg: params.cfg,
    approvalId: params.approvalId,
    approvalKind: params.approvalKind,
    decision: params.decision,
    senderId: params.senderId,
    gatewayUrl: params.gatewayUrl,
    clientDisplayName: `Matrix approval (${params.senderId?.trim() || "unknown"})`,
  });
}
//#endregion
export { isApprovalNotFoundError, resolveMatrixApproval };
