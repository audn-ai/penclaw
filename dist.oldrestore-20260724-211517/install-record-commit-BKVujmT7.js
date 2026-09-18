import fs from "node:fs";
import "./path-guards-CBe_wA_B.js";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { a as transformConfigFileWithRetry, r as replaceConfigFile } from "./config-BDv-QbJ6.js";
import { t as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-D7CXgzhH.js";
import {
  o as withoutPluginInstallRecords,
  s as writePersistedInstalledPluginIndexInstallRecords,
  t as PLUGIN_INSTALLS_CONFIG_PATH,
} from "./installed-plugin-index-records-BP7rp3ti.js";
import {
  a as resolveRetainedManagedNpmInstallMarkerPath,
  i as markRetainedManagedNpmInstall,
  n as clearRetainedManagedNpmInstallMarker,
  o as resolveRetainedManagedNpmInstallPackageInfo,
} from "./managed-npm-retention-Ddwq8V0k.js";
import { i as isPathInside } from "./path-DILYn_gk.js";
import { t as extractShippedPluginInstallConfigRecords } from "./plugin-install-config-migration-Ba4BJKHA.js";
import { _ as resolveConfigWriteAfterWrite } from "./runtime-snapshot-BbbqRiDR.js";
import { a as planPluginUninstall } from "./uninstall-gwewgRmX.js";
//#region src/plugins/install-record-commit.ts
function mergeUnsetPaths(left, right) {
  const merged = [...(left ?? []), ...(right ?? [])];
  return merged.length > 0 ? merged : void 0;
}
/** Return whether config still contains legacy/transient plugin install records. */
function hasPendingPluginInstallRecords(config) {
  return Object.keys(config.plugins?.installs ?? {}).length > 0;
}
/** Find pending install records that match the base config and can be stripped as unchanged. */
function unchangedPendingPluginInstallRecordIds(config, baseConfig) {
  const pendingInstalls = config.plugins?.installs ?? {};
  return Object.entries(baseConfig.plugins?.installs ?? {})
    .filter(([pluginId, baseInstall]) => isDeepStrictEqual(pendingInstalls[pluginId], baseInstall))
    .map(([pluginId]) => pluginId);
}
/** Remove pending plugin install records from config, optionally only for selected ids. */
function stripPendingPluginInstallRecords(config, pluginIds) {
  if (!pluginIds) return withoutPluginInstallRecords(config);
  const removeIds = new Set(pluginIds);
  if (removeIds.size === 0 || !config.plugins?.installs) return config;
  const remainingInstalls = Object.fromEntries(
    Object.entries(config.plugins.installs).filter(([pluginId]) => !removeIds.has(pluginId)),
  );
  if (Object.keys(remainingInstalls).length === 0) return withoutPluginInstallRecords(config);
  return {
    ...config,
    plugins: {
      ...config.plugins,
      installs: remainingInstalls,
    },
  };
}
const PLUGIN_SOURCE_CHANGED_RESTART_REASON = "plugin source changed";
function mergeAfterWrite(writeOptions, afterWrite) {
  if (afterWrite === void 0) return writeOptions;
  return {
    ...writeOptions,
    afterWrite,
  };
}
function installPathsOverlap(left, right) {
  const resolvedLeft = path.resolve(left);
  const resolvedRight = path.resolve(right);
  return (
    resolvedLeft === resolvedRight ||
    isPathInside(resolvedLeft, resolvedRight) ||
    isPathInside(resolvedRight, resolvedLeft)
  );
}
function resolveRetainedManagedNpmInstallMarkerTarget(params) {
  if (params.previousRecord?.source !== "npm" || params.nextRecord?.source !== "npm") return null;
  const previousInstallPath = params.previousRecord.installPath?.trim();
  const nextInstallPath = params.nextRecord.installPath?.trim();
  if (!previousInstallPath || !nextInstallPath) return null;
  if (installPathsOverlap(previousInstallPath, nextInstallPath)) return null;
  const plan = planPluginUninstall({
    config: { plugins: { installs: { [params.pluginId]: params.previousRecord } } },
    pluginId: params.pluginId,
    deleteFiles: true,
  });
  if (
    !plan.ok ||
    !plan.directoryRemoval ||
    plan.directoryRemoval.cleanup?.kind !== "npm" ||
    path.resolve(plan.directoryRemoval.target) !== path.resolve(previousInstallPath)
  )
    return null;
  if (installPathsOverlap(plan.directoryRemoval.target, nextInstallPath)) return null;
  return plan.directoryRemoval.target;
}
function resolveNpmInstallRecordPackageName(record) {
  if (record.source !== "npm" || !record.installPath?.trim()) return null;
  return resolveRetainedManagedNpmInstallPackageInfo(record.installPath)?.packageName ?? null;
}
function findReplacementNpmRecordForRemovedRecord(params) {
  const previousPackageName = resolveNpmInstallRecordPackageName(params.previousRecord);
  if (!previousPackageName) return null;
  for (const nextRecord of Object.values(params.nextInstallRecords))
    if (resolveNpmInstallRecordPackageName(nextRecord) === previousPackageName) return nextRecord;
  return null;
}
async function markRetainedReplacedManagedNpmInstallRecords(params) {
  const markedPreviousPluginIds = /* @__PURE__ */ new Set();
  const markReplacement = async (pluginId, previousRecord, nextRecord) => {
    const packageDir = resolveRetainedManagedNpmInstallMarkerTarget({
      pluginId,
      previousRecord,
      nextRecord,
    });
    if (!packageDir) return;
    const markerPath = resolveRetainedManagedNpmInstallMarkerPath(packageDir);
    const markerAlreadyExisted = fs.existsSync(markerPath);
    if (
      (await markRetainedManagedNpmInstall({
        packageDir,
        pluginId,
        reason: "replaced-by-managed-npm-generation-update",
      })) &&
      !markerAlreadyExisted
    )
      params.createdMarkerPaths.push(markerPath);
    markedPreviousPluginIds.add(pluginId);
  };
  for (const [pluginId, nextRecord] of Object.entries(params.nextInstallRecords))
    await markReplacement(pluginId, params.previousInstallRecords[pluginId], nextRecord);
  for (const [pluginId, previousRecord] of Object.entries(params.previousInstallRecords)) {
    if (markedPreviousPluginIds.has(pluginId) || params.nextInstallRecords[pluginId]) continue;
    await markReplacement(
      pluginId,
      previousRecord,
      findReplacementNpmRecordForRemovedRecord({
        previousRecord,
        nextInstallRecords: params.nextInstallRecords,
      }) ?? void 0,
    );
  }
}
async function removeCreatedRetainedManagedNpmInstallMarkers(markerPaths) {
  for (const markerPath of markerPaths) await fs.promises.rm(markerPath, { force: true });
}
async function clearActiveRetainedManagedNpmInstallMarkers(nextInstallRecords) {
  const clearedMarkers = [];
  for (const record of Object.values(nextInstallRecords)) {
    if (record.source !== "npm" || !record.installPath?.trim()) continue;
    let markerPath;
    try {
      markerPath = resolveRetainedManagedNpmInstallMarkerPath(record.installPath);
    } catch {
      continue;
    }
    let contents;
    try {
      contents = await fs.promises.readFile(markerPath, "utf8");
    } catch (error) {
      if (error.code === "ENOENT") continue;
      throw error;
    }
    if (await clearRetainedManagedNpmInstallMarker(record.installPath))
      clearedMarkers.push({
        markerPath,
        contents,
      });
  }
  return clearedMarkers;
}
async function restoreClearedRetainedManagedNpmInstallMarkers(markerSnapshots) {
  for (const snapshot of markerSnapshots) {
    await fs.promises.mkdir(path.dirname(snapshot.markerPath), { recursive: true });
    await fs.promises.writeFile(snapshot.markerPath, snapshot.contents, "utf8");
  }
}
async function commitPluginInstallRecordsWithWriter(params) {
  const previousInstallRecords =
    params.previousInstallRecords ?? (await loadInstalledPluginIndexInstallRecords());
  const retainedMarkerPaths = [];
  const clearedMarkerSnapshots = [];
  try {
    await writePersistedInstalledPluginIndexInstallRecords(params.nextInstallRecords);
    try {
      await markRetainedReplacedManagedNpmInstallRecords({
        previousInstallRecords,
        nextInstallRecords: params.nextInstallRecords,
        createdMarkerPaths: retainedMarkerPaths,
      });
      clearedMarkerSnapshots.push(
        ...(await clearActiveRetainedManagedNpmInstallMarkers(params.nextInstallRecords)),
      );
      const installRecordsChanged = !isDeepStrictEqual(
        previousInstallRecords,
        params.nextInstallRecords,
      );
      return await params.commit(params.nextConfig, {
        ...params.writeOptions,
        ...(installRecordsChanged && params.writeOptions?.afterWrite === void 0
          ? {
              afterWrite: {
                mode: "restart",
                reason: PLUGIN_SOURCE_CHANGED_RESTART_REASON,
              },
            }
          : {}),
        unsetPaths: mergeUnsetPaths(params.writeOptions?.unsetPaths, [
          Array.from(PLUGIN_INSTALLS_CONFIG_PATH),
        ]),
      });
    } catch (error) {
      try {
        await writePersistedInstalledPluginIndexInstallRecords(previousInstallRecords);
      } catch (rollbackError) {
        throw new Error(
          "Failed to commit plugin install records and could not restore the previous plugin index",
          { cause: rollbackError },
        );
      }
      throw error;
    }
  } catch (error) {
    await restoreClearedRetainedManagedNpmInstallMarkers(clearedMarkerSnapshots);
    await removeCreatedRetainedManagedNpmInstallMarkers(retainedMarkerPaths);
    throw error;
  }
}
/** Persist plugin install records and commit the matching config update to disk. */
async function commitPluginInstallRecordsWithConfig(params) {
  await commitPluginInstallRecordsWithWriter({
    ...params,
    commit: async (nextConfig, writeOptions) => {
      return await replaceConfigFile({
        nextConfig,
        ...(params.baseHash !== void 0 ? { baseHash: params.baseHash } : {}),
        ...(writeOptions ? { writeOptions } : {}),
      });
    },
  });
}
/** Commit config while migrating any pending install records into the install index. */
async function commitConfigWriteWithPendingPluginInstalls(params) {
  const sourceInstallRecords = extractShippedPluginInstallConfigRecords(params.sourceConfig);
  const nextPendingConfig = params.sourceConfig
    ? stripPendingPluginInstallRecords(
        params.nextConfig,
        unchangedPendingPluginInstallRecordIds(params.nextConfig, {
          plugins: { installs: sourceInstallRecords },
        }),
      )
    : params.nextConfig;
  if (
    Object.keys(sourceInstallRecords).length === 0 &&
    !hasPendingPluginInstallRecords(nextPendingConfig)
  ) {
    const committed = params.writeOptions
      ? await params.commit(params.nextConfig, params.writeOptions)
      : await params.commit(params.nextConfig);
    return {
      config: params.nextConfig,
      installRecords: {},
      movedInstallRecords: false,
      persistedHash: committed?.persistedHash ?? null,
    };
  }
  const pendingInstallRecords = nextPendingConfig.plugins?.installs ?? {};
  const previousInstallRecords = await loadInstalledPluginIndexInstallRecords();
  const nextInstallRecords = {
    ...sourceInstallRecords,
    ...previousInstallRecords,
    ...pendingInstallRecords,
  };
  const strippedConfig = withoutPluginInstallRecords(params.nextConfig);
  return {
    config: strippedConfig,
    installRecords: nextInstallRecords,
    movedInstallRecords: true,
    persistedHash:
      (
        await commitPluginInstallRecordsWithWriter({
          previousInstallRecords,
          nextInstallRecords,
          nextConfig: strippedConfig,
          ...(params.writeOptions ? { writeOptions: params.writeOptions } : {}),
          commit: params.commit,
        })
      )?.persistedHash ?? null,
  };
}
/** Replace the config file after moving pending plugin install records into the install index. */
async function commitConfigWithPendingPluginInstalls(params) {
  return await commitConfigWriteWithPendingPluginInstalls({
    nextConfig: params.nextConfig,
    ...(params.writeOptions ? { writeOptions: params.writeOptions } : {}),
    commit: async (nextConfig, writeOptions) => {
      return await replaceConfigFile({
        nextConfig,
        ...(params.baseHash !== void 0 ? { baseHash: params.baseHash } : {}),
        ...(writeOptions ? { writeOptions } : {}),
      });
    },
  });
}
/** Transform config with retry support while preserving plugin install index consistency. */
async function transformConfigWithPendingPluginInstalls(params) {
  const commit = async ({ nextConfig, snapshot, baseHash, writeOptions }) => {
    const requestedAfterWrite = params.afterWrite ?? params.writeOptions?.afterWrite;
    const committed = await commitConfigWriteWithPendingPluginInstalls({
      nextConfig,
      sourceConfig: snapshot.sourceConfig,
      ...(writeOptions ? { writeOptions: mergeAfterWrite(writeOptions, params.afterWrite) } : {}),
      commit: async (config, commitWriteOptions) => {
        return await replaceConfigFile({
          nextConfig: config,
          snapshot,
          writeOptions: commitWriteOptions ?? {},
          ...(baseHash !== void 0 ? { baseHash } : {}),
        });
      },
    });
    const afterWrite = resolveConfigWriteAfterWrite(
      requestedAfterWrite ??
        (committed.movedInstallRecords
          ? {
              mode: "restart",
              reason: PLUGIN_SOURCE_CHANGED_RESTART_REASON,
            }
          : void 0),
    );
    return {
      config: committed.config,
      persistedHash: committed.persistedHash,
      afterWrite,
    };
  };
  return await transformConfigFileWithRetry({
    ...params,
    commit,
  });
}
//#endregion
export {
  stripPendingPluginInstallRecords as a,
  hasPendingPluginInstallRecords as i,
  commitConfigWriteWithPendingPluginInstalls as n,
  transformConfigWithPendingPluginInstalls as o,
  commitPluginInstallRecordsWithConfig as r,
  unchangedPendingPluginInstallRecordIds as s,
  commitConfigWithPendingPluginInstalls as t,
};
