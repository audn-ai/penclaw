import { c as callGateway, g as isGatewayTransportError } from "./call-BVMO6az_.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-Br1guPTt.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { i as writeRuntimeJson } from "./runtime-Bz6o617W.js";
import "./config-BDv-QbJ6.js";
import { t as sanitizeTerminalText } from "./safe-text-DiGQuw-e.js";
import { t as resolveSessionStoreTargetsOrExit } from "./session-store-targets-BFhc7IRB.js";
import "./message-channel-NQc9DJ6B.js";
import {
  i as serializeSessionCleanupResult,
  n as resolveSessionCleanupAction,
  r as runSessionsCleanup,
} from "./sessions-CEG7v41b.js";
import {
  c as resolveSessionDisplayModel,
  i as formatSessionModelCell,
  n as formatSessionFlagsCell,
  o as toSessionDisplayRows,
  r as formatSessionKeyCell,
  t as formatSessionAgeCell,
} from "./sessions-table-DKqxTmAN.js";
import { n as isRich, r as theme } from "./theme-vjDs9tao.js";
//#region src/commands/sessions-cleanup.ts
/**
 * Session cleanup command.
 *
 * It can delegate cleanup to a live gateway or run local store maintenance,
 * with dry-run tables that explain every planned pruning action.
 */
