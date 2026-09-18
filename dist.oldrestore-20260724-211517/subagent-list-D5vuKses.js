import { t as formatDurationCompact } from "./format-duration-DKk9BtRb.js";
import {
  n as resolveModelDisplayRef,
  t as resolveModelDisplayName,
} from "./model-selection-display-C8q7c9oG.js";
import { l as resolveStorePath } from "./paths-TfuVT-K8.js";
import { y as listSessionEntries } from "./session-accessor-PZVNxFCV.js";
import { c as parseAgentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import {
  E as subagentRuns,
  h as countActiveDescendantRunsFromRuns,
  t as getSubagentRunsSnapshotForRead,
  v as countPendingDescendantRunsFromRuns,
} from "./subagent-registry-state-tCJeOSqd.js";
import { t as compareSubagentRunGeneration } from "./subagent-run-generation-DZIUUsme.js";
import "./subagent-registry-read-BYGCPLV8.js";
import {
  a as shouldKeepSubagentRunChildLink,
  n as hasSubagentRunEnded,
  o as getSubagentSessionRuntimeMs,
  r as isLiveUnendedSubagentRun,
  s as getSubagentSessionStartedAt,
} from "./subagent-run-liveness-CYJpdt9z.js";
import {
  n as resolveTotalTokens,
  r as truncateLine,
  t as formatTokenUsageDisplay,
} from "./subagents-format-Qpy9yX8Z.js";
import { a as sortSubagentRuns, r as resolveSubagentLabel } from "./subagents-utils--q1dbPqc.js";
//#region src/agents/subagent-list.ts
/**
 * Subagent list builder.
 *
 * Combines live registry runs and persisted session metadata for sessions_list/subagents views.
 */
function resolveStorePathForKey(cfg, parsed) {
  return resolveStorePath(cfg.session?.store, { agentId: parsed?.agentId });
}
/** Resolve persisted session metadata for a session key, caching per store path. */
function resolveSessionEntryForKey(params) {
  const parsed = parseAgentSessionKey(params.key);
  const storePath = resolveStorePathForKey(params.cfg, parsed);
  let store = params.cache.get(storePath);
  if (!store) {
    store = Object.fromEntries(
      listSessionEntries({
        storePath,
        clone: false,
      }).map(({ sessionKey, entry }) => [sessionKey, entry]),
    );
    params.cache.set(storePath, store);
  }
  return {
    storePath,
    entry: store[params.key],
  };
}
/** Build child-session indexes from the latest run associated with each child key. */
function buildLatestSubagentRunIndex(runs, options) {
  const now = options?.now ?? Date.now();
  const latestByChildSessionKey = /* @__PURE__ */ new Map();
  for (const entry of runs.values()) {
    const childSessionKey = entry.childSessionKey?.trim();
    if (!childSessionKey) continue;
    const existing = latestByChildSessionKey.get(childSessionKey);
    if (!existing || compareSubagentRunGeneration(entry, existing) > 0)
      latestByChildSessionKey.set(childSessionKey, entry);
  }
  const childSessionsByController = /* @__PURE__ */ new Map();
  for (const [childSessionKey, entry] of latestByChildSessionKey.entries()) {
    const controllerSessionKey =
      entry.controllerSessionKey?.trim() || entry.requesterSessionKey?.trim();
    if (!controllerSessionKey) continue;
    if (
      !shouldKeepSubagentRunChildLink(entry, {
        activeDescendants: countActiveDescendantRunsFromRuns(runs, childSessionKey),
        now,
      })
    )
      continue;
    const existing = childSessionsByController.get(controllerSessionKey);
    if (existing) {
      existing.push(childSessionKey);
      continue;
    }
    childSessionsByController.set(controllerSessionKey, [childSessionKey]);
  }
  for (const [controllerSessionKey, childSessions] of childSessionsByController)
    childSessionsByController.set(controllerSessionKey, childSessions.toSorted());
  return {
    latestByChildSessionKey,
    childSessionsByController,
  };
}
/** Create a cached descendant counter for repeated list rendering checks. */
function createPendingDescendantCounter(runsSnapshot) {
  const pendingDescendantCache = /* @__PURE__ */ new Map();
  return (sessionKey) => {
    if (pendingDescendantCache.has(sessionKey)) return pendingDescendantCache.get(sessionKey) ?? 0;
    const snapshot = runsSnapshot ?? getSubagentRunsSnapshotForRead(subagentRuns);
    const pending = Math.max(0, countPendingDescendantRunsFromRuns(snapshot, sessionKey));
    pendingDescendantCache.set(sessionKey, pending);
    return pending;
  };
}
/** Return whether a run should be shown in the active subagent section. */
function isActiveSubagentRun(entry, pendingDescendantCount) {
  return isLiveUnendedSubagentRun(entry) || pendingDescendantCount(entry.childSessionKey) > 0;
}
function resolveRunStatus(entry, options) {
  const pendingDescendants = Math.max(0, options?.pendingDescendants ?? 0);
  if (pendingDescendants > 0)
    return `active (waiting on ${pendingDescendants} ${pendingDescendants === 1 ? "child" : "children"})`;
  if (!hasSubagentRunEnded(entry)) return "running";
  const status = entry.outcome?.status ?? "done";
  if (status === "ok") return "done";
  if (status === "error") return "failed";
  return status;
}
function resolveModelRef(entry, fallbackModel) {
  return resolveModelDisplayRef({
    runtimeProvider: entry?.modelProvider,
    runtimeModel: entry?.model,
    overrideProvider: entry?.providerOverride,
    overrideModel: entry?.modelOverride,
    fallbackModel,
  });
}
function resolveModelDisplay(entry, fallbackModel) {
  return resolveModelDisplayName({
    runtimeProvider: entry?.modelProvider,
    runtimeModel: entry?.model,
    overrideProvider: entry?.providerOverride,
    overrideModel: entry?.modelOverride,
    fallbackModel,
  });
}
function buildListText(params) {
  const lines = [];
  lines.push("active subagents:");
  if (params.active.length === 0) lines.push("(none)");
  else lines.push(...params.active.map((entry) => entry.line));
  lines.push("");
  lines.push(`recent (last ${params.recentMinutes}m):`);
  if (params.recent.length === 0) lines.push("(none)");
  else lines.push(...params.recent.map((entry) => entry.line));
  return lines.join("\n");
}
/** Build structured and text views for active and recent subagent runs. */
function buildSubagentList(params) {
  const now = Date.now();
  const recentCutoff = now - params.recentMinutes * 6e4;
  const dedupedRuns = [];
  const seenChildSessionKeys = /* @__PURE__ */ new Set();
  for (const entry of sortSubagentRuns(params.runs)) {
    if (seenChildSessionKeys.has(entry.childSessionKey)) continue;
    seenChildSessionKeys.add(entry.childSessionKey);
    dedupedRuns.push(entry);
  }
  const cache = /* @__PURE__ */ new Map();
  const snapshot = getSubagentRunsSnapshotForRead(subagentRuns);
  const { childSessionsByController } = buildLatestSubagentRunIndex(snapshot);
  const pendingDescendantCount = createPendingDescendantCounter(snapshot);
  let index = 1;
  const buildListEntry = (entry, runtimeMs) => {
    const sessionEntry = resolveSessionEntryForKey({
      cfg: params.cfg,
      key: entry.childSessionKey,
      cache,
    }).entry;
    const totalTokens = resolveTotalTokens(sessionEntry);
    const usageText = formatTokenUsageDisplay(sessionEntry);
    const pendingDescendants = pendingDescendantCount(entry.childSessionKey);
    const status = resolveRunStatus(entry, { pendingDescendants });
    const childSessions = childSessionsByController.get(entry.childSessionKey) ?? [];
    const runtime = formatDurationCompact(runtimeMs) ?? "n/a";
    const label = truncateLine(resolveSubagentLabel(entry), 48);
    const task = truncateLine(entry.task.trim(), params.taskMaxChars ?? 72);
    const taskName = entry.taskName?.trim();
    const taskNamePrefix = taskName ? `${taskName}: ` : "";
    const line = `${index}. ${taskNamePrefix}${label} (${resolveModelDisplay(sessionEntry, entry.model)}, ${runtime}${usageText ? `, ${usageText}` : ""}) ${status}${normalizeLowercaseStringOrEmpty(task) !== normalizeLowercaseStringOrEmpty(label) ? ` - ${task}` : ""}`;
    const view = {
      index,
      line,
      runId: entry.runId,
      sessionKey: entry.childSessionKey,
      ...(taskName ? { taskName } : {}),
      label,
      task,
      status,
      pendingDescendants,
      runtime,
      runtimeMs,
      ...(childSessions.length > 0 ? { childSessions } : {}),
      model: resolveModelRef(sessionEntry, entry.model),
      totalTokens,
      startedAt: getSubagentSessionStartedAt(entry),
      ...(entry.endedAt ? { endedAt: entry.endedAt } : {}),
    };
    index += 1;
    return view;
  };
  const active = dedupedRuns
    .filter((entry) => isActiveSubagentRun(entry, pendingDescendantCount))
    .map((entry) => buildListEntry(entry, getSubagentSessionRuntimeMs(entry, now) ?? 0));
  const recent = dedupedRuns
    .filter(
      (entry) =>
        !isActiveSubagentRun(entry, pendingDescendantCount) &&
        Boolean(entry.endedAt) &&
        (entry.endedAt ?? 0) >= recentCutoff,
    )
    .map((entry) =>
      buildListEntry(entry, getSubagentSessionRuntimeMs(entry, entry.endedAt ?? now) ?? 0),
    );
  return {
    total: dedupedRuns.length,
    active,
    recent,
    text: buildListText({
      active,
      recent,
      recentMinutes: params.recentMinutes,
    }),
  };
}
//#endregion
export { buildSubagentList as n, resolveSessionEntryForKey as r, buildLatestSubagentRunIndex as t };
