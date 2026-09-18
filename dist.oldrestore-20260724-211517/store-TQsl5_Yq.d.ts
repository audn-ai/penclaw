import { t as OpenClawAgentDatabase } from "./openclaw-agent-db-B6Jg3nEa.js";
import { s as AuthProfileStore } from "./types-Dzb4Vh4b.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/agents/auth-profiles/external-cli-discovery.d.ts
/** External CLI auth discovery mode used while loading auth profile stores. */
type ExternalCliAuthDiscovery =
  | {
      mode: "none";
      allowKeychainPrompt?: false;
      config?: OpenClawConfig;
    }
  | {
      mode: "existing";
      allowKeychainPrompt?: boolean;
      config?: OpenClawConfig;
    }
  | {
      mode: "scoped";
      allowKeychainPrompt?: boolean;
      config?: OpenClawConfig;
      providerIds?: Iterable<string>;
      profileIds?: Iterable<string>;
    };
//#endregion
//#region src/agents/auth-profiles/store.d.ts
type LoadAuthProfileStoreOptions = {
  allowKeychainPrompt?: boolean;
  config?: OpenClawConfig;
  database?: OpenClawAgentDatabase;
  externalCli?: ExternalCliAuthDiscovery;
  readOnly?: boolean;
  syncExternalCli?: boolean;
  externalCliProviderIds?: Iterable<string>;
  externalCliProfileIds?: Iterable<string>;
};
type SaveAuthProfileStoreOptions = {
  filterExternalAuthProfiles?: boolean;
  preserveOrderProfileIds?: Iterable<string>;
  preserveStateProfileIds?: Iterable<string>;
  pruneOrderProfileIds?: Iterable<string>;
  syncExternalCli?: boolean;
};
/** Apply an auth store update inside the SQLite write lock. */
declare function updateAuthProfileStoreWithLock(params: {
  agentDir?: string;
  saveOptions?: SaveAuthProfileStoreOptions;
  updater: (store: AuthProfileStore) => boolean;
}): Promise<AuthProfileStore | null>;
/** Load the main auth profile store with runtime external profiles overlaid. */
declare function loadAuthProfileStore(): AuthProfileStore;
/** Loads the effective runtime store for an agent, including inherited main profiles. */
declare function loadAuthProfileStoreForRuntime(
  agentDir?: string,
  options?: LoadAuthProfileStoreOptions,
): AuthProfileStore;
/** Load auth profiles for secret resolution without keychain prompts or writes. */
declare function loadAuthProfileStoreForSecretsRuntime(
  agentDir?: string,
  options?: Pick<
    LoadAuthProfileStoreOptions,
    "config" | "externalCli" | "externalCliProviderIds" | "externalCliProfileIds"
  >,
): AuthProfileStore;
/** Load auth profiles with runtime external profiles removed from the result. */
declare function loadAuthProfileStoreWithoutExternalProfiles(
  agentDir?: string,
  loadOptions?: Pick<LoadAuthProfileStoreOptions, "allowKeychainPrompt">,
): AuthProfileStore;
/** Ensure an auth store is available, including runtime/external profile overlays. */
declare function ensureAuthProfileStore(
  agentDir?: string,
  options?: {
    allowKeychainPrompt?: boolean;
    config?: OpenClawConfig;
    externalCli?: ExternalCliAuthDiscovery;
    externalCliProviderIds?: Iterable<string>;
    externalCliProfileIds?: Iterable<string>;
    readOnly?: boolean;
    syncExternalCli?: boolean;
  },
): AuthProfileStore;
/** Ensure an auth store is available without external profile overlays. */
declare function ensureAuthProfileStoreWithoutExternalProfiles(
  agentDir?: string,
  options?: {
    allowKeychainPrompt?: boolean;
    readOnly?: boolean;
    syncExternalCli?: boolean;
  },
): AuthProfileStore;
/** Find a persisted credential in the scoped store, falling back to the main store. */
declare function findPersistedAuthProfileCredential(params: {
  agentDir?: string;
  profileId: string;
}): AuthProfileStore["profiles"][string] | undefined;
/** Resolve which agent dir owns a persisted profile, accounting for inherited OAuth. */
declare function resolvePersistedAuthProfileOwnerAgentDir(params: {
  agentDir?: string;
  profileId: string;
}): string | undefined;
/** Load the store shape used when applying local-only auth updates. */
declare function ensureAuthProfileStoreForLocalUpdate(agentDir?: string): AuthProfileStore;
/** Replace runtime auth-profile snapshots, used by tests and prepared runtimes. */
declare function replaceRuntimeAuthProfileStoreSnapshots(
  entries: Array<{
    agentDir?: string;
    store: AuthProfileStore;
  }>,
): void;
/** Clear all runtime auth-profile snapshots. */
declare function clearRuntimeAuthProfileStoreSnapshots(): void;
/** Save the auth profile store plus sidecar state, preserving runtime overlay metadata. */
declare function saveAuthProfileStore(
  store: AuthProfileStore,
  agentDir?: string,
  options?: SaveAuthProfileStoreOptions,
  database?: OpenClawAgentDatabase,
): void;
//#endregion
export {
  findPersistedAuthProfileCredential as a,
  loadAuthProfileStoreForSecretsRuntime as c,
  resolvePersistedAuthProfileOwnerAgentDir as d,
  saveAuthProfileStore as f,
  ensureAuthProfileStoreWithoutExternalProfiles as i,
  loadAuthProfileStoreWithoutExternalProfiles as l,
  ExternalCliAuthDiscovery as m,
  ensureAuthProfileStore as n,
  loadAuthProfileStore as o,
  updateAuthProfileStoreWithLock as p,
  ensureAuthProfileStoreForLocalUpdate as r,
  loadAuthProfileStoreForRuntime as s,
  clearRuntimeAuthProfileStoreSnapshots as t,
  replaceRuntimeAuthProfileStoreSnapshots as u,
};
