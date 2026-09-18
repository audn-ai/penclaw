import crypto from "node:crypto";
import { r as normalizeCliSessionReseedReceipt } from "./cli-session-binding-CfY4fqsE.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/agents/cli-session.ts
/**
 * CLI session persistence helpers.
 * Keeps provider-keyed session bindings, reuse fingerprints, and legacy
 * Claude CLI state in one normalized session-store contract.
 */
const CLAUDE_CLI_BACKEND_ID = "claude-cli";
/** Hash CLI session-sensitive text so reuse checks can compare stable fingerprints. */
function hashCliSessionText(value) {
  const trimmed = normalizeOptionalString(value);
  if (!trimmed) return;
  return crypto.createHash("sha256").update(trimmed).digest("hex");
}
/** Store a reusable CLI session ID without extra reuse guards. */
function setCliSessionId(entry, provider, sessionId) {
  setCliSessionBinding(entry, provider, { sessionId });
}
/** Store a CLI session binding and mirror it to legacy/simple session-id fields. */
function setCliSessionBinding(entry, provider, binding) {
  const normalized = normalizeProviderId(provider);
  const trimmed = binding.sessionId.trim();
  if (!trimmed) return;
  const previousBinding = entry.cliSessionBindings?.[normalized];
  const previousReceipt =
    normalizeOptionalString(previousBinding?.sessionId) === trimmed
      ? normalizeCliSessionReseedReceipt(previousBinding?.reseedReceipt)
      : void 0;
  const reseedReceipt = normalizeCliSessionReseedReceipt(binding.reseedReceipt) ?? previousReceipt;
  entry.cliSessionBindings = {
    ...entry.cliSessionBindings,
    [normalized]: {
      sessionId: trimmed,
      ...(binding.forceReuse === true ? { forceReuse: true } : {}),
      ...(binding.forkNextResume === true ? { forkNextResume: true } : {}),
      ...(normalizeOptionalString(binding.authProfileId)
        ? { authProfileId: normalizeOptionalString(binding.authProfileId) }
        : {}),
      ...(normalizeOptionalString(binding.authEpoch)
        ? { authEpoch: normalizeOptionalString(binding.authEpoch) }
        : {}),
      ...(typeof binding.authEpochVersion === "number" && Number.isFinite(binding.authEpochVersion)
        ? { authEpochVersion: binding.authEpochVersion }
        : {}),
      ...(normalizeOptionalString(binding.extraSystemPromptHash)
        ? { extraSystemPromptHash: normalizeOptionalString(binding.extraSystemPromptHash) }
        : {}),
      ...(normalizeOptionalString(binding.messageToolPolicyHash)
        ? { messageToolPolicyHash: normalizeOptionalString(binding.messageToolPolicyHash) }
        : {}),
      ...(normalizeOptionalString(binding.promptToolNamesHash)
        ? { promptToolNamesHash: normalizeOptionalString(binding.promptToolNamesHash) }
        : {}),
      ...(normalizeOptionalString(binding.cwdHash)
        ? { cwdHash: normalizeOptionalString(binding.cwdHash) }
        : {}),
      ...(normalizeOptionalString(binding.mcpConfigHash)
        ? { mcpConfigHash: normalizeOptionalString(binding.mcpConfigHash) }
        : {}),
      ...(normalizeOptionalString(binding.mcpResumeHash)
        ? { mcpResumeHash: normalizeOptionalString(binding.mcpResumeHash) }
        : {}),
      ...(reseedReceipt ? { reseedReceipt } : {}),
    },
  };
  entry.cliSessionIds = {
    ...entry.cliSessionIds,
    [normalized]: trimmed,
  };
  if (normalized === CLAUDE_CLI_BACKEND_ID) entry.claudeCliSessionId = trimmed;
}
/** Remove the stored CLI session binding for one provider. */
function clearCliSession(entry, provider) {
  const normalized = normalizeProviderId(provider);
  if (entry.cliSessionBindings?.[normalized] !== void 0) {
    const next = { ...entry.cliSessionBindings };
    delete next[normalized];
    entry.cliSessionBindings = Object.keys(next).length > 0 ? next : void 0;
  }
  if (entry.cliSessionIds?.[normalized] !== void 0) {
    const next = { ...entry.cliSessionIds };
    delete next[normalized];
    entry.cliSessionIds = Object.keys(next).length > 0 ? next : void 0;
  }
  if (normalized === CLAUDE_CLI_BACKEND_ID) entry.claudeCliSessionId = void 0;
}
/** Remove every CLI session binding from a session entry. */
function clearAllCliSessions(entry) {
  entry.cliSessionBindings = void 0;
  entry.cliSessionIds = void 0;
  entry.claudeCliSessionId = void 0;
}
/** Decide whether a stored CLI session can be reused for the current auth/prompt/cwd/MCP state. */
function resolveCliSessionReuse(params) {
  const binding = params.binding;
  const sessionId = normalizeOptionalString(binding?.sessionId);
  if (!sessionId) return { mode: "none" };
  if (binding?.forceReuse === true)
    return {
      mode: "reuse",
      sessionId,
    };
  const currentAuthProfileId = normalizeOptionalString(params.authProfileId);
  const currentAuthEpoch = normalizeOptionalString(params.authEpoch);
  const currentExtraSystemPromptHash = normalizeOptionalString(params.extraSystemPromptHash);
  const currentMessageToolPolicyHash = normalizeOptionalString(params.messageToolPolicyHash);
  const currentPromptToolNamesHash = normalizeOptionalString(params.promptToolNamesHash);
  const currentCwdHash = normalizeOptionalString(params.cwdHash);
  const currentMcpConfigHash = normalizeOptionalString(params.mcpConfigHash);
  const currentMcpResumeHash = normalizeOptionalString(params.mcpResumeHash);
  const storedAuthProfileId = normalizeOptionalString(binding?.authProfileId);
  const storedAuthEpoch = normalizeOptionalString(binding?.authEpoch);
  const hasMatchingVersionedAuthEpoch =
    binding?.authEpochVersion === params.authEpochVersion &&
    storedAuthEpoch !== void 0 &&
    currentAuthEpoch !== void 0 &&
    storedAuthEpoch === currentAuthEpoch;
  if (storedAuthProfileId !== currentAuthProfileId) {
    if (!hasMatchingVersionedAuthEpoch)
      return {
        mode: "invalidate",
        invalidatedReason: "auth-profile",
      };
  }
  if (binding?.authEpochVersion === params.authEpochVersion && storedAuthEpoch !== currentAuthEpoch)
    return {
      mode: "invalidate",
      invalidatedReason: "auth-epoch",
    };
  if (normalizeOptionalString(binding?.messageToolPolicyHash) !== currentMessageToolPolicyHash)
    return {
      mode: "invalidate",
      invalidatedReason: "message-policy",
    };
  const storedCwdHash = normalizeOptionalString(binding?.cwdHash);
  if (storedCwdHash !== void 0 && storedCwdHash !== currentCwdHash)
    return {
      mode: "invalidate",
      invalidatedReason: "cwd",
    };
  const storedMcpResumeHash = normalizeOptionalString(binding?.mcpResumeHash);
  if (storedMcpResumeHash && currentMcpResumeHash) {
    if (storedMcpResumeHash !== currentMcpResumeHash)
      return {
        mode: "invalidate",
        invalidatedReason: "mcp",
      };
  } else if (normalizeOptionalString(binding?.mcpConfigHash) !== currentMcpConfigHash)
    return {
      mode: "invalidate",
      invalidatedReason: "mcp",
    };
  const driftReasons = [];
  if (normalizeOptionalString(binding?.extraSystemPromptHash) !== currentExtraSystemPromptHash)
    driftReasons.push("system-prompt");
  if (normalizeOptionalString(binding?.promptToolNamesHash) !== currentPromptToolNamesHash)
    driftReasons.push("prompt-tools");
  if (driftReasons.length > 0)
    return {
      mode: "reuse-with-drift",
      sessionId,
      drift: { reasons: driftReasons },
    };
  return {
    mode: "reuse",
    sessionId,
  };
}
//#endregion
export {
  setCliSessionBinding as a,
  resolveCliSessionReuse as i,
  clearCliSession as n,
  setCliSessionId as o,
  hashCliSessionText as r,
  clearAllCliSessions as t,
};
