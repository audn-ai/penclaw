import { i as canUseCodexModelBackedApprovalsReviewerForModel } from "./config-C1imjxk6.js";
//#region extensions/codex/src/app-server/app-server-policy.ts
/**
 * Policy promotion for Codex app-server runs that can safely use OpenClaw tool
 * approvals.
 */
/**
 * Promotes implicit `never` approval policy to `untrusted` only when runtime
 * requirements allow OpenClaw to handle tool approvals.
 */
function resolveCodexAppServerForOpenClawToolPolicy(params) {
  if (
    !params.shouldPromote ||
    !params.canUseUntrustedApprovalPolicy ||
    params.appServer.approvalPolicy !== "never"
  )
    return params.appServer;
  const explicitMode =
    params.execPolicy?.mode === "full" ||
    params.pluginConfig.appServer?.mode !== void 0 ||
    isCodexAppServerPolicyMode(params.env.OPENCLAW_CODEX_APP_SERVER_MODE);
  const explicitApprovalPolicy =
    params.pluginConfig.appServer?.approvalPolicy !== void 0 ||
    isConfiguredCodexAppServerApprovalPolicy(
      params.env.OPENCLAW_CODEX_APP_SERVER_APPROVAL_POLICY,
    ) ||
    params.appServer.approvalPolicySource === "requirements";
  if (explicitMode || explicitApprovalPolicy) return params.appServer;
  return {
    ...params.appServer,
    approvalPolicy: "untrusted",
  };
}
function resolveCodexAppServerForModelProvider(params) {
  const explicitProvider = normalizeModelBackedReviewerProvider(params.provider);
  if (
    !isCodexModelBackedApprovalsReviewer(params.appServer.approvalsReviewer) ||
    canUseCodexModelBackedApprovalsReviewerForModel({
      modelProvider: explicitProvider,
      model: params.model,
      config: params.config,
      env: params.env,
      agentDir: params.agentDir,
      codexConfigToml: params.codexConfigToml,
    })
  )
    return params.appServer;
  return {
    ...params.appServer,
    approvalsReviewer: "user",
  };
}
function isCodexAppServerPolicyMode(value) {
  return value === "guardian" || value === "yolo";
}
function isConfiguredCodexAppServerApprovalPolicy(value) {
  return (
    value === "never" || value === "on-request" || value === "on-failure" || value === "untrusted"
  );
}
function isCodexModelBackedApprovalsReviewer(value) {
  return value === "auto_review" || value === "guardian_subagent";
}
function normalizeModelBackedReviewerProvider(provider) {
  return provider?.trim().toLowerCase() || void 0;
}
//#endregion
export {
  resolveCodexAppServerForOpenClawToolPolicy as n,
  resolveCodexAppServerForModelProvider as t,
};
