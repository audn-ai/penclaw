import { r as AnyAgentTool$1 } from "./common-CuQ9SS3Z.js";
import {
  Gt as PluginHeartbeatPromptContributionResult$1,
  Ht as PluginAgentTurnPrepareEvent$1,
  Jt as PluginNextTurnInjectionRecord$1,
  Kt as PluginNextTurnInjection$1,
  Ut as PluginAgentTurnPrepareResult$1,
  Wt as PluginHeartbeatPromptContributionEvent$1,
  Yt as PluginJsonValue$1,
  qt as PluginNextTurnInjectionEnqueueResult$1,
} from "./hook-types-BPL4xByC.js";
import {
  $ as OpenClawPluginServiceContext$1,
  $n as WorkerProvider$1,
  $u as ProviderDefaultThinkingPolicyContext$1,
  A as OpenClawPluginDefinition$1,
  Ai as PluginSessionActionContext$1,
  An as ProviderResolveWebSocketSessionPolicyContext$1,
  At as ProviderBuildUnknownModelHintContext$1,
  Bi as PluginSessionTurnUnscheduleByTagParams$1,
  Bn as ProviderValidateReplayTurnsContext$1,
  Bt as ProviderDeferSyntheticProfileAuthContext$1,
  C as OpenClawPluginApi$1,
  Ci as PluginAgentEventEmitParams$1,
  Ct as ProviderAuthContext$1,
  Di as PluginRunContextGetParams$1,
  Dt as ProviderAuthMethodNonInteractiveContext$1,
  Ei as PluginControlUiDescriptor$1,
  Et as ProviderAuthMethod$1,
  F as OpenClawPluginHttpRouteHandler$1,
  Fi as PluginSessionExtensionProjection$1,
  Fn as ProviderToolSchemaDiagnostic$1,
  Ft as ProviderCatalogContext$1,
  G as OpenClawPluginNodeInvokePolicyContext$1,
  Gn as SpeechProviderPlugin$1,
  Hi as PluginToolMetadataRegistration$1,
  Hl as OpenClawPluginToolContext$1,
  Hn as ProviderWrapStreamFnContext$1,
  Ii as PluginSessionExtensionRegistration$1,
  J as OpenClawPluginReloadRegistration$1,
  Jn as UnifiedModelCatalogProviderPlugin$1,
  K as OpenClawPluginNodeInvokePolicyResult$1,
  Ka as AgentHarness$1,
  Kn as TranscriptSourceProvider$1,
  Kt as ProviderFailoverErrorContext$1,
  Li as PluginSessionSchedulerJobHandle$1,
  Lt as ProviderCatalogResult$1,
  Mi as PluginSessionActionResult$1,
  Mt as ProviderBuiltInModelSuppressionResult$1,
  Ni as PluginSessionAttachmentParams$1,
  Nn as ProviderSanitizeReplayHistoryContext$1,
  Nt as ProviderCacheTtlEligibilityContext$1,
  O as OpenClawPluginCommandDefinition$1,
  Oi as PluginRunContextPatch$1,
  On as ProviderResolveTransportTurnStateContext$1,
  Ot as ProviderAuthResult$1,
  Pi as PluginSessionAttachmentResult$1,
  Q as OpenClawPluginService$1,
  Qn as WorkerProfile$1,
  Ri as PluginSessionSchedulerJobRegistration$1,
  Rn as ProviderTransportTurnState$1,
  Si as PluginLogger$1,
  Sn as ProviderReplaySessionState$1,
  St as ProviderAugmentModelCatalogContext$1,
  Ti as PluginAgentEventSubscriptionRegistration$1,
  Tn as ProviderResolveDynamicModelContext$1,
  U as OpenClawPluginNodeInvokePolicy$1,
  Ui as PluginTrustedToolPolicyRegistration$1,
  Ul as OpenClawPluginToolFactory$1,
  Un as RealtimeTranscriptionProviderPlugin$1,
  Vi as PluginSessionTurnUnscheduleByTagResult$1,
  Vn as ProviderWebSocketSessionPolicy$1,
  Vt as ProviderDiscoveryContext$1,
  X as OpenClawPluginSecurityAuditCollector$1,
  Xn as WorkerLease$1,
  Z as OpenClawPluginSecurityAuditContext$1,
  Zn as WorkerLeaseStatus$1,
  Zt as ProviderModernModelPolicyContext$1,
  _ as MigrationSummary$1,
  _n as ProviderReasoningOutputModeContext$1,
  ar as OpenClawPluginNodeHostCommandAvailabilityContext$1,
  b as OpenClawGatewayDiscoveryService$1,
  bi as ProviderNormalizeConfigContext$1,
  c as MigrationDetection$1,
  ed as ProviderThinkingPolicyContext$1,
  en as ProviderNormalizeModelIdContext$1,
  fn as ProviderPrepareDynamicModelContext$1,
  gn as ProviderReasoningOutputMode$1,
  h as MigrationProviderPlugin$1,
  hn as ProviderPreparedRuntimeAuth$1,
  i as AgentPromptSurfaceKind$1,
  ir as OpenClawPluginNodeHostCommand$1,
  it as PluginCommandContext$1,
  ji as PluginSessionActionRegistration$1,
  jn as ProviderResolvedUsageAuth$1,
  jt as ProviderBuiltInModelSuppressionContext$1,
  k as OpenClawPluginConfigSchema$1,
  ki as PluginRuntimeLifecycleRegistration$1,
  kn as ProviderResolveUsageAuthContext$1,
  kt as ProviderBuildMissingAuthMessageContext$1,
  l as MigrationItem$1,
  m as MigrationProviderContext$1,
  mn as ProviderPrepareRuntimeAuthContext$1,
  n as AgentPromptGuidance$1,
  nn as ProviderNormalizeToolSchemasContext$1,
  nr as WorkerSshIdentity$1,
  o as MediaUnderstandingProviderPlugin$1,
  p as MigrationPlan$1,
  pn as ProviderPrepareExtraParamsContext$1,
  qn as UnifiedModelCatalogProviderContext$1,
  qt as ProviderFetchUsageSnapshotContext$1,
  r as AgentPromptGuidanceEntry$1,
  rn as ProviderNormalizeTransportContext$1,
  rr as WorkerSshIdentityRequest$1,
  s as MigrationApplyResult$1,
  st as PluginCommandResult$1,
  td as ProviderThinkingProfile$1,
  tn as ProviderNormalizeResolvedModelContext$1,
  tr as WorkerSshEndpoint$1,
  vn as ProviderReplayPolicy$1,
  wi as PluginAgentEventEmitResult$1,
  wt as ProviderAuthDoctorHintContext$1,
  xi as ProviderResolveConfigApiKeyContext$1,
  xn as ProviderReplaySessionEntry$1,
  y as OpenClawGatewayDiscoveryAdvertiseContext$1,
  yi as ProviderApplyConfigDefaultsContext$1,
  yn as ProviderReplayPolicyContext$1,
  zi as PluginSessionTurnScheduleParams$1,
  zn as ProviderUsageAuthToken$1,
} from "./types-Ga3mNO_F.js";

