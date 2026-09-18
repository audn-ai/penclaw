import path from "node:path";
import {
  o as resolveAgentWorkspaceDir,
  r as resolveAgentConfig,
} from "./agent-scope-config-DVIR1nBa.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { t as isPassThroughRemoteMediaSource } from "./media-source-url-BL9SUd7E.js";
import { x as safeFileURLToPath } from "./path-DILYn_gk.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import { n as pickSandboxToolPolicy } from "./sandbox-tool-policy-ClB7s2K0.js";
import "./agent-scope-y9xQv_q1.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import "./local-file-access-CBe_wA_B.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-uPgNO8da.js";
import {
  c as mergeAlsoAllowPolicy,
  h as resolveToolProfilePolicy,
} from "./tool-policy-1QHiwXPv.js";
import { t as isToolAllowedByPolicies } from "./tool-policy-match-Bq6mIgOa.js";
import { d as resolveConfigDir } from "./utils-DtcDeqWS.js";
//#region src/agents/tool-fs-policy.ts
function createToolFsPolicy(params) {
  return { workspaceOnly: params.workspaceOnly === true };
}
function resolveToolFsConfig(params) {
  const cfg = params.cfg;
  const globalFs = cfg?.tools?.fs;
  return {
    workspaceOnly:
      (cfg && params.agentId ? resolveAgentConfig(cfg, params.agentId)?.tools?.fs : void 0)
        ?.workspaceOnly ?? globalFs?.workspaceOnly,
  };
}
function resolveEffectiveToolFsWorkspaceOnly(params) {
  return resolveToolFsConfig(params).workspaceOnly === true;
}
function resolveEffectiveToolFsRootExpansionAllowed(params) {
  const cfg = params.cfg;
  if (!cfg) return true;
  const agentTools = params.agentId ? resolveAgentConfig(cfg, params.agentId)?.tools : void 0;
  const globalTools = cfg.tools;
  const profile = agentTools?.profile ?? globalTools?.profile;
  const profileAlsoAllow = new Set(agentTools?.alsoAllow ?? globalTools?.alsoAllow ?? []);
  if (resolveToolFsConfig(params).workspaceOnly === true) return false;
  return isToolAllowedByPolicies("read", [
    mergeAlsoAllowPolicy(
      resolveToolProfilePolicy(profile),
      profileAlsoAllow.size > 0 ? Array.from(profileAlsoAllow) : void 0,
    ),
    pickSandboxToolPolicy(globalTools),
    pickSandboxToolPolicy(agentTools),
  ]);
}
//#endregion
//#region src/media/local-media-path.ts
const DATA_URL_RE = /^data:/i;
const WINDOWS_DRIVE_RE = /^[A-Za-z]:[\\/]/;
/** Resolves a media source to a local path when it is not a remote or data URL. */
function resolveLocalMediaPath(source) {
  const trimmed = source.trim();
  if (!trimmed || isPassThroughRemoteMediaSource(trimmed) || DATA_URL_RE.test(trimmed)) return;
  if (trimmed.startsWith("file://"))
    try {
      return safeFileURLToPath(trimmed);
    } catch {
      return;
    }
  if (trimmed.startsWith("~")) return resolveUserPath(trimmed);
  if (path.isAbsolute(trimmed) || WINDOWS_DRIVE_RE.test(trimmed)) return path.resolve(trimmed);
}
//#endregion
//#region src/media/local-roots.ts
let cachedPreferredTmpDir;
function resolveCachedPreferredTmpDir() {
  if (!cachedPreferredTmpDir) cachedPreferredTmpDir = resolvePreferredOpenClawTmpDir();
  return cachedPreferredTmpDir;
}
/** Builds the baseline local media root allowlist from state/config directories. */
function buildMediaLocalRoots(stateDir, configDir, options = {}) {
  const resolvedStateDir = path.resolve(stateDir);
  const resolvedConfigDir = path.resolve(configDir);
  const preferredTmpDir = options.preferredTmpDir ?? resolveCachedPreferredTmpDir();
  return Array.from(
    /* @__PURE__ */ new Set([
      preferredTmpDir,
      path.join(resolvedConfigDir, "media"),
      path.join(resolvedStateDir, "media"),
      path.join(resolvedStateDir, "canvas"),
      path.join(resolvedStateDir, "workspace"),
      path.join(resolvedStateDir, "sandboxes"),
    ]),
  );
}
/** Returns the process default roots where local media reads may resolve generated/cache files. */
function getDefaultMediaLocalRoots() {
  return buildMediaLocalRoots(resolveStateDir(), resolveConfigDir());
}
/** Adds the active agent workspace to the default media roots without exposing all agent state. */
function getAgentScopedMediaLocalRoots(cfg, agentId) {
  const roots = buildMediaLocalRoots(resolveStateDir(), resolveConfigDir());
  const normalizedAgentId = normalizeOptionalString(agentId);
  if (!normalizedAgentId) return roots;
  const workspaceDir = resolveAgentWorkspaceDir(cfg, normalizedAgentId);
  if (!workspaceDir) return roots;
  const normalizedWorkspaceDir = path.resolve(workspaceDir);
  if (!roots.includes(normalizedWorkspaceDir)) roots.push(normalizedWorkspaceDir);
  return roots;
}
/** Adds only concrete local source parent directories to an existing root allowlist. */
function appendLocalMediaParentRoots(roots, mediaSources) {
  const appended = uniqueStrings(roots.map((root) => path.resolve(root)));
  for (const source of mediaSources ?? []) {
    const localPath = resolveLocalMediaPath(source);
    if (!localPath) continue;
    const parentDir = path.dirname(localPath);
    if (parentDir === path.parse(parentDir).root) continue;
    const normalizedParent = path.resolve(parentDir);
    if (!appended.includes(normalizedParent)) appended.push(normalizedParent);
  }
  return appended;
}
/** Resolves outbound media roots, expanding for local sources only when filesystem policy allows it. */
function getAgentScopedMediaLocalRootsForSources(params) {
  const roots = getAgentScopedMediaLocalRoots(params.cfg, params.agentId);
  if (
    resolveEffectiveToolFsWorkspaceOnly({
      cfg: params.cfg,
      agentId: params.agentId,
    })
  )
    return roots;
  if (
    !resolveEffectiveToolFsRootExpansionAllowed({
      cfg: params.cfg,
      agentId: params.agentId,
    })
  )
    return roots;
  return appendLocalMediaParentRoots(roots, params.mediaSources);
}
//#endregion
export {
  getDefaultMediaLocalRoots as a,
  resolveEffectiveToolFsRootExpansionAllowed as c,
  getAgentScopedMediaLocalRootsForSources as i,
  resolveEffectiveToolFsWorkspaceOnly as l,
  buildMediaLocalRoots as n,
  resolveLocalMediaPath as o,
  getAgentScopedMediaLocalRoots as r,
  createToolFsPolicy as s,
  appendLocalMediaParentRoots as t,
  resolveToolFsConfig as u,
};
