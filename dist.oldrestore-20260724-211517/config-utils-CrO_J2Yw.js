import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import "./fs-utils-urkAyyL8.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import {
  _ as uniqueStrings,
  l as normalizeStringEntries,
} from "./string-normalization-CRyoFBPt.js";
//#region packages/memory-host-sdk/src/host/config-utils.ts
/** Root memory filename used in agent workspaces. */
const MEMORY_HOST_ROOT_FILENAME = "MEMORY.md";
const DEFAULT_AGENT_ID = "main";
const LEGACY_STATE_DIRNAMES = [".clawdbot"];
const NEW_STATE_DIRNAME = ".openclaw";
/** Treat shell-placeholder home values as absent. */
function normalizeHomeValue(value) {
  const trimmed = normalizeOptionalString(value);
  if (!trimmed || trimmed === "undefined" || trimmed === "null") return;
  return trimmed;
}
/** Resolve the underlying OS home before applying OpenClaw-specific overrides. */
function resolveRawOsHomeDir(env, homedir) {
  return (
    normalizeHomeValue(env.HOME) ??
    normalizeHomeValue(env.USERPROFILE) ??
    normalizeHomeValue(homedir())
  );
}
/** Resolve OPENCLAW_HOME or the OS home, falling back to cwd for hermetic tests. */
function resolveRequiredHomeDir(env = process.env, homedir = os.homedir) {
  const explicitHome = normalizeHomeValue(env.OPENCLAW_HOME);
  const rawHome = explicitHome
    ? explicitHome.replace(/^~(?=$|[\\/])/, resolveRawOsHomeDir(env, homedir) ?? "")
    : resolveRawOsHomeDir(env, homedir);
  return rawHome ? path.resolve(rawHome) : path.resolve(process.cwd());
}
/** Resolve standalone memory-host paths without importing core home-directory policy. */
function resolveMemoryHostUserPath(input, env = process.env, homedir = os.homedir) {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith("~"))
    return path.resolve(trimmed.replace(/^~(?=$|[\\/])/, resolveRequiredHomeDir(env, homedir)));
  return path.resolve(trimmed);
}
/** Return legacy state roots in priority order. */
function legacyStateDirs(homedir) {
  return LEGACY_STATE_DIRNAMES.map((dir) => path.join(homedir(), dir));
}
/** Resolve the current state root while preserving shipped legacy installs when present. */
function resolveStateDir(env = process.env, homedir = os.homedir) {
  const override = env.OPENCLAW_STATE_DIR?.trim();
  if (override) return resolveMemoryHostUserPath(override, env, homedir);
  const effectiveHome = () => resolveRequiredHomeDir(env, homedir);
  const nextDir = path.join(effectiveHome(), NEW_STATE_DIRNAME);
  if (env.OPENCLAW_TEST_FAST === "1" || fs.existsSync(nextDir)) return nextDir;
  return (
    legacyStateDirs(effectiveHome).find((dir) => {
      try {
        return fs.existsSync(dir);
      } catch {
        return false;
      }
    }) ?? nextDir
  );
}
/** Resolve the default agent workspace, partitioned by OPENCLAW_PROFILE when set. */
function resolveDefaultAgentWorkspaceDir(env = process.env) {
  const home = resolveRequiredHomeDir(env, os.homedir);
  const profile = env.OPENCLAW_PROFILE?.trim();
  if (profile && normalizeLowercaseStringOrEmpty(profile) !== "default")
    return path.join(home, ".openclaw", `workspace-${profile}`);
  return path.join(home, ".openclaw", "workspace");
}
/** Return configured agent entries after dropping nullish placeholders. */
function listAgentEntries(cfg) {
  return Array.isArray(cfg.agents?.list) ? cfg.agents.list.filter((entry) => Boolean(entry)) : [];
}
/** Resolve the default agent id from explicit default marker or first agent entry. */
function resolveDefaultAgentId(cfg) {
  const agents = listAgentEntries(cfg);
  if (agents.length === 0) return DEFAULT_AGENT_ID;
  const chosen = (agents.find((agent) => agent.default) ?? agents[0])?.id;
  return normalizeAgentId(chosen || DEFAULT_AGENT_ID);
}
/** Find one agent config by canonical id. */
function resolveAgentConfig(cfg, agentId) {
  const id = normalizeAgentId(agentId);
  return listAgentEntries(cfg).find((entry) => normalizeAgentId(entry.id) === id);
}
/** Remove null bytes before paths are handed to filesystem APIs. */
function stripNullBytes(value) {
  return value.replaceAll("\0", "");
}
/** Resolve the workspace directory for an agent id and config defaults. */
function resolveMemoryHostAgentWorkspaceDir(cfg, agentId, env = process.env) {
  const id = normalizeAgentId(agentId);
  const configured = resolveAgentConfig(cfg, id)?.workspace?.trim();
  if (configured) return stripNullBytes(resolveMemoryHostUserPath(configured, env));
  const fallback = cfg.agents?.defaults?.workspace?.trim();
  if (id === resolveDefaultAgentId(cfg))
    return stripNullBytes(
      fallback ? resolveMemoryHostUserPath(fallback, env) : resolveDefaultAgentWorkspaceDir(env),
    );
  if (fallback) return stripNullBytes(path.join(resolveMemoryHostUserPath(fallback, env), id));
  return stripNullBytes(path.join(resolveStateDir(env), `workspace-${id}`));
}
/** Resolve context limits for an agent with defaults fallback. */
function resolveMemoryHostAgentContextLimits(cfg, agentId) {
  const defaults = cfg?.agents?.defaults?.contextLimits;
  if (!cfg || !agentId) return defaults;
  return resolveAgentConfig(cfg, agentId)?.contextLimits ?? defaults;
}
/** Resolve enabled memory search config plus deduplicated extra paths for an agent. */
function resolveMemoryHostSearchPathConfig(cfg, agentId) {
  const defaults = cfg.agents?.defaults?.memorySearch;
  const overrides = resolveAgentConfig(cfg, agentId)?.memorySearch;
  const enabled = overrides?.enabled ?? defaults?.enabled ?? true;
  if (!enabled) return null;
  return {
    enabled,
    extraPaths: uniqueStrings(
      normalizeStringEntries([...(defaults?.extraPaths ?? []), ...(overrides?.extraPaths ?? [])]),
    ),
  };
}
//#endregion
export {
  resolveMemoryHostUserPath as a,
  resolveMemoryHostSearchPathConfig as i,
  resolveMemoryHostAgentContextLimits as n,
  resolveMemoryHostAgentWorkspaceDir as r,
  MEMORY_HOST_ROOT_FILENAME as t,
};
