import { Type } from "typebox";
import { Compile } from "typebox/compile";
import "./worker-admission-BAoXlOyb.js";
import "./worker-inference-y83k6oxW.js";
import {
  A as GatewayClientModeSchema,
  M as NonEmptyString,
  N as SecretInputSchema,
  O as ChatSendSessionKeyString,
  P as SessionLabelString,
  j as InputProvenanceSchema,
  k as GatewayClientIdSchema,
} from "./approvals-BSpwjSwI.js";
import { t as closedObject } from "./closed-object-DY9fiMP-.js";
//#region packages/gateway-protocol/src/protocol-validator.ts
function lazyCompile(schema, precheck) {
  let compiled;
  let errors = null;
  const getCompiled = () => {
    compiled ??= Compile(schema);
    return compiled;
  };
  const validate = (data) => {
    const precheckError = precheck?.(data);
    if (precheckError) {
      errors = [precheckError];
      return false;
    }
    const current = getCompiled();
    const valid = current.Check(data);
    errors = valid ? null : [...current.Errors(data)];
    return valid;
  };
  Object.defineProperties(validate, {
    errors: {
      configurable: true,
      enumerable: true,
      get: () => errors,
      set: (nextErrors) => {
        errors = nextErrors ?? null;
      },
    },
    schema: {
      configurable: true,
      enumerable: true,
      get: () => schema,
    },
  });
  return validate;
}
//#endregion
//#region packages/gateway-protocol/src/schema/skill-history.ts
const SkillsProposalHistoryStatusParamsSchema = Type.Object(
  { agentId: Type.Optional(NonEmptyString) },
  { additionalProperties: false },
);
const SkillsProposalHistoryScanParamsSchema = Type.Object(
  {
    agentId: Type.Optional(NonEmptyString),
    direction: Type.Optional(Type.Union([Type.Literal("older"), Type.Literal("newer")])),
  },
  { additionalProperties: false },
);
const SkillsProposalHistoryScanResultSchema = Type.Object(
  {
    schema: Type.Literal("openclaw.skill-workshop.history-scan.v1"),
    hasScanned: Type.Boolean(),
    reviewedSessions: Type.Integer({ minimum: 0 }),
    ideasFound: Type.Integer({ minimum: 0 }),
    hasMore: Type.Boolean(),
    lastScanReviewed: Type.Integer({ minimum: 0 }),
    lastScanIdeas: Type.Integer({ minimum: 0 }),
    lastScanAt: Type.Optional(NonEmptyString),
    oldestReviewedAt: Type.Optional(NonEmptyString),
    newestReviewedAt: Type.Optional(NonEmptyString),
  },
  { additionalProperties: false },
);
const validateSkillsProposalHistoryStatusParams = lazyCompile(
  SkillsProposalHistoryStatusParamsSchema,
);
const validateSkillsProposalHistoryScanParams = lazyCompile(SkillsProposalHistoryScanParamsSchema);
//#endregion
//#region packages/gateway-protocol/src/schema/migrations.ts
const MAX_MEMORY_MIGRATION_ITEMS = 2e3;
const MemoryMigrationPlanFingerprintSchema = Type.String({
  minLength: 64,
  maxLength: 64,
  pattern: "^[a-f0-9]{64}$",
});
const MemoryMigrationItemStatusSchema = Type.Union([
  Type.Literal("planned"),
  Type.Literal("migrated"),
  Type.Literal("skipped"),
  Type.Literal("warning"),
  Type.Literal("conflict"),
  Type.Literal("error"),
]);
const MemoryMigrationItemSchema = Type.Object(
  {
    id: NonEmptyString,
    status: MemoryMigrationItemStatusSchema,
    source: Type.Optional(NonEmptyString),
    target: Type.Optional(NonEmptyString),
    message: Type.Optional(Type.String()),
    reason: Type.Optional(Type.String()),
    details: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
  },
  { additionalProperties: false },
);
const MemoryMigrationSummarySchema = Type.Object(
  {
    total: Type.Integer({ minimum: 0 }),
    planned: Type.Integer({ minimum: 0 }),
    migrated: Type.Integer({ minimum: 0 }),
    skipped: Type.Integer({ minimum: 0 }),
    conflicts: Type.Integer({ minimum: 0 }),
    errors: Type.Integer({ minimum: 0 }),
    sensitive: Type.Integer({ minimum: 0 }),
  },
  { additionalProperties: false },
);
const MemoryMigrationProviderPlanSchema = Type.Object(
  {
    providerId: NonEmptyString,
    label: NonEmptyString,
    description: Type.Optional(Type.String()),
    planFingerprint: Type.Optional(MemoryMigrationPlanFingerprintSchema),
    found: Type.Boolean(),
    source: Type.Optional(NonEmptyString),
    target: Type.Optional(NonEmptyString),
    confidence: Type.Optional(
      Type.Union([Type.Literal("low"), Type.Literal("medium"), Type.Literal("high")]),
    ),
    message: Type.Optional(Type.String()),
    error: Type.Optional(Type.String()),
    summary: MemoryMigrationSummarySchema,
    items: Type.Array(MemoryMigrationItemSchema, { maxItems: MAX_MEMORY_MIGRATION_ITEMS }),
    warnings: Type.Optional(Type.Array(Type.String())),
  },
  { additionalProperties: false },
);
const MigrationsMemoryPlanParamsSchema = Type.Object(
  {
    agentId: NonEmptyString,
    overwrite: Type.Optional(Type.Boolean()),
  },
  { additionalProperties: false },
);
const MigrationsMemoryPlanResultSchema = Type.Object(
  {
    agentId: NonEmptyString,
    workspace: NonEmptyString,
    providers: Type.Array(MemoryMigrationProviderPlanSchema),
  },
  { additionalProperties: false },
);
const MigrationsMemoryApplyParamsSchema = Type.Object(
  {
    idempotencyKey: NonEmptyString,
    agentId: NonEmptyString,
    providerId: NonEmptyString,
    planFingerprint: MemoryMigrationPlanFingerprintSchema,
    itemIds: Type.Array(NonEmptyString, {
      minItems: 1,
      uniqueItems: true,
      maxItems: MAX_MEMORY_MIGRATION_ITEMS,
    }),
    overwrite: Type.Optional(Type.Boolean()),
  },
  { additionalProperties: false },
);
const MigrationsMemoryApplyResultSchema = Type.Object(
  {
    providerId: NonEmptyString,
    source: NonEmptyString,
    target: Type.Optional(NonEmptyString),
    summary: MemoryMigrationSummarySchema,
    items: Type.Array(MemoryMigrationItemSchema, { maxItems: MAX_MEMORY_MIGRATION_ITEMS }),
    warnings: Type.Optional(Type.Array(Type.String())),
    backupPath: Type.Optional(NonEmptyString),
    reportDir: Type.Optional(NonEmptyString),
  },
  { additionalProperties: false },
);
const MigrationProtocolSchemas = {
  MemoryMigrationItemStatus: MemoryMigrationItemStatusSchema,
  MemoryMigrationItem: MemoryMigrationItemSchema,
  MemoryMigrationSummary: MemoryMigrationSummarySchema,
  MemoryMigrationProviderPlan: MemoryMigrationProviderPlanSchema,
  MigrationsMemoryPlanParams: MigrationsMemoryPlanParamsSchema,
  MigrationsMemoryPlanResult: MigrationsMemoryPlanResultSchema,
  MigrationsMemoryApplyParams: MigrationsMemoryApplyParamsSchema,
  MigrationsMemoryApplyResult: MigrationsMemoryApplyResultSchema,
};
//#endregion
//#region packages/gateway-protocol/src/schema/agent.ts
/**
 * Agent and channel-action gateway schemas.
 *
 * These payloads sit on the boundary between external channel adapters, gateway
 * RPC callers, and the agent runtime. Keep public request fields documented
 * because older CLI/channel clients may continue sending them across releases.
 */
const AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION = "task_completion";
const AGENT_INTERNAL_EVENT_SOURCES = [
  "subagent",
  "cron",
  "image_generation",
  "video_generation",
  "music_generation",
];
const AGENT_INTERNAL_EVENT_STATUSES = ["ok", "timeout", "error", "unknown"];
/** Generated media/file attachment metadata carried by internal agent events. */
const AgentGeneratedAttachmentSchema = closedObject({
  type: Type.Optional(Type.String({ enum: ["image", "audio", "video", "file"] })),
  path: Type.Optional(Type.String()),
  url: Type.Optional(Type.String()),
  mediaUrl: Type.Optional(Type.String()),
  filePath: Type.Optional(Type.String()),
  mimeType: Type.Optional(Type.String()),
  name: Type.Optional(Type.String()),
});
/** Internal completion event surfaced when child automation reports back to a parent run. */
const AgentInternalEventSchema = closedObject({
  type: Type.Literal(AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION),
  source: Type.String({ enum: [...AGENT_INTERNAL_EVENT_SOURCES] }),
  childSessionKey: Type.String(),
  childSessionId: Type.Optional(Type.String()),
  announceType: Type.String(),
  taskLabel: Type.String(),
  status: Type.String({ enum: [...AGENT_INTERNAL_EVENT_STATUSES] }),
  statusLabel: Type.String(),
  result: Type.String(),
  attachments: Type.Optional(Type.Array(AgentGeneratedAttachmentSchema)),
  mediaUrls: Type.Optional(Type.Array(Type.String())),
  statsLine: Type.Optional(Type.String()),
  replyInstruction: Type.String(),
});
/** Stream event emitted by the agent runtime over the gateway protocol. */
const AgentEventSchema = closedObject({
  runId: NonEmptyString,
  seq: Type.Integer({ minimum: 0 }),
  stream: NonEmptyString,
  ts: Type.Integer({ minimum: 0 }),
  spawnedBy: Type.Optional(NonEmptyString),
  isHeartbeat: Type.Optional(Type.Boolean()),
  data: Type.Record(Type.String(), Type.Unknown()),
});
/** Caller-supplied routing hints. Authorization must use trusted runtime context. */
const MessageActionToolContextSchema = closedObject({
  currentChannelId: Type.Optional(Type.String()),
  currentMessagingTarget: Type.Optional(Type.String()),
  currentGraphChannelId: Type.Optional(Type.String()),
  currentChannelProvider: Type.Optional(Type.String()),
  currentThreadTs: Type.Optional(Type.String()),
  currentMessageId: Type.Optional(Type.Union([Type.String(), Type.Number()])),
  replyToMode: Type.Optional(
    Type.Union([
      Type.Literal("off"),
      Type.Literal("first"),
      Type.Literal("all"),
      Type.Literal("batched"),
    ]),
  ),
  hasRepliedRef: Type.Optional(closedObject({ value: Type.Boolean() })),
  sameChannelThreadRequired: Type.Optional(Type.Boolean()),
  skipCrossContextDecoration: Type.Optional(Type.Boolean()),
});
/** Request to execute a channel message action through a configured adapter. */
const MessageActionParamsSchema = closedObject({
  channel: NonEmptyString,
  action: NonEmptyString,
  params: Type.Record(Type.String(), Type.Unknown()),
  accountId: Type.Optional(Type.String()),
  requesterAccountId: Type.Optional(Type.String()),
  requesterSenderId: Type.Optional(Type.String()),
  senderIsOwner: Type.Optional(Type.Boolean()),
  sessionKey: Type.Optional(Type.String()),
  sessionId: Type.Optional(Type.String()),
  inboundTurnKind: Type.Optional(Type.String({ enum: ["user_request", "room_event"] })),
  agentId: Type.Optional(Type.String()),
  toolContext: Type.Optional(MessageActionToolContextSchema),
  /**
   * Explicit operation-local marker for an authenticated direct operator.
   * Missing values remain delegated, and agent runtime identity wins server-side.
   */
  conversationReadOrigin: Type.Optional(Type.Literal("direct-operator")),
  idempotencyKey: NonEmptyString,
});
/** Outbound send request shared by channel adapters. */
const SendParamsSchema = closedObject({
  to: NonEmptyString,
  message: Type.Optional(Type.String()),
  mediaUrl: Type.Optional(Type.String()),
  mediaUrls: Type.Optional(Type.Array(Type.String())),
  /** Base64 attachment payload for gateway-local media materialization. */
  buffer: Type.Optional(Type.String()),
  /** Optional filename for a base64 attachment payload. */
  filename: Type.Optional(Type.String()),
  /** Optional MIME type for a base64 attachment payload. */
  contentType: Type.Optional(Type.String()),
  asVoice: Type.Optional(Type.Boolean()),
  gifPlayback: Type.Optional(Type.Boolean()),
  channel: Type.Optional(Type.String()),
  accountId: Type.Optional(Type.String()),
  /** Optional agent id for per-agent media root resolution on gateway sends. */
  agentId: Type.Optional(Type.String()),
  /** Reply target message id for native quoted/threaded sends where supported. */
  replyToId: Type.Optional(Type.String()),
  /** Thread id (channel-specific meaning, e.g. Telegram forum topic id). */
  threadId: Type.Optional(Type.String()),
  /** Force document-style media sends where supported. */
  forceDocument: Type.Optional(Type.Boolean()),
  /** Send silently (no notification) where supported. */
  silent: Type.Optional(Type.Boolean()),
  /** Channel-specific parse mode for formatted text. */
  parseMode: Type.Optional(Type.Literal("HTML")),
  /** Optional session key for mirroring delivered output back into the transcript. */
  sessionKey: Type.Optional(Type.String()),
  idempotencyKey: NonEmptyString,
});
/** Poll creation request for adapters that support native polls. */
const PollParamsSchema = closedObject({
  to: NonEmptyString,
  question: NonEmptyString,
  options: Type.Array(NonEmptyString, {
    minItems: 2,
    maxItems: 12,
  }),
  maxSelections: Type.Optional(
    Type.Integer({
      minimum: 1,
      maximum: 12,
    }),
  ),
  /** Poll duration in seconds (channel-specific limits may apply). */
  durationSeconds: Type.Optional(
    Type.Integer({
      minimum: 1,
      maximum: 604800,
    }),
  ),
  durationHours: Type.Optional(Type.Integer({ minimum: 1 })),
  /** Send silently (no notification) where supported. */
  silent: Type.Optional(Type.Boolean()),
  /** Poll anonymity where supported (e.g. Telegram polls default to anonymous). */
  isAnonymous: Type.Optional(Type.Boolean()),
  /** Thread id (channel-specific meaning, e.g. Telegram forum topic id). */
  threadId: Type.Optional(Type.String()),
  channel: Type.Optional(Type.String()),
  accountId: Type.Optional(Type.String()),
  idempotencyKey: NonEmptyString,
});
/** Main agent-run request accepted by the gateway. */
const AgentParamsSchema = closedObject({
  message: NonEmptyString,
  agentId: Type.Optional(NonEmptyString),
  provider: Type.Optional(Type.String()),
  model: Type.Optional(Type.String()),
  to: Type.Optional(Type.String()),
  replyTo: Type.Optional(Type.String()),
  sessionId: Type.Optional(Type.String()),
  sessionKey: Type.Optional(Type.String()),
  expectedExistingSessionId: Type.Optional(NonEmptyString),
  thinking: Type.Optional(Type.String()),
  deliver: Type.Optional(Type.Boolean()),
  attachments: Type.Optional(Type.Array(Type.Unknown())),
  channel: Type.Optional(Type.String()),
  replyChannel: Type.Optional(Type.String()),
  accountId: Type.Optional(Type.String()),
  replyAccountId: Type.Optional(Type.String()),
  threadId: Type.Optional(Type.String()),
  groupId: Type.Optional(Type.String()),
  groupChannel: Type.Optional(Type.String()),
  groupSpace: Type.Optional(Type.String()),
  timeout: Type.Optional(Type.Integer({ minimum: 0 })),
  bestEffortDeliver: Type.Optional(Type.Boolean()),
  lane: Type.Optional(Type.String()),
  cwd: Type.Optional(NonEmptyString),
  cleanupBundleMcpOnRunEnd: Type.Optional(Type.Boolean()),
  modelRun: Type.Optional(Type.Boolean()),
  promptMode: Type.Optional(
    Type.Union([Type.Literal("full"), Type.Literal("minimal"), Type.Literal("none")]),
  ),
  extraSystemPrompt: Type.Optional(Type.String()),
  bootstrapContextMode: Type.Optional(
    Type.Union([Type.Literal("full"), Type.Literal("lightweight")]),
  ),
  bootstrapContextRunKind: Type.Optional(
    Type.Union([Type.Literal("default"), Type.Literal("heartbeat"), Type.Literal("cron")]),
  ),
  acpTurnSource: Type.Optional(Type.Literal("manual_spawn")),
  internalRuntimeHandoffId: Type.Optional(NonEmptyString),
  execApprovalFollowupExpectedSessionId: Type.Optional(NonEmptyString),
  internalEvents: Type.Optional(Type.Array(AgentInternalEventSchema)),
  inputProvenance: Type.Optional(InputProvenanceSchema),
  suppressPromptPersistence: Type.Optional(Type.Boolean()),
  sessionEffects: Type.Optional(Type.Union([Type.Literal("visible"), Type.Literal("internal")])),
  sourceReplyDeliveryMode: Type.Optional(
    Type.Union([Type.Literal("automatic"), Type.Literal("message_tool_only")]),
  ),
  disableMessageTool: Type.Optional(Type.Boolean()),
  forceRestartSafeTools: Type.Optional(Type.Boolean()),
  voiceWakeTrigger: Type.Optional(Type.String()),
  idempotencyKey: NonEmptyString,
  label: Type.Optional(SessionLabelString),
});
/** Identity lookup request for the current or selected agent/session. */
const AgentIdentityParamsSchema = closedObject({
  agentId: Type.Optional(NonEmptyString),
  sessionKey: Type.Optional(Type.String()),
});
/** Public display identity returned for an agent. */
const AgentIdentityResultSchema = closedObject({
  agentId: NonEmptyString,
  name: Type.Optional(NonEmptyString),
  avatar: Type.Optional(NonEmptyString),
  avatarSource: Type.Optional(NonEmptyString),
  avatarStatus: Type.Optional(Type.String({ enum: ["none", "local", "remote", "data"] })),
  avatarReason: Type.Optional(NonEmptyString),
  emoji: Type.Optional(NonEmptyString),
});
/** Waits for a submitted agent run to complete or time out. */
const AgentWaitParamsSchema = closedObject({
  runId: NonEmptyString,
  timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
});
/** Wake request from external schedulers or devices into an agent session. */
const WakeParamsSchema = Type.Object(
  {
    mode: Type.Union([Type.Literal("now"), Type.Literal("next-heartbeat")]),
    text: NonEmptyString,
    sessionKey: Type.Optional(NonEmptyString),
    /**
     * Optional agent id paired with `sessionKey`. Routes multi-agent setups
     * to the agent that owns the targeted session — closes the related half
     * of #46886 ("always routes to default agent").
     */
    agentId: Type.Optional(NonEmptyString),
  },
  { additionalProperties: true },
);
//#endregion
//#region packages/gateway-protocol/src/schema/agents-models-skills.ts
/**
 * Agent, model, skill, and tool catalog schemas.
 *
 * These contracts back dashboard selectors, agent management, model catalogs,
 * skill upload/install flows, skill workshop proposals, and effective tool
 * discovery. Keep public request/result schemas documented because they are
 * shared by gateway RPC, CLI, and UI clients.
 */
