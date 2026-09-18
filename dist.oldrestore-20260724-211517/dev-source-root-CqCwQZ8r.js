import fs from "node:fs";
import path from "node:path";
import "./utils-DtcDeqWS.js";
import "./path-safety-4zNHq1Ot.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { f as safeRealpathSync, i as isPathInside } from "./path-DILYn_gk.js";
//#region src/plugins/dev-source-root.ts
/** Env var that points bundled-plugin lookup at an OpenClaw source checkout. */
const OPENCLAW_DEV_SOURCE_ROOT_ENV = "OPENCLAW_DEV_SOURCE_ROOT";
function readPackageName(packageJsonPath) {
  try {
    const parsed = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    return typeof parsed.name === "string" ? parsed.name : null;
  } catch {
    return null;
  }
}
/** Resolves and validates the configured OpenClaw development source root. */
function resolveOpenClawDevSourceRoot(env = process.env) {
  const rawRoot = env[OPENCLAW_DEV_SOURCE_ROOT_ENV]?.trim();
  if (!rawRoot) return null;
  const realRoot = safeRealpathSync(resolveUserPath(rawRoot, env));
  if (!realRoot) return null;
  if (readPackageName(path.join(realRoot, "package.json")) !== "openclaw") return null;
  if (!fs.existsSync(path.join(realRoot, "src"))) return null;
  if (!fs.existsSync(path.join(realRoot, "extensions"))) return null;
  return realRoot;
}
/** True when a bundled plugin root is inside the configured development source root. */
function isBundledPluginInsideDevSourceRoot(params) {
  const devSourceRoot = resolveOpenClawDevSourceRoot(params.env);
  if (!devSourceRoot) return false;
  const extensionsRoot = safeRealpathSync(path.join(devSourceRoot, "extensions"));
  const pluginRoot = safeRealpathSync(resolveUserPath(params.rootDir, params.env));
  if (!extensionsRoot || !pluginRoot) return false;
  return isPathInside(extensionsRoot, pluginRoot);
}
//#endregion
export { resolveOpenClawDevSourceRoot as n, isBundledPluginInsideDevSourceRoot as t };
