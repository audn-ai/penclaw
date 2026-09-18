import fs from "node:fs";
import path from "node:path";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { a as resolveDefaultPluginNpmDir } from "./install-paths-CqMnrXsY.js";
import "./json-files-CTWRDHag.js";
import { r as loadInstalledPluginIndex } from "./installed-plugin-index-lBfkb-7L.js";
import { t as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-D7CXgzhH.js";
import { c as tryReadJsonSync } from "./json-7OTJmMaB.js";
import { n as saveJsonFile } from "./json-file-DwcpMGrz.js";
import {
  l as listManagedPluginNpmRootsSync,
  r as hasRetainedManagedNpmInstallMarker,
} from "./managed-npm-retention-Ddwq8V0k.js";
import "./installed-plugin-index-records-BP7rp3ti.js";
import { t as note } from "./note-Uvqr4R1d.js";
import {
  i as relinkOpenClawPeerDependenciesInManagedNpmRoot,
  t as auditOpenClawPeerDependenciesInManagedNpmRoot,
} from "./plugin-peer-link-CMrc53yA.js";
import { m as refreshPluginRegistry } from "./plugin-registry-BckMdz4f.js";
import {
  i as preflightPluginRegistryInstallMigration,
  r as migratePluginRegistryForInstall,
  t as DISABLE_PLUGIN_REGISTRY_MIGRATION_ENV,
} from "./plugin-registry-migration-CQMSoKko.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { t as listStaleLocalBundledPluginInstallRecords } from "./stale-local-bundled-plugin-install-records-DU70BZn6.js";
import { h as shortenHomePath } from "./utils-DtcDeqWS.js";
//#region src/commands/doctor-plugin-registry.ts
/** Doctor repairs for stale plugin registry entries, managed npm shadows, and peer links. */
const PLUGIN_REGISTRY_CHECK_ID = "core/doctor/plugin-registry";
function readJsonObject(filePath) {
  const parsed = tryReadJsonSync(filePath);
  return isRecord(parsed) ? parsed : null;
}
function readStringMap(value) {
  if (!isRecord(value)) return {};
  const result = {};
  for (const [key, raw] of Object.entries(value))
    if (typeof raw === "string" && raw.trim()) result[key] = raw.trim();
  return result;
}
function resolveManagedPluginNpmRoot(params) {
  return params.stateDir
    ? path.join(params.stateDir, "npm")
    : resolveDefaultPluginNpmDir(params.env);
}
function listManagedPluginNpmRoots(params) {
  return listManagedPluginNpmRootsSync(resolveManagedPluginNpmRoot(params));
}
function deleteObjectKey(record, key) {
  if (!Object.hasOwn(record, key)) return false;
  delete record[key];
  return true;
}
function readPackageVersion(packageDir) {
  const version = readJsonObject(path.join(packageDir, "package.json"))?.version;
  return typeof version === "string" && version.trim() ? version.trim() : void 0;
}
function readPluginManifestId(packageDir) {
  const id = readJsonObject(path.join(packageDir, "openclaw.plugin.json"))?.id;
  return typeof id === "string" && id.trim() ? id.trim() : void 0;
}
function listStaleManagedNpmBundledPlugins(params) {
  const currentBundled = loadInstalledPluginIndex({
    ...params,
    installRecords: {},
  }).plugins.filter((plugin) => plugin.origin === "bundled" && plugin.packageName);
  const bundledByPackage = new Map(currentBundled.map((plugin) => [plugin.packageName, plugin]));
  const stale = [];
  for (const npmRoot of listManagedPluginNpmRoots(params)) {
    const dependencies = readStringMap(
      readJsonObject(path.join(npmRoot, "package.json"))?.dependencies,
    );
    for (const packageName of Object.keys(dependencies).toSorted((left, right) =>
      left.localeCompare(right),
    )) {
      if (!packageName.startsWith("@openclaw/")) continue;
      const bundled = bundledByPackage.get(packageName);
      if (!bundled) continue;
      const packageDir = path.join(npmRoot, "node_modules", ...packageName.split("/"));
      if (hasRetainedManagedNpmInstallMarker(packageDir)) continue;
      const pluginId = readPluginManifestId(packageDir);
      if (!pluginId || pluginId !== bundled.pluginId) continue;
      stale.push({
        pluginId,
        packageName,
        packageDir,
        npmRoot,
        ...(readPackageVersion(packageDir) ? { version: readPackageVersion(packageDir) } : {}),
      });
    }
  }
  return stale;
}
function loadCurrentBundledPluginSources(params) {
  const currentBundled = loadInstalledPluginIndex({
    ...params,
    installRecords: {},
  }).plugins.filter((plugin) => plugin.origin === "bundled");
  return new Map(
    currentBundled.map((plugin) => [
      plugin.pluginId,
      {
        pluginId: plugin.pluginId,
        localPath: plugin.rootDir,
        ...(plugin.packageName ? { npmSpec: plugin.packageName } : {}),
        ...(plugin.packageVersion ? { version: plugin.packageVersion } : {}),
      },
    ]),
  );
}
async function listStaleLocalBundledPluginInstallRecordShadows(params) {
  return listStaleLocalBundledPluginInstallRecords({
    installRecords: await loadInstalledPluginIndexInstallRecords(params),
    workspaceDir: params.workspaceDir,
    env: params.env,
    bundled: loadCurrentBundledPluginSources(params),
  });
}
function removeManagedNpmDependency(params) {
  const npmPackageJsonPath = path.join(params.npmRoot, "package.json");
  const packageJson = readJsonObject(npmPackageJsonPath) ?? {};
  const dependencies = readStringMap(packageJson.dependencies);
  delete dependencies[params.packageName];
  saveJsonFile(
    npmPackageJsonPath,
    Object.keys(dependencies).length === 0
      ? (() => {
          const { dependencies: _dependencies, ...rest } = packageJson;
          return rest;
        })()
      : {
          ...packageJson,
          dependencies,
        },
  );
  removeManagedNpmPackageLockDependency(params);
  fs.rmSync(params.packageDir, {
    recursive: true,
    force: true,
  });
  const scopeDir = path.dirname(params.packageDir);
  if (path.basename(path.dirname(scopeDir)) === "node_modules")
    try {
      fs.rmdirSync(scopeDir);
    } catch {}
}
function removeManagedNpmPackageLockDependency(params) {
  const packageLockPath = path.join(params.npmRoot, "package-lock.json");
  const packageLock = readJsonObject(packageLockPath);
  if (!packageLock) return;
  let changed = false;
  const packages = packageLock.packages;
  if (isRecord(packages)) {
    const rootPackage = packages[""];
    if (isRecord(rootPackage)) {
      const rootDependencies = readStringMap(rootPackage.dependencies);
      if (deleteObjectKey(rootDependencies, params.packageName)) {
        changed = true;
        if (Object.keys(rootDependencies).length === 0) delete rootPackage.dependencies;
        else rootPackage.dependencies = rootDependencies;
      }
    }
    changed = deleteObjectKey(packages, `node_modules/${params.packageName}`) || changed;
  }
  const dependencies = packageLock.dependencies;
  if (isRecord(dependencies))
    changed = deleteObjectKey(dependencies, params.packageName) || changed;
  if (changed) saveJsonFile(packageLockPath, packageLock);
}
/** Removes managed npm packages that shadow current bundled plugins when repair is enabled. */
function maybeRepairStaleManagedNpmBundledPlugins(params) {
  const stale = listStaleManagedNpmBundledPlugins(params);
  if (stale.length === 0) return false;
  if (!params.prompter.shouldRepair) {
    note(
      [
        "Managed npm plugin packages shadow bundled plugins:",
        ...stale.map(
          (plugin) =>
            `- ${plugin.pluginId}: ${plugin.packageName}${plugin.version ? `@${plugin.version}` : ""}`,
        ),
        `Repair with ${formatCliCommand("openclaw doctor --fix")} to remove stale managed npm packages and rebuild the plugin registry.`,
      ].join("\n"),
      "Plugin registry",
    );
    return false;
  }
  for (const plugin of stale) removeManagedNpmDependency(plugin);
  note(
    [
      "Removed stale managed npm plugin package(s) shadowing bundled plugins:",
      ...stale.map(
        (plugin) =>
          `- ${plugin.pluginId}: ${plugin.packageName}${plugin.version ? `@${plugin.version}` : ""}`,
      ),
    ].join("\n"),
    "Plugin registry",
  );
  return true;
}
/** Removes local install records that shadow current bundled plugin sources. */
async function maybeRepairStaleLocalBundledPluginInstallRecords(params) {
  const stale = await listStaleLocalBundledPluginInstallRecordShadows(params);
  if (stale.length === 0) return [];
  if (!params.prompter.shouldRepair) {
    note(
      [
        "Local bundled plugin install records shadow bundled plugins:",
        ...stale.map((record) => `- ${record.pluginId}: ${shortenHomePath(record.stalePath)}`),
        `Repair with ${formatCliCommand("openclaw doctor --fix")} to remove stale local install records and rebuild the plugin registry.`,
      ].join("\n"),
      "Plugin registry",
    );
    return [];
  }
  note(
    [
      "Removed stale local bundled plugin install record(s) shadowing bundled plugins:",
      ...stale.map((record) => `- ${record.pluginId}: ${shortenHomePath(record.stalePath)}`),
    ].join("\n"),
    "Plugin registry",
  );
  return stale.map((record) => record.pluginId);
}
/** Relinks managed npm plugin packages to the current OpenClaw host packages. */
async function maybeRepairManagedNpmOpenClawPeerLinks(params) {
  const npmRoots = listManagedPluginNpmRoots(params);
  if (!params.prompter.shouldRepair) {
    const issues = (
      await Promise.all(
        npmRoots.map((npmRoot) => auditOpenClawPeerDependenciesInManagedNpmRoot({ npmRoot })),
      )
    ).flatMap((audit) => audit.issues);
    if (issues.length > 0)
      note(
        [
          "Managed npm OpenClaw host peer links need repair:",
          ...issues.map((issue) => `- ${issue.packageName}: ${issue.reason}`),
          `Repair with ${formatCliCommand("openclaw doctor --fix")} to relink managed npm plugin packages.`,
        ].join("\n"),
        "Plugin registry",
      );
    return false;
  }
  const messages = [];
  const logger = {
    info: (message) =>
      messages.push({
        level: "info",
        message,
      }),
    warn: (message) =>
      messages.push({
        level: "warn",
        message,
      }),
  };
  const repaired = (
    await Promise.all(
      npmRoots.map((npmRoot) =>
        relinkOpenClawPeerDependenciesInManagedNpmRoot({
          npmRoot,
          logger,
        }),
      ),
    )
  ).reduce((total, result) => total + result.repaired, 0);
  if (repaired > 0)
    note(
      `Repaired OpenClaw host peer link(s) for ${repaired} managed npm plugin package(s).`,
      "Plugin registry",
    );
  const warnings = messages
    .filter((message) => message.level === "warn")
    .map((message) => `- ${message.message}`);
  if (warnings.length > 0)
    note(
      ["Could not repair all managed npm OpenClaw host peer links:", ...warnings].join("\n"),
      "Plugin registry",
    );
  return repaired > 0;
}
async function loadInstallRecordsWithoutPluginIds(params, pluginIds) {
  const records = await loadInstalledPluginIndexInstallRecords(params);
  for (const pluginId of pluginIds) delete records[pluginId];
  return records;
}
async function listManagedNpmOpenClawPeerLinkIssues(params) {
  return (
    await Promise.all(
      listManagedPluginNpmRoots(params).map((npmRoot) =>
        auditOpenClawPeerDependenciesInManagedNpmRoot({ npmRoot }),
      ),
    )
  ).flatMap((audit) => audit.issues);
}
async function detectPluginRegistryHealthIssues(params) {
  const preflight = preflightPluginRegistryInstallMigration(params);
  const issues = [];
  if (preflight.action === "migrate")
    issues.push({
      kind: "registry-missing-or-stale",
      path: preflight.filePath,
    });
  for (const plugin of listStaleManagedNpmBundledPlugins(params))
    issues.push({
      kind: "stale-managed-npm-bundled-plugin",
      pluginId: plugin.pluginId,
      packageName: plugin.packageName,
      packageDir: plugin.packageDir,
      npmRoot: plugin.npmRoot,
      ...(plugin.version ? { version: plugin.version } : {}),
    });
  for (const record of await listStaleLocalBundledPluginInstallRecordShadows(params))
    issues.push({
      kind: "stale-local-bundled-plugin-install-record",
      pluginId: record.pluginId,
      stalePath: record.stalePath,
    });
  for (const issue of await listManagedNpmOpenClawPeerLinkIssues(params))
    issues.push({
      kind: "managed-npm-openclaw-peer-link",
      packageName: issue.packageName,
      packageDir: issue.packageDir,
      reason: issue.reason,
    });
  return issues;
}
function pluginRegistryIssueToHealthFinding(issue) {
  switch (issue.kind) {
    case "registry-missing-or-stale":
      return {
        checkId: PLUGIN_REGISTRY_CHECK_ID,
        severity: "warning",
        message: "Persisted plugin registry is missing or stale.",
        path: issue.path,
        fixHint: "Run `openclaw doctor --fix` to rebuild the plugin registry from enabled plugins.",
      };
    case "stale-managed-npm-bundled-plugin":
      return {
        checkId: PLUGIN_REGISTRY_CHECK_ID,
        severity: "warning",
        message: `Managed npm package ${issue.packageName}${issue.version ? `@${issue.version}` : ""} shadows bundled plugin ${issue.pluginId}.`,
        path: issue.packageDir,
        target: issue.pluginId,
        fixHint:
          "Run `openclaw doctor --fix` to remove stale managed npm packages and rebuild the plugin registry.",
      };
    case "stale-local-bundled-plugin-install-record":
      return {
        checkId: PLUGIN_REGISTRY_CHECK_ID,
        severity: "warning",
        message: `Local install record for bundled plugin ${issue.pluginId} points at a stale path.`,
        path: issue.stalePath,
        target: issue.pluginId,
        fixHint:
          "Run `openclaw doctor --fix` to remove stale local install records and rebuild the plugin registry.",
      };
    case "managed-npm-openclaw-peer-link":
      return {
        checkId: PLUGIN_REGISTRY_CHECK_ID,
        severity: "warning",
        message: `Managed npm package ${issue.packageName} has a broken OpenClaw peer link: ${issue.reason}.`,
        path: issue.packageDir,
        target: issue.packageName,
        fixHint: "Run `openclaw doctor --fix` to relink managed npm plugin packages.",
      };
  }
  return assertNeverPluginRegistryIssue(issue);
}
function pluginRegistryIssueToRepairEffect(issue) {
  switch (issue.kind) {
    case "registry-missing-or-stale":
      return {
        kind: "state",
        action: "would-rebuild-plugin-registry",
        target: issue.path,
        dryRunSafe: false,
      };
    case "stale-managed-npm-bundled-plugin":
      return {
        kind: "package",
        action: "would-remove-stale-managed-npm-bundled-plugin",
        target: issue.packageDir,
        dryRunSafe: false,
      };
    case "stale-local-bundled-plugin-install-record":
      return {
        kind: "state",
        action: "would-remove-stale-local-bundled-plugin-install-record",
        target: issue.pluginId,
        dryRunSafe: false,
      };
    case "managed-npm-openclaw-peer-link":
      return {
        kind: "package",
        action: "would-relink-managed-npm-openclaw-peer",
        target: issue.packageDir,
        dryRunSafe: false,
      };
  }
  return assertNeverPluginRegistryIssue(issue);
}
function assertNeverPluginRegistryIssue(issue) {
  throw new Error(`Unhandled plugin registry issue kind: ${String(issue.kind)}`);
}
/**
 * Runs plugin registry doctor repairs and refreshes the persisted plugin index when needed.
 *
 * Stale bundled shadows are removed before registry migration so the rebuilt index resolves the
 * current bundled source instead of an obsolete managed/local install record.
 */
async function maybeRepairPluginRegistryState(params) {
  const preflight = preflightPluginRegistryInstallMigration(params);
  for (const warning of preflight.deprecationWarnings) note(warning, "Plugin registry");
  if (preflight.action === "disabled") {
    note(
      `${DISABLE_PLUGIN_REGISTRY_MIGRATION_ENV} is set; skipping plugin registry repair.`,
      "Plugin registry",
    );
    return params.config;
  }
  const migrationParams = {
    ...params,
    config: params.config,
  };
  const staleManagedNpmBundledPluginIds = listStaleManagedNpmBundledPlugins(params).map(
    (plugin) => plugin.pluginId,
  );
  const removedStaleManagedNpmBundledPlugins = maybeRepairStaleManagedNpmBundledPlugins(params);
  const removedStaleLocalBundledPluginIds =
    await maybeRepairStaleLocalBundledPluginInstallRecords(params);
  const repairedManagedNpmOpenClawPeerLinks = await maybeRepairManagedNpmOpenClawPeerLinks(params);
  const stalePluginIdsToRemove = [
    .../* @__PURE__ */ new Set([
      ...(removedStaleManagedNpmBundledPlugins ? staleManagedNpmBundledPluginIds : []),
      ...removedStaleLocalBundledPluginIds,
    ]),
  ];
  if (!params.prompter.shouldRepair) {
    if (preflight.action === "migrate")
      note(
        [
          "Persisted plugin registry is missing or stale.",
          `Repair with ${formatCliCommand("openclaw doctor --fix")} to rebuild ${shortenHomePath(preflight.filePath)} from enabled plugins.`,
        ].join("\n"),
        "Plugin registry",
      );
    return params.config;
  }
  if (preflight.action === "migrate") {
    const result = await migratePluginRegistryForInstall({
      ...migrationParams,
      ...(stalePluginIdsToRemove.length > 0
        ? {
            installRecords: await loadInstallRecordsWithoutPluginIds(
              params,
              stalePluginIdsToRemove,
            ),
          }
        : {}),
    });
    if (result.migrated) {
      const total = result.current.plugins.length;
      const enabled = result.current.plugins.filter((plugin) => plugin.enabled).length;
      note(
        `Plugin registry rebuilt: ${enabled}/${total} enabled plugins indexed.`,
        "Plugin registry",
      );
    }
    return params.config;
  }
  if (
    preflight.action === "skip-existing" ||
    removedStaleManagedNpmBundledPlugins ||
    removedStaleLocalBundledPluginIds.length > 0 ||
    repairedManagedNpmOpenClawPeerLinks
  ) {
    const index = await refreshPluginRegistry({
      ...migrationParams,
      reason: "migration",
      ...(stalePluginIdsToRemove.length > 0
        ? {
            installRecords: await loadInstallRecordsWithoutPluginIds(
              params,
              stalePluginIdsToRemove,
            ),
          }
        : {}),
    });
    const total = index.plugins.length;
    const enabled = index.plugins.filter((plugin) => plugin.enabled).length;
    note(
      `Plugin registry refreshed: ${enabled}/${total} enabled plugins indexed.`,
      "Plugin registry",
    );
  }
  return params.config;
}
//#endregion
export {
  pluginRegistryIssueToHealthFinding as a,
  maybeRepairStaleManagedNpmBundledPlugins as i,
  maybeRepairManagedNpmOpenClawPeerLinks as n,
  pluginRegistryIssueToRepairEffect as o,
  maybeRepairPluginRegistryState as r,
  detectPluginRegistryHealthIssues as t,
};
