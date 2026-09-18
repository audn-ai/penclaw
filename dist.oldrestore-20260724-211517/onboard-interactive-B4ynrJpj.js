import { t as createClackPrompter } from "./clack-prompter-Cu4E8Cn1.js";
import {
  n as runInteractiveOnboarding,
  t as hasInteractiveOnboardingTty,
} from "./onboard-interactive-runner-DaLJMimP.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { t as runSetupWizard } from "./setup-B0nMsB1p.js";
//#region src/commands/onboard-interactive.ts
/** Runs the interactive setup wizard and maps user cancellation to exit code 1. */
async function runInteractiveSetup(opts, runtime = defaultRuntime) {
  const prompter = createClackPrompter();
  await runInteractiveOnboarding(
    async () => await runSetupWizard(opts, runtime, prompter),
    runtime,
  );
}
/**
 * Opens the Crestodian onboarding conversation used by the guided escape hatch.
 * The first-run greeting proposes a setup plan and keeps subsequent setup and
 * agent handoff in the same conversation.
 */
async function runConversationalOnboarding(opts, runtime = defaultRuntime) {
  if (!hasInteractiveOnboardingTty()) {
    runtime.error(
      "Onboarding needs an interactive TTY. Use `openclaw onboard --non-interactive --accept-risk ...` for automation.",
    );
    runtime.exit(1);
    return;
  }
  const { verifySetupInference } = await import("./crestodian/setup-inference.js");
  const inference = await verifySetupInference({
    runtime,
    bindSession: true,
  });
  if (!inference.ok) {
    runtime.error(`Crestodian requires working inference: ${inference.error}`);
    runtime.exit(1);
    return;
  }
  const { runCrestodian } = await import("./crestodian/crestodian.js");
  await runCrestodian(
    {
      welcomeVariant: "onboarding",
      ...(opts.workspace ? { setupWorkspace: opts.workspace } : {}),
      verifiedInference: inference.binding,
    },
    runtime,
  );
}
//#endregion
export { runInteractiveSetup as n, runConversationalOnboarding as t };
