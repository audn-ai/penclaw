import fs from "node:fs";
import path from "node:path";
import "./agent-scope-y9xQv_q1.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import "./session-key-druuY-GG.js";
import { c as resolveDefaultAgentId, n as listAgentIds } from "./agent-scope-config-DVIR1nBa.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import {
  l as resolveStorePath,
  t as resolveAgentsDirFromSessionStorePath,
} from "./paths-TfuVT-K8.js";
import { n as resolveAgentSessionDirsFromAgentsDirSync } from "./session-dirs-D4v_ujH0.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/config/sessions/session-sqlite-target.ts
function resolveCustomStoreSqlitePath(params) {
  const resolved = path.resolve(params.storePath);
  const sessionsDir = path.dirname(resolved);
  const sqliteBaseName =
    params.sqliteBaseName ?? (path.basename(resolved, path.extname(resolved)) || "openclaw-agent");
  const agentId = params.agentId ? normalizeAgentId(params.agentId) : void 0;
  const sqliteName =
    agentId && agentId !== "main" && normalizeAgentId(sqliteBaseName) !== agentId
      ? `${sqliteBaseName}.${agentId}`
      : sqliteBaseName;
  return path.join(sessionsDir, `${sqliteName}.sqlite`);
}
/** Resolves the SQLite database target that owns a legacy session store path. */
function resolveSqliteTargetFromSessionStorePath(storePath, options = {}) {
  const resolved = path.resolve(storePath);
  if (path.basename(resolved) === "openclaw-agent.sqlite" || resolved.endsWith(".sqlite")) {
    const agentId = resolveAgentIdFromSqliteDatabasePath(resolved);
    return {
      path: resolved,
      ...(agentId ? { agentId } : {}),
    };
  }
  const sessionsDir = path.dirname(resolved);
  if (path.basename(resolved) !== "sessions.json")
    return {
      path: resolveCustomStoreSqlitePath({
        ...(options.agentId ? { agentId: options.agentId } : {}),
        storePath: resolved,
      }),
    };
  if (path.basename(sessionsDir) !== "sessions")
    return {
      path: resolveCustomStoreSqlitePath({
        ...(options.agentId ? { agentId: options.agentId } : {}),
        sqliteBaseName: "openclaw-agent",
        storePath: resolved,
      }),
    };
  const agentDir = path.dirname(sessionsDir);
  if (path.basename(path.dirname(agentDir)) !== "agents")
    return {
      path: resolveCustomStoreSqlitePath({
        ...(options.agentId ? { agentId: options.agentId } : {}),
        sqliteBaseName: "openclaw-agent",
        storePath: resolved,
      }),
    };
  return {
    agentId: normalizeAgentId(path.basename(agentDir)),
    path: path.join(agentDir, "agent", "openclaw-agent.sqlite"),
  };
}
/** Extracts the agent id from the canonical per-agent SQLite database path. */
function resolveAgentIdFromSqliteDatabasePath(databasePath) {
  if (path.basename(databasePath) !== "openclaw-agent.sqlite") return;
  const agentDbDir = path.dirname(databasePath);
  if (path.basename(agentDbDir) !== "agent") return;
  const agentDir = path.dirname(agentDbDir);
  if (path.basename(path.dirname(agentDir)) !== "agents") return;
  return normalizeAgentId(path.basename(agentDir));
}
//#endregion
//#region src/config/sessions/targets.ts
const NON_FATAL_DISCOVERY_ERROR_CODES = /* @__PURE__ */ new Set([
  "EACCES",
  "ELOOP",
  "ENOENT",
  "ENOTDIR",
  "EPERM",
  "ESTALE",
]);
function dedupeTargetsByStorePath(targets) {
  const deduped = /* @__PURE__ */ new Map();
  for (const target of targets)
    if (!deduped.has(target.storePath)) deduped.set(target.storePath, target);
  return [...deduped.values()];
}
function dedupeTargetsBySqliteTarget(targets) {
  const deduped = /* @__PURE__ */ new Map();
  for (const target of targets) {
    const sqlitePath =
      resolveSqliteTargetFromSessionStorePath(target.storePath, { agentId: target.agentId }).path ??
      target.storePath;
    if (!deduped.has(sqlitePath)) deduped.set(sqlitePath, target);
  }
  return [...deduped.values()];
}
function shouldSkipDiscoveryError(err) {
  const code = err?.code;
  return typeof code === "string" && NON_FATAL_DISCOVERY_ERROR_CODES.has(code);
}
function isWithinRoot(realPath, realRoot) {
  return realPath === realRoot || realPath.startsWith(`${realRoot}${path.sep}`);
}
function shouldSkipDiscoveredAgentDirName(dirName, agentId) {
  return agentId === "main" && normalizeLowercaseStringOrEmpty(dirName) !== "main";
}
function resolveValidatedManagedFilePathSync(params) {
  try {
    const stat = fs.lstatSync(params.filePath);
    if (stat.isSymbolicLink() || !stat.isFile()) return;
    return isWithinRoot(
      fs.realpathSync.native(params.filePath),
      params.realAgentsRoot ?? fs.realpathSync.native(params.agentsRoot),
    )
      ? params.filePath
      : void 0;
  } catch (err) {
    if (shouldSkipDiscoveryError(err)) return;
    throw err;
  }
}
/** Lists agent ids whose session stores should be considered configured. */
function listConfiguredSessionStoreAgentIds(cfg) {
  const ids = new Set(listAgentIds(cfg).map((agentId) => normalizeAgentId(agentId)));
  const addAcpAgentId = (agentId) => {
    const raw = agentId?.trim() ?? "";
    if (!raw || raw === "*") return;
    const normalized = normalizeAgentId(raw);
    ids.add(normalized);
  };
  addAcpAgentId(cfg.acp?.defaultAgent);
  for (const agentId of cfg.acp?.allowedAgents ?? []) addAcpAgentId(agentId);
  const configuredAgents = Array.isArray(cfg.agents?.list) ? cfg.agents.list : [];
  for (const agent of configuredAgents)
    if (agent.runtime?.type === "acp") addAcpAgentId(agent.runtime.acp?.agent ?? agent.id);
  return [...ids];
}
function resolveValidatedDiscoveredStorePathSync(params) {
  const storePath = path.join(params.sessionsDir, "sessions.json");
  const validatedStorePath = resolveValidatedManagedFilePathSync({
    agentsRoot: params.agentsRoot,
    filePath: storePath,
    realAgentsRoot: params.realAgentsRoot,
  });
  if (validatedStorePath) return validatedStorePath;
  const sqlitePath = resolveSqliteTargetFromSessionStorePath(storePath).path;
  if (!sqlitePath) return;
  return resolveValidatedManagedFilePathSync({
    agentsRoot: params.agentsRoot,
    filePath: sqlitePath,
    realAgentsRoot: params.realAgentsRoot,
  })
    ? storePath
    : void 0;
}
function isValidatedRecoveryCandidateSessionsDir(params) {
  const agentDir = path.dirname(params.sessionsDir);
  try {
    const agentStat = fs.lstatSync(agentDir);
    if (agentStat.isSymbolicLink() || !agentStat.isDirectory()) return false;
    if (!isWithinRoot(fs.realpathSync.native(agentDir), params.realAgentsRoot)) return false;
    try {
      const sessionsStat = fs.lstatSync(params.sessionsDir);
      return (
        !sessionsStat.isSymbolicLink() &&
        sessionsStat.isDirectory() &&
        isWithinRoot(fs.realpathSync.native(params.sessionsDir), params.realAgentsRoot)
      );
    } catch (err) {
      return err.code === "ENOENT";
    }
  } catch (err) {
    if (err.code === "ENOENT") return params.allowMissingAgentDir === true;
    if (shouldSkipDiscoveryError(err)) return false;
    throw err;
  }
}
function resolveSessionStoreDiscoveryState(cfg, env) {
  const configuredTargets = resolveSessionStoreTargets(cfg, { allAgents: true }, { env });
  const agentsRoots = /* @__PURE__ */ new Set();
  for (const target of configuredTargets) {
    const agentsDir = resolveAgentsDirFromSessionStorePath(target.storePath);
    if (agentsDir) agentsRoots.add(agentsDir);
  }
  agentsRoots.add(path.join(resolveStateDir(env), "agents"));
  return {
    configuredTargets,
    agentsRoots: [...agentsRoots],
  };
}
function toDiscoveredSessionStoreTarget(sessionsDir, storePath) {
  const dirName = path.basename(path.dirname(sessionsDir));
  const agentId = normalizeAgentId(dirName);
  if (shouldSkipDiscoveredAgentDirName(dirName, agentId)) return;
  return {
    agentId,
    storePath,
  };
}
function resolveExplicitSessionStoreTarget(params) {
  const storePath = resolveStorePath(params.store, {
    agentId: params.defaultAgentId,
    env: params.env,
  });
  return (
    (resolveAgentsDirFromSessionStorePath(storePath)
      ? toDiscoveredSessionStoreTarget(path.dirname(storePath), storePath)
      : void 0) ?? {
      agentId: params.defaultAgentId,
      storePath,
    }
  );
}
/** Resolves all configured and discoverable agent session stores synchronously. */
function resolveAllAgentSessionStoreTargetsSync(cfg, params = {}) {
  const { configuredTargets, agentsRoots } = resolveSessionStoreDiscoveryState(
    cfg,
    params.env ?? process.env,
  );
  const realAgentsRoots = /* @__PURE__ */ new Map();
  const getRealAgentsRoot = (agentsRoot) => {
    const cached = realAgentsRoots.get(agentsRoot);
    if (cached !== void 0) return cached;
    try {
      const realAgentsRoot = fs.realpathSync.native(agentsRoot);
      realAgentsRoots.set(agentsRoot, realAgentsRoot);
      return realAgentsRoot;
    } catch (err) {
      if (shouldSkipDiscoveryError(err)) return;
      throw err;
    }
  };
  const validatedConfiguredTargets = configuredTargets.flatMap((target) => {
    const agentsRoot = resolveAgentsDirFromSessionStorePath(target.storePath);
    if (!agentsRoot) return [target];
    const realAgentsRoot = getRealAgentsRoot(agentsRoot);
    if (!realAgentsRoot) return [];
    const validatedStorePath = resolveValidatedDiscoveredStorePathSync({
      sessionsDir: path.dirname(target.storePath),
      agentsRoot,
      realAgentsRoot,
    });
    return validatedStorePath
      ? [
          {
            ...target,
            storePath: validatedStorePath,
          },
        ]
      : [];
  });
  const discoveredTargets = agentsRoots.flatMap((agentsDir) => {
    try {
      const realAgentsRoot = getRealAgentsRoot(agentsDir);
      if (!realAgentsRoot) return [];
      return resolveAgentSessionDirsFromAgentsDirSync(agentsDir).flatMap((sessionsDir) => {
        const validatedStorePath = resolveValidatedDiscoveredStorePathSync({
          sessionsDir,
          agentsRoot: agentsDir,
          realAgentsRoot,
        });
        const target = validatedStorePath
          ? toDiscoveredSessionStoreTarget(sessionsDir, validatedStorePath)
          : void 0;
        return target ? [target] : [];
      });
    } catch (err) {
      if (shouldSkipDiscoveryError(err)) return [];
      throw err;
    }
  });
  return dedupeTargetsBySqliteTarget([...validatedConfiguredTargets, ...discoveredTargets]);
}
/**
 * Resolves recovery candidates without requiring either the legacy store or SQLite file.
 * Callers must validate the selected artifact before performing filesystem mutations.
 */
