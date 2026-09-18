import {
  c as ExecApprovalDecision,
  d as ExecApprovalResolved,
  l as ExecApprovalRequest,
  on as CommandExplanationSummary,
} from "./exec-approvals-B59RubLo.js";
import { i as InteractiveReplyButton, l as MessagePresentationAction } from "./payload-DYmvszuK.js";
import {
  l as PluginApprovalResolved,
  s as PluginApprovalRequest,
} from "./plugin-approvals-DCKU3bfY.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/infra/approval-types.d.ts
type ChannelApprovalKind = "exec" | "plugin";
//#endregion
//#region src/channels/plugins/approval-native.types.d.ts
/**
 * Native channel surface that can receive approval prompts.
 */
type ChannelApprovalNativeSurface = "origin" | "approver-dm";
/**
 * Native channel destination for an approval prompt.
 */
type ChannelApprovalNativeTarget = {
  to: string;
  threadId?: string | number | null;
};
/**
 * Preferred native delivery surface for approval prompts.
 */
type ChannelApprovalNativeDeliveryPreference = ChannelApprovalNativeSurface | "both";
/**
 * Approval request shapes supported by native channel approval delivery.
 */
type ChannelApprovalNativeRequest = ExecApprovalRequest | PluginApprovalRequest;
/**
 * Capabilities returned by native channel approval delivery inspection.
 */
type ChannelApprovalNativeDeliveryCapabilities = {
  enabled: boolean;
  preferredSurface: ChannelApprovalNativeDeliveryPreference;
  supportsOriginSurface: boolean;
  supportsApproverDmSurface: boolean;
  notifyOriginWhenDmOnly?: boolean;
};
/**
 * Adapter implemented by channel plugins that support native approval delivery.
 */
type ChannelApprovalNativeAdapter = {
  describeDeliveryCapabilities: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    approvalKind: ChannelApprovalKind;
    request: ChannelApprovalNativeRequest;
  }) => ChannelApprovalNativeDeliveryCapabilities;
  resolveOriginTarget?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    approvalKind: ChannelApprovalKind;
    request: ChannelApprovalNativeRequest;
  }) => ChannelApprovalNativeTarget | null | Promise<ChannelApprovalNativeTarget | null>;
  resolveApproverDmTargets?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    approvalKind: ChannelApprovalKind;
    request: ChannelApprovalNativeRequest;
  }) => ChannelApprovalNativeTarget[] | Promise<ChannelApprovalNativeTarget[]>;
};
//#endregion
//#region src/infra/approval-native-delivery.d.ts
type ApprovalRequest$2 = ExecApprovalRequest | PluginApprovalRequest;
/** One native approval delivery target selected by the channel adapter plan. */
type ChannelApprovalNativePlannedTarget = {
  surface: ChannelApprovalNativeSurface;
  target: ChannelApprovalNativeTarget;
  reason: "preferred" | "fallback";
};
/** Complete native approval routing plan, including optional origin-chat notice state. */
type ChannelApprovalNativeDeliveryPlan = {
  targets: ChannelApprovalNativePlannedTarget[];
  originTarget: ChannelApprovalNativeTarget | null;
  notifyOriginWhenDmOnly: boolean;
};
/** Resolves the origin and approver-DM targets a channel should use for native approvals. */
declare function resolveChannelNativeApprovalDeliveryPlan(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  approvalKind: ChannelApprovalKind;
  request: ApprovalRequest$2;
  adapter?: ChannelApprovalNativeAdapter | null;
}): Promise<ChannelApprovalNativeDeliveryPlan>;
//#endregion
//#region src/infra/approval-native-runtime-types.d.ts
/** Prepared delivery target plus the stable key used to avoid duplicate native messages. */
type PreparedChannelNativeApprovalTarget<TPreparedTarget> = {
  dedupeKey: string;
  target: TPreparedTarget;
};
/** Channel hooks that prepare adapter targets and deliver pending approval content. */
type ChannelNativeApprovalTransportSpec<TPendingEntry, TPreparedTarget, TPendingContent, TRequest> =
  {
    prepareTarget: (params: {
      plannedTarget: ChannelApprovalNativePlannedTarget;
      request: TRequest;
      approvalKind: ChannelApprovalKind;
      pendingContent: TPendingContent;
    }) =>
      | PreparedChannelNativeApprovalTarget<TPreparedTarget>
      | null
      | Promise<PreparedChannelNativeApprovalTarget<TPreparedTarget> | null>;
    deliverTarget: (params: {
      plannedTarget: ChannelApprovalNativePlannedTarget;
      preparedTarget: TPreparedTarget;
      request: TRequest;
      approvalKind: ChannelApprovalKind;
      pendingContent: TPendingContent;
    }) => TPendingEntry | null | Promise<TPendingEntry | null>;
  };
