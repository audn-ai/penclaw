import {
  n as ExecAutoReviewHost,
  r as ExecAutoReviewInput,
  t as ExecAutoReviewDecision,
} from "../exec-auto-review-D8kEqNZE.js";
import { i as OpenClawConfig } from "../types.openclaw-DDo8sH3F.js";

//#region src/plugin-sdk/agent-harness-exec-review-runtime.d.ts
declare function reviewExecRequestWithConfiguredModel(params: {
  cfg?: OpenClawConfig;
  agentId?: string;
  reviewer?: unknown;
  input: ExecAutoReviewInput;
}): Promise<ExecAutoReviewDecision>;
declare function buildExecAutoReviewInputForShellCommand(params: {
  command: string;
  cwd?: string | null;
  host: ExecAutoReviewHost;
  envKeys?: readonly string[];
  agent?: {
    id?: string | null;
    sessionKey?: string | null;
  };
}): Promise<ExecAutoReviewInput | undefined>;
//#endregion
export { buildExecAutoReviewInputForShellCommand, reviewExecRequestWithConfiguredModel };
