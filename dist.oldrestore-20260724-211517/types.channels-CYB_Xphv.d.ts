import {
  E as ReplyToMode,
  R as SessionThreadBindingsConfig,
  S as MarkdownConfig,
  a as ChannelDeliveryStreamingConfig,
  d as ChannelStreamingProgressConfig,
  f as ContextVisibilityMode,
  g as DmPolicy,
  o as ChannelPreviewStreamingConfig,
  u as ChannelStreamingPreviewConfig,
  v as GroupPolicy,
  w as OutboundRetryConfig,
} from "./types.base-ibSxQuK3.js";
import { d as SecretInput, h as SecretRef } from "./types.secrets-C15Z_eLX.js";
import {
  I as MentionPatternsPolicyConfig,
  K as TtsConfig,
  _ as ChannelHealthMonitorConfig,
  ct as GroupToolPolicyConfig,
  j as DmConfig,
  o as SlackConfig,
  st as GroupToolPolicyBySenderConfig,
  v as ChannelHeartbeatVisibilityConfig,
  w as NativeExecApprovalEnableMode,
  y as ChannelBotLoopProtectionConfig,
  z as ProviderCommandsConfig,
} from "./types.slack-DOPma3IJ.js";

//#region src/config/types.discord.d.ts
type DiscordStreamMode = "off" | "partial" | "block" | "progress";
type DiscordChannelStreamingConfig = Omit<ChannelPreviewStreamingConfig, "progress"> & {
  progress?: ChannelStreamingProgressConfig;
};
type DiscordPluralKitConfig = {
  enabled?: boolean;
  token?: string;
};
type DiscordMentionAliasesConfig = Record<string, string>;
type DiscordDmConfig = {
  /** If false, ignore all incoming Discord DMs. Default: true. */ enabled?: boolean /** Direct message access policy (default: pairing). */;
  policy?: DmPolicy /** Allowlist for DM senders (ids or names). */;
  allowFrom?: string[] /** If true, allow group DMs (default: false). */;
  groupEnabled?: boolean /** Optional allowlist for group DM channels (ids or slugs). */;
  groupChannels?: string[];
};
type DiscordGuildChannelConfig = {
  requireMention?: boolean;
  /**
   * If true, drop messages that mention another user/role but not this one (not @everyone/@here).
   * Default: false.
   */
  ignoreOtherMentions?: boolean /** Optional tool policy overrides for this channel. */;
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig /** If specified, only load these skills for this channel. Omit = all skills; empty = no skills. */;
  skills?: string[] /** If false, disable the bot for this channel. */;
  enabled?: boolean /** Optional allowlist for channel senders (ids or names). */;
  users?: string[] /** Optional allowlist for channel senders by role ID. */;
  roles?: string[] /** Optional system prompt snippet for this channel. */;
  systemPrompt?: string /** If false, omit thread starter context for this channel (default: true). */;
  includeThreadStarter?: boolean /** If true, automatically create a thread for each new message in this channel. */;
  autoThread?: boolean /** Archive duration (minutes) for auto-created threads. Valid values: 60, 1440, 4320, 10080. */;
  autoArchiveDuration?:
    | "60"
    | "1440"
    | "4320"
    | "10080"
    | 60
    | 1440
    | 4320
    | 10080 /** Naming strategy for auto-created threads. "message" uses message text; "generated" renames with an LLM title. */;
  autoThreadName?: "message" | "generated";
};
type DiscordReactionNotificationMode = "off" | "own" | "all" | "allowlist";
type DiscordGuildEntry = {
  slug?: string;
  requireMention?: boolean;
  /**
   * If true, drop messages that mention another user/role but not this one (not @everyone/@here).
   * Default: false.
   */
  ignoreOtherMentions?: boolean /** Optional tool policy overrides for this guild (used when channel override is missing). */;
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig /** Reaction notification mode (off|own|all|allowlist). Default: own. */;
  reactionNotifications?: DiscordReactionNotificationMode /** Optional allowlist for guild senders (ids or names). */;
  users?: string[] /** Optional allowlist for guild senders by role ID. */;
  roles?: string[];
  channels?: Record<string, DiscordGuildChannelConfig>;
};
type DiscordActionConfig = {
  reactions?: boolean;
  stickers?: boolean;
  polls?: boolean;
  permissions?: boolean;
  messages?: boolean;
  threads?: boolean;
  pins?: boolean;
  search?: boolean;
  memberInfo?: boolean;
  roleInfo?: boolean;
  roles?: boolean;
  channelInfo?: boolean;
  voiceStatus?: boolean;
  events?: boolean;
  moderation?: boolean;
  emojiUploads?: boolean;
  stickerUploads?: boolean;
  channels?: boolean /** Enable bot presence/activity changes (default: false). */;
  presence?: boolean;
};
type DiscordIntentsConfig = {
  /** Enable Guild Presences privileged intent (requires Portal opt-in). Default: false. */ presence?: boolean /** Enable Guild Members privileged intent (requires Portal opt-in). Default: false. */;
  guildMembers?: boolean /** Enable Guild Voice States intent. Defaults to voice.enabled, unless explicitly set. */;
  voiceStates?: boolean;
};
type DiscordVoiceAutoJoinConfig = {
  /** Guild ID that owns the voice channel. */ guildId: string /** Voice channel ID to join. */;
  channelId: string;
};
type DiscordVoiceAllowedChannelConfig = {
  /** Guild ID that owns the voice channel. */ guildId: string /** Voice channel ID allowed for realtime voice sessions. */;
  channelId: string;
};
type DiscordVoiceMode = "stt-tts" | "agent-proxy" | "bidi";
type DiscordVoiceRealtimeConsultPolicy = "auto" | "always";
type DiscordVoiceRealtimeToolPolicy = "safe-read-only" | "owner" | "none";
type DiscordVoiceRealtimeBootstrapContextFile = "IDENTITY.md" | "USER.md" | "SOUL.md";
type DiscordVoiceRealtimeConfig = {
  /** Realtime voice provider id, for example "openai". */ provider?: string /** Provider realtime session model, for example "gpt-realtime-2.1". */;
  model?: string /** Provider realtime output voice name, for example "cedar". */;
  speakerVoice?: string /** Provider realtime output voice id. */;
  speakerVoiceId?: string /** @deprecated Use speakerVoice. */;
  voice?: string /** System instructions passed to the realtime provider. */;
  instructions?: string /** Tool policy for bidi realtime consult calls. */;
  toolPolicy?: DiscordVoiceRealtimeToolPolicy /** Whether bidi should force the OpenClaw agent brain for every substantive turn. */;
  consultPolicy?: DiscordVoiceRealtimeConsultPolicy /** Require a wake name before OpenAI agent-proxy realtime Discord voice responds. */;
  requireWakeName?: boolean /** Wake names that allow OpenAI agent-proxy realtime Discord voice to respond. Defaults to the routed agent name, then agent id. */;
  wakeNames?: string[] /** Agent profile bootstrap files to include in realtime provider instructions. Defaults to IDENTITY.md, USER.md, and SOUL.md; set [] to disable. */;
  bootstrapContextFiles?: DiscordVoiceRealtimeBootstrapContextFile[] /** Allow Discord speaker-start events to interrupt active realtime playback. */;
  bargeIn?: boolean /** Minimum assistant playback duration before a barge-in truncates audio. Default: 250ms; set 0 for immediate interruption. */;
  minBargeInAudioEndMs?: number /** Debounce window before buffered transcripts are sent to the OpenClaw agent. */;
  debounceMs?: number /** Provider-specific realtime voice config keyed by provider id. */;
  providers?: Record<string, Record<string, unknown> | undefined>;
};
type DiscordVoiceAgentSessionConfig = {
  /** Which OpenClaw conversation should receive voice turns. Default: "voice". */ mode?:
    | "voice"
    | "target" /** Discord target used when mode is "target", for example "channel:123". */;
  target?: string;
};
type DiscordVoiceConfig = {
  /** Enable Discord voice channel conversations (default: true). */ enabled?: boolean /** Voice conversation mode. Default: agent-proxy. */;
  mode?: DiscordVoiceMode /** Route voice turns through an existing OpenClaw Discord conversation. */;
  agentSession?: DiscordVoiceAgentSessionConfig /** Optional LLM model override for Discord voice channel responses. */;
  model?: string /** Realtime provider settings for agent-proxy or bidi modes. */;
  realtime?: DiscordVoiceRealtimeConfig /** Voice channels to auto-join on startup. */;
  autoJoin?: DiscordVoiceAutoJoinConfig[] /** If false, configured followUsers are ignored without removing the saved user list. */;
  followUsersEnabled?: boolean /** Discord user IDs whose current voice channel the bot should follow. */;
  followUsers?: string[] /** Voice channels the bot is allowed to join or remain in. Unset means any voice channel is allowed. */;
  allowedChannels?: DiscordVoiceAllowedChannelConfig[] /** Enable/disable DAVE end-to-end encryption (default: true; Discord may require this). */;
  daveEncryption?: boolean /** Consecutive decrypt failures before DAVE session reinitialization (default: 24). */;
  decryptionFailureTolerance?: number /** Initial @discordjs/voice Ready wait in milliseconds (default: 30000). */;
  connectTimeoutMs?: number /** Grace period for Discord voice reconnect signalling after a disconnect (default: 15000). */;
  reconnectGraceMs?: number /** Silence grace after Discord reports a speaker ended before finalizing STT capture (default: 2000). */;
  captureSilenceGraceMs?: number /** Optional TTS overrides for Discord voice output. */;
  tts?: TtsConfig;
};
type DiscordExecApprovalConfig = {
  /** Enable mode for Discord exec approvals on this account. Default: auto when approvers can be resolved; false disables. */ enabled?: NativeExecApprovalEnableMode /** Discord user IDs to receive approval prompts. Optional: falls back to commands.ownerAllowFrom when possible. */;
  approvers?: string[] /** Only forward approvals for these agent IDs. Omit = all agents. */;
  agentFilter?: string[] /** Only forward approvals matching these session key patterns (substring or regex). */;
  sessionFilter?: string[] /** Delete approval DMs after approval, denial, or timeout. Default: false. */;
  cleanupAfterResolve?: boolean;
  /** Where to send approval prompts. "dm" sends to approver DMs (default), "channel" sends to the
   *  originating Discord channel, "both" sends to both. When target is "channel" or "both", buttons
   *  are only usable by resolved approvers; other users receive an ephemeral denial. */
  target?: "dm" | "channel" | "both";
};
type DiscordAgentComponentsConfig = {
  /** Enable agent-controlled interactive components (buttons, select menus). Default: true. */ enabled?: boolean /** Time in milliseconds before sent Discord component callbacks expire. Default: 1800000. */;
  ttlMs?: number;
};
type DiscordUiComponentsConfig = {
  /** Accent color used by Discord component containers (hex). */ accentColor?: string;
};
type DiscordUiConfig = {
  components?: DiscordUiComponentsConfig;
};
type DiscordThreadBindingsConfig = {
  /**
   * Enable Discord thread binding features (/focus, thread-bound delivery, and
   * thread-bound subagent session flows). Overrides session.threadBindings.enabled
   * when set.
   */
  enabled?: boolean;
  /**
   * Inactivity window for thread-bound sessions in hours.
   * Session auto-unfocuses after this amount of idle time. Set to 0 to disable. Default: 24.
   */
  idleHours?: number;
  /**
   * Optional hard max age for thread-bound sessions in hours.
   * Session auto-unfocuses once this age is reached even if active. Set to 0 to disable. Default: 0.
   */
  maxAgeHours?: number;
  /**
   * Allow session spawns to auto-create + bind Discord threads.
   * Applies to native subagent and ACP thread spawns. Default: true.
   */
  spawnSessions?: boolean;
  /**
   * Default context mode for native subagents spawned into a bound Discord thread.
   * Default: "fork".
   */
  defaultSpawnContext?: "isolated" | "fork";
  /**
   * @deprecated Use spawnSessions instead.
   */
  spawnSubagentSessions?: boolean;
  /**
   * @deprecated Use spawnSessions instead.
   */
  spawnAcpSessions?: boolean;
};
type DiscordSlashCommandConfig = {
  /** Reply ephemerally (default: true). */ ephemeral?: boolean;
};
type DiscordThreadConfig = {
  /** If true, Discord thread sessions inherit the parent channel transcript. Default: false. */ inheritParent?: boolean;
};
type DiscordAutoPresenceConfig = {
  /** Enable automatic runtime/quota-based Discord presence updates. Default: false. */ enabled?: boolean /** Poll interval for evaluating runtime availability state (ms). Default: 30000. */;
  intervalMs?: number /** Minimum spacing between actual gateway presence updates (ms). Default: 15000. */;
  minUpdateIntervalMs?: number /** Optional custom status text while runtime is healthy; supports plain text. */;
  healthyText?: string /** Optional custom status text while runtime/quota state is degraded or unknown. */;
  degradedText?: string /** Optional custom status text while runtime detects quota/token exhaustion. */;
  exhaustedText?: string;
};
type DiscordAccountConfig = {
  /** Optional display name for this account (used in CLI/UI lists). */ name?: string /** Optional provider capability tags used for agent/runtime guidance. */;
  capabilities?: string[] /** Markdown formatting overrides (tables). */;
  markdown?: MarkdownConfig /** Override native command registration for Discord (bool or "auto"). */;
  commands?: ProviderCommandsConfig /** Allow channel-initiated config writes (default: true). */;
  configWrites?: boolean /** If false, do not start this Discord account. Default: true. */;
  enabled?: boolean;
  token?: SecretInput /** Optional Discord application/client ID. Set this when REST application lookup is blocked. */;
  applicationId?: string /** HTTP(S) proxy URL for Discord gateway WebSocket connections. */;
  proxy?: string /** Timeout for Discord /gateway/bot metadata lookup before falling back to the default gateway URL. Default: 30000. */;
  gatewayInfoTimeoutMs?: number /** Startup wait for the gateway READY event before restarting the socket. Default: 15000. */;
  gatewayReadyTimeoutMs?: number /** Runtime reconnect wait for the gateway READY event before force-stopping the lifecycle. Default: 30000. */;
  gatewayRuntimeReadyTimeoutMs?: number /** Allow bot-authored messages to trigger replies (default: false). Set "mentions" to gate on mentions. */;
  allowBots?: boolean | "mentions";
  /**
   * Sliding-window guard that suppresses runaway two-bot exchanges. Default on
   * whenever `allowBots` lets bot messages reach dispatch. See #58789.
   */
  botLoopProtection?: {
    /** Enable the bot-pair sliding-window guard (default: true when allowBots is set). */ enabled?: boolean /** Maximum messages a single bot pair may exchange in the configured window. Default: 20. */;
    maxEventsPerWindow?: number /** Sliding window length in seconds. Default: 60. */;
    windowSeconds?: number /** Cooldown seconds applied to a bot pair after the limit is hit. Default: 60. */;
    cooldownSeconds?: number;
  };
  /**
   * Break-glass override: allow mutable identity matching (names/tags/slugs) in allowlists.
   * Default behavior is ID-only matching.
   */
  dangerouslyAllowNameMatching?: boolean;
  /**
   * Deterministic outbound @handle rewrites for known Discord users.
   * Keys are handles without the leading @; values are Discord user IDs.
   */
  mentionAliases?: DiscordMentionAliasesConfig;
  /**
   * Controls how guild channel messages are handled:
   * - "open": guild channels bypass allowlists; mention-gating applies
   * - "disabled": block all guild channel messages
   * - "allowlist": only allow channels present in discord.guilds.*.channels
   */
  groupPolicy?: GroupPolicy /** Scope configured groupChat mentionPatterns to selected Discord channel IDs. */;
  mentionPatterns?: MentionPatternsPolicyConfig /** Supplemental context visibility policy (all|allowlist|allowlist_quote). */;
  contextVisibility?: ContextVisibilityMode /** Outbound text chunk size (chars). Default: 2000. */;
  textChunkLimit?: number;
  /**
   * Suppress Discord-generated link embeds for outbound messages. Default: true.
   * Explicit `embeds` payloads are still sent normally.
   */
  suppressEmbeds?: boolean /** Streaming + chunking settings. Prefer this nested shape over legacy flat keys. */;
  streaming?: DiscordChannelStreamingConfig;
  /**
   * Soft max line count per Discord message.
   * Discord clients can clip/collapse very tall messages; splitting by lines
   * keeps replies readable in-channel. Default: 17.
   */
  maxLinesPerMessage?: number;
  mediaMaxMb?: number;
  historyLimit?: number /** Max DM turns to keep as history context. */;
  dmHistoryLimit?: number /** Per-DM config overrides keyed by user ID. */;
  dms?: Record<string, DmConfig> /** Retry policy for outbound Discord API calls. */;
  retry?: OutboundRetryConfig /** Per-action tool gating (default: true for all). */;
  actions?: DiscordActionConfig /** Control reply threading when reply tags are present (off|first|all|batched). */;
  replyToMode?: ReplyToMode /** Thread session behavior. */;
  thread?: DiscordThreadConfig;
  /**
   * Canonical DM policy key. Doctor migrates legacy channels.discord.dm.policy here.
   * Legacy key: channels.discord.dm.policy.
   */
  dmPolicy?: DmPolicy;
  /**
   * Canonical DM allowlist. Doctor migrates legacy channels.discord.dm.allowFrom here.
   * Legacy key: channels.discord.dm.allowFrom.
   */
  allowFrom?: string[] /** Default delivery target for CLI --deliver when no explicit --reply-to is provided. */;
  defaultTo?: string;
  dm?: DiscordDmConfig /** New per-guild config keyed by guild id or slug. */;
  guilds?: Record<string, DiscordGuildEntry> /** Heartbeat visibility settings for this channel. */;
  heartbeat?: ChannelHeartbeatVisibilityConfig /** Channel health monitor overrides for this channel/account. */;
  healthMonitor?: ChannelHealthMonitorConfig /** Exec approval forwarding configuration. */;
  execApprovals?: DiscordExecApprovalConfig /** Agent-controlled interactive components (buttons, select menus). */;
  agentComponents?: DiscordAgentComponentsConfig /** Discord UI customization (components, modals, etc.). */;
  ui?: DiscordUiConfig /** Slash command configuration. */;
  slashCommand?: DiscordSlashCommandConfig /** Thread binding lifecycle settings (focus/subagent thread sessions). */;
  threadBindings?: DiscordThreadBindingsConfig /** Privileged Gateway Intents (must also be enabled in Discord Developer Portal). */;
  intents?: DiscordIntentsConfig /** Voice channel conversation settings. */;
  voice?: DiscordVoiceConfig /** PluralKit identity resolution for proxied messages. */;
  pluralkit?: DiscordPluralKitConfig /** Outbound response prefix override for this channel/account. */;
  responsePrefix?: string;
  /**
   * Per-channel ack reaction override.
   * Discord supports both unicode emoji and custom emoji names.
   */
  ackReaction?: string /** When to send ack reactions for this Discord account. Overrides messages.ackReactionScope. */;
  ackReactionScope?:
    | "group-mentions"
    | "group-all"
    | "direct"
    | "all"
    | "off"
    | "none" /** Bot activity status text (e.g. "Watching X"). */;
  activity?: string /** Bot status (online|dnd|idle|invisible). Defaults to online when presence is configured. */;
  status?:
    | "online"
    | "dnd"
    | "idle"
    | "invisible" /** Automatic runtime/quota presence signaling (status text + status mapping). */;
  autoPresence?: DiscordAutoPresenceConfig /** Activity type (0=Game, 1=Streaming, 2=Listening, 3=Watching, 4=Custom, 5=Competing). Defaults to 4 (Custom) when activity is set. */;
  activityType?:
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5 /** Streaming URL (Twitch/YouTube). Required when activityType=1. */;
  activityUrl?: string;
  /**
   * Legacy compatibility block. Discord no longer enforces channel-owned
   * timeouts for queued inbound agent runs.
   */
  inboundWorker?: {
    /**
     * Ignored. Queued Discord agent runs are governed by the session/tool/runtime
     * lifecycle, not by Discord channel config.
     */
    runTimeoutMs?: number;
  };
  /**
   * Discord EventQueue configuration. Controls how Discord gateway events are processed.
   * `listenerTimeout` only covers gateway listener work such as normalization and enqueue.
   * It does not control the lifetime of queued inbound agent turns.
   */
  eventQueue?: {
    /** Max time (ms) a single listener can run before being killed. Default: 120000. */ listenerTimeout?: number /** Max events queued before backpressure is applied. Default: 10000. */;
    maxQueueSize?: number /** Max concurrent event processing operations. Default: 50. */;
    maxConcurrency?: number;
  };
};
type DiscordConfig = {
  /** Optional per-account Discord configuration (multi-account). */ accounts?: Record<
    string,
    DiscordAccountConfig
  > /** Optional default account id when multiple accounts are configured. */;
  defaultAccount?: string;
} & DiscordAccountConfig;
//#endregion
//#region src/config/types.googlechat.d.ts
type GoogleChatDmConfig = {
  /** If false, ignore all incoming Google Chat DMs. Default: true. */ enabled?: boolean /** Direct message access policy (default: pairing). */;
  policy?: DmPolicy /** Allowlist for DM senders (user ids or emails). */;
  allowFrom?: Array<string | number>;
};
type GoogleChatGroupConfig = {
  /** If false, disable the bot in this space. */ enabled?: boolean /** Require mentioning the bot to trigger replies. */;
  requireMention?: boolean /** Sliding-window bot-pair loop guard for accepted bot-authored Google Chat messages. */;
  botLoopProtection?: ChannelBotLoopProtectionConfig /** Allowlist of users that can invoke the bot in this space. */;
  users?: Array<string | number> /** Optional system prompt for this space. */;
  systemPrompt?: string;
};
type GoogleChatActionConfig = {
  /** @deprecated Accepted for config compatibility; service-account auth cannot use reaction APIs. */ reactions?: boolean;
};
type GoogleChatAccountConfig = {
  /** Optional display name for this account (used in CLI/UI lists). */ name?: string /** Optional provider capability tags used for agent/runtime guidance. */;
  capabilities?: string[] /** Allow channel-initiated config writes (default: true). */;
  configWrites?: boolean /** If false, do not start this Google Chat account. Default: true. */;
  enabled?: boolean /** Allow bot-authored messages to trigger replies (default: false). */;
  allowBots?: boolean /** Sliding-window bot-pair loop guard for accepted bot-authored Google Chat messages. */;
  botLoopProtection?: ChannelBotLoopProtectionConfig;
  /**
   * Break-glass override: allow mutable principal matching (raw email entries) in allowlists.
   * Default behavior is ID-only matching.
   */
  dangerouslyAllowNameMatching?: boolean /** Default mention requirement for space messages (default: true). */;
  requireMention?: boolean;
  /**
   * Controls how space messages are handled:
   * - "open": spaces bypass allowlists; mention-gating applies
   * - "disabled": block all space messages
   * - "allowlist": only allow spaces present in channels.googlechat.groups
   */
  groupPolicy?: GroupPolicy /** Optional allowlist for space senders (user ids or emails). */;
  groupAllowFrom?: Array<
    string | number
  > /** Default delivery target for CLI --deliver when no explicit --reply-to is provided. */;
  defaultTo?: string /** Per-space configuration keyed by space id or name. */;
  groups?: Record<
    string,
    GoogleChatGroupConfig
  > /** Service account JSON (inline string, object, or secret reference). */;
  serviceAccount?:
    | string
    | Record<string, unknown>
    | SecretRef /** Explicit secret reference for service account JSON. */;
  serviceAccountRef?: SecretRef /** Service account JSON file path. */;
  serviceAccountFile?: string /** Webhook audience type (app-url or project-number). */;
  audienceType?: "app-url" | "project-number" /** Audience value (app URL or project number). */;
  audience?: string /** Exact add-on principal to accept when app-url delivery uses add-on tokens. */;
  appPrincipal?: string /** Google Chat webhook path (default: /googlechat). */;
  webhookPath?: string /** Google Chat webhook URL (used to derive the path). */;
  webhookUrl?: string /** Optional bot user resource name (users/...). */;
  botUser?: string /** Max space messages to keep as history context (0 disables). */;
  historyLimit?: number /** Max DM turns to keep as history context. */;
  dmHistoryLimit?: number /** Per-DM config overrides keyed by user id. */;
  dms?: Record<string, DmConfig> /** Outbound text chunk size (chars). Default: 4000. */;
  textChunkLimit?: number /** Delivery streaming config: chunk mode plus block streaming controls. */;
  streaming?: ChannelDeliveryStreamingConfig;
  mediaMaxMb?: number /** Control reply threading when reply tags are present (off|first|all|batched). */;
  replyToMode?: ReplyToMode /** Per-action tool gating (default: true for all). */;
  actions?: GoogleChatActionConfig;
  dm?: GoogleChatDmConfig /** Channel health monitor overrides for this channel/account. */;
  healthMonitor?: ChannelHealthMonitorConfig;
  /**
   * Typing indicator mode (default: "message").
   * - "none": No indicator
   * - "message": Send "_<name> is typing..._" then edit with response
   * - "reaction": React with 👀 to user message, remove on reply
   *   NOTE: Reaction mode requires user OAuth (not supported with service account auth).
   *   If configured, falls back to message mode with a warning.
   */
  typingIndicator?:
    | "none"
    | "message"
    | "reaction" /** Outbound response prefix override for this channel/account. */;
  responsePrefix?: string;
};
type GoogleChatConfig = {
  /** Optional per-account Google Chat configuration (multi-account). */ accounts?: Record<
    string,
    GoogleChatAccountConfig
  > /** Optional default account id when multiple accounts are configured. */;
  defaultAccount?: string;
} & GoogleChatAccountConfig;
//#endregion
//#region src/config/types.imessage.d.ts
/** Private-API and helper actions the iMessage runtime may expose to agents. */
type IMessageActionConfig = {
  reactions?: boolean;
  edit?: boolean;
  unsend?: boolean;
  reply?: boolean;
  sendWithEffect?: boolean;
  renameGroup?: boolean;
  setGroupIcon?: boolean;
  addParticipant?: boolean;
  removeParticipant?: boolean;
  leaveGroup?: boolean;
  sendAttachment?: boolean;
  polls?: boolean;
};
/** Inbound tapback notification policy. */
type IMessageReactionNotificationMode = "off" | "own" | "all";
type IMessageSendTransport = "auto" | "bridge" | "applescript";
/** Per-account iMessage runtime/config shape. */
type IMessageAccountConfig = {
  /** Optional display name for this account (used in CLI/UI lists). */ name?: string /** Optional provider capability tags used for agent/runtime guidance. */;
  capabilities?: string[] /** Markdown formatting overrides (tables). */;
  markdown?: MarkdownConfig /** Allow channel-initiated config writes (default: true). */;
  configWrites?: boolean /** If false, do not start this iMessage account. Default: true. */;
  enabled?: boolean /** imsg CLI binary path (default: imsg). */;
  cliPath?: string /** Optional Messages db path override. */;
  dbPath?: string /** Remote SSH host token for SCP attachment fetches (`host` or `user@host`). */;
  remoteHost?: string /** Enable or disable private API message actions. */;
  actions?: IMessageActionConfig /** Optional default send service (imessage|sms|auto). */;
  service?: "imessage" | "sms" | "auto" /** Preferred imsg RPC send transport. Default: auto. */;
  sendTransport?: IMessageSendTransport /** Optional default region (used when sending SMS). */;
  region?: string /** Direct message access policy (default: pairing). */;
  dmPolicy?: DmPolicy /** Optional allowlist for inbound handles or chat_id targets. */;
  allowFrom?: Array<
    string | number
  > /** Default delivery target for CLI --deliver when no explicit --reply-to is provided. */;
  defaultTo?: string /** Optional allowlist for group senders or chat_id targets. */;
  groupAllowFrom?: Array<string | number>;
  /**
   * Controls how group messages are handled:
   * - "open": groups bypass allowFrom; mention-gating applies
   * - "disabled": block all group messages entirely
   * - "allowlist": only allow group messages from senders in groupAllowFrom/allowFrom
   */
  groupPolicy?: GroupPolicy /** Supplemental context visibility policy (all|allowlist|allowlist_quote). */;
  contextVisibility?: ContextVisibilityMode /** Max group messages to keep as history context (0 disables). */;
  historyLimit?: number /** Max DM turns to keep as history context. */;
  dmHistoryLimit?: number /** Per-DM config overrides keyed by user ID. */;
  dms?: Record<string, DmConfig> /** Include attachments + reactions in watch payloads. */;
  includeAttachments?: boolean /** Allowed local iMessage attachment roots (supports single-segment `*` wildcards). */;
  attachmentRoots?: string[] /** Allowed remote iMessage attachment roots for SCP fetches (supports `*`). */;
  remoteAttachmentRoots?: string[] /** Max outbound media size in MB. */;
  mediaMaxMb?: number /** Timeout for probe/RPC operations in milliseconds (default: 10000). */;
  probeTimeoutMs?: number /** Outbound text chunk size (chars). Default: 4000. */;
  textChunkLimit?: number /** Structured streaming + chunking settings. */;
  streaming?: ChannelDeliveryStreamingConfig /** When private API is available, mark inbound chats read before dispatch (default: true). */;
  sendReadReceipts?: boolean;
  /**
   * Controls inbound tapback notifications:
   * - "off": ignore tapbacks
   * - "own" (default): notify only when users react to bot-authored messages
   * - "all": notify for all inbound tapbacks from authorized senders
   */
  reactionNotifications?: IMessageReactionNotificationMode;
  /**
   * Merge consecutive same-sender DM rows from `chat.db` into a single agent
   * turn, so Apple's split-send (`<command> <URL>` arriving as two separate
   * rows several seconds apart) lands as one merged message. DM-only — group chats
   * keep instant per-message dispatch. Widens the default inbound debounce
   * window to 7000 ms when enabled without an explicit
   * `messages.inbound.byChannel.imessage` or global
   * `messages.inbound.debounceMs`. Default: `false`.
   */
  coalesceSameSenderDms?: boolean;
  groups?: Record<
    string,
    {
      requireMention?: boolean;
      tools?: GroupToolPolicyConfig;
      toolsBySender?: GroupToolPolicyBySenderConfig;
      /**
       * Per-group system prompt. Injected into the agent's system prompt on
       * every turn that handles a message in that group. Matches the shape
       * already supported by Discord, Telegram, IRC, Slack, GoogleChat, and
       * other group-capable channels. The wildcard `groups["*"]` entry is
       * also honored.
       */
      systemPrompt?: string;
    }
  >;
  /**
   * Catchup: replay inbound messages that arrived in `chat.db` while the
   * gateway was offline (crash, restart, mac sleep). Disabled by default.
   * See https://github.com/openclaw/openclaw/issues/78649.
   */
  catchup?: {
    /** Master switch. Default `false`. */ enabled?: boolean;
    /**
     * Maximum age of replayable messages in minutes. Messages older than
     * `now - maxAgeMinutes` are skipped even when the cursor is older.
     * Defense against runaway replay (the inverse of #62761). Default
     * `120` (2 h). Clamp `[1, 720]`.
     */
    maxAgeMinutes?: number;
    /**
     * Maximum messages to replay per catchup pass. Default `50`. Clamp
     * `[1, 500]`.
     */
    perRunLimit?: number;
    /**
     * On first run when no cursor exists, look back this many minutes.
     * Default `30`.
     */
    firstRunLookbackMinutes?: number;
    /**
     * Per-message retry ceiling. After this many consecutive failed
     * dispatch attempts against the same message guid, catchup logs a
     * `warn` and force-advances the cursor past the wedged message.
     * Default `10`. Clamp `[1, 1000]`.
     */
    maxFailureRetries?: number;
  } /** Heartbeat visibility settings for this channel. */;
  heartbeat?: ChannelHeartbeatVisibilityConfig /** Channel health monitor overrides for this channel/account. */;
  healthMonitor?: ChannelHealthMonitorConfig /** Outbound response prefix override for this channel/account. */;
  responsePrefix?: string;
};
/** Top-level iMessage config, with optional account map layered over default account fields. */
type IMessageConfig = {
  /** Optional per-account iMessage configuration (multi-account). */ accounts?: Record<
    string,
    IMessageAccountConfig
  > /** Optional default account id when multiple accounts are configured. */;
  defaultAccount?: string;
} & IMessageAccountConfig;
//#endregion
//#region src/config/types.channel-messaging-common.d.ts
type CommonChannelMessagingConfig = {
  /** Optional display name for this account (used in CLI/UI lists). */ name?: string /** Optional provider capability tags used for agent/runtime guidance. */;
  capabilities?: string[] /** Markdown formatting overrides (tables). */;
  markdown?: MarkdownConfig /** Allow channel-initiated config writes (default: true). */;
  configWrites?: boolean /** If false, do not start this account. Default: true. */;
  enabled?: boolean /** Direct message access policy (default: pairing). */;
  dmPolicy?: DmPolicy /** Optional allowlist for inbound DM senders. */;
  allowFrom?: Array<
    string | number
  > /** Default delivery target for CLI --deliver when no explicit --reply-to is provided. */;
  defaultTo?: string /** Optional allowlist for group/channel senders. */;
  groupAllowFrom?: Array<string | number> /** Group/channel message handling policy. */;
  groupPolicy?: GroupPolicy;
  /**
   * Supplemental context visibility policy for fetched/group context.
   * - "all": include all quoted/thread/history context
   * - "allowlist": only include context from allowlisted senders
   * - "allowlist_quote": same as allowlist, but keep explicit quote/reply context
   */
  contextVisibility?: ContextVisibilityMode /** Max group/channel messages to keep as history context (0 disables). */;
  historyLimit?: number /** Max DM turns to keep as history context. */;
  dmHistoryLimit?: number /** Per-DM config overrides keyed by sender ID. */;
  dms?: Record<string, DmConfig> /** Outbound text chunk size (chars). */;
  textChunkLimit?: number /** Delivery streaming config: chunk mode plus block streaming controls. */;
  streaming?: ChannelDeliveryStreamingConfig /** Heartbeat visibility settings for this channel. */;
  heartbeat?: ChannelHeartbeatVisibilityConfig /** Channel health monitor overrides for this channel/account. */;
  healthMonitor?: ChannelHealthMonitorConfig /** Outbound response prefix override for this channel/account. */;
  responsePrefix?: string /** Max outbound media size in MB. */;
  mediaMaxMb?: number;
};
//#endregion
//#region src/config/types.irc.d.ts
type IrcAccountConfig = CommonChannelMessagingConfig & {
  /** IRC server hostname (example: irc.example.com). */ host?: string /** IRC server port (default: 6697 with TLS, otherwise 6667). */;
  port?: number /** Use TLS for IRC connection (default: true). */;
  tls?: boolean /** IRC nickname to identify this bot. */;
  nick?: string /** IRC USER field username (defaults to nick). */;
  username?: string /** IRC USER field realname (default: OpenClaw). */;
  realname?: string /** Optional IRC server password (sensitive). */;
  password?: string /** Optional file path containing IRC server password. */;
  passwordFile?: string /** Optional NickServ identify/register settings. */;
  nickserv?: {
    /** Enable NickServ identify/register after connect (default: enabled when password is set). */ enabled?: boolean /** NickServ service nick (default: NickServ). */;
    service?: string /** NickServ password (sensitive). */;
    password?: string /** Optional file path containing NickServ password. */;
    passwordFile?: string /** If true, send NickServ REGISTER on connect. */;
    register?: boolean /** Email used with NickServ REGISTER. */;
    registerEmail?: string;
  } /** Auto-join channel list at connect (example: ["#openclaw"]). */;
  channels?: string[] /** Outbound text chunk size (chars). Default: 350. */;
  textChunkLimit?: number;
  groups?: Record<
    string,
    {
      requireMention?: boolean;
      tools?: GroupToolPolicyConfig;
      toolsBySender?: GroupToolPolicyBySenderConfig;
      allowFrom?: Array<string | number>;
      skills?: string[];
      enabled?: boolean;
      systemPrompt?: string;
    }
  > /** Optional mention patterns specific to IRC channel messages. */;
  mentionPatterns?: string[];
};
type IrcConfig = {
  /** Optional per-account IRC configuration (multi-account). */ accounts?: Record<
    string,
    IrcAccountConfig
  > /** Optional default account id when multiple accounts are configured. */;
  defaultAccount?: string;
} & IrcAccountConfig;
//#endregion
//#region src/config/types.msteams.d.ts
type MSTeamsWebhookConfig = {
  /** Port for the webhook server. Default: 3978. */ port?: number /** Path for the messages endpoint. Default: /api/messages. */;
  path?: string;
};
/** Teams SDK cloud environment. Public cloud is the default. */
type MSTeamsCloudName = "Public" | "USGov" | "USGovDoD" | "China";
/**
 * Bot Framework OAuth SSO configuration for Microsoft Teams.
 *
 * When enabled, the plugin handles the `signin/tokenExchange` and
 * `signin/verifyState` invoke activities that Teams sends after an
 * `oauthCard` is presented to the user. The exchanged user token is
 * persisted via the Bot Framework User Token service so downstream
 * tools can call Microsoft Graph with delegated permissions.
 *
 * Prerequisites (Azure portal):
 * - The bot's Azure AD (Entra) app is configured with an exposed API
 *   scope (for example `access_as_user`) and lists the Teams client
 *   IDs in `knownClientApplications`.
 * - The Bot Framework channel registration has an OAuth Connection
 *   Setting whose name matches `connectionName` below, pointing at
 *   the same Azure AD app.
 */