/** Optional observer hooks for per-target native approval delivery outcomes. */
type ChannelNativeApprovalDeliveryCallbacks<
  TPendingEntry,
  TPreparedTarget,
  TPendingContent,
  TRequest,
> = {
  onDeliveryError?: (params: {
    error: unknown;
    plannedTarget: ChannelApprovalNativePlannedTarget;
    request: TRequest;
    approvalKind: ChannelApprovalKind;
    pendingContent: TPendingContent;
  }) => void;
  onDuplicateSkipped?: (params: {
    plannedTarget: ChannelApprovalNativePlannedTarget;
    preparedTarget: PreparedChannelNativeApprovalTarget<TPreparedTarget>;
    request: TRequest;
    approvalKind: ChannelApprovalKind;
    pendingContent: TPendingContent;
  }) => void;
  onDelivered?: (params: {
    plannedTarget: ChannelApprovalNativePlannedTarget;
    preparedTarget: PreparedChannelNativeApprovalTarget<TPreparedTarget>;
    request: TRequest;
    approvalKind: ChannelApprovalKind;
    pendingContent: TPendingContent;
    entry: TPendingEntry;
  }) => void;
};
//#endregion
//#region src/infra/approval-view-model.types.d.ts
type ApprovalPhase = "pending" | "resolved" | "expired";
/** Button or command action shown with a pending approval prompt. */
type ApprovalActionView = {
  kind?: "command" | "decision";
  decision: ExecApprovalDecision;
  label: string;
  style: NonNullable<InteractiveReplyButton["style"]>;
  action?: MessagePresentationAction /** Copyable command fallback for non-interactive surfaces. */;
  command: string;
};
/** Label/value metadata row rendered with an approval prompt. */
type ApprovalMetadataView = {
  label: string;
  value: string;
};
type ApprovalViewBase = {
  approvalId: string;
  approvalKind: ChannelApprovalKind;
  phase: ApprovalPhase;
  title: string;
  description?: string | null;
  metadata: ApprovalMetadataView[];
};
/** Shared presentation fields for exec approval views across all phases. */
type ExecApprovalViewBase = ApprovalViewBase & {
  approvalKind: "exec";
  ask?: string | null;
  agentId?: string | null;
  warningText?: string | null;
  commandAnalysis?: CommandExplanationSummary | null;
  commandText: string;
  commandPreview?: string | null;
  cwd?: string | null;
  envKeys?: readonly string[];
  host?: string | null;
  nodeId?: string | null;
  sessionKey?: string | null;
};
/** Pending exec approval view, including executable reply actions. */
type ExecApprovalPendingView = ExecApprovalViewBase & {
  phase: "pending";
  actions: ApprovalActionView[];
  expiresAtMs: number;
};
/** Resolved exec approval view with the recorded decision. */
type ExecApprovalResolvedView = ExecApprovalViewBase & {
  phase: "resolved";
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
};
/** Expired exec approval view without reply actions. */
type ExecApprovalExpiredView = ExecApprovalViewBase & {
  phase: "expired";
};
/** Shared presentation fields for plugin approval views across all phases. */
type PluginApprovalViewBase = ApprovalViewBase & {
  approvalKind: "plugin";
  agentId?: string | null;
  pluginId?: string | null;
  toolName?: string | null;
  severity: "info" | "warning" | "critical";
};
/** Pending plugin approval view, including executable reply actions. */
type PluginApprovalPendingView = PluginApprovalViewBase & {
  phase: "pending";
  actions: ApprovalActionView[];
  expiresAtMs: number;
};
/** Resolved plugin approval view with the recorded decision. */
type PluginApprovalResolvedView = PluginApprovalViewBase & {
  phase: "resolved";
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
};
/** Expired plugin approval view without reply actions. */
type PluginApprovalExpiredView = PluginApprovalViewBase & {
  phase: "expired";
};
/** Any pending approval view that still accepts a user decision. */
type PendingApprovalView = ExecApprovalPendingView | PluginApprovalPendingView;
/** Any approval view after a decision was recorded. */
type ResolvedApprovalView = ExecApprovalResolvedView | PluginApprovalResolvedView;
/** Any approval view after it can no longer be acted on. */
type ExpiredApprovalView = ExecApprovalExpiredView | PluginApprovalExpiredView;
/** Discriminated approval presentation model consumed by channel/UI renderers. */
type ApprovalViewModel = PendingApprovalView | ResolvedApprovalView | ExpiredApprovalView;
/** Stored approval request variants accepted by the view-model builders. */
type ApprovalRequest$1 = ExecApprovalRequest | PluginApprovalRequest;
//#endregion
//#region src/infra/exec-approval-channel-runtime.types.d.ts
type ApprovalRequestEvent = ExecApprovalRequest | PluginApprovalRequest;
type ApprovalResolvedEvent = ExecApprovalResolved | PluginApprovalResolved;
/** Approval event families a channel-native approval runtime can subscribe to. */
type ExecApprovalChannelRuntimeEventKind = "exec" | "plugin";
/** Adapter implemented by a channel to deliver and finalize native approval prompts. */
type ExecApprovalChannelRuntimeAdapter<
  TPending,
  TRequest extends ApprovalRequestEvent = ExecApprovalRequest,
  TResolved extends ApprovalResolvedEvent = ExecApprovalResolved,
