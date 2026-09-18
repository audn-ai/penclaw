import fs from "node:fs/promises";
import path from "node:path";
import {
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import "./agent-scope-y9xQv_q1.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { s as writeTextAtomic } from "./json-files-CTWRDHag.js";
import { t as note } from "./note-Uvqr4R1d.js";
import { h as shortenHomePath } from "./utils-DtcDeqWS.js";
import {
  b as resolveWorkspaceTemplateDir,
  r as DEFAULT_HEARTBEAT_FILENAME,
} from "./workspace-DXzCbuC0.js";
//#region src/commands/doctor-heartbeat-template-repair.ts
/** Doctor repair for HEARTBEAT.md files that accidentally contain docs template wrappers. */
const HEARTBEAT_TEMPLATE_CHECK_ID = "core/doctor/heartbeat-template";
const LEGACY_HEARTBEAT_PROSE_TEMPLATE = [
  "# HEARTBEAT.md",
  "Keep this file empty unless you want a tiny checklist. Keep it small.",
];
const LEGACY_HEARTBEAT_HEADING_FENCED_TEMPLATE = [
  "# HEARTBEAT.md Template",
  "```markdown",
  "# Keep this file empty (or with only comments) to skip heartbeat API calls.",
  "# Add tasks below when you want the agent to check something periodically.",
  "```",
];
const LEGACY_HEARTBEAT_FENCED_TEMPLATE = [
  "```markdown",
  "# Keep this file empty (or with only comments) to skip heartbeat API calls.",
  "# Add tasks below when you want the agent to check something periodically.",
  "```",
];
const LEGACY_HEARTBEAT_FENCED_RELATED_TEMPLATE = [
  "```markdown",
  "# Keep this file empty (or with only comments) to skip heartbeat API calls.",
  "# Add tasks below when you want the agent to check something periodically.",
  "```",
  "## Related",
  "- [Heartbeat config](/gateway/config-agents)",
];
const DOCS_HEARTBEAT_TEMPLATE_PAGE_AS_TEMPLATE = [
  "# HEARTBEAT.md template",
  "`HEARTBEAT.md` lives in the agent workspace. Keep the file empty, or with only Markdown comments and headings, when you want OpenClaw to skip heartbeat model calls.",
  "The default runtime template is:",
  "```markdown",
  "# Keep this file empty (or with only comments) to skip heartbeat API calls.",
  "# Add tasks below when you want the agent to check something periodically.",
  "```",
  "Add short tasks below the comments only when you want the agent to check something periodically. Keep heartbeat instructions small because they are read during recurring wakes.",
  "## Related",
  "- [Heartbeat config](/gateway/config-agents)",
];
const HEARTBEAT_DEFAULT_BODY_LINES = [
  "# Keep this file empty (or with only comments) to skip heartbeat API calls.",
  "# Add tasks below when you want the agent to check something periodically.",
];
const DIRTY_HEARTBEAT_DOC_WRAPPER_LINES = /* @__PURE__ */ new Set([
  "```markdown",
  "# HEARTBEAT.md Template",
  "# HEARTBEAT.md template",
  "- [Heartbeat config](/gateway/config-agents)",
]);
const KNOWN_DIRTY_HEARTBEAT_TEMPLATE_LINES = /* @__PURE__ */ new Set([
  "```markdown",
  "```",
  "# HEARTBEAT.md Template",
  "# HEARTBEAT.md template",
  "`HEARTBEAT.md` lives in the agent workspace. Keep the file empty, or with only Markdown comments and headings, when you want OpenClaw to skip heartbeat model calls.",
  "The default runtime template is:",
  "Add short tasks below the comments only when you want the agent to check something periodically. Keep heartbeat instructions small because they are read during recurring wakes.",
  ...LEGACY_HEARTBEAT_PROSE_TEMPLATE,
  "# Keep this file empty (or with only comments) to skip heartbeat API calls.",
  "# Add tasks below when you want the agent to check something periodically.",
  "## Related",
  "- [Heartbeat config](/gateway/config-agents)",
]);
const KNOWN_REPAIRABLE_DIRTY_HEARTBEAT_TEMPLATES = [
  LEGACY_HEARTBEAT_PROSE_TEMPLATE,
  LEGACY_HEARTBEAT_HEADING_FENCED_TEMPLATE,
  LEGACY_HEARTBEAT_FENCED_TEMPLATE,
  LEGACY_HEARTBEAT_FENCED_RELATED_TEMPLATE,
  DOCS_HEARTBEAT_TEMPLATE_PAGE_AS_TEMPLATE,
];
function linesEqual(left, right) {
  return left.length === right.length && left.every((line, index) => line === right[index]);
}
/** Classifies heartbeat template content as clean, repairable, or risky because it has user text. */
function analyzeHeartbeatTemplateForRepair(content) {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  if (KNOWN_REPAIRABLE_DIRTY_HEARTBEAT_TEMPLATES.some((template) => linesEqual(lines, template)))
    return { status: "dirty-template" };
  const hasDefaultTemplateBody = HEARTBEAT_DEFAULT_BODY_LINES.every((line) => lines.includes(line));
  const hasDirtyDocWrapper = lines.some((line) => DIRTY_HEARTBEAT_DOC_WRAPPER_LINES.has(line));
  const hasLegacyProseTemplate = LEGACY_HEARTBEAT_PROSE_TEMPLATE.every((line) =>
    lines.includes(line),
  );
  if ((!hasDefaultTemplateBody || !hasDirtyDocWrapper) && !hasLegacyProseTemplate)
    return { status: "clean" };
  return {
    status: "dirty-template-with-custom-content",
    customLines: lines.filter((line) => !KNOWN_DIRTY_HEARTBEAT_TEMPLATE_LINES.has(line)),
  };
}
async function readCleanHeartbeatTemplate() {
  const templateDir = await resolveWorkspaceTemplateDir();
  const templatePath = path.join(templateDir, DEFAULT_HEARTBEAT_FILENAME);
  return await fs.readFile(templatePath, "utf-8");
}
function heartbeatTemplateAnalysisToHealthFinding(heartbeatPath, analysis) {
  if (analysis.status === "dirty-template-with-custom-content")
    return {
      checkId: HEARTBEAT_TEMPLATE_CHECK_ID,
      severity: "warning",
      message:
        "HEARTBEAT.md contains an older heartbeat template wrapper plus custom or unrecognized content.",
      path: heartbeatPath,
      requirement: "legacy-template-with-custom-content",
      fixHint: "Remove the fenced template and Related lines manually if they are not intentional.",
    };
  return {
    checkId: HEARTBEAT_TEMPLATE_CHECK_ID,
    severity: "warning",
    message: "HEARTBEAT.md contains an older heartbeat documentation template.",
    path: heartbeatPath,
    requirement: "legacy-template",
    fixHint: 'Run "openclaw doctor --fix" to replace it with the clean heartbeat template.',
  };
}
/** Collects read-only structured findings for legacy HEARTBEAT.md template wrappers. */
async function collectHeartbeatTemplateHealthFindings(cfg, deps) {
  const workspaceDir = resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg));
  const heartbeatPath = path.join(workspaceDir, DEFAULT_HEARTBEAT_FILENAME);
  const readFile = deps?.readFile ?? ((filePath) => fs.readFile(filePath, "utf-8"));
  let content;
  try {
    content = await readFile(heartbeatPath);
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    return [
      {
        checkId: HEARTBEAT_TEMPLATE_CHECK_ID,
        severity: "warning",
        message: `Could not inspect HEARTBEAT.md: ${formatErrorMessage(error)}`,
        path: heartbeatPath,
        requirement: "inspect-failed",
        fixHint: "Check file permissions, then rerun doctor.",
      },
    ];
  }
  const analysis = analyzeHeartbeatTemplateForRepair(content);
  if (analysis.status === "clean") return [];
  return [heartbeatTemplateAnalysisToHealthFinding(heartbeatPath, analysis)];
}
/** Replaces known dirty heartbeat templates with the clean runtime template when repair is enabled. */
async function maybeRepairHeartbeatTemplate(params) {
  const workspaceDir = resolveAgentWorkspaceDir(params.cfg, resolveDefaultAgentId(params.cfg));
  const heartbeatPath = path.join(workspaceDir, DEFAULT_HEARTBEAT_FILENAME);
  let content;
  try {
    content = await fs.readFile(heartbeatPath, "utf-8");
  } catch (error) {
    if (error?.code === "ENOENT") return;
    note(
      `Could not inspect ${shortenHomePath(heartbeatPath)}: ${formatErrorMessage(error)}`,
      "Heartbeat template",
    );
    return;
  }
  const analysis = analyzeHeartbeatTemplateForRepair(content);
  if (analysis.status === "clean") return;
  if (analysis.status === "dirty-template-with-custom-content") {
    note(
      [
        `${shortenHomePath(heartbeatPath)} contains an older heartbeat template wrapper plus custom or unrecognized content.`,
        "Doctor left it unchanged so it does not delete user tasks. Remove the fenced template and Related lines manually if they are not intentional.",
      ].join("\n"),
      "Heartbeat template",
    );
    return;
  }
  if (!params.shouldRepair) {
    note(
      [
        `${shortenHomePath(heartbeatPath)} contains an older heartbeat documentation template.`,
        'Run "openclaw doctor --fix" to replace it with the clean heartbeat template.',
      ].join("\n"),
      "Heartbeat template",
    );
    return;
  }
  try {
    await writeTextAtomic(heartbeatPath, await readCleanHeartbeatTemplate(), { mode: 384 });
    note(
      `Replaced ${shortenHomePath(heartbeatPath)} with the clean heartbeat template.`,
      "Doctor changes",
    );
  } catch (error) {
    note(
      `Could not repair ${shortenHomePath(heartbeatPath)}: ${formatErrorMessage(error)}`,
      "Heartbeat template",
    );
  }
}
//#endregion
export { collectHeartbeatTemplateHealthFindings, maybeRepairHeartbeatTemplate };
