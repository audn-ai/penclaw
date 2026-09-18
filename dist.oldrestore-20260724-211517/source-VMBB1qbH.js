import crypto from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  c as resolveHomePath,
  i as isDirectory,
  o as readJsonObject,
  r as exists,
} from "./helpers-CWMv4L9s.js";
//#region extensions/migrate-claude/source.ts
const CLAUDE_AUTO_MEMORY_MAX_FILES = 2e3;
const CLAUDE_AUTO_MEMORY_MAX_SCAN_ENTRIES = 2e4;
const HOME_ARCHIVE_DIRS = ["projects", "cache", "plans"];
const PROJECT_ARCHIVE_FILES = [".claude/scheduled_tasks.json"];
function defaultClaudeHome() {
  return path.join(os.homedir(), ".claude");
}
function defaultDesktopConfig() {
  return path.join(
    os.homedir(),
    "Library",
    "Application Support",
    "Claude",
    "claude_desktop_config.json",
  );
}
async function addArchivePath(archivePaths, id, candidate, relativePath) {
  if ((await exists(candidate)) || (await isDirectory(candidate)))
    archivePaths.push({
      id,
      path: candidate,
      relativePath,
    });
}
async function safeReadDir(dir) {
  try {
    return await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error ? String(error.code) : void 0;
    if (code === "ENOENT" || code === "ENOTDIR") return [];
    throw new Error(`Unable to read Claude Code projects directory: ${dir}`, { cause: error });
  }
}
async function readMemoryDir(dir) {
  try {
    return await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {
    throw new Error(`Unable to read Claude Code auto-memory directory: ${dir}`, { cause: error });
  }
}
async function probeMarkdownFiles(root) {
  const pending = [root];
  let visited = 0;
  while (pending.length > 0) {
    const current = pending.pop();
    if (!current) break;
    for (const entry of await readMemoryDir(current)) {
      visited += 1;
      if (visited > 2e4) return "truncated";
      if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) return "found";
      if (entry.isDirectory()) pending.push(path.join(current, entry.name));
    }
  }
  return "absent";
}
function autoMemorySourceId(sourcePath) {
  return crypto.createHash("sha256").update(path.resolve(sourcePath)).digest("hex").slice(0, 10);
}
async function discoverAutoMemorySources(params) {
  const candidates = [];
  if (params.homeProjectsDir)
    for (const entry of await safeReadDir(params.homeProjectsDir)) {
      if (!entry.isDirectory()) continue;
      candidates.push({
        label: entry.name,
        path: path.join(params.homeProjectsDir, entry.name, "memory"),
      });
    }
  const customDirectory = (await readJsonObject(params.userSettingsPath)).autoMemoryDirectory;
  if (typeof customDirectory === "string" && customDirectory.trim()) {
    const configuredPath = customDirectory.trim();
    if (
      !path.isAbsolute(configuredPath) &&
      configuredPath !== "~" &&
      !configuredPath.startsWith("~/")
    )
      throw new Error("Claude autoMemoryDirectory must be absolute or start with ~/.");
    const customPath = resolveHomePath(configuredPath);
    candidates.push({
      label: path.basename(customPath) || "custom",
      path: customPath,
    });
  }
  if (path.basename(params.root) === "memory")
    candidates.push({
      label: path.basename(path.dirname(params.root)) || "project",
      path: params.root,
    });
  const seen = /* @__PURE__ */ new Set();
  const sources = [];
  for (const candidate of candidates) {
    if (!(await isDirectory(candidate.path))) continue;
    if ((await probeMarkdownFiles(candidate.path)) === "absent") continue;
    const canonical = await fs.realpath(candidate.path).catch(() => path.resolve(candidate.path));
    if (seen.has(canonical)) continue;
    seen.add(canonical);
    sources.push({
      id: autoMemorySourceId(canonical),
      label: candidate.label,
      path: candidate.path,
    });
  }
  return sources.toSorted((left, right) => left.label.localeCompare(right.label));
}
async function discoverClaudeSource(input) {
  const explicitInput = Boolean(input?.trim());
  const root = resolveHomePath(input?.trim() || defaultClaudeHome());
  const rootIsHome = path.basename(root) === ".claude";
  const inspectGlobal = !explicitInput || rootIsHome;
  const homeDir = inspectGlobal ? (rootIsHome ? root : defaultClaudeHome()) : void 0;
  const projectDir = rootIsHome ? void 0 : root;
  const archivePaths = [];
  const userSettingsPath = homeDir ? path.join(homeDir, "settings.json") : void 0;
  const userLocalSettingsPath = homeDir ? path.join(homeDir, "settings.local.json") : void 0;
  const userClaudeJsonPath = inspectGlobal ? path.join(os.homedir(), ".claude.json") : void 0;
  const userMemoryPath = homeDir ? path.join(homeDir, "CLAUDE.md") : void 0;
  const desktopConfigPath = inspectGlobal ? defaultDesktopConfig() : void 0;
  const homeProjectsDir = homeDir ? path.join(homeDir, "projects") : void 0;
  const userSkillsDir = homeDir ? path.join(homeDir, "skills") : void 0;
  const userCommandsDir = homeDir ? path.join(homeDir, "commands") : void 0;
  const userAgentsDir = homeDir ? path.join(homeDir, "agents") : void 0;
  if (homeDir)
    for (const dir of HOME_ARCHIVE_DIRS)
      await addArchivePath(archivePaths, `archive:home:${dir}`, path.join(homeDir, dir), dir);
  const source = {
    root,
    confidence: "low",
    autoMemorySources: [],
    archivePaths,
    ...(homeDir && (await isDirectory(homeDir)) ? { homeDir } : {}),
    ...(homeProjectsDir && (await isDirectory(homeProjectsDir)) ? { homeProjectsDir } : {}),
    ...(projectDir ? { projectDir } : {}),
    ...(userSettingsPath && (await exists(userSettingsPath)) ? { userSettingsPath } : {}),
    ...(userLocalSettingsPath && (await exists(userLocalSettingsPath))
      ? { userLocalSettingsPath }
      : {}),
    ...(userClaudeJsonPath && (await exists(userClaudeJsonPath)) ? { userClaudeJsonPath } : {}),
    ...(userMemoryPath && (await exists(userMemoryPath)) ? { userMemoryPath } : {}),
    ...(userSkillsDir && (await isDirectory(userSkillsDir)) ? { userSkillsDir } : {}),
    ...(userCommandsDir && (await isDirectory(userCommandsDir)) ? { userCommandsDir } : {}),
    ...(userAgentsDir && (await isDirectory(userAgentsDir)) ? { userAgentsDir } : {}),
    ...(desktopConfigPath && (await exists(desktopConfigPath)) ? { desktopConfigPath } : {}),
  };
  if (projectDir) {
    const projectSettingsPath = path.join(projectDir, ".claude", "settings.json");
    const projectLocalSettingsPath = path.join(projectDir, ".claude", "settings.local.json");
    const projectMcpPath = path.join(projectDir, ".mcp.json");
    const projectMemoryPath = path.join(projectDir, "CLAUDE.md");
    const projectDotClaudeMemoryPath = path.join(projectDir, ".claude", "CLAUDE.md");
    const projectLocalMemoryPath = path.join(projectDir, "CLAUDE.local.md");
    const projectRulesDir = path.join(projectDir, ".claude", "rules");
    const projectSkillsDir = path.join(projectDir, ".claude", "skills");
    const projectCommandsDir = path.join(projectDir, ".claude", "commands");
    const projectAgentsDir = path.join(projectDir, ".claude", "agents");
    Object.assign(source, {
      ...((await exists(projectSettingsPath)) ? { projectSettingsPath } : {}),
      ...((await exists(projectLocalSettingsPath)) ? { projectLocalSettingsPath } : {}),
      ...((await exists(projectMcpPath)) ? { projectMcpPath } : {}),
      ...((await exists(projectMemoryPath)) ? { projectMemoryPath } : {}),
      ...((await exists(projectDotClaudeMemoryPath)) ? { projectDotClaudeMemoryPath } : {}),
      ...((await exists(projectLocalMemoryPath)) ? { projectLocalMemoryPath } : {}),
      ...((await isDirectory(projectRulesDir)) ? { projectRulesDir } : {}),
      ...((await isDirectory(projectSkillsDir)) ? { projectSkillsDir } : {}),
      ...((await isDirectory(projectCommandsDir)) ? { projectCommandsDir } : {}),
      ...((await isDirectory(projectAgentsDir)) ? { projectAgentsDir } : {}),
    });
    for (const file of PROJECT_ARCHIVE_FILES)
      await addArchivePath(
        archivePaths,
        `archive:project:${file}`,
        path.join(projectDir, file),
        file,
      );
  }
  source.autoMemorySources = await discoverAutoMemorySources({
    root,
    homeProjectsDir: source.homeProjectsDir,
    userSettingsPath: source.userSettingsPath,
  });
  const claudeJson = await readJsonObject(source.userClaudeJsonPath);
  const hasClaudeJsonState = Boolean(claudeJson.mcpServers || claudeJson.projects);
  const desktopConfig = await readJsonObject(source.desktopConfigPath);
  const hasDesktopMcp = Boolean(desktopConfig.mcpServers);
  const high = Boolean(
    source.userSettingsPath ||
    source.userMemoryPath ||
    source.projectSettingsPath ||
    source.projectMcpPath ||
    source.projectMemoryPath ||
    source.projectDotClaudeMemoryPath ||
    hasClaudeJsonState ||
    hasDesktopMcp,
  );
  const medium = Boolean(
    source.userSkillsDir ||
    source.projectSkillsDir ||
    source.userCommandsDir ||
    source.projectCommandsDir ||
    source.userAgentsDir ||
    source.projectAgentsDir ||
    source.projectRulesDir ||
    source.projectLocalMemoryPath ||
    source.homeProjectsDir ||
    source.autoMemorySources.length > 0,
  );
  source.confidence = high ? "high" : medium ? "medium" : "low";
  return source;
}
function hasClaudeSource(source) {
  return source.confidence !== "low";
}
//#endregion
export {
  hasClaudeSource as i,
  CLAUDE_AUTO_MEMORY_MAX_SCAN_ENTRIES as n,
  discoverClaudeSource as r,
  CLAUDE_AUTO_MEMORY_MAX_FILES as t,
};