> = {
  label: string;
  clientDisplayName: string;
  cfg: OpenClawConfig;
  gatewayUrl?: string /** Defaults to exec-only; include plugin when the adapter can handle plugin approvals. */;
  eventKinds?: readonly ExecApprovalChannelRuntimeEventKind[];
  isConfigured: () => boolean;
  shouldHandle: (request: TRequest) => boolean;
  deliverRequested: (request: TRequest) => Promise<TPending[]>;
  beforeGatewayClientStart?: () => Promise<void> | void;
  finalizeResolved: (params: {
    request: TRequest;
    resolved: TResolved;
    entries: TPending[];
  }) => Promise<void>;
  finalizeExpired?: (params: { request: TRequest; entries: TPending[] }) => Promise<void>;
  onStopped?: () => Promise<void> | void;
  nowMs?: () => number;
};
/** Runtime handle used by approval bootstrap code to manage a channel-native approval client. */
type ExecApprovalChannelRuntime<
  TRequest extends ApprovalRequestEvent = ExecApprovalRequest,
  TResolved extends ApprovalResolvedEvent = ExecApprovalResolved,
> = {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  handleRequested: (request: TRequest) => Promise<void>;
  handleResolved: (resolved: TResolved) => Promise<void>;
  handleExpired: (approvalId: string) => Promise<void>;
  request: <T = unknown>(method: string, params: Record<string, unknown>) => Promise<T>;
};
//#endregion
//#region src/infra/approval-handler-runtime-types.d.ts
/** Union of approval request events a native approval handler can receive. */
type ApprovalRequest = ExecApprovalRequest | PluginApprovalRequest;
/** Union of approval resolution events a native approval handler can finalize. */
type ApprovalResolved = ExecApprovalResolved | PluginApprovalResolved;
/** Shared context passed to channel-native approval hooks. */
type ChannelApprovalCapabilityHandlerContext = {
  cfg: OpenClawConfig;
  accountId?: string | null;
  gatewayUrl?: string;
  context?: unknown;
};
/** Result instruction for updating, deleting, clearing, or leaving a delivered approval entry. */
type ChannelApprovalNativeFinalAction<TPayload> =
  | {
      kind: "update";
      payload: TPayload;
    }
  | {
      kind: "delete";
    }
  | {
      kind: "clear-actions";
    }
  | {
      kind: "leave";
    };
