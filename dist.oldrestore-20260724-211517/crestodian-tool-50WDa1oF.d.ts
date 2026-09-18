import { n as CrestodianOperation } from "./operations-Bj052-b9.js";

//#region src/agents/tools/crestodian-tool.d.ts
type CrestodianToolOptions = {
  /** Where setup side effects run; the gateway surface never manages its own daemon. */ surface:
    | "cli"
    | "gateway";
  /**
   * Host-verified consent for THIS turn: true only when the host judged the
   * user's actual message to be an explicit approval. The model-supplied
   * `approved` argument alone must never authorize a mutation (prompt
   * injection, model error).
   */
  approvalArmed?: boolean;
  /**
   * Approval is scoped to one exact operation: a denied mutating call records
   * its canonical hash here (host-owned, survives turns), and an armed turn
   * may execute only a call matching that hash. Cleared after use.
   */
  proposalRef?: {
    current?: string;
  };
  /**
   * Host handoff channel for actions the tool cannot perform itself
   * (interactive channel setup, external onboarding guidance, opening the
   * agent TUI). The engine reads it after the turn; CLI MCP hosts mirror it
   * from tool events.
   */
  directiveRef?: {
    current?: CrestodianToolDirective;
  };
};
/** Host directives the hosting chat engine handles after the turn. */
type CrestodianToolDirective =
  | {
      kind: "channel-setup";
      channel: string;
    }
  | {
      kind: "model-setup";
      workspace?: string;
    }
  | {
      kind: "open-tui";
      agentId?: string;
      workspace?: string;
    }
  | Extract<
      CrestodianOperation,
      {
        kind: "open-setup";
      }
    >
  | {
      kind: "approved-operation";
      operation: CrestodianOperation;
    };
//#endregion
export { CrestodianToolOptions as t };
