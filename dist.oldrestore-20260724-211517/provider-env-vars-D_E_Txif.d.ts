import { n as PluginMetadataSnapshot } from "./plugin-metadata-snapshot.types-Cto61spH.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region src/secrets/provider-env-vars.d.ts
type ProviderEnvVarLookupParams = {
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  includeUntrustedWorkspacePlugins?: boolean;
  metadataSnapshot?: PluginMetadataSnapshot;
};
/** Manifest-provided evidence that a provider auth credential exists outside config. */
type ProviderAuthEvidence = {
  type: "local-file-with-env";
  fileEnvVar?: string;
  fallbackPaths?: readonly string[];
  requiresAnyEnv?: readonly string[];
  requiresAllEnv?: readonly string[];
  credentialMarker: string;
  source?: string;
};
/** Resolves provider env-var candidates used by generic auth lookup. */
/** Resolves provider auth env-var candidates from core fallbacks and plugin metadata. */
declare function resolveProviderAuthEnvVarCandidates(
  params?: ProviderEnvVarLookupParams,
): Record<string, readonly string[]>;
/** Returns known env var candidates for a provider id or alias. */
declare function getProviderEnvVars(
  providerId: string,
  params?: ProviderEnvVarLookupParams,
): string[];
/** Lists known provider auth env vars without bridge-only env vars. */
declare function listKnownProviderAuthEnvVarNames(params?: ProviderEnvVarLookupParams): string[];
/** Returns a copy of an env object with denied keys removed case-insensitively. */
declare function omitEnvKeysCaseInsensitive(
  baseEnv: NodeJS.ProcessEnv,
  keys: Iterable<string>,
): NodeJS.ProcessEnv;
//#endregion
export {
  resolveProviderAuthEnvVarCandidates as a,
  omitEnvKeysCaseInsensitive as i,
  getProviderEnvVars as n,
  listKnownProviderAuthEnvVarNames as r,
  ProviderAuthEvidence as t,
};
