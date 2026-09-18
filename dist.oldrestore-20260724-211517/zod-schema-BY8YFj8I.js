import path from "node:path";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { n as ZodIssueCode } from "./compat-Ci0Yc9vr.js";
import {
  a as normalizeEd25519PublicKeyBase64Url,
  t as base64UrlDecode,
} from "./ed25519-signature-puT_ou6K.js";
import { t as isPluginJsonValue } from "./host-hook-json-CRVrIqU9.js";
import { t as parseDurationMs } from "./parse-duration-Be19e01j.js";
import { s as isValidSecretRef } from "./ref-contract-DVV0zYUk.js";
import {
  At as boolean,
  Bt as discriminatedUnion,
  Ci as config,
  Et as array,
  Ln as strictObject,
  Nn as record,
  Qn as url,
  Rn as string,
  Si as NEVER,
  Tn as object,
  Xn as union,
  Zn as unknown,
  dn as literal,
  pi as en_default,
  un as lazy,
  wn as number,
  yt as _enum,
} from "./schemas-CBJjibl3.js";
import { t as isSensitiveConfigPath } from "./sensitive-paths-DYIyGcFS.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  f as normalizeStringifiedOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { l as isSecretRef } from "./types.secrets-BV0ywRAy.js";
import { n as isHttpUrl, r as isHttpsUrl } from "./url-protocol-oWYinajA.js";
import {
  a as AgentSandboxSchema,
  c as MemorySearchSchema,
  d as AgentModelSchema,
  f as AgentToolModelSchema,
  i as AgentRunRetriesConfigSchema,
  n as AgentEntrySchema,
  o as ElevatedAllowFromSchema,
  r as AgentModelRuntimeEntrySchema,
  s as HeartbeatSchema,
  t as AgentContextLimitsSchema,
  u as ToolsSchema,
} from "./zod-schema.agent-runtime-D8C103DW.js";
import {
  a as ApprovalsSchema,
  n as ChannelsSchema,
} from "./zod-schema.channels-config-TJLOUrM6.js";
import {
  E as SecretInputSchema,
  F as TtsConfigSchema,
  N as TranscribeAudioSchema,
  R as TypingModeSchema,
  S as QueueSchema,
  W as createAllowDenyChannelRulesSchema,
  a as CliBackendSchema,
  b as NativeCommandsSettingSchema,
  f as HexColorSchema,
  h as InboundDebounceSchema,
  k as SecretsConfigSchema,
  n as BlockStreamingCoalesceSchema,
  p as HumanDelaySchema,
  t as BlockStreamingChunkSchema,
  u as GroupChatSchema,
  y as ModelsConfigSchema,
  z as VisibleRepliesSchema,
} from "./zod-schema.core-CWTCY1ZZ.js";
import { t as InstallRecordShape } from "./zod-schema.installs-DloweJxh.js";
import { t as sensitive } from "./zod-schema.sensitive-WMWbzq4S.js";
//#region src/config/control-ui-css.ts
const CSS_WIDTH_KEYWORDS = /* @__PURE__ */ new Set(["none", "min-content", "max-content"]);
const CSS_WIDTH_FUNCTIONS = /* @__PURE__ */ new Set(["calc", "clamp", "fit-content", "max", "min"]);
const CSS_WIDTH_UNITS = /* @__PURE__ */ new Set([
  "ch",
  "em",
  "rem",
  "vh",
  "vmax",
  "vmin",
  "vw",
  "px",
]);
const CSS_WIDTH_ALLOWED_CHARS = /^[0-9A-Za-z.%+\-*/(),\s]+$/;
const CSS_WIDTH_IDENTIFIER_RE = /[A-Za-z][A-Za-z0-9-]*/g;
const CSS_WIDTH_SIMPLE_RE = /^(?:\d+(?:\.\d+)?|\.\d+)(?:px|rem|em|ch|vw|vh|vmin|vmax|%)$/i;
const CSS_WIDTH_MAX_LENGTH = 96;
function hasBalancedParentheses(value) {
  let depth = 0;
  for (const char of value)
    if (char === "(") depth++;
    else if (char === ")") {
      depth--;
      if (depth < 0) return false;
    }
  return depth === 0;
}
function hasAllowedIdentifiers(value) {
  for (const match of value.matchAll(CSS_WIDTH_IDENTIFIER_RE)) {
    const identifier = match[0].toLowerCase();
    if (
      !CSS_WIDTH_FUNCTIONS.has(identifier) &&
      !CSS_WIDTH_KEYWORDS.has(identifier) &&
      !CSS_WIDTH_UNITS.has(identifier)
    )
      return false;
  }
  return true;
}
/** Normalizes operator-provided Control UI chat max-width CSS values before validation. */
function normalizeControlUiChatMessageMaxWidth(value) {
  return value.trim().replace(/\s+/g, " ");
}
/** Validates the constrained CSS width grammar accepted by `gateway.controlUi.chatMessageMaxWidth`. */
function isValidControlUiChatMessageMaxWidth(value) {
  const normalized = normalizeControlUiChatMessageMaxWidth(value);
  if (normalized.length === 0 || normalized.length > CSS_WIDTH_MAX_LENGTH) return false;
  if (CSS_WIDTH_KEYWORDS.has(normalized.toLowerCase())) return true;
  if (CSS_WIDTH_SIMPLE_RE.test(normalized)) return true;
  if (!CSS_WIDTH_ALLOWED_CHARS.test(normalized)) return false;
  if (!hasBalancedParentheses(normalized) || !hasAllowedIdentifiers(normalized)) return false;
  return /^(?:calc|clamp|fit-content|max|min)\(.+\)$/i.test(normalized);
}
//#endregion
//#region src/cli/parse-bytes.ts
const UNIT_MULTIPLIERS = {
  b: 1,
  kb: 1024,
  k: 1024,
  mb: 1024 ** 2,
  m: 1024 ** 2,
  gb: 1024 ** 3,
  g: 1024 ** 3,
  tb: 1024 ** 4,
  t: 1024 ** 4,
};
function invalidByteSize(raw, reason) {
  const value = raw.trim() ? `"${raw}"` : "empty value";
  const prefix = reason
    ? `Invalid byte size (${reason}): ${value}.`
    : `Invalid byte size: ${value}.`;
  return /* @__PURE__ */ new Error(`${prefix} Use values like 512kb, 10mb, 1gb, or 500.`);
}
/** Parse a non-negative byte size with optional binary units like kb, mb, gb, or tb. */
function parseByteSize(raw, opts) {
  const trimmed = normalizeLowercaseStringOrEmpty(normalizeOptionalString(raw) ?? "");
  if (!trimmed) throw invalidByteSize(raw, "empty");
  const m = /^(\d+(?:\.\d+)?)([a-z]+)?$/.exec(trimmed);
  if (!m) throw invalidByteSize(raw);
  const value = Number(m[1]);
  if (!Number.isFinite(value) || value < 0) throw invalidByteSize(raw);
  const unit = normalizeLowercaseStringOrEmpty(m[2] ?? opts?.defaultUnit ?? "b");
  const multiplier = UNIT_MULTIPLIERS[unit];
  if (!multiplier) throw invalidByteSize(raw, `unknown unit "${unit}"`);
  const bytes = Math.round(value * multiplier);
  if (!Number.isSafeInteger(bytes)) throw invalidByteSize(raw);
  return bytes;
}
//#endregion
//#region src/config/byte-size.ts
/**
 * Parse an optional byte-size value from config.
 * Accepts non-negative numbers or strings like "2mb".
 */
