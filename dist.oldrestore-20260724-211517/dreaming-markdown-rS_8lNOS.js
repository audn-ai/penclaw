import fs from "node:fs/promises";
import "./memory-core-host-status-BYxFcXad.js";
import path from "node:path";
import "./memory-host-events-1465bDCf.js";
import { H as formatMemoryDreamingDay } from "./dreaming-CM8RB1ct.js";
import { r as updateDeepDreamsFile } from "./dreaming-dreams-file-EoVR0tdX.js";
import { n as appendMemoryHostEvent } from "./events-B-Dr_eF7.js";
import {
  n as withTrailingNewline,
  t as replaceManagedMarkdownBlock,
} from "./memory-host-markdown-mHNl3RAL.js";
import { n as resolveMemoryCoreTimestamp, t as resolveMemoryCoreNowMs } from "./time-ngD8glCa.js";
//#region extensions/memory-core/src/dreaming-markdown.ts
const DAILY_PHASE_HEADINGS = {
  light: "## Light Sleep",
  rem: "## REM Sleep",
};
const DAILY_PHASE_LABELS = {
  light: "light",
  rem: "rem",
};
function resolvePhaseMarkers(phase) {
  const label = DAILY_PHASE_LABELS[phase];
  return {
    start: `<!-- openclaw:dreaming:${label}:start -->`,
    end: `<!-- openclaw:dreaming:${label}:end -->`,
  };
}
function resolveDailyMemoryPath(workspaceDir, epochMs, timezone) {
  const isoDay = formatMemoryDreamingDay(epochMs, timezone);
  return path.join(workspaceDir, "memory", `${isoDay}.md`);
}
function resolveSeparateReportPath(workspaceDir, phase, epochMs, timezone) {
  const isoDay = formatMemoryDreamingDay(epochMs, timezone);
  return path.join(workspaceDir, "memory", "dreaming", phase, `${isoDay}.md`);
}
function shouldWriteInline(storage) {
  return storage.mode === "inline" || storage.mode === "both";
}
function shouldWriteSeparate(storage) {
  return storage.mode === "separate" || storage.mode === "both" || storage.separateReports;
}
async function writeDailyDreamingPhaseBlock(params) {
  const nowMs = resolveMemoryCoreNowMs(params.nowMs);
  const body = params.bodyLines.length > 0 ? params.bodyLines.join("\n") : "- No notable updates.";
  let inlinePath;
  let reportPath;
  if (shouldWriteInline(params.storage)) {
    inlinePath = resolveDailyMemoryPath(params.workspaceDir, nowMs, params.timezone);
    await fs.mkdir(path.dirname(inlinePath), { recursive: true });
    const original = await fs.readFile(inlinePath, "utf-8").catch((err) => {
      if (err?.code === "ENOENT") return "";
      throw err;
    });
    const markers = resolvePhaseMarkers(params.phase);
    const updated = replaceManagedMarkdownBlock({
      original,
      heading: DAILY_PHASE_HEADINGS[params.phase],
      startMarker: markers.start,
      endMarker: markers.end,
      body,
    });
    await fs.writeFile(inlinePath, withTrailingNewline(updated), "utf-8");
  }
  if (shouldWriteSeparate(params.storage)) {
    reportPath = resolveSeparateReportPath(
      params.workspaceDir,
      params.phase,
      nowMs,
      params.timezone,
    );
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    const report = [
      `# ${params.phase === "light" ? "Light Sleep" : "REM Sleep"}`,
      "",
      body,
      "",
    ].join("\n");
    await fs.writeFile(reportPath, report, "utf-8");
  }
  await appendMemoryHostEvent(params.workspaceDir, {
    type: "memory.dream.completed",
    timestamp: resolveMemoryCoreTimestamp(nowMs),
    phase: params.phase,
    outcome: "completed",
    ...(inlinePath ? { inlinePath } : {}),
    ...(reportPath ? { reportPath } : {}),
    lineCount: params.bodyLines.length,
    storageMode: params.storage.mode,
  });
  return {
    ...(inlinePath ? { inlinePath } : {}),
    ...(reportPath ? { reportPath } : {}),
  };
}
async function writeDeepDreamingReport(params) {
  const nowMs = resolveMemoryCoreNowMs(params.nowMs);
  const body = params.bodyLines.length > 0 ? params.bodyLines.join("\n") : "- No durable changes.";
  const inlinePath = await updateDeepDreamsFile({
    workspaceDir: params.workspaceDir,
    bodyLines: params.bodyLines,
  });
  let reportPath;
  if (shouldWriteSeparate(params.storage)) {
    reportPath = resolveSeparateReportPath(params.workspaceDir, "deep", nowMs, params.timezone);
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, `# Deep Sleep\n\n${body}\n`, "utf-8");
  }
  await appendMemoryHostEvent(params.workspaceDir, {
    type: "memory.dream.completed",
    timestamp: resolveMemoryCoreTimestamp(nowMs),
    phase: "deep",
    outcome: "completed",
    inlinePath,
    ...(reportPath ? { reportPath } : {}),
    lineCount: params.bodyLines.length,
    storageMode: params.storage.mode,
  });
  return reportPath;
}
//#endregion
export { writeDeepDreamingReport as n, writeDailyDreamingPhaseBlock as t };