/** Model option shown in selectors and model catalog results. */
const ModelChoiceSchema = closedObject({
  id: NonEmptyString,
  name: NonEmptyString,
  provider: NonEmptyString,
  alias: Type.Optional(NonEmptyString),
  available: Type.Optional(Type.Boolean()),
  contextWindow: Type.Optional(Type.Integer({ minimum: 1 })),
  reasoning: Type.Optional(Type.Boolean()),
  apiKeySupported: Type.Optional(Type.Boolean()),
  input: Type.Optional(
    Type.Array(
      Type.Union([
        Type.Literal("text"),
        Type.Literal("image"),
        Type.Literal("audio"),
        Type.Literal("video"),
        Type.Literal("document"),
      ]),
    ),
  ),
});
/** Condensed agent record returned by list APIs. */
const AgentSummarySchema = closedObject({
  id: NonEmptyString,
  name: Type.Optional(NonEmptyString),
  identity: Type.Optional(
    closedObject({
      name: Type.Optional(NonEmptyString),
      theme: Type.Optional(NonEmptyString),
      emoji: Type.Optional(NonEmptyString),
      avatar: Type.Optional(NonEmptyString),
      avatarUrl: Type.Optional(NonEmptyString),
    }),
  ),
  workspace: Type.Optional(NonEmptyString),
  workspaceGit: Type.Optional(Type.Boolean()),
  model: Type.Optional(
    closedObject({
      primary: Type.Optional(NonEmptyString),
      fallbacks: Type.Optional(Type.Array(NonEmptyString)),
    }),
  ),
  agentRuntime: Type.Optional(
    closedObject({
      id: NonEmptyString,
      fallback: Type.Optional(Type.Union([Type.Literal("openclaw"), Type.Literal("none")])),
      source: Type.Union([
        Type.Literal("env"),
        Type.Literal("agent"),
        Type.Literal("defaults"),
        Type.Literal("model"),
        Type.Literal("provider"),
        Type.Literal("implicit"),
      ]),
    }),
  ),
  thinkingLevels: Type.Optional(
    Type.Array(
      closedObject({
        id: NonEmptyString,
        label: NonEmptyString,
      }),
    ),
  ),
  thinkingOptions: Type.Optional(Type.Array(NonEmptyString)),
  thinkingDefault: Type.Optional(NonEmptyString),
});
/** Empty request payload for listing configured agents. */
const AgentsListParamsSchema = closedObject({});
/** Agent list result including the default agent and session scoping mode. */
const AgentsListResultSchema = closedObject({
  defaultId: NonEmptyString,
  mainKey: NonEmptyString,
  scope: Type.Union([Type.Literal("per-sender"), Type.Literal("global")]),
  agents: Type.Array(AgentSummarySchema),
});
/** Creates a configured agent with workspace, identity, and optional model. */
const AgentsCreateParamsSchema = closedObject({
  name: NonEmptyString,
  workspace: NonEmptyString,
  model: Type.Optional(NonEmptyString),
  emoji: Type.Optional(Type.String()),
  avatar: Type.Optional(Type.String()),
});
/** Result returned after creating an agent. */
const AgentsCreateResultSchema = closedObject({
  ok: Type.Literal(true),
  agentId: NonEmptyString,
  name: NonEmptyString,
  workspace: NonEmptyString,
  model: Type.Optional(NonEmptyString),
});
/** Updates mutable agent identity, workspace, and model fields. */
const AgentsUpdateParamsSchema = closedObject({
  agentId: NonEmptyString,
  name: Type.Optional(NonEmptyString),
  workspace: Type.Optional(NonEmptyString),
  model: Type.Optional(NonEmptyString),
  emoji: Type.Optional(Type.String()),
  avatar: Type.Optional(Type.String()),
});
/** Result returned after updating an agent. */
const AgentsUpdateResultSchema = closedObject({
  ok: Type.Literal(true),
  agentId: NonEmptyString,
});
/** Deletes an agent and optionally its workspace/config files. */
const AgentsDeleteParamsSchema = closedObject({
  agentId: NonEmptyString,
  deleteFiles: Type.Optional(Type.Boolean()),
});
/** Result returned after deleting an agent and unbinding sessions. */
const AgentsDeleteResultSchema = closedObject({
  ok: Type.Literal(true),
  agentId: NonEmptyString,
  removedBindings: Type.Integer({ minimum: 0 }),
});
/** File metadata and optional content for agent-local editable files. */
const AgentsFileEntrySchema = closedObject({
  name: NonEmptyString,
  path: NonEmptyString,
  missing: Type.Boolean(),
  size: Type.Optional(Type.Integer({ minimum: 0 })),
  updatedAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
  content: Type.Optional(Type.String()),
});
/** Lists editable files for one agent. */
const AgentsFilesListParamsSchema = closedObject({ agentId: NonEmptyString });
/** Editable file list for an agent workspace. */
const AgentsFilesListResultSchema = closedObject({
  agentId: NonEmptyString,
  workspace: NonEmptyString,
  files: Type.Array(AgentsFileEntrySchema),
});
/** Reads one editable agent file by name. */
const AgentsFilesGetParamsSchema = closedObject({
  agentId: NonEmptyString,
  name: NonEmptyString,
});
/** Result for reading one editable agent file. */
const AgentsFilesGetResultSchema = closedObject({
  agentId: NonEmptyString,
  workspace: NonEmptyString,
  file: AgentsFileEntrySchema,
});
/** Writes one editable agent file. */
const AgentsFilesSetParamsSchema = closedObject({
  agentId: NonEmptyString,
  name: NonEmptyString,
  content: Type.String(),
});
/** Result returned after writing an editable agent file. */
const AgentsFilesSetResultSchema = closedObject({
  ok: Type.Literal(true),
  agentId: NonEmptyString,
  workspace: NonEmptyString,
  file: AgentsFileEntrySchema,
});
/** Model catalog request with optional visibility scope. */
const ModelsListParamsSchema = closedObject({
  includeProviderCapabilities: Type.Optional(Type.Boolean()),
  view: Type.Optional(
    Type.Union([
      Type.Literal("default"),
      Type.Literal("configured"),
      Type.Literal("provider-config"),
      Type.Literal("all"),
    ]),
  ),
});
closedObject({ models: Type.Array(ModelChoiceSchema) });
/** Runs a bounded live credential probe for one model provider. */
const ModelsProbeParamsSchema = closedObject({
  provider: NonEmptyString,
  profileId: Type.Optional(NonEmptyString),
  timeoutMs: Type.Optional(Type.Integer({ minimum: 1 })),
});
const AuthProbeStatusSchema = Type.Union([
  Type.Literal("ok"),
  Type.Literal("auth"),
  Type.Literal("rate_limit"),
  Type.Literal("billing"),
  Type.Literal("timeout"),
  Type.Literal("format"),
  Type.Literal("unknown"),
  Type.Literal("no_model"),
]);
/** Secret-free result for one provider credential target. */
const ModelsProbeTargetResultSchema = closedObject({
  profileId: Type.Optional(NonEmptyString),
  label: NonEmptyString,
  status: AuthProbeStatusSchema,
  latencyMs: Type.Optional(Type.Integer({ minimum: 0 })),
  error: Type.Optional(Type.String()),
});
/** Provider-level live probe rollup plus per-credential results. */
const ModelsProbeResultSchema = closedObject({
  provider: NonEmptyString,
  status: AuthProbeStatusSchema,
  latencyMs: Type.Optional(Type.Integer({ minimum: 0 })),
  error: Type.Optional(Type.String()),
  results: Type.Array(ModelsProbeTargetResultSchema),
});
/** Reads installed skill status, optionally for a selected agent. */
const SkillsStatusParamsSchema = closedObject({ agentId: Type.Optional(NonEmptyString) });
/** Empty request payload for listing available skill bins. */
const SkillsBinsParamsSchema = closedObject({});
closedObject({ bins: Type.Array(NonEmptyString) });
const Sha256String = Type.String({
  minLength: 64,
  maxLength: 64,
  pattern: "^[a-fA-F0-9]{64}$",
});
const SkillUploadIdempotencyKeyString = Type.String({
  minLength: 1,
  maxLength: 2048,
});
const SkillUploadDataBase64String = Type.String({
  minLength: 1,
  maxLength: 5592408,
});
/** Starts a chunked skill archive upload. */
const SkillsUploadBeginParamsSchema = closedObject({
  kind: Type.Literal("skill-archive"),
  slug: NonEmptyString,
  sizeBytes: Type.Integer({ minimum: 1 }),
  sha256: Type.Optional(Sha256String),
  force: Type.Optional(Type.Boolean()),
  idempotencyKey: Type.Optional(SkillUploadIdempotencyKeyString),
});
/** Uploads one base64-encoded chunk for a skill archive. */
const SkillsUploadChunkParamsSchema = closedObject({
  uploadId: NonEmptyString,
  offset: Type.Integer({ minimum: 0 }),
  dataBase64: SkillUploadDataBase64String,
});
/** Commits a completed skill archive upload. */
const SkillsUploadCommitParamsSchema = closedObject({
  uploadId: NonEmptyString,
  sha256: Type.Optional(Sha256String),
});
/** Installs a skill from legacy install id, ClawHub, or uploaded archive. */
const SkillsInstallParamsSchema = Type.Union([
  closedObject({
    agentId: Type.Optional(NonEmptyString),
    name: NonEmptyString,
    installId: NonEmptyString,
    dangerouslyForceUnsafeInstall: Type.Optional(
      Type.Boolean({
        deprecated: true,
        description:
          "Deprecated compatibility field. Current servers ignore it; install policy is controlled by security.installPolicy.",
      }),
    ),
    timeoutMs: Type.Optional(Type.Integer({ minimum: 1e3 })),
  }),
  closedObject({
    agentId: Type.Optional(NonEmptyString),
    source: Type.Literal("clawhub"),
    slug: NonEmptyString,
    version: Type.Optional(NonEmptyString),
    force: Type.Optional(Type.Boolean()),
    acknowledgeClawHubRisk: Type.Optional(Type.Boolean()),
    timeoutMs: Type.Optional(Type.Integer({ minimum: 1e3 })),
  }),
  closedObject({
    agentId: Type.Optional(NonEmptyString),
    source: Type.Literal("upload"),
    uploadId: NonEmptyString,
    slug: NonEmptyString,
    force: Type.Optional(Type.Boolean()),
    sha256: Type.Optional(Sha256String),
    timeoutMs: Type.Optional(Type.Integer({ minimum: 1e3 })),
  }),
]);
/** Updates installed skill settings or refreshes ClawHub-installed skills. */
const SkillsUpdateParamsSchema = Type.Union([
  closedObject({
    skillKey: NonEmptyString,
    enabled: Type.Optional(Type.Boolean()),
    apiKey: Type.Optional(Type.String()),
    env: Type.Optional(Type.Record(NonEmptyString, Type.String())),
  }),
  closedObject({
    agentId: Type.Optional(NonEmptyString),
    source: Type.Literal("clawhub"),
    slug: Type.Optional(NonEmptyString),
    all: Type.Optional(Type.Boolean()),
    acknowledgeClawHubRisk: Type.Optional(Type.Boolean()),
  }),
]);
/** Searches the skill registry. */
const SkillsSearchParamsSchema = closedObject({
  query: Type.Optional(NonEmptyString),
  limit: Type.Optional(
    Type.Integer({
      minimum: 1,
      maximum: 100,
    }),
  ),
});
/** Ranked skill registry search results. */
const SkillsSearchResultSchema = closedObject({
  results: Type.Array(
    closedObject({
      score: Type.Number(),
      slug: NonEmptyString,
      displayName: NonEmptyString,
      summary: Type.Optional(Type.String()),
      version: Type.Optional(NonEmptyString),
      updatedAt: Type.Optional(Type.Integer()),
    }),
  ),
});
/** Reads registry detail for one skill slug. */
const SkillsDetailParamsSchema = closedObject({ slug: NonEmptyString });
/** Reads current security verdicts for configured skills. */
const SkillsSecurityVerdictsParamsSchema = closedObject({ agentId: Type.Optional(NonEmptyString) });
/** Skill registry detail, latest version, metadata, and owner info. */
const SkillsDetailResultSchema = closedObject({
  skill: Type.Union([
    closedObject({
      slug: NonEmptyString,
      displayName: NonEmptyString,
      summary: Type.Optional(Type.String()),
      tags: Type.Optional(Type.Record(NonEmptyString, Type.String())),
      channel: Type.Optional(Type.Union([Type.String(), Type.Null()])),
      isOfficial: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
      createdAt: Type.Integer(),
      updatedAt: Type.Integer(),
    }),
    Type.Null(),
  ]),
  latestVersion: Type.Optional(
    Type.Union([
      closedObject({
        version: NonEmptyString,
        createdAt: Type.Integer(),
        changelog: Type.Optional(Type.String()),
      }),
      Type.Null(),
    ]),
  ),
  metadata: Type.Optional(
    Type.Union([
      closedObject({
        os: Type.Optional(Type.Union([Type.Array(Type.String()), Type.Null()])),
        systems: Type.Optional(Type.Union([Type.Array(Type.String()), Type.Null()])),
      }),
      Type.Null(),
    ]),
  ),
  owner: Type.Optional(
    Type.Union([
      closedObject({
        handle: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
        displayName: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
        image: Type.Optional(Type.Union([Type.String(), Type.Null()])),
        official: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
        channel: Type.Optional(Type.Union([Type.String(), Type.Null()])),
        isOfficial: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
      }),
      Type.Null(),
    ]),
  ),
});
/** Security verdict report for installed/requested skills. */
const SkillsSecurityVerdictsResultSchema = closedObject({
  schema: Type.Literal("openclaw.skills.security-verdicts.v1"),
  items: Type.Array(
    closedObject({
      registry: NonEmptyString,
      ok: Type.Boolean(),
      decision: NonEmptyString,
      reasons: Type.Array(Type.String()),
      requestedSlug: NonEmptyString,
      requestedVersion: NonEmptyString,
      slug: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
      version: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
      displayName: Type.Optional(Type.Union([Type.String(), Type.Null()])),
      publisherHandle: Type.Optional(Type.Union([Type.String(), Type.Null()])),
      publisherDisplayName: Type.Optional(Type.Union([Type.String(), Type.Null()])),
      createdAt: Type.Optional(Type.Union([Type.Integer(), Type.Null()])),
      checkedAt: Type.Optional(Type.Union([Type.Integer(), Type.Null()])),
      skillUrl: Type.Optional(Type.Union([Type.String(), Type.Null()])),
      securityAuditUrl: Type.Optional(Type.Union([Type.String(), Type.Null()])),
      securityStatus: Type.Optional(Type.Union([Type.String(), Type.Null()])),
      securityPassed: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
      error: Type.Optional(
        closedObject({
          code: Type.Optional(Type.String()),
          message: Type.Optional(Type.String()),
        }),
      ),
    }),
  ),
});
/** Reads the rendered skill card for one installed skill. */
const SkillsSkillCardParamsSchema = closedObject({
  agentId: Type.Optional(NonEmptyString),
  skillKey: NonEmptyString,
});
/** Rendered skill card content and file metadata. */
const SkillsSkillCardResultSchema = closedObject({
  schema: Type.Literal("openclaw.skills.skill-card.v1"),
  skillKey: NonEmptyString,
  path: NonEmptyString,
  sizeBytes: Type.Integer({ minimum: 0 }),
  content: Type.String(),
});
const SkillProposalStatusSchema = Type.Union([
  Type.Literal("pending"),
  Type.Literal("applied"),
  Type.Literal("rejected"),
  Type.Literal("quarantined"),
  Type.Literal("stale"),
]);
/** Skill proposal operation type: new skill or update to an existing skill. */
const SkillProposalKindSchema = Type.Union([Type.Literal("create"), Type.Literal("update")]);
/** Scan state for proposed skill content before it can be applied. */
const SkillProposalScanStateSchema = Type.Union([
  Type.Literal("pending"),
  Type.Literal("clean"),
  Type.Literal("failed"),
  Type.Literal("quarantined"),
]);
/** Source that created the skill proposal record. */
const SkillProposalSourceSchema = Type.Union([
  Type.Literal("skill-workshop"),
  Type.Literal("cli"),
  Type.Literal("gateway"),
]);
const SkillProposalContentString = Type.String({
  minLength: 1,
  maxLength: 1048576,
});
/** Support file payload accepted from proposal create/revise requests. */
const SkillProposalSupportFileInputSchema = closedObject({
  path: NonEmptyString,
  content: Type.String({ maxLength: 262144 }),
});
/** Stored support file metadata, including target conflict hashes for updates. */
const SkillProposalSupportFileSchema = closedObject({
  path: NonEmptyString,
  sizeBytes: Type.Integer({
    minimum: 0,
    maximum: 262144,
  }),
  hash: Sha256String,
  targetExisted: Type.Optional(Type.Boolean()),
  targetContentHash: Type.Optional(Sha256String),
});
/** One static-scan finding against proposed skill content. */
const SkillProposalFindingSchema = closedObject({
  ruleId: NonEmptyString,
  severity: Type.Union([Type.Literal("info"), Type.Literal("warn"), Type.Literal("critical")]),
  file: NonEmptyString,
  line: Type.Integer({ minimum: 1 }),
  message: NonEmptyString,
  evidence: Type.String(),
});
/** Aggregated scan report attached to a proposal record. */
const SkillProposalScanSchema = closedObject({
  state: SkillProposalScanStateSchema,
  scannedAt: NonEmptyString,
  critical: Type.Integer({ minimum: 0 }),
  warn: Type.Integer({ minimum: 0 }),
  info: Type.Integer({ minimum: 0 }),
  findings: Type.Array(SkillProposalFindingSchema),
});
/** Skill file target that a proposal creates or updates. */
const SkillProposalTargetSchema = closedObject({
  skillName: NonEmptyString,
  skillKey: NonEmptyString,
  skillDir: NonEmptyString,
  skillFile: NonEmptyString,
  source: Type.Optional(NonEmptyString),
  currentContentHash: Type.Optional(NonEmptyString),
});
/** Optional runtime origin tying a proposal back to an agent turn. */
const SkillProposalOriginSchema = closedObject({
  agentId: Type.Optional(NonEmptyString),
  sessionKey: Type.Optional(NonEmptyString),
  runId: Type.Optional(NonEmptyString),
  messageId: Type.Optional(NonEmptyString),
});
/** Full persisted skill proposal record. */
const SkillProposalRecordSchema = closedObject({
  schema: Type.Literal("openclaw.skill-workshop.proposal.v1"),
  id: NonEmptyString,
  kind: SkillProposalKindSchema,
  status: SkillProposalStatusSchema,
  title: NonEmptyString,
  description: NonEmptyString,
  createdAt: NonEmptyString,
  updatedAt: NonEmptyString,
  createdBy: SkillProposalSourceSchema,
  origin: Type.Optional(SkillProposalOriginSchema),
  proposedVersion: NonEmptyString,
  draftFile: Type.Literal("PROPOSAL.md"),
  draftHash: NonEmptyString,
  supportFiles: Type.Optional(Type.Array(SkillProposalSupportFileSchema, { maxItems: 64 })),
  target: SkillProposalTargetSchema,
  scan: SkillProposalScanSchema,
  goal: Type.Optional(Type.String()),
  evidence: Type.Optional(Type.String()),
  appliedAt: Type.Optional(NonEmptyString),
  rejectedAt: Type.Optional(NonEmptyString),
  quarantinedAt: Type.Optional(NonEmptyString),
  staleAt: Type.Optional(NonEmptyString),
  statusReason: Type.Optional(Type.String()),
});
/** Condensed proposal manifest entry for list views. */
const SkillProposalManifestEntrySchema = closedObject({
  id: NonEmptyString,
  kind: SkillProposalKindSchema,
  status: SkillProposalStatusSchema,
  title: NonEmptyString,
  description: NonEmptyString,
  skillName: NonEmptyString,
  skillKey: NonEmptyString,
  createdAt: NonEmptyString,
  updatedAt: NonEmptyString,
  scanState: SkillProposalScanStateSchema,
});
/** Lists skill-workshop proposals for the selected agent scope. */
const SkillsProposalsListParamsSchema = closedObject({ agentId: Type.Optional(NonEmptyString) });
/** Proposal manifest response for dashboard/workshop list views. */
const SkillsProposalsListResultSchema = closedObject({
  schema: Type.Literal("openclaw.skill-workshop.proposals-manifest.v1"),
  updatedAt: NonEmptyString,
  proposals: Type.Array(SkillProposalManifestEntrySchema),
});
/** Reads a proposal record plus editable draft/support content. */
const SkillsProposalInspectParamsSchema = closedObject({
  agentId: Type.Optional(NonEmptyString),
  proposalId: NonEmptyString,
});
/** Full proposal inspection result used before apply/revise decisions. */
const SkillsProposalInspectResultSchema = closedObject({
  record: SkillProposalRecordSchema,
  content: Type.String(),
  supportFiles: Type.Optional(Type.Array(SkillProposalSupportFileInputSchema, { maxItems: 64 })),
});
/** Creates a proposal for a new skill. */
const SkillsProposalCreateParamsSchema = closedObject({
  agentId: Type.Optional(NonEmptyString),
  name: NonEmptyString,
  description: NonEmptyString,
  content: SkillProposalContentString,
  supportFiles: Type.Optional(Type.Array(SkillProposalSupportFileInputSchema, { maxItems: 64 })),
  goal: Type.Optional(Type.String()),
  evidence: Type.Optional(Type.String()),
});
/** Creates a proposal to update an existing skill. */
const SkillsProposalUpdateParamsSchema = closedObject({
  agentId: Type.Optional(NonEmptyString),
  skillName: NonEmptyString,
  description: Type.Optional(NonEmptyString),
  content: SkillProposalContentString,
  supportFiles: Type.Optional(Type.Array(SkillProposalSupportFileInputSchema, { maxItems: 64 })),
  goal: Type.Optional(Type.String()),
  evidence: Type.Optional(Type.String()),
});
/** Replaces draft content/support files for an existing proposal. */
const SkillsProposalReviseParamsSchema = closedObject({
  agentId: Type.Optional(NonEmptyString),
  proposalId: NonEmptyString,
  content: SkillProposalContentString,
  supportFiles: Type.Optional(Type.Array(SkillProposalSupportFileInputSchema, { maxItems: 64 })),
  description: Type.Optional(NonEmptyString),
  goal: Type.Optional(Type.String()),
  evidence: Type.Optional(Type.String()),
});
/** Starts an agent turn that revises a pending proposal from natural-language instructions. */
const SkillsProposalRequestRevisionParamsSchema = closedObject({
  agentId: Type.Optional(NonEmptyString),
  targetAgentId: Type.Optional(NonEmptyString),
  proposalId: NonEmptyString,
  instructions: Type.String({
    minLength: 1,
    maxLength: 32768,
  }),
  sessionKey: NonEmptyString,
  sessionId: Type.Optional(NonEmptyString),
  idempotencyKey: NonEmptyString,
});
/** Chat-run acknowledgement returned after queueing a Skill Workshop revision request. */
const SkillsProposalRequestRevisionResultSchema = Type.Object(
  {
    runId: NonEmptyString,
    status: Type.Union([
      Type.Literal("started"),
      Type.Literal("in_flight"),
      Type.Literal("ok"),
      Type.Literal("timeout"),
      Type.Literal("error"),
    ]),
  },
  { additionalProperties: true },
);
/** Shared approve/reject/quarantine action payload for one proposal. */
const SkillsProposalActionParamsSchema = closedObject({
  agentId: Type.Optional(NonEmptyString),
  proposalId: NonEmptyString,
  reason: Type.Optional(Type.String()),
});
/** Result returned after applying a skill proposal to disk. */
const SkillsProposalApplyResultSchema = closedObject({
  record: SkillProposalRecordSchema,
  targetSkillFile: NonEmptyString,
});
/** Proposal record result returned after non-apply proposal actions. */
const SkillsProposalRecordResultSchema = SkillProposalRecordSchema;
const SkillCuratorEntrySchema = closedObject({
  skillFile: NonEmptyString,
  skillKey: NonEmptyString,
  skillName: NonEmptyString,
  state: Type.Union([Type.Literal("active"), Type.Literal("stale"), Type.Literal("archived")]),
  pinned: Type.Boolean(),
  createdAtMs: Type.Number(),
  stateChangedAtMs: Type.Number(),
  lastUsedAtMs: Type.Union([Type.Number(), Type.Null()]),
  useCount: Type.Number(),
  archivedReason: Type.Union([Type.String(), Type.Null()]),
});
const SkillOverlapCandidateSchema = closedObject({
  left: NonEmptyString,
  right: NonEmptyString,
  score: Type.Number(),
});
/** Reads persisted skill lifecycle curation state. */
const SkillsCuratorStatusParamsSchema = closedObject({});
const SkillsCuratorStatusResultSchema = closedObject({
  lastAttemptAtMs: Type.Union([Type.Number(), Type.Null()]),
  lastSuccessAtMs: Type.Union([Type.Number(), Type.Null()]),
  lastError: Type.Union([Type.String(), Type.Null()]),
  counts: closedObject({
    active: Type.Number(),
    stale: Type.Number(),
    archived: Type.Number(),
  }),
  skills: Type.Array(SkillCuratorEntrySchema),
  overlaps: Type.Array(SkillOverlapCandidateSchema),
});
/** Pins, unpins, or explicitly restores one curated skill. */
const SkillsCuratorActionParamsSchema = closedObject({ skill: NonEmptyString });
const SkillsCuratorActionResultSchema = SkillCuratorEntrySchema;
/** Reads the configured tool catalog for an agent. */
const ToolsCatalogParamsSchema = closedObject({
  agentId: Type.Optional(NonEmptyString),
  includePlugins: Type.Optional(Type.Boolean()),
});
/** Reads the effective tool set for one session. */
const ToolsEffectiveParamsSchema = closedObject({
  agentId: Type.Optional(NonEmptyString),
  sessionKey: NonEmptyString,
});
/** Invokes one tool through the gateway tool dispatcher. */
const ToolsInvokeParamsSchema = closedObject({
  name: NonEmptyString,
  args: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
  sessionKey: Type.Optional(NonEmptyString),
  agentId: Type.Optional(NonEmptyString),
  confirm: Type.Optional(Type.Boolean()),
  idempotencyKey: Type.Optional(NonEmptyString),
  /**
   * Explicit operation-local marker for an authenticated direct operator.
   * Missing values remain delegated, and agent runtime identity wins server-side.
   */
  conversationReadOrigin: Type.Optional(Type.Literal("direct-operator")),
});
/** Tool profile shown in catalog views. */
const ToolCatalogProfileSchema = closedObject({
  id: Type.Union([
    Type.Literal("minimal"),
    Type.Literal("coding"),
    Type.Literal("messaging"),
    Type.Literal("full"),
  ]),
  label: NonEmptyString,
});
/** Tool catalog entry before session-specific filtering is applied. */
const ToolCatalogEntrySchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  description: Type.String(),
  source: Type.Union([Type.Literal("core"), Type.Literal("plugin")]),
  pluginId: Type.Optional(NonEmptyString),
  optional: Type.Optional(Type.Boolean()),
  risk: Type.Optional(
    Type.Union([Type.Literal("low"), Type.Literal("medium"), Type.Literal("high")]),
  ),
  tags: Type.Optional(Type.Array(NonEmptyString)),
  defaultProfiles: Type.Array(
    Type.Union([
      Type.Literal("minimal"),
      Type.Literal("coding"),
      Type.Literal("messaging"),
      Type.Literal("full"),
    ]),
  ),
});
/** Group of related catalog tools from core or a plugin. */
const ToolCatalogGroupSchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  source: Type.Union([Type.Literal("core"), Type.Literal("plugin")]),
  pluginId: Type.Optional(NonEmptyString),
  tools: Type.Array(ToolCatalogEntrySchema),
});
closedObject({
  agentId: NonEmptyString,
  profiles: Type.Array(ToolCatalogProfileSchema),
  groups: Type.Array(ToolCatalogGroupSchema),
});
/** Effective tool entry after session/profile/channel/plugin filtering. */
const ToolsEffectiveEntrySchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  description: Type.String(),
  rawDescription: Type.String(),
  source: Type.Union([
    Type.Literal("core"),
    Type.Literal("plugin"),
    Type.Literal("channel"),
    Type.Literal("mcp"),
  ]),
  pluginId: Type.Optional(NonEmptyString),
  channelId: Type.Optional(NonEmptyString),
  risk: Type.Optional(
    Type.Union([Type.Literal("low"), Type.Literal("medium"), Type.Literal("high")]),
  ),
  tags: Type.Optional(Type.Array(NonEmptyString)),
});
/** Effective tool group shown to runtime/session callers. */
const ToolsEffectiveGroupSchema = closedObject({
  id: Type.Union([
    Type.Literal("core"),
    Type.Literal("plugin"),
    Type.Literal("channel"),
    Type.Literal("mcp"),
  ]),
  label: NonEmptyString,
  source: Type.Union([
    Type.Literal("core"),
    Type.Literal("plugin"),
    Type.Literal("channel"),
    Type.Literal("mcp"),
  ]),
  tools: Type.Array(ToolsEffectiveEntrySchema),
});
/** Notice explaining runtime filtering such as quarantined tool schemas. */
const ToolsEffectiveNoticeSchema = closedObject({
  id: NonEmptyString,
  severity: Type.Union([Type.Literal("info"), Type.Literal("warning")]),
  message: Type.String(),
});
closedObject({
  agentId: NonEmptyString,
  profile: NonEmptyString,
  groups: Type.Array(ToolsEffectiveGroupSchema),
  notices: Type.Optional(Type.Array(ToolsEffectiveNoticeSchema)),
});
/** Normalized error shape for tool invocation failures. */
const ToolsInvokeErrorSchema = closedObject({
  code: NonEmptyString,
  message: NonEmptyString,
  details: Type.Optional(Type.Unknown()),
});
closedObject({
  ok: Type.Boolean(),
  toolName: NonEmptyString,
  output: Type.Optional(Type.Unknown()),
  requiresApproval: Type.Optional(Type.Boolean()),
  approvalId: Type.Optional(NonEmptyString),
  source: Type.Optional(
    Type.Union([
      Type.Literal("core"),
      Type.Literal("plugin"),
      Type.Literal("mcp"),
      Type.Literal("channel"),
      Type.String(),
    ]),
  ),
  error: Type.Optional(ToolsInvokeErrorSchema),
});
//#endregion
//#region packages/gateway-protocol/src/schema/agents-workspace.ts
/**
 * Read-only agent workspace browsing schemas.
 *
 * These contracts back the workspace file browser in operator clients
 * (mobile apps, Control UI). The surface is intentionally read-only:
 * write/delete/upload stay out of this namespace until a separately
 * reviewed mutation contract exists.
 */
/** One file or folder in an agent workspace directory listing. */
const AgentsWorkspaceEntrySchema = closedObject({
  path: NonEmptyString,
  name: NonEmptyString,
  kind: Type.Union([Type.Literal("file"), Type.Literal("directory")]),
  size: Type.Optional(Type.Integer({ minimum: 0 })),
  updatedAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
});
/** Lists one directory of an agent workspace. */
const AgentsWorkspaceListParamsSchema = closedObject({
  agentId: NonEmptyString,
  path: Type.Optional(Type.String()),
  offset: Type.Optional(Type.Integer({ minimum: 0 })),
  limit: Type.Optional(Type.Integer({ minimum: 1 })),
});
/** Paginated directory listing rooted at the agent workspace. */
const AgentsWorkspaceListResultSchema = closedObject({
  agentId: NonEmptyString,
  path: Type.String(),
  parentPath: Type.Optional(Type.String()),
  entries: Type.Array(AgentsWorkspaceEntrySchema),
  totalEntries: Type.Integer({ minimum: 0 }),
  offset: Type.Integer({ minimum: 0 }),
});
/** One workspace file preview payload (UTF-8 text or base64 image). */
const AgentsWorkspaceFileSchema = closedObject({
  path: NonEmptyString,
  name: NonEmptyString,
  size: Type.Integer({ minimum: 0 }),
  updatedAtMs: Type.Integer({ minimum: 0 }),
  mimeType: NonEmptyString,
  encoding: Type.Union([Type.Literal("utf8"), Type.Literal("base64")]),
  content: Type.String(),
});
/** Reads one workspace file by workspace-relative path. */
const AgentsWorkspaceGetParamsSchema = closedObject({
  agentId: NonEmptyString,
  path: NonEmptyString,
});
/** Result for reading one workspace file. */
const AgentsWorkspaceGetResultSchema = closedObject({
  agentId: NonEmptyString,
  file: AgentsWorkspaceFileSchema,
});
//#endregion
//#region packages/gateway-protocol/src/schema/artifacts.ts
/**
 * Artifact lookup and download protocol schemas.
 *
 * Artifacts are files or payloads produced by sessions, runs, tasks, or agents;
 * these schemas keep lookup filters explicit and download results transport-safe.
 */
const ArtifactQueryParamsProperties = {
  sessionKey: Type.Optional(NonEmptyString),
  runId: Type.Optional(NonEmptyString),
  taskId: Type.Optional(NonEmptyString),
  agentId: Type.Optional(NonEmptyString),
};
/** Shared artifact filter payload used by list-style requests. */
const ArtifactQueryParamsSchema = closedObject(ArtifactQueryParamsProperties);
/** Artifact lookup payload with a required artifact id plus optional scope filters. */
const ArtifactGetParamsSchema = closedObject({
  ...ArtifactQueryParamsProperties,
  artifactId: NonEmptyString,
});
/** Public artifact metadata returned before or alongside download data. */
const ArtifactSummarySchema = closedObject({
  id: NonEmptyString,
  type: NonEmptyString,
  title: NonEmptyString,
  mimeType: Type.Optional(NonEmptyString),
  sizeBytes: Type.Optional(Type.Integer({ minimum: 0 })),
  sessionKey: Type.Optional(NonEmptyString),
  runId: Type.Optional(NonEmptyString),
  taskId: Type.Optional(NonEmptyString),
  messageSeq: Type.Optional(Type.Integer({ minimum: 1 })),
  source: Type.Optional(NonEmptyString),
  download: closedObject({
    mode: Type.Union([Type.Literal("bytes"), Type.Literal("url"), Type.Literal("unsupported")]),
  }),
});
/** List request payload for artifacts visible in the selected scope. */
const ArtifactsListParamsSchema = ArtifactQueryParamsSchema;
closedObject({ artifacts: Type.Array(ArtifactSummarySchema) });
/** Get request payload for one artifact summary. */
const ArtifactsGetParamsSchema = ArtifactGetParamsSchema;
closedObject({ artifact: ArtifactSummarySchema });
/** Download request payload for one artifact. */
const ArtifactsDownloadParamsSchema = ArtifactGetParamsSchema;
closedObject({
  artifact: ArtifactSummarySchema,
  encoding: Type.Optional(Type.Literal("base64")),
  data: Type.Optional(Type.String()),
  url: Type.Optional(NonEmptyString),
});
//#endregion
//#region packages/gateway-protocol/src/schema/audit-activity.ts
const AuditActivitySchemaVersionV1Schema = Type.Integer({
  minimum: 1,
  maximum: 1,
});
const AuditActivityStatusV1Schema = Type.Union([
  Type.Literal("started"),
  Type.Literal("succeeded"),
  Type.Literal("failed"),
  Type.Literal("cancelled"),
  Type.Literal("timed_out"),
  Type.Literal("blocked"),
  Type.Literal("unknown"),
]);
const AuditActivityKindV1Schema = Type.Union([
  Type.Literal("agent_run"),
  Type.Literal("tool_action"),
  Type.Literal("message"),
]);
const AuditActivityDirectionV1Schema = Type.Union([
  Type.Literal("inbound"),
  Type.Literal("outbound"),
]);
const AuditActivityConversationKindV1Schema = Type.Union([
  Type.Literal("direct"),
  Type.Literal("group"),
  Type.Literal("channel"),
  Type.Literal("unknown"),
]);
const AuditActivityHmacRefV1Schema = Type.String({
  pattern: "^hmac-sha256:v1:[a-f0-9]{32}:[a-f0-9]{64}$",
});
const AuditActivityAgentActorV1Schema = closedObject({
  type: Type.Union([Type.Literal("agent"), Type.Literal("system")]),
  id: NonEmptyString,
});
const AuditActivityInboundActorV1Schema = Type.Union([
  closedObject({
    type: Type.Literal("channel_sender"),
    id: AuditActivityHmacRefV1Schema,
  }),
  closedObject({
    type: Type.Literal("system"),
    id: NonEmptyString,
  }),
]);
const AuditActivityOutboundActorV1Schema = closedObject({
  type: Type.Union([Type.Literal("agent"), Type.Literal("system")]),
  id: NonEmptyString,
});
const commonProperties = {
  schemaVersion: AuditActivitySchemaVersionV1Schema,
  eventId: NonEmptyString,
  sequence: Type.Integer({ minimum: 1 }),
  sourceSequence: Type.Integer({ minimum: 1 }),
  occurredAt: Type.Integer({ minimum: 0 }),
  redaction: Type.Literal("metadata_only"),
};
const agentProperties = {
  actor: AuditActivityAgentActorV1Schema,
  agentId: NonEmptyString,
  sessionKey: Type.Optional(NonEmptyString),
  sessionId: Type.Optional(NonEmptyString),
  runId: NonEmptyString,
};
const messageProperties = {
  channel: NonEmptyString,
  conversationKind: AuditActivityConversationKindV1Schema,
  durationMs: Type.Optional(Type.Integer({ minimum: 0 })),
  resultCount: Type.Optional(Type.Integer({ minimum: 0 })),
  agentId: Type.Optional(NonEmptyString),
  runId: Type.Optional(NonEmptyString),
  accountRef: Type.Optional(AuditActivityHmacRefV1Schema),
  conversationRef: Type.Optional(AuditActivityHmacRefV1Schema),
  messageRef: Type.Optional(AuditActivityHmacRefV1Schema),
  targetRef: Type.Optional(AuditActivityHmacRefV1Schema),
};
function correlatedObject(properties, variants) {
  return Type.Object(properties, {
    additionalProperties: false,
    allOf: [variants],
  });
}
function withoutField(field) {
  return { not: { required: [field] } };
}
const withoutErrorCode = withoutField("errorCode");
const withoutReasonCode = withoutField("reasonCode");
const withoutFailureStage = withoutField("failureStage");
const withoutDeliveryKind = withoutField("deliveryKind");
/** V1 agent-run activity record. */
const AuditActivityAgentRunV1Schema = correlatedObject(
  {
    eventType: Type.Literal("agent_run"),
    ...commonProperties,
    ...agentProperties,
    kind: Type.Literal("agent_run"),
    action: Type.Union([Type.Literal("agent.run.started"), Type.Literal("agent.run.finished")]),
    status: Type.Union([
      Type.Literal("started"),
      Type.Literal("succeeded"),
      Type.Literal("failed"),
      Type.Literal("cancelled"),
      Type.Literal("timed_out"),
      Type.Literal("blocked"),
    ]),
    errorCode: Type.Optional(
      Type.Union([
        Type.Literal("run_failed"),
        Type.Literal("run_cancelled"),
        Type.Literal("run_timed_out"),
        Type.Literal("run_blocked"),
      ]),
    ),
  },
  Type.Union([
    Type.Intersect([
      Type.Object({
        action: Type.Literal("agent.run.started"),
        status: Type.Literal("started"),
      }),
      withoutErrorCode,
    ]),
    Type.Intersect([
      Type.Object({
        action: Type.Literal("agent.run.finished"),
        status: Type.Literal("succeeded"),
      }),
      withoutErrorCode,
    ]),
    Type.Object({
      action: Type.Literal("agent.run.finished"),
      status: Type.Literal("failed"),
      errorCode: Type.Literal("run_failed"),
    }),
    Type.Object({
      action: Type.Literal("agent.run.finished"),
      status: Type.Literal("cancelled"),
      errorCode: Type.Literal("run_cancelled"),
    }),
    Type.Object({
      action: Type.Literal("agent.run.finished"),
      status: Type.Literal("timed_out"),
      errorCode: Type.Literal("run_timed_out"),
    }),
    Type.Object({
      action: Type.Literal("agent.run.finished"),
      status: Type.Literal("blocked"),
      errorCode: Type.Literal("run_blocked"),
    }),
  ]),
);
/** V1 tool-action activity record. */
const AuditActivityToolActionV1Schema = correlatedObject(
  {
    eventType: Type.Literal("tool_action"),
    ...commonProperties,
    ...agentProperties,
    kind: Type.Literal("tool_action"),
    toolCallId: Type.Optional(NonEmptyString),
    toolName: Type.Optional(NonEmptyString),
    action: Type.Union([Type.Literal("tool.action.started"), Type.Literal("tool.action.finished")]),
    status: AuditActivityStatusV1Schema,
    errorCode: Type.Optional(
      Type.Union([
        Type.Literal("tool_failed"),
        Type.Literal("tool_cancelled"),
        Type.Literal("tool_timed_out"),
        Type.Literal("tool_blocked"),
        Type.Literal("tool_outcome_unknown"),
      ]),
    ),
  },
  Type.Union([
    Type.Intersect([
      Type.Object({
        action: Type.Literal("tool.action.started"),
        status: Type.Literal("started"),
      }),
      withoutErrorCode,
    ]),
    Type.Intersect([
      Type.Object({
        action: Type.Literal("tool.action.finished"),
        status: Type.Literal("succeeded"),
      }),
      withoutErrorCode,
    ]),
    Type.Object({
      action: Type.Literal("tool.action.finished"),
      status: Type.Literal("failed"),
      errorCode: Type.Literal("tool_failed"),
    }),
    Type.Object({
      action: Type.Literal("tool.action.finished"),
      status: Type.Literal("cancelled"),
      errorCode: Type.Literal("tool_cancelled"),
    }),
    Type.Object({
      action: Type.Literal("tool.action.finished"),
      status: Type.Literal("timed_out"),
      errorCode: Type.Literal("tool_timed_out"),
    }),
    Type.Object({
      action: Type.Literal("tool.action.finished"),
      status: Type.Literal("blocked"),
      errorCode: Type.Literal("tool_blocked"),
    }),
    Type.Object({
      action: Type.Literal("tool.action.finished"),
      status: Type.Literal("unknown"),
      errorCode: Type.Literal("tool_outcome_unknown"),
    }),
  ]),
);
const inboundMessageProperties = {
  eventType: Type.Literal("inbound_message"),
  ...commonProperties,
  ...messageProperties,
  kind: Type.Literal("message"),
  action: Type.Literal("message.inbound.processed"),
  direction: Type.Literal("inbound"),
  actor: AuditActivityInboundActorV1Schema,
};
const inboundCompletedReasonSchema = Type.Union([
  Type.Literal("fast_abort"),
  Type.Literal("plugin_bound_handled"),
  Type.Literal("plugin_bound_unavailable"),
  Type.Literal("plugin_bound_declined"),
  Type.Literal("before_dispatch_handled"),
  Type.Literal("acp_dispatch_completed"),
  Type.Literal("acp_dispatch_empty"),
]);
const inboundSkippedReasonSchema = Type.Union([
  Type.Literal("duplicate"),
  Type.Literal("reply_operation_active"),
  Type.Literal("reply_operation_aborted"),
  Type.Literal("acp_dispatch_aborted"),
]);
/** V1 inbound-message activity record. */
const inboundFailureReasonSchema = Type.Union([
  Type.Literal("acp_dispatch_failed"),
  Type.Literal("plugin_bound_error"),
]);
const AuditActivityInboundMessageV1Schema = correlatedObject(
  {
    ...inboundMessageProperties,
    status: Type.Union([
      Type.Literal("succeeded"),
      Type.Literal("blocked"),
      Type.Literal("failed"),
    ]),
    outcome: Type.Union([
      Type.Literal("completed"),
      Type.Literal("skipped"),
      Type.Literal("failed"),
    ]),
    errorCode: Type.Optional(Type.Literal("message_processing_failed")),
    reasonCode: Type.Optional(
      Type.Union([
        ...inboundCompletedReasonSchema.anyOf,
        ...inboundSkippedReasonSchema.anyOf,
        ...inboundFailureReasonSchema.anyOf,
      ]),
    ),
  },
  Type.Union([
    Type.Intersect([
      Type.Object({
        status: Type.Literal("succeeded"),
        outcome: Type.Literal("completed"),
        reasonCode: Type.Optional(inboundCompletedReasonSchema),
      }),
      withoutErrorCode,
    ]),
    Type.Intersect([
      Type.Object({
        status: Type.Literal("blocked"),
        outcome: Type.Literal("skipped"),
        reasonCode: Type.Optional(inboundSkippedReasonSchema),
      }),
      withoutErrorCode,
    ]),
    Type.Object({
      status: Type.Literal("failed"),
      outcome: Type.Literal("failed"),
      errorCode: Type.Literal("message_processing_failed"),
      reasonCode: Type.Optional(inboundFailureReasonSchema),
    }),
  ]),
);
const outboundMessageProperties = {
  eventType: Type.Literal("outbound_message"),
  ...commonProperties,
  ...messageProperties,
  kind: Type.Literal("message"),
  action: Type.Literal("message.outbound.finished"),
  direction: Type.Literal("outbound"),
  actor: AuditActivityOutboundActorV1Schema,
  deliveryKind: Type.Optional(
    Type.Union([Type.Literal("text"), Type.Literal("media"), Type.Literal("other")]),
  ),
};
const outboundSuppressedReasonSchema = Type.Union([
  Type.Literal("cancelled_by_message_sending_hook"),
  Type.Literal("cancelled_by_reply_payload_sending_hook"),
  Type.Literal("empty_after_message_sending_hook"),
  Type.Literal("empty_after_reply_payload_sending_hook"),
  Type.Literal("no_visible_payload"),
]);
const outboundFailureStageSchema = Type.Union([
  Type.Literal("platform_send"),
  Type.Literal("queue"),
  Type.Literal("unknown"),
]);
/** V1 outbound-message activity record. */
const outboundFailureErrorSchema = Type.Union([
  Type.Literal("message_delivery_failed"),
  Type.Literal("message_delivery_partial_failure"),
]);
const AuditActivityOutboundMessageV1Schema = correlatedObject(
  {
    ...outboundMessageProperties,
    status: Type.Union([
      Type.Literal("succeeded"),
      Type.Literal("blocked"),
      Type.Literal("failed"),
      Type.Literal("unknown"),
    ]),
    outcome: Type.Union([
      Type.Literal("sent"),
      Type.Literal("suppressed"),
      Type.Literal("failed"),
      Type.Literal("unknown"),
    ]),
    errorCode: Type.Optional(outboundFailureErrorSchema),
    reasonCode: Type.Optional(outboundSuppressedReasonSchema),
    failureStage: Type.Optional(outboundFailureStageSchema),
  },
  Type.Union([
    Type.Intersect([
      Type.Object({
        status: Type.Literal("succeeded"),
        outcome: Type.Literal("sent"),
      }),
      withoutErrorCode,
      withoutReasonCode,
      withoutFailureStage,
    ]),
    Type.Intersect([
      Type.Object({
        status: Type.Literal("blocked"),
        outcome: Type.Literal("suppressed"),
        reasonCode: outboundSuppressedReasonSchema,
      }),
      withoutErrorCode,
      withoutFailureStage,
      withoutDeliveryKind,
    ]),
    Type.Intersect([
      Type.Object({
        status: Type.Literal("failed"),
        outcome: Type.Literal("failed"),
        errorCode: outboundFailureErrorSchema,
        failureStage: outboundFailureStageSchema,
      }),
      withoutReasonCode,
    ]),
    Type.Intersect([
      Type.Object({
        status: Type.Literal("unknown"),
        outcome: Type.Literal("unknown"),
        failureStage: outboundFailureStageSchema,
      }),
      withoutErrorCode,
      withoutReasonCode,
      withoutDeliveryKind,
    ]),
  ]),
);
/** Discriminated V1 activity record union. */
const AuditActivityEventV1Schema = Type.Union([
  AuditActivityAgentRunV1Schema,
  AuditActivityToolActionV1Schema,
  AuditActivityInboundMessageV1Schema,
  AuditActivityOutboundMessageV1Schema,
]);
/** Bounded newest-first V1 activity query filters. */
const AuditActivityListParamsSchema = closedObject({
  agentId: Type.Optional(NonEmptyString),
  sessionKey: Type.Optional(NonEmptyString),
  runId: Type.Optional(NonEmptyString),
  kind: Type.Optional(AuditActivityKindV1Schema),
  status: Type.Optional(AuditActivityStatusV1Schema),
  direction: Type.Optional(AuditActivityDirectionV1Schema),
  channel: Type.Optional(NonEmptyString),
  after: Type.Optional(Type.Integer({ minimum: 0 })),
  before: Type.Optional(Type.Integer({ minimum: 0 })),
  limit: Type.Optional(
    Type.Integer({
      minimum: 1,
      maximum: 500,
    }),
  ),
  cursor: Type.Optional(NonEmptyString),
});
/** Stable sequence-cursor V1 activity page. */
const AuditActivityListResultSchema = closedObject({
  events: Type.Array(AuditActivityEventV1Schema),
  nextCursor: Type.Optional(NonEmptyString),
});
//#endregion
//#region packages/gateway-protocol/src/schema/audit.ts
const AuditEventKindSchema = Type.Union([Type.Literal("agent_run"), Type.Literal("tool_action")]);
const AuditEventActionSchema = Type.Union([
  Type.Literal("agent.run.started"),
  Type.Literal("agent.run.finished"),
  Type.Literal("tool.action.started"),
  Type.Literal("tool.action.finished"),
]);
const AuditEventStatusSchema = Type.Union([
  Type.Literal("started"),
  Type.Literal("succeeded"),
  Type.Literal("failed"),
  Type.Literal("cancelled"),
  Type.Literal("timed_out"),
  Type.Literal("blocked"),
  Type.Literal("unknown"),
]);
const AuditEventErrorCodeSchema = Type.Union([
  Type.Literal("run_failed"),
  Type.Literal("run_cancelled"),
  Type.Literal("run_timed_out"),
  Type.Literal("run_blocked"),
  Type.Literal("tool_failed"),
  Type.Literal("tool_cancelled"),
  Type.Literal("tool_timed_out"),
  Type.Literal("tool_blocked"),
  Type.Literal("tool_outcome_unknown"),
]);
/** One content-free run/tool audit record. */
const AuditEventSchema = closedObject({
  eventId: NonEmptyString,
  sequence: Type.Integer({ minimum: 1 }),
  sourceSequence: Type.Integer({ minimum: 1 }),
  occurredAt: Type.Integer({ minimum: 0 }),
  kind: AuditEventKindSchema,
  action: AuditEventActionSchema,
  status: AuditEventStatusSchema,
  errorCode: Type.Optional(AuditEventErrorCodeSchema),
  actor: closedObject({
    type: Type.Union([Type.Literal("agent"), Type.Literal("system")]),
    id: NonEmptyString,
  }),
  agentId: NonEmptyString,
  sessionKey: Type.Optional(NonEmptyString),
  sessionId: Type.Optional(NonEmptyString),
  runId: NonEmptyString,
  toolCallId: Type.Optional(NonEmptyString),
  toolName: Type.Optional(NonEmptyString),
  redaction: Type.Literal("metadata_only"),
});
/** Bounded newest-first audit query filters. */
const AuditListParamsSchema = closedObject({
  agentId: Type.Optional(NonEmptyString),
  sessionKey: Type.Optional(NonEmptyString),
  runId: Type.Optional(NonEmptyString),
  kind: Type.Optional(AuditEventKindSchema),
  status: Type.Optional(AuditEventStatusSchema),
  after: Type.Optional(Type.Integer({ minimum: 0 })),
  before: Type.Optional(Type.Integer({ minimum: 0 })),
  limit: Type.Optional(
    Type.Integer({
      minimum: 1,
      maximum: 500,
    }),
  ),
  cursor: Type.Optional(NonEmptyString),
});
/** Stable sequence-cursor page suitable for bounded JSON export. */
const AuditListResultSchema = closedObject({
  events: Type.Array(AuditEventSchema),
  nextCursor: Type.Optional(NonEmptyString),
});
//#endregion
//#region packages/gateway-protocol/src/schema/channels.ts
/**
 * Channel and Talk protocol schemas.
 *
 * Talk schemas are consumed by browser realtime clients, gateway relay sessions,
 * and channel adapters, so the mode/transport/brain unions below are shared
 * API vocabulary rather than provider-local implementation details.
 */
