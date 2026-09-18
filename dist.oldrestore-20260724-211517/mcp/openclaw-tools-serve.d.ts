import { r as AnyAgentTool } from "../common-CuQ9SS3Z.js";
import { t as CrestodianToolOptions } from "../crestodian-tool-50WDa1oF.js";

//#region src/mcp/openclaw-tools-serve-config.d.ts
declare const OPENCLAW_TOOLS_MCP_TOOLS_ENV = "OPENCLAW_TOOLS_MCP_TOOLS";
declare const OPENCLAW_TOOLS_MCP_CRESTODIAN_SURFACE_ENV = "OPENCLAW_TOOLS_MCP_CRESTODIAN_SURFACE";
declare const OPENCLAW_TOOLS_MCP_TOOL_IDS: readonly ["cron", "crestodian"];
type OpenClawToolsMcpToolId = (typeof OPENCLAW_TOOLS_MCP_TOOL_IDS)[number];
//#endregion
//#region src/mcp/openclaw-tools-serve.d.ts
declare const OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV = "OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY";
declare function resolveOpenClawToolsMcpAgentSessionKey(
  env?: NodeJS.ProcessEnv,
): string | undefined;
declare function resolveOpenClawToolsForMcp(params?: {
  agentSessionKey?: string;
  tools?: OpenClawToolsMcpToolId[];
  crestodianSurface?: CrestodianToolOptions["surface"];
}): AnyAgentTool[];
//#endregion
export {
  OPENCLAW_TOOLS_MCP_AGENT_SESSION_KEY_ENV,
  OPENCLAW_TOOLS_MCP_CRESTODIAN_SURFACE_ENV,
  OPENCLAW_TOOLS_MCP_TOOLS_ENV,
  resolveOpenClawToolsForMcp,
  resolveOpenClawToolsMcpAgentSessionKey,
};
