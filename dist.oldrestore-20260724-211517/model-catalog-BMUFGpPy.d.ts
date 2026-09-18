import {
  Ai as AuthStorage,
  Ci as ModelRegistry,
  Ii as PluginModelCatalogMetadataSnapshot,
} from "./index-BktXvOF0.js";
import {
  n as ModelCatalogSnapshot,
  r as ModelInputType,
  t as ModelCatalogEntry,
} from "./model-catalog.types-DCVmZqMZ.js";
import { n as PluginMetadataSnapshot } from "./plugin-metadata-snapshot.types-Cto61spH.js";
import { m as ExternalCliAuthDiscovery } from "./store-TQsl5_Yq.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/agents/agent-auth-credentials.d.ts
type AgentApiKeyCredential = {
  type: "api_key";
  key: string;
};
type AgentOAuthCredential = {
  type: "oauth";
  access: string;
  refresh: string;
  expires: number;
};
/** Credential value shape consumed by agent runtimes after auth-profile normalization. */
type AgentCredential = AgentApiKeyCredential | AgentOAuthCredential;
type AgentCredentialMap = Record<string, AgentCredential>;
//#endregion
//#region src/agents/agent-auth-discovery-core.d.ts
/** Options for discovering env-backed credentials during agent auth discovery. */
type AgentDiscoveryAuthLookupOptions = {
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
};
/** Adds provider credentials resolvable from env/config without mutating existing credentials. */
declare function addEnvBackedAgentCredentials(
  credentials: AgentCredentialMap,
  options?: AgentDiscoveryAuthLookupOptions,
): AgentCredentialMap;
//#endregion
//#region src/agents/agent-auth-discovery.d.ts
/** Options for discovering credentials without prompting for secret material. */
type DiscoverAuthStorageOptions = {
  externalCli?: ExternalCliAuthDiscovery;
  readOnly?: boolean;
  skipExternalAuthProfiles?: boolean;
  skipCredentials?: boolean;
  syntheticAuthProviderRefs?: Iterable<string>;
} & AgentDiscoveryAuthLookupOptions;
/** Resolves agent credentials from auth profiles, env, and synthetic auth hooks. */
declare function resolveAgentCredentialsForDiscovery(
  agentDir: string,
  options?: DiscoverAuthStorageOptions,
): AgentCredentialMap;
declare namespace agent_model_discovery_d_exports {
  export {
    DiscoverAuthStorageOptions,
    addEnvBackedAgentCredentials,
    discoverAuthStorage,
    discoverModels,
    normalizeDiscoveredAgentModel,
    resolveAgentCredentialsForDiscovery,
  };
}
type DiscoverModelsOptions = {
  config?: OpenClawConfig;
  providerFilter?: string;
  pluginMetadataSnapshot?: PluginModelCatalogMetadataSnapshot;
  workspaceDir?: string;
  normalizeModels?: boolean;
};
/** Applies plugin model normalization and transport hooks to discovered agent models. */
declare function normalizeDiscoveredAgentModel<T>(
  value: T,
  agentDir: string,
  options?: Pick<DiscoverModelsOptions, "config" | "workspaceDir">,
): T;
/** Creates auth storage for model discovery from stored and env-backed credentials. */
/** Builds auth storage for model discovery without prompting for secrets. */
declare function discoverAuthStorage(
  agentDir: string,
  options?: DiscoverAuthStorageOptions,
): AuthStorage;
/** Creates the model registry used by agent model discovery. */
/** Creates a model registry for one agent directory, optionally filtered and plugin-normalized. */
declare function discoverModels(
  authStorage: AuthStorage,
  agentDir: string,
  options?: DiscoverModelsOptions,
): ModelRegistry;
//#endregion
//#region src/agents/model-catalog-lookup.d.ts
/** Returns whether a catalog entry declares support for an input modality. */
declare function modelSupportsInput(
  entry: ModelCatalogEntry | undefined,
  input: ModelInputType,
): boolean;
/** Finds a provider-qualified model entry in a catalog. */
declare function findModelInCatalog(
  catalog: ModelCatalogEntry[],
  provider: string,
  modelId: string,
): ModelCatalogEntry | undefined;
/** Finds a model entry, requiring uniqueness when provider is omitted. */
declare function findModelCatalogEntry(
  catalog: ModelCatalogEntry[],
  params: {
    provider?: string;
    modelId: string;
  },
): ModelCatalogEntry | undefined;
//#endregion
//#region src/agents/model-catalog.d.ts
type AgentDiscoveryModule = typeof agent_model_discovery_d_exports;
type LoadModelCatalogParams = {
  agentDir?: string;
  config?: OpenClawConfig;
  useCache?: boolean;
  cacheOnly?: boolean;
  readOnly?: boolean;
  metadataSnapshot?: PluginMetadataSnapshot;
  workspaceDir?: string;
};
declare function resetModelCatalogCache(): void;
declare function resetModelCatalogCacheForTest(): void;
declare function setModelCatalogImportForTest(loader?: () => Promise<AgentDiscoveryModule>): void;
declare function loadManifestModelCatalog(params: {
  config: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  fallbackToMetadataScan?: boolean;
  metadataSnapshot?: PluginMetadataSnapshot;
}): ModelCatalogEntry[];
/** Loads logical entries together with browse-only physical route provenance. */
declare function loadModelCatalogSnapshot(
  params?: LoadModelCatalogParams,
): Promise<ModelCatalogSnapshot>;
/** Loads the deduplicated logical catalog for runtime and legacy consumers. */
declare function loadModelCatalog(params?: LoadModelCatalogParams): Promise<ModelCatalogEntry[]>;
/**
 * Check if a model supports image input based on its catalog entry.
 */
declare function modelSupportsVision(entry: ModelCatalogEntry | undefined): boolean;
/**
 * Check if a model supports native document/PDF input based on its catalog entry.
 */
declare function modelSupportsDocument(entry: ModelCatalogEntry | undefined): boolean;
//#endregion
export {
  modelSupportsDocument as a,
  resetModelCatalogCacheForTest as c,
  findModelInCatalog as d,
  modelSupportsInput as f,
  loadModelCatalogSnapshot as i,
  setModelCatalogImportForTest as l,
  loadManifestModelCatalog as n,
  modelSupportsVision as o,
  loadModelCatalog as r,
  resetModelCatalogCache as s,
  LoadModelCatalogParams as t,
  findModelCatalogEntry as u,
};