/** Toggles Talk mode for the gateway, with an optional rollout phase marker. */
const TalkModeParamsSchema = closedObject({
  enabled: Type.Boolean(),
  phase: Type.Optional(Type.String()),
});
/** Reads Talk configuration; secrets are included only for trusted callers. */
const TalkConfigParamsSchema = closedObject({ includeSecrets: Type.Optional(Type.Boolean()) });
/** One-shot text-to-speech request with provider-specific voice tuning knobs. */
const TalkSpeakParamsSchema = closedObject({
  text: NonEmptyString,
  voiceId: Type.Optional(Type.String()),
  modelId: Type.Optional(Type.String()),
  outputFormat: Type.Optional(Type.String()),
  speed: Type.Optional(Type.Number()),
  rateWpm: Type.Optional(Type.Integer({ minimum: 1 })),
  stability: Type.Optional(Type.Number()),
  similarity: Type.Optional(Type.Number()),
  style: Type.Optional(Type.Number()),
  speakerBoost: Type.Optional(Type.Boolean()),
  seed: Type.Optional(Type.Integer({ minimum: 0 })),
  normalize: Type.Optional(Type.String()),
  language: Type.Optional(Type.String()),
  latencyTier: Type.Optional(Type.Integer({ minimum: 0 })),
});
/**
 * One-shot text-to-speech request rendered with the configured TTS provider
 * chain (unlike `talk.speak`, which pins the Talk-mode provider).
 */
const TtsSpeakParamsSchema = closedObject({ text: NonEmptyString });
/** Supported Talk session shapes exposed to clients and providers. */
const TalkModeSchema = Type.Union([
  Type.Literal("realtime"),
  Type.Literal("stt-tts"),
  Type.Literal("transcription"),
]);
/** Transport families; browser clients branch on this value to choose setup flow. */
const TalkTransportSchema = Type.Union([
  Type.Literal("webrtc"),
  Type.Literal("provider-websocket"),
  Type.Literal("gateway-relay"),
  Type.Literal("managed-room"),
]);
/** How a Talk session delegates reasoning/tool use to the agent runtime. */
const TalkBrainSchema = Type.Union([
  Type.Literal("agent-consult"),
  Type.Literal("direct-tools"),
  Type.Literal("none"),
]);
/** Agent control actions accepted from Talk clients and managed rooms. */
const TalkAgentControlModeSchema = Type.Union([
  Type.Literal("status"),
  Type.Literal("steer"),
  Type.Literal("cancel"),
  Type.Literal("followup"),
]);
/** Stable event names emitted by Talk sessions across providers/transports. */
const TalkEventTypeSchema = Type.Union([
  Type.Literal("session.started"),
  Type.Literal("session.ready"),
  Type.Literal("session.closed"),
  Type.Literal("session.error"),
  Type.Literal("session.replaced"),
  Type.Literal("turn.started"),
  Type.Literal("turn.ended"),
  Type.Literal("turn.cancelled"),
  Type.Literal("capture.started"),
  Type.Literal("capture.stopped"),
  Type.Literal("capture.cancelled"),
  Type.Literal("capture.once"),
  Type.Literal("input.audio.delta"),
  Type.Literal("input.audio.committed"),
  Type.Literal("transcript.delta"),
  Type.Literal("transcript.done"),
  Type.Literal("output.text.delta"),
  Type.Literal("output.text.done"),
  Type.Literal("output.audio.started"),
  Type.Literal("output.audio.delta"),
  Type.Literal("output.audio.done"),
  Type.Literal("tool.call"),
  Type.Literal("tool.progress"),
  Type.Literal("tool.result"),
  Type.Literal("tool.error"),
  Type.Literal("usage.metrics"),
  Type.Literal("latency.metrics"),
  Type.Literal("health.changed"),
]);
/** Event types that must carry a turn id for client-side stream correlation. */
const TURN_SCOPED_TALK_EVENT_TYPES = [
  "turn.started",
  "turn.ended",
  "turn.cancelled",
  "input.audio.delta",
  "input.audio.committed",
  "transcript.delta",
  "transcript.done",
  "output.text.delta",
  "output.text.done",
  "output.audio.started",
  "output.audio.delta",
  "output.audio.done",
  "tool.call",
  "tool.progress",
  "tool.result",
  "tool.error",
];
/** Capture lifecycle events must include capture id to avoid cross-turn ambiguity. */
const CAPTURE_SCOPED_TALK_EVENT_TYPES = [
  "capture.started",
  "capture.stopped",
  "capture.cancelled",
  "capture.once",
];
/** Builds JSON Schema conditional requirements while avoiding reserved word syntax. */
function requireJsonSchemaProperties(properties) {
  const conditionalRequirementKey = ["th", "en"].join("");
  return Object.fromEntries([[conditionalRequirementKey, { required: properties }]]);
}
/** Canonical Talk event envelope emitted to browser, relay, and channel consumers. */
const TalkEventSchema = Type.Object(
  {
    id: NonEmptyString,
    type: TalkEventTypeSchema,
    sessionId: NonEmptyString,
    turnId: Type.Optional(Type.String()),
    captureId: Type.Optional(Type.String()),
    seq: Type.Integer({ minimum: 1 }),
    timestamp: NonEmptyString,
    mode: TalkModeSchema,
    transport: TalkTransportSchema,
    brain: TalkBrainSchema,
    provider: Type.Optional(Type.String()),
    final: Type.Optional(Type.Boolean()),
    callId: Type.Optional(Type.String()),
    itemId: Type.Optional(Type.String()),
    parentId: Type.Optional(Type.String()),
    payload: Type.Unknown(),
  },
  {
    additionalProperties: false,
    allOf: [
      {
        if: {
          properties: { type: { enum: TURN_SCOPED_TALK_EVENT_TYPES } },
          required: ["type"],
        },
        ...requireJsonSchemaProperties(["turnId"]),
      },
      {
        if: {
          properties: { type: { enum: CAPTURE_SCOPED_TALK_EVENT_TYPES } },
          required: ["type"],
        },
        ...requireJsonSchemaProperties(["captureId"]),
      },
    ],
  },
);
/** Creates a browser-facing Talk client session. */
const TalkClientCreateParamsSchema = closedObject({
  sessionKey: Type.Optional(Type.String()),
  provider: Type.Optional(Type.String()),
  model: Type.Optional(Type.String()),
  voice: Type.Optional(Type.String()),
  vadThreshold: Type.Optional(Type.Number()),
  silenceDurationMs: Type.Optional(Type.Integer({ minimum: 1 })),
  prefixPaddingMs: Type.Optional(Type.Integer({ minimum: 0 })),
  reasoningEffort: Type.Optional(Type.String()),
  mode: Type.Optional(TalkModeSchema),
  transport: Type.Optional(TalkTransportSchema),
  brain: Type.Optional(TalkBrainSchema),
});
/** Tool-call request from a browser/client session back into the agent runtime. */
const TalkClientToolCallParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  callId: NonEmptyString,
  name: NonEmptyString,
  args: Type.Optional(Type.Unknown()),
  relaySessionId: Type.Optional(NonEmptyString),
});
/** Agent run identity returned after accepting a Talk client tool call. */
const TalkClientToolCallResultSchema = closedObject({
  runId: NonEmptyString,
  idempotencyKey: NonEmptyString,
});
/** Text steering request for a Talk session bound to an agent turn. */
const TalkClientSteerParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  text: NonEmptyString,
  mode: Type.Optional(TalkAgentControlModeSchema),
});
/** Result of applying agent control to an embedded or reply-backed Talk run. */
const TalkAgentControlResultSchema = closedObject({
  ok: Type.Boolean(),
  mode: TalkAgentControlModeSchema,
  sessionKey: NonEmptyString,
  sessionId: Type.Optional(NonEmptyString),
  active: Type.Boolean(),
  queued: Type.Optional(Type.Boolean()),
  aborted: Type.Optional(Type.Boolean()),
  target: Type.Optional(Type.Union([Type.Literal("embedded_run"), Type.Literal("reply_run")])),
  reason: Type.Optional(Type.String()),
  message: Type.String(),
  speak: Type.Boolean(),
  show: Type.Boolean(),
  suppress: Type.Boolean(),
  providerResult: Type.Optional(
    closedObject({
      status: Type.Literal("cancelled"),
      message: Type.String(),
    }),
  ),
  enqueuedAtMs: Type.Optional(Type.Number()),
  deliveredAtMs: Type.Optional(Type.Number()),
});
/** Joins an existing managed-room Talk session. */
const TalkSessionJoinParamsSchema = closedObject({
  sessionId: NonEmptyString,
  token: NonEmptyString,
});
/** Creates a gateway-managed Talk session for realtime, transcription, or relay use. */
const TalkSessionCreateParamsSchema = closedObject({
  sessionKey: Type.Optional(Type.String()),
  spawnedBy: Type.Optional(NonEmptyString),
  provider: Type.Optional(Type.String()),
  model: Type.Optional(Type.String()),
  voice: Type.Optional(Type.String()),
  vadThreshold: Type.Optional(Type.Number()),
  silenceDurationMs: Type.Optional(Type.Integer({ minimum: 1 })),
  prefixPaddingMs: Type.Optional(Type.Integer({ minimum: 0 })),
  reasoningEffort: Type.Optional(Type.String()),
  mode: Type.Optional(TalkModeSchema),
  transport: Type.Optional(TalkTransportSchema),
  brain: Type.Optional(TalkBrainSchema),
  ttlMs: Type.Optional(
    Type.Integer({
      minimum: 1e3,
      maximum: 36e5,
    }),
  ),
});
/** Appends base64 audio to an active Talk session. */
const TalkSessionAppendAudioParamsSchema = closedObject({
  sessionId: NonEmptyString,
  audioBase64: NonEmptyString,
  timestamp: Type.Optional(Type.Number()),
});
/** Starts or advances a Talk turn within a session. */
const TalkSessionTurnParamsSchema = closedObject({
  sessionId: NonEmptyString,
  turnId: Type.Optional(Type.String()),
});
/** Cancels the active or named Talk turn. */
const TalkSessionCancelTurnParamsSchema = closedObject({
  sessionId: NonEmptyString,
  turnId: Type.Optional(Type.String()),
  reason: Type.Optional(Type.String()),
});
/** Cancels currently streaming Talk output without necessarily ending the turn. */
const TalkSessionCancelOutputParamsSchema = closedObject({
  sessionId: NonEmptyString,
  turnId: Type.Optional(Type.String()),
  reason: Type.Optional(Type.String()),
});
/** Submits a tool result back to a Talk provider session. */
const TalkSessionSubmitToolResultParamsSchema = closedObject({
  sessionId: NonEmptyString,
  callId: NonEmptyString,
  result: Type.Unknown(),
  options: Type.Optional(
    closedObject({
      suppressResponse: Type.Optional(Type.Boolean()),
      willContinue: Type.Optional(Type.Boolean()),
    }),
  ),
});
/** Steers a managed Talk session by session id rather than transcript key. */
const TalkSessionSteerParamsSchema = closedObject({
  sessionId: NonEmptyString,
  sessionKey: Type.Optional(NonEmptyString),
  text: NonEmptyString,
  mode: Type.Optional(TalkAgentControlModeSchema),
});
/** Closes a gateway-managed Talk session. */
const TalkSessionCloseParamsSchema = closedObject({ sessionId: NonEmptyString });
/** Mutable room state returned when a client joins a managed Talk room. */
const TalkSessionManagedRoomStateSchema = closedObject({
  activeClientId: Type.Optional(Type.String()),
  activeTurnId: Type.Optional(Type.String()),
  recentTalkEvents: Type.Array(TalkEventSchema),
});
/** Managed-room session record shared with browser clients. */
const TalkSessionManagedRoomRecordSchema = closedObject({
  id: NonEmptyString,
  roomId: NonEmptyString,
  roomUrl: NonEmptyString,
  sessionKey: NonEmptyString,
  sessionId: Type.Optional(Type.String()),
  channel: Type.Optional(Type.String()),
  target: Type.Optional(Type.String()),
  provider: Type.Optional(Type.String()),
  model: Type.Optional(Type.String()),
  voice: Type.Optional(Type.String()),
  mode: TalkModeSchema,
  transport: TalkTransportSchema,
  brain: TalkBrainSchema,
  createdAt: Type.Number(),
  expiresAt: Type.Number(),
  room: TalkSessionManagedRoomStateSchema,
});
/** Empty request payload for reading configured Talk provider capabilities. */
const TalkCatalogParamsSchema = closedObject({});
/** One provider entry in the Talk capability catalog. */
const TalkCatalogProviderSchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  configured: Type.Boolean(),
  aliases: Type.Optional(Type.Array(NonEmptyString)),
  models: Type.Optional(Type.Array(Type.String())),
  voices: Type.Optional(Type.Array(Type.String())),
  defaultModel: Type.Optional(Type.String()),
  modes: Type.Optional(Type.Array(TalkModeSchema)),
  transports: Type.Optional(Type.Array(TalkTransportSchema)),
  brains: Type.Optional(Type.Array(TalkBrainSchema)),
  inputAudioFormats: Type.Optional(
    Type.Array(
      closedObject({
        encoding: Type.Union([Type.Literal("pcm16"), Type.Literal("g711_ulaw")]),
        sampleRateHz: Type.Integer({ minimum: 1 }),
        channels: Type.Integer({ minimum: 1 }),
      }),
    ),
  ),
  outputAudioFormats: Type.Optional(
    Type.Array(
      closedObject({
        encoding: Type.Union([Type.Literal("pcm16"), Type.Literal("g711_ulaw")]),
        sampleRateHz: Type.Integer({ minimum: 1 }),
        channels: Type.Integer({ minimum: 1 }),
      }),
    ),
  ),
  supportsBrowserSession: Type.Optional(Type.Boolean()),
  supportsBargeIn: Type.Optional(Type.Boolean()),
  supportsToolCalls: Type.Optional(Type.Boolean()),
  supportsVideoFrames: Type.Optional(Type.Boolean()),
  supportsSessionResumption: Type.Optional(Type.Boolean()),
});
/** Active provider plus all candidates for a Talk capability family. */
const TalkCatalogProviderGroupSchema = closedObject({
  ready: Type.Optional(Type.Boolean()),
  activeProvider: Type.Optional(Type.String()),
  providers: Type.Array(TalkCatalogProviderSchema),
});
/** Provider, mode, transport, and audio-format catalog returned to clients. */
const TalkCatalogResultSchema = closedObject({
  modes: Type.Array(TalkModeSchema),
  transports: Type.Array(TalkTransportSchema),
  brains: Type.Array(TalkBrainSchema),
  speech: TalkCatalogProviderGroupSchema,
  transcription: TalkCatalogProviderGroupSchema,
  realtime: TalkCatalogProviderGroupSchema,
});
/** Audio format contract for realtime browser sessions. */
const BrowserRealtimeAudioContractSchema = closedObject({
  inputEncoding: Type.Union([Type.Literal("pcm16"), Type.Literal("g711_ulaw")]),
  inputSampleRateHz: Type.Integer({ minimum: 1 }),
  outputEncoding: Type.Union([Type.Literal("pcm16"), Type.Literal("g711_ulaw")]),
  outputSampleRateHz: Type.Integer({ minimum: 1 }),
});
/** Session creation result with transport-specific ids and credentials. */
const TalkSessionCreateResultSchema = closedObject({
  sessionId: NonEmptyString,
  provider: Type.Optional(Type.String()),
  mode: TalkModeSchema,
  transport: TalkTransportSchema,
  brain: TalkBrainSchema,
  relaySessionId: Type.Optional(NonEmptyString),
  transcriptionSessionId: Type.Optional(NonEmptyString),
  handoffId: Type.Optional(NonEmptyString),
  roomId: Type.Optional(NonEmptyString),
  roomUrl: Type.Optional(NonEmptyString),
  token: Type.Optional(NonEmptyString),
  audio: Type.Optional(Type.Unknown()),
  model: Type.Optional(Type.String()),
  voice: Type.Optional(Type.String()),
  expiresAt: Type.Optional(Type.Number()),
});
/** Result for a Talk turn request, optionally including emitted events. */
const TalkSessionTurnResultSchema = closedObject({
  ok: Type.Boolean(),
  turnId: Type.Optional(Type.String()),
  events: Type.Optional(Type.Array(TalkEventSchema)),
});
/** Managed-room record returned to clients after joining an existing Talk session. */
const TalkSessionJoinResultSchema = TalkSessionManagedRoomRecordSchema;
/** Generic success result for Talk session lifecycle calls. */
const TalkSessionOkResultSchema = closedObject({ ok: Type.Boolean() });
/** Browser WebRTC setup payload using provider SDP exchange. */
const BrowserRealtimeWebRtcSdpSessionSchema = closedObject({
  provider: NonEmptyString,
  transport: Type.Literal("webrtc"),
  clientSecret: NonEmptyString,
  offerUrl: Type.Optional(Type.String()),
  offerHeaders: Type.Optional(Type.Record(Type.String(), Type.String())),
  model: Type.Optional(Type.String()),
  voice: Type.Optional(Type.String()),
  expiresAt: Type.Optional(Type.Number()),
});
/** Browser websocket setup payload with JSON/PCM audio contract. */
const BrowserRealtimeJsonPcmWebSocketSessionSchema = closedObject({
  provider: NonEmptyString,
  transport: Type.Literal("provider-websocket"),
  protocol: NonEmptyString,
  clientSecret: NonEmptyString,
  websocketUrl: NonEmptyString,
  audio: BrowserRealtimeAudioContractSchema,
  initialMessage: Type.Optional(Type.Unknown()),
  model: Type.Optional(Type.String()),
  voice: Type.Optional(Type.String()),
  expiresAt: Type.Optional(Type.Number()),
});
/** Browser setup payload for gateway-relayed realtime audio. */
const BrowserRealtimeGatewayRelaySessionSchema = closedObject({
  provider: NonEmptyString,
  transport: Type.Literal("gateway-relay"),
  relaySessionId: NonEmptyString,
  audio: BrowserRealtimeAudioContractSchema,
  model: Type.Optional(Type.String()),
  voice: Type.Optional(Type.String()),
  expiresAt: Type.Optional(Type.Number()),
});
/** Browser setup payload for managed-room Talk sessions. */
const BrowserRealtimeManagedRoomSessionSchema = closedObject({
  provider: NonEmptyString,
  transport: Type.Literal("managed-room"),
  roomUrl: NonEmptyString,
  token: Type.Optional(Type.String()),
  model: Type.Optional(Type.String()),
  voice: Type.Optional(Type.String()),
  expiresAt: Type.Optional(Type.Number()),
});
/** Union of all browser Talk session setup payloads. */
const TalkClientCreateResultSchema = Type.Union([
  BrowserRealtimeWebRtcSdpSessionSchema,
  BrowserRealtimeJsonPcmWebSocketSessionSchema,
  BrowserRealtimeGatewayRelaySessionSchema,
  BrowserRealtimeManagedRoomSessionSchema,
]);
/** Secret-bearing provider fields; extra provider options remain provider-owned. */
const talkProviderFieldSchemas = { apiKey: Type.Optional(SecretInputSchema) };
/** Per-provider Talk config bag. */
const TalkProviderConfigSchema = Type.Object(talkProviderFieldSchemas, {
  additionalProperties: true,
});
/** Realtime Talk defaults and provider selection stored in config. */
const TalkRealtimeConfigSchema = closedObject({
  provider: Type.Optional(Type.String()),
  providers: Type.Optional(Type.Record(Type.String(), TalkProviderConfigSchema)),
  model: Type.Optional(Type.String()),
  speakerVoice: Type.Optional(Type.String()),
  speakerVoiceId: Type.Optional(Type.String()),
  voice: Type.Optional(Type.String()),
  instructions: Type.Optional(Type.String()),
  mode: Type.Optional(TalkModeSchema),
  transport: Type.Optional(TalkTransportSchema),
  vadThreshold: Type.Optional(
    Type.Number({
      minimum: 0,
      maximum: 1,
    }),
  ),
  silenceDurationMs: Type.Optional(Type.Integer({ minimum: 1 })),
  prefixPaddingMs: Type.Optional(Type.Integer({ minimum: 0 })),
  reasoningEffort: Type.Optional(Type.String({ minLength: 1 })),
  brain: Type.Optional(TalkBrainSchema),
  consultRouting: Type.Optional(
    Type.Union([Type.Literal("provider-direct"), Type.Literal("force-agent-consult")]),
  ),
});
/** Resolved active Talk provider plus its normalized provider config. */
const ResolvedTalkConfigSchema = closedObject({
  provider: Type.String(),
  config: TalkProviderConfigSchema,
});
/** Talk config subtree returned through gateway config APIs. */
const TalkConfigSchema = closedObject({
  provider: Type.Optional(Type.String()),
  providers: Type.Optional(Type.Record(Type.String(), TalkProviderConfigSchema)),
  realtime: Type.Optional(TalkRealtimeConfigSchema),
  resolved: Type.Optional(ResolvedTalkConfigSchema),
  consultThinkingLevel: Type.Optional(Type.String()),
  consultFastMode: Type.Optional(Type.Boolean()),
  speechLocale: Type.Optional(Type.String()),
  interruptOnSpeech: Type.Optional(Type.Boolean()),
  silenceTimeoutMs: Type.Optional(Type.Integer({ minimum: 1 })),
});
/** Full Talk config read result, including related session/UI context. */
const TalkConfigResultSchema = closedObject({
  config: closedObject({
    talk: Type.Optional(TalkConfigSchema),
    session: Type.Optional(closedObject({ mainKey: Type.Optional(Type.String()) })),
    ui: Type.Optional(closedObject({ seamColor: Type.Optional(Type.String()) })),
  }),
});
/** Text-to-speech result with encoded audio and provider output metadata. */
const TalkSpeakResultSchema = closedObject({
  audioBase64: NonEmptyString,
  provider: NonEmptyString,
  outputFormat: Type.Optional(Type.String()),
  voiceCompatible: Type.Optional(Type.Boolean()),
  mimeType: Type.Optional(Type.String()),
  fileExtension: Type.Optional(Type.String()),
});
/** Text-to-speech result for `tts.speak` with encoded audio and provider metadata. */
const TtsSpeakResultSchema = closedObject({
  audioBase64: NonEmptyString,
  provider: NonEmptyString,
  outputFormat: Type.Optional(Type.String()),
  mimeType: Type.Optional(Type.String()),
  fileExtension: Type.Optional(Type.String()),
});
/** Channel status request, optionally probing one channel before returning. */
const ChannelsStatusParamsSchema = closedObject({
  probe: Type.Optional(Type.Boolean()),
  timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
  channel: Type.Optional(NonEmptyString),
});
/**
 * Per-account status snapshot for channel docking.
 *
 * This is intentionally schema-light so new channel-specific metadata can ship
 * without a gateway protocol update; known fields stay documented for UI use.
 */
const ChannelAccountSnapshotSchema = Type.Object(
  {
    accountId: NonEmptyString,
    name: Type.Optional(Type.String()),
    enabled: Type.Optional(Type.Boolean()),
    configured: Type.Optional(Type.Boolean()),
    linked: Type.Optional(Type.Boolean()),
    running: Type.Optional(Type.Boolean()),
    connected: Type.Optional(Type.Boolean()),
    reconnectAttempts: Type.Optional(Type.Integer({ minimum: 0 })),
    lastConnectedAt: Type.Optional(Type.Integer({ minimum: 0 })),
    lastError: Type.Optional(Type.String()),
    healthState: Type.Optional(Type.String()),
    lastStartAt: Type.Optional(Type.Integer({ minimum: 0 })),
    lastStopAt: Type.Optional(Type.Integer({ minimum: 0 })),
    lastInboundAt: Type.Optional(Type.Integer({ minimum: 0 })),
    lastOutboundAt: Type.Optional(Type.Integer({ minimum: 0 })),
    lastTransportActivityAt: Type.Optional(Type.Integer({ minimum: 0 })),
    busy: Type.Optional(Type.Boolean()),
    activeRuns: Type.Optional(Type.Integer({ minimum: 0 })),
    lastRunActivityAt: Type.Optional(Type.Integer({ minimum: 0 })),
    lastProbeAt: Type.Optional(Type.Integer({ minimum: 0 })),
    mode: Type.Optional(Type.String()),
    dmPolicy: Type.Optional(Type.String()),
    allowFrom: Type.Optional(Type.Array(Type.String())),
    tokenSource: Type.Optional(Type.String()),
    botTokenSource: Type.Optional(Type.String()),
    appTokenSource: Type.Optional(Type.String()),
    baseUrl: Type.Optional(Type.String()),
    allowUnmentionedGroups: Type.Optional(Type.Boolean()),
    cliPath: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    dbPath: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    port: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
    probe: Type.Optional(Type.Unknown()),
    audit: Type.Optional(Type.Unknown()),
    application: Type.Optional(Type.Unknown()),
  },
  { additionalProperties: true },
);
/** UI label and icon metadata for one channel. */
const ChannelUiMetaSchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  detailLabel: NonEmptyString,
  systemImage: Type.Optional(Type.String()),
});
/** Event-loop health snapshot included with channel status responses. */
const ChannelEventLoopHealthSchema = closedObject({
  degraded: Type.Boolean(),
  reasons: Type.Array(
    Type.Union([
      Type.Literal("event_loop_delay"),
      Type.Literal("event_loop_utilization"),
      Type.Literal("cpu"),
    ]),
  ),
  intervalMs: Type.Integer({ minimum: 0 }),
  delayP99Ms: Type.Number({ minimum: 0 }),
  delayMaxMs: Type.Number({ minimum: 0 }),
  utilization: Type.Number({ minimum: 0 }),
  cpuCoreRatio: Type.Number({ minimum: 0 }),
});
/** Full channel status result for dashboard and operator diagnostics. */
const ChannelsStatusResultSchema = closedObject({
  ts: Type.Integer({ minimum: 0 }),
  channelOrder: Type.Array(NonEmptyString),
  channelLabels: Type.Record(NonEmptyString, NonEmptyString),
  channelDetailLabels: Type.Optional(Type.Record(NonEmptyString, NonEmptyString)),
  channelSystemImages: Type.Optional(Type.Record(NonEmptyString, NonEmptyString)),
  channelMeta: Type.Optional(Type.Array(ChannelUiMetaSchema)),
  channels: Type.Record(NonEmptyString, Type.Unknown()),
  channelAccounts: Type.Record(NonEmptyString, Type.Array(ChannelAccountSnapshotSchema)),
  channelDefaultAccountId: Type.Record(NonEmptyString, NonEmptyString),
  eventLoop: Type.Optional(ChannelEventLoopHealthSchema),
  partial: Type.Optional(Type.Boolean()),
  warnings: Type.Optional(Type.Array(Type.String())),
});
/** Logs out one channel account. */
const ChannelsLogoutParamsSchema = closedObject({
  channel: NonEmptyString,
  accountId: Type.Optional(Type.String()),
});
/** Stops one channel account runtime. */
const ChannelsStopParamsSchema = closedObject({
  channel: NonEmptyString,
  accountId: Type.Optional(Type.String()),
});
/** Starts one channel account runtime. */
const ChannelsStartParamsSchema = closedObject({
  channel: NonEmptyString,
  accountId: Type.Optional(Type.String()),
});
/** Starts browser/web login for a channel account. */
const WebLoginStartParamsSchema = closedObject({
  force: Type.Optional(Type.Boolean()),
  timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
  verbose: Type.Optional(Type.Boolean()),
  accountId: Type.Optional(Type.String()),
});
const QrDataUrlSchema = Type.String({
  maxLength: 16384,
  pattern: "^data:image/png;base64,",
});
/** Waits for web login completion or the next QR code. */
const WebLoginWaitParamsSchema = closedObject({
  timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
  accountId: Type.Optional(Type.String()),
  currentQrDataUrl: Type.Optional(QrDataUrlSchema),
});
//#endregion
//#region packages/gateway-protocol/src/schema/talk-marks.ts
/** Acknowledges playback through a named realtime provider mark. */
const TalkSessionAcknowledgeMarkParamsSchema = closedObject({
  sessionId: NonEmptyString,
  markName: NonEmptyString,
});
/** Maximum command description length accepted in catalog entries. */
const COMMAND_DESCRIPTION_MAX_LENGTH = 2e3;
const BoundedNonEmptyString = (maxLength) =>
  Type.String({
    minLength: 1,
    maxLength,
  });
/** Source system that contributed a command. */
const CommandSourceSchema = Type.Union([
  Type.Literal("native"),
  Type.Literal("skill"),
  Type.Literal("plugin"),
]);
/** Surfaces where a command may be invoked. */
const CommandScopeSchema = Type.Union([
  Type.Literal("text"),
  Type.Literal("native"),
  Type.Literal("both"),
]);
/** Coarse UI grouping for command catalog display. */
const CommandCategorySchema = Type.Union([
  Type.Literal("session"),
  Type.Literal("options"),
  Type.Literal("status"),
  Type.Literal("management"),
  Type.Literal("media"),
  Type.Literal("tools"),
  Type.Literal("docks"),
]);
/** Static argument choice shown to clients. */
const CommandArgChoiceSchema = closedObject({
  value: Type.String({ maxLength: 200 }),
  label: Type.String({ maxLength: 200 }),
});
/** One typed argument advertised for a command. */
const CommandArgSchema = closedObject({
  name: BoundedNonEmptyString(200),
  description: Type.String({ maxLength: 500 }),
  type: Type.Union([Type.Literal("string"), Type.Literal("number"), Type.Literal("boolean")]),
  required: Type.Optional(Type.Boolean()),
  choices: Type.Optional(Type.Array(CommandArgChoiceSchema, { maxItems: 50 })),
  dynamic: Type.Optional(Type.Boolean()),
});
/** One command catalog entry visible to clients. */
const CommandEntrySchema = closedObject({
  name: BoundedNonEmptyString(200),
  nativeName: Type.Optional(BoundedNonEmptyString(200)),
  textAliases: Type.Optional(Type.Array(BoundedNonEmptyString(200), { maxItems: 20 })),
  description: Type.String({ maxLength: COMMAND_DESCRIPTION_MAX_LENGTH }),
  category: Type.Optional(CommandCategorySchema),
  source: CommandSourceSchema,
  scope: CommandScopeSchema,
  acceptsArgs: Type.Boolean(),
  args: Type.Optional(Type.Array(CommandArgSchema, { maxItems: 20 })),
});
/** Command catalog request filters. */
const CommandsListParamsSchema = closedObject({
  agentId: Type.Optional(NonEmptyString),
  provider: Type.Optional(NonEmptyString),
  scope: Type.Optional(CommandScopeSchema),
  includeArgs: Type.Optional(Type.Boolean()),
});
/** Bounded command catalog response. */
const CommandsListResultSchema = closedObject({
  commands: Type.Array(CommandEntrySchema, { maxItems: 500 }),
});
//#endregion
//#region packages/gateway-protocol/src/schema/config.ts
/**
 * Gateway config and update protocol schemas.
 *
 * These payloads carry raw config text plus optional delivery context so the
 * gateway can report edits/restarts back to the originating channel.
 */