function parseNonNegativeByteSize(value) {
  if (typeof value === "number") {
    const int = Math.floor(value);
    return Number.isSafeInteger(int) && int >= 0 ? int : null;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    try {
      const bytes = parseByteSize(trimmed, { defaultUnit: "b" });
      return bytes >= 0 ? bytes : null;
    } catch {
      return null;
    }
  }
  return null;
}
/** Validates byte-size strings accepted by agent default byte-threshold config. */
function isValidNonNegativeByteSizeString(value) {
  return parseNonNegativeByteSize(value) !== null;
}
//#endregion
//#region src/config/zod-schema.agent-defaults.ts
const SilentReplyPolicySchema = union([literal("allow"), literal("disallow")]);
const NonNegativeByteSizeSchema = union([
  number().int().nonnegative(),
  string().refine(isValidNonNegativeByteSizeString, "Expected byte size string like 2mb"),
]);
const OptionalBootstrapFileNameSchema = _enum([
  "SOUL.md",
  "USER.md",
  "HEARTBEAT.md",
  "IDENTITY.md",
]);
const EmbeddedAgentConfigSchema = object({
  projectSettingsPolicy: union([
    literal("trusted"),
    literal("sanitize"),
    literal("ignore"),
  ]).optional(),
  executionContract: union([literal("default"), literal("strict-agentic")]).optional(),
}).strict();
const SilentReplyPolicyConfigSchema = object({
  group: SilentReplyPolicySchema.optional(),
  internal: SilentReplyPolicySchema.optional(),
}).strict();
const AgentDefaultsSchema = object({
  /** Global default provider params applied to all models before per-model and per-agent overrides. */
  params: record(string(), unknown()).optional(),
  model: AgentModelSchema.optional(),
  utilityModel: string().optional(),
  imageModel: AgentToolModelSchema.optional(),
  imageGenerationModel: AgentToolModelSchema.optional(),
  videoGenerationModel: AgentToolModelSchema.optional(),
  musicGenerationModel: AgentToolModelSchema.optional(),
  voiceModel: AgentToolModelSchema.optional(),
  mediaGenerationAutoProviderFallback: boolean().optional(),
  pdfModel: AgentToolModelSchema.optional(),
  pdfMaxBytesMb: number().positive().optional(),
  pdfMaxPages: number().int().positive().optional(),
  models: record(string(), AgentModelRuntimeEntrySchema).optional(),
  workspace: string().optional(),
  skills: array(string()).optional(),
  silentReply: SilentReplyPolicyConfigSchema.optional(),
  repoRoot: string().optional(),
  promptOverlays: object({
    gpt5: object({
      personality: union([literal("friendly"), literal("on"), literal("off")]).optional(),
    })
      .strict()
      .optional(),
  })
    .strict()
    .optional(),
  skipBootstrap: boolean().optional(),
  skipOptionalBootstrapFiles: array(OptionalBootstrapFileNameSchema).optional(),
  contextInjection: union([
    literal("always"),
    literal("continuation-skip"),
    literal("never"),
  ]).optional(),
  bootstrapMaxChars: number().int().positive().optional(),
  bootstrapTotalMaxChars: number().int().positive().optional(),
  experimental: object({ localModelLean: boolean().optional() }).strict().optional(),
  bootstrapPromptTruncationWarning: union([
    literal("off"),
    literal("once"),
    literal("always"),
  ]).optional(),
  userTimezone: string().optional(),
  startupContext: object({
    enabled: boolean().optional(),
    applyOn: array(union([literal("new"), literal("reset")])).optional(),
    dailyMemoryDays: number().int().min(1).max(14).optional(),
    maxFileBytes: number()
      .int()
      .min(1)
      .max(64 * 1024)
      .optional(),
    maxFileChars: number().int().min(1).max(1e4).optional(),
    maxTotalChars: number().int().min(1).max(5e4).optional(),
  })
    .strict()
    .optional(),
  contextLimits: AgentContextLimitsSchema,
  timeFormat: union([literal("auto"), literal("12"), literal("24")]).optional(),
  envelopeTimezone: string().optional(),
  envelopeTimestamp: union([literal("on"), literal("off")]).optional(),
  envelopeElapsed: union([literal("on"), literal("off")]).optional(),
  contextTokens: number().int().positive().optional(),
  cliBackends: record(string(), CliBackendSchema).optional(),
  memorySearch: MemorySearchSchema,
  contextPruning: object({
    mode: union([literal("off"), literal("cache-ttl")]).optional(),
    ttl: string().optional(),
    keepLastAssistants: number().int().nonnegative().optional(),
    softTrimRatio: number().min(0).max(1).optional(),
    hardClearRatio: number().min(0).max(1).optional(),
    minPrunableToolChars: number().int().nonnegative().optional(),
    tools: object({
      allow: array(string()).optional(),
      deny: array(string()).optional(),
    })
      .strict()
      .optional(),
    softTrim: object({
      maxChars: number().int().nonnegative().optional(),
      headChars: number().int().nonnegative().optional(),
      tailChars: number().int().nonnegative().optional(),
    })
      .strict()
      .optional(),
    hardClear: object({
      enabled: boolean().optional(),
      placeholder: string().optional(),
    })
      .strict()
      .optional(),
  })
    .strict()
    .optional(),
  compaction: object({
    mode: union([literal("default"), literal("safeguard")]).optional(),
    provider: string().optional(),
    reserveTokens: number().int().nonnegative().optional(),
    keepRecentTokens: number().int().positive().optional(),
    reserveTokensFloor: number().int().nonnegative().optional(),
    maxHistoryShare: number().min(0.1).max(0.9).optional(),
    customInstructions: string().optional(),
    identifierPolicy: union([literal("strict"), literal("off"), literal("custom")]).optional(),
    identifierInstructions: string().optional(),
    recentTurnsPreserve: number().int().min(0).max(12).optional(),
    qualityGuard: object({
      enabled: boolean().optional(),
      maxRetries: number().int().nonnegative().optional(),
    })
      .strict()
      .optional(),
    midTurnPrecheck: object({ enabled: boolean().optional() }).strict().optional(),
    postIndexSync: _enum(["off", "async", "await"]).optional(),
    postCompactionSections: array(string()).optional(),
    model: string().optional(),
    timeoutSeconds: number().int().positive().optional(),
    memoryFlush: object({
      enabled: boolean().optional(),
      model: string().optional(),
      softThresholdTokens: number().int().nonnegative().optional(),
      forceFlushTranscriptBytes: NonNegativeByteSizeSchema.optional(),
      prompt: string().optional(),
      systemPrompt: string().optional(),
    })
      .strict()
      .optional(),
    truncateAfterCompaction: boolean().optional(),
    maxActiveTranscriptBytes: NonNegativeByteSizeSchema.optional(),
    notifyUser: boolean().optional(),
  })
    .strict()
    .optional(),
  runRetries: AgentRunRetriesConfigSchema.optional(),
  embeddedAgent: EmbeddedAgentConfigSchema.optional(),
  thinkingDefault: union([
    literal("off"),
    literal("minimal"),
    literal("low"),
    literal("medium"),
    literal("high"),
    literal("xhigh"),
    literal("adaptive"),
    literal("max"),
    literal("ultra"),
  ]).optional(),
  verboseDefault: union([literal("off"), literal("on"), literal("full")]).optional(),
  toolProgressDetail: union([literal("explain"), literal("raw")]).optional(),
  reasoningDefault: union([literal("off"), literal("on"), literal("stream")]).optional(),
  elevatedDefault: union([
    literal("off"),
    literal("on"),
    literal("ask"),
    literal("full"),
  ]).optional(),
  blockStreamingDefault: union([literal("off"), literal("on")]).optional(),
  blockStreamingBreak: union([literal("text_end"), literal("message_end")]).optional(),
  blockStreamingChunk: BlockStreamingChunkSchema.optional(),
  blockStreamingCoalesce: BlockStreamingCoalesceSchema.optional(),
  humanDelay: HumanDelaySchema.optional(),
  timeoutSeconds: number().int().nonnegative().optional(),
  mediaMaxMb: number().positive().optional(),
  imageMaxDimensionPx: number().int().positive().optional(),
  imageQuality: _enum(["auto", "efficient", "balanced", "high"]).optional(),
  typingIntervalSeconds: number().int().positive().optional(),
  typingMode: TypingModeSchema.optional(),
  heartbeat: HeartbeatSchema,
  maxConcurrent: number().int().positive().optional(),
  subagents: object({
    delegationMode: _enum(["suggest", "prefer"]).optional(),
    allowAgents: array(string()).optional(),
    maxConcurrent: number().int().positive().optional(),
    maxSpawnDepth: number()
      .int()
      .min(1)
      .max(5)
      .optional()
      .describe(
        "Maximum nesting depth for sub-agent spawning. 1 = no nesting (default), 2 = sub-agents can spawn sub-sub-agents.",
      ),
    maxChildrenPerAgent: number()
      .int()
      .min(1)
      .max(20)
      .optional()
      .describe("Maximum number of active children a single agent session can spawn (default: 5)."),
    archiveAfterMinutes: number().int().min(0).optional(),
    model: AgentModelSchema.optional(),
    thinking: string().optional(),
    runTimeoutSeconds: number().int().min(0).optional(),
    announceTimeoutMs: number().int().positive().optional(),
    requireAgentId: boolean().optional(),
  })
    .strict()
    .optional(),
  sandbox: AgentSandboxSchema,
})
  .strict()
  .optional();
//#endregion
//#region src/config/zod-schema.agents.ts
const AgentsSchema = object({
  defaults: lazy(() => AgentDefaultsSchema).optional(),
  list: array(AgentEntrySchema).optional(),
})
  .strict()
  .optional();
const BindingMatchSchema = object({
  channel: string(),
  accountId: string().optional(),
  peer: object({
    kind: union([literal("direct"), literal("group"), literal("channel"), literal("dm")]),
    id: string(),
  })
    .strict()
    .optional(),
  guildId: string().optional(),
  teamId: string().optional(),
  roles: array(string()).optional(),
}).strict();
const BindingSessionSchema = object({
  dmScope: union([
    literal("main"),
    literal("per-peer"),
    literal("per-channel-peer"),
    literal("per-account-channel-peer"),
  ]).optional(),
}).strict();
const BindingsSchema = array(
  union([
    object({
      type: literal("route").optional(),
      agentId: string(),
      comment: string().optional(),
      match: BindingMatchSchema,
      session: BindingSessionSchema.optional(),
    }).strict(),
    object({
      type: literal("acp"),
      agentId: string(),
      comment: string().optional(),
      match: BindingMatchSchema,
      acp: object({
        mode: _enum(["persistent", "oneshot"]).optional(),
        label: string().optional(),
        cwd: string().optional(),
        backend: string().optional(),
      })
        .strict()
        .optional(),
    })
      .strict()
      .superRefine((value, ctx) => {
        if (!(normalizeOptionalString(value.match.peer?.id) ?? ""))
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: ["match", "peer"],
            message: "ACP bindings require match.peer.id to target a concrete conversation.",
          });
      }),
  ]),
).optional();
const BroadcastSchema = object({ strategy: _enum(["parallel", "sequential"]).optional() })
  .catchall(array(string()))
  .optional();
