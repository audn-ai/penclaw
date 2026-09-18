import {
  i as createChannelSecretTargetRegistryEntries,
  o as getChannelSurface,
  t as collectConditionalChannelFieldAssignments,
} from "./channel-secret-basic-runtime-Dhe08HLa.js";
import { i as hasOwnProperty } from "./runtime-shared-CE1Ki5Mc.js";
import "./channel-secret-basic-runtime-Cbnfa60V.js";
//#region extensions/zalo/src/secret-contract.ts
const secretTargetRegistryEntries = createChannelSecretTargetRegistryEntries({
  channelKey: "zalo",
  account: ["botToken", "webhookSecret"],
  channel: ["botToken", "webhookSecret"],
});
function collectRuntimeConfigAssignments(params) {
  const resolved = getChannelSurface(params.config, "zalo");
  if (!resolved) return;
  const { channel: zalo, surface } = resolved;
  collectConditionalChannelFieldAssignments({
    channelKey: "zalo",
    field: "botToken",
    channel: zalo,
    surface,
    defaults: params.defaults,
    context: params.context,
    topLevelActiveWithoutAccounts: true,
    topLevelInheritedAccountActive: ({ account, enabled }) =>
      enabled && !hasOwnProperty(account, "botToken"),
    accountActive: ({ enabled }) => enabled,
    topInactiveReason: "no enabled Zalo surface inherits this top-level botToken.",
    accountInactiveReason: "Zalo account is disabled.",
  });
  const baseWebhookUrl = typeof zalo.webhookUrl === "string" ? zalo.webhookUrl.trim() : "";
  const accountWebhookUrl = (account) =>
    hasOwnProperty(account, "webhookUrl")
      ? typeof account.webhookUrl === "string"
        ? account.webhookUrl.trim()
        : ""
      : baseWebhookUrl;
  collectConditionalChannelFieldAssignments({
    channelKey: "zalo",
    field: "webhookSecret",
    channel: zalo,
    surface,
    defaults: params.defaults,
    context: params.context,
    topLevelActiveWithoutAccounts: baseWebhookUrl.length > 0,
    topLevelInheritedAccountActive: ({ account, enabled }) =>
      enabled && !hasOwnProperty(account, "webhookSecret") && accountWebhookUrl(account).length > 0,
    accountActive: ({ account, enabled }) => enabled && accountWebhookUrl(account).length > 0,
    topInactiveReason:
      "no enabled Zalo webhook surface inherits this top-level webhookSecret (webhook mode is not active).",
    accountInactiveReason:
      "Zalo account is disabled or webhook mode is not active for this account.",
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
