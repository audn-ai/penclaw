import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import {
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
  r as resolveAgentConfig,
} from "./agent-scope-config-DVIR1nBa.js";
import { t as ensureAbsoluteDirectory, v as pathExists } from "./fs-safe-RNq3oO57.js";
import "./agent-scope-y9xQv_q1.js";
import { r as resolveHomeRelativePath } from "./home-dir-DxrrpDft.js";
import {
  n as assertMemoryMigrationSourceRevision,
  t as MAX_MEMORY_MIGRATION_FILE_BYTES,
} from "./memory-migration-source-nm4splyD.js";
import {
  g as redactMigrationPlan,
  l as markMigrationItemConflict,
  n as MIGRATION_REASON_TARGET_EXISTS,
  t as MIGRATION_REASON_MISSING_SOURCE_OR_TARGET,
  u as markMigrationItemError,
} from "./migration-nGWjmzKy.js";
import { r as readRegularFile } from "./regular-file-CuvhUtZS.js";
import { a as root } from "./secure-temp-dir-DMUMnweR.js";
import { t as writeTextAtomic } from "./text-atomic-Bnlcj3mw.js";
//#region src/plugin-sdk/migration-runtime.ts
/**
 * Resolves default agent workspace/state/agent directories. Prefers the runtime resolver,
 * then configured agentDir (using effective-home resolution), then canonical state layout.
 */
