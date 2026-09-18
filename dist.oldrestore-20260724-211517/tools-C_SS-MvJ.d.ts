import { r as AnyAgentTool } from "./common-CuQ9SS3Z.js";
import { n as PluginRegistry } from "./registry-types-zrUDhE8t.js";
import { Hl as OpenClawPluginToolContext } from "./types-Ga3mNO_F.js";

//#region src/plugins/tools.d.ts
/** MCP bridge metadata attached to plugin tools surfaced through agent tool lists. */
type PluginToolMcpMeta = {
  serverName: string;
  safeServerName: string;
  toolName: string;
  operation: "tool" | "resources_list" | "resources_read" | "prompts_list" | "prompts_get";
};
/** Runtime metadata used to trace an agent tool back to its owning plugin registration. */
type PluginToolMeta = {
  pluginId: string;
  optional: boolean;
  replaySafe?: boolean;
  trustedLocalMedia?: boolean;
  mcp?: PluginToolMcpMeta;
};
/** Attaches plugin ownership metadata to a concrete agent tool instance. */
declare function setPluginToolMeta(tool: AnyAgentTool, meta: PluginToolMeta): void;
/** Reads plugin ownership metadata for a concrete agent tool instance. */
declare function getPluginToolMeta(tool: AnyAgentTool): PluginToolMeta | undefined;
/** Copies plugin ownership metadata when wrappers replace a tool object. */
declare function copyPluginToolMeta(source: AnyAgentTool, target: AnyAgentTool): void;
/**
 * Builds a collision-proof key for plugin-owned tool metadata lookups.
 */
declare function buildPluginToolMetadataKey(pluginId: string, toolName: string): string;
declare function ensureStandalonePluginToolRegistryLoaded(params: {
  context: OpenClawPluginToolContext;
  toolAllowlist?: string[];
  toolDenylist?: string[];
  allowGatewaySubagentBinding?: boolean;
  hasAuthForProvider?: (providerId: string) => boolean;
  env?: NodeJS.ProcessEnv;
}): PluginRegistry | undefined;
declare function resolvePluginTools(params: {
  context: OpenClawPluginToolContext;
  existingToolNames?: Set<string>;
  toolAllowlist?: string[];
  toolDenylist?: string[];
  suppressNameConflicts?: boolean;
  allowGatewaySubagentBinding?: boolean;
  hasAuthForProvider?: (providerId: string) => boolean;
  env?: NodeJS.ProcessEnv;
  runtimeRegistry?: PluginRegistry;
}): AnyAgentTool[];
//#endregion
export {
  getPluginToolMeta as a,
  ensureStandalonePluginToolRegistryLoaded as i,
  buildPluginToolMetadataKey as n,
  resolvePluginTools as o,
  copyPluginToolMeta as r,
  setPluginToolMeta as s,
  PluginToolMcpMeta as t,
};
