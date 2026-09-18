import path from "node:path";
import {
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import { t as sanitizeForLog } from "./ansi-D4OHEz5F.js";
import "./utils-DtcDeqWS.js";
import "./agent-scope-y9xQv_q1.js";
import { i as resolveBundledPluginSources } from "./bundled-sources-D7CuFv_v.js";
import {
  f as normalizeBundledLookupPath,
  m as parsePackagedBundledPluginPath,
  p as parseLegacyBundledPluginPath,
  u as buildBundledPluginLoadPathAliases,
} from "./discovery-Df2IhoW5.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { t as asObjectRecord } from "./object-BsiS9JXh.js";
//#region src/commands/doctor/shared/bundled-plugin-load-paths.ts
function resolveBundledWorkspaceDir(cfg) {
  return resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg)) ?? void 0;
}
function isOpenClawNodeModulesPackageRoot(packageRoot) {
  const normalized = normalizeBundledLookupPath(packageRoot);
  const packageDir = path.basename(normalized);
  const parentDir = path.basename(path.dirname(normalized));
  return packageDir === "openclaw" && parentDir === "node_modules";
}
/** Find configured plugin load paths that alias bundled plugins already shipped by OpenClaw. */
function scanBundledPluginLoadPathMigrations(cfg, env = process.env) {
  const load = asObjectRecord(asObjectRecord(cfg.plugins)?.load);
  const rawPaths = Array.isArray(load?.paths) ? load.paths : [];
  if (rawPaths.length === 0) return [];
  const bundled = resolveBundledPluginSources({
    workspaceDir: resolveBundledWorkspaceDir(cfg),
    env,
  });
  if (bundled.size === 0) return [];
  const bundledPathMap = /* @__PURE__ */ new Map();
  const packagedBundledLeafMap = /* @__PURE__ */ new Map();
  for (const source of bundled.values()) {
    for (const alias of buildBundledPluginLoadPathAliases(source.localPath))
      bundledPathMap.set(normalizeBundledLookupPath(alias.path), {
        pluginId: source.pluginId,
        toPath: source.localPath,
      });
    const packaged = parsePackagedBundledPluginPath(source.localPath);
    if (packaged)
      packagedBundledLeafMap.set(normalizeBundledLookupPath(packaged.bundledLeaf), {
        pluginId: source.pluginId,
        toPath: source.localPath,
      });
  }
  const hits = [];
  for (const rawPath of rawPaths) {
    if (typeof rawPath !== "string") continue;
    const normalized = normalizeBundledLookupPath(resolveUserPath(rawPath, env));
    const match = bundledPathMap.get(normalized);
    if (!match) {
      const oldPackaged = parsePackagedBundledPluginPath(normalized);
      const oldLegacy = oldPackaged ? null : parseLegacyBundledPluginPath(normalized);
      const oldPackageRoot = oldPackaged?.packageRoot ?? oldLegacy?.packageRoot;
      const oldBundledLeaf = oldPackaged?.bundledLeaf ?? oldLegacy?.bundledLeaf;
      const oldPackageMatch =
        oldPackageRoot && oldBundledLeaf && isOpenClawNodeModulesPackageRoot(oldPackageRoot)
          ? packagedBundledLeafMap.get(normalizeBundledLookupPath(oldBundledLeaf))
          : void 0;
      if (!oldPackageMatch) continue;
      hits.push({
        pluginId: oldPackageMatch.pluginId,
        fromPath: rawPath,
        toPath: oldPackageMatch.toPath,
        pathLabel: "plugins.load.paths",
      });
      continue;
    }
    hits.push({
      pluginId: match.pluginId,
      fromPath: rawPath,
      toPath: match.toPath,
      pathLabel: "plugins.load.paths",
    });
  }
  return hits;
}
/** Format user-facing warnings for redundant bundled plugin load path aliases. */
function collectBundledPluginLoadPathWarnings(params) {
  if (params.hits.length === 0) return [];
  const lines = params.hits.map(
    (hit) =>
      `- ${hit.pathLabel}: bundled plugin path "${hit.fromPath}" still aliases ${hit.pluginId}; OpenClaw loads the packaged bundled plugin from "${hit.toPath}".`,
  );
  lines.push(`- Run "${params.doctorFixCommand}" to remove these redundant bundled plugin paths.`);
  return lines.map((line) => sanitizeForLog(line));
}
/** Remove redundant bundled plugin load path aliases while preserving unrelated custom paths. */
function maybeRepairBundledPluginLoadPaths(cfg, env = process.env) {
  const hits = scanBundledPluginLoadPathMigrations(cfg, env);
  if (hits.length === 0)
    return {
      config: cfg,
      changes: [],
    };
  const next = structuredClone(cfg);
  const paths = next.plugins?.load?.paths;
  if (!Array.isArray(paths))
    return {
      config: cfg,
      changes: [],
    };
  const removable = new Set(
    hits.map((hit) => normalizeBundledLookupPath(resolveUserPath(hit.fromPath, env))),
  );
  const seen = /* @__PURE__ */ new Set();
  const rewritten = [];
  for (const entry of paths) {
    if (typeof entry !== "string") {
      rewritten.push(entry);
      continue;
    }
    const resolved = normalizeBundledLookupPath(resolveUserPath(entry, env));
    if (removable.has(resolved)) continue;
    if (seen.has(resolved)) continue;
    seen.add(resolved);
    rewritten.push(entry);
  }
  next.plugins = {
    ...next.plugins,
    load: {
      ...next.plugins?.load,
      paths: rewritten,
    },
  };
  return {
    config: next,
    changes: hits.map(
      (hit) => `- plugins.load.paths: removed bundled ${hit.pluginId} path alias ${hit.fromPath}`,
    ),
  };
}
//#endregion
export {
  maybeRepairBundledPluginLoadPaths as n,
  scanBundledPluginLoadPathMigrations as r,
  collectBundledPluginLoadPathWarnings as t,
};
