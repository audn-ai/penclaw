import fs from "node:fs/promises";
import "./src-Bl7G9qvi.js";
import path from "node:path";
import {
  a as resolveAgentDir,
  s as resolveDefaultAgentDir,
  t as listAgentEntries,
} from "./agent-scope-config-DVIR1nBa.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./agent-scope-y9xQv_q1.js";
import { r as resolveAuthStorePath } from "./path-resolve-8wkj2l4Z.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import {
  _ as hasUsableOAuthCredential,
  h as areOAuthCredentialsEquivalent,
  m as isLegacyOAuthRef,
  o as loadPersistedAuthProfileStore,
  y as isSafeToAdoptMainStoreOAuthIdentity,
} from "./persisted-B2tK2f7d.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { y as updateAuthProfileStoreWithLock } from "./store-B7DoDdVM.js";
import { h as shortenHomePath } from "./utils-DtcDeqWS.js";
//#region src/commands/doctor/shared/stale-oauth-profile-shadows.ts
async function loadRawAuthProfileStore(authPath) {
  try {
    const raw = JSON.parse(await fs.readFile(authPath, "utf8"));
    return isRecord(raw) ? raw : null;
  } catch {
    return null;
  }
}
function hasLegacyOAuthSidecarRef(raw, profileId) {
  if (!raw || !isRecord(raw.profiles)) return false;
  const profile = raw.profiles[profileId];
  if (!isRecord(profile)) return false;
  return (
    profile.type === "oauth" &&
    profile.provider === "openai-codex" &&
    isLegacyOAuthRef(profile.oauthRef)
  );
}
async function collectStateAgentDirs(env) {
  const agentsRoot = path.join(resolveStateDir(env), "agents");
  return (await fs.readdir(agentsRoot, { withFileTypes: true }).catch(() => []))
    .filter((entry) => entry.isDirectory() || entry.isSymbolicLink())
    .map((entry) => path.join(agentsRoot, entry.name, "agent"));
}
async function collectCandidateAgentDirs(cfg, env) {
  const dirs = /* @__PURE__ */ new Set();
  for (const entry of listAgentEntries(cfg)) {
    const id = entry.id?.trim();
    if (id) dirs.add(path.resolve(resolveAgentDir(cfg, id, env)));
  }
  for (const agentDir of await collectStateAgentDirs(env)) dirs.add(path.resolve(agentDir));
  return [...dirs].toSorted((left, right) => left.localeCompare(right));
}
function shouldRemoveLocalOAuthShadow(params) {
  const { local, main, now } = params;
  if (!main || main.type !== "oauth" || local.provider !== main.provider) return false;
  if (!isSafeToAdoptMainStoreOAuthIdentity(local, main)) return false;
  if (areOAuthCredentialsEquivalent(local, main)) return true;
  if (!hasUsableOAuthCredential(main, now)) return false;
  if (!hasUsableOAuthCredential(local, now)) return true;
  const localExpires = Number.isFinite(local.expires) ? local.expires : 0;
  return (Number.isFinite(main.expires) ? main.expires : 0) >= localExpires;
}
/** Find local OAuth profiles that safely inherit fresher main-agent credentials instead. */
async function scanStaleOAuthProfileShadows(params) {
  const env = params.env ?? process.env;
  const now = params.now ?? Date.now();
  const mainAgentDir = resolveDefaultAgentDir({}, env);
  const mainAuthPath = path.resolve(resolveAuthStorePath(mainAgentDir));
  const mainStore = loadPersistedAuthProfileStore(mainAgentDir);
  if (!mainStore) return [];
  const hits = [];
  for (const agentDir of await collectCandidateAgentDirs(params.cfg, env)) {
    const authPath = path.resolve(resolveAuthStorePath(agentDir));
    if (authPath === mainAuthPath) continue;
    const rawLocalStore = await loadRawAuthProfileStore(authPath);
    const localStore = loadPersistedAuthProfileStore(agentDir);
    if (!localStore) continue;
    for (const [profileId, local] of Object.entries(localStore.profiles)) {
      if (local.type !== "oauth") continue;
      if (hasLegacyOAuthSidecarRef(rawLocalStore, profileId)) continue;
      const main = mainStore.profiles[profileId];
      if (
        shouldRemoveLocalOAuthShadow({
          local,
          main: main?.type === "oauth" ? main : void 0,
          now,
        })
      )
        hits.push({
          agentDir,
          authPath,
          profileId,
        });
    }
  }
  return hits;
}
function removeStaleProfilesFromStore(params) {
  const removedProfileIds = [];
  const profiles = { ...params.store.profiles };
  const usageStats = params.store.usageStats ? { ...params.store.usageStats } : void 0;
  const order = params.store.order ? { ...params.store.order } : void 0;
  const lastGood = params.store.lastGood ? { ...params.store.lastGood } : void 0;
  for (const profileId of params.profileIds) {
    const local = profiles[profileId];
    const main = params.mainStore.profiles[profileId];
    if (
      local?.type !== "oauth" ||
      !shouldRemoveLocalOAuthShadow({
        local,
        main: main?.type === "oauth" ? main : void 0,
        now: params.now,
      })
    )
      continue;
    delete profiles[profileId];
    if (usageStats) delete usageStats[profileId];
    if (lastGood) {
      for (const [provider, lastGoodProfileId] of Object.entries(lastGood))
        if (lastGoodProfileId === profileId) delete lastGood[provider];
    }
    if (order)
      for (const [provider, profileIds] of Object.entries(order)) {
        const nextProfileIds = profileIds.filter((entry) => entry !== profileId);
        if (nextProfileIds.length > 0) order[provider] = nextProfileIds;
        else delete order[provider];
      }
    removedProfileIds.push(profileId);
  }
  return {
    store: {
      ...params.store,
      profiles,
      ...(usageStats && Object.keys(usageStats).length > 0
        ? { usageStats }
        : { usageStats: void 0 }),
      ...(lastGood && Object.keys(lastGood).length > 0 ? { lastGood } : { lastGood: void 0 }),
      ...(order && Object.keys(order).length > 0 ? { order } : { order: void 0 }),
    },
    removedProfileIds,
  };
}
function formatProfileList(profileIds) {
  return profileIds.length === 1
    ? expectDefined(profileIds[0], "profile ids entry at 0")
    : `${profileIds.length} profiles`;
}
async function repairStaleOAuthProfilesForAgent(params) {
  const rawStore = await loadRawAuthProfileStore(resolveAuthStorePath(params.agentDir));
  const profileIds = new Set(
    [...params.profileIds].filter((profileId) => !hasLegacyOAuthSidecarRef(rawStore, profileId)),
  );
  if (profileIds.size === 0) return { status: "unchanged" };
  if (!loadPersistedAuthProfileStore(params.agentDir)) return { status: "missing" };
  let sawStore = false;
  let removedProfileIds = [];
  await updateAuthProfileStoreWithLock({
    agentDir: params.agentDir,
    updater: (store) => {
      sawStore = true;
      const result = removeStaleProfilesFromStore({
        store,
        mainStore: params.mainStore,
        profileIds,
        now: params.now,
      });
      if (result.removedProfileIds.length === 0) return false;
      removedProfileIds = result.removedProfileIds;
      Object.assign(store, result.store);
      return true;
    },
  });
  if (!sawStore) return { status: "missing" };
  return removedProfileIds.length > 0
    ? {
        status: "changed",
        removedProfileIds,
      }
    : { status: "unchanged" };
}
/** Format warnings for stale per-agent OAuth profile shadows. */
function collectStaleOAuthProfileShadowWarnings(params) {
  return params.hits.map(
    (hit) =>
      `- ${shortenHomePath(hit.authPath)} has stale OAuth auth profile ${hit.profileId}; it shadows the fresher main-agent credential. Run "${params.doctorFixCommand}" to remove the local shadow and inherit main auth.`,
  );
}
/** Remove stale per-agent OAuth profile shadows after rechecking each locked store. */
async function repairStaleOAuthProfileShadows(params) {
  const env = params.env ?? process.env;
  const now = params.now ?? Date.now();
  const hits = await scanStaleOAuthProfileShadows({
    ...params,
    env,
    now,
  });
  const changes = [];
  const warnings = [];
  const byAgentDir = /* @__PURE__ */ new Map();
  for (const hit of hits) {
    const existing = byAgentDir.get(hit.agentDir) ?? [];
    existing.push(hit);
    byAgentDir.set(hit.agentDir, existing);
  }
  for (const [agentDir, agentHits] of byAgentDir) {
    const mainStore = loadPersistedAuthProfileStore(resolveDefaultAgentDir({}, env));
    if (!mainStore) continue;
    const profileIds = new Set(agentHits.map((hit) => hit.profileId));
    try {
      const repair = await repairStaleOAuthProfilesForAgent({
        agentDir,
        mainStore,
        profileIds,
        now,
      });
      if (repair.status === "changed")
        changes.push(
          `Removed stale OAuth auth profile shadow ${formatProfileList(repair.removedProfileIds.toSorted())} from ${shortenHomePath(resolveAuthStorePath(agentDir))}; this agent now inherits main auth.`,
        );
    } catch (error) {
      warnings.push(
        `Failed to remove stale OAuth auth profile shadow from ${shortenHomePath(resolveAuthStorePath(agentDir))}: ${String(error)}`,
      );
    }
  }
  return {
    changes,
    warnings,
  };
}
//#endregion
export {
  repairStaleOAuthProfileShadows as n,
  scanStaleOAuthProfileShadows as r,
  collectStaleOAuthProfileShadowWarnings as t,
};
