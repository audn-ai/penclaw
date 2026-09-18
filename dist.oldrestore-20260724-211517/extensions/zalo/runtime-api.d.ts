import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "../../account-id-Dh6XMgGH.js";
import {
  a as isNormalizedSenderAllowed,
  n as formatAllowFromLowercase,
} from "../../allow-from-pHkm65RH.js";
import { r as createChannelPairingController } from "../../channel-pairing-BkMDkN6g.js";
import { E as readStringParam } from "../../common-CuQ9SS3Z.js";
import { r as buildChannelConfigSchema } from "../../config-schema-CpUUoa8V.js";
import { r as createDedupeCache } from "../../dedupe-DlnrYV_t.js";
import { n as formatPairingApproveHint } from "../../helpers-D1ImsQvd.js";
import { n as registerPluginHttpRoute } from "../../http-registry-Bu61EERF.js";
import { r as resolveInboundRouteEnvelopeBuilderWithRuntime } from "../../inbound-envelope-CyqvCT28.js";
import { i as logTypingFailure } from "../../logging-yk8JlYZb.js";
import { i as resolveClientIp } from "../../net-F7HGAsK5.js";
import { t as PAIRING_APPROVED_MESSAGE } from "../../pairing-message-CFjlYpMw.js";
import { i as WizardPrompter } from "../../prompts-CWXx5gsI.js";
import {
  c as deliverTextOrMediaReply,
  p as isNumericTargetId,
  r as ReplyPayload,
  t as OutboundReplyPayload,
  w as sendPayloadWithChunkedTextAndMedia,
} from "../../reply-payload-D9hNZyN3.js";
import { i as createChannelReplyPipeline } from "../../reply-pipeline-BKuDvmoC.js";
import { n as RuntimeEnv } from "../../runtime-Bxifh4bY.js";
import {
  a as warnMissingProviderGroupPolicyFallbackOnce,
  i as resolveOpenProviderRuntimeGroupPolicy,
  r as resolveDefaultGroupPolicy,
} from "../../runtime-group-policy-DMVwAExj.js";
import { r as buildSecretInputSchema } from "../../secret-input-DJdNimOo.js";
import {
  n as applySetupAccountConfigPatch,
  s as migrateBaseNameToDefaultAccount,
  t as applyAccountNameToChannelSection,
} from "../../setup-helpers-CD5ZaV-J.js";
import {
  D as mergeAllowFromEntries,
  J as runSingleChannelSecretStep,
  U as promptSingleChannelSecretInput,
  d as buildSingleChannelSecretPromptState,
  it as setTopLevelChannelDmPolicyWithAllowFrom,
  u as addWildcardAllowFrom,
} from "../../setup-wizard-binary-CUAlIYEv.js";
import {
  o as buildTokenChannelStatusSummary,
  t as buildBaseAccountStatusSnapshot,
} from "../../status-helpers-D0-IqnB6.js";
import { t as chunkTextForOutbound } from "../../text-chunking-B9AReq3e.js";
import { t as jsonResult } from "../../tool-results-DtJKrUlx.js";
import { cr as PluginRuntime } from "../../types-Ga3mNO_F.js";
import { C as MarkdownTableMode, v as GroupPolicy } from "../../types.base-ibSxQuK3.js";
import {
  P as ChannelStatusIssue,
  n as BaseTokenResolution,
  r as ChannelAccountSnapshot,
  t as BaseProbeResult,
  v as ChannelMessageActionAdapter,
} from "../../types.core-CcwzPNhX.js";
import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";
import { t as ChannelPlugin } from "../../types.plugin-BGk2f9vp.js";
import { t as ChannelMessageActionName } from "../../types.public-CV2EbDei.js";
import {
  E as normalizeSecretInputString,
  T as normalizeResolvedSecretInputString,
  d as SecretInput,
  x as hasConfiguredSecretInput,
} from "../../types.secrets-C15Z_eLX.js";
import { r as waitForAbortSignal } from "../../unhandled-rejections-BOL8_RjF.js";
import { n as resolveWebhookPath } from "../../webhook-path-DJByLAD7.js";
import {
  a as applyBasicWebhookRequestGuards,
  h as WEBHOOK_RATE_LIMIT_DEFAULTS,
  l as readJsonWebhookBodyOrReject,
  p as WEBHOOK_ANOMALY_COUNTER_DEFAULTS,
  v as createFixedWindowRateLimiter,
  y as createWebhookAnomalyTracker,
} from "../../webhook-request-guards-DAKACTVp.js";
import {
  a as registerWebhookTarget,
  d as resolveWebhookTargetWithAuthOrRejectSync,
  n as RegisterWebhookTargetOptions,
  o as registerWebhookTargetWithPluginRoute,
  p as withResolvedWebhookRequestPipeline,
  t as RegisterWebhookPluginRouteOptions,
} from "../../webhook-targets-Cdb7p6Gs.js";