/** Availability gate for deciding whether a channel-native approval runtime can handle work. */
type ChannelApprovalNativeAvailabilityAdapter = {
  isConfigured: (params: ChannelApprovalCapabilityHandlerContext) => boolean;
  shouldHandle: (
    params: ChannelApprovalCapabilityHandlerContext & {
      request: ApprovalRequest /** Payload-derived owner; channel adapters must not infer ownership from the id. */;
      approvalKind: ChannelApprovalKind;
    },
  ) => boolean;
};
/** Builds channel-native payloads for pending, resolved, and expired approval views. */
type ChannelApprovalNativePresentationAdapter<
  TPendingPayload = unknown,
  TFinalPayload = unknown,
> = {
  buildPendingPayload: (
    params: ChannelApprovalCapabilityHandlerContext & {
      request: ApprovalRequest;
      approvalKind: ChannelApprovalKind;
      nowMs: number;
      view: PendingApprovalView;
    },
  ) => TPendingPayload | Promise<TPendingPayload>;
  buildResolvedResult: (
    params: ChannelApprovalCapabilityHandlerContext & {
      request: ApprovalRequest;
      resolved: ApprovalResolved;
      view: ResolvedApprovalView;
      entry: unknown;
    },
  ) =>
    | ChannelApprovalNativeFinalAction<TFinalPayload>
    | Promise<ChannelApprovalNativeFinalAction<TFinalPayload>>;
  buildExpiredResult: (
    params: ChannelApprovalCapabilityHandlerContext & {
      request: ApprovalRequest;
      view: ExpiredApprovalView;
      entry: unknown;
    },
  ) =>
    | ChannelApprovalNativeFinalAction<TFinalPayload>
    | Promise<ChannelApprovalNativeFinalAction<TFinalPayload>>;
};
type ChannelApprovalNativeTransportAdapterForView<
  TPreparedTarget = unknown,
  TPendingEntry = unknown,
  TPendingPayload = unknown,
  TFinalPayload = unknown,
  TPendingView extends PendingApprovalView = PendingApprovalView,
> = {
  prepareTarget: (
    params: ChannelApprovalCapabilityHandlerContext & {
      plannedTarget: ChannelApprovalNativePlannedTarget;
      request: ApprovalRequest;
      approvalKind: ChannelApprovalKind;
      view: TPendingView;
      pendingPayload: TPendingPayload;
    },
  ) =>
    | PreparedChannelNativeApprovalTarget<TPreparedTarget>
    | null
    | Promise<PreparedChannelNativeApprovalTarget<TPreparedTarget> | null>;
  deliverPending: (
    params: ChannelApprovalCapabilityHandlerContext & {
      plannedTarget: ChannelApprovalNativePlannedTarget;
      preparedTarget: TPreparedTarget;
      request: ApprovalRequest;
      approvalKind: ChannelApprovalKind;
      view: TPendingView;
      pendingPayload: TPendingPayload;
    },
  ) => TPendingEntry | null | Promise<TPendingEntry | null>;
  updateEntry?: (
    params: ChannelApprovalCapabilityHandlerContext & {
      entry: TPendingEntry;
      payload: TFinalPayload;
      phase: "resolved" | "expired";
    },
  ) => Promise<void>;
  deleteEntry?: (
    params: ChannelApprovalCapabilityHandlerContext & {
      entry: TPendingEntry;
      phase: "resolved" | "expired";
    },
  ) => Promise<void>;
};
/** Transport hooks for preparing, delivering, updating, and deleting native approval entries. */
type ChannelApprovalNativeTransportAdapter<
  TPreparedTarget = unknown,
  TPendingEntry = unknown,
  TPendingPayload = unknown,
  TFinalPayload = unknown,
> = ChannelApprovalNativeTransportAdapterForView<
  TPreparedTarget,
  TPendingEntry,
  TPendingPayload,
  TFinalPayload
>;
type ChannelApprovalNativeInteractionAdapterForView<
  TPendingEntry = unknown,
  TBinding = unknown,
  TPendingPayload = unknown,
  TPendingView extends PendingApprovalView = PendingApprovalView,
