import { o as isRecord } from "../../record-coerce-DHZ4bFlT.js";
import "../../string-coerce-runtime-BUe4iD0r.js";
import { r as defineChannelAliasMigration } from "../../runtime-doctor-DOtJb07X.js";
//#region extensions/imessage/doctor-contract-api.ts
function isEnabledCatchup(value) {
  return isRecord(value) && value.enabled === true;
}
function imessageEntryHasRetiredCatchup(entry) {
  if (!isRecord(entry)) return false;
  if (Object.hasOwn(entry, "catchup") && !isEnabledCatchup(entry.catchup)) return true;
  const accounts = entry.accounts;
  if (!isRecord(accounts)) return false;
  return Object.values(accounts).some(
    (account) =>
      isRecord(account) && Object.hasOwn(account, "catchup") && !isEnabledCatchup(account.catchup),
  );
}
const streamingAliasMigration = defineChannelAliasMigration({
  channelId: "imessage",
  streaming: {
    defaultMode: "partial",
    deliveryOnly: true,
  },
});
const legacyConfigRules = [
  {
    path: ["channels", "imessage"],
    message:
      'disabled channels.imessage.catchup config is retired; iMessage now recovers via always-on inbound dedupe and a stale-backlog age fence. Run "openclaw doctor --fix" to remove disabled catchup blocks.',
    match: (value) => imessageEntryHasRetiredCatchup(value),
  },
  ...streamingAliasMigration.legacyConfigRules,
];
function normalizeCompatibilityConfig({ cfg }) {
  const channels = cfg.channels;
  const imessage = channels?.imessage;
  if (!isRecord(imessage))
    return {
      config: cfg,
      changes: [],
    };
  const changes = [];
  let nextImessage = imessage;
  if (imessageEntryHasRetiredCatchup(nextImessage)) {
    nextImessage = { ...nextImessage };
    if (Object.hasOwn(nextImessage, "catchup") && !isEnabledCatchup(nextImessage.catchup)) {
      delete nextImessage.catchup;
      changes.push("Removed disabled retired channels.imessage.catchup.");
    }
    if (isRecord(nextImessage.accounts)) {
      let accountsChanged = false;
      const nextAccounts = { ...nextImessage.accounts };
      for (const [id, account] of Object.entries(nextImessage.accounts))
        if (
          isRecord(account) &&
          Object.hasOwn(account, "catchup") &&
          !isEnabledCatchup(account.catchup)
        ) {
          const nextAccount = { ...account };
          delete nextAccount.catchup;
          nextAccounts[id] = nextAccount;
          accountsChanged = true;
          changes.push(`Removed disabled retired channels.imessage.accounts.${id}.catchup.`);
        }
      if (accountsChanged) nextImessage.accounts = nextAccounts;
    }
  }
  const aliases = streamingAliasMigration.normalizeChannelConfig({
    cfg:
      nextImessage === imessage
        ? cfg
        : {
            ...cfg,
            channels: {
              ...channels,
              imessage: nextImessage,
            },
          },
    changes,
  });
  if (changes.length === 0)
    return {
      config: cfg,
      changes: [],
    };
  return {
    config: aliases.config,
    changes,
  };
}
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };
