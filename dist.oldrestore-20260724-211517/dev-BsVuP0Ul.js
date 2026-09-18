import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { r as replaceConfigFile } from "./config-BDv-QbJ6.js";
import { t as extractFrontmatterBlock } from "./frontmatter-CnpRhrvE.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { r as createConfigIO } from "./io-B3ne6NxF.js";
import { o as handleReset } from "./onboard-helpers-CUS3BGDx.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { h as shortenHomePath } from "./utils-DtcDeqWS.js";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-h9TzWSvp.js";
import { x as resolveWorkspaceTemplateSearchDirs } from "./workspace-DXzCbuC0.js";
//#region src/cli/gateway-cli/dev.ts
const DEV_IDENTITY_NAME = "C3-PO";
const DEV_IDENTITY_THEME = "protocol droid";
const DEV_IDENTITY_EMOJI = "🤖";
const DEV_AGENT_WORKSPACE_SUFFIX = "dev";
async function loadDevTemplate(name, fallback) {
  try {
    const templateDirs = await resolveWorkspaceTemplateSearchDirs();
    for (const templateDir of templateDirs) {
      let raw;
      try {
        raw = await fs.promises.readFile(path.join(templateDir, name), "utf-8");
      } catch (error) {
        if (error?.code === "ENOENT") continue;
        throw error;
      }
      return extractFrontmatterBlock(raw)?.body.replace(/^\s+/, "") ?? raw;
    }
  } catch {
    return fallback;
  }
  return fallback;
}
const resolveDevWorkspaceDir = (env = process.env) => {
  const baseDir = resolveDefaultAgentWorkspaceDir(env, os.homedir);
  if (normalizeOptionalLowercaseString(env.OPENCLAW_PROFILE) === "dev") return baseDir;
  return `${baseDir}-${DEV_AGENT_WORKSPACE_SUFFIX}`;
};
async function writeFileIfMissing(filePath, content) {
  try {
    await fs.promises.writeFile(filePath, content, {
      encoding: "utf-8",
      flag: "wx",
    });
  } catch (err) {
    if (err.code !== "EEXIST") throw err;
  }
}
async function ensureDevWorkspace(dir) {
  const resolvedDir = resolveUserPath(dir);
  await fs.promises.mkdir(resolvedDir, { recursive: true });
  const [agents, soul, tools, identity, user] = await Promise.all([
    loadDevTemplate(
      "AGENTS.dev.md",
      `# AGENTS.md - OpenClaw Dev Workspace\n\nDefault dev workspace for openclaw gateway --dev.\n`,
    ),
    loadDevTemplate(
      "SOUL.dev.md",
      `# SOUL.md - Dev Persona\n\nProtocol droid for debugging and operations.\n`,
    ),
    loadDevTemplate(
      "TOOLS.dev.md",
      `# TOOLS.md - User Tool Notes (editable)\n\nAdd your local tool notes here.\n`,
    ),
    loadDevTemplate(
      "IDENTITY.dev.md",
      `# IDENTITY.md - Agent Identity\n\n- Name: ${DEV_IDENTITY_NAME}\n- Creature: protocol droid\n- Vibe: ${DEV_IDENTITY_THEME}\n- Emoji: ${DEV_IDENTITY_EMOJI}\n`,
    ),
    loadDevTemplate(
      "USER.dev.md",
      `# USER.md - User Profile\n\n- Name:\n- Preferred address:\n- Notes:\n`,
    ),
  ]);
  await writeFileIfMissing(path.join(resolvedDir, "AGENTS.md"), agents);
  await writeFileIfMissing(path.join(resolvedDir, "SOUL.md"), soul);
  await writeFileIfMissing(path.join(resolvedDir, "TOOLS.md"), tools);
  await writeFileIfMissing(path.join(resolvedDir, "IDENTITY.md"), identity);
  await writeFileIfMissing(path.join(resolvedDir, "USER.md"), user);
}
async function ensureDevGatewayConfig(opts) {
  const workspace = resolveDevWorkspaceDir();
  if (opts.reset) await handleReset("full", workspace, defaultRuntime);
  const configPath = createConfigIO().configPath;
  const configExists = fs.existsSync(configPath);
  if (!opts.reset && configExists) return;
  await replaceConfigFile({
    nextConfig: {
      gateway: {
        mode: "local",
        bind: "loopback",
      },
      agents: {
        defaults: {
          workspace,
          skipBootstrap: true,
        },
        list: [
          {
            id: "dev",
            default: true,
            workspace,
            identity: {
              name: DEV_IDENTITY_NAME,
              theme: DEV_IDENTITY_THEME,
              emoji: DEV_IDENTITY_EMOJI,
            },
          },
        ],
      },
    },
    afterWrite: { mode: "auto" },
  });
  await ensureDevWorkspace(workspace);
  defaultRuntime.log(`Dev config ready: ${shortenHomePath(configPath)}`);
  defaultRuntime.log(`Dev workspace ready: ${shortenHomePath(resolveUserPath(workspace))}`);
}
//#endregion
export { ensureDevGatewayConfig };
