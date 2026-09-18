import { v as resolveSessionAgentId } from "./agent-scope-y9xQv_q1.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { i as resolveSandboxConfigForAgent } from "./config-l1rpbjvM.js";
import {
  n as canonicalizeMainSessionAlias,
  r as resolveAgentMainSessionKey,
} from "./main-session-nrmKYo2W.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import {
  r as escapeControlCharsVisible,
  t as auditSandboxToolPolicyBlock,
} from "./tool-policy-audit-gwzwPAEb.js";
import {
  r as resolveSandboxToolPolicyForAgent,
  t as classifyToolAgainstSandboxToolPolicy,
} from "./tool-policy-fLngst7L.js";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/agents/sandbox/runtime-status.ts
/**
 * Sandbox runtime status and tool-policy diagnostics.
 *
 * Resolves whether a session is sandboxed and explains policy blocks before tool execution.
 */
function shouldSandboxSession(cfg, sessionKey, mainSessionKey) {
  if (cfg.mode === "off") return false;
  if (cfg.mode === "all") return true;
  return sessionKey.trim() !== mainSessionKey.trim();
}
function resolveMainSessionKeyForSandbox(params) {
  if (params.cfg?.session?.scope === "global") return "global";
  return resolveAgentMainSessionKey({
    cfg: params.cfg,
    agentId: params.agentId,
  });
}
function resolveComparableSessionKeyForSandbox(params) {
  return canonicalizeMainSessionAlias({
    cfg: params.cfg,
    agentId: params.agentId,
    sessionKey: params.sessionKey,
  });
}
/** Resolves sandbox mode, effective session scope, and tool policy for a session. */
function resolveSandboxRuntimeStatus(params) {
  const sessionKey = params.sessionKey?.trim() ?? "";
  const agentId = resolveSessionAgentId({
    sessionKey,
    config: params.cfg,
    agentId: params.agentId,
  });
  const cfg = params.cfg;
  const sandboxCfg = resolveSandboxConfigForAgent(cfg, agentId);
  const mainSessionKey = resolveMainSessionKeyForSandbox({
    cfg,
    agentId,
  });
  const sandboxed = sessionKey
    ? shouldSandboxSession(
        sandboxCfg,
        resolveComparableSessionKeyForSandbox({
          cfg,
          agentId,
          sessionKey,
        }),
        mainSessionKey,
      )
    : false;
  return {
    agentId,
    sessionKey,
    mainSessionKey,
    mode: sandboxCfg.mode,
    sandboxed,
    toolPolicy: resolveSandboxToolPolicyForAgent(cfg, agentId),
  };
}
function sanitizeForSingleLineDisplay(value) {
  return escapeControlCharsVisible(value);
}
function hasUnsafeControlChars(value) {
  return Array.from(value).some((char) => {
    const codePoint = char.codePointAt(0) ?? 0;
    return codePoint < 32 || codePoint === 127;
  });
}
function redactSessionKey(value) {
  const trimmed = value.trim();
  if (!trimmed) return "(unknown)";
  if (trimmed.length <= 12) return "(redacted)";
  return `${sanitizeForSingleLineDisplay(truncateUtf16Safe(trimmed, 6))}…${sanitizeForSingleLineDisplay(sliceUtf16Safe(trimmed, -6))}`;
}
function shellEscapeSingleArg(value) {
  return `'${value.replaceAll("'", `'\\''`)}'`;
}
/** Formats the user-facing denial message when sandbox tool policy blocks a tool. */
function formatSandboxToolPolicyBlockedMessage(params) {
  const tool = normalizeOptionalLowercaseString(params.toolName);
  if (!tool) return;
  const runtime = resolveSandboxRuntimeStatus({
    cfg: params.cfg,
    sessionKey: params.sessionKey,
  });
  if (!runtime.sandboxed) return;
  const { blockedByDeny, blockedByAllow } = classifyToolAgainstSandboxToolPolicy(
    tool,
    runtime.toolPolicy,
  );
  if (!blockedByDeny && !blockedByAllow) return;
  const blockingSource = blockedByDeny
    ? runtime.toolPolicy.sources.deny
    : runtime.toolPolicy.sources.allow;
  if (params.audit === true)
    auditSandboxToolPolicyBlock({
      toolName: tool,
      ruleType: blockedByDeny ? "deny" : "allow",
      ruleSource: blockingSource.source,
      configKey: blockingSource.key,
      policy: runtime.toolPolicy,
      mode: runtime.mode,
    });
  const reasons = [];
  const fixes = [];
  if (blockedByDeny) {
    reasons.push("deny list");
    fixes.push(`Remove "${tool}" from ${runtime.toolPolicy.sources.deny.key}.`);
  }
  if (blockedByAllow) {
    reasons.push("allow list");
    fixes.push(
      `Add "${tool}" to ${runtime.toolPolicy.sources.allow.key} (or set it to [] to allow all).`,
    );
  }
  const lines = [];
  lines.push(`Tool "${tool}" blocked by sandbox tool policy (mode=${runtime.mode}).`);
  lines.push(`Session: ${redactSessionKey(runtime.sessionKey)}`);
  lines.push(`Reason: ${reasons.join(" + ")}`);
  lines.push("Fix:");
  lines.push(`- agents.defaults.sandbox.mode=off (disable sandbox)`);
  for (const fix of fixes) lines.push(`- ${fix}`);
  if (runtime.mode === "non-main")
    lines.push("- Use the agent main session instead of a non-main session.");
  const explainCommand = runtime.sessionKey
    ? hasUnsafeControlChars(runtime.sessionKey)
      ? `openclaw sandbox explain --agent ${runtime.agentId}`
      : `openclaw sandbox explain --session ${shellEscapeSingleArg(runtime.sessionKey)}`
    : "openclaw sandbox explain";
  lines.push(`- See: ${formatCliCommand(explainCommand)}`);
  return lines.join("\n");
}
//#endregion
export { resolveSandboxRuntimeStatus as n, formatSandboxToolPolicyBlockedMessage as t };
