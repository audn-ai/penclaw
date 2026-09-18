import os from "node:os";
import path from "node:path";
import { o as resolveRequiredHomeDir } from "./home-dir-DxrrpDft.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region src/agents/workspace-default.ts
/**
 * Default agent workspace resolver.
 *
 * Derives the process workspace directory from env, profile, and home-directory state.
 */
/** Resolve the default agent workspace directory from env/profile/home state. */
function resolveDefaultAgentWorkspaceDir(env = process.env, homedir = os.homedir) {
  const workspaceDir = env.OPENCLAW_WORKSPACE_DIR?.trim();
  if (workspaceDir) return path.resolve(workspaceDir);
  const home = resolveRequiredHomeDir(env, homedir);
  const profile = env.OPENCLAW_PROFILE?.trim();
  if (profile && normalizeOptionalLowercaseString(profile) !== "default")
    return path.join(home, ".openclaw", `workspace-${profile}`);
  return path.join(home, ".openclaw", "workspace");
}
/** Default agent workspace directory for the current process environment. */
const DEFAULT_AGENT_WORKSPACE_DIR = resolveDefaultAgentWorkspaceDir();
//#endregion
export { resolveDefaultAgentWorkspaceDir as n, DEFAULT_AGENT_WORKSPACE_DIR as t };
