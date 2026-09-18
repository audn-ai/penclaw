import { pathToFileURL } from "node:url";
import { t as createCrestodianTool } from "../crestodian-tool-CaUkL-Lw.js";
import { t as createCronTool } from "../cron-tool-nnu5h65s.js";
import { r as formatErrorMessage } from "../errors-BoHeli7m.js";
import {
  c as resolveOpenClawToolsMcpToolSelection,
  i as OPENCLAW_TOOLS_MCP_TOOLS_ENV,
  o as resolveOpenClawToolsMcpCrestodianApproval,
  r as OPENCLAW_TOOLS_MCP_CRESTODIAN_SURFACE_ENV,
  s as resolveOpenClawToolsMcpCrestodianSurface,
} from "../openclaw-tools-serve-config-jdriyIgv.js";
import {
  n as createToolsMcpServer,
  t as connectToolsMcpServerToStdio,
} from "../tools-stdio-server-BjFsxEDM.js";
import "@modelcontextprotocol/sdk/server/index.js";
//#region src/mcp/openclaw-tools-serve.ts
/**
 * Standalone MCP server for selected built-in OpenClaw tools.
 *
 * Run via: node --import tsx src/mcp/openclaw-tools-serve.ts
 * Or: bun src/mcp/openclaw-tools-serve.ts
 */
const OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV = "OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY";
function resolveOpenClawToolsMcpAgentSessionKey(env = process.env) {
  return env["OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY"]?.trim() || void 0;
}
function resolveOpenClawToolsForMcp(params = {}) {
  return (params.tools ?? resolveOpenClawToolsMcpToolSelection()).map((tool) => {
    if (tool === "crestodian")
      return createCrestodianTool({
        surface: params.crestodianSurface ?? resolveOpenClawToolsMcpCrestodianSurface(),
        ...resolveOpenClawToolsMcpCrestodianApproval(),
      });
    const agentSessionKey = (
      params.agentSessionKey ?? resolveOpenClawToolsMcpAgentSessionKey()
    )?.trim();
    if (!agentSessionKey)
      throw new Error(`${OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV} is required`);
    return createCronTool({
      agentSessionKey,
      creatorToolAllowlist: [{ name: "cron" }],
    });
  });
}
function createOpenClawToolsMcpServer(params = {}) {
  return createToolsMcpServer({
    name: "openclaw-tools",
    tools: params.tools ?? resolveOpenClawToolsForMcp(),
  });
}
async function serveOpenClawToolsMcp() {
  await connectToolsMcpServerToStdio(createOpenClawToolsMcpServer());
}
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href)
  serveOpenClawToolsMcp().catch((err) => {
    process.stderr.write(`openclaw-tools-serve: ${formatErrorMessage(err)}\n`);
    process.exit(1);
  });
//#endregion
export {
  OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV,
  OPENCLAW_TOOLS_MCP_CRESTODIAN_SURFACE_ENV,
  OPENCLAW_TOOLS_MCP_TOOLS_ENV,
  resolveOpenClawToolsForMcp,
  resolveOpenClawToolsMcpAgentSessionKey,
};
