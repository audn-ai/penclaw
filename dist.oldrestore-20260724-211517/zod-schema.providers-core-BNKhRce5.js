import { n as ZodIssueCode } from "./compat-Ci0Yc9vr.js";
import {
  n as normalizeSlashCommandName,
  r as resolveCustomCommands,
  t as normalizeCommandDescription,
} from "./custom-command-config-DMXY6NZq.js";
import { n as isValidInboundPathRootPattern } from "./inbound-path-policy-CH_uJYn5.js";
import {
  At as boolean,
  Et as array,
  Nn as record,
  Rn as string,
  Si as NEVER,
  Tn as object,
  Xn as union,
  Zn as unknown,
  dn as literal,
  wn as number,
  yt as _enum,
} from "./schemas-CBJjibl3.js";
import { t as isSafeScpRemoteHost } from "./scp-host-BtrM4IVE.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { c as hasConfiguredSecretInput } from "./types.secrets-BV0ywRAy.js";
import { l as ToolPolicySchema } from "./zod-schema.agent-runtime-D8C103DW.js";
import {
  i as ChannelHeartbeatVisibilitySchema,
  o as NativeExecApprovalEnableModeSchema,
  r as ChannelHealthMonitorSchema,
} from "./zod-schema.channels-config-TJLOUrM6.js";
import {
  A as TextChunkModeSchema,
  E as SecretInputSchema,
  F as TtsConfigSchema,
  H as requireAllowlistAllowFrom,
  T as RetryConfigSchema,
  U as requireOpenAllowFrom,
  _ as MarkdownConfigSchema,
  c as DmPolicySchema,
  d as GroupPolicySchema,
  f as HexColorSchema,
  g as MSTeamsReplyStyleSchema,
  i as ChannelStreamingBlockSchema,
  l as ExecutableTokenSchema,
  o as ContextVisibilityModeSchema,
  r as ChannelDeliveryStreamingConfigSchema,
  s as DmConfigSchema,
  t as BlockStreamingChunkSchema,
  v as MentionPatternsPolicySchema,
  w as ReplyToModeSchema,
  x as ProviderCommandsSchema,
} from "./zod-schema.core-CWTCY1ZZ.js";
import { t as sensitive } from "./zod-schema.sensitive-WMWbzq4S.js";
//#region src/config/zod-schema.secret-input-validation.ts
function forEachEnabledAccount(accounts, run) {
  if (!accounts) return;
  for (const [accountId, account] of Object.entries(accounts)) {
    if (!account || account.enabled === false) continue;
    run(accountId, account);
  }
}
/** Validates Telegram webhook URLs have a usable shared or account webhook secret. */
function validateTelegramWebhookSecretRequirements(value, ctx) {
  const baseWebhookUrl = normalizeOptionalString(value.webhookUrl) ?? "";
  const hasBaseWebhookSecret = hasConfiguredSecretInput(value.webhookSecret);
  if (baseWebhookUrl && !hasBaseWebhookSecret)
    ctx.addIssue({
      code: ZodIssueCode.custom,
      message: "channels.telegram.webhookUrl requires channels.telegram.webhookSecret",
      path: ["webhookSecret"],
    });
  forEachEnabledAccount(value.accounts, (accountId, account) => {
    if (!(normalizeOptionalString(account.webhookUrl) ?? "")) return;
    if (!hasConfiguredSecretInput(account.webhookSecret) && !hasBaseWebhookSecret)
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message:
          "channels.telegram.accounts.*.webhookUrl requires channels.telegram.webhookSecret or channels.telegram.accounts.*.webhookSecret",
        path: ["accounts", accountId, "webhookSecret"],
      });
  });
}
function validateSlackSigningSecretRequirements(value, ctx) {
  const resolveMode = (mode) =>
    mode === "http" || mode === "socket" || mode === "relay" ? mode : void 0;
  const baseMode = resolveMode(value.mode) ?? "socket";
  if (baseMode === "http" && !hasConfiguredSecretInput(value.signingSecret))
    ctx.addIssue({
      code: ZodIssueCode.custom,
      message: 'channels.slack.mode="http" requires channels.slack.signingSecret',
      path: ["signingSecret"],
    });
  forEachEnabledAccount(value.accounts, (accountId, account) => {
    if ((resolveMode(account.mode) ?? baseMode) !== "http") return;
    if (!hasConfiguredSecretInput(account.signingSecret ?? value.signingSecret))
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message:
          'channels.slack.accounts.*.mode="http" requires channels.slack.signingSecret or channels.slack.accounts.*.signingSecret',
        path: ["accounts", accountId, "signingSecret"],
      });
  });
}
//#endregion
//#region src/config/zod-schema.providers-core.ts
const ToolPolicyBySenderSchema = record(string(), ToolPolicySchema).optional();
const DiscordIdSchema = union([string(), number()])
  .transform((value, ctx) => {
    if (typeof value === "number") {
      if (!Number.isSafeInteger(value) || value < 0) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          message: `Discord ID "${String(value)}" is not a valid non-negative safe integer. Wrap it in quotes in your config file.`,
        });
        return NEVER;
      }
      return String(value);
    }
    return value;
  })
  .pipe(string());
