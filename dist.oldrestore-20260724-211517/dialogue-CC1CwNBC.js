import { t as CrestodianInferenceUnavailableError } from "./inference-error-FHRbX8O-.js";
import {
  a as parseCrestodianOperation,
  t as describeCrestodianPersistentOperation,
} from "./operations-Cj3q63k5.js";
import { i as loadCrestodianOverview } from "./overview-DfQOIIFh.js";
import { a as resolveCrestodianVerifiedInferenceRoute } from "./verified-inference-CEqscfYA.js";
//#region src/crestodian/dialogue.ts
/** Format the interactive approval prompt for a persistent operation. */
function approvalQuestion(operation) {
  return `Apply this operation: ${describeCrestodianPersistentOperation(operation)}?`;
}
/** Resolve user input to a Crestodian operation, optionally using the assistant planner. */
async function resolveCrestodianOperation(input, runtime, opts) {
  if (!opts.verifiedInference) throw new CrestodianInferenceUnavailableError("conversation");
  const operation = parseCrestodianOperation(input);
  if (!shouldAskAssistant(input, operation)) return operation;
  const overview = await (opts.loadOverview ?? loadCrestodianOverview)();
  const planner =
    opts.planWithAssistant ?? (await import("./assistant-DZmXGziy.js")).planCrestodianCommand;
  let plan;
  try {
    plan = await planner({
      input,
      overview,
      verifiedInference: opts.verifiedInference,
    });
    if (plan && !(await resolveCrestodianVerifiedInferenceRoute(opts.verifiedInference, opts.deps)))
      throw new CrestodianInferenceUnavailableError("planner");
  } catch (error) {
    if (error instanceof CrestodianInferenceUnavailableError) throw error;
    throw new CrestodianInferenceUnavailableError("planner", [error]);
  }
  if (!plan) throw new CrestodianInferenceUnavailableError("planner");
  if (!plan.command) {
    if (!plan.reply?.trim()) throw new CrestodianInferenceUnavailableError("planner");
    runtime.log(plan.reply);
    return {
      kind: "none",
      message: "",
    };
  }
  const planned = parseCrestodianOperation(plan.command);
  if (planned.kind === "none") throw new CrestodianInferenceUnavailableError("planner");
  logAssistantPlan(runtime, plan, overview);
  return planned;
}
function shouldAskAssistant(input, operation) {
  if (operation.kind !== "none") return false;
  const trimmed = input.trim().toLowerCase();
  if (!trimmed || trimmed === "quit" || trimmed === "exit") return false;
  return true;
}
function logAssistantPlan(runtime, plan, overview) {
  const modelLabel = plan.modelLabel ?? overview.defaultModel ?? "configured model";
  runtime.log(`[crestodian] planner: ${modelLabel}`);
  if (plan.reply) runtime.log(plan.reply);
  runtime.log(`[crestodian] interpreted: ${plan.command}`);
}
//#endregion
export { resolveCrestodianOperation as n, approvalQuestion as t };