//#region extensions/zalo/src/runtime.d.ts
declare const setZaloRuntime: (next: PluginRuntime) => void, getZaloRuntime: () => PluginRuntime;
//#endregion
export {
  type BaseProbeResult,
  type BaseTokenResolution,
  type ChannelAccountSnapshot,
  type ChannelMessageActionAdapter,
  type ChannelMessageActionName,
  type ChannelPlugin,
  type ChannelStatusIssue,
  DEFAULT_ACCOUNT_ID,
  type GroupPolicy,
  type MarkdownTableMode,
  type OpenClawConfig,
  type OutboundReplyPayload,
  PAIRING_APPROVED_MESSAGE,
  type PluginRuntime,
  type RegisterWebhookPluginRouteOptions,
  type RegisterWebhookTargetOptions,
  type ReplyPayload,
  type RuntimeEnv,
  type SecretInput,
  WEBHOOK_ANOMALY_COUNTER_DEFAULTS,
  WEBHOOK_RATE_LIMIT_DEFAULTS,
  type WizardPrompter,
  addWildcardAllowFrom,
  applyAccountNameToChannelSection,
  applyBasicWebhookRequestGuards,
  applySetupAccountConfigPatch,
  buildBaseAccountStatusSnapshot,
  buildChannelConfigSchema,
  buildSecretInputSchema,
  buildSingleChannelSecretPromptState,
  buildTokenChannelStatusSummary,
  chunkTextForOutbound,
  createChannelReplyPipeline as createChannelMessageReplyPipeline,
  createChannelPairingController,
  createDedupeCache,
  createFixedWindowRateLimiter,
  createWebhookAnomalyTracker,
  deliverTextOrMediaReply,
  formatAllowFromLowercase,
  formatPairingApproveHint,
  hasConfiguredSecretInput,
  isNormalizedSenderAllowed,
  isNumericTargetId,
  jsonResult,
  logTypingFailure,
  mergeAllowFromEntries,
  migrateBaseNameToDefaultAccount,
  normalizeAccountId,
  normalizeResolvedSecretInputString,
  normalizeSecretInputString,
  promptSingleChannelSecretInput,
  readJsonWebhookBodyOrReject,
  readStringParam,
  registerPluginHttpRoute,
  registerWebhookTarget,
  registerWebhookTargetWithPluginRoute,
  resolveClientIp,
  resolveDefaultGroupPolicy,
  resolveInboundRouteEnvelopeBuilderWithRuntime,
  resolveOpenProviderRuntimeGroupPolicy,
  resolveWebhookPath,
  resolveWebhookTargetWithAuthOrRejectSync,
  runSingleChannelSecretStep,
  sendPayloadWithChunkedTextAndMedia,
  setTopLevelChannelDmPolicyWithAllowFrom,
  setZaloRuntime,
  waitForAbortSignal,
  warnMissingProviderGroupPolicyFallbackOnce,
  withResolvedWebhookRequestPipeline,
};
