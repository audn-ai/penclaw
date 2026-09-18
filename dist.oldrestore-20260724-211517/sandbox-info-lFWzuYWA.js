import { t as resolveExecDefaults } from "./exec-defaults-CZ1jkNDD.js";
//#region src/agents/embedded-agent-runner/sandbox-info.ts
function execPolicyBlocksFullAccess(params) {
  return (
    (params.execPolicy?.mode !== void 0 && params.execPolicy.mode !== "full") ||
    (params.execPolicy?.security !== void 0 && params.execPolicy.security !== "full") ||
    (params.execPolicy?.ask !== void 0 && params.execPolicy.ask === "always") ||
    (params.hostPolicy?.security !== void 0 && params.hostPolicy.security !== "full") ||
    (params.hostPolicy?.ask !== void 0 && params.hostPolicy.ask === "always")
  );
}
/** Computes whether elevated exec can provide full host access for an embedded turn. */
function resolveEmbeddedFullAccessState(params) {
  if (execPolicyBlocksFullAccess(params))
    return {
      available: false,
      blockedReason: "host-policy",
    };
  if (params.execElevated?.fullAccessAvailable === true) return { available: true };
  if (params.execElevated?.fullAccessAvailable === false)
    return {
      available: false,
      blockedReason: params.execElevated.fullAccessBlockedReason ?? "host-policy",
    };
  if (!params.execElevated?.enabled || !params.execElevated.allowed)
    return {
      available: false,
      blockedReason: "host-policy",
    };
  return { available: true };
}
/** Resolves the effective exec policy for sandbox-info reporting. */
function resolveEmbeddedSandboxInfoExecPolicy(params) {
  const defaults = resolveExecDefaults({
    cfg: params.config,
    agentId: params.agentId,
    sessionKey: params.sessionKey,
    sandboxAvailable: params.sandboxAvailable,
    elevatedRequested: true,
    execOverrides: params.execOverrides,
  });
  return {
    mode: defaults.mode,
    security: defaults.security,
    ask: defaults.ask,
  };
}
/** Builds the serializable sandbox metadata attached to embedded agent run results. */
function buildEmbeddedSandboxInfo(sandbox, execElevated, execPolicy, hostPolicy) {
  if (!sandbox?.enabled) return;
  const elevatedConfigured = execElevated?.enabled === true;
  const elevatedAllowed = Boolean(execElevated?.enabled && execElevated.allowed);
  const fullAccess = resolveEmbeddedFullAccessState({
    execElevated,
    execPolicy,
    hostPolicy,
  });
  return {
    enabled: true,
    workspaceDir: sandbox.workspaceDir,
    containerWorkspaceDir: sandbox.containerWorkdir,
    workspaceAccess: sandbox.workspaceAccess,
    agentWorkspaceMount: sandbox.workspaceAccess === "ro" ? "/agent" : void 0,
    browserBridgeUrl: sandbox.browser?.bridgeUrl,
    hostBrowserAllowed: sandbox.browserAllowHostControl,
    ...(elevatedConfigured
      ? {
          elevated: {
            allowed: elevatedAllowed,
            defaultLevel: execElevated?.defaultLevel ?? "off",
            fullAccessAvailable: fullAccess.available,
            ...(fullAccess.blockedReason
              ? { fullAccessBlockedReason: fullAccess.blockedReason }
              : {}),
          },
        }
      : {}),
  };
}
//#endregion
export {
  resolveEmbeddedFullAccessState as n,
  resolveEmbeddedSandboxInfoExecPolicy as r,
  buildEmbeddedSandboxInfo as t,
};
