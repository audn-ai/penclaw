import {
  At as boolean,
  Et as array,
  Ln as strictObject,
  Nn as record,
  Rn as string,
  Tn as object,
  wn as number,
  yt as _enum,
} from "./schemas-CBJjibl3.js";
//#region extensions/acpx/src/config-schema.ts
/**
 * ACPX plugin configuration schema and public config types. Runtime setup uses
 * this file as the single source of truth for validation and defaulting.
 */
const ACPX_PERMISSION_MODES = ["approve-all", "approve-reads", "deny-all"];
const ACPX_NON_INTERACTIVE_POLICIES = ["deny", "fail"];
const nonEmptyTrimmedString = (message) =>
  string({ error: message }).trim().min(1, { error: message });
const McpServerConfigSchema = object({
  command: nonEmptyTrimmedString("command must be a non-empty string").describe(
    "Command to run the MCP server",
  ),
  args: array(string({ error: "args must be an array of strings" }), {
    error: "args must be an array of strings",
  })
    .optional()
    .describe("Arguments to pass to the command"),
  env: record(string(), string({ error: "env values must be strings" }), {
    error: "env must be an object of strings",
  })
    .optional()
    .describe("Environment variables for the MCP server"),
});
/** Zod schema for validating raw ACPX plugin config from OpenClaw config. */
const AcpxPluginConfigSchema = strictObject({
  cwd: nonEmptyTrimmedString("cwd must be a non-empty string").optional(),
  stateDir: nonEmptyTrimmedString("stateDir must be a non-empty string").optional(),
  probeAgent: nonEmptyTrimmedString("probeAgent must be a non-empty string").optional(),
  permissionMode: _enum(ACPX_PERMISSION_MODES, {
    error: `permissionMode must be one of: ${ACPX_PERMISSION_MODES.join(", ")}`,
  }).optional(),
  nonInteractivePermissions: _enum(ACPX_NON_INTERACTIVE_POLICIES, {
    error: `nonInteractivePermissions must be one of: ${ACPX_NON_INTERACTIVE_POLICIES.join(", ")}`,
  }).optional(),
  pluginToolsMcpBridge: boolean({ error: "pluginToolsMcpBridge must be a boolean" }).optional(),
  openClawToolsMcpBridge: boolean({ error: "openClawToolsMcpBridge must be a boolean" }).optional(),
  strictWindowsCmdWrapper: boolean({
    error: "strictWindowsCmdWrapper must be a boolean",
  }).optional(),
  timeoutSeconds: number({ error: "timeoutSeconds must be a number >= 0.001" })
    .min(0.001, { error: "timeoutSeconds must be a number >= 0.001" })
    .default(120),
  queueOwnerTtlSeconds: number({ error: "queueOwnerTtlSeconds must be a number >= 0" })
    .min(0, { error: "queueOwnerTtlSeconds must be a number >= 0" })
    .optional(),
  piSessionCatalog: strictObject({
    enabled: boolean({ error: "piSessionCatalog.enabled must be a boolean" }).default(true),
  }).optional(),
  mcpServers: record(string(), McpServerConfigSchema).optional(),
  agents: record(
    string(),
    strictObject({
      command: nonEmptyTrimmedString("agents.<id>.command must be a non-empty string"),
      args: array(string({ error: "args must be an array of strings" })).optional(),
    }),
  ).optional(),
});
//#endregion
export { AcpxPluginConfigSchema as t };
