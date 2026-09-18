import { l as ExecApprovalRequest } from "./exec-approvals-B59RubLo.js";
import { s as PluginApprovalRequest } from "./plugin-approvals-DCKU3bfY.js";
import { r as ReplyPayload } from "./reply-payload-D9hNZyN3.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
import { x as ExecApprovalForwardTarget } from "./types.slack-DOPma3IJ.js";
//#region src/infra/approval-request-filters.d.ts
/** Minimal approval request identity used by agent/session filter checks. */
type ApprovalRequestFilterInput = {
  agentId?: string | null;
  sessionKey?: string | null;
};
/** Matches session filters as literal substrings first, then bounded safe regexes. */
declare function matchesApprovalRequestSessionFilter(
  sessionKey: string,
  patterns: string[],
): boolean;
/**
 * Applies optional approval request filters for agent ids and session keys.
 * Agent id can be parsed from the session key only when the caller opts in.
 */
declare function matchesApprovalRequestFilters(params: {
  request: ApprovalRequestFilterInput;
  agentFilter?: string[];
  sessionFilter?: string[];
  fallbackAgentIdFromSessionKey?: boolean;
}): boolean;
//#endregion
//#region src/plugin-sdk/approval-client-helpers.d.ts
type ApprovalRequest = ExecApprovalRequest | PluginApprovalRequest;
type ApprovalTarget = "dm" | "channel" | "both";
type ChannelExecApprovalEnableMode = boolean | "auto";
type ChannelApprovalConfig = {
  /** Whether the channel approval client is enabled for this account. */ enabled?: ChannelExecApprovalEnableMode /** Preferred approval delivery target for this account. */;
  target?: ApprovalTarget /** Optional agent filters for forwarded approval requests. */;
  agentFilter?: string[] /** Optional session filters for forwarded approval requests. */;
  sessionFilter?: string[];
};
type ApprovalProfileParams = {
  /** Full config used to resolve account-scoped approval settings. */ cfg: OpenClawConfig /** Optional channel account id for account-scoped approval settings. */;
  accountId?: string | null;
};
/** Return whether a channel account has an enabled approval client and at least one approver. */
declare function isChannelExecApprovalClientEnabledFromConfig(params: {
  /** Configured channel approval enable mode. */ enabled?: ChannelExecApprovalEnableMode /** Number of configured approvers after account resolution. */;
  approverCount: number;
}): boolean;
/**
 * Return whether a sender is one of the configured global exec approval forward targets.
 * Channel plugins provide the target matcher because `to` shapes differ by provider.
 */
declare function isChannelExecApprovalTargetRecipient(params: {
  /** Full config containing global exec approval target routing. */ cfg: OpenClawConfig /** Sender id or handle to compare with configured forward targets. */;
  senderId?: string | null /** Optional channel account id for account-scoped target matching. */;
  accountId?: string | null /** Channel id receiving the approval action. */;
  channel: string /** Optional sender normalizer; defaults to trimmed string normalization. */;
  normalizeSenderId?: (
    value: string,
  ) =>
    | string
    | undefined /** Channel-specific matcher for normalized sender ids against target records. */;
  matchTarget: (params: {
    target: ExecApprovalForwardTarget;
    normalizedSenderId: string;
    normalizedAccountId?: string;
  }) => boolean;
}): boolean;
/**
 * Build the common approval-client profile used by channel plugins.
 * The returned helpers centralize enablement, approver auth, request filters, and local prompt suppression.
 */
declare function createChannelExecApprovalProfile(params: {
  /** Resolves channel approval config for the current account. */ resolveConfig: (
    params: ApprovalProfileParams,
  ) =>
    | ChannelApprovalConfig
    | undefined /** Resolves normalized approver ids for the current account. */;
  resolveApprovers: (
    params: ApprovalProfileParams,
  ) => string[] /** Optional sender normalizer; defaults to trimmed string normalization. */;
  normalizeSenderId?: (
    value: string,
  ) => string | undefined /** Optional global approval-target matcher for sender authorization. */;
  isTargetRecipient?: (
    params: ApprovalProfileParams & {
      senderId?: string | null;
    },
  ) => boolean /** Optional account matcher for filtering forwarded approval requests. */;
  matchesRequestAccount?: (
    params: ApprovalProfileParams & {
      request: ApprovalRequest;
    },
  ) => boolean;
  fallbackAgentIdFromSessionKey?: boolean /** Allows local prompt suppression even when the remote approval client is disabled. */;
  requireClientEnabledForLocalPromptSuppression?: boolean;
}): {
  /** Whether this account has an enabled channel approval client and approvers. */ isClientEnabled: (
    input: ApprovalProfileParams,
  ) => boolean /** Whether a sender is in the resolved approver set. */;
  isApprover: (
    input: ApprovalProfileParams & {
      senderId?: string | null;
    },
  ) => boolean /** Whether a sender is either an approver or a configured approval target. */;
  isAuthorizedSender: (
    input: ApprovalProfileParams & {
      senderId?: string | null;
    },
  ) => boolean /** Preferred delivery target, defaulting to approver DMs. */;
  resolveTarget: (
    input: ApprovalProfileParams,
  ) => ApprovalTarget /** Whether this profile should handle a forwarded approval request. */;
  shouldHandleRequest: (
    input: ApprovalProfileParams & {
      request: ApprovalRequest;
    },
  ) => boolean /** Whether a local approval prompt should be suppressed for an already-rendered payload. */;
  shouldSuppressLocalPrompt: (
    input: ApprovalProfileParams & {
      payload: ReplyPayload;
    },
  ) => boolean;
};
//#endregion
export {
  matchesApprovalRequestFilters as a,
  ApprovalRequestFilterInput as i,
  isChannelExecApprovalClientEnabledFromConfig as n,
  matchesApprovalRequestSessionFilter as o,
  isChannelExecApprovalTargetRecipient as r,
  createChannelExecApprovalProfile as t,
};
