import { t as loadCombinedSessionStoreForGateway } from "./combined-store-gateway-TXobKXN7.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import "./src-Bl7G9qvi.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { i as parseSessionLabel } from "./openclaw-tools-DGecpaCF.js";
import "./sessions-CEG7v41b.js";
import { u as canonicalizeSessionEntryAliases } from "./session-accessor-PZVNxFCV.js";
import { n as resolveSessionIdMatchSelection } from "./session-id-resolution-C386OSgw.js";
import {
  f as resolveDeletedAgentIdFromSessionKey,
  g as resolveGatewaySessionStoreTargetWithStore,
  i as filterAndSortSessionEntries,
  s as listSessionsFromStore,
} from "./session-utils-DjTWBI0J.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import "./src-CIJf1lT0.js";
//#region src/gateway/sessions-resolve.ts
function resolveSessionVisibilityFilterOptions(p) {
  return {
    includeGlobal: p.includeGlobal === true,
    includeUnknown: p.includeUnknown === true,
    spawnedBy: p.spawnedBy,
    agentId: p.agentId,
  };
}
function noSessionFoundResult(params) {
  if (params.p.allowMissing)
    return {
      ok: true,
      missing: true,
    };
  return {
    ok: false,
    error: errorShape(ErrorCodes.INVALID_REQUEST, params.message),
  };
}
/** Rejects sessions whose owning agent no longer exists in config (#65524). */
function validateSessionAgentExists(cfg, key, entry, options) {
  const deletedAgentId = resolveDeletedAgentIdFromSessionKey(cfg, key, entry, options);
  if (deletedAgentId === null) return null;
  return {
    ok: false,
    error: errorShape(
      ErrorCodes.INVALID_REQUEST,
      `Agent "${deletedAgentId}" no longer exists in configuration`,
    ),
  };
}
function isResolvedSessionKeyVisible(params) {
  if (typeof params.p.spawnedBy !== "string" || params.p.spawnedBy.trim().length === 0) return true;
  return filterAndSortSessionEntries({
    cfg: params.cfg,
    store: params.store,
    now: Date.now(),
    opts: resolveSessionVisibilityFilterOptions(params.p),
  }).some(([key]) => key === params.key);
}
function findVisibleSessionIdMatches(params) {
  const now = Date.now();
  return filterAndSortSessionEntries({
    cfg: params.cfg,
    store: params.store,
    now,
    opts: resolveSessionVisibilityFilterOptions(params.p),
  }).filter(([key, entry]) => entry?.sessionId === params.sessionId || key === params.sessionId);
}
async function resolveSessionKeyFromResolveParams(params) {
  const { cfg, p } = params;
  const key = normalizeOptionalString(p.key) ?? "";
  const hasKey = key.length > 0;
  const sessionId = normalizeOptionalString(p.sessionId) ?? "";
  const hasSessionId = sessionId.length > 0;
  const selectionCount = [
    hasKey,
    hasSessionId,
    (normalizeOptionalString(p.label) ?? "").length > 0,
  ].filter(Boolean).length;
  if (selectionCount > 1)
    return {
      ok: false,
      error: errorShape(
        ErrorCodes.INVALID_REQUEST,
        "Provide either key, sessionId, or label (not multiple)",
      ),
    };
  if (selectionCount === 0)
    return {
      ok: false,
      error: errorShape(ErrorCodes.INVALID_REQUEST, "Either key, sessionId, or label is required"),
    };
  if (hasKey) {
    const target = resolveGatewaySessionStoreTargetWithStore({
      cfg,
      key,
      clone: false,
    });
    const store = target.store;
    if (store[target.canonicalKey]) {
      if (
        !isResolvedSessionKeyVisible({
          cfg,
          p,
          store,
          key: target.canonicalKey,
        })
      )
        return noSessionFoundResult({
          p,
          message: `No session found: ${key}`,
        });
      const agentCheck = validateSessionAgentExists(
        cfg,
        target.canonicalKey,
        store[target.canonicalKey],
        { acpMetadataSessionKey: target.canonicalKey },
      );
      if (agentCheck) return agentCheck;
      return {
        ok: true,
        key: target.canonicalKey,
      };
    }
    if (!target.storeKeys.find((candidate) => store[candidate]))
      return noSessionFoundResult({
        p,
        message: `No session found: ${key}`,
      });
    await canonicalizeSessionEntryAliases({
      storePath: target.storePath,
      target: {
        canonicalKey: target.canonicalKey,
        storeKeys: target.storeKeys,
      },
    });
    const refreshedTarget = resolveGatewaySessionStoreTargetWithStore({
      cfg,
      key: target.canonicalKey,
      clone: false,
    });
    if (
      !isResolvedSessionKeyVisible({
        cfg,
        p,
        store: refreshedTarget.store,
        key: refreshedTarget.canonicalKey,
      })
    )
      return noSessionFoundResult({
        p,
        message: `No session found: ${key}`,
      });
    const agentCheckLegacy = validateSessionAgentExists(
      cfg,
      refreshedTarget.canonicalKey,
      refreshedTarget.store[refreshedTarget.canonicalKey],
      { acpMetadataSessionKey: refreshedTarget.canonicalKey },
    );
    if (agentCheckLegacy) return agentCheckLegacy;
    return {
      ok: true,
      key: refreshedTarget.canonicalKey,
    };
  }
  if (hasSessionId) {
    const { store } = loadCombinedSessionStoreForGateway(cfg, { agentId: p.agentId });
    const matches = findVisibleSessionIdMatches({
      cfg,
      store,
      p,
      sessionId,
    });
    const selection = resolveSessionIdMatchSelection(matches, sessionId);
    if (selection.kind === "none")
      return noSessionFoundResult({
        p,
        message: `No session found: ${sessionId}`,
      });
    if (selection.kind === "ambiguous") {
      const keys = selection.sessionKeys.join(", ");
      return {
        ok: false,
        error: errorShape(
          ErrorCodes.INVALID_REQUEST,
          `Multiple sessions found for sessionId: ${sessionId} (${keys})`,
        ),
      };
    }
    const selectedEntry = matches.find(([matchKey]) => matchKey === selection.sessionKey)?.[1];
    const agentCheckSessionId = validateSessionAgentExists(
      cfg,
      selection.sessionKey,
      selectedEntry,
    );
    if (agentCheckSessionId) return agentCheckSessionId;
    return {
      ok: true,
      key: selection.sessionKey,
    };
  }
  const parsedLabel = parseSessionLabel(p.label);
  if (!parsedLabel.ok)
    return {
      ok: false,
      error: errorShape(ErrorCodes.INVALID_REQUEST, parsedLabel.error),
    };
  const { storePath, store } = loadCombinedSessionStoreForGateway(cfg, { agentId: p.agentId });
  const list = listSessionsFromStore({
    cfg,
    storePath,
    store,
    opts: {
      includeGlobal: p.includeGlobal === true,
      includeUnknown: p.includeUnknown === true,
      label: parsedLabel.label,
      agentId: p.agentId,
      spawnedBy: p.spawnedBy,
      limit: 2,
    },
  });
  if (list.sessions.length === 0)
    return noSessionFoundResult({
      p,
      message: `No session found with label: ${parsedLabel.label}`,
    });
  if (list.sessions.length > 1) {
    const keys = list.sessions.map((s) => s.key).join(", ");
    return {
      ok: false,
      error: errorShape(
        ErrorCodes.INVALID_REQUEST,
        `Multiple sessions found with label: ${parsedLabel.label} (${keys})`,
      ),
    };
  }
  const labelKey = expectDefined(list.sessions[0], "sessions entry at 0").key;
  const agentCheckLabel = validateSessionAgentExists(cfg, labelKey, store[labelKey]);
  if (agentCheckLabel) return agentCheckLabel;
  return {
    ok: true,
    key: expectDefined(list.sessions[0], "sessions entry at 0").key,
  };
}
//#endregion
export { resolveSessionKeyFromResolveParams as t };
