import fs from "node:fs/promises";
import JSON5 from "json5";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { Nn as record, Rn as string, Zn as unknown } from "./schemas-CBJjibl3.js";
import { h as shortenHomePath } from "./utils-DtcDeqWS.js";
import { n as safeParseWithSchema } from "./zod-parse-Bip-sZi_.js";
//#region src/commands/setup.ts
/**
 * Minimal setup command.
 *
 * Ensures config, default workspace, and session directories exist without
 * running the full onboarding wizard.
 */
const JsonRecordSchema = record(string(), unknown());
const agentWorkspaceModuleLoader = createLazyImportLoader(() => import("./workspace-HbUpbNw-.js"));
const configIOModuleLoader = createLazyImportLoader(() => import("./config/config.js"));
const configLoggingModuleLoader = createLazyImportLoader(() => import("./logging-DtclSUgM.js"));
function loadAgentWorkspaceModule() {
  return agentWorkspaceModuleLoader.load();
}
function loadConfigIOModule() {
  return configIOModuleLoader.load();
}
function loadConfigLoggingModule() {
  return configLoggingModuleLoader.load();
}
async function createDefaultConfigIO() {
  const { createConfigIO } = await loadConfigIOModule();
  return createConfigIO();
}
async function resolveDefaultAgentWorkspaceDir(deps) {
  const override = deps.defaultAgentWorkspaceDir;
  if (typeof override === "string") return override;
  if (typeof override === "function") return await override();
  const { DEFAULT_AGENT_WORKSPACE_DIR } = await loadAgentWorkspaceModule();
  return DEFAULT_AGENT_WORKSPACE_DIR;
}
async function ensureDefaultAgentWorkspace(params) {
  const { ensureAgentWorkspace } = await loadAgentWorkspaceModule();
  return ensureAgentWorkspace(params);
}
async function writeDefaultConfigFile(config) {
  const { replaceConfigFile } = await loadConfigIOModule();
  await replaceConfigFile({
    nextConfig: config,
    afterWrite: { mode: "auto" },
  });
}
async function formatDefaultConfigPath(configPath) {
  const { formatConfigPath } = await loadConfigLoggingModule();
  return formatConfigPath(configPath);
}
async function logDefaultConfigUpdated(runtime, opts) {
  const { logConfigUpdated } = await loadConfigLoggingModule();
  logConfigUpdated(runtime, opts);
}
async function resolveDefaultSessionTranscriptsDir() {
  const { resolveSessionTranscriptsDir } = await import("./sessions-BRE1wJrU.js");
  return resolveSessionTranscriptsDir();
}
async function readConfigFileRaw(configPath) {
  try {
    const raw = await fs.readFile(configPath, "utf-8");
    return {
      exists: true,
      parsed: safeParseWithSchema(JsonRecordSchema, JSON5.parse(raw)) ?? {},
    };
  } catch {
    return {
      exists: false,
      parsed: {},
    };
  }
}
/** Prepares config, workspace, and session directories for a usable installation. */
async function setupCommand(opts, runtime = defaultRuntime, deps = {}) {
  const desiredWorkspace =
    typeof opts?.workspace === "string" && opts.workspace.trim() ? opts.workspace.trim() : void 0;
  const configPath = (deps.createConfigIO?.() ?? (await createDefaultConfigIO())).configPath;
  const existingRaw = await readConfigFileRaw(configPath);
  const cfg = existingRaw.parsed;
  const defaults = cfg.agents?.defaults ?? {};
  const workspace =
    desiredWorkspace ?? defaults.workspace ?? (await resolveDefaultAgentWorkspaceDir(deps));
  const next = {
    ...cfg,
    agents: {
      ...cfg.agents,
      defaults: {
        ...defaults,
        workspace,
      },
    },
    gateway: {
      ...cfg.gateway,
      mode: cfg.gateway?.mode ?? "local",
    },
  };
  if (
    !existingRaw.exists ||
    defaults.workspace !== workspace ||
    cfg.gateway?.mode !== next.gateway?.mode
  ) {
    await (deps.replaceConfigFile ?? ((params) => writeDefaultConfigFile(params.nextConfig)))({
      nextConfig: next,
      afterWrite: { mode: "auto" },
    });
    if (!existingRaw.exists) {
      const formatConfigPath = deps.formatConfigPath ?? formatDefaultConfigPath;
      runtime.log(`Wrote ${await formatConfigPath(configPath)}`);
    } else {
      const updates = [];
      if (defaults.workspace !== workspace) updates.push("set agents.defaults.workspace");
      if (cfg.gateway?.mode !== next.gateway?.mode) updates.push("set gateway.mode");
      const suffix = updates.length > 0 ? `(${updates.join(", ")})` : void 0;
      await (deps.logConfigUpdated ?? logDefaultConfigUpdated)(runtime, {
        path: configPath,
        suffix,
      });
    }
  } else {
    const formatConfigPath = deps.formatConfigPath ?? formatDefaultConfigPath;
    runtime.log(`Config OK: ${await formatConfigPath(configPath)}`);
  }
  const ws = await (deps.ensureAgentWorkspace ?? ensureDefaultAgentWorkspace)({
    dir: workspace,
    ensureBootstrapFiles: !next.agents?.defaults?.skipBootstrap,
    skipOptionalBootstrapFiles: next.agents?.defaults?.skipOptionalBootstrapFiles,
  });
  runtime.log(`Workspace OK: ${shortenHomePath(ws.dir)}`);
  const sessionsDir = await (
    deps.resolveSessionTranscriptsDir ?? resolveDefaultSessionTranscriptsDir
  )();
  await (deps.mkdir ?? fs.mkdir)(sessionsDir, { recursive: true });
  runtime.log(`Sessions OK: ${shortenHomePath(sessionsDir)}`);
  runtime.log("");
  runtime.log("Setup complete: config, workspace, and session directories are ready.");
  runtime.log(`Next guided path: ${formatCliCommand("openclaw onboard")}.`);
  runtime.log(
    `Next targeted changes: ${formatCliCommand("openclaw configure")} for models, channels, Gateway, plugins, skills, and health checks.`,
  );
  runtime.log(`Add a chat channel later: ${formatCliCommand("openclaw channels add")}.`);
}
//#endregion
export { setupCommand };
