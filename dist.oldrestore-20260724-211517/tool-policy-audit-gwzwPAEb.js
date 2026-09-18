import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { m as normalizeToolName, p as normalizeToolList } from "./tool-policy-1QHiwXPv.js";
import { n as isToolAllowedByPolicyName } from "./tool-policy-match-Bq6mIgOa.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/agents/tool-policy-audit.ts
/**
 * Tool policy audit logging helpers.
 * Emits bounded, sanitized logs when allow/deny policy filters remove tools or
 * block sandbox tool execution.
 */
const MAX_AUDIT_TOOL_NAMES = 50;
const MAX_AUDIT_FIELD_LENGTH = 160;
const toolPolicyAuditLogger = createSubsystemLogger("agents/tool-policy");
function toolPolicyRuleKind(policy) {
  const hasAllow = Array.isArray(policy.allow) && policy.allow.length > 0;
  const hasDeny = Array.isArray(policy.deny) && policy.deny.length > 0;
  if (hasAllow && hasDeny) return "allow+deny";
  if (hasDeny) return "deny";
  if (hasAllow) return "allow";
  return "unknown";
}
function normalizedToolNames(tools) {
  return normalizeToolList(tools.map((tool) => tool.name));
}
function removedToolNamesByRule(params) {
  const remainingCounts = /* @__PURE__ */ new Map();
  for (const name of normalizedToolNames(params.after))
    remainingCounts.set(name, (remainingCounts.get(name) ?? 0) + 1);
  const removed = /* @__PURE__ */ new Map();
  for (const name of normalizedToolNames(params.before)) {
    const remaining = remainingCounts.get(name) ?? 0;
    if (remaining > 0) {
      remainingCounts.set(name, remaining - 1);
      continue;
    }
    const ruleKind = removedToolRuleKind(name, params.policy);
    const names = removed.get(ruleKind) ?? /* @__PURE__ */ new Set();
    names.add(name);
    removed.set(ruleKind, names);
  }
  return new Map([...removed].map(([ruleKind, names]) => [ruleKind, [...names].toSorted()]));
}
function removedToolRuleKind(toolName, policy) {
  if (
    Array.isArray(policy.deny) &&
    policy.deny.length > 0 &&
    !isToolAllowedByPolicyName(toolName, { deny: policy.deny })
  )
    return "deny";
  if (Array.isArray(policy.allow) && policy.allow.length > 0) return "allow";
  return toolPolicyRuleKind(policy);
}
function matchedPolicyRuleForTool(params) {
  if (params.ruleKind === "deny" && Array.isArray(params.policy.deny))
    return params.policy.deny.find(
      (entry) => !isToolAllowedByPolicyName(params.toolName, { deny: [entry] }),
    );
}
function labelForRuleKind(stepLabel, ruleKind) {
  if (ruleKind !== "deny") return stepLabel;
  if (stepLabel.includes(".allow")) return stepLabel.replaceAll(".allow", ".deny");
  if (/\ballow\b/u.test(stepLabel)) return stepLabel.replace(/\ballow\b/u, "deny");
  return `${stepLabel}.deny`;
}
function boundedToolNames(names) {
  const sanitizedNames = names.map(sanitizeAuditField);
  if (names.length <= MAX_AUDIT_TOOL_NAMES)
    return {
      toolNames: sanitizedNames,
      truncated: false,
    };
  return {
    toolNames: sanitizedNames.slice(0, MAX_AUDIT_TOOL_NAMES),
    truncated: true,
  };
}
/** Escapes control characters as visible sequences for single-line audit/log output. */
function escapeControlCharsVisible(value) {
  return Array.from(value, (char) => {
    if (char === "\n") return "\\n";
    if (char === "\r") return "\\r";
    if (char === "	") return "\\t";
    const codePoint = char.codePointAt(0) ?? 0;
    if (codePoint < 32 || codePoint === 127) return `\\x${codePoint.toString(16).padStart(2, "0")}`;
    return char;
  }).join("");
}
function sanitizeAuditField(value) {
  const sanitized = escapeControlCharsVisible(value.trim());
  if (!sanitized) return "(unknown)";
  if (sanitized.length <= MAX_AUDIT_FIELD_LENGTH) return sanitized;
  return `${truncateUtf16Safe(sanitized, MAX_AUDIT_FIELD_LENGTH)}...`;
}
function matchedPolicyRules(params) {
  const rules = /* @__PURE__ */ new Set();
  for (const toolName of params.tools) {
    const rule = matchedPolicyRuleForTool({
      toolName,
      policy: params.policy,
      ruleKind: params.ruleKind,
    });
    if (rule) rules.add(sanitizeAuditField(rule));
  }
  return [...rules].toSorted();
}
/** Log tools removed by an allow/deny policy filter step. */
function auditToolPolicyFilter(params) {
  const removedByRule = removedToolNamesByRule({
    policy: params.policy,
    before: params.before,
    after: params.after,
  });
  for (const [ruleKind, removed] of removedByRule) {
    if (removed.length === 0) continue;
    const rule = sanitizeAuditField(labelForRuleKind(params.stepLabel, ruleKind));
    const { toolNames, truncated } = boundedToolNames(removed);
    const matchedRuleSourceTools = removed.slice(0, MAX_AUDIT_TOOL_NAMES);
    const matchedRules = matchedPolicyRules({
      policy: params.policy,
      ruleKind,
      tools: matchedRuleSourceTools,
    });
    const matchedRuleSuffix = matchedRules.length > 0 ? `; matched ${matchedRules.join(", ")}` : "";
    const message = `tool policy removed ${removed.length} tool(s) via ${rule}: ${toolNames.join(", ")}${matchedRuleSuffix}`;
    const metadata = {
      rule,
      ruleKind,
      ...(matchedRules.length > 0
        ? {
            matchedRules,
            ...(truncated ? { matchedRulesTruncated: true } : {}),
          }
        : {}),
      removedToolCount: removed.length,
      removedTools: toolNames,
      removedToolsTruncated: truncated,
    };
    if (params.logLevel === "debug") toolPolicyAuditLogger.debug(message, metadata);
    else toolPolicyAuditLogger.info(message, metadata);
  }
}
/** Log a sandbox tool blocked by policy before execution. */
function auditSandboxToolPolicyBlock(params) {
  const normalizedToolName = normalizeToolName(params.toolName);
  if (!normalizedToolName) return;
  const toolName = sanitizeAuditField(normalizedToolName);
  const configKey = sanitizeAuditField(params.configKey);
  const matchedRule =
    params.policy && params.ruleType === "deny"
      ? matchedPolicyRuleForTool({
          toolName: normalizedToolName,
          policy: params.policy,
          ruleKind: "deny",
        })
      : void 0;
  const sanitizedMatchedRule = matchedRule ? sanitizeAuditField(matchedRule) : void 0;
  const matchedRuleSuffix = sanitizedMatchedRule ? `; matched ${sanitizedMatchedRule}` : "";
  toolPolicyAuditLogger.info(
    `sandbox tool policy blocked ${toolName} via ${configKey}${matchedRuleSuffix}`,
    {
      tool: toolName,
      ruleKind: params.ruleType,
      ruleSource: params.ruleSource,
      configKey,
      ...(sanitizedMatchedRule ? { matchedRule: sanitizedMatchedRule } : {}),
      sandboxMode: params.mode,
    },
  );
}
//#endregion
export {
  auditToolPolicyFilter as n,
  escapeControlCharsVisible as r,
  auditSandboxToolPolicyBlock as t,
};
