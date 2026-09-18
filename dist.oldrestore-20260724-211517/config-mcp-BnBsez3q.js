import {
  n as mcpValueHasEnvReferences,
  r as resolveMcpEnvReferences,
} from "./config-env-DtVuBTUE.js";
import { a as readPositiveNumber } from "./config-provider-contract-g5C6wKyT.js";
import { a as isRecord, c as readString, f as sanitizeName } from "./helpers-DtCn6Wrs.js";
import { s as createMigrationManualItem } from "./migration-nGWjmzKy.js";
//#region extensions/migrate-hermes/config-mcp.ts
const MCP_RESOURCE_UTILITY_TOOLS = ["resources_list", "resources_read"];
const MCP_PROMPT_UTILITY_TOOLS = ["prompts_list", "prompts_get"];
function readBoolean(value) {
  return typeof value === "boolean" ? value : void 0;
}
function readBooleanish(value) {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return;
  const normalized = value.trim().toLowerCase();
  if (["true", "1", "yes", "on"].includes(normalized)) return true;
  return ["false", "0", "no", "off"].includes(normalized) ? false : void 0;
}
function readPositiveNumeric(value) {
  if (typeof value === "number") return readPositiveNumber(value);
  if (typeof value !== "string" || !value.trim()) return;
  return readPositiveNumber(Number(value));
}
function readToolFilterList(value) {
  if (typeof value === "string") return value.trim() ? [value.trim()] : void 0;
  if (!Array.isArray(value) || !value.every((entry) => typeof entry === "string")) return;
  return [...new Set(value.map((entry) => entry.trim()).filter(Boolean))];
}
function mapHermesToolFilter(value) {
  const direct = isRecord(value.toolFilter)
    ? value.toolFilter
    : isRecord(value.tool_filter)
      ? value.tool_filter
      : void 0;
  if (direct) {
    const include = readToolFilterList(direct.include);
    const exclude = readToolFilterList(direct.exclude);
    if (include && include.length > 0) return { include };
    return exclude !== void 0 && exclude.length > 0 ? { exclude } : void 0;
  }
  const tools = isRecord(value.tools) ? value.tools : void 0;
  if (!tools) return;
  const include = readToolFilterList(tools.include);
  const exclude = readToolFilterList(tools.exclude);
  const resourcesEnabled = readBooleanish(tools.resources) !== false;
  const promptsEnabled = readBooleanish(tools.prompts) !== false;
  if (include && include.length > 0)
    return {
      include: [
        ...include,
        ...(resourcesEnabled ? MCP_RESOURCE_UTILITY_TOOLS : []),
        ...(promptsEnabled ? MCP_PROMPT_UTILITY_TOOLS : []),
      ],
    };
  const translatedExclude = [
    ...(exclude ?? []),
    ...(!resourcesEnabled ? MCP_RESOURCE_UTILITY_TOOLS : []),
    ...(!promptsEnabled ? MCP_PROMPT_UTILITY_TOOLS : []),
  ];
  return translatedExclude.length > 0 ? { exclude: translatedExclude } : void 0;
}
function mapHermesClientCertificate(value) {
  const cert = value.clientCert ?? value.client_cert;
  const key = readString(value.clientKey) ?? readString(value.client_key);
  if (Array.isArray(cert) && cert.length === 2) {
    const certPath = readString(cert[0]);
    const keyPath = readString(cert[1]);
    return certPath && keyPath
      ? {
          clientCert: certPath,
          clientKey: keyPath,
        }
      : {};
  }
  const certPath = readString(cert);
  return certPath && key
    ? {
        clientCert: certPath,
        clientKey: key,
      }
    : {};
}
const MCP_CONNECTION_FIELDS = [
  "enabled",
  "command",
  "args",
  "cwd",
  "workingDirectory",
  "url",
  "connectionTimeoutMs",
  "requestTimeoutMs",
  "timeout",
];
function importsMcpSensitiveValues(value, includeSecrets) {
  return (
    includeSecrets &&
    (value.env !== void 0 ||
      value.headers !== void 0 ||
      MCP_CONNECTION_FIELDS.some((key) => mcpValueHasEnvReferences(value[key])))
  );
}
function mapHermesMcpOauth(value) {
  const oauth = isRecord(value.oauth) ? value.oauth : void 0;
  if (!oauth) return;
  const mapped = {};
  for (const key of ["authProfileId", "scope", "redirectUrl", "clientMetadataUrl"]) {
    const fieldValue = readString(oauth[key]);
    if (fieldValue) mapped[key] = fieldValue;
  }
  return Object.keys(mapped).length > 0 ? mapped : void 0;
}
function mapMcpServer(value, includeSecrets, env) {
  const next = {};
  for (const key of MCP_CONNECTION_FIELDS) {
    const sourceValue = value[key];
    if (sourceValue === void 0) continue;
    if (!mcpValueHasEnvReferences(sourceValue)) {
      next[key] = sourceValue;
      continue;
    }
    if (includeSecrets) {
      const resolved = resolveMcpEnvReferences(sourceValue, env);
      if (!resolved.unresolved) next[key] = resolved.value;
    }
  }
  const transport = readString(value.transport) ?? readString(value.type);
  if (transport === "http" || transport === "streamable-http") next.transport = "streamable-http";
  else if (transport === "sse" || transport === "stdio") next.transport = transport;
  else if (!transport && readString(next.url)) next.transport = "streamable-http";
  next.connectTimeout = value.connectTimeout ?? value.connect_timeout;
  next.supportsParallelToolCalls = readBoolean(
    value.supportsParallelToolCalls ?? value.supports_parallel_tool_calls,
  );
  next.sslVerify = readBoolean(value.sslVerify ?? value.ssl_verify);
  next.auth = readString(value.auth) === "oauth" ? "oauth" : void 0;
  next.oauth = mapHermesMcpOauth(value);
  Object.assign(next, mapHermesClientCertificate(value));
  next.toolFilter = mapHermesToolFilter(value);
  if (includeSecrets) {
    for (const key of ["env", "headers"])
      if (value[key] !== void 0) {
        const resolved = resolveMcpEnvReferences(value[key], env);
        if (!resolved.unresolved) next[key] = resolved.value;
      }
  }
  const mapped = Object.fromEntries(Object.entries(next).filter(([, entry]) => entry !== void 0));
  return readString(mapped.command) || readString(mapped.url) ? mapped : {};
}
function mcpManualItems(params) {
  const { name, raw } = params;
  const safeName = sanitizeName(name);
  const items = [];
  const add = (suffix, message, recommendation) => {
    items.push(
      createMigrationManualItem({
        id: `manual:mcp-server-${suffix}:${safeName}`,
        source: params.source,
        message,
        recommendation,
      }),
    );
  };
  const interpolatedValues = [
    ...MCP_CONNECTION_FIELDS.map((key) => raw[key]),
    raw.env,
    raw.headers,
  ];
  if (
    !params.includeSecrets &&
    (raw.env !== void 0 ||
      raw.headers !== void 0 ||
      interpolatedValues.some(mcpValueHasEnvReferences))
  )
    add(
      "secrets",
      `Hermes MCP server "${name}" has environment-backed values that were not imported without secret consent.`,
      "Re-run with --include-secrets or configure these values manually.",
    );
  if (
    params.includeSecrets &&
    interpolatedValues.some(
      (value) => value !== void 0 && resolveMcpEnvReferences(value, params.env).unresolved,
    )
  )
    add(
      "unresolved-secrets",
      `Hermes MCP server "${name}" references environment values that were not found in its .env file.`,
      "Define the missing values in OpenClaw's MCP server environment or headers manually.",
    );
  const cert = raw.clientCert ?? raw.client_cert;
  const key = readString(raw.clientKey) ?? readString(raw.client_key);
  if (Array.isArray(cert) && cert.length === 3)
    add(
      "client-cert-password",
      `Hermes MCP server "${name}" uses a password-protected client key, which OpenClaw cannot represent in MCP config.`,
      "Configure an unencrypted protected key path or an equivalent TLS proxy manually.",
    );
  else if (
    (cert !== void 0 || key !== void 0) &&
    !(
      (Array.isArray(cert) && cert.length === 2 && readString(cert[0]) && readString(cert[1])) ||
      (readString(cert) && key)
    )
  )
    add(
      "client-cert",
      `Hermes MCP server "${name}" uses a combined or invalid client-certificate shape that was not imported.`,
      "Configure separate OpenClaw clientCert and clientKey file paths manually.",
    );
  if (typeof (raw.sslVerify ?? raw.ssl_verify) === "string")
    add(
      "tls-ca",
      `Hermes MCP server "${name}" uses a CA bundle path for TLS verification, which OpenClaw MCP config cannot represent.`,
      "Install the CA in the host trust store or configure an equivalent TLS proxy manually.",
    );
  const transport = readString(raw.transport) ?? readString(raw.type);
  if (transport && !["http", "streamable-http", "sse", "stdio"].includes(transport))
    add(
      "transport",
      `Hermes MCP server "${name}" uses unsupported transport "${transport}".`,
      "Configure an equivalent OpenClaw MCP transport manually.",
    );
  const auth = readString(raw.auth);
  if (auth && auth !== "oauth")
    add(
      "auth",
      `Hermes MCP server "${name}" uses unsupported authentication mode "${auth}".`,
      "Configure an equivalent OpenClaw MCP authentication mode manually.",
    );
  const oauth = isRecord(raw.oauth) ? raw.oauth : void 0;
  if (auth === "oauth" || oauth)
    add(
      "oauth-login",
      `Hermes MCP server "${name}" requires OAuth login in OpenClaw.`,
      `Run "openclaw mcp login ${name}" after migration.`,
    );
  if (
    oauth &&
    Object.keys(oauth).some(
      (keyName) =>
        !["authProfileId", "scope", "redirectUrl", "clientMetadataUrl"].includes(keyName),
    )
  )
    add(
      "oauth-client",
      `Hermes MCP server "${name}" uses pre-registered OAuth client settings that were not copied into OpenClaw config.`,
      `Run "openclaw mcp login ${name}" and configure supported OAuth metadata manually.`,
    );
  const tools = isRecord(raw.tools) ? raw.tools : void 0;
  if (
    tools &&
    (Object.keys(tools).some(
      (keyName) => !["include", "exclude", "resources", "prompts"].includes(keyName),
    ) ||
      (tools.include !== void 0 && !readToolFilterList(tools.include)) ||
      (tools.exclude !== void 0 && !readToolFilterList(tools.exclude)) ||
      (tools.resources !== void 0 && readBooleanish(tools.resources) === void 0) ||
      (tools.prompts !== void 0 && readBooleanish(tools.prompts) === void 0))
  )
    add(
      "tool-policy",
      `Hermes MCP server "${name}" has a tool policy that cannot be translated exactly.`,
      "Review and configure mcp.servers toolFilter manually.",
    );
  const lifecycle = isRecord(raw.lifecycle) ? raw.lifecycle : {};
  const unsupported = [
    ["preflight", raw.skip_preflight === true],
    ["sampling", isRecord(raw.sampling) && raw.sampling.enabled !== false],
    ["elicitation", isRecord(raw.elicitation) && raw.elicitation.enabled !== false],
    [
      "lifecycle",
      readPositiveNumeric(raw.idle_timeout_seconds ?? lifecycle.idle_timeout_seconds) !== void 0 ||
        readPositiveNumeric(raw.max_lifetime_seconds ?? lifecycle.max_lifetime_seconds) !== void 0,
    ],
    ["keepalive", readPositiveNumeric(raw.keepalive_interval) !== void 0],
  ];
  for (const [feature, configured] of unsupported)
    if (configured)
      add(
        feature,
        `Hermes MCP server "${name}" uses ${feature} behavior that OpenClaw MCP config does not expose.`,
        "Review the server requirement and configure an equivalent deployment or runtime policy manually.",
      );
  return [...new Map(items.map((item) => [item.id, item])).values()];
}
//#endregion
export { mapMcpServer as n, mcpManualItems as r, importsMcpSensitiveValues as t };
