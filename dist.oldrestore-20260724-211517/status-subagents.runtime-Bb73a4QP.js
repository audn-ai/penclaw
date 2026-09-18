import { t as formatDurationCompact } from "./format-duration-DKk9BtRb.js";
import { a as listControlledSubagentRuns } from "./subagent-control-D-LCbeU1.js";
import { a as countPendingDescendantRuns } from "./subagent-registry-CZikbOhO.js";
import { a as sortSubagentRuns, t as formatRunLabel } from "./subagents-utils--q1dbPqc.js";
//#region src/auto-reply/reply/commands-status-subagents.ts
function formatActiveSubagentDetail(params) {
  const { entry, now, pendingDescendants } = params;
  const startedAt = entry.startedAt ?? entry.sessionStartedAt ?? entry.createdAt;
  const duration =
    formatDurationCompact(
      Math.max(0, (entry.endedAt && pendingDescendants === 0 ? entry.endedAt : now) - startedAt),
      { spaced: true },
    ) ?? "0s";
  return `  • ${formatRunLabel(entry, { maxLength: 56 })} · ${duration}${pendingDescendants > 0 ? ` · ${pendingDescendants} child${pendingDescendants === 1 ? "" : "ren"} active` : ""}`;
}
/** Builds the compact status line for active and completed subagents. */
function buildSubagentsStatusLine(params) {
  const { runs, pendingDescendantsForRun, verboseEnabled } = params;
  if (runs.length === 0) return;
  const activeWithDescendants = runs
    .map((entry) => ({
      entry,
      pendingDescendants: pendingDescendantsForRun(entry),
    }))
    .filter(({ entry, pendingDescendants }) => !entry.endedAt || pendingDescendants > 0);
  const active = activeWithDescendants.map(({ entry }) => entry);
  const done = runs.length - active.length;
  if (active.length === 0)
    return verboseEnabled && done > 0 ? `🤖 Subagents: 0 active · ${done} done` : void 0;
  const summary = `🤖 Subagents: ${active.length} active${done > 0 ? ` · ${done} done` : ""}`;
  const now = params.now ?? Date.now();
  const detailLookup = new Map(
    activeWithDescendants.map(({ entry, pendingDescendants }) => [entry.runId, pendingDescendants]),
  );
  return [
    summary,
    ...sortSubagentRuns(active)
      .slice(0, 3)
      .map((entry) =>
        formatActiveSubagentDetail({
          entry,
          now,
          pendingDescendants: detailLookup.get(entry.runId) ?? 0,
        }),
      ),
  ].join("\n");
}
//#endregion
export { buildSubagentsStatusLine, countPendingDescendantRuns, listControlledSubagentRuns };
