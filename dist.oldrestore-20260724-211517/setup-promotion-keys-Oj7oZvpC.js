//#region src/channels/plugins/setup-promotion-keys.ts
/**
 * Common root-level channel config keys safe to promote into a single account.
 */
const COMMON_SINGLE_ACCOUNT_PROMOTION_KEYS = [
  "name",
  "token",
  "tokenFile",
  "botToken",
  "appToken",
  "account",
  "signalNumber",
  "authDir",
  "cliPath",
  "dbPath",
  "httpUrl",
  "httpHost",
  "httpPort",
  "webhookPath",
  "webhookUrl",
  "webhookSecret",
  "service",
  "region",
  "homeserver",
  "userId",
  "accessToken",
  "password",
  "deviceName",
  "url",
  "code",
  "dmPolicy",
  "allowFrom",
  "groupPolicy",
  "groupAllowFrom",
  "defaultTo",
];
/**
 * Setup-only config keys that can move during single-account migration.
 */
const SETUP_SINGLE_ACCOUNT_PROMOTION_KEYS = [
  ...COMMON_SINGLE_ACCOUNT_PROMOTION_KEYS,
  "streaming",
  "deviceId",
  "avatarUrl",
  "initialSyncLimit",
  "encryption",
  "allowlistOnly",
  "allowBots",
  "blockStreaming",
  "replyToMode",
  "threadReplies",
  "textChunkLimit",
  "chunkMode",
  "responsePrefix",
  "ackReaction",
  "ackReactionScope",
  "reactionNotifications",
  "threadBindings",
  "startupVerification",
  "startupVerificationCooldownHours",
  "mediaMaxMb",
  "autoJoin",
  "autoJoinAllowlist",
  "dm",
  "groups",
  "rooms",
  "actions",
];
const commonSingleAccountPromotionKeys = new Set(COMMON_SINGLE_ACCOUNT_PROMOTION_KEYS);
const setupSingleAccountPromotionKeys = new Set(SETUP_SINGLE_ACCOUNT_PROMOTION_KEYS);
/**
 * Returns whether a config key is part of the channel-agnostic promotion set.
 */
function isCommonSingleAccountPromotionKey(key) {
  return commonSingleAccountPromotionKeys.has(key);
}
/**
 * Returns whether a config key can be promoted by setup migration flows.
 */
function isSetupSingleAccountPromotionKey(key) {
  return setupSingleAccountPromotionKeys.has(key);
}
/**
 * Lists root-level channel keys that could be promoted into account config.
 */
function collectSingleAccountPromotionEntries(channel) {
  const hasNamedAccounts = Object.keys(channel.accounts ?? {}).some(Boolean);
  return {
    entries: Object.entries(channel)
      .filter(
        ([key, value]) =>
          key !== "accounts" && key !== "defaultAccount" && key !== "enabled" && value !== void 0,
      )
      .map(([key]) => key),
    hasNamedAccounts,
  };
}
//#endregion
export {
  isCommonSingleAccountPromotionKey as n,
  isSetupSingleAccountPromotionKey as r,
  collectSingleAccountPromotionEntries as t,
};
