import { n as normalizeAccountId } from "../account-id-Dh6XMgGH.js";
import {
  n as formatAllowFromLowercase,
  o as mapAllowlistResolutionInputs,
  r as formatNormalizedAllowFromEntries,
} from "../allow-from-pHkm65RH.js";
import {
  _ as mapAllowFromEntries,
  c as createHybridChannelConfigBase,
  d as createScopedChannelConfigBase,
  f as createScopedDmSecurityResolver,
  l as createScopedAccountConfigAccessors,
  m as createTopLevelChannelConfigBase,
  p as createTopLevelChannelConfigAdapter,
  s as createHybridChannelConfigAdapter,
  u as createScopedChannelConfigAdapter,
} from "../channel-config-helpers-WkGz1Ols.js";
import { i as createAccountStatusSink } from "../channel-lifecycle.core-CsQgW7Vx.js";
import {
  A as createOpenGroupPolicyRestrictSendersWarningCollector,
  C as composeAccountWarningCollectors,
  D as createAllowlistProviderRestrictSendersWarningCollector,
  E as createAllowlistProviderOpenWarningCollector,
  F as projectConfigAccountIdWarningCollector,
  I as projectConfigWarningCollector,
  L as projectWarningCollector,
  M as createOpenProviderGroupPolicyWarningCollector,
  N as projectAccountConfigWarningCollector,
  O as createAllowlistProviderRouteAllowlistWarningCollector,
  P as projectAccountWarningCollector,
  S as collectOpenProviderGroupPolicyWarnings,
  T as createAllowlistProviderGroupPolicyWarningCollector,
  _ as collectAllowlistProviderGroupPolicyWarnings,
  a as normalizeAllowFromList,
  b as collectOpenGroupPolicyRestrictSendersWarnings,
  c as ScopeTree,
  d as resolveScopeKeyCaseInsensitive,
  f as resolveScopeRequireMention,
  g as buildOpenGroupPolicyWarning,
  h as buildOpenGroupPolicyRestrictSendersWarning,
  i as createRestrictSendersChannelSecurity,
  j as createOpenProviderConfiguredRouteWarningCollector,
  k as createConditionalWarningCollector,
  l as buildChannelGroupsScopeTree,
  m as buildOpenGroupPolicyConfigureRouteAllowlistWarning,
  n as coerceNativeSetting,
  o as ScopeNode,
  p as resolveScopeToolsPolicy,
  r as createDangerousNameMatchingMutableAllowlistWarningCollector,
  s as ScopePath,
  t as ChannelMutableAllowlistCandidate,
  u as resolveScopeIntroHint,
  v as collectAllowlistProviderRestrictSendersWarnings,
  w as composeWarningCollectors,
  x as collectOpenGroupPolicyRouteAllowlistWarnings,
  y as collectOpenGroupPolicyConfiguredRouteWarnings,
} from "../channel-policy-CUWR6ifH.js";
import { i as resolveControlCommandGate } from "../command-gating-pUtyEXB1.js";
import {
  a as buildNestedDmConfigSchema,
  i as buildJsonChannelConfigSchema,
  n as buildCatchallMultiAccountChannelSchema,
  r as buildChannelConfigSchema,
  t as AllowFromListSchema,
} from "../config-schema-CpUUoa8V.js";
import {
  n as delegateCompactionToRuntime,
  t as buildMemorySystemPromptAddition,
} from "../delegate-BRW9iUXY.js";
import {
  Ht as onDiagnosticEvent,
  a as DiagnosticEventPayload,
} from "../diagnostic-events-CKz1uC46.js";
import {
  a as listDirectoryEntriesFromSources,
  c as listDirectoryUserEntriesFromAllowFrom,
  d as listResolvedDirectoryEntriesFromSources,
  f as listResolvedDirectoryGroupEntriesFromMapKeys,
  h as DirectoryConfigParams,
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
} from "../directory-config-helpers-CTohe1ti.js";
import {
  a as nullChannelDirectorySelf,
  i as emptyChannelDirectoryList,
  n as createChannelDirectoryAdapter,
  o as ReadOnlyInspectedAccount,
  r as createEmptyChannelDirectoryAdapter,
  s as inspectReadOnlyChannelAccount,
} from "../directory-runtime-D5PCOk6p.js";
import {
  c as resolveDmGroupAccessWithLists,
  i as readStoreAllowFromForDmPolicy,
  l as resolveEffectiveAllowFromLists,
  s as resolveDmGroupAccessWithCommandGate,
  t as DM_GROUP_ACCESS_REASON,
  u as resolveOpenDmAllowlistAccess,
} from "../dm-policy-shared-CbXY3hb3.js";
import {
  d as resolveSenderScopedGroupPolicy,
  s as evaluateGroupRouteAccessForPolicy,
  u as evaluateSenderGroupAccessForPolicy,
} from "../group-access-CPFAyWAD.js";
import {
  a as resolveToolsBySender,
  i as resolveChannelGroupToolsPolicy,
  n as resolveChannelGroupPolicy,
  r as resolveChannelGroupRequireMention,
  t as ChannelGroupPolicy,
} from "../group-policy-qBQEoR2A.js";
import { t as buildAccountScopedDmSecurityPolicy } from "../helpers-D1ImsQvd.js";
import { n as HistoryMediaEntry, t as HistoryEntry } from "../history.types-Bc8mCALh.js";
import { t as KeyedAsyncQueue } from "../keyed-async-queue-Co67NYfr.js";
import {
  c as MemoryPluginPublicArtifact,
  l as MemoryPluginPublicArtifactsProvider,
  s as MemoryPluginCapability,
} from "../memory-state-wPutFXhr.js";
import {
  a as upsertApiKeyProfile,
  i as buildApiKeyCredential,
  n as WriteOAuthCredentialsOptions,
  o as writeOAuthCredentials,
  r as applyAuthProfileConfig,
  t as ApiKeyStorageOptions,
} from "../provider-auth-helpers-CAyn28uR.js";
import {
  _ as createChannelHistoryWindow,
  a as buildHistoryContextFromMap,
  c as buildPendingHistoryContextFromMap,
  d as evictOldHistoryKeys,
  f as normalizeHistoryMediaEntries,
  g as ChannelHistoryWindow,
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
} from "../reply-history-DfqYX9xy.js";
import {
  a as resolveChannelSourceReplyDeliveryMode$1,
  i as createChannelReplyPipeline$1,
  r as ReplyPrefixContext$1,
  t as ChannelReplyPipeline$1,
} from "../reply-pipeline-BKuDvmoC.js";
import {
  c as createTypingCallbacks$1,
  i as createReplyPrefixOptions$1,
  n as ReplyPrefixOptions$1,
  o as CreateTypingCallbacksParams$1,
  r as createReplyPrefixContext$1,
  s as TypingCallbacks$1,
  t as ReplyPrefixContextBundle$1,
} from "../reply-prefix-CA4uLlTg.js";
import { t as createRuntimeDirectoryLiveAdapter } from "../runtime-forwarders-DHaRfdGg.js";
import { t as createPluginRuntimeStore } from "../runtime-store--LWaPMNf.js";
import { r as resolvePreferredOpenClawTmpDir } from "../tmp-openclaw-dir-ubX-9dkk.js";
import { o as optionalStringEnum, s as stringEnum } from "../typebox-WKHUFEwH.js";
import { a as SourceReplyDeliveryMode$1 } from "../types-BgrDi5xH.js";
import { Ys as emptyPluginConfigSchema, gc as registerContextEngine } from "../types-Ga3mNO_F.js";
import {
  d as ChannelDirectoryEntryKind,
  u as ChannelDirectoryEntry,
} from "../types.core-CcwzPNhX.js";
import {
  ct as GroupToolPolicyConfig,
  st as GroupToolPolicyBySenderConfig,
} from "../types.slack-DOPma3IJ.js";
import { t as ToolPolicySchema } from "../zod-schema.agent-runtime-CggBNRtv.js";
import {
  a as GroupPolicySchema,
  c as ReplyRuntimeConfigSchemaShape,
  i as DmPolicySchema,
  m as requireOpenAllowFrom,
  n as ContextVisibilityModeSchema,
  o as MarkdownConfigSchema,
  p as requireAllowlistAllowFrom,
  r as DmConfigSchema,
  s as MentionPatternsPolicySchema,
  t as BlockStreamingCoalesceSchema,
} from "../zod-schema.core-Czv0DE47.js";
//#region src/plugin-sdk/compat.d.ts
/** @deprecated Use `openclaw/plugin-sdk/channel-outbound`. */
declare const createChannelReplyPipeline: typeof createChannelReplyPipeline$1;
/** @deprecated Use `openclaw/plugin-sdk/channel-outbound`. */
declare const createReplyPrefixContext: typeof createReplyPrefixContext$1;
/** @deprecated Use `openclaw/plugin-sdk/channel-outbound`. */
declare const createReplyPrefixOptions: typeof createReplyPrefixOptions$1;
/** @deprecated Use `openclaw/plugin-sdk/channel-outbound`. */
declare const createTypingCallbacks: typeof createTypingCallbacks$1;
/** @deprecated Use `openclaw/plugin-sdk/channel-outbound`. */
declare const resolveChannelSourceReplyDeliveryMode: typeof resolveChannelSourceReplyDeliveryMode$1;
/** @deprecated Use `openclaw/plugin-sdk/channel-outbound`. */
type ChannelReplyPipeline = ChannelReplyPipeline$1;
/** @deprecated Use `openclaw/plugin-sdk/channel-outbound`. */
type CreateTypingCallbacksParams = CreateTypingCallbacksParams$1;
/** @deprecated Use `openclaw/plugin-sdk/channel-outbound`. */
type ReplyPrefixContext = ReplyPrefixContext$1;
/** @deprecated Use `openclaw/plugin-sdk/channel-outbound`. */
type ReplyPrefixContextBundle = ReplyPrefixContextBundle$1;
/** @deprecated Use `openclaw/plugin-sdk/channel-outbound`. */
type ReplyPrefixOptions = ReplyPrefixOptions$1;
/** @deprecated Use `openclaw/plugin-sdk/channel-outbound`. */
type SourceReplyDeliveryMode = SourceReplyDeliveryMode$1;
/** @deprecated Use `openclaw/plugin-sdk/channel-outbound`. */
type TypingCallbacks = TypingCallbacks$1;
//#endregion
export {
  AllowFromListSchema,
  type ApiKeyStorageOptions,
  BlockStreamingCoalesceSchema,
  type ChannelDirectoryEntry,
  type ChannelDirectoryEntryKind,
  type ChannelGroupPolicy,
  type ChannelHistoryWindow,
  ChannelMutableAllowlistCandidate,
  ChannelReplyPipeline,
  ContextVisibilityModeSchema,
  CreateTypingCallbacksParams,
  DEFAULT_GROUP_HISTORY_LIMIT,
  DM_GROUP_ACCESS_REASON,
  type DiagnosticEventPayload,
  type DirectoryConfigParams,
  DmConfigSchema,
  DmPolicySchema,
  GroupPolicySchema,
  type GroupToolPolicyBySenderConfig,
  type GroupToolPolicyConfig,
  HISTORY_CONTEXT_MARKER,
  type HistoryEntry,
  type HistoryMediaEntry,
  KeyedAsyncQueue,
  MarkdownConfigSchema,
  type MemoryPluginCapability,
  type MemoryPluginPublicArtifact,
  type MemoryPluginPublicArtifactsProvider,
  MentionPatternsPolicySchema,
  type ReadOnlyInspectedAccount,
  ReplyPrefixContext,
  ReplyPrefixContextBundle,
  ReplyPrefixOptions,
  ReplyRuntimeConfigSchemaShape,
  type ScopeNode,
  type ScopePath,
  type ScopeTree,
  SourceReplyDeliveryMode,
  ToolPolicySchema,
  TypingCallbacks,
  type WriteOAuthCredentialsOptions,
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
