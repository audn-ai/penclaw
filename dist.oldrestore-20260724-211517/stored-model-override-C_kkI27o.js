import { T as hasSessionAutoModelFallbackProvenance } from "./agent-scope-y9xQv_q1.js";
import {
  i as normalizeStoredOverrideModel,
  l as resolvePersistedOverrideModelRef,
} from "./model-selection-DOlkTrQa.js";
import { a as normalizeModelRef, i as modelKey } from "./model-selection-normalize-BoKGJiBx.js";
import { W as resolveSessionParentSessionKey } from "./store-CzZJhTF6.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/auto-reply/reply/stored-model-override.ts
function resolveParentSessionKeyCandidate(params) {
  const explicit = normalizeOptionalString(params.parentSessionKey);
  if (explicit && explicit !== params.sessionKey) return explicit;
  const derived = resolveSessionParentSessionKey(params.sessionKey);
  if (derived && derived !== params.sessionKey) return derived;
  return null;
}
/** Resolves the persisted model override visible to the current session. */
function resolveStoredModelOverride(params) {
  const directOverride = normalizeStoredOverrideModel({
    providerOverride: params.sessionEntry?.providerOverride,
    modelOverride: params.sessionEntry?.modelOverride,
  });
  const direct = resolvePersistedOverrideModelRef({
    defaultProvider: params.defaultProvider,
    overrideProvider: directOverride.providerOverride,
    overrideModel: directOverride.modelOverride,
  });
  if (direct)
    return {
      ...direct,
      source: "session",
    };
  const parentKey = resolveParentSessionKeyCandidate({
    sessionKey: params.sessionKey,
    parentSessionKey: params.parentSessionKey,
  });
  if (!parentKey) return null;
  const parentEntry = params.loadSessionEntry?.(parentKey) ?? params.sessionStore?.[parentKey];
  const normalizedParentOverride = normalizeStoredOverrideModel({
    providerOverride: parentEntry?.providerOverride,
    modelOverride: parentEntry?.modelOverride,
  });
  const parentOverride = resolvePersistedOverrideModelRef({
    defaultProvider: params.defaultProvider,
    overrideProvider: normalizedParentOverride.providerOverride,
    overrideModel: normalizedParentOverride.modelOverride,
  });
  if (!parentOverride) return null;
  return {
    ...parentOverride,
    source: "parent",
  };
}
function resolveModelRefKey(params) {
  const normalizedOverride = normalizeStoredOverrideModel({
    providerOverride: params.overrideProvider,
    modelOverride: params.overrideModel,
  });
  const ref = resolvePersistedOverrideModelRef({
    defaultProvider: params.defaultProvider,
    overrideProvider: normalizedOverride.providerOverride,
    overrideModel: normalizedOverride.modelOverride,
  });
  if (!ref) return null;
  const normalizedRef = normalizeModelRef(ref.provider, ref.model);
  return modelKey(normalizedRef.provider, normalizedRef.model);
}
/** Detects heartbeat auto-fallback overrides that no longer match the primary model. */
function isStaleHeartbeatAutoFallbackOverride(params) {
  if (params.isHeartbeat !== true || params.hasResolvedHeartbeatModelOverride === true)
    return false;
  if (params.storedOverride?.source !== "session") return false;
  const entry = params.sessionEntry;
  const recoveredAutoFallbackOverride =
    entry !== void 0 &&
    entry.modelOverrideSource === void 0 &&
    hasSessionAutoModelFallbackProvenance(entry);
  if (entry?.modelOverrideSource !== "auto" && !recoveredAutoFallbackOverride) return false;
  if (!entry) return false;
  const primaryKey = resolveModelRefKey({
    defaultProvider: params.defaultProvider,
    overrideProvider: params.primaryProvider ?? params.defaultProvider,
    overrideModel: params.primaryModel ?? params.defaultModel,
  });
  if (!primaryKey) return false;
  const originKey = resolveModelRefKey({
    defaultProvider: params.defaultProvider,
    overrideProvider: entry.modelOverrideFallbackOriginProvider,
    overrideModel: entry.modelOverrideFallbackOriginModel,
  });
  if (originKey) return originKey !== primaryKey;
  const noticeSelectedKey = resolveModelRefKey({
    defaultProvider: params.defaultProvider,
    overrideModel: normalizeOptionalString(entry.fallbackNoticeSelectedModel),
  });
  if (noticeSelectedKey) return noticeSelectedKey !== primaryKey;
  const storedOverrideKey = resolveModelRefKey({
    defaultProvider: params.defaultProvider,
    overrideProvider: params.storedOverride.provider,
    overrideModel: params.storedOverride.model,
  });
  return storedOverrideKey !== null && storedOverrideKey !== primaryKey;
}
//#endregion
export { resolveStoredModelOverride as n, isStaleHeartbeatAutoFallbackOverride as t };
