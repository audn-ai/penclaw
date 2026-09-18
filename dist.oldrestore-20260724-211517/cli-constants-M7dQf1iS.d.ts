//#region extensions/anthropic/cli-constants.d.ts
/**
 * Shared Claude CLI constants. These identify the synthetic backend, default
 * model refs, aliases, and session-id fields used across runtime and setup.
 */
/** Synthetic provider/backend id for Claude Code CLI-backed Anthropic models. */
declare const CLAUDE_CLI_BACKEND_ID = "claude-cli";
/** Default Claude CLI model ref for agent defaults and live tests. */
declare const CLAUDE_CLI_DEFAULT_MODEL_REF = "claude-cli/claude-opus-4-8";
/** Provider-relative model id for Anthropic runtime-policy resolution. */
declare const CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_ID: string;
/** Canonical model ref routed to the Claude CLI backend by Anthropic setup. */
declare const CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_REF: string;
/** Default Claude CLI models allowed when setup seeds the model allowlist. */
declare const CLAUDE_CLI_DEFAULT_ALLOWLIST_REFS: readonly [
  "claude-cli/claude-opus-4-8",
  "claude-cli/claude-sonnet-5",
  "claude-cli/claude-opus-4-7",
  "claude-cli/claude-sonnet-4-6",
  "claude-cli/claude-opus-4-6",
];
/** User-facing Claude CLI model aliases normalized before execution. */
declare const CLAUDE_CLI_MODEL_ALIASES: Record<string, string>;
/** JSONL fields that may contain Claude CLI session ids. */
declare const CLAUDE_CLI_SESSION_ID_FIELDS: readonly [
  "session_id",
  "sessionId",
  "conversation_id",
  "conversationId",
];
//#endregion
export {
  CLAUDE_CLI_DEFAULT_MODEL_REF as a,
  CLAUDE_CLI_DEFAULT_ALLOWLIST_REFS as i,
  CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_ID as n,
  CLAUDE_CLI_MODEL_ALIASES as o,
  CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_REF as r,
  CLAUDE_CLI_SESSION_ID_FIELDS as s,
  CLAUDE_CLI_BACKEND_ID as t,
};
