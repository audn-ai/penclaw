import { l as ExecApprovalRequest } from "./exec-approvals-B59RubLo.js";
import { s as PluginApprovalRequest } from "./plugin-approvals-DCKU3bfY.js";
import { i as ChannelApprovalCapability } from "./types.adapters-BND_5Qr-.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region src/plugin-sdk/approval-delivery-helpers.d.ts
type ApprovalKind = "exec" | "plugin";
type NativeApprovalDeliveryMode = "dm" | "channel" | "both";
type NativeApprovalRequest = ExecApprovalRequest | PluginApprovalRequest;
type NativeApprovalTarget = {
  to: string;
  threadId?: string | number | null;
};
type ChannelApprovalCapabilitySurfaces = Pick<
  ChannelApprovalCapability,
  "delivery" | "nativeRuntime" | "render" | "native"
>;
type ApprovalAdapterParams = {
  /** Full config used to inspect channel approval settings. */ cfg: OpenClawConfig /** Optional channel account id for account-scoped approval settings. */;
  accountId?: string | null /** Actor attempting the approval action. */;
  senderId?: string | null;
};
type DeliverySuppressionParams = {
  /** Full config used to inspect native approval delivery settings. */ cfg: OpenClawConfig /** Approval kind being delivered. */;
  approvalKind: ApprovalKind /** Forwarding fallback target under consideration. */;
  target: {
    channel: string;
    accountId?: string | null;
  } /** Approval request metadata, including original turn source when available. */;
  request: {
    request: {
      turnSourceChannel?: string | null;
      turnSourceAccountId?: string | null;
    };
  };
};
type ApproverRestrictedNativeApprovalParams = {
  /** Channel id that owns this native approval capability. */ channel: string /** Human-readable channel label used in denial messages. */;
  channelLabel: string /** Lists configured account ids so DM-route availability can scan every account. */;
  listAccountIds: (
    cfg: OpenClawConfig,
  ) => string[] /** Whether an account has approvers configured. */;
  hasApprovers: (
    params: ApprovalAdapterParams,
  ) => boolean /** Whether a sender can approve exec approvals for this account. */;
  isExecAuthorizedSender: (
    params: ApprovalAdapterParams,
  ) => boolean /** Optional plugin approval authorization hook; defaults to exec authorization. */;
  isPluginAuthorizedSender?: (
    params: ApprovalAdapterParams,
  ) => boolean /** Whether native approval delivery is enabled for an account. */;
  isNativeDeliveryEnabled: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => boolean /** Native delivery target preference for an account. */;
  resolveNativeDeliveryMode: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => NativeApprovalDeliveryMode /** Requires the approval request's original turn channel to match this channel before suppression. */;
  requireMatchingTurnSourceChannel?: boolean /** Optional account id resolver used when deciding forwarding-fallback suppression. */;
  resolveSuppressionAccountId?: (
    params: DeliverySuppressionParams,
  ) => string | undefined /** Resolves the original channel target for native approval delivery. */;
  resolveOriginTarget?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    approvalKind: ApprovalKind;
    request: NativeApprovalRequest;
  }) =>
    | NativeApprovalTarget
    | null
    | Promise<NativeApprovalTarget | null> /** Resolves approver DM targets for native approval delivery. */;
  resolveApproverDmTargets?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    approvalKind: ApprovalKind;
    request: NativeApprovalRequest;
  }) =>
    | NativeApprovalTarget[]
    | Promise<
        NativeApprovalTarget[]
      > /** Whether DM-only native delivery should also notify the origin channel. */;
  notifyOriginWhenDmOnly?: boolean /** Native runtime hooks used by channel-specific delivery implementations. */;
  nativeRuntime?: ChannelApprovalCapability["nativeRuntime"] /** Optional setup description helper shown when exec approvals are unavailable. */;
  describeExecApprovalSetup?: ChannelApprovalCapability["describeExecApprovalSetup"] /** Optional setup description helper shown when plugin approvals are unavailable. */;
  describePluginApprovalSetup?: ChannelApprovalCapability["describePluginApprovalSetup"];
};
/** Build the legacy split approval adapter shape for approver-restricted native channels. */
declare function createApproverRestrictedNativeApprovalAdapter(
  params: ApproverRestrictedNativeApprovalParams,
): {
  auth: {
    authorizeActorAction?: ChannelApprovalCapability["authorizeActorAction"];
    getActionAvailabilityState?: ChannelApprovalCapability["getActionAvailabilityState"];
    getExecInitiatingSurfaceState?: ChannelApprovalCapability["getExecInitiatingSurfaceState"];
    resolveApproveCommandBehavior?: ChannelApprovalCapability["resolveApproveCommandBehavior"];
  };
  delivery: ChannelApprovalCapability["delivery"];
  nativeRuntime: ChannelApprovalCapability["nativeRuntime"];
  render: ChannelApprovalCapability["render"];
  native: ChannelApprovalCapability["native"];
  describeExecApprovalSetup: ChannelApprovalCapability["describeExecApprovalSetup"];
  describePluginApprovalSetup: ChannelApprovalCapability["describePluginApprovalSetup"];
};
/** Assemble a channel approval capability from its auth, delivery, render, and native surfaces. */
declare function createChannelApprovalCapability(params: {
  /** Authorizes actors attempting approval actions. */ authorizeActorAction?: ChannelApprovalCapability["authorizeActorAction"] /** Reports whether approval actions are generally available. */;
  getActionAvailabilityState?: ChannelApprovalCapability["getActionAvailabilityState"] /** Reports whether exec approvals can start from the initiating surface. */;
  getExecInitiatingSurfaceState?: ChannelApprovalCapability["getExecInitiatingSurfaceState"] /** Optional command behavior override for approval replies. */;
  resolveApproveCommandBehavior?: ChannelApprovalCapability["resolveApproveCommandBehavior"] /** Optional setup copy for unavailable exec approval paths. */;
  describeExecApprovalSetup?: ChannelApprovalCapability["describeExecApprovalSetup"] /** Optional setup copy for unavailable plugin approval paths. */;
  describePluginApprovalSetup?: ChannelApprovalCapability["describePluginApprovalSetup"] /** Delivery fallback and DM-route helpers. */;
  delivery?: ChannelApprovalCapability["delivery"] /** Native runtime hooks for channel-specific approval delivery. */;
  nativeRuntime?: ChannelApprovalCapability["nativeRuntime"] /** Render hooks for pending/resolved approval payloads. */;
  render?: ChannelApprovalCapability["render"] /** Native target/capability discovery hooks. */;
  native?: ChannelApprovalCapability["native"] /** @deprecated Pass delivery/nativeRuntime/render/native directly. */;
  approvals?: Partial<ChannelApprovalCapabilitySurfaces>;
}): ChannelApprovalCapability;
/** Split the canonical approval capability into the adapter shape older channel loaders consume. */
declare function splitChannelApprovalCapability(capability: ChannelApprovalCapability): {
  auth: {
    authorizeActorAction?: ChannelApprovalCapability["authorizeActorAction"];
    getActionAvailabilityState?: ChannelApprovalCapability["getActionAvailabilityState"];
    getExecInitiatingSurfaceState?: ChannelApprovalCapability["getExecInitiatingSurfaceState"];
    resolveApproveCommandBehavior?: ChannelApprovalCapability["resolveApproveCommandBehavior"];
  };
  delivery: ChannelApprovalCapability["delivery"];
  nativeRuntime: ChannelApprovalCapability["nativeRuntime"];
  render: ChannelApprovalCapability["render"];
  native: ChannelApprovalCapability["native"];
  describeExecApprovalSetup: ChannelApprovalCapability["describeExecApprovalSetup"];
  describePluginApprovalSetup: ChannelApprovalCapability["describePluginApprovalSetup"];
};
/** Build the canonical approval capability for approver-restricted native delivery channels. */
declare function createApproverRestrictedNativeApprovalCapability(
  params: ApproverRestrictedNativeApprovalParams,
): ChannelApprovalCapability;
//#endregion
export {
  splitChannelApprovalCapability as i,
  createApproverRestrictedNativeApprovalCapability as n,
  createChannelApprovalCapability as r,
  createApproverRestrictedNativeApprovalAdapter as t,
};
