import { r as resolveAgentConfig } from "./agent-scope-config-DVIR1nBa.js";
import { i as hasLegacyAutoFallbackWithoutOrigin } from "./agent-scope-y9xQv_q1.js";
import { o as resolveContextTokensForModel } from "./context-D1brGGkh.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { n as SessionWorkStartInvalidatedError } from "./lifecycle-5_TQ_dr5.js";
import "./defaults-CdX9UGcX.js";
import { i as applyModelOverrideToSessionEntry } from "./model-overrides-BlzAR7Nc.js";
import {
  d as resolveReasoningDefault,
  i as normalizeStoredOverrideModel,
  l as resolvePersistedOverrideModelRef,
} from "./model-selection-DOlkTrQa.js";
import {
  a as normalizeModelRef,
  i as modelKey,
  o as normalizeProviderId,
  r as legacyModelKey,
} from "./model-selection-normalize-BoKGJiBx.js";
import {
  m as parseConfiguredModelVisibilityEntries,
  r as buildConfiguredModelCatalog,
} from "./model-selection-shared-BliwFXJy.js";
import { t as resolveThinkingDefault } from "./model-thinking-default-C_eCEq4B.js";
import {
  n as createModelVisibilityPolicy,
  t as RUNTIME_MODEL_VISIBILITY_NORMALIZATION,
} from "./model-visibility-policy-BqHiELXR.js";
import { a as listOpenAIAuthProfileProvidersForAgentRuntime } from "./openai-routing-Cu28Ynzk.js";
import { n as isStoredCredentialCompatibleWithAuthProvider } from "./order-BNCpk81x.js";
import { t as resolveAgentHarnessPolicy } from "./policy-C704eijA.js";
import { t as clearSessionAuthProfileOverride } from "./session-override-vEd0_Hdb.js";
import {
  a as sessionModelOverrideChangesApplied,
  n as adoptPersistedSessionSnapshot,
} from "./session-snapshot-merge-BUp0DZlF.js";
import {
  n as resolveStoredModelOverride,
  t as isStaleHeartbeatAutoFallbackOverride,
} from "./stored-model-override-C_kkI27o.js";
import { s as normalizeThinkLevel } from "./thinking.shared-BWnbgBUO.js";
import "./model-selection-directive-NAZfcRrS.js";
//#region src/auto-reply/reply/model-selection.ts
/** Model selection state for reply runs, including catalog and override handling. */
function resolveConfiguredModelThinkingDefault(raw) {
  if (raw === false || raw === "disabled" || raw === "none") return "off";
  return typeof raw === "string" ? normalizeThinkLevel(raw) : void 0;
}
/** Creates minimal model-selection state for fast test mode. */
function createFastTestModelSelectionState(params) {
  return {
    provider: params.provider,
    model: params.model,
    allowedModelKeys: /* @__PURE__ */ new Set(),
    allowedModelCatalog: [],
    resetModelOverride: false,
    resetModelOverrideRef: void 0,
    resetModelOverrideReason: void 0,
    resolveThinkingCatalog: async () => [],
    resolveDefaultThinkingLevel: async () => params.agentCfg?.thinkingDefault,
    hasConfiguredThinkingDefault: params.agentCfg?.thinkingDefault !== void 0,
    resolveDefaultReasoningLevel: async () => "off",
    needsModelCatalog: false,
    modelContextWindow: void 0,
    modelContextTokens: void 0,
  };
}
function shouldLogModelSelectionTiming() {
  return process.env.OPENCLAW_DEBUG_INGRESS_TIMING === "1";
}
const modelCatalogRuntimeLoader = createLazyImportLoader(
  () => import("./agents/model-catalog.runtime.js"),
);
const sessionPersistenceRuntimeLoader = createLazyImportLoader(
  () => import("./session-entry-persistence-B6nrieVT.js"),
);
function normalizeRuntimeModelRef(provider, model) {
  return normalizeModelRef(provider, model, RUNTIME_MODEL_VISIBILITY_NORMALIZATION);
}
function loadModelCatalogRuntime() {
  return modelCatalogRuntimeLoader.load();
}
function loadSessionPersistenceRuntime() {
  return sessionPersistenceRuntimeLoader.load();
}
function findSelectedCatalogEntry(params) {
  const selectedKey = modelKey(normalizeProviderId(params.provider), params.model);
  return params.catalog?.find((entry) => modelKey(entry.provider, entry.id) === selectedKey);
}
/** Resolves provider/model, allowlist, catalog, and thinking defaults for a reply run. */
async function createModelSelectionState(params) {
  const timingEnabled = shouldLogModelSelectionTiming();
  const startMs = timingEnabled ? Date.now() : 0;
  const logStage = (stage, extra) => {
    if (!timingEnabled) return;
    const suffix = extra ? ` ${extra}` : "";
    console.log(
      `[model-selection] session=${params.sessionKey ?? "(no-session)"} stage=${stage} elapsedMs=${Date.now() - startMs}${suffix}`,
    );
  };
  const {
    cfg,
    agentCfg,
    sessionEntry,
    sessionStore,
    sessionKey,
    parentSessionKey,
    storePath,
    defaultProvider,
    defaultModel,
  } = params;
  let provider = params.provider;
  let model = params.model;
  const primaryProvider = params.primaryProvider ?? defaultProvider;
  const primaryModel = params.primaryModel ?? defaultModel;
  const hasOneTurnModelOverride = params.hasOneTurnModelOverride === true;
  const hasAllowlist = agentCfg?.models && Object.keys(agentCfg.models).length > 0;
  const visibility = parseConfiguredModelVisibilityEntries({ cfg });
  const defaultProviderVisibleByWildcard = visibility.providerWildcards.has(
    normalizeProviderId(defaultProvider),
  );
  const configuredModelCatalog = buildConfiguredModelCatalog({ cfg });
  const needsModelCatalog =
    params.hasModelDirective ||
    Boolean(
      hasAllowlist && visibility.providerWildcards.size > 0 && !defaultProviderVisibleByWildcard,
    );
  let allowedModelKeys = /* @__PURE__ */ new Set();
  let allowedModelCatalog = configuredModelCatalog;
  let visibilityPolicy = createModelVisibilityPolicy({
    cfg,
    catalog: configuredModelCatalog,
    defaultProvider,
    defaultModel,
    agentId: params.agentId,
    ...RUNTIME_MODEL_VISIBILITY_NORMALIZATION,
  });
  let modelCatalog = null;
  let resetModelOverride = false;
  let resetModelOverrideRef;
  let resetModelOverrideReason;
  const agentEntry = params.agentId ? resolveAgentConfig(cfg, params.agentId) : void 0;
  const normalizedDirectStoredOverride = normalizeStoredOverrideModel({
    providerOverride: sessionEntry?.providerOverride,
    modelOverride: sessionEntry?.modelOverride,
  });
  const directStoredOverride = resolvePersistedOverrideModelRef({
    defaultProvider,
    overrideProvider: normalizedDirectStoredOverride.providerOverride,
    overrideModel: normalizedDirectStoredOverride.modelOverride,
  });
  const directStoredModelOverride = directStoredOverride
    ? {
        ...directStoredOverride,
        source: "session",
      }
    : null;
  const staleHeartbeatAutoFallbackOverride = isStaleHeartbeatAutoFallbackOverride({
    isHeartbeat: params.isHeartbeat,
    hasResolvedHeartbeatModelOverride: params.hasResolvedHeartbeatModelOverride,
    sessionEntry,
    storedOverride: directStoredModelOverride,
    defaultProvider,
    defaultModel,
    primaryProvider: params.primaryProvider,
    primaryModel: params.primaryModel,
  });
  const primaryHarnessPolicy = resolveAgentHarnessPolicy({
    provider: primaryProvider,
    modelId: primaryModel,
    config: cfg,
    agentId: params.agentId,
    sessionKey,
  });
  const staleLegacyOpenAICodexAutoOverride =
    directStoredModelOverride?.source === "session" &&
    sessionEntry?.modelOverrideSource === "auto" &&
    normalizeProviderId(directStoredModelOverride.provider ?? "") === "openai" &&
    normalizeProviderId(primaryProvider) === "openai" &&
    primaryHarnessPolicy.runtime === "codex" &&
    normalizeRuntimeModelRef("openai", directStoredModelOverride.model).model ===
      normalizeRuntimeModelRef("openai", primaryModel).model;
  const normalizedCurrentSelection = normalizeRuntimeModelRef(provider, model);
  const normalizedDirectOverride = directStoredModelOverride
    ? normalizeRuntimeModelRef(directStoredModelOverride.provider, directStoredModelOverride.model)
    : null;
  const staleLegacyAutoFallbackWithoutOrigin =
    directStoredModelOverride?.source === "session" &&
    hasLegacyAutoFallbackWithoutOrigin(sessionEntry) &&
    normalizedDirectOverride !== null &&
    modelKey(normalizedCurrentSelection.provider, normalizedCurrentSelection.model) !==
      modelKey(normalizedDirectOverride.provider, normalizedDirectOverride.model);
  const staleDirectStoredOverride =
    staleHeartbeatAutoFallbackOverride ||
    staleLegacyOpenAICodexAutoOverride ||
    staleLegacyAutoFallbackWithoutOrigin;
  if (needsModelCatalog) {
    modelCatalog = await (await loadModelCatalogRuntime()).loadModelCatalog({ config: cfg });
    logStage("catalog-loaded", `entries=${modelCatalog.length}`);
    visibilityPolicy = createModelVisibilityPolicy({
      cfg,
      catalog: modelCatalog,
      defaultProvider,
      defaultModel,
      agentId: params.agentId,
      ...RUNTIME_MODEL_VISIBILITY_NORMALIZATION,
    });
    allowedModelCatalog = visibilityPolicy.allowedCatalog;
    allowedModelKeys = visibilityPolicy.allowedKeys;
    logStage(
      "allowlist-built",
      `allowed=${allowedModelCatalog.length} keys=${allowedModelKeys.size}`,
    );
  } else if (hasAllowlist) {
    visibilityPolicy = createModelVisibilityPolicy({
      cfg,
      catalog: configuredModelCatalog,
      defaultProvider,
      defaultModel,
      agentId: params.agentId,
      ...RUNTIME_MODEL_VISIBILITY_NORMALIZATION,
    });
    allowedModelCatalog = visibilityPolicy.allowedCatalog;
    allowedModelKeys = visibilityPolicy.allowedKeys;
    logStage(
      "configured-allowlist-built",
      `allowed=${allowedModelCatalog.length} keys=${allowedModelKeys.size}`,
    );
  } else if (configuredModelCatalog.length > 0)
    logStage("configured-catalog-ready", `entries=${configuredModelCatalog.length}`);
  if (
    sessionEntry &&
    sessionStore &&
    sessionKey &&
    directStoredOverride &&
    !hasOneTurnModelOverride
  ) {
    const normalizedOverride = normalizeRuntimeModelRef(
      directStoredOverride.provider,
      directStoredOverride.model,
    );
    const key = modelKey(normalizedOverride.provider, normalizedOverride.model);
    if (staleDirectStoredOverride || !visibilityPolicy.allowsKey(key)) {
      const initialSessionEntry = { ...sessionEntry };
      const nextSessionEntry = { ...sessionEntry };
      const { updated } = applyModelOverrideToSessionEntry({
        entry: nextSessionEntry,
        selection: {
          provider: primaryProvider,
          model: primaryModel,
          isDefault: true,
        },
        preserveAuthProfileOverride: staleDirectStoredOverride,
      });
      let resetApplied = updated;
      if (updated) {
        if (storePath) {
          const { persistReplySessionEntry } = await loadSessionPersistenceRuntime();
          const persistence = await persistReplySessionEntry({
            storePath,
            sessionKey,
            initialEntry: initialSessionEntry,
            entry: nextSessionEntry,
          });
          if (persistence.status === "lifecycle-invalidated")
            throw new SessionWorkStartInvalidatedError(persistence.error);
          const persistedEntry = persistence.entry;
          resetApplied = sessionModelOverrideChangesApplied({
            initial: initialSessionEntry,
            next: nextSessionEntry,
            current: persistedEntry,
          });
          adoptPersistedSessionSnapshot(sessionEntry, persistedEntry);
        } else adoptPersistedSessionSnapshot(sessionEntry, nextSessionEntry);
        sessionStore[sessionKey] = sessionEntry;
      }
      resetModelOverride = resetApplied;
      if (resetApplied) {
        resetModelOverrideRef = key;
        resetModelOverrideReason = staleDirectStoredOverride ? "stale" : "disallowed";
      }
    }
  }
  if (staleDirectStoredOverride) {
    if (
      modelKey(normalizedCurrentSelection.provider, normalizedCurrentSelection.model) ===
      (normalizedDirectOverride
        ? modelKey(normalizedDirectOverride.provider, normalizedDirectOverride.model)
        : void 0)
    ) {
      provider = primaryProvider;
      model = primaryModel;
    }
  }
  const storedOverride = resolveStoredModelOverride({
    sessionEntry,
    sessionStore,
    sessionKey,
    parentSessionKey,
    defaultProvider,
  });
  const skipStoredOverride =
    params.skipStoredModelOverride === true ||
    hasOneTurnModelOverride ||
    params.hasResolvedHeartbeatModelOverride === true ||
    (resetModelOverride && staleDirectStoredOverride && storedOverride?.source === "session");
  if (storedOverride?.model && !skipStoredOverride) {
    const normalizedStoredOverride = normalizeRuntimeModelRef(
      storedOverride.provider || defaultProvider,
      storedOverride.model,
    );
    const key = modelKey(normalizedStoredOverride.provider, normalizedStoredOverride.model);
    if (visibilityPolicy.allowsKey(key)) {
      provider = normalizedStoredOverride.provider;
      model = normalizedStoredOverride.model;
    }
  }
  if (!params.hasModelDirective && !hasOneTurnModelOverride) {
    const allowedInitialSelection = visibilityPolicy.resolveSelection({
      provider,
      model,
    });
    if (!allowedInitialSelection)
      throw new Error(
        `Configured default model "${modelKey(provider, model)}" is not allowed by agents.defaults.models, and no allowed model is available.`,
      );
    provider = allowedInitialSelection.provider;
    model = allowedInitialSelection.model;
  }
  if (
    !params.skipStoredModelOverride &&
    sessionEntry &&
    sessionStore &&
    sessionKey &&
    sessionEntry.authProfileOverride
  ) {
    const { ensureAuthProfileStore } = await import("./agents/auth-profiles.runtime.js");
    const store = ensureAuthProfileStore(void 0, { allowKeychainPrompt: false });
    logStage("auth-profile-store-loaded", `profiles=${Object.keys(store.profiles).length}`);
    const profile = store.profiles[sessionEntry.authProfileOverride];
    const harnessPolicy = resolveAgentHarnessPolicy({
      provider,
      modelId: model,
      config: cfg,
      agentId: params.agentId,
      sessionKey,
    });
    const acceptedAuthProviders = listOpenAIAuthProfileProvidersForAgentRuntime({
      provider,
      harnessRuntime: harnessPolicy.runtime,
      config: cfg,
    }).map(normalizeProviderId);
    if (
      !(
        profile != null &&
        acceptedAuthProviders.some((accepted) =>
          isStoredCredentialCompatibleWithAuthProvider({
            cfg,
            provider: accepted,
            credential: profile,
          }),
        )
      )
    )
      await clearSessionAuthProfileOverride({
        sessionEntry,
        sessionStore,
        sessionKey,
        storePath,
      });
  }
  let thinkingCatalog;
  let manifestModelCatalog = null;
  const buildThinkingCatalog = (catalog) =>
    createModelVisibilityPolicy({
      cfg,
      catalog,
      defaultProvider,
      defaultModel,
      agentId: params.agentId,
      ...RUNTIME_MODEL_VISIBILITY_NORMALIZATION,
    }).allowedCatalog;
  const loadManifestCatalog = async () => {
    if (manifestModelCatalog) return manifestModelCatalog;
    const { loadManifestModelCatalog } = await loadModelCatalogRuntime();
    manifestModelCatalog = loadManifestModelCatalog({
      config: cfg,
      fallbackToMetadataScan: false,
    });
    logStage("manifest-catalog-loaded", `entries=${manifestModelCatalog.length}`);
    return manifestModelCatalog;
  };
  const resolveThinkingCatalog = async () => {
    if (thinkingCatalog) return thinkingCatalog;
    let catalogForThinking =
      allowedModelCatalog.length > 0
        ? allowedModelCatalog
        : modelCatalog && modelCatalog.length > 0
          ? buildThinkingCatalog(modelCatalog)
          : [];
    let selectedCatalogEntry = findSelectedCatalogEntry({
      catalog: catalogForThinking,
      provider,
      model,
    });
    if (!modelCatalog && selectedCatalogEntry?.reasoning === void 0) {
      const manifestCatalog = buildThinkingCatalog(await loadManifestCatalog());
      const manifestSelectedEntry = findSelectedCatalogEntry({
        catalog: manifestCatalog,
        provider,
        model,
      });
      if (manifestSelectedEntry?.reasoning !== void 0) {
        catalogForThinking = manifestCatalog;
        selectedCatalogEntry = manifestSelectedEntry;
      }
    }
    if (!modelCatalog && (!selectedCatalogEntry || selectedCatalogEntry.reasoning === void 0)) {
      modelCatalog = await (await loadModelCatalogRuntime()).loadModelCatalog({ config: cfg });
      logStage("catalog-loaded-for-thinking", `entries=${modelCatalog.length}`);
      const runtimeCatalog = buildThinkingCatalog(modelCatalog);
      catalogForThinking =
        findSelectedCatalogEntry({
          catalog: runtimeCatalog,
          provider,
          model,
        }) ||
        !catalogForThinking ||
        catalogForThinking.length === 0
          ? runtimeCatalog.length > 0
            ? runtimeCatalog
            : allowedModelCatalog
          : allowedModelCatalog;
    }
    thinkingCatalog = catalogForThinking.length > 0 ? catalogForThinking : void 0;
    return thinkingCatalog;
  };
  const defaultThinkingLevels = /* @__PURE__ */ new Map();
  const resolveDefaultThinkingLevel = async (selection) => {
    const selectedProvider = selection?.provider ?? provider;
    const selectedModel = selection?.model ?? model;
    const cacheKey = `${modelKey(selectedProvider, selectedModel)}\0${selection?.agentRuntime ?? ""}`;
    const cached = defaultThinkingLevels.get(cacheKey);
    if (cached) return cached;
    const agentThinkingDefault = agentEntry?.thinkingDefault;
    if (agentThinkingDefault) {
      defaultThinkingLevels.set(cacheKey, agentThinkingDefault);
      return agentThinkingDefault;
    }
    const configuredModels = cfg.agents?.defaults?.models;
    const canonicalKey = modelKey(selectedProvider, selectedModel);
    const legacyKey = legacyModelKey(selectedProvider, selectedModel);
    const resolvedConfiguredModelThinkingDefault = resolveConfiguredModelThinkingDefault(
      configuredModels?.[canonicalKey]?.params?.thinking ??
        (legacyKey ? configuredModels?.[legacyKey]?.params?.thinking : void 0),
    );
    if (resolvedConfiguredModelThinkingDefault) {
      defaultThinkingLevels.set(cacheKey, resolvedConfiguredModelThinkingDefault);
      return resolvedConfiguredModelThinkingDefault;
    }
    const configuredThinkingDefault = agentCfg?.thinkingDefault;
    if (configuredThinkingDefault) {
      defaultThinkingLevels.set(cacheKey, configuredThinkingDefault);
      return configuredThinkingDefault;
    }
    const catalogForThinking = await resolveThinkingCatalog();
    const defaultThinkingLevel =
      resolveThinkingDefault({
        cfg,
        provider: selectedProvider,
        model: selectedModel,
        catalog: catalogForThinking,
        agentRuntime: selection?.agentRuntime,
      }) ?? "off";
    defaultThinkingLevels.set(cacheKey, defaultThinkingLevel);
    return defaultThinkingLevel;
  };
  let defaultReasoningLevel;
  const resolveDefaultReasoningLevel = async () => {
    if (defaultReasoningLevel) return defaultReasoningLevel;
    let catalogForReasoning = modelCatalog ?? allowedModelCatalog;
    let selectedReasoningEntry = findSelectedCatalogEntry({
      catalog: catalogForReasoning,
      provider,
      model,
    });
    if (!modelCatalog && selectedReasoningEntry?.reasoning === void 0) {
      const manifestCatalog = await loadManifestCatalog();
      const manifestReasoningCatalog = hasAllowlist
        ? buildThinkingCatalog(manifestCatalog)
        : manifestCatalog;
      const manifestSelectedEntry = findSelectedCatalogEntry({
        catalog: manifestReasoningCatalog,
        provider,
        model,
      });
      if (manifestSelectedEntry?.reasoning !== void 0) {
        catalogForReasoning = manifestReasoningCatalog;
        selectedReasoningEntry = manifestSelectedEntry;
      }
    }
    if (
      (!catalogForReasoning || catalogForReasoning.length === 0) &&
      selectedReasoningEntry?.reasoning === void 0
    ) {
      modelCatalog = await (await loadModelCatalogRuntime()).loadModelCatalog({ config: cfg });
      logStage("catalog-loaded-for-reasoning", `entries=${modelCatalog.length}`);
      catalogForReasoning = modelCatalog;
    }
    defaultReasoningLevel = resolveReasoningDefault({
      provider,
      model,
      catalog: catalogForReasoning,
    });
    return defaultReasoningLevel;
  };
  const selectedCatalogEntry = findSelectedCatalogEntry({
    catalog: modelCatalog ?? allowedModelCatalog,
    provider,
    model,
  });
  const configuredModels = cfg.agents?.defaults?.models;
  const canonicalKey = modelKey(provider, model);
  const legacyKey = legacyModelKey(provider, model);
  const configuredModelThinkingDefault =
    configuredModels?.[canonicalKey]?.params?.thinking ??
    (legacyKey ? configuredModels?.[legacyKey]?.params?.thinking : void 0);
  const hasConfiguredThinkingDefault =
    agentEntry?.thinkingDefault !== void 0 ||
    resolveConfiguredModelThinkingDefault(configuredModelThinkingDefault) !== void 0 ||
    agentCfg?.thinkingDefault !== void 0;
  return {
    provider,
    model,
    allowedModelKeys,
    allowedModelCatalog,
    resetModelOverride,
    resetModelOverrideRef,
    resetModelOverrideReason,
    resolveThinkingCatalog,
    resolveDefaultThinkingLevel,
    hasConfiguredThinkingDefault,
    resolveDefaultReasoningLevel,
    needsModelCatalog,
    modelContextWindow: selectedCatalogEntry?.contextWindow,
    modelContextTokens: selectedCatalogEntry?.contextTokens,
  };
}
/** Resolves the context window token count for the selected provider/model. */
function resolveContextTokens(params) {
  const modelContextTokens = resolveContextTokensForModel({
    cfg: params.cfg,
    provider: params.provider,
    model: params.model,
    modelContextWindow: params.modelContextWindow,
    modelContextTokens: params.modelContextTokens,
    allowAsyncLoad: false,
  });
  const agentContextTokens =
    typeof params.agentCfg?.contextTokens === "number" && params.agentCfg.contextTokens > 0
      ? Math.floor(params.agentCfg.contextTokens)
      : void 0;
  if (agentContextTokens !== void 0)
    return modelContextTokens !== void 0
      ? Math.min(agentContextTokens, modelContextTokens)
      : agentContextTokens;
  return modelContextTokens ?? 2e5;
}
//#endregion
export {
  createModelSelectionState as n,
  resolveContextTokens as r,
  createFastTestModelSelectionState as t,
};
