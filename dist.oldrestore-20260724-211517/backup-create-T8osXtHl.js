import { createHash, randomUUID } from "node:crypto";
import fs, { constants, createWriteStream } from "node:fs";
import fs$1 from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import {
  i as resolveBackupPlanFromDisk,
  n as buildBackupArchivePath,
  r as buildBackupArchiveRoot,
  t as buildBackupArchiveBasename,
} from "./backup-shared-BWnwOu6q.js";
import { n as isPathWithin } from "./cleanup-utils-eg9gtrvN.js";
import { i as loadSqliteVecExtension } from "./engine-storage-DV2x5DKD.js";
import "./json-files-CTWRDHag.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { n as runExec } from "./exec-CXKmx4dL.js";
import "./fs-safe-advanced-CBe_wA_B.js";
import { t as sameFileIdentity } from "./file-identity-C0fBiekR.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { l as writeJson } from "./json-7OTJmMaB.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { t as requireNodeSqlite } from "./node-sqlite-BJtdZavS.js";
import { S as resolveDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
import {
  F as readSqliteUserVersion,
  f as resolveOpenClawStateSqlitePath,
  k as assertSqliteIntegrity,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import { t as resolveSystemBin } from "./resolve-system-bin-DHY7NQuY.js";
import { t as sleep } from "./sleep-DZm1epyW.js";
import { f as resolveHomeDir } from "./utils-DtcDeqWS.js";
import { s as resolveRuntimeServiceVersion } from "./version-CeFj_iGk.js";
//#region src/infra/backup-create-stream.ts
async function writeArchiveStreamToFile(params) {
  await pipeline(
    params.archiveStream,
    createWriteStream(params.archivePath, {
      flags: "wx",
      mode: 384,
    }),
  );
}
//#endregion
//#region src/infra/backup-tar-retry.ts
const BACKUP_TAR_MAX_ATTEMPTS = 3;
const BACKUP_TAR_BACKOFF_MS = [1e4, 2e4];
function isTarEofRaceError(err) {
  if (!err || typeof err !== "object") return false;
  if (err.code === "EOF") return true;
  const message = err.message ?? "";
  return /(did not encounter expected|encountered unexpected) EOF|TAR_BAD_ARCHIVE/i.test(message);
}
function resolveBackupTarAttemptTempPath(tempArchivePath, attempt) {
  return attempt === 1 ? tempArchivePath : `${tempArchivePath}.retry-${attempt}`;
}
function resolveBackupTarAttemptTempPaths(tempArchivePath) {
  return Array.from({ length: BACKUP_TAR_MAX_ATTEMPTS }, (_value, index) =>
    resolveBackupTarAttemptTempPath(tempArchivePath, index + 1),
  );
}
async function removeBackupTempArchiveBestEffort(tempArchivePath) {
  await fs$1.rm(tempArchivePath, { force: true }).catch(() => void 0);
}
async function writeTarArchiveWithRetry(params) {
  const sleepFn = params.sleepMs ?? sleep;
  let lastErr;
  const attemptTempArchivePaths = [];
  for (let attempt = 1; attempt <= BACKUP_TAR_MAX_ATTEMPTS; attempt += 1) {
    const attemptTempArchivePath = resolveBackupTarAttemptTempPath(params.tempArchivePath, attempt);
    attemptTempArchivePaths.push(attemptTempArchivePath);
    try {
      await params.runTar(attemptTempArchivePath);
      for (const staleTempArchivePath of attemptTempArchivePaths.slice(0, -1))
        await removeBackupTempArchiveBestEffort(staleTempArchivePath);
      return attemptTempArchivePath;
    } catch (err) {
      lastErr = err;
      if (!isTarEofRaceError(err) || attempt === BACKUP_TAR_MAX_ATTEMPTS) {
        for (const staleTempArchivePath of attemptTempArchivePaths)
          await removeBackupTempArchiveBestEffort(staleTempArchivePath);
        break;
      }
      try {
        await fs$1.rm(attemptTempArchivePath, { force: true });
      } catch (cleanupErr) {
        const code = cleanupErr.code;
        if (code && code !== "ENOENT")
          params.log?.(
            `Backup archiver could not remove temp archive ${attemptTempArchivePath} between retries: ${code}. Continuing.`,
          );
      }
      const backoff = BACKUP_TAR_BACKOFF_MS[attempt - 1] ?? 0;
      const offendingPath = err.path;
      params.log?.(
        `Backup archiver hit a live-write race${offendingPath ? ` on ${offendingPath}` : ""} (attempt ${attempt}/${BACKUP_TAR_MAX_ATTEMPTS}); retrying in ${Math.round(backoff / 1e3)}s.`,
      );
      await sleepFn(backoff);
    }
  }
  const final = lastErr instanceof Error ? lastErr : new Error(String(lastErr));
  const offendingPath = lastErr?.path;
  const suffix = offendingPath
    ? ` (last offending path: ${offendingPath}, after ${BACKUP_TAR_MAX_ATTEMPTS} attempts)`
    : ` (after ${BACKUP_TAR_MAX_ATTEMPTS} attempts)`;
  throw new Error(`Backup archive write failed: ${final.message}${suffix}`, { cause: final });
}
//#endregion
//#region src/infra/backup-volatile-filter.ts
/**
 * Paths that are known to change during a live backup and commonly trigger
 * tar EOF errors. These files are actively appended to (logs, sockets, pid
 * markers) while `tar.c()` is reading them, which races with the size recorded
 * at `lstat()` time.
 *
 * Skipping them is safe: they are either recreated on startup, are transient
 * by nature, or have durable equivalents elsewhere in state. Snapshotting a
 * partial tail of a live log has no restoration value.
 */
const STATE_TRANSIENT_EXTENSIONS = /* @__PURE__ */ new Set([".sock", ".pid", ".tmp"]);
function normalizePosix(input) {
  if (!input) return input;
  return path.posix.normalize(input.replaceAll("\\", "/"));
}
function isUnder(childPosix, parentPosix) {
  if (!parentPosix) return false;
  const p = parentPosix.endsWith("/") ? parentPosix : `${parentPosix}/`;
  return childPosix === parentPosix || childPosix.startsWith(p);
}
function hasExtension(filePosix, extensions) {
  const ext = path.posix.extname(filePosix).toLowerCase();
  return extensions.includes(ext);
}
function hasExtensionInSet(filePosix, extensions) {
  return extensions.has(path.posix.extname(filePosix).toLowerCase());
}
function isAgentSessionTranscriptPath(filePosix, stateDirPosix) {
  const agentsRoot = path.posix.join(stateDirPosix, "agents");
  if (!isUnder(filePosix, agentsRoot)) return false;
  const parts = path.posix.relative(agentsRoot, filePosix).split("/").filter(Boolean);
  return parts.length >= 3 && parts[1] === "sessions";
}
function filePathCandidates(input) {
  const normalized = normalizePosix(input);
  if (normalized.startsWith("/") || /^[A-Za-z]:\//u.test(normalized)) return [normalized];
  return [normalized, normalizePosix(`/${normalized}`)];
}
/**
 * Returns true if the given absolute path should be skipped during backup
 * because it is a live-mutation target.
 *
 * Rules:
 *   - `{stateDir}/sessions/**`/`*.{jsonl,log}` (legacy)
 *   - `{stateDir}/agents/<agentId>/sessions/**`/`*.{jsonl,log}`
 *   - `{stateDir}/cron/runs/**`/`*.{jsonl,log}`
 *   - `{stateDir}/logs/**`/`*.{jsonl,log}`
 *   - `{stateDir}/{delivery-queue,session-delivery-queue}/**`/`*.{json,delivered,tmp}`
 *   - `{stateDir}/**`/`*.{sock,pid,tmp}`
 */
function isVolatileBackupPath(absolutePath, plan) {
  if (!absolutePath) return false;
  const candidates = filePathCandidates(absolutePath);
  for (const stateDir of plan.stateDirs) {
    if (!stateDir) continue;
    const stateDirPosix = normalizePosix(stateDir);
    for (const filePosix of candidates) {
      if (
        isUnder(filePosix, path.posix.join(stateDirPosix, "sessions")) &&
        hasExtension(filePosix, [".jsonl", ".log"])
      )
        return true;
      if (
        isAgentSessionTranscriptPath(filePosix, stateDirPosix) &&
        hasExtension(filePosix, [".jsonl", ".log"])
      )
        return true;
      if (
        isUnder(filePosix, path.posix.join(stateDirPosix, "cron", "runs")) &&
        hasExtension(filePosix, [".jsonl", ".log"])
      )
        return true;
      if (
        isUnder(filePosix, path.posix.join(stateDirPosix, "logs")) &&
        hasExtension(filePosix, [".jsonl", ".log"])
      )
        return true;
      for (const queueDir of ["delivery-queue", "session-delivery-queue"])
        if (
          isUnder(filePosix, path.posix.join(stateDirPosix, queueDir)) &&
          hasExtension(filePosix, [".json", ".delivered", ".tmp"])
        )
          return true;
      if (
        isUnder(filePosix, stateDirPosix) &&
        hasExtensionInSet(filePosix, STATE_TRANSIENT_EXTENSIONS)
      )
        return true;
    }
  }
  return false;
}
//#endregion
//#region src/infra/backup-volatile-stat-cache.ts
const VOLATILE_BACKUP_SYNTHETIC_STAT = {
  isBlockDevice: () => false,
  isCharacterDevice: () => false,
  isDirectory: () => false,
  isFIFO: () => false,
  isFile: () => false,
  isSocket: () => false,
  isSymbolicLink: () => false,
};
var BackupVolatileStatCache = class extends Map {
  constructor(volatilePlan) {
    super();
    this.volatilePlan = volatilePlan;
  }
  get(key) {
    const cached = super.get(key);
    if (cached) return cached;
    return isVolatileBackupPath(key, this.volatilePlan) ? VOLATILE_BACKUP_SYNTHETIC_STAT : void 0;
  }
};
function createBackupVolatileStatCache(volatilePlan) {
  return new BackupVolatileStatCache(volatilePlan);
}
//#endregion
//#region src/infra/sqlite-snapshot.ts
const SQLITE_DIRECTORY_MODE = 448;
const WINDOWS_DIRECTORY_EXISTS_MARKER = "OPENCLAW_SQLITE_DIRECTORY_EXISTS";
const WINDOWS_PRIVATE_DIRECTORY_NATIVE_SOURCE = `
using System;
using System.Runtime.InteropServices;

public static class OpenClawPrivateDirectory
{
    [StructLayout(LayoutKind.Sequential)]
    private struct SecurityAttributes
    {
        public int Length;
        public IntPtr SecurityDescriptor;
        public int InheritHandle;
    }

    [DllImport("advapi32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern bool ConvertStringSecurityDescriptorToSecurityDescriptorW(
        string securityDescriptor,
        uint revision,
        out IntPtr convertedSecurityDescriptor,
        out uint convertedSecurityDescriptorSize);

    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern bool CreateDirectoryW(
        string path,
        ref SecurityAttributes securityAttributes);

    [DllImport("kernel32.dll")]
    private static extern IntPtr LocalFree(IntPtr memory);

    public static int Create(string path, string securityDescriptor)
    {
        IntPtr descriptor;
        uint descriptorSize;
        if (!ConvertStringSecurityDescriptorToSecurityDescriptorW(
                securityDescriptor,
                1,
                out descriptor,
                out descriptorSize))
        {
            return Marshal.GetLastWin32Error();
        }

        try
        {
            var attributes = new SecurityAttributes
            {
                Length = Marshal.SizeOf(typeof(SecurityAttributes)),
                SecurityDescriptor = descriptor,
                InheritHandle = 0,
            };
            return CreateDirectoryW(path, ref attributes) ? 0 : Marshal.GetLastWin32Error();
        }
        finally
        {
            LocalFree(descriptor);
        }
    }
}
`;
async function createPrivateSqliteDirectory(directoryPath) {
  if (process.platform !== "win32") {
    await fs$1.mkdir(directoryPath, { mode: SQLITE_DIRECTORY_MODE });
    return;
  }
  const encodedPath = Buffer.from(directoryPath, "utf8").toString("base64");
  const encodedNativeSource = Buffer.from(WINDOWS_PRIVATE_DIRECTORY_NATIVE_SOURCE, "utf8").toString(
    "base64",
  );
  const command = [
    "$ErrorActionPreference = 'Stop'",
    `$path = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${encodedPath}'))`,
    `$nativeSource = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${encodedNativeSource}'))`,
    "Add-Type -TypeDefinition $nativeSource -Language CSharp",
    "$current = [System.Security.Principal.WindowsIdentity]::GetCurrent().User",
    "$security = New-Object System.Security.AccessControl.DirectorySecurity",
    "$security.SetAccessRuleProtection($true, $false)",
    "$security.SetOwner($current)",
    "$inheritance = [System.Security.AccessControl.InheritanceFlags]::ContainerInherit -bor [System.Security.AccessControl.InheritanceFlags]::ObjectInherit",
    "$propagation = [System.Security.AccessControl.PropagationFlags]::None",
    "foreach ($sidValue in @($current.Value, 'S-1-5-18', 'S-1-5-32-544')) { $sid = New-Object System.Security.Principal.SecurityIdentifier($sidValue); $rule = New-Object System.Security.AccessControl.FileSystemAccessRule($sid, [System.Security.AccessControl.FileSystemRights]::FullControl, $inheritance, $propagation, [System.Security.AccessControl.AccessControlType]::Allow); [void]$security.AddAccessRule($rule) }",
    "$sections = [System.Security.AccessControl.AccessControlSections]::Owner -bor [System.Security.AccessControl.AccessControlSections]::Access",
    "$sddl = $security.GetSecurityDescriptorSddlForm($sections)",
    "$errorCode = [OpenClawPrivateDirectory]::Create($path, $sddl)",
    `if ($errorCode -eq 80 -or $errorCode -eq 183) { throw '${WINDOWS_DIRECTORY_EXISTS_MARKER}' }`,
    "if ($errorCode -ne 0) { $exception = New-Object System.ComponentModel.Win32Exception($errorCode); throw $exception }",
  ].join("; ");
  const powershell = resolveSystemBin("powershell");
  if (!powershell)
    throw new Error("Unable to resolve PowerShell for private Windows SQLite staging.");
  const encodedCommand = Buffer.from(command, "utf16le").toString("base64");
  try {
    await runExec(
      powershell,
      ["-NoLogo", "-NoProfile", "-NonInteractive", "-EncodedCommand", encodedCommand],
      {
        timeoutMs: 1e4,
        maxBuffer: 64 * 1024,
      },
    );
  } catch (error) {
    if (String(error).includes(WINDOWS_DIRECTORY_EXISTS_MARKER)) {
      const existsError = /* @__PURE__ */ new Error(
        `Private SQLite directory already exists: ${directoryPath}`,
      );
      existsError.code = "EEXIST";
      throw existsError;
    }
    throw new Error(`Unable to create private Windows SQLite directory: ${directoryPath}`, {
      cause: error,
    });
  }
}
async function createPrivateSqliteTempDirectory(rootPath, prefix) {
  if (process.platform !== "win32") return await fs$1.mkdtemp(path.join(rootPath, prefix));
  const directoryPath = path.join(rootPath, `${prefix}${randomUUID()}`);
  await createPrivateSqliteDirectory(directoryPath);
  return directoryPath;
}
async function assertRegularSourceFile(sourcePath) {
  if (!(await fs$1.lstat(sourcePath)).isFile())
    throw new Error(`SQLite snapshot source must be a regular file: ${sourcePath}`);
}
async function assertTargetAbsent(targetPath) {
  try {
    await fs$1.lstat(targetPath);
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }
  throw new Error(`SQLite snapshot target already exists: ${targetPath}`);
}
async function copyFileExclusive(source, targetPath) {
  const sourceFingerprint = await readMutationFingerprint(source);
  let target;
  let targetIdentity;
  try {
    target = await fs$1.open(targetPath, "wx+", 384);
    targetIdentity = await target.stat();
    const buffer = Buffer.allocUnsafe(1024 * 1024);
    const hash = createHash("sha256");
    let offset = 0;
    while (true) {
      const { bytesRead } = await source.read(buffer, 0, buffer.length, offset);
      if (bytesRead === 0) break;
      hash.update(buffer.subarray(0, bytesRead));
      let bytesWritten = 0;
      while (bytesWritten < bytesRead) {
        const result = await target.write(
          buffer,
          bytesWritten,
          bytesRead - bytesWritten,
          offset + bytesWritten,
        );
        if (result.bytesWritten === 0)
          throw new Error(`SQLite snapshot copy made no progress: ${targetPath}`);
        bytesWritten += result.bytesWritten;
      }
      offset += bytesRead;
    }
    await assertMutationFingerprintUnchanged(source, sourceFingerprint, targetPath);
    await target.sync();
    const currentIdentity = await fs$1.lstat(targetPath);
    if (!sameFileIdentity(targetIdentity, currentIdentity))
      throw new Error(`SQLite snapshot target changed during publication: ${targetPath}`);
    return {
      content: {
        sha256: hash.digest("hex"),
        sizeBytes: offset,
      },
      identity: currentIdentity,
    };
  } catch (error) {
    if (targetIdentity) {
      await target?.close().catch(() => void 0);
      target = void 0;
      removePublishedTargetIfOwned(targetPath, targetIdentity);
    }
    throw error;
  } finally {
    await target?.close().catch(() => void 0);
  }
}
async function readMutationFingerprint(handle) {
  const stat = await handle.stat({ bigint: true });
  return {
    birthtimeNs: stat.birthtimeNs,
    ctimeNs: stat.ctimeNs,
    dev: stat.dev,
    ino: stat.ino,
    mtimeNs: stat.mtimeNs,
    size: stat.size,
  };
}
async function assertMutationFingerprintUnchanged(handle, expected, filePath) {
  const current = await readMutationFingerprint(handle);
  if (
    current.birthtimeNs !== expected.birthtimeNs ||
    current.ctimeNs !== expected.ctimeNs ||
    current.dev !== expected.dev ||
    current.ino !== expected.ino ||
    current.mtimeNs !== expected.mtimeNs ||
    current.size !== expected.size
  )
    throw new Error(`SQLite snapshot file changed while reading: ${filePath}`);
}
function sameMutationFingerprint(left, right) {
  return (
    left.birthtimeNs === right.birthtimeNs &&
    left.ctimeNs === right.ctimeNs &&
    left.dev === right.dev &&
    left.ino === right.ino &&
    left.mtimeNs === right.mtimeNs &&
    left.size === right.size
  );
}
async function syncFile(filePath) {
  const handle = await fs$1.open(filePath, "r+");
  try {
    await handle.sync();
  } finally {
    await handle.close();
  }
}
async function assertOpenFileIdentity(handle, filePath, expectedIdentity) {
  const openedIdentity = await handle.stat();
  const currentIdentity = await fs$1.lstat(filePath);
  if (
    !openedIdentity.isFile() ||
    !currentIdentity.isFile() ||
    !sameFileIdentity(expectedIdentity, openedIdentity) ||
    !sameFileIdentity(expectedIdentity, currentIdentity)
  )
    throw new Error(`SQLite snapshot file changed: ${filePath}`);
}
async function hashPublishedFile(filePath, expectedIdentity) {
  const handle = await fs$1.open(filePath, "r");
  try {
    return await hashOpenPublishedFile(handle, filePath, expectedIdentity);
  } finally {
    await handle.close();
  }
}
async function hashOpenPublishedFile(handle, filePath, expectedIdentity) {
  await assertOpenFileIdentity(handle, filePath, expectedIdentity);
  const fingerprint = await readMutationFingerprint(handle);
  const buffer = Buffer.allocUnsafe(1024 * 1024);
  const hash = createHash("sha256");
  let offset = 0;
  while (true) {
    const { bytesRead } = await handle.read(buffer, 0, buffer.length, offset);
    if (bytesRead === 0) break;
    hash.update(buffer.subarray(0, bytesRead));
    offset += bytesRead;
  }
  await assertMutationFingerprintUnchanged(handle, fingerprint, filePath);
  await assertOpenFileIdentity(handle, filePath, expectedIdentity);
  return {
    sha256: hash.digest("hex"),
    sizeBytes: offset,
  };
}
function assertPublishedFileIdentitySync(filePath, expectedIdentity) {
  const currentIdentity = fs.lstatSync(filePath);
  if (
    !currentIdentity.isFile() ||
    !sameFileIdentity(expectedIdentity, currentIdentity) ||
    expectedIdentity.size !== currentIdentity.size ||
    expectedIdentity.mtimeMs !== currentIdentity.mtimeMs ||
    expectedIdentity.ctimeMs !== currentIdentity.ctimeMs ||
    expectedIdentity.birthtimeMs !== currentIdentity.birthtimeMs
  )
    throw new Error(`SQLite snapshot file changed: ${filePath}`);
}
function assertOpenFileIdentitySync(fileDescriptor, filePath, expectedIdentity) {
  const openedIdentity = fs.fstatSync(fileDescriptor);
  const currentIdentity = fs.lstatSync(filePath);
  if (
    !openedIdentity.isFile() ||
    !currentIdentity.isFile() ||
    !sameFileIdentity(expectedIdentity, openedIdentity) ||
    !sameFileIdentity(expectedIdentity, currentIdentity)
  )
    throw new Error(`SQLite snapshot file changed: ${filePath}`);
}
function hashPublishedFileSync(filePath, expectedIdentity) {
  const fileDescriptor = fs.openSync(filePath, "r");
  try {
    assertOpenFileIdentitySync(fileDescriptor, filePath, expectedIdentity);
    const initialStat = fs.fstatSync(fileDescriptor, { bigint: true });
    const initialFingerprint = {
      birthtimeNs: initialStat.birthtimeNs,
      ctimeNs: initialStat.ctimeNs,
      dev: initialStat.dev,
      ino: initialStat.ino,
      mtimeNs: initialStat.mtimeNs,
      size: initialStat.size,
    };
    const hash = createHash("sha256");
    const buffer = Buffer.allocUnsafe(1024 * 1024);
    let offset = 0;
    while (true) {
      const bytesRead = fs.readSync(fileDescriptor, buffer, 0, buffer.length, offset);
      if (bytesRead === 0) break;
      hash.update(buffer.subarray(0, bytesRead));
      offset += bytesRead;
    }
    const finalStat = fs.fstatSync(fileDescriptor, { bigint: true });
    if (
      !sameMutationFingerprint(initialFingerprint, {
        birthtimeNs: finalStat.birthtimeNs,
        ctimeNs: finalStat.ctimeNs,
        dev: finalStat.dev,
        ino: finalStat.ino,
        mtimeNs: finalStat.mtimeNs,
        size: finalStat.size,
      })
    )
      throw new Error(`SQLite snapshot file changed while reading: ${filePath}`);
    assertOpenFileIdentitySync(fileDescriptor, filePath, expectedIdentity);
    return {
      sha256: hash.digest("hex"),
      sizeBytes: offset,
    };
  } finally {
    fs.closeSync(fileDescriptor);
  }
}
function assertExpectedContent(actual, expected, filePath) {
  if (actual.sizeBytes !== expected.sizeBytes)
    throw new Error(
      `SQLite snapshot size mismatch for ${filePath}: expected ${expected.sizeBytes}, got ${actual.sizeBytes}`,
    );
  if (actual.sha256 !== expected.sha256)
    throw new Error(
      `SQLite snapshot hash mismatch for ${filePath}: expected ${expected.sha256}, got ${actual.sha256}`,
    );
}
function removePublishedTargetIfOwned(filePath, expectedIdentity, requireFingerprint = false) {
  let currentIdentity;
  try {
    currentIdentity = fs.lstatSync(filePath);
  } catch {
    return false;
  }
  const fingerprintMatches =
    !requireFingerprint ||
    (expectedIdentity.size === currentIdentity.size &&
      expectedIdentity.mtimeMs === currentIdentity.mtimeMs &&
      expectedIdentity.ctimeMs === currentIdentity.ctimeMs &&
      expectedIdentity.birthtimeMs === currentIdentity.birthtimeMs);
  if (!sameFileIdentity(expectedIdentity, currentIdentity) || !fingerprintMatches) return false;
  try {
    fs.unlinkSync(filePath);
    return true;
  } catch {
    return false;
  }
}
function assertSynchronousCallbackResult(result, label) {
  if (
    result &&
    (typeof result === "object" || typeof result === "function") &&
    typeof result.then === "function"
  ) {
    Promise.resolve(result).catch(() => void 0);
    throw new Error(`${label} must be synchronous.`);
  }
}
function isUnsupportedDirectorySyncError(error) {
  const code = error.code;
  return (
    code === "EINVAL" ||
    code === "ENOTSUP" ||
    code === "ENOSYS" ||
    (process.platform === "win32" && (code === "EISDIR" || code === "EPERM" || code === "EACCES"))
  );
}
async function syncDirectoryBestEffort(directoryPath) {
  const handle = await fs$1.open(directoryPath, "r").catch((error) => {
    if (isUnsupportedDirectorySyncError(error)) return;
    throw error;
  });
  if (!handle) return;
  try {
    await handle.sync();
  } catch (error) {
    if (!isUnsupportedDirectorySyncError(error)) throw error;
  } finally {
    await handle.close();
  }
}
function isLinkFallbackError(error) {
  const code = error.code;
  return (
    code === "EPERM" ||
    code === "EXDEV" ||
    code === "ENOTSUP" ||
    code === "EOPNOTSUPP" ||
    code === "ENOSYS"
  );
}
/**
 * Publish the exact bytes of one already-verified SQLite file without reopening
 * its pathname during the copy. The target is always created exclusively.
 */
async function publishVerifiedSqliteFile(options) {
  await assertTargetAbsent(options.targetPath);
  const targetDirectory = path.dirname(options.targetPath);
  const stagingDir = await createPrivateSqliteTempDirectory(
    targetDirectory,
    `.sqlite-publish-${randomUUID()}-`,
  );
  const stagedPath = path.join(stagingDir, "database.sqlite");
  let stagingIdentity;
  let source;
  let target;
  let targetPinFileDescriptor;
  let verifiedStagedIdentity;
  let linkedCandidateIdentity;
  let publishedIdentity;
  let ownershipPinned = false;
  let hardLinkCreated = false;
  try {
    stagingIdentity = await fs$1.lstat(stagingDir);
    await fs$1.chmod(stagingDir, 448);
    source = await fs$1.open(options.sourcePath, "r");
    await assertOpenFileIdentity(source, options.sourcePath, options.sourceIdentity);
    const staged = await copyFileExclusive(source, stagedPath);
    verifiedStagedIdentity = staged.identity;
    const expectedContent = options.expectedContent;
    assertExpectedContent(staged.content, expectedContent, options.targetPath);
    await source.close();
    source = void 0;
    await options.validatePublished?.(stagedPath);
    assertExpectedContent(
      await hashPublishedFile(stagedPath, staged.identity),
      expectedContent,
      options.targetPath,
    );
    await options.beforePublish?.();
    await assertTargetAbsent(options.targetPath);
    let usedHardLink = false;
    try {
      await fs$1.link(stagedPath, options.targetPath);
      usedHardLink = true;
      hardLinkCreated = true;
    } catch (error) {
      if (!isLinkFallbackError(error)) throw error;
      if (options.requireAtomicPublication)
        throw new Error(
          `Atomic SQLite publication requires hard-link support in ${targetDirectory}.`,
          { cause: error },
        );
      const stagedSource = await fs$1.open(stagedPath, "r");
      try {
        const copied = await copyFileExclusive(stagedSource, options.targetPath);
        publishedIdentity = copied.identity;
        assertExpectedContent(copied.content, expectedContent, options.targetPath);
      } finally {
        await stagedSource.close();
      }
    }
    if (usedHardLink) {
      target = await fs$1.open(options.targetPath, "r");
      const linkedIdentity = await target.stat();
      linkedCandidateIdentity = linkedIdentity;
      const currentTargetIdentity = await fs$1.lstat(options.targetPath);
      const currentStagedIdentity = await fs$1.lstat(stagedPath);
      if (!sameFileIdentity(linkedIdentity, currentTargetIdentity))
        throw new Error(`SQLite snapshot target changed during publication: ${options.targetPath}`);
      const matchesVerifiedStaging = sameFileIdentity(staged.identity, linkedIdentity);
      const matchesCurrentStaging = sameFileIdentity(currentStagedIdentity, linkedIdentity);
      if (matchesVerifiedStaging || matchesCurrentStaging) {
        publishedIdentity = linkedIdentity;
        ownershipPinned = true;
      }
      if (!matchesCurrentStaging)
        throw new Error(`SQLite snapshot staging path changed after publication: ${stagedPath}`);
      if (!matchesVerifiedStaging)
        throw new Error(
          `SQLite snapshot staging file changed during publication: ${options.targetPath}`,
        );
    }
    if (!publishedIdentity)
      throw new Error(`SQLite snapshot target was not published: ${options.targetPath}`);
    const initialPublishedIdentity = publishedIdentity;
    target ??= await fs$1.open(options.targetPath, "r");
    await assertOpenFileIdentity(target, options.targetPath, initialPublishedIdentity);
    ownershipPinned = true;
    await syncDirectoryBestEffort(targetDirectory);
    await fs$1.unlink(stagedPath);
    const expectedIdentity = await target.stat();
    publishedIdentity = expectedIdentity;
    await fs$1.rmdir(stagingDir);
    await syncDirectoryBestEffort(targetDirectory);
    assertExpectedContent(
      await hashOpenPublishedFile(target, options.targetPath, expectedIdentity),
      expectedContent,
      options.targetPath,
    );
    await target.close();
    target = void 0;
    ownershipPinned = false;
    targetPinFileDescriptor = fs.openSync(options.targetPath, "r");
    assertOpenFileIdentitySync(targetPinFileDescriptor, options.targetPath, expectedIdentity);
    ownershipPinned = true;
    const guard = {
      assertTargetMatchesExpectedContent: (finalCheck) => {
        assertExpectedContent(
          hashPublishedFileSync(options.targetPath, expectedIdentity),
          expectedContent,
          options.targetPath,
        );
        assertSynchronousCallbackResult(finalCheck?.(), "SQLite publication final check");
        assertPublishedFileIdentitySync(options.targetPath, expectedIdentity);
      },
      assertTargetUnchanged: (finalCheck) => {
        assertPublishedFileIdentitySync(options.targetPath, expectedIdentity);
        assertSynchronousCallbackResult(finalCheck?.(), "SQLite publication final check");
        assertPublishedFileIdentitySync(options.targetPath, expectedIdentity);
      },
    };
    if (options.afterPublish)
      assertSynchronousCallbackResult(
        options.afterPublish(guard),
        "SQLite after-publication guard",
      );
    else guard.assertTargetUnchanged();
    fs.closeSync(targetPinFileDescriptor);
    targetPinFileDescriptor = void 0;
    ownershipPinned = false;
  } catch (error) {
    if (!publishedIdentity && hardLinkCreated && verifiedStagedIdentity) {
      const currentTargetIdentity = await fs$1.lstat(options.targetPath).catch(() => void 0);
      const currentStagedIdentity = await fs$1.lstat(stagedPath).catch(() => void 0);
      const targetMatchesStaging =
        currentTargetIdentity &&
        currentStagedIdentity &&
        sameFileIdentity(currentTargetIdentity, currentStagedIdentity);
      const targetMatchesVerified =
        currentTargetIdentity && sameFileIdentity(currentTargetIdentity, verifiedStagedIdentity);
      if (targetMatchesStaging || targetMatchesVerified) {
        publishedIdentity = currentTargetIdentity;
        ownershipPinned = Boolean(targetMatchesStaging);
      }
    }
    if (!publishedIdentity && target && linkedCandidateIdentity && verifiedStagedIdentity) {
      const currentTargetIdentity = await fs$1.lstat(options.targetPath).catch(() => void 0);
      const currentStagedIdentity = await fs$1.lstat(stagedPath).catch(() => void 0);
      const targetStillMatches =
        currentTargetIdentity && sameFileIdentity(currentTargetIdentity, linkedCandidateIdentity);
      const targetCameFromStaging =
        (currentStagedIdentity &&
          sameFileIdentity(currentStagedIdentity, linkedCandidateIdentity)) ||
        sameFileIdentity(verifiedStagedIdentity, linkedCandidateIdentity);
      if (targetStillMatches && targetCameFromStaging) {
        publishedIdentity = linkedCandidateIdentity;
        ownershipPinned = true;
      }
    }
    if (target && publishedIdentity) {
      const openedIdentity = await target.stat().catch(() => void 0);
      if (openedIdentity && sameFileIdentity(openedIdentity, publishedIdentity)) {
        publishedIdentity = openedIdentity;
        ownershipPinned = true;
      }
    }
    if (publishedIdentity) {
      if (removePublishedTargetIfOwned(options.targetPath, publishedIdentity, !ownershipPinned))
        await syncDirectoryBestEffort(targetDirectory).catch(() => void 0);
    }
    if (stagingIdentity)
      await removePublicationStagingDirectory(stagingDir, stagingIdentity).catch(() => void 0);
    else await fs$1.rmdir(stagingDir).catch(() => void 0);
    throw error;
  } finally {
    if (targetPinFileDescriptor !== void 0) fs.closeSync(targetPinFileDescriptor);
    if (target) await target.close().catch(() => void 0);
    if (source) await source.close().catch(() => void 0);
  }
}
async function removePublicationStagingDirectory(stagingDir, expectedIdentity) {
  const currentIdentity = await fs$1.lstat(stagingDir).catch(() => void 0);
  if (!currentIdentity) return;
  if (!currentIdentity.isDirectory() || !sameFileIdentity(expectedIdentity, currentIdentity))
    throw new Error(`SQLite publication staging directory changed: ${stagingDir}`);
  const entries = await fs$1.readdir(stagingDir, { withFileTypes: true });
  if (
    entries.length > 1 ||
    entries.some((entry) => entry.name !== "database.sqlite" || !entry.isFile())
  )
    throw new Error(`SQLite publication staging directory has unexpected contents: ${stagingDir}`);
  const stagedEntry = entries[0];
  if (stagedEntry) await fs$1.unlink(path.join(stagingDir, stagedEntry.name));
  await fs$1.rmdir(stagingDir);
}
/**
 * Compact one SQLite database into a fresh private file and verify the result.
 *
 * The source and output both receive full structural, index, and foreign-key
 * checks. Only a fully verified, synced snapshot is published to the target.
 */
async function createVerifiedSqliteSnapshot(options) {
  await assertRegularSourceFile(options.sourcePath);
  await assertTargetAbsent(options.targetPath);
  const stagingDir = await createPrivateSqliteTempDirectory(
    path.dirname(options.targetPath),
    ".sqlite-snapshot-",
  );
  await fs$1.chmod(stagingDir, 448);
  const stagedPath = path.join(stagingDir, "database.sqlite");
  const sqlite = requireNodeSqlite();
  let stagedIdentity;
  try {
    const source = new sqlite.DatabaseSync(options.sourcePath, {
      allowExtension: true,
      readOnly: true,
    });
    try {
      source.exec("PRAGMA busy_timeout = 30000; PRAGMA trusted_schema = OFF;");
      await loadSqliteVecExtension({ db: source });
      assertSqliteIntegrity(source, options.sourcePath);
      options.validate?.(source, options.sourcePath);
      source.prepare("VACUUM INTO ?").run(stagedPath);
    } finally {
      source.close();
    }
    await fs$1.chmod(stagedPath, 384);
    const snapshot = new sqlite.DatabaseSync(stagedPath, { allowExtension: true });
    try {
      snapshot.exec("PRAGMA busy_timeout = 30000; PRAGMA trusted_schema = OFF;");
      await loadSqliteVecExtension({ db: snapshot });
      if (options.transform) {
        await options.transform(snapshot);
        snapshot.exec("VACUUM;");
      }
      assertSqliteIntegrity(snapshot, options.targetPath);
      options.validate?.(snapshot, options.targetPath);
      const userVersion = readSqliteUserVersion(snapshot);
      snapshot.close();
      await syncFile(stagedPath);
      stagedIdentity = await fs$1.lstat(stagedPath);
      const expectedContent = await hashPublishedFile(stagedPath, stagedIdentity);
      await publishVerifiedSqliteFile({
        sourceIdentity: stagedIdentity,
        sourcePath: stagedPath,
        targetPath: options.targetPath,
        expectedContent,
        beforePublish: options.beforePublish,
        afterPublish: options.afterPublish,
        validatePublished: async (publishedPath) => {
          const published = new sqlite.DatabaseSync(publishedPath, {
            allowExtension: true,
            readOnly: true,
          });
          try {
            published.exec("PRAGMA busy_timeout = 30000; PRAGMA trusted_schema = OFF;");
            await loadSqliteVecExtension({ db: published });
            assertSqliteIntegrity(published, options.targetPath);
            options.validate?.(published, options.targetPath);
            const publishedUserVersion = readSqliteUserVersion(published);
            if (publishedUserVersion !== userVersion)
              throw new Error(
                `SQLite snapshot user_version changed during publication: expected ${userVersion}, got ${publishedUserVersion}`,
              );
          } finally {
            published.close();
          }
        },
      });
      return {
        path: options.targetPath,
        userVersion,
      };
    } finally {
      if (snapshot.isOpen) snapshot.close();
    }
  } catch (error) {
    throw new Error(
      `SQLite database cannot be snapshotted safely: ${options.sourcePath}. ${formatErrorMessage(error)}`,
      { cause: error },
    );
  } finally {
    await fs$1
      .rm(stagingDir, {
        force: true,
        recursive: true,
      })
      .catch(() => void 0);
  }
}
//#endregion
//#region src/infra/backup-create.ts
const loadTarRuntime = createLazyRuntimeModule(() => import("tar"));
var BackupLinkCache = class extends Map {
  get(_key) {}
  set(_key, _value) {
    return this;
  }
};
async function resolveOutputPath(params) {
  const basename = buildBackupArchiveBasename(params.nowMs);
  const rawOutput = params.output?.trim();
  if (!rawOutput) {
    const cwd = path.resolve(process.cwd());
    const canonicalCwd = await fs$1.realpath(cwd).catch(() => cwd);
    const defaultDir = params.includedAssets.some((asset) =>
      isPathWithin(canonicalCwd, asset.sourcePath),
    )
      ? (resolveHomeDir() ?? path.dirname(params.stateDir))
      : cwd;
    return path.resolve(defaultDir, basename);
  }
  const resolved = resolveUserPath(rawOutput);
  if (rawOutput.endsWith("/") || rawOutput.endsWith("\\")) return path.join(resolved, basename);
  try {
    if ((await fs$1.stat(resolved)).isDirectory()) return path.join(resolved, basename);
  } catch {}
  return resolved;
}
async function assertOutputPathReady(outputPath) {
  try {
    await fs$1.access(outputPath);
    throw new Error(`Refusing to overwrite existing backup archive: ${outputPath}`);
  } catch (err) {
    if (err?.code === "ENOENT") return;
    throw err;
  }
}
function buildTempArchivePath(outputPath) {
  return `${outputPath}.${randomUUID()}.tmp`;
}
async function chooseBackupTempRoot(params) {
  const systemTmp = os.tmpdir();
  const canonicalSystemTmp = await canonicalizePathForContainment(systemTmp);
  if (!params.assets.some((asset) => isPathWithin(canonicalSystemTmp, asset.sourcePath)))
    return systemTmp;
  const fallback = path.dirname(params.outputPath);
  const canonicalFallback = await canonicalizePathForContainment(fallback);
  const fallbackInsideAsset = params.assets.find((asset) =>
    isPathWithin(canonicalFallback, asset.sourcePath),
  );
  if (fallbackInsideAsset)
    throw new Error(
      `Backup temp root cannot be placed outside every source path: ${systemTmp} and ${fallback} both overlap ${fallbackInsideAsset.sourcePath}.`,
    );
  return fallback;
}
function isLinkUnsupportedError(code) {
  return code === "ENOTSUP" || code === "EOPNOTSUPP" || code === "EPERM";
}
async function publishTempArchive(params) {
  try {
    await fs$1.link(params.tempArchivePath, params.outputPath);
  } catch (err) {
    const code = err?.code;
    if (code === "EEXIST")
      throw new Error(`Refusing to overwrite existing backup archive: ${params.outputPath}`, {
        cause: err,
      });
    if (!isLinkUnsupportedError(code)) throw err;
    try {
      await fs$1.copyFile(params.tempArchivePath, params.outputPath, constants.COPYFILE_EXCL);
    } catch (copyErr) {
      const copyCode = copyErr?.code;
      if (copyCode !== "EEXIST")
        await fs$1.rm(params.outputPath, { force: true }).catch(() => void 0);
      if (copyCode === "EEXIST")
        throw new Error(`Refusing to overwrite existing backup archive: ${params.outputPath}`, {
          cause: copyErr,
        });
      throw copyErr;
    }
  }
  await fs$1.rm(params.tempArchivePath, { force: true });
}
async function canonicalizePathForContainment(targetPath) {
  const resolved = path.resolve(targetPath);
  const suffix = [];
  let probe = resolved;
  while (true)
    try {
      const realProbe = await fs$1.realpath(probe);
      return suffix.length === 0 ? realProbe : path.join(realProbe, ...suffix.toReversed());
    } catch {
      const parent = path.dirname(probe);
      if (parent === probe) return resolved;
      suffix.push(path.basename(probe));
      probe = parent;
    }
}
function buildManifest(params) {
  return {
    schemaVersion: 1,
    createdAt: params.createdAt,
    archiveRoot: params.archiveRoot,
    runtimeVersion: resolveRuntimeServiceVersion(),
    platform: process.platform,
    nodeVersion: process.version,
    options: {
      includeWorkspace: params.includeWorkspace,
      onlyConfig: params.onlyConfig,
    },
    paths: {
      stateDir: params.stateDir,
      configPath: params.configPath,
      oauthDir: params.oauthDir,
      workspaceDirs: params.workspaceDirs,
    },
    assets: params.assets.map((asset) => ({
      kind: asset.kind,
      sourcePath: asset.sourcePath,
      archivePath: asset.archivePath,
    })),
    skipped: params.skipped.map((entry) => ({
      kind: entry.kind,
      sourcePath: entry.sourcePath,
      reason: entry.reason,
      coveredBy: entry.coveredBy,
    })),
  };
}
function formatBackupCreateSummary(result) {
  const lines = [`Backup archive: ${result.archivePath}`];
  lines.push(`Included ${result.assets.length} path${result.assets.length === 1 ? "" : "s"}:`);
  for (const asset of result.assets) lines.push(`- ${asset.kind}: ${asset.displayPath}`);
  if (result.skipped.length > 0) {
    lines.push(`Skipped ${result.skipped.length} path${result.skipped.length === 1 ? "" : "s"}:`);
    for (const entry of result.skipped)
      if (entry.reason === "covered" && entry.coveredBy)
        lines.push(`- ${entry.kind}: ${entry.displayPath} (${entry.reason} by ${entry.coveredBy})`);
      else lines.push(`- ${entry.kind}: ${entry.displayPath} (${entry.reason})`);
  }
  if (result.dryRun) lines.push("Dry run only; archive was not written.");
  else {
    lines.push(`Created ${result.archivePath}`);
    if (result.skippedVolatileCount > 0)
      lines.push(
        `Skipped ${result.skippedVolatileCount} volatile file${result.skippedVolatileCount === 1 ? "" : "s"} (live sessions, cron logs, queues, sockets, pid/tmp).`,
      );
    if (result.verified) lines.push("Archive verification: passed");
  }
  return lines;
}
function remapArchiveEntryPath(params) {
  const normalizedEntry = path.resolve(params.entryPath);
  if (normalizedEntry === params.manifestPath)
    return path.posix.join(params.archiveRoot, "manifest.json");
  const remappedSourcePath = params.sourcePathRemaps?.get(normalizedEntry);
  if (remappedSourcePath) return buildBackupArchivePath(params.archiveRoot, remappedSourcePath);
  return buildBackupArchivePath(params.archiveRoot, normalizedEntry);
}
function normalizeBackupFilterPath(value) {
  return value.replaceAll("\\", "/").replace(/\/+$/u, "");
}
function buildExtensionsNodeModulesFilter(stateDir) {
  const extensionsPrefix = `${normalizeBackupFilterPath(stateDir)}/extensions/`;
  return (filePath) => {
    const normalizedFilePath = normalizeBackupFilterPath(filePath);
    if (!normalizedFilePath.startsWith(extensionsPrefix)) return true;
    return !normalizedFilePath.slice(extensionsPrefix.length).split("/").includes("node_modules");
  };
}
const SQLITE_BACKUP_SOURCE_SUFFIXES = ["", "-wal", "-shm", "-journal"];
const SQLITE_BACKUP_EXCLUDED_SUFFIXES = [".reindex-lock.sqlite"];
const SQLITE_BACKUP_REINDEX_TRANSIENT_PATTERN =
  /\.sqlite\.(?:backup|memory-reindex|tmp)-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu;
function isCanonicalAgentSqlitePathOrAncestor(sourcePath, stateDir) {
  const segments = path.relative(path.resolve(stateDir), path.resolve(sourcePath)).split(path.sep);
  if (segments[0] !== "agents" || !segments[1]) return false;
  if (segments.length === 2) return true;
  if (segments[2] !== "agent") return false;
  if (segments.length === 3) return true;
  if (segments.length !== 4) return false;
  return SQLITE_BACKUP_SOURCE_SUFFIXES.some(
    (suffix) => segments[3] === `openclaw-agent.sqlite${suffix}`,
  );
}
function isStatePackageContentPath(sourcePath, stateDir) {
  const resolvedStateDir = path.resolve(stateDir);
  const resolvedSourcePath = path.resolve(sourcePath);
  return (
    isPathWithin(resolvedSourcePath, resolvedStateDir) &&
    !isCanonicalAgentSqlitePathOrAncestor(resolvedSourcePath, resolvedStateDir) &&
    path.relative(resolvedStateDir, resolvedSourcePath).split(path.sep).includes("node_modules")
  );
}
function resolveSqliteBackupDatabasePath(sourcePath) {
  for (const suffix of SQLITE_BACKUP_SOURCE_SUFFIXES.slice(1))
    if (sourcePath.endsWith(suffix)) {
      const databasePath = sourcePath.slice(0, -suffix.length);
      return databasePath.endsWith(".sqlite") ? databasePath : void 0;
    }
  return sourcePath.endsWith(".sqlite") ? sourcePath : void 0;
}
function resolveSqliteBackupBasePath(sourcePath) {
  for (const suffix of SQLITE_BACKUP_SOURCE_SUFFIXES.slice(1))
    if (sourcePath.endsWith(suffix)) return sourcePath.slice(0, -suffix.length);
  return sourcePath;
}
function classifyStateSqliteBackupSourcePath(sourcePath, stateDir) {
  const resolvedSourcePath = path.resolve(sourcePath);
  if (!isPathWithin(resolvedSourcePath, stateDir)) return;
  if (isStatePackageContentPath(resolvedSourcePath, stateDir)) return;
  if (SQLITE_BACKUP_REINDEX_TRANSIENT_PATTERN.test(resolveSqliteBackupBasePath(resolvedSourcePath)))
    return "excluded";
  const databasePath = resolveSqliteBackupDatabasePath(resolvedSourcePath);
  if (!databasePath) return;
  return SQLITE_BACKUP_EXCLUDED_SUFFIXES.some((suffix) => databasePath.endsWith(suffix))
    ? "excluded"
    : "sqlite";
}
function isBackupTarFilterFile(entry) {
  return "isFile" in entry ? entry.isFile() : entry.type === "File";
}
function tableExistsSql(db, tableName) {
  return (
    db.prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName)
      ?.ok === 1
  );
}
function sanitizeGlobalStateSqliteSnapshot(db) {
  if (tableExistsSql(db, "delivery_queue_entries"))
    db.prepare("DELETE FROM delivery_queue_entries").run();
}
async function listStateSqlitePaths(params) {
  const snapshotPaths = /* @__PURE__ */ new Set();
  const discoveredSourcePaths = /* @__PURE__ */ new Set();
  const extensionsFilter = buildExtensionsNodeModulesFilter(params.stateDir);
  async function visit(dir) {
    let entries;
    try {
      entries = await fs$1.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) {
        if (extensionsFilter(entryPath) && !isStatePackageContentPath(entryPath, params.stateDir))
          await visit(entryPath);
      } else if (
        entry.isFile() &&
        extensionsFilter(entryPath) &&
        !isStatePackageContentPath(entryPath, params.stateDir)
      ) {
        const resolvedEntryPath = path.resolve(entryPath);
        if (resolveSqliteBackupDatabasePath(resolvedEntryPath))
          discoveredSourcePaths.add(resolvedEntryPath);
        if (
          entry.name.endsWith(".sqlite") &&
          !SQLITE_BACKUP_EXCLUDED_SUFFIXES.some((suffix) => entry.name.endsWith(suffix))
        )
          snapshotPaths.add(resolvedEntryPath);
      }
    }
  }
  await visit(params.stateDir);
  const globalStateSqlitePath = path.resolve(params.globalStateSqlitePath);
  let globalStateEntry;
  try {
    globalStateEntry = await fs$1.lstat(globalStateSqlitePath);
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
  if (globalStateEntry?.isFile()) {
    snapshotPaths.add(globalStateSqlitePath);
    discoveredSourcePaths.add(globalStateSqlitePath);
  } else if (globalStateEntry?.isSymbolicLink()) {
    let targetEntry;
    try {
      targetEntry = await fs$1.stat(globalStateSqlitePath);
    } catch (err) {
      throw new Error(
        `Canonical global SQLite symlink cannot be snapshotted: ${globalStateSqlitePath}`,
        { cause: err },
      );
    }
    if (!targetEntry.isFile())
      throw new Error(
        `Canonical global SQLite symlink must resolve to a regular file: ${globalStateSqlitePath}`,
      );
    snapshotPaths.add(globalStateSqlitePath);
    discoveredSourcePaths.add(globalStateSqlitePath);
  } else if (globalStateEntry)
    throw new Error(
      `Canonical global SQLite path must be a regular file or symlink to one: ${globalStateSqlitePath}`,
    );
  return {
    snapshotPaths: [...snapshotPaths].toSorted((left, right) => left.localeCompare(right)),
    discoveredSourcePaths,
  };
}
async function createStateSqliteBackupPlan(params) {
  const globalStateSqlitePath = path.resolve(
    resolveOpenClawStateSqlitePath({
      ...process.env,
      OPENCLAW_STATE_DIR: params.stateDir,
    }),
  );
  const discovery = await listStateSqlitePaths({
    stateDir: params.stateDir,
    globalStateSqlitePath,
  });
  const snapshots = [];
  for (const archiveSourcePath of discovery.snapshotPaths) {
    const sourceDatabasePath =
      path.resolve(archiveSourcePath) === globalStateSqlitePath
        ? await fs$1.realpath(archiveSourcePath)
        : archiveSourcePath;
    const sourcePath = path.join(params.tempDir, `openclaw-state-db-${snapshots.length}.sqlite`);
    try {
      await createVerifiedSqliteSnapshot({
        sourcePath: sourceDatabasePath,
        targetPath: sourcePath,
        transform:
          path.resolve(archiveSourcePath) === globalStateSqlitePath
            ? sanitizeGlobalStateSqliteSnapshot
            : void 0,
      });
    } catch (err) {
      throw new Error(
        `SQLite database cannot be compacted safely for backup: ${archiveSourcePath}. ${formatErrorMessage(err)}. The source must pass full integrity checks and VACUUM INTO with its required SQLite capabilities; raw page backup was refused because it can retain deleted data.`,
        { cause: err },
      );
    }
    snapshots.push({
      sourcePath,
      archiveSourcePath,
      skippedSourcePaths: new Set(
        [archiveSourcePath, sourceDatabasePath].flatMap((databasePath) =>
          SQLITE_BACKUP_SOURCE_SUFFIXES.map((suffix) => path.resolve(`${databasePath}${suffix}`)),
        ),
      ),
    });
  }
  return {
    snapshots,
    discoveredSourcePaths: discovery.discoveredSourcePaths,
  };
}
async function createBackupArchive(opts = {}) {
  const nowMs = resolveDateTimestampMs(opts.nowMs);
  const archiveRoot = buildBackupArchiveRoot(nowMs);
  const onlyConfig = Boolean(opts.onlyConfig);
  const includeWorkspace = onlyConfig ? false : (opts.includeWorkspace ?? true);
  const plan = await resolveBackupPlanFromDisk({
    includeWorkspace,
    onlyConfig,
    nowMs,
  });
  const outputPath = await resolveOutputPath({
    output: opts.output,
    nowMs,
    includedAssets: plan.included,
    stateDir: plan.stateDir,
  });
  if (plan.included.length === 0)
    throw new Error(
      onlyConfig
        ? "No OpenClaw config file was found to back up."
        : "No local OpenClaw state was found to back up.",
    );
  const canonicalOutputPath = await canonicalizePathForContainment(outputPath);
  const overlappingAsset = plan.included.find((asset) =>
    isPathWithin(canonicalOutputPath, asset.sourcePath),
  );
  if (overlappingAsset)
    throw new Error(
      `Backup output must not be written inside a source path: ${outputPath} is inside ${overlappingAsset.sourcePath}`,
    );
  if (!opts.dryRun) await assertOutputPathReady(outputPath);
  const createdAt = new Date(nowMs).toISOString();
  const result = {
    createdAt,
    archiveRoot,
    archivePath: outputPath,
    dryRun: Boolean(opts.dryRun),
    includeWorkspace,
    onlyConfig,
    verified: false,
    assets: plan.included,
    skipped: plan.skipped,
    skippedVolatileCount: 0,
  };
  if (opts.dryRun) return result;
  await fs$1.mkdir(path.dirname(outputPath), { recursive: true });
  const tempRoot = await chooseBackupTempRoot({
    assets: result.assets,
    outputPath,
  });
  await fs$1.mkdir(tempRoot, { recursive: true });
  const tempDir = await fs$1.mkdtemp(path.join(tempRoot, "openclaw-backup-"));
  const manifestPath = path.join(tempDir, "manifest.json");
  const tempArchivePath = buildTempArchivePath(outputPath);
  const tempArchiveCleanupPaths = resolveBackupTarAttemptTempPaths(tempArchivePath);
  const stateAsset = result.assets.find((asset) => asset.kind === "state");
  try {
    const stateSqliteBackup = stateAsset
      ? await createStateSqliteBackupPlan({
          stateDir: stateAsset.sourcePath,
          tempDir,
        })
      : {
          snapshots: [],
          discoveredSourcePaths: /* @__PURE__ */ new Set(),
        };
    const sourcePathRemaps = /* @__PURE__ */ new Map();
    const skippedSqliteSourcePaths = /* @__PURE__ */ new Set();
    for (const snapshot of stateSqliteBackup.snapshots) {
      sourcePathRemaps.set(path.resolve(snapshot.sourcePath), snapshot.archiveSourcePath);
      for (const skippedSourcePath of snapshot.skippedSourcePaths)
        skippedSqliteSourcePaths.add(skippedSourcePath);
    }
    await writeJson(
      manifestPath,
      buildManifest({
        createdAt,
        archiveRoot,
        includeWorkspace,
        onlyConfig,
        assets: result.assets,
        skipped: result.skipped,
        stateDir: plan.stateDir,
        configPath: plan.configPath,
        oauthDir: plan.oauthDir,
        workspaceDirs: plan.workspaceDirs,
      }),
      { trailingNewline: true },
    );
    const tar = await loadTarRuntime();
    const extensionsFilter = stateAsset
      ? buildExtensionsNodeModulesFilter(stateAsset.sourcePath)
      : void 0;
    const volatilePlan = { stateDirs: [stateAsset?.sourcePath ?? plan.stateDir] };
    let skippedVolatileCount = 0;
    const unexpectedSqliteSourcePaths = [];
    const tarFilter = (entryPath, entryStat) => {
      const resolvedEntryPath = path.resolve(entryPath);
      if (resolvedEntryPath === manifestPath) return true;
      if (extensionsFilter && !extensionsFilter(entryPath)) return false;
      const sqliteSourceKind = stateAsset
        ? classifyStateSqliteBackupSourcePath(resolvedEntryPath, stateAsset.sourcePath)
        : void 0;
      if (sqliteSourceKind === "excluded") return false;
      if (skippedSqliteSourcePaths.has(resolvedEntryPath)) return false;
      if (
        sqliteSourceKind === "sqlite" &&
        stateSqliteBackup.discoveredSourcePaths.has(resolvedEntryPath)
      )
        return false;
      if (sqliteSourceKind === "sqlite" && isBackupTarFilterFile(entryStat)) {
        unexpectedSqliteSourcePaths.push(entryPath);
        return false;
      }
      if (isVolatileBackupPath(entryPath, volatilePlan)) {
        skippedVolatileCount += 1;
        return false;
      }
      return true;
    };
    const completedTempArchivePath = await writeTarArchiveWithRetry({
      tempArchivePath,
      log: opts.log,
      runTar: async (attemptTempArchivePath) => {
        skippedVolatileCount = 0;
        unexpectedSqliteSourcePaths.length = 0;
        await writeArchiveStreamToFile({
          archivePath: attemptTempArchivePath,
          archiveStream: tar.c(
            {
              gzip: true,
              portable: true,
              preservePaths: true,
              linkCache: new BackupLinkCache(),
              statCache: createBackupVolatileStatCache(volatilePlan),
              filter: tarFilter,
              onWriteEntry: (entry) => {
                entry.path = remapArchiveEntryPath({
                  entryPath: entry.path,
                  manifestPath,
                  archiveRoot,
                  sourcePathRemaps,
                });
              },
            },
            [
              manifestPath,
              ...stateSqliteBackup.snapshots.map((snapshot) => snapshot.sourcePath),
              ...result.assets.map((asset) => asset.sourcePath),
            ],
          ),
        });
        const unexpectedSqliteSourcePath = unexpectedSqliteSourcePaths[0];
        if (unexpectedSqliteSourcePath)
          throw new Error(
            `SQLite state appeared after snapshot discovery: ${unexpectedSqliteSourcePath}. Retry backup so it can be snapshotted.`,
          );
      },
    });
    result.skippedVolatileCount = skippedVolatileCount;
    if (skippedVolatileCount > 0)
      opts.log?.(
        `Backup skipped ${skippedVolatileCount} volatile file${skippedVolatileCount === 1 ? "" : "s"} (live sessions, cron logs, queues, sockets, pid/tmp).`,
      );
    await publishTempArchive({
      tempArchivePath: completedTempArchivePath,
      outputPath,
    });
  } finally {
    for (const cleanupPath of tempArchiveCleanupPaths)
      await removeBackupTempArchiveBestEffort(cleanupPath);
    await fs$1
      .rm(tempDir, {
        recursive: true,
        force: true,
      })
      .catch(() => void 0);
  }
  return result;
}
//#endregion
export {
  createVerifiedSqliteSnapshot as a,
  createPrivateSqliteTempDirectory as i,
  formatBackupCreateSummary as n,
  publishVerifiedSqliteFile as o,
  createPrivateSqliteDirectory as r,
  syncDirectoryBestEffort as s,
  createBackupArchive as t,
};
