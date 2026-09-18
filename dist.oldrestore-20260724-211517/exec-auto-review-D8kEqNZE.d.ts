//#region src/infra/exec-auto-review.d.ts
/** Risk level returned by exec auto-reviewers for approval routing decisions. */
type ExecAutoReviewRisk = "unknown" | "low" | "medium" | "high";
/** Auto-review outcome: either approve once or send the command to normal approval. */
type ExecAutoReviewDecision =
  | {
      decision: "allow-once";
      rationale: string;
      risk: "low";
    }
  | {
      decision: "ask";
      rationale: string;
      risk: ExecAutoReviewRisk;
    };
/** Execution host whose command policy context is being reviewed. */
type ExecAutoReviewHost = "gateway" | "node" | "codex-app-server";
/** Command and policy facts supplied to an exec auto-reviewer. */
type ExecAutoReviewInput = {
  command: string;
  argv?: readonly string[];
  resolvedPath?: string | null;
  cwd?: string | null;
  envKeys?: readonly string[];
  host: ExecAutoReviewHost;
  reason:
    | "approval-required"
    | "allowlist-miss"
    | "strict-inline-eval"
    | "heredoc"
    | "execution-plan-miss";
  analysis: {
    parsed: boolean;
    allowlistMatched: boolean;
    safeBinMatched?: boolean;
    durableApprovalMatched?: boolean;
    inlineEval: boolean;
    heredoc?: boolean;
    shellWrapper?: boolean;
  };
  agent?: {
    id?: string | null;
    sessionKey?: string | null;
  };
};
/** Reviewer function used by gateway/node exec paths before human approval fallback. */
type ExecAutoReviewer = (
  input: ExecAutoReviewInput,
) => Promise<ExecAutoReviewDecision> | ExecAutoReviewDecision;
//#endregion
export {
  ExecAutoReviewer as i,
  ExecAutoReviewHost as n,
  ExecAutoReviewInput as r,
  ExecAutoReviewDecision as t,
};
