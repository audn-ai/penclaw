//#region packages/workboard-contract/src/index.ts
const WORKBOARD_STATUSES = [
  "triage",
  "backlog",
  "todo",
  "scheduled",
  "ready",
  "running",
  "review",
  "blocked",
  "done",
];
const WORKBOARD_PRIORITIES = ["low", "normal", "high", "urgent"];
const WORKBOARD_EXECUTION_ENGINES = ["codex", "claude"];
const WORKBOARD_EXECUTION_MODES = ["autonomous", "manual"];
const WORKBOARD_EXECUTION_STATUSES = ["idle", "running", "review", "blocked", "done"];
const WORKBOARD_EVENT_KINDS = [
  "created",
  "edited",
  "moved",
  "linked",
  "specified",
  "decomposed",
  "claimed",
  "heartbeat",
  "execution_updated",
  "attempt_started",
  "attempt_updated",
  "comment_added",
  "link_added",
  "proof_added",
  "artifact_added",
  "attachment_added",
  "diagnostic",
  "notification",
  "dispatch",
  "orchestration",
  "protocol_violation",
  "archived",
  "unarchived",
  "stale",
];
const WORKBOARD_ATTEMPT_STATUSES = ["running", "succeeded", "failed", "blocked", "stopped"];
const WORKBOARD_LINK_TYPES = ["parent", "child", "blocks", "blocked_by", "relates_to"];
const WORKBOARD_PROOF_STATUSES = ["passed", "failed", "skipped", "unknown"];
const WORKBOARD_TEMPLATE_IDS = ["bugfix", "docs", "release", "pr_review", "plugin"];
const WORKBOARD_DIAGNOSTIC_KINDS = [
  "stranded_ready",
  "running_without_heartbeat",
  "blocked_too_long",
  "repeated_failures",
  "missing_proof",
  "orphaned_session",
];
const WORKBOARD_DIAGNOSTIC_SEVERITIES = ["warning", "error", "critical"];
const WORKBOARD_NOTIFICATION_KINDS = ["completed", "failed", "stale"];
//#endregion
export {
  WORKBOARD_EXECUTION_ENGINES as a,
  WORKBOARD_LINK_TYPES as c,
  WORKBOARD_PROOF_STATUSES as d,
  WORKBOARD_STATUSES as f,
  WORKBOARD_EVENT_KINDS as i,
  WORKBOARD_NOTIFICATION_KINDS as l,
  WORKBOARD_DIAGNOSTIC_KINDS as n,
  WORKBOARD_EXECUTION_MODES as o,
  WORKBOARD_TEMPLATE_IDS as p,
  WORKBOARD_DIAGNOSTIC_SEVERITIES as r,
  WORKBOARD_EXECUTION_STATUSES as s,
  WORKBOARD_ATTEMPT_STATUSES as t,
  WORKBOARD_PRIORITIES as u,
};