const AudioSchema = object({ transcription: TranscribeAudioSchema }).strict().optional();
const CloudWorkerLifetimePolicySchema = object({
  idleTimeoutMinutes: number().int().positive().optional(),
  maxLifetimeMinutes: number().int().positive().optional(),
}).strict();
function validateCloudWorkerProfileSettings(value) {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value) ||
    !isPluginJsonValue(value)
  )
    return "Worker profile settings must be bounded finite JSON";
  const visit = (entry) => {
    if (Array.isArray(entry)) return entry.map(visit).find((error) => error !== void 0);
    if (typeof entry !== "object" || entry === null) return;
    for (const [key, child] of Object.entries(entry)) {
      const baseKey = key.replace(/ref$/i, "");
      if (
        key.toLowerCase() === "keyref" ||
        isSensitiveConfigPath(key) ||
        (baseKey !== key && isSensitiveConfigPath(baseKey))
      ) {
        if (!isSecretRef(child) || !isValidSecretRef(child))
          return `Worker profile ${key} must use a SecretRef`;
        continue;
      }
      const error = visit(child);
      if (error) return error;
    }
  };
  return visit(value);
}
const CloudWorkerSettingsSchema = record(string(), unknown()).superRefine((value, ctx) => {
  const message = validateCloudWorkerProfileSettings(value);
  if (message)
    ctx.addIssue({
      code: "custom",
      message,
    });
});
const CloudWorkerProfileSchema = object({
  provider: string().trim().min(1),
  install: _enum(["bundle", "npm"]).optional().default("bundle"),
  settings: CloudWorkerSettingsSchema.optional(),
  lifetime: CloudWorkerLifetimePolicySchema.optional(),
}).strict();
const CloudWorkersConfigSchema = object({
  profiles: record(
    string()
      .min(1)
      .refine(
        (value) => value === value.trim(),
        "Worker profile ids must not contain outer whitespace",
      ),
    CloudWorkerProfileSchema,
  ).optional(),
})
  .strict()
  .optional();
//#endregion
//#region src/config/zod-schema.hooks.ts
function isSafeRelativeModulePath(raw) {
  const value = raw.trim();
  if (!value) return false;
  if (path.isAbsolute(value)) return false;
  if (value.startsWith("~")) return false;
  if (value.includes(":")) return false;
  if (value.split(/[\\/]+/g).some((part) => part === "..")) return false;
  return true;
}
const SafeRelativeModulePathSchema = string().refine(
  isSafeRelativeModulePath,
  "module must be a safe relative path (no absolute paths)",
);
const HookMappingSchema = object({
  id: string().optional(),
  match: object({
    path: string().optional(),
    source: string().optional(),
  }).optional(),
  action: union([literal("wake"), literal("agent")]).optional(),
  wakeMode: union([literal("now"), literal("next-heartbeat")]).optional(),
  name: string().optional(),
  agentId: string().optional(),
  sessionKey: string().optional().register(sensitive),
  messageTemplate: string().optional(),
  textTemplate: string().optional(),
  deliver: boolean().optional(),
  allowUnsafeExternalContent: boolean().optional(),
  channel: string().trim().min(1).optional(),
  to: string().optional(),
  model: string().optional(),
  thinking: string().optional(),
  timeoutSeconds: number().int().positive().optional(),
  transform: object({
    module: SafeRelativeModulePathSchema,
    export: string().optional(),
  })
    .strict()
    .optional(),
})
  .strict()
  .optional();
const InternalHookHandlerSchema = object({
  event: string(),
  module: SafeRelativeModulePathSchema,
  export: string().optional(),
}).strict();
const HookConfigSchema = object({
  enabled: boolean().optional(),
  env: record(string(), string()).optional(),
}).passthrough();
const HookInstallRecordSchema = object({
  ...InstallRecordShape,
  hooks: array(string()).optional(),
}).strict();
const InternalHooksSchema = object({
  enabled: boolean().optional(),
  handlers: array(InternalHookHandlerSchema).optional(),
  entries: record(string(), HookConfigSchema).optional(),
  load: object({ extraDirs: array(string()).optional() })
    .strict()
    .optional(),
  installs: record(string(), HookInstallRecordSchema).optional(),
})
  .strict()
  .optional();
const HooksGmailSchema = object({
  account: string().optional(),
  label: string().optional(),
  topic: string().optional(),
  subscription: string().optional(),
  pushToken: string().optional().register(sensitive),
  hookUrl: string().optional(),
  includeBody: boolean().optional(),
  maxBytes: number().int().positive().optional(),
  renewEveryMinutes: number().int().positive().optional(),
  allowUnsafeExternalContent: boolean().optional(),
  serve: object({
    bind: string().optional(),
    port: number().int().positive().optional(),
    path: string().optional(),
  })
    .strict()
    .optional(),
  tailscale: object({
    mode: union([literal("off"), literal("serve"), literal("funnel")]).optional(),
    path: string().optional(),
    target: string().optional(),
  })
    .strict()
    .optional(),
  model: string().optional(),
  thinking: union([
    literal("off"),
    literal("minimal"),
    literal("low"),
    literal("medium"),
    literal("high"),
  ]).optional(),
})
  .strict()
  .optional();
//#endregion
//#region src/config/zod-schema.node-host.ts
const BrowserSnapshotDefaultsSchema = object({ mode: literal("efficient").optional() })
  .strict()
  .optional();
const NodeHostAgentRunsSchema = object({
  claude: object({ enabled: boolean().optional() }).strict().optional(),
})
  .strict()
  .optional();
//#endregion
//#region src/config/zod-schema.proxy.ts
const ProxyLoopbackModeSchema = _enum(["gateway-only", "proxy", "block"]);
const ProxyTlsConfigSchema = object({ caFile: string().min(1).optional() })
  .strict()
  .optional();
const ProxyConfigSchema = object({
  enabled: boolean().optional(),
  proxyUrl: url()
    .refine(isHttpUrl, { message: "proxyUrl must use http:// or https://" })
    .register(sensitive)
    .optional(),
  tls: ProxyTlsConfigSchema,
  loopbackMode: ProxyLoopbackModeSchema.optional(),
})
  .strict()
  .optional();
//#endregion
//#region src/config/zod-schema.session.ts
const SessionResetConfigSchema = object({
  mode: union([literal("daily"), literal("idle")]).optional(),
  atHour: number().int().min(0).max(23).optional(),
  idleMinutes: number().int().positive().optional(),
}).strict();
const SessionSendPolicySchema = createAllowDenyChannelRulesSchema();
const SessionSchema = object({
  scope: union([literal("per-sender"), literal("global")]).optional(),
  dmScope: union([
    literal("main"),
    literal("per-peer"),
    literal("per-channel-peer"),
    literal("per-account-channel-peer"),
  ]).optional(),
  identityLinks: record(string(), array(string())).optional(),
  resetTriggers: array(string()).optional(),
  idleMinutes: number().int().positive().optional(),
  reset: SessionResetConfigSchema.optional(),
  resetByType: object({
    direct: SessionResetConfigSchema.optional(),
    /** @deprecated Use `direct` instead. Kept for backward compatibility. */
    dm: SessionResetConfigSchema.optional(),
    group: SessionResetConfigSchema.optional(),
    thread: SessionResetConfigSchema.optional(),
  })
    .strict()
    .optional(),
  resetByChannel: record(string(), SessionResetConfigSchema).optional(),
  store: string().optional(),
  typingIntervalSeconds: number().int().positive().optional(),
  typingMode: TypingModeSchema.optional(),
  mainKey: string().optional(),
  sendPolicy: SessionSendPolicySchema.optional(),
  writeLock: object({
    acquireTimeoutMs: number().int().positive().optional(),
    staleMs: number().int().positive().optional(),
    maxHoldMs: number().int().positive().optional(),
  })
    .strict()
    .optional(),
  agentToAgent: object({ maxPingPongTurns: number().int().min(0).max(20).optional() })
    .strict()
    .optional(),
  threadBindings: object({
    enabled: boolean().optional(),
    idleHours: number().nonnegative().optional(),
    maxAgeHours: number().nonnegative().optional(),
    spawnSessions: boolean().optional(),
    defaultSpawnContext: _enum(["isolated", "fork"]).optional(),
  })
    .strict()
    .optional(),
  maintenance: object({
    mode: _enum(["enforce", "warn"]).optional(),
    pruneAfter: union([string(), number()]).optional(),
    /** @deprecated Use pruneAfter instead. */
    pruneDays: number().int().positive().optional(),
    maxEntries: number().int().positive().optional(),
    resetArchiveRetention: union([string(), number(), literal(false)]).optional(),
    maxDiskBytes: union([string(), number()]).optional(),
    highWaterBytes: union([string(), number()]).optional(),
  })
    .strict()
    .superRefine((val, ctx) => {
      if (val.pruneAfter !== void 0)
        try {
          parseDurationMs(normalizeStringifiedOptionalString(val.pruneAfter) ?? "", {
            defaultUnit: "d",
          });
        } catch {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: ["pruneAfter"],
            message: "invalid duration (use ms, s, m, h, d)",
          });
        }
      if (val.resetArchiveRetention !== void 0 && val.resetArchiveRetention !== false)
        try {
          parseDurationMs(normalizeStringifiedOptionalString(val.resetArchiveRetention) ?? "", {
            defaultUnit: "d",
          });
        } catch {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: ["resetArchiveRetention"],
            message: "invalid duration (use ms, s, m, h, d)",
          });
        }
      if (val.maxDiskBytes !== void 0)
        try {
          parseByteSize(normalizeStringifiedOptionalString(val.maxDiskBytes) ?? "", {
            defaultUnit: "b",
          });
        } catch {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: ["maxDiskBytes"],
            message: "invalid size (use b, kb, mb, gb, tb)",
          });
        }
      if (val.highWaterBytes !== void 0)
        try {
          parseByteSize(normalizeStringifiedOptionalString(val.highWaterBytes) ?? "", {
            defaultUnit: "b",
          });
        } catch {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: ["highWaterBytes"],
            message: "invalid size (use b, kb, mb, gb, tb)",
          });
        }
    })
    .optional(),
})
  .strict()
  .optional();
