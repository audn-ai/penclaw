import { n as cancelActiveCronTaskRun } from "./active-run-cancellation-D2egNSpJ.js";
import { t as getAcpSessionManager } from "./manager-93sSDaUm.js";
import { al as DetachedTaskTerminalState } from "./types-Ga3mNO_F.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region src/agents/subagent-control.d.ts
type SubagentKillTargetState =
  | {
      state: "finalizing";
    }
  | {
      state: "terminal";
      task: DetachedTaskTerminalState;
    };
/** Kills every currently controlled child run and its descendants. */
/** Admin kill path for a subagent session key, bypassing caller ownership checks. */
declare function killSubagentRunAdmin(params: { cfg: OpenClawConfig; sessionKey: string }): Promise<
  | {
      found: false;
      killed: boolean;
    }
  | {
      runId: string;
      sessionKey: string;
      cascadeKilled: number;
      cascadeLabels: string[] | undefined;
      targetState?: SubagentKillTargetState | undefined;
      found: true;
      killed: boolean;
    }
>;
//#endregion
export { cancelActiveCronTaskRun, getAcpSessionManager, killSubagentRunAdmin };
