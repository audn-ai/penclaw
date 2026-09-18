import {
  c as isBaseFieldActiveForChannelSurface,
  i as createChannelSecretTargetRegistryEntries,
  l as normalizeSecretStringValue,
  o as getChannelSurface,
  s as hasConfiguredSecretInputValue,
  t as collectConditionalChannelFieldAssignments,
} from "./channel-secret-basic-runtime-Dhe08HLa.js";
import {
  i as hasOwnProperty,
  n as collectSecretInputAssignment,
} from "./runtime-shared-CE1Ki5Mc.js";
import "./channel-secret-basic-runtime-Cbnfa60V.js";
//#region extensions/feishu/src/secret-contract.ts
const secretTargetRegistryEntries = createChannelSecretTargetRegistryEntries({
  channelKey: "feishu",
  account: ["appSecret", "encryptKey", "verificationToken"],
  channel: ["appSecret", "encryptKey", "verificationToken"],
});
function collectRuntimeConfigAssignments(params) {
  const resolved = getChannelSurface(params.config, "feishu");
  if (!resolved) return;
  const { channel: feishu, surface } = resolved;
  const topLevelAppSecretActive =
    (surface.channelEnabled &&
      hasConfiguredSecretInputValue(feishu.appId, params.defaults) &&
      hasConfiguredSecretInputValue(feishu.appSecret, params.defaults)) ||
    isBaseFieldActiveForChannelSurface(surface, "appSecret");
  collectSecretInputAssignment({
    value: feishu.appSecret,
    path: "channels.feishu.appSecret",
    expected: "string",
    defaults: params.defaults,
    context: params.context,
    active: topLevelAppSecretActive,
    inactiveReason: "no enabled account inherits this top-level Feishu appSecret.",
    apply: (value) => {
      feishu.appSecret = value;
    },
  });
  if (surface.hasExplicitAccounts)
    for (const { accountId, account, enabled } of surface.accounts) {
      if (!hasOwnProperty(account, "appSecret")) continue;
      collectSecretInputAssignment({
        value: account.appSecret,
        path: `channels.feishu.accounts.${accountId}.appSecret`,
        expected: "string",
        defaults: params.defaults,
        context: params.context,
        active: enabled,
        inactiveReason: "Feishu account is disabled.",
        apply: (value) => {
          account.appSecret = value;
        },
      });
    }
  const baseConnectionMode =
    normalizeSecretStringValue(feishu.connectionMode) === "webhook" ? "webhook" : "websocket";
  const resolveAccountMode = (account) =>
    hasOwnProperty(account, "connectionMode")
      ? normalizeSecretStringValue(account.connectionMode)
      : baseConnectionMode;
  collectConditionalChannelFieldAssignments({
    channelKey: "feishu",
    field: "encryptKey",
    channel: feishu,
    surface,
    defaults: params.defaults,
    context: params.context,
    topLevelActiveWithoutAccounts: baseConnectionMode === "webhook",
    topLevelInheritedAccountActive: ({ account, enabled }) =>
      enabled &&
      !hasOwnProperty(account, "encryptKey") &&
      resolveAccountMode(account) === "webhook",
    accountActive: ({ account, enabled }) => enabled && resolveAccountMode(account) === "webhook",
    topInactiveReason: "no enabled Feishu webhook-mode surface inherits this top-level encryptKey.",
    accountInactiveReason: "Feishu account is disabled or not running in webhook mode.",
  });
  collectConditionalChannelFieldAssignments({
    channelKey: "feishu",
    field: "verificationToken",
    channel: feishu,
    surface,
    defaults: params.defaults,
    context: params.context,
    topLevelActiveWithoutAccounts: baseConnectionMode === "webhook",
    topLevelInheritedAccountActive: ({ account, enabled }) =>
      enabled &&
      !hasOwnProperty(account, "verificationToken") &&
      resolveAccountMode(account) === "webhook",
    accountActive: ({ account, enabled }) => enabled && resolveAccountMode(account) === "webhook",
    topInactiveReason:
      "no enabled Feishu webhook-mode surface inherits this top-level verificationToken.",
    accountInactiveReason: "Feishu account is disabled or not running in webhook mode.",
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