const ACTION_PAD = 15;
function formatCleanupActionCell(action, rich) {
  const label = action.padEnd(ACTION_PAD);
  if (!rich) return label;
  if (action === "keep") return theme.muted(label);
  if (action === "prune-missing") return theme.error(label);
  if (action === "prune-model-run") return theme.warn(label);
  if (action === "prune-stale") return theme.warn(label);
  if (action === "retire-dm-scope") return theme.warn(label);
  if (action === "cap-overflow") return theme.accentBright(label);
  return theme.error(label);
}
function buildActionRows(params) {
  return toSessionDisplayRows(params.beforeStore).map((row) =>
    Object.assign({}, row, {
      label: params.beforeStore[row.key]?.label,
      action: resolveSessionCleanupAction({
        key: row.key,
        missingKeys: params.missingKeys,
        modelRunPrunedKeys: params.modelRunPrunedKeys,
        staleKeys: params.staleKeys,
        cappedKeys: params.cappedKeys,
        budgetEvictedKeys: params.budgetEvictedKeys,
        dmScopeRetiredKeys: params.dmScopeRetiredKeys,
      }),
    }),
  );
}
function buildLabelSummaries(actionRows) {
  const summaryByLabel = /* @__PURE__ */ new Map();
  for (const actionRow of actionRows) {
    const label =
      sanitizeTerminalText(typeof actionRow.label === "string" ? actionRow.label.trim() : "") ||
      "(unlabeled)";
    let summary = summaryByLabel.get(label);
    if (!summary) {
      summary = {
        label,
        kept: 0,
        pruned: 0,
      };
      summaryByLabel.set(label, summary);
    }
    if (actionRow.action === "keep") summary.kept += 1;
    else summary.pruned += 1;
  }
  return [...summaryByLabel.values()].toSorted((a, b) => a.label.localeCompare(b.label));
}
function renderLabelSummaries(params) {
  const summaries = buildLabelSummaries(params.actionRows);
  if (summaries.length === 0) return;
  const labelPad = Math.max(...summaries.map((summary) => summary.label.length));
  const totalKept = summaries.reduce((total, summary) => total + summary.kept, 0);
  const totalPruned = summaries.reduce((total, summary) => total + summary.pruned, 0);
  params.runtime.log("");
  params.runtime.log("Summary by Label:");
  for (const summary of summaries)
    params.runtime.log(
      `${summary.label.padEnd(labelPad)}  ${summary.kept} kept, ${summary.pruned} pruned`,
    );
  params.runtime.log(`Total: ${totalKept} kept, ${totalPruned} pruned`);
}
function renderStoreDryRunPlan(params) {
  const rich = isRich();
  if (params.showAgentHeader) params.runtime.log(`Agent: ${params.summary.agentId}`);
  params.runtime.log(`Session store: ${params.summary.storePath}`);
  params.runtime.log(`Maintenance mode: ${params.summary.mode}`);
  params.runtime.log(
    `Entries: ${params.summary.beforeCount} -> ${params.summary.afterCount} (remove ${params.summary.beforeCount - params.summary.afterCount})`,
  );
  params.runtime.log(`Would prune missing transcripts: ${params.summary.missing}`);
  params.runtime.log(`Would retire stale direct DM sessions: ${params.summary.dmScopeRetired}`);
  params.runtime.log(`Would prune stale model-run probes: ${params.summary.modelRunPruned}`);
  params.runtime.log(`Would prune stale: ${params.summary.pruned}`);
  params.runtime.log(`Would cap overflow: ${params.summary.capped}`);
  if (params.summary.unreferencedArtifacts?.scannedFiles)
    params.runtime.log(
      `Would prune unreferenced artifacts: ${params.summary.unreferencedArtifacts.removedFiles}`,
    );
  if (params.summary.diskBudget)
    params.runtime.log(
      `Would enforce disk budget: ${params.summary.diskBudget.totalBytesBefore} -> ${params.summary.diskBudget.totalBytesAfter} bytes (files ${params.summary.diskBudget.removedFiles}, entries ${params.summary.diskBudget.removedEntries})`,
    );
  if (params.actionRows.length === 0) return;
  params.runtime.log("");
  params.runtime.log("Planned session actions:");
  const header = [
    "Action".padEnd(ACTION_PAD),
    "Key".padEnd(26),
    "Age".padEnd(9),
    "Model".padEnd(14),
    "Flags",
  ].join(" ");
  params.runtime.log(rich ? theme.heading(header) : header);
  for (const actionRow of params.actionRows) {
    const model = resolveSessionDisplayModel(params.cfg, actionRow);
    const line = [
      formatCleanupActionCell(actionRow.action, rich),
      formatSessionKeyCell(actionRow.key, rich),
      formatSessionAgeCell(actionRow.updatedAt, rich),
      formatSessionModelCell(model, rich),
      formatSessionFlagsCell(actionRow, rich),
    ].join(" ");
    params.runtime.log(line.trimEnd());
  }
  renderLabelSummaries({
    actionRows: params.actionRows,
    runtime: params.runtime,
  });
}
function renderAppliedSummaries(params) {
  for (let i = 0; i < params.summaries.length; i += 1) {
    const summary = params.summaries[i];
    if (!summary) continue;
    if (i > 0) params.runtime.log("");
    if (params.summaries.length > 1) params.runtime.log(`Agent: ${summary.agentId}`);
    params.runtime.log(`Session store: ${summary.storePath}`);
    params.runtime.log(`Applied maintenance. Current entries: ${summary.appliedCount ?? 0}`);
    if (summary.unreferencedArtifacts?.removedFiles)
      params.runtime.log(
        `Pruned unreferenced artifacts: ${summary.unreferencedArtifacts.removedFiles}`,
      );
  }
}
async function maybeRunGatewayCleanup(opts) {
  if (opts.store || opts.dryRun) return null;
  try {
    return await callGateway({
      method: "sessions.cleanup",
      params: {
        agent: opts.agent,
        allAgents: opts.allAgents,
        enforce: opts.enforce,
        activeKey: opts.activeKey,
        fixMissing: opts.fixMissing,
        fixDmScope: opts.fixDmScope,
      },
      mode: GATEWAY_CLIENT_MODES.CLI,
      clientName: GATEWAY_CLIENT_NAMES.CLI,
      requiredMethods: ["sessions.cleanup"],
    });
  } catch (error) {
    if (isGatewayTransportError(error)) return null;
    throw error;
  }
}
/** Runs session cleanup, optionally using the live gateway for active stores. */
async function sessionsCleanupCommand(opts, runtime) {
  const gatewayResult = await maybeRunGatewayCleanup(opts);
  if (gatewayResult) {
    if (opts.json) {
      writeRuntimeJson(runtime, gatewayResult);
      return;
    }
    renderAppliedSummaries({
      summaries: "stores" in gatewayResult ? gatewayResult.stores : [gatewayResult],
      runtime,
    });
    return;
  }
  const cfg = getRuntimeConfig();
  const targets = resolveSessionStoreTargetsOrExit({
    cfg,
    opts: {
      store: opts.store,
      agent: opts.agent,
      allAgents: opts.allAgents,
    },
    runtime,
  });
  if (!targets) return;
  const { mode, previewResults, appliedSummaries } = await runSessionsCleanup({
    cfg,
    opts,
    targets,
  });
  if (opts.dryRun) {
    if (opts.json) {
      writeRuntimeJson(
        runtime,
        serializeSessionCleanupResult({
          mode,
          dryRun: true,
          summaries: previewResults.map((result) => result.summary),
        }),
      );
      return;
    }
    for (const [i, result] of previewResults.entries()) {
      if (i > 0) runtime.log("");
      renderStoreDryRunPlan({
        cfg,
        summary: result.summary,
        actionRows: buildActionRows(result),
        runtime,
        showAgentHeader: previewResults.length > 1,
      });
    }
    return;
  }
  if (opts.json) {
    writeRuntimeJson(
      runtime,
      serializeSessionCleanupResult({
        mode,
        dryRun: false,
        summaries: appliedSummaries,
      }),
    );
    return;
  }
  renderAppliedSummaries({
    summaries: appliedSummaries,
    runtime,
  });
}
//#endregion
export { sessionsCleanupCommand };
