import { execFileSync } from "node:child_process";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { o as sha256HexPrefix } from "./crypto-digest-CNeb2i19.js";
import { t as requireNodeSqlite } from "./node-sqlite-BJtdZavS.js";
import {
  A as resolvePositiveTimerTimeoutMs,
  M as resolveTimestampMsToIsoString,
  j as resolveTimerTimeoutMs,
} from "./number-coercion-CJQ8TR--.js";
import {
  c as resolveConfigPath,
  d as resolveGatewayLockDir,
  y as resolveStateDir,
} from "./paths-DEklnbzU.js";
import { r as isPidAlive, t as getFileLockProcessStartTime } from "./pid-alive-FK23rkys.js";
import { Rn as string, Tn as object, wn as number, yt as _enum } from "./schemas-CBJjibl3.js";
import { t as isSqliteLockError } from "./sqlite-transaction-DLqNjJHV.js";
import {
  a as readWindowsProcessStartTimeSync,
  c as parseProcCmdline,
  i as readWindowsProcessArgsSync,
  o as isGatewayArgv,
  s as isOpenClawCommandArgv,
} from "./windows-port-pids-ClQ99WdK.js";
import { t as safeParseJsonWithSchema } from "./zod-parse-Bip-sZi_.js";
//#region src/infra/gateway-lock.ts
const DEFAULT_TIMEOUT_MS = 5e3;
const DEFAULT_POLL_INTERVAL_MS = 100;
const DEFAULT_STALE_MS = 3e4;
const LockPayloadSchema = object({
  pid: number(),
  createdAt: string(),
  configPath: string(),
  port: number().int().min(1).max(65535).optional(),
  role: _enum(["gateway", "sqlite-maintenance"]).optional(),
  stateDir: string().optional(),
  startTime: number().optional(),
});
var GatewayLockError = class extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    this.name = "GatewayLockError";
  }
};
function tryAcquireGatewayLockCoordinator(lockPath) {
  const { DatabaseSync } = requireNodeSqlite();
  const coordinatorDb = new DatabaseSync(`${lockPath}.sqlite`);
  try {
    coordinatorDb.exec("PRAGMA busy_timeout = 0; BEGIN EXCLUSIVE;");
  } catch (error) {
    try {
      coordinatorDb.close();
    } catch {}
    if (isSqliteLockError(error)) return null;
    throw error;
  }
  return {
    release: () => {
      let releaseError;
      try {
        coordinatorDb.exec("ROLLBACK");
      } catch (error) {
        releaseError = error;
      }
      try {
        coordinatorDb.close();
      } catch (error) {
        releaseError ??= error;
      }
      if (releaseError)
        throw new GatewayLockError("failed to release gateway lock coordinator", releaseError);
    },
  };
}
function readLinuxCmdline(pid) {
  try {
    return parseProcCmdline(fs.readFileSync(`/proc/${pid}/cmdline`, "utf8"));
  } catch {
    return null;
  }
}
const CMDLINE_EXEC_TIMEOUT_MS = 1e3;
function readWindowsCmdline(pid) {
  return readWindowsProcessArgsSync(pid, CMDLINE_EXEC_TIMEOUT_MS);
}
/**
 * Read the command line of a macOS/BSD process via `ps`.
 *
 * `ps -o command=` outputs an unquoted flat string, so the naive whitespace
 * split will misparse paths containing spaces. This is acceptable because
 * standard macOS install paths do not contain spaces, and when the split
 * does fail the caller falls back to "alive" (conservative).
 */
