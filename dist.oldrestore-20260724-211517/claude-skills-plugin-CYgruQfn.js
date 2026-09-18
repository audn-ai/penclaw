import { accessSync } from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { _ as cliBackendLog } from "./helpers-CuMRsldS.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-uPgNO8da.js";
//#region src/agents/cli-runner/claude-skills-plugin.ts
/**
 * Materializes selected OpenClaw skills as a temporary Claude CLI plugin.
 */
const CLAUDE_CLI_BACKEND_ID = "claude-cli";
const OPENCLAW_CLAUDE_PLUGIN_NAME = "openclaw-skills";
function sanitizeSkillDirName(name, used) {
  const base =
    name
      .trim()
      .replace(/[^A-Za-z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "skill";
  const safeBase = base.startsWith(".") ? `skill-${base.replace(/^\.+/, "") || "skill"}` : base;
  let candidate = safeBase;
  for (let index = 2; used.has(candidate); index += 1) candidate = `${safeBase}-${index}`;
  used.add(candidate);
  return candidate;
}
/** Returns whether a resolved skill file is readable before linking it into the Claude plugin. */
function isClaudeCliSkillFileAccessible(skillFilePath) {
  try {
    accessSync(skillFilePath);
    return true;
  } catch {
    return false;
  }
}
async function collectClaudePluginSkills(snapshot) {
  const skills = snapshot?.resolvedSkills ?? [];
  if (skills.length === 0) return [];
  const usedTargetNames = /* @__PURE__ */ new Set();
  const materialized = [];
  for (const skill of skills) {
    const name = skill.name?.trim();
    const skillFilePath = skill.filePath?.trim();
    if (!name || !skillFilePath) continue;
    if (!isClaudeCliSkillFileAccessible(skillFilePath)) {
      cliBackendLog.warn(`claude skill plugin skipped missing skill file: ${skillFilePath}`);
      continue;
    }
    materialized.push({
      name,
      sourceDir: path.dirname(skillFilePath),
      targetDirName: sanitizeSkillDirName(name, usedTargetNames),
    });
  }
  return materialized;
}
async function linkOrCopySkillDir(params) {
  try {
    await fs$1.symlink(
      params.sourceDir,
      params.targetDir,
      process.platform === "win32" ? "junction" : "dir",
    );
  } catch {
    await fs$1.cp(params.sourceDir, params.targetDir, {
      recursive: true,
      force: true,
      verbatimSymlinks: true,
    });
  }
}
/** Prepares Claude CLI `--plugin-dir` args for the current session skill snapshot. */
async function prepareClaudeCliSkillsPlugin(params) {
  if (normalizeLowercaseStringOrEmpty(params.backendId) !== CLAUDE_CLI_BACKEND_ID)
    return {
      args: [],
      cleanup: async () => {},
    };
  const skills = await collectClaudePluginSkills(params.skillsSnapshot);
  if (skills.length === 0)
    return {
      args: [],
      cleanup: async () => {},
    };
  const tempDir = await fs$1.mkdtemp(
    path.join(resolvePreferredOpenClawTmpDir(), "openclaw-claude-skills-"),
  );
  const pluginDir = path.join(tempDir, OPENCLAW_CLAUDE_PLUGIN_NAME);
  const manifestDir = path.join(pluginDir, ".claude-plugin");
  const skillsDir = path.join(pluginDir, "skills");
  await fs$1.mkdir(manifestDir, {
    recursive: true,
    mode: 448,
  });
  await fs$1.mkdir(skillsDir, {
    recursive: true,
    mode: 448,
  });
  const manifest = {
    name: OPENCLAW_CLAUDE_PLUGIN_NAME,
    version: "0.0.0",
    description: "Session-scoped OpenClaw skills selected for this agent run.",
    skills: "./skills",
  };
  await fs$1.writeFile(
    path.join(manifestDir, "plugin.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    {
      encoding: "utf-8",
      mode: 384,
    },
  );
  let linkedSkillCount = 0;
  for (const skill of skills)
    try {
      await linkOrCopySkillDir({
        sourceDir: skill.sourceDir,
        targetDir: path.join(skillsDir, skill.targetDirName),
      });
      linkedSkillCount += 1;
    } catch (error) {
      cliBackendLog.warn(
        `claude skill plugin skipped ${skill.name}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  if (linkedSkillCount === 0) {
    await fs$1.rm(tempDir, {
      recursive: true,
      force: true,
    });
    return {
      args: [],
      cleanup: async () => {},
    };
  }
  return {
    args: ["--plugin-dir", pluginDir],
    pluginDir,
    cleanup: async () => {
      await fs$1.rm(tempDir, {
        recursive: true,
        force: true,
      });
    },
  };
}
//#endregion
export { prepareClaudeCliSkillsPlugin as t };