const DiscordIdListSchema = array(DiscordIdSchema);
const DiscordSnowflakeStringSchema = string().regex(/^\d+$/, "Discord user ID must be numeric");
const TelegramInlineButtonsScopeSchema = _enum(["off", "dm", "group", "all", "allowlist"]);
const TelegramIdListSchema = array(union([string(), number()]));
const TelegramCapabilitiesSchema = union([
  array(string()),
  object({ inlineButtons: TelegramInlineButtonsScopeSchema.optional() }).strict(),
]);
const UnifiedStreamingModeSchema = _enum(["off", "partial", "block", "progress"]);
const ChannelStreamingPreviewSchema = object({
  chunk: BlockStreamingChunkSchema.optional(),
  toolProgress: boolean().optional(),
  commandText: _enum(["raw", "status"]).optional(),
}).strict();
const ChannelStreamingProgressSchema = object({
  label: union([string(), literal(false)]).optional(),
  labels: array(string()).optional(),
  maxLines: number().int().positive().optional(),
  maxLineChars: number().int().positive().optional(),
  render: _enum(["text", "rich"]).optional(),
  toolProgress: boolean().optional(),
  commandText: _enum(["raw", "status"]).optional(),
  commentary: boolean().optional(),
  narration: boolean().optional(),
}).strict();
const DiscordStreamingProgressSchema = ChannelStreamingProgressSchema;
const SlackStreamingProgressSchema = ChannelStreamingProgressSchema.extend({
  nativeTaskCards: boolean().optional(),
}).strict();
const ChannelPreviewStreamingConfigSchema = object({
  mode: UnifiedStreamingModeSchema.optional(),
  chunkMode: TextChunkModeSchema.optional(),
  preview: ChannelStreamingPreviewSchema.optional(),
  progress: ChannelStreamingProgressSchema.optional(),
  block: ChannelStreamingBlockSchema.optional(),
}).strict();
const TelegramPreviewStreamingConfigSchema = ChannelPreviewStreamingConfigSchema.extend({
  preview: ChannelStreamingPreviewSchema.optional(),
}).strict();
const DiscordPreviewStreamingConfigSchema = ChannelPreviewStreamingConfigSchema.extend({
  progress: DiscordStreamingProgressSchema.optional(),
}).strict();
const SlackStreamingConfigSchema = ChannelPreviewStreamingConfigSchema.extend({
  nativeTransport: boolean().optional(),
  progress: SlackStreamingProgressSchema.optional(),
}).strict();
const SlackCapabilitiesSchema = union([
  array(string()),
  object({ interactiveReplies: boolean().optional() }).strict(),
]);
const BotLoopProtectionSchema = object({
  enabled: boolean().optional(),
  maxEventsPerWindow: number().int().positive().optional(),
  windowSeconds: number().int().positive().optional(),
  cooldownSeconds: number().int().positive().optional(),
}).strict();
const TelegramErrorPolicySchema = _enum(["always", "once", "silent"]).optional();
const TelegramCustomCommandConfig = {
  label: "Telegram",
  pattern: /^[a-z0-9_]{1,32}$/,
  patternDescription: "use a-z, 0-9, underscore; max 32 chars",
};
const TelegramTopicSchema = object({
  requireMention: boolean().optional(),
  ingest: boolean().optional(),
  disableAudioPreflight: boolean().optional(),
  groupPolicy: GroupPolicySchema.optional(),
  skills: array(string()).optional(),
  enabled: boolean().optional(),
  allowFrom: array(union([string(), number()])).optional(),
  systemPrompt: string().optional(),
  agentId: string().optional(),
  errorPolicy: TelegramErrorPolicySchema,
  errorCooldownMs: number().int().nonnegative().optional(),
}).strict();
const TelegramGroupSchema = object({
  requireMention: boolean().optional(),
  ingest: boolean().optional(),
  disableAudioPreflight: boolean().optional(),
  groupPolicy: GroupPolicySchema.optional(),
  tools: ToolPolicySchema,
  toolsBySender: ToolPolicyBySenderSchema,
  skills: array(string()).optional(),
  enabled: boolean().optional(),
  allowFrom: array(union([string(), number()])).optional(),
  systemPrompt: string().optional(),
  topics: record(string(), TelegramTopicSchema.optional()).optional(),
  errorPolicy: TelegramErrorPolicySchema,
  errorCooldownMs: number().int().nonnegative().optional(),
}).strict();
const AutoTopicLabelSchema = union([
  boolean(),
  object({
    enabled: boolean().optional(),
    prompt: string().optional(),
  }).strict(),
]).optional();
const TelegramDirectSchema = object({
  dmPolicy: DmPolicySchema.optional(),
  tools: ToolPolicySchema,
  toolsBySender: ToolPolicyBySenderSchema,
  skills: array(string()).optional(),
  enabled: boolean().optional(),
  allowFrom: array(union([string(), number()])).optional(),
  systemPrompt: string().optional(),
  topics: record(string(), TelegramTopicSchema.optional()).optional(),
  errorPolicy: TelegramErrorPolicySchema,
  errorCooldownMs: number().int().nonnegative().optional(),
  requireTopic: boolean().optional(),
  autoTopicLabel: AutoTopicLabelSchema,
}).strict();
const TelegramCustomCommandSchema = object({
  command: string().overwrite(normalizeSlashCommandName),
  description: string().overwrite(normalizeCommandDescription),
}).strict();
const validateTelegramCustomCommands = (value, ctx) => {
  if (!value.customCommands || value.customCommands.length === 0) return;
  const { issues } = resolveCustomCommands({
    commands: value.customCommands,
    checkReserved: false,
    checkDuplicates: false,
    config: TelegramCustomCommandConfig,
  });
  for (const issue of issues)
    ctx.addIssue({
      code: ZodIssueCode.custom,
      path: ["customCommands", issue.index, issue.field],
      message: issue.message,
    });
};
const TelegramAccountSchemaBase = object({
  name: string().optional(),
  capabilities: TelegramCapabilitiesSchema.optional(),
  execApprovals: object({
    enabled: NativeExecApprovalEnableModeSchema.optional(),
    approvers: TelegramIdListSchema.optional(),
    agentFilter: array(string()).optional(),
    sessionFilter: array(string()).optional(),
    target: _enum(["dm", "channel", "both"]).optional(),
  })
    .strict()
    .optional(),
  markdown: MarkdownConfigSchema,
  enabled: boolean().optional(),
  commands: ProviderCommandsSchema,
  customCommands: array(TelegramCustomCommandSchema).optional(),
  configWrites: boolean().optional(),
  dmPolicy: DmPolicySchema.optional().default("pairing"),
  botToken: SecretInputSchema.optional().register(sensitive),
  tokenFile: string().optional(),
  replyToMode: ReplyToModeSchema.optional(),
  groups: record(string(), TelegramGroupSchema.optional()).optional(),
  allowFrom: array(union([string(), number()])).optional(),
  defaultTo: union([string(), number()]).optional(),
  groupAllowFrom: array(union([string(), number()])).optional(),
  groupPolicy: GroupPolicySchema.optional().default("allowlist"),
  mentionPatterns: MentionPatternsPolicySchema.optional(),
  contextVisibility: ContextVisibilityModeSchema.optional(),
  historyLimit: number().int().min(0).optional(),
  dmHistoryLimit: number().int().min(0).optional(),
  dms: record(string(), DmConfigSchema.optional()).optional(),
  direct: record(string(), TelegramDirectSchema.optional()).optional(),
  textChunkLimit: number().int().positive().optional(),
  richMessages: boolean().optional(),
  streaming: TelegramPreviewStreamingConfigSchema.optional(),
  mediaMaxMb: number().positive().optional(),
  timeoutSeconds: number().int().positive().optional(),
  mediaGroupFlushMs: number()
    .int()
    .min(10)
    .max(6e4)
    .optional()
    .describe(
      "Buffer window in milliseconds for Telegram media groups/albums before dispatching them as one inbound message. Default: 500.",
    ),
  pollingStallThresholdMs: number().int().min(3e4).max(6e5).optional(),
  retry: RetryConfigSchema,
  network: object({
    autoSelectFamily: boolean().optional(),
    dnsResultOrder: _enum(["ipv4first", "verbatim"]).optional(),
    dangerouslyAllowPrivateNetwork: boolean()
      .optional()
      .describe(
        "Dangerous opt-in for trusted Telegram fake-IP or transparent-proxy environments where api.telegram.org resolves to private/internal/special-use addresses during media downloads.",
      ),
  })
    .strict()
    .optional(),
  proxy: string().optional(),
  webhookUrl: string()
    .optional()
    .describe(
      "Public HTTPS webhook URL registered with Telegram for inbound updates. This must be internet-reachable and requires channels.telegram.webhookSecret.",
    ),
  webhookSecret: SecretInputSchema.optional()
    .describe(
      "Secret token sent to Telegram during webhook registration and verified on inbound webhook requests. Telegram returns this value for verification; this is not the gateway auth token and not the bot token.",
    )
    .register(sensitive),
  webhookPath: string()
    .optional()
    .describe(
      "Local webhook route path served by the gateway listener. Defaults to /telegram-webhook.",
    ),
  webhookHost: string()
    .optional()
    .describe(
      "Local bind host for the webhook listener. Defaults to 127.0.0.1; keep loopback unless you intentionally expose direct ingress.",
    ),
  webhookPort: number()
    .int()
    .nonnegative()
    .optional()
    .describe(
      "Local bind port for the webhook listener. Defaults to 8787; set to 0 to let the OS assign an ephemeral port.",
    ),
  webhookCertPath: string()
    .optional()
    .describe(
      "Path to the self-signed certificate (PEM) to upload to Telegram during webhook registration. Required for self-signed certs (direct IP or no domain).",
    ),
  actions: object({
    reactions: boolean().optional(),
    sendMessage: boolean().optional(),
    poll: boolean().optional(),
    deleteMessage: boolean().optional(),
    editMessage: boolean().optional(),
    sticker: boolean().optional(),
    createForumTopic: boolean().optional(),
    editForumTopic: boolean().optional(),
  })
    .strict()
    .optional(),
  threadBindings: object({
    enabled: boolean().optional(),
    idleHours: number().nonnegative().optional(),
    maxAgeHours: number().nonnegative().optional(),
    spawnSessions: boolean().optional(),
    defaultSpawnContext: _enum(["isolated", "fork"]).optional(),
    spawnSubagentSessions: boolean().optional(),
    spawnAcpSessions: boolean().optional(),
  })
    .strict()
    .optional(),
  reactionNotifications: _enum(["off", "own", "all"]).optional(),
  reactionLevel: _enum(["off", "ack", "minimal", "extensive"]).optional(),
  heartbeat: ChannelHeartbeatVisibilitySchema,
  healthMonitor: ChannelHealthMonitorSchema,
  linkPreview: boolean().optional(),
  silentErrorReplies: boolean().optional(),
  responsePrefix: string().optional(),
  ackReaction: string().optional(),
  errorPolicy: TelegramErrorPolicySchema,
  errorCooldownMs: number().int().nonnegative().optional(),
  apiRoot: string().url().optional(),
  trustedLocalFileRoots: array(string())
    .optional()
    .describe(
      "Trusted local filesystem roots for self-hosted Telegram Bot API absolute file_path values. Only absolute paths under these roots are read directly; all other absolute paths are rejected.",
    ),
  autoTopicLabel: AutoTopicLabelSchema,
}).strict();
const TelegramAccountSchema = TelegramAccountSchemaBase.superRefine((value, ctx) => {
  validateTelegramCustomCommands(value, ctx);
});
const TelegramConfigSchema = TelegramAccountSchemaBase.extend({
  accounts: record(string(), TelegramAccountSchema.optional()).optional(),
  defaultAccount: string().optional(),
}).superRefine((value, ctx) => {
  requireOpenAllowFrom({
    policy: value.dmPolicy,
    allowFrom: value.allowFrom,
    ctx,
    path: ["allowFrom"],
    message:
      'channels.telegram.dmPolicy="open" requires channels.telegram.allowFrom to include "*"',
  });
  requireAllowlistAllowFrom({
    policy: value.dmPolicy,
    allowFrom: value.allowFrom,
    ctx,
    path: ["allowFrom"],
    message:
      'channels.telegram.dmPolicy="allowlist" requires channels.telegram.allowFrom to contain at least one sender ID',
  });
  validateTelegramCustomCommands(value, ctx);
  if (value.accounts)
    for (const [accountId, account] of Object.entries(value.accounts)) {
      if (!account) continue;
      const effectivePolicy = account.dmPolicy ?? value.dmPolicy;
      const effectiveAllowFrom = account.allowFrom ?? value.allowFrom;
      requireOpenAllowFrom({
        policy: effectivePolicy,
        allowFrom: effectiveAllowFrom,
        ctx,
        path: ["accounts", accountId, "allowFrom"],
        message:
          'channels.telegram.accounts.*.dmPolicy="open" requires channels.telegram.accounts.*.allowFrom (or channels.telegram.allowFrom) to include "*"',
      });
      requireAllowlistAllowFrom({
        policy: effectivePolicy,
        allowFrom: effectiveAllowFrom,
        ctx,
        path: ["accounts", accountId, "allowFrom"],
        message:
          'channels.telegram.accounts.*.dmPolicy="allowlist" requires channels.telegram.accounts.*.allowFrom (or channels.telegram.allowFrom) to contain at least one sender ID',
      });
    }
  if (!value.accounts) {
    validateTelegramWebhookSecretRequirements(value, ctx);
    return;
  }
  for (const [accountId, account] of Object.entries(value.accounts)) {
    if (!account) continue;
    if (account.enabled === false) continue;
    const effectiveDmPolicy = account.dmPolicy ?? value.dmPolicy;
    const effectiveAllowFrom = Array.isArray(account.allowFrom)
      ? account.allowFrom
      : value.allowFrom;
    requireOpenAllowFrom({
      policy: effectiveDmPolicy,
      allowFrom: effectiveAllowFrom,
      ctx,
      path: ["accounts", accountId, "allowFrom"],
      message:
        'channels.telegram.accounts.*.dmPolicy="open" requires channels.telegram.allowFrom or channels.telegram.accounts.*.allowFrom to include "*"',
    });
    requireAllowlistAllowFrom({
      policy: effectiveDmPolicy,
      allowFrom: effectiveAllowFrom,
      ctx,
      path: ["accounts", accountId, "allowFrom"],
      message:
        'channels.telegram.accounts.*.dmPolicy="allowlist" requires channels.telegram.allowFrom or channels.telegram.accounts.*.allowFrom to contain at least one sender ID',
    });
  }
  validateTelegramWebhookSecretRequirements(value, ctx);
});
const DiscordDmSchema = object({
  enabled: boolean().optional(),
  policy: DmPolicySchema.optional(),
  allowFrom: DiscordIdListSchema.optional(),
  groupEnabled: boolean().optional(),
  groupChannels: DiscordIdListSchema.optional(),
}).strict();
const DiscordThreadSchema = object({ inheritParent: boolean().optional() }).strict();
const DiscordGuildChannelSchema = object({
  requireMention: boolean().optional(),
  ignoreOtherMentions: boolean().optional(),
  tools: ToolPolicySchema,
  toolsBySender: ToolPolicyBySenderSchema,
  skills: array(string()).optional(),
  enabled: boolean().optional(),
  users: DiscordIdListSchema.optional(),
  roles: DiscordIdListSchema.optional(),
  systemPrompt: string().optional(),
  includeThreadStarter: boolean().optional(),
  autoThread: boolean().optional(),
  /** Naming strategy for auto-created threads. "message" uses message text; "generated" creates an LLM title after thread creation. */
  autoThreadName: _enum(["message", "generated"]).optional(),
  /** Archive duration for auto-created threads in minutes. Discord supports 60, 1440 (1 day), 4320 (3 days), 10080 (1 week). Default: 60. */
  autoArchiveDuration: union([
    _enum(["60", "1440", "4320", "10080"]),
    literal(60),
    literal(1440),
    literal(4320),
    literal(10080),
  ]).optional(),
}).strict();
const DiscordGuildSchema = object({
  slug: string().optional(),
  requireMention: boolean().optional(),
  ignoreOtherMentions: boolean().optional(),
  tools: ToolPolicySchema,
  toolsBySender: ToolPolicyBySenderSchema,
  reactionNotifications: _enum(["off", "own", "all", "allowlist"]).optional(),
  users: DiscordIdListSchema.optional(),
  roles: DiscordIdListSchema.optional(),
  channels: record(string(), DiscordGuildChannelSchema.optional()).optional(),
}).strict();
const DiscordUiSchema = object({
  components: object({ accentColor: HexColorSchema.optional() }).strict().optional(),
})
  .strict()
  .optional();
