import "./history-DdfM33Aj.js";
import "./reply-history-DTabwFaD.js";
import {
  i as asObjectRecord,
  r as defineChannelAliasMigration,
} from "./runtime-doctor-DOtJb07X.js";
//#region extensions/telegram/src/doctor-contract.ts
const streamingAliasMigration = defineChannelAliasMigration({
  channelId: "telegram",
  streaming: {
    defaultMode: "partial",
    includePreviewChunk: true,
  },
});
function hasRetiredTelegramDmConfig(value) {
  const entry = asObjectRecord(value);
  if (!entry) return false;
  if (asObjectRecord(entry.dm)) return true;
  return Object.values(asObjectRecord(entry.direct) ?? {}).some(
    (direct) => asObjectRecord(direct)?.threadReplies !== void 0,
  );
}
function hasRetiredTelegramAccountDmConfig(value) {
  const accounts = asObjectRecord(value);
  if (!accounts) return false;
  return Object.values(accounts).some((account) => hasRetiredTelegramDmConfig(account));
}
function hasRetiredTelegramNativeDraftConfig(value) {
  const preview = asObjectRecord(asObjectRecord(asObjectRecord(value)?.streaming)?.preview);
  return preview?.nativeToolProgress !== void 0 || preview?.nativeToolProgressAllowFrom !== void 0;
}
function hasRetiredTelegramGroupHistoryContextConfig(value) {
  return asObjectRecord(value)?.includeGroupHistoryContext !== void 0;
}
function hasRetiredTelegramAccountNativeDraftConfig(value) {
  const accounts = asObjectRecord(value);
  if (!accounts) return false;
  return Object.values(accounts).some((account) => hasRetiredTelegramNativeDraftConfig(account));
}
function hasRetiredTelegramAccountGroupHistoryContextConfig(value) {
  const accounts = asObjectRecord(value);
  if (!accounts) return false;
  return Object.values(accounts).some((account) =>
    hasRetiredTelegramGroupHistoryContextConfig(account),
  );
}
function removeRetiredTelegramDmConfig(params) {
  let updated = params.entry;
  let changed = false;
  const dm = asObjectRecord(updated.dm);
  if (dm) {
    const { dm: _ignored, ...rest } = updated;
    updated = rest;
    params.changes.push(
      dm.threadReplies === void 0
        ? `Removed ${params.pathPrefix}.dm.`
        : `Removed ${params.pathPrefix}.dm.threadReplies; DM topic sessions now follow Telegram getMe.has_topics_enabled.`,
    );
    changed = true;
  }
  const direct = asObjectRecord(updated.direct);
  if (direct) {
    let directChanged = false;
    const nextDirect = { ...direct };
    for (const [chatId, rawDirectConfig] of Object.entries(direct)) {
      const directConfig = asObjectRecord(rawDirectConfig);
      if (!directConfig || directConfig.threadReplies === void 0) continue;
      const nextDirectConfig = { ...directConfig };
      delete nextDirectConfig.threadReplies;
      nextDirect[chatId] = nextDirectConfig;
      params.changes.push(
        `Removed ${params.pathPrefix}.direct.${chatId}.threadReplies; DM topic sessions now follow Telegram getMe.has_topics_enabled.`,
      );
      directChanged = true;
    }
    if (directChanged) {
      updated = {
        ...updated,
        direct: nextDirect,
      };
      changed = true;
    }
  }
  return {
    entry: updated,
    changed,
  };
}
function removeRetiredTelegramNativeDraftConfig(params) {
  const streaming = asObjectRecord(params.entry.streaming);
  const preview = asObjectRecord(streaming?.preview);
  if (
    !streaming ||
    !preview ||
    (preview.nativeToolProgress === void 0 && preview.nativeToolProgressAllowFrom === void 0)
  )
    return {
      entry: params.entry,
      changed: false,
    };
  const nextPreview = { ...preview };
  delete nextPreview.nativeToolProgress;
  delete nextPreview.nativeToolProgressAllowFrom;
  const nextStreaming = { ...streaming };
  if (Object.keys(nextPreview).length > 0) nextStreaming.preview = nextPreview;
  else delete nextStreaming.preview;
  const updated =
    Object.keys(nextStreaming).length > 0
      ? {
          ...params.entry,
          streaming: nextStreaming,
        }
      : Object.fromEntries(Object.entries(params.entry).filter(([key]) => key !== "streaming"));
  params.changes.push(
    `Removed ${params.pathPrefix}.streaming.preview native draft keys; Telegram previews now use rich send/edit messages.`,
  );
  return {
    entry: updated,
    changed: true,
  };
}
function removeRetiredTelegramGroupHistoryContextConfig(params) {
  if (params.entry.includeGroupHistoryContext === void 0)
    return {
      entry: params.entry,
      changed: false,
    };
  const { includeGroupHistoryContext, ...rest } = params.entry;
  let updated =
    includeGroupHistoryContext === "none"
      ? {
          ...rest,
          historyLimit: 0,
        }
      : rest;
  if (
    includeGroupHistoryContext === "recent" &&
    params.preserveRecentHistoryLimit !== void 0 &&
    updated.historyLimit === void 0
  )
    updated = {
      ...updated,
      historyLimit: params.preserveRecentHistoryLimit,
    };
  const historyLimitNote =
    includeGroupHistoryContext === "none"
      ? " and set historyLimit to 0"
      : includeGroupHistoryContext === "recent" &&
          params.preserveRecentHistoryLimit !== void 0 &&
          params.entry.historyLimit === void 0
        ? ` and set historyLimit to ${params.preserveRecentHistoryLimit}`
        : "";
  params.changes.push(
    `Removed ${params.pathPrefix}.includeGroupHistoryContext${historyLimitNote}; Telegram group history is always on for groups and bounded by historyLimit.`,
  );
  return {
    entry: updated,
    changed: true,
  };
}
function resolveCompatibleDefaultGroupEntry(section) {
  const existingGroups = section.groups;
  if (existingGroups !== void 0 && !asObjectRecord(existingGroups)) return null;
  const groups = asObjectRecord(existingGroups) ?? {};
  const existingEntry = groups["*"];
  if (existingEntry !== void 0 && !asObjectRecord(existingEntry)) return null;
  return {
    groups,
    entry: asObjectRecord(existingEntry) ?? {},
  };
}
const legacyConfigRules = [
  {
    path: ["channels", "telegram", "groupMentionsOnly"],
    message:
      'channels.telegram.groupMentionsOnly was removed; use channels.telegram.groups."*".requireMention instead. Run "openclaw doctor --fix".',
  },
  {
    path: ["channels", "telegram"],
    message:
      'channels.telegram.dm and direct.<chatId>.threadReplies were removed; DM topic sessions now follow Telegram getMe.has_topics_enabled, so topics-enabled bots may use thread-scoped DM sessions. Run "openclaw doctor --fix".',
    match: hasRetiredTelegramDmConfig,
  },
  {
    path: ["channels", "telegram", "accounts"],
    message:
      'channels.telegram.accounts.<id>.dm and direct.<chatId>.threadReplies were removed; DM topic sessions now follow Telegram getMe.has_topics_enabled, so topics-enabled bots may use thread-scoped DM sessions. Run "openclaw doctor --fix".',
    match: hasRetiredTelegramAccountDmConfig,
  },
  {
    path: ["channels", "telegram"],
    message:
      'channels.telegram.streaming.preview.nativeToolProgress and nativeToolProgressAllowFrom were removed; Telegram previews now use rich send/edit messages. Run "openclaw doctor --fix".',
    match: hasRetiredTelegramNativeDraftConfig,
  },
  {
    path: ["channels", "telegram", "accounts"],
    message:
      'channels.telegram.accounts.<id>.streaming.preview.nativeToolProgress and nativeToolProgressAllowFrom were removed; Telegram previews now use rich send/edit messages. Run "openclaw doctor --fix".',
    match: hasRetiredTelegramAccountNativeDraftConfig,
  },
  {
    path: ["channels", "telegram"],
    message:
      'channels.telegram.includeGroupHistoryContext was removed; Telegram group history is always on for groups and bounded by historyLimit. Run "openclaw doctor --fix".',
    match: hasRetiredTelegramGroupHistoryContextConfig,
  },
  {
    path: ["channels", "telegram", "accounts"],
    message:
      'channels.telegram.accounts.<id>.includeGroupHistoryContext was removed; Telegram group history is always on for groups and bounded by historyLimit. Run "openclaw doctor --fix".',
    match: hasRetiredTelegramAccountGroupHistoryContextConfig,
  },
  ...streamingAliasMigration.legacyConfigRules,
];
function normalizeCompatibilityConfig({ cfg }) {
  const changes = [];
  const aliases = streamingAliasMigration.normalizeChannelConfig({
    cfg,
    changes,
  });
  const rawEntry = asObjectRecord(aliases.config.channels?.telegram);
  if (!rawEntry)
    return {
      config: cfg,
      changes: [],
    };
  let updated = rawEntry;
  let changed = aliases.config !== cfg;
  const rootGroupHistoryContextMode = updated.includeGroupHistoryContext;
  const rootGroupHistoryLimitBeforeMigration =
    typeof updated.historyLimit === "number"
      ? updated.historyLimit
      : (cfg.messages?.groupChat?.historyLimit ?? 50);
  const removedThreadReplies = removeRetiredTelegramDmConfig({
    entry: updated,
    pathPrefix: "channels.telegram",
    changes,
  });
  updated = removedThreadReplies.entry;
  changed = changed || removedThreadReplies.changed;
  const removedNativeDraft = removeRetiredTelegramNativeDraftConfig({
    entry: updated,
    pathPrefix: "channels.telegram",
    changes,
  });
  updated = removedNativeDraft.entry;
  changed = changed || removedNativeDraft.changed;
  const removedGroupHistoryContext = removeRetiredTelegramGroupHistoryContextConfig({
    entry: updated,
    pathPrefix: "channels.telegram",
    changes,
  });
  updated = removedGroupHistoryContext.entry;
  changed = changed || removedGroupHistoryContext.changed;
  if (updated.groupMentionsOnly !== void 0) {
    const defaultGroupEntry = resolveCompatibleDefaultGroupEntry(updated);
    if (!defaultGroupEntry)
      changes.push(
        "Skipped channels.telegram.groupMentionsOnly migration because channels.telegram.groups already has an incompatible shape; fix remaining issues manually.",
      );
    else {
      const { groups, entry } = defaultGroupEntry;
      if (entry.requireMention === void 0) {
        entry.requireMention = updated.groupMentionsOnly;
        groups["*"] = entry;
        updated = {
          ...updated,
          groups,
        };
        changes.push(
          'Moved channels.telegram.groupMentionsOnly → channels.telegram.groups."*".requireMention.',
        );
      } else
        changes.push(
          'Removed channels.telegram.groupMentionsOnly (channels.telegram.groups."*" already set).',
        );
      const { groupMentionsOnly: _ignored, ...rest } = updated;
      updated = rest;
      changed = true;
    }
  }
  const accounts = asObjectRecord(updated.accounts);
  if (accounts) {
    let accountsChanged = false;
    const nextAccounts = { ...accounts };
    for (const [accountId, rawAccount] of Object.entries(accounts)) {
      const account = asObjectRecord(rawAccount);
      if (!account) continue;
      const accountRemovedThreadReplies = removeRetiredTelegramDmConfig({
        entry: account,
        pathPrefix: `channels.telegram.accounts.${accountId}`,
        changes,
      });
      if (accountRemovedThreadReplies.changed) {
        nextAccounts[accountId] = accountRemovedThreadReplies.entry;
        accountsChanged = true;
      }
      const accountRemovedNativeDraft = removeRetiredTelegramNativeDraftConfig({
        entry: nextAccounts[accountId],
        pathPrefix: `channels.telegram.accounts.${accountId}`,
        changes,
      });
      if (accountRemovedNativeDraft.changed) {
        nextAccounts[accountId] = accountRemovedNativeDraft.entry;
        accountsChanged = true;
      }
      const accountRemovedGroupHistoryContext = removeRetiredTelegramGroupHistoryContextConfig({
        entry: nextAccounts[accountId],
        pathPrefix: `channels.telegram.accounts.${accountId}`,
        changes,
        ...(rootGroupHistoryContextMode === "none"
          ? { preserveRecentHistoryLimit: rootGroupHistoryLimitBeforeMigration }
          : {}),
      });
      if (accountRemovedGroupHistoryContext.changed) {
        nextAccounts[accountId] = accountRemovedGroupHistoryContext.entry;
        accountsChanged = true;
      }
    }
    if (accountsChanged) {
      updated = {
        ...updated,
        accounts: nextAccounts,
      };
      changed = true;
    }
  }
  if (!changed && changes.length === 0)
    return {
      config: cfg,
      changes: [],
    };
  return {
    config: {
      ...aliases.config,
      channels: {
        ...aliases.config.channels,
        telegram: updated,
      },
    },
    changes,
  };
}
//#endregion
export { normalizeCompatibilityConfig as n, legacyConfigRules as t };
