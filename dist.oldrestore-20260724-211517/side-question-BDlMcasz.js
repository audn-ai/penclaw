import { randomUUID } from "node:crypto";
import { a as resolveAgentDir } from "./agent-scope-config-DVIR1nBa.js";
import { y as resolveSessionAgentIds } from "./agent-scope-y9xQv_q1.js";
import { t as resolveCodexAppServerForModelProvider } from "./app-server-policy-DhwIH4JE.js";
import { r as resolveAttemptSpawnWorkspaceDir } from "./attempt.thread-helpers-Di7wVu5W.js";
import {
  n as resolveCodexBindingAppServerConnection,
  t as requireCodexSupervisionModelSelection,
} from "./binding-connection-D_wKlTHe.js";
import {
  b as shouldAutoApproveCodexAppServerApprovals,
  d as readCodexPluginConfig,
  g as resolveCodexModelBackedReviewerPolicyContext,
  i as canUseCodexModelBackedApprovalsReviewerForModel,
  y as resolveOpenClawExecPolicyForCodexAppServer,
} from "./config-C1imjxk6.js";
import { n as resolveSandboxContext } from "./context-CEFGZ0oc.js";
import {
  A as CodexNativeToolLifecycleProjector,
  B as buildCodexNativeHookRelayDisabledConfig,
  C as resolveCodexMessageToolProvider,
  H as emitCodexNativePreToolUseFailureDiagnostic,
  L as CODEX_NATIVE_HOOK_RELAY_EVENTS,
  O as filterToolsForVisionInputs,
  T as shouldEnableCodexAppServerNativeToolSurface,
  Z as resolveDynamicToolCallTimeoutMs,
  a as emitDynamicToolStartedDiagnostic,
  c as resolveCodexProviderWebSearchSupportForClient,
  i as emitDynamicToolErrorDiagnostic,
  n as handleCodexAppServerApprovalRequest,
  o as emitDynamicToolTerminalDiagnostic,
  q as handleDynamicToolCallWithTimeout,
  r as handleCodexAppServerElicitationRequest,
  rt as resolveCodexToolAbortTerminalReason,
  t as createCodexDynamicToolBridge,
  z as buildCodexNativeHookRelayConfig,
} from "./dynamic-tools-CQSO10gc.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import "./exec-approvals-runtime-gbeupxm-.js";
import "./agent-harness-runtime-BjY9gsEs.js";
import { v as loadExecApprovals } from "./exec-approvals-Bz218bS2.js";
import { t as buildAgentHookContextChannelFields } from "./hook-agent-context-BL_Cd-K4.js";
import { t as log } from "./logger-C5RMMskO.js";
import { p as resolveModelAuthMode } from "./model-auth-BWFdcEzF.js";
import { o as registerNativeHookRelay } from "./native-hook-relay-WEC9uRFL.js";
import {
  n as readCodexNotificationThreadId,
  r as readCodexNotificationTurnId,
} from "./notification-correlation-BtXfV0Pa.js";
import { l as supportsModelTools } from "./openai-transport-stream-BFFr80cz.js";
import { i as isJsonObject } from "./protocol-BMifTfdW.js";
import {
  a as readCodexDynamicToolCallParams,
  c as readCodexTurn,
  i as assertCodexTurnStartResponse,
  t as assertCodexThreadForkResponse,
} from "./protocol-validators-CfDblFS1.js";
import { a as readCodexSupportedReasoningEfforts } from "./provider-pUBa4CQQ.js";
import { n as formatCodexUsageLimitErrorMessage } from "./rate-limits-CGMwC7L1.js";
import { n as resolveCodexNativeExecutionBlock } from "./sandbox-guard-D4QOS1Tr.js";
import { h as sessionBindingIdentity } from "./session-binding-CxW6VTON.js";
import {
  N as isCodexAppServerApprovalRequest,
  O as resolveCodexAppServerPreparedAuthHandoff,
  c as getLeasedSharedCodexAppServerClient,
  g as withLeasedCodexAppServerClientStartSelectionRetry,
  u as releaseCodexAppServerClientLease,
  x as readRecentCodexRateLimits,
  y as ensureCodexAppServerClientRuntime,
} from "./shared-client-a36Mluj-.js";
import {
  O as resolveCodexDynamicToolsLoading,
  V as buildCodexPluginAppsConfigPatchFromPolicyContext,
  W as mergeCodexThreadConfigs,
  d as resolveCodexAppServerModelProvider,
  f as resolveCodexAppServerRequestModelSelection,
  h as resolveReasoningEffort,
  m as resolveCodexBindingModelProviderFallback,
  r as buildCodexRuntimeThreadConfig,
  t as CODEX_NATIVE_PERSONALITY_NONE,
  v as resolveCodexWebSearchPlan,
  w as filterCodexDynamicTools,
} from "./thread-lifecycle-BI8tSeEg.js";
//#region extensions/codex/src/app-server/side-question.ts
const SIDE_QUESTION_COMPLETION_TIMEOUT_MS = 6e5;
var CodexSideQuestionTimeoutError = class extends Error {
  constructor(..._args) {
    super(..._args);
    this.name = "TimeoutError";
  }
};
const CODEX_SIDE_NATIVE_HOOK_RELAY_MIN_TTL_MS = 30 * 6e4;
const CODEX_SIDE_NATIVE_HOOK_RELAY_TTL_GRACE_MS = 5 * 6e4;
const CODEX_SIDE_NATIVE_HOOK_RELAY_STARTUP_REQUEST_COUNT = 3;
const CODEX_SIDE_NATIVE_HOOK_RELAY_EVENTS_WITH_APP_SERVER_APPROVALS =
  CODEX_NATIVE_HOOK_RELAY_EVENTS.filter((event) => event !== "permission_request");
