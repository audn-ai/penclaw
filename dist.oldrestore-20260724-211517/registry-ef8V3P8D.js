import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region src/agents/harness/registry.ts
/**
 * Registry for native agent harness implementations and lifecycle cleanup.
 */
/**
 * Process-wide registry for agent harnesses contributed by core and runtime plugins.
 *
 * The registry is global-symbol backed so repeated imports, test module resets, and plugin lazy
 * loads share one harness table inside a running gateway process.
 */
const AGENT_HARNESS_REGISTRY_STATE = Symbol.for("openclaw.agentHarnessRegistryState");
const log = createSubsystemLogger("agents/harness");
function getAgentHarnessRegistryState() {
  const globalState = globalThis;
  globalState[AGENT_HARNESS_REGISTRY_STATE] ??= { harnesses: /* @__PURE__ */ new Map() };
  return globalState[AGENT_HARNESS_REGISTRY_STATE];
}
/** Registers or replaces an agent harness under its trimmed id. */
function registerAgentHarness(harness, options) {
  const id = harness.id.trim();
  getAgentHarnessRegistryState().harnesses.set(id, {
    harness: {
      ...harness,
      id,
      pluginId: harness.pluginId ?? options?.ownerPluginId,
    },
    ownerPluginId: options?.ownerPluginId,
  });
}
/** Returns the harness plus plugin ownership metadata for registry diagnostics. */
function getRegisteredAgentHarness(id) {
  return getAgentHarnessRegistryState().harnesses.get(id.trim());
}
/** Lists registered harness records for selection and lifecycle fan-out. */
function listRegisteredAgentHarnesses() {
  return Array.from(getAgentHarnessRegistryState().harnesses.values());
}
/** Clears all harnesses; intended for tests and controlled registry reloads. */
function clearAgentHarnesses() {
  getAgentHarnessRegistryState().harnesses.clear();
}
/** Restores a prior harness snapshot after tests temporarily replace the registry. */
function restoreRegisteredAgentHarnesses(entries) {
  const map = getAgentHarnessRegistryState().harnesses;
  map.clear();
  for (const entry of entries) map.set(entry.harness.id, entry);
}
/** Calls each registered harness session-reset hook without letting one failure stop the fan-out. */
async function resetRegisteredAgentHarnessSessions(params) {
  await Promise.all(
    listRegisteredAgentHarnesses().map(async (entry) => {
      if (!entry.harness.reset) return;
      try {
        await entry.harness.reset(params);
      } catch (error) {
        log.warn(`${entry.harness.label} session reset hook failed`, {
          harnessId: entry.harness.id,
          error,
        });
      }
    }),
  );
}
/** Calls each registered harness dispose hook during registry shutdown or reload. */
async function disposeRegisteredAgentHarnesses() {
  await Promise.all(
    listRegisteredAgentHarnesses().map(async (entry) => {
      if (!entry.harness.dispose) return;
      try {
        await entry.harness.dispose();
      } catch (error) {
        log.warn(`${entry.harness.label} dispose hook failed`, {
          harnessId: entry.harness.id,
          error,
        });
      }
    }),
  );
}
//#endregion
export {
  registerAgentHarness as a,
  listRegisteredAgentHarnesses as i,
  disposeRegisteredAgentHarnesses as n,
  resetRegisteredAgentHarnessSessions as o,
  getRegisteredAgentHarness as r,
  restoreRegisteredAgentHarnesses as s,
  clearAgentHarnesses as t,
};
