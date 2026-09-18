import {
  Dy as ApprovalKind,
  Ny as ApprovalResolveResult,
  xy as ApprovalDecision,
} from "./index-F2ydESCy.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/infra/approval-gateway-resolver.d.ts
type ResolveApprovalOverGatewayBaseParams = {
  cfg: OpenClawConfig;
  approvalId: string;
  decision: ApprovalDecision;
  senderId?: string | null;
  gatewayUrl?: string;
  clientDisplayName?: string;
};
type CanonicalResolveApprovalOverGatewayParams = ResolveApprovalOverGatewayBaseParams & {
  /** Explicit owner required by the canonical approval resolver. */ approvalKind: ApprovalKind;
  allowPluginFallback?: never;
  resolveMethod?: never;
};
/**
 * Shipped compatibility input for command-backed and older channel controls.
 * @deprecated Pass approvalKind so resolution uses the canonical approval service.
 */
type LegacyResolveApprovalOverGatewayParams = ResolveApprovalOverGatewayBaseParams & {
  approvalKind?: never;
  /**
   * Shipped legacy fallback after an exec lookup proves no match.
   * @deprecated Pass approvalKind so resolution uses the canonical approval service.
   */
  allowPluginFallback?: boolean;
  /**
   * Explicit legacy owner. Omission retains the shipped id-based routing contract.
   * @deprecated Pass approvalKind so resolution uses the canonical approval service.
   */
  resolveMethod?: "exec" | "plugin";
};
/**
 * Resolves a shipped legacy approval control through its kind-specific Gateway adapter.
 * @deprecated Pass approvalKind so resolution uses the canonical approval service.
 */
declare function resolveApprovalOverGateway(
  params: LegacyResolveApprovalOverGatewayParams,
): Promise<void>;
/** Resolves a typed approval through the canonical operator approval service. */
declare function resolveApprovalOverGateway(
  params: CanonicalResolveApprovalOverGatewayParams,
): Promise<ApprovalResolveResult>;
//#endregion
export { resolveApprovalOverGateway as t };
