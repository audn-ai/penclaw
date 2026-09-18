import fs from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
//#region src/agents/session-dirs.ts
/**
 * Agent session directory discovery helpers.
 * Lists per-agent `sessions` directories under state roots in sorted order for
 * callers that scan persisted session stores.
 */
function mapAgentSessionDirs(agentsDir, entries) {
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(agentsDir, entry.name, "sessions"))
    .toSorted((a, b) => a.localeCompare(b));
}
/** Synchronous variant of per-agent session directory discovery. */
function resolveAgentSessionDirsFromAgentsDirSync(agentsDir) {
  let entries;
  try {
    entries = fs.readdirSync(agentsDir, { withFileTypes: true });
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
  return mapAgentSessionDirs(agentsDir, entries);
}
/** Lists per-agent session directories under a state directory. */
async function resolveAgentSessionDirs(stateDir) {
  const agentsDir = path.join(stateDir, "agents");
  let entries;
  try {
    entries = await fs$1.readdir(agentsDir, { withFileTypes: true });
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
  return mapAgentSessionDirs(agentsDir, entries);
}
//#endregion
export { resolveAgentSessionDirsFromAgentsDirSync as n, resolveAgentSessionDirs as t };