const DiscordVoiceAutoJoinSchema = object({
  guildId: string().min(1),
  channelId: string().min(1),
}).strict();
const DiscordVoiceAllowedChannelSchema = object({
  guildId: string().min(1),
  channelId: string().min(1),
}).strict();
const DiscordVoiceRealtimeToolPolicySchema = _enum(["safe-read-only", "owner", "none"]);
const DiscordVoiceRealtimeConsultPolicySchema = _enum(["auto", "always"]);
const DiscordVoiceRealtimeBootstrapContextFileSchema = _enum(["IDENTITY.md", "USER.md", "SOUL.md"]);
const DiscordVoiceRealtimeWakeNameSchema = string()
  .min(1)
  .regex(/^\s*[^a-z0-9]*[a-z0-9]+(?:[^a-z0-9]+[a-z0-9]+)?[^a-z0-9]*\s*$/i, {
    message: "Discord realtime wake names must be one or two words.",
  });
const DiscordVoiceRealtimeSchema = object({
  provider: string().min(1).optional(),
  model: string().min(1).optional(),
  speakerVoice: string().min(1).optional(),
  speakerVoiceId: string().min(1).optional(),
  voice: string().min(1).optional(),
  instructions: string().min(1).optional(),
  toolPolicy: DiscordVoiceRealtimeToolPolicySchema.optional(),
  consultPolicy: DiscordVoiceRealtimeConsultPolicySchema.optional(),
  requireWakeName: boolean().optional(),
  wakeNames: array(DiscordVoiceRealtimeWakeNameSchema).min(1).optional(),
  bootstrapContextFiles: array(DiscordVoiceRealtimeBootstrapContextFileSchema).optional(),
  bargeIn: boolean().optional(),
  minBargeInAudioEndMs: number().int().min(0).max(1e4).optional(),
  debounceMs: number().int().positive().max(1e4).optional(),
  providers: record(string(), record(string(), unknown()).optional()).optional(),
}).strict();
const DiscordVoiceAgentSessionSchema = object({
  mode: _enum(["voice", "target"]).optional(),
  target: string().min(1).optional(),
})
  .strict()
  .superRefine((value, ctx) => {
    if (value.mode === "target" && !value.target)
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: ["target"],
        message: 'voice.agentSession.target is required when mode is "target"',
      });
  });
