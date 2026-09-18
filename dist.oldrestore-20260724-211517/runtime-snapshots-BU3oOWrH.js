import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { r as resolveAuthStorePath, u as cloneAuthProfileStore } from "./path-resolve-8wkj2l4Z.js";
//#region src/agents/auth-profiles/runtime-snapshots.ts
/**
 * Process-local auth profile snapshots used by prepared runtimes and tests.
 * Snapshots are cloned at boundaries so callers cannot mutate shared state.
 */
const runtimeAuthStoreSnapshots = /* @__PURE__ */ new Map();
let runtimeAuthStoreCredentialsRevision = 0;
let runtimeAuthStoreSnapshotsRevision = 0;
const runtimeAuthStoreSnapshotRevisions = /* @__PURE__ */ new Map();
let persistedMutationRevision = 0;
let evictedOwnerMutationFloor = 0;
const MAX_PERSISTED_MUTATION_OWNERS = 256;
const MAX_PERSISTED_MUTATION_PROFILES_PER_OWNER = 256;
const persistedMutationRecords = /* @__PURE__ */ new Map();
function maxMutationRevision(record) {
  return Math.max(
    record.credentialRevision,
    record.profileSetRevision,
    record.stateRevision,
    record.mutationFloor,
    ...record.profileRevisions.values(),
  );
}
function getOrCreatePersistedMutationRecord(ownerKey) {
  const existing = persistedMutationRecords.get(ownerKey);
  if (existing) {
    persistedMutationRecords.delete(ownerKey);
    persistedMutationRecords.set(ownerKey, existing);
    return existing;
  }
  const record = {
    credentialRevision: evictedOwnerMutationFloor,
    credentialRevisionKnown: evictedOwnerMutationFloor === 0,
    profileSetRevision: evictedOwnerMutationFloor,
    profileSetRevisionKnown: evictedOwnerMutationFloor === 0,
    stateRevision: evictedOwnerMutationFloor,
    stateRevisionKnown: evictedOwnerMutationFloor === 0,
    mutationFloor: evictedOwnerMutationFloor,
    profileRevisions: /* @__PURE__ */ new Map(),
  };
  persistedMutationRecords.set(ownerKey, record);
  while (persistedMutationRecords.size > MAX_PERSISTED_MUTATION_OWNERS) {
    const oldestOwnerKey = persistedMutationRecords.keys().next().value;
    if (oldestOwnerKey === void 0) break;
    const oldest = persistedMutationRecords.get(oldestOwnerKey);
    persistedMutationRecords.delete(oldestOwnerKey);
    if (oldest)
      evictedOwnerMutationFloor = Math.max(evictedOwnerMutationFloor, maxMutationRevision(oldest));
  }
  record.mutationFloor = Math.max(record.mutationFloor, evictedOwnerMutationFloor);
  return record;
}
function setProfileMutationRevision(record, profileId, revision) {
  record.profileRevisions.delete(profileId);
  record.profileRevisions.set(profileId, revision);
  while (record.profileRevisions.size > MAX_PERSISTED_MUTATION_PROFILES_PER_OWNER) {
    const oldestProfileId = record.profileRevisions.keys().next().value;
    if (oldestProfileId === void 0) break;
    const oldestRevision = record.profileRevisions.get(oldestProfileId) ?? 0;
    record.profileRevisions.delete(oldestProfileId);
    record.mutationFloor = Math.max(record.mutationFloor, oldestRevision);
  }
}
function getPersistedMutationRecord(ownerKey) {
  return persistedMutationRecords.get(ownerKey);
}
function credentialState(entries) {
  return Array.from(entries)
    .filter(([, store]) => Object.keys(store.profiles).length > 0)
    .map(([key, store]) => [key, store.profiles])
    .toSorted(([left], [right]) => left.localeCompare(right));
}
function replaceChangesCredentials(entries) {
  const next = new Map(
    entries.map((entry) => [resolveRuntimeStoreKey(entry.agentDir), entry.store]),
  );
  return !isDeepStrictEqual(credentialState(runtimeAuthStoreSnapshots), credentialState(next));
}
function recordChangedSnapshotRevisions(entries) {
  const next = new Map(
    entries.map((entry) => [resolveRuntimeStoreKey(entry.agentDir), entry.store]),
  );
  const keys = /* @__PURE__ */ new Set([...runtimeAuthStoreSnapshots.keys(), ...next.keys()]);
  for (const key of keys) {
    if (isDeepStrictEqual(runtimeAuthStoreSnapshots.get(key), next.get(key))) continue;
    runtimeAuthStoreSnapshotsRevision += 1;
    if (next.has(key))
      runtimeAuthStoreSnapshotRevisions.set(key, runtimeAuthStoreSnapshotsRevision);
    else runtimeAuthStoreSnapshotRevisions.delete(key);
  }
}
function resolveRuntimeStoreKey(agentDir) {
  return resolveAuthStorePath(agentDir);
}
/** Reads a cloned runtime auth profile store snapshot for an agent dir. */
function getRuntimeAuthProfileStoreSnapshot(agentDir) {
  const store = runtimeAuthStoreSnapshots.get(resolveRuntimeStoreKey(agentDir));
  return store ? cloneAuthProfileStore(store) : void 0;
}
/** Lists cloned live snapshots for transactional rollback composition. */
function listRuntimeAuthProfileStoreSnapshots() {
  return Array.from(runtimeAuthStoreSnapshots, ([key, store]) => ({
    agentDir: path.dirname(key),
    store: cloneAuthProfileStore(store),
  }));
}
/** Returns true when a runtime snapshot exists for an agent dir. */
function hasRuntimeAuthProfileStoreSnapshot(agentDir) {
  return runtimeAuthStoreSnapshots.has(resolveRuntimeStoreKey(agentDir));
}
/** Returns true when requested or main runtime snapshots contain profiles. */
function hasAnyRuntimeAuthProfileStoreSource(agentDir) {
  const requestedStore = getRuntimeAuthProfileStoreSnapshot(agentDir);
  if (requestedStore && Object.keys(requestedStore.profiles).length > 0) return true;
  if (!agentDir) return false;
  const mainStore = getRuntimeAuthProfileStoreSnapshot();
  return Boolean(mainStore && Object.keys(mainStore.profiles).length > 0);
}
/** Replaces all runtime auth profile snapshots with cloned entries. */
function replaceRuntimeAuthProfileStoreSnapshots(entries) {
  if (replaceChangesCredentials(entries)) runtimeAuthStoreCredentialsRevision += 1;
  recordChangedSnapshotRevisions(entries);
  runtimeAuthStoreSnapshots.clear();
  for (const entry of entries)
    runtimeAuthStoreSnapshots.set(
      resolveRuntimeStoreKey(entry.agentDir),
      cloneAuthProfileStore(entry.store),
    );
}
/** Clears all runtime auth profile snapshots. */
function clearRuntimeAuthProfileStoreSnapshots() {
  if (credentialState(runtimeAuthStoreSnapshots).length > 0)
    runtimeAuthStoreCredentialsRevision += 1;
  if (runtimeAuthStoreSnapshots.size > 0) runtimeAuthStoreSnapshotsRevision += 1;
  runtimeAuthStoreSnapshots.clear();
  runtimeAuthStoreSnapshotRevisions.clear();
}
/** Clears one runtime auth-profile snapshot without disturbing other active agents. */
function clearRuntimeAuthProfileStoreSnapshot(agentDir) {
  const key = resolveRuntimeStoreKey(agentDir);
  const store = runtimeAuthStoreSnapshots.get(key);
  if (!store) return false;
  if (Object.keys(store.profiles).length > 0) runtimeAuthStoreCredentialsRevision += 1;
  runtimeAuthStoreSnapshotsRevision += 1;
  runtimeAuthStoreSnapshots.delete(key);
  runtimeAuthStoreSnapshotRevisions.delete(key);
  return true;
}
/** Stores a cloned runtime auth profile snapshot for an agent dir. */
function setRuntimeAuthProfileStoreSnapshot(store, agentDir) {
  const key = resolveRuntimeStoreKey(agentDir);
  if (!isDeepStrictEqual(runtimeAuthStoreSnapshots.get(key)?.profiles ?? {}, store.profiles))
    runtimeAuthStoreCredentialsRevision += 1;
  if (!isDeepStrictEqual(runtimeAuthStoreSnapshots.get(key), store)) {
    runtimeAuthStoreSnapshotsRevision += 1;
    runtimeAuthStoreSnapshotRevisions.set(key, runtimeAuthStoreSnapshotsRevision);
  }
  runtimeAuthStoreSnapshots.set(key, cloneAuthProfileStore(store));
}
/**
 * Invalidates prepared credential ownership after a persisted owner-store write.
 * Main-store credentials are inherited by custom-agent snapshots, so those
 * derived snapshots must be dropped even when no exact main snapshot exists.
 * State-only saves refresh them in the publisher without changing credential ownership.
 */
