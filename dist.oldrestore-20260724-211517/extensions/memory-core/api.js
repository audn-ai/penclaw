import crypto from "node:crypto";
import "../../memory-core-host-status-BYxFcXad.js";
import fs from "node:fs/promises";
import path from "node:path";
import { H as formatMemoryDreamingDay } from "../../dreaming-CM8RB1ct.js";
import {
  a as removeBackfillDiaryEntries,
  n as dedupeDreamDiaryEntries,
  s as writeBackfillDiaryEntries,
} from "../../dreaming-narrative-DsWreRa1.js";
import { r as filterRecallEntriesWithinLookback } from "../../dreaming-phases-z-A3H73T.js";
import { u as configureMemoryCoreDreamingState } from "../../dreaming-state-DLMGVRgZ.js";
import {
  n as previewGroundedRemMarkdown,
  t as previewRemHarness,
} from "../../rem-harness-CiJed17O.js";
//#region extensions/memory-core/src/dreaming-shadow-trial.ts
function normalizeRequiredText(value, label) {
  const normalized = value.trim().replace(/\s+/g, " ");
  if (!normalized) throw new Error(`dreaming shadow trial requires ${label}`);
  return normalized;
}
function normalizeList(values, fallback) {
  const normalized = (values ?? []).map((value) => value.trim()).filter(Boolean);
  return normalized.length > 0 ? normalized : [fallback];
}
function normalizeDataList(values) {
  return (values ?? []).map((value) => value.trim()).filter(Boolean);
}
function resolveDreamingShadowTrialRecommendation(verdict) {
  if (verdict === "helpful") return "promote";
  if (verdict === "harmful") return "reject";
  return "defer";
}
function formatList(values) {
  return values.map((value) => `- ${value}`).join("\n");
}
function resolveReportContentHash(params) {
  const seed = JSON.stringify([
    params.candidate,
    params.trialPrompt,
    params.baselineOutcome,
    params.candidateOutcome,
    params.verdict,
    params.reason,
    params.riskFlags,
    params.evidenceRefs,
  ]);
  return crypto.createHash("sha256").update(seed).digest("hex").slice(0, 12);
}
function defaultDreamingShadowTrialReportPath(params) {
  const day = formatMemoryDreamingDay(
    Number.isFinite(params.nowMs) ? params.nowMs : Date.now(),
    params.timezone,
  );
  const contentHash = resolveReportContentHash({
    candidate: normalizeRequiredText(params.candidate, "candidate"),
    trialPrompt: normalizeRequiredText(params.trialPrompt, "trialPrompt"),
    baselineOutcome: normalizeRequiredText(params.baselineOutcome, "baselineOutcome"),
    candidateOutcome: normalizeRequiredText(params.candidateOutcome, "candidateOutcome"),
    verdict: params.verdict,
    reason: normalizeRequiredText(params.reason, "reason"),
    riskFlags: normalizeDataList(params.riskFlags),
    evidenceRefs: normalizeDataList(params.evidenceRefs),
  });
  return path.join(
    params.workspaceDir,
    "memory",
    "dreaming",
    "shadow-trials",
    day,
    `${contentHash}.md`,
  );
}
function resolveReportPath(params) {
  if (params.reportPath) {
    if (path.isAbsolute(params.reportPath)) return params.reportPath;
    if (!params.workspaceDir)
      throw new Error("dreaming shadow trial relative reportPath requires workspaceDir");
    return path.join(params.workspaceDir, params.reportPath);
  }
  if (!params.workspaceDir) return;
  return defaultDreamingShadowTrialReportPath({
    workspaceDir: params.workspaceDir,
    candidate: params.candidate,
    trialPrompt: params.trialPrompt,
    baselineOutcome: params.baselineOutcome,
    candidateOutcome: params.candidateOutcome,
    verdict: params.verdict,
    reason: params.reason,
    riskFlags: params.riskFlags,
    evidenceRefs: params.evidenceRefs,
    nowMs: params.nowMs,
    timezone: params.timezone,
  });
}
function buildDreamingShadowTrialReport(input) {
  const candidate = normalizeRequiredText(input.candidate, "candidate");
  const trialPrompt = normalizeRequiredText(input.trialPrompt, "trialPrompt");
  const baselineOutcome = normalizeRequiredText(input.baselineOutcome, "baselineOutcome");
  const candidateOutcome = normalizeRequiredText(input.candidateOutcome, "candidateOutcome");
  const reason = normalizeRequiredText(input.reason, "reason");
  const riskFlags = normalizeDataList(input.riskFlags);
  const evidenceRefs = normalizeDataList(input.evidenceRefs);
  const recommendation = resolveDreamingShadowTrialRecommendation(input.verdict);
  const reportPath = resolveReportPath({
    workspaceDir: input.workspaceDir,
    candidate,
    trialPrompt,
    baselineOutcome,
    candidateOutcome,
    verdict: input.verdict,
    reason,
    riskFlags,
    evidenceRefs,
    reportPath: input.reportPath,
    nowMs: input.nowMs,
    timezone: input.timezone,
  });
  const markdown = [
    "# Dreaming Shadow Trial Report",
    "",
    `candidate: ${candidate}`,
    `trial prompt: ${trialPrompt}`,
    `baseline outcome: ${baselineOutcome}`,
    `candidate outcome: ${candidateOutcome}`,
    `verdict: ${input.verdict}`,
    `recommendation: ${recommendation}`,
    `reason: ${reason}`,
    "risk flags:",
    formatList(normalizeList(riskFlags, "none recorded")),
    "evidence refs:",
    formatList(normalizeList(evidenceRefs, "none supplied")),
    "promotion action: report-only",
    "",
  ].join("\n");
  return {
    candidate,
    trialPrompt,
    baselineOutcome,
    candidateOutcome,
    verdict: input.verdict,
    recommendation,
    reason,
    riskFlags,
    evidenceRefs,
    promotionAction: "report-only",
    ...(reportPath ? { reportPath } : {}),
    markdown,
  };
}
async function writeDreamingShadowTrialReport(input) {
  const report = buildDreamingShadowTrialReport(input);
  if (!report.reportPath)
    throw new Error("dreaming shadow trial report path could not be resolved");
  await fs.mkdir(path.dirname(report.reportPath), { recursive: true });
  await fs.writeFile(report.reportPath, report.markdown, "utf-8");
  return report;
}
//#endregion
export {
  buildDreamingShadowTrialReport,
  configureMemoryCoreDreamingState,
  dedupeDreamDiaryEntries,
  defaultDreamingShadowTrialReportPath,
  filterRecallEntriesWithinLookback,
  previewGroundedRemMarkdown,
  previewRemHarness,
  removeBackfillDiaryEntries,
  resolveDreamingShadowTrialRecommendation,
  writeBackfillDiaryEntries,
  writeDreamingShadowTrialReport,
};
