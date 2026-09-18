import {
  i as createChannelSecretTargetRegistryEntries,
  o as getChannelSurface,
  s as hasConfiguredSecretInputValue,
  t as collectConditionalChannelFieldAssignments,
} from "./channel-secret-basic-runtime-Dhe08HLa.js";
import { i as hasOwnProperty } from "./runtime-shared-CE1Ki5Mc.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./channel-secret-basic-runtime-Cbnfa60V.js";
//#region extensions/telegram/src/secret-contract.ts
const secretTargetRegistryEntries = createChannelSecretTargetRegistryEntries({
  channelKey: "telegram",
  account: ["botToken", "webhookSecret"],
  channel: ["botToken", "webhookSecret"],
});
function collectRuntimeConfigAssignments(params) {
  const resolved = getChannelSurface(params.config, "telegram");
  if (!resolved) return;
  const { channel: telegram, surface } = resolved;
  const baseTokenFile = normalizeOptionalString(telegram.tokenFile) ?? "";
  const accountTokenFile = (account) => normalizeOptionalString(account.tokenFile) ?? "";
  collectConditionalChannelFieldAssignments({
    channelKey: "telegram",
    field: "botToken",
    channel: telegram,
    surface,
    defaults: params.defaults,
    context: params.context,
    topLevelActiveWithoutAccounts: baseTokenFile.length === 0,
    topLevelInheritedAccountActive: ({ account, enabled }) => {
      if (!enabled || baseTokenFile.length > 0) return false;
      return (
        !hasConfiguredSecretInputValue(account.botToken, params.defaults) &&
        accountTokenFile(account).length === 0
      );
    },
    accountActive: ({ account, enabled }) => enabled && accountTokenFile(account).length === 0,
    topInactiveReason:
      "no enabled Telegram surface inherits this top-level botToken (tokenFile is configured).",
    accountInactiveReason: "Telegram account is disabled or tokenFile is configured.",
  });
  const baseWebhookUrl = normalizeOptionalString(telegram.webhookUrl) ?? "";
  const accountWebhookUrl = (account) =>
    hasOwnProperty(account, "webhookUrl")
      ? (normalizeOptionalString(account.webhookUrl) ?? "")
      : baseWebhookUrl;
  collectConditionalChannelFieldAssignments({
    channelKey: "telegram",
    field: "webhookSecret",
    channel: telegram,
    surface,
    defaults: params.defaults,
    context: params.context,
    topLevelActiveWithoutAccounts: baseWebhookUrl.length > 0,
    topLevelInheritedAccountActive: ({ account, enabled }) =>
      enabled && !hasOwnProperty(account, "webhookSecret") && accountWebhookUrl(account).length > 0,
    accountActive: ({ account, enabled }) => enabled && accountWebhookUrl(account).length > 0,
    topInactiveReason:
      "no enabled Telegram webhook surface inherits this top-level webhookSecret (webhook mode is not active).",
    accountInactiveReason:
      "Telegram account is disabled or webhook mode is not active for this account.",
  });
}
const channelSecrets = {
  secretTargetRegistryEntries,
  collectRuntimeConfigAssignments,
};
//#endregion
export {
  collectRuntimeConfigAssignments as n,
  secretTargetRegistryEntries as r,
  channelSecrets as t,
};