const DiscordVoiceSchema = object({
  enabled: boolean().optional(),
  mode: _enum(["stt-tts", "agent-proxy", "bidi"]).optional(),
  agentSession: DiscordVoiceAgentSessionSchema.optional(),
  model: string().min(1).optional(),
  realtime: DiscordVoiceRealtimeSchema.optional(),
  autoJoin: array(DiscordVoiceAutoJoinSchema).optional(),
  followUsersEnabled: boolean().optional(),
  followUsers: array(string().min(1)).optional(),
  allowedChannels: array(DiscordVoiceAllowedChannelSchema).optional(),
  daveEncryption: boolean().optional(),
  decryptionFailureTolerance: number().int().min(0).optional(),
  connectTimeoutMs: number().int().positive().max(12e4).optional(),
  reconnectGraceMs: number().int().positive().max(12e4).optional(),
  captureSilenceGraceMs: number().int().positive().max(3e4).optional(),
  tts: TtsConfigSchema.optional(),
})
  .strict()
  .optional();
const DiscordAccountSchema = object({
  name: string().optional(),
  capabilities: array(string()).optional(),
  markdown: MarkdownConfigSchema,
  enabled: boolean().optional(),
  commands: ProviderCommandsSchema,
  configWrites: boolean().optional(),
  token: SecretInputSchema.optional().register(sensitive),
  applicationId: DiscordIdSchema.optional(),
  proxy: string().optional(),
  gatewayInfoTimeoutMs: number().int().positive().max(12e4).optional(),
  gatewayReadyTimeoutMs: number().int().positive().max(12e4).optional(),
  gatewayRuntimeReadyTimeoutMs: number().int().positive().max(12e4).optional(),
  allowBots: union([boolean(), literal("mentions")]).optional(),
  botLoopProtection: BotLoopProtectionSchema.optional(),
  dangerouslyAllowNameMatching: boolean().optional(),
  mentionAliases: record(string(), DiscordSnowflakeStringSchema).optional(),
  groupPolicy: GroupPolicySchema.optional().default("allowlist"),
  mentionPatterns: MentionPatternsPolicySchema.optional(),
  contextVisibility: ContextVisibilityModeSchema.optional(),
  historyLimit: number().int().min(0).optional(),
  dmHistoryLimit: number().int().min(0).optional(),
  dms: record(string(), DmConfigSchema.optional()).optional(),
  textChunkLimit: number().int().positive().optional(),
  suppressEmbeds: boolean().optional(),
  streaming: DiscordPreviewStreamingConfigSchema.optional(),
  maxLinesPerMessage: number().int().positive().optional(),
  mediaMaxMb: number().positive().optional(),
  retry: RetryConfigSchema,
  actions: object({
    reactions: boolean().optional(),
    stickers: boolean().optional(),
    emojiUploads: boolean().optional(),
    stickerUploads: boolean().optional(),
    polls: boolean().optional(),
    permissions: boolean().optional(),
    messages: boolean().optional(),
    threads: boolean().optional(),
    pins: boolean().optional(),
    search: boolean().optional(),
    memberInfo: boolean().optional(),
    roleInfo: boolean().optional(),
    roles: boolean().optional(),
    channelInfo: boolean().optional(),
    voiceStatus: boolean().optional(),
    events: boolean().optional(),
    moderation: boolean().optional(),
    channels: boolean().optional(),
    presence: boolean().optional(),
  })
    .strict()
    .optional(),
  replyToMode: ReplyToModeSchema.optional(),
  thread: DiscordThreadSchema.optional(),
  dmPolicy: DmPolicySchema.optional(),
  allowFrom: DiscordIdListSchema.optional(),
  defaultTo: string().optional(),
  dm: DiscordDmSchema.optional(),
  guilds: record(string(), DiscordGuildSchema.optional()).optional(),
  heartbeat: ChannelHeartbeatVisibilitySchema,
  healthMonitor: ChannelHealthMonitorSchema,
  execApprovals: object({
    enabled: NativeExecApprovalEnableModeSchema.optional(),
    approvers: DiscordIdListSchema.optional(),
    agentFilter: array(string()).optional(),
    sessionFilter: array(string()).optional(),
    cleanupAfterResolve: boolean().optional(),
    target: _enum(["dm", "channel", "both"]).optional(),
  })
    .strict()
    .optional(),
  agentComponents: object({
    enabled: boolean().optional(),
    ttlMs: number()
      .int()
      .positive()
      .max(1440 * 60 * 1e3)
      .optional(),
  })
    .strict()
    .optional(),
  ui: DiscordUiSchema,
  slashCommand: object({ ephemeral: boolean().optional() }).strict().optional(),
  threadBindings: object({
    enabled: boolean().optional(),
    idleHours: number().nonnegative().optional(),
    maxAgeHours: number().nonnegative().optional(),
    spawnSessions: boolean().optional(),
    defaultSpawnContext: _enum(["isolated", "fork"]).optional(),
    spawnSubagentSessions: boolean().optional(),
    spawnAcpSessions: boolean().optional(),
  })
    .strict()
    .optional(),
  intents: object({
    presence: boolean().optional(),
    guildMembers: boolean().optional(),
    voiceStates: boolean().optional(),
  })
    .strict()
    .optional(),
  voice: DiscordVoiceSchema,
  pluralkit: object({
    enabled: boolean().optional(),
    token: SecretInputSchema.optional().register(sensitive),
  })
    .strict()
    .optional(),
  responsePrefix: string().optional(),
  ackReaction: string().optional(),
  ackReactionScope: _enum([
    "group-mentions",
    "group-all",
    "direct",
    "all",
    "off",
    "none",
  ]).optional(),
  activity: string().optional(),
  status: _enum(["online", "dnd", "idle", "invisible"]).optional(),
  autoPresence: object({
    enabled: boolean().optional(),
    intervalMs: number().int().positive().optional(),
    minUpdateIntervalMs: number().int().positive().optional(),
    healthyText: string().optional(),
    degradedText: string().optional(),
    exhaustedText: string().optional(),
  })
    .strict()
    .optional(),
  activityType: union([
    literal(0),
    literal(1),
    literal(2),
    literal(3),
    literal(4),
    literal(5),
  ]).optional(),
  activityUrl: string().url().optional(),
  inboundWorker: object({ runTimeoutMs: number().int().nonnegative().optional() })
    .strict()
    .optional(),
  eventQueue: object({
    listenerTimeout: number().int().positive().optional(),
    maxQueueSize: number().int().positive().optional(),
    maxConcurrency: number().int().positive().optional(),
  })
    .strict()
    .optional(),
})
  .strict()
  .superRefine((value, ctx) => {
    const activityText = normalizeOptionalString(value.activity) ?? "";
    const hasActivity = Boolean(activityText);
    const hasActivityType = value.activityType !== void 0;
    const activityUrl = normalizeOptionalString(value.activityUrl) ?? "";
    const hasActivityUrl = Boolean(activityUrl);
    if ((hasActivityType || hasActivityUrl) && !hasActivity)
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "channels.discord.activity is required when activityType or activityUrl is set",
        path: ["activity"],
      });
    if (value.activityType === 1 && !hasActivityUrl)
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "channels.discord.activityUrl is required when activityType is 1 (Streaming)",
        path: ["activityUrl"],
      });
    if (hasActivityUrl && value.activityType !== 1)
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "channels.discord.activityType must be 1 (Streaming) when activityUrl is set",
        path: ["activityType"],
      });
    const autoPresenceInterval = value.autoPresence?.intervalMs;
    const autoPresenceMinUpdate = value.autoPresence?.minUpdateIntervalMs;
    if (
      typeof autoPresenceInterval === "number" &&
      typeof autoPresenceMinUpdate === "number" &&
      autoPresenceMinUpdate > autoPresenceInterval
    )
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message:
          "channels.discord.autoPresence.minUpdateIntervalMs must be less than or equal to channels.discord.autoPresence.intervalMs",
        path: ["autoPresence", "minUpdateIntervalMs"],
      });
  });
