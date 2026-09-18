import "./agent-scope-y9xQv_q1.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import {
  c as resolveDefaultAgentId,
  n as listAgentIds,
  t as listAgentEntries,
} from "./agent-scope-config-DVIR1nBa.js";
import { t as resolveMemoryBackendConfig } from "./backend-config-B4LH5mk9.js";
import { r as getActiveMemorySearchManager } from "./memory-runtime-CzgrvPt7.js";
import { t as resolveMemorySearchConfig } from "./memory-search-C1x_ATR9.js";
//#region src/gateway/server-startup-memory.ts
/** True when qmd memory config opts into Gateway startup manager work. */
function shouldRunQmdStartupManager(qmd) {
  return (
    qmd.update.startup !== "off" && (qmd.update.onBoot || shouldKeepQmdStartupManagerAlive(qmd))
  );
}
/** True when startup needs the full manager to own QMD background timers. */
function shouldKeepQmdStartupManagerAlive(qmd) {
  return qmd.update.intervalMs > 0 || qmd.update.embedIntervalMs > 0;
}
/** Check whether an agent overrides memory search instead of inheriting defaults. */
function hasExplicitAgentMemorySearchConfig(cfg, agentId) {
  return listAgentEntries(cfg).some(
    (entry) => normalizeAgentId(entry.id) === agentId && entry.memorySearch != null,
  );
}
/** Decide whether an agent's qmd memory manager should start during Gateway boot. */
function shouldEagerlyStartAgentMemory(params) {
  if (params.agentCount <= 1) return true;
  if (params.agentId === resolveDefaultAgentId(params.cfg)) return true;
  if (params.cfg.agents?.defaults?.memorySearch?.enabled === true) return true;
  return hasExplicitAgentMemorySearchConfig(params.cfg, params.agentId);
}
/** Start qmd memory boot sync for eligible agents without eagerly loading every agent. */
async function startGatewayMemoryBackend(params) {
  const agentIds = listAgentIds(params.cfg);
  const bootSyncAgentIds = [];
  const initializedAgentIds = [];
  const deferredAgentIds = [];
  for (const agentId of agentIds) {
    if (!resolveMemorySearchConfig(params.cfg, agentId)) continue;
    const resolved = resolveMemoryBackendConfig({
      cfg: params.cfg,
      agentId,
    });
    if (!resolved) continue;
    if (resolved.backend !== "qmd" || !resolved.qmd) continue;
    if (!shouldRunQmdStartupManager(resolved.qmd)) continue;
    if (
      !shouldEagerlyStartAgentMemory({
        cfg: params.cfg,
        agentId,
        agentCount: agentIds.length,
      })
    ) {
      deferredAgentIds.push(agentId);
      continue;
    }
    const keepManagerAlive = shouldKeepQmdStartupManagerAlive(resolved.qmd);
    const { manager, error } = await getActiveMemorySearchManager({
      cfg: params.cfg,
      agentId,
      purpose: keepManagerAlive ? "default" : "cli",
    });
    if (!manager) {
      params.log.warn(
        `qmd memory startup initialization failed for agent "${agentId}": ${error ?? "unknown error"}`,
      );
      continue;
    }
    if (keepManagerAlive) {
      initializedAgentIds.push(agentId);
      continue;
    }
    try {
      await manager.sync?.({
        reason: "boot",
        force: true,
      });
    } catch (err) {
      params.log.warn(`qmd memory startup boot sync failed for agent "${agentId}": ${String(err)}`);
      continue;
    } finally {
      await manager.close?.().catch((err) => {
        params.log.warn(
          `qmd memory startup manager close failed for agent "${agentId}": ${String(err)}`,
        );
      });
    }
    bootSyncAgentIds.push(agentId);
  }
  if (bootSyncAgentIds.length > 0)
    params.log.info?.(
      `qmd memory startup boot sync completed for ${formatAgentCount(bootSyncAgentIds.length)}: ${bootSyncAgentIds.map((agentId) => `"${agentId}"`).join(", ")}`,
    );
  if (initializedAgentIds.length > 0)
    params.log.info?.(
      `qmd memory startup manager initialized for ${formatAgentCount(initializedAgentIds.length)}: ${initializedAgentIds.map((agentId) => `"${agentId}"`).join(", ")}`,
    );
  if (deferredAgentIds.length > 0)
    params.log.info?.(
      `qmd memory startup initialization deferred for ${formatAgentCount(deferredAgentIds.length)}: ${deferredAgentIds.map((agentId) => `"${agentId}"`).join(", ")}`,
    );
}
function formatAgentCount(count) {
  return count === 1 ? "1 agent" : `${count} agents`;
}
//#endregion
export { startGatewayMemoryBackend };
