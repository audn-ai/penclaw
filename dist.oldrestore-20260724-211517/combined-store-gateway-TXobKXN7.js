import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import "./src-Bl7G9qvi.js";
import "./agent-scope-y9xQv_q1.js";
import { c as resolveDefaultAgentId } from "./agent-scope-config-DVIR1nBa.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { l as resolveStorePath } from "./paths-TfuVT-K8.js";
import {
  Kt as canonicalizeSpawnedByForAgent,
  Yt as resolveStoredSessionKeyForAgentStore,
  y as listSessionEntries,
} from "./session-accessor-PZVNxFCV.js";
import {
  a as resolveSessionStoreTargets,
  i as resolveAllAgentSessionStoreTargetsSync,
  n as resolveAgentSessionStoreTargetsSync,
} from "./targets-CjMfpXbt.js";
//#region src/config/sessions/combined-store-gateway.ts
function isStorePathTemplate(store) {
  return typeof store === "string" && store.includes("{agentId}");
}
function loadGatewayStoreEntries(params) {
  return Object.fromEntries(
    listSessionEntries({
      agentId: params.agentId,
      clone: false,
      storePath: params.storePath,
    }).map(({ sessionKey, entry }) => [sessionKey, entry]),
  );
}
function mergeSessionEntryIntoCombined(params) {
  const { cfg, combined, entry, agentId, canonicalKey } = params;
  const existing = combined[canonicalKey];
  if (existing && (existing.updatedAt ?? 0) > (entry.updatedAt ?? 0)) {
    const spawnedBy = canonicalizeSpawnedByForAgent(
      cfg,
      agentId,
      existing.spawnedBy ?? entry.spawnedBy,
    );
    combined[canonicalKey] = {
      ...entry,
      ...existing,
      spawnedBy,
    };
    return;
  }
  const spawnedBy = canonicalizeSpawnedByForAgent(
    cfg,
    agentId,
    entry.spawnedBy ?? existing?.spawnedBy,
  );
  if (!existing && entry.spawnedBy === spawnedBy) combined[canonicalKey] = entry;
  else
    combined[canonicalKey] = {
      ...existing,
      ...entry,
      spawnedBy,
    };
}
/** Loads and canonicalizes session entries for gateway views across one or more agent stores. */
function loadCombinedSessionStoreForGateway(cfg, opts = {}) {
  const storeConfig = cfg.session?.store;
  if (storeConfig && !isStorePathTemplate(storeConfig)) {
    const storePath = resolveStorePath(storeConfig);
    const defaultAgentId = normalizeAgentId(resolveDefaultAgentId(cfg));
    const store = loadGatewayStoreEntries({
      agentId: defaultAgentId,
      storePath,
    });
    const combined = {};
    for (const [key, entry] of Object.entries(store))
      mergeSessionEntryIntoCombined({
        cfg,
        combined,
        entry,
        agentId: defaultAgentId,
        canonicalKey: resolveStoredSessionKeyForAgentStore({
          cfg,
          agentId: defaultAgentId,
          sessionKey: key,
        }),
      });
    return {
      storePath,
      store: combined,
    };
  }
  const requestedAgentId =
    typeof opts.agentId === "string" && opts.agentId.trim()
      ? normalizeAgentId(opts.agentId)
      : void 0;
  const targets = requestedAgentId
    ? resolveAgentSessionStoreTargetsSync(cfg, requestedAgentId)
    : opts.configuredAgentsOnly === true
      ? resolveSessionStoreTargets(cfg, { allAgents: true })
      : resolveAllAgentSessionStoreTargetsSync(cfg);
  const combined = {};
  for (const target of targets) {
    const agentId = target.agentId;
    const storePath = target.storePath;
    const store = loadGatewayStoreEntries({
      agentId,
      storePath,
    });
    for (const [key, entry] of Object.entries(store))
      mergeSessionEntryIntoCombined({
        cfg,
        combined,
        entry,
        agentId,
        canonicalKey: resolveStoredSessionKeyForAgentStore({
          cfg,
          agentId,
          sessionKey: key,
        }),
      });
  }
  return {
    storePath:
      targets.length === 1
        ? expectDefined(targets[0], "targets entry at 0").storePath
        : typeof storeConfig === "string" && storeConfig.trim()
          ? storeConfig.trim()
          : "(multiple)",
    store: combined,
  };
}
//#endregion
export { loadCombinedSessionStoreForGateway as t };
