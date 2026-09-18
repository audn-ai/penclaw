//#region src/plugins/hook-before-agent-start.types.ts
const PLUGIN_PROMPT_MUTATION_RESULT_FIELDS = [
  "systemPrompt",
  "prependContext",
  "appendContext",
  "prependSystemContext",
  "appendSystemContext",
];
const stripPromptMutationFieldsFromLegacyHookResult = (result) => {
  if (!result || typeof result !== "object") return result;
  const remaining = { ...result };
  for (const field of PLUGIN_PROMPT_MUTATION_RESULT_FIELDS) delete remaining[field];
  return Object.keys(remaining).length > 0 ? remaining : void 0;
};
//#endregion
//#region src/plugins/hook-before-tool-call-result.ts
const PluginApprovalResolutions = {
  ALLOW_ONCE: "allow-once",
  ALLOW_ALWAYS: "allow-always",
  DENY: "deny",
  TIMEOUT: "timeout",
  CANCELLED: "cancelled",
};
//#endregion
//#region src/plugins/hook-types.ts
const PLUGIN_HOOK_NAMES = [
  "before_model_resolve",
  "agent_turn_prepare",
  "before_prompt_build",
  "before_agent_start",
  "before_agent_reply",
  "model_call_started",
  "model_call_ended",
  "llm_input",
  "llm_output",
  "before_agent_finalize",
  "agent_end",
  "before_compaction",
  "after_compaction",
  "before_reset",
  "inbound_claim",
  "channel_pairing_requested",
  "message_received",
  "message_sending",
  "reply_payload_sending",
  "message_sent",
  "before_tool_call",
  "after_tool_call",
  "tool_result_persist",
  "before_message_write",
  "session_start",
  "session_end",
  "subagent_spawning",
  "subagent_delivery_target",
  "subagent_spawned",
  "subagent_ended",
  "deactivate",
  "gateway_start",
  "gateway_stop",
  "heartbeat_prompt_contribution",
  "cron_reconciled",
  "cron_changed",
  "before_dispatch",
  "reply_dispatch",
  "before_install",
  "before_agent_run",
  "resolve_exec_env",
];
const DEPRECATED_PLUGIN_HOOKS = {
  subagent_spawning: {
    replacement: "`subagent_spawned` for observation; core session bindings for routing",
    reason:
      "Core prepares thread-bound subagent bindings through channel session-binding adapters before `subagent_spawned` fires.",
    removeAfter: "2026-08-30",
  },
  deactivate: {
    replacement: "`gateway_stop`",
    reason: "`deactivate` is a legacy cleanup hook alias for `gateway_stop`.",
    removeAfter: "2026-08-16",
  },
};
const DEPRECATED_PLUGIN_HOOK_NAMES = Object.keys(DEPRECATED_PLUGIN_HOOKS);
const deprecatedPluginHookNameSet = new Set(DEPRECATED_PLUGIN_HOOK_NAMES);
const isDeprecatedPluginHookName = (hookName) => deprecatedPluginHookNameSet.has(hookName);
const pluginHookNameSet = new Set(PLUGIN_HOOK_NAMES);
const isPluginHookName = (hookName) =>
  typeof hookName === "string" && pluginHookNameSet.has(hookName);
const PROMPT_INJECTION_HOOK_NAMES = [
  "agent_turn_prepare",
  "before_prompt_build",
  "before_agent_start",
  "heartbeat_prompt_contribution",
];
const promptInjectionHookNameSet = new Set(PROMPT_INJECTION_HOOK_NAMES);
const isPromptInjectionHookName = (hookName) => promptInjectionHookNameSet.has(hookName);
const CONVERSATION_HOOK_NAMES = [
  "before_model_resolve",
  "before_agent_reply",
  "llm_input",
  "llm_output",
  "before_agent_finalize",
  "agent_end",
  "before_agent_run",
];
const conversationHookNameSet = new Set(CONVERSATION_HOOK_NAMES);
const isConversationHookName = (hookName) => conversationHookNameSet.has(hookName);
//#endregion
//#region src/plugins/types.ts
/** Permanent provider rejection recorded as a terminal worker failure. */
var WorkerProviderError = class extends Error {
  constructor(message) {
    super(message);
    this.code = "invalid_profile";
    this.name = "WorkerProviderError";
  }
};
/**
 * Definition for a plugin-registered command.
 */
const AGENT_PROMPT_SURFACE_KINDS = [
  "openclaw_main",
  "pi_main",
  "codex_app_server",
  "cli_backend",
  "acp_backend",
  "subagent",
];
//#endregion
export {
  DEPRECATED_PLUGIN_HOOK_NAMES as a,
  isConversationHookName as c,
  isPromptInjectionHookName as d,
  PluginApprovalResolutions as f,
  DEPRECATED_PLUGIN_HOOKS as i,
  isDeprecatedPluginHookName as l,
  stripPromptMutationFieldsFromLegacyHookResult as m,
  WorkerProviderError as n,
  PLUGIN_HOOK_NAMES as o,
  PLUGIN_PROMPT_MUTATION_RESULT_FIELDS as p,
  CONVERSATION_HOOK_NAMES as r,
  PROMPT_INJECTION_HOOK_NAMES as s,
  AGENT_PROMPT_SURFACE_KINDS as t,
  isPluginHookName as u,
};
