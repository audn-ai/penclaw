import { r as analyzeArgvCommand } from "./exec-approvals-analysis-C-pXO6pp.js";
import { o as detectInlineEvalInSegments } from "./risks-Bhlho1S0.js";
//#region src/infra/command-analysis/policy.ts
/** Parses a shell or argv command into command segments for approval policy checks. */
function analyzeCommandForPolicy(params) {
  const analysis = analyzeArgvCommand({
    argv: params.argv,
    cwd: params.cwd,
    env: params.env,
  });
  if (!analysis.ok)
    return {
      ok: false,
      source: params.source,
      reason: analysis.reason,
      analysis,
      segments: [],
    };
  return {
    ok: true,
    source: params.source,
    analysis,
    segments: analysis.segments,
  };
}
function detectPolicyInlineEval(segments) {
  return detectInlineEvalInSegments(segments);
}
//#endregion
export { detectPolicyInlineEval as n, analyzeCommandForPolicy as t };