const ConfigSchemaLookupPathString = Type.String({
  minLength: 1,
  maxLength: 1024,
  pattern: "^[A-Za-z0-9_./\\[\\]\\-*]+$",
});
const ConfigDeliveryContextSchema = closedObject({
  channel: Type.Optional(Type.String()),
  to: Type.Optional(Type.String()),
  accountId: Type.Optional(Type.String()),
  threadId: Type.Optional(Type.Union([Type.String(), Type.Number()])),
});
/** Empty request payload for reading the current raw config. */
const ConfigGetParamsSchema = closedObject({});
/** Full raw config replacement request with optional base hash guard. */
const ConfigSetParamsSchema = closedObject({
  raw: NonEmptyString,
  baseHash: Type.Optional(NonEmptyString),
});
/** Shared config apply/patch payload with optional restart notification context. */
const ConfigApplyLikeParamProperties = {
  raw: NonEmptyString,
  baseHash: Type.Optional(NonEmptyString),
  sessionKey: Type.Optional(Type.String()),
  deliveryContext: Type.Optional(ConfigDeliveryContextSchema),
  note: Type.Optional(Type.String()),
  restartDelayMs: Type.Optional(Type.Integer({ minimum: 0 })),
};
/** Raw config apply request that may schedule a restart. */
const ConfigApplyParamsSchema = closedObject(ConfigApplyLikeParamProperties);
/** Raw config patch request that may schedule a restart. */
const ConfigPatchParamsSchema = closedObject({
  ...ConfigApplyLikeParamProperties,
  replacePaths: Type.Optional(Type.Array(NonEmptyString, { maxItems: 256 })),
});
/** Empty request payload for fetching the generated config schema. */
const ConfigSchemaParamsSchema = closedObject({});
/** Schema lookup request for one config path. */
const ConfigSchemaLookupParamsSchema = closedObject({ path: ConfigSchemaLookupPathString });
/** Empty request payload for checking update/restart status. */
const UpdateStatusParamsSchema = closedObject({});
/** Request payload for running an update/restart flow with optional channel delivery context. */
const UpdateRunParamsSchema = closedObject({
  sessionKey: Type.Optional(Type.String()),
  deliveryContext: Type.Optional(ConfigDeliveryContextSchema),
  note: Type.Optional(Type.String()),
  continuationMessage: Type.Optional(Type.String()),
  restartDelayMs: Type.Optional(Type.Integer({ minimum: 0 })),
  timeoutMs: Type.Optional(Type.Integer({ minimum: 1 })),
});
/** UI metadata attached to config schema paths. */
const ConfigUiHintSchema = closedObject({
  label: Type.Optional(Type.String()),
  help: Type.Optional(Type.String()),
  tags: Type.Optional(Type.Array(Type.String())),
  group: Type.Optional(Type.String()),
  order: Type.Optional(Type.Integer()),
  advanced: Type.Optional(Type.Boolean()),
  sensitive: Type.Optional(Type.Boolean()),
  placeholder: Type.Optional(Type.String()),
  itemTemplate: Type.Optional(Type.Unknown()),
});
/** Full generated config schema response. */
const ConfigSchemaResponseSchema = closedObject({
  schema: Type.Unknown(),
  uiHints: Type.Record(Type.String(), ConfigUiHintSchema),
  version: NonEmptyString,
  generatedAt: NonEmptyString,
});
/** Child entry returned when looking up a config schema path. */
const ConfigSchemaLookupChildSchema = closedObject({
  key: NonEmptyString,
  path: NonEmptyString,
  type: Type.Optional(Type.Union([Type.String(), Type.Array(Type.String())])),
  required: Type.Boolean(),
  hasChildren: Type.Boolean(),
  reloadKind: Type.Optional(
    Type.Union([Type.Literal("restart"), Type.Literal("hot"), Type.Literal("none")]),
  ),
  hint: Type.Optional(ConfigUiHintSchema),
  hintPath: Type.Optional(Type.String()),
});
/** Schema lookup response for one config path and its immediate children. */
const ConfigSchemaLookupResultSchema = closedObject({
  path: NonEmptyString,
  schema: Type.Unknown(),
  reloadKind: Type.Optional(
    Type.Union([Type.Literal("restart"), Type.Literal("hot"), Type.Literal("none")]),
  ),
  hint: Type.Optional(ConfigUiHintSchema),
  hintPath: Type.Optional(Type.String()),
  children: Type.Array(ConfigSchemaLookupChildSchema),
});
//#endregion
//#region packages/gateway-protocol/src/schema/wizard.ts
/** Runtime state reported for gateway-driven setup wizard sessions. */
const WizardRunStatusSchema = Type.Union([
  Type.Literal("running"),
  Type.Literal("done"),
  Type.Literal("cancelled"),
  Type.Literal("error"),
]);
/** Starts a setup wizard, optionally scoped to a local or remote workspace. */
const WizardStartParamsSchema = closedObject({
  mode: Type.Optional(Type.Union([Type.Literal("local"), Type.Literal("remote")])),
  workspace: Type.Optional(Type.String()),
  flow: Type.Optional(Type.Union([Type.Literal("setup"), Type.Literal("channels")])),
  channel: Type.Optional(NonEmptyString),
});
/** Client answer payload for the current wizard step. */
const WizardAnswerSchema = closedObject({
  stepId: NonEmptyString,
  value: Type.Optional(Type.Unknown()),
});
/** Advances a wizard session, with an answer when the previous step requested input. */
const WizardNextParamsSchema = closedObject({
  sessionId: NonEmptyString,
  answer: Type.Optional(WizardAnswerSchema),
});
/** Shared session-id-only params for cancel and status requests. */
const WizardSessionIdParamsSchema = closedObject({ sessionId: NonEmptyString });
/** Cancels an active wizard session. */
const WizardCancelParamsSchema = WizardSessionIdParamsSchema;
/** Reads status for an active or recently completed wizard session. */
const WizardStatusParamsSchema = WizardSessionIdParamsSchema;
/** Selectable value shown in a choice-based wizard step. */
const WizardStepOptionSchema = closedObject({
  value: Type.Unknown(),
  label: NonEmptyString,
  hint: Type.Optional(Type.String()),
});
const WizardDeviceCodeSchema = closedObject({
  code: NonEmptyString,
  expiresInMinutes: Type.Optional(
    Type.Integer({
      minimum: 1,
      maximum: 1440,
    }),
  ),
  message: Type.Optional(Type.String()),
});
/** UI contract for one wizard step rendered by gateway clients. */
const WizardStepSchema = closedObject({
  id: NonEmptyString,
  type: Type.Union([
    Type.Literal("note"),
    Type.Literal("select"),
    Type.Literal("text"),
    Type.Literal("confirm"),
    Type.Literal("multiselect"),
    Type.Literal("progress"),
    Type.Literal("action"),
  ]),
  title: Type.Optional(Type.String()),
  message: Type.Optional(Type.String()),
  format: Type.Optional(Type.Union([Type.Literal("plain")])),
  options: Type.Optional(Type.Array(WizardStepOptionSchema)),
  initialValue: Type.Optional(Type.Unknown()),
  placeholder: Type.Optional(Type.String()),
  sensitive: Type.Optional(Type.Boolean()),
  executor: Type.Optional(Type.Union([Type.Literal("gateway"), Type.Literal("client")])),
  externalUrl: Type.Optional(Type.String()),
  deviceCode: Type.Optional(WizardDeviceCodeSchema),
});
/** Channel/account pair the channels flow actually configured. */
const WizardConfiguredAccountSchema = closedObject({
  channel: NonEmptyString,
  accountId: NonEmptyString,
});
/** Common response fields for start and next calls. */
const WizardResultFields = {
  done: Type.Boolean(),
  step: Type.Optional(WizardStepSchema),
  status: Type.Optional(WizardRunStatusSchema),
  error: Type.Optional(Type.String()),
  channels: Type.Optional(Type.Array(NonEmptyString)),
  accounts: Type.Optional(Type.Array(WizardConfiguredAccountSchema)),
};
/** Result after advancing a wizard session. */
const WizardNextResultSchema = closedObject(WizardResultFields);
/** Result returned when a wizard session is created. */
const WizardStartResultSchema = closedObject({
  sessionId: NonEmptyString,
  ...WizardResultFields,
});
/** Minimal status poll result used when the client does not need the next step. */
const WizardStatusResultSchema = closedObject({
  status: WizardRunStatusSchema,
  error: Type.Optional(Type.String()),
});
//#endregion
//#region packages/gateway-protocol/src/schema/crestodian.ts
/**
 * Crestodian chat lets clients (macOS app onboarding, future UIs) hold the
 * setup/repair conversation over the gateway. The gateway live-tests the
 * configured inference route before creating a session. Omitting `message`
 * returns the welcome/greeting for a verified fresh session without input.
 */
const CrestodianChatParamsSchema = closedObject({
  sessionId: NonEmptyString,
  message: Type.Optional(Type.String()),
  /** "onboarding" seeds the first-run setup proposal in the greeting. */
  welcomeVariant: Type.Optional(Type.Union([Type.Literal("onboarding")])),
  /** Drop any in-flight approval/wizard state and start the session over. */
  reset: Type.Optional(Type.Boolean()),
});
/** One Crestodian reply; `action` tells clients about conversation handoffs. */
const CrestodianChatResultSchema = closedObject({
  sessionId: NonEmptyString,
  reply: NonEmptyString,
  /** The next reply is a hosted-wizard secret and clients must mask its input/echo. */
  sensitive: Type.Optional(Type.Boolean()),
  action: Type.Union([Type.Literal("none"), Type.Literal("open-agent"), Type.Literal("exit")]),
});
/**
 * Structured first-run inference setup for GUI clients: detect reusable AI
 * access (CLI logins, env keys, existing config), then activate one choice.
 * Activation live-tests the candidate and persists it only on success, so a
 * client can walk the ladder candidate-by-candidate without ever leaving a
 * broken default model behind.
 */
const CrestodianSetupDetectParamsSchema = closedObject({});
const SetupInferenceKind = Type.Union([
  Type.Literal("existing-model"),
  Type.Literal("openai-api-key"),
  Type.Literal("anthropic-api-key"),
  Type.Literal("claude-cli"),
  Type.Literal("codex-cli"),
  Type.Literal("gemini-cli"),
]);
const SetupInferenceStatus = Type.Union([
  Type.Literal("ok"),
  Type.Literal("auth"),
  Type.Literal("rate_limit"),
  Type.Literal("billing"),
  Type.Literal("timeout"),
  Type.Literal("format"),
  Type.Literal("unavailable"),
  Type.Literal("unknown"),
]);
const SetupInferenceFailureStatus = Type.Union([
  Type.Literal("auth"),
  Type.Literal("rate_limit"),
  Type.Literal("billing"),
  Type.Literal("timeout"),
  Type.Literal("format"),
  Type.Literal("unavailable"),
  Type.Literal("unknown"),
]);
const CrestodianSetupDetectResultSchema = closedObject({
  candidates: Type.Array(
    closedObject({
      kind: SetupInferenceKind,
      label: NonEmptyString,
      detail: Type.String(),
      modelRef: NonEmptyString,
      recommended: Type.Boolean(),
      /** true: verified; false: definitively logged out; absent: unknown. */
      credentials: Type.Optional(Type.Boolean()),
    }),
  ),
  /** Text-inference key/token methods exposed by the Gateway provider registry. */
  manualProviders: Type.Array(
    closedObject({
      /** Opaque provider-auth choice sent back during activation. */
      id: NonEmptyString,
      label: NonEmptyString,
      hint: Type.Optional(Type.String()),
    }),
  ),
  /** Provider-owned browser and device-code login methods. */
  authOptions: Type.Optional(
    Type.Array(
      closedObject({
        id: NonEmptyString,
        label: NonEmptyString,
        hint: Type.Optional(Type.String()),
        groupLabel: Type.Optional(Type.String()),
        kind: Type.Union([Type.Literal("oauth"), Type.Literal("device-code")]),
        featured: Type.Boolean(),
      }),
    ),
  ),
  workspace: NonEmptyString,
  codexAppServerDetected: Type.Optional(Type.Boolean()),
  configuredModel: Type.Optional(Type.String()),
  setupComplete: Type.Boolean(),
});
/** Live verification of the Gateway's current default-agent inference route. */
const CrestodianSetupVerifyParamsSchema = closedObject({});
const CrestodianSetupVerifyResultSchema = Type.Union([
  closedObject({
    ok: Type.Literal(true),
    modelRef: NonEmptyString,
    latencyMs: Type.Number(),
  }),
  closedObject({
    ok: Type.Literal(false),
    status: SetupInferenceFailureStatus,
    error: NonEmptyString,
  }),
]);
const CrestodianSetupActivateParamsSchema = closedObject({
  kind: Type.Union([
    Type.Literal("existing-model"),
    Type.Literal("openai-api-key"),
    Type.Literal("anthropic-api-key"),
    Type.Literal("claude-cli"),
    Type.Literal("codex-cli"),
    Type.Literal("gemini-cli"),
    Type.Literal("api-key"),
  ]),
  /** Exact detected model for this route; prevents detect/activate drift. */
  modelRef: Type.Optional(NonEmptyString),
  /** Manual step only: opaque provider-auth choice returned by detection. */
  authChoice: Type.Optional(Type.String()),
  /** Manual step only: the pasted API key or token; masked by clients, never echoed. */
  apiKey: Type.Optional(Type.String()),
  workspace: Type.Optional(Type.String()),
});
const CrestodianSetupActivateResultSchema = closedObject({
  ok: Type.Boolean(),
  /** Present on success: the model ref that answered the live test. */
  modelRef: Type.Optional(Type.String()),
  latencyMs: Type.Optional(Type.Number()),
  /** Human-readable setup summary lines (workspace, model, gateway). */
  lines: Type.Optional(Type.Array(Type.String())),
  /** Present on failure: coarse bucket for client copy + docs links. */
  status: Type.Optional(SetupInferenceStatus),
  error: Type.Optional(Type.String()),
});
/** Starts one provider-owned interactive login as a gateway wizard session. */
const CrestodianSetupAuthStartParamsSchema = closedObject({
  /** Client-generated so cancellation remains possible if the start reply is lost. */
  sessionId: NonEmptyString,
  authChoice: NonEmptyString,
  workspace: Type.Optional(Type.String()),
});
const CrestodianSetupAuthStartResultSchema = WizardStartResultSchema;
//#endregion
//#region packages/gateway-protocol/src/schema/cron.ts
/**
 * Cron scheduler protocol schemas.
 *
 * These contracts describe scheduled agent turns, system events, delivery
 * routing, run history, and mutable job state shared by gateway RPC clients.
 */
/** Builds create/patch payload variants while preserving per-call field optionality. */
function cronAgentTurnPayloadSchema(params) {
  return closedObject({
    kind: Type.Literal("agentTurn"),
    message: params.message,
    model: Type.Optional(params.model),
    fallbacks: Type.Optional(params.fallbacks),
    thinking: Type.Optional(params.thinking),
    timeoutSeconds: Type.Optional(Type.Number({ minimum: 0 })),
    allowUnsafeExternalContent: Type.Optional(Type.Boolean()),
    lightContext: Type.Optional(Type.Boolean()),
    toolsAllow: Type.Optional(params.toolsAllow),
    toolsAllowIsDefault: Type.Optional(Type.Boolean()),
  });
}
/** Builds command payload variants while preserving create/patch argv optionality. */
function cronCommandPayloadSchema(params) {
  return closedObject({
    kind: Type.Literal("command"),
    argv: params.argv,
    cwd: Type.Optional(Type.String({ minLength: 1 })),
    env: Type.Optional(Type.Record(Type.String({ minLength: 1 }), Type.String())),
    input: Type.Optional(Type.String()),
    timeoutSeconds: Type.Optional(Type.Number({ minimum: 0 })),
    noOutputTimeoutSeconds: Type.Optional(Type.Number({ minimum: 0 })),
    outputMaxBytes: Type.Optional(Type.Integer({ minimum: 1 })),
  });
}
/** Session target accepted by cron jobs. */
const CronSessionTargetSchema = Type.Union([
  Type.Literal("main"),
  Type.Literal("isolated"),
  Type.Literal("current"),
  Type.String({ pattern: "^session:.+" }),
]);
/** Whether a cron job waits for heartbeat processing or wakes immediately. */
const CronWakeModeSchema = Type.Union([Type.Literal("next-heartbeat"), Type.Literal("now")]);
/** Run status factory reused for the active field and deprecated alias metadata. */
function cronRunStatusSchema(options = {}) {
  return Type.Union([Type.Literal("ok"), Type.Literal("error"), Type.Literal("skipped")], options);
}
const CronRunStatusSchema = cronRunStatusSchema();
const CronConfigRevisionSchema = Type.String({
  minLength: 1,
  maxLength: 128,
});
const DeprecatedCronRunStatusSchema = cronRunStatusSchema({
  deprecated: true,
  description: "Deprecated alias for lastRunStatus.",
});
const CronSortDirSchema = Type.Union([Type.Literal("asc"), Type.Literal("desc")]);
const CronJobsEnabledFilterSchema = Type.Union([
  Type.Literal("all"),
  Type.Literal("enabled"),
  Type.Literal("disabled"),
]);
const CronJobsScheduleKindFilterSchema = Type.Union([
  Type.Literal("all"),
  Type.Literal("at"),
  Type.Literal("every"),
  Type.Literal("cron"),
  Type.Literal("on-exit"),
]);
const CronJobsLastRunStatusFilterSchema = Type.Union([
  Type.Literal("all"),
  Type.Literal("ok"),
  Type.Literal("error"),
  Type.Literal("skipped"),
  Type.Literal("unknown"),
]);
const CronJobsSortBySchema = Type.Union([
  Type.Literal("nextRunAtMs"),
  Type.Literal("updatedAtMs"),
  Type.Literal("name"),
]);
const CronRunsStatusFilterSchema = Type.Union([
  Type.Literal("all"),
  Type.Literal("ok"),
  Type.Literal("error"),
  Type.Literal("skipped"),
]);
const CronRunsStatusValueSchema = Type.Union([
  Type.Literal("ok"),
  Type.Literal("error"),
  Type.Literal("skipped"),
]);
const CronDeliveryStatusSchema = Type.Union([
  Type.Literal("delivered"),
  Type.Literal("not-delivered"),
  Type.Literal("unknown"),
  Type.Literal("not-requested"),
]);
const NonBlankString = Type.String({
  minLength: 1,
  pattern: "\\S",
});
const CronDeclarationKeySchema = Type.String({
  minLength: 1,
  maxLength: 200,
  pattern: "\\S",
});
const CronDisplayNameSchema = Type.String({
  minLength: 1,
  maxLength: 200,
  pattern: "\\S",
});
const CronOwnerSchema = closedObject({
  agentId: Type.Optional(NonEmptyString),
  sessionKey: Type.Optional(NonEmptyString),
});
const CronAnnounceChannelSchema = Type.Union([Type.Literal("last"), NonBlankString]);
const CronFailoverReasonSchema = Type.Union([
  Type.Literal("auth"),
  Type.Literal("auth_permanent"),
  Type.Literal("format"),
  Type.Literal("rate_limit"),
  Type.Literal("overloaded"),
  Type.Literal("billing"),
  Type.Literal("server_error"),
  Type.Literal("timeout"),
  Type.Literal("context_overflow"),
  Type.Literal("model_not_found"),
  Type.Literal("session_expired"),
  Type.Literal("empty_response"),
  Type.Literal("no_error_details"),
  Type.Literal("unclassified"),
  Type.Literal("unknown"),
]);
const CronRunDiagnosticSeveritySchema = Type.Union([
  Type.Literal("info"),
  Type.Literal("warn"),
  Type.Literal("error"),
]);
const CronRunDiagnosticSourceSchema = Type.Union([
  Type.Literal("cron-preflight"),
  Type.Literal("cron-setup"),
  Type.Literal("model-preflight"),
  Type.Literal("agent-run"),
  Type.Literal("tool"),
  Type.Literal("exec"),
  Type.Literal("delivery"),
]);
const CronRunDiagnosticSchema = closedObject({
  ts: Type.Integer({ minimum: 0 }),
  source: CronRunDiagnosticSourceSchema,
  severity: CronRunDiagnosticSeveritySchema,
  message: Type.String(),
  toolName: Type.Optional(Type.String()),
  exitCode: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  truncated: Type.Optional(Type.Boolean()),
});
const CronRunDiagnosticsSchema = closedObject({
  summary: Type.Optional(Type.String()),
  entries: Type.Array(CronRunDiagnosticSchema),
});
const CronCommonOptionalFields = {
  agentId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
  sessionKey: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
  description: Type.Optional(Type.String()),
  enabled: Type.Optional(Type.Boolean()),
  deleteAfterRun: Type.Optional(Type.Boolean()),
};
function cronIdOrJobIdParams(extraFields) {
  return Type.Union([
    closedObject({
      id: NonEmptyString,
      ...extraFields,
    }),
    closedObject({
      jobId: NonEmptyString,
      ...extraFields,
    }),
  ]);
}
const CronRunLogJobIdSchema = Type.String({
  minLength: 1,
  pattern: "^[^/\\\\]+$",
});
/** Schedule expression for one-time, interval, or cron-expression jobs. */
const CronScheduleSchema = Type.Union([
  closedObject({
    kind: Type.Literal("at"),
    at: NonEmptyString,
  }),
  closedObject({
    kind: Type.Literal("every"),
    everyMs: Type.Integer({
      minimum: 1,
      maximum: Number.MAX_SAFE_INTEGER,
    }),
    anchorMs: Type.Optional(
      Type.Integer({
        minimum: 0,
        maximum: Number.MAX_SAFE_INTEGER,
      }),
    ),
  }),
  closedObject({
    kind: Type.Literal("cron"),
    expr: NonEmptyString,
    tz: Type.Optional(Type.String()),
    staggerMs: Type.Optional(
      Type.Integer({
        minimum: 0,
        maximum: Number.MAX_SAFE_INTEGER,
      }),
    ),
  }),
  closedObject({
    kind: Type.Literal("on-exit"),
    command: NonEmptyString,
    cwd: Type.Optional(NonEmptyString),
  }),
]);
/** Headless condition script evaluated before a recurring cron payload runs. */
const CronTriggerSchema = closedObject({
  script: Type.String({
    minLength: 1,
    maxLength: 65536,
  }),
  once: Type.Optional(Type.Boolean()),
});
/** Full cron payload for new jobs. */
const CronPayloadSchema = Type.Union([
  closedObject({
    kind: Type.Literal("systemEvent"),
    text: NonEmptyString,
  }),
  cronAgentTurnPayloadSchema({
    message: NonEmptyString,
    model: Type.String(),
    fallbacks: Type.Array(Type.String()),
    toolsAllow: Type.Array(Type.String()),
    thinking: Type.String(),
  }),
  cronCommandPayloadSchema({ argv: Type.Array(NonEmptyString, { minItems: 1 }) }),
]);
/** Partial cron payload for job updates. */
const CronPayloadPatchSchema = Type.Union([
  closedObject({
    kind: Type.Literal("systemEvent"),
    text: Type.Optional(NonEmptyString),
  }),
  cronAgentTurnPayloadSchema({
    message: Type.Optional(NonEmptyString),
    model: Type.Union([Type.String(), Type.Null()]),
    fallbacks: Type.Union([Type.Array(Type.String()), Type.Null()]),
    toolsAllow: Type.Union([Type.Array(Type.String()), Type.Null()]),
    thinking: Type.Union([Type.String(), Type.Null()]),
  }),
  cronCommandPayloadSchema({ argv: Type.Optional(Type.Array(NonEmptyString, { minItems: 1 })) }),
]);
/** Failure alert policy for repeated cron run failures. */
const CronFailureAlertSchema = closedObject({
  after: Type.Optional(Type.Integer({ minimum: 1 })),
  channel: Type.Optional(CronAnnounceChannelSchema),
  to: Type.Optional(NonBlankString),
  cooldownMs: Type.Optional(Type.Integer({ minimum: 0 })),
  includeSkipped: Type.Optional(Type.Boolean()),
  mode: Type.Optional(Type.Union([Type.Literal("announce"), Type.Literal("webhook")])),
  accountId: Type.Optional(NonEmptyString),
});
/** Delivery destination used when failure alerts need a separate target. */
const CronFailureDestinationSchema = closedObject({
  channel: Type.Optional(CronAnnounceChannelSchema),
  to: Type.Optional(NonBlankString),
  accountId: Type.Optional(NonEmptyString),
  mode: Type.Optional(Type.Union([Type.Literal("announce"), Type.Literal("webhook")])),
});
const CronFailureDestinationPatchSchema = closedObject({
  channel: Type.Optional(Type.Union([CronAnnounceChannelSchema, Type.Null()])),
  to: Type.Optional(Type.Union([NonBlankString, Type.Null()])),
  accountId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
  mode: Type.Optional(Type.Union([Type.Literal("announce"), Type.Literal("webhook"), Type.Null()])),
});
const CronCompletionDestinationSchema = closedObject({
  mode: Type.Literal("webhook"),
  to: NonBlankString,
});
const CronDeliverySharedProperties = {
  channel: Type.Optional(CronAnnounceChannelSchema),
  threadId: Type.Optional(Type.Union([Type.String(), Type.Number()])),
  accountId: Type.Optional(NonEmptyString),
  bestEffort: Type.Optional(Type.Boolean()),
  failureDestination: Type.Optional(CronFailureDestinationSchema),
};
const CronDeliveryPatchSharedProperties = {
  channel: Type.Optional(Type.Union([CronAnnounceChannelSchema, Type.Null()])),
  threadId: Type.Optional(Type.Union([Type.String(), Type.Number(), Type.Null()])),
  accountId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
  bestEffort: Type.Optional(Type.Boolean()),
  failureDestination: Type.Optional(Type.Union([CronFailureDestinationPatchSchema, Type.Null()])),
};
const CronDeliveryNoopSchema = closedObject({
  mode: Type.Literal("none"),
  ...CronDeliverySharedProperties,
  to: Type.Optional(NonBlankString),
});
const CronDeliveryAnnounceSchema = closedObject({
  mode: Type.Literal("announce"),
  ...CronDeliverySharedProperties,
  completionDestination: Type.Optional(CronCompletionDestinationSchema),
  to: Type.Optional(NonBlankString),
});
const CronDeliveryWebhookSchema = closedObject({
  mode: Type.Literal("webhook"),
  ...CronDeliverySharedProperties,
  to: NonBlankString,
});
/** Delivery policy for cron run output. */
const CronDeliverySchema = Type.Union([
  CronDeliveryNoopSchema,
  CronDeliveryAnnounceSchema,
  CronDeliveryWebhookSchema,
]);
/** Patch shape for cron delivery policy updates. */
const CronDeliveryPatchSchema = closedObject({
  mode: Type.Optional(
    Type.Union([Type.Literal("none"), Type.Literal("announce"), Type.Literal("webhook")]),
  ),
  ...CronDeliveryPatchSharedProperties,
  completionDestination: Type.Optional(Type.Union([CronCompletionDestinationSchema, Type.Null()])),
  to: Type.Optional(Type.Union([NonBlankString, Type.Null()])),
});
const CronFailureNotificationDeliverySchema = closedObject({
  delivered: Type.Optional(Type.Boolean()),
  status: CronDeliveryStatusSchema,
  error: Type.Optional(Type.String()),
});
/** Scheduler-maintained state for the latest run/delivery outcome. */
const CronJobStateSchema = closedObject({
  nextRunAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
  runningAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
  lastRunAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
  lastRunStatus: Type.Optional(CronRunStatusSchema),
  lastStatus: Type.Optional(DeprecatedCronRunStatusSchema),
  lastError: Type.Optional(Type.String()),
  lastDiagnostics: Type.Optional(CronRunDiagnosticsSchema),
  lastDiagnosticSummary: Type.Optional(Type.String()),
  lastErrorReason: Type.Optional(CronFailoverReasonSchema),
  lastDurationMs: Type.Optional(Type.Integer({ minimum: 0 })),
  consecutiveErrors: Type.Optional(Type.Integer({ minimum: 0 })),
  consecutiveSkipped: Type.Optional(Type.Integer({ minimum: 0 })),
  lastDelivered: Type.Optional(Type.Boolean()),
  lastDeliveryStatus: Type.Optional(CronDeliveryStatusSchema),
  lastDeliveryError: Type.Optional(Type.String()),
  lastFailureNotificationDelivered: Type.Optional(Type.Boolean()),
  lastFailureNotificationDeliveryStatus: Type.Optional(CronDeliveryStatusSchema),
  lastFailureNotificationDeliveryError: Type.Optional(Type.String()),
  lastFailureAlertAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
  lastTriggerEvalAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
  triggerEvalCount: Type.Optional(Type.Integer({ minimum: 0 })),
  lastTriggerFireAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
  triggerState: Type.Optional(Type.Unknown()),
});
const CronJobStatePatchSchema = closedObject({
  nextRunAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
  runningAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
  lastRunAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
  lastRunStatus: Type.Optional(CronRunStatusSchema),
  lastStatus: Type.Optional(DeprecatedCronRunStatusSchema),
  lastError: Type.Optional(Type.String()),
  lastErrorReason: Type.Optional(CronFailoverReasonSchema),
  lastDurationMs: Type.Optional(Type.Integer({ minimum: 0 })),
  consecutiveErrors: Type.Optional(Type.Integer({ minimum: 0 })),
  consecutiveSkipped: Type.Optional(Type.Integer({ minimum: 0 })),
  lastDelivered: Type.Optional(Type.Boolean()),
  lastDeliveryStatus: Type.Optional(CronDeliveryStatusSchema),
  lastDeliveryError: Type.Optional(Type.String()),
  lastFailureNotificationDelivered: Type.Optional(Type.Boolean()),
  lastFailureNotificationDeliveryStatus: Type.Optional(CronDeliveryStatusSchema),
  lastFailureNotificationDeliveryError: Type.Optional(Type.String()),
  lastFailureAlertAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
  lastTriggerEvalAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
  triggerEvalCount: Type.Optional(Type.Integer({ minimum: 0 })),
  lastTriggerFireAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
  triggerState: Type.Optional(Type.Unknown()),
});
/** Persisted cron job definition returned by scheduler list/get APIs. */
const CronJobSchema = closedObject({
  id: NonEmptyString,
  declarationKey: Type.Optional(CronDeclarationKeySchema),
  displayName: Type.Optional(CronDisplayNameSchema),
  owner: Type.Optional(CronOwnerSchema),
  agentId: Type.Optional(NonEmptyString),
  sessionKey: Type.Optional(NonEmptyString),
  name: NonEmptyString,
  description: Type.Optional(Type.String()),
  enabled: Type.Boolean(),
  deleteAfterRun: Type.Optional(Type.Boolean()),
  createdAtMs: Type.Integer({ minimum: 0 }),
  updatedAtMs: Type.Integer({ minimum: 0 }),
  /** Opaque Gateway-computed token for the job definition, excluding scheduler state. */
  configRevision: Type.Optional(CronConfigRevisionSchema),
  schedule: CronScheduleSchema,
  trigger: Type.Optional(CronTriggerSchema),
  sessionTarget: CronSessionTargetSchema,
  wakeMode: CronWakeModeSchema,
  payload: CronPayloadSchema,
  delivery: Type.Optional(CronDeliverySchema),
  failureAlert: Type.Optional(Type.Union([Type.Literal(false), CronFailureAlertSchema])),
  state: CronJobStateSchema,
  nextRunAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
  lastRunAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
  lastRunStatus: Type.Optional(CronRunStatusSchema),
  lastRunError: Type.Optional(Type.String()),
  lastDelivered: Type.Optional(Type.Boolean()),
  lastDeliveryStatus: Type.Optional(CronDeliveryStatusSchema),
  lastDeliveryError: Type.Optional(Type.String()),
  lastFailureNotificationDelivered: Type.Optional(Type.Boolean()),
  lastFailureNotificationDeliveryStatus: Type.Optional(CronDeliveryStatusSchema),
  lastFailureNotificationDeliveryError: Type.Optional(Type.String()),
});
/** Query params for listing cron jobs with filters and pagination. */
const CronListParamsSchema = closedObject({
  includeDisabled: Type.Optional(Type.Boolean()),
  limit: Type.Optional(
    Type.Integer({
      minimum: 1,
      maximum: 200,
    }),
  ),
  offset: Type.Optional(Type.Integer({ minimum: 0 })),
  query: Type.Optional(Type.String()),
  enabled: Type.Optional(CronJobsEnabledFilterSchema),
  scheduleKind: Type.Optional(CronJobsScheduleKindFilterSchema),
  lastRunStatus: Type.Optional(CronJobsLastRunStatusFilterSchema),
  sortBy: Type.Optional(CronJobsSortBySchema),
  sortDir: Type.Optional(CronSortDirSchema),
  agentId: Type.Optional(NonEmptyString),
  compact: Type.Optional(Type.Boolean()),
});
/** Empty request payload for scheduler status. */
const CronStatusParamsSchema = closedObject({});
/** Looks up a job by stable id or legacy jobId alias. */
const CronGetParamsSchema = cronIdOrJobIdParams({});
/** Creates a scheduled job with schedule, target, payload, and delivery policy. */
const CronAddParamsSchema = closedObject({
  name: NonEmptyString,
  declarationKey: Type.Optional(CronDeclarationKeySchema),
  displayName: Type.Optional(CronDisplayNameSchema),
  owner: Type.Optional(CronOwnerSchema),
  ...CronCommonOptionalFields,
  schedule: CronScheduleSchema,
  trigger: Type.Optional(CronTriggerSchema),
  sessionTarget: CronSessionTargetSchema,
  wakeMode: CronWakeModeSchema,
  payload: CronPayloadSchema,
  delivery: Type.Optional(CronDeliverySchema),
  failureAlert: Type.Optional(Type.Union([Type.Literal(false), CronFailureAlertSchema])),
});
/** Successful declaration-key convergence result. */
const CronDeclarativeAddResultSchema = closedObject({
  created: Type.Boolean(),
  updated: Type.Optional(Type.Boolean()),
  job: CronJobSchema,
});
/** Successful result from imperative create or declaration-key convergence. */
const CronAddResultSchema = Type.Union([CronJobSchema, CronDeclarativeAddResultSchema]);
/** Updates a cron job by id or legacy jobId alias. */
const CronUpdateParamsSchema = cronIdOrJobIdParams({
  patch: closedObject({
    name: Type.Optional(NonEmptyString),
    displayName: Type.Optional(Type.Union([CronDisplayNameSchema, Type.Null()])),
    ...CronCommonOptionalFields,
    schedule: Type.Optional(CronScheduleSchema),
    trigger: Type.Optional(Type.Union([CronTriggerSchema, Type.Null()])),
    sessionTarget: Type.Optional(CronSessionTargetSchema),
    wakeMode: Type.Optional(CronWakeModeSchema),
    payload: Type.Optional(CronPayloadPatchSchema),
    delivery: Type.Optional(CronDeliveryPatchSchema),
    failureAlert: Type.Optional(Type.Union([Type.Literal(false), CronFailureAlertSchema])),
    state: Type.Optional(CronJobStatePatchSchema),
  }),
  /** Rejects the patch when the current definition does not match the caller's token. */
  expectedConfigRevision: Type.Optional(CronConfigRevisionSchema),
});
/** Removes a cron job by id or legacy jobId alias. */
const CronRemoveParamsSchema = cronIdOrJobIdParams({});
/** Runs a cron job immediately or only if due. */
const CronRunParamsSchema = cronIdOrJobIdParams({
  mode: Type.Optional(Type.Union([Type.Literal("due"), Type.Literal("force")])),
  /** Rejects the mutation if the Gateway restarted after the caller's preflight. */
  expectedProcessInstanceId: Type.Optional(NonEmptyString),
});
/** Query params for cron run history. */
const CronRunsParamsSchema = closedObject({
  agentId: Type.Optional(NonEmptyString),
  scope: Type.Optional(Type.Union([Type.Literal("job"), Type.Literal("all")])),
  id: Type.Optional(CronRunLogJobIdSchema),
  jobId: Type.Optional(CronRunLogJobIdSchema),
  runId: Type.Optional(NonEmptyString),
  limit: Type.Optional(
    Type.Integer({
      minimum: 1,
      maximum: 200,
    }),
  ),
  offset: Type.Optional(Type.Integer({ minimum: 0 })),
  statuses: Type.Optional(
    Type.Array(CronRunsStatusValueSchema, {
      minItems: 1,
      maxItems: 3,
    }),
  ),
  status: Type.Optional(CronRunsStatusFilterSchema),
  deliveryStatuses: Type.Optional(
    Type.Array(CronDeliveryStatusSchema, {
      minItems: 1,
      maxItems: 4,
    }),
  ),
  deliveryStatus: Type.Optional(CronDeliveryStatusSchema),
  query: Type.Optional(Type.String()),
  sortDir: Type.Optional(CronSortDirSchema),
});
closedObject({
  ts: Type.Integer({ minimum: 0 }),
  jobId: NonEmptyString,
  action: Type.Literal("finished"),
  status: Type.Optional(CronRunStatusSchema),
  error: Type.Optional(Type.String()),
  errorReason: Type.Optional(CronFailoverReasonSchema),
  summary: Type.Optional(Type.String()),
  diagnostics: Type.Optional(CronRunDiagnosticsSchema),
  delivered: Type.Optional(Type.Boolean()),
  deliveryStatus: Type.Optional(CronDeliveryStatusSchema),
  deliveryError: Type.Optional(Type.String()),
  failureNotificationDelivery: Type.Optional(CronFailureNotificationDeliverySchema),
  sessionId: Type.Optional(NonEmptyString),
  sessionKey: Type.Optional(NonEmptyString),
  runId: Type.Optional(NonEmptyString),
  runAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
  durationMs: Type.Optional(Type.Integer({ minimum: 0 })),
  nextRunAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
  triggerFired: Type.Optional(Type.Boolean()),
  model: Type.Optional(Type.String()),
  provider: Type.Optional(Type.String()),
  usage: Type.Optional(
    closedObject({
      input_tokens: Type.Optional(Type.Number()),
      output_tokens: Type.Optional(Type.Number()),
      total_tokens: Type.Optional(Type.Number()),
      cache_read_tokens: Type.Optional(Type.Number()),
      cache_write_tokens: Type.Optional(Type.Number()),
    }),
  ),
  jobName: Type.Optional(Type.String()),
});
//#endregion
//#region packages/gateway-protocol/src/schema/environments.ts
/**
 * Environment inventory protocol schemas.
 *
 * Environments are runtime targets such as local hosts, VMs, or remote workers;
 * this schema layer only describes their gateway-visible status summary.
 */
