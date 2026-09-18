import { n as normalizeAccountId } from "../account-id-C7N4Rwku.js";
import {
  a as mapAllowlistResolutionInputs,
  n as formatNormalizedAllowFromEntries,
  t as formatAllowFromLowercase,
} from "../allow-from-BCaLdTTU.js";
import {
  a as createHybridChannelConfigBase,
  c as createScopedChannelConfigBase,
  d as createTopLevelChannelConfigBase,
  i as createHybridChannelConfigAdapter,
  l as createScopedDmSecurityResolver,
  m as mapAllowFromEntries,
  o as createScopedAccountConfigAccessors,
  s as createScopedChannelConfigAdapter,
  u as createTopLevelChannelConfigAdapter,
} from "../channel-config-helpers-BFvX3ldW.js";
import { t as createAccountStatusSink } from "../channel-lifecycle.core-BZ1pethE.js";
import {
  A as projectAccountWarningCollector,
  C as createAllowlistProviderRestrictSendersWarningCollector,
  D as createOpenProviderConfiguredRouteWarningCollector,
  E as createOpenGroupPolicyRestrictSendersWarningCollector,
  M as projectConfigWarningCollector,
  N as projectWarningCollector,
  O as createOpenProviderGroupPolicyWarningCollector,
  S as createAllowlistProviderOpenWarningCollector,
  T as createConditionalWarningCollector,
  _ as collectOpenGroupPolicyRouteAllowlistWarnings,
  a as buildChannelGroupsScopeTree,
  b as composeWarningCollectors,
  c as resolveScopeRequireMention,
  d as buildOpenGroupPolicyRestrictSendersWarning,
  f as buildOpenGroupPolicyWarning,
  g as collectOpenGroupPolicyRestrictSendersWarnings,
  h as collectOpenGroupPolicyConfiguredRouteWarnings,
  i as normalizeAllowFromList,
  j as projectConfigAccountIdWarningCollector,
  k as projectAccountConfigWarningCollector,
  l as resolveScopeToolsPolicy,
  m as collectAllowlistProviderRestrictSendersWarnings,
  n as createDangerousNameMatchingMutableAllowlistWarningCollector,
  o as resolveScopeIntroHint,
  p as collectAllowlistProviderGroupPolicyWarnings,
  r as createRestrictSendersChannelSecurity,
  s as resolveScopeKeyCaseInsensitive,
  t as coerceNativeSetting,
  u as buildOpenGroupPolicyConfigureRouteAllowlistWarning,
  v as collectOpenProviderGroupPolicyWarnings,
  w as createAllowlistProviderRouteAllowlistWarningCollector,
  x as createAllowlistProviderGroupPolicyWarningCollector,
  y as composeAccountWarningCollectors,
} from "../channel-policy-DXOn_tKS.js";
import { n as resolveControlCommandGate } from "../command-gating-65fgTdwb.js";
import { r as emptyPluginConfigSchema } from "../config-schema-D48VtTjI.js";
import {
  a as buildNestedDmConfigSchema,
  i as buildJsonChannelConfigSchema,
  n as buildCatchallMultiAccountChannelSchema,
  r as buildChannelConfigSchema,
  t as AllowFromListSchema,
} from "../config-schema-qmCQZl6j.js";
import {
  n as delegateCompactionToRuntime,
  t as buildMemorySystemPromptAddition,
} from "../delegate-DXtLyRKu.js";
import { m as onDiagnosticEvent } from "../diagnostic-events-5-gsFhkM.js";
import {
  a as listDirectoryEntriesFromSources,
  c as listDirectoryUserEntriesFromAllowFrom,
  d as listResolvedDirectoryEntriesFromSources,
  f as listResolvedDirectoryGroupEntriesFromMapKeys,
  i as createResolvedDirectoryEntriesLister,
  l as listDirectoryUserEntriesFromAllowFromAndMapKeys,
  m as toDirectoryEntries,
  n as collectNormalizedDirectoryIds,
  o as listDirectoryGroupEntriesFromMapKeys,
  p as listResolvedDirectoryUserEntriesFromAllowFrom,
  r as createInspectedDirectoryEntriesLister,
  s as listDirectoryGroupEntriesFromMapKeysAndAllowFrom,
  t as applyDirectoryQueryAndLimit,
  u as listInspectedDirectoryEntriesFromSources,
} from "../directory-config-helpers-6PdjajJm.js";
import {
  a as nullChannelDirectorySelf,
  i as emptyChannelDirectoryList,
  n as createChannelDirectoryAdapter,
  r as createEmptyChannelDirectoryAdapter,
} from "../directory-runtime-VSo_cGzY.js";
import {
  a as resolveDmGroupAccessWithCommandGate,
  c as resolveOpenDmAllowlistAccess,
  n as readStoreAllowFromForDmPolicy,
  o as resolveDmGroupAccessWithLists,
  s as resolveEffectiveAllowFromLists,
  t as DM_GROUP_ACCESS_REASON,
} from "../dm-policy-shared-d7KFGRtT.js";
import {
  a as resolveSenderScopedGroupPolicy,
  i as evaluateSenderGroupAccessForPolicy,
  t as evaluateGroupRouteAccessForPolicy,
} from "../group-access-CyF0dAER.js";
import {
  a as resolveToolsBySender,
  n as resolveChannelGroupRequireMention,
  r as resolveChannelGroupToolsPolicy,
  t as resolveChannelGroupPolicy,
} from "../group-policy-7QrY--DR.js";
import { t as buildAccountScopedDmSecurityPolicy } from "../helpers-BzNF0htn.js";
import "../temp-path-DYqJUh96.js";
import {
  a as buildHistoryContextFromMap,
  c as buildPendingHistoryContextFromMap,
  d as evictOldHistoryKeys,
  f as normalizeHistoryMediaEntries,
  h as recordPendingHistoryEntryWithMedia,
  i as buildHistoryContextFromEntries,
  l as clearHistoryEntries,
  m as recordPendingHistoryEntryIfEnabled,
  n as HISTORY_CONTEXT_MARKER,
  o as buildInboundHistoryFromEntries,
  p as recordPendingHistoryEntry,
  r as buildHistoryContext,
  s as buildInboundHistoryFromMap,
  t as DEFAULT_GROUP_HISTORY_LIMIT,
  u as clearHistoryEntriesIfEnabled,
} from "../history-DdfM33Aj.js";
import { t as KeyedAsyncQueue } from "../keyed-async-queue-CTreGrmR.js";
import {
  i as writeOAuthCredentials,
  n as buildApiKeyCredential,
  r as upsertApiKeyProfile,
  t as applyAuthProfileConfig,
} from "../provider-auth-helpers-CLs4Yz61.js";
import { t as inspectReadOnlyChannelAccount } from "../read-only-account-inspect-CqkOfkZb.js";
import { i as registerContextEngine } from "../registry-DXbEDAsr.js";
import { t as createChannelHistoryWindow } from "../reply-history-DTabwFaD.js";
import "../channel-reply-core-CgYU70ZA.js";
import {
  n as resolveChannelSourceReplyDeliveryMode$1,
  t as createChannelReplyPipeline$1,
} from "../reply-pipeline-uYpC1TSz.js";
import {
  n as createReplyPrefixOptions$1,
  t as createReplyPrefixContext$1,
} from "../reply-prefix-C5dokQJN.js";
import { t as createRuntimeDirectoryLiveAdapter } from "../runtime-forwarders-Dxil5z45.js";
import "../channel-config-schema-C-vJvjtu.js";
import { t as createPluginRuntimeStore } from "../runtime-store-uAKGMqTs.js";
import { n as resolvePreferredOpenClawTmpDir } from "../tmp-openclaw-dir-uPgNO8da.js";
import { o as optionalStringEnum, s as stringEnum } from "../typebox-D411BFJf.js";
import { t as createTypingCallbacks$1 } from "../typing-DnYJejsM.js";
import { l as ToolPolicySchema } from "../zod-schema.agent-runtime-D8C103DW.js";
import {
  C as ReplyRuntimeConfigSchemaShape,
  H as requireAllowlistAllowFrom,
  U as requireOpenAllowFrom,
  _ as MarkdownConfigSchema,
  c as DmPolicySchema,
  d as GroupPolicySchema,
  n as BlockStreamingCoalesceSchema,
  o as ContextVisibilityModeSchema,
  s as DmConfigSchema,
  v as MentionPatternsPolicySchema,
} from "../zod-schema.core-CWTCY1ZZ.js";
//#region src/plugin-sdk/compat.ts
/**
 * @deprecated Legacy compat surface for external plugins that still depend on
 * older broad plugin-sdk imports. Use focused openclaw/plugin-sdk subpaths
 * instead.
 */
