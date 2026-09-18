import {
  Qi as CliBackendNormalizeConfigContext,
  ra as CliBackendResolveExecutionArgsContext,
} from "./types-Ga3mNO_F.js";
import { gn as CliBackendConfig } from "./types.openclaw-DDo8sH3F.js";
//#region extensions/anthropic/cli-shared.d.ts
/** Environment variables removed before launching OpenClaw-managed Claude CLI runs. */
declare const CLAUDE_CLI_CLEAR_ENV: readonly [
  "ANTHROPIC_API_KEY",
  "ANTHROPIC_API_KEY_OLD",
  "ANTHROPIC_API_TOKEN",
  "ANTHROPIC_AUTH_TOKEN",
  "ANTHROPIC_BASE_URL",
  "ANTHROPIC_CUSTOM_HEADERS",
  "ANTHROPIC_OAUTH_TOKEN",
  "ANTHROPIC_UNIX_SOCKET",
  "CLAUDE_CONFIG_DIR",
  "CLAUDE_CODE_AUTO_COMPACT_WINDOW",
  "CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR",
  "CLAUDE_CODE_ENTRYPOINT",
  "CLAUDE_CODE_OAUTH_REFRESH_TOKEN",
  "CLAUDE_CODE_OAUTH_SCOPES",
  "CLAUDE_CODE_OAUTH_TOKEN",
  "CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR",
  "CLAUDE_CODE_PLUGIN_CACHE_DIR",
  "CLAUDE_CODE_PLUGIN_SEED_DIR",
  "CLAUDE_CODE_REMOTE",
  "CLAUDE_CODE_USE_COWORK_PLUGINS",
  "CLAUDE_CODE_USE_BEDROCK",
  "CLAUDE_CODE_USE_FOUNDRY",
  "CLAUDE_CODE_USE_VERTEX",
  "OTEL_EXPORTER_OTLP_ENDPOINT",
  "OTEL_EXPORTER_OTLP_HEADERS",
  "OTEL_EXPORTER_OTLP_LOGS_ENDPOINT",
  "OTEL_EXPORTER_OTLP_LOGS_HEADERS",
  "OTEL_EXPORTER_OTLP_LOGS_PROTOCOL",
  "OTEL_EXPORTER_OTLP_METRICS_ENDPOINT",
  "OTEL_EXPORTER_OTLP_METRICS_HEADERS",
  "OTEL_EXPORTER_OTLP_METRICS_PROTOCOL",
  "OTEL_EXPORTER_OTLP_PROTOCOL",
  "OTEL_EXPORTER_OTLP_TRACES_ENDPOINT",
  "OTEL_EXPORTER_OTLP_TRACES_HEADERS",
  "OTEL_EXPORTER_OTLP_TRACES_PROTOCOL",
  "OTEL_LOGS_EXPORTER",
  "OTEL_METRICS_EXPORTER",
  "OTEL_SDK_DISABLED",
  "OTEL_TRACES_EXPORTER",
];
/** Explicit thinking opt-out for Claude CLI routes unsupported by Claude Code. */
declare const CLAUDE_CLI_OFF_THINKING_PROFILE: {
  readonly levels: readonly [
    {
      readonly id: "off";
    },
  ];
  readonly defaultLevel: "off";
};
/** Return whether a provider id refers to the Claude CLI backend. */
declare function isClaudeCliProvider(providerId: string): boolean;
/** Map OpenClaw's effective context budget to Claude Code's native compactor. */
declare function resolveClaudeCliAutoCompactEnv(
  contextTokenBudget: number | undefined,
): Record<string, string> | undefined;
/** Resolve Claude permission mode from OpenClaw exec security settings. */
declare function resolveClaudePermissionMode(context?: CliBackendNormalizeConfigContext): {
  mode?: string;
  overrideExisting: boolean;
};
/** Normalize Claude permission arguments, removing legacy skip-permissions flags. */
declare function normalizeClaudePermissionArgs(
  args?: string[],
  options?: {
    mode?: string;
    overrideExisting?: boolean;
  },
): string[] | undefined;
/** Ensure Claude CLI setting sources stay restricted to user settings. */
declare function normalizeClaudeSettingSourcesArgs(args?: string[]): string[] | undefined;
/** Resolve final Claude CLI execution args for one backend invocation. */
declare function resolveClaudeCliExecutionArgs(
  context: CliBackendResolveExecutionArgsContext,
): string[];
/** Normalize Claude CLI backend config before registration or execution. */
declare function normalizeClaudeBackendConfig(
  config: CliBackendConfig,
  context?: CliBackendNormalizeConfigContext,
): CliBackendConfig;
//#endregion
export {
  normalizeClaudePermissionArgs as a,
  resolveClaudeCliExecutionArgs as c,
  normalizeClaudeBackendConfig as i,
  resolveClaudePermissionMode as l,
  CLAUDE_CLI_OFF_THINKING_PROFILE as n,
  normalizeClaudeSettingSourcesArgs as o,
  isClaudeCliProvider as r,
  resolveClaudeCliAutoCompactEnv as s,
  CLAUDE_CLI_CLEAR_ENV as t,
};
