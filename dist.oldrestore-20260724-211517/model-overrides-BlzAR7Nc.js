import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/sessions/model-overrides.ts
const MODEL_SELECTION_LOCKED_MESSAGE = "Model selection is locked for this session.";
const MODEL_SELECTION_LOCKED_RESET_MESSAGE =
  "This session cannot be reset while model selection is locked.";
/** Raised when a caller attempts to mutate a locked session model selection. */
var ModelSelectionLockedError = class extends Error {
  constructor(message = MODEL_SELECTION_LOCKED_MESSAGE) {
    super(message);
    this.name = "ModelSelectionLockedError";
  }
};
function isModelSelectionLocked(entry) {
  return entry?.modelSelectionLocked === true;
}
/** Enforces the durable model-selection lock before any session model fields change. */
function assertModelSelectionUnlocked(entry) {
  if (isModelSelectionLocked(entry)) throw new ModelSelectionLockedError();
}
function clearFallbackOrigin(entry) {
  let updated = false;
  if (entry.modelOverrideFallbackOriginProvider !== void 0) {
    delete entry.modelOverrideFallbackOriginProvider;
    updated = true;
  }
  if (entry.modelOverrideFallbackOriginModel !== void 0) {
    delete entry.modelOverrideFallbackOriginModel;
    updated = true;
  }
  return updated;
}
/** Applies a model/auth-profile override to a session entry and clears stale runtime fields. */
function applyModelOverrideToSessionEntry(params) {
  const { entry, selection, profileOverride } = params;
  assertModelSelectionUnlocked(entry);
  const profileOverrideSource = params.profileOverrideSource ?? "user";
  const selectionSource = params.selectionSource ?? "user";
  let updated = false;
  let selectionUpdated = false;
  let profileUpdated = false;
  if (selection.isDefault) {
    if (entry.providerOverride) {
      delete entry.providerOverride;
      updated = true;
      selectionUpdated = true;
    }
    if (entry.modelOverride) {
      delete entry.modelOverride;
      updated = true;
      selectionUpdated = true;
    }
    if (entry.modelOverrideSource) {
      delete entry.modelOverrideSource;
      updated = true;
    }
    updated = clearFallbackOrigin(entry) || updated;
  } else {
    if (entry.providerOverride !== selection.provider) {
      entry.providerOverride = selection.provider;
      updated = true;
      selectionUpdated = true;
    }
    if (entry.modelOverride !== selection.model) {
      entry.modelOverride = selection.model;
      updated = true;
      selectionUpdated = true;
    }
    if (entry.modelOverrideSource !== selectionSource) {
      entry.modelOverrideSource = selectionSource;
      updated = true;
    }
    updated = clearFallbackOrigin(entry) || updated;
  }
  const runtimeModel = normalizeOptionalString(entry.model) ?? "";
  const runtimeProvider = normalizeOptionalString(entry.modelProvider) ?? "";
  const runtimePresent = runtimeModel.length > 0 || runtimeProvider.length > 0;
  const runtimeAligned =
    runtimeModel === selection.model &&
    (runtimeProvider.length === 0 || runtimeProvider === selection.provider);
  if (runtimePresent && (selectionUpdated || !runtimeAligned)) {
    if (entry.model !== void 0) {
      delete entry.model;
      updated = true;
    }
    if (entry.modelProvider !== void 0) {
      delete entry.modelProvider;
      updated = true;
    }
  }
  if (selection.isDefault && runtimePresent && !runtimeAligned) selectionUpdated = true;
  if (entry.contextTokens !== void 0 && (selectionUpdated || (runtimePresent && !runtimeAligned))) {
    delete entry.contextTokens;
    updated = true;
  }
  if (
    entry.contextBudgetStatus !== void 0 &&
    (selectionUpdated || (runtimePresent && !runtimeAligned))
  ) {
    delete entry.contextBudgetStatus;
    updated = true;
  }
  if (profileOverride) {
    if (entry.authProfileOverride !== profileOverride) {
      entry.authProfileOverride = profileOverride;
      updated = true;
      profileUpdated = true;
    }
    if (entry.authProfileOverrideSource !== profileOverrideSource) {
      entry.authProfileOverrideSource = profileOverrideSource;
      updated = true;
      profileUpdated = true;
    }
    if (entry.authProfileOverrideCompactionCount !== void 0) {
      delete entry.authProfileOverrideCompactionCount;
      updated = true;
    }
  } else if (!params.preserveAuthProfileOverride) {
    if (entry.authProfileOverride) {
      delete entry.authProfileOverride;
      updated = true;
      profileUpdated = true;
    }
    if (entry.authProfileOverrideSource) {
      delete entry.authProfileOverrideSource;
      updated = true;
      profileUpdated = true;
    }
    if (entry.authProfileOverrideCompactionCount !== void 0) {
      delete entry.authProfileOverrideCompactionCount;
      updated = true;
    }
  }
  if (updated) {
    if ((selectionUpdated || profileUpdated) && params.markLiveSwitchPending)
      entry.liveModelSwitchPending = true;
    delete entry.fallbackNoticeSelectedModel;
    delete entry.fallbackNoticeActiveModel;
    delete entry.fallbackNoticeReason;
    entry.updatedAt = Date.now();
  }
  return { updated };
}
function wrappedOverrideModel(provider, model) {
  return `${provider}/${model}`;
}
/** Repairs overrides where legacy provider/model fields were stored as provider/model strings. */
function repairProviderWrappedModelOverride(params) {
  const overrideProvider = normalizeOptionalString(params.entry.providerOverride);
  const overrideModel = normalizeOptionalString(params.entry.modelOverride);
  if (!overrideProvider || !overrideModel) return { updated: false };
  const wrappedModel = wrappedOverrideModel(overrideProvider, overrideModel);
  const runtimeProvider = normalizeOptionalString(params.entry.modelProvider);
  const runtimeModel = normalizeOptionalString(params.entry.model);
  if (runtimeProvider && runtimeModel === wrappedModel && runtimeProvider !== overrideProvider)
    return applyModelOverrideToSessionEntry({
      entry: params.entry,
      selection: {
        provider: runtimeProvider,
        model: runtimeModel,
        isDefault:
          runtimeProvider === params.defaultProvider && runtimeModel === params.defaultModel,
      },
      selectionSource: params.entry.modelOverrideSource === "auto" ? "auto" : "user",
    });
  if (params.defaultProvider !== overrideProvider && params.defaultModel === wrappedModel)
    return applyModelOverrideToSessionEntry({
      entry: params.entry,
      selection: {
        provider: params.defaultProvider,
        model: params.defaultModel,
        isDefault: true,
      },
    });
  return { updated: false };
}
//#endregion
export {
  isModelSelectionLocked as a,
  applyModelOverrideToSessionEntry as i,
  MODEL_SELECTION_LOCKED_RESET_MESSAGE as n,
  repairProviderWrappedModelOverride as o,
  ModelSelectionLockedError as r,
  MODEL_SELECTION_LOCKED_MESSAGE as t,
};
