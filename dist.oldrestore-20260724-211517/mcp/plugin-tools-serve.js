import { pathToFileURL } from "node:url";
import { a as routeLogsToStderr } from "../console-CspqtrUy.js";
import { r as formatErrorMessage } from "../errors-BoHeli7m.js";
import "../config-BDv-QbJ6.js";
import { i as getRuntimeConfig } from "../io-B3ne6NxF.js";
import { n as pickSandboxToolPolicy } from "../sandbox-tool-policy-ClB7s2K0.js";
import {
  a as collectExplicitDenylist,
  c as mergeAlsoAllowPolicy,
  h as resolveToolProfilePolicy,
  i as collectExplicitAllowlist,
} from "../tool-policy-1QHiwXPv.js";
import {
  a as resolvePluginTools,
  r as ensureStandalonePluginToolRegistryLoaded,
} from "../tools-K3NqAe9E.js";
import {
  n as createToolsMcpServer,
  t as connectToolsMcpServerToStdio,
} from "../tools-stdio-server-BjFsxEDM.js";
import "@modelcontextprotocol/sdk/server/index.js";
//#region src/mcp/plugin-tools-serve.ts
/**
 * Standalone MCP server that exposes OpenClaw plugin-registered tools
 * (e.g. memory-lancedb's memory_recall, memory_store, memory_forget)
 * so ACP sessions running Claude Code can use them.
 *
 * Run via: node --import tsx src/mcp/plugin-tools-serve.ts
 * Or: bun src/mcp/plugin-tools-serve.ts
 */
function resolvePluginToolPolicy(config) {
  const profilePolicy = mergeAlsoAllowPolicy(
    resolveToolProfilePolicy(config.tools?.profile),
    config.tools?.alsoAllow,
  );
  const globalPolicy = pickSandboxToolPolicy(config.tools);
  const toolAllowlist = collectExplicitAllowlist([profilePolicy, globalPolicy]);
  const toolDenylist = collectExplicitDenylist([profilePolicy, globalPolicy]);
  return {
    ...(toolAllowlist.length > 0 ? { toolAllowlist } : {}),
    ...(toolDenylist.length > 0 ? { toolDenylist } : {}),
  };
}
function resolveTools(config) {
  const pluginToolPolicy = resolvePluginToolPolicy(config);
  const runtimeRegistry = ensureStandalonePluginToolRegistryLoaded({
    context: { config },
    ...pluginToolPolicy,
  });
  return resolvePluginTools({
    context: { config },
    ...pluginToolPolicy,
    suppressNameConflicts: true,
    runtimeRegistry,
  });
}
function createPluginToolsMcpServer(params = {}) {
  const cfg = params.config ?? getRuntimeConfig();
  return createToolsMcpServer({
    name: "openclaw-plugin-tools",
    tools: params.tools ?? resolveTools(cfg),
  });
}
async function servePluginToolsMcp() {
  routeLogsToStderr();
  const config = getRuntimeConfig();
  const tools = resolveTools(config);
  const server = createPluginToolsMcpServer({
    config,
    tools,
  });
  if (tools.length === 0) process.stderr.write("plugin-tools-serve: no plugin tools found\n");
  await connectToolsMcpServerToStdio(server);
}
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href)
  servePluginToolsMcp().catch((err) => {
    process.stderr.write(`plugin-tools-serve: ${formatErrorMessage(err)}\n`);
    process.exit(1);
  });
//#endregion
export { createPluginToolsMcpServer, servePluginToolsMcp };
