import { n as RuntimeWebFetchMetadata } from "../command-secret-gateway-CIYWt4i4.js";
import {
  cu as WebFetchProviderToolDefinition,
  nu as PluginWebFetchProviderEntry,
} from "../types-Ga3mNO_F.js";
import { i as OpenClawConfig } from "../types.openclaw-DDo8sH3F.js";

//#region src/web-fetch/runtime.d.ts
type ResolveWebFetchDefinitionParams = {
  config?: OpenClawConfig;
  sandboxed?: boolean;
  runtimeWebFetch?: RuntimeWebFetchMetadata;
  providerId?: string;
  preferRuntimeProviders?: boolean;
};
type WebFetchDefinitionResolution = {
  provider: PluginWebFetchProviderEntry;
  definition: WebFetchProviderToolDefinition;
} | null;
/** Reports whether a web_fetch provider has usable credentials. */
declare function isWebFetchProviderConfigured(params: {
  provider: Pick<
    PluginWebFetchProviderEntry,
    | "envVars"
    | "getConfiguredCredentialFallback"
    | "getConfiguredCredentialValue"
    | "getCredentialValue"
    | "requiresCredential"
  >;
  config?: OpenClawConfig;
}): boolean;
/** Lists web_fetch providers available to runtime selection. */
declare function listWebFetchProviders(params?: {
  config?: OpenClawConfig;
}): PluginWebFetchProviderEntry[];
declare function clearWebFetchRuntimeCachesForTest(): void;
/** Resolves the executable web_fetch provider tool definition. */
declare function resolveWebFetchDefinition(
  options?: ResolveWebFetchDefinitionParams,
): WebFetchDefinitionResolution;
//#endregion
export {
  clearWebFetchRuntimeCachesForTest,
  isWebFetchProviderConfigured,
  listWebFetchProviders,
  resolveWebFetchDefinition,
};