type MSTeamsSsoConfig = {
  /** If true, handle signin/tokenExchange + signin/verifyState invokes. Default: false. */ enabled?: boolean;
  /**
   * Name of the OAuth connection configured on the Bot Framework channel
   * registration (Azure Bot resource). Required when `enabled` is true.
   */
  connectionName?: string;
};
/** Reply style for MS Teams messages. */
type MSTeamsReplyStyle = "thread" | "top-level";
/** Channel-level config for MS Teams. */
type MSTeamsChannelConfig = {
  /** Require @mention to respond. Default: true. */ requireMention?: boolean /** Optional tool policy overrides for this channel. */;
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig /** Reply style: "thread" replies to the message, "top-level" posts a new message. */;
  replyStyle?: MSTeamsReplyStyle;
};
/** Team-level config for MS Teams. */
type MSTeamsTeamConfig = {
  /** Default requireMention for channels in this team. */ requireMention?: boolean /** Default tool policy for channels in this team. */;
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig /** Default reply style for channels in this team. */;
  replyStyle?: MSTeamsReplyStyle /** Per-channel overrides. Key is conversation ID (e.g., "19:...@thread.tacv2"). */;
  channels?: Record<string, MSTeamsChannelConfig>;
};
type MSTeamsConfig = {
  /** If false, do not start the MS Teams provider. Default: true. */ enabled?: boolean /** Optional provider capability tags used for agent/runtime guidance. */;
  capabilities?: string[];
  /**
   * Break-glass override: allow mutable identity matching (display names/UPNs) in allowlists.
   * Default behavior is ID-only matching.
   */
  dangerouslyAllowNameMatching?: boolean /** Markdown formatting overrides (tables). */;
  markdown?: MarkdownConfig /** Allow channel-initiated config writes (default: true). */;
  configWrites?: boolean /** Azure Bot App ID (from Azure Bot registration). */;
  appId?: string /** Azure Bot App Password / Client Secret. */;
  appPassword?: SecretInput /** Azure AD Tenant ID (for single-tenant bots). */;
  tenantId?: string /** Teams SDK cloud environment. Default: Public. */;
  cloud?: MSTeamsCloudName;
  /**
   * Bot Connector service URL used by SDK proactive sends/edits/deletes.
   * Set with `cloud` for USGov/DoD SDK clouds; set alone for GCC.
   */
  serviceUrl?: string;
  /**
   * Authentication type.
   * - `"secret"` (default): uses `appPassword` (client secret).
   * - `"federated"`: uses workload identity / managed identity / certificate.
   */
  authType?:
    | "secret"
    | "federated" /** Path to a PEM certificate file for certificate-based auth. Used when `authType` is `"federated"`. */;
  certificatePath?: string /** Certificate thumbprint (hex SHA-1) for certificate-based auth. */;
  certificateThumbprint?: string /** If `true`, use Azure Managed Identity (system- or user-assigned) instead of a certificate. */;
  useManagedIdentity?: boolean /** User-assigned managed-identity client ID. When omitted with `useManagedIdentity: true`, system-assigned identity is used. */;
  managedIdentityClientId?: string /** Webhook server configuration. */;
  webhook?: MSTeamsWebhookConfig /** Direct message access policy (default: pairing). */;
  dmPolicy?: DmPolicy /** Allowlist for DM senders (AAD object IDs or UPNs). */;
  allowFrom?: Array<string> /** Default delivery target for CLI --deliver when no explicit --reply-to is provided. */;
  defaultTo?: string /** Optional allowlist for group/channel senders (AAD object IDs or UPNs). */;
  groupAllowFrom?: Array<string>;
  /**
   * Controls how group/channel messages are handled:
   * - "open": groups bypass allowFrom; mention-gating applies
   * - "disabled": block all group messages
   * - "allowlist": only allow group messages from senders in groupAllowFrom/allowFrom
   */
  groupPolicy?: GroupPolicy /** Supplemental context visibility policy (all|allowlist|allowlist_quote). */;
  contextVisibility?: ContextVisibilityMode /** Outbound text chunk size (chars). Default: 4000. */;
  textChunkLimit?: number /** Preview/progress streaming config for visible in-progress replies. */;
  streaming?: ChannelPreviewStreamingConfig /** Send native Teams typing indicator before replies. Default: true for groups/channels; DMs use informative stream status. */;
  typingIndicator?: boolean;
  /**
   * Allowed host suffixes for inbound attachment downloads.
   * Use ["*"] to allow any host (not recommended).
   */
  mediaAllowHosts?: Array<string>;
  /**
   * Allowed host suffixes for attaching Authorization headers to inbound media retries.
   * Use specific hosts only; avoid multi-tenant suffixes.
   */
  mediaAuthAllowHosts?: Array<string>;
  /**
   * Query Graph for channel/group media when Bot Framework HTML omits file markers.
   * Requires the documented Graph permissions and adds one message lookup per
   * otherwise unresolved HTML activity. Default: false.
   */
  graphMediaFallback?: boolean /** Default: require @mention to respond in channels/groups. */;
  requireMention?: boolean /** Max group/channel messages to keep as history context (0 disables). */;
  historyLimit?: number /** Max DM turns to keep as history context. */;
  dmHistoryLimit?: number /** Per-DM config overrides keyed by user ID. */;
  dms?: Record<
    string,
    DmConfig
  > /** Default reply style: "thread" replies to the message, "top-level" posts a new message. */;
  replyStyle?: MSTeamsReplyStyle /** Per-team config. Key is team ID (from the /team/ URL path segment). */;
  teams?: Record<
    string,
    MSTeamsTeamConfig
  > /** Max inbound and outbound media size in MB (default: 100MB). */;
  mediaMaxMb?: number /** SharePoint site ID for file uploads in group chats/channels (e.g., "contoso.sharepoint.com,guid1,guid2"). */;
  sharePointSiteId?: string /** Heartbeat visibility settings for this channel. */;
  heartbeat?: ChannelHeartbeatVisibilityConfig /** Channel health monitor overrides for this channel. */;
  healthMonitor?: ChannelHealthMonitorConfig /** Outbound response prefix override for this channel/account. */;
  responsePrefix?: string /** Show a welcome Adaptive Card when the bot is added to a 1:1 chat. Default: true. */;
  welcomeCard?: boolean /** Custom prompt starter labels shown on the welcome card. */;
  promptStarters?: string[] /** Show a welcome message when the bot is added to a group chat. Default: false. */;
  groupWelcomeCard?: boolean /** Enable the Teams feedback loop (thumbs up/down) on AI-generated messages. Default: true. */;
  feedbackEnabled?: boolean /** Enable background reflection when a user gives negative feedback. Default: true. */;
  feedbackReflection?: boolean /** Minimum interval (ms) between reflections per session. Default: 300000 (5 min). */;
  feedbackReflectionCooldownMs?: number /** Delegated auth settings for user-scoped Graph API actions (e.g., reactions). */;
  delegatedAuth?: {
    /** Enable delegated auth (user sign-in for Graph actions that need user scope). */ enabled?: boolean /** Additional scopes to request during OAuth consent. */;
    scopes?: string[];
  } /** Bot Framework OAuth SSO (signin/tokenExchange + signin/verifyState) settings. */;
  sso?: MSTeamsSsoConfig;
};
//#endregion
//#region src/config/types.signal.d.ts
type SignalReactionNotificationMode = "off" | "own" | "all" | "allowlist";
type SignalReactionLevel = "off" | "ack" | "minimal" | "extensive";
type SignalApiMode = "auto" | "native" | "container";
type SignalGroupConfig = {
  requireMention?: boolean /** Emit internal message hooks for mention-skipped group messages. */;
  ingest?: boolean;
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig;
};
type SignalAccountConfig = CommonChannelMessagingConfig & {
  /** Optional explicit E.164 account for signal-cli. */ account?: string /** Optional account UUID for signal-cli (used for loop protection). */;
  accountUuid?: string /** Optional signal-cli config directory path (passed as --config). */;
  configPath?: string /** Optional full base URL for signal-cli HTTP daemon. */;
  httpUrl?: string /** HTTP host for signal-cli daemon (default 127.0.0.1). */;
  httpHost?: string /** HTTP port for signal-cli daemon (default 8080). */;
  httpPort?: number /** signal-cli binary path (default: signal-cli). */;
  cliPath?: string /** Auto-start signal-cli daemon (default: true if httpUrl not set). */;
  autoStart?: boolean /** Max time to wait for signal-cli daemon startup (ms, cap 120000). */;
  startupTimeoutMs?: number;
  receiveMode?: "on-start" | "manual";
  ignoreAttachments?: boolean;
  ignoreStories?: boolean;
  sendReadReceipts?: boolean /** OpenClaw-side target aliases keyed by friendly name. */;
  aliases?: Record<string, string> /** Per-group overrides keyed by Signal group id (or "*"). */;
  groups?: Record<
    string,
    SignalGroupConfig
  > /** Outbound text chunk size (chars). Default: 4000. */;
  textChunkLimit?: number /** Control native reply quoting when replies target an inbound Signal message. */;
  replyToMode?: ReplyToMode /** Optional per-chat-type native reply quoting overrides. */;
  replyToModeByChatType?: Partial<
    Record<"direct" | "group", ReplyToMode>
  > /** Reaction notification mode (off|own|all|allowlist). Default: own. */;
  reactionNotifications?: SignalReactionNotificationMode /** Allowlist for reaction notifications when mode is allowlist. */;
  reactionAllowlist?: Array<string | number> /** Action toggles for message tool capabilities. */;
  actions?: {
    /** Enable/disable sending reactions via message tool (default: true). */ reactions?: boolean;
  };
  /**
   * Controls agent reaction behavior:
   * - "off": No reactions
   * - "ack": Only automatic ack reactions (👀 when processing)
   * - "minimal": Agent can react sparingly (default)
   * - "extensive": Agent can react liberally
   */
  reactionLevel?: SignalReactionLevel;
};
type SignalConfig = {
  /**
   * Signal API mode (channel-global):
   * - "auto" (default): Auto-detect based on available endpoints
   * - "native": Use native signal-cli with JSON-RPC + SSE (/api/v1/rpc, /api/v1/events)
   * - "container": Use bbernhard/signal-cli-rest-api with REST + WebSocket (/v2/send, /v1/receive/{account}).
   *   Requires the container to run with MODE=json-rpc for real-time message receiving.
   */
  apiMode?: SignalApiMode /** Optional per-account Signal configuration (multi-account). */;
  accounts?: Record<
    string,
    SignalAccountConfig
  > /** Optional default account id when multiple accounts are configured. */;
  defaultAccount?: string;
} & SignalAccountConfig;
//#endregion
//#region src/config/types.telegram.d.ts
type TelegramActionConfig = {
  reactions?: boolean;
  sendMessage?: boolean /** Enable poll creation. Requires sendMessage to also be enabled. */;
  poll?: boolean;
  deleteMessage?: boolean;
  editMessage?: boolean /** Enable sticker actions (send and search). */;
  sticker?: boolean /** Enable forum topic creation. */;
  createForumTopic?: boolean /** Enable forum topic editing (rename / change icon). */;
  editForumTopic?: boolean;
};
type TelegramThreadBindingsConfig = SessionThreadBindingsConfig & {
  /**
   * @deprecated Use spawnSessions instead.
   */
  spawnSubagentSessions?: boolean;
  /**
   * @deprecated Use spawnSessions instead.
   */
  spawnAcpSessions?: boolean;
};
type TelegramNetworkConfig = {
  /** Override Node's autoSelectFamily behavior (true = enable, false = disable). */ autoSelectFamily?: boolean;
  /**
   * DNS result order for network requests ("ipv4first" | "verbatim").
   * Set to "ipv4first" to prioritize IPv4 addresses and work around IPv6 issues.
   * Default: "ipv4first" on Node 22+ to avoid common fetch failures.
   */
  dnsResultOrder?: "ipv4first" | "verbatim";
  /**
   * Dangerous opt-in for Telegram media downloads in trusted fake-IP or
   * transparent-proxy environments that resolve api.telegram.org to
   * private/internal/special-use addresses.
   */
  dangerouslyAllowPrivateNetwork?: boolean;
};
type TelegramInlineButtonsScope = "off" | "dm" | "group" | "all" | "allowlist";
type TelegramStreamingMode = "off" | "partial" | "block" | "progress";
type TelegramExecApprovalTarget = "dm" | "channel" | "both";
type TelegramPreviewStreamingConfig = Omit<ChannelPreviewStreamingConfig, "preview"> & {
  preview?: ChannelStreamingPreviewConfig;
};
type TelegramExecApprovalConfig = {
  /** Enable mode for Telegram exec approvals on this account. Default: auto when approvers can be resolved; false disables. */ enabled?: NativeExecApprovalEnableMode /** Telegram user IDs allowed to approve exec requests. Optional: falls back to numeric owner IDs inferred from commands.ownerAllowFrom when possible. */;
  approvers?: Array<
    string | number
  > /** Only forward approvals for these agent IDs. Omit = all agents. */;
  agentFilter?: string[] /** Only forward approvals matching these session key patterns (substring or regex). */;
  sessionFilter?: string[] /** Where to send approval prompts. Default: "dm". */;
  target?: TelegramExecApprovalTarget;
};
type TelegramCapabilitiesConfig =
  | string[]
  | {
      inlineButtons?: TelegramInlineButtonsScope;
    };
