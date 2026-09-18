import {
  a as describeFailoverError,
  f as resolveFailoverStatus,
} from "./failover-error-CYvhrluQ.js";
import "./stream-message-shared-DKS8UMJ_.js";
import { i as buildHistoryContextFromEntries } from "./history-DdfM33Aj.js";
import { p as extractTextFromChatContent } from "./sanitize-user-facing-text-B_JqK9fo.js";
import { d as normalizeTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
//#region src/gateway/agent-event-assistant-text.ts
/** Extracts the assistant-visible text delta from an agent event payload. */
function resolveAssistantStreamDeltaText(evt) {
  const delta = evt.data.delta;
  const text = evt.data.text;
  return typeof delta === "string" ? delta : typeof text === "string" ? text : "";
}
function isReplaceableAssistantStreamEvent(evt) {
  return evt.data.replaceable === true;
}
function resolveAssistantStreamSnapshotText(evt) {
  const text = evt.data.text;
  if (typeof text === "string") return text;
  return resolveAssistantStreamDeltaText(evt);
}
//#endregion
//#region src/gateway/agent-prompt.ts
const IMAGE_ONLY_USER_MESSAGE = "User sent image(s) with no text.";
/**
 * Coerce body to string. Handles cases where body is a content array
 * (e.g. [{type:"text", text:"hello"}]) that would serialize as
 * [object Object] if used directly in a template literal.
 */
function safeBody(body) {
  return typeof body === "string" ? body : (extractTextFromChatContent(body) ?? "");
}
function toPromptEntry(entry) {
  const body = safeBody(entry.entry.body);
  if (
    entry.role === "assistant" &&
    entry.internalStreamError === true &&
    body.trim() === "[assistant turn failed before producing content]"
  )
    return null;
  return {
    ...entry.entry,
    body,
  };
}
/** Build the prompt text sent to an agent from ordered conversation entries. */
function buildAgentMessageFromConversationEntries(entries) {
  if (entries.length === 0) return "";
  let currentIndex = -1;
  for (let i = entries.length - 1; i >= 0; i -= 1) {
    const role = entries[i]?.role;
    if (role === "user" || role === "tool") {
      currentIndex = i;
      break;
    }
  }
  if (currentIndex < 0) currentIndex = entries.length - 1;
  const currentConversationEntry = entries[currentIndex];
  const currentEntry = currentConversationEntry?.entry;
  if (!currentConversationEntry || !currentEntry) return "";
  const historyEntries = entries
    .slice(0, currentIndex)
    .map(toPromptEntry)
    .filter((entry) => entry !== null);
  const currentPromptEntry = toPromptEntry(currentConversationEntry);
  if (!currentPromptEntry) return "";
  if (historyEntries.length === 0) return currentPromptEntry.body;
  const formatEntry = (entry) => `${entry.sender}: ${entry.body}`;
  return buildHistoryContextFromEntries({
    entries: [...historyEntries, currentPromptEntry],
    currentMessage: formatEntry(currentPromptEntry),
    formatEntry,
  });
}
//#endregion
//#region src/gateway/input-allowlist.ts
/**
 * Normalize optional gateway URL-input hostname allowlists.
 *
 * Semantics are intentionally:
 * - missing / empty / whitespace-only list => no hostname allowlist restriction
 * - deny-all URL fetching => use the corresponding `allowUrl: false` switch
 */
function normalizeInputHostnameAllowlist(values) {
  if (!values || values.length === 0) return;
  const normalized = normalizeTrimmedStringList(values);
  return normalized.length > 0 ? normalized : void 0;
}
//#endregion
//#region src/gateway/openai-compat-errors.ts
const ERROR_TYPE_BY_REASON = {
  auth: "authentication_error",
  auth_permanent: "permission_error",
  billing: "insufficient_quota",
  context_overflow: "invalid_request_error",
  format: "invalid_request_error",
  model_not_found: "invalid_request_error",
  overloaded: "api_error",
  rate_limit: "rate_limit_error",
  server_error: "api_error",
  session_expired: "invalid_request_error",
  timeout: "api_error",
};
function statusForReason(reason, status) {
  if (reason === "server_error") return status && status >= 400 && status < 500 ? status : 502;
  if (reason === "timeout") return status && status >= 400 && status < 500 ? status : 504;
  return status ?? resolveFailoverStatus(reason) ?? 500;
}
function messageForReason(params) {
  if (params.reason === "server_error") return "upstream provider error";
  if (params.reason === "timeout") return "upstream provider timeout";
  if (params.reason === "overloaded") return "upstream provider overloaded";
  return params.rawError?.trim() || params.message.trim() || "request failed";
}
/** Converts a provider failover error into an OpenAI-compatible error envelope. */
function resolveOpenAiCompatError(err) {
  const described = describeFailoverError(err);
  const reason = described.reason;
  if (!reason) return;
  const type = ERROR_TYPE_BY_REASON[reason];
  if (!type) return;
  return {
    status: statusForReason(reason, described.status),
    error: {
      message: messageForReason({
        reason,
        message: described.message,
        rawError: described.rawError,
      }),
      type,
      ...(described.code ? { code: described.code } : {}),
    },
  };
}
/** Validates OpenAI-compatible sampling parameters before provider dispatch. */
function validateOpenAiSamplingParams(params) {
  if (params.temperature != null) {
    if (typeof params.temperature !== "number" || !Number.isFinite(params.temperature))
      return "`temperature` must be a finite number.";
    if (params.temperature < 0 || params.temperature > 2)
      return "`temperature` must be between 0 and 2.";
  }
  if (params.topP != null) {
    if (typeof params.topP !== "number" || !Number.isFinite(params.topP))
      return "`top_p` must be a finite number.";
    if (params.topP < 0 || params.topP > 1) return "`top_p` must be between 0 and 1.";
  }
  if (params.frequencyPenalty != null) {
    if (typeof params.frequencyPenalty !== "number" || !Number.isFinite(params.frequencyPenalty))
      return "`frequency_penalty` must be a finite number.";
    if (params.frequencyPenalty < -2 || params.frequencyPenalty > 2)
      return "`frequency_penalty` must be between -2.0 and 2.0.";
  }
  if (params.presencePenalty != null) {
    if (typeof params.presencePenalty !== "number" || !Number.isFinite(params.presencePenalty))
      return "`presence_penalty` must be a finite number.";
    if (params.presencePenalty < -2 || params.presencePenalty > 2)
      return "`presence_penalty` must be between -2.0 and 2.0.";
  }
  if (params.seed != null) {
    if (typeof params.seed !== "number" || !Number.isFinite(params.seed))
      return "`seed` must be a finite number.";
    if (!Number.isInteger(params.seed)) return "`seed` must be an integer.";
  }
}
//#endregion
//#region src/gateway/openai-tool-choice.ts
function toolChoiceConstraintPrompt(constraint) {
  return constraint.type === "function"
    ? `You must call the ${constraint.name} tool before responding.`
    : "You must call one of the available tools before responding.";
}
function isToolChoiceConstraintSatisfied(params) {
  const { constraint, pendingToolCalls } = params;
  if (!constraint) return true;
  if (!pendingToolCalls || pendingToolCalls.length === 0) return false;
  if (constraint.type === "required") return true;
  return pendingToolCalls.some((call) => call.name === constraint.name);
}
function resolveUnsatisfiedToolChoiceMessage(constraint) {
  return constraint.type === "function"
    ? `tool_choice required a ${constraint.name} tool call, but the agent did not produce one`
    : "tool_choice=required was not satisfied by the agent response";
}
//#endregion
export {
  validateOpenAiSamplingParams as a,
  buildAgentMessageFromConversationEntries as c,
  resolveAssistantStreamSnapshotText as d,
  resolveOpenAiCompatError as i,
  isReplaceableAssistantStreamEvent as l,
  resolveUnsatisfiedToolChoiceMessage as n,
  normalizeInputHostnameAllowlist as o,
  toolChoiceConstraintPrompt as r,
  IMAGE_ONLY_USER_MESSAGE as s,
  isToolChoiceConstraintSatisfied as t,
  resolveAssistantStreamDeltaText as u,
};
