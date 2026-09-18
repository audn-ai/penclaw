import { b as ExecHost, c as ExecApprovalDecision } from "./exec-approvals-B59RubLo.js";
import {
  c as MessagePresentation,
  d as MessagePresentationButton,
  l as MessagePresentationAction,
  n as InteractiveReply,
} from "./payload-DYmvszuK.js";
import { r as ReplyPayload } from "./reply-payload-DPFdJynw.js";

//#region src/infra/exec-approval-reply.d.ts
type ExecApprovalReplyDecision = ExecApprovalDecision;
type ExecApprovalUnavailableReason =
  | "initiating-platform-disabled"
  | "initiating-platform-unsupported"
  | "no-approval-route";
type ExecApprovalReplyMetadata = {
  approvalId: string;
  approvalSlug: string;
  approvalKind: "exec" | "plugin";
  agentId?: string;
  allowedDecisions?: readonly ExecApprovalReplyDecision[];
  sessionKey?: string;
};
type ExecApprovalActionDescriptor = {
  decision: ExecApprovalReplyDecision;
  label: string;
  style: NonNullable<
    MessagePresentationButton["style"]
  > /** Optional semantic action; omitted by the shipped command-backed builders. */;
  action?: MessagePresentationAction /** Copyable text fallback retained for non-interactive approval surfaces. */;
  command: string;
};
/** Approval descriptor guaranteed to carry a canonical typed approval action. */
type TypedApprovalActionDescriptor = ExecApprovalActionDescriptor & {
  action: Extract<
    MessagePresentationAction,
    {
      type: "approval";
    }
  >;
};
type ExecApprovalPendingReplyParams = {
  warningText?: string;
  approvalId: string;
  approvalSlug: string;
  approvalCommandId?: string;
  ask?: string | null;
  agentId?: string | null;
  allowedDecisions?: readonly ExecApprovalReplyDecision[];
  command: string;
  cwd?: string;
  host: ExecHost;
  nodeId?: string;
  sessionKey?: string | null;
  expiresAtMs?: number;
  nowMs?: number;
};
type ExecApprovalUnavailableReplyParams = {
  warningText?: string;
  channel?: string;
  channelLabel?: string;
  accountId?: string;
  reason: ExecApprovalUnavailableReason;
  sentApproverDms?: boolean;
  host?: ExecHost;
  nodeId?: string;
};
declare function buildExecApprovalCommandText(params: {
  approvalCommandId: string;
  decision: ExecApprovalReplyDecision;
}): string;
type BuildExecApprovalActionDescriptorsParams = {
  approvalCommandId: string;
  ask?: string | null;
  allowedDecisions?: readonly ExecApprovalReplyDecision[];
};
declare function buildExecApprovalActionDescriptors(
  params: BuildExecApprovalActionDescriptorsParams,
): ExecApprovalActionDescriptor[];
/** Build approval descriptors with explicit owner-aware typed actions. */
declare function buildTypedApprovalActionDescriptors(
  params: BuildExecApprovalActionDescriptorsParams & {
    approvalKind: "exec" | "plugin";
  },
): TypedApprovalActionDescriptor[];
/** Build portable approval controls from decision descriptors. */
declare function buildApprovalPresentationFromActionDescriptors(
  actions: readonly ExecApprovalActionDescriptor[],
): MessagePresentation | undefined;
type BuildApprovalPresentationParams = {
  approvalId: string;
  ask?: string | null;
  allowedDecisions?: readonly ExecApprovalReplyDecision[];
};
/** Build the shipped command-backed portable approval controls. */
declare function buildApprovalPresentation(
  params: BuildApprovalPresentationParams,
): MessagePresentation | undefined;
/** Build portable approval controls with explicit owner-aware typed actions. */
declare function buildTypedApprovalPresentation(
  params: BuildApprovalPresentationParams & {
    approvalKind: "exec" | "plugin";
  },
): MessagePresentation | undefined;
/** Build the shipped command-backed exec-approval presentation. */
declare function buildExecApprovalPresentation(params: {
  approvalCommandId: string;
  ask?: string | null;
  allowedDecisions?: readonly ExecApprovalReplyDecision[];
}): MessagePresentation | undefined;
/** Build an exec-approval presentation with canonical typed decision actions. */
declare function buildTypedExecApprovalPresentation(params: {
  approvalCommandId: string;
  ask?: string | null;
  allowedDecisions?: readonly ExecApprovalReplyDecision[];
}): MessagePresentation | undefined;
/**
 * @deprecated Use buildApprovalPresentationFromActionDescriptors.
 */
declare function buildApprovalInteractiveReplyFromActionDescriptors(
  actions: readonly ExecApprovalActionDescriptor[],
): InteractiveReply | undefined;
declare function getExecApprovalApproverDmNoticeText(): string;
declare function parseExecApprovalCommandText(raw: string): {
  approvalId: string;
  decision: ExecApprovalReplyDecision;
} | null;
declare function formatExecApprovalExpiresIn(expiresAtMs: number, nowMs: number): string;
declare function getExecApprovalReplyMetadata(
  payload: ReplyPayload,
): ExecApprovalReplyMetadata | null;
declare function buildExecApprovalPendingReplyPayload(
  params: ExecApprovalPendingReplyParams,
): ReplyPayload;
/** Build an exec approval prompt with canonical typed decision actions. */
declare function buildTypedExecApprovalPendingReplyPayload(
  params: ExecApprovalPendingReplyParams,
): ReplyPayload;
declare function buildExecApprovalUnavailableReplyPayload(
  params: ExecApprovalUnavailableReplyParams,
): ReplyPayload;
//#endregion
export {
  parseExecApprovalCommandText as C,
  getExecApprovalReplyMetadata as S,
  buildTypedApprovalPresentation as _,
  ExecApprovalUnavailableReason as a,
  formatExecApprovalExpiresIn as b,
  buildApprovalInteractiveReplyFromActionDescriptors as c,
  buildExecApprovalActionDescriptors as d,
  buildExecApprovalCommandText as f,
  buildTypedApprovalActionDescriptors as g,
  buildExecApprovalUnavailableReplyPayload as h,
  ExecApprovalReplyMetadata as i,
  buildApprovalPresentation as l,
  buildExecApprovalPresentation as m,
  ExecApprovalPendingReplyParams as n,
  ExecApprovalUnavailableReplyParams as o,
  buildExecApprovalPendingReplyPayload as p,
  ExecApprovalReplyDecision as r,
  TypedApprovalActionDescriptor as s,
  ExecApprovalActionDescriptor as t,
  buildApprovalPresentationFromActionDescriptors as u,
  buildTypedExecApprovalPendingReplyPayload as v,
  getExecApprovalApproverDmNoticeText as x,
  buildTypedExecApprovalPresentation as y,
};