/** Custom command definition for Telegram bot menu. */
type TelegramCustomCommand = {
  /** Command name (without leading /). */ command: string /** Description shown in Telegram command menu. */;
  description: string;
};
type TelegramAccountConfig = {
  /** Optional display name for this account (used in CLI/UI lists). */ name?: string /** Optional provider capability tags used for agent/runtime guidance. */;
  capabilities?: TelegramCapabilitiesConfig /** Telegram-native exec approval delivery + approver authorization. */;
  execApprovals?: TelegramExecApprovalConfig /** Markdown formatting overrides (tables). */;
  markdown?: MarkdownConfig /** Override native command registration for Telegram (bool or "auto"). */;
  commands?: ProviderCommandsConfig /** Custom commands to register in Telegram's command menu (merged with native). */;
  customCommands?: TelegramCustomCommand[] /** Allow channel-initiated config writes (default: true). */;
  configWrites?: boolean;
  /**
   * Controls how Telegram direct chats (DMs) are handled:
   * - "pairing" (default): unknown senders get a pairing code; owner must approve
   * - "allowlist": only allow senders in allowFrom (or paired allow store)
   * - "open": allow all inbound DMs (requires allowFrom to include "*")
   * - "disabled": ignore all inbound DMs
   */
  dmPolicy?: DmPolicy /** If false, do not start this Telegram account. Default: true. */;
  enabled?: boolean;
  botToken?: string /** Path to a regular file containing the bot token; symlinks are rejected. */;
  tokenFile?: string /** Control reply threading when reply tags are present (off|first|all|batched). */;
  replyToMode?: ReplyToMode;
  /**
   * @deprecated Telegram DM topic session detection is automatic from bot
   * getMe.has_topics_enabled. This legacy config is removed by doctor --fix.
   */
  dm?: TelegramDmConfig;
  groups?: Record<
    string,
    TelegramGroupConfig
  > /** Per-DM configuration for Telegram DM topics (key is chat ID). */;
  direct?: Record<
    string,
    TelegramDirectConfig
  > /** DM allowlist (numeric Telegram user IDs). Onboarding can resolve @username to IDs. */;
  allowFrom?: Array<
    string | number
  > /** Default delivery target for CLI `--deliver` when no explicit `--reply-to` is provided. */;
  defaultTo?:
    | string
    | number /** Optional allowlist for Telegram group senders (numeric Telegram user IDs). */;
  groupAllowFrom?: Array<string | number>;
  /**
   * Controls how group messages are handled:
   * - "open": groups bypass allowFrom, only mention-gating applies
   * - "disabled": block all group messages entirely
   * - "allowlist": only allow group messages from senders in groupAllowFrom/allowFrom
   */
  groupPolicy?: GroupPolicy /** Scope configured groupChat mentionPatterns to selected Telegram chat/thread IDs. */;
  mentionPatterns?: MentionPatternsPolicyConfig /** Supplemental context visibility policy (all|allowlist|allowlist_quote). */;
  contextVisibility?: ContextVisibilityMode /** Max group messages to keep as history context (0 disables). */;
  historyLimit?: number /** Max DM turns to keep as history context. */;
  dmHistoryLimit?: number /** Per-DM config overrides keyed by user ID. */;
  dms?: Record<string, DmConfig> /** Outbound text chunk size (chars). Default: 4000. */;
  textChunkLimit?: number;
  /**
   * Use Telegram Bot API 10.1 rich messages for text sends and edits.
   * When false (default), falls back to HTML/plain text formatting via sendMessage.
   * Set to true to enable native tables, details, and rich media via sendRichMessage.
   * Note: Some Telegram clients (Web, Desktop, older mobile) do NOT support
   * sendRichMessage and will show "This message is not supported" errors.
   * Default: false.
   */
  richMessages?: boolean /** Streaming + chunking settings. Prefer this nested shape over legacy flat keys. */;
  streaming?: TelegramPreviewStreamingConfig;
  mediaMaxMb?: number /** Telegram API client timeout in seconds (grammY ApiClientOptions). */;
  timeoutSeconds?: number /** Buffer window for Telegram media groups/albums before dispatching them as one inbound message. Default: 500ms. */;
  mediaGroupFlushMs?: number /** Telegram polling watchdog threshold in milliseconds. Default: 120000. */;
  pollingStallThresholdMs?: number /** Retry policy for outbound Telegram API calls. */;
  retry?: OutboundRetryConfig /** Network transport overrides for Telegram. */;
  network?: TelegramNetworkConfig;
  proxy?: string;
  webhookUrl?: string;
  webhookSecret?: string;
  webhookPath?: string /** Local webhook listener bind host (default: 127.0.0.1). */;
  webhookHost?: string /** Local webhook listener bind port (default: 8787). */;
  webhookPort?: number /** Path to the self-signed certificate (PEM) to upload to Telegram during webhook registration. */;
  webhookCertPath?: string /** Per-action tool gating (default: true for all). */;
  actions?: TelegramActionConfig /** Telegram thread/conversation binding overrides. */;
  threadBindings?: TelegramThreadBindingsConfig;
  /**
   * Controls which user reactions trigger notifications:
   * - "off" (default): ignore all reactions
   * - "own": notify when users react to bot messages
   * - "all": notify agent of all reactions
   */
  reactionNotifications?: "off" | "own" | "all";
  /**
   * Controls agent's reaction capability:
   * - "off": agent cannot react
   * - "ack" (default): bot sends acknowledgment reactions (👀 while processing)
   * - "minimal": agent can react sparingly (guideline: 1 per 5-10 exchanges)
   * - "extensive": agent can react liberally when appropriate
   */
  reactionLevel?:
    | "off"
    | "ack"
    | "minimal"
    | "extensive" /** Heartbeat visibility settings for this channel. */;
  heartbeat?: ChannelHeartbeatVisibilityConfig /** Channel health monitor overrides for this channel/account. */;
  healthMonitor?: ChannelHealthMonitorConfig /** Controls whether link previews are shown in outbound messages. Default: true. */;
  linkPreview?: boolean /** Send Telegram bot error replies silently (no notification sound). Default: false. */;
  silentErrorReplies?: boolean /** Controls outbound error reporting: always, once per cooldown window, or silent. */;
  errorPolicy?:
    | "always"
    | "once"
    | "silent" /** Cooldown window for `errorPolicy: "once"` in milliseconds. */;
  errorCooldownMs?: number;
  /**
   * Per-channel outbound response prefix override.
   *
   * When set, this takes precedence over the global `messages.responsePrefix`.
   * Use `""` to explicitly disable a global prefix for this channel.
   * Use `"auto"` to derive `[{identity.name}]` from the routed agent.
   */
  responsePrefix?: string;
  /**
   * Per-channel ack reaction override.
   * Telegram expects unicode emoji (e.g., "👀") rather than shortcodes.
   */
  ackReaction?: string /** Custom Telegram Bot API root URL (e.g. "https://my-proxy.example.com" or a local Bot API server), not a /bot<TOKEN> endpoint. */;
  apiRoot?: string /** Trusted local filesystem roots for self-hosted Telegram Bot API absolute file_path values. */;
  trustedLocalFileRoots?: string[] /** Auto-rename DM forum topics on first message using LLM. Default: true. */;
  autoTopicLabel?: AutoTopicLabelConfig;
};
/**
 * @deprecated Telegram DM topic session detection is automatic from bot
 * getMe.has_topics_enabled. This legacy type remains for plugin SDK
 * compatibility only.
 */