const DiscordConfigSchema = DiscordAccountSchema.extend({
  accounts: record(string(), DiscordAccountSchema.optional()).optional(),
  defaultAccount: string().optional(),
}).superRefine((value, ctx) => {
  const dmPolicy = value.dmPolicy ?? value.dm?.policy ?? "pairing";
  const allowFrom = value.allowFrom ?? value.dm?.allowFrom;
  const allowFromPath = value.allowFrom !== void 0 ? ["allowFrom"] : ["dm", "allowFrom"];
  requireOpenAllowFrom({
    policy: dmPolicy,
    allowFrom,
    ctx,
    path: [...allowFromPath],
    message:
      'channels.discord.dmPolicy="open" requires channels.discord.allowFrom (or channels.discord.dm.allowFrom) to include "*"',
  });
  requireAllowlistAllowFrom({
    policy: dmPolicy,
    allowFrom,
    ctx,
    path: [...allowFromPath],
    message:
      'channels.discord.dmPolicy="allowlist" requires channels.discord.allowFrom (or channels.discord.dm.allowFrom) to contain at least one sender ID',
  });
  if (!value.accounts) return;
  for (const [accountId, account] of Object.entries(value.accounts)) {
    if (!account) continue;
    const effectivePolicy =
      account.dmPolicy ?? account.dm?.policy ?? value.dmPolicy ?? value.dm?.policy ?? "pairing";
    const effectiveAllowFrom =
      account.allowFrom ?? account.dm?.allowFrom ?? value.allowFrom ?? value.dm?.allowFrom;
    requireOpenAllowFrom({
      policy: effectivePolicy,
      allowFrom: effectiveAllowFrom,
      ctx,
      path: ["accounts", accountId, "allowFrom"],
      message:
        'channels.discord.accounts.*.dmPolicy="open" requires channels.discord.accounts.*.allowFrom (or channels.discord.allowFrom) to include "*"',
    });
    requireAllowlistAllowFrom({
      policy: effectivePolicy,
      allowFrom: effectiveAllowFrom,
      ctx,
      path: ["accounts", accountId, "allowFrom"],
      message:
        'channels.discord.accounts.*.dmPolicy="allowlist" requires channels.discord.accounts.*.allowFrom (or channels.discord.allowFrom) to contain at least one sender ID',
    });
  }
});
const SlackDmSchema = object({
  enabled: boolean().optional(),
  policy: DmPolicySchema.optional(),
  allowFrom: array(union([string(), number()])).optional(),
  groupEnabled: boolean().optional(),
  groupChannels: array(union([string(), number()])).optional(),
  replyToMode: ReplyToModeSchema.optional(),
}).strict();
const SlackChannelSchema = object({
  enabled: boolean().optional(),
  requireMention: boolean().optional(),
  ignoreOtherMentions: boolean().optional(),
  replyToMode: ReplyToModeSchema.optional(),
  tools: ToolPolicySchema,
  toolsBySender: ToolPolicyBySenderSchema,
  allowBots: union([boolean(), literal("mentions")]).optional(),
  botLoopProtection: BotLoopProtectionSchema.optional(),
  users: array(union([string(), number()])).optional(),
  skills: array(string()).optional(),
  systemPrompt: string().optional(),
}).strict();
const SlackThreadSchema = object({
  historyScope: _enum(["thread", "channel"]).optional(),
  inheritParent: boolean().optional(),
  initialHistoryLimit: number().int().min(0).optional(),
  requireExplicitMention: boolean().optional(),
}).strict();
const ReplyToModeByChatTypeSchema = object({
  direct: ReplyToModeSchema.optional(),
  group: ReplyToModeSchema.optional(),
  channel: ReplyToModeSchema.optional(),
}).strict();
const DirectGroupReplyToModeByChatTypeSchema = object({
  direct: ReplyToModeSchema.optional(),
  group: ReplyToModeSchema.optional(),
}).strict();
const SlackSocketModeSchema = object({
  clientPingTimeout: number().int().positive().optional(),
  serverPingTimeout: number().int().positive().optional(),
  pingPongLoggingEnabled: boolean().optional(),
}).strict();
const SlackRelaySchema = object({
  url: string().optional(),
  authToken: SecretInputSchema.optional().register(sensitive),
  gatewayId: string().optional(),
}).strict();
const SlackAccountSchema = object({
  name: string().optional(),
  mode: _enum(["socket", "http", "relay"]).optional(),
  enterpriseOrgInstall: boolean().optional(),
  socketMode: SlackSocketModeSchema.optional(),
  relay: SlackRelaySchema.optional(),
  signingSecret: SecretInputSchema.optional().register(sensitive),
  webhookPath: string().optional(),
  capabilities: SlackCapabilitiesSchema.optional(),
  execApprovals: object({
    enabled: NativeExecApprovalEnableModeSchema.optional(),
    approvers: array(union([string(), number()])).optional(),
    agentFilter: array(string()).optional(),
    sessionFilter: array(string()).optional(),
    target: _enum(["dm", "channel", "both"]).optional(),
  })
    .strict()
    .optional(),
  markdown: MarkdownConfigSchema,
  enabled: boolean().optional(),
  commands: ProviderCommandsSchema,
  configWrites: boolean().optional(),
  botToken: SecretInputSchema.optional().register(sensitive),
  appToken: SecretInputSchema.optional().register(sensitive),
  userToken: SecretInputSchema.optional().register(sensitive),
  userTokenReadOnly: boolean().optional().default(true),
  allowBots: union([boolean(), literal("mentions")]).optional(),
  botLoopProtection: BotLoopProtectionSchema.optional(),
  dangerouslyAllowNameMatching: boolean().optional(),
  requireMention: boolean().optional(),
  groupPolicy: GroupPolicySchema.optional(),
  mentionPatterns: MentionPatternsPolicySchema.optional(),
  contextVisibility: ContextVisibilityModeSchema.optional(),
  historyLimit: number().int().min(0).optional(),
  dmHistoryLimit: number().int().min(0).optional(),
  dms: record(string(), DmConfigSchema.optional()).optional(),
  textChunkLimit: number().int().positive().optional(),
  unfurlLinks: boolean().optional(),
  unfurlMedia: boolean().optional(),
  streaming: SlackStreamingConfigSchema.optional(),
  mediaMaxMb: number().positive().optional(),
  reactionNotifications: _enum(["off", "own", "all", "allowlist"]).optional(),
  reactionAllowlist: array(union([string(), number()])).optional(),
  replyToMode: ReplyToModeSchema.optional(),
  replyToModeByChatType: ReplyToModeByChatTypeSchema.optional(),
  thread: SlackThreadSchema.optional(),
  actions: object({
    reactions: boolean().optional(),
    messages: boolean().optional(),
    pins: boolean().optional(),
    search: boolean().optional(),
    permissions: boolean().optional(),
    memberInfo: boolean().optional(),
    channelInfo: boolean().optional(),
    emojiList: boolean().optional(),
  })
    .strict()
    .optional(),
  slashCommand: object({
    enabled: boolean().optional(),
    name: string().optional(),
    sessionPrefix: string().optional(),
    ephemeral: boolean().optional(),
  })
    .strict()
    .optional(),
  dmPolicy: DmPolicySchema.optional(),
  allowFrom: array(union([string(), number()])).optional(),
  defaultTo: string().optional(),
  dm: SlackDmSchema.optional(),
  channels: record(string(), SlackChannelSchema.optional()).optional(),
  heartbeat: ChannelHeartbeatVisibilitySchema,
  healthMonitor: ChannelHealthMonitorSchema,
  responsePrefix: string().optional(),
  ackReaction: string().optional(),
  typingReaction: string().optional(),
})
  .strict()
  .superRefine(() => {});
