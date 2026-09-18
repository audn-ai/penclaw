import { n as deliveryContextFromSession } from "./delivery-context.shared-WPZGmi9R.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { l as resolveStorePath } from "./paths-TfuVT-K8.js";
import {
  E as openSessionEntryReadView,
  Jt as resolveSessionStoreKey,
  qt as resolveSessionStoreAgentId,
} from "./session-accessor-PZVNxFCV.js";
import { p as requiresFoldedSessionKeyAliasProof } from "./session-key-utils-B8sNp9l4.js";
import {
  gt as normalizeStoreSessionKey,
  ht as isConfirmedLowercasedLegacyAlias,
  mt as hasMismatchedCaseSensitiveDeliveryProof,
  pt as foldedSessionKeyAliasCandidates,
  z as parseSessionThreadInfo,
} from "./store-CzZJhTF6.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { i as resolveAllAgentSessionStoreTargetsSync } from "./targets-CjMfpXbt.js";
//#region src/config/sessions/delivery-info.ts
function hasRoutableDeliveryContext(context) {
  return Boolean(context?.channel && context?.to);
}
/**
 * Extracts the routable delivery context and thread id for a persisted session key.
 *
 * Thread/topic keys first try their exact store entry, then fall back to the base session when
 * the thread entry has no delivery route of its own.
 */
