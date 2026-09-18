import {
  a as normalizeEnvVarKey,
  i as isDangerousHostInheritedEnvVarName,
  r as isDangerousHostEnvVarName,
} from "./host-env-security-pMY6K0Qy.js";
//#region src/agents/mcp-config-shared.ts
/**
 * Shared MCP config coercion helpers.
 *
 * MCP transport setup uses these functions to normalize loose JSON config into
 * string records/arrays while dropping unsafe host environment variables.
 */
const MCP_EXPLICIT_CREDENTIAL_ENV_KEYS = /* @__PURE__ */ new Set([
  "AMQP_URL",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_SECURITY_TOKEN",
  "AWS_SESSION_TOKEN",
  "AZURE_CLIENT_ID",
  "AZURE_CLIENT_SECRET",
  "DATABASE_URL",
  "GH_TOKEN",
  "GITHUB_TOKEN",
  "GITLAB_TOKEN",
  "MONGODB_URI",
  "NODE_AUTH_TOKEN",
  "NPM_TOKEN",
  "REDIS_URL",
]);
function isDangerousMcpStdioEnvVarName(rawKey) {
  if (isDangerousHostEnvVarName(rawKey)) return true;
  const key = normalizeEnvVarKey(rawKey);
  if (!key || MCP_EXPLICIT_CREDENTIAL_ENV_KEYS.has(key.toUpperCase())) return false;
  return isDangerousHostInheritedEnvVarName(key);
}
/** Returns whether a value is a plain MCP config record. */
function isMcpConfigRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function toMcpFilteredStringRecord(value, options) {
  if (!isMcpConfigRecord(value)) return;
  let droppedByKey = false;
  const entries = Object.entries(value)
    .map(([key, entry]) => {
      if (options?.shouldDropKey?.(key)) {
        droppedByKey = true;
        options?.onDroppedEntry?.(key, entry);
        return null;
      }
      if (typeof entry === "string") return [key, entry];
      if (typeof entry === "number" || typeof entry === "boolean") return [key, String(entry)];
      options?.onDroppedEntry?.(key, entry);
      return null;
    })
    .filter((entry) => entry !== null);
  if (entries.length === 0 && droppedByKey && options?.preserveEmptyWhenKeysDropped) return {};
  return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
/** Coerces string/number/boolean entries from a config object into strings. */
function toMcpStringRecord(value, options) {
  return toMcpFilteredStringRecord(value, options);
}
/** Coerces MCP env config while dropping dangerous inherited host env names. */
function toMcpEnvRecord(value, options) {
  return toMcpFilteredStringRecord(value, {
    ...options,
    preserveEmptyWhenKeysDropped: true,
    shouldDropKey: (key) => isDangerousMcpStdioEnvVarName(key),
  });
}
/** Coerces an MCP string-array config value, dropping non-string entries. */
function toMcpStringArray(value) {
  if (!Array.isArray(value)) return;
  const entries = value.filter((entry) => typeof entry === "string");
  return entries.length > 0 ? entries : [];
}
//#endregion
//#region src/agents/mcp-stdio.ts
/**
 * Stdio MCP launch config normalization.
 * Accepts OpenClaw and upstream MCP config field names, keeping only
 * command/args/env/cwd needed to spawn a stdio server.
 */
/** Resolve raw MCP server config into a stdio launch config. */
function resolveStdioMcpServerLaunchConfig(raw, options) {
  if (!isMcpConfigRecord(raw))
    return {
      ok: false,
      reason: "server config must be an object",
    };
  if (typeof raw.command !== "string" || raw.command.trim().length === 0) {
    if (typeof raw.url === "string" && raw.url.trim().length > 0)
      return {
        ok: false,
        reason: "not a stdio server (has url)",
      };
    return {
      ok: false,
      reason: "its command is missing",
    };
  }
  const cwd =
    typeof raw.cwd === "string" && raw.cwd.trim().length > 0
      ? raw.cwd
      : typeof raw.workingDirectory === "string" && raw.workingDirectory.trim().length > 0
        ? raw.workingDirectory
        : void 0;
  return {
    ok: true,
    config: {
      command: raw.command,
      args: toMcpStringArray(raw.args),
      env: toMcpEnvRecord(raw.env, { onDroppedEntry: options?.onDroppedEnv }),
      cwd,
    },
  };
}
/** Describe a stdio MCP launch config for diagnostics. */
function describeStdioMcpServerLaunchConfig(config) {
  const args =
    Array.isArray(config.args) && config.args.length > 0 ? ` ${config.args.join(" ")}` : "";
  const cwd = config.cwd ? ` (cwd=${config.cwd})` : "";
  return `${config.command}${args}${cwd}`;
}
//#endregion
export {
  toMcpStringRecord as i,
  resolveStdioMcpServerLaunchConfig as n,
  isMcpConfigRecord as r,
  describeStdioMcpServerLaunchConfig as t,
};
