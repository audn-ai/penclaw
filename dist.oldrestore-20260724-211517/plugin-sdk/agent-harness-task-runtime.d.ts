import { t as DeliveryContext } from "../delivery-context.types-DyNhFIjW.js";
import { t as SubagentAnnounceDeliveryResult } from "../subagent-announce-dispatch-Bru7ZOr1.js";
import {
  Eu as AgentInternalEvent,
  Gl as TaskRecord,
  Oo as AgentHarnessTaskRuntimeScope,
  il as DetachedTaskLifecycleRuntime,
  rl as DetachedTaskFinalizeParams,
} from "../types-Ga3mNO_F.js";
//#region src/agents/subagent-announce-delivery.d.ts
declare function deliverSubagentAnnouncement(params: {
  requesterSessionKey: string;
  announceId?: string;
  triggerMessage: string;
  steerMessage: string;
  internalEvents?: AgentInternalEvent[];
  summaryLine?: string;
  requesterSessionOrigin?: DeliveryContext;
  requesterOrigin?: DeliveryContext;
  completionDirectOrigin?: DeliveryContext;
  directOrigin?: DeliveryContext;
  sourceSessionKey?: string;
  sourceChannel?: string;
  sourceTool?: string;
  targetRequesterSessionKey: string;
  requesterIsSubagent: boolean;
  expectsCompletionMessage: boolean;
  bestEffortDeliver?: boolean;
  directIdempotencyKey: string;
  signal?: AbortSignal;
}): Promise<SubagentAnnounceDeliveryResult>;
//#endregion
//#region src/tasks/detached-task-runtime.d.ts
declare function createRunningTaskRun(
  ...args: Parameters<DetachedTaskLifecycleRuntime["createRunningTaskRun"]>
): ReturnType<DetachedTaskLifecycleRuntime["createRunningTaskRun"]>;
declare function recordTaskRunProgressByRunId(
  ...args: Parameters<DetachedTaskLifecycleRuntime["recordTaskRunProgressByRunId"]>
): ReturnType<DetachedTaskLifecycleRuntime["recordTaskRunProgressByRunId"]>;
declare function finalizeTaskRunByRunId(params: DetachedTaskFinalizeParams): TaskRecord[];
declare function setDetachedTaskDeliveryStatusByRunId(
  ...args: Parameters<DetachedTaskLifecycleRuntime["setDetachedTaskDeliveryStatusByRunId"]>
): ReturnType<DetachedTaskLifecycleRuntime["setDetachedTaskDeliveryStatusByRunId"]>;
//#endregion
//#region src/plugin-sdk/agent-harness-task-runtime.d.ts
type AgentHarnessTaskRuntimeId = Parameters<typeof createRunningTaskRun>[0]["runtime"];
type CreateRunningTaskRunParams = Parameters<typeof createRunningTaskRun>[0];
type RecordTaskRunProgressParams = Parameters<typeof recordTaskRunProgressByRunId>[0];
type FinalizeTaskRunParams = Parameters<typeof finalizeTaskRunByRunId>[0];
type SetDeliveryStatusParams = Parameters<typeof setDetachedTaskDeliveryStatusByRunId>[0];
/** Scope and naming options used to bind task operations to one requester session. */
type AgentHarnessTaskRuntimeScopeParams = {
  runtime: AgentHarnessTaskRuntimeId;
  scope: AgentHarnessTaskRuntimeScope;
  taskKind?: string;
  runIdPrefix?: string;
};
/** Create-task params with runtime and requester scope supplied by the scoped task runtime. */
type AgentHarnessScopedCreateRunningTaskRunParams = Omit<
  CreateRunningTaskRunParams,
  "runtime" | "taskKind" | "requesterSessionKey" | "ownerKey" | "scopeKind"
> & {
  runId: string;
};
/** Progress params scoped to the requester session owned by the harness runtime. */
type AgentHarnessScopedRecordTaskRunProgressParams = Omit<
  RecordTaskRunProgressParams,
  "runtime" | "sessionKey"
>;
/** Finalization params scoped to the requester session owned by the harness runtime. */
type AgentHarnessScopedFinalizeTaskRunParams = Omit<
  FinalizeTaskRunParams,
  "runtime" | "sessionKey"
>;
/** Delivery-status params scoped to the requester session owned by the harness runtime. */
type AgentHarnessScopedSetDeliveryStatusParams = Omit<
  SetDeliveryStatusParams,
  "runtime" | "sessionKey"
>;
/** Scoped task runtime that prevents callers from mutating tasks outside their harness scope. */
type AgentHarnessTaskRuntime = {
  createRunningTaskRun(params: AgentHarnessScopedCreateRunningTaskRunParams): TaskRecord;
  tryCreateRunningTaskRun(params: AgentHarnessScopedCreateRunningTaskRunParams): TaskRecord | null;
  recordTaskRunProgressByRunId(params: AgentHarnessScopedRecordTaskRunProgressParams): TaskRecord[];
  finalizeTaskRunByRunId(params: AgentHarnessScopedFinalizeTaskRunParams): TaskRecord[];
  setDetachedTaskDeliveryStatusByRunId(
    params: AgentHarnessScopedSetDeliveryStatusParams,
  ): TaskRecord[];
  listTaskRecords(): TaskRecord[];
};
/** Completion states a harness task can report to its requester. */
type AgentHarnessCompletionStatus = "succeeded" | "failed" | "cancelled";
/** Delivery result returned after routing a harness task completion announcement. */
type AgentHarnessCompletionDelivery = Awaited<ReturnType<typeof deliverSubagentAnnouncement>>;
/** Creates a task runtime whose run ids and task records are constrained to one scope. */
declare function createAgentHarnessTaskRuntime(
  params: AgentHarnessTaskRuntimeScopeParams,
): AgentHarnessTaskRuntime;
/** Delivers a completed harness task result back to the requester or parent session. */
declare function deliverAgentHarnessTaskCompletion(params: {
  scope: AgentHarnessTaskRuntimeScope;
  childSessionKey: string;
  childSessionId: string;
  announceId: string;
  status: AgentHarnessCompletionStatus;
  statusLabel?: string;
  result: string;
  taskLabel?: string;
  announceType?: string;
  replyInstruction?: string;
  signal?: AbortSignal;
}): Promise<AgentHarnessCompletionDelivery>;
/** Returns true when completion delivery reached a persistent direct or steered path. */
declare function isDurableAgentHarnessCompletionDelivery(
  delivery: AgentHarnessCompletionDelivery,
): boolean;
//#endregion
export {
  AgentHarnessCompletionDelivery,
  AgentHarnessCompletionStatus,
  AgentHarnessScopedCreateRunningTaskRunParams,
  AgentHarnessScopedFinalizeTaskRunParams,
  AgentHarnessScopedRecordTaskRunProgressParams,
  AgentHarnessScopedSetDeliveryStatusParams,
  type TaskRecord as AgentHarnessTaskRecord,
  AgentHarnessTaskRuntime,
  type AgentHarnessTaskRuntimeScope,
  AgentHarnessTaskRuntimeScopeParams,
  createAgentHarnessTaskRuntime,
  deliverAgentHarnessTaskCompletion,
  isDurableAgentHarnessCompletionDelivery,
};
