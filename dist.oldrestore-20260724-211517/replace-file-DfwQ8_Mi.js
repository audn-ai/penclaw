import { randomUUID } from "node:crypto";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { t as assertSafePathPrefix } from "./safe-path-segment-Dec_-PAQ.js";
import { n as registerTempPathForExit, t as serializePathWrite } from "./write-queue-DxjVr7Ru.js";
//#region node_modules/@openclaw/fs-safe/dist/replace-file.js
function isRetryableRenameError(error) {
  return error.code === "EBUSY";
}
function isPermissionRenameError(error) {
  const code = error.code;
  return code === "EPERM" || code === "EEXIST";
}
const SUPPORTS_NOFOLLOW = process.platform !== "win32" && "O_NOFOLLOW" in fs.constants;
const OPEN_READ_FLAGS = fs.constants.O_RDONLY | (SUPPORTS_NOFOLLOW ? fs.constants.O_NOFOLLOW : 0);
const OPEN_WRITE_EXCLUSIVE_FLAGS =
  fs.constants.O_WRONLY |
  fs.constants.O_CREAT |
  fs.constants.O_EXCL |
  (SUPPORTS_NOFOLLOW ? fs.constants.O_NOFOLLOW : 0);
async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
async function renameWithRetry(params) {
  for (let attempt = 0; attempt <= params.maxRetries; attempt++)
    try {
      await params.fsModule.rename(params.src, params.dest);
      return { method: "rename" };
    } catch (error) {
      if (isRetryableRenameError(error) && attempt < params.maxRetries) {
        await sleep(params.baseDelayMs * 2 ** attempt);
        continue;
      }
      if (params.copyFallbackOnPermissionError && isPermissionRenameError(error)) {
        await copyFallbackReplace(params.fsModule, params.src, params.dest);
        return { method: "copy-fallback" };
      }
      throw error;
    }
  throw new Error("Atomic rename retry loop exhausted.");
}
function sleepSync(ms) {
  if (ms <= 0) return;
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}
function renameWithRetrySync(params) {
  for (let attempt = 0; attempt <= params.maxRetries; attempt++)
    try {
      params.fsModule.renameSync(params.src, params.dest);
      return { method: "rename" };
    } catch (error) {
      if (isRetryableRenameError(error) && attempt < params.maxRetries) {
        sleepSync(params.baseDelayMs * 2 ** attempt);
        continue;
      }
      if (params.copyFallbackOnPermissionError && isPermissionRenameError(error)) {
        copyFallbackReplaceSync(params.fsModule, params.src, params.dest);
        return { method: "copy-fallback" };
      }
      throw error;
    }
  throw new Error("Atomic rename retry loop exhausted.");
}
async function copyFallbackReplace(fsModule, src, dest) {
  const sourceStat = await fsModule.lstat(src);
  if (sourceStat.isSymbolicLink() || !sourceStat.isFile())
    throw new Error(`Refusing copy fallback from non-file source: ${src}`);
  const destStat = await fsModule.lstat(dest).catch((lstatError) => {
    if (lstatError.code === "ENOENT") return null;
    throw lstatError;
  });
  if (destStat?.isSymbolicLink())
    throw new Error(`Refusing copy fallback through symlink destination: ${dest}`);
  if (destStat) await fsModule.rm(dest, { force: true });
  let sourceHandle = null;
  let destHandle = null;
  try {
    sourceHandle = await fsModule.open(src, OPEN_READ_FLAGS);
    destHandle = await fsModule.open(dest, OPEN_WRITE_EXCLUSIVE_FLAGS, sourceStat.mode & 511);
    await destHandle.writeFile(await sourceHandle.readFile());
  } finally {
    await destHandle?.close().catch(() => void 0);
    await sourceHandle?.close().catch(() => void 0);
  }
  await fsModule.unlink(src).catch(() => void 0);
}
function copyFallbackReplaceSync(fsModule, src, dest) {
  const sourceStat = fsModule.lstatSync(src);
  if (sourceStat.isSymbolicLink() || !sourceStat.isFile())
    throw new Error(`Refusing copy fallback from non-file source: ${src}`);
  let destStat = null;
  try {
    destStat = fsModule.lstatSync(dest);
  } catch (lstatError) {
    if (lstatError.code !== "ENOENT") throw lstatError;
  }
  if (destStat?.isSymbolicLink())
    throw new Error(`Refusing copy fallback through symlink destination: ${dest}`);
  if (destStat) fsModule.rmSync(dest, { force: true });
  let sourceFd;
  let destFd;
  try {
    sourceFd = fsModule.openSync(src, OPEN_READ_FLAGS);
    destFd = fsModule.openSync(dest, OPEN_WRITE_EXCLUSIVE_FLAGS, sourceStat.mode & 511);
    fsModule.writeFileSync(destFd, fsModule.readFileSync(sourceFd));
  } finally {
    if (destFd !== void 0)
      try {
        fsModule.closeSync(destFd);
      } catch {}
    if (sourceFd !== void 0)
      try {
        fsModule.closeSync(sourceFd);
      } catch {}
  }
  try {
    fsModule.unlinkSync(src);
  } catch {}
}
function validateReplaceFilePath(filePath) {
  if (!filePath || filePath.includes("\0"))
    throw new Error("Atomic replace file path must be non-empty.");
}
function buildReplaceTempPath(filePath, tempPrefix) {
  const dir = path.dirname(filePath);
  const safePrefix = assertSafePathPrefix(tempPrefix ?? ".fs-safe-replace", {
    label: "atomic replace temp prefix",
  });
  return path.join(dir, `${safePrefix}.${process.pid}.${randomUUID()}.tmp`);
}
async function resolveMode(options) {
  const defaultMode = options.mode ?? 384;
  if (!options.preserveExistingMode) return defaultMode;
  const stat = await (options.fileSystem?.promises ?? fs$1)
    .stat(options.filePath)
    .catch((error) => {
      if (error.code === "ENOENT") return null;
      throw error;
    });
  return stat ? stat.mode : defaultMode;
}
function resolveModeSync(options) {
  const defaultMode = options.mode ?? 384;
  if (!options.preserveExistingMode) return defaultMode;
  const fsModule = options.fileSystem ?? fs;
  let stat;
  try {
    stat = fsModule.statSync(options.filePath);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  return stat ? stat.mode : defaultMode;
}
async function syncTempFile(fsModule, tempPath) {
  const handle = await fsModule.open(tempPath, "r+");
  try {
    await handle.sync();
  } catch (error) {
    if (error.code !== "EPERM") throw error;
  } finally {
    await handle.close();
  }
}
function syncTempFileSync(fsModule, tempPath) {
  const fd = fsModule.openSync(tempPath, "r+");
  try {
    fsModule.fsyncSync(fd);
  } catch (error) {
    if (error.code !== "EPERM") throw error;
  } finally {
    fsModule.closeSync(fd);
  }
}
async function syncDirectoryBestEffort(fsModule, dirPath) {
  let handle;
  try {
    handle = await fsModule.open(dirPath, "r");
    await handle.sync();
  } catch {
  } finally {
    await handle?.close().catch(() => void 0);
  }
}
function syncDirectoryBestEffortSync(fsModule, dirPath) {
  let fd;
  try {
    fd = fsModule.openSync(dirPath, "r");
    fsModule.fsyncSync(fd);
  } catch {
  } finally {
    if (fd !== void 0)
      try {
        fsModule.closeSync(fd);
      } catch {}
  }
}
async function cleanupTempFile(params) {
  const cleanupError = await params.fsModule
    .rm(params.tempPath, { force: true })
    .catch((error) => error);
  if (cleanupError && params.throwOnCleanupError && params.originalError !== void 0)
    throw new Error(
      `Atomic file replace failed (${String(params.originalError)}); cleanup also failed (${String(cleanupError)})`,
      { cause: params.originalError },
    );
}
async function replaceFileAtomic(options) {
  const filePath = options.filePath;
  validateReplaceFilePath(filePath);
  return await serializePathWrite(path.resolve(filePath), async () => {
    return await replaceFileAtomicUnserialized(options);
  });
}
async function replaceFileAtomicUnserialized(options) {
  const filePath = options.filePath;
  const fsModule = options.fileSystem?.promises ?? fs$1;
  const dir = path.dirname(filePath);
  const dirMode = options.dirMode ?? 448;
  const mode = await resolveMode(options);
  const tempPath = buildReplaceTempPath(filePath, options.tempPrefix);
  const unregisterTempPath = registerTempPathForExit(tempPath);
  let tempExists = false;
  let originalError;
  await fsModule.mkdir(dir, {
    recursive: true,
    mode: dirMode,
  });
  await fsModule.chmod(dir, dirMode).catch(() => void 0);
  try {
    tempExists = true;
    await fsModule.writeFile(tempPath, options.content, {
      mode,
      flag: "wx",
    });
    if (options.syncTempFile) await syncTempFile(fsModule, tempPath);
    if (options.beforeRename)
      await options.beforeRename({
        filePath,
        tempPath,
      });
    const result = await renameWithRetry({
      fsModule,
      src: tempPath,
      dest: filePath,
      maxRetries: options.renameMaxRetries ?? 0,
      baseDelayMs: options.renameRetryBaseDelayMs ?? 50,
      copyFallbackOnPermissionError: options.copyFallbackOnPermissionError === true,
    });
    tempExists = false;
    unregisterTempPath();
    await fsModule.chmod(filePath, mode).catch(() => void 0);
    if (options.syncParentDir) await syncDirectoryBestEffort(fsModule, dir);
    return result;
  } catch (error) {
    originalError = error;
    throw error;
  } finally {
    if (tempExists)
      await cleanupTempFile({
        fsModule,
        tempPath,
        originalError,
        throwOnCleanupError: options.throwOnCleanupError === true,
      });
    unregisterTempPath();
  }
}
function replaceFileAtomicSync(options) {
  const filePath = options.filePath;
  validateReplaceFilePath(filePath);
  const fsModule = options.fileSystem ?? fs;
  const dir = path.dirname(filePath);
  const dirMode = options.dirMode ?? 448;
  const mode = resolveModeSync(options);
  const tempPath = buildReplaceTempPath(filePath, options.tempPrefix);
  const unregisterTempPath = registerTempPathForExit(tempPath);
  let tempExists = false;
  let originalError;
  fsModule.mkdirSync(dir, {
    recursive: true,
    mode: dirMode,
  });
  try {
    fsModule.chmodSync(dir, dirMode);
  } catch {}
  try {
    tempExists = true;
    fsModule.writeFileSync(tempPath, options.content, {
      mode,
      flag: "wx",
    });
    if (options.syncTempFile) syncTempFileSync(fsModule, tempPath);
    if (options.beforeRename)
      options.beforeRename({
        filePath,
        tempPath,
      });
    const result = renameWithRetrySync({
      fsModule,
      src: tempPath,
      dest: filePath,
      maxRetries: options.renameMaxRetries ?? 0,
      baseDelayMs: options.renameRetryBaseDelayMs ?? 50,
      copyFallbackOnPermissionError: options.copyFallbackOnPermissionError === true,
    });
    tempExists = false;
    unregisterTempPath();
    try {
      fsModule.chmodSync(filePath, mode);
    } catch {}
    if (options.syncParentDir) syncDirectoryBestEffortSync(fsModule, dir);
    return result;
  } catch (error) {
    originalError = error;
    throw error;
  } finally {
    if (tempExists)
      try {
        fsModule.rmSync(tempPath, { force: true });
      } catch (cleanupError) {
        if (options.throwOnCleanupError && originalError !== void 0)
          throw new Error(
            `Atomic file replace failed (${String(originalError)}); cleanup also failed (${String(cleanupError)})`,
            { cause: originalError },
          );
      }
    unregisterTempPath();
  }
}
//#endregion
export { replaceFileAtomicSync as n, replaceFileAtomic as t };
