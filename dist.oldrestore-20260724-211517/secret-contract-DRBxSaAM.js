import {
  i as createChannelSecretTargetRegistryEntries,
  o as getChannelSurface,
  u as resolveChannelAccountSurface,
} from "./channel-secret-basic-runtime-Dhe08HLa.js";
import {
  c as pushInactiveSurfaceWarning,
  i as hasOwnProperty,
  l as pushWarning,
  s as pushAssignment,
} from "./runtime-shared-CE1Ki5Mc.js";
import { s as coerceSecretRef } from "./types.secrets-BV0ywRAy.js";
import "./channel-secret-basic-runtime-Cbnfa60V.js";
import "./secret-ref-runtime-BRCHynvV.js";
//#region extensions/googlechat/src/secret-contract.ts
const secretTargetRegistryEntries = createChannelSecretTargetRegistryEntries({
  channelKey: "googlechat",
  account: [
    {
      path: "serviceAccount",
      refPath: "serviceAccountRef",
      targetType: "channels.googlechat.serviceAccount",
      targetTypeAliases: ["channels.googlechat.accounts.*.serviceAccount"],
      secretShape: "sibling_ref",
      expectedResolvedValue: "string-or-object",
      accountIdPathSegmentIndex: 3,
    },
  ],
  channel: [
    {
      path: "serviceAccount",
      refPath: "serviceAccountRef",
      secretShape: "sibling_ref",
      expectedResolvedValue: "string-or-object",
    },
  ],
});
function resolveSecretInputRef(params) {
  const explicitRef = coerceSecretRef(params.refValue, params.defaults);
  const inlineRef = explicitRef ? null : coerceSecretRef(params.value, params.defaults);
  return {
    explicitRef,
    inlineRef,
    ref: explicitRef ?? inlineRef,
  };
}
function collectGoogleChatAccountAssignment(params) {
  const { explicitRef, ref } = resolveSecretInputRef({
    value: params.target.serviceAccount,
    refValue: params.target.serviceAccountRef,
    defaults: params.defaults,
  });
  if (!ref) return;
  if (params.active === false) {
    pushInactiveSurfaceWarning({
      context: params.context,
      path: `${params.path}.serviceAccount`,
      details: params.inactiveReason,
    });
    return;
  }
  if (
    explicitRef &&
    params.target.serviceAccount !== void 0 &&
    !coerceSecretRef(params.target.serviceAccount, params.defaults)
  )
    pushWarning(params.context, {
      code: "SECRETS_REF_OVERRIDES_PLAINTEXT",
      path: params.path,
      message: `${params.path}: serviceAccountRef is set; runtime will ignore plaintext serviceAccount.`,
    });
  pushAssignment(params.context, {
    ref,
    path: `${params.path}.serviceAccount`,
    expected: "string-or-object",
    apply: (value) => {
      params.target.serviceAccount = value;
    },
  });
}
function collectRuntimeConfigAssignments(params) {
  const resolved = getChannelSurface(params.config, "googlechat");
  if (!resolved) return;
  const googleChat = resolved.channel;
  const surface = resolveChannelAccountSurface(googleChat);
  const topLevelServiceAccountActive = !surface.channelEnabled
    ? false
    : !surface.hasExplicitAccounts
      ? true
      : surface.accounts.some(
          ({ account, enabled }) =>
            enabled &&
            !hasOwnProperty(account, "serviceAccount") &&
            !hasOwnProperty(account, "serviceAccountRef"),
        );
  collectGoogleChatAccountAssignment({
    target: googleChat,
    path: "channels.googlechat",
    defaults: params.defaults,
    context: params.context,
    active: topLevelServiceAccountActive,
    inactiveReason: "no enabled account inherits this top-level Google Chat serviceAccount.",
  });
  if (!surface.hasExplicitAccounts) return;
  for (const { accountId, account, enabled } of surface.accounts) {
    if (!hasOwnProperty(account, "serviceAccount") && !hasOwnProperty(account, "serviceAccountRef"))
      continue;
    collectGoogleChatAccountAssignment({
      target: account,
      path: `channels.googlechat.accounts.${accountId}`,
      defaults: params.defaults,
      context: params.context,
      active: enabled,
      inactiveReason: "Google Chat account is disabled.",
    });
  }
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
