import { t as resolveApprovalRequestKind } from "./approval-types-CV5zXS-c.js";
import { t as resolveExecApprovalCommandDisplay } from "./exec-approval-command-display-SUzu7-Pq.js";
import { l as buildTypedApprovalActionDescriptors } from "./exec-approval-reply-Djiq6tOJ.js";
import { H as resolveExecApprovalRequestAllowedDecisions } from "./exec-approvals-Bz218bS2.js";
import { t as resolveCanonicalPluginApprovalRequestAllowedDecisions } from "./plugin-approval-canonical-decisions-B7vhht0w.js";
//#region src/infra/approval-view-model.ts
function buildExecMetadata(request) {
  const metadata = [];
  if (request.request.agentId)
    metadata.push({
      label: "Agent",
      value: request.request.agentId,
    });
  if (request.request.cwd)
    metadata.push({
      label: "CWD",
      value: request.request.cwd,
    });
  if (request.request.host)
    metadata.push({
      label: "Host",
      value: request.request.host,
    });
  if (Array.isArray(request.request.envKeys) && request.request.envKeys.length > 0)
    metadata.push({
      label: "Env Overrides",
      value: request.request.envKeys.join(", "),
    });
  return metadata;
}
function buildPluginMetadata(request) {
  const metadata = [];
  const severity = request.request.severity ?? "warning";
  metadata.push({
    label: "Severity",
    value: severity === "critical" ? "Critical" : severity === "info" ? "Info" : "Warning",
  });
  if (request.request.toolName)
    metadata.push({
      label: "Tool",
      value: request.request.toolName,
    });
  if (request.request.pluginId)
    metadata.push({
      label: "Plugin",
      value: request.request.pluginId,
    });
  if (request.request.agentId)
    metadata.push({
      label: "Agent",
      value: request.request.agentId,
    });
  return metadata;
}
function buildExecViewBase(request, phase) {
  const { commandText, commandPreview } = resolveExecApprovalCommandDisplay(request.request);
  return {
    approvalId: request.id,
    approvalKind: "exec",
    phase,
    title: phase === "pending" ? "Exec Approval Required" : "Exec Approval",
    description: phase === "pending" ? "A command needs your approval." : null,
    metadata: buildExecMetadata(request),
    ask: request.request.ask ?? null,
    agentId: request.request.agentId ?? null,
    warningText: request.request.warningText ?? null,
    commandAnalysis: request.request.commandAnalysis ?? null,
    commandText,
    commandPreview,
    cwd: request.request.cwd ?? null,
    envKeys: request.request.envKeys ?? void 0,
    host: request.request.host ?? null,
    nodeId: request.request.nodeId ?? null,
    sessionKey: request.request.sessionKey ?? null,
  };
}
function buildPluginViewBase(request, phase) {
  return {
    approvalId: request.id,
    approvalKind: "plugin",
    phase,
    title: request.request.title,
    description: request.request.description ?? null,
    metadata: buildPluginMetadata(request),
    agentId: request.request.agentId ?? null,
    pluginId: request.request.pluginId ?? null,
    toolName: request.request.toolName ?? null,
    severity: request.request.severity ?? "warning",
  };
}
/** Builds the presentation model for an unresolved exec or plugin approval. */
function buildPendingApprovalView(request) {
  const approvalKind = resolveApprovalRequestKind(request);
  if (approvalKind === "plugin") {
    const pluginRequest = request;
    return {
      ...buildPluginViewBase(pluginRequest, "pending"),
      actions: buildTypedApprovalActionDescriptors({
        approvalCommandId: pluginRequest.id,
        approvalKind,
        allowedDecisions: resolveCanonicalPluginApprovalRequestAllowedDecisions(
          pluginRequest.request,
        ),
      }),
      expiresAtMs: pluginRequest.expiresAtMs,
    };
  }
  const execRequest = request;
  return {
    ...buildExecViewBase(execRequest, "pending"),
    actions: buildTypedApprovalActionDescriptors({
      approvalCommandId: execRequest.id,
      approvalKind,
      ask: execRequest.request.ask,
      allowedDecisions: resolveExecApprovalRequestAllowedDecisions(execRequest.request),
    }),
    expiresAtMs: execRequest.expiresAtMs,
  };
}
/** Builds the presentation model for an approval after a decision was recorded. */
function buildResolvedApprovalView(request, resolved) {
  if (resolveApprovalRequestKind(request) === "plugin")
    return {
      ...buildPluginViewBase(request, "resolved"),
      decision: resolved.decision,
      resolvedBy: resolved.resolvedBy,
    };
  return {
    ...buildExecViewBase(request, "resolved"),
    decision: resolved.decision,
    resolvedBy: resolved.resolvedBy,
  };
}
/** Builds the presentation model shown when an approval can no longer be acted on. */
function buildExpiredApprovalView(request) {
  if (resolveApprovalRequestKind(request) === "plugin")
    return buildPluginViewBase(request, "expired");
  return buildExecViewBase(request, "expired");
}
//#endregion
export {
  buildPendingApprovalView as n,
  buildResolvedApprovalView as r,
  buildExpiredApprovalView as t,
};