function resolvePlannedMigrationTargets(ctx) {
  const cfg = ctx.config;
  const agentId = ctx.targetAgentId ?? resolveDefaultAgentId(cfg);
  const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
  const configuredAgentDir = resolveAgentConfig(cfg, agentId)?.agentDir?.trim();
  const agentDir =
    ctx.runtime?.agent?.resolveAgentDir(cfg, agentId) ??
    (configuredAgentDir ? resolveHomeRelativePath(configuredAgentDir) : void 0) ??
    path.join(ctx.stateDir, "agents", agentId, "agent");
  return {
    workspaceDir,
    stateDir: ctx.stateDir,
    agentDir,
  };
}
/** Wrap migration runtime config access with a cached mutable snapshot during apply. */
function withCachedMigrationConfigRuntime(runtime, fallbackConfig) {
  if (!runtime) return;
  const configApi = runtime.config;
  if (!configApi?.current || !configApi.mutateConfigFile) return runtime;
  let cachedConfig;
  const current = () => {
    cachedConfig ??= structuredClone(configApi.current() ?? fallbackConfig);
    return cachedConfig;
  };
  return {
    ...runtime,
    config: {
      ...runtime.config,
      current,
      mutateConfigFile: async (params) => {
        const result = await configApi.mutateConfigFile({
          ...params,
          mutate: async (draft, context) => {
            const mutationResult = await params.mutate(draft, context);
            cachedConfig = structuredClone(draft);
            return mutationResult;
          },
        });
        cachedConfig = structuredClone(result.nextConfig);
        return result;
      },
      ...(configApi.replaceConfigFile
        ? {
            replaceConfigFile: async (params) => {
              const result = await configApi.replaceConfigFile(params);
              cachedConfig = structuredClone(result.nextConfig);
              return result;
            },
          }
        : {}),
    },
  };
}
async function backupExistingMigrationTarget(target, reportDir) {
  if (!(await pathExists(target))) return;
  const backupRoot = path.join(reportDir, "item-backups");
  await fs.mkdir(backupRoot, { recursive: true });
  const targetHash = crypto
    .createHash("sha256")
    .update(path.resolve(target))
    .digest("hex")
    .slice(0, 12);
  const backupDir = await fs.mkdtemp(path.join(backupRoot, `${Date.now()}-${targetHash}-`));
  const backupPath = path.join(backupDir, path.basename(target));
  await fs.cp(target, backupPath, {
    recursive: true,
    force: true,
  });
  return backupPath;
}
async function backupMemoryMigrationTarget(target, contents, reportDir) {
  const backupRoot = path.join(reportDir, "item-backups");
  await fs.mkdir(backupRoot, { recursive: true });
  const targetHash = crypto
    .createHash("sha256")
    .update(path.resolve(target))
    .digest("hex")
    .slice(0, 12);
  const backupDir = await fs.mkdtemp(path.join(backupRoot, `${Date.now()}-${targetHash}-`));
  const backupPath = path.join(backupDir, path.basename(target));
  await fs.writeFile(backupPath, contents, {
    flag: "wx",
    mode: 384,
  });
  return backupPath;
}
async function persistMemoryMigrationRecoveryRecord(recoveryRecordPath, params) {
  await writeTextAtomic(
    recoveryRecordPath,
    JSON.stringify(
      {
        version: 1,
        ...params,
      },
      null,
      2,
    ),
    {
      mode: 384,
      trailingNewline: true,
    },
  );
}
async function writeMemoryMigrationRecoveryRecord(params) {
  const recoveryRecordPath = path.join(
    path.dirname(params.backupPath),
    `recovery-${crypto.randomUUID()}.json`,
  );
  await persistMemoryMigrationRecoveryRecord(recoveryRecordPath, {
    ...params,
    status: "prepared",
  });
  return recoveryRecordPath;
}
function errorCode(error) {
  return error && typeof error === "object" && "code" in error ? String(error.code) : void 0;
}
async function openMemoryMigrationRoot(workspaceDir) {
  const options = {
    hardlinks: "reject",
    maxBytes: MAX_MEMORY_MIGRATION_FILE_BYTES,
    mkdir: true,
    symlinks: "reject",
  };
  try {
    return await root(workspaceDir, options);
  } catch (error) {
    if (errorCode(error) !== "not-found" && errorCode(error) !== "ENOENT") throw error;
  }
  const ensured = await ensureAbsoluteDirectory(workspaceDir, {
    scopeLabel: "memory import workspace",
    mode: 448,
  });
  if (!ensured.ok) throw ensured.error;
  return await root(ensured.path, options);
}
function isFileAlreadyExistsError(err) {
  return Boolean(
    err &&
    typeof err === "object" &&
    "code" in err &&
    (err.code === "ERR_FS_CP_EEXIST" || err.code === "EEXIST"),
  );
}
function readArchiveRelativePath(item) {
  const detailPath = item.details?.archiveRelativePath;
  const raw = typeof detailPath === "string" && detailPath.trim() ? detailPath : void 0;
  const fallback = item.source ? path.basename(item.source) : item.id;
  return (
    path
      .normalize(raw ?? fallback)
      .split(path.sep)
      .filter((part) => part && part !== "." && part !== "..")
      .join(path.sep) || "item"
  );
}
async function resolveUniqueArchivePath(archiveRoot, relativePath) {
  const parsed = path.parse(relativePath);
  let candidate = path.join(archiveRoot, relativePath);
  let index = 2;
  while (await pathExists(candidate)) {
    const filename = `${parsed.name}-${index}${parsed.ext}`;
    candidate = path.join(archiveRoot, parsed.dir, filename);
    index += 1;
  }
  return candidate;
}
/** Archive a migration item source into the report directory and mark the item migrated. */
async function archiveMigrationItem(item, reportDir) {
  if (!item.source) return markMigrationItemError(item, MIGRATION_REASON_MISSING_SOURCE_OR_TARGET);
  try {
    if ((await fs.lstat(item.source)).isSymbolicLink())
      return markMigrationItemError(item, "archive source is a symlink");
    const archiveRoot = path.join(reportDir, "archive");
    const relativePath = readArchiveRelativePath(item);
    const archivePath = await resolveUniqueArchivePath(archiveRoot, relativePath);
    await fs.mkdir(path.dirname(archivePath), { recursive: true });
    await fs.cp(item.source, archivePath, {
      recursive: true,
      force: false,
      errorOnExist: true,
      verbatimSymlinks: true,
    });
    return {
      ...item,
      status: "migrated",
      target: archivePath,
      details: {
        ...item.details,
        archivePath,
        archiveRelativePath: relativePath,
      },
    };
  } catch (err) {
    if (isFileAlreadyExistsError(err))
      return markMigrationItemConflict(item, MIGRATION_REASON_TARGET_EXISTS);
    return markMigrationItemError(item, err instanceof Error ? err.message : String(err));
  }
}
/** Copy a migration item source to its target, optionally backing up an overwritten target. */
async function copyMigrationFileItem(item, reportDir, opts = {}) {
  if (!item.source || !item.target)
    return markMigrationItemError(item, MIGRATION_REASON_MISSING_SOURCE_OR_TARGET);
  try {
    if ((await pathExists(item.target)) && !opts.overwrite)
      return markMigrationItemConflict(item, MIGRATION_REASON_TARGET_EXISTS);
    const backupPath = opts.overwrite
      ? await backupExistingMigrationTarget(item.target, reportDir)
      : void 0;
    await fs.mkdir(path.dirname(item.target), { recursive: true });
    await fs.cp(item.source, item.target, {
      recursive: true,
      force: Boolean(opts.overwrite),
      errorOnExist: !opts.overwrite,
    });
    return {
      ...item,
      status: "migrated",
      details: {
        ...item.details,
        ...(backupPath ? { backupPath } : {}),
      },
    };
  } catch (err) {
    if (isFileAlreadyExistsError(err))
      return markMigrationItemConflict(item, MIGRATION_REASON_TARGET_EXISTS);
    return markMigrationItemError(item, err instanceof Error ? err.message : String(err));
  }
}
/** Copy one regular memory file through an fs-safe workspace root. */
async function copyMemoryMigrationFileItem(item, reportDir, opts) {
  if (!item.source || !item.target)
    return markMigrationItemError(item, MIGRATION_REASON_MISSING_SOURCE_OR_TARGET);
  let backupPath;
  let stagedRelative;
  let stagingDir;
  let recoveryPath;
  let recoveryRecordPath;
  let journalRecoveryPath;
  let relativeTarget;
  let targetCreated = false;
  let safeRoot;
  try {
    const workspaceDir = path.resolve(opts.workspaceDir);
    relativeTarget = path.relative(workspaceDir, path.resolve(item.target));
    safeRoot = await openMemoryMigrationRoot(workspaceDir);
    const { buffer: sourceBuffer } = await readRegularFile({
      filePath: item.source,
      maxBytes: MAX_MEMORY_MIGRATION_FILE_BYTES,
    });
    assertMemoryMigrationSourceRevision(item, sourceBuffer);
    if (opts.overwrite === true && (await safeRoot.exists(relativeTarget))) {
      const existing = await safeRoot.read(relativeTarget, {
        hardlinks: "reject",
        maxBytes: MAX_MEMORY_MIGRATION_FILE_BYTES,
        symlinks: "reject",
      });
      backupPath = await backupMemoryMigrationTarget(item.target, existing.buffer, reportDir);
      stagingDir = path.join(".openclaw-memory-import-staging", crypto.randomUUID());
      stagedRelative = path.join(stagingDir, path.basename(relativeTarget));
      const plannedRecoveryPath = path.join(safeRoot.rootReal, stagedRelative);
      journalRecoveryPath = plannedRecoveryPath;
      await safeRoot.mkdir(stagingDir);
      recoveryRecordPath = await writeMemoryMigrationRecoveryRecord({
        backupPath,
        recoveryPath: plannedRecoveryPath,
        target: item.target,
      });
      recoveryPath = plannedRecoveryPath;
      await safeRoot.move(relativeTarget, stagedRelative, { overwrite: false });
      const staged = await safeRoot.read(stagedRelative, {
        hardlinks: "reject",
        maxBytes: MAX_MEMORY_MIGRATION_FILE_BYTES,
        symlinks: "reject",
      });
      if (!staged.buffer.equals(existing.buffer)) {
        backupPath = await backupMemoryMigrationTarget(item.target, staged.buffer, reportDir);
        await persistMemoryMigrationRecoveryRecord(recoveryRecordPath, {
          backupPath,
          recoveryPath: plannedRecoveryPath,
          status: "prepared",
          target: item.target,
        });
      }
    }
    await safeRoot.create(relativeTarget, sourceBuffer, {
      mkdir: true,
      mode: 384,
    });
    targetCreated = true;
    if (recoveryRecordPath && backupPath && journalRecoveryPath)
      await persistMemoryMigrationRecoveryRecord(recoveryRecordPath, {
        backupPath,
        recoveryPath: journalRecoveryPath,
        status: "complete",
        target: item.target,
      });
    if (stagedRelative) {
      await safeRoot.remove(stagedRelative);
      stagedRelative = void 0;
      recoveryPath = void 0;
    }
    if (stagingDir) {
      await safeRoot.remove(stagingDir);
      await safeRoot.remove(".openclaw-memory-import-staging").catch(() => void 0);
    }
    if (recoveryRecordPath)
      try {
        await fs.unlink(recoveryRecordPath);
        recoveryRecordPath = void 0;
      } catch {}
    return {
      ...item,
      status: "migrated",
      details: {
        ...item.details,
        ...(backupPath ? { backupPath } : {}),
        ...(recoveryRecordPath ? { recoveryRecordPath } : {}),
      },
    };
  } catch (error) {
    if (safeRoot && stagedRelative && relativeTarget && !targetCreated)
      try {
        if (!(await safeRoot.exists(stagedRelative))) recoveryPath = void 0;
        else if (!(await safeRoot.exists(relativeTarget))) {
          await safeRoot.move(stagedRelative, relativeTarget, { overwrite: false });
          stagedRelative = void 0;
          recoveryPath = void 0;
        }
      } catch {}
    if (recoveryRecordPath && backupPath && journalRecoveryPath)
      await persistMemoryMigrationRecoveryRecord(recoveryRecordPath, {
        backupPath,
        recoveryPath: journalRecoveryPath,
        status: targetCreated ? "complete" : recoveryPath ? "recovery-required" : "safe",
        target: item.target,
      }).catch(() => void 0);
    const details = {
      ...item.details,
      ...(backupPath ? { backupPath } : {}),
      ...(recoveryPath ? { recoveryPath } : {}),
      ...(recoveryRecordPath ? { recoveryRecordPath } : {}),
    };
    if (isFileAlreadyExistsError(error) || errorCode(error) === "already-exists")
      return {
        ...markMigrationItemConflict(item, MIGRATION_REASON_TARGET_EXISTS),
        details,
      };
    return {
      ...markMigrationItemError(item, error instanceof Error ? error.message : String(error)),
      details,
    };
  }
}
/** Write redacted JSON and Markdown migration reports into the apply report directory. */
async function writeMigrationReport(result, opts = {}) {
  if (!result.reportDir) return;
  await fs.mkdir(result.reportDir, { recursive: true });
  await fs.writeFile(
    path.join(result.reportDir, "report.json"),
    `${JSON.stringify(redactMigrationPlan(result), null, 2)}\n`,
    "utf8",
  );
  const lines = [
    `# ${opts.title ?? "Migration Report"}`,
    "",
    `Source: ${result.source}`,
    result.target ? `Target: ${result.target}` : void 0,
    result.backupPath ? `Backup: ${result.backupPath}` : void 0,
    "",
    `Migrated: ${result.summary.migrated}`,
    `Skipped: ${result.summary.skipped}`,
    `Conflicts: ${result.summary.conflicts}`,
    `Errors: ${result.summary.errors}`,
    "",
    ...result.items.map(
      (item) => `- ${item.status}: ${item.id}${item.reason ? ` (${item.reason})` : ""}`,
    ),
  ].filter((line) => typeof line === "string");
  await fs.writeFile(path.join(result.reportDir, "summary.md"), `${lines.join("\n")}\n`, "utf8");
}
//#endregion
export {
  withCachedMigrationConfigRuntime as a,
  resolvePlannedMigrationTargets as i,
  copyMemoryMigrationFileItem as n,
  writeMigrationReport as o,
  copyMigrationFileItem as r,
  archiveMigrationItem as t,
};
