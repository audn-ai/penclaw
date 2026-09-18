import { t as getCliSessionBinding } from "./cli-session-binding-CfY4fqsE.js";
import { o as resolveSessionLifecycleTimestamps } from "./lifecycle-5_TQ_dr5.js";
import { l as resolveStorePath } from "./paths-TfuVT-K8.js";
import { a as resolveSessionResetPolicy, i as evaluateSessionFreshness } from "./reset-DwjOm4Ug.js";
import { S as loadSessionEntry } from "./session-accessor-PZVNxFCV.js";
import { d as resolveAgentIdFromSessionKey } from "./session-key-druuY-GG.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/config/sessions/entry-freshness.ts
function hasProviderOwnedSession(entry) {
  const provider = normalizeOptionalString(entry?.providerOverride ?? entry?.modelProvider);
  return Boolean(provider && getCliSessionBinding(entry, provider));
}
/** Resolves one session entry's reset freshness using the runtime lifecycle rules. */
function resolveSessionEntryResetFreshness(params) {
  const agentId = params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey);
  const sessionCfg = params.sessionCfg;
  const storePath =
    params.storePath ??
    resolveStorePath(sessionCfg?.store, {
      agentId,
      env: params.env,
    });
  const entry = loadSessionEntry({
    ...params,
    agentId,
    storePath,
  });
  const resetType = params.resetType;
  const resetPolicy = resolveSessionResetPolicy({
    sessionCfg,
    resetType,
    resetOverride: params.resetOverride,
  });
  const lifecycleTimestamps = resolveSessionLifecycleTimestamps({
    entry,
    agentId,
    storePath,
  });
  const base = {
    lifecycleTimestamps,
    resetPolicy,
    resetType,
  };
  if (!entry)
    return {
      state: "missing",
      entry: void 0,
      freshness: void 0,
      ...base,
    };
  const freshness =
    resetPolicy.configured !== true && hasProviderOwnedSession(entry)
      ? { fresh: true }
      : evaluateSessionFreshness({
          updatedAt: entry.updatedAt,
          sessionStartedAt: lifecycleTimestamps.sessionStartedAt,
          lastInteractionAt: lifecycleTimestamps.lastInteractionAt,
          now: params.now ?? Date.now(),
          policy: resetPolicy,
        });
  return {
    state: freshness.fresh ? "fresh" : "stale",
    entry,
    freshness,
    ...base,
  };
}
//#endregion
export { resolveSessionEntryResetFreshness as n, hasProviderOwnedSession as t };