const ResponseUsageModeSchema = _enum(["on", "off", "tokens", "full"]);
const MessagesSchema = object({
  messagePrefix: string().optional(),
  visibleReplies: VisibleRepliesSchema.optional(),
  responsePrefix: string().optional(),
  usageTemplate: union([string(), record(string(), unknown())]).optional(),
  responseUsage: union([
    ResponseUsageModeSchema,
    record(string(), ResponseUsageModeSchema),
  ]).optional(),
  groupChat: GroupChatSchema,
  queue: QueueSchema,
  inbound: InboundDebounceSchema,
  ackReaction: string().optional(),
  ackReactionScope: _enum([
    "group-mentions",
    "group-all",
    "direct",
    "all",
    "off",
    "none",
  ]).optional(),
  removeAckAfterReply: boolean().optional(),
  statusReactions: object({
    enabled: boolean().optional(),
    emojis: object({
      queued: string().optional(),
      thinking: string().optional(),
      tool: string().optional(),
      coding: string().optional(),
      web: string().optional(),
      deploy: string().optional(),
      build: string().optional(),
      concierge: string().optional(),
      done: string().optional(),
      error: string().optional(),
      stallSoft: string().optional(),
      stallHard: string().optional(),
      compacting: string().optional(),
    })
      .strict()
      .optional(),
    timing: object({
      debounceMs: number().int().min(0).optional(),
      stallSoftMs: number().int().min(0).optional(),
      stallHardMs: number().int().min(0).optional(),
      doneHoldMs: number().int().min(0).optional(),
      errorHoldMs: number().int().min(0).optional(),
    })
      .strict()
      .optional(),
  })
    .strict()
    .optional(),
  suppressToolErrors: boolean().optional(),
  tts: TtsConfigSchema,
})
  .strict()
  .optional();
const CommandsSchema = object({
  native: NativeCommandsSettingSchema.optional().default("auto"),
  nativeSkills: NativeCommandsSettingSchema.optional().default("auto"),
  text: boolean().optional(),
  bash: boolean().optional(),
  bashForegroundMs: number().int().min(0).max(3e4).optional(),
  config: boolean().optional(),
  mcp: boolean().optional(),
  plugins: boolean().optional(),
  debug: boolean().optional(),
  restart: boolean().optional().default(true),
  useAccessGroups: boolean().optional(),
  ownerAllowFrom: array(union([string(), number()])).optional(),
  ownerDisplay: _enum(["raw", "hash"]).optional().default("raw"),
  ownerDisplaySecret: string().optional().register(sensitive),
  allowFrom: ElevatedAllowFromSchema.optional(),
})
  .strict()
  .optional()
  .default(() => ({
    native: "auto",
    nativeSkills: "auto",
    restart: true,
    ownerDisplay: "raw",
  }));
//#endregion
//#region src/config/zod-schema.ts
function installZodDefaultLocale() {
  config(en_default());
}
installZodDefaultLocale();
const GatewayRemoteConfigSchema = strictObject({
  url: string().optional(),
  transport: union([literal("ssh"), literal("direct")]).optional(),
  remotePort: number().int().min(1).max(65535).optional(),
  token: SecretInputSchema.optional().register(sensitive),
  password: SecretInputSchema.optional().register(sensitive),
  tlsFingerprint: string().optional(),
  sshTarget: string().optional(),
  sshIdentity: string().optional(),
  sshHostKeyPolicy: union([literal("strict"), literal("openssh")]).optional(),
}).optional();
const TailscaleServiceNameSchema = string().regex(/^svc:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/, {
  message:
    'Tailscale serviceName must use the "svc:<dns-label>" format, for example "svc:openclaw"',
});
const LegacyCanvasHostSchema = strictObject({
  enabled: boolean().optional(),
  root: string().optional(),
  port: number().int().positive().optional(),
  liveReload: boolean().optional(),
}).optional();
const SecuritySchema = strictObject({
  audit: strictObject({
    suppressions: array(
      strictObject({
        checkId: string().min(1),
        titleIncludes: string().min(1).optional(),
        detailIncludes: string().min(1).optional(),
        reason: string().min(1).optional(),
      }),
    ).optional(),
  }).optional(),
  installPolicy: strictObject({
    enabled: boolean().optional(),
    targets: array(union([literal("skill"), literal("plugin")]))
      .min(1)
      .optional(),
    exec: strictObject({
      source: literal("exec"),
      command: string().min(1),
      args: array(string()).optional(),
      timeoutMs: number().int().min(1).optional(),
      noOutputTimeoutMs: number().int().min(1).optional(),
      maxOutputBytes: number().int().min(1).optional(),
      env: record(string(), string().register(sensitive)).optional(),
      passEnv: array(string()).optional(),
      trustedDirs: array(string()).optional(),
      allowInsecurePath: boolean().optional(),
      allowSymlinkCommand: boolean().optional(),
    }).optional(),
  }).optional(),
}).optional();
const AccessGroupsSchema = record(
  string().min(1),
  discriminatedUnion("type", [
    strictObject({
      type: literal("discord.channelAudience"),
      guildId: string().min(1),
      channelId: string().min(1),
      membership: literal("canViewChannel").optional(),
    }),
    strictObject({
      type: literal("message.senders"),
      members: record(string().min(1), array(string().min(1))),
    }),
  ]),
).optional();
const MemoryQmdPathSchema = strictObject({
  path: string(),
  name: string().optional(),
  pattern: string().optional(),
});
const MemoryQmdSessionSchema = strictObject({
  enabled: boolean().optional(),
  exportDir: string().optional(),
  retentionDays: number().int().nonnegative().optional(),
});
const MemoryQmdUpdateSchema = strictObject({
  interval: string().optional(),
  debounceMs: number().int().nonnegative().optional(),
  onBoot: boolean().optional(),
  startup: _enum(["off", "idle", "immediate"]).optional(),
  startupDelayMs: number().int().nonnegative().optional(),
  waitForBootSync: boolean().optional(),
  embedInterval: string().optional(),
  commandTimeoutMs: number().int().nonnegative().optional(),
  updateTimeoutMs: number().int().nonnegative().optional(),
  embedTimeoutMs: number().int().nonnegative().optional(),
});
const MemoryQmdLimitsSchema = strictObject({
  maxResults: number().int().positive().optional(),
  maxSnippetChars: number().int().positive().optional(),
  maxInjectedChars: number().int().positive().optional(),
  timeoutMs: number().int().nonnegative().optional(),
});
const MemoryQmdMcporterSchema = strictObject({
  enabled: boolean().optional(),
  serverName: string().optional(),
  startDaemon: boolean().optional(),
});
const LoggingLevelSchema = union([
  literal("silent"),
  literal("fatal"),
  literal("error"),
  literal("warn"),
  literal("info"),
  literal("debug"),
  literal("trace"),
]);
const MemoryQmdSchema = strictObject({
  command: string().optional(),
  mcporter: MemoryQmdMcporterSchema.optional(),
  searchMode: union([literal("query"), literal("search"), literal("vsearch")]).optional(),
  rerank: boolean().optional(),
  searchTool: string().trim().min(1).optional(),
  includeDefaultMemory: boolean().optional(),
  paths: array(MemoryQmdPathSchema).optional(),
  sessions: MemoryQmdSessionSchema.optional(),
  update: MemoryQmdUpdateSchema.optional(),
  limits: MemoryQmdLimitsSchema.optional(),
  scope: SessionSendPolicySchema.optional(),
});
const MemorySchema = strictObject({
  backend: union([literal("builtin"), literal("qmd")]).optional(),
  citations: union([literal("auto"), literal("on"), literal("off")]).optional(),
  qmd: MemoryQmdSchema.optional(),
}).optional();
const HttpUrlSchema = string().url().refine(isHttpUrl, "Expected http:// or https:// URL");
const McpOAuthClientMetadataUrlSchema = string()
  .url()
  .refine((value) => {
    const url = new URL(value);
    return isHttpsUrl(url) && url.pathname !== "/";
  }, "Expected https:// URL with a non-root pathname");
