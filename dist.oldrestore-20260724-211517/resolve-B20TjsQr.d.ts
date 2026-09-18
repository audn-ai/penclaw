import { n as PluginManifestRegistry } from "./manifest-registry-CHEq75Tu.js";
import { h as SecretRefResolveCache } from "./runtime-shared-Djq1PqEV.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
import { h as SecretRef } from "./types.secrets-C15Z_eLX.js";

//#region src/secrets/resolve.d.ts
type ResolveSecretRefOptions = {
  config: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  cache?: SecretRefResolveCache;
  manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
};
/** Error for failures that affect an entire configured secret provider. */
/** Error emitted when a configured secret provider cannot resolve a ref. */
/** Resolves a batch of SecretRefs, grouped by provider for bounded provider concurrency. */
declare function resolveSecretRefValues(
  refs: SecretRef[],
  options: ResolveSecretRefOptions,
): Promise<Map<string, unknown>>;
/** Resolves one SecretRef and requires a non-empty string result. */
declare function resolveSecretRefString(
  ref: SecretRef,
  options: ResolveSecretRefOptions,
): Promise<string>;
//#endregion
export { resolveSecretRefValues as n, resolveSecretRefString as t };
