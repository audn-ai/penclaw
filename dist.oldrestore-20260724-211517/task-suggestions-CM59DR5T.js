import { randomUUID } from "node:crypto";
import "./agent-scope-y9xQv_q1.js";
import path from "node:path";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { c as resolveDefaultAgentId } from "./agent-scope-config-DVIR1nBa.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { o as managedWorktrees } from "./service-Dhl824Yp.js";
import { t as buildDashboardSessionKey } from "./session-create-service-Cu4fMU-m.js";
import { c as parseAgentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import { u as loadSessionEntry } from "./session-utils-DjTWBI0J.js";
import { t as sessionsHandlers } from "./sessions-CluK0uj1.js";
import {
  _i as validateTaskSuggestionsDismissParams,
  gi as validateTaskSuggestionsCreateParams,
  hi as validateTaskSuggestionsAcceptParams,
  vi as validateTaskSuggestionsListParams,
} from "./src-CIJf1lT0.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
//#region src/gateway/task-suggestion-registry.ts
const MAX_TASK_SUGGESTIONS = 100;
const MAX_TASK_SUGGESTION_RETAINED_BYTES = 2 * 1024 * 1024;
const suggestions = /* @__PURE__ */ new Map();
let retainedSuggestionBytes = 0;
function retainedBytesForSuggestion(suggestion) {
  return Buffer.byteLength(JSON.stringify(suggestion)) + 1;
}
function evictTaskSuggestion() {
  for (const [taskId, record] of suggestions)
    if (record.status === "accepted" || record.status === "dismissed") {
      retainedSuggestionBytes -= retainedBytesForSuggestion(record.suggestion);
      suggestions.delete(taskId);
      return null;
    }
  for (const [taskId, record] of suggestions)
    if (record.status === "pending") {
      retainedSuggestionBytes -= retainedBytesForSuggestion(record.suggestion);
      suggestions.delete(taskId);
      return taskId;
    }
}
/** Records one suggestion without starting work. IDs intentionally vanish on restart. */
function createTaskSuggestion(params) {
  const suggestion = {
    id: `task_${randomUUID()}`,
    title: params.title,
    prompt: params.prompt,
    tldr: params.tldr,
    cwd: params.cwd,
    sessionKey: params.sessionKey,
    ...(params.agentId ? { agentId: params.agentId } : {}),
    createdAt: Date.now(),
  };
  const suggestionBytes = retainedBytesForSuggestion(suggestion);
  const evictedPendingTaskIds = [];
  while (
    suggestions.size >= MAX_TASK_SUGGESTIONS ||
    retainedSuggestionBytes + suggestionBytes + 1 > MAX_TASK_SUGGESTION_RETAINED_BYTES
  ) {
    const evictedTaskId = evictTaskSuggestion();
    if (evictedTaskId === void 0) return { status: "full" };
    if (evictedTaskId) evictedPendingTaskIds.push(evictedTaskId);
  }
  suggestions.set(suggestion.id, {
    status: "pending",
    suggestion,
  });
  retainedSuggestionBytes += suggestionBytes;
  return {
    status: "created",
    suggestion,
    evictedPendingTaskIds,
  };
}
/** Lists newest suggestions first, optionally scoped to their source chat. */
function listTaskSuggestions(params) {
  return [...suggestions.values()]
    .filter((record) => record.status === "pending")
    .map((record) => record.suggestion)
    .filter(
      (suggestion) =>
        (!params.sessionKey || suggestion.sessionKey === params.sessionKey) &&
        (!params.agentId || suggestion.agentId === params.agentId),
    )
    .toReversed();
}
/** Claims one suggestion before any privileged worktree/session side effects begin. */
function beginTaskSuggestionAcceptance(taskId) {
  const record = suggestions.get(taskId);
  if (!record) return { status: "missing" };
  if (record.status === "accepted")
    return {
      status: "accepted",
      sessionKey: record.sessionKey,
    };
  if (record.status !== "pending") return { status: record.status };
  suggestions.set(taskId, {
    status: "accepting",
    suggestion: record.suggestion,
  });
  return {
    status: "claimed",
    suggestion: record.suggestion,
  };
}
/** Restores a claim when session creation fails before an acceptance result exists. */
function cancelTaskSuggestionAcceptance(taskId) {
  const record = suggestions.get(taskId);
  if (record?.status === "accepting") {
    suggestions.set(taskId, {
      status: "pending",
      suggestion: record.suggestion,
    });
    return record.suggestion;
  }
}
/** Retires a claimed suggestion when partial side effects cannot be rolled back safely. */
function abandonTaskSuggestionAcceptance(taskId) {
  const record = suggestions.get(taskId);
  if (record?.status !== "accepting") return false;
  suggestions.set(taskId, {
    status: "dismissed",
    suggestion: record.suggestion,
  });
  return true;
}
/** Retains the created session key so retries return the same accepted task. */
function completeTaskSuggestionAcceptance(taskId, sessionKey) {
  const record = suggestions.get(taskId);
  if (record?.status === "accepting")
    suggestions.set(taskId, {
      status: "accepted",
      suggestion: record.suggestion,
      sessionKey,
    });
}
/** Dismisses only a pending suggestion; accepted or in-flight tasks stay immutable. */
function dismissTaskSuggestion(taskId) {
  const record = suggestions.get(taskId);
  if (record?.status !== "pending") return false;
  suggestions.set(taskId, {
    status: "dismissed",
    suggestion: record.suggestion,
  });
  return true;
}
//#endregion
//#region src/gateway/server-methods/task-suggestions.ts
function invalidParams(method, errors) {
  return errorShape(
    ErrorCodes.INVALID_REQUEST,
    `invalid ${method} params: ${formatValidationErrors(errors)}`,
  );
}
const activeAcceptances = /* @__PURE__ */ new Map();
async function rollbackSuggestedTaskSession(params) {
  let deletionConfirmed = false;
  try {
    await sessionsHandlers["sessions.delete"]?.({
      ...params.options,
      params: {
        key: params.key,
        ...(params.agentId ? { agentId: params.agentId } : {}),
        deleteTranscript: true,
        emitLifecycleHooks: false,
      },
      respond: (ok, payload) => {
        deletionConfirmed = Boolean(
          ok && payload && typeof payload === "object" && typeof payload.deleted === "boolean",
        );
      },
    });
  } catch {}
  try {
    if (!deletionConfirmed && loadSessionEntry(params.key, { agentId: params.agentId }).entry)
      return false;
  } catch {
    return false;
  }
  const worktree = managedWorktrees.findLiveByOwner("session", params.key);
  if (worktree)
    try {
      await managedWorktrees.remove({
        id: worktree.id,
        reason: "suggested-task-seed-failed",
        force: true,
      });
    } catch {
      return false;
    }
  return managedWorktrees.findLiveByOwner("session", params.key) === void 0;
}
async function failSuggestedTaskSession(params) {
  if (
    await rollbackSuggestedTaskSession({
      key: params.sessionKey,
      agentId: params.agentId,
      options: params.options,
    })
  ) {
    const restored = cancelTaskSuggestionAcceptance(params.taskId);
    if (restored)
      params.options.context.broadcast(
        "task.suggestion",
        {
          action: "created",
          suggestion: restored,
        },
        { dropIfSlow: true },
      );
    return {
      ok: false,
      error: params.error,
    };
  }
  if (abandonTaskSuggestionAcceptance(params.taskId))
    params.options.context.broadcast(
      "task.suggestion",
      {
        action: "resolved",
        taskId: params.taskId,
        resolution: "expired",
      },
      { dropIfSlow: true },
    );
  return {
    ok: false,
    error: errorShape(
      ErrorCodes.UNAVAILABLE,
      `${params.error.message}; failed to roll back the partial suggested task session`,
    ),
  };
}
async function createSuggestedTaskSession(params) {
  let sessionResponse;
  const agentId = normalizeAgentId(
    params.suggestion.agentId ??
      parseAgentSessionKey(params.suggestion.sessionKey)?.agentId ??
      resolveDefaultAgentId(params.options.context.getRuntimeConfig()),
  );
  const sessionKey = buildDashboardSessionKey(agentId);
  try {
    await sessionsHandlers["sessions.create"]?.({
      ...params.options,
      params: {
        key: sessionKey,
        agentId,
        parentSessionKey: params.suggestion.sessionKey,
        label: params.suggestion.title,
        task: params.suggestion.prompt,
        worktree: true,
        cwd: params.suggestion.cwd,
      },
      respond: (...args) => {
        sessionResponse = args;
      },
    });
  } catch (error) {
    return await failSuggestedTaskSession({
      taskId: params.taskId,
      sessionKey,
      agentId,
      options: params.options,
      error: errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)),
    });
  }
  if (!sessionResponse)
    return await failSuggestedTaskSession({
      taskId: params.taskId,
      sessionKey,
      agentId,
      options: params.options,
      error: errorShape(ErrorCodes.UNAVAILABLE, "sessions.create did not respond"),
    });
  const [ok, payload, error] = sessionResponse;
  if (!ok)
    return await failSuggestedTaskSession({
      taskId: params.taskId,
      sessionKey,
      agentId,
      options: params.options,
      error: error ?? errorShape(ErrorCodes.UNAVAILABLE, "failed to create suggested task"),
    });
  const key =
    payload && typeof payload === "object" && typeof payload.key === "string"
      ? payload.key
      : void 0;
  if (!key)
    return await failSuggestedTaskSession({
      taskId: params.taskId,
      sessionKey,
      agentId,
      options: params.options,
      error: errorShape(ErrorCodes.UNAVAILABLE, "sessions.create returned no session key"),
    });
  const result = payload;
  if (result.runStarted !== true) {
    const runMessage =
      result.runError &&
      typeof result.runError === "object" &&
      typeof result.runError.message === "string"
        ? result.runError.message
        : "initial task did not start";
    return await failSuggestedTaskSession({
      taskId: params.taskId,
      sessionKey: key,
      agentId,
      options: params.options,
      error: errorShape(ErrorCodes.UNAVAILABLE, runMessage),
    });
  }
  completeTaskSuggestionAcceptance(params.taskId, key);
  params.options.context.broadcast(
    "task.suggestion",
    {
      action: "resolved",
      taskId: params.taskId,
      resolution: "accepted",
    },
    { dropIfSlow: true },
  );
  return {
    ok: true,
    result: {
      taskId: params.taskId,
      key,
    },
  };
}
const taskSuggestionsHandlers = {
  "taskSuggestions.list": ({ params, respond }) => {
    if (!validateTaskSuggestionsListParams(params)) {
      respond(
        false,
        void 0,
        invalidParams("taskSuggestions.list", validateTaskSuggestionsListParams.errors),
      );
      return;
    }
    respond(true, { suggestions: listTaskSuggestions(params) }, void 0);
  },
  "taskSuggestions.create": ({ params, respond, context }) => {
    if (!validateTaskSuggestionsCreateParams(params)) {
      respond(
        false,
        void 0,
        invalidParams("taskSuggestions.create", validateTaskSuggestionsCreateParams.errors),
      );
      return;
    }
    if (!path.isAbsolute(params.cwd)) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "task suggestion cwd must be absolute"),
      );
      return;
    }
    const sessionAgentId = parseAgentSessionKey(params.sessionKey)?.agentId;
    const requestedAgentId = params.agentId ? normalizeAgentId(params.agentId) : void 0;
    if (
      requestedAgentId &&
      sessionAgentId &&
      requestedAgentId !== normalizeAgentId(sessionAgentId)
    ) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          "task suggestion agentId must match its source session",
        ),
      );
      return;
    }
    const agentId = normalizeAgentId(
      requestedAgentId ?? sessionAgentId ?? resolveDefaultAgentId(context.getRuntimeConfig()),
    );
    const created = createTaskSuggestion({
      ...params,
      agentId,
    });
    if (created.status === "full") {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.UNAVAILABLE, "task suggestion registry is busy", { retryable: true }),
      );
      return;
    }
    const { suggestion } = created;
    for (const taskId of created.evictedPendingTaskIds)
      context.broadcast(
        "task.suggestion",
        {
          action: "resolved",
          taskId,
          resolution: "expired",
        },
        { dropIfSlow: true },
      );
    context.broadcast(
      "task.suggestion",
      {
        action: "created",
        suggestion,
      },
      { dropIfSlow: true },
    );
    respond(
      true,
      {
        taskId: suggestion.id,
        suggestion,
      },
      void 0,
    );
  },
  "taskSuggestions.accept": async (options) => {
    const { params, respond } = options;
    if (!validateTaskSuggestionsAcceptParams(params)) {
      respond(
        false,
        void 0,
        invalidParams("taskSuggestions.accept", validateTaskSuggestionsAcceptParams.errors),
      );
      return;
    }
    const active = activeAcceptances.get(params.taskId);
    if (active) {
      const outcome = await active;
      respond(
        outcome.ok,
        outcome.ok ? outcome.result : void 0,
        outcome.ok ? void 0 : outcome.error,
      );
      return;
    }
    const acceptance = beginTaskSuggestionAcceptance(params.taskId);
    if (acceptance.status === "accepted") {
      respond(
        true,
        {
          taskId: params.taskId,
          key: acceptance.sessionKey,
        },
        void 0,
      );
      return;
    }
    if (acceptance.status !== "claimed") {
      respond(
        false,
        void 0,
        errorShape(
          acceptance.status === "accepting" ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST,
          `task suggestion cannot be accepted: ${acceptance.status}`,
        ),
      );
      return;
    }
    const pending = createSuggestedTaskSession({
      taskId: params.taskId,
      suggestion: acceptance.suggestion,
      options,
    });
    activeAcceptances.set(params.taskId, pending);
    try {
      const outcome = await pending;
      respond(
        outcome.ok,
        outcome.ok ? outcome.result : void 0,
        outcome.ok ? void 0 : outcome.error,
      );
    } finally {
      activeAcceptances.delete(params.taskId);
    }
  },
  "taskSuggestions.dismiss": ({ params, respond, context }) => {
    if (!validateTaskSuggestionsDismissParams(params)) {
      respond(
        false,
        void 0,
        invalidParams("taskSuggestions.dismiss", validateTaskSuggestionsDismissParams.errors),
      );
      return;
    }
    const dismissed = dismissTaskSuggestion(params.taskId);
    if (dismissed)
      context.broadcast(
        "task.suggestion",
        {
          action: "resolved",
          taskId: params.taskId,
          resolution: "dismissed",
        },
        { dropIfSlow: true },
      );
    respond(
      true,
      {
        taskId: params.taskId,
        dismissed,
      },
      void 0,
    );
  },
};
//#endregion
export { taskSuggestionsHandlers };
