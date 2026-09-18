import { l as ExecApprovalRequest } from "./exec-approvals-B59RubLo.js";
import { s as PluginApprovalRequest } from "./plugin-approvals-DCKU3bfY.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/infra/exec-approval-session-target.d.ts
/** Delivery target recovered from an approval request's live turn-source or stored session. */
type ExecApprovalSessionTarget = {
  channel?: string;
  to: string;
  accountId?: string;
  threadId?: string | number;
};
/** Parsed session conversation metadata used by channel-native approval routing. */
type ApprovalRequestSessionConversation = {
  channel: string;
  kind: "group" | "channel";
  id: string;
  rawId: string;
  threadId?: string;
  baseSessionKey: string;
  baseConversationId: string;
  parentConversationCandidates: string[];
};
type ApprovalRequestLike = ExecApprovalRequest | PluginApprovalRequest;
type ApprovalRequestOriginTargetResolver<TTarget> = {
  cfg: OpenClawConfig;
  request: ApprovalRequestLike;
  channel: string;
  accountId?: string | null;
  resolveTurnSourceTarget: (request: ApprovalRequestLike) => TTarget | null;
  resolveSessionTarget: (sessionTarget: ExecApprovalSessionTarget) => TTarget | null;
  targetsMatch: (a: TTarget, b: TTarget) => boolean;
  resolveFallbackTarget?: (request: ApprovalRequestLike) => TTarget | null;
};
/** Resolves the conversation encoded in an approval request session key for an optional channel. */
declare function resolveApprovalRequestSessionConversation(params: {
  request: ApprovalRequestLike;
  channel?: string | null;
  bundledFallback?: boolean;
}): ApprovalRequestSessionConversation | null;
/** Resolves the best known message target for an exec approval request. */
declare function resolveExecApprovalSessionTarget(params: {
  cfg: OpenClawConfig;
  request: ExecApprovalRequest;
  turnSourceChannel?: string | null;
  turnSourceTo?: string | null;
  turnSourceAccountId?: string | null;
  turnSourceThreadId?: string | number | null;
}): ExecApprovalSessionTarget | null;
/** Resolves the best known message target for either exec or plugin approval requests. */
declare function resolveApprovalRequestSessionTarget(params: {
  cfg: OpenClawConfig;
  request: ApprovalRequestLike;
}): ExecApprovalSessionTarget | null;
/** Resolves a channel-specific origin target only when live and stored bindings are consistent. */
declare function resolveApprovalRequestOriginTarget<TTarget>(
  params: ApprovalRequestOriginTargetResolver<TTarget>,
): TTarget | null;
//#endregion
export {
  resolveApprovalRequestSessionTarget as a,
  resolveApprovalRequestSessionConversation as i,
  ExecApprovalSessionTarget as n,
  resolveExecApprovalSessionTarget as o,
  resolveApprovalRequestOriginTarget as r,
  ApprovalRequestSessionConversation as t,
};
