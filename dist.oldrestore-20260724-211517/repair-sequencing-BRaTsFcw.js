import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { t as collectActiveToolSchemaProjectionWarnings } from "./active-tool-schema-warnings-m_o6WPpm.js";
import "./src-Bl7G9qvi.js";
import { t as sanitizeForLog } from "./ansi-D4OHEz5F.js";
import { n as maybeRepairBundledPluginLoadPaths } from "./bundled-plugin-load-paths-6-ucKbKy.js";
import { t as getDoctorChannelCapabilities } from "./channel-capabilities-BvmgQW8G.js";
import {
  a as collectChannelDoctorRepairMutations,
  s as createChannelDoctorEmptyAllowlistPolicyHooks,
} from "./channel-doctor-BJ8ML7ml.js";
import { r as maybeRepairCodexRoutes } from "./codex-route-warnings-BgeH4rqx.js";
import { t as applyDoctorConfigMutation } from "./config-mutation-state-DO_xkJud.js";
import { r as maybeRepairContextEngineHostCompatibility } from "./context-engine-host-compat-n1yjjYe0.js";
import "./registry-xXjI-8UE.js";
import {
  a as resolveChannelDmAllowFrom,
  s as setCanonicalDmAllowFrom,
} from "./dm-access-Bq5cULcy.js";
import {
  a as maybeRepairOpenAICodexAuthConfig,
  n as maybeMigrateAuthProfileJsonStoresToSqlite,
  o as maybeRepairOpenAICodexAuthProfileStores,
  t as collectOpenAICodexAuthProfileStoreIdMap,
} from "./doctor-auth-flat-profiles-Cdq19kWF.js";
import { t as maybeRepairLegacyOAuthSidecarProfiles } from "./doctor-auth-oauth-sidecar-CTX6euvg.js";
import {
  i as maybeRepairStaleManagedNpmBundledPlugins,
  n as maybeRepairManagedNpmOpenClawPeerLinks,
} from "./doctor-plugin-registry-LDktfEUk.js";
import {
  n as hasAllowFromEntries,
  t as scanEmptyAllowlistPolicyWarnings,
} from "./empty-allowlist-scan-ix4xlmSI.js";
import { r as maybeRepairExecSafeBinProfiles } from "./exec-safe-bins-BIku7GLG.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import {
  i as GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA,
  r as normalizeChatChannelId,
} from "./ids-lBaN9yr4.js";
import { D as validateConfigObjectWithPlugins } from "./io-B3ne6NxF.js";
import { n as maybeRepairLegacyToolsBySenderKeys } from "./legacy-tools-by-sender-DlxgsYrK.js";
import { i as repairMissingConfiguredPluginInstalls } from "./missing-configured-plugin-install-CQu0CVkE.js";
import { t as asObjectRecord } from "./object-BsiS9JXh.js";
import {
  n as maybeRepairOpenPolicyAllowFrom,
  r as resolveAllowFromMode,
} from "./open-policy-allowfrom-BQsCyOaQ.js";
import { i as readChannelAllowFromStore } from "./pairing-store-C4j5pnVS.js";
import {
  i as materializePluginAutoEnableCandidates,
  t as applyPluginAutoEnable,
} from "./plugin-auto-enable-DAo0bjMj.js";
import { t as cleanupLegacyPluginDependencyState } from "./plugin-dependency-cleanup-BbsEf7pK.js";
import { t as normalizeAnyChannelId } from "./registry-normalize-CWirNxxC.js";
import { n as maybeRepairStaleConfiguredAuthOrders } from "./stale-auth-order-XEuX_P_0.js";
import { n as repairStaleOAuthProfileShadows } from "./stale-oauth-profile-shadows-CG3Wsh2j.js";
import { r as maybeRepairStalePluginConfig } from "./stale-plugin-config-_xN30Qww.js";
import { n as maybeRepairStaleSubagentAllowlists } from "./stale-subagent-allowlist-DtLXBoJO.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { p as normalizeUniqueStringEntries } from "./string-normalization-CRyoFBPt.js";
import { d as isUpdatePackageSwapInProgress } from "./update-phase-RYqcMEby.js";
//#region src/commands/doctor/shared/allowfrom-fallback-migration.ts
const PSEUDO_CHANNEL_KEYS = /* @__PURE__ */ new Set(["defaults", "modelByChannel", "tools"]);
const ACCOUNT_SCHEMA_WILDCARD = "*";
const CHANNEL_GROUP_ALLOW_FROM_PATH = ["groupAllowFrom"];
const ACCOUNT_GROUP_ALLOW_FROM_PATH = ["accounts", ACCOUNT_SCHEMA_WILDCARD, "groupAllowFrom"];
function isDisabled(record) {
  return record.enabled === false;
}
function normalizeAllowFrom(raw) {
  return normalizeUniqueStringEntries(Array.isArray(raw) ? raw : []);
}
function readGroupAllowFrom(record) {
  return normalizeAllowFrom(record.groupAllowFrom);
}
function readDmAllowFrom(params) {
  return normalizeAllowFrom(
    resolveChannelDmAllowFrom({
      account: params.account,
      parent: params.parent,
      mode: getDoctorChannelCapabilities(params.channelName).dmAllowFromMode,
    }),
  );
}
function readOwnDmAllowFrom(params) {
  return normalizeAllowFrom(
    resolveChannelDmAllowFrom({
      account: params.account,
      mode: getDoctorChannelCapabilities(params.channelName).dmAllowFromMode,
    }),
  );
}
function findGeneratedChannelConfigSchema(channelName) {
  const normalizedChannelId = normalizeAnyChannelId(channelName);
  return GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.find(
    (entry) => entry.channelId === channelName || entry.channelId === normalizedChannelId,
  )?.schema;
}
function schemaAllowsConfigPath(schema, path) {
  if (path.length === 0) return true;
  const node = asObjectRecord(schema);
  if (!node) return true;
  const anyOf = Array.isArray(node.anyOf) ? node.anyOf : void 0;
  if (anyOf) return anyOf.some((branch) => schemaAllowsConfigPath(branch, path));
  const oneOf = Array.isArray(node.oneOf) ? node.oneOf : void 0;
  if (oneOf) return oneOf.some((branch) => schemaAllowsConfigPath(branch, path));
  const allOf = Array.isArray(node.allOf) ? node.allOf : void 0;
  if (allOf) return allOf.every((branch) => schemaAllowsConfigPath(branch, path));
  const segment = expectDefined(path[0], "schema path segment");
  const rest = path.slice(1);
  const properties = asObjectRecord(node.properties);
  if (segment !== ACCOUNT_SCHEMA_WILDCARD && properties && Object.hasOwn(properties, segment))
    return schemaAllowsConfigPath(expectDefined(properties[segment], "schema property"), rest);
  const additionalProperties = node.additionalProperties;
  if (additionalProperties === false) return false;
  if (additionalProperties && typeof additionalProperties === "object")
    return schemaAllowsConfigPath(additionalProperties, rest);
  return true;
}
function generatedSchemaAllowsGroupAllowFrom(channelName, path) {
  const schema = findGeneratedChannelConfigSchema(channelName);
  return !schema || schemaAllowsConfigPath(schema, path);
}
function migrateRecord(params) {
  if (!params.canWriteGroupAllowFrom) return false;
  if (readGroupAllowFrom(params.account).length > 0) return false;
  if (params.parent && params.parentHadGroupAllowFrom) return false;
  const ownAllowFrom = readOwnDmAllowFrom(params);
  if (params.parent && ownAllowFrom.length === 0 && readGroupAllowFrom(params.parent).length > 0)
    return false;
  const allowFrom = readDmAllowFrom(params);
  if (allowFrom.length === 0) return false;
  params.account.groupAllowFrom = allowFrom;
  const noun = allowFrom.length === 1 ? "entry" : "entries";
  params.changes.push(
    `${params.prefix}.groupAllowFrom: copied ${allowFrom.length} sender ${noun} from allowFrom for explicit group allowlist.`,
  );
  return true;
}
/** Copy legacy allowFrom entries into groupAllowFrom where channel metadata permits fallback. */
function maybeRepairGroupAllowFromFallback(cfg) {
  if (!asObjectRecord(cfg.channels))
    return {
      config: cfg,
      changes: [],
    };
  const next = structuredClone(cfg);
  const nextChannels = next.channels;
  const changes = [];
  for (const [channelName, channelConfig] of Object.entries(nextChannels)) {
    if (PSEUDO_CHANNEL_KEYS.has(channelName) || !channelConfig || typeof channelConfig !== "object")
      continue;
    if (isDisabled(channelConfig)) continue;
    if (!getDoctorChannelCapabilities(channelName).groupAllowFromFallbackToAllowFrom) continue;
    const hadGroupAllowFrom = readGroupAllowFrom(channelConfig).length > 0;
    migrateRecord({
      account: channelConfig,
      canWriteGroupAllowFrom: generatedSchemaAllowsGroupAllowFrom(
        channelName,
        CHANNEL_GROUP_ALLOW_FROM_PATH,
      ),
      channelName,
      changes,
      prefix: `channels.${channelName}`,
    });
    const accounts = asObjectRecord(channelConfig.accounts);
    if (!accounts) continue;
    const canWriteAccountGroupAllowFrom = generatedSchemaAllowsGroupAllowFrom(
      channelName,
      ACCOUNT_GROUP_ALLOW_FROM_PATH,
    );
    for (const [accountId, accountConfig] of Object.entries(accounts)) {
      const account = asObjectRecord(accountConfig);
      if (!account || isDisabled(account)) continue;
      migrateRecord({
        account,
        canWriteGroupAllowFrom: canWriteAccountGroupAllowFrom,
        channelName,
        changes,
        parent: channelConfig,
        parentHadGroupAllowFrom: hadGroupAllowFrom,
        prefix: `channels.${channelName}.accounts.${accountId}`,
      });
    }
  }
  if (changes.length === 0)
    return {
      config: cfg,
      changes: [],
    };
  return {
    config: next,
    changes,
  };
}
//#endregion
//#region src/commands/doctor/shared/allowlist-policy-repair.ts
/** Restore missing allowFrom entries for allowlist DM policies from persisted pairing stores. */
async function maybeRepairAllowlistPolicyAllowFrom(cfg) {
  const channels = cfg.channels;
  if (!channels || typeof channels !== "object")
    return {
      config: cfg,
      changes: [],
    };
  const next = structuredClone(cfg);
  const changes = [];
  const applyRecoveredAllowFrom = (params) => {
    const count = params.allowFrom.length;
    const noun = count === 1 ? "entry" : "entries";
    setCanonicalDmAllowFrom({
      entry: params.account,
      mode: params.mode,
      allowFrom: params.allowFrom,
      pathPrefix: params.prefix,
      changes,
      reason: `restored ${count} sender ${noun} from pairing store (dmPolicy="allowlist").`,
    });
  };
  const recoverAllowFromForAccount = async (params) => {
    const dmEntry = params.account.dm;
    const dm = dmEntry && typeof dmEntry === "object" && !Array.isArray(dmEntry) ? dmEntry : void 0;
    if ((params.account.dmPolicy ?? dm?.policy) !== "allowlist") return;
    const topAllowFrom = params.account.allowFrom;
    const nestedAllowFrom = dm?.allowFrom;
    if (hasAllowFromEntries(topAllowFrom) || hasAllowFromEntries(nestedAllowFrom)) return;
    const normalizedChannelId = normalizeOptionalLowercaseString(
      normalizeChatChannelId(params.channelName) ?? params.channelName,
    );
    if (!normalizedChannelId) return;
    const normalizedAccountId = normalizeAccountId(params.accountId) || "default";
    const recovered = normalizeUniqueStringEntries(
      await readChannelAllowFromStore(normalizedChannelId, process.env, normalizedAccountId).catch(
        () => [],
      ),
    );
    if (recovered.length === 0) return;
    applyRecoveredAllowFrom({
      account: params.account,
      allowFrom: recovered,
      mode: resolveAllowFromMode(params.channelName),
      prefix: params.prefix,
    });
  };
  const nextChannels = next.channels;
  for (const [channelName, channelConfig] of Object.entries(nextChannels)) {
    if (!channelConfig || typeof channelConfig !== "object") continue;
    if (channelConfig.enabled === false) continue;
    await recoverAllowFromForAccount({
      channelName,
      account: channelConfig,
      prefix: `channels.${channelName}`,
    });
    const accounts = asObjectRecord(channelConfig.accounts);
    if (!accounts) continue;
    for (const [accountId, accountConfig] of Object.entries(accounts)) {
      if (!accountConfig || typeof accountConfig !== "object") continue;
      if (accountConfig.enabled === false) continue;
      await recoverAllowFromForAccount({
        channelName,
        account: accountConfig,
        accountId,
        prefix: `channels.${channelName}.accounts.${accountId}`,
      });
    }
  }
  if (changes.length === 0)
    return {
      config: cfg,
      changes: [],
    };
  return {
    config: next,
    changes,
  };
}
//#endregion
//#region src/commands/doctor/shared/invalid-plugin-config.ts
const PLUGIN_CONFIG_ISSUE_RE = /^plugins\.entries\.([^.]+)\.config(?:\.|$)/;
function scanInvalidPluginConfig(cfg) {
  const validation = validateConfigObjectWithPlugins(cfg);
  if (validation.ok) return [];
  const hits = [];
  const seen = /* @__PURE__ */ new Set();
  for (const issue of validation.issues) {
    if (!issue.message.startsWith("invalid config:")) continue;
    const pluginId = issue.path.match(PLUGIN_CONFIG_ISSUE_RE)?.[1];
    if (!pluginId || seen.has(pluginId)) continue;
    seen.add(pluginId);
    hits.push({
      pluginId,
      pathLabel: `plugins.entries.${pluginId}.config`,
    });
  }
  return hits;
}
/** Disable plugin entries and clear config when plugin validation marks their config invalid. */
function maybeRepairInvalidPluginConfig(cfg) {
  const hits = scanInvalidPluginConfig(cfg);
  if (hits.length === 0)
    return {
      config: cfg,
      changes: [],
    };
  const next = structuredClone(cfg);
  const entries = asObjectRecord(next.plugins?.entries);
  if (!entries)
    return {
      config: cfg,
      changes: [],
    };
  const quarantined = [];
  for (const hit of hits) {
    const entry = asObjectRecord(entries[hit.pluginId]);
    if (!entry) continue;
    if ("config" in entry) delete entry.config;
    entry.enabled = false;
    quarantined.push(hit.pluginId);
  }
  if (quarantined.length === 0)
    return {
      config: cfg,
      changes: [],
    };
  return {
    config: next,
    changes: [
      sanitizeForLog(
        `- plugins.entries: quarantined ${quarantined.length} invalid plugin config${quarantined.length === 1 ? "" : "s"} (${quarantined.join(", ")})`,
      ),
    ],
  };
}
//#endregion
//#region src/commands/doctor/repair-sequencing.ts
/** Run doctor auto-repairs in dependency order and collect sanitized user notes. */
async function runDoctorRepairSequence(params) {
  let state = params.state;
  const changeNotes = [];
  const warningNotes = [];
  const env = params.env ?? process.env;
  const sanitizeLines = (lines) => lines.map((line) => sanitizeForLog(line)).join("\n");
  const applyMutation = (mutation) => {
    if (mutation.changes.length > 0) {
      changeNotes.push(sanitizeLines(mutation.changes));
      state = applyDoctorConfigMutation({
        state,
        mutation,
        shouldRepair: true,
      });
    }
    if (mutation.warnings && mutation.warnings.length > 0)
      warningNotes.push(sanitizeLines(mutation.warnings));
  };
  for (const mutation of await collectChannelDoctorRepairMutations({
    cfg: state.candidate,
    doctorFixCommand: params.doctorFixCommand,
    env,
  }))
    applyMutation(mutation);
  applyMutation(maybeRepairBundledPluginLoadPaths(state.candidate, env));
  maybeRepairStaleManagedNpmBundledPlugins({
    config: state.candidate,
    env,
    prompter: { shouldRepair: true },
  });
  await maybeRepairManagedNpmOpenClawPeerLinks({
    config: state.candidate,
    env,
    prompter: { shouldRepair: true },
  });
  const codexRouteRepair = maybeRepairCodexRoutes({
    cfg: state.candidate,
    env,
    shouldRepair: true,
  });
  applyMutation({
    config: codexRouteRepair.cfg,
    changes: codexRouteRepair.changes,
    warnings: codexRouteRepair.warnings,
  });
  applyMutation(
    maybeRepairOpenAICodexAuthConfig(state.candidate, {
      profileIdMap: collectOpenAICodexAuthProfileStoreIdMap({
        cfg: state.candidate,
        env,
      }),
    }),
  );
  applyMutation(
    await maybeRepairContextEngineHostCompatibility({
      cfg: state.candidate,
      doctorFixCommand: params.doctorFixCommand,
      env,
    }),
  );
  const missingConfiguredPluginInstallRepair = await repairMissingConfiguredPluginInstalls({
    cfg: state.candidate,
    env,
  });
  if (missingConfiguredPluginInstallRepair.changes.length > 0) {
    changeNotes.push(sanitizeLines(missingConfiguredPluginInstallRepair.changes));
    applyMutation(
      applyPluginAutoEnable({
        config: state.candidate,
        env,
      }),
    );
    const repairedPluginIds = missingConfiguredPluginInstallRepair.repairedPluginIds ?? [];
    if (repairedPluginIds.length > 0)
      applyMutation(
        materializePluginAutoEnableCandidates({
          config: state.candidate,
          env,
          candidates: repairedPluginIds.map((pluginId) => ({
            pluginId,
            kind: "configured-plugin-repaired",
          })),
        }),
      );
  }
  if (missingConfiguredPluginInstallRepair.warnings.length > 0)
    warningNotes.push(sanitizeLines(missingConfiguredPluginInstallRepair.warnings));
  const missingConfiguredPluginInstallNotices = missingConfiguredPluginInstallRepair.notices ?? [];
  if (missingConfiguredPluginInstallNotices.length > 0)
    warningNotes.push(sanitizeLines(missingConfiguredPluginInstallNotices));
  const failedPluginIds = missingConfiguredPluginInstallRepair.failedPluginIds ?? [];
  const hasUnscopedInstallRepairWarnings =
    missingConfiguredPluginInstallRepair.warnings.length > 0 && failedPluginIds.length === 0;
  if (!isUpdatePackageSwapInProgress(env) && !hasUnscopedInstallRepairWarnings)
    applyMutation(
      maybeRepairStalePluginConfig(state.candidate, env, { preservePluginIds: failedPluginIds }),
    );
  applyMutation(maybeRepairInvalidPluginConfig(state.candidate));
  applyMutation(await maybeRepairAllowlistPolicyAllowFrom(state.candidate));
  applyMutation(maybeRepairOpenPolicyAllowFrom(state.candidate));
  applyMutation(maybeRepairGroupAllowFromFallback(state.candidate));
  applyMutation(maybeRepairStaleSubagentAllowlists(state.candidate));
  const emptyAllowlistWarnings = scanEmptyAllowlistPolicyWarnings(state.candidate, {
    doctorFixCommand: params.doctorFixCommand,
    ...createChannelDoctorEmptyAllowlistPolicyHooks({
      cfg: state.candidate,
      env,
    }),
  });
  if (emptyAllowlistWarnings.length > 0) warningNotes.push(sanitizeLines(emptyAllowlistWarnings));
  applyMutation(maybeRepairLegacyToolsBySenderKeys(state.candidate));
  applyMutation(maybeRepairExecSafeBinProfiles(state.candidate));
  const pluginDependencyCleanup = await cleanupLegacyPluginDependencyState({ env });
  if (pluginDependencyCleanup.changes.length > 0)
    changeNotes.push(sanitizeLines(pluginDependencyCleanup.changes));
  if (pluginDependencyCleanup.warnings.length > 0)
    warningNotes.push(sanitizeLines(pluginDependencyCleanup.warnings));
  const legacyOAuthSidecarRepair = await maybeRepairLegacyOAuthSidecarProfiles({
    cfg: state.candidate,
    prompter: { confirmAutoFix: async () => true },
    emitNotes: false,
    env,
  });
  if (legacyOAuthSidecarRepair.changes.length > 0)
    changeNotes.push(sanitizeLines(legacyOAuthSidecarRepair.changes));
  if (legacyOAuthSidecarRepair.warnings.length > 0)
    warningNotes.push(sanitizeLines(legacyOAuthSidecarRepair.warnings));
  const openAIAuthProviderRepair = await maybeRepairOpenAICodexAuthProfileStores({
    cfg: state.candidate,
    env,
  });
  if (openAIAuthProviderRepair.changes.length > 0)
    changeNotes.push(sanitizeLines(openAIAuthProviderRepair.changes));
  if (openAIAuthProviderRepair.warnings.length > 0)
    warningNotes.push(sanitizeLines(openAIAuthProviderRepair.warnings));
  const staleOAuthShadowRepair = await repairStaleOAuthProfileShadows({
    cfg: state.candidate,
    env,
  });
  if (staleOAuthShadowRepair.changes.length > 0)
    changeNotes.push(sanitizeLines(staleOAuthShadowRepair.changes));
  if (staleOAuthShadowRepair.warnings.length > 0)
    warningNotes.push(sanitizeLines(staleOAuthShadowRepair.warnings));
  const authProfileSqliteMigration = await maybeMigrateAuthProfileJsonStoresToSqlite({
    cfg: state.candidate,
    prompter: { confirmAutoFix: async () => true },
    env,
  });
  if (authProfileSqliteMigration.configChanged)
    state = applyDoctorConfigMutation({
      state,
      mutation: {
        config: state.candidate,
        changes: ["Auth profile SQLite migration updated auth.profiles."],
      },
      shouldRepair: true,
    });
  if (authProfileSqliteMigration.changes.length > 0)
    changeNotes.push(sanitizeLines(authProfileSqliteMigration.changes));
  if (authProfileSqliteMigration.warnings.length > 0)
    warningNotes.push(sanitizeLines(authProfileSqliteMigration.warnings));
  applyMutation(
    maybeRepairStaleConfiguredAuthOrders({
      cfg: state.candidate,
      env,
    }),
  );
  const authProfilesRepaired =
    legacyOAuthSidecarRepair.changes.length > 0 ||
    openAIAuthProviderRepair.changes.length > 0 ||
    staleOAuthShadowRepair.changes.length > 0 ||
    authProfileSqliteMigration.changes.length > 0;
  const activeToolSchemaWarnings = collectActiveToolSchemaProjectionWarnings({
    cfg: state.candidate,
    env,
  });
  if (activeToolSchemaWarnings.length > 0)
    warningNotes.push(sanitizeLines(activeToolSchemaWarnings));
  return {
    state,
    changeNotes,
    warningNotes,
    authProfilesRepaired,
  };
}
//#endregion
export { runDoctorRepairSequence };
