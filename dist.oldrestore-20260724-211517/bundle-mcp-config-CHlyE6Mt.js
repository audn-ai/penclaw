import { r as loadEnabledBundleMcpConfig } from "./bundle-mcp-CS3Kv3z-.js";
import { r as normalizeConfiguredMcpServers } from "./mcp-config-normalize-Cgi6vawf.js";
//#region src/agents/bundle-mcp-config.ts
/**
 * Merges bundled plugin MCP servers with user-configured MCP servers for agent
 * runtimes.
 */
const OPENCLAW_TRANSPORT_TO_CLI_BUNDLE_TYPE = {
  "streamable-http": "http",
  http: "http",
  sse: "sse",
  stdio: "stdio",
};
/**
 * User config stores OpenClaw MCP transport names, while CLI backends such as
 * Claude Code and Gemini expect a downstream `type` field. Keep this adapter
 * out of the generic merge path because embedded OpenClaw still consumes the raw
 * OpenClaw `transport` shape directly.
 */
function toCliBundleMcpServerConfig(server) {
  const next = { ...server };
  const rawTransport = next.transport;
  delete next.transport;
  if (typeof next.type === "string") return next;
  if (typeof rawTransport === "string") {
    const mapped = OPENCLAW_TRANSPORT_TO_CLI_BUNDLE_TYPE[rawTransport];
    if (mapped) next.type = mapped;
  }
  return next;
}
/** Loads enabled bundled MCP servers and overlays user config by server name. */
function loadMergedBundleMcpConfig(params) {
  const bundleMcp = loadEnabledBundleMcpConfig({
    workspaceDir: params.workspaceDir,
    cfg: params.cfg,
    manifestRegistry: params.manifestRegistry,
  });
  const configuredMcp = normalizeConfiguredMcpServers(params.cfg?.mcp?.servers);
  const disabledConfiguredNames = new Set(
    Object.entries(configuredMcp)
      .filter(([, server]) => server.enabled === false)
      .map(([name]) => name),
  );
  const enabledConfiguredMcp = Object.fromEntries(
    Object.entries(configuredMcp).filter(([, server]) => server.enabled !== false),
  );
  const enabledBundleMcp = Object.fromEntries(
    Object.entries(bundleMcp.config.mcpServers).filter(
      ([name]) => !disabledConfiguredNames.has(name),
    ),
  );
  const mapConfiguredServer = params.mapConfiguredServer ?? ((server) => server);
  return {
    config: {
      mcpServers: {
        ...enabledBundleMcp,
        ...Object.fromEntries(
          Object.entries(enabledConfiguredMcp).map(([name, server]) => [
            name,
            mapConfiguredServer(server, name),
          ]),
        ),
      },
    },
    diagnostics: bundleMcp.diagnostics,
  };
}
//#endregion
export { toCliBundleMcpServerConfig as n, loadMergedBundleMcpConfig as t };
