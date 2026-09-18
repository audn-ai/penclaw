import {
  a as CLAUDE_CLI_DEFAULT_MODEL_REF,
  o as CLAUDE_CLI_MODEL_ALIASES,
  s as CLAUDE_CLI_SESSION_ID_FIELDS,
  t as CLAUDE_CLI_BACKEND_ID,
} from "./cli-constants-CpgfT8aN.js";
import {
  c as resolveClaudeCliExecutionArgs,
  i as normalizeClaudeBackendConfig,
  s as resolveClaudeCliAutoCompactEnv,
  t as CLAUDE_CLI_CLEAR_ENV,
} from "./cli-shared-KlT4css5.js";
import {
  n as CLI_RESUME_WATCHDOG_DEFAULTS,
  t as CLI_FRESH_WATCHDOG_DEFAULTS,
} from "./cli-watchdog-defaults-CzmnkdzO.js";
//#region extensions/anthropic/cli-backend.ts
/** Build the Claude CLI backend plugin descriptor. */
function buildAnthropicCliBackend() {
  return {
    id: CLAUDE_CLI_BACKEND_ID,
    modelProvider: "anthropic",
    liveTest: {
      defaultModelRef: CLAUDE_CLI_DEFAULT_MODEL_REF,
      defaultImageProbe: true,
      defaultMcpProbe: true,
      docker: {
        npmPackage: "@anthropic-ai/claude-code",
        binaryName: "claude",
      },
    },
    runtimeArtifact: {
      kind: "bundled-package-tree",
      packageName: "@anthropic-ai/claude-code",
      entrypoint: "command",
      nativeExecutableNames: ["claude", "claude.exe"],
    },
    bundleMcp: true,
    bundleMcpMode: "claude-config-file",
    nativeToolMode: "selectable",
    sideQuestionToolMode: "disabled",
    ownsNativeCompaction: true,
    config: {
      command: "claude",
      args: [
        "-p",
        "--output-format",
        "stream-json",
        "--include-partial-messages",
        "--verbose",
        "--setting-sources",
        "user",
        "--allowedTools",
        "mcp__openclaw__*",
        "--disallowedTools",
        "ScheduleWakeup,CronCreate,Bash(run_in_background:true),Monitor",
      ],
      resumeArgs: [
        "-p",
        "--output-format",
        "stream-json",
        "--include-partial-messages",
        "--verbose",
        "--setting-sources",
        "user",
        "--allowedTools",
        "mcp__openclaw__*",
        "--disallowedTools",
        "ScheduleWakeup,CronCreate,Bash(run_in_background:true),Monitor",
        "--resume",
        "{sessionId}",
      ],
      forkArg: "--fork-session",
      output: "jsonl",
      liveSession: "claude-stdio",
      input: "stdin",
      modelArg: "--model",
      modelAliases: CLAUDE_CLI_MODEL_ALIASES,
      imageArg: "@",
      imagePathScope: "workspace",
      sessionArg: "--session-id",
      sessionMode: "always",
      reseedFromRawTranscriptWhenUncompacted: true,
      sessionIdFields: [...CLAUDE_CLI_SESSION_ID_FIELDS],
      systemPromptFileArg: "--append-system-prompt-file",
      systemPromptMode: "append",
      systemPromptWhen: "always",
      clearEnv: [...CLAUDE_CLI_CLEAR_ENV],
      reliability: {
        watchdog: {
          fresh: { ...CLI_FRESH_WATCHDOG_DEFAULTS },
          resume: { ...CLI_RESUME_WATCHDOG_DEFAULTS },
        },
      },
      serialize: true,
    },
    normalizeConfig: normalizeClaudeBackendConfig,
    autoSelectAuthProfile: false,
    prepareExecution: ({ contextTokenBudget }) => {
      const env = resolveClaudeCliAutoCompactEnv(contextTokenBudget);
      return env ? { env } : void 0;
    },
    resolveExecutionArgs: resolveClaudeCliExecutionArgs,
  };
}
//#endregion
export { buildAnthropicCliBackend as t };
