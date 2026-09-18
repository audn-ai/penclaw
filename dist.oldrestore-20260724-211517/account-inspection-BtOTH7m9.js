import {
  i as projectSafeChannelAccountSnapshotFields,
  n as hasResolvedCredentialValue,
  t as hasConfiguredUnavailableCredentialStatus,
} from "./account-snapshot-fields-DYiq0cA9.js";
import { t as inspectReadOnlyChannelAccount } from "./read-only-account-inspect-CqkOfkZb.js";
import "./utils-DtcDeqWS.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
//#region src/channels/account-summary.ts
/**
 * Channel account summary helpers.
 *
 * Builds safe status snapshots and resolves enabled/configured account state.
 */
/**
 * Builds the safe account snapshot shown by CLI, gateway, and status summaries.
 */
function buildChannelAccountSnapshot(params) {
  const described = params.plugin.config.describeAccount?.(params.account, params.cfg);
  return {
    enabled: params.enabled,
    configured: params.configured,
    ...projectSafeChannelAccountSnapshotFields(params.account),
    ...described,
    accountId: params.accountId,
  };
}
/**
 * Formats allowFrom entries with a plugin formatter when one exists.
 */
function formatChannelAllowFrom(params) {
  if (params.plugin.config.formatAllowFrom)
    return params.plugin.config.formatAllowFrom({
      cfg: params.cfg,
      accountId: params.accountId,
      allowFrom: params.allowFrom,
    });
  return normalizeStringEntries(params.allowFrom);
}
/**
 * Resolves whether a channel account should be treated as enabled.
 */
function resolveChannelAccountEnabled(params) {
  if (params.plugin.config.isEnabled)
    return params.plugin.config.isEnabled(params.account, params.cfg);
  return (isRecord(params.account) ? params.account.enabled : void 0) !== false;
}
/**
 * Resolves whether a channel account has enough configuration to run.
 */
async function resolveChannelAccountConfigured(params) {
  if (params.plugin.config.isConfigured)
    return await params.plugin.config.isConfigured(params.account, params.cfg);
  if (params.readAccountConfiguredField)
    return (isRecord(params.account) ? params.account.configured : void 0) !== false;
  return true;
}
//#endregion
//#region src/channels/account-inspection.ts
/**
 * Inspects one channel account using the plugin hook or read-only fallback.
 */
async function inspectChannelAccount(params) {
  return (
    params.plugin.config.inspectAccount?.(params.cfg, params.accountId) ??
    (await inspectReadOnlyChannelAccount({
      channelId: params.plugin.id,
      cfg: params.cfg,
      accountId: params.accountId,
    }))
  );
}
/**
 * Resolves an inspected channel account plus enabled/configured state for status surfaces.
 */
async function resolveInspectedChannelAccount(params) {
  const sourceInspectedAccount = await inspectChannelAccount({
    plugin: params.plugin,
    cfg: params.sourceConfig,
    accountId: params.accountId,
  });
  const resolvedInspectedAccount = await inspectChannelAccount({
    plugin: params.plugin,
    cfg: params.cfg,
    accountId: params.accountId,
  });
  const resolvedInspection = resolvedInspectedAccount;
  const sourceInspection = sourceInspectedAccount;
  const resolvedAccount =
    resolvedInspectedAccount ?? params.plugin.config.resolveAccount(params.cfg, params.accountId);
  const useSourceUnavailableAccount = Boolean(
    sourceInspectedAccount &&
    hasConfiguredUnavailableCredentialStatus(sourceInspectedAccount) &&
    (!hasResolvedCredentialValue(resolvedAccount) ||
      (sourceInspection?.configured === true && resolvedInspection?.configured === false)),
  );
  const account = useSourceUnavailableAccount ? sourceInspectedAccount : resolvedAccount;
  const selectedInspection = useSourceUnavailableAccount ? sourceInspection : resolvedInspection;
  return {
    account,
    enabled:
      selectedInspection?.enabled ??
      resolveChannelAccountEnabled({
        plugin: params.plugin,
        account,
        cfg: params.cfg,
      }),
    configured:
      selectedInspection?.configured ??
      (await resolveChannelAccountConfigured({
        plugin: params.plugin,
        account,
        cfg: params.cfg,
        readAccountConfiguredField: true,
      })),
  };
}
//#endregion
export {
  resolveChannelAccountConfigured as a,
  formatChannelAllowFrom as i,
  resolveInspectedChannelAccount as n,
  resolveChannelAccountEnabled as o,
  buildChannelAccountSnapshot as r,
  inspectChannelAccount as t,
};