> = {
  bindPending?: (
    params: ChannelApprovalCapabilityHandlerContext & {
      entry: TPendingEntry;
      request: ApprovalRequest;
      approvalKind: ChannelApprovalKind;
      view: TPendingView;
      pendingPayload: TPendingPayload;
    },
  ) => TBinding | null | Promise<TBinding | null>;
  unbindPending?: (
    params: ChannelApprovalCapabilityHandlerContext & {
      entry: TPendingEntry;
      binding: TBinding;
      request: ApprovalRequest;
      approvalKind: ChannelApprovalKind;
    },
  ) => Promise<void> | void;
  clearPendingActions?: (
    params: ChannelApprovalCapabilityHandlerContext & {
      entry: TPendingEntry;
      phase: "resolved" | "expired";
    },
  ) => Promise<void>;
  cancelDelivered?: (
    params: ChannelApprovalCapabilityHandlerContext & {
      entry: TPendingEntry;
      request: ApprovalRequest;
      approvalKind: ChannelApprovalKind;
    },
  ) => Promise<void> | void;
};
/** Optional hooks for binding and clearing interactive approval controls. */
type ChannelApprovalNativeInteractionAdapter<
  TPendingEntry = unknown,
  TBinding = unknown,
> = ChannelApprovalNativeInteractionAdapterForView<TPendingEntry, TBinding>;
type ChannelApprovalNativeObserveAdapterForView<
  TPreparedTarget = unknown,
  TPendingPayload = unknown,
  TPendingEntry = unknown,
  TPendingView extends PendingApprovalView = PendingApprovalView,
> = {
  onDeliveryError?: (
    params: ChannelApprovalCapabilityHandlerContext & {
      error: unknown;
      plannedTarget: ChannelApprovalNativePlannedTarget;
      request: ApprovalRequest;
      approvalKind: ChannelApprovalKind;
      view: TPendingView;
      pendingPayload: TPendingPayload;
    },
  ) => void;
  onDuplicateSkipped?: (
    params: ChannelApprovalCapabilityHandlerContext & {
      plannedTarget: ChannelApprovalNativePlannedTarget;
      preparedTarget: PreparedChannelNativeApprovalTarget<TPreparedTarget>;
      request: ApprovalRequest;
      approvalKind: ChannelApprovalKind;
      view: TPendingView;
      pendingPayload: TPendingPayload;
    },
  ) => void;
  onDelivered?: (
    params: ChannelApprovalCapabilityHandlerContext & {
      plannedTarget: ChannelApprovalNativePlannedTarget;
      preparedTarget: PreparedChannelNativeApprovalTarget<TPreparedTarget>;
      request: ApprovalRequest;
      approvalKind: ChannelApprovalKind;
      view: TPendingView;
      pendingPayload: TPendingPayload;
      entry: TPendingEntry;
    },
  ) => void;
};
/** Optional observer hooks for delivery errors, duplicates, and successful deliveries. */
type ChannelApprovalNativeObserveAdapter<
  TPreparedTarget = unknown,
  TPendingPayload = unknown,
  TPendingEntry = unknown,
> = ChannelApprovalNativeObserveAdapterForView<TPreparedTarget, TPendingPayload, TPendingEntry>;
/** Runtime adapter consumed by core after a plugin's strongly typed spec has been erased. */
type ChannelApprovalNativeRuntimeAdapter<
  TPendingPayload = unknown,
  TPreparedTarget = unknown,
  TPendingEntry = unknown,
  TBinding = unknown,
  TFinalPayload = unknown,
> = {
  eventKinds?: readonly ExecApprovalChannelRuntimeEventKind[];
  /**
   * Trusted legacy ownership override retained for compatibility.
   * @deprecated Omit this so core derives approval ownership from the request payload.
   */
  resolveApprovalKind?: (request: ApprovalRequest) => ChannelApprovalKind;
  availability: ChannelApprovalNativeAvailabilityAdapter;
  presentation: ChannelApprovalNativePresentationAdapter<TPendingPayload, TFinalPayload>;
  transport: ChannelApprovalNativeTransportAdapter<
    TPreparedTarget,
    TPendingEntry,
    TPendingPayload,
    TFinalPayload
  >;
  interactions?: ChannelApprovalNativeInteractionAdapter<TPendingEntry, TBinding>;
  observe?: ChannelApprovalNativeObserveAdapter;
};
/** Strongly typed plugin spec used to build a channel-native approval runtime adapter. */
type ChannelApprovalNativeRuntimeSpec<
  TPendingPayload,
  TPreparedTarget,
  TPendingEntry,
  TBinding = unknown,
  TFinalPayload = unknown,
  TPendingView extends PendingApprovalView = PendingApprovalView,
  TResolvedView extends ResolvedApprovalView = ResolvedApprovalView,
  TExpiredView extends ExpiredApprovalView = ExpiredApprovalView,
