import { c as emitAgentEvent, o as emitAgentAuditEvent } from "./agent-events-D4UsOPeT.js";
import { t as sanitizeForLog } from "./ansi-D4OHEz5F.js";
import { t as buildAgentRuntimeAuthPlan } from "./auth-6NjuyOV9.js";
import { s as resolveBootstrapWarningSignaturesSeen } from "./bootstrap-budget-DFC5I5_X.js";
import { i as hasClaudeLiveSessionForOwner } from "./claude-live-session-DQpkM6qP.js";
import { i as resolveCliBackendConfig } from "./cli-backends-D2v5ATPw.js";
import "./utils-DtcDeqWS.js";
import {
  n as resolveCliExecutionAuthProfileId,
  t as cliBackendAcceptsAuthProfileForwarding,
} from "./cli-execution-auth-DACbF1SS.js";
import { n as runCliAgent } from "./cli-runner-ybZuGkdj.js";
import { t as getCliSessionBinding } from "./cli-session-binding-CfY4fqsE.js";
import { o as emitTrustedDiagnosticEvent } from "./diagnostic-events-5-gsFhkM.js";
import { t as runEmbeddedAgent } from "./embedded-agent-T_kAEk06.js";
import { s as readErrorName } from "./errors-BoHeli7m.js";
import "./message-channel-NQc9DJ6B.js";
import { r as formatAcpErrorChain } from "./errors-BTjUwYsc.js";
import { t as FailoverError } from "./failover-error-CYvhrluQ.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import "./model-selection-DOlkTrQa.js";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-jOYXwwnX.js";
import { n as annotateInterSessionPromptText } from "./input-provenance-Xst3EirW.js";
import "./errors-CDrK1ZOW.js";
import "./manager.turn-timeout-DXXvfPFH.js";
import { a as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-DMpABeI4.js";
import { t as isCliProvider } from "./model-selection-cli-BGoUsby5.js";
import { t as normalizeReplyPayload } from "./normalize-reply-DyJ9i_w0.js";
import { u as resolveOpenAIRuntimeProvider } from "./openai-routing-Cu28Ynzk.js";
import { i as resolveAuthProfileOrder } from "./order-BNCpk81x.js";
import { c as redactSensitiveText } from "./redact-CUe6Oey5.js";
import { c as resolveAgentRunAbortLifecycleFields } from "./run-termination-BEbihwT8.js";
import {
  Q as timestampOptsFromConfig,
  Z as injectTimestamp,
  r as resolveAvailableAgentHarnessPolicy,
} from "./selection-B2JBt0RT.js";
import { j as persistSessionTranscriptTurn } from "./session-accessor-PZVNxFCV.js";
import "./workspace-DR7anktc.js";
import {
  c as buildClaudeCliFallbackContextPrelude,
  f as resolveFallbackRetryPrompt,
  l as claudeCliSessionTranscriptHasContent,
} from "./session-history-JKVVwxJC.js";
import { a as isSubagentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import { i as withLocalSessionPlacementTurnAdmission } from "./session-placement-admission-C_WzNYGC.js";
import {
  a as restoreCliSessionForkInStore,
  n as consumeCliSessionForkInStore,
  r as persistCliSessionForkSuccessorInStore,
  t as clearCliSessionInStore,
} from "./session-store-BgmMah2m.js";
import { i as ensureAuthProfileStore } from "./store-B7DoDdVM.js";
import { i as buildUsageWithNoCost } from "./stream-message-shared-DKS8UMJ_.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import "./run-context-Dbb7tDJw.js";
import {
  i as hasNewGeneratedMediaTaskForSessionKey,
  n as getGeneratedMediaTaskIdsForSessionKey,
} from "./task-status-access-BVw-UeJU.js";
import { t as resolveCliRuntimeToolsAllow } from "./tool-policy-auLxY0om.js";
import { t as resolveAcpToolTerminalOutcome } from "./tool-status-BF6CFZHZ.js";
import { a as readTailAssistantTextFromSessionTranscript } from "./transcript-kgNtplfz.js";
import {
  a as preparePersistedUserTurnMessageForTranscriptWrite,
  n as buildPersistedUserTurnMessage,
} from "./user-turn-transcript-DGJJ5XRn.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/agents/command/attempt-execution.ts
const log = createSubsystemLogger("agents/agent-command");
function shouldClearReusedCliSessionAfterError(err) {
  if (readErrorName(err) === "AbortError") return true;
  return err instanceof FailoverError;
}
function resolveClearedCliSessionReason(err) {
  if (err instanceof FailoverError) return err.reason;
  return readErrorName(err) || "error";
}
function normalizeTranscriptMirrorText(value) {
  return value.trim().replace(/\s+/gu, " ");
}
const ACP_TRANSCRIPT_USAGE = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
  totalTokens: 0,
  cost: {
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheWrite: 0,
    total: 0,
  },
};
function shouldSuppressEmbeddedLiveStreamOutput(params) {
  return params.opts.sessionEffects === "internal" && params.opts.deliver !== true;
}
function resolveProfileAuthFromStore(params) {
  const profileId = params.profileId?.trim();
  if (!profileId) return {};
  const credential = ensureAuthProfileStore(params.agentDir, {
    allowKeychainPrompt: false,
    externalCliProfileIds: [profileId],
  }).profiles[profileId];
  return {
    provider: credential?.provider,
    mode: credential?.type,
  };
}
function resolveHarnessAuthProfileSelection(params) {
  const sessionAuthProfileId = params.sessionAuthProfileId?.trim();
  if (sessionAuthProfileId) {
    const profileAuth = resolveProfileAuthFromStore({
      agentDir: params.agentDir,
      profileId: sessionAuthProfileId,
    });
    return {
      authProfileId: sessionAuthProfileId,
      authProfileIdSource: params.sessionAuthProfileSource,
      authProfileProvider: profileAuth.provider ?? params.authProfileProvider,
      authProfileMode: profileAuth.mode,
    };
  }
  if (!params.allowHarnessAuthProfileForwarding)
    return { authProfileProvider: params.authProfileProvider };
  const harnessAuthProvider = buildAgentRuntimeAuthPlan({
    provider: params.provider,
    authProfileProvider: params.authProfileProvider,
    config: params.config,
    workspaceDir: params.workspaceDir,
    ...(params.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {}),
    providerAuthAliasesEnabled: params.providerAuthAliasesEnabled,
    harnessId: params.harnessId,
    harnessRuntime: params.harnessRuntime,
    allowHarnessAuthProfileForwarding: params.allowHarnessAuthProfileForwarding,
  }).harnessAuthProvider;
  if (!harnessAuthProvider) return { authProfileProvider: params.authProfileProvider };
  const store = ensureAuthProfileStore(params.agentDir, {
    allowKeychainPrompt: false,
    externalCliProviderIds: [harnessAuthProvider],
  });
  const authProfileId = resolveAuthProfileOrder({
    cfg: params.config,
    store,
    provider: harnessAuthProvider,
  })[0];
  return authProfileId
    ? {
        authProfileId,
        authProfileIdSource: "auto",
        authProfileProvider: harnessAuthProvider,
      }
    : { authProfileProvider: params.authProfileProvider };
}
function resolveTranscriptUsage(usage) {
  if (!usage) return ACP_TRANSCRIPT_USAGE;
  return buildUsageWithNoCost({
    input: usage.input,
    output: usage.output,
    cacheRead: usage.cacheRead,
    cacheWrite: usage.cacheWrite,
    totalTokens: usage.total,
  });
}
async function persistTextTurnTranscript(params) {
  const promptText = params.transcriptBody ?? params.body;
  const replyText = params.finalText;
  const userMessage =
    params.userMessage ??
    (promptText
      ? {
          role: "user",
          content: promptText,
          timestamp: Date.now(),
        }
      : void 0);
  if (!userMessage && !replyText)
    return {
      kind: "persisted",
      sessionEntry: params.sessionEntry,
    };
  const messages = [];
  if (userMessage)
    messages.push({
      message: userMessage,
      idempotencyLookup: "scan",
      prepareMessageAfterIdempotencyCheck: (message) =>
        preparePersistedUserTurnMessageForTranscriptWrite(message, {
          agentId: params.sessionAgentId,
          sessionKey: params.sessionKey,
          beforeMessageWrite: runAgentHarnessBeforeMessageWriteHook,
        }),
    });
  if (replyText)
    messages.push({
      message: {
        role: "assistant",
        content: [
          {
            type: "text",
            text: replyText,
          },
        ],
        api: params.assistant.api,
        provider: params.assistant.provider,
        model: params.assistant.model,
        usage: resolveTranscriptUsage(params.assistant.usage),
        stopReason: "stop",
        timestamp: Date.now(),
      },
      shouldAppend: async ({ sessionFile }) => {
        if (!params.embeddedAssistantGapFill) return true;
        const latest = await readTailAssistantTextFromSessionTranscript(sessionFile, {
          excludeTranscriptOnlyOpenClawAssistant: true,
        });
        const normalizedReply = normalizeTranscriptMirrorText(replyText);
        const normalizedLatest = latest?.text ? normalizeTranscriptMirrorText(latest.text) : "";
        return !normalizedLatest || normalizedLatest !== normalizedReply;
      },
    });
  const turn = await persistSessionTranscriptTurn(
    {
      sessionId: params.sessionId,
      sessionKey: params.sessionKey,
      sessionFile: params.sessionFile,
      sessionEntry: params.sessionEntry,
      sessionStore: params.sessionStore,
      storePath: params.storePath,
      agentId: params.sessionAgentId,
      threadId: params.threadId,
    },
    {
      config: params.config,
      cwd: params.sessionCwd,
      messages,
      publishWhen: "always",
      touchSessionEntry: true,
      updateMode: "file-only",
      ...(params.sessionStore && params.storePath ? { expectedSessionId: params.sessionId } : {}),
    },
  );
  if (turn.rejectedReason === "session-rebound")
    return {
      kind: "session-rebound",
      sessionEntry: void 0,
    };
  return {
    kind: "persisted",
    sessionEntry: turn.sessionEntry,
  };
}
function resolveCliTranscriptReplyText(result) {
  const visibleText = result.meta.finalAssistantVisibleText?.trim();
  if (visibleText) return visibleText;
  return (result.payloads ?? [])
    .filter((payload) => !payload.isError && !payload.isReasoning)
    .map((payload) => payload.text?.trim() ?? "")
    .filter(Boolean)
    .join("\n\n");
}
function isClaudeCliProvider(provider) {
  return provider.trim().toLowerCase() === "claude-cli";
}
async function persistAcpTurnTranscript(params) {
  return await persistTextTurnTranscript({
    ...params,
    ...(params.userInput ? { userMessage: buildPersistedUserTurnMessage(params.userInput) } : {}),
    assistant: {
      api: "openai-responses",
      provider: "openclaw",
      model: "acp-runtime",
    },
  });
}
async function persistCliTurnTranscript(params) {
  const replyText = resolveCliTranscriptReplyText(params.result);
  const provider = params.result.meta.agentMeta?.provider?.trim() ?? "cli";
  const model = params.result.meta.agentMeta?.model?.trim() ?? "default";
  const gapFill = params.embeddedAssistantGapFill ?? false;
  const skipUserTurn = gapFill || params.skipUserTurn === true;
  return await persistTextTurnTranscript({
    body: skipUserTurn ? "" : params.body,
    transcriptBody: skipUserTurn ? void 0 : params.transcriptBody,
    ...(!skipUserTurn && params.userMessage ? { userMessage: params.userMessage } : {}),
    finalText: replyText,
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    sessionFile: params.sessionFile,
    sessionEntry: params.sessionEntry,
    sessionStore: params.sessionStore,
    storePath: params.storePath,
    sessionAgentId: params.sessionAgentId,
    threadId: params.threadId,
    sessionCwd: params.sessionCwd,
    config: params.config,
    embeddedAssistantGapFill: gapFill,
    assistant: {
      api: "cli",
      provider,
      model,
      usage: params.result.meta.agentMeta?.usage,
    },
  });
}
function runAgentAttempt(params) {
  const sessionAuthProfileId = params.sessionEntry?.authProfileOverride?.trim();
  const sessionAuthProfileSource = params.sessionEntry?.authProfileOverrideSource;
  const selectedAuthProfile =
    sessionAuthProfileId && sessionAuthProfileSource !== "auto"
      ? {
          id: sessionAuthProfileId,
          source: sessionAuthProfileSource,
        }
      : params.configuredAuthProfileId?.trim()
        ? {
            id: params.configuredAuthProfileId.trim(),
            source: "user",
          }
        : sessionAuthProfileId
          ? {
              id: sessionAuthProfileId,
              source: sessionAuthProfileSource,
            }
          : void 0;
  const isRawModelRun = params.opts.modelRun === true || params.opts.promptMode === "none";
  const claudeCliFallbackPrelude =
    !isRawModelRun &&
    params.isFallbackRetry &&
    isClaudeCliProvider(params.originalProvider) &&
    !isClaudeCliProvider(params.providerOverride)
      ? buildClaudeCliFallbackContextPrelude({
          cliSessionId: getCliSessionBinding(params.sessionEntry, "claude-cli")?.sessionId,
        })
      : "";
  const resolvedPrompt = resolveFallbackRetryPrompt({
    body: params.body,
    isFallbackRetry: params.isFallbackRetry,
    sessionHasHistory: params.sessionHasHistory,
    priorContextPrelude: claudeCliFallbackPrelude,
  });
  const effectivePrompt = isRawModelRun
    ? resolvedPrompt
    : annotateInterSessionPromptText(resolvedPrompt, params.opts.inputProvenance);
  const bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(
    params.sessionEntry?.systemPromptReport,
  );
  const bootstrapPromptWarningSignature =
    bootstrapPromptWarningSignaturesSeen[bootstrapPromptWarningSignaturesSeen.length - 1];
  const requestedAgentHarnessId = isRawModelRun ? "openclaw" : void 0;
  const sessionRuntimeOverride = isRawModelRun ? void 0 : params.agentHarnessRuntimeOverride;
  const locksSessionRuntimeOverride =
    sessionRuntimeOverride !== void 0 && params.sessionEntry?.modelSelectionLocked === true;
  const sessionCliRuntime =
    sessionRuntimeOverride &&
    !locksSessionRuntimeOverride &&
    isCliProvider(sessionRuntimeOverride, params.cfg)
      ? sessionRuntimeOverride
      : void 0;
  const configuredCliRuntime =
    !isRawModelRun && !sessionRuntimeOverride
      ? resolveCliRuntimeExecutionProvider({
          provider: params.providerOverride,
          cfg: params.cfg,
          agentId: params.sessionAgentId,
          modelId: params.modelOverride,
          authProfileId: selectedAuthProfile?.id,
        })
      : void 0;
  const cliExecutionProvider = isRawModelRun
    ? params.providerOverride
    : (sessionCliRuntime ?? configuredCliRuntime ?? params.providerOverride);
  const isCliExecutionProvider = sessionRuntimeOverride
    ? sessionCliRuntime !== void 0
    : isCliProvider(cliExecutionProvider, params.cfg);
  if (params.fallbackRuntimeState && params.fallbackRuntimeState.originRuntime === void 0)
    params.fallbackRuntimeState.originRuntime =
      !isRawModelRun && isCliExecutionProvider ? "cli" : "embedded";
  const shouldForwardImagesToEmbedded =
    !params.isFallbackRetry || params.fallbackRuntimeState?.originRuntime === "cli";
  const allowCliAuthProfileForwarding =
    isCliExecutionProvider &&
    cliBackendAcceptsAuthProfileForwarding({
      provider: cliExecutionProvider,
      config: params.cfg,
      agentId: params.sessionAgentId,
    });
  const agentHarnessPolicy = isRawModelRun
    ? {
        runtime: "openclaw",
        runtimeSource: "model",
      }
    : sessionRuntimeOverride
      ? {
          runtime: sessionRuntimeOverride,
          runtimeSource: "model",
        }
      : resolveAvailableAgentHarnessPolicy({
          provider: params.providerOverride,
          modelId: params.modelOverride,
          config: params.cfg,
          agentId: params.sessionAgentId,
          sessionKey: params.sessionKey ?? params.sessionId,
        });
  const harnessAuthSelection = resolveHarnessAuthProfileSelection({
    config: params.cfg,
    agentDir: params.agentDir,
    workspaceDir: params.workspaceDir,
    provider: params.providerOverride,
    authProfileProvider: params.authProfileProvider,
    sessionAuthProfileId: selectedAuthProfile?.id,
    sessionAuthProfileSource: selectedAuthProfile?.source,
    harnessId: requestedAgentHarnessId,
    harnessRuntime: agentHarnessPolicy.runtime,
    ...(params.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {}),
    providerAuthAliasesEnabled: params.pluginsEnabled,
    allowHarnessAuthProfileForwarding: !isCliExecutionProvider,
  });
  const runtimeAuthPlan = buildAgentRuntimeAuthPlan({
    provider: params.providerOverride,
    authProfileProvider: harnessAuthSelection.authProfileProvider,
    authProfileMode: harnessAuthSelection.authProfileMode,
    sessionAuthProfileId: harnessAuthSelection.authProfileId,
    config: params.cfg,
    workspaceDir: params.workspaceDir,
    ...(params.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {}),
    providerAuthAliasesEnabled: params.pluginsEnabled,
    harnessId: requestedAgentHarnessId,
    harnessRuntime: agentHarnessPolicy.runtime,
    allowHarnessAuthProfileForwarding: !isCliExecutionProvider,
  });
  const cliAuthProfileId = allowCliAuthProfileForwarding
    ? resolveCliExecutionAuthProfileId({
        cliExecutionProvider,
        authProfileProvider: params.authProfileProvider,
        config: params.cfg,
        agentDir: params.agentDir,
        selected: harnessAuthSelection,
      })
    : void 0;
  const authProfileId = allowCliAuthProfileForwarding
    ? cliAuthProfileId
    : runtimeAuthPlan.forwardedAuthProfileId;
  const embeddedAgentProvider = resolveOpenAIRuntimeProvider({
    provider: params.providerOverride,
    harnessRuntime: agentHarnessPolicy.runtime,
    agentHarnessId: requestedAgentHarnessId,
    authProfileProvider: runtimeAuthPlan.authProfileProviderForAuth,
    authProfileId,
    config: params.cfg,
    workspaceDir: params.workspaceDir,
  });
  const embeddedAgentHarnessOverride =
    requestedAgentHarnessId ??
    sessionRuntimeOverride ??
    (agentHarnessPolicy.runtime === "openclaw" && agentHarnessPolicy.runtimeSource !== "implicit"
      ? "openclaw"
      : void 0);
  if (!isRawModelRun && isCliExecutionProvider) {
    const cliSessionBinding = getCliSessionBinding(params.sessionEntry, cliExecutionProvider);
    const cliProcessCwd = params.cwd ? resolveUserPath(params.cwd) : params.workspaceDir;
    const cliPrompt =
      params.opts.inputProvenance?.kind === "inter_session"
        ? effectivePrompt
        : injectTimestamp(effectivePrompt, timestampOptsFromConfig(params.cfg));
    const mutableCliSessionStore =
      params.sessionKey && params.sessionStore && params.storePath
        ? {
            sessionKey: params.sessionKey,
            sessionStore: params.sessionStore,
            storePath: params.storePath,
          }
        : void 0;
    const resolveReusableCliSessionBinding = async () => {
      const hasManagedClaudeLiveSession = Boolean(
        isClaudeCliProvider(cliExecutionProvider) &&
        cliSessionBinding?.sessionId &&
        hasClaudeLiveSessionForOwner({
          backendId: cliExecutionProvider,
          agentAccountId: params.runContext.accountId,
          agentId: params.sessionAgentId,
          authProfileId: cliSessionBinding.authProfileId,
          sessionId: params.sessionId,
          sessionKey: params.sessionKey,
        }),
      );
      if (
        !isClaudeCliProvider(cliExecutionProvider) ||
        !cliSessionBinding?.sessionId ||
        hasManagedClaudeLiveSession ||
        (await claudeCliSessionTranscriptHasContent({
          sessionId: cliSessionBinding.sessionId,
          workspaceDir: cliProcessCwd,
        }))
      )
        return cliSessionBinding;
      log.warn(
        `cli session reset: provider=${sanitizeForLog(cliExecutionProvider)} reason=transcript-missing sessionKey=${params.sessionKey ?? params.sessionId}`,
      );
      if (mutableCliSessionStore)
        params.sessionEntry =
          (await clearCliSessionInStore({
            provider: cliExecutionProvider,
            ...mutableCliSessionStore,
          })) ?? params.sessionEntry;
      return cliSessionBinding;
    };
    const mediaTaskIdsBefore = getGeneratedMediaTaskIdsForSessionKey(params.sessionKey);
    const runCliWithSession = async (
      nextCliSessionId,
      activeCliSessionBinding = cliSessionBinding,
    ) => {
      const forkCliSessionOnResume = activeCliSessionBinding?.forkNextResume === true;
      if (
        forkCliSessionOnResume &&
        !resolveCliBackendConfig(cliExecutionProvider, params.cfg, {
          agentId: params.sessionAgentId,
        })?.config.forkArg
      )
        throw new Error(`CLI backend "${cliExecutionProvider}" does not support session forks`);
      const forkStoreParams =
        forkCliSessionOnResume && nextCliSessionId && mutableCliSessionStore
          ? {
              provider: cliExecutionProvider,
              expectedCliSessionId: nextCliSessionId,
              ...mutableCliSessionStore,
            }
          : void 0;
      return withLocalSessionPlacementTurnAdmission(
        {
          sessionId: params.sessionId,
          sessionKey: params.sessionKey ?? params.sessionId,
          agentId: params.sessionAgentId,
          runId: params.runId,
        },
        () =>
          runCliAgent({
            sessionId: params.sessionId,
            sessionKey: params.sessionKey,
            sessionEntry: params.sessionEntry,
            agentId: params.sessionAgentId,
            trigger: "user",
            sessionFile: params.sessionFile,
            storePath: params.storePath,
            workspaceDir: params.workspaceDir,
            cwd: params.cwd,
            config: params.cfg,
            prompt: cliPrompt,
            transcriptPrompt: params.transcriptBody,
            modelProvider: params.providerOverride,
            provider: cliExecutionProvider,
            model: params.modelOverride,
            thinkLevel: params.resolvedThinkLevel,
            timeoutMs: params.timeoutMs,
            runTimeoutOverrideMs: params.runTimeoutOverrideMs,
            runId: params.runId,
            lifecycleGeneration: params.lifecycleGeneration,
            lane: params.opts.lane,
            extraSystemPrompt: params.opts.extraSystemPrompt,
            inputProvenance: params.opts.inputProvenance,
            sourceReplyDeliveryMode: params.opts.sourceReplyDeliveryMode,
            requireExplicitMessageTarget:
              params.opts.requireExplicitMessageTarget ?? isSubagentSessionKey(params.sessionKey),
            cliSessionBindingFacts: params.opts.cliSessionBindingFacts,
            cliSessionId: nextCliSessionId,
            cliSessionBinding:
              nextCliSessionId === activeCliSessionBinding?.sessionId
                ? activeCliSessionBinding
                : void 0,
            forkCliSessionOnResume,
            ...(forkStoreParams
              ? {
                  claimCliSessionFork: async () => {
                    const claimed = await consumeCliSessionForkInStore(forkStoreParams);
                    if (claimed) params.sessionEntry = claimed;
                    return Boolean(claimed);
                  },
                  restoreCliSessionFork: async () => {
                    const restored = await restoreCliSessionForkInStore(forkStoreParams);
                    if (restored) params.sessionEntry = restored;
                  },
                  persistCliSessionForkSuccessor: async (successorCliSessionId) => {
                    const persisted = await persistCliSessionForkSuccessorInStore({
                      ...forkStoreParams,
                      successorCliSessionId,
                    });
                    if (!persisted)
                      throw new Error("CLI session fork successor could not be persisted");
                    params.sessionEntry = persisted;
                  },
                }
              : {}),
            authProfileId,
            bootstrapPromptWarningSignaturesSeen,
            bootstrapPromptWarningSignature,
            imagePrompt: params.body,
            images: params.opts.images,
            imageOrder: params.opts.imageOrder,
            skillsSnapshot: params.skillsSnapshot,
            messageChannel: params.messageChannel,
            streamParams: params.opts.streamParams,
            messageProvider: params.opts.messageProvider ?? params.messageChannel,
            currentChannelId: params.runContext.currentChannelId,
            chatId: params.runContext.chatId,
            channelContext: params.runContext.channelContext,
            currentThreadTs: params.runContext.currentThreadTs,
            currentInboundAudio: params.runContext.currentInboundAudio,
            approvalReviewerDeviceId: params.opts.approvalReviewerDeviceId,
            agentAccountId: params.runContext.accountId,
            senderId: params.runContext.senderId,
            senderIsOwner: params.opts.senderIsOwner,
            bashElevated: params.opts.bashElevated,
            groupId: params.runContext.groupId,
            groupChannel: params.runContext.groupChannel,
            groupSpace: params.runContext.groupSpace,
            spawnedBy: params.spawnedBy,
            toolsAllow: resolveCliRuntimeToolsAllow(
              params.opts.toolsAllow,
              params.opts.toolsAllowIsDefault,
            ),
            cleanupBundleMcpOnRunEnd: params.opts.cleanupBundleMcpOnRunEnd,
            cleanupCliLiveSessionOnRunEnd: params.opts.cleanupCliLiveSessionOnRunEnd,
            oneShotCliRun: params.opts.oneShotCliRun,
            userTurnTranscriptRecorder: params.userTurnTranscriptRecorder,
            suppressNextUserMessagePersistence: params.suppressPromptPersistenceOnRetry === true,
            ...(mutableCliSessionStore && !forkCliSessionOnResume
              ? {
                  onBeforeFreshCliSessionRetry: async (retry) => {
                    if (
                      hasNewGeneratedMediaTaskForSessionKey(
                        params.sessionKey,
                        mediaTaskIdsBefore,
                      ) ||
                      retry.sessionId !== activeCliSessionBinding?.sessionId
                    )
                      return false;
                    log.warn(
                      `CLI session failed, clearing before fresh retry: provider=${sanitizeForLog(cliExecutionProvider)} sessionKey=${mutableCliSessionStore.sessionKey} reason=${sanitizeForLog(retry.reason)}`,
                    );
                    params.sessionEntry =
                      (await clearCliSessionInStore({
                        provider: cliExecutionProvider,
                        ...mutableCliSessionStore,
                      })) ?? params.sessionEntry;
                    return true;
                  },
                }
              : {}),
          }),
      );
    };
    return resolveReusableCliSessionBinding().then(async (activeCliSessionBinding) => {
      try {
        return await runCliWithSession(activeCliSessionBinding?.sessionId, activeCliSessionBinding);
      } catch (err) {
        if (
          isClaudeCliProvider(cliExecutionProvider) &&
          !activeCliSessionBinding?.forkNextResume &&
          shouldClearReusedCliSessionAfterError(err) &&
          !hasNewGeneratedMediaTaskForSessionKey(params.sessionKey, mediaTaskIdsBefore) &&
          activeCliSessionBinding?.sessionId &&
          mutableCliSessionStore
        ) {
          log.warn(
            `CLI session cleared after failed reused turn: provider=${sanitizeForLog(cliExecutionProvider)} sessionKey=${mutableCliSessionStore.sessionKey} reason=${sanitizeForLog(resolveClearedCliSessionReason(err))}`,
          );
          params.sessionEntry =
            (await clearCliSessionInStore({
              provider: cliExecutionProvider,
              ...mutableCliSessionStore,
            })) ?? params.sessionEntry;
        }
        throw err;
      }
    });
  }
  return runEmbeddedAgent({
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    sessionTarget: params.sessionTarget,
    sandboxSessionKey: params.sessionKey,
    agentId: params.sessionAgentId,
    trigger: "user",
    messageChannel: params.messageChannel,
    messageProvider: params.opts.messageProvider ?? params.messageChannel,
    agentAccountId: params.runContext.accountId,
    messageTo: params.opts.replyTo ?? params.opts.to,
    messageThreadId: params.opts.threadId,
    groupId: params.runContext.groupId,
    groupChannel: params.runContext.groupChannel,
    groupSpace: params.runContext.groupSpace,
    spawnedBy: params.spawnedBy,
    currentChannelId: params.runContext.currentChannelId,
    chatId: params.runContext.chatId,
    channelContext: params.runContext.channelContext,
    currentThreadTs: params.runContext.currentThreadTs,
    currentInboundAudio: params.runContext.currentInboundAudio,
    replyToMode: params.runContext.replyToMode,
    hasRepliedRef: params.runContext.hasRepliedRef,
    senderId: params.runContext.senderId,
    senderIsOwner: params.opts.senderIsOwner,
    sessionFile: params.sessionFile,
    workspaceDir: params.workspaceDir,
    cwd: params.cwd,
    config: params.cfg,
    agentHarnessId: embeddedAgentHarnessOverride,
    modelSelectionLocked: !isRawModelRun && params.sessionEntry?.modelSelectionLocked === true,
    agentHarnessRuntimeOverride: embeddedAgentHarnessOverride,
    skillsSnapshot: params.skillsSnapshot,
    prompt: effectivePrompt,
    transcriptPrompt: params.transcriptBody,
    images: shouldForwardImagesToEmbedded ? params.opts.images : void 0,
    imageOrder: shouldForwardImagesToEmbedded ? params.opts.imageOrder : void 0,
    clientTools: params.opts.clientTools,
    provider: embeddedAgentProvider,
    model: params.modelOverride,
    modelFallbacksOverride: params.modelFallbacksOverride,
    authProfileId,
    authProfileIdSource: authProfileId ? harnessAuthSelection.authProfileIdSource : void 0,
    thinkLevel: params.resolvedThinkLevel,
    fastMode: params.fastMode,
    fastModeStartedAtMs: params.fastModeStartedAtMs,
    fastModeAutoOnSeconds: params.fastModeAutoOnSeconds,
    isFinalFallbackAttempt: params.isFinalFallbackAttempt,
    verboseLevel: params.resolvedVerboseLevel,
    bashElevated: params.opts.bashElevated,
    approvalReviewerDeviceId: params.opts.approvalReviewerDeviceId,
    timeoutMs: params.timeoutMs,
    runId: params.runId,
    lifecycleGeneration: params.lifecycleGeneration,
    lane: params.opts.lane,
    suppressLiveStreamOutput: shouldSuppressEmbeddedLiveStreamOutput(params),
    abortSignal: params.opts.abortSignal,
    extraSystemPrompt: params.opts.extraSystemPrompt,
    bootstrapContextMode: params.opts.bootstrapContextMode,
    bootstrapContextRunKind: params.opts.bootstrapContextRunKind,
    toolsAllow: params.opts.toolsAllow,
    runtimePluginToolGrant: params.opts.runtimePluginToolGrant,
    internalEvents: params.opts.internalEvents,
    inputProvenance: params.opts.inputProvenance,
    sourceReplyDeliveryMode: params.opts.sourceReplyDeliveryMode,
    disableMessageTool: params.opts.disableMessageTool,
    forceRestartSafeTools: params.opts.forceRestartSafeTools,
    streamParams: params.opts.streamParams,
    agentDir: params.agentDir,
    allowGatewaySubagentBinding: params.opts.allowGatewaySubagentBinding,
    allowTransientCooldownProbe: params.allowTransientCooldownProbe,
    cleanupBundleMcpOnRunEnd: params.opts.cleanupBundleMcpOnRunEnd,
    oneShotCliRun: params.opts.oneShotCliRun,
    modelRun: params.opts.modelRun,
    promptMode: params.opts.promptMode,
    disableTools: params.opts.modelRun === true,
    onAgentEvent: params.onAgentEvent,
    deferTerminalLifecycle: params.deferTerminalLifecycle,
    suppressNextUserMessagePersistence: params.suppressPromptPersistenceOnRetry === true,
    userTurnTranscriptRecorder: params.userTurnTranscriptRecorder,
    onUserMessagePersisted: params.onUserMessagePersisted,
    onExecutionStarted: (info) => {
      if (info?.lifecycleGeneration)
        params.onLifecycleGenerationChanged?.(info.lifecycleGeneration);
    },
    onSessionIdChanged: params.opts.onSessionIdChanged,
    bootstrapPromptWarningSignaturesSeen,
    bootstrapPromptWarningSignature,
  });
}
function buildAcpResult(params) {
  const normalizedFinalPayload = normalizeReplyPayload({ text: params.payloadText });
  const payloads = normalizedFinalPayload ? [normalizedFinalPayload] : [];
  const abortFields = resolveAgentRunAbortLifecycleFields(params.abortSignal);
  const resultCancelled = params.resultStatus === "cancelled";
  return {
    payloads,
    meta: {
      durationMs: Date.now() - params.startedAt,
      aborted: abortFields.aborted ?? resultCancelled,
      stopReason: abortFields.stopReason ?? (resultCancelled ? "stop" : params.stopReason),
    },
  };
}
function emitAcpLifecycleStart(params) {
  (params.auditOnly ? emitAgentAuditEvent : emitAgentEvent)({
    runId: params.runId,
    ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
    ...(params.agentId ? { agentId: params.agentId } : {}),
    ...(params.lifecycleGeneration ? { lifecycleGeneration: params.lifecycleGeneration } : {}),
    stream: "lifecycle",
    data: {
      phase: "start",
      startedAt: params.startedAt,
    },
  });
}
const ACP_PROXY_ENV_KEYS = [
  "HTTP_PROXY",
  "HTTPS_PROXY",
  "ALL_PROXY",
  "http_proxy",
  "https_proxy",
  "all_proxy",
];
const MAX_TRACKED_ACP_TOOLS = 4096;
function createAcpToolLifecycleTracker() {
  return {
    active: /* @__PURE__ */ new Map(),
    terminalToolCallIds: /* @__PURE__ */ new Set(),
    saturated: false,
  };
}
function acpAuditToolName(kind) {
  switch (kind) {
    case "read":
    case "edit":
    case "delete":
    case "move":
    case "search":
    case "execute":
    case "fetch":
    case "switch_mode":
    case "think":
    case "other":
      return `acp_${kind}`;
    default:
      return "acp_tool";
  }
}
function resolveAcpToolTerminalReason(signal, stopReason, error, resultStatus) {
  const abortFields = resolveAgentRunAbortLifecycleFields(signal);
  if (abortFields.aborted) return abortFields.stopReason === "timeout" ? "timed_out" : "cancelled";
  const normalizedStopReason = normalizeOptionalLowercaseString(stopReason);
  if (normalizedStopReason === "timeout") return "timed_out";
  if (resultStatus === "cancelled") return "cancelled";
  if (error instanceof Error && error.detailCode === "TURN_TIMEOUT") return "timed_out";
  if (
    normalizedStopReason === "cancel" ||
    normalizedStopReason === "cancelled" ||
    normalizedStopReason === "manual-cancel"
  )
    return "cancelled";
  return "failed";
}
function resolveAcpLifecycleEndFields(signal, stopReason, resultStatus) {
  const abortFields = resolveAgentRunAbortLifecycleFields(signal);
  if (abortFields.aborted) return abortFields;
  const terminalReason = resolveAcpToolTerminalReason(void 0, stopReason, void 0, resultStatus);
  if (terminalReason === "timed_out")
    return {
      aborted: true,
      stopReason: "timeout",
      status: "timed_out",
    };
  if (terminalReason === "cancelled")
    return {
      aborted: true,
      stopReason: "stop",
      status: "cancelled",
    };
  return {};
}
function emitAcpToolExecutionEvent(params) {
  const { event } = params;
  const now = Date.now();
  const toolCallId = event.toolCallId?.trim() ? event.toolCallId : void 0;
  const activeTool = toolCallId ? params.toolTracker.active.get(toolCallId) : void 0;
  const terminalOutcome = resolveAcpToolTerminalOutcome(event.status);
  const toolName = acpAuditToolName(event.kind);
  if (toolCallId && !activeTool) {
    if (params.toolTracker.terminalToolCallIds.has(toolCallId)) return;
    const trackedIdentities =
      params.toolTracker.active.size + params.toolTracker.terminalToolCallIds.size;
    if (params.toolTracker.saturated || trackedIdentities >= MAX_TRACKED_ACP_TOOLS) {
      params.toolTracker.saturated = true;
      return;
    }
  }
  if (
    !activeTool &&
    (toolCallId !== void 0 || (toolCallId === void 0 && terminalOutcome !== void 0))
  ) {
    emitTrustedDiagnosticEvent({
      type: "tool.execution.started",
      runId: params.runId,
      ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
      ...(params.agentId ? { agentId: params.agentId } : {}),
      ...(toolCallId ? { toolCallId } : {}),
      toolName,
      toolSource: "core",
      toolOwner: "acp",
    });
    if (toolCallId)
      params.toolTracker.active.set(toolCallId, {
        runId: params.runId,
        ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
        ...(params.agentId ? { agentId: params.agentId } : {}),
        toolCallId,
        toolName,
        startedAt: now,
      });
  }
  if (!terminalOutcome) return;
  const terminalReason = resolveAcpToolTerminalReason(
    params.abortSignal,
    void 0,
    void 0,
    terminalOutcome === "cancelled" ? "cancelled" : void 0,
  );
  const durationMs = Math.max(0, now - (activeTool?.startedAt ?? now));
  emitTrustedDiagnosticEvent(
    terminalOutcome === "completed"
      ? {
          type: "tool.execution.completed",
          runId: params.runId,
          ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
          ...(params.agentId ? { agentId: params.agentId } : {}),
          ...(toolCallId ? { toolCallId } : {}),
          toolName: activeTool?.toolName ?? toolName,
          toolSource: "core",
          toolOwner: "acp",
          durationMs,
        }
      : {
          type: "tool.execution.error",
          runId: params.runId,
          ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
          ...(params.agentId ? { agentId: params.agentId } : {}),
          ...(toolCallId ? { toolCallId } : {}),
          toolName: activeTool?.toolName ?? toolName,
          toolSource: "core",
          toolOwner: "acp",
          durationMs,
          errorCategory: terminalReason === "cancelled" ? "aborted" : "acp_tool",
          terminalReason,
        },
  );
  if (toolCallId) {
    params.toolTracker.active.delete(toolCallId);
    params.toolTracker.terminalToolCallIds.add(toolCallId);
  }
}
function finalizeAcpToolsForRun(toolTracker, runId, terminalReason) {
  const now = Date.now();
  for (const activeTool of toolTracker.active.values())
    emitTrustedDiagnosticEvent({
      type: "tool.execution.error",
      runId,
      ...(activeTool.sessionKey ? { sessionKey: activeTool.sessionKey } : {}),
      ...(activeTool.agentId ? { agentId: activeTool.agentId } : {}),
      toolName: activeTool.toolName,
      toolSource: "core",
      toolOwner: "acp",
      toolCallId: activeTool.toolCallId,
      durationMs: Math.max(0, now - activeTool.startedAt),
      errorCategory: terminalReason === "cancelled" ? "aborted" : "acp_tool_incomplete",
      terminalReason,
    });
  toolTracker.active.clear();
  toolTracker.terminalToolCallIds.clear();
  toolTracker.saturated = false;
}
function resolvePresentProxyEnvKeys(env = process.env) {
  return ACP_PROXY_ENV_KEYS.filter((key) => {
    const value = env[key];
    return typeof value === "string" && value.trim().length > 0;
  });
}
function sanitizeAcpDiagnosticText(value) {
  return truncateUtf16Safe(redactSensitiveText(value).replace(/\s+/g, " ").trim(), 240);
}
function acpRuntimeEventDiagnostics(event) {
  if (event.type === "status")
    return {
      eventType: event.type,
      text: sanitizeAcpDiagnosticText(event.text),
      ...(event.tag ? { tag: event.tag } : {}),
    };
  if (event.type === "tool_call")
    return {
      eventType: event.type,
      text: sanitizeAcpDiagnosticText(event.text),
      ...(event.tag ? { tag: event.tag } : {}),
      ...(event.status ? { status: sanitizeAcpDiagnosticText(event.status) } : {}),
      ...(event.title ? { title: sanitizeAcpDiagnosticText(event.title) } : {}),
      ...(event.toolCallId ? { toolCallId: sanitizeAcpDiagnosticText(event.toolCallId) } : {}),
    };
  if (event.type === "error")
    return {
      eventType: event.type,
      message: sanitizeAcpDiagnosticText(event.message),
      ...(event.code ? { code: sanitizeAcpDiagnosticText(event.code) } : {}),
      ...(typeof event.retryable === "boolean" ? { retryable: event.retryable } : {}),
    };
  if (event.type === "done")
    return {
      eventType: event.type,
      ...(event.status ? { status: event.status } : {}),
      ...(event.stopReason ? { stopReason: sanitizeAcpDiagnosticText(event.stopReason) } : {}),
    };
  return {
    eventType: event.type,
    stream: event.stream ?? "output",
  };
}
function emitAcpPromptSubmitted(params) {
  emitAgentEvent({
    runId: params.runId,
    stream: "acp",
    ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
    data: {
      phase: "prompt_submitted",
      at: params.at,
      proxyEnvKeys: resolvePresentProxyEnvKeys(),
    },
  });
}
function emitAcpRuntimeEvent(params) {
  if (params.event.type === "tool_call")
    emitAcpToolExecutionEvent({
      runId: params.runId,
      toolTracker: params.toolTracker,
      ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
      ...(params.agentId ? { agentId: params.agentId } : {}),
      ...(params.abortSignal ? { abortSignal: params.abortSignal } : {}),
      event: params.event,
    });
  if (!params.auditOnly)
    emitAgentEvent({
      runId: params.runId,
      stream: "acp",
      ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
      ...(params.agentId ? { agentId: params.agentId } : {}),
      data: {
        phase: "runtime_event",
        ...acpRuntimeEventDiagnostics(params.event),
      },
    });
}
function emitAcpLifecycleEnd(params) {
  finalizeAcpToolsForRun(
    params.toolTracker,
    params.runId,
    resolveAcpToolTerminalReason(
      params.abortSignal,
      params.stopReason,
      void 0,
      params.resultStatus,
    ),
  );
  (params.auditOnly ? emitAgentAuditEvent : emitAgentEvent)({
    runId: params.runId,
    ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
    ...(params.agentId ? { agentId: params.agentId } : {}),
    ...(params.lifecycleGeneration ? { lifecycleGeneration: params.lifecycleGeneration } : {}),
    stream: "lifecycle",
    data: {
      phase: "end",
      endedAt: Date.now(),
      ...resolveAcpLifecycleEndFields(params.abortSignal, params.stopReason, params.resultStatus),
    },
  });
}
function emitAcpLifecycleError(params) {
  const terminalReason = resolveAcpToolTerminalReason(params.abortSignal, void 0, params.error);
  finalizeAcpToolsForRun(params.toolTracker, params.runId, terminalReason);
  const lifecycleFields =
    params.terminalOutcome === "blocked"
      ? { livenessState: "blocked" }
      : terminalReason === "timed_out"
        ? {
            aborted: true,
            stopReason: "timeout",
            status: "timed_out",
          }
        : resolveAgentRunAbortLifecycleFields(params.abortSignal);
  (params.auditOnly ? emitAgentAuditEvent : emitAgentEvent)({
    runId: params.runId,
    ...(params.agentId ? { agentId: params.agentId } : {}),
    ...(params.lifecycleGeneration ? { lifecycleGeneration: params.lifecycleGeneration } : {}),
    stream: "lifecycle",
    ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
    data: {
      phase: "error",
      ...(!params.auditOnly ? { error: formatAcpErrorChain(params.error) } : {}),
      endedAt: Date.now(),
      ...lifecycleFields,
    },
  });
}
function emitAcpAssistantDelta(params) {
  emitAgentEvent({
    runId: params.runId,
    stream: "assistant",
    data: {
      text: params.text,
      delta: params.delta,
    },
  });
}
//#endregion
export {
  emitAcpLifecycleError as a,
  emitAcpRuntimeEvent as c,
  runAgentAttempt as d,
  emitAcpLifecycleEnd as i,
  persistAcpTurnTranscript as l,
  createAcpToolLifecycleTracker as n,
  emitAcpLifecycleStart as o,
  emitAcpAssistantDelta as r,
  emitAcpPromptSubmitted as s,
  buildAcpResult as t,
  persistCliTurnTranscript as u,
};