function noteRuntimeAuthProfileStorePersistedMutation(agentDir, mutation) {
  if (!mutation.credentialsChanged && !mutation.profileSetChanged && !mutation.stateChanged) return;
  persistedMutationRevision += 1;
  if (mutation.credentialsChanged) runtimeAuthStoreCredentialsRevision += 1;
  const ownerKey = resolveRuntimeStoreKey(agentDir);
  const record = getOrCreatePersistedMutationRecord(ownerKey);
  if (mutation.profileSetChanged) {
    record.profileSetRevision = persistedMutationRevision;
    record.profileSetRevisionKnown = true;
  }
  if (mutation.credentialsChanged) {
    record.credentialRevision = persistedMutationRevision;
    record.credentialRevisionKnown = true;
    for (const profileId of mutation.profileIds)
      setProfileMutationRevision(record, profileId, persistedMutationRevision);
  }
  if (mutation.stateChanged) {
    record.stateRevision = persistedMutationRevision;
    record.stateRevisionKnown = true;
  }
  const mainKey = resolveRuntimeStoreKey(void 0);
  if (ownerKey !== mainKey || (!mutation.credentialsChanged && !mutation.profileSetChanged)) return;
  let deletedDerivedSnapshot = false;
  for (const key of runtimeAuthStoreSnapshots.keys())
    if (key !== mainKey) {
      runtimeAuthStoreSnapshots.delete(key);
      runtimeAuthStoreSnapshotRevisions.delete(key);
      deletedDerivedSnapshot = true;
    }
  if (deletedDerivedSnapshot) runtimeAuthStoreSnapshotsRevision += 1;
}
function combineMutationTokens(tokens) {
  return {
    revision: Math.max(0, ...tokens.map((token) => token.revision)),
    known: tokens.every((token) => token.known),
  };
}
/** Bounded persisted credential lineage; unknown means its exact token was evicted. */
function getRuntimeAuthProfileStoreCredentialMutationToken(agentDir, profileId, options) {
  const requestedKey = resolveRuntimeStoreKey(agentDir);
  if (!profileId) {
    const record = getPersistedMutationRecord(requestedKey);
    return record
      ? {
          revision: record.credentialRevision,
          known: record.credentialRevisionKnown,
        }
      : {
          revision: evictedOwnerMutationFloor,
          known: evictedOwnerMutationFloor === 0,
        };
  }
  const mainKey = resolveRuntimeStoreKey(void 0);
  return combineMutationTokens(
    (requestedKey === mainKey || options?.includeMain !== true
      ? [requestedKey]
      : [requestedKey, mainKey]
    ).map((key) => {
      const record = getPersistedMutationRecord(key);
      if (!record)
        return {
          revision: evictedOwnerMutationFloor,
          known: evictedOwnerMutationFloor === 0,
        };
      const revision = record.profileRevisions.get(profileId);
      return revision === void 0
        ? {
            revision: record.mutationFloor,
            known: record.mutationFloor === 0,
          }
        : {
            revision,
            known: true,
          };
    }),
  );
}
/** Persisted token for profile-id additions and removals in one owner store. */
function getRuntimeAuthProfileStoreProfileSetMutationToken(agentDir) {
  const record = getPersistedMutationRecord(resolveRuntimeStoreKey(agentDir));
  return record
    ? {
        revision: record.profileSetRevision,
        known: record.profileSetRevisionKnown,
      }
    : {
        revision: evictedOwnerMutationFloor,
        known: evictedOwnerMutationFloor === 0,
      };
}
/** Persisted mutation token for non-secret selection state in one owner store. */
function getRuntimeAuthProfileStoreStateMutationToken(agentDir, options) {
  const requestedKey = resolveRuntimeStoreKey(agentDir);
  const mainKey = resolveRuntimeStoreKey(void 0);
  return combineMutationTokens(
    (requestedKey === mainKey || options?.includeMain !== true
      ? [requestedKey]
      : [requestedKey, mainKey]
    ).map((key) => {
      const record = getPersistedMutationRecord(key);
      return record
        ? {
            revision: record.stateRevision,
            known: record.stateRevisionKnown,
          }
        : {
            revision: evictedOwnerMutationFloor,
            known: evictedOwnerMutationFloor === 0,
          };
    }),
  );
}
/** Stable token for credential ownership without coupling to usage bookkeeping. */
function getRuntimeAuthProfileStoreCredentialsRevision() {
  return runtimeAuthStoreCredentialsRevision;
}
/** Process-local generation for one exact runtime snapshot rollback owner. */
function getRuntimeAuthProfileStoreSnapshotRevision(agentDir) {
  return (
    runtimeAuthStoreSnapshotRevisions.get(resolveRuntimeStoreKey(agentDir)) ??
    runtimeAuthStoreSnapshotsRevision
  );
}
//#endregion
export {
  getRuntimeAuthProfileStoreProfileSetMutationToken as a,
  getRuntimeAuthProfileStoreStateMutationToken as c,
  listRuntimeAuthProfileStoreSnapshots as d,
  noteRuntimeAuthProfileStorePersistedMutation as f,
  getRuntimeAuthProfileStoreCredentialsRevision as i,
  hasAnyRuntimeAuthProfileStoreSource as l,
  setRuntimeAuthProfileStoreSnapshot as m,
  clearRuntimeAuthProfileStoreSnapshots as n,
  getRuntimeAuthProfileStoreSnapshot as o,
  replaceRuntimeAuthProfileStoreSnapshots as p,
  getRuntimeAuthProfileStoreCredentialMutationToken as r,
  getRuntimeAuthProfileStoreSnapshotRevision as s,
  clearRuntimeAuthProfileStoreSnapshot as t,
  hasRuntimeAuthProfileStoreSnapshot as u,
};
