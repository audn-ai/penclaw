import path from "node:path";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import "./utils-DtcDeqWS.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import { t as DEFAULT_AGENT_ID } from "./session-key-druuY-GG.js";
import { p as readStringValue } from "./string-coerce-DW4mBlAt.js";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-h9TzWSvp.js";
//#region src/agents/agent-dir-registry.ts
/** Process-local reverse registry from prepared agent directories to agent ids. */
const agentIdByDir = /* @__PURE__ */ new Map();
function normalizeAgentDirKey(agentDir, env = process.env) {
  return path.resolve(resolveUserPath(agentDir, env));
}
/** Register a resolved agent directory for later reverse lookup. */
function registerResolvedAgentDir(params) {
  agentIdByDir.set(
    normalizeAgentDirKey(params.agentDir, params.env),
    normalizeAgentId(params.agentId),
  );
}
/** Resolve the agent id previously registered for an agent directory. */
function resolveRegisteredAgentIdForDir(agentDir, env) {
  return agentIdByDir.get(normalizeAgentDirKey(agentDir, env));
}
//#endregion
//#region src/agents/agent-scope-config.ts
/** Resolves configured agent ids, directories, workspaces, and merged agent defaults. */
let defaultAgentWarned = false;
function warnMultipleDefaultAgents() {
  import("./subsystem-N_s3knpB.js")
    .then(({ createSubsystemLogger }) => {
      createSubsystemLogger("agent-scope").warn(
        "Multiple agents marked default=true; using the first entry as default.",
      );
    })
    .catch(() => void 0);
}
/** Strip null bytes from paths to prevent ENOTDIR errors. */
function stripNullBytes(s) {
  return s.replaceAll("\0", "");
}
/** Lists valid configured agent entries from config. */
function listAgentEntries(cfg) {
  const list = cfg.agents?.list;
  if (!Array.isArray(list)) return [];
  return list.filter((entry) => entry !== null && typeof entry === "object");
}
/** Lists unique configured agent ids, falling back to the default agent id. */
function listAgentIds(cfg) {
  const agents = listAgentEntries(cfg);
  if (agents.length === 0) return [DEFAULT_AGENT_ID];
  const seen = /* @__PURE__ */ new Set();
  const ids = [];
  for (const entry of agents) {
    const id = normalizeAgentId(entry?.id);
    if (seen.has(id)) continue;
    seen.add(id);
    ids.push(id);
  }
  return ids.length > 0 ? ids : [DEFAULT_AGENT_ID];
}
/** Resolves the default agent id, warning once when multiple defaults exist. */
function resolveDefaultAgentId(cfg) {
  const agents = listAgentEntries(cfg);
  if (agents.length === 0) return DEFAULT_AGENT_ID;
  const defaults = agents.filter((agent) => agent?.default);
  if (defaults.length > 1 && !defaultAgentWarned) {
    defaultAgentWarned = true;
    warnMultipleDefaultAgents();
  }
  const chosen = (defaults[0] ?? agents[0])?.id?.trim();
  return normalizeAgentId(chosen || "main");
}
function resolveAgentEntry(cfg, agentId) {
  const id = normalizeAgentId(agentId);
  return listAgentEntries(cfg).find((entry) => normalizeAgentId(entry.id) === id);
}
/** Resolves merged config for one agent id. */
function resolveAgentConfig(cfg, agentId) {
  const entry = resolveAgentEntry(cfg, normalizeAgentId(agentId));
  if (!entry) return;
  const agentDefaults = cfg.agents?.defaults;
  return {
    name: readStringValue(entry.name),
    workspace: readStringValue(entry.workspace),
    agentDir: readStringValue(entry.agentDir),
    model:
      typeof entry.model === "string" || (entry.model && typeof entry.model === "object")
        ? entry.model
        : void 0,
    ...(entry.models ? { models: entry.models } : {}),
    utilityModel: readStringValue(entry.utilityModel),
    thinkingDefault: entry.thinkingDefault,
    verboseDefault: entry.verboseDefault ?? agentDefaults?.verboseDefault,
    reasoningDefault: entry.reasoningDefault,
    fastModeDefault: entry.fastModeDefault,
    contextTokens: entry.contextTokens ?? agentDefaults?.contextTokens,
    contextInjection: entry.contextInjection,
    bootstrapMaxChars: entry.bootstrapMaxChars,
    bootstrapTotalMaxChars: entry.bootstrapTotalMaxChars,
    experimental:
      typeof entry.experimental === "object" && entry.experimental
        ? {
            ...agentDefaults?.experimental,
            ...entry.experimental,
          }
        : agentDefaults?.experimental,
    skills: Array.isArray(entry.skills) ? entry.skills : void 0,
    memorySearch: entry.memorySearch,
    humanDelay: entry.humanDelay,
    tts: entry.tts,
    contextLimits:
      typeof entry.contextLimits === "object" && entry.contextLimits
        ? {
            ...agentDefaults?.contextLimits,
            ...entry.contextLimits,
          }
        : agentDefaults?.contextLimits,
    heartbeat: entry.heartbeat,
    identity: entry.identity,
    groupChat: entry.groupChat,
    subagents: typeof entry.subagents === "object" && entry.subagents ? entry.subagents : void 0,
    runRetries:
      typeof entry.runRetries === "object" && entry.runRetries
        ? {
            ...agentDefaults?.runRetries,
            ...entry.runRetries,
          }
        : agentDefaults?.runRetries,
    embeddedAgent:
      typeof entry.embeddedAgent === "object" && entry.embeddedAgent ? entry.embeddedAgent : void 0,
    sandbox: entry.sandbox,
    tools: entry.tools,
  };
}
function resolveAgentContextLimits(cfg, agentId) {
  const defaults = cfg?.agents?.defaults?.contextLimits;
  if (!cfg || !agentId) return defaults;
  return resolveAgentConfig(cfg, agentId)?.contextLimits ?? defaults;
}
function resolveAgentWorkspaceDir(cfg, agentId, env = process.env) {
  const id = normalizeAgentId(agentId);
  const configured = resolveAgentConfig(cfg, id)?.workspace?.trim();
  if (configured) return stripNullBytes(resolveUserPath(configured, env));
  const defaultAgentId = resolveDefaultAgentId(cfg);
  const fallback = cfg.agents?.defaults?.workspace?.trim();
  if (id === defaultAgentId) {
    if (fallback) return stripNullBytes(resolveUserPath(fallback, env));
    return stripNullBytes(resolveDefaultAgentWorkspaceDir(env));
  }
  if (fallback) return stripNullBytes(path.join(resolveUserPath(fallback, env), id));
  const stateDir = resolveStateDir(env);
  return stripNullBytes(path.join(stateDir, `workspace-${id}`));
}
function resolveAgentDir(cfg, agentId, env = process.env) {
  const id = normalizeAgentId(agentId);
  const configured = resolveAgentConfig(cfg, id)?.agentDir?.trim();
  if (configured) {
    const agentDir = resolveUserPath(configured, env);
    registerResolvedAgentDir({
      agentId: id,
      agentDir,
      env,
    });
    return agentDir;
  }
  const root = resolveStateDir(env);
  const agentDir = path.join(root, "agents", id, "agent");
  registerResolvedAgentDir({
    agentId: id,
    agentDir,
    env,
  });
  return agentDir;
}
function resolveDefaultAgentDir(cfg, env = process.env) {
  return resolveAgentDir(cfg, resolveDefaultAgentId(cfg), env);
}
//#endregion
export {
  resolveAgentDir as a,
  resolveDefaultAgentId as c,
  resolveAgentContextLimits as i,
  registerResolvedAgentDir as l,
  listAgentIds as n,
  resolveAgentWorkspaceDir as o,
  resolveAgentConfig as r,
  resolveDefaultAgentDir as s,
  listAgentEntries as t,
  resolveRegisteredAgentIdForDir as u,
};
