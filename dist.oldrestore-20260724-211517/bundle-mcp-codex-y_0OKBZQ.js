import { n as normalizeAgentId, t as isValidAgentId } from "./agent-id-DDgUze4y.js";
import {
  r as normalizeCodexMcpServerConfig,
  t as buildCodexMcpServersConfig,
} from "./codex-mcp-config-BSz1hj9i.js";
import {
  r as resolveMcpBearerBundleConfig,
  t as requiresMcpBearerProjection,
} from "./mcp-auth-profile-Cy6hOvQm.js";
import { r as normalizeConfiguredMcpServers } from "./mcp-config-normalize-Cgi6vawf.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { n as serializeTomlInlineValue } from "./toml-inline-SRiIGG7O.js";
//#region src/agents/cli-runner/bundle-mcp-codex.ts
/**
 * Codex CLI and app-server bundle MCP projection helpers.
 */
function normalizeAgentIds(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry) => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter((entry) => isValidAgentId(entry))
    .map((entry) => normalizeAgentId(entry));
}
function readCodexProjectionConfig(server) {
  return isRecord(server.codex) ? server.codex : {};
}
function isCodexMcpServerAllowedForAgent(server, options) {
  const codex = readCodexProjectionConfig(server);
  if (!Object.hasOwn(codex, "agents")) return true;
  const agentIds = normalizeAgentIds(codex.agents);
  if (agentIds.length === 0 || !options?.agentId) return false;
  return agentIds.includes(normalizeAgentId(options.agentId));
}
/** Returns Codex CLI args with TOML MCP server overrides injected. */
function injectCodexMcpConfigArgs(args, config) {
  const overrides = serializeTomlInlineValue(buildCodexMcpServersConfig(config));
  return [...(args ?? []), "-c", `mcp_servers=${overrides}`];
}
/**
 * Codex app-server runtime (extensions/codex) receives its thread config as a
 * JSON object through JSON-RPC `thread/start`/`thread/resume`, not as `-c` CLI
 * args. This returns a thread-config patch projecting user-configured
 * `cfg.mcp.servers` entries into Codex's `mcp_servers` table using the same
 * per-server normalization the CLI path uses, so app-server agents see the
 * same user MCP servers the CLI runtime exposes via `injectCodexMcpConfigArgs`.
 *
 * Only user-configured servers (`cfg.mcp.servers`) are projected. Plugin-
 * curated app-server apps are already attached separately through the codex
 * plugin thread-config `apps` patch, so they must not be re-projected here.
 */
function buildCodexUserMcpServersThreadConfigPatch(cfg, options) {
  const userServers = normalizeConfiguredMcpServers(cfg?.mcp?.servers);
  const entries = Object.entries(userServers);
  if (entries.length === 0) return;
  const mcp_servers = {};
  for (const [name, server] of entries) {
    if (server.enabled === false) continue;
    if (!isCodexMcpServerAllowedForAgent(server, options)) continue;
    mcp_servers[name] = normalizeCodexMcpServerConfig(name, server);
  }
  if (Object.keys(mcp_servers).length === 0) return;
  return { mcp_servers };
}
/** Async runtime projection that resolves OpenClaw-managed MCP bearer tokens. */
async function buildCodexUserMcpServersThreadConfigPatchForRuntime(cfg, options) {
  const userServers = normalizeConfiguredMcpServers(cfg?.mcp?.servers);
  const entries = Object.entries(userServers);
  if (entries.length === 0) return;
  let allowedServers = Object.fromEntries(
    entries.filter(
      ([, server]) => server.enabled !== false && isCodexMcpServerAllowedForAgent(server, options),
    ),
  );
  if (Object.keys(allowedServers).length === 0) return;
  if (options?.allowLiteralOAuthProjection === false) {
    const remoteSafeServers = {};
    for (const [serverName, server] of Object.entries(allowedServers)) {
      if (requiresMcpBearerProjection(server)) {
        options.onServerUnavailable?.(
          serverName,
          /* @__PURE__ */ new Error(
            `MCP OAuth bearer projection is only supported for local app-server connections.`,
          ),
        );
        continue;
      }
      remoteSafeServers[serverName] = server;
    }
    allowedServers = remoteSafeServers;
  }
  if (Object.keys(allowedServers).length === 0) return;
  const resolvedConfig = await resolveMcpBearerBundleConfig({
    config: { mcpServers: allowedServers },
    cfg,
    agentDir: options?.agentDir,
    tokenProjection: "literal",
    omitUnavailableOAuthServers: true,
    onServerUnavailable: options?.onServerUnavailable,
  });
  const mcp_servers = {};
  for (const [name, server] of Object.entries(resolvedConfig.config.mcpServers))
    mcp_servers[name] = normalizeCodexMcpServerConfig(name, server);
  return Object.keys(mcp_servers).length === 0 ? void 0 : { mcp_servers };
}
//#endregion
export {
  buildCodexUserMcpServersThreadConfigPatchForRuntime as n,
  injectCodexMcpConfigArgs as r,
  buildCodexUserMcpServersThreadConfigPatch as t,
};
