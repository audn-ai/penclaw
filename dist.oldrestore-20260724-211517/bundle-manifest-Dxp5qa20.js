import fs from "node:fs";
import path from "node:path";
import JSON5 from "json5";
import { s as readRootStructuredFileSync } from "./json-7OTJmMaB.js";
import "./utils-DtcDeqWS.js";
import "./boundary-file-read-CBe_wA_B.js";
import {
  a as normalizeManifestActivation,
  t as DEFAULT_PLUGIN_ENTRY_CANDIDATES,
} from "./manifest-DnFAzqZi.js";
import "./json-files-CTWRDHag.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { n as matchRootFileOpenFailure } from "./root-file-9jkyxRTl.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { f as normalizeUniqueSingleOrTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
//#region src/plugins/plugin-scan-existence-cache.ts
/** Scan-scoped existence cache for plugin discovery hot paths.
 *
 * Plugin metadata is process-stable: installs, manifests, and catalogs change
 * only on restart or an explicit owner reload/install/doctor flow (see
 * AGENTS.md). A single cold-start discovery scan still re-probes the same paths
 * many times — `detectBundleManifestFormat` checks `skills/`, `.mcp.json`,
 * `settings.json`, ... and `loadBundleManifest`'s capability builders check
 * them again. Across bundled plugins that is thousands of synchronous
 * `fs.existsSync` calls; the issue reports 25.4s of self-time on Windows cold
 * start.
 *
 * This memoizes existence results for the lifetime of ONE scan pass only. A
 * later install/repair pass runs without an active cache (or under a fresh
 * cache), so marker files that appear mid-process are never served stale — the
 * freshness bug a process-global cache would reintroduce. Outside a scan,
 * `pluginScanExistsSync` falls back to plain `fs.existsSync`, so one-off
 * callers (install, hooks, doctor) stay correct and uncached. */
const scanExistenceCacheStack = [];
/** Runs `fn` with a scan-scoped existence cache active. Sync-only. */
function withPluginScanExistenceCache(fn) {
  scanExistenceCacheStack.push(/* @__PURE__ */ new Map());
  try {
    return fn();
  } finally {
    scanExistenceCacheStack.pop();
  }
}
/** `fs.existsSync` memoized for the active scan pass, if any.
 *
 * Outside `withPluginScanExistenceCache` this is plain `fs.existsSync`, so
 * callers that are not part of a scan pay no caching cost or staleness. */
function pluginScanExistsSync(targetPath) {
  const cache = scanExistenceCacheStack[scanExistenceCacheStack.length - 1];
  if (!cache) return fs.existsSync(targetPath);
  const cached = cache.get(targetPath);
  if (cached !== void 0) return cached;
  const result = fs.existsSync(targetPath);
  cache.set(targetPath, result);
  return result;
}
//#endregion
//#region src/plugins/bundle-manifest.ts
/** Reads Codex/Claude/Cursor bundle manifests into OpenClaw plugin manifest metadata. */
/** Relative manifest path for Codex-style plugin bundles. */
const CODEX_BUNDLE_MANIFEST_RELATIVE_PATH = ".codex-plugin/plugin.json";
const CLAUDE_BUNDLE_MANIFEST_RELATIVE_PATH = ".claude-plugin/plugin.json";
const CURSOR_BUNDLE_MANIFEST_RELATIVE_PATH = ".cursor-plugin/plugin.json";
/** Normalizes string-or-list path fields from bundle manifests. */
function normalizeBundlePathList(value) {
  return normalizeUniqueSingleOrTrimmedStringList(value);
}
function mergeBundlePathLists(...groups) {
  const merged = [];
  const seen = /* @__PURE__ */ new Set();
  for (const group of groups)
    for (const entry of group) {
      if (seen.has(entry)) continue;
      seen.add(entry);
      merged.push(entry);
    }
  return merged;
}
function hasInlineCapabilityValue(value) {
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (isRecord(value)) return Object.keys(value).length > 0;
  return value === true;
}
function slugifyPluginId(raw, rootDir) {
  const fallback = path.basename(rootDir);
  return (
    (normalizeLowercaseStringOrEmpty(raw) || normalizeLowercaseStringOrEmpty(fallback))
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "") || "bundle-plugin"
  );
}
function loadBundleManifestFile(params) {
  const manifestPath = path.join(params.rootDir, params.manifestRelativePath);
  const result = readRootStructuredFileSync({
    rootDir: params.rootDir,
    ...(params.rootRealPath !== void 0 ? { rootRealPath: params.rootRealPath } : {}),
    relativePath: params.manifestRelativePath,
    boundaryLabel: "plugin root",
    rejectHardlinks: params.rejectHardlinks,
    parse: (raw) => JSON5.parse(raw),
    validate: isRecord,
  });
  if (!result.ok && result.reason === "open")
    return matchRootFileOpenFailure(result.failure, {
      path: () => {
        if (params.allowMissing)
          return {
            ok: true,
            raw: {},
            manifestPath,
          };
        return {
          ok: false,
          error: `plugin manifest not found: ${manifestPath}`,
          manifestPath,
        };
      },
      fallback: (failure) => ({
        ok: false,
        error: `unsafe plugin manifest path: ${manifestPath} (${failure.reason})`,
        manifestPath,
      }),
    });
  if (!result.ok)
    return {
      ok: false,
      error:
        result.reason === "invalid"
          ? "plugin manifest must be an object"
          : `failed to parse plugin manifest: ${result.error}`,
      manifestPath,
    };
  return {
    ok: true,
    raw: result.value,
    manifestPath,
  };
}
function resolveCodexSkillDirs(raw, rootDir) {
  const declared = normalizeBundlePathList(raw.skills);
  if (declared.length > 0) return declared;
  return pluginScanExistsSync(path.join(rootDir, "skills")) ? ["skills"] : [];
}
function resolveCodexHookDirs(raw, rootDir) {
  const declared = normalizeBundlePathList(raw.hooks);
  if (declared.length > 0) return declared;
  return pluginScanExistsSync(path.join(rootDir, "hooks")) ? ["hooks"] : [];
}
function resolveCursorSkillsRootDirs(raw, rootDir) {
  const declared = normalizeBundlePathList(raw.skills);
  return mergeBundlePathLists(
    pluginScanExistsSync(path.join(rootDir, "skills")) ? ["skills"] : [],
    declared,
  );
}
function resolveCursorCommandRootDirs(raw, rootDir) {
  const declared = normalizeBundlePathList(raw.commands);
  return mergeBundlePathLists(
    pluginScanExistsSync(path.join(rootDir, ".cursor", "commands")) ? [".cursor/commands"] : [],
    declared,
  );
}
function resolveCursorSkillDirs(raw, rootDir) {
  return mergeBundlePathLists(
    resolveCursorSkillsRootDirs(raw, rootDir),
    resolveCursorCommandRootDirs(raw, rootDir),
  );
}
function resolveCursorAgentDirs(raw, rootDir) {
  const declared = normalizeBundlePathList(raw.subagents ?? raw.agents);
  return mergeBundlePathLists(
    pluginScanExistsSync(path.join(rootDir, ".cursor", "agents")) ? [".cursor/agents"] : [],
    declared,
  );
}
function hasCursorHookCapability(raw, rootDir) {
  return (
    hasInlineCapabilityValue(raw.hooks) ||
    pluginScanExistsSync(path.join(rootDir, ".cursor", "hooks.json"))
  );
}
function hasCursorRulesCapability(raw, rootDir) {
  return (
    hasInlineCapabilityValue(raw.rules) ||
    pluginScanExistsSync(path.join(rootDir, ".cursor", "rules"))
  );
}
function hasCursorMcpCapability(raw, rootDir) {
  return (
    hasInlineCapabilityValue(raw.mcpServers) ||
    pluginScanExistsSync(path.join(rootDir, ".mcp.json"))
  );
}
function resolveClaudeComponentPaths(raw, key, rootDir, defaults) {
  const declared = normalizeBundlePathList(raw[key]);
  return mergeBundlePathLists(
    defaults.filter((candidate) => pluginScanExistsSync(path.join(rootDir, candidate))),
    declared,
  );
}
function resolveClaudeSkillsRootDirs(raw, rootDir) {
  return resolveClaudeComponentPaths(raw, "skills", rootDir, ["skills"]);
}
function resolveClaudeCommandRootDirs(raw, rootDir) {
  return resolveClaudeComponentPaths(raw, "commands", rootDir, ["commands"]);
}
function resolveClaudeSkillDirs(raw, rootDir) {
  return mergeBundlePathLists(
    resolveClaudeSkillsRootDirs(raw, rootDir),
    resolveClaudeCommandRootDirs(raw, rootDir),
    resolveClaudeAgentDirs(raw, rootDir),
    resolveClaudeOutputStylePaths(raw, rootDir),
  );
}
function resolveClaudeAgentDirs(raw, rootDir) {
  return resolveClaudeComponentPaths(raw, "agents", rootDir, ["agents"]);
}
function resolveClaudeHookPaths(raw, rootDir) {
  return resolveClaudeComponentPaths(raw, "hooks", rootDir, ["hooks/hooks.json"]);
}
function resolveClaudeMcpPaths(raw, rootDir) {
  return resolveClaudeComponentPaths(raw, "mcpServers", rootDir, [".mcp.json"]);
}
function resolveClaudeLspPaths(raw, rootDir) {
  return resolveClaudeComponentPaths(raw, "lspServers", rootDir, [".lsp.json"]);
}
function resolveClaudeOutputStylePaths(raw, rootDir) {
  return resolveClaudeComponentPaths(raw, "outputStyles", rootDir, ["output-styles"]);
}
function resolveClaudeSettingsFiles(_raw, rootDir) {
  return pluginScanExistsSync(path.join(rootDir, "settings.json")) ? ["settings.json"] : [];
}
function hasClaudeHookCapability(raw, rootDir) {
  return hasInlineCapabilityValue(raw.hooks) || resolveClaudeHookPaths(raw, rootDir).length > 0;
}
function buildCodexCapabilities(raw, rootDir) {
  const capabilities = [];
  if (resolveCodexSkillDirs(raw, rootDir).length > 0) capabilities.push("skills");
  if (resolveCodexHookDirs(raw, rootDir).length > 0) capabilities.push("hooks");
  if (
    hasInlineCapabilityValue(raw.mcpServers) ||
    pluginScanExistsSync(path.join(rootDir, ".mcp.json"))
  )
    capabilities.push("mcpServers");
  if (hasInlineCapabilityValue(raw.apps) || pluginScanExistsSync(path.join(rootDir, ".app.json")))
    capabilities.push("apps");
  return capabilities;
}
function buildClaudeCapabilities(raw, rootDir) {
  const capabilities = [];
  if (resolveClaudeSkillDirs(raw, rootDir).length > 0) capabilities.push("skills");
  if (resolveClaudeCommandRootDirs(raw, rootDir).length > 0) capabilities.push("commands");
  if (resolveClaudeAgentDirs(raw, rootDir).length > 0) capabilities.push("agents");
  if (hasClaudeHookCapability(raw, rootDir)) capabilities.push("hooks");
  if (hasInlineCapabilityValue(raw.mcpServers) || resolveClaudeMcpPaths(raw, rootDir).length > 0)
    capabilities.push("mcpServers");
  if (hasInlineCapabilityValue(raw.lspServers) || resolveClaudeLspPaths(raw, rootDir).length > 0)
    capabilities.push("lspServers");
  if (
    hasInlineCapabilityValue(raw.outputStyles) ||
    resolveClaudeOutputStylePaths(raw, rootDir).length > 0
  )
    capabilities.push("outputStyles");
  if (resolveClaudeSettingsFiles(raw, rootDir).length > 0) capabilities.push("settings");
  return capabilities;
}
function buildCursorCapabilities(raw, rootDir) {
  const capabilities = [];
  if (resolveCursorSkillDirs(raw, rootDir).length > 0) capabilities.push("skills");
  if (resolveCursorCommandRootDirs(raw, rootDir).length > 0) capabilities.push("commands");
  if (resolveCursorAgentDirs(raw, rootDir).length > 0) capabilities.push("agents");
  if (hasCursorHookCapability(raw, rootDir)) capabilities.push("hooks");
  if (hasCursorRulesCapability(raw, rootDir)) capabilities.push("rules");
  if (hasCursorMcpCapability(raw, rootDir)) capabilities.push("mcpServers");
  return capabilities;
}
function loadBundleManifest(params) {
  const rejectHardlinks = params.rejectHardlinks ?? true;
  const manifestRelativePath =
    params.bundleFormat === "codex"
      ? CODEX_BUNDLE_MANIFEST_RELATIVE_PATH
      : params.bundleFormat === "cursor"
        ? CURSOR_BUNDLE_MANIFEST_RELATIVE_PATH
        : CLAUDE_BUNDLE_MANIFEST_RELATIVE_PATH;
  const loaded = loadBundleManifestFile({
    rootDir: params.rootDir,
    ...(params.rootRealPath !== void 0 ? { rootRealPath: params.rootRealPath } : {}),
    manifestRelativePath,
    rejectHardlinks,
    allowMissing: params.bundleFormat === "claude",
  });
  if (!loaded.ok) return loaded;
  const raw = loaded.raw;
  const interfaceRecord = isRecord(raw.interface) ? raw.interface : void 0;
  const name = normalizeOptionalString(raw.name);
  const description =
    normalizeOptionalString(raw.description) ??
    normalizeOptionalString(raw.shortDescription) ??
    normalizeOptionalString(interfaceRecord?.shortDescription);
  const version = normalizeOptionalString(raw.version);
  if (params.bundleFormat === "codex") {
    const skills = resolveCodexSkillDirs(raw, params.rootDir);
    const hooks = resolveCodexHookDirs(raw, params.rootDir);
    return {
      ok: true,
      manifest: {
        id: slugifyPluginId(name, params.rootDir),
        name,
        description,
        version,
        skills,
        settingsFiles: [],
        hooks,
        bundleFormat: "codex",
        activation: normalizeManifestActivation(raw.activation),
        capabilities: buildCodexCapabilities(raw, params.rootDir),
      },
      manifestPath: loaded.manifestPath,
    };
  }
  if (params.bundleFormat === "cursor")
    return {
      ok: true,
      manifest: {
        id: slugifyPluginId(name, params.rootDir),
        name,
        description,
        version,
        skills: resolveCursorSkillDirs(raw, params.rootDir),
        settingsFiles: [],
        hooks: [],
        bundleFormat: "cursor",
        activation: normalizeManifestActivation(raw.activation),
        capabilities: buildCursorCapabilities(raw, params.rootDir),
      },
      manifestPath: loaded.manifestPath,
    };
  return {
    ok: true,
    manifest: {
      id: slugifyPluginId(name, params.rootDir),
      name,
      description,
      version,
      skills: resolveClaudeSkillDirs(raw, params.rootDir),
      settingsFiles: resolveClaudeSettingsFiles(raw, params.rootDir),
      hooks: resolveClaudeHookPaths(raw, params.rootDir),
      bundleFormat: "claude",
      activation: normalizeManifestActivation(raw.activation),
      capabilities: buildClaudeCapabilities(raw, params.rootDir),
    },
    manifestPath: loaded.manifestPath,
  };
}
function detectBundleManifestFormat(rootDir) {
  if (pluginScanExistsSync(path.join(rootDir, ".codex-plugin/plugin.json"))) return "codex";
  if (pluginScanExistsSync(path.join(rootDir, ".cursor-plugin/plugin.json"))) return "cursor";
  if (pluginScanExistsSync(path.join(rootDir, ".claude-plugin/plugin.json"))) return "claude";
  if (pluginScanExistsSync(path.join(rootDir, "openclaw.plugin.json"))) return null;
  if (
    DEFAULT_PLUGIN_ENTRY_CANDIDATES.some((candidate) =>
      pluginScanExistsSync(path.join(rootDir, candidate)),
    )
  )
    return null;
  if (
    [
      path.join(rootDir, "skills"),
      path.join(rootDir, "commands"),
      path.join(rootDir, "agents"),
      path.join(rootDir, "hooks", "hooks.json"),
      path.join(rootDir, ".mcp.json"),
      path.join(rootDir, ".lsp.json"),
      path.join(rootDir, "settings.json"),
    ].some((candidate) => pluginScanExistsSync(candidate))
  )
    return "claude";
  return null;
}
//#endregion
export {
  loadBundleManifest as a,
  withPluginScanExistenceCache as c,
  detectBundleManifestFormat as i,
  CODEX_BUNDLE_MANIFEST_RELATIVE_PATH as n,
  mergeBundlePathLists as o,
  CURSOR_BUNDLE_MANIFEST_RELATIVE_PATH as r,
  normalizeBundlePathList as s,
  CLAUDE_BUNDLE_MANIFEST_RELATIVE_PATH as t,
};
