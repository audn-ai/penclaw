import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { u as withConsoleSubsystemsSuppressed } from "./console-CspqtrUy.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { n as t } from "./i18n-BDUMKn0X.js";
import { n as formatConfigIssueLines } from "./issue-format-IJKFr2SL.js";
import {
  n as runInteractiveOnboarding,
  t as hasInteractiveOnboardingTty,
} from "./onboard-interactive-runner-DaLJMimP.js";
import { t as WizardCancelledError } from "./prompts-B0iOB1_a.js";
import { i as requireRiskAcknowledgement } from "./setup.shared-p7f7ug1s.js";
import { h as shortenHomePath } from "./utils-DtcDeqWS.js";
//#region src/commands/onboard-guided.ts
async function openCrestodianChat(deps, workspace, runtime, acceptRisk) {
  await (
    deps.runCrestodianChat ??
    (async (setupWorkspace, chatRuntime, riskAccepted) => {
      const { runConversationalOnboarding } = await import("./onboard-interactive-CG-lJcKI.js");
      await runConversationalOnboarding(
        {
          workspace: setupWorkspace,
          ...(riskAccepted ? { acceptRisk: true } : {}),
        },
        chatRuntime,
      );
    })
  )(workspace, runtime, acceptRisk);
}
const SETUP_FAILURE_REASON_KEYS = {
  auth: "wizard.guided.failureAuth",
  rate_limit: "wizard.guided.failureRateLimit",
  billing: "wizard.guided.failureBilling",
  timeout: "wizard.guided.failureTimeout",
  format: "wizard.guided.failureFormat",
  unavailable: "wizard.guided.failureUnavailable",
  unknown: "wizard.guided.failureUnknown",
};
function setupFailureReason(status) {
  return t(SETUP_FAILURE_REASON_KEYS[status]);
}
async function noteActivationFailure(params) {
  await params.prompter.note(
    t("wizard.guided.testFailure", {
      label: params.label,
      reason: setupFailureReason(params.result.status),
      detail: params.result.error,
    }),
    t("wizard.guided.aiAccessTitle"),
  );
}
async function tryCandidate(params) {
  const progress = params.prompter.progress(
    t("wizard.guided.testingCandidate", {
      label: params.candidate.label,
      modelRef: params.candidate.modelRef,
    }),
  );
  const result = await withConsoleSubsystemsSuppressed(() =>
    params.activate({
      kind: params.candidate.kind,
      modelRef: params.candidate.modelRef,
      workspace: params.workspace,
      surface: "cli",
      runtime: params.runtime,
    }),
  );
  progress.stop(result.ok ? t("wizard.guided.testPassed") : t("wizard.guided.testFailed"));
  if (result.ok)
    return {
      kind: "success",
      result,
    };
  await noteActivationFailure({
    prompter: params.prompter,
    label: params.candidate.label,
    result,
  });
  return { kind: "failure" };
}
async function runManualStage(params) {
  const allowedChoices = /* @__PURE__ */ new Set([
    ...params.detection.manualProviders.map((provider) => provider.id),
    ...params.detection.authOptions.map((option) => option.id),
  ]);
  const detectedOptions = params.detection.candidates.map((candidate) => ({
    value: `candidate:${candidate.kind}`,
    label: t(
      params.autoAttemptedKinds.has(candidate.kind)
        ? "wizard.guided.retryCandidate"
        : "wizard.guided.tryCandidate",
      {
        label: candidate.label,
        detail: candidate.detail,
      },
    ),
  }));
  if (detectedOptions.length === 0 && allowedChoices.size === 0) {
    await params.prompter.note(
      t("wizard.guided.noInferenceOptions"),
      t("wizard.guided.aiAccessTitle"),
    );
    throw new WizardCancelledError("no inference setup options");
  }
  const additionalGroups = detectedOptions.length
    ? [
        {
          value: "detected-ai",
          label: t("wizard.guided.detectedTitle"),
          options: detectedOptions,
        },
      ]
    : [];
  const [{ ensureAuthProfileStore }, { promptAuthChoiceGrouped }] = await Promise.all([
    import("./agents/auth-profiles.runtime.js"),
    import("./auth-choice-prompt-gQGepsAL.js"),
  ]);
  const store = ensureAuthProfileStore(void 0, { allowKeychainPrompt: false });
  while (true) {
    const choice = await promptAuthChoiceGrouped({
      prompter: params.prompter,
      store,
      includeSkip: true,
      assistantVisibleOnly: false,
      allowedChoices,
      additionalGroups,
      config: params.config,
      workspaceDir: params.workspace,
    });
    if (choice === "skip") {
      await params.prompter.note(
        t("wizard.guided.nextStepsWithoutAi", { workspace: params.workspace }),
        t("wizard.guided.nextStepsTitle"),
      );
      return null;
    }
    if (choice.startsWith("candidate:")) {
      const kind = choice.slice(10);
      const candidate = params.detection.candidates.find((item) => item.kind === kind);
      if (!candidate) continue;
      const attempt = await tryCandidate({
        candidate,
        workspace: params.workspace,
        runtime: params.runtime,
        prompter: params.prompter,
        activate: params.activate,
      });
      if (attempt.kind === "success") return activationLines(attempt.result);
      continue;
    }
    const authOption = params.detection.authOptions.find((item) => item.id === choice);
    if (authOption) {
      const result = await withConsoleSubsystemsSuppressed(() =>
        params.activate({
          kind: "provider-auth",
          authChoice: authOption.id,
          workspace: params.workspace,
          surface: "cli",
          runtime: params.runtime,
          prompter: params.prompter,
        }),
      );
      if (result.ok) return activationLines(result);
      await noteActivationFailure({
        prompter: params.prompter,
        label: authOption.label,
        result,
      });
      continue;
    }
    const provider = params.detection.manualProviders.find((item) => item.id === choice);
    if (!provider) continue;
    const apiKey = await params.prompter.text({
      message: t("wizard.guided.apiKeyPrompt", { label: provider.label }),
      sensitive: true,
      validate: (value) => (value.trim() ? void 0 : t("common.required")),
    });
    const progress = params.prompter.progress(
      t("wizard.guided.testingManualProvider", { label: provider.label }),
    );
    const result = await withConsoleSubsystemsSuppressed(() =>
      params.activate({
        kind: "api-key",
        authChoice: provider.id,
        apiKey,
        workspace: params.workspace,
        surface: "cli",
        runtime: params.runtime,
      }),
    );
    progress.stop(result.ok ? t("wizard.guided.testPassed") : t("wizard.guided.testFailed"));
    if (result.ok) return activationLines(result);
    await noteActivationFailure({
      prompter: params.prompter,
      label: provider.label,
      result,
    });
  }
}
function activationLines(result) {
  return [
    ...result.lines,
    t("wizard.guided.repliedIn", { seconds: (result.latencyMs / 1e3).toFixed(1) }),
  ];
}
async function persistRiskAcknowledgement(config) {
  const securityAcknowledgedAt = config.wizard?.securityAcknowledgedAt;
  if (!securityAcknowledgedAt) return;
  const { mutateConfigFileWithRetry } = await import("./config/config.js");
  await mutateConfigFileWithRetry({
    mutate: (draft) => {
      if (draft.wizard?.securityAcknowledgedAt) return;
      draft.wizard = {
        ...draft.wizard,
        securityAcknowledgedAt,
      };
    },
  });
}
async function runGuidedOnboardingFlow(opts, runtime, deps) {
  const onboardHelpers = await import("./onboard-helpers-LaeM9LZm.js");
  const prompter = await (deps.createPrompter?.() ??
    import("./clack-prompter-D6U6Ry1K.js").then(({ createClackPrompter }) =>
      createClackPrompter(),
    ));
  await onboardHelpers.printWizardHeader(runtime);
  await prompter.intro(t("wizard.guided.intro"));
  await prompter.note(t("wizard.guided.escapeHatches"), t("wizard.guided.welcomeTitle"));
  const { readConfigFileSnapshot } = await import("./config/config.js");
  const snapshot = await readConfigFileSnapshot();
  if (snapshot.exists && !snapshot.valid) {
    const issues =
      snapshot.issues.length > 0
        ? formatConfigIssueLines(snapshot.issues, "-").join("\n")
        : t("wizard.guided.invalidConfigUnknown");
    await prompter.note(
      t("wizard.guided.invalidConfigDetails", {
        path: shortenHomePath(snapshot.path),
        issues,
      }),
      t("wizard.setup.invalidConfigTitle"),
    );
    await prompter.outro(
      t("wizard.guided.invalidConfigRepair", {
        fixCommand: formatCliCommand("openclaw doctor --fix"),
        inspectCommand: formatCliCommand("openclaw config validate"),
      }),
    );
    runtime.exit(1);
    return null;
  }
  const existingConfig =
    snapshot.exists && snapshot.valid ? (snapshot.sourceConfig ?? snapshot.config) : {};
  const acknowledgedConfig = await requireRiskAcknowledgement({
    opts,
    prompter,
    config: existingConfig,
  });
  if (!existingConfig.wizard?.securityAcknowledgedAt)
    await (deps.persistRiskAcknowledgement ?? persistRiskAcknowledgement)(acknowledgedConfig);
  const workspace = resolveUserPath(
    opts.workspace?.trim() ||
      acknowledgedConfig.agents?.defaults?.workspace?.trim() ||
      onboardHelpers.DEFAULT_WORKSPACE,
  );
  const detect =
    deps.detect ?? (await import("./crestodian/setup-inference.js")).detectSetupInference;
  const detectionProgress = prompter.progress(t("wizard.guided.detecting"));
  const detection = await detect();
  detectionProgress.stop(t("wizard.guided.detected"));
  if (detection.candidates.length === 0)
    await prompter.note(t("wizard.guided.foundNothing"), t("wizard.guided.detectedTitle"));
  else {
    const candidates = detection.candidates.map((candidate) =>
      t("wizard.guided.detectedCandidate", {
        label: candidate.label,
        detail: candidate.detail,
      }),
    );
    await prompter.note(candidates.join("\n"), t("wizard.guided.detectedTitle"));
  }
  const activate =
    deps.activate ?? (await import("./crestodian/setup-inference.js")).activateSetupInference;
  const autoAttemptedKinds = /* @__PURE__ */ new Set();
  let resultLines;
  for (const candidate of detection.candidates.filter((item) => item.credentials !== false)) {
    autoAttemptedKinds.add(candidate.kind);
    const attempt = await tryCandidate({
      candidate,
      workspace,
      runtime,
      prompter,
      activate,
    });
    if (attempt.kind === "success") {
      resultLines = activationLines(attempt.result);
      break;
    }
    if (candidate.kind === "existing-model") {
      await prompter.note(t("wizard.guided.existingModelKept"), t("wizard.guided.aiAccessTitle"));
      break;
    }
  }
  if (!resultLines) {
    const manualResult = await runManualStage({
      detection,
      autoAttemptedKinds,
      config: existingConfig,
      workspace,
      runtime,
      prompter,
      activate,
    });
    if (!manualResult) return null;
    resultLines = manualResult;
  }
  await prompter.note(resultLines.join("\n"), t("wizard.guided.appliedTitle"));
  return { workspace };
}
async function runGuidedOnboarding(opts, runtime, deps = {}) {
  if (!hasInteractiveOnboardingTty()) {
    runtime.error(t("wizard.guided.ttyRequired"));
    runtime.exit(1);
    return;
  }
  const state = { handoff: null };
  await runInteractiveOnboarding(async () => {
    state.handoff = await runGuidedOnboardingFlow(opts, runtime, deps);
  }, runtime);
  const handoff = state.handoff;
  if (handoff) await openCrestodianChat(deps, handoff.workspace, runtime, true);
}
//#endregion
export { runGuidedOnboarding as t };
