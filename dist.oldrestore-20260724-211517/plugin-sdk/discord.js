import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "../account-id-C7N4Rwku.js";
import {
  a as resolveConfiguredFromCredentialStatuses,
  r as projectCredentialSnapshotFields,
} from "../account-snapshot-fields-DYiq0cA9.js";
import { n as getChatChannelMeta } from "../chat-meta-B_W7YKQn.js";
import { r as emptyPluginConfigSchema } from "../config-schema-D48VtTjI.js";
import { r as buildChannelConfigSchema } from "../config-schema-qmCQZl6j.js";
import {
  r as loadBundledPluginPublicSurfaceModuleSync,
  t as createLazyFacadeObjectValue,
} from "../facade-loader-KNgtRNDP.js";
import "../runtime-config-snapshot-hRn3WGyJ.js";
import { i as getRuntimeConfig } from "../io-B3ne6NxF.js";
import { t as PAIRING_APPROVED_MESSAGE } from "../pairing-message-DNhqI-OE.js";
import { i as getRuntimeConfigSnapshot } from "../runtime-snapshot-BbbqRiDR.js";
import {
  s as migrateBaseNameToDefaultAccount,
  t as applyAccountNameToChannelSection,
} from "../setup-helpers-Dl0hnWtQ.js";
import "../channel-plugin-common-BUOWmTDS.js";
import {
  o as buildTokenChannelStatusSummary,
  r as buildComputedAccountStatusSnapshot,
} from "../status-helpers-SdoCNDDu.js";
import "../channel-status-B8fwcUOI.js";
import { t as DiscordConfigSchema } from "../zod-schema.providers-core-BNKhRce5.js";
//#region src/plugin-sdk/discord.ts
function loadDiscordApiFacadeModule() {
  return loadBundledPluginPublicSurfaceModuleSync({
    dirName: "discord",
    artifactBasename: "api.js",
  });
}
function loadDiscordRuntimeFacadeModule() {
  return loadBundledPluginPublicSurfaceModuleSync({
    dirName: "discord",
    artifactBasename: "runtime-api.js",
  });
}
function resolveCompatRuntimeConfig(params) {
  return params.cfg ?? getRuntimeConfigSnapshot() ?? getRuntimeConfig();
}
/** Lazy Discord setup adapter retained for deprecated subpath compatibility. */
const discordOnboardingAdapter = createLazyFacadeObjectValue(
  () => loadDiscordApiFacadeModule().discordOnboardingAdapter ?? {},
);
/** Collect Discord account status issues from account snapshots. */
function collectDiscordStatusIssues(accounts) {
  return loadDiscordApiFacadeModule().collectDiscordStatusIssues(accounts);
}
/** Build Discord component payloads without sending them. */
const buildDiscordComponentMessage = (...args) =>
  loadDiscordApiFacadeModule().buildDiscordComponentMessage(...args);
