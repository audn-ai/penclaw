//#region src/security/dangerous-tools.ts
/**
 * Tools denied via Gateway HTTP `POST /tools/invoke` by default.
 * These are high-risk because they enable session orchestration, control-plane actions,
 * or interactive flows that don't make sense over a non-interactive HTTP surface.
 */
const DEFAULT_GATEWAY_HTTP_TOOL_DENY = [
  "exec",
  "spawn",
  "shell",
  "fs_write",
  "fs_delete",
  "fs_move",
  "apply_patch",
  "sessions_spawn",
  "sessions_send",
  "cron",
  "gateway",
  "nodes",
  "computer",
];
/**
 * Persistent control-plane tools that can change Gateway configuration or
 * create scheduled automation.
 */
const GATEWAY_CONTROL_PLANE_TOOLS = ["cron", "gateway"];
/**
 * Core tools that require sender owner identity on Gateway-scoped surfaces.
 * `gateway.tools.allow` can remove the default HTTP deny only for owner/trusted-operator
 * callers; non-owner identity-bearing callers must not receive server-credential wrappers.
 */
const GATEWAY_OWNER_ONLY_CORE_TOOLS = [...GATEWAY_CONTROL_PLANE_TOOLS, "nodes", "computer"];
//#endregion
export {
  GATEWAY_CONTROL_PLANE_TOOLS as n,
  GATEWAY_OWNER_ONLY_CORE_TOOLS as r,
  DEFAULT_GATEWAY_HTTP_TOOL_DENY as t,
};
