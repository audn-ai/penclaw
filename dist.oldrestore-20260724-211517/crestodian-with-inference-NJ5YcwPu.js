import { u as withConsoleSubsystemsSuppressed } from "./console-CspqtrUy.js";
import { n as requestExitAfterOneShotOutput } from "./one-shot-exit-DdMGi0bf.js";
import { i as writeRuntimeJson, r as defaultRuntime } from "./runtime-Bz6o617W.js";
//#region src/commands/crestodian-with-inference.ts
function hasInteractiveTty(opts) {
  const input = opts.input ?? process.stdin;
  const output = opts.output ?? process.stdout;
  return input.isTTY === true && output.isTTY === true;
}
function isOneShotRequest(opts) {
  return Boolean(opts.json || opts.message?.trim() || opts.interactive === false);
}
function formatOneShotExecutionError(error) {
  return error instanceof Error ? error.message : String(error);
}
function failOneShotExecution(opts, runtime, error) {
  const message = formatOneShotExecutionError(error);
  if (opts.json)
    writeRuntimeJson(runtime, {
      ok: false,
      error: message,
    });
  else runtime.error(message);
  if (!requestExitAfterOneShotOutput(runtime, 1)) runtime.exit(1);
}
/**
 * Start Crestodian only after the configured default model completes a real
 * turn. Interactive failures return to inference onboarding; automation fails
 * closed with a stable command operators can run to repair the prerequisite.
 */
async function runCrestodianWithInference(
  opts = {},
  runtime = defaultRuntime,
  onboardingOptions = {},
  deps = {},
) {
  if (opts.yes && !opts.message?.trim()) {
    failOneShotExecution(
      opts,
      runtime,
      /* @__PURE__ */ new Error(
        "Crestodian --yes requires --message so approval is limited to one request.",
      ),
    );
    return;
  }
  const oneShot = isOneShotRequest(opts);
  if (!oneShot && !hasInteractiveTty(opts)) {
    runtime.error("Crestodian needs an interactive TTY. Use --message for one command.");
    runtime.exit(1);
    return;
  }
  let inference;
  try {
    const verifyInference =
      deps.verifyInference ??
      (await import("./crestodian/setup-inference.js")).verifySetupInference;
    inference = await withConsoleSubsystemsSuppressed(() =>
      verifyInference({
        runtime,
        bindSession: true,
      }),
    );
  } catch (error) {
    if (!oneShot) throw error;
    failOneShotExecution(opts, runtime, error);
    return;
  }
  if (inference.ok) {
    const runCrestodian =
      deps.runCrestodian ?? (await import("./crestodian/crestodian.js")).runCrestodian;
    try {
      await runCrestodian(
        {
          ...opts,
          verifiedInference: inference.binding,
        },
        runtime,
      );
    } catch (error) {
      if (!oneShot) throw error;
      failOneShotExecution(opts, runtime, error);
      return;
    }
    if (oneShot) requestExitAfterOneShotOutput(runtime);
    return;
  }
  if (oneShot) {
    const guidance = "Run `openclaw onboard` to connect and live-test AI first.";
    if (opts.json)
      writeRuntimeJson(runtime, {
        ok: false,
        status: inference.status,
        error: `Crestodian requires working inference: ${inference.error}`,
        guidance,
      });
    else
      runtime.error(
        [`Crestodian requires working inference: ${inference.error}`, guidance].join("\n"),
      );
    if (!requestExitAfterOneShotOutput(runtime, 1)) runtime.exit(1);
    return;
  }
  runtime.log("Crestodian requires working inference. Starting guided AI setup…");
  await (
    deps.runGuidedOnboarding ?? (await import("./onboard-guided-CDtimzmP.js")).runGuidedOnboarding
  )(onboardingOptions, runtime);
}
//#endregion
export { runCrestodianWithInference as t };