function readDarwinCmdline(pid) {
  try {
    const line = execFileSync("ps", ["-p", String(pid), "-o", "command="], {
      encoding: "utf8",
      timeout: CMDLINE_EXEC_TIMEOUT_MS,
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (!line) return null;
    return line.split(/\s+/).filter(Boolean);
  } catch {
    return null;
  }
}
function readProcessStartTime(pid, platform) {
  if (platform !== process.platform) return null;
  return platform === "win32"
    ? readWindowsProcessStartTimeSync(pid, CMDLINE_EXEC_TIMEOUT_MS)
    : getFileLockProcessStartTime(pid);
}
function defaultReadProcessCmdline(pid, platform) {
  if (platform === "linux") return readLinuxCmdline(pid);
  if (platform === "win32") return readWindowsCmdline(pid);
  if (platform === "darwin") return readDarwinCmdline(pid);
  return null;
}
async function resolveGatewayOwnerStatus(
  pid,
  payload,
  platform,
  readCmdline,
  readStartTime,
  opts = {},
) {
  const role = payload?.role ?? "gateway";
  if (!isPidAlive(pid)) return "dead";
  const payloadStartTime = payload?.startTime;
  if (Number.isFinite(payloadStartTime)) {
    const currentStartTime = (
      readStartTime ?? ((ownerPid) => readProcessStartTime(ownerPid, platform))
    )(pid);
    if (currentStartTime != null) return currentStartTime === payloadStartTime ? "alive" : "dead";
  }
  const readFn = readCmdline ?? ((p) => defaultReadProcessCmdline(p, platform));
  if (role === "sqlite-maintenance") {
    const args = readFn(pid);
    if (!args) return "unknown";
    return isOpenClawCommandArgv(args, "doctor") ? "alive" : "dead";
  }
  const args = readFn(pid);
  if (!args)
    return platform === "linux" || opts.trustUnknownCmdlineOwner === false ? "unknown" : "alive";
  return isGatewayArgv(args, { allowGatewayBinary: true }) ? "alive" : "dead";
}
async function readLockPayload(lockPath) {
  try {
    const raw = await fs$1.readFile(lockPath, "utf8");
    return safeParseJsonWithSchema(LockPayloadSchema, raw);
  } catch {
    return null;
  }
}
function canonicalizeStateDir(stateDir) {
  const resolved = path.resolve(stateDir);
  try {
    return fs.realpathSync.native(resolved);
  } catch {
    const missingSegments = [];
    let current = resolved;
    while (true) {
      const parent = path.dirname(current);
      if (parent === current) return resolved;
      missingSegments.push(path.basename(current));
      current = parent;
      try {
        return path.join(fs.realpathSync.native(current), ...missingSegments.toReversed());
      } catch {}
    }
  }
}
function resolveGatewayLockPaths(env, lockDir = resolveGatewayLockDir()) {
  const resolvedStateDir = resolveStateDir(env);
  const stateDir = canonicalizeStateDir(resolvedStateDir);
  const configPath = resolveConfigPath(env, resolvedStateDir);
  const configHash = sha256HexPrefix(configPath, 8);
  const stateHash = sha256HexPrefix(stateDir, 8);
  return {
    configLockPath: path.join(lockDir, `gateway.${configHash}.lock`),
    configPath,
    stateDir,
    stateLockPath: path.join(lockDir, `gateway.state.${stateHash}.lock`),
  };
}
async function readActiveGatewayLockPort(opts = {}) {
  const { configLockPath, stateLockPath } = resolveGatewayLockPaths(
    opts.env ?? process.env,
    opts.lockDir,
  );
  return (
    (await readVerifiedGatewayLockPort(configLockPath, opts)) ??
    (await readVerifiedGatewayLockPort(stateLockPath, opts))
  );
}
async function readVerifiedGatewayLockPort(lockPath, opts) {
  const payload = await readLockPayload(lockPath);
  if (!payload?.port || payload.role === "sqlite-maintenance") return;
  return (await resolveGatewayOwnerStatus(
    payload.pid,
    payload,
    opts.platform ?? process.platform,
    opts.readProcessCmdline,
    opts.readProcessStartTime,
    { trustUnknownCmdlineOwner: false },
  )) === "alive"
    ? payload.port
    : void 0;
}
async function acquireGatewayLock(opts = {}) {
  const env = opts.env ?? process.env;
  if (!(opts.allowInTests === true) && (env.VITEST || env.NODE_ENV === "test")) return null;
  const role = opts.role ?? "gateway";
  const paths = resolveGatewayLockPaths(env, opts.lockDir);
  const stateLock = await acquireLockFile({
    ...opts,
    configPath: paths.configPath,
    env,
    lockPath: paths.stateLockPath,
    role,
    stateDir: paths.stateDir,
  });
  if (!(role === "sqlite-maintenance" || env.OPENCLAW_ALLOW_MULTI_GATEWAY !== "1"))
    return {
      ...stateLock,
      stateLockPath: stateLock.lockPath,
    };
  try {
    const configLock = await acquireLockFile({
      ...opts,
      configPath: paths.configPath,
      env,
      lockPath: paths.configLockPath,
      role,
      stateDir: paths.stateDir,
    });
    return {
      ...configLock,
      stateLockPath: stateLock.lockPath,
      release: async () => {
        let releaseError;
        try {
          await configLock.release();
        } catch (error) {
          releaseError =
            error instanceof Error
              ? error
              : new GatewayLockError("failed to release config lock", error);
        }
        try {
          await stateLock.release();
        } catch (error) {
          releaseError ??=
            error instanceof Error
              ? error
              : new GatewayLockError("failed to release state lock", error);
        }
        if (releaseError) throw releaseError;
      },
    };
  } catch (error) {
    await stateLock.release().catch(() => void 0);
    throw error;
  }
}
async function acquireLockFile(opts) {
  const timeoutMs = resolveTimerTimeoutMs(opts.timeoutMs, DEFAULT_TIMEOUT_MS, 0);
  const pollIntervalMs = resolvePositiveTimerTimeoutMs(
    opts.pollIntervalMs,
    DEFAULT_POLL_INTERVAL_MS,
  );
  const staleMs = resolveTimerTimeoutMs(opts.staleMs, DEFAULT_STALE_MS, 0);
  const platform = opts.platform ?? process.platform;
  const port = opts.port;
  const role = opts.role;
  const now = opts.now ?? Date.now;
  const sleep =
    opts.sleep ??
    (async (ms) =>
      await new Promise((resolve) => {
        setTimeout(resolve, ms);
      }));
  const { configPath, lockPath, stateDir } = opts;
  await fs$1.mkdir(path.dirname(lockPath), { recursive: true });
  const startedAt = now();
  let lastPayload = null;
  while (now() - startedAt < timeoutMs) {
    let coordinator;
    try {
      coordinator = tryAcquireGatewayLockCoordinator(lockPath);
    } catch (error) {
      throw new GatewayLockError(`failed to acquire gateway lock at ${lockPath}`, error);
    }
    if (!coordinator) lastPayload = await readLockPayload(lockPath);
    else {
      let handle;
      let acquisitionError;
      let waitForOwner = false;
      try {
        while (!handle && !waitForOwner) {
          let candidateHandle;
          try {
            candidateHandle = await fs$1.open(lockPath, "wx");
          } catch (error) {
            if (error.code !== "EEXIST") throw error;
            lastPayload = await readLockPayload(lockPath);
            const ownerPid = lastPayload?.pid;
            const ownerStatus = ownerPid
              ? await resolveGatewayOwnerStatus(
                  ownerPid,
                  lastPayload,
                  platform,
                  opts.readProcessCmdline,
                  opts.readProcessStartTime,
                )
              : "unknown";
            if (ownerStatus === "dead" && ownerPid) {
              await fs$1.rm(lockPath, { force: true });
              continue;
            }
            if (ownerStatus !== "alive") {
              let stale = false;
              if (lastPayload?.createdAt) {
                const createdAt = Date.parse(lastPayload.createdAt);
                stale = Number.isFinite(createdAt) ? now() - createdAt > staleMs : false;
              }
              if (!stale)
                try {
                  const st = await fs$1.stat(lockPath);
                  stale = now() - st.mtimeMs > staleMs;
                } catch {
                  stale = false;
                }
              if (stale) {
                await fs$1.rm(lockPath, { force: true });
                continue;
              }
            }
            waitForOwner = true;
            continue;
          }
          try {
            const startTime = (
              opts.readProcessStartTime ?? ((pid) => readProcessStartTime(pid, platform))
            )(process.pid);
            const payload = {
              pid: process.pid,
              createdAt: resolveTimestampMsToIsoString(now()),
              configPath,
              stateDir,
            };
            if (typeof port === "number" && Number.isInteger(port) && port > 0 && port <= 65535)
              payload.port = port;
            if (role !== "gateway") payload.role = role;
            if (typeof startTime === "number" && Number.isFinite(startTime))
              payload.startTime = startTime;
            await candidateHandle.writeFile(JSON.stringify(payload), "utf8");
            handle = candidateHandle;
          } catch (error) {
            await candidateHandle.close().catch(() => void 0);
            await fs$1.rm(lockPath, { force: true }).catch(() => void 0);
            throw error;
          }
        }
      } catch (error) {
        acquisitionError = error;
      }
      if (handle)
        return {
          lockPath,
          configPath,
          release: async () => {
            let releaseError;
            try {
              await handle.close();
            } catch (error) {
              releaseError = error;
            }
            try {
              await fs$1.rm(lockPath, { force: true });
            } catch (error) {
              releaseError ??= error;
            }
            try {
              coordinator.release();
            } catch (error) {
              releaseError ??= error;
            }
            if (releaseError)
              throw new GatewayLockError(
                `failed to release gateway lock at ${lockPath}`,
                releaseError,
              );
          },
        };
      try {
        coordinator.release();
      } catch (error) {
        acquisitionError ??= error;
      }
      if (acquisitionError)
        throw new GatewayLockError(
          `failed to acquire gateway lock at ${lockPath}`,
          acquisitionError,
        );
    }
    const remainingMs = timeoutMs - (now() - startedAt);
    if (remainingMs <= 0) break;
    await sleep(Math.min(pollIntervalMs, remainingMs));
  }
  throw new GatewayLockError(
    `gateway already running${lastPayload?.pid ? ` (pid ${lastPayload.pid})` : ""}; lock timeout after ${timeoutMs}ms`,
  );
}
//#endregion
export { acquireGatewayLock as n, readActiveGatewayLockPort as r, GatewayLockError as t };
