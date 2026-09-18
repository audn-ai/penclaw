import { n as SessionWorkStartInvalidatedError } from "./lifecycle-5_TQ_dr5.js";
import { r as resolveAgentModelFallbackValues } from "./model-input-B7OGjVYg.js";
import { t as modelKey } from "./model-key-BaNhQShd.js";
import { i as applyModelOverrideToSessionEntry } from "./model-overrides-BlzAR7Nc.js";
import {
  n as resolveModelRefFromDirectiveString,
  t as resolveModelDirectiveSelection,
} from "./model-selection-directive-NAZfcRrS.js";
import {
  d as isModelKeyAllowedBySet,
  t as buildAllowedModelSetWithFallbacks,
} from "./model-selection-shared-BliwFXJy.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import {
  a as sessionModelOverrideChangesApplied,
  n as adoptPersistedSessionSnapshot,
  t as SESSION_MODEL_OVERRIDE_TRANSACTION_FIELDS,
} from "./session-snapshot-merge-BUp0DZlF.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/auto-reply/reply/session-reset-model.ts
/** Applies model override tokens embedded in reset/new command text. */
function splitBody(body) {
  const tokens = body.split(/\s+/).filter(Boolean);
  return {
    tokens,
    first: tokens[0],
    second: tokens[1],
    rest: tokens.slice(2),
  };
}
async function loadResetModelCatalog(cfg) {
  const { loadModelCatalog } = await import("./model-catalog-CKXmb4DJ.js");
  return loadModelCatalog({ config: cfg });
}
async function resolveResetFallbackModels(params) {
  if (params.agentId) {
    const { resolveAgentModelFallbacksOverride } = await import("./agent-scope-DfhU1PO5.js");
    const override = resolveAgentModelFallbacksOverride(params.cfg, params.agentId);
    if (override !== void 0) return override;
  }
  return resolveAgentModelFallbackValues(params.cfg.agents?.defaults?.model);
}
async function buildResetAllowedModelKeys(params) {
  if (
    Object.keys(params.cfg.agents?.defaults?.models ?? {}).length > 0 ||
    params.cfg.models?.providers
  )
    return buildAllowedModelSetWithFallbacks(params).allowedKeys;
  const allowedKeys = /* @__PURE__ */ new Set();
  for (const entry of params.catalog) allowedKeys.add(modelKey(entry.provider, entry.id));
  const defaultModel = params.defaultModel?.trim();
  if (defaultModel)
    allowedKeys.add(modelKey(normalizeProviderId(params.defaultProvider), defaultModel));
  return allowedKeys;
}
function buildSelectionFromExplicit(params) {
  const resolved = resolveModelRefFromDirectiveString({
    raw: params.raw,
    defaultProvider: params.defaultProvider,
    aliasIndex: params.aliasIndex,
  });
  if (!resolved) return;
  const key = modelKey(resolved.ref.provider, resolved.ref.model);
  if (params.allowedModelKeys.size > 0 && !isModelKeyAllowedBySet(params.allowedModelKeys, key))
    return;
  const isDefault =
    resolved.ref.provider === params.defaultProvider && resolved.ref.model === params.defaultModel;
  return {
    provider: resolved.ref.provider,
    model: resolved.ref.model,
    isDefault,
    ...(resolved.alias ? { alias: resolved.alias } : void 0),
  };
}
async function applySelectionToSession(params) {
  const { selection, sessionEntryHandle, sessionStore, sessionKey, storePath } = params;
  const sessionEntry = sessionEntryHandle?.getCurrent() ?? params.sessionEntry;
  if (!sessionEntry || !sessionKey) return true;
  const initialSessionEntry = { ...sessionEntry };
  const nextSessionEntry = { ...sessionEntry };
  applyModelOverrideToSessionEntry({
    entry: nextSessionEntry,
    selection,
  });
  let appliedEntry = nextSessionEntry;
  let selectionApplied = true;
  if (storePath) {
    const { persistReplySessionEntry } = await import("./session-entry-persistence-B6nrieVT.js");
    const persistence = await persistReplySessionEntry({
      storePath,
      sessionKey,
      initialEntry: initialSessionEntry,
      entry: nextSessionEntry,
      touchedFields: SESSION_MODEL_OVERRIDE_TRANSACTION_FIELDS,
    });
    if (persistence.status === "lifecycle-invalidated")
      throw new SessionWorkStartInvalidatedError(persistence.error);
    const persistedEntry = persistence.entry;
    appliedEntry = persistedEntry;
    selectionApplied = sessionModelOverrideChangesApplied({
      initial: initialSessionEntry,
      next: nextSessionEntry,
      current: persistedEntry,
    });
  }
  adoptPersistedSessionSnapshot(sessionEntry, appliedEntry);
  if (sessionEntryHandle) sessionEntryHandle.replaceCurrent(sessionEntry);
  else if (sessionStore) sessionStore[sessionKey] = sessionEntry;
  return selectionApplied;
}
/** Applies a model override embedded in a reset command body. */
/** Applies a valid reset model override to session state and returns the cleaned body. */
async function applyResetModelOverride(params) {
  if (!params.resetTriggered) return {};
  const rawBody = normalizeOptionalString(params.bodyStripped);
  if (!rawBody) return {};
  const { tokens, first, second } = splitBody(rawBody);
  if (!first) return {};
  const catalog = params.modelCatalog ?? (await loadResetModelCatalog(params.cfg));
  const allowedModelKeys = await buildResetAllowedModelKeys({
    cfg: params.cfg,
    catalog,
    defaultProvider: params.defaultProvider,
    defaultModel: params.defaultModel,
    fallbackModels: await resolveResetFallbackModels({
      cfg: params.cfg,
      agentId: params.agentId,
    }),
  });
  if (allowedModelKeys.size === 0) return {};
  const providers = /* @__PURE__ */ new Set();
  for (const key of allowedModelKeys) {
    const slash = key.indexOf("/");
    if (slash <= 0) continue;
    providers.add(normalizeProviderId(key.slice(0, slash)));
  }
  const resolveSelection = (raw) =>
    resolveModelDirectiveSelection({
      raw,
      defaultProvider: params.defaultProvider,
      defaultModel: params.defaultModel,
      aliasIndex: params.aliasIndex,
      allowedModelKeys,
    });
  let selection;
  let consumed = 0;
  if (providers.has(normalizeProviderId(first)) && second) {
    const resolved = resolveSelection(`${normalizeProviderId(first)}/${second}`);
    if (resolved.selection) {
      selection = resolved.selection;
      consumed = 2;
    }
  }
  if (!selection) {
    selection = buildSelectionFromExplicit({
      raw: first,
      defaultProvider: params.defaultProvider,
      defaultModel: params.defaultModel,
      aliasIndex: params.aliasIndex,
      allowedModelKeys,
    });
    if (selection) consumed = 1;
  }
  if (!selection) {
    const resolved = resolveSelection(first);
    if (providers.has(normalizeProviderId(first)) || first.trim().length >= 6) {
      selection = resolved.selection;
      if (selection) consumed = 1;
    }
  }
  if (!selection) return {};
  const cleanedBody = tokens.slice(consumed).join(" ").trim();
  params.sessionCtx.BodyStripped = cleanedBody;
  params.sessionCtx.BodyForCommands = cleanedBody;
  return {
    selection: (await applySelectionToSession({
      selection,
      sessionEntry: params.sessionEntry,
      sessionEntryHandle: params.sessionEntryHandle,
      sessionStore: params.sessionStore,
      sessionKey: params.sessionKey,
      storePath: params.storePath,
    }))
      ? selection
      : void 0,
    cleanedBody,
  };
}
//#endregion
export { applyResetModelOverride };