/** Runtime availability state for an environment target. */
const EnvironmentStatusSchema = Type.String({
  enum: ["available", "unavailable", "starting", "stopping", "error"],
});
/** Durable lifecycle states for plugin-provisioned worker environments. */
const WorkerEnvironmentStateSchema = Type.Union([
  Type.Literal("requested"),
  Type.Literal("provisioning"),
  Type.Literal("bootstrapping"),
  Type.Literal("ready"),
  Type.Literal("attached"),
  Type.Literal("idle"),
  Type.Literal("draining"),
  Type.Literal("destroying"),
  Type.Literal("destroyed"),
  Type.Literal("failed"),
  Type.Literal("orphaned"),
]);
/** Process-local SSH tunnel connectivity for a worker environment. */
const WorkerTunnelStatusSchema = Type.Union([
  Type.Literal("stopped"),
  Type.Literal("connecting"),
  Type.Literal("connected"),
  Type.Literal("reconnecting"),
]);
/** Worker-only lifecycle metadata layered onto the existing environment projection. */
const WorkerEnvironmentMetadataSchema = closedObject({
  providerId: NonEmptyString,
  leaseId: Type.Optional(NonEmptyString),
  state: WorkerEnvironmentStateSchema,
  ageMs: Type.Integer({ minimum: 0 }),
  idleMs: Type.Optional(Type.Integer({ minimum: 0 })),
  attachedSessionIds: Type.Array(NonEmptyString),
  tunnelStatus: WorkerTunnelStatusSchema,
});
function createEnvironmentSummarySchema() {
  return closedObject({
    id: NonEmptyString,
    type: NonEmptyString,
    label: Type.Optional(NonEmptyString),
    status: EnvironmentStatusSchema,
    capabilities: Type.Optional(Type.Array(NonEmptyString)),
    worker: Type.Optional(WorkerEnvironmentMetadataSchema),
  });
}
/** Public environment summary shown in listings and status responses. */
const EnvironmentSummarySchema = createEnvironmentSummarySchema();
/** Empty request payload for listing known environments. */
const EnvironmentsListParamsSchema = closedObject({});
/** List response containing all gateway-visible environment summaries. */
const EnvironmentsListResultSchema = closedObject({
  environments: Type.Array(EnvironmentSummarySchema),
});
/** Status lookup request for one environment id. */
const EnvironmentsStatusParamsSchema = closedObject({ environmentId: NonEmptyString });
/** Status lookup result for one environment id. */
const EnvironmentsStatusResultSchema = createEnvironmentSummarySchema();
/** Creates a worker environment from one configured provider profile. */
const EnvironmentsCreateParamsSchema = closedObject({
  profileId: NonEmptyString,
  idempotencyKey: NonEmptyString,
});
/** Create result uses the same public summary shape as list and status. */
const EnvironmentsCreateResultSchema = createEnvironmentSummarySchema();
/** Destroys one durable worker environment by its gateway-owned id. */
const EnvironmentsDestroyParamsSchema = closedObject({ environmentId: NonEmptyString });
/** Destroy result exposes the terminal worker lifecycle state. */
const EnvironmentsDestroyResultSchema = createEnvironmentSummarySchema();
//#endregion
//#region packages/gateway-protocol/src/schema/exec-approvals.ts
/**
 * Exec approval protocol schemas.
 *
 * These payloads cross the security-review boundary for command execution, so
 * persisted policy, request snapshots, and resolve decisions stay explicit.
 */
/** One persisted allowlist entry for a command pattern or resolved executable. */
const ExecApprovalsAllowlistEntrySchema = closedObject({
  id: Type.Optional(NonEmptyString),
  pattern: Type.String(),
  source: Type.Optional(Type.Literal("allow-always")),
  commandText: Type.Optional(Type.String()),
  argPattern: Type.Optional(Type.String()),
  lastUsedAt: Type.Optional(Type.Number({ minimum: 0 })),
  lastUsedCommand: Type.Optional(Type.String()),
  lastResolvedPath: Type.Optional(Type.String()),
});
const ExecApprovalsPolicyFields = {
  security: Type.Optional(Type.String()),
  ask: Type.Optional(Type.String()),
  askFallback: Type.Optional(Type.String()),
  autoAllowSkills: Type.Optional(Type.Boolean()),
};
const ExecSecuritySchema = Type.Union([
  Type.Literal("deny"),
  Type.Literal("allowlist"),
  Type.Literal("full"),
]);
/** Host-resolved default policy after applying persisted defaults and runtime fallbacks. */
const ExecApprovalsResolvedDefaultsSchema = closedObject({
  security: ExecSecuritySchema,
  ask: Type.Union([Type.Literal("off"), Type.Literal("on-miss"), Type.Literal("always")]),
  askFallback: ExecSecuritySchema,
  autoAllowSkills: Type.Boolean(),
});
/** Default exec approval policy shared by all agents unless overridden. */
const ExecApprovalsDefaultsSchema = closedObject(ExecApprovalsPolicyFields);
/** Agent-specific exec approval policy and allowlist. */
const ExecApprovalsAgentSchema = closedObject({
  ...ExecApprovalsPolicyFields,
  allowlist: Type.Optional(Type.Array(ExecApprovalsAllowlistEntrySchema)),
});
/** Versioned exec approvals config file edited through gateway APIs. */
const ExecApprovalsFileSchema = closedObject({
  version: Type.Literal(1),
  socket: Type.Optional(
    closedObject({
      path: Type.Optional(Type.String()),
      token: Type.Optional(Type.String()),
    }),
  ),
  defaults: Type.Optional(ExecApprovalsDefaultsSchema),
  agents: Type.Optional(Type.Record(Type.String(), ExecApprovalsAgentSchema)),
});
closedObject({
  path: NonEmptyString,
  exists: Type.Boolean(),
  hash: NonEmptyString,
  file: ExecApprovalsFileSchema,
});
const NativeExecApprovalActionSchema = Type.Union([
  Type.Literal("allow"),
  Type.Literal("deny"),
  Type.Literal("prompt"),
]);
/** One rule owned and enforced by a host-native exec policy implementation. */
const NativeExecApprovalRuleSchema = closedObject({
  pattern: NonEmptyString,
  action: NativeExecApprovalActionSchema,
  shells: Type.Optional(Type.Array(NonEmptyString)),
  description: Type.Optional(Type.String()),
  enabled: Type.Optional(Type.Boolean()),
});
const NativeExecApprovalConstraintsSchema = closedObject({
  baseHashRequired: Type.Optional(Type.Boolean()),
  defaultAllowAllowed: Type.Optional(Type.Boolean()),
  broadAllowRulesAllowed: Type.Optional(Type.Boolean()),
  dangerousAllowRulesAllowed: Type.Optional(Type.Boolean()),
});
/** Node read snapshot supporting file-backed and host-native approval owners. */
const ExecApprovalsNodeSnapshotSchema = Type.Object(
  {
    path: Type.Optional(Type.String()),
    exists: Type.Optional(Type.Boolean()),
    hash: Type.Optional(Type.String()),
    file: Type.Optional(ExecApprovalsFileSchema),
    resolvedDefaults: Type.Optional(ExecApprovalsResolvedDefaultsSchema),
    enabled: Type.Optional(Type.Boolean()),
    baseHash: Type.Optional(NonEmptyString),
    defaultAction: Type.Optional(NativeExecApprovalActionSchema),
    rules: Type.Optional(Type.Array(NativeExecApprovalRuleSchema)),
    constraints: Type.Optional(NativeExecApprovalConstraintsSchema),
    message: Type.Optional(Type.String()),
  },
  {
    additionalProperties: false,
    oneOf: [
      {
        required: ["path", "exists", "hash", "file"],
        not: {
          anyOf: [
            { required: ["enabled"] },
            { required: ["baseHash"] },
            { required: ["defaultAction"] },
            { required: ["rules"] },
            { required: ["constraints"] },
            { required: ["message"] },
          ],
        },
      },
      {
        properties: {
          enabled: { const: true },
          hash: { minLength: 1 },
        },
        required: ["enabled", "hash", "defaultAction", "rules"],
        not: {
          anyOf: [
            { required: ["path"] },
            { required: ["exists"] },
            { required: ["file"] },
            { required: ["resolvedDefaults"] },
            { required: ["message"] },
          ],
        },
      },
      {
        properties: { enabled: { const: false } },
        required: ["enabled"],
        not: {
          anyOf: [
            { required: ["path"] },
            { required: ["exists"] },
            { required: ["hash"] },
            { required: ["file"] },
            { required: ["resolvedDefaults"] },
            { required: ["baseHash"] },
            { required: ["defaultAction"] },
            { required: ["rules"] },
            { required: ["constraints"] },
          ],
        },
      },
    ],
  },
);
/** Empty request payload for reading local exec approval policy. */
const ExecApprovalsGetParamsSchema = closedObject({});
/** Local exec approval policy write request with optional base hash guard. */
const ExecApprovalsSetParamsSchema = closedObject({
  file: ExecApprovalsFileSchema,
  baseHash: Type.Optional(NonEmptyString),
});
/** Node-scoped request payload for reading exec approval policy. */
const ExecApprovalsNodeGetParamsSchema = closedObject({ nodeId: NonEmptyString });
/** Writable host-native policy fields; the node remains the validation authority. */
const NativeExecApprovalPolicySchema = closedObject({
  defaultAction: Type.Optional(NativeExecApprovalActionSchema),
  rules: Type.Array(NativeExecApprovalRuleSchema),
});
/** Node-scoped write for exactly one file-backed or host-native approval owner. */
const ExecApprovalsNodeSetParamsSchema = Type.Object(
  {
    nodeId: NonEmptyString,
    file: Type.Optional(ExecApprovalsFileSchema),
    native: Type.Optional(NativeExecApprovalPolicySchema),
    baseHash: Type.Optional(NonEmptyString),
  },
  {
    additionalProperties: false,
    oneOf: [
      {
        required: ["file"],
        not: { required: ["native"] },
      },
      {
        required: ["native", "baseHash"],
        not: { required: ["file"] },
      },
    ],
  },
);
/** Lookup request for one pending exec approval by id. */
const ExecApprovalGetParamsSchema = closedObject({ id: NonEmptyString });
const ExecApprovalPolicySecuritySchema = Type.Union([
  Type.Literal("deny"),
  Type.Literal("allowlist"),
  Type.Literal("full"),
]);
const ExecApprovalPolicySnapshotSchema = closedObject({
  security: ExecApprovalPolicySecuritySchema,
  ask: Type.Union([Type.Literal("off"), Type.Literal("on-miss"), Type.Literal("always")]),
  askFallback: ExecApprovalPolicySecuritySchema,
  autoAllowSkills: Type.Boolean(),
  allowlistRules: Type.Array(
    closedObject({
      pattern: Type.String(),
      argPattern: Type.Optional(Type.String()),
      source: Type.Optional(Type.Literal("allow-always")),
    }),
  ),
});
/** Pending command execution approval request shown to reviewers. */
const ExecApprovalRequestParamsSchema = closedObject({
  id: Type.Optional(NonEmptyString),
  command: Type.Optional(NonEmptyString),
  commandArgv: Type.Optional(Type.Array(Type.String())),
  systemRunPlan: Type.Optional(
    closedObject({
      argv: Type.Array(Type.String()),
      cwd: Type.Union([Type.String(), Type.Null()]),
      commandText: Type.String(),
      commandPreview: Type.Optional(Type.Union([Type.String(), Type.Null()])),
      agentId: Type.Union([Type.String(), Type.Null()]),
      sessionKey: Type.Union([Type.String(), Type.Null()]),
      policySnapshot: Type.Optional(ExecApprovalPolicySnapshotSchema),
      mutableFileOperand: Type.Optional(
        Type.Union([
          closedObject({
            argvIndex: Type.Integer({ minimum: 0 }),
            path: Type.String(),
            sha256: Type.String(),
          }),
          Type.Null(),
        ]),
      ),
    }),
  ),
  env: Type.Optional(Type.Record(NonEmptyString, Type.String())),
  cwd: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  nodeId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
  host: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  security: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  ask: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  warningText: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  unavailableDecisions: Type.Optional(
    Type.Array(Type.String({ enum: ["allow-always"] }), {
      minItems: 1,
      maxItems: 1,
    }),
  ),
  commandSpans: Type.Optional(
    Type.Array(
      closedObject({
        startIndex: Type.Integer({
          minimum: 0,
          description: "Inclusive UTF-16 code unit offset into command.",
        }),
        endIndex: Type.Integer({
          minimum: 1,
          description:
            "Exclusive UTF-16 code unit offset into command; must be greater than startIndex and no greater than command.length.",
        }),
      }),
    ),
  ),
  agentId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  resolvedPath: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  sessionKey: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  turnSourceChannel: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  turnSourceTo: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  turnSourceAccountId: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  turnSourceThreadId: Type.Optional(Type.Union([Type.String(), Type.Number(), Type.Null()])),
  approvalReviewerDeviceIds: Type.Optional(
    Type.Array(NonEmptyString, {
      description:
        "Trusted approval-runtime metadata naming operator devices that may review this approval; ordinary Gateway clients may send the field, but the Gateway only binds it for internal approval-runtime requests.",
    }),
  ),
  requireDeliveryRoute: Type.Optional(Type.Boolean()),
  suppressDelivery: Type.Optional(Type.Boolean()),
  timeoutMs: Type.Optional(Type.Integer({ minimum: 1 })),
  twoPhase: Type.Optional(Type.Boolean()),
});
/** Reviewer decision payload for one pending exec approval. */
const ExecApprovalResolveParamsSchema = closedObject({
  id: NonEmptyString,
  decision: NonEmptyString,
});
//#endregion
//#region packages/gateway-protocol/src/schema/devices.ts
/**
 * Device pairing and token-management protocol schemas.
 *
 * These payloads cross the gateway approval boundary, so request ids and device
 * ids stay explicit and feature handlers own the authorization checks.
 */
/** Lists pending and approved device pairing records. */
const DevicePairListParamsSchema = closedObject({});
/** Approves a pending pairing request by request id. */
const DevicePairApproveParamsSchema = closedObject({ requestId: NonEmptyString });
/** Rejects a pending pairing request by request id. */
const DevicePairRejectParamsSchema = closedObject({ requestId: NonEmptyString });
/** Removes an approved or remembered device by device id. */
const DevicePairRemoveParamsSchema = closedObject({ deviceId: NonEmptyString });
/** Renames a paired device while preserving its stable device id. */
const DevicePairRenameParamsSchema = closedObject({
  deviceId: NonEmptyString,
  label: Type.String({
    minLength: 1,
    maxLength: 64,
  }),
});
/** Rotates or issues a device token for a specific role/scope grant. */
const DeviceTokenRotateParamsSchema = closedObject({
  deviceId: NonEmptyString,
  role: NonEmptyString,
  scopes: Type.Optional(Type.Array(NonEmptyString)),
});
/** Revokes one role-bound device token grant. */
const DeviceTokenRevokeParamsSchema = closedObject({
  deviceId: NonEmptyString,
  role: NonEmptyString,
});
closedObject({
  requestId: NonEmptyString,
  deviceId: NonEmptyString,
  publicKey: NonEmptyString,
  displayName: Type.Optional(NonEmptyString),
  platform: Type.Optional(NonEmptyString),
  deviceFamily: Type.Optional(NonEmptyString),
  clientId: Type.Optional(NonEmptyString),
  clientMode: Type.Optional(NonEmptyString),
  role: Type.Optional(NonEmptyString),
  roles: Type.Optional(Type.Array(NonEmptyString)),
  scopes: Type.Optional(Type.Array(NonEmptyString)),
  remoteIp: Type.Optional(NonEmptyString),
  silent: Type.Optional(Type.Boolean()),
  isRepair: Type.Optional(Type.Boolean()),
  ts: Type.Integer({ minimum: 0 }),
});
closedObject({
  requestId: NonEmptyString,
  deviceId: NonEmptyString,
  decision: NonEmptyString,
  ts: Type.Integer({ minimum: 0 }),
});
const SetupCodeQrDataUrlSchema = Type.String({
  maxLength: 16384,
  pattern: "^data:image/png;base64,",
});
/**
 * Generates a device-pairing setup code (and optional QR) so a mobile/companion
 * client can scan it and connect to this gateway. The embedded setup code mints
 * a short-lived bootstrap token that defaults to full native-mobile operator
 * access, so this method requires operator.admin
 * (enforced by the core method descriptor's method-scope policy, not the handler)
 * and is not advertised. `bootstrapProfile: "limited"` omits operator.admin;
 * `bootstrapProfile: "node"` narrows the handoff to a node role with no operator
 * scopes for companion devices such as watchOS.
 */
const DevicePairSetupCodeParamsSchema = closedObject({
  publicUrl: Type.Optional(NonEmptyString),
  preferRemoteUrl: Type.Optional(Type.Boolean()),
  includeQr: Type.Optional(Type.Boolean()),
  bootstrapProfile: Type.Optional(Type.String({ enum: ["limited", "node"] })),
});
closedObject({
  setupCode: NonEmptyString,
  qrDataUrl: Type.Optional(SetupCodeQrDataUrlSchema),
  gatewayUrl: NonEmptyString,
  gatewayUrls: Type.Optional(
    Type.Array(NonEmptyString, {
      minItems: 2,
      maxItems: 8,
      uniqueItems: true,
    }),
  ),
  auth: Type.Union([Type.Literal("token"), Type.Literal("password")]),
  urlSource: NonEmptyString,
  access: Type.Optional(
    Type.Union([Type.Literal("full"), Type.Literal("limited"), Type.Literal("node")]),
  ),
  accessDowngraded: Type.Optional(Type.Boolean()),
});
//#endregion
//#region packages/gateway-protocol/src/schema/snapshot.ts
/**
 * Gateway state snapshot schemas.
 *
 * Snapshots are sent during hello and later event streams; they summarize node
 * presence, health, session defaults, and version counters for clients.
 */
/** One gateway-visible presence record for a node/client/runtime. */
const PresenceEntrySchema = closedObject({
  host: Type.Optional(NonEmptyString),
  ip: Type.Optional(NonEmptyString),
  version: Type.Optional(NonEmptyString),
  platform: Type.Optional(NonEmptyString),
  deviceFamily: Type.Optional(NonEmptyString),
  modelIdentifier: Type.Optional(NonEmptyString),
  mode: Type.Optional(NonEmptyString),
  lastInputSeconds: Type.Optional(Type.Integer({ minimum: 0 })),
  reason: Type.Optional(NonEmptyString),
  tags: Type.Optional(Type.Array(NonEmptyString)),
  text: Type.Optional(Type.String()),
  ts: Type.Integer({ minimum: 0 }),
  deviceId: Type.Optional(NonEmptyString),
  roles: Type.Optional(Type.Array(NonEmptyString)),
  scopes: Type.Optional(Type.Array(NonEmptyString)),
  instanceId: Type.Optional(NonEmptyString),
});
/** Health snapshot is intentionally opaque because providers contribute nested shapes. */
const HealthSnapshotSchema = Type.Any();
/** Default session routing keys included in initial gateway snapshots. */
const SessionDefaultsSchema = closedObject({
  defaultAgentId: NonEmptyString,
  mainKey: NonEmptyString,
  mainSessionKey: NonEmptyString,
  scope: Type.Optional(NonEmptyString),
});
/** Monotonic version counters for snapshot subtrees. */
const StateVersionSchema = closedObject({
  presence: Type.Integer({ minimum: 0 }),
  health: Type.Integer({ minimum: 0 }),
});
/** Initial and incremental gateway state snapshot payload. */
const SnapshotSchema = closedObject({
  presence: Type.Array(PresenceEntrySchema),
  health: HealthSnapshotSchema,
  stateVersion: StateVersionSchema,
  uptimeMs: Type.Integer({ minimum: 0 }),
  configPath: Type.Optional(NonEmptyString),
  stateDir: Type.Optional(NonEmptyString),
  sessionDefaults: Type.Optional(SessionDefaultsSchema),
  authMode: Type.Optional(
    Type.Union([
      Type.Literal("none"),
      Type.Literal("token"),
      Type.Literal("password"),
      Type.Literal("trusted-proxy"),
    ]),
  ),
  updateAvailable: Type.Optional(
    Type.Object({
      currentVersion: NonEmptyString,
      latestVersion: NonEmptyString,
      channel: NonEmptyString,
    }),
  ),
});
//#endregion
//#region packages/gateway-protocol/src/schema/frames.ts
const GATEWAY_SERVER_CAPS = {
  CHAT_SEND_ROUTING_CONTRACT: "chat-send-routing-contract",
  CRESTODIAN_SETUP_MODEL_REF: "crestodian-setup-model-ref",
};
/**
 * Top-level gateway frame schemas.
 *
 * These are the WebSocket envelope contracts; method/event payload schemas live
 * in feature-specific modules and are referenced by runtime validators.
 */
/** Periodic server heartbeat event payload. */
const TickEventSchema = closedObject({ ts: Type.Integer({ minimum: 0 }) });
/** Server shutdown notice event payload. */
const ShutdownEventSchema = closedObject({
  reason: NonEmptyString,
  restartExpectedMs: Type.Optional(Type.Integer({ minimum: 0 })),
});
/** Initial client hello/connect payload sent before the gateway accepts frames. */
const ConnectParamsSchema = closedObject({
  minProtocol: Type.Integer({ minimum: 1 }),
  maxProtocol: Type.Integer({ minimum: 1 }),
  client: closedObject({
    id: GatewayClientIdSchema,
    displayName: Type.Optional(NonEmptyString),
    version: NonEmptyString,
    platform: NonEmptyString,
    deviceFamily: Type.Optional(NonEmptyString),
    modelIdentifier: Type.Optional(NonEmptyString),
    mode: GatewayClientModeSchema,
    instanceId: Type.Optional(NonEmptyString),
  }),
  caps: Type.Optional(Type.Array(NonEmptyString, { default: [] })),
  commands: Type.Optional(Type.Array(NonEmptyString)),
  permissions: Type.Optional(Type.Record(NonEmptyString, Type.Boolean())),
  pathEnv: Type.Optional(Type.String()),
  role: Type.Optional(NonEmptyString),
  scopes: Type.Optional(Type.Array(NonEmptyString)),
  device: Type.Optional(
    closedObject({
      id: NonEmptyString,
      publicKey: NonEmptyString,
      signature: NonEmptyString,
      signedAt: Type.Integer({ minimum: 0 }),
      nonce: NonEmptyString,
    }),
  ),
  auth: Type.Optional(
    closedObject({
      token: Type.Optional(Type.String()),
      bootstrapToken: Type.Optional(Type.String()),
      deviceToken: Type.Optional(Type.String()),
      password: Type.Optional(Type.String()),
      approvalRuntimeToken: Type.Optional(Type.String()),
      agentRuntimeIdentityToken: Type.Optional(Type.String()),
    }),
  ),
  locale: Type.Optional(Type.String()),
  userAgent: Type.Optional(Type.String()),
});
/** Successful gateway hello response with negotiated protocol and initial state. */
const HelloOkSchema = closedObject({
  type: Type.Literal("hello-ok"),
  protocol: Type.Integer({ minimum: 1 }),
  server: closedObject({
    version: NonEmptyString,
    connId: NonEmptyString,
  }),
  features: closedObject({
    methods: Type.Array(NonEmptyString),
    events: Type.Array(NonEmptyString),
    capabilities: Type.Optional(Type.Array(NonEmptyString)),
  }),
  snapshot: SnapshotSchema,
  controlUiTabs: Type.Optional(
    Type.Array(
      closedObject({
        pluginId: NonEmptyString,
        id: NonEmptyString,
        label: NonEmptyString,
        description: Type.Optional(Type.String()),
        icon: Type.Optional(Type.String()),
        path: Type.Optional(Type.String()),
        group: Type.Optional(Type.Union([Type.Literal("control"), Type.Literal("agent")])),
        order: Type.Optional(Type.Number()),
      }),
    ),
  ),
  pluginSurfaceUrls: Type.Optional(Type.Record(NonEmptyString, NonEmptyString)),
  auth: closedObject({
    deviceToken: Type.Optional(NonEmptyString),
    role: NonEmptyString,
    scopes: Type.Array(NonEmptyString),
    issuedAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
    deviceTokens: Type.Optional(
      Type.Array(
        closedObject({
          deviceToken: NonEmptyString,
          role: NonEmptyString,
          scopes: Type.Array(NonEmptyString),
          issuedAtMs: Type.Integer({ minimum: 0 }),
        }),
      ),
    ),
  }),
  policy: closedObject({
    maxPayload: Type.Integer({ minimum: 1 }),
    maxBufferedBytes: Type.Integer({ minimum: 1 }),
    tickIntervalMs: Type.Integer({ minimum: 1 }),
  }),
});
/** Standard structured error shape used in response frames and connect failures. */
const ErrorShapeSchema = closedObject({
  code: NonEmptyString,
  message: NonEmptyString,
  details: Type.Optional(Type.Unknown()),
  retryable: Type.Optional(Type.Boolean()),
  retryAfterMs: Type.Optional(Type.Integer({ minimum: 0 })),
});
/** Client request frame envelope; `method` selects the payload validator. */
const RequestFrameSchema = closedObject({
  type: Type.Literal("req"),
  id: NonEmptyString,
  method: NonEmptyString,
  params: Type.Optional(Type.Unknown()),
});
/** Server response frame envelope paired with a prior request id. */
const ResponseFrameSchema = closedObject({
  type: Type.Literal("res"),
  id: NonEmptyString,
  ok: Type.Boolean(),
  payload: Type.Optional(Type.Unknown()),
  error: Type.Optional(ErrorShapeSchema),
});
/** Server event frame envelope; `event` selects the payload validator. */
const EventFrameSchema = closedObject({
  type: Type.Literal("event"),
  event: NonEmptyString,
  payload: Type.Optional(Type.Unknown()),
  seq: Type.Optional(Type.Integer({ minimum: 0 })),
  stateVersion: Type.Optional(StateVersionSchema),
});
const GatewayFrameSchema = Type.Union([RequestFrameSchema, ResponseFrameSchema, EventFrameSchema], {
  discriminator: "type",
});
//#endregion
//#region packages/gateway-protocol/src/schema/fs.ts
const FsListDirParamsSchema = closedObject({
  /** Absolute directory to list; omitted means the selected host's home directory. */
  path: Type.Optional(NonEmptyString),
  /** Connected node host to browse; omitted means the Gateway host. */
  nodeId: Type.Optional(NonEmptyString),
});
const FsDirEntrySchema = closedObject({
  name: NonEmptyString,
  path: NonEmptyString,
  /** Dot-prefixed directories; clients render them dimmed after visible ones. */
  hidden: Type.Optional(Type.Boolean()),
});
const FsListDirResultSchema = closedObject({
  /** Resolved absolute path that was listed. */
  path: NonEmptyString,
  /** Absent at the filesystem root. */
  parent: Type.Optional(NonEmptyString),
  /** Selected host's home directory, for the picker's "home" shortcut. */
  home: NonEmptyString,
  entries: Type.Array(FsDirEntrySchema),
});
//#endregion
//#region packages/gateway-protocol/src/schema/gateway-suspend.ts
const SuspensionTokenSchema = Type.String({
  minLength: 1,
  maxLength: 128,
  pattern: "\\S",
});
const CountSchema = Type.Integer({ minimum: 0 });
const GatewaySuspendTaskBlockerSchema = closedObject({
  taskId: Type.String(),
  status: Type.Literal("running"),
  runtime: Type.Union([
    Type.Literal("subagent"),
    Type.Literal("acp"),
    Type.Literal("cli"),
    Type.Literal("cron"),
  ]),
  runId: Type.Optional(Type.String()),
  label: Type.Optional(Type.String()),
  title: Type.Optional(Type.String()),
});
const GatewaySuspendBlockerSchema = closedObject({
  kind: Type.Union([
    Type.Literal("queue"),
    Type.Literal("reply"),
    Type.Literal("embedded-run"),
    Type.Literal("background-exec"),
    Type.Literal("cron-run"),
    Type.Literal("task"),
    Type.Literal("root-request"),
    Type.Literal("session-admission"),
    Type.Literal("session-mutation"),
    Type.Literal("chat-run"),
    Type.Literal("queued-turn"),
    Type.Literal("terminal-persistence"),
    Type.Literal("terminal-session"),
  ]),
  count: CountSchema,
  message: Type.String(),
  task: Type.Optional(GatewaySuspendTaskBlockerSchema),
});
const GatewaySuspendPrepareParamsSchema = closedObject({ requestId: SuspensionTokenSchema });
const GatewaySuspendPrepareBusyResultSchema = closedObject({
  status: Type.Literal("busy"),
  reason: Type.Union([Type.Literal("active-work"), Type.Literal("gateway-draining")]),
  retryAfterMs: CountSchema,
  activeCount: CountSchema,
  blockers: Type.Array(GatewaySuspendBlockerSchema),
});
const GatewaySuspendPrepareReadyResultSchema = closedObject({
  status: Type.Literal("ready"),
  suspensionId: SuspensionTokenSchema,
  expiresAtMs: CountSchema,
  activeCount: CountSchema,
  blockers: Type.Array(GatewaySuspendBlockerSchema),
});
const GatewaySuspendPrepareResultSchema = Type.Union([
  GatewaySuspendPrepareBusyResultSchema,
  GatewaySuspendPrepareReadyResultSchema,
]);
const GatewaySuspendStatusParamsSchema = closedObject({ suspensionId: SuspensionTokenSchema });
const GatewaySuspendStatusRunningResultSchema = closedObject({ status: Type.Literal("running") });
const GatewaySuspendStatusReadyResultSchema = closedObject({
  status: Type.Literal("ready"),
  expiresAtMs: CountSchema,
});
const GatewaySuspendStatusResultSchema = Type.Union([
  GatewaySuspendStatusRunningResultSchema,
  GatewaySuspendStatusReadyResultSchema,
]);
const GatewaySuspendResumeParamsSchema = GatewaySuspendStatusParamsSchema;
const GatewaySuspendResumeResultSchema = closedObject({
  ok: Type.Literal(true),
  status: Type.Literal("running"),
  resumed: Type.Boolean(),
});
//#endregion
//#region packages/gateway-protocol/src/schema/logs-chat.ts
/** Cursor-based request for the gateway log tail endpoint. */
const LogsTailParamsSchema = closedObject({
  cursor: Type.Optional(Type.Integer({ minimum: 0 })),
  limit: Type.Optional(
    Type.Integer({
      minimum: 1,
      maximum: 5e3,
    }),
  ),
  maxBytes: Type.Optional(
    Type.Integer({
      minimum: 1,
      maximum: 1e6,
    }),
  ),
});
/** Gateway log tail payload returned to dashboard clients. */
const LogsTailResultSchema = closedObject({
  file: NonEmptyString,
  cursor: Type.Integer({ minimum: 0 }),
  size: Type.Integer({ minimum: 0 }),
  lines: Type.Array(Type.String()),
  truncated: Type.Optional(Type.Boolean()),
  reset: Type.Optional(Type.Boolean()),
});
/** Session-scoped history request used by WebChat and native WebSocket clients. */
const ChatHistoryParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type.Optional(NonEmptyString),
  limit: Type.Optional(
    Type.Integer({
      minimum: 1,
      maximum: 1e3,
    }),
  ),
  offset: Type.Optional(Type.Integer({ minimum: 0 })),
  messageId: Type.Optional(NonEmptyString),
  sessionId: Type.Optional(NonEmptyString),
  maxChars: Type.Optional(
    Type.Integer({
      minimum: 1,
      maximum: 5e5,
    }),
  ),
});
/** Lightweight chat metadata request; optional agent scope keeps selector state explicit. */
const ChatMetadataParamsSchema = closedObject({ agentId: Type.Optional(NonEmptyString) });
/** Batched purpose-title request for tool calls rendered in the Control UI. */
const ChatToolTitlesParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type.Optional(NonEmptyString),
  items: Type.Array(
    closedObject({
      id: Type.String({
        minLength: 1,
        maxLength: 64,
      }),
      name: Type.String({
        minLength: 1,
        maxLength: 200,
      }),
      input: Type.String({
        minLength: 1,
        maxLength: 4e3,
      }),
    }),
    {
      minItems: 1,
      maxItems: 24,
    },
  ),
});
/**
 * Titles keyed by the caller-provided item id; missing ids mean no title.
 * `disabled: true` tells clients the gateway has tool titles switched off so
 * they stop requesting for the rest of the session.
 */
