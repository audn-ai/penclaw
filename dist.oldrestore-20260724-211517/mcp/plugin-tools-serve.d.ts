import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { r as AnyAgentTool } from "../common-CuQ9SS3Z.js";
import { i as OpenClawConfig } from "../types.openclaw-DDo8sH3F.js";

//#region src/mcp/plugin-tools-serve.d.ts
declare function createPluginToolsMcpServer(params?: {
  config?: OpenClawConfig;
  tools?: AnyAgentTool[];
}): Server;
declare function servePluginToolsMcp(): Promise<void>;
//#endregion
export { createPluginToolsMcpServer, servePluginToolsMcp };