const ResponsesEndpointUrlFetchShape = {
  allowUrl: boolean().optional(),
  urlAllowlist: array(string()).optional(),
  allowedMimes: array(string()).optional(),
  maxBytes: number().int().positive().optional(),
  maxRedirects: number().int().nonnegative().optional(),
  timeoutMs: number().int().positive().optional(),
};
const SkillEntrySchema = strictObject({
  enabled: boolean().optional(),
  apiKey: SecretInputSchema.optional().register(sensitive),
  env: record(string(), string()).optional(),
  config: record(string(), unknown()).optional(),
});
const PluginEntrySchema = strictObject({
  enabled: boolean().optional(),
  hooks: strictObject({
    allowPromptInjection: boolean().optional(),
    allowConversationAccess: boolean().optional(),
    timeoutMs: number().int().positive().max(6e5).optional(),
    timeouts: record(string(), number().int().positive().max(6e5)).optional(),
  }).optional(),
  subagent: strictObject({
    allowModelOverride: boolean().optional(),
    allowedModels: array(string()).optional(),
  }).optional(),
  llm: strictObject({
    allowModelOverride: boolean().optional(),
    allowedModels: array(string()).optional(),
    allowAgentIdOverride: boolean().optional(),
  }).optional(),
  config: record(string(), unknown()).optional(),
});
const TalkProviderEntrySchema = object({
  apiKey: SecretInputSchema.optional().register(sensitive),
}).catchall(unknown());
const TalkRealtimeSchema = strictObject({
  provider: string().optional(),
  providers: record(string(), TalkProviderEntrySchema).optional(),
  model: string().optional(),
  speakerVoice: string().optional(),
  speakerVoiceId: string().optional(),
  voice: string().optional(),
  instructions: string().optional(),
  mode: _enum(["realtime", "stt-tts", "transcription"]).optional(),
  transport: _enum(["webrtc", "provider-websocket", "gateway-relay", "managed-room"]).optional(),
  vadThreshold: number().min(0).max(1).optional(),
  silenceDurationMs: number().int().positive().optional(),
  prefixPaddingMs: number().int().nonnegative().optional(),
  reasoningEffort: string().min(1).optional(),
  brain: _enum(["agent-consult", "direct-tools", "none"]).optional(),
  consultRouting: _enum(["provider-direct", "force-agent-consult"]).optional(),
}).superRefine((realtime, ctx) => {
  const provider = normalizeLowercaseStringOrEmpty(realtime.provider ?? "");
  const providers = realtime.providers ? Object.keys(realtime.providers) : [];
  if (provider && providers.length > 0 && !Object.hasOwn(realtime.providers, provider))
    ctx.addIssue({
      code: ZodIssueCode.custom,
      path: ["provider"],
      message: `talk.realtime.provider must match a key in talk.realtime.providers (missing "${provider}")`,
    });
  if (!provider && providers.length > 1)
    ctx.addIssue({
      code: ZodIssueCode.custom,
      path: ["provider"],
      message:
        "talk.realtime.provider is required when talk.realtime.providers defines multiple providers",
    });
});
const TalkSchema = strictObject({
  provider: string().optional(),
  providers: record(string(), TalkProviderEntrySchema).optional(),
  realtime: TalkRealtimeSchema.optional(),
  consultThinkingLevel: _enum([
    "off",
    "minimal",
    "low",
    "medium",
    "high",
    "xhigh",
    "adaptive",
    "max",
    "ultra",
  ]).optional(),
  consultFastMode: boolean().optional(),
  speechLocale: string().optional(),
  interruptOnSpeech: boolean().optional(),
  silenceTimeoutMs: number().int().positive().optional(),
}).superRefine((talk, ctx) => {
  const provider = normalizeLowercaseStringOrEmpty(talk.provider ?? "");
  const providers = talk.providers ? Object.keys(talk.providers) : [];
  if (provider && providers.length > 0 && !Object.hasOwn(talk.providers, provider))
    ctx.addIssue({
      code: ZodIssueCode.custom,
      path: ["provider"],
      message: `talk.provider must match a key in talk.providers (missing "${provider}")`,
    });
  if (!provider && providers.length > 1)
    ctx.addIssue({
      code: ZodIssueCode.custom,
      path: ["provider"],
      message: "talk.provider is required when talk.providers defines multiple providers",
    });
});
const McpServerSchema = object({
  enabled: boolean().optional(),
  command: string().optional(),
  args: array(string()).optional(),
  env: record(
    string(),
    union([string().register(sensitive), number(), boolean()]).register(sensitive),
  ).optional(),
  cwd: string().optional(),
  workingDirectory: string().optional(),
  url: HttpUrlSchema.optional(),
  transport: union([literal("stdio"), literal("sse"), literal("streamable-http")]).optional(),
  headers: record(
    string(),
    union([string().register(sensitive), number(), boolean()]).register(sensitive),
  ).optional(),
  connectionTimeoutMs: number().finite().positive().optional(),
  connectTimeout: number().finite().positive().optional(),
  connect_timeout: number().finite().positive().optional(),
  requestTimeoutMs: number().finite().positive().optional(),
  timeout: number().finite().positive().optional(),
  supportsParallelToolCalls: boolean().optional(),
  supports_parallel_tool_calls: boolean().optional(),
  auth: literal("oauth").optional(),
  oauth: strictObject({
    authProfileId: string().trim().min(1).optional(),
    scope: string().trim().min(1).optional(),
    redirectUrl: HttpUrlSchema.optional(),
    clientMetadataUrl: McpOAuthClientMetadataUrlSchema.optional(),
  }).optional(),
  sslVerify: boolean().optional(),
  ssl_verify: boolean().optional(),
  clientCert: string().optional(),
  client_cert: string().optional(),
  clientKey: string().optional(),
  client_key: string().optional(),
  toolFilter: strictObject({
    include: array(string().trim().min(1)).min(1).optional(),
    exclude: array(string().trim().min(1)).min(1).optional(),
  }).optional(),
  codex: strictObject({
    agents: array(
      string()
        .trim()
        .regex(/^[a-z0-9][a-z0-9_-]{0,63}$/i),
    )
      .min(1)
      .optional(),
    defaultToolsApprovalMode: _enum(["auto", "prompt", "approve"]).optional(),
    default_tools_approval_mode: _enum(["auto", "prompt", "approve"]).optional(),
  }).optional(),
})
  .superRefine((data, ctx) => {
    if (
      data.transport === "stdio" &&
      (typeof data.command !== "string" || data.command.trim().length === 0)
    )
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: '"stdio" transport requires a non-empty command',
        path: ["transport"],
      });
  })
  .catchall(unknown());
