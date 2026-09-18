import path from "node:path";
import { n as resolveBundledPluginsDir } from "./bundled-dir-CehpKn-r.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { d as resolveConfigDir } from "./utils-DtcDeqWS.js";
//#region src/plugins/roots.ts
function resolvePluginSourceRoots(params) {
  const env = params.env ?? process.env;
  const workspaceRoot = params.workspaceDir ? resolveUserPath(params.workspaceDir, env) : void 0;
  return {
    stock: resolveBundledPluginsDir(env),
    global: path.join(resolveConfigDir(env), "extensions"),
    workspace: workspaceRoot ? path.join(workspaceRoot, ".openclaw", "extensions") : void 0,
  };
}
function resolvePluginCacheInputs(params) {
  const env = params.env ?? process.env;
  return {
    roots: resolvePluginSourceRoots({
      workspaceDir: params.workspaceDir,
      env,
    }),
    loadPaths: normalizeStringEntries(
      (params.loadPaths ?? []).filter((entry) => typeof entry === "string"),
    ).map((entry) => resolveUserPath(entry, env)),
  };
}
//#endregion
export { resolvePluginSourceRoots as n, resolvePluginCacheInputs as t };
