import { i as isInternalMessageChannel } from "./message-channel-NQc9DJ6B.js";
import { o as normalizeProviderId } from "./model-selection-normalize-BoKGJiBx.js";
import {
  L as isDefaultAgentRuntimeId,
  z as normalizeOptionalAgentRuntimeId,
} from "./openai-routing-Cu28Ynzk.js";
import {
  r as resolveSessionRuntimeOverrideForProvider,
  t as resolveCompatibleAgentRuntimeForProvider,
} from "./session-runtime-compat-DgCFENjt.js";
import "./model-selection-DOlkTrQa.js";
import { t as SESSION_MODEL_OVERRIDE_TRANSACTION_FIELDS } from "./session-snapshot-merge-BUp0DZlF.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { r as prefixSystemMessage, t as SYSTEM_MARK } from "./system-message-Dltw0_t9.js";
//#region src/auto-reply/reply/directive-handling.model-runtime.ts
/** Resolves and applies explicit runtime selections attached to `/model`. */
/** Validates a requested runtime against the provider selected by the same directive. */
function resolveModelRuntimeDirective(params) {
  const rawRuntime = params.rawRuntime?.trim();
  if (!rawRuntime) {
    if (
      params.sessionEntry?.agentRuntimeOverride?.trim() &&
      !resolveSessionRuntimeOverrideForProvider({
        provider: params.provider,
        entry: params.sessionEntry,
        cfg: params.cfg,
      })
    )
      return { kind: "clear" };
    return { kind: "unchanged" };
  }
  const runtime = normalizeOptionalAgentRuntimeId(rawRuntime);
  if (isDefaultAgentRuntimeId(runtime)) return { kind: "clear" };
  const provider = normalizeProviderId(params.provider);
  const compatibleRuntime = resolveCompatibleAgentRuntimeForProvider({
    provider,
    runtime,
    cfg: params.cfg,
  });
  if (compatibleRuntime)
    return {
      kind: "set",
      runtime: compatibleRuntime,
    };
  return {
    kind: "invalid",
    runtime: rawRuntime,
    errorText: `Runtime "${rawRuntime}" is not supported for ${provider || params.provider}.`,
  };
}
/** Applies a validated runtime choice without disturbing existing pins when no choice was given. */
function applyModelRuntimeDirective(entry, resolution) {
  if (resolution.kind === "clear") {
    const updated = entry.agentRuntimeOverride !== void 0;
    delete entry.agentRuntimeOverride;
    return { updated };
  }
  if (resolution.kind === "set") {
    const updated = entry.agentRuntimeOverride !== resolution.runtime;
    entry.agentRuntimeOverride = resolution.runtime;
    return { updated };
  }
  return { updated: false };
}
//#endregion
//#region src/auto-reply/reply/directive-handling.shared.ts
const formatDirectiveAck = (text) => {
  return prefixSystemMessage(text);
};
const formatOptionsLine = (options) => `Options: ${options}.`;
const withOptions = (line, options) => `${line}\n${formatOptionsLine(options)}`;
const formatElevatedRuntimeHint = () =>
  `${SYSTEM_MARK} Runtime is direct; sandboxing does not apply.`;
const formatInternalExecPersistenceDeniedText = () =>
  "Exec defaults require operator.admin for gateway callers; skipped persistence.";
const formatInternalVerbosePersistenceDeniedText = () =>
  "Verbose defaults require operator.admin for gateway callers; skipped persistence.";
const formatInternalVerboseCurrentReplyOnlyText = () =>
  "Verbose logging set for the current reply only.";
function canPersistSessionDirectiveDefaults(params) {
  const messageProvider = normalizeOptionalString(params.messageProvider);
  const surface = normalizeOptionalString(params.surface);
  const authoritativeChannel = messageProvider ?? surface;
  if (!authoritativeChannel) return true;
  if (isInternalMessageChannel(authoritativeChannel))
    return params.gatewayClientScopes?.includes("operator.admin") === true;
  return params.commandAuthorized === true || params.senderIsOwner === true;
}
/** Names explicit directive writes that snapshot equality cannot infer. */
function resolveDirectiveTouchedSessionFields(params) {
  const { directives } = params;
  const fields = /* @__PURE__ */ new Set();
  if (directives.hasThinkDirective) fields.add("thinkingLevel");
  if (directives.hasFastDirective) fields.add("fastMode");
  if (directives.hasVerboseDirective && params.allowInternalVerbosePersistence)
    fields.add("verboseLevel");
  if (directives.hasTraceDirective) fields.add("traceLevel");
  if (directives.hasReasoningDirective) fields.add("reasoningLevel");
  if (directives.hasElevatedDirective) fields.add("elevatedLevel");
  if (directives.hasModelDirective)
    for (const field of SESSION_MODEL_OVERRIDE_TRANSACTION_FIELDS) fields.add(field);
  if (directives.hasExecDirective && params.allowInternalExecPersistence) {
    if (directives.execHost) fields.add("execHost");
    if (directives.execSecurity) fields.add("execSecurity");
    if (directives.execAsk) fields.add("execAsk");
    if (directives.execNode) fields.add("execNode");
  }
  if (directives.hasQueueDirective) {
    if (directives.queueReset || directives.queueMode) fields.add("queueMode");
    if (directives.queueReset || typeof directives.debounceMs === "number")
      fields.add("queueDebounceMs");
    if (directives.queueReset || typeof directives.cap === "number") fields.add("queueCap");
    if (directives.queueReset || directives.dropPolicy) fields.add("queueDrop");
  }
  return [...fields];
}
const formatElevatedEvent = (level) => {
  if (level === "full") return "Elevated FULL - exec runs on host with auto-approval.";
  if (level === "ask" || level === "on")
    return "Elevated ASK - exec runs on host; approvals may still apply.";
  return "Elevated OFF - exec stays in sandbox.";
};
const formatReasoningEvent = (level) => {
  if (level === "stream") return "Reasoning STREAM - emit live <think>.";
  if (level === "on") return "Reasoning ON - include <think>.";
  return "Reasoning OFF - hide <think>.";
};
function enqueueModeSwitchEvents(params) {
  if (params.elevatedChanged) {
    const nextElevated = params.sessionEntry.elevatedLevel ?? "off";
    params.enqueueSystemEvent(formatElevatedEvent(nextElevated), {
      sessionKey: params.sessionKey,
      contextKey: "mode:elevated",
    });
  }
  if (params.reasoningChanged) {
    const nextReasoning = params.sessionEntry.reasoningLevel ?? "off";
    params.enqueueSystemEvent(formatReasoningEvent(nextReasoning), {
      sessionKey: params.sessionKey,
      contextKey: "mode:reasoning",
    });
  }
}
function formatElevatedUnavailableText(_params) {
  return "elevated unavailable";
}
//#endregion
export {
  formatElevatedUnavailableText as a,
  formatInternalVerbosePersistenceDeniedText as c,
  applyModelRuntimeDirective as d,
  resolveModelRuntimeDirective as f,
  formatElevatedRuntimeHint as i,
  resolveDirectiveTouchedSessionFields as l,
  enqueueModeSwitchEvents as n,
  formatInternalExecPersistenceDeniedText as o,
  formatDirectiveAck as r,
  formatInternalVerboseCurrentReplyOnlyText as s,
  canPersistSessionDirectiveDefaults as t,
  withOptions as u,
};
