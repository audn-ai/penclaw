import { i as isJsonObject } from "./protocol-BMifTfdW.js";
import {
  c as summarizeCodexRateLimits,
  o as summarizeCodexAccountRateLimits,
  r as hasCodexRateLimitSnapshots,
} from "./rate-limits-CGMwC7L1.js";
//#region extensions/codex/src/command-formatters.ts
/** Formats the combined `/codex status` probe result. */
function formatCodexStatus(probes) {
  const lines = [
    `Codex app-server: ${probes.models.ok || probes.account.ok || probes.limits.ok || probes.mcps.ok || probes.skills.ok ? "connected" : "unavailable"}`,
  ];
  if (probes.models.ok)
    lines.push(
      `Models: ${
        probes.models.value.models
          .map((model) => formatCodexDisplayText(model.id))
          .slice(0, 8)
          .join(", ") || "none"
      }`,
    );
  else lines.push(`Models: ${formatCodexDisplayText(probes.models.error)}`);
  lines.push(
    `Account: ${probes.account.ok ? formatCodexAccountSummary(probes.account.value) : formatCodexDisplayText(probes.account.error)}`,
  );
  lines.push(
    `Rate limits: ${probes.limits.ok ? formatCodexRateLimitSummary(probes.limits.value) : formatCodexDisplayText(probes.limits.error)}`,
  );
  lines.push(
    `MCP servers: ${probes.mcps.ok ? summarizeArrayLike(probes.mcps.value) : formatCodexDisplayText(probes.mcps.error)}`,
  );
  lines.push(
    `Skills: ${probes.skills.ok ? summarizeCodexSkills(probes.skills.value) : formatCodexDisplayText(probes.skills.error)}`,
  );
  return lines.join("\n");
}
/** Formats Codex model-list results for `/codex models`. */
function formatModels(result) {
  if (result.models.length === 0) return "No Codex app-server models returned.";
  const lines = [
    "Codex models:",
    ...result.models.map(
      (model) => `- ${formatCodexDisplayText(model.id)}${model.isDefault ? " (default)" : ""}`,
    ),
  ];
  if (result.truncated) lines.push("- More models available; output truncated.");
  return lines.join("\n");
}
/** Formats Codex thread-list responses with safe resume hints. */
function formatThreads(response) {
  const threads = extractArray(response);
  if (threads.length === 0) return "No Codex threads returned.";
  return [
    "Codex threads:",
    ...threads.slice(0, 10).map((thread) => {
      const record = isJsonObject(thread) ? thread : {};
      const id = readString(record, "threadId") ?? readString(record, "id") ?? "<unknown>";
      const title =
        readString(record, "title") ?? readString(record, "name") ?? readString(record, "summary");
      const details = [
        readString(record, "model"),
        readString(record, "cwd"),
        readString(record, "updatedAt") ?? readString(record, "lastUpdatedAt"),
      ].filter((value) => Boolean(value));
      return `- ${formatCodexDisplayText(id)}${title ? ` - ${formatCodexDisplayText(title)}` : ""}${details.length > 0 ? ` (${details.map(formatCodexDisplayText).join(", ")})` : ""}\n  Resume: ${formatCodexResumeHint(id)}`;
    }),
  ].join("\n");
}
/** Formats account and rate-limit output for `/codex account`. */
function formatAccount(account, limits, authOverview) {
  if (authOverview) return formatAccountAuthOverview(authOverview);
  const formattedLimits = limits.ok
    ? formatCodexRateLimitDetails(limits.value)
    : formatCodexDisplayText(limits.error);
  const rateLimitBlock = formattedLimits.startsWith("Codex is ")
    ? formattedLimits
    : formattedLimits.includes("\n")
      ? `Rate limits:\n${formattedLimits}`
      : `Rate limits: ${formattedLimits}`;
  return [
    `Account: ${account.ok ? formatCodexAccountSummary(account.value) : formatCodexDisplayText(account.error)}`,
    rateLimitBlock,
  ].join("\n\n");
}
function formatAccountAuthOverview(overview) {
  const lines = [];
  if (overview.currentLine) lines.push(overview.currentLine, "");
  if (overview.subscriptionLabel) {
    lines.push(`Subscription  ${overview.subscriptionLabel}`);
    if (overview.subscriptionUsage) lines.push(`  ${overview.subscriptionUsage}`);
    lines.push("");
  }
  if (overview.rows.length > 0) {
    lines.push(overview.orderTitle);
    for (const [index, row] of overview.rows.entries())
      lines.push(`  ${index + 1}. ${row.label}   ${row.kind}   — ${formatAuthRowStatus(row)}`);
  }
  while (lines.at(-1) === "") lines.pop();
  return lines.map(formatCodexAccountLine).join("\n");
}
function formatAuthRowStatus(row) {
  return row.billingNote ? `${row.status} · ${row.billingNote}` : row.status;
}
/** Formats Codex Computer Use readiness and plugin/MCP availability. */
function formatComputerUseStatus(status) {
  const lines = [
    `Computer Use: ${status.ready ? "ready" : status.enabled ? "not ready" : "disabled"}`,
  ];
  lines.push(
    `Plugin: ${formatCodexDisplayText(status.pluginName)} (${computerUsePluginState(status)})`,
  );
  lines.push(
    `Installation: ${formatCodexDisplayText(status.installation.status)} (${status.installation.ok ? "ok" : "not ok"})`,
  );
  lines.push(
    `MCP server: ${formatCodexDisplayText(status.mcpServerName)}${status.mcpServerAvailable ? ` (${status.tools.length} tools)` : " (unavailable)"}`,
  );
  lines.push(
    `Exposure: ${formatCodexDisplayText(status.exposure.status)} (${status.exposure.ok ? "ok" : "not ok"})`,
  );
  lines.push(
    `Live test: ${formatCodexDisplayText(status.liveTest.status)} (${status.liveTest.attempted ? `${status.liveTest.attempts} attempt${status.liveTest.attempts === 1 ? "" : "s"}, ${status.liveTest.timeoutMs}ms` : "not run"})`,
  );
  if (status.liveTest.retried || status.liveTest.repaired)
    lines.push(
      `Live test recovery: retried=${status.liveTest.retried ? "yes" : "no"}, repaired=${status.liveTest.repaired ? "yes" : "no"}`,
    );
  if (status.marketplaceName)
    lines.push(`Marketplace: ${formatCodexDisplayText(status.marketplaceName)}`);
  if (status.tools.length > 0)
    lines.push(`Tools: ${status.tools.slice(0, 8).map(formatCodexDisplayText).join(", ")}`);
  for (const warning of status.warnings) lines.push(`Warning: ${formatCodexDisplayText(warning)}`);
  lines.push(formatCodexDisplayText(status.message));
  return lines.join("\n");
}
function computerUsePluginState(status) {
  if (!status.installed) return "not installed";
  return status.pluginEnabled ? "installed" : "installed, disabled";
}
/** Formats generic array-like Codex app-server responses. */
function formatList(response, label) {
  const entries = extractArray(response);
  if (entries.length === 0) return `${label}: none returned.`;
  return [
    `${label}:`,
    ...entries.slice(0, 25).map((entry) => {
      const record = isJsonObject(entry) ? entry : {};
      return `- ${formatCodexDisplayText(readString(record, "name") ?? readString(record, "id") ?? JSON.stringify(entry))}`;
    }),
  ].join("\n");
}
/** Formats Codex skills grouped by scope, omitting disabled entries. */
function formatSkills(response) {
  const groups = isJsonObject(response) && Array.isArray(response.data) ? response.data : [];
  if (groups.length === 0) return "Codex skills: none returned.";
  const lines = ["Codex skills:"];
  let renderedSkills = 0;
  let loadErrors = 0;
  for (const group of groups) {
    const record = isJsonObject(group) ? group : {};
    if (Array.isArray(record.errors)) loadErrors += record.errors.length;
    const skills = Array.isArray(record.skills) ? record.skills : [];
    if (skills.length === 0) continue;
    for (const skill of skills) {
      if (isJsonObject(skill) && skill.enabled === false) continue;
      lines.push(`- ${formatCodexSkillEntry(skill)}`);
      renderedSkills += 1;
    }
  }
  if (renderedSkills === 0) {
    if (loadErrors > 0)
      return `Codex skills: none returned (${loadErrors} load ${loadErrors === 1 ? "error" : "errors"}).`;
    return "Codex skills: none returned.";
  }
  return lines.join("\n");
}
function formatCodexSkillEntry(entry) {
  return `\`${formatCodexDisplayText(readString(isJsonObject(entry) ? entry : {}, "name") ?? "<unknown>")}\``;
}
const CODEX_RESUME_SAFE_THREAD_ID_PATTERN = /^[A-Za-z0-9._:-]+$/;
function formatCodexResumeHint(threadId) {
  const safe = formatCodexTextForDisplay(threadId);
  if (!CODEX_RESUME_SAFE_THREAD_ID_PATTERN.test(safe))
    return "copy the thread id above and run /codex resume <thread-id>";
  return `/codex resume ${safe}`;
}
/** Escapes Codex-originated text so it is safe to render in chat command output. */
function formatCodexDisplayText(value) {
  return escapeCodexChatText(formatCodexTextForDisplay(value));
}
function formatCodexAccountSummary(value) {
  const safe = formatCodexTextForDisplay(summarizeAccount(value));
  return isLikelyEmailAddress(safe)
    ? escapeCodexChatTextPreservingAt(safe)
    : escapeCodexChatText(safe);
}
function formatCodexTextForDisplay(value) {
  return sanitizeCodexTextForDisplay(value).trim() || "<unknown>";
}
function sanitizeCodexTextForDisplay(value) {
  let safe = "";
  for (const character of value) {
    const codePoint = character.codePointAt(0);
    safe += codePoint != null && isUnsafeDisplayCodePoint(codePoint) ? "?" : character;
  }
  return safe;
}
function escapeCodexChatText(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("@", "＠")
    .replaceAll("`", "｀")
    .replaceAll("[", "［")
    .replaceAll("]", "］")
    .replaceAll("(", "（")
    .replaceAll(")", "）")
    .replaceAll("*", "∗")
    .replaceAll("_", "＿")
    .replaceAll("~", "～")
    .replaceAll("|", "｜");
}
function escapeCodexChatTextPreservingAt(value) {
  return escapeCodexChatText(value).replaceAll("＠", "@");
}
function formatCodexAccountLine(value) {
  if (value === "") return "";
  const safe = sanitizeCodexTextForDisplay(value).trimEnd();
  if (!safe.trim()) return "";
  const emailPattern = /[^\s@<>()[\]`]+@[^\s@<>()[\]`]+\.[^\s@<>()[\]`]+/gu;
  let formatted = "";
  let lastIndex = 0;
  for (const match of safe.matchAll(emailPattern)) {
    const index = match.index ?? 0;
    formatted += escapeCodexChatText(safe.slice(lastIndex, index));
    formatted += escapeCodexChatTextPreservingAt(match[0]);
    lastIndex = index + match[0].length;
  }
  formatted += escapeCodexChatText(safe.slice(lastIndex));
  return formatted;
}
function isLikelyEmailAddress(value) {
  return /^[^\s@<>()[\]`]+@[^\s@<>()[\]`]+\.[^\s@<>()[\]`]+$/.test(value);
}
function isUnsafeDisplayCodePoint(codePoint) {
  return (
    codePoint <= 31 ||
    (codePoint >= 127 && codePoint <= 159) ||
    codePoint === 173 ||
    codePoint === 1564 ||
    codePoint === 6158 ||
    (codePoint >= 8203 && codePoint <= 8207) ||
    (codePoint >= 8234 && codePoint <= 8238) ||
    (codePoint >= 8288 && codePoint <= 8303) ||
    codePoint === 65279 ||
    (codePoint >= 65529 && codePoint <= 65531) ||
    (codePoint >= 917504 && codePoint <= 917631)
  );
}
/** Builds the portable `/codex` command help text. */
function buildHelp() {
  return [
    "Codex commands:",
    "- /codex status",
    "- /codex models",
    "- /codex threads [filter]",
    "- /codex sessions --host <node> [filter]",
    "- /codex resume <thread-id>",
    "- /codex resume <session-id> --host <node> --bind here",
    "- /codex bind [thread-id] [--cwd <path>] [--model <model>] [--provider <provider>]",
    "- /codex binding",
    "- /codex stop",
    "- /codex steer <message>",
    "- /codex model [model]",
    "- /codex fast [on|off|status]",
    "- /codex permissions [default|yolo|status]",
    "- /codex detach",
    "- /codex compact",
    "- /codex review",
    "- /codex diagnostics [note]",
    "- /codex computer-use [status|install]",
    "- /codex account",
    "- /codex mcp",
    "- /codex skills",
    "- /codex plugins [list|enable|disable]",
  ].join("\n");
}
function summarizeAccount(value) {
  if (!isJsonObject(value)) return "unavailable";
  const account = isJsonObject(value.account) ? value.account : value;
  if (readString(account, "type") === "amazonBedrock") return "Amazon Bedrock";
  return (
    readString(account, "email") ??
    readString(account, "accountEmail") ??
    readString(account, "planType") ??
    readString(account, "id") ??
    "available"
  );
}
function summarizeArrayLike(value) {
  const entries = extractArray(value);
  if (entries.length === 0) return "none returned";
  return `${entries.length}`;
}
function summarizeCodexSkills(value) {
  const groups = isJsonObject(value) && Array.isArray(value.data) ? value.data : [];
  if (groups.length === 0) return "none returned";
  let enabledSkills = 0;
  let loadErrors = 0;
  for (const group of groups) {
    if (!isJsonObject(group)) continue;
    if (Array.isArray(group.errors)) loadErrors += group.errors.length;
    if (!Array.isArray(group.skills)) continue;
    enabledSkills += group.skills.filter(
      (skill) => !isJsonObject(skill) || skill.enabled !== false,
    ).length;
  }
  if (enabledSkills > 0) return `${enabledSkills}`;
  if (loadErrors > 0)
    return `none returned (${loadErrors} load ${loadErrors === 1 ? "error" : "errors"})`;
  return "none returned";
}
function formatCodexRateLimitSummary(value) {
  const summary = summarizeCodexRateLimits(value);
  if (summary) return formatCodexDisplayText(summary);
  return formatCodexDisplayText(
    hasCodexRateLimitSnapshots(value) ? "none returned" : summarizeRateLimits(value),
  );
}
function formatCodexRateLimitDetails(value) {
  const lines = summarizeCodexAccountRateLimits(value);
  if (!lines)
    return formatCodexDisplayText(
      hasCodexRateLimitSnapshots(value) ? "none returned" : summarizeRateLimits(value),
    );
  return lines.map(formatCodexDisplayText).join("\n");
}
function summarizeRateLimits(value) {
  const entries = extractArray(value);
  if (entries.length > 0) {
    const count = entries.filter(isMeaningfulRateLimitSnapshot).length;
    return count > 0 ? `${count}` : "none returned";
  }
  if (!isJsonObject(value)) return "none returned";
  const keyed = value.rateLimitsByLimitId;
  if (isJsonObject(keyed)) {
    const count = Object.values(keyed).filter(isMeaningfulRateLimitSnapshot).length;
    if (count > 0) return `${count}`;
  }
  return isMeaningfulRateLimitSnapshot(value.rateLimits) ? "1" : "none returned";
}
function isMeaningfulRateLimitSnapshot(value) {
  if (!isJsonObject(value)) return false;
  if (readString(value, "rateLimitReachedType") ?? readString(value, "rate_limit_reached_type"))
    return true;
  return ["primary", "secondary"].some((key) => {
    const window = value[key];
    return isJsonObject(window) && Object.values(window).some((entry) => entry != null);
  });
}
function extractArray(value) {
  if (Array.isArray(value)) return value;
  if (!isJsonObject(value)) return [];
  for (const key of ["data", "items", "threads", "models", "skills", "servers", "rateLimits"]) {
    const child = value[key];
    if (Array.isArray(child)) return child;
  }
  return [];
}
/** Reads and trims a non-empty string field from a JSON object. */
function readString(record, key) {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
//#endregion
export {
  formatComputerUseStatus as a,
  formatSkills as c,
  formatCodexStatus as i,
  formatThreads as l,
  formatAccount as n,
  formatList as o,
  formatCodexDisplayText as r,
  formatModels as s,
  buildHelp as t,
  readString as u,
};