function extractDeliveryInfo(sessionKey, options) {
  const { baseSessionKey, threadId } = parseSessionThreadInfo(sessionKey);
  if (!sessionKey || !baseSessionKey)
    return {
      deliveryContext: void 0,
      threadId,
    };
  let deliveryContext;
  try {
    const lookup = loadDeliverySessionEntry({
      cfg: options?.cfg ?? getRuntimeConfig(),
      sessionKey,
      baseSessionKey,
    });
    let entry = lookup.entry;
    let storedDeliveryContext = deliveryContextFromSession(entry);
    if (!hasRoutableDeliveryContext(storedDeliveryContext) && baseSessionKey !== sessionKey) {
      entry = lookup.baseEntry;
      storedDeliveryContext = deliveryContextFromSession(entry);
    }
    if (hasRoutableDeliveryContext(storedDeliveryContext))
      deliveryContext = {
        channel: storedDeliveryContext.channel,
        to: storedDeliveryContext.to,
        accountId: storedDeliveryContext.accountId,
        threadId: storedDeliveryContext.threadId,
      };
  } catch {}
  return {
    deliveryContext,
    threadId,
  };
}
function resolveDeliveryStorePaths(cfg, agentId) {
  const paths = /* @__PURE__ */ new Set();
  paths.add(resolveStorePath(cfg.session?.store, { agentId }));
  for (const target of resolveAllAgentSessionStoreTargetsSync(cfg))
    if (target.agentId === agentId) paths.add(target.storePath);
  return [...paths];
}
function findSessionEntryInStore(store, keys) {
  let normalizedIndex;
  let bestEntry;
  let bestUpdatedAt = 0;
  let bestRoutable = false;
  let bestExact = false;
  const acceptCandidate = (entry, isExact = false) => {
    if (!entry) return;
    const candidateRoutable = hasRoutableDeliveryContext(deliveryContextFromSession(entry));
    const candidateUpdatedAt = entry.updatedAt ?? 0;
    if (
      !bestEntry ||
      (candidateRoutable && !bestRoutable) ||
      (candidateRoutable === bestRoutable && isExact && !bestExact) ||
      (candidateRoutable === bestRoutable &&
        isExact === bestExact &&
        candidateUpdatedAt > bestUpdatedAt)
    ) {
      bestEntry = entry;
      bestUpdatedAt = candidateUpdatedAt;
      bestRoutable = candidateRoutable;
      bestExact = isExact;
    }
  };
  for (const key of keys) {
    const trimmed = key.trim();
    const normalized = normalizeStoreSessionKey(key);
    const foldedLegacyKeys = foldedSessionKeyAliasCandidates(normalized);
    const exactKeyWins = requiresFoldedSessionKeyAliasProof(normalized);
    let foundRoutableCandidate = false;
    const exactEntry = store.get(normalized);
    if (exactEntry && !hasMismatchedCaseSensitiveDeliveryProof(exactEntry, normalized)) {
      foundRoutableCandidate ||= hasRoutableDeliveryContext(deliveryContextFromSession(exactEntry));
      acceptCandidate(exactEntry, exactKeyWins);
    }
    for (const foldedLegacyKey of foldedLegacyKeys) {
      const foldedLegacyEntry = store.get(foldedLegacyKey);
      if (!foldedLegacyEntry || !isConfirmedLowercasedLegacyAlias(foldedLegacyEntry, normalized))
        continue;
      foundRoutableCandidate ||= hasRoutableDeliveryContext(
        deliveryContextFromSession(foldedLegacyEntry),
      );
      acceptCandidate(foldedLegacyEntry);
    }
    const trimmedEntry = trimmed !== normalized ? store.get(trimmed) : void 0;
    if (trimmedEntry && !hasMismatchedCaseSensitiveDeliveryProof(trimmedEntry, normalized)) {
      foundRoutableCandidate ||= hasRoutableDeliveryContext(
        deliveryContextFromSession(trimmedEntry),
      );
      acceptCandidate(trimmedEntry);
    }
    if (trimmed !== normalized || !foundRoutableCandidate) {
      normalizedIndex ??= buildFreshestSessionEntryIndex(store);
      const freshest = normalizedIndex.get(normalized);
      if (!hasMismatchedCaseSensitiveDeliveryProof(freshest, normalized)) acceptCandidate(freshest);
      for (const foldedLegacyKey of foldedLegacyKeys) {
        const foldedFreshest = normalizedIndex.get(foldedLegacyKey);
        if (isConfirmedLowercasedLegacyAlias(foldedFreshest, normalized))
          acceptCandidate(foldedFreshest);
      }
    }
  }
  return bestEntry;
}
function buildFreshestSessionEntryIndex(store) {
  const index = /* @__PURE__ */ new Map();
  for (const { sessionKey: key, entry } of store.entries()) {
    if (!entry) continue;
    const normalized = normalizeStoreSessionKey(key);
    const existing = index.get(normalized);
    const entryRoutable = hasRoutableDeliveryContext(deliveryContextFromSession(entry));
    const existingRoutable = hasRoutableDeliveryContext(deliveryContextFromSession(existing));
    if (
      !existing ||
      (entryRoutable && !existingRoutable) ||
      (entryRoutable === existingRoutable && (entry.updatedAt ?? 0) > (existing.updatedAt ?? 0))
    )
      index.set(normalized, entry);
    const foldedLegacyKey = normalizeLowercaseStringOrEmpty(normalized);
    if (foldedLegacyKey === normalized || requiresFoldedSessionKeyAliasProof(normalized)) continue;
    const foldedExisting = index.get(foldedLegacyKey);
    const foldedExistingRoutable = hasRoutableDeliveryContext(
      deliveryContextFromSession(foldedExisting),
    );
    if (
      !foldedExisting ||
      (entryRoutable && !foldedExistingRoutable) ||
      (entryRoutable === foldedExistingRoutable &&
        (entry.updatedAt ?? 0) > (foldedExisting.updatedAt ?? 0))
    )
      index.set(foldedLegacyKey, entry);
  }
  return index;
}
function loadDeliverySessionEntry(params) {
  const canonicalKey = resolveSessionStoreKey({
    cfg: params.cfg,
    sessionKey: params.sessionKey,
  });
  const canonicalBaseKey = resolveSessionStoreKey({
    cfg: params.cfg,
    sessionKey: params.baseSessionKey,
  });
  const agentId = resolveSessionStoreAgentId(params.cfg, canonicalKey);
  const sessionKeys = [params.sessionKey, canonicalKey];
  const baseKeys = [params.baseSessionKey, canonicalBaseKey];
  let fallback;
  for (const storePath of resolveDeliveryStorePaths(params.cfg, agentId)) {
    const store = openSessionEntryReadView({ storePath });
    const entry = findSessionEntryInStore(store, sessionKeys);
    const baseEntry = findSessionEntryInStore(store, baseKeys);
    if (!entry && !baseEntry) continue;
    fallback ??= {
      entry,
      baseEntry,
    };
    if (
      hasRoutableDeliveryContext(deliveryContextFromSession(entry)) ||
      hasRoutableDeliveryContext(deliveryContextFromSession(baseEntry))
    )
      return {
        entry,
        baseEntry,
      };
  }
  return (
    fallback ?? {
      entry: void 0,
      baseEntry: void 0,
    }
  );
}
//#endregion
export { extractDeliveryInfo as t };
