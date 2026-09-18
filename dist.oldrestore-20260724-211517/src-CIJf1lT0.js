import {
  C as PluginApprovalSeveritySchema,
  E as TerminalApprovalSnapshotSchema,
  S as PluginApprovalPresentationSchema,
  _ as DeniedApprovalSnapshotSchema,
  a as ApprovalDecisionSchema,
  b as PendingApprovalSnapshotSchema,
  c as ApprovalGetParamsSchema,
  d as ApprovalPresentationSchema,
  f as ApprovalResolveParamsSchema,
  g as CancelledApprovalSnapshotSchema,
  h as ApprovalTerminalReasonSchema,
  l as ApprovalGetResultSchema,
  m as ApprovalSnapshotSchema,
  n as ApprovalAllowDecisionSchema,
  p as ApprovalResolveResultSchema,
  t as AllowedApprovalSnapshotSchema,
  u as ApprovalKindSchema,
  v as ExecApprovalPresentationSchema,
  y as ExpiredApprovalSnapshotSchema,
} from "./approvals-BSpwjSwI.js";
import {
  $i as ConfigSchemaParamsSchema,
  $n as NodePresenceAlivePayloadSchema,
  $o as SkillsSecurityVerdictsParamsSchema,
  $r as ExecApprovalRequestParamsSchema,
  $t as SessionsCatalogReadParamsSchema,
  Aa as TalkSessionCreateResultSchema,
  Ai as CrestodianChatParamsSchema,
  An as PluginsUninstallResultSchema,
  Ar as FsListDirResultSchema,
  At as SessionsPatchParamsSchema,
  B as TaskSuggestionsCreateParamsSchema,
  Ba as TtsSpeakParamsSchema,
  Bi as WizardCancelParamsSchema,
  Bn as NodeListParamsSchema,
  Bt as SessionsCreateParamsSchema,
  Ca as TalkEventSchema,
  Cn as PluginsSessionActionParamsSchema,
  Cr as GatewaySuspendStatusParamsSchema,
  Da as TalkSessionCancelTurnParamsSchema,
  Di as CronRunsParamsSchema,
  Dn as PluginsUiDescriptorsParamsSchema,
  Do as ModelsListParamsSchema,
  Dt as SessionsListParamsSchema,
  E as TerminalTextParamsSchema,
  Ea as TalkSessionCancelOutputParamsSchema,
  Ei as CronRunParamsSchema,
  En as PluginsSetEnabledResultSchema,
  Es as MigrationsMemoryApplyParamsSchema,
  Et as SessionsGroupsRenameParamsSchema,
  Fa as TalkSessionSubmitToolResultParamsSchema,
  Fn as NodeEventResultSchema,
  Fs as lazyCompile,
  Ga as AuditListParamsSchema,
  Gi as WizardStatusParamsSchema,
  Gn as NodePendingAckParamsSchema,
  Go as SkillsProposalRequestRevisionParamsSchema,
  Gr as DevicePairListParamsSchema,
  H as TaskSuggestionsDismissParamsSchema,
  Ha as WebLoginStartParamsSchema,
  Hn as NodePairListParamsSchema,
  Ho as SkillsProposalInspectParamsSchema,
  Ia as TalkSessionTurnParamsSchema,
  Ii as CrestodianSetupDetectParamsSchema,
  In as NodeInvokeInputEventSchema,
  Io as SkillsDetailParamsSchema,
  It as SessionsSearchParamsSchema,
  Ji as ConfigApplyParamsSchema,
  Jn as NodePendingEnqueueParamsSchema,
  Jo as SkillsProposalUpdateParamsSchema,
  Jr as DevicePairRenameParamsSchema,
  K as SystemInfoParamsSchema,
  Kn as NodePendingDrainParamsSchema,
  Kr as DevicePairRejectParamsSchema,
  La as TalkSessionTurnResultSchema,
  Ln as NodeInvokeParamsSchema,
  Lr as RequestFrameSchema,
  Lt as SessionsSearchResultSchema,
  Ma as TalkSessionJoinResultSchema,
  Mi as CrestodianSetupActivateParamsSchema,
  Mn as PluginApprovalResolveParamsSchema,
  Mo as SkillsCuratorActionParamsSchema,
  Mt as SessionsPreviewParamsSchema,
  N as TasksListParamsSchema,
  Na as TalkSessionOkResultSchema,
  Nn as NodeDescribeParamsSchema,
  Nr as EventFrameSchema,
  Nt as SessionsResetParamsSchema,
  Oa as TalkSessionCloseParamsSchema,
  Oi as CronStatusParamsSchema,
  On as PluginsUiDescriptorsResultSchema,
  Oo as ModelsProbeParamsSchema,
  Os as MigrationsMemoryPlanParamsSchema,
  Ot as SessionsMessagesSubscribeParamsSchema,
  Pa as TalkSessionSteerParamsSchema,
  Pi as CrestodianSetupAuthStartParamsSchema,
  Pn as NodeEventParamsSchema,
  Po as SkillsCuratorStatusParamsSchema,
  Pt as SessionsResolveParamsSchema,
  Qi as ConfigSchemaLookupResultSchema,
  Qn as NodePresenceActivityPayloadSchema,
  Qr as ExecApprovalGetParamsSchema,
  R as TaskSuggestionsAcceptParamsSchema,
  Ra as TalkSpeakParamsSchema,
  Ri as CrestodianSetupVerifyParamsSchema,
  Rn as NodeInvokeProgressParamsSchema,
  Ro as SkillsInstallParamsSchema,
  Rr as ResponseFrameSchema,
  Rt as SessionsSendParamsSchema,
  S as TerminalOpenParamsSchema,
  Sa as TalkConfigResultSchema,
  Si as CronGetParamsSchema,
  Sn as PluginsSearchResultSchema,
  So as AgentsListParamsSchema,
  Sr as GatewaySuspendResumeResultSchema,
  St as SessionsGroupsListParamsSchema,
  Ta as TalkSessionAppendAudioParamsSchema,
  Ti as CronRemoveParamsSchema,
  Tn as PluginsSetEnabledParamsSchema,
  Tr as GatewaySuspendStatusResultSchema,
  Tt as SessionsGroupsPutParamsSchema,
  Ua as WebLoginWaitParamsSchema,
  Ui as WizardStartParamsSchema,
  Un as NodePairRejectParamsSchema,
  Va as TtsSpeakResultSchema,
  Vi as WizardNextParamsSchema,
  Vn as NodePairApproveParamsSchema,
  Vo as SkillsProposalCreateParamsSchema,
  W as TaskSuggestionsListParamsSchema,
  Wn as NodePairRemoveParamsSchema,
  Wr as DevicePairApproveParamsSchema,
  Xa as AuditActivityListParamsSchema,
  Xi as ConfigPatchParamsSchema,
  Xr as DeviceTokenRevokeParamsSchema,
  Yi as ConfigGetParamsSchema,
  Yo as SkillsProposalsListParamsSchema,
  Yr as DevicePairSetupCodeParamsSchema,
  Yt as SessionsCatalogContinueParamsSchema,
  Zi as ConfigSchemaLookupParamsSchema,
  Zn as NodePluginToolsUpdateParamsSchema,
  Zo as SkillsSearchParamsSchema,
  Zr as DeviceTokenRotateParamsSchema,
  Zt as SessionsCatalogListParamsSchema,
  _a as TalkClientCreateResultSchema,
  _n as PluginsInstallParamsSchema,
  _s as PollParamsSchema,
  _t as SessionsFilesListParamsSchema,
  a as WorktreesCreateParamsSchema,
  aa as CommandsListParamsSchema,
  ai as ExecApprovalsSetParamsSchema,
  an as SecretsResolveParamsSchema,
  ar as ChatEventSchema,
  as as SkillsUploadBeginParamsSchema,
  at as SessionsCompactParamsSchema,
  b as TerminalInputParamsSchema,
  ba as TalkClientToolCallResultSchema,
  bn as PluginsListResultSchema,
  bo as AgentsFilesSetParamsSchema,
  br as GatewaySuspendPrepareResultSchema,
  c as WorktreesListParamsSchema,
  ca as ChannelsLogoutParamsSchema,
  ci as EnvironmentsCreateParamsSchema,
  co as AgentsWorkspaceListParamsSchema,
  cr as ChatMessageGetParamsSchema,
  cs as ToolsCatalogParamsSchema,
  ct as SessionsCompactionListParamsSchema,
  dn as WebPushUnsubscribeParamsSchema,
  do as AgentsCreateParamsSchema,
  dr as ChatSendParamsSchema,
  dt as SessionsDeleteParamsSchema,
  ei as ExecApprovalResolveParamsSchema,
  f as WorktreesRestoreParamsSchema,
  fa as ChannelsStopParamsSchema,
  fi as EnvironmentsListParamsSchema,
  fn as WebPushVapidPublicKeyParamsSchema,
  fr as ChatToolTitlesParamsSchema,
  fs as AgentIdentityParamsSchema,
  ft as SessionsDescribeParamsSchema,
  g as TerminalCloseParamsSchema,
  ga as TalkClientCreateParamsSchema,
  go as AgentsFilesGetParamsSchema,
  gs as MessageActionParamsSchema,
  ha as TalkCatalogResultSchema,
  hs as AgentWaitParamsSchema,
  ht as SessionsFilesGetParamsSchema,
  ii as ExecApprovalsNodeSnapshotSchema,
  in as SessionsDispatchResultSchema,
  ir as ChatAbortParamsSchema,
  is as SkillsUpdateParamsSchema,
  it as SessionsCleanupParamsSchema,
  j as TasksGetParamsSchema,
  ja as TalkSessionJoinParamsSchema,
  jn as PluginApprovalRequestParamsSchema,
  jo as SkillsBinsParamsSchema,
  jr as ConnectParamsSchema,
  jt as SessionsPluginPatchParamsSchema,
  k as TasksCancelParamsSchema,
  ka as TalkSessionCreateParamsSchema,
  ki as CronUpdateParamsSchema,
  kn as PluginsUninstallParamsSchema,
  kr as FsListDirParamsSchema,
  kt as SessionsMessagesUnsubscribeParamsSchema,
  la as ChannelsStartParamsSchema,
  ln as WebPushSubscribeParamsSchema,
  lr as ChatMessageGetResultSchema,
  ls as ToolsEffectiveParamsSchema,
  lt as SessionsCompactionRestoreParamsSchema,
  m as TerminalAttachParamsSchema,
  ma as TalkCatalogParamsSchema,
  mi as EnvironmentsStatusParamsSchema,
  mr as LogsTailParamsSchema,
  ms as AgentParamsSchema,
  na as UpdateRunParamsSchema,
  ni as ExecApprovalsNodeGetParamsSchema,
  no as ArtifactsGetParamsSchema,
  o as WorktreesGcParamsSchema,
  on as SecretsResolveResultSchema,
  oo as AgentsWorkspaceGetParamsSchema,
  or as ChatHistoryParamsSchema,
  os as SkillsUploadChunkParamsSchema,
  ot as SessionsCompactionBranchParamsSchema,
  pa as TalkAgentControlResultSchema,
  po as AgentsDeleteParamsSchema,
  pt as SessionsDiffParamsSchema,
  q as SystemInfoResultSchema,
  qo as SkillsProposalReviseParamsSchema,
  qr as DevicePairRemoveParamsSchema,
  qt as SessionsCatalogArchiveParamsSchema,
  r as WorktreesBranchesParamsSchema,
  ra as UpdateStatusParamsSchema,
  ri as ExecApprovalsNodeSetParamsSchema,
  rn as SessionsDispatchParamsSchema,
  ro as ArtifactsListParamsSchema,
  rr as NodeSkillsUpdateParamsSchema,
  rs as SkillsStatusParamsSchema,
  rt as SessionsAbortParamsSchema,
  sa as TalkSessionAcknowledgeMarkParamsSchema,
  sn as PushTestParamsSchema,
  sr as ChatInjectParamsSchema,
  ss as SkillsUploadCommitParamsSchema,
  st as SessionsCompactionGetParamsSchema,
  ta as ConfigSetParamsSchema,
  ti as ExecApprovalsGetParamsSchema,
  to as ArtifactsDownloadParamsSchema,
  tr as NodeRenameParamsSchema,
  ts as SkillsSkillCardParamsSchema,
  u as WorktreesRemoveParamsSchema,
  ua as ChannelsStatusParamsSchema,
  ui as EnvironmentsDestroyParamsSchema,
  un as WebPushTestParamsSchema,
  ur as ChatMetadataParamsSchema,
  us as ToolsInvokeParamsSchema,
  v as TerminalEventSchema,
  va as TalkClientSteerParamsSchema,
  vn as PluginsInstallResultSchema,
  vo as AgentsFilesListParamsSchema,
  vr as GatewaySuspendPrepareParamsSchema,
  vs as SendParamsSchema,
  w as TerminalResizeParamsSchema,
  wa as TalkModeParamsSchema,
  wi as CronListParamsSchema,
  wn as PluginsSessionActionResultSchema,
  wo as AgentsUpdateParamsSchema,
  xa as TalkConfigParamsSchema,
  xn as PluginsSearchParamsSchema,
  xr as GatewaySuspendResumeParamsSchema,
  xt as SessionsGroupsDeleteParamsSchema,
  ya as TalkClientToolCallParamsSchema,
  yi as CronAddParamsSchema,
  yn as PluginsListParamsSchema,
  ys as WakeParamsSchema,
  yt as SessionsFilesSetParamsSchema,
  za as TalkSpeakResultSchema,
  zn as NodeInvokeResultParamsSchema,
  zo as SkillsProposalActionParamsSchema,
  zt as SessionsUsageParamsSchema,
} from "./schema-C_z7F42p.js";
import {
  L as WorkerTranscriptCommitParamsSchema,
  S as WorkerHeartbeatParamsSchema,
  _ as WorkerAdmissionHandshakeSchema,
  b as WorkerConnectRequestFrameSchema,
  k as WorkerLiveEventParamsSchema,
} from "./worker-admission-BAoXlOyb.js";
import "./worker-inference-y83k6oxW.js";
//#region packages/gateway-protocol/src/clawhub-trust-error-details.ts
/** Structured ClawHub trust details carried in gateway error payloads. */
const ClawHubTrustErrorCodes = {
  SECURITY_UNAVAILABLE: "clawhub_security_unavailable",
  RISK_ACKNOWLEDGEMENT_REQUIRED: "clawhub_risk_acknowledgement_required",
  DOWNLOAD_BLOCKED: "clawhub_download_blocked",
};
function normalizeNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0 ? value : void 0;
}
function isClawHubTrustErrorCode(value) {
  return (
    value === ClawHubTrustErrorCodes.SECURITY_UNAVAILABLE ||
    value === ClawHubTrustErrorCodes.RISK_ACKNOWLEDGEMENT_REQUIRED ||
    value === ClawHubTrustErrorCodes.DOWNLOAD_BLOCKED
  );
}
function buildClawHubTrustErrorDetails(params) {
  if (!params.code && !params.version && !params.warning) return;
  return {
    ...(params.code ? { clawhubTrustCode: params.code } : {}),
    ...(params.version ? { version: params.version } : {}),
    ...(params.warning ? { warning: params.warning } : {}),
  };
}
function readClawHubTrustErrorDetails(details) {
  if (!details || typeof details !== "object" || Array.isArray(details)) return;
  const raw = details;
  const code = isClawHubTrustErrorCode(raw.clawhubTrustCode) ? raw.clawhubTrustCode : void 0;
  const version = normalizeNonEmptyString(raw.version);
  const warning = normalizeNonEmptyString(raw.warning);
  if (!code && !version && !warning) return;
  return {
    ...(code ? { clawhubTrustCode: code } : {}),
    ...(version ? { version } : {}),
    ...(warning ? { warning } : {}),
  };
}
//#endregion
//#region packages/gateway-protocol/src/approval-result-validators.ts
const validateApprovalGetResult = lazyCompile(ApprovalGetResultSchema);
const validateApprovalResolveResult = lazyCompile(ApprovalResolveResultSchema);
//#endregion
//#region packages/gateway-protocol/src/migration-api.ts
const validateMigrationsMemoryPlanParams = lazyCompile(MigrationsMemoryPlanParamsSchema);
const validateMigrationsMemoryApplyParams = lazyCompile(MigrationsMemoryApplyParamsSchema);
//#endregion
//#region packages/gateway-protocol/src/index.ts
const validateCommandsListParams = lazyCompile(CommandsListParamsSchema);
const validateConnectParams = lazyCompile(ConnectParamsSchema);
const validateWorkerAdmissionHandshake = lazyCompile(WorkerAdmissionHandshakeSchema);
const validateWorkerConnectRequestFrame = lazyCompile(WorkerConnectRequestFrameSchema);
const validateWorkerHeartbeatParams = lazyCompile(WorkerHeartbeatParamsSchema);
function checkWorkerProtocolJson(data) {
  const stack = [
    {
      depth: 0,
      value: data,
    },
  ];
  const seen = /* @__PURE__ */ new WeakSet();
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) break;
    if (current.depth > 32)
      return {
        keyword: "maxDepth",
        params: { limit: 32 },
        message: `must not exceed JSON nesting depth 32`,
      };
    if (
      current.value === null ||
      typeof current.value === "string" ||
      typeof current.value === "boolean"
    )
      continue;
    if (typeof current.value === "number") {
      if (!Number.isFinite(current.value))
        return {
          keyword: "finite",
          message: "must contain only finite JSON numbers",
        };
      continue;
    }
    if (typeof current.value !== "object")
      return {
        keyword: "jsonValue",
        message: "must contain only JSON values",
      };
    if (seen.has(current.value))
      return {
        keyword: "acyclic",
        message: "must be an acyclic JSON value",
      };
    seen.add(current.value);
    const values = Array.isArray(current.value) ? current.value : Object.values(current.value);
    for (const value of values)
      stack.push({
        depth: current.depth + 1,
        value,
      });
  }
}
const validateWorkerTranscriptCommitParams = lazyCompile(
  WorkerTranscriptCommitParamsSchema,
  checkWorkerProtocolJson,
);
const validateWorkerLiveEventParams = lazyCompile(
  WorkerLiveEventParamsSchema,
  checkWorkerProtocolJson,
);
const validateGatewaySuspendPrepareParams = lazyCompile(GatewaySuspendPrepareParamsSchema);
const validateGatewaySuspendPrepareResult = lazyCompile(GatewaySuspendPrepareResultSchema);
const validateGatewaySuspendStatusParams = lazyCompile(GatewaySuspendStatusParamsSchema);
const validateGatewaySuspendStatusResult = lazyCompile(GatewaySuspendStatusResultSchema);
const validateGatewaySuspendResumeParams = lazyCompile(GatewaySuspendResumeParamsSchema);
const validateGatewaySuspendResumeResult = lazyCompile(GatewaySuspendResumeResultSchema);
const validateRequestFrame = lazyCompile(RequestFrameSchema);
const validateResponseFrame = lazyCompile(ResponseFrameSchema);
const validateEventFrame = lazyCompile(EventFrameSchema);
const validateMessageActionParams = lazyCompile(MessageActionParamsSchema);
const validateSendParams = lazyCompile(SendParamsSchema);
const validatePollParams = lazyCompile(PollParamsSchema);
const validateAgentParams = lazyCompile(AgentParamsSchema);
const validateAuditActivityListParams = lazyCompile(AuditActivityListParamsSchema);
const validateAuditListParams = lazyCompile(AuditListParamsSchema);
const validateAgentIdentityParams = lazyCompile(AgentIdentityParamsSchema);
const validateAgentWaitParams = lazyCompile(AgentWaitParamsSchema);
const validateWakeParams = lazyCompile(WakeParamsSchema);
const validateAgentsListParams = lazyCompile(AgentsListParamsSchema);
const validateWorktreesListParams = lazyCompile(WorktreesListParamsSchema);
const validateWorktreesCreateParams = lazyCompile(WorktreesCreateParamsSchema);
const validateWorktreesRemoveParams = lazyCompile(WorktreesRemoveParamsSchema);
const validateWorktreesRestoreParams = lazyCompile(WorktreesRestoreParamsSchema);
const validateWorktreesGcParams = lazyCompile(WorktreesGcParamsSchema);
const validateWorktreesBranchesParams = lazyCompile(WorktreesBranchesParamsSchema);
const validateFsListDirParams = lazyCompile(FsListDirParamsSchema);
const validateFsListDirResult = lazyCompile(FsListDirResultSchema);
const validateAgentsCreateParams = lazyCompile(AgentsCreateParamsSchema);
const validateAgentsUpdateParams = lazyCompile(AgentsUpdateParamsSchema);
const validateAgentsDeleteParams = lazyCompile(AgentsDeleteParamsSchema);
const validateAgentsFilesListParams = lazyCompile(AgentsFilesListParamsSchema);
const validateAgentsFilesGetParams = lazyCompile(AgentsFilesGetParamsSchema);
const validateAgentsFilesSetParams = lazyCompile(AgentsFilesSetParamsSchema);
const validateAgentsWorkspaceListParams = lazyCompile(AgentsWorkspaceListParamsSchema);
const validateAgentsWorkspaceGetParams = lazyCompile(AgentsWorkspaceGetParamsSchema);
const validateArtifactsListParams = lazyCompile(ArtifactsListParamsSchema);
const validateArtifactsGetParams = lazyCompile(ArtifactsGetParamsSchema);
const validateArtifactsDownloadParams = lazyCompile(ArtifactsDownloadParamsSchema);
const validateNodePairListParams = lazyCompile(NodePairListParamsSchema);
const validateNodePairApproveParams = lazyCompile(NodePairApproveParamsSchema);
const validateNodePairRejectParams = lazyCompile(NodePairRejectParamsSchema);
const validateNodePairRemoveParams = lazyCompile(NodePairRemoveParamsSchema);
const validateNodeRenameParams = lazyCompile(NodeRenameParamsSchema);
const validateNodeListParams = lazyCompile(NodeListParamsSchema);
const validateNodePluginToolsUpdateParams = lazyCompile(NodePluginToolsUpdateParamsSchema);
const validateNodeSkillsUpdateParams = lazyCompile(NodeSkillsUpdateParamsSchema);
const validateEnvironmentsCreateParams = lazyCompile(EnvironmentsCreateParamsSchema);
const validateEnvironmentsDestroyParams = lazyCompile(EnvironmentsDestroyParamsSchema);
const validateEnvironmentsListParams = lazyCompile(EnvironmentsListParamsSchema);
const validateEnvironmentsStatusParams = lazyCompile(EnvironmentsStatusParamsSchema);
const validateSystemInfoParams = lazyCompile(SystemInfoParamsSchema);
const validateSystemInfoResult = lazyCompile(SystemInfoResultSchema);
const validateNodePendingAckParams = lazyCompile(NodePendingAckParamsSchema);
const validateNodeDescribeParams = lazyCompile(NodeDescribeParamsSchema);
const validateNodeInvokeParams = lazyCompile(NodeInvokeParamsSchema);
const validateNodeInvokeInputEvent = lazyCompile(NodeInvokeInputEventSchema);
const validateNodeInvokeResultParams = lazyCompile(NodeInvokeResultParamsSchema);
const validateNodeInvokeProgressParams = lazyCompile(NodeInvokeProgressParamsSchema);
const validateNodeEventParams = lazyCompile(NodeEventParamsSchema);
const validateNodeEventResult = lazyCompile(NodeEventResultSchema);
const validateNodePresenceAlivePayload = lazyCompile(NodePresenceAlivePayloadSchema);
const validateNodePresenceActivityPayload = lazyCompile(NodePresenceActivityPayloadSchema);
const validateNodePendingDrainParams = lazyCompile(NodePendingDrainParamsSchema);
const validateNodePendingEnqueueParams = lazyCompile(NodePendingEnqueueParamsSchema);
const validatePushTestParams = lazyCompile(PushTestParamsSchema);
const validateWebPushVapidPublicKeyParams = lazyCompile(WebPushVapidPublicKeyParamsSchema);
const validateWebPushSubscribeParams = lazyCompile(WebPushSubscribeParamsSchema);
const validateWebPushUnsubscribeParams = lazyCompile(WebPushUnsubscribeParamsSchema);
const validateWebPushTestParams = lazyCompile(WebPushTestParamsSchema);
const validateSecretsResolveParams = lazyCompile(SecretsResolveParamsSchema);
const validateSecretsResolveResult = lazyCompile(SecretsResolveResultSchema);
const validateSessionsListParams = lazyCompile(SessionsListParamsSchema);
const validateSessionsCatalogListParams = lazyCompile(SessionsCatalogListParamsSchema);
const validateSessionsCatalogReadParams = lazyCompile(SessionsCatalogReadParamsSchema);
const validateSessionsCatalogContinueParams = lazyCompile(SessionsCatalogContinueParamsSchema);
const validateSessionsCatalogArchiveParams = lazyCompile(SessionsCatalogArchiveParamsSchema);
const validateSessionsSearchParams = lazyCompile(SessionsSearchParamsSchema);
const validateSessionsSearchResult = lazyCompile(SessionsSearchResultSchema);
const validateSessionsCleanupParams = lazyCompile(SessionsCleanupParamsSchema);
const validateSessionsPreviewParams = lazyCompile(SessionsPreviewParamsSchema);
const validateSessionsDescribeParams = lazyCompile(SessionsDescribeParamsSchema);
const validateSessionsResolveParams = lazyCompile(SessionsResolveParamsSchema);
const validateSessionsFilesListParams = lazyCompile(SessionsFilesListParamsSchema);
const validateSessionsFilesGetParams = lazyCompile(SessionsFilesGetParamsSchema);
const validateSessionsFilesSetParams = lazyCompile(SessionsFilesSetParamsSchema);
const validateSessionsDiffParams = lazyCompile(SessionsDiffParamsSchema);
const validateSessionsCreateParams = lazyCompile(SessionsCreateParamsSchema);
const validateSessionsSendParams = lazyCompile(SessionsSendParamsSchema);
const validateSessionsDispatchParams = lazyCompile(SessionsDispatchParamsSchema);
const validateSessionsDispatchResult = lazyCompile(SessionsDispatchResultSchema);
const validateSessionsMessagesSubscribeParams = lazyCompile(SessionsMessagesSubscribeParamsSchema);
const validateSessionsMessagesUnsubscribeParams = lazyCompile(
  SessionsMessagesUnsubscribeParamsSchema,
);
const validateSessionsAbortParams = lazyCompile(SessionsAbortParamsSchema);
const validateSessionsPatchParams = lazyCompile(SessionsPatchParamsSchema);
const validateSessionsPluginPatchParams = lazyCompile(SessionsPluginPatchParamsSchema);
const validateSessionsResetParams = lazyCompile(SessionsResetParamsSchema);
const validateSessionsDeleteParams = lazyCompile(SessionsDeleteParamsSchema);
const validateSessionsGroupsListParams = lazyCompile(SessionsGroupsListParamsSchema);
const validateSessionsGroupsPutParams = lazyCompile(SessionsGroupsPutParamsSchema);
const validateSessionsGroupsRenameParams = lazyCompile(SessionsGroupsRenameParamsSchema);
const validateSessionsGroupsDeleteParams = lazyCompile(SessionsGroupsDeleteParamsSchema);
const validateSessionsCompactParams = lazyCompile(SessionsCompactParamsSchema);
const validateSessionsCompactionListParams = lazyCompile(SessionsCompactionListParamsSchema);
const validateSessionsCompactionGetParams = lazyCompile(SessionsCompactionGetParamsSchema);
const validateSessionsCompactionBranchParams = lazyCompile(SessionsCompactionBranchParamsSchema);
const validateSessionsCompactionRestoreParams = lazyCompile(SessionsCompactionRestoreParamsSchema);
const validateSessionsUsageParams = lazyCompile(SessionsUsageParamsSchema);
const validateTaskSuggestionsListParams = lazyCompile(TaskSuggestionsListParamsSchema);
const validateTaskSuggestionsCreateParams = lazyCompile(TaskSuggestionsCreateParamsSchema);
const validateTaskSuggestionsAcceptParams = lazyCompile(TaskSuggestionsAcceptParamsSchema);
const validateTaskSuggestionsDismissParams = lazyCompile(TaskSuggestionsDismissParamsSchema);
const validateTasksListParams = lazyCompile(TasksListParamsSchema);
const validateTasksGetParams = lazyCompile(TasksGetParamsSchema);
const validateTasksCancelParams = lazyCompile(TasksCancelParamsSchema);
const validateConfigGetParams = lazyCompile(ConfigGetParamsSchema);
const validateConfigSetParams = lazyCompile(ConfigSetParamsSchema);
const validateConfigApplyParams = lazyCompile(ConfigApplyParamsSchema);
const validateConfigPatchParams = lazyCompile(ConfigPatchParamsSchema);
const validateConfigSchemaParams = lazyCompile(ConfigSchemaParamsSchema);
const validateConfigSchemaLookupParams = lazyCompile(ConfigSchemaLookupParamsSchema);
const validateConfigSchemaLookupResult = lazyCompile(ConfigSchemaLookupResultSchema);
const validateCrestodianChatParams = lazyCompile(CrestodianChatParamsSchema);
const validateCrestodianSetupDetectParams = lazyCompile(CrestodianSetupDetectParamsSchema);
const validateCrestodianSetupVerifyParams = lazyCompile(CrestodianSetupVerifyParamsSchema);
const validateCrestodianSetupActivateParams = lazyCompile(CrestodianSetupActivateParamsSchema);
const validateCrestodianSetupAuthStartParams = lazyCompile(CrestodianSetupAuthStartParamsSchema);
const validateWizardStartParams = lazyCompile(WizardStartParamsSchema);
const validateWizardNextParams = lazyCompile(WizardNextParamsSchema);
const validateWizardCancelParams = lazyCompile(WizardCancelParamsSchema);
const validateWizardStatusParams = lazyCompile(WizardStatusParamsSchema);
const validateTalkModeParams = lazyCompile(TalkModeParamsSchema);
const validateTalkEvent = lazyCompile(TalkEventSchema);
const validateTalkCatalogParams = lazyCompile(TalkCatalogParamsSchema);
const validateTalkCatalogResult = lazyCompile(TalkCatalogResultSchema);
const validateTalkConfigParams = lazyCompile(TalkConfigParamsSchema);
const validateTalkConfigResult = lazyCompile(TalkConfigResultSchema);
const validateTalkClientCreateParams = lazyCompile(TalkClientCreateParamsSchema);
const validateTalkClientCreateResult = lazyCompile(TalkClientCreateResultSchema);
const validateTalkClientToolCallParams = lazyCompile(TalkClientToolCallParamsSchema);
const validateTalkClientToolCallResult = lazyCompile(TalkClientToolCallResultSchema);
const validateTalkClientSteerParams = lazyCompile(TalkClientSteerParamsSchema);
const validateTalkAgentControlResult = lazyCompile(TalkAgentControlResultSchema);
const validateTalkSessionCreateParams = lazyCompile(TalkSessionCreateParamsSchema);
const validateTalkSessionCreateResult = lazyCompile(TalkSessionCreateResultSchema);
const validateTalkSessionJoinParams = lazyCompile(TalkSessionJoinParamsSchema);
const validateTalkSessionJoinResult = lazyCompile(TalkSessionJoinResultSchema);
const validateTalkSessionAppendAudioParams = lazyCompile(TalkSessionAppendAudioParamsSchema);
const validateTalkSessionAcknowledgeMarkParams = lazyCompile(
  TalkSessionAcknowledgeMarkParamsSchema,
);
const validateTalkSessionTurnParams = lazyCompile(TalkSessionTurnParamsSchema);
const validateTalkSessionCancelTurnParams = lazyCompile(TalkSessionCancelTurnParamsSchema);
const validateTalkSessionCancelOutputParams = lazyCompile(TalkSessionCancelOutputParamsSchema);
const validateTalkSessionTurnResult = lazyCompile(TalkSessionTurnResultSchema);
const validateTalkSessionSteerParams = lazyCompile(TalkSessionSteerParamsSchema);
const validateTalkSessionSubmitToolResultParams = lazyCompile(
  TalkSessionSubmitToolResultParamsSchema,
);
const validateTalkSessionCloseParams = lazyCompile(TalkSessionCloseParamsSchema);
const validateTalkSessionOkResult = lazyCompile(TalkSessionOkResultSchema);
const validateTalkSpeakParams = lazyCompile(TalkSpeakParamsSchema);
const validateTalkSpeakResult = lazyCompile(TalkSpeakResultSchema);
const validateTtsSpeakParams = lazyCompile(TtsSpeakParamsSchema);
const validateTtsSpeakResult = lazyCompile(TtsSpeakResultSchema);
const validateChannelsStatusParams = lazyCompile(ChannelsStatusParamsSchema);
const validateChannelsStartParams = lazyCompile(ChannelsStartParamsSchema);
const validateChannelsStopParams = lazyCompile(ChannelsStopParamsSchema);
const validateChannelsLogoutParams = lazyCompile(ChannelsLogoutParamsSchema);
const validateModelsListParams = lazyCompile(ModelsListParamsSchema);
const validateSkillsStatusParams = lazyCompile(SkillsStatusParamsSchema);
const validateToolsCatalogParams = lazyCompile(ToolsCatalogParamsSchema);
const validateToolsEffectiveParams = lazyCompile(ToolsEffectiveParamsSchema);
const validateToolsInvokeParams = lazyCompile(ToolsInvokeParamsSchema);
const validateSkillsBinsParams = lazyCompile(SkillsBinsParamsSchema);
const validateSkillsInstallParams = lazyCompile(SkillsInstallParamsSchema);
const validateSkillsUploadBeginParams = lazyCompile(SkillsUploadBeginParamsSchema);
const validateSkillsUploadChunkParams = lazyCompile(SkillsUploadChunkParamsSchema);
const validateSkillsUploadCommitParams = lazyCompile(SkillsUploadCommitParamsSchema);
const validateSkillsUpdateParams = lazyCompile(SkillsUpdateParamsSchema);
const validateSkillsSearchParams = lazyCompile(SkillsSearchParamsSchema);
const validateSkillsDetailParams = lazyCompile(SkillsDetailParamsSchema);
const validateSkillsCuratorStatusParams = lazyCompile(SkillsCuratorStatusParamsSchema);
const validateSkillsCuratorActionParams = lazyCompile(SkillsCuratorActionParamsSchema);
const validateSkillsProposalsListParams = lazyCompile(SkillsProposalsListParamsSchema);
const validateSkillsProposalInspectParams = lazyCompile(SkillsProposalInspectParamsSchema);
const validateSkillsProposalCreateParams = lazyCompile(SkillsProposalCreateParamsSchema);
const validateSkillsProposalUpdateParams = lazyCompile(SkillsProposalUpdateParamsSchema);
const validateSkillsProposalReviseParams = lazyCompile(SkillsProposalReviseParamsSchema);
const validateSkillsProposalRequestRevisionParams = lazyCompile(
  SkillsProposalRequestRevisionParamsSchema,
);
const validateSkillsProposalActionParams = lazyCompile(SkillsProposalActionParamsSchema);
const validateSkillsSecurityVerdictsParams = lazyCompile(SkillsSecurityVerdictsParamsSchema);
const validateSkillsSkillCardParams = lazyCompile(SkillsSkillCardParamsSchema);
const validateCronListParams = lazyCompile(CronListParamsSchema);
const validateCronStatusParams = lazyCompile(CronStatusParamsSchema);
const validateCronGetParams = lazyCompile(CronGetParamsSchema);
const validateCronAddParams = lazyCompile(CronAddParamsSchema);
const validateCronUpdateParams = lazyCompile(CronUpdateParamsSchema);
const validateCronRemoveParams = lazyCompile(CronRemoveParamsSchema);
const validateCronRunParams = lazyCompile(CronRunParamsSchema);
const validateCronRunsParams = lazyCompile(CronRunsParamsSchema);
const validateDevicePairListParams = lazyCompile(DevicePairListParamsSchema);
const validateDevicePairApproveParams = lazyCompile(DevicePairApproveParamsSchema);
const validateDevicePairRejectParams = lazyCompile(DevicePairRejectParamsSchema);
const validateDevicePairRemoveParams = lazyCompile(DevicePairRemoveParamsSchema);
const validateDevicePairSetupCodeParams = lazyCompile(DevicePairSetupCodeParamsSchema);
const validateDevicePairRenameParams = lazyCompile(DevicePairRenameParamsSchema);
const validateDeviceTokenRotateParams = lazyCompile(DeviceTokenRotateParamsSchema);
const validateDeviceTokenRevokeParams = lazyCompile(DeviceTokenRevokeParamsSchema);
const validateApprovalKind = lazyCompile(ApprovalKindSchema);
const validateApprovalDecision = lazyCompile(ApprovalDecisionSchema);
const validateApprovalAllowDecision = lazyCompile(ApprovalAllowDecisionSchema);
const validateApprovalTerminalReason = lazyCompile(ApprovalTerminalReasonSchema);
const validatePluginApprovalSeverity = lazyCompile(PluginApprovalSeveritySchema);
const validateExecApprovalPresentation = lazyCompile(ExecApprovalPresentationSchema);
const validatePluginApprovalPresentation = lazyCompile(PluginApprovalPresentationSchema);
const validateApprovalPresentation = lazyCompile(ApprovalPresentationSchema);
const validatePendingApprovalSnapshot = lazyCompile(PendingApprovalSnapshotSchema);
const validateAllowedApprovalSnapshot = lazyCompile(AllowedApprovalSnapshotSchema);
const validateDeniedApprovalSnapshot = lazyCompile(DeniedApprovalSnapshotSchema);
const validateExpiredApprovalSnapshot = lazyCompile(ExpiredApprovalSnapshotSchema);
const validateCancelledApprovalSnapshot = lazyCompile(CancelledApprovalSnapshotSchema);
const validateApprovalSnapshot = lazyCompile(ApprovalSnapshotSchema);
const validateTerminalApprovalSnapshot = lazyCompile(TerminalApprovalSnapshotSchema);
const validateApprovalGetParams = lazyCompile(ApprovalGetParamsSchema);
const validateApprovalResolveParams = lazyCompile(ApprovalResolveParamsSchema);
const validateExecApprovalsGetParams = lazyCompile(ExecApprovalsGetParamsSchema);
const validateExecApprovalsSetParams = lazyCompile(ExecApprovalsSetParamsSchema);
const validateExecApprovalGetParams = lazyCompile(ExecApprovalGetParamsSchema);
const validateExecApprovalRequestParams = lazyCompile(ExecApprovalRequestParamsSchema);
const validateExecApprovalResolveParams = lazyCompile(ExecApprovalResolveParamsSchema);
const validatePluginApprovalRequestParams = lazyCompile(PluginApprovalRequestParamsSchema);
const validatePluginApprovalResolveParams = lazyCompile(PluginApprovalResolveParamsSchema);
const validatePluginsListParams = lazyCompile(PluginsListParamsSchema);
const validatePluginsListResult = lazyCompile(PluginsListResultSchema);
const validatePluginsSearchParams = lazyCompile(PluginsSearchParamsSchema);
const validatePluginsSearchResult = lazyCompile(PluginsSearchResultSchema);
const validatePluginsInstallParams = lazyCompile(PluginsInstallParamsSchema);
const validatePluginsInstallResult = lazyCompile(PluginsInstallResultSchema);
const validatePluginsSetEnabledParams = lazyCompile(PluginsSetEnabledParamsSchema);
const validatePluginsSetEnabledResult = lazyCompile(PluginsSetEnabledResultSchema);
const validatePluginsUninstallParams = lazyCompile(PluginsUninstallParamsSchema);
const validatePluginsUninstallResult = lazyCompile(PluginsUninstallResultSchema);
const validatePluginsUiDescriptorsParams = lazyCompile(PluginsUiDescriptorsParamsSchema);
const validatePluginsUiDescriptorsResult = lazyCompile(PluginsUiDescriptorsResultSchema);
const validatePluginsSessionActionParams = lazyCompile(PluginsSessionActionParamsSchema);
const validatePluginsSessionActionResult = lazyCompile(PluginsSessionActionResultSchema);
const validateExecApprovalsNodeGetParams = lazyCompile(ExecApprovalsNodeGetParamsSchema);
const validateExecApprovalsNodeSetParams = lazyCompile(ExecApprovalsNodeSetParamsSchema);
const validateExecApprovalsNodeSnapshot = lazyCompile(ExecApprovalsNodeSnapshotSchema);
const validateLogsTailParams = lazyCompile(LogsTailParamsSchema);
const validateTerminalOpenParams = lazyCompile(TerminalOpenParamsSchema);
const validateTerminalInputParams = lazyCompile(TerminalInputParamsSchema);
const validateTerminalResizeParams = lazyCompile(TerminalResizeParamsSchema);
const validateTerminalCloseParams = lazyCompile(TerminalCloseParamsSchema);
const validateTerminalAttachParams = lazyCompile(TerminalAttachParamsSchema);
const validateTerminalTextParams = lazyCompile(TerminalTextParamsSchema);
const validateTerminalEvent = lazyCompile(TerminalEventSchema);
const validateModelsProbeParams = lazyCompile(ModelsProbeParamsSchema);
const validateChatHistoryParams = lazyCompile(ChatHistoryParamsSchema);
const validateChatMetadataParams = lazyCompile(ChatMetadataParamsSchema);
const validateChatMessageGetParams = lazyCompile(ChatMessageGetParamsSchema);
const validateChatToolTitlesParams = lazyCompile(ChatToolTitlesParamsSchema);
const validateChatSendParams = lazyCompile(ChatSendParamsSchema);
const validateChatAbortParams = lazyCompile(ChatAbortParamsSchema);
const validateChatInjectParams = lazyCompile(ChatInjectParamsSchema);
const validateChatEvent = lazyCompile(ChatEventSchema);
const validateChatMessageGetResult = lazyCompile(ChatMessageGetResultSchema);
const validateUpdateStatusParams = lazyCompile(UpdateStatusParamsSchema);
const validateUpdateRunParams = lazyCompile(UpdateRunParamsSchema);
const validateWebLoginStartParams = lazyCompile(WebLoginStartParamsSchema);
const validateWebLoginWaitParams = lazyCompile(WebLoginWaitParamsSchema);
//#endregion
export {
  validateCrestodianSetupDetectParams as $,
  validateWorktreesBranchesParams as $i,
  validateSessionsDispatchResult as $n,
  validateTalkSessionAcknowledgeMarkParams as $r,
  validateNodePairApproveParams as $t,
  validateChannelsStatusParams as A,
  validateToolsCatalogParams as Ai,
  validatePollParams as An,
  validateSkillsProposalsListParams as Ar,
  validateExecApprovalsNodeSnapshot as At,
  validateChatToolTitlesParams as B,
  validateWebPushSubscribeParams as Bi,
  validateSessionsCatalogListParams as Bn,
  validateSystemInfoResult as Br,
  validateGatewaySuspendStatusResult as Bt,
  validateArtifactsGetParams as C,
  validateTerminalAttachParams as Ci,
  validatePluginsSessionActionResult as Cn,
  validateSkillsInstallParams as Cr,
  validateExecApprovalGetParams as Ct,
  validateCancelledApprovalSnapshot as D,
  validateTerminalOpenParams as Di,
  validatePluginsUiDescriptorsResult as Dn,
  validateSkillsProposalRequestRevisionParams as Dr,
  validateExecApprovalsGetParams as Dt,
  validateAuditListParams as E,
  validateTerminalInputParams as Ei,
  validatePluginsUiDescriptorsParams as En,
  validateSkillsProposalInspectParams as Er,
  validateExecApprovalResolveParams as Et,
  validateChatInjectParams as F,
  validateUpdateRunParams as Fi,
  validateSecretsResolveResult as Fn,
  validateSkillsUpdateParams as Fr,
  validateGatewaySuspendPrepareParams as Ft,
  validateConfigSchemaLookupParams as G,
  validateWizardNextParams as Gi,
  validateSessionsCompactionGetParams as Gn,
  validateTalkClientCreateResult as Gr,
  validateNodeDescribeParams as Gt,
  validateConfigApplyParams as H,
  validateWebPushUnsubscribeParams as Hi,
  validateSessionsCleanupParams as Hn,
  validateTalkCatalogParams as Hr,
  validateMessageActionParams as Ht,
  validateChatMessageGetParams as I,
  validateUpdateStatusParams as Ii,
  validateSendParams as In,
  validateSkillsUploadBeginParams as Ir,
  validateGatewaySuspendPrepareResult as It,
  validateConfigSetParams as J,
  validateWorkerAdmissionHandshake as Ji,
  validateSessionsCreateParams as Jn,
  validateTalkClientToolCallResult as Jr,
  validateNodeInvokeInputEvent as Jt,
  validateConfigSchemaLookupResult as K,
  validateWizardStartParams as Ki,
  validateSessionsCompactionListParams as Kn,
  validateTalkClientSteerParams as Kr,
  validateNodeEventParams as Kt,
  validateChatMessageGetResult as L,
  validateWakeParams as Li,
  validateSessionsAbortParams as Ln,
  validateSkillsUploadChunkParams as Lr,
  validateGatewaySuspendResumeParams as Lt,
  validateChatAbortParams as M,
  validateToolsInvokeParams as Mi,
  validateRequestFrame as Mn,
  validateSkillsSecurityVerdictsParams as Mr,
  validateExpiredApprovalSnapshot as Mt,
  validateChatEvent as N,
  validateTtsSpeakParams as Ni,
  validateResponseFrame as Nn,
  validateSkillsSkillCardParams as Nr,
  validateFsListDirParams as Nt,
  validateChannelsLogoutParams as O,
  validateTerminalResizeParams as Oi,
  validatePluginsUninstallParams as On,
  validateSkillsProposalReviseParams as Or,
  validateExecApprovalsNodeGetParams as Ot,
  validateChatHistoryParams as P,
  validateTtsSpeakResult as Pi,
  validateSecretsResolveParams as Pn,
  validateSkillsStatusParams as Pr,
  validateFsListDirResult as Pt,
  validateCrestodianSetupAuthStartParams as Q,
  validateWorkerTranscriptCommitParams as Qi,
  validateSessionsDispatchParams as Qn,
  validateTalkModeParams as Qr,
  validateNodeListParams as Qt,
  validateChatMetadataParams as R,
  validateWebLoginStartParams as Ri,
  validateSessionsCatalogArchiveParams as Rn,
  validateSkillsUploadCommitParams as Rr,
  validateGatewaySuspendResumeResult as Rt,
  validateArtifactsDownloadParams as S,
  validateTerminalApprovalSnapshot as Si,
  validatePluginsSessionActionParams as Sn,
  validateSkillsDetailParams as Sr,
  validateEventFrame as St,
  validateAuditActivityListParams as T,
  validateTerminalEvent as Ti,
  validatePluginsSetEnabledResult as Tn,
  validateSkillsProposalCreateParams as Tr,
  validateExecApprovalRequestParams as Tt,
  validateConfigGetParams as U,
  validateWebPushVapidPublicKeyParams as Ui,
  validateSessionsCompactParams as Un,
  validateTalkCatalogResult as Ur,
  validateModelsListParams as Ut,
  validateCommandsListParams as V,
  validateWebPushTestParams as Vi,
  validateSessionsCatalogReadParams as Vn,
  validateTalkAgentControlResult as Vr,
  validateLogsTailParams as Vt,
  validateConfigPatchParams as W,
  validateWizardCancelParams as Wi,
  validateSessionsCompactionBranchParams as Wn,
  validateTalkClientCreateParams as Wr,
  validateModelsProbeParams as Wt,
  validateCrestodianChatParams as X,
  validateWorkerHeartbeatParams as Xi,
  validateSessionsDescribeParams as Xn,
  validateTalkConfigResult as Xr,
  validateNodeInvokeProgressParams as Xt,
  validateConnectParams as Y,
  validateWorkerConnectRequestFrame as Yi,
  validateSessionsDeleteParams as Yn,
  validateTalkConfigParams as Yr,
  validateNodeInvokeParams as Yt,
  validateCrestodianSetupActivateParams as Z,
  validateWorkerLiveEventParams as Zi,
  validateSessionsDiffParams as Zn,
  validateTalkEvent as Zr,
  validateNodeInvokeResultParams as Zt,
  validateApprovalKind as _,
  validateTaskSuggestionsDismissParams as _i,
  validatePluginsInstallResult as _n,
  validateSessionsSendParams as _r,
  validateDeviceTokenRotateParams as _t,
  validateAgentsDeleteParams as a,
  validateMigrationsMemoryApplyParams as aa,
  validateTalkSessionCreateResult as ai,
  validateNodePendingEnqueueParams as an,
  validateSessionsGroupsPutParams as ar,
  validateCronRunParams as at,
  validateApprovalSnapshot as b,
  validateTasksGetParams as bi,
  validatePluginsSearchParams as bn,
  validateSkillsCuratorActionParams as br,
  validateEnvironmentsListParams as bt,
  validateAgentsFilesSetParams as c,
  validateApprovalResolveResult as ca,
  validateTalkSessionOkResult as ci,
  validateNodePresenceAlivePayload as cn,
  validateSessionsMessagesSubscribeParams as cr,
  validateCronUpdateParams as ct,
  validateAgentsWorkspaceGetParams as d,
  isClawHubTrustErrorCode as da,
  validateTalkSessionTurnParams as di,
  validatePendingApprovalSnapshot as dn,
  validateSessionsPluginPatchParams as dr,
  validateDevicePairListParams as dt,
  validateWorktreesCreateParams as ea,
  validateTalkSessionAppendAudioParams as ei,
  validateNodePairListParams as en,
  validateSessionsFilesGetParams as er,
  validateCrestodianSetupVerifyParams as et,
  validateAgentsWorkspaceListParams as f,
  readClawHubTrustErrorDetails as fa,
  validateTalkSessionTurnResult as fi,
  validatePluginApprovalPresentation as fn,
  validateSessionsPreviewParams as fr,
  validateDevicePairRejectParams as ft,
  validateApprovalGetParams as g,
  validateTaskSuggestionsCreateParams as gi,
  validatePluginsInstallParams as gn,
  validateSessionsSearchResult as gr,
  validateDeviceTokenRevokeParams as gt,
  validateApprovalDecision as h,
  validateTaskSuggestionsAcceptParams as hi,
  validatePluginApprovalSeverity as hn,
  validateSessionsSearchParams as hr,
  validateDevicePairSetupCodeParams as ht,
  validateAgentsCreateParams as i,
  validateWorktreesRestoreParams as ia,
  validateTalkSessionCreateParams as ii,
  validateNodePendingDrainParams as in,
  validateSessionsGroupsListParams as ir,
  validateCronRemoveParams as it,
  validateChannelsStopParams as j,
  validateToolsEffectiveParams as ji,
  validatePushTestParams as jn,
  validateSkillsSearchParams as jr,
  validateExecApprovalsSetParams as jt,
  validateChannelsStartParams as k,
  validateTerminalTextParams as ki,
  validatePluginsUninstallResult as kn,
  validateSkillsProposalUpdateParams as kr,
  validateExecApprovalsNodeSetParams as kt,
  validateAgentsListParams as l,
  ClawHubTrustErrorCodes as la,
  validateTalkSessionSteerParams as li,
  validateNodeRenameParams as ln,
  validateSessionsMessagesUnsubscribeParams as lr,
  validateDeniedApprovalSnapshot as lt,
  validateApprovalAllowDecision as m,
  validateTalkSpeakResult as mi,
  validatePluginApprovalResolveParams as mn,
  validateSessionsResolveParams as mr,
  validateDevicePairRenameParams as mt,
  validateAgentParams as n,
  validateWorktreesListParams as na,
  validateTalkSessionCancelTurnParams as ni,
  validateNodePairRemoveParams as nn,
  validateSessionsFilesSetParams as nr,
  validateCronGetParams as nt,
  validateAgentsFilesGetParams as o,
  validateMigrationsMemoryPlanParams as oa,
  validateTalkSessionJoinParams as oi,
  validateNodePluginToolsUpdateParams as on,
  validateSessionsGroupsRenameParams as or,
  validateCronRunsParams as ot,
  validateAllowedApprovalSnapshot as p,
  validateTalkSpeakParams as pi,
  validatePluginApprovalRequestParams as pn,
  validateSessionsResetParams as pr,
  validateDevicePairRemoveParams as pt,
  validateConfigSchemaParams as q,
  validateWizardStatusParams as qi,
  validateSessionsCompactionRestoreParams as qn,
  validateTalkClientToolCallParams as qr,
  validateNodeEventResult as qt,
  validateAgentWaitParams as r,
  validateWorktreesRemoveParams as ra,
  validateTalkSessionCloseParams as ri,
  validateNodePendingAckParams as rn,
  validateSessionsGroupsDeleteParams as rr,
  validateCronListParams as rt,
  validateAgentsFilesListParams as s,
  validateApprovalGetResult as sa,
  validateTalkSessionJoinResult as si,
  validateNodePresenceActivityPayload as sn,
  validateSessionsListParams as sr,
  validateCronStatusParams as st,
  validateAgentIdentityParams as t,
  validateWorktreesGcParams as ta,
  validateTalkSessionCancelOutputParams as ti,
  validateNodePairRejectParams as tn,
  validateSessionsFilesListParams as tr,
  validateCronAddParams as tt,
  validateAgentsUpdateParams as u,
  buildClawHubTrustErrorDetails as ua,
  validateTalkSessionSubmitToolResultParams as ui,
  validateNodeSkillsUpdateParams as un,
  validateSessionsPatchParams as ur,
  validateDevicePairApproveParams as ut,
  validateApprovalPresentation as v,
  validateTaskSuggestionsListParams as vi,
  validatePluginsListParams as vn,
  validateSessionsUsageParams as vr,
  validateEnvironmentsCreateParams as vt,
  validateArtifactsListParams as w,
  validateTerminalCloseParams as wi,
  validatePluginsSetEnabledParams as wn,
  validateSkillsProposalActionParams as wr,
  validateExecApprovalPresentation as wt,
  validateApprovalTerminalReason as x,
  validateTasksListParams as xi,
  validatePluginsSearchResult as xn,
  validateSkillsCuratorStatusParams as xr,
  validateEnvironmentsStatusParams as xt,
  validateApprovalResolveParams as y,
  validateTasksCancelParams as yi,
  validatePluginsListResult as yn,
  validateSkillsBinsParams as yr,
  validateEnvironmentsDestroyParams as yt,
  validateChatSendParams as z,
  validateWebLoginWaitParams as zi,
  validateSessionsCatalogContinueParams as zn,
  validateSystemInfoParams as zr,
  validateGatewaySuspendStatusParams as zt,
};
