import { a as resolveAgentDir, c as resolveDefaultAgentId } from "./agent-scope-config-DVIR1nBa.js";
import { v as resolveSessionAgentId } from "./agent-scope-y9xQv_q1.js";
import { d as refreshQueuedFollowupSession } from "./cleanup-DDlcY-PM.js";
import { t as resolveModelSelectionFromDirective } from "./directive-handling.model-selection-CqsPD_Nn.js";
import {
  d as applyModelRuntimeDirective,
  f as resolveModelRuntimeDirective,
  l as resolveDirectiveTouchedSessionFields,
  n as enqueueModeSwitchEvents,
  t as canPersistSessionDirectiveDefaults,
} from "./directive-handling.shared-CynZiykl.js";
import { n as applyVerboseOverride, t as applyTraceOverride } from "./level-overrides-DZylhTAo.js";
import "./model-selection-DOlkTrQa.js";
import { i as applyModelOverrideToSessionEntry } from "./model-overrides-BlzAR7Nc.js";
import { r as resolveContextTokens } from "./model-selection-Bv83xYkQ.js";
import { i as modelKey } from "./model-selection-normalize-BoKGJiBx.js";
import "./queue-DBlMyPZt.js";
import { c as resolveContextConfigProviderForRuntime } from "./openai-routing-Cu28Ynzk.js";
import { t as resolveAgentHarnessPolicy } from "./policy-C704eijA.js";
import { t as persistReplySessionEntry } from "./session-entry-persistence-BPeN-I4M.js";
import { t as triggerSessionPatchHook } from "./session-patch-hooks-BiLQgeII.js";
import {
  a as sessionModelOverrideChangesApplied,
  n as adoptPersistedSessionSnapshot,
  o as sessionSnapshotChangesApplied,
} from "./session-snapshot-merge-BUp0DZlF.js";
import { a as enqueueSystemEvent } from "./system-events-CIAdjAwz.js";
import {
  n as isThinkingLevelSupported,
  o as resolveSupportedThinkingLevel,
  t as formatThinkingLevels,
} from "./thinking-CVcRbjTC.js";
import { r as resolveEffectiveAgentRuntime } from "./thinking-runtime-D675lyzz.js";
//#region src/auto-reply/reply/directive-handling.persist.ts
async function persistInlineDirectives(params) {
  const {
    directives,
    cfg,
    sessionEntry,
    sessionStore,
    sessionKey,
    storePath,
    elevatedEnabled,
    elevatedAllowed,
    defaultProvider,
    defaultModel,
    aliasIndex,
    allowedModelKeys,
    initialModelLabel,
    formatModelSwitchEvent,
    agentCfg,
  } = params;
  let { provider, model } = params;
  let thinkingRemap;
  let sessionChangesApplied = true;
  const allowInternalExecPersistence = canPersistSessionDirectiveDefaults({
    messageProvider: params.messageProvider,
    surface: params.surface,
    gatewayClientScopes: params.gatewayClientScopes,
    commandAuthorized: params.commandAuthorized,
    senderIsOwner: params.senderIsOwner,
  });
  const allowInternalVerbosePersistence = canPersistSessionDirectiveDefaults({
    messageProvider: params.messageProvider,
    surface: params.surface,
    gatewayClientScopes: params.gatewayClientScopes,
    commandAuthorized: params.commandAuthorized,
    senderIsOwner: params.senderIsOwner,
  });
  const touchedSessionFields = resolveDirectiveTouchedSessionFields({
    directives,
    allowInternalExecPersistence,
    allowInternalVerbosePersistence,
  });
  const thinkingCatalog =
    params.thinkingCatalog && params.thinkingCatalog.length > 0 ? params.thinkingCatalog : void 0;
  const delegatedTraceAllowed = (params.gatewayClientScopes ?? []).includes("operator.admin");
  const activeAgentId = sessionKey
    ? resolveSessionAgentId({
        sessionKey,
        config: cfg,
      })
    : resolveDefaultAgentId(cfg);
  const agentDir = resolveAgentDir(cfg, activeAgentId) ?? params.agentDir;
  const modelDirective =
    directives.hasModelDirective && params.effectiveModelDirective
      ? params.effectiveModelDirective
      : void 0;
  const modelResolution = modelDirective
    ? resolveModelSelectionFromDirective({
        directives: {
          ...directives,
          hasModelDirective: true,
          rawModelDirective: modelDirective,
        },
        cfg,
        agentDir,
        defaultProvider,
        defaultModel,
        aliasIndex,
        allowedModelKeys,
        allowedModelCatalog: params.modelCatalog ?? [],
        provider,
      })
    : void 0;
  const modelRuntimeResolution = modelResolution?.modelSelection
    ? resolveModelRuntimeDirective({
        rawRuntime: directives.rawModelRuntime,
        provider: modelResolution.modelSelection.provider,
        cfg,
        sessionEntry,
      })
    : { kind: "unchanged" };
  let thinkingErrorText;
  if (directives.hasThinkDirective && directives.thinkLevel) {
    const resolvedProvider = modelResolution?.modelSelection?.provider ?? provider;
    const resolvedModel = modelResolution?.modelSelection?.model ?? model;
    const prospectiveSessionEntry = { ...sessionEntry };
    applyModelRuntimeDirective(prospectiveSessionEntry, modelRuntimeResolution);
    const prospectiveThinkingRuntime = resolveEffectiveAgentRuntime({
      cfg,
      provider: resolvedProvider,
      modelId: resolvedModel,
      agentId: activeAgentId,
      sessionKey,
      sessionEntry: prospectiveSessionEntry,
    });
    if (
      !isThinkingLevelSupported({
        provider: resolvedProvider,
        model: resolvedModel,
        level: directives.thinkLevel,
        catalog: thinkingCatalog,
        agentRuntime: prospectiveThinkingRuntime,
      })
    )
      thinkingErrorText = `Thinking level "${directives.thinkLevel}" is not supported for ${resolvedProvider}/${resolvedModel}. Use one of: ${formatThinkingLevels(resolvedProvider, resolvedModel, ", ", thinkingCatalog, prospectiveThinkingRuntime)}.`;
  }
  const errorText =
    modelResolution?.errorText ??
    (modelRuntimeResolution.kind === "invalid" ? modelRuntimeResolution.errorText : void 0) ??
    thinkingErrorText;
  let modelRuntimeApplied = false;
  if (!errorText && sessionEntry && sessionStore && sessionKey) {
    const initialSessionEntry = { ...sessionEntry };
    let appliedSessionEntry = sessionEntry;
    const prevElevatedLevel =
      sessionEntry.elevatedLevel ?? agentCfg?.elevatedDefault ?? (elevatedAllowed ? "on" : "off");
    const prevReasoningLevel = sessionEntry.reasoningLevel ?? "off";
    let elevatedChanged =
      directives.hasElevatedDirective &&
      directives.elevatedLevel !== void 0 &&
      elevatedEnabled &&
      elevatedAllowed;
    let reasoningChanged = directives.hasReasoningDirective && directives.reasoningLevel !== void 0;
    let updated = false;
    if (directives.clearThinkLevel) {
      if (sessionEntry.thinkingLevel) {
        delete sessionEntry.thinkingLevel;
        updated = true;
      }
    } else if (directives.hasThinkDirective && directives.thinkLevel) {
      sessionEntry.thinkingLevel = directives.thinkLevel;
      updated = true;
    }
    if (directives.clearFastMode) {
      if (sessionEntry.fastMode !== void 0) {
        delete sessionEntry.fastMode;
        updated = true;
      }
    }
    if (
      directives.hasVerboseDirective &&
      directives.verboseLevel &&
      allowInternalVerbosePersistence
    ) {
      applyVerboseOverride(sessionEntry, directives.verboseLevel);
      updated = true;
    }
    if (
      directives.hasTraceDirective &&
      directives.traceLevel &&
      (params.senderIsOwner || delegatedTraceAllowed)
    ) {
      applyTraceOverride(sessionEntry, directives.traceLevel);
      updated = true;
    }
    if (directives.hasReasoningDirective && directives.reasoningLevel) {
      if (directives.reasoningLevel === "off") sessionEntry.reasoningLevel = "off";
      else sessionEntry.reasoningLevel = directives.reasoningLevel;
      reasoningChanged =
        reasoningChanged ||
        (directives.reasoningLevel !== prevReasoningLevel && directives.reasoningLevel !== void 0);
      updated = true;
    }
    if (
      directives.hasElevatedDirective &&
      directives.elevatedLevel &&
      elevatedEnabled &&
      elevatedAllowed
    ) {
      sessionEntry.elevatedLevel = directives.elevatedLevel;
      elevatedChanged =
        elevatedChanged ||
        (directives.elevatedLevel !== prevElevatedLevel && directives.elevatedLevel !== void 0);
      updated = true;
    }
    if (directives.hasExecDirective && directives.hasExecOptions && allowInternalExecPersistence) {
      if (directives.execHost) {
        sessionEntry.execHost = directives.execHost;
        updated = true;
      }
      if (directives.execSecurity) {
        sessionEntry.execSecurity = directives.execSecurity;
        updated = true;
      }
      if (directives.execAsk) {
        sessionEntry.execAsk = directives.execAsk;
        updated = true;
      }
      if (directives.execNode) {
        sessionEntry.execNode = directives.execNode;
        updated = true;
      }
    }
    let modelUpdated = false;
    let modelApplied = true;
    let modelSwitchEvent;
    if (modelDirective && modelResolution?.modelSelection) {
      const appliedModelOverride = applyModelOverrideToSessionEntry({
        entry: sessionEntry,
        selection: modelResolution.modelSelection,
        profileOverride: modelResolution.profileOverride,
        markLiveSwitchPending: params.markLiveSwitchPending,
      });
      const appliedRuntimeOverride = applyModelRuntimeDirective(
        sessionEntry,
        modelRuntimeResolution,
      );
      modelUpdated = appliedModelOverride.updated || appliedRuntimeOverride.updated;
      provider = modelResolution.modelSelection.provider;
      model = modelResolution.modelSelection.model;
      const thinkingRuntime = resolveEffectiveAgentRuntime({
        cfg,
        provider,
        modelId: model,
        agentId: activeAgentId,
        sessionKey,
        sessionEntry,
      });
      const currentThinkingLevel = sessionEntry.thinkingLevel;
      if (
        currentThinkingLevel &&
        !directives.hasThinkDirective &&
        !isThinkingLevelSupported({
          provider,
          model,
          level: currentThinkingLevel,
          catalog: thinkingCatalog,
          agentRuntime: thinkingRuntime,
        })
      ) {
        const remappedThinkingLevel = resolveSupportedThinkingLevel({
          provider,
          model,
          level: currentThinkingLevel,
          catalog: thinkingCatalog,
          agentRuntime: thinkingRuntime,
        });
        if (remappedThinkingLevel !== currentThinkingLevel) {
          sessionEntry.thinkingLevel = remappedThinkingLevel;
          thinkingRemap = {
            from: currentThinkingLevel,
            to: remappedThinkingLevel,
            provider,
            model,
          };
        }
      }
      const nextLabel = `${provider}/${model}`;
      if (nextLabel !== initialModelLabel)
        modelSwitchEvent = {
          label: nextLabel,
          ...(modelResolution.modelSelection.alias
            ? { alias: modelResolution.modelSelection.alias }
            : {}),
        };
      updated = true;
    }
    if (directives.hasQueueDirective && directives.queueReset) {
      delete sessionEntry.queueMode;
      delete sessionEntry.queueDebounceMs;
      delete sessionEntry.queueCap;
      delete sessionEntry.queueDrop;
      updated = true;
    }
    if (updated) {
      sessionEntry.updatedAt = Date.now();
      sessionStore[sessionKey] = sessionEntry;
      if (storePath) {
        const persistence = await persistReplySessionEntry({
          storePath,
          sessionKey,
          initialEntry: initialSessionEntry,
          entry: sessionEntry,
          reassertLiveModelSwitchPending:
            modelUpdated &&
            params.markLiveSwitchPending === true &&
            sessionEntry.liveModelSwitchPending === true,
          touchedFields: touchedSessionFields,
        });
        if (persistence.status === "current") {
          const persistedEntry = persistence.entry;
          sessionStore[sessionKey] = persistedEntry;
          sessionChangesApplied = sessionSnapshotChangesApplied({
            initial: initialSessionEntry,
            next: sessionEntry,
            current: persistedEntry,
            touchedFields: touchedSessionFields,
          });
          if (modelDirective)
            modelApplied =
              sessionChangesApplied &&
              sessionModelOverrideChangesApplied({
                initial: initialSessionEntry,
                next: sessionEntry,
                current: persistedEntry,
                reassertLiveModelSwitchPending:
                  modelUpdated &&
                  params.markLiveSwitchPending === true &&
                  sessionEntry.liveModelSwitchPending === true,
              });
          adoptPersistedSessionSnapshot(sessionEntry, persistedEntry);
          appliedSessionEntry = sessionEntry;
        } else {
          if (persistence.entry) sessionStore[sessionKey] = persistence.entry;
          sessionChangesApplied = false;
          if (modelDirective) modelApplied = false;
        }
      }
      if (modelDirective && !modelApplied) {
        sessionChangesApplied = false;
        const persistedEntry = sessionStore[sessionKey];
        provider = persistedEntry?.providerOverride?.trim() || defaultProvider;
        model = persistedEntry?.modelOverride?.trim() || defaultModel;
        thinkingRemap = void 0;
      }
      if (modelDirective && modelUpdated && modelApplied) {
        triggerSessionPatchHook({
          cfg,
          sessionEntry: appliedSessionEntry,
          sessionKey,
          patch: {
            key: sessionKey,
            model: modelDirective,
          },
        });
        refreshQueuedFollowupSession({
          key: sessionKey,
          nextProvider: provider,
          nextModel: model,
          nextModelOverrideSource: "user",
          nextAuthProfileId: appliedSessionEntry.authProfileOverride,
          nextAuthProfileIdSource: appliedSessionEntry.authProfileOverrideSource,
          nextThinking: {
            level: appliedSessionEntry.thinkingLevel,
            catalog: thinkingCatalog,
            agentRuntime: resolveEffectiveAgentRuntime({
              cfg,
              provider,
              modelId: model,
              agentId: activeAgentId,
              sessionKey,
              sessionEntry: appliedSessionEntry,
            }),
          },
        });
      }
      if (sessionChangesApplied)
        enqueueModeSwitchEvents({
          enqueueSystemEvent,
          sessionEntry: appliedSessionEntry,
          sessionKey,
          elevatedChanged,
          reasoningChanged,
        });
    }
    modelRuntimeApplied =
      modelApplied &&
      (modelRuntimeResolution.kind === "clear" || modelRuntimeResolution.kind === "set");
    if (modelSwitchEvent && modelApplied)
      enqueueSystemEvent(formatModelSwitchEvent(modelSwitchEvent.label, modelSwitchEvent.alias), {
        sessionKey,
        contextKey: `model:${modelSwitchEvent.label}`,
      });
  }
  const selectedCatalogEntry = params.modelCatalog?.find(
    (entry) => modelKey(entry.provider, entry.id) === modelKey(provider, model),
  );
  return {
    provider,
    model,
    thinkingRemap,
    errorText,
    runtimeChange:
      modelRuntimeApplied &&
      (modelRuntimeResolution.kind === "clear" || modelRuntimeResolution.kind === "set")
        ? modelRuntimeResolution
        : void 0,
    sessionChangesApplied,
    contextTokens: resolveContextTokens({
      cfg,
      agentCfg,
      provider: resolveContextConfigProviderForRuntime({
        provider,
        runtimeId: resolveAgentHarnessPolicy({
          provider,
          modelId: model,
          config: cfg,
          agentId: activeAgentId,
          sessionKey,
        }).runtime,
        config: cfg,
      }),
      model,
      modelContextWindow: selectedCatalogEntry?.contextWindow,
      modelContextTokens: selectedCatalogEntry?.contextTokens,
    }),
  };
}
//#endregion
export { persistInlineDirectives };
