import crypto, { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { t as assertSafePathPrefix } from "./safe-path-segment-Dec_-PAQ.js";
import {
  a as root,
  l as getFsSafeTestHooks,
  t as resolveSecureTempRoot,
} from "./secure-temp-dir-DMUMnweR.js";
import {
  c as assertAsyncDirectoryGuard,
  n as registerTempPathForExit,
  s as withAsyncDirectoryGuards,
  t as serializePathWrite,
  u as createAsyncDirectoryGuard,
} from "./write-queue-DxjVr7Ru.js";
//#region node_modules/@openclaw/fs-safe/dist/filename.js
function sanitizeUntrustedFileName(fileName, fallbackName) {
  const trimmed = typeof fileName === "string" ? fileName.trim() : "";
  if (!trimmed) return fallbackName;
  let base = path.posix.basename(trimmed);
  base = path.win32.basename(base);
  let cleaned = "";
  for (let i = 0; i < base.length; i++) {
    const code = base.charCodeAt(i);
    if (code < 32 || code === 127) continue;
    cleaned += base[i];
  }
  base = cleaned.trim();
  if (!base || base === "." || base === "..") return fallbackName;
  if (base.length > 200) base = base.slice(0, 200);
  return base;
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/sibling-temp.js
function buildTempPath(dir, tempPrefix) {
  const safePrefix = assertSafePathPrefix(tempPrefix ?? ".fs-safe-stream", {
    label: "sibling temp prefix",
  });
  return path.join(dir, `${safePrefix}.${process.pid}.${randomUUID()}.tmp`);
}
async function syncFileBestEffort(filePath) {
  const handle = await fs.open(filePath, "r+");
  try {
    await handle.sync();
  } catch (error) {
    if (error.code !== "EPERM") throw error;
  } finally {
    await handle.close();
  }
}
async function syncDirectoryBestEffort(dirPath) {
  let handle;
  try {
    handle = await fs.open(dirPath, "r");
    await handle.sync();
  } catch {
  } finally {
    await handle?.close().catch(() => void 0);
  }
}
function assertFinalPathIsSibling(dir, filePath) {
  const resolvedDir = path.resolve(dir);
  const resolvedFile = path.resolve(filePath);
  if (path.dirname(resolvedFile) !== resolvedDir)
    throw new Error("Final path must be in the sibling temp directory.");
}
async function writeSiblingTempFile(options) {
  const dir = path.resolve(options.dir);
  await fs.mkdir(dir, {
    recursive: true,
    mode: options.dirMode ?? 448,
  });
  if (options.chmodDir !== false) await fs.chmod(dir, options.dirMode ?? 448).catch(() => void 0);
  const dirGuard = await createAsyncDirectoryGuard(dir);
  const tempPath = buildTempPath(dir, options.tempPrefix);
  const unregisterTempPath = registerTempPathForExit(tempPath);
  let tempExists = false;
  try {
    tempExists = true;
    const result = await options.writeTemp(tempPath);
    if (options.mode !== void 0) await fs.chmod(tempPath, options.mode).catch(() => void 0);
    if (options.syncTempFile) await syncFileBestEffort(tempPath);
    const filePath = path.resolve(options.resolveFinalPath(result));
    assertFinalPathIsSibling(dir, filePath);
    await serializePathWrite(filePath, async () => {
      await withAsyncDirectoryGuards([dirGuard], async () => {
        await fs.rename(tempPath, filePath);
      });
      tempExists = false;
      unregisterTempPath();
      if (options.mode !== void 0) await fs.chmod(filePath, options.mode).catch(() => void 0);
      if (options.syncParentDir) await syncDirectoryBestEffort(dir);
    });
    return {
      filePath,
      result,
    };
  } finally {
    if (tempExists) await fs.rm(tempPath, { force: true }).catch(() => void 0);
    unregisterTempPath();
  }
}
function buildSiblingTempPath(params) {
  const id = crypto.randomUUID();
  const safePrefix = assertSafePathPrefix(params.tempPrefix, { label: "sibling temp prefix" });
  const safeTail = sanitizeUntrustedFileName(
    path.basename(params.targetPath),
    params.fallbackFileName,
  );
  return path.join(path.dirname(params.targetPath), `${safePrefix}${id}-${safeTail}.part`);
}
async function writeViaSiblingTempPath(params) {
  const rootDir = await fs
    .realpath(path.resolve(params.rootDir))
    .catch(() => path.resolve(params.rootDir));
  const requestedTargetPath = path.resolve(params.targetPath);
  const targetPath = await fs
    .realpath(path.dirname(requestedTargetPath))
    .then((realDir) => path.join(realDir, path.basename(requestedTargetPath)))
    .catch(() => requestedTargetPath);
  const relativeTargetPath = path.relative(rootDir, targetPath);
  if (
    !relativeTargetPath ||
    relativeTargetPath === ".." ||
    relativeTargetPath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativeTargetPath)
  )
    throw new Error("Target path is outside the allowed root");
  const rootGuard = await createAsyncDirectoryGuard(rootDir);
  const tempDir = await fs.mkdtemp(
    path.join(
      resolveSecureTempRoot({
        fallbackPrefix: "fs-safe-output",
        unsafeFallbackLabel: "sibling temp output dir",
        warn: () => void 0,
      }),
      "fs-safe-output-",
    ),
  );
  const tempPath = buildSiblingTempPath({
    targetPath: path.join(tempDir, path.basename(targetPath)),
    fallbackFileName: params.fallbackFileName ?? "output.bin",
    tempPrefix: params.tempPrefix ?? ".fs-safe-output-",
  });
  const unregisterTempPath = registerTempPathForExit(tempDir, { recursive: true });
  try {
    await getFsSafeTestHooks()?.beforeSiblingTempWrite?.(tempPath);
    await params.writeTemp(tempPath);
    await assertAsyncDirectoryGuard(rootGuard);
    await (await root(rootDir)).copyIn(relativeTargetPath, tempPath, { mkdir: false });
    await assertAsyncDirectoryGuard(rootGuard);
  } finally {
    await fs
      .rm(tempDir, {
        recursive: true,
        force: true,
      })
      .catch(() => {});
    unregisterTempPath();
  }
}
//#endregion
export { writeViaSiblingTempPath as n, sanitizeUntrustedFileName as r, writeSiblingTempFile as t };