if (
  process.env.VITEST !== "true" &&
  process.env.OPENCLAW_SUPPRESS_PLUGIN_SDK_COMPAT_WARNING !== "1"
)
  process.emitWarning(
    "openclaw/plugin-sdk/compat is deprecated for new plugins. Migrate to focused openclaw/plugin-sdk/<subpath> imports. See https://docs.openclaw.ai/plugins/sdk-migration",
    {
      code: "OPENCLAW_PLUGIN_SDK_COMPAT_DEPRECATED",
      detail:
        "Bundled plugins must use scoped plugin-sdk subpaths. External plugins may keep compat temporarily while migrating. Migration guide: https://docs.openclaw.ai/plugins/sdk-migration",
    },
  );
/** @deprecated Use `openclaw/plugin-sdk/channel-outbound`. */
const createChannelReplyPipeline = createChannelReplyPipeline$1;
/** @deprecated Use `openclaw/plugin-sdk/channel-outbound`. */
const createReplyPrefixContext = createReplyPrefixContext$1;
/** @deprecated Use `openclaw/plugin-sdk/channel-outbound`. */
const createReplyPrefixOptions = createReplyPrefixOptions$1;
/** @deprecated Use `openclaw/plugin-sdk/channel-outbound`. */
const createTypingCallbacks = createTypingCallbacks$1;
/** @deprecated Use `openclaw/plugin-sdk/channel-outbound`. */
const resolveChannelSourceReplyDeliveryMode = resolveChannelSourceReplyDeliveryMode$1;
//#endregion
export {
  AllowFromListSchema,
  BlockStreamingCoalesceSchema,
  ContextVisibilityModeSchema,
  DEFAULT_GROUP_HISTORY_LIMIT,
  DM_GROUP_ACCESS_REASON,
  DmConfigSchema,
  DmPolicySchema,
  GroupPolicySchema,
  HISTORY_CONTEXT_MARKER,
  KeyedAsyncQueue,
  MarkdownConfigSchema,
  MentionPatternsPolicySchema,
  ReplyRuntimeConfigSchemaShape,
  ToolPolicySchema,
  applyAuthProfileConfig,
  applyDirectoryQueryAndLimit,
  buildAccountScopedDmSecurityPolicy,
  buildApiKeyCredential,
  buildCatchallMultiAccountChannelSchema,
  buildChannelConfigSchema,
  buildChannelGroupsScopeTree,
  buildHistoryContext,
  buildHistoryContextFromEntries,
  buildHistoryContextFromMap,
  buildInboundHistoryFromEntries,
  buildInboundHistoryFromMap,
  buildJsonChannelConfigSchema,
  buildMemorySystemPromptAddition,
  buildNestedDmConfigSchema,
  buildOpenGroupPolicyConfigureRouteAllowlistWarning,
  buildOpenGroupPolicyRestrictSendersWarning,
  buildOpenGroupPolicyWarning,
  buildPendingHistoryContextFromMap,
  clearHistoryEntries,
  clearHistoryEntriesIfEnabled,
  coerceNativeSetting,
  collectAllowlistProviderGroupPolicyWarnings,
  collectAllowlistProviderRestrictSendersWarnings,
  collectNormalizedDirectoryIds,
  collectOpenGroupPolicyConfiguredRouteWarnings,
  collectOpenGroupPolicyRestrictSendersWarnings,
  collectOpenGroupPolicyRouteAllowlistWarnings,
  collectOpenProviderGroupPolicyWarnings,
  composeAccountWarningCollectors,
  composeWarningCollectors,
  createAccountStatusSink,
  createAllowlistProviderGroupPolicyWarningCollector,
  createAllowlistProviderOpenWarningCollector,
  createAllowlistProviderRestrictSendersWarningCollector,
  createAllowlistProviderRouteAllowlistWarningCollector,
  createChannelDirectoryAdapter,
  createChannelHistoryWindow,
  createChannelReplyPipeline,
  createConditionalWarningCollector,
  createDangerousNameMatchingMutableAllowlistWarningCollector,
  createEmptyChannelDirectoryAdapter,
  createHybridChannelConfigAdapter,
  createHybridChannelConfigBase,
  createInspectedDirectoryEntriesLister,
  createOpenGroupPolicyRestrictSendersWarningCollector,
  createOpenProviderConfiguredRouteWarningCollector,
  createOpenProviderGroupPolicyWarningCollector,
  createPluginRuntimeStore,
  createReplyPrefixContext,
  createReplyPrefixOptions,
  createResolvedDirectoryEntriesLister,
  createRestrictSendersChannelSecurity,
  createRuntimeDirectoryLiveAdapter,
  createScopedAccountConfigAccessors,
  createScopedChannelConfigAdapter,
  createScopedChannelConfigBase,
  createScopedDmSecurityResolver,
  createTopLevelChannelConfigAdapter,
  createTopLevelChannelConfigBase,
  createTypingCallbacks,
  delegateCompactionToRuntime,
  emptyChannelDirectoryList,
  emptyPluginConfigSchema,
  evaluateGroupRouteAccessForPolicy,
  evaluateSenderGroupAccessForPolicy,
  evictOldHistoryKeys,
  formatAllowFromLowercase,
  formatNormalizedAllowFromEntries,
  inspectReadOnlyChannelAccount,
  listDirectoryEntriesFromSources,
  listDirectoryGroupEntriesFromMapKeys,
  listDirectoryGroupEntriesFromMapKeysAndAllowFrom,
  listDirectoryUserEntriesFromAllowFrom,
  listDirectoryUserEntriesFromAllowFromAndMapKeys,
  listInspectedDirectoryEntriesFromSources,
  listResolvedDirectoryEntriesFromSources,
  listResolvedDirectoryGroupEntriesFromMapKeys,
  listResolvedDirectoryUserEntriesFromAllowFrom,
  mapAllowFromEntries,
  mapAllowlistResolutionInputs,
  normalizeAccountId,
  normalizeAllowFromList,
  normalizeHistoryMediaEntries,
  nullChannelDirectorySelf,
  onDiagnosticEvent,
  optionalStringEnum,
  projectAccountConfigWarningCollector,
  projectAccountWarningCollector,
  projectConfigAccountIdWarningCollector,
  projectConfigWarningCollector,
  projectWarningCollector,
  readStoreAllowFromForDmPolicy,
  recordPendingHistoryEntry,
  recordPendingHistoryEntryIfEnabled,
  recordPendingHistoryEntryWithMedia,
  registerContextEngine,
  requireAllowlistAllowFrom,
  requireOpenAllowFrom,
  resolveChannelGroupPolicy,
  resolveChannelGroupRequireMention,
  resolveChannelGroupToolsPolicy,
  resolveChannelSourceReplyDeliveryMode,
  resolveControlCommandGate,
  resolveDmGroupAccessWithCommandGate,
  resolveDmGroupAccessWithLists,
  resolveEffectiveAllowFromLists,
  resolveOpenDmAllowlistAccess,
  resolvePreferredOpenClawTmpDir,
  resolveScopeIntroHint,
  resolveScopeKeyCaseInsensitive,
  resolveScopeRequireMention,
  resolveScopeToolsPolicy,
  resolveSenderScopedGroupPolicy,
  resolveToolsBySender,
  stringEnum,
  toDirectoryEntries,
  upsertApiKeyProfile,
  writeOAuthCredentials,
};
