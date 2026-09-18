import {
  f as buildContextEngineRuntimeSettings,
  u as runContextEngineMaintenance,
} from "./agent-end-side-effects-PAHWJAYi.js";
import {
  a as resolveEffectiveCompactionMode,
  n as applyAgentAutoCompactionGuard,
} from "./agent-settings-CAPRfR7V.js";
import { f as buildEmbeddedCompactionRuntimeContext } from "./attempt.prompt-helpers-CztYiE1m.js";
import { l as shouldPreemptivelyCompactBeforePrompt } from "./attempt.tool-run-context-DzOtUuEC.js";
import { i as resolveCliBackendConfig } from "./cli-backends-D2v5ATPw.js";
import { n as classifyCompactionReason } from "./compact-reasons-DBEvigt9.js";
import {
  n as isRecoverableNativeHarnessBindingFailure,
  t as maybeCompactAgentHarnessSession,
} from "./compaction-CYj78YER.js";
import {
  A as compactWithSafetyTimeout,
  j as resolveCompactionTimeoutMs,
  k as compactContextEngineWithSafetyTimeout,
} from "./diagnostic-DE-wbBb7.js";
import { i as buildGenericCliContextEngineHostSupport } from "./host-compat-BibWlia2.js";
import { t as ensureContextEnginesInitialized } from "./init-R35iJ-iC.js";
import { z as normalizeOptionalAgentRuntimeId } from "./openai-routing-Cu28Ynzk.js";
import { o as resolveContextEngine } from "./registry-DXbEDAsr.js";
import { n as resolveAgentRunSessionTarget } from "./run-session-target-B5hjrVU1.js";
import { t as ensureSelectedAgentHarnessPlugin } from "./runtime-plugin-qskRkoSz.js";
import { T as createPreparedEmbeddedAgentSettingsManager } from "./selection-B2JBt0RT.js";
import { t as SessionManager } from "./session-manager-BD4l9VJc.js";
import {
  i as recordCliCompactionInStore,
  t as clearCliSessionInStore,
} from "./session-store-BgmMah2m.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { o as resolveLiveToolResultMaxChars } from "./tool-result-truncation-B3T_nFx6.js";
//#region src/agents/command/cli-compaction.ts
const CODEX_APP_SERVER_OWNS_AUTO_COMPACTION_REASON = "codex app-server owns automatic compaction";
const log = createSubsystemLogger("agents/cli-compaction");
const cliCompactionDeps = {
  openSessionManager: (sessionFile) => SessionManager.open(sessionFile),
  ensureContextEnginesInitialized,
  resolveContextEngine,
  createPreparedEmbeddedAgentSettingsManager,
  applyAgentAutoCompactionGuard,
  shouldPreemptivelyCompactBeforePrompt,
  resolveLiveToolResultMaxChars,
  runContextEngineMaintenance,
  ensureSelectedAgentHarnessPlugin,
  maybeCompactAgentHarnessSession,
  clearCliSessionInStore,
  resolveCliBackendConfig,
  recordCliCompactionInStore,
};
/** Overrides CLI compaction dependencies for focused tests. */
function setCliCompactionTestDeps(overrides) {
  Object.assign(cliCompactionDeps, overrides);
}
/** Restores production CLI compaction dependencies after tests. */
function resetCliCompactionTestDeps() {
  Object.assign(cliCompactionDeps, {
    openSessionManager: (sessionFile) => SessionManager.open(sessionFile),
    ensureContextEnginesInitialized,
    resolveContextEngine,
    createPreparedEmbeddedAgentSettingsManager,
    applyAgentAutoCompactionGuard,
    shouldPreemptivelyCompactBeforePrompt,
    resolveLiveToolResultMaxChars,
    runContextEngineMaintenance,
    ensureSelectedAgentHarnessPlugin,
    maybeCompactAgentHarnessSession,
    clearCliSessionInStore,
    resolveCliBackendConfig,
    recordCliCompactionInStore,
  });
}
function resolvePositiveInteger(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return;
  return Math.floor(value);
}
function getSessionBranchMessages(sessionManager) {
  return sessionManager
    .getBranch()
    .flatMap((entry) =>
      entry.type === "message" && typeof entry.message === "object" && entry.message !== null
        ? [entry.message]
        : [],
    );
}
function resolveSessionTokenSnapshot(sessionEntry) {
  return resolvePositiveInteger(
    sessionEntry?.totalTokensFresh === false ? void 0 : sessionEntry?.totalTokens,
  );
}
function isNativeHarnessCompactionSession(sessionEntry, provider) {
  const harnessId = sessionEntry?.agentHarnessId?.trim().toLowerCase();
  if (!harnessId || normalizeOptionalAgentRuntimeId(harnessId) === "openclaw") return false;
  const providerId = provider.trim().toLowerCase();
  return (
    harnessId === providerId ||
    (harnessId === "copilot" && providerId === "github-copilot") ||
    (harnessId === "codex" && (providerId === "codex" || providerId === "openai"))
  );
}
function isUnsupportedNativeHarnessCompaction(result) {
  return result?.ok === false && result.failure?.reason === "unsupported_harness_compaction";
}
function isBenignCliCompactionNoopReason(reason) {
  const classification = classifyCompactionReason(reason);
  return classification === "below_threshold" || classification === "already_compacted_recently";
}
function isIntentionalNativeAutoCompactionSkip(result) {
  return (
    result?.ok === true &&
    !result.compacted &&
    result.reason === CODEX_APP_SERVER_OWNS_AUTO_COMPACTION_REASON
  );
}
function readAgentIdFromSessionKey(sessionKey) {
  const parts = sessionKey.trim().split(":");
  return parts[0] === "agent" && parts[1]?.trim() ? parts[1].trim() : void 0;
}
function buildCliCompactionRuntimeContext(params) {
  return {
    ...buildEmbeddedCompactionRuntimeContext({
      sessionKey: params.sessionKey,
      messageChannel: params.messageChannel,
      messageProvider: params.messageChannel,
      agentAccountId: params.agentAccountId,
      authProfileId: params.authProfileId,
      workspaceDir: params.workspaceDir,
      cwd: params.cwd,
      agentDir: params.agentDir,
      config: params.cfg,
      skillsSnapshot: params.skillsSnapshot,
      senderIsOwner: params.senderIsOwner,
      provider: params.provider,
      modelId: params.model,
      harnessRuntime: params.harnessRuntime,
      modelSelectionLocked: params.modelSelectionLocked,
      thinkLevel: params.thinkLevel,
      extraSystemPrompt: params.extraSystemPrompt,
    }),
    currentTokenCount: params.currentTokenCount,
    tokenBudget: params.contextTokenBudget,
    trigger: params.trigger,
  };
}
async function resolveCliContextCompactionSuccess(params) {
  const result = params.compactResult.result;
  const resultTarget = result?.sessionTarget;
  const explicitResultSessionId = result?.sessionId ?? resultTarget?.sessionId;
  const resultSessionId = explicitResultSessionId ?? params.sessionId;
  const resultSessionTarget =
    resultTarget && resultSessionId
      ? {
          ...resultTarget,
          sessionId: resultTarget.sessionId ?? resultSessionId,
        }
      : resultTarget;
  if (!resultSessionTarget && !explicitResultSessionId)
    return {
      maintenanceSessionFile: params.sessionFile,
      maintenanceSessionId: params.sessionId,
      ...(result?.tokensAfter !== void 0 ? { tokensAfter: result.tokensAfter } : {}),
    };
  const resolvedTarget = await resolveAgentRunSessionTarget({
    agentId: resultSessionTarget?.agentId ?? readAgentIdFromSessionKey(params.sessionKey),
    config: params.cfg,
    sessionId: resultSessionId,
    sessionKey: resultSessionTarget?.sessionKey ?? params.sessionKey,
    sessionTarget: Object.assign(
      {},
      resultSessionTarget,
      params.storePath && !resultSessionTarget?.storePath ? { storePath: params.storePath } : {},
    ),
  });
  return {
    maintenanceSessionFile: resolvedTarget.sessionFile,
    maintenanceSessionId: resolvedTarget.sessionId,
    successorSessionFile: resolvedTarget.sessionFile,
    successorSessionId: resolvedTarget.sessionId,
    ...(result?.tokensAfter !== void 0 ? { tokensAfter: result.tokensAfter } : {}),
  };
}
async function compactCliTranscript(params) {
  const runtimeContext = buildCliCompactionRuntimeContext({
    sessionKey: params.sessionKey,
    messageChannel: params.messageChannel,
    agentAccountId: params.agentAccountId,
    authProfileId: params.authProfileId,
    workspaceDir: params.workspaceDir,
    cwd: params.cwd,
    agentDir: params.agentDir,
    cfg: params.cfg,
    skillsSnapshot: params.skillsSnapshot,
    senderIsOwner: params.senderIsOwner,
    provider: params.provider,
    model: params.model,
    harnessRuntime: params.harnessRuntime,
    modelSelectionLocked: params.modelSelectionLocked,
    thinkLevel: params.thinkLevel,
    extraSystemPrompt: params.extraSystemPrompt,
    currentTokenCount: params.currentTokenCount,
    contextTokenBudget: params.contextTokenBudget,
    trigger: "cli_budget",
  });
  const runtimeSettings = buildContextEngineRuntimeSettings({
    contextEngineHost: buildGenericCliContextEngineHostSupport({
      backendId: params.provider,
      capabilities: ["compact", "maintain"],
    }),
    provider: params.provider,
    requestedModel: params.model,
    resolvedModel: params.model,
    selectedContextEngineId: params.contextEngine.info.id,
    contextEngineSelectionSource: "configured",
    promptTokenBudget: params.contextTokenBudget,
  });
  let compactResult;
  try {
    compactResult = await compactContextEngineWithSafetyTimeout(
      params.contextEngine,
      {
        sessionId: params.sessionId,
        sessionKey: params.sessionKey || params.sessionId,
        sessionTarget: {
          sessionId: params.sessionId,
          sessionKey: params.sessionKey || params.sessionId,
          ...(params.storePath ? { storePath: params.storePath } : {}),
        },
        tokenBudget: params.contextTokenBudget,
        currentTokenCount: params.currentTokenCount,
        force: true,
        compactionTarget: "budget",
        runtimeContext,
        runtimeSettings,
      },
      resolveCompactionTimeoutMs(params.cfg),
    );
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    if (isBenignCliCompactionNoopReason(reason)) {
      log.info(
        `CLI transcript compaction skipped for ${params.provider}/${params.model}: ${reason}`,
      );
      return { compacted: false };
    }
    log.warn(`CLI transcript compaction failed for ${params.provider}/${params.model}: ${reason}`);
    return {
      compacted: false,
      failureReason: reason,
    };
  }
  if (!compactResult.compacted) {
    const reason = compactResult.reason ?? "nothing to compact";
    if (isBenignCliCompactionNoopReason(reason)) {
      log.info(
        `CLI transcript compaction skipped for ${params.provider}/${params.model}: ${reason}`,
      );
      return { compacted: false };
    }
    log.warn(
      `CLI transcript compaction did not reduce context for ${params.provider}/${params.model}: ${reason}`,
    );
    return {
      compacted: false,
      failureReason: compactResult.reason ?? "compaction did not reduce context",
    };
  }
  const successor = await resolveCliContextCompactionSuccess({
    cfg: params.cfg,
    compactResult,
    sessionFile: params.sessionFile,
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    storePath: params.storePath,
  });
  try {
    await cliCompactionDeps.runContextEngineMaintenance({
      contextEngine: params.contextEngine,
      sessionId: successor.maintenanceSessionId,
      sessionKey: params.sessionKey,
      sessionFile: successor.maintenanceSessionFile,
      reason: "compaction",
      sessionManager: params.sessionManager,
      runtimeContext,
      runtimeSettings,
      config: params.cfg,
    });
  } catch (error) {
    if (!params.bestEffortMaintenance) throw error;
    log.warn(
      `CLI transcript compaction maintenance failed after fallback for ${params.provider}/${params.model}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  return {
    compacted: true,
    ...successor,
  };
}
async function compactNativeHarnessCliTranscript(params) {
  let result;
  try {
    const sessionAgentId = readAgentIdFromSessionKey(params.sessionKey);
    const nativeHarnessId = params.sessionEntry.agentHarnessId?.trim();
    const modelSelectionLocked = params.sessionEntry.modelSelectionLocked === true;
    const authProfileId = params.sessionEntry.authProfileOverride?.trim() || void 0;
    await cliCompactionDeps.ensureSelectedAgentHarnessPlugin({
      provider: params.provider,
      modelId: params.model,
      config: params.cfg,
      sessionKey: params.sessionKey,
      workspaceDir: params.workspaceDir,
      ...(sessionAgentId ? { agentId: sessionAgentId } : {}),
      ...(nativeHarnessId ? { agentHarnessRuntimeOverride: nativeHarnessId } : {}),
    });
    result = await compactWithSafetyTimeout(
      (abortSignal) =>
        cliCompactionDeps.maybeCompactAgentHarnessSession({
          sessionId: params.sessionId,
          sessionKey: params.sessionKey,
          sessionFile: params.sessionFile,
          workspaceDir: params.workspaceDir,
          cwd: params.cwd,
          agentDir: params.agentDir,
          config: params.cfg,
          skillsSnapshot: params.skillsSnapshot,
          provider: params.provider,
          model: params.model,
          authProfileId,
          contextTokenBudget: params.contextTokenBudget,
          currentTokenCount: params.currentTokenCount,
          trigger: "budget",
          force: true,
          messageChannel: params.messageChannel,
          agentAccountId: params.agentAccountId,
          senderIsOwner: params.senderIsOwner,
          thinkLevel: params.thinkLevel,
          extraSystemPrompt: params.extraSystemPrompt,
          modelSelectionLocked,
          allowGatewaySubagentBinding: true,
          ...(params.contextEngine
            ? {
                contextEngine: params.contextEngine,
                contextEngineRuntimeContext: buildCliCompactionRuntimeContext({
                  sessionKey: params.sessionKey,
                  messageChannel: params.messageChannel,
                  agentAccountId: params.agentAccountId,
                  authProfileId,
                  workspaceDir: params.workspaceDir,
                  cwd: params.cwd,
                  agentDir: params.agentDir,
                  cfg: params.cfg,
                  skillsSnapshot: params.skillsSnapshot,
                  senderIsOwner: params.senderIsOwner,
                  provider: params.provider,
                  model: params.model,
                  harnessRuntime: nativeHarnessId,
                  modelSelectionLocked,
                  thinkLevel: params.thinkLevel,
                  extraSystemPrompt: params.extraSystemPrompt,
                  currentTokenCount: params.currentTokenCount,
                  contextTokenBudget: params.contextTokenBudget,
                  trigger: "cli_native_budget",
                }),
              }
            : {}),
          ...(nativeHarnessId ? { agentHarnessId: nativeHarnessId } : {}),
          ...(abortSignal ? { abortSignal } : {}),
        }),
      resolveCompactionTimeoutMs(params.cfg),
    );
  } catch (error) {
    log.warn(
      `CLI native harness compaction failed for ${params.provider}/${params.model}: ${error instanceof Error ? error.message : String(error)}`,
    );
    return {
      compacted: false,
      failureReason: error instanceof Error ? error.message : String(error),
    };
  }
  if (!result?.compacted) {
    const reason = result?.reason ?? "nothing to compact";
    if (isBenignCliCompactionNoopReason(reason)) {
      log.info(
        `CLI native harness compaction skipped for ${params.provider}/${params.model}: ${reason}`,
      );
      return { compacted: false };
    }
    if (isIntentionalNativeAutoCompactionSkip(result)) {
      if (params.sessionEntry.modelSelectionLocked === true) return { compacted: false };
      return {
        compacted: false,
        fallbackToContextEngine: true,
        failureReason: CODEX_APP_SERVER_OWNS_AUTO_COMPACTION_REASON,
      };
    }
    const recoverableBindingFailure = isRecoverableNativeHarnessBindingFailure(result);
    const fallbackToContextEngine =
      params.sessionEntry.modelSelectionLocked !== true &&
      (isUnsupportedNativeHarnessCompaction(result) || recoverableBindingFailure);
    log.warn(
      `CLI native harness compaction did not reduce context for ${params.provider}/${params.model}: ${reason}`,
    );
    return {
      compacted: false,
      fallbackToContextEngine,
      clearCliSessionBinding:
        params.sessionEntry.modelSelectionLocked !== true && recoverableBindingFailure,
      failureReason: result?.reason ?? "native harness compaction did not reduce context",
    };
  }
  return {
    compacted: true,
    result,
  };
}
/** Runs pre-turn compaction for a CLI session and returns the updated session entry. */
async function runCliTurnCompactionLifecycle(params) {
  const sessionFile = params.sessionEntry?.sessionFile;
  const contextTokenBudget = resolvePositiveInteger(params.sessionEntry?.contextTokens);
  if (!sessionFile || !contextTokenBudget) return params.sessionEntry;
  const sessionManager = cliCompactionDeps.openSessionManager(sessionFile);
  const settingsManager = await cliCompactionDeps.createPreparedEmbeddedAgentSettingsManager({
    cwd: params.cwd ?? params.workspaceDir,
    agentDir: params.agentDir,
    cfg: params.cfg,
    contextTokenBudget,
  });
  const preemptiveCompaction = cliCompactionDeps.shouldPreemptivelyCompactBeforePrompt({
    messages: getSessionBranchMessages(sessionManager),
    prompt: "",
    contextTokenBudget,
    reserveTokens: settingsManager.getCompactionReserveTokens(),
    toolResultMaxChars: cliCompactionDeps.resolveLiveToolResultMaxChars({
      contextWindowTokens: contextTokenBudget,
      cfg: params.cfg,
      agentId: params.sessionAgentId,
    }),
  });
  const tokenSnapshot = resolveSessionTokenSnapshot(params.sessionEntry);
  const currentTokenCount = Math.max(
    preemptiveCompaction.estimatedPromptTokens,
    tokenSnapshot ?? 0,
  );
  if (
    !preemptiveCompaction.shouldCompact &&
    currentTokenCount <= preemptiveCompaction.promptBudgetBeforeReserve
  )
    return params.sessionEntry;
  const resolvedBackend = cliCompactionDeps.resolveCliBackendConfig(params.provider, params.cfg);
  const lockedHarnessRuntime = normalizeOptionalAgentRuntimeId(params.sessionEntry?.agentHarnessId);
  if (
    params.sessionEntry?.modelSelectionLocked === true &&
    lockedHarnessRuntime !== "openclaw" &&
    !isNativeHarnessCompactionSession(params.sessionEntry, params.provider)
  )
    throw new Error("CLI compaction cannot replace a model-locked native harness runtime");
  if (
    resolvedBackend?.ownsNativeCompaction &&
    !isNativeHarnessCompactionSession(params.sessionEntry, params.provider)
  ) {
    log.info(`CLI backend "${params.provider}" owns native compaction — deferring to backend`);
    return params.sessionEntry;
  }
  let compacted = false;
  let contextCompactionOutcome;
  let nativeCompactionResult;
  let useContextEngineCompaction = true;
  let nativeFallbackToContextEngine = false;
  let nativeFallbackNeedsBindingClear = false;
  let resolvedContextEngine;
  let autoCompactionGuardApplied = false;
  const authProfileId = params.sessionEntry?.authProfileOverride?.trim() || void 0;
  const applyAutoCompactionGuard = async (contextEngine) => {
    if (autoCompactionGuardApplied) return;
    autoCompactionGuardApplied = true;
    await cliCompactionDeps.applyAgentAutoCompactionGuard({
      settingsManager,
      contextEngineInfo: contextEngine.info,
      compactionMode: resolveEffectiveCompactionMode(params.cfg),
    });
  };
  if (isNativeHarnessCompactionSession(params.sessionEntry, params.provider)) {
    cliCompactionDeps.ensureContextEnginesInitialized();
    resolvedContextEngine = await cliCompactionDeps.resolveContextEngine(params.cfg);
    await applyAutoCompactionGuard(resolvedContextEngine);
    const nativeOutcome = await compactNativeHarnessCliTranscript({
      cfg: params.cfg,
      sessionId: params.sessionId,
      sessionKey: params.sessionKey,
      sessionFile,
      sessionEntry: params.sessionEntry,
      workspaceDir: params.workspaceDir,
      cwd: params.cwd,
      agentDir: params.agentDir,
      provider: params.provider,
      model: params.model,
      contextTokenBudget,
      currentTokenCount,
      contextEngine: resolvedContextEngine,
      skillsSnapshot: params.skillsSnapshot,
      messageChannel: params.messageChannel,
      agentAccountId: params.agentAccountId,
      senderIsOwner: params.senderIsOwner,
      thinkLevel: params.thinkLevel,
      extraSystemPrompt: params.extraSystemPrompt,
    });
    if (nativeOutcome.compacted) {
      compacted = true;
      nativeCompactionResult = nativeOutcome.result;
      useContextEngineCompaction = false;
    } else if (nativeOutcome.fallbackToContextEngine) {
      nativeFallbackToContextEngine = true;
      nativeFallbackNeedsBindingClear = nativeOutcome.clearCliSessionBinding === true;
    } else if (nativeOutcome.failureReason)
      throw new Error(
        `CLI native harness compaction failed for ${params.provider}/${params.model}: ${nativeOutcome.failureReason ?? "compaction did not reduce context"}`,
      );
    else useContextEngineCompaction = false;
  }
  if (useContextEngineCompaction) {
    if (!resolvedContextEngine) {
      cliCompactionDeps.ensureContextEnginesInitialized();
      resolvedContextEngine = await cliCompactionDeps.resolveContextEngine(params.cfg);
    }
    const contextEngine = resolvedContextEngine;
    await applyAutoCompactionGuard(contextEngine);
    const contextOutcome = await compactCliTranscript({
      contextEngine,
      sessionId: params.sessionId,
      sessionKey: params.sessionKey,
      sessionFile,
      sessionManager,
      storePath: params.storePath,
      cfg: params.cfg,
      workspaceDir: params.workspaceDir,
      cwd: params.cwd,
      agentDir: params.agentDir,
      provider: params.provider,
      model: params.model,
      harnessRuntime: params.sessionEntry?.agentHarnessId,
      modelSelectionLocked: params.sessionEntry?.modelSelectionLocked,
      contextTokenBudget,
      currentTokenCount,
      skillsSnapshot: params.skillsSnapshot,
      messageChannel: params.messageChannel,
      agentAccountId: params.agentAccountId,
      authProfileId,
      senderIsOwner: params.senderIsOwner,
      thinkLevel: params.thinkLevel,
      extraSystemPrompt: params.extraSystemPrompt,
      bestEffortMaintenance: nativeFallbackToContextEngine,
    });
    contextCompactionOutcome = contextOutcome;
    compacted = contextOutcome.compacted;
    if (!compacted && contextOutcome.failureReason)
      throw new Error(
        `CLI transcript compaction failed for ${params.provider}/${params.model}: ${contextOutcome.failureReason ?? "compaction did not reduce context"}`,
      );
  }
  if (nativeFallbackNeedsBindingClear && !compacted && params.sessionStore && params.storePath)
    return (
      (await cliCompactionDeps.clearCliSessionInStore({
        provider: params.provider,
        sessionKey: params.sessionKey,
        sessionStore: params.sessionStore,
        storePath: params.storePath,
        expectedSessionId: params.sessionId,
      })) ?? params.sessionEntry
    );
  if (!compacted || !params.sessionStore || !params.storePath) return params.sessionEntry;
  return (
    (await cliCompactionDeps.recordCliCompactionInStore({
      provider: params.provider,
      sessionKey: params.sessionKey,
      sessionStore: params.sessionStore,
      storePath: params.storePath,
      tokensAfter:
        nativeCompactionResult?.result?.tokensAfter ?? contextCompactionOutcome?.tokensAfter,
      newSessionId:
        nativeCompactionResult?.result?.sessionId ?? contextCompactionOutcome?.successorSessionId,
      newSessionFile:
        nativeCompactionResult?.result?.sessionFile ??
        contextCompactionOutcome?.successorSessionFile,
      expectedSessionId: params.sessionId,
    })) ?? params.sessionEntry
  );
}
//#endregion
export { resetCliCompactionTestDeps, runCliTurnCompactionLifecycle, setCliCompactionTestDeps };
