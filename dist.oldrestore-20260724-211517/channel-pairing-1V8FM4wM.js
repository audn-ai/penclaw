import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import "./pairing-store-C4j5pnVS.js";
import { t as issuePairingChallenge } from "./pairing-challenge-Jv_G6M94.js";
//#region src/channels/plugins/pairing-adapters.ts
/**
 * Creates an allowlist normalizer that strips a channel-specific target prefix.
 */
function createPairingPrefixStripper(prefixRe, map = (entry) => entry) {
  return (entry) => map(entry.trim().replace(prefixRe, "").trim());
}
/**
 * Creates a pairing notifier that logs a formatted approval message.
 */
function createLoggedPairingApprovalNotifier(format, log = console.log) {
  return async (params) => {
    log(typeof format === "function" ? format(params) : format);
  };
}
/**
 * Creates a text-message pairing adapter with optional allowlist normalization.
 */
function createTextPairingAdapter(params) {
  return {
    idLabel: params.idLabel,
    normalizeAllowEntry: params.normalizeAllowEntry,
    notifyApproval: async (ctx) => {
      await params.notify({
        ...ctx,
        message: params.message,
      });
    },
  };
}
//#endregion
//#region src/plugin-sdk/pairing-access.ts
/** Scope pairing store operations to one channel/account pair for plugin-facing helpers. */
function createScopedPairingAccess(params) {
  const resolvedAccountId = normalizeAccountId(params.accountId);
  return {
    /** Normalized account id used by every channel-scoped pairing store operation. */
    accountId: resolvedAccountId,
    /** Read allow-list entries for the scoped channel/account pair. */
    readAllowFromStore: () =>
      params.core.channel.pairing.readAllowFromStore({
        channel: params.channel,
        accountId: resolvedAccountId,
      }),
    /** Read another channel/account allow-list for DM policy cross-checks. */
    readStoreForDmPolicy: (provider, accountId) =>
      params.core.channel.pairing.readAllowFromStore({
        channel: provider,
        accountId: normalizeAccountId(accountId),
      }),
    /** Upsert a pairing request with the scoped channel/account injected. */
    upsertPairingRequest: (input) =>
      params.core.channel.pairing.upsertPairingRequest({
        channel: params.channel,
        accountId: resolvedAccountId,
        ...input,
      }),
  };
}
//#endregion
//#region src/plugin-sdk/channel-pairing.ts
/** Pre-bind the channel id and storage sink for pairing challenges. */
function createChannelPairingChallengeIssuer(params) {
  return (challenge) =>
    issuePairingChallenge({
      channel: params.channel,
      accountId: params.accountId,
      upsertPairingRequest: params.upsertPairingRequest,
      ...challenge,
    });
}
/** Build the full scoped pairing controller used by channel runtime code. */
function createChannelPairingController(params) {
  const access = createScopedPairingAccess(params);
  return {
    ...access,
    issueChallenge: createChannelPairingChallengeIssuer({
      channel: params.channel,
      accountId: access.accountId,
      upsertPairingRequest: access.upsertPairingRequest,
    }),
  };
}
//#endregion
export {
  createTextPairingAdapter as a,
  createPairingPrefixStripper as i,
  createChannelPairingController as n,
  createLoggedPairingApprovalNotifier as r,
  createChannelPairingChallengeIssuer as t,
};
