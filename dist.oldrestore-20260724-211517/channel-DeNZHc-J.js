import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { n as describeAccountSnapshot } from "./account-helpers-BAtt8fRD.js";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-C7N4Rwku.js";
import {
  a as resolveDefaultFeishuAccountId,
  i as listFeishuAccountIds,
  l as resolveFeishuRuntimeAccount,
  n as inspectFeishuCredentials,
  p as isRecord$1,
  r as listEnabledFeishuAccounts,
  s as resolveFeishuAccount,
} from "./accounts-upJPqv8I.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { t as formatAllowFromLowercase } from "./allow-from-BCaLdTTU.js";
import { t as createChannelApprovalAuth } from "./approval-auth-helpers-BtEiGp-a.js";
import { n as sanitizeAssistantVisibleText } from "./assistant-visible-text-DV1Yognj.js";
import {
  i as createHybridChannelConfigAdapter,
  t as adaptScopedAccountAccessor,
} from "./channel-config-helpers-BFvX3ldW.js";
import { t as createAccountStatusSink } from "./channel-lifecycle.core-BZ1pethE.js";
import { w as defineChannelMessageAdapter } from "./channel-outbound-DlkFd7rO.js";
import { i as createPairingPrefixStripper } from "./channel-pairing-1V8FM4wM.js";
import {
  j as projectConfigAccountIdWarningCollector,
  x as createAllowlistProviderGroupPolicyWarningCollector,
} from "./channel-policy-DXOn_tKS.js";
import { i as createActionGate, t as ToolAuthorizationError } from "./common-DyDSUect.js";
import { n as ZodIssueCode } from "./compat-Ci0Yc9vr.js";
import { r as buildChannelConfigSchema } from "./config-schema-qmCQZl6j.js";
import {
  a as parseFeishuTargetId,
  i as parseFeishuDirectConversationId,
  n as buildFeishuModelOverrideParentCandidates,
  o as resolveConfiguredFeishuGroupSessionScope,
  r as parseFeishuConversationId,
  t as buildFeishuConversationId,
} from "./conversation-id-BvaiLsbQ.js";
import {
  i as createChatChannelPlugin,
  t as buildChannelOutboundSessionRoute,
  u as stripChannelTargetPrefix,
} from "./core-V3U0lOIj.js";
import "./number-runtime-B-n-wjMn.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { n as createChannelDirectoryAdapter } from "./directory-runtime-VSo_cGzY.js";
import {
  n as normalizeCompatibilityConfig,
  t as legacyConfigRules,
} from "./doctor-contract-Be3NA5nH.js";
import "./channel-core-Z_rV5hXh.js";
import "./routing-CwvmVRHd.js";
import { t as createSetupTranslator } from "./i18n-BDUMKn0X.js";
import {
  i as createLazyRuntimeNamedExport,
  r as createLazyRuntimeModule,
} from "./lazy-runtime-B-Fc-m0I.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import "./channel-config-schema-C-vJvjtu.js";
import { t as PAIRING_APPROVED_MESSAGE } from "./pairing-message-DNhqI-OE.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import {
  c as normalizeInteractiveReply,
  h as resolveInteractiveTextFallback,
  l as normalizeMessagePresentation,
  o as interactiveReplyToPresentation,
} from "./payload-BFbDi85B.js";
import {
  a as listAuthorizedFeishuDirectoryGroups,
  c as listFeishuDirectoryPeers,
  i as isFeishuCardWithinEnvelope,
  n as buildFeishuPresentationCard,
  o as listAuthorizedFeishuDirectoryPeers,
  s as listFeishuDirectoryGroups,
  t as assertFeishuCardWithinEnvelope,
} from "./presentation-card-Bxz3IEyg.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import "./setup-CM3hyaUe.js";
import {
  n as createRuntimeOutboundDelegates,
  t as createRuntimeDirectoryLiveAdapter,
} from "./runtime-forwarders-Dxil5z45.js";
import {
  At as boolean,
  Et as array,
  Nn as record,
  Rn as string,
  Tn as object,
  Xn as union,
  Zn as unknown,
  dn as literal,
  wn as number,
  yt as _enum,
} from "./schemas-CBJjibl3.js";
import "./conversation-runtime-DuXhVyjf.js";
import "./account-resolution-DijsTQIy.js";
import {
  n as collectRuntimeConfigAssignments,
  r as secretTargetRegistryEntries,
} from "./secret-contract-BymMI3hc.js";
import { r as buildSecretInputSchema } from "./secret-input-D1aG0n6v.js";
import "./channel-status-B8fwcUOI.js";
import "./channel-actions-C9vNf9jw.js";
import { t as messageActionTargetAliases } from "./security-audit-DkmnJWp7.js";
import "./state-paths-DU65nx5N.js";
import { t as collectFeishuSecurityAuditFindings } from "./security-audit-shared-CumMfJWP.js";
import {
  C as normalizeFeishuChatType,
  a as readNativeFeishuCardJson,
  c as assertFeishuChatReadAllowed,
  d as canEnumerateAllFeishuPeers,
  f as isFeishuGroupReadAllowed,
  l as authorizeFeishuChatMemberRead,
  m as resolveFeishuChatReadPreliminaryAuthorization,
  n as createFeishuSendReceipt,
  p as isFeishuGroupReadEnabled,
  u as canEnumerateAllFeishuGroups,
  v as resolveFeishuGroupConfig,
  w as resolveFeishuChatType,
  x as resolveFeishuGroupToolPolicy,
} from "./send-result-BY9GGIVt.js";
import { n as getSessionBindingService } from "./session-binding-service-DPVMwWUH.js";
import { t as resolveFeishuSessionConversation } from "./session-conversation-6i0-3bbs.js";
import {
  f as resolveSessionStoreBackupPaths,
  i as listSessionEntries,
  m as resolveStorePath,
  n as deleteSessionEntry,
  o as loadTranscriptEventsSync,
} from "./session-store-runtime-BwE6SlGz.js";
import {
  D as patchTopLevelChannelConfigSection,
  P as promptSingleChannelSecretInput,
  Q as splitSetupEntries,
  v as mergeAllowFromEntries,
} from "./setup-wizard-helpers-Kz9xlQ7e.js";
import { n as parseSqliteSessionFileMarker } from "./sqlite-marker-BejbySI1.js";
import {
  d as createDefaultChannelRuntimeState,
  i as buildProbeChannelStatusSummary,
  u as createComputedAccountStatusAdapter,
} from "./status-helpers-SdoCNDDu.js";
import { Ot as isValidAgentHarnessSessionStoreEntry } from "./store-CzZJhTF6.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import {
  i as resolveReceiveIdType,
  n as looksLikeFeishuId,
  r as normalizeFeishuTarget,
} from "./targets-5VnlkfaZ.js";
import { t as chunkTextForOutbound } from "./text-chunking-Dr19ggf-.js";
import { c as hasConfiguredSecretInput } from "./types.secrets-BV0ywRAy.js";
//#region extensions/feishu/src/approval-auth.ts
function normalizeFeishuApproverId(value) {
  const trimmed = normalizeOptionalLowercaseString(normalizeFeishuTarget(String(value)));
  return trimmed?.startsWith("ou_") ? trimmed : void 0;
}
const feishuApprovalAuth = createChannelApprovalAuth({
  channelLabel: "Feishu",
  resolveInputs: ({ cfg, accountId }) => {
    return {
      allowFrom: resolveFeishuAccount({
        cfg,
        accountId,
      }).config.allowFrom,
    };
  },
  normalizeApprover: normalizeFeishuApproverId,
}).approvalAuth;
//#endregion
//#region extensions/feishu/src/config-schema.ts
const ChannelActionsSchema = object({ reactions: boolean().optional() }).strict().optional();
const DmPolicySchema = _enum(["open", "pairing", "allowlist"]);
const GroupPolicySchema = union([
  _enum(["open", "allowlist", "disabled"]),
  literal("allowall").transform(() => "open"),
]);
const FeishuDomainSchema = union([
  _enum(["feishu", "lark"]),
  string().url().startsWith("https://"),
]);
const FeishuConnectionModeSchema = _enum(["websocket", "webhook"]);
const TtsOverrideSchema = object({
  auto: _enum(["off", "always", "inbound", "tagged"]).optional(),
  enabled: boolean().optional(),
  mode: _enum(["final", "all"]).optional(),
  provider: string().optional(),
  persona: string().optional(),
  personas: record(string(), record(string(), unknown())).optional(),
  summaryModel: string().optional(),
  modelOverrides: record(string(), unknown()).optional(),
  providers: record(string(), record(string(), unknown())).optional(),
  prefsPath: string().optional(),
  maxTextLength: number().int().min(1).optional(),
  timeoutMs: number().int().min(1e3).max(12e4).optional(),
})
  .strict()
  .optional();
const ToolPolicySchema = object({
  allow: array(string()).optional(),
  deny: array(string()).optional(),
})
  .strict()
  .optional();
const DmConfigSchema = object({
  enabled: boolean().optional(),
  systemPrompt: string().optional(),
})
  .strict()
  .optional();
const MarkdownConfigSchema = object({
  mode: _enum(["native", "escape", "strip"]).optional(),
  tableMode: _enum(["native", "ascii", "simple"]).optional(),
})
  .strict()
  .optional();
const RenderModeSchema = _enum(["auto", "raw", "card"]).optional();
const BlockStreamingCoalesceSchema = object({
  minChars: number().int().positive().optional(),
  maxChars: number().int().positive().optional(),
  idleMs: number().int().nonnegative().optional(),
})
  .strict()
  .optional();
const FeishuStreamingSchema = object({
  mode: _enum(["off", "partial"]).optional(),
  chunkMode: _enum(["length", "newline"]).optional(),
  block: object({
    enabled: boolean().optional(),
    coalesce: BlockStreamingCoalesceSchema,
  })
    .strict()
    .optional(),
})
  .strict()
  .optional();
const ChannelHeartbeatVisibilitySchema = object({
  visibility: _enum(["visible", "hidden"]).optional(),
  intervalMs: number().int().positive().optional(),
})
  .strict()
  .optional();
/**
 * Dynamic agent creation configuration.
 * When enabled, a new agent is created for each unique DM user.
 */
const DynamicAgentCreationSchema = object({
  enabled: boolean().optional(),
  workspaceTemplate: string().optional(),
  agentDirTemplate: string().optional(),
  maxAgents: number().int().positive().optional(),
})
  .strict()
  .optional();
/**
 * Feishu tools configuration.
 * Controls which tool categories are enabled.
 *
 * Dependencies:
 * - wiki requires doc (wiki content is edited via doc tools)
 * - perm can work independently but is typically used with drive
 */
const FeishuToolsConfigSchema = object({
  doc: boolean().optional(),
  chat: boolean().optional(),
  wiki: boolean().optional(),
  drive: boolean().optional(),
  perm: boolean().optional(),
  scopes: boolean().optional(),
  bitable: boolean().optional(),
  base: boolean().optional(),
})
  .strict()
  .optional();
/**
 * Group session scope for routing Feishu group messages.
 * - "group" (default): one session per group chat
 * - "group_sender": one session per (group + sender)
 * - "group_topic": one session per group topic thread (falls back to group if no topic)
 * - "group_topic_sender": one session per (group + topic thread + sender),
 *   falls back to (group + sender) if no topic
 */
const GroupSessionScopeSchema = _enum([
  "group",
  "group_sender",
  "group_topic",
  "group_topic_sender",
]).optional();
/**
 * @deprecated Use groupSessionScope instead.
 *
 * Topic session isolation mode for group chats.
 * - "disabled" (default): All messages in a group share one session
 * - "enabled": Messages in different topics get separate sessions
 *
 * Topic routing uses Feishu topic-group `thread_id` when the event identifies a
 * native topic group, and keeps `root_id` precedence for normal groups so
 * reply-created threads stay on the initiating message session.
 */
const TopicSessionModeSchema = _enum(["disabled", "enabled"]).optional();
const ReactionNotificationModeSchema = _enum(["off", "own", "all"]).optional();
/**
 * Reply-in-thread mode for group chats.
 * - "disabled" (default): Bot replies are normal inline replies
 * - "enabled": Bot replies create or continue a Feishu topic thread
 *
 * When enabled, the Feishu reply API is called with `reply_in_thread: true`,
 * causing the reply to appear as a topic (话题) under the original message.
 */
const ReplyInThreadSchema = _enum(["disabled", "enabled"]).optional();
const FeishuGroupSchema = object({
  requireMention: boolean().optional(),
  tools: ToolPolicySchema,
  skills: array(string()).optional(),
  enabled: boolean().optional(),
  allowFrom: array(union([string(), number()])).optional(),
  systemPrompt: string().optional(),
  groupSessionScope: GroupSessionScopeSchema,
  topicSessionMode: TopicSessionModeSchema,
  replyInThread: ReplyInThreadSchema,
}).strict();
const FeishuSharedConfigShape = {
  webhookHost: string().optional(),
  webhookPort: number().int().positive().optional(),
  capabilities: array(string()).optional(),
  markdown: MarkdownConfigSchema,
  configWrites: boolean().optional(),
  dmPolicy: DmPolicySchema.optional(),
  allowFrom: array(union([string(), number()])).optional(),
  groupPolicy: GroupPolicySchema.optional(),
  groupAllowFrom: array(union([string(), number()])).optional(),
  groupSenderAllowFrom: array(union([string(), number()])).optional(),
  requireMention: boolean().optional(),
  groups: record(string(), FeishuGroupSchema.optional()).optional(),
  historyLimit: number().int().min(0).optional(),
  dmHistoryLimit: number().int().min(0).optional(),
  dms: record(string(), DmConfigSchema).optional(),
  textChunkLimit: number().int().positive().optional(),
  mediaMaxMb: number().positive().optional(),
  httpTimeoutMs: number().int().positive().max(3e5).optional(),
  heartbeat: ChannelHeartbeatVisibilitySchema,
  renderMode: RenderModeSchema,
  streaming: FeishuStreamingSchema,
  tools: FeishuToolsConfigSchema,
  actions: ChannelActionsSchema,
  replyInThread: ReplyInThreadSchema,
  reactionNotifications: ReactionNotificationModeSchema,
  typingIndicator: boolean().optional(),
  resolveSenderNames: boolean().optional(),
  tts: TtsOverrideSchema,
};
/**
 * Per-account configuration.
 * All fields are optional - missing fields inherit from top-level config.
 */
