import { randomBytes } from "node:crypto";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { clearTimeout, setTimeout } from "node:timers";
import { a as sha256Hex, o as sha256HexPrefix } from "./crypto-digest-CNeb2i19.js";
import { t as canonicalizeExecApprovalPolicyRules } from "./exec-approval-policy-snapshot-BHqSsTto.js";
import { s as resolveAllowAlwaysPatternEntries } from "./exec-approvals-allowlist-Bc6wvPEu.js";
import { o as withFileLock } from "./file-lock-C2Kr7iLJ.js";
import "./fs-safe-advanced-CBe_wA_B.js";
import { t as resolveGlobalMap } from "./global-singleton-PwlQSEal.js";
import {
  o as resolveRequiredHomeDir,
  r as resolveHomeRelativePath,
  t as expandHomePrefix,
} from "./home-dir-DxrrpDft.js";
import { j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import { i as isNamedProfile } from "./paths-DEklnbzU.js";
import "./file-lock-CsC2zkbH.js";
import { t as getFileLockProcessStartTime } from "./pid-alive-FK23rkys.js";
import "./exec-wrapper-resolution-CSf7MIn-.js";
import "./exec-approvals-analysis-C-pXO6pp.js";
import { t as isPlainObject } from "./plain-object-jVBUx3XB.js";
import { t as DEFAULT_AGENT_ID } from "./session-key-druuY-GG.js";
import {
  f as POSIX_INLINE_COMMAND_FLAGS,
  h as hasPosixLoginStartupBeforeInlineCommand,
  l as isShellWrapperInvocation,
  m as hasPosixInteractiveStartupBeforeInlineCommand,
  r as extractBindableShellWrapperInlineCommand,
} from "./shell-wrapper-resolution-DlXABXcG.js";
import { t as isLockOwnerDefinitelyStale } from "./stale-lock-file-CrWL3Pfl.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  p as readStringValue,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { n as assertNoSymlinkParentsSync } from "./symlink-parents-D3bl9xr3.js";
//#region src/infra/jsonl-socket.ts
const JSONL_SOCKET_MAX_LINE_BYTES = 16 * 1024 * 1024;
/**
 * Sends one JSONL request line, half-closes the write side, and waits for an accepted response line.
 */
function resolveJsonlSocketTimeoutMs(timeoutMs) {
  return resolveTimerTimeoutMs(timeoutMs, 1);
}
async function requestJsonlSocketWithMaxLineBytes(params, maxLineBytes) {
  const { socketPath, requestLine, accept } = params;
  const timeoutMs = resolveJsonlSocketTimeoutMs(params.timeoutMs);
  return await new Promise((resolve) => {
    const client = new net.Socket();
    let settled = false;
    let lineChunks = [];
    let lineBytes = 0;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try {
        client.destroy();
      } catch {}
      resolve(value);
    };
    const appendLineChunk = (chunk) => {
      if (lineBytes + chunk.byteLength > maxLineBytes) {
        finish(null);
        return false;
      }
      if (chunk.byteLength > 0) {
        lineChunks.push(chunk);
        lineBytes += chunk.byteLength;
      }
      return true;
    };
    const takeLine = () => {
      const line = Buffer.concat(lineChunks, lineBytes).toString("utf8").trim();
      lineChunks = [];
      lineBytes = 0;
      return line;
    };
    const timer = setTimeout(() => finish(null), timeoutMs);
    client.on("error", () => finish(null));
    client.on("end", () => finish(null));
    client.on("close", () => finish(null));
    client.connect(socketPath, () => {
      client.end(`${requestLine}\n`);
    });
    client.on("data", (data) => {
      let offset = 0;
      while (offset < data.byteLength) {
        const newlineIndex = data.indexOf(10, offset);
        if (newlineIndex === -1) {
          appendLineChunk(data.subarray(offset));
          return;
        }
        if (!appendLineChunk(data.subarray(offset, newlineIndex))) return;
        const line = takeLine();
        offset = newlineIndex + 1;
        if (!line) continue;
        try {
          const msg = JSON.parse(line);
          const result = accept(msg);
          if (result === void 0) continue;
          finish(result);
          return;
        } catch {}
      }
    });
  });
}
async function requestJsonlSocket(params) {
  return await requestJsonlSocketWithMaxLineBytes(params, JSONL_SOCKET_MAX_LINE_BYTES);
}
//#endregion
//#region src/infra/exec-approvals.ts
const EXEC_TARGET_VALUES = ["auto", "sandbox", "gateway", "node"];
function normalizeExecHost(value) {
  const normalized = normalizeOptionalLowercaseString(value);
  if (normalized === "sandbox" || normalized === "gateway" || normalized === "node")
    return normalized;
  return null;
}
function normalizeExecTarget(value) {
  const normalized = normalizeOptionalLowercaseString(value);
  if (normalized === "auto") return normalized;
  return normalizeExecHost(normalized);
}
function requireValidExecTarget(value) {
  if (value == null) return null;
  if (typeof value !== "string")
    throw new Error(
      `Invalid exec host value type ${typeof value}. Allowed values: ${EXEC_TARGET_VALUES.join(", ")}.`,
    );
  const normalized = normalizeOptionalLowercaseString(value);
  if (!normalized) return null;
  const target = normalizeExecTarget(normalized);
  if (target) return target;
  throw new Error(
    `Invalid exec host "${value}". Allowed values: ${EXEC_TARGET_VALUES.join(", ")}.`,
  );
}
/** Coerce a raw JSON field to string, returning undefined for non-string types. */
const toStringOrUndefined = readStringValue;
function normalizeExecSecurity(value) {
  const normalized = normalizeOptionalLowercaseString(value);
  if (normalized === "deny" || normalized === "allowlist" || normalized === "full")
    return normalized;
  return null;
}
function normalizeExecAsk(value) {
  const normalized = normalizeOptionalLowercaseString(value);
  if (normalized === "off" || normalized === "on-miss" || normalized === "always")
    return normalized;
  return null;
}
function normalizeExecMode(value) {
  const normalized = normalizeOptionalLowercaseString(value);
  if (
    normalized === "deny" ||
    normalized === "allowlist" ||
    normalized === "ask" ||
    normalized === "auto" ||
    normalized === "full"
  )
    return normalized;
  return null;
}
function resolveExecModeFromPolicy(params) {
  if (params.security === "deny") return "deny";
  if (params.security === "allowlist" && params.ask === "off") return "allowlist";
  if (params.security === "full" && params.ask !== "always") return "full";
  return "ask";
}
function resolveExecPolicyForMode(mode) {
  switch (mode) {
    case "deny":
      return {
        security: "deny",
        ask: "off",
        autoReview: false,
      };
    case "allowlist":
      return {
        security: "allowlist",
        ask: "off",
        autoReview: false,
      };
    case "ask":
      return {
        security: "allowlist",
        ask: "on-miss",
        autoReview: false,
      };
    case "auto":
      return {
        security: "allowlist",
        ask: "on-miss",
        autoReview: true,
      };
    case "full":
      return {
        security: "full",
        ask: "off",
        autoReview: false,
      };
  }
  throw new Error(`Unsupported exec mode: ${String(mode)}`);
}
function resolveExecModePolicy(params) {
  if (!params.mode)
    return {
      mode: resolveExecModeFromPolicy({
        security: params.security,
        ask: params.ask,
      }),
      security: params.security,
      ask: params.ask,
      autoReview: false,
    };
  return {
    mode: params.mode,
    ...resolveExecPolicyForMode(params.mode),
  };
}
const DEFAULT_EXEC_APPROVAL_TIMEOUT_MS = 18e5;
const DEFAULT_SECURITY = "full";
const DEFAULT_ASK = "off";
const DEFAULT_EXEC_APPROVAL_ASK_FALLBACK = "deny";
const DEFAULT_AUTO_ALLOW_SKILLS = false;
const DEFAULT_EXEC_APPROVALS_STATE_DIR = "~/.openclaw";
const EXEC_APPROVALS_FILE = "exec-approvals.json";
const EXEC_APPROVALS_SOCKET = "exec-approvals.sock";
const EXEC_APPROVALS_LOCK_OPTIONS = {
  retries: {
    retries: 10,
    factor: 2,
    minTimeout: 25,
    maxTimeout: 500,
    randomize: true,
  },
  stale: 3e4,
  staleRecovery: "fail-closed",
};
const EXEC_APPROVALS_LOCK_QUEUE = resolveGlobalMap(Symbol.for("openclaw.execApprovalsLockQueue"));
let execApprovalsProcessStartTime;
function getExecApprovalsProcessStartTime() {
  if (execApprovalsProcessStartTime === void 0)
    execApprovalsProcessStartTime = getFileLockProcessStartTime(process.pid);
  return execApprovalsProcessStartTime;
}
const EXEC_APPROVALS_SYNC_LOCK_RETRIES = 10;
const EXEC_APPROVALS_SYNC_LOCK_RETRY_MS = 20;
function hashExecApprovalsRaw(raw) {
  return raw === null ? `missing:${sha256Hex("")}` : sha256Hex(raw);
}
function hashExecApprovalsFile(file) {
  return hashExecApprovalsRaw(`${JSON.stringify(file, null, 2)}\n`);
}
function isExecApprovalsTargetMissing(filePath) {
  try {
    fs.lstatSync(filePath);
    return false;
  } catch (err) {
    if (err.code === "ENOENT") return true;
    throw err;
  }
}
function isExecApprovalsLockMissing(filePath) {
  try {
    const dir = fs.realpathSync(path.dirname(filePath));
    return isExecApprovalsTargetMissing(`${path.join(dir, path.basename(filePath))}.lock`);
  } catch (err) {
    if (err.code === "ENOENT") return true;
    throw err;
  }
}
function resolveExecApprovalsStateDir(env = process.env) {
  const override = env.OPENCLAW_STATE_DIR?.trim();
  if (override) {
    const resolved = resolveHomeRelativePath(override, { env });
    return {
      path: resolved,
      displayPath: resolved,
    };
  }
  return {
    path: expandHomePrefix(DEFAULT_EXEC_APPROVALS_STATE_DIR, { env }),
    displayPath: DEFAULT_EXEC_APPROVALS_STATE_DIR,
  };
}
function resolveExecApprovalsPath() {
  return path.join(resolveExecApprovalsStateDir().path, EXEC_APPROVALS_FILE);
}
function resolveExecApprovalsSocketPath() {
  return path.join(resolveExecApprovalsStateDir().path, EXEC_APPROVALS_SOCKET);
}
function resolveExecApprovalsDisplayPath() {
  const stateDir = resolveExecApprovalsStateDir().displayPath;
  return stateDir === DEFAULT_EXEC_APPROVALS_STATE_DIR
    ? `${stateDir}/${EXEC_APPROVALS_FILE}`
    : path.join(stateDir, EXEC_APPROVALS_FILE);
}
function resolveExecApprovalsTranscriptPath() {
  return process.env.OPENCLAW_STATE_DIR?.trim()
    ? `$OPENCLAW_STATE_DIR/${EXEC_APPROVALS_FILE}`
    : `${DEFAULT_EXEC_APPROVALS_STATE_DIR}/${EXEC_APPROVALS_FILE}`;
}
function resolveLegacyExecApprovalsPath() {
  return path.join(expandHomePrefix(DEFAULT_EXEC_APPROVALS_STATE_DIR), EXEC_APPROVALS_FILE);
}
function hasUnmigratedLegacyExecApprovals(filePath) {
  if (!process.env.OPENCLAW_STATE_DIR?.trim() || isNamedProfile()) return false;
  const legacyPath = resolveLegacyExecApprovalsPath();
  return (
    path.resolve(legacyPath) !== path.resolve(filePath) &&
    !fs.existsSync(filePath) &&
    fs.existsSync(legacyPath)
  );
}
function createUnmigratedLegacyExecApprovalsFallback() {
  return normalizeExecApprovals({
    version: 1,
    defaults: {
      security: "deny",
      ask: "always",
      askFallback: "deny",
    },
    agents: {},
  });
}
function createFailClosedExecApprovalsFallback() {
  return normalizeExecApprovals({
    version: 1,
    defaults: {
      security: "deny",
      ask: "off",
      askFallback: "deny",
      autoAllowSkills: false,
    },
    agents: {},
  });
}
function hasValidExecApprovalPolicyFields(value) {
  if (!isPlainObject(value)) return false;
  return (
    (value.security === void 0 || isExecSecurity(value.security)) &&
    (value.ask === void 0 || isExecAsk(value.ask)) &&
    (value.askFallback === void 0 || isExecSecurity(value.askFallback)) &&
    (value.autoAllowSkills === void 0 || typeof value.autoAllowSkills === "boolean")
  );
}
function isValidPersistedExecAllowlistEntry(value) {
  if (typeof value === "string") return value.trim().length > 0;
  if (!isPlainObject(value) || typeof value.pattern !== "string" || !value.pattern.trim())
    return false;
  return (
    (value.id === void 0 || typeof value.id === "string") &&
    (value.source === void 0 || typeof value.source === "string") &&
    (value.commandText === void 0 || typeof value.commandText === "string") &&
    (value.argPattern === void 0 || typeof value.argPattern === "string") &&
    (value.lastUsedAt === void 0 ||
      (typeof value.lastUsedAt === "number" && Number.isFinite(value.lastUsedAt))) &&
    (value.lastUsedCommand === void 0 || typeof value.lastUsedCommand === "string") &&
    (value.lastResolvedPath === void 0 || typeof value.lastResolvedPath === "string")
  );
}
function isValidPersistedExecApprovals(value) {
  if (!isPlainObject(value) || value.version !== 1) return false;
  if (value.socket !== void 0) {
    if (
      !isPlainObject(value.socket) ||
      (value.socket.path !== void 0 && typeof value.socket.path !== "string") ||
      (value.socket.token !== void 0 && typeof value.socket.token !== "string")
    )
      return false;
  }
  if (value.defaults !== void 0 && !hasValidExecApprovalPolicyFields(value.defaults)) return false;
  if (value.agents !== void 0) {
    if (!isPlainObject(value.agents)) return false;
    for (const agent of Object.values(value.agents))
      if (
        !hasValidExecApprovalPolicyFields(agent) ||
        (agent.allowlist !== void 0 &&
          (!Array.isArray(agent.allowlist) ||
            !agent.allowlist.every(isValidPersistedExecAllowlistEntry)))
      )
        return false;
  }
  return true;
}
function parsePersistedExecApprovals(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (isValidPersistedExecApprovals(parsed)) return normalizeExecApprovals(parsed);
  } catch {}
  return createFailClosedExecApprovalsFallback();
}
function normalizeAllowlistPattern(value) {
  const trimmed = normalizeOptionalString(value) ?? "";
  return trimmed ? normalizeLowercaseStringOrEmpty(trimmed) : null;
}
function mergeLegacyAgent(current, legacy) {
  const allowlist = [];
  const seen = /* @__PURE__ */ new Set();
  const pushEntry = (entry) => {
    const patternKey = normalizeAllowlistPattern(entry.pattern);
    if (!patternKey) return;
    const key = `${patternKey}\x00${entry.argPattern?.trim() ?? ""}`;
    if (seen.has(key)) return;
    seen.add(key);
    allowlist.push(entry);
  };
  for (const entry of current.allowlist ?? []) pushEntry(entry);
  for (const entry of legacy.allowlist ?? []) pushEntry(entry);
  return {
    security: current.security ?? legacy.security,
    ask: current.ask ?? legacy.ask,
    askFallback: current.askFallback ?? legacy.askFallback,
    autoAllowSkills: current.autoAllowSkills ?? legacy.autoAllowSkills,
    allowlist: allowlist.length > 0 ? allowlist : void 0,
  };
}
function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  assertNoExecApprovalsSymlinkParents(dir, resolveRequiredHomeDir());
  fs.mkdirSync(dir, { recursive: true });
  const dirStat = fs.lstatSync(dir);
  if (!dirStat.isDirectory() || dirStat.isSymbolicLink())
    throw new Error(`Refusing to use unsafe exec approvals directory: ${dir}`);
  try {
    fs.chmodSync(dir, 448);
  } catch (err) {
    if (process.platform !== "win32") throw err;
  }
  return dir;
}
function resolveCanonicalExecApprovalsTarget(filePath) {
  const dir = ensureDir(filePath);
  return path.join(fs.realpathSync(dir), path.basename(filePath));
}
function assertNoExecApprovalsSymlinkParents(targetPath, trustedRoot) {
  try {
    assertNoSymlinkParentsSync({
      rootDir: trustedRoot,
      targetPath,
      allowOutsideRoot: true,
      messagePrefix: "Refusing to traverse symlink in exec approvals path",
    });
  } catch (err) {
    throw new UnsafeExecApprovalsPathError(err instanceof Error ? err.message : String(err), {
      cause: err,
    });
  }
}
var UnsafeExecApprovalsPathError = class extends Error {};
function assertSafeExecApprovalsStat(filePath, stat) {
  if (stat.isSymbolicLink())
    throw new UnsafeExecApprovalsPathError(
      `Refusing to write exec approvals via symlink: ${filePath}`,
    );
  if (!stat.isFile())
    throw new UnsafeExecApprovalsPathError(
      `Refusing to use non-file exec approvals path: ${filePath}`,
    );
}
function assertSafeExecApprovalsDestination(filePath) {
  try {
    assertSafeExecApprovalsStat(filePath, fs.lstatSync(filePath));
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
}
function assertSafeExecApprovalsOverwriteFallback(filePath) {
  assertSafeExecApprovalsDestination(filePath);
  try {
    if (fs.statSync(filePath).nlink > 1)
      throw new Error(`Refusing copy fallback for hard-linked exec approvals file: ${filePath}`);
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
}
function sameFilesystemEntry(left, right) {
  return left.dev === right.dev && left.ino === right.ino;
}
function readExecApprovalsRawState(filePath) {
  assertNoExecApprovalsSymlinkParents(path.dirname(filePath), resolveRequiredHomeDir());
  let before;
  try {
    before = fs.lstatSync(filePath);
  } catch (err) {
    if (err.code === "ENOENT")
      return {
        exists: false,
        raw: null,
      };
    throw err;
  }
  assertSafeExecApprovalsStat(filePath, before);
  const noFollowFlag = fs.constants.O_NOFOLLOW ?? 0;
  let fd;
  try {
    fd = fs.openSync(filePath, fs.constants.O_RDONLY | noFollowFlag);
  } catch (err) {
    const code = err.code;
    if (code === "ENOENT")
      throw new UnsafeExecApprovalsPathError(
        `Refusing to read changed exec approvals path: ${filePath}`,
        { cause: err },
      );
    if (code === "ELOOP")
      throw new UnsafeExecApprovalsPathError(
        `Refusing to write exec approvals via symlink: ${filePath}`,
        { cause: err },
      );
    throw err;
  }
  try {
    const opened = fs.fstatSync(fd);
    if (!opened.isFile() || !sameFilesystemEntry(before, opened))
      throw new UnsafeExecApprovalsPathError(
        `Refusing to read changed exec approvals path: ${filePath}`,
      );
    const raw = fs.readFileSync(fd, "utf8");
    let after;
    try {
      after = fs.lstatSync(filePath);
    } catch (err) {
      throw new UnsafeExecApprovalsPathError(
        `Refusing to read changed exec approvals path: ${filePath}`,
        { cause: err },
      );
    }
    assertSafeExecApprovalsStat(filePath, after);
    if (!sameFilesystemEntry(opened, after))
      throw new UnsafeExecApprovalsPathError(
        `Refusing to read changed exec approvals path: ${filePath}`,
      );
    return {
      exists: true,
      raw,
    };
  } finally {
    fs.closeSync(fd);
  }
}
function readExecApprovalsSnapshotFromPath(filePath) {
  const state = readExecApprovalsRawState(filePath);
  if (!state.exists)
    return {
      path: filePath,
      exists: false,
      raw: null,
      file: normalizeExecApprovals({
        version: 1,
        agents: {},
      }),
      hash: hashExecApprovalsRaw(null),
    };
  return {
    path: filePath,
    exists: true,
    raw: state.raw,
    file: parsePersistedExecApprovals(state.raw),
    hash: hashExecApprovalsRaw(state.raw),
  };
}
function readExecApprovalsFallbackSnapshotFromFd(fd) {
  const chunks = [];
  const buffer = Buffer.alloc(64 * 1024);
  let position = 0;
  while (true) {
    const bytesRead = fs.readSync(fd, buffer, 0, buffer.length, position);
    if (bytesRead === 0) break;
    chunks.push(Buffer.from(buffer.subarray(0, bytesRead)));
    position += bytesRead;
  }
  return Buffer.concat(chunks);
}
function validateExecApprovalsFallbackFd(filePath, fd) {
  if (fs.lstatSync(filePath).isSymbolicLink())
    throw new Error(`Refusing to write exec approvals via symlink: ${filePath}`);
  const pathStat = fs.statSync(filePath);
  const fdStat = fs.fstatSync(fd);
  if (!fdStat.isFile())
    throw new Error(`Refusing copy fallback for non-file exec approvals path: ${filePath}`);
  if (fdStat.nlink > 1)
    throw new Error(`Refusing copy fallback for hard-linked exec approvals file: ${filePath}`);
  if (!sameFilesystemEntry(pathStat, fdStat))
    throw new Error(`Refusing copy fallback after exec approvals path changed: ${filePath}`);
  return fdStat;
}
function openExistingExecApprovalsFallbackDestination(filePath) {
  const noFollowFlag = fs.constants.O_NOFOLLOW ?? 0;
  const fd = fs.openSync(filePath, fs.constants.O_RDWR | noFollowFlag, 384);
  try {
    validateExecApprovalsFallbackFd(filePath, fd);
    return {
      existed: true,
      fd,
      snapshot: readExecApprovalsFallbackSnapshotFromFd(fd),
    };
  } catch (err) {
    try {
      fs.closeSync(fd);
    } catch {}
    throw err;
  }
}
function createExecApprovalsFallbackDestination(filePath) {
  const noFollowFlag = fs.constants.O_NOFOLLOW ?? 0;
  try {
    const fd = fs.openSync(
      filePath,
      fs.constants.O_RDWR | fs.constants.O_CREAT | fs.constants.O_EXCL | noFollowFlag,
      384,
    );
    try {
      validateExecApprovalsFallbackFd(filePath, fd);
      return {
        existed: false,
        fd,
        snapshot: null,
      };
    } catch (err) {
      try {
        fs.closeSync(fd);
      } catch {}
      throw err;
    }
  } catch (err) {
    if (err.code === "EEXIST") return openExistingExecApprovalsFallbackDestination(filePath);
    throw err;
  }
}
function openExecApprovalsFallbackDestination(filePath) {
  try {
    return openExistingExecApprovalsFallbackDestination(filePath);
  } catch (err) {
    if (err.code === "ENOENT") return createExecApprovalsFallbackDestination(filePath);
    throw err;
  }
}
function writeExecApprovalsFallbackBuffer(fd, contents) {
  fs.ftruncateSync(fd, 0);
  let written = 0;
  while (written < contents.length)
    written += fs.writeSync(fd, contents, written, contents.length - written, written);
  fs.ftruncateSync(fd, contents.length);
  try {
    fs.fchmodSync(fd, 384);
  } catch {}
}
function restoreExecApprovalsFallbackDestination(filePath, destination) {
  if (!destination.existed) {
    try {
      if (sameFilesystemEntry(fs.statSync(filePath), fs.fstatSync(destination.fd)))
        fs.rmSync(filePath, { force: true });
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
    }
    return;
  }
  writeExecApprovalsFallbackBuffer(destination.fd, destination.snapshot ?? Buffer.alloc(0));
}
function copyExecApprovalsFallback(tempPath, filePath) {
  const contents = fs.readFileSync(tempPath);
  const destination = openExecApprovalsFallbackDestination(filePath);
  try {
    writeExecApprovalsFallbackBuffer(destination.fd, contents);
    validateExecApprovalsFallbackFd(filePath, destination.fd);
  } catch (copyErr) {
    try {
      restoreExecApprovalsFallbackDestination(filePath, destination);
    } catch (restoreErr) {
      throw new Error(
        `Failed to restore exec approvals after copy fallback failure for ${filePath}: ${String(copyErr)}`,
        { cause: restoreErr },
      );
    }
    throw copyErr;
  } finally {
    fs.closeSync(destination.fd);
  }
}
function renameExecApprovalsWithFallback(tempPath, filePath) {
  try {
    fs.renameSync(tempPath, filePath);
  } catch (err) {
    const code = err.code;
    if (code !== "EPERM" && code !== "EEXIST") throw err;
    assertSafeExecApprovalsOverwriteFallback(filePath);
    copyExecApprovalsFallback(tempPath, filePath);
    fs.rmSync(tempPath, { force: true });
  }
}
function coerceAllowlistEntries(allowlist) {
  if (!Array.isArray(allowlist) || allowlist.length === 0)
    return Array.isArray(allowlist) ? allowlist : void 0;
  let changed = false;
  const result = [];
  for (const item of allowlist)
    if (typeof item === "string") {
      const trimmed = item.trim();
      if (trimmed) {
        result.push({ pattern: trimmed });
        changed = true;
      } else changed = true;
    } else if (item && typeof item === "object" && !Array.isArray(item)) {
      const pattern = item.pattern;
      if (typeof pattern === "string" && pattern.trim().length > 0) result.push(item);
      else changed = true;
    } else changed = true;
  return changed ? (result.length > 0 ? result : void 0) : allowlist;
}
function ensureAllowlistIds(allowlist) {
  if (!Array.isArray(allowlist) || allowlist.length === 0) return allowlist;
  let changed = false;
  const next = allowlist.map((entry) => {
    if (entry.id) return entry;
    changed = true;
    return {
      ...entry,
      id: crypto.randomUUID(),
    };
  });
  return changed ? next : allowlist;
}
function stripAllowlistCommandText(allowlist) {
  if (!Array.isArray(allowlist) || allowlist.length === 0) return allowlist;
  let changed = false;
  const next = allowlist.map((entry) => {
    if (typeof entry.commandText !== "string") return entry;
    changed = true;
    const { commandText: _commandText, ...rest } = entry;
    return rest;
  });
  return changed ? next : allowlist;
}
function sanitizeExecApprovalPolicy(policy) {
  const security = toStringOrUndefined(policy?.security)?.trim();
  const ask = toStringOrUndefined(policy?.ask)?.trim();
  const askFallback = toStringOrUndefined(policy?.askFallback)?.trim();
  return {
    security:
      security === "deny" || security === "allowlist" || security === "full" ? security : void 0,
    ask: ask === "off" || ask === "on-miss" || ask === "always" ? ask : void 0,
    askFallback:
      askFallback === "deny" || askFallback === "allowlist" || askFallback === "full"
        ? askFallback
        : void 0,
    autoAllowSkills: policy?.autoAllowSkills,
  };
}
function normalizeExecApprovals(file) {
  const socketPath = file.socket?.path?.trim();
  const token = file.socket?.token?.trim();
  const agents = { ...file.agents };
  const legacyDefault = agents.default;
  if (legacyDefault) {
    const main = agents[DEFAULT_AGENT_ID];
    agents[DEFAULT_AGENT_ID] = main ? mergeLegacyAgent(main, legacyDefault) : legacyDefault;
    delete agents.default;
  }
  for (const [key, agent] of Object.entries(agents)) {
    const allowlist = stripAllowlistCommandText(
      ensureAllowlistIds(coerceAllowlistEntries(agent.allowlist)),
    );
    const sanitizedPolicy = sanitizeExecApprovalPolicy(agent);
    if (
      allowlist !== agent.allowlist ||
      sanitizedPolicy.security !== agent.security ||
      sanitizedPolicy.ask !== agent.ask ||
      sanitizedPolicy.askFallback !== agent.askFallback
    )
      agents[key] = {
        ...agent,
        allowlist,
        security: sanitizedPolicy.security,
        ask: sanitizedPolicy.ask,
        askFallback: sanitizedPolicy.askFallback,
      };
  }
  const sanitizedDefaults = sanitizeExecApprovalPolicy(file.defaults);
  return {
    version: 1,
    socket: {
      path: socketPath && socketPath.length > 0 ? socketPath : void 0,
      token: token && token.length > 0 ? token : void 0,
    },
    defaults: { ...sanitizedDefaults },
    agents,
  };
}
function mergeExecApprovalsSocketDefaults(params) {
  const currentSocketPath = params.current?.socket?.path?.trim();
  const currentToken = params.current?.socket?.token?.trim();
  const socketPath =
    params.normalized.socket?.path?.trim() ?? currentSocketPath ?? resolveExecApprovalsSocketPath();
  const token = params.normalized.socket?.token?.trim() ?? currentToken ?? generateToken();
  return {
    ...params.normalized,
    socket: {
      path: socketPath,
      token,
    },
  };
}
function generateToken() {
  return randomBytes(24).toString("base64url");
}
function readExecApprovalsSnapshotUnlocked() {
  const filePath = resolveExecApprovalsPath();
  if (hasUnmigratedLegacyExecApprovals(filePath))
    return {
      path: filePath,
      exists: false,
      raw: null,
      file: createUnmigratedLegacyExecApprovalsFallback(),
      hash: hashExecApprovalsRaw(null),
    };
  return readExecApprovalsSnapshotFromPath(filePath);
}
function readExecApprovalsSnapshot() {
  return withExecApprovalsReadLockSync(
    resolveExecApprovalsPath(),
    readExecApprovalsSnapshotUnlocked,
  );
}
function loadExecApprovalsUnlocked() {
  const filePath = resolveExecApprovalsPath();
  if (hasUnmigratedLegacyExecApprovals(filePath))
    return createUnmigratedLegacyExecApprovalsFallback();
  try {
    return readExecApprovalsSnapshotFromPath(filePath).file;
  } catch {
    return createFailClosedExecApprovalsFallback();
  }
}
function loadExecApprovals() {
  try {
    return withExecApprovalsReadLockSync(resolveExecApprovalsPath(), loadExecApprovalsUnlocked);
  } catch {
    return createFailClosedExecApprovalsFallback();
  }
}
async function loadExecApprovalsAsync() {
  try {
    return await withExecApprovalsReadLock(resolveExecApprovalsPath(), async () =>
      loadExecApprovalsUnlocked(),
    );
  } catch {
    return createFailClosedExecApprovalsFallback();
  }
}
function readLockPayload(raw) {
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
function readExecApprovalsLockState(lockPath) {
  try {
    const payload = readLockPayload(fs.readFileSync(lockPath, "utf8"));
    return {
      ownerPid:
        typeof payload?.pid === "number" && Number.isInteger(payload.pid) && payload.pid > 0
          ? payload.pid
          : null,
      definitelyStale: isLockOwnerDefinitelyStale({ payload }),
    };
  } catch {
    return {
      ownerPid: null,
      definitelyStale: false,
    };
  }
}
function sleepExecApprovalsSyncLockRetry() {
  try {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, EXEC_APPROVALS_SYNC_LOCK_RETRY_MS);
  } catch {
    const deadline = Date.now() + EXEC_APPROVALS_SYNC_LOCK_RETRY_MS;
    while (Date.now() < deadline);
  }
}
function removeOwnedExecApprovalsLock(lock, options) {
  try {
    const current = fs.lstatSync(lock.lockPath);
    if (
      current.dev === lock.device &&
      current.ino === lock.inode &&
      (!options.requirePayloadMatch || fs.readFileSync(lock.lockPath, "utf8") === lock.raw)
    )
      fs.rmSync(lock.lockPath, { force: true });
  } catch {}
}
function acquireExecApprovalsLockSync(filePath) {
  const lockPath = `${resolveCanonicalExecApprovalsTarget(filePath)}.lock`;
  const payload = {
    pid: process.pid,
    createdAt: /* @__PURE__ */ new Date().toISOString(),
    nonce: crypto.randomUUID(),
  };
  const starttime = getExecApprovalsProcessStartTime();
  if (starttime !== null) payload.starttime = starttime;
  const raw = `${JSON.stringify(payload, null, 2)}\n`;
  for (let attempt = 0; attempt <= EXEC_APPROVALS_SYNC_LOCK_RETRIES; attempt += 1) {
    let descriptor;
    try {
      descriptor = fs.openSync(lockPath, "wx", 384);
    } catch (err) {
      if (err.code !== "EEXIST") throw err;
      const state = readExecApprovalsLockState(lockPath);
      if (state.definitelyStale)
        throw Object.assign(
          /* @__PURE__ */ new Error(`Exec approvals lock has a stale owner: ${lockPath}`),
          {
            code: "file_lock_stale",
            lockPath,
          },
        );
      if (
        state.ownerPid !== null &&
        state.ownerPid !== process.pid &&
        attempt < EXEC_APPROVALS_SYNC_LOCK_RETRIES
      ) {
        sleepExecApprovalsSyncLockRetry();
        continue;
      }
      throw Object.assign(/* @__PURE__ */ new Error(`Exec approvals are locked: ${lockPath}`), {
        code: "file_lock_timeout",
        lockPath,
      });
    }
    let stat;
    try {
      stat = fs.fstatSync(descriptor);
    } catch (err) {
      fs.closeSync(descriptor);
      throw err;
    }
    const lock = {
      descriptor,
      lockPath,
      device: stat.dev,
      inode: stat.ino,
      raw,
    };
    try {
      fs.writeFileSync(descriptor, raw, "utf8");
      return lock;
    } catch (err) {
      fs.closeSync(descriptor);
      removeOwnedExecApprovalsLock(lock, { requirePayloadMatch: false });
      throw err;
    }
  }
  throw new Error(`Failed to acquire exec approvals lock: ${lockPath}`);
}
function withExecApprovalsLockSync(fn) {
  const lock = acquireExecApprovalsLockSync(resolveExecApprovalsPath());
  try {
    return fn();
  } finally {
    fs.closeSync(lock.descriptor);
    removeOwnedExecApprovalsLock(lock, { requirePayloadMatch: true });
  }
}
function withExecApprovalsReadLockSync(filePath, fn) {
  if (!isExecApprovalsTargetMissing(filePath) || !isExecApprovalsLockMissing(filePath))
    return withExecApprovalsLockSync(fn);
  const result = fn();
  return isExecApprovalsLockMissing(filePath) && isExecApprovalsTargetMissing(filePath)
    ? result
    : withExecApprovalsLockSync(fn);
}
function saveExecApprovalsUnlocked(file) {
  writeExecApprovalsRaw(resolveExecApprovalsPath(), `${JSON.stringify(file, null, 2)}\n`);
}
function updateExecApprovalsUnlocked(params) {
  if (hasUnmigratedLegacyExecApprovals(resolveExecApprovalsPath()))
    throw new Error("Exec approvals must be migrated before they can be updated");
  const current = readExecApprovalsSnapshotUnlocked();
  if (params.baseHash !== void 0 && current.hash !== params.baseHash) return null;
  const next = params.update(current.file);
  if (next === null) return current;
  if (
    current.exists &&
    current.hash === hashExecApprovalsFile(next) &&
    hardenUnchangedExecApprovals(current.path)
  )
    return current;
  saveExecApprovalsUnlocked(next);
  return readExecApprovalsSnapshotUnlocked();
}
function updateExecApprovalsSync(params) {
  return withExecApprovalsLockSync(() => updateExecApprovalsUnlocked(params));
}
function saveExecApprovals(file) {
  updateExecApprovalsSync({ update: () => file });
}
function enqueueExecApprovalsLock(filePath, fn) {
  const next = (EXEC_APPROVALS_LOCK_QUEUE.get(filePath) ?? Promise.resolve()).then(fn, fn);
  EXEC_APPROVALS_LOCK_QUEUE.set(filePath, next);
  next
    .finally(() => {
      if (EXEC_APPROVALS_LOCK_QUEUE.get(filePath) === next)
        EXEC_APPROVALS_LOCK_QUEUE.delete(filePath);
    })
    .catch(() => {});
  return next;
}
async function withExecApprovalsLock(fn) {
  const filePath = resolveCanonicalExecApprovalsTarget(resolveExecApprovalsPath());
  return await enqueueExecApprovalsLock(filePath, async () =>
    withFileLock(filePath, EXEC_APPROVALS_LOCK_OPTIONS, fn),
  );
}
async function withExecApprovalsReadLock(filePath, fn) {
  if (!isExecApprovalsTargetMissing(filePath) || !isExecApprovalsLockMissing(filePath))
    return await withExecApprovalsLock(fn);
  const result = await fn();
  return isExecApprovalsLockMissing(filePath) && isExecApprovalsTargetMissing(filePath)
    ? result
    : await withExecApprovalsLock(fn);
}
async function updateExecApprovals(params) {
  return await withExecApprovalsLock(async () => updateExecApprovalsUnlocked(params));
}
function hardenUnchangedExecApprovals(filePath) {
  ensureDir(filePath);
  assertSafeExecApprovalsDestination(filePath);
  let stat;
  try {
    stat = fs.statSync(filePath);
  } catch (err) {
    if (err.code === "ENOENT") return false;
    throw err;
  }
  if (stat.nlink > 1) return false;
  try {
    fs.chmodSync(filePath, 384);
  } catch {}
  return true;
}
function writeExecApprovalsRaw(filePath, raw) {
  const dir = ensureDir(filePath);
  assertSafeExecApprovalsDestination(filePath);
  const tempPath = path.join(dir, `.exec-approvals.${process.pid}.${crypto.randomUUID()}.tmp`);
  let tempWritten = false;
  try {
    fs.writeFileSync(tempPath, raw, {
      mode: 384,
      flag: "wx",
    });
    try {
      fs.chmodSync(tempPath, 384);
    } catch {}
    tempWritten = true;
    renameExecApprovalsWithFallback(tempPath, filePath);
  } finally {
    if (tempWritten && fs.existsSync(tempPath)) fs.rmSync(tempPath, { force: true });
  }
  try {
    fs.chmodSync(filePath, 384);
  } catch {}
}
function restoreExecApprovalsSnapshotUnlocked(snapshot) {
  if (!snapshot.exists) fs.rmSync(snapshot.path, { force: true });
  else if (snapshot.raw !== null) writeExecApprovalsRaw(snapshot.path, snapshot.raw);
  else saveExecApprovalsUnlocked(snapshot.file);
}
function restoreExecApprovalsSnapshot(snapshot) {
  withExecApprovalsLockSync(() => restoreExecApprovalsSnapshotUnlocked(snapshot));
}
async function restoreExecApprovalsSnapshotLocked(snapshot, baseHash) {
  return await withExecApprovalsLock(async () => {
    if (readExecApprovalsSnapshotUnlocked().hash !== baseHash) return false;
    restoreExecApprovalsSnapshotUnlocked(snapshot);
    return true;
  });
}
function ensureExecApprovalsSocket(file) {
  const next = normalizeExecApprovals(file);
  const socketPath = next.socket?.path?.trim();
  const token = next.socket?.token?.trim();
  return {
    ...next,
    socket: {
      path: socketPath || resolveExecApprovalsSocketPath(),
      token: token || generateToken(),
    },
  };
}
function requireInitializedExecApprovals(snapshot) {
  if (!snapshot) throw new Error("Failed to initialize exec approvals");
  return snapshot;
}
async function ensureExecApprovalsSnapshot() {
  if (hasUnmigratedLegacyExecApprovals(resolveExecApprovalsPath()))
    return readExecApprovalsSnapshot();
  return requireInitializedExecApprovals(
    await updateExecApprovals({ update: ensureExecApprovalsSocket }),
  );
}
function ensureExecApprovals() {
  if (hasUnmigratedLegacyExecApprovals(resolveExecApprovalsPath()))
    return createUnmigratedLegacyExecApprovalsFallback();
  return requireInitializedExecApprovals(
    updateExecApprovalsSync({ update: ensureExecApprovalsSocket }),
  ).file;
}
function readExecApprovalsForNoPersistenceUnlocked(filePath) {
  if (hasUnmigratedLegacyExecApprovals(filePath))
    return createUnmigratedLegacyExecApprovalsFallback();
  try {
    return readExecApprovalsSnapshotFromPath(filePath).file;
  } catch (err) {
    if (err instanceof UnsafeExecApprovalsPathError) throw err;
    return createFailClosedExecApprovalsFallback();
  }
}
function isExecSecurity(value) {
  return value === "allowlist" || value === "full" || value === "deny";
}
function isExecAsk(value) {
  return value === "always" || value === "off" || value === "on-miss";
}
function normalizeSecurity(value, fallback) {
  return isExecSecurity(value) ? value : fallback;
}
function normalizeAsk(value, fallback) {
  return isExecAsk(value) ? value : fallback;
}
function resolveDefaultSecurityField(params) {
  const defaultValue = params.defaults[params.field];
  if (isExecSecurity(defaultValue))
    return {
      value: defaultValue,
      source: `defaults.${params.field}`,
    };
  return {
    value: params.fallback,
    source: null,
  };
}
function resolveDefaultAskField(params) {
  if (isExecAsk(params.defaults.ask))
    return {
      value: params.defaults.ask,
      source: "defaults.ask",
    };
  return {
    value: params.fallback,
    source: null,
  };
}
function resolveAgentSecurityField(params) {
  const fallbackField = resolveDefaultSecurityField({
    field: params.field,
    defaults: params.defaults,
    fallback: params.fallback,
  });
  if (params.rawAgent[params.field] != null) {
    if (isExecSecurity(params.agent[params.field]))
      return {
        value: params.agent[params.field],
        source: `agents.${params.agentKey}.${params.field}`,
      };
    return fallbackField;
  }
  if (params.rawWildcard[params.field] != null) {
    if (isExecSecurity(params.wildcard[params.field]))
      return {
        value: params.wildcard[params.field],
        source: `agents.*.${params.field}`,
      };
    return fallbackField;
  }
  return fallbackField;
}
function resolveAgentAskField(params) {
  const fallbackField = resolveDefaultAskField({
    defaults: params.defaults,
    fallback: params.fallback,
  });
  if (params.rawAgent.ask != null) {
    if (isExecAsk(params.agent.ask))
      return {
        value: params.agent.ask,
        source: `agents.${params.agentKey}.ask`,
      };
    return fallbackField;
  }
  if (params.rawWildcard.ask != null) {
    if (isExecAsk(params.wildcard.ask))
      return {
        value: params.wildcard.ask,
        source: "agents.*.ask",
      };
    return fallbackField;
  }
  return fallbackField;
}
function shapeResolvedExecApprovals(params) {
  const defaultSocketPath = resolveExecApprovalsSocketPath();
  return resolveExecApprovalsFromFile({
    file: params.file,
    agentId: params.agentId,
    overrides: params.overrides,
    path: params.filePath,
    socketPath:
      params.socket === "persisted"
        ? expandHomePrefix(params.file.socket?.path ?? defaultSocketPath)
        : defaultSocketPath,
    token: params.socket === "persisted" ? (params.file.socket?.token ?? "") : "",
  });
}
function resolveExecApprovalsWithoutSocket(params) {
  const resolved = shapeResolvedExecApprovals({
    ...params,
    socket: "none",
  });
  return (resolved.agent.security === "full" || resolved.agent.security === "deny") &&
    resolved.agent.ask === "off" &&
    !params.file.socket?.token?.trim()
    ? resolved
    : null;
}
function resolveExecApprovals(agentId, overrides) {
  const filePath = resolveExecApprovalsPath();
  if (hasUnmigratedLegacyExecApprovals(filePath))
    return shapeResolvedExecApprovals({
      file: createUnmigratedLegacyExecApprovalsFallback(),
      filePath,
      agentId,
      overrides,
      socket: "none",
    });
  if (!overrides?.requireSocket) {
    const resolved = resolveExecApprovalsWithoutSocket({
      file: withExecApprovalsReadLockSync(filePath, () =>
        readExecApprovalsForNoPersistenceUnlocked(filePath),
      ),
      filePath,
      agentId,
      overrides,
    });
    if (resolved) return resolved;
  }
  return shapeResolvedExecApprovals({
    file: ensureExecApprovals(),
    filePath,
    agentId,
    overrides,
    socket: "persisted",
  });
}
async function resolveExecApprovalsLocked(agentId, overrides) {
  const filePath = resolveExecApprovalsPath();
  if (hasUnmigratedLegacyExecApprovals(filePath))
    return shapeResolvedExecApprovals({
      file: createUnmigratedLegacyExecApprovalsFallback(),
      filePath,
      agentId,
      overrides,
      socket: "none",
    });
  if (!overrides?.requireSocket) {
    const resolved = resolveExecApprovalsWithoutSocket({
      file: await withExecApprovalsReadLock(filePath, async () =>
        readExecApprovalsForNoPersistenceUnlocked(filePath),
      ),
      filePath,
      agentId,
      overrides,
    });
    if (resolved) return resolved;
  }
  return shapeResolvedExecApprovals({
    file: (await ensureExecApprovalsSnapshot()).file,
    filePath: resolveExecApprovalsPath(),
    agentId,
    overrides,
    socket: "persisted",
  });
}
function resolveExecApprovalsFromFile(params) {
  const rawFile = params.file;
  const file = normalizeExecApprovals(params.file);
  const defaults = file.defaults ?? {};
  const agentKey = params.agentId ?? "main";
  const agent = file.agents?.[agentKey] ?? {};
  const wildcard = file.agents?.["*"] ?? {};
  const rawAgent = rawFile.agents?.[agentKey] ?? {};
  const rawWildcard = rawFile.agents?.["*"] ?? {};
  const fallbackSecurity = params.overrides?.security ?? DEFAULT_SECURITY;
  const fallbackAsk = params.overrides?.ask ?? DEFAULT_ASK;
  const fallbackAskFallback = params.overrides?.askFallback ?? "deny";
  const fallbackAutoAllowSkills = params.overrides?.autoAllowSkills ?? DEFAULT_AUTO_ALLOW_SKILLS;
  const resolvedDefaults = {
    security: normalizeSecurity(defaults.security, fallbackSecurity),
    ask: normalizeAsk(defaults.ask, fallbackAsk),
    askFallback: normalizeSecurity(
      defaults.askFallback ?? fallbackAskFallback,
      fallbackAskFallback,
    ),
    autoAllowSkills: defaults.autoAllowSkills ?? fallbackAutoAllowSkills,
  };
  const resolvedAgentSecurity = resolveAgentSecurityField({
    field: "security",
    defaults,
    agent,
    rawAgent,
    wildcard,
    rawWildcard,
    agentKey,
    fallback: resolvedDefaults.security,
  });
  const resolvedAgentAsk = resolveAgentAskField({
    defaults,
    agent,
    rawAgent,
    wildcard,
    rawWildcard,
    agentKey,
    fallback: resolvedDefaults.ask,
  });
  const resolvedAgentAskFallback = resolveAgentSecurityField({
    field: "askFallback",
    defaults,
    agent,
    rawAgent,
    wildcard,
    rawWildcard,
    agentKey,
    fallback: resolvedDefaults.askFallback,
  });
  const resolvedAgent = {
    security: resolvedAgentSecurity.value,
    ask: resolvedAgentAsk.value,
    askFallback: resolvedAgentAskFallback.value,
    autoAllowSkills:
      agent.autoAllowSkills ?? wildcard.autoAllowSkills ?? resolvedDefaults.autoAllowSkills,
  };
  const allowlist = [
    ...(Array.isArray(wildcard.allowlist) ? wildcard.allowlist : []),
    ...(Array.isArray(agent.allowlist) ? agent.allowlist : []),
  ];
  return {
    path: params.path ?? resolveExecApprovalsPath(),
    socketPath: expandHomePrefix(
      params.socketPath ?? file.socket?.path ?? resolveExecApprovalsSocketPath(),
    ),
    token: params.token ?? file.socket?.token ?? "",
    defaults: resolvedDefaults,
    agent: resolvedAgent,
    agentSources: {
      security: resolvedAgentSecurity.source,
      ask: resolvedAgentAsk.source,
      askFallback: resolvedAgentAskFallback.source,
    },
    allowlist,
    file,
  };
}
function requiresExecApproval(params) {
  if (params.ask === "always") return true;
  if (params.durableApprovalSatisfied === true) return false;
  return (
    params.ask === "on-miss" &&
    params.security === "allowlist" &&
    (!params.analysisOk || !params.allowlistSatisfied)
  );
}
function normalizeCommandName(value) {
  return (value ?? "").split(/[\\/]/).pop()?.toLowerCase() ?? "";
}
function textMentionsSecurityAuditSuppressions(value) {
  const normalized = value.toLowerCase();
  return (
    normalized.includes("security.audit.suppressions") ||
    /["']?security["']?[\s\S]{0,200}["']?audit["']?[\s\S]{0,200}["']?suppressions["']?/.test(
      normalized,
    )
  );
}
function isReadOnlySecurityAuditSuppressionInspection(argv) {
  let offset = normalizeCommandName(argv[0]) === "pnpm" && argv[1] === "openclaw" ? 1 : 0;
  if (normalizeCommandName(argv[offset]) !== "openclaw") return false;
  offset += 1;
  while (offset < argv.length) {
    const arg = argv[offset];
    if (["--dev", "--no-color"].includes(arg ?? "")) {
      offset += 1;
      continue;
    }
    if (["--profile", "--container", "--log-level"].includes(arg ?? "")) {
      offset += 2;
      continue;
    }
    if (
      arg?.startsWith("--profile=") ||
      arg?.startsWith("--container=") ||
      arg?.startsWith("--log-level=")
    ) {
      offset += 1;
      continue;
    }
    break;
  }
  return (
    argv[offset] === "config" && ["get", "schema", "validate"].includes(argv[offset + 1] ?? "")
  );
}
function removeParsedSegmentText(command, segments) {
  let remaining = command;
  for (const segment of segments) {
    const raw = (segment.raw ?? segment.argv?.join(" "))?.trim();
    if (!raw) continue;
    remaining = remaining.replace(raw, " ");
  }
  return remaining;
}
function commandRequiresSecurityAuditSuppressionApproval(params) {
  let sawSegmentMention = false;
  for (const segment of params.segments) {
    if (!textMentionsSecurityAuditSuppressions(`${segment.raw ?? ""} ${segment.argv.join(" ")}`))
      continue;
    sawSegmentMention = true;
    if (!isReadOnlySecurityAuditSuppressionInspection(segment.argv)) return true;
  }
  if (sawSegmentMention) {
    if (
      textMentionsSecurityAuditSuppressions(
        removeParsedSegmentText(params.command, params.segments),
      )
    )
      return true;
    return false;
  }
  return textMentionsSecurityAuditSuppressions(params.command);
}
function hasDurableExecApproval(params) {
  return (
    hasExactCommandDurableExecApproval({
      allowlist: params.allowlist,
      commandText: params.commandText,
    }) ||
    hasSegmentDurableExecApproval({
      analysisOk: params.analysisOk,
      segmentAllowlistEntries: params.segmentAllowlistEntries,
    })
  );
}
function buildDurableCommandApprovalPattern(commandText) {
  return `=command:${sha256HexPrefix(commandText, 16)}`;
}
function buildNodeCommandApprovalPattern(commandText) {
  return `=node-command:${sha256HexPrefix(commandText, 16)}`;
}
function hasNodeCommandAllowAlwaysMarker(params) {
  const normalizedCommand = params.commandText?.trim();
  if (!normalizedCommand) return false;
  const commandPattern = buildNodeCommandApprovalPattern(normalizedCommand);
  return (params.allowlist ?? []).some(
    (entry) => entry.source === "allow-always" && entry.pattern === commandPattern,
  );
}
function hasExactCommandDurableExecApproval(params) {
  const normalizedCommand = params.commandText?.trim();
  if (!normalizedCommand) return false;
  const commandPattern = buildDurableCommandApprovalPattern(normalizedCommand);
  return (params.allowlist ?? []).some(
    (entry) =>
      entry.source === "allow-always" &&
      (entry.pattern === commandPattern ||
        (typeof entry.commandText === "string" && entry.commandText.trim() === normalizedCommand)),
  );
}
/** Callers pass whether their final, post-gate authorization depends on a durable grant. */
function resolveDurableExecApprovalRequirement(params) {
  if (!params.durableApprovalRequired) return null;
  return hasExactCommandDurableExecApproval({
    allowlist: params.allowlist,
    commandText: params.commandText,
  })
    ? "exact-command"
    : "segment-allowlist";
}
function hasSegmentDurableExecApproval(params) {
  return (
    params.analysisOk &&
    params.segmentAllowlistEntries.length > 0 &&
    params.segmentAllowlistEntries.every((entry) => entry?.source === "allow-always")
  );
}
function buildAllowlistEntryMatchKey(entry) {
  return JSON.stringify([entry.pattern, entry.argPattern ?? null]);
}
function buildExecApprovalPolicyRuleKey(entry) {
  return JSON.stringify([entry.pattern, entry.argPattern ?? null, entry.source ?? null]);
}
function buildAllowAlwaysUpgradeRuleKey(rule) {
  if (rule.source !== void 0) return null;
  return buildExecApprovalPolicyRuleKey({
    ...rule,
    source: "allow-always",
  });
}
/** Captures effective file policy while excluding ids and mutable usage metadata. */
function createExecApprovalPolicySnapshot(params) {
  const resolved = resolveExecApprovalsFromFile({
    file: params.file,
    agentId: params.agentId,
  });
  const allowlistRulesByKey = new Map(
    resolved.allowlist.map((entry) => {
      const rule = {
        pattern: entry.pattern,
        ...(entry.argPattern !== void 0 ? { argPattern: entry.argPattern } : {}),
        ...(entry.source === "allow-always" ? { source: entry.source } : {}),
      };
      return [buildExecApprovalPolicyRuleKey(rule), rule];
    }),
  );
  return {
    security: resolved.agent.security,
    ask: resolved.agent.ask,
    askFallback: resolved.agent.askFallback,
    autoAllowSkills: resolved.agent.autoAllowSkills,
    allowlistRules: canonicalizeExecApprovalPolicyRules([...allowlistRulesByKey.values()]),
  };
}
function isExecApprovalPolicySnapshotCurrent(expected, current) {
  const currentRuleKeys = new Set(current.allowlistRules.map(buildExecApprovalPolicyRuleKey));
  return (
    expected.security === current.security &&
    expected.ask === current.ask &&
    expected.askFallback === current.askFallback &&
    expected.autoAllowSkills === current.autoAllowSkills &&
    expected.allowlistRules.every((rule) => {
      const key = buildExecApprovalPolicyRuleKey(rule);
      if (currentRuleKeys.has(key)) return true;
      const upgradedKey = buildAllowAlwaysUpgradeRuleKey(rule);
      return upgradedKey !== null && currentRuleKeys.has(upgradedKey);
    })
  );
}
function assertCurrentUsageAuthorization(params) {
  const current = resolveExecApprovalsFromFile({
    file: params.file,
    agentId: params.agentId,
    overrides: {
      security: params.authorization.security,
      ask: params.authorization.ask,
    },
  });
  const security = minSecurity(params.authorization.security, current.agent.security);
  const ask = maxAsk(params.authorization.ask, current.agent.ask);
  if (security === "deny") throw new Error("Exec approval changed before execution");
  if (
    params.authorization.source === "explicit-approval" ||
    params.authorization.source === "auto-review"
  ) {
    const expectedPolicy = params.authorization.policySnapshot;
    if (
      !expectedPolicy ||
      !isExecApprovalPolicySnapshotCurrent(
        expectedPolicy,
        createExecApprovalPolicySnapshot({
          file: params.file,
          agentId: params.agentId,
        }),
      )
    )
      throw new Error("Exec approval changed before execution");
  }
  if (params.authorization.source === "explicit-approval") return;
  if (params.authorization.source === "auto-review") {
    if (ask === "always") throw new Error("Exec approval changed before execution");
    return;
  }
  let authorizationSecurity = security;
  if (params.authorization.source === "ask-fallback") {
    const askFallback = minSecurity(security, current.agent.askFallback);
    if (askFallback === "deny" || askFallback !== params.authorization.security)
      throw new Error("Exec approval changed before execution");
    if (askFallback === "full") return;
    authorizationSecurity = askFallback;
  } else if (security !== params.authorization.security || ask !== params.authorization.ask)
    throw new Error("Exec approval changed before execution");
  if (authorizationSecurity !== "allowlist") return;
  if (params.authorization.requireExactCommandApproval) {
    if (
      !hasExactCommandDurableExecApproval({
        allowlist: current.allowlist,
        commandText: params.command,
      })
    )
      throw new Error("Exec approval changed before execution");
    return;
  }
  if (params.authorization.requireDurableAllowlistApproval) {
    const durableKeys = new Set(
      current.allowlist
        .filter((entry) => entry.source === "allow-always")
        .map(buildAllowlistEntryMatchKey),
    );
    if (params.matchKeys.size === 0 || [...params.matchKeys].some((key) => !durableKeys.has(key)))
      throw new Error("Exec approval changed before execution");
  }
  if (!params.authorization.allowlistSatisfied)
    throw new Error("Exec approval changed before execution");
  const currentKeys = new Set(current.allowlist.map(buildAllowlistEntryMatchKey));
  if ([...params.matchKeys].some((key) => !currentKeys.has(key)))
    throw new Error("Exec approval changed before execution");
  if (params.authorization.requireAutoAllowSkills && !current.agent.autoAllowSkills)
    throw new Error("Exec approval changed before execution");
}
function replaceExecApprovalsSnapshot(target, source) {
  target.version = source.version;
  if (source.socket === void 0) delete target.socket;
  else target.socket = source.socket;
  if (source.defaults === void 0) delete target.defaults;
  else target.defaults = source.defaults;
  if (source.agents === void 0) delete target.agents;
  else target.agents = source.agents;
}
function recordAllowlistUse(approvals, agentId, entry, command, resolvedPath) {
  recordAllowlistMatchesUse({
    approvals,
    agentId,
    matches: [entry],
    command,
    resolvedPath,
  });
}
function recordAllowlistMatchesUse(params) {
  if (params.matches.length === 0 && !params.authorization) return;
  const snapshot = updateExecApprovalsSync({
    update: (file) =>
      applyRecordedAllowlistUse({
        ...params,
        file,
      }),
  });
  if (snapshot) replaceExecApprovalsSnapshot(params.approvals, snapshot.file);
}
function applyRecordedAllowlistUse(params) {
  const keys = new Set(
    params.matches.filter((entry) => entry.pattern).map(buildAllowlistEntryMatchKey),
  );
  if (params.authorization)
    assertCurrentUsageAuthorization({
      file: params.file,
      agentId: params.agentId,
      command: params.command,
      matchKeys: keys,
      authorization: params.authorization,
    });
  return applyRecordedAllowlistMetadata(params);
}
function applyRecordedAllowlistMetadata(params) {
  const keys = new Set(
    params.matches.filter((entry) => entry.pattern).map(buildAllowlistEntryMatchKey),
  );
  if (keys.size === 0) return null;
  const target = params.agentId ?? "main";
  const agents = params.file.agents ?? {};
  let changed = false;
  const nextAgents = { ...agents };
  for (const key of target === "*" ? [target] : ["*", target]) {
    const existing = agents[key];
    if (!existing?.allowlist) continue;
    let entryChanged = false;
    const nextAllowlist = existing.allowlist.map((entry) => {
      if (!keys.has(buildAllowlistEntryMatchKey(entry))) return entry;
      changed = true;
      entryChanged = true;
      return Object.assign({}, entry, {
        id: entry.id ?? crypto.randomUUID(),
        lastUsedAt: Date.now(),
        lastUsedCommand: params.command,
        lastResolvedPath: params.resolvedPath,
      });
    });
    if (entryChanged)
      nextAgents[key] = {
        ...existing,
        allowlist: nextAllowlist,
      };
  }
  return changed
    ? {
        ...params.file,
        agents: nextAgents,
      }
    : null;
}
async function commitExecAuthorizationLocked(params) {
  if (
    (params.authorization.source === "explicit-approval" ||
      params.authorization.source === "auto-review") &&
    !params.authorization.policySnapshot
  )
    throw new Error("Delayed exec authorization requires a policy snapshot");
  if (params.allowAlwaysDecision && params.allowAlwaysDecision.kind !== "one-shot") {
    if (params.authorization.source !== "explicit-approval")
      throw new Error("Allow-always persistence requires explicit approval");
  }
  await updateExecApprovals({
    update: (file) => {
      const matchKeys = new Set(
        params.matches.filter((entry) => entry.pattern).map(buildAllowlistEntryMatchKey),
      );
      assertCurrentUsageAuthorization({
        file,
        agentId: params.agentId,
        command: params.command,
        matchKeys,
        authorization: params.authorization,
      });
      let next = file;
      let changed = false;
      if (params.allowAlwaysDecision && params.allowAlwaysDecision.kind !== "one-shot") {
        const granted = applyAllowAlwaysDecision({
          file: next,
          agentId: params.agentId,
          decision: params.allowAlwaysDecision,
        });
        if (granted) {
          next = granted;
          changed = true;
        }
      }
      return (
        applyRecordedAllowlistMetadata({
          ...params,
          file: next,
        }) ?? (changed ? next : null)
      );
    },
  });
}
function applyAllowlistEntryUpdate(params) {
  const target = params.agentId ?? "main";
  const agents = params.file.agents ?? {};
  const existing = agents[target] ?? {};
  const allowlist = Array.isArray(existing.allowlist) ? existing.allowlist : [];
  const trimmed = params.pattern.trim();
  if (!trimmed) return null;
  const argPattern = params.options?.argPattern === "" ? void 0 : params.options?.argPattern;
  const existingEntry = allowlist.find(
    (entry) => entry.pattern === trimmed && (entry.argPattern ?? void 0) === argPattern,
  );
  if (existingEntry && (!params.options?.source || existingEntry.source === params.options.source))
    return null;
  const now = Date.now();
  const nextAllowlist = existingEntry
    ? allowlist.map((entry) =>
        entry.pattern === trimmed && (entry.argPattern ?? void 0) === argPattern
          ? {
              ...entry,
              argPattern,
              source: params.options?.source ?? entry.source,
              lastUsedAt: now,
            }
          : entry,
      )
    : [
        ...allowlist,
        {
          id: crypto.randomUUID(),
          pattern: trimmed,
          argPattern,
          source: params.options?.source,
          lastUsedAt: now,
        },
      ];
  return {
    ...params.file,
    agents: {
      ...agents,
      [target]: {
        ...existing,
        allowlist: nextAllowlist,
      },
    },
  };
}
function addAllowlistEntry(approvals, agentId, pattern, options) {
  const snapshot = updateExecApprovalsSync({
    update: (file) =>
      applyAllowlistEntryUpdate({
        file,
        agentId,
        pattern,
        options,
      }),
  });
  if (snapshot) replaceExecApprovalsSnapshot(approvals, snapshot.file);
}
function addDurableCommandApproval(approvals, agentId, commandText) {
  const normalized = commandText.trim();
  if (!normalized) return;
  addAllowlistEntry(approvals, agentId, buildDurableCommandApprovalPattern(normalized), {
    source: "allow-always",
  });
}
function resolveAllowAlwaysPatternCoverage(params) {
  const byKey = /* @__PURE__ */ new Map();
  let representedSegmentCount = 0;
  for (const segment of params.segments) {
    if (isShellWrapperInvocation(segment.argv)) {
      const segmentPatterns = resolveAllowAlwaysPatternEntries({
        segments: [segment],
        cwd: params.cwd,
        env: params.env,
        platform: params.platform,
        strictInlineEval: params.strictInlineEval,
      });
      for (const pattern of segmentPatterns)
        byKey.set(`${pattern.pattern}\x00${pattern.argPattern ?? ""}`, pattern);
      continue;
    }
    const segmentPatterns = resolveAllowAlwaysPatternEntries({
      segments: [segment],
      cwd: params.cwd,
      env: params.env,
      platform: params.platform,
      strictInlineEval: params.strictInlineEval,
    });
    if (segmentPatterns.length === 0) continue;
    representedSegmentCount += 1;
    for (const pattern of segmentPatterns)
      byKey.set(`${pattern.pattern}\x00${pattern.argPattern ?? ""}`, pattern);
  }
  return {
    complete: params.segments.length > 0 && representedSegmentCount === params.segments.length,
    patterns: [...byKey.values()],
  };
}
function persistAllowAlwaysPatterns(params) {
  const coverage = resolveAllowAlwaysPatternCoverage(params);
  const commandText = params.commandText?.trim();
  persistAllowAlwaysDecision({
    approvals: params.approvals,
    agentId: params.agentId,
    decision: {
      kind: "patterns",
      patterns: coverage.patterns,
      ...(commandText && coverage.complete && coverage.patterns.length > 0 ? { commandText } : {}),
    },
  });
  return coverage.patterns;
}
function hasRuntimeShellPayload(argv) {
  const inlineCommand = extractBindableShellWrapperInlineCommand([...argv]);
  return Boolean(
    inlineCommand &&
    (/(?:\$[A-Za-z0-9_@*?#$!-]|\$\{|`|\$\()/u.test(inlineCommand) ||
      hasPosixInteractiveStartupBeforeInlineCommand(argv, POSIX_INLINE_COMMAND_FLAGS) ||
      hasPosixLoginStartupBeforeInlineCommand(argv, POSIX_INLINE_COMMAND_FLAGS)),
  );
}
function resolvePlanPersistenceState(plan) {
  if (!plan)
    return {
      reusablePatternsAllowed: true,
      reasons: [],
    };
  if (!plan.ok)
    return {
      reusablePatternsAllowed: false,
      reasons: ["unplanned"],
    };
  const reasons = /* @__PURE__ */ new Set();
  let reusablePatternsAllowed = true;
  const candidates = plan.groups.flatMap((group) => group.candidates);
  for (const candidate of candidates) {
    if (candidate.trustMode === "prompt-only") reasons.add("prompt-only");
    if (candidate.trustMode === "exact-command") reasons.add("no-reusable-pattern");
    if (candidate.trustMode === "executable" && !candidate.allowAlways)
      reasons.add("no-reusable-pattern");
    reusablePatternsAllowed = reusablePatternsAllowed && candidate.allowAlways;
    if (hasRuntimeShellPayload(candidate.sourceSegment.argv)) reasons.add("runtime-payload");
    if (
      candidate.transport.kind === "shell-wrapper" &&
      hasRuntimeShellPayload(candidate.transport.wrapperArgv)
    )
      reasons.add("runtime-payload");
  }
  return {
    reusablePatternsAllowed,
    reasons: [...reasons],
  };
}
function resolveAllowAlwaysPersistenceDecision(params) {
  const planPersistence = resolvePlanPersistenceState(params.authorizationPlan);
  const reasons = new Set(planPersistence.reasons);
  if (params.runtimePayload === true) reasons.add("runtime-payload");
  const commandText = params.commandText?.trim();
  const hardReasons = [...reasons].filter((reason) => reason !== "no-reusable-pattern");
  if (hardReasons.length > 0)
    return {
      kind: "one-shot",
      reasons: hardReasons,
    };
  if (params.preparedCoverage?.complete === true && params.preparedCoverage.patterns.length > 0)
    return {
      kind: "patterns",
      patterns: params.preparedCoverage.patterns,
      ...(commandText ? { commandText } : {}),
    };
  if (planPersistence.reusablePatternsAllowed) {
    const coverage = resolveAllowAlwaysPatternCoverage({
      segments: params.segments,
      cwd: params.cwd,
      env: params.env,
      platform: params.platform,
      strictInlineEval: params.strictInlineEval,
    });
    if (coverage.patterns.length > 0)
      return {
        kind: "patterns",
        patterns: coverage.patterns,
        ...(commandText && coverage.complete ? { commandText } : {}),
      };
  }
  reasons.add("no-reusable-pattern");
  return {
    kind: "one-shot",
    reasons: [...reasons],
  };
}
function persistAllowAlwaysDecision(params) {
  const decision = params.decision;
  if (decision.kind === "one-shot") return;
  const snapshot = updateExecApprovalsSync({
    update: (file) =>
      applyAllowAlwaysDecision({
        file,
        agentId: params.agentId,
        decision,
      }),
  });
  if (snapshot) replaceExecApprovalsSnapshot(params.approvals, snapshot.file);
}
function applyAllowAlwaysDecision(params) {
  const entries =
    params.decision.kind === "exact-command"
      ? params.decision.commandText.trim()
        ? [
            {
              pattern: buildDurableCommandApprovalPattern(params.decision.commandText.trim()),
              source: "allow-always",
            },
          ]
        : []
      : [
          ...params.decision.patterns.map((pattern) => ({
            pattern: pattern.pattern,
            argPattern: pattern.argPattern,
            source: "allow-always",
          })),
          ...(params.decision.commandText?.trim()
            ? [
                {
                  pattern: buildNodeCommandApprovalPattern(params.decision.commandText.trim()),
                  source: "allow-always",
                },
              ]
            : []),
        ];
  let next = params.file;
  let changed = false;
  for (const entry of entries) {
    const updated = applyAllowlistEntryUpdate({
      file: next,
      agentId: params.agentId,
      pattern: entry.pattern,
      options: {
        argPattern: entry.argPattern,
        source: entry.source,
      },
    });
    if (updated) {
      next = updated;
      changed = true;
    }
  }
  return changed ? next : null;
}
function minSecurity(a, b) {
  const order = {
    deny: 0,
    allowlist: 1,
    full: 2,
  };
  return order[a] <= order[b] ? a : b;
}
function maxAsk(a, b) {
  const order = {
    off: 0,
    "on-miss": 1,
    always: 2,
  };
  return order[a] >= order[b] ? a : b;
}
const DEFAULT_EXEC_APPROVAL_DECISIONS = ["allow-once", "allow-always", "deny"];
const OPTIONAL_EXEC_APPROVAL_DECISIONS = ["allow-always"];
const OPTIONAL_EXEC_APPROVAL_DECISION_SET = new Set(OPTIONAL_EXEC_APPROVAL_DECISIONS);
function isOptionalExecApprovalDecision(decision) {
  return OPTIONAL_EXEC_APPROVAL_DECISION_SET.has(decision);
}
function collectExecApprovalUnavailableDecisionSet(decisions) {
  const unavailable = /* @__PURE__ */ new Set();
  if (!Array.isArray(decisions)) return unavailable;
  for (const decision of decisions)
    if (isOptionalExecApprovalDecision(decision)) unavailable.add(decision);
  return unavailable;
}
function normalizeExecApprovalUnavailableDecisions(decisions) {
  const unavailable = collectExecApprovalUnavailableDecisionSet(decisions);
  return OPTIONAL_EXEC_APPROVAL_DECISIONS.filter((decision) => unavailable.has(decision));
}
function resolveExecApprovalAllowedDecisions(params) {
  if (
    normalizeExecAsk(params?.ask) === "always" ||
    params?.allowAlwaysPersistence?.kind === "one-shot"
  )
    return ["allow-once", "deny"];
  return DEFAULT_EXEC_APPROVAL_DECISIONS;
}
function resolveExecApprovalUnavailableDecisions(params) {
  const allowed = new Set(resolveExecApprovalAllowedDecisions(params));
  return OPTIONAL_EXEC_APPROVAL_DECISIONS.filter((decision) => !allowed.has(decision));
}
function resolveExecApprovalRequestAllowedDecisions(params) {
  const policyDecisions = resolveExecApprovalAllowedDecisions({ ask: params?.ask });
  const unavailableDecisions = collectExecApprovalUnavailableDecisionSet(
    params?.unavailableDecisions,
  );
  if (unavailableDecisions.size === 0) return policyDecisions;
  return policyDecisions.filter(
    (decision) => !isOptionalExecApprovalDecision(decision) || !unavailableDecisions.has(decision),
  );
}
function isExecApprovalDecisionAllowed(params) {
  return resolveExecApprovalAllowedDecisions({ ask: params.ask }).includes(params.decision);
}
async function requestExecApprovalViaSocket(params) {
  const { socketPath, token, request } = params;
  if (!socketPath || !token) return null;
  const timeoutMs = params.timeoutMs ?? 15e3;
  return await requestJsonlSocket({
    socketPath,
    requestLine: JSON.stringify({
      type: "request",
      token,
      id: crypto.randomUUID(),
      request,
    }),
    timeoutMs,
    accept: (value) => {
      const msg = value;
      if (msg?.type === "decision" && msg.decision) return msg.decision;
    },
  });
}
//#endregion
export {
  resolveExecPolicyForMode as $,
  persistAllowAlwaysDecision as A,
  resolveDurableExecApprovalRequirement as B,
  normalizeExecApprovalUnavailableDecisions as C,
  normalizeExecMode as D,
  normalizeExecHost as E,
  requestExecApprovalViaSocket as F,
  resolveExecApprovalsDisplayPath as G,
  resolveExecApprovalRequestAllowedDecisions as H,
  requireValidExecTarget as I,
  resolveExecApprovalsPath as J,
  resolveExecApprovalsFromFile as K,
  requiresExecApproval as L,
  readExecApprovalsSnapshot as M,
  recordAllowlistMatchesUse as N,
  normalizeExecSecurity as O,
  recordAllowlistUse as P,
  resolveExecModePolicy as Q,
  resolveAllowAlwaysPatternCoverage as R,
  minSecurity as S,
  normalizeExecAsk as T,
  resolveExecApprovalUnavailableDecisions as U,
  resolveExecApprovalAllowedDecisions as V,
  resolveExecApprovals as W,
  resolveExecApprovalsTranscriptPath as X,
  resolveExecApprovalsSocketPath as Y,
  resolveExecModeFromPolicy as Z,
  isExecApprovalPolicySnapshotCurrent as _,
  OPTIONAL_EXEC_APPROVAL_DECISIONS as a,
  maxAsk as b,
  commandRequiresSecurityAuditSuppressionApproval as c,
  ensureExecApprovals as d,
  restoreExecApprovalsSnapshot as et,
  ensureExecApprovalsSnapshot as f,
  isExecApprovalDecisionAllowed as g,
  hasNodeCommandAllowAlwaysMarker as h,
  EXEC_TARGET_VALUES as i,
  requestJsonlSocket as it,
  persistAllowAlwaysPatterns as j,
  normalizeExecTarget as k,
  commitExecAuthorizationLocked as l,
  hasExactCommandDurableExecApproval as m,
  DEFAULT_EXEC_APPROVAL_DECISIONS as n,
  saveExecApprovals as nt,
  addAllowlistEntry as o,
  hasDurableExecApproval as p,
  resolveExecApprovalsLocked as q,
  DEFAULT_EXEC_APPROVAL_TIMEOUT_MS as r,
  updateExecApprovals as rt,
  addDurableCommandApproval as s,
  DEFAULT_EXEC_APPROVAL_ASK_FALLBACK as t,
  restoreExecApprovalsSnapshotLocked as tt,
  createExecApprovalPolicySnapshot as u,
  loadExecApprovals as v,
  normalizeExecApprovals as w,
  mergeExecApprovalsSocketDefaults as x,
  loadExecApprovalsAsync as y,
  resolveAllowAlwaysPersistenceDecision as z,
};
