import { c as callGateway } from "./call-BVMO6az_.js";
import { n as sanitizeTextContent } from "./chat-history-text-BrNFNoZX.js";
import {
  a as isNativeCommandTurn,
  s as resolveCommandTurnContext,
} from "./command-turn-context-DXqYoJ8B.js";
import { p as extractTextFromChatContent } from "./sanitize-user-facing-text-B_JqK9fo.js";
import {
  a as isSubagentSessionKey,
  c as parseAgentSessionKey,
} from "./session-key-utils-B8sNp9l4.js";
import {
  c as resolveMainSessionAlias,
  p as looksLikeSessionId,
  s as resolveInternalSessionKey,
} from "./sessions-helpers-DN9IrrxU.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { n as resolveStoredSubagentCapabilities } from "./subagent-capabilities-DP50Hfbb.js";
import {
  E as subagentRuns,
  t as getSubagentRunsSnapshotForRead,
  v as countPendingDescendantRunsFromRuns,
} from "./subagent-registry-state-tCJeOSqd.js";
import {
  i as resolveSubagentTargetFromRuns,
  t as formatRunLabel,
} from "./subagents-utils--q1dbPqc.js";
//#region src/auto-reply/reply/commands-subagents-text.ts
/** Text extraction helpers for subagent command output. */
/** Extracts sanitized display text from a subagent chat message. */
function extractMessageText(message) {
  const role = typeof message.role === "string" ? message.role : "";
  const shouldSanitize = role === "assistant";
  const text = extractTextFromChatContent(message.content, {
    sanitizeText: shouldSanitize ? sanitizeTextContent : void 0,
  });
  return text
    ? {
        role,
        text,
      }
    : null;
}
//#endregion
//#region src/auto-reply/reply/commands-subagents/shared.ts
const COMMAND = "/subagents";
const COMMAND_FOCUS = "/focus";
const COMMAND_UNFOCUS = "/unfocus";
const COMMAND_AGENTS = "/agents";
const ACTIONS = /* @__PURE__ */ new Set(["list", "log", "info", "help"]);
function stopWithText(text) {
  return {
    shouldContinue: false,
    reply: { text },
  };
}
function stopWithUnknownTargetError(error) {
  return stopWithText(`⚠️ ${error ?? "Unknown subagent."}`);
}
function resolveSubagentTarget(runs, token) {
  return resolveSubagentTargetFromRuns({
    runs,
    token,
    recentWindowMinutes: 30,
    label: (entry) => formatRunLabel(entry),
    aliases: (entry) => (entry.taskName ? [entry.taskName] : []),
    isActive: (entry) =>
      !entry.endedAt ||
      Math.max(
        0,
        countPendingDescendantRunsFromRuns(
          getSubagentRunsSnapshotForRead(subagentRuns),
          entry.childSessionKey,
        ),
      ) > 0,
    errors: {
      missingTarget: "Missing subagent id.",
      invalidIndex: (value) => `Invalid subagent index: ${value}`,
      unknownSession: (value) => `Unknown subagent session: ${value}`,
      ambiguousLabel: (value) => `Ambiguous subagent label: ${value}`,
      ambiguousLabelPrefix: (value) => `Ambiguous subagent label prefix: ${value}`,
      ambiguousRunIdPrefix: (value) => `Ambiguous run id prefix: ${value}`,
      unknownTarget: (value) => `Unknown subagent id: ${value}`,
    },
  });
}
function resolveSubagentEntryForToken(runs, token) {
  const resolved = resolveSubagentTarget(runs, token);
  if (!resolved.entry) return { reply: stopWithUnknownTargetError(resolved.error) };
  return { entry: resolved.entry };
}
function resolveRequesterSessionKey(params, opts) {
  const commandTarget = normalizeOptionalString(params.ctx.CommandTargetSessionKey);
  const commandSession = normalizeOptionalString(params.sessionKey);
  const raw =
    (opts?.preferCommandTarget ?? isNativeCommandTurn(resolveCommandTurnContext(params.ctx)))
      ? commandTarget || commandSession
      : commandSession || commandTarget;
  if (!raw) return;
  const { mainKey, alias } = resolveMainSessionAlias(params.cfg);
  return resolveInternalSessionKey({
    key: raw,
    alias,
    mainKey,
  });
}
function resolveCommandSubagentController(params, requesterKey) {
  if (!isSubagentSessionKey(requesterKey))
    return {
      controllerSessionKey: requesterKey,
      callerSessionKey: requesterKey,
      callerIsSubagent: false,
      controlScope: "children",
    };
  return {
    controllerSessionKey: requesterKey,
    callerSessionKey: requesterKey,
    callerIsSubagent: true,
    controlScope: resolveStoredSubagentCapabilities(requesterKey, { cfg: params.cfg }).controlScope,
  };
}
function resolveHandledPrefix(normalized) {
  return normalized.startsWith(COMMAND)
    ? COMMAND
    : normalized.startsWith(COMMAND_FOCUS)
      ? COMMAND_FOCUS
      : normalized.startsWith(COMMAND_UNFOCUS)
        ? COMMAND_UNFOCUS
        : normalized.startsWith(COMMAND_AGENTS)
          ? COMMAND_AGENTS
          : null;
}
function resolveSubagentsAction(params) {
  if (params.handledPrefix === COMMAND) {
    const [actionRaw] = params.restTokens;
    const action = normalizeLowercaseStringOrEmpty(actionRaw) || "list";
    if (!ACTIONS.has(action)) return null;
    params.restTokens.splice(0, 1);
    return action;
  }
  if (params.handledPrefix === COMMAND_FOCUS) return "focus";
  if (params.handledPrefix === COMMAND_UNFOCUS) return "unfocus";
  if (params.handledPrefix === COMMAND_AGENTS) return "agents";
  return null;
}
async function resolveFocusTargetSession(params) {
  const subagentMatch = resolveSubagentTarget(params.runs, params.token);
  if (subagentMatch.entry) {
    const key = subagentMatch.entry.childSessionKey;
    return {
      targetKind: "subagent",
      targetSessionKey: key,
      agentId: parseAgentSessionKey(key)?.agentId ?? "main",
      label: formatRunLabel(subagentMatch.entry),
    };
  }
  const token = params.token.trim();
  if (!token) return null;
  const attempts = [];
  const requesterKey = normalizeOptionalString(params.requesterKey);
  const spawnedBy = requesterKey && isSubagentSessionKey(requesterKey) ? requesterKey : void 0;
  attempts.push({ key: token });
  if (looksLikeSessionId(token)) attempts.push({ sessionId: token });
  attempts.push({ label: token });
  for (const attempt of attempts)
    try {
      const key =
        normalizeOptionalString(
          (
            await callGateway({
              method: "sessions.resolve",
              params: spawnedBy
                ? {
                    ...attempt,
                    spawnedBy,
                  }
                : attempt,
            })
          )?.key,
        ) ?? "";
      if (!key) continue;
      const parsed = parseAgentSessionKey(key);
      return {
        targetKind: key.includes(":subagent:") ? "subagent" : "acp",
        targetSessionKey: key,
        agentId: parsed?.agentId ?? "main",
        label: token,
      };
    } catch {}
  return null;
}
function buildSubagentsHelp() {
  return [
    "Subagents",
    "Usage:",
    "- /subagents list",
    "- /subagents log <id|#> [limit] [tools]",
    "- /subagents info <id|#>",
    "- /focus <subagent-label|session-key|session-id|session-label>",
    "- /unfocus",
    "- /agents",
    "- /session idle <duration|off>",
    "- /session max-age <duration|off>",
    "",
    "Ids: use the list index (#), runId/session prefix, label, or full session key.",
  ].join("\n");
}
function formatLogLines(messages) {
  const lines = [];
  for (const msg of messages) {
    const extracted = extractMessageText(msg);
    if (!extracted) continue;
    const label = extracted.role === "assistant" ? "Assistant" : "User";
    lines.push(`${label}: ${extracted.text}`);
  }
  return lines;
}
//#endregion
export {
  resolveHandledPrefix as a,
  resolveSubagentsAction as c,
  resolveFocusTargetSession as i,
  stopWithText as l,
  formatLogLines as n,
  resolveRequesterSessionKey as o,
  resolveCommandSubagentController as r,
  resolveSubagentEntryForToken as s,
  buildSubagentsHelp as t,
};
