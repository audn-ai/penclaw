import {
  i as ChannelApprovalNativeAvailabilityAdapter,
  l as ChannelApprovalNativeRuntimeAdapter,
  m as ExecApprovalChannelRuntimeEventKind,
} from "./approval-handler-runtime-types-BO5RsjHV.js";

//#region src/infra/approval-handler-adapter-runtime.d.ts
/** Runtime-context capability key used by channels to register native approval resources. */
declare const CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY = "approval.native";
/** Creates an approval runtime adapter that loads heavy channel code only when delivery hooks run. */
declare function createLazyChannelApprovalNativeRuntimeAdapter<
  TPendingPayload = unknown,
  TPreparedTarget = unknown,
  TPendingEntry = unknown,
  TBinding = unknown,
  TFinalPayload = unknown,
>(params: {
  load: () => Promise<
    ChannelApprovalNativeRuntimeAdapter<
      TPendingPayload,
      TPreparedTarget,
      TPendingEntry,
      TBinding,
      TFinalPayload
    >
  >;
  isConfigured: ChannelApprovalNativeAvailabilityAdapter["isConfigured"];
  shouldHandle: ChannelApprovalNativeAvailabilityAdapter["shouldHandle"];
  eventKinds?: readonly ExecApprovalChannelRuntimeEventKind[] /** @deprecated Trusted compatibility override; omit to derive ownership from the payload. */;
  resolveApprovalKind?: ChannelApprovalNativeRuntimeAdapter["resolveApprovalKind"];
}): ChannelApprovalNativeRuntimeAdapter<
  TPendingPayload,
  TPreparedTarget,
  TPendingEntry,
  TBinding,
  TFinalPayload
>;
//#endregion
export {
  createLazyChannelApprovalNativeRuntimeAdapter as n,
  CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY as t,
};
