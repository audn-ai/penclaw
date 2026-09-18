import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { t as collectConfiguredAgentHarnessRuntimes } from "./harness-runtimes-Bweud8_5.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region src/commands/doctor/shared/codex-native-assets.ts
const MAX_SCAN_DEPTH = 6;
const MAX_DISCOVERED_DIRS = 2e3;
function resolveUserHome(env) {
  return env.HOME?.trim() || os.homedir();
}
function resolveHomePath(value, env) {
  if (value === "~") return resolveUserHome(env);
  if (value.startsWith("~/")) return path.join(resolveUserHome(env), value.slice(2));
  return path.resolve(value);
}
function resolveCodexHome(env) {
  return resolveHomePath(env.CODEX_HOME?.trim() || "~/.codex", env);
}
function resolvePersonalAgentSkillsDir(env) {
  return path.join(resolveUserHome(env), ".agents", "skills");
}
async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
async function isDirectory(filePath) {
  try {
    return (await fs.stat(filePath)).isDirectory();
  } catch {
    return false;
  }
}
async function safeReadDir(dir) {
  return await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
}
async function discoverSkillHits(root) {
  if (!(await isDirectory(root))) return [];
  const hits = [];
  async function visit(dir, depth) {
    if (hits.length >= MAX_DISCOVERED_DIRS || depth > MAX_SCAN_DEPTH) return;
    if (depth === 1 && path.basename(dir) === ".system") return;
    if (await exists(path.join(dir, "SKILL.md"))) {
      hits.push({
        kind: "skill",
        path: dir,
      });
      return;
    }
    for (const entry of await safeReadDir(dir))
      if (entry.isDirectory()) await visit(path.join(dir, entry.name), depth + 1);
  }
  await visit(root, 0);
  return hits;
}
async function discoverPluginHits(root) {
  if (!(await isDirectory(root))) return [];
  const hits = /* @__PURE__ */ new Map();
  async function visit(dir, depth) {
    if (hits.size >= MAX_DISCOVERED_DIRS || depth > MAX_SCAN_DEPTH) return;
    if (await exists(path.join(dir, ".codex-plugin", "plugin.json"))) {
      hits.set(dir, {
        kind: "plugin",
        path: dir,
      });
      return;
    }
    for (const entry of await safeReadDir(dir))
      if (entry.isDirectory()) await visit(path.join(dir, entry.name), depth + 1);
  }
  await visit(root, 0);
  return [...hits.values()];
}
function isCodexRuntimeConfigured(cfg, _env) {
  return collectConfiguredAgentHarnessRuntimes(cfg).includes("codex");
}
function isCodexPluginConfigured(cfg) {
  const plugins = cfg.plugins;
  if (plugins?.enabled === false) return false;
  const allow = plugins?.allow;
  const allowList = Array.isArray(allow)
    ? allow.map((entry) => normalizeOptionalLowercaseString(entry))
    : void 0;
  if (allowList && !allowList.includes("codex")) return false;
  if (allowList?.includes("codex")) return true;
  return isRecord(plugins?.entries?.codex) && plugins.entries.codex.enabled !== false;
}
function shouldScanCodexNativeAssets(cfg, env) {
  return isCodexRuntimeConfigured(cfg, env) || isCodexPluginConfigured(cfg);
}
/** Discover personal Codex skills, plugins, config, and hooks relevant to Codex-mode agents. */
async function scanCodexNativeAssets(params) {
  const env = params.env ?? process.env;
  if (!shouldScanCodexNativeAssets(params.cfg, env)) return [];
  const codexHome = resolveCodexHome(env);
  const hits = /* @__PURE__ */ new Map();
  function record(hit) {
    hits.set(`${hit.kind}:${hit.path}`, hit);
  }
  for (const hit of await discoverSkillHits(path.join(codexHome, "skills"))) record(hit);
  for (const hit of await discoverSkillHits(resolvePersonalAgentSkillsDir(env))) record(hit);
  for (const hit of await discoverPluginHits(path.join(codexHome, "plugins", "cache"))) record(hit);
  const configPath = path.join(codexHome, "config.toml");
  if (await exists(configPath))
    record({
      kind: "config",
      path: configPath,
    });
  const hooksPath = path.join(codexHome, "hooks", "hooks.json");
  if (await exists(hooksPath))
    record({
      kind: "hooks",
      path: hooksPath,
    });
  return [...hits.values()].toSorted((a, b) => a.path.localeCompare(b.path));
}
function countKind(hits, kind) {
  return hits.filter((hit) => hit.kind === kind).length;
}
function plural(count, singular) {
  return `${count} ${singular}${count === 1 ? "" : "s"}`;
}
/** Build an informational doctor note when personal Codex CLI assets need migration review. */
async function collectCodexNativeAssetInfoNotes(params) {
  const env = params.env ?? process.env;
  const hits = await scanCodexNativeAssets({
    cfg: params.cfg,
    env,
  });
  if (hits.length === 0) return [];
  return [
    [
      `- Personal Codex CLI assets found (${[
        plural(countKind(hits, "skill"), "skill"),
        plural(countKind(hits, "plugin"), "plugin"),
        plural(countKind(hits, "config"), "config file"),
        plural(countKind(hits, "hooks"), "hook file"),
      ].join(
        ", ",
      )}) in ${resolveCodexHome(env)} and ${resolvePersonalAgentSkillsDir(env)}; native Codex-mode agents use isolated per-agent homes and will not load them.`,
      "- To review or promote them: install the Codex plugin (openclaw plugins install npm:@openclaw/codex), then run openclaw migrate plan codex.",
    ].join("\n"),
  ];
}
//#endregion
export { collectCodexNativeAssetInfoNotes };