> = {
  eventKinds?: readonly ExecApprovalChannelRuntimeEventKind[];
  /**
   * Trusted legacy ownership override retained for compatibility.
   * @deprecated Omit this so core derives approval ownership from the request payload.
   */
  resolveApprovalKind?: (request: ApprovalRequest) => ChannelApprovalKind;
  availability: ChannelApprovalNativeAvailabilityAdapter;
  presentation: {
    buildPendingPayload: (
      params: ChannelApprovalCapabilityHandlerContext & {
        request: ApprovalRequest;
        approvalKind: ChannelApprovalKind;
        nowMs: number;
        view: TPendingView;
      },
    ) => TPendingPayload | Promise<TPendingPayload>;
    buildResolvedResult: (
      params: ChannelApprovalCapabilityHandlerContext & {
        request: ApprovalRequest;
        resolved: ApprovalResolved;
        view: TResolvedView;
        entry: TPendingEntry;
      },
    ) =>
      | ChannelApprovalNativeFinalAction<TFinalPayload>
      | Promise<ChannelApprovalNativeFinalAction<TFinalPayload>>;
    buildExpiredResult: (
      params: ChannelApprovalCapabilityHandlerContext & {
        request: ApprovalRequest;
        view: TExpiredView;
        entry: TPendingEntry;
      },
    ) =>
      | ChannelApprovalNativeFinalAction<TFinalPayload>
      | Promise<ChannelApprovalNativeFinalAction<TFinalPayload>>;
  };
  transport: ChannelApprovalNativeTransportAdapterForView<
    TPreparedTarget,
    TPendingEntry,
    TPendingPayload,
    TFinalPayload,
    TPendingView
  >;
  interactions?: ChannelApprovalNativeInteractionAdapterForView<
    TPendingEntry,
    TBinding,
    TPendingPayload,
    TPendingView
  >;
  observe?: ChannelApprovalNativeObserveAdapterForView<
    TPreparedTarget,
    TPendingPayload,
    TPendingEntry,
    TPendingView
  >;
};
//#endregion
export {
  PreparedChannelNativeApprovalTarget as A,
  ChannelApprovalKind as B,
  PendingApprovalView as C,
  ResolvedApprovalView as D,
  PluginApprovalResolvedView as E,
  ChannelApprovalNativeDeliveryCapabilities as F,
  ChannelApprovalNativeDeliveryPreference as I,
  ChannelApprovalNativeRequest as L,
  ChannelApprovalNativePlannedTarget as M,
  resolveChannelNativeApprovalDeliveryPlan as N,
  ChannelNativeApprovalDeliveryCallbacks as O,
  ChannelApprovalNativeAdapter as P,
  ChannelApprovalNativeSurface as R,
  ExpiredApprovalView as S,
  PluginApprovalPendingView as T,
  ApprovalRequest$1 as _,
  ChannelApprovalNativeFinalAction as a,
  ExecApprovalPendingView as b,
  ChannelApprovalNativePresentationAdapter as c,
  ChannelApprovalNativeTransportAdapter as d,
  ExecApprovalChannelRuntime as f,
  ApprovalMetadataView as g,
  ApprovalActionView as h,
  ChannelApprovalNativeAvailabilityAdapter as i,
  ChannelApprovalNativeDeliveryPlan as j,
  ChannelNativeApprovalTransportSpec as k,
  ChannelApprovalNativeRuntimeAdapter as l,
  ExecApprovalChannelRuntimeEventKind as m,
  ApprovalResolved as n,
  ChannelApprovalNativeInteractionAdapter as o,
  ExecApprovalChannelRuntimeAdapter as p,
  ChannelApprovalCapabilityHandlerContext as r,
  ChannelApprovalNativeObserveAdapter as s,
  ApprovalRequest as t,
  ChannelApprovalNativeRuntimeSpec as u,
  ApprovalViewModel as v,
  PluginApprovalExpiredView as w,
  ExecApprovalResolvedView as x,
  ExecApprovalExpiredView as y,
  ChannelApprovalNativeTarget as z,
};
