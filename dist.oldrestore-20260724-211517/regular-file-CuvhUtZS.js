import fs from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { t as sameFileIdentity } from "./file-identity-C0fBiekR.js";
import {
  C as FsSafeError,
  m as assertNoUnsafeDeviceReadPath,
  r as isNotFoundPathError,
} from "./path-DILYn_gk.js";
import {
  n as assertNoSymlinkParentsSync,
  t as assertNoSymlinkParents,
} from "./symlink-parents-D3bl9xr3.js";
//#region node_modules/@openclaw/fs-safe/dist/regular-file.js
function resolveRegularFileAppendFlags(constants = fs.constants) {
  const noFollow = constants.O_NOFOLLOW;
  return (
    constants.O_CREAT |
    constants.O_APPEND |
    constants.O_WRONLY |
    (typeof noFollow === "number" ? noFollow : 0)
  );
}
function resolveRegularFileReadFlags() {
  return (
    fs.constants.O_RDONLY |
    (typeof fs.constants.O_NOFOLLOW === "number" && process.platform !== "win32"
      ? fs.constants.O_NOFOLLOW
      : 0)
  );
}
async function readFileHandleBounded(params) {
  if (params.maxBytes === void 0) return await params.handle.readFile();
  const chunks = [];
  const scratch = Buffer.allocUnsafe(Math.min(64 * 1024, Math.max(1, params.maxBytes + 1)));
  let total = 0;
  while (true) {
    const { bytesRead } = await params.handle.read(scratch, 0, scratch.length, null);
    if (bytesRead === 0) return Buffer.concat(chunks, total);
    total += bytesRead;
    if (total > params.maxBytes)
      throw new Error(`File exceeds ${params.maxBytes} bytes: ${params.filePath}`);
    chunks.push(Buffer.from(scratch.subarray(0, bytesRead)));
  }
}
function readFileDescriptorBounded(params) {
  if (params.maxBytes === void 0) return fs.readFileSync(params.fd);
  const chunks = [];
  const scratch = Buffer.allocUnsafe(Math.min(64 * 1024, Math.max(1, params.maxBytes + 1)));
  let total = 0;
  while (true) {
    const bytesRead = fs.readSync(params.fd, scratch, 0, scratch.length, null);
    if (bytesRead === 0) return Buffer.concat(chunks, total);
    total += bytesRead;
    if (total > params.maxBytes)
      throw new Error(`File exceeds ${params.maxBytes} bytes: ${params.filePath}`);
    chunks.push(Buffer.from(scratch.subarray(0, bytesRead)));
  }
}
async function statRegularFile(filePath) {
  let stat;
  try {
    stat = await fs$1.lstat(filePath);
  } catch (err) {
    if (isNotFoundPathError(err)) return { missing: true };
    throw err;
  }
  if (stat.isSymbolicLink() || !stat.isFile()) throw new Error("path must be a regular file");
  return {
    missing: false,
    stat,
  };
}
function statRegularFileSync(filePath) {
  let stat;
  try {
    stat = fs.lstatSync(filePath);
  } catch (err) {
    if (isNotFoundPathError(err)) return { missing: true };
    throw err;
  }
  if (stat.isSymbolicLink() || !stat.isFile()) throw new Error("path must be a regular file");
  return {
    missing: false,
    stat,
  };
}
async function readRegularFile(params) {
  assertNoUnsafeDeviceReadPath(params.filePath);
  const result = await statRegularFile(params.filePath);
  if (result.missing)
    throw Object.assign(/* @__PURE__ */ new Error(`File not found: ${params.filePath}`), {
      code: "ENOENT",
    });
  if (params.maxBytes !== void 0 && result.stat.size > params.maxBytes)
    throw new Error(`File exceeds ${params.maxBytes} bytes: ${params.filePath}`);
  let handle;
  try {
    handle = await fs$1.open(params.filePath, resolveRegularFileReadFlags());
  } catch (err) {
    if (isNotFoundPathError(err))
      throw new FsSafeError("path-mismatch", `File changed during read: ${params.filePath}`);
    throw err;
  }
  try {
    const stat = await handle.stat();
    let pathStat;
    try {
      pathStat = await fs$1.lstat(params.filePath);
    } catch (err) {
      if (isNotFoundPathError(err))
        throw new FsSafeError("path-mismatch", `File changed during read: ${params.filePath}`);
      throw err;
    }
    verifyStableReadTarget({
      filePath: params.filePath,
      pathStat,
      postOpenStat: stat,
      preOpenStat: result.stat,
    });
    if (params.maxBytes !== void 0 && stat.size > params.maxBytes)
      throw new Error(`File exceeds ${params.maxBytes} bytes: ${params.filePath}`);
    return {
      buffer: await readFileHandleBounded({
        handle,
        filePath: params.filePath,
        maxBytes: params.maxBytes,
      }),
      stat,
    };
  } finally {
    await handle.close();
  }
}
function verifyStableReadTarget(params) {
  if (
    !params.postOpenStat.isFile() ||
    params.pathStat.isSymbolicLink() ||
    !params.pathStat.isFile()
  )
    throw new Error(`File is not a regular file: ${params.filePath}`);
  if (
    !sameFileIdentity(params.preOpenStat, params.postOpenStat) ||
    !sameFileIdentity(params.pathStat, params.postOpenStat)
  )
    throw new FsSafeError("path-mismatch", `File changed during read: ${params.filePath}`);
}
function readOpenedRegularFileSync(params) {
  const stat = fs.fstatSync(params.fd);
  verifyStableReadTarget({
    filePath: params.filePath,
    pathStat: fs.lstatSync(params.filePath),
    postOpenStat: stat,
    preOpenStat: params.preOpenStat,
  });
  if (params.maxBytes !== void 0 && stat.size > params.maxBytes)
    throw new Error(`File exceeds ${params.maxBytes} bytes: ${params.filePath}`);
  return {
    buffer: readFileDescriptorBounded({
      fd: params.fd,
      filePath: params.filePath,
      maxBytes: params.maxBytes,
    }),
    stat,
  };
}
function readRegularFileSync(params) {
  assertNoUnsafeDeviceReadPath(params.filePath);
  const result = statRegularFileSync(params.filePath);
  if (result.missing)
    throw Object.assign(/* @__PURE__ */ new Error(`File not found: ${params.filePath}`), {
      code: "ENOENT",
    });
  if (params.maxBytes !== void 0 && result.stat.size > params.maxBytes)
    throw new Error(`File exceeds ${params.maxBytes} bytes: ${params.filePath}`);
  const fd = fs.openSync(params.filePath, resolveRegularFileReadFlags());
  try {
    return readOpenedRegularFileSync({
      fd,
      filePath: params.filePath,
      preOpenStat: result.stat,
      maxBytes: params.maxBytes,
    });
  } finally {
    fs.closeSync(fd);
  }
}
function verifyStableAppendTarget(params) {
  if (!params.postOpenStat.isFile())
    throw new Error(`Refusing to append to non-file: ${params.filePath}`);
  if (params.postOpenStat.nlink > 1)
    throw new Error(`Refusing to append to hardlinked file: ${params.filePath}`);
  const pre = params.preOpenStat;
  if (pre && (pre.dev !== params.postOpenStat.dev || pre.ino !== params.postOpenStat.ino))
    throw new Error(`Refusing to append after file changed: ${params.filePath}`);
}
async function appendRegularFile(options) {
  if (options.rejectSymlinkParents === true) {
    const resolvedDir = path.resolve(path.dirname(options.filePath));
    await assertNoSymlinkParents({
      rootDir: path.parse(resolvedDir).root,
      targetPath: resolvedDir,
      allowMissing: false,
      allowRootChildSymlink: true,
      requireDirectories: true,
      messagePrefix: "Refusing to append under",
    });
  }
  let preOpenStat;
  try {
    const stat = await fs$1.lstat(options.filePath);
    if (stat.isSymbolicLink())
      throw new Error(`Refusing to append through symlink: ${options.filePath}`);
    if (!stat.isFile()) throw new Error(`Refusing to append to non-file: ${options.filePath}`);
    preOpenStat = stat;
  } catch (err) {
    if (!isNotFoundPathError(err)) throw err;
  }
  const contentBytes = Buffer.isBuffer(options.content)
    ? options.content.byteLength
    : Buffer.byteLength(options.content, options.encoding ?? "utf8");
  if (
    options.maxFileBytes !== void 0 &&
    (preOpenStat?.size ?? 0) + contentBytes > options.maxFileBytes
  )
    return;
  const handle = await fs$1.open(
    options.filePath,
    resolveRegularFileAppendFlags(),
    options.mode ?? 384,
  );
  try {
    const stat = await handle.stat();
    verifyStableAppendTarget({
      preOpenStat,
      postOpenStat: stat,
      filePath: options.filePath,
    });
    if (options.maxFileBytes !== void 0 && stat.size + contentBytes > options.maxFileBytes) return;
    await handle.chmod(options.mode ?? 384);
    await handle.appendFile(options.content, options.encoding ?? "utf8");
  } finally {
    await handle.close();
  }
}
function appendRegularFileSync(options) {
  if (options.rejectSymlinkParents === true) {
    const resolvedDir = path.resolve(path.dirname(options.filePath));
    assertNoSymlinkParentsSync({
      rootDir: path.parse(resolvedDir).root,
      targetPath: resolvedDir,
      allowMissing: false,
      allowRootChildSymlink: true,
      requireDirectories: true,
      messagePrefix: "Refusing to append under",
    });
  }
  let preOpenStat;
  try {
    const stat = fs.lstatSync(options.filePath);
    if (stat.isSymbolicLink())
      throw new Error(`Refusing to append through symlink: ${options.filePath}`);
    if (!stat.isFile()) throw new Error(`Refusing to append to non-file: ${options.filePath}`);
    preOpenStat = stat;
  } catch (err) {
    if (!isNotFoundPathError(err)) throw err;
  }
  const contentBuffer =
    typeof options.content === "string"
      ? Buffer.from(options.content, options.encoding ?? "utf8")
      : Buffer.from(options.content);
  if (
    options.maxFileBytes !== void 0 &&
    (preOpenStat?.size ?? 0) + contentBuffer.byteLength > options.maxFileBytes
  )
    return;
  const fd = fs.openSync(options.filePath, resolveRegularFileAppendFlags(), options.mode ?? 384);
  try {
    const stat = fs.fstatSync(fd);
    verifyStableAppendTarget({
      preOpenStat,
      postOpenStat: stat,
      filePath: options.filePath,
    });
    if (
      options.maxFileBytes !== void 0 &&
      stat.size + contentBuffer.byteLength > options.maxFileBytes
    )
      return;
    fs.fchmodSync(fd, options.mode ?? 384);
    fs.writeSync(fd, contentBuffer, 0, contentBuffer.byteLength);
  } finally {
    fs.closeSync(fd);
  }
}
//#endregion
export {
  resolveRegularFileAppendFlags as a,
  readRegularFileSync as i,
  appendRegularFileSync as n,
  statRegularFile as o,
  readRegularFile as r,
  statRegularFileSync as s,
  appendRegularFile as t,
};
