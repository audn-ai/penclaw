import fs from "node:fs";
import { n as evaluateStoredCredentialEligibility } from "./credential-state-DvOWxJSx.js";
import {
  a as resolveLegacyAuthStorePath,
  r as resolveAuthStorePath,
  t as resolveAuthStatePath,
} from "./path-resolve-8wkj2l4Z.js";
import {
  i as coercePersistedAuthProfileStore,
  r as coerceLegacyAuthStore,
} from "./persisted-B2tK2f7d.js";
import {
  l as hasAnyRuntimeAuthProfileStoreSource,
  o as getRuntimeAuthProfileStoreSnapshot,
} from "./runtime-snapshots-BU3oOWrH.js";
import {
  a as readPersistedAuthProfileStoreRaw,
  i as readPersistedAuthProfileStateRaw,
} from "./sqlite-BXljtvPf.js";
//#region src/agents/auth-profiles/source-check.ts
/**
 * Auth-profile source probes for runtime and persisted stores.
 * These checks intentionally avoid loading secret-bearing credential payloads.
 */
function hasStoredAuthProfileFiles(agentDir) {
  return (
    fs.existsSync(resolveAuthStorePath(agentDir)) ||
    fs.existsSync(resolveAuthStatePath(agentDir)) ||
    fs.existsSync(resolveLegacyAuthStorePath(agentDir))
  );
}
function readJsonFile(pathname) {
  try {
    return JSON.parse(fs.readFileSync(pathname, "utf8"));
  } catch {
    return null;
  }
}
function normalizeProvider(provider) {
  return provider.trim().toLowerCase();
}
function isAuthProfileCredential(value) {
  if (!value || typeof value !== "object") return false;
  const credential = value;
  const type = credential.type;
  return (
    typeof credential.provider === "string" &&
    (type === "api_key" || type === "token" || type === "oauth")
  );
}
function isEligibleProviderCredential(rawCredential, expectedProvider) {
  if (!isAuthProfileCredential(rawCredential)) return false;
  return (
    normalizeProvider(rawCredential.provider) === expectedProvider &&
    evaluateStoredCredentialEligibility({ credential: rawCredential }).eligible
  );
}
function coerceRawStoreProfiles(raw) {
  return coercePersistedAuthProfileStore(raw)?.profiles ?? coerceLegacyAuthStore(raw);
}
function rawStoreHasProviderProfile(raw, provider, profileIds) {
  const profiles = coerceRawStoreProfiles(raw);
  if (!profiles) return false;
  const expected = normalizeProvider(provider);
  const credentials =
    profileIds?.map((profileId) => profiles[profileId]) ?? Object.values(profiles);
  for (const rawCredential of credentials)
    if (isEligibleProviderCredential(rawCredential, expected)) return true;
  return false;
}
function runtimeStoreHasProviderProfile(store, provider, profileIds) {
  return rawStoreHasProviderProfile(store, provider, profileIds);
}
/** Returns true when any local/runtime/main auth profile source exists. */
function hasAnyAuthProfileStoreSource(agentDir) {
  if (hasLocalAuthProfileStoreSource(agentDir)) return true;
  if (hasAnyRuntimeAuthProfileStoreSource(agentDir)) return true;
  const authPath = resolveAuthStorePath(agentDir);
  const mainAuthPath = resolveAuthStorePath();
  if (
    agentDir &&
    authPath !== mainAuthPath &&
    (hasStoredAuthProfileFiles(void 0) ||
      readPersistedAuthProfileStoreRaw(void 0) ||
      readPersistedAuthProfileStateRaw(void 0))
  )
    return true;
  return false;
}
/** Returns true when the requested agent dir has a local auth profile source. */
function hasLocalAuthProfileStoreSource(agentDir) {
  const runtimeStore = getRuntimeAuthProfileStoreSnapshot(agentDir);
  if (runtimeStore && Object.keys(runtimeStore.profiles).length > 0) return true;
  if (hasStoredAuthProfileFiles(agentDir)) return true;
  return Boolean(
    readPersistedAuthProfileStoreRaw(agentDir) || readPersistedAuthProfileStateRaw(agentDir),
  );
}
/** Returns true when a read-only auth-profile source contains a profile for a provider. */
function hasAuthProfileStoreSourceForProvider(provider, agentDir, options) {
  if (!normalizeProvider(provider)) return false;
  const profileIds = options?.profileIds;
  if (profileIds?.length === 0) return false;
  if (
    runtimeStoreHasProviderProfile(
      getRuntimeAuthProfileStoreSnapshot(agentDir),
      provider,
      profileIds,
    )
  )
    return true;
  if (
    rawStoreHasProviderProfile(readJsonFile(resolveAuthStorePath(agentDir)), provider, profileIds)
  )
    return true;
  if (
    rawStoreHasProviderProfile(
      readJsonFile(resolveLegacyAuthStorePath(agentDir)),
      provider,
      profileIds,
    )
  )
    return true;
  if (rawStoreHasProviderProfile(readPersistedAuthProfileStoreRaw(agentDir), provider, profileIds))
    return true;
  if (!agentDir) return false;
  if (runtimeStoreHasProviderProfile(getRuntimeAuthProfileStoreSnapshot(), provider, profileIds))
    return true;
  if (rawStoreHasProviderProfile(readJsonFile(resolveAuthStorePath()), provider, profileIds))
    return true;
  if (rawStoreHasProviderProfile(readJsonFile(resolveLegacyAuthStorePath()), provider, profileIds))
    return true;
  return rawStoreHasProviderProfile(readPersistedAuthProfileStoreRaw(), provider, profileIds);
}
//#endregion
export {
  hasAuthProfileStoreSourceForProvider as n,
  hasLocalAuthProfileStoreSource as r,
  hasAnyAuthProfileStoreSource as t,
};
