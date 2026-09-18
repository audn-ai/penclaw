import {
  i as getBundledChannelSetupPlugin,
  n as getBundledChannelPlugin,
} from "./bundled-CmD3EzUu.js";
import { r as resolveReadOnlyChannelPluginsForConfig } from "./read-only-D7WTn1n5.js";
import { n as getLoadedChannelPlugin } from "./registry-mc8oBRx8.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { u as isUnresolvedSecretInputError } from "./types.secrets-BV0ywRAy.js";
//#region src/commands/doctor/shared/channel-doctor.ts
const channelDoctorFunctionKeys = /* @__PURE__ */ new Set([
  "normalizeCompatibilityConfig",
  "collectPreviewWarnings",
  "collectMutableAllowlistWarnings",
  "repairConfig",
  "runConfigSequence",
  "cleanStaleConfig",
  "collectEmptyAllowlistExtraWarnings",
  "shouldSkipDefaultEmptyGroupAllowlistWarning",
]);
const channelDoctorBooleanKeys = /* @__PURE__ */ new Set([
  "groupAllowFromFallbackToAllowFrom",
  "warnOnEmptyGroupSenderAllowlist",
]);
const channelDoctorEnumValues = {
  dmAllowFromMode: /* @__PURE__ */ new Set(["topOnly", "topOrNested", "nestedOnly"]),
  groupModel: /* @__PURE__ */ new Set(["sender", "route", "hybrid"]),
};
function collectConfiguredChannelIds(cfg) {
  if (cfg.plugins?.enabled === false) return [];
  const channels =
    cfg.channels && typeof cfg.channels === "object" && !Array.isArray(cfg.channels)
      ? cfg.channels
      : null;
  if (!channels) return [];
  const channelEntries = channels;
  return Object.keys(channels)
    .filter((channelId) => {
      if (channelId === "defaults") return false;
      if (isChannelDoctorBlockedByConfig(channelId, cfg)) return false;
      const entry = channelEntries[channelId];
      return !entry || typeof entry !== "object" || Array.isArray(entry) || entry.enabled !== false;
    })
    .toSorted();
}
function isChannelDoctorBlockedByConfig(channelId, cfg) {
  if (cfg.plugins?.enabled === false) return true;
  const normalizedChannelId = normalizeOptionalLowercaseString(channelId) ?? channelId;
  if (cfg.plugins?.entries?.[normalizedChannelId]?.enabled === false) return true;
  const channelEntry = cfg.channels?.[normalizedChannelId];
  return (
    Boolean(channelEntry && typeof channelEntry === "object" && !Array.isArray(channelEntry)) &&
    channelEntry.enabled === false
  );
}
function safeGetLoadedChannelPlugin(id) {
  try {
    return getLoadedChannelPlugin(id);
  } catch {
    return;
  }
}
function safeGetBundledChannelSetupPlugin(id) {
  try {
    return getBundledChannelSetupPlugin(id);
  } catch {
    return;
  }
}
function safeGetBundledChannelPlugin(id) {
  try {
    return getBundledChannelPlugin(id);
  } catch {
    return;
  }
}
function safeListReadOnlyChannelPlugins(context) {
  try {
    return resolveReadOnlyChannelPluginsForConfig(context.cfg, {
      ...(context.env ? { env: context.env } : {}),
      includePersistedAuthState: false,
      includeSetupFallbackPlugins: true,
    }).plugins;
  } catch {
    return [];
  }
}
function listReadOnlyChannelPluginsById(context) {
  return new Map(safeListReadOnlyChannelPlugins(context).map((plugin) => [plugin.id, plugin]));
}
function mergeDoctorAdapters(adapters) {
  const merged = {};
  for (const adapter of adapters) {
    if (!adapter) continue;
    for (const [key, value] of Object.entries(adapter)) {
      if (merged[key] !== void 0) continue;
      if (!isValidChannelDoctorAdapterValue(key, value)) continue;
      merged[key] = value;
    }
  }
  return Object.keys(merged).length > 0 ? merged : void 0;
}
function isValidChannelDoctorAdapterValue(key, value) {
  if (value == null) return false;
  if (channelDoctorFunctionKeys.has(key)) return typeof value === "function";
  if (channelDoctorBooleanKeys.has(key)) return typeof value === "boolean";
  const enumValues = channelDoctorEnumValues[key];
  if (enumValues) return typeof value === "string" && enumValues.has(value);
  if (key === "legacyConfigRules") return Array.isArray(value);
  return false;
}
function listChannelDoctorEntries(channelIds, context, options = {}) {
  if (channelIds.length === 0) return [];
  const selectedIds = new Set(
    channelIds.filter((id) => !isChannelDoctorBlockedByConfig(id, context.cfg)),
  );
  if (selectedIds.size === 0) return [];
  const readOnlyPluginsById =
    options.readOnlyPluginsById ?? listReadOnlyChannelPluginsById(context);
  const entries = [];
  for (const id of selectedIds) {
    const doctor = mergeDoctorAdapters([
      readOnlyPluginsById.get(id)?.doctor,
      safeGetLoadedChannelPlugin(id)?.doctor,
      safeGetBundledChannelSetupPlugin(id)?.doctor,
      safeGetBundledChannelPlugin(id)?.doctor,
    ]);
    if (!doctor) continue;
    entries.push({
      id,
      doctor,
    });
  }
  return entries;
}
function toPluginEmptyAllowlistContext({ cfg: _cfg, ...params }) {
  return params;
}
function collectEmptyAllowlistExtraWarningsForEntries(entries, params) {
  const warnings = [];
  const pluginParams = toPluginEmptyAllowlistContext(params);
  for (const entry of entries) {
    const lines = entry.doctor.collectEmptyAllowlistExtraWarnings?.(pluginParams);
    if (lines?.length) warnings.push(...lines);
  }
  return warnings;
}
function shouldSkipDefaultEmptyGroupAllowlistWarningForEntries(entries, params) {
  const pluginParams = toPluginEmptyAllowlistContext(params);
  return entries.some(
    (entry) => entry.doctor.shouldSkipDefaultEmptyGroupAllowlistWarning?.(pluginParams) === true,
  );
}
/** Build cached empty-allowlist hooks backed by channel doctor adapters. */
function createChannelDoctorEmptyAllowlistPolicyHooks(context) {
  const readOnlyPluginsById = listReadOnlyChannelPluginsById(context);
  const entriesByChannel = /* @__PURE__ */ new Map();
  const entriesForChannel = (channelName) => {
    const existing = entriesByChannel.get(channelName);
    if (existing) return existing;
    const entries = listChannelDoctorEntries([channelName], context, { readOnlyPluginsById });
    entriesByChannel.set(channelName, entries);
    return entries;
  };
  return {
    extraWarningsForAccount: (params) =>
      collectEmptyAllowlistExtraWarningsForEntries(entriesForChannel(params.channelName), params),
    shouldSkipDefaultEmptyGroupAllowlistWarning: (params) =>
      shouldSkipDefaultEmptyGroupAllowlistWarningForEntries(
        entriesForChannel(params.channelName),
        params,
      ),
  };
}
/** Run interactive/non-interactive channel setup repair sequences and collect notes. */
async function runChannelDoctorConfigSequences(params) {
  const changeNotes = [];
  const warningNotes = [];
  for (const entry of listChannelDoctorEntries(collectConfiguredChannelIds(params.cfg), {
    cfg: params.cfg,
    env: params.env,
  })) {
    const result = await entry.doctor.runConfigSequence?.(params);
    if (!result) continue;
    changeNotes.push(...result.changeNotes);
    warningNotes.push(...result.warningNotes);
  }
  return {
    changeNotes,
    warningNotes,
  };
}
/** Collect compatibility migrations from configured channel doctor adapters in order. */
function collectChannelDoctorCompatibilityMutations(cfg, options = {}) {
  const channelIds = collectConfiguredChannelIds(cfg);
  if (channelIds.length === 0) return [];
  const mutations = [];
  let nextCfg = cfg;
  for (const entry of listChannelDoctorEntries(channelIds, {
    cfg,
    env: options.env,
  })) {
    const mutation = entry.doctor.normalizeCompatibilityConfig?.({ cfg: nextCfg });
    if (!mutation || mutation.changes.length === 0) continue;
    mutations.push(mutation);
    nextCfg = mutation.config;
  }
  return mutations;
}
/** Collect stale channel config cleanup mutations from configured channel doctor adapters. */
async function collectChannelDoctorStaleConfigMutations(cfg, options = {}) {
  const mutations = [];
  let nextCfg = cfg;
  const channelIds = options.channelIds ?? collectConfiguredChannelIds(cfg);
  for (const entry of listChannelDoctorEntries(channelIds, {
    cfg,
    env: options.env,
  })) {
    const mutation = await entry.doctor.cleanStaleConfig?.({ cfg: nextCfg });
    if (!mutation || mutation.changes.length === 0) continue;
    mutations.push(mutation);
    nextCfg = mutation.config;
  }
  return mutations;
}
/** Collect channel-specific doctor preview warnings for configured channels. */
async function collectChannelDoctorPreviewWarnings(params) {
  const warnings = [];
  for (const entry of listChannelDoctorEntries(collectConfiguredChannelIds(params.cfg), {
    cfg: params.cfg,
    env: params.env,
  })) {
    let lines;
    try {
      lines = await entry.doctor.collectPreviewWarnings?.(params);
    } catch (error) {
      if (!isUnresolvedSecretInputError(error)) throw error;
      warnings.push(
        `- channels.${entry.id}: configured SecretRef at ${error.path} is unavailable in doctor preview; skipping secret-backed channel preview checks.`,
      );
      continue;
    }
    if (lines?.length) warnings.push(...lines);
  }
  return warnings;
}
/** Collect warnings for mutable channel allowlists that doctor cannot safely edit. */
async function collectChannelDoctorMutableAllowlistWarnings(params) {
  const warnings = [];
  for (const entry of listChannelDoctorEntries(collectConfiguredChannelIds(params.cfg), {
    cfg: params.cfg,
    env: params.env,
  })) {
    const lines = await entry.doctor.collectMutableAllowlistWarnings?.(params);
    if (lines?.length) warnings.push(...lines);
  }
  return warnings;
}
/** Collect channel repair mutations and warning-only repair results from doctor adapters. */
async function collectChannelDoctorRepairMutations(params) {
  const mutations = [];
  let nextCfg = params.cfg;
  for (const entry of listChannelDoctorEntries(collectConfiguredChannelIds(params.cfg), {
    cfg: params.cfg,
    env: params.env,
  })) {
    const mutation = await entry.doctor.repairConfig?.({
      cfg: nextCfg,
      doctorFixCommand: params.doctorFixCommand,
      ...(params.env ? { env: params.env } : {}),
    });
    if (!mutation || mutation.changes.length === 0) {
      if (mutation?.warnings?.length)
        mutations.push({
          config: nextCfg,
          changes: [],
          warnings: mutation.warnings,
        });
      continue;
    }
    mutations.push(mutation);
    nextCfg = mutation.config;
  }
  return mutations;
}
/** Collect plugin-provided empty allowlist warning lines for one channel/account context. */
function collectChannelDoctorEmptyAllowlistExtraWarnings(params) {
  return collectEmptyAllowlistExtraWarningsForEntries(
    listChannelDoctorEntries([params.channelName], { cfg: params.cfg ?? {} }),
    params,
  );
}
/** Return true when a channel doctor owns empty group-allowlist warning behavior. */
function shouldSkipChannelDoctorDefaultEmptyGroupAllowlistWarning(params) {
  return shouldSkipDefaultEmptyGroupAllowlistWarningForEntries(
    listChannelDoctorEntries([params.channelName], { cfg: params.cfg ?? {} }),
    params,
  );
}
//#endregion
export {
  collectChannelDoctorRepairMutations as a,
  runChannelDoctorConfigSequences as c,
  collectChannelDoctorPreviewWarnings as i,
  shouldSkipChannelDoctorDefaultEmptyGroupAllowlistWarning as l,
  collectChannelDoctorEmptyAllowlistExtraWarnings as n,
  collectChannelDoctorStaleConfigMutations as o,
  collectChannelDoctorMutableAllowlistWarnings as r,
  createChannelDoctorEmptyAllowlistPolicyHooks as s,
  collectChannelDoctorCompatibilityMutations as t,
};