//#region src/plugin-sdk/plugin-entry.d.ts
type AnyAgentTool = AnyAgentTool$1;
type AgentHarness = AgentHarness$1;
type AgentPromptGuidance = AgentPromptGuidance$1;
type AgentPromptGuidanceEntry = AgentPromptGuidanceEntry$1;
type AgentPromptSurfaceKind = AgentPromptSurfaceKind$1;
type MediaUnderstandingProviderPlugin = MediaUnderstandingProviderPlugin$1;
type TranscriptSourceProvider = TranscriptSourceProvider$1;
type MigrationApplyResult = MigrationApplyResult$1;
type MigrationDetection = MigrationDetection$1;
type MigrationItem = MigrationItem$1;
type MigrationPlan = MigrationPlan$1;
type MigrationProviderContext = MigrationProviderContext$1;
type MigrationProviderPlugin = MigrationProviderPlugin$1;
type MigrationSummary = MigrationSummary$1;
type OpenClawPluginApi = OpenClawPluginApi$1;
type OpenClawPluginCommandDefinition = OpenClawPluginCommandDefinition$1;
type OpenClawPluginConfigSchema = OpenClawPluginConfigSchema$1;
type OpenClawPluginDefinition = OpenClawPluginDefinition$1;
type OpenClawPluginHttpRouteHandler = OpenClawPluginHttpRouteHandler$1;
type OpenClawPluginNodeHostCommand = OpenClawPluginNodeHostCommand$1;
type OpenClawPluginNodeHostCommandAvailabilityContext =
  OpenClawPluginNodeHostCommandAvailabilityContext$1;
