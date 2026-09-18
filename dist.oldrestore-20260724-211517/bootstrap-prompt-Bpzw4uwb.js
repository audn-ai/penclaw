//#region src/agents/bootstrap-prompt.ts
/** Builds prompt lines for a full BOOTSTRAP.md workflow handoff. */
function buildFullBootstrapPromptLines(params) {
  return [
    params.readLine,
    "Can finish BOOTSTRAP.md here: do it.",
    "Cannot: brief blocker, safe possible steps, simplest next step.",
    "Never claim completion early. No generic greeting/normal reply before BOOTSTRAP.md handling.",
    params.firstReplyLine,
  ];
}
/** Builds prompt lines for a constrained BOOTSTRAP.md workflow handoff. */
function buildLimitedBootstrapPromptLines(params) {
  return [
    params.introLine,
    "Never claim complete; no generic first greeting.",
    "Brief limitation; only safe possible steps; simplest next step.",
    params.nextStepLine,
  ];
}
//#endregion
export { buildLimitedBootstrapPromptLines as n, buildFullBootstrapPromptLines as t };
