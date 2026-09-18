import {
  a as resolveIMessageAccount,
  i as resolveDefaultIMessageAccountId,
  n as listEnabledIMessageAccounts,
  r as listIMessageAccountIds,
} from "../../accounts--1GXl2sX.js";
import {
  n as createIMessagePluginBase,
  r as imessageSetupWizard,
  t as imessagePlugin,
} from "../../channel-CS_vRxRo.js";
import {
  a as resolveServicePrefixedAllowTarget,
  c as resolveServicePrefixedTarget,
  i as parseChatTargetPrefixesOrThrow,
  o as resolveServicePrefixedChatTarget,
  r as parseChatAllowTargetPrefixes,
  s as resolveServicePrefixedOrChatAllowTarget,
  t as createAllowedChatSenderMatcher,
} from "../../chat-target-prefixes-S_PC73pM.js";
import { n as DEFAULT_IMESSAGE_PROBE_TIMEOUT_MS } from "../../client-B2SbygAK.js";
import {
  n as testing,
  t as createIMessageConversationBindingManager,
} from "../../conversation-bindings-KdKhZzib.js";
import {
  n as resolveIMessageGroupToolPolicy,
  t as resolveIMessageGroupRequireMention,
} from "../../group-policy-K3n-fVwn.js";
import {
  n as IMESSAGE_ACTIONS,
  r as IMESSAGE_ACTION_NAMES,
} from "../../message-tool-api-BjSMmkji.js";
import {
  n as normalizeIMessageMessagingTarget,
  t as looksLikeIMessageTargetId,
} from "../../normalize-D37IclcM.js";
import { t as IMESSAGE_LEGACY_OUTBOUND_SEND_DEP_KEYS } from "../../outbound-send-deps-B-QEsLSM.js";
import {
  a as resolveIMessageConversationIdFromTarget,
  i as normalizeIMessageAcpConversationId,
  n as resolveIMessageInboundConversationId,
  o as probeIMessage,
  p as imessageSetupAdapter,
  r as matchIMessageAcpConversation,
} from "../../sanitize-outbound-DuVgJyZw.js";
import {
  a as looksLikeIMessageExplicitTargetId,
  c as parseIMessageTarget,
  i as isAllowedIMessageSender,
  n as inferIMessageTargetChatType,
  o as normalizeIMessageHandle,
  s as parseIMessageAllowTarget,
  t as formatIMessageChatTarget,
} from "../../targets-BO9NhvfG.js";
//#region extensions/imessage/src/channel.setup.ts
const imessageSetupPlugin = {
  ...createIMessagePluginBase({
    setupWizard: imessageSetupWizard,
    setup: imessageSetupAdapter,
  }),
};
//#endregion
export {
  DEFAULT_IMESSAGE_PROBE_TIMEOUT_MS,
  IMESSAGE_ACTIONS,
  IMESSAGE_ACTION_NAMES,
  IMESSAGE_LEGACY_OUTBOUND_SEND_DEP_KEYS,
  testing as __testing,
  testing,
  createAllowedChatSenderMatcher,
  createIMessageConversationBindingManager,
  formatIMessageChatTarget,
  imessagePlugin,
  imessageSetupPlugin,
  inferIMessageTargetChatType,
  isAllowedIMessageSender,
  listEnabledIMessageAccounts,
  listIMessageAccountIds,
  looksLikeIMessageExplicitTargetId,
  looksLikeIMessageTargetId,
  matchIMessageAcpConversation,
  normalizeIMessageAcpConversationId,
  normalizeIMessageHandle,
  normalizeIMessageMessagingTarget,
  parseChatAllowTargetPrefixes,
  parseChatTargetPrefixesOrThrow,
  parseIMessageAllowTarget,
  parseIMessageTarget,
  probeIMessage,
  resolveDefaultIMessageAccountId,
  resolveIMessageAccount,
  resolveIMessageConversationIdFromTarget,
  resolveIMessageGroupRequireMention,
  resolveIMessageGroupToolPolicy,
  resolveIMessageInboundConversationId,
  resolveServicePrefixedAllowTarget,
  resolveServicePrefixedChatTarget,
  resolveServicePrefixedOrChatAllowTarget,
  resolveServicePrefixedTarget,
};
