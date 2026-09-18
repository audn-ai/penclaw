import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import "./agent-scope-y9xQv_q1.js";
import { o as resolveAgentWorkspaceDir } from "./agent-scope-config-DVIR1nBa.js";
import { c as parseAgentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/agents/spawned-context.ts
/**
 * Spawned run metadata helpers.
 *
 * Projects tool runtime context into persisted lineage, group routing, workspace, and inherited policy metadata.
 */
/** Normalize optional spawn metadata fields from persisted or tool-provided input. */
function normalizeSpawnedRunMetadata(value) {
  return {
    spawnedBy: normalizeOptionalString(value?.spawnedBy),
    groupId: normalizeOptionalString(value?.groupId),
    groupChannel: normalizeOptionalString(value?.groupChannel),
    groupSpace: normalizeOptionalString(value?.groupSpace),
    workspaceDir: normalizeOptionalString(value?.workspaceDir),
  };
}
/** Project tool runtime context down to the persisted spawned-run metadata shape. */
function mapToolContextToSpawnedRunMetadata(value) {
  return {
    groupId: normalizeOptionalString(value?.agentGroupId),
    groupChannel: normalizeOptionalString(value?.agentGroupChannel),
    groupSpace: normalizeOptionalString(value?.agentGroupSpace),
    workspaceDir: normalizeOptionalString(value?.workspaceDir),
  };
}
/** Resolve which workspace a spawned run should inherit. */
function resolveSpawnedWorkspaceInheritance(params) {
  const explicit = normalizeOptionalString(params.explicitWorkspaceDir);
  if (explicit) return explicit;
  const agentId =
    params.targetAgentId ??
    (params.requesterSessionKey
      ? parseAgentSessionKey(params.requesterSessionKey)?.agentId
      : void 0);
  return agentId ? resolveAgentWorkspaceDir(params.config, normalizeAgentId(agentId)) : void 0;
}
/** Resolve the persisted workspace used when a session re-enters an agent runtime. */
function resolveIngressWorkspaceOverrideForSessionRun(metadata) {
  const normalized = normalizeSpawnedRunMetadata(metadata);
  if (normalized.spawnedBy) return normalized.workspaceDir;
  return normalizeOptionalString(metadata?.cwd);
}
//#endregion
export {
  resolveSpawnedWorkspaceInheritance as i,
  normalizeSpawnedRunMetadata as n,
  resolveIngressWorkspaceOverrideForSessionRun as r,
  mapToolContextToSpawnedRunMetadata as t,
};
