import {
  i as loadCrestodianOverview,
  r as CrestodianOverview,
  t as CrestodianCommandDeps,
} from "../operations-Bj052-b9.js";
import { n as RuntimeEnv } from "../runtime-Bxifh4bY.js";
import { C as CrestodianVerifiedInferenceBinding } from "../setup-inference-q3ll1Xgx.js";

//#region src/crestodian/assistant-prompts.d.ts
/** One prior conversation turn supplied to the assistant. */
type CrestodianAssistantTurn = {
  role: "user" | "assistant";
  text: string;
};
/** Parsed assistant plan before its command is re-validated as an operation. */
type CrestodianAssistantPlan = {
  command?: string;
  reply?: string;
  modelLabel?: string;
};
//#endregion
//#region src/crestodian/assistant.d.ts
type CrestodianAssistantPlanner = (params: {
  input: string;
  overview: CrestodianOverview;
  history?: CrestodianAssistantTurn[];
  pendingOperation?: string;
  readonly verifiedInference: CrestodianVerifiedInferenceBinding;
}) => Promise<CrestodianAssistantPlan | null>;
//#endregion
//#region src/crestodian/crestodian.d.ts
/**
 * CLI entry point for Crestodian.
 *
 * This module chooses JSON, one-shot, or interactive TUI mode and delegates all
 * command parsing/execution to dialogue and operation modules.
 */
type CrestodianInteractiveRunner = (
  opts: RunCrestodianOptions,
  runtime: RuntimeEnv,
) => Promise<void>;
/** Options accepted by the Crestodian command runner. */
type RunCrestodianOptions = {
  message?: string;
  yes?: boolean;
  json?: boolean;
  interactive?: boolean /** "onboarding" swaps the greeting for the first-run setup proposal. */;
  welcomeVariant?: "onboarding" /** Workspace override for the proposed first-run setup (from --workspace). */;
  setupWorkspace?: string;
  onReady?: () => void;
  deps?: CrestodianCommandDeps;
  formatOverview?: (overview: CrestodianOverview) => string;
  loadOverview?: typeof loadCrestodianOverview;
  planWithAssistant?: CrestodianAssistantPlanner;
  input?: NodeJS.ReadableStream;
  output?: NodeJS.WritableStream;
  runInteractiveTui?: CrestodianInteractiveRunner /** Exact live-tested route supplied by the inference gate. */;
  readonly verifiedInference: CrestodianVerifiedInferenceBinding;
};
/** User-supplied command options before the inference gate binds the run. */
type CrestodianCommandOptions = Omit<RunCrestodianOptions, "verifiedInference">;
/** Run Crestodian in JSON, one-shot message, or interactive TUI mode. */
declare function runCrestodian(opts: RunCrestodianOptions, runtime?: RuntimeEnv): Promise<void>;
//#endregion
export { CrestodianCommandOptions, RunCrestodianOptions, runCrestodian };
