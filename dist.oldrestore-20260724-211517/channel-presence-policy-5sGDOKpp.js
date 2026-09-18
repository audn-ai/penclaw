import { n as resolveManifestActivationPluginIds } from "./activation-planner-CPU1RoZb.js";
import {
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import {
  i as listPotentialConfiguredChannelPresenceSignals,
  n as listExplicitlyDisabledChannelIdsForConfig,
  t as hasMeaningfulChannelConfig,
} from "./config-presence-dDm96tuW.js";
import {
  c as normalizePluginsConfig,
  n as createPluginActivationSource,
  u as resolveEffectivePluginActivationState,
} from "./config-state-C1Qyxaws.js";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.js";
import "./agent-scope-y9xQv_q1.js";
import {
  a as resolveManifestOwnerBasePolicyBlock,
  i as passesManifestOwnerBasePolicy,
  n as isActivatedManifestOwner,
  r as isBundledManifestOwner,
  t as hasExplicitManifestOwnerTrust,
} from "./manifest-owner-policy-Bl1TJHcS.js";
import { n as loadPluginManifestRegistryForPluginRegistry } from "./plugin-registry-BckMdz4f.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { g as sortUniqueStrings } from "./string-normalization-CRyoFBPt.js";
//#region src/secrets/channel-env-var-names.ts
/** Ambient process env names that are too common to imply channel configuration. */
const UNSAFE_CHANNEL_ENV_VAR_TRIGGER_NAMES = /* @__PURE__ */ new Set([
  "CI",
  "HOME",
  "LANG",
  "LC_ALL",
  "LC_CTYPE",
  "LOGNAME",
  "NODE_ENV",
  "OLDPWD",
  "PATH",
  "PWD",
  "SHELL",
  "SSH_AUTH_SOCK",
  "TEMP",
  "TERM",
  "TMP",
  "TMPDIR",
  "USER",
]);
/**
 * Returns whether a channel env var name is safe to treat as a credential/config trigger.
 */
function isSafeChannelEnvVarTriggerName(key) {
  const normalized = key.trim().toUpperCase();
  return (
    /^[A-Z][A-Z0-9_]*$/.test(normalized) && !UNSAFE_CHANNEL_ENV_VAR_TRIGGER_NAMES.has(normalized)
  );
}
//#endregion
//#region src/plugins/channel-presence-policy.ts
const IGNORED_CHANNEL_CONFIG_KEYS = /* @__PURE__ */ new Set(["defaults", "modelByChannel"]);
const ANNOUNCE_SUPPRESSING_BLOCKED_REASONS = /* @__PURE__ */ new Set([
  "plugins-disabled",
  "blocked-by-denylist",
  "plugin-disabled",
]);
function normalizeChannelIds(channelIds) {
  return sortUniqueStrings(
    [...channelIds].flatMap((channelId) => {
      const normalized = normalizeOptionalLowercaseString(channelId);
      return normalized ? [normalized] : [];
    }),
  );
}
function hasNonEmptyEnvValue(env, key) {
  if (!isSafeChannelEnvVarTriggerName(key)) return false;
  const trimmed = key.trim();
  const value = env[trimmed] ?? env[trimmed.toUpperCase()];
  return typeof value === "string" && value.trim().length > 0;
}
/** True when config contains meaningful enabled channel settings. */
function hasExplicitChannelConfig(params) {
  const channels = params.config.channels;
  if (!channels || typeof channels !== "object" || Array.isArray(channels)) return false;
  const entry = channels[params.channelId];
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) return false;
  const enabled = entry.enabled;
  if (enabled === false) return false;
  return enabled === true || hasMeaningfulChannelConfig(entry);
}
/** Lists explicitly configured channel ids, excluding global channel config keys. */
function listExplicitConfiguredChannelIdsForConfig(config) {
  const channels = config.channels;
  if (!channels || typeof channels !== "object" || Array.isArray(channels)) return [];
  return Object.keys(channels)
    .filter(
      (channelId) =>
        !IGNORED_CHANNEL_CONFIG_KEYS.has(channelId) &&
        hasExplicitChannelConfig({
          config,
          channelId,
        }),
    )
    .toSorted((left, right) => left.localeCompare(right));
}
function recordDeclaresChannel(record, channelId) {
  const normalizedChannelId = normalizeOptionalLowercaseString(channelId) ?? "";
  if (!normalizedChannelId) return false;
  return record.channels.some(
    (ownedChannelId) =>
      (normalizeOptionalLowercaseString(ownedChannelId) ?? "") === normalizedChannelId,
  );
}
function listManifestEnvConfiguredChannelSignals(params) {
  const signals = [];
  const seen = /* @__PURE__ */ new Set();
  const trustConfig = params.activationSourceConfig ?? params.config;
  const normalizedConfig = normalizePluginsConfig(trustConfig.plugins);
  for (const record of params.records) {
    if (
      !isChannelPluginEligibleForScopedOwnership({
        plugin: record,
        normalizedConfig,
        rootConfig: trustConfig,
      })
    )
      continue;
    for (const channelId of record.channels) {
      if (
        !(record.channelEnvVars?.[channelId] ?? []).some((envVar) =>
          hasNonEmptyEnvValue(params.env, envVar),
        )
      )
        continue;
      if (seen.has(channelId)) continue;
      seen.add(channelId);
      signals.push({
        channelId,
        source: "manifest-env",
      });
    }
  }
  return signals.toSorted((left, right) => left.channelId.localeCompare(right.channelId));
}
function normalizeActivationBlockedReason(reason) {
  switch (reason) {
    case "plugins disabled":
      return "plugins-disabled";
    case "blocked by denylist":
      return "blocked-by-denylist";
    case "disabled in config":
      return "plugin-disabled";
    case "not in allowlist":
      return "not-in-allowlist";
    case "workspace plugin (disabled by default)":
      return "workspace-disabled-by-default";
    case "bundled (disabled by default)":
      return "bundled-disabled-by-default";
    default:
      return "not-activated";
  }
}
function resolveBasePolicyBlockedReason(params) {
  return resolveManifestOwnerBasePolicyBlock(params);
}
function isChannelPluginEligibleForScopedOwnership(params) {
  const allowRestrictiveAllowlistBypass =
    params.channelId !== void 0 &&
    isBundledManifestOwner(params.plugin) &&
    hasExplicitChannelConfig({
      config: params.rootConfig,
      channelId: params.channelId,
    });
  if (
    !passesManifestOwnerBasePolicy({
      plugin: params.plugin,
      normalizedConfig: params.normalizedConfig,
      allowRestrictiveAllowlistBypass,
    })
  )
    return false;
  if (isBundledManifestOwner(params.plugin)) return true;
  if (params.plugin.origin === "global" || params.plugin.origin === "config")
    return hasExplicitManifestOwnerTrust({
      plugin: params.plugin,
      normalizedConfig: params.normalizedConfig,
    });
  return isActivatedManifestOwner({
    plugin: params.plugin,
    normalizedConfig: params.normalizedConfig,
    rootConfig: params.rootConfig,
  });
}
function evaluateEffectiveChannelPlugin(params) {
  const explicitBundledChannelConfig =
    isBundledManifestOwner(params.plugin) &&
    hasExplicitChannelConfig({
      config: params.activationSource.rootConfig ?? params.config,
      channelId: params.channelId,
    });
  const baseBlockedReason = resolveBasePolicyBlockedReason({
    plugin: params.plugin,
    normalizedConfig: params.normalizedConfig,
    allowRestrictiveAllowlistBypass: explicitBundledChannelConfig,
  });
  if (baseBlockedReason)
    return {
      effective: false,
      pluginId: params.plugin.id,
      blockedReason: baseBlockedReason,
    };
  if (!isBundledManifestOwner(params.plugin)) {
    if (params.plugin.origin === "global" || params.plugin.origin === "config")
      return hasExplicitManifestOwnerTrust({
        plugin: params.plugin,
        normalizedConfig: params.normalizedConfig,
      })
        ? {
            effective: true,
            pluginId: params.plugin.id,
          }
        : {
            effective: false,
            pluginId: params.plugin.id,
            blockedReason: "untrusted-plugin",
          };
    return isActivatedManifestOwner({
      plugin: params.plugin,
      normalizedConfig: params.normalizedConfig,
      rootConfig: params.activationSource.rootConfig,
    })
      ? {
          effective: true,
          pluginId: params.plugin.id,
        }
      : {
          effective: false,
          pluginId: params.plugin.id,
          blockedReason: "untrusted-plugin",
        };
  }
  if (explicitBundledChannelConfig)
    return {
      effective: true,
      pluginId: params.plugin.id,
    };
  const activationState = resolveEffectivePluginActivationState({
    id: params.plugin.id,
    origin: params.plugin.origin,
    config: params.normalizedConfig,
    rootConfig: params.config,
    enabledByDefault: isPluginEnabledByDefaultForPlatform(params.plugin),
    activationSource: params.activationSource,
  });
  return activationState.enabled
    ? {
        effective: true,
        pluginId: params.plugin.id,
      }
    : {
        effective: false,
        pluginId: params.plugin.id,
        blockedReason: normalizeActivationBlockedReason(activationState.reason),
      };
}
function addPolicySignal(entries, channelId, source) {
  const normalized = normalizeOptionalLowercaseString(channelId);
  if (!normalized) return;
  let sources = entries.get(normalized);
  if (!sources) {
    sources = /* @__PURE__ */ new Set();
    entries.set(normalized, sources);
  }
  sources.add(source);
}
function loadInstalledChannelManifestRecords(params) {
  return loadPluginManifestRegistryForPluginRegistry({
    config: params.config,
    workspaceDir: params.workspaceDir,
    env: params.env,
    includeDisabled: true,
  }).plugins;
}
/** Resolves effective configured-channel policy rows from config, auth state, env, and manifests. */
function resolveConfiguredChannelPresencePolicy(params) {
  const env = params.env ?? process.env;
  const workspaceDir =
    params.workspaceDir ??
    resolveAgentWorkspaceDir(params.config, resolveDefaultAgentId(params.config));
  const records =
    params.manifestRecords ??
    loadInstalledChannelManifestRecords({
      config: params.config,
      workspaceDir,
      env,
    });
  const disabledChannelIds = new Set(listExplicitlyDisabledChannelIdsForConfig(params.config));
  const entrySources = /* @__PURE__ */ new Map();
  for (const channelId of listExplicitConfiguredChannelIdsForConfig(params.config))
    addPolicySignal(entrySources, channelId, "explicit-config");
  for (const signal of listPotentialConfiguredChannelPresenceSignals(params.config, env, {
    includePersistedAuthState: params.includePersistedAuthState,
  })) {
    if (signal.source === "config") continue;
    addPolicySignal(entrySources, signal.channelId, signal.source);
  }
  for (const signal of listManifestEnvConfiguredChannelSignals({
    records,
    config: params.config,
    activationSourceConfig: params.activationSourceConfig,
    env,
  }))
    addPolicySignal(entrySources, signal.channelId, signal.source);
  for (const channelId of disabledChannelIds) entrySources.delete(channelId);
  const activationSource = createPluginActivationSource({
    config: params.activationSourceConfig ?? params.config,
  });
  const normalizedConfig = activationSource.plugins;
  const entries = [];
  for (const channelId of normalizeChannelIds(entrySources.keys())) {
    const owningRecords = records.filter((record) => recordDeclaresChannel(record, channelId));
    const evaluations = owningRecords.map((plugin) =>
      evaluateEffectiveChannelPlugin({
        plugin,
        channelId,
        normalizedConfig,
        config: params.config,
        activationSource,
      }),
    );
    const effectivePluginIds = evaluations
      .filter((entry) => entry.effective)
      .map((entry) => entry.pluginId);
    const blockedReasons =
      owningRecords.length === 0
        ? ["no-channel-owner"]
        : [
            ...new Set(
              evaluations.map((entry) => entry.blockedReason).filter((reason) => Boolean(reason)),
            ),
          ].toSorted((left, right) => left.localeCompare(right));
    entries.push({
      channelId,
      sources: [...(entrySources.get(channelId) ?? [])].toSorted((left, right) =>
        left.localeCompare(right),
      ),
      effective: effectivePluginIds.length > 0,
      pluginIds: sortUniqueStrings(effectivePluginIds),
      blockedReasons,
    });
  }
  return entries;
}
/** Lists effective channel ids available to read-only scoped discovery. */
function listConfiguredChannelIdsForReadOnlyScope(params) {
  return resolveConfiguredChannelPresencePolicy(params)
    .filter((entry) => entry.effective)
    .map((entry) => entry.channelId);
}
/** True when read-only scoped discovery has any effective configured channel. */
function hasConfiguredChannelsForReadOnlyScope(params) {
  return listConfiguredChannelIdsForReadOnlyScope(params).length > 0;
}
/** Lists channel ids that should be announced as configured for operators. */
function listConfiguredAnnounceChannelIdsForConfig(params) {
  const disabledChannelIds = new Set(listExplicitlyDisabledChannelIdsForConfig(params.config));
  const trustConfig = params.activationSourceConfig ?? params.config;
  const normalizedConfig = normalizePluginsConfig(trustConfig.plugins);
  const policy = resolveConfiguredChannelPresencePolicy({
    config: params.config,
    activationSourceConfig: trustConfig,
    workspaceDir: params.workspaceDir,
    env: params.env,
    includePersistedAuthState: false,
    manifestRecords: params.manifestRecords,
  });
  const policyDisabledChannelIds = new Set(
    policy
      .filter(
        (entry) =>
          !entry.effective &&
          entry.blockedReasons.some((reason) => ANNOUNCE_SUPPRESSING_BLOCKED_REASONS.has(reason)),
      )
      .map((entry) => entry.channelId),
  );
  return normalizeChannelIds([
    ...listExplicitConfiguredChannelIdsForConfig(params.config).filter(
      (channelId) =>
        normalizedConfig.enabled &&
        !normalizedConfig.deny.includes(channelId) &&
        normalizedConfig.entries[channelId]?.enabled !== false &&
        (normalizedConfig.allow.length === 0 || normalizedConfig.allow.includes(channelId)),
    ),
    ...policy.filter((entry) => entry.effective).map((entry) => entry.channelId),
  ]).filter(
    (channelId) => !disabledChannelIds.has(channelId) && !policyDisabledChannelIds.has(channelId),
  );
}
function resolveScopedChannelOwnerPluginIds(params) {
  const channelIds = normalizeChannelIds(params.channelIds);
  if (channelIds.length === 0) return [];
  const records =
    params.manifestRecords ??
    loadInstalledChannelManifestRecords({
      config: params.config,
      workspaceDir: params.workspaceDir,
      env: params.env,
    });
  const trustConfig = params.activationSourceConfig ?? params.config;
  const normalizedConfig = normalizePluginsConfig(trustConfig.plugins);
  const candidateIds = sortUniqueStrings(
    channelIds.flatMap((channelId) => {
      return resolveManifestActivationPluginIds({
        trigger: {
          kind: "channel",
          channel: channelId,
        },
        config: params.config,
        workspaceDir: params.workspaceDir,
        env: params.env,
        manifestRecords: records,
        allowRestrictiveAllowlistBypass: hasExplicitChannelConfig({
          config: trustConfig,
          channelId,
        }),
      });
    }),
  );
  if (candidateIds.length === 0) return [];
  const candidateIdSet = new Set(candidateIds);
  return records
    .filter((plugin) => {
      if (!candidateIdSet.has(plugin.id)) return false;
      return isChannelPluginEligibleForScopedOwnership({
        plugin,
        normalizedConfig,
        rootConfig: trustConfig,
        channelId: channelIds.find((channelId) => recordDeclaresChannel(plugin, channelId)),
      });
    })
    .map((plugin) => plugin.id)
    .toSorted((left, right) => left.localeCompare(right));
}
/** Resolves plugin ids discoverable for scoped channel activation. */
function resolveDiscoverableScopedChannelPluginIds(params) {
  return resolveScopedChannelOwnerPluginIds(params);
}
/** Resolves plugin ids that own currently configured channels. */
function resolveConfiguredChannelPluginIds(params) {
  const configuredChannelIds = normalizeChannelIds([
    ...listConfiguredChannelIdsForReadOnlyScope({
      config: params.config,
      activationSourceConfig: params.activationSourceConfig,
      workspaceDir: params.workspaceDir,
      env: params.env,
    }),
    ...listExplicitConfiguredChannelIdsForConfig(params.activationSourceConfig ?? params.config),
  ]);
  if (configuredChannelIds.length === 0) return [];
  return resolveScopedChannelOwnerPluginIds({
    ...params,
    channelIds: configuredChannelIds,
  });
}
//#endregion
export {
  listExplicitConfiguredChannelIdsForConfig as a,
  resolveDiscoverableScopedChannelPluginIds as c,
  listConfiguredChannelIdsForReadOnlyScope as i,
  isSafeChannelEnvVarTriggerName as l,
  hasExplicitChannelConfig as n,
  resolveConfiguredChannelPluginIds as o,
  listConfiguredAnnounceChannelIdsForConfig as r,
  resolveConfiguredChannelPresencePolicy as s,
  hasConfiguredChannelsForReadOnlyScope as t,
};