type TelegramDmThreadReplies = "off" | "inbound" | "always";
/**
 * @deprecated Legacy config removed by doctor --fix.
 */
type TelegramDmConfig = {
  /** @deprecated Use bot getMe.has_topics_enabled; doctor removes this key. */ threadReplies?: TelegramDmThreadReplies;
};
type TelegramTopicConfig = {
  requireMention?: boolean /** Emit internal message hooks for mention-skipped topic messages. */;
  ingest?: boolean /** Per-topic override for group message policy (open|disabled|allowlist). */;
  groupPolicy?: GroupPolicy /** If specified, only load these skills for this topic. Omit = all skills; empty = no skills. */;
  skills?: string[] /** If false, disable the bot for this topic. */;
  enabled?: boolean /** Optional allowlist for topic senders (numeric Telegram user IDs). */;
  allowFrom?: Array<string | number> /** Optional system prompt snippet for this topic. */;
  systemPrompt?: string /** If true, skip automatic voice-note transcription for mention detection in this topic. */;
  disableAudioPreflight?: boolean /** Route this topic to a specific agent (overrides group-level and binding routing). */;
  agentId?: string /** Controls outbound error reporting for this topic. */;
  errorPolicy?:
    | "always"
    | "once"
    | "silent" /** Cooldown window for `errorPolicy: "once"` in milliseconds. */;
  errorCooldownMs?: number;
};
type TelegramGroupConfig = {
  requireMention?: boolean /** Emit internal message hooks for mention-skipped group messages. */;
  ingest?: boolean /** Per-group override for group message policy (open|disabled|allowlist). */;
  groupPolicy?: GroupPolicy /** Optional tool policy overrides for this group. */;
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig /** If specified, only load these skills for this group (when no topic). Omit = all skills; empty = no skills. */;
  skills?: string[] /** Per-topic configuration (key is message_thread_id as string, or "*" for topic defaults). */;
  topics?: Record<
    string,
    TelegramTopicConfig
  > /** If false, disable the bot for this group (and its topics). */;
  enabled?: boolean /** Optional allowlist for group senders (numeric Telegram user IDs). */;
  allowFrom?: Array<string | number> /** Optional system prompt snippet for this group. */;
  systemPrompt?: string /** If true, skip automatic voice-note transcription for mention detection in this group. */;
  disableAudioPreflight?: boolean /** Controls outbound error reporting for this group. */;
  errorPolicy?:
    | "always"
    | "once"
    | "silent" /** Cooldown window for `errorPolicy: "once"` in milliseconds. */;
  errorCooldownMs?: number;
};
/** Config for LLM-based auto-topic labeling. */
type AutoTopicLabelConfig =
  | boolean
  | {
      enabled?: boolean /** Custom prompt for LLM-based topic naming. */;
      prompt?: string;
    };
