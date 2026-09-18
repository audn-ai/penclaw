import { c as MemoryPluginPublicArtifact } from "./memory-state-wPutFXhr.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region src/plugin-sdk/memory-host-core.d.ts
/** Lists public memory artifacts for one workspace, including notes and event logs. */
declare function listMemoryWorkspacePublicArtifacts(params: {
  workspaceDir: string;
  agentIds: string[];
}): Promise<MemoryPluginPublicArtifact[]>;
/** Lists public memory artifacts across all configured memory workspaces. */
declare function listMemoryHostPublicArtifacts(params: {
  cfg: OpenClawConfig;
}): Promise<MemoryPluginPublicArtifact[]>;
//#endregion
export { listMemoryWorkspacePublicArtifacts as n, listMemoryHostPublicArtifacts as t };
