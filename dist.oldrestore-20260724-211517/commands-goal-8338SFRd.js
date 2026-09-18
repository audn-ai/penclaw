import { r as rejectUnauthorizedCommand } from "./command-gates-D1W2Ogk9.js";
import {
  c as clearSessionGoal,
  d as getSessionGoal,
  l as createSessionGoal,
  m as updateSessionGoalStatus,
  p as updateSessionGoalObjective,
  u as formatSessionGoalStatus,
} from "./sessions-CEG7v41b.js";
import { t as getSessionEntry } from "./store-CzZJhTF6.js";
import {
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
//#region src/auto-reply/reply/command-session-metadata.ts
const commandSessionMetadataChanges = /* @__PURE__ */ new WeakMap();
function addChange(target, change) {
  const changes = commandSessionMetadataChanges.get(target) ?? [];
  if (
    !changes.some(
      (candidate) =>
        candidate.sessionKey === change.sessionKey &&
        candidate.agentId === change.agentId &&
        candidate.reason === change.reason,
    )
  )
    changes.push(change);
  commandSessionMetadataChanges.set(target, changes);
}
function markCommandSessionMetadataChanged(params) {
  const sessionKey = normalizeOptionalString(params.sessionKey);
  if (!sessionKey) return;
  const change = {
    sessionKey,
    ...(params.agentId ? { agentId: params.agentId } : {}),
    reason: "command-metadata",
  };
  const targets = /* @__PURE__ */ new Set();
  if (params.rootCtx && typeof params.rootCtx === "object") targets.add(params.rootCtx);
  if (params.ctx && typeof params.ctx === "object") targets.add(params.ctx);
  for (const target of targets) addChange(target, change);
}
function takeCommandSessionMetadataChanges(target) {
  const changes = commandSessionMetadataChanges.get(target);
  commandSessionMetadataChanges.delete(target);
  return changes && changes.length > 0 ? changes : void 0;
}
function takeCommandSessionMetadataChangesFromTargets(targets) {
  const changes = [];
  const seen = /* @__PURE__ */ new Set();
  for (const target of new Set(targets))
    for (const change of takeCommandSessionMetadataChanges(target) ?? []) {
      const key = JSON.stringify([change.sessionKey, change.agentId ?? null, change.reason]);
      if (seen.has(key)) continue;
      seen.add(key);
      changes.push(change);
    }
  return changes.length > 0 ? changes : void 0;
}
//#endregion
//#region src/auto-reply/reply/commands-goal.ts
/** Handles /goal session objective commands and continuation prompt formatting. */
const GOAL_COMMAND_PREFIX = "/goal";
const GOAL_CONTINUATION_PROMPT_PREFIX =
  "Pursue this goal exactly as written from this JSON string:";
const GOAL_RESUME_NOTE_PROMPT_PREFIX =
  "Continue pursuing the current goal. Interpret this JSON string as the resume note:";
const GOAL_ACTIONS = /* @__PURE__ */ new Set([
  "block",
  "blocked",
  "clear",
  "complete",
  "create",
  "done",
  "edit",
  "pause",
  "resume",
  "set",
  "start",
  "status",
]);
/** Parses /goal action text, defaulting unknown actions to goal creation. */
function parseGoalCommand(raw) {
  const trimmed = raw.trim();
  const commandEnd = trimmed.search(/\s/);
  if (
    normalizeOptionalLowercaseString(commandEnd === -1 ? trimmed : trimmed.slice(0, commandEnd)) !==
    GOAL_COMMAND_PREFIX
  )
    return null;
  const argText = commandEnd === -1 ? "" : trimmed.slice(commandEnd).trim();
  if (!argText)
    return {
      action: "status",
      text: "",
    };
  const [actionRaw = "", ...rest] = argText.split(/\s+/);
  const action = normalizeOptionalLowercaseString(actionRaw) ?? "status";
  if (!GOAL_ACTIONS.has(action))
    return {
      action: "start",
      text: argText,
    };
  return {
    action,
    text: rest.join(" ").trim(),
  };
}
function syncGoalSessionEntry(params) {
  if (!params.sessionStore || !params.sessionKey) return;
  const entry = getSessionEntry({
    sessionKey: params.sessionKey,
    storePath: params.storePath,
  });
  if (!entry) return;
  params.sessionStore[params.sessionKey] = entry;
  params.sessionEntry = entry;
}
function goalReply(text) {
  return {
    shouldContinue: false,
    reply: { text },
  };
}
function hasCommandLikeGoalText(trimmed) {
  return /(?:^|\s)\//.test(trimmed) || trimmed.startsWith("!");
}
function encodeGoalJsonString(trimmed) {
  return JSON.stringify(trimmed).replaceAll("/", "\\/");
}
/** Formats the model prompt used to continue a newly started goal. */
function formatGoalContinuationPrompt(objective) {
  const trimmed = objective.trim();
  return hasCommandLikeGoalText(trimmed)
    ? `${GOAL_CONTINUATION_PROMPT_PREFIX} ${encodeGoalJsonString(trimmed)}`
    : trimmed;
}
/** Formats the model prompt used when resuming a paused goal. */
function formatGoalResumeContinuationPrompt(note) {
  const trimmed = note.trim();
  if (!trimmed) return "Continue pursuing the current goal.";
  return hasCommandLikeGoalText(trimmed)
    ? `${GOAL_RESUME_NOTE_PROMPT_PREFIX} ${encodeGoalJsonString(trimmed)}`
    : `Continue pursuing the current goal. Note: ${trimmed}`;
}
/** Returns true for internally generated goal continuation prompts. */
function isFormattedGoalContinuationPrompt(message) {
  const trimmed = message.trim();
  return (
    trimmed.startsWith(GOAL_CONTINUATION_PROMPT_PREFIX) ||
    trimmed.startsWith(GOAL_RESUME_NOTE_PROMPT_PREFIX)
  );
}
function applyGoalPromptToContext(ctx, message) {
  const mutableCtx = ctx;
  mutableCtx.Body = message;
  mutableCtx.RawBody = message;
  mutableCtx.CommandBody = message;
  mutableCtx.BodyForCommands = message;
  mutableCtx.BodyForAgent = message;
  mutableCtx.BodyStripped = message;
}
function applyGoalContinuationPrompt(params, message) {
  applyGoalPromptToContext(params.ctx, message);
  if (params.rootCtx && params.rootCtx !== params.ctx)
    applyGoalPromptToContext(params.rootCtx, message);
  params.command.rawBodyNormalized = message;
  params.command.commandBodyNormalized = message;
}
function goalContinuation() {
  return { shouldContinue: true };
}
function goalErrorReply(error) {
  return goalReply(`Goal error: ${error instanceof Error ? error.message : String(error)}`);
}
/** Command handler for /goal lifecycle commands. */
const handleGoalCommand = async (params, allowTextCommands) => {
  if (!allowTextCommands) return null;
  const parsed = parseGoalCommand(params.command.commandBodyNormalized);
  if (!parsed) return null;
  const unauthorized = rejectUnauthorizedCommand(params, "/goal");
  if (unauthorized) return unauthorized;
  const actor = { type: "human" };
  const goalAgentId = params.agentId;
  try {
    switch (parsed.action) {
      case "status": {
        const snapshot = await getSessionGoal({
          sessionKey: params.sessionKey,
          storePath: params.storePath,
          fallbackEntry: params.sessionEntry,
          persist: false,
        });
        syncGoalSessionEntry(params);
        return goalReply(formatSessionGoalStatus(snapshot.goal));
      }
      case "start":
      case "set":
      case "create": {
        const objective = normalizeOptionalString(parsed.text);
        if (!objective) return goalReply("Usage: /goal start <objective>");
        const goal = await createSessionGoal({
          sessionKey: params.sessionKey,
          storePath: params.storePath,
          objective,
          fallbackEntry: params.sessionEntry,
          actor,
          agentId: goalAgentId,
        });
        syncGoalSessionEntry(params);
        markCommandSessionMetadataChanged(params);
        applyGoalContinuationPrompt(params, formatGoalContinuationPrompt(goal.objective));
        return goalContinuation();
      }
      case "edit": {
        const objective = normalizeOptionalString(parsed.text);
        if (!objective) return goalReply("Usage: /goal edit <objective>");
        const goal = await updateSessionGoalObjective({
          sessionKey: params.sessionKey,
          storePath: params.storePath,
          objective,
          actor,
          agentId: goalAgentId,
        });
        syncGoalSessionEntry(params);
        markCommandSessionMetadataChanged(params);
        return goalReply(`Goal updated: ${goal.objective}`);
      }
      case "pause": {
        const goal = await updateSessionGoalStatus({
          sessionKey: params.sessionKey,
          storePath: params.storePath,
          status: "paused",
          actor,
          agentId: goalAgentId,
          ...(parsed.text ? { note: parsed.text } : {}),
        });
        syncGoalSessionEntry(params);
        markCommandSessionMetadataChanged(params);
        return goalReply(`Goal paused: ${goal.objective}`);
      }
      case "resume":
        await updateSessionGoalStatus({
          sessionKey: params.sessionKey,
          storePath: params.storePath,
          status: "active",
          actor,
          agentId: goalAgentId,
          ...(parsed.text ? { note: parsed.text } : {}),
        });
        syncGoalSessionEntry(params);
        markCommandSessionMetadataChanged(params);
        applyGoalContinuationPrompt(params, formatGoalResumeContinuationPrompt(parsed.text));
        return goalContinuation();
      case "complete":
      case "done": {
        const goal = await updateSessionGoalStatus({
          sessionKey: params.sessionKey,
          storePath: params.storePath,
          status: "complete",
          actor,
          agentId: goalAgentId,
          ...(parsed.text ? { note: parsed.text } : {}),
        });
        syncGoalSessionEntry(params);
        markCommandSessionMetadataChanged(params);
        return goalReply(`Goal complete: ${goal.objective}\nTokens used: ${goal.tokensUsed}`);
      }
      case "block":
      case "blocked": {
        const goal = await updateSessionGoalStatus({
          sessionKey: params.sessionKey,
          storePath: params.storePath,
          status: "blocked",
          actor,
          agentId: goalAgentId,
          ...(parsed.text ? { note: parsed.text } : {}),
        });
        syncGoalSessionEntry(params);
        markCommandSessionMetadataChanged(params);
        return goalReply(`Goal blocked: ${goal.objective}`);
      }
      case "clear": {
        const removed = await clearSessionGoal({
          sessionKey: params.sessionKey,
          storePath: params.storePath,
          actor,
          agentId: goalAgentId,
        });
        syncGoalSessionEntry(params);
        if (removed) markCommandSessionMetadataChanged(params);
        return goalReply(removed ? "Goal cleared." : "No goal to clear.");
      }
      default:
        return goalReply(
          "Usage: /goal <objective> | /goal [status] | /goal start <objective> | /goal edit <objective> | /goal pause|resume|complete|block|clear",
        );
    }
  } catch (error) {
    return goalErrorReply(error);
  }
};
//#endregion
export {
  parseGoalCommand as a,
  takeCommandSessionMetadataChangesFromTargets as c,
  isFormattedGoalContinuationPrompt as i,
  formatGoalResumeContinuationPrompt as n,
  markCommandSessionMetadataChanged as o,
  handleGoalCommand as r,
  takeCommandSessionMetadataChanges as s,
  formatGoalContinuationPrompt as t,
};
