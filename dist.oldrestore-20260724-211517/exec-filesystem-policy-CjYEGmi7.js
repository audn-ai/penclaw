import { n as resolveConfiguredToolPolicies } from "./agent-tools.policy-BQgyHzcD.js";
import { i as resolveSandboxConfigForAgent } from "./config-l1rpbjvM.js";
import { t as isToolAllowedByPolicies } from "./tool-policy-match-Bq6mIgOa.js";
//#region src/security/exec-filesystem-policy.ts
const MUTATING_FS_TOOLS = ["write", "edit", "apply_patch"];
const RUNTIME_TOOLS = ["exec", "process"];
function resolveExecHost(params) {
  return params.agentExec?.host ?? params.globalExec?.host ?? "auto";
}
function isExecFilesystemConstrained(params) {
  if (params.sandboxMode !== "all") return false;
  if (params.execHost === "gateway" || params.execHost === "node") return false;
  return params.sandboxWorkspaceAccess !== "rw";
}
/** Find policy scopes where exec can still mutate files despite disabled fs tools. */
function collectExecFilesystemPolicyDriftHits(cfg) {
  const hits = [];
  const globalExec = cfg.tools?.exec;
  const contexts = [{ scopeLabel: "tools" }];
  for (const agent of cfg.agents?.list ?? []) {
    if (!agent || typeof agent !== "object" || typeof agent.id !== "string") continue;
    contexts.push({
      scopeLabel: `agents.list.${agent.id}.tools`,
      agentId: agent.id,
      tools: agent.tools,
    });
  }
  for (const context of contexts) {
    const sandbox = resolveSandboxConfigForAgent(cfg, context.agentId);
    const execHost = resolveExecHost({
      globalExec,
      agentExec: context.tools?.exec,
    });
    if (
      isExecFilesystemConstrained({
        sandboxMode: sandbox.mode,
        sandboxWorkspaceAccess: sandbox.workspaceAccess,
        execHost,
      })
    )
      continue;
    const policies = resolveConfiguredToolPolicies({
      cfg,
      agentTools: context.tools,
      sandboxMode: sandbox.mode,
      agentId: context.agentId,
    });
    const runtimeTools = RUNTIME_TOOLS.filter((tool) => isToolAllowedByPolicies(tool, policies));
    if (!runtimeTools.includes("exec")) continue;
    const disabledFilesystemTools = MUTATING_FS_TOOLS.filter(
      (tool) => !isToolAllowedByPolicies(tool, policies),
    );
    if (disabledFilesystemTools.length !== MUTATING_FS_TOOLS.length) continue;
    hits.push({
      scopeLabel: context.scopeLabel,
      runtimeTools,
      disabledFilesystemTools,
      sandboxMode: sandbox.mode,
      sandboxWorkspaceAccess: sandbox.workspaceAccess,
      execHost,
    });
  }
  return hits;
}
//#endregion
export { collectExecFilesystemPolicyDriftHits as t };
