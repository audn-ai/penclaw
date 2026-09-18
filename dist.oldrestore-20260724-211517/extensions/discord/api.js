import { t as inspectDiscordAccount } from "../../account-inspect-BcQfhg2x.js";
import {
  a as mergeDiscordAccountConfig,
  f as resolveDiscordMaxLinesPerMessage,
  i as listEnabledDiscordAccounts,
  l as resolveDiscordAccountConfig,
  o as resolveDefaultDiscordAccountId,
  r as listDiscordAccountIds,
  s as resolveDiscordAccount,
  t as createDiscordActionGate,
} from "../../accounts-BNPpAWWI.js";
import {
  i as requestDiscord,
  n as DiscordApiError,
  r as fetchDiscord,
} from "../../api-BRW47agJ.js";
import {
  i as resolveDiscordGroupToolPolicy,
  n as collectDiscordStatusIssues,
  r as resolveDiscordGroupRequireMention,
  t as discordPlugin,
} from "../../channel-B2Kjq1ah.js";
import { t as discordSetupPlugin } from "../../channel.setup-DRqXCU_e.js";
import {
  a as buildDiscordComponentMessageFlags,
  c as resolveDiscordComponentAttachmentName,
  d as buildDiscordComponentCustomId,
  f as buildDiscordModalCustomId,
  g as parseDiscordModalCustomIdForInteraction,
  h as parseDiscordModalCustomId,
  i as buildDiscordComponentMessage,
  l as DISCORD_COMPONENT_CUSTOM_ID_KEY,
  m as parseDiscordComponentCustomIdForInteraction,
  n as DiscordFormModal,
  o as DISCORD_COMPONENT_ATTACHMENT_PREFIX,
  p as parseDiscordComponentCustomId,
  r as createDiscordFormModal,
  s as readDiscordComponentSpec,
  t as formatDiscordComponentEventText,
  u as DISCORD_MODAL_CUSTOM_ID_KEY,
} from "../../components-Dpcn95GZ.js";
import {
  n as listDiscordDirectoryPeersFromConfig,
  t as listDiscordDirectoryGroupsFromConfig,
} from "../../directory-config-DnfhXHW9.js";
import {
  i as shouldSuppressLocalDiscordExecApprovalPrompt,
  n as isDiscordExecApprovalApprover,
  r as isDiscordExecApprovalClientEnabled,
  t as getDiscordExecApprovalApprovers,
} from "../../exec-approvals-JsUj23LJ.js";
import { t as tryHandleDiscordMessageActionGuildAdmin } from "../../handle-action.guild-admin-Crd3m1RK.js";
import {
  i as normalizeDiscordOutboundTarget,
  n as looksLikeDiscordTargetId,
  r as normalizeDiscordMessagingTarget,
} from "../../normalize-DJhKR5QW.js";
import "../../targets-C9fFpaW3.js";
import { t as fetchPluralKitMessageInfo } from "../../pluralkit-DTesUqtM.js";
import {
  a as resolveDiscordPrivilegedIntentsFromFlags,
  i as probeDiscord,
  n as fetchDiscordApplicationSummary,
  r as parseApplicationIdFromToken,
  t as fetchDiscordApplicationId,
} from "../../probe-C2UFNDLR.js";
import { i as resolveOpenProviderRuntimeGroupPolicy } from "../../runtime-group-policy-BEjP88cf.js";
import { t as collectDiscordSecurityAuditFindings } from "../../security-audit-BClHQT0S.js";
import { t as normalizeExplicitDiscordSessionKey } from "../../session-key-normalization-cpGaWbhW.js";
import { t as buildDiscordInteractiveComponents } from "../../shared-interactive-DZQigUf4.js";
import {
  n as handleDiscordSubagentEnded,
  r as handleDiscordSubagentSpawning,
  t as handleDiscordSubagentDeliveryTarget,
} from "../../subagent-hooks-D57bCagl.js";
import {
  n as resolveDiscordChannelId,
  t as parseDiscordTarget,
} from "../../target-parsing-DA2e4aeg.js";
import {
  n as resolveDiscordTarget,
  r as parseDiscordSendTarget,
} from "../../target-resolver-DaaelveM.js";
import {
  i as DISCORD_DEFAULT_LISTENER_TIMEOUT_MS,
  n as DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS,
  o as mergeAbortSignals,
  r as DISCORD_DEFAULT_INBOUND_WORKER_TIMEOUT_MS,
  t as DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS,
} from "../../timeouts-Bj-qI9VL.js";
//#region extensions/discord/api.ts
const handleDiscordMessageAction = async (...args) =>
  (await import("../../channel-actions.runtime-DwHgZLNF.js")).handleDiscordMessageAction(...args);
