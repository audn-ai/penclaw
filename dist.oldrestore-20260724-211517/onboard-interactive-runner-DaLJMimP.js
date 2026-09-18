import { t as WizardCancelledError } from "./prompts-B0iOB1_a.js";
import { t as restoreTerminalState } from "./restore-BWpek1U9.js";
//#region src/commands/onboard-interactive-runner.ts
function hasInteractiveOnboardingTty() {
  return process.stdin.isTTY && process.stdout.isTTY;
}
async function runInteractiveOnboarding(action, runtime) {
  let exitCode = null;
  try {
    await action();
  } catch (error) {
    if (error instanceof WizardCancelledError) {
      exitCode = 1;
      return;
    }
    throw error;
  } finally {
    restoreTerminalState("setup finish", { resumeStdinIfPaused: false });
    if (exitCode !== null) runtime.exit(exitCode);
  }
}
//#endregion
export { runInteractiveOnboarding as n, hasInteractiveOnboardingTty as t };
