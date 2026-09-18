import {
  i as createChannelSecretTargetRegistryEntries,
  o as getChannelSurface,
  t as collectConditionalChannelFieldAssignments,
} from "./channel-secret-basic-runtime-Dhe08HLa.js";
import { i as hasOwnProperty } from "./runtime-shared-CE1Ki5Mc.js";
import "./channel-secret-basic-runtime-Cbnfa60V.js";
//#region extensions/nextcloud-talk/src/secret-contract.ts
const secretTargetRegistryEntries = createChannelSecretTargetRegistryEntries({
  channelKey: "nextcloud-talk",
  account: ["apiPassword", "botSecret"],
  channel: ["apiPassword", "botSecret"],
});
function collectRuntimeConfigAssignments(params) {
  const resolved = getChannelSurface(params.config, "nextcloud-talk");
  if (!resolved) return;
  const { channel: nextcloudTalk, surface } = resolved;
  const inheritsField =
    (field) =>
    ({ account, enabled }) =>
      enabled && !hasOwnProperty(account, field);
  collectConditionalChannelFieldAssignments({
    channelKey: "nextcloud-talk",
    field: "botSecret",
    channel: nextcloudTalk,
    surface,
    defaults: params.defaults,
    context: params.context,
    topLevelActiveWithoutAccounts: true,
    topLevelInheritedAccountActive: inheritsField("botSecret"),
    accountActive: ({ enabled }) => enabled,
    topInactiveReason: "no enabled Nextcloud Talk surface inherits this top-level botSecret.",
    accountInactiveReason: "Nextcloud Talk account is disabled.",
  });
  collectConditionalChannelFieldAssignments({
    channelKey: "nextcloud-talk",
    field: "apiPassword",
    channel: nextcloudTalk,
    surface,
    defaults: params.defaults,
    context: params.context,
    topLevelActiveWithoutAccounts: true,
    topLevelInheritedAccountActive: inheritsField("apiPassword"),
    accountActive: ({ enabled }) => enabled,
    topInactiveReason: "no enabled Nextcloud Talk surface inherits this top-level apiPassword.",
    accountInactiveReason: "Nextcloud Talk account is disabled.",
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
