import { t as resolveOpenClawAgentDir } from "../agent-dir-compat-d7bWcNLv.js";
import {
  a as buildHarnessContextEngineRuntimeContext,
  c as isActiveHarnessContextEngine,
  i as bootstrapHarnessContextEngine,
  l as runHarnessContextEngineMaintenance,
  n as runAgentEndSideEffects,
  o as buildHarnessContextEngineRuntimeContextFromUsage,
  r as assembleHarnessContextEngine,
  s as finalizeHarnessContextEngineTurn,
  t as awaitAgentEndSideEffects,
} from "../agent-end-side-effects-PAHWJAYi.js";
import {
  S as resetAgentEventsForTest,
  c as emitAgentEvent,
  v as onAgentEvent,
} from "../agent-events-D4UsOPeT.js";
import {
  a as inferToolMetaFromArgs,
  c as createCodexAppServerToolResultExtensionRunner,
  d as runAgentHarnessBeforeCompactionHook,
  f as buildAgentHarnessUserInputAnswers,
  g as normalizeAgentHarnessUserInputAnswer,
  h as formatAgentHarnessUserInputPrompt,
  i as formatToolProgressOutput,
  l as resolveAgentHarnessBeforePromptBuildResult,
  m as emptyAgentHarnessUserInputAnswers,
  n as classifyAgentHarnessTerminalOutcome,
  o as loadCodexBundleMcpThreadConfig,
  p as deliverAgentHarnessUserInputPrompt,
  r as detectAndLoadAgentHarnessPromptImages,
  s as queueAgentHarnessMessage,
  t as TOOL_PROGRESS_OUTPUT_MAX_CHARS,
  u as runAgentHarnessAfterCompactionHook,
} from "../agent-harness-runtime-BjY9gsEs.js";
import {
  a as resolveAgentDir,
  s as resolveDefaultAgentDir,
} from "../agent-scope-config-DVIR1nBa.js";
import { y as resolveSessionAgentIds } from "../agent-scope-y9xQv_q1.js";
import { t as createOpenClawCodingTools } from "../agent-tools-CQdhKaa9.js";
import {
  a as getBeforeToolCallPolicyDiagnosticState,
  f as runBeforeToolCallHook,
  h as consumePreExecutionBlockedToolCall,
  i as getBeforeToolCallFailureDisposition,
  m as consumeAdjustedParamsForToolCall,
  o as hasBeforeToolCallPolicy,
  p as wrapToolWithBeforeToolCallHook,
  r as finalizeToolTerminalPresentation,
  u as requestDeferredPluginToolApproval,
} from "../agent-tools.before-tool-call-B7gv78c3.js";
import { t as formatApprovalDisplayPath } from "../approval-display-paths-DlQSsCnq.js";
import {
  r as resolveEmbeddedAttemptToolConstructionPlan,
  t as applyEmbeddedAttemptToolsAllow,
} from "../attempt-tool-construction-plan-tLraujwv.js";
import { o as resolveAttemptFsWorkspaceOnly } from "../attempt.prompt-helpers-CztYiE1m.js";
import { r as resolveAttemptSpawnWorkspaceDir } from "../attempt.thread-helpers-Di7wVu5W.js";
import {
  c as formatPrePromptPrecheckLog,
  i as PREEMPTIVE_OVERFLOW_ERROR_TEXT,
  l as shouldPreemptivelyCompactBeforePrompt,
  n as createAgentToolResultMiddlewareRunner,
  r as runAgentCleanupStep,
  s as estimateRenderedLlmBoundaryTokenPressure,
  t as buildEmbeddedAttemptToolRunContext,
} from "../attempt.tool-run-context-DzOtUuEC.js";
import {
  a as resolveBootstrapContextForRun,
  n as buildBootstrapContextForFiles,
  o as resolveBootstrapFilesForRun,
} from "../bootstrap-files-B9pwG25K.js";
import { r as buildAgentRuntimePlan } from "../build-DkA06gaM.js";
import { c as resolveWebSearchToolPolicy } from "../codex-native-web-search-core-DGXC1P49.js";
import {
  a as hasSandboxBindReadonlyHostShadows,
  i as hasSandboxBindContainerPathAliases,
  n as resolveSandboxContext,
  o as resolveWritableSandboxBindHostRoots,
} from "../context-CEFGZ0oc.js";
import {
  A as compactWithSafetyTimeout,
  j as resolveCompactionTimeoutMs,
  k as compactContextEngineWithSafetyTimeout,
} from "../diagnostic-DE-wbBb7.js";
import {
  n as isDeliveredMessageToolOnlySourceReplyResult,
  r as isDeliveredMessagingToolResult,
} from "../embedded-agent-message-tool-source-reply-C7h4djeo.js";
import {
  a as isMessagingToolSendAction,
  r as isMessagingTool,
} from "../embedded-agent-messaging-C_REpMqa.js";
import {
  a as extractMessagingToolSend,
  f as filterToolResultMediaUrls,
  g as sanitizeToolResult,
  l as extractToolErrorMessage,
  o as extractMessagingToolSendResult,
  u as extractToolResultMediaArtifact,
} from "../embedded-agent-subscribe.tools-Bv1-LBFe.js";
import { r as formatErrorMessage } from "../errors-BoHeli7m.js";
import { a as fingerprintResolvedAuthProfileCredential } from "../execution-auth-binding-CmucNoqo.js";
import {
  n as formatFastModeAutoProgressText,
  u as resolveFastModeForElapsed,
} from "../fast-mode-BhVbWk_p.js";
import {
  D as isToolWrappedWithBeforeToolCallHook,
  O as setBeforeToolCallDiagnosticsEnabled,
  t as callGatewayTool,
  x as getChannelAgentToolMeta,
} from "../gateway-Dyh1k_4Q.js";
import {
  o as normalizeHeartbeatToolResponse,
  t as HEARTBEAT_RESPONSE_TOOL_NAME,
} from "../heartbeat-tool-response-B3cJVfMo.js";
import { c as resolveUserPath } from "../home-dir-DxrrpDft.js";
import { t as buildAgentHookContextChannelFields } from "../hook-agent-context-BL_Cd-K4.js";
import {
  n as runAgentHarnessBeforeMessageWriteHook,
  t as runAgentHarnessAfterToolCallHook,
} from "../hook-helpers-jOYXwwnX.js";
import {
  r as assertContextEngineHostSupport,
  t as CODEX_APP_SERVER_CONTEXT_ENGINE_HOST,
} from "../host-compat-BibWlia2.js";
import {
  a as runAgentHarnessLlmInputHook,
  i as runAgentHarnessBeforeAgentFinalizeHook,
  n as getAgentHarnessHookRunner,
  o as runAgentHarnessLlmOutputHook,
  r as runAgentHarnessAgentEndHook,
  t as awaitAgentHarnessAgentEndHook,
} from "../lifecycle-hook-helpers-qaFalH5z.js";
import {
  A as isHostScopedAgentToolActive,
  D as isAgentToolReplaySafe,
} from "../local-model-lean-D3O2n_2v.js";
import { t as log } from "../logger-C5RMMskO.js";
import { p as resolveModelAuthMode } from "../model-auth-BWFdcEzF.js";
import {
  c as resolveNativeHookRelayDeferredToolApproval,
  l as testing,
  n as hasNativeHookRelayInvocation,
  o as registerNativeHookRelay,
  r as invokeNativeHookRelay,
  t as buildNativeHookRelayCommand,
} from "../native-hook-relay-WEC9uRFL.js";
import {
  a as selectDefaultNodeFromList,
  i as resolveNodeIdFromList,
  t as listNodes,
} from "../nodes-utils-CLhkTx8I.js";
import { B as resolveEmbeddedAgentRuntime } from "../openai-routing-Cu28Ynzk.js";
import { l as supportsModelTools } from "../openai-transport-stream-BFFr80cz.js";
import {
  i as getModelProviderRequestTransport,
  n as attachModelProviderRequestTransport,
} from "../provider-request-config-DpW-uV6A.js";
import { s as resolveContextEngineOwnerPluginId } from "../registry-DXbEDAsr.js";
import { n as disposeRegisteredAgentHarnesses } from "../registry-ef8V3P8D.js";
import { t as FAST_MODE_AUTO_PROGRESS_KIND } from "../reply-payload-BK_jICQ3.js";
import { t as classifyEmbeddedAgentRunResultForModelFallback } from "../result-fallback-classifier-DdIowatH.js";
import { m as resolveActiveEmbeddedRunSessionId } from "../run-state-BJlMim-d.js";
import { c as resolveAgentRunAbortLifecycleFields } from "../run-termination-BEbihwT8.js";
import {
  T as setActiveEmbeddedRun,
  n as abortEmbeddedAgentRun,
  r as clearActiveEmbeddedRun,
  t as abortAndDrainEmbeddedAgentRun,
} from "../runs-GL_-RIwi.js";
import { Ht as normalizeUsage } from "../session-accessor-PZVNxFCV.js";
import { a as isSubagentSessionKey } from "../session-key-utils-B8sNp9l4.js";
import {
  o as resolveSessionWriteLockAcquireTimeoutMs,
  s as resolveSessionWriteLockOptions,
  t as acquireSessionWriteLock,
} from "../session-write-lock-ByENUoH7.js";
import {
  n as buildSkillWorkshopPromptSection,
  t as SKILL_WORKSHOP_TOOL_NAME,
} from "../skill-workshop-prompt-ehvgoM5o.js";
import { P as formatToolAggregate } from "../streaming-D_YE0SPS.js";
import { i as isReplaySafeToolCall } from "../tool-mutation-CjFyaPPn.js";
import {
  a as resolveToolExecutionErrorKind,
  n as isToolResultError,
  o as resolveToolResultFailureKind,
  t as formatToolExecutionErrorMessage,
} from "../tool-result-error-1qgstja-.js";
import {
  i as projectRuntimeToolInputSchema,
  r as inspectRuntimeToolInputSchemas,
  t as filterProviderNormalizableTools,
} from "../tool-schema-projection-ZrMdwk4s.js";
import { i as getPluginToolMeta } from "../tools-K3NqAe9E.js";
import {
  i as normalizeProviderToolSchemas,
  n as normalizeAgentRuntimeTools,
  t as logAgentRuntimeToolDiagnostics,
} from "../tools-M6Rtal9l.js";
import { n as VERSION } from "../version-CeFj_iGk.js";
export {
  CODEX_APP_SERVER_CONTEXT_ENGINE_HOST,
  FAST_MODE_AUTO_PROGRESS_KIND,
  HEARTBEAT_RESPONSE_TOOL_NAME,
  VERSION as OPENCLAW_VERSION,
  PREEMPTIVE_OVERFLOW_ERROR_TEXT,
  SKILL_WORKSHOP_TOOL_NAME,
  TOOL_PROGRESS_OUTPUT_MAX_CHARS,
  abortEmbeddedAgentRun as abortAgentHarnessRun,
  abortAndDrainEmbeddedAgentRun as abortAndDrainAgentHarnessRun,
  acquireSessionWriteLock,
  applyEmbeddedAttemptToolsAllow,
  assembleHarnessContextEngine,
  assertContextEngineHostSupport,
  attachModelProviderRequestTransport,
  awaitAgentEndSideEffects,
  awaitAgentHarnessAgentEndHook,
  bootstrapHarnessContextEngine,
  buildAgentHarnessUserInputAnswers,
  buildAgentHookContextChannelFields,
  buildAgentRuntimePlan,
  buildBootstrapContextForFiles,
  buildEmbeddedAttemptToolRunContext,
  buildHarnessContextEngineRuntimeContext,
  buildHarnessContextEngineRuntimeContextFromUsage,
  buildNativeHookRelayCommand,
  buildSkillWorkshopPromptSection,
  callGatewayTool,
  classifyAgentHarnessTerminalOutcome,
  classifyEmbeddedAgentRunResultForModelFallback,
  classifyEmbeddedAgentRunResultForModelFallback as classifyEmbeddedPiRunResultForModelFallback,
  clearActiveEmbeddedRun,
  compactContextEngineWithSafetyTimeout,
  compactWithSafetyTimeout,
  consumeAdjustedParamsForToolCall,
  consumePreExecutionBlockedToolCall,
  createAgentToolResultMiddlewareRunner,
  createCodexAppServerToolResultExtensionRunner,
  createOpenClawCodingTools,
  deliverAgentHarnessUserInputPrompt,
  detectAndLoadAgentHarnessPromptImages,
  disposeRegisteredAgentHarnesses,
  log as embeddedAgentLog,
  emitAgentEvent,
  emptyAgentHarnessUserInputAnswers,
  estimateRenderedLlmBoundaryTokenPressure,
  extractMessagingToolSend,
  extractMessagingToolSendResult,
  extractToolErrorMessage,
  extractToolResultMediaArtifact,
  filterProviderNormalizableTools,
  filterToolResultMediaUrls,
  finalizeHarnessContextEngineTurn,
  finalizeToolTerminalPresentation,
  fingerprintResolvedAuthProfileCredential,
  formatAgentHarnessUserInputPrompt,
  formatApprovalDisplayPath,
  formatErrorMessage,
  formatFastModeAutoProgressText,
  formatPrePromptPrecheckLog,
  formatToolAggregate,
  formatToolExecutionErrorMessage,
  formatToolProgressOutput,
  getAgentHarnessHookRunner,
  getBeforeToolCallFailureDisposition,
  getBeforeToolCallPolicyDiagnosticState,
  getChannelAgentToolMeta,
  getModelProviderRequestTransport,
  getPluginToolMeta,
  hasBeforeToolCallPolicy,
  hasNativeHookRelayInvocation,
  hasSandboxBindContainerPathAliases,
  hasSandboxBindReadonlyHostShadows,
  inferToolMetaFromArgs,
  inspectRuntimeToolInputSchemas,
  invokeNativeHookRelay,
  isActiveHarnessContextEngine,
  isAgentToolReplaySafe,
  isDeliveredMessageToolOnlySourceReplyResult,
  isDeliveredMessagingToolResult,
  isHostScopedAgentToolActive,
  isMessagingTool,
  isMessagingToolSendAction,
  isReplaySafeToolCall,
  isSubagentSessionKey,
  isToolResultError,
  isToolWrappedWithBeforeToolCallHook,
  listNodes,
  loadCodexBundleMcpThreadConfig,
  logAgentRuntimeToolDiagnostics,
  testing as nativeHookRelayTesting,
  normalizeAgentHarnessUserInputAnswer,
  normalizeAgentRuntimeTools,
  normalizeHeartbeatToolResponse,
  normalizeProviderToolSchemas,
  normalizeUsage,
  onAgentEvent,
  projectRuntimeToolInputSchema,
  queueAgentHarnessMessage,
  registerNativeHookRelay,
  requestDeferredPluginToolApproval,
  resetAgentEventsForTest,
  resolveActiveEmbeddedRunSessionId,
  resolveAgentDir,
  resolveAgentHarnessBeforePromptBuildResult,
  resolveAgentRunAbortLifecycleFields,
  resolveAttemptFsWorkspaceOnly,
  resolveAttemptSpawnWorkspaceDir,
  resolveBootstrapContextForRun,
  resolveBootstrapFilesForRun,
  resolveCompactionTimeoutMs,
  resolveContextEngineOwnerPluginId,
  resolveDefaultAgentDir,
  resolveEmbeddedAgentRuntime,
  resolveEmbeddedAttemptToolConstructionPlan,
  resolveFastModeForElapsed,
  resolveModelAuthMode,
  resolveNativeHookRelayDeferredToolApproval,
  resolveNodeIdFromList,
  resolveOpenClawAgentDir,
  resolveSandboxContext,
  resolveSessionAgentIds,
  resolveSessionWriteLockAcquireTimeoutMs,
  resolveSessionWriteLockOptions,
  resolveToolExecutionErrorKind,
  resolveToolResultFailureKind,
  resolveUserPath,
  resolveWebSearchToolPolicy,
  resolveWritableSandboxBindHostRoots,
  runAgentCleanupStep,
  runAgentEndSideEffects,
  runAgentHarnessAfterCompactionHook,
  runAgentHarnessAfterToolCallHook,
  runAgentHarnessAgentEndHook,
  runAgentHarnessBeforeAgentFinalizeHook,
  runAgentHarnessBeforeCompactionHook,
  runAgentHarnessBeforeMessageWriteHook,
  runAgentHarnessLlmInputHook,
  runAgentHarnessLlmOutputHook,
  runBeforeToolCallHook,
  runHarnessContextEngineMaintenance,
  sanitizeToolResult,
  selectDefaultNodeFromList,
  setActiveEmbeddedRun,
  setBeforeToolCallDiagnosticsEnabled,
  shouldPreemptivelyCompactBeforePrompt,
  supportsModelTools,
  wrapToolWithBeforeToolCallHook,
};
