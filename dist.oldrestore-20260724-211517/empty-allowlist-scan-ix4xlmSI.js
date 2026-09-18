import {
  n as resolveDoctorChannelAccountIds,
  t as getDoctorChannelCapabilities,
} from "./channel-capabilities-BvmgQW8G.js";
import { l as shouldSkipChannelDoctorDefaultEmptyGroupAllowlistWarning } from "./channel-doctor-BJ8ML7ml.js";
import { t as asObjectRecord } from "./object-BsiS9JXh.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
//#region src/commands/doctor/shared/allowlist.ts
/** Return true when an allowFrom-like list has at least one normalized sender entry. */
function hasAllowFromEntries(list) {
  return Array.isArray(list) && normalizeStringEntries(list).length > 0;
}
//#endregion
//#region src/commands/doctor/shared/empty-allowlist-policy.ts
function usesSenderBasedGroupAllowlist(channelName) {
  return getDoctorChannelCapabilities(channelName).warnOnEmptyGroupSenderAllowlist;
}
function allowsGroupAllowFromFallback(channelName) {
  return getDoctorChannelCapabilities(channelName).groupAllowFromFallbackToAllowFrom;
}
/** Collect DM/group allowlist warnings for one channel or account config record. */
function collectEmptyAllowlistPolicyWarningsForAccount(params) {
  const warnings = [];
  const dmEntry = params.account.dm;
  const dm = dmEntry && typeof dmEntry === "object" && !Array.isArray(dmEntry) ? dmEntry : void 0;
  const parentDmEntry = params.parent?.dm;
  const parentDm =
    parentDmEntry && typeof parentDmEntry === "object" && !Array.isArray(parentDmEntry)
      ? parentDmEntry
      : void 0;
  const dmPolicy =
    params.account.dmPolicy ?? dm?.policy ?? params.parent?.dmPolicy ?? parentDm?.policy ?? void 0;
  const topAllowFrom = params.account.allowFrom ?? params.parent?.allowFrom;
  const nestedAllowFrom = dm?.allowFrom;
  const parentNestedAllowFrom = parentDm?.allowFrom;
  const effectiveAllowFrom = topAllowFrom ?? nestedAllowFrom ?? parentNestedAllowFrom;
  if (dmPolicy === "allowlist" && !hasAllowFromEntries(effectiveAllowFrom))
    warnings.push(
      `- ${params.prefix}.dmPolicy is "allowlist" but allowFrom is empty — all DMs will be blocked. Add sender IDs to ${params.prefix}.allowFrom, or run "${params.doctorFixCommand}" to auto-migrate from pairing store when entries exist.`,
    );
  if (
    (params.account.groupPolicy ?? params.parent?.groupPolicy ?? void 0) !== "allowlist" ||
    !usesSenderBasedGroupAllowlist(params.channelName)
  )
    return warnings;
  if (
    params.channelName &&
    (
      params.shouldSkipDefaultEmptyGroupAllowlistWarning ??
      shouldSkipChannelDoctorDefaultEmptyGroupAllowlistWarning
    )({
      account: params.account,
      channelName: params.channelName,
      cfg: params.cfg,
      dmPolicy,
      effectiveAllowFrom,
      parent: params.parent,
      prefix: params.prefix,
    })
  )
    return warnings;
  const rawGroupAllowFrom = params.account.groupAllowFrom ?? params.parent?.groupAllowFrom;
  const groupAllowFrom = hasAllowFromEntries(rawGroupAllowFrom) ? rawGroupAllowFrom : void 0;
  const fallbackToAllowFrom = allowsGroupAllowFromFallback(params.channelName);
  if (hasAllowFromEntries(groupAllowFrom ?? (fallbackToAllowFrom ? effectiveAllowFrom : void 0)))
    return warnings;
  if (fallbackToAllowFrom)
    warnings.push(
      `- ${params.prefix}.groupPolicy is "allowlist" but groupAllowFrom (and allowFrom) is empty — all group messages will be silently dropped. Add sender IDs to ${params.prefix}.groupAllowFrom or ${params.prefix}.allowFrom, or set groupPolicy to "open".`,
    );
  else
    warnings.push(
      `- ${params.prefix}.groupPolicy is "allowlist" but groupAllowFrom is empty — this channel does not fall back to allowFrom, so all group messages will be silently dropped. Add sender IDs to ${params.prefix}.groupAllowFrom, or set groupPolicy to "open".`,
    );
  return warnings;
}
//#endregion
//#region src/commands/doctor/shared/empty-allowlist-scan.ts
function isDisabledRecord(value) {
  return (
    Boolean(value && typeof value === "object" && !Array.isArray(value)) && value.enabled === false
  );
}
/** Scan all configured channels/accounts for empty allowlist policy warnings. */
function scanEmptyAllowlistPolicyWarnings(cfg, params) {
  const channels = cfg.channels;
  if (!channels || typeof channels !== "object") return [];
  const warnings = [];
  const checkAccount = (account, prefix, channelName, parent, options = {}) => {
    const accountDm = asObjectRecord(account.dm);
    const parentDm = asObjectRecord(parent?.dm);
    const dmPolicy =
      account.dmPolicy ?? accountDm?.policy ?? parent?.dmPolicy ?? parentDm?.policy ?? void 0;
    const effectiveAllowFrom =
      account.allowFrom ??
      parent?.allowFrom ??
      accountDm?.allowFrom ??
      parentDm?.allowFrom ??
      void 0;
    warnings.push(
      ...collectEmptyAllowlistPolicyWarningsForAccount({
        account,
        channelName,
        cfg,
        doctorFixCommand: params.doctorFixCommand,
        parent,
        prefix,
        shouldSkipDefaultEmptyGroupAllowlistWarning: (context) =>
          options.suppressGroupAllowlistWarning ||
          Boolean(params.shouldSkipDefaultEmptyGroupAllowlistWarning?.(context)),
      }),
    );
    if (params.extraWarningsForAccount)
      warnings.push(
        ...params.extraWarningsForAccount({
          account,
          channelName,
          dmPolicy,
          effectiveAllowFrom,
          parent,
          prefix,
        }),
      );
  };
  for (const [channelName, channelConfig] of Object.entries(channels)) {
    if (!channelConfig || typeof channelConfig !== "object") continue;
    if (isDisabledRecord(channelConfig)) continue;
    const accounts = asObjectRecord(channelConfig.accounts);
    const activeAccounts = accounts
      ? Object.values(accounts).filter((account) =>
          Boolean(account && typeof account === "object" && !isDisabledRecord(account)),
        )
      : [];
    const accountIds = resolveDoctorChannelAccountIds(
      channelName,
      cfg,
      Object.keys(accounts ?? {}),
    );
    const configuredAccountIds = new Set(accountIds?.configured);
    const hasImplicitActiveAccount =
      accountIds === void 0 ||
      accountIds.runtime.some((accountId) => !configuredAccountIds.has(accountId));
    const suppressParentGroupAllowlistWarning =
      activeAccounts.length > 0 &&
      !hasImplicitActiveAccount &&
      channelConfig.groupPolicy === "allowlist" &&
      activeAccounts.every((account) => {
        const rawGroupAllowFrom = account.groupAllowFrom ?? channelConfig.groupAllowFrom;
        if (
          hasAllowFromEntries(hasAllowFromEntries(rawGroupAllowFrom) ? rawGroupAllowFrom : void 0)
        )
          return true;
        if (!getDoctorChannelCapabilities(channelName).groupAllowFromFallbackToAllowFrom)
          return false;
        const accountDm = asObjectRecord(account.dm);
        const parentDm = asObjectRecord(channelConfig.dm);
        return hasAllowFromEntries(
          account.allowFrom ??
            channelConfig.allowFrom ??
            accountDm?.allowFrom ??
            parentDm?.allowFrom ??
            void 0,
        );
      });
    checkAccount(channelConfig, `channels.${channelName}`, channelName, void 0, {
      suppressGroupAllowlistWarning: suppressParentGroupAllowlistWarning,
    });
    if (!accounts) continue;
    for (const [accountId, account] of Object.entries(accounts)) {
      if (!account || typeof account !== "object") continue;
      if (isDisabledRecord(account)) continue;
      checkAccount(
        account,
        `channels.${channelName}.accounts.${accountId}`,
        channelName,
        channelConfig,
      );
    }
  }
  return warnings;
}
//#endregion
export { hasAllowFromEntries as n, scanEmptyAllowlistPolicyWarnings as t };