const ChatToolTitlesResultSchema = closedObject({
  titles: Type.Record(Type.String(), Type.String()),
  disabled: Type.Optional(Type.Boolean()),
});
/** Fetches one stored chat message without forcing history callers to request huge payloads. */
const ChatMessageGetParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type.Optional(NonEmptyString),
  messageId: NonEmptyString,
  maxChars: Type.Optional(
    Type.Integer({
      minimum: 1,
      maximum: 2e6,
    }),
  ),
});
/** Result envelope for single-message lookup, including the stable miss/visibility reason. */
const ChatMessageGetResultSchema = closedObject({
  ok: Type.Boolean(),
  message: Type.Optional(Type.Unknown()),
  unavailableReason: Type.Optional(
    Type.Union([Type.Literal("not_found"), Type.Literal("oversized"), Type.Literal("not_visible")]),
  ),
});
/** Attachment envelope shared by chat.send and session creation's initial turn. */
const ChatAttachmentsSchema = Type.Array(Type.Unknown());
/** User-to-agent send request; idempotency key lets clients safely retry transport failures. */
const ChatSendParamsSchema = closedObject({
  sessionKey: ChatSendSessionKeyString,
  agentId: Type.Optional(NonEmptyString),
  sessionId: Type.Optional(NonEmptyString),
  message: Type.String(),
  thinking: Type.Optional(Type.String()),
  fastMode: Type.Optional(Type.Union([Type.Boolean(), Type.Literal("auto")])),
  fastAutoOnSeconds: Type.Optional(Type.Integer({ minimum: 1 })),
  deliver: Type.Optional(Type.Boolean()),
  originatingChannel: Type.Optional(Type.String()),
  originatingTo: Type.Optional(Type.String()),
  originatingAccountId: Type.Optional(Type.String()),
  originatingThreadId: Type.Optional(Type.String()),
  attachments: Type.Optional(ChatAttachmentsSchema),
  timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
  systemInputProvenance: Type.Optional(InputProvenanceSchema),
  systemProvenanceReceipt: Type.Optional(Type.String()),
  suppressCommandInterpretation: Type.Optional(Type.Boolean()),
  expectedSessionRoutingContract: Type.Optional(NonEmptyString),
  idempotencyKey: NonEmptyString,
});
/** Cancels the active or named run for a chat session. */
const ChatAbortParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type.Optional(NonEmptyString),
  runId: Type.Optional(NonEmptyString),
  preserveSideRuns: Type.Optional(Type.Boolean()),
});
/** Inserts an operator-visible synthetic message into an existing chat transcript. */
const ChatInjectParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type.Optional(NonEmptyString),
  message: NonEmptyString,
  label: Type.Optional(Type.String({ maxLength: 100 })),
});
/** Shared event fields preserve stream ordering and route events to the right session. */
const ChatEventBaseSchema = {
  runId: NonEmptyString,
  sessionKey: NonEmptyString,
  agentId: Type.Optional(NonEmptyString),
  spawnedBy: Type.Optional(NonEmptyString),
  seq: Type.Integer({ minimum: 0 }),
};
/** Stable error categories exposed over the chat stream. */
const ChatEventErrorKindSchema = Type.Union([
  Type.Literal("refusal"),
  Type.Literal("timeout"),
  Type.Literal("rate_limit"),
  Type.Literal("context_length"),
  Type.Literal("unknown"),
]);
/** Incremental assistant output event; `replace` marks full-content refresh deltas. */
const ChatDeltaEventSchema = closedObject({
  ...ChatEventBaseSchema,
  state: Type.Literal("delta"),
  message: Type.Optional(Type.Unknown()),
  deltaText: Type.String(),
  replace: Type.Optional(Type.Boolean()),
  usage: Type.Optional(Type.Unknown()),
});
/** Successful terminal event for a completed chat run. */
const ChatFinalEventSchema = closedObject({
  ...ChatEventBaseSchema,
  state: Type.Literal("final"),
  message: Type.Optional(Type.Unknown()),
  usage: Type.Optional(Type.Unknown()),
  stopReason: Type.Optional(Type.String()),
});
/** Terminal event for user-initiated or coordinator-initiated cancellation. */
const ChatAbortedEventSchema = closedObject({
  ...ChatEventBaseSchema,
  state: Type.Literal("aborted"),
  message: Type.Optional(Type.Unknown()),
  errorMessage: Type.Optional(Type.String()),
  stopReason: Type.Optional(Type.String()),
});
/** Terminal event for failed chat runs with an optional normalized failure kind. */
const ChatErrorEventSchema = closedObject({
  ...ChatEventBaseSchema,
  state: Type.Literal("error"),
  message: Type.Optional(Type.Unknown()),
  errorMessage: Type.Optional(Type.String()),
  errorKind: Type.Optional(ChatEventErrorKindSchema),
  usage: Type.Optional(Type.Unknown()),
  stopReason: Type.Optional(Type.String()),
});
/** Public chat stream event union consumed by gateway protocol validators. */
const ChatEventSchema = Type.Union([
  ChatDeltaEventSchema,
  ChatFinalEventSchema,
  ChatAbortedEventSchema,
  ChatErrorEventSchema,
]);
//#endregion
//#region packages/gateway-protocol/src/schema/nodes.ts
const NodePluginToolNameSchema = Type.String({
  minLength: 1,
  maxLength: 64,
  pattern: "^[A-Za-z][A-Za-z0-9_-]{0,63}$",
});
const NodeSkillNameSchema = Type.String({
  minLength: 1,
  maxLength: 64,
  pattern: "^(?!.*--)[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$",
});
/** Pending node work classes that the gateway may queue for paired devices. */
const NodePendingWorkTypeSchema = Type.String({ enum: ["status.request", "location.request"] });
/** Queue priority accepted when operators enqueue node work. */
const NodePendingWorkPrioritySchema = Type.String({ enum: ["normal", "high"] });
/** Reasons a node can report itself alive without implying an operator action. */
const NodePresenceAliveReasonSchema = Type.String({
  enum: [
    "background",
    "silent_push",
    "bg_app_refresh",
    "significant_location",
    "manual",
    "connect",
  ],
});
/** Presence heartbeat payload sent by remote nodes to refresh gateway state. */
const NodePresenceAlivePayloadSchema = closedObject({
  trigger: NodePresenceAliveReasonSchema,
  sentAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
  displayName: Type.Optional(NonEmptyString),
  version: Type.Optional(NonEmptyString),
  platform: Type.Optional(NonEmptyString),
  deviceFamily: Type.Optional(NonEmptyString),
  modelIdentifier: Type.Optional(NonEmptyString),
  pushTransport: Type.Optional(NonEmptyString),
});
/** Recent operator input activity reported by an interactive node. */
const NodePresenceActivityPayloadSchema = closedObject({
  idleSeconds: Type.Integer({
    minimum: 0,
    maximum: 2592e3,
  }),
  saturated: Type.Optional(Type.Boolean()),
});
/** Normalized result for node-originated events after gateway dispatch. */
const NodeEventResultSchema = closedObject({
  ok: Type.Boolean(),
  event: NonEmptyString,
  handled: Type.Boolean(),
  reason: Type.Optional(NonEmptyString),
});
/** Lists pending node-pairing requests. */
const NodePairListParamsSchema = closedObject({});
/** Approves a pending node-pairing request by request id. */
const NodePairApproveParamsSchema = closedObject({ requestId: NonEmptyString });
/** Rejects a pending node-pairing request by request id. */
const NodePairRejectParamsSchema = closedObject({ requestId: NonEmptyString });
/** Removes an already paired node from the gateway trust set. */
const NodePairRemoveParamsSchema = closedObject({ nodeId: NonEmptyString });
/** Renames a paired node while preserving its stable node id. */
const NodeRenameParamsSchema = closedObject({
  nodeId: NonEmptyString,
  displayName: NonEmptyString,
});
/** Lists paired nodes known to the gateway. */
const NodeListParamsSchema = closedObject({});
/** Agent-visible tool descriptor advertised by a connected node. */
const NodePluginToolDescriptorSchema = closedObject({
  pluginId: NonEmptyString,
  name: NodePluginToolNameSchema,
  description: NonEmptyString,
  parameters: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
  command: Type.Optional(NonEmptyString),
  mcp: Type.Optional(
    closedObject({
      server: NonEmptyString,
      tool: NonEmptyString,
    }),
  ),
});
/** Replaces the connected node's dynamic agent-visible plugin/MCP tool catalog. */
const NodePluginToolsUpdateParamsSchema = closedObject({
  tools: Type.Array(NodePluginToolDescriptorSchema),
});
/** Agent-visible skill descriptor advertised by a connected node. */
const NodeSkillDescriptorSchema = closedObject({
  name: NodeSkillNameSchema,
  description: Type.String({
    minLength: 1,
    maxLength: 1024,
  }),
  content: Type.String({
    minLength: 1,
    maxLength: 64 * 1024,
  }),
});
/** Replaces the connected node's agent-visible skill catalog. */
const NodeSkillsUpdateParamsSchema = closedObject({
  skills: Type.Array(NodeSkillDescriptorSchema, { maxItems: 64 }),
});
/** Acknowledges queued node work that the node has consumed. */
const NodePendingAckParamsSchema = closedObject({
  ids: Type.Array(NonEmptyString, { minItems: 1 }),
});
/** Requests detailed metadata for one paired node. */
const NodeDescribeParamsSchema = closedObject({ nodeId: NonEmptyString });
/** Invokes a command on a paired node; idempotency allows safe retries. */
const NodeInvokeParamsSchema = closedObject({
  nodeId: NonEmptyString,
  command: NonEmptyString,
  params: Type.Optional(Type.Unknown()),
  timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
  idempotencyKey: NonEmptyString,
  turnSourceChannel: Type.Optional(Type.String()),
  turnSourceTo: Type.Optional(Type.String()),
  turnSourceAccountId: Type.Optional(Type.String()),
  turnSourceThreadId: Type.Optional(Type.Union([Type.String(), Type.Number()])),
});
/** Result callback payload for a node command invocation. */
const NodeInvokeResultParamsSchema = closedObject({
  id: NonEmptyString,
  nodeId: NonEmptyString,
  ok: Type.Boolean(),
  payload: Type.Optional(Type.Unknown()),
  payloadJSON: Type.Optional(Type.String()),
  error: Type.Optional(
    closedObject({
      code: Type.Optional(NonEmptyString),
      message: Type.Optional(NonEmptyString),
    }),
  ),
});
/** Ordered UTF-8 output emitted while a node command invocation is running. */
const NodeInvokeProgressParamsSchema = Type.Object(
  {
    invokeId: NonEmptyString,
    nodeId: NonEmptyString,
    seq: Type.Integer({ minimum: 0 }),
    chunk: Type.String({ maxLength: 16 * 1024 }),
  },
  { additionalProperties: false },
);
/** Generic node event envelope accepted by the gateway. */
const NodeEventParamsSchema = closedObject({
  event: NonEmptyString,
  payload: Type.Optional(Type.Unknown()),
  payloadJSON: Type.Optional(Type.String()),
});
/** Request for a bounded batch of queued work assigned to the calling node. */
const NodePendingDrainParamsSchema = closedObject({
  maxItems: Type.Optional(
    Type.Integer({
      minimum: 1,
      maximum: 10,
    }),
  ),
});
/** One queued node-work item returned by pending-work drain calls. */
const NodePendingDrainItemSchema = closedObject({
  id: NonEmptyString,
  type: NodePendingWorkTypeSchema,
  priority: Type.String({ enum: ["default", "normal", "high"] }),
  createdAtMs: Type.Integer({ minimum: 0 }),
  expiresAtMs: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
  payload: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
});
/** Drain response with a revision marker for node queue state. */
const NodePendingDrainResultSchema = closedObject({
  nodeId: NonEmptyString,
  revision: Type.Integer({ minimum: 0 }),
  items: Type.Array(NodePendingDrainItemSchema),
  hasMore: Type.Boolean(),
});
/** Enqueues gateway-initiated work for a paired node. */
const NodePendingEnqueueParamsSchema = closedObject({
  nodeId: NonEmptyString,
  type: NodePendingWorkTypeSchema,
  priority: Type.Optional(NodePendingWorkPrioritySchema),
  expiresInMs: Type.Optional(
    Type.Integer({
      minimum: 1e3,
      maximum: 864e5,
    }),
  ),
  wake: Type.Optional(Type.Boolean()),
});
/** Enqueue result echoes queue revision and whether wake delivery was attempted. */
const NodePendingEnqueueResultSchema = closedObject({
  nodeId: NonEmptyString,
  revision: Type.Integer({ minimum: 0 }),
  queued: NodePendingDrainItemSchema,
  wakeTriggered: Type.Boolean(),
});
/** Event payload used by the gateway to ask a node to run a command. */
const NodeInvokeRequestEventSchema = closedObject({
  id: NonEmptyString,
  nodeId: NonEmptyString,
  command: NonEmptyString,
  paramsJSON: Type.Optional(Type.String()),
  timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
  idempotencyKey: Type.Optional(NonEmptyString),
});
/** Ordered input frame sent by the gateway to one long-lived node invoke. */
const NodeInvokeInputEventSchema = closedObject({
  id: NonEmptyString,
  nodeId: NonEmptyString,
  seq: Type.Integer({ minimum: 0 }),
  payloadJSON: Type.String({ maxLength: 16 * 1024 }),
});
//#endregion
//#region packages/gateway-protocol/src/schema/log-migration-protocol-schemas.ts
const LogMigrationProtocolSchemas = {
  LogsTailParams: LogsTailParamsSchema,
  LogsTailResult: LogsTailResultSchema,
  ...MigrationProtocolSchemas,
};
/** Approval request raised by a plugin before a sensitive tool action proceeds. */
const PluginApprovalRequestParamsSchema = closedObject({
  pluginId: Type.Optional(NonEmptyString),
  title: Type.String({
    minLength: 1,
    maxLength: 80,
  }),
  description: Type.String({
    minLength: 1,
    maxLength: 512,
  }),
  severity: Type.Optional(Type.String({ enum: ["info", "warning", "critical"] })),
  toolName: Type.Optional(Type.String()),
  toolCallId: Type.Optional(Type.String()),
  allowedDecisions: Type.Optional(
    Type.Array(Type.String({ enum: ["allow-once", "allow-always", "deny"] }), {
      minItems: 1,
      maxItems: 3,
    }),
  ),
  agentId: Type.Optional(Type.String()),
  sessionKey: Type.Optional(Type.String()),
  approvalReviewerDeviceIds: Type.Optional(
    Type.Array(NonEmptyString, {
      description:
        "Trusted approval-runtime metadata naming operator devices that may review this approval; ordinary Gateway clients may send the field, but the Gateway only binds it for internal approval-runtime requests.",
    }),
  ),
  turnSourceChannel: Type.Optional(Type.String()),
  turnSourceTo: Type.Optional(Type.String()),
  turnSourceAccountId: Type.Optional(Type.String()),
  turnSourceThreadId: Type.Optional(Type.Union([Type.String(), Type.Number()])),
  timeoutMs: Type.Optional(
    Type.Integer({
      minimum: 1,
      maximum: 6e5,
    }),
  ),
  twoPhase: Type.Optional(Type.Boolean()),
});
/** Reviewer decision payload resolving one pending plugin approval request. */
const PluginApprovalResolveParamsSchema = closedObject({
  id: NonEmptyString,
  decision: NonEmptyString,
});
//#endregion
//#region packages/gateway-protocol/src/schema/plugins.ts
/**
 * Plugin control-surface protocol schemas.
 *
 * These payloads let the gateway expose plugin-provided UI actions without
 * baking plugin-specific payload shapes into the core protocol.
 */
/** Arbitrary plugin-owned JSON payload carried opaquely through the gateway. */
const PluginJsonValueSchema = Type.Unknown();
/** Descriptor for one plugin-provided control UI action or surface. */
const PluginControlUiDescriptorSchema = closedObject({
  id: NonEmptyString,
  pluginId: NonEmptyString,
  pluginName: Type.Optional(NonEmptyString),
  surface: Type.Union([
    Type.Literal("session"),
    Type.Literal("tool"),
    Type.Literal("run"),
    Type.Literal("settings"),
  ]),
  label: NonEmptyString,
  description: Type.Optional(Type.String()),
  placement: Type.Optional(Type.String()),
  schema: Type.Optional(PluginJsonValueSchema),
  requiredScopes: Type.Optional(Type.Array(NonEmptyString)),
});
/** Empty request payload for listing plugin UI descriptors. */
const PluginsUiDescriptorsParamsSchema = closedObject({});
/** Response payload containing all plugin UI descriptors visible to the client. */
const PluginsUiDescriptorsResultSchema = closedObject({
  ok: Type.Literal(true),
  descriptors: Type.Array(PluginControlUiDescriptorSchema),
});
/** Request payload for invoking one plugin-owned session action. */
const PluginsSessionActionParamsSchema = closedObject({
  pluginId: NonEmptyString,
  actionId: NonEmptyString,
  sessionKey: Type.Optional(NonEmptyString),
  payload: Type.Optional(PluginJsonValueSchema),
});
/** Successful plugin action result, optionally continuing the agent turn. */
const PluginsSessionActionSuccessResultSchema = closedObject({
  ok: Type.Literal(true),
  result: Type.Optional(PluginJsonValueSchema),
  continueAgent: Type.Optional(Type.Boolean()),
  reply: Type.Optional(PluginJsonValueSchema),
});
/** Failed plugin action result with plugin-owned detail payload. */
const PluginsSessionActionFailureResultSchema = closedObject({
  ok: Type.Literal(false),
  error: Type.String(),
  code: Type.Optional(Type.String()),
  details: Type.Optional(PluginJsonValueSchema),
});
/** Discriminated plugin action result returned to gateway clients. */
const PluginsSessionActionResultSchema = Type.Union([
  PluginsSessionActionSuccessResultSchema,
  PluginsSessionActionFailureResultSchema,
]);
/** ClawHub-backed install action for one catalog entry. */
const PluginCatalogClawHubInstallSchema = closedObject({
  source: Type.Literal("clawhub"),
  packageName: NonEmptyString,
});
/** Official-catalog install action for one catalog entry. */
const PluginCatalogOfficialInstallSchema = closedObject({
  source: Type.Literal("official"),
  pluginId: NonEmptyString,
});
const PluginCatalogInstallActionSchema = Type.Union([
  PluginCatalogClawHubInstallSchema,
  PluginCatalogOfficialInstallSchema,
]);
/** Cold control-plane representation of an installed or available plugin. */
const PluginCatalogEntrySchema = closedObject({
  id: NonEmptyString,
  name: NonEmptyString,
  packageName: Type.Optional(NonEmptyString),
  description: Type.Optional(Type.String()),
  version: Type.Optional(NonEmptyString),
  kind: Type.Optional(Type.Array(NonEmptyString)),
  origin: Type.Optional(NonEmptyString),
  installed: Type.Boolean(),
  enabled: Type.Boolean(),
  state: Type.Union([
    Type.Literal("enabled"),
    Type.Literal("disabled"),
    Type.Literal("not-installed"),
    Type.Literal("error"),
  ]),
  featured: Type.Optional(Type.Boolean()),
  order: Type.Optional(Type.Number()),
  install: Type.Optional(PluginCatalogInstallActionSchema),
  error: Type.Optional(Type.String()),
  /** Coarse manifest-derived grouping (channel, provider, memory, ...) for catalog UIs. */
  category: Type.Optional(NonEmptyString),
  /** True when the plugin has an install record and can be removed via plugins.uninstall. */
  removable: Type.Optional(Type.Boolean()),
});
/** Empty request payload for the cold plugin catalog. */
const PluginsListParamsSchema = closedObject({});
/** Installed and curated plugin catalog visible to the current gateway client. */
const PluginsListResultSchema = closedObject({
  plugins: Type.Array(PluginCatalogEntrySchema),
  diagnostics: Type.Array(Type.Unknown()),
  mutationAllowed: Type.Boolean(),
});
/** Request payload for searching installable ClawHub plugin families. */
const PluginsSearchParamsSchema = closedObject({
  query: NonEmptyString,
  limit: Type.Optional(
    Type.Integer({
      minimum: 1,
      maximum: 100,
    }),
  ),
});
/** ClawHub package fields exposed by plugin search. */
const PluginSearchPackageSchema = closedObject({
  name: NonEmptyString,
  displayName: NonEmptyString,
  family: Type.Union([Type.Literal("code-plugin"), Type.Literal("bundle-plugin")]),
  channel: Type.Union([
    Type.Literal("official"),
    Type.Literal("community"),
    Type.Literal("private"),
  ]),
  isOfficial: Type.Boolean(),
  summary: Type.Optional(Type.String()),
  latestVersion: Type.Optional(NonEmptyString),
  runtimeId: Type.Optional(NonEmptyString),
  downloads: Type.Optional(Type.Number({ minimum: 0 })),
  verificationTier: Type.Optional(NonEmptyString),
});
/** Ranked ClawHub plugin search hit. */
const PluginSearchResultEntrySchema = closedObject({
  score: Type.Number(),
  package: PluginSearchPackageSchema,
});
/** Ranked installable plugin packages matching the query. */
const PluginsSearchResultSchema = closedObject({
  results: Type.Array(PluginSearchResultEntrySchema),
});
/** Trusted official-catalog or acknowledged ClawHub install request. */
const PluginsInstallParamsSchema = Type.Union([
  closedObject({
    source: Type.Literal("clawhub"),
    packageName: NonEmptyString,
    version: Type.Optional(NonEmptyString),
    acknowledgeClawHubRisk: Type.Optional(Type.Boolean()),
  }),
  closedObject({
    source: Type.Literal("official"),
    pluginId: NonEmptyString,
  }),
]);
/** Successful plugin installation result. */
const PluginsInstallResultSchema = closedObject({
  ok: Type.Literal(true),
  plugin: PluginCatalogEntrySchema,
  restartRequired: Type.Literal(true),
  warnings: Type.Optional(Type.Array(Type.String())),
});
/** Request payload for removing one installed plugin and its managed files. */
const PluginsUninstallParamsSchema = closedObject({ pluginId: NonEmptyString });
/** Successful plugin removal result listing the cleanup actions that ran. */
const PluginsUninstallResultSchema = closedObject({
  ok: Type.Literal(true),
  pluginId: NonEmptyString,
  restartRequired: Type.Literal(true),
  removed: Type.Array(Type.String()),
  warnings: Type.Optional(Type.Array(Type.String())),
});
/** Request payload for changing one installed plugin's policy state. */
const PluginsSetEnabledParamsSchema = closedObject({
  pluginId: NonEmptyString,
  enabled: Type.Boolean(),
});
/** Successful plugin enablement policy update. */
const PluginsSetEnabledResultSchema = closedObject({
  ok: Type.Literal(true),
  plugin: PluginCatalogEntrySchema,
  restartRequired: Type.Boolean(),
  warnings: Type.Optional(Type.Array(Type.String())),
});
//#endregion
//#region packages/gateway-protocol/src/schema/protocol-schemas-node-invoke.ts
const NodeInvokeProtocolSchemas = {
  NodeInvokeParams: NodeInvokeParamsSchema,
  NodeInvokeInputEvent: NodeInvokeInputEventSchema,
  NodeInvokeProgressParams: NodeInvokeProgressParamsSchema,
  NodeInvokeResultParams: NodeInvokeResultParamsSchema,
  NodeInvokeRequestEvent: NodeInvokeRequestEventSchema,
};
//#endregion
//#region packages/gateway-protocol/src/schema/protocol-schemas-node-presence.ts
const NodePresenceProtocolSchemas = {
  NodePresenceAliveReason: NodePresenceAliveReasonSchema,
  NodePresenceActivityPayload: NodePresenceActivityPayloadSchema,
};
//#endregion
//#region packages/gateway-protocol/src/schema/push.ts
/**
 * Push-notification protocol schemas.
 *
 * APNS test schemas exercise native push routing; Web Push schemas describe the
 * browser subscription lifecycle exposed by the gateway.
 */
