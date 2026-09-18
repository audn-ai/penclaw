import fs from "node:fs";
import path from "node:path";
import "./path-guards-CBe_wA_B.js";
import "./agent-scope-y9xQv_q1.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import {
  o as resolveAgentWorkspaceDir,
  t as listAgentEntries,
} from "./agent-scope-config-DVIR1nBa.js";
import { i as isPathInside } from "./path-DILYn_gk.js";
import { r as lowercasePreservingWhitespace } from "./string-coerce-DW4mBlAt.js";
//#region src/agents/agent-delete-safety.ts
/** Safety checks for deleting agents whose workspaces may overlap other agents. */
function normalizeWorkspacePathForComparison(input) {
  const resolved = path.resolve(input.replaceAll("\0", ""));
  let normalized = resolved;
  try {
    normalized = fs.realpathSync.native(resolved);
  } catch {}
  if (process.platform === "win32") return lowercasePreservingWhitespace(normalized);
  return normalized;
}
function workspacePathsOverlap(left, right) {
  const normalizedLeft = normalizeWorkspacePathForComparison(left);
  const normalizedRight = normalizeWorkspacePathForComparison(right);
  return (
    isPathInside(normalizedRight, normalizedLeft) || isPathInside(normalizedLeft, normalizedRight)
  );
}
/** Lists other agents whose workspaces overlap a candidate delete target. */
function findOverlappingWorkspaceAgentIds(cfg, agentId, workspaceDir) {
  const entries = listAgentEntries(cfg);
  const normalizedAgentId = normalizeAgentId(agentId);
  const overlappingAgentIds = [];
  for (const entry of entries) {
    const otherAgentId = normalizeAgentId(entry.id);
    if (otherAgentId === normalizedAgentId) continue;
    if (workspacePathsOverlap(workspaceDir, resolveAgentWorkspaceDir(cfg, otherAgentId)))
      overlappingAgentIds.push(otherAgentId);
  }
  return overlappingAgentIds;
}
//#endregion
export { findOverlappingWorkspaceAgentIds as t };