type TelegramDirectConfig = {
  /** Per-DM override for DM message policy (open|disabled|allowlist). */ dmPolicy?: DmPolicy /** @deprecated Use bot getMe.has_topics_enabled; doctor removes this key. */;
  threadReplies?: TelegramDmThreadReplies /** Optional tool policy overrides for this DM. */;
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig /** If specified, only load these skills for this DM (when no topic). Omit = all skills; empty = no skills. */;
  skills?: string[] /** Per-topic configuration for DM topics (key is message_thread_id as string, or "*" for topic defaults). */;
  topics?: Record<
    string,
    TelegramTopicConfig
  > /** If false, disable the bot for this DM (and its topics). */;
  enabled?: boolean /** If true, require messages to be from a topic when topics are enabled. */;
  requireTopic?: boolean /** Optional allowlist for DM senders (numeric Telegram user IDs). */;
  allowFrom?: Array<string | number> /** Optional system prompt snippet for this DM. */;
  systemPrompt?: string /** Controls outbound error reporting for this DM. */;
  errorPolicy?:
    | "always"
    | "once"
    | "silent" /** Cooldown window for `errorPolicy: "once"` in milliseconds. */;
  errorCooldownMs?: number /** Auto-rename DM forum topics on first message using LLM. Default: true. */;
  autoTopicLabel?: AutoTopicLabelConfig;
};
type TelegramConfig = {
  /** Optional per-account Telegram configuration (multi-account). */ accounts?: Record<
    string,
    TelegramAccountConfig
  > /** Optional default account id when multiple accounts are configured. */;
  defaultAccount?: string;
} & TelegramAccountConfig;
//#endregion
//#region src/utils/reaction-level.d.ts
/**
 * Shared reaction-level resolver for channel plugins that expose ACK and agent reaction controls.
 * Channel adapters supply defaults/fallbacks; this helper owns the common flag expansion.
 */
