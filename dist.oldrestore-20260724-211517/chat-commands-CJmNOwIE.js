import fs from "node:fs";
import path from "node:path";
import { t as resolveEffectiveAgentSkillFilter } from "./agent-filter-DcBVtCFz.js";
import { n as listAgentIds, o as resolveAgentWorkspaceDir } from "./agent-scope-config-DVIR1nBa.js";
import "./json-files-CTWRDHag.js";
import {
  o as mergeBundlePathLists,
  s as normalizeBundlePathList,
  t as CLAUDE_BUNDLE_MANIFEST_RELATIVE_PATH,
} from "./bundle-manifest-Dxp5qa20.js";
import { t as getChatCommands } from "./commands-registry.data-uuI1tQ04.js";
import "./agent-scope-y9xQv_q1.js";
import {
  c as normalizePluginsConfig,
  r as hasExplicitPluginConfig,
  u as resolveEffectivePluginActivationState,
} from "./config-state-C1Qyxaws.js";
import { I as canonicalizePath, P as filterUserInvocableSkillEntries } from "./curator-BbVbrcMR.js";
import { n as resolveNodeExecEligibility } from "./exec-defaults-CZ1jkNDD.js";
import { n as parseFrontmatterBlock, r as stripFrontmatterBlock } from "./frontmatter-CnpRhrvE.js";
import "./scan-paths-Bve2UhXh.js";
import { r as logVerbose } from "./globals-CNUzHTcU.js";
import { a as readRootJsonObjectSync } from "./json-7OTJmMaB.js";
import { a as isPathInsideWithRealpath } from "./path-DILYn_gk.js";
import { n as loadPluginManifestRegistryForPluginRegistry } from "./plugin-registry-BckMdz4f.js";
import { t as getRemoteSkillEligibility } from "./remote-DyEoYksv.js";
import { n as resolveSkillTelemetrySource } from "./source-9Jdpd6BI.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import {
  a as loadVisibleWorkspaceSkillEntries,
  r as filterWorkspaceSkillEntriesWithOptions,
} from "./workspace-DR7anktc.js";
//#region src/skills/discovery/chat-command-invocation.ts
/** Lists slash command names reserved by built-in chat commands and callers. */
function listReservedChatSlashCommandNames(extraNames = []) {
  const reserved = /* @__PURE__ */ new Set();
  for (const command of getChatCommands()) {
    if (command.nativeName)
      reserved.add(normalizeOptionalLowercaseString(command.nativeName) ?? "");
    for (const alias of command.textAliases) {
      const trimmed = alias.trim();
      if (!trimmed.startsWith("/")) continue;
      reserved.add(normalizeLowercaseStringOrEmpty(trimmed.slice(1)));
    }
  }
  for (const name of extraNames) {
    const trimmed = normalizeOptionalLowercaseString(name);
    if (trimmed) reserved.add(trimmed);
  }
  return reserved;
}
function normalizeSkillCommandLookup(value) {
  return (normalizeOptionalLowercaseString(value) ?? "").replace(/[\s_]+/g, "-");
}
function findSkillCommand(skillCommands, rawName) {
  const trimmed = rawName.trim();
  if (!trimmed) return;
  const lowered = normalizeOptionalLowercaseString(trimmed) ?? "";
  const normalized = normalizeSkillCommandLookup(trimmed);
  return skillCommands.find((entry) => {
    if (normalizeOptionalLowercaseString(entry.name) === lowered) return true;
    if (normalizeOptionalLowercaseString(entry.skillName) === lowered) return true;
    return (
      normalizeSkillCommandLookup(entry.name) === normalized ||
      normalizeSkillCommandLookup(entry.skillName) === normalized
    );
  });
}
function resolveSkillCommandInvocation(params) {
  const trimmed = params.commandBodyNormalized.trim();
  if (!trimmed.startsWith("/")) return null;
  const match = trimmed.match(/^\/([^\s]+)(?:\s+([\s\S]+))?$/);
  if (!match) return null;
  const commandName = normalizeOptionalLowercaseString(match[1]);
  if (!commandName) return null;
  if (commandName === "skill") {
    const remainder = match[2]?.trim();
    if (!remainder) return null;
    const skillMatch = remainder.match(/^([^\s]+)(?:\s+([\s\S]+))?$/);
    if (!skillMatch) return null;
    const skillCommand = findSkillCommand(params.skillCommands, skillMatch[1] ?? "");
    if (!skillCommand) return null;
    return {
      command: skillCommand,
      args: skillMatch[2]?.trim() || void 0,
    };
  }
  const command = params.skillCommands.find(
    (entry) => normalizeOptionalLowercaseString(entry.name) === commandName,
  );
  if (!command) return null;
  return {
    command,
    args: match[2]?.trim() || void 0,
  };
}
//#endregion
//#region src/plugins/bundle-commands.ts
function parseFrontmatterBool(value, fallback) {
  const normalized = normalizeOptionalLowercaseString(value);
  if (!normalized) return fallback;
  if (normalized === "true" || normalized === "yes" || normalized === "1") return true;
  if (normalized === "false" || normalized === "no" || normalized === "0") return false;
  return fallback;
}
function readClaudeBundleManifest(rootDir) {
  const result = readRootJsonObjectSync({
    rootDir,
    relativePath: CLAUDE_BUNDLE_MANIFEST_RELATIVE_PATH,
    boundaryLabel: "plugin root",
    rejectHardlinks: true,
  });
  return result.ok ? result.value : {};
}
function resolveClaudeCommandRootDirs(rootDir) {
  const declared = normalizeBundlePathList(readClaudeBundleManifest(rootDir).commands);
  return mergeBundlePathLists(
    fs.existsSync(path.join(rootDir, "commands")) ? ["commands"] : [],
    declared,
  );
}
function listMarkdownFilesRecursive(rootDir) {
  const pending = [rootDir];
  const files = [];
  while (pending.length > 0) {
    const current = pending.pop();
    if (!current) continue;
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        pending.push(fullPath);
        continue;
      }
      if (entry.isFile() && normalizeOptionalLowercaseString(entry.name)?.endsWith(".md"))
        files.push(fullPath);
    }
  }
  return files.toSorted((a, b) => a.localeCompare(b));
}
function toDefaultCommandName(rootDir, filePath) {
  return path
    .relative(rootDir, filePath)
    .replace(/\.[^.]+$/u, "")
    .split(path.sep)
    .join(":");
}
function toDefaultDescription(rawName, promptTemplate) {
  return (
    promptTemplate
      .split(/\r?\n/u)
      .map((line) => line.trim())
      .find(Boolean) || rawName
  );
}
function loadBundleCommandsFromRoot(params) {
  const entries = [];
  for (const filePath of listMarkdownFilesRecursive(params.commandRoot)) {
    let raw;
    try {
      raw = fs.readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }
    const frontmatter = parseFrontmatterBlock(raw);
    if (parseFrontmatterBool(frontmatter["disable-model-invocation"], false)) continue;
    const promptTemplate = stripFrontmatterBlock(raw);
    if (!promptTemplate) continue;
    const rawName =
      normalizeOptionalString(frontmatter.name) ||
      toDefaultCommandName(params.commandRoot, filePath);
    if (!rawName) continue;
    const description =
      normalizeOptionalString(frontmatter.description) ||
      toDefaultDescription(rawName, promptTemplate);
    entries.push({
      pluginId: params.pluginId,
      rawName,
      description,
      promptTemplate,
      sourceFilePath: filePath,
    });
  }
  return entries;
}
function loadEnabledClaudeBundleCommands(params) {
  if (!hasExplicitPluginConfig(params.cfg?.plugins)) return [];
  const registry = loadPluginManifestRegistryForPluginRegistry({
    workspaceDir: params.workspaceDir,
    config: params.cfg,
    includeDisabled: true,
  });
  const normalizedPlugins = normalizePluginsConfig(params.cfg?.plugins);
  const commands = [];
  for (const record of registry.plugins) {
    if (
      record.format !== "bundle" ||
      record.bundleFormat !== "claude" ||
      !(record.bundleCapabilities ?? []).includes("commands")
    )
      continue;
    if (
      !resolveEffectivePluginActivationState({
        id: record.id,
        origin: record.origin,
        config: normalizedPlugins,
        rootConfig: params.cfg,
      }).activated
    )
      continue;
    for (const relativeRoot of resolveClaudeCommandRootDirs(record.rootDir)) {
      const commandRoot = path.resolve(record.rootDir, relativeRoot);
      if (!fs.existsSync(commandRoot)) continue;
      if (!isPathInsideWithRealpath(record.rootDir, commandRoot, { requireRealpath: true }))
        continue;
      commands.push(
        ...loadBundleCommandsFromRoot({
          pluginId: record.id,
          commandRoot,
        }),
      );
    }
  }
  return commands;
}
//#endregion
//#region src/skills/discovery/command-specs.ts
const skillsLogger = createSubsystemLogger("skills");
const skillCommandDebugOnce = /* @__PURE__ */ new Set();
const SKILL_COMMAND_MAX_LENGTH = 32;
const SKILL_COMMAND_FALLBACK = "skill";
function debugSkillCommandOnce(messageKey, message, meta) {
  if (skillCommandDebugOnce.has(messageKey)) return;
  skillCommandDebugOnce.add(messageKey);
  skillsLogger.debug(message, meta);
}
function traceSkillCommandOnce(messageKey, message, meta) {
  if (skillCommandDebugOnce.has(messageKey)) return;
  skillCommandDebugOnce.add(messageKey);
  skillsLogger.trace(message, meta);
}
function sanitizeSkillCommandName(raw) {
  return (
    normalizeLowercaseStringOrEmpty(raw)
      .replace(/[^a-z0-9_]+/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, SKILL_COMMAND_MAX_LENGTH) || SKILL_COMMAND_FALLBACK
  );
}
function resolveUniqueSkillCommandName(base, used) {
  const normalizedBase = normalizeLowercaseStringOrEmpty(base);
  if (!used.has(normalizedBase)) return base;
  for (let index = 2; index < 1e3; index += 1) {
    const suffix = `_${index}`;
    const maxBaseLength = Math.max(1, SKILL_COMMAND_MAX_LENGTH - suffix.length);
    const candidate = `${base.slice(0, maxBaseLength)}${suffix}`;
    const candidateKey = normalizeLowercaseStringOrEmpty(candidate);
    if (!used.has(candidateKey)) return candidate;
  }
  return `${base.slice(0, Math.max(1, SKILL_COMMAND_MAX_LENGTH - 2))}_x`;
}
/** Builds user-invocable slash command specs for visible workspace skills. */
function buildWorkspaceSkillCommandSpecs(workspaceDir, opts) {
  const effectiveSkillFilter =
    opts?.skillFilter ?? resolveEffectiveAgentSkillFilter(opts?.config, opts?.agentId);
  const userInvocable = filterUserInvocableSkillEntries(
    opts?.entries
      ? filterWorkspaceSkillEntriesWithOptions(opts.entries, {
          config: opts?.config,
          skillFilter: effectiveSkillFilter,
          eligibility: opts?.eligibility,
        })
      : loadVisibleWorkspaceSkillEntries(workspaceDir, {
          config: opts?.config,
          managedSkillsDir: opts?.managedSkillsDir,
          bundledSkillsDir: opts?.bundledSkillsDir,
          skillFilter: effectiveSkillFilter,
          eligibility: opts?.eligibility,
        }),
  );
  const used = /* @__PURE__ */ new Set();
  for (const reserved of opts?.reservedNames ?? [])
    used.add(normalizeLowercaseStringOrEmpty(reserved));
  const specs = [];
  for (const entry of userInvocable) {
    const rawName = entry.skill.name;
    const base = sanitizeSkillCommandName(rawName);
    if (base !== rawName)
      traceSkillCommandOnce(
        `sanitize:${rawName}:${base}`,
        `Sanitized skill command name "${rawName}" to "/${base}".`,
        {
          rawName,
          sanitized: `/${base}`,
        },
      );
    const unique = resolveUniqueSkillCommandName(base, used);
    if (unique !== base)
      traceSkillCommandOnce(
        `dedupe:${rawName}:${unique}`,
        `De-duplicated skill command name for "${rawName}" to "/${unique}".`,
        {
          rawName,
          deduped: `/${unique}`,
        },
      );
    used.add(normalizeLowercaseStringOrEmpty(unique));
    const description = entry.skill.description?.trim() || rawName;
    const dispatch = entry.disableCommandDispatch
      ? void 0
      : (() => {
          const kindRaw = normalizeLowercaseStringOrEmpty(
            entry.frontmatter?.["command-dispatch"] ??
              entry.frontmatter?.["command_dispatch"] ??
              "",
          );
          if (!kindRaw || kindRaw !== "tool") return;
          const toolName = (
            entry.frontmatter?.["command-tool"] ??
            entry.frontmatter?.["command_tool"] ??
            ""
          ).trim();
          if (!toolName) {
            debugSkillCommandOnce(
              `dispatch:missingTool:${rawName}`,
              `Skill command "/${unique}" requested tool dispatch but did not provide command-tool. Ignoring dispatch.`,
              {
                skillName: rawName,
                command: unique,
              },
            );
            return;
          }
          const argModeRaw = normalizeOptionalLowercaseString(
            entry.frontmatter?.["command-arg-mode"] ??
              entry.frontmatter?.["command_arg_mode"] ??
              "",
          );
          if (!(!argModeRaw || argModeRaw === "raw" ? "raw" : null))
            debugSkillCommandOnce(
              `dispatch:badArgMode:${rawName}:${argModeRaw}`,
              `Skill command "/${unique}" requested tool dispatch but has unknown command-arg-mode. Falling back to raw.`,
              {
                skillName: rawName,
                command: unique,
                argMode: argModeRaw,
              },
            );
          return {
            kind: "tool",
            toolName,
            argMode: "raw",
          };
        })();
    specs.push({
      name: unique,
      skillFile: canonicalizePath(entry.skill.filePath),
      skillName: rawName,
      description,
      skillSource: resolveSkillTelemetrySource(entry.skill),
      ...(dispatch ? { dispatch } : {}),
    });
  }
  const bundleCommands = loadEnabledClaudeBundleCommands({
    workspaceDir,
    cfg: opts?.config,
  });
  for (const entry of bundleCommands) {
    const base = sanitizeSkillCommandName(entry.rawName);
    if (base !== entry.rawName)
      debugSkillCommandOnce(
        `bundle-sanitize:${entry.rawName}:${base}`,
        `Sanitized bundle command name "${entry.rawName}" to "/${base}".`,
        {
          rawName: entry.rawName,
          sanitized: `/${base}`,
        },
      );
    const unique = resolveUniqueSkillCommandName(base, used);
    if (unique !== base)
      debugSkillCommandOnce(
        `bundle-dedupe:${entry.rawName}:${unique}`,
        `De-duplicated bundle command name for "${entry.rawName}" to "/${unique}".`,
        {
          rawName: entry.rawName,
          deduped: `/${unique}`,
        },
      );
    used.add(normalizeLowercaseStringOrEmpty(unique));
    specs.push({
      name: unique,
      skillName: entry.rawName,
      description: entry.description,
      promptTemplate: entry.promptTemplate,
      sourceFilePath: entry.sourceFilePath,
    });
  }
  return specs;
}
//#endregion
//#region src/skills/discovery/chat-commands.ts
function listSkillCommandsForWorkspace(params) {
  const nodeSkills = resolveNodeExecEligibility({
    cfg: params.cfg,
    agentId: params.agentId,
    sessionEntry: params.sessionEntry,
    sessionKey: params.sessionKey,
    execOverrides: params.execOverrides,
  });
  return buildWorkspaceSkillCommandSpecs(params.workspaceDir, {
    config: params.cfg,
    agentId: params.agentId,
    skillFilter: params.skillFilter,
    eligibility: {
      nodeSkills,
      remote: getRemoteSkillEligibility({ advertiseExecNode: nodeSkills.canExec }),
    },
    reservedNames: listReservedChatSlashCommandNames(),
  });
}
function dedupeBySkillName(commands) {
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const cmd of commands) {
    const key = normalizeOptionalLowercaseString(cmd.skillName);
    if (key && seen.has(key)) continue;
    if (key) seen.add(key);
    out.push(cmd);
  }
  return out;
}
function listSkillCommandsForAgents(params) {
  const agentIds = params.agentIds ?? listAgentIds(params.cfg);
  const used = listReservedChatSlashCommandNames();
  const entries = [];
  const hasSingleAgentContext = agentIds.length === 1;
  const workspaceAgents = [];
  for (const agentId of agentIds) {
    const workspaceDir = resolveAgentWorkspaceDir(params.cfg, agentId);
    if (!fs.existsSync(workspaceDir)) {
      logVerbose(`Skipping agent "${agentId}": workspace does not exist: ${workspaceDir}`);
      continue;
    }
    try {
      fs.realpathSync(workspaceDir);
    } catch {
      logVerbose(`Skipping agent "${agentId}": cannot resolve workspace: ${workspaceDir}`);
      continue;
    }
    workspaceAgents.push({
      agentId,
      workspaceDir,
      skillFilter: resolveEffectiveAgentSkillFilter(params.cfg, agentId),
    });
  }
  for (const { agentId, workspaceDir, skillFilter } of workspaceAgents) {
    const nodeSkills = resolveNodeExecEligibility({
      cfg: params.cfg,
      agentId,
      ...(hasSingleAgentContext
        ? {
            sessionEntry: params.sessionEntry,
            sessionKey: params.sessionKey,
            execOverrides: params.execOverrides,
          }
        : {}),
    });
    const commands = buildWorkspaceSkillCommandSpecs(workspaceDir, {
      config: params.cfg,
      agentId,
      skillFilter,
      eligibility: {
        nodeSkills,
        remote: getRemoteSkillEligibility({ advertiseExecNode: nodeSkills.canExec }),
      },
      reservedNames: used,
    });
    for (const command of commands) {
      used.add(normalizeLowercaseStringOrEmpty(command.name));
      entries.push(command);
    }
  }
  return dedupeBySkillName(entries).toSorted((left, right) =>
    left.skillName.localeCompare(right.skillName, "en"),
  );
}
//#endregion
export {
  resolveSkillCommandInvocation as i,
  listSkillCommandsForWorkspace as n,
  listReservedChatSlashCommandNames as r,
  listSkillCommandsForAgents as t,
};
