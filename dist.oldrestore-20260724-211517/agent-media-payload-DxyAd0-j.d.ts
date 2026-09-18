import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region src/media/local-roots.d.ts
type BuildMediaLocalRootsOptions = {
  preferredTmpDir?: string;
};
/** Builds the baseline local media root allowlist from state/config directories. */
declare function buildMediaLocalRoots(
  stateDir: string,
  configDir: string,
  options?: BuildMediaLocalRootsOptions,
): string[];
/** Returns the process default roots where local media reads may resolve generated/cache files. */
declare function getDefaultMediaLocalRoots(): readonly string[];
/** Adds the active agent workspace to the default media roots without exposing all agent state. */
declare function getAgentScopedMediaLocalRoots(
  cfg: OpenClawConfig,
  agentId?: string,
): readonly string[];
/** Adds only concrete local source parent directories to an existing root allowlist. */
declare function appendLocalMediaParentRoots(
  roots: readonly string[],
  mediaSources?: readonly string[],
): string[];
/** Resolves outbound media roots, expanding for local sources only when filesystem policy allows it. */
declare function getAgentScopedMediaLocalRootsForSources(params: {
  cfg: OpenClawConfig;
  agentId?: string;
  mediaSources?: readonly string[];
}): readonly string[];
//#endregion
//#region src/plugin-sdk/agent-media-payload.d.ts
/** Legacy agent media payload layout consumed by older agent adapters. */
type AgentMediaPayload = {
  MediaPath?: string;
  MediaType?: string;
  MediaUrl?: string;
  MediaPaths?: string[];
  MediaUrls?: string[];
  MediaTypes?: string[];
};
/** Convert outbound media descriptors into the legacy agent payload field layout. */
declare function buildAgentMediaPayload(
  mediaList: Array<{
    path: string;
    contentType?: string | null;
  }>,
): AgentMediaPayload;
//#endregion
export {
  getAgentScopedMediaLocalRoots as a,
  buildMediaLocalRoots as i,
  buildAgentMediaPayload as n,
  getAgentScopedMediaLocalRootsForSources as o,
  appendLocalMediaParentRoots as r,
  getDefaultMediaLocalRoots as s,
  AgentMediaPayload as t,
};