/** User-configurable reaction behavior level for channel delivery. */
type ReactionLevel = "off" | "ack" | "minimal" | "extensive";
/** Expanded reaction flags consumed by runtime delivery and prompt guidance. */
type ResolvedReactionLevel = {
  level: ReactionLevel /** Whether ACK reactions (e.g., 👀 when processing) are enabled. */;
  ackEnabled: boolean /** Whether agent-controlled reactions are enabled. */;
  agentReactionsEnabled: boolean /** Guidance level for agent reactions (minimal = sparse, extensive = liberal). */;
  agentReactionGuidance?: "minimal" | "extensive";
};
/** Resolves raw reaction config into ACK and agent-reaction runtime flags. */
declare function resolveReactionLevel(params: {
  value: unknown;
  defaultLevel: ReactionLevel;
  invalidFallback: "ack" | "minimal";
}): ResolvedReactionLevel;
//#endregion
//#region src/config/types.whatsapp.d.ts
type WhatsAppActionConfig = {
  reactions?: boolean;
  sendMessage?: boolean;
  polls?: boolean /** Enable the experimental requester-bound voice-call tool. Default: false. */;
  calls?: boolean;
};
type WhatsAppReactionLevel = ReactionLevel;
type WhatsAppGroupConfig = {
  requireMention?: boolean;
  tools?: GroupToolPolicyConfig;
  toolsBySender?: GroupToolPolicyBySenderConfig /** Optional system prompt for this group. */;
  systemPrompt?: string;
};
type WhatsAppDirectConfig = {
  /** Optional system prompt for this direct chat. */ systemPrompt?: string;
};
type WhatsAppAckReactionConfig = {
  /** Emoji to use for acknowledgment (e.g., "👀"). Empty = disabled. */ emoji?: string /** Send reactions in direct chats. Default: true. */;
  direct?: boolean;
  /**
   * Send reactions in group chats:
   * - "always": react to all group messages
   * - "mentions": react only when bot is mentioned
   * - "never": never react in groups
   * Default: "mentions"
   */
  group?: "always" | "mentions" | "never";
};
type WhatsAppSharedConfig = {
  /** Whether the WhatsApp channel is enabled. */ enabled?: boolean /** Direct message access policy (default: pairing). */;
  dmPolicy?: DmPolicy /** Same-phone setup (bot uses your personal WhatsApp number). */;
  selfChatMode?: boolean /** Optional allowlist for WhatsApp direct chats (E.164). */;
  allowFrom?: string[] /** Default delivery target for CLI `--deliver` when no explicit `--reply-to` is provided (E.164 or group JID). */;
  defaultTo?: string /** Optional allowlist for WhatsApp group senders (E.164). */;
  groupAllowFrom?: string[];
  /**
   * Controls how group messages are handled:
   * - "open": groups bypass allowFrom, only mention-gating applies
   * - "disabled": block all group messages entirely
   * - "allowlist": only allow group messages from senders in groupAllowFrom/allowFrom
   */
  groupPolicy?: GroupPolicy /** Scope configured groupChat mentionPatterns to selected WhatsApp conversation IDs. */;
  mentionPatterns?: MentionPatternsPolicyConfig /** Supplemental context visibility policy (all|allowlist|allowlist_quote). */;
  contextVisibility?: ContextVisibilityMode /** Max group messages to keep as history context (0 disables). */;
  historyLimit?: number /** Max DM turns to keep as history context. */;
  dmHistoryLimit?: number /** Per-DM history overrides keyed by user ID. */;
  dms?: Record<string, DmConfig> /** Outbound text chunk size (chars). Default: 4000. */;
  textChunkLimit?: number /** Delivery streaming config: chunk mode plus block streaming controls. */;
  streaming?: ChannelDeliveryStreamingConfig /** Maximum media file size in MB. Default: 50. */;
  mediaMaxMb?: number;
  groups?: Record<
    string,
    WhatsAppGroupConfig
  > /** Per-direct-chat prompt overrides keyed by user ID or `*` wildcard. */;
  direct?: Record<
    string,
    WhatsAppDirectConfig
  > /** Acknowledgment reaction sent immediately upon message receipt. */;
  ackReaction?: WhatsAppAckReactionConfig;
  /**
   * Controls agent reaction behavior:
   * - "off": No reactions
   * - "ack": Only automatic ack reactions
   * - "minimal" (default): Agent can react sparingly
   * - "extensive": Agent can react liberally
   */
  reactionLevel?: WhatsAppReactionLevel /** Debounce window (ms) for batching rapid consecutive messages from the same sender (0 to disable). */;
  debounceMs?: number /** Reply threading mode for auto-replies (off|first|all|batched). */;
  replyToMode?: ReplyToMode /** Heartbeat visibility settings. */;
  heartbeat?: ChannelHeartbeatVisibilityConfig /** Channel health monitor overrides for this channel/account. */;
  healthMonitor?: ChannelHealthMonitorConfig;
};
type WhatsAppConfigCore = {
  /** Optional provider capability tags used for agent/runtime guidance. */ capabilities?: string[] /** Markdown formatting overrides (tables). */;
  markdown?: MarkdownConfig /** Allow channel-initiated config writes (default: true). */;
  configWrites?: boolean /** Send read receipts for incoming messages (default true). */;
  sendReadReceipts?: boolean /** Inbound message prefix override (WhatsApp only). */;
  messagePrefix?: string /** Outbound response prefix override. */;
  responsePrefix?: string;
};
type WhatsAppConfig = WhatsAppConfigCore &
  WhatsAppSharedConfig & {
    /** Optional per-account WhatsApp configuration (multi-account). */ accounts?: Record<
      string,
      WhatsAppAccountConfig
    > /** Optional default account id when multiple accounts are configured. */;
    defaultAccount?: string /** Per-action tool gating. Calls default to false; existing actions default to true. */;
    actions?: WhatsAppActionConfig /** Plugin hook opt-in configuration for privacy-sensitive inbound events. */;
    pluginHooks?: {
      /** Enable message_received hooks to broadcast inbound WhatsApp messages to plugins. */ messageReceived?: boolean;
    };
  };
