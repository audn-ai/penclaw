import fs from "node:fs";
import path from "node:path";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import "./utils-DtcDeqWS.js";
import {
  a as resolveAgentDir,
  n as listAgentIds,
  s as resolveDefaultAgentDir,
} from "./agent-scope-config-DVIR1nBa.js";
import { t as listRuntimeExternalAuthProfiles } from "./external-auth-aN0UYCd0.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import {
  c as inspectOpenClawAgentDatabaseOwner,
  u as listOpenClawRegisteredAgentDatabases,
} from "./openclaw-agent-db-VC51jrBW.js";
import { i as resolveAuthProfileOrder } from "./order-BNCpk81x.js";
import {
  a as resolveLegacyAuthStorePath,
  r as resolveAuthStorePath,
  t as resolveAuthStatePath,
} from "./path-resolve-8wkj2l4Z.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import {
  f as mergeAuthProfileState,
  i as coercePersistedAuthProfileStore,
  s as mergeAuthProfileStores,
  u as coerceAuthProfileState,
} from "./persisted-B2tK2f7d.js";
import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-RaEzqkSo.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { t as DEFAULT_AGENT_ID } from "./session-key-druuY-GG.js";
import {
  c as resolveAuthProfileDatabasePath,
  n as inspectPersistedAuthProfileStateRaw,
  o as resolveAuthProfileDatabaseFilePaths,
  r as inspectPersistedAuthProfileStoreRaw,
  s as resolveAuthProfileDatabaseOwnerId,
} from "./sqlite-BXljtvPf.js";
//#region src/commands/doctor/shared/stale-auth-order.ts
const AUTH_PROFILE_MODES = /* @__PURE__ */ new Set(["api_key", "aws-sdk", "oauth", "token"]);
const INVALID_SQLITE_STORE_WARNING =
  "- Skipped auth.order repair because a SQLite auth profile store is unreadable, unavailable, or contains invalid credentials; repair or re-import that agent's auth store, then rerun doctor.";
