import { describe, expect, it } from "vitest";
import { AutoContinueController } from "./auto-continue.js";

// Regression: a /v1 client-tool handoff (assistant stopReason "toolUse" -> endedWithToolCall)
// is a terminal turn. Auto-continue must STOP, never re-drive — re-driving injected a synthetic
// "Continue." turn, so the agent duplicated the call and emitted "delegated to client" commentary,
// which surfaced to LiteLLM/Hermes as a broken/empty tool response.
describe("AutoContinueController.decideNext — client tool-call handoff", () => {
  it("stops on a tool-call handoff, overriding what the decider/heuristic would say", async () => {
    const controller = new AutoContinueController();
    // lastText looks like progress (would otherwise continue); the handoff flag must win.
    const decision = await controller.decideNext({
      task: "You must call test_tool and pass the exact value PING.",
      lastText: "Calling the tool now.",
      hadToolCall: true,
      endedWithToolCall: true,
    });
    expect(decision).toEqual({ kind: "stop", reason: "tool_calls" });
  });

  it("preserves normal continue behavior when there is no tool-call handoff", async () => {
    const controller = new AutoContinueController();
    const decision = await controller.decideNext({
      task: "keep working the task",
      lastText: "Made an edit; proceeding to the next step.",
      hadToolCall: true,
      endedWithToolCall: false,
    });
    expect(decision.kind).toBe("continue");
  });
});
