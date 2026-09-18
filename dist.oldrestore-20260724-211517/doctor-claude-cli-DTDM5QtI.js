import fs from "node:fs";
import { t as resolveModelAgentRuntimeMetadata } from "./agent-runtime-metadata-CmlZPRYq.js";
import {
  c as resolveDefaultAgentId,
  n as listAgentIds,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import "./agent-scope-y9xQv_q1.js";
import { t as resolveClaudeCliProjectDirForWorkspace } from "./claude-cli-project-dir-BiEZcIls.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { i as resolveExecutablePath } from "./executable-path-BP9CqJ6T.js";
import { o as readClaudeCliCredentialsCached } from "./external-auth-aN0UYCd0.js";
import { t as note } from "./note-Uvqr4R1d.js";
import { i as resolveAuthStorePathForDisplay } from "./path-resolve-8wkj2l4Z.js";
import { E as CLAUDE_CLI_PROFILE_ID } from "./persisted-B2tK2f7d.js";
import { i as ensureAuthProfileStore } from "./store-B7DoDdVM.js";
import {
  c as normalizeOptionalString,
  m as resolvePrimaryStringValue,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { h as shortenHomePath } from "./utils-DtcDeqWS.js";
//#region src/commands/doctor-claude-cli.ts
/** Doctor health note for Claude CLI binary, auth, and workspace/project directories. */
const CLAUDE_CLI_PROVIDER = "claude-cli";
function usesClaudeCliModelSelection(cfg) {
  if (
    normalizeOptionalLowercaseString(
      resolvePrimaryStringValue(cfg.agents?.defaults?.model),
    )?.startsWith(`${CLAUDE_CLI_PROVIDER}/`)
  )
    return true;
  return Object.keys(cfg.agents?.defaults?.models ?? {}).some((key) =>
    normalizeOptionalLowercaseString(key)?.startsWith(`${CLAUDE_CLI_PROVIDER}/`),
  );
}
function resolveClaudeCliCommand(cfg) {
  const configured = cfg.agents?.defaults?.cliBackends ?? {};
  for (const [key, entry] of Object.entries(configured)) {
    if (normalizeOptionalLowercaseString(key) !== CLAUDE_CLI_PROVIDER) continue;
    const command = normalizeOptionalString(entry?.command);
    if (command) return command;
  }
  return "claude";
}
function probeDirectoryHealth(dirPath) {
  try {
    if (!fs.statSync(dirPath).isDirectory()) return "not_directory";
  } catch {
    return "missing";
  }
  try {
    fs.accessSync(dirPath, fs.constants.R_OK);
  } catch {
    return "unreadable";
  }
  try {
    fs.accessSync(dirPath, fs.constants.W_OK);
  } catch {
    return "readonly";
  }
  return "present";
}
function formatWorkspaceProblemLine(workspaceDir, health, agentId) {
  const label = agentId ? `Agent ${agentId} workspace` : "Workspace";
  const display = shortenHomePath(workspaceDir);
  if (health === "present" || health === "missing") return null;
  if (health === "not_directory") return `- ${label}: ${display} exists but is not a directory.`;
  if (health === "unreadable") return `- ${label}: ${display} is not readable by this user.`;
  return `- ${label}: ${display} is not writable by this user.`;
}
function formatProjectDirProblemLine(projectDir, health, agentId) {
  const label = agentId ? `Agent ${agentId} Claude project dir` : "Claude project dir";
  const display = shortenHomePath(projectDir);
  if (health === "present" || health === "missing") return null;
  if (health === "not_directory") return `- ${label}: ${display} exists but is not a directory.`;
  if (health === "unreadable") return `- ${label}: ${display} is not readable by this user.`;
  return `- ${label}: ${display} is not writable by this user.`;
}
function resolveClaudeCliAgentIds(cfg) {
  const runtimeAgentIds = listAgentIds(cfg).filter(
    (agentId) =>
      resolveModelAgentRuntimeMetadata({
        cfg,
        agentId,
      }).id === CLAUDE_CLI_PROVIDER,
  );
  if (runtimeAgentIds.length > 0) return runtimeAgentIds;
  if (usesClaudeCliModelSelection(cfg)) return [resolveDefaultAgentId(cfg)];
  return [];
}
function resolveClaudeCliWorkspaceTargets(params) {
  const agentIds = resolveClaudeCliAgentIds(params.cfg);
  const defaultAgentId = resolveDefaultAgentId(params.cfg);
  const seen = /* @__PURE__ */ new Set();
  return agentIds
    .filter((agentId) => {
      if (seen.has(agentId)) return false;
      seen.add(agentId);
      return true;
    })
    .map((agentId) => {
      const workspaceDir =
        params.workspaceDir && agentIds.length === 1 && agentId === defaultAgentId
          ? params.workspaceDir
          : resolveAgentWorkspaceDir(params.cfg, agentId, params.env);
      const projectDir = resolveClaudeCliProjectDirForWorkspace({
        workspaceDir,
        homeDir: params.homeDir,
      });
      return {
        agentId,
        workspaceDir,
        projectDir,
        workspaceHealth: probeDirectoryHealth(workspaceDir),
        projectDirHealth: probeDirectoryHealth(projectDir),
      };
    });
}
/**
 * Emits Claude CLI health diagnostics for every agent currently routed through the CLI backend.
 *
 * The optional deps let tests inject auth stores, PATH resolution, and workspace roots without
 * touching the user's real Claude credentials or filesystem.
 */
function noteClaudeCliHealth(cfg, deps) {
  const env = deps?.env ?? process.env;
  const workspaceTargets = resolveClaudeCliWorkspaceTargets({
    cfg,
    env,
    homeDir: deps?.homeDir,
    workspaceDir: deps?.workspaceDir,
  });
  if (workspaceTargets.length === 0) return;
  const store = deps?.store ?? ensureAuthProfileStore(void 0, { allowKeychainPrompt: false });
  const credential = (
    deps?.readClaudeCliCredentials ??
    (() => readClaudeCliCredentialsCached({ allowKeychainPrompt: false }))
  )();
  const command = resolveClaudeCliCommand(cfg);
  const commandPath = (
    deps?.resolveCommandPath ??
    ((rawCommand, nextEnv) => resolveExecutablePath(rawCommand, { env: nextEnv }))
  )(command, env);
  const authStorePath = resolveAuthStorePathForDisplay();
  const storedProfile = store.profiles[CLAUDE_CLI_PROFILE_ID];
  const defaultAgentId = resolveDefaultAgentId(cfg);
  const showAgentLabels =
    workspaceTargets.length > 1 ||
    workspaceTargets.some((target) => target.agentId !== defaultAgentId);
  const lines = [];
  const fixHints = [];
  if (!commandPath) {
    lines.push(`- Binary: command "${command}" was not found on PATH.`);
    fixHints.push(
      "- Fix: install Claude CLI or set agents.defaults.cliBackends.claude-cli.command to the real binary path.",
    );
  }
  if (!credential) {
    lines.push("- Headless Claude auth: unavailable without interactive prompting.");
    fixHints.push(
      `- Fix: run ${formatCliCommand("claude auth login")}, then ${formatCliCommand("openclaw models auth login --provider anthropic --method cli --set-default")}.`,
    );
  }
  if (!storedProfile) {
    lines.push(`- OpenClaw auth profile: missing (${CLAUDE_CLI_PROFILE_ID}) in ${authStorePath}.`);
    fixHints.push(
      `- Fix: run ${formatCliCommand("openclaw models auth login --provider anthropic --method cli --set-default")}.`,
    );
  } else if (storedProfile.provider !== CLAUDE_CLI_PROVIDER) {
    lines.push(
      `- OpenClaw auth profile: ${CLAUDE_CLI_PROFILE_ID} is wired to provider "${storedProfile.provider}" instead of "${CLAUDE_CLI_PROVIDER}".`,
    );
    fixHints.push(
      `- Fix: rerun ${formatCliCommand("openclaw models auth login --provider anthropic --method cli --set-default")} to rewrite the profile cleanly.`,
    );
  }
  for (const target of workspaceTargets) {
    const agentLabel = showAgentLabels ? target.agentId : void 0;
    const workspaceProblem = formatWorkspaceProblemLine(
      target.workspaceDir,
      target.workspaceHealth,
      agentLabel,
    );
    if (workspaceProblem) lines.push(workspaceProblem);
    if (
      target.workspaceHealth === "readonly" ||
      target.workspaceHealth === "unreadable" ||
      target.workspaceHealth === "not_directory"
    )
      fixHints.push(
        `- Fix: make ${agentLabel ? `agent ${agentLabel}'s workspace` : "the workspace"} a readable, writable directory for the gateway user.`,
      );
    const projectDirProblem = formatProjectDirProblemLine(
      target.projectDir,
      target.projectDirHealth,
      agentLabel,
    );
    if (projectDirProblem) lines.push(projectDirProblem);
    if (target.projectDirHealth === "unreadable" || target.projectDirHealth === "not_directory")
      fixHints.push(
        `- Fix: make ${agentLabel ? `agent ${agentLabel}'s Claude project dir` : "the Claude project dir"} readable, or remove the broken path and let Claude recreate it.`,
      );
  }
  if (lines.length > 0 && workspaceTargets.length > 1)
    lines.push(
      `- Agents using Claude CLI: ${workspaceTargets
        .map((target) => target.agentId)
        .toSorted((a, b) => a.localeCompare(b))
        .join(", ")}.`,
    );
  if (lines.length === 0 && fixHints.length === 0) return;
  if (fixHints.length > 0) lines.push(...fixHints);
  (deps?.noteFn ?? note)(lines.join("\n"), "Claude CLI");
}
//#endregion
export { noteClaudeCliHealth };
