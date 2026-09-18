import { t as isApprovalNotFoundError } from "./approval-errors-BEB18t3G.js";
import "./approvals-BSpwjSwI.js";
import { n as isWellFormedApprovalId } from "./approval-id-BTRnO3t1.js";
import { n as withOperatorApprovalsGatewayClient } from "./operator-approvals-client-DekCwBNw.js";
//#region src/infra/approval-gateway-resolver.ts
async function resolveApprovalOverGateway(params) {
  const approvalKind = params.approvalKind;
  const resolveMethod = params.resolveMethod;
  const canonicalKind = approvalKind === "exec" || approvalKind === "plugin" ? approvalKind : null;
  const legacyMethod =
    resolveMethod === "exec" || resolveMethod === "plugin" ? resolveMethod : null;
  const hasCanonicalKind = canonicalKind !== null;
  const hasLegacyMethod = legacyMethod !== null;
  const allowPluginFallback = params.allowPluginFallback;
  if (approvalKind !== void 0) {
    if (!hasCanonicalKind || resolveMethod !== void 0 || allowPluginFallback !== void 0)
      throw new Error("canonical approval resolution requires exactly one valid owner kind");
  } else if (
    (resolveMethod !== void 0 && !hasLegacyMethod) ||
    (allowPluginFallback !== void 0 && typeof allowPluginFallback !== "boolean")
  )
    throw new Error("legacy approval resolution requires valid routing options");
  if (
    params.decision !== "allow-once" &&
    params.decision !== "allow-always" &&
    params.decision !== "deny"
  )
    throw new Error("approval resolution requires a valid decision");
  const approvalId = params.approvalId;
  if (typeof approvalId !== "string" || !isWellFormedApprovalId(approvalId))
    throw new Error("approval resolution requires an approval id");
  const result = await withOperatorApprovalsGatewayClient(
    {
      config: params.cfg,
      gatewayUrl: params.gatewayUrl,
      clientDisplayName:
        params.clientDisplayName ?? `Approval (${params.senderId?.trim() || "unknown"})`,
    },
    async (gatewayClient) => {
      if (hasCanonicalKind) {
        const resolveParams = {
          id: approvalId,
          kind: canonicalKind,
          decision: params.decision,
        };
        return await gatewayClient.request("approval.resolve", resolveParams);
      }
      const requestLegacyResolve = async (method) => {
        await gatewayClient.request(method, {
          id: approvalId,
          decision: params.decision,
        });
      };
      if (legacyMethod === "plugin" || (!legacyMethod && approvalId.startsWith("plugin:"))) {
        await requestLegacyResolve("plugin.approval.resolve");
        return;
      }
      try {
        await requestLegacyResolve("exec.approval.resolve");
      } catch (error) {
        if (allowPluginFallback !== true || !isApprovalNotFoundError(error)) throw error;
        await requestLegacyResolve("plugin.approval.resolve");
      }
    },
  );
  return hasCanonicalKind ? result : void 0;
}
//#endregion
export { resolveApprovalOverGateway as t };