type WhatsAppAccountConfig = WhatsAppConfigCore &
  WhatsAppSharedConfig & {
    /** Optional display name for this account (used in CLI/UI lists). */ name?: string /** If false, do not start this WhatsApp account provider. Default: true. */;
    enabled?: boolean /** Override auth directory (Baileys multi-file auth state). */;
    authDir?: string /** Plugin hook opt-in configuration for privacy-sensitive inbound events. */;
    pluginHooks?: {
      /** Enable message_received hooks to broadcast inbound WhatsApp messages to plugins. */ messageReceived?: boolean;
    };
  };
//#endregion
//#region src/config/types.channels.d.ts
type ChannelDefaultsConfig = {
  /** Default group-chat admission policy inherited by channels that support groups. */ groupPolicy?: GroupPolicy /** Default history/context visibility inherited by channel configs. */;
  contextVisibility?: ContextVisibilityMode /** Default heartbeat visibility for all channels. */;
  heartbeat?: ChannelHeartbeatVisibilityConfig /** Default pair loop guard settings for channels that support bot loop protection. */;
  botLoopProtection?: ChannelBotLoopProtectionConfig;
};
/** Provider/channel/target model override map used by channel dispatch. Keys are channel-specific group IDs, thread IDs, channel names, or DM peer identifiers (see docs/gateway/config-channels.md). */
type ChannelModelByChannelConfig = Record<string, Record<string, string>>;
type ExtensionNestedPolicyConfig = {
  /** Channel/plugin-owned nested policy mode, such as dm/group allowlist policy. */ policy?: string /** Sender ids, usernames, or platform ids accepted by the nested policy. */;
  allowFrom?:
    | Array<string | number>
    | ReadonlyArray<
        string | number
      > /** Plugin-owned config keys that are intentionally outside the core schema. */;
  [key: string]: unknown;
};
type ExtensionAccountConfig = ExtensionNestedPolicyConfig & {
  /** Account-scoped default delivery target for CLI --deliver. */ defaultTo?:
    | string
    | number /** Account-scoped direct-message policy override. */;
  dmPolicy?: string /** Nested DM policy/config owned by the plugin. */;
  dm?: ExtensionNestedPolicyConfig /** Account-scoped media size limit in megabytes. */;
  mediaMaxMb?: number /** Whether channel setup/doctor flows may write this account config. */;
  configWrites?: boolean;
};
/** JSON-compatible open-world channel section for plugin ids unknown to core. */
type OpenWorldChannelConfig = ReturnType<typeof JSON.parse>;
/**
 * Base type for extension channel config sections.
 * Extensions can use this as a starting point for their channel config.
 */
