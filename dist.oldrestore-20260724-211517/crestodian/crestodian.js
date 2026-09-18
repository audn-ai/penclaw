import { stdin, stdout } from "node:process";
import { n as resolveCrestodianOperation } from "../dialogue-CC1CwNBC.js";
import { t as CrestodianInferenceUnavailableError } from "../inference-error-FHRbX8O-.js";
import {
  a as parseCrestodianOperation,
  i as isPersistentCrestodianOperation,
  n as executeCrestodianOperation,
} from "../operations-Cj3q63k5.js";
import {
  i as loadCrestodianOverview,
  n as formatCrestodianOverview,
} from "../overview-DfQOIIFh.js";
import { r as withProgress } from "../progress-DXZjrYcT.js";
import { i as writeRuntimeJson, r as defaultRuntime } from "../runtime-Bz6o617W.js";
import { a as resolveCrestodianVerifiedInferenceRoute } from "../verified-inference-CEqscfYA.js";
//#region src/crestodian/crestodian.ts
function crestodianCommandDepsFromOptions(opts) {
  if (!opts.deps && !opts.formatOverview && !opts.loadOverview) return;
  return {
    ...opts.deps,
    ...(opts.formatOverview ? { formatOverview: opts.formatOverview } : {}),
    ...(opts.loadOverview ? { loadOverview: opts.loadOverview } : {}),
  };
}
async function requireVerifiedInference(opts) {
  if (!opts.verifiedInference) throw new CrestodianInferenceUnavailableError("conversation");
  try {
    if (await resolveCrestodianVerifiedInferenceRoute(opts.verifiedInference, opts.deps)) return;
  } catch (error) {
    throw new CrestodianInferenceUnavailableError("conversation", [error]);
  }
  throw new CrestodianInferenceUnavailableError("conversation");
}
async function requirePersistentApplyInference(opts, runtime) {
  if (!opts.verifiedInference) throw new CrestodianInferenceUnavailableError("conversation");
  try {
    const { resolveCrestodianInferenceForPersistentApply } = await import("./setup-inference.js");
    if (
      await resolveCrestodianInferenceForPersistentApply({
        binding: opts.verifiedInference,
        runtime,
        deps: opts.deps,
      })
    )
      return;
  } catch (error) {
    if (error instanceof CrestodianInferenceUnavailableError) throw error;
    throw new CrestodianInferenceUnavailableError("conversation", [error]);
  }
  throw new CrestodianInferenceUnavailableError("conversation");
}
async function runOneShot(operation, runtime, opts) {
  if (operation.kind === "none" && operation.message === "") return;
  await requireVerifiedInference(opts);
  await executeCrestodianOperation(operation, runtime, {
    approved: opts.yes === true || !isPersistentCrestodianOperation(operation),
    deps: crestodianCommandDepsFromOptions(opts),
    beforePersistentApply: async () => {
      await requirePersistentApplyInference(opts, runtime);
    },
  });
}
/** Run Crestodian in JSON, one-shot message, or interactive TUI mode. */
async function runCrestodian(opts, runtime = defaultRuntime) {
  const binding = opts?.verifiedInference;
  if (!binding) throw new CrestodianInferenceUnavailableError("conversation");
  const boundOpts = {
    ...opts,
    verifiedInference: binding,
  };
  await requireVerifiedInference(boundOpts);
  if (boundOpts.json) {
    writeRuntimeJson(runtime, await (boundOpts.loadOverview ?? loadCrestodianOverview)());
    return;
  }
  if (boundOpts.message?.trim()) {
    const parsed = parseCrestodianOperation(boundOpts.message);
    if (parsed.kind === "overview") {
      await runOneShot(parsed, runtime, boundOpts);
      return;
    }
    const overview = await withProgress(
      {
        label: "Loading Crestodian overview…",
        indeterminate: true,
        delayMs: 0,
        fallback: "none",
      },
      async () => await (boundOpts.loadOverview ?? loadCrestodianOverview)(),
    );
    runtime.log((boundOpts.formatOverview ?? formatCrestodianOverview)(overview));
    runtime.log("");
    await runOneShot(
      await resolveCrestodianOperation(boundOpts.message, runtime, {
        ...boundOpts,
        loadOverview: async () => overview,
      }),
      runtime,
      boundOpts,
    );
    return;
  }
  if (boundOpts.interactive === false) {
    const overview = await (boundOpts.loadOverview ?? loadCrestodianOverview)();
    runtime.log((boundOpts.formatOverview ?? formatCrestodianOverview)(overview));
    return;
  }
  const input = boundOpts.input ?? stdin;
  const output = boundOpts.output ?? stdout;
  const inputIsTty = input.isTTY === true;
  const outputIsTty = output.isTTY === true;
  if (!inputIsTty || !outputIsTty) {
    runtime.error("Crestodian needs an interactive TTY. Use --message for one command.");
    runtime.exit(1);
    return;
  }
  const runInteractiveTui =
    boundOpts.runInteractiveTui ?? (await import("../tui-backend-DjDbPq7D.js")).runCrestodianTui;
  boundOpts.onReady?.();
  await runInteractiveTui(boundOpts, runtime);
}
//#endregion
export { runCrestodian };