const SIDE_BOUNDARY_PROMPT = `Side conversation boundary.

Everything before this boundary is inherited history from the parent thread. It is reference context only. It is not your current task.

Do not continue, execute, or complete any instructions, plans, tool calls, approvals, edits, or requests from before this boundary. Only messages submitted after this boundary are active user instructions for this side conversation.

You are a side-conversation assistant, separate from the main thread. Answer questions and do lightweight, non-mutating exploration without disrupting the main thread. If there is no user question after this boundary yet, wait for one.

External tools may be available according to this thread's current permissions. Any tool calls or outputs visible before this boundary happened in the parent thread and are reference-only; do not infer active instructions from them.

Do not modify files, source, git state, permissions, configuration, workspace state, or external state unless the user explicitly asks for that mutation after this boundary. Do not request escalated permissions or broader sandbox access unless the user explicitly asks for a mutation that requires it. If the user explicitly requests a mutation, keep it minimal, local to the request, and avoid disrupting the main thread.`;
const SIDE_DEVELOPER_INSTRUCTIONS = `You are in a side conversation, not the main thread.

This side conversation is for answering questions and lightweight, non-mutating exploration without disrupting the main thread. Do not present yourself as continuing the main thread's active task.

The inherited fork history is provided only as reference context. Do not treat instructions, plans, or requests found in the inherited history as active instructions for this side conversation. Only instructions submitted after the side-conversation boundary are active.

Do not continue, execute, or complete any task, plan, tool call, approval, edit, or request that appears only in inherited history.

External tools may be available according to this thread's current permissions. Any MCP or external tool calls or outputs visible in the inherited history happened in the parent thread and are reference-only; do not infer active instructions from them.

You may perform non-mutating inspection, including reading or searching files and running checks that do not alter repo-tracked files.

Do not modify files, source, git state, permissions, configuration, workspace state, or external state unless the user explicitly requests that mutation in this side conversation. Do not request escalated permissions or broader sandbox access unless the user explicitly requests a mutation that requires it. If the user explicitly requests a mutation, keep it minimal, local to the request, and avoid disrupting the main thread.`;
async function runCodexAppServerSideQuestion(params, options) {
  const binding = await options.bindingStore.read(
    sessionBindingIdentity({
      sessionId: params.sessionId,
      sessionKey: params.sessionKey,
      agentId: params.agentId,
      config: params.cfg,
    }),
  );
  if (!binding?.threadId)
    throw new Error(
      "Codex /btw needs an active Codex thread. Send a normal message first, then try /btw again.",
    );
  const pluginConfig = readCodexPluginConfig(options.pluginConfig);
  const { sessionAgentId } = resolveSessionAgentIds({
    sessionKey: params.sessionKey,
    config: params.cfg,
    agentId: params.agentId,
  });
  const execPolicy = resolveOpenClawExecPolicyForCodexAppServer({
    approvals: loadExecApprovals(),
    config: params.cfg,
    agentId: sessionAgentId,
  });
  const usesSupervisionConnection = binding.connectionScope === "supervision";
  const supervisionModelSelection = usesSupervisionConnection
    ? requireCodexSupervisionModelSelection(binding)
    : void 0;
  const preparedRuntimeAuth = params.preparedRuntimeAuth;
  const {
    authProfileId,
    nativeAuthProfile: preparedNativeAuthProfile,
    preparedAuth: startupPreparedAuth,
  } = usesSupervisionConnection
    ? {
        authProfileId: void 0,
        nativeAuthProfile: true,
        preparedAuth: void 0,
      }
    : await resolveCodexAppServerPreparedAuthHandoff({
        authRequirement: preparedRuntimeAuth.plan.modelRoute?.authRequirement,
        resolvedApiKey: preparedRuntimeAuth.resolvedApiKey,
        authProfileId: preparedRuntimeAuth.plan.forwardedAuthProfileId,
        authProfileStore: preparedRuntimeAuth.authProfileStore,
        agentDir: params.agentDir,
        config: params.cfg,
        subscriptionProfileRequiredError:
          "Prepared Codex subscription route requires a scoped native OAuth or token profile.",
        subscriptionProfileUnusableError: `Prepared Codex auth profile "${preparedRuntimeAuth.plan.forwardedAuthProfileId}" is unusable.`,
      });
  const modelProvider = supervisionModelSelection
    ? supervisionModelSelection.modelProvider
    : (resolveCodexAppServerModelProvider({
        provider: params.provider,
        authProfileId,
        authProfileStore: preparedRuntimeAuth.authProfileStore,
        agentDir: params.agentDir,
        config: params.cfg,
      }) ??
      resolveCodexBindingModelProviderFallback({
        provider: params.provider,
        currentModel: params.model,
        bindingModel: binding.model,
        bindingModelProvider: binding.modelProvider,
      }));
  const modelSelection = resolveCodexAppServerRequestModelSelection({
    model: supervisionModelSelection?.model ?? params.model,
    modelProvider,
    authProfileId,
    authProfileStore: preparedRuntimeAuth.authProfileStore,
    agentDir: params.agentDir,
    config: params.cfg,
  });
  const reviewerPolicyContext = resolveCodexModelBackedReviewerPolicyContext({
    provider: usesSupervisionConnection ? "codex" : params.provider,
    model: supervisionModelSelection?.model ?? params.model,
    bindingModelProvider: binding.modelProvider,
    bindingModel: binding.model,
    nativeAuthProfile: usesSupervisionConnection || preparedNativeAuthProfile,
  });
  const connection = resolveCodexBindingAppServerConnection({
    binding,
    authProfileId,
    pluginConfig,
    execPolicy,
    modelProvider: reviewerPolicyContext.modelProvider,
    model: reviewerPolicyContext.model,
    config: params.cfg,
    agentDir: params.agentDir,
  });
  const appServer = connection.appServer;
  const cwd = binding.cwd || params.workspaceDir || process.cwd();
  const runId = params.opts?.runId ?? randomUUID();
  const effectiveParams = supervisionModelSelection
    ? {
        ...params,
        provider: supervisionModelSelection.modelProvider,
        model: supervisionModelSelection.model,
        runtimeModel: {
          id: supervisionModelSelection.model,
          name: supervisionModelSelection.model,
          provider: supervisionModelSelection.modelProvider,
          api: "openai-chatgpt-responses",
          reasoning: true,
          input: ["text", "image"],
          cost: {
            input: 0,
            output: 0,
            cacheRead: 0,
            cacheWrite: 0,
          },
        },
      }
    : params;
  const sideRunParams = buildSideRunAttemptParams(effectiveParams, {
    cwd,
    authProfileId,
    runId,
  });
  const nativeExecutionBlock = resolveCodexNativeExecutionBlock({
    config: sideRunParams.config,
    sessionKey: sideRunParams.sandboxSessionKey?.trim() || sideRunParams.sessionKey,
    sessionId: sideRunParams.sessionId,
    surface: "/btw side-question mode",
  });
  if (nativeExecutionBlock) throw new Error(nativeExecutionBlock);
  const nativeToolSurfaceEnabled = shouldEnableCodexAppServerNativeToolSurface(sideRunParams);
  if (!nativeToolSurfaceEnabled)
    throw new Error(
      "Codex-native /btw side-question mode is unavailable because the effective tool policy restricts Codex native tools for this session.",
    );
  const clientOptions = {
    startOptions: appServer.start,
    timeoutMs: appServer.requestTimeoutMs,
    ...(startupPreparedAuth
      ? { preparedAuth: startupPreparedAuth }
      : { authProfileId: connection.clientAuthProfileId }),
    agentDir: params.agentDir,
    config: params.cfg,
    ...(params.opts?.abortSignal ? { abandonSignal: params.opts.abortSignal } : {}),
  };
  let client = await getLeasedSharedCodexAppServerClient(clientOptions);
  const clientLease = { client };
  const collector = new CodexSideQuestionCollector(params, () => readRecentCodexRateLimits(client));
  const runAbortController = new AbortController();
  let nativeToolLifecycleProjector;
  const pendingNativeToolNotifications = [];
  const pendingNativePreToolUseFailures = [];
  let nativePreToolUseFailureFallbackActive = false;
  let nativeToolRunWasAbortedBeforeCleanup;
  let nativePreToolUseFailureFallbackTerminalReason;
  const emitNativePreToolUseFailure = (failure) => {
    emitCodexNativePreToolUseFailureDiagnostic({
      agentId: sessionAgentId,
      sessionId: params.sessionId,
      sessionKey: params.sessionKey,
      runId: sideRunParams.runId,
      signal: runAbortController.signal,
      failure,
      ...(nativePreToolUseFailureFallbackActive
        ? { terminalReason: nativePreToolUseFailureFallbackTerminalReason ?? failure.disposition }
        : {}),
    });
  };
  const flushPendingNativePreToolUseFailures = () => {
    for (const failure of pendingNativePreToolUseFailures.splice(0))
      emitNativePreToolUseFailure(failure);
  };
  const activateNativePreToolUseFailureFallback = () => {
    if (!nativePreToolUseFailureFallbackActive) {
      nativePreToolUseFailureFallbackTerminalReason = nativeToolRunWasAbortedBeforeCleanup
        ? resolveCodexToolAbortTerminalReason(runAbortController.signal)
        : void 0;
      nativePreToolUseFailureFallbackActive = true;
    }
    flushPendingNativePreToolUseFailures();
  };
  const handleNotification = (notification) => {
    collector.handleNotification(notification);
    if (
      notification.method !== "item/started" &&
      notification.method !== "item/completed" &&
      notification.method !== "rawResponseItem/completed" &&
      notification.method !== "turn/completed"
    )
      return;
    if (!nativeToolLifecycleProjector) {
      pendingNativeToolNotifications.push(notification);
      return;
    }
    nativeToolLifecycleProjector.handleNotification(notification);
  };
  let removeNotificationHandler = client.addNotificationHandler(handleNotification);
  const abortFromUpstream = () =>
    runAbortController.abort(params.opts?.abortSignal?.reason ?? "codex_side_question_abort");
  if (params.opts?.abortSignal?.aborted) abortFromUpstream();
  else params.opts?.abortSignal?.addEventListener("abort", abortFromUpstream, { once: true });
  let childThreadId;
  let turnId;
  let removeRequestHandler;
  let nativeHookRelay;
  try {
    const modelScopedAppServer = resolveCodexAppServerForModelProvider({
      appServer,
      provider: reviewerPolicyContext.modelProvider,
      model: reviewerPolicyContext.model,
      config: params.cfg,
      env: process.env,
      agentDir: params.agentDir,
    });
    const useModelScopedPolicy = !canUseCodexModelBackedApprovalsReviewerForModel({
      modelProvider: reviewerPolicyContext.modelProvider,
      model: reviewerPolicyContext.model,
      config: params.cfg,
      env: process.env,
      agentDir: params.agentDir,
    });
    const approvalPolicy = useModelScopedPolicy
      ? modelScopedAppServer.approvalPolicy
      : (binding.approvalPolicy ?? modelScopedAppServer.approvalPolicy);
    const sandbox = useModelScopedPolicy
      ? modelScopedAppServer.sandbox
      : (binding.sandbox ?? modelScopedAppServer.sandbox);
    const { toolBridge, webSearchPlan } = await createCodexSideToolBridge({
      params: effectiveParams,
      cwd,
      pluginConfig,
      sessionAgentId,
      nativeToolSurfaceEnabled,
      nativeProviderWebSearchSupport:
        resolveCodexWebSearchPlan({
          config: params.cfg,
          nativeToolSurfaceEnabled,
        }).kind === "native-hosted"
          ? await resolveCodexProviderWebSearchSupportForClient({
              client,
              timeoutMs: appServer.requestTimeoutMs,
              modelProviderOverride: modelSelection.modelProvider,
              signal: runAbortController.signal,
            })
          : "unsupported",
      runId,
      signal: runAbortController.signal,
    });
    ensureCodexAppServerClientRuntime(client, {
      agentDir: params.agentDir,
      authProfileId:
        startupPreparedAuth?.kind === "api-key" ? void 0 : connection.requestAuthProfileId,
      ...(!usesSupervisionConnection
        ? {
            authProfileStore: preparedRuntimeAuth.authProfileStore,
            authMode: startupPreparedAuth?.kind === "api-key" ? "prepared-api-key" : "profile",
          }
        : {}),
      config: params.cfg,
    });
    const registerRequestHandler = (targetClient) =>
      targetClient.addRequestHandler(async (request) => {
        if (!childThreadId || !turnId) return;
        if (request.method === "mcpServer/elicitation/request")
          return handleCodexAppServerElicitationRequest({
            requestParams: request.params,
            paramsForRun: sideRunParams,
            threadId: childThreadId,
            turnId,
            pluginAppPolicyContext: binding.pluginAppPolicyContext,
            signal: runAbortController.signal,
          });
        if (request.method === "item/tool/requestUserInput")
          return isSideUserInputRequest(request.params, childThreadId, turnId)
            ? emptySideUserInputResponse()
            : void 0;
        if (isCodexAppServerApprovalRequest(request.method))
          return handleCodexAppServerApprovalRequest({
            method: request.method,
            requestParams: request.params,
            paramsForRun: sideRunParams,
            threadId: childThreadId,
            turnId,
            nativeHookRelay,
            autoApprove: shouldAutoApproveCodexAppServerApprovals({
              approvalPolicy,
              networkProxy: modelScopedAppServer.networkProxy,
              sandbox,
            }),
            signal: runAbortController.signal,
            onNativeToolFailureDisposition: (itemId, disposition) =>
              nativeToolLifecycleProjector?.recordApprovalFailureDisposition(itemId, disposition),
          });
        if (request.method !== "item/tool/call") return;
        const call = readCodexDynamicToolCallParams(request.params);
        if (!call || call.threadId !== childThreadId || call.turnId !== turnId) return;
        const timeoutMs = resolveDynamicToolCallTimeoutMs({
          call,
          config: params.cfg,
        });
        const toolStartedAt = Date.now();
        const diagnosticContext = {
          call,
          agentId: sessionAgentId,
          runId: sideRunParams.runId,
          sessionId: params.sessionId,
          sessionKey: params.sessionKey,
        };
        emitDynamicToolStartedDiagnostic(diagnosticContext);
        try {
          const response = await handleDynamicToolCallWithTimeout({
            call,
            toolBridge,
            signal: runAbortController.signal,
            timeoutMs,
          });
          emitDynamicToolTerminalDiagnostic({
            ...diagnosticContext,
            response,
            durationMs: Math.max(0, Date.now() - toolStartedAt),
          });
          return {
            contentItems: response.contentItems,
            success: response.success,
          };
        } catch (error) {
          emitDynamicToolErrorDiagnostic({
            ...diagnosticContext,
            durationMs: Math.max(0, Date.now() - toolStartedAt),
            terminalReason: runAbortController.signal.aborted
              ? resolveCodexToolAbortTerminalReason(runAbortController.signal)
              : "failed",
          });
          throw error;
        }
      });
    removeRequestHandler = registerRequestHandler(client);
    const rebindClientHandlers = (nextClient) => {
      removeRequestHandler?.();
      removeNotificationHandler();
      client = nextClient;
      ensureCodexAppServerClientRuntime(client, {
        agentDir: params.agentDir,
        authProfileId: connection.requestAuthProfileId,
        config: params.cfg,
      });
      removeNotificationHandler = client.addNotificationHandler(handleNotification);
      removeRequestHandler = registerRequestHandler(client);
    };
    const serviceTier = binding.serviceTier ?? appServer.serviceTier;
    const nativeHookRelayEvents = resolveCodexSideNativeHookRelayEvents({
      configuredEvents: options.nativeHookRelay?.events,
      approvalPolicy,
    });
    nativeHookRelay = options.nativeHookRelay
      ? registerCodexSideNativeHookRelay({
          options: options.nativeHookRelay,
          events: nativeHookRelayEvents,
          agentId: sessionAgentId,
          sessionId: params.sessionId,
          sessionKey: params.sessionKey,
          config: params.cfg,
          runId: sideRunParams.runId,
          channelId: buildAgentHookContextChannelFields({
            sessionKey: params.sessionKey,
            messageChannel: params.messageChannel,
            messageProvider: params.messageProvider,
            currentChannelId: params.currentChannelId,
          }).channelId,
          requestTimeoutMs: appServer.requestTimeoutMs,
          completionTimeoutMs: Math.max(
            appServer.turnCompletionIdleTimeoutMs,
            SIDE_QUESTION_COMPLETION_TIMEOUT_MS,
          ),
          signal: runAbortController.signal,
          onPreToolUseFailure: (failure) => {
            if (nativePreToolUseFailureFallbackActive) emitNativePreToolUseFailure(failure);
            else if (nativeToolLifecycleProjector)
              nativeToolLifecycleProjector.recordPreToolUseFailure(
                failure,
                nativeToolRunWasAbortedBeforeCleanup,
              );
            else pendingNativePreToolUseFailures.push(failure);
          },
        })
      : void 0;
    const nativeHookRelayConfig = nativeHookRelay
      ? buildCodexNativeHookRelayConfig({
          relay: nativeHookRelay,
          events: nativeHookRelayEvents,
          hookTimeoutSec: options.nativeHookRelay?.hookTimeoutSec,
          clearOmittedEvents: true,
        })
      : options.nativeHookRelay?.enabled === false
        ? buildCodexNativeHookRelayDisabledConfig()
        : void 0;
    const runtimeThreadConfig = buildCodexRuntimeThreadConfig(webSearchPlan.threadConfig, {
      nativeCodeModeEnabled: nativeToolSurfaceEnabled,
      nativeCodeModeOnlyEnabled: appServer.codeModeOnly,
    });
    const threadConfig =
      mergeCodexThreadConfigs(
        nativeHookRelayConfig,
        runtimeThreadConfig,
        binding.pluginAppPolicyContext
          ? buildCodexPluginAppsConfigPatchFromPolicyContext(binding.pluginAppPolicyContext)
          : void 0,
        modelScopedAppServer.networkProxy?.configPatch,
      ) ?? runtimeThreadConfig;
    const forkResponse = assertCodexThreadForkResponse(
      await withLeasedCodexAppServerClientStartSelectionRetry({
        lease: clientLease,
        options: clientOptions,
        signal: params.opts?.abortSignal,
        run: async (forkClient, requestOptions) =>
          await forkCodexSideThread(
            forkClient,
            {
              threadId: binding.threadId,
              model: modelSelection.model,
              ...(modelSelection.modelProvider
                ? { modelProvider: modelSelection.modelProvider }
                : {}),
              cwd,
              approvalPolicy,
              approvalsReviewer: modelScopedAppServer.approvalsReviewer,
              ...(modelScopedAppServer.networkProxy ? {} : { sandbox }),
              ...(serviceTier ? { serviceTier } : {}),
              config: threadConfig,
              developerInstructions: SIDE_DEVELOPER_INSTRUCTIONS,
              ephemeral: true,
              threadSource: "user",
            },
            requestOptions,
          ),
        onClientChange: rebindClientHandlers,
      }),
    );
    childThreadId = forkResponse.thread.id;
    if (
      supervisionModelSelection &&
      (forkResponse.model !== supervisionModelSelection.model ||
        forkResponse.modelProvider !== supervisionModelSelection.modelProvider)
    )
      throw new Error(
        "Codex supervised side thread did not preserve its native model and provider",
      );
    await client.request(
      "thread/inject_items",
      {
        threadId: childThreadId,
        items: [sideBoundaryPromptItem()],
      },
      {
        timeoutMs: appServer.requestTimeoutMs,
        signal: params.opts?.abortSignal,
      },
    );
    const effort = usesSupervisionConnection
      ? void 0
      : resolveReasoningEffort(
          params.resolvedThinkLevel ?? "off",
          modelSelection.model,
          readCodexSupportedReasoningEfforts(params.runtimeModel?.compat),
        );
    turnId = assertCodexTurnStartResponse(
      await client.request(
        "turn/start",
        {
          threadId: childThreadId,
          input: [
            {
              type: "text",
              text: params.question.trim(),
              text_elements: [],
            },
          ],
          cwd,
          model: modelSelection.model,
          ...(usesSupervisionConnection ? {} : { personality: CODEX_NATIVE_PERSONALITY_NONE }),
          ...(serviceTier ? { serviceTier } : {}),
          ...(usesSupervisionConnection
            ? {}
            : {
                effort,
                collaborationMode: {
                  mode: "default",
                  settings: {
                    model: modelSelection.model,
                    reasoning_effort: effort,
                    developer_instructions: null,
                  },
                },
              }),
        },
        {
          timeoutMs: appServer.requestTimeoutMs,
          signal: params.opts?.abortSignal,
        },
      ),
    ).turn.id;
    collector.setTurn(childThreadId, turnId);
    nativeToolLifecycleProjector = new CodexNativeToolLifecycleProjector(
      {
        ...sideRunParams,
        agentId: sessionAgentId,
      },
      childThreadId,
      turnId,
      { runAbortSignal: runAbortController.signal },
    );
    for (const failure of pendingNativePreToolUseFailures)
      nativeToolLifecycleProjector.recordPreToolUseFailure(failure);
    pendingNativePreToolUseFailures.length = 0;
    for (const notification of pendingNativeToolNotifications)
      nativeToolLifecycleProjector.handleNotification(notification);
    pendingNativeToolNotifications.length = 0;
    let text;
    try {
      text = await collector.wait({
        signal: params.opts?.abortSignal,
        timeoutMs: Math.max(
          appServer.turnCompletionIdleTimeoutMs,
          SIDE_QUESTION_COMPLETION_TIMEOUT_MS,
        ),
      });
    } catch (error) {
      if (error instanceof CodexSideQuestionTimeoutError && !runAbortController.signal.aborted)
        runAbortController.abort(error);
      throw error;
    }
    const trimmed = text.trim();
    if (!trimmed) throw new Error("Codex /btw completed without an answer.");
    return { text: trimmed };
  } finally {
    try {
      const runWasAbortedBeforeCleanup = runAbortController.signal.aborted;
      nativeToolRunWasAbortedBeforeCleanup = runWasAbortedBeforeCleanup;
      params.opts?.abortSignal?.removeEventListener("abort", abortFromUpstream);
      removeRequestHandler?.();
      if (!runAbortController.signal.aborted)
        runAbortController.abort("codex_side_question_finished");
      try {
        await cleanupCodexSideThread(client, {
          threadId: childThreadId,
          turnId,
          interrupt: !collector.completed,
          timeoutMs: appServer.requestTimeoutMs,
        });
      } finally {
        removeNotificationHandler();
        try {
          nativeToolLifecycleProjector?.finalizeActive(runWasAbortedBeforeCleanup);
        } finally {
          activateNativePreToolUseFailureFallback();
        }
      }
    } finally {
      flushPendingNativePreToolUseFailures();
      releaseCodexAppServerClientLease(clientLease);
      nativeHookRelay?.unregister();
    }
  }
}
function resolveCodexSideNativeHookRelayEvents(params) {
  if (params.configuredEvents?.length) return params.configuredEvents;
  return params.approvalPolicy === "never"
    ? CODEX_NATIVE_HOOK_RELAY_EVENTS
    : CODEX_SIDE_NATIVE_HOOK_RELAY_EVENTS_WITH_APP_SERVER_APPROVALS;
}
function registerCodexSideNativeHookRelay(params) {
  if (params.options.enabled === false) return;
  return registerNativeHookRelay({
    provider: "codex",
    ...(params.agentId ? { agentId: params.agentId } : {}),
    sessionId: params.sessionId,
    ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
    ...(params.config ? { config: params.config } : {}),
    runId: params.runId,
    ...(params.channelId ? { channelId: params.channelId } : {}),
    allowedEvents: params.events,
    ttlMs: resolveCodexSideNativeHookRelayTtlMs({
      explicitTtlMs: params.options.ttlMs,
      requestTimeoutMs: params.requestTimeoutMs,
      completionTimeoutMs: params.completionTimeoutMs,
    }),
    signal: params.signal,
    onPreToolUseFailure: params.onPreToolUseFailure,
    command: { timeoutMs: params.options.gatewayTimeoutMs },
  });
}
function resolveCodexSideNativeHookRelayTtlMs(params) {
  if (params.explicitTtlMs !== void 0) return params.explicitTtlMs;
  const relayBudgetMs =
    params.requestTimeoutMs * CODEX_SIDE_NATIVE_HOOK_RELAY_STARTUP_REQUEST_COUNT +
    params.completionTimeoutMs +
    CODEX_SIDE_NATIVE_HOOK_RELAY_TTL_GRACE_MS;
  return Math.max(CODEX_SIDE_NATIVE_HOOK_RELAY_MIN_TTL_MS, Math.floor(relayBudgetMs));
}
function buildSideRunAttemptParams(params, options) {
  return {
    params,
    config: params.cfg,
    agentDir: params.agentDir,
    provider: params.provider,
    modelId: params.model,
    model: params.runtimeModel ?? {
      id: params.model,
      provider: params.provider,
    },
    sessionId: params.sessionId,
    sessionFile: params.sessionFile,
    sessionKey: params.sessionKey,
    ...(params.sandboxSessionKey ? { sandboxSessionKey: params.sandboxSessionKey } : {}),
    agentId: params.agentId,
    ...(params.messageChannel ? { messageChannel: params.messageChannel } : {}),
    ...(params.messageProvider ? { messageProvider: params.messageProvider } : {}),
    ...(params.chatType ? { chatType: params.chatType } : {}),
    ...(params.agentAccountId ? { agentAccountId: params.agentAccountId } : {}),
    ...(params.messageTo ? { messageTo: params.messageTo } : {}),
    ...(params.messageThreadId !== void 0 ? { messageThreadId: params.messageThreadId } : {}),
    ...(params.chatId ? { chatId: params.chatId } : {}),
    ...(params.messageActionTurnCapability
      ? { messageActionTurnCapability: params.messageActionTurnCapability }
      : {}),
    ...(params.groupId !== void 0 ? { groupId: params.groupId } : {}),
    ...(params.groupChannel !== void 0 ? { groupChannel: params.groupChannel } : {}),
    ...(params.groupSpace !== void 0 ? { groupSpace: params.groupSpace } : {}),
    ...(params.memberRoleIds ? { memberRoleIds: params.memberRoleIds } : {}),
    ...(params.spawnedBy !== void 0 ? { spawnedBy: params.spawnedBy } : {}),
    ...(params.senderId !== void 0 ? { senderId: params.senderId } : {}),
    ...(params.senderName !== void 0 ? { senderName: params.senderName } : {}),
    ...(params.senderUsername !== void 0 ? { senderUsername: params.senderUsername } : {}),
    ...(params.senderE164 !== void 0 ? { senderE164: params.senderE164 } : {}),
    ...(params.senderIsOwner !== void 0 ? { senderIsOwner: params.senderIsOwner } : {}),
    ...(params.currentChannelId ? { currentChannelId: params.currentChannelId } : {}),
    ...(params.toolsAllow ? { toolsAllow: params.toolsAllow } : {}),
    workspaceDir: options.cwd,
    authProfileId: options.authProfileId,
    authProfileIdSource: options.authProfileId
      ? params.preparedRuntimeAuth.plan.forwardedAuthProfileSource
      : void 0,
    thinkLevel: params.resolvedThinkLevel ?? "off",
    resolvedReasoningLevel: params.resolvedReasoningLevel,
    authStorage: params.preparedRuntimeAuth.authStorage,
    authProfileStore: params.preparedRuntimeAuth.authProfileStore,
    modelRegistry: params.preparedRuntimeAuth.modelRegistry,
    ...(params.preparedRuntimeAuth.resolvedApiKey
      ? { resolvedApiKey: params.preparedRuntimeAuth.resolvedApiKey }
      : {}),
    runId: options.runId,
    abortSignal: params.opts?.abortSignal,
    onAgentEvent: (event) => {
      if (event.stream === "approval") params.opts?.onApprovalEvent?.(event.data);
    },
    onBlockReply: params.opts?.onBlockReply,
    onPartialReply: params.opts?.onPartialReply,
  };
}
async function createCodexSideToolBridge(input) {
  const runtimeModel = input.params.runtimeModel ?? {
    id: input.params.model,
    provider: input.params.provider,
  };
  const messageToolProvider = resolveCodexMessageToolProvider(input.params);
  let tools = [];
  if (supportsModelTools(runtimeModel)) {
    const createOpenClawCodingTools = (await import("./plugin-sdk/agent-harness.js"))
      .createOpenClawCodingTools;
    const sandboxSessionKey =
      input.params.sandboxSessionKey?.trim() ||
      input.params.sessionKey?.trim() ||
      input.params.sessionId ||
      input.sessionAgentId;
    const sandbox = await resolveSandboxContext({
      config: input.params.cfg,
      sessionKey: sandboxSessionKey,
      workspaceDir: input.cwd,
    });
    tools = filterToolsForVisionInputs(
      filterCodexDynamicTools(
        createOpenClawCodingTools({
          agentId: input.sessionAgentId,
          sessionKey: sandboxSessionKey,
          runSessionKey:
            input.params.sessionKey && input.params.sessionKey !== sandboxSessionKey
              ? input.params.sessionKey
              : void 0,
          sessionId: input.params.sessionId,
          runId: input.runId,
          agentDir:
            input.params.agentDir ?? resolveAgentDir(input.params.cfg ?? {}, input.sessionAgentId),
          workspaceDir: input.cwd,
          spawnWorkspaceDir: resolveAttemptSpawnWorkspaceDir({
            sandbox,
            resolvedWorkspace: input.params.workspaceDir ?? input.cwd,
          }),
          config: input.params.cfg,
          abortSignal: input.signal,
          modelProvider: runtimeModel.provider,
          modelId: input.params.model,
          modelCompat:
            runtimeModel.compat && typeof runtimeModel.compat === "object"
              ? runtimeModel.compat
              : void 0,
          modelApi: runtimeModel.api,
          modelContextWindowTokens: runtimeModel.contextWindow,
          modelAuthMode: resolveModelAuthMode(runtimeModel.provider, input.params.cfg, void 0, {
            workspaceDir: input.cwd,
          }),
          suppressManagedWebSearch: false,
          ...(input.params.messageProvider || input.params.messageChannel
            ? {
                messageProvider: messageToolProvider,
                toolPolicyMessageProvider:
                  input.params.messageProvider ?? input.params.messageChannel,
              }
            : {}),
          ...(input.params.chatType ? { chatType: input.params.chatType } : {}),
          ...(input.params.agentAccountId ? { agentAccountId: input.params.agentAccountId } : {}),
          ...(input.params.messageTo ? { messageTo: input.params.messageTo } : {}),
          ...(input.params.messageThreadId !== void 0
            ? { messageThreadId: input.params.messageThreadId }
            : {}),
          ...(input.params.chatId ? { nativeChannelId: input.params.chatId } : {}),
          ...(input.params.messageActionTurnCapability
            ? { messageActionTurnCapability: input.params.messageActionTurnCapability }
            : {}),
          ...(input.params.groupId !== void 0 ? { groupId: input.params.groupId } : {}),
          ...(input.params.groupChannel !== void 0
            ? { groupChannel: input.params.groupChannel }
            : {}),
          ...(input.params.groupSpace !== void 0 ? { groupSpace: input.params.groupSpace } : {}),
          ...(input.params.memberRoleIds ? { memberRoleIds: input.params.memberRoleIds } : {}),
          ...(input.params.spawnedBy !== void 0 ? { spawnedBy: input.params.spawnedBy } : {}),
          ...(input.params.senderId !== void 0 ? { senderId: input.params.senderId } : {}),
          ...(input.params.senderName !== void 0 ? { senderName: input.params.senderName } : {}),
          ...(input.params.senderUsername !== void 0
            ? { senderUsername: input.params.senderUsername }
            : {}),
          ...(input.params.senderE164 !== void 0 ? { senderE164: input.params.senderE164 } : {}),
          ...(input.params.senderIsOwner !== void 0
            ? { senderIsOwner: input.params.senderIsOwner }
            : {}),
          ...(input.params.currentChannelId
            ? { currentChannelId: input.params.currentChannelId }
            : {}),
          hookChannelId: buildAgentHookContextChannelFields({
            sessionKey: input.params.sessionKey,
            messageChannel: input.params.messageChannel,
            messageProvider: input.params.messageProvider,
            currentChannelId: input.params.currentChannelId,
          }).channelId,
          sandbox,
          emitBeforeToolCallDiagnostics: false,
          modelHasVision: runtimeModel.input?.includes("image") ?? false,
          requireExplicitMessageTarget: true,
        }),
        input.pluginConfig,
      ),
      {
        modelHasVision: runtimeModel.input?.includes("image") ?? false,
        hasInboundImages: false,
      },
    );
  }
  const requestedWebSearchPlan = resolveCodexWebSearchPlan({
    config: input.params.cfg,
    nativeToolSurfaceEnabled: input.nativeToolSurfaceEnabled,
    nativeProviderWebSearchSupport: input.nativeProviderWebSearchSupport,
    webSearchAllowed: tools.some((tool) => tool.name === "web_search"),
  });
  const webSearchPlan =
    requestedWebSearchPlan.kind === "managed"
      ? resolveCodexWebSearchPlan({
          config: input.params.cfg,
          webSearchAllowed: false,
        })
      : requestedWebSearchPlan;
  const exposedTools = tools.filter(
    (tool) => tool.name !== "web_search" && tool.name !== "computer",
  );
  const hookChannelFields = buildAgentHookContextChannelFields({
    sessionKey: input.params.sessionKey,
    messageChannel: input.params.messageChannel,
    messageProvider: input.params.messageProvider,
    currentChannelId: input.params.currentChannelId,
  });
  return {
    toolBridge: createCodexDynamicToolBridge({
      tools: exposedTools,
      signal: input.signal,
      loading: resolveCodexDynamicToolsLoading(input.pluginConfig),
      hookContext: {
        agentId: input.sessionAgentId,
        config: input.params.cfg,
        sessionId: input.params.sessionId,
        sessionKey: input.params.sessionKey,
        runId: input.runId,
        currentChannelProvider: messageToolProvider,
        ...hookChannelFields,
      },
    }),
    webSearchPlan,
  };
}
function emptySideUserInputResponse() {
  return { answers: {} };
}
function isSideUserInputRequest(value, threadId, turnId) {
  return isJsonObject(value) && value.threadId === threadId && value.turnId === turnId;
}
async function forkCodexSideThread(client, params, options) {
  try {
    return await client.request("thread/fork", params, options);
  } catch (error) {
    if (isMissingCodexParentThreadError(error))
      throw new Error(
        "Codex /btw needs an active Codex thread. Send a normal message first, then try /btw again.",
        { cause: error },
      );
    throw error;
  }
}
function isMissingCodexParentThreadError(error) {
  const message = formatErrorMessage(error);
  return (
    message.includes("no rollout found for thread id") ||
    message.includes("includeTurns is unavailable before first user message")
  );
}
function sideBoundaryPromptItem() {
  return {
    type: "message",
    role: "user",
    content: [
      {
        type: "input_text",
        text: SIDE_BOUNDARY_PROMPT,
      },
    ],
  };
}
async function cleanupCodexSideThread(client, params) {
  if (!params.threadId) return;
  if (params.interrupt && params.turnId)
    try {
      await client.request(
        "turn/interrupt",
        {
          threadId: params.threadId,
          turnId: params.turnId,
        },
        { timeoutMs: params.timeoutMs },
      );
    } catch (error) {
      log.debug("codex /btw side thread interrupt cleanup failed", { error });
    }
  try {
    await client.request(
      "thread/unsubscribe",
      { threadId: params.threadId },
      { timeoutMs: params.timeoutMs },
    );
  } catch (error) {
    log.debug("codex /btw side thread unsubscribe cleanup failed", { error });
  }
}
var CodexSideQuestionCollector = class {
  constructor(params, readRecentRateLimits) {
    this.params = params;
    this.readRecentRateLimits = readRecentRateLimits;
    this.pendingNotifications = [];
    this.assistantStarted = false;
    this.assistantText = "";
    this.completed = false;
  }
  setTurn(threadId, turnId) {
    this.threadId = threadId;
    this.turnId = turnId;
    const pending = this.pendingNotifications;
    this.pendingNotifications = [];
    for (const notification of pending) this.handleNotification(notification);
  }
  handleNotification(notification) {
    const params = isJsonObject(notification.params) ? notification.params : void 0;
    if (!params) return;
    if (!this.threadId || !this.turnId) {
      this.pendingNotifications.push(notification);
      return;
    }
    if (!isNotificationForTurn(params, this.threadId, this.turnId)) return;
    if (notification.method === "item/agentMessage/delta") {
      this.appendAssistantDelta(params);
      return;
    }
    if (notification.method === "turn/completed") {
      this.completeFromTurn(params);
      return;
    }
    if (notification.method === "error" && params.willRetry !== true)
      this.reject(formatCodexErrorMessage(params, this.readRecentRateLimits()));
  }
  wait(options) {
    if (this.terminalError) return Promise.reject(this.terminalError);
    if (this.completed) return Promise.resolve(this.finalText ?? this.assistantText);
    if (options.signal?.aborted)
      return Promise.reject(/* @__PURE__ */ new Error("Codex /btw was aborted."));
    return new Promise((resolve, reject) => {
      let timeout;
      const cleanup = () => {
        if (timeout) {
          clearTimeout(timeout);
          timeout = void 0;
        }
        options.signal?.removeEventListener("abort", abort);
      };
      const abort = () => {
        cleanup();
        this.settle = void 0;
        reject(/* @__PURE__ */ new Error("Codex /btw was aborted."));
      };
      timeout = setTimeout(
        () => {
          cleanup();
          this.settle = void 0;
          reject(
            new CodexSideQuestionTimeoutError(
              "Codex /btw timed out waiting for the side thread to finish.",
            ),
          );
        },
        Math.max(100, options.timeoutMs),
      );
      timeout.unref?.();
      options.signal?.addEventListener("abort", abort, { once: true });
      this.settle = {
        resolve: (text) => {
          cleanup();
          resolve(text);
        },
        reject: (error) => {
          cleanup();
          reject(error);
        },
      };
    });
  }
  async appendAssistantDelta(params) {
    const delta = readString(params, "delta") ?? "";
    if (!delta) return;
    if (!this.assistantStarted) {
      this.assistantStarted = true;
      await this.params.opts?.onAssistantMessageStart?.();
    }
    this.assistantText += delta;
  }
  completeFromTurn(params) {
    const turn = readCodexTurn(params.turn);
    if (!turn || turn.id !== this.turnId) return;
    this.completed = true;
    if (turn.status === "failed") {
      this.reject(
        formatCodexUsageLimitErrorMessage({
          message: turn.error?.message,
          codexErrorInfo: turn.error?.codexErrorInfo,
          rateLimits: this.readRecentRateLimits(),
        }) ??
          turn.error?.message ??
          "Codex /btw side thread failed.",
      );
      return;
    }
    if (turn.status === "interrupted") {
      this.reject("Codex /btw side thread was interrupted.");
      return;
    }
    const finalText = collectAssistantText(turn) || this.assistantText;
    this.resolve(finalText);
  }
  resolve(text) {
    this.finalText = text;
    const settle = this.settle;
    this.settle = void 0;
    settle?.resolve(text);
  }
  reject(error) {
    this.terminalError = error instanceof Error ? error : new Error(error);
    const settle = this.settle;
    this.settle = void 0;
    settle?.reject(this.terminalError);
  }
};
function collectAssistantText(turn) {
  return (
    (turn.items ?? [])
      .filter((item) => item.type === "agentMessage" && typeof item.text === "string")
      .map((item) => item.text.trim())
      .filter(Boolean)
      .at(-1) ?? ""
  );
}
function isNotificationForTurn(params, threadId, turnId) {
  return (
    readCodexNotificationThreadId(params) === threadId && readNotificationTurnId(params) === turnId
  );
}
function readNotificationTurnId(record) {
  return readCodexNotificationTurnId(record);
}
function readString(record, key) {
  const value = record[key];
  return typeof value === "string" ? value : void 0;
}
function formatCodexErrorMessage(params, rateLimits) {
  const error = isJsonObject(params.error) ? params.error : void 0;
  const message =
    formatCodexUsageLimitErrorMessage({
      message: error ? readString(error, "message") : void 0,
      codexErrorInfo: error?.codexErrorInfo,
      rateLimits,
    }) ??
    (error ? (readString(error, "message") ?? readString(error, "error")) : void 0) ??
    readString(params, "message") ??
    "Codex /btw side thread failed.";
  return new Error(formatErrorMessage(message));
}
//#endregion
export { runCodexAppServerSideQuestion };