/** Inspect one configured Discord account for setup/status output. */
function inspectDiscordAccount(params) {
  return loadDiscordApiFacadeModule().inspectDiscordAccount(params);
}
/** List configured Discord account ids from OpenClaw config. */
function listDiscordAccountIds(cfg) {
  return loadDiscordApiFacadeModule().listDiscordAccountIds(cfg);
}
/** List Discord directory group records from static config. */
function listDiscordDirectoryGroupsFromConfig(params) {
  return loadDiscordApiFacadeModule().listDiscordDirectoryGroupsFromConfig(params);
}
/** List Discord directory peer records from static config. */
function listDiscordDirectoryPeersFromConfig(params) {
  return loadDiscordApiFacadeModule().listDiscordDirectoryPeersFromConfig(params);
}
/** Check whether a raw value has Discord target-id shape. */
function looksLikeDiscordTargetId(raw) {
  return loadDiscordApiFacadeModule().looksLikeDiscordTargetId(raw);
}
/** Normalize a Discord messaging target for send helpers. */
function normalizeDiscordMessagingTarget(raw) {
  return loadDiscordApiFacadeModule().normalizeDiscordMessagingTarget(raw);
}
/** Normalize a Discord outbound target and return a typed error on failure. */
function normalizeDiscordOutboundTarget(to) {
  return loadDiscordApiFacadeModule().normalizeDiscordOutboundTarget(to);
}
/** Resolve the default Discord account id from config. */
function resolveDefaultDiscordAccountId(cfg) {
  return loadDiscordApiFacadeModule().resolveDefaultDiscordAccountId(cfg);
}
/** Resolve a Discord account config plus token source for runtime use. */
function resolveDiscordAccount(params) {
  return loadDiscordApiFacadeModule().resolveDiscordAccount(params);
}
/** Resolve group mention policy for a Discord channel context. */
function resolveDiscordGroupRequireMention(params) {
  return loadDiscordApiFacadeModule().resolveDiscordGroupRequireMention(params);
}
/** Resolve group tool policy for a Discord channel context. */
function resolveDiscordGroupToolPolicy(params) {
  return loadDiscordApiFacadeModule().resolveDiscordGroupToolPolicy(params);
}
/** Collect configured Discord audit channel ids for runtime status checks. */
function collectDiscordAuditChannelIds(params) {
  return loadDiscordRuntimeFacadeModule().collectDiscordAuditChannelIds(params);
}
/** Edit an already-sent Discord component message. */
const editDiscordComponentMessage = (...args) =>
  loadDiscordRuntimeFacadeModule().editDiscordComponentMessage(...args);
/** Register a built component message after Discord assigns its message id. */
const registerBuiltDiscordComponentMessage = (...args) =>
  loadDiscordRuntimeFacadeModule().registerBuiltDiscordComponentMessage(...args);
/** Bind a spawned subagent session to the current Discord thread when possible. */
async function autoBindSpawnedDiscordSubagent(params) {
  return await loadDiscordRuntimeFacadeModule().autoBindSpawnedDiscordSubagent({
    ...params,
    cfg: resolveCompatRuntimeConfig(params),
  });
}
/** List Discord thread bindings for a target session key. */
function listThreadBindingsBySessionKey(params) {
  return loadDiscordRuntimeFacadeModule().listThreadBindingsBySessionKey(params);
}
/** Remove Discord thread bindings for a target session key. */
function unbindThreadBindingsBySessionKey(params) {
  return loadDiscordRuntimeFacadeModule().unbindThreadBindingsBySessionKey(params);
}
//#endregion
export {
  DEFAULT_ACCOUNT_ID,
  DiscordConfigSchema,
  PAIRING_APPROVED_MESSAGE,
  applyAccountNameToChannelSection,
  autoBindSpawnedDiscordSubagent,
  buildChannelConfigSchema,
  buildComputedAccountStatusSnapshot,
  buildDiscordComponentMessage,
  buildTokenChannelStatusSummary,
  collectDiscordAuditChannelIds,
  collectDiscordStatusIssues,
  discordOnboardingAdapter,
  editDiscordComponentMessage,
  emptyPluginConfigSchema,
  getChatChannelMeta,
  inspectDiscordAccount,
  listDiscordAccountIds,
  listDiscordDirectoryGroupsFromConfig,
  listDiscordDirectoryPeersFromConfig,
  listThreadBindingsBySessionKey,
  looksLikeDiscordTargetId,
  migrateBaseNameToDefaultAccount,
  normalizeAccountId,
  normalizeDiscordMessagingTarget,
  normalizeDiscordOutboundTarget,
  projectCredentialSnapshotFields,
  registerBuiltDiscordComponentMessage,
  resolveConfiguredFromCredentialStatuses,
  resolveDefaultDiscordAccountId,
  resolveDiscordAccount,
  resolveDiscordGroupRequireMention,
  resolveDiscordGroupToolPolicy,
  unbindThreadBindingsBySessionKey,
};