const McpConfigSchema = strictObject({
  servers: record(string(), McpServerSchema).optional(),
  apps: strictObject({
    enabled: boolean().optional(),
    sandboxOrigin: string()
      .url()
      .refine((value) => {
        try {
          const url = new URL(value);
          return (
            (url.protocol === "http:" || url.protocol === "https:") &&
            url.origin === value.replace(/\/$/u, "") &&
            !url.username &&
            !url.password
          );
        } catch {
          return false;
        }
      }, "sandboxOrigin must be an HTTP(S) origin without a path, query, or credentials")
      .optional(),
    sandboxPort: number().int().min(1).max(65535).optional(),
  }).optional(),
  sessionIdleTtlMs: number().finite().min(0).optional(),
}).optional();
const NodeHostMcpServerNameSchema = string().refine(
  (value) => value.length > 0 && value === value.trim(),
  "MCP server name must be non-empty and must not have surrounding whitespace",
);
const NodeHostSchema = strictObject({
  agentRuns: NodeHostAgentRunsSchema,
  browserProxy: strictObject({
    enabled: boolean().optional(),
    allowProfiles: array(string()).optional(),
  }).optional(),
  mcp: strictObject({
    servers: record(NodeHostMcpServerNameSchema, McpServerSchema).optional(),
  }).optional(),
  skills: strictObject({ enabled: boolean().optional() }).optional(),
}).optional();
const CrestodianSchema = strictObject({
  rescue: strictObject({
    enabled: union([literal("auto"), boolean()]).optional(),
    ownerDmOnly: boolean().optional(),
    pendingTtlMinutes: number().int().positive().optional(),
  }).optional(),
}).optional();
function isPlainHttpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !url.search && !url.hash;
  } catch {
    return false;
  }
}
function isEd25519PublicKeyConfig(value) {
  if (/-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(value)) return false;
  if (!value.includes("BEGIN") && !/^[A-Za-z0-9_-]{43}$/.test(value)) return false;
  try {
    const normalized = normalizeEd25519PublicKeyBase64Url(value);
    return normalized ? base64UrlDecode(normalized).length === 32 : false;
  } catch {
    return false;
  }
}
const MarketplaceFeedTrustedPublicKeySchema = strictObject({
  keyId: string().trim().min(1),
  publicKey: string()
    .trim()
    .min(1)
    .refine(
      (value) => isEd25519PublicKeyConfig(value),
      "Expected Ed25519 public key as PEM or raw base64url",
    ),
});
const MarketplaceVerificationSchema = union([
  strictObject({ mode: literal("unsigned") }),
  strictObject({
    mode: literal("signed"),
    keys: array(MarketplaceFeedTrustedPublicKeySchema).min(1),
    threshold: number().int().positive().optional(),
  }).superRefine((value, ctx) => {
    const seenKeyIds = /* @__PURE__ */ new Map();
    const seenPublicKeys = /* @__PURE__ */ new Map();
    value.keys.forEach((key, index) => {
      if (seenKeyIds.get(key.keyId) !== void 0)
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ["keys", index, "keyId"],
          message: "Signed marketplace feed publisher key IDs must be unique",
        });
      else seenKeyIds.set(key.keyId, index);
      const normalizedPublicKey = normalizeEd25519PublicKeyBase64Url(key.publicKey);
      if (!normalizedPublicKey) return;
      if (seenPublicKeys.get(normalizedPublicKey) !== void 0)
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ["keys", index, "publicKey"],
          message: "Signed marketplace feed publisher public keys must be unique",
        });
      else seenPublicKeys.set(normalizedPublicKey, index);
    });
    if (value.threshold !== void 0 && value.threshold > value.keys.length)
      ctx.addIssue({
        code: ZodIssueCode.custom,
        path: ["threshold"],
        message: "Signed marketplace feed threshold cannot exceed configured key count",
      });
  }),
]);
const MarketplaceFeedProfileSchema = strictObject({
  url: string()
    .url()
    .refine(
      (value) => isPlainHttpsUrl(value),
      "Expected https:// URL without credentials, query, or fragment",
    ),
  verification: MarketplaceVerificationSchema.optional(),
});
const MarketplaceSourceProfileSchema = union([
  strictObject({ type: literal("npm") }),
  strictObject({ type: literal("clawhub") }),
  strictObject({ type: literal("git") }),
]);
const MarketplacesSchema = strictObject({
  feeds: record(string().min(1), MarketplaceFeedProfileSchema).optional(),
  sources: record(string().min(1), MarketplaceSourceProfileSchema).optional(),
}).optional();
const CommitmentsSchema = strictObject({
  enabled: boolean().optional(),
  maxPerDay: number().int().positive().optional(),
}).optional();
const OpenClawSchema = strictObject({
  $schema: string().optional(),
  meta: strictObject({
    lastTouchedVersion: string().optional(),
    lastTouchedAt: union([
      string(),
      number()
        .transform((n, ctx) => {
          const d = new Date(n);
          if (Number.isNaN(d.getTime())) {
            ctx.addIssue({
              code: ZodIssueCode.custom,
              message: "Invalid timestamp",
            });
            return NEVER;
          }
          return d.toISOString();
        })
        .pipe(string()),
    ]).optional(),
  }).optional(),
  env: object({
    shellEnv: strictObject({
      enabled: boolean().optional(),
      timeoutMs: number().int().nonnegative().optional(),
    }).optional(),
    vars: record(string(), string()).optional(),
  })
    .catchall(string())
    .optional(),
  wizard: strictObject({
    lastRunAt: string().optional(),
    lastRunVersion: string().optional(),
    lastRunCommit: string().optional(),
    lastRunCommand: string().optional(),
    lastRunMode: union([literal("local"), literal("remote")]).optional(),
    securityAcknowledgedAt: string().optional(),
  }).optional(),
  diagnostics: strictObject({
    enabled: boolean().optional(),
    flags: array(string()).optional(),
    stuckSessionWarnMs: number().int().positive().optional(),
    stuckSessionAbortMs: number().int().positive().optional(),
    memoryPressureSnapshot: boolean().optional(),
    otel: strictObject({
      enabled: boolean().optional(),
      endpoint: string().optional(),
      tracesEndpoint: string().optional(),
      metricsEndpoint: string().optional(),
      logsEndpoint: string().optional(),
      protocol: union([literal("http/protobuf"), literal("grpc")]).optional(),
      headers: record(string(), string()).optional(),
      serviceName: string().optional(),
      traces: boolean().optional(),
      metrics: boolean().optional(),
      logs: boolean().optional(),
      logsExporter: union([literal("otlp"), literal("stdout"), literal("both")]).optional(),
      sampleRate: number().min(0).max(1).optional(),
      flushIntervalMs: number().int().nonnegative().optional(),
      captureContent: union([
        boolean(),
        strictObject({
          enabled: boolean().optional(),
          inputMessages: boolean().optional(),
          outputMessages: boolean().optional(),
          toolInputs: boolean().optional(),
          toolOutputs: boolean().optional(),
          systemPrompt: boolean().optional(),
          toolDefinitions: boolean().optional(),
        }),
      ]).optional(),
    }).optional(),
    cacheTrace: strictObject({
      enabled: boolean().optional(),
      filePath: string().optional(),
      includeMessages: boolean().optional(),
      includePrompt: boolean().optional(),
      includeSystem: boolean().optional(),
    }).optional(),
  }).optional(),
  audit: strictObject({
    enabled: boolean().optional(),
    messages: union([literal("off"), literal("direct"), literal("all")]).optional(),
  }).optional(),
  logging: strictObject({
    level: LoggingLevelSchema.optional(),
    file: string().optional(),
    maxFileBytes: number().int().positive().optional(),
    consoleLevel: LoggingLevelSchema.optional(),
    consoleStyle: union([literal("pretty"), literal("compact"), literal("json")]).optional(),
    redactSensitive: union([literal("off"), literal("tools")]).optional(),
    redactPatterns: array(string()).optional(),
  }).optional(),
  cli: strictObject({
    banner: strictObject({
      taglineMode: union([literal("random"), literal("default"), literal("off")]).optional(),
    }).optional(),
  }).optional(),
  crestodian: CrestodianSchema,
  update: strictObject({
    channel: union([
      literal("stable"),
      literal("extended-stable"),
      literal("beta"),
      literal("dev"),
    ]).optional(),
    checkOnStart: boolean().optional(),
    auto: strictObject({
      enabled: boolean().optional(),
      stableDelayHours: number().nonnegative().max(168).optional(),
      stableJitterHours: number().nonnegative().max(168).optional(),
      betaCheckIntervalHours: number().positive().max(24).optional(),
    }).optional(),
  }).optional(),
  browser: strictObject({
    enabled: boolean().optional(),
    allowSystemProfileImport: boolean().optional(),
    evaluateEnabled: boolean().optional(),
    cdpUrl: string().optional(),
    remoteCdpTimeoutMs: number().int().nonnegative().optional(),
    remoteCdpHandshakeTimeoutMs: number().int().nonnegative().optional(),
    localLaunchTimeoutMs: number().int().positive().max(12e4).optional(),
    localCdpReadyTimeoutMs: number().int().positive().max(12e4).optional(),
    actionTimeoutMs: number().int().positive().optional(),
    color: string().optional(),
    executablePath: string().optional(),
    headless: boolean().optional(),
    noSandbox: boolean().optional(),
    attachOnly: boolean().optional(),
    cdpPortRangeStart: number().int().min(1).max(65535).optional(),
    defaultProfile: string().optional(),
    snapshotDefaults: BrowserSnapshotDefaultsSchema,
    ssrfPolicy: strictObject({
      dangerouslyAllowPrivateNetwork: boolean().optional(),
      allowedHostnames: array(string()).optional(),
      hostnameAllowlist: array(string()).optional(),
    }).optional(),
    profiles: record(
      string().regex(/^[a-z0-9-]+$/, "Profile names must be alphanumeric with hyphens only"),
      strictObject({
        cdpPort: number().int().min(1).max(65535).optional(),
        cdpUrl: string().optional(),
        userDataDir: string().optional(),
        mcpCommand: string().optional(),
        mcpArgs: array(string()).optional(),
        driver: union([
          literal("openclaw"),
          literal("clawd"),
          literal("existing-session"),
          literal("extension"),
        ]).optional(),
        headless: boolean().optional(),
        executablePath: string().optional(),
        attachOnly: boolean().optional(),
        color: HexColorSchema,
      })
        .refine(
          (value) =>
            value.driver === "existing-session" ||
            value.driver === "extension" ||
            value.cdpPort ||
            value.cdpUrl,
          { message: "Profile must set cdpPort or cdpUrl" },
        )
        .refine((value) => value.driver === "existing-session" || !value.userDataDir, {
          message: 'Profile userDataDir is only supported with driver="existing-session"',
        })
        .refine((value) => value.driver !== "extension" || !value.cdpUrl, {
          message:
            'Profile cdpUrl is not supported with driver="extension" (the relay owns the endpoint)',
        }),
    ).optional(),
    extraArgs: array(string()).optional(),
    tabCleanup: strictObject({
      enabled: boolean().optional(),
      idleMinutes: number().int().nonnegative().optional(),
      maxTabsPerSession: number().int().nonnegative().optional(),
      sweepMinutes: number().int().positive().optional(),
    }).optional(),
  }).optional(),
  ui: strictObject({
    seamColor: HexColorSchema.optional(),
    assistant: strictObject({
      name: string().max(50).optional(),
      avatar: string().max(2e6).optional(),
    }).optional(),
  }).optional(),
  tui: strictObject({
    footer: strictObject({ showRemoteHost: boolean().optional() }).optional(),
  }).optional(),
  secrets: SecretsConfigSchema,
  marketplaces: MarketplacesSchema,
  auth: strictObject({
    profiles: record(
      string(),
      strictObject({
        provider: string(),
        mode: union([literal("api_key"), literal("aws-sdk"), literal("oauth"), literal("token")]),
        email: string().optional(),
        displayName: string().optional(),
      }),
    ).optional(),
    order: record(string(), array(string())).optional(),
    cooldowns: strictObject({
      billingBackoffHours: number().positive().optional(),
      billingBackoffHoursByProvider: record(string(), number().positive()).optional(),
      billingMaxHours: number().positive().optional(),
      authPermanentBackoffMinutes: number().positive().optional(),
      authPermanentMaxMinutes: number().positive().optional(),
      failureWindowHours: number().positive().optional(),
      overloadedProfileRotations: number().int().nonnegative().optional(),
      overloadedBackoffMs: number().int().nonnegative().optional(),
      rateLimitedProfileRotations: number().int().nonnegative().optional(),
    }).optional(),
  }).optional(),
  accessGroups: AccessGroupsSchema,
  acp: strictObject({
    enabled: boolean().optional(),
    dispatch: strictObject({ enabled: boolean().optional() }).optional(),
    backend: string().optional(),
    fallbacks: array(string()).optional(),
    defaultAgent: string().optional(),
    allowedAgents: array(string()).optional(),
    maxConcurrentSessions: number().int().positive().optional(),
    stream: strictObject({
      coalesceIdleMs: number().int().nonnegative().optional(),
      maxChunkChars: number().int().positive().optional(),
      repeatSuppression: boolean().optional(),
      deliveryMode: union([literal("live"), literal("final_only")]).optional(),
      hiddenBoundarySeparator: union([
        literal("none"),
        literal("space"),
        literal("newline"),
        literal("paragraph"),
      ]).optional(),
      maxOutputChars: number().int().positive().optional(),
      maxSessionUpdateChars: number().int().positive().optional(),
      tagVisibility: record(string(), boolean()).optional(),
    }).optional(),
    runtime: strictObject({
      ttlMinutes: number().int().positive().optional(),
      installCommand: string().optional(),
    }).optional(),
  }).optional(),
  models: ModelsConfigSchema,
  nodeHost: NodeHostSchema,
  agents: AgentsSchema,
  tools: ToolsSchema,
  security: SecuritySchema,
  bindings: BindingsSchema,
  broadcast: BroadcastSchema,
  audio: AudioSchema,
  media: strictObject({
    preserveFilenames: boolean().optional(),
    ttlHours: number().int().min(1).max(168).optional(),
  }).optional(),
  messages: MessagesSchema,
  commands: CommandsSchema,
  approvals: ApprovalsSchema,
  session: SessionSchema,
  cron: strictObject({
    enabled: boolean().optional(),
    store: string().optional(),
    maxConcurrentRuns: number().int().positive().optional(),
    triggers: strictObject({
      enabled: boolean().optional(),
      minIntervalMs: number().int().positive().optional(),
    }).optional(),
    retry: strictObject({
      maxAttempts: number().int().min(0).max(10).optional(),
      backoffMs: array(number().int().nonnegative()).min(1).max(10).optional(),
      retryOn: array(_enum(["rate_limit", "overloaded", "network", "timeout", "server_error"]))
        .min(1)
        .optional(),
    }).optional(),
    webhook: HttpUrlSchema.optional(),
    webhookToken: SecretInputSchema.optional().register(sensitive),
    sessionRetention: union([string(), literal(false)]).optional(),
    failureAlert: strictObject({
      enabled: boolean().optional(),
      after: number().int().min(1).optional(),
      cooldownMs: number().int().min(0).optional(),
      includeSkipped: boolean().optional(),
      mode: _enum(["announce", "webhook"]).optional(),
      accountId: string().optional(),
    }).optional(),
    failureDestination: strictObject({
      channel: string().optional(),
      to: string().optional(),
      accountId: string().optional(),
      mode: _enum(["announce", "webhook"]).optional(),
    }).optional(),
  })
    .superRefine((val, ctx) => {
      if (val.sessionRetention !== void 0 && val.sessionRetention !== false)
        try {
          parseDurationMs(normalizeStringifiedOptionalString(val.sessionRetention) ?? "", {
            defaultUnit: "h",
          });
        } catch {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: ["sessionRetention"],
            message: "invalid duration (use ms, s, m, h, d)",
          });
        }
    })
    .optional(),
  worktrees: strictObject({
    cleanup: strictObject({
      maxCount: number().int().min(0).optional(),
      maxTotalSizeGb: number().min(0).optional(),
    }).optional(),
  }).optional(),
  transcripts: strictObject({
    enabled: boolean().optional(),
    maxUtterances: number().int().min(1).max(1e4).optional(),
    autoStart: array(
      strictObject({
        providerId: string().min(1),
        sessionId: string().min(1).optional(),
        title: string().min(1).optional(),
        accountId: string().min(1).optional(),
        guildId: string().min(1).optional(),
        channelId: string().min(1).optional(),
        meetingUrl: string().min(1).optional(),
      }),
    ).optional(),
  }).optional(),
  commitments: CommitmentsSchema,
  hooks: strictObject({
    enabled: boolean().optional(),
    path: string().optional(),
    token: string().optional().register(sensitive),
    defaultSessionKey: string().optional(),
    allowRequestSessionKey: boolean().optional(),
    allowedSessionKeyPrefixes: array(string()).optional(),
    allowedAgentIds: array(string()).optional(),
    maxBodyBytes: number().int().positive().optional(),
    presets: array(string()).optional(),
    transformsDir: string().optional(),
    mappings: array(HookMappingSchema).optional(),
    gmail: HooksGmailSchema,
    internal: InternalHooksSchema,
  }).optional(),
  web: strictObject({
    enabled: boolean().optional(),
    heartbeatSeconds: number().int().positive().optional(),
    reconnect: strictObject({
      initialMs: number().positive().optional(),
      maxMs: number().positive().optional(),
      factor: number().positive().optional(),
      jitter: number().min(0).max(1).optional(),
      maxAttempts: number().int().min(0).optional(),
    }).optional(),
    whatsapp: strictObject({
      keepAliveIntervalMs: number().int().positive().optional(),
      connectTimeoutMs: number().int().positive().optional(),
      defaultQueryTimeoutMs: number().int().positive().optional(),
    }).optional(),
  }).optional(),
  channels: ChannelsSchema,
  discovery: strictObject({
    wideArea: strictObject({
      enabled: boolean().optional(),
      domain: string().optional(),
    }).optional(),
    mdns: strictObject({ mode: _enum(["off", "minimal", "full"]).optional() }).optional(),
  }).optional(),
  talk: TalkSchema.optional(),
  gateway: strictObject({
    port: number().int().positive().optional(),
    mode: union([literal("local"), literal("remote")]).optional(),
    bind: union([
      literal("auto"),
      literal("lan"),
      literal("loopback"),
      literal("custom"),
      literal("tailnet"),
    ]).optional(),
    customBindHost: string().optional(),
    controlUi: strictObject({
      enabled: boolean().optional(),
      basePath: string().optional(),
      root: string().optional(),
      toolTitles: boolean().optional(),
      embedSandbox: union([literal("strict"), literal("scripts"), literal("trusted")]).optional(),
      allowExternalEmbedUrls: boolean().optional(),
      chatMessageMaxWidth: string()
        .transform((value) => normalizeControlUiChatMessageMaxWidth(value))
        .refine((value) => isValidControlUiChatMessageMaxWidth(value), {
          message:
            "Expected a CSS width value such as 960px, 82%, min(1280px, 82%), or calc(100% - 2rem)",
        })
        .optional(),
      allowedOrigins: array(string()).optional(),
      dangerouslyAllowHostHeaderOriginFallback: boolean().optional(),
      allowInsecureAuth: boolean().optional(),
      dangerouslyDisableDeviceAuth: boolean().optional(),
    }).optional(),
    terminal: strictObject({
      enabled: boolean().optional(),
      shell: string().optional(),
      detachedSessionTimeoutSeconds: number().int().min(0).optional(),
    }).optional(),
    auth: strictObject({
      mode: union([
        literal("none"),
        literal("token"),
        literal("password"),
        literal("trusted-proxy"),
      ]).optional(),
      token: SecretInputSchema.optional().register(sensitive),
      password: SecretInputSchema.optional().register(sensitive),
      allowTailscale: boolean().optional(),
      rateLimit: strictObject({
        maxAttempts: number().optional(),
        windowMs: number().optional(),
        lockoutMs: number().optional(),
        exemptLoopback: boolean().optional(),
      }).optional(),
      trustedProxy: strictObject({
        userHeader: string().min(1, "userHeader is required for trusted-proxy mode"),
        requiredHeaders: array(string()).optional(),
        allowUsers: array(string()).optional(),
        allowLoopback: boolean().optional(),
      }).optional(),
    }).optional(),
    trustedProxies: array(string()).optional(),
    allowRealIpFallback: boolean().optional(),
    tools: strictObject({
      deny: array(string()).optional(),
      allow: array(string()).optional(),
    }).optional(),
    handshakeTimeoutMs: number().int().min(1).optional(),
    channelHealthCheckMinutes: number().int().min(0).optional(),
    channelStaleEventThresholdMinutes: number().int().min(1).optional(),
    channelMaxRestartsPerHour: number().int().min(1).optional(),
    tailscale: strictObject({
      mode: union([literal("off"), literal("serve"), literal("funnel")]).optional(),
      resetOnExit: boolean().optional(),
      serviceName: TailscaleServiceNameSchema.optional(),
      preserveFunnel: boolean().optional(),
    }).optional(),
    remote: GatewayRemoteConfigSchema,
    reload: strictObject({
      mode: union([
        literal("off"),
        literal("restart"),
        literal("hot"),
        literal("hybrid"),
      ]).optional(),
      debounceMs: number().int().min(0).optional(),
      deferralTimeoutMs: number().int().min(0).optional(),
    }).optional(),
    tls: object({
      enabled: boolean().optional(),
      autoGenerate: boolean().optional(),
      certPath: string()
        .optional()
        .refine((v) => v === void 0 || v.trim().length > 0, "certPath must not be blank"),
      keyPath: string()
        .optional()
        .refine((v) => v === void 0 || v.trim().length > 0, "keyPath must not be blank"),
      caPath: string().optional(),
    }).optional(),
    http: strictObject({
      endpoints: strictObject({
        chatCompletions: strictObject({
          enabled: boolean().optional(),
          maxBodyBytes: number().int().positive().optional(),
          maxImageParts: number().int().nonnegative().optional(),
          maxTotalImageBytes: number().int().positive().optional(),
          images: strictObject({ ...ResponsesEndpointUrlFetchShape }).optional(),
        }).optional(),
        responses: strictObject({
          enabled: boolean().optional(),
          maxBodyBytes: number().int().positive().optional(),
          maxUrlParts: number().int().nonnegative().optional(),
          files: strictObject({
            ...ResponsesEndpointUrlFetchShape,
            maxChars: number().int().positive().optional(),
            pdf: strictObject({
              maxPages: number().int().positive().optional(),
              maxPixels: number().int().positive().optional(),
              minTextChars: number().int().nonnegative().optional(),
            }).optional(),
          }).optional(),
          images: strictObject({ ...ResponsesEndpointUrlFetchShape }).optional(),
        }).optional(),
      }).optional(),
      securityHeaders: strictObject({
        strictTransportSecurity: union([string(), literal(false)]).optional(),
      }).optional(),
    }).optional(),
    push: strictObject({
      apns: strictObject({
        relay: strictObject({
          baseUrl: string().optional(),
          timeoutMs: number().int().positive().optional(),
        }).optional(),
      }).optional(),
    }).optional(),
    nodes: strictObject({
      browser: strictObject({
        mode: union([literal("auto"), literal("manual"), literal("off")]).optional(),
        node: string().optional(),
      }).optional(),
      pairing: strictObject({
        autoApproveCidrs: array(string()).optional(),
        sshVerify: union([
          boolean(),
          strictObject({
            user: string().optional(),
            identity: string().optional(),
            timeoutMs: number().int().positive().optional(),
            cidrs: array(string()).optional(),
          }),
        ]).optional(),
      }).optional(),
      pluginTools: strictObject({ enabled: boolean().optional() }).optional(),
      skills: strictObject({ enabled: boolean().optional() }).optional(),
      allowCommands: array(string()).optional(),
      denyCommands: array(string()).optional(),
    }).optional(),
  })
    .superRefine((gateway, ctx) => {
      const effectiveHealthCheckMinutes = gateway.channelHealthCheckMinutes ?? 5;
      if (
        gateway.channelStaleEventThresholdMinutes != null &&
        effectiveHealthCheckMinutes !== 0 &&
        gateway.channelStaleEventThresholdMinutes < effectiveHealthCheckMinutes
      )
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ["channelStaleEventThresholdMinutes"],
          message:
            "channelStaleEventThresholdMinutes should be >= channelHealthCheckMinutes to avoid delayed stale detection",
        });
    })
    .optional(),
  cloudWorkers: CloudWorkersConfigSchema,
  memory: MemorySchema,
  mcp: McpConfigSchema,
  skills: strictObject({
    allowBundled: array(string()).optional(),
    load: strictObject({
      extraDirs: array(string()).optional(),
      allowSymlinkTargets: array(string()).optional(),
      watch: boolean().optional(),
      watchDebounceMs: number().int().min(0).optional(),
    }).optional(),
    install: strictObject({
      preferBrew: boolean().optional(),
      nodeManager: union([
        literal("npm"),
        literal("pnpm"),
        literal("yarn"),
        literal("bun"),
      ]).optional(),
      allowUploadedArchives: boolean().optional(),
    }).optional(),
    limits: strictObject({
      maxCandidatesPerRoot: number().int().min(1).optional(),
      maxSkillsLoadedPerSource: number().int().min(1).optional(),
      maxSkillsInPrompt: number().int().min(0).optional(),
      maxSkillsPromptChars: number().int().min(0).optional(),
      maxSkillFileBytes: number().int().min(0).optional(),
    }).optional(),
    workshop: strictObject({
      autonomous: strictObject({ enabled: boolean().optional() }).optional(),
      approvalPolicy: union([literal("pending"), literal("auto")]).optional(),
      allowSymlinkTargetWrites: boolean().optional(),
      maxPending: number().int().min(1).optional(),
      maxSkillBytes: number().int().min(1).optional(),
    }).optional(),
    entries: record(string(), SkillEntrySchema).optional(),
  }).optional(),
  plugins: strictObject({
    enabled: boolean().optional(),
    allow: array(string()).optional(),
    deny: array(string()).optional(),
    load: strictObject({ paths: array(string()).optional() }).optional(),
    slots: strictObject({
      memory: string().optional(),
      contextEngine: string().optional(),
    }).optional(),
    entries: record(string(), PluginEntrySchema).optional(),
    bundledDiscovery: _enum(["compat", "allowlist"]).optional(),
  }).optional(),
  canvasHost: LegacyCanvasHostSchema,
  surfaces: record(
    string(),
    strictObject({ silentReply: SilentReplyPolicyConfigSchema.optional() }),
  ).optional(),
  proxy: ProxyConfigSchema,
}).superRefine((cfg, ctx) => {
  const agents = cfg.agents?.list ?? [];
  if (agents.length === 0) return;
  const agentIds = new Set(agents.map((agent) => agent.id));
  const effectiveAgentIds = new Set(agents.map((agent) => normalizeAgentId(agent.id)));
  const bindings = cfg.bindings;
  if (Array.isArray(bindings))
    for (let idx = 0; idx < bindings.length; idx += 1) {
      const binding = bindings[idx];
      if (!binding || typeof binding !== "object") continue;
      const agentId = binding.agentId;
      if (typeof agentId === "string" && !effectiveAgentIds.has(normalizeAgentId(agentId)))
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ["bindings", idx, "agentId"],
          message: `Unknown agent id "${agentId}" (not in agents.list).`,
        });
    }
  const broadcast = cfg.broadcast;
  if (!broadcast) return;
  for (const [peerId, ids] of Object.entries(broadcast)) {
    if (peerId === "strategy") continue;
    if (!Array.isArray(ids)) continue;
    for (const [idx, agentId] of ids.entries())
      if (!agentIds.has(agentId))
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ["broadcast", peerId, idx],
          message: `Unknown agent id "${agentId}" (not in agents.list).`,
        });
  }
});
//#endregion
export {
  parseByteSize as i,
  validateCloudWorkerProfileSettings as n,
  parseNonNegativeByteSize as r,
  OpenClawSchema as t,
};