const SlackConfigSchema = SlackAccountSchema.safeExtend({
  mode: _enum(["socket", "http", "relay"]).optional().default("socket"),
  signingSecret: SecretInputSchema.optional().register(sensitive),
  webhookPath: string().optional().default("/slack/events"),
  groupPolicy: GroupPolicySchema.optional().default("allowlist"),
  mentionPatterns: MentionPatternsPolicySchema.optional(),
  contextVisibility: ContextVisibilityModeSchema.optional(),
  accounts: record(string(), SlackAccountSchema.optional()).optional(),
  defaultAccount: string().optional(),
}).superRefine((value, ctx) => {
  const dmPolicy = value.dmPolicy ?? value.dm?.policy ?? "pairing";
  const allowFrom = value.allowFrom ?? value.dm?.allowFrom;
  const allowFromPath = value.allowFrom !== void 0 ? ["allowFrom"] : ["dm", "allowFrom"];
  requireOpenAllowFrom({
    policy: dmPolicy,
    allowFrom,
    ctx,
    path: [...allowFromPath],
    message:
      'channels.slack.dmPolicy="open" requires channels.slack.allowFrom (or channels.slack.dm.allowFrom) to include "*"',
  });
  requireAllowlistAllowFrom({
    policy: dmPolicy,
    allowFrom,
    ctx,
    path: [...allowFromPath],
    message:
      'channels.slack.dmPolicy="allowlist" requires channels.slack.allowFrom (or channels.slack.dm.allowFrom) to contain at least one sender ID',
  });
  const requireRelayConfig = (relay, path) => {
    if (typeof relay?.url !== "string" || !relay.url.trim())
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: 'channels.slack.mode="relay" requires relay.url',
        path: [...path, "url"],
      });
    if (!hasConfiguredSecretInput(relay?.authToken))
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: 'channels.slack.mode="relay" requires relay.authToken',
        path: [...path, "authToken"],
      });
    if (typeof relay?.gatewayId !== "string" || !relay.gatewayId.trim())
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: 'channels.slack.mode="relay" requires relay.gatewayId',
        path: [...path, "gatewayId"],
      });
  };
  const baseMode = value.mode ?? "socket";
  if (!value.accounts) {
    if (baseMode === "relay") requireRelayConfig(value.relay, ["relay"]);
    validateSlackSigningSecretRequirements(value, ctx);
    return;
  }
  for (const [accountId, account] of Object.entries(value.accounts)) {
    if (!account) continue;
    if (account.enabled === false) continue;
    const accountMode = account.mode ?? baseMode;
    const effectiveRelay = {
      ...value.relay,
      ...account.relay,
    };
    const effectivePolicy =
      account.dmPolicy ?? account.dm?.policy ?? value.dmPolicy ?? value.dm?.policy ?? "pairing";
    const effectiveAllowFrom =
      account.allowFrom ?? account.dm?.allowFrom ?? value.allowFrom ?? value.dm?.allowFrom;
    requireOpenAllowFrom({
      policy: effectivePolicy,
      allowFrom: effectiveAllowFrom,
      ctx,
      path: ["accounts", accountId, "allowFrom"],
      message:
        'channels.slack.accounts.*.dmPolicy="open" requires channels.slack.accounts.*.allowFrom (or channels.slack.allowFrom) to include "*"',
    });
    requireAllowlistAllowFrom({
      policy: effectivePolicy,
      allowFrom: effectiveAllowFrom,
      ctx,
      path: ["accounts", accountId, "allowFrom"],
      message:
        'channels.slack.accounts.*.dmPolicy="allowlist" requires channels.slack.accounts.*.allowFrom (or channels.slack.allowFrom) to contain at least one sender ID',
    });
    if (accountMode !== "http") {
      if (accountMode === "relay")
        requireRelayConfig(effectiveRelay, ["accounts", accountId, "relay"]);
      continue;
    }
  }
  validateSlackSigningSecretRequirements(value, ctx);
});
const SignalGroupEntrySchema = object({
  requireMention: boolean().optional(),
  ingest: boolean().optional(),
  tools: ToolPolicySchema,
  toolsBySender: ToolPolicyBySenderSchema,
}).strict();
const SignalGroupsSchema = record(string(), SignalGroupEntrySchema.optional()).optional();
const SignalAccountSchemaBase = object({
  name: string().optional(),
  capabilities: array(string()).optional(),
  markdown: MarkdownConfigSchema,
  enabled: boolean().optional(),
  configWrites: boolean().optional(),
  account: string().optional(),
  accountUuid: string().optional(),
  configPath: string().optional(),
  httpUrl: string().optional(),
  httpHost: string().optional(),
  httpPort: number().int().positive().optional(),
  cliPath: ExecutableTokenSchema.optional(),
  autoStart: boolean().optional(),
  startupTimeoutMs: number().int().min(1e3).max(12e4).optional(),
  receiveMode: union([literal("on-start"), literal("manual")]).optional(),
  ignoreAttachments: boolean().optional(),
  ignoreStories: boolean().optional(),
  sendReadReceipts: boolean().optional(),
  aliases: record(string(), string()).optional(),
  dmPolicy: DmPolicySchema.optional().default("pairing"),
  allowFrom: array(union([string(), number()])).optional(),
  defaultTo: string().optional(),
  groupAllowFrom: array(union([string(), number()])).optional(),
  groupPolicy: GroupPolicySchema.optional().default("allowlist"),
  contextVisibility: ContextVisibilityModeSchema.optional(),
  groups: SignalGroupsSchema,
  historyLimit: number().int().min(0).optional(),
  dmHistoryLimit: number().int().min(0).optional(),
  dms: record(string(), DmConfigSchema.optional()).optional(),
  textChunkLimit: number().int().positive().optional(),
  streaming: ChannelDeliveryStreamingConfigSchema.optional(),
  mediaMaxMb: number().int().positive().optional(),
  replyToMode: ReplyToModeSchema.optional(),
  replyToModeByChatType: DirectGroupReplyToModeByChatTypeSchema.optional(),
  reactionNotifications: _enum(["off", "own", "all", "allowlist"]).optional(),
  reactionAllowlist: array(union([string(), number()])).optional(),
  actions: object({ reactions: boolean().optional() }).strict().optional(),
  reactionLevel: _enum(["off", "ack", "minimal", "extensive"]).optional(),
  heartbeat: ChannelHeartbeatVisibilitySchema,
  healthMonitor: ChannelHealthMonitorSchema,
  responsePrefix: string().optional(),
}).strict();
const SignalConfigSchema = SignalAccountSchemaBase.extend({
  apiMode: _enum(["auto", "native", "container"]).optional(),
  accounts: record(string(), SignalAccountSchemaBase.optional()).optional(),
  defaultAccount: string().optional(),
}).superRefine((value, ctx) => {
  requireOpenAllowFrom({
    policy: value.dmPolicy,
    allowFrom: value.allowFrom,
    ctx,
    path: ["allowFrom"],
    message: 'channels.signal.dmPolicy="open" requires channels.signal.allowFrom to include "*"',
  });
  requireAllowlistAllowFrom({
    policy: value.dmPolicy,
    allowFrom: value.allowFrom,
    ctx,
    path: ["allowFrom"],
    message:
      'channels.signal.dmPolicy="allowlist" requires channels.signal.allowFrom to contain at least one sender ID',
  });
  if (!value.accounts) return;
  for (const [accountId, account] of Object.entries(value.accounts)) {
    if (!account) continue;
    const effectivePolicy = account.dmPolicy ?? value.dmPolicy;
    const effectiveAllowFrom = account.allowFrom ?? value.allowFrom;
    requireOpenAllowFrom({
      policy: effectivePolicy,
      allowFrom: effectiveAllowFrom,
      ctx,
      path: ["accounts", accountId, "allowFrom"],
      message:
        'channels.signal.accounts.*.dmPolicy="open" requires channels.signal.accounts.*.allowFrom (or channels.signal.allowFrom) to include "*"',
    });
    requireAllowlistAllowFrom({
      policy: effectivePolicy,
      allowFrom: effectiveAllowFrom,
      ctx,
      path: ["accounts", accountId, "allowFrom"],
      message:
        'channels.signal.accounts.*.dmPolicy="allowlist" requires channels.signal.accounts.*.allowFrom (or channels.signal.allowFrom) to contain at least one sender ID',
    });
  }
});
const IMessageActionSchema = object({
  reactions: boolean().optional(),
  edit: boolean().optional(),
  unsend: boolean().optional(),
  reply: boolean().optional(),
  sendWithEffect: boolean().optional(),
  renameGroup: boolean().optional(),
  setGroupIcon: boolean().optional(),
  addParticipant: boolean().optional(),
  removeParticipant: boolean().optional(),
  leaveGroup: boolean().optional(),
  sendAttachment: boolean().optional(),
  polls: boolean().optional(),
})
  .strict()
  .optional();
