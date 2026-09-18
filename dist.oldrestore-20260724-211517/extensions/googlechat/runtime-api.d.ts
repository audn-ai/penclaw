import { t as DEFAULT_ACCOUNT_ID } from "../../account-id-Dh6XMgGH.js";
import { n as GoogleChatConfigSchema } from "../../bundled-channel-config-schema-_xhvUfSd.js";
import { m as missingTargetError } from "../../channel-feedback-CK92csJM.js";
import {
  i as createAccountStatusSink,
  s as runPassiveAccountLifecycle,
} from "../../channel-lifecycle.core-CsQgW7Vx.js";
import { r as createChannelPairingController } from "../../channel-pairing-BkMDkN6g.js";
import {
  C as readReactionParams,
  E as readStringParam,
  d as createActionGate,
  x as readNumberParam,
} from "../../common-CuQ9SS3Z.js";
import { r as buildChannelConfigSchema } from "../../config-schema-CpUUoa8V.js";
import { n as isDangerousNameMatchingEnabled } from "../../dangerous-name-matching-BbYdI4i4.js";
import { a as fetchWithSsrFGuard } from "../../fetch-guard-BKvfwdRa.js";
import { r as resolveInboundRouteEnvelopeBuilderWithRuntime } from "../../inbound-envelope-CyqvCT28.js";
import { p as resolveInboundMentionDecision } from "../../mention-gating-D6dFDlTf.js";
import { t as PAIRING_APPROVED_MESSAGE } from "../../pairing-message-CFjlYpMw.js";
import { i as createChannelReplyPipeline } from "../../reply-pipeline-BKuDvmoC.js";
import { t as setGoogleChatRuntime } from "../../runtime-api-oXz0r4fb.js";
import {
  a as warnMissingProviderGroupPolicyFallbackOnce,
  n as resolveAllowlistProviderRuntimeGroupPolicy,
  r as resolveDefaultGroupPolicy,
  t as GROUP_POLICY_BLOCKED_LABEL,
} from "../../runtime-group-policy-DMVwAExj.js";
import { t as chunkTextForOutbound } from "../../text-chunking-B9AReq3e.js";
import { t as jsonResult } from "../../tool-results-DtJKrUlx.js";
import { t as extractToolSend } from "../../tool-send-CZN1kbZn.js";
import { cr as PluginRuntime } from "../../types-Ga3mNO_F.js";
import {
  rt as GoogleChatConfig,
  tt as GoogleChatAccountConfig,
} from "../../types.channels-CYB_Xphv.js";
import {
  P as ChannelStatusIssue,
  v as ChannelMessageActionAdapter,
} from "../../types.core-CcwzPNhX.js";
import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";
import { t as ChannelMessageActionName } from "../../types.public-CV2EbDei.js";
import { n as resolveWebhookPath } from "../../webhook-path-DJByLAD7.js";
import {
  i as WebhookInFlightLimiter,
  l as readJsonWebhookBodyOrReject,
  s as createWebhookInFlightLimiter,
} from "../../webhook-request-guards-DAKACTVp.js";
import {
  o as registerWebhookTargetWithPluginRoute,
  p as withResolvedWebhookRequestPipeline,
  u as resolveWebhookTargetWithAuthOrReject,
} from "../../webhook-targets-Cdb7p6Gs.js";
export {
  type ChannelMessageActionAdapter,
  type ChannelMessageActionName,
  type ChannelStatusIssue,
  DEFAULT_ACCOUNT_ID,
  GROUP_POLICY_BLOCKED_LABEL,
  type GoogleChatAccountConfig,
  type GoogleChatConfig,
  GoogleChatConfigSchema,
  type OpenClawConfig,
  PAIRING_APPROVED_MESSAGE,
  type PluginRuntime,
  type WebhookInFlightLimiter,
  buildChannelConfigSchema,
  chunkTextForOutbound,
  createAccountStatusSink,
  createActionGate,
  createChannelReplyPipeline as createChannelMessageReplyPipeline,
  createChannelPairingController,
  createWebhookInFlightLimiter,
  extractToolSend,
  fetchWithSsrFGuard,
  isDangerousNameMatchingEnabled,
  jsonResult,
  missingTargetError,
  readJsonWebhookBodyOrReject,
  readNumberParam,
  readReactionParams,
  readStringParam,
  registerWebhookTargetWithPluginRoute,
  resolveAllowlistProviderRuntimeGroupPolicy,
  resolveDefaultGroupPolicy,
  resolveInboundMentionDecision,
  resolveInboundRouteEnvelopeBuilderWithRuntime,
  resolveWebhookPath,
  resolveWebhookTargetWithAuthOrReject,
  runPassiveAccountLifecycle,
  setGoogleChatRuntime,
  warnMissingProviderGroupPolicyFallbackOnce,
  withResolvedWebhookRequestPipeline,
};
