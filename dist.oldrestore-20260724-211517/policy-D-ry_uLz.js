import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { n as AcpRuntimeError } from "./errors-BTjUwYsc.js";
//#region src/acp/policy.ts
/** Policy gates for ACP availability, dispatch, and allowed agent ids. */
const ACP_DISABLED_MESSAGE = "ACP is disabled by policy (`acp.enabled=false`).";
const ACP_DISPATCH_DISABLED_MESSAGE =
  "ACP dispatch is disabled by policy (`acp.dispatch.enabled=false`).";
/** Returns whether ACP is globally enabled by config policy. */
function isAcpEnabledByPolicy(cfg) {
  return cfg.acp?.enabled !== false;
}
/** Resolves the effective dispatch policy state for inbound ACP routing. */
function resolveAcpDispatchPolicyState(cfg) {
  if (!isAcpEnabledByPolicy(cfg)) return "acp_disabled";
  if (cfg.acp?.dispatch?.enabled === false) return "dispatch_disabled";
  return "enabled";
}
/** Returns the operator-facing dispatch block message, if any. */
function resolveAcpDispatchPolicyMessage(cfg) {
  const state = resolveAcpDispatchPolicyState(cfg);
  if (state === "acp_disabled") return ACP_DISABLED_MESSAGE;
  if (state === "dispatch_disabled") return ACP_DISPATCH_DISABLED_MESSAGE;
  return null;
}
/** Returns the runtime error for dispatch-blocked ACP routing, if blocked. */
function resolveAcpDispatchPolicyError(cfg) {
  const message = resolveAcpDispatchPolicyMessage(cfg);
  if (!message) return null;
  return new AcpRuntimeError("ACP_DISPATCH_DISABLED", message);
}
/** Returns the runtime error for explicit ACP turns when ACP itself is disabled. */
function resolveAcpExplicitTurnPolicyError(cfg) {
  if (isAcpEnabledByPolicy(cfg)) return null;
  return new AcpRuntimeError("ACP_DISPATCH_DISABLED", ACP_DISABLED_MESSAGE);
}
/** Returns whether an agent id passes the optional ACP allowed-agent list. */
function isAcpAgentAllowedByPolicy(cfg, agentId) {
  const allowed = (cfg.acp?.allowedAgents ?? [])
    .map((entry) => normalizeAgentId(entry))
    .filter(Boolean);
  if (allowed.length === 0) return true;
  return allowed.includes(normalizeAgentId(agentId));
}
/** Returns the runtime error for agent-policy rejection, if rejected. */
function resolveAcpAgentPolicyError(cfg, agentId) {
  if (isAcpAgentAllowedByPolicy(cfg, agentId)) return null;
  return new AcpRuntimeError(
    "ACP_SESSION_INIT_FAILED",
    `ACP agent "${normalizeAgentId(agentId)}" is not allowed by policy.`,
  );
}
//#endregion
export {
  resolveAcpExplicitTurnPolicyError as a,
  resolveAcpDispatchPolicyMessage as i,
  resolveAcpAgentPolicyError as n,
  resolveAcpDispatchPolicyError as r,
  isAcpEnabledByPolicy as t,
};