const IMessageAccountSchemaBase = object({
  name: string().optional(),
  capabilities: array(string()).optional(),
  markdown: MarkdownConfigSchema,
  enabled: boolean().optional(),
  configWrites: boolean().optional(),
  cliPath: ExecutableTokenSchema.optional(),
  dbPath: string().optional(),
  remoteHost: string()
    .refine(isSafeScpRemoteHost, "expected SSH host or user@host (no spaces/options)")
    .optional(),
  actions: IMessageActionSchema,
  service: union([literal("imessage"), literal("sms"), literal("auto")]).optional(),
  sendTransport: _enum(["auto", "bridge", "applescript"]).optional(),
  region: string().optional(),
  dmPolicy: DmPolicySchema.optional().default("pairing"),
  allowFrom: array(union([string(), number()])).optional(),
  defaultTo: string().optional(),
  groupAllowFrom: array(union([string(), number()])).optional(),
  groupPolicy: GroupPolicySchema.optional().default("allowlist"),
  contextVisibility: ContextVisibilityModeSchema.optional(),
  historyLimit: number().int().min(0).optional(),
  dmHistoryLimit: number().int().min(0).optional(),
  dms: record(string(), DmConfigSchema.optional()).optional(),
  includeAttachments: boolean().optional(),
  attachmentRoots: array(
    string().refine(isValidInboundPathRootPattern, "expected absolute path root"),
  ).optional(),
  remoteAttachmentRoots: array(
    string().refine(isValidInboundPathRootPattern, "expected absolute path root"),
  ).optional(),
  mediaMaxMb: number().int().positive().optional(),
  probeTimeoutMs: number().int().positive().optional(),
  textChunkLimit: number().int().positive().optional(),
  streaming: ChannelDeliveryStreamingConfigSchema.optional(),
  sendReadReceipts: boolean().optional(),
  reactionNotifications: _enum(["off", "own", "all"]).optional(),
  coalesceSameSenderDms: boolean().optional(),
  catchup: object({
    enabled: boolean().optional(),
    maxAgeMinutes: number().int().min(1).max(720).optional(),
    perRunLimit: number().int().min(1).max(500).optional(),
    firstRunLookbackMinutes: number().int().min(1).max(720).optional(),
    maxFailureRetries: number().int().min(1).max(1e3).optional(),
  })
    .strict()
    .optional(),
  groups: record(
    string(),
    object({
      requireMention: boolean().optional(),
      tools: ToolPolicySchema,
      toolsBySender: ToolPolicyBySenderSchema,
      systemPrompt: string().optional(),
    })
      .strict()
      .optional(),
  ).optional(),
  heartbeat: ChannelHeartbeatVisibilitySchema,
  healthMonitor: ChannelHealthMonitorSchema,
  responsePrefix: string().optional(),
}).strict();
const IMessageConfigSchema = IMessageAccountSchemaBase.extend({
  accounts: record(string(), IMessageAccountSchemaBase.optional()).optional(),
  defaultAccount: string().optional(),
}).superRefine((value, ctx) => {
  requireOpenAllowFrom({
    policy: value.dmPolicy,
    allowFrom: value.allowFrom,
    ctx,
    path: ["allowFrom"],
    message:
      'channels.imessage.dmPolicy="open" requires channels.imessage.allowFrom to include "*"',
  });
  requireAllowlistAllowFrom({
    policy: value.dmPolicy,
    allowFrom: value.allowFrom,
    ctx,
    path: ["allowFrom"],
    message:
      'channels.imessage.dmPolicy="allowlist" requires channels.imessage.allowFrom to contain at least one sender ID',
  });
  if (!value.accounts) return;
  for (const [accountId, account] of Object.entries(value.accounts)) {
    if (!account) continue;
    const effectivePolicy = account.dmPolicy ?? value.dmPolicy;
    const effectiveAllowFrom = account.allowFrom ?? value.allowFrom;
    requireOpenAllowFrom({
      policy: effectivePolicy,
      allowFrom: effectiveAllowFrom,
      ctx,
      path: ["accounts", accountId, "allowFrom"],
      message:
        'channels.imessage.accounts.*.dmPolicy="open" requires channels.imessage.accounts.*.allowFrom (or channels.imessage.allowFrom) to include "*"',
    });
    requireAllowlistAllowFrom({
      policy: effectivePolicy,
      allowFrom: effectiveAllowFrom,
      ctx,
      path: ["accounts", accountId, "allowFrom"],
      message:
        'channels.imessage.accounts.*.dmPolicy="allowlist" requires channels.imessage.accounts.*.allowFrom (or channels.imessage.allowFrom) to contain at least one sender ID',
    });
  }
});
const MSTeamsChannelSchema = object({
  requireMention: boolean().optional(),
  tools: ToolPolicySchema,
  toolsBySender: ToolPolicyBySenderSchema,
  replyStyle: MSTeamsReplyStyleSchema.optional(),
}).strict();
const MSTeamsTeamSchema = object({
  requireMention: boolean().optional(),
  tools: ToolPolicySchema,
  toolsBySender: ToolPolicyBySenderSchema,
  replyStyle: MSTeamsReplyStyleSchema.optional(),
  channels: record(string(), MSTeamsChannelSchema.optional()).optional(),
}).strict();
const MSTEAMS_SERVICE_URL_HOST_ALLOWLIST = [
  "smba.trafficmanager.net",
  "smba.infra.gcc.teams.microsoft.com",
  "smba.infra.gov.teams.microsoft.us",
  "smba.infra.dod.teams.microsoft.us",
  "botframework.azure.cn",
];
function isAllowedMSTeamsServiceUrl(value) {
  try {
    const parsed = new URL(value.trim());
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    return MSTEAMS_SERVICE_URL_HOST_ALLOWLIST.some(
      (allowed) => host === allowed || host.endsWith(`.${allowed}`),
    );
  } catch {
    return false;
  }
}
function isAzureChinaBotFrameworkServiceUrl(value) {
  try {
    const parsed = new URL(value.trim());
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    return host === "botframework.azure.cn" || host.endsWith(".botframework.azure.cn");
  } catch {
    return false;
  }
}
const MSTeamsConfigSchema = object({
  enabled: boolean().optional(),
  capabilities: array(string()).optional(),
  dangerouslyAllowNameMatching: boolean().optional(),
  markdown: MarkdownConfigSchema,
  configWrites: boolean().optional(),
  appId: string().optional(),
  appPassword: SecretInputSchema.optional().register(sensitive),
  tenantId: string().optional(),
  cloud: _enum(["Public", "USGov", "USGovDoD", "China"]).optional(),
  serviceUrl: string()
    .url()
    .refine(isAllowedMSTeamsServiceUrl, {
      message:
        "channels.msteams.serviceUrl must use a supported Microsoft Teams Bot Connector host",
    })
    .optional(),
  authType: _enum(["secret", "federated"]).optional(),
  certificatePath: string().optional(),
  certificateThumbprint: string().optional(),
  useManagedIdentity: boolean().optional(),
  managedIdentityClientId: string().optional(),
  webhook: object({
    port: number().int().positive().optional(),
    path: string().optional(),
  })
    .strict()
    .optional(),
  dmPolicy: DmPolicySchema.optional().default("pairing"),
  allowFrom: array(string()).optional(),
  defaultTo: string().optional(),
  groupAllowFrom: array(string()).optional(),
  groupPolicy: GroupPolicySchema.optional().default("allowlist"),
  contextVisibility: ContextVisibilityModeSchema.optional(),
  textChunkLimit: number().int().positive().optional(),
  streaming: ChannelPreviewStreamingConfigSchema.optional(),
  typingIndicator: boolean().optional(),
  mediaAllowHosts: array(string()).optional(),
  mediaAuthAllowHosts: array(string()).optional(),
  graphMediaFallback: boolean().optional(),
  requireMention: boolean().optional(),
  historyLimit: number().int().min(0).optional(),
  dmHistoryLimit: number().int().min(0).optional(),
  dms: record(string(), DmConfigSchema.optional()).optional(),
  replyStyle: MSTeamsReplyStyleSchema.optional(),
  teams: record(string(), MSTeamsTeamSchema.optional()).optional(),
  /** Max inbound and outbound media size in MB (default: 100MB). */
  mediaMaxMb: number().positive().optional(),
  /** SharePoint site ID for file uploads in group chats/channels (e.g., "contoso.sharepoint.com,guid1,guid2") */
  sharePointSiteId: string().optional(),
  heartbeat: ChannelHeartbeatVisibilitySchema,
  healthMonitor: ChannelHealthMonitorSchema,
  responsePrefix: string().optional(),
  welcomeCard: boolean().optional(),
  promptStarters: array(string()).optional(),
  groupWelcomeCard: boolean().optional(),
  feedbackEnabled: boolean().optional(),
  feedbackReflection: boolean().optional(),
  feedbackReflectionCooldownMs: number().int().min(0).optional(),
  delegatedAuth: object({
    enabled: boolean().optional(),
    scopes: array(string()).optional(),
  })
    .strict()
    .optional(),
  sso: object({
    enabled: boolean().optional(),
    connectionName: string().optional(),
  })
    .strict()
    .optional(),
})
  .strict()
  .superRefine((value, ctx) => {
    requireOpenAllowFrom({
      policy: value.dmPolicy,
      allowFrom: value.allowFrom,
      ctx,
      path: ["allowFrom"],
      message:
        'channels.msteams.dmPolicy="open" requires channels.msteams.allowFrom to include "*"',
    });
    requireAllowlistAllowFrom({
      policy: value.dmPolicy,
      allowFrom: value.allowFrom,
      ctx,
      path: ["allowFrom"],
      message:
        'channels.msteams.dmPolicy="allowlist" requires channels.msteams.allowFrom to contain at least one sender ID',
    });
    if (value.sso?.enabled === true && !value.sso.connectionName?.trim())
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: ["sso", "connectionName"],
        message:
          "channels.msteams.sso.enabled=true requires channels.msteams.sso.connectionName to identify the Bot Framework OAuth connection",
      });
    if (
      value.cloud &&
      value.cloud !== "Public" &&
      value.cloud !== "China" &&
      !value.serviceUrl?.trim()
    )
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: ["serviceUrl"],
        message:
          "channels.msteams.cloud requires channels.msteams.serviceUrl for non-public Teams clouds",
      });
    if (
      value.cloud === "China" &&
      value.serviceUrl?.trim() &&
      !isAzureChinaBotFrameworkServiceUrl(value.serviceUrl)
    )
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: ["serviceUrl"],
        message:
          "channels.msteams.cloud=China requires channels.msteams.serviceUrl to use an Azure China Bot Framework channel host",
      });
    if (
      value.cloud !== "China" &&
      value.serviceUrl?.trim() &&
      isAzureChinaBotFrameworkServiceUrl(value.serviceUrl)
    )
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: ["cloud"],
        message: "Azure China Bot Framework serviceUrl hosts require channels.msteams.cloud=China",
      });
  });
//#endregion
export {
  SlackConfigSchema as a,
  SignalConfigSchema as i,
  IMessageConfigSchema as n,
  TelegramConfigSchema as o,
  MSTeamsConfigSchema as r,
  DiscordConfigSchema as t,
};