const ApnsEnvironmentSchema = Type.String({ enum: ["sandbox", "production"] });
/** Request payload for sending a test APNS notification to one node. */
const PushTestParamsSchema = closedObject({
  nodeId: NonEmptyString,
  title: Type.Optional(Type.String()),
  body: Type.Optional(Type.String()),
  environment: Type.Optional(ApnsEnvironmentSchema),
});
/** Result payload from an APNS push test, including provider status and transport. */
const PushTestResultSchema = closedObject({
  ok: Type.Boolean(),
  status: Type.Integer(),
  apnsId: Type.Optional(Type.String()),
  reason: Type.Optional(Type.String()),
  tokenSuffix: Type.String(),
  topic: Type.String(),
  environment: ApnsEnvironmentSchema,
  transport: Type.String({ enum: ["direct", "relay"] }),
});
const WebPushKeysSchema = closedObject({
  p256dh: Type.String({
    minLength: 1,
    maxLength: 512,
  }),
  auth: Type.String({
    minLength: 1,
    maxLength: 512,
  }),
});
/** Empty request payload for fetching the Web Push VAPID public key. */
const WebPushVapidPublicKeyParamsSchema = closedObject({});
/** Browser Web Push subscription payload registered with the gateway. */
const WebPushSubscribeParamsSchema = closedObject({
  endpoint: Type.String({
    minLength: 1,
    maxLength: 2048,
    pattern: "^https://",
  }),
  keys: WebPushKeysSchema,
});
/** Browser Web Push endpoint removal payload. */
const WebPushUnsubscribeParamsSchema = closedObject({
  endpoint: Type.String({
    minLength: 1,
    maxLength: 2048,
    pattern: "^https://",
  }),
});
/** Request payload for sending a test Web Push notification to current subscriptions. */
const WebPushTestParamsSchema = closedObject({
  title: Type.Optional(Type.String()),
  body: Type.Optional(Type.String()),
});
closedObject({});
/** Request payload for resolving the secrets needed by one command invocation. */
const SecretsResolveParamsSchema = closedObject({
  commandName: NonEmptyString,
  targetIds: Type.Array(NonEmptyString),
  allowedPaths: Type.Optional(Type.Array(NonEmptyString)),
  forcedActivePaths: Type.Optional(Type.Array(NonEmptyString)),
  optionalActivePaths: Type.Optional(Type.Array(NonEmptyString)),
  providerOverrides: Type.Optional(
    closedObject({
      webSearch: Type.Optional(NonEmptyString),
      webFetch: Type.Optional(NonEmptyString),
    }),
  ),
});
/** One resolved secret assignment path plus its provider-owned value. */
const SecretsResolveAssignmentSchema = closedObject({
  path: Type.Optional(NonEmptyString),
  pathSegments: Type.Array(NonEmptyString),
  value: Type.Unknown(),
});
/** Secret resolution response with assignments and safe diagnostics. */
const SecretsResolveResultSchema = closedObject({
  ok: Type.Optional(Type.Boolean()),
  assignments: Type.Optional(Type.Array(SecretsResolveAssignmentSchema)),
  diagnostics: Type.Optional(Type.Array(NonEmptyString)),
  inactiveRefPaths: Type.Optional(Type.Array(NonEmptyString)),
});
//#endregion
//#region packages/gateway-protocol/src/schema/session-placement.ts
/** Durable gateway ownership states for one session execution placement. */
const SessionPlacementStateSchema = Type.Union([
  Type.Literal("local"),
  Type.Literal("requested"),
  Type.Literal("provisioning"),
  Type.Literal("syncing"),
  Type.Literal("starting"),
  Type.Literal("active"),
  Type.Literal("draining"),
  Type.Literal("reconciling"),
  Type.Literal("reclaimed"),
  Type.Literal("failed"),
]);
const SessionPlacementTimingProperties = {
  generation: Type.Integer({
    minimum: 0,
    maximum: Number.MAX_SAFE_INTEGER,
  }),
  createdAtMs: Type.Integer({
    minimum: 0,
    maximum: Number.MAX_SAFE_INTEGER,
  }),
  updatedAtMs: Type.Integer({
    minimum: 0,
    maximum: Number.MAX_SAFE_INTEGER,
  }),
  stateChangedAtMs: Type.Integer({
    minimum: 0,
    maximum: Number.MAX_SAFE_INTEGER,
  }),
};
const SessionPlacementOwnerEpochSchema = Type.Integer({
  minimum: 1,
  maximum: Number.MAX_SAFE_INTEGER,
});
const WorkerBundleHashSchema = Type.String({
  minLength: 64,
  maxLength: 64,
  pattern: "^[a-f0-9]{64}$",
});
const SessionPlacementWorkspaceProperties = {
  workspaceBaseManifestRef: NonEmptyString,
  remoteWorkspaceDir: NonEmptyString,
};
const SessionPlacementAckProperties = {
  lastTranscriptAckCursor: Type.Optional(
    Type.Integer({
      minimum: 0,
      maximum: Number.MAX_SAFE_INTEGER,
    }),
  ),
  lastLiveEventAckCursor: Type.Optional(
    Type.Integer({
      minimum: 0,
      maximum: Number.MAX_SAFE_INTEGER,
    }),
  ),
};
const TerminalSessionPlacementProperties = {
  environmentId: Type.Optional(NonEmptyString),
  activeOwnerEpoch: Type.Optional(SessionPlacementOwnerEpochSchema),
  workspaceBaseManifestRef: Type.Optional(NonEmptyString),
  remoteWorkspaceDir: Type.Optional(NonEmptyString),
  workerBundleHash: Type.Optional(WorkerBundleHashSchema),
  ...SessionPlacementAckProperties,
};
function createUnownedSessionPlacementSchema(state) {
  return Type.Object(
    {
      state: Type.Literal(state),
      ...SessionPlacementTimingProperties,
    },
    { additionalProperties: false },
  );
}
function createWorkerOwnedSessionPlacementSchema(state) {
  return Type.Object(
    {
      state: Type.Literal(state),
      ...SessionPlacementTimingProperties,
      environmentId: NonEmptyString,
      activeOwnerEpoch: SessionPlacementOwnerEpochSchema,
      workerBundleHash: WorkerBundleHashSchema,
      ...SessionPlacementWorkspaceProperties,
      ...SessionPlacementAckProperties,
    },
    { additionalProperties: false },
  );
}
const LocalSessionPlacementSchema = createUnownedSessionPlacementSchema("local");
const RequestedSessionPlacementSchema = createUnownedSessionPlacementSchema("requested");
const ProvisioningSessionPlacementSchema = Type.Object(
  {
    state: Type.Literal("provisioning"),
    ...SessionPlacementTimingProperties,
    environmentId: Type.Optional(NonEmptyString),
  },
  { additionalProperties: false },
);
const SyncingSessionPlacementSchema = Type.Object(
  {
    state: Type.Literal("syncing"),
    ...SessionPlacementTimingProperties,
    environmentId: NonEmptyString,
    workerBundleHash: WorkerBundleHashSchema,
  },
  { additionalProperties: false },
);
const StartingSessionPlacementSchema = Type.Object(
  {
    state: Type.Literal("starting"),
    ...SessionPlacementTimingProperties,
    environmentId: NonEmptyString,
    workerBundleHash: WorkerBundleHashSchema,
    ...SessionPlacementWorkspaceProperties,
  },
  { additionalProperties: false },
);
const ActiveWorkerSessionPlacementSchema = createWorkerOwnedSessionPlacementSchema("active");
const DrainingSessionPlacementSchema = createWorkerOwnedSessionPlacementSchema("draining");
const ReconcilingSessionPlacementSchema = createWorkerOwnedSessionPlacementSchema("reconciling");
const ReclaimedSessionPlacementSchema = Type.Object(
  {
    state: Type.Literal("reclaimed"),
    ...SessionPlacementTimingProperties,
    ...TerminalSessionPlacementProperties,
  },
  { additionalProperties: false },
);
const FailedSessionPlacementSchema = Type.Object(
  {
    state: Type.Literal("failed"),
    ...SessionPlacementTimingProperties,
    ...TerminalSessionPlacementProperties,
    recoveryError: NonEmptyString,
  },
  { additionalProperties: false },
);
/** Gateway-visible placement projection; `state` remains the closed discriminator. */
const SessionPlacementSchema = Type.Union([
  LocalSessionPlacementSchema,
  RequestedSessionPlacementSchema,
  ProvisioningSessionPlacementSchema,
  SyncingSessionPlacementSchema,
  StartingSessionPlacementSchema,
  ActiveWorkerSessionPlacementSchema,
  DrainingSessionPlacementSchema,
  ReconcilingSessionPlacementSchema,
  ReclaimedSessionPlacementSchema,
  FailedSessionPlacementSchema,
]);
/** Requests one-way dispatch of an existing local session to a configured worker profile. */
const SessionsDispatchParamsSchema = Type.Object(
  {
    key: NonEmptyString,
    agentId: Type.Optional(NonEmptyString),
    profileId: NonEmptyString,
  },
  { additionalProperties: false },
);
/** Result returned once session dispatch reaches durable worker ownership. */
const SessionsDispatchResultSchema = Type.Object(
  {
    ok: Type.Literal(true),
    key: NonEmptyString,
    sessionId: NonEmptyString,
    placement: ActiveWorkerSessionPlacementSchema,
  },
  { additionalProperties: false },
);
const SessionPlacementProtocolSchemas = {
  SessionPlacementState: SessionPlacementStateSchema,
  LocalSessionPlacement: LocalSessionPlacementSchema,
  RequestedSessionPlacement: RequestedSessionPlacementSchema,
  ProvisioningSessionPlacement: ProvisioningSessionPlacementSchema,
  SyncingSessionPlacement: SyncingSessionPlacementSchema,
  StartingSessionPlacement: StartingSessionPlacementSchema,
  ActiveWorkerSessionPlacement: ActiveWorkerSessionPlacementSchema,
  DrainingSessionPlacement: DrainingSessionPlacementSchema,
  ReconcilingSessionPlacement: ReconcilingSessionPlacementSchema,
  ReclaimedSessionPlacement: ReclaimedSessionPlacementSchema,
  FailedSessionPlacement: FailedSessionPlacementSchema,
  SessionPlacement: SessionPlacementSchema,
  SessionsDispatchParams: SessionsDispatchParamsSchema,
  SessionsDispatchResult: SessionsDispatchResultSchema,
};
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-catalog.ts
const SessionCatalogErrorSchema = closedObject({
  code: NonEmptyString,
  message: NonEmptyString,
});
const SessionCatalogCapabilitiesSchema = closedObject({
  continueSession: Type.Boolean(),
  archive: Type.Boolean(),
  createSession: Type.Optional(closedObject({ model: NonEmptyString })),
  openTerminal: Type.Optional(Type.Boolean()),
});
const SessionCatalogDescriptorSchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  capabilities: SessionCatalogCapabilitiesSchema,
});
const SessionCatalogSessionSchema = closedObject({
  threadId: NonEmptyString,
  name: Type.Optional(Type.String()),
  cwd: Type.Optional(Type.String()),
  status: NonEmptyString,
  createdAt: Type.Optional(Type.Number()),
  updatedAt: Type.Optional(Type.Number()),
  recencyAt: Type.Optional(Type.Number()),
  source: Type.Optional(Type.String()),
  modelProvider: Type.Optional(Type.String()),
  cliVersion: Type.Optional(Type.String()),
  gitBranch: Type.Optional(Type.String()),
  archived: Type.Boolean(),
  openClawSessionKey: Type.Optional(NonEmptyString),
  canContinue: Type.Boolean(),
  canArchive: Type.Boolean(),
  canOpenTerminal: Type.Optional(Type.Boolean()),
});
const SessionCatalogHostSchema = closedObject({
  hostId: NonEmptyString,
  label: NonEmptyString,
  kind: Type.Union([Type.Literal("gateway"), Type.Literal("node")]),
  connected: Type.Boolean(),
  nodeId: Type.Optional(NonEmptyString),
  sessions: Type.Array(SessionCatalogSessionSchema),
  nextCursor: Type.Optional(Type.String()),
  error: Type.Optional(SessionCatalogErrorSchema),
});
const SessionCatalogSchema = closedObject({
  id: NonEmptyString,
  label: NonEmptyString,
  capabilities: SessionCatalogCapabilitiesSchema,
  hosts: Type.Array(SessionCatalogHostSchema),
  error: Type.Optional(SessionCatalogErrorSchema),
});
const SessionsCatalogListCommonProperties = {
  agentId: Type.Optional(NonEmptyString),
  search: Type.Optional(Type.String()),
  limitPerHost: Type.Optional(Type.Integer({ minimum: 1 })),
  hostIds: Type.Optional(Type.Array(NonEmptyString)),
};
const SessionsCatalogListParamsSchema = Type.Union([
  closedObject({
    catalogId: Type.Optional(NonEmptyString),
    ...SessionsCatalogListCommonProperties,
  }),
  closedObject({
    catalogId: NonEmptyString,
    cursors: Type.Record(NonEmptyString, Type.String()),
    ...SessionsCatalogListCommonProperties,
  }),
]);
const SessionsCatalogListResultSchema = closedObject({
  catalogs: Type.Array(SessionCatalogSchema),
});
const SessionCatalogTranscriptItemSchema = closedObject({
  id: Type.Optional(Type.String()),
  type: Type.Union([
    Type.Literal("userMessage"),
    Type.Literal("agentMessage"),
    Type.Literal("reasoning"),
    Type.Literal("toolCall"),
    Type.Literal("toolResult"),
    Type.Literal("other"),
  ]),
  text: Type.Optional(Type.String()),
  timestamp: Type.Optional(Type.String()),
  model: Type.Optional(Type.String()),
  truncated: Type.Optional(Type.Boolean()),
  raw: Type.Optional(PluginJsonValueSchema),
});
const SessionsCatalogReadParamsSchema = closedObject({
  catalogId: NonEmptyString,
  hostId: NonEmptyString,
  threadId: NonEmptyString,
  limit: Type.Optional(Type.Integer({ minimum: 1 })),
  cursor: Type.Optional(Type.String()),
});
const SessionsCatalogReadResultSchema = closedObject({
  hostId: NonEmptyString,
  label: Type.Optional(Type.String()),
  threadId: NonEmptyString,
  items: Type.Array(SessionCatalogTranscriptItemSchema),
  nextCursor: Type.Optional(Type.String()),
});
const SessionsCatalogContinueParamsSchema = closedObject({
  catalogId: NonEmptyString,
  hostId: NonEmptyString,
  threadId: NonEmptyString,
});
const SessionsCatalogContinueResultSchema = closedObject({ sessionKey: NonEmptyString });
const SessionsCatalogArchiveParamsSchema = closedObject({
  catalogId: NonEmptyString,
  hostId: NonEmptyString,
  threadId: NonEmptyString,
  confirmNoOtherRunner: Type.Literal(true),
});
const SessionsCatalogArchiveResultSchema = closedObject({ ok: Type.Literal(true) });
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-create.ts
/** Creates or adopts a session with optional model, label, and parent linkage. */
const SessionsCreateParamsSchema = closedObject({
  key: Type.Optional(NonEmptyString),
  agentId: Type.Optional(NonEmptyString),
  label: Type.Optional(SessionLabelString),
  model: Type.Optional(NonEmptyString),
  catalogId: Type.Optional(NonEmptyString),
  parentSessionKey: Type.Optional(NonEmptyString),
  fork: Type.Optional(
    Type.Boolean({ description: "Fork the parent transcript; requires parentSessionKey." }),
  ),
  emitCommandHooks: Type.Optional(Type.Boolean()),
  task: Type.Optional(Type.String()),
  message: Type.Optional(Type.String()),
  attachments: Type.Optional(ChatAttachmentsSchema),
  worktree: Type.Optional(Type.Boolean()),
  worktreeBaseRef: Type.Optional(
    Type.String({
      minLength: 1,
      description: "Base ref for the new managed worktree branch. Requires worktree=true.",
    }),
  ),
  worktreeName: Type.Optional(
    Type.String({
      pattern: "^[a-z0-9][a-z0-9-]{0,63}$",
      description: "Managed worktree name; becomes branch openclaw/<name>. Requires worktree=true.",
    }),
  ),
  execNode: Type.Optional(
    Type.String({
      minLength: 1,
      description:
        "Bind session exec to host=node with this node id/name. Requires operator.admin.",
    }),
  ),
  cwd: Type.Optional(
    Type.String({
      minLength: 1,
      description:
        "Absolute source directory for a managed worktree, or the working directory on execNode. Requires operator.admin.",
    }),
  ),
});
//#endregion
//#region packages/gateway-protocol/src/schema/sessions.ts
/**
 * Session protocol schemas.
 *
 * These requests and results cover transcript discovery, lifecycle control,
 * compaction checkpoints, per-session plugin state, and usage reporting. The
 * schemas are shared by dashboard, CLI, ACP, and gateway RPC callers.
 */
