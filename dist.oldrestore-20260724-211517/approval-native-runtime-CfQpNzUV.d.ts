import {
  A as PreparedChannelNativeApprovalTarget,
  B as ChannelApprovalKind,
  M as ChannelApprovalNativePlannedTarget,
  O as ChannelNativeApprovalDeliveryCallbacks,
  P as ChannelApprovalNativeAdapter,
  f as ExecApprovalChannelRuntime,
  j as ChannelApprovalNativeDeliveryPlan,
  k as ChannelNativeApprovalTransportSpec,
  p as ExecApprovalChannelRuntimeAdapter,
} from "./approval-handler-runtime-types-BO5RsjHV.js";
import { d as ExecApprovalResolved, l as ExecApprovalRequest } from "./exec-approvals-B59RubLo.js";
import {
  l as PluginApprovalResolved,
  s as PluginApprovalRequest,
} from "./plugin-approvals-DCKU3bfY.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region src/infra/approval-native-runtime.d.ts
type ApprovalRequest = ExecApprovalRequest | PluginApprovalRequest;
type ApprovalResolved = ExecApprovalResolved | PluginApprovalResolved;
type ChannelNativeApprovalPlanDeliveryResult<TPendingEntry> = {
  entries: TPendingEntry[];
  deliveryPlan: ChannelApprovalNativeDeliveryPlan;
  deliveredTargets: ChannelApprovalNativePlannedTarget[];
};
/** Delivers an approval request to the adapter-planned native targets and returns pending entries. */
declare function deliverApprovalRequestViaChannelNativePlan<
  TPreparedTarget,
  TPendingEntry,
  TRequest extends ApprovalRequest = ApprovalRequest,
>(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  approvalKind: ChannelApprovalKind;
  request: TRequest;
  adapter?: ChannelApprovalNativeAdapter | null;
  prepareTarget: (params: {
    plannedTarget: ChannelApprovalNativePlannedTarget;
    request: TRequest;
  }) =>
    | PreparedChannelNativeApprovalTarget<TPreparedTarget>
    | null
    | Promise<PreparedChannelNativeApprovalTarget<TPreparedTarget> | null>;
  deliverTarget: (params: {
    plannedTarget: ChannelApprovalNativePlannedTarget;
    preparedTarget: TPreparedTarget;
    request: TRequest;
  }) => TPendingEntry | null | Promise<TPendingEntry | null>;
  onDeliveryError?: (params: {
    error: unknown;
    plannedTarget: ChannelApprovalNativePlannedTarget;
    request: TRequest;
  }) => void;
  onDuplicateSkipped?: (params: {
    plannedTarget: ChannelApprovalNativePlannedTarget;
    preparedTarget: PreparedChannelNativeApprovalTarget<TPreparedTarget>;
    request: TRequest;
  }) => void;
  onDelivered?: (params: {
    plannedTarget: ChannelApprovalNativePlannedTarget;
    preparedTarget: PreparedChannelNativeApprovalTarget<TPreparedTarget>;
    request: TRequest;
    entry: TPendingEntry;
  }) => void;
}): Promise<ChannelNativeApprovalPlanDeliveryResult<TPendingEntry>>;
type ChannelNativeApprovalRuntimeAdapter<
  TPendingEntry,
  TPreparedTarget,
  TPendingContent,
  TRequest extends ApprovalRequest = ApprovalRequest,
  TResolved extends ApprovalResolved = ApprovalResolved,
> = Omit<
  ExecApprovalChannelRuntimeAdapter<TPendingEntry, TRequest, TResolved>,
  "deliverRequested"
> &
  ChannelNativeApprovalTransportSpec<TPendingEntry, TPreparedTarget, TPendingContent, TRequest> &
  ChannelNativeApprovalDeliveryCallbacks<
    TPendingEntry,
    TPreparedTarget,
    TPendingContent,
    TRequest
  > & {
    channel?: string;
    channelLabel?: string;
    accountId?: string | null;
    nativeAdapter?: ChannelApprovalNativeAdapter | null /** @deprecated Trusted compatibility override; omit to derive ownership from the payload. */;
    resolveApprovalKind?: (request: TRequest) => ChannelApprovalKind;
    buildPendingContent: (params: {
      request: TRequest;
      approvalKind: ChannelApprovalKind;
      nowMs: number;
    }) => TPendingContent | Promise<TPendingContent>;
    onStopped?: () => Promise<void> | void;
  };
/** Creates the shared gateway approval runtime backed by channel-native delivery hooks. */
declare function createChannelNativeApprovalRuntime<
  TPendingEntry,
  TPreparedTarget,
  TPendingContent,
  TRequest extends ApprovalRequest = ApprovalRequest,
  TResolved extends ApprovalResolved = ApprovalResolved,
>(
  adapter: ChannelNativeApprovalRuntimeAdapter<
    TPendingEntry,
    TPreparedTarget,
    TPendingContent,
    TRequest,
    TResolved
  >,
): ExecApprovalChannelRuntime<TRequest, TResolved>;
//#endregion
export { deliverApprovalRequestViaChannelNativePlan as n, createChannelNativeApprovalRuntime as t };
