import {
  i as asObjectRecord,
  r as defineChannelAliasMigration,
} from "./runtime-doctor-DOtJb07X.js";
//#region extensions/feishu/src/doctor-contract.ts
const streamingAliasMigration = defineChannelAliasMigration({
  channelId: "feishu",
  streaming: { defaultMode: "partial" },
  accountStreamingReplacesRoot: true,
});
const LEGACY_COALESCE_FIELDS = ["enabled", "minDelayMs", "maxDelayMs"];
function sanitizeLegacyCoalesceFields(params) {
  const streaming = asObjectRecord(params.entry.streaming);
  const block = asObjectRecord(streaming?.block);
  const coalesce = asObjectRecord(block?.coalesce);
  if (!streaming || !block || !coalesce)
    return {
      entry: params.entry,
      changed: false,
    };
  const removed = LEGACY_COALESCE_FIELDS.filter((field) => coalesce[field] !== void 0);
  if (removed.length === 0)
    return {
      entry: params.entry,
      changed: false,
    };
  const nextCoalesce = { ...coalesce };
  for (const field of removed) delete nextCoalesce[field];
  params.changes.push(
    `Removed ${params.pathPrefix}.streaming.block.coalesce.{${removed.join(",")}} (legacy Feishu-only fields; block delivery reads minChars/maxChars/idleMs).`,
  );
  return {
    entry: {
      ...params.entry,
      streaming: {
        ...streaming,
        block: {
          ...block,
          coalesce: nextCoalesce,
        },
      },
    },
    changed: true,
  };
}
function sanitizeFeishuCoalesce(cfg, changes) {
  const channels = cfg.channels;
  const entry = asObjectRecord(channels?.feishu);
  if (!entry) return cfg;
  const root = sanitizeLegacyCoalesceFields({
    entry,
    pathPrefix: "channels.feishu",
    changes,
  });
  let updated = root.entry;
  let changed = root.changed;
  const accounts = asObjectRecord(updated.accounts);
  if (accounts) {
    let accountsChanged = false;
    const nextAccounts = { ...accounts };
    for (const [accountId, rawAccount] of Object.entries(accounts)) {
      const account = asObjectRecord(rawAccount);
      if (!account) continue;
      const sanitized = sanitizeLegacyCoalesceFields({
        entry: account,
        pathPrefix: `channels.feishu.accounts.${accountId}`,
        changes,
      });
      if (sanitized.changed) {
        nextAccounts[accountId] = sanitized.entry;
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
  if (!changed) return cfg;
  return {
    ...cfg,
    channels: {
      ...channels,
      feishu: updated,
    },
  };
}
const legacyConfigRules = streamingAliasMigration.legacyConfigRules;
function normalizeCompatibilityConfig({ cfg }) {
  const aliases = streamingAliasMigration.normalizeChannelConfig({ cfg });
  return {
    config: sanitizeFeishuCoalesce(aliases.config, aliases.changes),
    changes: aliases.changes,
  };
}
//#endregion
export { normalizeCompatibilityConfig as n, legacyConfigRules as t };
