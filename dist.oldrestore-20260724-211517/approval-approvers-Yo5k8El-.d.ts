import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region src/plugin-sdk/approval-auth-helpers.d.ts
type ApprovalKind = "exec" | "plugin";
type ApproverInput$1 = string | number;
type ApprovalApproverInputs = {
  explicit?: readonly ApproverInput$1[] | null;
  allowFrom?: readonly ApproverInput$1[] | null;
  extraAllowFrom?: readonly ApproverInput$1[] | null;
  defaultTo?: string | null;
};
type ApprovalContext = {
  cfg: OpenClawConfig;
  accountId?: string | null;
};
type ApprovalActorContext = ApprovalContext & {
  senderId?: string | null;
};
type ChannelApprovalAuth = {
  resolveApprovers: (context: ApprovalContext) => string[];
  isAuthorizedSender: (context: ApprovalActorContext) => boolean;
  approvalAuth: ReturnType<typeof createResolvedApproverActionAuthAdapter>;
};
type ApprovalAuthorizationResult = {
  /** Whether the actor may perform the approval action. */ authorized: boolean /** User-facing denial reason when authorization fails. */;
  reason?: string;
};
/**
 * Marks an authorization result as the implicit same-chat fallback used when a
 * channel has no configured approver allowlist.
 */
declare function markImplicitSameChatApprovalAuthorization(
  /** Authorization result to tag as the empty-approver same-chat fallback. */

  result: ApprovalAuthorizationResult,
): ApprovalAuthorizationResult;
/**
 * Checks whether an authorization result came from the implicit same-chat
 * fallback instead of an explicitly configured approver allowlist.
 */
declare function isImplicitSameChatApprovalAuthorization(
  /** Authorization result returned by approval auth helpers. */

  result: ApprovalAuthorizationResult | null | undefined,
): boolean;
/**
 * Builds the approval authorization adapter shared by channels that resolve
 * approvers from account-scoped config.
 */
declare function createResolvedApproverActionAuthAdapter(params: {
  /** Human-readable channel label used in denial messages. */ channelLabel: string /** Resolves normalized approver ids from config and optional account scope. */;
  resolveApprovers: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => string[] /** Optional sender normalizer; defaults to trimmed string normalization. */;
  normalizeSenderId?: (value: string) => string | undefined;
}): {
  authorizeActorAction({
    cfg,
    accountId,
    senderId,
    approvalKind,
  }: {
    /** Full config used to resolve account-scoped approvers. */ cfg: OpenClawConfig /** Optional channel account id for account-scoped approver config. */;
    accountId?: string | null /** Actor attempting the approval action. */;
    senderId?: string | null /** Approval action being authorized. */;
    action: "approve" /** Approval kind used in user-facing denial copy. */;
    approvalKind: ApprovalKind;
  }):
    | ApprovalAuthorizationResult
    | {
        readonly authorized: true;
        readonly reason?: undefined;
      }
    | {
        readonly authorized: false;
        readonly reason:
          | `\u274C You are not authorized to approve exec requests on ${string}.`
          | `\u274C You are not authorized to approve plugin requests on ${string}.`;
      };
};
declare function createChannelApprovalAuth(params: {
  channelLabel: string;
  resolveInputs: (params: ApprovalContext) => ApprovalApproverInputs;
  normalizeApprover: (value: ApproverInput$1) => string | undefined;
  normalizeDefaultTo?: (value: string) => string | undefined;
  normalizeSenderId?: (value: string) => string | undefined;
  isWildcardAuthorized?: (params: {
    purpose: "sender" | "action";
    senderId?: string;
    inputs: ApprovalApproverInputs;
    approvers: readonly string[];
  }) => boolean;
}): ChannelApprovalAuth;
//#endregion
//#region src/plugin-sdk/approval-approvers.d.ts
type ApproverInput = string | number;
/** Resolves explicit approvers first, then allow-from/default fallbacks with dedupe. */
declare function resolveApprovalApprovers(params: {
  explicit?: readonly ApproverInput[] | null;
  allowFrom?: readonly ApproverInput[] | null;
  extraAllowFrom?: readonly ApproverInput[] | null;
  defaultTo?: string | null;
  normalizeApprover: (value: ApproverInput) => string | undefined;
  normalizeDefaultTo?: (value: string) => string | undefined;
}): string[];
//#endregion
export {
  markImplicitSameChatApprovalAuthorization as a,
  isImplicitSameChatApprovalAuthorization as i,
  createChannelApprovalAuth as n,
  createResolvedApproverActionAuthAdapter as r,
  resolveApprovalApprovers as t,
};
