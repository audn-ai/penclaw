import { r as resolveAgentConfig } from "./agent-scope-config-DVIR1nBa.js";
import { v as resolveSessionAgentId } from "./agent-scope-y9xQv_q1.js";
import {
  m as resolveExecTarget,
  u as isRequestedExecTargetAllowed,
} from "./bash-tools.exec-runtime-BiZhPykN.js";
import {
  K as resolveExecApprovalsFromFile,
  O as normalizeExecSecurity,
  Q as resolveExecModePolicy,
  S as minSecurity,
  T as normalizeExecAsk,
  Z as resolveExecModeFromPolicy,
  b as maxAsk,
  k as normalizeExecTarget,
  v as loadExecApprovals,
} from "./exec-approvals-Bz218bS2.js";
import { t as applyExecPolicyLayer } from "./exec-policy-DDAbB8Ct.js";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-DT_QCQQG.js";
//#region src/agents/exec-defaults.ts
function applySessionLegacyExecPolicyLayer(base, sessionEntry) {
  const security = normalizeExecSecurity(sessionEntry?.execSecurity);
  const ask = normalizeExecAsk(sessionEntry?.execAsk);
  if (security !== null || ask !== null)
    return {
      security: security ?? base.security,
      ask: ask ?? base.ask,
    };
  return base;
}
function resolveExecConfigState(params) {
  const cfg = params.cfg ?? {};
  const resolvedAgentId =
    params.agentId ??
    resolveSessionAgentId({
      sessionKey: params.sessionKey,
      config: cfg,
    });
  const globalExec = cfg.tools?.exec;
  const agentExec = resolvedAgentId
    ? resolveAgentConfig(cfg, resolvedAgentId)?.tools?.exec
    : void 0;
  return {
    cfg,
    host:
      params.execOverrides?.host ??
      normalizeExecTarget(params.sessionEntry?.execHost) ??
      agentExec?.host ??
      globalExec?.host ??
      "auto",
    agentId: resolvedAgentId,
    agentExec,
    globalExec,
  };
}
/** Resolves whether node exec is usable and any effective node binding. */
function resolveNodeExecEligibility(params) {
  const defaults = resolveExecDefaults(params);
  const systemRunDenied = params.cfg?.gateway?.nodes?.denyCommands?.some(
    (command) => command.trim() === "system.run",
  );
  return {
    canExec: defaults.canRequestNode && defaults.security !== "deny" && !systemRunDenied,
    ...(defaults.node ? { node: defaults.node } : {}),
  };
}
/** Resolves effective exec host, mode, approval policy, and node availability. */
function resolveExecDefaults(params) {
  const {
    cfg,
    host,
    agentId: resolvedAgentId,
    agentExec,
    globalExec,
  } = resolveExecConfigState(params);
  const sandboxAvailable =
    params.sandboxAvailable ??
    (params.sessionKey
      ? resolveSandboxRuntimeStatus({
          cfg,
          sessionKey: params.sessionKey,
        }).sandboxed
      : false);
  const resolved = resolveExecTarget({
    configuredTarget: host,
    elevatedRequested: params.elevatedRequested === true,
    sandboxAvailable,
  });
  const defaultSecurity = resolved.effectiveHost === "sandbox" ? "deny" : "full";
  const approvalDefaults =
    resolved.effectiveHost === "sandbox"
      ? void 0
      : resolveExecApprovalsFromFile({
          file: loadExecApprovals(),
          agentId: resolvedAgentId,
          overrides: {
            security: defaultSecurity,
            ask: "off",
          },
        }).agent;
  const modePolicy = resolveExecModePolicy(
    applyExecPolicyLayer(
      applySessionLegacyExecPolicyLayer(
        applyExecPolicyLayer(
          applyExecPolicyLayer(
            {
              security: approvalDefaults?.security ?? defaultSecurity,
              ask: approvalDefaults?.ask ?? "off",
            },
            globalExec,
          ),
          agentExec,
        ),
        params.sessionEntry,
      ),
      params.execOverrides,
    ),
  );
  const security =
    approvalDefaults?.security !== void 0
      ? minSecurity(modePolicy.security, approvalDefaults.security)
      : modePolicy.security;
  const ask =
    approvalDefaults?.ask !== void 0
      ? maxAsk(modePolicy.ask, approvalDefaults.ask)
      : modePolicy.ask;
  const mode =
    security === modePolicy.security && ask === modePolicy.ask
      ? modePolicy.mode
      : resolveExecModeFromPolicy({
          security,
          ask,
        });
  return {
    host,
    effectiveHost: resolved.effectiveHost,
    mode,
    security,
    ask,
    node:
      params.execOverrides?.node ??
      params.sessionEntry?.execNode ??
      agentExec?.node ??
      globalExec?.node,
    canRequestNode: isRequestedExecTargetAllowed({
      configuredTarget: host,
      requestedTarget: "node",
      sandboxAvailable,
    }),
  };
}
//#endregion
export { resolveNodeExecEligibility as n, resolveExecDefaults as t };
