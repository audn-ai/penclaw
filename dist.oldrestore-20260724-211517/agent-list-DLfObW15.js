import fs from "node:fs";
import path from "node:path";
import "./agent-scope-y9xQv_q1.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { c as resolveDefaultAgentId } from "./agent-scope-config-DVIR1nBa.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import { l as normalizeMainKey } from "./session-key-druuY-GG.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/gateway/agent-list.ts
function listExistingAgentIdsFromDisk() {
  const root = resolveStateDir();
  const agentsDir = path.join(root, "agents");
  try {
    return fs
      .readdirSync(agentsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => normalizeAgentId(entry.name))
      .filter(Boolean);
  } catch {
    return [];
  }
}
function listGatewayAgentIds(cfg) {
  const ids = /* @__PURE__ */ new Set();
  const defaultId = normalizeAgentId(resolveDefaultAgentId(cfg));
  ids.add(defaultId);
  for (const entry of cfg.agents?.list ?? []) if (entry?.id) ids.add(normalizeAgentId(entry.id));
  for (const id of listExistingAgentIdsFromDisk()) ids.add(id);
  const sorted = Array.from(ids).filter(Boolean);
  sorted.sort((a, b) => a.localeCompare(b));
  return sorted.includes(defaultId)
    ? [defaultId, ...sorted.filter((id) => id !== defaultId)]
    : sorted;
}
/** Lists gateway-visible agent ids with default/main session metadata. */
function listGatewayAgentsBasic(cfg) {
  const defaultId = normalizeAgentId(resolveDefaultAgentId(cfg));
  const mainKey = normalizeMainKey(cfg.session?.mainKey);
  const scope = cfg.session?.scope ?? "per-sender";
  const configuredById = /* @__PURE__ */ new Map();
  for (const entry of cfg.agents?.list ?? []) {
    if (!entry?.id) continue;
    const configuredName = normalizeOptionalString(entry.name);
    const identityName = normalizeOptionalString(entry.identity?.name);
    configuredById.set(normalizeAgentId(entry.id), { name: configuredName ?? identityName });
  }
  const explicitIds = new Set(
    (cfg.agents?.list ?? [])
      .map((entry) => (entry?.id ? normalizeAgentId(entry.id) : ""))
      .filter(Boolean),
  );
  const allowedIds =
    explicitIds.size > 0 ? /* @__PURE__ */ new Set([...explicitIds, defaultId]) : null;
  let agentIds = listGatewayAgentIds(cfg).filter((id) => (allowedIds ? allowedIds.has(id) : true));
  if (mainKey && !agentIds.includes(mainKey) && (!allowedIds || allowedIds.has(mainKey)))
    agentIds = [...agentIds, mainKey];
  return {
    defaultId,
    mainKey,
    scope,
    agents: agentIds.map((id) => {
      return {
        id,
        name: configuredById.get(id)?.name,
      };
    }),
  };
}
//#endregion
export { listGatewayAgentsBasic as n, listGatewayAgentIds as t };