type OpenClawPluginNodeInvokePolicy = OpenClawPluginNodeInvokePolicy$1;
type OpenClawPluginNodeInvokePolicyContext = OpenClawPluginNodeInvokePolicyContext$1;
type OpenClawPluginNodeInvokePolicyResult = OpenClawPluginNodeInvokePolicyResult$1;
type OpenClawPluginReloadRegistration = OpenClawPluginReloadRegistration$1;
type OpenClawPluginSecurityAuditCollector = OpenClawPluginSecurityAuditCollector$1;
type OpenClawPluginSecurityAuditContext = OpenClawPluginSecurityAuditContext$1;
type OpenClawPluginService = OpenClawPluginService$1;
type OpenClawPluginServiceContext = OpenClawPluginServiceContext$1;
type OpenClawPluginToolContext = OpenClawPluginToolContext$1;
type OpenClawPluginToolFactory = OpenClawPluginToolFactory$1;
type PluginLogger = PluginLogger$1;
type WorkerLease = WorkerLease$1;
type WorkerLeaseStatus = WorkerLeaseStatus$1;
type WorkerProfile = WorkerProfile$1;
type WorkerProvider = WorkerProvider$1;
type WorkerSshEndpoint = WorkerSshEndpoint$1;
type WorkerSshIdentity = WorkerSshIdentity$1;
type WorkerSshIdentityRequest = WorkerSshIdentityRequest$1;
type ProviderAugmentModelCatalogContext = ProviderAugmentModelCatalogContext$1;
type ProviderAuthContext = ProviderAuthContext$1;
type ProviderAuthDoctorHintContext = ProviderAuthDoctorHintContext$1;
type ProviderAuthMethod = ProviderAuthMethod$1;
type ProviderAuthMethodNonInteractiveContext = ProviderAuthMethodNonInteractiveContext$1;
type ProviderAuthResult = ProviderAuthResult$1;
type ProviderApplyConfigDefaultsContext = ProviderApplyConfigDefaultsContext$1;
type ProviderBuildMissingAuthMessageContext = ProviderBuildMissingAuthMessageContext$1;
type ProviderBuildUnknownModelHintContext = ProviderBuildUnknownModelHintContext$1;
type ProviderBuiltInModelSuppressionContext = ProviderBuiltInModelSuppressionContext$1;
type ProviderBuiltInModelSuppressionResult = ProviderBuiltInModelSuppressionResult$1;
type ProviderCacheTtlEligibilityContext = ProviderCacheTtlEligibilityContext$1;
type ProviderCatalogContext = ProviderCatalogContext$1;
type ProviderCatalogResult = ProviderCatalogResult$1;
type ProviderDeferSyntheticProfileAuthContext = ProviderDeferSyntheticProfileAuthContext$1;
type ProviderDefaultThinkingPolicyContext = ProviderDefaultThinkingPolicyContext$1;
type ProviderDiscoveryContext = ProviderDiscoveryContext$1;
type ProviderFailoverErrorContext = ProviderFailoverErrorContext$1;
type ProviderFetchUsageSnapshotContext = ProviderFetchUsageSnapshotContext$1;
type ProviderModernModelPolicyContext = ProviderModernModelPolicyContext$1;
type ProviderNormalizeConfigContext = ProviderNormalizeConfigContext$1;
type ProviderNormalizeToolSchemasContext = ProviderNormalizeToolSchemasContext$1;
type ProviderNormalizeTransportContext = ProviderNormalizeTransportContext$1;
type ProviderResolveConfigApiKeyContext = ProviderResolveConfigApiKeyContext$1;
type ProviderNormalizeModelIdContext = ProviderNormalizeModelIdContext$1;
type ProviderNormalizeResolvedModelContext = ProviderNormalizeResolvedModelContext$1;
type ProviderPrepareDynamicModelContext = ProviderPrepareDynamicModelContext$1;
type ProviderPrepareExtraParamsContext = ProviderPrepareExtraParamsContext$1;
type ProviderPrepareRuntimeAuthContext = ProviderPrepareRuntimeAuthContext$1;
type ProviderPreparedRuntimeAuth = ProviderPreparedRuntimeAuth$1;
type ProviderReasoningOutputMode = ProviderReasoningOutputMode$1;
type ProviderReasoningOutputModeContext = ProviderReasoningOutputModeContext$1;
type ProviderReplayPolicy = ProviderReplayPolicy$1;
type ProviderReplayPolicyContext = ProviderReplayPolicyContext$1;
type ProviderReplaySessionEntry = ProviderReplaySessionEntry$1;
type ProviderReplaySessionState = ProviderReplaySessionState$1;
type RealtimeTranscriptionProviderPlugin = RealtimeTranscriptionProviderPlugin$1;
type ProviderResolvedUsageAuth = ProviderResolvedUsageAuth$1;
type ProviderUsageAuthToken = ProviderUsageAuthToken$1;
type ProviderResolveDynamicModelContext = ProviderResolveDynamicModelContext$1;
type ProviderResolveTransportTurnStateContext = ProviderResolveTransportTurnStateContext$1;
type ProviderResolveWebSocketSessionPolicyContext = ProviderResolveWebSocketSessionPolicyContext$1;
type ProviderSanitizeReplayHistoryContext = ProviderSanitizeReplayHistoryContext$1;
type ProviderTransportTurnState = ProviderTransportTurnState$1;
type ProviderToolSchemaDiagnostic = ProviderToolSchemaDiagnostic$1;
type ProviderResolveUsageAuthContext = ProviderResolveUsageAuthContext$1;
type ProviderThinkingProfile = ProviderThinkingProfile$1;
type ProviderThinkingPolicyContext = ProviderThinkingPolicyContext$1;
type ProviderValidateReplayTurnsContext = ProviderValidateReplayTurnsContext$1;
type ProviderWebSocketSessionPolicy = ProviderWebSocketSessionPolicy$1;
type ProviderWrapStreamFnContext = ProviderWrapStreamFnContext$1;
type UnifiedModelCatalogProviderContext = UnifiedModelCatalogProviderContext$1;
type UnifiedModelCatalogProviderPlugin = UnifiedModelCatalogProviderPlugin$1;
type OpenClawGatewayDiscoveryAdvertiseContext = OpenClawGatewayDiscoveryAdvertiseContext$1;
type OpenClawGatewayDiscoveryService = OpenClawGatewayDiscoveryService$1;
type SpeechProviderPlugin = SpeechProviderPlugin$1;
type PluginCommandContext = PluginCommandContext$1;
type PluginCommandResult = PluginCommandResult$1;
type PluginAgentEventEmitParams = PluginAgentEventEmitParams$1;
type PluginAgentEventEmitResult = PluginAgentEventEmitResult$1;
type PluginAgentEventSubscriptionRegistration = PluginAgentEventSubscriptionRegistration$1;
type PluginAgentTurnPrepareEvent = PluginAgentTurnPrepareEvent$1;
type PluginAgentTurnPrepareResult = PluginAgentTurnPrepareResult$1;
type PluginControlUiDescriptor = PluginControlUiDescriptor$1;
type PluginHeartbeatPromptContributionEvent = PluginHeartbeatPromptContributionEvent$1;
type PluginHeartbeatPromptContributionResult = PluginHeartbeatPromptContributionResult$1;
type PluginJsonValue = PluginJsonValue$1;
type PluginNextTurnInjection = PluginNextTurnInjection$1;
type PluginNextTurnInjectionEnqueueResult = PluginNextTurnInjectionEnqueueResult$1;
type PluginNextTurnInjectionRecord = PluginNextTurnInjectionRecord$1;
type PluginRunContextGetParams = PluginRunContextGetParams$1;
type PluginRunContextPatch = PluginRunContextPatch$1;
type PluginRuntimeLifecycleRegistration = PluginRuntimeLifecycleRegistration$1;
type PluginSessionActionContext = PluginSessionActionContext$1;
type PluginSessionActionRegistration = PluginSessionActionRegistration$1;
type PluginSessionActionResult = PluginSessionActionResult$1;
type PluginSessionAttachmentParams = PluginSessionAttachmentParams$1;
type PluginSessionAttachmentResult = PluginSessionAttachmentResult$1;
type PluginSessionSchedulerJobHandle = PluginSessionSchedulerJobHandle$1;
type PluginSessionSchedulerJobRegistration = PluginSessionSchedulerJobRegistration$1;
type PluginSessionTurnScheduleParams = PluginSessionTurnScheduleParams$1;
type PluginSessionTurnUnscheduleByTagParams = PluginSessionTurnUnscheduleByTagParams$1;
type PluginSessionTurnUnscheduleByTagResult = PluginSessionTurnUnscheduleByTagResult$1;
type PluginSessionExtensionRegistration = PluginSessionExtensionRegistration$1;
type PluginSessionExtensionProjection = PluginSessionExtensionProjection$1;
type PluginToolMetadataRegistration = PluginToolMetadataRegistration$1;
type PluginTrustedToolPolicyRegistration = PluginTrustedToolPolicyRegistration$1;
/** Options for a plugin entry that registers providers, tools, commands, or services. */
type DefinePluginEntryOptions = {
  id: string;
  name: string;
  description: string;
  /**
   * @deprecated Declare exclusive plugin kind in `openclaw.plugin.json` via
   * manifest `kind`. Runtime-entry `kind` remains only as a compatibility
   * fallback for older plugins.
   */
  kind?: OpenClawPluginDefinition["kind"];
  configSchema?: OpenClawPluginConfigSchema | (() => OpenClawPluginConfigSchema);
  reload?: OpenClawPluginDefinition["reload"];
  nodeHostCommands?: OpenClawPluginDefinition["nodeHostCommands"];
  securityAuditCollectors?: OpenClawPluginDefinition["securityAuditCollectors"];
  register: (api: OpenClawPluginApi) => void;
};
/** Normalized object shape that OpenClaw loads from a plugin entry module. */
type DefinedPluginEntry = {
  id: string;
  name: string;
  description: string;
  configSchema: OpenClawPluginConfigSchema;
  register: NonNullable<OpenClawPluginDefinition["register"]>;
} & Pick<
  OpenClawPluginDefinition,
  "kind" | "reload" | "nodeHostCommands" | "securityAuditCollectors"
