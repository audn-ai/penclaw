import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
//#region src/agents/config.ts
/**
 * Resolves package assets and per-user agent directories for the CLI/runtime.
 *
 * These helpers must work from source, dist, and Bun single-file binaries.
 */
const currentDir = dirname(fileURLToPath(import.meta.url));
/**
 * Detect if we're running as a Bun compiled binary.
 * Bun binaries have import.meta.url containing "$bunfs", "~BUN", or "%7EBUN" (Bun's virtual filesystem path)
 */
const isBunBinary =
  import.meta.url.includes("$bunfs") ||
  import.meta.url.includes("~BUN") ||
  import.meta.url.includes("%7EBUN");
/**
 * Get the base directory for resolving package assets (themes, package.json, README.md, CHANGELOG.md).
 * - For Bun binary: returns the directory containing the executable
 * - For Node.js (dist/): returns currentDir (the dist/ directory)
 * - For tsx (src/): returns parent directory (the package root)
 */
function getPackageDir() {
  const envDir = process.env.OPENCLAW_PACKAGE_DIR;
  if (envDir) {
    if (envDir === "~") return homedir();
    if (envDir.startsWith("~/")) return homedir() + envDir.slice(1);
    return envDir;
  }
  if (isBunBinary) return dirname(process.execPath);
  let dir = currentDir;
  while (dir !== dirname(dir)) {
    if (existsSync(join(dir, "package.json"))) return dir;
    dir = dirname(dir);
  }
  return currentDir;
}
/** Get path to package.json */
function getPackageJsonPath() {
  return join(getPackageDir(), "package.json");
}
/** Get path to README.md */
function getReadmePath() {
  return resolve(join(getPackageDir(), "README.md"));
}
/** Get path to docs directory */
function getDocsPath() {
  return resolve(join(getPackageDir(), "docs"));
}
/** Get path to examples directory */
function getExamplesPath() {
  return resolve(join(getPackageDir(), "examples"));
}
const pkg = JSON.parse(readFileSync(getPackageJsonPath(), "utf-8"));
const APP_NAME = pkg.openclawConfig?.name || "openclaw";
const CONFIG_DIR_NAME = pkg.openclawConfig?.configDir || ".openclaw";
const VERSION = pkg.version || "0.0.0";
const ENV_AGENT_DIR = `${APP_NAME.toUpperCase()}_AGENT_DIR`;
function expandTildePath(path) {
  if (path === "~") return homedir();
  if (path.startsWith("~/")) return homedir() + path.slice(1);
  return path;
}
/** Get the agent config directory (e.g., ~/.openclaw/agent/) */
function getAgentDir() {
  const envDir = process.env[ENV_AGENT_DIR];
  if (envDir) return expandTildePath(envDir);
  return join(homedir(), CONFIG_DIR_NAME, "agent");
}
/** Get path to managed binaries directory (fd, rg) */
function getBinDir() {
  return join(getAgentDir(), "bin");
}
/** Get path to sessions directory */
function getSessionsDir() {
  return join(getAgentDir(), "sessions");
}
//#endregion
export {
  getBinDir as a,
  getReadmePath as c,
  getAgentDir as i,
  getSessionsDir as l,
  CONFIG_DIR_NAME as n,
  getDocsPath as o,
  VERSION as r,
  getExamplesPath as s,
  APP_NAME as t,
  isBunBinary as u,
};
