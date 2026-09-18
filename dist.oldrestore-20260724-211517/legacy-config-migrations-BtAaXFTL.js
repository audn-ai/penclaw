import {
  a as resolveGatewayPortWithDefault,
  i as isGatewayNonLoopbackBindMode,
  r as hasConfiguredControlUiAllowedOrigins,
  t as buildDefaultControlUiAllowedOrigins,
} from "./gateway-control-ui-origins-DhHC-kfa.js";
import {
  a as ensureRecord$1,
  c as mergeMissing,
  i as defineLegacyConfigMigration,
  o as getRecord,
  s as mapLegacyAudioTranscription,
  t as LEGACY_CONFIG_MIGRATIONS_RUNTIME_MODELS,
} from "./legacy-config-migrations.runtime.models-B1-lVeJ7.js";
import {
  n as ensureRecord$2,
  r as hasOwnKey$1,
  t as cloneRecord$1,
} from "./legacy-config-record-shared-COKcbmOX.js";
import {
  i as resolveOpenClawMcpTransportAlias,
  n as isKnownCliMcpTypeAlias,
} from "./mcp-config-normalize-Cgi6vawf.js";
import { r as normalizeStaticProviderModelId } from "./model-ref-shared-Bs7ONe2Q.js";
import { n as DEFAULT_GATEWAY_PORT } from "./paths-DEklnbzU.js";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import {
  n as normalizeToolProviderPolicyKey,
  t as isCanonicalToolProviderPolicyKey,
} from "./provider-tool-policy-KyAGXjuf.js";
import { n as loadBundledPluginPublicArtifactModuleSync } from "./public-surface-loader-X-jDa4d1.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { r as isKnownCoreToolId } from "./tool-catalog-fgOwzAUV.js";
import {
  c as mergeAlsoAllowPolicy,
  f as expandToolGroups,
  h as resolveToolProfilePolicy,
} from "./tool-policy-1QHiwXPv.js";
import { n as isToolAllowedByPolicyName } from "./tool-policy-match-Bq6mIgOa.js";
//#region src/channels/plugins/doctor-contract-api.ts
/**
 * Loads a bundled channel's public doctor contract.
 */
