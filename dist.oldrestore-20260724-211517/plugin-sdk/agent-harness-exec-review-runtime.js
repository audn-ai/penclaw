//#region src/plugin-sdk/agent-harness-exec-review-runtime.ts
async function reviewExecRequestWithConfiguredModel(params) {
  const { createModelExecAutoReviewer } = await import("../exec-auto-reviewer-C6Y5hmVm.js");
  return createModelExecAutoReviewer({
    cfg: params.cfg,
    agentId: params.agentId,
    reviewer: params.reviewer,
  })(params.input);
}
async function buildExecAutoReviewInputForShellCommand(params) {
  const [
    { commandRequiresSecurityAuditSuppressionApproval, evaluateShellAllowlistWithAuthorization },
    { detectUnsafeExecControlShellCommand },
    { detectPolicyInlineEval },
  ] = await Promise.all([
    import("../exec-approvals-CBvT7bbG.js"),
    import("../exec-control-command-guard-CYS_tfE2.js"),
    import("../policy-Bx4OOzyQ.js"),
  ]);
  const command = params.command.trim();
  const host = params.host;
  if (!command) return;
  const allowlistEval = await evaluateShellAllowlistWithAuthorization({
    command,
    allowlist: [],
    safeBins: /* @__PURE__ */ new Set(),
    cwd: params.cwd ?? void 0,
    platform: process.platform,
  });
  const [segment] = allowlistEval.segments;
  if (
    !(
      allowlistEval.analysisOk &&
      allowlistEval.segments.length === 1 &&
      segment !== void 0 &&
      segment.raw.trim() === command
    )
  )
    return;
  if (
    commandRequiresSecurityAuditSuppressionApproval({
      command,
      cwd: params.cwd ?? void 0,
      segments: allowlistEval.segments,
    })
  )
    return;
  if ((await detectUnsafeExecControlShellCommand(command)) !== null) return;
  const inlineEval = detectPolicyInlineEval(allowlistEval.segments) !== null;
  const heredoc = segment.argv.some((token) => token.startsWith("<<"));
  return {
    command,
    argv: segment.argv,
    cwd: params.cwd ?? null,
    envKeys: params.envKeys,
    host,
    reason: inlineEval ? "strict-inline-eval" : heredoc ? "heredoc" : "approval-required",
    analysis: {
      parsed: true,
      allowlistMatched: false,
      inlineEval,
      ...(heredoc ? { heredoc } : {}),
    },
    agent: params.agent,
  };
}
//#endregion
export { buildExecAutoReviewInputForShellCommand, reviewExecRequestWithConfiguredModel };
