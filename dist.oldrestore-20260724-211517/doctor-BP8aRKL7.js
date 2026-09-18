import crypto from "node:crypto";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import {
  n as withDoctorSqliteMaintenanceLock,
  t as isDestructiveDoctorSessionSqliteMode,
} from "./doctor-sqlite-maintenance-lock-BQtWhmOs.js";
import { r as readPersistedInstalledPluginIndex } from "./installed-plugin-index-store-XopnPfaM.js";
import { M as resolveSqliteDatabaseFilePaths } from "./openclaw-state-db-Bsa8Tv1Z.js";
import { r as validatePackageExtensionEntriesForInstall } from "./package-entry-resolution-BGL_bDuB.js";
import { i as writeRuntimeJson, r as defaultRuntime } from "./runtime-Bz6o617W.js";
import {
  a as resolveSessionStoreTargets,
  o as resolveSqliteTargetFromSessionStorePath,
} from "./targets-CjMfpXbt.js";
//#region src/commands/doctor-post-upgrade.types.ts
/** Probe codes emitted by post-upgrade validation. */
const POST_UPGRADE_PROBE_CODES = [
  "plugin.index_unavailable",
  "plugin.entry_unresolved",
  "plugin.manifest_drift",
];
//#endregion
//#region src/commands/doctor-post-upgrade.ts
/** Post-upgrade validation probes for persisted plugin index and package extension entries. */
function buildReport(findings) {
  return {
    probesRun: [...POST_UPGRADE_PROBE_CODES],
    findings,
  };
}
function isInstallsJson(value) {
  return (
    typeof value === "object" &&
    value !== null &&
    Array.isArray(value.plugins) &&
    value.plugins.every(isInstalledPluginRecord)
  );
}
function isOptionalString(value) {
  return value === void 0 || typeof value === "string";
}
function isPackageJsonRef(value) {
  return (
    value === void 0 ||
    (typeof value === "object" && value !== null && typeof value.path === "string")
  );
}
function isSourceCheckoutPluginRecord(record) {
  if (record.origin === "workspace" || record.origin === "config") return true;
  return record.origin === "bundled" && isBundledSourceCheckoutPluginRoot(record.rootDir);
}
function isBundledSourceCheckoutPluginRoot(pluginRootDir) {
  let current = path.resolve(pluginRootDir);
  while (true) {
    const extensionsDir = path.dirname(current);
    if (path.basename(extensionsDir) === "extensions") {
      const packageRoot = path.dirname(extensionsDir);
      return (
        fs.existsSync(path.join(packageRoot, ".git")) &&
        fs.existsSync(path.join(packageRoot, "pnpm-workspace.yaml")) &&
        fs.existsSync(path.join(packageRoot, "src"))
      );
    }
    const next = path.dirname(current);
    if (next === current) return false;
    current = next;
  }
}
function isInstalledPluginRecord(value) {
  if (typeof value !== "object" || value === null) return false;
  const record = value;
  return (
    typeof record.pluginId === "string" &&
    typeof record.rootDir === "string" &&
    typeof record.enabled === "boolean" &&
    isOptionalString(record.origin) &&
    isPackageJsonRef(record.packageJson) &&
    isOptionalString(record.manifestPath) &&
    isOptionalString(record.manifestHash)
  );
}
async function readInstallsJson(installsPath) {
  try {
    const installsRaw = await fs$1.readFile(installsPath, "utf-8");
    const installs = JSON.parse(installsRaw);
    return isInstallsJson(installs) ? installs : null;
  } catch {
    return null;
  }
}
async function readInstalledPluginIndex(params) {
  if (params.installsPath) return await readInstallsJson(params.installsPath);
  const index = await readPersistedInstalledPluginIndex(
    params.stateDir ? { stateDir: params.stateDir } : {},
  );
  return index && isInstallsJson(index) ? { plugins: [...index.plugins] } : null;
}
async function readInstalledPackageJson(rootDir, packageJsonRelPath) {
  const absPath = path.join(rootDir, packageJsonRelPath);
  const raw = await fs$1.readFile(absPath, "utf-8");
  return JSON.parse(raw);
}
async function resolvePackageJsonRelPath(record) {
  if (record.packageJson) return record.packageJson.path;
  try {
    await fs$1.access(path.join(record.rootDir, "package.json"));
    return "package.json";
  } catch {
    return;
  }
}
async function sha256OfFile(absPath) {
  try {
    const raw = await fs$1.readFile(absPath);
    return crypto.createHash("sha256").update(raw).digest("hex");
  } catch {
    return null;
  }
}
/** Runs post-upgrade plugin probes and returns structured findings for the caller to render. */
async function runPostUpgradeProbes(params) {
  const findings = [];
  const installs = await readInstalledPluginIndex(params);
  if (!installs) {
    findings.push({
      level: "error",
      code: "plugin.index_unavailable",
      message:
        "Installed plugin index is missing, unreadable, or malformed. Run `openclaw plugins registry --refresh` to rebuild it before post-upgrade validation.",
    });
    return buildReport(findings);
  }
  for (const record of installs.plugins) {
    if (!record.enabled) continue;
    const pkgRelPath = await resolvePackageJsonRelPath(record);
    if (pkgRelPath) {
      let pkg;
      try {
        pkg = await readInstalledPackageJson(record.rootDir, pkgRelPath);
      } catch (err) {
        process.stderr.write(
          `[doctor-post-upgrade] could not read package.json for ${record.pluginId} at ${record.rootDir}: ${err instanceof Error ? err.message : String(err)}\n`,
        );
        continue;
      }
      const entries = pkg.openclaw?.extensions ?? [];
      if (entries.length > 0) {
        const validation = await validatePackageExtensionEntriesForInstall({
          packageDir: record.rootDir,
          extensions: [...entries],
          manifest: pkg,
          allowSourceTypeScriptEntries: isSourceCheckoutPluginRecord(record),
        });
        if (!validation.ok) {
          const offendingEntry = entries.find((entry) => validation.error.includes(entry));
          findings.push({
            level: "error",
            code: "plugin.entry_unresolved",
            message: `Plugin ${record.pluginId}: ${validation.error}`,
            plugin: record.pluginId,
            ...(offendingEntry ? { entry: offendingEntry } : {}),
          });
        }
      }
    }
    if (record.manifestPath && record.manifestHash) {
      const currentHash = await sha256OfFile(record.manifestPath);
      if (currentHash && currentHash !== record.manifestHash)
        findings.push({
          level: "warn",
          code: "plugin.manifest_drift",
          message: `Plugin ${record.pluginId} manifest hash drifted from installs.json snapshot. Run \`openclaw plugins registry --refresh\` to re-sync.`,
          plugin: record.pluginId,
        });
    }
  }
  return buildReport(findings);
}
//#endregion
//#region src/commands/doctor.ts
/** Top-level doctor command wrapper, including post-upgrade probe mode. */
function resolveExplicitSessionSqliteMaintenancePaths(options) {
  if (!options.sessionSqliteStore) return [];
  const targets = resolveSessionStoreTargets(
    {},
    {
      store: options.sessionSqliteStore,
      ...(options.sessionSqliteAgent ? { agent: options.sessionSqliteAgent } : {}),
      ...(options.sessionSqliteAllAgents ? { allAgents: true } : {}),
    },
    { env: process.env },
  );
  const protectedPaths = /* @__PURE__ */ new Set();
  for (const target of targets) {
    protectedPaths.add(target.storePath);
    const sqlitePath = resolveSqliteTargetFromSessionStorePath(target.storePath, {
      agentId: target.agentId,
    }).path;
    if (sqlitePath)
      for (const databasePath of resolveSqliteDatabaseFilePaths(sqlitePath))
        protectedPaths.add(databasePath);
  }
  return [...protectedPaths];
}
/** Runs doctor or the post-upgrade probe submode using the provided runtime. */
async function doctorCommand(runtime, options) {
  if (options?.stateSqlite) {
    const outputRuntime = runtime ?? defaultRuntime;
    const { runDoctorStateSqliteCompact } =
      await import("./doctor-state-sqlite-compact-BK_DARNx.js");
    const report = await runDoctorStateSqliteCompact();
    if (options.json) writeRuntimeJson(outputRuntime, report);
    else if (report.skipped)
      outputRuntime.log(`state-sqlite compact: skipped; database missing at ${report.path}`);
    else {
      outputRuntime.log(
        `state-sqlite compact: reclaimed=${report.reclaimedBytes} bytes, db=${report.before.dbSizeBytes}->${report.after.dbSizeBytes} bytes, wal=${report.before.walSizeBytes}->${report.after.walSizeBytes} bytes`,
      );
      outputRuntime.log(
        `- freelist=${report.before.freelistPages}->${report.after.freelistPages} pages, page-size=${report.after.pageSizeBytes} bytes, auto-vacuum=${report.before.autoVacuum}->${report.after.autoVacuum}`,
      );
      outputRuntime.log(
        `- quick-check=${report.quickCheck}, integrity-check=${report.integrityCheck}, path=${report.path}`,
      );
    }
    outputRuntime.exit(0);
    return;
  }
  if (options?.sessionSqlite) {
    const outputRuntime = runtime ?? defaultRuntime;
    const sessionSqliteMode = options.sessionSqlite;
    const { runDoctorSessionSqlite } = await import("./doctor-session-sqlite-CDz9_beS.js");
    const runSessionSqlite = async () =>
      await runDoctorSessionSqlite({
        mode: sessionSqliteMode,
        ...(options.sessionSqliteStore ? { store: options.sessionSqliteStore } : {}),
        ...(options.sessionSqliteAgent ? { agent: options.sessionSqliteAgent } : {}),
        ...(options.sessionSqliteAllAgents ? { allAgents: true } : {}),
      });
    const report = isDestructiveDoctorSessionSqliteMode(sessionSqliteMode)
      ? await withDoctorSqliteMaintenanceLock({
          env: process.env,
          operation: `session SQLite ${sessionSqliteMode}`,
          ...(options.sessionSqliteStore
            ? { protectedPaths: resolveExplicitSessionSqliteMaintenancePaths(options) }
            : {}),
          run: runSessionSqlite,
        })
      : await runSessionSqlite();
    if (sessionSqliteMode === "recover" && options.sessionSqliteGithubIssue === true)
      await maybeCreateSessionSqliteGithubIssue(outputRuntime, report, options);
    if (options.json) writeRuntimeJson(outputRuntime, report);
    else {
      outputRuntime.log(
        `session-sqlite ${report.mode}: ${report.totals.targets} target(s), ${report.totals.legacyEntries} legacy entries, ${report.totals.sqliteEntries} sqlite entries, ${report.totals.issues} issue(s)`,
      );
      if (report.migrationRun) {
        outputRuntime.log(`- migration-run=${report.migrationRun.runId}`);
        outputRuntime.log(`- manifest=${report.migrationRun.manifestPath}`);
        if (report.migrationRun.failureReportMarkdownPath)
          outputRuntime.log(`- failure-report=${report.migrationRun.failureReportMarkdownPath}`);
      }
      if (report.supportIssue) {
        outputRuntime.log(`- support-issue-report=${report.supportIssue.bodyPath ?? "inline"}`);
        outputRuntime.log(`- support-issue-url=${report.supportIssue.url}`);
      }
      for (const target of report.targets) {
        outputRuntime.log(
          `- ${target.agentId}: imported=${target.importedEntries}/${target.importedTranscriptEvents} events, validated=${target.validatedEntries}/${target.validatedTranscriptEvents} events, archived-unreferenced-jsonl=${target.archivedUnreferencedJsonlFiles.length}, unreferenced-jsonl=${target.unreferencedJsonlFiles.length}`,
        );
        if (target.restore)
          outputRuntime.log(
            `  restored=${target.restore.restoredFiles.length}, skipped=${target.restore.skippedFiles.length}, conflicts=${target.restore.conflicts.length}, manifests=${target.restore.manifestPaths.length}`,
          );
        if (target.compact)
          outputRuntime.log(
            `  compact reclaimed=${target.compact.reclaimedBytes} bytes, db=${target.compact.dbSizeBeforeBytes}->${target.compact.dbSizeAfterBytes} bytes, wal=${target.compact.walSizeBeforeBytes}->${target.compact.walSizeAfterBytes} bytes`,
          );
        if (target.corruptRecovery)
          outputRuntime.log(
            `  corrupt-db-recovery moved=${target.corruptRecovery.movedFiles.length}, skipped=${target.corruptRecovery.skippedFiles.length}`,
          );
        for (const issue of target.issues.slice(0, 10))
          outputRuntime.log(
            `  [${issue.code}]${issue.sessionKey ? ` ${issue.sessionKey}:` : ""} ${issue.message}`,
          );
        if (target.issues.length > 10)
          outputRuntime.log(`  ...and ${target.issues.length - 10} more issue(s)`);
      }
    }
    outputRuntime.exit(report.totals.issues > 0 ? 1 : 0);
    return;
  }
  if (options?.postUpgrade) {
    const outputRuntime = runtime ?? defaultRuntime;
    const report = await runPostUpgradeProbes({});
    if (options.json) writeRuntimeJson(outputRuntime, report);
    else {
      for (const f of report.findings) outputRuntime.log(`[${f.level}] ${f.code}: ${f.message}`);
      if (report.findings.length === 0) outputRuntime.log("post-upgrade: no findings");
    }
    const hasError = report.findings.some((f) => f.level === "error");
    outputRuntime.exit(hasError ? 1 : 0);
    return;
  }
  await (await import("./doctor-health-bYlOU5fT.js")).doctorCommand(runtime, options);
}
async function maybeCreateSessionSqliteGithubIssue(runtime, report, options) {
  const shouldLog = options.json !== true;
  if (!report.supportIssue) {
    if (shouldLog) runtime.log("session-sqlite recover: no support issue payload was generated");
    return;
  }
  let approved = options.yes === true;
  if (!approved && options.nonInteractive !== true && options.json !== true) {
    const { promptYesNo } = await import("./prompt-C8Tlccyz.js");
    approved = await promptYesNo(
      "Create a GitHub issue in openclaw/openclaw with the sanitized recovery report?",
      false,
    );
  }
  if (!approved) {
    report.supportIssue.github = { status: "skipped" };
    if (shouldLog) runtime.log("session-sqlite recover: GitHub issue creation skipped");
    return;
  }
  const { createSessionSqliteGithubIssue } =
    await import("./doctor-session-sqlite-github-issue-p2AJ0saD.js");
  const created = createSessionSqliteGithubIssue(report.supportIssue);
  if (created.ok) {
    report.supportIssue.github = {
      status: "created",
      url: created.url,
    };
    if (shouldLog) runtime.log(`session-sqlite recover: created GitHub issue ${created.url}`);
    return;
  }
  report.supportIssue.github = {
    fallbackUrl: created.fallbackUrl,
    message: created.message,
    status: "failed",
  };
  if (shouldLog) {
    runtime.log(`session-sqlite recover: GitHub issue creation unavailable: ${created.message}`);
    runtime.log(`session-sqlite recover: prefilled issue URL ${created.fallbackUrl}`);
  }
}
//#endregion
export { doctorCommand as t };
