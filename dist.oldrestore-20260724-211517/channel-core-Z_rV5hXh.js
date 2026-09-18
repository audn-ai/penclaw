import { r as createChannelPluginBase$1 } from "./core-V3U0lOIj.js";
//#region src/plugin-sdk/channel-config-ui-hints.ts
function createChannelDmPolicyUiHints(params) {
  const hint = {
    label: `${params.channelLabel} DM Policy`,
    help: `Direct message access control ("pairing" recommended). "open" requires channels.${params.channelKey}.allowFrom=["*"].`,
  };
  const legacyHint = {
    "dm.policy": {
      label: hint.label,
      help: `${hint.help.slice(0, -1)} (legacy: channels.${params.channelKey}.dm.allowFrom).`,
    },
  };
  if (!params.includeLegacyNestedPolicy) return { dmPolicy: hint };
  return params.legacyNestedPolicyOrder === "after"
    ? {
        dmPolicy: hint,
        ...legacyHint,
      }
    : {
        ...legacyHint,
        dmPolicy: hint,
      };
}
function createChannelConfigWritesUiHint(channelLabel) {
  return {
    configWrites: {
      label: `${channelLabel} Config Writes`,
      help: `Allow ${channelLabel} to write config in response to channel events/commands (default: true).`,
    },
  };
}
function createChannelMentionPatternUiHints(params) {
  const policySuffix = params.policyNote ? ` ${params.policyNote}` : "";
  const denySuffix = params.denyNote ? ` ${params.denyNote}` : "";
  return {
    mentionPatterns: {
      label: `${params.channelLabel} Mention Pattern Policy`,
      help: `Scopes configured groupChat mentionPatterns to selected ${params.policyTargetDescription ?? params.targetDescription}.${policySuffix}`,
    },
    "mentionPatterns.mode": {
      label: `${params.channelLabel} Mention Pattern Mode`,
      help: '"allow" enables configured regex mention patterns unless denyIn matches; "deny" disables them unless allowIn matches.',
    },
    "mentionPatterns.allowIn": {
      label: `${params.channelLabel} Mention Pattern Allowlist`,
      help: `${params.targetDescription} where configured regex mention patterns are enabled when mode is deny.`,
    },
    "mentionPatterns.denyIn": {
      label: `${params.channelLabel} Mention Pattern Denylist`,
      help: `${params.targetDescription} where configured regex mention patterns are disabled.${denySuffix}`,
    },
  };
}
function createChannelNativeCommandUiHints(channelLabel) {
  return {
    "commands.native": {
      label: `${channelLabel} Native Commands`,
      help: `Override native commands for ${channelLabel} (bool or "auto").`,
    },
    "commands.nativeSkills": {
      label: `${channelLabel} Native Skill Commands`,
      help: `Override native skill commands for ${channelLabel} (bool or "auto").`,
    },
  };
}
function createChannelProgressUiHints(params) {
  const channelLabel = params.channelLabel;
  const commentaryHint = {
    "streaming.progress.commentary": {
      label: `${channelLabel} Progress Commentary`,
      help: "Show assistant commentary/preamble text in the temporary progress draft. Final answer delivery is unchanged.",
    },
  };
  return {
    "streaming.progress.label": {
      label: `${channelLabel} Progress Label`,
      help: 'Initial progress draft title. Use "auto" for built-in single-word labels, a custom string, or false to hide the title.',
    },
    "streaming.progress.labels": {
      label: `${channelLabel} Progress Label Pool`,
      help: 'Candidate labels for streaming.progress.label="auto". Leave unset to use the built-in "Working" label.',
    },
    "streaming.progress.maxLines": {
      label: `${channelLabel} Progress Max Lines`,
      help: "Maximum number of compact progress lines to keep below the draft label (default: 8).",
    },
    "streaming.progress.maxLineChars": {
      label: `${channelLabel} Progress Max Line Chars`,
      help: "Maximum characters per compact progress line before truncation (default: 120). Prose cuts at word boundaries; commands and paths keep useful suffixes.",
    },
    "streaming.progress.toolProgress": {
      label: `${channelLabel} Progress Tool Lines`,
      help: "Show compact tool/progress lines in progress draft mode (default: true). Set false to keep only the label until final delivery.",
    },
    ...(params.includeCommentary && params.commentaryOrder !== "after-command"
      ? commentaryHint
      : {}),
    "streaming.progress.commandText": {
      label: `${channelLabel} Progress Command Text`,
      help: 'Command/exec detail in progress draft lines: "raw" preserves released behavior; "status" shows only the tool label.',
    },
    ...(params.includeCommentary && params.commentaryOrder === "after-command"
      ? commentaryHint
      : {}),
  };
}
function createChannelRetryUiHints(channelLabel) {
  return {
    "retry.attempts": {
      label: `${channelLabel} Retry Attempts`,
      help: `Max retry attempts for outbound ${channelLabel} API calls (default: 3).`,
    },
    "retry.minDelayMs": {
      label: `${channelLabel} Retry Min Delay (ms)`,
      help: `Minimum retry delay in ms for ${channelLabel} outbound calls.`,
    },
    "retry.maxDelayMs": {
      label: `${channelLabel} Retry Max Delay (ms)`,
      help: `Maximum retry delay cap in ms for ${channelLabel} outbound calls.`,
    },
    "retry.jitter": {
      label: `${channelLabel} Retry Jitter`,
      help: `Jitter factor (0-1) applied to ${channelLabel} retry delays.`,
    },
  };
}
function createChannelConfigUiHints(params) {
  return {
    ...(params.dmPolicy
      ? createChannelDmPolicyUiHints({
          channelLabel: params.channelLabel,
          ...params.dmPolicy,
        })
      : {}),
    ...(params.configWrites ? createChannelConfigWritesUiHint(params.channelLabel) : {}),
    ...(params.mentionPatterns
      ? createChannelMentionPatternUiHints({
          channelLabel: params.channelLabel,
          ...params.mentionPatterns,
        })
      : {}),
    ...(params.nativeCommands ? createChannelNativeCommandUiHints(params.channelLabel) : {}),
    ...(params.progress
      ? createChannelProgressUiHints({
          channelLabel: params.channelLabel,
          ...params.progress,
        })
      : {}),
    ...(params.retry ? createChannelRetryUiHints(params.channelLabel) : {}),
  };
}
//#endregion
//#region src/plugin-sdk/channel-core.ts
/** Creates a channel plugin base while keeping the public import on this SDK subpath. */
const createChannelPluginBase = (params) => createChannelPluginBase$1(params);
//#endregion
export { createChannelConfigUiHints as n, createChannelPluginBase as t };
