import { t as sanitizeTerminalText } from "./safe-text-DiGQuw-e.js";
//#region src/config/issue-format.ts
/** Normalize missing or blank config issue paths to the root marker used in CLI output. */
function normalizeConfigIssuePath(path) {
  if (typeof path !== "string") return "<root>";
  const trimmed = path.trim();
  return trimmed ? trimmed : "<root>";
}
/** Return the public config issue shape with a normalized path and non-empty allowed values. */
function normalizeConfigIssue(issue) {
  const hasAllowedValues = Array.isArray(issue.allowedValues) && issue.allowedValues.length > 0;
  return {
    path: normalizeConfigIssuePath(issue.path),
    message: issue.message,
    ...(hasAllowedValues ? { allowedValues: issue.allowedValues } : {}),
    ...(hasAllowedValues &&
    typeof issue.allowedValuesHiddenCount === "number" &&
    issue.allowedValuesHiddenCount > 0
      ? { allowedValuesHiddenCount: issue.allowedValuesHiddenCount }
      : {}),
  };
}
/** Normalize a batch of config validation issues for display or JSON output. */
function normalizeConfigIssues(issues) {
  return issues.map((issue) => normalizeConfigIssue(issue));
}
function resolveIssuePathForLine(path, opts) {
  if (opts?.normalizeRoot) return normalizeConfigIssuePath(path);
  return typeof path === "string" ? path : "";
}
/**
 * Format one config issue for terminal output.
 * Path and message are sanitized because issues can include user-edited config text.
 */
function formatConfigIssueLine(issue, marker = "-", opts) {
  return `${marker ? `${marker} ` : ""}${sanitizeTerminalText(resolveIssuePathForLine(issue.path, opts))}: ${sanitizeTerminalText(issue.message)}`;
}
/** Format config issues as terminal-safe lines with a shared marker prefix. */
function formatConfigIssueLines(issues, marker = "-", opts) {
  return issues.map((issue) => formatConfigIssueLine(issue, marker, opts));
}
/** Build a compact, terminal-safe issue summary for logs and recovery diagnostics. */
function formatConfigIssueSummary(issues, opts = {}) {
  if (issues.length === 0) return null;
  const maxIssueCandidate = Math.floor(opts.maxIssues ?? 5);
  const maxIssues = Number.isFinite(maxIssueCandidate) ? Math.max(1, maxIssueCandidate) : 5;
  const visibleIssues = issues.slice(0, maxIssues);
  const lines = formatConfigIssueLines(visibleIssues, "", {
    normalizeRoot: opts.normalizeRoot ?? true,
  });
  const hiddenIssueCount = issues.length - visibleIssues.length;
  if (hiddenIssueCount <= 0) return lines.join("; ");
  return `${lines.join("; ")}; and ${hiddenIssueCount} more`;
}
//#endregion
export {
  normalizeConfigIssues as i,
  formatConfigIssueLines as n,
  formatConfigIssueSummary as r,
  formatConfigIssueLine as t,
};