type ExtensionChannelConfig = {
  /** Enables this plugin-owned channel section. */ enabled?: boolean /** Sender ids, usernames, or platform ids allowed by the channel policy. */;
  allowFrom?:
    | Array<string | number>
    | ReadonlyArray<
        string | number
      > /** Default delivery target for CLI --deliver when no explicit --reply-to is provided. */;
  defaultTo?:
    | string
    | number /** Optional default account id when multiple accounts are configured. */;
  defaultAccount?: string /** Plugin-owned direct-message policy mode. */;
  dmPolicy?: string /** Plugin-owned group admission policy mode. */;
  groupPolicy?: GroupPolicy /** Mention include/exclude policy shared by channels with group support. */;
  mentionPatterns?:
    | MentionPatternsPolicyConfig
    | string[] /** Channel-specific context visibility override. */;
  contextVisibility?: ContextVisibilityMode /** Channel health-monitor settings exposed through the shared channel contract. */;
  healthMonitor?: ChannelHealthMonitorConfig /** Nested direct-message config owned by the channel plugin. */;
  dm?: ExtensionNestedPolicyConfig /** Plugin-owned network config, including private-network controls when supported. */;
  network?: Record<
    string,
    unknown
  > /** Plugin-owned group config keyed by platform group id/name. */;
  groups?: Record<string, unknown> /** Plugin-owned room config keyed by platform room id/name. */;
  rooms?: Record<string, unknown> /** Channel-wide media size limit in megabytes. */;
  mediaMaxMb?: number /** Base callback URL used by interaction/webhook-capable channel plugins. */;
  callbackBaseUrl?: string /** Interaction callback config; callbackBaseUrl mirrors the top-level fallback. */;
  interactions?: {
    callbackBaseUrl?: string;
    [key: string]: unknown;
  } /** Plugin-owned native exec approval routing config. */;
  execApprovals?: Record<string, unknown>;
  threadBindings?: {
    /** Enables thread-bound session routing for this channel. */ enabled?: boolean /** Allows sessions_spawn/native spawn flows to bind spawned sessions to threads. */;
    spawnSessions?: boolean /** Default context mode for thread-bound native subagent spawns. */;
    defaultSpawnContext?: "isolated" | "fork" /** @deprecated Use spawnSessions instead. */;
    spawnAcpSessions?: boolean /** @deprecated Use spawnSessions instead. */;
    spawnSubagentSessions?: boolean;
  } /** Channel-specific bot loop guard settings. */;
  botLoopProtection?: ChannelBotLoopProtectionConfig /** @deprecated Use threadBindings.spawnSessions instead. */;
  spawnSubagentSessions?: boolean /** Explicit opt-in for channels that need private network callbacks or media fetches. */;
  dangerouslyAllowPrivateNetwork?: boolean /** Account-scoped channel config keyed by plugin-defined account id. */;
  accounts?: Record<
    string,
    ExtensionAccountConfig
  > /** Plugin-owned config keys intentionally stay open-world at this boundary. */;
  [key: string]: unknown;
};
interface ChannelsConfig {
  /** Shared defaults inherited by channel sections unless they override them. */
  defaults?: ChannelDefaultsConfig;
  /** Map provider -> channel id / DM peer id -> model override. See docs/gateway/config-channels.md for supported key forms. */
  modelByChannel?: ChannelModelByChannelConfig;
  discord?: DiscordConfig;
  googlechat?: GoogleChatConfig;
  imessage?: IMessageConfig;
  irc?: IrcConfig;
  msteams?: MSTeamsConfig;
  signal?: SignalConfig;
  slack?: SlackConfig;
  telegram?: TelegramConfig;
  whatsapp?: WhatsAppConfig;
  /**
   * Channel sections are plugin-owned and keyed by arbitrary channel ids.
   * Open-world config keeps SDK/plugin-owned sections ergonomic for dynamic ids.
   */
  [key: string]: OpenWorldChannelConfig;
}
//#endregion
export {
  IMessageReactionNotificationMode as $,
  TelegramNetworkConfig as A,
  DiscordVoiceMode as At,
  SignalReactionNotificationMode as B,
  TelegramDirectConfig as C,
  DiscordThreadConfig as Ct,
  TelegramExecApprovalTarget as D,
  DiscordVoiceAllowedChannelConfig as Dt,
  TelegramExecApprovalConfig as E,
  DiscordVoiceAgentSessionConfig as Et,
  SignalAccountConfig as F,
  MSTeamsSsoConfig as G,
  MSTeamsCloudName as H,
  SignalApiMode as I,
  IrcAccountConfig as J,
  MSTeamsTeamConfig as K,
  SignalConfig as L,
  TelegramStreamingMode as M,
  DiscordVoiceRealtimeConfig as Mt,
  TelegramThreadBindingsConfig as N,
  DiscordVoiceRealtimeConsultPolicy as Nt,
  TelegramGroupConfig as O,
  DiscordVoiceAutoJoinConfig as Ot,
  TelegramTopicConfig as P,
  DiscordVoiceRealtimeToolPolicy as Pt,
  IMessageConfig as Q,
  SignalGroupConfig as R,
  TelegramCustomCommand as S,
  DiscordThreadBindingsConfig as St,
  TelegramDmThreadReplies as T,
  DiscordUiConfig as Tt,
  MSTeamsConfig as U,
  MSTeamsChannelConfig as V,
  MSTeamsReplyStyle as W,
  IMessageAccountConfig as X,
  IrcConfig as Y,
  IMessageActionConfig as Z,
  AutoTopicLabelConfig as _,
  DiscordMentionAliasesConfig as _t,
  ExtensionChannelConfig as a,
  GoogleChatGroupConfig as at,
  TelegramCapabilitiesConfig as b,
  DiscordSlashCommandConfig as bt,
  WhatsAppAckReactionConfig as c,
  DiscordAgentComponentsConfig as ct,
  WhatsAppDirectConfig as d,
  DiscordConfig as dt,
  IMessageSendTransport as et,
  WhatsAppGroupConfig as f,
  DiscordDmConfig as ft,
  resolveReactionLevel as g,
  DiscordIntentsConfig as gt,
  ResolvedReactionLevel as h,
  DiscordGuildEntry as ht,
  ExtensionAccountConfig as i,
  GoogleChatDmConfig as it,
  TelegramPreviewStreamingConfig as j,
  DiscordVoiceRealtimeBootstrapContextFile as jt,
  TelegramInlineButtonsScope as k,
  DiscordVoiceConfig as kt,
  WhatsAppActionConfig as l,
  DiscordAutoPresenceConfig as lt,
  ReactionLevel as m,
  DiscordGuildChannelConfig as mt,
  ChannelModelByChannelConfig as n,
  GoogleChatActionConfig as nt,
  ExtensionNestedPolicyConfig as o,
  DiscordAccountConfig as ot,
  WhatsAppReactionLevel as p,
  DiscordExecApprovalConfig as pt,
  MSTeamsWebhookConfig as q,
  ChannelsConfig as r,
  GoogleChatConfig as rt,
  WhatsAppAccountConfig as s,
  DiscordActionConfig as st,
  ChannelDefaultsConfig as t,
  GoogleChatAccountConfig as tt,
  WhatsAppConfig as u,
  DiscordChannelStreamingConfig as ut,
  TelegramAccountConfig as v,
  DiscordPluralKitConfig as vt,
  TelegramDmConfig as w,
  DiscordUiComponentsConfig as wt,
  TelegramConfig as x,
  DiscordStreamMode as xt,
  TelegramActionConfig as y,
  DiscordReactionNotificationMode as yt,
  SignalReactionLevel as z,
};
