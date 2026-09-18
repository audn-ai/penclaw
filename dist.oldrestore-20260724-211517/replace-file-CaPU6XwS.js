import "./fs-safe-defaults-B7hUN42l.js";
import { randomUUID } from "node:crypto";
import { constants } from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { t as replaceFileAtomic$1 } from "./replace-file-DfwQ8_Mi.js";
import { r as guardedRename } from "./write-queue-DxjVr7Ru.js";
//#region node_modules/@openclaw/fs-safe/dist/move-path.js
function moveCopyFallbackReasonForRenameError(error, platform = process.platform) {
  const code = error?.code;
  if (code === "EXDEV") return "cross-device";
  if (code === "EPERM" && platform === "win32") return "windows-rename-denied";
}
function entryIdentity(stat) {
  return {
    ctimeMs: stat.ctimeMs,
    dev: stat.dev,
    ino: stat.ino,
    mode: stat.mode,
    mtimeMs: stat.mtimeMs,
    size: stat.size,
  };
}
function sameIdentity(a, b) {
  return (
    a.dev === b.dev &&
    a.ino === b.ino &&
    a.mode === b.mode &&
    a.size === b.size &&
    a.mtimeMs === b.mtimeMs &&
    a.ctimeMs === b.ctimeMs
  );
}
function sameDirectoryNode(a, b) {
  return a.dev === b.dev && a.ino === b.ino;
}
function modeBits(mode) {
  return mode & 511;
}
function sourceChangedError(sourcePath) {
  return Object.assign(
    /* @__PURE__ */ new Error(`Source changed during move fallback: ${sourcePath}`),
    { code: "ESTALE" },
  );
}
async function assertSourceStillMatches(sourcePath, identity) {
  if (!sameIdentity(identity, entryIdentity(await fs$1.lstat(sourcePath))))
    throw sourceChangedError(sourcePath);
}
function regularReadFlags() {
  return (
    constants.O_RDONLY |
    (typeof constants.O_NOFOLLOW === "number" && process.platform !== "win32"
      ? constants.O_NOFOLLOW
      : 0)
  );
}
async function writeAll(handle, buffer, bytesRead) {
  let offset = 0;
  while (offset < bytesRead) {
    const { bytesWritten } = await handle.write(buffer, offset, bytesRead - offset);
    offset += bytesWritten;
  }
}
async function copyRegularFilePinned(params) {
  let destinationCreated = false;
  let sourceHandle;
  try {
    sourceHandle = await fs$1.open(params.from, regularReadFlags());
  } catch (error) {
    const code = error?.code;
    if (code === "ELOOP" || code === "ENOENT" || code === "ENOTDIR")
      throw sourceChangedError(params.from);
    throw error;
  }
  try {
    const openedStat = await sourceHandle.stat();
    if (!openedStat.isFile() || !sameIdentity(params.identity, entryIdentity(openedStat)))
      throw sourceChangedError(params.from);
    const destinationHandle = await fs$1.open(
      params.to,
      constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL,
      modeBits(params.mode) || 438,
    );
    destinationCreated = true;
    try {
      const scratch = Buffer.allocUnsafe(64 * 1024);
      while (true) {
        const { bytesRead } = await sourceHandle.read(scratch, 0, scratch.length, null);
        if (bytesRead === 0) break;
        await writeAll(destinationHandle, scratch, bytesRead);
      }
    } finally {
      await destinationHandle.close();
    }
    if (!sameIdentity(params.identity, entryIdentity(await sourceHandle.stat())))
      throw sourceChangedError(params.from);
    await fs$1.chmod(params.to, modeBits(params.mode)).catch(() => void 0);
  } catch (error) {
    if (destinationCreated) await fs$1.rm(params.to, { force: true }).catch(() => void 0);
    throw error;
  } finally {
    await sourceHandle.close();
  }
}
async function copyEntryWithManifest(from, to, options) {
  const sourceStat = await fs$1.lstat(from);
  const identity = entryIdentity(sourceStat);
  if (sourceStat.isSymbolicLink()) {
    await fs$1.symlink(await fs$1.readlink(from), to);
    await assertSourceStillMatches(from, identity);
    return {
      ...identity,
      kind: "leaf",
    };
  }
  if (sourceStat.isDirectory()) {
    await fs$1.mkdir(to, { mode: modeBits(sourceStat.mode) || 493 });
    const children = [];
    for (const child of await fs$1.readdir(from))
      children.push({
        name: child,
        manifest: await copyEntryWithManifest(
          path.join(from, child),
          path.join(to, child),
          options,
        ),
      });
    await assertSourceStillMatches(from, identity);
    await fs$1.chmod(to, modeBits(sourceStat.mode));
    return {
      ...identity,
      children,
      kind: "directory",
    };
  }
  if (!sourceStat.isFile())
    throw new Error(`Refusing to move non-file path with copy fallback: ${from}`);
  if (options.sourceHardlinks === "reject" && sourceStat.nlink > 1)
    throw new Error(`Refusing to move hardlinked file with copy fallback: ${from}`);
  await copyRegularFilePinned({
    from,
    identity,
    mode: sourceStat.mode,
    to,
  });
  return {
    ...identity,
    kind: "leaf",
  };
}
function mergeCleanupResults(a, b) {
  return a === "stale" || b === "stale" ? "stale" : "removed";
}
async function cleanupCopiedEntry(sourcePath, manifest) {
  let currentStat;
  try {
    currentStat = await fs$1.lstat(sourcePath);
  } catch (error) {
    if (error?.code === "ENOENT") return "removed";
    throw error;
  }
  if (manifest.kind === "directory") {
    if (!currentStat.isDirectory() || !sameDirectoryNode(manifest, entryIdentity(currentStat)))
      return "stale";
    let result = "removed";
    for (const child of manifest.children)
      result = mergeCleanupResults(
        result,
        await cleanupCopiedEntry(path.join(sourcePath, child.name), child.manifest),
      );
    try {
      await fs$1.rmdir(sourcePath);
    } catch (error) {
      const code = error?.code;
      if (code === "ENOTEMPTY" || code === "EEXIST") return "stale";
      throw error;
    }
    return result;
  }
  if (!sameIdentity(manifest, entryIdentity(currentStat))) return "stale";
  await fs$1.unlink(sourcePath);
  return "removed";
}
async function movePathWithCopyFallback$1(options) {
  let fallbackReason;
  try {
    await guardedRename({
      from: options.from,
      to: options.to,
    });
    return;
  } catch (error) {
    fallbackReason = moveCopyFallbackReasonForRenameError(error);
    if (!fallbackReason) throw error;
  }
  const targetDir = path.dirname(path.resolve(options.to));
  const staged = path.join(targetDir, `.fs-safe-move-${process.pid}-${randomUUID()}.tmp`);
  try {
    const manifest = await copyEntryWithManifest(options.from, staged, {
      sourceHardlinks: options.sourceHardlinks ?? "allow",
    });
    await guardedRename({
      from: staged,
      to: options.to,
    });
    if ((await cleanupCopiedEntry(options.from, manifest)) === "stale")
      throw sourceChangedError(options.from);
  } finally {
    await fs$1
      .rm(staged, {
        recursive: true,
        force: true,
      })
      .catch(() => void 0);
  }
}
//#endregion
//#region src/infra/replace-file.ts
/** Atomic file replacement primitive re-exported through the fs-safe defaults shim. */
const replaceFileAtomic = replaceFileAtomic$1;
/**
 * Moves a path using fs-safe's copy fallback, with an OpenClaw hardlink guard
 * for install/update flows that must not preserve package-manager links.
 */
async function movePathWithCopyFallback(options) {
  if (options.sourceHardlinks === "reject") await assertNoHardlinkedSourceFiles(options.from);
  await movePathWithCopyFallback$1({
    from: options.from,
    to: options.to,
  });
}
async function assertNoHardlinkedSourceFiles(sourcePath) {
  const sourceStat = await fs$1.lstat(sourcePath);
  if (sourceStat.isFile() && sourceStat.nlink > 1)
    throw new Error(`Hardlinked source file is not allowed: ${sourcePath}`);
  if (!sourceStat.isDirectory()) return;
  const entries = await fs$1.readdir(sourcePath, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(sourcePath, entry.name);
      if (entry.isDirectory()) {
        await assertNoHardlinkedSourceFiles(entryPath);
        return;
      }
      if (!entry.isFile()) return;
      if ((await fs$1.lstat(entryPath)).nlink > 1)
        throw new Error(`Hardlinked source file is not allowed: ${entryPath}`);
    }),
  );
}
//#endregion
export { replaceFileAtomic as n, movePathWithCopyFallback as t };