>;
/**
 * Canonical entry helper for non-channel plugins.
 *
 * Use this for provider, tool, command, service, memory, and context-engine
 * plugins. Channel plugins should use `defineChannelPluginEntry(...)` from
 * `openclaw/plugin-sdk/core` so they inherit the channel capability wiring.
 */
declare function definePluginEntry({
  id,
  name,
  description,
  kind,
  configSchema,
  reload,
  nodeHostCommands,
  securityAuditCollectors,
  register,
}: DefinePluginEntryOptions): DefinedPluginEntry;
//#endregion
export {
  PluginSessionActionResult as $,
  ProviderThinkingPolicyContext as $t,
  OpenClawPluginServiceContext as A,
  ProviderModernModelPolicyContext as At,
  PluginControlUiDescriptor as B,
  ProviderReasoningOutputMode as Bt,
  OpenClawPluginNodeInvokePolicy as C,
  ProviderCatalogContext as Ct,
  OpenClawPluginSecurityAuditCollector as D,
  ProviderDiscoveryContext as Dt,
  OpenClawPluginReloadRegistration as E,
  ProviderDeferSyntheticProfileAuthContext as Et,
  PluginAgentEventSubscriptionRegistration as F,
  ProviderNormalizeTransportContext as Ft,
  PluginNextTurnInjection as G,
  ProviderReplaySessionState as Gt,
  PluginHeartbeatPromptContributionResult as H,
  ProviderReplayPolicy as Ht,
  PluginAgentTurnPrepareEvent as I,
  ProviderPrepareDynamicModelContext as It,
  PluginRunContextGetParams as J,
  ProviderResolveTransportTurnStateContext as Jt,
  PluginNextTurnInjectionEnqueueResult as K,
  ProviderResolveConfigApiKeyContext as Kt,
  PluginAgentTurnPrepareResult as L,
  ProviderPrepareExtraParamsContext as Lt,
  OpenClawPluginToolFactory as M,
  ProviderNormalizeModelIdContext as Mt,
  PluginAgentEventEmitParams as N,
  ProviderNormalizeResolvedModelContext as Nt,
  OpenClawPluginSecurityAuditContext as O,
  ProviderFailoverErrorContext as Ot,
  PluginAgentEventEmitResult as P,
  ProviderNormalizeToolSchemasContext as Pt,
  PluginSessionActionRegistration as Q,
  ProviderSanitizeReplayHistoryContext as Qt,
  PluginCommandContext as R,
  ProviderPrepareRuntimeAuthContext as Rt,
  OpenClawPluginNodeHostCommandAvailabilityContext as S,
  ProviderCacheTtlEligibilityContext as St,
  OpenClawPluginNodeInvokePolicyResult as T,
  ProviderDefaultThinkingPolicyContext as Tt,
  PluginJsonValue as U,
  ProviderReplayPolicyContext as Ut,
  PluginHeartbeatPromptContributionEvent as V,
  ProviderReasoningOutputModeContext as Vt,
  PluginLogger as W,
  ProviderReplaySessionEntry as Wt,
  PluginRuntimeLifecycleRegistration as X,
  ProviderResolveWebSocketSessionPolicyContext as Xt,
  PluginRunContextPatch as Y,
  ProviderResolveUsageAuthContext as Yt,
  PluginSessionActionContext as Z,
  ProviderResolvedUsageAuth as Zt,
  OpenClawPluginCommandDefinition as _,
  WorkerSshIdentity as _n,
  ProviderAuthResult as _t,
  AnyAgentTool as a,
  ProviderWebSocketSessionPolicy as an,
  PluginSessionSchedulerJobRegistration as at,
  OpenClawPluginHttpRouteHandler as b,
  ProviderBuiltInModelSuppressionContext as bt,
  MigrationDetection as c,
  SpeechProviderPlugin as cn,
  PluginSessionTurnUnscheduleByTagResult as ct,
  MigrationProviderContext as d,
  UnifiedModelCatalogProviderPlugin as dn,
  ProviderApplyConfigDefaultsContext as dt,
  ProviderThinkingProfile as en,
  PluginSessionAttachmentParams as et,
  MigrationProviderPlugin as f,
  WorkerLease as fn,
  ProviderAugmentModelCatalogContext as ft,
  OpenClawPluginApi as g,
  WorkerSshEndpoint as gn,
  ProviderAuthMethodNonInteractiveContext as gt,
  OpenClawGatewayDiscoveryService as h,
  WorkerProvider as hn,
  ProviderAuthMethod as ht,
  AgentPromptSurfaceKind as i,
  ProviderValidateReplayTurnsContext as in,
  PluginSessionSchedulerJobHandle as it,
  OpenClawPluginToolContext as j,
  ProviderNormalizeConfigContext as jt,
  OpenClawPluginService as k,
  ProviderFetchUsageSnapshotContext as kt,
  MigrationItem as l,
  TranscriptSourceProvider as ln,
  PluginToolMetadataRegistration as lt,
  OpenClawGatewayDiscoveryAdvertiseContext as m,
  WorkerProfile as mn,
  ProviderAuthDoctorHintContext as mt,
  AgentPromptGuidance as n,
  ProviderTransportTurnState as nn,
  PluginSessionExtensionProjection as nt,
  MediaUnderstandingProviderPlugin as o,
  ProviderWrapStreamFnContext as on,
  PluginSessionTurnScheduleParams as ot,
  MigrationSummary as p,
  WorkerLeaseStatus as pn,
  ProviderAuthContext as pt,
  PluginNextTurnInjectionRecord as q,
  ProviderResolveDynamicModelContext as qt,
  AgentPromptGuidanceEntry as r,
  ProviderUsageAuthToken as rn,
  PluginSessionExtensionRegistration as rt,
  MigrationApplyResult as s,
  RealtimeTranscriptionProviderPlugin as sn,
  PluginSessionTurnUnscheduleByTagParams as st,
  AgentHarness as t,
  ProviderToolSchemaDiagnostic as tn,
  PluginSessionAttachmentResult as tt,
  MigrationPlan as u,
  UnifiedModelCatalogProviderContext as un,
  PluginTrustedToolPolicyRegistration as ut,
  OpenClawPluginConfigSchema as v,
  WorkerSshIdentityRequest as vn,
  ProviderBuildMissingAuthMessageContext as vt,
  OpenClawPluginNodeInvokePolicyContext as w,
  ProviderCatalogResult as wt,
  OpenClawPluginNodeHostCommand as x,
  ProviderBuiltInModelSuppressionResult as xt,
  OpenClawPluginDefinition as y,
  definePluginEntry as yn,
  ProviderBuildUnknownModelHintContext as yt,
  PluginCommandResult as z,
  ProviderPreparedRuntimeAuth as zt,
};