//#endregion
export {
  DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS,
  DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS,
  DISCORD_COMPONENT_ATTACHMENT_PREFIX,
  DISCORD_COMPONENT_CUSTOM_ID_KEY,
  DISCORD_DEFAULT_INBOUND_WORKER_TIMEOUT_MS,
  DISCORD_DEFAULT_LISTENER_TIMEOUT_MS,
  DISCORD_MODAL_CUSTOM_ID_KEY,
  DiscordApiError,
  DiscordFormModal,
  buildDiscordComponentCustomId,
  buildDiscordComponentMessage,
  buildDiscordComponentMessageFlags,
  buildDiscordInteractiveComponents,
  buildDiscordModalCustomId,
  collectDiscordSecurityAuditFindings,
  collectDiscordStatusIssues,
  createDiscordActionGate,
  createDiscordFormModal,
  discordPlugin,
  discordSetupPlugin,
  fetchDiscord,
  fetchDiscordApplicationId,
  fetchDiscordApplicationSummary,
  fetchPluralKitMessageInfo,
  formatDiscordComponentEventText,
  getDiscordExecApprovalApprovers,
  handleDiscordMessageAction,
  handleDiscordSubagentDeliveryTarget,
  handleDiscordSubagentEnded,
  handleDiscordSubagentSpawning,
  inspectDiscordAccount,
  isDiscordExecApprovalApprover,
  isDiscordExecApprovalClientEnabled,
  listDiscordAccountIds,
  listDiscordDirectoryGroupsFromConfig,
  listDiscordDirectoryPeersFromConfig,
  listEnabledDiscordAccounts,
  looksLikeDiscordTargetId,
  mergeAbortSignals,
  mergeDiscordAccountConfig,
  normalizeDiscordMessagingTarget,
  normalizeDiscordOutboundTarget,
  normalizeExplicitDiscordSessionKey,
  parseApplicationIdFromToken,
  parseDiscordComponentCustomId,
  parseDiscordComponentCustomIdForInteraction as parseDiscordComponentCustomIdForCarbon,
  parseDiscordComponentCustomIdForInteraction,
  parseDiscordModalCustomId,
  parseDiscordModalCustomIdForInteraction as parseDiscordModalCustomIdForCarbon,
  parseDiscordModalCustomIdForInteraction,
  parseDiscordSendTarget,
  parseDiscordTarget,
  probeDiscord,
  readDiscordComponentSpec,
  requestDiscord,
  resolveDefaultDiscordAccountId,
  resolveDiscordAccount,
  resolveDiscordAccountConfig,
  resolveDiscordChannelId,
  resolveDiscordComponentAttachmentName,
  resolveDiscordGroupRequireMention,
  resolveDiscordGroupToolPolicy,
  resolveDiscordMaxLinesPerMessage,
  resolveDiscordPrivilegedIntentsFromFlags,
  resolveOpenProviderRuntimeGroupPolicy as resolveDiscordRuntimeGroupPolicy,
  resolveDiscordTarget,
  shouldSuppressLocalDiscordExecApprovalPrompt,
  tryHandleDiscordMessageActionGuildAdmin,
};