const FeishuAccountConfigSchema = object({
  enabled: boolean().optional(),
  name: string().optional(),
  appId: string().optional(),
  appSecret: buildSecretInputSchema().optional(),
  encryptKey: buildSecretInputSchema().optional(),
  verificationToken: buildSecretInputSchema().optional(),
  domain: FeishuDomainSchema.optional(),
  connectionMode: FeishuConnectionModeSchema.optional(),
  webhookPath: string().optional(),
  ...FeishuSharedConfigShape,
  groupSessionScope: GroupSessionScopeSchema,
  topicSessionMode: TopicSessionModeSchema,
}).strict();
const FeishuChannelConfigSchema = buildChannelConfigSchema(
  object({
    enabled: boolean().optional(),
    defaultAccount: string().optional(),
    appId: string().optional(),
    appSecret: buildSecretInputSchema().optional(),
    encryptKey: buildSecretInputSchema().optional(),
    verificationToken: buildSecretInputSchema().optional(),
    domain: FeishuDomainSchema.optional().default("feishu"),
    connectionMode: FeishuConnectionModeSchema.optional().default("websocket"),
    webhookPath: string().optional().default("/feishu/events"),
    ...FeishuSharedConfigShape,
    dmPolicy: DmPolicySchema.optional().default("pairing"),
    reactionNotifications: ReactionNotificationModeSchema.optional().default("own"),
    groupPolicy: GroupPolicySchema.optional().default("allowlist"),
    requireMention: boolean().optional(),
    groupSessionScope: GroupSessionScopeSchema,
    topicSessionMode: TopicSessionModeSchema,
    dynamicAgentCreation: DynamicAgentCreationSchema,
    typingIndicator: boolean().optional().default(true),
    resolveSenderNames: boolean().optional().default(true),
    accounts: record(string(), FeishuAccountConfigSchema.optional()).optional(),
  })
    .strict()
    .superRefine((value, ctx) => {
      const defaultAccount = value.defaultAccount?.trim();
      if (defaultAccount && value.accounts && Object.keys(value.accounts).length > 0) {
        const normalizedDefaultAccount = normalizeAccountId(defaultAccount);
        if (!Object.hasOwn(value.accounts, normalizedDefaultAccount))
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: ["defaultAccount"],
            message: `channels.feishu.defaultAccount="${defaultAccount}" does not match a configured account key`,
          });
      }
      const defaultConnectionMode = value.connectionMode ?? "websocket";
      const defaultVerificationTokenConfigured = hasConfiguredSecretInput(value.verificationToken);
      const defaultEncryptKeyConfigured = hasConfiguredSecretInput(value.encryptKey);
      if (defaultConnectionMode === "webhook") {
        if (!defaultVerificationTokenConfigured)
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: ["verificationToken"],
            message:
              'channels.feishu.connectionMode="webhook" requires channels.feishu.verificationToken',
          });
        if (!defaultEncryptKeyConfigured)
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: ["encryptKey"],
            message: 'channels.feishu.connectionMode="webhook" requires channels.feishu.encryptKey',
          });
      }
      for (const [accountId, account] of Object.entries(value.accounts ?? {})) {
        if (!account) continue;
        if ((account.connectionMode ?? defaultConnectionMode) !== "webhook") continue;
        const accountVerificationTokenConfigured =
          hasConfiguredSecretInput(account.verificationToken) || defaultVerificationTokenConfigured;
        const accountEncryptKeyConfigured =
          hasConfiguredSecretInput(account.encryptKey) || defaultEncryptKeyConfigured;
        if (!accountVerificationTokenConfigured)
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: ["accounts", accountId, "verificationToken"],
            message: `channels.feishu.accounts.${accountId}.connectionMode="webhook" requires a verificationToken (account-level or top-level)`,
          });
        if (!accountEncryptKeyConfigured)
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: ["accounts", accountId, "encryptKey"],
            message: `channels.feishu.accounts.${accountId}.connectionMode="webhook" requires an encryptKey (account-level or top-level)`,
          });
      }
      if (value.dmPolicy === "open") {
        if (!(value.allowFrom ?? []).some((entry) => String(entry).trim() === "*"))
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: ["allowFrom"],
            message:
              'channels.feishu.dmPolicy="open" requires channels.feishu.allowFrom to include "*"',
          });
      }
    }),
  { jsonSchemaMode: "input" },
);
//#endregion
//#region extensions/feishu/src/doctor.ts
const FEISHU_STATE_DIR = "feishu";
const BACKUP_PREFIX = "feishu-state-repair";
const BLANK_USER_MESSAGE_REPAIR_THRESHOLD = 3;
const SESSION_FILE_INSPECTION_MAX_BYTES = 16 * 1024 * 1024;
function timestampForPath(now = /* @__PURE__ */ new Date()) {
  return now.toISOString().replaceAll(":", "-");
}
function toFeishuSessionEntry(value) {
  if (!isRecord(value)) return {};
  return {
    sessionId: value.sessionId,
    sessionFile: value.sessionFile,
  };
}
function countLabel(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}
function existsDir(dir) {
  try {
    return fs.statSync(dir).isDirectory();
  } catch {
    return false;
  }
}
function existsFile(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}
function resolveFeishuAgentSessionsDir(agentId) {
  return path.join(resolveStateDir(), "agents", normalizeAgentId(agentId), "sessions");
}
function isSqliteTranscriptMarker(value) {
  return parseSqliteSessionFileMarker(value) !== void 0;
}
function safeReadDir(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}
function isPathWithinRoot(targetPath, rootPath) {
  const resolvedTarget = path.resolve(targetPath);
  const resolvedRoot = path.resolve(rootPath);
  const relative = path.relative(resolvedRoot, resolvedTarget);
  return relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative);
}
function formatDisplayPath(filePath) {
  const home = os.homedir();
  const resolved = path.resolve(filePath);
  return resolved === home || resolved.startsWith(`${home}${path.sep}`)
    ? `~${resolved.slice(home.length)}`
    : resolved;
}
function formatFinding(finding) {
  switch (finding.kind) {
    case "corrupt-state-json":
      return `- Feishu local JSON state is corrupt: ${formatDisplayPath(finding.path)}`;
    case "missing-session-transcript":
      return `- Feishu session ${finding.sessionKey} points to a missing transcript in ${formatDisplayPath(finding.storePath)}`;
    case "invalid-session-transcript":
      return `- Feishu session ${finding.sessionKey} has an invalid transcript (${finding.reason}): ${formatDisplayPath(finding.path)}`;
    case "blank-user-message-run":
      return `- Feishu session ${finding.sessionKey} contains ${finding.count} blank user messages: ${formatDisplayPath(finding.path)}`;
  }
  return finding;
}
function isFeishuSessionStoreKey(key) {
  const normalized = key.trim().toLowerCase();
  return /^agent:[^:]+:feishu(?::|$)/.test(normalized) || /^feishu(?::|$)/.test(normalized);
}
function isFeishuAcpBindingSessionKey(key) {
  return /^agent:[^:]+:acp:binding:feishu(?::|$)/.test(key.trim().toLowerCase());
}
function normalizeMetadataString(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}
function isFeishuSessionEntry(key, value) {
  if (isFeishuAcpBindingSessionKey(key)) return false;
  if (isFeishuSessionStoreKey(key)) return true;
  if (!isRecord(value)) return false;
  if (
    normalizeMetadataString(value.channel) === "feishu" ||
    normalizeMetadataString(value.lastChannel) === "feishu"
  )
    return true;
  if (normalizeMetadataString((isRecord(value.route) ? value.route : null)?.channel) === "feishu")
    return true;
  if (
    normalizeMetadataString(
      (isRecord(value.deliveryContext) ? value.deliveryContext : null)?.channel,
    ) === "feishu"
  )
    return true;
  if (
    normalizeMetadataString(
      (isRecord(value.pendingFinalDeliveryContext) ? value.pendingFinalDeliveryContext : null)
        ?.channel,
    ) === "feishu"
  )
    return true;
  const origin = isRecord(value.origin) ? value.origin : null;
  const originProvider = normalizeMetadataString(origin?.provider);
  const originSurface = normalizeMetadataString(origin?.surface);
  const originFrom = normalizeMetadataString(origin?.from);
  return (
    originProvider === "feishu" ||
    originSurface.startsWith("feishu") ||
    originFrom.startsWith("feishu:")
  );
}
function collectConfiguredAgentIds(cfg) {
  const ids = /* @__PURE__ */ new Set();
  ids.add(resolveConfiguredDefaultAgentId(cfg));
  for (const agent of cfg.agents?.list ?? [])
    if (typeof agent.id === "string" && agent.id.trim()) ids.add(normalizeAgentId(agent.id));
  return [...ids].toSorted();
}
function resolveConfiguredDefaultAgentId(cfg) {
  const agents = cfg.agents?.list ?? [];
  const chosen = agents.find((agent) => agent?.default) ?? agents[0];
  return normalizeAgentId(typeof chosen?.id === "string" && chosen.id.trim() ? chosen.id : "main");
}
function collectFeishuSessionTargets(params) {
  const byStorePath = /* @__PURE__ */ new Map();
  const addTarget = (target) => {
    const resolvedStorePath = path.resolve(target.storePath);
    byStorePath.set(`${normalizeAgentId(target.agentId)}\0${resolvedStorePath}`, {
      ...target,
      agentId: normalizeAgentId(target.agentId),
      storePath: resolvedStorePath,
    });
  };
  for (const agentId of collectConfiguredAgentIds(params.cfg))
    addTarget({
      agentId,
      storePath: resolveStorePath(params.cfg.session?.store, {
        agentId,
        env: params.env,
      }),
    });
  const agentsDir = path.join(params.stateDir, "agents");
  for (const agentDir of safeReadDir(agentsDir)) {
    if (!agentDir.isDirectory()) continue;
    const agentId = normalizeAgentId(agentDir.name);
    const storePath = path.join(agentsDir, agentDir.name, "sessions", "sessions.json");
    if (existsFile(storePath))
      addTarget({
        agentId,
        storePath,
      });
  }
  return [...byStorePath.values()].toSorted((left, right) =>
    left.storePath.localeCompare(right.storePath),
  );
}
function collectJsonFiles(rootDir, limit = 200) {
  const files = [];
  const visit = (dir) => {
    if (files.length >= limit) return;
    for (const entry of safeReadDir(dir).toSorted((left, right) =>
      left.name.localeCompare(right.name),
    )) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
        continue;
      }
      if (entry.isFile() && entry.name.endsWith(".json")) files.push(fullPath);
      if (files.length >= limit) return;
    }
  };
  if (existsDir(rootDir)) visit(rootDir);
  return files;
}
function collectCorruptFeishuStateJsonFindings(feishuStateDir) {
  const findings = [];
  for (const filePath of collectJsonFiles(feishuStateDir))
    try {
      JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch {
      findings.push({
        kind: "corrupt-state-json",
        path: filePath,
      });
    }
  return findings;
}
function resolveSessionTranscriptCandidates(params) {
  const candidates = /* @__PURE__ */ new Set();
  const sessionsDir = path.dirname(params.storePath);
  const agentSessionsDir = resolveFeishuAgentSessionsDir(params.agentId);
  const addSafeCandidate = (candidate) => {
    const resolved = path.isAbsolute(candidate)
      ? path.resolve(candidate)
      : path.resolve(sessionsDir, candidate);
    const isStoreCandidate = isPathWithinRoot(resolved, sessionsDir);
    const isAgentSessionCandidate = isPathWithinRoot(resolved, agentSessionsDir);
    if (
      resolved === sessionsDir ||
      resolved === agentSessionsDir ||
      (!isStoreCandidate && !isAgentSessionCandidate)
    )
      return false;
    candidates.add(resolved);
    return true;
  };
  if (
    typeof params.entry.sessionId === "string" &&
    /^[a-z0-9][a-z0-9._-]{0,127}$/i.test(params.entry.sessionId)
  ) {
    let addedExplicitCandidate = false;
    if (typeof params.entry.sessionFile === "string" && params.entry.sessionFile.trim()) {
      const explicitSessionFile = params.entry.sessionFile.trim();
      if (isSqliteTranscriptMarker(explicitSessionFile)) return [];
      addedExplicitCandidate = addSafeCandidate(explicitSessionFile);
    }
    if (!addedExplicitCandidate)
      candidates.add(path.join(sessionsDir, `${params.entry.sessionId}.jsonl`));
    return [...candidates].toSorted();
  }
  if (typeof params.entry.sessionFile === "string" && params.entry.sessionFile.trim())
    addSafeCandidate(params.entry.sessionFile.trim());
  return [...candidates].toSorted();
}
function isSessionHeader(value) {
  return isRecord(value) && value.type === "session" && typeof value.id === "string";
}
function isBlankUserMessage(value) {
  if (!isRecord(value) || value.type !== "message" || !isRecord(value.message)) return false;
  if (value.message.role !== "user") return false;
  const content = value.message.content;
  if (typeof content === "string") return content.trim().length === 0;
  return Array.isArray(content) && content.length === 0;
}
function isUserMessage(value) {
  return (
    isRecord(value) &&
    value.type === "message" &&
    isRecord(value.message) &&
    value.message.role === "user"
  );
}
function inspectTranscriptEntries(params) {
  let blankUserMessageRun = 0;
  let maxBlankUserMessageRun = 0;
  for (const entry of params.entries)
    if (isBlankUserMessage(entry)) {
      blankUserMessageRun += 1;
      maxBlankUserMessageRun = Math.max(maxBlankUserMessageRun, blankUserMessageRun);
    } else if (isUserMessage(entry)) blankUserMessageRun = 0;
  if (params.entries.length === 0) {
    if (params.allowMissingSessionHeader) return null;
    return {
      kind: "invalid-session-transcript",
      sessionKey: params.sessionKey,
      storePath: params.storePath,
      path: params.transcriptPath,
      reason: "empty transcript",
    };
  }
  const firstEntry = params.entries[0];
  if (
    !isSessionHeader(firstEntry) &&
    (!params.allowMissingSessionHeader ||
      (!isUserMessage(firstEntry) && !isBlankUserMessage(firstEntry)))
  )
    return {
      kind: "invalid-session-transcript",
      sessionKey: params.sessionKey,
      storePath: params.storePath,
      path: params.transcriptPath,
      reason: "invalid session header",
    };
  if ((params.malformedLines ?? 0) > 0)
    return {
      kind: "invalid-session-transcript",
      sessionKey: params.sessionKey,
      storePath: params.storePath,
      path: params.transcriptPath,
      reason: `${params.malformedLines} malformed JSONL line(s)`,
    };
  if (maxBlankUserMessageRun >= BLANK_USER_MESSAGE_REPAIR_THRESHOLD)
    return {
      kind: "blank-user-message-run",
      sessionKey: params.sessionKey,
      storePath: params.storePath,
      path: params.transcriptPath,
      count: maxBlankUserMessageRun,
    };
  return null;
}
function inspectSessionTranscript(params) {
  let stat;
  try {
    stat = fs.statSync(params.transcriptPath);
  } catch {
    return null;
  }
  if (!stat.isFile())
    return {
      kind: "invalid-session-transcript",
      sessionKey: params.sessionKey,
      storePath: params.storePath,
      path: params.transcriptPath,
      reason: "not a file",
    };
  if (stat.size > SESSION_FILE_INSPECTION_MAX_BYTES) return null;
  let raw;
  try {
    raw = fs.readFileSync(params.transcriptPath, "utf-8");
  } catch {
    return {
      kind: "invalid-session-transcript",
      sessionKey: params.sessionKey,
      storePath: params.storePath,
      path: params.transcriptPath,
      reason: "unreadable",
    };
  }
  const entries = [];
  let malformedLines = 0;
  for (const line of raw.split(/\r?\n/)) {
    if (!line.trim()) continue;
    try {
      const entry = JSON.parse(line);
      entries.push(entry);
    } catch {
      malformedLines += 1;
    }
  }
  return inspectTranscriptEntries({
    ...params,
    entries,
    malformedLines,
  });
}
function inspectSqliteSessionTranscript(params) {
  if (typeof params.entry.sessionFile !== "string") return null;
  const marker = parseSqliteSessionFileMarker(params.entry.sessionFile);
  if (!marker) return null;
  const sessionId =
    typeof params.entry.sessionId === "string" && params.entry.sessionId.trim()
      ? params.entry.sessionId.trim()
      : marker.sessionId;
  let entries;
  try {
    entries = loadTranscriptEventsSync({
      agentId: marker.agentId,
      sessionId,
      sessionKey: params.sessionKey,
      storePath: marker.storePath,
    });
  } catch {
    return {
      kind: "invalid-session-transcript",
      sessionKey: params.sessionKey,
      storePath: params.storePath,
      path: params.entry.sessionFile,
      reason: "unreadable",
    };
  }
  return inspectTranscriptEntries({
    sessionKey: params.sessionKey,
    storePath: params.storePath,
    transcriptPath: params.entry.sessionFile,
    allowMissingSessionHeader: true,
    entries,
  });
}
function collectFeishuSessionFindings(params) {
  const sqliteFinding = inspectSqliteSessionTranscript(params);
  if (sqliteFinding) return [sqliteFinding];
  const transcriptCandidates = resolveSessionTranscriptCandidates(params);
  const existing = transcriptCandidates.filter(existsFile);
  if (transcriptCandidates.length > 0 && existing.length === 0)
    return [
      {
        kind: "missing-session-transcript",
        sessionKey: params.sessionKey,
        storePath: params.storePath,
      },
    ];
  const findings = [];
  for (const transcriptPath of existing) {
    const finding = inspectSessionTranscript({
      sessionKey: params.sessionKey,
      storePath: params.storePath,
      transcriptPath,
    });
    if (finding) findings.push(finding);
  }
  return findings;
}
function hasCorruptFeishuStateJsonFinding(inspection) {
  return inspection.findings.some((finding) => finding.kind === "corrupt-state-json");
}
function sessionEntryId(storePath, key) {
  return `${path.resolve(storePath)}\0${key}`;
}
function collectRepairSessionEntries(inspection) {
  const entriesById = /* @__PURE__ */ new Map();
  for (const entry of inspection.sessionEntries)
    entriesById.set(sessionEntryId(entry.storePath, entry.key), entry);
  const repairEntries = [];
  const seen = /* @__PURE__ */ new Set();
  for (const finding of inspection.findings) {
    if (finding.kind === "corrupt-state-json") continue;
    const id = sessionEntryId(finding.storePath, finding.sessionKey);
    if (seen.has(id)) continue;
    const entry = entriesById.get(id);
    if (entry) {
      repairEntries.push(entry);
      seen.add(id);
    }
  }
  return repairEntries.toSorted(
    (left, right) =>
      left.storePath.localeCompare(right.storePath) || left.key.localeCompare(right.key),
  );
}
function inspectFeishuDoctorState(params) {
  const env = params.env ?? process.env;
  const stateDir = resolveStateDir(env, os.homedir);
  const feishuStateDir = path.join(stateDir, FEISHU_STATE_DIR);
  const findings = collectCorruptFeishuStateJsonFindings(feishuStateDir);
  const sessionEntries = [];
  for (const target of collectFeishuSessionTargets({
    cfg: params.cfg,
    env,
    stateDir,
  }))
    for (const { sessionKey: key, entry } of listSessionEntries({
      agentId: target.agentId,
      storePath: target.storePath,
    })
      .filter(
        ({ sessionKey, entry: sessionEntry }) =>
          !isValidAgentHarnessSessionStoreEntry(sessionKey, sessionEntry) &&
          isFeishuSessionEntry(sessionKey, sessionEntry),
      )
      .toSorted((left, right) => left.sessionKey.localeCompare(right.sessionKey))) {
      const sessionEntry = toFeishuSessionEntry(entry);
      sessionEntries.push({
        key,
        storePath: target.storePath,
        agentId: target.agentId,
        entry: sessionEntry,
      });
      findings.push(
        ...collectFeishuSessionFindings({
          sessionKey: key,
          storePath: target.storePath,
          agentId: target.agentId,
          entry: sessionEntry,
        }),
      );
    }
  return {
    stateDir,
    feishuStateDir,
    findings,
    sessionEntries,
  };
}
function ensureBackupDir(stateDir, now) {
  const backupDir = path.join(stateDir, "backups", `${BACKUP_PREFIX}-${timestampForPath(now)}`);
  fs.mkdirSync(backupDir, {
    recursive: true,
    mode: 448,
  });
  return backupDir;
}
function resolveUniquePath(candidate) {
  if (!fs.existsSync(candidate)) return candidate;
  for (let index = 1; index < 1e3; index += 1) {
    const next = `${candidate}.${index}`;
    if (!fs.existsSync(next)) return next;
  }
  throw new Error(`Unable to resolve unique path for ${candidate}`);
}
function movePathToBackup(params) {
  if (!fs.existsSync(params.sourcePath)) return false;
  const targetPath = resolveUniquePath(path.join(params.backupDir, params.relativeTarget));
  fs.mkdirSync(path.dirname(targetPath), {
    recursive: true,
    mode: 448,
  });
  fs.renameSync(params.sourcePath, targetPath);
  return true;
}
function copyStoreBackup(params) {
  const targetDir = path.join(params.backupDir, "session-stores", params.agentId);
  for (const sourcePath of resolveSessionStoreBackupPaths({
    agentId: params.agentId,
    storePath: params.storePath,
  })) {
    if (!existsFile(sourcePath)) continue;
    const targetPath = path.join(targetDir, path.basename(sourcePath));
    fs.mkdirSync(path.dirname(targetPath), {
      recursive: true,
      mode: 448,
    });
    fs.copyFileSync(sourcePath, resolveUniquePath(targetPath));
  }
}
function collectSessionArtifactPaths(params) {
  const artifacts = /* @__PURE__ */ new Set();
  for (const transcriptPath of resolveSessionTranscriptCandidates(params)) {
    artifacts.add(transcriptPath);
    if (transcriptPath.endsWith(".jsonl")) {
      const base = transcriptPath.slice(0, -6);
      artifacts.add(`${base}.trajectory.jsonl`);
      artifacts.add(`${base}.trajectory-path.json`);
    }
  }
  return [...artifacts].toSorted();
}
function archiveSessionArtifacts(params) {
  const seen = /* @__PURE__ */ new Set();
  let archived = 0;
  for (const entry of params.entries)
    for (const artifactPath of collectSessionArtifactPaths({
      storePath: params.storePath,
      agentId: entry.agentId,
      entry: entry.entry,
    })) {
      if (seen.has(artifactPath) || !existsFile(artifactPath)) continue;
      seen.add(artifactPath);
      const archivedPath = resolveUniquePath(`${artifactPath}.deleted.${params.archiveTimestamp}`);
      fs.renameSync(artifactPath, archivedPath);
      archived += 1;
    }
  return archived;
}
async function repairFeishuDoctorState(params) {
  const env = params.env ?? process.env;
  const now = params.now ?? /* @__PURE__ */ new Date();
  const inspection =
    params.inspection ??
    inspectFeishuDoctorState({
      cfg: params.cfg,
      env,
    });
  const backupDir = ensureBackupDir(inspection.stateDir, now);
  const archiveTimestamp = timestampForPath(now);
  const warnings = [];
  const stateDirRepairAttempted = hasCorruptFeishuStateJsonFinding(inspection);
  let rebuiltStateDir = false;
  if (stateDirRepairAttempted)
    try {
      rebuiltStateDir = movePathToBackup({
        sourcePath: inspection.feishuStateDir,
        backupDir,
        relativeTarget: FEISHU_STATE_DIR,
      });
      fs.mkdirSync(inspection.feishuStateDir, {
        recursive: true,
        mode: 448,
      });
    } catch (error) {
      warnings.push(`- Failed to rebuild Feishu local state: ${String(error)}`);
    }
  const entriesByStore = /* @__PURE__ */ new Map();
  for (const entry of collectRepairSessionEntries(inspection)) {
    const existing = entriesByStore.get(entry.storePath);
    if (existing)
      existing.entries.push({
        key: entry.key,
        entry: entry.entry,
      });
    else
      entriesByStore.set(entry.storePath, {
        agentId: entry.agentId,
        entries: [
          {
            key: entry.key,
            entry: entry.entry,
          },
        ],
      });
  }
  let removedSessionEntries = 0;
  let touchedSessionStores = 0;
  let archivedSessionArtifacts = 0;
  for (const [storePath, group] of [...entriesByStore.entries()].toSorted(([left], [right]) =>
    left.localeCompare(right),
  ))
    try {
      copyStoreBackup({
        storePath,
        backupDir,
        agentId: group.agentId,
      });
      const keys = new Set(group.entries.map((entry) => entry.key));
      const removedEntries = [];
      for (const key of keys) {
        const currentEntry = listSessionEntries({
          agentId: group.agentId,
          storePath,
        }).find((candidate) => candidate.sessionKey === key)?.entry;
        if (!currentEntry || isValidAgentHarnessSessionStoreEntry(key, currentEntry)) continue;
        if (
          !(await deleteSessionEntry({
            agentId: group.agentId,
            archiveTranscript: true,
            sessionKey: key,
            storePath,
          }))
        )
          continue;
        const entry = group.entries.find((candidate) => candidate.key === key);
        if (entry) removedEntries.push(entry);
      }
      const removed = removedEntries.length;
      removedSessionEntries += removed;
      if (removed > 0) {
        touchedSessionStores += 1;
        archivedSessionArtifacts += archiveSessionArtifacts({
          storePath,
          entries: removedEntries.map((entry) => ({
            agentId: group.agentId,
            entry: entry.entry,
          })),
          archiveTimestamp,
        });
      }
    } catch (error) {
      warnings.push(
        `- Failed to archive Feishu sessions in ${formatDisplayPath(storePath)}: ${String(error)}`,
      );
    }
  return {
    backupDir,
    stateDirRepairAttempted,
    rebuiltStateDir,
    removedSessionEntries,
    touchedSessionStores,
    archivedSessionArtifacts,
    warnings,
  };
}
function formatPreviewWarning(inspection) {
  const previewFindings = inspection.findings.slice(0, 5).map(formatFinding);
  const remaining = inspection.findings.length - previewFindings.length;
  const repairActions = [];
  if (hasCorruptFeishuStateJsonFinding(inspection))
    repairActions.push(`archive ${formatDisplayPath(inspection.feishuStateDir)}`);
  const repairSessionEntries = collectRepairSessionEntries(inspection);
  if (repairSessionEntries.length > 0)
    repairActions.push(
      `archive artifacts and remove ${countLabel(repairSessionEntries.length, "flagged Feishu-scoped session entry", "flagged Feishu-scoped session entries")}`,
    );
  const repairSummary =
    repairActions.length > 0 ? repairActions.join(" and ") : "apply targeted Feishu state cleanup";
  return [
    "- Feishu local channel state may need repair.",
    ...previewFindings,
    ...(remaining > 0 ? [`- ...and ${remaining} more Feishu state finding(s).`] : []),
    `- Repair will ${repairSummary}, while preserving Feishu App ID/secret config and healthy session entries.`,
    '- Run "openclaw doctor --fix" to rebuild Feishu local state.',
  ].join("\n");
}
function formatRepairChange(report) {
  const stateRepairStatus = report.stateDirRepairAttempted
    ? report.rebuiltStateDir
      ? "yes"
      : "no existing state"
    : "not needed";
  return [
    "Feishu local state repaired.",
    `- Backup dir: ${formatDisplayPath(report.backupDir)}`,
    `- Rebuilt Feishu runtime state: ${stateRepairStatus}`,
    `- Removed ${countLabel(report.removedSessionEntries, "Feishu-scoped session entry", "Feishu-scoped session entries")} from ${countLabel(report.touchedSessionStores, "session store")}.`,
    `- Archived ${countLabel(report.archivedSessionArtifacts, "session artifact file")}.`,
    "- Preserved Feishu App ID/secret config.",
  ].join("\n");
}
function hasConfiguredFeishuChannel(cfg) {
  return Boolean(cfg.channels?.feishu);
}
async function runFeishuDoctorSequence(params) {
  if (!hasConfiguredFeishuChannel(params.cfg))
    return {
      changeNotes: [],
      warningNotes: [],
    };
  const inspection = inspectFeishuDoctorState({
    cfg: params.cfg,
    env: params.env,
  });
  if (inspection.findings.length === 0)
    return {
      changeNotes: [],
      warningNotes: [],
    };
  if (!params.shouldRepair)
    return {
      changeNotes: [],
      warningNotes: [formatPreviewWarning(inspection)],
    };
  const report = await repairFeishuDoctorState({
    cfg: params.cfg,
    env: params.env,
    inspection,
  });
  return {
    changeNotes: [formatRepairChange(report)],
    warningNotes: report.warnings,
  };
}
const feishuDoctor = {
  legacyConfigRules,
  normalizeCompatibilityConfig,
  runConfigSequence: async ({ cfg, env, shouldRepair }) =>
    await runFeishuDoctorSequence({
      cfg,
      env,
      shouldRepair,
    }),
};
//#endregion
//#region extensions/feishu/src/session-route.ts
function resolveFeishuOutboundSessionRoute(params) {
  const rawTarget = stripChannelTargetPrefix(params.target, "feishu", "lark");
  const target = normalizeFeishuTarget(rawTarget);
  if (!target) return null;
  const isGroup = resolveReceiveIdType(rawTarget) === "chat_id";
  const account = resolveFeishuAccount({
    cfg: params.cfg,
    accountId: params.accountId,
  });
  const groupSessionScope = isGroup
    ? resolveConfiguredFeishuGroupSessionScope({
        groupConfig: resolveFeishuGroupConfig({
          cfg: account.config,
          groupId: target,
        }),
        feishuCfg: account.config,
      })
    : void 0;
  const recipientSessionExact = isGroup
    ? target.startsWith("oc_") && groupSessionScope === "group"
    : target.startsWith("ou_");
  return buildChannelOutboundSessionRoute({
    cfg: params.cfg,
    agentId: params.agentId,
    channel: "feishu",
    accountId: params.accountId,
    recipientSessionExact,
    peer: {
      kind: isGroup ? "group" : "direct",
      id: target,
    },
    chatType: isGroup ? "group" : "direct",
    from: isGroup ? `feishu:group:${target}` : `feishu:${target}`,
    to: target,
  });
}
//#endregion
//#region extensions/feishu/src/setup-core.ts
function setFeishuNamedAccountEnabled$1(cfg, accountId, enabled) {
  const feishuCfg = cfg.channels?.feishu;
  return {
    ...cfg,
    channels: {
      ...cfg.channels,
      feishu: {
        ...feishuCfg,
        accounts: {
          ...feishuCfg?.accounts,
          [accountId]: {
            ...feishuCfg?.accounts?.[accountId],
            enabled,
          },
        },
      },
    },
  };
}
const feishuSetupAdapter = {
  resolveAccountId: ({ cfg, accountId }) => accountId?.trim() || resolveDefaultFeishuAccountId(cfg),
  applyAccountConfig: ({ cfg, accountId }) => {
    if (!accountId || accountId === "default")
      return {
        ...cfg,
        channels: {
          ...cfg.channels,
          feishu: {
            ...cfg.channels?.feishu,
            enabled: true,
          },
        },
      };
    return setFeishuNamedAccountEnabled$1(cfg, accountId, true);
  },
};
//#endregion
//#region extensions/feishu/src/setup-surface.ts
const t = createSetupTranslator();
const channel = "feishu";
const SCAN_TO_CREATE_TP = "ob_cli_app";
const FEISHU_SETUP_FLOW_KEY = "_flow";
function isFeishuConfigured(cfg) {
  const feishuCfg = cfg.channels?.feishu;
  const isAppIdConfigured = (value) => {
    if (normalizeOptionalString(value)) return true;
    if (!value || typeof value !== "object") return false;
    const rec = value;
    const source = normalizeOptionalString(rec.source)?.toLowerCase();
    const id = normalizeOptionalString(rec.id);
    if (source === "env" && id) return Boolean(normalizeOptionalString(process.env[id]));
    return hasConfiguredSecretInput(value);
  };
  const topLevelConfigured =
    isAppIdConfigured(feishuCfg?.appId) && hasConfiguredSecretInput(feishuCfg?.appSecret);
  const accountConfigured = Object.values(feishuCfg?.accounts ?? {}).some((account) => {
    if (!account || typeof account !== "object") return false;
    const hasOwnAppId = Object.hasOwn(account, "appId");
    const hasOwnAppSecret = Object.hasOwn(account, "appSecret");
    const accountAppIdConfigured = hasOwnAppId
      ? isAppIdConfigured(account.appId)
      : isAppIdConfigured(feishuCfg?.appId);
    const accountSecretConfigured = hasOwnAppSecret
      ? hasConfiguredSecretInput(account.appSecret)
      : hasConfiguredSecretInput(feishuCfg?.appSecret);
    return accountAppIdConfigured && accountSecretConfigured;
  });
  return topLevelConfigured || accountConfigured;
}
function formatFeishuStatusLine(status) {
  if (status === "needs-credentials")
    return `Feishu: ${t("wizard.channels.statusNeedsAppCredentials")}`;
  return `Feishu: ${t("wizard.channels.statusConfiguredConnectionNotVerified")}`;
}
/**
 * Patch feishu config at the correct location based on accountId.
 * - DEFAULT_ACCOUNT_ID → writes to top-level channels.feishu
 * - named account → writes to channels.feishu.accounts[accountId]
 */
function patchFeishuConfig(cfg, accountId, patch) {
  const feishuCfg = cfg.channels?.feishu;
  if (accountId === "default")
    return patchTopLevelChannelConfigSection({
      cfg,
      channel,
      enabled: true,
      patch,
    });
  const nextAccountPatch = {
    ...feishuCfg?.accounts?.[accountId],
    enabled: true,
    ...patch,
  };
  return patchTopLevelChannelConfigSection({
    cfg,
    channel,
    enabled: true,
    patch: {
      accounts: {
        ...feishuCfg?.accounts,
        [accountId]: nextAccountPatch,
      },
    },
  });
}
async function promptFeishuAllowFrom(params) {
  const feishuCfg = params.cfg.channels?.feishu;
  const resolvedAccountId = params.accountId ?? resolveDefaultFeishuAccountId(params.cfg);
  const existingAllowFrom =
    (resolvedAccountId !== "default" ? feishuCfg?.accounts?.[resolvedAccountId] : void 0)
      ?.allowFrom ??
    feishuCfg?.allowFrom ??
    [];
  await params.prompter.note(
    [
      t("wizard.feishu.allowlistIntro"),
      t("wizard.feishu.allowlistFindUser"),
      t("wizard.feishu.examples"),
      "- ou_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "- on_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    ].join("\n"),
    t("wizard.feishu.allowlistTitle"),
  );
  const mergedAllowFrom = mergeAllowFromEntries(
    existingAllowFrom,
    splitSetupEntries(
      await params.prompter.text({
        message: t("wizard.feishu.allowFromPrompt"),
        placeholder: "ou_xxxxx, ou_yyyyy",
        initialValue:
          existingAllowFrom.length > 0 ? existingAllowFrom.map(String).join(", ") : void 0,
      }),
    ),
  );
  return patchFeishuConfig(params.cfg, resolvedAccountId, { allowFrom: mergedAllowFrom });
}
async function noteFeishuCredentialHelp(prompter) {
  await prompter.note(
    [
      t("wizard.feishu.credentialsStepOpenPlatform"),
      t("wizard.feishu.credentialsStepCreateApp"),
      t("wizard.feishu.credentialsStepGetCredentials"),
      t("wizard.feishu.credentialsStepPermissions"),
      t("wizard.feishu.credentialsStepPublish"),
      t("wizard.feishu.credentialsEnvTip"),
      t("wizard.channels.docs", { link: formatDocsLink("/channels/feishu", "feishu") }),
    ].join("\n"),
    t("wizard.feishu.credentialsTitle"),
  );
}
async function promptFeishuAppId(params) {
  return (
    await params.prompter.text({
      message: t("wizard.feishu.appIdPrompt"),
      initialValue: params.initialValue,
      validate: (value) => (value?.trim() ? void 0 : t("common.required")),
    })
  ).trim();
}
const feishuDmPolicy = {
  label: "Feishu",
  channel,
  policyKey: "channels.feishu.dmPolicy",
  allowFromKey: "channels.feishu.allowFrom",
  resolveConfigKeys: (_cfg, accountId) => {
    const resolvedAccountId = accountId ?? resolveDefaultFeishuAccountId(_cfg);
    return resolvedAccountId !== "default"
      ? {
          policyKey: `channels.feishu.accounts.${resolvedAccountId}.dmPolicy`,
          allowFromKey: `channels.feishu.accounts.${resolvedAccountId}.allowFrom`,
        }
      : {
          policyKey: "channels.feishu.dmPolicy",
          allowFromKey: "channels.feishu.allowFrom",
        };
  },
  getCurrent: (cfg, accountId) => {
    const feishuCfg = cfg.channels?.feishu;
    const resolvedAccountId = accountId ?? resolveDefaultFeishuAccountId(cfg);
    if (resolvedAccountId !== "default") {
      const account = feishuCfg?.accounts?.[resolvedAccountId];
      if (account?.dmPolicy) return account.dmPolicy;
    }
    return feishuCfg?.dmPolicy ?? "pairing";
  },
  setPolicy: (cfg, policy, accountId) => {
    return patchFeishuConfig(cfg, accountId ?? resolveDefaultFeishuAccountId(cfg), {
      dmPolicy: policy,
      ...(policy === "open" ? { allowFrom: mergeAllowFromEntries([], ["*"]) } : {}),
    });
  },
  promptAllowFrom: promptFeishuAllowFrom,
};
function applyNewAppSecurityPolicy(cfg, accountId, openId, groupPolicy) {
  let next = cfg;
  if (openId)
    next = patchFeishuConfig(next, accountId, {
      dmPolicy: "allowlist",
      allowFrom: [openId],
    });
  const groupPatch = { groupPolicy };
  if (groupPolicy === "open") groupPatch.requireMention = true;
  next = patchFeishuConfig(next, accountId, groupPatch);
  return next;
}
const loadAppRegistrationModule = createLazyRuntimeModule(
  () => import("./app-registration-B9Vt8Mat.js"),
);
async function promptFeishuDomain(params) {
  return await params.prompter.select({
    message: t("wizard.feishu.domainPrompt"),
    options: [
      {
        value: "feishu",
        label: t("wizard.feishu.domainFeishu"),
      },
      {
        value: "lark",
        label: t("wizard.feishu.domainLark"),
      },
    ],
    initialValue: params.initialValue ?? "feishu",
  });
}
async function promptFeishuSetupMethod(prompter) {
  return await prompter.select({
    message: t("wizard.feishu.setupMethodPrompt"),
    options: [
      {
        value: "manual",
        label: t("wizard.feishu.setupMethodManual"),
      },
      {
        value: "scan",
        label: t("wizard.feishu.setupMethodScan"),
      },
    ],
    initialValue: "manual",
  });
}
async function runScanToCreate(prompter, domain, beforePersistentEffect) {
  const { beginAppRegistration, initAppRegistration, pollAppRegistration, printQrCode } =
    await loadAppRegistrationModule();
  try {
    await initAppRegistration(domain);
  } catch {
    await prompter.note(t("wizard.feishu.scanUnavailable"), t("wizard.feishu.setupTitle"));
    return null;
  }
  await beforePersistentEffect?.();
  const begin = await beginAppRegistration(domain);
  await prompter.note(t("wizard.feishu.scanQr"), t("wizard.feishu.scanTitle"));
  await printQrCode(begin.qrUrl);
  const progress = prompter.progress(t("wizard.feishu.fetchingConfig"));
  const outcome = await pollAppRegistration({
    deviceCode: begin.deviceCode,
    interval: begin.interval,
    expireIn: begin.expireIn,
    initialDomain: domain,
    tp: SCAN_TO_CREATE_TP,
  });
  switch (outcome.status) {
    case "success":
      progress.stop(t("wizard.feishu.scanCompleted"));
      return outcome.result;
    case "access_denied":
      progress.stop(t("wizard.feishu.scanDenied"));
      return null;
    case "expired":
      progress.stop(t("wizard.feishu.scanExpired"));
      return null;
    case "timeout":
      progress.stop(t("wizard.feishu.scanTimedOut"));
      return null;
    case "error":
      progress.stop(t("wizard.feishu.scanError", { error: outcome.message }));
      return null;
  }
  return null;
}
async function runNewAppFlow(params) {
  const { prompter, options } = params;
  let next = params.cfg;
  const targetAccountId = resolveDefaultFeishuAccountId(next);
  let appId;
  let appSecret = null;
  let appSecretProbeValue = null;
  let scanDomain;
  let scanOpenId;
  const currentDomain = next.channels?.feishu?.domain ?? "feishu";
  const setupMethod = await promptFeishuSetupMethod(prompter);
  const selectedDomain = await promptFeishuDomain({
    prompter,
    initialValue: currentDomain,
  });
  scanDomain = selectedDomain;
  const scanResult =
    setupMethod === "scan"
      ? await runScanToCreate(prompter, selectedDomain, options?.beforePersistentEffect)
      : null;
  if (scanResult) {
    appId = scanResult.appId;
    appSecret = scanResult.appSecret;
    scanDomain = scanResult.domain;
    scanOpenId = scanResult.openId;
  } else {
    await noteFeishuCredentialHelp(prompter);
    appId = await promptFeishuAppId({
      prompter,
      initialValue: normalizeOptionalString(process.env.FEISHU_APP_ID),
    });
    const appSecretResult = await promptSingleChannelSecretInput({
      cfg: next,
      prompter,
      providerHint: "feishu",
      credentialLabel: "App Secret",
      secretInputMode: options?.secretInputMode,
      accountConfigured: false,
      canUseEnv: false,
      hasConfigToken: false,
      envPrompt: "",
      keepPrompt: t("wizard.feishu.appSecretKeep"),
      inputPrompt: t("wizard.feishu.appSecretPrompt"),
      preferredEnvVar: "FEISHU_APP_SECRET",
    });
    if (appSecretResult.action === "set") {
      appSecret = appSecretResult.value;
      appSecretProbeValue = appSecretResult.resolvedValue;
    }
    if (appId && appSecretProbeValue) {
      const { getAppOwnerOpenId } = await loadAppRegistrationModule();
      scanOpenId = await getAppOwnerOpenId({
        appId,
        appSecret: appSecretProbeValue,
        domain: selectedDomain,
      });
    }
  }
  const groupPolicy = await prompter.select({
    message: t("wizard.feishu.groupPolicyPrompt"),
    options: [
      {
        value: "allowlist",
        label: t("wizard.feishu.groupPolicyAllowlist"),
      },
      {
        value: "open",
        label: t("wizard.feishu.groupPolicyOpen"),
      },
      {
        value: "disabled",
        label: t("wizard.feishu.groupPolicyDisabled"),
      },
    ],
    initialValue: "allowlist",
  });
  const configProgress = prompter.progress(t("wizard.feishu.configuring"));
  await new Promise((resolve) => {
    setTimeout(resolve, 50);
  });
  if (appId && appSecret)
    next = patchFeishuConfig(next, targetAccountId, {
      appId,
      appSecret,
      connectionMode: "websocket",
      ...(scanDomain ? { domain: scanDomain } : {}),
    });
  else if (scanDomain) next = patchFeishuConfig(next, targetAccountId, { domain: scanDomain });
  next = applyNewAppSecurityPolicy(next, targetAccountId, scanOpenId, groupPolicy);
  configProgress.stop(t("wizard.feishu.botConfigured"));
  return { cfg: next };
}
async function runEditFlow(params) {
  const { prompter, options } = params;
  const next = params.cfg;
  const feishuCfg = next.channels?.feishu;
  const resolveAppIdLabel = (value) => {
    const asString = normalizeOptionalString(value);
    if (asString) return asString;
    if (value && typeof value === "object") {
      const rec = value;
      if (normalizeOptionalString(rec.source) && normalizeOptionalString(rec.id))
        return normalizeOptionalString(process.env[rec.id]) ?? `env:${String(rec.id)}`;
      if (hasConfiguredSecretInput(value)) return "(configured)";
    }
  };
  const existingAppId =
    resolveAppIdLabel(feishuCfg?.appId) ??
    Object.values(feishuCfg?.accounts ?? {}).reduce(
      (found, account) => {
        if (found) return found;
        if (account && typeof account === "object") return resolveAppIdLabel(account.appId);
      },
      void 0,
    );
  if (existingAppId) {
    if (
      !(await prompter.confirm({
        message: t("wizard.feishu.existingBotPrompt", { appId: existingAppId }),
        initialValue: true,
      }))
    )
      return runNewAppFlow({
        cfg: next,
        prompter,
        options,
      });
  } else
    return runNewAppFlow({
      cfg: next,
      prompter,
      options,
    });
  await prompter.note(t("wizard.feishu.botConfigured"), "");
  return { cfg: next };
}
async function runFeishuLogin(params) {
  const { cfg, prompter } = params;
  const options = {};
  if (isFeishuConfigured(cfg)) {
    const result = await runEditFlow({
      cfg,
      prompter,
      options,
    });
    if (result === null) return cfg;
    return result.cfg;
  }
  return (
    await runNewAppFlow({
      cfg,
      prompter,
      options,
    })
  ).cfg;
}
const feishuSetupWizard = {
  channel,
  resolveAccountIdForConfigure: ({ accountOverride, defaultAccountId, cfg }) =>
    (typeof accountOverride === "string" && accountOverride.trim()
      ? accountOverride.trim()
      : void 0) ??
    resolveDefaultFeishuAccountId(cfg) ??
    defaultAccountId,
  resolveShouldPromptAccountIds: () => false,
  status: {
    configuredLabel: t("wizard.channels.statusConfigured"),
    unconfiguredLabel: t("wizard.channels.statusNeedsAppCredentials"),
    configuredHint: t("wizard.channels.statusConfigured"),
    unconfiguredHint: t("wizard.channels.statusNeedsAppCreds"),
    configuredScore: 2,
    unconfiguredScore: 0,
    resolveConfigured: ({ cfg }) => isFeishuConfigured(cfg),
    resolveStatusLines: async ({ cfg, accountId, configured }) => {
      const account = resolveFeishuAccount({
        cfg,
        accountId,
      });
      let probeResult = null;
      if (configured && account.configured)
        try {
          const { probeFeishu } = await import("./probe-BnKy3A0L.js");
          probeResult = await probeFeishu(account);
        } catch {}
      if (!configured) return [formatFeishuStatusLine("needs-credentials")];
      if (probeResult?.ok)
        return [
          `Feishu: ${t("wizard.channels.statusConnectedAs", { name: probeResult.botName ?? probeResult.botOpenId ?? "bot" })}`,
        ];
      return [formatFeishuStatusLine("configured-unverified")];
    },
  },
  prepare: async ({ cfg, credentialValues }) => {
    if (isFeishuConfigured(cfg))
      return {
        credentialValues: {
          ...credentialValues,
          [FEISHU_SETUP_FLOW_KEY]: "edit",
        },
      };
    return {
      credentialValues: {
        ...credentialValues,
        [FEISHU_SETUP_FLOW_KEY]: "new",
      },
    };
  },
  credentials: [],
  finalize: async ({ cfg, prompter, options, credentialValues }) => {
    if ((credentialValues[FEISHU_SETUP_FLOW_KEY] ?? "new") === "edit") {
      const result = await runEditFlow({
        cfg,
        prompter,
        options,
      });
      if (result === null) return { cfg };
      return result;
    }
    return runNewAppFlow({
      cfg,
      prompter,
      options,
    });
  },
  dmPolicy: feishuDmPolicy,
  disable: (cfg) =>
    patchTopLevelChannelConfigSection({
      cfg,
      channel,
      patch: { enabled: false },
    }),
};
//#endregion
//#region extensions/feishu/src/channel.ts
function readFeishuMediaParam(params) {
  const media = params.media;
  if (typeof media !== "string") return;
  return media.trim() ? media : void 0;
}
function readBooleanParam(params, keys) {
  for (const key of keys) {
    const value = params[key];
    if (typeof value === "boolean") return value;
  }
}
function hasLegacyFeishuCardCommandValue(actionValue) {
  return (
    isRecord$1(actionValue) &&
    actionValue.oc !== "ocf1" &&
    (Boolean(typeof actionValue.command === "string" && actionValue.command.trim()) ||
      Boolean(typeof actionValue.text === "string" && actionValue.text.trim()))
  );
}
function containsLegacyFeishuCardCommandValue(node) {
  if (Array.isArray(node)) return node.some((item) => containsLegacyFeishuCardCommandValue(item));
  if (!isRecord$1(node)) return false;
  if (node.tag === "button" && hasLegacyFeishuCardCommandValue(node.value)) return true;
  if (
    node.tag === "button" &&
    Array.isArray(node.behaviors) &&
    node.behaviors.some(
      (behavior) => isRecord$1(behavior) && hasLegacyFeishuCardCommandValue(behavior.value),
    )
  )
    return true;
  return Object.values(node).some((value) => containsLegacyFeishuCardCommandValue(value));
}
const meta = {
  id: "feishu",
  label: "Feishu",
  selectionLabel: "Feishu/Lark (飞书)",
  docsPath: "/channels/feishu",
  docsLabel: "feishu",
  blurb: "飞书/Lark enterprise messaging.",
  aliases: ["lark"],
  order: 70,
  preferSessionLookupForAnnounceTarget: true,
};
const loadFeishuChannelRuntime = createLazyRuntimeNamedExport(
  () => import("./channel.runtime-N0xTisDm.js"),
  "feishuChannelRuntime",
);
function toFeishuMessageSendResult(result, kind) {
  const receipt =
    result.receipt ??
    createFeishuSendReceipt({
      messageId: result.messageId,
      chatId: result.chatId ?? "",
      kind,
    });
  return {
    messageId: result.messageId || receipt.primaryPlatformMessageId,
    receipt,
  };
}
const feishuMessageAdapter = defineChannelMessageAdapter({
  id: "feishu",
  durableFinal: {
    capabilities: {
      text: true,
      media: true,
    },
  },
  send: {
    text: async (ctx) => {
      const sendText = (await loadFeishuChannelRuntime()).feishuOutbound.sendText;
      if (!sendText) throw new Error("Feishu text sending is not available.");
      const { onDeliveryResult, ...outboundCtx } = ctx;
      return toFeishuMessageSendResult(
        await sendText({
          ...outboundCtx,
          ...(onDeliveryResult
            ? {
                onDeliveryResult: async (progress) => {
                  await onDeliveryResult(toFeishuMessageSendResult(progress, "text"));
                },
              }
            : {}),
        }),
        "text",
      );
    },
    media: async (ctx) => {
      const sendMedia = (await loadFeishuChannelRuntime()).feishuOutbound.sendMedia;
      if (!sendMedia) throw new Error("Feishu media sending is not available.");
      const { onDeliveryResult, ...outboundCtx } = ctx;
      return toFeishuMessageSendResult(
        await sendMedia({
          ...outboundCtx,
          ...(onDeliveryResult
            ? {
                onDeliveryResult: async (progress) => {
                  await onDeliveryResult(toFeishuMessageSendResult(progress, "media"));
                },
              }
            : {}),
        }),
        "media",
      );
    },
  },
});
async function createFeishuActionClient(account) {
  const { createFeishuClient } = await import("./client-BigXnVay.js");
  return createFeishuClient(account);
}
async function resolveFeishuChatTypeById(params) {
  const client = await createFeishuActionClient(params.account);
  return resolveFeishuChatType(await params.runtime.getChatInfo(client, params.chatId));
}
async function resolveFeishuMessageChatType(params) {
  const knownChatType = normalizeFeishuChatType(params.message.chatType);
  if (knownChatType) return knownChatType;
  return resolveFeishuChatTypeById({
    account: params.account,
    chatId: params.message.chatId,
    runtime: params.runtime,
  });
}
const collectFeishuSecurityWarnings = createAllowlistProviderGroupPolicyWarningCollector({
  providerConfigPresent: (cfg) => cfg.channels?.feishu !== void 0,
  resolveGroupPolicy: ({ cfg, accountId }) =>
    resolveFeishuAccount({
      cfg,
      accountId,
    }).config?.groupPolicy,
  collect: ({ cfg, accountId, groupPolicy }) => {
    if (groupPolicy !== "open") return [];
    return [
      `- Feishu[${
        resolveFeishuAccount({
          cfg,
          accountId,
        }).accountId
      }] groups: groupPolicy="open" allows any member to trigger (mention-gated). Set channels.feishu.groupPolicy="allowlist" + channels.feishu.groupAllowFrom to restrict senders.`,
    ];
  },
});
function describeFeishuMessageTool({ cfg, accountId }) {
  const enabledAccounts = accountId
    ? [
        resolveFeishuAccount({
          cfg,
          accountId,
        }),
      ].filter((account) => account.enabled && account.configured)
    : listEnabledFeishuAccounts(cfg);
  const enabled =
    enabledAccounts.length > 0 ||
    (!accountId &&
      cfg.channels?.feishu?.enabled !== false &&
      Boolean(inspectFeishuCredentials(cfg.channels?.feishu)));
  if (enabledAccounts.length === 0)
    return {
      actions: [],
      capabilities: enabled ? ["presentation"] : [],
    };
  const actions = /* @__PURE__ */ new Set([
    "send",
    "read",
    "edit",
    "thread-reply",
    "pin",
    "list-pins",
    "unpin",
    "member-info",
    "channel-info",
    "channel-list",
  ]);
  if (
    accountId
      ? enabledAccounts.some((account) =>
          isFeishuReactionsActionEnabled({
            cfg,
            account,
          }),
        )
      : areAnyFeishuReactionActionsEnabled(cfg)
  ) {
    actions.add("react");
    actions.add("reactions");
  }
  return {
    actions: Array.from(actions),
    capabilities: enabled ? ["presentation"] : [],
  };
}
function setFeishuNamedAccountEnabled(cfg, accountId, enabled) {
  const feishuCfg = cfg.channels?.feishu;
  return {
    ...cfg,
    channels: {
      ...cfg.channels,
      feishu: {
        ...feishuCfg,
        accounts: {
          ...feishuCfg?.accounts,
          [accountId]: {
            ...feishuCfg?.accounts?.[accountId],
            enabled,
          },
        },
      },
    },
  };
}
const feishuConfigAdapter = createHybridChannelConfigAdapter({
  sectionKey: "feishu",
  listAccountIds: listFeishuAccountIds,
  resolveAccount: adaptScopedAccountAccessor(resolveFeishuAccount),
  defaultAccountId: resolveDefaultFeishuAccountId,
  clearBaseFields: [],
  resolveAllowFrom: (account) => account.config.allowFrom,
  formatAllowFrom: (allowFrom) => formatAllowFromLowercase({ allowFrom }),
});
function isFeishuReactionsActionEnabled(params) {
  if (!params.account.enabled || !params.account.configured) return false;
  return createActionGate(params.account.config.actions ?? params.cfg.channels?.feishu?.actions)(
    "reactions",
  );
}
function areAnyFeishuReactionActionsEnabled(cfg) {
  for (const account of listEnabledFeishuAccounts(cfg))
    if (
      isFeishuReactionsActionEnabled({
        cfg,
        account,
      })
    )
      return true;
  return false;
}
function isFeishuGroupTopicSessionKey(sessionKey) {
  if (typeof sessionKey !== "string" || !sessionKey) return false;
  const parsed = parseFeishuConversationId({ conversationId: sessionKey });
  return parsed?.scope === "group_topic" || parsed?.scope === "group_topic_sender";
}
function resolveFeishuTopicAutoThreadAnchor(ctx) {
  if (ctx.action !== "send") return;
  if (!isFeishuGroupTopicSessionKey(ctx.sessionKey)) return;
  const inbound = ctx.toolContext?.currentMessageId;
  return typeof inbound === "string" && inbound.length > 0 ? inbound : void 0;
}
function buildFeishuSendReplyAnchor(ctx) {
  if (ctx.action === "thread-reply")
    return {
      replyToMessageId: resolveFeishuMessageId(ctx.params),
      replyInThread: true,
    };
  const autoThreadId = resolveFeishuTopicAutoThreadAnchor(ctx);
  return {
    replyToMessageId: autoThreadId,
    replyInThread: autoThreadId !== void 0,
  };
}
function isSupportedFeishuDirectConversationId(conversationId) {
  const trimmed = conversationId.trim();
  if (!trimmed || trimmed.includes(":")) return false;
  if (trimmed.startsWith("oc_") || trimmed.startsWith("on_")) return false;
  return true;
}
function normalizeFeishuAcpConversationId(conversationId) {
  const parsed = parseFeishuConversationId({ conversationId });
  if (
    !parsed ||
    (parsed.scope !== "group_topic" &&
      parsed.scope !== "group_topic_sender" &&
      !isSupportedFeishuDirectConversationId(parsed.canonicalConversationId))
  )
    return null;
  return {
    conversationId: parsed.canonicalConversationId,
    parentConversationId:
      parsed.scope === "group_topic" || parsed.scope === "group_topic_sender"
        ? parsed.chatId
        : void 0,
  };
}
function matchFeishuAcpConversation(params) {
  const binding = normalizeFeishuAcpConversationId(params.bindingConversationId);
  if (!binding) return null;
  const incoming = parseFeishuConversationId({
    conversationId: params.conversationId,
    parentConversationId: params.parentConversationId,
  });
  if (
    !incoming ||
    (incoming.scope !== "group_topic" &&
      incoming.scope !== "group_topic_sender" &&
      !isSupportedFeishuDirectConversationId(incoming.canonicalConversationId))
  )
    return null;
  const matchesCanonicalConversation = binding.conversationId === incoming.canonicalConversationId;
  const matchesParentTopicForSenderScopedConversation =
    incoming.scope === "group_topic_sender" &&
    binding.parentConversationId === incoming.chatId &&
    binding.conversationId === `${incoming.chatId}:topic:${incoming.topicId}`;
  if (!matchesCanonicalConversation && !matchesParentTopicForSenderScopedConversation) return null;
  return {
    conversationId: matchesParentTopicForSenderScopedConversation
      ? binding.conversationId
      : incoming.canonicalConversationId,
    parentConversationId:
      incoming.scope === "group_topic" || incoming.scope === "group_topic_sender"
        ? incoming.chatId
        : void 0,
    matchPriority: matchesCanonicalConversation ? 2 : 1,
  };
}
function resolveFeishuSenderScopedCommandConversation(params) {
  const parentConversationId = params.parentConversationId?.trim();
  const threadId = params.threadId?.trim();
  const senderId = params.senderId?.trim();
  if (!parentConversationId || !threadId || !senderId) return;
  const expectedScopePrefix = `feishu:group:${normalizeLowercaseStringOrEmpty(parentConversationId)}:topic:${normalizeLowercaseStringOrEmpty(threadId)}:sender:`;
  const isSenderScopedSession = [params.sessionKey, params.parentSessionKey].some((candidate) => {
    const normalized = normalizeLowercaseStringOrEmpty(candidate ?? "");
    if (!normalized) return false;
    return normalized.replace(/^agent:[^:]+:/, "").startsWith(expectedScopePrefix);
  });
  const senderScopedConversationId = buildFeishuConversationId({
    chatId: parentConversationId,
    scope: "group_topic_sender",
    topicId: threadId,
    senderOpenId: senderId,
  });
  if (isSenderScopedSession) return senderScopedConversationId;
  if (!params.sessionKey?.trim()) return;
  return getSessionBindingService()
    .listBySession(params.sessionKey)
    .find((binding) => {
      if (
        binding.conversation.channel !== "feishu" ||
        binding.conversation.accountId !== params.accountId
      )
        return false;
      return binding.conversation.conversationId === senderScopedConversationId;
    })?.conversation.conversationId;
}
function resolveFeishuCommandConversation(params) {
  if (params.threadId) {
    const parentConversationId =
      parseFeishuTargetId(params.originatingTo) ??
      parseFeishuTargetId(params.commandTo) ??
      parseFeishuTargetId(params.fallbackTo);
    if (!parentConversationId) return null;
    return {
      conversationId:
        resolveFeishuSenderScopedCommandConversation({
          accountId: params.accountId,
          parentConversationId,
          threadId: params.threadId,
          senderId: params.senderId,
          sessionKey: params.sessionKey,
          parentSessionKey: params.parentSessionKey,
        }) ??
        buildFeishuConversationId({
          chatId: parentConversationId,
          scope: "group_topic",
          topicId: params.threadId,
        }),
      parentConversationId,
    };
  }
  const conversationId =
    parseFeishuDirectConversationId(params.originatingTo) ??
    parseFeishuDirectConversationId(params.commandTo) ??
    parseFeishuDirectConversationId(params.fallbackTo);
  return conversationId ? { conversationId } : null;
}
function jsonActionResult(details) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(details),
      },
    ],
    details,
  };
}
function readFirstString(params, keys, fallback) {
  for (const key of keys) {
    const value = params[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  if (typeof fallback === "string" && fallback.trim()) return fallback.trim();
}
const UNRESOLVED_RESPONSE_PREFIX_VAR_PATTERN = /\{[a-zA-Z][a-zA-Z0-9.]*\}/;
function resolveFeishuMessageActionResponsePrefix(ctx) {
  const configured = ctx.cfg.messages?.responsePrefix;
  if (!configured) return;
  const agentId = (ctx.agentId?.trim() || "main").toLowerCase();
  const identityName = ctx.cfg.agents?.list
    ?.find((agent) => agent.id.trim().toLowerCase() === agentId)
    ?.identity?.name?.trim();
  const resolved =
    configured === "auto"
      ? identityName
        ? `[${identityName}]`
        : void 0
      : configured.replace(/\{(?:identity\.name|identityname)\}/gi, identityName ?? "$&");
  return resolved && !UNRESOLVED_RESPONSE_PREFIX_VAR_PATTERN.test(resolved) ? resolved : void 0;
}
function readOptionalPositiveInteger(params, keys) {
  for (const key of keys) {
    const parsed = parseStrictPositiveInteger(params[key]);
    if (parsed !== void 0) return parsed;
  }
}
function resolveFeishuActionTarget(ctx) {
  return readFirstString(ctx.params, ["to", "target"], ctx.toolContext?.currentChannelId);
}
function resolveFeishuChatId(ctx) {
  const raw = readFirstString(
    ctx.params,
    ["chatId", "chat_id", "channelId", "channel_id", "to", "target"],
    ctx.toolContext?.currentChannelId,
  );
  if (!raw) return;
  if (/^(user|dm|open_id):/i.test(raw)) return;
  if (/^(chat|group|channel):/i.test(raw)) return normalizeFeishuTarget(raw) ?? void 0;
  return raw;
}
function resolveFeishuMessageId(params) {
  return readFirstString(params, ["messageId", "message_id", "replyTo", "reply_to"]);
}
function resolveFeishuMessageReadTarget(ctx) {
  const explicitChatId = resolveFeishuChatId({ params: ctx.params });
  const currentChatId = resolveFeishuChatId({
    params: {},
    toolContext: ctx.toolContext,
  });
  const chatId = explicitChatId ?? currentChatId;
  if (!chatId) return;
  const normalizedChatId = normalizeFeishuTarget(chatId) ?? chatId.trim();
  if (
    normalizedChatId !==
    (currentChatId ? (normalizeFeishuTarget(currentChatId) ?? currentChatId.trim()) : void 0)
  )
    return { chatId: normalizedChatId };
  return {
    chatId: normalizedChatId,
    chatType:
      ctx.toolContext?.currentChatType === "direct"
        ? "p2p"
        : ctx.toolContext?.currentChatType === "group" ||
            ctx.toolContext?.currentChatType === "channel"
          ? "group"
          : void 0,
  };
}
function assertFeishuMessageMatchesReadTarget(params) {
  if (
    (normalizeFeishuTarget(params.messageChatId) ?? params.messageChatId.trim()) !==
    params.authorizedChatId
  )
    throw new ToolAuthorizationError("Feishu message target is not allowed.");
}
async function authorizeFeishuMessageReadTarget(params) {
  const authorize = (chatType) =>
    assertFeishuChatReadAllowed({
      cfg: params.ctx.cfg,
      account: params.account,
      chatId: params.target.chatId,
      chatType,
      ctx: params.ctx,
    });
  if (params.target.chatType) return authorize(params.target.chatType);
  const preliminary = resolveFeishuChatReadPreliminaryAuthorization({
    cfg: params.ctx.cfg,
    account: params.account,
    chatId: params.target.chatId,
    ctx: params.ctx,
  });
  if (preliminary.decision === "allow") return preliminary.chatId;
  if (preliminary.decision === "deny")
    throw new ToolAuthorizationError("Feishu read target is not allowed.");
  await getAuthorizedFeishuChatInfo({
    ctx: params.ctx,
    account: params.account,
    runtime: params.runtime,
    chatId: params.target.chatId,
  });
  return preliminary.chatId;
}
async function getAuthorizedFeishuChatInfo(params) {
  const preliminary = resolveFeishuChatReadPreliminaryAuthorization({
    cfg: params.ctx.cfg,
    account: params.account,
    chatId: params.chatId,
    ctx: params.ctx,
  });
  if (preliminary.decision === "deny")
    throw new ToolAuthorizationError("Feishu read target is not allowed.");
  const client = await createFeishuActionClient(params.account);
  let chat;
  try {
    chat = await params.runtime.getChatInfo(client, preliminary.chatId);
  } catch (error) {
    if (preliminary.decision === "needs-metadata")
      assertFeishuChatReadAllowed({
        cfg: params.ctx.cfg,
        account: params.account,
        chatId: preliminary.chatId,
        ctx: params.ctx,
      });
    throw error;
  }
  assertFeishuChatReadAllowed({
    cfg: params.ctx.cfg,
    account: params.account,
    chatId: preliminary.chatId,
    chatType: resolveFeishuChatType(chat),
    ctx: params.ctx,
  });
  return {
    chat,
    client,
  };
}
async function getAuthorizedFeishuMessage(params) {
  const target = resolveFeishuMessageReadTarget(params.ctx);
  if (!target && params.ctx.conversationReadOrigin !== "direct-operator")
    throw new ToolAuthorizationError(
      "Feishu message reads require a chat target or current conversation.",
    );
  const authorizedChatId = target
    ? await authorizeFeishuMessageReadTarget({
        ctx: params.ctx,
        account: params.account,
        runtime: params.runtime,
        target,
      })
    : void 0;
  const message = await params.runtime.getMessageFeishu({
    cfg: params.ctx.cfg,
    messageId: params.messageId,
    accountId: params.ctx.accountId ?? void 0,
  });
  if (!message) return null;
  if (authorizedChatId)
    assertFeishuMessageMatchesReadTarget({
      authorizedChatId,
      messageChatId: message.chatId,
    });
  assertFeishuChatReadAllowed({
    cfg: params.ctx.cfg,
    account: params.account,
    chatId: message.chatId,
    chatType: await resolveFeishuMessageChatType({
      account: params.account,
      message,
      runtime: params.runtime,
    }),
    ctx: params.ctx,
  });
  return message;
}
async function requireAuthorizedFeishuMessage(params) {
  const message = await getAuthorizedFeishuMessage(params);
  if (!message) throw new Error(`Feishu message not found: ${params.messageId}`);
  return message;
}
function resolveFeishuMemberId(params) {
  return readFirstString(params, [
    "memberId",
    "member_id",
    "userId",
    "user_id",
    "openId",
    "open_id",
    "unionId",
    "union_id",
  ]);
}
function resolveFeishuMemberIdType(params) {
  return resolveRequestedFeishuMemberIdType(params) ?? "open_id";
}
function resolveRequestedFeishuMemberIdType(params) {
  const raw = readFirstString(params, [
    "memberIdType",
    "member_id_type",
    "userIdType",
    "user_id_type",
  ]);
  if (raw === "open_id" || raw === "user_id" || raw === "union_id") return raw;
  if (
    readFirstString(params, ["userId", "user_id"]) &&
    !readFirstString(params, ["openId", "open_id", "unionId", "union_id"])
  )
    return "user_id";
  if (
    readFirstString(params, ["unionId", "union_id"]) &&
    !readFirstString(params, ["openId", "open_id"])
  )
    return "union_id";
  if (readFirstString(params, ["openId", "open_id"])) return "open_id";
}
const feishuPlugin = createChatChannelPlugin({
  base: {
    id: "feishu",
    meta: { ...meta },
    capabilities: {
      chatTypes: ["direct", "channel"],
      polls: false,
      threads: true,
      media: true,
      tts: {
        voice: {
          synthesisTarget: "voice-note",
          transcodesAudio: true,
        },
      },
      reactions: true,
      edit: true,
      reply: true,
    },
    agentPrompt: {
      messageToolHints: () => [
        "- Feishu targeting: omit `target` to reply to the current conversation (auto-inferred). Explicit targets: `user:open_id` or `chat:chat_id`.",
        "- Feishu supports interactive cards plus native image, file, audio, and video/media delivery.",
        "- Feishu supports `send`, `read`, `edit`, `thread-reply`, pins, and channel/member lookup, plus reactions when enabled.",
      ],
    },
    groups: { resolveToolPolicy: resolveFeishuGroupToolPolicy },
    conversationBindings: {
      defaultTopLevelPlacement: "current",
      buildModelOverrideParentCandidates: ({ parentConversationId }) =>
        buildFeishuModelOverrideParentCandidates(parentConversationId),
    },
    mentions: { stripPatterns: () => ['<at user_id="[^"]*">[^<]*</at>'] },
    reload: { configPrefixes: ["channels.feishu"] },
    doctor: feishuDoctor,
    configSchema: FeishuChannelConfigSchema,
    config: {
      ...feishuConfigAdapter,
      setAccountEnabled: ({ cfg, accountId, enabled }) => {
        if (accountId === "default")
          return {
            ...cfg,
            channels: {
              ...cfg.channels,
              feishu: {
                ...cfg.channels?.feishu,
                enabled,
              },
            },
          };
        return setFeishuNamedAccountEnabled(cfg, accountId, enabled);
      },
      deleteAccount: ({ cfg, accountId }) => {
        if (accountId === "default") {
          const next = { ...cfg };
          const nextChannels = { ...cfg.channels };
          delete nextChannels.feishu;
          if (Object.keys(nextChannels).length > 0) next.channels = nextChannels;
          else delete next.channels;
          return next;
        }
        const feishuCfg = cfg.channels?.feishu;
        const accounts = { ...feishuCfg?.accounts };
        delete accounts[accountId];
        return {
          ...cfg,
          channels: {
            ...cfg.channels,
            feishu: {
              ...feishuCfg,
              accounts: Object.keys(accounts).length > 0 ? accounts : void 0,
            },
          },
        };
      },
      isConfigured: (account) => account.configured,
      describeAccount: (account) =>
        describeAccountSnapshot({
          account,
          configured: account.configured,
          extra: {
            appId: account.appId,
            domain: account.domain,
          },
        }),
    },
    approvalCapability: feishuApprovalAuth,
    secrets: {
      secretTargetRegistryEntries,
      collectRuntimeConfigAssignments,
    },
    actions: {
      messageActionTargetAliases,
      describeMessageTool: describeFeishuMessageTool,
      handleAction: async (ctx) => {
        const account = resolveFeishuAccount({
          cfg: ctx.cfg,
          accountId: ctx.accountId ?? void 0,
        });
        if (
          (ctx.action === "react" || ctx.action === "reactions") &&
          !isFeishuReactionsActionEnabled({
            cfg: ctx.cfg,
            account,
          })
        )
          throw new Error("Feishu reactions are disabled via actions.reactions.");
        if (ctx.action === "send" || ctx.action === "thread-reply") {
          const to = resolveFeishuActionTarget(ctx);
          if (!to) throw new Error(`Feishu ${ctx.action} requires a target (to).`);
          const { replyToMessageId, replyInThread } = buildFeishuSendReplyAnchor(ctx);
          if (ctx.action === "thread-reply" && !replyToMessageId)
            throw new Error("Feishu thread-reply requires messageId.");
          const text = readFirstString(ctx.params, ["text", "message"]);
          const textCard = readNativeFeishuCardJson(text, {
            responsePrefix: resolveFeishuMessageActionResponsePrefix(ctx),
          });
          const interactive = normalizeInteractiveReply(ctx.params.interactive);
          const presentation =
            normalizeMessagePresentation(ctx.params.presentation) ??
            (interactive ? interactiveReplyToPresentation(interactive) : void 0);
          const mediaUrl = readFeishuMediaParam(ctx.params);
          const audioAsVoice = readBooleanParam(ctx.params, ["asVoice", "audioAsVoice"]);
          if (textCard && !presentation)
            assertFeishuCardWithinEnvelope(textCard, "Feishu native card");
          const generatedCard = presentation
            ? buildFeishuPresentationCard({
                presentation,
                fallbackText: textCard
                  ? void 0
                  : resolveInteractiveTextFallback({
                      text,
                      interactive,
                    }),
              })
            : void 0;
          const presentationCard =
            generatedCard && isFeishuCardWithinEnvelope(generatedCard) ? generatedCard : void 0;
          const presentationFellBack = Boolean(generatedCard && !presentationCard);
          const card = presentation ? presentationCard : textCard;
          if (card && mediaUrl)
            throw new Error(`Feishu ${ctx.action} does not support card with media.`);
          if (!card && !text && !mediaUrl && !presentationFellBack)
            throw new Error(`Feishu ${ctx.action} requires text/message, media, or card.`);
          const runtime = await loadFeishuChannelRuntime();
          const maybeSendMedia = runtime.feishuOutbound.sendMedia;
          if (mediaUrl && !maybeSendMedia)
            throw new Error("Feishu media sending is not available.");
          const sendMedia = maybeSendMedia;
          let result;
          if (presentationFellBack && presentation) {
            const sendPayload = runtime.feishuOutbound.sendPayload;
            if (!sendPayload)
              throw new Error("Feishu presentation fallback delivery is not available.");
            const fallbackText = textCard ? void 0 : text;
            result = await sendPayload({
              cfg: ctx.cfg,
              to,
              text: fallbackText ?? "",
              payload: {
                text: fallbackText,
                presentation,
                ...(mediaUrl ? { mediaUrl } : {}),
                ...(audioAsVoice === void 0 ? {} : { audioAsVoice }),
              },
              accountId: ctx.accountId ?? void 0,
              mediaLocalRoots: ctx.mediaLocalRoots,
              ...(replyInThread ? { threadId: replyToMessageId } : { replyToId: replyToMessageId }),
              ...(audioAsVoice === void 0 ? {} : { audioAsVoice }),
            });
          } else if (card) {
            if (containsLegacyFeishuCardCommandValue(card))
              throw new Error(
                "Feishu card buttons that trigger text or commands must use structured interaction envelopes.",
              );
            result = await runtime.sendCardFeishu({
              cfg: ctx.cfg,
              to,
              card,
              accountId: ctx.accountId ?? void 0,
              replyToMessageId,
              replyInThread,
            });
          } else if (mediaUrl)
            result = await sendMedia({
              cfg: ctx.cfg,
              to,
              text: text ?? "",
              mediaUrl,
              accountId: ctx.accountId ?? void 0,
              mediaLocalRoots: ctx.mediaLocalRoots,
              ...(replyInThread ? { threadId: replyToMessageId } : { replyToId: replyToMessageId }),
              ...(audioAsVoice === true ? { audioAsVoice: true } : {}),
            });
          else
            result = await runtime.sendMessageFeishu({
              cfg: ctx.cfg,
              to,
              text,
              accountId: ctx.accountId ?? void 0,
              replyToMessageId,
              replyInThread,
            });
          return jsonActionResult({
            ok: true,
            channel: "feishu",
            action: ctx.action,
            ...result,
          });
        }
        if (ctx.action === "read") {
          const messageId = resolveFeishuMessageId(ctx.params);
          if (!messageId) throw new Error("Feishu read requires messageId.");
          const message = await getAuthorizedFeishuMessage({
            ctx,
            account,
            runtime: await loadFeishuChannelRuntime(),
            messageId,
          });
          if (!message)
            return {
              isError: true,
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    error: `Feishu read failed or message not found: ${messageId}`,
                  }),
                },
              ],
              details: { error: `Feishu read failed or message not found: ${messageId}` },
            };
          return jsonActionResult({
            ok: true,
            channel: "feishu",
            action: "read",
            message,
          });
        }
        if (ctx.action === "edit") {
          const messageId = resolveFeishuMessageId(ctx.params);
          if (!messageId) throw new Error("Feishu edit requires messageId.");
          const text = readFirstString(ctx.params, ["text", "message"]);
          const card =
            ctx.params.card && typeof ctx.params.card === "object" ? ctx.params.card : void 0;
          const runtime = await loadFeishuChannelRuntime();
          await requireAuthorizedFeishuMessage({
            ctx,
            account,
            runtime,
            messageId,
          });
          return jsonActionResult({
            ok: true,
            channel: "feishu",
            action: "edit",
            ...(await runtime.editMessageFeishu({
              cfg: ctx.cfg,
              messageId,
              text,
              card,
              accountId: ctx.accountId ?? void 0,
            })),
          });
        }
        if (ctx.action === "pin") {
          const messageId = resolveFeishuMessageId(ctx.params);
          if (!messageId) throw new Error("Feishu pin requires messageId.");
          const runtime = await loadFeishuChannelRuntime();
          await requireAuthorizedFeishuMessage({
            ctx,
            account,
            runtime,
            messageId,
          });
          return jsonActionResult({
            ok: true,
            channel: "feishu",
            action: "pin",
            pin: await runtime.createPinFeishu({
              cfg: ctx.cfg,
              messageId,
              accountId: ctx.accountId ?? void 0,
            }),
          });
        }
        if (ctx.action === "unpin") {
          const messageId = resolveFeishuMessageId(ctx.params);
          if (!messageId) throw new Error("Feishu unpin requires messageId.");
          const runtime = await loadFeishuChannelRuntime();
          await requireAuthorizedFeishuMessage({
            ctx,
            account,
            runtime,
            messageId,
          });
          await runtime.removePinFeishu({
            cfg: ctx.cfg,
            messageId,
            accountId: ctx.accountId ?? void 0,
          });
          return jsonActionResult({
            ok: true,
            channel: "feishu",
            action: "unpin",
            messageId,
          });
        }
        if (ctx.action === "list-pins") {
          const chatId = resolveFeishuChatId(ctx);
          if (!chatId) throw new Error("Feishu list-pins requires chatId or channelId.");
          const runtime = await loadFeishuChannelRuntime();
          await getAuthorizedFeishuChatInfo({
            ctx,
            account,
            runtime,
            chatId,
          });
          const { listPinsFeishu } = runtime;
          return jsonActionResult({
            ok: true,
            channel: "feishu",
            action: "list-pins",
            ...(await listPinsFeishu({
              cfg: ctx.cfg,
              chatId,
              startTime: readFirstString(ctx.params, ["startTime", "start_time"]),
              endTime: readFirstString(ctx.params, ["endTime", "end_time"]),
              pageSize: readOptionalPositiveInteger(ctx.params, ["pageSize", "page_size"]),
              pageToken: readFirstString(ctx.params, ["pageToken", "page_token"]),
              accountId: ctx.accountId ?? void 0,
            })),
          });
        }
        if (ctx.action === "channel-info") {
          const chatId = resolveFeishuChatId(ctx);
          if (!chatId) throw new Error("Feishu channel-info requires chatId or channelId.");
          const runtime = await loadFeishuChannelRuntime();
          const { chat: channel, client } = await getAuthorizedFeishuChatInfo({
            ctx,
            account,
            runtime,
            chatId,
          });
          const chatType = resolveFeishuChatType(channel);
          if (!(ctx.params.includeMembers === true || ctx.params.members === true))
            return jsonActionResult({
              ok: true,
              provider: "feishu",
              action: "channel-info",
              channel,
            });
          const requestedMemberIdType = resolveRequestedFeishuMemberIdType(ctx.params);
          const authorization = authorizeFeishuChatMemberRead({
            cfg: ctx.cfg,
            account,
            chatId,
            chatType,
            ctx,
            memberIdType: requestedMemberIdType,
          });
          return jsonActionResult({
            ok: true,
            provider: "feishu",
            action: "channel-info",
            channel,
            members:
              authorization.kind === "direct"
                ? runtime.buildFeishuDirectChatMembers(authorization)
                : await runtime.getChatMembers(
                    client,
                    chatId,
                    readOptionalPositiveInteger(ctx.params, ["pageSize", "page_size"]),
                    readFirstString(ctx.params, ["pageToken", "page_token"]),
                    resolveFeishuMemberIdType(ctx.params),
                  ),
          });
        }
        if (ctx.action === "member-info") {
          const runtime = await loadFeishuChannelRuntime();
          const memberId = resolveFeishuMemberId(ctx.params);
          if (memberId) {
            const chatId = resolveFeishuChatId(ctx);
            if (!chatId)
              throw new Error(
                "Feishu member-info requires chatId or channelId when memberId is provided.",
              );
            const { chat, client } = await getAuthorizedFeishuChatInfo({
              ctx,
              account,
              runtime,
              chatId,
            });
            const requestedMemberIdType = resolveRequestedFeishuMemberIdType(ctx.params);
            const memberIdType = resolveFeishuMemberIdType(ctx.params);
            const authorization = authorizeFeishuChatMemberRead({
              cfg: ctx.cfg,
              account,
              chatId,
              chatType: resolveFeishuChatType(chat),
              ctx,
              memberId,
              memberIdType: requestedMemberIdType,
            });
            if (authorization.kind === "group") {
              await runtime.assertFeishuChatMember(client, chatId, memberId, memberIdType);
              return jsonActionResult({
                ok: true,
                channel: "feishu",
                action: "member-info",
                member: await runtime.getFeishuMemberInfo(client, memberId, memberIdType),
              });
            }
            return jsonActionResult({
              ok: true,
              channel: "feishu",
              action: "member-info",
              member: await runtime.getFeishuMemberInfo(
                client,
                authorization.memberId,
                authorization.memberIdType,
              ),
            });
          }
          const chatId = resolveFeishuChatId(ctx);
          if (!chatId) throw new Error("Feishu member-info requires memberId or chatId/channelId.");
          const { chat, client } = await getAuthorizedFeishuChatInfo({
            ctx,
            account,
            runtime,
            chatId,
          });
          const requestedMemberIdType = resolveRequestedFeishuMemberIdType(ctx.params);
          const authorization = authorizeFeishuChatMemberRead({
            cfg: ctx.cfg,
            account,
            chatId,
            chatType: resolveFeishuChatType(chat),
            ctx,
            memberIdType: requestedMemberIdType,
          });
          return jsonActionResult({
            ok: true,
            channel: "feishu",
            action: "member-info",
            ...(authorization.kind === "direct"
              ? runtime.buildFeishuDirectChatMembers(authorization)
              : await runtime.getChatMembers(
                  client,
                  chatId,
                  readOptionalPositiveInteger(ctx.params, ["pageSize", "page_size"]),
                  readFirstString(ctx.params, ["pageToken", "page_token"]),
                  resolveFeishuMemberIdType(ctx.params),
                )),
          });
        }
        if (ctx.action === "channel-list") {
          const runtime = await loadFeishuChannelRuntime();
          const query = readFirstString(ctx.params, ["query"]);
          const limit = readOptionalPositiveInteger(ctx.params, ["limit"]);
          const scope = readFirstString(ctx.params, ["scope", "kind"]) ?? "all";
          const directOperator = ctx.conversationReadOrigin === "direct-operator";
          const listGroups =
            directOperator || canEnumerateAllFeishuGroups(ctx.cfg, account)
              ? runtime.listFeishuDirectoryGroupsLive
              : listAuthorizedFeishuDirectoryGroups;
          const listPeers =
            directOperator || canEnumerateAllFeishuPeers(account)
              ? runtime.listFeishuDirectoryPeersLive
              : listAuthorizedFeishuDirectoryPeers;
          const directoryParams = {
            cfg: ctx.cfg,
            query,
            limit,
            accountId: ctx.accountId ?? void 0,
            fallbackToStatic: false,
          };
          const groupDirectoryParams = {
            ...directoryParams,
            filter: directOperator
              ? (group) => isFeishuGroupReadEnabled(ctx.cfg, account, group.id)
              : canEnumerateAllFeishuGroups(ctx.cfg, account)
                ? (group) => isFeishuGroupReadAllowed(ctx.cfg, account, group.id, false)
                : void 0,
          };
          if (
            scope === "groups" ||
            scope === "group" ||
            scope === "channels" ||
            scope === "channel"
          )
            return jsonActionResult({
              ok: true,
              channel: "feishu",
              action: "channel-list",
              groups: await listGroups(groupDirectoryParams),
            });
          if (
            scope === "peers" ||
            scope === "peer" ||
            scope === "members" ||
            scope === "member" ||
            scope === "users" ||
            scope === "user"
          )
            return jsonActionResult({
              ok: true,
              channel: "feishu",
              action: "channel-list",
              peers: await listPeers(directoryParams),
            });
          const [groups, peers] = await Promise.all([
            listGroups(groupDirectoryParams),
            listPeers(directoryParams),
          ]);
          return jsonActionResult({
            ok: true,
            channel: "feishu",
            action: "channel-list",
            groups,
            peers,
          });
        }
        if (ctx.action === "react") {
          const messageId = resolveFeishuMessageId(ctx.params);
          if (!messageId) throw new Error("Feishu reaction requires messageId.");
          const emoji = typeof ctx.params.emoji === "string" ? ctx.params.emoji.trim() : "";
          const remove = ctx.params.remove === true;
          const clearAll = ctx.params.clearAll === true;
          if (remove) {
            if (!emoji) throw new Error("Emoji is required to remove a Feishu reaction.");
            const runtime = await loadFeishuChannelRuntime();
            await requireAuthorizedFeishuMessage({
              ctx,
              account,
              runtime,
              messageId,
            });
            const ownReaction = (
              await runtime.listReactionsFeishu({
                cfg: ctx.cfg,
                messageId,
                emojiType: emoji,
                accountId: ctx.accountId ?? void 0,
              })
            ).find(
              (entry) =>
                entry.operatorType === "app" &&
                Boolean(account.appId) &&
                entry.operatorId === account.appId,
            );
            if (!ownReaction)
              return jsonActionResult({
                ok: true,
                removed: null,
              });
            await runtime.removeReactionFeishu({
              cfg: ctx.cfg,
              messageId,
              reactionId: ownReaction.reactionId,
              accountId: ctx.accountId ?? void 0,
            });
            return jsonActionResult({
              ok: true,
              removed: emoji,
            });
          }
          if (!emoji) {
            if (!clearAll)
              throw new Error(
                "Emoji is required to add a Feishu reaction. Set clearAll=true to remove all bot reactions.",
              );
            const runtime = await loadFeishuChannelRuntime();
            await requireAuthorizedFeishuMessage({
              ctx,
              account,
              runtime,
              messageId,
            });
            const reactions = await runtime.listReactionsFeishu({
              cfg: ctx.cfg,
              messageId,
              accountId: ctx.accountId ?? void 0,
            });
            let removed = 0;
            const ownReactions = reactions.filter(
              (entry) =>
                entry.operatorType === "app" &&
                Boolean(account.appId) &&
                entry.operatorId === account.appId,
            );
            for (const reaction of ownReactions) {
              await runtime.removeReactionFeishu({
                cfg: ctx.cfg,
                messageId,
                reactionId: reaction.reactionId,
                accountId: ctx.accountId ?? void 0,
              });
              removed += 1;
            }
            return jsonActionResult({
              ok: true,
              removed,
            });
          }
          const runtime = await loadFeishuChannelRuntime();
          await requireAuthorizedFeishuMessage({
            ctx,
            account,
            runtime,
            messageId,
          });
          await runtime.addReactionFeishu({
            cfg: ctx.cfg,
            messageId,
            emojiType: emoji,
            accountId: ctx.accountId ?? void 0,
          });
          return jsonActionResult({
            ok: true,
            added: emoji,
          });
        }
        if (ctx.action === "reactions") {
          const messageId = resolveFeishuMessageId(ctx.params);
          if (!messageId) throw new Error("Feishu reactions lookup requires messageId.");
          const runtime = await loadFeishuChannelRuntime();
          await requireAuthorizedFeishuMessage({
            ctx,
            account,
            runtime,
            messageId,
          });
          return jsonActionResult({
            ok: true,
            reactions: await runtime.listReactionsFeishu({
              cfg: ctx.cfg,
              messageId,
              accountId: ctx.accountId ?? void 0,
            }),
          });
        }
        throw new Error(`Unsupported Feishu action: "${ctx.action}"`);
      },
    },
    bindings: {
      compileConfiguredBinding: ({ conversationId }) =>
        normalizeFeishuAcpConversationId(conversationId),
      matchInboundConversation: ({ compiledBinding, conversationId, parentConversationId }) =>
        matchFeishuAcpConversation({
          bindingConversationId: compiledBinding.conversationId,
          conversationId,
          parentConversationId,
        }),
      resolveCommandConversation: ({
        accountId,
        threadId,
        senderId,
        sessionKey,
        parentSessionKey,
        originatingTo,
        commandTo,
        fallbackTo,
      }) =>
        resolveFeishuCommandConversation({
          accountId,
          threadId,
          senderId,
          sessionKey,
          parentSessionKey,
          originatingTo,
          commandTo,
          fallbackTo,
        }),
    },
    auth: {
      login: async ({ cfg }) => {
        const { createClackPrompter } = await import("./plugin-sdk/setup-runtime.js");
        const { replaceConfigFile } = await import("./plugin-sdk/config-mutation.js");
        const nextCfg = await runFeishuLogin({
          cfg,
          prompter: createClackPrompter(),
        });
        if (nextCfg !== cfg)
          await replaceConfigFile({
            nextConfig: nextCfg,
            afterWrite: { mode: "auto" },
          });
      },
    },
    setup: feishuSetupAdapter,
    setupWizard: feishuSetupWizard,
    messaging: {
      targetPrefixes: ["feishu", "lark"],
      normalizeTarget: (raw) => normalizeFeishuTarget(raw) ?? void 0,
      resolveDeliveryTarget: ({ conversationId, parentConversationId }) => {
        const directId = parseFeishuDirectConversationId(conversationId);
        if (directId) return { to: `user:${directId}` };
        const parsed = parseFeishuConversationId({
          conversationId,
          parentConversationId,
        });
        if (parsed?.topicId)
          return {
            to: `chat:${parentConversationId?.trim() || parsed.chatId}`,
            threadId: parsed.topicId,
          };
        return { to: `chat:${parsed?.chatId ?? conversationId.trim()}` };
      },
      resolveSessionConversation: resolveFeishuSessionConversation,
      resolveOutboundSessionRoute: (params) => resolveFeishuOutboundSessionRoute(params),
      targetResolver: {
        looksLikeId: looksLikeFeishuId,
        hint: "<chatId|user:openId|chat:chatId>",
      },
    },
    directory: createChannelDirectoryAdapter({
      listPeers: async ({ cfg, query, limit, accountId }) =>
        listFeishuDirectoryPeers({
          cfg,
          query: query ?? void 0,
          limit: limit ?? void 0,
          accountId: accountId ?? void 0,
        }),
      listGroups: async ({ cfg, query, limit, accountId }) =>
        listFeishuDirectoryGroups({
          cfg,
          query: query ?? void 0,
          limit: limit ?? void 0,
          accountId: accountId ?? void 0,
        }),
      ...createRuntimeDirectoryLiveAdapter({
        getRuntime: loadFeishuChannelRuntime,
        listPeersLive:
          (runtime) =>
          async ({ cfg, query, limit, accountId }) =>
            await runtime.listFeishuDirectoryPeersLive({
              cfg,
              query: query ?? void 0,
              limit: limit ?? void 0,
              accountId: accountId ?? void 0,
            }),
        listGroupsLive:
          (runtime) =>
          async ({ cfg, query, limit, accountId }) =>
            await runtime.listFeishuDirectoryGroupsLive({
              cfg,
              query: query ?? void 0,
              limit: limit ?? void 0,
              accountId: accountId ?? void 0,
            }),
      }),
    }),
    status: createComputedAccountStatusAdapter({
      defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID, { port: null }),
      buildChannelSummary: ({ snapshot }) =>
        buildProbeChannelStatusSummary(snapshot, { port: snapshot.port ?? null }),
      probeAccount: async ({ account }) =>
        await (await loadFeishuChannelRuntime()).probeFeishu(account),
      resolveAccountSnapshot: ({ account, runtime }) => ({
        accountId: account.accountId,
        enabled: account.enabled,
        configured: account.configured,
        name: account.name,
        extra: {
          appId: account.appId,
          domain: account.domain,
          port: runtime?.port ?? null,
        },
      }),
    }),
    gateway: {
      startAccount: async (ctx) => {
        const { monitorFeishuProvider } = await import("./monitor-DWpjUrtp.js");
        const account = resolveFeishuRuntimeAccount(
          {
            cfg: ctx.cfg,
            accountId: ctx.accountId,
          },
          { requireEventSecrets: true },
        );
        const port = account.config?.webhookPort ?? null;
        ctx.setStatus({
          accountId: ctx.accountId,
          port,
        });
        ctx.log?.info(
          `starting feishu[${ctx.accountId}] (mode: ${account.config?.connectionMode ?? "websocket"})`,
        );
        const statusSink = createAccountStatusSink({
          accountId: ctx.accountId,
          setStatus: ctx.setStatus,
        });
        return monitorFeishuProvider({
          config: ctx.cfg,
          runtime: ctx.runtime,
          channelRuntime: ctx.channelRuntime,
          abortSignal: ctx.abortSignal,
          accountId: ctx.accountId,
          statusSink,
        });
      },
    },
    message: feishuMessageAdapter,
  },
  security: {
    collectWarnings: projectConfigAccountIdWarningCollector(collectFeishuSecurityWarnings),
    collectAuditFindings: ({ cfg }) => collectFeishuSecurityAuditFindings({ cfg }),
  },
  pairing: {
    text: {
      idLabel: "feishuUserId",
      message: PAIRING_APPROVED_MESSAGE,
      normalizeAllowEntry: createPairingPrefixStripper(/^(feishu|user|open_id):/i),
      notify: async ({ cfg, id, message, accountId }) => {
        const { sendMessageFeishu } = await loadFeishuChannelRuntime();
        await sendMessageFeishu({
          cfg,
          to: id,
          text: message,
          accountId,
        });
      },
    },
  },
  threading: {
    buildToolContext: ({ context, hasRepliedRef }) => ({
      currentChannelId:
        normalizeOptionalString(context.NativeChannelId) ?? normalizeOptionalString(context.To),
      currentChatType:
        context.ChatType === "direct" ||
        context.ChatType === "group" ||
        context.ChatType === "channel"
          ? context.ChatType
          : void 0,
      currentMessagingTarget: normalizeOptionalString(context.To),
      currentThreadTs: context.MessageThreadId != null ? String(context.MessageThreadId) : void 0,
      hasRepliedRef,
    }),
  },
  outbound: {
    deliveryMode: "direct",
    chunker: chunkTextForOutbound,
    chunkerMode: "markdown",
    textChunkLimit: 4e3,
    sanitizeText: ({ text }) => sanitizeAssistantVisibleText(text),
    presentationCapabilities: {
      supported: true,
      buttons: true,
      selects: false,
      context: true,
      divider: true,
      limits: {
        actions: {
          maxActions: 20,
          maxActionsPerRow: 5,
          maxLabelLength: 40,
          maxValueBytes: 1024,
        },
        text: {
          maxLength: 4e3,
          encoding: "characters",
          markdownDialect: "markdown",
        },
      },
    },
    renderPresentation: async (ctx) => {
      const renderPresentation = (await loadFeishuChannelRuntime()).feishuOutbound
        .renderPresentation;
      return renderPresentation ? await renderPresentation(ctx) : null;
    },
    sendPayload: async (ctx) => {
      const sendPayload = (await loadFeishuChannelRuntime()).feishuOutbound.sendPayload;
      if (!sendPayload) throw new Error("Feishu payload sending is not available.");
      return await sendPayload(ctx);
    },
    ...createRuntimeOutboundDelegates({
      getRuntime: loadFeishuChannelRuntime,
      sendText: { resolve: (runtime) => runtime.feishuOutbound.sendText },
      sendMedia: { resolve: (runtime) => runtime.feishuOutbound.sendMedia },
    }),
  },
});
//#endregion
export {
  setFeishuNamedAccountEnabled$1 as a,
  feishuSetupAdapter as i,
  feishuSetupWizard as n,
  runFeishuLogin as r,
  feishuPlugin as t,
};
