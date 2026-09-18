import { t as assertAgentHarnessTaskRuntimeScope } from "./agent-harness-task-runtime-scope-Cblo_5BC.js";
import { n as buildAnnounceIdempotencyKey } from "./announce-idempotency-DRIcQ039.js";
import "./message-channel-NQc9DJ6B.js";
import {
  a as finalizeTaskRunByRunId,
  c as recordTaskRunProgressByRunId,
  l as setDetachedTaskDeliveryStatusByRunId,
  r as createRunningTaskRun,
} from "./detached-task-runtime-DYTrA0lL.js";
import "./runtime-internal-B2_XwK02.js";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-CvbXi0yz.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import {
  d as formatAgentInternalEventsForPrompt,
  f as AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION,
  i as loadRequesterSessionEntry,
  n as deliverSubagentAnnouncement,
  r as isInternalAnnounceRequesterSession,
  s as resolveSubagentCompletionOrigin,
  t as resolveAnnounceOrigin,
} from "./subagent-announce-origin-4XzASDS-.js";
import { p as listTaskRecords } from "./task-registry-C44yDrOW.js";
//#region src/plugin-sdk/agent-harness-task-runtime.ts
/**
 * Runtime SDK helpers for agent harness task persistence and completion delivery.
 */
const AGENT_HARNESS_COMPLETION_SOURCE_TOOL = "agent_harness_task";
/** Creates a task runtime whose run ids and task records are constrained to one scope. */
function createAgentHarnessTaskRuntime(params) {
  const runtime = params.runtime;
  const requesterSessionKey = assertAgentHarnessTaskRuntimeScope(params.scope).requesterSessionKey;
  const taskKind = normalizeOptionalString(params.taskKind);
  const runIdPrefix = normalizeOptionalString(params.runIdPrefix);
  const assertRunId = (runId) => assertScopedRunId(runId, runIdPrefix);
  const tryCreateRunningTaskRun = (taskParams) => {
    assertRunId(taskParams.runId);
    return createRunningTaskRun({
      ...taskParams,
      runtime,
      ...(taskKind ? { taskKind } : {}),
      requesterSessionKey,
      ownerKey: requesterSessionKey,
      scopeKind: "session",
    });
  };
  return {
    createRunningTaskRun(taskParams) {
      const task = tryCreateRunningTaskRun(taskParams);
      if (!task) throw new Error("Task persistence failed.");
      return task;
    },
    tryCreateRunningTaskRun,
    recordTaskRunProgressByRunId(taskParams) {
      assertRunId(taskParams.runId);
      return recordTaskRunProgressByRunId({
        ...taskParams,
        runtime,
        sessionKey: requesterSessionKey,
      });
    },
    finalizeTaskRunByRunId(taskParams) {
      assertRunId(taskParams.runId);
      return finalizeTaskRunByRunId({
        ...taskParams,
        runtime,
        sessionKey: requesterSessionKey,
      });
    },
    setDetachedTaskDeliveryStatusByRunId(taskParams) {
      assertRunId(taskParams.runId);
      return setDetachedTaskDeliveryStatusByRunId({
        ...taskParams,
        runtime,
        sessionKey: requesterSessionKey,
      });
    },
    listTaskRecords() {
      return listTaskRecords().filter(
        (task) =>
          task.runtime === runtime &&
          (!taskKind || task.taskKind === taskKind) &&
          task.scopeKind === "session" &&
          task.ownerKey === requesterSessionKey &&
          (!runIdPrefix || task.runId?.startsWith(runIdPrefix)),
      );
    },
  };
}
/** Delivers a completed harness task result back to the requester or parent session. */
async function deliverAgentHarnessTaskCompletion(params) {
  const scope = assertAgentHarnessTaskRuntimeScope(params.scope);
  const requesterSessionKey = scope.requesterSessionKey;
  const childSessionKey = params.childSessionKey.trim();
  const childSessionId = params.childSessionId.trim();
  const taskLabel = params.taskLabel?.trim() || "Agent harness task";
  const announceType = params.announceType?.trim() || "Agent harness task";
  const statusLabel = params.statusLabel?.trim() || params.status;
  const eventStatus = mapHarnessCompletionStatus(params.status);
  const requesterIsSubagent = isInternalAnnounceRequesterSession(requesterSessionKey);
  let directOrigin = scope.requesterOrigin;
  if (!requesterIsSubagent) {
    const { entry } = loadRequesterSessionEntry(requesterSessionKey);
    directOrigin = resolveAnnounceOrigin(entry, scope.requesterOrigin);
  }
  const completionDirectOrigin =
    requesterIsSubagent || !directOrigin
      ? directOrigin
      : await resolveSubagentCompletionOrigin({
          childSessionKey,
          requesterSessionKey,
          requesterOrigin: directOrigin,
          childRunId: childSessionKey,
          spawnMode: "run",
          expectsCompletionMessage: true,
        });
  const internalEvents = [
    {
      type: AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION,
      source: "subagent",
      childSessionKey,
      childSessionId,
      announceType,
      taskLabel,
      status: eventStatus,
      statusLabel,
      result: params.result,
      replyInstruction:
        params.replyInstruction?.trim() ||
        "Use the completed harness task result to continue or wrap up the parent task. If this is a channel session, send the visible response with the message tool instead of only writing a transcript final answer.",
    },
  ];
  const prompt = formatAgentInternalEventsForPrompt(internalEvents);
  return await deliverSubagentAnnouncement({
    requesterSessionKey,
    announceId: params.announceId,
    triggerMessage: prompt,
    steerMessage: prompt,
    internalEvents,
    summaryLine: taskLabel,
    requesterSessionOrigin: scope.requesterOrigin,
    requesterOrigin: completionDirectOrigin ?? directOrigin,
    completionDirectOrigin: completionDirectOrigin ?? directOrigin,
    directOrigin,
    sourceSessionKey: childSessionKey,
    sourceChannel: INTERNAL_MESSAGE_CHANNEL,
    sourceTool: AGENT_HARNESS_COMPLETION_SOURCE_TOOL,
    targetRequesterSessionKey: requesterSessionKey,
    requesterIsSubagent,
    expectsCompletionMessage: true,
    bestEffortDeliver: true,
    directIdempotencyKey: buildAnnounceIdempotencyKey(params.announceId),
    signal: params.signal,
  });
}
function mapHarnessCompletionStatus(status) {
  if (status === "succeeded") return "ok";
  return "error";
}
/** Returns true when completion delivery reached a persistent direct or steered path. */
function isDurableAgentHarnessCompletionDelivery(delivery) {
  if (!delivery.delivered) return false;
  if (delivery.path === "steered") return true;
  if (delivery.path !== "direct") return false;
  const phases = Array.isArray(delivery.phases) ? delivery.phases : void 0;
  if (!phases) return true;
  return phases.some(
    (phase) => phase.phase === "direct-primary" && phase.delivered && phase.path === "direct",
  );
}
function assertScopedRunId(runId, runIdPrefix) {
  const normalized = runId.trim();
  if (!normalized) throw new Error("Agent harness task runtime requires runId");
  if (runIdPrefix && !normalized.startsWith(runIdPrefix))
    throw new Error("Agent harness task runId is outside the configured scope");
}
//#endregion
export {
  deliverAgentHarnessTaskCompletion as n,
  isDurableAgentHarnessCompletionDelivery as r,
  createAgentHarnessTaskRuntime as t,
};
