import { z as ChannelApprovalNativeTarget } from "../approval-handler-runtime-types-BO5RsjHV.js";
import {
  a as createChannelApproverDmTargetResolver,
  c as createNativeApprovalForwardingFallbackSuppressor,
  d as shouldSuppressLocalNativeExecApprovalPrompt,
  i as createChannelApprovalForwardingEvaluator,
  l as nativeApprovalTargetsMatch,
  n as ChannelApprovalForwardingEligibilityParams,
  o as createChannelNativeOriginTargetResolver,
  r as ChannelApprovalPotentialRouteParams,
  s as createNativeApprovalChannelRouteGates,
  t as ChannelApprovalExplicitTargetEligibilityParams,
  u as resolveApprovalKind,
} from "../approval-native-helpers-C-G7Kitb.js";
import {
  n as resolveApprovalRequestAccountId,
  r as resolveApprovalRequestChannelAccountId,
  t as doesApprovalRequestMatchChannelAccount,
} from "../approval-request-account-binding-bQn0py2t.js";
import {
  a as resolveApprovalRequestSessionTarget,
  i as resolveApprovalRequestSessionConversation,
  n as ExecApprovalSessionTarget,
  o as resolveExecApprovalSessionTarget,
  r as resolveApprovalRequestOriginTarget,
  t as ApprovalRequestSessionConversation,
} from "../exec-approval-session-target-mW3ZNgoS.js";

//#region src/infra/approval-native-target-key.d.ts
/** Builds the stable dedupe key used to compare channel-native approval targets. */
declare function buildChannelApprovalNativeTargetKey(target: ChannelApprovalNativeTarget): string;
//#endregion
export {
  type ApprovalRequestSessionConversation,
  type ChannelApprovalExplicitTargetEligibilityParams,
  type ChannelApprovalForwardingEligibilityParams,
  type ChannelApprovalPotentialRouteParams,
  type ExecApprovalSessionTarget,
  buildChannelApprovalNativeTargetKey,
  createChannelApprovalForwardingEvaluator,
  createChannelApproverDmTargetResolver,
  createChannelNativeOriginTargetResolver,
  createNativeApprovalChannelRouteGates,
  createNativeApprovalForwardingFallbackSuppressor,
  doesApprovalRequestMatchChannelAccount,
  nativeApprovalTargetsMatch,
  resolveApprovalKind,
  resolveApprovalRequestAccountId,
  resolveApprovalRequestChannelAccountId,
  resolveApprovalRequestOriginTarget,
  resolveApprovalRequestSessionConversation,
  resolveApprovalRequestSessionTarget,
  resolveExecApprovalSessionTarget,
  shouldSuppressLocalNativeExecApprovalPrompt,
};
