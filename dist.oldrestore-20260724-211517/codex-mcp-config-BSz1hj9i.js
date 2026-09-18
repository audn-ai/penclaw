import crypto from "node:crypto";
import { a as shouldCreateBundleMcpRuntimeForAttempt } from "./attempt-tool-construction-plan-tLraujwv.js";
import "./utils-DtcDeqWS.js";
import { r as loadEnabledBundleMcpConfig } from "./bundle-mcp-CS3Kv3z-.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region src/agents/cli-runner/bundle-mcp-adapter-shared.ts
/**
 * Shared normalization helpers for CLI-specific bundle MCP adapters.
 */
function normalizeStringArray(value) {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string")
    ? [...value]
    : void 0;
}
/** Normalize a string-valued record, dropping non-string entries. */
function normalizeStringRecord(value) {
  if (!isRecord(value)) return;
  const entries = Object.entries(value).filter((entry) => {
    return typeof entry[1] === "string";
  });
  return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
/** Decode supported `${ENV}` and `Bearer ${ENV}` header placeholders. */
function decodeHeaderEnvPlaceholder(value) {
  const bearerEnvVar = /^Bearer \${([A-Z0-9_]+)}$/.exec(value)?.at(1);
  if (bearerEnvVar)
    return {
      envVar: bearerEnvVar,
      bearer: true,
    };
  const envVar = /^\${([A-Z0-9_]+)}$/.exec(value)?.at(1);
  if (envVar)
    return {
      envVar,
      bearer: false,
    };
  return null;
}
/** Copy common MCP server config fields into a CLI adapter config object. */
function applyCommonServerConfig(next, server) {
  if (typeof server.command === "string") next.command = server.command;
  const args = normalizeStringArray(server.args);
  if (args) next.args = args;
  const env = normalizeStringRecord(server.env);
  if (env) next.env = env;
  if (typeof server.cwd === "string") next.cwd = server.cwd;
  if (typeof server.url === "string") next.url = server.url;
}
//#endregion
//#region src/agents/codex-mcp-config.ts
/**
 * Projects enabled bundle MCP servers into Codex app-server thread config.
 * The projection keeps loopback approval defaults and header env placeholders
 * compatible with Codex's MCP config shape.
 */
function isOpenClawLoopbackMcpServer(name, server) {
  return (
    name === "openclaw" &&
    typeof server.url === "string" &&
    /^https?:\/\/(?:127\.0\.0\.1|localhost):\d+\/mcp(?:[?#].*)?$/.test(server.url)
  );
}
const CODEX_MCP_TOOL_APPROVAL_MODES = /* @__PURE__ */ new Set(["auto", "prompt", "approve"]);
function readCodexProjectionConfig(server) {
  return isRecord(server.codex) ? server.codex : {};
}
function normalizeCodexToolApprovalMode(value) {
  return typeof value === "string" && CODEX_MCP_TOOL_APPROVAL_MODES.has(value) ? value : void 0;
}
function resolveCodexDefaultToolsApprovalMode(server) {
  const codex = readCodexProjectionConfig(server);
  return (
    normalizeCodexToolApprovalMode(codex.defaultToolsApprovalMode) ??
    normalizeCodexToolApprovalMode(codex.default_tools_approval_mode)
  );
}
function normalizeToolFilterList(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry) => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter(Boolean);
}
function assertCodexExactToolFilters(serverName, fieldName, patterns) {
  const wildcard = patterns.find((pattern) => pattern.includes("*"));
  if (!wildcard) return;
  throw new Error(
    `Cannot project mcp.servers.${serverName}.toolFilter.${fieldName} pattern "${wildcard}" into Codex ${fieldName === "include" ? "enabled_tools" : "disabled_tools"}: Codex MCP projection only supports exact tool names.`,
  );
}
function applyCodexToolFilter(next, name, server) {
  if (!isRecord(server.toolFilter)) return;
  const include = normalizeToolFilterList(server.toolFilter.include);
  const exclude = normalizeToolFilterList(server.toolFilter.exclude);
  assertCodexExactToolFilters(name, "include", include);
  assertCodexExactToolFilters(name, "exclude", exclude);
  if (include.length > 0) next.enabled_tools = include;
  if (exclude.length > 0) next.disabled_tools = exclude;
}
/** Normalizes one bundle MCP server into Codex's mcp_servers shape. */
function normalizeCodexMcpServerConfig(name, server) {
  const next = {};
  applyCommonServerConfig(next, server);
  applyCodexToolFilter(next, name, server);
  const defaultToolsApprovalMode = resolveCodexDefaultToolsApprovalMode(server);
  if (defaultToolsApprovalMode) next.default_tools_approval_mode = defaultToolsApprovalMode;
  else if (isOpenClawLoopbackMcpServer(name, server)) next.default_tools_approval_mode = "approve";
  const httpHeaders = normalizeStringRecord(server.headers);
  if (httpHeaders) {
    const staticHeaders = {};
    const envHeaders = {};
    for (const [nameLocal, value] of Object.entries(httpHeaders)) {
      const decoded = decodeHeaderEnvPlaceholder(value);
      if (!decoded) {
        staticHeaders[nameLocal] = value;
        continue;
      }
      if (decoded.bearer && normalizeOptionalLowercaseString(nameLocal) === "authorization") {
        next.bearer_token_env_var = decoded.envVar;
        continue;
      }
      envHeaders[nameLocal] = decoded.envVar;
    }
    if (Object.keys(staticHeaders).length > 0) next.http_headers = staticHeaders;
    if (Object.keys(envHeaders).length > 0) next.env_http_headers = envHeaders;
  }
  return next;
}
/** Build Codex `mcp_servers` config from normalized bundle MCP config. */
function buildCodexMcpServersConfig(config) {
  return Object.fromEntries(
    Object.entries(config.mcpServers).map(([name, server]) => [
      name,
      normalizeCodexMcpServerConfig(name, server),
    ]),
  );
}
function stableJsonValue(value) {
  if (Array.isArray(value)) return value.map(stableJsonValue);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .toSorted(([left], [right]) => left.localeCompare(right))
      .map(([key, child]) => [key, stableJsonValue(child)]),
  );
}
function fingerprintCodexMcpServersConfig(config) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(stableJsonValue(config)))
    .digest("hex");
}
/** Load bundle MCP config for one Codex app-server thread. */
function loadCodexBundleMcpThreadConfig(params) {
  if (
    !shouldCreateBundleMcpRuntimeForAttempt({
      toolsEnabled: params.toolsEnabled ?? true,
      disableTools: params.disableTools,
      toolsAllow: params.toolsAllow,
    })
  )
    return {
      diagnostics: [],
      evaluated: true,
    };
  const bundleMcp = loadEnabledBundleMcpConfig({
    workspaceDir: params.workspaceDir,
    cfg: params.cfg,
  });
  const mcpServers = buildCodexMcpServersConfig(bundleMcp.config);
  if (Object.keys(mcpServers).length === 0)
    return {
      diagnostics: bundleMcp.diagnostics,
      evaluated: true,
    };
  return {
    configPatch: { mcp_servers: mcpServers },
    diagnostics: bundleMcp.diagnostics,
    evaluated: true,
    fingerprint: fingerprintCodexMcpServersConfig(mcpServers),
  };
}
//#endregion
export {
  decodeHeaderEnvPlaceholder as a,
  applyCommonServerConfig as i,
  loadCodexBundleMcpThreadConfig as n,
  normalizeStringRecord as o,
  normalizeCodexMcpServerConfig as r,
  buildCodexMcpServersConfig as t,
};
