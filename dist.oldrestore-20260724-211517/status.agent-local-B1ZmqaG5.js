import path from "node:path";
import "./agent-scope-y9xQv_q1.js";
import { n as listGatewayAgentsBasic } from "./agent-list-DLfObW15.js";
import { o as resolveAgentWorkspaceDir } from "./agent-scope-config-DVIR1nBa.js";
import { v as pathExists } from "./fs-safe-RNq3oO57.js";
import { l as resolveStorePath } from "./paths-TfuVT-K8.js";
import { y as listSessionEntries } from "./session-accessor-PZVNxFCV.js";
//#region src/commands/status.agent-local.ts
/** Returns per-agent local workspace, bootstrap, session count, and last activity status. */
async function getAgentLocalStatuses(cfg) {
  const agentList = listGatewayAgentsBasic(cfg);
  const now = Date.now();
  const statuses = [];
  for (const agent of agentList.agents) {
    const agentId = agent.id;
    const workspaceDir = (() => {
      try {
        return resolveAgentWorkspaceDir(cfg, agentId);
      } catch {
        return null;
      }
    })();
    const bootstrapPath = workspaceDir != null ? path.join(workspaceDir, "BOOTSTRAP.md") : null;
    const bootstrapPending = bootstrapPath != null ? await pathExists(bootstrapPath) : null;
    const sessionsPath = resolveStorePath(cfg.session?.store, { agentId });
    const sessions = listSessionEntries({
      agentId,
      storePath: sessionsPath,
    })
      .filter(({ sessionKey }) => sessionKey !== "global" && sessionKey !== "unknown")
      .map(({ entry }) => entry);
    const sessionsCount = sessions.length;
    const lastUpdatedAt = sessions.reduce((max, e) => Math.max(max, e?.updatedAt ?? 0), 0);
    const resolvedLastUpdatedAt = lastUpdatedAt > 0 ? lastUpdatedAt : null;
    const lastActiveAgeMs = resolvedLastUpdatedAt ? now - resolvedLastUpdatedAt : null;
    statuses.push({
      id: agentId,
      name: agent.name,
      workspaceDir,
      bootstrapPending,
      sessionsPath,
      sessionsCount,
      lastUpdatedAt: resolvedLastUpdatedAt,
      lastActiveAgeMs,
    });
  }
  const totalSessions = statuses.reduce((sum, s) => sum + s.sessionsCount, 0);
  const bootstrapPendingCount = statuses.reduce((sum, s) => sum + (s.bootstrapPending ? 1 : 0), 0);
  return {
    defaultId: agentList.defaultId,
    agents: statuses,
    totalSessions,
    bootstrapPendingCount,
  };
}
//#endregion
export { getAgentLocalStatuses };