function loadBundledChannelDoctorContractApi(channelId) {
  try {
    return loadBundledPluginPublicArtifactModuleSync({
      dirName: channelId,
      artifactBasename: "doctor-contract-api.js",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith("Unable to resolve bundled plugin public surface ")
    )
      return;
    throw error;
  }
}
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.audio.ts
function applyLegacyAudioTranscriptionModel(params) {
  const mapped = mapLegacyAudioTranscription(params.source);
  if (!mapped) {
    params.changes.push(params.invalidMessage);
    return;
  }
  const mediaAudio = ensureRecord$1(
    ensureRecord$1(ensureRecord$1(params.raw, "tools"), "media"),
    "audio",
  );
  if ((Array.isArray(mediaAudio.models) ? mediaAudio.models : []).length === 0) {
    mediaAudio.enabled = true;
    mediaAudio.models = [mapped];
    params.changes.push(params.movedMessage);
    return;
  }
  params.changes.push(params.alreadySetMessage);
}
/** Legacy config migration specs for audio/tool media config. */
const LEGACY_CONFIG_MIGRATIONS_AUDIO = [
  defineLegacyConfigMigration({
    id: "audio.transcription-v2",
    describe: "Move audio.transcription to tools.media.audio.models",
    apply: (raw, changes) => {
      const audio = getRecord(raw.audio);
      if (audio?.transcription === void 0) return;
      applyLegacyAudioTranscriptionModel({
        raw,
        source: audio.transcription,
        changes,
        movedMessage: "Moved audio.transcription → tools.media.audio.models.",
        alreadySetMessage: "Removed audio.transcription (tools.media.audio.models already set).",
        invalidMessage: "Removed audio.transcription (invalid or empty command).",
      });
      delete audio.transcription;
      if (Object.keys(audio).length === 0) delete raw.audio;
      else raw.audio = audio;
    },
  }),
];
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.channels.ts
function hasOwnKey(target, key) {
  return Object.hasOwn(target, key);
}
function cleanupEmptyRecord(parent, key) {
  const value = getRecord(parent[key]);
  if (value && Object.keys(value).length === 0) delete parent[key];
}
function resolveCompatibleDefaultGroupEntry(section) {
  const existingGroups = section.groups;
  if (existingGroups !== void 0 && !getRecord(existingGroups)) return null;
  const groups = getRecord(existingGroups) ?? {};
  const existingEntry = groups["*"];
  if (existingEntry !== void 0 && !getRecord(existingEntry)) return null;
  return {
    groups,
    entry: getRecord(existingEntry) ?? {},
  };
}
function migrateChannelDefaultRequireMention(params) {
  const defaultGroupEntry = resolveCompatibleDefaultGroupEntry(params.section);
  if (!defaultGroupEntry) {
    params.changes.push(
      `Removed ${params.legacyPath} (channels.${params.channelId}.groups has an incompatible shape; fix remaining issues manually).`,
    );
    return false;
  }
  const { groups, entry } = defaultGroupEntry;
  if (entry.requireMention === void 0) {
    entry.requireMention = params.requireMention;
    groups["*"] = entry;
    params.section.groups = groups;
    params.changes.push(
      `Moved ${params.legacyPath} → channels.${params.channelId}.groups."*".requireMention.`,
    );
    return true;
  }
  params.changes.push(
    `Removed ${params.legacyPath} (channels.${params.channelId}.groups."*" already set).`,
  );
  return false;
}
function migrateRoutingAllowFrom(raw, changes) {
  const routing = getRecord(raw.routing);
  if (!routing || routing.allowFrom === void 0) return;
  const channels = getRecord(raw.channels);
  const whatsapp = getRecord(channels?.whatsapp);
  if (!channels || !whatsapp) {
    delete routing.allowFrom;
    cleanupEmptyRecord(raw, "routing");
    changes.push("Removed routing.allowFrom (channels.whatsapp not configured).");
    return;
  }
  if (whatsapp.allowFrom === void 0) {
    whatsapp.allowFrom = routing.allowFrom;
    changes.push("Moved routing.allowFrom → channels.whatsapp.allowFrom.");
  } else changes.push("Removed routing.allowFrom (channels.whatsapp.allowFrom already set).");
  delete routing.allowFrom;
  channels.whatsapp = whatsapp;
  raw.channels = channels;
  cleanupEmptyRecord(raw, "routing");
}
function migrateRoutingGroupChatMessages(params) {
  const migrateMessageGroupField = (field) => {
    const value = params.groupChat[field];
    if (value === void 0) return;
    const messagesGroup = ensureRecord$1(ensureRecord$1(params.raw, "messages"), "groupChat");
    if (messagesGroup[field] === void 0) {
      messagesGroup[field] = value;
      params.changes.push(`Moved routing.groupChat.${field} → messages.groupChat.${field}.`);
    } else
      params.changes.push(
        `Removed routing.groupChat.${field} (messages.groupChat.${field} already set).`,
      );
    delete params.groupChat[field];
  };
  migrateMessageGroupField("historyLimit");
  migrateMessageGroupField("mentionPatterns");
  if (Object.keys(params.groupChat).length === 0) delete params.routing.groupChat;
  else params.routing.groupChat = params.groupChat;
}
function migrateRoutingGroupChatRequireMention(params) {
  const requireMention = params.groupChat.requireMention;
  if (requireMention === void 0) return;
  const channels = getRecord(params.raw.channels);
  let matchedChannel = false;
  if (channels) {
    for (const channelId of ["whatsapp", "telegram", "imessage"]) {
      const section = getRecord(channels[channelId]);
      if (!section) continue;
      matchedChannel = true;
      migrateChannelDefaultRequireMention({
        section,
        channelId,
        legacyPath: "routing.groupChat.requireMention",
        requireMention,
        changes: params.changes,
      });
      channels[channelId] = section;
    }
    params.raw.channels = channels;
  }
  if (!matchedChannel)
    params.changes.push(
      "Removed routing.groupChat.requireMention (no configured WhatsApp, Telegram, or iMessage channel found).",
    );
  delete params.groupChat.requireMention;
}
function migrateRoutingGroupChat(raw, changes) {
  const routing = getRecord(raw.routing);
  const groupChat = getRecord(routing?.groupChat);
  if (!routing || !groupChat) return;
  migrateRoutingGroupChatRequireMention({
    raw,
    groupChat,
    changes,
  });
  migrateRoutingGroupChatMessages({
    raw,
    routing,
    groupChat,
    changes,
  });
  cleanupEmptyRecord(raw, "routing");
}
function migrateTelegramRequireMention(raw, changes) {
  const channels = getRecord(raw.channels);
  const telegram = getRecord(channels?.telegram);
  if (!channels || !telegram || telegram.requireMention === void 0) return;
  migrateChannelDefaultRequireMention({
    section: telegram,
    channelId: "telegram",
    legacyPath: "channels.telegram.requireMention",
    requireMention: telegram.requireMention,
    changes,
  });
  delete telegram.requireMention;
  channels.telegram = telegram;
  raw.channels = channels;
}
function hasLegacyFeishuAccountBotName(value) {
  const accounts = getRecord(value);
  if (!accounts) return false;
  return Object.values(accounts).some((entry) => {
    const account = getRecord(entry);
    return Boolean(account && hasOwnKey(account, "botName"));
  });
}
function migrateFeishuAccountBotName(raw, changes) {
  const channels = getRecord(raw.channels);
  const feishu = getRecord(channels?.feishu);
  const accounts = getRecord(feishu?.accounts);
  if (!channels || !feishu || !accounts) return;
  for (const [accountId, accountRaw] of Object.entries(accounts)) {
    const account = getRecord(accountRaw);
    if (!account || !hasOwnKey(account, "botName")) continue;
    const legacyPath = `channels.feishu.accounts.${accountId}.botName`;
    const currentPath = `channels.feishu.accounts.${accountId}.name`;
    if (account.name === void 0) {
      account.name = account.botName;
      changes.push(`Moved ${legacyPath} → ${currentPath}.`);
    } else changes.push(`Removed ${legacyPath} (${currentPath} already set).`);
    delete account.botName;
    accounts[accountId] = account;
  }
  feishu.accounts = accounts;
  channels.feishu = feishu;
  raw.channels = channels;
}
function hasLegacyThreadBindingTtl(value) {
  const threadBindings = getRecord(value);
  return Boolean(threadBindings && hasOwnKey(threadBindings, "ttlHours"));
}
function hasLegacyThreadBindingSpawnSplit(value) {
  const threadBindings = getRecord(value);
  return Boolean(
    threadBindings &&
    (hasOwnKey(threadBindings, "spawnSubagentSessions") ||
      hasOwnKey(threadBindings, "spawnAcpSessions")),
  );
}
function hasLegacyThreadBindingTtlInAccounts(value) {
  const accounts = getRecord(value);
  if (!accounts) return false;
  return Object.values(accounts).some((entry) =>
    hasLegacyThreadBindingTtl(getRecord(entry)?.threadBindings),
  );
}
function hasLegacyThreadBindingSpawnSplitInAccounts(value) {
  const accounts = getRecord(value);
  if (!accounts) return false;
  return Object.values(accounts).some((entry) =>
    hasLegacyThreadBindingSpawnSplit(getRecord(entry)?.threadBindings),
  );
}
function migrateThreadBindingsTtlHoursForPath(params) {
  const threadBindings = getRecord(params.owner.threadBindings);
  if (!threadBindings || !hasOwnKey(threadBindings, "ttlHours")) return false;
  const hadIdleHours = threadBindings.idleHours !== void 0;
  if (!hadIdleHours) threadBindings.idleHours = threadBindings.ttlHours;
  delete threadBindings.ttlHours;
  params.owner.threadBindings = threadBindings;
  if (hadIdleHours)
    params.changes.push(
      `Removed ${params.pathPrefix}.threadBindings.ttlHours (${params.pathPrefix}.threadBindings.idleHours already set).`,
    );
  else
    params.changes.push(
      `Moved ${params.pathPrefix}.threadBindings.ttlHours → ${params.pathPrefix}.threadBindings.idleHours.`,
    );
  return true;
}
function resolveMigratedSpawnSessions(threadBindings) {
  const subagent = threadBindings.spawnSubagentSessions;
  const acp = threadBindings.spawnAcpSessions;
  const subagentBool = typeof subagent === "boolean" ? subagent : void 0;
  const acpBool = typeof acp === "boolean" ? acp : void 0;
  if (subagentBool === void 0) return acpBool;
  if (acpBool === void 0) return subagentBool;
  return subagentBool && acpBool;
}
function migrateThreadBindingsSpawnSessionsForPath(params) {
  const threadBindings = getRecord(params.owner.threadBindings);
  if (!threadBindings || !hasLegacyThreadBindingSpawnSplit(threadBindings)) return false;
  const hadSpawnSessions = threadBindings.spawnSessions !== void 0;
  const resolved = resolveMigratedSpawnSessions(threadBindings);
  const oldSubagent = threadBindings.spawnSubagentSessions;
  const oldAcp = threadBindings.spawnAcpSessions;
  delete threadBindings.spawnSubagentSessions;
  delete threadBindings.spawnAcpSessions;
  if (!hadSpawnSessions && resolved !== void 0) threadBindings.spawnSessions = resolved;
  params.owner.threadBindings = threadBindings;
  if (hadSpawnSessions)
    params.changes.push(
      `Removed deprecated ${params.pathPrefix}.threadBindings.spawnSubagentSessions/spawnAcpSessions (${params.pathPrefix}.threadBindings.spawnSessions already set).`,
    );
  else if (
    typeof oldSubagent === "boolean" &&
    typeof oldAcp === "boolean" &&
    oldSubagent !== oldAcp
  )
    params.changes.push(
      `Collapsed conflicting ${params.pathPrefix}.threadBindings.spawnSubagentSessions/spawnAcpSessions → ${params.pathPrefix}.threadBindings.spawnSessions (${String(resolved)}).`,
    );
  else
    params.changes.push(
      `Moved ${params.pathPrefix}.threadBindings.spawnSubagentSessions/spawnAcpSessions → ${params.pathPrefix}.threadBindings.spawnSessions (${String(resolved)}).`,
    );
  return true;
}
function hasLegacyThreadBindingTtlInAnyChannel(value) {
  const channels = getRecord(value);
  if (!channels) return false;
  return Object.values(channels).some((entry) => {
    const channel = getRecord(entry);
    if (!channel) return false;
    return (
      hasLegacyThreadBindingTtl(channel.threadBindings) ||
      hasLegacyThreadBindingTtlInAccounts(channel.accounts)
    );
  });
}
function hasLegacyThreadBindingSpawnSplitInAnyChannel(value) {
  const channels = getRecord(value);
  if (!channels) return false;
  return Object.values(channels).some((entry) => {
    const channel = getRecord(entry);
    if (!channel) return false;
    return (
      hasLegacyThreadBindingSpawnSplit(channel.threadBindings) ||
      hasLegacyThreadBindingSpawnSplitInAccounts(channel.accounts)
    );
  });
}
const THREAD_BINDING_RULES = [
  {
    path: ["session", "threadBindings"],
    message:
      'session.threadBindings.ttlHours was renamed to session.threadBindings.idleHours. Run "openclaw doctor --fix".',
    match: (value) => hasLegacyThreadBindingTtl(value),
  },
  {
    path: ["channels"],
    message:
      'channels.<id>.threadBindings.ttlHours was renamed to channels.<id>.threadBindings.idleHours. Run "openclaw doctor --fix".',
    match: (value) => hasLegacyThreadBindingTtlInAnyChannel(value),
  },
  {
    path: ["session", "threadBindings"],
    message:
      'session.threadBindings.spawnSubagentSessions/spawnAcpSessions were replaced by session.threadBindings.spawnSessions. Run "openclaw doctor --fix".',
    match: (value) => hasLegacyThreadBindingSpawnSplit(value),
  },
  {
    path: ["channels"],
    message:
      'channels.<id>.threadBindings.spawnSubagentSessions/spawnAcpSessions were replaced by channels.<id>.threadBindings.spawnSessions. Run "openclaw doctor --fix".',
    match: (value) => hasLegacyThreadBindingSpawnSplitInAnyChannel(value),
  },
];
const GROUP_ROUTING_RULES = [
  {
    path: ["routing", "allowFrom"],
    message:
      'routing.allowFrom was removed; use channels.whatsapp.allowFrom instead. Run "openclaw doctor --fix".',
  },
  {
    path: ["routing", "groupChat", "requireMention"],
    message:
      'routing.groupChat.requireMention was removed; use channels.<channel>.groups."*".requireMention instead. Run "openclaw doctor --fix".',
  },
  {
    path: ["routing", "groupChat", "historyLimit"],
    message:
      'routing.groupChat.historyLimit was moved; use messages.groupChat.historyLimit instead. Run "openclaw doctor --fix".',
  },
  {
    path: ["routing", "groupChat", "mentionPatterns"],
    message:
      'routing.groupChat.mentionPatterns was moved; use messages.groupChat.mentionPatterns instead. Run "openclaw doctor --fix".',
  },
  {
    path: ["channels", "telegram", "requireMention"],
    message:
      'channels.telegram.requireMention was removed; use channels.telegram.groups."*".requireMention instead. Run "openclaw doctor --fix".',
  },
];
const FEISHU_ACCOUNT_RULES = [
  {
    path: ["channels", "feishu", "accounts"],
    message:
      'channels.feishu.accounts.<id>.botName was renamed to channels.feishu.accounts.<id>.name. Run "openclaw doctor --fix".',
    match: (value) => hasLegacyFeishuAccountBotName(value),
  },
];
const WEBCHAT_CHANNEL_RULES = [
  {
    path: ["channels", "webchat"],
    message: 'channels.webchat is retired. Run "openclaw doctor --fix".',
  },
];
function migrateRetiredWebchatChannelConfig(raw, changes) {
  const channels = getRecord(raw.channels);
  if (!channels || !hasOwnKey(channels, "webchat")) return;
  delete channels.webchat;
  raw.channels = channels;
  cleanupEmptyRecord(raw, "channels");
  changes.push("Removed retired channels.webchat config.");
}
/** Legacy config migration specs for channel-owned compatibility keys. */
const LEGACY_CONFIG_MIGRATIONS_CHANNELS = [
  defineLegacyConfigMigration({
    id: "channels.webchat-remove",
    describe: "Remove retired WebChat channel config",
    legacyRules: WEBCHAT_CHANNEL_RULES,
    apply: (raw, changes) => {
      migrateRetiredWebchatChannelConfig(raw, changes);
    },
  }),
  defineLegacyConfigMigration({
    id: "legacy-group-routing->channel-groups",
    describe:
      "Move legacy routing group chat settings to current channel group and messages config",
    legacyRules: GROUP_ROUTING_RULES,
    apply: (raw, changes) => {
      migrateRoutingAllowFrom(raw, changes);
      migrateRoutingGroupChat(raw, changes);
      migrateTelegramRequireMention(raw, changes);
    },
  }),
  defineLegacyConfigMigration({
    id: "feishu.accounts.botName->name",
    describe: "Move legacy Feishu account botName config to account name",
    legacyRules: FEISHU_ACCOUNT_RULES,
    apply: (raw, changes) => {
      migrateFeishuAccountBotName(raw, changes);
    },
  }),
  defineLegacyConfigMigration({
    id: "thread-bindings.ttlHours->idleHours",
    describe:
      "Move legacy threadBindings.ttlHours keys to threadBindings.idleHours (session + channel configs)",
    legacyRules: THREAD_BINDING_RULES,
    apply: (raw, changes) => {
      const session = getRecord(raw.session);
      if (session) {
        migrateThreadBindingsTtlHoursForPath({
          owner: session,
          pathPrefix: "session",
          changes,
        });
        migrateThreadBindingsSpawnSessionsForPath({
          owner: session,
          pathPrefix: "session",
          changes,
        });
        raw.session = session;
      }
      const channels = getRecord(raw.channels);
      if (!channels) return;
      for (const [channelId, channelRaw] of Object.entries(channels)) {
        const channel = getRecord(channelRaw);
        if (!channel) continue;
        migrateThreadBindingsTtlHoursForPath({
          owner: channel,
          pathPrefix: `channels.${channelId}`,
          changes,
        });
        migrateThreadBindingsSpawnSessionsForPath({
          owner: channel,
          pathPrefix: `channels.${channelId}`,
          changes,
        });
        const accounts = getRecord(channel.accounts);
        if (accounts) {
          for (const [accountId, accountRaw] of Object.entries(accounts)) {
            const account = getRecord(accountRaw);
            if (!account) continue;
            migrateThreadBindingsTtlHoursForPath({
              owner: account,
              pathPrefix: `channels.${channelId}.accounts.${accountId}`,
              changes,
            });
            migrateThreadBindingsSpawnSessionsForPath({
              owner: account,
              pathPrefix: `channels.${channelId}.accounts.${accountId}`,
              changes,
            });
            accounts[accountId] = account;
          }
          channel.accounts = accounts;
        }
        channels[channelId] = channel;
      }
      raw.channels = channels;
    },
  }),
];
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.queue.ts
const RETIRED_QUEUE_MODES = /* @__PURE__ */ new Set(["queue", "steer-backlog", "steer+backlog"]);
function isRetiredQueueMode(value) {
  return typeof value === "string" && RETIRED_QUEUE_MODES.has(value);
}
function hasRetiredQueueModeByChannel(value) {
  const byChannel = getRecord(value);
  return Boolean(byChannel && Object.values(byChannel).some(isRetiredQueueMode));
}
function migrateQueueMode(params) {
  const value = params.owner[params.key];
  if (!isRetiredQueueMode(value)) return false;
  const replacement = value === "queue" ? "steer" : "followup";
  params.owner[params.key] = replacement;
  params.changes.push(
    `Moved deprecated ${params.path} "${value}" → "${replacement}"; use "steer" for default active-run steering.`,
  );
  return true;
}
/** Legacy config migration specs for message queue mode compatibility. */
const LEGACY_CONFIG_MIGRATIONS_QUEUE = [
  defineLegacyConfigMigration({
    id: "messages.queue.retired-steering-modes",
    describe: "Move retired messages.queue modes to followup mode",
    legacyRules: [
      {
        path: ["messages", "queue", "mode"],
        message:
          'messages.queue.mode uses a retired queue mode; use steer, followup, collect, or interrupt. Run "openclaw doctor --fix".',
        match: isRetiredQueueMode,
      },
      {
        path: ["messages", "queue", "byChannel"],
        message:
          'messages.queue.byChannel contains a retired queue mode; use steer, followup, collect, or interrupt. Run "openclaw doctor --fix".',
        match: hasRetiredQueueModeByChannel,
      },
    ],
    apply: (raw, changes) => {
      const queue = getRecord(getRecord(raw.messages)?.queue);
      if (!queue) return;
      migrateQueueMode({
        owner: queue,
        key: "mode",
        path: "messages.queue.mode",
        changes,
      });
      const byChannel = getRecord(queue.byChannel);
      if (byChannel) {
        for (const [channelId, _value] of Object.entries(byChannel))
          migrateQueueMode({
            owner: byChannel,
            key: channelId,
            path: `messages.queue.byChannel.${channelId}`,
            changes,
          });
        queue.byChannel = byChannel;
      }
    },
  }),
];
//#endregion
//#region src/commands/doctor/shared/legacy-runtime-model-providers.ts
const LEGACY_RUNTIME_MODEL_PROVIDER_ALIASES = [
  {
    legacyProvider: "codex",
    provider: "openai",
    runtime: "codex",
    cli: false,
    requiresRuntimePolicy: false,
  },
  {
    legacyProvider: "codex-cli",
    provider: "openai",
    runtime: "codex",
    cli: false,
    requiresRuntimePolicy: true,
  },
  {
    legacyProvider: "claude-cli",
    provider: "anthropic",
    runtime: "claude-cli",
    cli: true,
    requiresRuntimePolicy: true,
  },
  {
    legacyProvider: "google-gemini-cli",
    provider: "google",
    runtime: "google-gemini-cli",
    cli: true,
    requiresRuntimePolicy: true,
  },
];
function normalizeLegacyRuntimeProviderId(provider) {
  const normalized = provider.trim().toLowerCase();
  return normalized === "anthropic-cli" ? "claude-cli" : normalizeProviderId(normalized);
}
const LEGACY_ALIAS_BY_PROVIDER = new Map(
  LEGACY_RUNTIME_MODEL_PROVIDER_ALIASES.map((entry) => [
    normalizeLegacyRuntimeProviderId(entry.legacyProvider),
    entry,
  ]),
);
/** List legacy model-provider aliases that doctor can migrate to provider/runtime policy. */
function listLegacyRuntimeModelProviderAliases() {
  return LEGACY_RUNTIME_MODEL_PROVIDER_ALIASES;
}
/** Return true when a legacy provider alias requires writing explicit runtime policy. */
function legacyRuntimeModelAliasRequiresRuntimePolicy(provider) {
  return (
    LEGACY_ALIAS_BY_PROVIDER.get(normalizeLegacyRuntimeProviderId(provider))
      ?.requiresRuntimePolicy === true
  );
}
function resolveLegacyRuntimeModelProviderAlias(provider) {
  return LEGACY_ALIAS_BY_PROVIDER.get(normalizeLegacyRuntimeProviderId(provider));
}
/** Rewrite a legacy runtime-encoded model ref to canonical provider/model plus runtime intent. */
function migrateLegacyRuntimeModelRef(raw) {
  const trimmed = raw.trim();
  const slash = trimmed.indexOf("/");
  if (slash <= 0 || slash >= trimmed.length - 1) return null;
  const alias = resolveLegacyRuntimeModelProviderAlias(trimmed.slice(0, slash));
  if (!alias) return null;
  const rawModel = trimmed.slice(slash + 1).trim();
  const model = normalizeStaticProviderModelId(alias.provider, rawModel);
  if (!model) return null;
  return {
    ref: `${alias.provider}/${model}`,
    legacyProvider: alias.legacyProvider,
    provider: alias.provider,
    model,
    runtime: alias.runtime,
    cli: alias.cli,
  };
}
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.agents.ts
const AGENT_HEARTBEAT_KEYS = /* @__PURE__ */ new Set([
  "every",
  "activeHours",
  "model",
  "session",
  "includeReasoning",
  "target",
  "directPolicy",
  "to",
  "accountId",
  "prompt",
  "ackMaxChars",
  "suppressToolErrorWarnings",
  "lightContext",
  "isolatedSession",
]);
const CHANNEL_HEARTBEAT_KEYS = /* @__PURE__ */ new Set(["showOk", "showAlerts", "useIndicator"]);
const MEMORY_SEARCH_RULE = {
  path: ["memorySearch"],
  message:
    'top-level memorySearch was moved; use agents.defaults.memorySearch instead. Run "openclaw doctor --fix".',
};
const LEGACY_MEMORY_SEARCH_AUTO_PROVIDER_RULES = [
  {
    path: ["memorySearch", "provider"],
    message:
      'memorySearch.provider = "auto" is legacy; use "openai" explicitly. Run "openclaw doctor --fix".',
    match: isLegacyMemorySearchAutoProvider,
  },
  {
    path: ["agents", "defaults", "memorySearch", "provider"],
    message:
      'agents.defaults.memorySearch.provider = "auto" is legacy; use "openai" explicitly. Run "openclaw doctor --fix".',
    match: isLegacyMemorySearchAutoProvider,
  },
  {
    path: ["agents", "list"],
    message:
      'agents.list[].memorySearch.provider = "auto" is legacy; use "openai" explicitly. Run "openclaw doctor --fix".',
    match: hasAgentListLegacyMemorySearchAutoProvider,
  },
];
const LEGACY_MEMORY_SEARCH_STORE_PATH_RULES = [
  {
    path: ["memorySearch", "store", "path"],
    message:
      'memorySearch.store.path is legacy; memory indexes now live in each agent database. Run "openclaw doctor --fix".',
  },
  {
    path: ["agents", "defaults", "memorySearch", "store", "path"],
    message:
      'agents.defaults.memorySearch.store.path is legacy; memory indexes now live in each agent database. Run "openclaw doctor --fix".',
  },
  {
    path: ["agents", "list"],
    message:
      'agents.list[].memorySearch.store.path is legacy; memory indexes now live in each agent database. Run "openclaw doctor --fix".',
    match: hasAgentListMemorySearchStorePath,
  },
];
const HEARTBEAT_RULE = {
  path: ["heartbeat"],
  message:
    "top-level heartbeat is not a valid config path; use agents.defaults.heartbeat (cadence/target/model settings) or channels.defaults.heartbeat (showOk/showAlerts/useIndicator).",
};
const LEGACY_SANDBOX_SCOPE_RULES = [
  {
    path: ["agents", "defaults", "sandbox"],
    message:
      'agents.defaults.sandbox.perSession is legacy; use agents.defaults.sandbox.scope instead. Run "openclaw doctor --fix".',
    match: (value) => hasLegacySandboxPerSession(value),
  },
  {
    path: ["agents", "list"],
    message:
      'agents.list[].sandbox.perSession is legacy; use agents.list[].sandbox.scope instead. Run "openclaw doctor --fix".',
    match: (value) => hasLegacyAgentListSandboxPerSession(value),
  },
];
const LEGACY_AGENT_RUNTIME_POLICY_RULES = [
  {
    path: ["agents", "defaults", "agentRuntime", "fallback"],
    message:
      'agents.defaults.agentRuntime is ignored; set models.providers.<provider>.agentRuntime or a model-scoped agentRuntime instead. Run "openclaw doctor --fix".',
  },
  {
    path: ["agents", "defaults", "embeddedHarness"],
    message:
      'agents.defaults.embeddedHarness is legacy and ignored; set provider/model runtime policy instead. Run "openclaw doctor --fix".',
    match: (value) => getRecord(value) !== null,
  },
  {
    path: ["agents", "defaults", "agentRuntime"],
    message:
      'agents.defaults.agentRuntime is ignored; set models.providers.<provider>.agentRuntime or a model-scoped agentRuntime instead. Run "openclaw doctor --fix".',
    match: (value) => getRecord(value) !== null,
  },
  {
    path: ["agents", "list"],
    message:
      'agents.list[].agentRuntime is ignored; set provider/model runtime policy instead. Run "openclaw doctor --fix".',
    match: (value) => hasAgentListRuntimePolicy(value),
  },
  {
    path: ["agents", "list"],
    message:
      'agents.list[].embeddedHarness is legacy and ignored; set provider/model runtime policy instead. Run "openclaw doctor --fix".',
    match: (value) => hasLegacyAgentListEmbeddedHarness(value),
  },
];
const DEPRECATED_EMBEDDED_AGENT_KEY_RULES = [
  {
    path: ["agents", "defaults", "embeddedPi"],
    message:
      'agents.defaults.embeddedPi is legacy; use agents.defaults.embeddedAgent instead. Run "openclaw doctor --fix".',
    match: (value) => getRecord(value) !== null,
  },
  {
    path: ["agents", "list"],
    message:
      'agents.list[].embeddedPi is legacy; use agents.list[].embeddedAgent instead. Run "openclaw doctor --fix".',
    match: (value) => hasLegacyAgentListEmbeddedAgentKey(value),
  },
];
const LEGACY_AGENT_LLM_TIMEOUT_RULES = [
  {
    path: ["agents", "defaults", "llm"],
    message:
      'agents.defaults.llm is legacy; use models.providers.<id>.timeoutSeconds for slow model/provider timeouts. Run "openclaw doctor --fix".',
    match: (value) => getRecord(value) !== null,
  },
];
const IGNORED_AGENT_MODEL_TIMEOUT_RULES = [
  {
    path: ["agents", "defaults", "model"],
    message:
      'agents.defaults.model.timeoutMs is ignored; agent model config only selects primary/fallback models. Run "openclaw doctor --fix" to remove it.',
    match: (value) => hasOwnTimeoutMs(value),
  },
  {
    path: ["agents", "defaults", "subagents", "model"],
    message:
      'agents.defaults.subagents.model.timeoutMs is ignored; subagent model config only selects primary/fallback models. Run "openclaw doctor --fix" to remove it.',
    match: (value) => hasOwnTimeoutMs(value),
  },
  {
    path: ["agents", "list"],
    message:
      'agents.list[].model.timeoutMs and agents.list[].subagents.model.timeoutMs are ignored; agent model config only selects primary/fallback models. Run "openclaw doctor --fix" to remove them.',
    match: (value) => hasAgentListModelTimeout(value),
  },
];
const PROFILE_CONFIGURED_TOOL_SECTION_RULES = [
  {
    path: ["tools"],
    message:
      'tools.profile filters explicit configured-section tool grants; run "openclaw doctor --fix" to rewrite the explicit grants into a valid allowlist.',
    match: (value) => toolProfileConfiguredSectionsNeedExplicitRepair(value),
  },
  {
    path: ["agents", "list"],
    message:
      'agents.list[].tools.profile filters explicit configured-section tool grants; run "openclaw doctor --fix" to rewrite the explicit grants into a valid allowlist.',
    match: (value, root) => {
      const globalTools = getRecord(root.tools);
      const inheritedProfile =
        typeof globalTools?.profile === "string" ? globalTools.profile : void 0;
      const inheritedAlsoAllow = readToolPolicyGrantList(globalTools, "alsoAllow");
      return (
        Array.isArray(value) &&
        value.some((agent) => {
          const agentTools = getRecord(getRecord(agent)?.tools);
          return toolProfileConfiguredSectionsNeedExplicitRepair(
            agentTools,
            inheritedProfile,
            inheritedAlsoAllow,
            collectEffectiveConfiguredToolSectionGrants(globalTools, agentTools),
            getRecord(globalTools?.byProvider),
          );
        })
      );
    },
  },
];
const SILENT_REPLY_LEGACY_RULES = [
  {
    path: ["agents", "defaults", "silentReplyRewrite"],
    message:
      'agents.defaults.silentReplyRewrite was removed; exact NO_REPLY is no longer rewritten to visible fallback text. Run "openclaw doctor --fix" to remove it.',
  },
  {
    path: ["agents", "defaults", "silentReply"],
    message:
      'agents.defaults.silentReply.direct was removed; direct chats never receive NO_REPLY prompt guidance. Run "openclaw doctor --fix" to remove it.',
    match: (value) => Object.hasOwn(getRecord(value) ?? {}, "direct"),
  },
  {
    path: ["surfaces"],
    message:
      'surfaces.*.silentReplyRewrite was removed; exact NO_REPLY is no longer rewritten to visible fallback text. Run "openclaw doctor --fix" to remove it.',
    match: (value) => hasSurfaceSilentReplyRewrite(value),
  },
  {
    path: ["surfaces"],
    message:
      'surfaces.*.silentReply.direct was removed; direct chats never receive NO_REPLY prompt guidance. Run "openclaw doctor --fix" to remove it.',
    match: (value) => hasSurfaceSilentReplyDirect(value),
  },
];
const SYSTEM_PROMPT_OVERRIDE_LEGACY_RULES = [
  {
    path: ["agents", "defaults", "systemPromptOverride"],
    message:
      'agents.defaults.systemPromptOverride was removed; OpenClaw owns the generated system prompt. Run "openclaw doctor --fix" to remove it.',
  },
  {
    path: ["agents", "list"],
    message:
      'agents.list[].systemPromptOverride was removed; OpenClaw owns the generated system prompt. Run "openclaw doctor --fix" to remove it.',
    match: (value) => hasAgentListSystemPromptOverride(value),
  },
];
function sandboxScopeFromPerSession(perSession) {
  return perSession ? "session" : "shared";
}
function splitLegacyHeartbeat(legacyHeartbeat) {
  const agentHeartbeat = {};
  const channelHeartbeat = {};
  for (const [key, value] of Object.entries(legacyHeartbeat)) {
    if (isBlockedObjectKey(key)) continue;
    if (CHANNEL_HEARTBEAT_KEYS.has(key)) {
      channelHeartbeat[key] = value;
      continue;
    }
    if (AGENT_HEARTBEAT_KEYS.has(key)) {
      agentHeartbeat[key] = value;
      continue;
    }
    agentHeartbeat[key] = value;
  }
  return {
    agentHeartbeat: Object.keys(agentHeartbeat).length > 0 ? agentHeartbeat : null,
    channelHeartbeat: Object.keys(channelHeartbeat).length > 0 ? channelHeartbeat : null,
  };
}
function mergeLegacyIntoDefaults(params) {
  const root = ensureRecord$1(params.raw, params.rootKey);
  const defaults = ensureRecord$1(root, "defaults");
  const existing = getRecord(defaults[params.fieldKey]);
  if (!existing) {
    defaults[params.fieldKey] = params.legacyValue;
    params.changes.push(params.movedMessage);
  } else {
    const merged = structuredClone(existing);
    mergeMissing(merged, params.legacyValue);
    defaults[params.fieldKey] = merged;
    params.changes.push(params.mergedMessage);
  }
  root.defaults = defaults;
  params.raw[params.rootKey] = root;
}
function hasLegacySandboxPerSession(value) {
  const sandbox = getRecord(value);
  return Boolean(sandbox && Object.hasOwn(sandbox, "perSession"));
}
function hasLegacyAgentListSandboxPerSession(value) {
  if (!Array.isArray(value)) return false;
  return value.some((agent) => hasLegacySandboxPerSession(getRecord(agent)?.sandbox));
}
function hasLegacyAgentListEmbeddedHarness(value) {
  if (!Array.isArray(value)) return false;
  return value.some((agent) => getRecord(getRecord(agent)?.embeddedHarness) !== null);
}
function hasLegacyAgentListEmbeddedAgentKey(value) {
  if (!Array.isArray(value)) return false;
  return value.some((agent) => getRecord(getRecord(agent)?.embeddedPi) !== null);
}
function hasAgentListRuntimePolicy(value) {
  if (!Array.isArray(value)) return false;
  return value.some((agent) => getRecord(getRecord(agent)?.agentRuntime) !== null);
}
function hasAgentListSystemPromptOverride(value) {
  if (!Array.isArray(value)) return false;
  return value.some((agent) => Object.hasOwn(getRecord(agent) ?? {}, "systemPromptOverride"));
}
function hasOwnTimeoutMs(value) {
  const record = getRecord(value);
  return Boolean(record && Object.hasOwn(record, "timeoutMs"));
}
function hasAgentListModelTimeout(value) {
  if (!Array.isArray(value)) return false;
  return value.some((agent) => {
    const agentRecord = getRecord(agent);
    return (
      hasOwnTimeoutMs(agentRecord?.model) ||
      hasOwnTimeoutMs(getRecord(agentRecord?.subagents)?.model)
    );
  });
}
function migrateLegacyEmbeddedAgentKey(container, pathLabel, changes) {
  const legacy = getRecord(container.embeddedPi);
  if (!legacy) return;
  const existing = getRecord(container.embeddedAgent);
  if (!existing) {
    container.embeddedAgent = legacy;
    changes.push(`Moved ${pathLabel}.embeddedPi → ${pathLabel}.embeddedAgent.`);
  } else {
    const merged = structuredClone(existing);
    mergeMissing(merged, legacy);
    container.embeddedAgent = merged;
    changes.push(
      `Merged ${pathLabel}.embeddedPi → ${pathLabel}.embeddedAgent (filled missing fields from legacy; kept explicit embeddedAgent values).`,
    );
  }
  delete container.embeddedPi;
}
function isLegacyMemorySearchAutoProvider(value) {
  return typeof value === "string" && value.trim().toLowerCase() === "auto";
}
function hasAgentListLegacyMemorySearchAutoProvider(value) {
  if (!Array.isArray(value)) return false;
  return value.some((agent) =>
    isLegacyMemorySearchAutoProvider(getRecord(getRecord(agent)?.memorySearch)?.provider),
  );
}
function hasMemorySearchStorePath(value) {
  return typeof getRecord(getRecord(value)?.store)?.path === "string";
}
function hasAgentListMemorySearchStorePath(value) {
  return (
    Array.isArray(value) &&
    value.some((agent) => hasMemorySearchStorePath(getRecord(agent)?.memorySearch))
  );
}
function removeLegacyMemorySearchStorePath(memorySearch, pathLabel, changes) {
  const store = getRecord(memorySearch?.store);
  if (!store || typeof store.path !== "string") return;
  delete store.path;
  changes.push(`Removed ${pathLabel}.store.path; memory indexes now use each agent database.`);
}
function rewriteLegacyMemorySearchAutoProvider(memorySearch, pathLabel, changes) {
  if (!memorySearch || !isLegacyMemorySearchAutoProvider(memorySearch.provider)) return;
  memorySearch.provider = "openai";
  changes.push(`Moved ${pathLabel}.provider from legacy "auto" to "openai".`);
}
function migrateLegacySandboxPerSession(sandbox, pathLabel, changes) {
  if (!Object.hasOwn(sandbox, "perSession")) return;
  const rawPerSession = sandbox.perSession;
  if (typeof rawPerSession !== "boolean") return;
  if (sandbox.scope === void 0) {
    sandbox.scope = sandboxScopeFromPerSession(rawPerSession);
    changes.push(`Moved ${pathLabel}.perSession → ${pathLabel}.scope (${String(sandbox.scope)}).`);
  } else changes.push(`Removed ${pathLabel}.perSession (${pathLabel}.scope already set).`);
  delete sandbox.perSession;
}
function removeLegacyAgentRuntimePolicy(container, pathLabel, changes) {
  if (getRecord(container.embeddedHarness) !== null) {
    delete container.embeddedHarness;
    changes.push(`Removed ${pathLabel}.embeddedHarness; runtime is now provider/model scoped.`);
  }
  if (getRecord(container.agentRuntime) !== null) {
    preserveLegacyWholeAgentRuntimePolicy(container, pathLabel, changes);
    delete container.agentRuntime;
    changes.push(`Removed ${pathLabel}.agentRuntime; runtime is now provider/model scoped.`);
  }
}
function resolveLegacyAgentRuntimeIntent(raw) {
  const record = getRecord(raw);
  if (!record) return;
  const runtime = typeof record.id === "string" ? record.id.trim().toLowerCase() : "";
  if (!runtime || runtime === "auto" || runtime === "openclaw") return;
  const alias = listLegacyRuntimeModelProviderAliases().find(
    (entry) => entry.cli && normalizeProviderId(entry.runtime) === runtime,
  );
  return alias
    ? {
        provider: alias.provider,
        runtime: alias.runtime,
      }
    : void 0;
}
function selectedCanonicalModelRefsForRuntimePolicy(rawModel, provider) {
  const refs = [];
  const addRef = (rawRef) => {
    if (typeof rawRef !== "string") return;
    const trimmed = rawRef.trim();
    const slash = trimmed.indexOf("/");
    if (slash <= 0 || slash >= trimmed.length - 1) return;
    if (normalizeProviderId(trimmed.slice(0, slash)) !== normalizeProviderId(provider)) return;
    refs.push(trimmed);
  };
  if (typeof rawModel === "string") {
    addRef(rawModel);
    return refs;
  }
  const model = getRecord(rawModel);
  if (!model) return refs;
  addRef(model.primary);
  if (Array.isArray(model.fallbacks)) for (const fallback of model.fallbacks) addRef(fallback);
  return refs;
}
function modelEntryWithRuntimePolicy(entry, runtime) {
  const base = getRecord(entry) ? { ...entry } : {};
  const currentRuntime = getRecord(base.agentRuntime);
  const currentRuntimeId =
    typeof currentRuntime?.id === "string" ? currentRuntime.id.trim().toLowerCase() : "";
  if (currentRuntimeId && currentRuntimeId !== "auto")
    return {
      changed: false,
      entry: base,
    };
  base.agentRuntime = {
    ...currentRuntime,
    id: runtime,
  };
  return {
    changed: true,
    entry: base,
  };
}
function preserveLegacyWholeAgentRuntimePolicy(container, pathLabel, changes) {
  const intent = resolveLegacyAgentRuntimeIntent(container.agentRuntime);
  if (!intent) return;
  const selectedRefs = selectedCanonicalModelRefsForRuntimePolicy(container.model, intent.provider);
  if (selectedRefs.length === 0) return;
  const currentModels = getRecord(container.models);
  const nextModels = currentModels ? { ...currentModels } : {};
  let changed = false;
  for (const ref of selectedRefs) {
    const updated = modelEntryWithRuntimePolicy(nextModels[ref], intent.runtime);
    if (!updated.changed) continue;
    nextModels[ref] = updated.entry;
    changed = true;
  }
  if (!changed) return;
  container.models = nextModels;
  changes.push(
    `Moved ${pathLabel}.agentRuntime.id ${intent.runtime} to matching ${intent.provider} model runtime policy.`,
  );
}
function removeIgnoredAgentModelTimeout(model, pathLabel, changes) {
  const modelRecord = getRecord(model);
  if (!modelRecord || !Object.hasOwn(modelRecord, "timeoutMs")) return;
  delete modelRecord.timeoutMs;
  changes.push(`Removed ${pathLabel}.timeoutMs; agent model config only selects models.`);
}
function hasOwnRecordProperty(value, key) {
  const record = getRecord(value);
  return Boolean(record && Object.hasOwn(record, key));
}
function hasSurfaceSilentReplyRewrite(value) {
  const surfaces = getRecord(value);
  if (!surfaces) return false;
  return Object.entries(surfaces).some(
    ([surfaceId, surface]) =>
      !isBlockedObjectKey(surfaceId) && hasOwnRecordProperty(surface, "silentReplyRewrite"),
  );
}
function hasSurfaceSilentReplyDirect(value) {
  const surfaces = getRecord(value);
  if (!surfaces) return false;
  return Object.values(surfaces).some((surface) =>
    Object.hasOwn(getRecord(getRecord(surface)?.silentReply) ?? {}, "direct"),
  );
}
function removeLegacySilentReplyConfig(raw, changes) {
  const defaults = getRecord(getRecord(raw.agents)?.defaults);
  const defaultSilentReply = getRecord(defaults?.silentReply);
  if (defaultSilentReply && Object.hasOwn(defaultSilentReply, "direct")) {
    delete defaultSilentReply.direct;
    changes.push("Removed agents.defaults.silentReply.direct; direct chats never use NO_REPLY.");
  }
  if (defaults && hasOwnRecordProperty(defaults, "silentReplyRewrite")) {
    delete defaults.silentReplyRewrite;
    changes.push("Removed agents.defaults.silentReplyRewrite.");
  }
  const surfaces = getRecord(raw.surfaces);
  if (!surfaces) return;
  for (const [surfaceId, surfaceValue] of Object.entries(surfaces)) {
    if (isBlockedObjectKey(surfaceId)) continue;
    const surface = getRecord(surfaceValue);
    if (!surface) continue;
    const silentReply = getRecord(surface.silentReply);
    if (silentReply && Object.hasOwn(silentReply, "direct")) {
      delete silentReply.direct;
      changes.push(
        `Removed surfaces.${surfaceId}.silentReply.direct; direct chats never use NO_REPLY.`,
      );
    }
    if (hasOwnRecordProperty(surface, "silentReplyRewrite")) {
      delete surface.silentReplyRewrite;
      changes.push(`Removed surfaces.${surfaceId}.silentReplyRewrite.`);
    }
  }
}
function removeLegacySystemPromptOverride(raw, changes) {
  const agents = getRecord(raw.agents);
  const defaults = getRecord(agents?.defaults);
  if (defaults && Object.hasOwn(defaults, "systemPromptOverride")) {
    delete defaults.systemPromptOverride;
    changes.push("Removed agents.defaults.systemPromptOverride.");
  }
  if (!Array.isArray(agents?.list)) return;
  for (const [index, agent] of agents.list.entries()) {
    const agentRecord = getRecord(agent);
    if (!agentRecord || !Object.hasOwn(agentRecord, "systemPromptOverride")) continue;
    delete agentRecord.systemPromptOverride;
    changes.push(`Removed agents.list.${index}.systemPromptOverride.`);
  }
}
const CONFIGURED_TOOL_SECTION_GRANTS = [
  {
    key: "exec",
    grants: ["exec", "process"],
  },
  {
    key: "fs",
    grants: ["read", "write", "edit"],
  },
];
function readToolPolicyGrantList(value, key) {
  return readOwnToolPolicyGrantList(value, key) ?? [];
}
function readOwnToolPolicyGrantList(value, key) {
  const tools = getRecord(value);
  return Array.isArray(tools?.[key])
    ? tools[key].filter((entry) => typeof entry === "string")
    : void 0;
}
function resolveToolProfileForMigration(tools, inheritedProfile) {
  return typeof tools.profile === "string" ? tools.profile : inheritedProfile;
}
function collectProfileConfiguredSectionRepairGrants(params) {
  const tools = getRecord(params.value);
  if (!tools) return [];
  const profile = resolveToolProfileForMigration(tools, params.inheritedProfile);
  if (!profile || profile === "full") return [];
  const ownAllow = readToolPolicyGrantList(tools, "allow");
  if (ownAllow.length === 0) return [];
  const explicitAlsoAllow = readOwnToolPolicyGrantList(tools, "alsoAllow");
  const explicitPolicy = { allow: uniqueStrings([...ownAllow, ...(explicitAlsoAllow ?? [])]) };
  const profilePolicy = mergeAlsoAllowPolicy(
    resolveToolProfilePolicy(profile),
    explicitAlsoAllow ?? params.inheritedAlsoAllow ?? [],
  );
  return uniqueStrings(
    params.configuredGrants.filter(
      (toolName) =>
        isToolAllowedByPolicyName(toolName, explicitPolicy) &&
        (!isToolAllowedByPolicyName(toolName, profilePolicy) ||
          (explicitAlsoAllow
            ? isToolAllowedByPolicyName(toolName, { allow: explicitAlsoAllow })
            : false)),
    ),
  );
}
function toolProfileConfiguredSectionsNeedExplicitRepair(
  value,
  inheritedProfile,
  inheritedAlsoAllow,
  configuredGrantsOverride,
  inheritedByProvider,
) {
  const tools = getRecord(value);
  if (!tools) return false;
  const configuredGrants = configuredGrantsOverride ?? collectConfiguredToolSectionGrants(tools);
  return (
    scopeToolProfileConfiguredSectionsNeedMigration({
      value,
      inheritedProfile,
      inheritedAlsoAllow,
      configuredGrants,
    }) ||
    byProviderToolProfilesNeedConfiguredSectionMigration(
      tools,
      configuredGrants,
      readOwnToolPolicyGrantList(tools, "alsoAllow") ?? inheritedAlsoAllow,
      inheritedByProvider,
    )
  );
}
function collectConfiguredToolSectionGrants(tools) {
  const grants = [];
  for (const section of CONFIGURED_TOOL_SECTION_GRANTS)
    if (getRecord(tools[section.key])) grants.push(...section.grants);
  return uniqueStrings(grants);
}
function collectEffectiveConfiguredToolSectionGrants(inheritedTools, tools) {
  return uniqueStrings([
    ...(typeof tools?.profile !== "string" && inheritedTools
      ? collectConfiguredToolSectionGrants(inheritedTools)
      : []),
    ...(tools ? collectConfiguredToolSectionGrants(tools) : []),
  ]);
}
function toolProfileAllowRequiresFull(params) {
  return collectProfileConfiguredSectionRepairGrants(params).length > 0;
}
function resolveProfileBoundAllowGrants(params) {
  const explicitAlsoAllow = readOwnToolPolicyGrantList(params.tools, "alsoAllow");
  const profileAllow = expandToolGroups(
    mergeAlsoAllowPolicy(
      resolveToolProfilePolicy(params.profile),
      explicitAlsoAllow ?? params.inheritedAlsoAllow ?? [],
    )?.allow,
  );
  const coreAllow = profileAllow.includes("*")
    ? expandToolGroups(params.allow)
    : profileAllow.filter((toolName) =>
        isToolAllowedByPolicyName(toolName, { allow: params.allow }),
      );
  const pluginAllow = expandToolGroups(params.allow).filter((entry) => {
    if (entry === "*" || isKnownCoreToolId(entry)) return false;
    return !profileAllow.some((toolName) =>
      isToolAllowedByPolicyName(toolName, { allow: [entry] }),
    );
  });
  return uniqueStrings([...coreAllow, ...pluginAllow, ...params.configuredGrants]);
}
function scopeToolProfileConfiguredSectionsNeedMigration(params) {
  return toolProfileAllowRequiresFull(params);
}
function byProviderToolProfilesNeedConfiguredSectionMigration(
  tools,
  configuredGrants,
  inheritedAlsoAllow,
  inheritedByProvider,
) {
  const byProvider = getRecord(tools.byProvider);
  if (
    Boolean(
      byProvider &&
      Object.entries(byProvider).some(([providerKey, policy]) => {
        const inheritedProviderPolicy = resolveInheritedProviderPolicy(
          inheritedByProvider,
          providerKey,
        );
        const inheritedProviderProfile =
          typeof inheritedProviderPolicy?.profile === "string"
            ? inheritedProviderPolicy.profile
            : void 0;
        if (!(typeof getRecord(policy)?.profile === "string" || Boolean(inheritedProviderProfile)))
          return false;
        return scopeToolProfileConfiguredSectionsNeedMigration({
          value: policy,
          inheritedProfile: inheritedProviderProfile,
          inheritedAlsoAllow:
            readOwnToolPolicyGrantList(inheritedProviderPolicy, "alsoAllow") ?? inheritedAlsoAllow,
          configuredGrants,
        });
      }),
    )
  )
    return true;
  const localConfiguredGrants = collectConfiguredToolSectionGrants(tools);
  if (localConfiguredGrants.length === 0) return false;
  const handledProviders = new Set(
    Object.keys(byProvider ?? {}).map((providerKey) => normalizeToolProviderPolicyKey(providerKey)),
  );
  return listInheritedProviderPoliciesWithProfiles(inheritedByProvider).some(
    (inheritedProvider) =>
      !handledProviders.has(inheritedProvider.normalizedKey) &&
      scopeToolProfileConfiguredSectionsNeedMigration({
        value: {},
        inheritedProfile: inheritedProvider.profile,
        inheritedAlsoAllow: readOwnToolPolicyGrantList(inheritedProvider.policy, "alsoAllow"),
        configuredGrants: localConfiguredGrants,
      }),
  );
}
function addProfileConfiguredSectionGrants(
  value,
  pathLabel,
  changes,
  inheritedProfile,
  inheritedAlsoAllow,
  configuredGrantsOverride,
) {
  const tools = getRecord(value);
  if (!tools) return;
  const profile = resolveToolProfileForMigration(tools, inheritedProfile);
  if (!profile) return;
  const repairGrants = collectProfileConfiguredSectionRepairGrants({
    value: tools,
    inheritedProfile,
    inheritedAlsoAllow,
    configuredGrants: configuredGrantsOverride ?? collectConfiguredToolSectionGrants(tools),
  });
  const allow = readToolPolicyGrantList(tools, "allow");
  if (repairGrants.length === 0 || allow.length === 0 || profile === "full") return;
  const ownAlsoAllow = readOwnToolPolicyGrantList(tools, "alsoAllow");
  tools.allow = resolveProfileBoundAllowGrants({
    tools,
    profile,
    allow: uniqueStrings([...allow, ...(ownAlsoAllow ?? [])]),
    inheritedAlsoAllow,
    configuredGrants: repairGrants,
  });
  changes.push(
    `Replaced ${pathLabel}.allow entries with profile "${profile}" grants plus explicit configured-section grants.`,
  );
  if (ownAlsoAllow) {
    delete tools.alsoAllow;
    changes.push(`Merged ${pathLabel}.alsoAllow into ${pathLabel}.allow.`);
  }
  tools.profile = "full";
  changes.push(
    `Set ${pathLabel}.profile to "full" so ${pathLabel}.allow controls explicit configured-section grants directly.`,
  );
}
function addByProviderProfileConfiguredSectionGrants(
  value,
  pathLabel,
  changes,
  configuredGrantsOverride,
  inheritedProfile,
  inheritedByProvider,
) {
  const tools = getRecord(value);
  if (!tools) return;
  const configuredGrants = configuredGrantsOverride ?? collectConfiguredToolSectionGrants(tools);
  if (configuredGrants.length === 0) return;
  const byProvider = getRecord(tools.byProvider);
  const handledProviders = /* @__PURE__ */ new Set();
  for (const [providerKey, providerPolicy] of Object.entries(byProvider ?? {})) {
    if (isBlockedObjectKey(providerKey)) continue;
    addHandledProviderPolicyKey(handledProviders, providerKey);
    const inheritedProviderPolicy = resolveInheritedProviderPolicy(
      inheritedByProvider,
      providerKey,
    );
    const ownsProviderProfile = typeof getRecord(providerPolicy)?.profile === "string";
    const inheritedProviderProfile =
      typeof inheritedProviderPolicy?.profile === "string"
        ? inheritedProviderPolicy.profile
        : void 0;
    const providerInheritedProfile = inheritedProviderProfile ?? inheritedProfile;
    const providerInheritedAlsoAllow = readOwnToolPolicyGrantList(
      inheritedProviderPolicy,
      "alsoAllow",
    );
    addProfileConfiguredSectionGrantsWithConfiguredGrants(
      providerPolicy,
      `${pathLabel}.byProvider.${providerKey}`,
      changes,
      configuredGrants,
      providerInheritedProfile,
      providerInheritedAlsoAllow,
      ownsProviderProfile || Boolean(inheritedProviderProfile),
    );
  }
  const localConfiguredGrants = collectConfiguredToolSectionGrants(tools);
  if (localConfiguredGrants.length === 0) return;
  for (const inheritedProvider of listInheritedProviderPoliciesWithProfiles(inheritedByProvider)) {
    if (handledProviders.has(inheritedProvider.normalizedKey)) continue;
    const providerPolicy = {};
    const changeCount = changes.length;
    addProfileConfiguredSectionGrantsWithConfiguredGrants(
      providerPolicy,
      `${pathLabel}.byProvider.${inheritedProvider.key}`,
      changes,
      localConfiguredGrants,
      inheritedProvider.profile,
      readOwnToolPolicyGrantList(inheritedProvider.policy, "alsoAllow"),
    );
    if (changes.length > changeCount) {
      if (!getRecord(tools.byProvider)) tools.byProvider = {};
      getRecord(tools.byProvider)[inheritedProvider.key] = providerPolicy;
      addHandledProviderPolicyKey(handledProviders, inheritedProvider.normalizedKey);
    }
  }
}
function addHandledProviderPolicyKey(handledProviders, providerKey) {
  handledProviders.add(normalizeToolProviderPolicyKey(providerKey));
}
function buildInheritedProviderPolicyLookup(inheritedByProvider) {
  const lookup = /* @__PURE__ */ new Map();
  for (const [key, value] of Object.entries(inheritedByProvider ?? {})) {
    if (isBlockedObjectKey(key)) continue;
    const policy = getRecord(value);
    if (!policy) continue;
    const normalized = normalizeToolProviderPolicyKey(key);
    if (!normalized) continue;
    const canonical = isCanonicalToolProviderPolicyKey(key);
    const existing = lookup.get(normalized);
    if (!existing || (canonical && !existing.canonical))
      lookup.set(normalized, {
        key,
        policy,
        canonical,
      });
  }
  return lookup;
}
function resolveInheritedProviderPolicy(inheritedByProvider, providerKey) {
  const lookup = buildInheritedProviderPolicyLookup(inheritedByProvider);
  const normalized = normalizeToolProviderPolicyKey(providerKey);
  const slashIndex = normalized.indexOf("/");
  const candidates = slashIndex > 0 ? [normalized, normalized.slice(0, slashIndex)] : [normalized];
  for (const candidate of candidates) {
    const match = lookup.get(candidate);
    if (match) return match.policy;
  }
  return null;
}
function listInheritedProviderPoliciesWithProfiles(inheritedByProvider) {
  const entries = [];
  for (const [normalizedKey, match] of buildInheritedProviderPolicyLookup(inheritedByProvider)) {
    if (typeof match.policy.profile !== "string") continue;
    entries.push({
      key: match.key,
      normalizedKey,
      policy: match.policy,
      profile: match.policy.profile,
    });
  }
  return entries;
}
function addProfileConfiguredSectionGrantsWithConfiguredGrants(
  value,
  pathLabel,
  changes,
  configuredGrants,
  inheritedProfile,
  inheritedAlsoAllow,
  materializeProfile = true,
) {
  const tools = getRecord(value);
  if (!tools) return;
  const profile = resolveToolProfileForMigration(tools, inheritedProfile);
  if (!profile) return;
  if (!materializeProfile) return;
  const repairGrants = collectProfileConfiguredSectionRepairGrants({
    value: tools,
    inheritedProfile,
    inheritedAlsoAllow,
    configuredGrants,
  });
  const allow = readToolPolicyGrantList(tools, "allow");
  if (repairGrants.length === 0 || allow.length === 0 || profile === "full") return;
  const ownAlsoAllow = readOwnToolPolicyGrantList(tools, "alsoAllow");
  tools.allow = resolveProfileBoundAllowGrants({
    tools,
    profile,
    allow: uniqueStrings([...allow, ...(ownAlsoAllow ?? [])]),
    inheritedAlsoAllow,
    configuredGrants: repairGrants,
  });
  changes.push(
    `Replaced ${pathLabel}.allow entries with profile "${profile}" grants plus explicit configured-section grants.`,
  );
  if (ownAlsoAllow) {
    delete tools.alsoAllow;
    changes.push(`Merged ${pathLabel}.alsoAllow into ${pathLabel}.allow.`);
  }
  if (materializeProfile) {
    tools.profile = "full";
    changes.push(
      `Set ${pathLabel}.profile to "full" so ${pathLabel}.allow controls explicit configured-section grants directly.`,
    );
  }
}
/** Legacy config migration specs for agent/runtime-owned config keys. */
const LEGACY_CONFIG_MIGRATIONS_RUNTIME_AGENTS = [
  defineLegacyConfigMigration({
    id: "tools.profile-configured-sections-alsoAllow",
    describe: "Repair explicit configured-section tool grants filtered by profiles",
    legacyRules: PROFILE_CONFIGURED_TOOL_SECTION_RULES,
    apply: (raw, changes) => {
      const globalTools = getRecord(raw.tools);
      const inheritedProfile =
        typeof globalTools?.profile === "string" ? globalTools.profile : void 0;
      const inheritedAlsoAllow = readToolPolicyGrantList(globalTools, "alsoAllow");
      addProfileConfiguredSectionGrants(raw.tools, "tools", changes);
      addByProviderProfileConfiguredSectionGrants(
        raw.tools,
        "tools",
        changes,
        void 0,
        inheritedProfile,
      );
      const agents = getRecord(raw.agents);
      if (!Array.isArray(agents?.list)) return;
      for (const [index, agent] of agents.list.entries()) {
        const agentTools = getRecord(getRecord(agent)?.tools);
        const configuredGrants = collectEffectiveConfiguredToolSectionGrants(
          globalTools,
          agentTools,
        );
        addProfileConfiguredSectionGrants(
          agentTools,
          `agents.list.${index}.tools`,
          changes,
          inheritedProfile,
          inheritedAlsoAllow,
          configuredGrants,
        );
        addByProviderProfileConfiguredSectionGrants(
          agentTools,
          `agents.list.${index}.tools`,
          changes,
          configuredGrants,
          resolveToolProfileForMigration(agentTools ?? {}, inheritedProfile),
          getRecord(globalTools?.byProvider),
        );
      }
    },
  }),
  defineLegacyConfigMigration({
    id: "silentReplyRewrite-removed",
    describe: "Remove legacy silent reply rewrite and direct-chat silent reply config",
    legacyRules: SILENT_REPLY_LEGACY_RULES,
    apply: removeLegacySilentReplyConfig,
  }),
  defineLegacyConfigMigration({
    id: "agents.systemPromptOverride-removed",
    describe: "Remove legacy agent system prompt override config",
    legacyRules: SYSTEM_PROMPT_OVERRIDE_LEGACY_RULES,
    apply: removeLegacySystemPromptOverride,
  }),
  defineLegacyConfigMigration({
    id: "agents.defaults.llm->models.providers.timeoutSeconds",
    describe: "Remove legacy agents.defaults.llm timeout config",
    legacyRules: LEGACY_AGENT_LLM_TIMEOUT_RULES,
    apply: (raw, changes) => {
      const defaults = getRecord(getRecord(raw.agents)?.defaults);
      if (!defaults || getRecord(defaults.llm) === null) return;
      delete defaults.llm;
      changes.push(
        "Removed agents.defaults.llm; model idle timeout now follows models.providers.<id>.timeoutSeconds within the agent/run timeout ceiling.",
      );
    },
  }),
  defineLegacyConfigMigration({
    id: "agents.model.timeoutMs-ignored",
    describe: "Remove ignored timeoutMs keys from agent model selection config",
    legacyRules: IGNORED_AGENT_MODEL_TIMEOUT_RULES,
    apply: (raw, changes) => {
      const agents = getRecord(raw.agents);
      const defaults = getRecord(agents?.defaults);
      if (defaults) {
        removeIgnoredAgentModelTimeout(defaults.model, "agents.defaults.model", changes);
        removeIgnoredAgentModelTimeout(
          getRecord(defaults.subagents)?.model,
          "agents.defaults.subagents.model",
          changes,
        );
      }
      if (!Array.isArray(agents?.list)) return;
      for (const [index, agent] of agents.list.entries()) {
        const agentRecord = getRecord(agent);
        if (!agentRecord) continue;
        removeIgnoredAgentModelTimeout(agentRecord.model, `agents.list.${index}.model`, changes);
        removeIgnoredAgentModelTimeout(
          getRecord(agentRecord.subagents)?.model,
          `agents.list.${index}.subagents.model`,
          changes,
        );
      }
    },
  }),
  defineLegacyConfigMigration({
    id: "agents.embeddedPi->embeddedAgent",
    describe: "Move legacy embedded agent config key to embeddedAgent",
    legacyRules: DEPRECATED_EMBEDDED_AGENT_KEY_RULES,
    apply: (raw, changes) => {
      const agents = getRecord(raw.agents);
      const defaults = getRecord(agents?.defaults);
      if (defaults) migrateLegacyEmbeddedAgentKey(defaults, "agents.defaults", changes);
      if (!Array.isArray(agents?.list)) return;
      for (const [index, agent] of agents.list.entries()) {
        const agentRecord = getRecord(agent);
        if (!agentRecord) continue;
        migrateLegacyEmbeddedAgentKey(agentRecord, `agents.list.${index}`, changes);
      }
    },
  }),
  defineLegacyConfigMigration({
    id: "agents.agentRuntime-ignored",
    describe: "Remove ignored agent-wide runtime policy",
    legacyRules: LEGACY_AGENT_RUNTIME_POLICY_RULES,
    apply: (raw, changes) => {
      const agents = getRecord(raw.agents);
      const defaults = getRecord(agents?.defaults);
      if (defaults) removeLegacyAgentRuntimePolicy(defaults, "agents.defaults", changes);
      if (!Array.isArray(agents?.list)) return;
      for (const [index, agent] of agents.list.entries()) {
        const agentRecord = getRecord(agent);
        if (!agentRecord) continue;
        removeLegacyAgentRuntimePolicy(agentRecord, `agents.list.${index}`, changes);
      }
    },
  }),
  defineLegacyConfigMigration({
    id: "agents.sandbox.perSession->scope",
    describe: "Move legacy agent sandbox perSession aliases to sandbox.scope",
    legacyRules: LEGACY_SANDBOX_SCOPE_RULES,
    apply: (raw, changes) => {
      const agents = getRecord(raw.agents);
      const defaultSandbox = getRecord(getRecord(agents?.defaults)?.sandbox);
      if (defaultSandbox)
        migrateLegacySandboxPerSession(defaultSandbox, "agents.defaults.sandbox", changes);
      if (!Array.isArray(agents?.list)) return;
      for (const [index, agent] of agents.list.entries()) {
        const sandbox = getRecord(getRecord(agent)?.sandbox);
        if (!sandbox) continue;
        migrateLegacySandboxPerSession(sandbox, `agents.list.${index}.sandbox`, changes);
      }
    },
  }),
  defineLegacyConfigMigration({
    id: "memorySearch->agents.defaults.memorySearch",
    describe: "Move top-level memorySearch to agents.defaults.memorySearch",
    legacyRules: [MEMORY_SEARCH_RULE],
    apply: (raw, changes) => {
      const legacyMemorySearch = getRecord(raw.memorySearch);
      if (!legacyMemorySearch) return;
      mergeLegacyIntoDefaults({
        raw,
        rootKey: "agents",
        fieldKey: "memorySearch",
        legacyValue: legacyMemorySearch,
        changes,
        movedMessage: "Moved memorySearch → agents.defaults.memorySearch.",
        mergedMessage:
          "Merged memorySearch → agents.defaults.memorySearch (filled missing fields from legacy; kept explicit agents.defaults values).",
      });
      delete raw.memorySearch;
    },
  }),
  defineLegacyConfigMigration({
    id: "memorySearch.provider-auto->openai",
    describe: 'Rewrite legacy memorySearch provider "auto" to "openai"',
    legacyRules: LEGACY_MEMORY_SEARCH_AUTO_PROVIDER_RULES,
    apply: (raw, changes) => {
      const agents = getRecord(raw.agents);
      rewriteLegacyMemorySearchAutoProvider(
        getRecord(getRecord(agents?.defaults)?.memorySearch),
        "agents.defaults.memorySearch",
        changes,
      );
      if (!Array.isArray(agents?.list)) return;
      for (const [index, agent] of agents.list.entries())
        rewriteLegacyMemorySearchAutoProvider(
          getRecord(getRecord(agent)?.memorySearch),
          `agents.list.${index}.memorySearch`,
          changes,
        );
    },
  }),
  defineLegacyConfigMigration({
    id: "memorySearch.store.path->agent-database",
    describe: "Remove legacy memory search sidecar index paths",
    legacyRules: LEGACY_MEMORY_SEARCH_STORE_PATH_RULES,
    apply: (raw, changes) => {
      removeLegacyMemorySearchStorePath(getRecord(raw.memorySearch), "memorySearch", changes);
      const agents = getRecord(raw.agents);
      removeLegacyMemorySearchStorePath(
        getRecord(getRecord(agents?.defaults)?.memorySearch),
        "agents.defaults.memorySearch",
        changes,
      );
      if (!Array.isArray(agents?.list)) return;
      for (const [index, agent] of agents.list.entries())
        removeLegacyMemorySearchStorePath(
          getRecord(getRecord(agent)?.memorySearch),
          `agents.list[${index}].memorySearch`,
          changes,
        );
    },
  }),
  defineLegacyConfigMigration({
    id: "heartbeat->agents.defaults.heartbeat",
    describe: "Move top-level heartbeat to agents.defaults.heartbeat/channels.defaults.heartbeat",
    legacyRules: [HEARTBEAT_RULE],
    apply: (raw, changes) => {
      const legacyHeartbeat = getRecord(raw.heartbeat);
      if (!legacyHeartbeat) return;
      const { agentHeartbeat, channelHeartbeat } = splitLegacyHeartbeat(legacyHeartbeat);
      if (agentHeartbeat)
        mergeLegacyIntoDefaults({
          raw,
          rootKey: "agents",
          fieldKey: "heartbeat",
          legacyValue: agentHeartbeat,
          changes,
          movedMessage: "Moved heartbeat → agents.defaults.heartbeat.",
          mergedMessage:
            "Merged heartbeat → agents.defaults.heartbeat (filled missing fields from legacy; kept explicit agents.defaults values).",
        });
      if (channelHeartbeat)
        mergeLegacyIntoDefaults({
          raw,
          rootKey: "channels",
          fieldKey: "heartbeat",
          legacyValue: channelHeartbeat,
          changes,
          movedMessage: "Moved heartbeat visibility → channels.defaults.heartbeat.",
          mergedMessage:
            "Merged heartbeat visibility → channels.defaults.heartbeat (filled missing fields from legacy; kept explicit channels.defaults values).",
        });
      if (!agentHeartbeat && !channelHeartbeat) changes.push("Removed empty top-level heartbeat.");
      delete raw.heartbeat;
    },
  }),
];
const LEGACY_CONFIG_MIGRATIONS_RUNTIME_CRON = [
  defineLegacyConfigMigration({
    id: "cron.runLog-remove",
    describe: "Remove retired cron run-log retention config",
    legacyRules: [
      {
        path: ["cron", "runLog"],
        message:
          'cron.runLog is retired; run history now has fixed per-job retention. Run "openclaw doctor --fix".',
      },
    ],
    apply: (raw, changes) => {
      const cron = getRecord(raw.cron);
      if (!cron || !Object.hasOwn(cron, "runLog")) return;
      delete cron.runLog;
      if (Object.keys(cron).length > 0) raw.cron = cron;
      else delete raw.cron;
      changes.push("Removed retired cron.runLog config; cron history now keeps 2000 runs per job.");
    },
  }),
];
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.diagnostics.ts
function isLegacyMemoryPressureBundleConfig(value) {
  return typeof value === "boolean" || getRecord(value) !== null;
}
/** Legacy config migration specs for diagnostics runtime config. */
const LEGACY_CONFIG_MIGRATIONS_RUNTIME_DIAGNOSTICS = [
  defineLegacyConfigMigration({
    id: "diagnostics.memoryPressureBundle->memoryPressureSnapshot",
    describe: "Move diagnostics.memoryPressureBundle to diagnostics.memoryPressureSnapshot",
    legacyRules: [
      {
        path: ["diagnostics", "memoryPressureBundle"],
        message:
          'diagnostics.memoryPressureBundle was renamed; use diagnostics.memoryPressureSnapshot instead. Run "openclaw doctor --fix".',
        match: isLegacyMemoryPressureBundleConfig,
        requireSourceLiteral: true,
      },
    ],
    apply: (raw, changes) => {
      const diagnostics = getRecord(raw.diagnostics);
      if (!diagnostics || !isLegacyMemoryPressureBundleConfig(diagnostics.memoryPressureBundle))
        return;
      if (Object.hasOwn(diagnostics, "memoryPressureSnapshot")) {
        delete diagnostics.memoryPressureBundle;
        changes.push(
          "Removed diagnostics.memoryPressureBundle (memoryPressureSnapshot already set).",
        );
        return;
      }
      const legacy = getRecord(diagnostics.memoryPressureBundle);
      diagnostics.memoryPressureSnapshot =
        typeof diagnostics.memoryPressureBundle === "boolean"
          ? diagnostics.memoryPressureBundle
          : legacy?.enabled !== false;
      delete diagnostics.memoryPressureBundle;
      changes.push("Moved diagnostics.memoryPressureBundle → memoryPressureSnapshot.");
    },
  }),
];
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.gateway.ts
const GATEWAY_BIND_RULE = {
  path: ["gateway", "bind"],
  message:
    'gateway.bind host aliases (for example 0.0.0.0/localhost) are legacy; use bind modes (lan/loopback/custom/tailnet/auto) instead. Run "openclaw doctor --fix".',
  match: (value) => isLegacyGatewayBindHostAlias(value),
  requireSourceLiteral: true,
};
const GATEWAY_WEBCHAT_RULE = {
  path: ["gateway", "webchat"],
  message: 'gateway.webchat is retired. Run "openclaw doctor --fix".',
};
function isLegacyGatewayBindHostAlias(value) {
  return normalizeLegacyGatewayBindHostAlias(value) !== null;
}
function normalizeLegacyGatewayBindHostAlias(value) {
  const normalized = normalizeOptionalLowercaseString(value);
  if (!normalized) return null;
  if (
    normalized === "auto" ||
    normalized === "loopback" ||
    normalized === "lan" ||
    normalized === "tailnet" ||
    normalized === "custom"
  )
    return null;
  if (
    normalized === "0.0.0.0" ||
    normalized === "::" ||
    normalized === "[::]" ||
    normalized === "*"
  )
    return "lan";
  if (
    normalized === "127.0.0.1" ||
    normalized === "localhost" ||
    normalized === "::1" ||
    normalized === "[::1]"
  )
    return "loopback";
  return null;
}
function escapeControlForLog(value) {
  return value.replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t");
}
/** Legacy config migration specs for gateway runtime config. */
const LEGACY_CONFIG_MIGRATIONS_RUNTIME_GATEWAY = [
  defineLegacyConfigMigration({
    id: "gateway.webchat-remove",
    describe: "Remove retired WebChat gateway config",
    legacyRules: [GATEWAY_WEBCHAT_RULE],
    apply: (raw, changes) => {
      const gateway = getRecord(raw.gateway);
      if (!gateway || !Object.hasOwn(gateway, "webchat")) return;
      delete gateway.webchat;
      if (Object.keys(gateway).length > 0) raw.gateway = gateway;
      else delete raw.gateway;
      changes.push("Removed retired gateway.webchat config.");
    },
  }),
  defineLegacyConfigMigration({
    id: "gateway.controlUi.allowedOrigins-seed-for-non-loopback",
    describe: "Seed gateway.controlUi.allowedOrigins for existing non-loopback gateway installs",
    apply: (raw, changes) => {
      const gateway = getRecord(raw.gateway);
      if (!gateway) return;
      const bind = normalizeLegacyGatewayBindHostAlias(gateway.bind) ?? gateway.bind;
      if (!isGatewayNonLoopbackBindMode(bind)) return;
      const controlUi = getRecord(gateway.controlUi) ?? {};
      if (
        hasConfiguredControlUiAllowedOrigins({
          allowedOrigins: controlUi.allowedOrigins,
          dangerouslyAllowHostHeaderOriginFallback:
            controlUi.dangerouslyAllowHostHeaderOriginFallback,
        })
      )
        return;
      const origins = buildDefaultControlUiAllowedOrigins({
        port: resolveGatewayPortWithDefault(gateway.port, DEFAULT_GATEWAY_PORT),
        bind,
        customBindHost:
          typeof gateway.customBindHost === "string" ? gateway.customBindHost : void 0,
      });
      gateway.controlUi = {
        ...controlUi,
        allowedOrigins: origins,
      };
      raw.gateway = gateway;
      changes.push(
        `Seeded gateway.controlUi.allowedOrigins ${JSON.stringify(origins)} for bind=${bind}. Required since v2026.2.26. Add other machine origins to gateway.controlUi.allowedOrigins if needed.`,
      );
    },
  }),
  defineLegacyConfigMigration({
    id: "gateway.bind.host-alias->bind-mode",
    describe: "Normalize gateway.bind host aliases to supported bind modes",
    legacyRules: [GATEWAY_BIND_RULE],
    apply: (raw, changes) => {
      const gateway = getRecord(raw.gateway);
      if (!gateway) return;
      const bindRaw = gateway.bind;
      if (typeof bindRaw !== "string") return;
      const normalized = normalizeOptionalLowercaseString(bindRaw);
      if (!normalized) return;
      const mapped = normalizeLegacyGatewayBindHostAlias(bindRaw);
      if (!mapped || normalized === mapped) return;
      gateway.bind = mapped;
      raw.gateway = gateway;
      changes.push(`Normalized gateway.bind "${escapeControlForLog(bindRaw)}" → "${mapped}".`);
    },
  }),
];
/** Legacy config migration specs for MCP server config compatibility. */
const LEGACY_CONFIG_MIGRATIONS_RUNTIME_MCP = [
  defineLegacyConfigMigration({
    id: "mcp.servers.type->transport",
    describe: "Move CLI-native MCP server type aliases to OpenClaw transport",
    legacyRules: [
      {
        path: ["mcp", "servers"],
        message:
          'mcp.servers entries use OpenClaw transport names; CLI-native type aliases are legacy here. Run "openclaw doctor --fix".',
        match: (value) =>
          isRecord(value) &&
          Object.values(value).some(
            (server) => isRecord(server) && isKnownCliMcpTypeAlias(server.type),
          ),
      },
    ],
    apply: (raw, changes) => {
      const mcp = isRecord(raw.mcp) ? raw.mcp : void 0;
      const servers = isRecord(mcp?.servers) ? mcp?.servers : void 0;
      if (!servers) return;
      for (const [serverName, rawServer] of Object.entries(servers)) {
        if (!isRecord(rawServer) || !isKnownCliMcpTypeAlias(rawServer.type)) continue;
        const rawType = typeof rawServer.type === "string" ? rawServer.type : "";
        const alias = resolveOpenClawMcpTransportAlias(rawServer.type);
        if (typeof rawServer.transport !== "string" && alias) {
          rawServer.transport = alias;
          changes.push(`Moved mcp.servers.${serverName}.type "${rawType}" → transport "${alias}".`);
        } else if (typeof rawServer.transport === "string")
          changes.push(
            `Removed mcp.servers.${serverName}.type (transport "${rawServer.transport}" already set).`,
          );
        else changes.push(`Removed mcp.servers.${serverName}.type "${rawType}".`);
        delete rawServer.type;
      }
    },
  }),
];
//#endregion
//#region src/commands/doctor/shared/legacy-x-search-migrate.ts
const XAI_PLUGIN_ID = "xai";
const X_SEARCH_LEGACY_PATH = "tools.web.x_search";
const XAI_WEB_SEARCH_PLUGIN_KEY_PATH = `plugins.entries.${XAI_PLUGIN_ID}.config.webSearch.apiKey`;
const RETIRED_X_SEARCH_MODELS = /* @__PURE__ */ new Set([
  "grok-4-1-fast-non-reasoning",
  "grok-4-fast-non-reasoning",
  "grok-3",
]);
const RETIRED_CODE_MODELS = /* @__PURE__ */ new Set([
  "grok-code-fast-1",
  "grok-code-fast",
  "grok-code-fast-1-0825",
]);
function cloneRecord(value) {
  if (!value) return value;
  return { ...value };
}
function ensureRecord(target, key) {
  const current = target[key];
  if (isRecord(current)) return current;
  const next = {};
  target[key] = next;
  return next;
}
function resolveLegacyXSearchConfig(raw) {
  if (!isRecord(raw)) return;
  const tools = isRecord(raw.tools) ? raw.tools : void 0;
  const web = isRecord(tools?.web) ? tools.web : void 0;
  return isRecord(web?.x_search) ? web.x_search : void 0;
}
function resolveLegacyXSearchAuth(legacy) {
  return legacy.apiKey;
}
function resolveLegacyXSearchModelTarget(modelValue) {
  if (typeof modelValue !== "string") return;
  const model = modelValue.trim().toLowerCase();
  if (RETIRED_X_SEARCH_MODELS.has(model)) return "grok-4.3";
  if (RETIRED_CODE_MODELS.has(model)) return "grok-build-0.1";
}
/** Move legacy X search auth and repair retired legacy model defaults. */
function migrateLegacyXSearchConfig(raw) {
  if (!isRecord(raw))
    return {
      config: raw,
      changes: [],
    };
  const legacy = resolveLegacyXSearchConfig(raw);
  const hasLegacyAuth = legacy ? Object.hasOwn(legacy, "apiKey") : false;
  const modelTarget = legacy ? resolveLegacyXSearchModelTarget(legacy.model) : void 0;
  if (!legacy || (!hasLegacyAuth && !modelTarget))
    return {
      config: raw,
      changes: [],
    };
  const nextRoot = structuredClone(raw);
  const web = ensureRecord(ensureRecord(nextRoot, "tools"), "web");
  const nextLegacy = cloneRecord(legacy) ?? {};
  if (hasLegacyAuth) delete nextLegacy.apiKey;
  const changes = [];
  if (modelTarget) {
    nextLegacy.model = modelTarget;
    changes.push(
      `Updated ${X_SEARCH_LEGACY_PATH}.model from ${JSON.stringify(legacy.model)} to ${JSON.stringify(modelTarget)}.`,
    );
  }
  if (Object.keys(nextLegacy).length === 0) delete web.x_search;
  else web.x_search = nextLegacy;
  const auth = resolveLegacyXSearchAuth(legacy);
  let hadEnabled = true;
  if (hasLegacyAuth) {
    const entry = ensureRecord(
      ensureRecord(ensureRecord(nextRoot, "plugins"), "entries"),
      XAI_PLUGIN_ID,
    );
    hadEnabled = entry.enabled !== void 0;
    if (!hadEnabled) entry.enabled = true;
    const config = ensureRecord(entry, "config");
    const existingWebSearch = isRecord(config.webSearch) ? cloneRecord(config.webSearch) : void 0;
    if (!existingWebSearch) {
      config.webSearch = { apiKey: auth };
      changes.push(`Moved ${X_SEARCH_LEGACY_PATH}.apiKey → ${XAI_WEB_SEARCH_PLUGIN_KEY_PATH}.`);
    } else if (!Object.hasOwn(existingWebSearch, "apiKey")) {
      existingWebSearch.apiKey = auth;
      config.webSearch = existingWebSearch;
      changes.push(
        `Merged ${X_SEARCH_LEGACY_PATH}.apiKey → ${XAI_WEB_SEARCH_PLUGIN_KEY_PATH} (filled missing plugin auth).`,
      );
    } else
      changes.push(
        `Removed ${X_SEARCH_LEGACY_PATH}.apiKey (${XAI_WEB_SEARCH_PLUGIN_KEY_PATH} already set).`,
      );
  }
  if (hasLegacyAuth && Object.keys(nextLegacy).length === 0 && !hadEnabled)
    changes.push(`Removed empty ${X_SEARCH_LEGACY_PATH}.`);
  return {
    config: nextRoot,
    changes,
  };
}
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.providers.ts
const LEGACY_OPENAI_CODEX_PLUGIN_ID = "openai-codex";
const OPENAI_PLUGIN_ID = "openai";
const LEGACY_CODEX_SUPERVISOR_PLUGIN_ID = "codex-supervisor";
const CODEX_PLUGIN_ID = "codex";
function normalizePluginIdForMigration(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : void 0;
}
const BUNDLED_DISCOVERY_COMPAT_RULE = {
  path: ["plugins", "allow"],
  message:
    'plugins.allow now gates bundled provider discovery by default; run "openclaw doctor --fix" to preserve legacy bundled provider compatibility as plugins.bundledDiscovery="compat", or set plugins.bundledDiscovery="allowlist" to keep the stricter behavior.',
  requireSourceLiteral: true,
  match: (value, root) => {
    if (!Array.isArray(value) || value.length === 0) return false;
    return (isRecord(root.plugins) ? root.plugins : void 0)?.bundledDiscovery === void 0;
  },
};
const X_SEARCH_RULE = {
  path: ["tools", "web", "x_search", "apiKey"],
  message:
    'tools.web.x_search.apiKey moved to the xAI plugin; use plugins.entries.xai.config.webSearch.apiKey instead. Run "openclaw doctor --fix".',
};
const X_SEARCH_MODEL_RULE = {
  path: ["tools", "web", "x_search", "model"],
  message:
    'tools.web.x_search.model uses a retired xAI model; run "openclaw doctor --fix" to repair it.',
  requireSourceLiteral: true,
  match: (value) => resolveLegacyXSearchModelTarget(value) !== void 0,
};
function rewritePluginIdList(value, legacyPluginId, replacementPluginId) {
  if (!Array.isArray(value))
    return {
      next: value,
      changed: false,
    };
  let changed = false;
  const seen = /* @__PURE__ */ new Set();
  const next = [];
  for (const entry of value) {
    const matchesLegacy = normalizePluginIdForMigration(entry) === legacyPluginId;
    if (matchesLegacy && replacementPluginId === void 0) {
      changed = true;
      continue;
    }
    const replacement = matchesLegacy ? replacementPluginId : entry;
    if (replacement !== entry) changed = true;
    if (typeof replacement === "string") {
      const normalizedReplacement = normalizePluginIdForMigration(replacement) ?? replacement;
      if (seen.has(normalizedReplacement)) {
        changed = true;
        continue;
      }
      seen.add(normalizedReplacement);
    }
    next.push(replacement);
  }
  return {
    next,
    changed,
  };
}
function rewritePluginSlots(value) {
  if (!isRecord(value)) return false;
  let changed = false;
  for (const [slot, pluginId] of Object.entries(value))
    if (pluginId === LEGACY_OPENAI_CODEX_PLUGIN_ID) {
      value[slot] = OPENAI_PLUGIN_ID;
      changed = true;
    }
  return changed;
}
function rewritePluginEntries(value) {
  if (!isRecord(value) || !(LEGACY_OPENAI_CODEX_PLUGIN_ID in value)) return false;
  if (!(OPENAI_PLUGIN_ID in value)) value[OPENAI_PLUGIN_ID] = value[LEGACY_OPENAI_CODEX_PLUGIN_ID];
  delete value[LEGACY_OPENAI_CODEX_PLUGIN_ID];
  return true;
}
function rewriteLegacyOpenAICodexPluginPolicy(raw) {
  const plugins = isRecord(raw.plugins) ? raw.plugins : void 0;
  if (!plugins) return [];
  const changes = [];
  for (const key of ["allow", "deny"]) {
    const rewritten = rewritePluginIdList(
      plugins[key],
      LEGACY_OPENAI_CODEX_PLUGIN_ID,
      OPENAI_PLUGIN_ID,
    );
    if (rewritten.changed) {
      plugins[key] = rewritten.next;
      changes.push(`Rewrote plugins.${key} openai-codex references to openai.`);
    }
  }
  if (rewritePluginEntries(plugins.entries))
    changes.push("Rewrote plugins.entries.openai-codex to plugins.entries.openai.");
  if (rewritePluginSlots(plugins.slots))
    changes.push("Rewrote plugins.slots openai-codex references to openai.");
  return changes;
}
function migrateLegacyCodexSupervisorEntry(entries, legacySupervisorDenied) {
  const legacyEntryKey = Object.keys(entries).find(
    (key) => normalizePluginIdForMigration(key) === LEGACY_CODEX_SUPERVISOR_PLUGIN_ID,
  );
  if (!legacyEntryKey) return null;
  const rawLegacyEntry = entries[legacyEntryKey];
  if (!isRecord(rawLegacyEntry)) {
    delete entries[legacyEntryKey];
    return "removed-invalid";
  }
  const legacyEntry = rawLegacyEntry;
  const migratedEnabled = legacyEntry.enabled === true && !legacySupervisorDenied;
  const codexEntryKey =
    Object.keys(entries).find((key) => normalizePluginIdForMigration(key) === CODEX_PLUGIN_ID) ??
    CODEX_PLUGIN_ID;
  const rawCodexEntry = entries[codexEntryKey];
  let codexEntry;
  if (isRecord(rawCodexEntry)) codexEntry = rawCodexEntry;
  else {
    codexEntry = {};
    entries[codexEntryKey] = codexEntry;
  }
  if (migratedEnabled && codexEntry.enabled === void 0) codexEntry.enabled = true;
  const codexConfig = isRecord(codexEntry.config) ? codexEntry.config : {};
  codexEntry.config = codexConfig;
  const supervision = isRecord(codexConfig.supervision) ? codexConfig.supervision : {};
  codexConfig.supervision = supervision;
  const legacyConfig = isRecord(legacyEntry.config) ? legacyEntry.config : void 0;
  const migratedSupervision = { enabled: migratedEnabled };
  if (Array.isArray(legacyConfig?.endpoints))
    migratedSupervision.endpoints = legacyConfig.endpoints;
  if (typeof legacyConfig?.allowRawTranscripts === "boolean")
    migratedSupervision.allowRawTranscripts = legacyConfig.allowRawTranscripts;
  if (typeof legacyConfig?.allowWriteControls === "boolean")
    migratedSupervision.allowWriteControls = legacyConfig.allowWriteControls;
  mergeMissing(supervision, migratedSupervision);
  delete entries[legacyEntryKey];
  return "migrated";
}
function migrateLegacyCodexSupervisorPlugin(raw) {
  const plugins = isRecord(raw.plugins) ? raw.plugins : void 0;
  if (!plugins) return [];
  const changes = [];
  const legacySupervisorDenied =
    Array.isArray(plugins.deny) &&
    plugins.deny.some(
      (entry) => normalizePluginIdForMigration(entry) === LEGACY_CODEX_SUPERVISOR_PLUGIN_ID,
    );
  const entries = isRecord(plugins.entries) ? plugins.entries : void 0;
  const entryMigration = entries
    ? migrateLegacyCodexSupervisorEntry(entries, legacySupervisorDenied)
    : null;
  if (entryMigration === "migrated")
    changes.push(
      "Moved plugins.entries.codex-supervisor to plugins.entries.codex.config.supervision.",
    );
  else if (entryMigration === "removed-invalid")
    changes.push("Removed invalid plugins.entries.codex-supervisor config.");
  const rewrittenAllow = rewritePluginIdList(
    plugins.allow,
    LEGACY_CODEX_SUPERVISOR_PLUGIN_ID,
    CODEX_PLUGIN_ID,
  );
  if (rewrittenAllow.changed) {
    plugins.allow = rewrittenAllow.next;
    changes.push("Rewrote plugins.allow codex-supervisor references to codex.");
  }
  const rewrittenDeny = rewritePluginIdList(plugins.deny, LEGACY_CODEX_SUPERVISOR_PLUGIN_ID);
  if (rewrittenDeny.changed) {
    plugins.deny = rewrittenDeny.next;
    changes.push("Removed plugins.deny codex-supervisor references.");
  }
  return changes;
}
/** Legacy config migration specs for provider/plugin runtime config compatibility. */
const LEGACY_CONFIG_MIGRATIONS_RUNTIME_PROVIDERS = [
  defineLegacyConfigMigration({
    id: "plugins.codex-supervisor->plugins.codex.config.supervision",
    describe: "Move retired Codex Supervisor config into the Codex plugin",
    legacyRules: [
      {
        path: ["plugins"],
        message:
          'plugins.entries.codex-supervisor and related plugin policy references are retired; use plugins.entries.codex.config.supervision. Run "openclaw doctor --fix".',
        requireSourceLiteral: true,
        match: (_value, root) =>
          migrateLegacyCodexSupervisorPlugin(structuredClone(root)).length > 0,
      },
    ],
    apply: (raw, changes) => {
      changes.push(...migrateLegacyCodexSupervisorPlugin(raw));
    },
  }),
  defineLegacyConfigMigration({
    id: "plugins.openai-codex->plugins.openai",
    describe: "Rewrite retired OpenAI Codex plugin policy ids",
    legacyRules: [
      {
        path: ["plugins"],
        message:
          'plugins.openai-codex references are retired; use the openai plugin id. Run "openclaw doctor --fix".',
        requireSourceLiteral: true,
        match: (_value, root) =>
          rewriteLegacyOpenAICodexPluginPolicy(structuredClone(root)).length > 0,
      },
    ],
    apply: (raw, changes) => {
      changes.push(...rewriteLegacyOpenAICodexPluginPolicy(raw));
    },
  }),
  defineLegacyConfigMigration({
    id: "plugins.allow->plugins.bundledDiscovery.compat",
    describe: "Preserve bundled provider discovery for existing restrictive allowlists",
    legacyRules: [BUNDLED_DISCOVERY_COMPAT_RULE],
    apply: (raw, changes) => {
      const plugins = isRecord(raw.plugins) ? raw.plugins : void 0;
      if (!plugins || plugins.bundledDiscovery !== void 0) return;
      const allow = plugins.allow;
      if (!Array.isArray(allow) || allow.length === 0) return;
      plugins.bundledDiscovery = "compat";
      changes.push(
        'Set plugins.bundledDiscovery="compat" to preserve legacy bundled provider discovery for this restrictive plugins.allow config.',
      );
    },
  }),
  defineLegacyConfigMigration({
    id: "tools.web.x_search.apiKey->plugins.entries.xai.config.webSearch.apiKey",
    describe: "Move legacy x_search auth and repair retired xAI model defaults",
    legacyRules: [X_SEARCH_RULE, X_SEARCH_MODEL_RULE],
    apply: (raw, changes) => {
      const migrated = migrateLegacyXSearchConfig(raw);
      if (!migrated.changes.length) return;
      for (const key of Object.keys(raw)) delete raw[key];
      Object.assign(raw, migrated.config);
      changes.push(...migrated.changes);
    },
  }),
];
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.session.ts
function hasLegacyRotateBytes(value) {
  const maintenance = getRecord(value);
  return Boolean(maintenance && Object.hasOwn(maintenance, "rotateBytes"));
}
function hasLegacyParentForkMaxTokens(value) {
  const session = getRecord(value);
  return Boolean(session && Object.hasOwn(session, "parentForkMaxTokens"));
}
const LEGACY_SESSION_MAINTENANCE_ROTATE_BYTES_RULE = {
  path: ["session", "maintenance"],
  message:
    'session.maintenance.rotateBytes is deprecated and ignored; run "openclaw doctor --fix" to remove it.',
  match: hasLegacyRotateBytes,
};
const LEGACY_SESSION_PARENT_FORK_MAX_TOKENS_RULE = {
  path: ["session"],
  message:
    'session.parentForkMaxTokens was removed; parent fork sizing is automatic. Run "openclaw doctor --fix" to remove it.',
  match: hasLegacyParentForkMaxTokens,
};
/** Legacy config migration specs for session runtime config compatibility. */
const LEGACY_CONFIG_MIGRATIONS_RUNTIME_SESSION = [
  defineLegacyConfigMigration({
    id: "session.maintenance.rotateBytes",
    describe: "Remove deprecated session.maintenance.rotateBytes",
    legacyRules: [LEGACY_SESSION_MAINTENANCE_ROTATE_BYTES_RULE],
    apply: (raw, changes) => {
      const maintenance = getRecord(getRecord(raw.session)?.maintenance);
      if (!maintenance || !Object.hasOwn(maintenance, "rotateBytes")) return;
      delete maintenance.rotateBytes;
      changes.push("Removed deprecated session.maintenance.rotateBytes.");
    },
  }),
  defineLegacyConfigMigration({
    id: "session.parentForkMaxTokens",
    describe: "Remove legacy session.parentForkMaxTokens",
    legacyRules: [LEGACY_SESSION_PARENT_FORK_MAX_TOKENS_RULE],
    apply: (raw, changes) => {
      const session = getRecord(raw.session);
      if (!session || !Object.hasOwn(session, "parentForkMaxTokens")) return;
      delete session.parentForkMaxTokens;
      changes.push("Removed session.parentForkMaxTokens; parent fork sizing is automatic.");
    },
  }),
];
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.tts.ts
const LEGACY_TTS_PROVIDER_KEYS = ["openai", "elevenlabs", "microsoft", "edge"];
const LEGACY_TTS_PLUGIN_IDS = /* @__PURE__ */ new Set(["voice-call"]);
const CHANNEL_ROOT_TTS_UNSUPPORTED_IDS = /* @__PURE__ */ new Set(["discord"]);
function isLegacyEdgeProviderId(value) {
  return typeof value === "string" && value.trim().toLowerCase() === "edge";
}
function hasLegacyTtsProviderKeys(value) {
  const tts = getRecord(value);
  if (!tts) return false;
  if (isLegacyEdgeProviderId(tts.provider)) return true;
  if (LEGACY_TTS_PROVIDER_KEYS.some((key) => Object.hasOwn(tts, key))) return true;
  const providers = getRecord(tts.providers);
  return Boolean(providers && Object.hasOwn(providers, "edge"));
}
function hasLegacyPluginEntryTtsProviderKeys(value) {
  return hasLegacyTtsInPluginLocations(value, hasLegacyTtsProviderKeys);
}
function hasLegacyTtsEnabled(value) {
  return typeof getRecord(value)?.enabled === "boolean";
}
function hasLegacySpeakerSelectionKeys(value) {
  const config = getRecord(value);
  if (!config) return false;
  return (
    Object.hasOwn(config, "voice") ||
    Object.hasOwn(config, "voiceName") ||
    Object.hasOwn(config, "voiceId")
  );
}
function hasLegacyTtsSpeakerSelection(value) {
  const tts = getRecord(value);
  if (!tts) return false;
  if (hasLegacyTtsSpeakerSelectionInProviderMap(tts.providers)) return true;
  if (LEGACY_TTS_PROVIDER_KEYS.some((providerId) => hasLegacySpeakerSelectionKeys(tts[providerId])))
    return true;
  return hasLegacyTtsSpeakerSelectionInPersonas(tts.personas);
}
function hasLegacyTtsSpeakerSelectionInProviderMap(value) {
  const providers = getRecord(value);
  return Boolean(
    providers &&
    Object.entries(providers).some(
      ([providerId, providerConfig]) =>
        !isBlockedObjectKey(providerId) && hasLegacySpeakerSelectionKeys(providerConfig),
    ),
  );
}
function hasLegacyTtsSpeakerSelectionInPersonas(value) {
  const personas = getRecord(value);
  if (!personas) return false;
  return Object.entries(personas).some(([personaId, personaValue]) => {
    if (isBlockedObjectKey(personaId)) return false;
    const persona = getRecord(personaValue);
    if (!persona) return false;
    if (hasLegacyTtsSpeakerSelectionInProviderMap(persona.providers)) return true;
    return LEGACY_TTS_PROVIDER_KEYS.some((providerId) =>
      hasLegacySpeakerSelectionKeys(persona[providerId]),
    );
  });
}
function hasLegacyTtsInAgentLocations(value, matcher) {
  const agents = getRecord(value);
  return (Array.isArray(agents?.list) ? agents.list : []).some((entry) =>
    matcher(getRecord(getRecord(entry)?.tts)),
  );
}
function supportsChannelRootTtsMigration(channelId) {
  return !CHANNEL_ROOT_TTS_UNSUPPORTED_IDS.has(channelId.trim().toLowerCase());
}
function hasLegacyTtsInChannelLocations(value, matcher) {
  const channels = getRecord(value);
  for (const [channelId, channelValue] of Object.entries(channels ?? {})) {
    if (isBlockedObjectKey(channelId)) continue;
    const channel = getRecord(channelValue);
    const migrateRootTts = supportsChannelRootTtsMigration(channelId);
    if (migrateRootTts && matcher(getRecord(channel?.tts))) return true;
    if (matcher(getRecord(getRecord(channel?.voice)?.tts))) return true;
    const accounts = getRecord(channel?.accounts);
    for (const [accountId, accountValue] of Object.entries(accounts ?? {})) {
      if (isBlockedObjectKey(accountId)) continue;
      const account = getRecord(accountValue);
      if (
        (migrateRootTts && matcher(getRecord(account?.tts))) ||
        matcher(getRecord(getRecord(account?.voice)?.tts))
      )
        return true;
    }
  }
  return false;
}
function hasLegacyTtsInPluginLocations(value, matcher) {
  const entries = getRecord(value);
  if (!entries) return false;
  return Object.entries(entries).some(([pluginId, entryValue]) => {
    if (isBlockedObjectKey(pluginId) || !LEGACY_TTS_PLUGIN_IDS.has(pluginId)) return false;
    return matcher(getRecord(getRecord(getRecord(entryValue)?.config)?.tts));
  });
}
function hasLegacyTtsSpeakerSelectionInAgentLocations(value) {
  return hasLegacyTtsInAgentLocations(value, hasLegacyTtsSpeakerSelection);
}
function hasLegacyTtsSpeakerSelectionInChannelLocations(value) {
  return hasLegacyTtsInChannelLocations(value, hasLegacyTtsSpeakerSelection);
}
function hasLegacyTtsSpeakerSelectionInPluginLocations(value) {
  return hasLegacyTtsInPluginLocations(value, hasLegacyTtsSpeakerSelection);
}
function hasLegacyTtsEnabledInAgentLocations(value) {
  return hasLegacyTtsInAgentLocations(value, hasLegacyTtsEnabled);
}
function hasLegacyTtsEnabledInChannelLocations(value) {
  return hasLegacyTtsInChannelLocations(value, hasLegacyTtsEnabled);
}
function hasLegacyTtsEnabledInPluginLocations(value) {
  return hasLegacyTtsInPluginLocations(value, hasLegacyTtsEnabled);
}
function getOrCreateTtsProviders(tts) {
  const providers = getRecord(tts.providers) ?? {};
  tts.providers = providers;
  return providers;
}
function mergeLegacyTtsProviderConfig(tts, legacyKey, providerId) {
  const legacyValue = getRecord(tts[legacyKey]);
  if (!legacyValue) return false;
  const providers = getOrCreateTtsProviders(tts);
  const existing = getRecord(providers[providerId]) ?? {};
  const merged = structuredClone(existing);
  mergeMissing(merged, legacyValue);
  providers[providerId] = merged;
  delete tts[legacyKey];
  return true;
}
function mergeLegacyTtsProviderAliasConfig(tts, aliasKey, providerId) {
  const providers = getRecord(tts.providers);
  const aliasValue = getRecord(providers?.[aliasKey]);
  if (!providers || !aliasValue) return false;
  const existing = getRecord(providers[providerId]) ?? {};
  const merged = structuredClone(existing);
  mergeMissing(merged, aliasValue);
  providers[providerId] = merged;
  delete providers[aliasKey];
  return true;
}
function migrateLegacyTtsConfig(tts, pathLabel, changes) {
  if (!tts) return;
  if (isLegacyEdgeProviderId(tts.provider)) {
    tts.provider = "microsoft";
    changes.push(`Moved ${pathLabel}.provider "edge" → "microsoft".`);
  }
  const movedOpenAI = mergeLegacyTtsProviderConfig(tts, "openai", "openai");
  const movedElevenLabs = mergeLegacyTtsProviderConfig(tts, "elevenlabs", "elevenlabs");
  const movedMicrosoft = mergeLegacyTtsProviderConfig(tts, "microsoft", "microsoft");
  const movedProviderEdge = mergeLegacyTtsProviderAliasConfig(tts, "edge", "microsoft");
  const movedEdge = mergeLegacyTtsProviderConfig(tts, "edge", "microsoft");
  if (movedOpenAI) changes.push(`Moved ${pathLabel}.openai → ${pathLabel}.providers.openai.`);
  if (movedElevenLabs)
    changes.push(`Moved ${pathLabel}.elevenlabs → ${pathLabel}.providers.elevenlabs.`);
  if (movedMicrosoft)
    changes.push(`Moved ${pathLabel}.microsoft → ${pathLabel}.providers.microsoft.`);
  if (movedProviderEdge)
    changes.push(`Moved ${pathLabel}.providers.edge → ${pathLabel}.providers.microsoft.`);
  if (movedEdge) changes.push(`Moved ${pathLabel}.edge → ${pathLabel}.providers.microsoft.`);
}
function migrateLegacyTtsEnabled(tts, pathLabel, changes) {
  if (!tts || typeof tts.enabled !== "boolean") return;
  const nextAuto = tts.enabled ? "always" : "off";
  delete tts.enabled;
  if (typeof tts.auto === "string" && tts.auto.trim()) {
    changes.push(`Removed ${pathLabel}.enabled because ${pathLabel}.auto is already set.`);
    return;
  }
  tts.auto = nextAuto;
  changes.push(`Moved ${pathLabel}.enabled → ${pathLabel}.auto "${nextAuto}".`);
}
function migrateLegacySpeakerSelectionConfig(providerConfig, pathLabel, changes) {
  if (Object.hasOwn(providerConfig, "voice")) {
    if (providerConfig.speakerVoice === void 0) {
      providerConfig.speakerVoice = providerConfig.voice;
      changes.push(`Moved ${pathLabel}.voice → ${pathLabel}.speakerVoice.`);
    } else
      changes.push(`Removed ${pathLabel}.voice because ${pathLabel}.speakerVoice is already set.`);
    delete providerConfig.voice;
  }
  if (Object.hasOwn(providerConfig, "voiceName")) {
    if (providerConfig.speakerVoice === void 0) {
      providerConfig.speakerVoice = providerConfig.voiceName;
      changes.push(`Moved ${pathLabel}.voiceName → ${pathLabel}.speakerVoice.`);
    } else
      changes.push(
        `Removed ${pathLabel}.voiceName because ${pathLabel}.speakerVoice is already set.`,
      );
    delete providerConfig.voiceName;
  }
  if (Object.hasOwn(providerConfig, "voiceId")) {
    if (providerConfig.speakerVoiceId === void 0) {
      providerConfig.speakerVoiceId = providerConfig.voiceId;
      changes.push(`Moved ${pathLabel}.voiceId → ${pathLabel}.speakerVoiceId.`);
    } else
      changes.push(
        `Removed ${pathLabel}.voiceId because ${pathLabel}.speakerVoiceId is already set.`,
      );
    delete providerConfig.voiceId;
  }
}
function migrateLegacyTtsSpeakerSelection(tts, pathLabel, changes) {
  if (!tts) return;
  migrateLegacySpeakerSelectionProviderMap(tts.providers, `${pathLabel}.providers`, changes);
  for (const providerId of LEGACY_TTS_PROVIDER_KEYS) {
    const providerConfig = getRecord(tts[providerId]);
    if (!providerConfig) continue;
    migrateLegacySpeakerSelectionConfig(providerConfig, `${pathLabel}.${providerId}`, changes);
  }
  const personas = getRecord(tts.personas);
  for (const [personaId, personaValue] of Object.entries(personas ?? {})) {
    if (isBlockedObjectKey(personaId)) continue;
    const persona = getRecord(personaValue);
    if (!persona) continue;
    migrateLegacySpeakerSelectionProviderMap(
      persona.providers,
      `${pathLabel}.personas.${personaId}.providers`,
      changes,
    );
    for (const providerId of LEGACY_TTS_PROVIDER_KEYS) {
      const providerConfig = getRecord(persona[providerId]);
      if (!providerConfig) continue;
      migrateLegacySpeakerSelectionConfig(
        providerConfig,
        `${pathLabel}.personas.${personaId}.${providerId}`,
        changes,
      );
    }
  }
}
function migrateLegacySpeakerSelectionProviderMap(value, pathLabel, changes) {
  const providers = getRecord(value);
  if (!providers) return;
  for (const [providerId, providerValue] of Object.entries(providers)) {
    if (isBlockedObjectKey(providerId)) continue;
    const providerConfig = getRecord(providerValue);
    if (!providerConfig) continue;
    migrateLegacySpeakerSelectionConfig(providerConfig, `${pathLabel}.${providerId}`, changes);
  }
}
function visitKnownTtsConfigLocations(raw, visit) {
  visit(getRecord(getRecord(raw.messages)?.tts), "messages.tts");
  const agents = getRecord(raw.agents);
  (Array.isArray(agents?.list) ? agents.list : []).forEach((entry, index) => {
    visit(getRecord(getRecord(entry)?.tts), `agents.list[${index}].tts`);
  });
  const channels = getRecord(raw.channels);
  for (const [channelId, channelValue] of Object.entries(channels ?? {})) {
    if (isBlockedObjectKey(channelId)) continue;
    const channel = getRecord(channelValue);
    const migrateRootTts = supportsChannelRootTtsMigration(channelId);
    if (migrateRootTts) visit(getRecord(channel?.tts), `channels.${channelId}.tts`);
    visit(getRecord(getRecord(channel?.voice)?.tts), `channels.${channelId}.voice.tts`);
    const accounts = getRecord(channel?.accounts);
    for (const [accountId, accountValue] of Object.entries(accounts ?? {})) {
      if (isBlockedObjectKey(accountId)) continue;
      const account = getRecord(accountValue);
      if (migrateRootTts)
        visit(getRecord(account?.tts), `channels.${channelId}.accounts.${accountId}.tts`);
      visit(
        getRecord(getRecord(account?.voice)?.tts),
        `channels.${channelId}.accounts.${accountId}.voice.tts`,
      );
    }
  }
  const pluginEntries = getRecord(getRecord(raw.plugins)?.entries);
  for (const [pluginId, entryValue] of Object.entries(pluginEntries ?? {})) {
    if (isBlockedObjectKey(pluginId) || !LEGACY_TTS_PLUGIN_IDS.has(pluginId)) continue;
    visit(
      getRecord(getRecord(getRecord(entryValue)?.config)?.tts),
      `plugins.entries.${pluginId}.config.tts`,
    );
  }
}
/** Legacy config migration specs for TTS runtime compatibility. */
const LEGACY_CONFIG_MIGRATIONS_RUNTIME_TTS = [
  defineLegacyConfigMigration({
    id: "tts.providers-generic-shape",
    describe: "Move legacy bundled TTS config keys into messages.tts.providers",
    legacyRules: [
      {
        path: ["messages", "tts"],
        message:
          'messages.tts legacy provider aliases/keys are legacy; use provider: "microsoft" and messages.tts.providers.<provider>. Run "openclaw doctor --fix".',
        match: (value) => hasLegacyTtsProviderKeys(value),
      },
      {
        path: ["plugins", "entries"],
        message:
          'plugins.entries.voice-call.config.tts legacy provider aliases/keys are legacy; use provider: "microsoft" and plugins.entries.voice-call.config.tts.providers.<provider>. Run "openclaw doctor --fix".',
        match: (value) => hasLegacyPluginEntryTtsProviderKeys(value),
      },
    ],
    apply: (raw, changes) => {
      migrateLegacyTtsConfig(getRecord(getRecord(raw.messages)?.tts), "messages.tts", changes);
      const pluginEntries = getRecord(getRecord(raw.plugins)?.entries);
      if (!pluginEntries) return;
      for (const [pluginId, entryValue] of Object.entries(pluginEntries)) {
        if (isBlockedObjectKey(pluginId) || !LEGACY_TTS_PLUGIN_IDS.has(pluginId)) continue;
        migrateLegacyTtsConfig(
          getRecord(getRecord(getRecord(entryValue)?.config)?.tts),
          `plugins.entries.${pluginId}.config.tts`,
          changes,
        );
      }
    },
  }),
  defineLegacyConfigMigration({
    id: "tts.speaker-selection-keys",
    describe: "Move TTS speaker selection keys to speakerVoice/speakerVoiceId",
    legacyRules: [
      {
        path: ["messages", "tts"],
        message:
          'messages.tts speaker selection fields voice/voiceName/voiceId are legacy; use speakerVoice or speakerVoiceId. Run "openclaw doctor --fix".',
        match: (value) => hasLegacyTtsSpeakerSelection(value),
      },
      {
        path: ["agents"],
        message:
          'agents.list[].tts speaker selection fields voice/voiceName/voiceId are legacy; use speakerVoice or speakerVoiceId. Run "openclaw doctor --fix".',
        match: (value) => hasLegacyTtsSpeakerSelectionInAgentLocations(value),
      },
      {
        path: ["channels"],
        message:
          'supported channel TTS speaker selection fields voice/voiceName/voiceId are legacy; use speakerVoice or speakerVoiceId. Run "openclaw doctor --fix".',
        match: (value) => hasLegacyTtsSpeakerSelectionInChannelLocations(value),
      },
      {
        path: ["plugins", "entries"],
        message:
          'plugins.entries.voice-call.config.tts speaker selection fields voice/voiceName/voiceId are legacy; use speakerVoice or speakerVoiceId. Run "openclaw doctor --fix".',
        match: (value) => hasLegacyTtsSpeakerSelectionInPluginLocations(value),
      },
    ],
    apply: (raw, changes) => {
      visitKnownTtsConfigLocations(raw, (tts, pathLabel) =>
        migrateLegacyTtsSpeakerSelection(tts, pathLabel, changes),
      );
    },
  }),
  defineLegacyConfigMigration({
    id: "tts.enabled-auto-mode",
    describe: "Move legacy TTS enabled toggles to auto mode",
    legacyRules: [
      {
        path: ["messages", "tts"],
        message:
          'messages.tts.enabled is legacy; use messages.tts.auto. Run "openclaw doctor --fix".',
        match: (value) => hasLegacyTtsEnabled(value),
      },
      {
        path: ["agents"],
        message:
          'agents.list[].tts.enabled is legacy; use agents.list[].tts.auto. Run "openclaw doctor --fix".',
        match: (value) => hasLegacyTtsEnabledInAgentLocations(value),
      },
      {
        path: ["channels"],
        message:
          'supported channel TTS enabled fields are legacy; use the same TTS block auto field. Run "openclaw doctor --fix".',
        match: (value) => hasLegacyTtsEnabledInChannelLocations(value),
      },
      {
        path: ["plugins", "entries"],
        message:
          'plugins.entries.voice-call.config.tts.enabled is legacy; use plugins.entries.voice-call.config.tts.auto. Run "openclaw doctor --fix".',
        match: (value) => hasLegacyTtsEnabledInPluginLocations(value),
      },
    ],
    apply: (raw, changes) => {
      visitKnownTtsConfigLocations(raw, (tts, pathLabel) =>
        migrateLegacyTtsEnabled(tts, pathLabel, changes),
      );
    },
  }),
];
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.runtime.ts
/** Ordered runtime legacy config migrations applied by doctor. */
const LEGACY_CONFIG_MIGRATIONS_RUNTIME = [
  ...LEGACY_CONFIG_MIGRATIONS_RUNTIME_AGENTS,
  ...LEGACY_CONFIG_MIGRATIONS_RUNTIME_CRON,
  ...LEGACY_CONFIG_MIGRATIONS_RUNTIME_DIAGNOSTICS,
  ...LEGACY_CONFIG_MIGRATIONS_RUNTIME_GATEWAY,
  ...LEGACY_CONFIG_MIGRATIONS_RUNTIME_MCP,
  ...LEGACY_CONFIG_MIGRATIONS_RUNTIME_MODELS,
  ...LEGACY_CONFIG_MIGRATIONS_RUNTIME_PROVIDERS,
  ...LEGACY_CONFIG_MIGRATIONS_RUNTIME_SESSION,
  ...LEGACY_CONFIG_MIGRATIONS_RUNTIME_TTS,
];
//#endregion
//#region src/commands/doctor/shared/legacy-web-search-migrate.ts
const DANGEROUS_RECORD_KEYS = /* @__PURE__ */ new Set(["__proto__", "prototype", "constructor"]);
const BUNDLED_LEGACY_WEB_SEARCH_OWNERS = /* @__PURE__ */ new Map([
  ["brave", "brave"],
  ["duckduckgo", "duckduckgo"],
  ["exa", "exa"],
  ["firecrawl", "firecrawl"],
  ["firecrawl-free", "firecrawl"],
  ["gemini", "google"],
  ["grok", "xai"],
  ["kimi", "moonshot"],
  ["minimax", "minimax"],
  ["ollama", "ollama"],
  ["parallel", "parallel"],
  ["parallel-free", "parallel"],
  ["perplexity", "perplexity"],
  ["searxng", "searxng"],
  ["tavily", "tavily"],
]);
const NON_MIGRATED_LEGACY_WEB_SEARCH_PROVIDER_IDS = /* @__PURE__ */ new Set([
  "firecrawl-free",
  "parallel",
  "parallel-free",
  "tavily",
]);
const LEGACY_GLOBAL_WEB_SEARCH_PROVIDER_ID = "brave";
const RETIRED_GROK_WEB_SEARCH_MODELS = /* @__PURE__ */ new Set([
  "grok-4-1-fast",
  "grok-4-1-fast-reasoning",
  "grok-4-fast",
  "grok-4-fast-reasoning",
  "grok-4-0709",
]);
const RETIRED_GROK_CODE_MODELS = /* @__PURE__ */ new Set([
  "grok-code-fast-1",
  "grok-code-fast",
  "grok-code-fast-1-0825",
]);
function resolveLegacyGrokWebSearchModelTarget(model) {
  if (typeof model !== "string") return;
  const normalized = model.trim().toLowerCase();
  if (RETIRED_GROK_WEB_SEARCH_MODELS.has(normalized)) return "grok-4.3";
  if (RETIRED_GROK_CODE_MODELS.has(normalized)) return "grok-build-0.1";
}
function getBundledLegacyWebSearchOwners() {
  return BUNDLED_LEGACY_WEB_SEARCH_OWNERS;
}
function getLegacyWebSearchProviderIds(owners = getBundledLegacyWebSearchOwners()) {
  return [...owners.keys()]
    .filter((providerId) => !NON_MIGRATED_LEGACY_WEB_SEARCH_PROVIDER_IDS.has(providerId))
    .toSorted((left, right) => left.localeCompare(right));
}
function getLegacyWebSearchProviderIdSet(owners) {
  return new Set(getLegacyWebSearchProviderIds(owners));
}
function resolveLegacySearchConfig(raw) {
  if (!isRecord(raw)) return;
  const tools = isRecord(raw.tools) ? raw.tools : void 0;
  const web = isRecord(tools?.web) ? tools.web : void 0;
  return isRecord(web?.search) ? web.search : void 0;
}
function copyLegacyProviderConfig(search, providerKey) {
  const current = search[providerKey];
  return isRecord(current) ? cloneRecord$1(current) : void 0;
}
function hasMappedLegacyWebSearchConfig(raw, owners) {
  const search = resolveLegacySearchConfig(raw);
  if (!search) return false;
  if (hasOwnKey$1(search, "apiKey")) return true;
  return getLegacyWebSearchProviderIds(owners).some((providerId) => isRecord(search[providerId]));
}
function resolveLegacyGlobalWebSearchMigration(search, owners) {
  const legacyProviderConfig = copyLegacyProviderConfig(
    search,
    LEGACY_GLOBAL_WEB_SEARCH_PROVIDER_ID,
  );
  const payload = legacyProviderConfig ?? {};
  const hasLegacyApiKey = hasOwnKey$1(search, "apiKey");
  if (hasLegacyApiKey) payload.apiKey = search.apiKey;
  if (Object.keys(payload).length === 0) return null;
  const pluginId =
    owners.get(LEGACY_GLOBAL_WEB_SEARCH_PROVIDER_ID) ?? LEGACY_GLOBAL_WEB_SEARCH_PROVIDER_ID;
  return {
    pluginId,
    payload,
    legacyPath: hasLegacyApiKey
      ? "tools.web.search.apiKey"
      : `tools.web.search.${LEGACY_GLOBAL_WEB_SEARCH_PROVIDER_ID}`,
    targetPath:
      hasLegacyApiKey && !legacyProviderConfig
        ? `plugins.entries.${pluginId}.config.webSearch.apiKey`
        : `plugins.entries.${pluginId}.config.webSearch`,
  };
}
function migratePluginWebSearchConfig(params) {
  const entry = ensureRecord$2(
    ensureRecord$2(ensureRecord$2(params.root, "plugins"), "entries"),
    params.pluginId,
  );
  const config = ensureRecord$2(entry, "config");
  const hadEnabled = entry.enabled !== void 0;
  const existing = isRecord(config.webSearch) ? cloneRecord$1(config.webSearch) : void 0;
  if (!hadEnabled) entry.enabled = true;
  if (!existing) {
    config.webSearch = cloneRecord$1(params.payload);
    params.changes.push(`Moved ${params.legacyPath} → ${params.targetPath}.`);
    return;
  }
  const merged = cloneRecord$1(existing);
  mergeMissing(merged, params.payload);
  const changed = JSON.stringify(merged) !== JSON.stringify(existing) || !hadEnabled;
  config.webSearch = merged;
  if (changed) {
    params.changes.push(
      `Merged ${params.legacyPath} → ${params.targetPath} (filled missing fields from legacy; kept explicit plugin config values).`,
    );
    return;
  }
  params.changes.push(`Removed ${params.legacyPath} (${params.targetPath} already set).`);
}
/** List legacy tools.web.search provider config paths present in raw config. */
function listLegacyWebSearchConfigPaths(raw) {
  const owners = getBundledLegacyWebSearchOwners();
  const search = resolveLegacySearchConfig(raw);
  if (!search) return [];
  const paths = [];
  if ("apiKey" in search) paths.push("tools.web.search.apiKey");
  for (const providerId of getLegacyWebSearchProviderIds(owners)) {
    const scoped = search[providerId];
    if (isRecord(scoped))
      for (const key of Object.keys(scoped)) paths.push(`tools.web.search.${providerId}.${key}`);
  }
  return paths;
}
/** Move legacy web-search provider config into provider plugin entries. */
function migrateLegacyWebSearchConfig(raw) {
  if (!isRecord(raw))
    return {
      config: raw,
      changes: [],
    };
  const owners = getBundledLegacyWebSearchOwners();
  if (!hasMappedLegacyWebSearchConfig(raw, owners))
    return {
      config: raw,
      changes: [],
    };
  return normalizeLegacyWebSearchConfigRecord(structuredClone(raw), owners);
}
function normalizeLegacyWebSearchConfigRecord(raw, owners) {
  const nextRoot = cloneRecord$1(raw);
  const web = ensureRecord$2(ensureRecord$2(nextRoot, "tools"), "web");
  const search = resolveLegacySearchConfig(nextRoot);
  if (!search)
    return {
      config: raw,
      changes: [],
    };
  const nextSearch = {};
  const changes = [];
  for (const [key, value] of Object.entries(search)) {
    if (key === "apiKey") continue;
    if (getLegacyWebSearchProviderIdSet(owners).has(key) && isRecord(value)) continue;
    if (DANGEROUS_RECORD_KEYS.has(key)) continue;
    nextSearch[key] = value;
  }
  web.search = nextSearch;
  const globalSearchMigration = resolveLegacyGlobalWebSearchMigration(search, owners);
  if (globalSearchMigration)
    migratePluginWebSearchConfig({
      root: nextRoot,
      legacyPath: globalSearchMigration.legacyPath,
      targetPath: globalSearchMigration.targetPath,
      pluginId: globalSearchMigration.pluginId,
      payload: globalSearchMigration.payload,
      changes,
    });
  for (const providerId of getLegacyWebSearchProviderIds(owners)) {
    if (providerId === LEGACY_GLOBAL_WEB_SEARCH_PROVIDER_ID) continue;
    const scoped = copyLegacyProviderConfig(search, providerId);
    if (!scoped || Object.keys(scoped).length === 0) continue;
    const pluginId = owners.get(providerId);
    if (!pluginId) continue;
    if (providerId === "grok") {
      const targetModel = resolveLegacyGrokWebSearchModelTarget(scoped.model);
      if (targetModel) {
        const previousModel = scoped.model;
        scoped.model = targetModel;
        changes.push(
          `Updated tools.web.search.grok.model from ${JSON.stringify(previousModel)} to ${JSON.stringify(targetModel)}.`,
        );
      }
    }
    migratePluginWebSearchConfig({
      root: nextRoot,
      legacyPath: `tools.web.search.${providerId}`,
      targetPath: `plugins.entries.${pluginId}.config.webSearch`,
      pluginId,
      payload: scoped,
      changes,
    });
  }
  return {
    config: nextRoot,
    changes,
  };
}
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.web-search.ts
const LEGACY_WEB_SEARCH_RULES = [
  {
    path: ["tools", "web", "search"],
    message:
      'tools.web.search provider-owned config moved to plugins.entries.<plugin>.config.webSearch. Run "openclaw doctor --fix".',
    match: (_value, root) => listLegacyWebSearchConfigPaths(root).length > 0,
    requireSourceLiteral: true,
  },
];
function replaceRootRecord(target, replacement) {
  for (const key of Object.keys(target)) delete target[key];
  Object.assign(target, replacement);
}
/** Legacy config migration specs for web-search provider config. */
const LEGACY_CONFIG_MIGRATIONS_WEB_SEARCH = [
  defineLegacyConfigMigration({
    id: "tools.web.search-provider-config->plugins.entries",
    describe:
      "Move legacy tools.web.search provider-owned config into plugins.entries.<plugin>.config.webSearch",
    legacyRules: LEGACY_WEB_SEARCH_RULES,
    apply: (raw, changes) => {
      const migrated = migrateLegacyWebSearchConfig(raw);
      if (migrated.changes.length === 0) return;
      replaceRootRecord(raw, migrated.config);
      changes.push(...migrated.changes);
    },
  }),
];
//#endregion
//#region src/commands/doctor/shared/legacy-config-migrations.ts
const LEGACY_CONFIG_MIGRATION_SPECS = [
  ...LEGACY_CONFIG_MIGRATIONS_CHANNELS,
  ...LEGACY_CONFIG_MIGRATIONS_AUDIO,
  ...LEGACY_CONFIG_MIGRATIONS_QUEUE,
  ...LEGACY_CONFIG_MIGRATIONS_RUNTIME,
  ...LEGACY_CONFIG_MIGRATIONS_WEB_SEARCH,
];
/** Ordered legacy migrations without their preview-only rule metadata. */
const LEGACY_CONFIG_MIGRATIONS = LEGACY_CONFIG_MIGRATION_SPECS.map(
  ({ legacyRules: _legacyRules, ...migration }) => migration,
);
/** Aggregated legacy config rules used for doctor preview issue detection. */
const LEGACY_CONFIG_MIGRATION_RULES = LEGACY_CONFIG_MIGRATION_SPECS.flatMap(
  (migration) => migration.legacyRules ?? [],
);
//#endregion
export {
  legacyRuntimeModelAliasRequiresRuntimePolicy as a,
  loadBundledChannelDoctorContractApi as c,
  migrateLegacyXSearchConfig as i,
  LEGACY_CONFIG_MIGRATION_RULES as n,
  listLegacyRuntimeModelProviderAliases as o,
  migrateLegacyWebSearchConfig as r,
  migrateLegacyRuntimeModelRef as s,
  LEGACY_CONFIG_MIGRATIONS as t,
};
