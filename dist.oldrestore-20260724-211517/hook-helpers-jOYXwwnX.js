import { m as consumeAdjustedParamsForToolCall } from "./agent-tools.before-tool-call-B7gv78c3.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-CPEPIvCK.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region src/agents/harness/hook-helpers.ts
/**
 * Agent harness tool/message hook helpers.
 *
 * Harnesses use this to dispatch after-tool-call and before-message-write hooks
 * while isolating hook failures from the runtime path.
 */
const log = createSubsystemLogger("agents/harness");
/** Runs best-effort after-tool-call hooks for a completed tool invocation. */
async function runAgentHarnessAfterToolCallHook(params) {
  const adjustedArgs = consumeAdjustedParamsForToolCall(params.toolCallId, params.runId);
  const resolvedArgs =
    adjustedArgs && typeof adjustedArgs === "object" ? adjustedArgs : params.startArgs;
  const eventArgs = structuredClone(resolvedArgs);
  const hookRunner = getGlobalHookRunner();
  if (!hookRunner?.hasHooks("after_tool_call")) return;
  try {
    await hookRunner.runAfterToolCall(
      {
        toolName: params.toolName,
        params: eventArgs,
        ...(params.runId ? { runId: params.runId } : {}),
        toolCallId: params.toolCallId,
        ...(params.result ? { result: params.result } : {}),
        ...(params.error ? { error: params.error } : {}),
        ...(params.startedAt != null ? { durationMs: Date.now() - params.startedAt } : {}),
      },
      {
        toolName: params.toolName,
        ...(params.agentId ? { agentId: params.agentId } : {}),
        ...(params.sessionId ? { sessionId: params.sessionId } : {}),
        ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
        ...(params.runId ? { runId: params.runId } : {}),
        ...(params.channelId ? { channelId: params.channelId } : {}),
        toolCallId: params.toolCallId,
      },
    );
  } catch (error) {
    log.warn(`after_tool_call hook failed: tool=${params.toolName} error=${String(error)}`);
  }
}
/** Runs before-message-write hooks and returns the possibly rewritten message. */
function runAgentHarnessBeforeMessageWriteHook(params) {
  const hookRunner = getGlobalHookRunner();
  if (!hookRunner?.hasHooks("before_message_write")) return params.message;
  const result = hookRunner.runBeforeMessageWrite(
    { message: params.message },
    {
      ...(params.agentId ? { agentId: params.agentId } : {}),
      ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
    },
  );
  if (result?.block) return null;
  return result?.message ?? params.message;
}
//#endregion
export { runAgentHarnessBeforeMessageWriteHook as n, runAgentHarnessAfterToolCallHook as t };
