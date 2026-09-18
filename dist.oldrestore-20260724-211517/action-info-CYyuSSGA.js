import { t as formatDurationCompact } from "./format-duration-DKk9BtRb.js";
import { n as formatTimeAgo } from "./format-relative-Bjc3l98W.js";
import { P as timestampMsToIsoString } from "./number-coercion-CJQ8TR--.js";
import { l as resolveStorePath } from "./paths-TfuVT-K8.js";
import { S as loadSessionEntry } from "./session-accessor-PZVNxFCV.js";
import { c as parseAgentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import { l as stopWithText, s as resolveSubagentEntryForToken } from "./shared-ClQdRzRz.js";
import {
  E as subagentRuns,
  t as getSubagentRunsSnapshotForRead,
  v as countPendingDescendantRunsFromRuns,
} from "./subagent-registry-state-tCJeOSqd.js";
import { n as formatRunStatus, t as formatRunLabel } from "./subagents-utils--q1dbPqc.js";
import "./subagents-format-Qpy9yX8Z.js";
import { i as findTaskByRunIdForOwner } from "./task-owner-access-CsO1Y--R.js";
import { a as sanitizeTaskStatusText } from "./task-status-DAPY5YOX.js";
//#region src/auto-reply/reply/commands-subagents/action-info.ts
function formatTimestampWithAge(valueMs) {
  if (!valueMs || !Number.isFinite(valueMs) || valueMs <= 0) return "n/a";
  const timestamp = timestampMsToIsoString(valueMs);
  if (!timestamp) return "n/a";
  return `${timestamp} (${formatTimeAgo(Date.now() - valueMs, { fallback: "n/a" })})`;
}
function resolveDisplayStatus(entry, options) {
  const pendingDescendants = Math.max(0, options?.pendingDescendants ?? 0);
  if (pendingDescendants > 0)
    return `active (waiting on ${pendingDescendants} ${pendingDescendants === 1 ? "child" : "children"})`;
  const status = formatRunStatus(entry);
  return status === "error" ? "failed" : status;
}
function loadSubagentSessionEntry(params, childKey) {
  const parsed = parseAgentSessionKey(childKey);
  return {
    entry: loadSessionEntry({
      storePath: resolveStorePath(params.cfg.session?.store, { agentId: parsed?.agentId }),
      sessionKey: childKey,
      clone: false,
    }),
  };
}
function handleSubagentsInfoAction(ctx) {
  const { params, requesterKey, runs, restTokens } = ctx;
  const target = restTokens[0];
  if (!target) return stopWithText("ℹ️ Usage: /subagents info <id|#>");
  const targetResolution = resolveSubagentEntryForToken(runs, target);
  if ("reply" in targetResolution) return targetResolution.reply;
  const run = targetResolution.entry;
  const { entry: sessionEntry } = loadSubagentSessionEntry(params, run.childSessionKey);
  const runtime =
    run.startedAt && Number.isFinite(run.startedAt)
      ? (formatDurationCompact((run.endedAt ?? Date.now()) - run.startedAt) ?? "n/a")
      : "n/a";
  const outcomeError = sanitizeTaskStatusText(run.outcome?.error, { errorContext: true });
  const outcome = run.outcome
    ? `${run.outcome.status}${outcomeError ? ` (${outcomeError})` : ""}`
    : "n/a";
  const linkedTask = findTaskByRunIdForOwner({
    runId: run.runId,
    callerOwnerKey: requesterKey,
  });
  const taskText = sanitizeTaskStatusText(run.task) || "n/a";
  const progressText = sanitizeTaskStatusText(linkedTask?.progressSummary);
  const taskSummaryText = sanitizeTaskStatusText(linkedTask?.terminalSummary, {
    errorContext: true,
  });
  const taskErrorText = sanitizeTaskStatusText(linkedTask?.error, { errorContext: true });
  return stopWithText(
    [
      "ℹ️ Subagent info",
      `Status: ${resolveDisplayStatus(run, { pendingDescendants: countPendingDescendantRunsFromRuns(getSubagentRunsSnapshotForRead(subagentRuns), run.childSessionKey) })}`,
      `Label: ${formatRunLabel(run)}`,
      `Task: ${taskText}`,
      `Run: ${run.runId}`,
      linkedTask ? `TaskId: ${linkedTask.taskId}` : void 0,
      linkedTask ? `TaskStatus: ${linkedTask.status}` : void 0,
      `Session: ${run.childSessionKey}`,
      `SessionId: ${sessionEntry?.sessionId ?? "n/a"}`,
      `Transcript: ${sessionEntry?.sessionFile ?? "n/a"}`,
      `Runtime: ${runtime}`,
      `Created: ${formatTimestampWithAge(run.createdAt)}`,
      `Started: ${formatTimestampWithAge(run.startedAt)}`,
      `Ended: ${formatTimestampWithAge(run.endedAt)}`,
      `Cleanup: ${run.cleanup}`,
      run.archiveAtMs ? `Archive: ${formatTimestampWithAge(run.archiveAtMs)}` : void 0,
      run.cleanupHandled ? "Cleanup handled: yes" : void 0,
      `Outcome: ${outcome}`,
      progressText ? `Progress: ${progressText}` : void 0,
      taskSummaryText ? `Task summary: ${taskSummaryText}` : void 0,
      taskErrorText ? `Task error: ${taskErrorText}` : void 0,
      linkedTask ? `Delivery: ${linkedTask.deliveryStatus}` : void 0,
    ]
      .filter(Boolean)
      .join("\n"),
  );
}
//#endregion
export { handleSubagentsInfoAction };
