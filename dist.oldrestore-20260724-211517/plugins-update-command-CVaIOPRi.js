import { t as resolveClawHubRiskAcknowledgementCliOptions } from "./clawhub-risk-acknowledgement-B_IQ9VgH.js";
import "./src-Bl7G9qvi.js";
import { r as replaceConfigFile } from "./config-BDv-QbJ6.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import {
  a as selectInstallMutationWriteOptions,
  i as resolveInstallConfigMutationPreflights,
  r as resolveCombinedPluginAndHookConfigMutationPreflight,
  t as containsConfigIncludeDirective,
} from "./install-persistence-BSkHA7t9.js";
import { r as commitPluginInstallRecordsWithConfig } from "./install-record-commit-BKVujmT7.js";
import { t as buildNpmResolutionFields } from "./install-source-utils-Cvk6wk9f.js";
import { i as resolveHookInstallDir, n as installHooksFromNpmSpec } from "./install-ySnrQjbE.js";
import { t as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-D7CXgzhH.js";
import {
  a as withPluginInstallRecords,
  o as withoutPluginInstallRecords,
} from "./installed-plugin-index-records-BP7rp3ti.js";
import { t as recordHookInstall } from "./installs-BKTJdEeS.js";
import {
  Y as createMergePatch,
  f as readConfigFileSnapshotForWrite,
  i as getRuntimeConfig,
} from "./io-B3ne6NxF.js";
import { t as applyMergePatch } from "./merge-patch-r9Hm65ir.js";
import { n as assertConfigWriteAllowedInCurrentMode } from "./nix-mode-write-guard-e6xDJfpJ.js";
import { s as parseRegistryNpmSpec } from "./npm-registry-spec-CqBTTiC9.js";
import {
  i as readInstalledPackageVersion,
  t as expectedIntegrityForUpdate,
} from "./package-update-utils-T2vDkLHN.js";
import { t as extractShippedPluginInstallConfigRecords } from "./plugin-install-config-migration-Ba4BJKHA.js";
import { r as promptYesNo } from "./prompt-DMGJRcz7.js";
import { n as refreshPluginRegistryAfterConfigMutation } from "./registry-refresh-XzeGvhvw.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { l as normalizeUpdateChannel } from "./update-channels-CQNa2YMG.js";
import {
  a as updateNpmInstalledPlugins,
  n as isPluginInstallRecordUpdateSource,
  r as pluginInstallRecordMayMigrateConfigId,
  t as isClawHubTrustSkippedOutcome,
} from "./update-Dap2BNUK.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
//#region src/hooks/update.ts
function createHookPackUpdateIntegrityDriftHandler(params) {
  return async (drift) => {
    const payload = {
      hookId: params.hookId,
      spec: drift.spec,
      expectedIntegrity: drift.expectedIntegrity,
      actualIntegrity: drift.actualIntegrity,
      resolution: drift.resolution,
      resolvedSpec: drift.resolution.resolvedSpec,
      resolvedVersion: drift.resolution.version,
      dryRun: params.dryRun,
    };
    if (params.onIntegrityDrift) return await params.onIntegrityDrift(payload);
    params.logger.warn?.(
      `Integrity drift for hook pack "${params.hookId}" (${payload.resolvedSpec ?? payload.spec}): expected ${payload.expectedIntegrity}, got ${payload.actualIntegrity}`,
    );
    return false;
  };
}
/** Update npm-installed hook packs and return config changes plus per-pack outcomes. */
async function updateNpmInstalledHookPacks(params) {
  const logger = params.logger ?? {};
  const installs = params.config.hooks?.internal?.installs ?? {};
  const targets = params.hookIds?.length ? params.hookIds : Object.keys(installs);
  const outcomes = [];
  let next = params.config;
  let changed = false;
  for (const hookId of targets) {
    const record = installs[hookId];
    if (!record) {
      outcomes.push({
        hookId,
        status: "skipped",
        message: `No install record for hook pack "${hookId}".`,
      });
      continue;
    }
    if (record.source !== "npm") {
      outcomes.push({
        hookId,
        status: "skipped",
        message: `Skipping hook pack "${hookId}" (source: ${record.source}).`,
      });
      continue;
    }
    const effectiveSpec = params.specOverrides?.[hookId] ?? record.spec;
    const expectedIntegrity =
      effectiveSpec === record.spec
        ? expectedIntegrityForUpdate(record.spec, record.integrity)
        : void 0;
    if (!effectiveSpec) {
      outcomes.push({
        hookId,
        status: "skipped",
        message: `Skipping hook pack "${hookId}" (missing npm spec).`,
      });
      continue;
    }
    let installPath;
    try {
      installPath = record.installPath ?? resolveHookInstallDir(hookId);
    } catch (err) {
      outcomes.push({
        hookId,
        status: "error",
        message: `Invalid install path for hook pack "${hookId}": ${String(err)}`,
      });
      continue;
    }
    const currentVersion = await readInstalledPackageVersion(installPath);
    const result = await installHooksFromNpmSpec({
      config: params.config,
      spec: effectiveSpec,
      mode: "update",
      dryRun: params.dryRun,
      expectedHookPackId: hookId,
      expectedIntegrity,
      onIntegrityDrift: createHookPackUpdateIntegrityDriftHandler({
        hookId,
        dryRun: Boolean(params.dryRun),
        logger,
        onIntegrityDrift: params.onIntegrityDrift,
      }),
      logger,
    });
    if (!result.ok) {
      outcomes.push({
        hookId,
        status: "error",
        message: `Failed to ${params.dryRun ? "check" : "update"} hook pack "${hookId}": ${result.error}`,
      });
      continue;
    }
    const nextVersion = result.version ?? (await readInstalledPackageVersion(result.targetDir));
    const currentLabel = currentVersion ?? "unknown";
    const nextLabel = nextVersion ?? "unknown";
    const status =
      currentVersion && nextVersion && currentVersion === nextVersion ? "unchanged" : "updated";
    if (params.dryRun) {
      outcomes.push({
        hookId,
        status,
        currentVersion: currentVersion ?? void 0,
        nextVersion: nextVersion ?? void 0,
        message:
          status === "unchanged"
            ? `Hook pack "${hookId}" is up to date (${currentLabel}).`
            : `Would update hook pack "${hookId}": ${currentLabel} -> ${nextLabel}.`,
      });
      continue;
    }
    next = recordHookInstall(next, {
      hookId,
      source: "npm",
      spec: effectiveSpec,
      installPath: result.targetDir,
      version: nextVersion,
      ...buildNpmResolutionFields(result.npmResolution),
      hooks: result.hooks,
    });
    changed = true;
    outcomes.push({
      hookId,
      status,
      currentVersion: currentVersion ?? void 0,
      nextVersion: nextVersion ?? void 0,
      message:
        status === "unchanged"
          ? `Hook pack "${hookId}" already at ${currentLabel}.`
          : `Updated hook pack "${hookId}": ${currentLabel} -> ${nextLabel}.`,
    });
  }
  return {
    config: next,
    changed,
    outcomes,
  };
}
//#endregion
//#region src/cli/plugins-update-outcomes.ts
/** Log update outcomes with severity styling and report whether any errors occurred. */
function logPluginUpdateOutcomes(params) {
  let hasErrors = false;
  for (const outcome of params.outcomes) {
    if (outcome.status === "error") {
      hasErrors = true;
      params.log(theme.error(outcome.message));
      if (outcome.channelFallback) params.log(theme.warn(outcome.channelFallback.message));
      continue;
    }
    if (outcome.status === "skipped") {
      if (isClawHubTrustSkippedOutcome(outcome)) hasErrors = true;
      params.log(theme.warn(outcome.message));
      if (outcome.channelFallback) params.log(theme.warn(outcome.channelFallback.message));
      continue;
    }
    params.log(outcome.message);
    if (outcome.channelFallback) params.log(theme.warn(outcome.channelFallback.message));
  }
  return { hasErrors };
}
//#endregion
//#region src/cli/plugins-install-records.ts
/** Return the installed npm package name for a plugin install record when available. */
function extractInstalledNpmPackageName(install) {
  if (install.source !== "npm") return;
  const resolvedName = install.resolvedName?.trim();
  if (resolvedName) return resolvedName;
  return (
    (install.spec ? parseRegistryNpmSpec(install.spec)?.name : void 0) ??
    (install.resolvedSpec ? parseRegistryNpmSpec(install.resolvedSpec)?.name : void 0)
  );
}
/** Return the installed npm package name for a hook-pack install record when available. */
function extractInstalledNpmHookPackageName(install) {
  const resolvedName = install.resolvedName?.trim();
  if (resolvedName) return resolvedName;
  return (
    (install.spec ? parseRegistryNpmSpec(install.spec)?.name : void 0) ??
    (install.resolvedSpec ? parseRegistryNpmSpec(install.resolvedSpec)?.name : void 0)
  );
}
//#endregion
//#region src/cli/plugins-update-selection.ts
/** Resolve a plugin update target and optional npm spec override from CLI input. */
function resolvePluginUpdateSelection(params) {
  if (params.all) return { pluginIds: Object.keys(params.installs) };
  if (!params.rawId) return { pluginIds: [] };
  if (Object.hasOwn(params.installs, params.rawId)) return { pluginIds: [params.rawId] };
  const parsedSpec = parseRegistryNpmSpec(params.rawId);
  if (!parsedSpec) return { pluginIds: [params.rawId] };
  const matches = Object.entries(params.installs).filter(([, install]) => {
    return extractInstalledNpmPackageName(install) === parsedSpec.name;
  });
  if (matches.length !== 1) return { pluginIds: [params.rawId] };
  const [pluginId] = expectDefined(matches[0], "matches capture group 0");
  if (!pluginId) return { pluginIds: [params.rawId] };
  if (parsedSpec.selectorKind === "none")
    return {
      pluginIds: [pluginId],
      specOverrides: { [pluginId]: parsedSpec.raw },
    };
  return {
    pluginIds: [pluginId],
    specOverrides: { [pluginId]: parsedSpec.raw },
  };
}
/** Resolve a hook-pack update target and optional npm spec override from CLI input. */
function resolveHookPackUpdateSelection(params) {
  if (params.all) return { hookIds: Object.keys(params.installs) };
  if (!params.rawId) return { hookIds: [] };
  if (Object.hasOwn(params.installs, params.rawId)) return { hookIds: [params.rawId] };
  const parsedSpec = parseRegistryNpmSpec(params.rawId);
  if (!parsedSpec || parsedSpec.selectorKind === "none") return { hookIds: [] };
  const matches = Object.entries(params.installs).filter(([, install]) => {
    return extractInstalledNpmHookPackageName(install) === parsedSpec.name;
  });
  if (matches.length !== 1) return { hookIds: [] };
  const [hookId] = expectDefined(matches[0], "matches capture group 0");
  if (!hookId) return { hookIds: [] };
  return {
    hookIds: [hookId],
    specOverrides: { [hookId]: parsedSpec.raw },
  };
}
//#endregion
//#region src/cli/plugins-update-command.ts
const DEPRECATED_DANGEROUS_FORCE_UNSAFE_UPDATE_WARNING =
  "--dangerously-force-unsafe-install is deprecated and no longer affects plugin updates because built-in install-time dangerous-code scanning has been removed. Configure security.installPolicy for operator-owned install decisions.";
function mayMutatePluginInstallRecord(record, specOverride) {
  if (!isPluginInstallRecordUpdateSource(record)) return false;
  if (record?.source === "npm") return Boolean(specOverride ?? record.spec);
  if (record?.source === "git") return Boolean(record.spec);
  if (record?.source === "clawhub") return Boolean(record.clawhubPackage);
  return Boolean(record?.marketplaceSource && record.marketplacePlugin);
}
function pluginConfigReferencesId(config, pluginId) {
  const plugins = config.plugins;
  return (
    plugins?.allow?.includes(pluginId) ||
    plugins?.deny?.includes(pluginId) ||
    Object.hasOwn(plugins?.entries ?? {}, pluginId) ||
    plugins?.slots?.memory === pluginId ||
    plugins?.slots?.contextEngine === pluginId
  );
}
function shouldPreserveEmptyPlugins(params) {
  const plugins = params.sourceConfig.plugins;
  const parsedPlugins =
    params.parsed && typeof params.parsed === "object" && !Array.isArray(params.parsed)
      ? params.parsed.plugins
      : void 0;
  return Boolean(
    plugins &&
    (!Object.hasOwn(plugins, "installs") ||
      Object.keys(plugins).some((key) => key !== "installs") ||
      containsConfigIncludeDirective(parsedPlugins)),
  );
}
function projectUpdaterResultOntoSourceConfig(params) {
  const updatePatch = createMergePatch(params.runtimeBase, params.updatedConfig);
  return applyMergePatch(params.sourceBase, updatePatch);
}
/** Run plugin/hook-pack updates, persist changed install records, and refresh runtime registry. */
async function runPluginUpdateCommand(params) {
  assertConfigWriteAllowedInCurrentMode();
  const sourceSnapshotPromise = readConfigFileSnapshotForWrite()
    .then((prepared) => ({
      ...prepared,
      writeOptions: selectInstallMutationWriteOptions(prepared.writeOptions),
    }))
    .catch(() => null);
  const mutationSnapshot = params.opts.dryRun ? null : await sourceSnapshotPromise;
  if (!params.opts.dryRun && !mutationSnapshot) {
    defaultRuntime.error("Could not inspect config ownership before updating plugins or hooks.");
    return defaultRuntime.exit(1);
  }
  if (mutationSnapshot && !mutationSnapshot.snapshot.valid) {
    defaultRuntime.error("Cannot update plugins or hooks while the config is invalid.");
    return defaultRuntime.exit(1);
  }
  const cfg = mutationSnapshot?.snapshot.runtimeConfig ?? getRuntimeConfig();
  const sourceCfg = mutationSnapshot?.snapshot.sourceConfig ?? cfg;
  const shippedPluginInstallRecords = mutationSnapshot
    ? {
        ...extractShippedPluginInstallConfigRecords(mutationSnapshot.snapshot.parsed),
        ...extractShippedPluginInstallConfigRecords(mutationSnapshot.snapshot.sourceConfig),
      }
    : extractShippedPluginInstallConfigRecords(cfg);
  const persistedPluginInstallRecords = await loadInstalledPluginIndexInstallRecords();
  const pluginInstallRecords = {
    ...shippedPluginInstallRecords,
    ...persistedPluginInstallRecords,
  };
  const cfgWithPluginInstallRecords = withPluginInstallRecords(cfg, pluginInstallRecords);
  const sourceCfgWithPluginInstallRecords = withPluginInstallRecords(
    sourceCfg,
    pluginInstallRecords,
  );
  const logger = {
    info: (msg) => defaultRuntime.log(msg),
    warn: (msg) => defaultRuntime.log(msg.includes("╭─") ? msg : theme.warn(msg)),
  };
  if (params.opts.dangerouslyForceUnsafeInstall)
    defaultRuntime.log(theme.warn(DEPRECATED_DANGEROUS_FORCE_UNSAFE_UPDATE_WARNING));
  const pluginSelection = resolvePluginUpdateSelection({
    installs: pluginInstallRecords,
    rawId: params.id,
    all: params.opts.all,
  });
  const hookSelection = resolveHookPackUpdateSelection({
    installs: cfg.hooks?.internal?.installs ?? {},
    rawId: params.id,
    all: params.opts.all,
  });
  if (pluginSelection.pluginIds.length === 0 && hookSelection.hookIds.length === 0) {
    if (params.opts.all) {
      defaultRuntime.log("No tracked plugins or hook packs to update.");
      return;
    }
    defaultRuntime.error("Provide a plugin or hook-pack id, or use --all.");
    return defaultRuntime.exit(1);
  }
  const selectedHooks = cfg.hooks?.internal?.installs ?? {};
  const pluginUpdateMayMutate =
    !params.opts.dryRun &&
    pluginSelection.pluginIds.some((pluginId) => {
      return mayMutatePluginInstallRecord(
        pluginInstallRecords[pluginId],
        pluginSelection.specOverrides?.[pluginId],
      );
    });
  const hookUpdateMayMutate =
    !params.opts.dryRun &&
    hookSelection.hookIds.some((hookId) => {
      const record = selectedHooks[hookId];
      return (
        record?.source === "npm" && Boolean(hookSelection.specOverrides?.[hookId] ?? record.spec)
      );
    });
  if (pluginUpdateMayMutate || hookUpdateMayMutate) {
    if (!mutationSnapshot) {
      defaultRuntime.error("Could not inspect config ownership before updating plugins or hooks.");
      return defaultRuntime.exit(1);
    }
    const { hookMutation, pluginMutation } = resolveInstallConfigMutationPreflights({
      parsed: mutationSnapshot.snapshot.parsed ?? {},
      snapshotPath: mutationSnapshot.snapshot.path,
      writeOptions: mutationSnapshot.writeOptions,
    });
    const pluginRecordCleanupMayMutate =
      Object.keys(extractShippedPluginInstallConfigRecords(mutationSnapshot.snapshot.sourceConfig))
        .length > 0 ||
      Object.keys(extractShippedPluginInstallConfigRecords(mutationSnapshot.snapshot.parsed))
        .length > 0;
    const parsedConfig =
      mutationSnapshot.snapshot.parsed &&
      typeof mutationSnapshot.snapshot.parsed === "object" &&
      !Array.isArray(mutationSnapshot.snapshot.parsed)
        ? mutationSnapshot.snapshot.parsed
        : {};
    const pluginReferencesMayBeUnresolved =
      Object.hasOwn(parsedConfig, "$include") ||
      containsConfigIncludeDirective(mutationSnapshot.snapshot.sourceConfig.plugins);
    const pluginIdMigrationMayMutate = pluginSelection.pluginIds.some((pluginId) => {
      return (
        pluginInstallRecordMayMigrateConfigId({
          pluginId,
          record: pluginInstallRecords[pluginId],
          specOverride: pluginSelection.specOverrides?.[pluginId],
        }) &&
        (pluginReferencesMayBeUnresolved ||
          pluginConfigReferencesId(mutationSnapshot.snapshot.sourceConfig, pluginId))
      );
    });
    const pluginConfigMayMutate = pluginRecordCleanupMayMutate || pluginIdMigrationMayMutate;
    const blockedReasons = /* @__PURE__ */ new Set();
    if (pluginConfigMayMutate && pluginMutation.mode === "blocked")
      blockedReasons.add(pluginMutation.reason);
    if (hookUpdateMayMutate && hookMutation.mode === "blocked")
      blockedReasons.add(hookMutation.reason);
    if (
      pluginConfigMayMutate &&
      hookUpdateMayMutate &&
      pluginMutation.mode === "allowed" &&
      hookMutation.mode === "allowed"
    ) {
      const combinedMutation = resolveCombinedPluginAndHookConfigMutationPreflight({
        parsed: mutationSnapshot.snapshot.parsed ?? {},
        snapshotPath: mutationSnapshot.snapshot.path,
      });
      if (combinedMutation.mode === "blocked") blockedReasons.add(combinedMutation.reason);
    }
    if (blockedReasons.size > 0) {
      defaultRuntime.error(Array.from(blockedReasons).join(" "));
      return defaultRuntime.exit(1);
    }
  }
  const pluginResult =
    pluginSelection.pluginIds.length > 0
      ? await updateNpmInstalledPlugins({
          config: cfgWithPluginInstallRecords,
          pluginIds: pluginSelection.pluginIds,
          specOverrides: pluginSelection.specOverrides,
          dryRun: params.opts.dryRun,
          officialPluginUpdateChannel: params.opts.all
            ? (normalizeUpdateChannel(cfg.update?.channel) ?? void 0)
            : void 0,
          syncOfficialPluginInstalls: params.opts.all ? true : void 0,
          coreVersion: VERSION,
          dangerouslyForceUnsafeInstall: params.opts.dangerouslyForceUnsafeInstall,
          ...resolveClawHubRiskAcknowledgementCliOptions({
            acknowledgeClawHubRisk: params.opts.acknowledgeClawHubRisk,
            action: "updating",
            allowPrompt: !params.opts.dryRun,
          }),
          logger,
          onIntegrityDrift: async (drift) => {
            const specLabel = drift.resolvedSpec ?? drift.spec;
            defaultRuntime.log(
              theme.warn(
                `Integrity drift detected for "${drift.pluginId}" (${specLabel})\nExpected: ${drift.expectedIntegrity}\nActual:   ${drift.actualIntegrity}`,
              ),
            );
            if (drift.dryRun) return true;
            return await promptYesNo(`Continue updating "${drift.pluginId}" with this artifact?`);
          },
        })
      : {
          config: cfgWithPluginInstallRecords,
          changed: false,
          outcomes: [],
        };
  const hookResult =
    hookSelection.hookIds.length > 0
      ? await updateNpmInstalledHookPacks({
          config: pluginResult.config,
          hookIds: hookSelection.hookIds,
          specOverrides: hookSelection.specOverrides,
          dryRun: params.opts.dryRun,
          logger,
          onIntegrityDrift: async (drift) => {
            const specLabel = drift.resolvedSpec ?? drift.spec;
            defaultRuntime.log(
              theme.warn(
                `Integrity drift detected for hook pack "${drift.hookId}" (${specLabel})\nExpected: ${drift.expectedIntegrity}\nActual:   ${drift.actualIntegrity}`,
              ),
            );
            if (drift.dryRun) return true;
            return await promptYesNo(
              `Continue updating hook pack "${drift.hookId}" with this artifact?`,
            );
          },
        })
      : {
          config: pluginResult.config,
          changed: false,
          outcomes: [],
        };
  const outcomeSummary = logPluginUpdateOutcomes({
    outcomes: [...pluginResult.outcomes, ...hookResult.outcomes],
    log: (message) => defaultRuntime.log(message),
  });
  if (!params.opts.dryRun && (pluginResult.changed || hookResult.changed)) {
    const sourceSnapshot = mutationSnapshot ?? (await sourceSnapshotPromise);
    const nextPluginInstallRecords = pluginResult.config.plugins?.installs ?? {};
    const shouldPersistPluginInstallIndex =
      pluginResult.changed || Object.keys(pluginInstallRecords).length > 0;
    const nextConfig = withoutPluginInstallRecords(
      projectUpdaterResultOntoSourceConfig({
        runtimeBase: cfgWithPluginInstallRecords,
        sourceBase: sourceCfgWithPluginInstallRecords,
        updatedConfig: hookResult.config,
      }),
      {
        preserveEmptyPlugins: shouldPreserveEmptyPlugins({
          parsed: sourceSnapshot?.snapshot.parsed,
          sourceConfig: sourceSnapshot?.snapshot.sourceConfig ?? {},
        }),
      },
    );
    if (shouldPersistPluginInstallIndex)
      await commitPluginInstallRecordsWithConfig({
        previousInstallRecords: persistedPluginInstallRecords,
        nextInstallRecords: nextPluginInstallRecords,
        nextConfig,
        baseHash: sourceSnapshot?.snapshot.hash,
        writeOptions: {
          ...sourceSnapshot?.writeOptions,
          afterWrite: {
            mode: "restart",
            reason: "plugin source changed",
          },
        },
      });
    else
      await replaceConfigFile({
        nextConfig,
        baseHash: sourceSnapshot?.snapshot.hash,
        writeOptions: sourceSnapshot?.writeOptions,
      });
    if (pluginResult.changed)
      await refreshPluginRegistryAfterConfigMutation({
        config: nextConfig,
        reason: "source-changed",
        installRecords: nextPluginInstallRecords,
        invalidateRuntimeCache: false,
        logger,
      });
    defaultRuntime.log("Restart the gateway to load plugins and hooks.");
  }
  if (outcomeSummary.hasErrors) defaultRuntime.exit(1);
}
//#endregion
export { runPluginUpdateCommand as t };
