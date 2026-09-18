import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "../../account-id-Dh6XMgGH.js";
import {
  f as mergeAllowlist,
  m as summarizeMapping,
  n as formatAllowFromLowercase,
} from "../../allow-from-pHkm65RH.js";
import {
  i as createZalouserTool,
  n as createZalouserSetupWizardProxy,
  r as zalouserSetupAdapter,
  t as zalouserSetupWizard,
} from "../../api-D6DQfMIa.js";
import { t as zalouserPlugin } from "../../channel-Cva3Py-m.js";
import { r as createChannelPairingController } from "../../channel-pairing-BkMDkN6g.js";
import { t as zalouserSetupPlugin } from "../../channel.setup-hVH7alL_.js";
import { r as buildChannelConfigSchema } from "../../config-schema-CpUUoa8V.js";
import { n as isDangerousNameMatchingEnabled } from "../../dangerous-name-matching-BbYdI4i4.js";
import { p as resolveInboundMentionDecision } from "../../mention-gating-D6dFDlTf.js";
import { l as loadOutboundMediaFromUrl } from "../../outbound-media-DZqZ5CXA.js";
import { a as AnyAgentTool } from "../../plugin-entry-DPCR66aO.js";
import {
  c as deliverTextOrMediaReply,
  p as isNumericTargetId,
  r as ReplyPayload,
  t as OutboundReplyPayload,
  v as resolveSendableOutboundReplyParts,
  w as sendPayloadWithChunkedTextAndMedia,
} from "../../reply-payload-D9hNZyN3.js";
import { i as createChannelReplyPipeline } from "../../reply-pipeline-BKuDvmoC.js";
import { n as RuntimeEnv } from "../../runtime-Bxifh4bY.js";
import {
  a as warnMissingProviderGroupPolicyFallbackOnce,
  i as resolveOpenProviderRuntimeGroupPolicy,
  r as resolveDefaultGroupPolicy,
} from "../../runtime-group-policy-DMVwAExj.js";
import {
  n as isZalouserMutableGroupEntry,
  t as collectZalouserSecurityAuditFindings,
} from "../../security-audit-DHVCmSL2.js";
import { t as buildBaseAccountStatusSnapshot } from "../../status-helpers-D0-IqnB6.js";
import { t as chunkTextForOutbound } from "../../text-chunking-B9AReq3e.js";
import { r as resolvePreferredOpenClawTmpDir } from "../../tmp-openclaw-dir-ubX-9dkk.js";
import { Hl as OpenClawPluginToolContext, cr as PluginRuntime } from "../../types-Ga3mNO_F.js";
import { C as MarkdownTableMode } from "../../types.base-ibSxQuK3.js";
import {
  P as ChannelStatusIssue,
  m as ChannelGroupContext,
  r as ChannelAccountSnapshot,
  t as BaseProbeResult,
  u as ChannelDirectoryEntry,
  v as ChannelMessageActionAdapter,
} from "../../types.core-CcwzPNhX.js";
import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";
import { t as ChannelPlugin } from "../../types.plugin-BGk2f9vp.js";
import { ct as GroupToolPolicyConfig } from "../../types.slack-DOPma3IJ.js";

//#region extensions/zalouser/src/runtime.d.ts
declare const setZalouserRuntime: (next: PluginRuntime) => void,
  getZalouserRuntime: () => PluginRuntime;
//#endregion
export {
  type AnyAgentTool,
  type BaseProbeResult,
  type ChannelAccountSnapshot,
  type ChannelDirectoryEntry,
  type ChannelGroupContext,
  type ChannelMessageActionAdapter,
  type ChannelPlugin,
  type ChannelStatusIssue,
  DEFAULT_ACCOUNT_ID,
  type GroupToolPolicyConfig,
  type MarkdownTableMode,
  type OpenClawConfig,
  type OpenClawPluginToolContext,
  type OutboundReplyPayload,
  type PluginRuntime,
  type ReplyPayload,
  type RuntimeEnv,
  buildBaseAccountStatusSnapshot,
  buildChannelConfigSchema,
  chunkTextForOutbound,
  collectZalouserSecurityAuditFindings,
  createChannelReplyPipeline as createChannelMessageReplyPipeline,
  createChannelPairingController,
  createZalouserSetupWizardProxy,
  createZalouserTool,
  deliverTextOrMediaReply,
  formatAllowFromLowercase,
  isDangerousNameMatchingEnabled,
  isNumericTargetId,
  isZalouserMutableGroupEntry,
  loadOutboundMediaFromUrl,
  mergeAllowlist,
  normalizeAccountId,
  resolveDefaultGroupPolicy,
  resolveInboundMentionDecision,
  resolveOpenProviderRuntimeGroupPolicy,
  resolvePreferredOpenClawTmpDir,
  resolveSendableOutboundReplyParts,
  sendPayloadWithChunkedTextAndMedia,
  setZalouserRuntime,
  summarizeMapping,
  warnMissingProviderGroupPolicyFallbackOnce,
  zalouserPlugin,
  zalouserSetupAdapter,
  zalouserSetupPlugin,
  zalouserSetupWizard,
};