/** Reason a compaction checkpoint was created. */
const SessionCompactionCheckpointReasonSchema = Type.Union([
  Type.Literal("manual"),
  Type.Literal("auto-threshold"),
  Type.Literal("overflow-retry"),
  Type.Literal("timeout-retry"),
]);
closedObject({
  operationId: NonEmptyString,
  operation: Type.Literal("compact"),
  phase: Type.Union([Type.Literal("start"), Type.Literal("end")]),
  sessionKey: NonEmptyString,
  agentId: Type.Optional(NonEmptyString),
  ts: Type.Integer({ minimum: 0 }),
  completed: Type.Optional(Type.Boolean()),
  reason: Type.Optional(Type.String()),
});
/** Reference to the transcript location before or after compaction. */
const SessionCompactionTranscriptReferenceSchema = closedObject({
  sessionId: NonEmptyString,
  sessionFile: Type.Optional(NonEmptyString),
  leafId: Type.Optional(NonEmptyString),
  entryId: Type.Optional(NonEmptyString),
});
/** Stored compaction checkpoint metadata for branching or restoring a session. */
const SessionCompactionCheckpointSchema = closedObject({
  checkpointId: NonEmptyString,
  sessionKey: NonEmptyString,
  sessionId: NonEmptyString,
  createdAt: Type.Integer({ minimum: 0 }),
  reason: SessionCompactionCheckpointReasonSchema,
  tokensBefore: Type.Optional(Type.Integer({ minimum: 0 })),
  tokensAfter: Type.Optional(Type.Integer({ minimum: 0 })),
  summary: Type.Optional(Type.String()),
  firstKeptEntryId: Type.Optional(NonEmptyString),
  preCompaction: SessionCompactionTranscriptReferenceSchema,
  postCompaction: SessionCompactionTranscriptReferenceSchema,
});
/** Session file grouping used by the Control UI session workspace rail. */
const SessionFileKindSchema = Type.Union([Type.Literal("modified"), Type.Literal("read")]);
/** Session relevance marker for browser entries. */
const SessionFileRelevanceSchema = Type.Union([
  Type.Literal("modified"),
  Type.Literal("read"),
  Type.Literal("mixed"),
]);
const SessionFileHashSchema = Type.String({
  minLength: 64,
  maxLength: 64,
  pattern: "^[a-f0-9]{64}$",
});
/** One file path referenced by a session transcript. */
const SessionFileEntrySchema = closedObject({
  path: NonEmptyString,
  workspacePath: Type.Optional(NonEmptyString),
  name: NonEmptyString,
  kind: SessionFileKindSchema,
  missing: Type.Boolean(),
  size: Type.Optional(Type.Integer({ minimum: 0 })),
  updatedAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
  content: Type.Optional(Type.String()),
  hash: Type.Optional(SessionFileHashSchema),
});
/** One file or folder in the session-rooted browser. */
const SessionFileBrowserEntrySchema = closedObject({
  path: Type.String(),
  name: NonEmptyString,
  kind: Type.Union([Type.Literal("file"), Type.Literal("directory")]),
  sessionKind: Type.Optional(SessionFileRelevanceSchema),
  size: Type.Optional(Type.Integer({ minimum: 0 })),
  updatedAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
});
/** Folder listing or search result rooted at the session workspace. */
const SessionFileBrowserResultSchema = closedObject({
  path: Type.String(),
  parentPath: Type.Optional(Type.String()),
  search: Type.Optional(Type.String()),
  entries: Type.Array(SessionFileBrowserEntrySchema),
  truncated: Type.Optional(Type.Boolean()),
});
/** Lists files touched by a session transcript. */
const SessionsFilesListParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type.Optional(NonEmptyString),
  path: Type.Optional(Type.String()),
  search: Type.Optional(Type.String()),
});
/** File references visible in one session workspace. */
const SessionsFilesListResultSchema = closedObject({
  sessionKey: NonEmptyString,
  root: Type.Optional(NonEmptyString),
  files: Type.Array(SessionFileEntrySchema),
  browser: Type.Optional(SessionFileBrowserResultSchema),
});
/** Reads one session-referenced file by path. */
const SessionsFilesGetParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  path: NonEmptyString,
  agentId: Type.Optional(NonEmptyString),
});
/** Result for reading one session-referenced file. */
const SessionsFilesGetResultSchema = closedObject({
  sessionKey: NonEmptyString,
  root: Type.Optional(NonEmptyString),
  file: SessionFileEntrySchema,
});
/** Overwrites one existing session workspace file with hash-based CAS. */
const SessionsFilesSetParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  path: NonEmptyString,
  agentId: Type.Optional(NonEmptyString),
  content: Type.String(),
  expectedHash: SessionFileHashSchema,
});
/** Result for overwriting one session workspace file. */
const SessionsFilesSetResultSchema = closedObject({
  sessionKey: NonEmptyString,
  root: Type.Optional(NonEmptyString),
  file: SessionFileEntrySchema,
});
/** Change status for one file in a session checkout diff. */
const SessionDiffFileStatusSchema = Type.Union([
  Type.Literal("added"),
  Type.Literal("modified"),
  Type.Literal("deleted"),
  Type.Literal("renamed"),
]);
/** One changed file in a session checkout diff. */
const SessionDiffFileSchema = closedObject({
  path: NonEmptyString,
  oldPath: Type.Optional(NonEmptyString),
  status: SessionDiffFileStatusSchema,
  additions: Type.Integer({ minimum: 0 }),
  deletions: Type.Integer({ minimum: 0 }),
  binary: Type.Optional(Type.Boolean()),
  untracked: Type.Optional(Type.Boolean()),
  /** Per-file unified patch text; absent for binary or oversized files. */
  patch: Type.Optional(Type.String()),
  truncated: Type.Optional(Type.Boolean()),
});
/** Reads the git diff of a session checkout against its base branch. */
const SessionsDiffParamsSchema = closedObject({
  sessionKey: NonEmptyString,
  agentId: Type.Optional(NonEmptyString),
});
/** Branch + working-tree diff for one session checkout. */
const SessionsDiffResultSchema = closedObject({
  sessionKey: NonEmptyString,
  root: Type.Optional(NonEmptyString),
  branch: Type.Optional(NonEmptyString),
  /** Display label of the diff base: the default branch name or "HEAD". */
  baseRef: Type.Optional(NonEmptyString),
  files: Type.Array(SessionDiffFileSchema),
  additions: Type.Integer({ minimum: 0 }),
  deletions: Type.Integer({ minimum: 0 }),
  truncated: Type.Optional(Type.Boolean()),
  unavailableReason: Type.Optional(
    Type.Union([Type.Literal("unknown_session"), Type.Literal("not_git")]),
  ),
});
/** Lists sessions with optional scope, activity, label, and preview filters. */
const SessionsListParamsSchema = closedObject({
  /**
   * Maximum rows to return. Omitted Gateway RPC calls use a bounded default
   * to keep large session stores from monopolizing the event loop.
   */
  limit: Type.Optional(Type.Integer({ minimum: 1 })),
  offset: Type.Optional(Type.Integer({ minimum: 0 })),
  activeMinutes: Type.Optional(Type.Integer({ minimum: 1 })),
  includeGlobal: Type.Optional(Type.Boolean()),
  includeUnknown: Type.Optional(Type.Boolean()),
  /**
   * Limit returned agent-scoped rows to agents currently present in config.
   * Broad disk discovery remains the default for recovery/ACP consumers.
   */
  configuredAgentsOnly: Type.Optional(Type.Boolean()),
  /**
   * Read first 8KB of each session transcript to derive title from first user message.
   * Performs a file read per session - use `limit` to bound result set on large stores.
   */
  includeDerivedTitles: Type.Optional(Type.Boolean()),
  /**
   * Read last 16KB of each session transcript to extract most recent message preview.
   * Performs a file read per session - use `limit` to bound result set on large stores.
   */
  includeLastMessage: Type.Optional(Type.Boolean()),
  label: Type.Optional(SessionLabelString),
  spawnedBy: Type.Optional(NonEmptyString),
  agentId: Type.Optional(NonEmptyString),
  search: Type.Optional(Type.String()),
  /** True lists archived sessions; false or omitted lists active sessions. */
  archived: Type.Optional(Type.Boolean()),
});
/** Searches one agent's indexed session transcripts, optionally within selected sessions. */
const SessionsSearchParamsSchema = closedObject({
  agentId: Type.Optional(NonEmptyString),
  sessionKeys: Type.Optional(
    Type.Array(NonEmptyString, {
      minItems: 1,
      maxItems: 200,
    }),
  ),
  query: Type.String({
    minLength: 1,
    maxLength: 4096,
  }),
  limit: Type.Optional(
    Type.Integer({
      minimum: 1,
      maximum: 25,
    }),
  ),
});
/** One full-text session transcript match with follow-up provenance. */
const SessionsSearchHitSchema = closedObject({
  sessionKey: NonEmptyString,
  sessionId: NonEmptyString,
  messageId: NonEmptyString,
  role: Type.Union([Type.Literal("user"), Type.Literal("assistant")]),
  timestamp: Type.Integer({ minimum: 0 }),
  snippet: Type.String(),
  score: Type.Number(),
});
/** Full-text search response; indexing marks a still-running first-use reconcile. */
const SessionsSearchResultSchema = closedObject({
  results: Type.Array(SessionsSearchHitSchema),
  indexing: Type.Optional(Type.Boolean()),
  truncated: Type.Optional(Type.Boolean()),
});
/** Repairs or removes invalid session records from the selected agent scope. */
const SessionsCleanupParamsSchema = closedObject({
  agent: Type.Optional(NonEmptyString),
  allAgents: Type.Optional(Type.Boolean()),
  enforce: Type.Optional(Type.Boolean()),
  activeKey: Type.Optional(NonEmptyString),
  fixMissing: Type.Optional(Type.Boolean()),
  fixDmScope: Type.Optional(Type.Boolean()),
});
/** Reads short previews for selected session keys. */
const SessionsPreviewParamsSchema = closedObject({
  keys: Type.Array(NonEmptyString, { minItems: 1 }),
  limit: Type.Optional(Type.Integer({ minimum: 1 })),
  maxChars: Type.Optional(Type.Integer({ minimum: 20 })),
});
/** Describes one session and optional derived title/last-message previews. */
const SessionsDescribeParamsSchema = closedObject({
  key: NonEmptyString,
  includeDerivedTitles: Type.Optional(Type.Boolean()),
  includeLastMessage: Type.Optional(Type.Boolean()),
});
/** Resolves a session by key, raw session id, label, or parent/agent scope. */
const SessionsResolveParamsSchema = closedObject({
  key: Type.Optional(NonEmptyString),
  sessionId: Type.Optional(NonEmptyString),
  label: Type.Optional(SessionLabelString),
  agentId: Type.Optional(NonEmptyString),
  spawnedBy: Type.Optional(NonEmptyString),
  includeGlobal: Type.Optional(Type.Boolean()),
  includeUnknown: Type.Optional(Type.Boolean()),
  /** Return a successful `{ ok: false }` response when the selector does not match a session. */
  allowMissing: Type.Optional(Type.Boolean()),
});
const SessionWorktreeInfoSchema = closedObject({
  id: NonEmptyString,
  path: NonEmptyString,
  branch: NonEmptyString,
});
/** Result returned after creating or adopting a session. */
const SessionsCreateResultSchema = Type.Object(
  {
    ok: Type.Literal(true),
    key: NonEmptyString,
    sessionId: Type.Optional(NonEmptyString),
    entry: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
    runStarted: Type.Optional(Type.Boolean()),
    runError: Type.Optional(ErrorShapeSchema),
    worktree: Type.Optional(SessionWorktreeInfoSchema),
  },
  { additionalProperties: true },
);
/** Sends one message into an existing session. */
const SessionsSendParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type.Optional(NonEmptyString),
  message: Type.String(),
  thinking: Type.Optional(Type.String()),
  attachments: Type.Optional(Type.Array(Type.Unknown())),
  timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
  idempotencyKey: Type.Optional(NonEmptyString),
});
/** Subscribes a client to live message updates for one session. */
const SessionsMessagesSubscribeParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type.Optional(NonEmptyString),
  /** Opt in to sanitized durable approval events for this session and its descendants. */
  includeApprovals: Type.Optional(Type.Literal(true)),
});
/** Removes a live message subscription for one session. */
const SessionsMessagesUnsubscribeParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type.Optional(NonEmptyString),
});
/** Aborts the active or named run for a session. */
const SessionsAbortParamsSchema = closedObject({
  key: Type.Optional(NonEmptyString),
  runId: Type.Optional(NonEmptyString),
  agentId: Type.Optional(NonEmptyString),
});
/** Mutable per-session preferences and routing metadata. */
const SessionsPatchParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type.Optional(NonEmptyString),
  label: Type.Optional(Type.Union([SessionLabelString, Type.Null()])),
  /** User-defined organization bucket ("category", not chat-group); null clears it. */
  category: Type.Optional(Type.Union([SessionLabelString, Type.Null()])),
  archived: Type.Optional(Type.Boolean()),
  pinned: Type.Optional(Type.Boolean()),
  unread: Type.Optional(
    Type.Boolean({ description: "Set true to mark unread; false records the session as read." }),
  ),
  thinkingLevel: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
  fastMode: Type.Optional(Type.Union([Type.Boolean(), Type.Literal("auto"), Type.Null()])),
  verboseLevel: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
  traceLevel: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
  reasoningLevel: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
  responseUsage: Type.Optional(
    Type.Union([
      Type.Literal("off"),
      Type.Literal("tokens"),
      Type.Literal("full"),
      Type.Literal("on"),
      Type.Null(),
    ]),
  ),
  elevatedLevel: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
  execHost: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
  execSecurity: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
  execAsk: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
  execNode: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
  model: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
  spawnedBy: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
  spawnedWorkspaceDir: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
  spawnedCwd: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
  spawnDepth: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
  subagentRole: Type.Optional(
    Type.Union([Type.Literal("orchestrator"), Type.Literal("leaf"), Type.Null()]),
  ),
  subagentControlScope: Type.Optional(
    Type.Union([Type.Literal("children"), Type.Literal("none"), Type.Null()]),
  ),
  inheritedToolAllow: Type.Optional(Type.Union([Type.Array(NonEmptyString), Type.Null()])),
  inheritedToolDeny: Type.Optional(Type.Union([Type.Array(NonEmptyString), Type.Null()])),
  sendPolicy: Type.Optional(Type.Union([Type.Literal("allow"), Type.Literal("deny"), Type.Null()])),
  groupActivation: Type.Optional(
    Type.Union([Type.Literal("mention"), Type.Literal("always"), Type.Null()]),
  ),
});
/** Updates or clears one plugin namespace value on a session record. */
const SessionsPluginPatchParamsSchema = closedObject({
  key: NonEmptyString,
  pluginId: NonEmptyString,
  namespace: NonEmptyString,
  value: Type.Optional(PluginJsonValueSchema),
  unset: Type.Optional(Type.Boolean()),
});
closedObject({
  ok: Type.Literal(true),
  key: NonEmptyString,
  value: Type.Optional(PluginJsonValueSchema),
});
/** Resets a session to a new or reset transcript state. */
const SessionsResetParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type.Optional(NonEmptyString),
  reason: Type.Optional(Type.Union([Type.Literal("new"), Type.Literal("reset")])),
});
/** Deletes a session record and optionally its transcript. */
const SessionsDeleteParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type.Optional(NonEmptyString),
  deleteTranscript: Type.Optional(Type.Boolean()),
  expectedSessionId: Type.Optional(NonEmptyString),
  expectedLifecycleRevision: Type.Optional(NonEmptyString),
  expectedSessionUpdatedAt: Type.Optional(Type.Number({ minimum: 0 })),
  emitLifecycleHooks: Type.Optional(Type.Boolean()),
  /**
   * Restricts the delete to already-archived sessions (archive-then-delete).
   * operator.write callers must set this; deletes without it require
   * operator.admin.
   */
  archivedOnly: Type.Optional(Type.Boolean()),
});
/** Lists the gateway-owned custom session group catalog (names + order). */
const SessionsGroupsListParamsSchema = closedObject({});
/** One custom session group catalog entry. */
const SessionGroupSchema = closedObject({
  name: SessionLabelString,
  position: Type.Integer({ minimum: 0 }),
});
/** Custom session group catalog in display order. */
const SessionsGroupsListResultSchema = closedObject({ groups: Type.Array(SessionGroupSchema) });
/** Replaces the ordered group catalog; creates listed names, keeps member categories untouched. */
const SessionsGroupsPutParamsSchema = closedObject({
  names: Type.Array(SessionLabelString, { maxItems: 200 }),
});
/** Renames a group and repoints every member session's category. */
const SessionsGroupsRenameParamsSchema = closedObject({
  name: SessionLabelString,
  to: SessionLabelString,
});
/** Deletes a group and clears every member session's category. */
const SessionsGroupsDeleteParamsSchema = closedObject({ name: SessionLabelString });
/** Result for group catalog mutations, with member sessions updated where applicable. */
const SessionsGroupsMutationResultSchema = closedObject({
  ok: Type.Literal(true),
  groups: Type.Array(SessionGroupSchema),
  updatedSessions: Type.Optional(Type.Integer({ minimum: 0 })),
});
/** Requests manual compaction for a session transcript. */
const SessionsCompactParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type.Optional(NonEmptyString),
  maxLines: Type.Optional(Type.Integer({ minimum: 1 })),
});
/** Lists compaction checkpoints for one session. */
const SessionsCompactionListParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type.Optional(NonEmptyString),
});
/** Reads one compaction checkpoint by id. */
const SessionsCompactionGetParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type.Optional(NonEmptyString),
  checkpointId: NonEmptyString,
});
/** Creates a new branch from a compaction checkpoint. */
const SessionsCompactionBranchParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type.Optional(NonEmptyString),
  checkpointId: NonEmptyString,
});
/** Restores an existing session to a compaction checkpoint. */
const SessionsCompactionRestoreParamsSchema = closedObject({
  key: NonEmptyString,
  agentId: Type.Optional(NonEmptyString),
  checkpointId: NonEmptyString,
});
closedObject({
  ok: Type.Literal(true),
  key: NonEmptyString,
  checkpoints: Type.Array(SessionCompactionCheckpointSchema),
});
closedObject({
  ok: Type.Literal(true),
  key: NonEmptyString,
  checkpoint: SessionCompactionCheckpointSchema,
});
closedObject({
  ok: Type.Literal(true),
  sourceKey: NonEmptyString,
  key: NonEmptyString,
  sessionId: NonEmptyString,
  checkpoint: SessionCompactionCheckpointSchema,
  entry: Type.Object(
    {
      sessionId: NonEmptyString,
      updatedAt: Type.Integer({ minimum: 0 }),
    },
    { additionalProperties: true },
  ),
});
closedObject({
  ok: Type.Literal(true),
  key: NonEmptyString,
  sessionId: NonEmptyString,
  checkpoint: SessionCompactionCheckpointSchema,
  entry: Type.Object(
    {
      sessionId: NonEmptyString,
      updatedAt: Type.Integer({ minimum: 0 }),
    },
    { additionalProperties: true },
  ),
});
/** Usage report query across one session, one agent, or all agent sessions. */
const SessionsUsageParamsSchema = closedObject({
  /** Specific session key to analyze; if omitted returns sessions for the effective agent. */
  key: Type.Optional(NonEmptyString),
  /** Agent scope for list-style usage queries. */
  agentId: Type.Optional(NonEmptyString),
  /** Explicit all-agent scope for list-style usage queries. */
  agentScope: Type.Optional(Type.Literal("all")),
  /** Start date for range filter (YYYY-MM-DD). */
  startDate: Type.Optional(Type.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" })),
  /** End date for range filter (YYYY-MM-DD). */
  endDate: Type.Optional(Type.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" })),
  /** How start/end dates should be interpreted. Defaults to UTC when omitted. */
  mode: Type.Optional(
    Type.Union([Type.Literal("utc"), Type.Literal("gateway"), Type.Literal("specific")]),
  ),
  /** Preset range for usage queries when explicit start/end dates are omitted. */
  range: Type.Optional(
    Type.Union([
      Type.Literal("7d"),
      Type.Literal("30d"),
      Type.Literal("90d"),
      Type.Literal("1y"),
      Type.Literal("all"),
    ]),
  ),
  /** Usage row grouping. `family` rolls up known rotated session ids for a logical key. */
  groupBy: Type.Optional(Type.Union([Type.Literal("instance"), Type.Literal("family")])),
  /** Backward-compatible alias for requesting family grouping. */
  includeHistorical: Type.Optional(Type.Boolean()),
  /** UTC offset to use when mode is `specific` (for example, UTC-4 or UTC+5:30). */
  utcOffset: Type.Optional(Type.String({ pattern: "^UTC[+-]\\d{1,2}(?::[0-5]\\d)?$" })),
  /** IANA time zone for `specific`; preferred over `utcOffset`, which remains a compatibility fallback. */
  timeZone: Type.Optional(NonEmptyString),
  /** Maximum sessions to return (default 50). */
  limit: Type.Optional(Type.Integer({ minimum: 1 })),
  /** Include context weight breakdown (systemPromptReport). */
  includeContextWeight: Type.Optional(Type.Boolean()),
});
//#endregion
//#region packages/gateway-protocol/src/schema/skill-protocol-schemas.ts
const SkillWorkshopProtocolSchemas = {
  SkillsProposalsListParams: SkillsProposalsListParamsSchema,
  SkillsProposalsListResult: SkillsProposalsListResultSchema,
  SkillsProposalHistoryStatusParams: SkillsProposalHistoryStatusParamsSchema,
  SkillsProposalHistoryScanParams: SkillsProposalHistoryScanParamsSchema,
  SkillsProposalHistoryScanResult: SkillsProposalHistoryScanResultSchema,
};
//#endregion
//#region packages/gateway-protocol/src/schema/system-info.ts
/** Empty request payload for Gateway host system information. */
const SystemInfoParamsSchema = closedObject({});
/** Gateway host identity and resource snapshot. */
const SystemInfoResultSchema = closedObject({
  machineName: Type.String(),
  hostname: Type.String(),
  platform: Type.String(),
  release: Type.String(),
  arch: Type.String(),
  osLabel: Type.String(),
  lanAddress: Type.Optional(Type.String()),
  port: Type.Optional(Type.Integer()),
  nodeVersion: Type.String(),
  pid: Type.Integer(),
  /** Process-start identity for invalidating work that cannot survive a Gateway restart. */
  processInstanceId: Type.Optional(Type.String({ minLength: 1 })),
  uptimeMs: Type.Integer(),
  cpuCount: Type.Integer(),
  cpuModel: Type.Optional(Type.String()),
  loadAverage: Type.Optional(Type.Tuple([Type.Number(), Type.Number(), Type.Number()])),
  memoryTotalBytes: Type.Integer(),
  memoryFreeBytes: Type.Integer(),
  diskTotalBytes: Type.Optional(Type.Integer()),
  diskAvailableBytes: Type.Optional(Type.Integer()),
  diskPath: Type.Optional(Type.String()),
});
//#endregion
//#region packages/gateway-protocol/src/schema/task-suggestions.ts
const TaskIdSchema = Type.String({
  minLength: 1,
  maxLength: 128,
});
const TaskTitleSchema = Type.String({
  minLength: 1,
  maxLength: 60,
});
const TaskPromptSchema = Type.String({
  minLength: 1,
  maxLength: 32768,
});
const TaskTldrSchema = Type.String({
  minLength: 1,
  maxLength: 1024,
});
const TaskCwdSchema = Type.String({
  minLength: 1,
  maxLength: 4096,
});
const TaskSessionKeySchema = Type.String({
  minLength: 1,
  maxLength: 512,
});
const TaskAgentIdSchema = Type.String({
  minLength: 1,
  maxLength: 128,
});
/** One model-proposed follow-up task waiting for operator action. */
const TaskSuggestionSchema = closedObject({
  id: TaskIdSchema,
  title: TaskTitleSchema,
  prompt: TaskPromptSchema,
  tldr: TaskTldrSchema,
  cwd: TaskCwdSchema,
  sessionKey: TaskSessionKeySchema,
  agentId: Type.Optional(TaskAgentIdSchema),
  createdAt: Type.Integer({ minimum: 0 }),
});
/** Lists pending suggestions, optionally narrowed to one source session. */
const TaskSuggestionsListParamsSchema = closedObject({
  sessionKey: Type.Optional(TaskSessionKeySchema),
  agentId: Type.Optional(TaskAgentIdSchema),
});
const TaskSuggestionsListResultSchema = closedObject({
  suggestions: Type.Array(TaskSuggestionSchema),
});
/** Creates a pending suggestion without starting any work. */
const TaskSuggestionsCreateParamsSchema = closedObject({
  title: TaskTitleSchema,
  prompt: TaskPromptSchema,
  tldr: TaskTldrSchema,
  cwd: TaskCwdSchema,
  sessionKey: TaskSessionKeySchema,
  agentId: Type.Optional(TaskAgentIdSchema),
});
const TaskSuggestionsCreateResultSchema = closedObject({
  taskId: TaskIdSchema,
  suggestion: TaskSuggestionSchema,
});
const TaskSuggestionResolutionSchema = Type.Union([
  Type.Literal("dismissed"),
  Type.Literal("accepted"),
  Type.Literal("expired"),
]);
/** Atomically claims a pending suggestion and starts its server-owned worktree session. */
const TaskSuggestionsAcceptParamsSchema = closedObject({ taskId: TaskIdSchema });
const TaskSuggestionsAcceptResultSchema = closedObject({
  taskId: TaskIdSchema,
  key: TaskSessionKeySchema,
});
/** Removes a pending suggestion without starting work. */
const TaskSuggestionsDismissParamsSchema = closedObject({
  taskId: TaskIdSchema,
  reason: Type.Optional(Type.String({ maxLength: 1024 })),
});
const TaskSuggestionsDismissResultSchema = closedObject({
  taskId: TaskIdSchema,
  dismissed: Type.Boolean(),
});
/** Live update emitted when a pending suggestion is created or resolved. */
const TaskSuggestionEventSchema = Type.Union([
  closedObject({
    action: Type.Literal("created"),
    suggestion: TaskSuggestionSchema,
  }),
  closedObject({
    action: Type.Literal("resolved"),
    taskId: TaskIdSchema,
    resolution: TaskSuggestionResolutionSchema,
  }),
]);
//#endregion
//#region packages/gateway-protocol/src/schema/tasks.ts
/**
 * Task ledger protocol schemas.
 *
 * Tasks represent long-running SDK/agent operations exposed through the gateway;
 * these schemas keep list/get/cancel payloads bounded and status values closed.
 */
/** Closed task lifecycle statuses visible in the gateway task ledger. */
const TaskLedgerStatusSchema = Type.Union([
  Type.Literal("queued"),
  Type.Literal("running"),
  Type.Literal("completed"),
  Type.Literal("failed"),
  Type.Literal("cancelled"),
  Type.Literal("timed_out"),
]);
const TimestampSchema = Type.Union([Type.String(), Type.Integer({ minimum: 0 })]);
/** Public task summary returned by task list/get/cancel responses. */
const TaskSummarySchema = closedObject({
  id: NonEmptyString,
  kind: Type.Optional(Type.String()),
  runtime: Type.Optional(Type.String()),
  status: TaskLedgerStatusSchema,
  title: Type.Optional(Type.String()),
  agentId: Type.Optional(Type.String()),
  sessionKey: Type.Optional(Type.String()),
  childSessionKey: Type.Optional(Type.String()),
  ownerKey: Type.Optional(Type.String()),
  runId: Type.Optional(Type.String()),
  taskId: Type.Optional(Type.String()),
  flowId: Type.Optional(Type.String()),
  parentTaskId: Type.Optional(Type.String()),
  sourceId: Type.Optional(Type.String()),
  createdAt: Type.Optional(TimestampSchema),
  updatedAt: Type.Optional(TimestampSchema),
  startedAt: Type.Optional(TimestampSchema),
  endedAt: Type.Optional(TimestampSchema),
  toolUseCount: Type.Optional(Type.Integer({ minimum: 0 })),
  lastToolName: Type.Optional(Type.String()),
  progressSummary: Type.Optional(Type.String()),
  terminalSummary: Type.Optional(Type.String()),
  error: Type.Optional(Type.String()),
});
/** Task list filters with bounded pagination. */
const TasksListParamsSchema = closedObject({
  status: Type.Optional(Type.Union([TaskLedgerStatusSchema, Type.Array(TaskLedgerStatusSchema)])),
  agentId: Type.Optional(NonEmptyString),
  sessionKey: Type.Optional(NonEmptyString),
  limit: Type.Optional(
    Type.Integer({
      minimum: 1,
      maximum: 500,
    }),
  ),
  cursor: Type.Optional(Type.String()),
});
/** Task list page response. */
const TasksListResultSchema = closedObject({
  tasks: Type.Array(TaskSummarySchema),
  nextCursor: Type.Optional(Type.String()),
});
/** Lookup request for one task id. */
const TasksGetParamsSchema = closedObject({ taskId: NonEmptyString });
/** Lookup result for one task summary. */
const TasksGetResultSchema = closedObject({ task: TaskSummarySchema });
/** Cancel request for one task id with optional operator reason. */
const TasksCancelParamsSchema = closedObject({
  taskId: NonEmptyString,
  reason: Type.Optional(Type.String()),
});
/** Cancel result, including the task snapshot when it was found. */
const TasksCancelResultSchema = closedObject({
  found: Type.Boolean(),
  cancelled: Type.Boolean(),
  reason: Type.Optional(Type.String()),
  task: Type.Optional(TaskSummarySchema),
});
//#endregion
//#region packages/gateway-protocol/src/schema/terminal.ts
const TerminalDimension = Type.Integer({
  minimum: 1,
  maximum: 2e3,
});
/** Opens a shell session; the server picks the shell, cwd, and confinement. */
const TerminalOpenParamsSchema = closedObject({
  agentId: Type.Optional(NonEmptyString),
  catalog: Type.Optional(
    closedObject({
      catalogId: NonEmptyString,
      hostId: NonEmptyString,
      threadId: NonEmptyString,
    }),
  ),
  cols: TerminalDimension,
  rows: TerminalDimension,
});
/** Result of a successful open; carries the facts the UI header renders. */
const TerminalOpenResultSchema = closedObject({
  sessionId: NonEmptyString,
  agentId: NonEmptyString,
  shell: NonEmptyString,
  cwd: NonEmptyString,
  confined: Type.Boolean(),
  title: Type.Optional(NonEmptyString),
});
/** Writes client keystrokes to the session stdin. */
const TerminalInputParamsSchema = closedObject({
  sessionId: NonEmptyString,
  data: Type.String(),
});
/** Resizes the PTY grid after the client viewport changes. */
const TerminalResizeParamsSchema = closedObject({
  sessionId: NonEmptyString,
  cols: TerminalDimension,
  rows: TerminalDimension,
});
/** Closes a session and kills its process tree. */
const TerminalCloseParamsSchema = closedObject({ sessionId: NonEmptyString });
/**
 * Rebinds a live-or-detached session to the calling admin connection.
 * Attach is take-over (tmux-like): the previous owner, if still connected,
 * receives `terminal.exit` with reason "detached".
 */
const TerminalAttachParamsSchema = closedObject({ sessionId: NonEmptyString });
/** Result of a successful attach; mirrors open plus the replay buffer. */
const TerminalAttachResultSchema = closedObject({
  sessionId: NonEmptyString,
  agentId: NonEmptyString,
  shell: NonEmptyString,
  cwd: NonEmptyString,
  confined: Type.Boolean(),
  buffer: Type.String(),
});
/** One attachable session, as reported by terminal.list. */
const TerminalSessionInfoSchema = closedObject({
  sessionId: NonEmptyString,
  agentId: NonEmptyString,
  shell: NonEmptyString,
  cwd: NonEmptyString,
  confined: Type.Boolean(),
  /** False while the session is detached (no connection owns its stream). */
  attached: Type.Boolean(),
  createdAtMs: Type.Integer({ minimum: 0 }),
});
/**
 * Sessions a reconnecting admin client can attach. All admin connections see
 * the same list: the terminal surface is already operator.admin (full host
 * access), so cross-connection visibility adds no privilege.
 */
const TerminalListResultSchema = closedObject({ sessions: Type.Array(TerminalSessionInfoSchema) });
/** Reads the current output buffer as plain text without attaching. */
const TerminalTextParamsSchema = closedObject({ sessionId: NonEmptyString });
/** Plain-text buffer contents (ANSI stripped); an agent/LLM affordance. */
const TerminalTextResultSchema = closedObject({ text: Type.String() });
/** Shared ok/void result for input, resize, and close. */
const TerminalAckResultSchema = closedObject({ ok: Type.Boolean() });
/** Streamed output chunk; seq is a per-session monotonic counter for diagnostics and tests. */
const TerminalDataEventSchema = closedObject({
  sessionId: NonEmptyString,
  seq: Type.Integer({ minimum: 0 }),
  data: Type.String(),
});
/** Terminal end-of-life notice; the session id is invalid after this event. */
const TerminalExitEventSchema = closedObject({
  sessionId: NonEmptyString,
  exitCode: Type.Optional(Type.Union([Type.Integer(), Type.Null()])),
  signal: Type.Optional(Type.Union([Type.Integer(), Type.Null()])),
  reason: Type.Optional(
    Type.Union([
      Type.Literal("process_exit"),
      Type.Literal("closed"),
      Type.Literal("disconnected"),
      Type.Literal("detached"),
      Type.Literal("error"),
    ]),
  ),
  error: Type.Optional(Type.String()),
});
/** Union of every event a terminal session can emit. */
const TerminalEventSchema = Type.Union([TerminalDataEventSchema, TerminalExitEventSchema]);
//#endregion
//#region packages/gateway-protocol/src/schema/worktrees.ts
const WorktreeNameSchema = Type.String({ pattern: "^[a-z0-9][a-z0-9-]{0,63}$" });
const WorktreeRecordSchema = closedObject({
  id: NonEmptyString,
  name: WorktreeNameSchema,
  repoFingerprint: Type.String({ pattern: "^[a-f0-9]{16}$" }),
  repoRoot: NonEmptyString,
  path: NonEmptyString,
  branch: NonEmptyString,
  baseRef: NonEmptyString,
  ownerKind: Type.String({ enum: ["manual", "workboard", "session"] }),
  ownerId: Type.Optional(NonEmptyString),
  snapshotRef: Type.Optional(NonEmptyString),
  createdAt: Type.Integer({ minimum: 0 }),
  lastActiveAt: Type.Integer({ minimum: 0 }),
  removedAt: Type.Optional(Type.Integer({ minimum: 0 })),
});
const WorktreesListParamsSchema = closedObject({});
const WorktreesListResultSchema = closedObject({ worktrees: Type.Array(WorktreeRecordSchema) });
const WorktreesCreateParamsSchema = closedObject({
  repoRoot: NonEmptyString,
  name: Type.Optional(WorktreeNameSchema),
  baseRef: Type.Optional(NonEmptyString),
});
const WorktreesRemoveParamsSchema = closedObject({
  id: NonEmptyString,
  force: Type.Optional(Type.Boolean()),
});
const WorktreesRemoveResultSchema = closedObject({
  removed: Type.Boolean(),
  snapshotRef: Type.Optional(NonEmptyString),
  /** Why the pre-removal snapshot failed; present only on forced removals that continued without one. */
  snapshotError: Type.Optional(NonEmptyString),
});
const WorktreesBranchesParamsSchema = closedObject({ repoRoot: NonEmptyString });
const WorktreeBranchSchema = closedObject({
  name: NonEmptyString,
  kind: Type.Union([Type.Literal("local"), Type.Literal("remote")]),
});
const WorktreesBranchesResultSchema = closedObject({
  branches: Type.Array(WorktreeBranchSchema),
  defaultBranch: Type.Optional(NonEmptyString),
  headBranch: Type.Optional(NonEmptyString),
});
const WorktreesRestoreParamsSchema = closedObject({ id: NonEmptyString });
const WorktreesGcParamsSchema = closedObject({});
const WorktreesGcResultSchema = closedObject({
  removed: Type.Array(NonEmptyString),
  orphansDeleted: Type.Integer({ minimum: 0 }),
  snapshotsPruned: Type.Integer({ minimum: 0 }),
});
(({ ...NodeInvokeProtocolSchemas }),
  { ...NodePresenceProtocolSchemas },
  { ...SessionPlacementProtocolSchemas },
  { ...SkillWorkshopProtocolSchemas },
  { ...LogMigrationProtocolSchemas });
//#endregion
export {
  SessionFileKindSchema as $,
  AuditActivityToolActionV1Schema as $a,
  ConfigSchemaParamsSchema as $i,
  NodePresenceAlivePayloadSchema as $n,
  SkillsSecurityVerdictsParamsSchema as $o,
  ExecApprovalRequestParamsSchema as $r,
  SessionsCatalogReadParamsSchema as $t,
  TasksCancelResultSchema as A,
  TalkSessionCreateResultSchema as Aa,
  CrestodianChatParamsSchema as Ai,
  PluginsUninstallResultSchema as An,
  ModelsProbeTargetResultSchema as Ao,
  FsListDirResultSchema as Ar,
  SkillsProposalHistoryScanParamsSchema as As,
  SessionsPatchParamsSchema as At,
  TaskSuggestionsCreateParamsSchema as B,
  TtsSpeakParamsSchema as Ba,
  WizardCancelParamsSchema as Bi,
  NodeListParamsSchema as Bn,
  SkillsProposalApplyResultSchema as Bo,
  TickEventSchema as Br,
  SessionsCreateParamsSchema as Bt,
  TerminalOpenResultSchema as C,
  TalkEventSchema as Ca,
  CronJobSchema as Ci,
  PluginsSessionActionParamsSchema as Cn,
  AgentsListResultSchema as Co,
  GatewaySuspendStatusParamsSchema as Cr,
  MemoryMigrationProviderPlanSchema as Cs,
  SessionsGroupsListResultSchema as Ct,
  TerminalTextResultSchema as D,
  TalkSessionCancelTurnParamsSchema as Da,
  CronRunsParamsSchema as Di,
  PluginsUiDescriptorsParamsSchema as Dn,
  ModelsListParamsSchema as Do,
  GatewaySuspendTaskBlockerSchema as Dr,
  MigrationsMemoryApplyResultSchema as Ds,
  SessionsListParamsSchema as Dt,
  TerminalTextParamsSchema as E,
  TalkSessionCancelOutputParamsSchema as Ea,
  CronRunParamsSchema as Ei,
  PluginsSetEnabledResultSchema as En,
  AuthProbeStatusSchema as Eo,
  GatewaySuspendStatusRunningResultSchema as Er,
  MigrationsMemoryApplyParamsSchema as Es,
  SessionsGroupsRenameParamsSchema as Et,
  TaskSuggestionEventSchema as F,
  TalkSessionSubmitToolResultParamsSchema as Fa,
  CrestodianSetupAuthStartResultSchema as Fi,
  NodeEventResultSchema as Fn,
  SkillsCuratorStatusResultSchema as Fo,
  GatewayFrameSchema as Fr,
  lazyCompile as Fs,
  SessionsSearchHitSchema as Ft,
  TaskSuggestionsListResultSchema as G,
  AuditListParamsSchema as Ga,
  WizardStatusParamsSchema as Gi,
  NodePendingAckParamsSchema as Gn,
  SkillsProposalRequestRevisionParamsSchema as Go,
  DevicePairListParamsSchema as Gr,
  SessionCatalogSessionSchema as Gt,
  TaskSuggestionsDismissParamsSchema as H,
  WebLoginStartParamsSchema as Ha,
  WizardNextResultSchema as Hi,
  NodePairListParamsSchema as Hn,
  SkillsProposalInspectParamsSchema as Ho,
  SnapshotSchema as Hr,
  SessionCatalogDescriptorSchema as Ht,
  TaskSuggestionResolutionSchema as I,
  TalkSessionTurnParamsSchema as Ia,
  CrestodianSetupDetectParamsSchema as Ii,
  NodeInvokeInputEventSchema as In,
  SkillsDetailParamsSchema as Io,
  HelloOkSchema as Ir,
  SessionsSearchParamsSchema as It,
  SessionDiffFileSchema as J,
  AuditActivityEventV1Schema as Ja,
  ConfigApplyParamsSchema as Ji,
  NodePendingEnqueueParamsSchema as Jn,
  SkillsProposalUpdateParamsSchema as Jo,
  DevicePairRenameParamsSchema as Jr,
  SessionsCatalogArchiveResultSchema as Jt,
  SystemInfoParamsSchema as K,
  AuditListResultSchema as Ka,
  WizardStatusResultSchema as Ki,
  NodePendingDrainParamsSchema as Kn,
  SkillsProposalRequestRevisionResultSchema as Ko,
  DevicePairRejectParamsSchema as Kr,
  SessionCatalogTranscriptItemSchema as Kt,
  TaskSuggestionSchema as L,
  TalkSessionTurnResultSchema as La,
  CrestodianSetupDetectResultSchema as Li,
  NodeInvokeParamsSchema as Ln,
  SkillsDetailResultSchema as Lo,
  RequestFrameSchema as Lr,
  SessionsSearchResultSchema as Lt,
  TasksGetResultSchema as M,
  TalkSessionJoinResultSchema as Ma,
  CrestodianSetupActivateParamsSchema as Mi,
  PluginApprovalResolveParamsSchema as Mn,
  SkillsCuratorActionParamsSchema as Mo,
  ErrorShapeSchema as Mr,
  SkillsProposalHistoryStatusParamsSchema as Ms,
  SessionsPreviewParamsSchema as Mt,
  TasksListParamsSchema as N,
  TalkSessionOkResultSchema as Na,
  CrestodianSetupActivateResultSchema as Ni,
  NodeDescribeParamsSchema as Nn,
  SkillsCuratorActionResultSchema as No,
  EventFrameSchema as Nr,
  validateSkillsProposalHistoryScanParams as Ns,
  SessionsResetParamsSchema as Nt,
  TaskSummarySchema as O,
  TalkSessionCloseParamsSchema as Oa,
  CronStatusParamsSchema as Oi,
  PluginsUiDescriptorsResultSchema as On,
  ModelsProbeParamsSchema as Oo,
  FsDirEntrySchema as Or,
  MigrationsMemoryPlanParamsSchema as Os,
  SessionsMessagesSubscribeParamsSchema as Ot,
  TasksListResultSchema as P,
  TalkSessionSteerParamsSchema as Pa,
  CrestodianSetupAuthStartParamsSchema as Pi,
  NodeEventParamsSchema as Pn,
  SkillsCuratorStatusParamsSchema as Po,
  GATEWAY_SERVER_CAPS as Pr,
  validateSkillsProposalHistoryStatusParams as Ps,
  SessionsResolveParamsSchema as Pt,
  SessionFileEntrySchema as Q,
  AuditActivityOutboundMessageV1Schema as Qa,
  ConfigSchemaLookupResultSchema as Qi,
  NodePresenceActivityPayloadSchema as Qn,
  SkillsSearchResultSchema as Qo,
  ExecApprovalGetParamsSchema as Qr,
  SessionsCatalogListResultSchema as Qt,
  TaskSuggestionsAcceptParamsSchema as R,
  TalkSpeakParamsSchema as Ra,
  CrestodianSetupVerifyParamsSchema as Ri,
  NodeInvokeProgressParamsSchema as Rn,
  SkillsInstallParamsSchema as Ro,
  ResponseFrameSchema as Rr,
  SessionsSendParamsSchema as Rt,
  TerminalOpenParamsSchema as S,
  TalkConfigResultSchema as Sa,
  CronGetParamsSchema as Si,
  PluginsSearchResultSchema as Sn,
  AgentsListParamsSchema as So,
  GatewaySuspendResumeResultSchema as Sr,
  MemoryMigrationItemStatusSchema as Ss,
  SessionsGroupsListParamsSchema as St,
  TerminalSessionInfoSchema as T,
  TalkSessionAppendAudioParamsSchema as Ta,
  CronRemoveParamsSchema as Ti,
  PluginsSetEnabledParamsSchema as Tn,
  AgentsUpdateResultSchema as To,
  GatewaySuspendStatusResultSchema as Tr,
  MigrationProtocolSchemas as Ts,
  SessionsGroupsPutParamsSchema as Tt,
  TaskSuggestionsDismissResultSchema as U,
  WebLoginWaitParamsSchema as Ua,
  WizardStartParamsSchema as Ui,
  NodePairRejectParamsSchema as Un,
  SkillsProposalInspectResultSchema as Uo,
  StateVersionSchema as Ur,
  SessionCatalogHostSchema as Ut,
  TaskSuggestionsCreateResultSchema as V,
  TtsSpeakResultSchema as Va,
  WizardNextParamsSchema as Vi,
  NodePairApproveParamsSchema as Vn,
  SkillsProposalCreateParamsSchema as Vo,
  PresenceEntrySchema as Vr,
  SessionCatalogCapabilitiesSchema as Vt,
  TaskSuggestionsListParamsSchema as W,
  AuditEventSchema as Wa,
  WizardStartResultSchema as Wi,
  NodePairRemoveParamsSchema as Wn,
  SkillsProposalRecordResultSchema as Wo,
  DevicePairApproveParamsSchema as Wr,
  SessionCatalogSchema as Wt,
  SessionFileBrowserEntrySchema as X,
  AuditActivityListParamsSchema as Xa,
  ConfigPatchParamsSchema as Xi,
  NodePluginToolDescriptorSchema as Xn,
  SkillsProposalsListResultSchema as Xo,
  DeviceTokenRevokeParamsSchema as Xr,
  SessionsCatalogContinueResultSchema as Xt,
  SessionDiffFileStatusSchema as Y,
  AuditActivityInboundMessageV1Schema as Ya,
  ConfigGetParamsSchema as Yi,
  NodePendingEnqueueResultSchema as Yn,
  SkillsProposalsListParamsSchema as Yo,
  DevicePairSetupCodeParamsSchema as Yr,
  SessionsCatalogContinueParamsSchema as Yt,
  SessionFileBrowserResultSchema as Z,
  AuditActivityListResultSchema as Za,
  ConfigSchemaLookupParamsSchema as Zi,
  NodePluginToolsUpdateParamsSchema as Zn,
  SkillsSearchParamsSchema as Zo,
  DeviceTokenRotateParamsSchema as Zr,
  SessionsCatalogListParamsSchema as Zt,
  TerminalDataEventSchema as _,
  TalkClientCreateResultSchema as _a,
  WorkerEnvironmentStateSchema as _i,
  PluginsInstallParamsSchema as _n,
  AgentsFilesGetResultSchema as _o,
  GatewaySuspendPrepareBusyResultSchema as _r,
  PollParamsSchema as _s,
  SessionsFilesListParamsSchema as _t,
  WorktreesCreateParamsSchema as a,
  CommandsListParamsSchema as aa,
  ExecApprovalsSetParamsSchema as ai,
  SecretsResolveParamsSchema as an,
  AgentsWorkspaceFileSchema as ao,
  ChatEventSchema as ar,
  SkillsUploadBeginParamsSchema as as,
  SessionsCompactParamsSchema as at,
  TerminalInputParamsSchema as b,
  TalkClientToolCallResultSchema as ba,
  CronAddResultSchema as bi,
  PluginsListResultSchema as bn,
  AgentsFilesSetParamsSchema as bo,
  GatewaySuspendPrepareResultSchema as br,
  MAX_MEMORY_MIGRATION_ITEMS as bs,
  SessionsFilesSetResultSchema as bt,
  WorktreesListParamsSchema as c,
  ChannelsLogoutParamsSchema as ca,
  EnvironmentsCreateParamsSchema as ci,
  PushTestResultSchema as cn,
  AgentsWorkspaceListParamsSchema as co,
  ChatMessageGetParamsSchema as cr,
  ToolsCatalogParamsSchema as cs,
  SessionsCompactionListParamsSchema as ct,
  WorktreesRemoveResultSchema as d,
  ChannelsStatusResultSchema as da,
  EnvironmentsDestroyResultSchema as di,
  WebPushUnsubscribeParamsSchema as dn,
  AgentsCreateParamsSchema as do,
  ChatSendParamsSchema as dr,
  AgentEventSchema as ds,
  SessionsDeleteParamsSchema as dt,
  ConfigSchemaResponseSchema as ea,
  ExecApprovalResolveParamsSchema as ei,
  SessionsCatalogReadResultSchema as en,
  ArtifactSummarySchema as eo,
  NodePresenceAliveReasonSchema as er,
  SkillsSecurityVerdictsResultSchema as es,
  SessionFileRelevanceSchema as et,
  WorktreesRestoreParamsSchema as f,
  ChannelsStopParamsSchema as fa,
  EnvironmentsListParamsSchema as fi,
  WebPushVapidPublicKeyParamsSchema as fn,
  AgentsCreateResultSchema as fo,
  ChatToolTitlesParamsSchema as fr,
  AgentIdentityParamsSchema as fs,
  SessionsDescribeParamsSchema as ft,
  TerminalCloseParamsSchema as g,
  TalkClientCreateParamsSchema as ga,
  WorkerEnvironmentMetadataSchema as gi,
  PluginSearchResultEntrySchema as gn,
  AgentsFilesGetParamsSchema as go,
  GatewaySuspendBlockerSchema as gr,
  MessageActionParamsSchema as gs,
  SessionsFilesGetResultSchema as gt,
  TerminalAttachResultSchema as h,
  TalkCatalogResultSchema as ha,
  EnvironmentsStatusResultSchema as hi,
  PluginSearchPackageSchema as hn,
  AgentsFileEntrySchema as ho,
  LogsTailResultSchema as hr,
  AgentWaitParamsSchema as hs,
  SessionsFilesGetParamsSchema as ht,
  WorktreesBranchesResultSchema as i,
  COMMAND_DESCRIPTION_MAX_LENGTH as ia,
  ExecApprovalsNodeSnapshotSchema as ii,
  SessionsDispatchResultSchema as in,
  AgentsWorkspaceEntrySchema as io,
  ChatAbortParamsSchema as ir,
  SkillsUpdateParamsSchema as is,
  SessionsCleanupParamsSchema as it,
  TasksGetParamsSchema as j,
  TalkSessionJoinParamsSchema as ja,
  CrestodianChatResultSchema as ji,
  PluginApprovalRequestParamsSchema as jn,
  SkillsBinsParamsSchema as jo,
  ConnectParamsSchema as jr,
  SkillsProposalHistoryScanResultSchema as js,
  SessionsPluginPatchParamsSchema as jt,
  TasksCancelParamsSchema as k,
  TalkSessionCreateParamsSchema as ka,
  CronUpdateParamsSchema as ki,
  PluginsUninstallParamsSchema as kn,
  ModelsProbeResultSchema as ko,
  FsListDirParamsSchema as kr,
  MigrationsMemoryPlanResultSchema as ks,
  SessionsMessagesUnsubscribeParamsSchema as kt,
  WorktreesListResultSchema as l,
  ChannelsStartParamsSchema as la,
  EnvironmentsCreateResultSchema as li,
  WebPushSubscribeParamsSchema as ln,
  AgentsWorkspaceListResultSchema as lo,
  ChatMessageGetResultSchema as lr,
  ToolsEffectiveParamsSchema as ls,
  SessionsCompactionRestoreParamsSchema as lt,
  TerminalAttachParamsSchema as m,
  TalkCatalogParamsSchema as ma,
  EnvironmentsStatusParamsSchema as mi,
  PluginCatalogInstallActionSchema as mn,
  AgentsDeleteResultSchema as mo,
  LogsTailParamsSchema as mr,
  AgentParamsSchema as ms,
  SessionsDiffResultSchema as mt,
  WorktreeRecordSchema as n,
  UpdateRunParamsSchema as na,
  ExecApprovalsNodeGetParamsSchema as ni,
  SessionPlacementStateSchema as nn,
  ArtifactsGetParamsSchema as no,
  NodeSkillDescriptorSchema as nr,
  SkillsSkillCardResultSchema as ns,
  SessionWorktreeInfoSchema as nt,
  WorktreesGcParamsSchema as o,
  CommandsListResultSchema as oa,
  EnvironmentStatusSchema as oi,
  SecretsResolveResultSchema as on,
  AgentsWorkspaceGetParamsSchema as oo,
  ChatHistoryParamsSchema as or,
  SkillsUploadChunkParamsSchema as os,
  SessionsCompactionBranchParamsSchema as ot,
  TerminalAckResultSchema as p,
  TalkAgentControlResultSchema as pa,
  EnvironmentsListResultSchema as pi,
  PluginCatalogEntrySchema as pn,
  AgentsDeleteParamsSchema as po,
  ChatToolTitlesResultSchema as pr,
  AgentIdentityResultSchema as ps,
  SessionsDiffParamsSchema as pt,
  SystemInfoResultSchema as q,
  AuditActivityAgentRunV1Schema as qa,
  WizardStepSchema as qi,
  NodePendingDrainResultSchema as qn,
  SkillsProposalReviseParamsSchema as qo,
  DevicePairRemoveParamsSchema as qr,
  SessionsCatalogArchiveParamsSchema as qt,
  WorktreesBranchesParamsSchema as r,
  UpdateStatusParamsSchema as ra,
  ExecApprovalsNodeSetParamsSchema as ri,
  SessionsDispatchParamsSchema as rn,
  ArtifactsListParamsSchema as ro,
  NodeSkillsUpdateParamsSchema as rr,
  SkillsStatusParamsSchema as rs,
  SessionsAbortParamsSchema as rt,
  WorktreesGcResultSchema as s,
  TalkSessionAcknowledgeMarkParamsSchema as sa,
  EnvironmentSummarySchema as si,
  PushTestParamsSchema as sn,
  AgentsWorkspaceGetResultSchema as so,
  ChatInjectParamsSchema as sr,
  SkillsUploadCommitParamsSchema as ss,
  SessionsCompactionGetParamsSchema as st,
  WorktreeBranchSchema as t,
  ConfigSetParamsSchema as ta,
  ExecApprovalsGetParamsSchema as ti,
  SessionPlacementSchema as tn,
  ArtifactsDownloadParamsSchema as to,
  NodeRenameParamsSchema as tr,
  SkillsSkillCardParamsSchema as ts,
  SessionGroupSchema as tt,
  WorktreesRemoveParamsSchema as u,
  ChannelsStatusParamsSchema as ua,
  EnvironmentsDestroyParamsSchema as ui,
  WebPushTestParamsSchema as un,
  AgentSummarySchema as uo,
  ChatMetadataParamsSchema as ur,
  ToolsInvokeParamsSchema as us,
  SessionsCreateResultSchema as ut,
  TerminalEventSchema as v,
  TalkClientSteerParamsSchema as va,
  WorkerTunnelStatusSchema as vi,
  PluginsInstallResultSchema as vn,
  AgentsFilesListParamsSchema as vo,
  GatewaySuspendPrepareParamsSchema as vr,
  SendParamsSchema as vs,
  SessionsFilesListResultSchema as vt,
  TerminalResizeParamsSchema as w,
  TalkModeParamsSchema as wa,
  CronListParamsSchema as wi,
  PluginsSessionActionResultSchema as wn,
  AgentsUpdateParamsSchema as wo,
  GatewaySuspendStatusReadyResultSchema as wr,
  MemoryMigrationSummarySchema as ws,
  SessionsGroupsMutationResultSchema as wt,
  TerminalListResultSchema as x,
  TalkConfigParamsSchema as xa,
  CronDeclarativeAddResultSchema as xi,
  PluginsSearchParamsSchema as xn,
  AgentsFilesSetResultSchema as xo,
  GatewaySuspendResumeParamsSchema as xr,
  MemoryMigrationItemSchema as xs,
  SessionsGroupsDeleteParamsSchema as xt,
  TerminalExitEventSchema as y,
  TalkClientToolCallParamsSchema as ya,
  CronAddParamsSchema as yi,
  PluginsListParamsSchema as yn,
  AgentsFilesListResultSchema as yo,
  GatewaySuspendPrepareReadyResultSchema as yr,
  WakeParamsSchema as ys,
  SessionsFilesSetParamsSchema as yt,
  TaskSuggestionsAcceptResultSchema as z,
  TalkSpeakResultSchema as za,
  CrestodianSetupVerifyResultSchema as zi,
  NodeInvokeResultParamsSchema as zn,
  SkillsProposalActionParamsSchema as zo,
  ShutdownEventSchema as zr,
  SessionsUsageParamsSchema as zt,
};