function isProfileIdList(value) {
  return Array.isArray(value) && value.every((profileId) => typeof profileId === "string");
}
function readValidConfiguredAuthOrder(cfg) {
  const order = cfg.auth?.order;
  if (!isRecord(order)) return;
  const result = {};
  for (const [provider, profileIds] of Object.entries(order)) {
    if (!isProfileIdList(profileIds)) return;
    result[provider] = profileIds;
  }
  return result;
}
function hasValidConfiguredAuthProfiles(cfg) {
  const profiles = cfg.auth?.profiles;
  if (profiles === void 0) return true;
  return (
    isRecord(profiles) &&
    Object.values(profiles).every(
      (profile) =>
        isRecord(profile) &&
        typeof profile.provider === "string" &&
        typeof profile.mode === "string" &&
        AUTH_PROFILE_MODES.has(profile.mode),
    )
  );
}
function hasNonemptyConfiguredAuthOrder(cfg) {
  const order = readValidConfiguredAuthOrder(cfg);
  return Boolean(order && Object.values(order).some((profileIds) => profileIds.length > 0));
}
function inspectAuthPath(pathname) {
  try {
    fs.statSync(pathname);
    return "present";
  } catch (error) {
    if (error.code !== "ENOENT") return "unreadable";
  }
  try {
    fs.lstatSync(pathname);
    return "unreadable";
  } catch (error) {
    if (error.code !== "ENOENT") return "unreadable";
  }
  let ancestor = path.dirname(pathname);
  while (true) {
    try {
      const stat = fs.lstatSync(ancestor);
      if (!stat.isSymbolicLink()) return stat.isDirectory() ? "missing" : "unreadable";
      try {
        return fs.statSync(ancestor).isDirectory() ? "missing" : "unreadable";
      } catch {
        return "unreadable";
      }
    } catch (error) {
      if (error.code !== "ENOENT") return "unreadable";
    }
    const parent = path.dirname(ancestor);
    if (parent === ancestor) return "missing";
    ancestor = parent;
  }
}
function inspectUnmigratedAuthStoreSources(agentDir) {
  const results = new Set(
    [
      resolveAuthStorePath(agentDir),
      resolveAuthStatePath(agentDir),
      resolveLegacyAuthStorePath(agentDir),
    ].map((pathname) => inspectAuthPath(pathname)),
  );
  if (results.has("unreadable")) return "unreadable";
  return results.has("present") ? "present" : "missing";
}
function inspectAuthDatabaseFiles(agentDir) {
  const [databasePath, ...sidecarPaths] = resolveAuthProfileDatabaseFilePaths(agentDir);
  if (!databasePath) return "unreadable";
  const availability = inspectAuthPath(databasePath);
  const sidecarAvailability = sidecarPaths.map((pathname) => inspectAuthPath(pathname));
  if (
    availability === "unreadable" ||
    sidecarAvailability.some((status) => status === "unreadable")
  )
    return "unreadable";
  if (availability === "present") return "present";
  return sidecarAvailability.every((sidecar) => sidecar === "missing") ? "missing" : "unreadable";
}
function loadCompletePersistedStore(agentDir) {
  const inspection = inspectPersistedAuthProfileStoreRaw(agentDir);
  const stateInspection = inspectPersistedAuthProfileStateRaw(agentDir);
  if (inspection.status === "unreadable" || stateInspection.status === "unreadable")
    return { status: "invalid" };
  const storeMissingReason = inspection.status === "missing" ? inspection.reason : void 0;
  const stateMissingReason = stateInspection.status === "missing" ? stateInspection.reason : void 0;
  if (storeMissingReason === "database" || stateMissingReason === "database")
    return storeMissingReason === "database" && stateMissingReason === "database"
      ? {
          status: "ok",
          store: null,
          hasAuthTables: false,
        }
      : { status: "invalid" };
  if ((storeMissingReason === "table") !== (stateMissingReason === "table"))
    return { status: "invalid" };
  if (storeMissingReason === "table")
    return {
      status: "ok",
      store: null,
      hasAuthTables: false,
    };
  const persistedState =
    stateInspection.status === "readable" ? coerceAuthProfileState(stateInspection.raw) : {};
  if (inspection.status === "missing")
    return stateInspection.status === "missing"
      ? {
          status: "ok",
          store: null,
          hasAuthTables: true,
        }
      : {
          status: "ok",
          store: {
            version: 1,
            profiles: {},
            ...persistedState,
          },
          hasAuthTables: true,
        };
  if (!isRecord(inspection.raw) || !isRecord(inspection.raw.profiles)) return { status: "invalid" };
  const store = coercePersistedAuthProfileStore(inspection.raw);
  const rawProfileIds = Object.keys(inspection.raw.profiles);
  if (
    !store ||
    rawProfileIds.length !== Object.keys(store.profiles).length ||
    rawProfileIds.some((profileId) => !Object.hasOwn(store.profiles, profileId))
  )
    return { status: "invalid" };
  return {
    status: "ok",
    store: {
      ...store,
      ...mergeAuthProfileState(coerceAuthProfileState(inspection.raw), persistedState),
    },
    hasAuthTables: true,
  };
}
function listRetainedStateAgentDirs(env) {
  const agentsRoot = path.join(resolveStateDir(env), "agents");
  let entries;
  try {
    entries = fs.readdirSync(agentsRoot, { withFileTypes: true });
  } catch (error) {
    const code = error.code;
    return code === "ENOENT" || code === "ENOTDIR" ? [] : null;
  }
  const agentDirs = [];
  for (const entry of entries) {
    if (!entry.isDirectory() && !entry.isSymbolicLink()) continue;
    const agentDir = path.join(agentsRoot, entry.name, "agent");
    try {
      if (fs.statSync(agentDir).isDirectory()) agentDirs.push(path.resolve(agentDir));
      else return null;
    } catch (error) {
      const code = error.code;
      if (entry.isSymbolicLink() || (code !== "ENOENT" && code !== "ENOTDIR")) return null;
      try {
        fs.lstatSync(agentDir);
        return null;
      } catch (lstatError) {
        const lstatCode = lstatError.code;
        if (lstatCode !== "ENOENT" && lstatCode !== "ENOTDIR") return null;
      }
    }
  }
  return agentDirs;
}
function loadConfiguredAgentAuthStores(cfg, env) {
  const order = readValidConfiguredAuthOrder(cfg);
  if (!order || !hasValidConfiguredAuthProfiles(cfg)) return;
  const mainAgentDir = path.resolve(resolveDefaultAgentDir({}, env));
  const activeAgentDirs = /* @__PURE__ */ new Set();
  const expectedAgentIdsByDir = /* @__PURE__ */ new Map();
  const addExpectedAgentDir = (agentDir, agentId) => {
    const owners = expectedAgentIdsByDir.get(agentDir) ?? /* @__PURE__ */ new Set();
    owners.add(normalizeAgentId(agentId));
    expectedAgentIdsByDir.set(agentDir, owners);
  };
  addExpectedAgentDir(mainAgentDir, DEFAULT_AGENT_ID);
  for (const agentId of listAgentIds(cfg)) {
    const agentDir = path.resolve(resolveAgentDir(cfg, agentId, env));
    activeAgentDirs.add(agentDir);
    addExpectedAgentDir(agentDir, agentId);
  }
  const envAgentDir = env.OPENCLAW_AGENT_DIR?.trim() || env.PI_CODING_AGENT_DIR?.trim() || void 0;
  if (envAgentDir) {
    const agentDir = path.resolve(resolveUserPath(envAgentDir, env));
    activeAgentDirs.add(agentDir);
    addExpectedAgentDir(agentDir, resolveAuthProfileDatabaseOwnerId(agentDir));
  }
  const retainedAgentDirs = listRetainedStateAgentDirs(env);
  if (!retainedAgentDirs)
    return {
      status: "blocked",
      warnings: [INVALID_SQLITE_STORE_WARNING],
    };
  const agentDirs = /* @__PURE__ */ new Set([
    mainAgentDir,
    ...activeAgentDirs,
    ...retainedAgentDirs,
  ]);
  const entries = [];
  for (const agentDir of agentDirs) {
    const expectedAgentIds = expectedAgentIdsByDir.get(agentDir);
    if (expectedAgentIds && expectedAgentIds.size !== 1)
      return {
        status: "blocked",
        warnings: [INVALID_SQLITE_STORE_WARNING],
      };
    const legacyAvailability = inspectUnmigratedAuthStoreSources(agentDir);
    if (legacyAvailability === "unreadable")
      return {
        status: "blocked",
        warnings: [INVALID_SQLITE_STORE_WARNING],
      };
    if (legacyAvailability === "present") return;
    const databasePath = path.resolve(resolveAuthProfileDatabasePath(agentDir));
    const availability = inspectAuthDatabaseFiles(agentDir);
    if (availability === "unreadable")
      return {
        status: "blocked",
        warnings: [INVALID_SQLITE_STORE_WARNING],
      };
    const owner =
      availability === "present" ? inspectOpenClawAgentDatabaseOwner(databasePath) : void 0;
    if (owner) {
      if (
        owner.status === "unreadable" ||
        (expectedAgentIds && owner.status === "owned" && !expectedAgentIds.has(owner.agentId))
      )
        return {
          status: "blocked",
          warnings: [INVALID_SQLITE_STORE_WARNING],
        };
    }
    const loaded = loadCompletePersistedStore(agentDir);
    if (loaded.status === "invalid")
      return {
        status: "blocked",
        warnings: [INVALID_SQLITE_STORE_WARNING],
      };
    if (owner?.status === "unowned" && loaded.hasAuthTables)
      return {
        status: "blocked",
        warnings: [INVALID_SQLITE_STORE_WARNING],
      };
    entries.push({
      agentDir,
      databasePath,
      store: loaded.store,
    });
  }
  let registeredDatabases;
  try {
    const registryEntries = listOpenClawRegisteredAgentDatabases({ env });
    if (registryEntries.some((entry) => !entry.path.trim() || !path.isAbsolute(entry.path))) return;
    const authDatabaseBasename = path.basename(resolveAuthProfileDatabasePath(mainAgentDir));
    registeredDatabases = registryEntries.flatMap((entry) =>
      path.basename(entry.path) === authDatabaseBasename
        ? [
            {
              agentId: entry.agentId,
              path: path.resolve(entry.path),
            },
          ]
        : [],
    );
  } catch {
    return;
  }
  const entriesByDatabasePath = new Map(entries.map((entry) => [entry.databasePath, entry]));
  const registeredEntries = [];
  const registeredOwnersByPath = /* @__PURE__ */ new Map();
  for (const entry of registeredDatabases) {
    const owners = registeredOwnersByPath.get(entry.path) ?? /* @__PURE__ */ new Set();
    owners.add(entry.agentId);
    registeredOwnersByPath.set(entry.path, owners);
  }
  for (const [databasePath, owners] of registeredOwnersByPath) {
    const agentDir = path.dirname(databasePath);
    if (path.resolve(resolveAuthProfileDatabasePath(agentDir)) !== databasePath) continue;
    const legacyAvailability = inspectUnmigratedAuthStoreSources(agentDir);
    if (legacyAvailability === "unreadable")
      return {
        status: "blocked",
        warnings: [INVALID_SQLITE_STORE_WARNING],
      };
    if (legacyAvailability === "present") return;
    const availability = inspectAuthDatabaseFiles(agentDir);
    if (availability === "missing") continue;
    if (availability === "unreadable")
      return {
        status: "blocked",
        warnings: [INVALID_SQLITE_STORE_WARNING],
      };
    const owner = inspectOpenClawAgentDatabaseOwner(databasePath);
    if (owner.status !== "owned" || !owners.has(owner.agentId))
      return {
        status: "blocked",
        warnings: [INVALID_SQLITE_STORE_WARNING],
      };
    const loaded = loadCompletePersistedStore(agentDir);
    if (loaded.status === "invalid")
      return {
        status: "blocked",
        warnings: [INVALID_SQLITE_STORE_WARNING],
      };
    const knownEntry = entriesByDatabasePath.get(databasePath);
    if (knownEntry) {
      knownEntry.store = loaded.store;
      continue;
    }
    registeredEntries.push({
      agentDir,
      store: loaded.store,
    });
  }
  const emptyStore = {
    version: 1,
    profiles: {},
  };
  const mainStore = entries.find((entry) => entry.agentDir === mainAgentDir)?.store ?? emptyStore;
  const agentStores = entries.map((entry) => {
    const localStore = entry.store ?? emptyStore;
    return entry.agentDir === mainAgentDir
      ? mainStore
      : mergeAuthProfileStores(mainStore, localStore, {
          preserveBaseRuntimeExternalProfiles: true,
        });
  });
  const activeStores = entries.flatMap((entry, index) =>
    activeAgentDirs.has(entry.agentDir) ? [agentStores[index] ?? emptyStore] : [],
  );
  const stores = [
    ...agentStores,
    ...registeredEntries.flatMap((entry) => (entry.store ? [entry.store] : [])),
  ];
  const providerIds = Object.keys(order);
  const profileIds = Object.values(order).flat();
  const runtimeProfileIds = /* @__PURE__ */ new Set();
  const runtimeEntries = [
    ...entries.map((entry, index) => ({
      agentDir: entry.agentDir,
      store: agentStores[index] ?? emptyStore,
    })),
    ...registeredEntries.map((entry) => ({
      agentDir: entry.agentDir,
      store: mergeAuthProfileStores(mainStore, entry.store ?? emptyStore, {
        preserveBaseRuntimeExternalProfiles: true,
      }),
    })),
  ];
  try {
    for (const entry of runtimeEntries) {
      const externalProfiles = listRuntimeExternalAuthProfiles({
        store: entry.store,
        agentDir: entry.agentDir,
        env,
        externalCli: {
          allowKeychainPrompt: false,
          config: cfg,
          externalCliProviderIds: providerIds,
          externalCliProfileIds: profileIds,
        },
      });
      for (const profile of externalProfiles) runtimeProfileIds.add(profile.profileId);
    }
  } catch {
    return;
  }
  return {
    status: "ready",
    stores,
    activeStores,
    runtimeProfileIds,
  };
}
function removeAuthOrderKeys(cfg, providers) {
  const order = Object.fromEntries(
    Object.entries(readValidConfiguredAuthOrder(cfg) ?? {}).filter(
      ([provider]) => !providers.has(provider),
    ),
  );
  return {
    ...cfg,
    auth: {
      ...cfg.auth,
      order,
    },
  };
}
/** Find nonempty config orders that only reference removed profiles. */
function scanStaleConfiguredAuthOrders(params) {
  const order = readValidConfiguredAuthOrder(params.cfg);
  if (!order || !hasValidConfiguredAuthProfiles(params.cfg)) return [];
  const configuredProfileIds = new Set(Object.keys(params.cfg.auth?.profiles ?? {}));
  const storedProfileIds = new Set(params.stores.flatMap((store) => Object.keys(store.profiles)));
  const staleByCanonicalProvider = /* @__PURE__ */ new Map();
  for (const [provider, profileIds] of Object.entries(order)) {
    if (
      profileIds.length === 0 ||
      profileIds.some(
        (profileId) =>
          configuredProfileIds.has(profileId) ||
          storedProfileIds.has(profileId) ||
          params.runtimeProfileIds?.has(profileId),
      )
    )
      continue;
    const canonicalProvider = resolveProviderIdForAuth(provider, { config: params.cfg });
    const entries = staleByCanonicalProvider.get(canonicalProvider) ?? [];
    entries.push({
      provider,
      staleProfileCount: profileIds.length,
    });
    staleByCanonicalProvider.set(canonicalProvider, entries);
  }
  const hits = [];
  for (const [canonicalProvider, staleEntries] of staleByCanonicalProvider) {
    const staleProviders = new Set(staleEntries.map((entry) => entry.provider));
    const cfgWithoutStaleOrder = removeAuthOrderKeys(params.cfg, staleProviders);
    const fallbackStores = params.activeStores ?? params.stores;
    if (
      fallbackStores.length > 0 &&
      fallbackStores.every((store) => {
        const selectionStore = structuredClone(store);
        return (
          resolveAuthProfileOrder({
            cfg: cfgWithoutStaleOrder,
            store: selectionStore,
            provider: canonicalProvider,
          }).length > 0
        );
      })
    )
      hits.push(...staleEntries);
  }
  return hits;
}
/** Remove provably stale config orders and restore per-agent automatic selection. */
function repairStaleConfiguredAuthOrders(params) {
  const hits = scanStaleConfiguredAuthOrders(params);
  if (hits.length === 0)
    return {
      config: params.cfg,
      changes: [],
    };
  return {
    config: removeAuthOrderKeys(params.cfg, new Set(hits.map((hit) => hit.provider))),
    changes: hits.map(
      (hit) =>
        `auth.order.${hit.provider}: removed ${hit.staleProfileCount} missing profile reference${hit.staleProfileCount === 1 ? "" : "s"} to restore automatic per-agent auth selection.`,
    ),
  };
}
/** Load configured agent stores and repair their stale config auth orders. */
function maybeRepairStaleConfiguredAuthOrders(params) {
  if (!hasNonemptyConfiguredAuthOrder(params.cfg))
    return {
      config: params.cfg,
      changes: [],
    };
  const loaded = loadConfiguredAgentAuthStores(params.cfg, params.env ?? process.env);
  if (!loaded)
    return {
      config: params.cfg,
      changes: [],
    };
  if (loaded.status === "blocked")
    return {
      config: params.cfg,
      changes: [],
      warnings: loaded.warnings,
    };
  return repairStaleConfiguredAuthOrders({
    cfg: params.cfg,
    ...loaded,
  });
}
/** Build preview warnings for stale config auth orders. */
function collectStaleConfiguredAuthOrderWarnings(params) {
  if (!hasNonemptyConfiguredAuthOrder(params.cfg)) return [];
  const loaded = loadConfiguredAgentAuthStores(params.cfg, params.env ?? process.env);
  if (!loaded) return [];
  if (loaded.status === "blocked") return loaded.warnings;
  return scanStaleConfiguredAuthOrders({
    cfg: params.cfg,
    ...loaded,
  }).map(
    (hit) =>
      `- auth.order.${hit.provider} references only missing profiles while compatible stored credentials exist; run ${params.doctorFixCommand} to remove the stale override and restore automatic selection.`,
  );
}
//#endregion
export {
  maybeRepairStaleConfiguredAuthOrders as n,
  repairStaleConfiguredAuthOrders as r,
  collectStaleConfiguredAuthOrderWarnings as t,
};