function resolveAllAgentSessionStoreCandidateTargetsSync(cfg, params = {}) {
  const { configuredTargets, agentsRoots } = resolveSessionStoreDiscoveryState(
    cfg,
    params.env ?? process.env,
  );
  const realAgentsRoots = /* @__PURE__ */ new Map();
  const getRealAgentsRoot = (agentsRoot) => {
    if (realAgentsRoots.has(agentsRoot)) return realAgentsRoots.get(agentsRoot);
    try {
      const realAgentsRoot = fs.realpathSync.native(agentsRoot);
      realAgentsRoots.set(agentsRoot, realAgentsRoot);
      return realAgentsRoot;
    } catch (err) {
      if (shouldSkipDiscoveryError(err)) {
        realAgentsRoots.set(agentsRoot, void 0);
        return;
      }
      throw err;
    }
  };
  const validatedConfiguredTargets = configuredTargets.flatMap((target) => {
    const agentsRoot = resolveAgentsDirFromSessionStorePath(target.storePath);
    if (!agentsRoot) return [target];
    if (!fs.existsSync(agentsRoot)) return [target];
    const realAgentsRoot = getRealAgentsRoot(agentsRoot);
    return realAgentsRoot &&
      isValidatedRecoveryCandidateSessionsDir({
        allowMissingAgentDir: true,
        realAgentsRoot,
        sessionsDir: path.dirname(target.storePath),
      })
      ? [target]
      : [];
  });
  const discoveredTargets = agentsRoots.flatMap((agentsDir) => {
    try {
      const realAgentsRoot = getRealAgentsRoot(agentsDir);
      if (!realAgentsRoot) return [];
      return resolveAgentSessionDirsFromAgentsDirSync(agentsDir).flatMap((sessionsDir) => {
        if (
          !isValidatedRecoveryCandidateSessionsDir({
            realAgentsRoot,
            sessionsDir,
          })
        )
          return [];
        const target = toDiscoveredSessionStoreTarget(
          sessionsDir,
          path.join(sessionsDir, "sessions.json"),
        );
        return target ? [target] : [];
      });
    } catch (err) {
      if (shouldSkipDiscoveryError(err)) return [];
      throw err;
    }
  });
  return dedupeTargetsBySqliteTarget([...validatedConfiguredTargets, ...discoveredTargets]);
}
/** Resolves session store targets for one agent, including retired/manual stores. */
function resolveAgentSessionStoreTargetsSync(cfg, agentId, params = {}) {
  const env = params.env ?? process.env;
  const requested = normalizeAgentId(agentId);
  const storePaths = /* @__PURE__ */ new Set([
    resolveStorePath(cfg.session?.store, {
      agentId: requested,
      env,
    }),
    resolveStorePath(void 0, {
      agentId: requested,
      env,
    }),
  ]);
  const targets = [];
  const realAgentsRoots = /* @__PURE__ */ new Map();
  const getRealAgentsRoot = (agentsRoot) => {
    if (realAgentsRoots.has(agentsRoot)) return realAgentsRoots.get(agentsRoot);
    try {
      const realAgentsRoot = fs.realpathSync.native(agentsRoot);
      realAgentsRoots.set(agentsRoot, realAgentsRoot);
      return realAgentsRoot;
    } catch (err) {
      if (shouldSkipDiscoveryError(err)) {
        realAgentsRoots.set(agentsRoot, void 0);
        return;
      }
      throw err;
    }
  };
  for (const storePath of storePaths) {
    const agentsRoot = resolveAgentsDirFromSessionStorePath(storePath);
    if (!agentsRoot) {
      targets.push({
        agentId: requested,
        storePath,
      });
      continue;
    }
    const realAgentsRoot = getRealAgentsRoot(agentsRoot);
    if (!realAgentsRoot) continue;
    const validatedStorePath = resolveValidatedDiscoveredStorePathSync({
      sessionsDir: path.dirname(storePath),
      agentsRoot,
      realAgentsRoot,
    });
    if (validatedStorePath)
      targets.push({
        agentId: requested,
        storePath: validatedStorePath,
      });
  }
  const { agentsRoots } = resolveSessionStoreDiscoveryState(cfg, env);
  for (const agentsDir of agentsRoots)
    try {
      const realAgentsRoot = getRealAgentsRoot(agentsDir);
      if (!realAgentsRoot) continue;
      for (const sessionsDir of resolveAgentSessionDirsFromAgentsDirSync(agentsDir)) {
        const target = toDiscoveredSessionStoreTarget(
          sessionsDir,
          path.join(sessionsDir, "sessions.json"),
        );
        if (!target || normalizeAgentId(target.agentId) !== requested) continue;
        const validatedStorePath = resolveValidatedDiscoveredStorePathSync({
          sessionsDir,
          agentsRoot: agentsDir,
          realAgentsRoot,
        });
        if (validatedStorePath)
          targets.push({
            ...target,
            storePath: validatedStorePath,
          });
      }
    } catch (err) {
      if (shouldSkipDiscoveryError(err)) continue;
      throw err;
    }
  return dedupeTargetsByStorePath(targets);
}
/** Resolves session store targets from explicit CLI-style selection options. */
function resolveSessionStoreTargets(cfg, opts, params = {}) {
  const env = params.env ?? process.env;
  const defaultAgentId = resolveDefaultAgentId(cfg);
  const hasAgent = Boolean(opts.agent?.trim());
  const allAgents = opts.allAgents === true;
  if (hasAgent && allAgents) throw new Error("--agent and --all-agents cannot be used together");
  if (opts.store && (hasAgent || allAgents))
    throw new Error("--store cannot be combined with --agent or --all-agents");
  if (opts.store)
    return [
      resolveExplicitSessionStoreTarget({
        defaultAgentId,
        env,
        store: opts.store,
      }),
    ];
  if (allAgents)
    return dedupeTargetsBySqliteTarget(
      listConfiguredSessionStoreAgentIds(cfg).map((agentId) => ({
        agentId,
        storePath: resolveStorePath(cfg.session?.store, {
          agentId,
          env,
        }),
      })),
    );
  if (hasAgent) {
    const knownAgents = listAgentIds(cfg);
    const requested = normalizeAgentId(opts.agent ?? "");
    if (!knownAgents.includes(requested))
      throw new Error(
        `Unknown agent id "${opts.agent}". Use "openclaw agents list" to see configured agents.`,
      );
    return [
      {
        agentId: requested,
        storePath: resolveStorePath(cfg.session?.store, {
          agentId: requested,
          env,
        }),
      },
    ];
  }
  return [
    {
      agentId: defaultAgentId,
      storePath: resolveStorePath(cfg.session?.store, {
        agentId: defaultAgentId,
        env,
      }),
    },
  ];
}
//#endregion
export {
  resolveSessionStoreTargets as a,
  resolveAllAgentSessionStoreTargetsSync as i,
  resolveAgentSessionStoreTargetsSync as n,
  resolveSqliteTargetFromSessionStorePath as o,
  resolveAllAgentSessionStoreCandidateTargetsSync as r,
  listConfiguredSessionStoreAgentIds as t,
};
