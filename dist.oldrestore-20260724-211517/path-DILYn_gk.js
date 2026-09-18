import fs from "node:fs";
import path from "node:path";
import { URL, fileURLToPath } from "node:url";
import { t as normalizeLowercaseStringOrEmpty } from "./string-coerce-6TL5VVOL.js";
//#region node_modules/@openclaw/fs-safe/dist/errors.js
const OPERATIONAL_CODES = /* @__PURE__ */ new Set([
  "helper-failed",
  "helper-unavailable",
  "permission-unverified",
  "timeout",
  "unsupported-platform",
]);
function categorizeFsSafeError(code) {
  return OPERATIONAL_CODES.has(code) ? "operational" : "policy";
}
var FsSafeError = class extends Error {
  code;
  category;
  constructor(code, message, options = {}) {
    super(message, options);
    this.name = "FsSafeError";
    this.code = code;
    this.category = categorizeFsSafeError(code);
  }
};
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/local-file-access.js
const ENCODED_FILE_URL_SEPARATOR_RE = /%(?:2f|5c)/i;
function isLocalFileUrlHost(hostname) {
  const normalized = normalizeLowercaseStringOrEmpty(hostname);
  return normalized === "" || normalized === "localhost";
}
function hasEncodedFileUrlSeparator(pathname) {
  return ENCODED_FILE_URL_SEPARATOR_RE.test(pathname);
}
function isWindowsNetworkPath(filePath, platform = process.platform) {
  if (platform !== "win32") return false;
  const normalized = filePath.replace(/\//g, "\\");
  return normalized.startsWith("\\\\?\\UNC\\") || normalized.startsWith("\\\\");
}
function isWindowsDriveLetterPath(filePath, platform = process.platform) {
  return platform === "win32" && /^[A-Za-z]:[\\/]/.test(filePath);
}
function assertNoWindowsNetworkPath(filePath, label = "Path") {
  if (isWindowsNetworkPath(filePath))
    throw new Error(`${label} cannot use Windows network paths: ${filePath}`);
}
function safeFileURLToPath(fileUrl) {
  let parsed;
  try {
    parsed = new URL(fileUrl);
  } catch {
    throw new Error(`Invalid file:// URL: ${fileUrl}`);
  }
  if (parsed.protocol !== "file:") throw new Error(`Invalid file:// URL: ${fileUrl}`);
  if (!isLocalFileUrlHost(parsed.hostname))
    throw new Error(`file:// URLs with remote hosts are not allowed: ${fileUrl}`);
  if (hasEncodedFileUrlSeparator(parsed.pathname))
    throw new Error(`file:// URLs cannot encode path separators: ${fileUrl}`);
  const filePath = fileURLToPath(parsed);
  assertNoWindowsNetworkPath(filePath, "Local file URL");
  return filePath;
}
function trySafeFileURLToPath(fileUrl) {
  try {
    return safeFileURLToPath(fileUrl);
  } catch {
    return;
  }
}
function basenameFromMediaSource(source) {
  if (!source) return;
  if (source.startsWith("file://")) {
    const filePath = trySafeFileURLToPath(source);
    return filePath ? path.basename(filePath) || void 0 : void 0;
  }
  if (/^https?:\/\//i.test(source))
    try {
      return path.basename(new URL(source).pathname) || void 0;
    } catch {
      return;
    }
  return path.basename(source) || void 0;
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/device-path.js
const POSIX_BLOCKED_DEVICE_PATHS = /* @__PURE__ */ new Set([
  "/dev/zero",
  "/dev/random",
  "/dev/urandom",
  "/dev/full",
  "/dev/stdin",
  "/dev/stdout",
  "/dev/stderr",
  "/dev/tty",
  "/dev/console",
]);
const WINDOWS_RESERVED_DEVICE_NAMES = /* @__PURE__ */ new Set([
  "CON",
  "PRN",
  "AUX",
  "NUL",
  "CLOCK$",
  "CONIN$",
  "CONOUT$",
  "COM1",
  "COM2",
  "COM3",
  "COM4",
  "COM5",
  "COM6",
  "COM7",
  "COM8",
  "COM9",
  "COM¹",
  "COM²",
  "COM³",
  "LPT1",
  "LPT2",
  "LPT3",
  "LPT4",
  "LPT5",
  "LPT6",
  "LPT7",
  "LPT8",
  "LPT9",
  "LPT¹",
  "LPT²",
  "LPT³",
]);
function candidateReadPaths(filePath) {
  if (!filePath.startsWith("file://")) return [filePath];
  const parsed = trySafeFileURLToPath(filePath);
  return parsed === void 0 ? [filePath] : [filePath, parsed];
}
function normalizePosixPath(filePath, cwd) {
  if (path.posix.isAbsolute(filePath)) return path.posix.normalize(filePath);
  const base = cwd && path.posix.isAbsolute(cwd) ? cwd : process.cwd();
  return path.posix.resolve(base, filePath);
}
function matchPosixDeviceReadPath(filePath, cwd) {
  const normalized = normalizePosixPath(filePath, cwd);
  if (POSIX_BLOCKED_DEVICE_PATHS.has(normalized))
    return {
      path: normalized,
      reason: "posix-device",
    };
  if (normalized === "/dev/fd" || normalized.startsWith("/dev/fd/"))
    return {
      path: normalized,
      reason: "posix-fd",
    };
  if (/^\/proc\/(?:self|thread-self|\d+)\/fd(?:\/|$)/.test(normalized))
    return {
      path: normalized,
      reason: "posix-fd",
    };
}
function normalizeWindowsDeviceBaseName(filePath) {
  const normalized = filePath.replace(/\//g, "\\").replace(/[\\]+$/g, "");
  const lastSegment = normalized.split("\\").filter(Boolean).at(-1) ?? normalized;
  const withoutTrailingIgnoredChars = (lastSegment.split(":")[0] ?? lastSegment).replace(
    /[ .]+$/g,
    "",
  );
  return (withoutTrailingIgnoredChars.split(".")[0] ?? withoutTrailingIgnoredChars).toUpperCase();
}
function matchWindowsDeviceReadPath(filePath) {
  const normalized = filePath.replace(/\//g, "\\");
  if (/^\\\\\.\\/.test(normalized) || /^\\\\\?\\GLOBALROOT\\Device\\/i.test(normalized))
    return {
      path: normalized,
      reason: "windows-device",
    };
  const baseName = normalizeWindowsDeviceBaseName(filePath);
  if (WINDOWS_RESERVED_DEVICE_NAMES.has(baseName))
    return {
      path: normalized,
      reason: "windows-device",
    };
}
function matchUnsafeDeviceReadPath(filePath, options = {}) {
  const platform = options.platform ?? process.platform;
  for (const candidate of candidateReadPaths(filePath)) {
    const match =
      platform === "win32"
        ? matchWindowsDeviceReadPath(candidate)
        : matchPosixDeviceReadPath(candidate, options.cwd);
    if (match) return match;
  }
}
function isUnsafeDeviceReadPath(filePath, options) {
  return matchUnsafeDeviceReadPath(filePath, options) !== void 0;
}
function assertNoUnsafeDeviceReadPath(filePath, options) {
  if (matchUnsafeDeviceReadPath(filePath, options))
    throw new FsSafeError(
      "device-path",
      `file reads from unsafe device paths are not allowed: ${filePath}`,
    );
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/path.js
const NOT_FOUND_CODES = /* @__PURE__ */ new Set(["ENOENT", "ENOTDIR"]);
const SYMLINK_OPEN_CODES = /* @__PURE__ */ new Set(["ELOOP", "EINVAL", "ENOTSUP"]);
const POSIX_SEPARATOR_CHAR_CODE = 47;
function normalizeWindowsPathForComparison(input) {
  let normalized = path.win32.normalize(input);
  if (normalized.startsWith("\\\\?\\")) {
    normalized = normalized.slice(4);
    if (normalized.toUpperCase().startsWith("UNC\\")) normalized = `\\\\${normalized.slice(4)}`;
  }
  return normalizeLowercaseStringOrEmpty(normalized.replaceAll("/", "\\"));
}
function isNodeError(value) {
  return Boolean(value && typeof value === "object" && "code" in value);
}
function hasNodeErrorCode(value, code) {
  return isNodeError(value) && value.code === code;
}
function assertNoNulPathInput(filePath, message = "path contains a NUL byte") {
  if (filePath.includes("\0")) throw new FsSafeError("invalid-path", message);
}
function isNotFoundPathError(value) {
  return isNodeError(value) && typeof value.code === "string" && NOT_FOUND_CODES.has(value.code);
}
function isSymlinkOpenError(value) {
  return isNodeError(value) && typeof value.code === "string" && SYMLINK_OPEN_CODES.has(value.code);
}
function isPathInside(root, target) {
  if (process.platform === "win32") {
    const rootForCompare = normalizeWindowsPathForComparison(path.win32.resolve(root));
    const targetForCompare = normalizeWindowsPathForComparison(path.win32.resolve(target));
    const relative = path.win32.relative(rootForCompare, targetForCompare);
    const firstSegment = relative.split(path.win32.sep)[0];
    return relative === "" || (firstSegment !== ".." && !path.win32.isAbsolute(relative));
  }
  if (
    root.length > 0 &&
    root.charCodeAt(0) === POSIX_SEPARATOR_CHAR_CODE &&
    target.length >= root.length &&
    target.charCodeAt(0) === POSIX_SEPARATOR_CHAR_CODE &&
    !target.includes("/..") &&
    (target === root ||
      (target.startsWith(root) && target.charCodeAt(root.length) === POSIX_SEPARATOR_CHAR_CODE))
  )
    return true;
  const resolvedRoot = path.resolve(root);
  const resolvedTarget = path.resolve(target);
  const relative = path.relative(resolvedRoot, resolvedTarget);
  const firstSegment = relative.split(path.posix.sep)[0];
  return relative === "" || (firstSegment !== ".." && !path.isAbsolute(relative));
}
function isPathRelativeEscape(relativePath) {
  return (
    relativePath === ".." ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  );
}
function resolveSafeBaseDir(rootDir) {
  const resolved = path.resolve(rootDir);
  return resolved.endsWith(path.sep) ? resolved : `${resolved}${path.sep}`;
}
function isWithinDir(rootDir, targetPath) {
  return isPathInside(rootDir, targetPath);
}
function safeRealpathSync(targetPath, cache) {
  const cached = cache?.get(targetPath);
  if (cached) return cached;
  try {
    const resolved = fs.realpathSync(targetPath);
    cache?.set(targetPath, resolved);
    cache?.set(resolved, resolved);
    return resolved;
  } catch {
    return null;
  }
}
function isPathInsideWithRealpath(basePath, candidatePath, opts) {
  if (!isPathInside(basePath, candidatePath)) return false;
  const baseReal = safeRealpathSync(basePath, opts?.cache);
  const candidateReal = safeRealpathSync(candidatePath, opts?.cache);
  if (!baseReal || !candidateReal) return opts?.requireRealpath === false;
  return isPathInside(baseReal, candidateReal);
}
function safeStatSync(targetPath) {
  try {
    return fs.statSync(targetPath);
  } catch {
    return null;
  }
}
function splitSafeRelativePath(relativePath) {
  if (relativePath.length === 0 || relativePath === ".") return [];
  assertNoNulPathInput(relativePath, "relative path contains a NUL byte");
  if (relativePath.includes("\\"))
    throw new FsSafeError("invalid-path", "relative path must use forward slashes");
  if (
    path.posix.isAbsolute(relativePath) ||
    path.win32.isAbsolute(relativePath) ||
    relativePath.startsWith("//")
  )
    throw new FsSafeError("invalid-path", "relative path must not be absolute");
  const segments = relativePath
    .split("/")
    .filter((segment) => segment.length > 0 && segment !== ".");
  for (const segment of segments)
    if (segment === "..")
      throw new FsSafeError("invalid-path", "relative path must not contain '..'");
  return segments;
}
function resolveSafeRelativePath(rootDir, relativePath) {
  const root = path.resolve(rootDir);
  const target = path.resolve(root, ...splitSafeRelativePath(relativePath));
  if (!isPathInside(root, target))
    throw new FsSafeError("outside-workspace", "relative path escapes root");
  return target;
}
//#endregion
export {
  FsSafeError as C,
  trySafeFileURLToPath as S,
  basenameFromMediaSource as _,
  isPathInsideWithRealpath as a,
  isWindowsNetworkPath as b,
  isWithinDir as c,
  resolveSafeRelativePath as d,
  safeRealpathSync as f,
  assertNoWindowsNetworkPath as g,
  isUnsafeDeviceReadPath as h,
  isPathInside as i,
  normalizeWindowsPathForComparison as l,
  assertNoUnsafeDeviceReadPath as m,
  hasNodeErrorCode as n,
  isPathRelativeEscape as o,
  safeStatSync as p,
  isNotFoundPathError as r,
  isSymlinkOpenError as s,
  assertNoNulPathInput as t,
  resolveSafeBaseDir as u,
  hasEncodedFileUrlSeparator as v,
  safeFileURLToPath as x,
  isWindowsDriveLetterPath as y,
};
